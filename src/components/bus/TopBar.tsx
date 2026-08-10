import { ArrowUpRight, ListMusic } from "lucide-react";
import { useLiveViewers } from "@/hooks/useLiveViewers";

export function TopBar({
  clock,
  playlistOpen,
  onTogglePlaylist,
}: {
  clock: string;
  playlistOpen: boolean;
  onTogglePlaylist: () => void;
}) {
  const travelling = useLiveViewers();

  // Split "11:23 pm" → ["11", "23 pm"] so the colon can blink independently
  const colonIdx = clock.indexOf(":");
  const before = colonIdx >= 0 ? clock.slice(0, colonIdx) : clock;
  const after  = colonIdx >= 0 ? clock.slice(colonIdx + 1) : "";

  return (
    <div className="flex h-9 w-full items-center gap-2 px-3 sm:gap-4 sm:px-4">
      {/* Clock with blinking colon */}
      <span className="shrink-0 font-mono text-[10px] font-medium tabular-nums text-white/90 sm:text-[11px]">
        {before}
        <span
          aria-hidden
          className="animate-[clock-blink_1s_step-start_infinite]"
        >:</span>
        {after}
      </span>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 sm:gap-2">
        <span
          className="size-2 shrink-0 rounded-full bg-[oklch(0.78_0.19_145)] animate-[dot-pulse_4s_ease-in-out_infinite]"
          aria-hidden
        />
        <span className="text-[11px] font-semibold text-white tabular-nums sm:text-[12px]">
          {travelling}
        </span>
        <span className="truncate text-[11px] text-white/70 sm:text-[12px]">Travelling</span>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <button
          onClick={onTogglePlaylist}
          aria-pressed={playlistOpen}
          aria-label={playlistOpen ? "Close playlist" : "Open playlist"}
          className={`grid size-7 place-items-center rounded-full transition duration-150 hover:scale-110 active:scale-90 sm:size-8 ${playlistOpen
            ? "bg-white/20 text-white"
            : "text-white/75 hover:text-white"
            }`}
        >
          <ListMusic className="size-4" />
        </button>

        <a
          href="https://open.spotify.com/playlist/6mx7rVYF6ed2JTMegQ8SY0"
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-1 text-[11px] text-white/85 transition-colors hover:text-white sm:gap-1.5 sm:text-[12px]"
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          Playlist
          <ArrowUpRight className="size-3 opacity-70" />
        </a>
      </div>
    </div>
  );
}
