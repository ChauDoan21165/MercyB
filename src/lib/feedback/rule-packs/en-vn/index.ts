/**
 * EN→VN L1 rule pack — assembled.
 *
 * Bundles the ordered EN→VN rule registry + bilingual feedback
 * templates into a single L1RulePack. Mirrors `rule-packs/vi/index.ts`
 * structure exactly.
 *
 * NOT YET WIRED INTO RUNTIME. The existing `detectL1Error()` in
 * `l1-error-detector.ts` assumes English-target tokenisation. A
 * separate follow-up PR will add a `detectEnVnError()` entry point
 * that tokenises Vietnamese input and dispatches through this pack.
 *
 * Version starts at 0.1 — initial pack with 8 detector rules covering
 * 8 of the 10 grammar families authored in
 * `src/lib/l1-profiles/en.ts`. The 2 deferred families
 * (`pronoun_age_register_mismatch`, `sentence_final_particle_omission`)
 * need conversational context the RuleArgs surface doesn't expose.
 */

import type { L1RulePack } from "../../rule-pack-types.js";
import { EN_VN_RULES } from "./rules.js";
import { EN_VN_EXPLANATIONS } from "./explanations.js";

export const EN_VN_RULE_PACK: L1RulePack = {
  l1Code: "en",
  l1Name: "English",
  version: "0.1",
  rules: EN_VN_RULES,
  explanations: EN_VN_EXPLANATIONS,
};

export default EN_VN_RULE_PACK;

export { EN_VN_RULES } from "./rules.js";
export { EN_VN_EXPLANATIONS } from "./explanations.js";
