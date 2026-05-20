# A3 Remaining Findings Triage

Timestamp: 2026-05-20T14:05:00Z

Evidence sources:

- `docs/placement-v3/data-quality/raw-runs/a3-20260520T133236-taxonomy-consistency.json`
- `docs/placement-v3/data-quality/raw-runs/a3-20260520T133158-prompt-rubric-alignment.json`
- `docs/placement-v3/data-quality/raw-runs/a3-20260520T133158-recommendation-graph.json`
- `docs/placement-v3/data-quality/raw-runs/a3-20260520T133158-corpus-integrity.json`

## Current Counts

- Corpus integrity: 0 issues.
- Taxonomy consistency: 96 findings: 48 missing remediation links, 48 unused taxonomy categories.
- Recommendation graph: 0 warnings.
- Prompt/rubric alignment: 6 warnings.

## Category Classification

| Finding category | Count | Classification | Release impact | Reason |
| --- | ---: | --- | --- | --- |
| `missing_remediation_link` | 48 | Needs expert linguistic review | Not a blocker for audit tooling merge; should block broad learner-facing remediation automation until reviewed | The catalog allows null links, and mapping a taxonomy pattern to a room is a content decision. A wrong room can mis-teach the learner. |
| `unused_taxonomy_category` for legacy `vi_l1_*` tags | 47 | Safe / informational, with expert-review follow-up | Not a blocker for internal enablement | These tags are defined but not referenced by audited placement or V3 recommendation surfaces. They may be detector-only, future roadmap coverage, or stale. Removing or wiring them requires ownership review. |
| `unused_taxonomy_category` for `negation-no-not-placement` | 1 | Needs expert linguistic review | Not a blocker for internal enablement | This is a V3 L1 ID present in the known taxonomy set but not referenced by prompts/calibration. It may be planned coverage or stale metadata. |
| `orphaned_rubric_reference` for conversation prompts | 6 | Needs expert linguistic review | Not a blocker for writing/speaking/reading/listening audits; should block production claims for conversation calibration | Creating calibration entries requires real expected learner responses and rubric expectations. |
| Recommendation graph | 0 | Safe / passing | No release blocker from current graph audit | The prior `vi_l1_final_consonants` warning was resolved as an audit false positive. |
| Corpus integrity | 0 | Safe / passing | No release blocker from current corpus audit | No duplicate prompts, near duplicates, malformed calibration entries, missing CEFR labels, invalid modality mappings, invalid taxonomy references, or malformed schema findings remain. |

## Safe / Informational Findings

The following 47 legacy taxonomy IDs are informational for this PR because the audit found no invalid references. They remain unused by audited placement or V3 recommendation surfaces and should be reviewed before deletion, because unused does not prove incorrect:

`vi_l1_possessive_gender`, `vi_l1_countable`, `vi_l1_to_verb_confusion`, `vi_l1_can_no_infinitive`, `vi_l1_double_past`, `vi_l1_possessive_s_missing`, `vi_l1_comparative_double`, `vi_l1_adjective_order`, `vi_l1_very_much_placement`, `vi_l1_there_are_singular`, `vi_l1_everyone_plural`, `vi_l1_make_vs_do`, `vi_l1_tag_question`, `vi_l1_past_perfect_missing`, `vi_l1_reported_speech`, `vi_l1_since_vs_for`, `vi_l1_countable_much`, `vi_l1_some_vs_any`, `vi_l1_reflexive_missing`, `vi_l1_to_infinitive_after_ing`, `vi_l1_relative_pronoun`, `vi_l1_used_to_vs_be_used_to`, `vi_l1_another_vs_other`, `vi_l1_look_vs_see_vs_watch`, `vi_l1_by_vs_with`, `vi_l1_time_expressions`, `vi_l1_present_perfect_vs_past`, `vi_l1_embedded_question_order`, `vi_l1_do_support_3ps`, `vi_l1_subject_relative_omit`, `vi_l1_gerund_after_verb`, `vi_l1_modal_perfect`, `vi_l1_phrasal_pronoun_order`, `vi_l1_comparative_more_long`, `vi_l1_many_with_uncount`, `vi_l1_generic_plural`, `vi_l1_double_negative`, `vi_l1_negative_inversion`, `vi_l1_adverb_before_subject`, `vi_l1_make_let_bare`, `vi_l1_too_vs_very`, `vi_l1_one_of_the_singular`, `vi_l1_each_singular`, `vi_l1_been_vs_gone`, `vi_l1_tag_polarity`, `vi_l1_superlative_the`, `vi_l1_if_will`.

