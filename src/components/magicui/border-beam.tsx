"use client";

interface BorderBeamProps {
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
}

export function BorderBeam({
  duration = 8,
  colorFrom = "#FBBF24",
  colorTo = "#F59E0B",
  className = "",
}: BorderBeamProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-[-1px] rounded-[inherit] ${className}`}
      style={{
        background: `conic-gradient(from var(--border-beam-angle, 0deg), transparent 0%, ${colorFrom} 8%, ${colorTo} 16%, transparent 25%)`,
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "destination-out",
        maskComposite: "exclude",
        padding: "1.5px",
        animation: `border-beam-spin ${duration}s linear infinite`,
      }}
    />
  );
}
