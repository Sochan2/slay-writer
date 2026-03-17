"use client";

import { ReactNode, CSSProperties } from "react";

interface ShineBorderProps {
  children: ReactNode;
  className?: string;
  color?: string | string[];
  duration?: number;
  borderWidth?: number;
}

export function ShineBorder({
  children,
  className = "",
  color = ["#FBBF24", "#F59E0B", "#D97706"],
  duration = 8,
  borderWidth = 1.5,
}: ShineBorderProps) {
  const colors = Array.isArray(color) ? color.join(", ") : color;

  return (
    <div
      className={`relative rounded-2xl ${className}`}
      style={{ "--shine-border-width": `${borderWidth}px` } as CSSProperties}
    >
      {/* Animated spinning border */}
      <div
        className="pointer-events-none absolute inset-[-1.5px] rounded-[inherit]"
        style={{
          background: `conic-gradient(from var(--shine-angle, 0deg), transparent 0%, ${colors}, transparent 60%)`,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
          padding: `${borderWidth}px`,
          animation: `border-beam-spin ${duration}s linear infinite`,
        }}
      />
      {children}
    </div>
  );
}
