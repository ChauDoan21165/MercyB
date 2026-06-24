// src/languages/punjabi/finalIntegrationDryRunPlan.ts
//
// Wave 29 final integration dry-run plan for Punjabi.
// This is not A11 integration. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalIntegrationDryRunArea =
  | "module_groups"
  | "export_order"
  | "naming_checks"
  | "duplicate_risk"
  | "gurmukhi_first"
  | "learner_support"
  | "canada_practical"
  | "dry_run_readiness"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiFinalIntegrationDryRunStatus =
  | "ready_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalIntegrationDryRunItem = {
  id: string;
  area: PunjabiFinalIntegrationDryRunArea;
  status: PunjabiFinalIntegrationDryRunStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  dry_run_vi: string;
  dry_run_en: string;
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
  dry_run_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_INTEGRATION_DRY_RUN_SCOPE = {
  wave: "Wave 29",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  script_note_vi:
    "Dry-run plan này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ là awareness-only, không phải full course.",
  script_note_en:
    "This dry-run plan uses Gurmukhi as the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã hoàn tất.",
  native_review_en: "Native review is deferred; completion is not claimed.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
};

export const PUNJABI_FINAL_INTEGRATION_DRY_RUN_SCOPE_ALIAS =
  PUNJABI_FINAL_INTEGRATION_DRY_RUN_SCOPE;

export const PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN_SCOPE =
  PUNJABI_FINAL_INTEGRATION_DRY_RUN_SCOPE;

