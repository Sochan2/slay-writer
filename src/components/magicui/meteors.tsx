"use client";

import { useEffect, useState } from "react";

interface MeteorStyle {
  top: string;
  left: string;
  animationDelay: string;
  animationDuration: string;
}

export function Meteors({ number = 15 }: { number?: number }) {
  const [styles, setStyles] = useState<MeteorStyle[]>([]);

  useEffect(() => {
    setStyles(
      Array.from({ length: number }, () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 8}s`,
        animationDuration: `${4 + Math.random() * 6}s`,
      }))
    );
  }, [number]);

  return (
    <>
      {styles.map((style, i) => (
        <span
          key={i}
          className="absolute h-0.5 w-0.5 rotate-[215deg] rounded-full bg-amber-400/50"
          style={{
            ...style,
            animation: `meteor ${style.animationDuration} ${style.animationDelay} linear infinite`,
          }}
        >
          <div className="absolute top-1/2 -z-10 h-px w-[60px] -translate-y-1/2 bg-gradient-to-r from-amber-400/50 to-transparent" />
        </span>
      ))}
    </>
  );
}
