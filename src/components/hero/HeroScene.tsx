"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Image as FrameIcon,
  Search,
  Target,
  LayoutDashboard,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import CTAButton from "../ui/CTAButton";
// The Markidly mark — imported (not moved into public/) so this is the
// exact existing asset, resolved to a hashed, webpack/Turbopack-served URL.
import logoImg from "../../../images/image.png";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Brand tokens — Markidly. Cyan is new here: a control-center accent layered
// on top of the site's existing navy/blue/gold palette, used only in this
// scene. Gold marks the single "growth curve" payoff at the very end.
const BRAND = {
  navy: 0x0b1f3a,
  navySoft: 0x16294a,
  blue: 0x1f5eff,
  blueBright: 0x4c86ff,
  cyan: 0x22d3ee,
  gold: 0xc9a227,
  goldBright: 0xe4c25a,
  light: 0xdfe8ff,
};

type HeroSceneProps = {
  sectionEl: HTMLElement | null;
  // Owned by Hero.tsx (server-rendered there) so the hero <h1> ends up in
  // the server-rendered HTML even though this component is client-only —
  // see Hero.tsx for why. Driven the same way a locally-owned ref would be.
  introRef: React.RefObject<HTMLDivElement | null>;
};

type ServiceNode = {
  label: string;
  tagline: string;
  icon: LucideIcon;
  x: number;
  y: number;
  z: number;
  // Scroll-progress window over which this node's connection line draws in
  // and stays lit.
  revealStart: number;
  revealEnd: number;
};

// The five services this scene exists to visualize — never a product, cart,
// or marketplace UI. Positions stay right-of-core so nodes never drift into
// the copy column. No node has its own dedicated close-up act anymore —
// they all reveal together in the final "everything reconnects" beat, as
// plain floating panels with no per-node act copy or extra floating content
// (keyword chips, campaign cards, creative frames, ACoS counter) of their
// own.
const SERVICE_NODES: ServiceNode[] = [
  { label: "Amazon SEO", tagline: "Rank higher, sell more", icon: Search, x: -5.5, y: 5.5, z: 1.5, revealStart: 0.6, revealEnd: 0.75 },
  { label: "Amazon PPC", tagline: "Profitable ad spend", icon: Target, x: 6, y: 6.5, z: -1, revealStart: 0.6, revealEnd: 0.75 },
  { label: "Creative & A+ Content", tagline: "Brand Story that sells", icon: FrameIcon, x: 7.5, y: -5.5, z: 0.5, revealStart: 0.6, revealEnd: 0.75 },
  { label: "Account Management", tagline: "Health, ops, compliance", icon: LayoutDashboard, x: -2, y: -6, z: -1.5, revealStart: 0.6, revealEnd: 0.75 },
  { label: "Growth Strategy", tagline: "One plan, one team", icon: TrendingUp, x: -8, y: 0.5, z: -3, revealStart: 0.6, revealEnd: 0.75 },
];

// Camera keyframes for the desktop journey — one continuous move through a
// single persistent scene, not a cut between separate scenes. Positions are
// world-space, accounting for the core group's own (13, 1, -4) offset.
const CAMERA_KEYFRAMES: { p: number; pos: THREE.Vector3; look: THREE.Vector3 }[] = [
  { p: 0, pos: new THREE.Vector3(0, 5, 34), look: new THREE.Vector3(3, 2, -4) },
  { p: 0.6, pos: new THREE.Vector3(-2, 3, 34), look: new THREE.Vector3(7, 1, -5) },
  { p: 1.0, pos: new THREE.Vector3(0, 4, 36), look: new THREE.Vector3(9, 1, -4) },
];

// Fade windows for each act's DOM copy, expressed as scroll-progress ranges.
// Each act's copy fully holds AT its named scroll percentage (matching the
// camera keyframes above), fading in on approach and out on departure.
const ACT_WINDOWS = {
  intro: { outStart: 0.15, outEnd: 0.35 },
  growth: { inStart: 0.8, inEnd: 0.9 },
};

const LINE_SEGMENTS = 48;
const GROWTH_CURVE_SEGMENTS = 64;

function fadeWindow(
  p: number,
  inStart: number,
  inEnd: number,
  outStart?: number,
  outEnd?: number
) {
  const fadeIn = THREE.MathUtils.clamp((p - inStart) / (inEnd - inStart || 1), 0, 1);
  if (outStart == null || outEnd == null) return fadeIn;
  const fadeOut = 1 - THREE.MathUtils.clamp((p - outStart) / (outEnd - outStart || 1), 0, 1);
  return Math.min(fadeIn, fadeOut);
}

