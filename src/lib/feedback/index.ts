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
 * Convenience adapter — runs detection against the EN→VN pack
 * (English-L1 transfer patterns surfacing in Vietnamese learner
 * output). Axis 2 counterpart to `detectL1Error`. The engine itself
 * is language-agnostic; this adapter only fixes the pack.
 *
 * Wiring promised by PR #1188's body: *"wiring an actual
 * detectEnVnError() entry point into the engine is a SEPARATE
 * follow-up PR."* This is that adapter.
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

// Step 18 — English-language register error detector (surface-detectable patterns only).
// See registerDetector.ts for the WIRING SPEC (how A1 wires this into the Sửa câu panel).
export {
  detectRegisterError,
  detectRegisterErrorWithContext,
  type RegisterDetectionInput,
  type RegisterDetectionWithContextInput,
  type RegisterDetectionResult,
  type RegisterScenario,
} from './registerDetector';

// Step 11 seed — awkward-Vietlish DARK detector (flag-gated, telemetry-only).
// Surfaced on the public API so it is discoverable and not a dead orphan; it
// is intentionally NOT called from any learner-facing path yet (see the module
// header + step11-vietlish-dark-seed-B-boundary-handoff.md).
export {
  detectVietlishDark,
  runVietlishDarkSeed,
  isVietlishDarkSeedEnabled,
  type VietlishDarkSignal,
  type VietlishDarkPatternId,
  type VietlishDarkSeedOptions,
} from './vietlish-dark-detector';
