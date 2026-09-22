"use client";

import { useCallback, useEffect } from "react";

// particles.js attaches itself to `window` when loaded from the CDN script
// below — there's no npm type package for it, so only the surface this file
// touches is declared here.
declare global {
  interface Window {
    particlesJS?: (tagId: string, config: Record<string, unknown>) => void;
    pJSDom?: Array<{ pJS: { fn: { vendors: { destroypJS: () => void } } } }>;
  }
}

// Brand blues + a gold accent, mixed across the particle field so the
// section reads as a lit constellation rather than a flat dot grid.
const COLORS = {
  particles: ["#4c86ff", "#8fb4ff", "#c9a227"],
  lines: "#4c86ff",
  accent: "#c9a227",
};

function destroyExisting() {
  const oldCanvas = document.querySelector("#particles-why canvas");
  oldCanvas?.remove();

  if (window.pJSDom && window.pJSDom.length > 0) {
    window.pJSDom.forEach((p) => p.pJS.fn.vendors.destroypJS());
    window.pJSDom = [];
  }
}

export default function ParticlesBackground() {
  const initParticles = useCallback(() => {
    destroyExisting();

    window.particlesJS?.("particles-why", {
      particles: {
        number: { value: 130, density: { enable: true, value_area: 850 } },
        color: { value: COLORS.particles },
        shape: { type: "circle", stroke: { width: 0.5, color: COLORS.accent } },
        opacity: {
          value: 0.75,
          random: true,
          anim: { enable: true, speed: 1, opacity_min: 0.35 },
        },
        size: {
          value: 3.5,
          random: true,
          anim: { enable: true, speed: 1.8, size_min: 1.2 },
        },
        line_linked: {
          enable: true,
          distance: 170,
          color: COLORS.lines,
          opacity: 0.45,
          width: 1.4,
        },
        move: { enable: true, speed: 1.6, random: true, out_mode: "bounce" },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 200, line_linked: { opacity: 0.7 } },
          push: { particles_nb: 4 },
        },
      },
      retina_detect: true,
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (window.particlesJS) {
      initParticles();
      return () => destroyExisting();
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
    script.async = true;
    script.onload = () => initParticles();
    document.body.appendChild(script);

    return () => destroyExisting();
  }, [initParticles]);

  return <div id="particles-why" aria-hidden className="absolute inset-0" />;
}
