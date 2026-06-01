# RECON — Negative-Coverage Strength Audit (golden fixtures)

Author: Agent B4. Date: 2026-05-31. Base: `origin/main` (latest fetch).
Scope: **diagnostic RECON only — no fixture edits this pass.** Each fixture's `negative[]` is scored against the rule's *realistic* false-positive surface. Thin fixtures get targeted, empirically-verified hardening dispatches afterward (no padding).

> Scoring is a judgment heuristic against the confusable categories below; the hardening pass for each thin fixture must re-confirm every proposed negative on the live engine before locking.

## Confusable categories (the FP surface)

`C` comitative/instrumental vs targeted sense · `O` intervening object between trigger tokens · `Q` question / wh- form · `V` different-verb / different-lemma near-miss · `P` parenthetical / comma-separated trigger · `A` anchor near-miss (one token changed) · plus rule-specific: already-correct, sense/class discrimination, temporal blocker, first-person, determiner class.

**Benchmark:** `calque-say-with-person.json` — 12 negatives spanning C, O, Q, V, P and absolute constructions. That breadth = STRONG.

## Scoring key

- **STRONG** — covers most applicable categories incl. the hard ones (O, Q, V/A); typically ≥6 well-differentiated negatives.
- **ADEQUATE** — covers the rule's core FP surface; missing 1 lower-risk category, or rule-level covered across a sibling file.
- **THIN** — at the `negative` floor (3) with a *realistic* category missing, or narrow to a single category.

## Results

