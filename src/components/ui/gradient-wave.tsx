"use client";

// Decorative background for the "Our Process" section — pure CSS.
// This used to render @paper-design/shaders-react's `Waves` shader, but its
// params (shape=1/sine, frequency ~0.6-1.3, spacing ~0.9-1.5) are tuned for a
// tight, tiled line pattern, not a smooth gradient — it was rendering exactly
// as coded, just as a dense repeating zigzag, not the intended look. Replaced
// with a static multi-stop gradient from the same palette; the section's own
// thin dot-grid overlay (see OurProcess.tsx) still sits on top of this.
export interface GradientWaveProps {
  className?: string;
  colors?: string[];
  darkenTop?: boolean;
  shadowPower?: number;
}

const DEFAULT_COLORS = ["#0b1f3a", "#0c78b8", "#1793c6", "#16294a"];

export function GradientWave({
  className,
  colors = DEFAULT_COLORS,
  darkenTop = false,
  shadowPower = 0,
}: GradientWaveProps) {
  const palette = colors.length > 0 ? colors : DEFAULT_COLORS;
  const shadowOpacity = Math.min(Math.max(shadowPower, 0), 10) / 10;

  return (
    <div
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "hidden", zIndex: 0 }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(160deg, ${palette.join(", ")})`,
        }}
      />

      {darkenTop && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 60%)",
            opacity: shadowOpacity || 0.5,
          }}
        />
      )}
    </div>
  );
}
