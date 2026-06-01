// src/features/review/content/validate/gate.ts
//
// The validation gate (DC2) — the single chokepoint every card passes through
// before it can become live. A card is certified ONLY if it collects zero
// quarantine reasons. Deterministic checks run synchronously; the optional
// back-translation round-trip (generated cards only) is async + injected.
//
// "Wrong content > no content": default to quarantine on any doubt.

import {
  CEFR_LEVELS,
  type GateBatchResult,
  type GateOptions,
  type GateVerdict,
  type QuarantineReason,
  type ReviewCandidate,
} from "./gateTypes";
import {
  backHasRequiredScript,
  flowRequiresReading,
  frontLooksVietnamese,
  pinyinHasTone,
  romajiKanaConsistent,
} from "./checks";

const DEFAULT_ROUNDTRIP_THRESHOLD = 0.7;
const DEFAULT_MAX_BACK_LENGTH = 280;

function isNonEmpty(s: string | undefined): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

/** Run every SYNCHRONOUS check; returns the reasons accrued (no dedup here). */
function syncReasons(cand: ReviewCandidate, maxBackLength: number): QuarantineReason[] {
  const reasons: QuarantineReason[] = [];

  // Presence
  if (!isNonEmpty(cand.front)) reasons.push("EMPTY_FRONT");
  if (!isNonEmpty(cand.back)) reasons.push("EMPTY_BACK");

  // CEFR tag
  if (!CEFR_LEVELS.includes(cand.cefr)) reasons.push("INVALID_CEFR");

  // Nothing more to check if front/back are missing.
  if (reasons.includes("EMPTY_FRONT") || reasons.includes("EMPTY_BACK")) {
    return reasons;
  }

  const front = cand.front.trim();
  const back = cand.back.trim();

  // Identity (a card that asks for what it shows is useless / a mapping bug)
  if (front === back) reasons.push("FRONT_EQUALS_BACK");

  // Script integrity
  if (!frontLooksVietnamese(front)) reasons.push("FRONT_NOT_VIETNAMESE");
  if (!backHasRequiredScript(cand.flow, back)) reasons.push("BACK_WRONG_SCRIPT");

  // Length sanity
  if (back.length > maxBackLength) reasons.push("LENGTH_OUT_OF_RANGE");

  // Reading / tone
  if (flowRequiresReading(cand.flow)) {
    if (!isNonEmpty(cand.pronunciation)) {
      reasons.push("MISSING_READING");
    } else {
      const reading = cand.pronunciation.trim();
      if (cand.flow === "vi-zh" && !pinyinHasTone(reading)) {
        reasons.push("PINYIN_NO_TONE");
      }
      if (cand.flow === "vi-ja") {
        const consistent = romajiKanaConsistent(back, reading);
        if (consistent === false) reasons.push("ROMAJI_KANA_MISMATCH");
      }
    }
  }

  return reasons;
}

/**
 * Certify a single candidate. Async because generated cards run the injected
 * back-translation round-trip. Does NOT consider cross-card dedup — use
 * runGateBatch for that.
 */
export async function runGate(
  cand: ReviewCandidate,
  opts: GateOptions = {},
): Promise<GateVerdict> {
  const maxBackLength = opts.maxBackLength ?? DEFAULT_MAX_BACK_LENGTH;
  const threshold = opts.roundTripThreshold ?? DEFAULT_ROUNDTRIP_THRESHOLD;

  const reasons = syncReasons(cand, maxBackLength);

  // Back-translation round-trip — generated content only. Skip if the card
  // already failed a structural check (no point translating garbage).
  if (cand.provenance === "generated" && reasons.length === 0) {
    if (!opts.roundTrip) {
      reasons.push("NEEDS_ROUNDTRIP");
    } else {
      try {
        const { ok, similarity } = await opts.roundTrip(cand);
        if (!ok || similarity < threshold) reasons.push("ROUNDTRIP_FAILED");
      } catch {
        // A failed/throwing checker is not a pass — quarantine, never certify.
        reasons.push("ROUNDTRIP_FAILED");
      }
    }
  }

  return { id: cand.id, certified: reasons.length === 0, reasons };
}

/**
 * Certify a batch with cross-card dedup. The FIRST candidate for an id wins;
 * later duplicates are quarantined DUP_ID (so re-runs are stable and a content
 * collision can't silently overwrite a good card). Order is preserved.
 */
export async function runGateBatch(
  candidates: readonly ReviewCandidate[],
  opts: GateOptions = {},
): Promise<GateBatchResult> {
  const certified: ReviewCandidate[] = [];
  const quarantined: GateBatchResult["quarantined"] = [];
  const seen = new Set<string>();

  for (const cand of candidates) {
    const verdict = await runGate(cand, opts);
    const reasons = [...verdict.reasons];

    if (seen.has(cand.id)) {
      reasons.unshift("DUP_ID");
    }

    if (reasons.length === 0) {
      // Only a clean, certified card reserves its id. A first-seen card that
      // failed other checks leaves its id free for a corrected card later.
      seen.add(cand.id);
      certified.push(cand);
    } else {
      quarantined.push({ candidate: cand, reasons });
    }
  }

  return { certified, quarantined };
}
