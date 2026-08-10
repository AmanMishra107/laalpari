import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPlaylistTracks, getTrackArtwork } from "@/lib/playlist.functions";

// hero image served from /public/hero-bus.jpg
import { getDecade } from "@/data/decades";
import { stops } from "@/data/journey";
import { useJourney } from "@/hooks/useJourney";
import { RouteBoard } from "@/components/bus/RouteBoard";
import { TopBar } from "@/components/bus/TopBar";



import { FoundMemories } from "@/components/bus/FoundMemories";
import { DecadePlaylist } from "@/components/bus/DecadePlaylist";
import { SpotifyPlayer } from "@/components/bus/SpotifyPlayer";
import { ShayariTicker } from "@/components/bus/ShayariTicker";
import { useSpotify } from "@/lib/spotify/useSpotify";
import { useSpotifyEmbed } from "@/lib/spotify/useEmbed";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LaalPari--Radio" },
      {
        name: "description",
        content:
          "A Lal Pari time journey: ride an old Maharashtra ST bus from Pune to Satara through six stops and seven decades of Bollywood music.",
      },
      { property: "og:title", content: "BUS.WTF — The Lal Pari Time Journey" },
      {
        property: "og:description",
        content:
          "One journey. Six stops. Seven decades. Window seat. Old songs. Long route.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const j = useJourney();
  const s = useSpotify();
  const [decadeId, setDecadeId] = useState(stops[0]!.decadeIds[0]!);
  const [clock, setClock] = useState("06:15");
  const [showPlaylist, setShowPlaylist] = useState(false);
  const decade = useMemo(() => getDecade(decadeId), [decadeId]);
  const queryClient = useQueryClient();

  // the radio only changes once the bus has actually arrived
  useEffect(() => {
    if (!j.moving) setDecadeId(j.stop.decadeIds[0]!);
  }, [j.moving, j.stop]);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = now.getHours();
      const h12 = h % 12 === 0 ? 12 : h % 12;
      setClock(
        `${h12}:${String(now.getMinutes()).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`,
      );
    };

    tick();
    const t = setInterval(tick, 20000);
    return () => clearInterval(t);
  }, []);

  const [queueIndex, setQueueIndex] = useState<number | null>(null);
  const queueIndexRef = useRef<number | null>(null);
  queueIndexRef.current = queueIndex;

  const { data: fetchedQueue = [], isSuccess: queueReady } = useQuery({
    queryKey: ["playlist", decade.playlistId],
    queryFn: () => getPlaylistTracks({ data: { playlistId: decade.playlistId! } }),
    enabled: Boolean(decade.playlistId),
    staleTime: Infinity,
  });
  // Some eras drop their opening tracks (e.g. the 60s skips the first two).
  const queue = useMemo(
    () => fetchedQueue.slice(decade.skipTracks ?? 0),
    [fetchedQueue, decade.skipTracks],
  );

  const queueRef = useRef(queue);
  queueRef.current = queue;

  const embedLoadRef = useRef<((uri: string) => void) | null>(null);

  const playQueueIndex = useCallback((i: number) => {
    const list = queueRef.current;
    if (!list.length) return false;
    const idx = ((i % list.length) + list.length) % list.length;
    setQueueIndex(idx);
    setStarted(true);
    embedLoadRef.current?.(list[idx]!.uri);
    return true;
  }, []);



  const embed = useSpotifyEmbed(() => {
    if (queueIndexRef.current != null) playQueueIndex(queueIndexRef.current + 1);
  });
  embedLoadRef.current = embed.load;
  const usePremium = s.connected && s.premium === true;

  // Has the user actually started this era's queue yet? Until then the play
  // button must kick off a real load (with retries) instead of toggling the
  // silently preloaded controller.
  const [started, setStarted] = useState(false);

  // Prime the opening track before controls become available, and cache the
  // first two covers so track 1 and the first Next action need no extra fetch.
  useEffect(() => {
    if (usePremium || !embed.ready || !queue[0]) return;
    embed.prepare(queue[0].uri);
    // Show the real first track in the player, not a hardcoded placeholder.
    setQueueIndex(0);
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
    setStarted(false);
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
      {/* Static hand-painted hero scene */}
      <div className="absolute inset-0">
        <img
          src="/hero-bus.jpg"
          alt="A young man with earphones at the window seat of a red Maharashtra ST bus at sunset"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/60" />
      </div>

      {/* Title — centred at the top */}
      <div className="pointer-events-none absolute left-1/2 top-[12%] z-30 -translate-x-1/2 text-center sm:top-[14%]">
        <h1
          className="font-marathi text-[clamp(4.4rem,13vw,10rem)] leading-none text-sun [text-shadow:0_4px_22px_rgba(0,0,0,0.8)]"

          style={{ fontFamily: "var(--font-marathi)" }}
        >
          लालपरी
        </h1>
      </div>






      {/* Poster UI */}
      <div
        className="relative z-30 grid h-dvh grid-rows-[auto_1fr_auto] px-3 pb-4 sm:px-8 sm:pb-6"
        style={{
          paddingTop: "max(0.5rem, env(safe-area-inset-top))",
          paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        }}
      >
        <header className="-mx-3 -mt-2 sm:-mx-8">
          <TopBar
            clock={clock}
            playlistOpen={showPlaylist}
            onTogglePlaylist={() => setShowPlaylist((v) => !v)}
          />
        </header>


        {/* Middle */}
        <div className="relative flex min-h-0 items-start justify-end pt-1">
          {showPlaylist && (
            <div className="animate-in fade-in slide-in-from-top-2 max-h-full w-[15rem] overflow-y-auto rounded-2xl border border-white/20 bg-white/5 p-2 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.6)] backdrop-blur-xl duration-300 sm:w-[19rem] sm:p-3">
              <DecadePlaylist
                decade={decade}
                tracks={queue}
                activeIndex={queueIndex}
                onSelect={(i) => void playIndex(i)}
                activeTitle={s.track?.name ?? null}
                connected={s.connected}
              />

              {j.stop.decadeIds.length > 1 && (
                <div className="mt-2 flex gap-1">
                  {j.stop.decadeIds.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDecadeId(d)}
                      className={`rounded-full px-2 py-[2px] font-mono text-[9px] uppercase tracking-[0.2em] ${d === decadeId ? "bg-white/25 text-white" : "text-white/60 hover:text-white"
                        }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>



        {/* Bottom */}
        <footer className="mx-auto flex w-full max-w-lg flex-col items-stretch gap-3 sm:gap-4">
          <ShayariTicker />
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
                : started && embed.uri
                  ? embed.toggle()
                  : void playIndex(queueIndex ?? 0)
            }

            onNext={goNext}
            onPrev={goPrev}
            onSeek={(ms) => (usePremium ? void s.seek?.(ms) : embed.seek(Math.floor(ms / 1000)))}
            message={j.moving ? "CHANGING RADIO…" : !playerReady ? "TUNING THE RADIO…" : s.message}
          />

          <RouteBoard
            index={j.index}
            nextIndex={j.nextIndex}
            onSelect={(i) => void j.travelTo(i)}
          />
        </footer>

      </div>
    </main>
  );
}
