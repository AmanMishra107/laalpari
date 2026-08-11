import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  // Hard-pin Nitro to the Vercel preset so `npm run build` always produces
  // the `.vercel/output/` Build Output API structure, both locally and in CI.
  // Force-bundle @tanstack/react-start so all its exports (including
  // createMiddleware) are available in the SSR bundle — without this, Nitro
  // externalizes the package and the SSR runtime sees createMiddleware as undefined,
  // crashing every request with "TypeError: createMiddleware is not a function".
  nitro: {
    preset: "vercel",
    externals: {
      inline: [
        "@tanstack/react-start",
        "@tanstack/react-router",
        "@tanstack/router-core",
        "@tanstack/history",
      ],
    },
  },
});
