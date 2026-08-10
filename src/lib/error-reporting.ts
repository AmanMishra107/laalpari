// Error reporting utility for runtime error capture
// Logs errors to the console in development; can be extended with any error tracking service (e.g. Sentry)

type ErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  const message =
    error instanceof Response
      ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`
      : error instanceof Error
        ? error.message
        : String(error);

  const stack = error instanceof Error ? error.stack : undefined;

  // Log to console in all environments
  console.error("[LaalPaari Radio] Runtime Error:", message, { context, stack });
}
