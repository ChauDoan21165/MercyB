// src/languages/punjabi/finalMrReadinessEvidence.ts
//
// Wave 44 MR readiness evidence for Punjabi.
// This is pre-integration MR-readiness data for later A11 only. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalMrReadinessEvidenceArea =
  | "module_family_completeness"
  | "import_export_expectations"
  | "naming_consistency"
  | "duplicate_id_risk"
  | "level_coverage"
  | "script_coverage"
  | "canada_survival_coverage"
  | "remediation_coverage"
  | "mr_readiness_decision"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiFinalMrReadinessEvidenceStatus =
  | "evidenced_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalMrReadinessEvidenceItem = {
  id: string;
  area: PunjabiFinalMrReadinessEvidenceArea;
  status: PunjabiFinalMrReadinessEvidenceStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  mr_vi: string;
  mr_en: string;
  risk_vi: string;
  risk_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  mr_targets: string[];
  mr_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_MR_READINESS_EVIDENCE_SCOPE = {
  wave: "Wave 44",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  purpose_vi:
    "MR readiness evidence này chỉ ghi bằng chứng readiness trước later A11; nó không thực hiện integration.",
  purpose_en:
    "This MR readiness evidence only documents readiness evidence before later A11; it does not perform integration.",
  script_note_vi:
    "Gurmukhi là chữ chính. Shahmukhi chỉ là awareness-only, không phải full course.",
  script_note_en:
    "Gurmukhi is the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã hoàn tất.",
  native_review_en: "Native review is deferred; completion is not claimed.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI config, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, or deploy.",
};

export const PUNJABI_FINAL_MR_READINESS_EVIDENCE_SCOPE_ALIAS =
  PUNJABI_FINAL_MR_READINESS_EVIDENCE_SCOPE;

