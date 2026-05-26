> **SUPERSEDED by PR #557** (`fix(rooms): VI-rooms concrete defect cleanup — audio, garble, dupe, doc drift`). The 5-of-6 non-gated fixes shipped; the 6th (Spanish/English audio gen) tracked separately. Keep for audit trail of the defect inventory.

# RECON — Vietnamese Rooms Defect Cleanup

**Agent:** vi-rooms-defects-agent · **Branch:** `vi-rooms-defect-cleanup` (off fresh `origin/main` @ `68855a29`)
**Date:** 2026-05-17 · **Scope:** concrete defects from `RECON-vi-rooms-audit.md` §10 (NOT strategic gaps)
**Phase:** 1 RECON — no file changes yet.

---

## TL;DR

All 6 defect classes diagnosed with evidence. **5 of 6 are small, safe, non-gated fixes.**
Only one (audio generation for 4 English-learning rooms) needs a production-upload
confirmation gate. Two of the RECON audit's "urgent" items turned out to be **false
positives** (the audit checked schema only, not consumers): the song rooms already have
audio in Supabase, and `guide_articles_en_vi.json` is live help content, not a broken room.

---

## Defect 1 — 6 rooms with no audio

Reproduced exactly (excl. `registry.json` + `guide_articles_en_vi.json`). Splits cleanly into **two root causes**:

### 1A — Song rooms: pure REFERENCE gap (no generation needed, NOT gated)

| Room | entries | `content.audio` | Supabase HEAD |
|---|---|---|---|
| `mercy_blade_bridge_of_hearts_free` | 1 | `mercy_blade_bridge_of_hearts_mp3_free_core.mp3` | **200 ✅** |
| `say_my_name_mercy_blade_vip1` | 1 | `say_my_name_mercy_blade_mp3_vip1_core.mp3` | **200 ✅** |

These are recorded **songs**. The MP3s **already exist in the public `room-audio` bucket**.
The audio is referenced at `content.audio` but the renderer reads **`entry.audio` /
`entry.audio_en` only** (`helpers.ts:132`, `RoomRenderer.tsx:247`) — it never reads
`content.audio`. So the song silently has no player.
**Fix:** add `"audio": "<existing-file>.mp3"` to the single entry. No generation, no
upload, no gate. Leave `content.audio` in place (smallest safe diff). RECON audit flagged
these as "no audio" because it inspected entry-level schema only — a false alarm at the
play-path level, but the entry-level wiring genuinely is missing, so the fix stands.

### 1B — English-learning rooms: REFERENCE gap + missing generated audio (GATED)

| Room | tier | entries | state | sibling pattern |
|---|---|---|---|---|
| `creativity_challenges_kids_l2` | free | 3 | every entry `audio: null` | all other `*_kids_l2` = 6 entries w/ audio |
| `feelings_social_kids_l2` | free | 3 | every entry `audio: null` | (same) |
| `little_scientist_kids_l2` | free | 3 | every entry `audio: null` | (same) |
| `english_foundation_ef01` | free | 1 | the one entry `audio: null` | `english_foundation_ef11` = 6 entries, `ef11_0N_en.mp3` |

Root cause = **reference gap, not content gap.** Every entry has audio-generatable
bilingual text (`copy.en` / `copy.vi`) and these are English-learning rooms whose siblings
all carry generated English audio (`srs01_01_en.mp3`, `ef11_01_en.mp3`, …). 10 audio
files total (3+3+3+1).

**Pipeline:** `scripts/generate-missing-audio.ts` is the existing room-audio generator
(OpenAI `gpt-4o-mini-tts`, voice `alloy`; reads `public/data/*.json`). It generates audio
for entries that **already have** an `audio` filename — so the workflow is: (a) assign
canonical filenames following the sibling convention, (b) run the generator, (c) upload to
Supabase `room-audio`. Cost for ~10 short clips ≈ **well under $0.01** (far below the $1 / $50 lines).
This is a single atomic action — wiring the JSON refs *without* uploading the files would
trigger the resolver's silent `/audio/{key}` fallback (worse than `audio: null`).