| Fixture | Rule | negs | Score | Missing / note |
| --- | --- | --- | --- | --- |
| `calque-borrow-me-object.json` | `en-calque-borrow-me-object` | 18 | **STRONG** | C/O/Q/V/A + conjugation + coordination + subordinate |
| `calque-say-with-person.json` | `en-calque-say-with-person` | 12 | **STRONG** | benchmark |
| `topic-comment.json` | `en-l4-topic-comment-word-order` | 12 | **STRONG** | valid-emphasis/conditional/adverbial/Q/quoted/PP/subordinate |
| `has-past-time-marker.json` | `en-yesterday-irregular-beginner-past` | 11 | **STRONG** | future/conditional/idiom/possessive/habitual/Q/negation |
| `look-at-pronoun.json` | `en-step6-look-at-pronoun` | 6 | **STRONG** | phrasal-particle near-misses (for/like/up/over) + adjective |
| `time-expression-placement.json` | `en-time-expression-placement` | 6 | **STRONG** | already-correct/fronting/V-frame/noun-subj/freq/A |
| `profession-article.json` | `en-step6-profession-article` | 5 | **STRONG** | plural/definite/possessive-determiner/already-correct/adj |
| `be-verb-omission.json` | `en-be-verb-omission` | 6 | ADEQUATE | has Q + lemma near-miss + already-correct; add O |
| `location-be-drop.json` | `en-step6-location-be-drop` | 6 | ADEQUATE | Q + V + already-correct; add A near-miss |
| `calque-open-appliance.json` | `en-calque-open-turn-on-appliance` | 7 | ADEQUATE | class-discrimination + already-correct; missing Q, O |
| `possessive-s.json` | `en-step6-possessive-s` | 5 | ADEQUATE | compound/plural-poss/no-poss; missing Q |
| `calque-take-medicine.json` | `en-calque-take-medicine` | 5 | ADEQUATE | already-correct + V + context; missing Q, O |
| `at-clock-time.json` | `en-step6-at-clock-time` | 4 | ADEQUATE | duration vs clock + already-correct; missing Q |
| `enter-concrete-place.json` | `en-step6-enter-concrete-place` | 4 | ADEQUATE | abstract-vs-concrete + V + already-correct; missing Q |
| `in-month-year.json` | `en-step6-in-month-year` | 4 | ADEQUATE | year-as-quantity + already-correct + month-subj; missing Q |
| `listen-to-object.json` | `en-step6-listen-to-object` | 4 | ADEQUATE | already-correct + intransitive + V; missing Q, O |
| `missing-singular-article.json` | `en-l4-missing-singular-article` | 4 | ADEQUATE | already-correct + uncountable + non-noun; missing proper-noun, plural |
| `location-be-vs-adjective-be.json` | `en-step6-location-be-drop` | 4 | ADEQUATE | adjective-vs-location sense + Q (sibling of location-be-drop) |
| `past-marker-recall.json` | `en-step6-past-marker-recall` | 4 | ADEQUATE | unrecognized-marker/habitual/already-past/reported; missing Q |
| `step5-subject-verb-agreement.json` | `en-step5-subject-verb-agreement` | 4 | ADEQUATE | already-correct/temporal/Q/first-person |
| `calque-close-appliance.json` | `en-calque-close-turn-off-appliance` | 6 | ADEQUATE | class-discrimination + already-correct + A; missing Q, O |
| `negation-guard.json` | `en-yesterday-irregular-beginner-past` | 3 | ADEQUATE | purpose-built (negation guard); broad surface in `has-past-time-marker.json` |
| `question-protection.json` | `en-step6-look-at-pronoun` | 3 | ADEQUATE | purpose-built Q protection; sibling of `look-at-pronoun.json` |
| `rule-composition.json` | `en-step5-preposition-pattern` | 3 | ADEQUATE | composition; carries the `school festival` O/near-miss |
| `calque-close-turn-off-appliance.json` | `en-calque-close-turn-off-appliance` | 5 | ADEQUATE | narrow (non-appliance objects only); rule covered by `calque-close-appliance.json` — consolidation candidate |
| `calque-open-turn-on-appliance.json` | `en-calque-open-turn-on-appliance` | 5 | ADEQUATE | narrow (non-appliance objects only); rule covered by `calque-open-appliance.json` — consolidation candidate |
| `discuss-about.json` | `en-step6-discuss-about` | 3 | **THIN** | missing **Q/wh** ("what did you discuss about?"), **O** (intervening object) |
| `go-to-school.json` | `en-step5-preposition-pattern` | 3 | **THIN** | all already-correct; missing **O/noun-modifier** ("go to the school festival" — only in sibling), **Q**, **V** |
| `marry-with.json` | `en-step6-marry-with` | 3 | **THIN** | missing **Q/wh** ("who did she marry with?"); at floor — add comitative-sense variety |
| `quantity-plural-s.json` | `en-l4-quantity-plural-s` | 3 | **THIN** | missing **A/irregular-plural** near-miss, **Q**, broader quantifier (many/few) coverage |
| `question-form-final-mark.json` | `en-question-form-final-mark` | 3 | **THIN** | missing **A/declarative-wh** ("What you said is true"), **embedded question** ("I wonder what time it is") |
| `third-person-daily-go-eat-have.json` | `en-third-person-daily-go-eat-have` | 3 | **THIN** | missing **Q** ("does she eat every day?") |
| `third-person-school-routine.json` | `en-third-person-school-routine` | 3 | **THIN** | missing **Q** ("does he go to school?") |

## Summary

| | Count |
| --- | --- |
| Fixtures scored | 33 (covering 28 rules; some rules span 2 files) |
| STRONG | 7 |
| ADEQUATE | 19 |
| **THIN** | **7** |

## Thin fixtures → hardening dispatch candidates

1. `discuss-about.json` — add Q/wh + intervening-object negatives.
2. `go-to-school.json` — add noun-postmodifier near-miss, Q, different-verb (or consolidate with `rule-composition.json`).
3. `marry-with.json` — add Q/wh + a second comitative-sense near-miss.
4. `quantity-plural-s.json` — add irregular-plural near-miss + Q + many/few quantifier.
5. `question-form-final-mark.json` — add declarative-wh near-miss + embedded-question.
6. `third-person-daily-go-eat-have.json` — add Q form.
7. `third-person-school-routine.json` — add Q form.

Each hardening pass is a separate MR: **probe every proposed negative on the live engine first**; if the engine false-positives on a proposed "negative," that is a Lane A finding (document, do not fix, do not drop the case to force green) per `golden-net-harness.md`. **No padding** — variants of the same literal do not count as new coverage.
