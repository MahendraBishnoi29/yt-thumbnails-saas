"use client";

import { default as NextImage } from "next/image";
import Dropzone from "./dropzone";
import TemplateImage from "./template-image";
import { useEffect, useRef, useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import { Button } from "./ui/button";
import { IoMdArrowBack } from "react-icons/io";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { domine, inter } from "~/app/fonts";

const presets = {
  style1: {
    fontSize: 100,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 1)",
    opacity: 1,
  },
  style2: {
    fontSize: 100,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 1)",
    opacity: 1,
  },
  style3: {
    fontSize: 100,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.8)",
    opacity: 0.8,
  },
};

const ThumbnailCreator = ({}) => {
  const [text, setText] = useState("POV");
  const [selectedStyle, setSelectedStyle] = useState("style1");
  const [loading, setLoading] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | null>("");
  const [canvasReady, setCanvasReady] = useState<boolean>(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>("");
  const [font, setFont] = useState("arial");

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

      let preset = presets.style1;
      switch (selectedStyle) {
        case "style2":
          preset = presets.style2;
          break;
        case "style3":
          preset = presets.style3;
          break;
      }

      ctx.save();

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let fontSize = 100;
      let selectFont = "arial";

      switch (font) {
        case "inter":
          selectFont = inter.style.fontFamily;
          break;
        case "domine":
          selectFont = domine.style.fontFamily;
          break;
      }

      ctx.font = `${preset.fontWeight} ${fontSize}px ${selectFont}`;
      const textWidth = ctx.measureText(text).width;
      const targetWidth = canvas.width * 0.9;

      fontSize *= targetWidth / textWidth;
      ctx.font = `${preset.fontWeight} ${fontSize}px ${selectFont}`;
      ctx.fillStyle = preset.color;
      ctx.globalAlpha = preset.opacity;

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

  const handleDownload = async () => {
    if (canvasRef?.current) {
      const link = document.createElement("a");
      link.download = "image/png";
      link.href = canvasRef?.current?.toDataURL();
      link.click();
    }
  };

  return (
    <>
      {imageSrc ? (
        <>
          {loading ? (
            <div className="flex h-screen items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-dashed border-gray-800"></div>
            </div>
          ) : (
            <div className="flex w-full max-w-2xl flex-col items-center gap-5">
              <div className="my-4 flex w-full flex-col items-center gap-3">
                <button
                  onClick={() => {
                    setImageSrc(null);
                    setProcessedImageUrl(null);
                    setCanvasReady(false);
                  }}
                  className="flex items-center gap-2 self-start"
                >
                  <IoMdArrowBack className="h-4 w-4" />
                  <p className="leading-7">Go Back</p>
                </button>
                <canvas
                  ref={canvasRef}
                  className="max-h-lg h-auto w-full max-w-lg rounded-lg"
                ></canvas>
              </div>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle> Edit </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="text">Text</Label>
                      <Input
                        id="text"
                        placeholder="text in the thumbnail"
                        className="h-10 px-3 py-2"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="font">Font</Label>
                      <Select
                        value={font}
                        onValueChange={(value) => setFont(value)}
                      >
                        <SelectTrigger id="font" className="h-10">
                          <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectGroup>
                            <SelectLabel>Fonts</SelectLabel>
                            <SelectItem value="arial">Arial</SelectItem>
                            <SelectItem value="inter">Inter</SelectItem>
                            <SelectItem value="domine">Domine</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap justify-between gap-2">
                  <Button onClick={() => handleDownload()}>Download</Button>
                  <Button onClick={drawCompositeImage}>Update</Button>
                </CardFooter>
              </Card>
            </div>
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
                setSelectedStyle("style1");
              }}
              isSelected={selectedStyle === "style1"}
            />
            <TemplateImage
              image="/style2.png"
              selectStyle={() => {
                setSelectedStyle("style2");
              }}
              isSelected={selectedStyle === "style2"}
            />
            <TemplateImage
              image="/style3.png"
              selectStyle={() => {
                setSelectedStyle("style3");
              }}
              isSelected={selectedStyle === "style3"}
            />
          </div>
          <Dropzone setSelectedImage={setSelectedImage} />
        </div>
      )}
    </>
  );
};

export default ThumbnailCreator;
