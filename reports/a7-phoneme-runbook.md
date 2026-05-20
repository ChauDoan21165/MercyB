> ⚠️ **ARCHIVE-CLASS (April 2026)** — historical runbook/recon kept in
> place due to live cross-references outside `reports/`. Do not act on
> this document without verifying current state. See
> `reports/archive/agent-runs-2026-04/README.md` for context.

# A7 — STT vendor runbook for sound-pair drills

**Status:** UI ships with a stub (`scoreFromAudio` in `src/lib/pronunciation/soundPairDrills.ts`).
**Decision pending:** which STT vendor powers the real "did the learner say the target phoneme?" check.
**Owner at production wire-up:** engineer who picks up Step 3's production round.

This runbook exists so the next agent doesn't re-do the research. Compares the three vendors most often proposed for VN-accent English drills, with ballpark costs against the MercyBlade user base.

---

## Requirements from the drill UI

1. Transcribe a single spoken English word (1–3 sec of audio).
2. Useful at word-level detail, not sentence-level — we compare against a known target word, so even a string-match style confidence is workable.
3. Works in the browser (recorded via `MediaRecorder`, sent to vendor).
4. Tolerable latency: **< 1.5 s** round-trip from stop-recording to result.
5. Reasonable accuracy on **Vietnamese-accented English** (not just native-English speakers — the whole point is to flag learner-stage drift).
6. Cost realistic for a beta user base in the hundreds, scaling to low thousands.

Non-requirements: real-time streaming, diarisation, punctuation, long-form — all irrelevant for a single-word drill.

---

## Option A — OpenAI Whisper (hosted API)

- **Endpoint:** `POST /v1/audio/transcriptions` with `model=whisper-1` (or `gpt-4o-transcribe` / `gpt-4o-mini-transcribe` where GA).
- **Price (whisper-1):** $0.006 per audio minute → ~$0.0001 per 1-second drill attempt.
- **1K drill attempts ≈ $0.10** (most attempts will be under 2 seconds).
- **VN-accent support:** trained on 680K hours of multilingual audio; informal benchmarks rank Whisper-large-v3 as the best openly available model for accented English. Slightly weaker than commercial accent-specialist models on strongly non-native speech.
- **Latency:** typically 500–1200 ms for 1–3 sec clips (hosted). Acceptable.
- **Pros:** cheapest, batteries-included, no word-level timing needed for this use case, multilingual (useful if we later add VN prompts).
- **Cons:** no per-phoneme breakdown — we only get a transcript + log-probs; "did they say /θ/ or /t/?" is inferred from the word, not the sound. For single-word drills this is fine.
- **Wire-up effort:** **low.** A single fetch from an edge function.

## Option B — Deepgram Nova-3

- **Endpoint:** `POST https://api.deepgram.com/v1/listen?model=nova-3` with audio bytes.
- **Price (Nova-3, pay-as-you-go):** ~$0.0043 per minute for pre-recorded.
- **1K drill attempts ≈ $0.07.**
- **VN-accent support:** Deepgram advertises accent robustness but published benchmarks focus on US/UK English. In-house testing would be needed on VN-accented samples.
- **Latency:** 300–800 ms for short clips (Deepgram's pitch is speed). Best of the three.
- **Pros:** fastest round-trip, generous free tier ($200 credit), returns word-level confidence natively.
- **Cons:** no VN-accent-specific model; single-word accuracy roughly comparable to Whisper but with less public evidence for L2 English.
- **Wire-up effort:** **low.** Similar shape to Whisper.

## Option C — ELSA Speak API

- **Endpoint:** ELSA offers a B2B "Pronunciation Assessment" API — vendor contract required; not public self-serve pricing.
- **Price:** tiered; historical estimates have been in the **$0.01–0.03 per attempt** range for the phoneme-level API tier. **Roughly 10–30×** Whisper. Must confirm at contract time.
- **1K drill attempts ≈ $10–$30.**
- **VN-accent support:** explicitly tuned for Asian-language L2 English learners; ELSA's own product is a direct competitor in the pronunciation-coaching space. Best-in-class accuracy for our use case.
- **Latency:** comparable to Whisper (500–1500 ms).
- **Pros:** returns per-phoneme scores, which is what a sound-pair drill actually wants. No local scoring logic needed for pronunciation judgement.
- **Cons:** ~100× the cost of Whisper, business development conversation required, legal review, vendor lock-in on a pronunciation-specific shape.
- **Wire-up effort:** **medium.** Requires contract + response-shape adapter.

---

## Cost model at MercyBlade scale

Assumptions: 500 active users, average 20 drill attempts/user/week → **10K attempts/week** → **~43K/month**.

| Vendor      | $ / 1K attempts | Monthly cost | Annual cost |
|-------------|-----------------|--------------|-------------|
| Whisper API |  $0.10          |  ~$4.30      |  ~$52       |
| Deepgram    |  $0.07          |  ~$3.00      |  ~$36       |
| ELSA (est.) |  $10–$30        |  ~$430–$1290 |  ~$5k–$15k  |

Even at 10× the assumed volume (100K attempts/month), Whisper is still well under $50/month. ELSA, even at the low end, crosses the "needs budget approval" threshold immediately.

---

## Recommendation

**Start with Whisper API.** Reasons:

1. **Cost leaves no decision to make at MVP scale** — $5/month for the entire cohort is a rounding error. We don't have the user counts yet to justify pronunciation-specialist pricing.
2. **The stub seam is already sized for it.** `scoreFromAudio(audio)` → `{ confidence, transcript }` maps 1:1 to a Whisper response with a log-prob → confidence derivation.
3. **The drill is single-word.** We don't need per-phoneme output at this stage — a string match between transcript and target, weighted by Whisper's log-probs, is a defensible MVP scoring function.
4. **Escape hatch preserved.** If the accuracy on VN-accented clips proves poor (< 70% agreement with a human grader on a 100-clip sample), swap the implementation in `soundPairDrills.ts` to Deepgram without touching the UI. ELSA becomes the "Pro tier" move later if the product economics support it.

## Suggested production wire-up (for the next agent)

1. Add a Supabase edge function `stt-whisper` that:
   - accepts a short audio blob (< 10 s)
   - forwards to Whisper API using `ANTHROPIC_OPENAI_KEY` (or a dedicated `OPENAI_API_KEY` secret)
   - returns `{ transcript, avgLogProb }`.
2. Replace the body of `scoreFromAudio` in `src/lib/pronunciation/soundPairDrills.ts` with a fetch to that function; compute `confidence = clamp01(exp(avgLogProb))` or blend with the existing `scoreDrillAttempt(target, transcript)`.
3. Remove the `mocked: true` flag and the preview-score note in `soundPairCopy.ts` (`sttUnavailable`).
4. Gate behind a feature flag for the first week; dogfood internally, then roll out.
5. Log every attempt (target, transcript, confidence, user accent self-report) for 2 weeks — use the sample to evaluate whether to escalate to Deepgram/ELSA.

## Secrets / access required

- OpenAI API key (new) OR reuse whatever Supabase already holds for TTS/admin email flows.
- Budget alert at $25/month on the OpenAI project to catch runaway loops early.
- No PII handling concerns: audio is a user's own voice reading a prompt word — no sensitive data.

## Out of scope for this runbook

- On-device STT (Whisper.cpp in-browser, web-speech-api) — possible future experiment; not compared here because latency/accuracy story is separate.
- Per-phoneme assessment (Azure Pronunciation Assessment, Speechace) — comparable to ELSA in both cost and scope; deferred until ELSA conversation happens.
- Streaming ASR — not needed for single-word drills.
