import React, { useEffect, useState, CSSProperties, FC } from "react";

interface AnimatedParticlesProps {
  count?: number;
}

const AnimatedParticles: FC<AnimatedParticlesProps> = ({ count = 15 }) => {
  const [particleStyles, setParticleStyles] = useState<CSSProperties[]>([]);

  useEffect(() => {
    setParticleStyles(
      Array.from({ length: count }, () => ({
        width: `${Math.random() * 4 + 1}px`,
        height: `${Math.random() * 4 + 1}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animation: `float ${Math.random() * 10 + 10}s linear infinite`,
        animationDelay: `${Math.random() * 5}s`,
        position: 'absolute',
        borderRadius: '9999px',
        background: 'rgba(255,255,255,0.1)',
      }))
    );
  }, [count]);

  return (
    <>
      {particleStyles.map((style, i) => (
        <div key={i} className="absolute rounded-full bg-white/10" style={style} />
      ))}
    </>
  );
};

export default AnimatedParticles;
