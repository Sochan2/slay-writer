"use client";

import { ReactNode } from "react";

interface AnimatedShinyTextProps {
  children: ReactNode;
  className?: string;
  shimmerWidth?: number;
}

export function AnimatedShinyText({
  children,
  className = "",
  shimmerWidth = 100,
}: AnimatedShinyTextProps) {
  return (
    <span
      className={`relative inline-block overflow-hidden ${className}`}
      style={
        {
          "--shimmer-width": `${shimmerWidth}px`,
        } as React.CSSProperties
      }
    >
      {/* Base text */}
      <span className="relative">{children}</span>
      {/* Shiny overlay */}
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)`,
          backgroundSize: `${shimmerWidth * 3}px 100%`,
          animation: "shiny-text 2.5s linear infinite",
        }}
      />
    </span>
  );
}
