# MercyBlade Pair Matrix

> **Source of truth:** which capabilities exist for which learning
> pairs, today. Updated when a capability ships for a new pair, when
> a new pair joins the committed set, or when a capability is
> retired.
>
> **Read order:** STRATEGY.md §1, §3, §4 first (defines the axes and
> committed pairs), then this file (shows current state).
>
> **Last updated:** 2026-05-25

## Axis 1 — Vietnamese learners studying [target]

| Capability                              | English (flagship)                                      | Japanese  | Korean    | Chinese   |
|-----------------------------------------|---------------------------------------------------------|-----------|-----------|-----------|
| L1 Profile (`src/lib/l1-profiles/`)     | ✅ `vi.ts`                                              | ❌        | ❌        | ❌        |
| Grammar taxonomy (`docs/l1-taxonomies/`) | ✅ `vi-grammar.md` (15 families, 180 examples)         | ❌        | ❌        | ❌        |
| Writing taxonomy                        | ✅ `vi-writing.md` (12 patterns, 169 examples)          | ❌        | ❌        | ❌        |
| Phoneme gap audit                       | ✅ `vn-phoneme-gaps.md` (6 audit categories)            | ❌        | ❌        | ❌        |
| L1 interference atlas                   | ✅ `vnL1Interference.ts` (37 patterns)                  | ❌        | ❌        | ❌        |
| Detector rules                          | ✅ `l1-error-detector.ts` (60 rules, 52/52 eval pass)   | ❌        | ❌        | ❌        |
| AI Tutor L1 prompt wire                 | ✅ `promptAssembly.ts` ← `viL1Profile.interference` (PR #1131) | ❌  | ❌        | ❌        |
| Placement test                          | ✅ existing                                             | ❌        | ❌        | ❌        |
| Eval harness                            | ✅ 52/52 baseline                                       | ❌        | ❌        | ❌        |
| Pronunciation coaching                  | (partial — phoneme map + scorer + drill cards exist)    | ❌        | ❌        | ❌        |
| Course content (rooms / lessons)        | ✅ 486 bilingual rooms                                  | (partial) | (partial) | (partial) |

## Axis 2 — English speakers studying [target]

| Capability                              | Vietnamese | Japanese  | Korean    | Chinese   |
|-----------------------------------------|------------|-----------|-----------|-----------|
| L1 Profile                              | ❌         | ❌        | ❌        | ❌        |
| Grammar taxonomy                        | ❌         | ❌        | ❌        | ❌        |
| Writing taxonomy                        | ❌         | ❌        | ❌        | ❌        |
| Detector rules                          | ❌         | ❌        | ❌        | ❌        |
| AI Tutor L1 prompt wire                 | ❌         | ❌        | ❌        | ❌        |
| Placement test                          | ❌         | ❌        | ❌        | ❌        |
| Eval harness                            | ❌         | ❌        | ❌        | ❌        |
| Course content (rooms / lessons)        | (partial)  | (partial) | (partial) | (partial) |

## Legend

- ✅ shipped, on `origin/main`
- 🚧 PR in flight
- (partial) some content exists but does not meet the depth bar
- ❌ not started

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
