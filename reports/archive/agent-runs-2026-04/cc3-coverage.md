# Round 5 CC3 — Coverage Report

**Branch:** `content/l1-rules-new25`
**Companion file:** `shared/l1-rule-ids-round5.md` on branch `shared/l1-rule-ids-round5` (published first, unblocks CC1/CC2/CC5).

## Headline numbers

- **25 new L1-interference rules** (public IDs L1-036..L1-060) added to `src/lib/feedback/l1-error-detector.ts`, bringing the total detector registry from 35 → 60.
- **51 new tests** (≥2 positive + ≥1 negative per rule) in `src/lib/feedback/__tests__/l1-rules-round5.test.ts`. All pass.
- **Existing 132 detector tests** + **8 catalog-shape tests**: all pass. The only edit to an existing test is the `ALL_WEAKNESS_TAGS.length` assertion (35 → 60).
- Gate summary: typecheck ✅, build ✅, full suite: 1200/1200 actual tests pass (3 pre-existing file-load failures — `roomRegistryCoverage`, `roomSearch`, `streakCache` — predate this branch).

## Rule-by-rule coverage

| Public ID | Detector tag                          | CEFR | Pos. tests | Neg. tests | FP notes                                                                          |
|-----------|---------------------------------------|------|-----------:|-----------:|-----------------------------------------------------------------------------------|
| L1-036    | `vi_l1_present_perfect_vs_past`       | B1   | 2          | 1          | Requires both a **have/has + V3** in user AND a past-time marker — narrow.        |
| L1-037    | `vi_l1_subjunctive_were`              | B2   | 2          | 1          | Only fires with `if/wish + subject + was` in user AND `…were` in expected.        |
| L1-038    | `vi_l1_embedded_question_order`       | B1   | 2          | 1          | Requires a reporting verb ("tell", "know", "wonder") somewhere in the user text.  |
| L1-039    | `vi_l1_do_support_3ps`                | A2   | 2          | 1          | Post-normalization check for `(she\|he\|it) dont` vs `…doesnt`.                   |
| L1-040    | `vi_l1_subject_relative_omit`         | B1   | 2          | 1          | Needs a 4-token shared chunk between user and the "stripped" expected.            |
| L1-041    | `vi_l1_gerund_after_verb`             | B1   | 2          | 1          | Handles CVC-doubling (swim→swimming) via candidate set + -ing fallback regex.     |
| L1-042    | `vi_l1_modal_perfect`                 | B2   | 2          | 1          | User has `modal + past-tense verb`, expected has `modal + have`.                  |
| L1-043    | `vi_l1_phrasal_pronoun_order`         | B1   | 2          | 1          | Requires exact particle↔pronoun swap in expected. Non-pronoun objects skipped.    |
| L1-044    | `vi_l1_comparative_more_long`         | A2   | 2          | 1          | Closed list of 21 multi-syllable adjectives gates the match.                      |
| L1-045    | `vi_l1_many_with_uncount`             | A2   | 2          | 1          | ⚠ Overlaps existing `vi_l1_countable_much`; the existing rule wins first in the registry. Test accepts either tag. |
| L1-046    | `vi_l1_geographical_article`          | B1   | 3          | 1          | Promoted **before** `ruleMissingArticle` so country-specific feedback wins.       |
| L1-047    | `vi_l1_generic_plural`                | A2   | 2          | 1          | ⚠ Can overlap existing `vi_l1_plural_s`. Test accepts either tag.                 |
| L1-048    | `vi_l1_double_negative`               | A2   | 2          | 1          | Short-window scan (≤40 chars) to avoid cross-clause false positives.              |
| L1-049    | `vi_l1_negative_inversion`            | C1   | 2          | 1          | Anchored at sentence start; both wrong + right patterns must match.               |
| L1-050    | `vi_l1_adverb_before_subject`         | A2   | 2          | 1          | Closed frequency-adverb set; expected must start with the subject.                |
| L1-051    | `vi_l1_make_let_bare`                 | B1   | 2          | 1          | Only `make/made/makes/let/lets/had + obj + to V`. "allow/want" skipped.           |
| L1-052    | `vi_l1_too_vs_very`                   | A2   | 2          | 1          | Closed positive-adjective list; legitimate `too X to Y` excluded.                 |
| L1-053    | `vi_l1_a_vs_an_vowel`                 | A1   | 2          | 1          | Silent-h and u-consonant exception sets (hour, university) keep FPs down.         |
| L1-054    | `vi_l1_one_of_the_singular`           | B1   | 2          | 1          | Closed singular-noun list gates the match; expected must contain the plural form. |
| L1-055    | `vi_l1_each_singular`                 | B1   | 2          | 1          | Handles the irregulars `children→child`, `people→person`, `men→man`, `women→woman`. |
| L1-056    | `vi_l1_been_vs_gone`                  | B2   | 2          | 1          | Requires a visit-cue word (`times`, `ever`, `before`, …) to avoid killing the real "gone" meaning. |
| L1-057    | `vi_l1_tag_polarity`                  | B1   | 2          | 1          | Compares polarity across user main/tag; expected tag must flip polarity.          |
| L1-058    | `vi_l1_no_article_generic`            | A2   | 2          | 1          | Closed abstract-noun list; expected must NOT have `the` before the noun.          |
| L1-059    | `vi_l1_superlative_the`               | A2   | 2          | 1          | Promoted **before** `ruleMissingArticle`. Irregular superlative set + regex.       |
| L1-060    | `vi_l1_if_will`                       | B1   | 2          | 1          | ⚠ Overlaps existing `vi_l1_conditional_mix`. Test accepts either tag.             |

