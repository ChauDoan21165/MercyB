# MercyB Technical Risk Assessment

Owner: engineering
Last updated: 2026-04-29
Status: living document — update as the system changes.

## 1. Overview

MercyB is now a large production-scale TypeScript app.

- Current size is about 293k TypeScript code lines / 354k raw TypeScript lines.
- Main risks are now **system-interaction risks**, not single-file bugs.

What this means in practice: most regressions today come from how subsystems combine (loader → renderer → audio → offline → permissions), not from one bad function. Reviews and fixes should follow the system seams, not just touch the file where a symptom appears.

## 2. Highest-risk areas

### A) `RoomRenderer.tsx`

- ~2000 lines.
- Core learning UI bottleneck — almost every learner-facing screen reaches it.
- Mixes UI, room data, audio, selection, and offline behavior in one file.
- **Should be reduced slowly, not rewritten.** A green-field rewrite would re-trigger every shape-of-data bug we've already absorbed.

Future extractions (in order of safety):
- `KeywordChipRow`
- `RoomMainContent`
- `RoomAudioSection`
- `EntrySelector`

Each extraction should ship as its own PR with no behavior changes.

### B) Service worker / Offline system

- Offline Lite v2 exists (app shell + IndexedDB room packs + Cache API audio).
- Risk: stale JS bundles, old UI in the wild, confusing dev testing (SW caching makes "did my change land?" hard to answer).
- Future: add a "New version available — refresh" banner driven by the SW `waiting` state.
- Future: document SW testing rules (when to clear, how to verify in DevTools, when not to register in dev).

### C) Multiple room data sources

The same room can come from any of:
- JSON files in `public/data/`
- Supabase DB rows
- IndexedDB offline packs (downloaded on device)
- Generated imports (`roomDataImports.ts`)
- Room registry (`roomList.ts`, manifest)

Risk: the same `roomId` can behave differently depending on which source the loader picked, because each source has slightly different shape (top-level vs per-entry keywords, audio fields, title fields, etc.).

Future goal: a single `normalizeRoomForRenderer(input)` that takes any of the above shapes and returns the one shape `RoomRenderer` consumes. Until then, every loader path must run the same pre-processors before handing data to the renderer.

### D) Teacher Mercy / Guide system

- Many overlapping Mercy / Guide / Teacher components (`MercyGuidePanel`, `MercySpeakTab`, `mercy-host` legacy folder, companion components, kid Mercy variants).
- Risk: duplicate behavior, unclear ownership, copy / state drift between surfaces.
- Future goal: document which components are **active** vs **deprecated**, and consolidate to a single owner per surface.

### E) Audio system

- Room audio (Supabase `room-audio` bucket), kids audio (bundled local), music (bundled local), offline cache (Cache API), pronunciation audio (Azure / mic).
- Risk: duplicate resolvers, unclear cache ownership (`audioCache` in `mercy/ttsCache.ts`, `audioCache` in `lib/performance/audio-cache.ts`, `lib/offline/audioCache.ts`).
- Future goal: an **audio policy doc** that locks down: which resolver owns which path, who writes which cache, what the kids invariant covers, and where pronunciation audio sits in the stack.

## 3. Medium-risk areas

- Large data files like `roomList.ts` and `roomDataImports.ts` — they're tedious to review but rarely surprising. Risk is mostly "diff noise hides a real change."
- Test coverage is strong but can **preserve old assumptions**. A passing test suite doesn't prove a behavior is still correct; it proves the behavior matches the test, which may itself be stale.

## 4. Current strengths

- Large app is **working** in production.
- Offline capability added (Lite v1 + v2: IDB packs, Cache API audio, SW shell).
- Strong test coverage across the modules that matter.
- Modular folders exist even though some files (notably `RoomRenderer.tsx`) are too large.

## 5. Immediate 2–3 day stabilization plan

1. Verify production deployment (build green, SW registering, no Sentry spike).
2. Verify offline update behavior (new SW lands as waiting, old tabs unaffected, refresh picks up new shell).
3. Remove / clean unwanted "Practice pronunciation" surface in Library rooms if still desired.
4. Document the **actual** room render path end-to-end (loader → normalizer → renderer → audio resolver → player) — keep it short, link to the files.
5. Add SW testing notes (Chrome DevTools steps, how to force-update, when to skip registration in dev).

## 6. Engineering rule going forward

- Avoid adding major features while core systems are unstable.
- Prefer **one small scoped change at a time**.
- Do **not** parallelize work touching shared contracts like room data, offline, auth, or audio. One owner per shared contract per change window.
- Trust **runtime behavior** over comments or assumptions. If the code says one thing and the running app says another, the running app wins.
- Keep the working tree clean **before** debugging. A dirty tree turns a 10-minute fix into a 2-hour archaeology session.
