// src/languages/punjabi/finalOwnerAcceptanceChecklist.ts
//
// Wave 41 final owner-acceptance checklist for Punjabi.
// This is pre-integration owner-acceptance data for later A11 only. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalOwnerAcceptanceArea =
  | "module_family_readiness"
  | "import_export_expectations"
  | "duplicate_id_risk"
  | "level_coverage"
  | "script_coverage"
  | "canada_survival_coverage"
  | "remediation_coverage"
  | "owner_acceptance_decision"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiFinalOwnerAcceptanceStatus =
  | "owner_acceptable_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalOwnerAcceptanceItem = {
  id: string;
  area: PunjabiFinalOwnerAcceptanceArea;
  status: PunjabiFinalOwnerAcceptanceStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  owner_acceptance_vi: string;
  owner_acceptance_en: string;
  risk_vi: string;
  risk_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  owner_targets: string[];
  owner_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_OWNER_ACCEPTANCE_CHECKLIST_SCOPE = {
  wave: "Wave 41",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  purpose_vi:
    "Final owner-acceptance checklist này chỉ hỗ trợ owner review trước later A11; nó không thực hiện integration.",
  purpose_en:
    "This final owner-acceptance checklist only supports owner review before later A11; it does not perform integration.",
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

export const PUNJABI_FINAL_OWNER_ACCEPTANCE_CHECKLIST_SCOPE_ALIAS =
  PUNJABI_FINAL_OWNER_ACCEPTANCE_CHECKLIST_SCOPE;

export const PUNJABI_FINAL_OWNER_ACCEPTANCE_CHECKLIST_AREAS: PunjabiFinalOwnerAcceptanceArea[] = [
  "module_family_readiness",
  "import_export_expectations",
  "duplicate_id_risk",
  "level_coverage",
  "script_coverage",
  "canada_survival_coverage",
  "remediation_coverage",
  "owner_acceptance_decision",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_FINAL_OWNER_ACCEPTANCE_CHECKLIST: PunjabiFinalOwnerAcceptanceItem[] = [
  {
    id: "owner-accept-module-family-readiness",
    area: "module_family_readiness",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਮਨਜ਼ੂਰੀ",
    romanization: "module parivar manzuri",
    title_vi: "Owner duyệt nhóm module",
    title_en: "Module-family owner readiness",
    owner_acceptance_vi:
      "Owner accept khi foundation, learning path, coverage, QA và final checklists cùng là một Punjabi module-family nhất quán.",
    owner_acceptance_en:
      "Owner accept when foundation, learning path, coverage, QA, and final checklists form one consistent Punjabi module family.",
    risk_vi: "Không owner-accept nếu một module đi lạc scope hoặc naming lệch pattern Punjabi.",
    risk_en: "Do not owner-accept if one module drifts out of scope or naming leaves the Punjabi pattern.",
    sample: {
      gurmukhi: "ਸਾਰੇ ਮੋਡੀਊਲ ਇਕ ਪਰਿਵਾਰ ਹਨ।",
      romanization: "sare module ik parivar han",
      vi: "Tất cả module là một nhóm.",
      en: "All modules are one family.",
    },
    owner_targets: ["contentIndex", "finalContentManifest", "finalModuleRegistry", "finalAcceptanceChecklist"],
    owner_tags: ["module-family", "owner-acceptance", "pre-integration"],
    learner_trap_vi: "Owner acceptance không có nghĩa later A11 đã chạy.",
    learner_trap_en: "Owner acceptance does not mean later A11 has run.",
  },
  {
    id: "owner-accept-import-export-expectations",
    area: "import_export_expectations",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ export ਮਨਜ਼ੂਰੀ",
    romanization: "import export manzuri",
    title_vi: "Owner duyệt import/export",
    title_en: "Import/export owner expectations",
    owner_acceptance_vi:
      "Owner accept khi named exports, default exports, expected imports và route labels có checklist rõ.",
    owner_acceptance_en:
      "Owner accept when named exports, default exports, expected imports, and route labels have a clear checklist.",
    risk_vi: "Import/export drift có thể làm later A11 nối sai dữ liệu.",
    risk_en: "Import/export drift can make later A11 wire the wrong data.",
    sample: {
      gurmukhi: "ਇੰਪੋਰਟ ਤੇ export ਮਿਲਦੇ ਹਨ।",
      romanization: "import te export milde han",
      vi: "Import và export khớp.",
      en: "Imports and exports match.",
    },
    owner_targets: ["finalImportReadinessMap", "finalExportReadiness", "finalShipCandidateChecklist"],
    owner_tags: ["import", "export", "owner-review"],
    learner_trap_vi: "Tên hiển thị không thay thế export identifier ổn định.",
    learner_trap_en: "A display name does not replace a stable export identifier.",
  },
  {
    id: "owner-accept-duplicate-id-risk",
    area: "duplicate_id_risk",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ID ਜਾਂਚ",
    romanization: "duplicate ID janch",
    title_vi: "Owner kiểm ID trùng",
    title_en: "Duplicate-ID owner risk",
    owner_acceptance_vi:
      "Owner accept khi item IDs, route IDs, module IDs và owner-acceptance IDs không trùng.",
    owner_acceptance_en:
      "Owner accept when item IDs, route IDs, module IDs, and owner-acceptance IDs are not duplicated.",
    risk_vi: "ID trùng có thể làm registry ghi đè sai item hoặc route.",
    risk_en: "Duplicate IDs can make a registry overwrite the wrong item or route.",
    sample: {
      gurmukhi: "ਹਰ ID ਵੱਖਰੀ ਹੈ।",
      romanization: "har ID vakhri hai",
      vi: "Mỗi ID khác nhau.",
      en: "Every ID is different.",
    },
    owner_targets: ["finalModuleRegistry", "finalContentManifest", "finalGoNoGoChecklist"],
    owner_tags: ["duplicate-risk", "ids", "registry"],
    learner_trap_vi: "Cùng topic không luôn là duplicate; phải so full ID.",
    learner_trap_en: "The same topic is not always a duplicate; compare the full ID.",
  },
  {
    id: "owner-accept-level-coverage",
    area: "level_coverage",
    status: "owner_acceptable_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1-C2 ਕਵਰੇਜ ਮਨਜ਼ੂਰੀ",
    romanization: "A1-C2 coverage manzuri",
    title_vi: "Owner duyệt A1-C2",
    title_en: "A1-C2 owner coverage",
    owner_acceptance_vi:
      "Owner accept khi A1-C2 có goals, lessons, can-do, QA, review và remediation markers.",
    owner_acceptance_en:
      "Owner accept when A1-C2 has goals, lessons, can-do items, QA, review, and remediation markers.",
    risk_vi: "Thiếu level làm learner route bị đứt cho Vietnamese hoặc English learners.",
    risk_en: "A missing level breaks the learner route for Vietnamese or English learners.",
    sample: {
      gurmukhi: "A1 ਤੋਂ C2 ਤੱਕ ਰਾਹ ਹੈ।",
      romanization: "A1 ton C2 takk raah hai",
      vi: "Có lộ trình từ A1 đến C2.",
      en: "There is a path from A1 to C2.",
    },
    owner_targets: ["courseMap", "learningPath", "progressionMatrix", "finalCanDoIndex"],
    owner_tags: ["a1-c2", "coverage", "learner-route"],
    learner_trap_vi: "A1-C2 coverage không phải official certification claim.",
    learner_trap_en: "A1-C2 coverage is not an official certification claim.",
  },
  {
    id: "owner-accept-script-coverage",
    area: "script_coverage",
    status: "owner_acceptable_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਮਨਜ਼ੂਰੀ",
    romanization: "Gurmukhi manzuri",
    title_vi: "Owner duyệt Gurmukhi",
    title_en: "Gurmukhi/script owner coverage",
    owner_acceptance_vi:
      "Owner accept khi Gurmukhi là primary script và romanization chỉ là hỗ trợ khi hữu ích.",
    owner_acceptance_en:
      "Owner accept when Gurmukhi is the primary script and romanization only supports where useful.",
    risk_vi: "Không owner-accept nếu romanization thay thế Gurmukhi trong sample chính.",
    risk_en: "Do not owner-accept if romanization replaces Gurmukhi in primary samples.",
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ ਹੈ।",
      romanization: "Gurmukhi pehlan hai",
      vi: "Gurmukhi đi trước.",
      en: "Gurmukhi comes first.",
    },
    owner_targets: ["normalize", "lessons", "lessons-a1", "skillDependencyGraph"],
    owner_tags: ["gurmukhi-first", "script", "romanization"],
    learner_trap_vi: "Shahmukhi chỉ là awareness-only, không phải full course.",
    learner_trap_en: "Shahmukhi is awareness-only, not a full course.",
  },
  {
    id: "owner-accept-canada-survival",
    area: "canada_survival_coverage",
    status: "owner_acceptable_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਕੈਨੇਡਾ survival ਮਨਜ਼ੂਰੀ",
    romanization: "Canada survival manzuri",
    title_vi: "Owner duyệt sinh hoạt Canada",
    title_en: "Canada survival owner coverage",
    owner_acceptance_vi:
      "Owner accept khi clinic, school, transit, workplace, forms và public-service examples đều text-only.",
    owner_acceptance_en:
      "Owner accept when clinic, school, transit, workplace, forms, and public-service examples are all text-only.",
    risk_vi: "Thiếu Canada coverage làm module kém thực dụng cho người học ở Canada.",
    risk_en: "Missing Canada coverage makes the module less practical for learners in Canada.",
    sample: {
      gurmukhi: "ਮੈਨੂੰ ਅਪਾਇੰਟਮੈਂਟ ਚਾਹੀਦੀ ਹੈ।",
      romanization: "mainu appointment chahidi hai",
      vi: "Tôi cần một cuộc hẹn.",
      en: "I need an appointment.",
    },
    owner_targets: ["dialogues", "contentIndex", "preIntegrationCoverageMap", "finalNavigationMap"],
    owner_tags: ["canada-practical", "survival", "public-service"],
    canada_practical:
      "Use text-only examples for clinic appointments, school forms, transit, workplace scheduling, and public services.",
    learner_trap_vi: "Ví dụ Canada-practical không phải tư vấn pháp lý hay y tế.",
    learner_trap_en: "Canada-practical examples are not legal or medical advice.",
  },
  {
    id: "owner-accept-remediation-coverage",
    area: "remediation_coverage",
    status: "owner_acceptable_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੀਮੀਡੀਏਸ਼ਨ ਮਨਜ਼ੂਰੀ",
    romanization: "remediation manzuri",
    title_vi: "Owner duyệt sửa lỗi",
    title_en: "Remediation owner coverage",
    owner_acceptance_vi:
      "Owner accept khi script confusion, postpositions, register, review gaps và Canada-domain gaps có remediation path.",
    owner_acceptance_en:
      "Owner accept when script confusion, postpositions, register, review gaps, and Canada-domain gaps have a remediation path.",
    risk_vi: "Không owner-accept nếu QA có lỗi nhưng không có đường sửa.",
    risk_en: "Do not owner-accept if QA has errors without a repair path.",
    sample: {
      gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰੋ।",
      romanization: "galti thik karo",
      vi: "Hãy sửa lỗi.",
      en: "Fix the error.",
    },
    owner_targets: ["skillDependencyGraph", "masteryCheckpoints", "finalQualityGates", "finalQaInventory"],
    owner_tags: ["remediation", "learner-traps", "quality"],
    learner_trap_vi: "Text-only remediation không tạo pronunciation scoring.",
    learner_trap_en: "Text-only remediation does not create pronunciation scoring.",
  },
  {
    id: "owner-accept-decision-boundary",
    area: "owner_acceptance_decision",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "owner acceptance ਫ਼ੈਸਲਾ",
    romanization: "owner acceptance faisla",
    title_vi: "Quyết định owner acceptance",
    title_en: "Owner-acceptance final acceptance ship decision",
    owner_acceptance_vi:
      "Owner acceptance chỉ là pre-integration final-acceptance/ship-candidate decision; không chạy A11 integration, push hoặc deploy.",
    owner_acceptance_en:
      "Owner acceptance is only a pre-integration final-acceptance and ship-candidate decision; it does not run A11 integration, push, or deploy.",
    risk_vi: "Không owner-accept nếu wave này sửa integration wiring hoặc claim release thật.",
    risk_en: "Do not owner-accept if this wave edits integration wiring or claims a real release.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ owner check ਹੈ।",
      romanization: "ih siraf owner check hai",
      vi: "Đây chỉ là kiểm owner.",
      en: "This is only an owner check.",
    },
    owner_targets: ["finalAcceptanceChecklist", "finalGoNoGoChecklist", "finalShipCandidateChecklist"],
    owner_tags: ["owner-acceptance", "final-acceptance", "not-a11"],
    learner_trap_vi: "Owner acceptance checklist không đồng nghĩa deploy, push hoặc integration thật.",
    learner_trap_en: "An owner acceptance checklist does not mean real deployment, push, or integration.",
  },
  {
    id: "owner-accept-deferred-native-review",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ native review",
    romanization: "multavi native review",
    title_vi: "Native review hoãn",
    title_en: "Deferred native review",
    owner_acceptance_vi:
      "Owner accept only if native review remains deferred and completion is not claimed.",
    owner_acceptance_en:
      "Owner accept only if native review is deferred and completion is not claimed.",
    risk_vi: "Không owner-accept nếu wording nói approved hoặc native-reviewed.",
    risk_en: "Do not owner-accept if wording says approved or native-reviewed.",
    sample: {
      gurmukhi: "review ਅਜੇ ਬਾਕੀ ਹੈ।",
      romanization: "review aje baki hai",
      vi: "Review vẫn còn chờ.",
      en: "Review is still pending.",
    },
    owner_targets: ["finalOwnerReviewPacket", "finalIntegrationEvidenceMap", "finalPreIntegrationSummary"],
    owner_tags: ["native-review", "deferred", "boundary"],
    learner_trap_vi: "Deferred không bao giờ nên được trình bày như đã hoàn tất.",
    learner_trap_en: "Deferred should never be presented as complete.",
    must_not_claim_vi: "Không claim native review hoặc completion đã xong.",
    must_not_claim_en: "Do not claim native review or completion is done.",
  },
  {
    id: "owner-accept-forbidden-claims",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾ claim ਕਰੋ",
    romanization: "na claim karo",
    title_vi: "Không claim",
    title_en: "Forbidden owner claims",
    owner_acceptance_vi:
      "Không claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy hoặc A11 integration.",
    owner_acceptance_en:
      "Do not claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy, or A11 integration.",
    risk_vi: "Claim sai làm owner checklist nói quá khả năng hệ thống.",
    risk_en: "A false claim makes the owner checklist overstate system capability.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ text ਹੈ।",
      romanization: "ih siraf text hai",
      vi: "Đây chỉ là text.",
      en: "This is text only.",
    },
    owner_targets: ["finalQualityGates", "finalSmokeChecklist", "finalGoNoGoChecklist"],
    owner_tags: ["must-not-claim", "text-only", "no-a11-integration"],
    learner_trap_vi: "Text-only data không tự sinh audio, scoring, deploy hay push.",
    learner_trap_en: "Text-only data does not create audio, scoring, deploy, or push.",
    must_not_claim_vi:
      "Không claim audio, scoring, Azure, Supabase, deploy, push hoặc A11 integration.",
    must_not_claim_en:
      "Do not claim audio, pronunciation scoring, Azure, Supabase, deploy, push, or A11 integration; this is not A11 integration and no A11 integration runs here.",
  },
];

