import React, { FC } from "react";
import Image from "next/image";
import AnimatedParticles from "./AnimatedParticles";

const Background: FC = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <Image
      src="/bg.webp"
      alt="Cinematic background"
      fill
      priority
      quality={100}
      placeholder="blur"
      blurDataURL="data:image/webp;base64,UklGRhIAAABXRUJQVlA4IAAAAADwAQCdASoIAAUAAUAmJQCdASoIAAQAAgA="
      className="object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30" />
    <AnimatedParticles />
  </div>
);

export default Background;
