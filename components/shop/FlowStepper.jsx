import { Check } from "lucide-react";

const STEPS = [
  { key: "fabric", label: "Fabric & Style" },
  { key: "measure", label: "Measurements" },
  { key: "checkout", label: "Checkout" },
];

// Shared progress indicator across the outfit ordering journey (choose-style
// page → outfit product page → checkout) so the customer always knows where
// they are, instead of each page feeling like a disconnected step.
export default function FlowStepper({ current }) {
  const currentIndex = Math.max(0, STEPS.findIndex((s) => s.key === current));

  return (
    <div className="mb-8 sm:mb-10">
      {/* Mobile: compact progress bar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
          <span className="text-gold-600">Step {currentIndex + 1} of {STEPS.length}</span>
          <span className="text-ink/50">{STEPS[currentIndex]?.label}</span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ink/10">
          <div
            className="h-full rounded-full bg-gold-gradient transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: full stepper with connectors */}
      <div className="hidden sm:flex items-center">
        {STEPS.map((step, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <div key={step.key} className="flex flex-1 items-center last:flex-none">
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all duration-500 ${
                    done
                      ? "border-transparent bg-gold-gradient text-ink shadow-gold"
                      : active
                        ? "border-gold-400 bg-white text-gold-700 shadow-gold scale-110"
                        : "border-ink/15 bg-white text-ink/35"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" strokeWidth={2.75} /> : i + 1}
                </span>
                <span className={`text-sm font-bold tracking-wide transition-colors duration-500 ${
                  active ? "text-ink" : done ? "text-ink/70" : "text-ink/35"
                }`}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span className={`mx-4 h-px flex-1 transition-colors duration-500 ${done ? "bg-gold-400/50" : "bg-ink/10"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
