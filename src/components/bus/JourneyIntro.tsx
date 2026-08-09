import { useEffect, useState } from "react";

const BOARDS = ["पुणे", "PUNE", "सातारा", "SATARA"];

export function JourneyIntro({ onDepart }: { onDepart: () => void }) {
  const [board, setBoard] = useState(0);
  const [stage, setStage] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const b = setInterval(() => setBoard((v) => (v + 1) % BOARDS.length), 620);
    const t1 = setTimeout(() => setStage(1), 1200);
    const t2 = setTimeout(() => setStage(2), 2300);
    const t3 = setTimeout(() => setLeaving(true), 4200);
    const t4 = setTimeout(() => onDepart(), 5100);
    return () => {
      clearInterval(b);
      [t1, t2, t3, t4].forEach(clearTimeout);
    };
  }, [onDepart]);

  return (
    <div
      className={`absolute inset-0 z-50 grid place-items-center bg-[oklch(0.16_0.04_28)] transition-all duration-[900ms] ${
        leaving ? "pointer-events-none translate-x-[-6%] opacity-0" : "opacity-100"
      }`}
    >
      <div className="paper-grain absolute inset-0 opacity-70" />
      <div className="relative w-full max-w-lg px-6 text-center">
        <div className="mx-auto w-fit rounded-sm border border-sun/40 bg-[oklch(0.22_0.05_30)] px-4 py-2 shadow-[0_0_38px_-10px_oklch(0.83_0.16_82/0.6)]">
          <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-sun/60">
            ST · MH · DEPOT
          </p>
          <p
            key={board}
            className="mt-1 font-display text-2xl font-extrabold tracking-[0.1em] text-sun"
          >
            {BOARDS[board]}
          </p>
          <p className="mt-1 font-mono text-[9px] tracking-[0.32em] text-sun/50">PUNE → SATARA</p>
        </div>

        <h1
          className={`mt-8 font-display text-[clamp(2rem,7vw,3.4rem)] leading-none font-extrabold text-cream transition-all duration-700 ${
            stage >= 1 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          लालपरीची गाणी
        </h1>

        <div
          className={`mt-4 flex flex-col items-center gap-1 transition-all duration-700 ${
            stage >= 2 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <p className="font-mono text-[11px] tracking-[0.22em] text-cream/70">
            एक प्रवास. सहा थांबे. सात दशकं.
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.38em] text-cream/40">
            One journey · Six stops · Seven decades
          </p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <span className="h-px w-24 bg-cream/20" />
          <span className="depot-shake font-mono text-[9px] uppercase tracking-[0.3em] text-sun/70">
            engine starting
          </span>
          <span className="h-px w-24 bg-cream/20" />
        </div>
      </div>
    </div>
  );
}
