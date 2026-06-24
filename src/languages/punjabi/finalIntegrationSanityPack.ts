// src/languages/punjabi/finalIntegrationSanityPack.ts
//
// Wave 31 final integration sanity pack for Punjabi.
// This is a pre-integration sanity pack for later A11 only.
// This is not A11 integration. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiSanityArea =
  | "module_families"
  | "naming_expectations"
  | "duplicate_risk"
  | "export_readiness"
  | "gurmukhi_first"
  | "learner_support"
  | "canada_domains"
  | "sanity_regression"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiSanityStatus =
  | "ready_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiSanityItem = {
  id: string;
  area: PunjabiSanityArea;
  status: PunjabiSanityStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  check_vi: string;
  check_en: string;
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
  sanity_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_SANITY_PACK_SCOPE = {
  wave: "Wave 31",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  purpose_vi:
    "Sanity pack cuối cùng chỉ phục vụ later A11; nó giúp kiểm tra nhanh trước khi tích hợp, không tự tích hợp.",
  purpose_en:
    "A final sanity pack for later A11 only; it supports a quick pre-integration check and does not integrate anything itself.",
  script_note_vi:
    "Sanity pack này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ là awareness-only, không phải full course.",
  script_note_en:
    "This sanity pack uses Gurmukhi as the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã hoàn tất.",
  native_review_en: "Native review is deferred; completion is not claimed.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
};

export const PUNJABI_FINAL_SANITY_PACK_SCOPE_ALIAS =
  PUNJABI_FINAL_SANITY_PACK_SCOPE;

export const PUNJABI_FINAL_SANITY_PACK_PLAN_SCOPE =
  PUNJABI_FINAL_SANITY_PACK_SCOPE;

