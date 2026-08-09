import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SpotifyTrack } from "@/lib/spotify/api";

const fmt = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
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
  // Local scrub state so dragging the seek bar feels instant and never fights
  // the incoming playback updates.
  const [scrub, setScrub] = useState<number | null>(null);
  const scrubTimer = useRef<number | null>(null);
  useEffect(() => () => {
    if (scrubTimer.current) window.clearTimeout(scrubTimer.current);
  }, []);

  const shown = scrub ?? progress;
  const pct = duration ? Math.min(100, Math.max(0, (shown / duration) * 100)) : 0;
  const loading = !duration;

  return (
    <section
      aria-label="Window seat radio player"
      className="player-glass flex w-full items-center gap-4 rounded-full py-2.5 pl-2.5 pr-6"
    >
      {/* vinyl disc */}
      <div className="relative size-[68px] shrink-0">
        <div
          className="size-full overflow-hidden rounded-full border border-white/15 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.8)] animate-[spin_9s_linear_infinite]"
          style={{ animationPlayState: isPlaying ? "running" : "paused" }}
        >

          {track?.artwork ? (
            <img
              src={track.artwork}
              alt={`Album artwork for ${track.name}`}
              width={136}
              height={136}
              className="size-full object-cover"
            />
          ) : (
            <div className="grid size-full place-items-center bg-black/40 font-mono text-[9px] uppercase tracking-widest text-white/60">
              ST
            </div>
          )}
        </div>
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-black/70"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold leading-tight text-white">
          {track?.name ?? fallbackTitle}
        </p>
        <p className="mt-0.5 truncate text-[12px] leading-tight text-white/60">
          {track?.artists ?? fallbackArtist}
        </p>

        <div className="relative mt-2.5 h-3">
          <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-white/90" style={{ width: `${pct}%` }} />
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
            className="absolute inset-0 h-3 w-full cursor-pointer appearance-none bg-transparent opacity-0 disabled:cursor-default"
          />
        </div>

        <p className="mt-1 font-mono text-[10px] tabular-nums text-white/55">
          {fmt(progress)} / {fmt(duration)}
          {message && <span className="ml-2 uppercase tracking-[0.16em]">{message}</span>}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          onClick={onPrev}
          disabled={disabled}
          aria-label="Previous track"
          className="grid size-7 place-items-center rounded-full text-white/75 transition-colors hover:text-white disabled:cursor-wait disabled:opacity-35"
        >
          <SkipBack className="size-4 fill-current" />
        </button>

        <button
          onClick={onToggle}
          disabled={disabled}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="grid size-11 place-items-center rounded-full bg-white text-black shadow-[0_6px_18px_-8px_rgba(0,0,0,0.9)] transition-transform hover:scale-105 disabled:cursor-wait disabled:opacity-60"
        >
          {isPlaying ? (
            <Pause className="size-4 fill-current" />
          ) : (
            <Play className="size-4 translate-x-px fill-current" />
          )}
        </button>

        <button
          onClick={onNext}
          disabled={disabled}
          aria-label="Next track"
          className="grid size-7 place-items-center rounded-full text-white/75 transition-colors hover:text-white disabled:cursor-wait disabled:opacity-35"
        >
          <SkipForward className="size-4 fill-current" />
        </button>
      </div>

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
