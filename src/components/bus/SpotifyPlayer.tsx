import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import type { SpotifyTrack } from "@/lib/spotify/api";

const fmt = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export function SpotifyPlayer({
  track,
  fallbackTitle,
  fallbackArtist,
  isPlaying,
  progress,
  duration,
  onToggle,
  onNext,
  onPrev,
  onSeek,

  message,
  embedRef,
  embedActive,
  embedLoaded,
  disabled,
}: {
  track: SpotifyTrack | null;
  fallbackTitle: string;
  fallbackArtist: string;
  isPlaying: boolean;
  progress: number;
  duration: number;
  onToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek?: (ms: number) => void;

  message: string | null;
  embedRef?: React.RefObject<HTMLDivElement | null>;
  embedActive?: boolean;
  embedLoaded?: boolean;
  disabled?: boolean;
}) {
  const pct = duration ? Math.min(100, (progress / duration) * 100) : 0;

  return (
    <section
      aria-label="Window seat radio player"
      className="ticket-panel w-[min(420px,92vw)] rounded-xl p-3"
    >
      <div className="flex items-center gap-3">
        <div className="size-12 shrink-0 overflow-hidden rounded-md bg-cream/20">
          {track?.artwork ? (
            <img
              src={track.artwork}
              alt={`Album artwork for ${track.name}`}
              width={96}
              height={96}
              className="size-full object-cover"
            />
          ) : (
            <div className="grid size-full place-items-center font-mono text-[8px] uppercase tracking-widest text-cream/60">
              ST
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-cream">
            {track?.name ?? fallbackTitle}
          </p>
          <p className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-cream/65">
            {track?.artists ?? fallbackArtist}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            disabled={disabled}
            aria-label="Previous track"
            className="grid size-9 place-items-center rounded-full text-cream/70 transition-colors hover:text-cream disabled:cursor-wait disabled:opacity-35"
          >
            <SkipBack className="size-4" />
          </button>
          <div className="size-11">
            <button
              onClick={onToggle}
              disabled={disabled}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="grid size-11 place-items-center rounded-full bg-cream text-lalpari transition-transform hover:scale-105 disabled:cursor-wait disabled:opacity-60"
            >
              {isPlaying ? <Pause className="size-5" /> : <Play className="size-5 translate-x-px" />}
            </button>
          </div>

          <button
            onClick={onNext}
            disabled={disabled}
            aria-label="Next track"
            className="grid size-9 place-items-center rounded-full text-cream/70 transition-colors hover:text-cream disabled:cursor-wait disabled:opacity-35"
          >
            <SkipForward className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="font-mono text-[9px] tabular-nums text-cream/60">{fmt(progress)}</span>
        <div className="relative h-4 flex-1">
          <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-cream/25">
            <div className="h-full rounded-full bg-cream" style={{ width: `${pct}%` }} />
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(1, duration)}
            step={1000}
            value={Math.min(progress, duration || 0)}
            onChange={(e) => onSeek?.(Number(e.target.value))}
            disabled={!duration || !onSeek}
            aria-label="Seek"
            className="absolute inset-0 h-4 w-full cursor-pointer appearance-none bg-transparent opacity-0 disabled:cursor-default"
          />
        </div>
        <span className="font-mono text-[9px] tabular-nums text-cream/60">{fmt(duration)}</span>
      </div>


      {message && (
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-cream/80">
          {message}
        </p>
      )}

      {/* Keep Spotify's audio engine mounted inside the viewport, but never over
          an interactive control. Custom player controls drive it through the API. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 right-0 size-px overflow-hidden opacity-0"
      >
        <div ref={embedRef} className="h-20 w-80" />
      </div>
    </section>
  );
}
