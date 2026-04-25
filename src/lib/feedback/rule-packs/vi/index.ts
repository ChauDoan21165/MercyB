/**
 * Vietnamese L1 rule pack — assembled.
 *
 * Bundles the ordered rule registry + bilingual short-form feedback
 * templates into a single L1RulePack. This is what the detector
 * consumes when the learner's L1 is Vietnamese (the default until a
 * `profiles.l1` column says otherwise).
 *
 * Version is bumped manually on rule additions or feedback-string
 * edits. Do NOT auto-derive from rules.length — version captures
 * authored history, not just count.
 */

import type { L1RulePack } from '../../rule-pack-types.js';
import { VN_RULES } from './rules.js';
import { VN_EXPLANATIONS } from './explanations.js';

export const VN_RULE_PACK: L1RulePack = {
  l1Code: 'vi',
  l1Name: 'Tiếng Việt',
  // 1.0 — initial extracted pack (Step 10 refactor). Identical
  // detection output vs. the pre-refactor inline registry. Bump to 1.1
  // when adding new VN rules; bump major (2.0) on backwards-incompatible
  // pack-shape changes.
  version: '1.0',
  rules: VN_RULES,
  explanations: VN_EXPLANATIONS,
};

export default VN_RULE_PACK;

export { VN_RULES } from './rules.js';
export { VN_EXPLANATIONS } from './explanations.js';
