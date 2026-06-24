// src/languages/punjabi/finalCanDoIndex.ts
//
// Wave 12 final can-do index for Punjabi. This is not A11 integration.
// Gurmukhi is primary; native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiCanDoDomain =
  | "script"
  | "vocabulary"
  | "grammar"
  | "reading"
  | "writing"
  | "text_speaking_prompt"
  | "survival"
  | "workplace"
  | "healthcare"
  | "public_service"
  | "remediation";

export type PunjabiCanDoStatus = "ready" | "checkpoint" | "deferred";

export type PunjabiCanDoItem = {
  id: string;
  level: PunjabiCefrLevel;
  domain: PunjabiCanDoDomain;
  status: PunjabiCanDoStatus;
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  can_do_vi: string;
  can_do_en: string;
  evidence_vi: string;
  evidence_en: string;
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
  canada_practical?: string;
  linked_modules: string[];
};

export const PUNJABI_FINAL_CAN_DO_SCOPE = {
  wave: "Wave 12",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  script_note_vi:
    "Can-do index này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết, không phải khóa đầy đủ.",
  script_note_en:
    "This can-do index uses Gurmukhi as the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã có kiểm duyệt bản ngữ.",
  native_review_en: "Native review is deferred; completed native review is not claimed.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
};

export const PUNJABI_FINAL_CAN_DO_DOMAINS: PunjabiCanDoDomain[] = [
  "script",
  "vocabulary",
  "grammar",
  "reading",
  "writing",
  "text_speaking_prompt",
  "survival",
  "workplace",
  "healthcare",
  "public_service",
  "remediation",
];