> **GATE (locked principle #4):** TTS generation + production Supabase upload requires
> Chau's explicit confirmation. Until then these 4 rooms stay `audio: null` (current state)
> or are documented as a follow-up.

## Defect 2 — `eating_disorder_support_vip2.json` garbled `áyprocess`

**Identified.** EN source: *"Celebrate milestones, like enjoying a meal **without
guilt**, to sustain momentum."*
Garbled VI: `…thưởng thức bữa ăn mà không **áyprocess ăn uống lành mạnh**, giúp bạn…`
`áyprocess` = corrupted `áy náy` (guilt) with the English word "process" fused in; the
trailing `ăn uống lành mạnh` is junk drift.

**Intended fix (minimal, faithful to EN, matches room register):**
`mà không áyprocess ăn uống lành mạnh,` → `mà không cảm thấy áy náy,`
→ *"…thưởng thức bữa ăn mà không cảm thấy áy náy, giúp bạn tiến tới sự chữa lành lâu dài."*

Occurs **twice** — entry 0 (`slug: recovery`) and entry 5 (`slug: all`, the
concatenated aggregate). Both contain the identical substring → one `replace_all` fixes
both consistently. Confirmed isolated to this one file (no systemic mojibake).

## Defect 3 — `guide_articles_en_vi.json` (0 entries) → **NOT a defect (false positive)**

It is **live help content**, not a broken room:
- Consumed at `src/hooks/useMercyGuide.ts:97` (`fetch('/data/guide_articles_en_vi.json')`)
  and its article keys (`what_is_room`, `how_to_use_paths`, `where_to_start`) are wired in
  `src/components/mercy-guide/shared.ts`.
- It holds 5 structured help articles (`title_en/vi` + `body_en/vi`), intentionally
  `entries: []`.
- Already explicitly whitelisted as a non-room in `scripts/validate-rooms-ci.js:60`, and
  the prebuild gate already counts **473 rooms** (excludes it + `registry.json`).

**Decision: do NOT delete, do NOT populate `entries`.** The RECON audit flagged it because
it scanned schema without checking `useMercyGuide.ts`. Only cosmetic nit: its root
`title.en/vi` is the literal placeholder string `"guide_articles_en_vi"`. **Optional**
polish: give it a human title (`"MercyBlade Guide"` / `"Hướng dẫn MercyBlade"`) so it never
surfaces ugly if a future scanner lists it — zero functional risk. Will include this
one-line polish unless told otherwise.

## Defect 4 — `julius_caesar_vip9_vol1_copy.json` → **confirmed true duplicate, safe delete**

`diff` of normalized JSON: **the only difference is the `id` field** (`..._vol1` vs
`..._vol1_copy`). Byte-identical otherwise (both 9 entries). Referenced only in
auto-generated `src/lib/roomManifest.ts:234` + `public/data/registry.json` (no source code,
no tests). **Fix:** `git rm` the file, then `npm run rooms:check` to regenerate
`roomManifest.ts`, commit JSON + regenerated manifest together (per `ROOM_GUIDE.md §5`).

> **Surfaced during fix:** `rooms:check` regenerates `src/lib/roomManifest.ts` but
> **not** `public/data/registry.json` — the latter is a hand-committed snapshot
> (`version: 2026-04-16`, `count: 475`) fetched at runtime by `tierRoomSource.ts:459`.
> It still listed the dupe, so deleting the JSON left a dangling pointer. **Surgically
> removed only the 2 `julius_caesar_vip9_vol1_copy` lines** (array + map) — the smallest
> safe change to not regress my own deletion. The broader registry drift (475 vs the
> real 472, 1-month-stale `version`) is **pre-existing debt out of this PR's scope**
> (already flagged as the oldest file in `RECON-vi-rooms-audit.md` §1/§6); reconciling
> or retiring `registry.json` is a separate follow-up — did not touch `count`/`version`.

## Defect 5 — 16 legacy object-form audio rooms → **trivial, mechanical, in-scope**

All 16 confirmed. Shape is uniform: `"audio": { "en": "file.mp3" }` (13 rooms) or
`{ "en": "...", "vi": "..." }` (3: `mens_mental_health_vip3`, `stress_vip3`,
`weight_loss_and_fitness_vip3`). The loader (`roomLoaderHelpers.ts:101-106`) already
resolves these via `entry.audio.en ?? entry.audio.vi ?? …`, so migrating to the canonical
**string of the `.en` value** is a zero-runtime-change canonicalization.

All 16 referenced files **HEAD 200 in Supabase** (spot-checked across the cluster,
including the odd-looking `astering_social_confidence_vip2.mp3` — that *is* the correctly
uploaded filename; `mastering_…` returns 400, so do **not** "fix" the name).

**Fix:** `audio: {en: X[, vi: Y]}` → `audio: "X"` for all 16. Migration cost: ~16
one-line edits, no behavior change, no gate. In scope for this PR.

## Defect 6 — 62 rooms breaking 2–8 entry bound → **FIX THE DOC, not the rooms**

The documented bound is **stale**. Evidence:
- `scripts/validate-rooms-ci.js` strict config: `minEntries: 1, maxEntries: 15` — header
  comment: *"strict bound widened from [2,8] to [1,15] in #51 Path A — short
  preview/aggregator rooms and long VIP9/VIP6 collections are [legitimate]."*
- The real prebuild gate (`npm run validate-rooms:core`) **passes 0 errors / 0 warnings**
  on all 473 rooms today; it only hard-fails on `entries.length === 0`.
- Corpus measured: 24 rooms `<2` entries, 37 `>8`, **0 rooms `>15`** (max seen = 15).
  Under the *actual* strict bound `[1,15]`, **zero rooms violate.**

`ROOM_GUIDE.md §4` table still prints `strict | 2 | 8`. That row (and the §2/§4 prose
implying [2,8]) is the only thing wrong. **Decision: correct `ROOM_GUIDE.md §4` to the
shipped reality** (`strict 1/15`, `preview 1/8`, `wip 1/20` per the validator config). No
room content changes. (The RECON audit's "62" = my 61 + it counted the guide non-room.)

---

## PR structure

**Single PR** (all non-gated fixes are small and thematically one cleanup):

1. Defect 1A — wire `entry.audio` for the 2 song rooms (files already in Supabase)
2. Defect 2 — fix `áyprocess` garble (replace_all, both occurrences)
3. Defect 3 — optional one-line title polish on `guide_articles_en_vi.json` (no delete)
4. Defect 4 — `git rm` julius dupe + regenerate registry/manifest
5. Defect 5 — migrate 16 object-audio → canonical string
6. Defect 6 — correct `ROOM_GUIDE.md §4` entry-bound table to shipped reality
7. (locked #1) any dead code surfaced folded into the same PR

**Gated sub-step (Chau decides):** Defect 1B — generate + upload + wire audio for the 4
English-learning rooms (10 clips, <$0.01). Either folded into this PR as an extra commit
*after* explicit confirmation, **or** documented as a follow-up and the 4 rooms left at
`audio: null`.

**Gates before push:** `typecheck:ci` · `lint` · `build` (incl. `rooms:check`) · `vitest`.

**Disclaimer:** agent-fixed defects — spot-check before mass adoption.

---

## DEFERRED FOLLOW-UP (Chau decision 2026-05-17: defer 1B)

**Open item — audio generation for 4 English-learning rooms.** Not in this PR.

| Room | tier | clips needed | suggested filenames |
|---|---|---|---|
| `english_foundation_ef01` | free | 1 | `ef01_01_en.mp3` (matches `ef11_0N_en.mp3` sibling) |
| `creativity_challenges_kids_l2` | free | 3 | per-slug `_en.mp3` (matches `*_kids_l2` siblings) |
| `feelings_social_kids_l2` | free | 3 | per-slug `_en.mp3` |
| `little_scientist_kids_l2` | free | 3 | per-slug `_en.mp3` |

These stay at `audio: null` (unchanged) until a future gated run. Runbook:
(1) assign canonical filenames in JSON following the sibling convention;
(2) run `scripts/generate-missing-audio.ts` (OpenAI `gpt-4o-mini-tts`, voice
`alloy`); (3) upload to Supabase `room-audio` (locked-#4 confirmation gate);
(4) verify HEAD 200; commit JSON + nothing else. Est. cost < $0.01.
Pre-req to verify at kickoff: whether `generate-missing-audio.ts` still writes
to disk (pre-Supabase header) or uploads to the bucket — adjust step 3 accordingly.

---

*Phase 1 recon by vi-rooms-defects-agent. Phase 2 executed in the same branch.
Agent-fixed defects — spot-check before mass adoption.*
