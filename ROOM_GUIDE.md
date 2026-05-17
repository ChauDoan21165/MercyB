# Room System Guide

**Status:** Canonical. Consolidates the 7 legacy room docs (see §8). Reconciled against
current code (`package.json`, `scripts/`, `supabase/functions/`) on 2026-05-17.

> **Source-of-truth order:** `CLAUDE.md` (architecture + invariants) → this guide
> (workflow + JSON contract) → the archived 2025 room docs (historical only). Where this
> guide and an archived doc disagree, this guide wins; where `CLAUDE.md` and this guide
> disagree, `CLAUDE.md` wins.

---

## 1. What rooms are

~474 room JSON files in `public/data/*.json` (`ls public/data/*.json | wc -l`). Loaded by
`src/lib/roomLoader*.ts`, normalized in `RoomRenderer.tsx` / `roomRenderer/helpers.ts`,
rendered by `RoomRendererUI.tsx`. Route: `/room/:roomId` where `roomId` = JSON filename
minus `.json`. Full pipeline is documented in **`CLAUDE.md` → Architecture → Room content
pipeline**; this guide does not duplicate it.

---

## 2. Filename convention (STRICT — still enforced by `rooms:check`)

`public/data/{room_id}.json`, where `room_id`:

- **EXACTLY equals the JSON `id` field**
- all lowercase, **snake_case only** (no kebab-case, no PascalCase, no mixed case)
- no fallback guessing, no case-insensitive search, no underscore/hyphen swapping

Mismatch ⇒ **HARD FAIL** with a clear error (room id, expected path, reason). There is no
backwards-compatibility layer — the resolver is zero-tolerance by design (prevents phantom
rooms, "1 entry" display bugs, silent import failures).

```
✅ strategic_foundations.json        → "id": "strategic_foundations"
✅ finding_inner_peace.json          → "id": "finding_inner_peace"
❌ Strategic_Foundations.json        (Title_Case)
❌ strategic-foundations.json        (kebab-case)
❌ conflict_navigation.json          ("id" says something else)
```

> **Tier suffixes in filenames (e.g. `_vip6`) are a historical filename pattern, not a
> product tier.** MercyBlade has **no VIP tier** (`CLAUDE.md` non-negotiable #5: users are
> `profiles.tier = 0..N`). Treat any `vipN` / `'all_vip'` *as a cohort/audience* as legacy
> and skip it. A `vipN` substring inside a room filename is fine — don't "fix" it.

---

## 3. JSON structure

### Root level
- **Bilingual title** — one of: `title.en`+`title.vi`  *or*  `name`+`name_vi`
- **`id`** — must equal the filename (see §2)
- **`entries`** — array (count is mode-aware, see §4)
- `content.en` / `content.vi` — optional bilingual intro
- `tier` — optional string; **legacy**, do not rely on it for access logic
  (tier-gating lives in the app layer per `CLAUDE.md`, not in room JSON)

### Entry level

```json
{
  "slug": "entry-identifier",          // OR "id" OR "artifact_id" — at least one
  "audio": "filename.mp3",             // canonical: STRING filename only
  "copy": { "en": "…", "vi": "…" },    // both required
  "keywords_en": ["…"],                // recommended (drives keyword nav)
  "keywords_vi": ["…"]
}
```

**Audio field — canonical vs legacy (this resolves a contradiction in the old docs):**

- ✅ Canonical: `"audio": "filename.mp3"` — a **string filename only**, no paths, no
  per-language object.
- ⚠️ Legacy/deprecated, still read via minimal fallbacks: `audio_en`, `audioEn`,
  `copy_en`+`copy_vi`, `essay.en`+`essay.vi`, `essay_en`+`essay_vi`, and the old
  `audio: { en, vi }` **object** form. Migrate to canonical; don't author new ones.
- The filename is resolved to a playable URL through the Supabase pipeline
  (`toAudioKey` → `tryResolveLocal` → `resolveRoomAudioUrl`). **All room audio now flows
  through the Supabase `room-audio` public bucket** — the old "audio lives in
  `public/audio/<room>/`" instruction in the 2025 docs is **superseded**; see
  `CLAUDE.md` → Audio resolution pipeline (hard invariant). Do not re-localize audio or
  reference `public/audio/*.mp3` paths in JSON.

---

## 4. Validation modes

