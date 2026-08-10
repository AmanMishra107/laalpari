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
      className="player-glass flex w-full items-center gap-3 rounded-full py-2 pl-2 pr-3 sm:gap-4 sm:py-2.5 sm:pl-2.5 sm:pr-6"
    >
      {/* vinyl disc */}
      <div className="relative size-[52px] shrink-0 sm:size-[68px]">
        <div
          className="size-full overflow-hidden rounded-full border border-white/15 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.8)] animate-[spin_9s_linear_infinite]"
          style={{ animationPlayState: isPlaying ? "running" : "paused" }}
        >

          {track?.artwork ? (
            <img
              key={track.artwork}
              src={track.artwork}
              alt={`Album artwork for ${track.name}`}
              width={136}
              height={136}
              className="size-full animate-[fade-in_320ms_ease-out] object-cover"
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
        <p className="truncate text-[13px] font-semibold leading-tight text-white transition-opacity duration-300 sm:text-[15px]">
          {track?.name ?? fallbackTitle}
        </p>
        <p className="mt-0.5 truncate text-[11px] leading-tight text-white/60 sm:text-[12px]">
          {track?.artists ?? fallbackArtist}
        </p>

        <div className="group relative mt-2.5 h-3">
          <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/25 transition-[height] duration-200 group-hover:h-[5px]">
            <div
              className={`h-full origin-left rounded-full bg-white/90 ${
                loading ? "animate-pulse" : ""
              }`}
              style={{
                width: "100%",
                transform: `scaleX(${pct / 100})`,
                transition: scrub != null ? "none" : "transform 120ms linear",
              }}
            />
          </div>
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-[0_0_10px_rgba(255,255,255,0.6)] transition-opacity duration-200 group-hover:opacity-100"
            style={{ left: `${pct}%` }}
          />
          <input
            type="range"
            min={0}
            max={Math.max(1, duration)}
            step={200}
            value={Math.min(shown, duration || 0)}
            onChange={(e) => {
              const v = Number(e.target.value);
              setScrub(v);
              if (scrubTimer.current) window.clearTimeout(scrubTimer.current);
              // Commit once the drag settles — no stutter mid-scrub.
              scrubTimer.current = window.setTimeout(() => {
                onSeek?.(v);
                setScrub(null);
              }, 140);
            }}
            disabled={!duration || !onSeek}
            aria-label="Seek"
            className="absolute inset-0 h-3 w-full cursor-pointer appearance-none bg-transparent opacity-0 disabled:cursor-default"
          />
        </div>

        <p className="mt-1 font-mono text-[10px] tabular-nums text-white/55">
          {fmt(shown)} / {fmt(duration)}
          {message && <span className="ml-2 uppercase tracking-[0.16em]">{message}</span>}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <button
          onClick={onPrev}
          disabled={disabled}
          aria-label="Previous track"
          className="grid size-7 place-items-center rounded-full text-white/75 transition duration-150 hover:scale-110 hover:text-white active:scale-90 disabled:opacity-35"
        >
          <SkipBack className="size-4 fill-current" />
        </button>

        <button
          onClick={onToggle}
          disabled={disabled}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="grid size-9 place-items-center rounded-full bg-white text-black shadow-[0_6px_18px_-8px_rgba(0,0,0,0.9)] transition duration-150 ease-out hover:scale-105 active:scale-95 disabled:opacity-60 sm:size-11"
        >
          {isPlaying ? (
            <Pause className="size-4 animate-[scale-in_160ms_ease-out] fill-current" />
          ) : (
            <Play className="size-4 translate-x-px animate-[scale-in_160ms_ease-out] fill-current" />
          )}
        </button>

        <button
          onClick={onNext}
          disabled={disabled}
          aria-label="Next track"
          className="grid size-7 place-items-center rounded-full text-white/75 transition duration-150 hover:scale-110 hover:text-white active:scale-90 disabled:opacity-35"
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
