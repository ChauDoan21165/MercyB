// src/languages/punjabi/finalPreMergeChecklist.ts
//
// Wave 49 pre-merge checklist for Punjabi.
// This is pre-integration pre-merge data for later A11 only. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalPreMergeChecklistArea =
  | "module_family_completeness"
  | "import_export_expectations"
  | "naming_consistency"
  | "duplicate_id_risk"
  | "level_coverage"
  | "script_coverage"
  | "canada_survival_coverage"
  | "remediation_coverage"
  | "pre_merge_decision"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiFinalPreMergeChecklistStatus =
  | "ready_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalPreMergeChecklistItem = {
  id: string;
  area: PunjabiFinalPreMergeChecklistArea;
  status: PunjabiFinalPreMergeChecklistStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  merge_vi: string;
  merge_en: string;
  risk_vi: string;
  risk_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  merge_targets: string[];
  merge_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_PRE_MERGE_CHECKLIST_SCOPE = {
  wave: "Wave 49",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  purpose_vi:
    "Pre-merge checklist này chỉ ghi check readiness trước later A11; nó không thực hiện integration.",
  purpose_en:
    "This pre-merge checklist only documents readiness check before later A11; it does not perform integration.",
  script_note_vi:
    "Gurmukhi là chữ chính. Shahmukhi chỉ là awareness-only, không phải full course.",
  script_note_en:
    "Gurmukhi is the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã hoàn tất.",
  native_review_en: "Native review is deferred; native review is deferred and completion is not claimed.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI config, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, or deploy.",
};

export const PUNJABI_FINAL_PRE_MERGE_CHECKLIST_SCOPE_ALIAS =
  PUNJABI_FINAL_PRE_MERGE_CHECKLIST_SCOPE;

