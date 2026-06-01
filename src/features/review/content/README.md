# Review content pipeline (Lane D — `lane-d/content`)

Fills the vi→{de,ja,ko,zh} review flows from existing MercyBlade content, gated
for correctness. Lives entirely under `src/features/review/content/`.

## Layers

```
ingestion/   adapt existing lessons → ReviewCandidate[]  (+ generation hooks)
validate/    the gate every card passes through before it can go live  (DC2)
seeds/       buildSeed(): candidates → gated, level-filtered seed + quarantine report
seeds/out/   committed seed + quarantine JSON artifacts (for human review)
scripts/     build-time runner (offline; reads lessons, writes seeds/out/*.json)
```

Data flow: `ingestion → validate (gate) → seeds → seeds/out/*.json`.

## Provenance & the validation gate

Every card is `adapted` (front+back both authored — trusted) or `generated`
(VI gloss / reading produced by the build-time generator — MUST pass an injected
back-translation round-trip). The gate (`validate/`) certifies a card only if it
collects **zero** reasons: non-empty, front-is-Vietnamese, per-language back
script (Latin-de / kana·kanji-ja / hangul-ko / hanzi-zh), reading present
(ja/ko/zh), tone-marked pinyin (zh), CEFR tag, length sanity, cross-batch dedup,
and round-trip (generated only). Anything else → **quarantine** with reason codes.

## Building seeds (build-time only, offline)

```bash
npx tsx src/features/review/content/scripts/build-seeds.ts
```

Reads lessons read-only, runs the gate, writes `seeds/out/<flow>.<level>.seed.json`
+ `seeds/out/<flow>.quarantine.json`. NO runtime model calls, NO Supabase. The
generation-backed flows (zh/ko/ja gaps) plug a real `Translator` into the gate's
`roundTrip` option inside this script; vi→de needs none.

## Content-lint (DC4)

`seeds/__tests__/seedsLint.test.ts` re-gates every committed seed under
`seeds/out/` — CI runs the vitest suite, so an uncertified card (or a seed not
marked `for-review`) turns the build red and cannot land. The same logic runs
standalone via `npx tsx src/features/review/content/scripts/content-lint.ts`.
(It re-checks the full structural gate; the back-translation round-trip for
generated cards was enforced at build time and is not re-run — the persisted
seed has no Translator.)

## Wiring policy — a flow goes live only after review

Building a seed does **not** wire a flow into the live `ReviewApp`. A flow flips
on only after its seed passes the gate **and** a human review pass — at which
point a per-flow loader is registered in `sources/lazyLoaders.ts`
(`DEFAULT_FLOW_LOADERS`). An unregistered flow's `getItems()` returns `[]`.
`status: "for-review"` on every seed marks content that hasn't cleared review.

## Bundle: lazy per-flow loading

`ContentAdapter` loads each flow's content via `import()` (see
`sources/lazyLoaders.ts`), so Vite code-splits every flow into its own chunk
fetched only when that deck is opened. The `ReviewApp` chunk is ~7 KB gzip; the
heavy Spanish/bilingual lesson data and each seed are separate on-demand chunks.
Tests inject eager `sources` instead (the sync path) so they never pull real
content. Do NOT reintroduce a static `createDefaultSources()` that imports the
whole corpus — it re-bloats the ReviewApp chunk to ~230 KB gzip.

## Status (all for-review, none wired live)

- **vi→de** — adapter + 20-card **A1** seed (2,024 candidates → 1,923 certified;
  pure adaptation, zero generation).
- **vi→ko** — adapter + 20-card **A1** seed (726 → 719 certified; sentences only —
  vocab has no romaja so it can't pass the reading gate; pure adaptation).
- **vi→zh** — **B2** seed wired (adaptation, 447 → 438 certified). Chinese
  A1/A2/B1 lessons carry zero Vietnamese glosses, so the **A1** seed is
  **generated**: 24 hand-authored VI glosses over real A1 Chinese sentences
  (source tone-marked pinyin kept as the reading), gated + round-tripped →
  20-card A1 seed, `status:"for-review"`, **NOT wired** (pending a human ZH→VI
  review pass; vi→zh stays live at B2 only).
- **vi→ja** — 22 authored A1 items → 20-card seed (generated: vi gloss authored,
  certified through the gate incl. round-trip). **Romaji human-reviewed + corrected**
  (CEO pass): topic particle は→"wa" and all kanji transliterated (田中→tanaka,
  東京→tōkyō, 今日→kyō, 金曜日→kinyōbi, etc.) via per-card `reading` overrides in
  `ingestion/japaneseSeed.authored.ts`; the "今 (いま)" reading-in-parens vocab
  cards are left as-is. **Wired live** (behind FEATURE_REVIEW).
- **generate/** — build-time generation seams (Translator interface, deriveRomaji,
  round-trip checker, generateCandidates). Production MT wiring deferred (no
  offline endpoint); seeds use authored/injected translators + the human review.
