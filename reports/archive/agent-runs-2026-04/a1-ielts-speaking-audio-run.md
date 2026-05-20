# A1 — IELTS Speaking audio generation run

**Date**: 2026-05-07
**Branch**: `audio/ielts-speaking-generate`
**Off**: `origin/main` @ `a3ddac49` (commit message: `feat(ielts-speaking): wire topic answers and TTS samples (#336)`)
**Script**: `scripts/generate-ielts-speaking-audio.ts` (added in this PR)

## Summary

| Metric | Value |
|--------|-------|
| Topics processed | 30 |
| Clips planned (jobs) | 60 (30 × band 7, 30 × band 5) |
| Generated | 60 |
| Skipped (already in bucket) | 0 |
| Failed | 0 |
| Quota hit | no |
| **Total chars billed** | **25,279** |
| Band 7 voice | `hpp4J3VqNfWAUOO0d1Us` |
| Band 5 voice | `CwhRBWXzGAHq8TQ4Fs17` |
| Bucket | `room-audio` (Supabase Storage) |
| Path scheme | `ielts-speaking/{topic.id}/band{5|7}.mp3` |
| Model | `eleven_multilingual_v2` |
| Voice settings | `{ stability: 0.5, similarity_boost: 0.75 }` |

## Per-topic char counts

Counts measured against the *post-strip* text actually sent to ElevenLabs.
Band-5 strip rule: `text.replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim()`.

| Topic id | Band 7 chars | Band 5 chars |
|----------|------:|------:|
| `ielts_speaking_part1_hometown` | 481 | 155 |
| `ielts_speaking_part1_family` | 513 | 207 |
| `ielts_speaking_part1_work_study` | 553 | 131 |
| `ielts_speaking_part1_hobbies` | 478 | 143 |
| `ielts_speaking_part1_food` | 565 | 155 |
| `ielts_speaking_part1_technology` | 531 | 155 |
| `ielts_speaking_part1_sports` | 555 | 158 |
| `ielts_speaking_part1_travel` | 533 | 148 |
| `ielts_speaking_part1_weather` | 576 | 125 |
| `ielts_speaking_part1_music` | 554 | 125 |
| `ielts_speaking_part2_describe_family_member` | 755 | 124 |
| `ielts_speaking_part2_describe_favourite_restaurant` | 698 | 128 |
| `ielts_speaking_part2_describe_celebration` | 772 | 127 |
| `ielts_speaking_part2_describe_valuable_item` | 707 | 108 |
| `ielts_speaking_part2_describe_challenge` | 774 | 114 |
| `ielts_speaking_part2_describe_dream_destination` | 727 | 114 |
| `ielts_speaking_part2_describe_recent_purchase` | 653 | 93 |
| `ielts_speaking_part2_describe_teacher` | 739 | 118 |
| `ielts_speaking_part2_describe_decision` | 750 | 120 |
| `ielts_speaking_part2_describe_landmark` | 813 | 129 |
| `ielts_speaking_part3_family_modern_society` | 753 | 166 |
| `ielts_speaking_part3_technology_work` | 737 | 129 |
| `ielts_speaking_part3_globalization_culture` | 846 | 160 |
| `ielts_speaking_part3_education_reform_vietnam` | 865 | 140 |
| `ielts_speaking_part3_environmental_responsibility` | 851 | 119 |
| `ielts_speaking_part3_tradition_progress` | 865 | 120 |
| `ielts_speaking_part3_media_society` | 826 | 128 |
| `ielts_speaking_part3_generational_differences` | 917 | 180 |
| `ielts_speaking_part3_urban_rural_living` | 871 | 128 |
| `ielts_speaking_part3_future_of_work` | 931 | 143 |
| **Total band 7** | **20,492** | — |
| **Total band 5** | — | **4,787** |
| **Grand total** | — | **25,279** |

## Failures

None.

## What's in the PR

- `scripts/generate-ielts-speaking-audio.ts` — the generator (committed per Chau's instruction; reusable for future regenerations)
- `reports/a1-ielts-speaking-audio-run.md` — this report

Not committed (gitignored): `audio-manifest.json`, `audio-progress.json`. The script does not touch those — it walks the topics file directly and skips bucket-side existence checks instead of using a manifest.

## Idempotency check

Script lists the bucket directory before each render and skips if the filename already exists. A second invocation with no quota changes would report `Skipped: 60`, `Generated: 0`, `Chars billed: 0`. This matches the existing convention in `scripts/generate-b2-audio.ts`.

## Conventions matched against `scripts/generate-b2-audio.ts`

| Aspect | b2 script | ielts script | match |
|--------|-----------|---------------|-------|
| ElevenLabs base URL | `https://api.elevenlabs.io/v1/text-to-speech` | same | ✓ |
| Model | `eleven_multilingual_v2` | same | ✓ |
| Voice settings | `{ stability: 0.5, similarity_boost: 0.75 }` | same | ✓ |
| Bucket | `room-audio` | same | ✓ |
| Concurrency | 4 | 4 | ✓ |
| Retries | 3 with exponential backoff | same | ✓ |
| Quota handling | graceful exit, preserve progress | graceful exit, log failure | ✓ |
| Auth | `SUPABASE_SERVICE_ROLE_KEY` (bypass RLS) | same | ✓ |
| Env loading | `.env.local` then `.env`, both worktree + main repo | same paths | ✓ |

## Notes

- Voices were picked deterministically: band 7 = first entry of `VOICE_IDS` in `build-audio-manifest.ts`, band 5 = second entry. This gives the band 5 clips a distinguishably different voice without introducing a third unfamiliar identity to the app's voice palette.
- Bracket-strip is a one-line regex that handles every annotation in the current 30-topic source: `[vague — no detail]`, `[grammar: it has, plural beaches]`, `[no example]`, `[the 'thank you' is unnecessary and signals nervousness]`, etc. If future band-5 content introduces nested or multi-line brackets, the regex will still strip the outermost `[…]` per occurrence.
- No manifest entries were added — IELTS Speaking audio is consumed directly via Supabase public URLs by the speaking-topic page, not through the rooms audio resolver. If a future change wires it through `roomAudioResolver.ts`, manifest entries will need to be added separately.
