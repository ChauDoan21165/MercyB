// Punjabi A1 audit trail samples for Vietnamese-speaking and English-speaking
// learners.
// Gurmukhi is primary; romanization supports recognition. Shahmukhi is
// awareness only, not a full course. Native review is deferred.

import {
  punjabiA1TraceabilitySamples,
  type PunjabiA1TraceabilityDomain,
} from "./a1TraceabilitySamples";

export type PunjabiA1AuditTrailDomain = PunjabiA1TraceabilityDomain;

export type PunjabiA1AuditTrailStyle =
  | "pre_a11_audit_trail"
  | "traceability"
  | "evidence_receipt"
  | "completion_record"
  | "inventory_seal"
  | "catalog"
  | "pre_integration"
  | "readiness_check";

export type PunjabiA1AuditTrailSample = {
  id: string;
  domain: PunjabiA1AuditTrailDomain;
  style: PunjabiA1AuditTrailStyle;
  audit_goal_vi: string;
  audit_goal_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  audit_note_vi: string;
  audit_note_en: string;
  learner_trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: string;
  source_traceability_id: string;
  source_evidence_receipt_id: string;
  source_completion_record_id: string;
  source_inventory_seal_id: string;
  source_catalog_id: string;
  audit_artifacts: string[];
};

const styleByDomain: Record<
  PunjabiA1AuditTrailDomain,
  PunjabiA1AuditTrailStyle
> = {
  greetings: "pre_a11_audit_trail",
  identity: "traceability",
  family: "completion_record",
  numbers: "inventory_seal",
  prices: "evidence_receipt",
  food: "pre_integration",
  directions: "catalog",
  help: "pre_a11_audit_trail",
  repetition: "pre_integration",
  politeness: "traceability",
  gurmukhi_recognition: "readiness_check",
  romanization_bridge: "completion_record",
  canada_service_counter: "inventory_seal",
};

const auditNotesByDomain: Record<
  PunjabiA1AuditTrailDomain,
  { vi: string; en: string }
> = {
  greetings: {
    vi: "Audit trail xác nhận câu chào A1 còn là mẫu pre-A11 Gurmukhi.",
    en: "Audit trail confirms the A1 greeting remains a pre-A11 Gurmukhi sample.",
  },
  identity: {
    vi: "Audit trail nối mục tiêu nói tên tới traceability và evidence receipt.",
    en: "Audit trail links the name goal to traceability and evidence receipt.",
  },
  family: {
    vi: "Audit trail giữ mẫu gia đình ngắn qua completion record.",
    en: "Audit trail keeps the short family sample through the completion record.",
  },
  numbers: {
    vi: "Audit trail nối số lượng tới inventory seal cho vé và ledger.",
    en: "Audit trail links quantity to inventory seal for tickets and ledger use.",
  },
  prices: {
    vi: "Audit trail giữ bằng chứng câu hỏi giá ở quầy thanh toán Canada.",
    en: "Audit trail keeps evidence for the price question at Canadian checkout counters.",
  },
  food: {
    vi: "Audit trail nối mẫu nhu cầu đồ uống tới pre-integration menu.",
    en: "Audit trail links the drink-need sample to menu pre-integration.",
  },
  directions: {
    vi: "Audit trail nối câu hỏi đường tới catalog vị trí Canada.",
    en: "Audit trail links the direction question to the Canada location catalog.",
  },
  help: {
    vi: "Audit trail giữ câu xin giúp đỡ như mẫu cứu nguy pre-A11.",
    en: "Audit trail keeps the help request as a pre-A11 rescue sample.",
  },
  repetition: {
    vi: "Audit trail nối câu xin lặp lại tới hội thoại pre-integration.",
    en: "Audit trail links the repetition request to conversation pre-integration.",
  },
  politeness: {
    vi: "Audit trail nối lịch sự tối thiểu tới lớp, thư viện, và quầy dịch vụ.",
    en: "Audit trail links minimum politeness to class, library, and counter use.",
  },
  gurmukhi_recognition: {
    vi: "Audit trail xác nhận readiness dựa trên Gurmukhi, không chỉ romanization.",
    en: "Audit trail confirms readiness based on Gurmukhi, not romanization only.",
  },
  romanization_bridge: {
    vi: "Audit trail giữ romanization là cầu nối tạm và quay lại Gurmukhi.",
    en: "Audit trail keeps romanization as a temporary bridge and returns to Gurmukhi.",
  },
  canada_service_counter: {
    vi: "Audit trail nối mẫu quầy dịch vụ Canada tới form, trường, và phòng khám.",
    en: "Audit trail links the Canadian service-counter sample to forms, schools, and clinics.",
  },
};

export const auditTrailScriptAwareness =
  "Gurmukhi is the primary script for this Punjabi A1 audit trail set. Shahmukhi is awareness only, not a full course track. Native review is deferred.";

export const punjabiA1AuditTrailSamples: PunjabiA1AuditTrailSample[] =
  punjabiA1TraceabilitySamples.map((item) => {
    const auditNote = auditNotesByDomain[item.domain];

    return {
      id: item.id.replace("pa_a1_traceability_", "pa_a1_audit_trail_"),
      domain: item.domain,
      style: styleByDomain[item.domain],
      audit_goal_vi: item.learner_goal_vi,
      audit_goal_en: item.learner_goal_en,
      cue_pa: item.cue_pa,
      romanization: item.romanization,
      meaning_vi: item.meaning_vi,
      meaning_en: item.meaning_en,
      audit_note_vi: `${auditNote.vi} Traceability: ${item.trace_note_vi}`,
      audit_note_en: `${auditNote.en} Traceability: ${item.trace_note_en}`,
      learner_trap: item.learner_trap,
      canada_practical: item.canada_practical,
      source_traceability_id: item.id,
      source_evidence_receipt_id: item.source_evidence_receipt_id,
      source_completion_record_id: item.source_completion_record_id,
      source_inventory_seal_id: item.source_inventory_seal_id,
      source_catalog_id: item.source_catalog_id,
      audit_artifacts: [
        item.id,
        item.source_evidence_receipt_id,
        item.source_completion_record_id,
        item.source_inventory_seal_id,
        item.source_catalog_id,
        ...item.trace_artifacts,
      ],
    };
  });

export default punjabiA1AuditTrailSamples;