export const PUNJABI_FINAL_MR_READINESS_EVIDENCE_AREAS: PunjabiFinalMrReadinessEvidenceArea[] = [
  "module_family_completeness",
  "import_export_expectations",
  "naming_consistency",
  "duplicate_id_risk",
  "level_coverage",
  "script_coverage",
  "canada_survival_coverage",
  "remediation_coverage",
  "mr_readiness_decision",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_FINAL_MR_READINESS_EVIDENCE: PunjabiFinalMrReadinessEvidenceItem[] = [
  {
    id: "mr-module-family-completeness",
    area: "module_family_completeness",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਪੂਰਾ",
    romanization: "module parivar pura",
    title_vi: "Bằng chứng đầy đủ nhóm module",
    title_en: "Module-family completeness",
    mr_vi:
      "Evidence khi foundation, learning path, coverage, QA, owner-acceptance và final-acceptance cùng khớp một Punjabi module-family.",
    mr_en:
      "Evidence when foundation, learning path, coverage, QA, owner-acceptance, and final-acceptance align as one Punjabi module family.",
    risk_vi: "Không mark ready nếu module nào còn lệch scope, tên hoặc owner expectation.",
    risk_en: "Do not mark ready if any module still drifts in scope, naming, or owner expectation.",
    sample: {
      gurmukhi: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਪੂਰਾ ਹੈ।",
      romanization: "module parivar pura hai",
      vi: "Nhóm module đã đầy đủ.",
      en: "The module family is complete.",
    },
    mr_targets: ["contentIndex", "finalModuleRegistry", "finalOwnerAcceptanceChecklist"],
    mr_tags: ["module-family", "MR-readiness", "final-freeze", "pre-integration"],
    learner_trap_vi: "MR readiness không có nghĩa later A11 đã chạy.",
    learner_trap_en: "MR readiness does not mean later A11 has run.",
  },
  {
    id: "mr-import-export-expectations",
    area: "import_export_expectations",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ export ਲੌਕ",
    romanization: "import export mr",
    title_vi: "Bằng chứng import/export",
    title_en: "Import/export expectations",
    mr_vi:
      "Evidence khi named exports, default exports, expected imports và route labels có checklist rõ.",
    mr_en:
      "Evidence when named exports, default exports, expected imports, and route labels have a clear checklist.",
    risk_vi: "Import/export drift có thể làm later A11 nối sai dữ liệu.",
    risk_en: "Import/export drift can make later A11 wire the wrong data.",
    sample: {
      gurmukhi: "ਇੰਪੋਰਟ ਤੇ export ਲੌਕ ਹਨ।",
      romanization: "import te export mr han",
      vi: "Import và export có bằng chứng.",
      en: "Imports and exports have evidence.",
    },
    mr_targets: ["finalImportReadinessMap", "finalExportReadiness", "finalAcceptanceChecklist"],
    mr_tags: ["import", "export", "MR-readiness", "final-lock"],
    learner_trap_vi: "Tên hiển thị không thay thế export identifier ổn định.",
    learner_trap_en: "A display name does not replace a stable export identifier.",
  },
  {
    id: "mr-naming-consistency",
    area: "naming_consistency",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਂ ਇਕਸਾਰਤਾ mr",
    romanization: "naam iksarta mr",
    title_vi: "MR nhất quán tên",
    title_en: "Naming consistency",
    mr_vi:
      "Evidence khi file names, export names, route IDs, item IDs và display labels dùng cùng Punjabi naming pattern.",
    mr_en:
      "Evidence when file names, export names, route IDs, item IDs, and display labels use the same Punjabi naming pattern.",
    risk_vi: "Naming drift có thể làm later A11 import nhầm module hoặc route.",
    risk_en: "Naming drift can make later A11 import the wrong module or route.",
    sample: {
      gurmukhi: "ਨਾਂ ਇਕਸਾਰ ਰੱਖੋ।",
      romanization: "naam iksar rakho",
      vi: "Giữ tên nhất quán.",
      en: "Keep names consistent.",
    },
    mr_targets: ["finalLockChecklist", "finalOwnerAcceptanceChecklist", "finalAcceptanceChecklist"],
    mr_tags: ["naming", "consistency", "MR-readiness", "final-freeze"],
    learner_trap_vi: "Tên gần giống không đủ; route ID và export name phải khớp rõ.",
    learner_trap_en: "A similar-looking name is not enough; route IDs and export names need clear alignment.",
  },
  {
    id: "mr-duplicate-id-risk",
    area: "duplicate_id_risk",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ID ਲੌਕ",
    romanization: "duplicate ID mr",
    title_vi: "Bằng chứng rủi ro trùng ID",
    title_en: "Duplicate-ID risk",
    mr_vi: "Evidence khi item IDs, route IDs, module IDs và evidence IDs không trùng.",
    mr_en: "Evidence when item IDs, route IDs, module IDs, and evidence IDs are not duplicated.",
    risk_vi: "ID trùng có thể làm registry ghi đè sai item hoặc route.",
    risk_en: "Duplicate IDs can make a registry overwrite the wrong item or route.",
    sample: {
      gurmukhi: "ਹਰ ID ਵੱਖਰੀ ਰਹੇ।",
      romanization: "har ID vakhri rahe",
      vi: "Mỗi ID phải riêng.",
      en: "Every ID should stay distinct.",
    },
    mr_targets: ["finalModuleRegistry", "finalContentManifest", "finalGoNoGoChecklist"],
    mr_tags: ["duplicate-risk", "ids", "registry"],
    learner_trap_vi: "Cùng topic không luôn là duplicate; phải so full ID.",
    learner_trap_en: "The same topic is not always a duplicate; compare the full ID.",
  },
  {
    id: "mr-level-coverage",
    area: "level_coverage",
    status: "evidenced_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1-C2 ਲੌਕ",
    romanization: "A1-C2 mr",
    title_vi: "Bằng chứng A1-C2",
    title_en: "A1-C2 coverage",
    mr_vi:
      "Evidence khi A1-C2 có goals, lessons, can-do, QA, review và remediation markers cho Vietnamese và English learners.",
    mr_en:
      "Evidence when A1-C2 has goals, lessons, can-do items, QA, review, and remediation markers for Vietnamese and English learners.",
    risk_vi: "Thiếu level làm learner route bị đứt.",
    risk_en: "A missing level breaks the learner route.",
    sample: {
      gurmukhi: "A1 ਤੋਂ C2 ਤੱਕ ਰਾਹ ਲੌਕ ਹੈ।",
      romanization: "A1 ton C2 takk raah mr hai",
      vi: "Lộ trình từ A1 đến C2 có bằng chứng.",
      en: "The path from A1 to C2 has evidence.",
    },
    mr_targets: ["courseMap", "learningPath", "progressionMatrix", "finalCanDoIndex"],
    mr_tags: ["a1-c2", "coverage", "learner-route"],
    learner_trap_vi: "A1-C2 coverage không phải official certification claim.",
    learner_trap_en: "A1-C2 coverage is not an official certification claim.",
  },
  {
    id: "mr-script-coverage",
    area: "script_coverage",
    status: "evidenced_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਲੌਕ",
    romanization: "Gurmukhi mr",
    title_vi: "Bằng chứng Gurmukhi",
    title_en: "Gurmukhi/script coverage",
    mr_vi: "Evidence khi Gurmukhi là primary script và romanization chỉ hỗ trợ khi hữu ích.",
    mr_en: "Evidence when Gurmukhi is the primary script and romanization only supports where useful.",
    risk_vi: "Không mark ready nếu romanization thay thế Gurmukhi trong sample chính.",
    risk_en: "Do not mark ready if romanization replaces Gurmukhi in primary samples.",
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ ਰਹੇ।",
      romanization: "Gurmukhi pehlan rahe",
      vi: "Gurmukhi vẫn đi trước.",
      en: "Gurmukhi stays first.",
    },
    mr_targets: ["normalize", "lessons", "lessons-a1", "skillDependencyGraph"],
    mr_tags: ["gurmukhi-first", "script", "romanization"],
    learner_trap_vi: "Shahmukhi chỉ là awareness-only, không phải full course.",
    learner_trap_en: "Shahmukhi is awareness-only, not a full course.",
  },
  {
    id: "mr-canada-survival",
    area: "canada_survival_coverage",
    status: "evidenced_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਕੈਨੇਡਾ survival ਲੌਕ",
    romanization: "Canada survival mr",
    title_vi: "Bằng chứng sinh hoạt Canada",
    title_en: "Canada survival coverage",
    mr_vi:
      "Evidence khi clinic, school, transit, workplace, forms và public-service examples đều text-only và thực dụng.",
    mr_en:
      "Evidence when clinic, school, transit, workplace, forms, and public-service examples are text-only and practical.",
    risk_vi: "Thiếu Canada coverage làm module kém thực dụng cho người học ở Canada.",
    risk_en: "Missing Canada coverage makes the module less practical for learners in Canada.",
    sample: {
      gurmukhi: "ਮੈਨੂੰ ਸਕੂਲ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
      romanization: "mainu school form chahida hai",
      vi: "Tôi cần mẫu của trường.",
      en: "I need the school form.",
    },
    mr_targets: ["dialogues", "contentIndex", "preIntegrationCoverageMap", "finalNavigationMap"],
    mr_tags: ["canada-practical", "survival", "public-service"],
    canada_practical:
      "Use text-only examples for clinic appointments, school forms, transit, workplace scheduling, and public services.",
    learner_trap_vi: "Ví dụ Canada-practical không phải tư vấn pháp lý hay y tế.",
    learner_trap_en: "Canada-practical examples are not legal or medical advice.",
  },
  {
    id: "mr-remediation-coverage",
    area: "remediation_coverage",
    status: "evidenced_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੀਮੀਡੀਏਸ਼ਨ ਲੌਕ",
    romanization: "remediation mr",
    title_vi: "Bằng chứng sửa lỗi",
    title_en: "Remediation coverage",
    mr_vi:
      "Evidence khi script confusion, postpositions, register, review gaps và Canada-domain gaps có remediation path.",
    mr_en:
      "Evidence when script confusion, postpositions, register, review gaps, and Canada-domain gaps have a remediation path.",
    risk_vi: "Không mark ready nếu QA có lỗi nhưng không có đường sửa.",
    risk_en: "Do not mark ready if QA has errors without a repair path.",
    sample: {
      gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰੋ।",
      romanization: "galti thik karo",
      vi: "Hãy sửa lỗi.",
      en: "Fix the error.",
    },
    mr_targets: ["skillDependencyGraph", "masteryCheckpoints", "finalQualityGates", "finalQaInventory"],
    mr_tags: ["remediation", "learner-traps", "quality"],
    learner_trap_vi: "Text-only remediation không tạo pronunciation scoring.",
    learner_trap_en: "Text-only remediation does not create pronunciation scoring.",
  },
  {
    id: "mr-decision-boundary",
    area: "mr_readiness_decision",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "MR readiness ਫ਼ੈਸਲਾ",
    romanization: "MR readiness faisla",
    title_vi: "Quyết định MR readiness",
    title_en: "MR-readiness final-freeze final-lock decision",
    mr_vi:
      "MR readiness chỉ là pre-integration owner-acceptance/final-acceptance decision; không chạy A11 integration, push hoặc deploy.",
    mr_en:
      "MR readiness is only a pre-integration final-freeze, final-lock, owner-acceptance, and final-acceptance decision; it does not run A11 integration, push, or deploy.",
    risk_vi: "Không mark ready nếu wave này sửa integration wiring hoặc claim release thật.",
    risk_en: "Do not mark ready if this wave edits integration wiring or claims a real release.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ MR readiness check ਹੈ।",
      romanization: "ih siraf MR readiness check hai",
      vi: "Đây chỉ là kiểm MR readiness.",
      en: "This is only a MR readiness check.",
    },
    mr_targets: ["finalFreezeChecklist", "finalLockChecklist", "finalOwnerAcceptanceChecklist", "finalAcceptanceChecklist"],
    mr_tags: ["MR-readiness", "final-freeze", "final-lock", "owner-acceptance", "not-a11"],
    learner_trap_vi: "MR readiness evidence không đồng nghĩa deploy, push hoặc integration thật.",
    learner_trap_en: "A MR readiness evidence does not mean real deployment, push, or integration.",
  },
  {
    id: "mr-deferred-native-review",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ native review",
    romanization: "multavi native review",
    title_vi: "Native review hoãn",
    title_en: "Deferred native review",
    mr_vi: "Evidence only if native review remains deferred and completion is not claimed.",
    mr_en: "Evidence only if native review is deferred and completion is not claimed.",
    risk_vi: "Không mark ready nếu wording nói approved hoặc native-reviewed.",
    risk_en: "Do not mark ready if wording says approved or native-reviewed.",
    sample: {
      gurmukhi: "review ਅਜੇ ਬਾਕੀ ਹੈ।",
      romanization: "review aje baki hai",
      vi: "Review vẫn còn chờ.",
      en: "Review is still pending.",
    },
    mr_targets: ["finalOwnerReviewPacket", "finalIntegrationEvidenceMap", "finalPreIntegrationSummary"],
    mr_tags: ["native-review", "deferred", "boundary"],
    learner_trap_vi: "Deferred không bao giờ nên được trình bày như đã hoàn tất.",
    learner_trap_en: "Deferred should never be presented as complete.",
    must_not_claim_vi: "Không claim native review hoặc completion đã xong.",
    must_not_claim_en: "Do not claim native review or completion is done.",
  },
  {
    id: "mr-forbidden-claims",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾ claim ਕਰੋ",
    romanization: "na claim karo",
    title_vi: "Không claim",
    title_en: "Forbidden MR-readiness claims",
    mr_vi:
      "Không claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy hoặc A11 integration.",
    mr_en:
      "Do not claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy, or A11 integration.",
    risk_vi: "Claim sai làm MR-readiness evidence nói quá khả năng hệ thống.",
    risk_en: "A false claim makes the MR-readiness evidence overstate system capability.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ text ਹੈ।",
      romanization: "ih siraf text hai",
      vi: "Đây chỉ là text.",
      en: "This is text only.",
    },
    mr_targets: ["finalQualityGates", "finalSmokeChecklist", "finalGoNoGoChecklist"],
    mr_tags: ["must-not-claim", "text-only", "no-a11-integration"],
    learner_trap_vi: "Text-only data không tự sinh audio, scoring, deploy hay push.",
    learner_trap_en: "Text-only data does not create audio, scoring, deploy, or push.",
    must_not_claim_vi:
      "Không claim audio, scoring, Azure, Supabase, deploy, push hoặc A11 integration.",
    must_not_claim_en:
      "Do not claim audio, pronunciation scoring, Azure, Supabase, deploy, push, or A11 integration; this is not A11 integration and no A11 integration runs here.",
  },
];

