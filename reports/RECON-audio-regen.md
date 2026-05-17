# RECON — Audio defect regeneration (3 categories)

**Agent:** audio-regen-agent
**Branch:** `audio-regen-defects` (off fresh `origin/main` @ `68855a29`)
**Worktree:** `/private/tmp/MercyB-audio-regen`
**Date:** 2026-05-17
**Status:** Phase 1 RECON complete — awaiting approval before any generation/storage write
**Source audit:** `reports/RECON-vi-rooms-audit-v2.md` §3 / §10
**Method:** live byte-level GET against the PUBLIC bucket
`https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/<key>`
recording HTTP status **and** `size_download` (0-byte ≠ 404; status-only checks miss it).

---

## TL;DR

- **Exact regeneration scope: 19 audio clips** + a **6-ref JSON casing fix** (no audio gen for 3 of them — the audio already exists in the bucket under the lowercase key → **restore-before-redesign**).
- **Total cost ≈ $0.30–0.50** (OpenAI `gpt-4o-mini-tts`, ~19k chars / ~22 min audio). Far below the $5 brief bar and the $50 decision line — **no cost decision required**.
- **No work-in-progress at risk.** Every defect room last touched by a bulk infra commit or a stale 2026-04-24 repair attempt — none active.
- **One real design problem:** the room generator (`generate-missing-audio.ts`) works at *room* granularity and would **regenerate 59 vip9 clips to fix 7**, overwriting 52 *working* files on upload. Phase 2 needs an **entry-level targeted** generator (recommended below).
- **Scope-expansion flag (do NOT fix this pass):** the 0-byte/tiny-file defect is a *class*, not 7 files. A random working-kids sibling (`adventure_discovery_v1_discover.mp3`) is **67 bytes** = also broken. Recommend a separate full-corpus byte-audit follow-up; this pass fixes only the named defects.

---

## 1. Full inventory per category (live-verified)

### Category A — vip9 0-byte silent uploads → **exactly 7 files** (not 59)

Full byte scan of **all 59 entries** across the 7 named rooms: **7 zero-byte, 51 OK, 0 other**.
The 0-byte file is **always entry[0] (`*_1_en.mp3`)**; every other entry resolves with real audio
(0.9–3.2 MB). Audit's "7+ … floor not ceiling" → confirmed **ceiling = floor = 7**.

| Room (`public/data/*.json`) | Entries | 0-byte key | Other entries |
|---|---:|---|---|
| `genghis_khan_vip9_vol2` | 9 | `genghis_v2_1_en.mp3` | 2–9 OK |
| `genghis_khan_vip9_vol3` | 9 | `genghis_v3_1_en.mp3` | 2–9 OK |
| `cyrus_the_great_vip9_vol3` | 7 | `cyrus_v3_1_en.mp3` | rest OK (note: JSON skips `_6`) |
| `julius_caesar_vip9_vol2` | 9 | `caesar_v2_1_en.mp3` | 2–9 OK |
| `kautilya_grand_strategy_vip9_vol1` | 9 | `kautilya_vol1_1_en.mp3` | 2–9 OK |
| `musashi_grand_strategy_vip9_vol1` | 8 | `musashi_vol1_1_en.mp3` | 2–8 OK |
| `corporate_cross_functional_vip9` | 8 | `corporate_cross_functional_1_en.mp3` | 2–8 OK |

(One probe of `corporate_cross_functional_7_en.mp3` returned a transient curl `000`; re-probe =
`200 / 904925` — fine. Not a defect.)

**Fix = overwrite 7 bucket objects in place. JSON keys are already correct — no source change for A.**

### Category B — kids rooms `audio:null` → **3 rooms × 3 entries = 9 clips**

Confirmed **only the 3 named rooms** are in scope; each has exactly 3 entries, **all `audio:null`**.
`git show 1a9b4919~1` confirms they were `null` **before** the mass concat-null commit — they
**never had audio keys** (not a regression to restore; genuinely never generated).

| Room | Entry slugs (need keys assigned) |
|---|---|
| `creativity_challenges_kids_l2` | `picture-challenge`, `what-if-game`, `new-game-ideas` |
| `feelings_social_kids_l2` | `sharing-feelings`, `kind-words`, `making-friends` |
| `little_scientist_kids_l2` | `science-tools`, `states-of-matter`, `simple-experiments` |

