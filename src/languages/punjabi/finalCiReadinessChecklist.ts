// src/languages/punjabi/finalCiReadinessChecklist.ts
//
// Wave 45 CI readiness checklist for Punjabi.
// This is pre-integration CI-readiness data for later A11 only. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalCiReadinessChecklistArea =
  | "module_family_completeness"
  | "import_export_expectations"
  | "naming_consistency"
  | "duplicate_id_risk"
  | "level_coverage"
  | "script_coverage"
  | "canada_survival_coverage"
  | "remediation_coverage"
  | "ci_readiness_decision"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiFinalCiReadinessChecklistStatus =
  | "ready_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalCiReadinessChecklistItem = {
  id: string;
  area: PunjabiFinalCiReadinessChecklistArea;
  status: PunjabiFinalCiReadinessChecklistStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  ci_vi: string;
  ci_en: string;
  risk_vi: string;
  risk_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  ci_targets: string[];
  ci_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_CI_READINESS_CHECKLIST_SCOPE = {
  wave: "Wave 45",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  purpose_vi:
    "CI readiness checklist này chỉ ghi check readiness trước later A11; nó không thực hiện integration.",
  purpose_en:
    "This CI readiness checklist only documents readiness check before later A11; it does not perform integration.",
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

export const PUNJABI_FINAL_CI_READINESS_CHECKLIST_SCOPE_ALIAS =
  PUNJABI_FINAL_CI_READINESS_CHECKLIST_SCOPE;

export const PUNJABI_FINAL_CI_READINESS_CHECKLIST_AREAS: PunjabiFinalCiReadinessChecklistArea[] = [
  "module_family_completeness",
  "import_export_expectations",
  "naming_consistency",
  "duplicate_id_risk",
  "level_coverage",
  "script_coverage",
  "canada_survival_coverage",
  "remediation_coverage",
  "ci_readiness_decision",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_FINAL_CI_READINESS_CHECKLIST: PunjabiFinalCiReadinessChecklistItem[] = [
  {
    id: "ci-module-family-completeness",
    area: "module_family_completeness",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਪੂਰਾ",
    romanization: "module parivar pura",
    title_vi: "Check đầy đủ nhóm module",
    title_en: "Module-family completeness",
    ci_vi:
      "Check khi foundation, learning path, coverage, QA, owner-acceptance và final-acceptance cùng khớp một Punjabi module-family.",
    ci_en:
      "Check when foundation, learning path, coverage, QA, owner-acceptance, and final-acceptance align as one Punjabi module family.",
    risk_vi: "Không mark ready nếu module nào còn lệch scope, tên hoặc owner expectation.",
    risk_en: "Do not mark ready if any module still drifts in scope, naming, or owner expectation.",
    sample: {
      gurmukhi: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਪੂਰਾ ਹੈ।",
      romanization: "module parivar pura hai",
      vi: "Nhóm module đã đầy đủ.",
      en: "The module family is complete.",
    },
    ci_targets: ["contentIndex", "finalModuleRegistry", "finalOwnerAcceptanceChecklist"],
    ci_tags: ["module-family", "CI-readiness", "final-freeze", "pre-integration"],
    learner_trap_vi: "CI readiness không có nghĩa later A11 đã chạy.",
    learner_trap_en: "CI readiness does not mean later A11 has run.",
  },
  {
    id: "ci-import-export-expectations",
    area: "import_export_expectations",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ export ਲੌਕ",
    romanization: "import export ci",
    title_vi: "Check import/export",
    title_en: "Import/export expectations",
    ci_vi:
      "Check khi named exports, default exports, expected imports và route labels có checklist rõ.",
    ci_en:
      "Check when named exports, default exports, expected imports, and route labels have a clear checklist.",
    risk_vi: "Import/export drift có thể làm later A11 nối sai dữ liệu.",
    risk_en: "Import/export drift can make later A11 wire the wrong data.",
    sample: {
      gurmukhi: "ਇੰਪੋਰਟ ਤੇ export ਲੌਕ ਹਨ।",
      romanization: "import te export ci han",
      vi: "Import và export có check.",
      en: "Imports and exports have check.",
    },
    ci_targets: ["finalImportReadinessMap", "finalExportReadiness", "finalAcceptanceChecklist"],
    ci_tags: ["import", "export", "CI-readiness", "final-lock"],
    learner_trap_vi: "Tên hiển thị không thay thế export identifier ổn định.",
    learner_trap_en: "A display name does not replace a stable export identifier.",
  },
  {
    id: "ci-naming-consistency",
    area: "naming_consistency",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਂ ਇਕਸਾਰਤਾ ci",
    romanization: "naam iksarta ci",
    title_vi: "CI nhất quán tên",
    title_en: "Naming consistency",
    ci_vi:
      "Check khi file names, export names, route IDs, item IDs và display labels dùng cùng Punjabi naming pattern.",
    ci_en:
      "Check when file names, export names, route IDs, item IDs, and display labels use the same Punjabi naming pattern.",
    risk_vi: "Naming drift có thể làm later A11 import nhầm module hoặc route.",
    risk_en: "Naming drift can make later A11 import the wrong module or route.",
    sample: {
      gurmukhi: "ਨਾਂ ਇਕਸਾਰ ਰੱਖੋ।",
      romanization: "naam iksar rakho",
      vi: "Giữ tên nhất quán.",
      en: "Keep names consistent.",
    },
    ci_targets: ["finalLockChecklist", "finalOwnerAcceptanceChecklist", "finalAcceptanceChecklist"],
    ci_tags: ["naming", "consistency", "CI-readiness", "final-freeze"],
    learner_trap_vi: "Tên gần giống không đủ; route ID và export name phải khớp rõ.",
    learner_trap_en: "A similar-looking name is not enough; route IDs and export names need clear alignment.",
  },
  {
    id: "ci-duplicate-id-risk",
    area: "duplicate_id_risk",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ID ਲੌਕ",
    romanization: "duplicate ID ci",
    title_vi: "Check rủi ro trùng ID",
    title_en: "Duplicate-ID risk",
    ci_vi: "Check khi item IDs, route IDs, module IDs và check IDs không trùng.",
    ci_en: "Check when item IDs, route IDs, module IDs, and check IDs are not duplicated.",
    risk_vi: "ID trùng có thể làm registry ghi đè sai item hoặc route.",
    risk_en: "Duplicate IDs can make a registry overwrite the wrong item or route.",
    sample: {
      gurmukhi: "ਹਰ ID ਵੱਖਰੀ ਰਹੇ।",
      romanization: "har ID vakhri rahe",
      vi: "Mỗi ID phải riêng.",
      en: "Every ID should stay distinct.",
    },
    ci_targets: ["finalModuleRegistry", "finalContentManifest", "finalGoNoGoChecklist"],
    ci_tags: ["duplicate-risk", "ids", "registry"],
    learner_trap_vi: "Cùng topic không luôn là duplicate; phải so full ID.",
    learner_trap_en: "The same topic is not always a duplicate; compare the full ID.",
  },
  {
    id: "ci-level-coverage",
    area: "level_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1-C2 ਲੌਕ",
    romanization: "A1-C2 ci",
    title_vi: "Check A1-C2",
    title_en: "A1-C2 coverage",
    ci_vi:
      "Check khi A1-C2 có goals, lessons, can-do, QA, review và remediation markers cho Vietnamese và English learners.",
    ci_en:
      "Check when A1-C2 has goals, lessons, can-do items, QA, review, and remediation markers for Vietnamese and English learners.",
    risk_vi: "Thiếu level làm learner route bị đứt.",
    risk_en: "A missing level breaks the learner route.",
    sample: {
      gurmukhi: "A1 ਤੋਂ C2 ਤੱਕ ਰਾਹ ਲੌਕ ਹੈ।",
      romanization: "A1 ton C2 takk raah ci hai",
      vi: "Lộ trình từ A1 đến C2 có check.",
      en: "The path from A1 to C2 has check.",
    },
    ci_targets: ["courseMap", "learningPath", "progressionMatrix", "finalCanDoIndex"],
    ci_tags: ["a1-c2", "coverage", "learner-route"],
    learner_trap_vi: "A1-C2 coverage không phải official certification claim.",
    learner_trap_en: "A1-C2 coverage is not an official certification claim.",
  },
  {
    id: "ci-script-coverage",
    area: "script_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਲੌਕ",
    romanization: "Gurmukhi ci",
    title_vi: "Check Gurmukhi",
    title_en: "Gurmukhi/script coverage",
    ci_vi: "Check khi Gurmukhi là primary script và romanization chỉ hỗ trợ khi hữu ích.",
    ci_en: "Check when Gurmukhi is the primary script and romanization only supports where useful.",
    risk_vi: "Không mark ready nếu romanization thay thế Gurmukhi trong sample chính.",
    risk_en: "Do not mark ready if romanization replaces Gurmukhi in primary samples.",
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ ਰਹੇ।",
      romanization: "Gurmukhi pehlan rahe",
      vi: "Gurmukhi vẫn đi trước.",
      en: "Gurmukhi stays first.",
    },
    ci_targets: ["normalize", "lessons", "lessons-a1", "skillDependencyGraph"],
    ci_tags: ["gurmukhi-first", "script", "romanization"],
    learner_trap_vi: "Shahmukhi chỉ là awareness-only, không phải full course.",
    learner_trap_en: "Shahmukhi is awareness-only, not a full course.",
  },
  {
    id: "ci-canada-survival",
    area: "canada_survival_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਕੈਨੇਡਾ survival ਲੌਕ",
    romanization: "Canada survival ci",
    title_vi: "Check sinh hoạt Canada",
    title_en: "Canada survival coverage",
    ci_vi:
      "Check khi clinic, school, transit, workplace, forms và public-service examples đều text-only và thực dụng.",
    ci_en:
      "Check when clinic, school, transit, workplace, forms, and public-service examples are text-only and practical.",
    risk_vi: "Thiếu Canada coverage làm module kém thực dụng cho người học ở Canada.",
    risk_en: "Missing Canada coverage makes the module less practical for learners in Canada.",
    sample: {
      gurmukhi: "ਮੈਨੂੰ ਸਕੂਲ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
      romanization: "mainu school form chahida hai",
      vi: "Tôi cần mẫu của trường.",
      en: "I need the school form.",
    },
    ci_targets: ["dialogues", "contentIndex", "preIntegrationCoverageMap", "finalNavigationMap"],
    ci_tags: ["canada-practical", "survival", "public-service"],
    canada_practical:
      "Use text-only examples for clinic appointments, school forms, transit, workplace scheduling, and public services.",
    learner_trap_vi: "Ví dụ Canada-practical không phải tư vấn pháp lý hay y tế.",
    learner_trap_en: "Canada-practical examples are not legal or medical advice.",
  },
  {
    id: "ci-remediation-coverage",
    area: "remediation_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੀਮੀਡੀਏਸ਼ਨ ਲੌਕ",
    romanization: "remediation ci",
    title_vi: "Check sửa lỗi",
    title_en: "Remediation coverage",
    ci_vi:
      "Check khi script confusion, postpositions, register, review gaps và Canada-domain gaps có remediation path.",
    ci_en:
      "Check when script confusion, postpositions, register, review gaps, and Canada-domain gaps have a remediation path.",
    risk_vi: "Không mark ready nếu QA có lỗi nhưng không có đường sửa.",
    risk_en: "Do not mark ready if QA has errors without a repair path.",
    sample: {
      gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰੋ।",
      romanization: "galti thik karo",
      vi: "Hãy sửa lỗi.",
      en: "Fix the error.",
    },
    ci_targets: ["skillDependencyGraph", "masteryCheckpoints", "finalQualityGates", "finalQaInventory"],
    ci_tags: ["remediation", "learner-traps", "quality"],
    learner_trap_vi: "Text-only remediation không tạo pronunciation scoring.",
    learner_trap_en: "Text-only remediation does not create pronunciation scoring.",
  },
  {
    id: "ci-decision-boundary",
    area: "ci_readiness_decision",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "CI readiness ਫ਼ੈਸਲਾ",
    romanization: "CI readiness faisla",
    title_vi: "Quyết định CI readiness",
    title_en: "CI-readiness final-freeze final-lock decision",
    ci_vi:
      "CI readiness chỉ là pre-integration owner-acceptance/final-acceptance decision; không chạy A11 integration, push hoặc deploy.",
    ci_en:
      "CI readiness is only a pre-integration final-freeze, final-lock, owner-acceptance, and final-acceptance decision; it does not run A11 integration, push, or deploy.",
    risk_vi: "Không mark ready nếu wave này sửa integration wiring hoặc claim release thật.",
    risk_en: "Do not mark ready if this wave edits integration wiring or claims a real release.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ CI readiness check ਹੈ।",
      romanization: "ih siraf CI readiness check hai",
      vi: "Đây chỉ là kiểm CI readiness.",
      en: "This is only a CI readiness check.",
    },
    ci_targets: ["finalFreezeChecklist", "finalLockChecklist", "finalOwnerAcceptanceChecklist", "finalAcceptanceChecklist"],
    ci_tags: ["CI-readiness", "final-freeze", "final-lock", "owner-acceptance", "not-a11"],
    learner_trap_vi: "CI readiness checklist không đồng nghĩa deploy, push hoặc integration thật.",
    learner_trap_en: "A CI readiness checklist does not mean real deployment, push, or integration.",
  },
  {
    id: "ci-deferred-native-review",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ native review",
    romanization: "multavi native review",
    title_vi: "Native review hoãn",
    title_en: "Deferred native review",
    ci_vi: "Check only if native review remains deferred and completion is not claimed.",
    ci_en: "Check only if native review is deferred and completion is not claimed.",
    risk_vi: "Không mark ready nếu wording nói approved hoặc native-reviewed.",
    risk_en: "Do not mark ready if wording says approved or native-reviewed.",
    sample: {
      gurmukhi: "review ਅਜੇ ਬਾਕੀ ਹੈ।",
      romanization: "review aje baki hai",
      vi: "Review vẫn còn chờ.",
      en: "Review is still pending.",
    },
    ci_targets: ["finalOwnerReviewPacket", "finalIntegrationCheckMap", "finalPreIntegrationSummary"],
    ci_tags: ["native-review", "deferred", "boundary"],
    learner_trap_vi: "Deferred không bao giờ nên được trình bày như đã hoàn tất.",
    learner_trap_en: "Deferred should never be presented as complete.",
    must_not_claim_vi: "Không claim native review hoặc completion đã xong.",
    must_not_claim_en: "Do not claim native review or completion is done.",
  },
  {
    id: "ci-forbidden-claims",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾ claim ਕਰੋ",
    romanization: "na claim karo",
    title_vi: "Không claim",
    title_en: "Forbidden CI-readiness claims",
    ci_vi:
      "Không claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy hoặc A11 integration.",
    ci_en:
      "Do not claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy, or A11 integration.",
    risk_vi: "Claim sai làm CI-readiness check nói quá khả năng hệ thống.",
    risk_en: "A false claim makes the CI-readiness check overstate system capability.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ text ਹੈ।",
      romanization: "ih siraf text hai",
      vi: "Đây chỉ là text.",
      en: "This is text only.",
    },
    ci_targets: ["finalQualityGates", "finalSmokeChecklist", "finalGoNoGoChecklist"],
    ci_tags: ["must-not-claim", "text-only", "no-a11-integration"],
    learner_trap_vi: "Text-only data không tự sinh audio, scoring, deploy hay push.",
    learner_trap_en: "Text-only data does not create audio, scoring, deploy, or push.",
    must_not_claim_vi:
      "Không claim audio, scoring, Azure, Supabase, deploy, push hoặc A11 integration.",
    must_not_claim_en:
      "Do not claim audio, pronunciation scoring, Azure, Supabase, deploy, push, or A11 integration; this is not A11 integration and no A11 integration runs here.",
  },
];

