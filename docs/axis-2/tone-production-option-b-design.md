# §15 Axis 2 Bar #2 — Tone production coaching, Option B (local pitch) — design doc

> **Owner:** C6
> **PR 1 of Option B:** this design doc only.
> **PR 2 (follow-up, conditional):** 1-day pitch-library spike on the
> existing fixture mp3s. Implementation PR(s) gated on spike result.
> **Last updated:** 2026-05-25
> **Anchor:** `origin/main` `42a58d289` (post-#1205).
> **Supersedes Option A from:** `docs/axis-2/tone-production-design.md` §5.
> **Authoritative escalation per:** PR #1204 question 2 ("if Azure
> cannot empirically distinguish má/mã, design pivots to Option B").

This is the second design pass for §15 Axis 2 Bar #2 after Option A
(Azure Pronunciation Assessment with `vi-VN` locale) was empirically
disproven on `origin/main`. No implementation is shipped in this PR.

---

## 1. Why Option A is dead — empirical evidence

The §15 Axis 2 Bar #2 design (`docs/axis-2/tone-production-design.md`)
committed to a spec test: *"verify scoring distinguishes adjacent
tones (e.g. má vs mã)."* PR #1206 shipped the Option A adapter +
verify pipeline; owner ran the empirical verification three times,
each time correcting an upstream defect surfaced by the prior run.
Final two runs, with the wire bugs (WAV header, UTF-8 base64
encoding) fixed and both Northern voices tested:

### Run 2 — `vi-VN-HoaiMyNeural` (female, the design's default)

|   | Target `má` | Target `mã` |
|---|---|---|
| **`má.mp3`** | **77** (matched, pass) | **0** (mismatched, clean reject) |
| **`mã.mp3`** | **1** (mismatched) | **1** (matched, near-zero) |

Clean tone discrimination on `má.mp3` (clear separation 77 → 0).
`mã.mp3` is not scorable in either condition (1/100 both ways).

### Run 3 — `vi-VN-NamMinhNeural` (male, the only other Northern voice)

|   | Target `má` | Target `mã` |
|---|---|---|
| **`má.mp3`** | **41** (matched, sub-pass) | **24** (mismatched, lower — correct ordering) |
| **`mã.mp3`** | **40** (mismatched) | **11** (matched, lower than mismatched — **inverted**) |

Voice change degrades the `má` discrimination (41 vs 24 is barely
above noise). On `mã.mp3` the ordering is **inverted** — Azure
scores the wrong target higher than the right target. Both Northern
voices Azure publishes have been tested; **the voice space is
exhausted**.

### Root cause

Microsoft's published documentation, exact quote from *"How to use
pronunciation assessment in the Microsoft Foundry portal"*:

> *Content and prosody assessments are only available in the
> [en-US] locale.*

Vietnamese tone is acoustically a prosodic feature — pitch contour
plus voice quality / glottalization for `ngã` and `nặng`. Azure's
`vi-VN` Pronunciation Assessment scores **segmental accuracy**
(does the audio match the expected phonemes?) but **does not score
prosody** at the locale level. The segmental layer happens to work
for tones close to a flat / rising prosodic baseline (`ngang`,
`sắc`) because the vowel + consonant timing still matches the
reference; it does not converge for marked tones whose acoustic
signature is *entirely* prosodic (`ngã`'s glottal break, `hỏi`'s
dip, `nặng`'s creaky-low-stopped quality).

Microsoft also does not list `vi-VN` in the public
*language-support* page's pronunciation-assessment tab. The locale
is wired in some form (it returns scores) but Microsoft has not
published a feature matrix saying vi-VN PA scores tones at the
syllable level with any documented reliability.

The two voice runs disprove "TTS voice quality" as the variable.
The prosody-en-US-only documentation gives the authoritative
mechanism. Bar #2's "≥12 minimal-tone pairs … verifying the
scoring distinguishes adjacent tones" cannot be met by Option A.

## 2. Goal and posture (carry-over from Option A design)

Bar #2 wording unchanged from `STRATEGY.md` §15 lines 626-633:

> The EN→VN track ships a coaching surface for the six Northern (or
> five Southern) Vietnamese tones — at minimum, a drill that asks the
> learner to produce a tone on a target syllable and returns at-
> least-pass/fail feedback. *Artifact:* shipped feature with a drill
> set of ≥12 minimal-tone pairs (e.g. the canonical `ma / má / mà /
> mả / mã / mạ` set, plus 6+ more contrasts) and a test verifying
> the scoring distinguishes adjacent tones.

Six Northern tones, ≥12 pairs, distinguishes adjacent. Same bar.

Posture is **stronger** than Option A under Stage-3 local-only
boundary (`ROADMAP.md` lines 107-111):

- **No server-side scoring call.** Pitch extraction runs entirely
  client-side via Web Audio API.
- **No Azure cost.** No daily cap, no per-call quota, no budget
  protection layer needed.
- **No PII or audio off-device.** Learner audio never leaves the
  browser process; `Blob` is decoded into an `AudioBuffer`, analysed,
  discarded.
- **No `speech_attempts` writeback** (same as Option A's
  `context=tone-drill` opt-out, but here it falls out for free —
  there is no server endpoint to log to).

## 3. Six Northern tones — characteristic contours

Pitch-contour signatures the classifier matches against. These are
not invented — they are the standard phonetics-textbook descriptions
of Hanoi Vietnamese, cross-referenced against
`src/languages/vietnamese/lessons-a1.ts:1755-1776` (lesson 37). All
six syllables have been TTS-generated and committed in
`public/audio/tones/` under PR #1206; the audio fixtures themselves
survive as classifier ground truth.

| Tone | Vietnamese | Symbol | Contour signature | Voice quality cue |
|------|------------|--------|-------------------|-------------------|
| `ngang` | level | (unmarked) `ma` | F0 flat ±5% over mid range | modal |
| `sắc` | rising | `má` | F0 rises monotonically, ≥30% of speaker range | modal |
| `huyền` | falling | `mà` | F0 falls monotonically, low end of range | modal |
| `hỏi` | dipping-rising | `mả` | F0 dips then rises (V-shape) | modal, slight breathy at trough |
| `ngã` | broken-rising | `mã` | F0 rises with a glottal interruption (creaky middle) | **glottalization required** |
| `nặng` | low-stopped | `mạ` | F0 starts low, short duration, abrupt stop | **creaky, low-amplitude, short** |

**Pitch contour alone is insufficient for `ngã` and `nặng`.** Their
discriminating features include glottal pulse irregularity (`ngã`)
and amplitude drop / shortened duration (`nặng`). A pitch-only
classifier will conflate `ngã` with `sắc` (both rising) and `nặng`
with `huyền` (both falling). §6 addresses this honestly.

## 4. Technical approach — Web Audio pitch extraction

### Pipeline

```
                  ┌──────────────────────────────────────────────┐
   recorder Blob  │  AudioContext.decodeAudioData                │
                  │    → AudioBuffer (1ch, native sample rate)   │
                  └──────────────────┬───────────────────────────┘
                                     │
                  ┌──────────────────▼───────────────────────────┐
   resample       │  OfflineAudioContext at 16 kHz, mono         │
                  │    (mirrors `src/lib/audio/wavEncoder.ts`    │
                  │     pattern at lines 14-25)                  │
                  └──────────────────┬───────────────────────────┘
                                     │
                  ┌──────────────────▼───────────────────────────┐
   frame          │  20 ms frames, 50% overlap                   │
                  │  (320 samples × hop 160 @ 16 kHz)            │
                  └──────────────────┬───────────────────────────┘
                                     │
                  ┌──────────────────▼───────────────────────────┐
   pitch          │  Per-frame F0 via YIN (pitchy library)       │
                  │  + voicing decision (energy + autocorr peak  │
                  │    confidence)                               │
                  └──────────────────┬───────────────────────────┘
                                     │
                  ┌──────────────────▼───────────────────────────┐
   contour        │  F0 sequence → log-pitch, normalize against  │
                  │  speaker baseline (recent learner average)   │
                  └──────────────────┬───────────────────────────┘
                                     │
                  ┌──────────────────▼───────────────────────────┐
   classify      │  Match contour against 6 templates            │
                  │  + glottalization check for `ngã`/`nặng`     │
                  │  (spectral irregularity in 100-300 Hz band)  │
                  └──────────────────┬───────────────────────────┘
                                     │
                  ┌──────────────────▼───────────────────────────┐
   bucket        │  pass / low-confidence-pass / retry           │
                  │  (same three-bucket model as #1206)          │
                  └──────────────────────────────────────────────┘
```

### Pitch-detection algorithm — recommend YIN

Three candidates evaluated:

1. **YIN** (de Cheveigné & Kawahara 2002) — autocorrelation with
   cumulative mean normalised difference. Robust on short windows,
   handles octave errors well, no fundamental-frequency tracking
   needed (single F0 per frame). ~50-200 LOC if hand-written; or
   use `pitchy` (≤ 5 KB minified, 0 deps, MIT, ships as ES module).
2. **AMDF** (Average Magnitude Difference Function) — simpler than
   YIN, faster, but more octave errors on creaky voice (ngã/nặng
   territory — exactly where we need robustness). Reject.
3. **AnalyserNode FFT** — `getFloatFrequencyData()` gives a
   spectrogram, peak detection gives F0. Works but FFT bin
   resolution at 16 kHz / 2048 samples is ~7.8 Hz — too coarse for
   pitch contour shape discrimination across the typical Vietnamese
   range (~80-400 Hz). Reject as primary; may use as voicing /
   amplitude side-signal.

**Recommendation: YIN via the `pitchy` library.**

- Library: https://github.com/ianprime0509/pitchy
- API surface: `pitchy.PitchDetector.forFloat32Array(bufferSize)`
  returns a detector instance; `.findPitch(samples, sampleRate)`
  returns `[frequency, clarity]` per frame.
- Bundle weight: ~5 KB minified, single ES module, MIT, no
  transitive deps. Acceptable Axis-2 (~5% effort) tax.
- Alternative considered: hand-roll YIN in `src/lib/pronunciation/
  pitch/` for zero-dep posture. Tradeoff: ~200 LOC of audio DSP we
  would own and have to maintain. Recommend `pitchy` unless the
  spike phase (§5) shows it underperforming.
- `Aubio.js` (the dispatch's other named candidate) is the JS
  binding for the Aubio C library, ~800 KB compiled to WASM —
  rejected as too heavy for a ~5% Axis-2 surface.

### Tone classification — template matching

After pitch extraction, the frame-by-frame `[F0, clarity]` array is:

1. Voiced-frame filtered (clarity ≥ 0.85, energy ≥ ε).
2. Log-transformed (`semitones = 12 × log2(F0 / 100)`).
3. Time-normalised to 20 sample points (linear interpolation).
4. Range-normalised against the learner's recent baseline (running
   median across the last ~10 attempts, stored in localStorage
   with the same 20-attempt soft-cap counter from #1204 question 5).
5. Compared against six template contours via mean squared error;
   lowest-MSE template wins.

For `ngã` and `nặng` (glottalisation-dependent), a second-stage
check on the same audio:

- **`ngã` detector** — spectral irregularity around the contour's
  middle third. Compute the variance of frame-to-frame F0 jumps;
  `ngã` has spikes / dropouts at the glottal interruption that
  pure-pitch `sắc` does not.
- **`nặng` detector** — duration + amplitude. `nặng` syllables are
  ≤ 200 ms with abrupt amplitude drop; `huyền` (the most likely
  confusable) is longer and smoother.

These second-stage checks gate against the pitch classifier's
top-1: if pitch says `sắc` but `ngã` detector fires, escalate to
`low-confidence-pass` rather than confident `sắc`. Honest-
uncertainty over false confidence.

## 5. Spike before PR-b

Pitch detection on ≤500 ms syllables is research territory. The
six Vietnamese tones include two (`ngã`, `nặng`) whose acoustic
signatures partially overrun what F0 alone can express. The
design's honest answer: **a 1-day spike before committing PR-b
scope is the right move**.

### Spike scope

A single throwaway script at `scripts/spike-pitch-tone-classify.ts`
(operator-run, not committed to main):

1. Loads the 18 reference mp3s already committed in
   `public/audio/tones/`.
2. Resamples to 16 kHz mono via `OfflineAudioContext`.
3. Runs `pitchy` over 20 ms frames, prints the per-frame
   `[F0, clarity]` array.
4. Hand-classifies each syllable's contour shape; verifies it
   matches the §3 template the syllable name implies.
5. Computes pairwise contour distance (Euclidean over time-
   normalised log-F0) for all 18 × 17 / 2 = 153 pairs. Asserts
   minimal-tone contrasts have higher pairwise distance than
   non-contrasts (e.g. `má/mã` distance > `má/lá` distance).

### Spike pass conditions

- All 6 canonical-ma contours plot recognisable shapes matching §3
  templates (visual inspection — operator reads the printed series).
- `pitchy` reports clarity ≥ 0.85 on ≥ 80% of voiced frames across
  all 18 syllables.
- Six within-pair distances (one per `MinimalTonePair`'s contrast)
  are above the median cross-pair distance.

### Spike fail conditions

- Glottalisation breaks `pitchy` on `ngã` / `nặng` (clarity collapses,
  pitch becomes unstable, contour shape unrecognisable). If this
  happens for **both** marked tones, escalate to design pass 3
  (Option C — passive listen-and-tap as Bar #2 fallback) AND
  re-litigate Bar #2 with owner: does "produce a tone" tolerate
  *learner identifies tone* rather than *learner voices tone*?
  This is a strategy-doc question, not an engineering question.

If spike passes → ship PR-b implementing the §4 pipeline against
the §6 spec test. If spike fails for one marked tone but not both
→ ship the 4 clean tones first, mark the failing one as
"coming soon" in the UI (per open question 3 below).

## 6. Spec test (Bar #2 closure gate)

Same gate as Option A — *"a test verifying the scoring distinguishes
adjacent tones."* Different backend.

### Test fixture

`src/lib/pronunciation/__tests__/toneScoringLocal.test.ts` (new file
in PR-b; partially derivable from `toneScoring.test.ts` shipped in
#1206 — the drill-set invariant tests and bucket-mapping tests
carry over verbatim).

### The two-pair assertion (carries over from Option A design §6)

For each of `(má, sắc)` and `(mã, ngã)`:

1. Load the prerecorded `${syllable}.mp3` from `public/audio/tones/`.
2. Call `scoreTone({ audioBlob, targetSyllable: matched, ... })` —
   assert `bucket` ∈ `{pass, low-confidence-pass}`.
3. Call `scoreTone({ audioBlob, targetSyllable: opposite, ... })` —
   assert `bucket = retry`.

Four assertions over four scoring calls. Unlike Option A's spec
test (which mocked Azure responses), Option B's spec test exercises
the **real pitch classifier** against **real audio fixtures**
committed to the repo. No live network. CI-safe.

### Asymmetric outcome handling

Per PR #1206's verify-script exit-code work, the spec test must
distinguish:

- All four assertions pass → Bar #2 closeable.
- Symmetric failure (matched can't be distinguished from mismatched
  on any pair) → Option B itself fails; escalate to Option C
  re-litigation.
- Asymmetric failure (one tone scores cleanly, the other doesn't) →
  ship the working subset, mark the failing tone in-progress, do
  not block Bar #2 closure on the full six. Surface as open question
  3 below.

## 7. What survives from #1206

The Option A PR shipped a substantial amount of code that **carries
over unchanged or with minimal adaptation**:

| Component | Status |
|-----------|--------|
| `src/data/tone-drill/minimal-pairs.ts` — 12 pairs | **Unchanged.** The drill set was never Azure-specific; it's the curriculum anchor. |
| `public/audio/tones/*.mp3` — 18 TTS reference clips | **Unchanged.** Still serve as the listening targets the drill UI plays back. Also serve as Option B's spec-test ground-truth fixtures (the classifier must distinguish them). |
| `src/lib/pronunciation/scoreTone.ts` — adapter contract | **Adapter interface unchanged; implementation swapped.** Inputs (`audioBlob`, `targetSyllable`, `userJwt`) and outputs (`{bucket, score, reason}`) stay the same. Internals replace the Azure HTTP call with the §4 client-side pipeline. The `userJwt` parameter becomes optional (see open question 1). |
| `scripts/generate-tone-references.ts` — TTS gen script | **Unchanged.** Reference audio is still TTS-generated; the issue was using it as Azure PA reference (a target-text encoding contract), not its role as the drill's listening clip. |
| 24 unit tests in `toneScoring.test.ts` | **Drill-set invariant + bucket-mapping tests carry over.** Auth-gate tests and the Azure request-shape tests retire with Option A. |
| Three-bucket score mapping (`pass`/`low-confidence-pass`/`retry`) | **Unchanged.** The semantics carry; the numeric source changes from Azure's `AccuracyScore` to a local classifier confidence. Thresholds may need retuning post-spike. |
| 12-pair fixture's `SPEC_TEST_PAIR_ID = "ma-sac-vs-nga"` | **Unchanged.** Same hardest-adjacent-tone gate. |

## 8. What gets replaced

| Component | Status |
|-----------|--------|
| `supabase/functions/azure-phoneme/core.ts` `target_locale=vi-VN` branch | **Becomes unused for tone drill** (the English Axis-1 path still uses the file). The opt-in additive branch from #1206 is harmless dead code on the tone path; do not remove (other Axis-2 pairs may revisit Azure later). |
| `supabase/functions/azure-phoneme/core.ts` `context=tone-drill` log-skip | **Becomes unused.** Same rationale — additive, harmless, leave. |
| `scripts/verify-tone-spec-empirical.ts` | **Retired.** Option B has no Azure round-trip to verify; the spec test in PR-b (§6) IS the empirical verification, and it runs in CI against committed fixtures. Delete after Option B ships. |
| Auth gate on `scoreTone` | **Reopens.** See open question 1. |

## 9. Auth gate decision — reopens

PR #1206's auth gate was driven by Azure cost protection: every
scoring call burns Azure budget, anonymous spammers could drain it.
Option B has **no per-call cost** — pitch extraction is browser CPU
on the learner's device.

Two options:

- **Keep auth gate.** Privacy / commitment-signal framing — "to
  score your voice you need an account." Lower funnel conversion
  but cleaner signal-to-noise on the eventual outcome metric.
- **Drop auth gate, anon-friendly.** Lower funnel friction; the
  drill becomes a try-before-you-sign-up surface. Aligns with the
  bilingual landing page positioning (`feedback_marketing_landing_decisions`
  in memory: "bilingual landing page sanctioned").

Owner picks. The right answer probably depends on whether the tone
drill is the first thing a prospective EN→VN learner sees (anon),
or a feature reached after sign-up funnel (auth-gated). The route
`/learn/vietnamese/tones` from #1204 question 4 leans anon-friendly
(public route shape), but that's not binding.

## 10. Risk and honest-uncertainty (PRINCIPLES #7)

Three risks named explicitly:

### Risk 1 — Glottalization on `ngã` may not score cleanly

Pitch contour alone cannot distinguish `ngã` from `sắc` (both
rising). §4's second-stage spectral-irregularity check is the
intended remediation, but its reliability on browser-quality
captured audio (mp3 → WebM Opus → decode) is unknown. The spike
phase (§5) explicitly tests this; if it fails, the §6 spec test
also fails, and we escalate to Option C re-litigation rather than
ship a broken `ngã` scorer.

### Risk 2 — Pitch extraction reliability varies by device

Mobile browsers' Web Audio implementations vary in
`AudioContext.decodeAudioData` accuracy at non-44.1 kHz sample
rates. `src/lib/audio/wavEncoder.ts:14-25` already documents iOS
Safari quirks ("silently returns 0-length buffer" on
`OfflineAudioContext` at 16 kHz). The same JS-resample fallback
that wavEncoder ships against this on iOS will be needed for the
tone classifier path. Not novel work; same pattern.

### Risk 3 — Speaker pitch range varies

Six tones in absolute Hz mean different ranges for a child / female
adult / male adult. The §4 pipeline's range-normalisation step
(against the learner's running median F0) addresses this, but it
needs a few attempts before the median stabilises. First-attempt
classification will be lower confidence; surface honestly with the
existing `low-confidence-pass` chip from #1204. Tests cover that
path.

### What this design does NOT promise

- Native-accent-level classification accuracy. The Bar #2 floor is
  "distinguish adjacent tones at pass/fail" — not "rate the
  learner's accent on a 100-point scale." Setting the threshold
  any higher than that turns Bar #2 into a research project.
- Cross-dialect support. Six Northern tones only (carry-over from
  Option A §2). Southern five-tone handling stays in the design's
  open-question 3 below.

## 11. Implementation size estimate

Rough order-of-magnitude for PR-b (subject to spike outcome):

| Component | Est. LOC | New file? |
|-----------|----------|-----------|
| `src/lib/pronunciation/pitch/yinDetect.ts` (or `pitchy` wrapper) | ~80 | yes |
| `src/lib/pronunciation/pitch/tonalClassifier.ts` (template match + glottal check) | ~200 | yes |
| `src/lib/pronunciation/pitch/__tests__/yinDetect.test.ts` | ~60 | yes |
| `src/lib/pronunciation/pitch/__tests__/tonalClassifier.test.ts` | ~80 | yes |
| `src/lib/pronunciation/scoreTone.ts` (rewrite, smaller — no HTTP) | ~80 | edit |
| `src/lib/pronunciation/__tests__/toneScoringLocal.test.ts` (spec test against committed fixtures) | ~120 | yes |
| `package.json` — add `pitchy` dep | +1 line | edit |
| **Total** | **~600 LOC** | 5 new files |

Spike (§5): one throwaway script, ~150 LOC, run once, output
committed to the PR-b description as evidence. Not counted in the
PR-b LOC.

## 12. Open questions for owner

Four questions, each requires an explicit decision before PR-b
opens:

1. **Auth gate — keep or drop?** (§9). Option A's auth gate was
   Azure cost protection. Option B has no per-call cost. Owner
   decides whether the drill is anon-friendly (try-before-sign-up)
   or auth-gated (commitment signal).

2. **Pitch library — `pitchy` vs hand-rolled YIN?** (§4 algorithm).
   Recommend `pitchy` (5 KB, MIT, single ES module) for the spike;
   if owner prefers zero-dep posture, ~200 LOC of YIN we maintain.
   Aubio.js is rejected as too heavy.

3. **Glottalization handling — ship partial or block on full
   six?** Per Risk 1 and §6's asymmetric outcome handling: if the
   spike shows `pitchy` works cleanly for 4 of 6 tones (the
   non-glottalised) and degrades on `ngã` / `nặng`, do we ship the
   working 4 with the other 2 marked "coming soon," or do we hold
   Bar #2 closure until all 6 score cleanly? The Bar #2 wording
   *"six Northern tones"* leans toward "all 6," but partial
   shipping followed by visible work on the remaining 2 is
   defensible.

4. **Spike-before-PR-b — ratify or skip?** §5 proposes a 1-day
   throwaway spike running `pitchy` against the 18 committed
   fixture mp3s. The spike output (printed F0 contours, pairwise
   distance matrix) decides whether to commit PR-b implementation.
   Without the spike, PR-b ships on a "this should work" basis;
   with the spike, we know. Recommend ratifying the spike — it's a
   day, and the alternative is a PR-b that may need to be
   reverted.

## 13. Out of scope for this PR (design doc 1 of n)

- Implementation. Design doc only.
- Asymmetric-exit-code (`4`) fix for the now-retired
  `scripts/verify-tone-spec-empirical.ts`. That fix was still
  worth landing for any future axis that might reach for Azure PA
  again; tracked separately, not blocking.
- Changing `scripts/generate-tone-references.ts` default voice.
  Both voices have been tested and exhausted; the question is moot.
- Re-litigating Option C (passive listen-and-tap). Only revisited
  if the spike (§5) or the spec test (§6) shows Option B also
  cannot distinguish `ngã` / `nặng`. Until then, Option C stays
  parked behind Option B.

## 14. Verification checklist (for PR-b — implementation)

- [ ] `pitchy` (or hand-rolled YIN) added to deps with bundle-
      size attribution noted in `package.json` comment.
- [ ] `scoreTone.ts` implementation swapped from Azure HTTP to
      local pipeline; adapter contract (inputs/outputs) unchanged.
- [ ] Auth-gate decision from open question 1 implemented per
      owner choice.
- [ ] Bucket thresholds (`pass` ≥X, `low-confidence-pass` ≥Y) tuned
      against spike output; thresholds documented in the file.
- [ ] `src/lib/pronunciation/pitch/tonalClassifier.ts` produces
      a deterministic classification given a fixed audio input
      (necessary for the spec test to be CI-stable).
- [ ] Spec test in `toneScoringLocal.test.ts` runs against the
      committed `public/audio/tones/*.mp3` fixtures, distinguishes
      `má` from `mã` on the matched/mismatched cross-product (the
      four assertions from §6).
- [ ] `localStorage` schema for the 20-attempt session cap +
      per-learner baseline F0 median documented (key naming
      consistent with other MercyBlade local-only stores).
- [ ] No `supabase.functions.invoke` calls in the new code path
      (verifies the local-only posture from §2).
- [ ] No external analytics on attempts.
- [ ] `FeedbackBar` renders on `/learn/vietnamese/tones` (global
      mount; auto via `src/router/AppRouter.tsx:1756`).
- [ ] Honest-uncertainty chip ("Mercy chưa chắc lắm — giọng miền
      Nam có thể nghe khác") appears on `low-confidence-pass` rows
      AND on first-3-attempts (range-normalisation warm-up window).
- [ ] All copy is Vietnamese, except syllable targets.

---

## Summary for reviewer

This is the authoritative Option B escalation per PR #1204 question
2. The escalation is driven by empirical evidence (two voice runs
exhausting Azure's vi-VN voice space, both showing tone-
discrimination failure on marked tones) plus Microsoft's own
documentation (prosody scoring is en-US-only). Option A is dead;
this design proposes a local pitch-contour classifier with a 1-day
spike phase ahead of PR-b commitment. Most of #1206's shipped code
survives unchanged — fixture, reference audio, adapter contract,
test scaffolding. The Azure path retires for Bar #2 specifically;
the additive opt-in branches in `azure-phoneme/core.ts` (target_locale
+ context) stay in the codebase as harmless dead code for future
non-tonal Axis-2 pairs that may legitimately revisit Azure PA.

Four open questions for owner — auth gate, pitch library, partial-
six shipping policy, spike-before-PR-b ratification.
