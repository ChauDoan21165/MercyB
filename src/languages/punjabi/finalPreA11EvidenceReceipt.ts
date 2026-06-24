// src/languages/punjabi/finalPreA11EvidenceReceipt.ts
//
// Wave 61 final pre-A11 evidence receipt for Punjabi.
// This is app-consumable readiness data only. It does not perform A11 integration.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalPreA11EvidenceReceiptArea =
  | "module_family_inventory"
  | "import_export_expectations"
  | "naming_consistency"
  | "duplicate_id_risks"
  | "a1_c2_coverage"
  | "gurmukhi_script_coverage"
  | "canada_survival_coverage"
  | "remediation_coverage"
  | "deferred_native_review"
  | "forbidden_claims";

export type PunjabiFinalPreA11EvidenceReceiptStyle =
  | "pre_a11_evidence_receipt"
  | "inventory_seal"
  | "completion_record"
  | "pre_integration";

export type PunjabiFinalPreA11EvidenceReceiptItem = {
  id: string;
  area: PunjabiFinalPreA11EvidenceReceiptArea;
  style: PunjabiFinalPreA11EvidenceReceiptStyle;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  evidence_vi: string;
  evidence_en: string;
  evidence_modules: string[];
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_PRE_A11_EVIDENCE_RECEIPT_SCOPE = {
  wave: "Wave 61",
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  not_a11_integration: true,
  purpose_vi:
    "Evidence receipt này ghi hoàn tất pre-A11 cho later integration; nó không nối route, registry, UI hoặc runtime.",
  purpose_en:
    "This evidence receipt marks pre-A11 evidence for later integration; it does not wire routes, registries, UI, or runtime.",
  script_policy_vi:
    "Gurmukhi là chữ chính. Romanization hỗ trợ đọc. Shahmukhi chỉ là nhận biết, không phải khóa học đầy đủ.",
  script_policy_en:
    "Gurmukhi is primary. Romanization supports reading. Shahmukhi is awareness only, not a full course.",
  native_review_vi:
    "Native review được hoãn; evidence receipt này không tuyên bố đã được kiểm duyệt bản ngữ.",
  native_review_en:
    "Native review is deferred; this evidence receipt does not claim completed native review.",
  excluded_vi:
    "Không tạo audio, không chấm điểm phát âm, không Azure, auth, billing, RLS, Supabase, CI config, push, deploy hoặc .local.",
  excluded_en:
    "No audio creation, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy, or .local.",
} as const;

export const PUNJABI_FINAL_PRE_A11_EVIDENCE_RECEIPT_AREAS: PunjabiFinalPreA11EvidenceReceiptArea[] =
  [
    "module_family_inventory",
    "import_export_expectations",
    "naming_consistency",
    "duplicate_id_risks",
    "a1_c2_coverage",
    "gurmukhi_script_coverage",
    "canada_survival_coverage",
    "remediation_coverage",
    "deferred_native_review",
    "forbidden_claims",
  ];

export const PUNJABI_FINAL_PRE_A11_EVIDENCE_RECEIPT: PunjabiFinalPreA11EvidenceReceiptItem[] = [
  {
    id: "evidence-receipt-module-family-inventory",
    area: "module_family_inventory",
    style: "pre_a11_evidence_receipt",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਕੰਪਲੀਸ਼ਨ ਰਿਕਾਰਡ",
    romanization: "module parivaar evidence receipt",
    title_vi: "Evidence receipt họ module",
    title_en: "Module-family evidence receipt",
    evidence_vi:
      "Ghi hoàn tất course map, learning path, progression matrix, mastery checkpoints, content index, QA inventory, inventory seal và catalog trong một family.",
    evidence_en:
      "Records evidence for course map, learning path, progression matrix, mastery checkpoints, content index, QA inventory, inventory seal, and catalog in one family.",
    evidence_modules: [
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "masteryCheckpoints",
      "contentIndex",
      "finalQaInventory",
      "finalPreA11InventorySeal",
      "finalPreA11Catalog",
    ],
    sample: {
      gurmukhi: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਰਿਕਾਰਡ ਵਿੱਚ ਪੂਰਾ ਹੈ।",
      romanization: "module parivaar record vich pura hai",
      vi: "Họ module hoàn tất trong record.",
      en: "The module family is complete in the record.",
    },
    learner_trap_vi: "Evidence receipt không có nghĩa later A11 đã chạy.",
    learner_trap_en: "The evidence receipt does not mean later A11 has run.",
  },
  {
    id: "evidence-receipt-import-export-expectations",
    area: "import_export_expectations",
    style: "pre_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ ਐਕਸਪੋਰਟ ਕੰਪਲੀਸ਼ਨ ਰਿਕਾਰਡ",
    romanization: "import export evidence receipt",
    title_vi: "Evidence receipt kỳ vọng import/export",
    title_en: "Import/export expectations evidence receipt",
    evidence_vi:
      "Ghi hoàn tất named exports, default root, item aliases và helper filters để later A11 có thể import dữ liệu TypeScript trực tiếp.",
    evidence_en:
      "Records evidence for named exports, default root, item aliases, and helper filters so later A11 can import TypeScript data directly.",
    evidence_modules: ["finalImportReadinessMap", "finalExportReadiness", "finalModuleRegistry"],
    sample: {
      gurmukhi: "ਡਾਟਾ ਰਿਕਾਰਡ ਤੋਂ ਇੰਪੋਰਟ ਹੁੰਦਾ ਹੈ।",
      romanization: "data record ton import hunda hai",
      vi: "Dữ liệu được import từ record.",
      en: "Data imports from the record.",
    },
    learner_trap_vi: "Record label không thay thế export identifier ổn định.",
    learner_trap_en: "A record label does not replace a stable export identifier.",
  },
  {
    id: "evidence-receipt-naming-consistency",
    area: "naming_consistency",
    style: "inventory_seal",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਂ ਇਕਸਾਰਤਾ ਕੰਪਲੀਸ਼ਨ ਰਿਕਾਰਡ",
    romanization: "naam iksarta evidence receipt",
    title_vi: "Evidence receipt nhất quán tên gọi",
    title_en: "Naming consistency evidence receipt",
    evidence_vi:
      "Ghi hoàn tất naming pattern Punjabi final pre-A11 cho file, export, id, evidence receipt, completion record, inventory seal, catalog và pre-integration labels.",
    evidence_en:
      "Records evidence for the Punjabi final pre-A11 naming pattern across files, exports, ids, evidence receipt, completion record, inventory seal, catalog, and pre-integration labels.",
    evidence_modules: [
      "finalPreA11Snapshot",
      "finalPreA11ClosurePacket",
      "finalPreA11InventorySeal",
      "finalPreA11Catalog",
      "finalPreA11BundleManifest",
    ],
    sample: {
      gurmukhi: "ਨਾਂ ਰਿਕਾਰਡ ਵਿੱਚ ਇਕਸਾਰ ਹਨ।",
      romanization: "naam record vich iksar han",
      vi: "Tên gọi nhất quán trong record.",
      en: "Names are consistent in the record.",
    },
    learner_trap_vi: "Tên gần giống vẫn cần kiểm tra duplicate trước later A11.",
    learner_trap_en: "Nearly matching names still need duplicate checks before later A11.",
  },
  {
    id: "evidence-receipt-duplicate-id-risks",
    area: "duplicate_id_risks",
    style: "completion_record",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ID ਜੋਖਮ ਕੰਪਲੀਸ਼ਨ ਰਿਕਾਰਡ",
    romanization: "duplicate ID jokhim evidence receipt",
    title_vi: "Evidence receipt rủi ro trùng ID",
    title_en: "Duplicate-ID risks evidence receipt",
    evidence_vi:
      "Ghi hoàn tất item id, module id, checklist id và later route key cần unique trước khi tích hợp.",
    evidence_en:
      "Records evidence for item ids, module ids, checklist ids, and later route keys that must stay unique before integration.",
    evidence_modules: ["finalModuleRegistry", "finalContentManifest", "finalGoNoGoChecklist"],
    sample: {
      gurmukhi: "ਹਰ ID ਰਿਕਾਰਡ ਵਿੱਚ ਵੱਖਰਾ ਹੈ।",
      romanization: "har ID record vich vakhra hai",
      vi: "Mỗi ID trong record là riêng.",
      en: "Each ID in the record is distinct.",
    },
    learner_trap_vi: "Cùng topic không tự động là duplicate; kiểm tra full id.",
    learner_trap_en: "The same topic is not automatically a duplicate; check the full id.",
  },
  {
    id: "evidence-receipt-a1-c2-coverage",
    area: "a1_c2_coverage",
    style: "pre_a11_evidence_receipt",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1 ਤੋਂ C2 ਕਵਰੇਜ ਕੰਪਲੀਸ਼ਨ ਰਿਕਾਰਡ",
    romanization: "A1 ton C2 coverage evidence receipt",
    title_vi: "Evidence receipt coverage A1 đến C2",
    title_en: "A1-C2 coverage evidence receipt",
    evidence_vi:
      "Ghi hoàn tất A1-C2 coverage từ foundation qua survival, core, academic và C2 discourse để later A11 thấy toàn đường học.",
    evidence_en:
      "Records evidence for A1-C2 coverage from foundation through survival, core, academic, and C2 discourse so later A11 sees the full path.",
    evidence_modules: ["learningPath", "progressionMatrix", "finalCoverageVerificationPack"],
    sample: {
      gurmukhi: "ਸਾਰੇ ਪੱਧਰ ਰਿਕਾਰਡ ਵਿੱਚ ਪੂਰੇ ਹਨ।",
      romanization: "sare padar record vich pure han",
      vi: "Tất cả cấp độ hoàn tất trong record.",
      en: "All levels are complete in the record.",
    },
  },
  {
    id: "evidence-receipt-gurmukhi-script-coverage",
    area: "gurmukhi_script_coverage",
    style: "pre_a11_evidence_receipt",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਗੁਰਮੁਖੀ ਸਕ੍ਰਿਪਟ ਕੰਪਲੀਸ਼ਨ ਰਿਕਾਰਡ",
    romanization: "Gurmukhi script evidence receipt",
    title_vi: "Evidence receipt chữ Gurmukhi",
    title_en: "Gurmukhi/script coverage evidence receipt",
    evidence_vi:
      "Ghi hoàn tất Gurmukhi primary script, romanization support và Shahmukhi awareness-only note, không phải full course.",
    evidence_en:
      "Records evidence for Gurmukhi primary script, romanization support, and the Shahmukhi awareness-only note, not a full course.",
    evidence_modules: ["lessons", "lessonsA1", "scriptBasics", "gurmukhiReadingLadder"],
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਰਿਕਾਰਡ ਵਿੱਚ ਪਹਿਲਾਂ ਹੈ।",
      romanization: "Gurmukhi record vich pehlan hai",
      vi: "Gurmukhi đứng trước trong record.",
      en: "Gurmukhi comes first in the record.",
    },
    learner_trap_vi: "Đừng dùng romanization như chữ chính khi Gurmukhi đã có.",
    learner_trap_en: "Do not use romanization as the primary script when Gurmukhi is present.",
  },
  {
    id: "evidence-receipt-canada-survival-coverage",
    area: "canada_survival_coverage",
    style: "inventory_seal",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਕੈਨੇਡਾ ਸਰਵਾਈਵਲ ਕੰਪਲੀਸ਼ਨ ਰਿਕਾਰਡ",
    romanization: "Canada survival evidence receipt",
    title_vi: "Evidence receipt sinh tồn Canada",
    title_en: "Canada survival evidence receipt",
    evidence_vi:
      "Ghi hoàn tất ví dụ clinic, school, workplace, housing, transit và public service cho tình huống thực dụng ở Canada.",
    evidence_en:
      "Records evidence for clinic, school, workplace, housing, transit, and public service examples for practical Canada situations.",
    evidence_modules: ["canadaSurvivalProofPack", "healthcareCanada", "publicServicesCanada"],
    sample: {
      gurmukhi: "ਮੈਂ ਕੈਨੇਡਾ ਵਿੱਚ ਸੇਵਾ ਲਈ ਪੁੱਛਦਾ ਹਾਂ।",
      romanization: "main Canada vich seva lai puchhda han",
      vi: "Tôi hỏi về dịch vụ ở Canada.",
      en: "I ask about a service in Canada.",
    },
    canada_practical_vi: "Dùng khi hỏi clinic desk, school office, landlord hoặc public service counter.",
    canada_practical_en:
      "Use when asking a clinic desk, school office, landlord, or public service counter.",
  },
  {
    id: "evidence-receipt-remediation-coverage",
    area: "remediation_coverage",
    style: "completion_record",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੀਮੀਡੀਏਸ਼ਨ ਕੰਪਲੀਸ਼ਨ ਰਿਕਾਰਡ",
    romanization: "remediation evidence receipt",
    title_vi: "Evidence receipt sửa lỗi",
    title_en: "Remediation coverage evidence receipt",
    evidence_vi:
      "Ghi hoàn tất repair paths cho nhầm Gurmukhi, lệ thuộc romanization, postpositions, agreement, word order và discourse repair.",
    evidence_en:
      "Records evidence for repair paths for Gurmukhi confusion, romanization dependence, postpositions, agreement, word order, and discourse repair.",
    evidence_modules: ["learnerErrorPatterns", "remediationBank", "masteryCheckpoints"],
    sample: {
      gurmukhi: "ਰਿਕਾਰਡ ਵਿੱਚ ਰੀਪੇਅਰ ਰਾਹ ਪੂਰਾ ਹੈ।",
      romanization: "record vich repair rah pura hai",
      vi: "Đường sửa lỗi hoàn tất trong record.",
      en: "The repair path is complete in the record.",
    },
    learner_trap_vi: "Repair không chỉ là câu đúng; cần tín hiệu lỗi và luyện tập.",
    learner_trap_en: "Repair is not just the correct sentence; it needs an error signal and practice.",
  },
  {
    id: "evidence-receipt-deferred-native-review",
    area: "deferred_native_review",
    style: "pre_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨੇਟਿਵ ਰਿਵਿਊ ਮੁਲਤਵੀ ਕੰਪਲੀਸ਼ਨ ਰਿਕਾਰਡ",
    romanization: "native review multavi evidence receipt",
    title_vi: "Evidence receipt native review được hoãn",
    title_en: "Deferred native review evidence receipt",
    evidence_vi:
      "Ghi hoàn tất boundary rằng native review được hoãn; technical evidence receipt, inventory seal hoặc catalog không phải claim review bản ngữ hoàn tất.",
    evidence_en:
      "Records evidence for the boundary that native review is deferred; technical evidence receipt, inventory seal, or catalog is not a completed native-review claim.",
    evidence_modules: ["finalOwnerReviewPacket", "finalPreA11Signoff", "finalPreA11InventorySeal"],
    sample: {
      gurmukhi: "ਰਿਵਿਊ ਬਾਅਦ ਲਈ ਰਿਕਾਰਡ ਵਿੱਚ ਹੈ।",
      romanization: "review baad lai record vich hai",
      vi: "Review được ghi cho giai đoạn sau trong record.",
      en: "Review is recorded for a later stage.",
    },
    must_not_claim_vi: "Không claim native reviewed hoặc native-approved.",
    must_not_claim_en: "Do not claim native reviewed or native-approved.",
  },
  {
    id: "evidence-receipt-forbidden-claims",
    area: "forbidden_claims",
    style: "pre_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮਨ੍ਹਾ ਦਾਅਵੇ ਕੰਪਲੀਸ਼ਨ ਰਿਕਾਰਡ",
    romanization: "manha daave evidence receipt",
    title_vi: "Evidence receipt claim bị cấm",
    title_en: "Forbidden claims evidence receipt",
    evidence_vi:
      "Ghi hoàn tất boundary: pre-A11 evidence receipt, inventory seal và catalog chỉ là dữ liệu; không claim integration, release, deployment hoặc native review hoàn tất.",
    evidence_en:
      "Records evidence for the boundary: pre-A11 evidence receipt, completion record, inventory seal, and catalog are data only; no integration, release, deployment, or completed native-review claim.",
    evidence_modules: ["finalIntegrationGuardrails", "finalGoNoGoChecklist", "finalPreA11Seal"],
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ ਕੰਪਲੀਸ਼ਨ ਰਿਕਾਰਡ ਹੈ।",
      romanization: "ih sirf evidence receipt hai",
      vi: "Đây chỉ là evidence receipt.",
      en: "This is only a evidence receipt.",
    },
    must_not_claim_vi: "Không claim đã chạy A11, đã push, đã deploy, hoặc đã review bản ngữ.",
    must_not_claim_en: "Do not claim A11 has run, pushed, deployed, or completed native review.",
  },
];

