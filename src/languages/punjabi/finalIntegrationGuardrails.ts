// src/languages/punjabi/finalIntegrationGuardrails.ts
//
// Wave 27 final integration guardrails for Punjabi.
// This is not A11 integration. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalIntegrationGuardrailsArea =
  | "module_grouping"
  | "naming_consistency"
  | "export_expectations"
  | "duplicate_risk"
  | "gurmukhi_first"
  | "learner_support"
  | "canada_practical"
  | "final_guardrails"
  | "regression_checks"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiFinalIntegrationGuardrailsStatus =
  | "watch_required"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalIntegrationGuardrailsItem = {
  id: string;
  area: PunjabiFinalIntegrationGuardrailsArea;
  status: PunjabiFinalIntegrationGuardrailsStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  guardrails_vi: string;
  guardrails_en: string;
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
  guardrails_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_INTEGRATION_GUARDRAILS_SCOPE = {
  wave: "Wave 27",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  script_note_vi:
    "Guardrails này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ là awareness-only, không phải full course.",
  script_note_en:
    "These guardrails use Gurmukhi as the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã hoàn tất.",
  native_review_en: "Native review is deferred; completion is not claimed.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
};

export const PUNJABI_FINAL_INTEGRATION_GUARDRAILS_SCOPE_ALIAS =
  PUNJABI_FINAL_INTEGRATION_GUARDRAILS_SCOPE;

export const PUNJABI_FINAL_INTEGRATION_STABILITY_PLAN_SCOPE =
  PUNJABI_FINAL_INTEGRATION_GUARDRAILS_SCOPE;

export const PUNJABI_FINAL_INTEGRATION_GUARDRAILS_AREAS: PunjabiFinalIntegrationGuardrailsArea[] = [
  "module_grouping",
  "naming_consistency",
  "export_expectations",
  "duplicate_risk",
  "gurmukhi_first",
  "learner_support",
  "canada_practical",
  "final_guardrails",
  "regression_checks",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_FINAL_INTEGRATION_GUARDRAILS: PunjabiFinalIntegrationGuardrailsItem[] = [
  {
    id: "guardrails-module-grouping",
    area: "module_grouping",
    status: "watch_required",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ grouping",
    romanization: "module grouping",
    title_vi: "Nhóm module",
    title_en: "Module grouping",
    guardrails_vi:
      "Nhóm final modules phải gom foundation, dialogues, maps, indexes, QA, manifest, evidence và review artifacts thành bundle rõ ràng.",
    guardrails_en:
      "Final modules should group foundation, dialogues, maps, indexes, QA, manifest, evidence, and review artifacts into clear bundles.",
    regression_vi:
      "Nếu package không có nhóm rõ, later A11 sẽ phải đoán file vào đâu.",
    regression_en:
      "If the package lacks clear groups, later A11 will have to guess the entry point.",
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
      "finalPackagingReadiness",
    ],
    export_groups: ["core_exports", "review_exports", "boundary_exports"],
    guardrails_tags: ["grouping", "bundle", "entry-point"],
    learner_trap_vi: "Nhóm rõ ràng không có nghĩa là native review đã xong.",
    learner_trap_en: "Clear grouping does not mean native review is finished.",
  },
  {
    id: "guardrails-naming-consistency",
    area: "naming_consistency",
    status: "watch_required",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਮ consistency",
    romanization: "naming consistency",
    title_vi: "Nhất quán tên",
    title_en: "Naming consistency",
    guardrails_vi:
      "Tên file, export name, item ID và route ID phải khớp để tránh drift.",
    guardrails_en:
      "File names, export names, item IDs, and route IDs must match to avoid drift.",
    regression_vi:
      "Chỉ cần một ID lệch là route và export sẽ không còn khớp.",
    regression_en:
      "A single mismatched ID is enough to break route and export alignment.",
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
    guardrails_tags: ["naming", "consistency", "ids"],
    learner_trap_vi:
      "Tên nhất quán không có nghĩa là nội dung đã được duyệt bản ngữ.",
    learner_trap_en:
      "Consistent names do not mean the content has native review.",
  },
  {
    id: "guardrails-export-expectations",
    area: "export_expectations",
    status: "watch_required",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਐਕਸਪੋਰਟ ਉਮੀਦਾਂ",
    romanization: "export umidaan",
    title_vi: "Kỳ vọng export",
    title_en: "Export expectations",
    guardrails_vi:
      "Root export, default export và route export phải rõ để consumer dùng ngay.",
    guardrails_en:
      "Root exports, default exports, and route exports must be clear for consumers.",
    regression_vi:
      "Nếu export pattern đổi mà packet không đổi theo, guardrails sẽ trượt.",
    regression_en:
      "If export patterns change and the packet does not, the guardrails will drift.",
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
    guardrails_tags: ["exports", "consumer-ready", "pattern-match"],
    learner_trap_vi:
      "Có export không có nghĩa là mọi boundary đều an toàn.",
    learner_trap_en:
      "Having exports does not mean every boundary is safe.",
  },
  {
    id: "guardrails-duplicate-risk",
    area: "duplicate_risk",
    status: "watch_required",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਦੁਹਰਾਏ ਖ਼ਤਰੇ",
    romanization: "duharaye khatre",
    title_vi: "Rủi ro trùng",
    title_en: "Duplicate risk",
    guardrails_vi:
      "Duplicate modules, duplicate export groups, hoặc duplicate routes đều có thể làm packet lệch.",
    guardrails_en:
      "Duplicate modules, duplicate export groups, or duplicate routes can all skew the packet.",
    regression_vi:
      "Đọc đồng thời registry, manifest, evidence, summary, review packet và risk register để bắt trùng.",
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
    guardrails_tags: ["duplicate-risk", "scan", "cross-file"],
    learner_trap_vi:
      "Tên gần giống nhau không có nghĩa là nội dung khác nhau.",
    learner_trap_en:
      "Similar names do not guarantee different content.",
  },
  {
    id: "guardrails-gurmukhi-first",
    area: "gurmukhi_first",
    status: "watch_required",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ",
    romanization: "Gurmukhi pehlan",
    title_vi: "Gurmukhi trước",
    title_en: "Gurmukhi first",
    guardrails_vi:
      "Gurmukhi phải đứng trước romanization trong title, sample và preview.",
    guardrails_en:
      "Gurmukhi must appear before romanization in titles, samples, and previews.",
    regression_vi:
      "Nếu chữ Latin lên trước, tín hiệu script chính bị yếu đi.",
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
      "finalContentManifest",
    ],
    export_groups: ["script_exports", "preview_exports"],
    guardrails_tags: ["gurmukhi-first", "script-order", "preview"],
    learner_trap_vi:
      "Romanization không thể hiện đầy đủ bật hơi và retroflex.",
    learner_trap_en:
      "Romanization does not fully show aspiration and retroflex.",
  },
  {
    id: "guardrails-vi-en-support",
    area: "learner_support",
    status: "watch_required",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਦੋ-ਭਾਸ਼ੀ ਸਹਾਇਤਾ",
    romanization: "do-bhashi sahaita",
    title_vi: "Hỗ trợ Việt-Anh",
    title_en: "Vietnamese-English support",
    guardrails_vi:
      "Guardrails-ready data cần có giải thích bằng tiếng Việt và tiếng Anh cho mục tiêu, sample, trap và QA.",
    guardrails_en:
      "Guardrails-ready data needs Vietnamese and English explanations for goals, samples, traps, and QA.",
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
    guardrails_tags: ["vi-support", "en-support", "learner-explanations"],
    learner_trap_vi:
      "Translation không thay thế error notes riêng cho người Việt.",
    learner_trap_en:
      "Translation does not replace learner-specific error notes.",
  },
  {
    id: "guardrails-canada-practical",
    area: "canada_practical",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2"],
    title_pa: "ਕੈਨੇਡਾ practical",
    romanization: "Canada practical",
    title_vi: "Miền Canada",
    title_en: "Canada practical",
    guardrails_vi:
      "Package cần giữ settlement, school office, work, clinic, address và documents đủ cụ thể.",
    guardrails_en:
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
    guardrails_tags: ["canada-practical", "settlement", "public-service"],
    learner_trap_vi:
      "Pata là address; đừng lẫn với phone number hoặc document number.",
    learner_trap_en:
      "Pata means address; do not confuse it with a phone number or document number.",
    canada_practical:
      "Settlement forms, school offices, municipal counters, community forms, and clinic intake in Canada.",
  },
  {
    id: "guardrails-final-guardrails",
    area: "final_guardrails",
    status: "watch_required",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਫਾਈਨਲ guardrails",
    romanization: "final guardrails",
    title_vi: "Rào chắn cuối",
    title_en: "Final guardrails",
    guardrails_vi:
      "Final guardrails cần line-up giữa manifest, evidence, summary, review packets và risk register.",
    guardrails_en:
      "Final guardrails should line up the manifest, evidence, summary, review packets, and risk register.",
    regression_vi:
      "Một file đẹp không bù cho bundle lệch tên hoặc lệch route.",
    regression_en:
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
      "finalPackagingReadiness",
    ],
    export_groups: ["stability_exports", "consistency_exports"],
    guardrails_tags: ["guardrails", "bundle-check", "consistency"],
    learner_trap_vi:
      "Guardrails cuối không có nghĩa native review đã xong.",
    learner_trap_en:
      "Final guardrails do not mean native review is finished.",
  },
  {
    id: "guardrails-regression-checks",
    area: "regression_checks",
    status: "watch_required",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰਿਗ੍ਰੈਸ਼ਨ ਜਾਂਚ",
    romanization: "regression janch",
    title_vi: "Kiểm regression",
    title_en: "Regression checks",
    guardrails_vi:
      "Regression checks nên bắt duplicate modules, missing exports, script drift và broken routes trước khi release.",
    guardrails_en:
      "Regression checks should catch duplicate modules, missing exports, script drift, and broken routes before release.",
    regression_vi:
      "Nếu chỉ pass trên một file, toàn bộ package vẫn có thể lệch.",
    regression_en:
      "If only one file passes, the whole package can still be off.",
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
    guardrails_tags: ["regression", "scan", "release-check"],
    learner_trap_vi:
      "Regression check không thay thế review bằng mắt người.",
    learner_trap_en:
      "Regression checks do not replace human review.",
  },
  {
    id: "guardrails-deferred-review",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ review",
    romanization: "multavi review",
    title_vi: "Review hoãn",
    title_en: "Deferred review",
    guardrails_vi:
      "Native review được hoãn trong mọi guardrail note; completion không được ghi như đã hoàn tất.",
    guardrails_en:
      "Native review is deferred in every guardrail note and completion is not claimed.",
    regression_vi:
      "Nếu label đổi sang done hay approved, guardrails đã vượt scope.",
    regression_en:
      "If the label changes to done or approved, the guardrails have gone out of scope.",
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
    guardrails_tags: ["deferred", "native-review", "boundary"],
    learner_trap_vi:
      "Deferred không bao giờ nên được trình bày như hoàn tất.",
    learner_trap_en:
      "Deferred should never be presented as complete.",
    must_not_claim_vi: "Không claim native review hoặc completion đã xong.",
    must_not_claim_en: "Do not claim native review or completion is done.",
  },
  {
    id: "guardrails-forbidden-claims",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾ claim ਕਰੋ",
    romanization: "na claim karo",
    title_vi: "Không được claim",
    title_en: "Must not claim",
    guardrails_vi:
      "Guardrails không được claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy hoặc A11 integration.",
    guardrails_en:
      "Guardrails must not claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy, not A11 integration, or no A11 integration.",
    regression_vi:
      "Nếu wording quảng bá lấn vào, package sẽ kể sai khả năng hệ thống.",
    regression_en:
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
    guardrails_tags: ["must-not-claim", "text-only", "not-a11"],
    learner_trap_vi: "Text-only data không tự sinh audio hay scoring.",
    learner_trap_en: "Text only data does not create audio or scoring.",
    must_not_claim_vi:
      "Không claim audio, scoring, Azure, Supabase, deploy, push hoặc A11 integration.",
    must_not_claim_en:
      "Do not claim audio, scoring, Azure, Supabase, deploy, push, or A11 integration; not A11 integration and no A11 integration must both stay out of scope.",
  },
];

