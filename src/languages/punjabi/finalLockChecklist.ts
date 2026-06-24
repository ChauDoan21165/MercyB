// src/languages/punjabi/finalLockChecklist.ts
//
// Wave 42 final lock checklist for Punjabi.
// This is pre-integration final-lock data for later A11 only. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalLockArea =
  | "module_family_completeness"
  | "import_export_expectations"
  | "duplicate_id_risk"
  | "level_coverage"
  | "script_coverage"
  | "canada_survival_coverage"
  | "remediation_coverage"
  | "final_lock_decision"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiFinalLockStatus =
  | "locked_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalLockItem = {
  id: string;
  area: PunjabiFinalLockArea;
  status: PunjabiFinalLockStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  lock_vi: string;
  lock_en: string;
  risk_vi: string;
  risk_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  lock_targets: string[];
  lock_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_LOCK_CHECKLIST_SCOPE = {
  wave: "Wave 42",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  purpose_vi:
    "Final lock checklist này chỉ khóa trạng thái readiness trước later A11; nó không thực hiện integration.",
  purpose_en:
    "This final lock checklist only locks readiness state before later A11; it does not perform integration.",
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

export const PUNJABI_FINAL_LOCK_CHECKLIST_SCOPE_ALIAS =
  PUNJABI_FINAL_LOCK_CHECKLIST_SCOPE;

export const PUNJABI_FINAL_LOCK_CHECKLIST_AREAS: PunjabiFinalLockArea[] = [
  "module_family_completeness",
  "import_export_expectations",
  "duplicate_id_risk",
  "level_coverage",
  "script_coverage",
  "canada_survival_coverage",
  "remediation_coverage",
  "final_lock_decision",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_FINAL_LOCK_CHECKLIST: PunjabiFinalLockItem[] = [
  {
    id: "lock-module-family-completeness",
    area: "module_family_completeness",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਪੂਰਾ",
    romanization: "module parivar pura",
    title_vi: "Khóa độ đầy đủ nhóm module",
    title_en: "Module-family completeness",
    lock_vi:
      "Lock khi foundation, learning path, coverage, QA, owner-acceptance và final-acceptance cùng khớp một Punjabi module-family.",
    lock_en:
      "Lock when foundation, learning path, coverage, QA, owner-acceptance, and final-acceptance align as one Punjabi module family.",
    risk_vi: "Không lock nếu module nào còn lệch scope, tên hoặc owner expectation.",
    risk_en: "Do not lock if any module still drifts in scope, naming, or owner expectation.",
    sample: {
      gurmukhi: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਪੂਰਾ ਹੈ।",
      romanization: "module parivar pura hai",
      vi: "Nhóm module đã đầy đủ.",
      en: "The module family is complete.",
    },
    lock_targets: ["contentIndex", "finalModuleRegistry", "finalOwnerAcceptanceChecklist"],
    lock_tags: ["module-family", "final-lock", "pre-integration"],
    learner_trap_vi: "Final lock không có nghĩa later A11 đã chạy.",
    learner_trap_en: "Final lock does not mean later A11 has run.",
  },
  {
    id: "lock-import-export-expectations",
    area: "import_export_expectations",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ export ਲੌਕ",
    romanization: "import export lock",
    title_vi: "Khóa import/export",
    title_en: "Import/export expectations",
    lock_vi:
      "Lock khi named exports, default exports, expected imports và route labels có checklist rõ.",
    lock_en:
      "Lock when named exports, default exports, expected imports, and route labels have a clear checklist.",
    risk_vi: "Import/export drift có thể làm later A11 nối sai dữ liệu.",
    risk_en: "Import/export drift can make later A11 wire the wrong data.",
    sample: {
      gurmukhi: "ਇੰਪੋਰਟ ਤੇ export ਲੌਕ ਹਨ।",
      romanization: "import te export lock han",
      vi: "Import và export đã được khóa.",
      en: "Imports and exports are locked.",
    },
    lock_targets: ["finalImportReadinessMap", "finalExportReadiness", "finalAcceptanceChecklist"],
    lock_tags: ["import", "export", "final-lock"],
    learner_trap_vi: "Tên hiển thị không thay thế export identifier ổn định.",
    learner_trap_en: "A display name does not replace a stable export identifier.",
  },
  {
    id: "lock-duplicate-id-risk",
    area: "duplicate_id_risk",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ID ਲੌਕ",
    romanization: "duplicate ID lock",
    title_vi: "Khóa rủi ro trùng ID",
    title_en: "Duplicate-ID risk",
    lock_vi: "Lock khi item IDs, route IDs, module IDs và lock IDs không trùng.",
    lock_en: "Lock when item IDs, route IDs, module IDs, and lock IDs are not duplicated.",
    risk_vi: "ID trùng có thể làm registry ghi đè sai item hoặc route.",
    risk_en: "Duplicate IDs can make a registry overwrite the wrong item or route.",
    sample: {
      gurmukhi: "ਹਰ ID ਵੱਖਰੀ ਰਹੇ।",
      romanization: "har ID vakhri rahe",
      vi: "Mỗi ID phải riêng.",
      en: "Every ID should stay distinct.",
    },
    lock_targets: ["finalModuleRegistry", "finalContentManifest", "finalGoNoGoChecklist"],
    lock_tags: ["duplicate-risk", "ids", "registry"],
    learner_trap_vi: "Cùng topic không luôn là duplicate; phải so full ID.",
    learner_trap_en: "The same topic is not always a duplicate; compare the full ID.",
  },
  {
    id: "lock-level-coverage",
    area: "level_coverage",
    status: "locked_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1-C2 ਲੌਕ",
    romanization: "A1-C2 lock",
    title_vi: "Khóa A1-C2",
    title_en: "A1-C2 coverage",
    lock_vi:
      "Lock khi A1-C2 có goals, lessons, can-do, QA, review và remediation markers cho Vietnamese và English learners.",
    lock_en:
      "Lock when A1-C2 has goals, lessons, can-do items, QA, review, and remediation markers for Vietnamese and English learners.",
    risk_vi: "Thiếu level làm learner route bị đứt.",
    risk_en: "A missing level breaks the learner route.",
    sample: {
      gurmukhi: "A1 ਤੋਂ C2 ਤੱਕ ਰਾਹ ਲੌਕ ਹੈ।",
      romanization: "A1 ton C2 takk raah lock hai",
      vi: "Lộ trình từ A1 đến C2 đã khóa.",
      en: "The path from A1 to C2 is locked.",
    },
    lock_targets: ["courseMap", "learningPath", "progressionMatrix", "finalCanDoIndex"],
    lock_tags: ["a1-c2", "coverage", "learner-route"],
    learner_trap_vi: "A1-C2 coverage không phải official certification claim.",
    learner_trap_en: "A1-C2 coverage is not an official certification claim.",
  },
  {
    id: "lock-script-coverage",
    area: "script_coverage",
    status: "locked_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਲੌਕ",
    romanization: "Gurmukhi lock",
    title_vi: "Khóa Gurmukhi",
    title_en: "Gurmukhi/script coverage",
    lock_vi: "Lock khi Gurmukhi là primary script và romanization chỉ hỗ trợ khi hữu ích.",
    lock_en: "Lock when Gurmukhi is the primary script and romanization only supports where useful.",
    risk_vi: "Không lock nếu romanization thay thế Gurmukhi trong sample chính.",
    risk_en: "Do not lock if romanization replaces Gurmukhi in primary samples.",
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ ਰਹੇ।",
      romanization: "Gurmukhi pehlan rahe",
      vi: "Gurmukhi vẫn đi trước.",
      en: "Gurmukhi stays first.",
    },
    lock_targets: ["normalize", "lessons", "lessons-a1", "skillDependencyGraph"],
    lock_tags: ["gurmukhi-first", "script", "romanization"],
    learner_trap_vi: "Shahmukhi chỉ là awareness-only, không phải full course.",
    learner_trap_en: "Shahmukhi is awareness-only, not a full course.",
  },
  {
    id: "lock-canada-survival",
    area: "canada_survival_coverage",
    status: "locked_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਕੈਨੇਡਾ survival ਲੌਕ",
    romanization: "Canada survival lock",
    title_vi: "Khóa sinh hoạt Canada",
    title_en: "Canada survival coverage",
    lock_vi:
      "Lock khi clinic, school, transit, workplace, forms và public-service examples đều text-only và thực dụng.",
    lock_en:
      "Lock when clinic, school, transit, workplace, forms, and public-service examples are text-only and practical.",
    risk_vi: "Thiếu Canada coverage làm module kém thực dụng cho người học ở Canada.",
    risk_en: "Missing Canada coverage makes the module less practical for learners in Canada.",
    sample: {
      gurmukhi: "ਮੈਨੂੰ ਸਕੂਲ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
      romanization: "mainu school form chahida hai",
      vi: "Tôi cần mẫu của trường.",
      en: "I need the school form.",
    },
    lock_targets: ["dialogues", "contentIndex", "preIntegrationCoverageMap", "finalNavigationMap"],
    lock_tags: ["canada-practical", "survival", "public-service"],
    canada_practical:
      "Use text-only examples for clinic appointments, school forms, transit, workplace scheduling, and public services.",
    learner_trap_vi: "Ví dụ Canada-practical không phải tư vấn pháp lý hay y tế.",
    learner_trap_en: "Canada-practical examples are not legal or medical advice.",
  },
  {
    id: "lock-remediation-coverage",
    area: "remediation_coverage",
    status: "locked_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੀਮੀਡੀਏਸ਼ਨ ਲੌਕ",
    romanization: "remediation lock",
    title_vi: "Khóa sửa lỗi",
    title_en: "Remediation coverage",
    lock_vi:
      "Lock khi script confusion, postpositions, register, review gaps và Canada-domain gaps có remediation path.",
    lock_en:
      "Lock when script confusion, postpositions, register, review gaps, and Canada-domain gaps have a remediation path.",
    risk_vi: "Không lock nếu QA có lỗi nhưng không có đường sửa.",
    risk_en: "Do not lock if QA has errors without a repair path.",
    sample: {
      gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰੋ।",
      romanization: "galti thik karo",
      vi: "Hãy sửa lỗi.",
      en: "Fix the error.",
    },
    lock_targets: ["skillDependencyGraph", "masteryCheckpoints", "finalQualityGates", "finalQaInventory"],
    lock_tags: ["remediation", "learner-traps", "quality"],
    learner_trap_vi: "Text-only remediation không tạo pronunciation scoring.",
    learner_trap_en: "Text-only remediation does not create pronunciation scoring.",
  },
  {
    id: "lock-decision-boundary",
    area: "final_lock_decision",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "final lock ਫ਼ੈਸਲਾ",
    romanization: "final lock faisla",
    title_vi: "Quyết định final lock",
    title_en: "Final-lock owner-acceptance final-acceptance decision",
    lock_vi:
      "Final lock chỉ là pre-integration owner-acceptance/final-acceptance decision; không chạy A11 integration, push hoặc deploy.",
    lock_en:
      "Final lock is only a pre-integration owner-acceptance and final-acceptance decision; it does not run A11 integration, push, or deploy.",
    risk_vi: "Không lock nếu wave này sửa integration wiring hoặc claim release thật.",
    risk_en: "Do not lock if this wave edits integration wiring or claims a real release.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ final lock check ਹੈ।",
      romanization: "ih siraf final lock check hai",
      vi: "Đây chỉ là kiểm final lock.",
      en: "This is only a final lock check.",
    },
    lock_targets: ["finalOwnerAcceptanceChecklist", "finalAcceptanceChecklist", "finalGoNoGoChecklist"],
    lock_tags: ["final-lock", "owner-acceptance", "not-a11"],
    learner_trap_vi: "Final lock checklist không đồng nghĩa deploy, push hoặc integration thật.",
    learner_trap_en: "A final lock checklist does not mean real deployment, push, or integration.",
  },
  {
    id: "lock-deferred-native-review",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ native review",
    romanization: "multavi native review",
    title_vi: "Native review hoãn",
    title_en: "Deferred native review",
    lock_vi: "Lock only if native review remains deferred and completion is not claimed.",
    lock_en: "Lock only if native review is deferred and completion is not claimed.",
    risk_vi: "Không lock nếu wording nói approved hoặc native-reviewed.",
    risk_en: "Do not lock if wording says approved or native-reviewed.",
    sample: {
      gurmukhi: "review ਅਜੇ ਬਾਕੀ ਹੈ।",
      romanization: "review aje baki hai",
      vi: "Review vẫn còn chờ.",
      en: "Review is still pending.",
    },
    lock_targets: ["finalOwnerReviewPacket", "finalIntegrationEvidenceMap", "finalPreIntegrationSummary"],
    lock_tags: ["native-review", "deferred", "boundary"],
    learner_trap_vi: "Deferred không bao giờ nên được trình bày như đã hoàn tất.",
    learner_trap_en: "Deferred should never be presented as complete.",
    must_not_claim_vi: "Không claim native review hoặc completion đã xong.",
    must_not_claim_en: "Do not claim native review or completion is done.",
  },
  {
    id: "lock-forbidden-claims",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾ claim ਕਰੋ",
    romanization: "na claim karo",
    title_vi: "Không claim",
    title_en: "Forbidden final-lock claims",
    lock_vi:
      "Không claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy hoặc A11 integration.",
    lock_en:
      "Do not claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy, or A11 integration.",
    risk_vi: "Claim sai làm final-lock checklist nói quá khả năng hệ thống.",
    risk_en: "A false claim makes the final-lock checklist overstate system capability.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ text ਹੈ।",
      romanization: "ih siraf text hai",
      vi: "Đây chỉ là text.",
      en: "This is text only.",
    },
    lock_targets: ["finalQualityGates", "finalSmokeChecklist", "finalGoNoGoChecklist"],
    lock_tags: ["must-not-claim", "text-only", "no-a11-integration"],
    learner_trap_vi: "Text-only data không tự sinh audio, scoring, deploy hay push.",
    learner_trap_en: "Text-only data does not create audio, scoring, deploy, or push.",
    must_not_claim_vi:
      "Không claim audio, scoring, Azure, Supabase, deploy, push hoặc A11 integration.",
    must_not_claim_en:
      "Do not claim audio, pronunciation scoring, Azure, Supabase, deploy, push, or A11 integration; this is not A11 integration and no A11 integration runs here.",
  },
];

