// Punjabi C1 receipt samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred. This is not A11 integration.

import {
  c1LedgerSamples,
  c1LedgerSamplesScriptAwareness,
  type PunjabiC1LedgerArea,
  type PunjabiC1LedgerSample,
} from "./c1LedgerSamples";

export type PunjabiC1ReceiptArea = PunjabiC1LedgerArea;

export type PunjabiC1ReceiptMode =
  | "receipt"
  | "pre_a11_receipt"
  | "ledger"
  | "archive_copy"
  | "signoff"
  | "pre_merge"
  | "qa"
  | "pre_integration";

export type PunjabiC1ReceiptPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1ReceiptSample = {
  id: string;
  level: "C1";
  area: PunjabiC1ReceiptArea;
  mode: PunjabiC1ReceiptMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  receipt_prompt_vi: string;
  receipt_prompt_en: string;
  sample: PunjabiC1ReceiptPhrase;
  ledger_checks_vi: readonly string[];
  ledger_checks_en: readonly string[];
  pre_a11_receipt_checks_vi: readonly string[];
  pre_a11_receipt_checks_en: readonly string[];
  archive_copy_notes_vi: readonly string[];
  archive_copy_notes_en: readonly string[];
  pre_integration_notes_vi: readonly string[];
  pre_integration_notes_en: readonly string[];
  canada_example: PunjabiC1ReceiptPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

const styleByArea: Record<PunjabiC1ReceiptArea, PunjabiC1ReceiptMode> = {
  source_summary: "ledger",
  cautious_claim: "pre_a11_receipt",
  evidence_comparison: "archive_copy",
  formal_correspondence: "signoff",
  executive_summary: "pre_merge",
  register_calibration: "qa",
  presentation_response: "pre_integration",
  public_professional_tone: "receipt",
};

const receiptPromptPrefixVi = "Receipt";
const receiptPromptPrefixEn = "Receipt";

function toList(items: readonly string[], replacements: Array<[RegExp, string]>): readonly string[] {
  return items.map((item) =>
    replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), item),
  );
}

export const c1ReceiptSamples: PunjabiC1ReceiptSample[] = c1LedgerSamples.map(
  (item: PunjabiC1LedgerSample) => ({
    id: item.id.replace("ledger", "receipt"),
    level: "C1",
    area: item.area,
    mode: styleByArea[item.area],
    title_pa: `${receiptPromptPrefixVi}: ${item.title_pa.replace("ledger", "receipt")}`,
    title_rom: `${receiptPromptPrefixEn}: ${item.title_rom}`,
    title_vi: `${receiptPromptPrefixVi}: ${item.title_vi.replace("ledger", "receipt")}`,
    title_en: `${receiptPromptPrefixEn}: ${item.title_en.replace("ledger", "receipt")}`,
    receipt_prompt_vi: `${item.ledger_prompt_vi} Hãy lock reasoning cho pre-A11-receipt.`,
    receipt_prompt_en: `${item.ledger_prompt_en} Lock reasoning for the pre-A11 receipt.`,
    sample: item.sample,
    ledger_checks_vi: item.ledger_checks_vi,
    ledger_checks_en: item.ledger_checks_en,
    pre_a11_receipt_checks_vi: toList(item.pre_a11_ledger_checks_vi, [[/ledger/gi, "receipt"]]),
    pre_a11_receipt_checks_en: toList(item.pre_a11_ledger_checks_en, [[/ledger/gi, "receipt"]]),
    archive_copy_notes_vi: item.archive_copy_notes_vi,
    archive_copy_notes_en: item.archive_copy_notes_en,
    pre_integration_notes_vi: item.pre_integration_notes_vi,
    pre_integration_notes_en: item.pre_integration_notes_en,
    canada_example: item.canada_example,
    learner_traps_vi: toList(item.learner_traps_vi, [[/ledger/gi, "receipt"]]),
    learner_traps_en: toList(item.learner_traps_en, [[/ledger/gi, "receipt"]]),
  }),
);

export const c1ReceiptSamplesScriptAwareness = c1LedgerSamplesScriptAwareness;

export const punjabiC1ReceiptSamples = c1ReceiptSamples;

export default punjabiC1ReceiptSamples;

