// Punjabi A1 traceability samples for Vietnamese-speaking and English-speaking
// learners.
// Gurmukhi is primary; romanization supports recognition. Shahmukhi is
// awareness only, not a full course. Native review is deferred.

import {
  punjabiA1EvidenceReceiptSamples,
  type PunjabiA1EvidenceReceiptDomain,
} from "./a1EvidenceReceiptSamples";

export type PunjabiA1TraceabilityDomain = PunjabiA1EvidenceReceiptDomain;

export type PunjabiA1TraceabilityStyle =
  | "pre_a11_traceability"
  | "evidence_receipt"
  | "completion_record"
  | "inventory_seal"
  | "catalog"
  | "archive_copy"
  | "pre_integration"
  | "readiness_check";

export type PunjabiA1TraceabilitySample = {
  id: string;
  domain: PunjabiA1TraceabilityDomain;
  style: PunjabiA1TraceabilityStyle;
  learner_goal_vi: string;
  learner_goal_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  trace_note_vi: string;
  trace_note_en: string;
  learner_trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: string;
  source_evidence_receipt_id: string;
  source_completion_record_id: string;
  source_inventory_seal_id: string;
  source_catalog_id: string;
  trace_artifacts: string[];
};

const styleByDomain: Record<
  PunjabiA1TraceabilityDomain,
  PunjabiA1TraceabilityStyle
> = {
  greetings: "pre_a11_traceability",
  identity: "completion_record",
  family: "archive_copy",
  numbers: "inventory_seal",
  prices: "evidence_receipt",
  food: "pre_integration",
  directions: "catalog",
  help: "pre_a11_traceability",
  repetition: "pre_integration",
  politeness: "completion_record",
  gurmukhi_recognition: "readiness_check",
  romanization_bridge: "archive_copy",
  canada_service_counter: "inventory_seal",
};

const goalByDomain: Record<
  PunjabiA1TraceabilityDomain,
  { vi: string; en: string; note_vi: string; note_en: string }
