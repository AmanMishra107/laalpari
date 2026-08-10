import type { Decade } from "@/data/decades";
import { Play } from "lucide-react";

export function DecadePlaylist({
  decade,
  onSelect,
  activeTitle,

  tracks,
  activeIndex,
}: {
  decade: Decade;
  onSelect: (index: number) => void;
  activeTitle: string | null;
  connected: boolean;
  tracks?: { title: string; artist: string }[];
  activeIndex?: number | null;
}) {
  const list = tracks?.length ? tracks : decade.tracks;
  const start = Math.max(0, Math.min((activeIndex ?? 0) - 1, list.length - 6));
  const window = list.slice(start, start + 6);
  return (
    <div key={decade.id} className="animate-in fade-in duration-500">
      <ul className="space-y-0.5">
        {window.map((t, wi) => {
          const i = start + wi;
          const active = activeIndex != null ? activeIndex === i : activeTitle === t.title;
          return (
            <li key={`${decade.id}-${i}-${t.title}`} className={wi > 4 ? "hidden sm:block" : ""}>

              <button
                onClick={() => onSelect(i)}
                className="group flex w-full items-center gap-2 rounded-md px-1.5 py-[5px] text-left transition-all duration-200 hover:bg-white/25 active:scale-[0.99]"
              >
                <span
                  className={`shrink-0 min-w-[1.1rem] font-mono text-[10px] tabular-nums transition-colors ${
                    active ? "text-lalpari" : "text-ink/40 group-hover:text-lalpari/80"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`min-w-0 flex-1 truncate text-[12px] leading-tight transition-colors ${
                    active ? "font-medium text-lalpari" : "text-ink/80 group-hover:text-ink"
                  }`}
                >
                  {t.title}
                </span>
                <span className="hidden max-w-[38%] truncate font-mono text-[10px] text-ink/40 sm:inline">
                  {t.artist}
                </span>
                <span
                  className={`ml-1 flex shrink-0 items-center justify-center transition-all duration-200 ${
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <Play
                    className={`size-3 fill-current ${
                      active ? "text-lalpari" : "text-ink/50"
                    }`}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
