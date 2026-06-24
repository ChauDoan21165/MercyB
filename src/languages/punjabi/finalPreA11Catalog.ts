// src/languages/punjabi/finalPreA11Catalog.ts
//
// Wave 58 final pre-A11 catalog for Punjabi.
// This is app-consumable readiness data only. It does not perform A11 integration.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalPreA11CatalogArea =
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

export type PunjabiFinalPreA11CatalogStyle =
  | "pre_a11_catalog"
  | "bundle"
  | "receipt"
  | "pre_integration";

export type PunjabiFinalPreA11CatalogItem = {
  id: string;
  area: PunjabiFinalPreA11CatalogArea;
  style: PunjabiFinalPreA11CatalogStyle;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  catalog_vi: string;
  catalog_en: string;
  catalog_modules: string[];
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

export const PUNJABI_FINAL_PRE_A11_CATALOG_SCOPE = {
  wave: "Wave 58",
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  not_a11_integration: true,
  purpose_vi:
    "Catalog này lập danh mục artifact pre-A11 cho later integration; nó không nối route, registry, UI hoặc runtime.",
  purpose_en:
    "This catalog indexes pre-A11 artifacts for later integration; it does not wire routes, registries, UI, or runtime.",
  script_policy_vi:
    "Gurmukhi là chữ chính. Romanization hỗ trợ đọc. Shahmukhi chỉ là nhận biết, không phải khóa học đầy đủ.",
  script_policy_en:
    "Gurmukhi is primary. Romanization supports reading. Shahmukhi is awareness only, not a full course.",
  native_review_vi:
    "Native review được hoãn; catalog này không tuyên bố đã được kiểm duyệt bản ngữ.",
  native_review_en:
    "Native review is deferred; this catalog does not claim completed native review.",
  excluded_vi:
    "Không tạo audio, không chấm điểm phát âm, không Azure, auth, billing, RLS, Supabase, CI config, push, deploy hoặc .local.",
  excluded_en:
    "No audio creation, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy, or .local.",
} as const;

export const PUNJABI_FINAL_PRE_A11_CATALOG_AREAS: PunjabiFinalPreA11CatalogArea[] = [
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

export const PUNJABI_FINAL_PRE_A11_CATALOG: PunjabiFinalPreA11CatalogItem[] = [
  {
    id: "catalog-module-family-inventory",
    area: "module_family_inventory",
    style: "pre_a11_catalog",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਕੈਟਾਲਾਗ",
    romanization: "module parivaar catalog",
    title_vi: "Catalog inventory họ module",
    title_en: "Module-family inventory catalog",
    catalog_vi:
      "Lập danh mục course map, learning path, progression matrix, mastery checkpoints, content index, QA inventory, bundle và receipt.",
    catalog_en:
      "Catalogs course map, learning path, progression matrix, mastery checkpoints, content index, QA inventory, bundle, and receipt.",
    catalog_modules: [
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "masteryCheckpoints",
      "contentIndex",
      "finalQaInventory",
      "finalPreA11BundleManifest",
      "finalPreA11Receipt",
    ],
    sample: {
      gurmukhi: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਕੈਟਾਲਾਗ ਵਿੱਚ ਹੈ।",
      romanization: "module parivaar catalog vich hai",
      vi: "Họ module nằm trong catalog.",
      en: "The module family is in the catalog.",
    },
    learner_trap_vi: "Catalog không có nghĩa later A11 đã chạy.",
    learner_trap_en: "The catalog does not mean later A11 has run.",
  },
  {
    id: "catalog-import-export-expectations",
    area: "import_export_expectations",
    style: "pre_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ ਐਕਸਪੋਰਟ ਕੈਟਾਲਾਗ",
    romanization: "import export catalog",
    title_vi: "Catalog kỳ vọng import/export",
    title_en: "Import/export expectations catalog",
    catalog_vi:
      "Lập danh mục named exports, default root, item aliases và helper filters để later A11 có thể import dữ liệu TypeScript trực tiếp.",
    catalog_en:
      "Catalogs named exports, default root, item aliases, and helper filters so later A11 can import TypeScript data directly.",
    catalog_modules: ["finalImportReadinessMap", "finalExportReadiness", "finalModuleRegistry"],
    sample: {
      gurmukhi: "ਡਾਟਾ ਕੈਟਾਲਾਗ ਤੋਂ ਇੰਪੋਰਟ ਹੁੰਦਾ ਹੈ।",
      romanization: "data catalog ton import hunda hai",
      vi: "Dữ liệu được import từ catalog.",
      en: "Data imports from the catalog.",
    },
    learner_trap_vi: "Catalog label không thay thế export identifier ổn định.",
    learner_trap_en: "A catalog label does not replace a stable export identifier.",
  },
  {
    id: "catalog-naming-consistency",
    area: "naming_consistency",
    style: "bundle",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਂ ਇਕਸਾਰਤਾ ਕੈਟਾਲਾਗ",
    romanization: "naam iksarta catalog",
    title_vi: "Catalog nhất quán tên gọi",
    title_en: "Naming consistency catalog",
    catalog_vi:
      "Lập danh mục naming pattern Punjabi final pre-A11 cho file, export, id, catalog, bundle, receipt và pre-integration labels.",
    catalog_en:
      "Catalogs the Punjabi final pre-A11 naming pattern across files, exports, ids, catalog, bundle, receipt, and pre-integration labels.",
    catalog_modules: [
      "finalPreA11Snapshot",
      "finalPreA11ClosurePacket",
      "finalPreA11BundleManifest",
      "finalPreA11Receipt",
      "finalPreA11Ledger",
    ],
    sample: {
      gurmukhi: "ਨਾਂ ਕੈਟਾਲਾਗ ਵਿੱਚ ਇਕਸਾਰ ਹਨ।",
      romanization: "naam catalog vich iksar han",
      vi: "Tên gọi nhất quán trong catalog.",
      en: "Names are consistent in the catalog.",
    },
    learner_trap_vi: "Tên gần giống vẫn cần kiểm tra duplicate trước later A11.",
    learner_trap_en: "Nearly matching names still need duplicate checks before later A11.",
  },
  {
    id: "catalog-duplicate-id-risks",
    area: "duplicate_id_risks",
    style: "receipt",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ID ਜੋਖਮ ਕੈਟਾਲਾਗ",
    romanization: "duplicate ID jokhim catalog",
    title_vi: "Catalog rủi ro trùng ID",
    title_en: "Duplicate-ID risks catalog",
    catalog_vi:
      "Lập danh mục item id, module id, checklist id và later route key cần unique trước khi tích hợp.",
    catalog_en:
      "Catalogs item ids, module ids, checklist ids, and later route keys that must stay unique before integration.",
    catalog_modules: ["finalModuleRegistry", "finalContentManifest", "finalGoNoGoChecklist"],
    sample: {
      gurmukhi: "ਹਰ ID ਕੈਟਾਲਾਗ ਵਿੱਚ ਵੱਖਰਾ ਹੈ।",
      romanization: "har ID catalog vich vakhra hai",
      vi: "Mỗi ID trong catalog là riêng.",
      en: "Each ID in the catalog is distinct.",
    },
    learner_trap_vi: "Cùng topic không tự động là duplicate; kiểm tra full id.",
    learner_trap_en: "The same topic is not automatically a duplicate; check the full id.",
  },
  {
    id: "catalog-a1-c2-coverage",
    area: "a1_c2_coverage",
    style: "pre_a11_catalog",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1 ਤੋਂ C2 ਕਵਰੇਜ ਕੈਟਾਲਾਗ",
    romanization: "A1 ton C2 coverage catalog",
    title_vi: "Catalog coverage A1 đến C2",
    title_en: "A1-C2 coverage catalog",
    catalog_vi:
      "Lập danh mục A1-C2 coverage từ foundation qua survival, core, academic và C2 discourse để later A11 thấy toàn đường học.",
    catalog_en:
      "Catalogs A1-C2 coverage from foundation through survival, core, academic, and C2 discourse so later A11 sees the full path.",
    catalog_modules: ["learningPath", "progressionMatrix", "finalCoverageVerificationPack"],
    sample: {
      gurmukhi: "ਸਾਰੇ ਪੱਧਰ ਕੈਟਾਲਾਗ ਵਿੱਚ ਹਨ।",
      romanization: "sare padar catalog vich han",
      vi: "Tất cả cấp độ nằm trong catalog.",
      en: "All levels are in the catalog.",
    },
  },
  {
    id: "catalog-gurmukhi-script-coverage",
    area: "gurmukhi_script_coverage",
    style: "pre_a11_catalog",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਗੁਰਮੁਖੀ ਸਕ੍ਰਿਪਟ ਕੈਟਾਲਾਗ",
    romanization: "Gurmukhi script catalog",
    title_vi: "Catalog chữ Gurmukhi",
    title_en: "Gurmukhi/script coverage catalog",
    catalog_vi:
      "Lập danh mục Gurmukhi primary script, romanization support và Shahmukhi awareness-only note, không phải full course.",
    catalog_en:
      "Catalogs Gurmukhi primary script, romanization support, and the Shahmukhi awareness-only note, not a full course.",
    catalog_modules: ["lessons", "lessonsA1", "scriptBasics", "gurmukhiReadingLadder"],
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਕੈਟਾਲਾਗ ਵਿੱਚ ਪਹਿਲਾਂ ਹੈ।",
      romanization: "Gurmukhi catalog vich pehlan hai",
      vi: "Gurmukhi đứng trước trong catalog.",
      en: "Gurmukhi comes first in the catalog.",
    },
    learner_trap_vi: "Đừng dùng romanization như chữ chính khi Gurmukhi đã có.",
    learner_trap_en: "Do not use romanization as the primary script when Gurmukhi is present.",
  },
  {
    id: "catalog-canada-survival-coverage",
    area: "canada_survival_coverage",
    style: "receipt",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਕੈਨੇਡਾ ਸਰਵਾਈਵਲ ਕੈਟਾਲਾਗ",
    romanization: "Canada survival catalog",
    title_vi: "Catalog sinh tồn Canada",
    title_en: "Canada survival catalog",
    catalog_vi:
      "Lập danh mục ví dụ clinic, school, workplace, housing, transit và public service cho tình huống thực dụng ở Canada.",
    catalog_en:
      "Catalogs clinic, school, workplace, housing, transit, and public service examples for practical Canada situations.",
    catalog_modules: ["canadaSurvivalProofPack", "healthcareCanada", "publicServicesCanada"],
    sample: {
      gurmukhi: "ਮੈਂ ਕੈਨੇਡਾ ਵਿੱਚ ਫਾਰਮ ਭਰਦਾ ਹਾਂ।",
      romanization: "main Canada vich form bharda han",
      vi: "Tôi điền mẫu đơn ở Canada.",
      en: "I fill out a form in Canada.",
    },
    canada_practical_vi: "Dùng khi hỏi clinic desk, school office, landlord hoặc public service counter.",
    canada_practical_en:
      "Use when asking a clinic desk, school office, landlord, or public service counter.",
  },
  {
    id: "catalog-remediation-coverage",
    area: "remediation_coverage",
    style: "bundle",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੀਮੀਡੀਏਸ਼ਨ ਕੈਟਾਲਾਗ",
    romanization: "remediation catalog",
    title_vi: "Catalog sửa lỗi",
    title_en: "Remediation coverage catalog",
    catalog_vi:
      "Lập danh mục repair paths cho nhầm Gurmukhi, lệ thuộc romanization, postpositions, agreement, word order và discourse repair.",
    catalog_en:
      "Catalogs repair paths for Gurmukhi confusion, romanization dependence, postpositions, agreement, word order, and discourse repair.",
    catalog_modules: ["learnerErrorPatterns", "remediationBank", "masteryCheckpoints"],
    sample: {
      gurmukhi: "ਕੈਟਾਲਾਗ ਵਿੱਚ ਰੀਪੇਅਰ ਰਾਹ ਹੈ।",
      romanization: "catalog vich repair rah hai",
      vi: "Trong catalog có đường sửa lỗi.",
      en: "The catalog includes a repair path.",
    },
    learner_trap_vi: "Repair không chỉ là câu đúng; cần tín hiệu lỗi và luyện tập.",
    learner_trap_en: "Repair is not just the correct sentence; it needs an error signal and practice.",
  },
  {
    id: "catalog-deferred-native-review",
    area: "deferred_native_review",
    style: "pre_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨੇਟਿਵ ਰਿਵਿਊ ਮੁਲਤਵੀ ਕੈਟਾਲਾਗ",
    romanization: "native review multavi catalog",
    title_vi: "Catalog native review được hoãn",
    title_en: "Deferred native review catalog",
    catalog_vi:
      "Lập danh mục boundary rằng native review được hoãn; technical catalog, bundle hoặc receipt không phải claim review bản ngữ hoàn tất.",
    catalog_en:
      "Catalogs the boundary that native review is deferred; technical catalog, bundle, or receipt is not a completed native-review claim.",
    catalog_modules: ["finalOwnerReviewPacket", "finalPreA11Signoff", "finalPreA11Receipt"],
    sample: {
      gurmukhi: "ਰਿਵਿਊ ਬਾਅਦ ਲਈ ਕੈਟਾਲਾਗ ਵਿੱਚ ਹੈ।",
      romanization: "review baad lai catalog vich hai",
      vi: "Review được ghi cho giai đoạn sau trong catalog.",
      en: "Review is cataloged for a later stage.",
    },
    must_not_claim_vi: "Không claim native reviewed hoặc native-approved.",
    must_not_claim_en: "Do not claim native reviewed or native-approved.",
  },
  {
    id: "catalog-forbidden-claims",
    area: "forbidden_claims",
    style: "pre_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮਨ੍ਹਾ ਦਾਅਵੇ ਕੈਟਾਲਾਗ",
    romanization: "manha daave catalog",
    title_vi: "Catalog claim bị cấm",
    title_en: "Forbidden claims catalog",
    catalog_vi:
      "Lập danh mục boundary: pre-A11 catalog, bundle và receipt chỉ là dữ liệu; không claim integration, release, deployment hoặc native review hoàn tất.",
    catalog_en:
      "Catalogs the boundary: pre-A11 catalog, bundle, and receipt are data only; no integration, release, deployment, or completed native-review claim.",
    catalog_modules: ["finalIntegrationGuardrails", "finalGoNoGoChecklist", "finalPreA11Seal"],
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ ਕੈਟਾਲਾਗ ਹੈ।",
      romanization: "ih sirf catalog hai",
      vi: "Đây chỉ là catalog.",
      en: "This is only a catalog.",
    },
    must_not_claim_vi: "Không claim đã chạy A11, đã push, đã deploy, hoặc đã review bản ngữ.",
    must_not_claim_en: "Do not claim A11 has run, pushed, deployed, or completed native review.",
  },
];

