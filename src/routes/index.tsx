import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPlaylistTracks, getTrackArtwork } from "@/lib/playlist.functions";

import busScene from "@/assets/bus-scene.jpg";
import { getDecade } from "@/data/decades";
import { SpotifyPlayer } from "@/components/bus/SpotifyPlayer";
import { useSpotify } from "@/lib/spotify/useSpotify";
import { useSpotifyEmbed } from "@/lib/spotify/useEmbed";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BUS.WTF — लाल परी" },
      { name: "description", content: "Window seat. Old songs. Long route." },
      { property: "og:title", content: "BUS.WTF — लाल परी" },
      {
        property: "og:description",
        content: "Window seat. Old songs. Long route.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const s = useSpotify();
  const [decadeId] = useState("60s");
  const decade = useMemo(() => getDecade(decadeId), [decadeId]);
  const queryClient = useQueryClient();

  const [queueIndex, setQueueIndex] = useState<number | null>(null);
  const queueIndexRef = useRef<number | null>(null);
  queueIndexRef.current = queueIndex;

  const { data: queue = [], isSuccess: queueReady } = useQuery({
    queryKey: ["playlist", decade.playlistId],
    queryFn: () => getPlaylistTracks({ data: { playlistId: decade.playlistId! } }),
    enabled: Boolean(decade.playlistId),
    staleTime: Infinity,
  });
  const queueRef = useRef(queue);
  queueRef.current = queue;

  const embedLoadRef = useRef<((uri: string) => void) | null>(null);

  const playQueueIndex = useCallback((i: number) => {
    const list = queueRef.current;
    if (!list.length) return false;
    const idx = ((i % list.length) + list.length) % list.length;
    setQueueIndex(idx);
    embedLoadRef.current?.(list[idx]!.uri);
    return true;
  }, []);

  const embed = useSpotifyEmbed(() => {
    if (queueIndexRef.current != null) playQueueIndex(queueIndexRef.current + 1);
  });
  embedLoadRef.current = embed.load;
  const usePremium = s.connected && s.premium === true;

  // Prime the opening track before controls become available, and cache the
  // first two covers so track 1 and the first Next action need no extra fetch.
  useEffect(() => {
    if (usePremium || !embed.ready || !queue[0]) return;
    embed.prepare(queue[0].uri);
    void Promise.all(
      queue.slice(0, 2).map((track) =>
        queryClient.prefetchQuery({
          queryKey: ["artwork", track.uri],
          queryFn: () => getTrackArtwork({ data: { uri: track.uri } }),
          staleTime: Infinity,
        }),
      ),
    );
  }, [decade.id, embed.ready, queryClient, queue, usePremium]);

  useEffect(() => {
    setQueueIndex(null);
  }, [decade.id]);

  const playIndex = useCallback(
    async (i: number) => {
      // No Premium session needed: the Spotify embed plays the era playlist track-by-track.
      if (!usePremium) {
        if (playQueueIndex(i)) {
          s.setMessage(null);
          return;
        }
        const t = decade.tracks[i];
        if (!t) return;
        const found = await s.resolve(t.title, t.artist).catch(() => null);
        if (found) {
          embed.load(found.uri);
          s.setMessage(null);
        } else {
          s.setMessage("CONNECT SPOTIFY FOR THIS ERA");
        }
        return;
      }

      try {
        if (decade.playlistId) {
          setQueueIndex(i);
          await s.playPlaylist(decade.playlistId, i);
          return;
        }
        const t = decade.tracks[i];
        if (!t) return;
        const found = await s.resolve(t.title, t.artist);
        if (found) await s.play(found.uri);
        else s.setMessage("RADIO SIGNAL LOST");
      } catch {
        s.setMessage("RADIO SIGNAL LOST");
      }
    },
    [decade, s, embed, usePremium, playQueueIndex],
  );

  const goNext = useCallback(() => {
    if (usePremium) return void s.next();
    playQueueIndex((queueIndexRef.current ?? -1) + 1);
  }, [usePremium, s, playQueueIndex]);

  const goPrev = useCallback(() => {
    if (usePremium) return void s.previous();
    playQueueIndex((queueIndexRef.current ?? 1) - 1);
  }, [usePremium, s, playQueueIndex]);

  const first = decade.tracks[0]!;
  const current = queueIndex != null ? (queue[queueIndex] ?? null) : null;
  const { data: artwork = null } = useQuery({
    queryKey: ["artwork", current?.uri],
    queryFn: () => getTrackArtwork({ data: { uri: current!.uri } }),
    enabled: Boolean(current?.uri),
    staleTime: Infinity,
  });

  const isPlaying = s.status === "playing";
  // The controller is ready and the complete queue is cached before controls
  // unlock. `prepare` has already issued loadUri for track 1 at this point.
  const playerReady = usePremium || (queueReady && Boolean(queue[0]) && embed.ready);

  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-cream">
      {/* Background scene */}
      <div className="paper-grain absolute inset-0">
        <img
          src={busScene}
          alt="Illustration of an old red Maharashtra ST bus interior with passengers"
          width={1920}
          height={1088}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/60" />
        <div className="absolute inset-0 bg-lalpari/10 mix-blend-multiply" />
      </div>

      {/* Center stage: player first, then the journey title below it */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-6">
        <SpotifyPlayer
          track={
            usePremium
              ? s.track
              : current
                ? ({
                    name: current.title,
                    artists: current.artist,
                    artwork: artwork ?? null,
                  } as never)
                : s.track
          }
          fallbackTitle={first.title}
          fallbackArtist={first.artist}
          isPlaying={usePremium ? isPlaying : embed.isPlaying}
          progress={usePremium ? s.progress : embed.position}
          duration={usePremium ? s.duration || 0 : embed.duration}
          embedRef={embed.hostRef}
          embedActive={!usePremium}
          embedLoaded={Boolean(embed.uri)}
          disabled={!playerReady}
          onToggle={() =>
            usePremium
              ? s.track
                ? void s.toggle()
                : void playIndex(0)
              : embed.uri
                ? embed.toggle()
                : void playIndex(0)
          }
          onNext={goNext}
          onPrev={goPrev}
          onSeek={(ms) =>
            usePremium ? void s.seek?.(ms) : embed.seek(Math.floor(ms / 1000))
          }
          message={!playerReady ? "TUNING THE RADIO…" : s.message}
        />

        <div className="text-center">
          <h1 className="font-marathi text-[18vw] leading-[0.8] text-cream drop-shadow-2xl md:text-[12vw]">
            लाल परी
          </h1>
          <p className="mt-4 font-mono text-xs tracking-[0.6em] text-cream/80 uppercase">
            MSRTC
          </p>
        </div>
      </div>
    </main>
  );
}
