"use client";

import { default as NextImage } from "next/image";
import Dropzone from "./dropzone";
import TemplateImage from "./template-image";
import { useEffect, useRef, useState } from "react";
import { removeBackground } from "@imgly/background-removal";

const ThumbnailCreator = ({}) => {
  const [text, setText] = useState("POV");
  const [style, setStyle] = useState("style1");
  const [loading, setLoading] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | null>("");
  const [canvasReady, setCanvasReady] = useState<boolean>(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>("");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const setSelectedImage = async (file?: File) => {
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const src = e.target?.result as string;
        setImageSrc(src);

        const blob = await removeBackground(src);
        const processedSrc = URL.createObjectURL(blob);
        setProcessedImageUrl(processedSrc);
        setCanvasReady(true);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (canvasReady) {
      drawCompositeImage();
    }
  }, [canvasReady]);

  const drawCompositeImage = () => {
    if (!canvasRef?.current || !canvasReady || !imageSrc || !processedImageUrl)
      return;

    const canvas = canvasRef?.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const image = new Image();

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      ctx.save();

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let fontSize = 100;
      let selectFont = "Arial";

      ctx.font = `${"bold"} ${fontSize}px ${selectFont}`;
      const textWidth = ctx.measureText(text).width;
      const targetWidth = canvas.width * 0.9;

      fontSize *= targetWidth / textWidth;
      ctx.font = `${"bold"} ${fontSize}px ${selectFont}`;
      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      ctx.globalAlpha = 1;

      const x = canvas.width / 2;
      const y = canvas.height / 2;

      ctx.translate(x, y);
      ctx.fillText(text, 0, 0);
      ctx.restore();

      const fgImage = new Image();
      fgImage.onload = () => {
        ctx.drawImage(fgImage, 0, 0, canvas.width, canvas.height);
      };
      fgImage.src = processedImageUrl;
    };

    image.src = imageSrc;
  };

  return (
    <>
      {imageSrc ? (
        <>
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-dashed border-gray-800"></div>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              className="max-h-lg h-auto w-full max-w-lg rounded-lg"
            ></canvas>
          )}
        </>
      ) : (
        <div className="mt-10 flex flex-col">
          <h1 className="flex items-center gap-3 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Hi There
            <span className="motion-scale-in-[0.5] motion-translate-x-in-[-149%] motion-translate-y-in-[-86%] motion-rotate-in-[-1080deg] motion-blur-in-[5px] motion-opacity-in-[33%] motion-duration-[0.20s]/blur motion-duration-[0.50s]/opacity motion-duration-[1.00s] motion-duration-[1.60s]/rotate motion-delay-[0.50s]/scale motion-delay-[0.80s]/blur motion-ease-spring-bouncier">
              <NextImage
                height={40}
                width={40}
                alt="waving-hand-png"
                src="/waving-hand.png"
              />
            </span>
          </h1>
          <h3 className="text-4xl font-extrabold capitalize tracking-tight lg:text-5xl">
            want to create a thumbnail?
          </h3>
          <p className="mt-2 leading-7 text-muted-foreground">
            Use one of the templates below to create a thumbnail
          </p>
          <div className="mt-10 flex flex-col items-center justify-between gap-10 md:flex-row md:items-start">
            <TemplateImage
              image="/style1.png"
              selectStyle={() => {
                setStyle("style1");
              }}
              isSelected={style === "style1"}
            />
            <TemplateImage
              image="/style1.png"
              selectStyle={() => {
                setStyle("style2");
              }}
              isSelected={style === "style2"}
            />
            <TemplateImage
              image="/style1.png"
              selectStyle={() => {
                setStyle("style3");
              }}
              isSelected={style === "style3"}
            />
          </div>
          <Dropzone setSelectedImage={setSelectedImage} />
        </div>
      )}
    </>
  );
};

export default ThumbnailCreator;
