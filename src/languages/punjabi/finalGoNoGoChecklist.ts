// src/languages/punjabi/finalGoNoGoChecklist.ts
//
// Wave 38 final go/no-go checklist for Punjabi.
// This is pre-integration go/no-go data for later A11 only. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalGoNoGoArea =
  | "import_readiness"
  | "export_readiness"
  | "duplicate_risk_checks"
  | "level_coverage"
  | "script_coverage"
  | "canada_survival_coverage"
  | "remediation_coverage"
  | "go_no_go_decision"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiFinalGoNoGoStatus =
  | "go_for_later_a11"
  | "manual_review_needed"
  | "no_go_boundary";

export type PunjabiFinalGoNoGoItem = {
  id: string;
  area: PunjabiFinalGoNoGoArea;
  status: PunjabiFinalGoNoGoStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  decision_vi: string;
  decision_en: string;
  risk_vi: string;
  risk_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  decision_targets: string[];
  decision_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_GO_NO_GO_CHECKLIST_SCOPE = {
  wave: "Wave 38",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  purpose_vi:
    "Final go/no-go checklist này chỉ hỗ trợ quyết định trước later A11; nó không thực hiện integration.",
  purpose_en:
    "This final go/no-go checklist only supports a decision before later A11; it does not perform integration.",
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

export const PUNJABI_FINAL_GO_NO_GO_CHECKLIST_SCOPE_ALIAS =
  PUNJABI_FINAL_GO_NO_GO_CHECKLIST_SCOPE;

export const PUNJABI_FINAL_GO_NO_GO_CHECKLIST_PLAN_SCOPE =
  PUNJABI_FINAL_GO_NO_GO_CHECKLIST_SCOPE;

export const PUNJABI_FINAL_GO_NO_GO_CHECKLIST_AREAS: PunjabiFinalGoNoGoArea[] = [
  "import_readiness",
  "export_readiness",
  "duplicate_risk_checks",
  "level_coverage",
  "script_coverage",
  "canada_survival_coverage",
  "remediation_coverage",
  "go_no_go_decision",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_FINAL_GO_NO_GO_CHECKLIST: PunjabiFinalGoNoGoItem[] = [
  {
    id: "go-no-go-import-readiness",
    area: "import_readiness",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ ਤਿਆਰੀ",
    romanization: "import tiari",
    title_vi: "Sẵn sàng import",
    title_en: "Import readiness",
    decision_vi:
      "Go chỉ khi expected imports, route groups và final import map khớp.",
    decision_en:
      "Go only when expected imports, route groups, and the final import map align.",
    risk_vi:
      "No-go nếu import target thiếu hoặc tên import bị drift.",
    risk_en:
      "No-go if an import target is missing or an import name has drifted.",
    sample: {
      gurmukhi: "ਇੰਪੋਰਟ ਸੂਚੀ ਮਿਲਦੀ ਹੈ।",
      romanization: "import suchi mildi hai",
      vi: "Danh sách import khớp.",
      en: "The import list matches.",
    },
    decision_targets: [
      "index",
      "normalize",
      "lessons",
      "dialogues",
      "finalImportReadinessMap",
      "finalIntegrationClosureChecklist",
    ],
    decision_tags: ["import-readiness", "go-no-go", "pre-integration"],
    learner_trap_vi:
      "Import readiness không có nghĩa integration đã chạy.",
    learner_trap_en:
      "Import readiness does not mean integration has run.",
  },
  {
    id: "go-no-go-export-readiness",
    area: "export_readiness",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਐਕਸਪੋਰਟ ਤਿਆਰੀ",
    romanization: "export tiari",
    title_vi: "Sẵn sàng export",
    title_en: "Export readiness",
    decision_vi:
      "Go chỉ khi named exports, default exports, file names và route labels nhất quán.",
    decision_en:
      "Go only when named exports, default exports, file names, and route labels are consistent.",
    risk_vi:
      "No-go nếu một export bị đổi tên hoặc trùng với item khác.",
    risk_en:
      "No-go if one export is renamed or duplicates another item.",
    sample: {
      gurmukhi: "ਨਾਂ ਇਕਸਾਰ ਹਨ।",
      romanization: "naam iksar han",
      vi: "Các tên nhất quán.",
      en: "The names are consistent.",
    },
    decision_targets: [
      "finalExportReadiness",
      "finalPackagingReadiness",
      "finalReleaseCandidateChecklist",
      "finalA11ValidationChecklist",
    ],
    decision_tags: ["export-readiness", "release-candidate", "closure-validation"],
    learner_trap_vi:
      "Tên hiển thị tốt không thay thế export identifier rõ ràng.",
    learner_trap_en:
      "A good display name does not replace a clear export identifier.",
  },
  {
    id: "go-no-go-duplicate-risk",
    area: "duplicate_risk_checks",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ਖ਼ਤਰਾ",
    romanization: "duplicate khatra",
    title_vi: "Rủi ro trùng",
    title_en: "Duplicate-risk checks",
    decision_vi:
      "Go chỉ khi item IDs, route IDs, module IDs và export names không trùng.",
    decision_en:
      "Go only when item IDs, route IDs, module IDs, and export names are not duplicated.",
    risk_vi:
      "No-go nếu ID trùng có thể làm registry ghi đè sai mục.",
    risk_en:
      "No-go if duplicated IDs could make a registry overwrite the wrong item.",
    sample: {
      gurmukhi: "ਹਰ ID ਵੱਖਰੀ ਹੈ।",
      romanization: "har ID vakhri hai",
      vi: "Mỗi ID khác nhau.",
      en: "Every ID is different.",
    },
    decision_targets: [
      "finalModuleRegistry",
      "finalContentManifest",
      "finalIntegrationRiskRegister",
      "finalCoverageVerificationPack",
      "finalReleaseCandidateChecklist",
    ],
    decision_tags: ["duplicate-risk", "one-owner", "risk-check"],
    learner_trap_vi:
      "Cùng topic không luôn là duplicate; phải so full ID.",
    learner_trap_en:
      "The same topic is not always a duplicate; compare the full ID.",
  },
  {
    id: "go-no-go-level-coverage",
    area: "level_coverage",
    status: "go_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1-C2 ਕਵਰੇਜ",
    romanization: "A1-C2 coverage",
    title_vi: "Phủ A1-C2",
    title_en: "A1-C2 coverage",
    decision_vi:
      "Go khi A1-C2 có goals, lessons, can-do, review, QA và final coverage markers.",
    decision_en:
      "Go when A1-C2 has goals, lessons, can-do items, review, QA, and final coverage markers.",
    risk_vi:
      "No-go nếu một level thiếu route học cho Vietnamese hoặc English learners.",
    risk_en:
      "No-go if one level lacks a learning route for Vietnamese or English learners.",
    sample: {
      gurmukhi: "A1 ਤੋਂ C2 ਤੱਕ ਰਾਹ ਹੈ।",
      romanization: "A1 ton C2 takk raah hai",
      vi: "Có lộ trình từ A1 đến C2.",
      en: "There is a path from A1 to C2.",
    },
    decision_targets: [
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "masteryCheckpoints",
      "finalCanDoIndex",
    ],
    decision_tags: ["a1-c2", "level-coverage", "learner-route"],
    learner_trap_vi:
      "A1-C2 coverage không phải official certification claim.",
    learner_trap_en:
      "A1-C2 coverage is not an official certification claim.",
  },
  {
    id: "go-no-go-script-coverage",
    area: "script_coverage",
    status: "go_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਸਕ੍ਰਿਪਟ",
    romanization: "Gurmukhi script",
    title_vi: "Chữ Gurmukhi",
    title_en: "Gurmukhi/script coverage",
    decision_vi:
      "Go khi Gurmukhi là primary script và romanization chỉ hỗ trợ khi hữu ích.",
    decision_en:
      "Go when Gurmukhi is primary and romanization only supports where useful.",
    risk_vi:
      "No-go nếu romanization thay Gurmukhi trong samples chính.",
    risk_en:
      "No-go if romanization replaces Gurmukhi in primary samples.",
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ ਹੈ।",
      romanization: "Gurmukhi pehlan hai",
      vi: "Gurmukhi đi trước.",
      en: "Gurmukhi comes first.",
    },
    decision_targets: [
      "normalize",
      "lessons",
      "lessons-a1",
      "skillDependencyGraph",
      "finalIntegrationGuardrails",
    ],
    decision_tags: ["gurmukhi-first", "script-coverage", "romanization-support"],
    learner_trap_vi:
      "Shahmukhi chỉ là awareness-only, không phải full course.",
    learner_trap_en:
      "Shahmukhi is awareness-only, not a full course.",
  },
  {
    id: "go-no-go-canada-survival",
    area: "canada_survival_coverage",
    status: "go_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਕੈਨੇਡਾ survival",
    romanization: "Canada survival",
    title_vi: "Sinh hoạt Canada",
    title_en: "Canada survival coverage",
    decision_vi:
      "Go khi clinic, school, transit, workplace, forms và public service có examples text-only.",
    decision_en:
      "Go when clinic, school, transit, workplace, forms, and public service have text-only examples.",
    risk_vi:
      "No-go nếu thiếu tình huống Canada-practical thiết yếu.",
    risk_en:
      "No-go if essential Canada-practical situations are missing.",
    sample: {
      gurmukhi: "ਮੈਨੂੰ appointment ਚਾਹੀਦੀ ਹੈ।",
      romanization: "mainu appointment chahidi hai",
      vi: "Tôi cần một cuộc hẹn.",
      en: "I need an appointment.",
    },
    decision_targets: [
      "dialogues",
      "contentIndex",
      "preIntegrationCoverageMap",
      "finalNavigationMap",
      "finalSmokeChecklist",
    ],
    decision_tags: ["canada-practical", "survival", "public-service"],
    canada_practical:
      "Use text-only appointment, clinic, school, workplace, transit, form, and public-service scenarios.",
    learner_trap_vi:
      "Canada-practical examples không phải tư vấn pháp lý hay y tế.",
    learner_trap_en:
      "Canada-practical examples are not legal or medical advice.",
  },
  {
    id: "go-no-go-remediation",
    area: "remediation_coverage",
    status: "go_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੀਮੀਡੀਏਸ਼ਨ",
    romanization: "remediation",
    title_vi: "Sửa lỗi",
    title_en: "Remediation coverage",
    decision_vi:
      "Go khi remediation có script confusion, postpositions, register, review và Canada-domain gaps.",
    decision_en:
      "Go when remediation covers script confusion, postpositions, register, review, and Canada-domain gaps.",
    risk_vi:
      "No-go nếu QA có thể phát hiện lỗi nhưng không có đường sửa.",
    risk_en:
      "No-go if QA can find errors but has no repair path.",
    sample: {
      gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰੋ।",
      romanization: "galti thik karo",
      vi: "Hãy sửa lỗi.",
      en: "Fix the error.",
    },
    decision_targets: [
      "skillDependencyGraph",
      "masteryCheckpoints",
      "finalCanDoIndex",
      "finalQualityGates",
      "finalIntegrationStabilityPlan",
    ],
    decision_tags: ["remediation", "learner-traps", "closure-validation"],
    learner_trap_vi:
      "Text-only remediation không tạo pronunciation scoring.",
    learner_trap_en:
      "Text-only remediation does not create pronunciation scoring.",
  },
  {
    id: "go-no-go-final-decision",
    area: "go_no_go_decision",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "go/no-go ਫੈਸਲਾ",
    romanization: "go/no-go faisla",
    title_vi: "Quyết định go/no-go",
    title_en: "Go/no-go decision",
    decision_vi:
      "Checklist này chỉ ghi quyết định pre-integration; không chạy A11 integration.",
    decision_en:
      "This checklist only records a pre-integration decision; it does not run A11 integration.",
    risk_vi:
      "No-go nếu wave này sửa integration wiring hoặc claim release thật.",
    risk_en:
      "No-go if this wave edits integration wiring or claims a real release.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ ਫੈਸਲਾ check ਹੈ।",
      romanization: "ih siraf faisla check hai",
      vi: "Đây chỉ là kiểm quyết định.",
      en: "This is only a decision check.",
    },
    decision_targets: [
      "finalIntegrationClosureChecklist",
      "finalReleaseCandidateChecklist",
      "finalA11ValidationChecklist",
      "finalCoverageVerificationPack",
    ],
    decision_tags: ["go-no-go", "release-candidate", "not-a11"],
    learner_trap_vi:
      "Go/no-go checklist không đồng nghĩa deploy, push hoặc integration thật.",
    learner_trap_en:
      "A go/no-go checklist does not mean real deployment, push, or integration.",
  },
  {
    id: "go-no-go-deferred-review",
    area: "deferred_review",
    status: "no_go_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ",
    romanization: "multavi samikhia",
    title_vi: "Review hoãn",
    title_en: "Deferred review",
    decision_vi:
      "Native review phải được ghi là deferred; không claim completion.",
    decision_en:
      "Native review is deferred; completion is not claimed.",
    risk_vi:
      "No-go nếu đổi thành approved hoặc native-reviewed.",
    risk_en:
      "No-go if this changes to approved or native-reviewed.",
    sample: {
      gurmukhi: "review ਅਜੇ ਬਾਕੀ ਹੈ।",
      romanization: "review aje baki hai",
      vi: "Review vẫn còn chờ.",
      en: "Review is still pending.",
    },
    decision_targets: [
      "preMrAuditChecklist",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
      "finalIntegrationRiskRegister",
    ],
    decision_tags: ["deferred-review", "native-review", "boundary"],
    learner_trap_vi:
      "Deferred không bao giờ nên được trình bày như đã hoàn tất.",
    learner_trap_en:
      "Deferred should never be presented as complete.",
    must_not_claim_vi: "Không claim native review hoặc completion đã xong.",
    must_not_claim_en: "Do not claim native review or completion is done.",
  },
  {
    id: "go-no-go-forbidden-claims",
    area: "forbidden_claim",
    status: "no_go_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾ claim ਕਰੋ",
    romanization: "na claim karo",
    title_vi: "Không claim",
    title_en: "Must not claim",
    decision_vi:
      "No-go nếu claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy hoặc A11 integration.",
    decision_en:
      "No-go if it claims audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy, or A11 integration.",
    risk_vi:
      "Claim sai làm checklist nói quá khả năng hệ thống.",
    risk_en:
      "A false claim makes the checklist overstate system capability.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ text ਹੈ।",
      romanization: "ih siraf text hai",
      vi: "Đây chỉ là text.",
      en: "This is text only.",
    },
    decision_targets: [
      "finalQualityGates",
      "finalSmokeChecklist",
      "finalReleaseCandidateChecklist",
      "finalIntegrationClosureChecklist",
    ],
    decision_tags: ["must-not-claim", "text-only", "no-a11-integration"],
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

export const PUNJABI_FINAL_GO_NO_GO_CHECKLIST_ROUTES = [
  {
    id: "go-no-go-route-readiness",
    vi: "Kiểm import readiness, export readiness và duplicate-risk checks.",
    en: "Check import readiness, export readiness, and duplicate-risk checks.",
    item_ids: [
      "go-no-go-import-readiness",
      "go-no-go-export-readiness",
      "go-no-go-duplicate-risk",
    ],
  },
  {
    id: "go-no-go-route-coverage",
    vi: "Kiểm A1-C2, Gurmukhi, Canada survival và remediation.",
    en: "Check A1-C2, Gurmukhi, Canada survival, and remediation.",
    item_ids: [
      "go-no-go-level-coverage",
      "go-no-go-script-coverage",
      "go-no-go-canada-survival",
      "go-no-go-remediation",
    ],
  },
  {
    id: "go-no-go-route-boundary",
    vi: "Kiểm go/no-go decision, native review deferred và forbidden claims.",
    en: "Check go/no-go decision, deferred native review, and forbidden claims.",
    item_ids: [
      "go-no-go-final-decision",
      "go-no-go-deferred-review",
      "go-no-go-forbidden-claims",
    ],
  },
];

export const PUNJABI_FINAL_GO_NO_GO_CHECKLIST_ROOT = {
  scope: PUNJABI_FINAL_GO_NO_GO_CHECKLIST_SCOPE,
  areas: PUNJABI_FINAL_GO_NO_GO_CHECKLIST_AREAS,
  decision_items: PUNJABI_FINAL_GO_NO_GO_CHECKLIST,
  routes: PUNJABI_FINAL_GO_NO_GO_CHECKLIST_ROUTES,
};

export default PUNJABI_FINAL_GO_NO_GO_CHECKLIST_ROOT;