export const PUNJABI_FINAL_INTEGRATION_DRY_RUN_AREAS: PunjabiFinalIntegrationDryRunArea[] = [
  "module_groups",
  "export_order",
  "naming_checks",
  "duplicate_risk",
  "gurmukhi_first",
  "learner_support",
  "canada_practical",
  "dry_run_readiness",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN: PunjabiFinalIntegrationDryRunItem[] = [
  {
    id: "dryrun-module-groups",
    area: "module_groups",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ group",
    romanization: "module group",
    title_vi: "Nhóm module",
    title_en: "Module groups",
    dry_run_vi:
      "Dry run nên gom foundation, dialogue, map, QA, registry, manifest và boundary artifacts thành nhóm rõ ràng.",
    dry_run_en:
      "The dry run should group foundation, dialogue, map, QA, registry, manifest, and boundary artifacts clearly.",
    regression_vi:
      "Nếu bundle lẫn lộn, later A11 sẽ phải đoán file nào là điểm vào.",
    regression_en:
      "If bundles are mixed up, later A11 will have to guess the entry point.",
    sample: {
      gurmukhi: "ਸੂਚੀ ਸਾਫ਼ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
      romanization: "suchi saaf honi chahidi hai",
      vi: "Danh sách phải rõ ràng.",
      en: "The list should be clear.",
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
    dry_run_tags: ["grouping", "bundle-scan", "later-a11"],
    learner_trap_vi:
      "Nhóm rõ ràng không có nghĩa integration đã sẵn sàng chạy.",
    learner_trap_en:
      "Clear grouping does not mean integration is ready to run.",
  },
  {
    id: "dryrun-export-order",
    area: "export_order",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਐਕਸਪੋਰਟ ਕ੍ਰਮ",
    romanization: "export kram",
    title_vi: "Thứ tự export",
    title_en: "Export order",
    dry_run_vi:
      "Dry run cần giữ export order từ core sang review rồi boundary để later A11 không đọc nhầm layer.",
    dry_run_en:
      "The dry run should preserve export order from core to review to boundary so later A11 does not read the wrong layer.",
    regression_vi:
      "Nếu boundary lên trước core, file map sẽ khó theo dõi hơn.",
    regression_en:
      "If boundary comes before core, the map becomes harder to follow.",
    sample: {
      gurmukhi: "ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਣ ਹੈ।",
      romanization: "kram mahatvapurn hai",
      vi: "Thứ tự rất quan trọng.",
      en: "Order matters.",
    },
    expected_modules: [
      "finalContentManifest",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
      "finalIntegrationRiskRegister",
      "finalExportReadiness",
    ],
    export_groups: ["order_exports", "route_exports", "boundary_exports"],
    dry_run_tags: ["ordering", "exports", "layering"],
    learner_trap_vi:
      "Export order tốt không có nghĩa là nội dung đã được duyệt bản ngữ.",
    learner_trap_en:
      "Good export order does not mean native review is finished.",
  },
  {
    id: "dryrun-naming-checks",
    area: "naming_checks",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਂ ਜਾਂਚ",
    romanization: "naam janch",
    title_vi: "Kiểm tên",
    title_en: "Naming checks",
    dry_run_vi:
      "Tên file, export name, item ID và route ID phải khớp để tránh drift trong dry-run packet.",
    dry_run_en:
      "File names, export names, item IDs, and route IDs must match to avoid drift in the dry-run packet.",
    regression_vi:
      "Chỉ một ID lệch là dry run và route summary sẽ không còn khớp.",
    regression_en:
      "A single mismatched ID is enough to break dry-run and route alignment.",
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
    dry_run_tags: ["naming", "consistency", "ids"],
    learner_trap_vi:
      "Tên nhất quán không có nghĩa là packet đã ready để merge.",
    learner_trap_en:
      "Consistent names do not mean the packet is ready to merge.",
  },
  {
    id: "dryrun-duplicate-risk",
    area: "duplicate_risk",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਦੁਹਰਾਏ ਖ਼ਤਰੇ",
    romanization: "duharaye khatre",
    title_vi: "Rủi ro trùng",
    title_en: "Duplicate risk",
    dry_run_vi:
      "Duplicate modules, duplicate export groups, hoặc duplicate routes đều có thể làm dry-run packet lệch.",
    dry_run_en:
      "Duplicate modules, duplicate export groups, or duplicate routes can all skew the dry-run packet.",
    regression_vi:
      "Đọc registry, manifest, evidence, summary, review packet và risk register cùng lúc để bắt trùng.",
    regression_en:
      "Read the registry, manifest, evidence, summary, review packet, and risk register together to catch duplication.",
    sample: {
      gurmukhi: "ਇਹ ਲਾਈਨ ਦੋ ਵਾਰੀ ਨਹੀਂ ਹੋਣੀ ਚਾਹੀਦੀ।",
      romanization: "ih line do vari nahi honi chahidi",
      vi: "Dòng này không nên xuất hiện hai lần.",
      en: "This line should not appear twice.",
    },
    expected_modules: [
      "finalModuleRegistry",
      "finalContentManifest",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
      "finalIntegrationRiskRegister",
    ],
    export_groups: ["duplication_exports", "scan_exports"],
    dry_run_tags: ["duplicate-risk", "scan", "cross-file"],
    learner_trap_vi:
      "Tên gần giống nhau không đảm bảo nội dung khác nhau.",
    learner_trap_en:
      "Similar names do not guarantee different content.",
  },
  {
    id: "dryrun-gurmukhi-first",
    area: "gurmukhi_first",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ",
    romanization: "Gurmukhi pehlan",
    title_vi: "Gurmukhi trước",
    title_en: "Gurmukhi first",
    dry_run_vi:
      "Gurmukhi phải đứng trước romanization trong title, sample và preview.",
    dry_run_en:
      "Gurmukhi must appear before romanization in titles, samples, and previews.",
    regression_vi:
      "Nếu Latin lên trước, tín hiệu chữ chính sẽ yếu đi.",
    regression_en:
      "If Latin comes first, the primary script signal gets weaker.",
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
      "finalQualityGates",
    ],
    export_groups: ["script_exports", "preview_exports"],
    dry_run_tags: ["gurmukhi-first", "script-order", "preview"],
    learner_trap_vi:
      "Romanization không thể hiện đầy đủ bật hơi và retroflex.",
    learner_trap_en:
      "Romanization does not fully show aspiration and retroflex.",
  },
  {
    id: "dryrun-vi-en-support",
    area: "learner_support",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਦੋ-ਭਾਸ਼ੀ ਸਹਾਇਤਾ",
    romanization: "do-bhashi sahaita",
    title_vi: "Hỗ trợ Việt-Anh",
    title_en: "Vietnamese-English support",
    dry_run_vi:
      "Dry-run data cần giải thích bằng tiếng Việt và tiếng Anh cho mục tiêu, sample, trap và QA.",
    dry_run_en:
      "Dry-run data needs Vietnamese and English explanations for goals, samples, traps, and QA.",
    regression_vi:
      "Thiếu VI/EN khiến người học Việt phải đoán nghĩa của cảnh báo.",
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
    dry_run_tags: ["vi-support", "en-support", "learner-explanations"],
    learner_trap_vi:
      "Translation không thay thế error notes riêng cho người Việt.",
    learner_trap_en:
      "Translation does not replace learner-specific error notes.",
  },
  {
    id: "dryrun-canada-practical",
    area: "canada_practical",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2"],
    title_pa: "ਕੈਨੇਡਾ practical",
    romanization: "Canada practical",
    title_vi: "Miền Canada",
    title_en: "Canada practical",
    dry_run_vi:
      "Package cần giữ settlement, school office, work, clinic, address và documents đủ cụ thể.",
    dry_run_en:
      "The package should keep settlement, school office, work, clinic, address, and documents concrete.",
    regression_vi:
      "Nếu nội dung quá chung chung, export sẽ giống textbook thay vì tình huống Canada thật.",
    regression_en:
      "If the content is too vague, the export will feel like a textbook instead of a real Canada situation.",
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
    dry_run_tags: ["canada-practical", "settlement", "public-service"],
    learner_trap_vi:
      "Pata là address; đừng lẫn với phone number hoặc document number.",
    learner_trap_en:
      "Pata means address; do not confuse it with a phone number or document number.",
    canada_practical:
      "Settlement forms, school offices, municipal counters, community forms, and clinic intake in Canada.",
  },
  {
    id: "dryrun-dry-run-readiness",
    area: "dry_run_readiness",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡ੍ਰਾਈ ਰਨ ਤਿਆਰੀ",
    romanization: "dry run tiari",
    title_vi: "Sẵn sàng dry run",
    title_en: "Dry-run readiness",
    dry_run_vi:
      "Dry-run readiness phải gom summary, review packet, risk register, export readiness và packaging readiness để package ready cho later A11.",
    dry_run_en:
      "Dry-run readiness should collect summary, review packet, risk register, export readiness, and packaging readiness so the package is ready for later A11.",
    regression_vi:
      "Thiếu một checklist là đủ để kéo lùi toàn bộ pipeline đọc.",
    regression_en:
      "Missing one checklist is enough to drag down the whole reading pipeline.",
    sample: {
      gurmukhi: "ਚੈਕਲਿਸਟ ਪੂਰੀ ਕਰੋ।",
      romanization: "checklist puri karo",
      vi: "Hãy hoàn tất checklist.",
      en: "Complete the checklist.",
    },
    expected_modules: [
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
      "finalIntegrationRiskRegister",
      "finalExportReadiness",
      "finalPackagingReadiness",
      "finalIntegrationGuardrails",
    ],
    export_groups: ["readiness_exports", "boundary_exports"],
    dry_run_tags: ["dry-run", "pre-integration", "coverage"],
    learner_trap_vi:
      "Dry-run readiness không phải là A11 integration.",
    learner_trap_en:
      "Dry-run readiness is not A11 integration.",
  },
  {
    id: "dryrun-deferred-review",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ",
    romanization: "multavi samikhia",
    title_vi: "Review hoãn",
    title_en: "Deferred review",
    dry_run_vi:
      "Native review phải luôn được ghi là deferred trong dry-run plan này; không được biến thành completion.",
    dry_run_en:
      "Native review is deferred in this dry-run plan and completion is not claimed.",
    regression_vi:
      "Nếu nhãn đổi sang done hoặc approved, plan đã vượt scope.",
    regression_en:
      "If the label changes to done or approved, the plan has gone out of scope.",
    sample: {
      gurmukhi: "review ਅਜੇ ਬਾਕੀ ਹੈ।",
      romanization: "review aje baki hai",
      vi: "Review vẫn còn đang chờ.",
      en: "Review is still pending.",
    },
    expected_modules: [
      "preMrAuditChecklist",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
      "finalIntegrationRiskRegister",
    ],
    export_groups: ["boundary_exports", "review_exports"],
    dry_run_tags: ["deferred", "native-review", "boundary"],
    learner_trap_vi:
      "Deferred không bao giờ nên được trình bày như hoàn tất.",
    learner_trap_en:
      "Deferred should never be presented as complete.",
    must_not_claim_vi: "Không claim native review hoặc completion đã xong.",
    must_not_claim_en: "Do not claim native review or completion is done.",
  },
  {
    id: "dryrun-forbidden-claims",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾ claim ਕਰੋ",
    romanization: "na claim karo",
    title_vi: "Không được claim",
    title_en: "Must not claim",
    dry_run_vi:
      "Map này không được claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy hoặc A11 integration.",
    dry_run_en:
      "This map must not claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy, or A11 integration.",
    regression_vi:
      "Nếu wording quảng bá lọt vào, packet sẽ kể sai khả năng của hệ thống.",
    regression_en:
      "If promotional wording slips in, the packet will misstate system capability.",
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
    dry_run_tags: ["must-not-claim", "text-only", "not-a11"],
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

export const PUNJABI_FINAL_INTEGRATION_DRY_RUN_ROUTES = [
  {
    id: "dryrun-route-structure",
    vi: "Kiểm nhóm module, export order và naming.",
    en: "Check module groups, export order, and naming.",
    item_ids: ["dryrun-module-groups", "dryrun-export-order", "dryrun-naming-checks"],
  },
  {
    id: "dryrun-route-script-support",
    vi: "Kiểm duplicate risk, Gurmukhi-first và VI/EN support.",
    en: "Check duplicate risk, Gurmukhi-first, and VI/EN support.",
    item_ids: ["dryrun-duplicate-risk", "dryrun-gurmukhi-first", "dryrun-vi-en-support"],
  },
  {
    id: "dryrun-route-boundary",
    vi: "Kiểm Canada, dry-run readiness, deferred review và forbidden claims.",
    en: "Check Canada, dry-run readiness, deferred review, and forbidden claims.",
    item_ids: [
      "dryrun-canada-practical",
      "dryrun-dry-run-readiness",
      "dryrun-deferred-review",
      "dryrun-forbidden-claims",
    ],
  },
];

export const PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN_ROUTES =
  PUNJABI_FINAL_INTEGRATION_DRY_RUN_ROUTES;

export const PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN_ROOT = {
  scope: PUNJABI_FINAL_INTEGRATION_DRY_RUN_SCOPE,
  areas: PUNJABI_FINAL_INTEGRATION_DRY_RUN_AREAS,
  dry_run: PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN,
  routes: PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN_ROUTES,
};

export default PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN_ROOT;
