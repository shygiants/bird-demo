import React, { useRef, useEffect } from 'react';

import src from '../assets/sample.jpg';

export default function Canvas({ width, height, imgFile, onLoad }) {
    const canvasRef = useRef();

    useEffect(() => {
        const image = new Image();
        image.onload = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            ctx.drawImage(image, 0, 0, width, height);
            const imageData = ctx.getImageData(
                0,
                0,
                ctx.canvas.width,
                ctx.canvas.height
            );
            onLoad(imageData);
        };

        if (imgFile?.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = ({ target: { result } }) => {
                image.src = result;
            };
            reader.readAsDataURL(imgFile);
        } else {
            image.src = src;
        }
    }, [imgFile]);

    return <canvas ref={canvasRef} width={width} height={height} />;
}
