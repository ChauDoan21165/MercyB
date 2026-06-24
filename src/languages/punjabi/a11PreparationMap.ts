// src/languages/punjabi/a11PreparationMap.ts
//
// Wave 28 A11 preparation map for Punjabi.
// This is not A11 integration. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiA11PreparationArea =
  | "import_groups"
  | "level_modules"
  | "script_modules"
  | "canada_modules"
  | "remediation_modules"
  | "selector_routes"
  | "pre_integration_readiness"
  | "final_readiness"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiA11PreparationStatus =
  | "ready_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiA11PreparationItem = {
  id: string;
  area: PunjabiA11PreparationArea;
  status: PunjabiA11PreparationStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  prep_vi: string;
  prep_en: string;
  regression_vi: string;
  regression_en: string;
  selector_vi: string;
  selector_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  expected_modules: string[];
  import_groups: string[];
  prep_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_A11_PREPARATION_MAP_SCOPE = {
  wave: "Wave 28",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  script_note_vi:
    "A11 preparation map này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ là awareness-only, không phải full course.",
  script_note_en:
    "This A11 preparation map uses Gurmukhi as the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã hoàn tất.",
  native_review_en: "Native review is deferred; completion is not claimed.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
};

export const PUNJABI_A11_PREPARATION_SCOPE_ALIAS =
  PUNJABI_A11_PREPARATION_MAP_SCOPE;

