// Punjabi A1 completion record samples for Vietnamese-speaking and
// English-speaking learners.
// Gurmukhi is primary; romanization supports recognition. Shahmukhi is
// awareness only, not a full course. Native review is deferred.

import {
  punjabiA1InventorySealSamples,
  type PunjabiA1InventorySealDomain,
} from "./a1InventorySealSamples";

export type PunjabiA1CompletionRecordDomain = PunjabiA1InventorySealDomain;

export type PunjabiA1CompletionRecordStyle =
  | "pre_a11_completion_record"
  | "inventory_seal"
  | "catalog"
  | "bundle"
  | "receipt"
  | "archive_copy"
  | "pre_integration"
  | "readiness_check";

export type PunjabiA1CompletionRecordSample = {
  id: string;
  domain: PunjabiA1CompletionRecordDomain;
  style: PunjabiA1CompletionRecordStyle;
  record_label_vi: string;
  record_label_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  completion_note_vi: string;
  completion_note_en: string;
  learner_trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: string;
  source_inventory_seal_id: string;
  source_catalog_id: string;
  source_bundle_id: string;
  source_receipt_id: string;
  completed_artifacts: string[];
};

const styleByDomain: Record<
  PunjabiA1CompletionRecordDomain,
  PunjabiA1CompletionRecordStyle
> = {
  greetings: "pre_a11_completion_record",
  identity: "catalog",
  family: "archive_copy",
  numbers: "inventory_seal",
  prices: "receipt",
  food: "pre_integration",
  directions: "bundle",
  help: "pre_a11_completion_record",
  repetition: "pre_integration",
  politeness: "catalog",
  gurmukhi_recognition: "readiness_check",
  romanization_bridge: "archive_copy",
  canada_service_counter: "inventory_seal",
};

const completionNotesByDomain: Record<
  PunjabiA1CompletionRecordDomain,
  { vi: string; en: string }
> = {
  greetings: {
    vi: "Đánh dấu hoàn tất câu chào A1 trước khi chuyển sang readiness sau này.",
    en: "Mark the A1 greeting complete before later readiness work.",
  },
  identity: {
    vi: "Đánh dấu hoàn tất mẫu tên và danh tính cho catalog A1.",
    en: "Mark the name and identity sample complete for the A1 catalog.",
  },
  family: {
    vi: "Đánh dấu hoàn tất mẫu gia đình ngắn với archive còn nguyên.",
    en: "Mark the short family sample complete with the archive intact.",
  },
  numbers: {
    vi: "Đánh dấu hoàn tất mẫu số lượng cho vé, receipt, và ledger.",
    en: "Mark the quantity sample complete for tickets, receipts, and ledger use.",
  },
  prices: {
    vi: "Đánh dấu hoàn tất câu hỏi giá cho quầy thanh toán Canada.",
    en: "Mark the price question complete for Canadian checkout counters.",
  },
  food: {
    vi: "Đánh dấu hoàn tất mẫu nhu cầu đồ uống pre-integration.",
    en: "Mark the drink-need sample complete for pre-integration.",
  },
  directions: {
    vi: "Đánh dấu hoàn tất câu hỏi đường đến trạm xe buýt hoặc quầy thông tin.",
    en: "Mark the direction question complete for bus stops or information desks.",
  },
  help: {
    vi: "Đánh dấu hoàn tất câu xin giúp đỡ như mẫu cứu nguy pre-A11.",
    en: "Mark the help request complete as a pre-A11 rescue sample.",
  },
  repetition: {
    vi: "Đánh dấu hoàn tất câu xin lặp lại để duy trì hội thoại Punjabi.",
    en: "Mark the repetition request complete for staying in Punjabi conversation.",
  },
  politeness: {
    vi: "Đánh dấu hoàn tất mẫu lịch sự tối thiểu cho lớp, thư viện, và quầy.",
    en: "Mark minimum politeness complete for class, library, and counter use.",
  },
  gurmukhi_recognition: {
    vi: "Đánh dấu hoàn tất nhận diện Gurmukhi bằng chữ chính, không chỉ romanization.",
    en: "Mark Gurmukhi recognition complete with primary script, not romanization only.",
  },
  romanization_bridge: {
    vi: "Đánh dấu hoàn tất cầu nối romanization nhưng giữ Gurmukhi là chính.",
    en: "Mark the romanization bridge complete while keeping Gurmukhi primary.",
  },
  canada_service_counter: {
    vi: "Đánh dấu hoàn tất mẫu quầy dịch vụ Canada cho form, trường, và phòng khám.",
    en: "Mark the Canadian service-counter sample complete for forms, schools, and clinics.",
  },
};

export const completionRecordScriptAwareness =
  "Gurmukhi is the primary script for this Punjabi A1 completion record set. Shahmukhi is awareness only, not a full course track. Native review is deferred.";

export const punjabiA1CompletionRecordSamples: PunjabiA1CompletionRecordSample[] =
  punjabiA1InventorySealSamples.map((item) => {
    const completionNote = completionNotesByDomain[item.domain];

    return {
      id: item.id.replace("pa_a1_inventory_seal_", "pa_a1_completion_record_"),
      domain: item.domain,
      style: styleByDomain[item.domain],
      record_label_vi: `Completion record: ${item.inventory_label_vi}`,
      record_label_en: `Completion record: ${item.inventory_label_en}`,
      cue_pa: item.cue_pa,
      romanization: item.romanization,
      meaning_vi: item.meaning_vi,
      meaning_en: item.meaning_en,
      completion_note_vi: `${completionNote.vi} Inventory seal: ${item.seal_check_vi}`,
      completion_note_en: `${completionNote.en} Inventory seal: ${item.seal_check_en}`,
      learner_trap: item.learner_trap,
      canada_practical: item.canada_practical,
      source_inventory_seal_id: item.id,
      source_catalog_id: item.source_catalog_id,
      source_bundle_id: item.source_bundle_id,
      source_receipt_id: item.source_receipt_id,
      completed_artifacts: [
        item.id,
        item.source_catalog_id,
        item.source_bundle_id,
        item.source_receipt_id,
        ...item.sealed_artifacts,
      ],
    };
  });

export default punjabiA1CompletionRecordSamples;
