import { Bus } from "lucide-react";
import { stops } from "@/data/journey";

export function RouteBoard({
  index,
  nextIndex,
  skip,
  onSkipChange,
  onSelect,
}: {
  index: number;
  nextIndex: number | null;
  skip: boolean;
  onSkipChange: (v: boolean) => void;
  onSelect: (i: number) => void;
}) {
  const progress = (nextIndex ?? index) / (stops.length - 1);

  return (
    <div className="glass-panel flex w-full flex-col gap-2 rounded-2xl px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/50">
          गाण्यांचा प्रवास · Radio Years
        </span>
        <button
          onClick={() => onSkipChange(!skip)}
          aria-pressed={skip}
          className={`font-mono text-[8px] uppercase tracking-[0.24em] underline-offset-4 hover:underline ${
            skip ? "text-ink" : "text-ink/35"
          }`}
        >
          skip to stop
        </button>
      </div>

      <div className="relative flex items-start pt-5">
        {/* moving bus */}
        <div
          className="pointer-events-none absolute top-0 left-2 right-2 h-5"
          aria-hidden
        >
          <div
            className="absolute top-0 transition-all duration-[900ms] ease-in-out"
            style={{ left: `${progress * 100}%`, transform: "translateX(-50%)" }}
          >
            <Bus
              className={`size-4 text-ink/70 ${nextIndex !== null ? "animate-[pulse_0.6s_ease-in-out_infinite]" : ""}`}
            />
          </div>
        </div>

        <div className="absolute left-2 right-2 top-[calc(1.25rem+5px)] h-px bg-ink/20" />
        <div
          className="absolute left-2 top-[calc(1.25rem+5px)] h-px bg-ink/60 transition-all duration-700"
          style={{ width: `calc((100% - 1rem) * ${progress})` }}
        />
        {stops.map((s, i) => {
          const done = i < index;
          const active = i === index;
          const target = nextIndex === i;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(i)}
              aria-current={active ? "step" : undefined}
              className="group relative z-10 flex flex-1 flex-col items-center gap-1"
            >
              <span
                className={`size-[11px] rounded-full border transition-all duration-500 ${
                  active
                    ? "scale-125 border-ink bg-ink"
                    : done
                      ? "border-ink/60 bg-ink/40"
                      : "border-ink/25 bg-cream/60"
                } ${target ? "on-air-dot border-ink" : ""}`}
              />
              <span
                className={`font-mono text-[8px] uppercase tracking-[0.16em] transition-colors sm:text-[9px] ${
                  active ? "text-ink" : done ? "text-ink/55" : "text-ink/35"
                } group-hover:text-ink`}
              >
                {s.name}
              </span>
              <span
                className={`font-mono text-[8px] tracking-[0.14em] ${
                  active ? "text-ink/70" : "text-ink/30"
                }`}
              >
                {s.decadeIds.join(" / ")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
