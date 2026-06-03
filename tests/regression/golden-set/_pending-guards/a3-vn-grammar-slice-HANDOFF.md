# A3 → A1 handoff: VN grammar slice (tense/aspect, copula, word order, question formation)

**Artifact:** `a3-vn-grammar-slice-proposals.json` (same dir). 12 patterns, golden-net data shape.
**Live engine probed:** `correctWithTutorRules(input, "en")` in `src/lib/tutor/correctionEngine.ts`.
**Status:** `proposal_not_live_wired`. No engine code touched, no rules wired, no MR opened.
**Every case below was run through the UNMODIFIED engine.** `fires` = ruleId in `appliedRuleIds`; `abstains` = not.

## Coverage matrix

| Pattern | Category | Live coverage | Golden-lockable now? |
|---|---|---|---|
| TA-1a past-marker + irregular verb | tense/aspect | ✅ `en-yesterday-irregular-beginner-past` | **Yes** (4 pos fire, 3 neg abstain) |
| TA-1b past-marker + **regular** verb | tense/aspect | ❌ gap | No — needs `en-vn-past-marker-regular-verb` |
| TA-2 future bare verb (sẽ-drop) | tense/aspect | ❌ gap | No — needs `en-vn-future-marker-bare-verb` |
| TA-3 already → present perfect (rồi) | tense/aspect | ❌ gap | No — needs `en-vn-already-present-perfect` |
| CB-1 adjective copula drop (no "very") | copula | ❌ gap | No — needs `en-vn-adjective-copula-drop` |
| CB-2 locative copula drop | copula | 🟡 `en-step6-location-be-drop` (narrow) | **Yes** for the firing subset; extension targets listed |
| CB-3 progressive be-drop (đang-drop) | copula | ❌ gap | No — needs `en-vn-progressive-be-drop` |
| WO-1 adjective after noun | word order | ❌ gap | No — needs `en-vn-adjective-after-noun-order` |
| WO-2 topic-comment fronting | word order | 🟡 `en-l4-topic-comment-word-order` (3 hard-coded strings) | **Yes** (3 pos fire, 2 neg abstain) — but brittle |
| WO-3 time-adverb placement | word order | 🟡 `en-time-expression-placement` (1 string fires) | **No** — only 1 positive fires; < MIN_POSITIVE=3 |
| QF-1 yes/no missing do-support | questions | ❌ gap | No — needs `en-vn-yesno-do-support` |
| QF-2 inverted question missing "?" | questions | ✅ `en-question-form-final-mark` | **Yes** (3 pos fire, 2 neg abstain) |

## What A1 can do immediately
- **Drop-in regression locks** (copy the pattern's `positive`/`negative` into a new file under `correction-rules/`, keep the existing `expectedCorrection` strings — already verbatim from the engine): **TA-1a, CB-2 (firing subset), WO-2, QF-2.** These pass the harness today and lock current behavior against regressions.
- **Gap patterns** (TA-1b, TA-2, TA-3, CB-1, CB-3, WO-1, QF-1): positives carry `proposedCorrection` (target output), not `expectedCorrection`. They **would fail the harness** (it asserts the rule fired) until a rule is wired. Each has a `proposedRuleId` + an FP-risk note scoping a safe v1 whitelist. Treat as the authoring backlog.

## Key FP findings worth A1's attention
- **WO-2 is brittle:** the live rule matches **three exact full-sentence strings only**. `"This book I like very much"` (just +"very much") **abstains** — a real interference surface slips through. Logged as `wo2-neg-001`.
- **WO-3 fires on only one subject/verb combo** (`I yesterday went…`). `We yesterday played…` and `He yesterday ate…` abstain. Not lockable at MIN_POSITIVE=3 without broadening the rule.
- **CB-2 whitelist is tight:** fires on `at home / at school / at the office` with a pronoun subject and no trailing adverb; abstains on `the park`, `in the kitchen`, noun subjects, and a trailing `now`.
- **QF-1 ↔ QF-2 cross-link:** `en-question-form-final-mark` only adds "?" when an aux/be already fronts the clause; it never inserts do-support. `"You like coffee?"` is the do-support gap (QF-1), distinct from the punctuation fix (QF-2).
- **Co-fire candidates:** several GAP positives also expose 3rd-person -s (`She buy a car new`, `Next week she start…`). `proposedCorrection` shows the fully-correct target; A1 may want `expectedRulesFired` composition entries once rules exist.

## Report
**Done:** 12 VN→EN interference patterns across the 4 requested categories, each with ≥3 positives + ≥2 confusable negatives, FP-risk note, and per-case live-engine fires/abstains verification. 4 patterns are drop-in golden regression locks (verbatim engine output captured); 7 are scoped new-rule proposals; 1 (WO-3) flagged sub-threshold. Handed off as data-only artifact for A1 integration.
**Not done:** No rules wired, no engine code edited, no separate MR (per brief).
**Blockers:** None. WO-3 needs an engine decision (broaden rule vs. drop below strict golden dir) before it can be locked.

## A2 build-queue integration

**Base observed:** origin/main 4082b4a1de9dfa2d4b0cfa15f41c3d0219d05ba4. Handoff named 25d8535c; A2 used the fetched remote main.
**Queue policy:** active #4-through-book-a-table work stays ahead of this batch; this MR only adds the A3 future queue delta.
**Batch QA:** 12 generated, 12 QA-passed. Every pattern has 3+ positives, 2+ confusable negatives, FP-risk notes, live-engine fires/abstains markers, proposed golden candidates, and ranked placement.

| Rank after active queue | Pattern | Recommendation | Live coverage |
|---:|---|---|---|
| 1 | TA-1a-past-marker-irregular | land regression lock | already_fires |
| 2 | QF-2-question-final-mark | land regression lock | already_fires |
| 3 | CB-2-locative-copula-drop | land firing subset | partial_extend |
| 4 | WO-2-topic-comment-fronting | land exact-string lock | partial_extend |
| 5 | CB-1-adjective-copula-drop | build new guard | gap_new_rule_needed |
| 6 | QF-1-yesno-missing-do-support | build new guard | gap_new_rule_needed |
| 7 | TA-1b-past-marker-regular | build new guard | gap_new_rule_needed |
| 8 | CB-3-progressive-copula-drop | build new guard | gap_new_rule_needed |
| 9 | TA-2-future-bare-verb | build new guard | gap_new_rule_needed |
| 10 | TA-3-already-present-perfect | build new guard | gap_new_rule_needed |
| 11 | WO-1-adjective-after-noun | build new guard | gap_new_rule_needed |
| 12 | WO-3-time-adverb-placement | hold | partial_extend |

**A4/A5 collection note:** existing A4 VN rulepack slice data is already on main in `vn-l1-rulepack-slice-proposals.json`; A5 #4-through-book-a-table remains the active predecessor queue via `staged-lock-fixtures.md`. This batch does not reorder or duplicate those active items.
