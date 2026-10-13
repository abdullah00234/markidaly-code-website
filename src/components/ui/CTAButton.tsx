import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type CTAButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline-dark";
  size?: "md" | "sm";
  arrow?: boolean;
  className?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
};

const base =
  "group relative inline-flex items-center justify-center gap-1 overflow-hidden rounded-full font-semibold transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 active:scale-[0.95]";

const variantStyles: Record<
  NonNullable<CTAButtonProps["variant"]>,
  { container: string; circle: string; hoverRadius: boolean }
> = {
  primary: {
    container:
      "border-[1.5px] border-transparent bg-gradient-brand text-white shadow-[0_1px_2px_rgba(11,31,58,0.08),0_10px_24px_-8px_rgba(31,94,255,0.5)] hover:brightness-110 hover:shadow-[0_1px_2px_rgba(11,31,58,0.08),0_16px_32px_-8px_rgba(31,94,255,0.6)] hover:-translate-y-0.5 active:translate-y-0",
    circle: "",
    hoverRadius: true,
  },
  secondary: {
    container:
      "border-[1.5px] border-line bg-white text-navy hover:border-transparent hover:text-white hover:-translate-y-0.5 active:translate-y-0",
    circle: "bg-navy",
    hoverRadius: true,
  },
  ghost: {
    container: "text-navy hover:text-primary px-0",
    circle: "",
    hoverRadius: false,
  },
  "outline-dark": {
    container:
      "border-[1.5px] border-white/25 bg-transparent text-white hover:border-transparent hover:text-navy hover:-translate-y-0.5 active:translate-y-0",
    circle: "bg-white",
    hoverRadius: true,
  },
};

const sizes: Record<NonNullable<CTAButtonProps["size"]>, string> = {
  md: "px-6 py-3.5 text-[15px]",
  sm: "px-5 py-2.5 text-sm",
};

export default function CTAButton({
  href,
  children,
  variant = "primary",
  size = "md",
  arrow = false,
  className = "",
  onClick,
  target,
  rel,
}: CTAButtonProps) {
  const { container, circle, hoverRadius } = variantStyles[variant];
  const noPaddingSize = variant === "ghost";
  // Variants with a fill color get the full "liquid" flow animation;
  // ghost has no container to fill, so it keeps a simpler arrow nudge.
  const useFlow = arrow && circle !== "";

  return (
    <Link
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      className={`${base} ${container} ${hoverRadius ? "hover:rounded-[12px]" : ""} ${
        noPaddingSize ? "" : sizes[size]
      } ${className}`}
    >
      {useFlow && (
        <ArrowRight
          aria-hidden
          className="pointer-events-none absolute left-[-25%] z-[9] h-4 w-4 stroke-current transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:left-4"
        />
      )}

      <span
        className={
          useFlow
            ? "relative z-[1] -translate-x-3 transition-all duration-[800ms] ease-out group-hover:translate-x-3"
            : "relative z-[1] inline-flex items-center gap-2"
        }
      >
        {children}
      </span>

      {arrow && !useFlow && (
        <ArrowRight
          aria-hidden
          className="relative z-[1] h-4 w-4 shrink-0 stroke-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
        />
      )}

      {useFlow && (
        <>
          <span
            aria-hidden
            className={`pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:h-[220px] group-hover:w-[220px] group-hover:opacity-100 ${circle}`}
          />
          <ArrowRight
            aria-hidden
            className="pointer-events-none absolute right-4 z-[9] h-4 w-4 stroke-current transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:right-[-25%]"
          />
        </>
      )}
    </Link>
  );
}