export const PUNJABI_FINAL_MR_READINESS_EVIDENCE_ROUTES = [
  {
    id: "mr-route-readiness",
    vi: "MR module-family completeness, import/export expectations, naming consistency và duplicate-ID risk.",
    en: "MR module-family completeness, import/export expectations, naming consistency, and duplicate-ID risk.",
    item_ids: [
      "mr-module-family-completeness",
      "mr-import-export-expectations",
      "mr-naming-consistency",
      "mr-duplicate-id-risk",
    ],
  },
  {
    id: "mr-route-coverage",
    vi: "Bằng chứng A1-C2, Gurmukhi, Canada survival và remediation.",
    en: "MR A1-C2, Gurmukhi, Canada survival, and remediation.",
    item_ids: [
      "mr-level-coverage",
      "mr-script-coverage",
      "mr-canada-survival",
      "mr-remediation-coverage",
    ],
  },
  {
    id: "mr-route-boundary",
    vi: "Ghi bằng chứng MR-readiness boundary, native review deferred và forbidden claims.",
    en: "Record MR-readiness boundary, deferred native review, and forbidden claims.",
    item_ids: [
      "mr-decision-boundary",
      "mr-deferred-native-review",
      "mr-forbidden-claims",
    ],
  },
];

export const PUNJABI_FINAL_MR_READINESS_EVIDENCE_ROOT = {
  scope: PUNJABI_FINAL_MR_READINESS_EVIDENCE_SCOPE,
  areas: PUNJABI_FINAL_MR_READINESS_EVIDENCE_AREAS,
  mr_items: PUNJABI_FINAL_MR_READINESS_EVIDENCE,
  routes: PUNJABI_FINAL_MR_READINESS_EVIDENCE_ROUTES,
};

export default PUNJABI_FINAL_MR_READINESS_EVIDENCE_ROOT;
