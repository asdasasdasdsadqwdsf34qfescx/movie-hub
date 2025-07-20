import React, { FC } from "react";
import TypewriterText from "./TypewriterText";

const Header: FC = () => (
  <>
    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-pink-400 drop-shadow-2xl select-none">
      Movie Hub
      <span className="ml-2 text-4xl align-top animate-bounce">🎬</span>
    </h1>
    <div className="text-lg sm:text-xl text-gray-300 max-w-md">
      <TypewriterText text="Your ultimate destination for movie collections" delay={50} />
    </div>
  </>
);

export default Header;
