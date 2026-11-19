import { ChartNoAxesColumnIncreasing, CircleCheck } from "lucide-react";
import { GROWTH_RESULTS } from "./data";

export default function GrowthResultCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`mx-auto w-full rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(11,31,58,0.06),0_20px_44px_-20px_rgba(11,31,58,0.3)] sm:p-6 lg:w-[250px] ${className}`}
    >
      <p className="flex items-center gap-2 text-[13px] font-bold text-navy">
        <ChartNoAxesColumnIncreasing aria-hidden strokeWidth={2} className="h-4 w-4 shrink-0 text-primary" />
        Sustainable Profitable Growth
      </p>
      <ul className="mt-3 flex flex-col gap-2.5">
        {GROWTH_RESULTS.map((result) => (
          <li key={result} className="flex items-center gap-2.5">
            <CircleCheck aria-hidden strokeWidth={2} className="h-4 w-4 shrink-0 text-primary" />
            <span className="text-[12.5px] font-medium leading-snug text-ink-soft">
              {result}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