export const PUNJABI_FINAL_SANITY_PACK_AREAS: PunjabiSanityArea[] = [
  "module_families",
  "naming_expectations",
  "duplicate_risk",
  "export_readiness",
  "gurmukhi_first",
  "learner_support",
  "canada_domains",
  "sanity_regression",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_FINAL_SANITY_PACK: PunjabiSanityItem[] = [
  {
    id: "sanity-module-families",
    area: "module_families",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ families",
    romanization: "module families",
    title_vi: "Nhóm module",
    title_en: "Module families",
    check_vi:
      "Xác nhận các family foundation, dialogue, map, QA, registry, manifest và boundary đều có mặt và không trộn lẫn.",
    check_en:
      "Confirm the foundation, dialogue, map, QA, registry, manifest, and boundary families are all present and not mixed.",
    regression_vi:
      "Nếu thiếu một family, later A11 sẽ tích hợp một bộ nội dung không đầy đủ.",
    regression_en:
      "If a family is missing, later A11 will integrate an incomplete content set.",
    sample: {
      gurmukhi: "ਸਾਰੇ ਹਿੱਸੇ ਮੌਜੂਦ ਹਨ।",
      romanization: "saare hisse maujood han",
      vi: "Tất cả các phần đều có mặt.",
      en: "All the parts are present.",
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
    sanity_tags: ["module-families", "presence-check", "later-a11"],
    learner_trap_vi:
      "Có đủ family không có nghĩa nội dung đã được native review.",
    learner_trap_en:
      "Having all families does not mean the content has been native reviewed.",
  },
  {
    id: "sanity-naming-expectations",
    area: "naming_expectations",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਂ ਉਮੀਦਾਂ",
    romanization: "naam umeedan",
    title_vi: "Kỳ vọng đặt tên",
    title_en: "Naming expectations",
    check_vi:
      "Tên file, export name, item ID và route ID phải theo cùng quy ước punjabi/camelCase để later A11 import đúng.",
    check_en:
      "File names, export names, item IDs, and route IDs should follow the same punjabi camelCase convention so later A11 imports cleanly.",
    regression_vi:
      "Một export đổi tên là đủ làm later A11 import gãy.",
    regression_en:
      "A single renamed export is enough to break later A11 imports.",
    sample: {
      gurmukhi: "ਨਾਮ ਇਕਸਾਰ ਰੱਖੋ।",
      romanization: "naam iksar rakho",
      vi: "Giữ tên nhất quán.",
      en: "Keep names consistent.",
    },
    expected_modules: [
      "index",
      "finalModuleRegistry",
      "finalContentManifest",
      "finalExportReadiness",
      "finalNavigationMap",
    ],
    export_groups: ["naming_exports", "route_exports", "boundary_exports"],
    sanity_tags: ["naming", "convention", "imports"],
    learner_trap_vi:
      "Tên đẹp không có nghĩa export đã được kiểm trùng.",
    learner_trap_en:
      "Nice names do not mean exports have been checked for duplicates.",
  },
  {
    id: "sanity-duplicate-risk",
    area: "duplicate_risk",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ਖ਼ਤਰਾ",
    romanization: "duplicate khatra",
    title_vi: "Rủi ro trùng lặp",
    title_en: "Duplicate risk",
    check_vi:
      "Quét item ID, export name và route ID để chắc chắn không có cái nào lặp lại giữa các module.",
    check_en:
      "Scan item IDs, export names, and route IDs to ensure none are duplicated across modules.",
    regression_vi:
      "Hai ID trùng nhau sẽ làm one-owner-per-function bị phá và later A11 ghi đè nhầm.",
    regression_en:
      "Two duplicated IDs break the one-owner-per-function rule and let later A11 overwrite the wrong entry.",
    sample: {
      gurmukhi: "ਕੋਈ ਨਕਲ ਨਹੀਂ ਹੋਣੀ ਚਾਹੀਦੀ।",
      romanization: "koi nakal nahin honi chahidi",
      vi: "Không được có bản trùng.",
      en: "There should be no duplicate.",
    },
    expected_modules: [
      "finalModuleRegistry",
      "finalContentManifest",
      "finalIntegrationEvidenceMap",
      "finalExportReadiness",
      "preMrAuditChecklist",
    ],
    export_groups: ["dedupe_exports", "review_exports", "boundary_exports"],
    sanity_tags: ["duplicate-risk", "one-owner", "scan"],
    learner_trap_vi:
      "Tên giống nhau ở các level khác nhau chưa chắc là trùng; phải so theo ID đầy đủ.",
    learner_trap_en:
      "Similar names at different levels are not always duplicates; compare by full ID.",
  },
  {
    id: "sanity-export-readiness",
    area: "export_readiness",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਐਕਸਪੋਰਟ readiness",
    romanization: "export readiness",
    title_vi: "Sẵn sàng export",
    title_en: "Export readiness",
    check_vi:
      "Mỗi module phải có default export và named export ổn định theo thứ tự core, review rồi boundary.",
    check_en:
      "Each module should have a stable default export and named exports in the order core, review, then boundary.",
    regression_vi:
      "Thiếu một export là later A11 không truy cập được dữ liệu của module đó.",
    regression_en:
      "A missing export means later A11 cannot reach that module's data.",
    sample: {
      gurmukhi: "ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਣ ਹੈ।",
      romanization: "kram mahatvapurn hai",
      vi: "Thứ tự rất quan trọng.",
      en: "Order matters.",
    },
    expected_modules: [
      "finalExportReadiness",
      "finalPackagingReadiness",
      "finalContentManifest",
      "finalPreIntegrationSummary",
      "finalIntegrationRiskRegister",
    ],
    export_groups: ["order_exports", "route_exports", "boundary_exports"],
    sanity_tags: ["export-readiness", "ordering", "stability"],
    learner_trap_vi:
      "Export readiness tốt không có nghĩa native review đã xong.",
    learner_trap_en:
      "Good export readiness does not mean native review is finished.",
  },
  {
    id: "sanity-gurmukhi-first",
    area: "gurmukhi_first",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ",
    romanization: "Gurmukhi pehlan",
    title_vi: "Gurmukhi trước",
    title_en: "Gurmukhi first",
    check_vi:
      "Gurmukhi phải đứng trước romanization trong title, sample và preview của mọi module.",
    check_en:
      "Gurmukhi must come before romanization in every module's titles, samples, and previews.",
    regression_vi:
      "Nếu Latin lên trước, tín hiệu chữ chính của khóa học sẽ yếu đi.",
    regression_en:
      "If Latin comes first, the course's primary-script signal weakens.",
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
    sanity_tags: ["gurmukhi-first", "script-order", "preview"],
    learner_trap_vi:
      "Romanization không thể hiện đầy đủ bật hơi và âm retroflex.",
    learner_trap_en:
      "Romanization does not fully show aspiration and retroflex sounds.",
  },
  {
    id: "sanity-vi-en-support",
    area: "learner_support",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਦੋ-ਭਾਸ਼ੀ ਸਹਾਇਤਾ",
    romanization: "do-bhashi sahaita",
    title_vi: "Hỗ trợ Việt-Anh",
    title_en: "Vietnamese-English support",
    check_vi:
      "Mỗi item phải có giải thích tiếng Việt và tiếng Anh cho mục tiêu, sample, trap và regression.",
    check_en:
      "Each item must carry Vietnamese and English explanations for goals, samples, traps, and regressions.",
    regression_vi:
      "Thiếu VI/EN khiến người học Việt phải đoán nghĩa của cảnh báo sanity.",
    regression_en:
      "Missing VI/EN explanations make Vietnamese-speaking learners guess at the sanity warnings.",
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
    sanity_tags: ["vi-support", "en-support", "learner-explanations"],
    learner_trap_vi:
      "Bản dịch không thay thế error notes riêng cho người Việt.",
    learner_trap_en:
      "Translation does not replace learner-specific error notes.",
  },
  {
    id: "sanity-canada-domains",
    area: "canada_domains",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2"],
    title_pa: "ਕੈਨੇਡਾ ਡੋਮੇਨ",
    romanization: "Canada domain",
    title_vi: "Miền Canada",
    title_en: "Canada domains",
    check_vi:
      "Kiểm tra settlement, school office, work, clinic, address và document vẫn còn cụ thể và thực tế ở Canada.",
    check_en:
      "Check that settlement, school office, work, clinic, address, and document content stays concrete and Canada-realistic.",
    regression_vi:
      "Nếu nội dung quá chung chung, later A11 sẽ giống textbook hơn là tình huống Canada thật.",
    regression_en:
      "If the content is too vague, later A11 will feel textbook-like instead of like real Canada situations.",
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
    sanity_tags: ["canada-practical", "settlement", "public-service"],
    learner_trap_vi:
      "Pata là address; đừng lẫn với số điện thoại hoặc số giấy tờ.",
    learner_trap_en:
      "Pata means address; do not confuse it with a phone number or document number.",
    canada_practical:
      "Settlement office forms, school front desks, municipal counters, walk-in clinic intake, and address-change letters in Canada.",
  },
  {
    id: "sanity-final-regression",
    area: "sanity_regression",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਫਾਈਨਲ regression",
    romanization: "final regression",
    title_vi: "Hồi quy cuối",
    title_en: "Final regression",
    check_vi:
      "Chạy lại toàn bộ test suite Punjabi và xác nhận không có file nào bị xóa hay đảo ngược so với wave trước.",
    check_en:
      "Re-run the full Punjabi test suite and confirm no file was deleted or reverted versus the previous wave.",
    regression_vi:
      "Một test xanh đơn lẻ không chứng minh được toàn bộ pipeline vẫn còn nguyên.",
    regression_en:
      "A single green test does not prove the whole pipeline is still intact.",
    sample: {
      gurmukhi: "ਸਭ ਕੁਝ ਪਹਿਲਾਂ ਵਾਂਗ ਚੱਲਦਾ ਹੈ।",
      romanization: "sabh kujh pehlan vaang chalda hai",
      vi: "Mọi thứ vẫn chạy như trước.",
      en: "Everything still runs as before.",
    },
    expected_modules: [
      "finalSmokeChecklist",
      "finalQualityGates",
      "finalQaInventory",
      "finalIntegrationStabilityPlan",
      "finalIntegrationDryRunPlan",
    ],
    export_groups: ["regression_exports", "sanity_exports", "boundary_exports"],
    sanity_tags: ["final-regression", "smoke", "pre-integration"],
    learner_trap_vi:
      "Sanity regression chỉ là pre-integration; nó không phải là A11 integration.",
    learner_trap_en:
      "A sanity regression is only pre-integration; it is not A11 integration.",
  },
  {
    id: "sanity-deferred-review",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ",
    romanization: "multavi samikhia",
    title_vi: "Review hoãn",
    title_en: "Deferred review",
    check_vi:
      "Native review phải luôn được ghi là deferred trong sanity pack này; không được biến thành completion.",
    check_en:
      "Native review is deferred in this sanity pack and completion is not claimed.",
    regression_vi:
      "Nếu nhãn đổi sang done hoặc approved, pack đã vượt scope.",
    regression_en:
      "If the label changes to done or approved, the pack has gone out of scope.",
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
    sanity_tags: ["deferred", "native-review", "boundary"],
    learner_trap_vi:
      "Deferred không bao giờ nên được trình bày như đã hoàn tất.",
    learner_trap_en:
      "Deferred should never be presented as complete.",
    must_not_claim_vi: "Không claim native review hoặc completion đã xong.",
    must_not_claim_en: "Do not claim native review or completion is done.",
  },
  {
    id: "sanity-forbidden-claims",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾ claim ਕਰੋ",
    romanization: "na claim karo",
    title_vi: "Không được claim",
    title_en: "Must not claim",
    check_vi:
      "Pack này không được claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy hoặc A11 integration.",
    check_en:
      "This pack must not claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy, or A11 integration.",
    regression_vi:
      "Nếu wording quảng bá lọt vào, pack sẽ kể sai khả năng của hệ thống.",
    regression_en:
      "If promotional wording slips in, the pack will misstate system capability.",
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
    sanity_tags: ["must-not-claim", "text-only", "not-a11"],
    learner_trap_vi:
      "Text-only data không tự sinh audio hay scoring.",
    learner_trap_en:
      "Text only data does not create audio or scoring.",
    must_not_claim_vi:
      "Không claim audio, scoring, Azure, Supabase, deploy, push hoặc A11 integration.",
    must_not_claim_en:
      "Do not claim audio, pronunciation scoring, Azure, Supabase, deploy, push, or A11 integration; not A11 integration and no A11 integration must both stay out of scope.",
  },
];

export const PUNJABI_FINAL_SANITY_PACK_ROUTES = [
  {
    id: "sanity-route-structure",
    vi: "Kiểm module families, naming expectations, duplicate risk và export readiness.",
    en: "Check module families, naming expectations, duplicate risk, and export readiness.",
    item_ids: [
      "sanity-module-families",
      "sanity-naming-expectations",
      "sanity-duplicate-risk",
      "sanity-export-readiness",
    ],
  },
  {
    id: "sanity-route-support",
    vi: "Kiểm Gurmukhi-first, VI/EN support và Canada domains.",
    en: "Check Gurmukhi-first, VI/EN support, and Canada domains.",
    item_ids: [
      "sanity-gurmukhi-first",
      "sanity-vi-en-support",
      "sanity-canada-domains",
    ],
  },
  {
    id: "sanity-route-boundary",
    vi: "Kiểm final regression, deferred review và forbidden claims.",
    en: "Check final regression, deferred review, and forbidden claims.",
    item_ids: [
      "sanity-final-regression",
      "sanity-deferred-review",
      "sanity-forbidden-claims",
    ],
  },
];

export const PUNJABI_FINAL_SANITY_PACK_ROOT = {
  scope: PUNJABI_FINAL_SANITY_PACK_SCOPE,
  areas: PUNJABI_FINAL_SANITY_PACK_AREAS,
  sanity_items: PUNJABI_FINAL_SANITY_PACK,
  routes: PUNJABI_FINAL_SANITY_PACK_ROUTES,
};

export default PUNJABI_FINAL_SANITY_PACK_ROOT;
