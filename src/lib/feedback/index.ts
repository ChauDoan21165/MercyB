/**
 * Feedback module barrel.
 *
 * Re-exports the detector engine + the rule-pack registry, and exposes
 * the convenient `detectL1Error(input)` adapter that runs the engine
 * against the Vietnamese rule pack — the default for MercyBlade today.
 *
 * Why this barrel exists:
 *   The detector and the VN pack form a circular import (detector
 *   exports rule fns; pack imports them; pack assembles VN_RULE_PACK;
 *   detector would need it for `detectL1Error`). To avoid the cycle,
 *   the engine no longer carries a built-in "default pack" — instead,
 *   any module that wants the default-VN behaviour imports from this
 *   barrel.
 *
 * Existing call sites:
 *   - `api/_lib/l1HintAdapter.ts`           imports `detectL1Error` from here
 *   - feedback unit tests                   import detector types + adapter from here
 *   - any future production caller          should also import from here
 */

import {
  detectErrors,
  type L1DetectionInput,
  type L1DetectionResult,
} from './l1-error-detector.js';
import { VN_RULE_PACK } from './rule-packs/vi/index.js';
import { EN_VN_RULE_PACK } from './rule-packs/en-vn/index.js';

/**
 * Convenience adapter — runs detection against the Vietnamese pack.
 * Identical behaviour to the pre-refactor `detectL1Error`.
 */
export function detectL1Error(input: L1DetectionInput): L1DetectionResult {
  return detectErrors(input, VN_RULE_PACK);
}

/**
 * Axis-2 convenience adapter — runs detection against the EN→VN pack
 * (English speakers learning Vietnamese). The 8-rule pack ships in
 * src/lib/feedback/rule-packs/en-vn/ (per PR #1188); this barrel
 * function is the public entry point that consumer call sites
 * (AI Tutor target=vi branch today; placement / writing-feedback in
 * future) invoke without coupling to the pack directly.
 *
 * Token shape: the engine's `tokenize()` is whitespace-based + strips
 * common Western punctuation. Vietnamese orthography is whitespace-
 * separated at the syllable level, so the same tokenizer works for
 * Vietnamese input directly — no separate VN tokenizer needed today.
 */
export function detectEnVnError(input: L1DetectionInput): L1DetectionResult {
  return detectErrors(input, EN_VN_RULE_PACK);
}

// Re-exports — keep the existing import surface working for callers
// that previously imported from `./l1-error-detector` directly.
export {
  detectErrors,
  type L1DetectionInput,
  type L1DetectionResult,
  type L1FeedbackText,
  type L1WeaknessTag,
  type L1Rule,
  type RuleArgs,
  type RuleHit,
  type StringTemplate,
} from './l1-error-detector.js';

export { VN_RULE_PACK } from './rule-packs/vi/index.js';
export { EN_VN_RULE_PACK } from './rule-packs/en-vn/index.js';
export {
  RULE_PACKS,
  DEFAULT_RULE_PACK,
  resolveRulePack,
} from './rule-packs/index.js';
export {
  type L1Explanation,
  type L1RulePack,
  validateRulePack,
  explanationsByTag,
} from './rule-pack-types.js';
