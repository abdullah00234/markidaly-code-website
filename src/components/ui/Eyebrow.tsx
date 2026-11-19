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
      {/* Gold dot on every eyebrow, light or dark tone — the one consistent
          touch of the brand's gold accent repeated across each section
          label site-wide, while headings/body stay blue-dominant. */}
      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
      {children}
    </p>
  );
}
