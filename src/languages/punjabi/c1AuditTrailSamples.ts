// Punjabi C1 audit-trail samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred. This is not A11 integration.

import {
  c1TraceabilitySamples,
  c1TraceabilitySamplesScriptAwareness,
  type PunjabiC1TraceabilityArea,
  type PunjabiC1TraceabilitySample,
} from "./c1TraceabilitySamples";

export type PunjabiC1AuditTrailArea = PunjabiC1TraceabilityArea;

export type PunjabiC1AuditTrailMode =
  | "audit_trail"
  | "pre_a11_audit_trail"
  | "traceability"
  | "evidence_receipt"
  | "completion_record"
  | "inventory_seal"
  | "pre_integration"
  | "public_service";

export type PunjabiC1AuditTrailPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1AuditTrailSample = {
  id: string;
  level: "C1";
  area: PunjabiC1AuditTrailArea;
  mode: PunjabiC1AuditTrailMode;
  goal_tag: string;
  audit_tag: string;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  audit_trail_prompt_vi: string;
  audit_trail_prompt_en: string;
  sample: PunjabiC1AuditTrailPhrase;
  audit_trail_checks_vi: readonly string[];
  audit_trail_checks_en: readonly string[];
  pre_a11_audit_trail_checks_vi: readonly string[];
  pre_a11_audit_trail_checks_en: readonly string[];
  traceability_notes_vi: readonly string[];
  traceability_notes_en: readonly string[];
  evidence_receipt_notes_vi: readonly string[];
  evidence_receipt_notes_en: readonly string[];
  pre_integration_notes_vi: readonly string[];
  pre_integration_notes_en: readonly string[];
  canada_example: PunjabiC1AuditTrailPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

const modeByArea: Record<PunjabiC1AuditTrailArea, PunjabiC1AuditTrailMode> = {
  source_summary: "audit_trail",
  cautious_claim: "pre_a11_audit_trail",
  evidence_comparison: "traceability",
  formal_correspondence: "evidence_receipt",
  executive_summary: "completion_record",
  register_calibration: "inventory_seal",
  presentation_response: "pre_integration",
  public_professional_tone: "public_service",
};

function replaceTerms(items: readonly string[], replacements: Array<[RegExp, string]>): readonly string[] {
  return items.map((item) =>
    replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), item),
  );
}

export const c1AuditTrailSamplesScriptAwareness = {
  vi: `${c1TraceabilitySamplesScriptAwareness.vi} Audit trail chỉ ghi dấu kiểm tra dữ liệu; Shahmukhi vẫn chỉ là awareness.`,
  en: `${c1TraceabilitySamplesScriptAwareness.en} The audit trail only records data checks; Shahmukhi remains awareness-only.`,
} as const;

