// src/languages/punjabi/finalPreA11ArchiveIndex.ts
//
// Wave 54 final pre-A11 archive index for Punjabi.
// This is app-consumable readiness data only. It does not perform A11 integration.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalPreA11ArchiveArea =
  | "module_family_completeness"
  | "import_export_expectations"
  | "naming_consistency"
  | "duplicate_id_risk"
  | "a1_c2_coverage"
  | "gurmukhi_script_coverage"
  | "canada_survival_coverage"
  | "remediation_coverage"
  | "deferred_native_review"
  | "forbidden_claims";

export type PunjabiFinalPreA11ArchiveStyle =
  | "pre_a11_archive"
  | "signoff"
  | "seal"
  | "pre_integration";

export type PunjabiFinalPreA11ArchiveIndexItem = {
  id: string;
  area: PunjabiFinalPreA11ArchiveArea;
  style: PunjabiFinalPreA11ArchiveStyle;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  archive_vi: string;
  archive_en: string;
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
};

export const PUNJABI_FINAL_PRE_A11_ARCHIVE_SCOPE = {
  wave: "Wave 54",
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  not_a11_integration: true,
  script_policy_en:
    "Gurmukhi is primary. Romanization is a support bridge. Shahmukhi is awareness only, not a full course.",
  script_policy_vi:
    "Gurmukhi là chữ chính. Romanization chỉ là cầu hỗ trợ. Shahmukhi chỉ để nhận biết, không phải khóa đầy đủ.",
  review_status: "Native review is deferred.",
  purpose_vi:
    "Archive index này khóa danh sách bằng chứng cho later A11, không nối route, registry, UI hoặc runtime.",
  purpose_en:
    "This archive index locks the evidence list for later A11 and does not wire routes, registries, UI, or runtime.",
} as const;

export const PUNJABI_FINAL_PRE_A11_ARCHIVE_AREAS: PunjabiFinalPreA11ArchiveArea[] = [
  "module_family_completeness",
  "import_export_expectations",
  "naming_consistency",
  "duplicate_id_risk",
  "a1_c2_coverage",
  "gurmukhi_script_coverage",
  "canada_survival_coverage",
  "remediation_coverage",
  "deferred_native_review",
  "forbidden_claims",
];

