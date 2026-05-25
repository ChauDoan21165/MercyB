/**
 * EN→VN rule-pack: ordered rule registry.
 *
 * First-match-wins. Order encodes priority: specific patterns
 * (calques, structural inversions) precede general fallbacks
 * (classifier omission, plural redundancy) so the most targeted
 * teaching message reaches the learner.
 *
 * Mirrors `rule-packs/vi/rules.ts` shape exactly. The rule functions
 * themselves live in `./detectors.ts` (NOT in `l1-error-detector.ts`)
 * because the existing detector module uses English-grammar helpers
 * and is Axis-1 specific. EN→VN rules consume Vietnamese tokens; a
 * future wire-up PR will add a `detectEnVnError()` entry point that
 * tokenises Vietnamese input and dispatches through this registry.
 */

import type { L1Rule } from "../../rule-pack-types.js";

import {
  ruleAspectOveruseStative,
  ruleCalqueTakeItEasy,
  ruleClassifierOmission,
  ruleCopulaLaAdj,
  ruleNegationLaMissingPhai,
  ruleNounModifierInversion,
  rulePluralMarkerRedundancy,
  ruleQuestionInversionLaFront,
} from "./detectors.js";

export const EN_VN_RULES: L1Rule[] = [
  // Specific structural inversions first — they're high-precision.
  ruleQuestionInversionLaFront,    // "Là anh mệt?"
  ruleNegationLaMissingPhai,       // "không là sinh viên"
  ruleCalqueTakeItEasy,            // "lấy nó dễ dàng"
  // Predicate / aspect patterns.
  ruleCopulaLaAdj,                 // "Tôi là vui"
  ruleAspectOveruseStative,        // "Tôi đang muốn"
  // Noun-phrase patterns.
  ruleNounModifierInversion,       // "đỏ sách"
  // Counting / plural patterns (most general — last).
  ruleClassifierOmission,          // "một sách"
  rulePluralMarkerRedundancy,      // "ba những cuốn sách"
];
