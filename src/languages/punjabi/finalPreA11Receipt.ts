// src/languages/punjabi/finalPreA11Receipt.ts
//
// Wave 56 final pre-A11 receipt for Punjabi.
// This is app-consumable readiness data only. It does not perform A11 integration.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalPreA11ReceiptArea =
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

export type PunjabiFinalPreA11ReceiptStatus =
  | "received_for_later_a11"
  | "receipt_check_needed"
  | "deferred_boundary";

export type PunjabiFinalPreA11ReceiptItem = {
  id: string;
  area: PunjabiFinalPreA11ReceiptArea;
  status: PunjabiFinalPreA11ReceiptStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  receipt_vi: string;
  receipt_en: string;
  accepted_evidence: string[];
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

export const PUNJABI_FINAL_PRE_A11_RECEIPT_SCOPE = {
  wave: "Wave 56",
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  not_a11_integration: true,
  purpose_vi:
    "Receipt này xác nhận artifact pre-A11 đã được nhận cho later integration; nó không nối route, registry, UI hoặc runtime.",
  purpose_en:
    "This receipt confirms pre-A11 artifacts were received for later integration; it does not wire routes, registries, UI, or runtime.",
  script_policy_vi:
    "Gurmukhi là chữ chính. Romanization hỗ trợ đọc. Shahmukhi chỉ là nhận biết, không phải khóa học đầy đủ.",
  script_policy_en:
    "Gurmukhi is primary. Romanization supports reading. Shahmukhi is awareness only, not a full course.",
  native_review_vi:
    "Native review được hoãn; receipt này không tuyên bố đã được kiểm duyệt bản ngữ.",
  native_review_en:
    "Native review is deferred; this receipt does not claim completed native review.",
  excluded_vi:
    "Không tạo audio, không chấm điểm phát âm, không Azure, auth, billing, RLS, Supabase, CI config, push, deploy hoặc .local.",
  excluded_en:
    "No audio creation, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy, or .local.",
} as const;

export const PUNJABI_FINAL_PRE_A11_RECEIPT_AREAS: PunjabiFinalPreA11ReceiptArea[] = [
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

export const PUNJABI_FINAL_PRE_A11_RECEIPT: PunjabiFinalPreA11ReceiptItem[] = [
  {
    id: "receipt-module-family-inventory",
    area: "module_family_inventory",
    status: "received_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਰਸੀਦ",
    romanization: "module parivaar rasid",
    title_vi: "Receipt inventory họ module",
    title_en: "Module-family inventory receipt",
    receipt_vi:
      "Nhận cùng family cho course map, learning path, progression matrix, mastery checkpoints, content index, QA inventory, ledger và archive.",
    receipt_en:
      "Receives one family across course map, learning path, progression matrix, mastery checkpoints, content index, QA inventory, ledger, and archive.",
    accepted_evidence: [
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "masteryCheckpoints",
      "contentIndex",
      "finalQaInventory",
      "finalPreA11Ledger",
      "finalPreA11ArchiveIndex",
    ],
    sample: {
      gurmukhi: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਦੀ ਰਸੀਦ ਬਣ ਗਈ ਹੈ।",
      romanization: "module parivaar di rasid ban gai hai",
      vi: "Receipt của họ module đã được tạo.",
      en: "The module-family receipt is created.",
    },
    learner_trap_vi: "Receipt chỉ xác nhận nhận dữ liệu; không có nghĩa later A11 đã chạy.",
    learner_trap_en: "A receipt only confirms data intake; it does not mean later A11 has run.",
  },
  {
    id: "receipt-import-export-expectations",
    area: "import_export_expectations",
    status: "receipt_check_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ ਐਕਸਪੋਰਟ ਰਸੀਦ",
    romanization: "import export rasid",
    title_vi: "Receipt kỳ vọng import/export",
    title_en: "Import/export expectations receipt",
    receipt_vi:
      "Nhận named exports, default root, item alias và helper filter để later A11 có thể import dữ liệu TypeScript trực tiếp.",
    receipt_en:
      "Receives named exports, default root, item aliases, and helper filters so later A11 can import TypeScript data directly.",
    accepted_evidence: ["finalImportReadinessMap", "finalExportReadiness", "finalModuleRegistry"],
    sample: {
      gurmukhi: "ਡਾਟਾ ਇੰਪੋਰਟ ਲਈ ਤਿਆਰ ਹੈ।",
      romanization: "data import lai tiar hai",
      vi: "Dữ liệu sẵn sàng để import.",
      en: "The data is ready for import.",
    },
    learner_trap_vi: "Receipt không thay thế export identifier ổn định.",
    learner_trap_en: "A receipt does not replace a stable export identifier.",
  },
  {
    id: "receipt-naming-consistency",
    area: "naming_consistency",
    status: "receipt_check_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਂ ਇਕਸਾਰਤਾ ਰਸੀਦ",
    romanization: "naam iksarta rasid",
    title_vi: "Receipt nhất quán tên gọi",
    title_en: "Naming consistency receipt",
    receipt_vi:
      "Nhận naming pattern Punjabi final pre-A11 cho file, export, item id, route label, receipt, ledger, archive và pre-integration checklist.",
    receipt_en:
      "Receives the Punjabi final pre-A11 naming pattern across files, exports, item ids, route labels, receipt, ledger, archive, and pre-integration checklists.",
    accepted_evidence: [
      "finalPreA11Snapshot",
      "finalPreA11ClosurePacket",
      "finalPreA11Seal",
      "finalPreA11Signoff",
      "finalPreA11Ledger",
    ],
    sample: {
      gurmukhi: "ਨਾਂ ਇਕਸਾਰ ਮਿਲੇ ਹਨ।",
      romanization: "naam iksar mile han",
      vi: "Tên gọi đã được nhận nhất quán.",
      en: "Names were received consistently.",
    },
    learner_trap_vi: "Tên gần giống vẫn cần kiểm tra trước later A11.",
    learner_trap_en: "Nearly matching names still need checking before later A11.",
  },
  {
    id: "receipt-duplicate-id-risks",
    area: "duplicate_id_risks",
    status: "receipt_check_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ID ਜੋਖਮ ਰਸੀਦ",
    romanization: "duplicate ID jokhim rasid",
    title_vi: "Receipt rủi ro trùng ID",
    title_en: "Duplicate-ID risks receipt",
    receipt_vi:
      "Nhận danh sách item id, module id, checklist id và later route key cần unique trước khi tích hợp.",
    receipt_en:
      "Receives the list of item ids, module ids, checklist ids, and later route keys that must stay unique before integration.",
    accepted_evidence: ["finalModuleRegistry", "finalContentManifest", "finalGoNoGoChecklist"],
    sample: {
      gurmukhi: "ਹਰ ID ਲਈ ਰਸੀਦ ਹੈ।",
      romanization: "har ID lai rasid hai",
      vi: "Mỗi ID có receipt.",
      en: "Each ID has a receipt.",
    },
    learner_trap_vi: "Cùng topic không tự động là duplicate; cần kiểm tra full id.",
    learner_trap_en: "The same topic is not automatically a duplicate; check the full id.",
  },
  {
    id: "receipt-a1-c2-coverage",
    area: "a1_c2_coverage",
    status: "received_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1 ਤੋਂ C2 ਕਵਰੇਜ ਰਸੀਦ",
    romanization: "A1 ton C2 coverage rasid",
    title_vi: "Receipt coverage A1 đến C2",
    title_en: "A1-C2 coverage receipt",
    receipt_vi:
      "Nhận A1-C2 coverage từ foundation qua survival, core, academic và C2 discourse để later A11 thấy toàn đường học.",
    receipt_en:
      "Receives A1-C2 coverage from foundation through survival, core, academic, and C2 discourse so later A11 sees the full path.",
    accepted_evidence: ["learningPath", "progressionMatrix", "finalCoverageVerificationPack"],
    sample: {
      gurmukhi: "ਸਾਰੇ ਪੱਧਰ ਪ੍ਰਾਪਤ ਹੋਏ ਹਨ।",
      romanization: "sare padar prapat hoe han",
      vi: "Tất cả cấp độ đã được nhận.",
      en: "All levels were received.",
    },
  },
  {
    id: "receipt-gurmukhi-script-coverage",
    area: "gurmukhi_script_coverage",
    status: "received_for_later_a11",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਗੁਰਮੁਖੀ ਸਕ੍ਰਿਪਟ ਰਸੀਦ",
    romanization: "Gurmukhi script rasid",
    title_vi: "Receipt chữ Gurmukhi",
    title_en: "Gurmukhi/script coverage receipt",
    receipt_vi:
      "Nhận Gurmukhi primary script, romanization support và Shahmukhi awareness-only note, không phải full course.",
    receipt_en:
      "Receives Gurmukhi primary script, romanization support, and the Shahmukhi awareness-only note, not a full course.",
    accepted_evidence: ["lessons", "lessonsA1", "scriptBasics", "gurmukhiReadingLadder"],
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਰਸੀਦ ਵਿੱਚ ਪਹਿਲਾਂ ਹੈ।",
      romanization: "Gurmukhi rasid vich pehlan hai",
      vi: "Gurmukhi đứng trước trong receipt.",
      en: "Gurmukhi comes first in the receipt.",
    },
    learner_trap_vi: "Đừng dùng romanization như chữ chính khi Gurmukhi đã có.",
    learner_trap_en: "Do not use romanization as the primary script when Gurmukhi is present.",
  },
  {
    id: "receipt-canada-survival-coverage",
    area: "canada_survival_coverage",
    status: "received_for_later_a11",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਕੈਨੇਡਾ ਸਰਵਾਈਵਲ ਰਸੀਦ",
    romanization: "Canada survival rasid",
    title_vi: "Receipt sinh tồn Canada",
    title_en: "Canada survival receipt",
    receipt_vi:
      "Nhận ví dụ clinic, school, workplace, housing, transit và public service cho tình huống thực dụng ở Canada.",
    receipt_en:
      "Receives clinic, school, workplace, housing, transit, and public service examples for practical Canada situations.",
    accepted_evidence: ["canadaSurvivalProofPack", "healthcareCanada", "publicServicesCanada"],
    sample: {
      gurmukhi: "ਮੈਨੂੰ ਫਾਰਮ ਲਈ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
      romanization: "mainu form lai madad chahidi hai",
      vi: "Tôi cần giúp với mẫu đơn.",
      en: "I need help with the form.",
    },
    canada_practical_vi: "Dùng khi hỏi clinic desk, school office, landlord hoặc public service counter.",
    canada_practical_en:
      "Use when asking a clinic desk, school office, landlord, or public service counter.",
  },
  {
    id: "receipt-remediation-coverage",
    area: "remediation_coverage",
    status: "receipt_check_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੀਮੀਡੀਏਸ਼ਨ ਰਸੀਦ",
    romanization: "remediation rasid",
    title_vi: "Receipt sửa lỗi",
    title_en: "Remediation coverage receipt",
    receipt_vi:
      "Nhận repair paths cho nhầm Gurmukhi, lệ thuộc romanization, postpositions, agreement, word order và discourse repair.",
    receipt_en:
      "Receives repair paths for Gurmukhi confusion, romanization dependence, postpositions, agreement, word order, and discourse repair.",
    accepted_evidence: ["learnerErrorPatterns", "remediationBank", "masteryCheckpoints"],
    sample: {
      gurmukhi: "ਗਲਤੀ ਲਈ ਰੀਪੇਅਰ ਰਾਹ ਹੈ।",
      romanization: "galti lai repair rah hai",
      vi: "Có đường sửa lỗi cho lỗi này.",
      en: "There is a repair path for the error.",
    },
    learner_trap_vi: "Repair không chỉ là câu đúng; cần tín hiệu lỗi và luyện tập.",
    learner_trap_en: "Repair is not just the correct sentence; it needs an error signal and practice.",
  },
  {
    id: "receipt-deferred-native-review",
    area: "deferred_native_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨੇਟਿਵ ਰਿਵਿਊ ਮੁਲਤਵੀ ਰਸੀਦ",
    romanization: "native review multavi rasid",
    title_vi: "Receipt native review được hoãn",
    title_en: "Deferred native review receipt",
    receipt_vi:
      "Nhận boundary rằng native review được hoãn; technical receipt, ledger, archive hoặc signoff không phải claim hoàn tất review bản ngữ.",
    receipt_en:
      "Receives the boundary that native review is deferred; technical receipt, ledger, archive, or signoff is not a completed native-review claim.",
    accepted_evidence: ["finalOwnerReviewPacket", "finalPreA11Signoff", "finalPreA11Ledger"],
    sample: {
      gurmukhi: "ਰਿਵਿਊ ਬਾਅਦ ਵਿੱਚ ਰਹਿੰਦਾ ਹੈ।",
      romanization: "review baad vich rahinda hai",
      vi: "Review vẫn để sau.",
      en: "Review remains for later.",
    },
    must_not_claim_vi: "Không claim native reviewed hoặc native-approved.",
    must_not_claim_en: "Do not claim native reviewed or native-approved.",
  },
  {
    id: "receipt-forbidden-claims",
    area: "forbidden_claims",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮਨ੍ਹਾ ਦਾਅਵੇ ਰਸੀਦ",
    romanization: "manha daave rasid",
    title_vi: "Receipt claim bị cấm",
    title_en: "Forbidden claims receipt",
    receipt_vi:
      "Nhận boundary: pre-A11 receipt, ledger và archive chỉ là dữ liệu; không claim integration, release, deployment hoặc native review hoàn tất.",
    receipt_en:
      "Receives the boundary: pre-A11 receipt, ledger, and archive are data only; no integration, release, deployment, or completed native-review claim.",
    accepted_evidence: ["finalIntegrationGuardrails", "finalGoNoGoChecklist", "finalPreA11Seal"],
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ ਰਸੀਦ ਹੈ।",
      romanization: "ih sirf rasid hai",
      vi: "Đây chỉ là receipt.",
      en: "This is only a receipt.",
    },
    must_not_claim_vi: "Không claim đã chạy A11, đã push, đã deploy, hoặc đã review bản ngữ.",
    must_not_claim_en: "Do not claim A11 has run, pushed, deployed, or completed native review.",
  },
];

