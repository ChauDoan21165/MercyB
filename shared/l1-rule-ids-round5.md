# L1 Rule IDs — Round 5 (CC3)

**Published:** 2026-04-24 by CC3.
**Source branch:** `shared/l1-rule-ids-round5` (this branch).
**Implementation branch:** `content/l1-rules-new25` (CC3's PR into `main`).

## Purpose

This file is the **coordination contract** between CC3 (detection +
tests) and CC1 (sentence tagging), CC2 (UI / sentence surfaces),
CC4 (Vietnamese content), and CC5 (micro-lessons).

- CC3 ships each rule's **detection logic + test coverage + English
  placeholder strings** in its implementation PR.
- CC4 backfills **`name_vi`, `explanation_vi`, `example_wrong_vi_gloss`**
  for every rule (existing 35 + these new 25 = 60 total) in a
  separate PR. Do **not** wait for CC4 to start tagging — the
  IDs and the English examples are stable now.
- CC1 / CC2 tag their sentences against the `vi_l1_*` detector
  tag (that's the string the detector emits and the analytics
  pipeline stores). The `L1-036`..`L1-060` column is for
  cross-team conversation and release notes only.
- CC5 references `vi_l1_*` tags in
  `micro_lesson.target_l1_rule_ids[]`.

## ID ↔ detector-tag mapping

| Public ID  | Detector tag (`L1WeaknessTag`)      | CEFR | Short name                                        | Wrong → Right (illustrative)                                             |
|------------|-------------------------------------|------|---------------------------------------------------|---------------------------------------------------------------------------|
| L1-036     | `vi_l1_present_perfect_vs_past`     | B1   | Present perfect vs simple past                    | "I **have eaten** it yesterday" → "I **ate** it yesterday"                |
| L1-037     | `vi_l1_subjunctive_were`            | B2   | Subjunctive *were* after *if / wish*              | "If I **was** you" → "If I **were** you"                                  |
| L1-038     | `vi_l1_embedded_question_order`     | B1   | Embedded-question word order                      | "I don't know what **is this**" → "...what **this is**"                   |
| L1-039     | `vi_l1_do_support_3ps`              | A2   | 3rd-person *don't* vs *doesn't*                   | "She **don't** know" → "She **doesn't** know"                             |
| L1-040     | `vi_l1_subject_relative_omit`       | B1   | Missing subject relative pronoun                  | "The man came yesterday is my uncle" → "The man **who** came..."          |
| L1-041     | `vi_l1_gerund_after_verb`           | B1   | Gerund required after *enjoy / avoid / finish*    | "I enjoy **to swim**" → "I enjoy **swimming**"                            |
| L1-042     | `vi_l1_modal_perfect`               | B2   | *modal + have + past participle*                  | "I should **did** it" → "I should **have done** it"                       |
| L1-043     | `vi_l1_phrasal_pronoun_order`       | B1   | Pronoun must split separable phrasal verb         | "I picked up **him**" → "I picked **him** up"                             |
| L1-044     | `vi_l1_comparative_more_long`       | A2   | *more + adj* for 2+ syllables                     | "more **beautifuler**" / "**beautifuler**" → "**more beautiful**"         |
| L1-045     | `vi_l1_many_with_uncount`           | A2   | *many* with uncountable → *much*                  | "**many** water" → "**much** water"                                       |
| L1-046     | `vi_l1_geographical_article`        | B1   | Wrong article on country names                    | "I live in **the** Vietnam" → "I live in Vietnam"                         |
| L1-047     | `vi_l1_generic_plural`              | A2   | Bare singular for generic statement               | "I like **dog**" → "I like **dogs**"                                      |
| L1-048     | `vi_l1_double_negative`             | A2   | Double negative                                   | "I don't have **no** money" → "I don't have **any** money"                |
| L1-049     | `vi_l1_negative_inversion`          | C1   | Inversion after fronted negative adverbial        | "Never I have seen..." → "**Never have I** seen..."                       |
| L1-050     | `vi_l1_adverb_before_subject`       | A2   | Frequency adverb placed before the subject        | "**Always I** go" → "I **always** go"                                     |
| L1-051     | `vi_l1_make_let_bare`               | B1   | *make / let + object + bare verb*                 | "She made me **to cry**" → "She made me **cry**"                          |
| L1-052     | `vi_l1_too_vs_very`                 | A2   | *too* (excessive) vs *very* (neutral intensifier) | "I am **too** happy to see you" → "I am **very** happy to see you"        |
| L1-053     | `vi_l1_a_vs_an_vowel`               | A1   | *a* / *an* by vowel sound                         | "**a** apple" → "**an** apple"                                            |
| L1-054     | `vi_l1_one_of_the_singular`         | B1   | *one of the + plural noun*                        | "One of the **student**" → "One of the **students**"                      |
| L1-055     | `vi_l1_each_singular`               | B1   | *each + singular noun + singular verb*            | "Each **students** are** → "Each **student is**"                          |
| L1-056     | `vi_l1_been_vs_gone`                | B2   | *been to* (visited) vs *gone to* (still there)    | "He has **gone** to Paris three times" → "He has **been** to Paris..."    |
| L1-057     | `vi_l1_tag_polarity`                | B1   | Tag question polarity opposite of main clause     | "You like it, **do you**?" → "You like it, **don't you**?"                |
| L1-058     | `vi_l1_no_article_generic`          | A2   | No *the* with generic abstract / plural noun      | "**The** life is hard" → "Life is hard"                                   |
| L1-059     | `vi_l1_superlative_the`             | A2   | *the* required before superlatives                | "She is **best** student" → "She is **the best** student"                 |
| L1-060     | `vi_l1_if_will`                     | B1   | No *will* in the *if*-clause of 1st conditional   | "If I **will go**, I will tell you" → "If I **go**, I will tell you"      |

## CEFR distribution

| Level | Count | IDs                                                              |
|-------|-------|------------------------------------------------------------------|
| A1    | 1     | L1-053                                                           |
| A2    | 9     | L1-039, 044, 045, 047, 048, 050, 052, 058, 059                   |
| B1    | 11    | L1-036, 038, 040, 041, 043, 046, 051, 054, 055, 057, 060         |
| B2    | 3     | L1-037, 042, 056                                                 |
| C1    | 1     | L1-049                                                           |
| **Total** | **25** |                                                             |

## Detection notes (shared with consumers, not user-facing)

- **Low-false-positive bias is non-negotiable.** A false positive
  annoys a real learner; a false negative is invisible. Every rule
  in this set includes both positive and negative test cases in the
  CC3 implementation.
- **First-match-wins registry.** Rules are ordered by specificity.
  More specific structural patterns fire before generic usage rules.
  Ordering is CC3's responsibility; don't re-order without asking.
- **Vietnamese content is CC4's territory.** Every detector string
  has an `{EN}` placeholder template that CC3 ships. CC4 writes the
  matching `vi` string in a later PR.

## Merge order

1. **CC3** (this branch's implementation PR → `main`)
2. **CC4** (Vietnamese content for all 60 rules, depends on CC3's tag
   names being stable)
3. **CC1 / CC2** (sentence tagging — can start immediately once
   CC3 merges; `vi_l1_*` names are what they reference)
4. **CC5** (micro-lessons — references tag names in
   `target_l1_rule_ids[]`; safe to start drafting now using this file
   as the reference)
