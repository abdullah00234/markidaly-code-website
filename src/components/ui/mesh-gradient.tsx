"use client";

import { GrainGradient, type GrainGradientProps } from "@paper-design/shaders-react";
import { useWebGL2Available } from "@/lib/webgl";
import { useMediaQuery } from "@/lib/use-media-query";

// Decorative background wrapper around @paper-design/shaders-react's
// GrainGradient shader (already a project dependency, same family as
// gradient-wave.tsx). GrainGradient's `shape`/`softness`/`colors`/`scale`/
// `rotation`/`speed` map directly onto this component's props; `distortion`
// maps to GrainGradient's `intensity` (its closest equivalent — "distortion
// between color bands"). `swirl`, `swirlIterations`, and `shapeScale` have
// no equivalent in the installed shader version — they're accepted here
// only so existing call sites keep compiling, and are otherwise unused.
export interface MeshGradientProps {
  className?: string;
  colors?: string[];
  speed?: number;
  distortion?: number;
  swirl?: number;
  swirlIterations?: number;
  softness?: number;
  shape?: GrainGradientProps["shape"];
  shapeScale?: number;
  scale?: number;
  rotation?: number;
}

const DEFAULT_COLORS = ["#0b1f3a", "#0c78b8", "#1793c6", "#4c86ff"];

export function MeshGradient({
  className,
  colors,
  speed,
  distortion,
  softness,
  shape = "wave",
  scale,
  rotation,
}: MeshGradientProps) {
  // GrainGradient requires WebGL2 and throws (uncatchably, inside an
  // un-awaited async effect in the library) when it's unavailable — checked
  // once on mount instead of assumed, so this never fires on a browser/
  // environment that can't back it.
  const webglSupported = useWebGL2Available();
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  if (!webglSupported) {
    const palette = colors && colors.length > 0 ? colors : DEFAULT_COLORS;
    return (
      <div
        className={className}
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${palette.join(", ")})`,
        }}
      />
    );
  }

  return (
    <GrainGradient
      className={className}
      colors={colors}
      speed={prefersReducedMotion ? 0 : speed}
      intensity={distortion}
      softness={softness}
      shape={shape}
      scale={scale}
      rotation={rotation}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
