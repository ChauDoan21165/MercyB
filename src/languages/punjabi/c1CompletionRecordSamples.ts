// Punjabi C1 completion record samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred. This is not A11 integration.

import {
  c1InventorySealSamples,
  c1InventorySealSamplesScriptAwareness,
  type PunjabiC1InventorySealArea,
  type PunjabiC1InventorySealSample,
} from "./c1InventorySealSamples";

export type PunjabiC1CompletionRecordArea = PunjabiC1InventorySealArea;

export type PunjabiC1CompletionRecordMode =
  | "completion_record"
  | "pre_a11_completion_record"
  | "inventory_seal"
  | "catalog"
  | "bundle"
  | "receipt"
  | "pre_integration"
  | "public_service";

export type PunjabiC1CompletionRecordPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1CompletionRecordSample = {
  id: string;
  level: "C1";
  area: PunjabiC1CompletionRecordArea;
  mode: PunjabiC1CompletionRecordMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  completion_record_prompt_vi: string;
  completion_record_prompt_en: string;
  sample: PunjabiC1CompletionRecordPhrase;
  completion_record_checks_vi: readonly string[];
  completion_record_checks_en: readonly string[];
  pre_a11_completion_record_checks_vi: readonly string[];
  pre_a11_completion_record_checks_en: readonly string[];
  inventory_seal_notes_vi: readonly string[];
  inventory_seal_notes_en: readonly string[];
  catalog_notes_vi: readonly string[];
  catalog_notes_en: readonly string[];
  pre_integration_notes_vi: readonly string[];
  pre_integration_notes_en: readonly string[];
  canada_example: PunjabiC1CompletionRecordPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

const modeByArea: Record<PunjabiC1CompletionRecordArea, PunjabiC1CompletionRecordMode> = {
  source_summary: "completion_record",
  cautious_claim: "pre_a11_completion_record",
  evidence_comparison: "inventory_seal",
  formal_correspondence: "receipt",
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

export const c1CompletionRecordSamplesScriptAwareness = {
  vi: `${c1InventorySealSamplesScriptAwareness.vi} Completion record chỉ ghi nhận trạng thái dữ liệu; Shahmukhi không được dạy như course riêng.`,
  en: `${c1InventorySealSamplesScriptAwareness.en} The completion record only records data status; Shahmukhi is not taught as a separate course.`,
} as const;

export const c1CompletionRecordSamples: PunjabiC1CompletionRecordSample[] = c1InventorySealSamples.map(
  (item: PunjabiC1InventorySealSample) => ({
    id: item.id.replace("inventory_seal", "completion_record"),
    level: "C1",
    area: item.area,
    mode: modeByArea[item.area],
    title_pa: `Completion record: ${item.title_pa.replace(/inventory seal/gi, "completion record")}`,
    title_rom: `completion record: ${item.title_rom.replace(/inventory seal/gi, "completion record")}`,
    title_vi: `Completion record: ${item.title_vi.replace(/inventory seal/gi, "completion record")}`,
    title_en: `Completion record: ${item.title_en.replace(/inventory seal/gi, "completion record")}`,
    completion_record_prompt_vi: `${item.inventory_seal_prompt_vi} Ghi lại như pre-A11-completion-record để kiểm tra readiness mà không chạy integration.`,
    completion_record_prompt_en: `${item.inventory_seal_prompt_en} Record it as a pre-A11-completion-record for readiness checking without running integration.`,
    sample: item.sample,
    completion_record_checks_vi: [
      "Completion record có id ổn định.",
      "Area C1 được giữ nguyên.",
      "Gurmukhi là primary sample.",
      "Romanization chỉ hỗ trợ người học.",
      "Vietnamese và English explanation đều có.",
      "Canada example còn nguyên.",
      ...replaceTerms(item.inventory_seal_checks_vi.slice(0, 1), [[/Inventory seal/gi, "Completion record"]]),
    ],
    completion_record_checks_en: [
      "Completion record has a stable id.",
      "C1 area is preserved.",
      "Gurmukhi is the primary sample.",
      "Romanization is only a learner aid.",
      "Vietnamese and English explanations are both present.",
      "Canada example is preserved.",
      ...replaceTerms(item.inventory_seal_checks_en.slice(0, 1), [[/Inventory seal/gi, "Completion record"]]),
    ],
    pre_a11_completion_record_checks_vi: [
      "Có thể gắn nhãn pre-A11-completion-record.",
      "Không chạy A11 integration.",
      "Không có native-review claim.",
      "Native review được để sau.",
      "Không thêm audio hoặc pronunciation scoring.",
      "Không chạm auth, billing, RLS, Supabase, Azure, CI config.",
      ...replaceTerms(item.pre_a11_inventory_seal_checks_vi.slice(0, 1), [
        [/inventory-seal/gi, "completion-record"],
      ]),
    ],
    pre_a11_completion_record_checks_en: [
      "Can be labeled pre-A11-completion-record.",
      "Does not run A11 integration.",
      "No native-review claim.",
      "Native review is deferred.",
      "Does not add audio or pronunciation scoring.",
      "Does not touch auth, billing, RLS, Supabase, Azure, or CI config.",
      ...replaceTerms(item.pre_a11_inventory_seal_checks_en.slice(0, 1), [
        [/inventory-seal/gi, "completion-record"],
      ]),
    ],
    inventory_seal_notes_vi: replaceTerms(item.inventory_seal_checks_vi, [
      [/Inventory seal/gi, "Completion inventory seal"],
    ]),
    inventory_seal_notes_en: replaceTerms(item.inventory_seal_checks_en, [
      [/Inventory seal/gi, "Completion inventory seal"],
    ]),
    catalog_notes_vi: item.catalog_notes_vi,
    catalog_notes_en: item.catalog_notes_en,
    pre_integration_notes_vi: [
      ...item.pre_integration_notes_vi,
      "Completion record vẫn là app-consumable TypeScript data.",
    ],
    pre_integration_notes_en: [
      ...item.pre_integration_notes_en,
      "The completion record remains app-consumable TypeScript data.",
    ],
    canada_example: item.canada_example,
    learner_traps_vi: [
      ...item.learner_traps_vi,
      "Đừng hiểu completion record là A11 integration đã chạy.",
      "Đừng hiểu completion record là native review đã hoàn tất.",
    ],
    learner_traps_en: [
      ...item.learner_traps_en,
      "Do not treat the completion record as completed A11 integration.",
      "Do not treat the completion record as completed native review.",
    ],
  }),
);

export const punjabiC1CompletionRecordSamples = c1CompletionRecordSamples;

export default punjabiC1CompletionRecordSamples;
