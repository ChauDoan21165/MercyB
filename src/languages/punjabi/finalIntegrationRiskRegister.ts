// src/languages/punjabi/finalIntegrationRiskRegister.ts
//
// Wave 23 final integration risk register for Punjabi.
// This is not A11 integration. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalIntegrationRiskArea =
  | "module_duplication"
  | "missing_exports"
  | "gurmukhi_first"
  | "learner_support"
  | "canada_practical"
  | "stress_test"
  | "deferred_review"
  | "forbidden_claim"
  | "final_qa"
  | "owner_exit";

export type PunjabiFinalIntegrationRiskStatus =
  | "watch_required"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalIntegrationRiskItem = {
  id: string;
  area: PunjabiFinalIntegrationRiskArea;
  status: PunjabiFinalIntegrationRiskStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  risk_vi: string;
  risk_en: string;
  stress_test_vi: string;
  stress_test_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  reviewed_modules: string[];
  risk_tags: string[];
  owner_action_vi?: string;
  owner_action_en?: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_INTEGRATION_RISK_REGISTER_SCOPE = {
  wave: "Wave 23",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  script_note_vi:
    "Risk register này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ là awareness-only, không phải full course.",
  script_note_en:
    "This risk register uses Gurmukhi as the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã hoàn tất.",
  native_review_en: "Native review is deferred; completion is not claimed.",
  excluded_vi:
    "Không review audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
};

export const PUNJABI_FINAL_INTEGRATION_RISK_AREAS: PunjabiFinalIntegrationRiskArea[] = [
  "module_duplication",
  "missing_exports",
  "gurmukhi_first",
  "learner_support",
  "canada_practical",
  "stress_test",
  "deferred_review",
  "forbidden_claim",
  "final_qa",
  "owner_exit",
];

export const PUNJABI_FINAL_INTEGRATION_RISK_REGISTER: PunjabiFinalIntegrationRiskItem[] = [
  {
    id: "risk-module-duplication",
    area: "module_duplication",
    status: "watch_required",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਦੁਹਰਾਏ ਮੋਡੀਊਲ",
    romanization: "duharaye module",
    title_vi: "Rủi ro module trùng",
    title_en: "Duplicate module risk",
    risk_vi:
      "Các final modules có thể trùng ý nếu index, manifest, evidence map và risk register không dùng cùng IDs.",
    risk_en:
      "Final modules can duplicate intent if the index, manifest, evidence map, and risk register do not share the same IDs.",
    stress_test_vi:
      "Owner quét toàn bộ list để chắc rằng không có hai module khác tên nhưng cùng một nhiệm vụ.",
    stress_test_en:
      "Owner scans the full list to ensure two differently named modules do not carry the same job.",
    sample: {
      gurmukhi: "ਇਹ ਲਾਈਨ ਦੋ ਵਾਰੀ ਨਹੀਂ ਹੋਣੀ ਚਾਹੀਦੀ।",
      romanization: "ih line do vari nahi honi chahidi",
      vi: "Dòng này không nên xuất hiện hai lần.",
      en: "This line should not appear twice.",
    },
    reviewed_modules: [
      "finalModuleRegistry",
      "finalContentManifest",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
      "progressionMatrix",
      "masteryCheckpoints",
    ],
    risk_tags: ["duplication", "id-collision", "registry-check"],
    owner_action_vi:
      "Gộp hoặc đổi ID trước khi giao cho integration sau này.",
    owner_action_en:
      "Merge or rename IDs before any later integration handoff.",
    learner_trap_vi:
      "Tên gần giống nhau không có nghĩa là nội dung khác nhau.",
    learner_trap_en:
      "Similar names do not guarantee different content.",
  },
  {
    id: "risk-missing-exports",
    area: "missing_exports",
    status: "watch_required",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਿਰਯਾਤ ਖ਼ਤਰਾ",
    romanization: "niryat khatra",
    title_vi: "Rủi ro missing export",
    title_en: "Missing export risk",
    risk_vi:
      "Wave sau có thể import sai nếu file mới không có root export hoặc default export giống pattern hiện có.",
    risk_en:
      "Later waves can import incorrectly if a new file omits the root export or default export used by the existing pattern.",
    stress_test_vi:
      "Kiểm nhanh rằng file có named export cho scope, areas, data và root.",
    stress_test_en:
      "Quickly verify the file has named exports for scope, areas, data, and root.",
    sample: {
      gurmukhi: "ਐਕਸਪੋਰਟ ਸਾਫ਼ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।",
      romanization: "export saaf hone chahide han",
      vi: "Export cần rõ ràng.",
      en: "Exports need to be clear.",
    },
    reviewed_modules: [
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
      "finalQualityGates",
    ],
    risk_tags: ["exports", "root-export", "default-export"],
    owner_action_vi:
      "Xác nhận mọi root export đều có tên ổn định và nhất quán.",
    owner_action_en:
      "Confirm every root export has a stable, consistent name.",
  },
  {
    id: "risk-gurmukhi-first",
    area: "gurmukhi_first",
    status: "watch_required",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ",
    romanization: "Gurmukhi pehlan",
    title_vi: "Gurmukhi trước",
    title_en: "Gurmukhi first",
    risk_vi:
      "Romanization có thể lấn át chữ chính nếu title_pa hoặc sample.gurmukhi không được ưu tiên.",
    risk_en:
      "Romanization can overwhelm the primary script if title_pa or sample.gurmukhi is not prioritized.",
    stress_test_vi:
      "Quét UI xem Gurmukhi luôn đứng trước romanization trong dữ liệu chính.",
    stress_test_en:
      "Scan the UI to ensure Gurmukhi always appears before romanization in primary data.",
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਲਿਪੀ",
      romanization: "Gurmukhi lipi",
      vi: "chữ Gurmukhi",
      en: "Gurmukhi script",
    },
    reviewed_modules: [
      "index",
      "lessons-a1",
      "dialogues",
      "courseMap",
      "finalNavigationMap",
    ],
    risk_tags: ["gurmukhi-first", "romanization-support", "script-order"],
    owner_action_vi:
      "Giữ Gurmukhi là primary trong mọi sample và title.",
    owner_action_en:
      "Keep Gurmukhi primary in every sample and title.",
    learner_trap_vi:
      "Romanization không biểu đạt đầy đủ bật hơi và retroflex.",
    learner_trap_en:
      "Romanization does not fully express aspiration and retroflex sounds.",
  },
  {
    id: "risk-learner-support",
    area: "learner_support",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਦੋ-ਭਾਸ਼ੀ ਸਹਾਇਤਾ",
    romanization: "do-bhashi sahaita",
    title_vi: "Hỗ trợ Việt-Anh",
    title_en: "Vietnamese-English support",
    risk_vi:
      "Nếu thiếu VI/EN explanations trong risk notes, người học Việt sẽ phải đoán ý của trap và QA.",
    risk_en:
      "If VI/EN explanations are missing from the risk notes, Vietnamese-speaking learners will have to guess the trap and QA meaning.",
    stress_test_vi:
      "Xác nhận cả tiếng Việt và tiếng Anh đều có ở risk, stress test và owner action.",
    stress_test_en:
      "Confirm both Vietnamese and English are present in the risk, stress test, and owner action fields.",
    sample: {
      gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।",
      romanization: "kirpa karke hauli bolo",
      vi: "Xin vui lòng nói chậm.",
      en: "Please speak slowly.",
    },
    reviewed_modules: [
      "dialogues",
      "learningPath",
      "contentIndex",
      "finalQaInventory",
      "finalOwnerReviewPacket",
    ],
    risk_tags: ["vi-support", "en-support", "learner-clarity"],
    owner_action_vi:
      "Bổ sung ghi chú riêng nếu một field nào đó chỉ tồn tại bằng tiếng Anh.",
    owner_action_en:
      "Add a separate note if any field exists only in English.",
    learner_trap_vi:
      "Dịch nghĩa không thay thế note lỗi dành riêng cho người Việt.",
    learner_trap_en:
      "Translation does not replace learner-specific error notes.",
  },
  {
    id: "risk-canada-practical",
    area: "canada_practical",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2"],
    title_pa: "ਕੈਨੇਡਾ ਪ੍ਰੈਕਟਿਕਲ",
    romanization: "Canada practical",
    title_vi: "Rủi ro Canada practical",
    title_en: "Canada-practical risk",
    risk_vi:
      "Settlement, school office, documents, work, clinic và public-service examples cần đủ thật để không trở thành câu quá chung chung.",
    risk_en:
      "Settlement, school office, documents, work, clinic, and public-service examples need to stay concrete instead of becoming vague.",
    stress_test_vi:
      "Đọc nhanh từng ví dụ xem có dùng được tại Canada hay chỉ là câu textbook mơ hồ.",
    stress_test_en:
      "Read each example quickly and check whether it is usable in Canada or merely textbook-level.",
    sample: {
      gurmukhi: "ਮੇਰਾ ਪਤਾ ਬਦਲ ਗਿਆ ਹੈ।",
      romanization: "mera pata badal gia hai",
      vi: "Địa chỉ của tôi đã thay đổi.",
      en: "My address has changed.",
    },
    reviewed_modules: [
      "dialogues",
      "finalCanDoIndex",
      "finalNavigationMap",
      "finalContentManifest",
      "finalSmokeChecklist",
    ],
    risk_tags: ["canada-practical", "survival", "public-service"],
    owner_action_vi:
      "Giữ ví dụ đủ thực tế cho settlement, work, clinic và public service.",
    owner_action_en:
      "Keep examples concrete enough for settlement, work, clinic, and public service.",
    learner_trap_vi:
      "Pata là address; đừng lẫn với phone number hoặc document number.",
    learner_trap_en:
      "Pata means address; do not confuse it with a phone number or document number.",
    canada_practical:
      "Canada settlement desks, school offices, municipal counters, community forms, and clinic intake.",
  },
  {
    id: "risk-stress-test",
    area: "stress_test",
    status: "watch_required",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਸਟ੍ਰੈੱਸ ਟੈਸਟ",
    romanization: "stress test",
    title_vi: "Stress test",
    title_en: "Stress test",
    risk_vi:
      "Final data có thể nhìn ổn ở review đơn lẻ nhưng hỏng khi quét toàn bộ route, export và module link.",
    risk_en:
      "Final data can look fine in isolated review but break when scanning all routes, exports, and module links.",
    stress_test_vi:
      "Mở registry, manifest, evidence map, summary, owner packet và risk register cùng lúc để kiểm consistency.",
    stress_test_en:
      "Open the registry, manifest, evidence map, summary, owner packet, and risk register together to check consistency.",
    sample: {
      gurmukhi: "ਇਕੱਠੇ ਦੇਖਣੇ ਨਾਲ ਹੀ ਗ਼ਲਤੀ ਫੜੀ ਜਾਂਦੀ ਹੈ।",
      romanization: "ikathhe dekhne nal hi galti fadhi jandi hai",
      vi: "Chỉ khi nhìn cùng nhau mới bắt được lỗi.",
      en: "Only by checking together do we catch the error.",
    },
    reviewed_modules: [
      "finalModuleRegistry",
      "finalContentManifest",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
      "finalSmokeChecklist",
    ],
    risk_tags: ["stress-test", "route-consistency", "cross-file"],
    owner_action_vi:
      "Chạy review chéo thay vì đọc từng file riêng lẻ.",
    owner_action_en:
      "Run a cross-file review instead of reading each file in isolation.",
    learner_trap_vi:
      "Một file pass không có nghĩa toàn bộ packet pass.",
    learner_trap_en:
      "One passing file does not mean the whole packet passes.",
  },
  {
    id: "risk-deferred-review",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ",
    romanization: "multavi samikhia",
    title_vi: "Native review hoãn",
    title_en: "Deferred native review",
    risk_vi:
      "Nếu wording không chặt, deferred có thể bị viết nhầm thành reviewed hoặc approved.",
    risk_en:
      "Native review is deferred and not claimed; if the wording is loose, deferred can be mistaken for reviewed or approved.",
    stress_test_vi:
      "Quét toàn bộ note để chắc rằng không có câu nào nói native review đã hoàn tất.",
    stress_test_en:
      "Scan all notes to ensure no sentence says native review has been completed.",
    sample: {
      gurmukhi: "review ਅਜੇ ਬਾਕੀ ਹੈ।",
      romanization: "review aje baki hai",
      vi: "Review vẫn còn đang chờ.",
      en: "Review is still pending.",
    },
    reviewed_modules: [
      "preMrAuditChecklist",
      "preIntegrationHandoffMap",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
    ],
    risk_tags: ["native-review-deferred", "boundary", "not-claimed"],
    owner_action_vi:
      "Giữ wording ‘deferred’ thay vì ‘done’ trong mọi summary và route.",
    owner_action_en:
      "Keep the wording as ‘deferred’ rather than ‘done’ in every summary and route; completion is not claimed.",
    learner_trap_vi:
      "Deferred không bao giờ nên được trình bày như hoàn tất.",
    learner_trap_en:
      "Deferred should never be presented as complete.",
  },
  {
    id: "risk-forbidden-claims",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾ claim ਕਰੋ",
    romanization: "na claim karo",
    title_vi: "Không được claim",
    title_en: "Must not claim",
    risk_vi:
      "Wave 23 không có audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy hoặc A11 integration.",
    risk_en:
      "Wave 23 adds no audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy, and is not A11 integration.",
    stress_test_vi:
      "Đọc mọi chuỗi ‘must not claim’ để chắc không có tính năng ngoài scope bị gán nhầm.",
    stress_test_en:
      "Read every ‘must not claim’ string to ensure no out-of-scope feature is attributed by mistake.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ text ਹੈ।",
      romanization: "ih siraf text hai",
      vi: "Đây chỉ là text.",
      en: "This is text only.",
    },
    reviewed_modules: [
      "finalQualityGates",
      "finalSmokeChecklist",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
      "finalOwnerReviewPacket",
    ],
    risk_tags: ["must-not-claim", "text-only", "not-a11"],
    owner_action_vi:
      "Xóa mọi wording khiến người đọc tưởng có audio hoặc scoring.",
    owner_action_en:
      "Remove any wording that could imply audio or scoring exists.",
    learner_trap_vi:
      "Text-only content không tự sinh audio hay scoring.",
    learner_trap_en:
      "Text only content does not create audio or scoring.",
    must_not_claim_vi:
      "Không claim audio, scoring, Azure, Supabase, deploy, push hoặc A11 integration.",
    must_not_claim_en:
      "Do not claim audio, scoring, Azure, Supabase, deploy, push, or A11 integration; no A11 integration should be implied.",
  },
  {
    id: "risk-final-qa",
    area: "final_qa",
    status: "watch_required",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਅੰਤਿਮ QA",
    romanization: "antim QA",
    title_vi: "Final QA",
    title_en: "Final QA",
    risk_vi:
      "Nếu final QA chỉ nhìn tên file mà không nhìn routes, coverage và boundaries, vài rủi ro sẽ lọt qua.",
    risk_en:
      "If final QA only checks filenames and not routes, coverage, and boundaries, some risks will slip through.",
    stress_test_vi:
      "Kiểm coverage, traps, Canada-practical, native-review boundaries và forbidden claims trong một lượt.",
    stress_test_en:
      "Check coverage, traps, Canada-practical items, native-review boundaries, and forbidden claims in one pass.",
    sample: {
      gurmukhi: "ਅੰਤਿਮ ਜਾਂਚ ਪੂਰੀ ਕਰੋ।",
      romanization: "antim janch puri karo",
      vi: "Hoàn tất kiểm tra cuối.",
      en: "Complete the final check.",
    },
    reviewed_modules: [
      "finalQaInventory",
      "finalQualityGates",
      "finalSmokeChecklist",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
    ],
    risk_tags: ["final-QA", "cross-check", "boundary-review"],
    owner_action_vi:
      "Dùng QA như một lần quét chéo, không phải một lời khẳng định cuối cùng về native review.",
    owner_action_en:
      "Use QA as a cross-check, not as a final claim of native review.",
    learner_trap_vi:
      "QA pass không thay thế việc kiểm cụ thể cho người học Việt.",
    learner_trap_en:
      "A QA pass does not replace learner-specific checks for Vietnamese speakers.",
  },
  {
    id: "risk-owner-exit",
    area: "owner_exit",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮਾਲਕ ਨਿਕਾਸ",
    romanization: "malak nikas",
    title_vi: "Owner exit",
    title_en: "Owner exit",
    risk_vi:
      "Nếu owner exit không rõ, Wave 24 hoặc later A11 có thể bị hiểu sai thành integration-ready ngay lập tức.",
    risk_en:
      "If the owner exit is unclear, Wave 24 or later A11 can be misread as immediately integration-ready.",
    stress_test_vi:
      "Đọc exit ticket để xác nhận bước sau là một request riêng, không phải bật integration ngay.",
    stress_test_en:
      "Read the exit ticket to confirm the next step is a separate request, not an immediate integration toggle.",
    sample: {
      gurmukhi: "ਅਗਲਾ ਕਦਮ ਵੱਖਰਾ ਹੈ।",
      romanization: "agla kadam vakhra hai",
      vi: "Bước tiếp theo là riêng biệt.",
      en: "The next step is separate.",
    },
    reviewed_modules: [
      "finalOwnerReviewPacket",
      "finalPreIntegrationSummary",
      "finalIntegrationEvidenceMap",
      "finalSmokeChecklist",
    ],
    risk_tags: ["owner-exit", "next-step", "not-a11"],
    owner_action_vi:
      "Gắn bước tiếp theo vào một request riêng thay vì gộp vào Wave 23.",
    owner_action_en:
      "Attach the next step to a separate request instead of folding it into Wave 23.",
    learner_trap_vi:
      "Exit ticket là checklist cho owner, không phải lệnh triển khai.",
    learner_trap_en:
      "The exit ticket is an owner checklist, not a deployment command.",
  },
];

