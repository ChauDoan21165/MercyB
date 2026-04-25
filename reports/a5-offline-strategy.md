# A5 — Offline strategy (Step 8 / Performance)

## What lands in this branch

- **Source-controlled service worker config** via `vite-plugin-pwa` in
  `vite.config.ts`. The plugin still emits `dist/sw.js` at build time;
  Workbox is the runtime.
- **Manifest** updated: `name: "MercyBlade"`, `short_name: "Mercy"`,
  `lang: "vi"` (Vietnamese-first per CLAUDE.md non-negotiable #1).
- **Runtime caches** (additive — existing kids/music/images/room-audio
  caches kept):
  | Pattern                                  | Strategy            | Cache name      | Limits                                  |
  | ---------------------------------------- | ------------------- | --------------- | --------------------------------------- |
  | `/audio/kids/*.mp3`                      | CacheFirst          | `kids-audio`    | 500 entries · 30 days                    |
  | `/audio/music/*.mp3`                     | CacheFirst          | `music`         | 50 entries · 30 days                     |
  | `/images/mercy-kids*.png`                | CacheFirst          | `kids-images`   | 2000 entries · 30 days                   |
  | Supabase `room-audio` mp3                | CacheFirst          | `room-audio`    | 2000 entries · 30 days                   |
  | `/audio/*.mp3` and `/assets/audio/*.mp3` (non-kids/music) | CacheFirst | `lesson-audio` | **200 entries · 30 days** *(new)* |
  | `/api/*`                                 | NetworkFirst, 5s timeout | `api`        | **200 entries · 7 days** *(new)*         |
  | `/lessons/*.json` and `/data/*.json`     | StaleWhileRevalidate | `lessons`     | **200 entries · 14 days** *(new)*        |
- **Precache list** (`OFFLINE_PRECACHE_LESSONS` in
  `src/lib/offline/precacheManifest.ts`): a curated 35-room shortlist
  (15 Kids L1 + ~17 free adult rooms + 2 Kids L2). Workbox bundles
  these JSON files into the SW install payload so first-time offline
  visitors see a familiar lesson catalog. Only JSON — **no audio in
  the precache** (size budget; audio rides the runtime caches).
- **`offlineDetector.ts`** — `isOnline()`, `pingOnline()`,
  `subscribeOnlineStatus()`. Pure module, no React, jsdom-friendly.
- **`OfflineIndicator.tsx`** — top banner that renders only when
  offline. Vietnamese-first copy: "Đang ở chế độ offline — bạn vẫn
  có thể học những bài đã tải." Mounted in `main.tsx` next to
  `<AppRouter />`.

## What is NOT cached

- **Authenticated API calls that read user PII** (profile, billing).
  These ride the network-first `/api/*` rule but get evicted at 7 days
  and are gated by Supabase RLS — even a stale cache hit returns
  filtered data.
- **Audio files larger than ~5MB.** Workbox's runtime CacheFirst will
  store them if the browser allows, but we don't precache them, and
  the 200-entry / 30-day cap on `lesson-audio` self-limits growth.
- **Edge-function responses (`/functions/v1/*`).** Intentionally not
  matched by any rule — these are signed URL generators and security-
  sensitive flows; caching would create stale-token bugs.
- **Admin pages** — fall through to the default `NavigationRoute`
  network behavior; no offline support is offered.

## Cache size budget

| Cache name      | Max entries | Avg size | Budget        |
| --------------- | ----------- | -------- | ------------- |
| `kids-audio`    | 500         | ~80 KB   | ~40 MB        |
| `music`         | 50          | ~600 KB  | ~30 MB        |
| `kids-images`   | 2000        | ~30 KB   | ~60 MB        |
| `room-audio`    | 2000        | ~250 KB  | ~500 MB       |
| `lesson-audio`  | 200         | ~250 KB  | ~50 MB        |
| `api`           | 200         | ~5 KB    | ~1 MB         |
| `lessons`       | 200         | ~30 KB   | ~6 MB         |

**Steady-state target** for a typical user in week 1 of use: **under
50 MB**. Heavy users who wander into `room-audio` can grow much
larger; that bucket is intentionally permissive because audio is the
core product.

## Service worker registration

`registerPwaServiceWorker()` in `src/main.tsx` is **still a no-op**
(documented in CLAUDE.md "Boot entry"). This branch wires up all the
plumbing but does NOT flip registration on — that's a separate Chau
decision once the cache rules and offline indicator have soaked.

To re-enable later, replace the IIFE body with:

```ts
(function registerPwaServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  void import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({ immediate: true });
  });
})();
```

## Future work — daytime audit

- **Widen precache to top 100 rooms** once Step-7 telemetry has 30 days
  of room-visit analytics. Keep the current curated 35 as the floor;
  layer popularity-driven additions on top.
- **Audio downsizing for offline.** Generate a 32-kbps mono MP3 ladder
  for the precache list so the install payload stays under 100 MB even
  if we precache audio in a future round.
- **Custom offline fallback page** — currently 404s and chunk failures
  fall back to the boot-time error overlay. A purpose-built offline
  page with a "open a downloaded lesson" picker would lift retention
  for subway / flight users.
- **Cache eviction telemetry.** Add a `cache-cleaned` listener in the
  SW that ships eviction counts to analytics so we can size the
  budgets against real usage.
