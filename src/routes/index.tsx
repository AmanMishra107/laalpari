import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPlaylistTracks, getTrackArtwork } from "@/lib/playlist.functions";

import busScene from "@/assets/bus-scene.jpg";
import { getDecade } from "@/data/decades";
import { stops } from "@/data/journey";
import { useJourney } from "@/hooks/useJourney";
import { JourneyIntro } from "@/components/bus/JourneyIntro";
import { RouteBoard } from "@/components/bus/RouteBoard";
import { Scenery } from "@/components/bus/Scenery";
import { StopChapter } from "@/components/bus/StopChapter";
import { Ticket } from "@/components/bus/Ticket";
import { ConductorCall } from "@/components/bus/ConductorCall";
import { FoundMemories } from "@/components/bus/FoundMemories";
import { DecadePlaylist } from "@/components/bus/DecadePlaylist";
import { SpotifyPlayer } from "@/components/bus/SpotifyPlayer";
import { Label } from "@/components/bus/Label";
import { useSpotify } from "@/lib/spotify/useSpotify";
import { useSpotifyEmbed } from "@/lib/spotify/useEmbed";
import { searchUrl } from "@/lib/spotify/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BUS.WTF — Pune → Satara, Seven Decades" },
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
  const [skip, setSkip] = useState(false);
  const [decadeId, setDecadeId] = useState(stops[0]!.decadeIds[0]!);
  const [secret, setSecret] = useState(false);
  const [clock, setClock] = useState("06:15");
  const decade = useMemo(() => getDecade(decadeId), [decadeId]);

  // the radio only changes once the bus has actually arrived
  useEffect(() => {
    if (!j.moving) setDecadeId(j.stop.decadeIds[0]!);
  }, [j.moving, j.stop]);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      );
    };
    tick();
    const t = setInterval(tick, 20000);
    return () => clearInterval(t);
  }, []);

  const [queueIndex, setQueueIndex] = useState<number | null>(null);
  const queueIndexRef = useRef<number | null>(null);
  queueIndexRef.current = queueIndex;

  const { data: queue = [] } = useQuery({
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
  const arrived = j.index === stops.length - 1 && !j.moving;

  const speed = j.phase === "cruise" ? 1 : j.phase === "accel" || j.phase === "brake" ? 0.45 : 0.06;
  const lean =
    j.phase === "accel"
      ? "translate3d(1.1%, 0, 0) rotate(-0.7deg)"
      : j.phase === "brake"
        ? "translate3d(-1%, 0.4%, 0) rotate(0.6deg)"
        : "translate3d(0,0,0) rotate(0deg)";

  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-cream">
      {/* Scene: interior + live window */}
      <div className="paper-grain absolute inset-0">
        <div
          className="size-full transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: lean }}
        >
          <img
            src={busScene}
            alt="Illustration of an old red Maharashtra ST bus interior with passengers, a conductor and a young man in headphones at the window"
            width={1920}
            height={1088}
            className={`size-full object-cover ${j.moving ? "bus-cruise" : "bus-idle"}`}
          />
          <Scenery stop={j.stop} moving={j.moving} speed={speed} />
        </div>

        {/* era colour wash — the world changes, the bus doesn't */}
        <div
          className="pointer-events-none absolute inset-0 transition-all duration-[1200ms] mix-blend-multiply"
          style={{
            background: `linear-gradient(to bottom, ${j.stop.palette.skyTop}, ${j.stop.palette.glow})`,
            opacity: j.stop.weather === "night" ? 0.4 : 0.16,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cream/80 via-cream/25 to-transparent md:from-cream/65 md:via-cream/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/55 via-transparent to-cream/55 md:from-cream/30 md:to-cream/25" />

        {/* hanging handle reacting to physics */}
        <div className="pointer-events-none absolute left-[42%] top-0 hidden md:block">
          <div
            className="handle-swing origin-top"
            style={{
              animationDuration: j.moving ? "1.1s" : "4.2s",
              transform: j.phase === "accel" ? "rotate(9deg)" : j.phase === "brake" ? "rotate(-9deg)" : undefined,
              transition: "transform 700ms ease-out",
            }}
          >
            <div className="h-14 w-px bg-ink/25" />
            <div className="size-4 rounded-b-full border border-ink/25" />
          </div>
        </div>
      </div>

      <ConductorCall text={j.announce} />
      {!j.moving && <FoundMemories stop={j.stop} />}

      {j.phase === "intro" && <JourneyIntro onDepart={j.depart} />}

      {/* Poster UI */}
      <div
        className="relative z-30 grid h-dvh grid-rows-[auto_1fr_auto] px-5 py-4 sm:px-8 sm:py-6"
        style={{
          paddingTop: "max(1rem, env(safe-area-inset-top))",
          paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        }}
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl leading-none font-extrabold tracking-tight text-lalpari sm:text-3xl">
              BUS.WTF
            </h1>
            <Label className="mt-1 block">
              {clock} · PUNE → SATARA · {j.reverseTrip ? "परतीचा प्रवास" : "ST EXPRESS"}
            </Label>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={s.connected ? s.disconnect : s.connect}
              className="flex items-center gap-1.5 rounded-full border border-ink/10 bg-cream/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink"
            >
              {s.connected && <span className="size-1.5 rounded-full bg-spotify" aria-hidden />}
              {s.connected ? "Connected" : "Connect Spotify"}
            </button>
          </div>
        </header>

        {/* Middle */}
        <div className="relative grid grid-cols-1 items-center gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <StopChapter
              stop={j.stop}
              moving={j.moving}
              nextName={j.nextIndex !== null ? stops[j.nextIndex]!.name : null}
            />

            {arrived && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/60">
                  Last stop — the music continues
                </span>
                <button
                  onClick={j.restart}
                  className="rounded-full bg-lalpari px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-cream transition-transform hover:scale-105"
                >
                  पुन्हा पुण्याला
                </button>
              </div>
            )}

            {secret && (
              <p className="mt-3 max-w-xs font-display text-[13px] leading-relaxed text-ink/70">
                काही प्रवास परत करता येतात.
                <br />
                काही फक्त आठवता येतात.
              </p>
            )}
          </div>

          <div className="flex flex-col items-start gap-3 md:items-end md:justify-self-end">
            <div className="max-w-[19rem] rounded-lg bg-cream/70 p-3 backdrop-blur-[2px]">
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
                      className={`rounded-full px-2 py-[2px] font-mono text-[9px] uppercase tracking-[0.2em] ${
                        d === decadeId ? "bg-lalpari text-cream" : "text-ink/50 hover:text-ink"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="hidden md:block">
              <Ticket stop={j.stop} index={j.index} onSecret={() => setSecret((v) => !v)} />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <footer className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full max-w-md">
            <RouteBoard
              index={j.index}
              nextIndex={j.nextIndex}
              skip={skip}
              onSkipChange={setSkip}
              onSelect={(i) => void j.travelTo(i, { skip })}
            />
          </div>

          <div className="flex flex-col items-start gap-1.5 sm:items-end">
            {s.premium === false && (
              <a
                href={searchUrl(first.title, first.artist)}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink/60 underline-offset-4 hover:text-ink hover:underline"
              >
                Open in Spotify
              </a>
            )}
            <SpotifyPlayer
              track={usePremium ? s.track : current ? { name: current.title, artists: current.artist, artwork: null } as never : s.track}
              fallbackTitle={first.title}
              fallbackArtist={first.artist}
              isPlaying={usePremium ? isPlaying : embed.isPlaying}
              progress={usePremium ? s.progress : embed.position}
              duration={usePremium ? s.duration || 0 : embed.duration}
              volume={s.volume}
              shuffle={s.shuffle}
              repeat={s.repeat}
              embedRef={embed.hostRef}
              embedActive={!usePremium}
              embedLoaded={Boolean(embed.uri)}
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

              onVolume={s.setVolume}
              onShuffle={() => s.setShuffle(!s.shuffle)}
              onRepeat={() => s.setRepeat(!s.repeat)}
              message={j.moving ? "CHANGING RADIO…" : s.message}
            />
          </div>
        </footer>
      </div>
    </main>
  );
}
