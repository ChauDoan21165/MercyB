// src/languages/punjabi/preIntegrationHandoffMap.ts
//
// Wave 15 pre-integration handoff map for later A11 work.
// This is not A11 integration. Gurmukhi is primary; native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiHandoffLane =
  | "foundation_lane"
  | "dialogue_lane"
  | "course_navigation_lane"
  | "progression_lane"
  | "quality_lane"
  | "handoff_boundary_lane";

export type PunjabiHandoffGroup =
  | "script_foundation"
  | "learner_journey"
  | "skill_progression"
  | "canada_practical"
  | "pre_integration_review"
  | "forbidden_claims";

export type PunjabiHandoffStatus = "ready_for_later_integration" | "manual_review_needed" | "deferred_boundary";

export type PunjabiPreIntegrationHandoffItem = {
  id: string;
  group: PunjabiHandoffGroup;
  lane: PunjabiHandoffLane;
  status: PunjabiHandoffStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  handoff_vi: string;
  handoff_en: string;
  readiness_signal_vi: string;
  readiness_signal_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  modules: string[];
  owner_lane_vi: string;
  owner_lane_en: string;
  next_step_vi: string;
  next_step_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
};

export const PUNJABI_PRE_INTEGRATION_HANDOFF_SCOPE = {
  wave: "Wave 15",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  script_note_vi:
    "Pre-integration handoff map này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết, không phải khóa đầy đủ.",
  script_note_en:
    "This pre-integration handoff map uses Gurmukhi as the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã có kiểm duyệt bản ngữ.",
  native_review_en: "Native review is deferred; completed native review is not claimed.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
};

export const PUNJABI_PRE_INTEGRATION_HANDOFF_LANES: PunjabiHandoffLane[] = [
  "foundation_lane",
  "dialogue_lane",
  "course_navigation_lane",
  "progression_lane",
  "quality_lane",
  "handoff_boundary_lane",
];

export const PUNJABI_PRE_INTEGRATION_HANDOFF_GROUPS: PunjabiHandoffGroup[] = [
  "script_foundation",
  "learner_journey",
  "skill_progression",
  "canada_practical",
  "pre_integration_review",
  "forbidden_claims",
];

