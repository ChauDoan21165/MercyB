# Pronunciation Prewarm 2

## Headline

- Target units: 668
- Cached/reference-audio objects HEAD 200 after continuation 2: 668/668
- Missing after continuation 2: 0
- Continuation 2 source missing set: 325
- HEAD-first already present at continuation start: 0
- Deployed-function POST successes in continuation 2: 325
- Deployed-function POST failures in continuation 2: 0

## Target Counts

| category | units | HEAD 200 | missing |
| --- | ---: | ---: | ---: |
| speech_drill_sentence | 300 | 300 | 0 |
| ielts_speaking_sample_sentence | 338 | 338 | 0 |
| ielts_listening_script | 30 | 30 | 0 |

## Continuation 2 Result

No cap stop; continuation exhausted the prior missing set.

```json
null
```

The warmup path used only deployed `mercy-tts` POSTs and public HEAD checks. No direct storage writes were performed.

## Verification

Expected keys were recomputed with `buildAzureTtsCacheReference` from `supabase/functions/mercy-tts/core.ts`, then every public `room-audio` object was HEAD-checked.

## Missing Units

_None._