export const PUNJABI_FINAL_PRE_A11_ARCHIVE_INDEX: PunjabiFinalPreA11ArchiveIndexItem[] = [
  {
    id: "archive-module-family-completeness",
    area: "module_family_completeness",
    style: "pre_a11_archive",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਆਰਕਾਈਵ",
    romanization: "module parivaar archive",
    title_vi: "Archive độ đầy đủ của họ module",
    title_en: "Module-family completeness archive",
    archive_vi: "Gom course map, learning path, progression, checkpoints, QA và readiness vào cùng family.",
    archive_en: "Groups course map, learning path, progression, checkpoints, QA, and readiness into one family.",
    evidence_modules: ["courseMap", "learningPath", "progressionMatrix", "masteryCheckpoints", "finalQaInventory"],
    sample: {
      gurmukhi: "ਪੰਜਾਬੀ ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਤਿਆਰ ਹੈ।",
      romanization: "Punjabi module parivaar tiar hai",
      vi: "Họ module Punjabi đã sẵn sàng.",
      en: "The Punjabi module family is ready.",
    },
    learner_trap_vi: "Archive không có nghĩa A11 đã được tích hợp.",
    learner_trap_en: "The archive does not mean A11 has been integrated.",
  },
  {
    id: "archive-import-export-expectations",
    area: "import_export_expectations",
    style: "pre_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ ਐਕਸਪੋਰਟ ਉਮੀਦਾਂ",
    romanization: "import export umidan",
    title_vi: "Kỳ vọng import/export",
    title_en: "Import/export expectations",
    archive_vi: "Ghi rõ dữ liệu TypeScript có named export và default export ổn định cho later A11.",
    archive_en: "Records stable TypeScript named exports and default exports for later A11.",
    evidence_modules: ["finalImportReadinessMap", "finalModuleRegistry", "finalPreMergeChecklist"],
    sample: {
      gurmukhi: "ਡਾਟਾ ਸਿੱਧਾ ਇੰਪੋਰਟ ਹੁੰਦਾ ਹੈ।",
      romanization: "data sidha import hunda hai",
      vi: "Dữ liệu được import trực tiếp.",
      en: "The data imports directly.",
    },
    learner_trap_vi: "Tên hiển thị không thay thế export identifier.",
    learner_trap_en: "A display name does not replace an export identifier.",
  },
  {
    id: "archive-naming-consistency",
    area: "naming_consistency",
    style: "signoff",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਂ ਇਕਸਾਰਤਾ",
    romanization: "naam iksarta",
    title_vi: "Nhất quán tên gọi",
    title_en: "Naming consistency",
    archive_vi: "Đánh dấu file, export, id và label cùng dùng pattern Punjabi final pre-A11.",
    archive_en: "Marks files, exports, ids, and labels that share the Punjabi final pre-A11 pattern.",
    evidence_modules: ["finalPreA11Snapshot", "finalPreA11ClosurePacket", "finalPreA11Seal", "finalPreA11Signoff"],
    sample: {
      gurmukhi: "ਨਾਂ ਇਕੋ ਜਿਹਾ ਰੱਖੋ।",
      romanization: "naam iko jiha rakho",
      vi: "Giữ tên gọi nhất quán.",
      en: "Keep names consistent.",
    },
    learner_trap_vi: "Tên gần giống có thể làm later A11 chọn nhầm artifact.",
    learner_trap_en: "Nearly matching names can make later A11 select the wrong artifact.",
  },
  {
    id: "archive-duplicate-id-risk",
    area: "duplicate_id_risk",
    style: "seal",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ID ਜੋਖਮ",
    romanization: "duplicate ID jokhim",
    title_vi: "Rủi ro trùng ID",
    title_en: "Duplicate-ID risk",
    archive_vi: "Archive giữ id riêng cho module, checklist và evidence để giảm rủi ro trùng.",
    archive_en: "The archive keeps separate ids for modules, checklists, and evidence to reduce duplicate risk.",
    evidence_modules: ["finalModuleRegistry", "finalContentManifest", "finalGoNoGoChecklist"],
    sample: {
      gurmukhi: "ਹਰ ID ਵੱਖਰਾ ਹੈ।",
      romanization: "har ID vakhra hai",
      vi: "Mỗi ID là riêng.",
      en: "Each ID is distinct.",
    },
    learner_trap_vi: "Cùng chủ đề không nhất thiết là trùng id.",
    learner_trap_en: "The same topic is not automatically a duplicate id.",
  },
  {
    id: "archive-a1-c2-coverage",
    area: "a1_c2_coverage",
    style: "pre_a11_archive",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1 ਤੋਂ C2 ਕਵਰੇਜ",
    romanization: "A1 ton C2 coverage",
    title_vi: "Coverage A1 đến C2",
    title_en: "A1-C2 coverage",
    archive_vi: "Xác nhận index nhìn thấy từ nền tảng A1 đến discourse C2.",
    archive_en: "Confirms the index sees coverage from A1 foundations through C2 discourse.",
    evidence_modules: ["learningPath", "progressionMatrix", "finalCoverageVerificationPack"],
    sample: {
      gurmukhi: "ਸਾਰੇ ਪੱਧਰ ਜੋੜੇ ਗਏ ਹਨ।",
      romanization: "sare padar jore gaye han",
      vi: "Tất cả cấp độ đã được nối trong dữ liệu.",
      en: "All levels are connected in the data.",
    },
  },
  {
    id: "archive-gurmukhi-script-coverage",
    area: "gurmukhi_script_coverage",
    style: "signoff",
    levels: ["A1", "A2"],
    title_pa: "ਗੁਰਮੁਖੀ ਕਵਰੇਜ",
    romanization: "Gurmukhi coverage",
    title_vi: "Coverage chữ Gurmukhi",
    title_en: "Gurmukhi/script coverage",
    archive_vi: "Gurmukhi là chính; romanization hỗ trợ; Shahmukhi chỉ là nhận biết.",
    archive_en: "Gurmukhi is primary; romanization supports; Shahmukhi is awareness only.",
    evidence_modules: ["scriptBasics", "scriptDrills", "gurmukhiReadingLadder"],
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ ਪੜ੍ਹੋ।",
      romanization: "Gurmukhi pehlan parho",
      vi: "Đọc Gurmukhi trước.",
      en: "Read Gurmukhi first.",
    },
    learner_trap_vi: "Đừng bắt đầu từ romanization nếu đã có Gurmukhi.",
    learner_trap_en: "Do not start from romanization when Gurmukhi is available.",
  },
  {
    id: "archive-canada-survival-coverage",
    area: "canada_survival_coverage",
    style: "pre_integration",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਕੈਨੇਡਾ ਸਰਵਾਈਵਲ ਕਵਰੇਜ",
    romanization: "Canada survival coverage",
    title_vi: "Coverage sinh tồn Canada",
    title_en: "Canada survival coverage",
    archive_vi: "Giữ bằng chứng cho clinic, school, workplace, housing, transport và public service.",
    archive_en: "Keeps evidence for clinic, school, workplace, housing, transport, and public service.",
    evidence_modules: ["healthcareCanada", "publicServicesCanada", "canadaSurvivalProofPack"],
    sample: {
      gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
      romanization: "mainu madad chahidi hai",
      vi: "Tôi cần giúp.",
      en: "I need help.",
    },
    canada_practical_vi: "Dùng khi cần phục hồi giao tiếp ở dịch vụ công tại Canada.",
    canada_practical_en: "Use for communication recovery in Canadian public services.",
  },
  {
    id: "archive-remediation-coverage",
    area: "remediation_coverage",
    style: "seal",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੀਮੀਡੀਏਸ਼ਨ ਕਵਰੇਜ",
    romanization: "remediation coverage",
    title_vi: "Coverage sửa lỗi",
    title_en: "Remediation coverage",
    archive_vi: "Theo dõi script confusion, romanization dependence, word order, postpositions và agreement.",
    archive_en: "Tracks script confusion, romanization dependence, word order, postpositions, and agreement.",
    evidence_modules: ["learnerErrorPatterns", "remediationBank", "remediationClosurePacketSamples"],
    sample: {
      gurmukhi: "ਗਲਤੀ ਤੋਂ ਅਭਿਆਸ ਬਣਾਓ।",
      romanization: "galti ton abhyas banao",
      vi: "Biến lỗi thành bài tập.",
      en: "Turn the error into practice.",
    },
    learner_trap_vi: "Sửa lỗi không phải chỉ đưa đáp án đúng.",
    learner_trap_en: "Repair is not only showing the correct answer.",
  },
  {
    id: "archive-deferred-native-review",
    area: "deferred_native_review",
    style: "signoff",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨੇਟਿਵ ਰਿਵਿਊ ਮੁਲਤਵੀ",
    romanization: "native review multavi",
    title_vi: "Native review được hoãn",
    title_en: "Deferred native review",
    archive_vi: "Archive ghi rõ native review được hoãn và không tuyên bố đã review bản ngữ.",
    archive_en: "The archive records that native review is deferred and makes no completed-review claim.",
    evidence_modules: ["finalOwnerReviewPacket", "finalPreA11Signoff"],
    sample: {
      gurmukhi: "ਰਿਵਿਊ ਬਾਅਦ ਵਿੱਚ ਹੈ।",
      romanization: "review baad vich hai",
      vi: "Review để sau.",
      en: "Review comes later.",
    },
    learner_trap_vi: "Đừng biến signoff kỹ thuật thành claim review bản ngữ đã xong.",
    learner_trap_en: "Do not turn technical signoff into a completed native-review claim.",
  },
  {
    id: "archive-forbidden-claims",
    area: "forbidden_claims",
    style: "pre_a11_archive",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮਨ੍ਹਾ ਦਾਅਵੇ",
    romanization: "manha daave",
    title_vi: "Claim bị cấm",
    title_en: "Forbidden claims",
    archive_vi: "Không claim integration, runtime release, native review hoàn tất, hay chức năng ngoài phạm vi.",
    archive_en: "Does not claim integration, runtime release, completed native review, or out-of-scope functionality.",
    evidence_modules: ["finalIntegrationGuardrails", "finalGoNoGoChecklist", "finalPreA11Seal"],
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ ਆਰਕਾਈਵ ਹੈ।",
      romanization: "ih sirf archive hai",
      vi: "Đây chỉ là archive.",
      en: "This is only an archive.",
    },
    learner_trap_vi: "Ready cho later A11 không có nghĩa đã chạy A11.",
    learner_trap_en: "Ready for later A11 does not mean A11 has run.",
  },
];

export const PUNJABI_FINAL_PRE_A11_ARCHIVE_ROOT = {
  scope: PUNJABI_FINAL_PRE_A11_ARCHIVE_SCOPE,
  areas: PUNJABI_FINAL_PRE_A11_ARCHIVE_AREAS,
  items: PUNJABI_FINAL_PRE_A11_ARCHIVE_INDEX,
} as const;

export const PUNJABI_FINAL_PRE_A11_ARCHIVE_ITEMS = PUNJABI_FINAL_PRE_A11_ARCHIVE_INDEX;

export const punjabiFinalPreA11ArchiveByArea = (area: PunjabiFinalPreA11ArchiveArea) =>
  PUNJABI_FINAL_PRE_A11_ARCHIVE_INDEX.filter((item) => item.area === area);

export default PUNJABI_FINAL_PRE_A11_ARCHIVE_ROOT;
