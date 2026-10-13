import AuditStep from "./AuditStep";
import { AUDIT_STEPS } from "./steps";

export default function AuditProcess() {
  return (
    <div className="mt-16 lg:mt-20">
      {/* Desktop / large tablet: horizontal timeline */}
      <ol className="relative hidden lg:flex lg:items-start lg:gap-2">
        <div
          className="pointer-events-none absolute left-[10%] right-[10%] top-6 h-px bg-line"
          aria-hidden
        />
        {AUDIT_STEPS.map((step, i) => (
          <AuditStep
            key={step.n}
            step={step}
            index={i}
            isLast={i === AUDIT_STEPS.length - 1}
            orientation="horizontal"
          />
        ))}
      </ol>

      {/* Tablet / mobile: vertical timeline */}
      <ol className="mx-auto flex max-w-xl flex-col lg:hidden">
        {AUDIT_STEPS.map((step, i) => (
          <AuditStep
            key={step.n}
            step={step}
            index={i}
            isLast={i === AUDIT_STEPS.length - 1}
            orientation="vertical"
          />
        ))}
      </ol>
    </div>
  );
}
