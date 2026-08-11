// Minimal start.ts — avoids importing createMiddleware/createCsrfMiddleware
// which are not available in Nitro's SSR bundle.
// The Supabase auth attacher and error middleware have been removed from here;
// the app's server.ts wraps errors, and auth is handled client-side.
import { createStart } from "@tanstack/react-start";

export const startInstance = createStart(() => ({
  functionMiddleware: [],
  requestMiddleware: [],
}));

