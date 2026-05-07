# A5 — C1 R3 audio generation run (2026-05-07)

ElevenLabs audio generation for the C1 Round 3 batch across all 5
non-Vietnamese languages. 0-failure target met.

## Lesson scope

| Language | IDs | Count |
|----------|-----|------:|
| Chinese (zh)  | 122–131 | 10 |
| Japanese (ja) | 112–121 | 10 |
| Korean (ko)   | 112–121 | 10 |
| French (fr)   | `lthesis_defense_opening` … `lcontroversial_position` | 10 |
| German (de)   | `ldisputation_konjunktiv` … `lbegriffsschaerfe_anschlussfaehigkeit` | 10 |

Storage paths follow the `c1/{lang}/l{lesson_id}/...` convention from
`src/lib/lessonAudio.ts:31-46`; numeric IDs become `l{n}` and string
IDs become `l{id}` (the leading `l` of the source ID is preserved,
yielding the double-l prefix — e.g. `c1/fr/llthesis_defense_opening/sentence_1.mp3`).

## Run results

```
                  pending → newly generated · skipped · failed · raw chars
  zh  l122..l131    359  → 359 · 0 · 0 ·  20,697
  ja  l112..l121    240  → 240 · 0 · 0 ·   6,070
  ko  l112..l121    351  → 351 · 0 · 0 ·  13,108
  fr  llthesis…     349  → 349 · 0 · 0 ·  61,139
  de  lldisputation… 135  → 135 · 0 · 0 ·   8,893

  TOTAL           1,434  → 1,434 · 0 · 0 · 109,907 raw chars
```

Per-language `Chars billed` lines from each script summary (cumulative
in `audio-progress.json` — this run's delta matches the raw-char
column above):

```
  zh: 401,305  → +20,697 vs the run-prior 380,608
  ja: 407,375  → +6,070
  ko: 420,483  → +13,108
  fr: 481,622  → +61,139
  de: 490,515  → +8,893
```

## Manifest delta

```
                clips    chars
  before run   17,642   ≈760K     (post C1 R2 / C2 R1 baseline)
  after run    19,076  935,526
  delta        +1,434  +175,460
```

Note: the manifest grew when the lesson content for C1 R3 landed on
`main` (PRs #325–#329 etc), not as a result of this run. The audio
generation only fills in the bucket; the manifest entries already
existed.

## Filter strategy

The generator's `--slug-prefix` filter compares against the third
segment of the storage key, which collides across languages (Chinese
also has `l112..l121` from C1 R2). Combining `--lang=<X>` with
`--slug-prefix=<that-language's-R3-slugs>` is the only safe way to
hit C1 R3 only without re-running existing R1/R2/C2 R1 audio.

Five sequential invocations:

```bash
SLUG_ZH="l122,l123,l124,l125,l126,l127,l128,l129,l130,l131"
SLUG_JK="l112,l113,l114,l115,l116,l117,l118,l119,l120,l121"
SLUG_FR="llthesis_defense_opening,llresponding_to_rapporteur,..."
SLUG_DE="lldisputation_konjunktiv,llhabilitation_probevorlesung,..."

npx tsx scripts/generate-b2-audio.ts --lang=zh --slug-prefix="$SLUG_ZH"
npx tsx scripts/generate-b2-audio.ts --lang=ja --slug-prefix="$SLUG_JK"
npx tsx scripts/generate-b2-audio.ts --lang=ko --slug-prefix="$SLUG_JK"
npx tsx scripts/generate-b2-audio.ts --lang=fr --slug-prefix="$SLUG_FR"
npx tsx scripts/generate-b2-audio.ts --lang=de --slug-prefix="$SLUG_DE"
```

Concurrency=4 per language (the `CONCURRENCY` constant inside the
script). Total wall-clock for the run was on the order of an hour.

## FPT.AI

The brief flagged FPT.AI for Vietnamese sentences embedded inside
`dialogue_long`. The C1 R3 lesson set extracted by
`scripts/build-audio-manifest.ts` contains zero Vietnamese-language
clips — the manifest extractors only voice the L2 content (Chinese,
Japanese, Korean dialogue lines and French/German `s.en` sentences).
`cultural_notes_vi` and any `vi` translation fields are intentionally
not voiced, so no FPT calls were made on this run. If a future round
introduces code-switching dialogue with Vietnamese turns, those
should route through `scripts/generate-vietnamese-audio.ts`
separately.

## Verification

- `dist`-side artifacts: not relevant — audio lives in Supabase
  Storage `room-audio` bucket. The script uploads on success and
  records the storage key in `audio-progress.json` (gitignored).
- Spot-check sample storage keys (verified pre-run via `--dry-run`):
  ```
  c1/fr/llthesis_defense_opening/sentence_1.mp3
  c1/fr/llthesis_defense_opening/sentence_2.mp3
  c1/zh/l122/...
  c1/ja/l112/...
  c1/ko/l112/...
  c1/de/lldisputation_konjunktiv/...
  ```

## Flags / uncertain

- The brief's "expected real billing ~380K" did not match. The
  script's character counter (input string length) summed to 109,907
  exactly, and the per-language `Chars billed` deltas match this
  number byte-for-byte. ElevenLabs may charge a multiplier for
  non-Latin scripts that the local counter does not see; the actual
  ElevenLabs invoice should be checked against this number rather
  than the 380K projection.
- `audio-progress.json` (now containing the 1,434 new C1 R3 keys)
  lives only in the agent worktree; the shared file at
  `/Users/admin/MercyB/audio-progress.json` was the read-only source
  used to compute the dry-run pending count and was not modified by
  this run. Whoever lands this PR should copy the worktree's
  post-run progress file back to the canonical location, or rerun
  with the canonical file in place to keep the two synchronized.
