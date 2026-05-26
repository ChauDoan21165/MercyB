# Offline Lite v1 — MercyBlade foundation spec

Owner: A1
Status: foundation only — no UI wired, no SW changes
Last updated: 2026-04-29

## Purpose

This document defines the **minimum** offline surface for MercyBlade.
It is intentionally conservative. We are not building "full offline mode".
We are building a foundation that:

- lets a user open a previously downloaded room while on the subway
- remembers a tiny number of safe writes to retry when online again
- never lies to the learner about XP, streaks, certificates, or AI chat

If a feature is not on the "works offline" list below, treat it as online-only.

## What works offline (v1 scope)

- Opening a room that has already been downloaded (room JSON + audio cached on a previous online visit).
- Replaying audio files that are already in the Cache API store.
- Reading cached UI: room list shell, last-viewed room, kids-mode landing.
- Local-only practice loops that do not need a server response.
- Writing a small number of safe events to a sync queue (e.g. `room_completed`, `lesson_event`) that will be flushed once the connection returns.

## What does NOT work offline

- AI chat / Mercy companion responses (no on-device model).
- Pronunciation scoring (Azure Speech is server-side).
- Login, signup, password reset, OAuth, magic links.
- Email and any Resend / Supabase Edge Function call.
- Pricing, billing, Stripe, redeem-code redemption.
- Admin dashboards.
- Image generation, TTS generation, content authoring.
- Streak authority (see "No offline authority" below).
- XP authority (see "No offline authority" below).
- Certificate issuance, share cards, leaderboard updates.
- Server-side analytics events that require auth.

## What syncs later

- ROOM_COMPLETED
- PRONUNCIATION_ATTEMPT_SAVED
- SRS_REVIEW_SUBMITTED

## No offline authority

Offline Lite v1 **never grants**:

- XP. We display "+0 (offline)" or hide the XP toast while offline. The server is authoritative.
- Streaks. Streaks only advance when the server confirms. A user who studies offline today and syncs tomorrow will be credited based on server-side rules — no client backdating.
- Certificates. Cert eligibility checks must run online.
- Tier upgrades or paid-content access changes.

The reason: offline tampering is trivial (devtools, system clock). Anything we credit offline becomes an attack surface the moment we monetize it.

## Free / Pro quota proposal

| Resource                    | Free                    | Pro                     | Notes |
|-----------------------------|-------------------------|-------------------------|-------|
| Downloaded rooms (offline)  | 5 rooms                 | 100 rooms               | enforced by `offlineDb` count + UI gate |
| Cached audio (Cache API)    | ~50 MB soft cap         | ~500 MB soft cap        | enforced by `audioCache.estimateUsage()` |
| Sync queue entries          | 500                     | 500                     | hard cap regardless of tier |
| Queue retention             | 14 days                 | 14 days                 | hard cap regardless of tier |
| Kids mode rooms             | unlimited (bundled)     | unlimited (bundled)     | kids audio ships in `/public/audio/kids/` — never counts against quota |

These numbers are a starting point. Telemetry from real users will tune them post-launch. Quota is enforced in the app layer (`offlineDb` + `audioCache`), not in RLS.

## Logout cleanup rules

When a user logs out:

1. **Clear the sync queue.** Pending writes belong to the previous session; replaying them under a new account is a data-leak risk.
2. **Clear downloaded room JSON** in `offlineDb` (table: `rooms`).
3. **Clear cached audio** in the Cache API `mb-audio-v1` cache.
4. **Keep**: kids-mode bundled audio in `/public/audio/kids/` (it's static + non-PII).
5. **Keep**: the `meta` table in `offlineDb` only for non-PII keys (e.g. `contentVersion`, `lastSeenAppVersion`).
6. **Reset** `localStorage` keys prefixed `mb_offline_*`.

A single helper `clearOfflineForLogout()` lives next to `offlineDb.ts` and must be called from the auth signOut path. (Foundation only — we expose the helper now; wiring into auth is a follow-up.)

## contentVersion rules

`contentVersion` is a single integer stored in `offlineDb.meta`. It guards the room and audio caches against stale data after a deploy.

Rules:

1. The app reads `version.json` (already produced by the build) at boot and compares its `contentVersion` to the local one.
2. If the server version is **higher**, the app:
   - clears the `rooms` table in `offlineDb` (room JSON).
   - leaves audio cache alone (audio rarely changes; clearing it would trigger huge re-downloads on weak connections).
   - writes the new version to `offlineDb.meta.contentVersion`.
3. If the server version is **equal or lower**, no action.
4. Audio gets its own version key (`audioCacheVersion` in meta) bumped only when room audio is regenerated. A bump clears the audio Cache.
5. Mismatched versions never block the user from opening a cached room — degraded data is better than no data.

## Storage choices

| Concern                    | API                  | Why |
|----------------------------|----------------------|-----|
| Structured records         | IndexedDB            | survives reload, large quota, async, indexed reads |
| Audio blobs                | Cache API            | designed for response objects, plays directly via `URL.createObjectURL` or `cache.match` → `Response.body` |
| Tiny preferences (theme, last route, "hasSeenOfflineHint") | `localStorage` | keep it under ~5 KB total, prefix `mb_offline_` |

We do NOT use:

- `sessionStorage` — wiped per tab, useless for offline.
- WebSQL — deprecated.
- A 3rd-party IDB wrapper (`idb`, `dexie`, `localforage`) — adds bytes, and the schema we need is small. Revisit if the schema grows beyond ~3 stores.

## Files in this foundation

- `docs/offline-lite-v1.md` — this document.
- `src/hooks/useOnlineStatus.ts` — React hook, thin wrapper over the existing `subscribeOnlineStatus` in `src/lib/offline/offlineDetector.ts`. Returns `{ isOnline }`.
- `src/lib/offline/offlineDb.ts` — IndexedDB wrapper. Three stores: `rooms`, `queue`, `meta`. Promise-based, no deps.
- `src/lib/offline/offlineQueue.ts` — sync queue shell. `enqueue`, `list`, `remove`, `flush(handler)`. No real network behavior wired yet — `flush` walks entries and calls a handler the consumer provides.
- `src/lib/offline/audioCache.ts` — Cache API wrapper. `put`, `match`, `delete`, `keys`, `clearAll`, `estimateUsage`.

## Out of scope for v1

- Hooking the offline foundation into RoomRenderer, ChatHub, Home, auth, or the Supabase client.
- A user-facing "Download for offline" button.
- A settings page to manage cached rooms.
- Background sync via Service Worker `sync` events.
- Conflict resolution beyond "first write wins, server is truth".
- IndexedDB migrations beyond v1 → v2 (we only define v1).

These come in v2 once the foundation is exercised by real consumers.

## Verification

This change set must pass:

```
npm run typecheck
npm run lint
```

There are no runtime callers yet, so `npm test` is unaffected. A follow-up PR will add unit tests against fake IndexedDB and Cache.
