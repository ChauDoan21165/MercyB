# Pronunciation Prewarm

## Headline

- Phase 1 target units: 657
- Cached reference-audio objects HEAD 200: 657/657
- Failed HEAD checks: 0
- Phase 2 local generation: blocked; export AZURE_SPEECH_KEY and AZURE_SPEECH_REGION

## Sample Gate

Approved by Chau after these deployed-function cache URLs were produced:

1. https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/bd3b34c56879f7f3c83cf79b91cbb2a260635b44464d3480b9a6e1a936acc62d.mp3
2. https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/8d25de3a0828ce424fca52eed8acb12b6405b6872d766cb95ddad8e78a3fcbdd.mp3
3. https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/26bff46bcec3e5cd8f022253ae3f2543a84c9a5d61e384f56eed5710384209e4.mp3
4. https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/6075d58a62a07cfbd13ab9bc07537806b5391556028077196acf52137d5d80b5.mp3
5. https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/d6748b312e9afa0a6ccdd6c4c5b5ada8549b12576e1e37f74bf429a66d4ca806.mp3

## Phase 1 Counts

| category | units |
| --- | ---: |
| ipa_reference_vocabulary | 68 |
| phoneme_drill_sentence | 250 |
| pronunciation_challenge_sentence | 60 |
| sound_pair_word_or_phrase | 279 |

Verification used `buildAzureTtsCacheReference` from the shipped `mercy-tts` core and public-object HEAD checks against `room-audio`.

## Phase 2 Targets

- Missing Korean structured-path files: 30
- Size-outlier files: 12
- Total local regeneration targets: 42
- Upload script: reports/audio-census/upload-outbox.sh

| language | targets |
| --- | ---: |
| de | 1 |
| fr | 2 |
| ja | 4 |
| ko | 31 |
| vi | 4 |

## Phase 2 Blocker

Local Azure synthesis was not run because `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` are unset in this shell.

