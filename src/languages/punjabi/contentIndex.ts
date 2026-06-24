// src/languages/punjabi/contentIndex.ts
//
// Punjabi content index for module discovery and integration-ready metadata.
// Gurmukhi is primary; romanization is included as a learning aid.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiContentArea =
  | "levels"
  | "script_path"
  | "skill_area"
  | "survival_domain"
  | "workplace"
  | "healthcare"
  | "public_service"
  | "review"
  | "remediation";

export type PunjabiContentIndexEntry = {
  id: string;
  area: PunjabiContentArea;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  summary_vi: string;
  summary_en: string;
  entry_points: string[];
  linked_modules: string[];
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: boolean;
};

export type PunjabiIndexMetadata = {
  code: "pa";
  name_pa: string;
  primary_script: "Gurmukhi";
  integration_ready: boolean;
  native_review_deferred: boolean;
  shahmukhi_awareness_only: boolean;
  no_audio_or_scoring: boolean;
  notes_vi: string[];
  notes_en: string[];
};

export const PUNJABI_CONTENT_INDEX_METADATA: PunjabiIndexMetadata = {
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  integration_ready: true,
  native_review_deferred: true,
  shahmukhi_awareness_only: true,
  no_audio_or_scoring: true,
  notes_vi: [
    "Chỉ mục này dùng Gurmukhi làm chữ chính; Shahmukhi chỉ là ghi chú nhận biết, không phải khóa đầy đủ.",
    "Native review được hoãn; không tuyên bố đã có kiểm duyệt bản ngữ.",
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, hoặc CI trong Wave 8.",
  ],
  notes_en: [
    "This index uses Gurmukhi as the primary script; Shahmukhi is awareness-only, not a full course.",
    "Native review is deferred; completed native review is not claimed.",
    "Wave 8 includes no audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, or CI work.",
  ],
};

export const PUNJABI_CONTENT_AREAS: PunjabiContentArea[] = [
  "levels",
  "script_path",
  "skill_area",
  "survival_domain",
  "workplace",
  "healthcare",
  "public_service",
  "review",
  "remediation",
];

