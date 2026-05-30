# Step 7 Azure Phoneme Pipeline

## A. Current Merged Foundation

Step 7 has a merged batch-only foundation. It is not a production rollout by itself.

Edge function contract:
- Endpoint: `supabase/functions/azure-phoneme`.
- Auth: requires a Supabase JWT before scoring.
- Request shape: multipart form data with `audio` as WAV PCM 16 kHz mono, `target_text`, optional `accent`, optional `target_locale`, and optional `context`.
- Validation: rejects missing audio, empty audio, non-WAV audio, audio over 2 MB, audio over 60 seconds, and missing `target_text`.
- Success response: `ok:true`, `provider:"azure"`, `mode:"batch"`, `score`, `overall_score`, `word_scores`, `phoneme_scores`, `audio_seconds`, and `cost_usd_cents`.
- Fallback response: `ok:false`, `use_local:true`, and a stable `reason`.
- Real Azure execution is gated by server configuration; disabled or missing Azure config returns `use_local:true`.

Client wrapper:
- `scorePronunciationWithStep7Fallback` tries the batch edge path only when Step 7 is enabled and a user JWT exists.
- If the edge path is disabled, unavailable, malformed, or returns no phoneme evidence, the wrapper returns local sentence/word matching.
- Local fallback is labeled as sentence matching, not phoneme grading.

Speak UI evidence guard:
- The Speak UI only shows detailed phoneme UI when the result is Azure batch mode and contains phoneme evidence.
- Without Azure phoneme evidence, the UI keeps the interim sentence-match wording.

Fallback path:
- Browser audio is converted to WAV PCM 16 kHz mono before the edge call.
- If conversion, network, provider, quota, timeout, no-match, or config failure occurs, the learner gets honest local sentence/word similarity.

## B. End-To-End Data Flow

1. Learner speaks.
2. Browser captures audio with the existing recording surface.
3. Client converts the recording to WAV PCM 16 kHz mono.
4. Client calls the local/dev or production Supabase edge function when Step 7 is enabled.
5. Edge function validates auth, rate/cost gates, audio shape, and `target_text`.
6. Edge function sends audio bytes and reference text to Azure Pronunciation Assessment.
7. Azure returns pronunciation assessment data.
8. Edge function normalizes Azure output into overall, word, and phoneme scores.
9. Client displays phoneme detail only when trusted phoneme evidence exists.
10. If any provider path fails, client displays local sentence/word similarity.

## C. Privacy Contract

- No raw audio storage server-side.
- No transcript persistence by default.
- Audio bytes flow through the edge function to Azure and are discarded after the request.
- Response must not include raw audio.
- Response must not include Azure transcript text.
- `speech_attempts.transcript` must remain empty or equivalent safe non-transcript unless a later approved privacy change explicitly allows transcript persistence.
- Kids mode must be stricter: no Azure upload unless separately approved for kids.

## D. Cost Model

Exact Azure pricing must be confirmed before production rollout. Until then, use this as an operational placeholder.

Known implementation estimate:
- Current edge code computes cost from audio duration using an internal per-minute estimate.
- Cost is capped operationally by per-user rate limits, trial/premium gating, global daily cap, 2 MB audio cap, and 60 second audio cap.

Planning placeholders:

| Scenario | Assumption | Formula | Monthly projection |
| --- | --- | --- | --- |
| Per call | Average recording length = `S` seconds; Azure price = `$P` per minute | `(S / 60) * P` | Unknown until `$P` is confirmed |
| Current usage | `A` active learners/day, `C` calls/learner/day | `A * C * (S / 60) * P * 30` | Unknown: needs current `A`, `C`, `S`, and confirmed `P` |
| 10x usage | `10A` active learners/day, same `C`, `S`, `P` | `10 * A * C * (S / 60) * P * 30` | Unknown: needs current baseline |

Expected calls per active learner/day:
- Initial planning range: 3-10 pronunciation checks per active Speak learner/day.
- Production cap should be set below the surprise-spend threshold before enabling real learner access.

Unknowns to confirm:
- Exact Azure Pronunciation Assessment price for the deployed region and billing meter.
- Actual average recording duration.
- Actual Speak active learners/day.
- Actual retry rate after timeout/no-match/network failures.

## E. Score Label Upgrade Plan

Current interim wording:
- "Bạn nói giống câu mẫu khoảng X%."
- "Mercy đang nghe theo từ. Sẽ chấm phát âm chi tiết hơn sau."

Step 7 wording is allowed only when phoneme evidence exists:
- Keep the same primary number so learner trust is continuous.
- Add detail beneath the primary number.
- Example detail: "Âm cuối cần luyện thêm"

Learner trust rules:
- Do not call local sentence/word similarity "pronunciation grading".
- Do not show phoneme-level critique without Azure phoneme evidence.
- Do not show Azure detail when the response is `use_local:true`.
- Do not show transcript-derived claims as phoneme claims.
- If the provider fails, say the system is using word/sentence match only.

## F. Failure Modes

| Failure | System behavior | Learner sees |
| --- | --- | --- |
| Azure timeout | Edge returns `ok:false,use_local:true,reason:"azure_timeout"` | Sentence/word similarity wording only |
| Quota or cap exhaustion | Edge returns `use_local:true` with cap/trial reason | Sentence/word similarity wording only; no phoneme claim |
| Network failure | Client or edge falls back to local scoring | Sentence/word similarity wording only |
| Malformed provider response | Edge returns `use_local:true` or safe provider error reason | Sentence/word similarity wording only |
| Auth failure | Edge returns auth error; client should re-auth rather than fake local cloud success | Sign-in/session recovery path |
| Invalid audio | Edge rejects with a validation error | Ask learner to record again or retry with valid audio |
| Azure no-match | Edge returns `use_local:true,reason:"azure_no_match"` | Sentence/word similarity or retry prompt; no phoneme claim |
| Azure disabled or missing key | Edge returns `use_local:true` | Sentence/word similarity wording only |

## G. Rollback Plan

- One config/flag change must return production to local sentence/word similarity.
- Disable Azure batch execution server-side or disable Step 7 client use.
- The UI must not make false pronunciation claims after rollback.
- No production data migration is required because raw audio is not stored and transcript persistence is off by default.
- Existing local scoring remains the safe fallback path.

## H. Production Smoke Gate

Dev smoke must run in local/dev only. It must not expose production learners, must not enable production learner access, and must not change production flags.

During dev smoke:
- No production learner exposure during dev smoke.
- No production access enabled during dev smoke.
- No production flags changed during dev smoke.

No production smoke is allowed until Chau gives this exact future approval:

> Approve production smoke for Step 7

Production smoke must remain limited in scope:
- No broad rollout.
- No shared/cloud runner requirement.
- No secrets printed.
- No raw audio storage.
- No transcript persistence.
- Verify fallback can be restored by config/flag change before expanding access.