**Fix = (a) assign canonical kids audio keys in JSON, (b) generate, (c) upload.** Source change.

### Category C — `sleep_improvement_vip3` → **MIXED, not a simple rename**

6 entries, all carrying **capitalized** filenames. All capitalized keys → HTTP 400 (absent).
Probing the lowercase variant of each:

| # | JSON key (capitalized, all 400) | lowercase variant | Action |
|---|---|---|---|
| 0 | `Mastering_Your_Sleep_Schedule_vip3.mp3` | 400 — **absent** | **regenerate** + lowercase ref |
| 1 | `Deepening_Relaxation_Practices_vip3.mp3` | **200 · 1,296,000 B** ✅ | **JSON ref → lowercase only** (audio exists) |
| 2 | `Optimizing_Pre-Bed_Nutrition_vip3.mp3` | 400 — **absent** (also tried `_` for `-`) | **regenerate** + lowercase ref |
| 3 | `Perfecting_Your_Sleep_Environment_vip3.mp3` | **200 · 1,320,192 B** ✅ | **JSON ref → lowercase only** |
| 4 | `Incorporating_Mindful_Activity_vip3.mp3` | **200 · 1,220,544 B** ✅ | **JSON ref → lowercase only** |
| 5 | `Tracking_Sleep_Patterns_vip3.mp3` | 400 — **absent** | **regenerate** + lowercase ref |

So Category C = **3 clips regenerated** + **6 JSON refs lowercased** (3 of which point at audio that
**already exists** — restore-before-redesign, zero generation/storage cost for those).

### Net regeneration scope

| Category | Clips to generate | Source (JSON) change | Storage write |
|---|---:|---|---|
| A (vip9 0-byte) | 7 | none | 7 overwrites |
| B (kids null) | 9 | 3 JSON files (assign keys) | 9 new |
| C (sleep) | 3 | 1 JSON file (6 refs → lowercase) | 3 new |
| **Total** | **19** | **4 JSON files** | **19 objects** |

---

## 2. TTS pipeline + voice

**The room-audio pipeline is two-step** (distinct from the *lessons* pipeline, which is
Google/ElevenLabs via `build-audio-manifest.ts` — irrelevant here; A/B/C are all rooms):

1. **Generate** — `scripts/generate-missing-audio.ts`: **OpenAI `gpt-4o-mini-tts`, voice `alloy`,
   mp3**, text = `"<room title.en>. <entry copy.en>"`. Writes to local `public/audio/`. **English
   only** (room audio is `*_en.mp3`; `copy.vi` is never voiced for rooms). This is the **only**
   script that synthesizes from `public/data/*.json` room entries.
2. **Upload** — `scripts/upload-audio-to-supabase.ts`: walks `public/audio/**`, uploads to the
   `room-audio` bucket. Per-file: `remoteSize === localSize → skip`, else `upload(upsert:true)` →
   **overwrites**. So a fresh >0-byte clip vs a 0-byte remote = size mismatch = **overwrites the
   silent file** (exactly what Category A needs); 200-OK working files are *not* touched **only if
   not regenerated locally**.

