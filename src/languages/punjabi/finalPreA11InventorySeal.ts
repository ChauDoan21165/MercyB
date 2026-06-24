// src/languages/punjabi/finalPreA11InventorySeal.ts
//
// Wave 59 final pre-A11 inventory seal for Punjabi.
// This is app-consumable readiness data only. It does not perform A11 integration.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalPreA11InventorySealArea =
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

export type PunjabiFinalPreA11InventorySealStyle =
  | "pre_a11_inventory_seal"
  | "catalog"
  | "bundle"
  | "pre_integration";

export type PunjabiFinalPreA11InventorySealItem = {
  id: string;
  area: PunjabiFinalPreA11InventorySealArea;
  style: PunjabiFinalPreA11InventorySealStyle;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  seal_vi: string;
  seal_en: string;
  sealed_modules: string[];
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

export const PUNJABI_FINAL_PRE_A11_INVENTORY_SEAL_SCOPE = {
  wave: "Wave 59",
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  not_a11_integration: true,
  purpose_vi:
    "Inventory seal này khóa danh mục pre-A11 cho later integration; nó không nối route, registry, UI hoặc runtime.",
  purpose_en:
    "This inventory seal locks the pre-A11 catalog for later integration; it does not wire routes, registries, UI, or runtime.",
  script_policy_vi:
    "Gurmukhi là chữ chính. Romanization hỗ trợ đọc. Shahmukhi chỉ là nhận biết, không phải khóa học đầy đủ.",
  script_policy_en:
    "Gurmukhi is primary. Romanization supports reading. Shahmukhi is awareness only, not a full course.",
  native_review_vi:
    "Native review được hoãn; inventory seal này không tuyên bố đã được kiểm duyệt bản ngữ.",
  native_review_en:
    "Native review is deferred; this inventory seal does not claim completed native review.",
  excluded_vi:
    "Không tạo audio, không chấm điểm phát âm, không Azure, auth, billing, RLS, Supabase, CI config, push, deploy hoặc .local.",
  excluded_en:
    "No audio creation, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy, or .local.",
} as const;

export const PUNJABI_FINAL_PRE_A11_INVENTORY_SEAL_AREAS: PunjabiFinalPreA11InventorySealArea[] = [
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

export const PUNJABI_FINAL_PRE_A11_INVENTORY_SEAL: PunjabiFinalPreA11InventorySealItem[] = [
  {
    id: "inventory-seal-module-family-inventory",
    area: "module_family_inventory",
    style: "pre_a11_inventory_seal",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਇਨਵੈਂਟਰੀ ਸੀਲ",
    romanization: "module parivaar inventory seal",
    title_vi: "Inventory seal họ module",
    title_en: "Module-family inventory seal",
    seal_vi:
      "Khóa course map, learning path, progression matrix, mastery checkpoints, content index, QA inventory, catalog và bundle trong một family.",
    seal_en:
      "Seals course map, learning path, progression matrix, mastery checkpoints, content index, QA inventory, catalog, and bundle in one family.",
    sealed_modules: [
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "masteryCheckpoints",
      "contentIndex",
      "finalQaInventory",
      "finalPreA11Catalog",
      "finalPreA11BundleManifest",
    ],
    sample: {
      gurmukhi: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਸੀਲ ਵਿੱਚ ਹੈ।",
      romanization: "module parivaar seal vich hai",
      vi: "Họ module nằm trong seal.",
      en: "The module family is in the seal.",
    },
    learner_trap_vi: "Inventory seal không có nghĩa later A11 đã chạy.",
    learner_trap_en: "The inventory seal does not mean later A11 has run.",
  },
  {
    id: "inventory-seal-import-export-expectations",
    area: "import_export_expectations",
    style: "pre_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ ਐਕਸਪੋਰਟ ਇਨਵੈਂਟਰੀ ਸੀਲ",
    romanization: "import export inventory seal",
    title_vi: "Inventory seal kỳ vọng import/export",
    title_en: "Import/export expectations inventory seal",
    seal_vi:
      "Khóa named exports, default root, item aliases và helper filters để later A11 có thể import dữ liệu TypeScript trực tiếp.",
    seal_en:
      "Seals named exports, default root, item aliases, and helper filters so later A11 can import TypeScript data directly.",
    sealed_modules: ["finalImportReadinessMap", "finalExportReadiness", "finalModuleRegistry"],
    sample: {
      gurmukhi: "ਡਾਟਾ ਸੀਲ ਤੋਂ ਇੰਪੋਰਟ ਹੁੰਦਾ ਹੈ।",
      romanization: "data seal ton import hunda hai",
      vi: "Dữ liệu được import từ seal.",
      en: "Data imports from the seal.",
    },
    learner_trap_vi: "Seal label không thay thế export identifier ổn định.",
    learner_trap_en: "A seal label does not replace a stable export identifier.",
  },
  {
    id: "inventory-seal-naming-consistency",
    area: "naming_consistency",
    style: "catalog",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਂ ਇਕਸਾਰਤਾ ਇਨਵੈਂਟਰੀ ਸੀਲ",
    romanization: "naam iksarta inventory seal",
    title_vi: "Inventory seal nhất quán tên gọi",
    title_en: "Naming consistency inventory seal",
    seal_vi:
      "Khóa naming pattern Punjabi final pre-A11 cho file, export, id, inventory seal, catalog, bundle và pre-integration labels.",
    seal_en:
      "Seals the Punjabi final pre-A11 naming pattern across files, exports, ids, inventory seal, catalog, bundle, and pre-integration labels.",
    sealed_modules: [
      "finalPreA11Snapshot",
      "finalPreA11ClosurePacket",
      "finalPreA11Catalog",
      "finalPreA11BundleManifest",
      "finalPreA11Receipt",
    ],
    sample: {
      gurmukhi: "ਨਾਂ ਸੀਲ ਵਿੱਚ ਇਕਸਾਰ ਹਨ।",
      romanization: "naam seal vich iksar han",
      vi: "Tên gọi nhất quán trong seal.",
      en: "Names are consistent in the seal.",
    },
    learner_trap_vi: "Tên gần giống vẫn cần kiểm tra duplicate trước later A11.",
    learner_trap_en: "Nearly matching names still need duplicate checks before later A11.",
  },
  {
    id: "inventory-seal-duplicate-id-risks",
    area: "duplicate_id_risks",
    style: "bundle",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ID ਜੋਖਮ ਇਨਵੈਂਟਰੀ ਸੀਲ",
    romanization: "duplicate ID jokhim inventory seal",
    title_vi: "Inventory seal rủi ro trùng ID",
    title_en: "Duplicate-ID risks inventory seal",
    seal_vi:
      "Khóa item id, module id, checklist id và later route key cần unique trước khi tích hợp.",
    seal_en:
      "Seals item ids, module ids, checklist ids, and later route keys that must stay unique before integration.",
    sealed_modules: ["finalModuleRegistry", "finalContentManifest", "finalGoNoGoChecklist"],
    sample: {
      gurmukhi: "ਹਰ ID ਸੀਲ ਵਿੱਚ ਵੱਖਰਾ ਹੈ।",
      romanization: "har ID seal vich vakhra hai",
      vi: "Mỗi ID trong seal là riêng.",
      en: "Each ID in the seal is distinct.",
    },
    learner_trap_vi: "Cùng topic không tự động là duplicate; kiểm tra full id.",
    learner_trap_en: "The same topic is not automatically a duplicate; check the full id.",
  },
  {
    id: "inventory-seal-a1-c2-coverage",
    area: "a1_c2_coverage",
    style: "pre_a11_inventory_seal",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1 ਤੋਂ C2 ਕਵਰੇਜ ਇਨਵੈਂਟਰੀ ਸੀਲ",
    romanization: "A1 ton C2 coverage inventory seal",
    title_vi: "Inventory seal coverage A1 đến C2",
    title_en: "A1-C2 coverage inventory seal",
    seal_vi:
      "Khóa A1-C2 coverage từ foundation qua survival, core, academic và C2 discourse để later A11 thấy toàn đường học.",
    seal_en:
      "Seals A1-C2 coverage from foundation through survival, core, academic, and C2 discourse so later A11 sees the full path.",
    sealed_modules: ["learningPath", "progressionMatrix", "finalCoverageVerificationPack"],
    sample: {
      gurmukhi: "ਸਾਰੇ ਪੱਧਰ ਸੀਲ ਵਿੱਚ ਹਨ।",
      romanization: "sare padar seal vich han",
      vi: "Tất cả cấp độ nằm trong seal.",
      en: "All levels are in the seal.",
    },
  },
  {
    id: "inventory-seal-gurmukhi-script-coverage",
    area: "gurmukhi_script_coverage",
    style: "pre_a11_inventory_seal",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਗੁਰਮੁਖੀ ਸਕ੍ਰਿਪਟ ਇਨਵੈਂਟਰੀ ਸੀਲ",
    romanization: "Gurmukhi script inventory seal",
    title_vi: "Inventory seal chữ Gurmukhi",
    title_en: "Gurmukhi/script coverage inventory seal",
    seal_vi:
      "Khóa Gurmukhi primary script, romanization support và Shahmukhi awareness-only note, không phải full course.",
    seal_en:
      "Seals Gurmukhi primary script, romanization support, and the Shahmukhi awareness-only note, not a full course.",
    sealed_modules: ["lessons", "lessonsA1", "scriptBasics", "gurmukhiReadingLadder"],
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਸੀਲ ਵਿੱਚ ਪਹਿਲਾਂ ਹੈ।",
      romanization: "Gurmukhi seal vich pehlan hai",
      vi: "Gurmukhi đứng trước trong seal.",
      en: "Gurmukhi comes first in the seal.",
    },
    learner_trap_vi: "Đừng dùng romanization như chữ chính khi Gurmukhi đã có.",
    learner_trap_en: "Do not use romanization as the primary script when Gurmukhi is present.",
  },
  {
    id: "inventory-seal-canada-survival-coverage",
    area: "canada_survival_coverage",
    style: "catalog",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਕੈਨੇਡਾ ਸਰਵਾਈਵਲ ਇਨਵੈਂਟਰੀ ਸੀਲ",
    romanization: "Canada survival inventory seal",
    title_vi: "Inventory seal sinh tồn Canada",
    title_en: "Canada survival inventory seal",
    seal_vi:
      "Khóa ví dụ clinic, school, workplace, housing, transit và public service cho tình huống thực dụng ở Canada.",
    seal_en:
      "Seals clinic, school, workplace, housing, transit, and public service examples for practical Canada situations.",
    sealed_modules: ["canadaSurvivalProofPack", "healthcareCanada", "publicServicesCanada"],
    sample: {
      gurmukhi: "ਮੈਂ ਕੈਨੇਡਾ ਵਿੱਚ ਮਦਦ ਮੰਗਦਾ ਹਾਂ।",
      romanization: "main Canada vich madad mangda han",
      vi: "Tôi nhờ giúp ở Canada.",
      en: "I ask for help in Canada.",
    },
    canada_practical_vi: "Dùng khi hỏi clinic desk, school office, landlord hoặc public service counter.",
    canada_practical_en:
      "Use when asking a clinic desk, school office, landlord, or public service counter.",
  },
  {
    id: "inventory-seal-remediation-coverage",
    area: "remediation_coverage",
    style: "bundle",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੀਮੀਡੀਏਸ਼ਨ ਇਨਵੈਂਟਰੀ ਸੀਲ",
    romanization: "remediation inventory seal",
    title_vi: "Inventory seal sửa lỗi",
    title_en: "Remediation coverage inventory seal",
    seal_vi:
      "Khóa repair paths cho nhầm Gurmukhi, lệ thuộc romanization, postpositions, agreement, word order và discourse repair.",
    seal_en:
      "Seals repair paths for Gurmukhi confusion, romanization dependence, postpositions, agreement, word order, and discourse repair.",
    sealed_modules: ["learnerErrorPatterns", "remediationBank", "masteryCheckpoints"],
    sample: {
      gurmukhi: "ਸੀਲ ਵਿੱਚ ਰੀਪੇਅਰ ਰਾਹ ਹੈ।",
      romanization: "seal vich repair rah hai",
      vi: "Trong seal có đường sửa lỗi.",
      en: "The seal includes a repair path.",
    },
    learner_trap_vi: "Repair không chỉ là câu đúng; cần tín hiệu lỗi và luyện tập.",
    learner_trap_en: "Repair is not just the correct sentence; it needs an error signal and practice.",
  },
  {
    id: "inventory-seal-deferred-native-review",
    area: "deferred_native_review",
    style: "pre_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨੇਟਿਵ ਰਿਵਿਊ ਮੁਲਤਵੀ ਇਨਵੈਂਟਰੀ ਸੀਲ",
    romanization: "native review multavi inventory seal",
    title_vi: "Inventory seal native review được hoãn",
    title_en: "Deferred native review inventory seal",
    seal_vi:
      "Khóa boundary rằng native review được hoãn; technical inventory seal, catalog hoặc bundle không phải claim review bản ngữ hoàn tất.",
    seal_en:
      "Seals the boundary that native review is deferred; technical inventory seal, catalog, or bundle is not a completed native-review claim.",
    sealed_modules: ["finalOwnerReviewPacket", "finalPreA11Signoff", "finalPreA11Catalog"],
    sample: {
      gurmukhi: "ਰਿਵਿਊ ਬਾਅਦ ਲਈ ਸੀਲ ਵਿੱਚ ਹੈ।",
      romanization: "review baad lai seal vich hai",
      vi: "Review được ghi cho giai đoạn sau trong seal.",
      en: "Review is sealed for a later stage.",
    },
    must_not_claim_vi: "Không claim native reviewed hoặc native-approved.",
    must_not_claim_en: "Do not claim native reviewed or native-approved.",
  },
  {
    id: "inventory-seal-forbidden-claims",
    area: "forbidden_claims",
    style: "pre_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮਨ੍ਹਾ ਦਾਅਵੇ ਇਨਵੈਂਟਰੀ ਸੀਲ",
    romanization: "manha daave inventory seal",
    title_vi: "Inventory seal claim bị cấm",
    title_en: "Forbidden claims inventory seal",
    seal_vi:
      "Khóa boundary: pre-A11 inventory seal, catalog và bundle chỉ là dữ liệu; không claim integration, release, deployment hoặc native review hoàn tất.",
    seal_en:
      "Seals the boundary: pre-A11 inventory seal, catalog, and bundle are data only; no integration, release, deployment, or completed native-review claim.",
    sealed_modules: ["finalIntegrationGuardrails", "finalGoNoGoChecklist", "finalPreA11Seal"],
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ ਇਨਵੈਂਟਰੀ ਸੀਲ ਹੈ।",
      romanization: "ih sirf inventory seal hai",
      vi: "Đây chỉ là inventory seal.",
      en: "This is only an inventory seal.",
    },
    must_not_claim_vi: "Không claim đã chạy A11, đã push, đã deploy, hoặc đã review bản ngữ.",
    must_not_claim_en: "Do not claim A11 has run, pushed, deployed, or completed native review.",
  },
];

