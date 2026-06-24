// src/languages/punjabi/finalShipCandidateChecklist.ts
//
// Wave 39 final ship-candidate checklist for Punjabi.
// This is pre-integration ship-candidate data for later A11 only. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalShipCandidateArea =
  | "import_export_readiness"
  | "naming_consistency"
  | "duplicate_risk_checks"
  | "level_coverage"
  | "script_coverage"
  | "canada_survival_coverage"
  | "remediation_coverage"
  | "ship_candidate_decision"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiFinalShipCandidateStatus =
  | "ready_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalShipCandidateItem = {
  id: string;
  area: PunjabiFinalShipCandidateArea;
  status: PunjabiFinalShipCandidateStatus;
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
  ship_targets: string[];
  ship_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_SHIP_CANDIDATE_CHECKLIST_SCOPE = {
  wave: "Wave 39",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  purpose_vi:
    "Final ship-candidate checklist này chỉ kiểm tra trước later A11; nó không thực hiện integration.",
  purpose_en:
    "This final ship-candidate checklist only checks readiness before later A11; it does not perform integration.",
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

export const PUNJABI_FINAL_SHIP_CANDIDATE_CHECKLIST_SCOPE_ALIAS =
  PUNJABI_FINAL_SHIP_CANDIDATE_CHECKLIST_SCOPE;

export const PUNJABI_FINAL_SHIP_CANDIDATE_CHECKLIST_AREAS: PunjabiFinalShipCandidateArea[] = [
  "import_export_readiness",
  "naming_consistency",
  "duplicate_risk_checks",
  "level_coverage",
  "script_coverage",
  "canada_survival_coverage",
  "remediation_coverage",
  "ship_candidate_decision",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_FINAL_SHIP_CANDIDATE_CHECKLIST: PunjabiFinalShipCandidateItem[] = [
  {
    id: "ship-import-export-readiness",
    area: "import_export_readiness",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ export ਤਿਆਰੀ",
    romanization: "import export tiari",
    title_vi: "Sẵn sàng import/export",
    title_en: "Import/export readiness",
    check_vi: "Kiểm expected imports, named exports, default exports và route labels trước later A11.",
    check_en: "Check expected imports, named exports, default exports, and route labels before later A11.",
    risk_vi: "Ship candidate phải dừng nếu import hoặc export bị thiếu.",
    risk_en: "The ship candidate should stop if an import or export is missing.",
    sample: {
      gurmukhi: "ਇੰਪੋਰਟ ਤੇ export ਮਿਲਦੇ ਹਨ।",
      romanization: "import te export milde han",
      vi: "Import và export khớp.",
      en: "Imports and exports match.",
    },
    ship_targets: ["finalImportReadinessMap", "finalExportReadiness", "finalGoNoGoChecklist"],
    ship_tags: ["import-readiness", "export-readiness", "ship-candidate"],
    learner_trap_vi: "Readiness không có nghĩa integration đã chạy.",
    learner_trap_en: "Readiness does not mean integration has run.",
  },
  {
    id: "ship-naming-consistency",
    area: "naming_consistency",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਂ ਇਕਸਾਰਤਾ",
    romanization: "naam iksarta",
    title_vi: "Nhất quán tên",
    title_en: "Naming consistency",
    check_vi: "Kiểm file names, item IDs, route IDs và export names theo cùng pattern Punjabi.",
    check_en: "Check file names, item IDs, route IDs, and export names against one Punjabi pattern.",
    risk_vi: "Tên lệch có thể làm later A11 import nhầm module.",
    risk_en: "Naming drift can make later A11 import the wrong module.",
    sample: {
      gurmukhi: "ਨਾਂ ਇਕਸਾਰ ਰੱਖੋ।",
      romanization: "naam iksar rakho",
      vi: "Giữ tên nhất quán.",
      en: "Keep names consistent.",
    },
    ship_targets: ["finalReleaseCandidateChecklist", "finalGoNoGoChecklist", "finalCoverageVerificationPack"],
    ship_tags: ["naming", "consistency", "release-candidate"],
    learner_trap_vi: "Tên hiển thị không thay thế export identifier rõ ràng.",
    learner_trap_en: "A display name does not replace a clear export identifier.",
  },
  {
    id: "ship-duplicate-risk",
    area: "duplicate_risk_checks",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ਖ਼ਤਰਾ",
    romanization: "duplicate khatra",
    title_vi: "Rủi ro trùng",
    title_en: "Duplicate-risk checks",
    check_vi: "Kiểm item IDs, route IDs, module IDs và export names không trùng.",
    check_en: "Check item IDs, route IDs, module IDs, and export names are not duplicated.",
    risk_vi: "ID trùng có thể làm registry ghi đè sai mục.",
    risk_en: "Duplicate IDs can make a registry overwrite the wrong item.",
    sample: {
      gurmukhi: "ਹਰ ID ਵੱਖਰੀ ਹੈ।",
      romanization: "har ID vakhri hai",
      vi: "Mỗi ID khác nhau.",
      en: "Every ID is different.",
    },
    ship_targets: ["finalModuleRegistry", "finalContentManifest", "finalIntegrationRiskRegister"],
    ship_tags: ["duplicate-risk", "one-owner", "go-no-go"],
    learner_trap_vi: "Cùng topic không luôn là duplicate; phải so full ID.",
    learner_trap_en: "The same topic is not always a duplicate; compare the full ID.",
  },
  {
    id: "ship-level-coverage",
    area: "level_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1-C2 ਕਵਰੇਜ",
    romanization: "A1-C2 coverage",
    title_vi: "Phủ A1-C2",
    title_en: "A1-C2 coverage",
    check_vi: "Kiểm A1-C2 có goals, lessons, can-do, review và QA markers.",
    check_en: "Check A1-C2 has goals, lessons, can-do items, review, and QA markers.",
    risk_vi: "Thiếu level làm route học bị đứt.",
    risk_en: "A missing level breaks the learning route.",
    sample: {
      gurmukhi: "A1 ਤੋਂ C2 ਤੱਕ ਰਾਹ ਹੈ।",
      romanization: "A1 ton C2 takk raah hai",
      vi: "Có lộ trình từ A1 đến C2.",
      en: "There is a path from A1 to C2.",
    },
    ship_targets: ["courseMap", "learningPath", "progressionMatrix", "masteryCheckpoints"],
    ship_tags: ["a1-c2", "level-coverage", "learner-route"],
    learner_trap_vi: "A1-C2 coverage không phải official certification claim.",
    learner_trap_en: "A1-C2 coverage is not an official certification claim.",
  },
  {
    id: "ship-script-coverage",
    area: "script_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਸਕ੍ਰਿਪਟ",
    romanization: "Gurmukhi script",
    title_vi: "Chữ Gurmukhi",
    title_en: "Gurmukhi/script coverage",
    check_vi: "Kiểm Gurmukhi là primary script và romanization chỉ hỗ trợ khi hữu ích.",
    check_en: "Check Gurmukhi is primary and romanization only supports where useful.",
    risk_vi: "Không ship nếu romanization thay Gurmukhi trong samples chính.",
    risk_en: "Do not ship if romanization replaces Gurmukhi in primary samples.",
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ ਹੈ।",
      romanization: "Gurmukhi pehlan hai",
      vi: "Gurmukhi đi trước.",
      en: "Gurmukhi comes first.",
    },
    ship_targets: ["normalize", "lessons", "lessons-a1", "skillDependencyGraph"],
    ship_tags: ["gurmukhi-first", "script-coverage", "romanization-support"],
    learner_trap_vi: "Shahmukhi chỉ là awareness-only, không phải full course.",
    learner_trap_en: "Shahmukhi is awareness-only, not a full course.",
  },
  {
    id: "ship-canada-survival",
    area: "canada_survival_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਕੈਨੇਡਾ survival",
    romanization: "Canada survival",
    title_vi: "Sinh hoạt Canada",
    title_en: "Canada survival coverage",
    check_vi: "Kiểm clinic, school, transit, workplace, forms và public service có examples text-only.",
    check_en: "Check clinic, school, transit, workplace, forms, and public service have text-only examples.",
    risk_vi: "Thiếu Canada survival làm nội dung kém thực dụng.",
    risk_en: "Missing Canada survival makes the content less practical.",
    sample: {
      gurmukhi: "ਮੈਨੂੰ ਫਾਰਮ ਭਰਨਾ ਹੈ।",
      romanization: "mainu form bharna hai",
      vi: "Tôi cần điền mẫu.",
      en: "I need to fill out a form.",
    },
    ship_targets: ["dialogues", "contentIndex", "preIntegrationCoverageMap", "finalNavigationMap"],
    ship_tags: ["canada-practical", "survival", "public-service"],
    canada_practical: "Use text-only appointment, clinic, school, transit, form, and public-service scenarios.",
    learner_trap_vi: "Canada-practical examples không phải tư vấn pháp lý hay y tế.",
    learner_trap_en: "Canada-practical examples are not legal or medical advice.",
  },
  {
    id: "ship-remediation",
    area: "remediation_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੀਮੀਡੀਏਸ਼ਨ",
    romanization: "remediation",
    title_vi: "Sửa lỗi",
    title_en: "Remediation coverage",
    check_vi: "Kiểm remediation cho script confusion, postpositions, register, review và Canada-domain gaps.",
    check_en: "Check remediation for script confusion, postpositions, register, review, and Canada-domain gaps.",
    risk_vi: "Không ship nếu QA có lỗi nhưng không có đường sửa.",
    risk_en: "Do not ship if QA has errors without repair paths.",
    sample: {
      gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰੋ।",
      romanization: "galti thik karo",
      vi: "Hãy sửa lỗi.",
      en: "Fix the error.",
    },
    ship_targets: ["skillDependencyGraph", "masteryCheckpoints", "finalCanDoIndex", "finalQualityGates"],
    ship_tags: ["remediation", "learner-traps", "go-no-go"],
    learner_trap_vi: "Text-only remediation không tạo pronunciation scoring.",
    learner_trap_en: "Text-only remediation does not create pronunciation scoring.",
  },
  {
    id: "ship-candidate-boundary",
    area: "ship_candidate_decision",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ship candidate ਜਾਂਚ",
    romanization: "ship candidate janch",
    title_vi: "Kiểm ship candidate",
    title_en: "Ship-candidate decision",
    check_vi: "Checklist này chỉ kiểm ship-candidate targets; không chạy A11 integration.",
    check_en: "This checklist only checks ship-candidate targets; it does not run A11 integration.",
    risk_vi: "Không ship nếu wave này sửa integration wiring hoặc claim release thật.",
    risk_en: "Do not ship if this wave edits integration wiring or claims a real release.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ ship check ਹੈ।",
      romanization: "ih siraf ship check hai",
      vi: "Đây chỉ là kiểm ship.",
      en: "This is only a ship check.",
    },
    ship_targets: ["finalReleaseCandidateChecklist", "finalGoNoGoChecklist", "finalIntegrationClosureChecklist"],
    ship_tags: ["ship-candidate", "go-no-go", "not-a11"],
    learner_trap_vi: "Ship candidate checklist không đồng nghĩa deploy, push hoặc integration thật.",
    learner_trap_en: "A ship-candidate checklist does not mean real deployment, push, or integration.",
  },
  {
    id: "ship-deferred-review",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ",
    romanization: "multavi samikhia",
    title_vi: "Review hoãn",
    title_en: "Deferred review",
    check_vi: "Native review phải được ghi là deferred; không claim completion.",
    check_en: "Native review is deferred; completion is not claimed.",
    risk_vi: "Không ship nếu đổi thành approved hoặc native-reviewed.",
    risk_en: "Do not ship if this changes to approved or native-reviewed.",
    sample: {
      gurmukhi: "review ਅਜੇ ਬਾਕੀ ਹੈ।",
      romanization: "review aje baki hai",
      vi: "Review vẫn còn chờ.",
      en: "Review is still pending.",
    },
    ship_targets: ["finalIntegrationEvidenceMap", "finalPreIntegrationSummary", "finalOwnerReviewPacket"],
    ship_tags: ["deferred-review", "native-review", "boundary"],
    learner_trap_vi: "Deferred không bao giờ nên được trình bày như đã hoàn tất.",
    learner_trap_en: "Deferred should never be presented as complete.",
    must_not_claim_vi: "Không claim native review hoặc completion đã xong.",
    must_not_claim_en: "Do not claim native review or completion is done.",
  },
  {
    id: "ship-forbidden-claims",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾ claim ਕਰੋ",
    romanization: "na claim karo",
    title_vi: "Không claim",
    title_en: "Must not claim",
    check_vi: "Không claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy hoặc A11 integration.",
    check_en: "Do not claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy, or A11 integration.",
    risk_vi: "Claim sai làm checklist nói quá khả năng hệ thống.",
    risk_en: "A false claim makes the checklist overstate system capability.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ text ਹੈ।",
      romanization: "ih siraf text hai",
      vi: "Đây chỉ là text.",
      en: "This is text only.",
    },
    ship_targets: ["finalQualityGates", "finalSmokeChecklist", "finalGoNoGoChecklist"],
    ship_tags: ["must-not-claim", "text-only", "no-a11-integration"],
    learner_trap_vi: "Text-only data không tự sinh audio, scoring, deploy hay push.",
    learner_trap_en: "Text-only data does not create audio, scoring, deploy, or push.",
    must_not_claim_vi: "Không claim audio, scoring, Azure, Supabase, deploy, push hoặc A11 integration.",
    must_not_claim_en:
      "Do not claim audio, pronunciation scoring, Azure, Supabase, deploy, push, or A11 integration; this is not A11 integration and no A11 integration runs here.",
  },
];