export const PUNJABI_CONTENT_INDEX: PunjabiContentIndexEntry[] = [
  {
    id: "levels-a1-c2",
    area: "levels",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਪੱਧਰ A1-C2",
    romanization: "paddhar A1-C2",
    title_vi: "Cấp độ A1-C2",
    title_en: "A1-C2 levels",
    summary_vi: "Đường dẫn chính từ chào hỏi, nhu cầu cơ bản đến đọc/viết có sắc thái.",
    summary_en: "Main path from greetings and basic needs to nuanced reading and writing.",
    entry_points: ["courseMap", "learningPath", "progressionMatrix", "masteryCheckpoints"],
    linked_modules: ["lessons-a1", "dialogues", "learningPath", "progressionMatrix"],
    sample: { gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ।", romanization: "sat sri akal ji", vi: "Xin chào ạ.", en: "Hello, respectfully." },
    learner_trap_vi: "Đừng xem C2 là chứng chỉ chính thức; đây là mốc học tập nội bộ.",
    learner_trap_en: "Do not treat C2 as official certification; it is an internal learning milestone.",
  },
  {
    id: "script-gurmukhi-first",
    area: "script_path",
    levels: ["A1", "A2"],
    title_pa: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ",
    romanization: "Gurmukhi pahilan",
    title_vi: "Gurmukhi trước",
    title_en: "Gurmukhi first",
    summary_vi: "Lộ trình đọc chữ Punjabi trước romanization, bắt đầu bằng từ quen thuộc.",
    summary_en: "A path for reading Punjabi script before romanization, starting with familiar words.",
    entry_points: ["index", "lessons-a1", "skillDependencyGraph"],
    linked_modules: ["normalize", "lessons-a1", "masteryCheckpoints"],
    sample: { gurmukhi: "ਪੰਜਾਬੀ", romanization: "Punjabi", vi: "tiếng Punjabi", en: "Punjabi" },
    learner_trap_vi: "Phụ thuộc romanization làm chậm nhận diện chữ.",
    learner_trap_en: "Romanization dependence slows script recognition.",
  },
  {
    id: "skill-grammar-core",
    area: "skill_area",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਮੂਲ ਵਿਆਕਰਨ",
    romanization: "mul viakaran",
    title_vi: "Ngữ pháp cốt lõi",
    title_en: "Core grammar",
    summary_vi: "Mẫu ਹੈ, ਮੈਨੂੰ...ਚਾਹੀਦਾ ਹੈ, câu hỏi ਕੀ, quá khứ với ਸੀ.",
    summary_en: "Patterns with hai, mainu...chahida hai, ki questions, and past with si.",
    entry_points: ["lessons-a1", "dialogues", "progressionMatrix"],
    linked_modules: ["progressionMatrix", "skillDependencyGraph", "masteryCheckpoints"],
    sample: { gurmukhi: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।", romanization: "mainu pani chahida hai", vi: "Tôi cần nước.", en: "I need water." },
    learner_trap_vi: "ਮੈਨੂੰ và ਮੈਂ không thay thế cho nhau.",
    learner_trap_en: "Mainu and main are not interchangeable.",
  },
  {
    id: "survival-shopping-food-transit",
    area: "survival_domain",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਰੋਜ਼ਾਨਾ ਜੀਵਨ",
    romanization: "rozana jivan",
    title_vi: "Sinh hoạt hằng ngày",
    title_en: "Everyday survival",
    summary_vi: "Mua sắm, gọi món, đi xe buýt, hỏi giá, xin túi, đặt lịch đơn giản.",
    summary_en: "Shopping, ordering food, bus travel, prices, bags, and simple appointments.",
    entry_points: ["dialogues", "learningPath"],
    linked_modules: ["dialogues", "progressionMatrix", "masteryCheckpoints"],
    sample: { gurmukhi: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?", romanization: "ih kinne da hai?", vi: "Cái này bao nhiêu tiền?", en: "How much is this?" },
    canada_practical: true,
  },
  {
    id: "canada-settlement-contact",
    area: "survival_domain",
    levels: ["A2", "B1"],
    title_pa: "ਪਤਾ ਅਤੇ ਸੰਪਰਕ",
    romanization: "pata ate sampark",
    title_vi: "Định cư: địa chỉ và liên hệ",
    title_en: "Settlement: address and contact",
    summary_vi: "Mục thực dụng cho Canada: địa chỉ, số điện thoại, người liên hệ, biểu mẫu cơ bản.",
    summary_en: "Canada-practical entry for address, phone number, contact person, and basic forms.",
    entry_points: ["learningPath", "skillDependencyGraph"],
    linked_modules: ["learningPath", "masteryCheckpoints", "skillDependencyGraph"],
    sample: { gurmukhi: "ਇਹ ਮੇਰਾ ਫੋਨ ਨੰਬਰ ਹੈ।", romanization: "ih mera phone number hai", vi: "Đây là số điện thoại của tôi.", en: "This is my phone number." },
    learner_trap_vi: "ਪਤਾ là địa chỉ; đừng nhầm với ਪਿਤਾ là bố.",
    learner_trap_en: "Pata means address; do not confuse it with pita, father.",
    canada_practical: true,
  },
  {
    id: "workplace-readiness",
    area: "workplace",
    levels: ["B1", "B2", "C1"],
    title_pa: "ਕੰਮ ਦੀ ਤਿਆਰੀ",
    romanization: "kamm di tiari",
    title_vi: "Sẵn sàng nơi làm việc",
    title_en: "Workplace readiness",
    summary_vi: "Ca làm, hạn chót, xin nghỉ, làm rõ lý do, bất đồng lịch sự.",
    summary_en: "Shifts, deadlines, time off, clarification, and polite disagreement.",
    entry_points: ["dialogues", "progressionMatrix", "masteryCheckpoints"],
    linked_modules: ["dialogues", "progressionMatrix", "skillDependencyGraph"],
    sample: { gurmukhi: "ਮੇਰੀ ਸ਼ਿਫਟ ਕਿੰਨੇ ਵਜੇ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ?", romanization: "meri shift kinne vaje shuru hundi hai", vi: "Ca của tôi bắt đầu lúc mấy giờ?", en: "What time does my shift start?" },
    learner_trap_vi: "ਕੱਲ੍ਹ có thể là hôm qua hoặc ngày mai; xác nhận ngày cụ thể khi làm việc.",
    learner_trap_en: "Kall can mean yesterday or tomorrow; confirm the exact date at work.",
    canada_practical: true,
  },
  {
    id: "healthcare-readiness",
    area: "healthcare",
    levels: ["A2", "B1", "B2"],
    title_pa: "ਸਿਹਤ ਸੇਵਾ",
    romanization: "sehat seva",
    title_vi: "Sẵn sàng y tế",
    title_en: "Healthcare readiness",
    summary_vi: "Đặt lịch khám, mô tả đau, sốt, ho, thuốc, dị ứng, thời lượng triệu chứng.",
    summary_en: "Book appointments and describe pain, fever, cough, medicine, allergies, and symptom duration.",
    entry_points: ["dialogues", "learningPath", "masteryCheckpoints"],
    linked_modules: ["dialogues", "progressionMatrix", "masteryCheckpoints"],
    sample: { gurmukhi: "ਮੈਨੂੰ ਦੋ ਦਿਨ ਤੋਂ ਬੁਖਾਰ ਹੈ।", romanization: "mainu do din ton bukhar hai", vi: "Tôi bị sốt hai ngày rồi.", en: "I have had a fever for two days." },
    learner_trap_vi: "Trong y tế, tên thuốc nên có dạng chữ viết; romanization chỉ là hỗ trợ học.",
    learner_trap_en: "In healthcare, medicine names should be written; romanization is only a learning aid.",
    canada_practical: true,
  },
  {
    id: "public-service-readiness",
    area: "public_service",
    levels: ["A2", "B1", "C1"],
    title_pa: "ਸਰਕਾਰੀ ਸੇਵਾ",
    romanization: "sarkari seva",
    title_vi: "Sẵn sàng dịch vụ công",
    title_en: "Public-service readiness",
    summary_vi: "Mẫu đơn, chữ ký, giấy tờ cần thiết, yêu cầu giải thích quyết định.",
    summary_en: "Forms, signatures, required documents, and asking for decision reasons.",
    entry_points: ["dialogues", "learningPath", "skillDependencyGraph"],
    linked_modules: ["dialogues", "masteryCheckpoints", "skillDependencyGraph"],
    sample: { gurmukhi: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲੋੜੀਂਦੇ ਹਨ?", romanization: "kihre dastavez lorinde han", vi: "Cần những giấy tờ nào?", en: "Which documents are required?" },
    learner_trap_vi: "Yêu cầu giải thích nên dùng register lịch sự, không ra lệnh.",
    learner_trap_en: "Requests for explanation should use polite register, not commands.",
    canada_practical: true,
  },
  {
    id: "register-formal-clarification",
    area: "skill_area",
    levels: ["B2", "C1", "C2"],
    title_pa: "ਰਸਮੀ ਸਪਸ਼ਟੀਕਰਨ",
    romanization: "rasmi spashtikaran",
    title_vi: "Làm rõ trang trọng",
    title_en: "Formal clarification",
    summary_vi: "Register cho họp, công việc, dịch vụ công và yêu cầu lý do quyết định.",
    summary_en: "Register for meetings, work, public services, and asking for decision reasons.",
    entry_points: ["progressionMatrix", "skillDependencyGraph"],
    linked_modules: ["skillDependencyGraph", "masteryCheckpoints", "courseMap"],
    sample: { gurmukhi: "ਕੀ ਤੁਸੀਂ ਫੈਸਲੇ ਦਾ ਕਾਰਨ ਸਮਝਾ ਸਕਦੇ ਹੋ?", romanization: "ki tusi faisle da karan samjha sakde ho?", vi: "Bạn có thể giải thích lý do của quyết định không?", en: "Can you explain the reason for the decision?" },
    learner_trap_vi: "Bất đồng hoặc yêu cầu quá trực tiếp có thể nghe gắt.",
    learner_trap_en: "Overly direct disagreement or requests can sound harsh.",
    canada_practical: true,
  },
  {
    id: "review-checkpoints",
    area: "review",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਦੁਹਰਾਈ ਚੈਕਪੋਇੰਟ",
    romanization: "duhrai checkpoint",
    title_vi: "Checkpoint ôn tập",
    title_en: "Review checkpoints",
    summary_vi: "Liên kết tiến độ, mastery checkpoint, tự kiểm tra, bài nối nghĩa và prompt viết.",
    summary_en: "Links progression, mastery checkpoints, self-checks, matching tasks, and writing prompts.",
    entry_points: ["progressionMatrix", "masteryCheckpoints"],
    linked_modules: ["progressionMatrix", "masteryCheckpoints", "learningPath"],
    sample: { gurmukhi: "ਦੁਹਰਾਈ", romanization: "duhrai", vi: "ôn tập", en: "review" },
  },
  {
    id: "remediation-paths",
    area: "remediation",
    levels: ["A1", "A2", "B1", "B2", "C1"],
    title_pa: "ਸੁਧਾਰ ਰਾਹ",
    romanization: "sudhar rah",
    title_vi: "Đường sửa lỗi",
    title_en: "Remediation paths",
    summary_vi: "Sửa phụ thuộc romanization, thiếu lịch sự, thiếu kết nối Canada-practical.",
    summary_en: "Repairs romanization dependence, politeness gaps, and missing Canada-practical connections.",
    entry_points: ["skillDependencyGraph", "masteryCheckpoints"],
    linked_modules: ["skillDependencyGraph", "progressionMatrix", "learningPath"],
    sample: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ", romanization: "kirpa karke", vi: "làm ơn", en: "please" },
    learner_trap_vi: "Không thêm bài mới khi nền Gurmukhi hoặc register còn yếu.",
    learner_trap_en: "Do not add new lessons while Gurmukhi or register foundations are weak.",
  },
];

export const PUNJABI_CONTENT_INDEX_LINKS = {
  foundation: ["index", "lessons", "normalize", "lessons-a1"],
  wave_modules: [
    "dialogues",
    "courseMap",
    "learningPath",
    "progressionMatrix",
    "masteryCheckpoints",
    "skillDependencyGraph",
    "contentIndex",
  ],
  tests: [
    "punjabiFoundation",
    "punjabiDialogues",
    "punjabiCourseMap",
    "punjabiLearningPath",
    "punjabiProgressionMatrix",
    "punjabiMasteryCheckpoints",
    "punjabiSkillDependencyGraph",
    "punjabiContentIndex",
  ],
} as const;

export const PUNJABI_CONTENT_INDEX_ROOT = {
  metadata: PUNJABI_CONTENT_INDEX_METADATA,
  areas: PUNJABI_CONTENT_AREAS,
  entries: PUNJABI_CONTENT_INDEX,
  links: PUNJABI_CONTENT_INDEX_LINKS,
} as const;

export default PUNJABI_CONTENT_INDEX_ROOT;
