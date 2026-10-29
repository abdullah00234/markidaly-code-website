"use client";

import { useSyncExternalStore } from "react";

// @uidotdev/usehooks' useMediaQuery throws on its server snapshot (it's
// documented as client-only), which crashes static generation for any
// component that isn't itself behind a dynamic(..., { ssr: false })
// boundary. This is the same subscribe/getSnapshot pair, but with a real
// (non-throwing) `false` server snapshot, so it's safe to call from a
// component that gets server-rendered.
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", callback);
      return () => mediaQueryList.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
