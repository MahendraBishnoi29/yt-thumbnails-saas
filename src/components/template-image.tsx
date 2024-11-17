"use client";

import Image from "next/image";
import { useState } from "react";

interface TemplateImage {
  image: string;
  selectStyle: () => void;
  isSelected: boolean;
}

const TemplateImage: React.FC<TemplateImage> = ({
  image,
  selectStyle,
  isSelected,
}) => {
  const [mouseOver, setMouseOver] = useState<boolean>(false);

  return (
    <div
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      onClick={selectStyle}
      className="relative w-fit cursor-pointer transition-all hover:scale-105"
    >
      {(mouseOver || isSelected) && (
        <>
          <div className="absolute -right-6 -top-4 h-4 w-4 -rotate-45 border-t border-black"></div>
          <div className="absolute -right-3 -top-6 h-4 w-4 rotate-[-75deg] border-t border-black"></div>
          <div className="absolute -right-7 -top-0 h-4 w-4 rotate-[-20deg] border-t border-black"></div>

          <div className="absolute -bottom-6 -left-4 h-4 w-4 -rotate-45 border-t border-black"></div>
          <div className="absolute -bottom-3 -left-6 h-4 w-4 rotate-[-20deg] border-t border-black"></div>
          <div className="absolute -bottom-7 -left-0 h-4 w-4 rotate-[-75deg] border-t border-black"></div>
        </>
      )}
      <Image
        src={image}
        className="w-full rounded-lg md:min-w-52"
        alt="thumbnail-image"
        width={1000}
        height={500}
      />
    </div>
  );
};

export default TemplateImage;
