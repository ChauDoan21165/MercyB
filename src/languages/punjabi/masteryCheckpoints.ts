// src/languages/punjabi/masteryCheckpoints.ts
//
// Punjabi mastery checkpoints across A1-C2. Text-only and Gurmukhi-first;
// native review is deferred, with no audio or pronunciation scoring.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiMasteryDomain =
  | "script"
  | "vocabulary"
  | "grammar"
  | "speaking_prompt"
  | "reading"
  | "writing"
  | "survival"
  | "workplace"
  | "healthcare"
  | "public_service";

export type PunjabiMasteryExample = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiMasteryCheckpoint = {
  id: string;
  level: PunjabiCefrLevel;
  domain: PunjabiMasteryDomain;
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  readiness_vi: string;
  readiness_en: string;
  evidence_vi: string;
  evidence_en: string;
  prompt: PunjabiMasteryExample;
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: boolean;
};

export const PUNJABI_MASTERY_DOMAINS: PunjabiMasteryDomain[] = [
  "script",
  "vocabulary",
  "grammar",
  "speaking_prompt",
  "reading",
  "writing",
  "survival",
  "workplace",
  "healthcare",
  "public_service",
];

export const PUNJABI_MASTERY_SCOPE = {
  script_note_vi:
    "Các checkpoint dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết, không phải một khóa học đầy đủ.",
  script_note_en:
    "These checkpoints use Gurmukhi as the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã có kiểm duyệt bản ngữ.",
  native_review_en: "Native review is deferred; completed native review is not claimed.",
  audio_vi: "Không có audio, ghi âm, hoặc chấm điểm phát âm trong Wave 6.",
  audio_en: "Wave 6 has no audio, recording, or pronunciation scoring.",
};

