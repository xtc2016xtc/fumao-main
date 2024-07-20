import React, { useRef, useEffect, useState } from 'react';
//@ts-ignore
const CanvasComponent = ({ imageUrl }) => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null); // 使用 useRef 保存图像加载状态
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    //@ts-ignore
    const ctx = canvas.getContext('2d');

    const loadImage = async () => {
      const img = new Image();
      img.src = imageUrl;
      img.crossOrigin = 'Anonymous'; // 确保图片可以跨域加载
      img.onload = () => {
        console.log(img);

        const paperWidth = 240;
        const mw = paperWidth % 8;
        const w = mw === 0 ? paperWidth : paperWidth - mw;
        const h = Math.floor((img.height * w) / img.width);

        setCanvasWidth(w);
        setCanvasHeight(h);
//@ts-ignore
        canvas.width = w;
        //@ts-ignore
        canvas.height = h;

        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.clearRect(0, 0, w, h);
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        //@ts-ignore
        imgRef.current = img; // 保存图像加载状态
        console.log('Image drawn on canvas');
      };

      img.onerror = (error) => {
        console.error('Error loading image:', error);
      };
    };

    // 如果图像尚未加载，则加载图像
    if (!imgRef.current) {
      loadImage();
    } else {
      // 图像已加载，直接绘制
      const img = imgRef.current;
      const paperWidth = 240;
      const mw = paperWidth % 8;
      const w = mw === 0 ? paperWidth : paperWidth - mw;
      //@ts-ignore
      const h = Math.floor((img.height * w) / img.width);
      //@ts-ignore
      canvas.width = w;
      //@ts-ignore
      canvas.height = h;

      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.clearRect(0, 0, w, h);
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
    }
  }, [imageUrl]);

  return <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight}></canvas>;
};

export default CanvasComponent;