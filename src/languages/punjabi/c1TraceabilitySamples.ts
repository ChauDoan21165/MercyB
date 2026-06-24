// Punjabi C1 traceability samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred. This is not A11 integration.

import {
  c1EvidenceReceiptSamples,
  c1EvidenceReceiptSamplesScriptAwareness,
  type PunjabiC1EvidenceReceiptArea,
  type PunjabiC1EvidenceReceiptSample,
} from "./c1EvidenceReceiptSamples";

export type PunjabiC1TraceabilityArea = PunjabiC1EvidenceReceiptArea;

export type PunjabiC1TraceabilityMode =
  | "traceability"
  | "pre_a11_traceability"
  | "evidence_receipt"
  | "completion_record"
  | "inventory_seal"
  | "catalog"
  | "pre_integration"
  | "public_service";

export type PunjabiC1TraceabilityPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1TraceabilitySample = {
  id: string;
  level: "C1";
  area: PunjabiC1TraceabilityArea;
  mode: PunjabiC1TraceabilityMode;
  goal_tag: string;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  traceability_prompt_vi: string;
  traceability_prompt_en: string;
  sample: PunjabiC1TraceabilityPhrase;
  traceability_checks_vi: readonly string[];
  traceability_checks_en: readonly string[];
  pre_a11_traceability_checks_vi: readonly string[];
  pre_a11_traceability_checks_en: readonly string[];
  evidence_receipt_notes_vi: readonly string[];
  evidence_receipt_notes_en: readonly string[];
  completion_record_notes_vi: readonly string[];
  completion_record_notes_en: readonly string[];
  pre_integration_notes_vi: readonly string[];
  pre_integration_notes_en: readonly string[];
  canada_example: PunjabiC1TraceabilityPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

const modeByArea: Record<PunjabiC1TraceabilityArea, PunjabiC1TraceabilityMode> = {
  source_summary: "traceability",
  cautious_claim: "pre_a11_traceability",
  evidence_comparison: "evidence_receipt",
  formal_correspondence: "completion_record",
  executive_summary: "inventory_seal",
  register_calibration: "catalog",
  presentation_response: "pre_integration",
  public_professional_tone: "public_service",
};

const goalByArea: Record<PunjabiC1TraceabilityArea, string> = {
  source_summary: "goal:c1-source-summary",
  cautious_claim: "goal:c1-cautious-claim",
  evidence_comparison: "goal:c1-evidence-comparison",
  formal_correspondence: "goal:c1-formal-correspondence",
  executive_summary: "goal:c1-executive-summary",
  register_calibration: "goal:c1-register-calibration",
  presentation_response: "goal:c1-presentation-response",
  public_professional_tone: "goal:c1-public-professional-tone",
};

function replaceTerms(items: readonly string[], replacements: Array<[RegExp, string]>): readonly string[] {
  return items.map((item) =>
    replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), item),
  );
}

export const c1TraceabilitySamplesScriptAwareness = {
  vi: `${c1EvidenceReceiptSamplesScriptAwareness.vi} Traceability chỉ nối mục với goal; Shahmukhi vẫn ở mức awareness.`,
  en: `${c1EvidenceReceiptSamplesScriptAwareness.en} Traceability only connects items to goals; Shahmukhi remains awareness-only.`,
} as const;

