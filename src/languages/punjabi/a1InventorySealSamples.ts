// Punjabi A1 inventory seal samples for Vietnamese-speaking and
// English-speaking learners.
// Gurmukhi is primary; romanization supports recognition. Shahmukhi is
// awareness only, not a full course. Native review is deferred.

import {
  punjabiA1CatalogSamples,
  type PunjabiA1CatalogDomain,
} from "./a1CatalogSamples";

export type PunjabiA1InventorySealDomain = PunjabiA1CatalogDomain;

export type PunjabiA1InventorySealStyle =
  | "pre_a11_inventory_seal"
  | "catalog"
  | "bundle"
  | "receipt"
  | "ledger_entry"
  | "archive_copy"
  | "pre_integration"
  | "readiness_check";

export type PunjabiA1InventorySealSample = {
  id: string;
  domain: PunjabiA1InventorySealDomain;
  style: PunjabiA1InventorySealStyle;
  inventory_label_vi: string;
  inventory_label_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  seal_check_vi: string;
  seal_check_en: string;
  learner_trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: string;
  source_catalog_id: string;
  source_bundle_id: string;
  source_receipt_id: string;
  sealed_artifacts: string[];
};

const styleByDomain: Record<
  PunjabiA1InventorySealDomain,
  PunjabiA1InventorySealStyle
> = {
  greetings: "pre_a11_inventory_seal",
  identity: "catalog",
  family: "archive_copy",
  numbers: "ledger_entry",
  prices: "receipt",
  food: "pre_integration",
  directions: "bundle",
  help: "pre_a11_inventory_seal",
  repetition: "pre_integration",
  politeness: "catalog",
  gurmukhi_recognition: "readiness_check",
  romanization_bridge: "archive_copy",
  canada_service_counter: "bundle",
};

const sealNotesByDomain: Record<
  PunjabiA1InventorySealDomain,
  { vi: string; en: string }
> = {
  greetings: {
    vi: "Niêm phong câu chào A1 để giữ Gurmukhi làm mẫu đầu tiên.",
    en: "Seal the A1 greeting so Gurmukhi remains the first sample.",
  },
  identity: {
    vi: "Niêm phong mẫu tên trong inventory để không mất khung giới thiệu.",
    en: "Seal the name sample in inventory so the introduction frame stays intact.",
  },
  family: {
    vi: "Niêm phong mẫu gia đình ngắn để archive vẫn dùng được ở cấp sau.",
    en: "Seal the short family sample so the archive remains reusable later.",
  },
  numbers: {
    vi: "Niêm phong số lượng như ledger entry cho vé và biên lai.",
    en: "Seal the quantity as a ledger entry for tickets and receipts.",
  },
  prices: {
    vi: "Niêm phong câu hỏi giá cho receipt ở quầy thanh toán Canada.",
    en: "Seal the price question for receipts at Canadian checkout counters.",
  },
  food: {
    vi: "Niêm phong mẫu nhu cầu đồ uống trước khi ghép vào bài menu.",
    en: "Seal the drink-need sample before combining it with menu lessons.",
  },
  directions: {
    vi: "Niêm phong câu hỏi vị trí trong bundle chỉ đường.",
    en: "Seal the location question inside the directions bundle.",
  },
  help: {
    vi: "Niêm phong câu xin giúp như câu cứu nguy pre-A11.",
    en: "Seal the help request as a pre-A11 rescue phrase.",
  },
  repetition: {
    vi: "Niêm phong câu xin lặp lại để người học giữ hội thoại Punjabi.",
    en: "Seal the repetition request so learners can stay in Punjabi.",
  },
  politeness: {
    vi: "Niêm phong lịch sự tối thiểu cho quầy, lớp học, và thư viện.",
    en: "Seal minimum politeness for counters, classes, and libraries.",
  },
  gurmukhi_recognition: {
    vi: "Niêm phong nhận diện Gurmukhi, không thay bằng romanization.",
    en: "Seal Gurmukhi recognition without replacing it with romanization.",
  },
  romanization_bridge: {
    vi: "Niêm phong romanization như cầu nối tạm, không phải nội dung chính.",
    en: "Seal romanization as a temporary bridge, not the main content.",
  },
  canada_service_counter: {
    vi: "Niêm phong câu quầy dịch vụ Canada cho form, trường học, và phòng khám.",
    en: "Seal the Canadian service-counter line for forms, schools, and clinics.",
  },
};

export const inventorySealScriptAwareness =
  "Gurmukhi is the primary script for this Punjabi A1 inventory seal set. Shahmukhi is awareness only, not a full course track. Native review is deferred.";

export const punjabiA1InventorySealSamples: PunjabiA1InventorySealSample[] =
  punjabiA1CatalogSamples.map((item) => {
    const sealNote = sealNotesByDomain[item.domain];

    return {
      id: item.id.replace("pa_a1_catalog_", "pa_a1_inventory_seal_"),
      domain: item.domain,
      style: styleByDomain[item.domain],
      inventory_label_vi: `Inventory seal: ${item.catalog_label_vi}`,
      inventory_label_en: `Inventory seal: ${item.catalog_label_en}`,
      cue_pa: item.cue_pa,
      romanization: item.romanization,
      meaning_vi: item.meaning_vi,
      meaning_en: item.meaning_en,
      seal_check_vi: `${sealNote.vi} Catalog note: ${item.catalog_use_vi}`,
      seal_check_en: `${sealNote.en} Catalog lineage: ${item.catalog_use_en}`,
      learner_trap: item.learner_trap,
      canada_practical: item.canada_practical,
      source_catalog_id: item.id,
      source_bundle_id: item.source_bundle_id,
      source_receipt_id: item.source_receipt_id,
      sealed_artifacts: [
        item.id,
        item.source_bundle_id,
        item.source_receipt_id,
        ...item.linked_artifacts,
      ],
    };
  });

export default punjabiA1InventorySealSamples;