> = {
  greetings: {
    vi: "Người học có thể chào đơn giản bằng Punjabi.",
    en: "Learner can give a simple greeting in Punjabi.",
    note_vi: "Trace mục tiêu chào hỏi tới evidence receipt và mẫu pre-A11.",
    note_en: "Trace the greeting goal to the evidence receipt and pre-A11 sample.",
  },
  identity: {
    vi: "Người học có thể nói tên và hỏi tên.",
    en: "Learner can say their name and ask for a name.",
    note_vi: "Trace khung danh tính tới completion record để giữ thứ tự câu.",
    note_en: "Trace the identity frame to the completion record to preserve sentence order.",
  },
  family: {
    vi: "Người học có thể nói một câu gia đình rất ngắn.",
    en: "Learner can say one very short family sentence.",
    note_vi: "Trace mẫu gia đình tới archive để mở rộng sau này.",
    note_en: "Trace the family sample to the archive for later expansion.",
  },
  numbers: {
    vi: "Người học nhận ra số lượng cơ bản trong tình huống vé.",
    en: "Learner recognizes a basic quantity in a ticket situation.",
    note_vi: "Trace số lượng tới inventory seal và ledger-ready evidence.",
    note_en: "Trace the quantity to inventory seal and ledger-ready evidence.",
  },
  prices: {
    vi: "Người học có thể hỏi giá ngắn ở quầy.",
    en: "Learner can ask a short price question at a counter.",
    note_vi: "Trace câu hỏi giá tới evidence receipt cho quầy thanh toán Canada.",
    note_en: "Trace the price question to evidence receipt for Canadian checkout counters.",
  },
  food: {
    vi: "Người học có thể nói nhu cầu đồ uống đơn giản.",
    en: "Learner can state a simple drink need.",
    note_vi: "Trace mẫu food tới pre-integration để nối sang bài menu.",
    note_en: "Trace the food sample to pre-integration for later menu lessons.",
  },
  directions: {
    vi: "Người học có thể hỏi vị trí trạm xe buýt.",
    en: "Learner can ask where the bus stop is.",
    note_vi: "Trace câu hỏi đường tới catalog vị trí và ví dụ Canada.",
    note_en: "Trace the direction question to the location catalog and Canada example.",
  },
  help: {
    vi: "Người học có thể xin giúp đỡ khi bị kẹt.",
    en: "Learner can ask for help when stuck.",
    note_vi: "Trace câu cứu nguy tới evidence receipt pre-A11.",
    note_en: "Trace the rescue phrase to the pre-A11 evidence receipt.",
  },
  repetition: {
    vi: "Người học có thể xin người khác nói lại.",
    en: "Learner can ask someone to say it again.",
    note_vi: "Trace câu lặp lại tới pre-integration hội thoại.",
    note_en: "Trace the repetition request to conversation pre-integration.",
  },
  politeness: {
    vi: "Người học dùng lịch sự tối thiểu ở lớp hoặc quầy.",
    en: "Learner uses minimum politeness in class or at a counter.",
    note_vi: "Trace lịch sự tới completion record cho tình huống dịch vụ.",
    note_en: "Trace politeness to the completion record for service situations.",
  },
  gurmukhi_recognition: {
    vi: "Người học nhận ra Gurmukhi là chữ chính.",
    en: "Learner recognizes Gurmukhi as the primary script.",
    note_vi: "Trace readiness tới chữ Gurmukhi, không học chỉ bằng romanization.",
    note_en: "Trace readiness to Gurmukhi text, not romanization-only study.",
  },
  romanization_bridge: {
    vi: "Người học dùng romanization như cầu nối tạm.",
    en: "Learner uses romanization as a temporary bridge.",
    note_vi: "Trace cầu nối romanization nhưng quay lại Gurmukhi.",
    note_en: "Trace the romanization bridge while returning to Gurmukhi.",
  },
  canada_service_counter: {
    vi: "Người học xin hỗ trợ form ở quầy dịch vụ Canada.",
    en: "Learner asks for form help at a Canadian service counter.",
    note_vi: "Trace ví dụ Canada tới inventory seal và evidence receipt.",
    note_en: "Trace the Canada example to inventory seal and evidence receipt.",
  },
};

export const traceabilityScriptAwareness =
  "Gurmukhi is the primary script for this Punjabi A1 traceability set. Shahmukhi is awareness only, not a full course track. Native review is deferred.";

export const punjabiA1TraceabilitySamples: PunjabiA1TraceabilitySample[] =
  punjabiA1EvidenceReceiptSamples.map((item) => {
    const goal = goalByDomain[item.domain];

    return {
      id: item.id.replace("pa_a1_evidence_receipt_", "pa_a1_traceability_"),
      domain: item.domain,
      style: styleByDomain[item.domain],
      learner_goal_vi: goal.vi,
      learner_goal_en: goal.en,
      cue_pa: item.cue_pa,
      romanization: item.romanization,
      meaning_vi: item.meaning_vi,
      meaning_en: item.meaning_en,
      trace_note_vi: `${goal.note_vi} Evidence receipt: ${item.evidence_note_vi}`,
      trace_note_en: `${goal.note_en} Evidence receipt: ${item.evidence_note_en}`,
      learner_trap: item.learner_trap,
      canada_practical: item.canada_practical,
      source_evidence_receipt_id: item.id,
      source_completion_record_id: item.source_completion_record_id,
      source_inventory_seal_id: item.source_inventory_seal_id,
      source_catalog_id: item.source_catalog_id,
      trace_artifacts: [
        item.id,
        item.source_completion_record_id,
        item.source_inventory_seal_id,
        item.source_catalog_id,
        item.source_receipt_id,
        ...item.evidence_artifacts,
      ],
    };
  });

export default punjabiA1TraceabilitySamples;
