import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Minimal YouTube IFrame player used as the mobile audio engine.
 * Spotify's web embed only serves 30s previews on mobile, so decades that
 * define a YouTube playlist fall back to this for full-length playback.
 */
type YTPlayer = {
    loadVideoById: (id: string) => void;
    cueVideoById: (id: string) => void;
    playVideo: () => void;
    pauseVideo: () => void;
    seekTo: (seconds: number, allowSeekAhead: boolean) => void;
    getCurrentTime: () => number;
    getDuration: () => number;
    destroy: () => void;
};

declare global {
    interface Window {
        YT?: {
            Player: new (
                el: HTMLElement | string,
                opts: Record<string, unknown>,
            ) => YTPlayer;
            PlayerState: { ENDED: number; PLAYING: number; PAUSED: number };
        };
        onYouTubeIframeAPIReady?: () => void;
    }
}

const SCRIPT_ID = "youtube-iframe-api";

function loadApi(): Promise<void> {
    if (typeof window === "undefined") return new Promise(() => { });
    if (window.YT?.Player) return Promise.resolve();
    return new Promise((resolve) => {
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            prev?.();
            resolve();
        };
        if (!document.getElementById(SCRIPT_ID)) {
            const s = document.createElement("script");
            s.id = SCRIPT_ID;
            s.src = "https://www.youtube.com/iframe_api";
            s.async = true;
            document.body.appendChild(s);
        }
    });
}

export function useYouTube(enabled: boolean, onEnded?: () => void) {
    const hostRef = useRef<HTMLDivElement | null>(null);
    const playerRef = useRef<YTPlayer | null>(null);
    const onEndedRef = useRef(onEnded);
    onEndedRef.current = onEnded;

    const [ready, setReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    // Ref that always mirrors isPlaying so event listeners never get a stale closure.
    const isPlayingRef = useRef(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [videoId, setVideoId] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled || typeof window === "undefined") return;
        let cancelled = false;
        void loadApi().then(() => {
            if (cancelled || !hostRef.current || playerRef.current || !window.YT) return;
            playerRef.current = new window.YT.Player(hostRef.current, {
                width: "320",
                height: "180",
                playerVars: { playsinline: 1, controls: 0, rel: 0, modestbranding: 1 },
                events: {
                    onReady: () => setReady(true),
                    onStateChange: (e: { data: number }) => {
                        const S = window.YT!.PlayerState;
                        if (e.data === S.ENDED) {
                            isPlayingRef.current = false;
                            setIsPlaying(false);
                            onEndedRef.current?.();
                        } else if (e.data === S.PLAYING) {
                            isPlayingRef.current = true;
                            setIsPlaying(true);
                        } else if (e.data === S.PAUSED) {
                            isPlayingRef.current = false;
                            setIsPlaying(false);
                        }
                    },
                },
            });
        });
        return () => {
            cancelled = true;
            playerRef.current?.destroy();
            playerRef.current = null;
            setReady(false);
        };
    }, [enabled]);

    // On mobile, locking the screen (visibilitychange → hidden) can silently
    // pause the YouTube player. When the screen unlocks we resume if we were
    // playing before. This also satisfies the Media Session "play" action on
    // iOS Safari which fires through this path.
    useEffect(() => {
        if (!enabled || typeof document === "undefined") return;
        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                const p = playerRef.current;
                if (!p || typeof p.playVideo !== "function") return;
                // isPlayingRef mirrors the isPlaying state without closure capture
                if (isPlayingRef.current) {
                    try { p.playVideo(); } catch { /* player may not be ready */ }
                }
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [enabled]);

    // Smooth progress polling (YT has no continuous progress event).
    useEffect(() => {
        if (!enabled) return;
        let frame = 0;
        const loop = () => {
            frame = requestAnimationFrame(loop);
            const p = playerRef.current;
            if (!p || typeof p.getCurrentTime !== "function") return;
            setPosition(p.getCurrentTime() * 1000);
            const d = p.getDuration();
            if (d) setDuration(d * 1000);
        };
        frame = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frame);
    }, [enabled]);

    const load = useCallback((id: string, autoplay = true) => {
        setVideoId(id);
        setPosition(0);
        setDuration(0);
        isPlayingRef.current = autoplay;
        setIsPlaying(autoplay);
        const p = playerRef.current;
        if (!p) return;
        if (autoplay) p.loadVideoById(id);
        else p.cueVideoById(id);
    }, []);

    const prepare = useCallback((id: string) => load(id, false), [load]);

    const toggle = useCallback(() => {
        const p = playerRef.current;
        if (!p) return;
        if (isPlaying) {
            isPlayingRef.current = false;
            p.pauseVideo();
        } else {
            isPlayingRef.current = true;
            p.playVideo();
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    const seek = useCallback((seconds: number) => {
        setPosition(seconds * 1000);
        playerRef.current?.seekTo(seconds, true);
    }, []);

    return { hostRef, ready, isPlaying, position, duration, videoId, load, prepare, toggle, seek };
}
