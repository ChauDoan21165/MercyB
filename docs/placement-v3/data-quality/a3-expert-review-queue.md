# A3 Expert Review Queue

Timestamp: 2026-05-20T14:05:00Z

This queue contains only unresolved findings that require content ownership or linguistic judgment. No IDs in this document were mechanically rewritten.

## Remediation-Link Review

Issue summary: 48 taxonomy IDs have `linkedRoomId: null`.

Why expert review is needed: assigning a room requires deciding whether an existing lesson actually teaches the target Vietnamese-L1 interference pattern. A partial keyword match is not enough evidence.

Question for reviewer: Should this taxonomy ID remain detector-only, map to an existing remediation room, or wait for a new room?

Release impact: not a blocker for A3 tooling merge; should block production claims around automated post-placement remediation for these IDs.

IDs:

`vi_l1_missing_article`, `vi_l1_preposition_transfer`, `vi_l1_countable`, `vi_l1_possessive_s_missing`, `vi_l1_comparative_double`, `vi_l1_very_much_placement`, `vi_l1_make_vs_do`, `vi_l1_tag_question`, `vi_l1_past_perfect_missing`, `vi_l1_reported_speech`, `vi_l1_since_vs_for`, `vi_l1_countable_much`, `vi_l1_some_vs_any`, `vi_l1_reflexive_missing`, `vi_l1_conditional_mix`, `vi_l1_to_infinitive_after_ing`, `vi_l1_passive_missing_be`, `vi_l1_relative_pronoun`, `vi_l1_used_to_vs_be_used_to`, `vi_l1_another_vs_other`, `vi_l1_look_vs_see_vs_watch`, `vi_l1_by_vs_with`, `vi_l1_time_expressions`, `vi_l1_present_perfect_vs_past`, `vi_l1_subjunctive_were`, `vi_l1_embedded_question_order`, `vi_l1_do_support_3ps`, `vi_l1_subject_relative_omit`, `vi_l1_gerund_after_verb`, `vi_l1_modal_perfect`, `vi_l1_phrasal_pronoun_order`, `vi_l1_comparative_more_long`, `vi_l1_many_with_uncount`, `vi_l1_geographical_article`, `vi_l1_generic_plural`, `vi_l1_double_negative`, `vi_l1_negative_inversion`, `vi_l1_adverb_before_subject`, `vi_l1_make_let_bare`, `vi_l1_too_vs_very`, `vi_l1_a_vs_an_vowel`, `vi_l1_one_of_the_singular`, `vi_l1_each_singular`, `vi_l1_been_vs_gone`, `vi_l1_tag_polarity`, `vi_l1_no_article_generic`, `vi_l1_superlative_the`, `vi_l1_if_will`.

## Unused Legacy Taxonomy Review

Issue summary: 47 legacy taxonomy IDs are not referenced by audited placement or V3 recommendation surfaces.

Why expert review is needed: unused can mean future roadmap coverage, detector-only tracking, stale legacy taxonomy, or missing prompt/recommendation coverage. The audit cannot decide which without product/linguistic ownership.

Question for reviewer: Should this ID be kept as future/detector-only taxonomy, wired into V3 prompt/recommendation coverage, or deprecated?

Release impact: informational for internal enablement. Do not delete or weaken these categories without reviewer approval.

IDs:

`vi_l1_possessive_gender`, `vi_l1_countable`, `vi_l1_to_verb_confusion`, `vi_l1_can_no_infinitive`, `vi_l1_double_past`, `vi_l1_possessive_s_missing`, `vi_l1_comparative_double`, `vi_l1_adjective_order`, `vi_l1_very_much_placement`, `vi_l1_there_are_singular`, `vi_l1_everyone_plural`, `vi_l1_make_vs_do`, `vi_l1_tag_question`, `vi_l1_past_perfect_missing`, `vi_l1_reported_speech`, `vi_l1_since_vs_for`, `vi_l1_countable_much`, `vi_l1_some_vs_any`, `vi_l1_reflexive_missing`, `vi_l1_to_infinitive_after_ing`, `vi_l1_relative_pronoun`, `vi_l1_used_to_vs_be_used_to`, `vi_l1_another_vs_other`, `vi_l1_look_vs_see_vs_watch`, `vi_l1_by_vs_with`, `vi_l1_time_expressions`, `vi_l1_present_perfect_vs_past`, `vi_l1_embedded_question_order`, `vi_l1_do_support_3ps`, `vi_l1_subject_relative_omit`, `vi_l1_gerund_after_verb`, `vi_l1_modal_perfect`, `vi_l1_phrasal_pronoun_order`, `vi_l1_comparative_more_long`, `vi_l1_many_with_uncount`, `vi_l1_generic_plural`, `vi_l1_double_negative`, `vi_l1_negative_inversion`, `vi_l1_adverb_before_subject`, `vi_l1_make_let_bare`, `vi_l1_too_vs_very`, `vi_l1_one_of_the_singular`, `vi_l1_each_singular`, `vi_l1_been_vs_gone`, `vi_l1_tag_polarity`, `vi_l1_superlative_the`, `vi_l1_if_will`.

## Unused V3 L1 ID Review

Issue summary: `negation-no-not-placement` is present in the known V3 L1 ID set but not referenced by V3 prompts or calibration entries.

Why expert review is needed: it may be intended future coverage, stale metadata, or a missing prompt/calibration link. The audit has no linguistic evidence to choose.

Question for reviewer: Should `negation-no-not-placement` be connected to a real prompt/calibration sample, kept as planned coverage, or removed from the known V3 ID set?

Release impact: not an internal tooling blocker; should be resolved before claiming full V3 taxonomy coverage.

## Conversation Calibration Review

Issue summary: 6 conversation prompts have no calibration entry.

Why expert review is needed: adding calibration entries requires representative learner responses, expected CEFR behavior, and rubric expectations. That is new corpus content.

Question for reviewer: What representative accepted/borderline/weak learner responses should calibrate each conversation prompt?

Release impact: should block production-safe claims for conversation grading; not a blocker for writing/speaking/reading/listening corpus integrity.

Prompt IDs:

`a1-c-mercy-greeting`, `a2-c-weekend-chat`, `b1-c-study-plan`, `b2-c-opinion-followup`, `c1-c-polished-disagreement`, `c2-c-identity-debate`.
