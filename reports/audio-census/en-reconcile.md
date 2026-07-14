# English Audio Reconciliation

## Summary

Every unit in the census English TTS-first inventory is classified exactly once.

| Bucket | Units |
| --- | ---: |
| scheme_a_legacy_file | 0 |
| a1_tts_cache_map | 2 |
| present_in_tts_cache_anyway | 0 |
| runtime_tts_only_first_play | 1325 |

True English lesson content with no static audio in any scheme: **1325 / 1327**.

## Cache Listing

Current live `tts-cache` object count: **587**. The old census listed **586** objects in the same prefix.

Pagination probe:

- prefix `tts-cache`, limit 100: 587 objects (100 + 100 + 100 + 100 + 100 + 87)
- prefix `tts-cache`, limit 500: 587 objects (500 + 87)
- prefix `tts-cache`, limit 1000: 587 objects (587)
- prefix `tts-cache/`, limit 100: 587 objects (100 + 100 + 100 + 100 + 100 + 87)
- prefix `tts-cache/`, limit 500: 587 objects (500 + 87)
- prefix `tts-cache/`, limit 1000: 587 objects (587)

The 627-cell A1 map contains **530 distinct tts-cache objects** and HEAD-verifies **530** distinct objects. The apparent 627-vs-listing discrepancy is cell-level tuples versus distinct files, not storage pagination.

Corrected tts-cache orphan count after accounting for the A1 map and English TTS-first references: **57 objects**, **1101744 bytes**.

## Key Logic

The reconciliation imports `buildAzureTtsCacheReference` from `supabase/functions/mercy-tts/core.ts`, which uses the production Azure cache key for `azure|voice|language|trimmed text`. Runtime key mismatches against the census inventory: **0**.

Scheme A matching is exact `storage_key` matching against verified `A_legacy_root` links from `reports/cell-inventory/audio-link-global.json`; those artifacts do not carry spoken text hashes. Scheme A covers **0** of the 1,327 English TTS-first units.

## HEAD Probe

- A1 map distinct statuses: `{"200":530}`
- English inventory distinct statuses: `{"200":2,"400":1325}`

## Examples

### scheme_a_legacy_file

No examples.

### a1_tts_cache_map

- `tts-cache/55a83af1d2e952423926fc42f3f7bbed7fcbaeb428ec9feb802d0ea5f3897bc8.mp3` — I like Vietnamese food. (src/lib/speech/lessonPractice.ts:ielts_speaking_part1_food:band5)
- `tts-cache/82ae7edcf138794a002149ff23432c880be38205266f1d956df1e99362f507a6.mp3` — Thank you. (src/lib/speech/lessonPractice.ts:ielts_speaking_part1_hometown:band5)

### present_in_tts_cache_anyway

No examples.

### runtime_tts_only_first_play

- `tts-cache/bd3b34c56879f7f3c83cf79b91cbb2a260635b44464d3480b9a6e1a936acc62d.mp3` — a black bird (src/components/speech/SoundPairDrillCard.tsx:stress:contrast)
- `tts-cache/8d25de3a0828ce424fca52eed8acb12b6405b6872d766cb95ddad8e78a3fcbdd.mp3` — a blackbird (src/components/speech/SoundPairDrillCard.tsx:stress:target)
- `tts-cache/26bff46bcec3e5cd8f022253ae3f2543a84c9a5d61e384f56eed5710384209e4.mp3` — A canner can can anything that he can can, but a canner cannot can a can. (src/data/pronunciation-challenges/index.ts:tt_can_can_canner)
- `tts-cache/6075d58a62a07cfbd13ab9bc07537806b5391556028077196acf52137d5d80b5.mp3` — A cat sat. (src/pages/practice/PhonemeDrillPage.tsx:ae)
- `tts-cache/d6748b312e9afa0a6ccdd6c4c5b5ada8549b12576e1e37f74bf429a66d4ca806.mp3` — A full fool is full of foolish thoughts. (src/data/pronunciation-challenges/index.ts:mp_full_fool)
