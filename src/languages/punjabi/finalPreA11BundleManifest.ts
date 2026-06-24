// src/languages/punjabi/finalPreA11BundleManifest.ts
//
// Wave 57 final pre-A11 bundle manifest for Punjabi.
// This is app-consumable readiness data only. It does not perform A11 integration.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalPreA11BundleArea =
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

export type PunjabiFinalPreA11BundleStyle =
  | "pre_a11_bundle"
  | "receipt"
  | "ledger"
  | "pre_integration";

export type PunjabiFinalPreA11BundleItem = {
  id: string;
  area: PunjabiFinalPreA11BundleArea;
  style: PunjabiFinalPreA11BundleStyle;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  manifest_vi: string;
  manifest_en: string;
  bundled_modules: string[];
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

export const PUNJABI_FINAL_PRE_A11_BUNDLE_SCOPE = {
  wave: "Wave 57",
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  not_a11_integration: true,
  purpose_vi:
    "Bundle manifest này gom artifact pre-A11 cho later integration; nó không nối route, registry, UI hoặc runtime.",
  purpose_en:
    "This bundle manifest groups pre-A11 artifacts for later integration; it does not wire routes, registries, UI, or runtime.",
  script_policy_vi:
    "Gurmukhi là chữ chính. Romanization hỗ trợ đọc. Shahmukhi chỉ là nhận biết, không phải khóa học đầy đủ.",
  script_policy_en:
    "Gurmukhi is primary. Romanization supports reading. Shahmukhi is awareness only, not a full course.",
  native_review_vi:
    "Native review được hoãn; bundle manifest này không tuyên bố đã được kiểm duyệt bản ngữ.",
  native_review_en:
    "Native review is deferred; this bundle manifest does not claim completed native review.",
  excluded_vi:
    "Không tạo audio, không chấm điểm phát âm, không Azure, auth, billing, RLS, Supabase, CI config, push, deploy hoặc .local.",
  excluded_en:
    "No audio creation, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy, or .local.",
} as const;

export const PUNJABI_FINAL_PRE_A11_BUNDLE_AREAS: PunjabiFinalPreA11BundleArea[] = [
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

export const PUNJABI_FINAL_PRE_A11_BUNDLE_MANIFEST: PunjabiFinalPreA11BundleItem[] = [
  {
    id: "bundle-module-family-inventory",
    area: "module_family_inventory",
    style: "pre_a11_bundle",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਬੰਡਲ",
    romanization: "module parivaar bundle",
    title_vi: "Bundle inventory họ module",
    title_en: "Module-family inventory bundle",
    manifest_vi:
      "Gom course map, learning path, progression matrix, mastery checkpoints, content index, QA inventory, receipt và ledger vào một bundle.",
    manifest_en:
      "Bundles course map, learning path, progression matrix, mastery checkpoints, content index, QA inventory, receipt, and ledger into one family.",
    bundled_modules: [
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "masteryCheckpoints",
      "contentIndex",
      "finalQaInventory",
      "finalPreA11Receipt",
      "finalPreA11Ledger",
    ],
    sample: {
      gurmukhi: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਬੰਡਲ ਵਿੱਚ ਹੈ।",
      romanization: "module parivaar bundle vich hai",
      vi: "Họ module nằm trong bundle.",
      en: "The module family is in the bundle.",
    },
    learner_trap_vi: "Bundle manifest không có nghĩa later A11 đã chạy.",
    learner_trap_en: "The bundle manifest does not mean later A11 has run.",
  },
  {
    id: "bundle-import-export-expectations",
    area: "import_export_expectations",
    style: "pre_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ ਐਕਸਪੋਰਟ ਬੰਡਲ",
    romanization: "import export bundle",
    title_vi: "Bundle kỳ vọng import/export",
    title_en: "Import/export expectations bundle",
    manifest_vi:
      "Gom named exports, default root, item aliases và helper filters để later A11 có thể import dữ liệu TypeScript trực tiếp.",
    manifest_en:
      "Bundles named exports, default root, item aliases, and helper filters so later A11 can import TypeScript data directly.",
    bundled_modules: ["finalImportReadinessMap", "finalExportReadiness", "finalModuleRegistry"],
    sample: {
      gurmukhi: "ਡਾਟਾ ਬੰਡਲ ਤੋਂ ਇੰਪੋਰਟ ਹੁੰਦਾ ਹੈ।",
      romanization: "data bundle ton import hunda hai",
      vi: "Dữ liệu được import từ bundle.",
      en: "Data imports from the bundle.",
    },
    learner_trap_vi: "Bundle label không thay thế export identifier ổn định.",
    learner_trap_en: "A bundle label does not replace a stable export identifier.",
  },
  {
    id: "bundle-naming-consistency",
    area: "naming_consistency",
    style: "ledger",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਂ ਇਕਸਾਰਤਾ ਬੰਡਲ",
    romanization: "naam iksarta bundle",
    title_vi: "Bundle nhất quán tên gọi",
    title_en: "Naming consistency bundle",
    manifest_vi:
      "Gom naming pattern Punjabi final pre-A11 cho file, export, id, receipt, ledger, archive và pre-integration labels.",
    manifest_en:
      "Bundles the Punjabi final pre-A11 naming pattern across files, exports, ids, receipt, ledger, archive, and pre-integration labels.",
    bundled_modules: [
      "finalPreA11Snapshot",
      "finalPreA11ClosurePacket",
      "finalPreA11Receipt",
      "finalPreA11Ledger",
      "finalPreA11ArchiveIndex",
    ],
    sample: {
      gurmukhi: "ਨਾਂ ਬੰਡਲ ਵਿੱਚ ਇਕਸਾਰ ਹਨ।",
      romanization: "naam bundle vich iksar han",
      vi: "Tên gọi nhất quán trong bundle.",
      en: "Names are consistent in the bundle.",
    },
    learner_trap_vi: "Tên gần giống vẫn cần kiểm tra duplicate trước later A11.",
    learner_trap_en: "Nearly matching names still need duplicate checks before later A11.",
  },
  {
    id: "bundle-duplicate-id-risks",
    area: "duplicate_id_risks",
    style: "receipt",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ID ਜੋਖਮ ਬੰਡਲ",
    romanization: "duplicate ID jokhim bundle",
    title_vi: "Bundle rủi ro trùng ID",
    title_en: "Duplicate-ID risks bundle",
    manifest_vi:
      "Gom item id, module id, checklist id và later route key cần unique trước khi tích hợp.",
    manifest_en:
      "Bundles item ids, module ids, checklist ids, and later route keys that must stay unique before integration.",
    bundled_modules: ["finalModuleRegistry", "finalContentManifest", "finalGoNoGoChecklist"],
    sample: {
      gurmukhi: "ਹਰ ID ਬੰਡਲ ਵਿੱਚ ਵੱਖਰਾ ਹੈ।",
      romanization: "har ID bundle vich vakhra hai",
      vi: "Mỗi ID trong bundle là riêng.",
      en: "Each ID in the bundle is distinct.",
    },
    learner_trap_vi: "Cùng topic không tự động là duplicate; kiểm tra full id.",
    learner_trap_en: "The same topic is not automatically a duplicate; check the full id.",
  },
  {
    id: "bundle-a1-c2-coverage",
    area: "a1_c2_coverage",
    style: "pre_a11_bundle",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1 ਤੋਂ C2 ਕਵਰੇਜ ਬੰਡਲ",
    romanization: "A1 ton C2 coverage bundle",
    title_vi: "Bundle coverage A1 đến C2",
    title_en: "A1-C2 coverage bundle",
    manifest_vi:
      "Gom A1-C2 coverage từ foundation qua survival, core, academic và C2 discourse để later A11 thấy toàn đường học.",
    manifest_en:
      "Bundles A1-C2 coverage from foundation through survival, core, academic, and C2 discourse so later A11 sees the full path.",
    bundled_modules: ["learningPath", "progressionMatrix", "finalCoverageVerificationPack"],
    sample: {
      gurmukhi: "ਸਾਰੇ ਪੱਧਰ ਬੰਡਲ ਵਿੱਚ ਹਨ।",
      romanization: "sare padar bundle vich han",
      vi: "Tất cả cấp độ nằm trong bundle.",
      en: "All levels are in the bundle.",
    },
  },
  {
    id: "bundle-gurmukhi-script-coverage",
    area: "gurmukhi_script_coverage",
    style: "pre_a11_bundle",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਗੁਰਮੁਖੀ ਸਕ੍ਰਿਪਟ ਬੰਡਲ",
    romanization: "Gurmukhi script bundle",
    title_vi: "Bundle chữ Gurmukhi",
    title_en: "Gurmukhi/script coverage bundle",
    manifest_vi:
      "Gom Gurmukhi primary script, romanization support và Shahmukhi awareness-only note, không phải full course.",
    manifest_en:
      "Bundles Gurmukhi primary script, romanization support, and the Shahmukhi awareness-only note, not a full course.",
    bundled_modules: ["lessons", "lessonsA1", "scriptBasics", "gurmukhiReadingLadder"],
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਬੰਡਲ ਵਿੱਚ ਪਹਿਲਾਂ ਹੈ।",
      romanization: "Gurmukhi bundle vich pehlan hai",
      vi: "Gurmukhi đứng trước trong bundle.",
      en: "Gurmukhi comes first in the bundle.",
    },
    learner_trap_vi: "Đừng dùng romanization như chữ chính khi Gurmukhi đã có.",
    learner_trap_en: "Do not use romanization as the primary script when Gurmukhi is present.",
  },
  {
    id: "bundle-canada-survival-coverage",
    area: "canada_survival_coverage",
    style: "receipt",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਕੈਨੇਡਾ ਸਰਵਾਈਵਲ ਬੰਡਲ",
    romanization: "Canada survival bundle",
    title_vi: "Bundle sinh tồn Canada",
    title_en: "Canada survival bundle",
    manifest_vi:
      "Gom ví dụ clinic, school, workplace, housing, transit và public service cho tình huống thực dụng ở Canada.",
    manifest_en:
      "Bundles clinic, school, workplace, housing, transit, and public service examples for practical Canada situations.",
    bundled_modules: ["canadaSurvivalProofPack", "healthcareCanada", "publicServicesCanada"],
    sample: {
      gurmukhi: "ਮੈਂ ਸਰਵਿਸ ਕਾਊਂਟਰ ਤੇ ਮਦਦ ਮੰਗਦਾ ਹਾਂ।",
      romanization: "main service counter te madad mangda han",
      vi: "Tôi nhờ giúp ở quầy dịch vụ.",
      en: "I ask for help at the service counter.",
    },
    canada_practical_vi: "Dùng khi hỏi clinic desk, school office, landlord hoặc public service counter.",
    canada_practical_en:
      "Use when asking a clinic desk, school office, landlord, or public service counter.",
  },
  {
    id: "bundle-remediation-coverage",
    area: "remediation_coverage",
    style: "ledger",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੀਮੀਡੀਏਸ਼ਨ ਬੰਡਲ",
    romanization: "remediation bundle",
    title_vi: "Bundle sửa lỗi",
    title_en: "Remediation coverage bundle",
    manifest_vi:
      "Gom repair paths cho nhầm Gurmukhi, lệ thuộc romanization, postpositions, agreement, word order và discourse repair.",
    manifest_en:
      "Bundles repair paths for Gurmukhi confusion, romanization dependence, postpositions, agreement, word order, and discourse repair.",
    bundled_modules: ["learnerErrorPatterns", "remediationBank", "masteryCheckpoints"],
    sample: {
      gurmukhi: "ਬੰਡਲ ਵਿੱਚ ਰੀਪੇਅਰ ਰਾਹ ਹੈ।",
      romanization: "bundle vich repair rah hai",
      vi: "Trong bundle có đường sửa lỗi.",
      en: "The bundle includes a repair path.",
    },
    learner_trap_vi: "Repair không chỉ là câu đúng; cần tín hiệu lỗi và luyện tập.",
    learner_trap_en: "Repair is not just the correct sentence; it needs an error signal and practice.",
  },
  {
    id: "bundle-deferred-native-review",
    area: "deferred_native_review",
    style: "pre_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨੇਟਿਵ ਰਿਵਿਊ ਮੁਲਤਵੀ ਬੰਡਲ",
    romanization: "native review multavi bundle",
    title_vi: "Bundle native review được hoãn",
    title_en: "Deferred native review bundle",
    manifest_vi:
      "Gom boundary rằng native review được hoãn; technical bundle, receipt, ledger hoặc archive không phải claim review bản ngữ hoàn tất.",
    manifest_en:
      "Bundles the boundary that native review is deferred; technical bundle, receipt, ledger, or archive is not a completed native-review claim.",
    bundled_modules: ["finalOwnerReviewPacket", "finalPreA11Signoff", "finalPreA11Receipt"],
    sample: {
      gurmukhi: "ਰਿਵਿਊ ਬਾਅਦ ਲਈ ਮੁਲਤਵੀ ਹੈ।",
      romanization: "review baad lai multavi hai",
      vi: "Review được hoãn cho giai đoạn sau.",
      en: "Review is deferred for a later stage.",
    },
    must_not_claim_vi: "Không claim native reviewed hoặc native-approved.",
    must_not_claim_en: "Do not claim native reviewed or native-approved.",
  },
  {
    id: "bundle-forbidden-claims",
    area: "forbidden_claims",
    style: "pre_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮਨ੍ਹਾ ਦਾਅਵੇ ਬੰਡਲ",
    romanization: "manha daave bundle",
    title_vi: "Bundle claim bị cấm",
    title_en: "Forbidden claims bundle",
    manifest_vi:
      "Gom boundary: pre-A11 bundle, receipt và ledger chỉ là dữ liệu; không claim integration, release, deployment hoặc native review hoàn tất.",
    manifest_en:
      "Bundles the boundary: pre-A11 bundle, receipt, and ledger are data only; no integration, release, deployment, or completed native-review claim.",
    bundled_modules: ["finalIntegrationGuardrails", "finalGoNoGoChecklist", "finalPreA11Seal"],
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ ਬੰਡਲ ਮੈਨਿਫੈਸਟ ਹੈ।",
      romanization: "ih sirf bundle manifest hai",
      vi: "Đây chỉ là bundle manifest.",
      en: "This is only a bundle manifest.",
    },
    must_not_claim_vi: "Không claim đã chạy A11, đã push, đã deploy, hoặc đã review bản ngữ.",
    must_not_claim_en: "Do not claim A11 has run, pushed, deployed, or completed native review.",
  },
];