export const PUNJABI_FINAL_OWNER_ACCEPTANCE_CHECKLIST_ROUTES = [
  {
    id: "owner-accept-route-readiness",
    vi: "Owner kiểm module-family readiness, import/export expectations và duplicate-ID risk.",
    en: "Owner-check module-family readiness, import/export expectations, and duplicate-ID risk.",
    item_ids: [
      "owner-accept-module-family-readiness",
      "owner-accept-import-export-expectations",
      "owner-accept-duplicate-id-risk",
    ],
  },
  {
    id: "owner-accept-route-coverage",
    vi: "Owner kiểm A1-C2, Gurmukhi, Canada survival và remediation.",
    en: "Owner-check A1-C2, Gurmukhi, Canada survival, and remediation.",
    item_ids: [
      "owner-accept-level-coverage",
      "owner-accept-script-coverage",
      "owner-accept-canada-survival",
      "owner-accept-remediation-coverage",
    ],
  },
  {
    id: "owner-accept-route-boundary",
    vi: "Owner kiểm decision boundary, native review deferred và forbidden claims.",
    en: "Owner-check decision boundary, deferred native review, and forbidden claims.",
    item_ids: [
      "owner-accept-decision-boundary",
      "owner-accept-deferred-native-review",
      "owner-accept-forbidden-claims",
    ],
  },
];

export const PUNJABI_FINAL_OWNER_ACCEPTANCE_CHECKLIST_ROOT = {
  scope: PUNJABI_FINAL_OWNER_ACCEPTANCE_CHECKLIST_SCOPE,
  areas: PUNJABI_FINAL_OWNER_ACCEPTANCE_CHECKLIST_AREAS,
  owner_acceptance_items: PUNJABI_FINAL_OWNER_ACCEPTANCE_CHECKLIST,
  routes: PUNJABI_FINAL_OWNER_ACCEPTANCE_CHECKLIST_ROUTES,
};

export default PUNJABI_FINAL_OWNER_ACCEPTANCE_CHECKLIST_ROOT;
