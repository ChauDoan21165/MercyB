// src/languages/punjabi/finalExportReadiness.ts
//
// Wave 24 final export readiness for Punjabi.
// This is not A11 integration. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalExportReadinessArea =
  | "module_inventory"
  | "export_groups"
  | "level_coverage"
  | "gurmukhi_first"
  | "learner_support"
  | "canada_domain"
  | "final_hardening"
  | "regression_checks"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiFinalExportReadinessStatus =
  | "ready_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalExportReadinessItem = {
  id: string;
  area: PunjabiFinalExportReadinessArea;
  status: PunjabiFinalExportReadinessStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  readiness_vi: string;
  readiness_en: string;
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
  readiness_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_EXPORT_READINESS_SCOPE = {
  wave: "Wave 24",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  script_note_vi:
    "Export readiness này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ là awareness-only, không phải full course.",
  script_note_en:
    "This export-readiness packet uses Gurmukhi as the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã hoàn tất.",
  native_review_en: "Native review is deferred; completion is not claimed.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
};

export const PUNJABI_FINAL_EXPORT_READINESS_AREAS: PunjabiFinalExportReadinessArea[] = [
  "module_inventory",
  "export_groups",
  "level_coverage",
  "gurmukhi_first",
  "learner_support",
  "canada_domain",
  "final_hardening",
  "regression_checks",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_FINAL_EXPORT_READINESS: PunjabiFinalExportReadinessItem[] = [
  {
    id: "export-module-inventory",
    area: "module_inventory",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ inventory",
    romanization: "module inventory",
    title_vi: "Kiểm inventory module",
    title_en: "Module inventory",
    readiness_vi:
      "Inventory cuối cùng nên trỏ rõ foundation, dialogues, maps, indexes, QA, manifest, smoke, evidence và review packets.",
    readiness_en:
      "The final inventory should clearly point to foundation, dialogues, maps, indexes, QA, manifest, smoke, evidence, and review packets.",
    regression_vi:
      "Nếu inventory thiếu một file gốc, later A11 dễ dò sai đường vào.",
    regression_en:
      "If the inventory misses a core file, later A11 can easily follow the wrong path.",
    sample: {
      gurmukhi: "ਇਹ ਸੂਚੀ ਪੂਰੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
      romanization: "ih suchi puri honi chahidi hai",
      vi: "Danh sách này phải đầy đủ.",
      en: "This list should be complete.",
    },
    expected_modules: [
      "index",
      "dialogues",
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "finalModuleRegistry",
      "finalContentManifest",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
      "finalIntegrationRiskRegister",
    ],
    export_groups: ["core_exports", "review_exports", "boundary_exports"],
    readiness_tags: ["inventory", "module-map", "export-ready"],
    learner_trap_vi:
      "Inventory đầy đủ không có nghĩa là native review đã xong.",
    learner_trap_en:
      "A complete inventory does not mean native review is finished.",
  },
  {
    id: "export-groups",
    area: "export_groups",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਐਕਸਪੋਰਟ ਸਮੂਹ",
    romanization: "export group",
    title_vi: "Nhóm export",
    title_en: "Export groups",
    readiness_vi:
      "Các export groups nên gom content, review, route và boundary vào nhóm rõ ràng.",
    readiness_en:
      "Export groups should separate content, review, route, and boundary data into clear buckets.",
    regression_vi:
      "Nếu các nhóm export chồng chéo, người triển khai sau này dễ import nhầm.",
    regression_en:
      "If export groups overlap, later implementers can easily import the wrong module.",
    sample: {
      gurmukhi: "ਗਰੁੱਪ ਸਾਫ਼ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।",
      romanization: "group saaf hone chahide han",
      vi: "Các nhóm phải rõ ràng.",
      en: "The groups must be clear.",
    },
    expected_modules: [
      "finalContentManifest",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
      "finalIntegrationRiskRegister",
    ],
    export_groups: ["content_exports", "review_exports", "risk_exports", "boundary_exports"],
    readiness_tags: ["grouping", "exports", "readability"],
    learner_trap_vi:
      "Nhóm export chỉ là cấu trúc dữ liệu, không phải approval.",
    learner_trap_en:
      "Export groups are data structure, not approval.",
  },
  {
    id: "export-level-coverage",
    area: "level_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਪੱਧਰ ਕਵਰੇਜ",
    romanization: "paddar coverage",
    title_vi: "Độ phủ level",
    title_en: "Level coverage",
    readiness_vi:
      "A1-C2 phải xuất hiện trong manifest, summary, evidence, risk, owner review và export readiness.",
    readiness_en:
      "A1-C2 should appear in the manifest, summary, evidence, risk, owner review, and export readiness.",
    regression_vi:
      "Thiếu một level có thể làm route sau này không khớp với final exports.",
    regression_en:
      "Missing one level can make later routes not line up with the final exports.",
    sample: {
      gurmukhi: "ਹਰ ਪੱਧਰ ਲਈ ਸਬੂਤ ਹੈ।",
      romanization: "har paddar lai sabut hai",
      vi: "Có bằng chứng cho từng cấp.",
      en: "There is evidence for each level.",
    },
    expected_modules: [
      "courseMap",
      "progressionMatrix",
      "masteryCheckpoints",
      "finalCanDoIndex",
      "finalQualityGates",
      "finalSmokeChecklist",
    ],
    export_groups: ["coverage_exports", "route_exports"],
    readiness_tags: ["A1-C2", "coverage", "levels"],
    learner_trap_vi:
      "A1-C2 là khung học, không phải chứng chỉ chính thức.",
    learner_trap_en:
      "A1-C2 is a learning frame, not an official certification.",
  },
  {
    id: "export-gurmukhi-first",
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
    regression_vi:
      "Nếu romanization lấn lên trước, trải nghiệm đọc sẽ yếu đi.",
    regression_en:
      "If romanization comes first, the reading experience weakens.",
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
    readiness_tags: ["gurmukhi-first", "script", "preview"],
    learner_trap_vi:
      "Romanization không thể hiện đầy đủ bật hơi và retroflex.",
    learner_trap_en:
      "Romanization does not fully show aspiration and retroflex.",
  },
  {
    id: "export-vi-en-support",
    area: "learner_support",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਦੋ-ਭਾਸ਼ੀ ਸਹਾਇਤਾ",
    romanization: "do-bhashi sahaita",
    title_vi: "Hỗ trợ Việt-Anh",
    title_en: "Vietnamese-English support",
    readiness_vi:
      "Export-ready data cần giải thích bằng tiếng Việt và tiếng Anh cho mục tiêu, sample, trap và QA.",
    readiness_en:
      "Export-ready data needs Vietnamese and English explanations for goals, samples, traps, and QA.",
    regression_vi:
      "Thiếu VI/EN khiến người học Việt phải đoán nghĩa của các cảnh báo.",
    regression_en:
      "Missing VI/EN explanations make Vietnamese-speaking learners guess the warnings.",
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
    readiness_tags: ["vi-support", "en-support", "learner-explanations"],
    learner_trap_vi:
      "Translation không thay thế error notes riêng cho người Việt.",
    learner_trap_en:
      "Translation does not replace learner-specific error notes.",
  },
  {
    id: "export-canada-domains",
    area: "canada_domain",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2"],
    title_pa: "ਕੈਨੇਡਾ ਰਾਹ",
    romanization: "Canada rah",
    title_vi: "Miền Canada",
    title_en: "Canada domains",
    readiness_vi:
      "Manifest cần giữ settlement, school office, address, phone, documents, work và clinic đủ cụ thể.",
    readiness_en:
      "The manifest should keep settlement, school office, address, phone, documents, work, and clinic concrete.",
    regression_vi:
      "Nếu nội dung quá chung chung, later export sẽ giống textbook hơn là tình huống thật.",
    regression_en:
      "If the content is too vague, the later export will feel textbook-like instead of real-world.",
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
    readiness_tags: ["canada-practical", "settlement", "public-service"],
    learner_trap_vi:
      "Pata là address; đừng lẫn với phone number hoặc document number.",
    learner_trap_en:
      "Pata means address; do not confuse it with a phone number or document number.",
    canada_practical:
      "Settlement forms, school offices, municipal counters, community forms, and clinic intake in Canada.",
  },
  {
    id: "export-final-hardening",
    area: "final_hardening",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਫਾਈਨਲ hardening",
    romanization: "final hardening",
    title_vi: "Hardening cuối",
    title_en: "Final hardening",
    readiness_vi:
      "Final hardening nên kiểm line-up giữa manifest, evidence, summary, owner review và risk register.",
    readiness_en:
      "Final hardening should check line-up among the manifest, evidence, summary, owner review, and risk register.",
    regression_vi:
      "Nếu một file đổi ID mà file khác không đổi theo, export sẽ lệch.",
    regression_en:
      "If one file changes an ID and the others do not, the export will drift.",
    sample: {
      gurmukhi: "ਇਕਸਾਰਤਾ ਲਾਜ਼ਮੀ ਹੈ।",
      romanization: "iksarata lazmi hai",
      vi: "Tính nhất quán là bắt buộc.",
      en: "Consistency is mandatory.",
    },
    expected_modules: [
      "finalModuleRegistry",
      "finalContentManifest",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
      "finalIntegrationRiskRegister",
    ],
    export_groups: ["hardening_exports", "consistency_exports"],
    readiness_tags: ["hardening", "consistency", "export-check"],
    learner_trap_vi:
      "Hardened export không có nghĩa là đã native-reviewed.",
    learner_trap_en:
      "A hardened export is not the same as native review.",
  },
  {
    id: "export-regression-checks",
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
    regression_vi:
      "Một check pass không bảo đảm mọi route đều sạch nếu không quét toàn bộ packet.",
    regression_en:
      "One passing check does not guarantee every route is clean unless the whole packet is scanned.",
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
    readiness_tags: ["regression", "scan", "risk-check"],
    learner_trap_vi:
      "Regression check không thay thế review bằng mắt người.",
    learner_trap_en:
      "A regression check does not replace human review.",
  },
  {
    id: "export-deferred-review",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ review",
    romanization: "multavi review",
    title_vi: "Review hoãn",
    title_en: "Deferred review",
    readiness_vi:
      "Native review phải giữ là deferred trong mọi export note, không được ghi như đã hoàn tất.",
    readiness_en:
      "Native review is deferred and completion is not claimed in every export note; it must not be written as complete.",
    regression_vi:
      "Nếu label chuyển sang done hoặc approved, export readiness đã vượt scope.",
    regression_en:
      "If the label changes to done or approved, the export readiness has gone out of scope.",
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
    readiness_tags: ["deferred", "native-review", "boundary"],
    learner_trap_vi:
      "Deferred không bao giờ nên được trình bày như hoàn tất.",
    learner_trap_en:
      "Deferred should never be presented as complete.",
    must_not_claim_vi: "Không claim native review hoặc completion đã xong.",
    must_not_claim_en: "Do not claim native review or completion is done.",
  },
  {
    id: "export-forbidden-claims",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾ claim ਕਰੋ",
    romanization: "na claim karo",
    title_vi: "Không được claim",
    title_en: "Must not claim",
    readiness_vi:
      "Export readiness không được claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy hoặc A11 integration.",
    readiness_en:
      "Export readiness must not claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy, not A11 integration, or no A11 integration.",
    regression_vi:
      "Nếu một chuỗi quảng bá lấn vào, export sẽ kể sai khả năng hệ thống.",
    regression_en:
      "If promotional wording slips in, the export will misstate system capability.",
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
    readiness_tags: ["must-not-claim", "text-only", "not-a11"],
    learner_trap_vi:
      "Text-only data không tự sinh audio hay scoring.",
    learner_trap_en:
      "Text only data does not create audio or scoring.",
    must_not_claim_vi:
      "Không claim audio, scoring, Azure, Supabase, deploy, push hoặc A11 integration.",
    must_not_claim_en:
      "Do not claim audio, scoring, Azure, Supabase, deploy, push, or A11 integration; not A11 integration and no A11 integration must both stay out of scope.",
  },
];

export const PUNJABI_FINAL_EXPORT_READINESS_ROUTES = [
  {
    id: "export-route-inventory",
    vi: "Kiểm inventory, nhóm export và level coverage.",
    en: "Check inventory, export groups, and level coverage.",
    item_ids: ["export-module-inventory", "export-groups", "export-level-coverage"],
  },
  {
    id: "export-route-script-support",
    vi: "Kiểm Gurmukhi-first, VI/EN support và Canada practical.",
    en: "Check Gurmukhi-first, VI/EN support, and Canada-practical content.",
    item_ids: ["export-gurmukhi-first", "export-vi-en-support", "export-canada-domains"],
  },
  {
    id: "export-route-boundary",
    vi: "Kiểm hardening, regression, deferred review và forbidden claims.",
    en: "Check hardening, regression, deferred review, and forbidden claims.",
    item_ids: ["export-final-hardening", "export-regression-checks", "export-deferred-review", "export-forbidden-claims"],
  },
];

export const PUNJABI_FINAL_EXPORT_READINESS_ROOT = {
  scope: PUNJABI_FINAL_EXPORT_READINESS_SCOPE,
  areas: PUNJABI_FINAL_EXPORT_READINESS_AREAS,
  readiness: PUNJABI_FINAL_EXPORT_READINESS,
  routes: PUNJABI_FINAL_EXPORT_READINESS_ROUTES,
};

export default PUNJABI_FINAL_EXPORT_READINESS_ROOT;