export const PUNJABI_FINAL_PRE_A11_BUNDLE_ROUTES = [
  {
    id: "bundle-readiness-route",
    vi: "Route dữ liệu cho bundle inventory, import/export và naming trước later A11.",
    en: "Data route for bundle inventory, import/export, and naming before later A11.",
    item_ids: [
      "bundle-module-family-inventory",
      "bundle-import-export-expectations",
      "bundle-naming-consistency",
    ],
  },
  {
    id: "bundle-coverage-route",
    vi: "Route dữ liệu cho coverage A1-C2, Gurmukhi, Canada và remediation.",
    en: "Data route for A1-C2, Gurmukhi, Canada, and remediation coverage.",
    item_ids: [
      "bundle-a1-c2-coverage",
      "bundle-gurmukhi-script-coverage",
      "bundle-canada-survival-coverage",
      "bundle-remediation-coverage",
    ],
  },
  {
    id: "bundle-boundary-route",
    vi: "Route dữ liệu cho duplicate-id risk, native review deferred và forbidden claims.",
    en: "Data route for duplicate-id risk, deferred native review, and forbidden claims.",
    item_ids: [
      "bundle-duplicate-id-risks",
      "bundle-deferred-native-review",
      "bundle-forbidden-claims",
    ],
  },
] as const;

export const PUNJABI_FINAL_PRE_A11_BUNDLE_ROOT = {
  scope: PUNJABI_FINAL_PRE_A11_BUNDLE_SCOPE,
  areas: PUNJABI_FINAL_PRE_A11_BUNDLE_AREAS,
  items: PUNJABI_FINAL_PRE_A11_BUNDLE_MANIFEST,
  routes: PUNJABI_FINAL_PRE_A11_BUNDLE_ROUTES,
} as const;

export const PUNJABI_FINAL_PRE_A11_BUNDLE_ITEMS = PUNJABI_FINAL_PRE_A11_BUNDLE_MANIFEST;

export const punjabiFinalPreA11BundleByArea = (area: PunjabiFinalPreA11BundleArea) =>
  PUNJABI_FINAL_PRE_A11_BUNDLE_MANIFEST.filter((item) => item.area === area);

export default PUNJABI_FINAL_PRE_A11_BUNDLE_ROOT;
