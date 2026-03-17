"use client";

import { CSSProperties, ReactNode } from "react";

interface AuroraTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
}

export function AuroraText({
  children,
  className = "",
  colors = ["#FBBF24", "#F59E0B", "#FCD34D", "#EF4444", "#F97316"],
  speed = 3,
}: AuroraTextProps) {
  const gradient = `linear-gradient(135deg, ${colors.join(", ")}, ${colors[0]})`;

  return (
    <span
      className={`relative inline-block ${className}`}
      style={
        {
          background: gradient,
          backgroundSize: "300% 300%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: `aurora-shift ${speed}s ease infinite`,
        } as CSSProperties
      }
    >
      {children}
    </span>
  );
}
