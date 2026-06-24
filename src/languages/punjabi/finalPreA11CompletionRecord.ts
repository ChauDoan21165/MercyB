// src/languages/punjabi/finalPreA11CompletionRecord.ts
//
// Wave 60 final pre-A11 completion record for Punjabi.
// This is app-consumable readiness data only. It does not perform A11 integration.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalPreA11CompletionRecordArea =
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

export type PunjabiFinalPreA11CompletionRecordStyle =
  | "pre_a11_completion_record"
  | "inventory_seal"
  | "catalog"
  | "pre_integration";

export type PunjabiFinalPreA11CompletionRecordItem = {
  id: string;
  area: PunjabiFinalPreA11CompletionRecordArea;
  style: PunjabiFinalPreA11CompletionRecordStyle;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  completion_vi: string;
  completion_en: string;
  completed_modules: string[];
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

export const PUNJABI_FINAL_PRE_A11_COMPLETION_RECORD_SCOPE = {
  wave: "Wave 60",
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  not_a11_integration: true,
  purpose_vi:
    "Completion record này ghi hoàn tất pre-A11 cho later integration; nó không nối route, registry, UI hoặc runtime.",
  purpose_en:
    "This completion record marks pre-A11 completion for later integration; it does not wire routes, registries, UI, or runtime.",
  script_policy_vi:
    "Gurmukhi là chữ chính. Romanization hỗ trợ đọc. Shahmukhi chỉ là nhận biết, không phải khóa học đầy đủ.",
  script_policy_en:
    "Gurmukhi is primary. Romanization supports reading. Shahmukhi is awareness only, not a full course.",
  native_review_vi:
    "Native review được hoãn; completion record này không tuyên bố đã được kiểm duyệt bản ngữ.",
  native_review_en:
    "Native review is deferred; this completion record does not claim completed native review.",
  excluded_vi:
    "Không tạo audio, không chấm điểm phát âm, không Azure, auth, billing, RLS, Supabase, CI config, push, deploy hoặc .local.",
  excluded_en:
    "No audio creation, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy, or .local.",
} as const;

export const PUNJABI_FINAL_PRE_A11_COMPLETION_RECORD_AREAS: PunjabiFinalPreA11CompletionRecordArea[] =
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

export const PUNJABI_FINAL_PRE_A11_COMPLETION_RECORD: PunjabiFinalPreA11CompletionRecordItem[] = [
  {
    id: "completion-record-module-family-inventory",
    area: "module_family_inventory",
    style: "pre_a11_completion_record",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਕੰਪਲੀਸ਼ਨ ਰਿਕਾਰਡ",
    romanization: "module parivaar completion record",
    title_vi: "Completion record họ module",
    title_en: "Module-family completion record",
    completion_vi:
      "Ghi hoàn tất course map, learning path, progression matrix, mastery checkpoints, content index, QA inventory, inventory seal và catalog trong một family.",
    completion_en:
      "Records completion for course map, learning path, progression matrix, mastery checkpoints, content index, QA inventory, inventory seal, and catalog in one family.",
    completed_modules: [
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
    learner_trap_vi: "Completion record không có nghĩa later A11 đã chạy.",
    learner_trap_en: "The completion record does not mean later A11 has run.",
  },
  {
    id: "completion-record-import-export-expectations",
    area: "import_export_expectations",
    style: "pre_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ ਐਕਸਪੋਰਟ ਕੰਪਲੀਸ਼ਨ ਰਿਕਾਰਡ",
    romanization: "import export completion record",
    title_vi: "Completion record kỳ vọng import/export",
    title_en: "Import/export expectations completion record",
    completion_vi:
      "Ghi hoàn tất named exports, default root, item aliases và helper filters để later A11 có thể import dữ liệu TypeScript trực tiếp.",
    completion_en:
      "Records completion for named exports, default root, item aliases, and helper filters so later A11 can import TypeScript data directly.",
    completed_modules: ["finalImportReadinessMap", "finalExportReadiness", "finalModuleRegistry"],
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
    id: "completion-record-naming-consistency",
    area: "naming_consistency",
    style: "inventory_seal",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਂ ਇਕਸਾਰਤਾ ਕੰਪਲੀਸ਼ਨ ਰਿਕਾਰਡ",
    romanization: "naam iksarta completion record",
    title_vi: "Completion record nhất quán tên gọi",
    title_en: "Naming consistency completion record",
    completion_vi:
      "Ghi hoàn tất naming pattern Punjabi final pre-A11 cho file, export, id, completion record, inventory seal, catalog và pre-integration labels.",
    completion_en:
      "Records completion for the Punjabi final pre-A11 naming pattern across files, exports, ids, completion record, inventory seal, catalog, and pre-integration labels.",
    completed_modules: [
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
    id: "completion-record-duplicate-id-risks",
    area: "duplicate_id_risks",
    style: "catalog",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ID ਜੋਖਮ ਕੰਪਲੀਸ਼ਨ ਰਿਕਾਰਡ",
    romanization: "duplicate ID jokhim completion record",
    title_vi: "Completion record rủi ro trùng ID",
    title_en: "Duplicate-ID risks completion record",
    completion_vi:
      "Ghi hoàn tất item id, module id, checklist id và later route key cần unique trước khi tích hợp.",
    completion_en:
      "Records completion for item ids, module ids, checklist ids, and later route keys that must stay unique before integration.",
    completed_modules: ["finalModuleRegistry", "finalContentManifest", "finalGoNoGoChecklist"],
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
    id: "completion-record-a1-c2-coverage",
    area: "a1_c2_coverage",
    style: "pre_a11_completion_record",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1 ਤੋਂ C2 ਕਵਰੇਜ ਕੰਪਲੀਸ਼ਨ ਰਿਕਾਰਡ",
    romanization: "A1 ton C2 coverage completion record",
    title_vi: "Completion record coverage A1 đến C2",
    title_en: "A1-C2 coverage completion record",
    completion_vi:
      "Ghi hoàn tất A1-C2 coverage từ foundation qua survival, core, academic và C2 discourse để later A11 thấy toàn đường học.",
    completion_en:
      "Records completion for A1-C2 coverage from foundation through survival, core, academic, and C2 discourse so later A11 sees the full path.",
    completed_modules: ["learningPath", "progressionMatrix", "finalCoverageVerificationPack"],
    sample: {
      gurmukhi: "ਸਾਰੇ ਪੱਧਰ ਰਿਕਾਰਡ ਵਿੱਚ ਪੂਰੇ ਹਨ।",
      romanization: "sare padar record vich pure han",
      vi: "Tất cả cấp độ hoàn tất trong record.",
      en: "All levels are complete in the record.",
    },
  },
  {
    id: "completion-record-gurmukhi-script-coverage",
    area: "gurmukhi_script_coverage",
    style: "pre_a11_completion_record",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਗੁਰਮੁਖੀ ਸਕ੍ਰਿਪਟ ਕੰਪਲੀਸ਼ਨ ਰਿਕਾਰਡ",
    romanization: "Gurmukhi script completion record",
    title_vi: "Completion record chữ Gurmukhi",
    title_en: "Gurmukhi/script coverage completion record",
    completion_vi:
      "Ghi hoàn tất Gurmukhi primary script, romanization support và Shahmukhi awareness-only note, không phải full course.",
    completion_en:
      "Records completion for Gurmukhi primary script, romanization support, and the Shahmukhi awareness-only note, not a full course.",
    completed_modules: ["lessons", "lessonsA1", "scriptBasics", "gurmukhiReadingLadder"],
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
    id: "completion-record-canada-survival-coverage",
    area: "canada_survival_coverage",
    style: "inventory_seal",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਕੈਨੇਡਾ ਸਰਵਾਈਵਲ ਕੰਪਲੀਸ਼ਨ ਰਿਕਾਰਡ",
    romanization: "Canada survival completion record",
    title_vi: "Completion record sinh tồn Canada",
    title_en: "Canada survival completion record",
    completion_vi:
      "Ghi hoàn tất ví dụ clinic, school, workplace, housing, transit và public service cho tình huống thực dụng ở Canada.",
    completion_en:
      "Records completion for clinic, school, workplace, housing, transit, and public service examples for practical Canada situations.",
    completed_modules: ["canadaSurvivalProofPack", "healthcareCanada", "publicServicesCanada"],
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
    id: "completion-record-remediation-coverage",
    area: "remediation_coverage",
    style: "catalog",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੀਮੀਡੀਏਸ਼ਨ ਕੰਪਲੀਸ਼ਨ ਰਿਕਾਰਡ",
    romanization: "remediation completion record",
    title_vi: "Completion record sửa lỗi",
    title_en: "Remediation coverage completion record",
    completion_vi:
      "Ghi hoàn tất repair paths cho nhầm Gurmukhi, lệ thuộc romanization, postpositions, agreement, word order và discourse repair.",
    completion_en:
      "Records completion for repair paths for Gurmukhi confusion, romanization dependence, postpositions, agreement, word order, and discourse repair.",
    completed_modules: ["learnerErrorPatterns", "remediationBank", "masteryCheckpoints"],
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
    id: "completion-record-deferred-native-review",
    area: "deferred_native_review",
    style: "pre_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨੇਟਿਵ ਰਿਵਿਊ ਮੁਲਤਵੀ ਕੰਪਲੀਸ਼ਨ ਰਿਕਾਰਡ",
    romanization: "native review multavi completion record",
    title_vi: "Completion record native review được hoãn",
    title_en: "Deferred native review completion record",
    completion_vi:
      "Ghi hoàn tất boundary rằng native review được hoãn; technical completion record, inventory seal hoặc catalog không phải claim review bản ngữ hoàn tất.",
    completion_en:
      "Records completion for the boundary that native review is deferred; technical completion record, inventory seal, or catalog is not a completed native-review claim.",
    completed_modules: ["finalOwnerReviewPacket", "finalPreA11Signoff", "finalPreA11InventorySeal"],
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
    id: "completion-record-forbidden-claims",
    area: "forbidden_claims",
    style: "pre_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮਨ੍ਹਾ ਦਾਅਵੇ ਕੰਪਲੀਸ਼ਨ ਰਿਕਾਰਡ",
    romanization: "manha daave completion record",
    title_vi: "Completion record claim bị cấm",
    title_en: "Forbidden claims completion record",
    completion_vi:
      "Ghi hoàn tất boundary: pre-A11 completion record, inventory seal và catalog chỉ là dữ liệu; không claim integration, release, deployment hoặc native review hoàn tất.",
    completion_en:
      "Records completion for the boundary: pre-A11 completion record, inventory seal, and catalog are data only; no integration, release, deployment, or completed native-review claim.",
    completed_modules: ["finalIntegrationGuardrails", "finalGoNoGoChecklist", "finalPreA11Seal"],
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ ਕੰਪਲੀਸ਼ਨ ਰਿਕਾਰਡ ਹੈ।",
      romanization: "ih sirf completion record hai",
      vi: "Đây chỉ là completion record.",
      en: "This is only a completion record.",
    },
    must_not_claim_vi: "Không claim đã chạy A11, đã push, đã deploy, hoặc đã review bản ngữ.",
    must_not_claim_en: "Do not claim A11 has run, pushed, deployed, or completed native review.",
  },
];

export const PUNJABI_FINAL_PRE_A11_COMPLETION_RECORD_ROUTES = [
  {
    id: "completion-record-readiness-route",
    vi: "Route dữ liệu cho completion record, import/export và naming trước later A11.",
    en: "Data route for completion record, import/export, and naming before later A11.",
    item_ids: [
      "completion-record-module-family-inventory",
      "completion-record-import-export-expectations",
      "completion-record-naming-consistency",
    ],
  },
  {
    id: "completion-record-coverage-route",
    vi: "Route dữ liệu cho coverage A1-C2, Gurmukhi, Canada và remediation.",
    en: "Data route for A1-C2, Gurmukhi, Canada, and remediation coverage.",
    item_ids: [
      "completion-record-a1-c2-coverage",
      "completion-record-gurmukhi-script-coverage",
      "completion-record-canada-survival-coverage",
      "completion-record-remediation-coverage",
    ],
  },
  {
    id: "completion-record-boundary-route",
    vi: "Route dữ liệu cho duplicate-id risk, native review deferred và forbidden claims.",
    en: "Data route for duplicate-id risk, deferred native review, and forbidden claims.",
    item_ids: [
      "completion-record-duplicate-id-risks",
      "completion-record-deferred-native-review",
      "completion-record-forbidden-claims",
    ],
  },
] as const;

export const PUNJABI_FINAL_PRE_A11_COMPLETION_RECORD_ROOT = {
  scope: PUNJABI_FINAL_PRE_A11_COMPLETION_RECORD_SCOPE,
  areas: PUNJABI_FINAL_PRE_A11_COMPLETION_RECORD_AREAS,
  items: PUNJABI_FINAL_PRE_A11_COMPLETION_RECORD,
  routes: PUNJABI_FINAL_PRE_A11_COMPLETION_RECORD_ROUTES,
} as const;

export const PUNJABI_FINAL_PRE_A11_COMPLETION_RECORD_ITEMS =
  PUNJABI_FINAL_PRE_A11_COMPLETION_RECORD;

export const punjabiFinalPreA11CompletionRecordByArea = (
  area: PunjabiFinalPreA11CompletionRecordArea,
) => PUNJABI_FINAL_PRE_A11_COMPLETION_RECORD.filter((item) => item.area === area);

export default PUNJABI_FINAL_PRE_A11_COMPLETION_RECORD_ROOT;
