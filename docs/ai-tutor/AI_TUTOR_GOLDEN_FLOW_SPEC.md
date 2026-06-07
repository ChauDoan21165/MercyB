# AI Tutor — Golden-Flow Quality Gate Spec

> **Document type:** Quality-gate spec (canonical source of truth)
> **Date:** 2026-06-07
> **Status:** Adopted. This is the enforcement contract for AI Tutor learner-visible behavior.
> **Read with:** `docs/ai-tutor/TUTOR_CONTRACT.md` §14 (Teaching Quality Gates), `src/hooks/usePronunciationRecorder.ts`, `src/components/pronunciation/SelfCompareRecorder.tsx`.

## 1. Why this exists

"Green pipeline" and self-report checklists decay into rubber stamps — the Speak
incident (a fake percent / ML-looking score shown with no valid gated scorer)
proved it. This spec turns the merge rule into **executable, pipeline-blocking
tests wherever possible**. A manual checklist covers **only** what genuinely
cannot be automated.

Rule of thumb: **if a regression is learner-visible and assertable in jsdom or
e2e, it MUST be a CI-blocking test — not a checklist line.**

## 2. Golden flows (must always work)

A golden flow is an end-to-end learner journey the AI Tutor guarantees. Each is
owned (§3) and gated (§5).

| ID | Flow | Owner |
|----|------|-------|
| GF-1 | **Speak self-compare:** hear the model/Tutor sentence → record own voice → replay own recording → compare by ear → reset/re-record | C |
| GF-2 | **Pronunciation drills** (`/practice/pronunciation`): tone clips play; VN→EN drills render; SelfCompareRecorder present | C |
| GF-3 | **Single-word mistake playback:** tap a scorer-surfaced word → hear it; graceful message on TTS failure | C |
| GF-4 | **Scoring honesty:** a numeric score/percent or per-phoneme/ML claim appears **only** for a valid gated scorer result; otherwise an honest "unavailable / listening" message | C |
| GF-5 | **Grammar correction** flow renders and corrects | A |
| GF-6 | **Speak follow-up** question flow advances correctly | A |
| GF-7 | **Logic stale-state / unclear-transcript clarification:** stale or unclear input asks for clarification instead of scoring it | A |

## 3. Ownership boundaries

| Owner | Domain |
|-------|--------|
| **C** | Audio / recorder / pronunciation / **scoring honesty**. Model-sentence playback, MediaRecorder capture + replay, `SelfCompareRecorder`, tone/word playback, the "no fake score / gated percent / honest unavailable" rules. |
| **A** | Grammar correction, Speak follow-up, Logic stale-state, unclear-transcript clarification. Conversation/teaching logic. |
| **B** | Wires the full golden-flow suite into CI — one required job that runs every owner's golden-flow tests and **blocks merge** on failure. Owns the harness, not the assertions. |

Boundary rule: an owner adds/maintains the executable tests for their flows;
B guarantees they run and block. No owner may weaken or skip another owner's
gate to land a change.

## 4. Executable test vs manual checklist

**Default to executable.** A check may stay on the manual checklist **only** if
it cannot be asserted in jsdom or e2e.

### 4.1 MUST be executable (CI-blocking)
- Presence + operability of controls (model-play, record, replay, reset).
- `SelfCompareRecorder` mounted on every Speak/pronunciation surface that claims it.
- DOM-level scoring honesty: no `\d+\s*%` and no score/ML wording unless a valid gated scorer result is present.
- Failure-path messaging: mic-denied, recording-unsupported, TTS-failure, scorer-unavailable each render a clear message and never a dead/hung button.
- The recorder is **additive** — the Speak conversation flow still renders alongside it.

### 4.2 MAY remain manual checklist (genuinely un-automatable)
- Real audio is **audible** and intelligible on a physical device.
- Real **mic capture** works on physical iOS (WKWebView) / Android.
- Subjective **TTS naturalness** of the Tutor voice.
- Real **Azure scorer accuracy** on real human speech (correctness of the number, not its honest gating).

Anything not on 4.2 is presumed automatable and belongs in 4.1.

## 5. Blocked learner-visible regressions

These MUST fail CI. Each maps to an executable owner test (B wires them into the
blocking job).

| # | Blocked regression | Owner | Enforcement (executable) |
|---|--------------------|-------|--------------------------|
| R1 | **Fake score / percent** shown with no valid gated scorer | C | Assert no `\d+\s*%` / score wording unless a gated scorer result is present |
| R2 | **ML / per-phoneme judgment** without a real gated scorer | C | Assert phoneme/ML wording renders **only** when `mode === "azure-batch"` && `provider === "azure"` |
| R3 | **Dead record / play buttons** (render but do nothing) | C | Assert controls are present, enabled, and wired to their handlers |
| R4 | **Missing recorder** | C | Assert `SelfCompareRecorder` (`data-testid="self-compare-recorder"`) is present on each surface that claims it |
| R5 | **Audio/scoring unavailable without a clear message** | C | Assert mic-denied / unsupported / TTS-fail / scorer-unavailable each render a user-visible message |
| R6 | **Recorder replacing the Speak conversation flow** | A + C | Assert the conversation/practice surface still renders alongside the recorder (recorder is additive, not a replacement) |

Honest-gating reference (R1/R2): a numeric percent is shown **only** for an
audio-gated Azure batch result; the local/text path shows an honest "listening /
detail coming" line and never a number. See `SpeakPracticeMode` score gating and
its tests.

## 6. Merge rule

A change touching any AI Tutor golden flow merges **only if**:
1. The CI golden-flow job (B-owned) is green — it runs every owner's §4.1 tests.
2. No §5 regression is introduced (enforced by those tests, not by self-report).
3. The §4.2 manual checklist is completed **only** for items that cannot be automated, and only when the change plausibly affects them (e.g. a real-device audio change).

If a needed check is missing from CI, the fix is to **add the test**, not to
wave the change through on a checklist.

## 7. Non-goals

- This spec does not change the research-gated scorer, thresholds, or scoring
  math — it gates **honesty of presentation**, not scoring accuracy.
- It adds no score, percent, or ML claim of its own.
- It is presentation/behavior enforcement only — no Supabase/RLS/Netlify/deploy
  config is in scope.
