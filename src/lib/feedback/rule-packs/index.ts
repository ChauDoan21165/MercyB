/**
 * Rule-pack registry + L1 → pack resolver.
 *
 * Today MercyBlade ships one pack (Vietnamese). Future packs land as
 * sibling directories (`./ko/`, `./ru/`, etc.) and a one-line entry
 * in `RULE_PACKS` here. The detector itself doesn't change.
 *
 * Resolution rule:
 *   1. If `l1Code` matches a registered pack, use it.
 *   2. Otherwise fall back to Vietnamese — the audience MercyBlade is
 *      built for. A learner with an unset `profiles.l1` still gets
 *      VN-leaning teaching, which is correct for our cohort.
 */

import type { L1RulePack } from '../rule-pack-types.js';
import { VN_RULE_PACK } from './vi/index.js';
import { EN_VN_RULE_PACK } from './en-vn/index.js';

export const RULE_PACKS: Record<string, L1RulePack> = {
  vi: VN_RULE_PACK,
  // EN→VN pack — English-L1 transfer patterns in Vietnamese learner
  // output (Axis 2, §15 Bar #4). The `vi` key remains the default
  // for the VN→EN flagship; `resolveRulePack('en')` returns this
  // pack for callers that route by L1 code.
  en: EN_VN_RULE_PACK,
};

/** Default pack used when the learner has no `profiles.l1` set. */
export const DEFAULT_RULE_PACK: L1RulePack = VN_RULE_PACK;

/**
 * Resolve an L1 code (typically `profiles.l1`) into a rule pack. Returns
 * the default pack when the code is null, empty, or unknown.
 */
export function resolveRulePack(
  l1Code: string | null | undefined,
): L1RulePack {
  if (!l1Code) return DEFAULT_RULE_PACK;
  const normalised = l1Code.trim().toLowerCase();
  return RULE_PACKS[normalised] ?? DEFAULT_RULE_PACK;
}

export { VN_RULE_PACK } from './vi/index.js';
