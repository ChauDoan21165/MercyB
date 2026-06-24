// src/languages/punjabi/finalMergeReadinessNotes.ts
//
// Wave 32 final merge-readiness notes for Punjabi.
// This is pre-integration data for later A11 only. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalMergeReadinessArea =
  | "module_families"
  | "export_checks"
  | "duplicate_risk"
  | "level_coverage"
  | "script_coverage"
  | "canada_domains"
  | "remediation_coverage"
  | "merge_readiness"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiFinalMergeReadinessStatus =
  | "ready_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalMergeReadinessItem = {
  id: string;
  area: PunjabiFinalMergeReadinessArea;
  status: PunjabiFinalMergeReadinessStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  note_vi: string;
  note_en: string;
  regression_vi: string;
  regression_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  expected_modules: string[];
  export_groups: string[];
  merge_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_MERGE_READINESS_NOTES_SCOPE = {
  wave: "Wave 32",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  purpose_vi:
    "Final merge-readiness notes này chỉ dùng để kiểm tra trước later A11; nó không thực hiện tích hợp.",
  purpose_en:
    "These final merge-readiness notes are only for checking before later A11; they do not perform integration.",
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

export const PUNJABI_FINAL_MERGE_READINESS_NOTES_SCOPE_ALIAS =
  PUNJABI_FINAL_MERGE_READINESS_NOTES_SCOPE;

export const PUNJABI_FINAL_MERGE_READINESS_NOTES_PLAN_SCOPE =
  PUNJABI_FINAL_MERGE_READINESS_NOTES_SCOPE;

export const PUNJABI_FINAL_MERGE_READINESS_NOTES_AREAS: PunjabiFinalMergeReadinessArea[] = [
  "module_families",
  "export_checks",
  "duplicate_risk",
  "level_coverage",
  "script_coverage",
  "canada_domains",
  "remediation_coverage",
  "merge_readiness",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_FINAL_MERGE_READINESS_NOTES: PunjabiFinalMergeReadinessItem[] = [
  {
    id: "merge-module-families",
    area: "module_families",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ",
    romanization: "module parivaar",
    title_vi: "Nhóm module",
    title_en: "Module families",
    note_vi:
      "Trước merge, kiểm foundation, dialogue, map, registry, QA, manifest và boundary files theo nhóm rõ ràng.",
    note_en:
      "Before merge, check foundation, dialogue, map, registry, QA, manifest, and boundary files as clear families.",
    regression_vi:
      "Nếu family bị thiếu, later A11 sẽ nhận một bộ Punjabi không đầy đủ.",
    regression_en:
      "If a family is missing, later A11 receives an incomplete Punjabi set.",
    sample: {
      gurmukhi: "ਸਾਰੇ ਹਿੱਸੇ ਇਕੱਠੇ ਵੇਖੋ।",
      romanization: "saare hisse ikatthe vekho",
      vi: "Hãy xem tất cả phần cùng nhau.",
      en: "View all parts together.",
    },
    expected_modules: [
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
      "finalModuleRegistry",
      "finalQaInventory",
      "finalContentManifest",
    ],
    export_groups: ["core_exports", "review_exports", "boundary_exports"],
    merge_tags: ["module-families", "merge-readiness", "pre-integration"],
    learner_trap_vi:
      "Có đủ file không có nghĩa nội dung đã được native review.",
    learner_trap_en:
      "Having the files does not mean the content has been native reviewed.",
  },
  {
    id: "merge-export-checks",
    area: "export_checks",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਐਕਸਪੋਰਟ ਜਾਂਚ",
    romanization: "export janch",
    title_vi: "Kiểm export",
    title_en: "Export checks",
    note_vi:
      "So export name, default export và route groups trước merge để tránh drift giữa files.",
    note_en:
      "Compare export names, default exports, and route groups before merge to avoid drift across files.",
    regression_vi:
      "Một export đổi tên có thể làm later A11 import sai hoặc bỏ sót dữ liệu.",
    regression_en:
      "One renamed export can make later A11 import the wrong data or miss data.",
    sample: {
      gurmukhi: "ਨਾਂ ਇਕਸਾਰ ਰੱਖੋ।",
      romanization: "naam iksar rakho",
      vi: "Giữ tên nhất quán.",
      en: "Keep names consistent.",
    },
    expected_modules: [
      "finalExportReadiness",
      "finalPackagingReadiness",
      "finalIntegrationStabilityPlan",
      "finalIntegrationGuardrails",
      "finalIntegrationDryRunPlan",
      "finalA11HandoffNotes",
      "finalIntegrationSanityPack",
    ],
    export_groups: ["naming_exports", "route_exports", "order_exports"],
    merge_tags: ["exports", "naming", "final-regression"],
    learner_trap_vi:
      "Tên giống nhau ở UI label không đủ; phải kiểm export identifier.",
    learner_trap_en:
      "Similar UI labels are not enough; check export identifiers.",
  },
  {
    id: "merge-duplicate-risk",
    area: "duplicate_risk",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ਖ਼ਤਰਾ",
    romanization: "duplicate khatra",
    title_vi: "Rủi ro trùng ID",
    title_en: "Duplicate ID risk",
    note_vi:
      "Quét item IDs, route IDs và module IDs để đảm bảo mỗi chức năng chỉ có một owner.",
    note_en:
      "Scan item IDs, route IDs, and module IDs so each function has one owner.",
    regression_vi:
      "ID trùng có thể làm checklist merge ghi đè kết quả đúng.",
    regression_en:
      "Duplicate IDs can make the merge checklist overwrite the correct result.",
    sample: {
      gurmukhi: "ਨਕਲ ਨਾ ਰਹਿਣ ਦਿਓ।",
      romanization: "nakal na rehan dio",
      vi: "Đừng để bản trùng tồn tại.",
      en: "Do not leave duplicates.",
    },
    expected_modules: [
      "finalModuleRegistry",
      "finalContentManifest",
      "finalIntegrationEvidenceMap",
      "finalIntegrationRiskRegister",
      "finalIntegrationSanityPack",
    ],
    export_groups: ["dedupe_exports", "qa_exports", "safe_exports"],
    merge_tags: ["duplicate-risk", "one-owner", "cross-check"],
    learner_trap_vi:
      "Hai mục cùng chủ đề chưa chắc trùng; chỉ full ID mới quyết định.",
    learner_trap_en:
      "Two items with the same topic are not necessarily duplicates; the full ID decides.",
  },
  {
    id: "merge-level-coverage",
    area: "level_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਲੇਵਲ ਕਵਰੇਜ",
    romanization: "level coverage",
    title_vi: "Phủ A1-C2",
    title_en: "A1-C2 coverage",
    note_vi:
      "Merge notes phải xác nhận A1-C2 có mục tiêu, can-do, QA và readiness markers.",
    note_en:
      "Merge notes should confirm A1-C2 has goals, can-do items, QA, and readiness markers.",
    regression_vi:
      "Nếu thiếu một level, learner route cho Vietnamese và English users bị đứt.",
    regression_en:
      "If one level is missing, the learner route for Vietnamese and English users breaks.",
    sample: {
      gurmukhi: "A1 ਤੋਂ C2 ਤੱਕ ਕਵਰੇਜ ਹੈ।",
      romanization: "A1 ton C2 takk coverage hai",
      vi: "Có phủ từ A1 đến C2.",
      en: "Coverage runs from A1 to C2.",
    },
    expected_modules: [
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "masteryCheckpoints",
      "finalCanDoIndex",
      "finalQualityGates",
    ],
    export_groups: ["level_exports", "readiness_exports", "review_exports"],
    merge_tags: ["a1-c2", "learner-route", "coverage"],
    learner_trap_vi:
      "A1-C2 coverage không phải official certification claim.",
    learner_trap_en:
      "A1-C2 coverage is not an official certification claim.",
  },
  {
    id: "merge-script-coverage",
    area: "script_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਰਾਹ",
    romanization: "Gurmukhi raah",
    title_vi: "Lộ trình Gurmukhi",
    title_en: "Gurmukhi path",
    note_vi:
      "Gurmukhi phải là chữ chính trong samples, script notes và remediation. Romanization chỉ hỗ trợ khi hữu ích.",
    note_en:
      "Gurmukhi must be primary in samples, script notes, and remediation. Romanization supports only where useful.",
    regression_vi:
      "Nếu romanization thay Gurmukhi, course mất trọng tâm chữ chính.",
    regression_en:
      "If romanization replaces Gurmukhi, the course loses its primary-script focus.",
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ ਹੈ।",
      romanization: "Gurmukhi pehlan hai",
      vi: "Gurmukhi đi trước.",
      en: "Gurmukhi comes first.",
    },
    expected_modules: [
      "normalize",
      "lessons",
      "lessons-a1",
      "learningPath",
      "skillDependencyGraph",
      "finalIntegrationGuardrails",
    ],
    export_groups: ["script_exports", "learner_exports", "remediation_exports"],
    merge_tags: ["gurmukhi-first", "romanization-support", "script"],
    learner_trap_vi:
      "Shahmukhi chỉ là awareness-only, không phải full course.",
    learner_trap_en:
      "Shahmukhi is awareness-only, not a full course.",
  },
  {
    id: "merge-canada-domains",
    area: "canada_domains",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਕੈਨੇਡਾ ਡੋਮੇਨ",
    romanization: "Canada domain",
    title_vi: "Miền Canada",
    title_en: "Canada domains",
    note_vi:
      "Kiểm survival, workplace, healthcare, school, transit và public-service trước merge.",
    note_en:
      "Check survival, workplace, healthcare, school, transit, and public-service domains before merge.",
    regression_vi:
      "Nếu thiếu public service hoặc healthcare, learner ở Canada thiếu tình huống thực tế.",
    regression_en:
      "If public service or healthcare is missing, learners in Canada lose practical situations.",
    sample: {
      gurmukhi: "ਮੈਨੂੰ appointment ਚਾਹੀਦੀ ਹੈ।",
      romanization: "mainu appointment chahidi hai",
      vi: "Tôi cần một cuộc hẹn.",
      en: "I need an appointment.",
    },
    expected_modules: [
      "dialogues",
      "contentIndex",
      "integrationReadinessChecklist",
      "preIntegrationCoverageMap",
      "finalNavigationMap",
      "finalSmokeChecklist",
    ],
    export_groups: ["canada_exports", "public_service_exports", "preview_exports"],
    merge_tags: ["canada-practical", "public-service", "healthcare"],
    canada_practical:
      "Use text-only appointment, clinic, school, workplace, transit, and public-service examples.",
    learner_trap_vi:
      "Ví dụ Canada-practical không phải tư vấn pháp lý hay y tế.",
    learner_trap_en:
      "Canada-practical examples are not legal or medical advice.",
  },
  {
    id: "merge-remediation-coverage",
    area: "remediation_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੀਮੀਡੀਏਸ਼ਨ",
    romanization: "remediation",
    title_vi: "Phục hồi lỗi",
    title_en: "Remediation coverage",
    note_vi:
      "Merge notes phải giữ remediation cho script confusion, postpositions, register và Canada-domain gaps.",
    note_en:
      "Merge notes should keep remediation for script confusion, postpositions, register, and Canada-domain gaps.",
    regression_vi:
      "Nếu remediation bị mất, learner không có đường sửa lỗi sau QA.",
    regression_en:
      "If remediation is lost, learners have no repair path after QA.",
    sample: {
      gurmukhi: "ਗਲਤੀ ਤੋਂ ਬਾਅਦ ਦੁਬਾਰਾ ਅਭਿਆਸ ਕਰੋ।",
      romanization: "galti ton baad dubara abhyaas karo",
      vi: "Sau lỗi, hãy luyện lại.",
      en: "After an error, practice again.",
    },
    expected_modules: [
      "skillDependencyGraph",
      "masteryCheckpoints",
      "finalCanDoIndex",
      "finalQualityGates",
      "finalIntegrationStabilityPlan",
    ],
    export_groups: ["remediation_exports", "qa_exports", "regression_exports"],
    merge_tags: ["remediation", "learner-traps", "final-regression"],
    learner_trap_vi:
      "Remediation text-only không tạo pronunciation scoring.",
    learner_trap_en:
      "Text-only remediation does not create pronunciation scoring.",
  },
  {
    id: "merge-readiness-boundary",
    area: "merge_readiness",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "merge ਤਿਆਰੀ",
    romanization: "merge readiness",
    title_vi: "Sẵn sàng merge",
    title_en: "Merge readiness",
    note_vi:
      "Đánh dấu readiness bằng checks, routes và tags, nhưng không chạy A11 integration trong wave này.",
    note_en:
      "Mark readiness with checks, routes, and tags, but do not run A11 integration in this wave.",
    regression_vi:
      "Nếu wave này sửa integration wiring, nó đã vượt allowed files.",
    regression_en:
      "If this wave edits integration wiring, it has exceeded the allowed files.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ ਜਾਂਚ ਹੈ।",
      romanization: "ih siraf janch hai",
      vi: "Đây chỉ là kiểm tra.",
      en: "This is only a check.",
    },
    expected_modules: [
      "finalExportReadiness",
      "finalPackagingReadiness",
      "finalIntegrationStabilityPlan",
      "finalIntegrationGuardrails",
      "finalA11HandoffNotes",
      "finalIntegrationSanityPack",
    ],
    export_groups: ["merge_exports", "safe_exports", "boundary_exports"],
    merge_tags: ["merge-readiness", "not-a11", "pre-integration"],
    learner_trap_vi:
      "Readiness notes không đồng nghĩa với deploy hoặc merge thật.",
    learner_trap_en:
      "Readiness notes do not mean real deployment or merge.",
  },
  {
    id: "merge-deferred-review",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ",
    romanization: "multavi samikhia",
    title_vi: "Review hoãn",
    title_en: "Deferred review",
    note_vi:
      "Native review phải được ghi là deferred trong mọi merge-readiness note; không được claim completion.",
    note_en:
      "Native review is deferred in every merge-readiness note; completion is not claimed.",
    regression_vi:
      "Nếu chuyển thành approved, packet đang nói quá khả năng.",
    regression_en:
      "If this changes to approved, the packet overstates capability.",
    sample: {
      gurmukhi: "review ਅਜੇ ਬਾਕੀ ਹੈ।",
      romanization: "review aje baki hai",
      vi: "Review vẫn còn chờ.",
      en: "Review is still pending.",
    },
    expected_modules: [
      "preMrAuditChecklist",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
      "finalIntegrationRiskRegister",
    ],
    export_groups: ["review_exports", "boundary_exports", "safe_exports"],
    merge_tags: ["deferred-review", "native-review", "boundary"],
    learner_trap_vi:
      "Deferred không bao giờ được trình bày như đã hoàn tất.",
    learner_trap_en:
      "Deferred should never be presented as complete.",
    must_not_claim_vi: "Không claim native review hoặc completion đã xong.",
    must_not_claim_en: "Do not claim native review or completion is done.",
  },
  {
    id: "merge-forbidden-claims",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾ claim ਕਰੋ",
    romanization: "na claim karo",
    title_vi: "Không claim",
    title_en: "Must not claim",
    note_vi:
      "Không claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy hoặc A11 integration.",
    note_en:
      "Do not claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy, or A11 integration.",
    regression_vi:
      "Nếu wording quảng bá lọt vào, merge notes sẽ làm sai expectation.",
    regression_en:
      "If promotional wording slips in, merge notes set the wrong expectation.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ text ਹੈ।",
      romanization: "ih siraf text hai",
      vi: "Đây chỉ là text.",
      en: "This is text only.",
    },
    expected_modules: [
      "finalQualityGates",
      "finalSmokeChecklist",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalIntegrationSanityPack",
    ],
    export_groups: ["boundary_exports", "safe_exports", "regression_exports"],
    merge_tags: ["must-not-claim", "text-only", "no-a11-integration"],
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

export const PUNJABI_FINAL_MERGE_READINESS_NOTES_ROUTES = [
  {
    id: "merge-route-structure",
    vi: "Kiểm module families, export checks và duplicate risk trước merge.",
    en: "Check module families, export checks, and duplicate risk before merge.",
    item_ids: [
      "merge-module-families",
      "merge-export-checks",
      "merge-duplicate-risk",
    ],
  },
  {
    id: "merge-route-coverage",
    vi: "Kiểm A1-C2, Gurmukhi-first, Canada domains và remediation.",
    en: "Check A1-C2, Gurmukhi-first, Canada domains, and remediation.",
    item_ids: [
      "merge-level-coverage",
      "merge-script-coverage",
      "merge-canada-domains",
      "merge-remediation-coverage",
    ],
  },
  {
    id: "merge-route-boundary",
    vi: "Kiểm merge readiness, native review deferred và forbidden claims.",
    en: "Check merge readiness, deferred native review, and forbidden claims.",
    item_ids: [
      "merge-readiness-boundary",
      "merge-deferred-review",
      "merge-forbidden-claims",
    ],
  },
];

export const PUNJABI_FINAL_MERGE_READINESS_NOTES_ROOT = {
  scope: PUNJABI_FINAL_MERGE_READINESS_NOTES_SCOPE,
  areas: PUNJABI_FINAL_MERGE_READINESS_NOTES_AREAS,
  merge_items: PUNJABI_FINAL_MERGE_READINESS_NOTES,
  routes: PUNJABI_FINAL_MERGE_READINESS_NOTES_ROUTES,
};

export default PUNJABI_FINAL_MERGE_READINESS_NOTES_ROOT;
