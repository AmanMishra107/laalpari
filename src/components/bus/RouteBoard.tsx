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
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/45">
          गाण्यांचा प्रवास · Radio Years
        </span>
        <button
          onClick={() => onSkipChange(!skip)}
          aria-pressed={skip}
          className={`font-mono text-[8px] uppercase tracking-[0.24em] underline-offset-4 hover:underline ${
            skip ? "text-lalpari" : "text-ink/30"
          }`}
        >
          skip to stop
        </button>
      </div>

      <div className="relative flex items-start">
        <div className="absolute left-2 right-2 top-[5px] h-px bg-ink/25" />
        <div
          className="absolute left-2 top-[5px] h-px bg-lalpari transition-all duration-700"
          style={{
            width: `calc((100% - 1rem) * ${(nextIndex ?? index) / (stops.length - 1)})`,
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
              className="group relative z-10 flex flex-1 flex-col items-center gap-1"
            >
              <span
                className={`size-[11px] rounded-full border transition-all duration-500 ${
                  active
                    ? "scale-125 border-lalpari bg-lalpari"
                    : done
                      ? "border-lalpari/70 bg-lalpari/40"
                      : "border-ink/30 bg-cream"
                } ${target ? "on-air-dot border-lalpari" : ""}`}
              />
              <span
                className={`font-mono text-[8px] uppercase tracking-[0.16em] transition-colors sm:text-[9px] ${
                  active ? "text-lalpari" : done ? "text-ink/55" : "text-ink/30"
                } group-hover:text-ink`}
              >
                {s.name}
              </span>
              <span
                className={`font-mono text-[8px] tracking-[0.14em] ${
                  active ? "text-ink/70" : "text-ink/25"
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