export const c1TraceabilitySamples: PunjabiC1TraceabilitySample[] = c1EvidenceReceiptSamples.map(
  (item: PunjabiC1EvidenceReceiptSample) => ({
    id: item.id.replace("evidence_receipt", "traceability"),
    level: "C1",
    area: item.area,
    mode: modeByArea[item.area],
    goal_tag: goalByArea[item.area],
    title_pa: `Traceability: ${item.title_pa.replace(/evidence receipt/gi, "traceability")}`,
    title_rom: `traceability: ${item.title_rom.replace(/evidence receipt/gi, "traceability")}`,
    title_vi: `Traceability: ${item.title_vi.replace(/evidence receipt/gi, "traceability")}`,
    title_en: `Traceability: ${item.title_en.replace(/evidence receipt/gi, "traceability")}`,
    traceability_prompt_vi: `${item.evidence_receipt_prompt_vi} Nối mục này với ${goalByArea[item.area]} như pre-A11-traceability, không chạy A11 integration.`,
    traceability_prompt_en: `${item.evidence_receipt_prompt_en} Link this item to ${goalByArea[item.area]} as pre-A11-traceability, without running A11 integration.`,
    sample: item.sample,
    traceability_checks_vi: [
      "Traceability có id ổn định.",
      "Goal tag rõ và gắn với area C1.",
      "Gurmukhi là primary sample.",
      "Romanization chỉ hỗ trợ người học.",
      "Vietnamese và English explanation đều có.",
      "Canada example còn nguyên.",
      "Traceability không khẳng định native review.",
      "Traceability giữ được evidence receipt trước đó.",
      ...replaceTerms(item.evidence_receipt_checks_vi.slice(0, 1), [[/Evidence receipt/gi, "Traceability"]]),
    ],
    traceability_checks_en: [
      "Traceability has a stable id.",
      "Goal tag is clear and attached to the C1 area.",
      "Gurmukhi is the primary sample.",
      "Romanization is only a learner aid.",
      "Vietnamese and English explanations are both present.",
      "Canada example is preserved.",
      "Traceability does not claim native review.",
      "Traceability keeps the earlier evidence receipt.",
      ...replaceTerms(item.evidence_receipt_checks_en.slice(0, 1), [[/Evidence receipt/gi, "Traceability"]]),
    ],
    pre_a11_traceability_checks_vi: [
      "Có thể gắn nhãn pre-A11-traceability.",
      "Không chạy A11 integration.",
      "Không có native-review claim.",
      "Native review được để sau.",
      "Không thêm audio hoặc pronunciation scoring.",
      "Không chạm auth, billing, RLS, Supabase, Azure, CI config.",
      "Chỉ xác nhận static TypeScript data và goal mapping.",
      "Không deploy hoặc push.",
      ...replaceTerms(item.pre_a11_evidence_receipt_checks_vi.slice(0, 1), [
        [/evidence-receipt/gi, "traceability"],
      ]),
    ],
    pre_a11_traceability_checks_en: [
      "Can be labeled pre-A11-traceability.",
      "Does not run A11 integration.",
      "No native-review claim.",
      "Native review is deferred.",
      "Does not add audio or pronunciation scoring.",
      "Does not touch auth, billing, RLS, Supabase, Azure, or CI config.",
      "Only confirms static TypeScript data and goal mapping.",
      "No deploy or push.",
      ...replaceTerms(item.pre_a11_evidence_receipt_checks_en.slice(0, 1), [
        [/evidence-receipt/gi, "traceability"],
      ]),
    ],
    evidence_receipt_notes_vi: replaceTerms(item.evidence_receipt_checks_vi, [
      [/Evidence receipt/gi, "Traceability evidence receipt"],
    ]),
    evidence_receipt_notes_en: replaceTerms(item.evidence_receipt_checks_en, [
      [/Evidence receipt/gi, "Traceability evidence receipt"],
    ]),
    completion_record_notes_vi: item.completion_record_notes_vi,
    completion_record_notes_en: item.completion_record_notes_en,
    pre_integration_notes_vi: [
      ...item.pre_integration_notes_vi,
      "Traceability vẫn là app-consumable TypeScript data.",
    ],
    pre_integration_notes_en: [
      ...item.pre_integration_notes_en,
      "Traceability remains app-consumable TypeScript data.",
    ],
    canada_example: item.canada_example,
    learner_traps_vi: [
      ...item.learner_traps_vi,
      "Đừng hiểu traceability là A11 integration đã chạy.",
      "Đừng hiểu traceability là native review đã hoàn tất.",
      "Đừng gắn goal tag sai với area C1.",
    ],
    learner_traps_en: [
      ...item.learner_traps_en,
      "Do not treat traceability as completed A11 integration.",
      "Do not treat traceability as completed native review.",
      "Do not attach the wrong goal tag to the C1 area.",
    ],
  }),
);

export const punjabiC1TraceabilitySamples = c1TraceabilitySamples;

export default punjabiC1TraceabilitySamples;
