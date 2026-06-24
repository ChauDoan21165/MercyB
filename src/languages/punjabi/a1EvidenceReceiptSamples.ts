// Punjabi A1 evidence receipt samples for Vietnamese-speaking and
// English-speaking learners.
// Gurmukhi is primary; romanization supports recognition. Shahmukhi is
// awareness only, not a full course. Native review is deferred.

import {
  punjabiA1CompletionRecordSamples,
  type PunjabiA1CompletionRecordDomain,
} from "./a1CompletionRecordSamples";

export type PunjabiA1EvidenceReceiptDomain = PunjabiA1CompletionRecordDomain;

export type PunjabiA1EvidenceReceiptStyle =
  | "pre_a11_evidence_receipt"
  | "completion_record"
  | "inventory_seal"
  | "catalog"
  | "receipt"
  | "archive_copy"
  | "pre_integration"
  | "readiness_check";

export type PunjabiA1EvidenceReceiptSample = {
  id: string;
  domain: PunjabiA1EvidenceReceiptDomain;
  style: PunjabiA1EvidenceReceiptStyle;
  evidence_label_vi: string;
  evidence_label_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  evidence_note_vi: string;
  evidence_note_en: string;
  learner_trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: string;
  source_completion_record_id: string;
  source_inventory_seal_id: string;
  source_catalog_id: string;
  source_receipt_id: string;
  evidence_artifacts: string[];
};

const styleByDomain: Record<
  PunjabiA1EvidenceReceiptDomain,
  PunjabiA1EvidenceReceiptStyle
> = {
  greetings: "pre_a11_evidence_receipt",
  identity: "completion_record",
  family: "archive_copy",
  numbers: "inventory_seal",
  prices: "receipt",
  food: "pre_integration",
  directions: "catalog",
  help: "pre_a11_evidence_receipt",
  repetition: "pre_integration",
  politeness: "completion_record",
  gurmukhi_recognition: "readiness_check",
  romanization_bridge: "archive_copy",
  canada_service_counter: "inventory_seal",
};

const evidenceNotesByDomain: Record<
  PunjabiA1EvidenceReceiptDomain,
  { vi: string; en: string }
> = {
  greetings: {
    vi: "Ghi receipt bằng chứng rằng câu chào A1 đã giữ nguyên Gurmukhi.",
    en: "Record evidence that the A1 greeting kept Gurmukhi intact.",
  },
  identity: {
    vi: "Ghi bằng chứng mẫu tên đã hoàn tất với nghĩa Việt và English.",
    en: "Record evidence that the name sample is complete with Vietnamese and English meaning.",
  },
  family: {
    vi: "Ghi bằng chứng mẫu gia đình vẫn là archive ngắn, ổn định.",
    en: "Record evidence that the family sample remains short and stable in the archive.",
  },
  numbers: {
    vi: "Ghi bằng chứng số lượng đọc được cho vé, receipt, và ledger.",
    en: "Record evidence that the quantity is readable for tickets, receipts, and ledger use.",
  },
  prices: {
    vi: "Ghi bằng chứng câu hỏi giá dùng được ở quầy thanh toán Canada.",
    en: "Record evidence that the price question works at Canadian checkout counters.",
  },
  food: {
    vi: "Ghi bằng chứng mẫu nhu cầu đồ uống sẵn cho pre-integration.",
    en: "Record evidence that the drink-need sample is ready for pre-integration.",
  },
  directions: {
    vi: "Ghi bằng chứng câu hỏi đường giữ đúng mẫu vị trí A1.",
    en: "Record evidence that the direction question keeps the A1 location frame.",
  },
  help: {
    vi: "Ghi bằng chứng câu xin giúp đỡ vẫn là mẫu cứu nguy pre-A11.",
    en: "Record evidence that the help request remains a pre-A11 rescue sample.",
  },
  repetition: {
    vi: "Ghi bằng chứng câu xin lặp lại giúp người học tiếp tục bằng Punjabi.",
    en: "Record evidence that the repetition request helps learners continue in Punjabi.",
  },
  politeness: {
    vi: "Ghi bằng chứng mẫu lịch sự phù hợp lớp, thư viện, và quầy dịch vụ.",
    en: "Record evidence that the politeness sample fits classes, libraries, and counters.",
  },
  gurmukhi_recognition: {
    vi: "Ghi bằng chứng nhận diện Gurmukhi không phụ thuộc vào romanization.",
    en: "Record evidence that Gurmukhi recognition does not depend on romanization.",
  },
  romanization_bridge: {
    vi: "Ghi bằng chứng romanization chỉ là cầu nối, không thay thế Gurmukhi.",
    en: "Record evidence that romanization is only a bridge and does not replace Gurmukhi.",
  },
  canada_service_counter: {
    vi: "Ghi bằng chứng mẫu quầy dịch vụ Canada sẵn cho form, trường, và phòng khám.",
    en: "Record evidence that the Canada service-counter sample is ready for forms, schools, and clinics.",
  },
};

export const evidenceReceiptScriptAwareness =
  "Gurmukhi is the primary script for this Punjabi A1 evidence receipt set. Shahmukhi is awareness only, not a full course track. Native review is deferred.";

export const punjabiA1EvidenceReceiptSamples: PunjabiA1EvidenceReceiptSample[] =
  punjabiA1CompletionRecordSamples.map((item) => {
    const evidenceNote = evidenceNotesByDomain[item.domain];

    return {
      id: item.id.replace("pa_a1_completion_record_", "pa_a1_evidence_receipt_"),
      domain: item.domain,
      style: styleByDomain[item.domain],
      evidence_label_vi: `Evidence receipt: ${item.record_label_vi}`,
      evidence_label_en: `Evidence receipt: ${item.record_label_en}`,
      cue_pa: item.cue_pa,
      romanization: item.romanization,
      meaning_vi: item.meaning_vi,
      meaning_en: item.meaning_en,
      evidence_note_vi: `${evidenceNote.vi} Completion record: ${item.completion_note_vi}`,
      evidence_note_en: `${evidenceNote.en} Completion record: ${item.completion_note_en}`,
      learner_trap: item.learner_trap,
      canada_practical: item.canada_practical,
      source_completion_record_id: item.id,
      source_inventory_seal_id: item.source_inventory_seal_id,
      source_catalog_id: item.source_catalog_id,
      source_receipt_id: item.source_receipt_id,
      evidence_artifacts: [
        item.id,
        item.source_inventory_seal_id,
        item.source_catalog_id,
        item.source_bundle_id,
        item.source_receipt_id,
        ...item.completed_artifacts,
      ],
    };
  });

export default punjabiA1EvidenceReceiptSamples;