function smoothstep(t: number) {
  const c = THREE.MathUtils.clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

function makeGlowSprite(size: number, color: number, opacity: number) {
  const mat = new THREE.ShaderMaterial({
    uniforms: { color: { value: new THREE.Color(color) }, opacity: { value: opacity } },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform vec3 color;
      uniform float opacity;
      void main() {
        float d = length(vUv - vec2(0.5));
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(color, a * opacity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  return new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
}

// Builds a THREE.Line whose color fades from `colorStart` to `colorEnd`
// along its length, with a hidden draw range so it can be progressively
// "drawn in" via setDrawRange as scroll passes its reveal window.
function makeGradientLine(points: THREE.Vector3[], colorStart: number, colorEnd: number, opacity: number) {
  const colorsArr = new Float32Array(points.length * 3);
  const start = new THREE.Color(colorStart);
  const end = new THREE.Color(colorEnd);
  for (let i = 0; i < points.length; i++) {
    const c = start.clone().lerp(end, i / (points.length - 1));
    colorsArr[i * 3] = c.r;
    colorsArr[i * 3 + 1] = c.g;
    colorsArr[i * 3 + 2] = c.b;
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  geo.setAttribute("color", new THREE.BufferAttribute(colorsArr, 3));
  geo.setDrawRange(0, 0);
  const mat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  return new THREE.Line(geo, mat);
}

function projectToScreen(
  obj: THREE.Object3D,
  camera: THREE.Camera,
  w: number,
  h: number,
  target: THREE.Vector3
) {
  obj.getWorldPosition(target);
  target.project(camera);
  return { x: (target.x * 0.5 + 0.5) * w, y: (-target.y * 0.5 + 0.5) * h };
}

// Feature-detects real WebGL support (not just viewport size) — the signal
// the "lightweight fallback for poor WebGL performance" requirement is
// actually asking for. A throwaway canvas + context probe is the standard,
// dependency-free way to do this.
function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * The hero's background scene — a single continuous "growth control
 * center": one persistent 3D space (a central intelligence core + five
 * orbiting service nodes) that the camera moves through as the user
 * scrolls, rather than cutting between separate scenes. Pinned scroll plays
 * two acts in sequence — Intro, Growth — with all five service nodes (SEO,
 * PPC, Creative, Account Management, Growth Strategy) reconnecting together
 * as plain panels in that final beat, and the growth curve payoff drawing
 * in near the end.
 *
 * Raw Three.js (no post-processing/bloom — kept off per the site's "avoid
 * unnecessary post-processing" direction; glow is faked with additive
 * shader sprites instead). Every camera move, line reveal, and copy
 * crossfade is driven by scrollProgress; the only motion not gated by
 * scroll is a very small breathing pulse on the core and the flow of
 * particles along an already-established connection — both "system is
 * alive" cues, not decoration.
 */
export default function HeroScene({ sectionEl, introRef }: HeroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelChromeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconWrapRefs = useRef<(HTMLDivElement | null)[]>([]);

  const growthRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const simplified = window.matchMedia("(max-width: 767px)").matches;

    // Lightweight fallback for devices where the full scene isn't worth
    // running: no WebGL at all, or a low-end mobile device (hardwareConcurrency
    // is the one low-end signal with broad, non-Chrome-only support — unlike
    // navigator.deviceMemory). No canvas, no RAF loop, no scroll-jacking —
    // just the static gradient background (already in Hero.tsx) plus the
    // intro copy, left as a normal in-flow block so the page scrolls past it
    // immediately instead of pinning for a 3D payoff that isn't there.
    const webglAvailable = isWebGLAvailable();
    const lowEndDevice =
      simplified &&
      typeof navigator !== "undefined" &&
      !!navigator.hardwareConcurrency &&
      navigator.hardwareConcurrency <= 2;
    if (!webglAvailable || lowEndDevice) {
      canvas.style.display = "none";
      if (introRef.current) {
        introRef.current.style.opacity = "1";
        introRef.current.style.pointerEvents = "auto";
        introRef.current.style.visibility = "visible";
      }
      return;
    }

    // Floating glass panels need real screen room for their labels — on
    // small screens they'd collide with the copy column, so only the
    // ambient scene (core, lines, particles) renders there. Act copy itself
    // is plain CSS-positioned text (not 3D-projected), so it still plays on
    // mobile.
    const showPanels = !simplified;

    const getSize = () => container.getBoundingClientRect();

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(BRAND.navy, 0.0026);

    const { width, height } = getSize();
    // Cached, not re-read via getBoundingClientRect() every animation frame
    // (a layout read) — only the ResizeObserver below updates this.
    const viewSize = { width, height };
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 500);
    camera.position.set(0, 5, 34);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      // MSAA has a real fill-rate/memory cost and buys little on small,
      // high-density mobile panels — skip it there.
      antialias: !simplified,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    // Capped well below native DPR (a 3x/4x panel gains nothing visible
    // from full-resolution WebGL output here, only GPU cost).
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, simplified ? 1 : 1.25));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    scene.add(new THREE.AmbientLight(0x223355, 0.7));
    const keyLight = new THREE.PointLight(BRAND.blueBright, 3.2, 80);
    keyLight.position.set(14, 12, 22);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(BRAND.cyan, 1.6, 80);
    rimLight.position.set(-16, -6, 10);
    scene.add(rimLight);

    // --- Ambient data field: slow drifting points, never real numbers.
    // Kept deliberately small — this is atmosphere, not a data viz, so more
    // points buys nothing perceptually while costing per-vertex shader work
    // every frame. ---
    const particles: THREE.Points[] = [];
    // Mobile drops to a single layer at a smaller count — half the points,
    // half the draw calls, no parallax depth layering a small screen
    // wouldn't read anyway.
    const fieldCount = simplified ? 90 : 300;
    const fieldLayers = simplified ? 1 : 2;
    for (let layer = 0; layer < fieldLayers; layer++) {
      const positions = new Float32Array(fieldCount * 3);
      const colors = new Float32Array(fieldCount * 3);
      const sizes = new Float32Array(fieldCount);

      for (let i = 0; i < fieldCount; i++) {
        const radius = 30 + Math.random() * 150;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.4 + 6;
        positions[i * 3 + 2] = radius * Math.cos(phi) - 40;

        const color = new THREE.Color();
        const choice = Math.random();
        if (choice < 0.78) color.setHex(BRAND.light);
        else if (choice < 0.95) color.setHex(BRAND.cyan);
        else color.setHex(BRAND.gold);

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        sizes[i] = Math.random() * 1.3 + 0.4;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 }, depth: { value: layer } },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          uniform float time;
          uniform float depth;
          void main() {
            vColor = color;
            vec3 pos = position;
            float angle = time * 0.015 * (1.0 - depth * 0.4);
            mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
            pos.xz = rot * pos.xz;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (140.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
            gl_FragColor = vec4(vColor, opacity * 0.8);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);
      particles.push(points);
    }

    // --- Horizon glow: a subtle inward-facing blue rim. This is the single
    // largest transparent overdraw source in the scene (a huge backside
    // sphere covering most of the frame), so it's the first thing cut on
    // mobile — low segment count everywhere since it's a soft blurred
    // gradient with no hard edges to alias. ---
    let horizon: THREE.Mesh | null = null;
    if (!simplified) {
      const glowGeo = new THREE.SphereGeometry(220, 16, 16);
      const glowMat = new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 glow = vec3(0.13, 0.38, 0.92) * intensity;
            gl_FragColor = vec4(glow, intensity * 0.14);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      });
      horizon = new THREE.Mesh(glowGeo, glowMat);
      scene.add(horizon);
    }

    // ================= Growth core =================
    const coreGroup = new THREE.Group();
    const coreOffsetX = simplified ? 0 : 13;
    coreGroup.position.set(coreOffsetX, simplified ? -22 : 1, simplified ? -10 : -4);
    scene.add(coreGroup);

    // Fixed look-at point for the (simplified) mobile path — desktop uses
    // the CAMERA_KEYFRAMES path instead. Deliberately NOT tracking
    // coreGroup.position, or the camera would cancel out its offset.
    const cameraLookAtMobile = new THREE.Vector3(0, -1, -9);

    // Sized down from the original 20/13 units — still reads as a soft
    // glow, less overdraw when the camera dollies in close during the
    // SEO/PPC/Creative acts.
    const coreGlow = makeGlowSprite(simplified ? 10 : 16, BRAND.blueBright, 0.55);
    coreGroup.add(coreGlow);

    const coreGeo = new THREE.IcosahedronGeometry(simplified ? 2.1 : 2.9, simplified ? 0 : 1);
    // Phong instead of Standard — this is a single low-poly mesh with only
    // two point lights on it, so full PBR (metalness/roughness) buys
    // nothing visible here over the cheaper Blinn-Phong model.
    const coreMat = new THREE.MeshPhongMaterial({
      color: BRAND.blue,
      emissive: BRAND.blueBright,
      emissiveIntensity: 0.55,
      shininess: 45,
      transparent: true,
      opacity: 0.92,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // --- The Markidly mark, attached to the core itself. Parented directly
    // to coreMesh so it inherits the core's position and scale (including
    // its breathing pulse and the mount entrance scale-in) — it moves and
    // scales exactly as the core does. Built as a plane + manual
    // per-frame billboard (quaternion copied from the camera in the render
    // loop below), the same proven pattern already used by every other
    // glow sprite in this scene — so it always faces the camera and never
    // spins out of legibility as coreGroup rotates on scroll, per the
    // "don't rotate the logo excessively" requirement. depthTest is off +
    // renderOrder is high so it always draws on top of the core surface
    // instead of being fought over in the transparent depth-sort (both sit
    // at the same origin, which depth-sorting handles badly).
    //
    // image.png's canvas is 190x142 with an OPAQUE near-white background
    // around the circular mark (no real alpha to key off — verified by
    // reading its decoded pixels directly). A plain textured plane would
    // therefore show as a white card sitting on the core. Instead, a small
    // shader crops it to a circle matching the mark's own true bounding
    // box (measured directly from the source pixels: blue spans roughly
    // x:46-172, y:10-137), so only the mark itself — never the rectangular
    // background — is visible, and it lands correctly centered.
    const logoTexture = new THREE.TextureLoader().load(logoImg.src);
    logoTexture.colorSpace = THREE.SRGBColorSpace;
    const LOGO_IMAGE_SIZE = new THREE.Vector2(190, 142);
    const LOGO_MARK_BOUNDS = { minX: 46, maxX: 172, minY: 10, maxY: 137 };
    const logoCenterU = (LOGO_MARK_BOUNDS.minX + LOGO_MARK_BOUNDS.maxX) / 2 / LOGO_IMAGE_SIZE.x;
    const logoCenterV =
      1 - (LOGO_MARK_BOUNDS.minY + LOGO_MARK_BOUNDS.maxY) / 2 / LOGO_IMAGE_SIZE.y; // flip to UV (v=0 at bottom)
    const logoMarkRadiusPx =
      ((LOGO_MARK_BOUNDS.maxX - LOGO_MARK_BOUNDS.minX) + (LOGO_MARK_BOUNDS.maxY - LOGO_MARK_BOUNDS.minY)) / 4;
    const logoAspect = LOGO_IMAGE_SIZE.x / LOGO_IMAGE_SIZE.y;

    // Sized off the core's own radius (not a fixed pixel value) so it
    // scales with the core automatically on mobile's smaller geometry —
    // the visible mark's radius lands at ~0.62x the core radius, leaving
    // clear padding to the circle's edge on every side.
    const logoVisibleRadius = coreGeo.parameters.radius * 0.62;
    const logoWidth = (logoVisibleRadius / logoMarkRadiusPx) * LOGO_IMAGE_SIZE.x;
    const logoHeight = logoWidth / logoAspect;

    const logoMat = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: logoTexture },
        uCenter: { value: new THREE.Vector2(logoCenterU, logoCenterV) },
        uImageSize: { value: LOGO_IMAGE_SIZE },
        uRadius: { value: logoMarkRadiusPx },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      fog: false,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D map;
        uniform vec2 uCenter;
        uniform vec2 uImageSize;
        uniform float uRadius;
        void main() {
          vec4 texColor = texture2D(map, vUv);
          float dist = length((vUv - uCenter) * uImageSize);
          float alpha = 1.0 - smoothstep(uRadius - 2.0, uRadius + 1.0, dist);
          gl_FragColor = vec4(texColor.rgb, alpha);
        }
      `,
    });
    const logoMesh = new THREE.Mesh(new THREE.PlaneGeometry(logoWidth, logoHeight), logoMat);
    // The mark's own center isn't exactly the plane's center (see measured
    // bounds above) — offset the mesh so the VISIBLE mark, not the
    // invisible backing rectangle, ends up centered on the core.
    logoMesh.position.set(-(logoCenterU - 0.5) * logoWidth, -(logoCenterV - 0.5) * logoHeight, 0);
    logoMesh.renderOrder = 10;
    coreMesh.add(logoMesh);

    const shellGeo = new THREE.IcosahedronGeometry(4.1, simplified ? 0 : 1);
    const shellEdges = new THREE.EdgesGeometry(shellGeo);
    const shellMat = new THREE.LineBasicMaterial({
      color: BRAND.cyan,
      transparent: true,
      opacity: 0.4,
    });
    const shellLines = new THREE.LineSegments(shellEdges, shellMat);
    coreGroup.add(shellLines);

    // --- Service nodes + their connection lines back to the core. Mobile
    // gets a genuinely simplified network — not the desktop scene shrunk
    // down: thin lines only (no per-node glow sprite, no flowing particle,
    // roughly a third of the line segments). Those extras exist to support
    // a camera that individually visits and spotlights each node; on
    // mobile the camera never does that and the node labels are hidden
    // anyway (see showPanels below), so they would be pure GPU cost with
    // zero visible payoff. ---
    const nodeLineSegments = simplified ? 14 : LINE_SEGMENTS;
    const nodeAnchors: THREE.Object3D[] = [];
    const nodeLines: THREE.Line[] = [];
    const nodeGlows: (THREE.Mesh | null)[] = [];
    const nodeParticles: (THREE.Mesh | null)[] = [];
    const nodeCurves: THREE.QuadraticBezierCurve3[] = [];

    SERVICE_NODES.forEach((node) => {
      const anchor = new THREE.Object3D();
      anchor.position.set(node.x, node.y, node.z);
      coreGroup.add(anchor);
      nodeAnchors.push(anchor);

      const control = anchor.position
        .clone()
        .multiplyScalar(0.55)
        .add(new THREE.Vector3(0, 1.6, 1.2));
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        control,
        anchor.position.clone()
      );
      nodeCurves.push(curve);

      const pts = curve.getPoints(nodeLineSegments);
      const line = makeGradientLine(pts, BRAND.navySoft, BRAND.cyan, 0.85);
      coreGroup.add(line);
      nodeLines.push(line);

      if (simplified) {
        nodeGlows.push(null);
        nodeParticles.push(null);
      } else {
        const nodeGlow = makeGlowSprite(2.6, BRAND.cyan, 0);
        nodeGlow.position.copy(anchor.position);
        coreGroup.add(nodeGlow);
        nodeGlows.push(nodeGlow);

        const particle = makeGlowSprite(0.9, BRAND.light, 0);
        coreGroup.add(particle);
        nodeParticles.push(particle);
      }
    });

    // --- Floating data labels (SEO keywords, PPC campaign cards), creative
    // frames, and the closing growth curve — all desktop-only. Each exists
    // to support the desktop-only floating growth curve; on mobile it
    // doesn't apply (see `simplified` above), so skip building it at all
    // rather than creating invisible geometry that still costs matrix
    // updates every frame. ---
    let growthCurveLine: THREE.Line | null = null;

    if (!simplified) {
      const growthCurvePoints = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-11, -9, -2),
        new THREE.Vector3(-3, -3, 0),
        new THREE.Vector3(6, 4, -1),
        new THREE.Vector3(14, 9, 1),
        new THREE.Vector3(21, 13, -2),
      ]).getPoints(GROWTH_CURVE_SEGMENTS);
      growthCurveLine = makeGradientLine(growthCurvePoints, BRAND.cyan, BRAND.goldBright, 0.9);
      coreGroup.add(growthCurveLine);
    }

    // --- Entrance (mount-only, not scroll-linked): the environment settles
    // into position on load. The act narrative itself only ever plays via
    // scroll. ---
    let entranceTl: ReturnType<typeof gsap.timeline> | null = null;
    if (prefersReducedMotion) {
      coreGroup.scale.setScalar(1);
      particles.forEach((p) => {
        (p.material as THREE.ShaderMaterial).opacity = 1;
      });
    } else {
      gsap.set(coreGroup.scale, { x: 0.7, y: 0.7, z: 0.7 });
      gsap.set(coreMat, { opacity: 0 });
      gsap.set(shellMat, { opacity: 0 });
      entranceTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      entranceTl
        .to(coreGroup.scale, { x: 1, y: 1, z: 1, duration: 1.3 }, 0)
        .to(coreMat, { opacity: 0.92, duration: 1.1 }, 0.15)
        .to(shellMat, { opacity: 0.4, duration: 1.1 }, 0.25);
      particles.forEach((p, i) => {
        entranceTl!.fromTo(
          p.material,
          { opacity: 0 },
          { opacity: 1, duration: 1.4 },
          0.1 + i * 0.15
        );
      });
      if (introRef.current) {
        gsap.set(introRef.current, { opacity: 0, y: 16 });
        entranceTl.to(introRef.current, { opacity: 1, y: 0, duration: 0.9 }, 0.35);
      }
    }

    // --- Scroll: pinned on desktop while scrollProgress (0..1) plays the
    // intro -> growth journey against the full camera/node/panel journey.
    // Mobile has none of that visual payoff (panels are desktop-only — see
    // `simplified`/`showPanels` above), so holding the same pin distance
    // there just reads as a long stretch of empty scrolling before the next
    // section. The act copy still crossfades on mobile, so it keeps a
    // shorter pinned distance rather than losing the narrative entirely. ---
    let scrollProgress = prefersReducedMotion ? 1 : 0;
    let scrollTrigger: ScrollTrigger | null = null;
    if (!prefersReducedMotion && sectionEl) {
      scrollTrigger = ScrollTrigger.create({
        trigger: sectionEl,
        start: "top top",
        end: () => "+=" + window.innerHeight * (simplified ? 1.1 : 2),
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          scrollProgress = self.progress;
        },
      });
    }

    // --- Reusable transform writers for DOM-projected floating elements ---
    // Every write is skipped unless it actually changed (within a small
    // epsilon) — these run once per element per frame, and a style write
    // that doesn't change the rendered pixel is still a style write the
    // browser has to process.
    const worldPos = new THREE.Vector3();
    const EPS = 0.01;
    const floatingCache = new WeakMap<
      HTMLDivElement,
      { x: number; y: number; opacity: number; scale: number }
    >();
    const applyFloating = (
      el: HTMLDivElement | null,
      x: number,
      y: number,
      opacity: number,
      scale: number
    ) => {
      if (!el) return;
      const prev = floatingCache.get(el);
      if (
        prev &&
        Math.abs(prev.x - x) < EPS &&
        Math.abs(prev.y - y) < EPS &&
        Math.abs(prev.opacity - opacity) < EPS &&
        Math.abs(prev.scale - scale) < EPS
      ) {
        return;
      }
      floatingCache.set(el, { x, y, opacity, scale });
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
      el.style.opacity = String(opacity);
    };
    const actBlockCache = new WeakMap<HTMLDivElement, number>();
    const applyActBlock = (el: HTMLDivElement | null, opacity: number, interactive: boolean) => {
      if (!el) return;
      const prev = actBlockCache.get(el);
      if (prev !== undefined && Math.abs(prev - opacity) < EPS) return;
      actBlockCache.set(el, opacity);
      el.style.opacity = String(opacity);
      if (interactive) {
        el.style.pointerEvents = opacity > 0.4 ? "auto" : "none";
        el.style.visibility = opacity > 0.02 ? "visible" : "hidden";
      }
    };
    const opacityCache = new WeakMap<HTMLElement, number>();
    const setOpacityIfChanged = (el: HTMLElement | null, value: number) => {
      if (!el) return;
      const prev = opacityCache.get(el);
      if (prev !== undefined && Math.abs(prev - value) < EPS) return;
      opacityCache.set(el, value);
      el.style.opacity = String(value);
    };
    const boxShadowCache = new WeakMap<HTMLElement, string>();
    const setBoxShadowIfChanged = (el: HTMLElement | null, value: string) => {
      if (!el) return;
      if (boxShadowCache.get(el) === value) return;
      boxShadowCache.set(el, value);
      el.style.boxShadow = value;
    };

    let targetCamPos = CAMERA_KEYFRAMES[0].pos.clone();
    let targetLookAt = CAMERA_KEYFRAMES[0].look.clone();
    const currentLookAt = CAMERA_KEYFRAMES[0].look.clone();
    let targetRotY = -0.05;

    const evalCameraKeyframes = (p: number, outPos: THREE.Vector3, outLook: THREE.Vector3) => {
      const kfs = CAMERA_KEYFRAMES;
      let seg = kfs.length - 2;
      for (let i = 0; i < kfs.length - 1; i++) {
        if (p <= kfs[i + 1].p) {
          seg = i;
          break;
        }
      }
      const a = kfs[seg];
      const b = kfs[seg + 1];
      const span = b.p - a.p || 1;
      const t = smoothstep((p - a.p) / span);
      outPos.lerpVectors(a.pos, b.pos, t);
      outLook.lerpVectors(a.look, b.look, t);
    };

    const updateAll = (elapsed: number) => {
      const { width: w, height: h } = viewSize;
      const p = scrollProgress;

      // Service nodes: reveal + spotlight, per node reveal window.
      SERVICE_NODES.forEach((node, i) => {
        const revealT = THREE.MathUtils.clamp(
          (p - node.revealStart) / (node.revealEnd - node.revealStart || 1),
          0,
          1
        );
        const spotlight = prefersReducedMotion
          ? 0.35
          : fadeWindow(p, node.revealStart, node.revealEnd, node.revealEnd, node.revealEnd + 0.08);

        const line = nodeLines[i];
        const drawCount = Math.round(revealT * nodeLineSegments);
        line.geometry.setDrawRange(0, drawCount + 1);
        (line.material as THREE.LineBasicMaterial).opacity = 0.5 + spotlight * 0.5;

        // Glow sprite + flowing particle don't exist on mobile (see node
        // construction above) — nothing to update there.
        const glow = nodeGlows[i];
        if (glow) {
          (glow.material as THREE.ShaderMaterial).uniforms.opacity.value =
            revealT * (0.25 + spotlight * 0.55);
          glow.quaternion.copy(camera.quaternion);
        }

        const particle = nodeParticles[i];
        if (particle) {
          const flowing = !prefersReducedMotion && revealT > 0.97;
          if (flowing) {
            const t = (elapsed * 0.09 + i * 0.37) % 1;
            nodeCurves[i].getPointAt(t, worldPos);
            particle.position.copy(worldPos);
            (particle.material as THREE.ShaderMaterial).uniforms.opacity.value = 0.85;
            particle.quaternion.copy(camera.quaternion);
          } else {
            (particle.material as THREE.ShaderMaterial).uniforms.opacity.value = 0;
          }
        }

        if (showPanels) {
          const { x, y } = projectToScreen(nodeAnchors[i], camera, w, h, worldPos);
          // The glass chrome (background/border/blur) floors low once a
          // node's own act has passed, so a resting panel doesn't visually
          // compete with whichever panel is in spotlight now if their
          // screen positions pass close during the camera's transit
          // between acts. The label text/icon is driven independently
          // (panelContentRefs, not nested inside the chrome's opacity) and
          // stays close to full opacity at rest — otherwise it would dim
          // along with the chrome and read as washed-out grey instead of
          // the intended off-white.
          const textOpacity = revealT < 0.05 ? 0 : 0.82 + spotlight * 0.18;
          const chromeOpacity = revealT < 0.05 ? 0 : 0.3 + spotlight * 0.65;
          const panelScale = 0.92 + spotlight * 0.1;
          applyFloating(panelRefs.current[i], x, y, revealT < 0.05 ? 0 : 1, panelScale);
          setOpacityIfChanged(panelChromeRefs.current[i], chromeOpacity);
          setOpacityIfChanged(panelContentRefs.current[i], textOpacity);
          setBoxShadowIfChanged(
            iconWrapRefs.current[i],
            spotlight > 0.15
              ? `0 0 ${12 + spotlight * 18}px rgba(34,211,238,${(0.25 + spotlight * 0.45).toFixed(2)})`
              : "none"
          );
        }
      });

      // Growth curve — draws in only during the final act. Doesn't exist
      // on mobile.
      if (growthCurveLine) {
        const growthT = THREE.MathUtils.clamp(
          (p - ACT_WINDOWS.growth.inStart) / (ACT_WINDOWS.growth.inEnd - ACT_WINDOWS.growth.inStart),
          0,
          1
        );
        growthCurveLine.geometry.setDrawRange(
          0,
          prefersReducedMotion ? 0 : Math.round(growthT * GROWTH_CURVE_SEGMENTS) + 1
        );
      }

      // Act copy crossfades (skipped for reduced motion — handled by the
      // static branch instead).
      if (!prefersReducedMotion) {
        const introVisibility =
          1 -
          THREE.MathUtils.clamp(
            (p - ACT_WINDOWS.intro.outStart) /
              ((ACT_WINDOWS.intro.outEnd - ACT_WINDOWS.intro.outStart) || 1),
            0,
            1
          );
        applyActBlock(introRef.current, introVisibility, true);
        applyActBlock(growthRef.current, fadeWindow(p, ACT_WINDOWS.growth.inStart, ACT_WINDOWS.growth.inEnd), true);
      }

      // Camera + core motion. Mobile deliberately gets much less movement
      // than desktop's full keyframe journey — a small screen doesn't read
      // depth/parallax well, it's more disorienting than cinematic there,
      // and a near-static camera is cheaper (less to recompute per frame).
      if (simplified) {
        targetCamPos.set(0, 5 + p * 0.6, 34 - p * 2.5);
        targetLookAt.copy(cameraLookAtMobile);
        targetRotY = -0.05 + p * 0.03;
      } else {
        evalCameraKeyframes(p, targetCamPos, targetLookAt);
        targetRotY = -0.05 + p * 0.1;
      }
    };

    if (prefersReducedMotion) {
      // Accessible resting state: intro copy + a fully-connected node
      // network on a nice wide establishing shot. The act-by-act journey
      // (the growth curve) is a scroll-driven narrative that doesn't apply
      // here, so it stays hidden rather than being crammed into one static
      // frame.
      coreGroup.rotation.y = -0.05;
      // Camera must be positioned BEFORE any screen-projection below, or
      // panels project using the default (unaimed) camera transform.
      camera.position.copy(CAMERA_KEYFRAMES[0].pos);
      camera.lookAt(CAMERA_KEYFRAMES[0].look);
      coreGlow.quaternion.copy(camera.quaternion);
      logoMesh.quaternion.copy(camera.quaternion);
      SERVICE_NODES.forEach((node, i) => {
        const line = nodeLines[i];
        line.geometry.setDrawRange(0, nodeLineSegments + 1);
        (line.material as THREE.LineBasicMaterial).opacity = 0.75;
        const glow = nodeGlows[i];
        if (glow) {
          (glow.material as THREE.ShaderMaterial).uniforms.opacity.value = 0.45;
          glow.quaternion.copy(camera.quaternion);
        }
        if (showPanels) {
          const { x, y } = projectToScreen(nodeAnchors[i], camera, width, height, worldPos);
          applyFloating(panelRefs.current[i], x, y, 1, 1);
          const chrome = panelChromeRefs.current[i];
          if (chrome) chrome.style.opacity = "0.85";
          const content = panelContentRefs.current[i];
          if (content) content.style.opacity = "0.95";
        }
      });
      growthCurveLine?.geometry.setDrawRange(0, 0);
      if (introRef.current) {
        introRef.current.style.opacity = "1";
        introRef.current.style.pointerEvents = "auto";
        introRef.current.style.visibility = "visible";
      }
      renderer.render(scene, camera);
    }

    // --- Render loop (skipped entirely for reduced motion — a single
    // static, settled frame is rendered above instead) ---
    let animationId: number | null = null;
    const clock = new THREE.Clock();
    // Mobile GPUs are the ones this matters most for, and the motion here
    // is slow/ambient anyway — capping to ~30fps there roughly halves GPU
    // work on a 60Hz panel with no visible loss of smoothness. Desktop is
    // capped to 60fps too — on a 120Hz ProMotion Mac this scene would
    // otherwise render twice as often as a 60Hz panel for no visible gain
    // (the camera/reveal motion is all scroll-driven, not frame-rate
    // dependent), doubling GPU work for nothing.
    const minFrameInterval = simplified ? 1 / 30 : 1 / 60;
    let lastRenderTime = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      if (elapsed - lastRenderTime < minFrameInterval) return;
      lastRenderTime = elapsed;

      particles.forEach((p) => {
        const mat = p.material as THREE.ShaderMaterial;
        if (mat.uniforms?.time) mat.uniforms.time.value = elapsed;
      });

      // The only motion not gated by scroll: a very small breathing pulse
      // on the core, read as "the system is live," not decoration.
      const breathe = 1 + Math.sin(elapsed * 0.6) * 0.015;
      coreMesh.scale.setScalar(breathe);
      coreGlow.quaternion.copy(camera.quaternion);
      logoMesh.quaternion.copy(camera.quaternion);

      updateAll(elapsed);

      coreGroup.rotation.y += (targetRotY - coreGroup.rotation.y) * 0.05;
      camera.position.lerp(targetCamPos, 0.07);
      currentLookAt.lerp(targetLookAt, 0.07);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };
    const stopLoop = () => {
      if (animationId != null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };
    // Pin spacer visibility: while sectionEl is intersecting the viewport,
    // the hero is either in its normal scroll position or pinned (fixed)
    // on screen — either way it's actually being seen. Once scroll carries
    // it past the pin (the ~300vh pin spacer has fully scrolled by), it
    // stops intersecting and there's no reason to keep burning GPU on a
    // scene nobody can see.
    let sectionVisible = true;
    let pageVisible = typeof document === "undefined" || !document.hidden;
    const shouldRun = () => !prefersReducedMotion && sectionVisible && pageVisible;
    const startLoop = () => {
      if (animationId == null && shouldRun()) animate();
    };
    if (!prefersReducedMotion) animate();

    let sectionObserver: IntersectionObserver | null = null;
    if (sectionEl && !prefersReducedMotion) {
      sectionObserver = new IntersectionObserver(
        ([entry]) => {
          sectionVisible = entry.isIntersecting;
          if (shouldRun()) startLoop();
          else stopLoop();
        },
        { threshold: 0 }
      );
      sectionObserver.observe(sectionEl);
    }
    const onVisibilityChange = () => {
      pageVisible = !document.hidden;
      if (shouldRun()) startLoop();
      else stopLoop();
    };
    if (!prefersReducedMotion) {
      document.addEventListener("visibilitychange", onVisibilityChange);
    }

    const resizeObserver = new ResizeObserver(() => {
      const { width: w, height: h } = getSize();
      if (w === 0 || h === 0) return;
      viewSize.width = w;
      viewSize.height = h;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (prefersReducedMotion) {
        renderer.render(scene, camera);
      }
    });
    resizeObserver.observe(container);

    return () => {
      stopLoop();
      sectionObserver?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      resizeObserver.disconnect();
      scrollTrigger?.kill();
      entranceTl?.kill();

      particles.forEach((p) => {
        p.geometry.dispose();
        (p.material as THREE.Material).dispose();
      });
      horizon?.geometry.dispose();
      (horizon?.material as THREE.Material | undefined)?.dispose();

      coreGeo.dispose();
      coreMat.dispose();
      logoTexture.dispose();
      logoMat.dispose();
      logoMesh.geometry.dispose();
      shellGeo.dispose();
      shellEdges.dispose();
      shellMat.dispose();
      coreGlow.geometry.dispose();
      (coreGlow.material as THREE.Material).dispose();

      nodeLines.forEach((l) => {
        l.geometry.dispose();
        (l.material as THREE.Material).dispose();
      });
      nodeGlows.forEach((g) => {
        g?.geometry.dispose();
        (g?.material as THREE.Material | undefined)?.dispose();
      });
      nodeParticles.forEach((p) => {
        p?.geometry.dispose();
        (p?.material as THREE.Material | undefined)?.dispose();
      });
      growthCurveLine?.geometry.dispose();
      (growthCurveLine?.material as THREE.Material | undefined)?.dispose();

      renderer.dispose();
    };
    // sectionEl only affects the ScrollTrigger wiring — intentionally not a
    // dependency so the whole scene doesn't get torn down and rebuilt if
    // the section ref identity happens to change after mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas ref={canvasRef} aria-hidden className="h-full w-full" />

      {/* Service node panels (always eligible, gated to md+ inside the JS
          loop via showPanels) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 hidden md:block">
        {SERVICE_NODES.map((node, i) => (
          <div
            key={node.label}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 w-[176px] opacity-0"
            style={{ willChange: "transform" }}
          >
            {/* Glass chrome — dims independently of the label below so a
                resting (already-visited) panel can fade into the
                background without taking the text's legibility with it. */}
            {/* No backdrop-blur: these sit over the per-frame WebGL canvas,
                and blur()ing a region that repaints every frame forces the
                browser to recompute the blur every frame too. A slightly
                more opaque flat background reads the same without that
                cost. */}
            <div
              ref={(el) => {
                panelChromeRefs.current[i] = el;
              }}
              aria-hidden
              className="absolute inset-0 rounded-2xl border border-white/15 bg-[rgba(20,45,80,0.55)]"
            />
            <div
              ref={(el) => {
                panelContentRefs.current[i] = el;
              }}
              className="relative p-3.5"
            >
              <div
                ref={(el) => {
                  iconWrapRefs.current[i] = el;
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-bright/30 to-cyan-400/20 transition-shadow duration-300"
              >
                <node.icon className="h-5 w-5 text-hero-white" strokeWidth={1.75} />
              </div>
              <p className="mt-2.5 text-[13px] font-semibold leading-tight text-hero-white">
                {node.label}
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-hero-white/70">
                {node.tagline}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Act copy (intro copy itself is server-rendered in Hero.tsx — this
          component only drives its fade/position via introRef) */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="container-page relative h-full">
          {/* 100% — Growth */}
          <div ref={growthRef} className="absolute inset-0 flex items-start pt-28 opacity-0 md:pt-32 lg:pt-40">
            <div className="max-w-xl">
              <h2 className="text-[40px] font-black leading-[1.14] tracking-tight text-hero-white sm:text-[50px] lg:text-[56px]">
                One Team. Every Amazon Growth Layer.
              </h2>
              <p className="mt-6 max-w-lg text-[19px] leading-relaxed text-hero-white">
                Strategy, creative, and hands-on execution working together
                to move your brand forward.
              </p>
              <div className="mt-9">
                <CTAButton href="#book-audit" arrow>
                  Start Your Growth Audit
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