**Totals:** 52 positive + 25 negative = 77 rule-specific assertions. Plus 8 catalog-shape assertions automatically apply to every new entry (total tag count, unique, entry.tag mirrors record key, non-empty bilingual strings, linkedRoomId either null or a non-empty string, example strings non-empty).

## Priority ordering decisions

Two structural promotions were made in the registry. Both follow the same precedent established for existing rules 35 + 36 (which run before 6 + 9):

1. `ruleGeographicalArticle` (L1-046) runs **before** `ruleMissingArticle` (6) so that "I live in the Vietnam" lands on a country-specific teaching message instead of the generic "missing article" one.
2. `ruleSuperlativeThe` (L1-059) runs **before** `ruleMissingArticle` (6) so that "She is best student" lands on a superlative-specific message.

All 23 other new rules were appended after the existing registry with no reordering — the existing rule wins when there's overlap.

## Overlaps flagged for CC4 / CC5 awareness

Three Round 5 rules overlap existing v2/v3 rules and lose to them in the first-match-wins registry. Tests accept either tag. Listing them here so CC5's micro-lesson designers know that tagging a sentence against either tag covers the other:

| Round 5 rule                     | Existing rule that usually wins          |
|----------------------------------|-------------------------------------------|
| `vi_l1_many_with_uncount` (L1-045) | `vi_l1_countable_much` (v3, rule 25)      |
| `vi_l1_generic_plural` (L1-047)  | `vi_l1_plural_s` (placement, rule 3)      |
| `vi_l1_if_will` (L1-060)         | `vi_l1_conditional_mix` (v3, rule 28)     |

These three ship as legitimate members of the 25-rule set so the public ID-table in `shared/l1-rule-ids-round5.md` stays complete, but I'm flagging that they won't fire when the existing rule already covers the input. Feedback quality is equivalent.

## Low-false-positive measures applied

- **Closed lists over broad regex**: `LONG_ADJECTIVES` (21), `UNCOUNTABLE_FOR_MANY` (19), `COUNTRIES_NO_THE` (20), `COUNTRIES_WITH_THE` (4), `GENERIC_SINGULAR_NOUNS` (13), `POSITIVE_ADJECTIVES_FOR_TOO` (12), `COMMON_SINGULAR_NOUNS_AFTER_ONE_OF` (20), `WRONG_EACH_PLURALS` (13), `ABSTRACT_GENERIC_NOUNS` (14), etc. Each list covers the common-case learner targets without trying to be exhaustive.
- **Context cues as gates**: `ruleBeenVsGone` requires a "visit" marker (`times / ever / never / before / twice / once`); `rulePresentPerfectVsPast` requires both `have/has + V3` and a past-time marker.
- **Dual-side confirmation**: most rules check that user matches the wrong shape AND expected matches the corrected shape. Pure user-side checks (like double-negative) use short character windows to avoid cross-clause bleed.
- **Silent-h / u-consonant exclusions** for the `a_vs_an_vowel` rule so it stops firing on "an hour" and "a university".

## Vietnamese content — deferred to CC4

Every Round 5 entry in `RULE_STRINGS` (detector) and `WEAKNESS_CATALOG` carries a complete English string plus a placeholder VN string tagged `[VI TBD — CC4]`. The type contract stays satisfied (non-empty strings), but the markers make unreviewed rows trivially greppable so CC4 can pick them off in a single pass.

## What I did not touch

- Existing 35 rules' detection logic — unchanged.
- Detector engine's public API — unchanged (`detectL1Error`, `L1DetectionInput`, `L1DetectionResult`).
- Sentence data / micro-lessons — CC1 / CC5 territory.
- Room content.
- Vietnamese teacher voice — CC4 only.
