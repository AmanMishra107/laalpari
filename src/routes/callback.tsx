import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { completeLogin } from "@/lib/spotify/auth";

export const Route = createFileRoute("/callback")({
  head: () => ({
    meta: [
      { title: "Connecting Spotify — BUS.WTF" },
      { name: "description", content: "Finishing the Spotify connection for BUS.WTF window seat radio." },
      { property: "og:title", content: "Connecting Spotify — BUS.WTF" },
      { property: "og:description", content: "Finishing the Spotify connection for BUS.WTF window seat radio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Callback,
});

function Callback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    if (!code || !state) {
      setError("THE BUS LOST SIGNAL");
      return;
    }
    void completeLogin(code, state)
      .then(() => navigate({ to: "/" }))
      .catch(() => setError("RADIO SIGNAL LOST"));
  }, [navigate]);

  return (
    <main className="grid h-dvh place-items-center bg-background px-6 text-center">
      <div>
        <p className="font-display text-3xl tracking-tight text-primary">BUS.WTF</p>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          {error ?? "Punching your ticket…"}
        </p>
      </div>
    </main>
  );
}
