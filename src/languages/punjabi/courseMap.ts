// src/languages/punjabi/courseMap.ts
//
// Compact Punjabi course map. Pure data only: no runtime logic, no side
// effects. Gurmukhi is primary; Shahmukhi is awareness-only.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiLevelGoal = {
  level: PunjabiCefrLevel;
  label_vi: string;
  label_en: string;
  goal_vi: string;
  goal_en: string;
  cando_vi: string;
  cando_en: string;
  sample_gurmukhi: string;
  romanization: string;
};

export const PUNJABI_LEVEL_GOALS: PunjabiLevelGoal[] = [
  {
    level: "A1",
    label_vi: "Nền tảng",
    label_en: "Foundation",
    goal_vi: "Đọc chữ Gurmukhi cơ bản, chào hỏi, hỏi tên, số, gia đình, món ăn đơn giản.",
    goal_en: "Read basic Gurmukhi, greet people, ask names, use numbers, family words, and simple food phrases.",
    cando_vi: "Xử lý câu rất ngắn trong tình huống quen thuộc với romanization hỗ trợ.",
    cando_en: "Handle very short predictable exchanges with romanization support.",
    sample_gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ।",
    romanization: "sat sri akal ji",
  },
  {
    level: "A2",
    label_vi: "Sơ cấp",
    label_en: "Elementary",
    goal_vi: "Mua sắm, gọi món, hỏi đường, đặt lịch đơn giản, nói nhu cầu cơ bản.",
    goal_en: "Shop, order food, ask directions, book simple appointments, and state basic needs.",
    cando_vi: "Trao đổi thông tin thường ngày bằng câu ngắn và mẫu cố định.",
    cando_en: "Exchange routine information with short sentences and fixed patterns.",
    sample_gurmukhi: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mainu pani chahida hai",
  },
  {
    level: "B1",
    label_vi: "Trung cấp",
    label_en: "Intermediate",
    goal_vi: "Kể trải nghiệm, giải thích vấn đề, gọi điện, xử lý trường học, công việc, giấy tờ.",
    goal_en: "Describe experiences, explain problems, make calls, and manage school, work, and document situations.",
    cando_vi: "Tự xoay xở trong du lịch, học tập, công việc với câu nối đơn giản.",
    cando_en: "Cope in travel, study, and work using connected but simple language.",
    sample_gurmukhi: "ਮੇਰਾ ਕੰਮ ਇੱਕ ਦਿਨ ਦੇਰ ਨਾਲ ਹੋਵੇਗਾ।",
    romanization: "mera kamm ikk din der nal hovega",
  },
  {
    level: "B2",
    label_vi: "Trung cao cấp",
    label_en: "Upper-intermediate",
    goal_vi: "Mô tả triệu chứng, khiếu nại, trình bày lựa chọn, tham gia thảo luận quen thuộc.",
    goal_en: "Describe symptoms, complain, present options, and join familiar discussions.",
    cando_vi: "Tương tác khá tự nhiên và bảo vệ quan điểm trên chủ đề thực tế.",
    cando_en: "Interact fairly naturally and defend a viewpoint on practical topics.",
    sample_gurmukhi: "ਦੋ ਦਿਨ ਤੋਂ ਬੁਖਾਰ ਅਤੇ ਖੰਘ ਹੈ।",
    romanization: "do din ton bukhar ate khang hai",
  },
  {
    level: "C1",
    label_vi: "Cao cấp",
    label_en: "Advanced",
    goal_vi: "Nói lịch sự trong họp, làm mềm bất đồng, đọc văn bản dài hơn và viết thư trang trọng.",
    goal_en: "Speak politely in meetings, soften disagreement, read longer texts, and write formal messages.",
    cando_vi: "Dùng Punjabi linh hoạt cho xã hội, học thuật nhẹ và công việc.",
    cando_en: "Use Punjabi flexibly for social, light academic, and professional purposes.",
    sample_gurmukhi: "ਮੇਰੀ ਰਾਏ ਥੋੜ੍ਹੀ ਵੱਖਰੀ ਹੈ।",
    romanization: "meri rai thorhi vakhri hai",
  },
  {
    level: "C2",
    label_vi: "Thành thạo",
    label_en: "Mastery",
    goal_vi: "Tóm tắt, tranh luận, viết mạch lạc, nhận diện sắc thái văn phong và vùng miền.",
    goal_en: "Summarize, debate, write coherently, and recognize register and regional nuance.",
    cando_vi: "Hiểu và diễn đạt ý phức tạp với độ chính xác cao, sau khi có kiểm duyệt chuyên sâu.",
    cando_en: "Understand and express complex ideas with high precision, pending deeper expert review.",
    sample_gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਫੈਸਲੇ ਦਾ ਕਾਰਨ ਸਮਝਾਓ।",
    romanization: "kirpa karke faisle da karan samjhao",
  },
];