export const PUNJABI_PRE_INTEGRATION_HANDOFF_MAP: PunjabiPreIntegrationHandoffItem[] = [
  {
    id: "handoff-foundation-script",
    group: "script_foundation",
    lane: "foundation_lane",
    status: "ready_for_later_integration",
    levels: ["A1"],
    title_pa: "ਗੁਰਮੁਖੀ ਬੁਨਿਆਦ",
    romanization: "Gurmukhi bunyad",
    title_vi: "Nền tảng Gurmukhi",
    title_en: "Gurmukhi foundation",
    handoff_vi: "Bàn giao metadata Punjabi, normalization, bài A1 đầu và hướng Gurmukhi-first cho tích hợp sau này.",
    handoff_en: "Hands off Punjabi metadata, normalization, first A1 lesson, and Gurmukhi-first direction for later integration.",
    readiness_signal_vi: "Có code pa, tên ਪੰਜਾਬੀ, primary_script Gurmukhi và sample đọc cơ bản.",
    readiness_signal_en: "Code pa, name ਪੰਜਾਬੀ, primary_script Gurmukhi, and basic reading samples are present.",
    sample: { gurmukhi: "ਪੰਜਾਬੀ", romanization: "Punjabi", vi: "tiếng Punjabi", en: "Punjabi" },
    modules: ["index", "normalize", "lessons", "lessons-a1"],
    owner_lane_vi: "A1 giữ nền tảng script và identity.",
    owner_lane_en: "A1 owns script foundation and identity.",
    next_step_vi: "Later integration chỉ nên route vào foundation sau khi kiểm Gurmukhi-first.",
    next_step_en: "Later integration should route into foundation only after checking Gurmukhi-first behavior.",
    learner_trap_vi: "Romanization hỗ trợ đọc, không thay thế Gurmukhi.",
    learner_trap_en: "Romanization supports reading; it does not replace Gurmukhi.",
  },
  {
    id: "handoff-dialogue-canada",
    group: "canada_practical",
    lane: "dialogue_lane",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1"],
    title_pa: "ਕੈਨੇਡਾ ਗੱਲਬਾਤ",
    romanization: "Canada gallbat",
    title_vi: "Hội thoại thực tế Canada",
    title_en: "Canada-practical dialogues",
    handoff_vi: "Bàn giao dialogue roleplay cho survival, work, healthcare, school và public service.",
    handoff_en: "Hands off dialogue roleplays for survival, work, healthcare, school, and public service.",
    readiness_signal_vi: "Có câu ngắn, mục tiêu roleplay, VI/EN support và lỗi thường gặp.",
    readiness_signal_en: "Short sentences, roleplay goals, VI/EN support, and common mistakes are present.",
    sample: { gurmukhi: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲੋੜੀਂਦੇ ਹਨ?", romanization: "kihre dastavez lorinde han?", vi: "Cần những giấy tờ nào?", en: "Which documents are required?" },
    modules: ["dialogues", "contentIndex", "finalCanDoIndex"],
    owner_lane_vi: "Dialogue lane giữ dữ liệu tình huống text-only.",
    owner_lane_en: "Dialogue lane owns text-only situational data.",
    next_step_vi: "Later integration cần route theo domain, không gộp mọi dialogue vào một danh sách phẳng.",
    next_step_en: "Later integration should route by domain, not flatten every dialogue into one list.",
    learner_trap_vi: "Canada-practical là ngữ cảnh học ngôn ngữ, không phải tư vấn pháp lý hoặc y tế.",
    learner_trap_en: "Canada-practical is language-learning context, not legal or medical advice.",
    canada_practical: "Settlement agencies, clinics, school offices, workplaces, and public service counters in Canada.",
  },
  {
    id: "handoff-course-navigation",
    group: "learner_journey",
    lane: "course_navigation_lane",
    status: "ready_for_later_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਸਿੱਖਣ ਰਾਹ",
    romanization: "sikhan rah",
    title_vi: "Lộ trình học",
    title_en: "Learner journey",
    handoff_vi: "Bàn giao course map và learning path để chọn đường học cho người học Việt và Anh.",
    handoff_en: "Hands off the course map and learning path for Vietnamese-speaking and English-speaking learners.",
    readiness_signal_vi: "Có route cho new learner, Canada-practical và advanced readiness.",
    readiness_signal_en: "Routes exist for new learner, Canada-practical, and advanced readiness.",
    sample: { gurmukhi: "ਗੁਰਮੁਖੀ ਲਿਪੀ", romanization: "Gurmukhi lipi", vi: "chữ Gurmukhi", en: "Gurmukhi script" },
    modules: ["courseMap", "learningPath", "finalModuleRegistry"],
    owner_lane_vi: "Course navigation lane giữ thứ tự học và route gợi ý.",
    owner_lane_en: "Course navigation lane owns learning order and suggested routes.",
    next_step_vi: "Later integration cần giữ Gurmukhi path trước text-speaking prompts.",
    next_step_en: "Later integration should keep the Gurmukhi path before text-speaking prompts.",
    learner_trap_vi: "Đừng cho người học nhảy sang prompt nâng cao nếu chưa có nền script.",
    learner_trap_en: "Do not send learners to advanced prompts before script foundation exists.",
  },
  {
    id: "handoff-progression-mastery",
    group: "skill_progression",
    lane: "progression_lane",
    status: "ready_for_later_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਤਰੱਕੀ ਅਤੇ ਮਾਹਰਤਾ",
    romanization: "tarakki ate maharta",
    title_vi: "Tiến độ và thành thạo",
    title_en: "Progression and mastery",
    handoff_vi: "Bàn giao progression matrix, mastery checkpoints và dependency graph để kiểm readiness theo kỹ năng.",
    handoff_en: "Hands off progression matrix, mastery checkpoints, and dependency graph for skill readiness checks.",
    readiness_signal_vi: "Có checkpoint cho script, vocab, grammar, reading, writing, text-only prompts và remediation.",
    readiness_signal_en: "Checkpoints exist for script, vocabulary, grammar, reading, writing, text-only prompts, and remediation.",
    sample: { gurmukhi: "ਕੀ ਕੋਈ ਹੋਰ ਵਿਕਲਪ ਹੈ?", romanization: "ki koi hor vikalp hai?", vi: "Có lựa chọn nào khác không?", en: "Is there another option?" },
    modules: ["progressionMatrix", "masteryCheckpoints", "skillDependencyGraph", "finalCanDoIndex"],
    owner_lane_vi: "Progression lane giữ readiness, prerequisite và remediation.",
    owner_lane_en: "Progression lane owns readiness, prerequisites, and remediation.",
    next_step_vi: "Later integration cần đọc dependency trước khi mở khóa checkpoint cao hơn.",
    next_step_en: "Later integration should read dependencies before unlocking higher checkpoints.",
    learner_trap_vi: "Text-speaking prompt không ghi âm và không chấm phát âm.",
    learner_trap_en: "Text-speaking prompts do not record audio and do not score pronunciation.",
  },
  {
    id: "handoff-quality-review",
    group: "pre_integration_review",
    lane: "quality_lane",
    status: "ready_for_later_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਣਵੱਤਾ ਜਾਂਚ",
    romanization: "gunvatta janch",
    title_vi: "Kiểm chất lượng",
    title_en: "Quality review",
    handoff_vi: "Bàn giao coverage map, registry, QA inventory và pre-MR checklist cho review trước A11 sau này.",
    handoff_en: "Hands off coverage map, registry, QA inventory, and pre-MR checklist for review before later A11.",
    readiness_signal_vi: "Có file review riêng, test riêng và route review coverage/Canada/boundary.",
    readiness_signal_en: "Dedicated review files, tests, and coverage/Canada/boundary review routes exist.",
    sample: { gurmukhi: "ਇਸ ਮਾਮਲੇ ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਕਰੀਏ।", romanization: "is mamle nu hor spasht kariye", vi: "Hãy làm rõ thêm vấn đề này.", en: "Let us clarify this matter further." },
    modules: ["preIntegrationCoverageMap", "finalModuleRegistry", "finalQaInventory", "preMrAuditChecklist"],
    owner_lane_vi: "Quality lane giữ dữ liệu review, không chạy integration.",
    owner_lane_en: "Quality lane owns review data; it does not run integration.",
    next_step_vi: "Later integration nên đọc checklist trước khi map vào UI hoặc registry chung.",
    next_step_en: "Later integration should read checklists before mapping into UI or shared registry.",
    learner_trap_vi: "Review readiness không đồng nghĩa deploy hoặc merge.",
    learner_trap_en: "Review readiness does not mean deploy or merge.",
  },
  {
    id: "handoff-native-review-boundary",
    group: "forbidden_claims",
    lane: "handoff_boundary_lane",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ ਸੀਮਾ",
    romanization: "multavi samikhia sima",
    title_vi: "Ranh giới native review",
    title_en: "Native review boundary",
    handoff_vi: "Bàn giao ranh giới: native review deferred, không claim đã có kiểm duyệt bản ngữ.",
    handoff_en: "Hands off the boundary: native review is deferred; completed native review is not claimed.",
    readiness_signal_vi: "Các scope review nói deferred và not claimed.",
    readiness_signal_en: "Review scopes state deferred and not claimed.",
    sample: { gurmukhi: "ਜੀ", romanization: "ji", vi: "từ lịch sự", en: "respect marker" },
    modules: ["integrationReadinessChecklist", "preIntegrationCoverageMap", "finalModuleRegistry", "finalQaInventory", "preMrAuditChecklist"],
    owner_lane_vi: "Boundary lane giữ các điều không được claim.",
    owner_lane_en: "Boundary lane owns claims that must not be made.",
    next_step_vi: "Later integration phải giữ thông báo native review deferred.",
    next_step_en: "Later integration must preserve the native-review-deferred notice.",
    learner_trap_vi: "Có handoff không có nghĩa đã được người bản ngữ phê duyệt.",
    learner_trap_en: "A handoff does not mean native-speaker approval is complete.",
  },
  {
    id: "handoff-no-audio-scoring",
    group: "forbidden_claims",
    lane: "handoff_boundary_lane",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਆਡੀਓ ਨਹੀਂ",
    romanization: "audio nahin",
    title_vi: "Không audio/scoring",
    title_en: "No audio/scoring",
    handoff_vi: "Bàn giao ranh giới no audio, no pronunciation scoring, no Azure và no speech pipeline.",
    handoff_en: "Hands off the boundary of no audio, no pronunciation scoring, no Azure, and no speech pipeline.",
    readiness_signal_vi: "Excluded scope và QA items giữ speaking prompt là text-only.",
    readiness_signal_en: "Excluded scope and QA items keep speaking prompts text-only.",
    sample: { gurmukhi: "ਨਹੀਂ", romanization: "nahin", vi: "không", en: "no" },
    modules: ["masteryCheckpoints", "finalCanDoIndex", "finalQaInventory", "preMrAuditChecklist"],
    owner_lane_vi: "Boundary lane ngăn claim về audio và scoring.",
    owner_lane_en: "Boundary lane prevents audio and scoring claims.",
    next_step_vi: "Later integration không được tự động nối với audio, pronunciation scoring hoặc Azure.",
    next_step_en: "Later integration must not automatically connect audio, pronunciation scoring, or Azure.",
    learner_trap_vi: "Text-only practice có thể giúp chuẩn bị câu nói nhưng không đánh giá phát âm.",
    learner_trap_en: "Text-only practice can prepare spoken responses but does not evaluate pronunciation.",
  },
  {
    id: "handoff-shahmukhi-awareness",
    group: "forbidden_claims",
    lane: "handoff_boundary_lane",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਸ਼ਾਹਮੁਖੀ ਜਾਣਕਾਰੀ",
    romanization: "Shahmukhi jankari",
    title_vi: "Nhận biết Shahmukhi",
    title_en: "Shahmukhi awareness",
    handoff_vi: "Bàn giao ranh giới script: Shahmukhi chỉ awareness-only, không phải full course.",
    handoff_en: "Hands off the script boundary: Shahmukhi is awareness-only, not a full course.",
    readiness_signal_vi: "Scope nhắc Shahmukhi bằng chữ Latin và sample vẫn dùng Gurmukhi.",
    readiness_signal_en: "Scope mentions Shahmukhi in Latin letters and samples remain Gurmukhi.",
    sample: { gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ।", romanization: "sat sri akal ji", vi: "Xin chào ạ.", en: "Hello, respectfully." },
    modules: ["index", "courseMap", "finalModuleRegistry", "preMrAuditChecklist"],
    owner_lane_vi: "Boundary lane giữ course Gurmukhi-first.",
    owner_lane_en: "Boundary lane keeps the course Gurmukhi-first.",
    next_step_vi: "Later integration không được thêm bài Shahmukhi đầy đủ vào Punjabi Gurmukhi path.",
    next_step_en: "Later integration must not add a full Shahmukhi course to the Punjabi Gurmukhi path.",
    learner_trap_vi: "Biết tên Shahmukhi không đồng nghĩa học đọc hệ chữ đó.",
    learner_trap_en: "Knowing the name Shahmukhi does not mean learning to read that script.",
  },
  {
    id: "handoff-public-service-route",
    group: "canada_practical",
    lane: "course_navigation_lane",
    status: "manual_review_needed",
    levels: ["A2", "B1", "B2", "C1"],
    title_pa: "ਜਨਤਕ ਸੇਵਾ ਰਾਹ",
    romanization: "jantak seva rah",
    title_vi: "Route dịch vụ công",
    title_en: "Public-service route",
    handoff_vi: "Bàn giao route cho giấy tờ, địa chỉ, quyết định, lý do và follow-up lịch sự.",
    handoff_en: "Hands off a route for documents, address, decisions, reasons, and polite follow-up.",
    readiness_signal_vi: "Có câu hỏi giấy tờ, formal writing và decision reading.",
    readiness_signal_en: "Document questions, formal writing, and decision reading are present.",
    sample: { gurmukhi: "ਕੀ ਤੁਸੀਂ ਫੈਸਲੇ ਦਾ ਕਾਰਨ ਸਮਝਾ ਸਕਦੇ ਹੋ?", romanization: "ki tusin faisle da karan samjha sakde ho?", vi: "Quý vị có thể giải thích lý do của quyết định không?", en: "Can you explain the reason for the decision?" },
    modules: ["dialogues", "learningPath", "finalCanDoIndex", "preMrAuditChecklist"],
    owner_lane_vi: "Course navigation lane nối public-service items theo hành trình learner.",
    owner_lane_en: "Course navigation lane connects public-service items along the learner journey.",
    next_step_vi: "Later integration nên phân biệt public-service language với tư vấn pháp lý.",
    next_step_en: "Later integration should separate public-service language from legal advice.",
    learner_trap_vi: "ਕਾਰਨ là lý do; đừng tự suy đoán kết quả nếu văn bản chưa nói rõ.",
    learner_trap_en: "Karan means reason; do not infer an outcome if the text does not state it.",
    canada_practical: "Public service desk, school board office, municipal counter, and settlement follow-up in Canada.",
  },
  {
    id: "handoff-later-a11-boundary",
    group: "pre_integration_review",
    lane: "handoff_boundary_lane",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A11 ਤੋਂ ਪਹਿਲਾਂ",
    romanization: "A11 ton pehlan",
    title_vi: "Trước A11 sau này",
    title_en: "Before later A11",
    handoff_vi: "Bản đồ này chuẩn bị cho later A11 nhưng không chạy A11 integration.",
    handoff_en: "This map prepares for later A11 but does not run A11 integration.",
    readiness_signal_vi: "Wave 15 chỉ thêm dữ liệu handoff và test riêng.",
    readiness_signal_en: "Wave 15 only adds handoff data and its own test.",
    sample: { gurmukhi: "ਤਿਆਰੀ", romanization: "tiari", vi: "sự sẵn sàng", en: "readiness" },
    modules: ["preIntegrationHandoffMap"],
    owner_lane_vi: "Boundary lane giữ no push, no deploy, no A11 integration.",
    owner_lane_en: "Boundary lane keeps no push, no deploy, and no A11 integration.",
    next_step_vi: "Later owner cần mở MR/integration riêng sau khi review checklist.",
    next_step_en: "A later owner needs a separate MR/integration after reviewing the checklists.",
    learner_trap_vi: "Handoff map không phải registry chung đã được deploy.",
    learner_trap_en: "A handoff map is not a deployed shared registry.",
  },
];

export const PUNJABI_PRE_INTEGRATION_HANDOFF_ROUTES = [
  {
    id: "learner-journey-route",
    vi: "Learner journey: foundation -> dialogue -> course navigation -> progression.",
    en: "Learner journey: foundation -> dialogue -> course navigation -> progression.",
    item_ids: ["handoff-foundation-script", "handoff-dialogue-canada", "handoff-course-navigation", "handoff-progression-mastery"],
  },
  {
    id: "canada-practical-route",
    vi: "Canada-practical handoff: settlement/public service -> work/health/school -> decision follow-up.",
    en: "Canada-practical handoff: settlement/public service -> work/health/school -> decision follow-up.",
    item_ids: ["handoff-dialogue-canada", "handoff-public-service-route"],
  },
  {
    id: "quality-boundary-route",
    vi: "Quality boundary: review artifacts -> native review deferred -> no audio/scoring -> Shahmukhi awareness-only -> no A11.",
    en: "Quality boundary: review artifacts -> native review deferred -> no audio/scoring -> Shahmukhi awareness-only -> no A11.",
    item_ids: ["handoff-quality-review", "handoff-native-review-boundary", "handoff-no-audio-scoring", "handoff-shahmukhi-awareness", "handoff-later-a11-boundary"],
  },
];

export const PUNJABI_PRE_INTEGRATION_HANDOFF_ROOT = {
  scope: PUNJABI_PRE_INTEGRATION_HANDOFF_SCOPE,
  lanes: PUNJABI_PRE_INTEGRATION_HANDOFF_LANES,
  groups: PUNJABI_PRE_INTEGRATION_HANDOFF_GROUPS,
  items: PUNJABI_PRE_INTEGRATION_HANDOFF_MAP,
  routes: PUNJABI_PRE_INTEGRATION_HANDOFF_ROUTES,
} as const;

export default PUNJABI_PRE_INTEGRATION_HANDOFF_ROOT;
