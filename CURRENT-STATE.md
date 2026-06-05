# MercyBlade — Current State (Vietnamese flagship Definition of Done)

> **Migrated 2026-06-05 (V3 forward-fix).** This is the canonical rehome of the
> Vietnamese-flagship **Definition of Done** (the DoD bars / Axis-1 / Axis-2 /
> re-open gates / status snapshot) that previously lived in `STRATEGY.md §15`,
> removed in the V3 STRATEGY adoption (commit `d73f91674`). Content below is preserved
> **verbatim** from `STRATEGY.md@d73f91674^` §15. Cross-references that formerly read
> "`STRATEGY.md` §15" now point here. **Axis 1 stands at 5/7** — Bars #1–#5 closed;
> **Bar #6 (native crash telemetry) and Bar #7 (named learner outcome) are owner-gated.**
> The 8-layer model and stage ladder live in `docs/architecture/layer-model.md`;
> strategic direction is governed by the V3 `STRATEGY.md`.

## 15. Definition of Done: Vietnamese flagship

The Vietnamese flagship covers **both axes** of the pair matrix anchored
to Vietnamese:

- **Axis 1: VN → EN** — Vietnamese learner studying English. The
  ~95%-effort home market (§4). The proof case for §1's mission.
- **Axis 2: EN → VN** — English speaker studying Vietnamese. The
  reverse direction of the same flagship language, served by the
  536-lesson Vietnamese-for-foreigners track (§6).

The flagship is "done enough to start serious work on a **second pair**
(Korean / Japanese / Chinese / French / German / Spanish on either
axis)" when **all** of the criteria below hold. Until then, new-pair
authoring competes with §4's home-market effort allocation and the
matrix risks drifting toward dilution.

Each criterion is testable — pass/fail, with a named verification
artifact, not vibes. Each ships its own checkbox here and gets ticked
when the artifact lands on `origin/main`. None of these criteria are
already met today; none requires perfection. The bar is "real depth on
one full direction of one full pair, on both sides."

### Axis 1: VN → EN done-criteria

- [x] **L1 grammar coverage gap closed.** Every grammar family in
  `docs/l1-taxonomies/vi-grammar.md` is reachable by at least one
  detector rule in `src/lib/feedback/l1-error-detector.ts`. *Today:*
  all 15 families have detectors; all 5 candidates flipped to
  `expected_pass`. *Artifact:* PRs #1163, #1170, #1172, #1164, #1169
  merged to main; `evals/vi-grammar-cases.json` reflects flips;
  `evals/.baseline.json` shows 65/65 = 100%.

- [x] **L1 detector eval baseline ≥ 95%.** Global pass rate on
  `evals/vi-grammar-cases.json` is ≥ 95% (baseline-eligible cases).
  *Today:* 100% (52/52) — bar met. *Artifact:* `evals/.baseline.json`
  on `main` shows `"global": { "pass": 52, "total": 52, "rate": 1 }`
  (generated 2026-05-25). The three under-firing patterns from
  PR #1115's report (`IRREGULAR_PAST` whitelist, inflection in
  `PREPOSITION_MISMATCHES`, preposition-deletion entries) all closed.

