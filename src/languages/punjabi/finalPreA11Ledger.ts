// src/languages/punjabi/finalPreA11Ledger.ts
//
// Wave 55 final pre-A11 ledger for Punjabi.
// This is app-consumable readiness data only. It does not perform A11 integration.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalPreA11LedgerArea =
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

export type PunjabiFinalPreA11LedgerDisposition =
  | "ledger_ready"
  | "later_a11_check"
  | "deferred_boundary";

export type PunjabiFinalPreA11LedgerItem = {
  id: string;
  area: PunjabiFinalPreA11LedgerArea;
  disposition: PunjabiFinalPreA11LedgerDisposition;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  ledger_vi: string;
  ledger_en: string;
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

export const PUNJABI_FINAL_PRE_A11_LEDGER_SCOPE = {
  wave: "Wave 55",
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  not_a11_integration: true,
  purpose_vi:
    "Ledger này ghi inventory cuối trước A11 cho later integration; nó không nối route, registry, UI hoặc runtime.",
  purpose_en:
    "This ledger records the final inventory before A11 for later integration; it does not wire routes, registries, UI, or runtime.",
  script_policy_vi:
    "Gurmukhi là chữ chính. Romanization hỗ trợ đọc. Shahmukhi chỉ là nhận biết, không phải khóa học đầy đủ.",
  script_policy_en:
    "Gurmukhi is primary. Romanization supports reading. Shahmukhi is awareness only, not a full course.",
  native_review_vi:
    "Native review được hoãn; ledger này không tuyên bố đã được kiểm duyệt bản ngữ.",
  native_review_en:
    "Native review is deferred; this ledger does not claim completed native review.",
  excluded_vi:
    "Không tạo audio, không chấm điểm phát âm, không Azure, auth, billing, RLS, Supabase, CI config, push, deploy hoặc .local.",
  excluded_en:
    "No audio creation, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy, or .local.",
} as const;

export const PUNJABI_FINAL_PRE_A11_LEDGER_AREAS: PunjabiFinalPreA11LedgerArea[] = [
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

export const PUNJABI_FINAL_PRE_A11_LEDGER: PunjabiFinalPreA11LedgerItem[] = [
  {
    id: "ledger-module-family-inventory",
    area: "module_family_inventory",
    disposition: "ledger_ready",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਲੈਜਰ",
    romanization: "module parivaar ledger",
    title_vi: "Ledger inventory họ module",
    title_en: "Module-family inventory ledger",
    ledger_vi:
      "Ghi cùng family cho course map, learning path, progression matrix, mastery checkpoints, content index, QA inventory và readiness artifacts.",
    ledger_en:
      "Records one family across course map, learning path, progression matrix, mastery checkpoints, content index, QA inventory, and readiness artifacts.",
    evidence_modules: [
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "masteryCheckpoints",
      "contentIndex",
      "finalQaInventory",
    ],
    sample: {
      gurmukhi: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਇੱਕ ਜਗ੍ਹਾ ਦਰਜ ਹੈ।",
      romanization: "module parivaar ikk jagha daraj hai",
      vi: "Họ module được ghi ở một nơi.",
      en: "The module family is recorded in one place.",
    },
    learner_trap_vi: "Ledger inventory không có nghĩa later A11 đã được chạy.",
    learner_trap_en: "The inventory ledger does not mean later A11 has run.",
  },
  {
    id: "ledger-import-export-expectations",
    area: "import_export_expectations",
    disposition: "later_a11_check",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ ਐਕਸਪੋਰਟ ਲੈਜਰ",
    romanization: "import export ledger",
    title_vi: "Ledger kỳ vọng import/export",
    title_en: "Import/export expectations ledger",
    ledger_vi:
      "Ghi named exports, default root, item alias và helper filter để later A11 có thể import dữ liệu TypeScript trực tiếp.",
    ledger_en:
      "Records named exports, default root, item aliases, and helper filters so later A11 can import TypeScript data directly.",
    evidence_modules: ["finalImportReadinessMap", "finalExportReadiness", "finalModuleRegistry"],
    sample: {
      gurmukhi: "ਡਾਟਾ ਸਿੱਧਾ ਇੰਪੋਰਟ ਕਰੋ।",
      romanization: "data sidha import karo",
      vi: "Import dữ liệu trực tiếp.",
      en: "Import the data directly.",
    },
    learner_trap_vi: "Nhãn tiếng Punjabi đẹp không thay thế export identifier ổn định.",
    learner_trap_en: "A friendly Punjabi label does not replace a stable export identifier.",
  },
  {
    id: "ledger-naming-consistency",
    area: "naming_consistency",
    disposition: "later_a11_check",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਂ ਇਕਸਾਰਤਾ ਲੈਜਰ",
    romanization: "naam iksarta ledger",
    title_vi: "Ledger nhất quán tên gọi",
    title_en: "Naming consistency ledger",
    ledger_vi:
      "Giữ pattern Punjabi final pre-A11 cho file, export, item id, route label và pre-integration checklist label.",
    ledger_en:
      "Keeps naming consistent with the Punjabi final pre-A11 pattern across files, exports, item ids, route labels, and pre-integration checklist labels.",
    evidence_modules: [
      "finalPreA11Snapshot",
      "finalPreA11ClosurePacket",
      "finalPreA11Seal",
      "finalPreA11Signoff",
      "finalPreA11ArchiveIndex",
    ],
    sample: {
      gurmukhi: "ਨਾਂ ਇਕਸਾਰ ਰੱਖੋ।",
      romanization: "naam iksar rakho",
      vi: "Giữ tên gọi nhất quán.",
      en: "Keep names consistent.",
    },
    learner_trap_vi: "Tên gần giống có thể làm later A11 chọn nhầm artifact.",
    learner_trap_en: "Nearly matching names can make later A11 select the wrong artifact.",
  },
  {
    id: "ledger-duplicate-id-risks",
    area: "duplicate_id_risks",
    disposition: "later_a11_check",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ID ਜੋਖਮ ਲੈਜਰ",
    romanization: "duplicate ID jokhim ledger",
    title_vi: "Ledger rủi ro trùng ID",
    title_en: "Duplicate-ID risks ledger",
    ledger_vi:
      "Đánh dấu item id, module id, checklist id và later route key cần unique trước khi tích hợp.",
    ledger_en:
      "Marks item ids, module ids, checklist ids, and later route keys that must stay unique before integration.",
    evidence_modules: ["finalModuleRegistry", "finalContentManifest", "finalGoNoGoChecklist"],
    sample: {
      gurmukhi: "ਹਰ ID ਵੱਖਰਾ ਰਹੇ।",
      romanization: "har ID vakhra rahe",
      vi: "Mỗi ID nên riêng.",
      en: "Each ID should stay distinct.",
    },
    learner_trap_vi: "Cùng topic không tự động là trùng; phải kiểm tra full id.",
    learner_trap_en: "The same topic is not automatically a duplicate; check the full id.",
  },
  {
    id: "ledger-a1-c2-coverage",
    area: "a1_c2_coverage",
    disposition: "ledger_ready",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1 ਤੋਂ C2 ਕਵਰੇਜ ਲੈਜਰ",
    romanization: "A1 ton C2 coverage ledger",
    title_vi: "Ledger coverage A1 đến C2",
    title_en: "A1-C2 coverage ledger",
    ledger_vi:
      "Ghi coverage từ A1 foundation qua survival, core, academic và C2 discourse để later A11 thấy toàn đường học.",
    ledger_en:
      "Records A1-C2 coverage from A1 foundation through survival, core, academic, and C2 discourse so later A11 sees the full path.",
    evidence_modules: ["learningPath", "progressionMatrix", "finalCoverageVerificationPack"],
    sample: {
      gurmukhi: "ਸਾਰੇ ਪੱਧਰ ਲੈਜਰ ਵਿੱਚ ਹਨ।",
      romanization: "sare padar ledger vich han",
      vi: "Tất cả cấp độ có trong ledger.",
      en: "All levels are in the ledger.",
    },
  },
  {
    id: "ledger-gurmukhi-script-coverage",
    area: "gurmukhi_script_coverage",
    disposition: "ledger_ready",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਗੁਰਮੁਖੀ ਸਕ੍ਰਿਪਟ ਲੈਜਰ",
    romanization: "Gurmukhi script ledger",
    title_vi: "Ledger chữ Gurmukhi",
    title_en: "Gurmukhi/script coverage ledger",
    ledger_vi:
      "Gurmukhi là primary script; romanization chỉ hỗ trợ đọc; Shahmukhi chỉ được nhắc như awareness, không dạy đầy đủ.",
    ledger_en:
      "Gurmukhi is the primary script; romanization only supports reading; Shahmukhi is awareness only, not fully taught.",
    evidence_modules: ["lessons", "lessonsA1", "scriptBasics", "gurmukhiReadingLadder"],
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ ਹੈ।",
      romanization: "Gurmukhi pehlan hai",
      vi: "Gurmukhi đứng trước.",
      en: "Gurmukhi comes first.",
    },
    learner_trap_vi: "Đừng phụ thuộc romanization khi câu Gurmukhi đã có.",
    learner_trap_en: "Do not depend on romanization when the Gurmukhi sentence is present.",
  },
  {
    id: "ledger-canada-survival-coverage",
    area: "canada_survival_coverage",
    disposition: "ledger_ready",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਕੈਨੇਡਾ ਸਰਵਾਈਵਲ ਲੈਜਰ",
    romanization: "Canada survival ledger",
    title_vi: "Ledger sinh tồn Canada",
    title_en: "Canada survival ledger",
    ledger_vi:
      "Ghi tình huống clinic, school, workplace, housing, transit và public service cho ví dụ thực dụng ở Canada.",
    ledger_en:
      "Records clinic, school, workplace, housing, transit, and public service situations for practical Canada examples.",
    evidence_modules: ["canadaSurvivalProofPack", "healthcareCanada", "publicServicesCanada"],
    sample: {
      gurmukhi: "ਮੈਨੂੰ ਅਪਾਇੰਟਮੈਂਟ ਚਾਹੀਦੀ ਹੈ।",
      romanization: "mainu appointment chahidi hai",
      vi: "Tôi cần một cuộc hẹn.",
      en: "I need an appointment.",
    },
    canada_practical_vi: "Dùng khi gọi clinic, hỏi school office, hoặc nói chuyện với landlord.",
    canada_practical_en: "Use when calling a clinic, asking a school office, or speaking with a landlord.",
  },
  {
    id: "ledger-remediation-coverage",
    area: "remediation_coverage",
    disposition: "later_a11_check",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੀਮੀਡੀਏਸ਼ਨ ਲੈਜਰ",
    romanization: "remediation ledger",
    title_vi: "Ledger sửa lỗi",
    title_en: "Remediation coverage ledger",
    ledger_vi:
      "Ghi repair paths cho nhầm Gurmukhi, lệ thuộc romanization, postpositions, agreement, word order và discourse repair.",
    ledger_en:
      "Records repair paths for Gurmukhi confusion, romanization dependence, postpositions, agreement, word order, and discourse repair.",
    evidence_modules: ["learnerErrorPatterns", "remediationBank", "masteryCheckpoints"],
    sample: {
      gurmukhi: "ਗਲਤੀ ਨੂੰ ਅਭਿਆਸ ਬਣਾਓ।",
      romanization: "galti nu abhyas banao",
      vi: "Biến lỗi thành bài tập.",
      en: "Turn the error into practice.",
    },
    learner_trap_vi: "Repair cần chỉ ra lỗi và bài tập, không chỉ đưa câu đúng.",
    learner_trap_en: "Repair needs an error signal and practice, not only the corrected sentence.",
  },
  {
    id: "ledger-deferred-native-review",
    area: "deferred_native_review",
    disposition: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨੇਟਿਵ ਰਿਵਿਊ ਮੁਲਤਵੀ ਲੈਜਰ",
    romanization: "native review multavi ledger",
    title_vi: "Ledger native review được hoãn",
    title_en: "Deferred native review ledger",
    ledger_vi:
      "Ghi rõ native review được hoãn; kỹ thuật readiness, archive hoặc signoff không phải claim kiểm duyệt bản ngữ hoàn tất.",
    ledger_en:
      "Records that native review is deferred; technical readiness, archive, or signoff is not a completed native-review claim.",
    evidence_modules: ["finalOwnerReviewPacket", "finalPreA11Signoff", "finalPreA11ArchiveIndex"],
    sample: {
      gurmukhi: "ਰਿਵਿਊ ਬਾਅਦ ਲਈ ਹੈ।",
      romanization: "review baad lai hai",
      vi: "Review để giai đoạn sau.",
      en: "Review is for a later stage.",
    },
    must_not_claim_vi: "Không claim native reviewed hoặc native-approved.",
    must_not_claim_en: "Do not claim native reviewed or native-approved.",
  },
  {
    id: "ledger-forbidden-claims",
    area: "forbidden_claims",
    disposition: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮਨ੍ਹਾ ਦਾਅਵੇ ਲੈਜਰ",
    romanization: "manha daave ledger",
    title_vi: "Ledger claim bị cấm",
    title_en: "Forbidden claims ledger",
    ledger_vi:
      "Ghi boundary: pre-A11 ledger, archive và signoff chỉ là dữ liệu; không claim integration, release, deployment hoặc native review hoàn tất.",
    ledger_en:
      "Records the boundary: pre-A11 ledger, archive, and signoff are data only; no integration, release, deployment, or completed native-review claim.",
    evidence_modules: ["finalIntegrationGuardrails", "finalGoNoGoChecklist", "finalPreA11Seal"],
    sample: {
      gurmukhi: "ਇਹ ਲੈਜਰ ਹੀ ਹੈ।",
      romanization: "ih ledger hi hai",
      vi: "Đây chỉ là ledger.",
      en: "This is only a ledger.",
    },
    must_not_claim_vi: "Không claim đã chạy A11, đã push, đã deploy, hoặc đã review bản ngữ.",
    must_not_claim_en: "Do not claim A11 has run, pushed, deployed, or completed native review.",
  },
];

export const PUNJABI_FINAL_PRE_A11_LEDGER_ROUTES = [
  {
    id: "ledger-readiness-route",
    vi: "Route dữ liệu cho inventory, import/export và naming trước later A11.",
    en: "Data route for inventory, import/export, and naming before later A11.",
    item_ids: [
      "ledger-module-family-inventory",
      "ledger-import-export-expectations",
      "ledger-naming-consistency",
    ],
  },
  {
    id: "ledger-coverage-route",
    vi: "Route dữ liệu cho coverage A1-C2, Gurmukhi, Canada và remediation.",
    en: "Data route for A1-C2, Gurmukhi, Canada, and remediation coverage.",
    item_ids: [
      "ledger-a1-c2-coverage",
      "ledger-gurmukhi-script-coverage",
      "ledger-canada-survival-coverage",
      "ledger-remediation-coverage",
    ],
  },
  {
    id: "ledger-boundary-route",
    vi: "Route dữ liệu cho duplicate-id risk, native review deferred và forbidden claims.",
    en: "Data route for duplicate-id risk, deferred native review, and forbidden claims.",
    item_ids: [
      "ledger-duplicate-id-risks",
      "ledger-deferred-native-review",
      "ledger-forbidden-claims",
    ],
  },
] as const;

export const PUNJABI_FINAL_PRE_A11_LEDGER_ROOT = {
  scope: PUNJABI_FINAL_PRE_A11_LEDGER_SCOPE,
  areas: PUNJABI_FINAL_PRE_A11_LEDGER_AREAS,
  items: PUNJABI_FINAL_PRE_A11_LEDGER,
  routes: PUNJABI_FINAL_PRE_A11_LEDGER_ROUTES,
} as const;

export const PUNJABI_FINAL_PRE_A11_LEDGER_ITEMS = PUNJABI_FINAL_PRE_A11_LEDGER;

export const punjabiFinalPreA11LedgerByArea = (area: PunjabiFinalPreA11LedgerArea) =>
  PUNJABI_FINAL_PRE_A11_LEDGER.filter((item) => item.area === area);

export default PUNJABI_FINAL_PRE_A11_LEDGER_ROOT;