export type PunjabiModuleKey =
  | "levels"
  | "survival"
  | "vocabulary"
  | "gurmukhi_script"
  | "review"
  | "reading"
  | "writing"
  | "speaking"
  | "quizzes"
  | "diagnostics";

export type PunjabiModule = {
  key: PunjabiModuleKey;
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  desc_vi: string;
  desc_en: string;
};

export const PUNJABI_MODULES: PunjabiModule[] = [
  {
    key: "levels",
    title_pa: "ਪੱਧਰ",
    romanization: "paddhar",
    title_vi: "Bài theo cấp độ",
    title_en: "Leveled lessons",
    desc_vi: "Lộ trình A1-C2 với mẫu câu, từ vựng, hội thoại và bài tập.",
    desc_en: "The A1-C2 path with sentence patterns, vocabulary, dialogues, and exercises.",
  },
  {
    key: "survival",
    title_pa: "ਜ਼ਰੂਰੀ ਪੰਜਾਬੀ",
    romanization: "zaruri Punjabi",
    title_vi: "Punjabi sinh tồn",
    title_en: "Survival Punjabi",
    desc_vi: "Cụm dùng ngay: chào hỏi, nước, giá tiền, trạm xe buýt, phòng khám, giấy tờ.",
    desc_en: "Use-now phrases: greetings, water, prices, bus stops, clinics, and documents.",
  },
  {
    key: "vocabulary",
    title_pa: "ਸ਼ਬਦਾਵਲੀ",
    romanization: "shabdavali",
    title_vi: "Từ vựng",
    title_en: "Vocabulary",
    desc_vi: "Từ theo chủ đề với Gurmukhi, romanization, nghĩa tiếng Việt và tiếng Anh.",
    desc_en: "Themed words with Gurmukhi, romanization, Vietnamese meanings, and English meanings.",
  },
  {
    key: "gurmukhi_script",
    title_pa: "ਗੁਰਮੁਖੀ ਲਿਪੀ",
    romanization: "Gurmukhi lipi",
    title_vi: "Chữ Gurmukhi",
    title_en: "Gurmukhi script",
    desc_vi: "Nhận diện chữ cái, dấu nguyên âm, âm bật hơi, âm quặt lưỡi và dấu mũi.",
    desc_en: "Recognize letters, vowel signs, aspirated consonants, retroflex sounds, and nasal marks.",
  },
  {
    key: "review",
    title_pa: "ਦੁਹਰਾਈ",
    romanization: "duhrai",
    title_vi: "Ôn tập",
    title_en: "Review",
    desc_vi: "Ôn mẫu câu cốt lõi trước khi sang cấp hoặc chủ đề mới.",
    desc_en: "Review core patterns before moving to a new level or topic.",
  },
  {
    key: "reading",
    title_pa: "ਪੜ੍ਹਨਾ",
    romanization: "parhna",
    title_vi: "Đọc",
    title_en: "Reading",
    desc_vi: "Tập đọc từ, câu ngắn, thông báo đơn giản và đoạn văn thực tế.",
    desc_en: "Practice reading words, short sentences, simple notices, and practical paragraphs.",
  },
  {
    key: "writing",
    title_pa: "ਲਿਖਣਾ",
    romanization: "likhna",
    title_vi: "Viết",
    title_en: "Writing",
    desc_vi: "Viết chữ Gurmukhi, câu tự giới thiệu, tin nhắn, email và yêu cầu lịch sự.",
    desc_en: "Write Gurmukhi, self-introductions, messages, emails, and polite requests.",
  },
  {
    key: "speaking",
    title_pa: "ਬੋਲਣਾ",
    romanization: "bolna",
    title_vi: "Nói",
    title_en: "Speaking prompts",
    desc_vi: "Gợi ý đóng vai và trả lời miệng; hiện chưa có chấm điểm phát âm.",
    desc_en: "Roleplay and oral-response prompts; pronunciation scoring is not available yet.",
  },
  {
    key: "quizzes",
    title_pa: "ਪ੍ਰਸ਼ਨੋਤਰੀ",
    romanization: "prashnotri",
    title_vi: "Bài kiểm tra",
    title_en: "Quizzes",
    desc_vi: "Tự kiểm tra bằng nối nghĩa, điền khuyết, dịch câu và chọn đáp án.",
    desc_en: "Self-check with matching, fill-in-the-blank, translation, and multiple choice.",
  },
  {
    key: "diagnostics",
    title_pa: "ਜਾਂਚ",
    romanization: "janch",
    title_vi: "Chẩn đoán",
    title_en: "Diagnostics",
    desc_vi: "Câu hỏi định vị trình độ đọc Gurmukhi, mẫu câu, từ vựng và hội thoại.",
    desc_en: "Placement checks for Gurmukhi reading, patterns, vocabulary, and dialogue ability.",
  },
];

