// src/languages/punjabi/finalAcceptanceChecklist.ts
//
// Wave 40 final acceptance checklist for Punjabi.
// This is pre-integration acceptance data for later A11 only. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalAcceptanceArea =
  | "module_family_readiness"
  | "import_export_expectations"
  | "duplicate_id_risk"
  | "level_coverage"
  | "script_coverage"
  | "canada_survival_coverage"
  | "remediation_coverage"
  | "acceptance_decision"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiFinalAcceptanceStatus =
  | "acceptable_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalAcceptanceItem = {
  id: string;
  area: PunjabiFinalAcceptanceArea;
  status: PunjabiFinalAcceptanceStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  acceptance_vi: string;
  acceptance_en: string;
  risk_vi: string;
  risk_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  acceptance_targets: string[];
  acceptance_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_ACCEPTANCE_CHECKLIST_SCOPE = {
  wave: "Wave 40",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  purpose_vi:
    "Final acceptance checklist này chỉ kiểm tra readiness trước later A11; nó không thực hiện integration.",
  purpose_en:
    "This final acceptance checklist only checks readiness before later A11; it does not perform integration.",
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

export const PUNJABI_FINAL_ACCEPTANCE_CHECKLIST_SCOPE_ALIAS =
  PUNJABI_FINAL_ACCEPTANCE_CHECKLIST_SCOPE;

export const PUNJABI_FINAL_ACCEPTANCE_CHECKLIST_AREAS: PunjabiFinalAcceptanceArea[] = [
  "module_family_readiness",
  "import_export_expectations",
  "duplicate_id_risk",
  "level_coverage",
  "script_coverage",
  "canada_survival_coverage",
  "remediation_coverage",
  "acceptance_decision",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_FINAL_ACCEPTANCE_CHECKLIST: PunjabiFinalAcceptanceItem[] = [
  {
    id: "accept-module-family-readiness",
    area: "module_family_readiness",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਤਿਆਰ",
    romanization: "module parivar tiar",
    title_vi: "Sẵn sàng nhóm module",
    title_en: "Module-family readiness",
    acceptance_vi:
      "Accept khi foundation, course map, coverage, QA và final checklists cùng mô tả một Punjabi module-family nhất quán.",
    acceptance_en:
      "Accept when foundation, course map, coverage, QA, and final checklists describe one consistent Punjabi module family.",
    risk_vi:
      "Không accept nếu một module đi lạc scope hoặc dùng naming khác pattern Punjabi.",
    risk_en:
      "Do not accept if a module drifts out of scope or uses naming outside the Punjabi pattern.",
    sample: {
      gurmukhi: "ਸਾਰੇ ਮੋਡੀਊਲ ਇਕੱਠੇ ਮਿਲਦੇ ਹਨ।",
      romanization: "sare module ikatthe milde han",
      vi: "Tất cả module khớp với nhau.",
      en: "All modules fit together.",
    },
    acceptance_targets: ["contentIndex", "finalContentManifest", "finalModuleRegistry"],
    acceptance_tags: ["module-family", "acceptance", "pre-integration"],
    learner_trap_vi: "Module-family readiness không có nghĩa later A11 đã chạy.",
    learner_trap_en: "Module-family readiness does not mean later A11 has run.",
  },
  {
    id: "accept-import-export-expectations",
    area: "import_export_expectations",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ export ਉਮੀਦਾਂ",
    romanization: "import export umidan",
    title_vi: "Kỳ vọng import/export",
    title_en: "Import/export expectations",
    acceptance_vi:
      "Accept khi named exports, default exports, expected imports và route labels có đường kiểm rõ ràng.",
    acceptance_en:
      "Accept when named exports, default exports, expected imports, and route labels have a clear check path.",
    risk_vi: "Import/export drift có thể làm later A11 nối sai dữ liệu.",
    risk_en: "Import/export drift can make later A11 wire the wrong data.",
    sample: {
      gurmukhi: "ਇੰਪੋਰਟ ਤੇ export ਸਾਫ਼ ਹਨ।",
      romanization: "import te export saf han",
      vi: "Import và export rõ ràng.",
      en: "Imports and exports are clear.",
    },
    acceptance_targets: ["finalImportReadinessMap", "finalExportReadiness", "finalShipCandidateChecklist"],
    acceptance_tags: ["import", "export", "readiness"],
    learner_trap_vi: "Tên file đẹp không thay thế export identifier ổn định.",
    learner_trap_en: "A neat file name does not replace a stable export identifier.",
  },
  {
    id: "accept-duplicate-id-risk",
    area: "duplicate_id_risk",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ID ਖ਼ਤਰਾ",
    romanization: "duplicate ID khatra",
    title_vi: "Rủi ro trùng ID",
    title_en: "Duplicate-ID risk",
    acceptance_vi:
      "Accept khi item IDs, route IDs, module IDs và acceptance IDs không trùng.",
    acceptance_en:
      "Accept when item IDs, route IDs, module IDs, and acceptance IDs are not duplicated.",
    risk_vi: "ID trùng có thể ghi đè route hoặc checklist item.",
    risk_en: "Duplicate IDs can overwrite a route or checklist item.",
    sample: {
      gurmukhi: "ਹਰ ID ਵੱਖਰੀ ਰਹੇ।",
      romanization: "har ID vakhri rahe",
      vi: "Mỗi ID phải riêng.",
      en: "Every ID should stay distinct.",
    },
    acceptance_targets: ["finalModuleRegistry", "finalContentManifest", "finalGoNoGoChecklist"],
    acceptance_tags: ["duplicate-risk", "ids", "registry"],
    learner_trap_vi: "Cùng topic không luôn là duplicate; phải so full ID.",
    learner_trap_en: "The same topic is not always a duplicate; compare the full ID.",
  },
  {
    id: "accept-level-coverage",
    area: "level_coverage",
    status: "acceptable_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1-C2 ਰਾਹ",
    romanization: "A1-C2 raah",
    title_vi: "Lộ trình A1-C2",
    title_en: "A1-C2 coverage",
    acceptance_vi:
      "Accept khi A1-C2 có goals, learning path, can-do checks, QA và remediation markers.",
    acceptance_en:
      "Accept when A1-C2 has goals, a learning path, can-do checks, QA, and remediation markers.",
    risk_vi: "Thiếu level làm learner route bị đứt cho Vietnamese hoặc English learners.",
    risk_en: "A missing level breaks the learner route for Vietnamese or English learners.",
    sample: {
      gurmukhi: "A1 ਤੋਂ C2 ਤੱਕ ਰਾਹ ਹੈ।",
      romanization: "A1 ton C2 takk raah hai",
      vi: "Có lộ trình từ A1 đến C2.",
      en: "There is a path from A1 to C2.",
    },
    acceptance_targets: ["courseMap", "learningPath", "progressionMatrix", "finalCanDoIndex"],
    acceptance_tags: ["a1-c2", "coverage", "learner-route"],
    learner_trap_vi: "A1-C2 coverage không phải official certification claim.",
    learner_trap_en: "A1-C2 coverage is not an official certification claim.",
  },
  {
    id: "accept-script-coverage",
    area: "script_coverage",
    status: "acceptable_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ",
    romanization: "Gurmukhi pehlan",
    title_vi: "Gurmukhi trước",
    title_en: "Gurmukhi/script coverage",
    acceptance_vi:
      "Accept khi Gurmukhi là primary script và romanization chỉ hỗ trợ khi hữu ích.",
    acceptance_en:
      "Accept when Gurmukhi is the primary script and romanization only supports where useful.",
    risk_vi: "Không accept nếu romanization thay thế Gurmukhi trong sample chính.",
    risk_en: "Do not accept if romanization replaces Gurmukhi in primary samples.",
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ ਹੈ।",
      romanization: "Gurmukhi pehlan hai",
      vi: "Gurmukhi đi trước.",
      en: "Gurmukhi comes first.",
    },
    acceptance_targets: ["normalize", "lessons", "lessons-a1", "skillDependencyGraph"],
    acceptance_tags: ["gurmukhi-first", "script", "romanization"],
    learner_trap_vi: "Shahmukhi chỉ là awareness-only, không phải full course.",
    learner_trap_en: "Shahmukhi is awareness-only, not a full course.",
  },
  {
    id: "accept-canada-survival",
    area: "canada_survival_coverage",
    status: "acceptable_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਕੈਨੇਡਾ ਕੰਮਕਾਜ",
    romanization: "Canada kamkaj",
    title_vi: "Sinh hoạt Canada",
    title_en: "Canada survival coverage",
    acceptance_vi:
      "Accept khi clinic, school, transit, workplace, forms và public-service examples được giữ text-only.",
    acceptance_en:
      "Accept when clinic, school, transit, workplace, forms, and public-service examples stay text-only.",
    risk_vi: "Thiếu Canada coverage làm module kém thực dụng cho người học ở Canada.",
    risk_en: "Missing Canada coverage makes the module less practical for learners in Canada.",
    sample: {
      gurmukhi: "ਮੈਨੂੰ ਬੱਸ ਪਾਸ ਚਾਹੀਦਾ ਹੈ।",
      romanization: "mainu bus pass chahida hai",
      vi: "Tôi cần thẻ xe buýt.",
      en: "I need a bus pass.",
    },
    acceptance_targets: ["dialogues", "contentIndex", "preIntegrationCoverageMap", "finalNavigationMap"],
    acceptance_tags: ["canada-practical", "survival", "public-service"],
    canada_practical:
      "Use text-only examples for appointments, school forms, transit passes, workplace scheduling, and public services.",
    learner_trap_vi: "Ví dụ Canada-practical không phải tư vấn pháp lý hay y tế.",
    learner_trap_en: "Canada-practical examples are not legal or medical advice.",
  },
  {
    id: "accept-remediation-coverage",
    area: "remediation_coverage",
    status: "acceptable_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗਲਤੀ ਸੁਧਾਰ",
    romanization: "galti sudhar",
    title_vi: "Sửa lỗi",
    title_en: "Remediation coverage",
    acceptance_vi:
      "Accept khi script confusion, postpositions, register, review gaps và Canada-domain gaps có remediation path.",
    acceptance_en:
      "Accept when script confusion, postpositions, register, review gaps, and Canada-domain gaps have a remediation path.",
    risk_vi: "Không accept nếu QA tìm lỗi nhưng không có đường sửa.",
    risk_en: "Do not accept if QA finds an issue without a repair path.",
    sample: {
      gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰੋ।",
      romanization: "galti thik karo",
      vi: "Hãy sửa lỗi.",
      en: "Fix the error.",
    },
    acceptance_targets: ["skillDependencyGraph", "masteryCheckpoints", "finalQualityGates", "finalQaInventory"],
    acceptance_tags: ["remediation", "learner-traps", "quality"],
    learner_trap_vi: "Text-only remediation không tạo pronunciation scoring.",
    learner_trap_en: "Text-only remediation does not create pronunciation scoring.",
  },
  {
    id: "accept-decision-boundary",
    area: "acceptance_decision",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "acceptance ਫ਼ੈਸਲਾ",
    romanization: "acceptance faisla",
    title_vi: "Quyết định acceptance",
    title_en: "Acceptance ship/go decision",
    acceptance_vi:
      "Acceptance chỉ là pre-integration decision; không chạy A11 integration, push hoặc deploy.",
    acceptance_en:
      "Acceptance is only a pre-integration ship-candidate go decision; it does not run A11 integration, push, or deploy.",
    risk_vi: "Không accept nếu wave này sửa integration wiring hoặc claim release thật.",
    risk_en: "Do not accept if this wave edits integration wiring or claims a real release.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ acceptance check ਹੈ।",
      romanization: "ih siraf acceptance check hai",
      vi: "Đây chỉ là kiểm acceptance.",
      en: "This is only an acceptance check.",
    },
    acceptance_targets: ["finalReleaseCandidateChecklist", "finalGoNoGoChecklist", "finalShipCandidateChecklist"],
    acceptance_tags: ["acceptance", "ship-candidate", "not-a11"],
    learner_trap_vi: "Acceptance checklist không đồng nghĩa deploy, push hoặc integration thật.",
    learner_trap_en: "An acceptance checklist does not mean real deployment, push, or integration.",
  },
  {
    id: "accept-deferred-native-review",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ review",
    romanization: "multavi review",
    title_vi: "Review hoãn",
    title_en: "Deferred native review",
    acceptance_vi:
      "Accept only if native review remains deferred and completion is not claimed.",
    acceptance_en:
      "Accept only if native review is deferred and completion is not claimed.",
    risk_vi: "Không accept nếu wording nói approved hoặc native-reviewed.",
    risk_en: "Do not accept if wording says approved or native-reviewed.",
    sample: {
      gurmukhi: "review ਅਜੇ ਬਾਕੀ ਹੈ।",
      romanization: "review aje baki hai",
      vi: "Review vẫn còn chờ.",
      en: "Review is still pending.",
    },
    acceptance_targets: ["finalOwnerReviewPacket", "finalIntegrationEvidenceMap", "finalPreIntegrationSummary"],
    acceptance_tags: ["native-review", "deferred", "boundary"],
    learner_trap_vi: "Deferred không bao giờ nên được trình bày như đã hoàn tất.",
    learner_trap_en: "Deferred should never be presented as complete.",
    must_not_claim_vi: "Không claim native review hoặc completion đã xong.",
    must_not_claim_en: "Do not claim native review or completion is done.",
  },
  {
    id: "accept-forbidden-claims",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾ claim ਕਰੋ",
    romanization: "na claim karo",
    title_vi: "Không claim",
    title_en: "Forbidden claims",
    acceptance_vi:
      "Không claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy hoặc A11 integration.",
    acceptance_en:
      "Do not claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy, or A11 integration.",
    risk_vi: "Claim sai làm acceptance checklist nói quá khả năng hệ thống.",
    risk_en: "A false claim makes the acceptance checklist overstate system capability.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ text ਹੈ।",
      romanization: "ih siraf text hai",
      vi: "Đây chỉ là text.",
      en: "This is text only.",
    },
    acceptance_targets: ["finalQualityGates", "finalSmokeChecklist", "finalGoNoGoChecklist"],
    acceptance_tags: ["must-not-claim", "text-only", "no-a11-integration"],
    learner_trap_vi: "Text-only data không tự sinh audio, scoring, deploy hay push.",
    learner_trap_en: "Text-only data does not create audio, scoring, deploy, or push.",
    must_not_claim_vi:
      "Không claim audio, scoring, Azure, Supabase, deploy, push hoặc A11 integration.",
    must_not_claim_en:
      "Do not claim audio, pronunciation scoring, Azure, Supabase, deploy, push, or A11 integration; this is not A11 integration and no A11 integration runs here.",
  },
];

