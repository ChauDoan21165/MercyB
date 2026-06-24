// src/languages/punjabi/finalPreA11Checksum.ts
//
// Wave 48 pre-A11 checksum for Punjabi.
// This is pre-integration checksum data for later A11 only. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalPreA11ChecksumArea =
  | "module_family_completeness"
  | "import_export_expectations"
  | "naming_consistency"
  | "duplicate_id_risk"
  | "level_coverage"
  | "script_coverage"
  | "canada_survival_coverage"
  | "remediation_coverage"
  | "pre_a11_checksum_decision"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiFinalPreA11ChecksumStatus =
  | "ready_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalPreA11ChecksumItem = {
  id: string;
  area: PunjabiFinalPreA11ChecksumArea;
  status: PunjabiFinalPreA11ChecksumStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  checksum_vi: string;
  checksum_en: string;
  risk_vi: string;
  risk_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  checksum_targets: string[];
  checksum_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_PRE_A11_CHECKSUM_SCOPE = {
  wave: "Wave 48",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  purpose_vi:
    "Pre-A11 checksum này chỉ ghi check readiness trước later A11; nó không thực hiện integration.",
  purpose_en:
    "This pre-A11 checksum only documents readiness check before later A11; it does not perform integration.",
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

export const PUNJABI_FINAL_PRE_A11_CHECKSUM_SCOPE_ALIAS =
  PUNJABI_FINAL_PRE_A11_CHECKSUM_SCOPE;

export const PUNJABI_FINAL_PRE_A11_CHECKSUM_AREAS: PunjabiFinalPreA11ChecksumArea[] = [
  "module_family_completeness",
  "import_export_expectations",
  "naming_consistency",
  "duplicate_id_risk",
  "level_coverage",
  "script_coverage",
  "canada_survival_coverage",
  "remediation_coverage",
  "pre_a11_checksum_decision",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_FINAL_PRE_A11_CHECKSUM: PunjabiFinalPreA11ChecksumItem[] = [
  {
    id: "checksum-module-family-completeness",
    area: "module_family_completeness",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਚੈਕ",
    romanization: "module parivar check",
    title_vi: "Check đầy đủ nhóm module",
    title_en: "Module-family completeness",
    checksum_vi:
      "Check khi foundation, learning path, coverage, QA, owner-acceptance và final-acceptance cùng khớp một Punjabi module-family.",
    checksum_en:
      "Check when foundation, learning path, coverage, QA, owner-acceptance, and final-acceptance align as one Punjabi module family for a pre-A11-checksum runner-readiness and pipeline-readiness pre-integration pass with ci-readiness, mr-readiness, final-freeze, and final-lock notes.",
    risk_vi: "Không mark ready nếu module nào còn lệch scope, tên hoặc owner expectation.",
    risk_en: "Do not mark ready if any module still drifts in scope, naming, or owner expectation.",
    sample: {
      gurmukhi: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਚੈਕ ਹੋ ਗਿਆ ਹੈ।",
      romanization: "module parivar check ho gaya hai",
      vi: "Nhóm module đã được kiểm tra.",
      en: "The module family has been checked.",
    },
    checksum_targets: ["contentIndex", "finalModuleRegistry", "finalOwnerAcceptanceChecklist"],
    checksum_tags: ["module-family", "pre-a11-checksum", "runner-readiness", "pre-integration"],
    learner_trap_vi: "Checksum readiness không có nghĩa later A11 đã chạy.",
    learner_trap_en: "Checksum readiness does not mean later A11 has run.",
  },
  {
    id: "checksum-import-export-expectations",
    area: "import_export_expectations",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ export ਚੈਕ",
    romanization: "import export check",
    title_vi: "Check import/export",
    title_en: "Import/export expectations",
    checksum_vi:
      "Check khi named exports, default exports, expected imports và route labels có checklist rõ.",
    checksum_en:
      "Check when named exports, default exports, expected imports, and route labels have a clear checklist.",
    risk_vi: "Import/export drift có thể làm later A11 nối sai dữ liệu.",
    risk_en: "Import/export drift can make later A11 wire the wrong data.",
    sample: {
      gurmukhi: "ਇੰਪੋਰਟ ਤੇ export ਚੈਕ ਹਨ।",
      romanization: "import te export check han",
      vi: "Import và export được kiểm tra.",
      en: "Imports and exports are checked.",
    },
    checksum_targets: ["finalImportReadinessMap", "finalExportReadiness", "finalAcceptanceChecklist"],
    checksum_tags: ["import", "export", "pre-a11-checksum", "final-lock"],
    learner_trap_vi: "Tên hiển thị không thay thế export identifier ổn định.",
    learner_trap_en: "A display name does not replace a stable export identifier.",
  },
  {
    id: "checksum-naming-consistency",
    area: "naming_consistency",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਂ ਇਕਸਾਰਤਾ ਚੈਕ",
    romanization: "naam iksarta check",
    title_vi: "Check nhất quán tên",
    title_en: "Naming consistency",
    checksum_vi:
      "Check khi file names, export names, route IDs, item IDs và display labels dùng cùng Punjabi naming pattern.",
    checksum_en:
      "Check when file names, export names, route IDs, item IDs, and display labels use the same Punjabi naming pattern.",
    risk_vi: "Naming drift có thể làm later A11 import nhầm module hoặc route.",
    risk_en: "Naming drift can make later A11 import the wrong module or route.",
    sample: {
      gurmukhi: "ਨਾਂ ਇਕਸਾਰ ਰੱਖੋ।",
      romanization: "naam iksar rakho",
      vi: "Giữ tên nhất quán.",
      en: "Keep names consistent.",
    },
    checksum_targets: ["finalLockChecklist", "finalOwnerAcceptanceChecklist", "finalAcceptanceChecklist"],
    checksum_tags: ["naming", "consistency", "pre-a11-checksum", "final-freeze"],
    learner_trap_vi: "Tên gần giống không đủ; route ID và export name phải khớp rõ.",
    learner_trap_en: "A similar-looking name is not enough; route IDs and export names need clear alignment.",
  },
  {
    id: "checksum-duplicate-id-risk",
    area: "duplicate_id_risk",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ID ਚੈਕ",
    romanization: "duplicate ID check",
    title_vi: "Check rủi ro trùng ID",
    title_en: "Duplicate-ID risk",
    checksum_vi: "Check khi item IDs, route IDs, module IDs và check IDs không trùng.",
    checksum_en: "Check when item IDs, route IDs, module IDs, and check IDs are not duplicated.",
    risk_vi: "ID trùng có thể làm registry ghi đè sai item hoặc route.",
    risk_en: "Duplicate IDs can make a registry overwrite the wrong item or route.",
    sample: {
      gurmukhi: "ਹਰ ID ਵੱਖਰੀ ਰਹੇ।",
      romanization: "har ID vakhri rahe",
      vi: "Mỗi ID phải riêng.",
      en: "Every ID should stay distinct.",
    },
    checksum_targets: ["finalModuleRegistry", "finalContentManifest", "finalGoNoGoChecklist"],
    checksum_tags: ["duplicate-risk", "ids", "registry", "pre-a11-checksum"],
    learner_trap_vi: "Cùng topic không luôn là duplicate; phải so full ID.",
    learner_trap_en: "The same topic is not always a duplicate; compare the full ID.",
  },
  {
    id: "checksum-level-coverage",
    area: "level_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1-C2 ਚੈਕ",
    romanization: "A1-C2 check",
    title_vi: "Check A1-C2",
    title_en: "A1-C2 coverage",
    checksum_vi:
      "Check khi A1-C2 có goals, lessons, can-do, QA, review và remediation markers cho Vietnamese và English learners.",
    checksum_en:
      "Check when A1-C2 has goals, lessons, can-do items, QA, review, and remediation markers for Vietnamese and English learners.",
    risk_vi: "Thiếu level làm learner route bị đứt.",
    risk_en: "A missing level breaks the learner route.",
    sample: {
      gurmukhi: "A1 ਤੋਂ C2 ਤੱਕ ਰਾਹ ਚੈਕ ਹੈ।",
      romanization: "A1 ton C2 takk raah check hai",
      vi: "Lộ trình từ A1 đến C2 có kiểm tra.",
      en: "The path from A1 to C2 is checked.",
    },
    checksum_targets: ["courseMap", "learningPath", "progressionMatrix", "finalCanDoIndex"],
    checksum_tags: ["a1-c2", "coverage", "learner-route"],
    learner_trap_vi: "A1-C2 coverage không phải official certification claim.",
    learner_trap_en: "A1-C2 coverage is not an official certification claim.",
  },
  {
    id: "checksum-script-coverage",
    area: "script_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਚੈਕ",
    romanization: "Gurmukhi check",
    title_vi: "Check Gurmukhi",
    title_en: "Gurmukhi/script coverage",
    checksum_vi: "Check khi Gurmukhi là primary script và romanization chỉ hỗ trợ khi hữu ích.",
    checksum_en: "Check when Gurmukhi is the primary script and romanization only supports where useful.",
    risk_vi: "Không mark ready nếu romanization thay thế Gurmukhi trong sample chính.",
    risk_en: "Do not mark ready if romanization replaces Gurmukhi in primary samples.",
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ ਰਹੇ।",
      romanization: "Gurmukhi pehlan rahe",
      vi: "Gurmukhi vẫn đi trước.",
      en: "Gurmukhi stays first.",
    },
    checksum_targets: ["scriptGuide", "romanizationGuide", "finalAcceptanceChecklist"],
    checksum_tags: ["gurmukhi", "script", "pre-a11-checksum", "shahmukhi-awareness"],
    learner_trap_vi: "Shahmukhi chỉ là awareness, không phải full course.",
    learner_trap_en: "Shahmukhi is awareness-only, not a full course.",
  },
  {
    id: "checksum-canada-survival-coverage",
    area: "canada_survival_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਕੈਨੇਡਾ ਸਰਵਾਈਵਲ ਚੈਕ",
    romanization: "Canada survival check",
    title_vi: "Check tình huống sống ở Canada",
    title_en: "Canada survival coverage",
    checksum_vi:
      "Check khi lessons cover bus, landlord, clinic, work shift, school message, winter, and service desk talk in Punjabi.",
    checksum_en:
      "Check when lessons cover bus, landlord, clinic, work shift, school message, winter, and service desk talk in Punjabi.",
    risk_vi: "Thiếu survival scenario làm learner khó dùng ngay ở Canada.",
    risk_en: "Missing survival scenarios makes the learner less ready for Canada.",
    sample: {
      gurmukhi: "ਮੈਂ ਬੱਸ ਸਟਾਪ ਤੇ ਹਾਂ।",
      romanization: "main bus stop te haan",
      vi: "Tôi đang ở trạm xe buýt.",
      en: "I am at the bus stop.",
    },
    checksum_targets: ["lessonSet", "dialogueSet", "finalCanDoIndex"],
    checksum_tags: ["canada", "survival", "pre-a11-checksum"],
    canada_practical:
      "Ví dụ Canada: nhắn landlord về heating, gọi clinic, hoặc đổi shift at work with Punjabi phrases.",
    learner_trap_vi: "Canada practice không chỉ là sightseeing hoặc tourist talk.",
    learner_trap_en: "Canada practice is not just sightseeing or tourist talk.",
  },
  {
    id: "checksum-remediation-coverage",
    area: "remediation_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਰੰਮਤ ਚੈਕ",
    romanization: "murammat check",
    title_vi: "Check remediation",
    title_en: "Remediation coverage",
    checksum_vi:
      "Check khi remediation, repair, revision, and fallback notes exist for gaps, duplicates, or naming drift.",
    checksum_en:
      "Check when remediation, repair, revision, and fallback notes exist for gaps, duplicates, or naming drift.",
    risk_vi: "Không có remediation thì lỗi nhỏ dễ đẩy thành blocker lớn.",
    risk_en: "Without remediation, small issues can become large blockers.",
    sample: {
      gurmukhi: "ਮੁਰੰਮਤ ਨੋਟ ਚੈਕ ਹੈ।",
      romanization: "murammat note check hai",
      vi: "Ghi chú sửa lỗi đã được kiểm tra.",
      en: "The repair notes have been checked.",
    },
    checksum_targets: ["finalRemediationNotes", "finalQAInventory", "finalGoNoGoChecklist"],
    checksum_tags: ["remediation", "repair", "fallback", "pre-a11-checksum"],
    learner_trap_vi: "Remediation không phải né lỗi; là ghi rõ cách sửa.",
    learner_trap_en: "Remediation is not hiding errors; it is naming how to fix them.",
  },
  {
    id: "checksum-decision",
    area: "pre_a11_checksum_decision",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਅੰਤਿਮ ਚੈਕ ਫੈਸਲਾ",
    romanization: "aakhir check faisla",
    title_vi: "Quyết định checksum cuối",
    title_en: "Final pre-A11 checksum decision",
    checksum_vi:
      "Check khi module-family, coverage, routes, and labels all line up enough for later review, not for integration.",
    checksum_en:
      "Check when module-family, coverage, routes, and labels line up enough for later review, not for integration.",
    risk_vi: "Đừng biến checksum thành claim đã ship.",
    risk_en: "Do not turn a checksum into a shipped claim.",
    sample: {
      gurmukhi: "ਚੈਕ ਫੈਸਲਾ ਤਿਆਰ ਹੈ।",
      romanization: "check faisla tyaar hai",
      vi: "Quyết định kiểm tra đã sẵn sàng.",
      en: "The check decision is ready.",
    },
    checksum_targets: ["finalAcceptanceChecklist", "finalGoNoGoChecklist", "finalOwnerAcceptanceChecklist"],
    checksum_tags: ["decision", "pre-a11-checksum", "final-lock", "mr-readiness"],
    must_not_claim_vi: "Đây không phải claim rằng later A11 đã chạy.",
    must_not_claim_en: "This is not a claim that later A11 has run.",
  },
  {
    id: "checksum-deferred-review",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡਿਫਰਡ ਰਿਵਿਊ ਚੈਕ",
    romanization: "deferred review check",
    title_vi: "Check deferred review",
    title_en: "Deferred review",
    checksum_vi:
      "Check khi native review vẫn được hoãn và reviewer chỉ ghi boundary, không công bố completion.",
    checksum_en:
      "Check when native review is still deferred; native review is deferred, completion is not claimed, and this is not A11 integration / no A11 integration. The reviewer only records the boundary, not completion.",
    risk_vi: "Claim review xong khi chưa review đủ sẽ làm hỏng trạng thái thật.",
    risk_en: "Claiming review is done before it is done corrupts the real state.",
    sample: {
      gurmukhi: "ਰਿਵਿਊ ਡਿਫਰਡ ਹੈ।",
      romanization: "review deferred hai",
      vi: "Phần review được hoãn.",
      en: "The review is deferred.",
    },
    checksum_targets: ["finalReviewBoundary", "finalAcceptanceChecklist", "finalOwnerAcceptanceChecklist"],
    checksum_tags: ["deferred-review", "boundary", "pre-a11-checksum"],
    must_not_claim_vi: "Native review chưa hoàn tất.",
    must_not_claim_en: "Native review is not completed.",
  },
  {
    id: "checksum-forbidden-claim",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮਨਾਹੀ ਦਾਅਵਾ ਚੈਕ",
    romanization: "manahi daava check",
    title_vi: "Check claim bị cấm",
    title_en: "Forbidden-claim boundary",
    checksum_vi:
      "Check khi output không được nói native, official certification, later A11 integration, push, deploy, or complete review.",
    checksum_en:
      "Check when output must not claim native quality, official certification, later A11 integration, push, deploy, or completed review. This pre-a11-checksum boundary keeps the no A11 integration / not A11 integration line explicit.",
    risk_vi: "Một claim quá tay có thể làm user hiểu sai mức độ sẵn sàng.",
    risk_en: "An overstated claim can make users misunderstand the readiness level.",
    sample: {
      gurmukhi: "ਮਨਾਹੀ ਦਾਅਵਾ ਨਹੀਂ ਕਰਨਾ।",
      romanization: "manahi daava nahin karna",
      vi: "Không được đưa ra claim bị cấm.",
      en: "Do not make forbidden claims.",
    },
    checksum_targets: ["finalAcceptanceChecklist", "finalGoNoGoChecklist", "finalContentManifest"],
    checksum_tags: ["forbidden-claim", "pre-a11-checksum", "final-freeze"],
    must_not_claim_vi: "Không claim native review, official certification, push, deploy, hoặc later A11 integration.",
    must_not_claim_en:
      "Do not claim native review, official certification, push, deploy, or later A11 integration.",
  },
];

export const PUNJABI_FINAL_PRE_A11_CHECKSUM_ROUTES = [
  {
    id: "checksum-readiness-route",
    vi: "Route readiness cho module-family, import/export, naming, duplicate-ID, và decision boundary.",
    en: "Readiness route for module-family, import/export, naming, duplicate-ID, and decision boundary.",
    item_ids: [
      "checksum-module-family-completeness",
      "checksum-import-export-expectations",
      "checksum-naming-consistency",
      "checksum-duplicate-id-risk",
      "checksum-decision",
    ],
  },
  {
    id: "checksum-coverage-route",
    vi: "Route coverage cho A1-C2, Gurmukhi, Canada survival, và remediation coverage.",
    en: "Coverage route for A1-C2, Gurmukhi, Canada survival, and remediation coverage.",
    item_ids: [
      "checksum-level-coverage",
      "checksum-script-coverage",
      "checksum-canada-survival-coverage",
      "checksum-remediation-coverage",
    ],
  },
  {
    id: "checksum-boundary-route",
    vi: "Route boundary cho deferred review và forbidden-claim guardrails.",
    en: "Boundary route for deferred review and forbidden-claim guardrails.",
    item_ids: ["checksum-deferred-review", "checksum-forbidden-claim"],
  },
] as const;

export const PUNJABI_FINAL_PRE_A11_CHECKSUM_ROOT = {
  scope: PUNJABI_FINAL_PRE_A11_CHECKSUM_SCOPE,
  scope_alias: PUNJABI_FINAL_PRE_A11_CHECKSUM_SCOPE_ALIAS,
  areas: PUNJABI_FINAL_PRE_A11_CHECKSUM_AREAS,
  items: PUNJABI_FINAL_PRE_A11_CHECKSUM,
  routes: PUNJABI_FINAL_PRE_A11_CHECKSUM_ROUTES,
};

export default PUNJABI_FINAL_PRE_A11_CHECKSUM_ROOT;
