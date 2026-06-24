// src/languages/punjabi/finalPreA11TraceabilityMatrix.ts
//
// Wave 62 final pre-A11 traceability matrix for Punjabi.
// This is app-consumable readiness data only. It does not perform A11 integration.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalPreA11TraceabilityArea =
  | "module_family_inventory"
  | "learner_level_mapping"
  | "gurmukhi_script_support"
  | "canada_survival_domains"
  | "remediation_coverage"
  | "bilingual_support"
  | "import_export_expectations"
  | "naming_and_duplicate_id_risks"
  | "deferred_native_review"
  | "forbidden_claims";

export type PunjabiFinalPreA11TraceabilityStyle =
  | "pre_a11_traceability"
  | "evidence_receipt"
  | "completion_record"
  | "pre_integration";

export type PunjabiFinalPreA11TraceabilityItem = {
  id: string;
  area: PunjabiFinalPreA11TraceabilityArea;
  style: PunjabiFinalPreA11TraceabilityStyle;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  trace_vi: string;
  trace_en: string;
  trace_links: string[];
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

export const PUNJABI_FINAL_PRE_A11_TRACEABILITY_SCOPE = {
  wave: "Wave 62",
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  not_a11_integration: true,
  purpose_vi:
    "Traceability matrix này map artifact pre-A11 cho later integration; nó không nối route, registry, UI hoặc runtime.",
  purpose_en:
    "This traceability matrix maps pre-A11 artifacts for later integration; it does not wire routes, registries, UI, or runtime.",
  script_policy_vi:
    "Gurmukhi là chữ chính. Romanization hỗ trợ đọc. Shahmukhi chỉ là nhận biết, không phải khóa học đầy đủ.",
  script_policy_en:
    "Gurmukhi is primary. Romanization supports reading. Shahmukhi is awareness only, not a full course.",
  native_review_vi:
    "Native review được hoãn; traceability matrix này không tuyên bố đã được kiểm duyệt bản ngữ.",
  native_review_en:
    "Native review is deferred; this traceability matrix does not claim completed native review.",
  excluded_vi:
    "Không tạo audio, không chấm điểm phát âm, không Azure, auth, billing, RLS, Supabase, CI config, push, deploy hoặc .local.",
  excluded_en:
    "No audio creation, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy, or .local.",
} as const;

export const PUNJABI_FINAL_PRE_A11_TRACEABILITY_AREAS: PunjabiFinalPreA11TraceabilityArea[] = [
  "module_family_inventory",
  "learner_level_mapping",
  "gurmukhi_script_support",
  "canada_survival_domains",
  "remediation_coverage",
  "bilingual_support",
  "import_export_expectations",
  "naming_and_duplicate_id_risks",
  "deferred_native_review",
  "forbidden_claims",
];

export const PUNJABI_FINAL_PRE_A11_TRACEABILITY_MATRIX: PunjabiFinalPreA11TraceabilityItem[] = [
  {
    id: "trace-module-family-inventory",
    area: "module_family_inventory",
    style: "pre_a11_traceability",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਟ੍ਰੇਸਬਿਲਟੀ",
    romanization: "module parivaar traceability",
    title_vi: "Traceability họ module",
    title_en: "Module-family traceability",
    trace_vi:
      "Map course map, learning path, progression matrix, mastery checkpoints, content index, evidence receipt và completion record.",
    trace_en:
      "Maps course map, learning path, progression matrix, mastery checkpoints, content index, evidence receipt, and completion record.",
    trace_links: [
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "masteryCheckpoints",
      "contentIndex",
      "finalPreA11EvidenceReceipt",
      "finalPreA11CompletionRecord",
    ],
    sample: {
      gurmukhi: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਟ੍ਰੇਸ ਹੋ ਗਿਆ ਹੈ।",
      romanization: "module parivaar trace ho gia hai",
      vi: "Họ module đã được trace.",
      en: "The module family has been traced.",
    },
    learner_trap_vi: "Traceability không có nghĩa later A11 đã chạy.",
    learner_trap_en: "Traceability does not mean later A11 has run.",
  },
  {
    id: "trace-learner-level-mapping",
    area: "learner_level_mapping",
    style: "completion_record",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਸਿੱਖਣ ਪੱਧਰ ਮੈਪਿੰਗ",
    romanization: "sikhan padar mapping",
    title_vi: "Mapping cấp độ người học",
    title_en: "Learner-level mapping",
    trace_vi:
      "Map A1-C2 coverage từ foundation qua survival, core, academic và C2 discourse để later A11 thấy toàn đường học.",
    trace_en:
      "Maps A1-C2 coverage from foundation through survival, core, academic, and C2 discourse so later A11 sees the full path.",
    trace_links: ["learningPath", "progressionMatrix", "finalCoverageVerificationPack"],
    sample: {
      gurmukhi: "ਸਾਰੇ ਪੱਧਰ ਮੈਪ ਹੋਏ ਹਨ।",
      romanization: "sare padar map hoe han",
      vi: "Tất cả cấp độ đã được map.",
      en: "All levels have been mapped.",
    },
  },
  {
    id: "trace-gurmukhi-script-support",
    area: "gurmukhi_script_support",
    style: "pre_a11_traceability",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਗੁਰਮੁਖੀ ਸਕ੍ਰਿਪਟ ਸਹਾਇਤਾ",
    romanization: "Gurmukhi script sahaita",
    title_vi: "Trace support chữ Gurmukhi",
    title_en: "Gurmukhi/script support trace",
    trace_vi:
      "Map Gurmukhi primary script, romanization support và Shahmukhi awareness-only note, không phải full course.",
    trace_en:
      "Maps Gurmukhi primary script, romanization support, and the Shahmukhi awareness-only note, not a full course.",
    trace_links: ["lessons", "lessonsA1", "scriptBasics", "gurmukhiReadingLadder"],
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ ਟ੍ਰੇਸ ਹੁੰਦੀ ਹੈ।",
      romanization: "Gurmukhi pehlan trace hundi hai",
      vi: "Gurmukhi được trace trước.",
      en: "Gurmukhi is traced first.",
    },
    learner_trap_vi: "Đừng dùng romanization như chữ chính khi Gurmukhi đã có.",
    learner_trap_en: "Do not use romanization as the primary script when Gurmukhi is present.",
  },
  {
    id: "trace-canada-survival-domains",
    area: "canada_survival_domains",
    style: "evidence_receipt",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਕੈਨੇਡਾ ਸਰਵਾਈਵਲ ਡੋਮੇਨ",
    romanization: "Canada survival domain",
    title_vi: "Trace domain sinh tồn Canada",
    title_en: "Canada survival domain trace",
    trace_vi:
      "Map clinic, school, workplace, housing, transit và public service cho tình huống thực dụng ở Canada.",
    trace_en:
      "Maps clinic, school, workplace, housing, transit, and public service domains for practical Canada situations.",
    trace_links: ["canadaSurvivalProofPack", "healthcareCanada", "publicServicesCanada"],
    sample: {
      gurmukhi: "ਮੈਂ ਸੇਵਾ ਕਾਊਂਟਰ ਤੇ ਪੁੱਛਦਾ ਹਾਂ।",
      romanization: "main seva counter te puchhda han",
      vi: "Tôi hỏi ở quầy dịch vụ.",
      en: "I ask at the service counter.",
    },
    canada_practical_vi: "Dùng khi hỏi clinic desk, school office, landlord hoặc public service counter.",
    canada_practical_en:
      "Use when asking a clinic desk, school office, landlord, or public service counter.",
  },
  {
    id: "trace-remediation-coverage",
    area: "remediation_coverage",
    style: "completion_record",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੀਮੀਡੀਏਸ਼ਨ ਟ੍ਰੇਸ",
    romanization: "remediation trace",
    title_vi: "Trace sửa lỗi",
    title_en: "Remediation coverage trace",
    trace_vi:
      "Map repair paths cho nhầm Gurmukhi, lệ thuộc romanization, postpositions, agreement, word order và discourse repair.",
    trace_en:
      "Maps repair paths for Gurmukhi confusion, romanization dependence, postpositions, agreement, word order, and discourse repair.",
    trace_links: ["learnerErrorPatterns", "remediationBank", "masteryCheckpoints"],
    sample: {
      gurmukhi: "ਗਲਤੀ ਲਈ ਰੀਪੇਅਰ ਰਾਹ ਮੈਪ ਹੈ।",
      romanization: "galti lai repair rah map hai",
      vi: "Đường sửa lỗi đã được map.",
      en: "The repair path is mapped.",
    },
    learner_trap_vi: "Repair không chỉ là câu đúng; cần tín hiệu lỗi và luyện tập.",
    learner_trap_en: "Repair is not just the correct sentence; it needs an error signal and practice.",
  },
  {
    id: "trace-bilingual-support",
    area: "bilingual_support",
    style: "pre_a11_traceability",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਦੁਭਾਸ਼ੀ ਸਹਾਇਤਾ ਟ੍ਰੇਸ",
    romanization: "dubhashi sahaita trace",
    title_vi: "Trace hỗ trợ song ngữ",
    title_en: "Bilingual support trace",
    trace_vi:
      "Map Vietnamese explanations, English explanations, Gurmukhi samples và romanization support cho mỗi family chính.",
    trace_en:
      "Maps Vietnamese explanations, English explanations, Gurmukhi samples, and romanization support for each major family.",
    trace_links: ["courseMap", "learningPath", "finalCanDoIndex", "finalPreA11EvidenceReceipt"],
    sample: {
      gurmukhi: "ਵਿਆਖਿਆ ਦੋ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਹੈ।",
      romanization: "viakhia do bhashavan vich hai",
      vi: "Giải thích có hai ngôn ngữ.",
      en: "The explanation is in two languages.",
    },
  },
  {
    id: "trace-import-export-expectations",
    area: "import_export_expectations",
    style: "pre_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ ਐਕਸਪੋਰਟ ਟ੍ਰੇਸ",
    romanization: "import export trace",
    title_vi: "Trace kỳ vọng import/export",
    title_en: "Import/export expectations trace",
    trace_vi:
      "Map named exports, default root, item aliases và helper filters để later A11 có thể import dữ liệu TypeScript trực tiếp.",
    trace_en:
      "Maps pre-integration named exports, default root, item aliases, and helper filters so later A11 can import TypeScript data directly.",
    trace_links: ["finalImportReadinessMap", "finalExportReadiness", "finalModuleRegistry"],
    sample: {
      gurmukhi: "ਡਾਟਾ ਸਿੱਧਾ ਇੰਪੋਰਟ ਹੁੰਦਾ ਹੈ।",
      romanization: "data sidha import hunda hai",
      vi: "Dữ liệu được import trực tiếp.",
      en: "Data imports directly.",
    },
    learner_trap_vi: "Trace label không thay thế export identifier ổn định.",
    learner_trap_en: "A trace label does not replace a stable export identifier.",
  },
  {
    id: "trace-naming-and-duplicate-id-risks",
    area: "naming_and_duplicate_id_risks",
    style: "pre_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਂ ਅਤੇ ਡੁਪਲੀਕੇਟ ID ਟ੍ਰੇਸ",
    romanization: "naam ate duplicate ID trace",
    title_vi: "Trace tên gọi và duplicate ID",
    title_en: "Naming and duplicate-ID trace",
    trace_vi:
      "Map naming pattern Punjabi final pre-A11 và duplicate-id risks cho file, export, item id, checklist id và later route key.",
    trace_en:
      "Maps the Punjabi final pre-A11 naming pattern and duplicate-id risks for files, exports, item ids, checklist ids, and later route keys.",
    trace_links: ["finalModuleRegistry", "finalContentManifest", "finalGoNoGoChecklist"],
    sample: {
      gurmukhi: "ਹਰ ID ਵੱਖਰਾ ਟ੍ਰੇਸ ਹੁੰਦਾ ਹੈ।",
      romanization: "har ID vakhra trace hunda hai",
      vi: "Mỗi ID được trace riêng.",
      en: "Each ID is traced separately.",
    },
    learner_trap_vi: "Cùng topic không tự động là duplicate; kiểm tra full id.",
    learner_trap_en: "The same topic is not automatically a duplicate; check the full id.",
  },
  {
    id: "trace-deferred-native-review",
    area: "deferred_native_review",
    style: "evidence_receipt",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨੇਟਿਵ ਰਿਵਿਊ ਮੁਲਤਵੀ ਟ੍ਰੇਸ",
    romanization: "native review multavi trace",
    title_vi: "Trace native review được hoãn",
    title_en: "Deferred native review trace",
    trace_vi:
      "Map boundary rằng native review được hoãn; technical traceability, evidence receipt hoặc completion record không phải claim review bản ngữ hoàn tất.",
    trace_en:
      "Maps the boundary that native review is deferred; technical traceability, evidence receipt, or completion record is not a completed native-review claim.",
    trace_links: ["finalOwnerReviewPacket", "finalPreA11Signoff", "finalPreA11EvidenceReceipt"],
    sample: {
      gurmukhi: "ਰਿਵਿਊ ਬਾਅਦ ਲਈ ਟ੍ਰੇਸ ਹੈ।",
      romanization: "review baad lai trace hai",
      vi: "Review được trace cho giai đoạn sau.",
      en: "Review is traced for a later stage.",
    },
    must_not_claim_vi: "Không claim native reviewed hoặc native-approved.",
    must_not_claim_en: "Do not claim native reviewed or native-approved.",
  },
  {
    id: "trace-forbidden-claims",
    area: "forbidden_claims",
    style: "pre_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮਨ੍ਹਾ ਦਾਅਵੇ ਟ੍ਰੇਸ",
    romanization: "manha daave trace",
    title_vi: "Trace claim bị cấm",
    title_en: "Forbidden claims trace",
    trace_vi:
      "Map boundary: pre-A11 traceability, evidence receipt và completion record chỉ là dữ liệu; không claim integration, release, deployment hoặc native review hoàn tất.",
    trace_en:
      "Maps the boundary: pre-A11 traceability, evidence receipt, and completion record are data only; no integration, release, deployment, or completed native-review claim.",
    trace_links: ["finalIntegrationGuardrails", "finalGoNoGoChecklist", "finalPreA11Seal"],
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ ਟ੍ਰੇਸਬਿਲਟੀ ਮੈਟ੍ਰਿਕਸ ਹੈ।",
      romanization: "ih sirf traceability matrix hai",
      vi: "Đây chỉ là traceability matrix.",
      en: "This is only a traceability matrix.",
    },
    must_not_claim_vi: "Không claim đã chạy A11, đã push, đã deploy, hoặc đã review bản ngữ.",
    must_not_claim_en: "Do not claim A11 has run, pushed, deployed, or completed native review.",
  },
];

