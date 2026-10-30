"use client";

// A step index built as a wheel you turn.
//
// At rest the steps sit in a ring around a label, each card tangent to the
// circle. The first notch of progress blows the ring open into a vertical
// drum: the card at the front lies flat and full size, the ones above and
// below rotate away into hard perspective and run off the top and bottom of
// the frame. More progress carries the next step round to the front.
//
// The whole thing is one number - `progress` - painted straight to the DOM by
// `setProgress` on the imperative handle. The caller owns what drives that
// number (e.g. a GSAP ScrollTrigger's scrub progress); this component never
// listens for wheel, drag or scroll input itself. 0 is the ring, 1 is the
// drum with item 0 at the front, and every whole number after that is one
// more item turned past.
import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface WorksWheelItem {
  /** e.g. "01". Shown in the corner of the card. */
  number: string;
  /** Step name. Shown on the card and beside the front position. */
  title: string;
  /** One or two lines of detail, shown on the card. */
  description: string;
  icon: LucideIcon;
}

export interface WorksWheelHandle {
  /** Paints the wheel at this position. 0 = ring, 1..count = that item centred. */
  setProgress: (value: number) => void;
}

export interface WorksWheelProps extends Omit<
  React.ComponentPropsWithoutRef<"section">,
  "children" | "onSelect"
> {
  items: WorksWheelItem[];
  /** Sits in the middle of the ring. @default undefined */
  label?: string;
  /** Called with an item's index when the index list or keyboard arrows request it. */
  onSelect?: (index: number) => void;
}

/* Geometry. The card is measured against the stage; everything else is measured
   against the card, so a narrow stage - where the card is capped by width, not
   height - scales the whole wheel down with it instead of leaving a small card
   swinging on a huge drum. The three that matter are tuned together: STEP
   against DRUM sets how hard the neighbours rotate away, and DRUM against LENS
   decides whether they land inside the frame or run off it. */
const CARD_H = 0.46; // front card height, of the stage
const CARD_MAX_W = 0.46; // ... but never wider than this much of the stage
const CARD_RATIO = 1.15; // card width / height
const STEP = 40; // degrees between cards on the drum
const DRUM = 2.22; // drum radius, in card heights - and everything below likewise
const LENS = 2.7; // perspective distance
const RING_R = 1.14; // ring radius
/* The drum alone hangs the steps on a plumb line. It isn't one: the strip curves
   away round an arc whose centre sits off to the LEFT, so the piece at the front
   is at the arc's near point - dead centre - and its neighbours have already
   swung back left as well as up and down. BOW is that arc's radius; nothing else
   makes the difference between a stack of cards and a wheel seen side on. */
const BOW = 1.82;
const TITLE = 0.124; // ring label and front-card title
const INDEX = 0.044; // the index down the right-hand side
/** Items either side of the front still worth drawing. Past this a card is
    edge-on, and further round it would stack up on the vanishing point. */
const CULL = 1.6;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Stage = { w: number; h: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

/** How far left the arc has carried something that has turned `drumDeg` off the
    front. Zero at the front, so the piece being read stays centred. */
const bowAt = (drumDeg: number, bow: number) =>
  -bow * (1 - Math.cos(rad(drumDeg)));

/** Both states in one chain: the ring terms fall away as `m` reaches the drum,
    and the drum terms are still zero while the ring is up. The bow is applied
    first, in the wheel's own plane, so it slides the card sideways rather than
    turning with it - and perspective still shrinks it with distance. */
function place(
  ringDeg: number,
  drumDeg: number,
  ringR: number,
  drumR: number,
  bow: number,
  m: number,
) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
  );
}