export const PUNJABI_FINAL_INTEGRATION_RISK_ROUTES = [
  {
    id: "risk-route-registry-check",
    vi: "Quét duplication và missing exports trên registry, manifest và evidence pack.",
    en: "Scan duplication and missing exports across the registry, manifest, and evidence pack.",
    item_ids: ["risk-module-duplication", "risk-missing-exports"],
  },
  {
    id: "risk-route-script-support",
    vi: "Quét Gurmukhi-first, Việt-Anh support và Canada-practical gaps.",
    en: "Scan Gurmukhi-first, Vietnamese-English support, and Canada-practical gaps.",
    item_ids: ["risk-gurmukhi-first", "risk-learner-support", "risk-canada-practical"],
  },
  {
    id: "risk-route-boundary-check",
    vi: "Quét deferred review, forbidden claims, final QA và owner exit.",
    en: "Scan deferred review, forbidden claims, final QA, and owner exit.",
    item_ids: ["risk-deferred-review", "risk-forbidden-claims", "risk-final-qa", "risk-owner-exit"],
  },
];

export const PUNJABI_FINAL_INTEGRATION_RISK_REGISTER_ROOT = {
  scope: PUNJABI_FINAL_INTEGRATION_RISK_REGISTER_SCOPE,
  areas: PUNJABI_FINAL_INTEGRATION_RISK_AREAS,
  register: PUNJABI_FINAL_INTEGRATION_RISK_REGISTER,
  routes: PUNJABI_FINAL_INTEGRATION_RISK_ROUTES,
};

export default PUNJABI_FINAL_INTEGRATION_RISK_REGISTER_ROOT;
