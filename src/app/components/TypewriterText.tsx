import React, { useState, useEffect, FC } from "react";

interface TypewriterTextProps {
  text: string;
  delay?: number;
}

const TypewriterText: FC<TypewriterTextProps> = ({ text, delay = 30 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

  return <span>{displayedText}</span>;
};

export default TypewriterText;
