// src/languages/punjabi/finalReleaseCandidateChecklist.ts
//
// Wave 37 final release-candidate checklist for Punjabi.
// This is pre-integration release-candidate data for later A11 only. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalReleaseCandidateArea =
  | "import_export_readiness"
  | "module_family_coverage"
  | "level_coverage"
  | "script_coverage"
  | "canada_survival_coverage"
  | "remediation_coverage"
  | "duplicate_id_risk"
  | "release_candidate_validation"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiFinalReleaseCandidateStatus =
  | "ready_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalReleaseCandidateItem = {
  id: string;
  area: PunjabiFinalReleaseCandidateArea;
  status: PunjabiFinalReleaseCandidateStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  check_vi: string;
  check_en: string;
  risk_vi: string;
  risk_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  release_targets: string[];
  release_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_SCOPE = {
  wave: "Wave 37",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  purpose_vi:
    "Final release-candidate checklist này chỉ kiểm tra trước later A11; nó không thực hiện integration.",
  purpose_en:
    "This final release-candidate checklist only checks readiness before later A11; it does not perform integration.",
  script_note_vi:
    "Gurmukhi là chữ chính. Shahmukhi chỉ là awareness-only, không phải full course.",
  script_note_en:
    "Gurmukhi is the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã hoàn tất.",
  native_review_en: "Native review is deferred; completion is not claimed.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
};

export const PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_SCOPE_ALIAS =
  PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_SCOPE;

export const PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_PLAN_SCOPE =
  PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_SCOPE;

