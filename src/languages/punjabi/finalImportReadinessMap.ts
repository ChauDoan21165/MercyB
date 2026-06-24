// src/languages/punjabi/finalImportReadinessMap.ts
//
// Wave 33 final import-readiness map for Punjabi.
// This is pre-integration data for later A11 only. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalImportReadinessArea =
  | "import_groups"
  | "naming_patterns"
  | "duplicate_risk"
  | "level_coverage"
  | "script_coverage"
  | "canada_domains"
  | "remediation_coverage"
  | "import_readiness"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiFinalImportReadinessStatus =
  | "ready_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalImportReadinessItem = {
  id: string;
  area: PunjabiFinalImportReadinessArea;
  status: PunjabiFinalImportReadinessStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  import_vi: string;
  import_en: string;
  regression_vi: string;
  regression_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  expected_imports: string[];
  naming_patterns: string[];
  import_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_IMPORT_READINESS_MAP_SCOPE = {
  wave: "Wave 33",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  purpose_vi:
    "Final import-readiness map này chỉ lập bản đồ import cho later A11; nó không thực hiện integration.",
  purpose_en:
    "This final import-readiness map only maps imports for later A11; it does not perform integration.",
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

export const PUNJABI_FINAL_IMPORT_READINESS_MAP_SCOPE_ALIAS =
  PUNJABI_FINAL_IMPORT_READINESS_MAP_SCOPE;

export const PUNJABI_FINAL_IMPORT_READINESS_MAP_PLAN_SCOPE =
  PUNJABI_FINAL_IMPORT_READINESS_MAP_SCOPE;

export const PUNJABI_FINAL_IMPORT_READINESS_MAP_AREAS: PunjabiFinalImportReadinessArea[] = [
  "import_groups",
  "naming_patterns",
  "duplicate_risk",
  "level_coverage",
  "script_coverage",
  "canada_domains",
  "remediation_coverage",
  "import_readiness",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_FINAL_IMPORT_READINESS_MAP: PunjabiFinalImportReadinessItem[] = [
  {
    id: "import-groups-core",
    area: "import_groups",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ ਗਰੁੱਪ",
    romanization: "import group",
    title_vi: "Nhóm import",
    title_en: "Import groups",
    import_vi:
      "Map core, review và boundary imports theo nhóm để later A11 biết đọc layer nào trước.",
    import_en:
      "Map core, review, and boundary imports as groups so later A11 knows which layer to read first.",
    regression_vi:
      "Nếu import groups lẫn nhau, integration sau này dễ lấy nhầm boundary thay vì core.",
    regression_en:
      "If import groups are mixed, later integration can read boundary data instead of core data.",
    sample: {
      gurmukhi: "ਇੰਪੋਰਟ ਕ੍ਰਮ ਸਾਫ਼ ਰੱਖੋ।",
      romanization: "import kram saaf rakho",
      vi: "Giữ thứ tự import rõ ràng.",
      en: "Keep the import order clear.",
    },
    expected_imports: [
      "index",
      "normalize",
      "lessons",
      "lessons-a1",
      "dialogues",
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "masteryCheckpoints",
      "contentIndex",
    ],
    naming_patterns: ["PUNJABI_*", "Punjabi*", "punjabi*"],
    import_tags: ["core-imports", "review-imports", "boundary-imports"],
    learner_trap_vi:
      "Import group đầy đủ không có nghĩa native review đã xong.",
    learner_trap_en:
      "Complete import groups do not mean native review is done.",
  },
  {
    id: "import-naming-patterns",
    area: "naming_patterns",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਂ ਪੈਟਰਨ",
    romanization: "naam pattern",
    title_vi: "Mẫu đặt tên",
    title_en: "Naming patterns",
    import_vi:
      "File name, named export, default export và item ID phải dùng cùng pattern Punjabi để import ổn định.",
    import_en:
      "File names, named exports, default exports, and item IDs should use the same Punjabi pattern for stable imports.",
    regression_vi:
      "Một tên lệch có thể làm later A11 mất dữ liệu dù file vẫn tồn tại.",
    regression_en:
      "One drifted name can make later A11 miss data even when the file exists.",
    sample: {
      gurmukhi: "ਨਾਂ ਇਕਸਾਰ ਹਨ।",
      romanization: "naam iksar han",
      vi: "Các tên nhất quán.",
      en: "The names are consistent.",
    },
    expected_imports: [
      "finalModuleRegistry",
      "finalContentManifest",
      "finalExportReadiness",
      "finalPackagingReadiness",
      "finalMergeReadinessNotes",
    ],
    naming_patterns: ["final*Readiness*", "PUNJABI_FINAL_*", "punjabiFinal*.test.ts"],
    import_tags: ["naming", "import-readiness", "final-regression"],
    learner_trap_vi:
      "Tên hiển thị đẹp không thay thế được export identifier rõ ràng.",
    learner_trap_en:
      "A clean display name does not replace a clear export identifier.",
  },
  {
    id: "import-duplicate-risk",
    area: "duplicate_risk",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ਖ਼ਤਰਾ",
    romanization: "duplicate khatra",
    title_vi: "Rủi ro trùng",
    title_en: "Duplicate risk",
    import_vi:
      "Trước import, scan item IDs, route IDs, expected imports và export names để giữ one-owner-per-function.",
    import_en:
      "Before import, scan item IDs, route IDs, expected imports, and export names to keep one-owner-per-function.",
    regression_vi:
      "ID trùng khiến route hoặc registry có thể ghi đè mục đúng.",
    regression_en:
      "Duplicate IDs can make a route or registry overwrite the correct item.",
    sample: {
      gurmukhi: "ਇੱਕ ਕੰਮ ਲਈ ਇੱਕ owner।",
      romanization: "ikk kamm lai ikk owner",
      vi: "Một việc chỉ có một owner.",
      en: "One owner for one job.",
    },
    expected_imports: [
      "finalIntegrationEvidenceMap",
      "finalIntegrationRiskRegister",
      "finalIntegrationSanityPack",
      "finalMergeReadinessNotes",
    ],
    naming_patterns: ["unique item.id", "unique route.id", "unique export name"],
    import_tags: ["duplicate-risk", "cross-check", "one-owner"],
    learner_trap_vi:
      "Cùng topic không luôn là trùng; phải so full ID.",
    learner_trap_en:
      "The same topic is not always a duplicate; compare the full ID.",
  },
  {
    id: "import-level-coverage",
    area: "level_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1-C2 ਕਵਰੇਜ",
    romanization: "A1-C2 coverage",
    title_vi: "Phủ A1-C2",
    title_en: "A1-C2 coverage",
    import_vi:
      "Import map phải giữ A1-C2 coverage cho goals, can-do, QA và final readiness.",
    import_en:
      "The import map should preserve A1-C2 coverage for goals, can-do items, QA, and final readiness.",
    regression_vi:
      "Nếu một level không có import owner, learner route bị đứt.",
    regression_en:
      "If one level has no import owner, the learner route breaks.",
    sample: {
      gurmukhi: "A1 ਤੋਂ C2 ਤੱਕ ਰਾਹ ਹੈ।",
      romanization: "A1 ton C2 takk raah hai",
      vi: "Có lộ trình từ A1 đến C2.",
      en: "There is a path from A1 to C2.",
    },
    expected_imports: [
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "masteryCheckpoints",
      "finalCanDoIndex",
      "finalQualityGates",
    ],
    naming_patterns: ["levels: A1-C2", "PunjabiCefrLevel", "level coverage"],
    import_tags: ["a1-c2", "coverage", "learner-route"],
    learner_trap_vi:
      "Coverage A1-C2 không phải official certification claim.",
    learner_trap_en:
      "A1-C2 coverage is not an official certification claim.",
  },
  {
    id: "import-script-coverage",
    area: "script_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਕਵਰੇਜ",
    romanization: "Gurmukhi coverage",
    title_vi: "Phủ Gurmukhi",
    title_en: "Gurmukhi coverage",
    import_vi:
      "Gurmukhi phải là primary script trong imported samples; romanization chỉ hỗ trợ khi hữu ích.",
    import_en:
      "Gurmukhi should be the primary script in imported samples; romanization supports only where useful.",
    regression_vi:
      "Nếu import chỉ giữ romanization, learner mất đường học chữ chính.",
    regression_en:
      "If imports keep only romanization, learners lose the primary-script path.",
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ ਪੜ੍ਹੋ।",
      romanization: "Gurmukhi pehlan parho",
      vi: "Đọc Gurmukhi trước.",
      en: "Read Gurmukhi first.",
    },
    expected_imports: [
      "normalize",
      "lessons",
      "lessons-a1",
      "skillDependencyGraph",
      "finalIntegrationGuardrails",
    ],
    naming_patterns: ["primary_script: Gurmukhi", "romanization", "awareness-only Shahmukhi"],
    import_tags: ["gurmukhi-first", "script", "romanization-support"],
    learner_trap_vi:
      "Shahmukhi chỉ là awareness-only, không phải full course.",
    learner_trap_en:
      "Shahmukhi is awareness-only, not a full course.",
  },
  {
    id: "import-canada-domains",
    area: "canada_domains",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਕੈਨੇਡਾ ਵਰਤੋਂ",
    romanization: "Canada varton",
    title_vi: "Tình huống Canada",
    title_en: "Canada domains",
    import_vi:
      "Map imports cho survival, clinic, school, workplace, transit và public-service use cases ở Canada.",
    import_en:
      "Map imports for survival, clinic, school, workplace, transit, and public-service use cases in Canada.",
    regression_vi:
      "Nếu Canada domains thiếu import group, nội dung thực dụng bị khó tìm.",
    regression_en:
      "If Canada domains lack an import group, practical content becomes hard to find.",
    sample: {
      gurmukhi: "ਮੈਨੂੰ ਫਾਰਮ ਭਰਨਾ ਹੈ।",
      romanization: "mainu form bharna hai",
      vi: "Tôi cần điền mẫu.",
      en: "I need to fill out a form.",
    },
    expected_imports: [
      "dialogues",
      "contentIndex",
      "integrationReadinessChecklist",
      "preIntegrationCoverageMap",
      "finalNavigationMap",
      "finalSmokeChecklist",
    ],
    naming_patterns: ["canada domains", "public service", "healthcare"],
    import_tags: ["canada-practical", "public-service", "survival"],
    canada_practical:
      "Use text-only form, appointment, workplace, school, transit, and public-service examples.",
    learner_trap_vi:
      "Ví dụ Canada-practical không phải tư vấn pháp lý hay y tế.",
    learner_trap_en:
      "Canada-practical examples are not legal or medical advice.",
  },
  {
    id: "import-remediation-coverage",
    area: "remediation_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੀਮੀਡੀਏਸ਼ਨ ਰਾਹ",
    romanization: "remediation raah",
    title_vi: "Lộ trình sửa lỗi",
    title_en: "Remediation path",
    import_vi:
      "Remediation imports phải giữ script confusion, postpositions, register và Canada-domain repair paths.",
    import_en:
      "Remediation imports should keep script confusion, postpositions, register, and Canada-domain repair paths.",
    regression_vi:
      "Nếu import bỏ remediation, QA chỉ phát hiện lỗi mà không giúp sửa.",
    regression_en:
      "If imports drop remediation, QA finds errors without helping repair them.",
    sample: {
      gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰੋ।",
      romanization: "galti thik karo",
      vi: "Hãy sửa lỗi.",
      en: "Fix the error.",
    },
    expected_imports: [
      "skillDependencyGraph",
      "masteryCheckpoints",
      "finalCanDoIndex",
      "finalQualityGates",
      "finalIntegrationStabilityPlan",
    ],
    naming_patterns: ["remediation", "learner trap", "repair path"],
    import_tags: ["remediation", "final-regression", "learner-traps"],
    learner_trap_vi:
      "Remediation text-only không tạo pronunciation scoring.",
    learner_trap_en:
      "Text-only remediation does not create pronunciation scoring.",
  },
  {
    id: "import-readiness-boundary",
    area: "import_readiness",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ ਤਿਆਰੀ",
    romanization: "import tiari",
    title_vi: "Sẵn sàng import",
    title_en: "Import readiness",
    import_vi:
      "Map này chỉ chuẩn bị expected imports, routes và naming checks; không sửa integration wiring.",
    import_en:
      "This map only prepares expected imports, routes, and naming checks; it does not edit integration wiring.",
    regression_vi:
      "Nếu wave này chạm integration wiring, nó vượt allowed files.",
    regression_en:
      "If this wave touches integration wiring, it exceeds the allowed files.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ ਨਕਸ਼ਾ ਹੈ।",
      romanization: "ih siraf naksha hai",
      vi: "Đây chỉ là bản đồ.",
      en: "This is only a map.",
    },
    expected_imports: [
      "finalExportReadiness",
      "finalPackagingReadiness",
      "finalIntegrationDryRunPlan",
      "finalA11HandoffNotes",
      "finalIntegrationSanityPack",
      "finalMergeReadinessNotes",
    ],
    naming_patterns: ["expected imports", "routes", "not integration wiring"],
    import_tags: ["import-readiness", "pre-integration", "not-a11"],
    learner_trap_vi:
      "Import readiness không đồng nghĩa với deploy, push hoặc integration thật.",
    learner_trap_en:
      "Import readiness does not mean real deployment, push, or integration.",
  },
  {
    id: "import-deferred-review",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ",
    romanization: "multavi samikhia",
    title_vi: "Review hoãn",
    title_en: "Deferred review",
    import_vi:
      "Native review phải được ghi là deferred trong import map; không được claim completion.",
    import_en:
      "Native review is deferred in the import map; completion is not claimed.",
    regression_vi:
      "Nếu đổi thành approved, map nói quá trạng thái nội dung.",
    regression_en:
      "If this changes to approved, the map overstates content status.",
    sample: {
      gurmukhi: "review ਅਜੇ ਬਾਕੀ ਹੈ।",
      romanization: "review aje baki hai",
      vi: "Review vẫn còn chờ.",
      en: "Review is still pending.",
    },
    expected_imports: [
      "preMrAuditChecklist",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
      "finalIntegrationRiskRegister",
    ],
    naming_patterns: ["native review deferred", "completion not claimed"],
    import_tags: ["deferred-review", "native-review", "boundary"],
    learner_trap_vi:
      "Deferred không bao giờ nên được trình bày như đã hoàn tất.",
    learner_trap_en:
      "Deferred should never be presented as complete.",
    must_not_claim_vi: "Không claim native review hoặc completion đã xong.",
    must_not_claim_en: "Do not claim native review or completion is done.",
  },
  {
    id: "import-forbidden-claims",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾ claim ਕਰੋ",
    romanization: "na claim karo",
    title_vi: "Không claim",
    title_en: "Must not claim",
    import_vi:
      "Không claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy hoặc A11 integration.",
    import_en:
      "Do not claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy, or A11 integration.",
    regression_vi:
      "Nếu wording quảng bá lọt vào, import map sẽ nói sai khả năng hệ thống.",
    regression_en:
      "If promotional wording slips in, the import map misstates system capability.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ text ਹੈ।",
      romanization: "ih siraf text hai",
      vi: "Đây chỉ là text.",
      en: "This is text only.",
    },
    expected_imports: [
      "finalQualityGates",
      "finalSmokeChecklist",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalMergeReadinessNotes",
    ],
    naming_patterns: ["text only", "no A11 integration", "forbidden claims"],
    import_tags: ["must-not-claim", "text-only", "no-a11-integration"],
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

export const PUNJABI_FINAL_IMPORT_READINESS_MAP_ROUTES = [
  {
    id: "import-route-structure",
    vi: "Kiểm import groups, naming patterns và duplicate risk.",
    en: "Check import groups, naming patterns, and duplicate risk.",
    item_ids: [
      "import-groups-core",
      "import-naming-patterns",
      "import-duplicate-risk",
    ],
  },
  {
    id: "import-route-coverage",
    vi: "Kiểm A1-C2, Gurmukhi-first, Canada domains và remediation.",
    en: "Check A1-C2, Gurmukhi-first, Canada domains, and remediation.",
    item_ids: [
      "import-level-coverage",
      "import-script-coverage",
      "import-canada-domains",
      "import-remediation-coverage",
    ],
  },
  {
    id: "import-route-boundary",
    vi: "Kiểm import readiness, native review deferred và forbidden claims.",
    en: "Check import readiness, deferred native review, and forbidden claims.",
    item_ids: [
      "import-readiness-boundary",
      "import-deferred-review",
      "import-forbidden-claims",
    ],
  },
];

export const PUNJABI_FINAL_IMPORT_READINESS_MAP_ROOT = {
  scope: PUNJABI_FINAL_IMPORT_READINESS_MAP_SCOPE,
  areas: PUNJABI_FINAL_IMPORT_READINESS_MAP_AREAS,
  import_items: PUNJABI_FINAL_IMPORT_READINESS_MAP,
  routes: PUNJABI_FINAL_IMPORT_READINESS_MAP_ROUTES,
};

export default PUNJABI_FINAL_IMPORT_READINESS_MAP_ROOT;
