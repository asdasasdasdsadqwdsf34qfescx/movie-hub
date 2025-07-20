import React, { FC } from "react";
import Image from "next/image";
import AnimatedParticles from "./AnimatedParticles";

const Background: FC = () => (
  <div className="absolute inset-0 -z-10">
    <Image
      src="/bg.webp"
      alt="Cinematic background"
      fill
      priority
      quality={100}
      className="object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30" />
    <AnimatedParticles />
  </div>
);

export default Background;
