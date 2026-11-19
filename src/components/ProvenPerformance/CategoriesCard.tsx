import { CATEGORIES } from "./data";

export default function CategoriesCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`mx-auto w-full rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(11,31,58,0.06),0_20px_44px_-20px_rgba(11,31,58,0.3)] sm:p-6 lg:w-[250px] ${className}`}
    >
      <p className="text-[13px] font-bold text-navy">Multiple Categories</p>
      <ul className="mt-3 flex flex-col gap-2.5">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          return (
            <li key={category.label} className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                <Icon aria-hidden strokeWidth={1.8} className="h-3.5 w-3.5" />
              </span>
              <span className="text-[12.5px] font-medium leading-snug text-ink-soft">
                {category.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
