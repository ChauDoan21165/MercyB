// src/features/review/content/validate/gateTypes.ts
//
// Content-internal types for the validation harness (DC2). These are NOT part
// of the frozen public contract (src/features/review/types.ts) — they describe
// the pre-certification shape of a card and the gate's verdict. The ingestion
// layer (DC1) produces ReviewCandidate[]; the gate certifies them into the
// public ReviewItem shape (see toReviewItem in ../ingestion).

import type { ReviewFlowId, ReviewItemKind } from "@/features/review/types";

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export const CEFR_LEVELS: readonly CefrLevel[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
] as const;

/**
 * How a candidate's content was sourced:
 *  - "adapted"   — pulled verbatim from existing authored MercyBlade content
 *                  (front + back both human-authored). Trusted; round-trip skipped.
 *  - "generated" — front (VI gloss) and/or reading produced by the build-time
 *                  generator. MUST pass the back-translation round-trip gate.
 */
export type Provenance = "adapted" | "generated";

/** A card before certification. */
export interface ReviewCandidate {
  /** Stable namespaced id "<flow>:<kind>:<slug>". */
  id: string;
  flow: ReviewFlowId;
  kind: ReviewItemKind;
  /** Front = prompt language (Vietnamese for every vi→X flow here). */
  front: string;
  /** Back = answer language (de/ja/ko/zh target text). */
  back: string;
  /** Reading hint: romaji (ja) / romaja (ko) / pinyin (zh). Absent for de. */
  pronunciation?: string;
  /** Optional worked example (answer language). */
  example?: string;
  /** Optional Vietnamese note. */
  noteVi?: string;
  cefr: CefrLevel;
  provenance: Provenance;
  /** Provenance string for the resulting ReviewItem (e.g. "german/lessons"). */
  source: string;
}

/** Why a candidate was quarantined. One card may collect several. */
export type QuarantineReason =
  | "EMPTY_FRONT"
  | "EMPTY_BACK"
  | "FRONT_EQUALS_BACK"
  | "FRONT_NOT_VIETNAMESE" // front carries target-script chars (mis-mapped)
  | "BACK_WRONG_SCRIPT" // back lacks the required target script / has a forbidden one
  | "MISSING_READING" // ja/ko/zh require a pronunciation/reading
  | "PINYIN_NO_TONE" // zh pinyin has no tone marks/numbers
  | "ROMAJI_KANA_MISMATCH" // ja romaji doesn't round-trip from kana
  | "INVALID_CEFR"
  | "LENGTH_OUT_OF_RANGE"
  | "DUP_ID"
  | "NEEDS_ROUNDTRIP" // generated card but no round-trip checker supplied
  | "ROUNDTRIP_FAILED"; // generated card, round-trip below threshold

export interface GateVerdict {
  id: string;
  certified: boolean;
  /** Empty iff certified. */
  reasons: QuarantineReason[];
}

/**
 * Back-translation round-trip checker (injected). Translates the candidate's
 * generated VI front back to the target language and compares against `back`,
 * returning a similarity in [0,1]. Async because real implementations call MT;
 * the build supplies a real one, tests supply a stub. Only invoked for
 * provenance === "generated".
 */
export type RoundTripChecker = (
  cand: ReviewCandidate,
) => Promise<{ ok: boolean; similarity: number }>;

export interface GateOptions {
  /** Required to certify generated cards; absent → they quarantine NEEDS_ROUNDTRIP. */
  roundTrip?: RoundTripChecker;
  /** Minimum round-trip similarity to pass. Default 0.7. */
  roundTripThreshold?: number;
  /** Max back length in characters (length-sanity). Default 280. */
  maxBackLength?: number;
}

export interface GateBatchResult {
  certified: ReviewCandidate[];
  quarantined: Array<{ candidate: ReviewCandidate; reasons: QuarantineReason[] }>;
}