export const PUNJABI_A11_PREPARATION_AREAS: PunjabiA11PreparationArea[] = [
  "import_groups",
  "level_modules",
  "script_modules",
  "canada_modules",
  "remediation_modules",
  "selector_routes",
  "pre_integration_readiness",
  "final_readiness",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_A11_PREPARATION_MAP: PunjabiA11PreparationItem[] = [
  {
    id: "prep-import-groups",
    area: "import_groups",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ ਸਮੂਹ",
    romanization: "import group",
    title_vi: "Nhóm import",
    title_en: "Import groups",
    prep_vi:
      "Chuẩn bị nhóm import để later A11 đọc foundation, dialogue, map, QA, registry và boundary packet theo cụm rõ ràng.",
    prep_en:
      "Prepare import groups so later A11 can read foundation, dialogue, map, QA, registry, and boundary packets in clear clusters.",
    regression_vi:
      "Nếu mọi thứ bị dồn vào một import list, người tích hợp sau sẽ dễ lẫn bundle.",
    regression_en:
      "If everything is forced into one import list, later integrators can easily mix bundles.",
    selector_vi: "Selector cần phân biệt core, review và boundary.",
    selector_en: "Selectors need to separate core, review, and boundary.",
    sample: {
      gurmukhi: "ਸੂਚੀ ਸਾਫ਼ ਰੱਖੋ।",
      romanization: "suchi saaf rakho",
      vi: "Giữ danh sách rõ ràng.",
      en: "Keep the list clear.",
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
    import_groups: ["core_imports", "review_imports", "boundary_imports"],
    prep_tags: ["import-groups", "bundle-scan", "later-a11"],
    learner_trap_vi:
      "Nhóm import rõ không có nghĩa là integration đã sẵn sàng chạy.",
    learner_trap_en:
      "Clear import groups do not mean integration is ready to run.",
  },
  {
    id: "prep-level-modules",
    area: "level_modules",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਪੱਧਰ ਮੋਡੀਊਲ",
    romanization: "paddar module",
    title_vi: "Module theo level",
    title_en: "Level modules",
    prep_vi:
      "Các module level cần giữ đường đi A1-C2, để later A11 map đúng progression và checkpoint.",
    prep_en:
      "Level modules should preserve the A1-C2 path so later A11 can map progression and checkpoints correctly.",
    regression_vi:
      "Nếu level module thiếu một bậc, route sẽ không còn khớp với course map.",
    regression_en:
      "If a level module misses a step, the route no longer lines up with the course map.",
    selector_vi: "Selectors dựa trên level phải bám A1-C2.",
    selector_en: "Level-based selectors should stay aligned with A1-C2.",
    sample: {
      gurmukhi: "ਹਰ ਪੱਧਰ ਲਈ ਇੱਕ ਰਾਹ ਹੈ।",
      romanization: "har paddar lai ik rah hai",
      vi: "Mỗi cấp có một đường đi.",
      en: "Each level has a route.",
    },
    expected_modules: [
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "masteryCheckpoints",
      "finalCanDoIndex",
      "finalNavigationMap",
    ],
    import_groups: ["level_imports", "progression_imports"],
    prep_tags: ["A1-C2", "level-coverage", "selectors"],
    learner_trap_vi:
      "A1-C2 là khung học, không phải chứng chỉ chính thức.",
    learner_trap_en:
      "A1-C2 is a learning frame, not official certification.",
  },
  {
    id: "prep-script-modules",
    area: "script_modules",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਲਿਪੀ ਮੋਡੀਊਲ",
    romanization: "lipi module",
    title_vi: "Module chữ viết",
    title_en: "Script modules",
    prep_vi:
      "Script modules phải giữ Gurmukhi-first, còn romanization chỉ hỗ trợ người học.",
    prep_en:
      "Script modules must stay Gurmukhi-first, with romanization only supporting the learner.",
    regression_vi:
      "Nếu Latin lên trước Gurmukhi, tín hiệu chữ chính sẽ yếu đi.",
    regression_en:
      "If Latin comes before Gurmukhi, the primary script signal weakens.",
    selector_vi: "Selector chữ viết cần ưu tiên Gurmukhi.",
    selector_en: "Script selectors should prioritize Gurmukhi.",
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
    import_groups: ["script_imports", "preview_imports"],
    prep_tags: ["gurmukhi-first", "script", "preview"],
    learner_trap_vi:
      "Romanization không ghi hết bật hơi và retroflex.",
    learner_trap_en:
      "Romanization does not fully show aspiration and retroflex.",
  },
  {
    id: "prep-canada-modules",
    area: "canada_modules",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2"],
    title_pa: "ਕੈਨੇਡਾ ਮੋਡੀਊਲ",
    romanization: "Canada module",
    title_vi: "Module Canada",
    title_en: "Canada modules",
    prep_vi:
      "Canada modules cần giữ settlement, school office, clinic, work và service desk đủ cụ thể.",
    prep_en:
      "Canada modules should keep settlement, school office, clinic, work, and service-desk content concrete.",
    regression_vi:
      "Nếu ngữ cảnh quá chung chung, later A11 sẽ tưởng đây là textbook hơn là đời thực Canada.",
    regression_en:
      "If the context is too vague, later A11 will treat it like a textbook instead of real Canada situations.",
    selector_vi: "Selector Canada nên tách survival, work, health và service.",
    selector_en: "Canada selectors should separate survival, work, health, and service.",
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
    import_groups: ["canada_imports", "public_service_imports"],
    prep_tags: ["canada-practical", "settlement", "service-desk"],
    learner_trap_vi:
      "Pata là address; đừng lẫn với phone number hay document number.",
    learner_trap_en:
      "Pata means address; do not confuse it with a phone number or document number.",
    canada_practical:
      "Settlement forms, school offices, municipal counters, community forms, and clinic intake in Canada.",
  },
  {
    id: "prep-remediation-modules",
    area: "remediation_modules",
    status: "ready_for_later_a11",
    levels: ["B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਰੰਮਤ ਮੋਡੀਊਲ",
    romanization: "murammat module",
    title_vi: "Module sửa lỗi",
    title_en: "Remediation modules",
    prep_vi:
      "Remediation modules phải chỉ rõ cách sửa trap về politeness, grammar, reading và writing trước khi map sang A11.",
    prep_en:
      "Remediation modules should show how to fix politeness, grammar, reading, and writing traps before mapping to A11.",
    regression_vi:
      "Thiếu remediation sẽ làm selector chỉ thấy lỗi mà không có bước sửa.",
    regression_en:
      "Without remediation, selectors will only show errors and no repair step.",
    selector_vi: "Selector remediation nên trỏ tới checkpoint và next step.",
    selector_en: "Remediation selectors should point to checkpoints and next steps.",
    sample: {
      gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਦੁਬਾਰਾ ਲਿਖੋ।",
      romanization: "kirpa karke ih dubara likho",
      vi: "Xin vui lòng viết lại điều này.",
      en: "Please write this again.",
    },
    expected_modules: [
      "skillDependencyGraph",
      "masteryCheckpoints",
      "finalCanDoIndex",
      "finalNavigationMap",
      "preMrAuditChecklist",
    ],
    import_groups: ["remediation_imports", "repair_imports"],
    prep_tags: ["remediation", "repair", "next-step"],
    learner_trap_vi:
      "Một marker lịch sự không cứu được cả câu nếu register vẫn thô.",
    learner_trap_en:
      "One politeness marker cannot fix a whole sentence if the register stays blunt.",
  },
  {
    id: "prep-selector-routes",
    area: "selector_routes",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਚੋਣਕ ਰਾਹ",
    romanization: "selector rah",
    title_vi: "Đường selector",
    title_en: "Selector routes",
    prep_vi:
      "Selector routes cần cho later A11 biết import nào là core, review, selector, readiness và boundary.",
    prep_en:
      "Selector routes should tell later A11 which imports are core, review, selector, readiness, and boundary.",
    regression_vi:
      "Nếu selector route mơ hồ, package sẽ khó tách pre-integration khỏi final-readiness.",
    regression_en:
      "If selector routes are vague, the package will struggle to separate pre-integration from final readiness.",
    selector_vi: "Selector map phải dùng ID rõ ràng, không chỉ ghi chú rời.",
    selector_en: "Selector maps should use clear IDs, not loose notes.",
    sample: {
      gurmukhi: "ਰਾਹ ਸਪਸ਼ਟ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।",
      romanization: "rah spasht hona chahida hai",
      vi: "Đường đi phải rõ.",
      en: "The route should be clear.",
    },
    expected_modules: [
      "preIntegrationCoverageMap",
      "preIntegrationHandoffMap",
      "finalNavigationMap",
      "finalQualityGates",
      "finalContentManifest",
    ],
    import_groups: ["selector_imports", "route_imports"],
    prep_tags: ["selector", "route-map", "pre-integration"],
    learner_trap_vi:
      "Selector rõ không có nghĩa là đã merge hay deploy.",
    learner_trap_en:
      "A clear selector does not mean merge or deploy is done.",
  },
  {
    id: "prep-pre-integration-readiness",
    area: "pre_integration_readiness",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਪੂਰਵ ਇਕੀਕਰਨ ਤਿਆਰੀ",
    romanization: "purav integration tiari",
    title_vi: "Sẵn sàng tiền tích hợp",
    title_en: "Pre-integration readiness",
    prep_vi:
      "Pre-integration readiness phải gom coverage, evidence, handoff, quality gates và manifest trước khi later A11 chạm vào code.",
    prep_en:
      "Pre-integration readiness should collect coverage, evidence, handoff, quality gates, and manifest data before later A11 touches code.",
    regression_vi:
      "Thiếu một checklist là đủ để kéo lùi toàn bộ pipeline đọc.",
    regression_en:
      "Missing one checklist is enough to drag down the whole reading pipeline.",
    selector_vi: "Pre-integration selector should prefer checklist over guesswork.",
    selector_en: "Pre-integration selectors should prefer checklists over guesswork.",
    sample: {
      gurmukhi: "ਚੈਕਲਿਸਟ ਪੂਰੀ ਕਰੋ।",
      romanization: "checklist puri karo",
      vi: "Hãy hoàn tất checklist.",
      en: "Complete the checklist.",
    },
    expected_modules: [
      "preIntegrationCoverageMap",
      "preMrAuditChecklist",
      "preIntegrationHandoffMap",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
    ],
    import_groups: ["pre_integration_imports", "coverage_imports"],
    prep_tags: ["pre-integration", "coverage", "evidence"],
    learner_trap_vi:
      "Pre-integration readiness không phải là A11 integration.",
    learner_trap_en:
      "Pre-integration readiness is not A11 integration.",
  },
  {
    id: "prep-final-readiness",
    area: "final_readiness",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਫਾਈਨਲ ਤਿਆਰੀ",
    romanization: "final tiari",
    title_vi: "Sẵn sàng cuối",
    title_en: "Final readiness",
    prep_vi:
      "Final readiness cần line-up giữa summary, owner review, risk register, export readiness và packaging readiness.",
    prep_en:
      "Final readiness should line up summary, owner review, risk register, export readiness, and packaging readiness.",
    regression_vi:
      "Một bundle đẹp nhưng lệch tên vẫn chưa thể coi là ready.",
    regression_en:
      "A polished bundle with mismatched names still cannot be called ready.",
    selector_vi: "Final selector nên kiểm boundary trước khi chốt.",
    selector_en: "Final selectors should check boundaries before closing.",
    sample: {
      gurmukhi: "ਇਕਸਾਰਤਾ ਲਾਜ਼ਮੀ ਹੈ।",
      romanization: "iksarata lazmi hai",
      vi: "Tính nhất quán là bắt buộc.",
      en: "Consistency is mandatory.",
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
    import_groups: ["final_readiness_imports", "boundary_imports"],
    prep_tags: ["final-readiness", "consistency", "bundle-check"],
    learner_trap_vi:
      "Final readiness không đồng nghĩa native review đã xong.",
    learner_trap_en:
      "Final readiness does not mean native review is finished.",
  },
  {
    id: "prep-deferred-review",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ",
    romanization: "multavi samikhia",
    title_vi: "Review hoãn",
    title_en: "Deferred review",
    prep_vi:
      "Native review được hoãn trong map này; không được biến thành completion.",
    prep_en:
      "Native review is deferred in this map and completion is not claimed.",
    regression_vi:
      "Nếu nhãn đổi sang done hoặc approved, map đã vượt scope.",
    regression_en:
      "If the label changes to done or approved, the map has gone out of scope.",
    selector_vi: "Boundary selector nên khóa các claim hoàn tất.",
    selector_en: "Boundary selectors should block completion claims.",
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
    import_groups: ["boundary_imports", "review_imports"],
    prep_tags: ["deferred", "native-review", "boundary"],
    learner_trap_vi:
      "Deferred không bao giờ nên được trình bày như hoàn tất.",
    learner_trap_en:
      "Deferred should never be presented as complete.",
    must_not_claim_vi: "Không claim native review hoặc completion đã xong.",
    must_not_claim_en: "Do not claim native review or completion is done.",
  },
  {
    id: "prep-forbidden-claims",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾ claim ਕਰੋ",
    romanization: "na claim karo",
    title_vi: "Không được claim",
    title_en: "Must not claim",
    prep_vi:
      "Map này không được claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy hoặc A11 integration.",
    prep_en:
      "This map must not claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy, or A11 integration.",
    regression_vi:
      "Nếu wording quảng bá lọt vào, packet sẽ kể sai khả năng của hệ thống.",
    regression_en:
      "If promotional wording slips in, the packet will misstate system capability.",
    selector_vi: "Boundary selector cần chặn mọi claim vượt scope.",
    selector_en: "Boundary selectors must block out-of-scope claims.",
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
    import_groups: ["boundary_imports", "safe_imports"],
    prep_tags: ["must-not-claim", "text-only", "not-a11"],
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

export const PUNJABI_A11_PREPARATION_MAP_ROUTES = [
  {
    id: "prep-route-imports-to-levels",
    vi: "Kiểm import groups rồi map sang level modules.",
    en: "Check import groups and then map to level modules.",
    item_ids: ["prep-import-groups", "prep-level-modules"],
  },
  {
    id: "prep-route-script-to-canada",
    vi: "Kiểm Gurmukhi-first và Canada-practical routes.",
    en: "Check Gurmukhi-first and Canada-practical routes.",
    item_ids: ["prep-script-modules", "prep-canada-modules"],
  },
  {
    id: "prep-route-remediation-to-boundary",
    vi: "Kiểm remediation, selectors, readiness và boundary claims.",
    en: "Check remediation, selectors, readiness, and boundary claims.",
    item_ids: [
      "prep-remediation-modules",
      "prep-selector-routes",
      "prep-pre-integration-readiness",
      "prep-final-readiness",
      "prep-deferred-review",
      "prep-forbidden-claims",
    ],
  },
];

export const PUNJABI_A11_PREPARATION_ROUTES =
  PUNJABI_A11_PREPARATION_MAP_ROUTES;

export const PUNJABI_A11_PREPARATION_MAP_ROOT = {
  scope: PUNJABI_A11_PREPARATION_MAP_SCOPE,
  areas: PUNJABI_A11_PREPARATION_AREAS,
  preparation: PUNJABI_A11_PREPARATION_MAP,
  routes: PUNJABI_A11_PREPARATION_MAP_ROUTES,
};

export default PUNJABI_A11_PREPARATION_MAP_ROOT;