export const PUNJABI_FINAL_PRE_A11_RECEIPT_ROUTES = [
  {
    id: "receipt-readiness-route",
    vi: "Route dữ liệu cho receipt inventory, import/export và naming trước later A11.",
    en: "Data route for receipt inventory, import/export, and naming before later A11.",
    item_ids: [
      "receipt-module-family-inventory",
      "receipt-import-export-expectations",
      "receipt-naming-consistency",
    ],
  },
  {
    id: "receipt-coverage-route",
    vi: "Route dữ liệu cho coverage A1-C2, Gurmukhi, Canada và remediation.",
    en: "Data route for A1-C2, Gurmukhi, Canada, and remediation coverage.",
    item_ids: [
      "receipt-a1-c2-coverage",
      "receipt-gurmukhi-script-coverage",
      "receipt-canada-survival-coverage",
      "receipt-remediation-coverage",
    ],
  },
  {
    id: "receipt-boundary-route",
    vi: "Route dữ liệu cho duplicate-id risk, native review deferred và forbidden claims.",
    en: "Data route for duplicate-id risk, deferred native review, and forbidden claims.",
    item_ids: [
      "receipt-duplicate-id-risks",
      "receipt-deferred-native-review",
      "receipt-forbidden-claims",
    ],
  },
] as const;

export const PUNJABI_FINAL_PRE_A11_RECEIPT_ROOT = {
  scope: PUNJABI_FINAL_PRE_A11_RECEIPT_SCOPE,
  areas: PUNJABI_FINAL_PRE_A11_RECEIPT_AREAS,
  items: PUNJABI_FINAL_PRE_A11_RECEIPT,
  routes: PUNJABI_FINAL_PRE_A11_RECEIPT_ROUTES,
} as const;

export const PUNJABI_FINAL_PRE_A11_RECEIPT_ITEMS = PUNJABI_FINAL_PRE_A11_RECEIPT;

export const punjabiFinalPreA11ReceiptByArea = (area: PunjabiFinalPreA11ReceiptArea) =>
  PUNJABI_FINAL_PRE_A11_RECEIPT.filter((item) => item.area === area);

export default PUNJABI_FINAL_PRE_A11_RECEIPT_ROOT;
