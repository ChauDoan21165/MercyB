// src/languages/punjabi/finalPackagingReadiness.ts
//
// Wave 25 final packaging readiness for Punjabi.
// This is not A11 integration. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalPackagingReadinessArea =
  | "module_grouping"
  | "naming_consistency"
  | "export_expectations"
  | "level_coverage"
  | "gurmukhi_first"
  | "learner_support"
  | "canada_domain"
  | "final_safety"
  | "regression_checks"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiFinalPackagingReadinessStatus =
  | "ready_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalPackagingReadinessItem = {
  id: string;
  area: PunjabiFinalPackagingReadinessArea;
  status: PunjabiFinalPackagingReadinessStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  readiness_vi: string;
  readiness_en: string;
  packaging_vi: string;
  packaging_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  expected_modules: string[];
  export_groups: string[];
  packaging_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_PACKAGING_READINESS_SCOPE = {
  wave: "Wave 25",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  script_note_vi:
    "Packaging readiness này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ là awareness-only, không phải full course.",
  script_note_en:
    "This packaging-readiness packet uses Gurmukhi as the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã hoàn tất.",
  native_review_en: "Native review is deferred; completion is not claimed.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
};

export const PUNJABI_FINAL_PACKAGING_READINESS_AREAS: PunjabiFinalPackagingReadinessArea[] = [
  "module_grouping",
  "naming_consistency",
  "export_expectations",
  "level_coverage",
  "gurmukhi_first",
  "learner_support",
  "canada_domain",
  "final_safety",
  "regression_checks",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_FINAL_PACKAGING_READINESS: PunjabiFinalPackagingReadinessItem[] = [
  {
    id: "packaging-module-grouping",
    area: "module_grouping",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ grouping",
    romanization: "module grouping",
    title_vi: "Nhóm module",
    title_en: "Module grouping",
    readiness_vi:
      "Packaging phải gom foundation, dialogues, maps, indexes, QA, manifest, smoke, evidence và review artifacts vào nhóm rõ ràng.",
    readiness_en:
      "Packaging should group foundation, dialogues, maps, indexes, QA, manifest, smoke, evidence, and review artifacts clearly.",
    packaging_vi:
      "Nhóm file phải đủ rõ để later A11 không phải đoán file nào là entry point.",
    packaging_en:
      "File groups should be clear enough that later A11 does not need to guess the entry point.",
    sample: {
      gurmukhi: "ਸੂਚੀ ਸਾਫ਼ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
      romanization: "suchi saaf honi chahidi hai",
      vi: "Danh sách phải rõ ràng.",
      en: "The list should be clear.",
    },
    expected_modules: [
      "index",
      "dialogues",
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "masteryCheckpoints",
      "contentIndex",
      "finalModuleRegistry",
      "finalCanDoIndex",
      "finalQaInventory",
      "preMrAuditChecklist",
      "preIntegrationHandoffMap",
      "finalNavigationMap",
      "finalQualityGates",
      "finalContentManifest",
      "finalSmokeChecklist",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
      "finalIntegrationRiskRegister",
      "finalExportReadiness",
    ],
    export_groups: ["core_exports", "review_exports", "boundary_exports"],
    packaging_tags: ["grouping", "entry-point", "clear-packaging"],
    learner_trap_vi:
      "Nhóm module rõ ràng không có nghĩa là native review đã xong.",
    learner_trap_en:
      "Clear module grouping does not mean native review is finished.",
  },
  {
    id: "packaging-naming-consistency",
    area: "naming_consistency",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਮ consistency",
    romanization: "naming consistency",
    title_vi: "Nhất quán tên",
    title_en: "Naming consistency",
    readiness_vi:
      "Tên file, root export, item ID và route ID phải khớp nhau để tránh packaging drift.",
    readiness_en:
      "File names, root exports, item IDs, and route IDs must match to avoid packaging drift.",
    packaging_vi:
      "Nếu một phần đổi tên mà phần khác không đổi, package sẽ khó kiểm tra.",
    packaging_en:
      "If one part is renamed and the others are not, the package becomes hard to verify.",
    sample: {
      gurmukhi: "ਨਾਮ ਇਕਸਾਰ ਰੱਖੋ।",
      romanization: "naam iksar rakho",
      vi: "Giữ tên nhất quán.",
      en: "Keep names consistent.",
    },
    expected_modules: [
      "finalContentManifest",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
      "finalIntegrationRiskRegister",
      "finalExportReadiness",
    ],
    export_groups: ["naming_exports", "route_exports", "boundary_exports"],
    packaging_tags: ["naming", "consistency", "ids"],
    learner_trap_vi:
      "Tên nhất quán không đồng nghĩa là content đã được duyệt bản ngữ.",
    learner_trap_en:
      "Consistent names do not mean the content has native review.",
  },
  {
    id: "packaging-export-expectations",
    area: "export_expectations",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਐਕਸਪੋਰਟ ਉਮੀਦਾਂ",
    romanization: "export umidaan",
    title_vi: "Kỳ vọng export",
    title_en: "Export expectations",
    readiness_vi:
      "Export packet cần chỉ rõ root export, default export và route export để consumer đọc được ngay.",
    readiness_en:
      "The export packet should clearly state root exports, default exports, and route exports so consumers can read it immediately.",
    packaging_vi:
      "Các export expectation phải khớp với pattern của final modules hiện có.",
    packaging_en:
      "Export expectations must match the pattern of the existing final modules.",
    sample: {
      gurmukhi: "ਐਕਸਪੋਰਟ ਸਪਸ਼ਟ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।",
      romanization: "export spasht hone chahide han",
      vi: "Export phải rõ.",
      en: "Exports must be clear.",
    },
    expected_modules: [
      "finalModuleRegistry",
      "finalContentManifest",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
      "finalIntegrationRiskRegister",
    ],
    export_groups: ["export_exports", "default_exports", "route_exports"],
    packaging_tags: ["exports", "consumer-ready", "pattern-match"],
    learner_trap_vi:
      "Có export không có nghĩa là tất cả boundary đã an toàn.",
    learner_trap_en:
      "Having exports does not mean every boundary is safe.",
  },
  {
    id: "packaging-level-coverage",
    area: "level_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਪੱਧਰ ਕਵਰੇਜ",
    romanization: "paddar coverage",
    title_vi: "Độ phủ level",
    title_en: "Level coverage",
    readiness_vi:
      "A1-C2 phải xuất hiện trong package, manifest, summary, risk, review và export readiness.",
    readiness_en:
      "A1-C2 should appear in the package, manifest, summary, risk, review, and export readiness.",
    packaging_vi:
      "Thiếu một level có thể làm package không route được từ foundation đến final review.",
    packaging_en:
      "Missing one level can make the package unable to route from foundation to final review.",
    sample: {
      gurmukhi: "ਹਰ ਪੱਧਰ ਲਈ ਨਕਸ਼ਾ ਹੈ।",
      romanization: "har paddar lai naksha hai",
      vi: "Có bản đồ cho từng cấp.",
      en: "There is a map for each level.",
    },
    expected_modules: [
      "courseMap",
      "progressionMatrix",
      "masteryCheckpoints",
      "finalCanDoIndex",
      "finalQualityGates",
      "finalSmokeChecklist",
    ],
    export_groups: ["level_exports", "route_exports"],
    packaging_tags: ["A1-C2", "coverage", "level-map"],
    learner_trap_vi:
      "A1-C2 là khung học, không phải bằng cấp chính thức.",
    learner_trap_en:
      "A1-C2 is a learning frame, not an official certificate.",
  },
  {
    id: "packaging-gurmukhi-first",
    area: "gurmukhi_first",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ",
    romanization: "Gurmukhi pehlan",
    title_vi: "Gurmukhi trước",
    title_en: "Gurmukhi first",
    readiness_vi:
      "Gurmukhi phải đứng trước romanization trong title, sample và export preview.",
    readiness_en:
      "Gurmukhi must appear before romanization in the title, sample, and export preview.",
    packaging_vi:
      "Nếu romanization lấn lên trước, người học sẽ mất tín hiệu script chính.",
    packaging_en:
      "If romanization comes first, learners lose the primary script signal.",
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਲਿਪੀ",
      romanization: "Gurmukhi lipi",
      vi: "chữ Gurmukhi",
      en: "Gurmukhi script",
    },
    expected_modules: [
      "index",
      "lessons-a1",
      "dialogues",
      "finalNavigationMap",
      "finalContentManifest",
    ],
    export_groups: ["script_exports", "preview_exports"],
    packaging_tags: ["gurmukhi-first", "script-order", "preview"],
    learner_trap_vi:
      "Romanization không thể hiện đầy đủ bật hơi và retroflex.",
    learner_trap_en:
      "Romanization does not fully show aspiration and retroflex.",
  },
  {
    id: "packaging-vi-en-support",
    area: "learner_support",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਦੋ-ਭਾਸ਼ੀ ਸਹਾਇਤਾ",
    romanization: "do-bhashi sahaita",
    title_vi: "Hỗ trợ Việt-Anh",
    title_en: "Vietnamese-English support",
    readiness_vi:
      "Packaging-ready data cần có giải thích bằng tiếng Việt và tiếng Anh cho mục tiêu, trap, QA và output check.",
    readiness_en:
      "Packaging-ready data needs Vietnamese and English explanations for goals, traps, QA, and output checks.",
    packaging_vi:
      "Người học Việt cần note rõ, không chỉ translation.",
    packaging_en:
      "Vietnamese-speaking learners need explicit notes, not just translation.",
    sample: {
      gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।",
      romanization: "kirpa karke hauli bolo",
      vi: "Xin vui lòng nói chậm.",
      en: "Please speak slowly.",
    },
    expected_modules: [
      "dialogues",
      "learningPath",
      "contentIndex",
      "finalQaInventory",
      "finalOwnerReviewPacket",
    ],
    export_groups: ["learner_exports", "qa_exports"],
    packaging_tags: ["vi-support", "en-support", "learner-notes"],
    learner_trap_vi:
      "Translation không thay thế ghi chú lỗi riêng cho người Việt.",
    learner_trap_en:
      "Translation does not replace learner-specific error notes.",
  },
  {
    id: "packaging-canada-domains",
    area: "canada_domain",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2"],
    title_pa: "ਕੈਨੇਡਾ packaging",
    romanization: "Canada packaging",
    title_vi: "Miền Canada",
    title_en: "Canada packaging",
    readiness_vi:
      "Package cần giữ settlement, school office, work, clinic, address và documents đủ cụ thể.",
    readiness_en:
      "The package should keep settlement, school office, work, clinic, address, and documents concrete.",
    packaging_vi:
      "Nếu quá chung chung, export trông như textbook chứ không như tình huống Canada thật.",
    packaging_en:
      "If too vague, the export will feel like a textbook rather than a real Canada situation.",
    sample: {
      gurmukhi: "ਮੇਰਾ ਪਤਾ ਬਦਲ ਗਿਆ ਹੈ।",
      romanization: "mera pata badal gia hai",
      vi: "Địa chỉ của tôi đã thay đổi.",
      en: "My address has changed.",
    },
    expected_modules: [
      "dialogues",
      "finalCanDoIndex",
      "finalNavigationMap",
      "finalSmokeChecklist",
      "finalIntegrationEvidenceMap",
    ],
    export_groups: ["canada_exports", "public_service_exports"],
    packaging_tags: ["canada-practical", "settlement", "public-service"],
    learner_trap_vi:
      "Pata là address; đừng lẫn với phone number hoặc document number.",
    learner_trap_en:
      "Pata means address; do not confuse it with a phone number or document number.",
    canada_practical:
      "Settlement forms, school offices, municipal counters, community forms, and clinic intake in Canada.",
  },
  {
    id: "packaging-final-safety",
    area: "final_safety",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਫਾਈਨਲ safety",
    romanization: "final safety",
    title_vi: "An toàn cuối",
    title_en: "Final safety",
    readiness_vi:
      "Final safety nên kiểm line-up giữa manifest, evidence, summary, review packets và risk register.",
    readiness_en:
      "Final safety should check alignment among the manifest, evidence, summary, review packets, and risk register.",
    packaging_vi:
      "Một file đẹp không bù cho một bundle lệch tên hoặc lệch route.",
    packaging_en:
      "A polished file does not compensate for a bundle with mismatched names or routes.",
    sample: {
      gurmukhi: "ਇਕਸਾਰਤਾ ਜ਼ਰੂਰੀ ਹੈ।",
      romanization: "iksarata zaruri hai",
      vi: "Tính nhất quán là bắt buộc.",
      en: "Consistency is required.",
    },
    expected_modules: [
      "finalModuleRegistry",
      "finalContentManifest",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
      "finalIntegrationRiskRegister",
      "finalExportReadiness",
    ],
    export_groups: ["safety_exports", "consistency_exports"],
    packaging_tags: ["safety", "bundle-check", "consistency"],
    learner_trap_vi:
      "An toàn cuối không đồng nghĩa native review đã xong.",
    learner_trap_en:
      "Final safety does not mean native review is finished.",
  },
  {
    id: "packaging-regression-checks",
    area: "regression_checks",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰਿਗ੍ਰੈਸ਼ਨ ਜਾਂਚ",
    romanization: "regression janch",
    title_vi: "Kiểm regression",
    title_en: "Regression checks",
    readiness_vi:
      "Regression checks nên bắt duplicate modules, missing exports, script drift và broken routes trước khi release.",
    readiness_en:
      "Regression checks should catch duplicate modules, missing exports, script drift, and broken routes before release.",
    packaging_vi:
      "Nếu package chỉ pass trên một file, toàn bộ export set vẫn có thể lệch.",
    packaging_en:
      "If the package only passes on one file, the whole export set can still be off.",
    sample: {
      gurmukhi: "ਗ਼ਲਤੀ ਮੁੜ ਨਾ ਆਵੇ।",
      romanization: "galti mudh na ave",
      vi: "Lỗi không nên quay lại.",
      en: "The error should not come back.",
    },
    expected_modules: [
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
      "finalIntegrationRiskRegister",
      "finalSmokeChecklist",
    ],
    export_groups: ["regression_exports", "scan_exports"],
    packaging_tags: ["regression", "scan", "release-check"],
    learner_trap_vi:
      "Regression check không thay thế review bằng mắt người.",
    learner_trap_en:
      "Regression checks do not replace human review.",
  },
  {
    id: "packaging-deferred-review",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ review",
    romanization: "multavi review",
    title_vi: "Review hoãn",
    title_en: "Deferred review",
    readiness_vi:
      "Native review phải giữ là deferred trong mọi packaging note, không được ghi như đã hoàn tất.",
    readiness_en:
      "Native review is deferred in every packaging note and completion is not claimed; it must not be written as complete.",
    packaging_vi:
      "Nếu label đổi sang done hay approved, packaging readiness đã vượt scope.",
    packaging_en:
      "If the label changes to done or approved, packaging readiness has gone out of scope.",
    sample: {
      gurmukhi: "review ਅਜੇ ਬਾਕੀ ਹੈ।",
      romanization: "review aje baki hai",
      vi: "Review vẫn còn đang chờ.",
      en: "Review is still pending.",
    },
    expected_modules: [
      "preMrAuditChecklist",
      "preIntegrationHandoffMap",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
    ],
    export_groups: ["boundary_exports", "review_exports"],
    packaging_tags: ["deferred", "native-review", "boundary"],
    learner_trap_vi:
      "Deferred không bao giờ nên được trình bày như hoàn tất.",
    learner_trap_en:
      "Deferred should never be presented as complete.",
    must_not_claim_vi: "Không claim native review hoặc completion đã xong.",
    must_not_claim_en: "Do not claim native review or completion is done.",
  },
  {
    id: "packaging-forbidden-claims",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾ claim ਕਰੋ",
    romanization: "na claim karo",
    title_vi: "Không được claim",
    title_en: "Must not claim",
    readiness_vi:
      "Packaging readiness không được claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy hoặc A11 integration.",
    readiness_en:
      "Packaging readiness must not claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy, not A11 integration, or no A11 integration.",
    packaging_vi:
      "Nếu wording quảng bá lấn vào, package sẽ kể sai khả năng hệ thống.",
    packaging_en:
      "If promotional wording slips in, the package will misstate system capability.",
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
      "finalOwnerReviewPacket",
    ],
    export_groups: ["boundary_exports", "safe_exports"],
    packaging_tags: ["must-not-claim", "text-only", "not-a11"],
    learner_trap_vi:
      "Text-only data không tự sinh audio hay scoring.",
    learner_trap_en:
      "Text only data does not create audio or scoring.",
    must_not_claim_vi:
      "Không claim audio, scoring, Azure, Supabase, deploy, push hoặc A11 integration.",
    must_not_claim_en:
      "Do not claim audio, scoring, Azure, Supabase, deploy, push, or A11 integration.",
  },
];

