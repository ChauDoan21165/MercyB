# Decision doc — Issue #757: pronunciation-full-flow e2e coverage

**Author:** B9 · **Date:** 2026-05-19 · **Status:** DECIDED — Option B accepted · **Labels:** coverage-gap

> **Decision:** Option B. Test-project flag enable + `npm run test:e2e` run +
> filing of any bugs the spec surfaces are **Chau's hands-on follow-up** —
> they require admin access to the test Supabase project and his eyes on the
> spec output. **Prod global flag stays OFF.** Launch is a separate, later
> decision (not tracked via #757).

---

## TL;DR

The issue's framing ("enable the flag OR accept the gap") hides the real
answer. **Two unrelated decisions are tangled together:**

| Axis | Question | Prod impact | This is what #757 *actually* asks |
|---|---|---|---|
| **1. Test coverage** | Enable `pronunciationScoringEnabled` for the **TEST_USER cohort in the test Supabase project** so the existing spec runs | **None** (separate test project) | ✅ Yes |
| **2. Product launch** | Flip the flag globally **ON in prod**, exposing the speak feature to real users | High (money path, real users) | ❌ No — separate decision |

The placement-test analogy in the brief applies only to Axis 2. **#757 is an
Axis 1 question** and Axis 1 is cheap, prod-safe, and already 95% built. The
e2e spec is **already written and complete** — it is not "write the tests,"
it is "turn on one cohort row in the test project so the written spec runs."

**Recommendation: Option B**, with the corrected understanding that Option B
costs minutes (not days), which makes it strictly dominate Option A.

---

## 1. What the flag is

- **Name:** `pronunciationScoringEnabled`
- **Storage:** DB row in `public.feature_flags` (not a build constant — flips
  with no deploy). Seeded by `supabase/migrations/20260424020000_seed_pronunciation_scoring_flag.sql`.
- **Default:** `is_enabled = false` globally, `enabled_user_ids = []` (empty
  cohort). So: **OFF for everyone today.**
- **Resolution order** (`useFeatureFlagQuery.ts`): per-user cohort match →
  global `is_enabled` → OFF on error/no-session/missing-row.
- **Toggled via:** `/admin/feature-flags` admin UI (admin_level ≥ 9), or a SQL
  row edit. No code change required to flip either direction.

### What it gates (all degrade gracefully when OFF)

| Surface | Flag OFF behavior |
|---|---|
| `/speak` (`SpeechDrillPage`) | `<Navigate to="/" replace />` |
| `/speech/history` (`SpeechHistoryPage`) | `<Navigate to="/" replace />` |
| Progress dashboard (`Progress.tsx`) | self-gates, hidden |
| In-room drill (`RoomPronunciationPractice`) | `return null` |
| Home `WeeklyProgressWidget` | `return null` |
| `AccountPage` entry point | hidden |

**No tier/entitlement gate exists on these surfaces** — they are *flag*-gated,
not *paid-tier*-gated. Flipping the **global** flag ON would expose the speak
feature to **every** user (free and paid), not just Premium.

### Cost model (corrects a likely misread)

The `pronunciationScoringEnabled` path uses the **free, local, browser-native
Web Speech API + text aligner** (`src/lib/pronunciation/scorer.ts`). **No
per-call API spend.** The paid Azure cloud phoneme path is a **separate
feature behind a separate flag** (`azure_phoneme_scoring` /
`pronunciation_srs_enabled`) and is **not in scope for #757**. The issue's
"money/feature path" severity is because pronunciation scoring is a named
**Premium-tier value driver** (STRATEGY.md §10: 199K VND tier = "Basic + AI
feedback + pronunciation scoring + test prep"), not because flipping this flag
costs money per use.

---

## 2. Coverage audit — verifying A93's "zero coverage" claim

**A93's claim is correct for e2e, and would be materially wrong as a blanket
statement.** Ripgrep across test files:

- **e2e:** exactly **one** spec, `tests/e2e/pronunciation-full-flow.spec.ts`.
  It has `test.skip(true, "pronunciationScoringEnabled is off for TEST_USER")`
  on line ~48 and therefore **never executes** → **zero effective e2e
  coverage. Confirmed.**
- **Unit / component / service:** **~65 test files** touch pronunciation,
  including the engine (`scorer.test.ts`, `cloudScorer.test.ts`,
  `streamingScorer.test.ts`, `phonemeFeedback.test.ts`,
  `audioComparison.test.ts`), components (`SpeechDrill.test.tsx`,
  `SpeechDrillSession.test.tsx`, `SpeechDrillPhonemes.test.tsx`,
  `RoomPronunciationPractice.test.tsx`, `SpeechHistoryPage.test.tsx`), and
  services (`speechAttempts.test.ts`, `speechHistory.test.ts`).

**Precise statement of the gap:** the *logic and rendering* are unit-verified.
What has **no automated proof** is the **wired browser journey**: real route
gate → mic event → score renders → phoneme feedback → "Try this word" swaps
the drill target → `speech_attempts` row persists → `/speech/history` renders
it. That is exactly the journey the existing spec already encodes — it just
can't run because the test account lacks the flag.

**Effort to "covered":** the e2e is **already written and comprehensive**. No
authoring needed. "Covered" = enable the flag for the test cohort + run +
triage whatever real bugs the spec surfaces.

---

## 3. The three options

### Option A — Flip the flag, accept the e2e gap, monitor in prod
Flip `pronunciationScoringEnabled` globally ON in prod; rely on the ~65 unit
tests + Sentry/real users to catch integration bugs.

- **Effort:** ~1 min (admin toggle).
- **User impact:** speak feature goes live for **all** users immediately.
- **Risk:** **High and avoidable.** Ships a Premium-tier value path with
  **zero proof the wired journey works** (mic→score→persist→history). If the
  glue is broken, the first people to find out are real Vietnamese learners on
  a feature STRATEGY positions as a moat. Violates "Outcomes over engagement"
  and "the feature isn't working if the UI renders but [persistence] fails."
  Also conflates test-enablement with a product launch that has no marketing
  readiness behind it.

### Option B — Run the existing e2e first, *then* decide on launch (RECOMMENDED)
Enable `pronunciationScoringEnabled` **only for the TEST_USER cohort in the
test Supabase project** (one row; README §"Test account setup" already
documents this exact step). Run `npm run test:e2e`. Fix whatever the spec
surfaces. The prod global flag stays **OFF** — this closes the *coverage* gap
without launching anything.

- **Effort:** ~5 min config + the existing spec run + triage of real bugs it
  finds (0–2 h, and finding them is the entire point). **No test authoring.**
- **User impact on prod:** **none.** Test project is isolated from prod
  (README: "dedicated test Supabase project — not production").
- **Risk:** **Minimal.** Closes #757 honestly, gives a green end-to-end proof,
  and keeps the launch decision separate and deliberate. Worst case: the spec
  finds real wiring bugs — which is a win, found by an agent tonight instead
  of a user later.

### Option C — Keep the flag OFF everywhere, document why, leave the spec skipped
Accept the gap. Add a note to the spec/issue explaining pronunciation has no
e2e because the feature is pre-launch.

- **Effort:** ~10 min (a doc paragraph).
- **User impact:** none.
- **Risk:** Low for *prod* but **wrong for the test axis.** There is no reason
  to leave a fully-written spec permanently skipped when enabling the test
  cohort is free and prod-safe. This is the correct stance for the **launch**
  axis (don't ship until Premium/marketing ready) but a missed-cheap-win for
  the **coverage** axis. Effectively "accept avoidable blindness on a money
  path" — the weakest option for #757 as filed.

---

## 4. Recommendation

**Option B.** The brief assumed Option B means "write the e2e tests first"
(expensive, safety-first tempo trade-off). It does **not** — the spec is
already written. Option B is actually a ~5-minute test-project config that
closes #757, with **zero prod risk**. Once that is understood, Option B
**strictly dominates** A (B has all of A's upside minus the avoidable risk)
and beats C (C leaves a free, written safety net switched off).

Then, as a **separate, later decision** (the real Axis-2 / placement-test-class
launch call): hold the global prod flag OFF until (1) the now-running e2e is
green in CI and (2) Premium-tier positioning + marketing are ready, since
STRATEGY makes pronunciation scoring a paid-tier value driver and a moat — it
deserves a deliberate launch, not a flag flipped to satisfy a test ticket.

**Concrete close-out for #757** (ownership noted — steps 1–2 are **Chau's**,
not B9's, because they need test-project admin access + a human reading the
spec output):
1. **[Chau]** In the **test** Supabase project: add TEST_USER's UUID to
   `feature_flags.enabled_user_ids` for `pronunciationScoringEnabled` (or set
   it ON in that project's `/admin/feature-flags`).
2. **[Chau]** Run `npm run test:e2e`; **any real bug `pronunciation-full-flow`
   surfaces gets its own issue + its own fix PR** (one concern each). B9 does
   not run the e2e or pre-file these — there is nothing surfaced until the run
   happens.
3. **[locked]** **Prod** global flag stays **OFF**. Note on the issue: "e2e
   now runs in the test project; prod launch tracked separately under the
   Premium-tier launch decision — not via #757."

---

## 5. Strategy alignment (STRATEGY.md / PRINCIPLES.md)

- **Pronunciation is on-mission, not optional fluff.** STRATEGY.md names
  "Pronunciation Excellence" as roadmap Step 3 (~50%, "drills shipped, STT
  pending"), lists Vietnamese-pain-point phoneme scoring (th, r, l, final
  consonants, stress) as a **competitive moat** (§11), and bundles
  "pronunciation scoring" into the **Premium tier** (§10). Launching it
  *eventually* is squarely aligned. → argues against Option C as a permanent
  stance.
- **"Outcomes over engagement" + money-path discipline.** Operating
  discipline: a feature "isn't working if the UI renders but [persistence]
  fails." Shipping a Premium path with no integration proof (Option A) directly
  violates this. → argues against Option A.
- **"Core path survives optional failures."** Every gated surface degrades
  cleanly when OFF (`<Navigate>` / `return null`), so the speak feature is an
  **optional surface** — keeping the prod flag OFF endangers nothing
  (room/audio/chat/admin untouched). This is *why* the launch can stay
  deliberate without cost. → supports B's "test now, launch later."
- **"Restore before redesign / small diffs / checkpoint risky steps."** Option
  B is the smallest safe move that produces evidence (a running e2e) before any
  product-facing change — the disciplined order.

**Net:** Option B is the only choice consistent with all three of: mission
(pronunciation matters → don't permanently shelve it = not C), money-path
discipline (don't expose unproven paid features = not A), and small-safe-diff
operating discipline (get the evidence first = B).
