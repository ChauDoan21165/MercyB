# Sentry Chunk Reload Local Patch

## Problem

Production Sentry reported stale dynamic-import failures such as:

- `TypeError: Importing a module script failed`
- `Failed to fetch dynamically imported module`

These can happen when a browser or in-app webview keeps an old app shell after a deploy and tries to load hashed chunks that no longer exist.

## Files Changed

- `src/main.tsx`

## Behavior

The existing stale-chunk recovery already performs a one-time cache-busting reload. This local patch makes the global `window.error` path pass the full error haystack into the chunk matcher when the haystack looks like a chunk/module-script load failure.

That means browser variants where the useful signal lives in `ErrorEvent.message`, `ErrorEvent.filename`, or the serialized error now trigger the existing friendly stale-deploy recovery instead of falling through as a generic fatal error.

## Reload-Loop Guard

- `__mb_chunk_reload_once__`

The existing sessionStorage/window fallback guard is unchanged and still prevents reload loops.

## Checks Run

- `npm run typecheck` PASS
- `npx vitest run src/lib/__tests__/chunkLoadError.test.ts src/lib/__tests__/lazyWithRetry.test.ts src/lib/__tests__/preloadRecovery.test.ts src/lib/__tests__/chunkReload.test.ts` PASS, 33/33 tests
- `git diff --check` PASS

## Risk / Rollback

Risk is low because this only reuses the existing chunk-load matcher and one-time reload path. It does not broaden recovery to unrelated errors unless the existing matcher identifies the error haystack as a stale chunk/module-script failure.

Rollback: revert the `src/main.tsx` change and remove this handoff note.