export const PUNJABI_FINAL_PRE_MERGE_CHECKLIST_AREAS: PunjabiFinalPreMergeChecklistArea[] = [
  "module_family_completeness",
  "import_export_expectations",
  "naming_consistency",
  "duplicate_id_risk",
  "level_coverage",
  "script_coverage",
  "canada_survival_coverage",
  "remediation_coverage",
  "pre_merge_decision",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_FINAL_PRE_MERGE_CHECKLIST: PunjabiFinalPreMergeChecklistItem[] = [
  {
    id: "pre-merge-module-family-completeness",
    area: "module_family_completeness",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਚੈਕ",
    romanization: "module parivar check",
    title_vi: "Check đầy đủ nhóm module",
    title_en: "Module-family completeness",
    merge_vi:
      "Check khi foundation, learning path, coverage, QA, owner-acceptance và final-acceptance cùng khớp một Punjabi module-family cho pre-merge.",
    merge_en:
      "Check when foundation, learning path, coverage, QA, owner-acceptance, and final-acceptance align as one Punjabi module family for pre-merge, pre-a11-checksum, runner-readiness, pipeline-readiness, pre-integration, ci-readiness, mr-readiness, final-freeze, and final-lock.",
    risk_vi: "Không mark ready nếu module nào còn lệch scope, tên hoặc owner expectation.",
    risk_en: "Do not mark ready if any module still drifts in scope, naming, or owner expectation.",
    sample: {
      gurmukhi: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਚੈਕ ਹੋ ਗਿਆ ਹੈ।",
      romanization: "module parivar check ho gaya hai",
      vi: "Nhóm module đã được kiểm tra.",
      en: "The module family has been checked.",
    },
    merge_targets: ["contentIndex", "finalModuleRegistry", "finalOwnerAcceptanceChecklist"],
    merge_tags: ["module-family", "pre-merge", "pre-a11-checksum", "pre-integration"],
    learner_trap_vi: "Pre-merge readiness không có nghĩa later A11 đã chạy.",
    learner_trap_en: "Pre-merge readiness does not mean later A11 has run.",
  },
  {
    id: "pre-merge-import-export-expectations",
    area: "import_export_expectations",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ export ਚੈਕ",
    romanization: "import export check",
    title_vi: "Check import/export",
    title_en: "Import/export expectations",
    merge_vi:
      "Check khi named exports, default exports, expected imports và route labels có checklist rõ.",
    merge_en:
      "Check when named exports, default exports, expected imports, and route labels have a clear checklist.",
    risk_vi: "Import/export drift có thể làm later A11 nối sai dữ liệu.",
    risk_en: "Import/export drift can make later A11 wire the wrong data.",
    sample: {
      gurmukhi: "ਇੰਪੋਰਟ ਤੇ export ਚੈਕ ਹਨ।",
      romanization: "import te export check han",
      vi: "Import và export được kiểm tra.",
      en: "Imports and exports are checked.",
    },
    merge_targets: ["finalImportReadinessMap", "finalExportReadiness", "finalAcceptanceChecklist"],
    merge_tags: ["import", "export", "pre-merge", "final-lock"],
    learner_trap_vi: "Tên hiển thị không thay thế export identifier ổn định.",
    learner_trap_en: "A display name does not replace a stable export identifier.",
  },
  {
    id: "pre-merge-naming-consistency",
    area: "naming_consistency",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਂ ਇਕਸਾਰਤਾ ਚੈਕ",
    romanization: "naam iksarta check",
    title_vi: "Check nhất quán tên",
    title_en: "Naming consistency",
    merge_vi:
      "Check khi file names, export names, route IDs, item IDs và display labels dùng cùng Punjabi naming pattern.",
    merge_en:
      "Check when file names, export names, route IDs, item IDs, and display labels use the same Punjabi naming pattern.",
    risk_vi: "Naming drift có thể làm later A11 import nhầm module hoặc route.",
    risk_en: "Naming drift can make later A11 import the wrong module or route.",
    sample: {
      gurmukhi: "ਨਾਂ ਇਕਸਾਰ ਰੱਖੋ।",
      romanization: "naam iksar rakho",
      vi: "Giữ tên nhất quán.",
      en: "Keep names consistent.",
    },
    merge_targets: ["finalLockChecklist", "finalOwnerAcceptanceChecklist", "finalAcceptanceChecklist"],
    merge_tags: ["naming", "consistency", "pre-merge", "final-freeze"],
    learner_trap_vi: "Tên gần giống không đủ; route ID và export name phải khớp rõ.",
    learner_trap_en: "A similar-looking name is not enough; route IDs and export names need clear alignment.",
  },
  {
    id: "pre-merge-duplicate-id-risk",
    area: "duplicate_id_risk",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ID ਚੈਕ",
    romanization: "duplicate ID check",
    title_vi: "Check rủi ro trùng ID",
    title_en: "Duplicate-ID risk",
    merge_vi: "Check khi item IDs, route IDs, module IDs và check IDs không trùng.",
    merge_en: "Check when item IDs, route IDs, module IDs, and check IDs are not duplicated.",
    risk_vi: "ID trùng có thể làm registry ghi đè sai item hoặc route.",
    risk_en: "Duplicate IDs can make a registry overwrite the wrong item or route.",
    sample: {
      gurmukhi: "ਹਰ ID ਵੱਖਰੀ ਰਹੇ।",
      romanization: "har ID vakhri rahe",
      vi: "Mỗi ID phải riêng.",
      en: "Every ID should stay distinct.",
    },
    merge_targets: ["finalModuleRegistry", "finalContentManifest", "finalGoNoGoChecklist"],
    merge_tags: ["duplicate-risk", "ids", "registry", "pre-merge"],
    learner_trap_vi: "Cùng topic không luôn là duplicate; phải so full ID.",
    learner_trap_en: "The same topic is not always a duplicate; compare the full ID.",
  },
  {
    id: "pre-merge-level-coverage",
    area: "level_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1-C2 ਚੈਕ",
    romanization: "A1-C2 check",
    title_vi: "Check A1-C2",
    title_en: "A1-C2 coverage",
    merge_vi:
      "Check khi A1-C2 có goals, lessons, can-do, QA, review và remediation markers cho Vietnamese và English learners.",
    merge_en:
      "Check when A1-C2 has goals, lessons, can-do items, QA, review, and remediation markers for Vietnamese and English learners.",
    risk_vi: "Thiếu level làm learner route bị đứt.",
    risk_en: "A missing level breaks the learner route.",
    sample: {
      gurmukhi: "A1 ਤੋਂ C2 ਤੱਕ ਰਾਹ ਚੈਕ ਹੈ।",
      romanization: "A1 ton C2 takk raah check hai",
      vi: "Lộ trình từ A1 đến C2 có kiểm tra.",
      en: "The path from A1 to C2 is checked.",
    },
    merge_targets: ["courseMap", "learningPath", "progressionMatrix", "finalCanDoIndex"],
    merge_tags: ["a1-c2", "coverage", "learner-route"],
    learner_trap_vi: "A1-C2 coverage không phải official certification claim.",
    learner_trap_en: "A1-C2 coverage is not an official certification claim.",
  },
  {
    id: "pre-merge-script-coverage",
    area: "script_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਚੈਕ",
    romanization: "Gurmukhi check",
    title_vi: "Check Gurmukhi",
    title_en: "Gurmukhi/script coverage",
    merge_vi: "Check khi Gurmukhi là primary script và romanization chỉ hỗ trợ khi hữu ích.",
    merge_en: "Check when Gurmukhi is the primary script and romanization only supports where useful.",
    risk_vi: "Không mark ready nếu romanization thay thế Gurmukhi trong sample chính.",
    risk_en: "Do not mark ready if romanization replaces Gurmukhi in primary samples.",
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ ਰਹੇ।",
      romanization: "Gurmukhi pehlan rahe",
      vi: "Gurmukhi vẫn đi trước.",
      en: "Gurmukhi stays first.",
    },
    merge_targets: ["scriptGuide", "romanizationGuide", "finalAcceptanceChecklist"],
    merge_tags: ["gurmukhi", "script", "pre-merge", "shahmukhi-awareness"],
    learner_trap_vi: "Shahmukhi chỉ là awareness, không phải full course.",
    learner_trap_en: "Shahmukhi is awareness-only, not a full course.",
  },
  {
    id: "pre-merge-canada-survival-coverage",
    area: "canada_survival_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਕੈਨੇਡਾ ਸਰਵਾਈਵਲ ਚੈਕ",
    romanization: "Canada survival check",
    title_vi: "Check tình huống sống ở Canada",
    title_en: "Canada survival coverage",
    merge_vi:
      "Check when lessons cover bus, landlord, clinic, work shift, school message, winter, and service desk talk in Punjabi.",
    merge_en:
      "Check when lessons cover bus, landlord, clinic, work shift, school message, winter, and service desk talk in Punjabi.",
    risk_vi: "Thiếu survival scenario làm learner khó dùng ngay ở Canada.",
    risk_en: "Missing survival scenarios makes the learner less ready for Canada.",
    sample: {
      gurmukhi: "ਮੈਂ ਬੱਸ ਸਟਾਪ ਤੇ ਹਾਂ।",
      romanization: "main bus stop te haan",
      vi: "Tôi đang ở trạm xe buýt.",
      en: "I am at the bus stop.",
    },
    merge_targets: ["lessonSet", "dialogueSet", "finalCanDoIndex"],
    merge_tags: ["canada", "survival", "pre-merge"],
    canada_practical:
      "Ví dụ Canada: nhắn landlord về heating, gọi clinic, hoặc đổi shift at work with Punjabi phrases.",
    learner_trap_vi: "Canada practice không chỉ là sightseeing hoặc tourist talk.",
    learner_trap_en: "Canada practice is not just sightseeing or tourist talk.",
  },
  {
    id: "pre-merge-remediation-coverage",
    area: "remediation_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਰੰਮਤ ਚੈਕ",
    romanization: "murammat check",
    title_vi: "Check remediation",
    title_en: "Remediation coverage",
    merge_vi:
      "Check when remediation, repair, revision, and fallback notes exist for gaps, duplicates, or naming drift.",
    merge_en:
      "Check when remediation, repair, revision, and fallback notes exist for gaps, duplicates, or naming drift.",
    risk_vi: "Không có remediation thì lỗi nhỏ dễ đẩy thành blocker lớn.",
    risk_en: "Without remediation, small issues can become large blockers.",
    sample: {
      gurmukhi: "ਮੁਰੰਮਤ ਨੋਟ ਚੈਕ ਹੈ।",
      romanization: "murammat note check hai",
      vi: "Ghi chú sửa lỗi đã được kiểm tra.",
      en: "The repair notes have been checked.",
    },
    merge_targets: ["finalRemediationNotes", "finalQAInventory", "finalGoNoGoChecklist"],
    merge_tags: ["remediation", "repair", "fallback", "pre-merge"],
    learner_trap_vi: "Remediation không phải né lỗi; là ghi rõ cách sửa.",
    learner_trap_en: "Remediation is not hiding errors; it is naming how to fix them.",
  },
  {
    id: "pre-merge-decision",
    area: "pre_merge_decision",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਅੰਤਿਮ ਚੈਕ ਫੈਸਲਾ",
    romanization: "aakhir check faisla",
    title_vi: "Quyết định pre-merge cuối",
    title_en: "Final pre-merge decision",
    merge_vi:
      "Check khi module-family, coverage, routes, and labels line up enough for later review, not for integration.",
    merge_en:
      "Check when module-family, coverage, routes, and labels line up enough for later review, not for integration. Native review is deferred and completion is not claimed. This is not A11 integration / no A11 integration.",
    risk_vi: "Đừng biến pre-merge thành claim đã ship.",
    risk_en: "Do not turn a pre-merge check into a shipped claim.",
    sample: {
      gurmukhi: "ਚੈਕ ਫੈਸਲਾ ਤਿਆਰ ਹੈ।",
      romanization: "check faisla tyaar hai",
      vi: "Quyết định kiểm tra đã sẵn sàng.",
      en: "The check decision is ready.",
    },
    merge_targets: ["finalAcceptanceChecklist", "finalGoNoGoChecklist", "finalOwnerAcceptanceChecklist"],
    merge_tags: ["decision", "pre-merge", "pre-a11-checksum", "mr-readiness"],
    must_not_claim_vi: "Đây không phải claim rằng later A11 đã chạy.",
    must_not_claim_en: "This is not a claim that later A11 has run.",
  },
  {
    id: "pre-merge-deferred-review",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡਿਫਰਡ ਰਿਵਿਊ ਚੈਕ",
    romanization: "deferred review check",
    title_vi: "Check deferred review",
    title_en: "Deferred review",
    merge_vi:
      "Check khi native review vẫn được hoãn và reviewer chỉ ghi boundary, không công bố completion.",
    merge_en:
      "Check when native review is still deferred and the reviewer only records the boundary, not completion.",
    risk_vi: "Claim review xong khi chưa review đủ sẽ làm hỏng trạng thái thật.",
    risk_en: "Claiming review is done before it is done corrupts the real state.",
    sample: {
      gurmukhi: "ਰਿਵਿਊ ਡਿਫਰਡ ਹੈ।",
      romanization: "review deferred hai",
      vi: "Phần review được hoãn.",
      en: "The review is deferred.",
    },
    merge_targets: ["finalReviewBoundary", "finalAcceptanceChecklist", "finalOwnerAcceptanceChecklist"],
    merge_tags: ["deferred-review", "boundary", "pre-merge"],
    must_not_claim_vi: "Native review chưa hoàn tất.",
    must_not_claim_en: "Native review is not completed.",
  },
  {
    id: "pre-merge-forbidden-claim",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮਨਾਹੀ ਦਾਅਵਾ ਚੈਕ",
    romanization: "manahi daava check",
    title_vi: "Check claim bị cấm",
    title_en: "Forbidden-claim boundary",
    merge_vi:
      "Check when output không được nói native, official certification, later A11 integration, push, deploy, hoặc complete review.",
    merge_en:
      "Check when output must not claim native quality, official certification, later A11 integration, push, deploy, or completed review.",
    risk_vi: "Một claim quá tay có thể làm user hiểu sai mức độ sẵn sàng.",
    risk_en: "An overstated claim can make users misunderstand the readiness level.",
    sample: {
      gurmukhi: "ਮਨਾਹੀ ਦਾਅਵਾ ਨਹੀਂ ਕਰਨਾ।",
      romanization: "manahi daava nahin karna",
      vi: "Không được đưa ra claim bị cấm.",
      en: "Do not make forbidden claims.",
    },
    merge_targets: ["finalAcceptanceChecklist", "finalGoNoGoChecklist", "finalContentManifest"],
    merge_tags: ["forbidden-claim", "pre-merge", "final-freeze"],
    must_not_claim_vi: "Không claim native review, official certification, push, deploy, hoặc later A11 integration.",
    must_not_claim_en:
      "Do not claim native review, official certification, push, deploy, or later A11 integration.",
  },
];

