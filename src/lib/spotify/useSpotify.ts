import { useCallback, useEffect, useRef, useState } from "react";
import { getAccessToken, readToken, logout, beginLogin, hasClientId } from "./auth";
import {
  getMe,
  getPlaybackState,
  normalize,
  playUris,
  playContext as apiPlayContext,
  transferPlayback,
  searchTrack,
} from "./api";

import type { SpotifyTrack } from "./api";

type SdkPlayer = {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (event: string, cb: (payload: never) => void) => void;
  togglePlay: () => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  seek: (ms: number) => Promise<void>;
  setVolume: (v: number) => Promise<void>;
};

declare global {
  interface Window {
    Spotify?: { Player: new (opts: Record<string, unknown>) => SdkPlayer };
    onSpotifyWebPlaybackSDKReady?: () => void;
  }
}

export type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "error";

export function useSpotify() {
  const [connected, setConnected] = useState(false);
  const [premium, setPremium] = useState<boolean | null>(null);
  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const playerRef = useRef<SdkPlayer | null>(null);
  const deviceRef = useRef<string | null>(null);

  useEffect(() => {
    setConnected(Boolean(readToken()));
  }, []);

  useEffect(() => {
    if (!connected) return;
    let cancelled = false;
    void (async () => {
      try {
        const me = await getMe();
        if (cancelled) return;
        setPremium(me?.product === "premium");
      } catch {
        if (!cancelled) setMessage("RADIO SIGNAL LOST");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [connected]);

  // Web Playback SDK
  useEffect(() => {
    if (!connected || premium !== true || playerRef.current) return;
    const boot = () => {
      if (!window.Spotify) return;
      const player = new window.Spotify.Player({
        name: "BUS.WTF — Window Seat Radio",
        volume,
        getOAuthToken: (cb: (t: string) => void) => {
          void getAccessToken().then((t) => t && cb(t));
        },
      });
      playerRef.current = player;
      player.addListener("ready", ((e: { device_id: string }) => {
        deviceRef.current = e.device_id;
        void transferPlayback(e.device_id, false).catch(() => undefined);
      }) as never);
      player.addListener("player_state_changed", ((state: {
        paused: boolean;
        position: number;
        duration: number;
        shuffle: boolean;
        repeat_mode: number;
        track_window: { current_track: Parameters<typeof normalize>[0] };
      } | null) => {
        if (!state) return;
        setTrack(normalize(state.track_window.current_track));
        setProgress(state.position);
        setDuration(state.duration);
        setShuffle(Boolean(state.shuffle));
        setRepeat(state.repeat_mode !== 0);
        setStatus(state.paused ? "paused" : "playing");
      }) as never);
      player.addListener("initialization_error", (() => setPremium(false)) as never);
      player.addListener("account_error", (() => setPremium(false)) as never);
      void player.connect();
    };

    if (window.Spotify) boot();
    else {
      window.onSpotifyWebPlaybackSDKReady = boot;
      if (!document.getElementById("spotify-sdk")) {
        const s = document.createElement("script");
        s.id = "spotify-sdk";
        s.src = "https://sdk.scdn.co/spotify-player.js";
        s.async = true;
        document.body.appendChild(s);
      }
    }
    return () => {
      playerRef.current?.disconnect();
      playerRef.current = null;
    };
  }, [connected, premium, volume]);

  // Progress ticker + remote sync fallback
  useEffect(() => {
    if (status !== "playing") return;
    const tick = setInterval(() => setProgress((p) => Math.min(p + 1000, duration || p + 1000)), 1000);
    return () => clearInterval(tick);
  }, [status, duration]);

  useEffect(() => {
    if (!connected || premium === true) return;
    const sync = setInterval(() => {
      void getPlaybackState()
        .then((s) => {
          if (!s?.item) return;
          setTrack(normalize(s.item));
          setProgress(s.progress_ms);
          setDuration(s.item.duration_ms);
          setStatus(s.is_playing ? "playing" : "paused");
        })
        .catch(() => undefined);
    }, 5000);
    return () => clearInterval(sync);
  }, [connected, premium]);

  const connect = useCallback(() => {
    if (!hasClientId()) {
      setMessage("SPOTIFY NOT CONFIGURED");
      return;
    }
    void beginLogin().catch(() => setMessage("RADIO SIGNAL LOST"));
  }, []);

  const disconnect = useCallback(() => {
    logout();
    playerRef.current?.disconnect();
    playerRef.current = null;
    setConnected(false);
    setPremium(null);
    setTrack(null);
    setStatus("idle");
  }, []);

  const resolve = useCallback(async (title: string, artist: string) => {
    return searchTrack(title, artist);
  }, []);

  const play = useCallback(
    async (uri?: string) => {
      if (!connected) return connect();
      if (premium === false) {
        setMessage("Spotify Premium is required for browser playback.");
        return;
      }
      setStatus("loading");
      try {
        if (uri) await playUris([uri], deviceRef.current ?? undefined);
        else await playerRef.current?.togglePlay();
        setMessage(null);
      } catch {
        setStatus("error");
        setMessage("RADIO SIGNAL LOST");
      }
    },
    [connected, connect, premium],
  );

  const playPlaylist = useCallback(
    async (playlistId: string, offset = 0) => {
      if (!connected) return connect();
      if (premium === false) {
        setMessage("Spotify Premium is required for browser playback.");
        return;
      }
      setStatus("loading");
      try {
        await apiPlayContext(
          `spotify:playlist:${playlistId}`,
          offset,
          deviceRef.current ?? undefined,
        );
        setMessage(null);
      } catch {
        setStatus("error");
        setMessage("RADIO SIGNAL LOST");
      }
    },
    [connected, connect, premium],
  );


  const toggle = useCallback(async () => {
    if (!connected) return connect();
    if (premium === false) {
      setMessage("Spotify Premium is required for browser playback.");
      return;
    }
    try {
      await playerRef.current?.togglePlay();
    } catch {
      setMessage("RADIO SIGNAL LOST");
    }
  }, [connected, connect, premium]);

  const next = useCallback(() => void playerRef.current?.nextTrack().catch(() => undefined), []);
  const previous = useCallback(
    () => void playerRef.current?.previousTrack().catch(() => undefined),
    [],
  );
  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    void playerRef.current?.setVolume(v).catch(() => undefined);
  }, []);

  return {
    connected,
    premium,
    status,
    track,
    progress,
    duration,
    volume,
    shuffle,
    repeat,
    message,
    setMessage,
    connect,
    disconnect,
    play,
    playPlaylist,

    toggle,
    next,
    previous,
    setVolume,
    setShuffle,
    setRepeat,
    resolve,
  };
}
