// src/languages/punjabi/finalA11HandoffNotes.ts
//
// Wave 30 final A11 handoff notes for Punjabi.
// This is not A11 integration. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalA11HandoffArea =
  | "module_families"
  | "export_readiness"
  | "naming_checks"
  | "gurmukhi_first"
  | "learner_support"
  | "canada_domains"
  | "final_handoff"
  | "pre_integration_readiness"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiFinalA11HandoffStatus =
  | "ready_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalA11HandoffItem = {
  id: string;
  area: PunjabiFinalA11HandoffArea;
  status: PunjabiFinalA11HandoffStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  handoff_vi: string;
  handoff_en: string;
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
  handoff_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_A11_HANDOFF_NOTES_SCOPE = {
  wave: "Wave 30",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  script_note_vi:
    "Final A11 handoff notes này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ là awareness-only, không phải full course.",
  script_note_en:
    "These final A11 handoff notes use Gurmukhi as the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã hoàn tất.",
  native_review_en: "Native review is deferred; completion is not claimed.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
};

export const PUNJABI_FINAL_A11_HANDOFF_NOTES_SCOPE_ALIAS =
  PUNJABI_FINAL_A11_HANDOFF_NOTES_SCOPE;

export const PUNJABI_FINAL_A11_HANDOFF_NOTES_PLAN_SCOPE =
  PUNJABI_FINAL_A11_HANDOFF_NOTES_SCOPE;