export const PUNJABI_FINAL_CAN_DO_INDEX: PunjabiCanDoItem[] = [
  {
    id: "a1-gurmukhi-script",
    level: "A1",
    domain: "script",
    status: "ready",
    title_pa: "ਗੁਰਮੁਖੀ ਪਛਾਣ",
    romanization: "Gurmukhi pachhan",
    title_vi: "Nhận diện Gurmukhi",
    title_en: "Recognize Gurmukhi",
    can_do_vi: "Tôi có thể nhận ra chữ Punjabi cơ bản bằng Gurmukhi trước khi nhìn romanization.",
    can_do_en: "I can recognize basic Punjabi in Gurmukhi before looking at romanization.",
    evidence_vi: "Đọc tên ngôn ngữ, lời chào và marker lịch sự trong Gurmukhi.",
    evidence_en: "Reads the language name, greetings, and politeness marker in Gurmukhi.",
    sample: { gurmukhi: "ਪੰਜਾਬੀ", romanization: "Punjabi", vi: "tiếng Punjabi", en: "Punjabi" },
    checkpoint_vi: "Nhìn Gurmukhi trước, romanization chỉ hỗ trợ.",
    checkpoint_en: "Look at Gurmukhi first; romanization is support only.",
    learner_trap_vi: "Đừng học pa/ba/pha chỉ bằng chữ Latin vì sẽ lẫn âm bật hơi.",
    learner_trap_en: "Do not learn pa/ba/pha only through Latin letters because aspiration gets blurred.",
    linked_modules: ["foundation-core", "course-navigation-map"],
  },
  {
    id: "a1-survival-greeting",
    level: "A1",
    domain: "survival",
    status: "ready",
    title_pa: "ਨਮਸਕਾਰ ਅਤੇ ਨਮਰਤਾ",
    romanization: "namaskar ate namarta",
    title_vi: "Chào hỏi lịch sự",
    title_en: "Polite greeting",
    can_do_vi: "Tôi có thể chào, cảm ơn và thêm ਜੀ trong tình huống hằng ngày.",
    can_do_en: "I can greet, thank, and add ji in everyday situations.",
    evidence_vi: "Tạo được câu ngắn có kính ngữ khi gặp hàng xóm, quầy dịch vụ hoặc lớp học.",
    evidence_en: "Produces a short respectful sentence with a neighbor, service desk, or class.",
    sample: { gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ।", romanization: "sat sri akal ji", vi: "Xin chào ạ.", en: "Hello, respectfully." },
    checkpoint_vi: "Dùng ਜੀ khi cần lịch sự, không thêm vào mọi câu máy móc.",
    checkpoint_en: "Use ji when respect is needed, not mechanically in every sentence.",
    canada_practical: "Greeting a Punjabi-speaking neighbor, cashier, or community worker in Canada.",
    linked_modules: ["foundation-core", "dialogue-roleplay"],
  },
  {
    id: "a2-settlement-vocabulary",
    level: "A2",
    domain: "vocabulary",
    status: "checkpoint",
    title_pa: "ਪਤਾ ਅਤੇ ਫੋਨ ਨੰਬਰ",
    romanization: "pata ate phone number",
    title_vi: "Địa chỉ và số điện thoại",
    title_en: "Address and phone number",
    can_do_vi: "Tôi có thể cung cấp địa chỉ, số điện thoại và thông tin cá nhân cơ bản.",
    can_do_en: "I can give an address, phone number, and basic personal information.",
    evidence_vi: "Điền hoặc nói thông tin định cư đơn giản bằng cụm đã học.",
    evidence_en: "Fills in or says simple settlement information using learned phrases.",
    sample: { gurmukhi: "ਇਹ ਮੇਰਾ ਫੋਨ ਨੰਬਰ ਹੈ।", romanization: "ih mera phone number hai", vi: "Đây là số điện thoại của tôi.", en: "This is my phone number." },
    checkpoint_vi: "Phân biệt ਪਤਾ là địa chỉ với ਪਿਤਾ là cha.",
    checkpoint_en: "Distinguish pata, address, from pita, father.",
    learner_trap_vi: "Số điện thoại cần đọc chậm theo nhóm, không đọc quá nhanh.",
    learner_trap_en: "Phone numbers should be read slowly in groups, not rushed.",
    canada_practical: "Settlement forms, school contact sheets, clinic intake, and service counters.",
    linked_modules: ["learning-path-foundation", "progression-matrix"],
  },
  {
    id: "a2-practical-grammar",
    level: "A2",
    domain: "grammar",
    status: "checkpoint",
    title_pa: "ਸਧਾਰਨ ਪ੍ਰਸ਼ਨ",
    romanization: "sadharan prashan",
    title_vi: "Câu hỏi đơn giản",
    title_en: "Simple questions",
    can_do_vi: "Tôi có thể đặt câu hỏi có ਕੀ, ਕਿੱਥੇ, ਕਦੋਂ cho lịch hẹn và thông tin.",
    can_do_en: "I can ask ki, kithe, kadon questions for appointments and information.",
    evidence_vi: "Chuyển một câu khẳng định thành câu hỏi ngắn, lịch sự.",
    evidence_en: "Turns a statement into a short, polite question.",
    sample: { gurmukhi: "ਕੀ ਅੱਜ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "ki aj sama mil sakda hai?", vi: "Hôm nay có thể có thời gian không?", en: "Is time available today?" },
    checkpoint_vi: "Đặt ਕੀ đầu câu cho câu hỏi yes/no.",
    checkpoint_en: "Place ki at the start for yes/no questions.",
    learner_trap_vi: "Đừng dịch từng chữ từ tiếng Việt hoặc tiếng Anh khi hỏi giờ hẹn.",
    learner_trap_en: "Do not translate word by word from Vietnamese or English when asking about appointments.",
    canada_practical: "Booking a community appointment or asking for an available time.",
    linked_modules: ["progression-matrix", "mastery-checkpoints"],
  },
  {
    id: "b1-reading-notice",
    level: "B1",
    domain: "reading",
    status: "checkpoint",
    title_pa: "ਸੂਚਨਾ ਪੜ੍ਹਨਾ",
    romanization: "suchna parhna",
    title_vi: "Đọc thông báo",
    title_en: "Read a notice",
    can_do_vi: "Tôi có thể đọc thông báo ngắn và tìm thời gian, địa điểm, yêu cầu chính.",
    can_do_en: "I can read a short notice and find the time, place, and main requirement.",
    evidence_vi: "Tóm tắt một thông báo lớp học, dịch vụ cộng đồng hoặc lịch hẹn.",
    evidence_en: "Summarizes a class, community-service, or appointment notice.",
    sample: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਫਿਰ ਦੱਸੋ।", romanization: "kirpa karke fir dasso", vi: "Xin vui lòng nói lại.", en: "Please say that again." },
    checkpoint_vi: "Tìm từ khóa trước khi dịch cả đoạn.",
    checkpoint_en: "Find keywords before translating the whole passage.",
    learner_trap_vi: "ਕਿਰਪਾ ਕਰਕੇ là cụm lịch sự, không phải phần nội dung chính của thông báo.",
    learner_trap_en: "Kirpa karke is a politeness phrase, not the main content of the notice.",
    canada_practical: "Reading community center, school, transit, or appointment notices.",
    linked_modules: ["content-index", "mastery-checkpoints"],
  },
  {
    id: "b1-workplace-shift",
    level: "B1",
    domain: "workplace",
    status: "ready",
    title_pa: "ਸ਼ਿਫਟ ਬਾਰੇ ਪੁੱਛਣਾ",
    romanization: "shift bare puchhna",
    title_vi: "Hỏi về ca làm",
    title_en: "Ask about a shift",
    can_do_vi: "Tôi có thể hỏi giờ bắt đầu, nhiệm vụ và thay đổi ca làm bằng câu lịch sự.",
    can_do_en: "I can ask about start time, tasks, and shift changes with polite wording.",
    evidence_vi: "Viết hoặc chọn câu đúng cho quản lý, đồng nghiệp hoặc lịch làm.",
    evidence_en: "Writes or selects a suitable sentence for a manager, coworker, or schedule.",
    sample: { gurmukhi: "ਮੇਰੀ ਸ਼ਿਫਟ ਕਿੰਨੇ ਵਜੇ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ?", romanization: "meri shift kinne vaje shuru hundi hai?", vi: "Ca của tôi bắt đầu lúc mấy giờ?", en: "What time does my shift start?" },
    checkpoint_vi: "Dùng ਮੇਰੀ cho ca của tôi; tránh lẫn với ਮੇਰਾ khi danh từ giống cái.",
    checkpoint_en: "Use meri for my shift; avoid mixing it with mera for a feminine noun.",
    learner_trap_vi: "ਸ਼ਿਫਟ là mượn từ; vẫn cần cấu trúc Punjabi quanh nó.",
    learner_trap_en: "Shift is a loanword; it still needs Punjabi structure around it.",
    canada_practical: "Retail, warehouse, restaurant, childcare, and community workplace schedules.",
    linked_modules: ["dialogue-roleplay", "learning-path-foundation", "progression-matrix"],
  },
  {
    id: "b1-public-service-documents",
    level: "B1",
    domain: "public_service",
    status: "checkpoint",
    title_pa: "ਦਸਤਾਵੇਜ਼ ਪੁੱਛਣਾ",
    romanization: "dastavez puchhna",
    title_vi: "Hỏi giấy tờ cần thiết",
    title_en: "Ask about required documents",
    can_do_vi: "Tôi có thể hỏi giấy tờ nào cần thiết cho dịch vụ công hoặc hồ sơ.",
    can_do_en: "I can ask which documents are required for a public service or file.",
    evidence_vi: "Chọn được câu hỏi phù hợp và nhận ra từ liên quan đến giấy tờ.",
    evidence_en: "Chooses a suitable question and recognizes document-related vocabulary.",
    sample: { gurmukhi: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲੋੜੀਂਦੇ ਹਨ?", romanization: "kihre dastavez lorinde han?", vi: "Cần những giấy tờ nào?", en: "Which documents are required?" },
    checkpoint_vi: "Phân biệt ਕਿਹੜੇ cho lựa chọn với ਕਿੱਥੇ cho địa điểm.",
    checkpoint_en: "Distinguish kihre for which choices from kithe for where.",
    canada_practical: "Public service counters, settlement agencies, school offices, and municipal forms.",
    linked_modules: ["dialogue-roleplay", "content-index", "integration-readiness"],
  },
  {
    id: "b2-healthcare-symptom",
    level: "B2",
    domain: "healthcare",
    status: "ready",
    title_pa: "ਲੱਛਣ ਸਮਝਾਉਣਾ",
    romanization: "lachhan samjhauna",
    title_vi: "Giải thích triệu chứng",
    title_en: "Explain symptoms",
    can_do_vi: "Tôi có thể mô tả triệu chứng, thời gian kéo dài và mức độ cơ bản.",
    can_do_en: "I can describe symptoms, duration, and basic severity.",
    evidence_vi: "Tạo câu có triệu chứng cộng thời gian, không thay thế tư vấn y tế.",
    evidence_en: "Creates a symptom-plus-duration sentence without replacing medical advice.",
    sample: { gurmukhi: "ਮੈਨੂੰ ਦੋ ਦਿਨ ਤੋਂ ਬੁਖਾਰ ਹੈ।", romanization: "mainu do din ton bukhar hai", vi: "Tôi bị sốt hai ngày rồi.", en: "I have had a fever for two days." },
    checkpoint_vi: "Dùng ਤੋਂ cho khoảng thời gian kéo dài từ một mốc.",
    checkpoint_en: "Use ton for duration from a point in time.",
    learner_trap_vi: "Đừng dùng câu học ngôn ngữ như chẩn đoán y khoa.",
    learner_trap_en: "Do not use a language-learning sentence as a medical diagnosis.",
    canada_practical: "Clinic intake, pharmacy questions, telehealth notes, and family doctor visits.",
    linked_modules: ["dialogue-roleplay", "mastery-checkpoints", "content-index"],
  },
  {
    id: "b2-text-speaking-choice",
    level: "B2",
    domain: "text_speaking_prompt",
    status: "deferred",
    title_pa: "ਟੈਕਸਟ ਗੱਲਬਾਤ ਪ੍ਰੌਮਪਟ",
    romanization: "text gallbat prompt",
    title_vi: "Prompt nói dạng văn bản",
    title_en: "Text speaking prompt",
    can_do_vi: "Tôi có thể chuẩn bị câu trả lời hội thoại bằng văn bản, không ghi âm và không chấm phát âm.",
    can_do_en: "I can prepare a conversation response in text, with no recording and no pronunciation scoring.",
    evidence_vi: "Viết câu lựa chọn, đồng ý, từ chối hoặc xin lựa chọn khác trong roleplay text-only.",
    evidence_en: "Writes a choice, agreement, refusal, or request for another option in a text-only roleplay.",
    sample: { gurmukhi: "ਕੀ ਕੋਈ ਹੋਰ ਵਿਕਲਪ ਹੈ?", romanization: "ki koi hor vikalp hai?", vi: "Có lựa chọn nào khác không?", en: "Is there another option?" },
    checkpoint_vi: "Đánh giá ý nghĩa và register trong text; native review vẫn hoãn.",
    checkpoint_en: "Evaluate meaning and register in text; native review remains deferred.",
    learner_trap_vi: "Text speaking prompt không phải audio, microphone, hoặc pronunciation scoring.",
    learner_trap_en: "A text speaking prompt is not audio, microphone use, or pronunciation scoring.",
    canada_practical: "Practicing service-counter, workplace, clinic, and school conversations as text.",
    linked_modules: ["mastery-checkpoints", "course-navigation-map"],
  },
  {
    id: "c1-formal-writing",
    level: "C1",
    domain: "writing",
    status: "checkpoint",
    title_pa: "ਰਸਮੀ ਲਿਖਤ",
    romanization: "rasmi likhat",
    title_vi: "Viết trang trọng",
    title_en: "Formal writing",
    can_do_vi: "Tôi có thể viết yêu cầu hoặc giải thích ngắn với register trang trọng và rõ lý do.",
    can_do_en: "I can write a short request or explanation with formal register and a clear reason.",
    evidence_vi: "Viết một đoạn ngắn có lời yêu cầu, lý do và câu kết lịch sự.",
    evidence_en: "Writes a short paragraph with a request, reason, and polite close.",
    sample: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਕਾਰਨ ਦੱਸੋ।", romanization: "kirpa karke apna karan dasso", vi: "Xin vui lòng cho biết lý do của quý vị.", en: "Please state your reason." },
    checkpoint_vi: "Giữ câu ngắn; ưu tiên rõ ràng hơn câu dài phức tạp.",
    checkpoint_en: "Keep sentences short; prefer clarity over long complex sentences.",
    learner_trap_vi: "ਆਪਣਾ đổi theo chủ thể; không tự động nghĩa là của tôi.",
    learner_trap_en: "Apna follows the subject; it does not automatically mean my.",
    canada_practical: "Email to a school, employer, housing office, or public-service desk.",
    linked_modules: ["content-index", "pre-integration-coverage"],
  },
  {
    id: "c1-public-decision-reading",
    level: "C1",
    domain: "reading",
    status: "checkpoint",
    title_pa: "ਫੈਸਲੇ ਦਾ ਕਾਰਨ",
    romanization: "faisle da karan",
    title_vi: "Lý do của quyết định",
    title_en: "Reason for a decision",
    can_do_vi: "Tôi có thể đọc thư quyết định và xác định lý do, yêu cầu tiếp theo, hạn chót.",
    can_do_en: "I can read a decision letter and identify the reason, next requirement, and deadline.",
    evidence_vi: "Gạch ra lý do, hành động cần làm và câu hỏi cần hỏi tiếp.",
    evidence_en: "Extracts the reason, required action, and follow-up question.",
    sample: { gurmukhi: "ਕੀ ਤੁਸੀਂ ਫੈਸਲੇ ਦਾ ਕਾਰਨ ਸਮਝਾ ਸਕਦੇ ਹੋ?", romanization: "ki tusin faisle da karan samjha sakde ho?", vi: "Quý vị có thể giải thích lý do của quyết định không?", en: "Can you explain the reason for the decision?" },
    checkpoint_vi: "Phân biệt ਕਾਰਨ là lý do với việc suy đoán cảm xúc của người viết.",
    checkpoint_en: "Distinguish karan, reason, from guessing the writer's feelings.",
    canada_practical: "School, workplace, housing, immigration-adjacent service, and municipal letters.",
    linked_modules: ["pre-integration-coverage", "integration-readiness"],
  },
  {
    id: "c2-summary-reading",
    level: "C2",
    domain: "reading",
    status: "ready",
    title_pa: "ਸਾਰ ਕੱਢਣਾ",
    romanization: "sar kadhna",
    title_vi: "Rút ra tóm tắt",
    title_en: "Extract a summary",
    can_do_vi: "Tôi có thể tóm tắt ý chính và trạng thái của một văn bản phức tạp.",
    can_do_en: "I can summarize the main point and status of a complex text.",
    evidence_vi: "Viết tóm tắt ngắn có kết luận, điều chưa chắc chắn và bước tiếp theo.",
    evidence_en: "Writes a short summary with conclusion, uncertainty, and next step.",
    sample: { gurmukhi: "ਸਾਰ ਇਹ ਹੈ ਕਿ ਫੈਸਲਾ ਅਜੇ ਬਾਕੀ ਹੈ।", romanization: "sar ih hai ki faisla aje baki hai", vi: "Tóm lại là quyết định vẫn còn đang chờ.", en: "The summary is that the decision is still pending." },
    checkpoint_vi: "Tách sự kiện khỏi suy luận khi tóm tắt văn bản dài.",
    checkpoint_en: "Separate facts from inference when summarizing a long text.",
    learner_trap_vi: "ਅਜੇ ਬਾਕੀ ਹੈ là vẫn còn pending, không phải đã bị từ chối.",
    learner_trap_en: "Aje baki hai means still pending, not rejected.",
    canada_practical: "Summarizing complex notices, policy pages, or case updates for personal planning.",
    linked_modules: ["pre-integration-coverage", "finalModuleRegistry"],
  },
  {
    id: "c2-nuanced-writing",
    level: "C2",
    domain: "writing",
    status: "checkpoint",
    title_pa: "ਸਪਸ਼ਟਤਾ ਅਤੇ ਨੁਅੰਸ",
    romanization: "spashtata ate nuance",
    title_vi: "Rõ ràng và sắc thái",
    title_en: "Clarity and nuance",
    can_do_vi: "Tôi có thể viết lại câu để giảm mơ hồ và giữ thái độ hợp tác.",
    can_do_en: "I can rewrite a sentence to reduce ambiguity and keep a cooperative tone.",
    evidence_vi: "Chỉnh một câu dài thành phiên bản rõ hơn, lịch sự hơn, không quá mạnh.",
    evidence_en: "Revises a long sentence into a clearer, more polite, less forceful version.",
    sample: { gurmukhi: "ਇਸ ਮਾਮਲੇ ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਕਰੀਏ।", romanization: "is mamle nu hor spasht kariye", vi: "Hãy làm rõ thêm vấn đề này.", en: "Let us clarify this matter further." },
    checkpoint_vi: "Dùng ਕਰੀਏ để đề xuất cùng làm, không ra lệnh trực tiếp.",
    checkpoint_en: "Use kariye to suggest doing something together, not to issue a direct command.",
    canada_practical: "Professional emails, service follow-ups, housing messages, and school communication.",
    linked_modules: ["pre-integration-coverage", "finalModuleRegistry"],
  },
  {
    id: "b2-remediation-politeness",
    level: "B2",
    domain: "remediation",
    status: "deferred",
    title_pa: "ਨਮਰਤਾ ਦੀ ਮੁਰੰਮਤ",
    romanization: "namarta di murammat",
    title_vi: "Sửa lỗi lịch sự",
    title_en: "Politeness remediation",
    can_do_vi: "Tôi có thể nhận ra câu đúng nghĩa nhưng thiếu lịch sự và sửa bằng marker phù hợp.",
    can_do_en: "I can notice a meaningful but impolite sentence and repair it with suitable markers.",
    evidence_vi: "So sánh câu thô với câu có ਕਿਰਪਾ ਕਰਕੇ, ਜੀ, hoặc wording nhẹ hơn.",
    evidence_en: "Compares a blunt sentence with one using kirpa karke, ji, or softer wording.",
    sample: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਦੁਬਾਰਾ ਲਿਖੋ।", romanization: "kirpa karke ih dubara likho", vi: "Xin vui lòng viết lại điều này.", en: "Please write this again." },
    checkpoint_vi: "Remediation là readiness nội dung, không phải native review hoàn tất.",
    checkpoint_en: "Remediation is content readiness, not completed native review.",
    learner_trap_vi: "Lịch sự không chỉ là thêm ਇੱਕ từ; còn là register và ngữ cảnh.",
    learner_trap_en: "Politeness is not just adding one word; it also depends on register and context.",
    linked_modules: ["mastery-checkpoints", "integration-readiness", "pre-integration-coverage"],
  },
];

export const PUNJABI_FINAL_CAN_DO_ROUTES = [
  {
    id: "new-learner-readiness",
    vi: "Người mới: script -> survival -> vocabulary -> grammar -> reading.",
    en: "New learner: script -> survival -> vocabulary -> grammar -> reading.",
    item_ids: ["a1-gurmukhi-script", "a1-survival-greeting", "a2-settlement-vocabulary", "a2-practical-grammar", "b1-reading-notice"],
  },
  {
    id: "canada-practical-readiness",
    vi: "Canada-practical: settlement vocabulary -> workplace -> public service -> healthcare -> formal writing.",
    en: "Canada-practical: settlement vocabulary -> workplace -> public service -> healthcare -> formal writing.",
    item_ids: ["a2-settlement-vocabulary", "b1-workplace-shift", "b1-public-service-documents", "b2-healthcare-symptom", "c1-formal-writing"],
  },
  {
    id: "advanced-readiness",
    vi: "Nâng cao: public decision reading -> summary reading -> nuanced writing -> remediation boundary.",
    en: "Advanced: public decision reading -> summary reading -> nuanced writing -> remediation boundary.",
    item_ids: ["c1-public-decision-reading", "c2-summary-reading", "c2-nuanced-writing", "b2-remediation-politeness"],
  },
];

export const PUNJABI_FINAL_CAN_DO_INDEX_ROOT = {
  scope: PUNJABI_FINAL_CAN_DO_SCOPE,
  domains: PUNJABI_FINAL_CAN_DO_DOMAINS,
  items: PUNJABI_FINAL_CAN_DO_INDEX,
  routes: PUNJABI_FINAL_CAN_DO_ROUTES,
} as const;

export default PUNJABI_FINAL_CAN_DO_INDEX_ROOT;
