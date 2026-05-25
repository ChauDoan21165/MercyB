# MercyBlade Pair Matrix

> **Source of truth:** which capabilities exist for which learning
> pairs, today. Updated when a capability ships for a new pair, when
> a new pair joins the committed set, or when a capability is
> retired.
>
> **Read order:** STRATEGY.md §1, §3, §4 first (defines the axes and
> committed pairs), then this file (shows current state).
>
> **Last updated:** 2026-05-25 (post-Bar #1 audit — 4 of 5 candidates merged, #1169 open)

## Axis 1 — Vietnamese learners studying [target]

| Capability                              | English (flagship)                                      | Japanese  | Korean    | Chinese   |
|-----------------------------------------|---------------------------------------------------------|-----------|-----------|-----------|
| L1 Profile (`src/lib/l1-profiles/`)     | ✅ `vi.ts`                                              | ❌        | ❌        | ✅ `zh.ts` shell |
| Grammar taxonomy (`docs/l1-taxonomies/`) | ✅ `vi-grammar.md` (15 families, 180 examples)         | ❌        | ❌        | ❌        |
| Writing taxonomy                        | ✅ `vi-writing.md` (12 patterns, 169 examples)          | ❌        | ❌        | ❌        |
| Phoneme gap audit                       | ✅ `vn-phoneme-gaps.md` (6 audit categories)            | ❌        | ❌        | ❌        |
| L1 interference atlas                   | ✅ `vnL1Interference.ts` (37 patterns)                  | ❌        | ❌        | ❌        |
| Detector rules                          | 🚧 `l1-error-detector.ts` — 4 of 5 Bar #1 candidates merged (`vi_l1_no_aux_negation` #1163, `vi_l1_future_adverb_bare` #1164, `vi_l1_topic_comment_fronting` #1170, `vi_l1_co_transfer`); `vi_l1_subject_gender` #1169 open | ❌        | ❌        | ❌        |
| AI Tutor L1 prompt wire                 | ✅ `promptAssembly.ts` ← `viL1Profile.interference` (PR #1131) — §15 Bar #3 ticked | ❌  | ❌        | ❌        |
| Placement test                          | ✅ existing + E2E runbook (PR #1143) — §15 Bar #5 ticked | ❌       | ❌        | ❌        |
| Eval harness                            | ✅ 62/62 baseline (100%) — was 52/52; §15 Bar #2 ticked (PR #1156) | ❌  | ❌        | ❌        |
| Pronunciation coaching                  | ✅ `PROBLEM_PAIRS_TH_T / _R_L / _ED_ENDINGS / _S_PLURALS / _STRESS / _INTONATION` — all 6 §5 pain points, wired into `soundPairDrills.ts` (PR #1173); §15 Bar #4 ticked | ❌        | ❌        | ❌        |
| Course content (rooms / lessons)        | ✅ 486 bilingual rooms                                  | (partial) | (partial) | (partial) |

### Axis 1 — §15 bars that don't map to capability rows

| §15 Bar                                 | Status                                                                                       |
|-----------------------------------------|----------------------------------------------------------------------------------------------|
| #1 L1 grammar coverage gap closed       | 🚧 4 of 5 detector candidates merged; gate is PR #1169 (`vi_l1_subject_gender`)              |
| #6 Native crash telemetry on-device     | ⏳ blocked on owner — wiring shipped (PR #1132); awaits Chau's on-device Sentry-dashboard probe |
| #7 Named Vietnamese learner outcome     | ⏳ open — marketing/operations; no testimonial on record yet                                  |

## Axis 2 — English speakers studying [target]

| Capability                              | Vietnamese | Japanese  | Korean    | Chinese   |
|-----------------------------------------|------------|-----------|-----------|-----------|
| L1 Profile                              | ❌         | ❌        | ❌        | ❌        |
| Grammar taxonomy                        | ❌         | ❌        | ❌        | ❌        |
| Writing taxonomy                        | ❌         | ❌        | ❌        | ❌        |
| Detector rules                          | ✅ `en-vn/` (8 rules, not yet wired) | ❌        | ❌        | ❌        |
| AI Tutor L1 prompt wire                 | ❌         | ❌        | ❌        | ❌        |
| Placement test                          | ❌         | ❌        | ❌        | ❌        |
| Eval harness                            | ✅ `evals/en-vn-grammar-cases.json` (24 cases) | ❌        | ❌        | ❌        |
| Tone production coaching                | ❌         | n/a       | n/a       | n/a       |
| Classifier system explainer + drill     | 🚧 PR #1176 (Vietnamese classifier room — §15 Axis 2 Bar #3) | n/a | n/a | n/a |
| Course content (rooms / lessons)        | (partial)  | (partial) | (partial) | (partial) |

## Legend

- ✅ shipped, on `origin/main`
- 🚧 PR in flight
- ⏳ blocked on owner / operations / marketing (no engineering blocker)
- (partial) some content exists but does not meet the depth bar
- ❌ not started
- n/a not applicable to this pair (capability is L1-specific to a single column)

## How to read this matrix

A row going across is a capability layer. A column going down is a
pair. The flagship pair (VN→EN, top-left) is where new capabilities
ship first; new pairs (Korean, Japanese, Chinese on Axis 1; Vietnamese
on Axis 2) inherit the capability shape from the flagship and add
their own L1-specific data.

A cell with ❌ is not a defect — it is a deliberate scope choice. A
new pair gets started only after the flagship reaches the §15
done-criteria (separate doc, in flight).

## Update protocol

When a PR ships a capability for a new pair OR a new capability for
an existing pair: edit this file in the same PR. Stale matrix is
worse than no matrix.
