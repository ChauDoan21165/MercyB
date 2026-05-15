# French A1 EN content invisible on prod — Supabase row was stale

## Symptom

`mercyblade.com/languages/french` with the EN toggle on, French A1 lesson 1 expanded:
- `CULTURE` section: Vietnamese text + small `VI` fallback badge
- Pronunciation pills: Vietnamese (`nasal on · nasal in · silent -e · elle → èl`) + `VI` badges

Hard refresh did not fix it.

## Root cause — Step 2 of the diagnostic plan

Lesson content is fetched at runtime from Supabase `public.lessons`, **not** from the TS files in `src/languages/french/lessons-a1.ts`. The TS files are seeds; the canonical data lives in the DB.

```ts
// src/pages/languages/FrenchLessonsPage.tsx (~line 58)
fetchLessonsBatch<FrenchLesson>("french", level.toLowerCase())
```

```ts
// src/hooks/useLessonData.ts (~line 91)
export async function fetchLessonsBatch<T>(language, level) {
  const { data } = await supabase.from("lessons").select("*")...
}
```

PR #451 added `cultural_notes_en` / `tip_advice_en` / `pronunciation_focus_en` to the TS files. Nobody re-ran the seed script, so Supabase rows for French A1 still lacked those columns. The renderer correctly fell back to VI and surfaced the `VI` badge.

### Evidence (pre-fix)

Direct Supabase query for `lessons` where `language=french level=a1 lesson_index=1`:

```
title_vi: Chào hỏi cơ bản
has cultural_notes_vi: true
has cultural_notes_en: false
has tip_advice_en: false
sentences[0].pronunciation_focus_en: undefined
```

## Fix

Ran the existing sync script with French-A1 scope:

```bash
npx tsx scripts/sync-lessons-to-supabase.ts --language=french --level=a1
# [Done] inserted=0 updated=20 unchanged=0
```

All 20 French A1 rows upserted from `src/languages/french/lessons-a1.ts`.

### Evidence (post-fix)

```
cultural_notes_en present: true
tip_advice_en present: true
sentences[0].pronunciation_focus_en present: true
```

Sample of the new `pronunciation_focus_en` for lesson 1:

```
"nasal 'on' in bonjour — no English equivalent; the 'n' isn't pronounced, the vowel is held through the nose"
"nasal 'in' (m'appelle has none, but the technique transfers) — practice with the French word itself"
"silent final '-e' — the 'e' at the end of 'appelle' is not pronounced"
"elle → 'el' as in 'bell'; double 'l' is one sound"
```

## Likely follow-ups (out of scope for this PR)

The same staleness almost certainly affects every other (language, level) pair where bilingual data was added to TS files after the last seed sync:

- French A2 (PR #454 added EN fields)
- German A1–C2 (PRs #439–#450 added EN fields)
- Any future content round

A safer long-term fix would be to wire `scripts/sync-lessons-to-supabase.ts` into the deploy pipeline (or at minimum a prebuild hook gated by an env flag) so the DB can't drift behind the TS seed.

## Verification

- Pre-fix DB query: VI present, EN absent ✓
- Post-fix DB query: VI + EN both present ✓
- Visual click-through on production: **delegated to Chau** (agent cannot run an interactive browser). Hard-refresh `mercyblade.com/languages/french`, toggle EN, expand French A1 lesson 1 — Cultural section should show English text and no `VI` badge.
