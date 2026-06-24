// src/languages/punjabi/finalIntegrationClosureChecklist.ts
//
// Wave 36 final integration closure checklist for Punjabi.
// This is pre-integration closure data for later A11 only. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalIntegrationClosureArea =
  | "import_readiness"
  | "export_readiness"
  | "level_coverage"
  | "script_coverage"
  | "canada_survival_coverage"
  | "remediation_coverage"
  | "duplicate_id_risk"
  | "closure_validation"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiFinalIntegrationClosureStatus =
  | "ready_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalIntegrationClosureItem = {
  id: string;
  area: PunjabiFinalIntegrationClosureArea;
  status: PunjabiFinalIntegrationClosureStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  close_vi: string;
  close_en: string;
  risk_vi: string;
  risk_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  closure_targets: string[];
  closure_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_INTEGRATION_CLOSURE_CHECKLIST_SCOPE = {
  wave: "Wave 36",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  purpose_vi:
    "Final integration closure checklist này chỉ đóng kiểm tra trước later A11; nó không thực hiện integration.",
  purpose_en:
    "This final integration closure checklist only closes checks before later A11; it does not perform integration.",
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

export const PUNJABI_FINAL_INTEGRATION_CLOSURE_CHECKLIST_SCOPE_ALIAS =
  PUNJABI_FINAL_INTEGRATION_CLOSURE_CHECKLIST_SCOPE;

export const PUNJABI_FINAL_INTEGRATION_CLOSURE_CHECKLIST_PLAN_SCOPE =
  PUNJABI_FINAL_INTEGRATION_CLOSURE_CHECKLIST_SCOPE;

export const PUNJABI_FINAL_INTEGRATION_CLOSURE_CHECKLIST_AREAS: PunjabiFinalIntegrationClosureArea[] = [
  "import_readiness",
  "export_readiness",
  "level_coverage",
  "script_coverage",
  "canada_survival_coverage",
  "remediation_coverage",
  "duplicate_id_risk",
  "closure_validation",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_FINAL_INTEGRATION_CLOSURE_CHECKLIST: PunjabiFinalIntegrationClosureItem[] = [
  {
    id: "closure-import-readiness",
    area: "import_readiness",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ ਤਿਆਰੀ",
    romanization: "import tiari",
    title_vi: "Sẵn sàng import",
    title_en: "Import readiness",
    close_vi:
      "Đóng kiểm tra core, review và boundary imports trước later A11.",
    close_en:
      "Close the check for core, review, and boundary imports before later A11.",
    risk_vi:
      "Nếu thiếu import target, closure checklist sẽ bỏ sót module Punjabi.",
    risk_en:
      "If an import target is missing, the closure checklist will miss a Punjabi module.",
    sample: {
      gurmukhi: "ਇੰਪੋਰਟ ਸੂਚੀ ਸਾਫ਼ ਹੈ।",
      romanization: "import suchi saaf hai",
      vi: "Danh sách import rõ ràng.",
      en: "The import list is clear.",
    },
    closure_targets: [
      "index",
      "normalize",
      "lessons",
      "lessons-a1",
      "dialogues",
      "courseMap",
      "learningPath",
      "finalImportReadinessMap",
      "finalA11ValidationChecklist",
    ],
    closure_tags: ["import-readiness", "closure-validation", "pre-integration"],
    learner_trap_vi:
      "Import readiness không có nghĩa A11 integration đã chạy.",
    learner_trap_en:
      "Import readiness does not mean A11 integration has run.",
  },
  {
    id: "closure-export-readiness",
    area: "export_readiness",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਐਕਸਪੋਰਟ ਤਿਆਰੀ",
    romanization: "export tiari",
    title_vi: "Sẵn sàng export",
    title_en: "Export readiness",
    close_vi:
      "Đóng kiểm tra named exports, default exports, route labels và file names theo cùng pattern.",
    close_en:
      "Close the check for named exports, default exports, route labels, and file names against one pattern.",
    risk_vi:
      "Export name lệch có thể làm later A11 import sai dữ liệu.",
    risk_en:
      "A drifted export name can make later A11 import the wrong data.",
    sample: {
      gurmukhi: "ਨਾਂ ਇਕਸਾਰ ਰੱਖੋ।",
      romanization: "naam iksar rakho",
      vi: "Giữ tên nhất quán.",
      en: "Keep names consistent.",
    },
    closure_targets: [
      "finalExportReadiness",
      "finalPackagingReadiness",
      "finalMergeReadinessNotes",
      "finalImportReadinessMap",
      "finalCoverageVerificationPack",
      "finalA11ValidationChecklist",
    ],
    closure_tags: ["export-readiness", "naming", "final-cross-check"],
    learner_trap_vi:
      "Tên hiển thị tốt không thay thế export identifier rõ ràng.",
    learner_trap_en:
      "A good display name does not replace a clear export identifier.",
  },
  {
    id: "closure-level-coverage",
    area: "level_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1-C2 ਕਵਰੇਜ",
    romanization: "A1-C2 coverage",
    title_vi: "Phủ A1-C2",
    title_en: "A1-C2 coverage",
    close_vi:
      "Đóng kiểm tra A1-C2 có goals, lessons, can-do, QA và final coverage markers.",
    close_en:
      "Close the check that A1-C2 has goals, lessons, can-do items, QA, and final coverage markers.",
    risk_vi:
      "Thiếu level làm route học của Vietnamese và English users bị đứt.",
    risk_en:
      "A missing level breaks the learning route for Vietnamese and English users.",
    sample: {
      gurmukhi: "A1 ਤੋਂ C2 ਤੱਕ ਰਾਹ ਹੈ।",
      romanization: "A1 ton C2 takk raah hai",
      vi: "Có lộ trình từ A1 đến C2.",
      en: "There is a path from A1 to C2.",
    },
    closure_targets: [
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "masteryCheckpoints",
      "finalCanDoIndex",
      "finalQualityGates",
    ],
    closure_tags: ["a1-c2", "level-coverage", "learner-route"],
    learner_trap_vi:
      "A1-C2 coverage không phải official certification claim.",
    learner_trap_en:
      "A1-C2 coverage is not an official certification claim.",
  },
  {
    id: "closure-script-coverage",
    area: "script_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਸਕ੍ਰਿਪਟ",
    romanization: "Gurmukhi script",
    title_vi: "Chữ Gurmukhi",
    title_en: "Script coverage",
    close_vi:
      "Đóng kiểm tra Gurmukhi là primary script, romanization hỗ trợ khi hữu ích, và Shahmukhi chỉ awareness-only.",
    close_en:
      "Close the check that Gurmukhi is primary, romanization supports where useful, and Shahmukhi is awareness-only.",
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
    closure_targets: [
      "normalize",
      "lessons",
      "lessons-a1",
      "skillDependencyGraph",
      "finalIntegrationGuardrails",
    ],
    closure_tags: ["gurmukhi-first", "script-coverage", "romanization-support"],
    learner_trap_vi:
      "Shahmukhi chỉ là awareness-only, không phải full course.",
    learner_trap_en:
      "Shahmukhi is awareness-only, not a full course.",
  },
  {
    id: "closure-canada-survival",
    area: "canada_survival_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਕੈਨੇਡਾ survival",
    romanization: "Canada survival",
    title_vi: "Sinh hoạt Canada",
    title_en: "Canada survival coverage",
    close_vi:
      "Đóng kiểm tra clinic, school, transit, workplace, forms và public service có examples text-only.",
    close_en:
      "Close the check that clinic, school, transit, workplace, forms, and public service have text-only examples.",
    risk_vi:
      "Nếu thiếu Canada survival, learner khó dùng Punjabi trong tình huống thực tế.",
    risk_en:
      "If Canada survival is missing, learners struggle to use Punjabi in practical situations.",
    sample: {
      gurmukhi: "ਮੈਨੂੰ appointment ਚਾਹੀਦੀ ਹੈ।",
      romanization: "mainu appointment chahidi hai",
      vi: "Tôi cần một cuộc hẹn.",
      en: "I need an appointment.",
    },
    closure_targets: [
      "dialogues",
      "contentIndex",
      "integrationReadinessChecklist",
      "preIntegrationCoverageMap",
      "finalNavigationMap",
      "finalSmokeChecklist",
    ],
    closure_tags: ["canada-practical", "survival", "public-service"],
    canada_practical:
      "Use text-only appointment, form, school, workplace, transit, clinic, and public-service scenarios.",
    learner_trap_vi:
      "Canada-practical examples không phải tư vấn pháp lý hay y tế.",
    learner_trap_en:
      "Canada-practical examples are not legal or medical advice.",
  },
  {
    id: "closure-remediation",
    area: "remediation_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੀਮੀਡੀਏਸ਼ਨ",
    romanization: "remediation",
    title_vi: "Sửa lỗi",
    title_en: "Remediation coverage",
    close_vi:
      "Đóng kiểm tra remediation cho script confusion, postpositions, register, review và Canada-domain gaps.",
    close_en:
      "Close remediation checks for script confusion, postpositions, register, review, and Canada-domain gaps.",
    risk_vi:
      "Nếu thiếu remediation, QA phát hiện lỗi nhưng không có đường sửa.",
    risk_en:
      "If remediation is missing, QA finds errors without a repair path.",
    sample: {
      gurmukhi: "ਗਲਤੀ ਤੋਂ ਬਾਅਦ ਦੁਬਾਰਾ ਅਭਿਆਸ ਕਰੋ।",
      romanization: "galti ton baad dubara abhyaas karo",
      vi: "Sau lỗi, hãy luyện lại.",
      en: "After an error, practice again.",
    },
    closure_targets: [
      "skillDependencyGraph",
      "masteryCheckpoints",
      "finalCanDoIndex",
      "finalQualityGates",
      "finalIntegrationStabilityPlan",
    ],
    closure_tags: ["remediation", "learner-traps", "final-cross-check"],
    learner_trap_vi:
      "Text-only remediation không tạo pronunciation scoring.",
    learner_trap_en:
      "Text-only remediation does not create pronunciation scoring.",
  },
  {
    id: "closure-duplicate-id-risk",
    area: "duplicate_id_risk",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ID ਖ਼ਤਰਾ",
    romanization: "duplicate ID khatra",
    title_vi: "Rủi ro ID trùng",
    title_en: "Duplicate ID risk",
    close_vi:
      "Đóng kiểm tra item IDs, route IDs, module IDs và export names không trùng.",
    close_en:
      "Close the check that item IDs, route IDs, module IDs, and export names are not duplicated.",
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
    closure_targets: [
      "finalModuleRegistry",
      "finalContentManifest",
      "finalIntegrationRiskRegister",
      "finalCoverageVerificationPack",
      "finalA11ValidationChecklist",
    ],
    closure_tags: ["duplicate-id", "one-owner", "risk-check"],
    learner_trap_vi:
      "Cùng topic không luôn là duplicate; phải so full ID.",
    learner_trap_en:
      "The same topic is not always a duplicate; compare the full ID.",
  },
  {
    id: "closure-final-boundary",
    area: "closure_validation",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "closure ਜਾਂਚ",
    romanization: "closure validation",
    title_vi: "Đóng xác thực",
    title_en: "Closure validation",
    close_vi:
      "Checklist này chỉ đóng cross-checks, targets và routes; không chạy A11 integration.",
    close_en:
      "This checklist only closes cross-checks, targets, and routes; it does not run A11 integration.",
    risk_vi:
      "Nếu wave này sửa integration wiring, nó vượt allowed files.",
    risk_en:
      "If this wave edits integration wiring, it exceeds the allowed files.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ closure check ਹੈ।",
      romanization: "ih siraf closure check hai",
      vi: "Đây chỉ là kiểm tra đóng.",
      en: "This is only a closure check.",
    },
    closure_targets: [
      "finalIntegrationDryRunPlan",
      "finalA11HandoffNotes",
      "finalIntegrationSanityPack",
      "finalMergeReadinessNotes",
      "finalImportReadinessMap",
      "finalCoverageVerificationPack",
      "finalA11ValidationChecklist",
    ],
    closure_tags: ["closure-validation", "final-cross-check", "not-a11"],
    learner_trap_vi:
      "Closure checklist không đồng nghĩa deploy, push hoặc integration thật.",
    learner_trap_en:
      "A closure checklist does not mean real deployment, push, or integration.",
  },
  {
    id: "closure-deferred-review",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ",
    romanization: "multavi samikhia",
    title_vi: "Review hoãn",
    title_en: "Deferred review",
    close_vi:
      "Native review phải được ghi là deferred trong closure checklist; không claim completion.",
    close_en:
      "Native review is deferred in the closure checklist; completion is not claimed.",
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
    closure_targets: [
      "preMrAuditChecklist",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
      "finalIntegrationRiskRegister",
    ],
    closure_tags: ["deferred-review", "native-review", "boundary"],
    learner_trap_vi:
      "Deferred không bao giờ nên được trình bày như đã hoàn tất.",
    learner_trap_en:
      "Deferred should never be presented as complete.",
    must_not_claim_vi: "Không claim native review hoặc completion đã xong.",
    must_not_claim_en: "Do not claim native review or completion is done.",
  },
  {
    id: "closure-forbidden-claims",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾ claim ਕਰੋ",
    romanization: "na claim karo",
    title_vi: "Không claim",
    title_en: "Must not claim",
    close_vi:
      "Không claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy hoặc A11 integration.",
    close_en:
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
    closure_targets: [
      "finalQualityGates",
      "finalSmokeChecklist",
      "finalCoverageVerificationPack",
      "finalA11ValidationChecklist",
    ],
    closure_tags: ["must-not-claim", "text-only", "no-a11-integration"],
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

export const PUNJABI_FINAL_INTEGRATION_CLOSURE_CHECKLIST_ROUTES = [
  {
    id: "closure-route-readiness",
    vi: "Kiểm import readiness, export readiness và duplicate ID risk.",
    en: "Check import readiness, export readiness, and duplicate ID risk.",
    item_ids: [
      "closure-import-readiness",
      "closure-export-readiness",
      "closure-duplicate-id-risk",
    ],
  },
  {
    id: "closure-route-coverage",
    vi: "Kiểm A1-C2, Gurmukhi, Canada survival và remediation.",
    en: "Check A1-C2, Gurmukhi, Canada survival, and remediation.",
    item_ids: [
      "closure-level-coverage",
      "closure-script-coverage",
      "closure-canada-survival",
      "closure-remediation",
    ],
  },
  {
    id: "closure-route-boundary",
    vi: "Kiểm closure validation, native review deferred và forbidden claims.",
    en: "Check closure validation, deferred native review, and forbidden claims.",
    item_ids: [
      "closure-final-boundary",
      "closure-deferred-review",
      "closure-forbidden-claims",
    ],
  },
];

export const PUNJABI_FINAL_INTEGRATION_CLOSURE_CHECKLIST_ROOT = {
  scope: PUNJABI_FINAL_INTEGRATION_CLOSURE_CHECKLIST_SCOPE,
  areas: PUNJABI_FINAL_INTEGRATION_CLOSURE_CHECKLIST_AREAS,
  closure_items: PUNJABI_FINAL_INTEGRATION_CLOSURE_CHECKLIST,
  routes: PUNJABI_FINAL_INTEGRATION_CLOSURE_CHECKLIST_ROUTES,
};

export default PUNJABI_FINAL_INTEGRATION_CLOSURE_CHECKLIST_ROOT;