export const PUNJABI_FINAL_PRE_A11_EVIDENCE_RECEIPT_ROUTES = [
  {
    id: "evidence-receipt-readiness-route",
    vi: "Route dữ liệu cho evidence receipt, import/export và naming trước later A11.",
    en: "Data route for evidence receipt, import/export, and naming before later A11.",
    item_ids: [
      "evidence-receipt-module-family-inventory",
      "evidence-receipt-import-export-expectations",
      "evidence-receipt-naming-consistency",
    ],
  },
  {
    id: "evidence-receipt-coverage-route",
    vi: "Route dữ liệu cho coverage A1-C2, Gurmukhi, Canada và remediation.",
    en: "Data route for A1-C2, Gurmukhi, Canada, and remediation coverage.",
    item_ids: [
      "evidence-receipt-a1-c2-coverage",
      "evidence-receipt-gurmukhi-script-coverage",
      "evidence-receipt-canada-survival-coverage",
      "evidence-receipt-remediation-coverage",
    ],
  },
  {
    id: "evidence-receipt-boundary-route",
    vi: "Route dữ liệu cho duplicate-id risk, native review deferred và forbidden claims.",
    en: "Data route for duplicate-id risk, deferred native review, and forbidden claims.",
    item_ids: [
      "evidence-receipt-duplicate-id-risks",
      "evidence-receipt-deferred-native-review",
      "evidence-receipt-forbidden-claims",
    ],
  },
] as const;

export const PUNJABI_FINAL_PRE_A11_EVIDENCE_RECEIPT_ROOT = {
  scope: PUNJABI_FINAL_PRE_A11_EVIDENCE_RECEIPT_SCOPE,
  areas: PUNJABI_FINAL_PRE_A11_EVIDENCE_RECEIPT_AREAS,
  items: PUNJABI_FINAL_PRE_A11_EVIDENCE_RECEIPT,
  routes: PUNJABI_FINAL_PRE_A11_EVIDENCE_RECEIPT_ROUTES,
} as const;

export const PUNJABI_FINAL_PRE_A11_EVIDENCE_RECEIPT_ITEMS =
  PUNJABI_FINAL_PRE_A11_EVIDENCE_RECEIPT;

export const punjabiFinalPreA11EvidenceReceiptByArea = (
  area: PunjabiFinalPreA11EvidenceReceiptArea,
) => PUNJABI_FINAL_PRE_A11_EVIDENCE_RECEIPT.filter((item) => item.area === area);

export default PUNJABI_FINAL_PRE_A11_EVIDENCE_RECEIPT_ROOT;
