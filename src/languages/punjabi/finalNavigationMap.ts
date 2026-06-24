// src/languages/punjabi/finalNavigationMap.ts
//
// Wave 16 final navigation map for Punjabi learners and later integration.
// This is not A11 integration. Gurmukhi is primary; native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiNavigationNodeType =
  | "entry"
  | "script_support"
  | "learner_route"
  | "skill_module"
  | "canada_route"
  | "review"
  | "remediation"
  | "boundary";

export type PunjabiNavigationAudience = "vi_learner" | "en_learner" | "later_integration";

export type PunjabiFinalNavigationNode = {
  id: string;
  type: PunjabiNavigationNodeType;
  levels: PunjabiCefrLevel[];
  audiences: PunjabiNavigationAudience[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  navigation_vi: string;
  navigation_en: string;
  readiness_vi: string;
  readiness_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  modules: string[];
  next_node_ids: string[];
  review_signal_vi?: string;
  review_signal_en?: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
};

export const PUNJABI_FINAL_NAVIGATION_SCOPE = {
  wave: "Wave 16",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  script_note_vi:
    "Final navigation map này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết, không phải khóa đầy đủ.",
  script_note_en:
    "This final navigation map uses Gurmukhi as the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã có kiểm duyệt bản ngữ.",
  native_review_en: "Native review is deferred; completed native review is not claimed.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
};

export const PUNJABI_FINAL_NAVIGATION_NODE_TYPES: PunjabiNavigationNodeType[] = [
  "entry",
  "script_support",
  "learner_route",
  "skill_module",
  "canada_route",
  "review",
  "remediation",
  "boundary",
];

export const PUNJABI_FINAL_NAVIGATION_AUDIENCES: PunjabiNavigationAudience[] = [
  "vi_learner",
  "en_learner",
  "later_integration",
];

export const PUNJABI_FINAL_NAVIGATION_MAP: PunjabiFinalNavigationNode[] = [
  {
    id: "nav-entry-foundation",
    type: "entry",
    levels: ["A1"],
    audiences: ["vi_learner", "en_learner", "later_integration"],
    title_pa: "ਸ਼ੁਰੂਆਤ",
    romanization: "shuruaat",
    title_vi: "Điểm bắt đầu",
    title_en: "Starting point",
    navigation_vi: "Bắt đầu với identity Punjabi, lời chào, normalization và bài A1 đầu tiên.",
    navigation_en: "Start with Punjabi identity, greetings, normalization, and the first A1 lesson.",
    readiness_vi: "Người học nhận ra ਪੰਜਾਬੀ và câu chào cơ bản trước khi đi tiếp.",
    readiness_en: "Learners recognize ਪੰਜਾਬੀ and a basic greeting before moving on.",
    sample: { gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ।", romanization: "sat sri akal ji", vi: "Xin chào ạ.", en: "Hello, respectfully." },
    modules: ["index", "normalize", "lessons", "lessons-a1"],
    next_node_ids: ["nav-gurmukhi-script", "nav-vi-en-support"],
    review_signal_vi: "Entry node có Gurmukhi và romanization hỗ trợ.",
    review_signal_en: "Entry node has Gurmukhi and supporting romanization.",
    learner_trap_vi: "Đừng học câu chào chỉ bằng chữ Latin.",
    learner_trap_en: "Do not learn the greeting only in Latin letters.",
  },
  {
    id: "nav-gurmukhi-script",
    type: "script_support",
    levels: ["A1", "A2"],
    audiences: ["vi_learner", "en_learner", "later_integration"],
    title_pa: "ਗੁਰਮੁਖੀ ਰਾਹ",
    romanization: "Gurmukhi rah",
    title_vi: "Đường Gurmukhi",
    title_en: "Gurmukhi path",
    navigation_vi: "Route script support trước dialogue và prompt nâng cao để giữ Gurmukhi-first.",
    navigation_en: "Route script support before dialogues and advanced prompts to stay Gurmukhi-first.",
    readiness_vi: "Có script note, sample Gurmukhi và warning romanization chỉ hỗ trợ.",
    readiness_en: "Script notes, Gurmukhi samples, and romanization-as-support warnings are present.",
    sample: { gurmukhi: "ਗੁਰਮੁਖੀ ਲਿਪੀ", romanization: "Gurmukhi lipi", vi: "chữ Gurmukhi", en: "Gurmukhi script" },
    modules: ["courseMap", "learningPath", "finalCanDoIndex", "preIntegrationHandoffMap"],
    next_node_ids: ["nav-core-learner-route", "nav-dialogue-route"],
    review_signal_vi: "Shahmukhi awareness-only xuất hiện ở scope, không ở sample.",
    review_signal_en: "Shahmukhi awareness-only appears in scope, not in samples.",
    learner_trap_vi: "Romanization không thể hiện đầy đủ âm bật hơi và retroflex.",
    learner_trap_en: "Romanization cannot fully represent aspiration and retroflex sounds.",
  },
  {
    id: "nav-vi-en-support",
    type: "learner_route",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    audiences: ["vi_learner", "en_learner", "later_integration"],
    title_pa: "ਦੋ-ਭਾਸ਼ੀ ਸਹਾਇਤਾ",
    romanization: "do-bhashi sahaita",
    title_vi: "Hỗ trợ Việt-Anh",
    title_en: "Vietnamese-English support",
    navigation_vi: "Tất cả route chính giữ giải thích tiếng Việt và tiếng Anh cho mục tiêu, readiness, trap và sample.",
    navigation_en: "All major routes keep Vietnamese and English explanations for goals, readiness, traps, and samples.",
    readiness_vi: "Reviewer thấy trường VI/EN trong module học, checkpoint và QA.",
    readiness_en: "Reviewers see VI/EN fields in learning modules, checkpoints, and QA.",
    sample: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਫਿਰ ਦੱਸੋ।", romanization: "kirpa karke fir dasso", vi: "Xin vui lòng nói lại.", en: "Please say that again." },
    modules: ["dialogues", "learningPath", "contentIndex", "finalQaInventory", "preMrAuditChecklist"],
    next_node_ids: ["nav-core-learner-route", "nav-canada-survival"],
    review_signal_vi: "Không dùng tiếng Anh thay thế giải thích tiếng Việt.",
    review_signal_en: "English does not replace Vietnamese explanations.",
    learner_trap_vi: "Người học Việt cần giải thích lỗi riêng, không chỉ bản dịch.",
    learner_trap_en: "Vietnamese-speaking learners need specific trap notes, not only translations.",
  },
  {
    id: "nav-core-learner-route",
    type: "learner_route",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    audiences: ["vi_learner", "en_learner", "later_integration"],
    title_pa: "A1-C2 ਰਾਹ",
    romanization: "A1-C2 rah",
    title_vi: "Lộ trình A1-C2",
    title_en: "A1-C2 route",
    navigation_vi: "Kết nối course map, learning path, progression và can-do index cho learner journey.",
    navigation_en: "Connects course map, learning path, progression, and can-do index for the learner journey.",
    readiness_vi: "A1-C2 có route học, checkpoint và bằng chứng can-do.",
    readiness_en: "A1-C2 have learning routes, checkpoints, and can-do evidence.",
    sample: { gurmukhi: "ਸਾਰ ਇਹ ਹੈ ਕਿ ਫੈਸਲਾ ਅਜੇ ਬਾਕੀ ਹੈ।", romanization: "sar ih hai ki faisla aje baki hai", vi: "Tóm lại là quyết định vẫn còn đang chờ.", en: "The summary is that the decision is still pending." },
    modules: ["courseMap", "learningPath", "progressionMatrix", "finalCanDoIndex"],
    next_node_ids: ["nav-skill-progression", "nav-review-checkpoints"],
    review_signal_vi: "Navigation không claim chứng chỉ chính thức.",
    review_signal_en: "Navigation does not claim official certification.",
    learner_trap_vi: "A1-C2 là tổ chức nội dung học, không phải credential.",
    learner_trap_en: "A1-C2 is learning organization, not a credential.",
  },
  {
    id: "nav-dialogue-route",
    type: "skill_module",
    levels: ["A1", "A2", "B1", "B2", "C1"],
    audiences: ["vi_learner", "en_learner", "later_integration"],
    title_pa: "ਗੱਲਬਾਤ ਰਾਹ",
    romanization: "gallbat rah",
    title_vi: "Đường hội thoại",
    title_en: "Dialogue route",
    navigation_vi: "Route dialogue sau script support để luyện tình huống survival, work, health, school và public service.",
    navigation_en: "Route dialogues after script support for survival, work, health, school, and public-service situations.",
    readiness_vi: "Dialogue có Gurmukhi primary, romanization, VI/EN và learner traps.",
    readiness_en: "Dialogues include Gurmukhi primary text, romanization, VI/EN, and learner traps.",
    sample: { gurmukhi: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲੋੜੀਂਦੇ ਹਨ?", romanization: "kihre dastavez lorinde han?", vi: "Cần những giấy tờ nào?", en: "Which documents are required?" },
    modules: ["dialogues", "contentIndex", "finalModuleRegistry"],
    next_node_ids: ["nav-canada-survival", "nav-canada-public-service"],
    review_signal_vi: "Dialogue là text-only; không đòi audio.",
    review_signal_en: "Dialogues are text-only; they do not require audio.",
    learner_trap_vi: "Câu đúng nghĩa vẫn có thể thiếu lịch sự nếu bỏ ਜੀ hoặc ਕਿਰਪਾ ਕਰਕੇ.",
    learner_trap_en: "A meaningful sentence can still lack politeness if ji or kirpa karke is missing.",
    canada_practical: "Community desk, school office, workplace, clinic, and public service conversations in Canada.",
  },
  {
    id: "nav-skill-progression",
    type: "skill_module",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    audiences: ["vi_learner", "en_learner", "later_integration"],
    title_pa: "ਕੌਸ਼ਲ ਤਰੱਕੀ",
    romanization: "kaushal tarakki",
    title_vi: "Tiến độ kỹ năng",
    title_en: "Skill progression",
    navigation_vi: "Kết nối script, vocabulary, grammar, reading, writing, text prompts và remediation.",
    navigation_en: "Connects script, vocabulary, grammar, reading, writing, text prompts, and remediation.",
    readiness_vi: "Progression matrix, mastery checkpoints và dependency graph định nghĩa điều kiện đi tiếp.",
    readiness_en: "Progression matrix, mastery checkpoints, and dependency graph define moving-on conditions.",
    sample: { gurmukhi: "ਕੀ ਕੋਈ ਹੋਰ ਵਿਕਲਪ ਹੈ?", romanization: "ki koi hor vikalp hai?", vi: "Có lựa chọn nào khác không?", en: "Is there another option?" },
    modules: ["progressionMatrix", "masteryCheckpoints", "skillDependencyGraph", "finalCanDoIndex"],
    next_node_ids: ["nav-remediation-route", "nav-review-checkpoints"],
    review_signal_vi: "Text-speaking prompt không có recording hoặc pronunciation scoring.",
    review_signal_en: "Text speaking prompts have no recording or pronunciation scoring.",
    learner_trap_vi: "Không mở prompt nâng cao nếu prerequisite còn thiếu.",
    learner_trap_en: "Do not unlock advanced prompts when prerequisites are missing.",
  },
  {
    id: "nav-canada-survival",
    type: "canada_route",
    levels: ["A1", "A2", "B1"],
    audiences: ["vi_learner", "en_learner", "later_integration"],
    title_pa: "ਸਰਵਾਈਵਲ ਰਾਹ",
    romanization: "survival rah",
    title_vi: "Đường survival",
    title_en: "Survival route",
    navigation_vi: "Route lời chào, địa chỉ, số điện thoại, xin nhắc lại và câu dịch vụ đơn giản.",
    navigation_en: "Routes greetings, address, phone number, please-repeat, and simple service sentences.",
    readiness_vi: "Survival content có câu ngắn, lịch sự và Canada-practical examples.",
    readiness_en: "Survival content has short, polite sentences and Canada-practical examples.",
    sample: { gurmukhi: "ਇਹ ਮੇਰਾ ਫੋਨ ਨੰਬਰ ਹੈ।", romanization: "ih mera phone number hai", vi: "Đây là số điện thoại của tôi.", en: "This is my phone number." },
    modules: ["dialogues", "learningPath", "progressionMatrix", "finalCanDoIndex"],
    next_node_ids: ["nav-canada-work-health", "nav-canada-public-service"],
    review_signal_vi: "Survival route không thay thế dịch vụ chuyên môn.",
    review_signal_en: "Survival route does not replace professional services.",
    learner_trap_vi: "Đọc số điện thoại chậm theo nhóm, không đọc quá nhanh.",
    learner_trap_en: "Read phone numbers slowly in groups, not too fast.",
    canada_practical: "Survival support at settlement forms, community desks, school contact sheets, and clinic intake in Canada.",
  },
  {
    id: "nav-canada-work-health",
    type: "canada_route",
    levels: ["B1", "B2", "C1"],
    audiences: ["vi_learner", "en_learner", "later_integration"],
    title_pa: "ਕੰਮ ਅਤੇ ਸਿਹਤ",
    romanization: "kamm ate sehat",
    title_vi: "Công việc và y tế",
    title_en: "Work and health",
    navigation_vi: "Route ca làm, register nơi làm việc, mô tả triệu chứng và giới hạn không tư vấn y tế.",
    navigation_en: "Routes shift questions, workplace register, symptom descriptions, and no-medical-advice boundaries.",
    readiness_vi: "Có mẫu shift, symptom duration, formal wording và warning scope.",
    readiness_en: "Shift, symptom-duration, formal wording, and scope warnings are present.",
    sample: { gurmukhi: "ਮੈਨੂੰ ਦੋ ਦਿਨ ਤੋਂ ਬੁਖਾਰ ਹੈ।", romanization: "mainu do din ton bukhar hai", vi: "Tôi bị sốt hai ngày rồi.", en: "I have had a fever for two days." },
    modules: ["dialogues", "masteryCheckpoints", "finalCanDoIndex", "finalQaInventory"],
    next_node_ids: ["nav-remediation-route", "nav-review-checkpoints"],
    review_signal_vi: "Healthcare route chỉ học ngôn ngữ, không chẩn đoán.",
    review_signal_en: "Healthcare route is language learning only, not diagnosis.",
    learner_trap_vi: "Một câu Punjabi đúng không phải hướng dẫn điều trị.",
    learner_trap_en: "A correct Punjabi sentence is not treatment guidance.",
    canada_practical: "Work schedules, workplace messages, clinic intake, pharmacy counter, and telehealth notes in Canada.",
  },
  {
    id: "nav-canada-public-service",
    type: "canada_route",
    levels: ["A2", "B1", "B2", "C1", "C2"],
    audiences: ["vi_learner", "en_learner", "later_integration"],
    title_pa: "ਜਨਤਕ ਸੇਵਾ",
    romanization: "jantak seva",
    title_vi: "Dịch vụ công",
    title_en: "Public service",
    navigation_vi: "Route giấy tờ, quyết định, lý do, email formal và follow-up lịch sự.",
    navigation_en: "Routes documents, decisions, reasons, formal emails, and polite follow-up.",
    readiness_vi: "Public-service route có câu hỏi giấy tờ và đọc quyết định nâng cao.",
    readiness_en: "Public-service route has document questions and advanced decision reading.",
    sample: { gurmukhi: "ਕੀ ਤੁਸੀਂ ਫੈਸਲੇ ਦਾ ਕਾਰਨ ਸਮਝਾ ਸਕਦੇ ਹੋ?", romanization: "ki tusin faisle da karan samjha sakde ho?", vi: "Quý vị có thể giải thích lý do của quyết định không?", en: "Can you explain the reason for the decision?" },
    modules: ["dialogues", "learningPath", "finalCanDoIndex", "preIntegrationHandoffMap"],
    next_node_ids: ["nav-review-checkpoints", "nav-boundary-claims"],
    review_signal_vi: "Public-service language không phải tư vấn pháp lý.",
    review_signal_en: "Public-service language is not legal advice.",
    learner_trap_vi: "ਕਾਰਨ là lý do; đừng tự suy đoán kết quả khi văn bản chưa nói rõ.",
    learner_trap_en: "Karan means reason; do not infer outcomes when the text does not say them.",
    canada_practical: "Municipal counters, school offices, settlement agencies, and public service desks in Canada.",
  },
  {
    id: "nav-remediation-route",
    type: "remediation",
    levels: ["B1", "B2", "C1", "C2"],
    audiences: ["vi_learner", "en_learner", "later_integration"],
    title_pa: "ਮੁਰੰਮਤ ਰਾਹ",
    romanization: "murammat rah",
    title_vi: "Đường sửa lỗi",
    title_en: "Remediation route",
    navigation_vi: "Route lỗi thường gặp về politeness, grammar, reading và writing trước khi mở bước cao hơn.",
    navigation_en: "Routes common errors in politeness, grammar, reading, and writing before unlocking higher steps.",
    readiness_vi: "Remediation có trap, checkpoint và next-step rõ ràng.",
    readiness_en: "Remediation has traps, checkpoints, and clear next steps.",
    sample: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਦੁਬਾਰਾ ਲਿਖੋ।", romanization: "kirpa karke ih dubara likho", vi: "Xin vui lòng viết lại điều này.", en: "Please write this again." },
    modules: ["skillDependencyGraph", "masteryCheckpoints", "finalCanDoIndex", "finalQaInventory"],
    next_node_ids: ["nav-review-checkpoints", "nav-boundary-claims"],
    review_signal_vi: "Remediation là readiness nội dung, không claim native review hoàn tất.",
    review_signal_en: "Remediation is content readiness; it does not claim completed native review.",
    learner_trap_vi: "Thêm một marker lịch sự chưa đủ nếu register cả câu vẫn thô.",
    learner_trap_en: "Adding one politeness marker is not enough if the whole sentence remains blunt.",
  },
  {
    id: "nav-review-checkpoints",
    type: "review",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    audiences: ["later_integration"],
    title_pa: "ਰੀਵਿਊ ਚੈਕਪੋਇੰਟ",
    romanization: "review checkpoint",
    title_vi: "Checkpoint review",
    title_en: "Review checkpoints",
    navigation_vi: "Route qua content index, readiness checklist, coverage map, registry, QA, audit và handoff trước integration sau này.",
    navigation_en: "Routes through content index, readiness checklist, coverage map, registry, QA, audit, and handoff before later integration.",
    readiness_vi: "Review artifacts có test riêng và boundary no A11.",
    readiness_en: "Review artifacts have their own tests and no-A11 boundaries.",
    sample: { gurmukhi: "ਤਿਆਰੀ", romanization: "tiari", vi: "sự sẵn sàng", en: "readiness" },
    modules: ["contentIndex", "integrationReadinessChecklist", "preIntegrationCoverageMap", "finalModuleRegistry", "finalQaInventory", "preMrAuditChecklist", "preIntegrationHandoffMap"],
    next_node_ids: ["nav-boundary-claims"],
    review_signal_vi: "Review map không push, deploy hoặc chạy A11 integration.",
    review_signal_en: "Review map does not push, deploy, or run A11 integration.",
    learner_trap_vi: "Review readiness không đồng nghĩa integrated UI.",
    learner_trap_en: "Review readiness does not mean an integrated UI.",
  },
  {
    id: "nav-boundary-claims",
    type: "boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    audiences: ["vi_learner", "en_learner", "later_integration"],
    title_pa: "ਸੀਮਾ ਨਿਯਮ",
    romanization: "sima niyam",
    title_vi: "Quy tắc ranh giới",
    title_en: "Boundary rules",
    navigation_vi: "Giữ native review deferred, Shahmukhi awareness-only, no audio/scoring/Azure và no A11 integration.",
    navigation_en: "Keeps native review deferred, Shahmukhi awareness-only, no audio/scoring/Azure, and no A11 integration.",
    readiness_vi: "Scope và boundary nodes tránh forbidden claims.",
    readiness_en: "Scope and boundary nodes avoid forbidden claims.",
    sample: { gurmukhi: "ਨਹੀਂ", romanization: "nahin", vi: "không", en: "no" },
    modules: ["finalModuleRegistry", "finalQaInventory", "preMrAuditChecklist", "preIntegrationHandoffMap", "finalNavigationMap"],
    next_node_ids: [],
    review_signal_vi: "Không claim native review, audio, scoring, push, deploy hoặc A11.",
    review_signal_en: "Does not claim native review, audio, scoring, push, deploy, or A11.",
    learner_trap_vi: "Final navigation map là dữ liệu điều hướng, không phải release.",
    learner_trap_en: "The final navigation map is navigation data, not a release.",
  },
];

export const PUNJABI_FINAL_NAVIGATION_ROUTES = [
  {
    id: "learner-start-route",
    vi: "Learner start: entry -> Gurmukhi -> VI/EN support -> A1-C2 route -> skill progression.",
    en: "Learner start: entry -> Gurmukhi -> VI/EN support -> A1-C2 route -> skill progression.",
    node_ids: ["nav-entry-foundation", "nav-gurmukhi-script", "nav-vi-en-support", "nav-core-learner-route", "nav-skill-progression"],
  },
  {
    id: "canada-practical-route",
    vi: "Canada route: dialogue -> survival -> work/health -> public service -> remediation.",
    en: "Canada route: dialogue -> survival -> work/health -> public service -> remediation.",
    node_ids: ["nav-dialogue-route", "nav-canada-survival", "nav-canada-work-health", "nav-canada-public-service", "nav-remediation-route"],
  },
  {
    id: "later-integration-review-route",
    vi: "Later integration review: review checkpoints -> handoff boundaries -> no forbidden claims.",
    en: "Later integration review: review checkpoints -> handoff boundaries -> no forbidden claims.",
    node_ids: ["nav-review-checkpoints", "nav-boundary-claims"],
  },
];

export const PUNJABI_FINAL_NAVIGATION_ROOT = {
  scope: PUNJABI_FINAL_NAVIGATION_SCOPE,
  node_types: PUNJABI_FINAL_NAVIGATION_NODE_TYPES,
  audiences: PUNJABI_FINAL_NAVIGATION_AUDIENCES,
  nodes: PUNJABI_FINAL_NAVIGATION_MAP,
  routes: PUNJABI_FINAL_NAVIGATION_ROUTES,
} as const;

export default PUNJABI_FINAL_NAVIGATION_ROOT;