export const PUNJABI_FINAL_INTEGRATION_GUARDRAILS_ROUTES = [
  {
    id: "guardrails-route-structure",
    vi: "Kiểm grouping, naming và export expectations.",
    en: "Check grouping, naming, and export expectations.",
    item_ids: ["guardrails-module-grouping", "guardrails-naming-consistency", "guardrails-export-expectations"],
  },
  {
    id: "guardrails-route-support",
    vi: "Kiểm duplicate risk, Gurmukhi-first và VI/EN support.",
    en: "Check duplicate risk, Gurmukhi-first, and VI/EN support.",
    item_ids: ["guardrails-duplicate-risk", "guardrails-gurmukhi-first", "guardrails-vi-en-support"],
  },
  {
    id: "guardrails-route-boundary",
    vi: "Kiểm Canada practical, final guardrails, regression và forbidden claims.",
    en: "Check Canada practical, final guardrails, regression, and forbidden claims.",
    item_ids: [
      "guardrails-canada-practical",
      "guardrails-final-guardrails",
      "guardrails-regression-checks",
      "guardrails-deferred-review",
      "guardrails-forbidden-claims",
    ],
  },
];

export const PUNJABI_FINAL_INTEGRATION_GUARDRAILS_ROOT = {
  scope: PUNJABI_FINAL_INTEGRATION_GUARDRAILS_SCOPE,
  areas: PUNJABI_FINAL_INTEGRATION_GUARDRAILS_AREAS,
  guardrails: PUNJABI_FINAL_INTEGRATION_GUARDRAILS,
  routes: PUNJABI_FINAL_INTEGRATION_GUARDRAILS_ROUTES,
};

export const PUNJABI_FINAL_INTEGRATION_STABILITY_PLAN_ROOT =
  PUNJABI_FINAL_INTEGRATION_GUARDRAILS_ROOT;

export default PUNJABI_FINAL_INTEGRATION_GUARDRAILS_ROOT;
