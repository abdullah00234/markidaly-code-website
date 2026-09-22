import type { ReactNode } from "react";

export default function Eyebrow({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <p
      className={`mb-4 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] ${
        tone === "dark" ? "text-white/60" : "text-primary"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${tone === "dark" ? "bg-gold" : "bg-gradient-brand"}`}
      />
      {children}
    </p>
  );
}
