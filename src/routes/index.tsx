import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import busScene from "@/assets/bus-scene.jpg";
import { decades, defaultDecadeId, getDecade } from "@/data/decades";
import { DecadeSelector } from "@/components/bus/DecadeSelector";
import { DecadePlaylist } from "@/components/bus/DecadePlaylist";
import { SpotifyPlayer } from "@/components/bus/SpotifyPlayer";
import { Label } from "@/components/bus/Label";
import { useSpotify } from "@/lib/spotify/useSpotify";
import { searchUrl } from "@/lib/spotify/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BUS.WTF — Window Seat Radio" },
      {
        name: "description",
        content:
          "Window seat. Old songs. Long route. A one-screen nostalgia ride through decades of Bollywood music inside an old Maharashtra ST bus.",
      },
      { property: "og:title", content: "BUS.WTF — Window Seat Radio" },
      {
        property: "og:description",
        content:
          "Window seat. Old songs. Long route. Decades of Bollywood music from an old Lal Pari bus.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [decadeId, setDecadeId] = useState(defaultDecadeId);
  const [booted, setBooted] = useState(false);
  const [passengers, setPassengers] = useState(38);
  const [clock, setClock] = useState("20:47");
  const [aboutOpen, setAboutOpen] = useState(false);
  const decade = useMemo(() => getDecade(decadeId), [decadeId]);
  const s = useSpotify();

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 1100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const tick = setInterval(() => {
      setPassengers((p) => Math.min(42, Math.max(33, p + (Math.random() > 0.5 ? 1 : -1))));
      const now = new Date();
      setClock(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      );
    }, 9000);
    return () => clearInterval(tick);
  }, []);

  const playIndex = useCallback(
    async (i: number) => {
      const t = decade.tracks[i];
      if (!t) return;
      if (!s.connected) {
        s.connect();
        return;
      }
      try {
        const found = await s.resolve(t.title, t.artist);
        if (found) await s.play(found.uri);
        else s.setMessage("RADIO SIGNAL LOST");
      } catch {
        s.setMessage("RADIO SIGNAL LOST");
      }
    },
    [decade, s],
  );

  const first = decade.tracks[0]!;
  const isPlaying = s.status === "playing";

  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-cream">
      {/* Scene */}
      <div className="paper-grain absolute inset-0">
        <img
          src={busScene}
          alt="Illustration of an old red Maharashtra ST bus interior with passengers, a conductor and a young man in headphones at the window"
          width={1920}
          height={1088}
          className="scene-motion size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cream/55 via-cream/10 to-transparent" />
      </div>

      {/* Loading curtain */}
      <div
        className={`absolute inset-0 z-50 grid place-items-center bg-cream transition-opacity duration-700 ${
          booted ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        aria-hidden={booted}
      >
        <div className="text-center">
          <p className="font-display text-4xl font-bold tracking-tight text-lalpari">BUS.WTF</p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/50">
            Waiting for the next stop…
          </p>
        </div>
      </div>

      {/* Poster UI */}
      <div
        className="relative z-10 grid h-dvh grid-rows-[auto_1fr_auto] px-5 py-4 sm:px-8 sm:py-6"
        style={{
          paddingTop: "max(1rem, env(safe-area-inset-top))",
          paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        }}
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl leading-none font-extrabold tracking-tight text-lalpari sm:text-3xl">
              BUS.WTF
            </h1>
            <Label className="mt-1 block">Window Seat Radio</Label>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <button
              onClick={s.connected ? s.disconnect : s.connect}
              className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/60 transition-colors hover:text-ink"
            >
              {s.connected && (
                <span className="size-1.5 rounded-full bg-spotify" aria-hidden />
              )}
              {s.connected ? "Connected" : "Connect Spotify"}
            </button>
            <button
              onClick={() => setAboutOpen((v) => !v)}
              aria-expanded={aboutOpen}
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/60 transition-colors hover:text-ink"
            >
              About
            </button>
          </div>
        </header>

        {/* Middle */}
        <div className="relative grid grid-cols-1 items-center md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="max-w-xl">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <Label>{clock}</Label>
              <Label>MH • ST</Label>
              <Label>{decade.route}</Label>
              <Label>Window seat</Label>
              <Label>{decade.routeLabel}</Label>
            </div>

            <h2 className="mt-3 font-display text-[clamp(2.2rem,7vw,4.75rem)] leading-[0.95] font-extrabold tracking-tight text-lalpari">
              खिडकी वाली सीट
            </h2>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.32em] text-ink/60">
              Window seat. Old songs. Long route.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
              <Label>ST Express</Label>
              <Label>Route 47</Label>
              <Label>Departure {decade.departure}</Label>
              <Label>No reservation</Label>
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-ink/60">
                <span
                  className={`size-1.5 rounded-full bg-lalpari ${isPlaying ? "on-air-dot" : ""}`}
                  aria-hidden
                />
                {passengers} on board
              </span>
            </div>

            {aboutOpen && (
              <p className="mt-3 max-w-sm text-[12px] leading-relaxed text-ink/70">
                BUS.WTF is a one-screen memory of a Maharashtra ST journey — the window seat, the
                chai stop, and whichever decade of songs you pick. Music streams from your own
                Spotify account.
              </p>
            )}
          </div>

          {/* Playlist card, sits over the calm side of the artwork */}
          <div className="mt-5 max-w-[19rem] rounded-lg bg-cream/70 p-3 backdrop-blur-[2px] md:mt-0 md:justify-self-end">
            <DecadePlaylist
              decade={decade}
              onSelect={(i) => void playIndex(i)}
              activeTitle={s.track?.name ?? null}
              connected={s.connected}
            />
          </div>
        </div>

        {/* Bottom */}
        <footer className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <DecadeSelector value={decadeId} onChange={setDecadeId} />
            <Label>
              {decades.length} routes • Next stop: Chai break
            </Label>
          </div>

          <div className="flex flex-col items-start gap-1.5 sm:items-end">
            {!s.connected && (
              <Label>Press play to start the journey</Label>
            )}
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
              track={s.track}
              fallbackTitle={first.title}
              fallbackArtist={first.artist}
              isPlaying={isPlaying}
              progress={s.progress}
              duration={s.duration || 0}
              volume={s.volume}
              shuffle={s.shuffle}
              repeat={s.repeat}
              onToggle={() => (s.track ? void s.toggle() : void playIndex(0))}
              onNext={s.next}
              onPrev={s.previous}
              onVolume={s.setVolume}
              onShuffle={() => s.setShuffle(!s.shuffle)}
              onRepeat={() => s.setRepeat(!s.repeat)}
              message={s.message}
            />
          </div>
        </footer>
      </div>
    </main>
  );
}