Entry-count limits are mode-aware (`VITE_MB_VALIDATION_MODE`):

| Mode | Min | Max | Use |
|---|---|---|---|
| `strict` | 2 | 8 | production / CI (default in production) |
| `preview` | 1 | 15 | staging |
| `wip` | 1 | 20 | development (default in development) |

---

## 5. Workflow — add or update a room

1. Create/edit `public/data/{room_id}.json` (snake_case, `id` == filename, §2/§3).
2. Run the registry + validation gate:
   ```bash
   npm run rooms:check         # = generate:room-registry + validate-rooms:core
   ```
   This regenerates `src/lib/roomManifest.ts` + `src/lib/roomDataImports.ts` and runs
   core validation. It is also the **prebuild hook** — a bad room blocks `npm run build`.
3. For the full (non-core) error list and extra checks:
   ```bash
   npm run validate-rooms        # full validation, all rooms
   npm run check:empty-rooms     # rooms with no entries
   npm run check:empty-entries   # entries that are empty
   npm run check:kw-coverage     # keyword coverage
   ```
4. Commit the JSON **and** the regenerated registry files together (the pre-commit hook
   keeps them in sync; never hand-edit `roomManifest.ts` / `roomDataImports.ts`).

> **Command names changed.** The archived docs reference `scripts/validate-room-files.js`,
> `validate-single-room.js`, `validate-room-after-update.js`, `watch-and-validate-rooms.js`,
> `validate-rooms-ci.js`, and npm scripts `validate:rooms` / `registry:generate` /
> `registry:validate` / `registry:missing-audio`. **These no longer exist.** Use the §5
> commands (current `.mjs`/`.cjs` scripts, verified in `package.json` 2026-05-17). Other
> still-present helpers worth knowing: `scripts/find-rooms-with-no-audio.mjs`,
> `find-rooms-with-no-entries.mjs`, `audit-room-json.mjs`, `dedupe-room-entries.mjs`.

---

## 6. `room-health-summary` edge function

Deployed (`supabase/functions/room-health-summary/`, confirmed 2026-05-17).
Requires JWT (`verify_jwt = true`). POST or GET.

**Request:** `{ tier?: string, mode?: string }` (both optional).

**Response (shape):**
```ts
{
  global:  { total_rooms, rooms_zero_audio, rooms_low_health, rooms_missing_json },
  byTier:  { [tier]: { total_rooms, rooms_zero_audio, rooms_low_health, rooms_missing_json } },
  vip_track_gaps: Array<{ tier, title, total_rooms, min_required, issue }>,
  tier_counts: Record<string, number>
}
```

A room counts as "missing JSON" if `raw_json` is NULL, has no `entries`, or
`entries` is `[]`. Health/audio metrics come from the `room_health_view` DB view.

> ⚠️ The `vip_track_gaps` field and `byTier` VIP keys are **legacy artifacts** from the
> pre-pivot tier model. Don't build new UI on `vip_track_gaps`. Frontend callers must
> null-guard every nested access (`data.byTier?.[t.toLowerCase()]?.total_rooms ?? 0`) and
> show graceful fallbacks for missing tier keys — never crash on a missing key.

Example:
```ts
const { data, error } = await supabase.functions.invoke('room-health-summary', { body: {} });
```

---

## 7. `supabase/functions/room-chat/data/`

The `room-chat` edge function still exists (`index.ts` + a `data/` dir). The 2025 docs
described manually `cp`-ing room JSON into that dir to keep an edge-side copy in sync.
**Treat that sync step as unverified/legacy** — the live load path is `public/data/*.json`
via `roomLoader`. Confirm against current `room-chat/index.ts` before relying on an
edge-side data copy; do not add it to the standard authoring workflow.

---

## 8. Provenance

Merged from (now in `reports/archive/room-docs-2025/`):
`ROOM_JSON_CANONICAL_STRUCTURE.md`, `ROOM_VALIDATION_RULES.md`, `ROOM_MANAGEMENT.md`,
`ROOM_UPDATE_GUIDE.md`, `ROOM_UPLOAD_CHECKLIST.md`, `ROOM_HEALTH_SUMMARY_API.md`,
`SYNC_GUIDE.md`. They contained mutually-contradictory and pre-pivot content (VIP tiers,
audio-as-object, local `public/audio/` paths, renamed scripts); this guide keeps only
what reconciles with current code + `CLAUDE.md`.
