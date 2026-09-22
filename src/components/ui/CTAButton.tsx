import Link from "next/link";
import type { ReactNode } from "react";

type CTAButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline-dark";
  size?: "md" | "sm";
  arrow?: boolean;
  className?: string;
  onClick?: () => void;
};

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2";

const variants: Record<NonNullable<CTAButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-brand text-white shadow-[0_1px_2px_rgba(11,31,58,0.08),0_10px_24px_-8px_rgba(31,94,255,0.5)] hover:brightness-110 hover:shadow-[0_1px_2px_rgba(11,31,58,0.08),0_16px_32px_-8px_rgba(31,94,255,0.6)] hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-white text-navy border border-line hover:border-primary/40 hover:text-primary hover:-translate-y-0.5 active:translate-y-0",
  ghost: "text-navy hover:text-primary px-0",
  "outline-dark":
    "border border-white/25 text-white hover:border-white/50 hover:-translate-y-0.5 active:translate-y-0",
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
}: CTAButtonProps) {
  const noPaddingSize = variant === "ghost";
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${noPaddingSize ? "" : sizes[size]} ${className}`}
    >
      {children}
      {arrow && (
        <svg
          aria-hidden
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      )}
    </Link>
  );
}
