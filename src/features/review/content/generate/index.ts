// src/features/review/content/generate/index.ts — DC1 public surface.
//
// Build-time GENERATION infrastructure for generation-backed review flows
// (vi→ja, plus vi-gloss / reading gaps in vi→zh and vi→ko). Offline, deterministic
// where possible; the only async dependency is the INJECTED Translator seam.
// NO runtime model calls, NO Supabase, NO billing/auth/audio.
//
// Consumers (e.g. the ja agent, scripts/build-seeds.ts) plug a Translator into
// generateCandidates() to produce provenance:"generated" candidates, then pair
// makeRoundTripChecker(translator) into the gate's roundTrip option to certify.

export { type Translator, type TargetLang, staticTranslator } from "./translator";
export { deriveRomaji } from "./romaji";
export {
  makeRoundTripChecker,
  diceSimilarity,
} from "./roundTrip";
export {
  generateCandidates,
  type RawGenItem,
  type GenerateOptions,
} from "./generator";
