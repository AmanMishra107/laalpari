import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  // Hard-pin Nitro to the Vercel preset so `npm run build` always produces
  // the `.vercel/output/` Build Output API structure, both locally and in CI.
  nitro: { preset: "vercel" },
});
