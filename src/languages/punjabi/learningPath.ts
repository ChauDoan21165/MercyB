// src/languages/punjabi/learningPath.ts
//
// App-consumable Punjabi learning path data. Gurmukhi is primary, with
// romanization as a learner aid. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiPathAudience = "vi" | "en";

export type PunjabiPathStage = {
  id: string;
  level: PunjabiCefrLevel;
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  goal_vi: string;
  goal_en: string;
  can_do: Array<{
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  }>;
  learner_traps_vi: string[];
  learner_traps_en: string[];
};

export type PunjabiLearnerRoute = {
  audience: PunjabiPathAudience;
  route_vi: string;
  route_en: string;
  sequence: string[];
  notes_vi: string[];
  notes_en: string[];
};

export type PunjabiCanadaPathEntry = {
  id: string;
  domain: "settlement" | "work" | "health" | "public_service";
  level: PunjabiCefrLevel;
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  practical_goal_vi: string;
  practical_goal_en: string;
  examples: Array<{
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  }>;
  common_trap_vi: string;
  common_trap_en: string;
};

export const PUNJABI_LEARNING_PATH_SCRIPT_NOTE = {
  vi: "Lộ trình này dùng Gurmukhi làm chữ chính. Shahmukhi được nhắc để người học biết có hệ chữ khác, không phải một khóa Shahmukhi đầy đủ.",
  en: "This path uses Gurmukhi as the primary script. Shahmukhi is an awareness note so learners know another script exists, not a full Shahmukhi course.",
};

export const PUNJABI_LEARNING_PATH_WARNINGS = {
  native_review: {
    vi: "Native review được hoãn; không tuyên bố đã có kiểm duyệt bản ngữ.",
    en: "Native review is deferred; no completed native review is claimed.",
  },
  audio: {
    vi: "Không có audio hoặc chấm điểm phát âm trong phạm vi Wave 4.",
    en: "No audio or pronunciation scoring is included in Wave 4 scope.",
  },
};

