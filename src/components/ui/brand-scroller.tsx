import Image from "next/image";
import type { CSSProperties } from "react";

export type BrandLogo = {
  name: string;
  src: string;
  width: number;
  height: number;
  /**
   * Marks that aren't a wide horizontal wordmark (e.g. an icon stacked over
   * small text) shrink to an illegibly thin sliver at the shared wordmark
   * height, since their rendered width is derived from height * aspect
   * ratio. "tall" gives those a taller slot instead.
   */
  size?: "default" | "tall";
};

const SLOT_CLASSES: Record<NonNullable<BrandLogo["size"]>, string> = {
  default: "h-8 sm:h-9",
  tall: "h-14 sm:h-16",
};

const IMAGE_MAX_HEIGHT_CLASSES: Record<NonNullable<BrandLogo["size"]>, string> = {
  default: "max-h-8 sm:max-h-9",
  tall: "max-h-14 sm:max-h-16",
};

type ScrollerProps = {
  items: BrandLogo[];
  /** CSS time value, e.g. "36s" — defaults to the --duration set in globals.css */
  duration?: string;
};

function ScrollerRow({
  items,
  reverse,
  duration,
}: ScrollerProps & { reverse?: boolean }) {
  return (
    <div
      className="group flex max-w-full flex-row overflow-hidden py-3 [--gap:3.5rem] [gap:var(--gap)] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] sm:[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      style={duration ? ({ "--duration": duration } as CSSProperties) : undefined}
    >
      {/* Enough duplicated sets to cover well over 2x the widest expected
          viewport — with only 4-5 logos per row, a couple of copies leave
          visible gaps of blank space mid-scroll instead of a full-width
          strip. */}
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={`flex shrink-0 flex-row items-center [gap:var(--gap)] ${
              reverse ? "animate-marquee-reverse" : "animate-marquee"
            }`}
          >
            {items.map((logo, idx) => {
              const size = logo.size ?? "default";
              return (
                <div
                  key={`${logo.name}-${idx}`}
                  className={`flex shrink-0 items-center justify-center ${SLOT_CLASSES[size]}`}
                >
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={logo.width}
                    height={logo.height}
                    // Every client mark rendered as a flat black silhouette
                    // (brightness-0), regardless of its source colors, so the
                    // strip reads as one consistent trust bar. Height-capped
                    // and centered in a fixed-height slot (rather than sized
                    // directly) so logos with different internal padding in
                    // their source files still land on one visual center line.
                    className={`w-auto object-contain opacity-70 brightness-0 transition-opacity duration-300 hover:opacity-100 ${IMAGE_MAX_HEIGHT_CLASSES[size]}`}
                  />
                </div>
              );
            })}
          </div>
        ))}
    </div>
  );
}

export function BrandScroller(props: ScrollerProps) {
  return <ScrollerRow {...props} />;
}

export function BrandScrollerReverse(props: ScrollerProps) {
  return <ScrollerRow {...props} reverse />;
}