export const PUNJABI_FINAL_CI_READINESS_CHECKLIST_ROUTES = [
  {
    id: "ci-route-readiness",
    vi: "CI module-family completeness, import/export expectations, naming consistency và duplicate-ID risk.",
    en: "CI module-family completeness, import/export expectations, naming consistency, and duplicate-ID risk.",
    item_ids: [
      "ci-module-family-completeness",
      "ci-import-export-expectations",
      "ci-naming-consistency",
      "ci-duplicate-id-risk",
    ],
  },
  {
    id: "ci-route-coverage",
    vi: "Check A1-C2, Gurmukhi, Canada survival và remediation.",
    en: "CI A1-C2, Gurmukhi, Canada survival, and remediation.",
    item_ids: [
      "ci-level-coverage",
      "ci-script-coverage",
      "ci-canada-survival",
      "ci-remediation-coverage",
    ],
  },
  {
    id: "ci-route-boundary",
    vi: "Ghi check CI-readiness boundary, native review deferred và forbidden claims.",
    en: "Record CI-readiness boundary, deferred native review, and forbidden claims.",
    item_ids: [
      "ci-decision-boundary",
      "ci-deferred-native-review",
      "ci-forbidden-claims",
    ],
  },
];

export const PUNJABI_FINAL_CI_READINESS_CHECKLIST_ROOT = {
  scope: PUNJABI_FINAL_CI_READINESS_CHECKLIST_SCOPE,
  areas: PUNJABI_FINAL_CI_READINESS_CHECKLIST_AREAS,
  ci_items: PUNJABI_FINAL_CI_READINESS_CHECKLIST,
  routes: PUNJABI_FINAL_CI_READINESS_CHECKLIST_ROUTES,
};

export default PUNJABI_FINAL_CI_READINESS_CHECKLIST_ROOT;
