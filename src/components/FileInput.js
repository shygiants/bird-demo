import React, { useRef } from 'react';

import { Button } from '@chakra-ui/react';

export default function FileInput({ onFileSelect }) {
    const inputRef = useRef();

    function onClick() {
        inputRef.current.click();
    }

    function onChange({ target: { files } }) {
        const file = files[0];
        onFileSelect(file);
    }

    return (
        <div>
            <Button size="lg" onClick={onClick}>
                이미지 선택
            </Button>
            <input
                ref={inputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={onChange}
            />
        </div>
    );
}
