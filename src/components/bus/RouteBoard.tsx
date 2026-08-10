import { Bus } from "lucide-react";
import { stops } from "@/data/journey";

export function RouteBoard({
  index,
  nextIndex,
  onSelect,
}: {
  index: number;
  nextIndex: number | null;
  onSelect: (i: number) => void;
}) {
  const progress = (nextIndex ?? index) / (stops.length - 1);

  return (
    <div className="flex w-full flex-col gap-2 px-1 py-2 sm:px-4 sm:py-3">
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
              className={`size-4 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] ${nextIndex !== null ? "animate-[pulse_0.6s_ease-in-out_infinite]" : ""}`}
            />
          </div>
        </div>

        <div className="absolute left-2 right-2 top-[calc(1.25rem+5px)] h-px bg-white/25" />
        <div
          className="absolute left-2 top-[calc(1.25rem+5px)] h-px bg-white/80 transition-all duration-700"
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
              className="group relative z-10 flex min-w-0 flex-1 flex-col items-center gap-1 [text-shadow:0_1px_5px_rgba(0,0,0,0.75)]"
            >
              <span
                className={`size-[11px] shrink-0 rounded-full border transition-all duration-500 ${
                  active
                    ? "scale-125 border-white bg-white shadow-[0_0_10px_rgba(0,0,0,0.6)]"
                    : done
                      ? "border-white/70 bg-white/55"
                      : "border-white/40 bg-white/10"
                } ${target ? "on-air-dot border-white" : ""}`}
              />
              <span
                className={`max-w-full truncate px-0.5 font-mono text-[7px] uppercase tracking-[0.1em] transition-colors sm:text-[9px] sm:tracking-[0.16em] ${
                  active ? "font-semibold text-white" : done ? "text-white/80" : "text-white/60"
                } group-hover:text-white`}
              >
                {s.name}
              </span>
              <span
                className={`max-w-full truncate font-mono text-[7px] tracking-[0.1em] sm:text-[8px] sm:tracking-[0.14em] ${
                  active ? "text-white/85" : "text-white/55"
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
