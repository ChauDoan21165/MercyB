# §15 Axis 2 Bar #2 — Tone production coaching — design doc

> **Owner:** C6
> **PR 1 of Bar #2:** this design doc only.
> **PR 2 (follow-up):** implementation (drill component + scoring adapter + tests).
> **Last updated:** 2026-05-25
> **Anchor:** `origin/main` `c12f96996` (post-#1199 Stage 3A design).

This document is the design artifact for the first PR of §15 Axis 2
Bar #2 — *tone production coaching for English speakers learning
Vietnamese*. **No implementation is shipped in this PR.** The
implementation lands in a follow-up PR after owner review.

---

## 1. Goal and posture

Per `CURRENT-STATE.md` §15 Axis 2 Bar #2:

> The EN→VN track ships a coaching surface for the six Northern (or
> five Southern) Vietnamese tones — at minimum, a drill that asks the
> learner to produce a tone on a target syllable and returns at-
> least-pass/fail feedback. *Artifact:* shipped feature with a drill
> set of ≥12 minimal-tone pairs (e.g. the canonical `ma / má / mà /
> mả / mã / mạ` set, plus 6+ more contrasts) and a test verifying
> the scoring distinguishes adjacent tones.

This is the second §15 Axis 2 bar (Bar #1 = EN→VN L1 profile in
flight via #1184; Bar #3 = classifier explainer in flight via
#1176). The audience is the **English-native side**, ~5% of
authoring effort per `STRATEGY.md:104`, but the bar is binding: §15
gates second-pair work, and Axis 2 has zero ticks today (`STRATEGY.md:732`).

Same local-only posture as Stage 3 brick design (`layer-model.md`
*Local-Only Posture*):

- No Supabase write of recordings, transcripts, or scores.
- No external analytics on attempts.
- No raw audio retention beyond the in-memory `Blob` lifecycle of
  one attempt.
- Score is a boolean per attempt; any aggregate stays local
  (`localStorage` only, behind a tiny key, no PII).

Honest-uncertainty per `PRINCIPLES.md` §7 — tone scoring is a hard
acoustic problem and our first pass is pass/fail. The UI must mark
borderline calls as low-confidence rather than ship false-positive
"correct" feedback. `Báo lỗi` is mandatory on every drill row per
`PRINCIPLES.md` §8 (FeedbackBar is mounted globally at
`src/router/AppRouter.tsx:1756`, no per-route wiring needed).

---

## 2. Dialect bias — Northern six vs Southern five

**Recommendation: six Northern tones.**

### Rationale

- The Vietnamese-for-foreigners track already teaches six tones with
  Northern voicing. Lesson 36 *"Pronunciation: Vietnamese Tones
  Overview"* at `src/languages/vietnamese/lessons-a1.ts:1715-1745`
  introduces flat (`ma`) and rising (`má`); lesson 37 *"The Six
  Tones Of Ma"* at `src/languages/vietnamese/lessons-a1.ts:1746-1777`
  walks the canonical six-tone set with pronunciation glosses for
  each. The drill set in §3 anchors directly to this lesson.
- Lesson 46 *"Northern And Southern Note"* at
  `src/languages/vietnamese/lessons-a1.ts:2037-2065` is the existing
  dialect-awareness surface. It explicitly tells learners that
  regional variation is normal and to "copy the people around you."
  A six-tone production drill stays consistent with this prior
  framing — we teach six because the curriculum already does;
  Southern five-tone learners are not penalised because the drill is
  *production toward a Northern target*, not classification.
- The 536-lesson Vietnamese-for-foreigners track
  (`VIETNAMESE_TOTAL_LESSONS`, per `STRATEGY.md:213`) was authored
  with Northern voicing as the canonical reference; using the same
  voicing here removes one source of learner confusion.
- Southern dialect collapses `hỏi` (`mả`) and `ngã` (`mã`) into one
  pitch contour. A drill that asks Southern learners to *produce*
  five tones would be a different feature with a different scoring
  contract (`mả` and `mã` would have to be merged in scoring). Bar
  #2's "≥12 minimal-tone pairs" is much easier to hit with six
  distinct targets.

### Where Southern voicing is honoured

- The drill UI carries a single-line disclosure: "Người miền Nam
  thường gộp **hỏi** và **ngã**. Bạn vẫn được điểm nếu phát âm theo
  giọng quê." This mirrors lesson 46's "regional variation is
  normal" stance.
- Scoring tolerance (§5) treats `mả`/`mã` as adjacent — a learner
  who produces `mã` when targeted at `mả` gets *low-confidence
  pass*, not fail. This is the honest-uncertainty hook.

---

## 3. Drill set — 12+ minimal-tone pairs

All pairs are syllables, not invented vocabulary. Drawn from
existing curriculum content (`src/languages/vietnamese/lessons-a1.ts`
lesson 37 plus standard textbook minimal-pair sets). No new
vocabulary is authored in this PR; PR 2 reuses these strings.

### Canonical six-tone set (Bar #2's named anchor)

| # | Syllable | Tone (vi) | Tone (en) | Source |
|---|----------|-----------|-----------|--------|
| 1 | `ma` | ngang | level | `lessons-a1.ts:1755` |
| 2 | `má` | sắc | rising | `lessons-a1.ts:1755` |
| 3 | `mà` | huyền | falling | `lessons-a1.ts:1755` |
| 4 | `mả` | hỏi | dipping-rising | `lessons-a1.ts:1755` |
| 5 | `mã` | ngã | broken-rising | `lessons-a1.ts:1755` |
| 6 | `mạ` | nặng | low-stopped | `lessons-a1.ts:1755`, 1761 |

### Six additional minimal-tone contrasts (12+ total)

| # | Pair | Glosses | Tone contrast | Lesson anchor |
|---|------|---------|----------------|----------------|
| 7 | `la` / `lá` | "to scold" / "leaf" | ngang vs sắc | A1 vocabulary |
| 8 | `ba` / `bà` | "three / father" / "grandmother" | ngang vs huyền | `lessons-a1.ts` greetings cluster |
| 9 | `cá` / `cà` | "fish" / "tomato/eggplant" | sắc vs huyền | A1 food vocabulary |
| 10 | `có` / `cọ` | "to have" / "to rub" | sắc vs nặng | A1 high-frequency vocab |
| 11 | `tôi` / `tối` | "I" / "evening / dark" | ngang vs sắc | A1 daily vocabulary |
| 12 | `bán` / `bạn` | "to sell" / "friend" | sắc vs nặng | A1 high-frequency vocab |

**Two highest-difficulty pairs** (used by the spec test in §6):

- `má` (sắc) vs `mã` (ngã) — rising vs broken-rising. Per `lessons-a1.ts:1742`: "Common mistake: foreigners say every tone flat."
- `mả` (hỏi) vs `mã` (ngã) — dipping-rising vs broken-rising; the two adjacent tones Southern dialect collapses.

Total: **12 minimal-tone contrasts** anchored in existing
curriculum, meeting Bar #2's "≥12" floor. PR 2 ships exactly these
12; further authoring is a separate later dispatch.

---

## 4. Existing infrastructure — what we reuse

Reconnaissance against `origin/main` `c12f96996`:

### Recording

- `src/hooks/usePronunciationRecorder.ts` — already-mounted hook
  wrapping `MediaRecorder` + `getUserMedia`. Returns
  `{ status, audioBlob, startRecording, stopRecording, … }`. Used
  today by VN→EN pronunciation drills. Reusable for VN tone capture
  with **zero changes**.
- `src/hooks/placement/v3/usePlacementAudioCapture.ts` exists as a
  sibling pattern; not relevant to this surface.

### Scoring backbone

- `src/lib/pronunciation/cloudScorer.ts:scoreCloud()` (line 169) —
  thin wrapper around Azure Pronunciation Assessment via the
  `azure-phoneme` edge function. Already in production behind the
  `azure_phoneme_scoring` flag.
- `supabase/functions/azure-phoneme/core.ts` — server-side bridge
  to Azure. The `Pronunciation-Assessment` header is set at line 526.
  The function returns per-word + per-phoneme accuracy/fluency
  scores.
- `src/lib/pronunciation/scoringEngine.ts` (53, 201, 242) — SRS-flat
  contract over `scoreCloud`. Not directly reusable for tone
  scoring (its output shape is English-phoneme oriented), but its
  edge-function call pattern is the template.
- `src/lib/pronunciation/scorer.ts` — local transcript-vs-target
  text aligner. **Not usable for tone scoring** (no pitch awareness).

### Drill UI patterns

- `src/components/speech/SpeechDrill.tsx` — production drill
  component. Hear → record → score → result loop, with `idle |
  listening | scoring | result | error` state machine
  (`SpeechDrill.tsx:39`). PR 2's `ToneDrill.tsx` mirrors this state
  machine, swaps the scoring call, and renders a six-tone target
  selector instead of an English sentence prompt.
- `src/components/speech/SoundPairDrillCard.tsx` — minimal-pair
  discrimination UI (listen-and-tap). Same component shape as the
  tone drill UI for the `passive-recognition` mode named in §5
  option C — useful as a fallback if production scoring fails.
- `FeedbackBar` mounted globally at `src/router/AppRouter.tsx:1756`
  — no per-route wiring needed for the "Báo lỗi" requirement.

### What does **not** exist on `main`

- **No tone-aware scorer.** `src/lib/pronunciation/vn-phoneme-map.ts`
  (37 KB) explicitly disclaims tone scoring at lines 783-794: *"the
  UI plays a tone and roughly equal duration. English is
  stress-timed … no learner-pitch scoring."* `PROBLEM_PAIRS_STRESS`
  and `PROBLEM_PAIRS_INTONATION` exist but are EN-target
  discrimination drills, not VN-target production.
- **No pitch extraction pipeline.** No Web Audio FFT analyser, no
  YIN/CREPE worker, no `pitchContour` field anywhere in `src/`.
- **No tone fixture/eval harness.** `evals/` has VI-grammar and
  EN-VN-grammar files but nothing acoustic.

This gap is the principal design problem this doc names; §5 picks
an approach.

---

## 5. Scoring approach — recommendation

Bar #2 says "at-least-pass/fail feedback." The strict requirement is
production, not classification. Three candidates:

### Option A — Azure Pronunciation Assessment with VN locale

Call `azure-phoneme` edge function with `Locale: vi-VN`. Azure's
Pronunciation Assessment returns per-word accuracy + per-phoneme
accuracy. **Open question:** Azure's `vi-VN` Pronunciation
Assessment scores tonemes only as part of its phoneme set; it is
not documented to return a separate tone score. Empirically, a
mis-toned syllable scores lower on `AccuracyScore` for that
syllable, but the signal is noisy at the single-syllable level.

- ✅ Reuses 100% of existing edge-function infrastructure.
  Zero new server code; one new locale string.
- ✅ Honest-uncertainty fits naturally: bucket Azure
  `AccuracyScore` into `pass ≥70`, `low-confidence-pass 50-69`,
  `retry < 50`. Three buckets, not five, matches Bar #2's
  "at-least pass/fail."
- ⚠️ Single-syllable inputs are at the noisy end of Azure's
  reliability range. The spec test in §6 verifies adjacent-tone
  distinction empirically before merge.
- ⚠️ Requires network + Supabase auth. Anon users get the
  passive-recognition fallback (Option C below).

### Option B — Web Audio pitch-contour extractor

Run a local YIN or autocorrelation pitch tracker over the recorded
PCM, emit a normalized pitch contour, hand-classify against six
tone shape templates (level / rising / falling / dipping-rising /
broken-rising / low-stopped).

- ✅ Works fully offline. No edge function.
- ✅ Tone shape is the literal acoustic feature — the signal we
  want, directly. Lower noise than asking a phoneme model to leak
  tone via accuracy score.
- ❌ New infrastructure: ~300 LOC of audio worker code + a tone
  shape template library + a tolerance threshold tuning pass.
  Material implementation cost for PR 2 (likely 2-3 PRs, not 1).
- ❌ Real-world recordings vary in fundamental frequency by
  speaker; need a per-attempt normalization. Tuning is real work.
- ❌ Adds bundle weight to the EN→VN side, which is ~5%-effort.

### Option C — Force-choice listen-and-tap

Play a tone; ask the learner to identify which of two options it
is. Pure recognition, not production.

- ❌ **Does not meet Bar #2.** §15 says "asks the learner to
  *produce* a tone." Bar #2's artifact bar is binary on this.

### Recommendation

**Option A** (Azure with `vi-VN` locale + three-bucket score
mapping) for PR 2.

Reasoning:
- §15 bar is pass/fail with adjacent-tone-distinguishing — a
  bucket on `AccuracyScore` provides exactly this granularity if
  the spec test passes.
- Zero new server infrastructure; the edge-function call pattern is
  proven by `azure-phoneme`.
- Compatible with the ~5% Axis 2 effort budget. If Azure's
  single-syllable signal is too noisy in the spec test, Option B is
  the documented fallback for a future iteration (this PR's design
  does not commit to Option B).

PR 2 ships the spec test in §6 before declaring Bar #2 closed. If
the test fails, Bar #2 stays open and the implementation pivots to
Option B in a follow-up design.

---

## 6. Test plan — adjacent-tone distinction

Bar #2's verification clause: *"a test verifying the scoring
distinguishes adjacent tones."*

### The spec test (PR 2 ships this)

A vitest case in `src/lib/pronunciation/__tests__/toneScoring.test.ts`
(new file) that:

1. Loads two prerecorded reference audio clips — one of `má` (sắc)
   and one of `mã` (ngã) — both spoken by the same speaker at
   matching loudness/duration. These are the two adjacent tones
   that most-frequently merge for English-L1 learners and the two
   Southern dialect honour-zone tones.
2. For each clip, calls the new `scoreTone(blob, targetSyllable,
   targetTone)` adapter with **mismatched** target (`má` audio
   against `mã` target, and vice versa).
3. Asserts both mismatched calls land in `retry` (< 50) bucket.
4. For each clip, calls `scoreTone` with the **matched** target.
5. Asserts both matched calls land in `pass` or `low-confidence-pass`
   (≥ 50) bucket.

That is four assertions over four scoring calls. The contract is
binary: the scorer must distinguish adjacent tones above noise.
If Azure can't do this empirically, Option A is wrong and the spec
test fails before merge — that's the design intent.

### Why `má` vs `mã` specifically

- Both are rising tones — only the broken (glottalized) middle of
  `ngã` distinguishes them. Hardest adjacent-tone distinction in
  the six-tone set.
- Both are practical learner errors — A1 learners regularly
  produce a flat `má` when targeted at `mã` (`lessons-a1.ts:1774`:
  *"Common mistake: learners only change loudness. Tone is pitch
  and voice shape, not volume."*).
- Southern speakers collapse them — the spec test indirectly
  validates the §2 dialect tolerance copy.

### Test data sourcing

- Prerecorded clips ship in `public/audio/tone-drill/` (one mp3
  per syllable × six tones = six clips for the spec test plus the
  drill itself). Source: either reuse existing `ma×6` audio if it
  exists in the Supabase `room-audio` bucket for lesson 37
  (`lessons-a1.ts:1746`), or commission via the existing
  ElevenLabs / TTS pipeline. PR 2 confirms which.
- No learner audio is committed to the repo or to evals. The spec
  test uses synthesized reference clips only.

---

## 7. UX wireframe

ASCII sketch of one drill iteration, mobile width (375 px):

```
┌─────────────────────────────────────┐
│  Tones of `ma`                      │
│  Lesson 37 · A1                     │
├─────────────────────────────────────┤
│                                     │
│         Target:  mã                 │
│                                     │
│      🔊 Listen to mã                │
│                                     │
│      ╭─────────────╮                │
│      │   🎙  Record │                │
│      ╰─────────────╯                │
│                                     │
│  ── or ──                           │
│                                     │
│  Tap which tone you heard:          │
│  [ má ] [ mã ] [ mả ]               │
│                                     │
├─────────────────────────────────────┤
│  ╰── 1 of 12                        │
│  Người miền Nam thường gộp hỏi      │
│  và ngã. Bạn vẫn được điểm nếu      │
│  phát âm theo giọng quê.            │
└─────────────────────────────────────┘
```

After record + score:

```
┌─────────────────────────────────────┐
│  Target:  mã    You said:  ✅       │
│                                     │
│  Pass — gần đúng giọng mã           │
│  (Mercy chưa chắc lắm — giọng       │
│   miền Nam có thể nghe khác)         │
│                                     │
│      [ Try again ]   [ Next → ]     │
│                                     │
│  ❗ Báo lỗi  (global FeedbackBar)   │
└─────────────────────────────────────┘
```

Three buckets on the result row:
- `pass` ≥ 70 → green check, "Đúng giọng {tone}".
- `low-confidence-pass` 50-69 → yellow check, "Gần đúng giọng
  {tone}" + "Mercy chưa chắc lắm" honest-uncertainty chip.
- `retry < 50` → orange dot, "Thử lại — chú ý giọng {tone}".
  Never says "wrong" — copy stays in `voice-guidelines-vn.md`
  Rule 1 (never volunteer loss framing).

---

## 8. Route + entry points

PR 2 ships `/learn/vietnamese/tones` (placeholder, owner may rename).
Entry points:

1. Vietnamese-for-foreigners track lesson 37 — direct link to the
   tone drill at lesson completion (`src/languages/vietnamese/
   lessons-a1.ts:1746`).
2. The Vietnamese-for-foreigners track index page (TBD in PR 2 —
   may already exist via `LanguageSwitcher`).

No deep linking from Axis 1 (Vietnamese-native → English) surfaces.
The drill is Axis 2 only by design — the navigation gate uses
`useNativeLanguage()` to decide which entry points show.

---

## 9. Out of scope for PR 2

- Tone production drill for non-Vietnamese targets (no Korean tone
  drill, no Chinese tone drill — different §15 bars, different
  pairs).
- Pitch-contour visualization on the result row. Could be valuable
  but adds bundle weight; revisit if learners ask for it via
  FeedbackBar.
- Streak / progress / "tones mastered" counter. Forbidden by
  `voice-guidelines-vn.md` Rule 1 and by `layer-model.md` Local-Only
  Posture.
- Multi-syllable tone-sandhi work (e.g. tone changes in `số một`,
  `bốn năm`). Bar #2 is single-syllable production; sandhi is a
  later authoring topic.

---

## 10. Open questions for owner review

1. **Six Northern vs five Southern.** §2 recommends six Northern.
   Confirm before PR 2 commits the drill set.
2. **Azure `vi-VN` vs local pitch extractor.** §5 recommends Azure
   for PR 2 + spec-test gate. If the test fails empirically, do we
   want a second design pass for Option B, or do we ship the
   passive-recognition (Option C) fallback and re-open Bar #2?
   Bar #2's "produce" language says option C alone is not enough,
   so the answer is probably "second design pass."
3. **Reference audio sourcing.** §6 punts to PR 2 on whether to
   reuse existing lesson-37 audio if any exists in `room-audio`
   bucket, or to commission new TTS. Owner may have a preference
   given the Vietnamese voice-talent constraints in `voice-
   guidelines-vn.md`.
4. **Route name.** `/learn/vietnamese/tones` is a placeholder.
   Existing convention varies (`/languages/vietnamese`,
   `/vn-foreigners`, etc.). Pick before PR 2.
5. **Audio cap budget.** Azure Pronunciation Assessment has a
   daily cap per the existing rate-limit infra. PR 2 should
   confirm tone drill traffic won't blow the cap; if it might, add
   a soft per-session limit before exposing the drill widely.
6. **Anon-vs-authed posture.** Stage 3 brick designs (e.g. #1199)
   are anon-friendly. Tone drill requires Azure scoring → requires
   Supabase auth. Either gate the drill behind auth (and lose anon
   funnel value) or ship the Option C passive-recognition fallback
   for anon users with a "Sign in to score your voice" upsell.
   Owner picks.

---

## 11. Verification checklist (for PR 2)

- [ ] Drill set ships the 12 minimal-tone contrasts from §3,
      verbatim.
- [ ] `scoreTone` adapter calls `azure-phoneme` with `Locale: vi-VN`
      (Option A picked).
- [ ] Spec test in `src/lib/pronunciation/__tests__/toneScoring.test.ts`
      distinguishes `má` vs `mã` on adjacent-tone fixtures (4
      assertions per §6).
- [ ] Three-bucket score mapping (`pass` ≥70, `low-confidence-pass`
      50-69, `retry` <50) implemented and surfaced in UI copy.
- [ ] Southern-dialect tolerance copy renders verbatim from §2.
- [ ] Honest-uncertainty chip ("Mercy chưa chắc lắm — giọng miền
      Nam có thể nghe khác") appears on `low-confidence-pass` rows
      only.
- [ ] No `localStorage.setItem` of recording metadata except the
      tiny per-session attempt counter (no PII, no audio refs).
- [ ] No Supabase write of recordings, transcripts, or scores
      (only the existing Azure call goes server-side).
- [ ] No external analytics on attempts.
- [ ] `FeedbackBar` renders on the drill route (auto via
      `AppRouter.tsx:1756`).
- [ ] No streak / XP / "tones mastered" surface.
- [ ] All copy is Vietnamese except verbatim syllable targets.
- [ ] Entry point from Vietnamese-for-foreigners lesson 37 exists.

---

## 12. Estimated implementation size

Rough order-of-magnitude for PR 2 (subject to owner review):

| Component | Est. LOC | New file? |
|-----------|----------|-----------|
| `src/lib/pronunciation/scoreTone.ts` (adapter) | ~120 | yes |
| `src/components/tone-drill/ToneDrill.tsx` | ~200 | yes |
| `src/components/tone-drill/ToneTargetCard.tsx` | ~80 | yes |
| `src/data/tone-drill/minimal-pairs.ts` (12 entries) | ~60 | yes |
| `src/lib/pronunciation/__tests__/toneScoring.test.ts` | ~120 | yes |
| Route wire-up in `AppRouter.tsx` | ~10 | no |
| Lesson-37 entry-point link | ~10 | no |
| **Total** | **~600 LOC** | 5 new files |

Reference audio (6 clips) adds binary weight outside LOC.

This sits below the §3 *"small diffs over smart diffs"* threshold
for an unstable system, with the caveat that this surface is *new*
not unstable. Owner may want to split implementation into two PRs
— (a) scorer + spec test, (b) UI + drill set — to land the
Bar #2 verification gate before the UI surface.