## Needs Expert Linguistic Review

The following 48 taxonomy IDs have no remediation room link:

`vi_l1_missing_article`, `vi_l1_preposition_transfer`, `vi_l1_countable`, `vi_l1_possessive_s_missing`, `vi_l1_comparative_double`, `vi_l1_very_much_placement`, `vi_l1_make_vs_do`, `vi_l1_tag_question`, `vi_l1_past_perfect_missing`, `vi_l1_reported_speech`, `vi_l1_since_vs_for`, `vi_l1_countable_much`, `vi_l1_some_vs_any`, `vi_l1_reflexive_missing`, `vi_l1_conditional_mix`, `vi_l1_to_infinitive_after_ing`, `vi_l1_passive_missing_be`, `vi_l1_relative_pronoun`, `vi_l1_used_to_vs_be_used_to`, `vi_l1_another_vs_other`, `vi_l1_look_vs_see_vs_watch`, `vi_l1_by_vs_with`, `vi_l1_time_expressions`, `vi_l1_present_perfect_vs_past`, `vi_l1_subjunctive_were`, `vi_l1_embedded_question_order`, `vi_l1_do_support_3ps`, `vi_l1_subject_relative_omit`, `vi_l1_gerund_after_verb`, `vi_l1_modal_perfect`, `vi_l1_phrasal_pronoun_order`, `vi_l1_comparative_more_long`, `vi_l1_many_with_uncount`, `vi_l1_geographical_article`, `vi_l1_generic_plural`, `vi_l1_double_negative`, `vi_l1_negative_inversion`, `vi_l1_adverb_before_subject`, `vi_l1_make_let_bare`, `vi_l1_too_vs_very`, `vi_l1_a_vs_an_vowel`, `vi_l1_one_of_the_singular`, `vi_l1_each_singular`, `vi_l1_been_vs_gone`, `vi_l1_tag_polarity`, `vi_l1_no_article_generic`, `vi_l1_superlative_the`, `vi_l1_if_will`.

The V3 ID `negation-no-not-placement` is also expert-review work because it is present in the known V3 L1 ID set but unused by prompts/calibration.

The following conversation prompt IDs have no calibration entries:

`a1-c-mercy-greeting`, `a2-c-weekend-chat`, `b1-c-study-plan`, `b2-c-opinion-followup`, `c1-c-polished-disagreement`, `c2-c-identity-debate`.

## Release Blockers

No remaining finding is a blocker for merging the A3 audit infrastructure as a draft/internal data-quality PR.

These should block a production-safe data-quality claim:

- 48 missing remediation links.
- 6 conversation prompts without calibration entries.
- unresolved ownership of unused taxonomy IDs.

These should block broad automated remediation rollout:

- any missing remediation link that can be surfaced directly to learners as a recommended room.

## Audit False Positives

None remain in the current raw output.

Previously resolved false positives:

- `vi_l1_final_consonants` recommendation warning.
- 10 unused-taxonomy findings that were actually used by V3 lesson-index or recommender coverage.

## Intentional Design

- `linkedRoomId: null` is currently allowed by the weakness catalog. The audit flags it because operational remediation may need a target, not because the schema is malformed.
- Runtime V3 files under `src/data/placement/v3/` are the audited source. The docs-only folders named in the original A3 brief remain absent.

## Recommended Next Action

Merge only if reviewers accept this as audit infrastructure plus evidence. Keep the PR draft until Chau reviews whether missing remediation links and conversation calibration gaps are acceptable for internal-only enablement.
