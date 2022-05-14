import * as ort from 'onnxruntime-web';
import ndarray from 'ndarray';
import ops from 'ndarray-ops';
import _ from 'lodash';

import mobilenet from '../assets/model.onnx';
import bird from '../assets/birdsLatinNames.csv';

function getClassNames(idx) {
    const lines = bird.split('\n');

    const [className, latinName] = lines[idx + 1].split(',').slice(1);

    return { className, latinName };
}

export async function predict(data) {
    try {
        const session = await ort.InferenceSession.create(mobilenet);
        const results = await session.run({ input: data });
        const logits = results.output.data;

        return logits;
    } catch (e) {
        throw new Error(`Failed to inference ONNX model: ${e}.`);
    }
}

function softmax(arr) {
    const dst = ndarray(new Float32Array(arr.size));
    ops.exp(dst, arr);
    const sum = ops.sum(dst);
    ops.divseq(dst, sum);
    return dst;
}

export async function classify(data, k = 1) {
    const logits = await predict(data);
    const logitArr = ndarray(logits);
    const confidence = softmax(logitArr);

    const classes = _.range(k).map(() => {
        const argmax = Number(ops.argmax(confidence));
        const val = confidence.data[argmax];
        const { className, latinName } = getClassNames(argmax);

        ops.assigns(confidence.pick(argmax), -Infinity);

        return { className, latinName, confidence: val };
    });

    return classes;
}