export const PUNJABI_PATH_STAGES: PunjabiPathStage[] = [
  {
    id: "a1-gurmukhi-survival",
    level: "A1",
    title_pa: "ਗੁਰਮੁਖੀ ਅਤੇ ਪਹਿਲੀ ਗੱਲਬਾਤ",
    romanization: "Gurmukhi ate pahili gallbat",
    title_vi: "Gurmukhi và hội thoại đầu tiên",
    title_en: "Gurmukhi and first conversations",
    goal_vi: "Nhận diện chữ Gurmukhi, chào hỏi, hỏi tên, nói nhu cầu rất cơ bản.",
    goal_en: "Recognize Gurmukhi, greet people, ask names, and state very basic needs.",
    can_do: [
      { gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ।", romanization: "sat sri akal ji", vi: "Xin chào ạ.", en: "Hello, respectfully." },
      { gurmukhi: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।", romanization: "mainu pani chahida hai", vi: "Tôi cần nước.", en: "I need water." },
    ],
    learner_traps_vi: [
      "Đừng học bằng romanization trước quá lâu; hãy nhìn Gurmukhi trước.",
      "Âm bật hơi như ਖ, ਘ, ਧ cần hơi rõ hơn tiếng Việt.",
    ],
    learner_traps_en: [
      "Do not stay dependent on romanization; look at Gurmukhi first.",
      "Aspirated sounds such as ਖ, ਘ, ਧ need audible breath.",
    ],
  },
  {
    id: "a2-daily-services",
    level: "A2",
    title_pa: "ਰੋਜ਼ਾਨਾ ਕੰਮ",
    romanization: "rozana kamm",
    title_vi: "Việc hằng ngày",
    title_en: "Daily tasks",
    goal_vi: "Mua đồ, hỏi đường, đặt lịch, nói thời gian và số lượng.",
    goal_en: "Shop, ask directions, book appointments, and use time and quantities.",
    can_do: [
      { gurmukhi: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?", romanization: "ih kinne da hai?", vi: "Cái này bao nhiêu tiền?", en: "How much is this?" },
      { gurmukhi: "ਕੀ ਅੱਜ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "ki ajj sama mil sakda hai?", vi: "Hôm nay có lịch được không?", en: "Can I get a time today?" },
    ],
    learner_traps_vi: [
      "ਕੀ có thể mở câu hỏi có/không; không phải lúc nào cũng là 'gì'.",
      "Chú ý giống ngữ pháp trong ਚਾਹੀਦਾ / ਚਾਹੀਦੀ.",
    ],
    learner_traps_en: [
      "Ki can mark a yes/no question; it is not always 'what'.",
      "Watch gender agreement in chahida / chahidi.",
    ],
  },
  {
    id: "b1-connected-life",
    level: "B1",
    title_pa: "ਜੁੜੀਆਂ ਹੋਈਆਂ ਗੱਲਾਂ",
    romanization: "jurian hoian gallan",
    title_vi: "Nói nối ý trong đời sống",
    title_en: "Connected everyday speech",
    goal_vi: "Giải thích vấn đề, kể việc đã xảy ra, xử lý trường học, công việc và giấy tờ.",
    goal_en: "Explain problems, narrate past events, and handle school, work, and paperwork.",
    can_do: [
      { gurmukhi: "ਮੇਰਾ ਕੰਮ ਇੱਕ ਦਿਨ ਦੇਰ ਨਾਲ ਹੋਵੇਗਾ।", romanization: "mera kamm ikk din der nal hovega", vi: "Bài của tôi sẽ muộn một ngày.", en: "My work will be one day late." },
      { gurmukhi: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲੋੜੀਂਦੇ ਹਨ?", romanization: "kihre dastavez lorinde han?", vi: "Cần những giấy tờ nào?", en: "Which documents are required?" },
    ],
    learner_traps_vi: [
      "ਕੱਲ੍ਹ có thể là hôm qua hoặc ngày mai; phải dựa vào ngữ cảnh.",
      "Đừng bỏ postposition như ਨੂੰ, ਵਿੱਚ, ਤੋਂ khi câu dài hơn.",
    ],
    learner_traps_en: [
      "Kall can mean yesterday or tomorrow; context decides.",
      "Do not drop postpositions like nu, vich, ton in longer sentences.",
    ],
  },
  {
    id: "b2-practical-argument",
    level: "B2",
    title_pa: "ਵਿਆਖਿਆ ਅਤੇ ਚੋਣ",
    romanization: "viakhia ate chon",
    title_vi: "Giải thích và lựa chọn",
    title_en: "Explanation and choice",
    goal_vi: "Mô tả triệu chứng, so sánh lựa chọn, khiếu nại lịch sự, nêu lý do.",
    goal_en: "Describe symptoms, compare options, complain politely, and give reasons.",
    can_do: [
      { gurmukhi: "ਦੋ ਦਿਨ ਤੋਂ ਬੁਖਾਰ ਅਤੇ ਖੰਘ ਹੈ।", romanization: "do din ton bukhar ate khang hai", vi: "Tôi bị sốt và ho hai ngày rồi.", en: "I have had fever and cough for two days." },
      { gurmukhi: "ਕੀ ਕੋਈ ਹੋਰ ਵਿਕਲਪ ਹੈ?", romanization: "ki koi hor vikalp hai?", vi: "Có lựa chọn nào khác không?", en: "Is there another option?" },
    ],
    learner_traps_vi: [
      "Khi khiếu nại, thêm ਕਿਰਪਾ ਕਰਕੇ hoặc ਜੀ để giảm độ gắt.",
      "Đừng dịch cấu trúc thời gian từ tiếng Việt từng chữ.",
    ],
    learner_traps_en: [
      "When complaining, add kirpa karke or ji to soften tone.",
      "Do not translate English duration patterns word for word.",
    ],
  },
  {
    id: "c1-professional-register",
    level: "C1",
    title_pa: "ਪੇਸ਼ਾਵਰ ਭਾਸ਼ਾ",
    romanization: "peshavar bhasha",
    title_vi: "Văn phong chuyên nghiệp",
    title_en: "Professional register",
    goal_vi: "Thảo luận trong họp, làm mềm bất đồng, viết yêu cầu trang trọng.",
    goal_en: "Discuss in meetings, soften disagreement, and write formal requests.",
    can_do: [
      { gurmukhi: "ਮੇਰੀ ਰਾਏ ਥੋੜ੍ਹੀ ਵੱਖਰੀ ਹੈ।", romanization: "meri rai thorhi vakhri hai", vi: "Ý kiến của tôi hơi khác.", en: "My opinion is slightly different." },
      { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਕਾਰਨ ਦੱਸੋ।", romanization: "kirpa karke apna karan dasso", vi: "Làm ơn nêu lý do của bạn.", en: "Please explain your reason." },
    ],
    learner_traps_vi: [
      "Bất đồng trực tiếp có thể nghe thiếu lịch sự; dùng cụm làm mềm như ਥੋੜ੍ਹੀ.",
      "Giữ nhất quán mức trang trọng trong cả câu.",
    ],
    learner_traps_en: [
      "Direct disagreement can sound blunt; soften with words like thorhi.",
      "Keep the register consistent across the sentence.",
    ],
  },
  {
    id: "c2-nuance-literacy",
    level: "C2",
    title_pa: "ਸੂਖਮ ਅਰਥ ਅਤੇ ਲਿਖਤ",
    romanization: "sukham arth ate likhat",
    title_vi: "Sắc thái và văn bản",
    title_en: "Nuance and literacy",
    goal_vi: "Tóm tắt, tranh luận, đọc văn bản dài, điều chỉnh văn phong theo người nghe.",
    goal_en: "Summarize, debate, read longer texts, and adjust register for the audience.",
    can_do: [
      { gurmukhi: "ਸਾਰ ਇਹ ਹੈ ਕਿ ਫੈਸਲਾ ਅਜੇ ਬਾਕੀ ਹੈ।", romanization: "sar ih hai ki faisla aje baki hai", vi: "Tóm lại là quyết định vẫn còn chờ.", en: "The summary is that the decision is still pending." },
      { gurmukhi: "ਇਸ ਮਾਮਲੇ ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਕਰੀਏ।", romanization: "is mamle nu hor spasht kariye", vi: "Hãy làm rõ thêm vấn đề này.", en: "Let us clarify this matter further." },
    ],
    learner_traps_vi: [
      "C2 ở đây là mục tiêu học tập nội bộ, không phải chứng chỉ chính thức.",
      "Sắc thái vùng miền cần kiểm duyệt thêm; native review vẫn hoãn.",
    ],
    learner_traps_en: [
      "C2 here is an internal learning target, not official certification.",
      "Regional nuance needs deeper review; native review remains deferred.",
    ],
  },
];

export const PUNJABI_LEARNER_ROUTES: PunjabiLearnerRoute[] = [
  {
    audience: "vi",
    route_vi: "Lộ trình cho người nói tiếng Việt",
    route_en: "Route for Vietnamese-speaking learners",
    sequence: [
      "a1-gurmukhi-survival",
      "a2-daily-services",
      "b1-connected-life",
      "b2-practical-argument",
      "c1-professional-register",
      "c2-nuance-literacy",
    ],
    notes_vi: [
      "Tận dụng việc tiếng Việt đã có thanh điệu, nhưng đừng giả định thanh Punjabi giống tiếng Việt.",
      "Ưu tiên Gurmukhi từ ngày đầu để tránh đọc Punjabi như chữ Latin.",
    ],
    notes_en: [
      "Vietnamese speakers can leverage tone awareness, but Punjabi tone is not the same as Vietnamese tone.",
      "Front-load Gurmukhi from day one to avoid reading Punjabi through Latin spelling.",
    ],
  },
  {
    audience: "en",
    route_vi: "Lộ trình cho người nói tiếng Anh",
    route_en: "Route for English-speaking learners",
    sequence: [
      "a1-gurmukhi-survival",
      "a2-daily-services",
      "b1-connected-life",
      "b2-practical-argument",
      "c1-professional-register",
      "c2-nuance-literacy",
    ],
    notes_vi: [
      "Người nói tiếng Anh cần chú ý âm bật hơi, phụ âm quặt lưỡi và nguyên âm không giảm âm quá mức.",
      "Dùng romanization như cầu nối ngắn hạn, rồi chuyển sang Gurmukhi.",
    ],
    notes_en: [
      "English speakers should focus on aspiration, retroflex consonants, and avoiding over-reduced vowels.",
      "Use romanization as a short bridge, then move into Gurmukhi.",
    ],
  },
];

export const PUNJABI_CANADA_PRACTICAL_PATH: PunjabiCanadaPathEntry[] = [
  {
    id: "canada-settlement-address",
    domain: "settlement",
    level: "A2",
    title_pa: "ਪਤਾ ਅਤੇ ਪਰਿਵਾਰ",
    romanization: "pata ate parivar",
    title_vi: "Địa chỉ và gia đình",
    title_en: "Address and family",
    practical_goal_vi: "Nói địa chỉ, số điện thoại, người liên hệ khi mới định cư ở Canada.",
    practical_goal_en: "State address, phone number, and contact person when settling in Canada.",
    examples: [
      { gurmukhi: "ਮੇਰਾ ਪਤਾ ਇਹ ਹੈ।", romanization: "mera pata ih hai", vi: "Địa chỉ của tôi là đây.", en: "This is my address." },
      { gurmukhi: "ਇਹ ਮੇਰਾ ਫੋਨ ਨੰਬਰ ਹੈ।", romanization: "ih mera phone number hai", vi: "Đây là số điện thoại của tôi.", en: "This is my phone number." },
    ],
    common_trap_vi: "ਪਤਾ là địa chỉ; đừng nhầm với ਪਿਤਾ là bố.",
    common_trap_en: "Pata means address; do not confuse it with pita, father.",
  },
  {
    id: "canada-work-schedule",
    domain: "work",
    level: "B1",
    title_pa: "ਕੰਮ ਦਾ ਸਮਾਂ",
    romanization: "kamm da sama",
    title_vi: "Lịch làm việc",
    title_en: "Work schedule",
    practical_goal_vi: "Hỏi ca làm, hạn chót, ngày nghỉ và thay đổi lịch.",
    practical_goal_en: "Ask about shifts, deadlines, days off, and schedule changes.",
    examples: [
      { gurmukhi: "ਮੇਰੀ ਸ਼ਿਫਟ ਕਿੰਨੇ ਵਜੇ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ?", romanization: "meri shift kinne vaje shuru hundi hai", vi: "Ca của tôi bắt đầu lúc mấy giờ?", en: "What time does my shift start?" },
      { gurmukhi: "ਕੀ ਮੈਂ ਕੱਲ੍ਹ ਛੁੱਟੀ ਲੈ ਸਕਦਾ ਹਾਂ?", romanization: "ki main kall chhutti lai sakda han", vi: "Ngày mai tôi có thể xin nghỉ không?", en: "Can I take tomorrow off?" },
    ],
    common_trap_vi: "ਕੱਲ੍ਹ có thể là hôm qua hoặc ngày mai; trong lịch làm việc phải xác nhận ngày cụ thể.",
    common_trap_en: "Kall can mean yesterday or tomorrow; confirm the exact date in work scheduling.",
  },
  {
    id: "canada-health-clinic",
    domain: "health",
    level: "B2",
    title_pa: "ਕਲੀਨਿਕ ਵਿੱਚ",
    romanization: "clinic vich",
    title_vi: "Ở phòng khám",
    title_en: "At the clinic",
    practical_goal_vi: "Mô tả triệu chứng, thời gian bị bệnh, thuốc đang dùng.",
    practical_goal_en: "Describe symptoms, duration, and current medicine.",
    examples: [
      { gurmukhi: "ਮੈਨੂੰ ਦੋ ਦਿਨ ਤੋਂ ਬੁਖਾਰ ਹੈ।", romanization: "mainu do din ton bukhar hai", vi: "Tôi bị sốt hai ngày rồi.", en: "I have had a fever for two days." },
      { gurmukhi: "ਮੈਂ ਇਹ ਦਵਾਈ ਲੈ ਰਿਹਾ ਹਾਂ।", romanization: "main ih davai lai riha han", vi: "Tôi đang dùng thuốc này.", en: "I am taking this medicine." },
    ],
    common_trap_vi: "ਦਵਾਈ là thuốc; hãy mang theo tên thuốc bằng văn bản nếu có thể.",
    common_trap_en: "Davai means medicine; bring the written medicine name when possible.",
  },
  {
    id: "canada-public-service-documents",
    domain: "public_service",
    level: "B1",
    title_pa: "ਸਰਕਾਰੀ ਦਫ਼ਤਰ",
    romanization: "sarkari daftar",
    title_vi: "Văn phòng dịch vụ công",
    title_en: "Public-service office",
    practical_goal_vi: "Hỏi giấy tờ cần thiết, ký mẫu đơn, yêu cầu giải thích quyết định.",
    practical_goal_en: "Ask about required documents, sign forms, and request explanations.",
    examples: [
      { gurmukhi: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲੋੜੀਂਦੇ ਹਨ?", romanization: "kihre dastavez lorinde han", vi: "Cần những giấy tờ nào?", en: "Which documents are required?" },
      { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਫੈਸਲੇ ਦਾ ਕਾਰਨ ਸਮਝਾਓ।", romanization: "kirpa karke faisle da karan samjhao", vi: "Làm ơn giải thích lý do của quyết định.", en: "Please explain the reason for the decision." },
    ],
    common_trap_vi: "Dùng ਕਿਰਪਾ ਕਰਕੇ để yêu cầu lịch sự trong môi trường công quyền.",
    common_trap_en: "Use kirpa karke for polite requests in public-service settings.",
  },
];

export const PUNJABI_LEARNING_PATH = {
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  script_note: PUNJABI_LEARNING_PATH_SCRIPT_NOTE,
  warnings: PUNJABI_LEARNING_PATH_WARNINGS,
  stages: PUNJABI_PATH_STAGES,
  learner_routes: PUNJABI_LEARNER_ROUTES,
  canada_practical_path: PUNJABI_CANADA_PRACTICAL_PATH,
} as const;

export default PUNJABI_LEARNING_PATH;
