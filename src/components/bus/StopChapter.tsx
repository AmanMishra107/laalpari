import type { Stop } from "@/data/journey";

export function StopChapter({
  stop,
  moving,
  nextName,
}: {
  stop: Stop;
  moving: boolean;
  nextName: string | null;
}) {
  return (
    <div key={stop.id} className="max-w-xl">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.24em] text-ink/55">
        <span>{stop.noMr}</span>
        <span className="text-lalpari">{stop.eraLabel}</span>
        <span>{stop.tech}</span>
        <span>MH • ST</span>
      </div>

      <h2 className="mt-2 font-display text-[clamp(2.4rem,7.5vw,5rem)] leading-[0.92] font-extrabold tracking-tight text-lalpari">
        {stop.nameMr}
      </h2>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.34em] text-ink/50">
        {stop.name} — {stop.mood}
      </p>
      <p className="mt-3 font-display text-[15px] text-ink/80">“{stop.lineMr}”</p>

      <p
        className={`mt-3 font-mono text-[10px] uppercase tracking-[0.28em] transition-opacity duration-500 ${
          moving ? "text-lalpari opacity-100" : "opacity-0"
        }`}
      >
        Next stop — {nextName ?? ""} · changing radio…
      </p>
    </div>
  );
}
