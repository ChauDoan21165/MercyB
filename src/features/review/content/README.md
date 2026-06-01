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

## Wiring policy — seeds are NOT live

Building a seed does **not** wire a flow into the live `ReviewApp`. A flow flips
on only after its seed passes the gate **and** a human review pass — at which
point a `seedSource` (reading the certified seed) gets registered in
`sources/defaultSources.ts`. Until then `getItems('vi-de'|'vi-ja'|'vi-ko'|'vi-zh')`
still returns `[]` at runtime. `status: "for-review"` on every seed enforces the
distinction.

## Status

- **vi→de** — adapter + 20-card A1 seed shipped (2,024 candidates → 1,923 certified;
  pure adaptation, zero generation). For review. Not yet wired live.
- **vi→zh / vi→ko / vi→ja** — pending (adapt subset + generate gap; ja strictest).
