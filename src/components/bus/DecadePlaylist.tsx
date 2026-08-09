import type { Decade } from "@/data/decades";
import { searchUrl } from "@/lib/spotify/api";

export function DecadePlaylist({
  decade,
  onSelect,
  activeTitle,
  connected,
}: {
  decade: Decade;
  onSelect: (index: number) => void;
  activeTitle: string | null;
  connected: boolean;
}) {
  return (
    <div key={decade.id} className="animate-in fade-in duration-500">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink/50">
        {decade.title} — {decade.subtitle}
      </p>
      <ul className="mt-2 space-y-0.5">
        {decade.tracks.slice(0, 7).map((t, i) => {
          const active = activeTitle === t.title;
          return (
            <li key={`${decade.id}-${t.title}`} className={i > 4 ? "hidden sm:block" : ""}>
              <button
                onClick={() => onSelect(i)}
                className="group flex w-full items-baseline gap-2 rounded-sm px-1 py-[3px] text-left transition-colors hover:bg-ink/5"
              >
                <span className="font-mono text-[10px] tabular-nums text-ink/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`truncate text-[12px] leading-tight ${
                    active ? "text-lalpari" : "text-ink/85"
                  }`}
                >
                  {t.title}
                </span>
                <span className="truncate font-mono text-[10px] text-ink/45">{t.artist}</span>
                <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.2em] text-lalpari opacity-0 transition-opacity group-hover:opacity-100">
                  ▶
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {!connected && (
        <a
          href={searchUrl(decade.tracks[0]!.title, decade.tracks[0]!.artist)}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block font-mono text-[9px] uppercase tracking-[0.24em] text-ink/45 underline-offset-4 hover:text-ink hover:underline"
        >
          Open in Spotify
        </a>
      )}
    </div>
  );
}
