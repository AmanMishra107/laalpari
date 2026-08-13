import { useEffect, useRef } from "react";

interface MediaSessionOptions {
  title: string;
  artist: string;
  artwork?: string | null;
  isPlaying: boolean;
  duration?: number; // ms
  position?: number; // ms
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onSeek?: (ms: number) => void;
}

/**
 * Registers the app with the browser's Media Session API.
 *
 * This is the key reason music stops when the screen is locked: without this,
 * the OS/browser doesn't know the tab is playing audio and may suspend it.
 * With this hook active, the phone's lock screen will show track info and
 * play/pause/skip controls, and Chrome/Safari will keep the audio alive.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API
 */
export function useMediaSession({
  title,
  artist,
  artwork,
  isPlaying,
  duration,
  position,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onSeek,
}: MediaSessionOptions) {
  // Keep stable refs so action handlers never go stale
  const onPlayRef = useRef(onPlay);
  const onPauseRef = useRef(onPause);
  const onNextRef = useRef(onNext);
  const onPrevRef = useRef(onPrev);
  const onSeekRef = useRef(onSeek);
  onPlayRef.current = onPlay;
  onPauseRef.current = onPause;
  onNextRef.current = onNext;
  onPrevRef.current = onPrev;
  onSeekRef.current = onSeek;

  // Update metadata whenever the track changes
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    const artworkEntry: MediaImage[] = artwork
      ? [{ src: artwork, sizes: "512x512", type: "image/jpeg" }]
      : [];

    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      artwork: artworkEntry,
    });
  }, [title, artist, artwork]);

  // Sync playback state so the OS knows we're playing/paused
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  // Update position state so the lock-screen scrubber is accurate
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    if (duration == null || position == null) return;
    const durationSec = duration / 1000;
    const positionSec = position / 1000;
    if (!isFinite(durationSec) || durationSec <= 0) return;
    try {
      navigator.mediaSession.setPositionState({
        duration: durationSec,
        position: Math.min(positionSec, durationSec),
        playbackRate: 1,
      });
    } catch {
      // setPositionState can throw if values are out of range
    }
  }, [duration, position]);

  // Register action handlers once (stable via refs)
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    const handlers: Array<[MediaSessionAction, MediaSessionActionHandler]> = [
      ["play", () => onPlayRef.current?.()],
      ["pause", () => onPauseRef.current?.()],
      ["nexttrack", () => onNextRef.current?.()],
      ["previoustrack", () => onPrevRef.current?.()],
      [
        "seekto",
        (details) => {
          if (details.seekTime != null) {
            onSeekRef.current?.(details.seekTime * 1000);
          }
        },
      ],
    ];

    for (const [action, handler] of handlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        // Some browsers don't support all actions (e.g. seekto on older iOS)
      }
    }

    return () => {
      for (const [action] of handlers) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {
          // ignore
        }
      }
    };
  }, []); // intentionally empty — refs keep the callbacks fresh
}