export const c1AuditTrailSamples: PunjabiC1AuditTrailSample[] = c1TraceabilitySamples.map(
  (item: PunjabiC1TraceabilitySample) => ({
    id: item.id.replace("traceability", "audit_trail"),
    level: "C1",
    area: item.area,
    mode: modeByArea[item.area],
    goal_tag: item.goal_tag,
    audit_tag: `audit:${item.goal_tag.replace("goal:", "")}`,
    title_pa: `Audit trail: ${item.title_pa.replace(/traceability/gi, "audit trail")}`,
    title_rom: `audit trail: ${item.title_rom.replace(/traceability/gi, "audit trail")}`,
    title_vi: `Audit trail: ${item.title_vi.replace(/traceability/gi, "audit trail")}`,
    title_en: `Audit trail: ${item.title_en.replace(/traceability/gi, "audit trail")}`,
    audit_trail_prompt_vi: `${item.traceability_prompt_vi} Ghi lại ${item.goal_tag} như pre-A11-audit-trail, không chạy A11 integration.`,
    audit_trail_prompt_en: `${item.traceability_prompt_en} Record ${item.goal_tag} as a pre-A11-audit-trail, without running A11 integration.`,
    sample: item.sample,
    audit_trail_checks_vi: [
      "Audit trail có id ổn định.",
      "Audit tag rõ và nối với goal tag.",
      "Area C1 được giữ nguyên.",
      "Gurmukhi là primary sample.",
      "Romanization chỉ hỗ trợ người học.",
      "Vietnamese và English explanation đều có.",
      "Canada example còn nguyên.",
      "Audit trail không khẳng định native review.",
      "Audit trail giữ traceability và evidence receipt trước đó.",
      ...replaceTerms(item.traceability_checks_vi.slice(0, 1), [[/Traceability/gi, "Audit trail"]]),
    ],
    audit_trail_checks_en: [
      "Audit trail has a stable id.",
      "Audit tag is clear and linked to the goal tag.",
      "C1 area is preserved.",
      "Gurmukhi is the primary sample.",
      "Romanization is only a learner aid.",
      "Vietnamese and English explanations are both present.",
      "Canada example is preserved.",
      "Audit trail does not claim native review.",
      "Audit trail keeps the earlier traceability and evidence receipt.",
      ...replaceTerms(item.traceability_checks_en.slice(0, 1), [[/Traceability/gi, "Audit trail"]]),
    ],
    pre_a11_audit_trail_checks_vi: [
      "Có thể gắn nhãn pre-A11-audit-trail.",
      "Không chạy A11 integration.",
      "Không có native-review claim.",
      "Native review được để sau.",
      "Không thêm audio hoặc pronunciation scoring.",
      "Không chạm auth, billing, RLS, Supabase, Azure, CI config.",
      "Chỉ xác nhận static TypeScript data, goal mapping và audit tag.",
      "Không deploy hoặc push.",
      "Không tạo WAVE file mới.",
      ...replaceTerms(item.pre_a11_traceability_checks_vi.slice(0, 1), [[/traceability/gi, "audit-trail"]]),
    ],
    pre_a11_audit_trail_checks_en: [
      "Can be labeled pre-A11-audit-trail.",
      "Does not run A11 integration.",
      "No native-review claim.",
      "Native review is deferred.",
      "Does not add audio or pronunciation scoring.",
      "Does not touch auth, billing, RLS, Supabase, Azure, or CI config.",
      "Only confirms static TypeScript data, goal mapping, and audit tag.",
      "No deploy or push.",
      "Does not create a new WAVE file.",
      ...replaceTerms(item.pre_a11_traceability_checks_en.slice(0, 1), [[/traceability/gi, "audit-trail"]]),
    ],
    traceability_notes_vi: replaceTerms(item.traceability_checks_vi, [[/Traceability/gi, "Audit traceability"]]),
    traceability_notes_en: replaceTerms(item.traceability_checks_en, [[/Traceability/gi, "Audit traceability"]]),
    evidence_receipt_notes_vi: item.evidence_receipt_notes_vi,
    evidence_receipt_notes_en: item.evidence_receipt_notes_en,
    pre_integration_notes_vi: [
      ...item.pre_integration_notes_vi,
      "Audit trail vẫn là app-consumable TypeScript data.",
    ],
    pre_integration_notes_en: [
      ...item.pre_integration_notes_en,
      "Audit trail remains app-consumable TypeScript data.",
    ],
    canada_example: item.canada_example,
    learner_traps_vi: [
      ...item.learner_traps_vi,
      "Đừng hiểu audit trail là A11 integration đã chạy.",
      "Đừng hiểu audit trail là native review đã hoàn tất.",
      "Đừng tách audit tag khỏi goal tag.",
    ],
    learner_traps_en: [
      ...item.learner_traps_en,
      "Do not treat audit trail as completed A11 integration.",
      "Do not treat audit trail as completed native review.",
      "Do not separate the audit tag from the goal tag.",
    ],
  }),
);

export const punjabiC1AuditTrailSamples = c1AuditTrailSamples;

export default punjabiC1AuditTrailSamples;
