import React, { useState } from 'react';
import { Container, Center, Heading, Flex } from '@chakra-ui/react';

import Canvas from './components/Canvas';
import FileInput from './components/FileInput';
import ClassificationResults from './components/ClassificationResults';
import { preprocess } from './utils/image';
import { classify } from './utils/inference';

function App() {
    const [imgFile, setImgFile] = useState();
    const [results, setResults] = useState();

    function onFileSelect(file) {
        setImgFile(file);
    }

    function onLoadImgFile(imgData) {
        const imgTensor = preprocess(imgData);
        classify(imgTensor, 5).then(setResults).catch(console.error);
    }

    return (
        <Container>
            <Flex my="12" direction="column" gap="8">
                <Center>
                    <Heading>이 새는 어떤 새?</Heading>
                </Center>

                <Center>
                    <Canvas
                        width={224}
                        height={224}
                        imgFile={imgFile}
                        onLoad={onLoadImgFile}
                    />
                </Center>
                <Center>
                    <FileInput onFileSelect={onFileSelect} />
                </Center>
                <ClassificationResults results={results} />
            </Flex>
        </Container>
    );
}

export default App;