export const PUNJABI_FINAL_PACKAGING_READINESS_ROUTES = [
  {
    id: "packaging-route-grouping",
    vi: "Kiểm grouping, naming và export expectations.",
    en: "Check grouping, naming, and export expectations.",
    item_ids: ["packaging-module-grouping", "packaging-naming-consistency", "packaging-export-expectations"],
  },
  {
    id: "packaging-route-support",
    vi: "Kiểm level coverage, Gurmukhi-first, VI/EN support và Canada domains.",
    en: "Check level coverage, Gurmukhi-first, VI/EN support, and Canada domains.",
    item_ids: ["packaging-level-coverage", "packaging-gurmukhi-first", "packaging-vi-en-support", "packaging-canada-domains"],
  },
  {
    id: "packaging-route-boundary",
    vi: "Kiểm final safety, regression, deferred review và forbidden claims.",
    en: "Check final safety, regression, deferred review, and forbidden claims.",
    item_ids: ["packaging-final-safety", "packaging-regression-checks", "packaging-deferred-review", "packaging-forbidden-claims"],
  },
];

export const PUNJABI_FINAL_PACKAGING_READINESS_ROOT = {
  scope: PUNJABI_FINAL_PACKAGING_READINESS_SCOPE,
  areas: PUNJABI_FINAL_PACKAGING_READINESS_AREAS,
  readiness: PUNJABI_FINAL_PACKAGING_READINESS,
  routes: PUNJABI_FINAL_PACKAGING_READINESS_ROUTES,
};

export default PUNJABI_FINAL_PACKAGING_READINESS_ROOT;
