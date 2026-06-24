// src/languages/punjabi/finalModuleRegistry.ts
//
// Final pre-integration registry for Punjabi modules. This is Wave 11 only,
// not A11 integration. Gurmukhi is primary; native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiRegistrySkill =
  | "foundation"
  | "dialogue"
  | "navigation"
  | "learning_path"
  | "progression"
  | "mastery"
  | "dependency_graph"
  | "content_index"
  | "readiness"
  | "coverage";

export type PunjabiRegistryCanadaDomain =
  | "settlement"
  | "survival"
  | "work"
  | "health"
  | "school"
  | "public_service"
  | "review";

export type PunjabiModuleRegistryEntry = {
  id: string;
  module: string;
  skill: PunjabiRegistrySkill;
  levels: PunjabiCefrLevel[];
  learner_support: Array<"vi" | "en">;
  canada_domains: PunjabiRegistryCanadaDomain[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  purpose_vi: string;
  purpose_en: string;
  route_hint_vi: string;
  route_hint_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  checkpoint_vi?: string;
  checkpoint_en?: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export const PUNJABI_FINAL_REGISTRY_SCOPE = {
  wave: "Wave 11",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  script_note_vi:
    "Registry này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết, không phải khóa đầy đủ.",
  script_note_en:
    "This registry uses Gurmukhi as the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã có kiểm duyệt bản ngữ.",
  native_review_en: "Native review is deferred; completed native review is not claimed.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
};

export const PUNJABI_FINAL_REGISTRY_SKILLS: PunjabiRegistrySkill[] = [
  "foundation",
  "dialogue",
  "navigation",
  "learning_path",
  "progression",
  "mastery",
  "dependency_graph",
  "content_index",
  "readiness",
  "coverage",
];

export const PUNJABI_FINAL_MODULE_REGISTRY: PunjabiModuleRegistryEntry[] = [
  {
    id: "foundation-core",
    module: "index / lessons / normalize / lessons-a1",
    skill: "foundation",
    levels: ["A1"],
    learner_support: ["vi", "en"],
    canada_domains: ["survival", "review"],
    title_pa: "ਬੁਨਿਆਦ",
    romanization: "bunyad",
    title_vi: "Nền tảng",
    title_en: "Foundation",
    purpose_vi: "Metadata Punjabi, bài A1 đầu tiên, normalization và kiểm thử nền tảng.",
    purpose_en: "Punjabi metadata, first A1 lesson, normalization, and foundation tests.",
    route_hint_vi: "Bắt đầu ở đây nếu người học chưa đọc Gurmukhi.",
    route_hint_en: "Start here if the learner cannot yet read Gurmukhi.",
    sample: { gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ।", romanization: "sat sri akal ji", vi: "Xin chào ạ.", en: "Hello, respectfully." },
    checkpoint_vi: "Đọc được lời chào Gurmukhi trước romanization.",
    checkpoint_en: "Read the Gurmukhi greeting before romanization.",
    learner_trap_vi: "Đừng để romanization thành tín hiệu chính.",
    learner_trap_en: "Do not let romanization become the main signal.",
  },
  {
    id: "dialogue-roleplay",
    module: "dialogues",
    skill: "dialogue",
    levels: ["A1", "A2", "B1", "B2", "C1"],
    learner_support: ["vi", "en"],
    canada_domains: ["survival", "work", "health", "school", "public_service"],
    title_pa: "ਗੱਲਬਾਤ ਅਭਿਆਸ",
    romanization: "gallbat abhyas",
    title_vi: "Hội thoại đóng vai",
    title_en: "Dialogue roleplay",
    purpose_vi: "30 hội thoại compact cho chào hỏi, gia đình, ăn uống, mua sắm, transit, điện thoại, phòng khám, trường học, công việc, dịch vụ công.",
    purpose_en: "30 compact dialogues for greetings, family, food, shopping, transit, phone, clinic, school, workplace, and public services.",
    route_hint_vi: "Dùng sau foundation để luyện tình huống thực tế.",
    route_hint_en: "Use after foundation for practical situations.",
    sample: { gurmukhi: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲੋੜੀਂਦੇ ਹਨ?", romanization: "kihre dastavez lorinde han", vi: "Cần những giấy tờ nào?", en: "Which documents are required?" },
    checkpoint_vi: "Hoàn thành một roleplay có mục tiêu, phrase hữu ích và lỗi thường gặp.",
    checkpoint_en: "Complete one roleplay with goal, useful phrase, and common mistake.",
    learner_trap_vi: "Câu đúng nghĩa vẫn có thể thiếu lịch sự nếu bỏ ਜੀ hoặc ਕਿਰਪਾ ਕਰਕੇ.",
    learner_trap_en: "A meaningful sentence can still lack politeness if ji or kirpa karke is missing.",
  },
  {
    id: "course-navigation-map",
    module: "courseMap",
    skill: "navigation",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    learner_support: ["vi", "en"],
    canada_domains: ["survival", "review"],
    title_pa: "ਕੋਰਸ ਨਕਸ਼ਾ",
    romanization: "course naksha",
    title_vi: "Bản đồ khóa học",
    title_en: "Course map",
    purpose_vi: "Điều hướng A1-C2, survival, từ vựng, Gurmukhi, review, reading, writing, speaking prompt, quiz, diagnostics.",
    purpose_en: "Navigation for A1-C2, survival, vocabulary, Gurmukhi, review, reading, writing, speaking prompts, quizzes, diagnostics.",
    route_hint_vi: "Dùng để chọn module tiếp theo theo nhóm người học Việt/Anh.",
    route_hint_en: "Use to choose next modules by Vietnamese/English learner route.",
    sample: { gurmukhi: "ਗੁਰਮੁਖੀ ਲਿਪੀ", romanization: "Gurmukhi lipi", vi: "chữ Gurmukhi", en: "Gurmukhi script" },
    checkpoint_vi: "Chọn được lộ trình đề xuất mà không suy đoán module.",
    checkpoint_en: "Select a suggested route without guessing modules.",
    learner_trap_vi: "Đừng nhảy sang speaking prompt nếu người học chưa có đường Gurmukhi.",
    learner_trap_en: "Do not jump to speaking prompts if the learner lacks a Gurmukhi route.",
  },
  {
    id: "learning-path-foundation",
    module: "learningPath",
    skill: "learning_path",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    learner_support: ["vi", "en"],
    canada_domains: ["settlement", "work", "health", "public_service"],
    title_pa: "ਸਿੱਖਣ ਰਾਹ",
    romanization: "sikhan rah",
    title_vi: "Lộ trình học",
    title_en: "Learning path",
    purpose_vi: "A1-C2 Gurmukhi-first roadmap, route cho Việt/Anh, và đường Canada settlement/work/health/public-service.",
    purpose_en: "A1-C2 Gurmukhi-first roadmap, VI/EN learner routes, and Canada settlement/work/health/public-service path.",
    route_hint_vi: "Dùng khi cần giải thích vì sao học module này trước module kia.",
    route_hint_en: "Use when explaining why one module comes before another.",
    sample: { gurmukhi: "ਮੇਰਾ ਪਤਾ ਇਹ ਹੈ।", romanization: "mera pata ih hai", vi: "Địa chỉ của tôi là đây.", en: "This is my address." },
    checkpoint_vi: "Người học biết mốc hiện tại và bước tiếp theo.",
    checkpoint_en: "Learner knows the current milestone and next step.",
    learner_trap_vi: "ਪਤਾ là địa chỉ, không phải ਪਿਤਾ.",
    learner_trap_en: "Pata means address, not pita.",
  },
  {
    id: "progression-matrix",
    module: "progressionMatrix",
    skill: "progression",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    learner_support: ["vi", "en"],
    canada_domains: ["survival", "work", "health", "public_service", "review"],
    title_pa: "ਤਰੱਕੀ ਮੈਟ੍ਰਿਕਸ",
    romanization: "tarakki matrix",
    title_vi: "Ma trận tiến độ",
    title_en: "Progression matrix",
    purpose_vi: "Liên kết skill, script, grammar, vocabulary, survival, workplace, healthcare, public service và review checkpoint.",
    purpose_en: "Links skills, script, grammar, vocabulary, survival, workplace, healthcare, public service, and review checkpoints.",
    route_hint_vi: "Dùng để kiểm tra lỗ hổng theo cấp độ và kỹ năng.",
    route_hint_en: "Use to inspect gaps by level and skill.",
    sample: { gurmukhi: "ਦੋ ਦਿਨ ਤੋਂ ਦਰਦ ਹੈ।", romanization: "do din ton dard hai", vi: "Tôi bị đau hai ngày rồi.", en: "I have had pain for two days." },
    checkpoint_vi: "Sau mỗi cấp, có tiêu chí ôn trước khi đi tiếp.",
    checkpoint_en: "After each level, review criteria exist before moving on.",
  },
  {
    id: "mastery-checkpoints",
    module: "masteryCheckpoints",
    skill: "mastery",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    learner_support: ["vi", "en"],
    canada_domains: ["settlement", "work", "health", "public_service", "review"],
    title_pa: "ਮਾਹਰਤਾ ਚੈਕਪੋਇੰਟ",
    romanization: "maharta checkpoint",
    title_vi: "Checkpoint thành thạo",
    title_en: "Mastery checkpoints",
    purpose_vi: "Readiness across script, vocab, grammar, speaking-safe text prompts, reading, writing, survival, work, healthcare, public service.",
    purpose_en: "Readiness across script, vocab, grammar, speaking-safe text prompts, reading, writing, survival, work, healthcare, public service.",
    route_hint_vi: "Dùng khi cần bằng chứng người học đã sẵn sàng cho nhiệm vụ.",
    route_hint_en: "Use when evidence is needed that a learner is ready for a task.",
    sample: { gurmukhi: "ਕੀ ਕੋਈ ਹੋਰ ਵਿਕਲਪ ਹੈ?", romanization: "ki koi hor vikalp hai?", vi: "Có lựa chọn nào khác không?", en: "Is there another option?" },
    checkpoint_vi: "Text prompt an toàn, không có ghi âm hay chấm phát âm.",
    checkpoint_en: "Text-safe prompt, no recording or pronunciation scoring.",
  },
  {
    id: "skill-dependency-graph",
    module: "skillDependencyGraph",
    skill: "dependency_graph",
    levels: ["A1", "A2", "B1", "B2", "C1"],
    learner_support: ["vi", "en"],
    canada_domains: ["settlement", "work", "health", "public_service", "review"],
    title_pa: "ਕੌਸ਼ਲ ਗ੍ਰਾਫ",
    romanization: "kaushal graph",
    title_vi: "Graph phụ thuộc kỹ năng",
    title_en: "Skill dependency graph",
    purpose_vi: "Liên kết Gurmukhi, vocabulary, grammar, register, survival, work, healthcare, public service và remediation.",
    purpose_en: "Links Gurmukhi, vocabulary, grammar, register, survival, work, healthcare, public service, and remediation.",
    route_hint_vi: "Dùng khi người học bị kẹt và cần đường sửa lỗi.",
    route_hint_en: "Use when a learner is stuck and needs a remediation route.",
    sample: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ", romanization: "kirpa karke", vi: "làm ơn", en: "please" },
    checkpoint_vi: "Đường sửa lỗi trả người học về script hoặc register đúng.",
    checkpoint_en: "Remediation routes return learners to script or register foundations.",
    learner_trap_vi: "Không thêm nội dung mới khi nền Gurmukhi còn yếu.",
    learner_trap_en: "Do not add new content when Gurmukhi foundations are weak.",
  },
  {
    id: "content-index",
    module: "contentIndex",
    skill: "content_index",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    learner_support: ["vi", "en"],
    canada_domains: ["settlement", "survival", "work", "health", "public_service", "review"],
    title_pa: "ਸਮੱਗਰੀ ਸੂਚੀ",
    romanization: "samagri suchi",
    title_vi: "Chỉ mục nội dung",
    title_en: "Content index",
    purpose_vi: "Chỉ mục module theo levels, skill areas, survival, workplace, health, public-service, script path, review/remediation.",
    purpose_en: "Indexes modules by levels, skill areas, survival, workplace, health, public-service, script path, review/remediation.",
    route_hint_vi: "Dùng để tìm nhanh entry point và linked module.",
    route_hint_en: "Use to quickly find entry points and linked modules.",
    sample: { gurmukhi: "ਦੁਹਰਾਈ", romanization: "duhrai", vi: "ôn tập", en: "review" },
    checkpoint_vi: "Tìm được module cần thiết qua registry thay vì đoán tên file.",
    checkpoint_en: "Find needed modules through registry instead of guessing filenames.",
  },
  {
    id: "integration-readiness",
    module: "integrationReadinessChecklist",
    skill: "readiness",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    learner_support: ["vi", "en"],
    canada_domains: ["settlement", "work", "health", "public_service", "review"],
    title_pa: "ਤਿਆਰੀ ਚੈਕਲਿਸਟ",
    romanization: "tiari checklist",
    title_vi: "Checklist sẵn sàng",
    title_en: "Readiness checklist",
    purpose_vi: "Checklist cho A11 sau này về coverage, Gurmukhi, VI/EN, Canada domains và scope honesty.",
    purpose_en: "Checklist for later A11 covering coverage, Gurmukhi, VI/EN, Canada domains, and scope honesty.",
    route_hint_vi: "Dùng trước A11 sau này, nhưng Wave 11 không chạy A11.",
    route_hint_en: "Use before later A11, but Wave 11 does not run A11.",
    sample: { gurmukhi: "ਨਹੀਂ", romanization: "nahin", vi: "không", en: "no" },
    checkpoint_vi: "Xác nhận không audio, không scoring, không native-review claim.",
    checkpoint_en: "Confirm no audio, no scoring, and no native-review claim.",
  },
  {
    id: "pre-integration-coverage",
    module: "preIntegrationCoverageMap",
    skill: "coverage",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    learner_support: ["vi", "en"],
    canada_domains: ["settlement", "survival", "work", "health", "school", "public_service", "review"],
    title_pa: "ਕਵਰੇਜ ਨਕਸ਼ਾ",
    romanization: "coverage naksha",
    title_vi: "Bản đồ độ phủ",
    title_en: "Coverage map",
    purpose_vi: "Tổng hợp A1-C2 modules, skill domains, Gurmukhi path, VI/EN support, Canada domains, capstone và deferred review.",
    purpose_en: "Summarizes A1-C2 modules, skill domains, Gurmukhi path, VI/EN support, Canada domains, capstones, and deferred review.",
    route_hint_vi: "Dùng như bản kiểm cuối trước tích hợp sau này.",
    route_hint_en: "Use as the final coverage check before later integration.",
    sample: { gurmukhi: "ਇਸ ਮਾਮਲੇ ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਕਰੀਏ।", romanization: "is mamle nu hor spasht kariye", vi: "Hãy làm rõ thêm vấn đề này.", en: "Let us clarify this matter further." },
    checkpoint_vi: "Capstone/checkpoint style items có mặt cho từng miền chính.",
    checkpoint_en: "Capstone/checkpoint-style items are present for the main domains.",
  },
  {
    id: "deferred-review-boundary",
    module: "finalModuleRegistry",
    skill: "readiness",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    learner_support: ["vi", "en"],
    canada_domains: ["review"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ ਸੀਮਾ",
    romanization: "multavi samikhia sima",
    title_vi: "Ranh giới review hoãn",
    title_en: "Deferred review boundary",
    purpose_vi: "Ghi rõ native review hoãn, Shahmukhi awareness-only, không chứng chỉ, không audio/scoring.",
    purpose_en: "States native review deferred, Shahmukhi awareness-only, no certification, no audio/scoring.",
    route_hint_vi: "Dùng để bảo vệ UI sau này khỏi tuyên bố quá mức.",
    route_hint_en: "Use to prevent later UI from overclaiming.",
    sample: { gurmukhi: "ਜੀ", romanization: "ji", vi: "từ lịch sự", en: "respect marker" },
    checkpoint_vi: "Không claim native review hoặc chứng chỉ chính thức.",
    checkpoint_en: "Do not claim native review or official certification.",
    learner_trap_vi: "Registry sẵn sàng không đồng nghĩa deploy hoặc A11 integration.",
    learner_trap_en: "Registry readiness does not mean deploy or A11 integration.",
  },
];

export const PUNJABI_FINAL_REGISTRY_ROUTES = [
  {
    id: "new-learner-route",
    vi: "Người mới: foundation -> courseMap -> learningPath -> dialogues -> review.",
    en: "New learner: foundation -> courseMap -> learningPath -> dialogues -> review.",
    modules: ["foundation-core", "course-navigation-map", "learning-path-foundation", "dialogue-roleplay"],
  },
  {
    id: "canada-practical-route",
    vi: "Canada-practical: learningPath -> dialogues -> progressionMatrix -> masteryCheckpoints -> contentIndex.",
    en: "Canada-practical: learningPath -> dialogues -> progressionMatrix -> masteryCheckpoints -> contentIndex.",
    modules: ["learning-path-foundation", "dialogue-roleplay", "progression-matrix", "mastery-checkpoints", "content-index"],
  },
  {
    id: "pre-integration-route",
    vi: "Trước tích hợp sau này: contentIndex -> integrationReadinessChecklist -> preIntegrationCoverageMap -> finalModuleRegistry.",
    en: "Before later integration: contentIndex -> integrationReadinessChecklist -> preIntegrationCoverageMap -> finalModuleRegistry.",
    modules: ["content-index", "integration-readiness", "pre-integration-coverage", "deferred-review-boundary"],
  },
];

export const PUNJABI_FINAL_MODULE_REGISTRY_ROOT = {
  scope: PUNJABI_FINAL_REGISTRY_SCOPE,
  skills: PUNJABI_FINAL_REGISTRY_SKILLS,
  entries: PUNJABI_FINAL_MODULE_REGISTRY,
  routes: PUNJABI_FINAL_REGISTRY_ROUTES,
} as const;

export default PUNJABI_FINAL_MODULE_REGISTRY_ROOT;
