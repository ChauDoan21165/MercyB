/**
 * EN→VN register rule-pack: ordered rule registry.
 *
 * Trust-floor ordering: the one surface-detectable rule (formal_opener_ban)
 * runs first. The nine ABSTAINING stubs follow — their order is irrelevant
 * at runtime (all return null) but is documented here for future implementors
 * who will convert them to real detectors once conversational-context surfaces
 * become available in RuleArgs.
 */

import type { L1Rule } from "../../rule-pack-types.js";

import {
  ruleApologyWithPeerForm,
  ruleBareRefusalToSuperior,
  ruleBluntRequestToSuperior,
  ruleDirectCommandToElder,
  ruleFavorRequestNoSoftener,
  ruleFormalOpenerPeerBan,
  ruleMissingAParticle,
  rulePeerBanToElder,
  ruleThanksWithPeerForm,
  ruleToiselfWithElder,
} from "./detectors";

export const REGISTER_RULES: L1Rule[] = [
  // Surface-detectable — fires on "Thưa bạn" / "Kính gửi bạn" etc.
  ruleFormalOpenerPeerBan,
  // Context-required — ABSTAIN (all return null).
  rulePeerBanToElder,
  ruleToiselfWithElder,
  ruleMissingAParticle,
  ruleBluntRequestToSuperior,
  ruleBareRefusalToSuperior,
  ruleThanksWithPeerForm,
  ruleApologyWithPeerForm,
  ruleFavorRequestNoSoftener,
  ruleDirectCommandToElder,
];