export const PUNJABI_FINAL_SHIP_CANDIDATE_CHECKLIST_ROUTES = [
  {
    id: "ship-route-readiness",
    vi: "Kiểm import/export readiness, naming consistency và duplicate-risk checks.",
    en: "Check import/export readiness, naming consistency, and duplicate-risk checks.",
    item_ids: ["ship-import-export-readiness", "ship-naming-consistency", "ship-duplicate-risk"],
  },
  {
    id: "ship-route-coverage",
    vi: "Kiểm A1-C2, Gurmukhi, Canada survival và remediation.",
    en: "Check A1-C2, Gurmukhi, Canada survival, and remediation.",
    item_ids: ["ship-level-coverage", "ship-script-coverage", "ship-canada-survival", "ship-remediation"],
  },
  {
    id: "ship-route-boundary",
    vi: "Kiểm ship candidate boundary, native review deferred và forbidden claims.",
    en: "Check ship-candidate boundary, deferred native review, and forbidden claims.",
    item_ids: ["ship-candidate-boundary", "ship-deferred-review", "ship-forbidden-claims"],
  },
];

export const PUNJABI_FINAL_SHIP_CANDIDATE_CHECKLIST_ROOT = {
  scope: PUNJABI_FINAL_SHIP_CANDIDATE_CHECKLIST_SCOPE,
  areas: PUNJABI_FINAL_SHIP_CANDIDATE_CHECKLIST_AREAS,
  ship_items: PUNJABI_FINAL_SHIP_CANDIDATE_CHECKLIST,
  routes: PUNJABI_FINAL_SHIP_CANDIDATE_CHECKLIST_ROUTES,
};

export default PUNJABI_FINAL_SHIP_CANDIDATE_CHECKLIST_ROOT;