export const WorksWheel = React.forwardRef<WorksWheelHandle, WorksWheelProps>(
  function WorksWheel({ items, label, onSelect, className, ...props }, ref) {
    const stageRef = React.useRef<HTMLDivElement>(null);
    const wheelRef = React.useRef<HTMLDivElement>(null);
    const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
    const labelRef = React.useRef<HTMLDivElement>(null);
    const titleRef = React.useRef<HTMLDivElement>(null);

    // Only `active` is state - every other visual is written straight to the
    // DOM, so painting a frame is not a render.
    const [active, setActive] = React.useState(0);
    const [stage, setStage] = React.useState<Stage>({ w: 0, h: 0 });
    const lastProgress = React.useRef(0);

    const count = items.length;
    const last = Math.max(count - 1, 0);

    // Read after mount, not during render: the server has no matchMedia, and
    // branching on it inline is a hydration mismatch. Reduced motion swaps
    // the 3D ring/drum choreography for a flat, vertical crossfade.
    const [reduced, setReduced] = React.useState(false);
    React.useEffect(() => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      const read = () => setReduced(query.matches);
      read();
      query.addEventListener("change", read);
      return () => query.removeEventListener("change", read);
    }, []);

    React.useEffect(() => {
      const el = stageRef.current;
      if (!el) return;
      const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
      read();
      const ro = new ResizeObserver(read);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    const metrics = React.useMemo(() => {
      const { w, h } = stage;
      const cardW = Math.min(h * CARD_H * CARD_RATIO, w * CARD_MAX_W);
      const cardH = cardW / CARD_RATIO;
      const drumR = cardH * DRUM;
      const ringR = cardH * RING_R;
      // Shrink the ring's cards until the circle reads as a closed loop rather
      // than beads on a wire, however many steps the wheel is given.
      const ringScale = count
        ? clamp((((2 * Math.PI * ringR) / count) * 0.42) / (cardW || 1), 0.16, 1)
        : 1;
      return {
        cardW,
        cardH,
        ringR,
        ringScale,
        drumR,
        bow: cardH * BOW,
        depth: cardH * LENS,
        title: cardH * TITLE,
        index: cardH * INDEX,
        cardFont: cardH * 0.125,
      };
    }, [stage, count]);

    // Paints a single frame at position `t`. The caller (an imperative
    // `setProgress` call, ultimately driven by scroll) decides what `t` is;
    // this never reads or mutates it on its own.
    const paint = React.useCallback(
      (t: number) => {
        lastProgress.current = t;
        const { ringR, ringScale, drumR, bow, cardH } = metrics;
        const m = clamp(t, 0, 1);
        const pos = Math.max(0, t - 1);

        if (wheelRef.current) {
          wheelRef.current.style.transform = reduced
            ? ""
            : `translateZ(${-m * drumR}px)`;
        }

        for (let i = 0; i < count; i++) {
          const d = i - pos;
          const card = cardRefs.current[i];
          if (card) {
            // Reduced motion: a flat vertical stack (translate only) instead
            // of the 3D ring/drum rotation and perspective depth.
            card.style.transform = reduced
              ? `translateY(${d * cardH * 1.15}px)`
              : place(d * (360 / count), d * STEP, ringR, drumR, bow, m);
            // Culled by distance, not by angle: at a full turn the far side
            // comes back round to face us, and everything past the
            // neighbours lands on the vanishing point in a heap.
            card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
            card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
          }
          const face = card?.firstElementChild as HTMLElement | null;
          if (face) {
            face.style.transform = reduced ? "" : `scale(${lerp(ringScale, 1, m)})`;
          }
        }

        if (labelRef.current) labelRef.current.style.opacity = String(1 - m);
        if (titleRef.current) titleRef.current.style.opacity = String(m);
        const near = clamp(Math.round(pos), 0, last);
        setActive((prev) => (prev === near ? prev : near));
      },
      [metrics, count, last, reduced],
    );

    // Re-paint at the last known position whenever geometry changes (e.g. a
    // resize), so the wheel doesn't need external input just to stay correct.
    React.useEffect(() => {
      if (!stage.h) return;
      paint(lastProgress.current);
    }, [metrics, stage.h, paint]);

    React.useImperativeHandle(
      ref,
      () => ({
        setProgress: (value: number) => paint(clamp(value, 0, last + 1)),
      }),
      [paint, last],
    );

    return (
      <section
        aria-label={label ?? "Steps"}
        className={cn(
          "relative h-full min-h-[24rem] w-full overflow-hidden select-none",
          className,
        )}
        {...props}
      >
        <div
          ref={stageRef}
          tabIndex={0}
          role="listbox"
          aria-label={label ?? "Steps"}
          aria-activedescendant={`works-wheel-${active}`}
          className="focus-visible:outline-white absolute inset-0 outline-none focus-visible:outline-2 focus-visible:-outline-offset-4"
          style={{ perspective: `${metrics.depth}px` }}
          onKeyDown={(event) => {
            if (!onSelect) return;
            if (event.key === "ArrowDown") onSelect(Math.min(active + 1, last));
            else if (event.key === "ArrowUp") onSelect(Math.max(active - 1, 0));
            else return;
            event.preventDefault();
          }}
        >
          <div
            ref={wheelRef}
            className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
          >
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  id={`works-wheel-${i}`}
                  role="option"
                  aria-selected={i === active}
                  ref={(node: HTMLDivElement | null) => {
                    cardRefs.current[i] = node;
                  }}
                  className="absolute [backface-visibility:hidden]"
                  style={{
                    width: metrics.cardW,
                    height: metrics.cardH,
                    marginLeft: -metrics.cardW / 2,
                    marginTop: -metrics.cardH / 2,
                  }}
                >
                  <span
                    className="relative flex size-full flex-col justify-between overflow-hidden rounded-2xl border border-white/12 bg-white/[0.05] p-[0.7em] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)] backdrop-blur-sm"
                    style={{ fontSize: metrics.cardFont }}
                  >
                    <div className="flex items-center justify-end">
                      <Icon
                        className="h-[1.25em] w-[1.25em] text-primary-bright/80"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </div>
                    <div>
                      <h3 className="line-clamp-2 text-[0.8em] font-bold leading-snug text-white">
                        {item.title}
                      </h3>
                      <p className="mt-[0.35em] line-clamp-3 text-[0.58em] leading-relaxed text-white/65">
                        {item.description}
                      </p>
                    </div>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ring label and front-card title trade places across the transition.
            Type is sized off the measured stage, not vh, so the wheel keeps its
            proportions inside a card as well as at full bleed. */}
        {label ? (
          <div
            ref={labelRef}
            className="pointer-events-none absolute inset-0 grid place-items-center text-center tracking-tight text-white/90"
            style={{ fontSize: metrics.title }}
          >
            {label}
          </div>
        ) : null}
        <div
          ref={titleRef}
          className="pointer-events-none absolute top-1/2 left-[6%] hidden max-w-[32%] -translate-y-1/2 tracking-tight text-white opacity-0 sm:block"
          style={{ fontSize: metrics.title }}
        >
          {items[active]?.title}
        </div>

        <ol className="absolute top-[7.5%] right-[3%] flex flex-col items-end gap-[0.6em]">
          {items.map((item, i) => (
            <li key={item.title}>
              <button
                type="button"
                onClick={() => onSelect?.(i)}
                aria-label={item.title}
                className={cn(
                  "focus-visible:outline-white block rounded-full bg-white/35 outline-none transition-all focus-visible:outline-1",
                  i === active ? "h-[0.55em] w-[0.55em] bg-white" : "h-[0.4em] w-[0.4em]",
                )}
                style={{ fontSize: metrics.index }}
              />
            </li>
          ))}
        </ol>
      </section>
    );
  },
);

export default WorksWheel;