export const PUNJABI_FINAL_PRE_A11_TRACEABILITY_ROUTES = [
  {
    id: "traceability-family-route",
    vi: "Route dữ liệu cho module family, levels và bilingual support trước later A11.",
    en: "Data route for module family, levels, and bilingual support before later A11.",
    item_ids: [
      "trace-module-family-inventory",
      "trace-learner-level-mapping",
      "trace-bilingual-support",
    ],
  },
  {
    id: "traceability-coverage-route",
    vi: "Route dữ liệu cho Gurmukhi, Canada survival và remediation coverage.",
    en: "Data route for Gurmukhi, Canada survival, and remediation coverage.",
    item_ids: [
      "trace-gurmukhi-script-support",
      "trace-canada-survival-domains",
      "trace-remediation-coverage",
    ],
  },
  {
    id: "traceability-boundary-route",
    vi: "Route dữ liệu cho import/export, naming, duplicate-id risk, deferred review và forbidden claims.",
    en: "Data route for import/export, naming, duplicate-id risk, deferred review, and forbidden claims.",
    item_ids: [
      "trace-import-export-expectations",
      "trace-naming-and-duplicate-id-risks",
      "trace-deferred-native-review",
      "trace-forbidden-claims",
    ],
  },
] as const;

export const PUNJABI_FINAL_PRE_A11_TRACEABILITY_ROOT = {
  scope: PUNJABI_FINAL_PRE_A11_TRACEABILITY_SCOPE,
  areas: PUNJABI_FINAL_PRE_A11_TRACEABILITY_AREAS,
  items: PUNJABI_FINAL_PRE_A11_TRACEABILITY_MATRIX,
  routes: PUNJABI_FINAL_PRE_A11_TRACEABILITY_ROUTES,
} as const;

export const PUNJABI_FINAL_PRE_A11_TRACEABILITY_ITEMS =
  PUNJABI_FINAL_PRE_A11_TRACEABILITY_MATRIX;

export const punjabiFinalPreA11TraceabilityByArea = (
  area: PunjabiFinalPreA11TraceabilityArea,
) => PUNJABI_FINAL_PRE_A11_TRACEABILITY_MATRIX.filter((item) => item.area === area);

export default PUNJABI_FINAL_PRE_A11_TRACEABILITY_ROOT;