export type PunjabiSuggestedOrder = {
  audience: "vi" | "en";
  note_vi: string;
  note_en: string;
  order: PunjabiModuleKey[];
};

export const PUNJABI_SUGGESTED_ORDERS: PunjabiSuggestedOrder[] = [
  {
    audience: "vi",
    note_vi:
      "Người Việt nên học chữ Gurmukhi sớm, rồi so sánh âm bật hơi và phụ âm quặt lưỡi vì tiếng Việt không đánh dấu chúng giống Punjabi.",
    note_en:
      "Vietnamese speakers should front-load Gurmukhi, then compare aspiration and retroflex sounds because Vietnamese marks them differently from Punjabi.",
    order: [
      "gurmukhi_script",
      "survival",
      "vocabulary",
      "levels",
      "reading",
      "speaking",
      "writing",
      "review",
      "quizzes",
      "diagnostics",
    ],
  },
  {
    audience: "en",
    note_vi:
      "Người nói tiếng Anh nên bắt đầu bằng cụm sinh tồn và romanization, rồi chuyển nhanh sang Gurmukhi để tránh phụ thuộc chữ Latin.",
    note_en:
      "English speakers should begin with survival phrases and romanization, then move quickly into Gurmukhi to avoid Latin-script dependence.",
    order: [
      "survival",
      "vocabulary",
      "gurmukhi_script",
      "levels",
      "speaking",
      "reading",
      "writing",
      "review",
      "quizzes",
      "diagnostics",
    ],
  },
];

export type PunjabiCourseWarningKey =
  | "native_review_deferred"
  | "no_audio"
  | "no_pronunciation_scoring"
  | "no_certification"
  | "shahmukhi_awareness_only";

export type PunjabiCourseWarning = {
  key: PunjabiCourseWarningKey;
  text_vi: string;
  text_en: string;
};

export const PUNJABI_COURSE_WARNINGS: PunjabiCourseWarning[] = [
  {
    key: "native_review_deferred",
    text_vi: "Nội dung là bản học tập text-first; native review được hoãn và chưa được tuyên bố hoàn tất.",
    text_en: "This is a text-first learning draft; native review is deferred and is not claimed complete.",
  },
  {
    key: "no_audio",
    text_vi: "Chưa có audio Punjabi trong phạm vi bản đồ khóa học này.",
    text_en: "Punjabi audio is not included in this course-map scope.",
  },
  {
    key: "no_pronunciation_scoring",
    text_vi: "Chưa có chấm điểm phát âm hoặc phân tích giọng nói.",
    text_en: "There is no pronunciation scoring or speech analysis yet.",
  },
  {
    key: "no_certification",
    text_vi: "Lộ trình này không tuyên bố là chứng chỉ chính thức hoặc thay thế kỳ thi.",
    text_en: "This path does not claim official certification or exam equivalence.",
  },
  {
    key: "shahmukhi_awareness_only",
    text_vi: "Shahmukhi chỉ được nhắc để nhận biết; khóa này không dạy Shahmukhi đầy đủ.",
    text_en: "Shahmukhi is mentioned for awareness only; this course does not teach full Shahmukhi.",
  },
];

export const PUNJABI_COURSE_MAP = {
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  name_vi: "Tiếng Punjabi",
  name_en: "Punjabi",
  primary_script: "Gurmukhi",
  script_note_vi:
    "Nội dung chính dùng chữ Gurmukhi. Shahmukhi tồn tại trong cộng đồng khác, nhưng ở đây chỉ là ghi chú nhận biết.",
  script_note_en:
    "Core content uses Gurmukhi. Shahmukhi exists in other communities, but here it is only an awareness note.",
  levels: PUNJABI_LEVEL_GOALS,
  modules: PUNJABI_MODULES,
  suggested_orders: PUNJABI_SUGGESTED_ORDERS,
  warnings: PUNJABI_COURSE_WARNINGS,
} as const;

export default PUNJABI_COURSE_MAP;
