// Punjabi A1 catalog samples for Vietnamese-speaking and English-speaking
// learners.
// Gurmukhi is primary; romanization supports recognition. Shahmukhi is
// awareness only, not a full course. Native review is deferred.

import {
  punjabiA1BundleSamples,
  type PunjabiA1BundleDomain,
} from "./a1BundleSamples";

export type PunjabiA1CatalogDomain = PunjabiA1BundleDomain;

export type PunjabiA1CatalogStyle =
  | "pre_a11_catalog"
  | "bundle"
  | "receipt"
  | "ledger_entry"
  | "archive_copy"
  | "pre_integration"
  | "qa"
  | "readiness_check";

export type PunjabiA1CatalogSample = {
  id: string;
  domain: PunjabiA1CatalogDomain;
  style: PunjabiA1CatalogStyle;
  catalog_label_vi: string;
  catalog_label_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  catalog_use_vi: string;
  catalog_use_en: string;
  learner_trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: string;
  source_bundle_id: string;
  source_receipt_id: string;
  linked_artifacts: string[];
};

const styleByDomain: Record<PunjabiA1CatalogDomain, PunjabiA1CatalogStyle> = {
  greetings: "pre_a11_catalog",
  identity: "receipt",
  family: "archive_copy",
  numbers: "ledger_entry",
  prices: "qa",
  food: "pre_integration",
  directions: "bundle",
  help: "pre_a11_catalog",
  repetition: "pre_integration",
  politeness: "qa",
  gurmukhi_recognition: "readiness_check",
  romanization_bridge: "archive_copy",
  canada_service_counter: "bundle",
};

const labelsByDomain: Record<
  PunjabiA1CatalogDomain,
  { vi: string; en: string; use_vi: string; use_en: string }
> = {
  greetings: {
    vi: "Chào hỏi căn bản",
    en: "Core greetings",
    use_vi: "Dùng làm mẫu catalog đầu tiên trước khi ghép vào bundle học A1.",
    use_en: "Use as the first catalog sample before packaging into an A1 bundle.",
  },
  identity: {
    vi: "Tên và danh tính",
    en: "Name and identity",
    use_vi: "Giữ mẫu giới thiệu bản thân để đối chiếu receipt và màn hình nhập tên.",
    use_en: "Keep the self-introduction sample for receipt checks and name-entry screens.",
  },
  family: {
    vi: "Gia đình",
    en: "Family",
    use_vi: "Lưu câu gia đình ngắn trong archive để tái dùng cho bài sau.",
    use_en: "Store the short family line in the archive for later lessons.",
  },
  numbers: {
    vi: "Số lượng",
    en: "Numbers and quantity",
    use_vi: "Dùng như ledger entry cho số lượng trên vé, hóa đơn, và phiếu dịch vụ.",
    use_en: "Use as a ledger entry for quantities on tickets, receipts, and service slips.",
  },
  prices: {
    vi: "Giá cả",
    en: "Prices",
    use_vi: "Gắn vào catalog câu hỏi giá ngắn cho quầy thanh toán ở Canada.",
    use_en: "Catalog the short price question for Canadian checkout counters.",
  },
  food: {
    vi: "Đồ ăn và đồ uống",
    en: "Food and drink",
    use_vi: "Giữ mẫu pre-integration cho nhu cầu đơn giản trước khi mở rộng thực đơn.",
    use_en: "Keep a pre-integration need sample before expanding menu language.",
  },
  directions: {
    vi: "Hỏi đường",
    en: "Directions",
    use_vi: "Đặt trong bundle chỉ đường để người học hỏi vị trí dịch vụ công cộng.",
    use_en: "Place in the directions bundle so learners can ask for public-service locations.",
  },
  help: {
    vi: "Xin giúp đỡ",
    en: "Help request",
    use_vi: "Đánh dấu là mẫu cứu nguy trong pre-A11 catalog.",
    use_en: "Mark as a rescue phrase in the pre-A11 catalog.",
  },
  repetition: {
    vi: "Yêu cầu lặp lại",
    en: "Repetition request",
    use_vi: "Dùng để người học xin nghe lại mà không rời khỏi Punjabi.",
    use_en: "Use so learners can ask to hear something again without leaving Punjabi.",
  },
  politeness: {
    vi: "Lịch sự",
    en: "Politeness",
    use_vi: "Dùng cho QA lịch sự tối thiểu ở lớp, thư viện, quầy dịch vụ.",
    use_en: "Use for minimum politeness QA at class, libraries, and service counters.",
  },
  gurmukhi_recognition: {
    vi: "Nhận diện Gurmukhi",
    en: "Gurmukhi recognition",
    use_vi: "Kiểm readiness bằng chữ Gurmukhi chính, không chỉ bằng romanization.",
    use_en: "Check readiness with primary Gurmukhi text, not romanization only.",
  },
  romanization_bridge: {
    vi: "Cầu nối romanization",
    en: "Romanization bridge",
    use_vi: "Dùng romanization như cầu nối tạm, rồi quay lại Gurmukhi.",
    use_en: "Use romanization as a temporary bridge, then return to Gurmukhi.",
  },
  canada_service_counter: {
    vi: "Quầy dịch vụ Canada",
    en: "Canada service counter",
    use_vi: "Đưa vào catalog cho tình huống form, thư viện, trường học, phòng khám.",
    use_en: "Catalog for forms, libraries, schools, clinics, and similar Canadian counters.",
  },
};

const toReceiptId = (bundleId: string) =>
  bundleId.replace("pa_a1_bundle_", "pa_a1_receipt_");

const toCatalogLink = (bundleLink: string) =>
  bundleLink.replace("pa_a1_bundle_", "pa_a1_catalog_");

export const catalogScriptAwareness =
  "Gurmukhi is the primary script for this Punjabi A1 catalog set. Shahmukhi is awareness only, not a full course track. Native review is deferred.";

export const punjabiA1CatalogSamples: PunjabiA1CatalogSample[] = punjabiA1BundleSamples.map(
  (item) => {
    const labels = labelsByDomain[item.domain];

    return {
      id: item.id.replace("pa_a1_bundle_", "pa_a1_catalog_"),
      domain: item.domain,
      style: styleByDomain[item.domain],
      catalog_label_vi: labels.vi,
      catalog_label_en: labels.en,
      cue_pa: item.cue_pa,
      romanization: item.romanization,
      meaning_vi: item.meaning_vi,
      meaning_en: item.meaning_en,
      catalog_use_vi: `${labels.use_vi} Bundle check: ${item.bundle_check_vi}`,
      catalog_use_en: `${labels.use_en} Receipt lineage: ${item.bundle_check_en}`,
      learner_trap: item.trap,
      canada_practical: item.canada_practical,
      source_bundle_id: item.id,
      source_receipt_id: toReceiptId(item.id),
      linked_artifacts: [
        item.id,
        toReceiptId(item.id),
        ...item.review_links.map(toCatalogLink),
      ],
    };
  },
);

export default punjabiA1CatalogSamples;
