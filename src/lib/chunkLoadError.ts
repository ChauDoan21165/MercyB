// Single source of truth for "is this a stale-chunk load failure?"
//
// Two callers need this matcher:
//   1. src/main.tsx — global window.error / unhandledrejection handler
//   2. src/lib/lazyWithRetry.ts — wrapper around React.lazy
//
// Keep these patterns aligned with the user-agent strings Vite/Vercel emit
// when a chunk hash 404s after a deploy.

export function looksLikeChunkLoadFailure(err: unknown): boolean {
  if (isChunkLoadRecoveryError(err)) return true;
  const message = errorMessage(err).toLowerCase();
  return (
    message.includes("failed to fetch dynamically imported module") ||
    message.includes("dynamically imported module") ||
    message.includes("importing a module script failed") ||
    message.includes("loading chunk") ||
    message.includes("chunkloaderror") ||
    message.includes("failed to import") ||
    // Safari when a stale chunk URL 404s and the SPA shell (index.html)
    // is served as the fallback — the browser refuses to execute it as
    // JS. Sentry surfaces this exact wording with both punctuation
    // variants ("'text/html'" and the bare phrase), so match the core
    // substring rather than the full sentence.
    message.includes("is not a valid javascript mime type")
  );
}

export class ChunkLoadRecoveryError extends Error {
  readonly cause: unknown;

  constructor(message: string, cause: unknown) {
    super(message);
    this.name = "ChunkLoadRecoveryError";
    this.cause = cause;
  }
}

export function isChunkLoadRecoveryError(err: unknown): err is ChunkLoadRecoveryError {
  return err instanceof ChunkLoadRecoveryError || (
    Boolean(err) &&
    typeof err === "object" &&
    (err as { name?: unknown }).name === "ChunkLoadRecoveryError"
  );
}

function errorMessage(err: unknown): string {
  if (err == null) return "";
  if (err instanceof Error) return `${err.name}: ${err.message}`;
  if (typeof err === "string") return err;
  try {
    // JSON.stringify returns undefined for bare undefined / functions /
    // symbols — fall back to String() so the matcher never receives a
    // non-string value to call .toLowerCase() on.
    return JSON.stringify(err) ?? String(err);
  } catch {
    return String(err);
  }
}
