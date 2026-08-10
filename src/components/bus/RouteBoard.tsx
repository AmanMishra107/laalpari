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
  const moving = nextIndex !== null;
  const progress = (nextIndex ?? index) / (stops.length - 1);

  return (
    <div className="flex w-full flex-col gap-2 px-1 py-2 sm:px-4 sm:py-3">
      <div className="relative flex items-start pt-6">
        {/* moving bus */}
        <div className="pointer-events-none absolute inset-x-2 top-0 h-6" aria-hidden>
          <div
            className="absolute top-0 will-change-transform"
            style={{
              left: `${progress * 100}%`,
              transform: "translateX(-50%)",
              transition: "left 1400ms cubic-bezier(0.65,0,0.2,1)",
            }}
          >
            <div
              className={moving ? "animate-[bus-bob_620ms_ease-in-out_infinite]" : ""}
              style={{ transformOrigin: "50% 90%" }}
            >
              <Bus
                className="size-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:size-[18px]"
                style={{ transform: `scaleX(${moving && (nextIndex ?? 0) < index ? -1 : 1})` }}
              />
              {/* speed lines */}
              <span
                className={`absolute right-full top-1/2 mr-1 block h-px w-5 -translate-y-1/2 bg-gradient-to-l from-white/70 to-transparent transition-opacity duration-300 ${
                  moving ? "opacity-100" : "opacity-0"
                }`}
              />
              <span
                className={`absolute right-full top-1/2 mr-1 mt-1.5 block h-px w-3 bg-gradient-to-l from-white/40 to-transparent transition-opacity duration-300 ${
                  moving ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </div>
        </div>

        {/* base rail */}
        <div className="absolute left-2 right-2 top-[calc(1.5rem+5px)] h-px overflow-hidden bg-white/20">
          {/* travelling shimmer */}
          <span
            className={`absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/70 to-transparent ${
              moving ? "animate-[rail-sweep_1.4s_linear_infinite]" : "opacity-0"
            }`}
          />
        </div>
        {/* filled rail */}
        <div
          className="absolute left-2 top-[calc(1.5rem+5px)] h-px bg-white/85 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          style={{
            width: `calc((100% - 1rem) * ${progress})`,
            transition: "width 1400ms cubic-bezier(0.65,0,0.2,1)",
          }}
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
              <span className="relative flex size-[11px] shrink-0 items-center justify-center">
                {(active || target) && (
                  <span className="absolute inset-0 animate-[dot-ripple_1.8s_ease-out_infinite] rounded-full border border-white/70" />
                )}
                <span
                  className={`size-[11px] rounded-full border transition-all duration-700 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-125 ${
                    active
                      ? "scale-125 border-white bg-white shadow-[0_0_14px_rgba(255,255,255,0.75)]"
                      : done
                        ? "border-white/70 bg-white/55"
                        : "border-white/40 bg-white/10"
                  }`}
                />
              </span>
              <span
                className={`max-w-full truncate px-0.5 font-mono text-[7px] uppercase tracking-[0.1em] transition-all duration-500 sm:text-[9px] sm:tracking-[0.16em] ${
                  active
                    ? "font-semibold text-white sm:tracking-[0.24em]"
                    : done
                      ? "text-white/80"
                      : "text-white/60"
                } group-hover:text-white group-hover:sm:tracking-[0.22em]`}
              >
                {s.name}
              </span>
              <span
                className={`max-w-full truncate font-mono text-[7px] tracking-[0.1em] transition-all duration-500 sm:text-[8px] sm:tracking-[0.14em] ${
                  active ? "text-white/85 opacity-100" : "text-white/50 opacity-70"
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
