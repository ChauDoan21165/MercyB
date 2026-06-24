// Punjabi C1 bundle samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred. This is not A11 integration.

import {
  c1ReceiptSamples,
  c1ReceiptSamplesScriptAwareness,
  type PunjabiC1ReceiptArea,
  type PunjabiC1ReceiptSample,
} from "./c1ReceiptSamples";

export type PunjabiC1BundleArea = PunjabiC1ReceiptArea;

export type PunjabiC1BundleMode =
  | "bundle"
  | "pre_a11_bundle"
  | "receipt"
  | "ledger"
  | "archive_copy"
  | "formal_signoff"
  | "pre_integration"
  | "public_service";

export type PunjabiC1BundlePhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1BundleSample = {
  id: string;
  level: "C1";
  area: PunjabiC1BundleArea;
  mode: PunjabiC1BundleMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  bundle_prompt_vi: string;
  bundle_prompt_en: string;
  sample: PunjabiC1BundlePhrase;
  bundle_checks_vi: readonly string[];
  bundle_checks_en: readonly string[];
  pre_a11_bundle_checks_vi: readonly string[];
  pre_a11_bundle_checks_en: readonly string[];
  receipt_notes_vi: readonly string[];
  receipt_notes_en: readonly string[];
  ledger_notes_vi: readonly string[];
  ledger_notes_en: readonly string[];
  pre_integration_notes_vi: readonly string[];
  pre_integration_notes_en: readonly string[];
  canada_example: PunjabiC1BundlePhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

const modeByArea: Record<PunjabiC1BundleArea, PunjabiC1BundleMode> = {
  source_summary: "bundle",
  cautious_claim: "pre_a11_bundle",
  evidence_comparison: "ledger",
  formal_correspondence: "formal_signoff",
  executive_summary: "receipt",
  register_calibration: "archive_copy",
  presentation_response: "pre_integration",
  public_professional_tone: "public_service",
};

function replaceTerms(items: readonly string[], replacements: Array<[RegExp, string]>): readonly string[] {
  return items.map((item) =>
    replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), item),
  );
}

export const c1BundleSamplesScriptAwareness = {
  vi: `${c1ReceiptSamplesScriptAwareness.vi} Native review được để sau; bundle này không phải A11 integration.`,
  en: `${c1ReceiptSamplesScriptAwareness.en} Native review is deferred; this bundle is not A11 integration.`,
} as const;

export const c1BundleSamples: PunjabiC1BundleSample[] = c1ReceiptSamples.map(
  (item: PunjabiC1ReceiptSample) => ({
    id: item.id.replace("receipt", "bundle"),
    level: "C1",
    area: item.area,
    mode: modeByArea[item.area],
    title_pa: `Bundle: ${item.title_pa.replace(/receipt/gi, "bundle")}`,
    title_rom: `bundle: ${item.title_rom.replace(/receipt/gi, "bundle")}`,
    title_vi: `Bundle: ${item.title_vi.replace(/receipt/gi, "bundle")}`,
    title_en: `Bundle: ${item.title_en.replace(/receipt/gi, "bundle")}`,
    bundle_prompt_vi: `${item.receipt_prompt_vi} Gom vào pre-A11-bundle để dùng sau cho lựa chọn A11 mà không chạy integration.`,
    bundle_prompt_en: `${item.receipt_prompt_en} Package it as a pre-A11 bundle for later A11 selection without running integration.`,
    sample: item.sample,
    bundle_checks_vi: [
      "Gurmukhi là mẫu chính.",
      "Vietnamese và English explanation đều có.",
      "Content giữ register C1 formal.",
      ...replaceTerms(item.ledger_checks_vi.slice(0, 2), [[/Ledger/gi, "Bundle"]]),
    ],
    bundle_checks_en: [
      "Gurmukhi is the primary sample.",
      "Vietnamese and English explanations are present.",
      "Content keeps a formal C1 register.",
      ...replaceTerms(item.ledger_checks_en.slice(0, 2), [[/Ledger/gi, "Bundle"]]),
    ],
    pre_a11_bundle_checks_vi: [
      "Có thể gắn nhãn pre-A11-bundle.",
      "Không chạy A11 integration.",
      "Không có native-review claim.",
      ...replaceTerms(item.pre_a11_receipt_checks_vi.slice(0, 1), [[/receipt/gi, "bundle"]]),
    ],
    pre_a11_bundle_checks_en: [
      "Can be labeled pre-A11-bundle.",
      "Does not run A11 integration.",
      "No native-review claim.",
      ...replaceTerms(item.pre_a11_receipt_checks_en.slice(0, 1), [[/receipt/gi, "bundle"]]),
    ],
    receipt_notes_vi: replaceTerms(item.pre_a11_receipt_checks_vi, [[/receipt/gi, "bundle receipt"]]),
    receipt_notes_en: replaceTerms(item.pre_a11_receipt_checks_en, [[/receipt/gi, "bundle receipt"]]),
    ledger_notes_vi: item.ledger_checks_vi,
    ledger_notes_en: item.ledger_checks_en,
    pre_integration_notes_vi: [
      ...item.pre_integration_notes_vi,
      "Giữ static TypeScript data cho giai đoạn pre-integration.",
    ],
    pre_integration_notes_en: [
      ...item.pre_integration_notes_en,
      "Keep this as static TypeScript data for the pre-integration stage.",
    ],
    canada_example: item.canada_example,
    learner_traps_vi: [
      ...item.learner_traps_vi,
      "Đừng biến Shahmukhi awareness thành bài học script đầy đủ.",
      "Đừng ghi rằng native review đã xong.",
    ],
    learner_traps_en: [
      ...item.learner_traps_en,
      "Do not turn Shahmukhi awareness into a full script lesson.",
      "Do not state that native review is complete.",
    ],
  }),
);

export const punjabiC1BundleSamples = c1BundleSamples;

export default punjabiC1BundleSamples;
