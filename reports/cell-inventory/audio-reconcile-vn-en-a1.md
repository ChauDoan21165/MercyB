# VN->EN A1 Audio Reconciliation

Generated: 2026-07-13

## Ground Truth

Scope: 627 Vietnamese->English A1 cells in `src/languages/vietnamese/lessons-a1.ts`.

The reconciliation recomputed the production Azure TTS cache key from current cell text:

`sha256("azure|en-US-AvaMultilingualNeural|en|${currentEnglishText.trim()}")`

Then it checked the public production cache URL:

`https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/{sha256}.mp3`

Results:

| Category | Count |
| --- | ---: |
| Matched current text hash | 627 |
| Stale hash: old text hash present, current hash missing | 0 |
| Missing entirely | 0 |

By cell type:

| Cell type | Total | Matched | Stale hash | Missing |
| --- | ---: | ---: | ---: | ---: |
| Vocabulary Item | 412 | 412 | 0 | 0 |
| Dialogue Turn | 215 | 215 | 0 | 0 |

The committed pre-reconcile map already had 627 rows, and its tuple text/hash matched current lesson text for all 627 cells. The production cache also returned HTTP 200 for all 627 current URLs. No re-warm is needed for this wedge.

## Evidence Samples

| Cell UUID | Legacy address | Text | Current hash | HEAD |
| --- | --- | --- | --- | --- |
| `ac42c0db-b4d5-52af-b9ae-ea4117ff970c` | `vi-en:A1:lesson-001:vocabulary-001` | `Hello` | `6957d5f33b59b60982b6c9703c1e2f34c1729da83a3140bf25568407b18688e5` | 200 |
| `befee1e7-12cd-598a-9792-d6cf0e78b923` | `vi-en:A1:lesson-001:vocabulary-002` | `Good morning` | `4686dfd02c20910fe679a1041d7166096d62e36ff704911356e79178a28851a2` | 200 |
| `72c88c03-a875-4e34-9929-67af38c2a34b` | `vi-en:A1:lesson-071:dialogue-turn-003` | `I want stable internet for work.` | `26b392b3cc56908ac402e2aeef13b3b12a0d43991ba6cda941bf7742ab5b8994` | 200 |
| `d9305ba6-1457-43e1-867f-47d48acf97b8` | `vi-en:A1:lesson-071:dialogue-turn-004` | `Okay, I have a 30-day plan with more data.` | `f96e792068deffd873cbbaa38e7f5dc92497dc193e24259a2e8ce486fa8829c5` | 200 |
| `801733ce-80c2-57a3-a95d-f09d607a4271` | `vi-en:A1:lesson-096:vocabulary-003` | `"Để tôi xem" means let me check.` | `b1a52a8a085f67353c63c45e7ade82fbd15581801fdc4b0cd19ecfa6a208626b` | 200 |

## Gap Mechanism

The 627-vs-215 discrepancy was a check-K scanner/addressing discrepancy, not an audio-cache discrepancy.

Hypothesis (a), cell text edited after warmup: false. Current lesson text matched the committed audio-map tuple text for all 627 cells; hash mismatches were 0/627.

Hypothesis (b), TTS cache key mismatch: false for production cache hashing. The current recomputed hash matched the committed map hash for all 627 cells, and every current hash returned HTTP 200. There was a check-K keying issue: the map used synthetic `vi-en:A1:...` cell IDs, while the canonical object identity after WP-IPA-APPLY is persisted `WP-CELL-ID-1` UUID.

Hypothesis (c), map targets lesson-level not object-level: false. The map rows target object-level `source_object.lesson_id + ordinal` and now also target persisted object UUIDs. The source-level ordinal mapping was enough for dialogue, but UUID mapping is the canonical object-level key.

Hypothesis (d), vocabulary objects never warmed: false. All 412 current vocabulary hashes returned HTTP 200. The scanner missed vocabulary because Vietnamese A1 vocabulary lives in `phrases`, not `vocabulary`.

Origin/main check-K evidence before this MR:

- `findCellLessonObjects` accepted only objects with `vocabulary` or `dialogue` arrays (`scripts/cell-coverage-scan.mjs` lines 121-128 on origin/main), so lessons containing only `phrases` were skipped.
- The scan loop iterated only `["vocabulary", "dialogue"]` (`scripts/cell-coverage-scan.mjs` lines 404-410 on origin/main), so `phrases` arrays were never counted as vocabulary cells.
- Cache mapping was source-address-only (`scripts/cell-coverage-scan.mjs` line 420 on origin/main), so the committed map was not keyed by persisted `cell_id`.

After this MR, the local check-K cluster for `src/languages/vietnamese/lessons-a1.ts` is:

| Metric | Count |
| --- | ---: |
| Total objects | 627 |
| Vocabulary objects | 412 |
| Dialogue objects | 215 |
| Cache-mapped audio objects | 627 |
| Runtime-TTS-only audio objects | 0 |

## TTS Hash Code Proof

The cache key is computed server-side in the production Supabase Edge Function from the request text and resolved Azure voice:

- `supabase/functions/mercy-tts/core.ts:77-83` defines `sha256Hex(input)`.
- `supabase/functions/mercy-tts/core.ts:283-289` computes the Azure cache hash before synthesis: `sha256Hex(\`azure|${azureVoice.name}|${language}|${text}\`)`.
- `supabase/functions/mercy-tts/core.ts:173-174` maps a hash to `tts-cache/{hash}.mp3`.
- `supabase/functions/mercy-tts/core.ts:434-436` writes finalized Azure audio to that cache path after synthesis.

Conclusion: the cache key is server-side from the synthesized request text. The client/warmup script can predict the key only because it mirrors the server formula; the production write authority remains the `mercy-tts` function.