export const PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_AREAS: PunjabiFinalReleaseCandidateArea[] = [
  "import_export_readiness",
  "module_family_coverage",
  "level_coverage",
  "script_coverage",
  "canada_survival_coverage",
  "remediation_coverage",
  "duplicate_id_risk",
  "release_candidate_validation",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST: PunjabiFinalReleaseCandidateItem[] = [
  {
    id: "release-import-export-readiness",
    area: "import_export_readiness",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ export ਤਿਆਰੀ",
    romanization: "import export tiari",
    title_vi: "Sẵn sàng import/export",
    title_en: "Import/export readiness",
    check_vi:
      "Kiểm expected imports, named exports, default exports và route labels trước later A11.",
    check_en:
      "Check expected imports, named exports, default exports, and route labels before later A11.",
    risk_vi:
      "Một export hoặc import lệch có thể làm later A11 bỏ sót module.",
    risk_en:
      "One drifted export or import can make later A11 skip a module.",
    sample: {
      gurmukhi: "ਇੰਪੋਰਟ ਤੇ export ਇਕਸਾਰ ਹਨ।",
      romanization: "import te export iksar han",
      vi: "Import và export nhất quán.",
      en: "Imports and exports are consistent.",
    },
    release_targets: [
      "finalImportReadinessMap",
      "finalExportReadiness",
      "finalA11ValidationChecklist",
      "finalIntegrationClosureChecklist",
    ],
    release_tags: ["import-readiness", "export-readiness", "release-candidate"],
    learner_trap_vi:
      "Readiness không có nghĩa integration đã chạy.",
    learner_trap_en:
      "Readiness does not mean integration has run.",
  },
  {
    id: "release-module-family-coverage",
    area: "module_family_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ",
    romanization: "module parivaar",
    title_vi: "Nhóm module",
    title_en: "Module-family coverage",
    check_vi:
      "Kiểm core, lesson, dialogue, map, QA, manifest, handoff và final-check families.",
    check_en:
      "Check core, lesson, dialogue, map, QA, manifest, handoff, and final-check families.",
    risk_vi:
      "Thiếu một family làm release candidate không đại diện đủ nội dung Punjabi.",
    risk_en:
      "A missing family means the release candidate does not represent all Punjabi content.",
    sample: {
      gurmukhi: "ਸਾਰੇ ਹਿੱਸੇ ਇਕੱਠੇ ਹਨ।",
      romanization: "saare hisse ikatthe han",
      vi: "Tất cả phần ở cùng nhau.",
      en: "All parts are together.",
    },
    release_targets: [
      "index",
      "lessons",
      "dialogues",
      "courseMap",
      "finalContentManifest",
      "finalIntegrationClosureChecklist",
    ],
    release_tags: ["module-family", "coverage", "closure-validation"],
    learner_trap_vi:
      "Có đủ family không có nghĩa native review đã xong.",
    learner_trap_en:
      "Having every family does not mean native review is done.",
  },
  {
    id: "release-level-coverage",
    area: "level_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1-C2 ਕਵਰੇਜ",
    romanization: "A1-C2 coverage",
    title_vi: "Phủ A1-C2",
    title_en: "A1-C2 coverage",
    check_vi:
      "Kiểm A1-C2 có goals, lessons, can-do, review, QA và final coverage markers.",
    check_en:
      "Check A1-C2 has goals, lessons, can-do items, review, QA, and final coverage markers.",
    risk_vi:
      "Thiếu level làm lộ trình cho Vietnamese-speaking và English-speaking learners bị đứt.",
    risk_en:
      "A missing level breaks the route for Vietnamese-speaking and English-speaking learners.",
    sample: {
      gurmukhi: "A1 ਤੋਂ C2 ਤੱਕ ਰਾਹ ਹੈ।",
      romanization: "A1 ton C2 takk raah hai",
      vi: "Có lộ trình từ A1 đến C2.",
      en: "There is a path from A1 to C2.",
    },
    release_targets: [
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "masteryCheckpoints",
      "finalCanDoIndex",
    ],
    release_tags: ["a1-c2", "level-coverage", "learner-route"],
    learner_trap_vi:
      "A1-C2 coverage không phải official certification claim.",
    learner_trap_en:
      "A1-C2 coverage is not an official certification claim.",
  },
  {
    id: "release-script-coverage",
    area: "script_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਸਕ੍ਰਿਪਟ",
    romanization: "Gurmukhi script",
    title_vi: "Chữ Gurmukhi",
    title_en: "Gurmukhi/script coverage",
    check_vi:
      "Kiểm Gurmukhi là primary script, romanization hỗ trợ khi hữu ích, và Shahmukhi chỉ awareness-only.",
    check_en:
      "Check Gurmukhi is primary, romanization supports where useful, and Shahmukhi is awareness-only.",
    risk_vi:
      "Nếu romanization thay Gurmukhi, learner mất nền chữ chính.",
    risk_en:
      "If romanization replaces Gurmukhi, learners lose the primary-script base.",
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ ਹੈ।",
      romanization: "Gurmukhi pehlan hai",
      vi: "Gurmukhi đi trước.",
      en: "Gurmukhi comes first.",
    },
    release_targets: [
      "normalize",
      "lessons",
      "lessons-a1",
      "skillDependencyGraph",
      "finalIntegrationGuardrails",
    ],
    release_tags: ["gurmukhi-first", "script-coverage", "romanization-support"],
    learner_trap_vi:
      "Shahmukhi chỉ là awareness-only, không phải full course.",
    learner_trap_en:
      "Shahmukhi is awareness-only, not a full course.",
  },
  {
    id: "release-canada-survival",
    area: "canada_survival_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਕੈਨੇਡਾ survival",
    romanization: "Canada survival",
    title_vi: "Sinh hoạt Canada",
    title_en: "Canada survival coverage",
    check_vi:
      "Kiểm clinic, school, transit, workplace, forms và public service có examples text-only.",
    check_en:
      "Check clinic, school, transit, workplace, forms, and public service have text-only examples.",
    risk_vi:
      "Thiếu Canada survival làm nội dung kém thực dụng cho learner ở Canada.",
    risk_en:
      "Missing Canada survival makes the content less practical for learners in Canada.",
    sample: {
      gurmukhi: "ਮੈਨੂੰ appointment ਚਾਹੀਦੀ ਹੈ।",
      romanization: "mainu appointment chahidi hai",
      vi: "Tôi cần một cuộc hẹn.",
      en: "I need an appointment.",
    },
    release_targets: [
      "dialogues",
      "contentIndex",
      "preIntegrationCoverageMap",
      "finalNavigationMap",
      "finalSmokeChecklist",
    ],
    release_tags: ["canada-practical", "survival", "public-service"],
    canada_practical:
      "Use text-only appointment, clinic, school, workplace, transit, form, and public-service scenarios.",
    learner_trap_vi:
      "Canada-practical examples không phải tư vấn pháp lý hay y tế.",
    learner_trap_en:
      "Canada-practical examples are not legal or medical advice.",
  },
  {
    id: "release-remediation",
    area: "remediation_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੀਮੀਡੀਏਸ਼ਨ",
    romanization: "remediation",
    title_vi: "Sửa lỗi",
    title_en: "Remediation coverage",
    check_vi:
      "Kiểm remediation cho script confusion, postpositions, register, review và Canada-domain gaps.",
    check_en:
      "Check remediation for script confusion, postpositions, register, review, and Canada-domain gaps.",
    risk_vi:
      "Nếu thiếu remediation, QA phát hiện lỗi nhưng không có đường sửa.",
    risk_en:
      "If remediation is missing, QA finds errors without a repair path.",
    sample: {
      gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰੋ।",
      romanization: "galti thik karo",
      vi: "Hãy sửa lỗi.",
      en: "Fix the error.",
    },
    release_targets: [
      "skillDependencyGraph",
      "masteryCheckpoints",
      "finalCanDoIndex",
      "finalQualityGates",
      "finalIntegrationStabilityPlan",
    ],
    release_tags: ["remediation", "learner-traps", "closure-validation"],
    learner_trap_vi:
      "Text-only remediation không tạo pronunciation scoring.",
    learner_trap_en:
      "Text-only remediation does not create pronunciation scoring.",
  },
  {
    id: "release-duplicate-id-risk",
    area: "duplicate_id_risk",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ID ਖ਼ਤਰਾ",
    romanization: "duplicate ID khatra",
    title_vi: "Rủi ro ID trùng",
    title_en: "Duplicate ID risk",
    check_vi:
      "Kiểm item IDs, route IDs, module IDs và export names không trùng.",
    check_en:
      "Check item IDs, route IDs, module IDs, and export names are not duplicated.",
    risk_vi:
      "ID trùng có thể làm registry hoặc route ghi đè sai mục.",
    risk_en:
      "Duplicate IDs can make a registry or route overwrite the wrong item.",
    sample: {
      gurmukhi: "ਹਰ ID ਵੱਖਰੀ ਹੈ।",
      romanization: "har ID vakhri hai",
      vi: "Mỗi ID khác nhau.",
      en: "Every ID is different.",
    },
    release_targets: [
      "finalModuleRegistry",
      "finalContentManifest",
      "finalIntegrationRiskRegister",
      "finalCoverageVerificationPack",
      "finalA11ValidationChecklist",
    ],
    release_tags: ["duplicate-id", "one-owner", "risk-check"],
    learner_trap_vi:
      "Cùng topic không luôn là duplicate; phải so full ID.",
    learner_trap_en:
      "The same topic is not always a duplicate; compare the full ID.",
  },
  {
    id: "release-candidate-boundary",
    area: "release_candidate_validation",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "release candidate ਜਾਂਚ",
    romanization: "release candidate janch",
    title_vi: "Kiểm release candidate",
    title_en: "Release-candidate validation",
    check_vi:
      "Checklist này chỉ kiểm release-candidate targets và routes; không chạy A11 integration.",
    check_en:
      "This checklist only checks release-candidate targets and routes; it does not run A11 integration.",
    risk_vi:
      "Nếu wave này sửa integration wiring, nó vượt allowed files.",
    risk_en:
      "If this wave edits integration wiring, it exceeds the allowed files.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ ਜਾਂਚ ਹੈ।",
      romanization: "ih siraf janch hai",
      vi: "Đây chỉ là kiểm tra.",
      en: "This is only a check.",
    },
    release_targets: [
      "finalIntegrationClosureChecklist",
      "finalA11ValidationChecklist",
      "finalCoverageVerificationPack",
      "finalImportReadinessMap",
    ],
    release_tags: ["release-candidate", "closure-validation", "not-a11"],
    learner_trap_vi:
      "Release candidate checklist không đồng nghĩa deploy, push hoặc integration thật.",
    learner_trap_en:
      "A release-candidate checklist does not mean real deployment, push, or integration.",
  },
  {
    id: "release-deferred-review",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ",
    romanization: "multavi samikhia",
    title_vi: "Review hoãn",
    title_en: "Deferred review",
    check_vi:
      "Native review phải được ghi là deferred trong release candidate; không claim completion.",
    check_en:
      "Native review is deferred in the release candidate; completion is not claimed.",
    risk_vi:
      "Nếu đổi thành approved, checklist nói quá trạng thái nội dung.",
    risk_en:
      "If this changes to approved, the checklist overstates content status.",
    sample: {
      gurmukhi: "review ਅਜੇ ਬਾਕੀ ਹੈ।",
      romanization: "review aje baki hai",
      vi: "Review vẫn còn chờ.",
      en: "Review is still pending.",
    },
    release_targets: [
      "preMrAuditChecklist",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
      "finalIntegrationRiskRegister",
    ],
    release_tags: ["deferred-review", "native-review", "boundary"],
    learner_trap_vi:
      "Deferred không bao giờ nên được trình bày như đã hoàn tất.",
    learner_trap_en:
      "Deferred should never be presented as complete.",
    must_not_claim_vi: "Không claim native review hoặc completion đã xong.",
    must_not_claim_en: "Do not claim native review or completion is done.",
  },
  {
    id: "release-forbidden-claims",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾ claim ਕਰੋ",
    romanization: "na claim karo",
    title_vi: "Không claim",
    title_en: "Must not claim",
    check_vi:
      "Không claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy hoặc A11 integration.",
    check_en:
      "Do not claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy, or A11 integration.",
    risk_vi:
      "Nếu wording quảng bá lọt vào, checklist sẽ nói sai khả năng hệ thống.",
    risk_en:
      "If promotional wording slips in, the checklist misstates system capability.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ text ਹੈ।",
      romanization: "ih siraf text hai",
      vi: "Đây chỉ là text.",
      en: "This is text only.",
    },
    release_targets: [
      "finalQualityGates",
      "finalSmokeChecklist",
      "finalCoverageVerificationPack",
      "finalIntegrationClosureChecklist",
    ],
    release_tags: ["must-not-claim", "text-only", "no-a11-integration"],
    learner_trap_vi:
      "Text-only data không tự sinh audio, scoring, deploy hay push.",
    learner_trap_en:
      "Text-only data does not create audio, scoring, deploy, or push.",
    must_not_claim_vi:
      "Không claim audio, scoring, Azure, Supabase, deploy, push hoặc A11 integration.",
    must_not_claim_en:
      "Do not claim audio, pronunciation scoring, Azure, Supabase, deploy, push, or A11 integration; this is not A11 integration and no A11 integration runs here.",
  },
];

export const PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_ROUTES = [
  {
    id: "release-route-readiness",
    vi: "Kiểm import/export readiness, module family coverage và duplicate ID risk.",
    en: "Check import/export readiness, module-family coverage, and duplicate ID risk.",
    item_ids: [
      "release-import-export-readiness",
      "release-module-family-coverage",
      "release-duplicate-id-risk",
    ],
  },
  {
    id: "release-route-coverage",
    vi: "Kiểm A1-C2, Gurmukhi, Canada survival và remediation.",
    en: "Check A1-C2, Gurmukhi, Canada survival, and remediation.",
    item_ids: [
      "release-level-coverage",
      "release-script-coverage",
      "release-canada-survival",
      "release-remediation",
    ],
  },
  {
    id: "release-route-boundary",
    vi: "Kiểm release candidate boundary, native review deferred và forbidden claims.",
    en: "Check release-candidate boundary, deferred native review, and forbidden claims.",
    item_ids: [
      "release-candidate-boundary",
      "release-deferred-review",
      "release-forbidden-claims",
    ],
  },
];

export const PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_ROOT = {
  scope: PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_SCOPE,
  areas: PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_AREAS,
  release_items: PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST,
  routes: PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_ROUTES,
};

export default PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_ROOT;
