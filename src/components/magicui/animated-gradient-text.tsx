"use client";

import { ReactNode } from "react";

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedGradientText({
  children,
  className = "",
}: AnimatedGradientTextProps) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full border border-amber-800/60 bg-amber-950/40 px-4 py-2 text-sm font-medium backdrop-blur-sm ${className}`}
    >
      <span
        className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent"
        style={{
          backgroundSize: "200% auto",
          animation: "gradient-shift 3s linear infinite",
        }}
      >
        {children}
      </span>
    </div>
  );
}
