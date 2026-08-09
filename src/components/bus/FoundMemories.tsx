import { useState } from "react";
import type { Stop } from "@/data/journey";

export function FoundMemories({ stop }: { stop: Stop }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {stop.memories.map((m, i) => (
        <div
          key={`${stop.id}-${m.label}`}
          className="pointer-events-auto absolute"
          style={{ left: `${m.x}%`, top: `${m.y}%` }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-label={m.label}
            className="grid size-5 place-items-center rounded-full border border-ink/20 bg-cream/60 font-mono text-[9px] text-ink/50 transition-all duration-300 hover:scale-110 hover:border-lalpari hover:text-lalpari"
          >
            {m.glyph}
          </button>
          <span
            className={`absolute left-7 top-0 whitespace-nowrap rounded-sm border border-ink/10 bg-cream/95 px-2 py-1 font-mono text-[9px] tracking-[0.14em] text-ink/75 transition-all duration-300 ${
              open === i ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"
            }`}
          >
            {m.reply}
          </span>
        </div>
      ))}
    </div>
  );
}