export const PUNJABI_FINAL_ACCEPTANCE_CHECKLIST_ROUTES = [
  {
    id: "accept-route-readiness",
    vi: "Kiểm module-family readiness, import/export expectations và duplicate-ID risk.",
    en: "Check module-family readiness, import/export expectations, and duplicate-ID risk.",
    item_ids: [
      "accept-module-family-readiness",
      "accept-import-export-expectations",
      "accept-duplicate-id-risk",
    ],
  },
  {
    id: "accept-route-coverage",
    vi: "Kiểm A1-C2, Gurmukhi, Canada survival và remediation.",
    en: "Check A1-C2, Gurmukhi, Canada survival, and remediation.",
    item_ids: [
      "accept-level-coverage",
      "accept-script-coverage",
      "accept-canada-survival",
      "accept-remediation-coverage",
    ],
  },
  {
    id: "accept-route-boundary",
    vi: "Kiểm acceptance decision, native review deferred và forbidden claims.",
    en: "Check acceptance decision, deferred native review, and forbidden claims.",
    item_ids: [
      "accept-decision-boundary",
      "accept-deferred-native-review",
      "accept-forbidden-claims",
    ],
  },
];

export const PUNJABI_FINAL_ACCEPTANCE_CHECKLIST_ROOT = {
  scope: PUNJABI_FINAL_ACCEPTANCE_CHECKLIST_SCOPE,
  areas: PUNJABI_FINAL_ACCEPTANCE_CHECKLIST_AREAS,
  acceptance_items: PUNJABI_FINAL_ACCEPTANCE_CHECKLIST,
  routes: PUNJABI_FINAL_ACCEPTANCE_CHECKLIST_ROUTES,
};

export default PUNJABI_FINAL_ACCEPTANCE_CHECKLIST_ROOT;
