/**
 * EN→VN register rule-pack — assembled.
 *
 * Scaffold step 18: cultural/register errors — Vietnamese politeness tiers.
 *
 * Ships a 10-pattern register taxonomy (see `./taxonomy.ts`) plus one
 * surface-detectable stub (`en_l1_register_formal_opener_ban`).
 * The remaining 9 patterns ABSTAIN by default — they require conversational
 * context (addressee age/relationship) which RuleArgs does not yet expose.
 *
 * Trust floor invariant: a wrong register correction is worse than silence.
 * Only fire when the contradiction is unambiguous from surface text alone.
 *
 * NOT YET WIRED INTO RUNTIME. This pack ships in isolation — a follow-up
 * dispatch will add a `detectRegisterError()` entry point once a
 * context-surface is available for the 9 deferred patterns.
 *
 * Version 0.1 — initial scaffold, 1 active / 9 deferred.
 */

import type { L1RulePack } from "../../rule-pack-types.js";
import { REGISTER_RULES } from "./rules.js";
import { REGISTER_EXPLANATIONS } from "./explanations";

export const EN_VN_REGISTER_PACK: L1RulePack = {
  l1Code: "en",
  l1Name: "English",
  version: "0.1",
  rules: REGISTER_RULES,
  explanations: REGISTER_EXPLANATIONS,
};

export default EN_VN_REGISTER_PACK;

export { REGISTER_RULES } from "./rules.js";
export { REGISTER_EXPLANATIONS } from "./explanations.js";
export { REGISTER_TAXONOMY, SURFACE_DETECTABLE_TAGS, CONTEXT_REQUIRED_TAGS } from "./taxonomy.js";
export type { RegisterPattern, RegisterCategory, RegisterExample, DetectionFeasibility } from "./taxonomy.js";
