/**
 * L1 profiles — barrel.
 *
 * Today ships Vietnamese and the VI→ZH shell. Future packs (ko / es / ja)
 * land as sibling files (`./ko.ts`, `./es.ts`, …) and re-export here. The
 * `L1Profile` type is L1-agnostic per spec §5 (portability).
 */

export {
  zhL1Profile,
  default as defaultZHL1Profile,
  type ZHL1Profile,
  type ZHProfileFunctionalConsumer,
} from "./zh.js";

export {
  vietnameseL1Profile,
  default as defaultVietnameseL1Profile,
  type CEFR,
  type Severity,
  type FeedbackLabel,
  type PhenomenonId,
  type GrammarFamilyExample,
  type GrammarFamily,
  type WritingPatternExample,
  type WritingPattern,
  type PhonemeGapCategory,
  type PhonologyLayer,
  type GrammarLayer,
  type WritingLayer,
  type InterferenceMap,
  type L1ProfileMetadata,
  type L1Profile,
  type VietnameseL1Profile,
} from "./vi.js";
