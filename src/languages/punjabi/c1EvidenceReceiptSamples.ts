// Punjabi C1 evidence receipt samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred. This is not A11 integration.

import {
  c1CompletionRecordSamples,
  c1CompletionRecordSamplesScriptAwareness,
  type PunjabiC1CompletionRecordArea,
  type PunjabiC1CompletionRecordSample,
} from "./c1CompletionRecordSamples";

export type PunjabiC1EvidenceReceiptArea = PunjabiC1CompletionRecordArea;

export type PunjabiC1EvidenceReceiptMode =
  | "evidence_receipt"
  | "pre_a11_evidence_receipt"
  | "completion_record"
  | "inventory_seal"
  | "catalog"
  | "bundle"
  | "pre_integration"
  | "public_service";

export type PunjabiC1EvidenceReceiptPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1EvidenceReceiptSample = {
  id: string;
  level: "C1";
  area: PunjabiC1EvidenceReceiptArea;
  mode: PunjabiC1EvidenceReceiptMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  evidence_receipt_prompt_vi: string;
  evidence_receipt_prompt_en: string;
  sample: PunjabiC1EvidenceReceiptPhrase;
  evidence_receipt_checks_vi: readonly string[];
  evidence_receipt_checks_en: readonly string[];
  pre_a11_evidence_receipt_checks_vi: readonly string[];
  pre_a11_evidence_receipt_checks_en: readonly string[];
  completion_record_notes_vi: readonly string[];
  completion_record_notes_en: readonly string[];
  inventory_seal_notes_vi: readonly string[];
  inventory_seal_notes_en: readonly string[];
  pre_integration_notes_vi: readonly string[];
  pre_integration_notes_en: readonly string[];
  canada_example: PunjabiC1EvidenceReceiptPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

const modeByArea: Record<PunjabiC1EvidenceReceiptArea, PunjabiC1EvidenceReceiptMode> = {
  source_summary: "evidence_receipt",
  cautious_claim: "pre_a11_evidence_receipt",
  evidence_comparison: "completion_record",
  formal_correspondence: "inventory_seal",
  executive_summary: "bundle",
  register_calibration: "catalog",
  presentation_response: "pre_integration",
  public_professional_tone: "public_service",
};

function replaceTerms(items: readonly string[], replacements: Array<[RegExp, string]>): readonly string[] {
  return items.map((item) =>
    replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), item),
  );
}

export const c1EvidenceReceiptSamplesScriptAwareness = {
  vi: `${c1CompletionRecordSamplesScriptAwareness.vi} Evidence receipt chỉ giữ dấu vết dữ liệu tĩnh; không biến Shahmukhi thành course.`,
  en: `${c1CompletionRecordSamplesScriptAwareness.en} The evidence receipt only preserves static data evidence; it does not turn Shahmukhi into a course.`,
} as const;

export const c1EvidenceReceiptSamples: PunjabiC1EvidenceReceiptSample[] = c1CompletionRecordSamples.map(
  (item: PunjabiC1CompletionRecordSample) => ({
    id: item.id.replace("completion_record", "evidence_receipt"),
    level: "C1",
    area: item.area,
    mode: modeByArea[item.area],
    title_pa: `Evidence receipt: ${item.title_pa.replace(/completion record/gi, "evidence receipt")}`,
    title_rom: `evidence receipt: ${item.title_rom.replace(/completion record/gi, "evidence receipt")}`,
    title_vi: `Evidence receipt: ${item.title_vi.replace(/completion record/gi, "evidence receipt")}`,
    title_en: `Evidence receipt: ${item.title_en.replace(/completion record/gi, "evidence receipt")}`,
    evidence_receipt_prompt_vi: `${item.completion_record_prompt_vi} Lưu như pre-A11-evidence-receipt để chứng minh coverage mà không chạy A11 integration.`,
    evidence_receipt_prompt_en: `${item.completion_record_prompt_en} Save it as a pre-A11-evidence-receipt to prove coverage without running A11 integration.`,
    sample: item.sample,
    evidence_receipt_checks_vi: [
      "Evidence receipt có id ổn định.",
      "Area C1 được giữ nguyên.",
      "Gurmukhi là primary sample.",
      "Romanization chỉ hỗ trợ người học.",
      "Vietnamese và English explanation đều có.",
      "Canada example còn nguyên.",
      "Evidence trail không khẳng định native review.",
      ...replaceTerms(item.completion_record_checks_vi.slice(0, 1), [[/Completion record/gi, "Evidence receipt"]]),
    ],
    evidence_receipt_checks_en: [
      "Evidence receipt has a stable id.",
      "C1 area is preserved.",
      "Gurmukhi is the primary sample.",
      "Romanization is only a learner aid.",
      "Vietnamese and English explanations are both present.",
      "Canada example is preserved.",
      "Evidence trail does not claim native review.",
      ...replaceTerms(item.completion_record_checks_en.slice(0, 1), [[/Completion record/gi, "Evidence receipt"]]),
    ],
    pre_a11_evidence_receipt_checks_vi: [
      "Có thể gắn nhãn pre-A11-evidence-receipt.",
      "Không chạy A11 integration.",
      "Không có native-review claim.",
      "Native review được để sau.",
      "Không thêm audio hoặc pronunciation scoring.",
      "Không chạm auth, billing, RLS, Supabase, Azure, CI config.",
      "Chỉ xác nhận static TypeScript data.",
      ...replaceTerms(item.pre_a11_completion_record_checks_vi.slice(0, 1), [
        [/completion-record/gi, "evidence-receipt"],
      ]),
    ],
    pre_a11_evidence_receipt_checks_en: [
      "Can be labeled pre-A11-evidence-receipt.",
      "Does not run A11 integration.",
      "No native-review claim.",
      "Native review is deferred.",
      "Does not add audio or pronunciation scoring.",
      "Does not touch auth, billing, RLS, Supabase, Azure, or CI config.",
      "Only confirms static TypeScript data.",
      ...replaceTerms(item.pre_a11_completion_record_checks_en.slice(0, 1), [
        [/completion-record/gi, "evidence-receipt"],
      ]),
    ],
    completion_record_notes_vi: replaceTerms(item.completion_record_checks_vi, [
      [/Completion record/gi, "Evidence completion record"],
    ]),
    completion_record_notes_en: replaceTerms(item.completion_record_checks_en, [
      [/Completion record/gi, "Evidence completion record"],
    ]),
    inventory_seal_notes_vi: item.inventory_seal_notes_vi,
    inventory_seal_notes_en: item.inventory_seal_notes_en,
    pre_integration_notes_vi: [
      ...item.pre_integration_notes_vi,
      "Evidence receipt vẫn là app-consumable TypeScript data.",
    ],
    pre_integration_notes_en: [
      ...item.pre_integration_notes_en,
      "The evidence receipt remains app-consumable TypeScript data.",
    ],
    canada_example: item.canada_example,
    learner_traps_vi: [
      ...item.learner_traps_vi,
      "Đừng hiểu evidence receipt là A11 integration đã chạy.",
      "Đừng hiểu evidence receipt là native review đã hoàn tất.",
    ],
    learner_traps_en: [
      ...item.learner_traps_en,
      "Do not treat the evidence receipt as completed A11 integration.",
      "Do not treat the evidence receipt as completed native review.",
    ],
  }),
);

export const punjabiC1EvidenceReceiptSamples = c1EvidenceReceiptSamples;

export default punjabiC1EvidenceReceiptSamples;
