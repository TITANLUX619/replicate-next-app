'use client';

import React, { useRef, useState, useEffect, MouseEvent, ChangeEvent } from 'react';
import { Button } from './ui/button';
import useToast from '@/hooks/useToast';
import { useUploadThing } from '@/lib/uploadthing';
import useFileUpload from '@/hooks/useFileUpload';

function extractIdFromUrl(url: string): string | null {
  const match = url.match(/\/([^\/]+)\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

const MaskGenerator = ({ imageUrl, onMaskComplete }: { imageUrl: string, onMaskComplete: (maskData: string) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [maskCtx, setMaskCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [brushSize, setBrushSize] = useState(10); // Tamaño inicial del pincel
  const { uploadFile } = useFileUpload();

  useEffect(() => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (canvas && maskCanvas) {
      const context = canvas.getContext('2d');
      const maskContext = maskCanvas.getContext('2d');

      if (context && maskContext) {
        setCtx(context);
        setMaskCtx(maskContext);

        const image = new Image();
        image.crossOrigin = "anonymous"; // Habilita CORS
        image.onload = () => {
          if (canvasRef.current && maskCanvasRef.current) {
            // Guardar tamaño de la imagen
            setImageSize({ width: image.width, height: image.height });

            // Ajustar tamaño del canvas al tamaño de la imagen
            canvas.width = image.width;
            canvas.height = image.height;
            maskCanvas.width = image.width;
            maskCanvas.height = image.height;

            // Dibujar la imagen en el canvas visible
            context.drawImage(image, 0, 0, image.width, image.height);

            // Inicializar la máscara en negro
            maskContext.fillStyle = 'black';
            maskContext.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
          }
        };
        image.src = imageUrl;
      }
    }
  }, [imageUrl]);

  const startDrawing = (event: MouseEvent) => {
    if (!ctx || !maskCtx) return;
    setIsDrawing(true);

    // Configurar estilo de dibujo
    ctx.strokeStyle = 'white'; // Blanco para mostrar las áreas dibujadas
    maskCtx.strokeStyle = 'white'; // Blanco para la máscara final
    ctx.lineWidth = brushSize;
    maskCtx.lineWidth = brushSize;
    ctx.lineJoin = 'round';
    maskCtx.lineJoin = 'round';
    ctx.lineCap = 'round';
    maskCtx.lineCap = 'round';

    ctx.beginPath();
    maskCtx.beginPath();

    const rect = canvasRef.current?.getBoundingClientRect();
    const x = ((event.clientX - rect!!.left) / rect!!.width) * imageSize.width;
    const y = ((event.clientY - rect!!.top) / rect!!.height) * imageSize.height;

    ctx.moveTo(x, y);
    maskCtx.moveTo(x, y);
  };

  const draw = (event: MouseEvent) => {
    if (!isDrawing || !ctx || !maskCtx) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    const x = ((event.clientX - rect!!.left) / rect!!.width) * imageSize.width;
    const y = ((event.clientY - rect!!.top) / rect!!.height) * imageSize.height;

    ctx.lineTo(x, y);
    maskCtx.lineTo(x, y);
    ctx.stroke();
    maskCtx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      ctx?.closePath();
      maskCtx?.closePath();
    }
  };


  const saveMask = () => {
    if (maskCanvasRef.current && maskCtx) {
      // Guardar la máscara generada
      maskCanvasRef.current.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `${extractIdFromUrl(imageUrl)}-mask.png`, { type: "image/png" });

          const response = await uploadFile(file) as any;

          onMaskComplete(response[0].url);
        }
      }, "image/png");
    }
  };

  // Maneja el cambio en el tamaño del pincel
  const handleBrushSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setBrushSize(parseInt(event.target.value, 10));
  };

  return (
    <div className='w-full h-full space-y-10'>
      {/* Control para ajustar el tamaño del pincel */}
      <label>
        Brush Size:
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={handleBrushSizeChange}
          style={{ marginLeft: '10px' }}
        />
      </label>

      {/* Canvas visible para el usuario */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{
          width: '100%',
          height: 'auto',
          border: '1px solid black',
          cursor: 'crosshair'
        }}
      />
      {/* Canvas oculto para generar la máscara */}
      <canvas
        ref={maskCanvasRef}
        style={{ display: 'none' }}
      />
      <div className='w-full flex flex-col'>
        <Button className='max-w-fit px-8 self-center' size='sm' onClick={saveMask}>Finish Drawing</Button>
      </div>
    </div>
  );
};

export default MaskGenerator;
