# Pronunciation scoring — MVP

Backend library that takes (target English sentence, user's recorded speech) and returns a score + per-word statuses + bilingual feedback. No UI in this folder — see `feat/pronunciation-mvp` for the public interface CC3 will consume.

## Why Web Speech API (for v1.0)

- **Free.** No per-minute spend, no keys, no provisioning. Ships today.
- **Browser-native.** Chrome, Edge, and Safari 14.5+ already have it; we don't add a native dependency to the Capacitor app.
- **Good enough to learn.** Intelligibility > perfection. The scorer combines recognition output with a Vietnamese-speaker phoneme map so we can give credit for L1-typical substitutions (v→b, th→t) without the full overhead of a professional scoring engine.

## Known limitations

| Limit | Impact | Mitigation |
|---|---|---|
| Firefox has no SpeechRecognition | Scoring unavailable on ~4% of users | `isSpeechRecognitionSupported()` returns `false`; UI should fall back to "listen only, no scoring". |
| iOS Safari can swallow the `end` event | Users stuck on a spinner | Hard `timeoutMs` (default 15 s) in `recognizeOnce()` — always settles. |
| Confidence values are often coarse (0 or ≈0.9 in Chrome) | Can't rely on provider confidence alone | Our scorer uses a word-level alignment + phoneme map instead of confidence. |
| No phoneme-level timings | No heat-map highlighting of specific sounds | `wordTimings` synthesised evenly across the utterance. Real phoneme timing needs the Azure/Speechace upgrade path. |
| ASR drops unstressed function words | False negatives ("I love pho" → "love pho") | Alignment penalises missed words proportionally; extras penalise lightly so filler doesn't tank the score. |

## Files

```
src/lib/pronunciation/
├─ recognizer.ts        thin wrapper around webkitSpeechRecognition / SpeechRecognition
├─ scorer.ts            pure function: (target, recognized) → score + wordScores + feedback
├─ vn-phoneme-map.ts    VN-speaker substitution data + getAcceptedVariants()
├─ README.md            this file
└─ __tests__/
   ├─ recognizer.test.ts    mocks SpeechRecognition; deterministic lifecycle tests
   └─ scorer.test.ts        pure unit tests; covers perfect / close / missed / extra / empty paths
```

## Public API

```ts
import { recognizeOnce, isSpeechRecognitionSupported } from '@/lib/pronunciation/recognizer';
import { scorePronunciation } from '@/lib/pronunciation/scorer';

// Inside a click handler (user gesture required by browser):
const result = await recognizeOnce({ lang: 'en-US', timeoutMs: 15000 });
//   → { transcript: 'i love this city', confidence: 0.87, wordTimings: [...], durationSec: 2.1 }

const score = scorePronunciation({
  target: 'I love this city',
  recognized: result.transcript,
});
//   → { overallScore: 100, wordScores: [...], feedback: { en: '...', vi: '...' } }
```

## Feature flag

This library is importable without gating so unit tests and offline work can exercise it freely. The UI entry point CC3 builds must gate on the DB flag:

```
flag_key = 'pronunciationScoringEnabled'   (seeded OFF by default)
```

Resolution order follows the shared `feature_flags` contract (see `src/lib/featureFlags.ts`): per-user cohort first, then global `is_enabled`, else OFF.

## Upgrade path

Scorer input is stable — `{ target, recognized, targetPhonemes? }` — and the optional `targetPhonemes` slot is already there for the day we pay for Azure Speech / Speechace:

1. Replace `recognizer.ts` with an API-bridge module that returns the same `RecognitionResult` shape plus phoneme timings.
2. Pass the Azure/Speechace per-phoneme accuracy scores into `scorePronunciation()` via `targetPhonemes`.
3. The scorer weights phoneme scores when present, falls back to the VN phoneme map when not.

No consumer (CC3's UI, future analytics, SRS integration) has to change.

## Performance

Scorer: pure string + DP math. ~1 ms for typical 10-word sentences. Tests include a perf budget so regressions fail CI.

Recognizer: I/O bound (microphone + speech engine). Typical end-to-end 1–3 s for a 5-word utterance.
