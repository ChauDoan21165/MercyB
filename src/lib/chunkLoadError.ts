// Single source of truth for "is this a stale-chunk load failure?"
//
// Two callers need this matcher:
//   1. src/main.tsx — global window.error / unhandledrejection handler
//   2. src/lib/lazyWithRetry.ts — wrapper around React.lazy
//
// Keep these patterns aligned with the user-agent strings Vite/Vercel emit
// when a chunk hash 404s after a deploy.

export function looksLikeChunkLoadFailure(err: unknown): boolean {
  const message = errorMessage(err).toLowerCase();
  return (
    message.includes("failed to fetch dynamically imported module") ||
    message.includes("dynamically imported module") ||
    message.includes("importing a module script failed") ||
    message.includes("loading chunk") ||
    message.includes("chunkloaderror") ||
    message.includes("failed to import")
  );
}

function errorMessage(err: unknown): string {
  if (err instanceof Error) return `${err.name}: ${err.message}`;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}
