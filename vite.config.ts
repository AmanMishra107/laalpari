import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

function apiDevPlugin(): Plugin {
  return {
    name: "api-dev-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith("/api/playlist")) {
          const url = new URL(req.url, `http://${req.headers.host}`);
          const id = url.searchParams.get("id");
          if (!id) {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify([]));
            return;
          }
          try {
            const response = await fetch(`https://open.spotify.com/embed/playlist/${id}`, {
              headers: { "user-agent": "Mozilla/5.0", "accept-language": "en" },
            });
            if (!response.ok) {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify([]));
              return;
            }
            const html = await response.text();
            const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
            if (!match?.[1]) {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify([]));
              return;
            }
            const json = JSON.parse(match[1]);
            const list = json.props?.pageProps?.state?.data?.entity?.trackList ?? [];
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(list.map((t: any) => ({
              uri: t.uri,
              title: t.title,
              artist: t.subtitle,
              duration: t.duration,
              preview: t.audioPreview?.url ?? null,
            }))));
            return;
          } catch {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify([]));
            return;
          }
        }if (req.url?.startsWith("/api/youtube-playlist")) {
          const url = new URL(req.url, `http://${req.headers.host}`);
          const id = url.searchParams.get("id");
          if (!id) {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify([]));
            return;
          }
          try {
            const { parseYouTubePlaylist } = await import("./api/youtube-playlist.ts");
            const tracks = await parseYouTubePlaylist(id);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(tracks));
            return;
          } catch {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify([]));
            return;
          }
        }
        if (req.url?.startsWith("/api/artwork")) {
          const url = new URL(req.url, `http://${req.headers.host}`);
          const uri = url.searchParams.get("uri");
          if (!uri) {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ url: null }));
            return;
          }
          try {
            const id = uri.split(":").pop();
            const response = await fetch(`https://open.spotify.com/oembed?url=https://open.spotify.com/track/${id}`, {
              headers: { "user-agent": "Mozilla/5.0" },
            });
            if (!response.ok) {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ url: null }));
              return;
            }
            const json = await response.json();
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ url: json.thumbnail_url ?? null }));
            return;
          } catch {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ url: null }));
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [
    apiDevPlugin(),
    TanStackRouterVite({ routesDirectory: "./src/routes" }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
});



