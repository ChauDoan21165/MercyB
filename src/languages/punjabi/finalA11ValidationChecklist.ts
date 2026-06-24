// src/languages/punjabi/finalA11ValidationChecklist.ts
//
// Wave 35 final A11 validation checklist for Punjabi.
// This is pre-integration validation data for later A11 only. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalA11ValidationArea =
  | "expected_imports"
  | "export_names"
  | "duplicate_id_risks"
  | "level_coverage"
  | "canada_survival_domains"
  | "script_coverage"
  | "remediation_coverage"
  | "final_validation"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiFinalA11ValidationStatus =
  | "ready_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalA11ValidationItem = {
  id: string;
  area: PunjabiFinalA11ValidationArea;
  status: PunjabiFinalA11ValidationStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  validate_vi: string;
  validate_en: string;
  risk_vi: string;
  risk_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  validation_targets: string[];
  validation_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_A11_VALIDATION_CHECKLIST_SCOPE = {
  wave: "Wave 35",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  purpose_vi:
    "Final A11 validation checklist này chỉ xác thực readiness trước later A11; nó không thực hiện integration.",
  purpose_en:
    "This final A11 validation checklist only validates readiness before later A11; it does not perform integration.",
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

export const PUNJABI_FINAL_A11_VALIDATION_CHECKLIST_SCOPE_ALIAS =
  PUNJABI_FINAL_A11_VALIDATION_CHECKLIST_SCOPE;

export const PUNJABI_FINAL_A11_VALIDATION_CHECKLIST_PLAN_SCOPE =
  PUNJABI_FINAL_A11_VALIDATION_CHECKLIST_SCOPE;

export const PUNJABI_FINAL_A11_VALIDATION_CHECKLIST_AREAS: PunjabiFinalA11ValidationArea[] = [
  "expected_imports",
  "export_names",
  "duplicate_id_risks",
  "level_coverage",
  "canada_survival_domains",
  "script_coverage",
  "remediation_coverage",
  "final_validation",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_FINAL_A11_VALIDATION_CHECKLIST: PunjabiFinalA11ValidationItem[] = [
  {
    id: "validation-expected-imports",
    area: "expected_imports",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ ਸੂਚੀ",
    romanization: "import suchi",
    title_vi: "Danh sách import",
    title_en: "Expected imports",
    validate_vi:
      "Xác thực core, review và boundary imports đã được map trước later A11.",
    validate_en:
      "Validate that core, review, and boundary imports are mapped before later A11.",
    risk_vi:
      "Nếu thiếu expected import, later A11 có thể bỏ sót một module Punjabi.",
    risk_en:
      "If an expected import is missing, later A11 can skip a Punjabi module.",
    sample: {
      gurmukhi: "ਇੰਪੋਰਟ ਸੂਚੀ ਪੂਰੀ ਹੈ।",
      romanization: "import suchi puri hai",
      vi: "Danh sách import đã đủ.",
      en: "The import list is complete.",
    },
    validation_targets: [
      "index",
      "normalize",
      "lessons",
      "lessons-a1",
      "dialogues",
      "courseMap",
      "learningPath",
      "finalImportReadinessMap",
      "finalCoverageVerificationPack",
    ],
    validation_tags: ["expected-imports", "final-validation", "pre-integration"],
    learner_trap_vi:
      "Import readiness không có nghĩa integration đã chạy.",
    learner_trap_en:
      "Import readiness does not mean integration has run.",
  },
  {
    id: "validation-export-names",
    area: "export_names",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਐਕਸਪੋਰਟ ਨਾਂ",
    romanization: "export naam",
    title_vi: "Tên export",
    title_en: "Export names",
    validate_vi:
      "Xác thực named exports, default exports, file names và route labels theo cùng pattern Punjabi.",
    validate_en:
      "Validate named exports, default exports, file names, and route labels against the same Punjabi pattern.",
    risk_vi:
      "Một export name lệch có thể làm later A11 import nhầm dữ liệu.",
    risk_en:
      "One drifted export name can make later A11 import the wrong data.",
    sample: {
      gurmukhi: "ਨਾਂ ਇਕਸਾਰ ਰੱਖੋ।",
      romanization: "naam iksar rakho",
      vi: "Giữ tên nhất quán.",
      en: "Keep names consistent.",
    },
    validation_targets: [
      "finalExportReadiness",
      "finalPackagingReadiness",
      "finalMergeReadinessNotes",
      "finalImportReadinessMap",
      "finalCoverageVerificationPack",
    ],
    validation_tags: ["export-names", "naming", "cross-check"],
    learner_trap_vi:
      "Tên hiển thị không thay thế export identifier rõ ràng.",
    learner_trap_en:
      "A display name does not replace a clear export identifier.",
  },
  {
    id: "validation-duplicate-id-risks",
    area: "duplicate_id_risks",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ID ਖ਼ਤਰਾ",
    romanization: "duplicate ID khatra",
    title_vi: "Rủi ro ID trùng",
    title_en: "Duplicate ID risks",
    validate_vi:
      "Xác thực item IDs, route IDs, module IDs và export names không trùng trong final packs.",
    validate_en:
      "Validate item IDs, route IDs, module IDs, and export names are not duplicated across final packs.",
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
    validation_targets: [
      "finalModuleRegistry",
      "finalContentManifest",
      "finalIntegrationEvidenceMap",
      "finalIntegrationRiskRegister",
      "finalCoverageVerificationPack",
    ],
    validation_tags: ["duplicate-id", "one-owner", "risk-check"],
    learner_trap_vi:
      "Cùng chủ đề không luôn là duplicate; phải so full ID.",
    learner_trap_en:
      "The same topic is not always a duplicate; compare the full ID.",
  },
  {
    id: "validation-level-coverage",
    area: "level_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1-C2 ਕਵਰੇਜ",
    romanization: "A1-C2 coverage",
    title_vi: "Phủ A1-C2",
    title_en: "A1-C2 coverage",
    validate_vi:
      "Xác thực A1-C2 có goals, can-do, QA, review và final coverage markers.",
    validate_en:
      "Validate A1-C2 has goals, can-do items, QA, review, and final coverage markers.",
    risk_vi:
      "Thiếu một level làm learner route cho Vietnamese và English users bị đứt.",
    risk_en:
      "Missing one level breaks the learner route for Vietnamese and English users.",
    sample: {
      gurmukhi: "A1 ਤੋਂ C2 ਤੱਕ ਰਾਹ ਹੈ।",
      romanization: "A1 ton C2 takk raah hai",
      vi: "Có lộ trình từ A1 đến C2.",
      en: "There is a path from A1 to C2.",
    },
    validation_targets: [
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "masteryCheckpoints",
      "finalCanDoIndex",
      "finalQualityGates",
    ],
    validation_tags: ["a1-c2", "coverage", "learner-route"],
    learner_trap_vi:
      "A1-C2 coverage không phải official certification claim.",
    learner_trap_en:
      "A1-C2 coverage is not an official certification claim.",
  },
  {
    id: "validation-canada-survival-domains",
    area: "canada_survival_domains",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਕੈਨੇਡਾ survival",
    romanization: "Canada survival",
    title_vi: "Sinh hoạt Canada",
    title_en: "Canada survival domains",
    validate_vi:
      "Xác thực clinic, school, transit, workplace, public service và forms có text-only examples.",
    validate_en:
      "Validate clinic, school, transit, workplace, public service, and forms have text-only examples.",
    risk_vi:
      "Nếu thiếu domain thực tế, learner ở Canada khó chuyển bài học sang đời sống.",
    risk_en:
      "If practical domains are missing, learners in Canada struggle to transfer lessons to daily life.",
    sample: {
      gurmukhi: "ਮੈਨੂੰ ਫਾਰਮ ਭਰਨਾ ਹੈ।",
      romanization: "mainu form bharna hai",
      vi: "Tôi cần điền mẫu.",
      en: "I need to fill out a form.",
    },
    validation_targets: [
      "dialogues",
      "contentIndex",
      "integrationReadinessChecklist",
      "preIntegrationCoverageMap",
      "finalNavigationMap",
      "finalSmokeChecklist",
    ],
    validation_tags: ["canada-practical", "survival", "public-service"],
    canada_practical:
      "Use text-only clinic, school, transit, workplace, form, appointment, and public-service scenarios.",
    learner_trap_vi:
      "Canada-practical examples không phải tư vấn pháp lý hay y tế.",
    learner_trap_en:
      "Canada-practical examples are not legal or medical advice.",
  },
  {
    id: "validation-script-coverage",
    area: "script_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਸਕ੍ਰਿਪਟ",
    romanization: "Gurmukhi script",
    title_vi: "Chữ Gurmukhi",
    title_en: "Script coverage",
    validate_vi:
      "Xác thực Gurmukhi là primary script, romanization hỗ trợ khi hữu ích, và Shahmukhi chỉ awareness-only.",
    validate_en:
      "Validate Gurmukhi is the primary script, romanization supports where useful, and Shahmukhi is awareness-only.",
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
    validation_targets: [
      "normalize",
      "lessons",
      "lessons-a1",
      "skillDependencyGraph",
      "finalIntegrationGuardrails",
    ],
    validation_tags: ["gurmukhi-first", "script", "romanization-support"],
    learner_trap_vi:
      "Shahmukhi chỉ là awareness-only, không phải full course.",
    learner_trap_en:
      "Shahmukhi is awareness-only, not a full course.",
  },
  {
    id: "validation-remediation-coverage",
    area: "remediation_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੀਮੀਡੀਏਸ਼ਨ",
    romanization: "remediation",
    title_vi: "Sửa lỗi",
    title_en: "Remediation coverage",
    validate_vi:
      "Xác thực remediation cho script confusion, postpositions, register, review và Canada-domain gaps.",
    validate_en:
      "Validate remediation for script confusion, postpositions, register, review, and Canada-domain gaps.",
    risk_vi:
      "Nếu thiếu remediation, QA chỉ báo lỗi mà không có đường sửa.",
    risk_en:
      "If remediation is missing, QA reports errors without a repair path.",
    sample: {
      gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰੋ।",
      romanization: "galti thik karo",
      vi: "Hãy sửa lỗi.",
      en: "Fix the error.",
    },
    validation_targets: [
      "skillDependencyGraph",
      "masteryCheckpoints",
      "finalCanDoIndex",
      "finalQualityGates",
      "finalIntegrationStabilityPlan",
    ],
    validation_tags: ["remediation", "learner-traps", "final-regression"],
    learner_trap_vi:
      "Text-only remediation không tạo pronunciation scoring.",
    learner_trap_en:
      "Text-only remediation does not create pronunciation scoring.",
  },
  {
    id: "validation-final-boundary",
    area: "final_validation",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਫਾਈਨਲ validation",
    romanization: "final validation",
    title_vi: "Xác thực cuối",
    title_en: "Final validation",
    validate_vi:
      "Checklist này chỉ xác thực imports, exports, IDs, routes và coverage targets; không chạy A11 integration.",
    validate_en:
      "This checklist only validates imports, exports, IDs, routes, and coverage targets; it does not run A11 integration.",
    risk_vi:
      "Nếu wave này sửa integration wiring, nó vượt allowed files.",
    risk_en:
      "If this wave edits integration wiring, it exceeds the allowed files.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ validation ਹੈ।",
      romanization: "ih siraf validation hai",
      vi: "Đây chỉ là xác thực.",
      en: "This is only validation.",
    },
    validation_targets: [
      "finalIntegrationDryRunPlan",
      "finalA11HandoffNotes",
      "finalIntegrationSanityPack",
      "finalMergeReadinessNotes",
      "finalImportReadinessMap",
      "finalCoverageVerificationPack",
    ],
    validation_tags: ["final-validation", "cross-check", "not-a11"],
    learner_trap_vi:
      "Validation checklist không đồng nghĩa deploy, push hoặc integration thật.",
    learner_trap_en:
      "A validation checklist does not mean real deployment, push, or integration.",
  },
  {
    id: "validation-deferred-review",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ",
    romanization: "multavi samikhia",
    title_vi: "Review hoãn",
    title_en: "Deferred review",
    validate_vi:
      "Native review phải được ghi là deferred trong checklist; không claim completion.",
    validate_en:
      "Native review is deferred in the checklist; completion is not claimed.",
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
    validation_targets: [
      "preMrAuditChecklist",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
      "finalIntegrationRiskRegister",
    ],
    validation_tags: ["deferred-review", "native-review", "boundary"],
    learner_trap_vi:
      "Deferred không bao giờ nên được trình bày như đã hoàn tất.",
    learner_trap_en:
      "Deferred should never be presented as complete.",
    must_not_claim_vi: "Không claim native review hoặc completion đã xong.",
    must_not_claim_en: "Do not claim native review or completion is done.",
  },
  {
    id: "validation-forbidden-claims",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾ claim ਕਰੋ",
    romanization: "na claim karo",
    title_vi: "Không claim",
    title_en: "Must not claim",
    validate_vi:
      "Không claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy hoặc A11 integration.",
    validate_en:
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
    validation_targets: [
      "finalQualityGates",
      "finalSmokeChecklist",
      "finalIntegrationEvidenceMap",
      "finalCoverageVerificationPack",
    ],
    validation_tags: ["must-not-claim", "text-only", "no-a11-integration"],
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

export const PUNJABI_FINAL_A11_VALIDATION_CHECKLIST_ROUTES = [
  {
    id: "validation-route-imports",
    vi: "Kiểm expected imports, export names và duplicate ID risks.",
    en: "Check expected imports, export names, and duplicate ID risks.",
    item_ids: [
      "validation-expected-imports",
      "validation-export-names",
      "validation-duplicate-id-risks",
    ],
  },
  {
    id: "validation-route-coverage",
    vi: "Kiểm A1-C2, Canada survival, Gurmukhi và remediation.",
    en: "Check A1-C2, Canada survival, Gurmukhi, and remediation.",
    item_ids: [
      "validation-level-coverage",
      "validation-canada-survival-domains",
      "validation-script-coverage",
      "validation-remediation-coverage",
    ],
  },
  {
    id: "validation-route-boundary",
    vi: "Kiểm final validation, native review deferred và forbidden claims.",
    en: "Check final validation, deferred native review, and forbidden claims.",
    item_ids: [
      "validation-final-boundary",
      "validation-deferred-review",
      "validation-forbidden-claims",
    ],
  },
];

export const PUNJABI_FINAL_A11_VALIDATION_CHECKLIST_ROOT = {
  scope: PUNJABI_FINAL_A11_VALIDATION_CHECKLIST_SCOPE,
  areas: PUNJABI_FINAL_A11_VALIDATION_CHECKLIST_AREAS,
  validation_items: PUNJABI_FINAL_A11_VALIDATION_CHECKLIST,
  routes: PUNJABI_FINAL_A11_VALIDATION_CHECKLIST_ROUTES,
};

export default PUNJABI_FINAL_A11_VALIDATION_CHECKLIST_ROOT;
