/**
 * EN→VN register-error detection stubs — TRUST FLOOR.
 *
 * ──────────────────────────────────────────────────
 * ABSTAIN BY DEFAULT.
 * ──────────────────────────────────────────────────
 *
 * Register errors are contextual: whether "bạn" is wrong depends on the
 * addressee's age and relationship, which the RuleArgs surface does NOT
 * expose. A false-positive register correction is worse than silence —
 * it teaches the learner that a perfectly valid form is wrong.
 *
 * Only ONE pattern fires here: `formal_opener_peer_ban`.
 * "Thưa bạn" / "Kính gửi bạn" / "Kính thưa bạn" are ALWAYS wrong
 * because the formal opener (Thưa / Kính gửi / Kính thưa) is exclusively
 * paired with hierarchical address terms (ông/bà/thầy/cô/quý vị/anh/chị);
 * "bạn" (peer pronoun) is never valid after them. This contradiction is
 * visible from surface text alone.
 *
 * All other 9 patterns from the taxonomy ABSTAIN (return null).
 * Future dispatch: wire each CONTEXT_REQUIRED pattern when a
 * conversational-context surface becomes available in RuleArgs.
 *
 * Contract (mirrors en-vn/detectors.ts):
 *   - Each rule is `L1Rule = (args: RuleArgs) => RuleHit | null`.
 *   - Tokens in `args.userTokens` are lowercased, punctuation-stripped,
 *     whitespace-split Vietnamese syllables (same tokenizer as the main
 *     l1-error-detector).
 *   - First-match-wins ordering is set by `rules.ts`, not here.
 */

import type { L1Rule, RuleHit } from "../../rule-pack-types.js";

// ── Word sets ──────────────────────────────────────────────────────────────

/**
 * Single-token formal openers.
 * "Thưa" always precedes a hierarchical address term, never "bạn".
 */
const SINGLE_TOKEN_FORMAL_OPENERS = new Set(["thưa"]);

/**
 * Two-token formal opener first tokens.
 * Paired with their mandatory second token in the detector below.
 */
const TWO_TOKEN_OPENER_FIRST = "kính";
const TWO_TOKEN_OPENER_SECOND = new Set(["gửi", "thưa"]);

// ──────────────────────────────────────────────────────────────────────────
// Rule 1 — formal opener + peer pronoun "bạn".
//
// Fires when:
//   - SINGLE: userTokens[i] ∈ SINGLE_TOKEN_FORMAL_OPENERS
//             AND userTokens[i+1] === "bạn"
//   - TWO:    userTokens[i] === "kính"
//             AND userTokens[i+1] ∈ {"gửi","thưa"}
//             AND userTokens[i+2] === "bạn"
//
// Does NOT fire when:
//   - "bạn" appears elsewhere in the sentence (not immediately after opener)
//   - "thưa" is followed by a non-"bạn" address term (correct)
//   - "bạn" is used as a noun (friend) — impossible ambiguity here because
//     "Thưa [FRIEND_NAME]" wouldn't use the bare pronoun "bạn" as a complement
// ──────────────────────────────────────────────────────────────────────────

export const ruleFormalOpenerPeerBan: L1Rule = ({
  userTokens,
  rawExpected,
}): RuleHit | null => {
  for (let i = 0; i < userTokens.length; i++) {
    // Single-token opener: "thưa bạn"
    if (
      SINGLE_TOKEN_FORMAL_OPENERS.has(userTokens[i]) &&
      i + 1 < userTokens.length &&
      userTokens[i + 1] === "bạn"
    ) {
      return {
        tag: "en_l1_register_formal_opener_ban",
        replacements: {
          FIX: rawExpected,
          OPENER: userTokens[i].charAt(0).toUpperCase() + userTokens[i].slice(1),
        },
      };
    }

    // Two-token opener: "kính gửi bạn" or "kính thưa bạn"
    if (
      userTokens[i] === TWO_TOKEN_OPENER_FIRST &&
      i + 2 < userTokens.length &&
      TWO_TOKEN_OPENER_SECOND.has(userTokens[i + 1]) &&
      userTokens[i + 2] === "bạn"
    ) {
      return {
        tag: "en_l1_register_formal_opener_ban",
        replacements: {
          FIX: rawExpected,
          OPENER:
            userTokens[i].charAt(0).toUpperCase() +
            userTokens[i].slice(1) +
            " " +
            userTokens[i + 1],
        },
      };
    }
  }
  return null;
};

// ──────────────────────────────────────────────────────────────────────────
// Rules 2–10 — ABSTAIN (context_required).
//
// These stubs exist so the rule registry is structurally complete and
// future implementors have named entry points. All currently return null.
//
// See taxonomy.ts for the full pattern description and examples.
// ──────────────────────────────────────────────────────────────────────────

export const rulePeerBanToElder: L1Rule = (): RuleHit | null => null;
export const ruleToiselfWithElder: L1Rule = (): RuleHit | null => null;
export const ruleMissingAParticle: L1Rule = (): RuleHit | null => null;
export const ruleBluntRequestToSuperior: L1Rule = (): RuleHit | null => null;
export const ruleBareRefusalToSuperior: L1Rule = (): RuleHit | null => null;
export const ruleThanksWithPeerForm: L1Rule = (): RuleHit | null => null;
export const ruleApologyWithPeerForm: L1Rule = (): RuleHit | null => null;
export const ruleFavorRequestNoSoftener: L1Rule = (): RuleHit | null => null;
export const ruleDirectCommandToElder: L1Rule = (): RuleHit | null => null;