export const PUNJABI_FINAL_PRE_A11_CATALOG_ROUTES = [
  {
    id: "catalog-readiness-route",
    vi: "Route dữ liệu cho catalog inventory, import/export và naming trước later A11.",
    en: "Data route for catalog inventory, import/export, and naming before later A11.",
    item_ids: [
      "catalog-module-family-inventory",
      "catalog-import-export-expectations",
      "catalog-naming-consistency",
    ],
  },
  {
    id: "catalog-coverage-route",
    vi: "Route dữ liệu cho coverage A1-C2, Gurmukhi, Canada và remediation.",
    en: "Data route for A1-C2, Gurmukhi, Canada, and remediation coverage.",
    item_ids: [
      "catalog-a1-c2-coverage",
      "catalog-gurmukhi-script-coverage",
      "catalog-canada-survival-coverage",
      "catalog-remediation-coverage",
    ],
  },
  {
    id: "catalog-boundary-route",
    vi: "Route dữ liệu cho duplicate-id risk, native review deferred và forbidden claims.",
    en: "Data route for duplicate-id risk, deferred native review, and forbidden claims.",
    item_ids: [
      "catalog-duplicate-id-risks",
      "catalog-deferred-native-review",
      "catalog-forbidden-claims",
    ],
  },
] as const;

export const PUNJABI_FINAL_PRE_A11_CATALOG_ROOT = {
  scope: PUNJABI_FINAL_PRE_A11_CATALOG_SCOPE,
  areas: PUNJABI_FINAL_PRE_A11_CATALOG_AREAS,
  items: PUNJABI_FINAL_PRE_A11_CATALOG,
  routes: PUNJABI_FINAL_PRE_A11_CATALOG_ROUTES,
} as const;

export const PUNJABI_FINAL_PRE_A11_CATALOG_ITEMS = PUNJABI_FINAL_PRE_A11_CATALOG;

export const punjabiFinalPreA11CatalogByArea = (area: PunjabiFinalPreA11CatalogArea) =>
  PUNJABI_FINAL_PRE_A11_CATALOG.filter((item) => item.area === area);

export default PUNJABI_FINAL_PRE_A11_CATALOG_ROOT;
