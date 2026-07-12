# CELL Coverage Baseline — 2026-07-12

## Scope And File Map

Premise command run before measuring: `git fetch origin && git reset --hard origin/main`.

CELL-layer Vocabulary Item and Dialogue Turn objects live in TypeScript lesson object literals under `src/languages/**/*.ts`. A CELL lesson object is any object literal with a `vocabulary` array and/or a `dialogue` array. There is no single global content manifest for all CELL objects. Language `index.ts` files act as partial registries; for example, `src/languages/indonesian/index.ts` imports the core Indonesian levels and exposes `import.meta.glob("./extra/*.ts")` for the extra bank, but the vocabulary and dialogue objects themselves live in source files.

Measured file map:

- Non-test language TS files scanned: 1,235
- Files containing CELL arrays: 487
- Lesson objects containing `vocabulary` and/or `dialogue`: 2,061
- Checked-in audio assets under `public/`: 1,285
- Vocabulary Item objects: 14,418
- Dialogue Turn objects: 7,053

Real schema observed:

- Vocabulary objects commonly use `word` for the target token, with translations/metadata varying by file: `en`/`vi`, `meaning_en`/`meaning_vi`, `pos`, and pronunciation fields such as `pronunciation`, `pronunciation_vi`, and `pronunciation_en`.
- Dialogue objects vary more. Target text may be in `text`, `line`, `en`, or a language-named field such as `spanish`. Speaker and translation fields vary by file.
- Audio reference fields are not present on the measured CELL objects in a way that resolves to checked-in reference audio assets.

## Definitions

IPA-covered: an object is IPA-covered when any of `ipa`, `ipa_en`, `ipa_vi`, `pronunciation`, `pronunciation_en`, or `pronunciation_vi` exists as a non-empty string. Empty strings are uncovered.

Audio-addressable: an object is audio-addressable when any of `audio`, `audio_url`, `audioUrl`, `audio_path`, `audioPath`, `reference_audio`, or `referenceAudio` points to a checked-in audio asset under `public/`, or uses a `data:audio/*` URI. Empty strings, missing local files, and `http(s)` runtime/TTS URLs are not counted as checked-in reference audio.

Denominators: per-object coverage counts each Vocabulary Item or Dialogue Turn object once. Per-unique-word-token coverage tokenizes target text fields and counts each unique token once, marking the token covered if any object containing that token is covered.

## Method

The scanner parses `src/languages/**/*.ts` with the TypeScript compiler API, excluding test/fixture directories and `*.test.ts`/`*.spec.ts`. It finds object literals with `vocabulary` and/or `dialogue` arrays, counts array elements that are object literals, resolves audio references against checked-in assets under `public/`, tokenizes target text fields, and aggregates coverage by object type, file, and CEFR level.

The baseline ratchet is stored in `scripts/factory/cell-coverage-baseline.json`. Ratchet direction: uncovered counts may not rise. Coverage may improve. The only legitimate baseline increase is intentional CELL content removal, updated in the same MR that removes it.

## Headline Numbers

| Type | Objects | IPA object coverage | Audio object coverage | Unique tokens | IPA token coverage | Audio token coverage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Vocabulary | 14,418 | 10,365 / 14,418 (71.89%) | 0 / 14,418 (0%) | 11,062 | 8,124 / 11,062 (73.44%) | 0 / 11,062 (0%) |
| Dialogue | 7,053 | 1,139 / 7,053 (16.15%) | 0 / 7,053 (0%) | 13,158 | 1,649 / 13,158 (12.53%) | 0 / 13,158 (0%) |

## Gap Clusters

Worst file clusters by missing IPA objects:

| File | Total objects | Vocabulary | Dialogue | Missing IPA | Missing audio |
| --- | ---: | ---: | ---: | ---: | ---: |
| `src/languages/japanese/lessons-b2.ts` | 644 | 460 | 184 | 644 | 644 |
| `src/languages/korean/lessons-b2.ts` | 644 | 460 | 184 | 644 | 644 |
| `src/languages/korean/lessons-c1.ts` | 530 | 350 | 180 | 530 | 530 |

Worst level/type clusters by missing IPA objects:

| Cluster | Objects | Missing IPA | Missing audio |
| --- | ---: | ---: | ---: |
| `B1:dialogue` | 2,260 | 1,660 | 2,260 |
| `A2:dialogue` | 1,358 | 1,330 | 1,358 |
| `B2:dialogue` | 1,317 | 1,193 | 1,317 |

## Fill Mechanism

Filling IPA gaps requires adding non-empty phonetic coverage to the existing object-level pronunciation fields or introducing an equivalent schema field that the scanner can explicitly include. Filling audio gaps requires adding object-level reference-audio fields that point to checked-in audio assets under `public/`, then ensuring the referenced files exist at scan time. Runtime TTS alone will not move audio-addressable coverage because the scanner only ratchets durable, resolvable reference assets.
