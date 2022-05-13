import ndarray from 'ndarray';
import ops from 'ndarray-ops';
import * as ort from 'onnxruntime-web';

export function preprocess({ data, width, height }) {
    const imgDataShape = [height, width, 4];
    const torchTensorShape = [1, 3, height, width];

    let imgArr = ndarray(Float32Array.from(data), imgDataShape);

    const dstArr = ndarray(
        new Float32Array(width * height * 3),
        torchTensorShape
    );

    ops.assign(dstArr.pick(0, 0, null, null), imgArr.pick(null, null, 0));
    ops.assign(dstArr.pick(0, 1, null, null), imgArr.pick(null, null, 1));
    ops.assign(dstArr.pick(0, 2, null, null), imgArr.pick(null, null, 2));

    ops.divseq(dstArr, 255.0);

    return new ort.Tensor('float32', dstArr.data, torchTensorShape);
}
