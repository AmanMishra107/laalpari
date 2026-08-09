import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2 } from "lucide-react";
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
  volume,
  shuffle,
  repeat,
  onToggle,
  onNext,
  onPrev,
  onVolume,
  onShuffle,
  onRepeat,
  message,
  embedRef,
  embedActive,
  embedLoaded,
}: {
  track: SpotifyTrack | null;
  fallbackTitle: string;
  fallbackArtist: string;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: boolean;
  onToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onVolume: (v: number) => void;
  onShuffle: () => void;
  onRepeat: () => void;
  message: string | null;
  embedRef?: React.RefObject<HTMLDivElement | null>;
  embedActive?: boolean;
  embedLoaded?: boolean;
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
            aria-label="Previous track"
            className="grid size-9 place-items-center rounded-full text-cream/70 transition-colors hover:text-cream"
          >
            <SkipBack className="size-4" />
          </button>
          <div className="relative size-11">
            <button
              onClick={onToggle}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="grid size-11 place-items-center rounded-full bg-cream text-lalpari transition-transform hover:scale-105"
            >
              {isPlaying ? <Pause className="size-5" /> : <Play className="size-5 translate-x-px" />}
            </button>
            {/* Invisible Spotify embed engine, clipped to the play button so the
                real click lands inside the iframe (browsers require that gesture
                to start audio). No Spotify UI is ever visible. */}
            <div className="absolute inset-0 overflow-hidden rounded-full opacity-[0.001]">
              <div
                ref={embedRef}
                className="absolute h-[80px] w-[320px]"
                style={{ left: -266, top: -18 }}
              />
            </div>
          </div>

          <button
            onClick={onNext}
            aria-label="Next track"
            className="grid size-9 place-items-center rounded-full text-cream/70 transition-colors hover:text-cream"
          >
            <SkipForward className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="font-mono text-[9px] tabular-nums text-cream/60">{fmt(progress)}</span>
        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-cream/25">
          <div
            className="h-full rounded-full bg-cream transition-[width] duration-1000 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="font-mono text-[9px] tabular-nums text-cream/60">{fmt(duration)}</span>
      </div>

      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={onShuffle}
          aria-pressed={shuffle}
          aria-label="Shuffle"
          className={`transition-colors ${shuffle ? "text-spotify" : "text-cream/45 hover:text-cream/80"}`}
        >
          <Shuffle className="size-3.5" />
        </button>
        <button
          onClick={onRepeat}
          aria-pressed={repeat}
          aria-label="Repeat"
          className={`transition-colors ${repeat ? "text-spotify" : "text-cream/45 hover:text-cream/80"}`}
        >
          <Repeat className="size-3.5" />
        </button>
        <Volume2 className="size-3.5 text-cream/45" aria-hidden />
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => onVolume(Number(e.target.value))}
          aria-label="Volume"
          className="h-[3px] w-20 accent-cream"
        />
        <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.2em] text-cream/55">
          {isPlaying ? "On air" : "Paused at the window"}
        </span>
      </div>

      {message && (
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-cream/80">
          {message}
        </p>
      )}





    </section>
  );
}
