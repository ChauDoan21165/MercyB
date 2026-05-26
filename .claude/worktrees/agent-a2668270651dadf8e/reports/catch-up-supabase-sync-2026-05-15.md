# Catch-up Supabase sync — bilingual content rounds

## Context

Following PR #466 (French A1 re-sync), the same staleness affected every other (language, level) pair where bilingual `_en` content had been added to the TS seed files after the last sync. This PR catches the database up.

## Sync runs (per [Done] outputs captured during execution)

| Language | Level | Updated rows |
|---|---|---:|
| French   | A2 | 10 |
| German   | A1 | 20 |
| German   | A2 | 10 |
| German   | B1 | 15 |
| German   | B2 | 46 |
| German   | C1 | 40 |
| German   | C2 | 20 |
| Spanish  | A1 | 14 |
| Spanish  | A2 | 15 |
| Spanish  | B1 | 20 |
| Spanish  | B2 | 25 |
| Spanish  | C1 | 20 |
| Spanish  | C2 | 15 |
| **Total** |  | **270** |

All runs reported `inserted=0 unchanged=0` — every row pre-existed and was updated in place. No new rows created.

## Spanish — script compatibility check

The brief asked whether the sync script handles Spanish's distinct field names (`cultural_note` / `tip`, not the French/German `cultural_notes_vi` / `tip_advice_vi`).

The sync script does NOT remap field names. It upserts the whole TS lesson object verbatim into `content` JSONB:

```ts
content: lesson as Record<string, unknown>
```

Per-language normalizers bridge the name differences at read time:
- French / German normalizers read `lesson.cultural_notes_vi` / `lesson.cultural_notes_en`
- Spanish normalizer (post-PR #461) reads `lesson.cultural_note` → `culturalNotesEn`

So the script round-trips Spanish content correctly without a tweak.

## Post-sync DB verification (German B2 lesson 1)

```
title_vi: Từ đệm tự nhiên
title_en: Modal particles and fillers
cultural_notes_vi present: true
cultural_notes_en present: true
tip_advice_en present: true
sentences[0].pronunciation_focus_en present: true
vocabulary[0].pronunciation_en present: true
```

## Visual confirmation — delegated to Chau

Agent cannot run an interactive browser. Brief asked for a screenshot of `mercyblade.com/languages/german` with the EN toggle, B2 lesson expanded. Pre-merge ask: hard-refresh, toggle EN, switch to B2, expand the first lesson. Confirm English text in cultural / tip / pronunciation sections with no `VI` fallback badges. Attach the screenshot to this PR.

## What this PR does NOT do

- No code change. Pure documentation of a database catch-up operation.
- No Japanese / Korean / Chinese sync — no bilingual `_en` content has been authored for those languages.

## Recommended follow-up (not in this PR's scope)

Wire `scripts/sync-lessons-to-supabase.ts` into the deploy pipeline (or a prebuild step gated by env flag) so the DB can't silently drift behind the TS seed when a future content round ships. Either run the full sync on every Vercel build (idempotent), or hash-gate per-file so unchanged content is a no-op.
