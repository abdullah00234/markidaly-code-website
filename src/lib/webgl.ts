import { useSyncExternalStore } from "react";

// Feature-detects WebGL2 support. @paper-design/shaders-react's shader
// components (GrainGradient, Waves, ...) call canvas.getContext("webgl2", ...)
// internally and throw synchronously inside an un-awaited async effect if it
// returns null — an uncatchable-by-ErrorBoundary unhandled rejection — so
// callers must check this first and skip rendering the shader instead.
// Memoized: the result can't change within a session, so there's nothing to
// retry.
let cached: boolean | null = null;

function isWebGL2Available(): boolean {
  if (cached !== null) return cached;
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    cached = !!canvas.getContext("webgl2");
  } catch {
    cached = false;
  }
  return cached;
}

// Same subscribe/getSnapshot shape as use-media-query.ts's useMediaQuery:
// a real (non-throwing) `false` server snapshot keeps this safe to call from
// a component that gets server-rendered, and there's nothing to subscribe to
// since support can't change after mount.
export function useWebGL2Available(): boolean {
  return useSyncExternalStore(
    () => () => {},
    isWebGL2Available,
    () => false
  );
}