export const PUNJABI_FINAL_PRE_MERGE_CHECKLIST_ROUTES = [
  {
    id: "pre-merge-readiness-route",
    vi: "Route readiness cho module-family, import/export, naming, duplicate-ID, và decision boundary.",
    en: "Readiness route for module-family, import/export, naming, duplicate-ID, and decision boundary.",
    item_ids: [
      "pre-merge-module-family-completeness",
      "pre-merge-import-export-expectations",
      "pre-merge-naming-consistency",
      "pre-merge-duplicate-id-risk",
      "pre-merge-decision",
    ],
  },
  {
    id: "pre-merge-coverage-route",
    vi: "Route coverage cho A1-C2, Gurmukhi, Canada survival, và remediation coverage.",
    en: "Coverage route for A1-C2, Gurmukhi, Canada survival, and remediation coverage.",
    item_ids: [
      "pre-merge-level-coverage",
      "pre-merge-script-coverage",
      "pre-merge-canada-survival-coverage",
      "pre-merge-remediation-coverage",
    ],
  },
  {
    id: "pre-merge-boundary-route",
    vi: "Route boundary cho deferred review và forbidden-claim guardrails.",
    en: "Boundary route for deferred review and forbidden-claim guardrails.",
    item_ids: ["pre-merge-deferred-review", "pre-merge-forbidden-claim"],
  },
] as const;

export const PUNJABI_FINAL_PRE_MERGE_CHECKLIST_ROOT = {
  scope: PUNJABI_FINAL_PRE_MERGE_CHECKLIST_SCOPE,
  scope_alias: PUNJABI_FINAL_PRE_MERGE_CHECKLIST_SCOPE_ALIAS,
  areas: PUNJABI_FINAL_PRE_MERGE_CHECKLIST_AREAS,
  items: PUNJABI_FINAL_PRE_MERGE_CHECKLIST,
  routes: PUNJABI_FINAL_PRE_MERGE_CHECKLIST_ROUTES,
};

export default PUNJABI_FINAL_PRE_MERGE_CHECKLIST_ROOT;