- [x] **AI Tutor consumes the L1 profile.** `promptAssembly.ts`
  drops the unused `_l1Patterns: string[]` placeholder and injects a
  projection from `vietnameseL1Profile` into the Vietnamese
  teacher-voice block. *Today:* consumed (PR #1131). `src/lib/ai-tutor/
  promptAssembly.ts:32` imports `vietnameseL1Profile`; the active
  parameter is now `l1Patterns: string[]` (no underscore) at line 270;
  the injection at lines 295-297 emits *"Lưu ý các lỗi tiếng Việt
  thường gặp ở trình độ này: …"* into the system prompt. *Artifact:*
  PR #1131 merged + probe evidence pinned in that PR's body.

- [x] **Pronunciation drills cover the §5-named pain points.**
  `src/lib/pronunciation/vn-phoneme-map.ts` ships `PROBLEM_PAIRS_*`
  sets for every Vietnamese pain point named in §5 item 3 — `th`,
  `r`, `l`, `final consonants`, `stress`, `intonation`. *Today:* all
  six axes ship — `PROBLEM_PAIRS_TH_T`, `_R_L`, `_ED_ENDINGS`,
  `_S_PLURALS`, `_STRESS` (8 entries), `_INTONATION` (7 entries) —
  wired into `CATEGORY_POOLS` in `soundPairDrills.ts` and exposed via
  the existing discrimination-drill UI. Stress + intonation are
  content-only at this stage (listen-and-tap, no learner-pitch
  scoring) per the dispatch scoping. *Artifact:* the two new consts
  on `main`.

- [x] **Placement → lesson routing verified end-to-end.** A
  Vietnamese learner who completes the placement test is routed to
  lessons tagged with their flagged L1 interference patterns,
  validated by a real placement run + lesson-recommendation chain on a
  real account. *Today:* runbook + E2E spec shipped via PR #1143.
  *Artifact:* `docs/runbooks/placement-to-lesson.md` (step-by-step
  contract for anon flow with file:line anchors, explicit safety
  invariants) + `tests/e2e/placement-to-first-lesson.spec.ts` (anon
  spec walking five v3 tasks → Results → first lesson → /room/:roomId
  URL shape).

- [ ] **Native crash telemetry confirmed on-device.** Sentry fires
  from iOS and Android builds on a real device — not a CI emulator
  or simulator — and the event lands in the Sentry dashboard. *Today:*
  wiring shipped (per dispatch reference to PR #1132); on-device
  probe pending. *Artifact:* Chau's on-device confirmation logged
  against PR #1132 (issue ID from Sentry pinned in the PR thread).

- [ ] **One named Vietnamese learner outcome.** At least one
  Vietnamese learner publicly credits MercyBlade for an
  IELTS / TOEIC / VSTEP score uplift, a job-abroad outcome, or a
  named conversational-fluency milestone. *Today:* zero named credits
  on record. *Artifact:* a quoted attribution in `testimonials/` (or
  equivalent on-repo location) with the learner's documented permission
  to use the quote. This is the §1 mission test for Axis 1.

### Axis 2: EN → VN done-criteria

- [x] **L1 profile authored for EN-speakers studying Vietnamese.**
  An EN→VN profile exists under `src/lib/l1-profiles/`, mirroring
  `vi.ts`'s structure but inverted: the L1 is English, the target is
  Vietnamese. *Today:* `src/lib/l1-profiles/en.ts` ships
  `englishL1Profile` with `meta.nativeLangCode = "en"`,
  `meta.targetLangCode = "vi"`, 10 grammar families, **84 paired
  examples** spanning classifier omission, age-relative pronoun
  selection, copula `là` misuse with adjectives, sentence-final
  particle omission, noun-modifier order, aspect-marker overuse,
  question-formation inversion, negation misplacement, plural-marker
  redundancy, and direct-translation calques. Bilingual descriptions
  on every family, severity tiers per spec §0 lock, snake_case IDs.
  Passes the structural `validateL1Profile` validator. *Artifact:*
  `src/lib/l1-profiles/en.ts` on `main`.

- [ ] **Tone production coaching exists.** The EN→VN track ships a
  coaching surface for the six Northern (or five Southern) Vietnamese
  tones — at minimum, a drill that asks the learner to produce a tone
  on a target syllable and returns at-least-pass/fail feedback.
  *Today:* still open. The #1206 Option A Azure/adapter attempt
  produced a 12-pair drill set and adapter work, but failed the
  empirical adjacent-tone verification for `má` vs `mã`; that is not
  a shippable Bar #2 close. #1208 merged the Option B design for a
  local pitch-contour approach, but the A2 F0 spike found Option B is
  not production-viable as designed for scoring with the current
  fixtures. The next honest state is either a redesigned scoring
  approach or a non-scored listen-compare prototype. *Artifact still
  required under the current DoD:* shipped production feature with a
  drill set of ≥12 minimal-tone pairs (e.g. the canonical
  `ma / má / mà / mả / mã / mạ` set, plus 6+ more contrasts) and a
  test verifying the scoring distinguishes adjacent tones. If Chau
  accepts a revised non-scored DoD, update this checkbox text before
  ticking it.

- [x] **Classifier system explainer + drill.** At least one room
  teaching the Vietnamese classifier system (`cái`, `con`, `chiếc`,
  `cuốn`, `quả`, `tấm`, etc.) with a forced-choice drill that scores
  correct classifier selection given a head-noun + count. *Today:*
  `public/data/learn_vietnamese_classifiers.json` ships 20
  forced-choice items covering `cái`, `con`, `chiếc`, `cuốn`, `quả`,
  `tấm`, `bộ`, `bức`, `ngôi` — including the canonical `con dao`
  knife exception. Each entry carries a `quiz` block with
  `prompt_en` / `prompt_vi`, 4-choice options, and `correctIndex`
  so the existing room engine plus any forced-choice drill UI can
  score selections. *Artifact:* the room file on `main`.

- [x] **EN→VN detector rules.** At least 8 detector rules in a new
  rule pack (`src/lib/feedback/rule-packs/en-vn/`) covering common
  English → Vietnamese transfer errors. *Today:*
  `src/lib/feedback/rule-packs/en-vn/` ships `EN_VN_RULE_PACK` with
  **8 detector rules** sourced from the 10 grammar families in
  `src/lib/l1-profiles/en.ts`: `en_l1_copula_la_adj`,
  `en_l1_classifier_omission`, `en_l1_aspect_overuse_stative`,
  `en_l1_noun_modifier_inversion`, `en_l1_plural_marker_redundancy`,
  `en_l1_negation_la_missing_phai`, `en_l1_calque_take_it_easy`,
  `en_l1_question_inversion_la_front`. The 2 deferred families
  (`pronoun_age_register_mismatch`, `sentence_final_particle_omission`)
  need conversational context the `RuleArgs` surface doesn't expose.
  Fixture file `evals/en-vn-grammar-cases.json` ships **24 cases
  (≥3 per rule)**; every fixture fires its exact expected tag in
  `__tests__/rules.test.ts`. The `detectEnVnError()` entry point
  wiring the pack into the AiTutor consumer has now landed as a
  #1188 follow-up — the pack is no longer an isolated artifact; it
  is live in the tutor path. *Artifact:* the new directory + fixture
  on `main`, plus the consumer wire-in.

- [ ] **One named English-speaker outcome.** At least one English
  speaker publicly credits MercyBlade for measurable conversational
  Vietnamese fluency — a real-world conversation reported, a level
  test passed, an in-country transaction handled, an explicit "I can
  now order pho without switching to English" milestone. *Today:*
  zero on record. *Artifact:* quoted attribution in `testimonials/`
  with the learner's documented permission.

### Cross-axis: matrix-doc anchor

- [x] **`docs/pair-matrix.md` lists capability coverage per axis.**
  *Today:* shipped via #1185 and available at `docs/pair-matrix.md`,
  with rows for both axes of the Vietnamese flagship showing which
  capabilities (grammar detector, phonology drills, placement
  routing, tutor injection, crash telemetry, outcomes) are present.
  The matrix still needs ordinary drift updates when bars move, but
  the cross-axis dashboard artifact itself exists.

### When a criterion is met

Each checkbox is ticked **only** when the named artifact lands on
`origin/main` (or in Chau's verified Sentry dashboard for the
on-device gate). The tick edit is a tiny doc PR carrying the artifact
link. No criterion is closed by argument; only by artifact.

If a criterion's artifact lands but the underlying capability turns
out not to map to a real learner outcome (e.g. the tutor injection
ships but learners don't engage with the surfaced patterns), the
checkbox stays ticked and a new criterion is added below — never
deleted. This §15 grows; it does not silently shrink.

### Re-open gates (when this section gets revisited)

Re-open and tighten if any of the following happen:

1. **A criterion ticks but the §1 mission test fails.** A capability
   shipped, no learner outcome materialised within a reasonable
   window. Tighten the criterion to require the missing link.
2. **A new pair (Korean, Japanese, Chinese, French, German, Spanish
   on either axis) starts serious authoring before all flagship
   checkboxes are ticked.** Confirm explicitly that the second-pair
   work isn't pulling effort the flagship still needs — §4's
   "Vietnamese-native wins the tie" principle binds. If the
   second-pair start is justified (e.g. an audience opportunity that
   doesn't compete for the flagship's authoring bandwidth), record
   the rationale here as a §15 addendum, not as a deletion.
3. **The pair-matrix doc reveals a capability gap not captured
   above.** Add a checkbox; do not silently absorb the gap.

### Hard rules for editing this section

- Do **not** weaken a criterion to make a checkbox tickable. If a
  criterion is wrong, replace it with a better one; the artifact
  bar stays high or moves higher.
- Do **not** add gamification metrics (XP, streaks, leagues, time
  in-app). §10 forbids these as KPIs; they don't belong here either.
- Do **not** add criteria that depend on third-party data that
  cannot be verified from this repo or from a Chau-controlled
  account (e.g. Duolingo Vietnamese retention numbers).
- Do **not** count "the code shipped" as "the criterion is met"
  unless the artifact is itself a learner-facing outcome (a placed
  learner, a routed lesson, a Sentry event from a real device, a
  quoted testimonial). Code-shipped-without-use is the failure mode
  this section exists to prevent.

### Status snapshot (date this when ticking checkboxes)

As of 2026-05-26, Axis 1 stays at 5/7 ticked (no change this pass):
Bar #1 (L1 grammar coverage, PRs #1163/#1170/#1172/#1164/#1169), Bar
#2 (eval baseline 65/65, PR #1156), Bar #3 (AI Tutor L1 injection, PR
#1131), Bar #4 (pronunciation drills, PR #1173), Bar #5 (placement →
lesson E2E, PR #1143). Two Axis 1 bars remain, both owner-gated: Bar
#6 (native Sentry on-device probe, wired per PR #1132) and Bar #7
(named Vietnamese learner outcome). Axis 2: three checkboxes are
ticked in code — Bar #1 EN→VN L1 profile (#1184), Bar #3 classifier
room/drill (#1176), and Bar #4 EN→VN detector rules (#1188, with the
`detectEnVnError` wire-in now on `main` as a #1188 follow-up). On
the code side Axis 2 is effectively 4/5 closed: three ticked plus
Bar #2 parked pending Chau's DoD decision (Option A failed empirical
adjacent-tone verification, and #1208's Option B local-pitch design
failed production-scoring viability in the A2 F0 spike; the next
state is either a redesigned scoring approach or a non-scored
listen-compare prototype, neither of which is current code work).
Bar #5 (named English-speaker outcome) remains open on the owner
track because no testimonial is on record. The cross-axis
pair-matrix anchor is shipped via #1185. Nine checkboxes ticked,
four open; under the 4/5-closed-on-code-side view, only Bar #5
(Axis 2) is active code-side work, since Bar #2 is decision-gated,
Bar #6 is on-device probe, and Bar #7 is testimonial-gated.

---