export const PUNJABI_FINAL_LOCK_CHECKLIST_ROUTES = [
  {
    id: "lock-route-readiness",
    vi: "Khóa module-family completeness, import/export expectations và duplicate-ID risk.",
    en: "Lock module-family completeness, import/export expectations, and duplicate-ID risk.",
    item_ids: [
      "lock-module-family-completeness",
      "lock-import-export-expectations",
      "lock-duplicate-id-risk",
    ],
  },
  {
    id: "lock-route-coverage",
    vi: "Khóa A1-C2, Gurmukhi, Canada survival và remediation.",
    en: "Lock A1-C2, Gurmukhi, Canada survival, and remediation.",
    item_ids: [
      "lock-level-coverage",
      "lock-script-coverage",
      "lock-canada-survival",
      "lock-remediation-coverage",
    ],
  },
  {
    id: "lock-route-boundary",
    vi: "Khóa final-lock boundary, native review deferred và forbidden claims.",
    en: "Lock final-lock boundary, deferred native review, and forbidden claims.",
    item_ids: [
      "lock-decision-boundary",
      "lock-deferred-native-review",
      "lock-forbidden-claims",
    ],
  },
];

export const PUNJABI_FINAL_LOCK_CHECKLIST_ROOT = {
  scope: PUNJABI_FINAL_LOCK_CHECKLIST_SCOPE,
  areas: PUNJABI_FINAL_LOCK_CHECKLIST_AREAS,
  lock_items: PUNJABI_FINAL_LOCK_CHECKLIST,
  routes: PUNJABI_FINAL_LOCK_CHECKLIST_ROUTES,
};

export default PUNJABI_FINAL_LOCK_CHECKLIST_ROOT;
