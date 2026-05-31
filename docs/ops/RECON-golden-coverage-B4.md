# RECON — Golden Coverage Gap Audit (en-* correction rules)

Author: Agent B4. Date: 2026-05-31. Base: `origin/main` @ `f7c2ca859`.
Scope: **backward-looking backfill audit of pre-existing gaps only.** Forward monitoring of new Lane A merges is B1's queue — not covered here, not touched.

> RECON only. **No fixtures authored.** Each gap below is a dispatch candidate for per-rule verification/spec **after review** (every fixture must be probed against the live engine first, per the empirical discipline).

## Method

- **Shipped rules** enumerated read-only from the rule registry `src/lib/tutor/correctionRules/en.ts` (every `id: "en-…"`). No `src/lib/tutor` edits.
- **Coverage matched by `ruleId`, not filename** — each fixture JSON in `tests/regression/golden-set/correction-rules/` was parsed and bucketed by its `ruleId` field. A rule counts as covered if any fixture's `ruleId` equals it (a fixture's filename may differ from its rule).

## Summary

| Metric | Count |
| --- | --- |
| Shipped `en-*` rules | **30** |
| Covered by ≥1 golden fixture | **27** |
| **Uncovered (gaps)** | **3** |
| Orphan fixtures (`ruleId` not in `en.ts`) | 0 |
| Total fixture files | 33 (some rules have >1 file) |

## Coverage table (shipped rule → fixture present? → file)

| Rule ID | Fixture? | Fixture file(s) |
| --- | --- | --- |
| `en-be-verb-omission` | ✅ | `be-verb-omission.json` |
| `en-calque-close-turn-off-appliance` | ✅ | `calque-close-appliance.json`<br>`calque-close-turn-off-appliance.json` |
| `en-calque-open-turn-on-appliance` | ✅ | `calque-open-appliance.json`<br>`calque-open-turn-on-appliance.json` |
| `en-calque-say-with-person` | ✅ | `calque-say-with-person.json` |
| `en-calque-take-medicine` | ✅ | `calque-take-medicine.json` |
| `en-hat-biking-summer-runon` | ❌ **GAP** | — |
| `en-l4-missing-singular-article` | ✅ | `missing-singular-article.json` |
| `en-l4-quantity-plural-s` | ✅ | `quantity-plural-s.json` |
| `en-l4-topic-comment-word-order` | ✅ | `topic-comment.json` |
| `en-morning-routine-subject-carryover` | ❌ **GAP** | — |
| `en-question-form-final-mark` | ✅ | `question-form-final-mark.json` |
| `en-runon-morning-routine-punctuation` | ❌ **GAP** | — |
| `en-step5-preposition-pattern` | ✅ | `go-to-school.json`<br>`rule-composition.json` |
| `en-step5-subject-verb-agreement` | ✅ | `step5-subject-verb-agreement.json` |
| `en-step6-at-clock-time` | ✅ | `at-clock-time.json` |
| `en-step6-discuss-about` | ✅ | `discuss-about.json` |
| `en-step6-enter-concrete-place` | ✅ | `enter-concrete-place.json` |
| `en-step6-in-month-year` | ✅ | `in-month-year.json` |
| `en-step6-listen-to-object` | ✅ | `listen-to-object.json` |
| `en-step6-location-be-drop` | ✅ | `location-be-drop.json`<br>`location-be-vs-adjective-be.json` |
| `en-step6-look-at-pronoun` | ✅ | `look-at-pronoun.json`<br>`question-protection.json` |
| `en-step6-marry-with` | ✅ | `marry-with.json` |
| `en-step6-past-marker-recall` | ✅ | `past-marker-recall.json` |
| `en-step6-possessive-s` | ✅ | `possessive-s.json` |
| `en-step6-profession-article` | ✅ | `profession-article.json` |
| `en-step6-wait-for-person-object` | ✅ | `wait-for-person-object.json` |
| `en-third-person-daily-go-eat-have` | ✅ | `third-person-daily-go-eat-have.json` |
| `en-third-person-school-routine` | ✅ | `third-person-school-routine.json` |
| `en-time-expression-placement` | ✅ | `time-expression-placement.json` |
| `en-yesterday-irregular-beginner-past` | ✅ | `has-past-time-marker.json`<br>`negation-guard.json` |

## Gaps (uncovered shipped rules)

| Rule ID | Shape | Recommendation |
| --- | --- | --- |
| `en-hat-biking-summer-runon` | Exact-match one-off (single hardcoded run-on sentence) | Low value: a golden would lock one literal string. Author only if the run-on family is generalized. |
| `en-morning-routine-subject-carryover` | Exact-match one-off (single hardcoded sentence) | Same — exact-match; minimal regression value at current scope. |
| `en-runon-morning-routine-punctuation` | Exact-match one-off (single hardcoded run-on) | Same — exact-match; minimal regression value at current scope. |

**Note for review:** all three gaps are the **exact-match one-off** rules (each `detects` is a single anchored literal sentence). They were previously assessed as "not worth a schema-as-contract fixture" during the Batch 3A dispatch. They are listed here for completeness as the *only* remaining backfill gaps — the decision to fixture them (e.g. a minimal 1-positive + 1-negation-variant lock) or to formally defer is the reviewer's call. No other shipped rule is uncovered.

## Golden-net schema note (per the !289 catch)

Single-rule fixtures use **`expectedRuleFired`** (singular: a logical/rule-id string on positives, `null` on negatives). **`expectedRulesFired[]`** is **composition-only** — the harness validator requires **≥2** rule-id strings (a single-element array fails validation), so it must not be used for a one-rule fixture.

> No standalone "golden-net" doc exists under `docs/` today (only `docs/ops/be-drop-composition-deferred.md` references these fields, and it is topic-specific). This schema note is recorded here in the RECON doc; if B1 maintains a canonical golden-net/harness doc, the one-liner should be relocated there.
