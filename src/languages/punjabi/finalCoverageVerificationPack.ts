// src/languages/punjabi/finalCoverageVerificationPack.ts
//
// Wave 34 final coverage verification pack for Punjabi.
// This is pre-integration verification data for later A11 only. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalCoverageVerificationArea =
  | "cross_level_coverage"
  | "canada_domains"
  | "script_coverage"
  | "remediation_coverage"
  | "duplicate_id_checks"
  | "naming_consistency"
  | "learner_support"
  | "pre_integration_verification"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiFinalCoverageVerificationStatus =
  | "ready_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalCoverageVerificationItem = {
  id: string;
  area: PunjabiFinalCoverageVerificationArea;
  status: PunjabiFinalCoverageVerificationStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  verify_vi: string;
  verify_en: string;
  failure_vi: string;
  failure_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  coverage_targets: string[];
  verification_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_COVERAGE_VERIFICATION_PACK_SCOPE = {
  wave: "Wave 34",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  purpose_vi:
    "Final coverage verification pack này kiểm coverage trước later A11; nó không thực hiện integration.",
  purpose_en:
    "This final coverage verification pack checks coverage before later A11; it does not perform integration.",
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

export const PUNJABI_FINAL_COVERAGE_VERIFICATION_PACK_SCOPE_ALIAS =
  PUNJABI_FINAL_COVERAGE_VERIFICATION_PACK_SCOPE;

export const PUNJABI_FINAL_COVERAGE_VERIFICATION_PACK_PLAN_SCOPE =
  PUNJABI_FINAL_COVERAGE_VERIFICATION_PACK_SCOPE;

export const PUNJABI_FINAL_COVERAGE_VERIFICATION_PACK_AREAS: PunjabiFinalCoverageVerificationArea[] = [
  "cross_level_coverage",
  "canada_domains",
  "script_coverage",
  "remediation_coverage",
  "duplicate_id_checks",
  "naming_consistency",
  "learner_support",
  "pre_integration_verification",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_FINAL_COVERAGE_VERIFICATION_PACK: PunjabiFinalCoverageVerificationItem[] = [
  {
    id: "coverage-cross-level-a1-c2",
    area: "cross_level_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1-C2 ਕਵਰੇਜ",
    romanization: "A1-C2 coverage",
    title_vi: "Phủ A1-C2",
    title_en: "A1-C2 coverage",
    verify_vi:
      "Xác minh mỗi level có goals, can-do, lessons, QA và readiness markers trước later A11.",
    verify_en:
      "Verify every level has goals, can-do items, lessons, QA, and readiness markers before later A11.",
    failure_vi:
      "Nếu thiếu một level, Vietnamese-speaking và English-speaking learners sẽ gặp route bị đứt.",
    failure_en:
      "If one level is missing, Vietnamese-speaking and English-speaking learners get a broken route.",
    sample: {
      gurmukhi: "A1 ਤੋਂ C2 ਤੱਕ ਸਪਸ਼ਟ ਰਾਹ ਹੈ।",
      romanization: "A1 ton C2 takk sapasht raah hai",
      vi: "Có lộ trình rõ từ A1 đến C2.",
      en: "There is a clear path from A1 to C2.",
    },
    coverage_targets: [
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "masteryCheckpoints",
      "finalCanDoIndex",
      "finalQualityGates",
    ],
    verification_tags: ["cross-check", "a1-c2", "level-coverage"],
    learner_trap_vi:
      "A1-C2 coverage không phải official certification claim.",
    learner_trap_en:
      "A1-C2 coverage is not an official certification claim.",
  },
  {
    id: "coverage-canada-domains",
    area: "canada_domains",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਕੈਨੇਡਾ ਡੋਮੇਨ",
    romanization: "Canada domain",
    title_vi: "Miền Canada",
    title_en: "Canada domains",
    verify_vi:
      "Xác minh survival, workplace, healthcare, school, transit và public-service đều có coverage text-only.",
    verify_en:
      "Verify survival, workplace, healthcare, school, transit, and public-service all have text-only coverage.",
    failure_vi:
      "Nếu thiếu healthcare hoặc public service, nội dung Canada-practical không đủ dùng.",
    failure_en:
      "If healthcare or public service is missing, Canada-practical content is not useful enough.",
    sample: {
      gurmukhi: "ਮੈਨੂੰ health card ਬਾਰੇ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
      romanization: "mainu health card bare madad chahidi hai",
      vi: "Tôi cần trợ giúp về thẻ y tế.",
      en: "I need help with a health card.",
    },
    coverage_targets: [
      "dialogues",
      "contentIndex",
      "integrationReadinessChecklist",
      "preIntegrationCoverageMap",
      "finalNavigationMap",
      "finalSmokeChecklist",
    ],
    verification_tags: ["canada-practical", "public-service", "healthcare"],
    canada_practical:
      "Use appointment, clinic, school, workplace, transit, form, and public-service examples as text-only practice.",
    learner_trap_vi:
      "Ví dụ Canada-practical không phải tư vấn pháp lý hay y tế.",
    learner_trap_en:
      "Canada-practical examples are not legal or medical advice.",
  },
  {
    id: "coverage-gurmukhi-script",
    area: "script_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਕਵਰੇਜ",
    romanization: "Gurmukhi coverage",
    title_vi: "Phủ Gurmukhi",
    title_en: "Gurmukhi coverage",
    verify_vi:
      "Xác minh samples dùng Gurmukhi trước, romanization hỗ trợ khi hữu ích, và normalize không làm mất chữ chính.",
    verify_en:
      "Verify samples use Gurmukhi first, romanization supports where useful, and normalization does not remove the primary script.",
    failure_vi:
      "Nếu romanization thay Gurmukhi, learner mất nền tảng chữ chính.",
    failure_en:
      "If romanization replaces Gurmukhi, learners lose the primary-script foundation.",
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ ਪੜ੍ਹੋ।",
      romanization: "Gurmukhi pehlan parho",
      vi: "Đọc Gurmukhi trước.",
      en: "Read Gurmukhi first.",
    },
    coverage_targets: [
      "normalize",
      "lessons",
      "lessons-a1",
      "skillDependencyGraph",
      "finalIntegrationGuardrails",
    ],
    verification_tags: ["gurmukhi-first", "script", "romanization-support"],
    learner_trap_vi:
      "Shahmukhi chỉ là awareness-only, không phải full course.",
    learner_trap_en:
      "Shahmukhi is awareness-only, not a full course.",
  },
  {
    id: "coverage-remediation-paths",
    area: "remediation_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੀਮੀਡੀਏਸ਼ਨ ਰਾਹ",
    romanization: "remediation raah",
    title_vi: "Lộ trình sửa lỗi",
    title_en: "Remediation paths",
    verify_vi:
      "Xác minh remediation cho script confusion, postpositions, register, Canada domains và review checkpoints.",
    verify_en:
      "Verify remediation for script confusion, postpositions, register, Canada domains, and review checkpoints.",
    failure_vi:
      "Nếu remediation thiếu, QA phát hiện lỗi nhưng không chỉ đường sửa.",
    failure_en:
      "If remediation is missing, QA finds errors without a repair path.",
    sample: {
      gurmukhi: "ਗਲਤੀ ਤੋਂ ਬਾਅਦ ਦੁਬਾਰਾ ਅਭਿਆਸ ਕਰੋ।",
      romanization: "galti ton baad dubara abhyaas karo",
      vi: "Sau lỗi, hãy luyện lại.",
      en: "After an error, practice again.",
    },
    coverage_targets: [
      "skillDependencyGraph",
      "masteryCheckpoints",
      "finalCanDoIndex",
      "finalQualityGates",
      "finalIntegrationStabilityPlan",
    ],
    verification_tags: ["remediation", "learner-traps", "final-regression"],
    learner_trap_vi:
      "Remediation text-only không tạo pronunciation scoring.",
    learner_trap_en:
      "Text-only remediation does not create pronunciation scoring.",
  },
  {
    id: "coverage-duplicate-id-checks",
    area: "duplicate_id_checks",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ID ਜਾਂਚ",
    romanization: "duplicate ID janch",
    title_vi: "Kiểm ID trùng",
    title_en: "Duplicate ID checks",
    verify_vi:
      "Xác minh item IDs, route IDs, module IDs và export names không trùng trước later A11.",
    verify_en:
      "Verify item IDs, route IDs, module IDs, and export names are not duplicated before later A11.",
    failure_vi:
      "ID trùng có thể làm registry hoặc route ghi đè sai mục.",
    failure_en:
      "Duplicate IDs can make a registry or route overwrite the wrong item.",
    sample: {
      gurmukhi: "ਹਰ ID ਵੱਖਰੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
      romanization: "har ID vakhri honi chahidi hai",
      vi: "Mỗi ID phải khác nhau.",
      en: "Every ID should be different.",
    },
    coverage_targets: [
      "finalModuleRegistry",
      "finalContentManifest",
      "finalIntegrationEvidenceMap",
      "finalIntegrationRiskRegister",
      "finalImportReadinessMap",
    ],
    verification_tags: ["duplicate-id", "one-owner", "cross-check"],
    learner_trap_vi:
      "Hai mục cùng topic chưa chắc trùng; phải so full ID.",
    learner_trap_en:
      "Two items with the same topic are not always duplicates; compare the full ID.",
  },
  {
    id: "coverage-naming-consistency",
    area: "naming_consistency",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਂ ਇਕਸਾਰਤਾ",
    romanization: "naam iksarta",
    title_vi: "Nhất quán tên",
    title_en: "Naming consistency",
    verify_vi:
      "Xác minh file names, exports, IDs và route labels dùng cùng pattern Punjabi final-pack.",
    verify_en:
      "Verify file names, exports, IDs, and route labels use the same Punjabi final-pack pattern.",
    failure_vi:
      "Tên lệch làm later A11 import nhầm hoặc bỏ sót module.",
    failure_en:
      "Naming drift can make later A11 import the wrong module or miss one.",
    sample: {
      gurmukhi: "ਨਾਂ ਇਕਸਾਰ ਰੱਖੋ।",
      romanization: "naam iksar rakho",
      vi: "Giữ tên nhất quán.",
      en: "Keep names consistent.",
    },
    coverage_targets: [
      "finalExportReadiness",
      "finalPackagingReadiness",
      "finalMergeReadinessNotes",
      "finalImportReadinessMap",
    ],
    verification_tags: ["naming", "exports", "pre-integration"],
    learner_trap_vi:
      "Tên hiển thị tốt không thay thế export identifier rõ ràng.",
    learner_trap_en:
      "A good display name does not replace a clear export identifier.",
  },
  {
    id: "coverage-learner-support",
    area: "learner_support",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਲਰਨਰ ਸਹਾਇਤਾ",
    romanization: "learner sahaita",
    title_vi: "Hỗ trợ learner",
    title_en: "Learner support",
    verify_vi:
      "Xác minh explanations có tiếng Việt và tiếng Anh cho người học, không chỉ metadata tiếng Anh.",
    verify_en:
      "Verify explanations include Vietnamese and English learner support, not only English metadata.",
    failure_vi:
      "Nếu thiếu tiếng Việt, Vietnamese-speaking learners mất scaffold quan trọng.",
    failure_en:
      "If Vietnamese is missing, Vietnamese-speaking learners lose important scaffolding.",
    sample: {
      gurmukhi: "ਮੈਨੂੰ ਹੌਲੀ ਸਮਝਾਓ।",
      romanization: "mainu hauli samjhao",
      vi: "Hãy giải thích chậm cho tôi.",
      en: "Please explain slowly to me.",
    },
    coverage_targets: [
      "lessons",
      "dialogues",
      "courseMap",
      "learningPath",
      "finalCanDoIndex",
    ],
    verification_tags: ["vi-en-support", "learner-support", "bilingual"],
    learner_trap_vi:
      "Romanization hỗ trợ đọc nhanh nhưng không thay thế Gurmukhi.",
    learner_trap_en:
      "Romanization supports quick reading but does not replace Gurmukhi.",
  },
  {
    id: "coverage-pre-integration-verification",
    area: "pre_integration_verification",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਪ੍ਰੀ-integration ਜਾਂਚ",
    romanization: "pre-integration janch",
    title_vi: "Kiểm trước integration",
    title_en: "Pre-integration verification",
    verify_vi:
      "Pack này chỉ ghi verification items, routes và coverage targets; không chạy A11 integration.",
    verify_en:
      "This pack only records verification items, routes, and coverage targets; it does not run A11 integration.",
    failure_vi:
      "Nếu wave này sửa integration wiring, nó vượt allowed files.",
    failure_en:
      "If this wave edits integration wiring, it exceeds the allowed files.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ ਜਾਂਚ ਹੈ।",
      romanization: "ih siraf janch hai",
      vi: "Đây chỉ là kiểm tra.",
      en: "This is only a check.",
    },
    coverage_targets: [
      "finalIntegrationDryRunPlan",
      "finalA11HandoffNotes",
      "finalIntegrationSanityPack",
      "finalMergeReadinessNotes",
      "finalImportReadinessMap",
    ],
    verification_tags: ["verification", "pre-integration", "not-a11"],
    learner_trap_vi:
      "Verification pack không đồng nghĩa deploy, push hoặc integration thật.",
    learner_trap_en:
      "A verification pack does not mean real deployment, push, or integration.",
  },
  {
    id: "coverage-deferred-review",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ",
    romanization: "multavi samikhia",
    title_vi: "Review hoãn",
    title_en: "Deferred review",
    verify_vi:
      "Native review phải được ghi là deferred trong verification pack; không claim completion.",
    verify_en:
      "Native review is deferred in the verification pack; completion is not claimed.",
    failure_vi:
      "Nếu đổi thành approved, pack nói quá trạng thái nội dung.",
    failure_en:
      "If this changes to approved, the pack overstates content status.",
    sample: {
      gurmukhi: "review ਅਜੇ ਬਾਕੀ ਹੈ।",
      romanization: "review aje baki hai",
      vi: "Review vẫn còn chờ.",
      en: "Review is still pending.",
    },
    coverage_targets: [
      "preMrAuditChecklist",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
      "finalIntegrationRiskRegister",
    ],
    verification_tags: ["deferred-review", "native-review", "boundary"],
    learner_trap_vi:
      "Deferred không bao giờ nên được trình bày như đã hoàn tất.",
    learner_trap_en:
      "Deferred should never be presented as complete.",
    must_not_claim_vi: "Không claim native review hoặc completion đã xong.",
    must_not_claim_en: "Do not claim native review or completion is done.",
  },
  {
    id: "coverage-forbidden-claims",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾ claim ਕਰੋ",
    romanization: "na claim karo",
    title_vi: "Không claim",
    title_en: "Must not claim",
    verify_vi:
      "Không claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy hoặc A11 integration.",
    verify_en:
      "Do not claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy, or A11 integration.",
    failure_vi:
      "Nếu wording quảng bá lọt vào, verification pack sẽ nói sai khả năng hệ thống.",
    failure_en:
      "If promotional wording slips in, the verification pack misstates system capability.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ text ਹੈ।",
      romanization: "ih siraf text hai",
      vi: "Đây chỉ là text.",
      en: "This is text only.",
    },
    coverage_targets: [
      "finalQualityGates",
      "finalSmokeChecklist",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalImportReadinessMap",
    ],
    verification_tags: ["must-not-claim", "text-only", "no-a11-integration"],
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

export const PUNJABI_FINAL_COVERAGE_VERIFICATION_PACK_ROUTES = [
  {
    id: "coverage-route-levels",
    vi: "Kiểm A1-C2, learner support và Canada domains.",
    en: "Check A1-C2, learner support, and Canada domains.",
    item_ids: [
      "coverage-cross-level-a1-c2",
      "coverage-learner-support",
      "coverage-canada-domains",
    ],
  },
  {
    id: "coverage-route-quality",
    vi: "Kiểm Gurmukhi, remediation, duplicate IDs và naming consistency.",
    en: "Check Gurmukhi, remediation, duplicate IDs, and naming consistency.",
    item_ids: [
      "coverage-gurmukhi-script",
      "coverage-remediation-paths",
      "coverage-duplicate-id-checks",
      "coverage-naming-consistency",
    ],
  },
  {
    id: "coverage-route-boundary",
    vi: "Kiểm pre-integration boundary, native review deferred và forbidden claims.",
    en: "Check pre-integration boundary, deferred native review, and forbidden claims.",
    item_ids: [
      "coverage-pre-integration-verification",
      "coverage-deferred-review",
      "coverage-forbidden-claims",
    ],
  },
];

export const PUNJABI_FINAL_COVERAGE_VERIFICATION_PACK_ROOT = {
  scope: PUNJABI_FINAL_COVERAGE_VERIFICATION_PACK_SCOPE,
  areas: PUNJABI_FINAL_COVERAGE_VERIFICATION_PACK_AREAS,
  verification_items: PUNJABI_FINAL_COVERAGE_VERIFICATION_PACK,
  routes: PUNJABI_FINAL_COVERAGE_VERIFICATION_PACK_ROUTES,
};

export default PUNJABI_FINAL_COVERAGE_VERIFICATION_PACK_ROOT;
