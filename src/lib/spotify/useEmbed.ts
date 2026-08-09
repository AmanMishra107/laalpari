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
  const endedRef = useRef(false);
  const retryRef = useRef<number[]>([]);
  const gotUpdateRef = useRef(false);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;
  const [ready, setReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [uri, setUri] = useState<string | null>(null);

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
            if (!e.data.isPaused || e.data.position > 0) {
              gotUpdateRef.current = true;
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
  }, []);

  const load = useCallback((nextUri: string, autoplay = true) => {
    pendingRef.current = nextUri;
    endedRef.current = false;
    gotUpdateRef.current = false;
    setUri(nextUri);
    setPosition(0);
    retryRef.current.forEach((t) => window.clearTimeout(t));
    retryRef.current = [];

    // The iframe may still be booting on the very first clicks — retry until it answers.
    const attempt = (n: number) => {
      const c = controllerRef.current;
      if (!c || pendingRef.current !== nextUri) return;
      c.loadUri(nextUri);
      if (autoplay) c.play();
      if (!gotUpdateRef.current && n < 6) {
        retryRef.current.push(window.setTimeout(() => attempt(n + 1), 500));
      }
    };
    attempt(0);
  }, []);


  const toggle = useCallback(() => controllerRef.current?.togglePlay(), []);
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

  return { hostRef, ready, isPlaying, position, duration, uri, load, toggle, seek, setVolume };
}

