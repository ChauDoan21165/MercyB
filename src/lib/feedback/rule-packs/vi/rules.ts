/**
 * Vietnamese rule-pack: ordered rule registry.
 *
 * The detector evaluates rules in this order; first match wins. Order
 * encodes priority: more specific patterns are listed before generic
 * fallbacks so the right teaching message reaches the learner when
 * multiple rules could fire on the same input.
 *
 * The rule functions themselves live in `l1-error-detector.ts` because
 * they share English-grammar helpers (tokenize, isPastForm,
 * BE_VERBS, …) that are properties of the TARGET language and
 * therefore not pack-specific. A future Korean / Russian pack would
 * still consume those helpers and add its own rule functions in its
 * own file.
 *
 * Refactor note (Step 10): formerly the inline `RULE_REGISTRY` const
 * inside the detector module.
 */

import type { L1Rule } from '../../rule-pack-types.js';

import {
  ruleAdjectiveOrder,
  ruleAdverbBeforeSubject,
  ruleAnotherVsOther,
  ruleAvsAnVowel,
  ruleBeenVsGone,
  ruleByVsWith,
  ruleCanNoInfinitive,
  ruleComparativeDouble,
  ruleComparativeMoreLong,
  ruleConditionalMix,
  ruleCoTransfer,
  ruleCountable,
  ruleCountableMuch,
  ruleDoSupport3ps,
  ruleDoubleNegative,
  ruleDoublePast,
  ruleEachSingular,
  ruleEmbeddedQuestionOrder,
  ruleEveryonePlural,
  ruleGenericPlural,
  ruleGeographicalArticle,
  ruleGerundAfterVerb,
  ruleIfWill,
  ruleLookSeeWatch,
  ruleMakeLetBare,
  ruleMakeVsDo,
  ruleManyWithUncount,
  ruleMissingArticle,
  ruleMissingBe,
  ruleModalPerfect,
  ruleNegativeInversion,
  ruleNoArticleGeneric,
  ruleNoAuxNegation,
  ruleOneOfTheSingular,
  rulePassiveMissingBe,
  rulePastEd,
  rulePastPerfectMissing,
  rulePhrasalPronounOrder,
  rulePluralS,
  rulePossessiveGender,
  rulePossessiveSMissing,
  rulePrepositionTransfer,
  rulePresentPerfectVsPast,
  ruleQuestionNoAux,
  ruleReflexiveMissing,
  ruleRelativePronoun,
  ruleReportedSpeech,
  ruleSinceVsFor,
  ruleSomeVsAny,
  ruleSubjectRelativeOmit,
  ruleSubjunctiveWere,
  ruleSuperlativeThe,
  ruleTagPolarity,
  ruleTagQuestion,
  ruleThereAreSingular,
  ruleThirdPersonS,
  ruleTimeExpressions,
  ruleToInfinitiveAfterIng,
  ruleTooVsVery,
  ruleToVerbConfusion,
  ruleUsedToVsBeUsedTo,
  ruleVeryMuchPlacement,
} from '../../l1-error-detector.js';

/**
 * Ordered VN rule registry. Numeric comments are the rule's stable
 * priority slot (matches `shared/l1-rule-ids-round5.md` and the
 * coordination contract with CC1/CC2/CC4/CC5).
 */
export const VN_RULES: L1Rule[] = [
  ruleThirdPersonS,          // 1
  rulePastEd,                // 2
  rulePluralS,               // 3
  // 30 runs BEFORE 4 so "the cake eaten" → "the cake was eaten" lands
  // on passive-voice feedback instead of generic missing-be.
  rulePassiveMissingBe,      // 30
  ruleMissingBe,             // 4
  ruleQuestionNoAux,         // 5
  // 35 + 36 run BEFORE 6 + 9 so specific by/with and time-preposition
  // patterns win over the general "missing article" / "preposition swap"
  // rules when there's an overlap.
  ruleByVsWith,              // 35
  ruleTimeExpressions,       // 36
  // Round 5: run geographical-article + superlative-the before the
  // generic missing_article so learners get the more specific teaching
  // message when both rules could fire.
  ruleGeographicalArticle,   // 47
  ruleSuperlativeThe,        // 60
  ruleMissingArticle,        // 6
  rulePossessiveGender,      // 8
  rulePrepositionTransfer,   // 9
  ruleCountable,             // 10
  ruleToVerbConfusion,       // 11
  ruleCanNoInfinitive,       // 12
  ruleDoublePast,            // 13
  rulePossessiveSMissing,    // 14
  ruleComparativeDouble,     // 15
  ruleAdjectiveOrder,        // 16
  ruleVeryMuchPlacement,     // 17
  ruleThereAreSingular,      // 18
  ruleEveryonePlural,        // 19
  ruleMakeVsDo,              // 20
  ruleTagQuestion,           // 21
  rulePastPerfectMissing,    // 22
  ruleReportedSpeech,        // 23
  ruleConditionalMix,        // 28
  ruleToInfinitiveAfterIng,  // 29
  ruleReflexiveMissing,      // 27
  ruleUsedToVsBeUsedTo,      // 32
  ruleRelativePronoun,       // 31
  ruleSomeVsAny,             // 26
  ruleCountableMuch,         // 25
  ruleSinceVsFor,            // 24
  ruleAnotherVsOther,        // 33
  ruleLookSeeWatch,          // 34

  // ── Round 5 additions (rules 37–61). Placed after the v1.2 block so
  //    existing feedback strings keep winning on shared patterns. Within
  //    the new block: structural / morphological patterns (more specific)
  //    run before usage / agreement patterns.
  rulePresentPerfectVsPast,  // 37
  ruleSubjunctiveWere,       // 38
  ruleEmbeddedQuestionOrder, // 39
  ruleDoSupport3ps,          // 40
  ruleSubjectRelativeOmit,   // 41
  ruleGerundAfterVerb,       // 42
  ruleModalPerfect,          // 43
  rulePhrasalPronounOrder,   // 44
  ruleComparativeMoreLong,   // 45
  ruleManyWithUncount,       // 46
  ruleNegativeInversion,     // 50 — run before 51 (adverb before subject)
  ruleAdverbBeforeSubject,   // 51
  ruleMakeLetBare,           // 52
  ruleTooVsVery,             // 53
  ruleAvsAnVowel,            // 54
  ruleOneOfTheSingular,      // 55
  ruleEachSingular,          // 56
  ruleBeenVsGone,            // 57
  ruleTagPolarity,           // 58
  // ruleGeographicalArticle and ruleSuperlativeThe are registered
  // higher up (before ruleMissingArticle) so their specific feedback
  // wins over the generic missing-article message.
  ruleNoArticleGeneric,      // 59
  ruleIfWill,                // 61
  ruleGenericPlural,         // 48 — last: loses to plural_s (existing) by design
  // Round 6 — Bar #1 DoD flip. Runs before ruleDoubleNegative so a
  // bare-no/bare-not without do-support gets the specific message
  // instead of falling through to the (broader) double-negative rule.
  ruleNoAuxNegation,         // 62
  // Round 6 — Bar #1 DoD flip. Combined detector with two
  // sub-patterns sharing one tag (vi_l1_co_transfer):
  //   A. locative-fronted `has` → `there is/are`
  //   B. `NP has + intensifier + adj` → `NP is + intensifier + adj`
  ruleCoTransfer,            // 64
  ruleDoubleNegative,        // 49 — last among A2 structural
];
