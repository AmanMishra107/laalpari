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

export function useSpotifyEmbed() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<EmbedController | null>(null);
  const pendingRef = useRef<string | null>(null);
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
            setIsPlaying(!e.data.isPaused);
            setPosition(e.data.position);
            setDuration(e.data.duration);
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
    setUri(nextUri);
    const c = controllerRef.current;
    if (!c) return;
    c.loadUri(nextUri);
    if (autoplay) window.setTimeout(() => c.play(), 350);
  }, []);

  const toggle = useCallback(() => controllerRef.current?.togglePlay(), []);
  const seek = useCallback((seconds: number) => controllerRef.current?.seek(seconds), []);

  return { hostRef, ready, isPlaying, position, duration, uri, load, toggle, seek };
}
