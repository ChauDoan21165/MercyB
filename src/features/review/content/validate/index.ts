// src/features/review/content/validate/index.ts — DC2 public surface.
//
// The validation gate every content card passes through before it can go live.
// Ingestion (DC1) and the per-language adapters (DC3) import from here.

export { runGate, runGateBatch } from "./gate";
export {
  CEFR_LEVELS,
  type CefrLevel,
  type Provenance,
  type ReviewCandidate,
  type QuarantineReason,
  type GateVerdict,
  type GateOptions,
  type GateBatchResult,
  type RoundTripChecker,
} from "./gateTypes";
export {
  hasJapanese,
  hasHangul,
  hasHanzi,
  hasLatin,
  frontLooksVietnamese,
  backHasRequiredScript,
  flowRequiresReading,
  pinyinHasTone,
  romajiKanaConsistent,
} from "./checks";