export const PUNJABI_FINAL_PRE_A11_INVENTORY_SEAL_ROUTES = [
  {
    id: "inventory-seal-readiness-route",
    vi: "Route dữ liệu cho inventory seal, import/export và naming trước later A11.",
    en: "Data route for inventory seal, import/export, and naming before later A11.",
    item_ids: [
      "inventory-seal-module-family-inventory",
      "inventory-seal-import-export-expectations",
      "inventory-seal-naming-consistency",
    ],
  },
  {
    id: "inventory-seal-coverage-route",
    vi: "Route dữ liệu cho coverage A1-C2, Gurmukhi, Canada và remediation.",
    en: "Data route for A1-C2, Gurmukhi, Canada, and remediation coverage.",
    item_ids: [
      "inventory-seal-a1-c2-coverage",
      "inventory-seal-gurmukhi-script-coverage",
      "inventory-seal-canada-survival-coverage",
      "inventory-seal-remediation-coverage",
    ],
  },
  {
    id: "inventory-seal-boundary-route",
    vi: "Route dữ liệu cho duplicate-id risk, native review deferred và forbidden claims.",
    en: "Data route for duplicate-id risk, deferred native review, and forbidden claims.",
    item_ids: [
      "inventory-seal-duplicate-id-risks",
      "inventory-seal-deferred-native-review",
      "inventory-seal-forbidden-claims",
    ],
  },
] as const;

export const PUNJABI_FINAL_PRE_A11_INVENTORY_SEAL_ROOT = {
  scope: PUNJABI_FINAL_PRE_A11_INVENTORY_SEAL_SCOPE,
  areas: PUNJABI_FINAL_PRE_A11_INVENTORY_SEAL_AREAS,
  items: PUNJABI_FINAL_PRE_A11_INVENTORY_SEAL,
  routes: PUNJABI_FINAL_PRE_A11_INVENTORY_SEAL_ROUTES,
} as const;

export const PUNJABI_FINAL_PRE_A11_INVENTORY_SEAL_ITEMS =
  PUNJABI_FINAL_PRE_A11_INVENTORY_SEAL;

export const punjabiFinalPreA11InventorySealByArea = (
  area: PunjabiFinalPreA11InventorySealArea,
) => PUNJABI_FINAL_PRE_A11_INVENTORY_SEAL.filter((item) => item.area === area);

export default PUNJABI_FINAL_PRE_A11_INVENTORY_SEAL_ROOT;