export const PUNJABI_FINAL_A11_HANDOFF_NOTES_AREAS: PunjabiFinalA11HandoffArea[] = [
  "module_families",
  "export_readiness",
  "naming_checks",
  "gurmukhi_first",
  "learner_support",
  "canada_domains",
  "final_handoff",
  "pre_integration_readiness",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_FINAL_A11_HANDOFF_NOTES: PunjabiFinalA11HandoffItem[] = [
  {
    id: "handoff-module-families",
    area: "module_families",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ families",
    romanization: "module families",
    title_vi: "Nhóm module",
    title_en: "Module families",
    handoff_vi:
      "Handoff notes nên gom foundation, dialogue, map, QA, registry, manifest và boundary artifacts theo family rõ ràng.",
    handoff_en:
      "Handoff notes should group foundation, dialogue, map, QA, registry, manifest, and boundary artifacts into clear families.",
    regression_vi:
      "Nếu family bị trộn, later A11 sẽ không biết file nào là core và file nào là boundary.",
    regression_en:
      "If families are mixed, later A11 will not know which files are core and which are boundary.",
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
    handoff_tags: ["module-families", "bundle-scan", "later-a11"],
    learner_trap_vi:
      "Family rõ ràng không có nghĩa integration đã sẵn sàng chạy.",
    learner_trap_en:
      "Clear families do not mean integration is ready to run.",
  },
  {
    id: "handoff-export-readiness",
    area: "export_readiness",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਐਕਸਪੋਰਟ readiness",
    romanization: "export readiness",
    title_vi: "Sẵn sàng export",
    title_en: "Export readiness",
    handoff_vi:
      "Export readiness phải giữ thứ tự core, review rồi boundary để later A11 đọc đúng layer.",
    handoff_en:
      "Export readiness should keep the order core, review, then boundary so later A11 reads the correct layer.",
    regression_vi:
      "Nếu boundary lên trước core, handoff notes sẽ khó theo dõi hơn.",
    regression_en:
      "If boundary comes before core, the handoff notes are harder to follow.",
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
    handoff_tags: ["ordering", "exports", "layering"],
    learner_trap_vi:
      "Export readiness tốt không có nghĩa native review đã xong.",
    learner_trap_en:
      "Good export readiness does not mean native review is finished.",
  },
  {
    id: "handoff-naming-checks",
    area: "naming_checks",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਂ ਜਾਂਚ",
    romanization: "naam janch",
    title_vi: "Kiểm tên",
    title_en: "Naming checks",
    handoff_vi:
      "Tên file, export name, item ID và route ID phải khớp để tránh drift trong handoff.",
    handoff_en:
      "File names, export names, item IDs, and route IDs must match to avoid drift in the handoff.",
    regression_vi:
      "Chỉ một ID lệch là route và summary sẽ không còn khớp.",
    regression_en:
      "A single mismatched ID is enough to break route and summary alignment.",
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
    handoff_tags: ["naming", "consistency", "ids"],
    learner_trap_vi:
      "Tên nhất quán không có nghĩa là packet đã sẵn sàng merge.",
    learner_trap_en:
      "Consistent names do not mean the packet is ready to merge.",
  },
  {
    id: "handoff-gurmukhi-first",
    area: "gurmukhi_first",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ",
    romanization: "Gurmukhi pehlan",
    title_vi: "Gurmukhi trước",
    title_en: "Gurmukhi first",
    handoff_vi:
      "Gurmukhi phải đứng trước romanization trong title, sample và preview.",
    handoff_en:
      "Gurmukhi must appear before romanization in titles, samples, and previews.",
    regression_vi:
      "Nếu Latin lên trước, tín hiệu chữ chính sẽ yếu đi.",
    regression_en:
      "If Latin comes first, the primary script signal weakens.",
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
    handoff_tags: ["gurmukhi-first", "script-order", "preview"],
    learner_trap_vi:
      "Romanization không thể hiện đầy đủ bật hơi và retroflex.",
    learner_trap_en:
      "Romanization does not fully show aspiration and retroflex.",
  },
  {
    id: "handoff-vi-en-support",
    area: "learner_support",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਦੋ-ਭਾਸ਼ੀ ਸਹਾਇਤਾ",
    romanization: "do-bhashi sahaita",
    title_vi: "Hỗ trợ Việt-Anh",
    title_en: "Vietnamese-English support",
    handoff_vi:
      "Notes handoff cần giải thích bằng tiếng Việt và tiếng Anh cho mục tiêu, sample, trap và QA.",
    handoff_en:
      "Handoff notes need Vietnamese and English explanations for goals, samples, traps, and QA.",
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
    handoff_tags: ["vi-support", "en-support", "learner-explanations"],
    learner_trap_vi:
      "Translation không thay thế error notes riêng cho người Việt.",
    learner_trap_en:
      "Translation does not replace learner-specific error notes.",
  },
  {
    id: "handoff-canada-domains",
    area: "canada_domains",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2"],
    title_pa: "ਕੈਨੇਡਾ ਡੋਮੇਨ",
    romanization: "Canada domain",
    title_vi: "Miền Canada",
    title_en: "Canada domains",
    handoff_vi:
      "Canada domains nên giữ settlement, school office, work, clinic, address và documents đủ cụ thể.",
    handoff_en:
      "Canada domains should keep settlement, school office, work, clinic, address, and documents concrete.",
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
    handoff_tags: ["canada-practical", "settlement", "public-service"],
    learner_trap_vi:
      "Pata là address; đừng lẫn với phone number hoặc document number.",
    learner_trap_en:
      "Pata means address; do not confuse it with a phone number or document number.",
    canada_practical:
      "Settlement forms, school offices, municipal counters, community forms, and clinic intake in Canada.",
  },
  {
    id: "handoff-final-handoff",
    area: "final_handoff",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਫਾਈਨਲ handoff",
    romanization: "final handoff",
    title_vi: "Bàn giao cuối",
    title_en: "Final handoff",
    handoff_vi:
      "Final handoff nên line-up summary, owner review, risk register, export readiness và packaging readiness.",
    handoff_en:
      "The final handoff should line up summary, owner review, risk register, export readiness, and packaging readiness.",
    regression_vi:
      "Một bundle đẹp nhưng lệch tên vẫn chưa thể coi là ready.",
    regression_en:
      "A polished bundle with mismatched names still cannot be called ready.",
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
      "finalIntegrationDryRunPlan",
    ],
    export_groups: ["handoff_exports", "consistency_exports"],
    handoff_tags: ["final-handoff", "consistency", "bundle-check"],
    learner_trap_vi:
      "Final handoff không có nghĩa native review đã xong.",
    learner_trap_en:
      "Final handoff does not mean native review is finished.",
  },
  {
    id: "handoff-pre-integration-readiness",
    area: "pre_integration_readiness",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਪੂਰਵ ਇਕੀਕਰਨ ਤਿਆਰੀ",
    romanization: "purav integration tiari",
    title_vi: "Sẵn sàng tiền tích hợp",
    title_en: "Pre-integration readiness",
    handoff_vi:
      "Pre-integration readiness phải gom summary, review packet, risk register, export readiness và packaging readiness trước khi later A11 chạm vào code.",
    handoff_en:
      "Pre-integration readiness should collect summary, review packet, risk register, export readiness, and packaging readiness before later A11 touches code.",
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
      "finalIntegrationDryRunPlan",
    ],
    export_groups: ["readiness_exports", "boundary_exports"],
    handoff_tags: ["pre-integration", "coverage", "evidence"],
    learner_trap_vi:
      "Pre-integration readiness không phải là A11 integration.",
    learner_trap_en:
      "Pre-integration readiness is not A11 integration.",
  },
  {
    id: "handoff-deferred-review",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ",
    romanization: "multavi samikhia",
    title_vi: "Review hoãn",
    title_en: "Deferred review",
    handoff_vi:
      "Native review phải luôn được ghi là deferred trong handoff notes này; không được biến thành completion.",
    handoff_en:
      "Native review is deferred in these handoff notes and completion is not claimed.",
    regression_vi:
      "Nếu nhãn đổi sang done hoặc approved, notes đã vượt scope.",
    regression_en:
      "If the label changes to done or approved, the notes have gone out of scope.",
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
    handoff_tags: ["deferred", "native-review", "boundary"],
    learner_trap_vi:
      "Deferred không bao giờ nên được trình bày như hoàn tất.",
    learner_trap_en:
      "Deferred should never be presented as complete.",
    must_not_claim_vi: "Không claim native review hoặc completion đã xong.",
    must_not_claim_en: "Do not claim native review or completion is done.",
  },
  {
    id: "handoff-forbidden-claims",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾ claim ਕਰੋ",
    romanization: "na claim karo",
    title_vi: "Không được claim",
    title_en: "Must not claim",
    handoff_vi:
      "Map này không được claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy hoặc A11 integration.",
    handoff_en:
      "This map must not claim audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy, or A11 integration.",
    regression_vi:
      "Nếu wording quảng bá lọt vào, notes sẽ kể sai khả năng của hệ thống.",
    regression_en:
      "If promotional wording slips in, the notes will misstate system capability.",
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
    handoff_tags: ["must-not-claim", "text-only", "not-a11"],
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

export const PUNJABI_FINAL_A11_HANDOFF_NOTES_ROUTES = [
  {
    id: "handoff-route-structure",
    vi: "Kiểm module families, export readiness và naming.",
    en: "Check module families, export readiness, and naming.",
    item_ids: ["handoff-module-families", "handoff-export-readiness", "handoff-naming-checks"],
  },
  {
    id: "handoff-route-support",
    vi: "Kiểm Gurmukhi-first, VI/EN support và Canada domains.",
    en: "Check Gurmukhi-first, VI/EN support, and Canada domains.",
    item_ids: ["handoff-gurmukhi-first", "handoff-vi-en-support", "handoff-canada-domains"],
  },
  {
    id: "handoff-route-boundary",
    vi: "Kiểm final handoff, pre-integration readiness, deferred review và forbidden claims.",
    en: "Check final handoff, pre-integration readiness, deferred review, and forbidden claims.",
    item_ids: [
      "handoff-final-handoff",
      "handoff-pre-integration-readiness",
      "handoff-deferred-review",
      "handoff-forbidden-claims",
    ],
  },
];

export const PUNJABI_FINAL_A11_HANDOFF_NOTES_ROOT = {
  scope: PUNJABI_FINAL_A11_HANDOFF_NOTES_SCOPE,
  areas: PUNJABI_FINAL_A11_HANDOFF_NOTES_AREAS,
  handoff_notes: PUNJABI_FINAL_A11_HANDOFF_NOTES,
  routes: PUNJABI_FINAL_A11_HANDOFF_NOTES_ROUTES,
};

export default PUNJABI_FINAL_A11_HANDOFF_NOTES_ROOT;
