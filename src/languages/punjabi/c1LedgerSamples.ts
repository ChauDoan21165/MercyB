// Punjabi C1 ledger samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred. This is not A11 integration.

import {
  c1SealSamples,
  c1SealSamplesScriptAwareness,
  type PunjabiC1SealArea,
  type PunjabiC1SealSample,
} from "./c1SealSamples";

export type PunjabiC1LedgerArea = PunjabiC1SealArea;

export type PunjabiC1LedgerMode =
  | "ledger"
  | "pre_a11_ledger"
  | "snapshot"
  | "archive_copy"
  | "signoff"
  | "pre_merge"
  | "qa"
  | "pre_integration";

export type PunjabiC1LedgerPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1LedgerSample = {
  id: string;
  level: "C1";
  area: PunjabiC1LedgerArea;
  mode: PunjabiC1LedgerMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  ledger_prompt_vi: string;
  ledger_prompt_en: string;
  sample: PunjabiC1LedgerPhrase;
  ledger_checks_vi: readonly string[];
  ledger_checks_en: readonly string[];
  pre_a11_ledger_checks_vi: readonly string[];
  pre_a11_ledger_checks_en: readonly string[];
  archive_copy_notes_vi: readonly string[];
  archive_copy_notes_en: readonly string[];
  pre_integration_notes_vi: readonly string[];
  pre_integration_notes_en: readonly string[];
  canada_example: PunjabiC1LedgerPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

const styleByArea: Record<PunjabiC1LedgerArea, PunjabiC1LedgerMode> = {
  source_summary: "ledger",
  cautious_claim: "pre_a11_ledger",
  evidence_comparison: "snapshot",
  formal_correspondence: "archive_copy",
  executive_summary: "signoff",
  register_calibration: "pre_merge",
  presentation_response: "qa",
  public_professional_tone: "pre_integration",
};

const ledgerPromptPrefixVi = "Ledger";
const ledgerPromptPrefixEn = "Ledger";

function toList(items: readonly string[], replacements: Array<[RegExp, string]>): readonly string[] {
  return items.map((item) =>
    replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), item),
  );
}

export const c1LedgerSamples: PunjabiC1LedgerSample[] = c1SealSamples.map(
  (item: PunjabiC1SealSample, index: number) => ({
    id: item.id.replace("seal", "ledger"),
    level: "C1",
    area: item.area,
    mode: styleByArea[item.area],
    title_pa: `${ledgerPromptPrefixVi}: ${item.title_pa.replace("seal", "ledger")}`,
    title_rom: `${ledgerPromptPrefixVi === "Ledger" ? ledgerPromptPrefixEn : ledgerPromptPrefixEn}: ${item.title_rom}`,
    title_vi: `${ledgerPromptPrefixVi}: ${item.title_vi.replace("seal", "ledger")}`,
    title_en: `${ledgerPromptPrefixEn}: ${item.title_en.replace("seal", "ledger")}`,
    ledger_prompt_vi: `${item.seal_prompt_vi} Hãy lock reasoning cho pre-A11-ledger.`,
    ledger_prompt_en: `${item.seal_prompt_en} Lock reasoning for the pre-A11 ledger.`,
    sample: item.sample,
    ledger_checks_vi: toList(item.seal_checks_vi, [[/Seal/gi, "Ledger"]]),
    ledger_checks_en: toList(item.seal_checks_en, [[/Seal/gi, "Ledger"]]),
    pre_a11_ledger_checks_vi: toList(item.pre_a11_seal_checks_vi, [[/seal/gi, "ledger"]]),
    pre_a11_ledger_checks_en: toList(item.pre_a11_seal_checks_en, [[/seal/gi, "ledger"]]),
    archive_copy_notes_vi: toList(item.closure_packet_notes_vi, [[/Closure-packet/gi, "Archive"]]),
    archive_copy_notes_en: toList(item.closure_packet_notes_en, [[/Closure packet/gi, "Archive"]]),
    pre_integration_notes_vi: item.pre_integration_notes_vi,
    pre_integration_notes_en: item.pre_integration_notes_en,
    canada_example: item.canada_example,
    learner_traps_vi: toList(item.learner_traps_vi, [[/seal/gi, "ledger"]]),
    learner_traps_en: toList(item.learner_traps_en, [[/seal/gi, "ledger"]]),
  }),
);

export const c1LedgerSamplesScriptAwareness = c1SealSamplesScriptAwareness;

export const punjabiC1LedgerSamples = c1LedgerSamples;

export default punjabiC1LedgerSamples;
