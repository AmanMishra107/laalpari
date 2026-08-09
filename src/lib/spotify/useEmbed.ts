import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Spotify Embed IFrame API — plays playlists/tracks with no OAuth required.
 * Logged-in Spotify users hear full tracks; everyone else hears previews.
 */
type EmbedController = {
  loadUri: (uri: string) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  resume: () => void;
  seek: (seconds: number) => void;
  addListener: (event: string, cb: (e: never) => void) => void;
  destroy: () => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: {
      createController: (
        el: HTMLElement,
        opts: { uri: string; width: string | number; height: string | number },
        cb: (c: EmbedController) => void,
      ) => void;
    }) => void;
  }
}

const SCRIPT_ID = "spotify-embed-api";

export function useSpotifyEmbed(onEnded?: () => void) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<EmbedController | null>(null);
  const pendingRef = useRef<string | null>(null);
  const prepareTimerRef = useRef<number | null>(null);
  const endedRef = useRef(false);
  const retryRef = useRef<number[]>([]);
  const shouldPlayRef = useRef(false);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;
  const [ready, setReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [uri, setUri] = useState<string | null>(null);
  const [preparedUri, setPreparedUri] = useState<string | null>(null);

  // Spotify emits playback_update roughly once a second, which makes a raw
  // progress bar tick in visible steps. Interpolate between events with rAF so
  // the bar and the timer glide continuously.
  const anchorRef = useRef({ position: 0, at: 0, playing: false });
  useEffect(() => {
    let frame = 0;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      const a = anchorRef.current;
      if (!a.playing) return;
      setPosition(a.position + (performance.now() - a.at));
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);


  useEffect(() => {
    if (typeof window === "undefined" || controllerRef.current) return;
    const host = hostRef.current;
    if (!host) return;

    const boot = (api: Parameters<NonNullable<Window["onSpotifyIframeApiReady"]>>[0]) => {
      api.createController(
        host,
        { uri: pendingRef.current ?? "spotify:track:0eGsygTp906u18L0Oimnem", width: "100%", height: 80 },
        (controller) => {
          controllerRef.current = controller;
          controller.addListener("playback_update", ((e: {
            data: { isPaused: boolean; position: number; duration: number };
          }) => {
            if (e.data.duration > 0 && pendingRef.current) {
              setPreparedUri(pendingRef.current);
              if (shouldPlayRef.current && e.data.isPaused) controller.play();
            }
            if (!e.data.isPaused || e.data.position > 0) {
              retryRef.current.forEach((t) => window.clearTimeout(t));
              retryRef.current = [];
            }
            setIsPlaying(!e.data.isPaused);
            setPosition(e.data.position);
            setDuration(e.data.duration);
            const d = e.data.duration;
            if (d > 0 && e.data.position >= d - 1200) {
              if (!endedRef.current) {
                endedRef.current = true;
                onEndedRef.current?.();
              }
            } else if (e.data.position < d - 2500) {
              endedRef.current = false;
            }
          }) as never);
          setReady(true);
           if (pendingRef.current) controller.loadUri(pendingRef.current);
        },
      );
    };

    window.onSpotifyIframeApiReady = boot;
    if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement("script");
      s.id = SCRIPT_ID;
      s.src = "https://open.spotify.com/embed/iframe-api/v1";
      s.async = true;
      document.body.appendChild(s);
    }

    return () => {
      if (prepareTimerRef.current !== null) window.clearTimeout(prepareTimerRef.current);
      retryRef.current.forEach((timer) => window.clearTimeout(timer));
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, []);

  const load = useCallback((nextUri: string, autoplay = true) => {
    pendingRef.current = nextUri;
    shouldPlayRef.current = autoplay;
    endedRef.current = false;
    setUri(nextUri);
    setPreparedUri(null);
    setPosition(0);
    if (prepareTimerRef.current !== null) window.clearTimeout(prepareTimerRef.current);
    retryRef.current.forEach((t) => window.clearTimeout(t));
    retryRef.current = [];

    const c = controllerRef.current;
    if (!c) return;

    // Load exactly once. Repeated loadUri calls reset the embed and can make the
    // opening tracks appear to be skipped. Playback retries only the play command.
    c.loadUri(nextUri);
    // Spotify does not consistently emit a paused playback_update after a
    // preload. The controller has accepted loadUri at this point; unlock after
    // a short settle period while keeping the requested URI unchanged.
    prepareTimerRef.current = window.setTimeout(() => {
      if (pendingRef.current === nextUri) setPreparedUri(nextUri);
    }, 1200);
    if (autoplay) {
      [300, 750, 1500, 2600].forEach((delay) => {
        retryRef.current.push(window.setTimeout(() => {
          if (pendingRef.current === nextUri && shouldPlayRef.current) c.play();
        }, delay));
      });
    }
  }, []);

  const prepare = useCallback((nextUri: string) => load(nextUri, false), [load]);
  const toggle = useCallback(() => {
    shouldPlayRef.current = !isPlaying;
    controllerRef.current?.togglePlay();
  }, [isPlaying]);
  const seek = useCallback((seconds: number) => {
    setPosition(seconds * 1000);
    controllerRef.current?.seek(seconds);
  }, []);

  /** The embed iframe exposes volume on newer builds; try every known shape. */
  const setVolume = useCallback((v: number) => {
    const c = controllerRef.current as unknown as
      | { setVolume?: (x: number) => void; iframeElement?: HTMLIFrameElement }
      | null;
    if (!c) return false;
    if (typeof c.setVolume === "function") {
      c.setVolume(v);
      return true;
    }
    return false;
  }, []);

  return {
    hostRef,
    ready,
    preparedUri,
    isPlaying,
    position,
    duration,
    uri,
    prepare,
    load,
    toggle,
    seek,
    setVolume,
  };
}