export const PUNJABI_MASTERY_CHECKPOINTS: PunjabiMasteryCheckpoint[] = [
  {
    id: "a1-script-greeting",
    level: "A1",
    domain: "script",
    title_pa: "ਗੁਰਮੁਖੀ ਪਛਾਣ",
    romanization: "Gurmukhi pachhan",
    title_vi: "Nhận diện Gurmukhi",
    title_en: "Gurmukhi recognition",
    readiness_vi: "Nhận ra từ chào hỏi quen thuộc trước khi nhìn romanization.",
    readiness_en: "Recognize familiar greeting words before looking at romanization.",
    evidence_vi: "Đọc đúng ý 10-20 mục Gurmukhi đã học.",
    evidence_en: "Read the meaning of 10-20 learned Gurmukhi items.",
    prompt: { gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ।", romanization: "sat sri akal ji", vi: "Xin chào ạ.", en: "Hello, respectfully." },
    learner_trap_vi: "Đừng nhìn romanization trước; hãy để Gurmukhi dẫn đường.",
    learner_trap_en: "Do not look at romanization first; let Gurmukhi lead.",
  },
  {
    id: "a1-survival-need",
    level: "A1",
    domain: "survival",
    title_pa: "ਜ਼ਰੂਰੀ ਲੋੜ",
    romanization: "zaruri lor",
    title_vi: "Nhu cầu sống còn",
    title_en: "Essential need",
    readiness_vi: "Nói nhu cầu nước, giúp đỡ, giá tiền bằng câu rất ngắn.",
    readiness_en: "State needs for water, help, and prices with very short sentences.",
    evidence_vi: "Hoàn thành hội thoại một lượt ở cửa hàng hoặc lớp học.",
    evidence_en: "Complete a one-turn exchange in a shop or classroom.",
    prompt: { gurmukhi: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।", romanization: "mainu pani chahida hai", vi: "Tôi cần nước.", en: "I need water." },
    learner_trap_vi: "ਮੈਨੂੰ dùng cho 'cho tôi/tôi cần', không thay bằng ਮੈਂ.",
    learner_trap_en: "Use mainu for 'to me/I need', not main.",
    canada_practical: true,
  },
  {
    id: "a2-vocabulary-address",
    level: "A2",
    domain: "vocabulary",
    title_pa: "ਪਤਾ ਅਤੇ ਨੰਬਰ",
    romanization: "pata ate number",
    title_vi: "Địa chỉ và số điện thoại",
    title_en: "Address and phone number",
    readiness_vi: "Nói địa chỉ, số điện thoại, tên người liên hệ trong bối cảnh định cư Canada.",
    readiness_en: "State address, phone number, and contact person in a Canada settlement context.",
    evidence_vi: "Điền và đọc lại thông tin cá nhân cơ bản.",
    evidence_en: "Fill and read back basic personal information.",
    prompt: { gurmukhi: "ਇਹ ਮੇਰਾ ਫੋਨ ਨੰਬਰ ਹੈ।", romanization: "ih mera phone number hai", vi: "Đây là số điện thoại của tôi.", en: "This is my phone number." },
    learner_trap_vi: "ਪਤਾ là địa chỉ; đừng nhầm với ਪਿਤਾ là bố.",
    learner_trap_en: "Pata means address; do not confuse it with pita, father.",
    canada_practical: true,
  },
  {
    id: "a2-healthcare-appointment",
    level: "A2",
    domain: "healthcare",
    title_pa: "ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ",
    romanization: "mulakat da sama",
    title_vi: "Lịch hẹn khám",
    title_en: "Clinic appointment",
    readiness_vi: "Hỏi lịch hẹn hôm nay/ngày mai và hiểu giờ hẹn.",
    readiness_en: "Ask for a today/tomorrow appointment and understand the time.",
    evidence_vi: "Đặt được lịch hẹn đơn giản bằng text prompt.",
    evidence_en: "Book a simple appointment through a text prompt.",
    prompt: { gurmukhi: "ਕੀ ਅੱਜ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "ki ajj sama mil sakda hai?", vi: "Hôm nay có lịch được không?", en: "Can I get a time today?" },
    learner_trap_vi: "ਵਜੇ đi với giờ; đừng bỏ khi nói lịch hẹn.",
    learner_trap_en: "Vaje goes with clock time; keep it for appointments.",
    canada_practical: true,
  },
  {
    id: "b1-grammar-past-call",
    level: "B1",
    domain: "grammar",
    title_pa: "ਭੂਤਕਾਲ ਦੀ ਗੱਲ",
    romanization: "bhutkal di gall",
    title_vi: "Nói việc đã làm",
    title_en: "Talking about completed actions",
    readiness_vi: "Nói đã gọi, đã gửi, sẽ nộp muộn, có lý do đơn giản.",
    readiness_en: "Say that you called, sent something, will submit late, and give a simple reason.",
    evidence_vi: "Viết 3 câu nối ý về một việc bị trễ.",
    evidence_en: "Write 3 connected sentences about a delayed task.",
    prompt: { gurmukhi: "ਮੈਂ ਫੋਨ ਕੀਤਾ ਸੀ।", romanization: "main phone kita si", vi: "Tôi đã gọi điện.", en: "I called." },
    learner_trap_vi: "ਸੀ đánh dấu quá khứ; bỏ nó làm câu thiếu thời gian.",
    learner_trap_en: "Si marks past time; dropping it weakens the tense.",
  },
  {
    id: "b1-workplace-shift",
    level: "B1",
    domain: "workplace",
    title_pa: "ਕੰਮ ਦੀ ਸ਼ਿਫਟ",
    romanization: "kamm di shift",
    title_vi: "Ca làm việc",
    title_en: "Work shift",
    readiness_vi: "Hỏi ca làm, xin nghỉ, hỏi hạn chót ở nơi làm việc Canada.",
    readiness_en: "Ask about shifts, time off, and deadlines in a Canadian workplace.",
    evidence_vi: "Soạn tin nhắn ngắn hỏi lịch làm và hạn nộp.",
    evidence_en: "Write a short message asking about schedule and deadline.",
    prompt: { gurmukhi: "ਮੇਰੀ ਸ਼ਿਫਟ ਕਿੰਨੇ ਵਜੇ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ?", romanization: "meri shift kinne vaje shuru hundi hai", vi: "Ca của tôi bắt đầu lúc mấy giờ?", en: "What time does my shift start?" },
    learner_trap_vi: "ਕੱਲ੍ਹ có thể là hôm qua hoặc ngày mai; xác nhận ngày cụ thể khi xin nghỉ.",
    learner_trap_en: "Kall can mean yesterday or tomorrow; confirm the date when requesting time off.",
    canada_practical: true,
  },
  {
    id: "b1-public-documents",
    level: "B1",
    domain: "public_service",
    title_pa: "ਦਸਤਾਵੇਜ਼ ਦੀ ਜਾਂਚ",
    romanization: "dastavez di janch",
    title_vi: "Kiểm tra giấy tờ",
    title_en: "Document check",
    readiness_vi: "Hỏi giấy tờ nào cần thiết, cách nộp, và bước tiếp theo.",
    readiness_en: "Ask which documents are required, how to submit them, and the next step.",
    evidence_vi: "Hoàn thành prompt dịch vụ công với 2 câu hỏi lịch sự.",
    evidence_en: "Complete a public-service prompt with 2 polite questions.",
    prompt: { gurmukhi: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲੋੜੀਂਦੇ ਹਨ?", romanization: "kihre dastavez lorinde han", vi: "Cần những giấy tờ nào?", en: "Which documents are required?" },
    learner_trap_vi: "ਕਿਹੜੇ hợp với danh sách nhiều mục như giấy tờ.",
    learner_trap_en: "Kihre fits lists with multiple items, such as documents.",
    canada_practical: true,
  },
  {
    id: "b2-healthcare-symptoms",
    level: "B2",
    domain: "healthcare",
    title_pa: "ਲੱਛਣ ਸਮਝਾਉਣਾ",
    romanization: "lachhan samjhauna",
    title_vi: "Giải thích triệu chứng",
    title_en: "Explaining symptoms",
    readiness_vi: "Mô tả triệu chứng, thời lượng, thuốc và dị ứng bằng câu rõ ràng.",
    readiness_en: "Describe symptoms, duration, medicine, and allergies clearly.",
    evidence_vi: "Viết đoạn ngắn cho phòng khám, không cần audio.",
    evidence_en: "Write a short clinic note without audio.",
    prompt: { gurmukhi: "ਮੈਨੂੰ ਦੋ ਦਿਨ ਤੋਂ ਬੁਖਾਰ ਹੈ।", romanization: "mainu do din ton bukhar hai", vi: "Tôi bị sốt hai ngày rồi.", en: "I have had a fever for two days." },
    learner_trap_vi: "Trong y tế, mang tên thuốc bằng chữ viết; romanization chỉ hỗ trợ học.",
    learner_trap_en: "In healthcare, bring medicine names in writing; romanization is only a learning aid.",
    canada_practical: true,
  },
  {
    id: "b2-speaking-safe-choice",
    level: "B2",
    domain: "speaking_prompt",
    title_pa: "ਬੋਲਣ ਲਈ ਲਿਖਤੀ ਤਿਆਰੀ",
    romanization: "bolan lai likhti tiari",
    title_vi: "Chuẩn bị nói bằng text prompt",
    title_en: "Text prompt for speaking practice",
    readiness_vi: "Soạn câu trả lời miệng dạng text về lựa chọn, lý do, yêu cầu giúp đỡ.",
    readiness_en: "Prepare text responses for oral practice about options, reasons, and help requests.",
    evidence_vi: "Trả lời prompt bằng 4 câu text, không có chấm điểm phát âm.",
    evidence_en: "Answer a prompt in 4 text sentences, with no pronunciation scoring.",
    prompt: { gurmukhi: "ਕੀ ਕੋਈ ਹੋਰ ਵਿਕਲਪ ਹੈ?", romanization: "ki koi hor vikalp hai?", vi: "Có lựa chọn nào khác không?", en: "Is there another option?" },
    learner_trap_vi: "Đây là prompt an toàn dạng text, không phải ghi âm hay chấm phát âm.",
    learner_trap_en: "This is a text-safe prompt, not recording or pronunciation scoring.",
  },
  {
    id: "c1-writing-formal-request",
    level: "C1",
    domain: "writing",
    title_pa: "ਰਸਮੀ ਬੇਨਤੀ",
    romanization: "rasmi benati",
    title_vi: "Yêu cầu trang trọng",
    title_en: "Formal request",
    readiness_vi: "Viết yêu cầu lịch sự, nêu lý do, giữ register nhất quán.",
    readiness_en: "Write a polite request, give a reason, and keep register consistent.",
    evidence_vi: "Viết email ngắn yêu cầu giải thích hoặc đổi lịch.",
    evidence_en: "Write a short email asking for explanation or rescheduling.",
    prompt: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਕਾਰਨ ਦੱਸੋ।", romanization: "kirpa karke apna karan dasso", vi: "Làm ơn nêu lý do của bạn.", en: "Please explain your reason." },
    learner_trap_vi: "Đừng trộn câu quá thân mật với mở đầu trang trọng.",
    learner_trap_en: "Do not mix very casual sentences with a formal opening.",
  },
  {
    id: "c1-reading-public-decision",
    level: "C1",
    domain: "reading",
    title_pa: "ਫੈਸਲੇ ਨੂੰ ਪੜ੍ਹਨਾ",
    romanization: "faisle nu parhna",
    title_vi: "Đọc quyết định",
    title_en: "Reading a decision",
    readiness_vi: "Đọc thông báo/quyết định ngắn và xác định lý do, bước tiếp theo.",
    readiness_en: "Read a short notice/decision and identify reason and next step.",
    evidence_vi: "Tóm tắt thông báo dịch vụ công bằng tiếng Việt hoặc Anh sau khi đọc Gurmukhi.",
    evidence_en: "Summarize a public-service notice in Vietnamese or English after reading Gurmukhi.",
    prompt: { gurmukhi: "ਕੀ ਤੁਸੀਂ ਫੈਸਲੇ ਦਾ ਕਾਰਨ ਸਮਝਾ ਸਕਦੇ ਹੋ?", romanization: "ki tusi faisle da karan samjha sakde ho?", vi: "Bạn có thể giải thích lý do của quyết định không?", en: "Can you explain the reason for the decision?" },
    learner_trap_vi: "ਫੈਸਲਾ là quyết định; đọc kỹ xem quyết định đã xong hay còn chờ.",
    learner_trap_en: "Faisla means decision; check whether it is final or still pending.",
    canada_practical: true,
  },
  {
    id: "c2-reading-summary",
    level: "C2",
    domain: "reading",
    title_pa: "ਸਾਰ ਕੱਢਣਾ",
    romanization: "sar kadhna",
    title_vi: "Rút ra tóm tắt",
    title_en: "Extracting a summary",
    readiness_vi: "Tóm tắt văn bản dài hơn, nhận diện sắc thái và phần cần kiểm duyệt sau.",
    readiness_en: "Summarize longer text, notice nuance, and flag parts needing later review.",
    evidence_vi: "Tóm tắt 120-150 từ sang tiếng Việt hoặc Anh, kèm 3 cụm Gurmukhi chính.",
    evidence_en: "Summarize 120-150 words into Vietnamese or English with 3 key Gurmukhi phrases.",
    prompt: { gurmukhi: "ਸਾਰ ਇਹ ਹੈ ਕਿ ਫੈਸਲਾ ਅਜੇ ਬਾਕੀ ਹੈ।", romanization: "sar ih hai ki faisla aje baki hai", vi: "Tóm lại là quyết định vẫn còn chờ.", en: "The summary is that the decision is still pending." },
    learner_trap_vi: "C2 là checkpoint học tập, không phải chứng chỉ chính thức.",
    learner_trap_en: "C2 is a learning checkpoint, not official certification.",
  },
  {
    id: "c2-writing-nuance",
    level: "C2",
    domain: "writing",
    title_pa: "ਸੂਖਮ ਲਿਖਤ",
    romanization: "sukham likhat",
    title_vi: "Viết có sắc thái",
    title_en: "Nuanced writing",
    readiness_vi: "Điều chỉnh văn phong theo người đọc, mục tiêu, mức trang trọng.",
    readiness_en: "Adjust style for reader, purpose, and formality.",
    evidence_vi: "Viết hai phiên bản: thân thiện và trang trọng, rồi giải thích khác biệt.",
    evidence_en: "Write two versions: friendly and formal, then explain the difference.",
    prompt: { gurmukhi: "ਇਸ ਮਾਮਲੇ ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਕਰੀਏ।", romanization: "is mamle nu hor spasht kariye", vi: "Hãy làm rõ thêm vấn đề này.", en: "Let us clarify this matter further." },
    learner_trap_vi: "Sắc thái vùng miền cần native review sau; không tự tuyên bố hoàn thiện.",
    learner_trap_en: "Regional nuance needs later native review; do not claim it is complete.",
  },
];

export const PUNJABI_MASTERY_LEVEL_SUMMARY = [
  { level: "A1" as const, vi: "Sẵn sàng đọc/chào hỏi/sinh tồn rất ngắn.", en: "Ready for very short script, greeting, and survival tasks." },
  { level: "A2" as const, vi: "Sẵn sàng xử lý địa chỉ, lịch hẹn, mẫu đơn đơn giản.", en: "Ready for address, appointment, and simple form tasks." },
  { level: "B1" as const, vi: "Sẵn sàng nối ý cho công việc và dịch vụ công.", en: "Ready to connect ideas for work and public-service tasks." },
  { level: "B2" as const, vi: "Sẵn sàng mô tả vấn đề, triệu chứng, lựa chọn.", en: "Ready to describe problems, symptoms, and options." },
  { level: "C1" as const, vi: "Sẵn sàng đọc/viết trang trọng và yêu cầu giải thích.", en: "Ready for formal reading/writing and explanation requests." },
  { level: "C2" as const, vi: "Sẵn sàng tóm tắt, điều chỉnh sắc thái, đánh dấu phần cần review.", en: "Ready to summarize, adjust nuance, and flag review needs." },
];

export const PUNJABI_MASTERY = {
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  scope: PUNJABI_MASTERY_SCOPE,
  domains: PUNJABI_MASTERY_DOMAINS,
  checkpoints: PUNJABI_MASTERY_CHECKPOINTS,
  level_summary: PUNJABI_MASTERY_LEVEL_SUMMARY,
} as const;

export default PUNJABI_MASTERY;