**Voice:** all categories use the **same single voice (`alloy`)** — there is no per-category or
kids-specific voice in this pipeline; the room generator never branches on kids. Using it for the
kids rooms therefore *matches the pipeline*, but **see the kids-voice gate in §5** — "matches the
script" is not the same as "matches what existing kids clips sound like", and that must be
ear-verified before the kids bulk upload (non-negotiable #2).

---

## 3. Cost estimate

OpenAI `gpt-4o-mini-tts`, character counts from the live JSON:

| Category | Clips | ~chars (copy.en + title prefix) |
|---|---:|---:|
| A (7 × entry[0], 691–2,947 ea.) | 7 | ~15,500 |
| B (9 kids, ~90–105 ea.) | 9 | ~1,250 |
| C (3 sleep, ~810–844 ea.) | 3 | ~2,600 |
| **Total** | **19** | **~19,350** |

≈ 19,350 chars ≈ ~22 min synthesized audio.
At the conservative `tts-1`-equivalent rate ($15 / 1M chars) → **$0.29**; `gpt-4o-mini-tts`
audio-output token pricing lands in the same band (~$0.015/min → ~$0.35). **Total ≈ $0.30–0.50.**

> **Decision:** trivially below the $5 brief bar and the $50 line. **No Chau cost decision needed.**

---

## 4. Generation + upload plan (priority order)

Order per brief: **C → B → A** (smallest/easiest verification first; B = non-negotiable; A = paid users).

**Pre-flight (no writes):** confirm none of the proposed B/C keys already exist in the bucket
(expected: all absent — B was always null, C-regen keys 400 under every variant probed). Verify each
defect immediately before its own write (locked #5).

### Step 0 — JSON source edits (PR-bound, no audio yet)
- `sleep_improvement_vip3.json`: lowercase **all 6** `audio` refs.
- `creativity_challenges_kids_l2.json`, `feelings_social_kids_l2.json`,
  `little_scientist_kids_l2.json`: assign keys following the **verified working-kids convention**
  `{room_prefix}_v1_{slug_underscored}.mp3` (mirrors `adventure_discovery_v1_discover.mp3` etc.;
  proposed prefixes `creativity_challenges` / `feelings_social` / `little_scientist`). Do **not**
  re-introduce a space-separated "all" concat entry (that pattern is the `1a9b4919`-nulled bug).
- `typecheck:ci` + `vite build` + `rooms:check` green before commit.

### Step 1 — Category C regen (3 clips: entries 0, 2, 5 → lowercase keys) + verify
### Step 2 — Category B regen (9 kids clips) → **spot-listen gate (§5)** → upload
### Step 3 — Category A overwrite (7 `*_1_en.mp3`) + verify the 52 siblings are **untouched**

### ⚠️ Tooling gap (the one real design issue)
`generate-missing-audio.ts` regenerates **every entry of a room** (it only skips by *local* file
existence; `public/audio/` is empty post-d2951ddd). Running it on the 7 vip9 rooms would synthesize
**59** clips and the uploader would then **overwrite 52 working bucket files** with new takes —
direct violation of "don't regenerate working audio."

**Recommendation:** add a small, reviewed `scripts/regen-audio-defects.ts` — a thin variant reusing
the exact `gpt-4o-mini-tts`/`alloy` call, driven by an **explicit 19-key target list**, generating
+ uploading **only those keys** (gen+upload combined like `generate-spanish-audio.ts`). Smallest
*safe* change; existing scripts cannot do entry-level targeting without error-prone manual staging.
(Alternative — generate all 59 then hand-delete the 52 before upload — rejected: fragile, one slip
overwrites paid content.)

---

## 5. Verification plan

- **HEAD/byte check every written key:** expect `200` + `content-length` in the real-audio band
  (vip9 ≈ 0.9–3.2 MB; kids ≈ 0.2–0.3 MB; sleep ≈ 1.2–1.3 MB). A `200 / size 0` is still a fail.
- **Regression guard (Category A):** re-probe **all 52 sibling entries** post-run — must be byte-
  identical to their pre-run sizes (proves nothing working was overwritten).
- **🔴 Kids-voice gate (non-negotiable #2, blocks B upload):** before bulk-uploading the 9 kids
  clips, **spot-listen one fresh kids clip vs an existing working kids clip**
  (`animals_around_world_v1_polar.mp3`, 278 KB, confirmed real). If `alloy` character / the
  `"<title>. <text>"` prefix sounds materially off for pre-literate learners → **stop, escalate to
  Chau for a voice decision**, do not ship.
- **Spot-listen recommendation:** 1 vip9 (`genghis_v2_1_en.mp3`), 1 sleep
  (`mastering_your_sleep_schedule_vip3.mp3`), 1 kids — confirm intelligible, correct content,
  non-truncated.

---

## 6. Risk register

| Risk | Status |
|---|---|
| Overwriting work-in-progress | **None.** vip9 → bulk CI commit `0fa61fa8` (2026-05-12); sleep+kids → stale repair `29c039c7` (#72, 2026-04-24). No active branches/worktrees touch these files. |
| Overwriting **working** audio (52 vip9 siblings) | **Real — mitigated** by the targeted-generator recommendation (§4) + the §5 regression guard. Do **not** run unscoped `generate-missing-audio.ts`. |
| Restore-before-regenerate missed | **Caught:** 3 of 6 sleep entries already have audio in-bucket (lowercase) — JSON-only fix, **zero** gen for them. |
| Kids voice mismatch | **Gated** (§5) — ear-verify before B upload; escalate not ship. |
| Scope creep (0-byte is a class) | **Surfaced, contained:** `adventure_discovery_v1_discover.mp3` = 67 B proves the defect is broader. **Out of named scope — not fixed here.** Recommend a separate full-corpus byte-audit + CI guard (audit §10.6). |
| Env (OpenAI key) | Unverified in recon (no billable call). A `--limit=1` smoke clip surfaces it for <$0.01 in Phase 2. |

---

## 7. Phase 2 output decision

Spanish B2 was **storage-only → no PR**. Here A is storage-only, **but B and C require JSON edits**
(assign kids keys; lowercase sleep refs). → **One PR**: the 4 JSON files + new
`scripts/regen-audio-defects.ts` + this recon doc. Category A's 7 overwrites produce no git diff but
ride the same approved Phase-2 execution. Recommend: **single PR, push only on explicit approval**
(locked #4 — production storage write is gated).

---

---

## 8. Decisions locked (2026-05-17)

1. **Gen tooling — CONFIRMED:** new `scripts/regen-audio-defects.ts`, explicit 19-key target list,
   gen+upload only those keys. Unscoped `generate-missing-audio.ts` will **not** be run.
2. **Kids-voice gate — LOCKED (default = brief non-negotiable #2):** spot-listen one fresh kids clip
   vs `animals_around_world_v1_polar.mp3` before the 9-clip kids upload; mismatch → stop + escalate.
3. **Scope — LOCKED (default = brief cost discipline):** named 19 clips only. Broader 0-byte/tiny
   class (`adventure_discovery_v1_discover.mp3` = 67 B) → separate follow-up audit, not this pass.

---

---

## 9. Phase 2 — EXECUTED (2026-05-17, approved)

Tool: `scripts/regen-audio-defects.ts` (new, explicit 19-key allowlist, OpenAI
`gpt-4o-mini-tts`/`alloy`, gen+upload+verify per clip). Unscoped `generate-missing-audio.ts` never
run. Order C → A → B (B behind the §5 kids-voice gate; Chau approved the audition clip).

| Step | Result |
|---|---|
| Smoke (`--category=C --limit=1`) | 1/1 — OpenAI key + Supabase service-role write + public verify confirmed live (~$0.01) |
| Category C (3) | **3/3** uploaded, HTTP 200, real audio (0.89–0.98 MB) |
| Category A (7) | **7/7** 0-byte files overwritten, HTTP 200, real audio (0.86–2.94 MB) |
| **Regression guard** | **52/52 working vip9 siblings byte-identical to pre-run baseline — zero drift** |
| Kids audition (`--category=B --limit=1`) | 1/1 uploaded; Chau spot-listened vs working sibling → **approved** (voice + title-prefix OK) |
| Category B (9) | **9/9** uploaded, HTTP 200, real audio (0.12–0.16 MB) |
| Sleep-prefix decision | slug-as-`title.en` spoken prefix → **leave as-is** (consistent with the 3 existing siblings; room-title cleanup out of scope) |
| **Final verify (all 22)** | 19 written + 3 pre-existing lowercase sleep refs → **22/22 HTTP 200, ≥1 KB, 0 fail** |
| Gates | `rooms:check` PASS (473, 0 err) · `typecheck:ci` clean · new script tsc-clean · `npm run build` ✓ |

**Actual cost:** 19 clips ≈ 19,175 chars + smoke/audition re-renders ≈ **< $0.50** (OpenAI
`gpt-4o-mini-tts`). 0 failures, no retry/cleanup.

**Source changes (PR):** `sleep_improvement_vip3.json` (6 refs → lowercase),
`creativity_challenges_kids_l2.json` / `feelings_social_kids_l2.json` /
`little_scientist_kids_l2.json` (assign keys), `scripts/regen-audio-defects.ts`, this doc.
Category A produced **no git diff** (storage-only overwrite — keys were already correct).

**Out-of-scope finding (logged, not fixed):** `adventure_discovery_v1_discover.mp3` = 67 B — the
0-byte/tiny-file defect is a broader class. Recommend a separate full-corpus byte-audit + CI guard.

Status: **COMPLETE — pending git push/PR (gated per locked #4 / git discipline).**
