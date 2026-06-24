// src/languages/punjabi/progressionMatrix.ts
//
// Compact CEFR progression matrix for Punjabi. Pure data, Gurmukhi-first.
// Native review is deferred; no audio or pronunciation scoring is included.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiMatrixSkill =
  | "script"
  | "grammar"
  | "vocabulary"
  | "survival"
  | "workplace"
  | "healthcare"
  | "public_service"
  | "review";

export type PunjabiMatrixExample = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiProgressionCell = {
  skill: PunjabiMatrixSkill;
  focus_vi: string;
  focus_en: string;
  can_do_vi: string;
  can_do_en: string;
  examples: PunjabiMatrixExample[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: boolean;
};

export type PunjabiProgressionLevel = {
  level: PunjabiCefrLevel;
  label_vi: string;
  label_en: string;
  checkpoint_vi: string;
  checkpoint_en: string;
  cells: PunjabiProgressionCell[];
};

export const PUNJABI_PROGRESSION_SKILLS: PunjabiMatrixSkill[] = [
  "script",
  "grammar",
  "vocabulary",
  "survival",
  "workplace",
  "healthcare",
  "public_service",
  "review",
];

export const PUNJABI_PROGRESSION_SCRIPT_NOTE = {
  vi: "Ma trận này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết hệ chữ khác, không phải một khóa học đầy đủ.",
  en: "This matrix uses Gurmukhi as the primary script. Shahmukhi is awareness-only as another script, not a full course.",
};

export const PUNJABI_PROGRESSION_WARNINGS = {
  native_review_vi: "Native review được hoãn; không tuyên bố đã có kiểm duyệt bản ngữ.",
  native_review_en: "Native review is deferred; completed native review is not claimed.",
  no_audio_vi: "Không có audio hoặc chấm điểm phát âm trong Wave 5.",
  no_audio_en: "Wave 5 includes no audio or pronunciation scoring.",
};

export const PUNJABI_PROGRESSION_MATRIX: PunjabiProgressionLevel[] = [
  {
    level: "A1",
    label_vi: "Nền tảng",
    label_en: "Foundation",
    checkpoint_vi: "Đọc nhận diện Gurmukhi, dùng câu sống còn rất ngắn, tự kiểm tra bằng nối nghĩa và điền khuyết.",
    checkpoint_en: "Recognize Gurmukhi, use very short survival phrases, and review with matching and fill-in checks.",
    cells: [
      {
        skill: "script",
        focus_vi: "Nhận diện chữ cái Gurmukhi, dấu nguyên âm thường gặp, dấu mũi.",
        focus_en: "Recognize Gurmukhi letters, common vowel signs, and nasal marks.",
        can_do_vi: "Nhìn chữ Punjabi trước romanization trong câu chào hỏi.",
        can_do_en: "Look at Punjabi script before romanization in greeting phrases.",
        examples: [{ gurmukhi: "ਪੰਜਾਬੀ", romanization: "Punjabi", vi: "tiếng Punjabi", en: "Punjabi" }],
        learner_trap_vi: "Đừng học bằng chữ Latin quá lâu; Gurmukhi phải là tín hiệu chính.",
        learner_trap_en: "Do not stay in Latin letters too long; Gurmukhi must become the main signal.",
      },
      {
        skill: "grammar",
        focus_vi: "Câu với ਹੈ, đại từ tôi/bạn, mẫu 'tôi cần'.",
        focus_en: "Sentences with hai, I/you pronouns, and the 'I need' pattern.",
        can_do_vi: "Nói tên, nhu cầu nước, và câu hỏi đơn giản.",
        can_do_en: "State your name, ask for water, and form simple questions.",
        examples: [{ gurmukhi: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।", romanization: "mainu pani chahida hai", vi: "Tôi cần nước.", en: "I need water." }],
        learner_trap_vi: "ਮੈਨੂੰ không giống ਮੈਂ; dùng cho 'cho tôi/tôi cần'.",
        learner_trap_en: "Mainu is not main; use it for 'to me/I need'.",
      },
      {
        skill: "survival",
        focus_vi: "Chào hỏi, cảm ơn, xin nước, hỏi giá.",
        focus_en: "Greetings, thanks, asking for water, asking prices.",
        can_do_vi: "Xử lý trao đổi một câu trong cửa hàng hoặc lớp học.",
        can_do_en: "Handle one-sentence exchanges in a shop or classroom.",
        examples: [{ gurmukhi: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?", romanization: "ih kinne da hai?", vi: "Cái này bao nhiêu tiền?", en: "How much is this?" }],
        canada_practical: true,
      },
      {
        skill: "review",
        focus_vi: "Ôn chữ, câu chào, số cơ bản, câu hỏi tên.",
        focus_en: "Review script, greetings, basic numbers, and name questions.",
        can_do_vi: "Làm bài nối Gurmukhi với nghĩa Việt/Anh.",
        can_do_en: "Match Gurmukhi items to Vietnamese/English meanings.",
        examples: [{ gurmukhi: "ਧੰਨਵਾਦ ਜੀ।", romanization: "dhannvaad ji", vi: "Cảm ơn ạ.", en: "Thank you respectfully." }],
      },
    ],
  },
  {
    level: "A2",
    label_vi: "Sơ cấp",
    label_en: "Elementary",
    checkpoint_vi: "Mở rộng sang dịch vụ hằng ngày: mua sắm, lịch hẹn, địa chỉ, giấy tờ đơn giản.",
    checkpoint_en: "Expand into daily services: shopping, appointments, address, and simple documents.",
    cells: [
      {
        skill: "vocabulary",
        focus_vi: "Gia đình, món ăn, số tiền, thời gian, địa chỉ.",
        focus_en: "Family, food, money, time, and address words.",
        can_do_vi: "Nói số điện thoại và địa chỉ trong tình huống định cư ở Canada.",
        can_do_en: "State a phone number and address in a Canada settlement situation.",
        examples: [{ gurmukhi: "ਇਹ ਮੇਰਾ ਫੋਨ ਨੰਬਰ ਹੈ।", romanization: "ih mera phone number hai", vi: "Đây là số điện thoại của tôi.", en: "This is my phone number." }],
        learner_trap_vi: "ਪਤਾ là địa chỉ; đừng nhầm với ਪਿਤਾ là bố.",
        learner_trap_en: "Pata means address; do not confuse it with pita, father.",
        canada_practical: true,
      },
      {
        skill: "healthcare",
        focus_vi: "Đặt lịch khám, nói hôm nay/ngày mai, nói đau đơn giản.",
        focus_en: "Book clinic times, say today/tomorrow, and state simple pain.",
        can_do_vi: "Hỏi có lịch khám hôm nay không.",
        can_do_en: "Ask whether a clinic time is available today.",
        examples: [{ gurmukhi: "ਕੀ ਅੱਜ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "ki ajj sama mil sakda hai?", vi: "Hôm nay có lịch được không?", en: "Can I get a time today?" }],
        canada_practical: true,
      },
      {
        skill: "public_service",
        focus_vi: "Xin mẫu đơn, ký tên, hỏi cần gì.",
        focus_en: "Ask for forms, sign, and ask what is needed.",
        can_do_vi: "Hiểu yêu cầu ký vào mẫu đơn.",
        can_do_en: "Understand a request to sign a form.",
        examples: [{ gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇੱਥੇ ਦਸਤਖਤ ਕਰੋ।", romanization: "kirpa karke ithe dastkhat karo", vi: "Làm ơn ký ở đây.", en: "Please sign here." }],
        canada_practical: true,
      },
      {
        skill: "review",
        focus_vi: "Ôn câu hỏi có/không với ਕੀ và mẫu cần đồ.",
        focus_en: "Review yes/no questions with ki and need patterns.",
        can_do_vi: "Tự kiểm tra bằng điền ਕੀ, ਮੈਨੂੰ, ਚਾਹੀਦਾ.",
        can_do_en: "Self-check with ki, mainu, chahida blanks.",
        examples: [{ gurmukhi: "ਕੀ ਇਹ ਸਬਜ਼ੀ ਵਾਲਾ ਹੈ?", romanization: "ki ih sabzi vala hai?", vi: "Món này ăn chay không?", en: "Is this vegetarian?" }],
        learner_trap_vi: "ਕੀ không phải lúc nào cũng dịch là 'gì'; đầu câu có thể tạo câu hỏi có/không.",
        learner_trap_en: "Ki is not always 'what'; sentence-initial ki can mark a yes/no question.",
      },
    ],
  },
  {
    level: "B1",
    label_vi: "Trung cấp",
    label_en: "Intermediate",
    checkpoint_vi: "Nối ý để xử lý công việc, trường học, giấy tờ, cuộc gọi và lịch làm việc.",
    checkpoint_en: "Connect ideas for work, school, paperwork, phone calls, and scheduling.",
    cells: [
      {
        skill: "grammar",
        focus_vi: "Thời gian, quá khứ đơn giản, lý do, câu nối với ਕਿ.",
        focus_en: "Time expressions, simple past, reasons, and clauses with ki.",
        can_do_vi: "Nói việc đã gọi, sẽ gửi, hoặc bị muộn một ngày.",
        can_do_en: "Say that you called, will send something, or will be one day late.",
        examples: [{ gurmukhi: "ਮੈਂ ਫੋਨ ਕੀਤਾ ਸੀ।", romanization: "main phone kita si", vi: "Tôi đã gọi điện.", en: "I called." }],
        learner_trap_vi: "ਸੀ đánh dấu quá khứ trong mẫu này; đừng bỏ khi kể việc đã làm.",
        learner_trap_en: "Si marks past time here; keep it when narrating a completed action.",
      },
      {
        skill: "workplace",
        focus_vi: "Ca làm, hạn chót, xin nghỉ, nhờ gửi tài liệu.",
        focus_en: "Shifts, deadlines, time off, and sending documents.",
        can_do_vi: "Hỏi ca làm bắt đầu lúc mấy giờ trong bối cảnh Canada.",
        can_do_en: "Ask what time a shift starts in a Canada workplace context.",
        examples: [{ gurmukhi: "ਮੇਰੀ ਸ਼ਿਫਟ ਕਿੰਨੇ ਵਜੇ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ?", romanization: "meri shift kinne vaje shuru hundi hai", vi: "Ca của tôi bắt đầu lúc mấy giờ?", en: "What time does my shift start?" }],
        canada_practical: true,
      },
      {
        skill: "public_service",
        focus_vi: "Hỏi giấy tờ nào cần thiết và cách nộp.",
        focus_en: "Ask which documents are required and how to submit them.",
        can_do_vi: "Hỏi danh sách giấy tờ ở văn phòng dịch vụ công.",
        can_do_en: "Ask for the document list at a public-service office.",
        examples: [{ gurmukhi: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲੋੜੀਂਦੇ ਹਨ?", romanization: "kihre dastavez lorinde han", vi: "Cần những giấy tờ nào?", en: "Which documents are required?" }],
        learner_trap_vi: "ਕਿਹੜੇ hợp với 'những cái nào'; dùng tốt cho danh sách giấy tờ.",
        learner_trap_en: "Kihre fits 'which ones' and works well for document lists.",
        canada_practical: true,
      },
      {
        skill: "review",
        focus_vi: "Ôn từ nối, ngày tháng, câu yêu cầu lịch sự.",
        focus_en: "Review connectors, dates, and polite request patterns.",
        can_do_vi: "Sửa lỗi thiếu postposition trong câu dài.",
        can_do_en: "Repair missing postpositions in longer sentences.",
        examples: [{ gurmukhi: "ਕੱਲ੍ਹ ਭੇਜ ਦਿਓ।", romanization: "kall bhej dio", vi: "Hãy gửi ngày mai.", en: "Please send it tomorrow." }],
        learner_trap_vi: "ਕੱਲ੍ਹ có thể là hôm qua hoặc ngày mai; xác nhận ngày cụ thể khi quan trọng.",
        learner_trap_en: "Kall can mean yesterday or tomorrow; confirm the date when it matters.",
      },
    ],
  },
  {
    level: "B2",
    label_vi: "Trung cao cấp",
    label_en: "Upper-intermediate",
    checkpoint_vi: "Mô tả chi tiết, nêu lựa chọn, khiếu nại lịch sự, giải thích triệu chứng và quy trình.",
    checkpoint_en: "Describe details, present options, complain politely, and explain symptoms and procedures.",
    cells: [
      {
        skill: "healthcare",
        focus_vi: "Triệu chứng, thời lượng bệnh, thuốc đang dùng, dị ứng.",
        focus_en: "Symptoms, duration, current medicine, and allergies.",
        can_do_vi: "Mô tả sốt, ho, thuốc trong phòng khám Canada.",
        can_do_en: "Describe fever, cough, and medicine at a Canadian clinic.",
        examples: [{ gurmukhi: "ਮੈਂ ਇਹ ਦਵਾਈ ਲੈ ਰਿਹਾ ਹਾਂ।", romanization: "main ih davai lai riha han", vi: "Tôi đang dùng thuốc này.", en: "I am taking this medicine." }],
        learner_trap_vi: "Mang tên thuốc bằng văn bản; romanization có thể không đủ rõ trong y tế.",
        learner_trap_en: "Bring medicine names in writing; romanization may not be precise enough in healthcare.",
        canada_practical: true,
      },
      {
        skill: "workplace",
        focus_vi: "So sánh lựa chọn, báo vấn đề, đề xuất bước tiếp theo.",
        focus_en: "Compare options, report issues, and suggest next steps.",
        can_do_vi: "Hỏi có lựa chọn khác hoặc cách giải quyết khác không.",
        can_do_en: "Ask whether another option or solution is available.",
        examples: [{ gurmukhi: "ਕੀ ਕੋਈ ਹੋਰ ਵਿਕਲਪ ਹੈ?", romanization: "ki koi hor vikalp hai?", vi: "Có lựa chọn nào khác không?", en: "Is there another option?" }],
        learner_trap_vi: "Thêm ਕਿਰਪਾ ਕਰਕੇ khi yêu cầu đổi lựa chọn trong môi trường trang trọng.",
        learner_trap_en: "Add kirpa karke when requesting a different option formally.",
      },
      {
        skill: "survival",
        focus_vi: "Khiếu nại, nhờ giúp, giải thích vấn đề không khẩn cấp.",
        focus_en: "Complaining, asking for help, and explaining non-emergency problems.",
        can_do_vi: "Nói vấn đề cần được kiểm tra hoặc sửa.",
        can_do_en: "Say that a problem needs checking or repair.",
        examples: [{ gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਜਾਂਚ ਕਰੋ।", romanization: "kirpa karke ih janch karo", vi: "Làm ơn kiểm tra việc này.", en: "Please check this." }],
      },
      {
        skill: "review",
        focus_vi: "Ôn cách làm mềm lời phàn nàn và mô tả thời lượng.",
        focus_en: "Review softening complaints and describing duration.",
        can_do_vi: "Tự sửa câu quá trực tiếp thành câu lịch sự hơn.",
        can_do_en: "Rewrite overly direct sentences into more polite ones.",
        examples: [{ gurmukhi: "ਦੋ ਦਿਨ ਤੋਂ ਦਰਦ ਹੈ।", romanization: "do din ton dard hai", vi: "Tôi bị đau hai ngày rồi.", en: "I have had pain for two days." }],
      },
    ],
  },
  {
    level: "C1",
    label_vi: "Cao cấp",
    label_en: "Advanced",
    checkpoint_vi: "Vận hành văn phong chuyên nghiệp: họp, bất đồng, thư trang trọng, lập luận có sắc thái.",
    checkpoint_en: "Operate in professional register: meetings, disagreement, formal messages, and nuanced reasoning.",
    cells: [
      {
        skill: "grammar",
        focus_vi: "Mệnh đề phức, cách làm mềm, quan hệ nguyên nhân-kết quả.",
        focus_en: "Complex clauses, softeners, and cause-effect relations.",
        can_do_vi: "Nêu ý kiến khác mà không tạo cảm giác đối đầu.",
        can_do_en: "Present a different opinion without sounding confrontational.",
        examples: [{ gurmukhi: "ਮੇਰੀ ਰਾਏ ਥੋੜ੍ਹੀ ਵੱਖਰੀ ਹੈ।", romanization: "meri rai thorhi vakhri hai", vi: "Ý kiến của tôi hơi khác.", en: "My opinion is slightly different." }],
        learner_trap_vi: "Nói bất đồng quá ngắn có thể nghe cứng; thêm ਥੋੜ੍ਹੀ hoặc lý do.",
        learner_trap_en: "A short disagreement can sound blunt; add thorhi or a reason.",
      },
      {
        skill: "workplace",
        focus_vi: "Họp, biên bản, lý do quyết định, yêu cầu làm rõ.",
        focus_en: "Meetings, notes, decision reasons, and clarification requests.",
        can_do_vi: "Yêu cầu đồng nghiệp giải thích lý do một cách lịch sự.",
        can_do_en: "Ask a colleague to explain the reason politely.",
        examples: [{ gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਕਾਰਨ ਦੱਸੋ।", romanization: "kirpa karke apna karan dasso", vi: "Làm ơn nêu lý do của bạn.", en: "Please explain your reason." }],
        canada_practical: true,
      },
      {
        skill: "public_service",
        focus_vi: "Yêu cầu giải thích quyết định, phản hồi hồ sơ thiếu.",
        focus_en: "Request explanations for decisions and respond to incomplete files.",
        can_do_vi: "Hỏi lý do quyết định ở cơ quan công quyền mà vẫn lịch sự.",
        can_do_en: "Ask for the reason behind a public-service decision politely.",
        examples: [{ gurmukhi: "ਕੀ ਤੁਸੀਂ ਫੈਸਲੇ ਦਾ ਕਾਰਨ ਸਮਝਾ ਸਕਦੇ ਹੋ?", romanization: "ki tusi faisle da karan samjha sakde ho?", vi: "Bạn có thể giải thích lý do của quyết định không?", en: "Can you explain the reason for the decision?" }],
        canada_practical: true,
      },
      {
        skill: "review",
        focus_vi: "Ôn register, cách xưng hô, mức lịch sự trong email và họp.",
        focus_en: "Review register, address forms, and politeness level in emails and meetings.",
        can_do_vi: "Chọn câu phù hợp giữa thân mật, lịch sự và trang trọng.",
        can_do_en: "Choose between casual, polite, and formal versions.",
        examples: [{ gurmukhi: "ਜੀ", romanization: "ji", vi: "từ lịch sự như 'ạ/thưa'", en: "respect marker" }],
      },
    ],
  },
  {
    level: "C2",
    label_vi: "Thành thạo",
    label_en: "Mastery",
    checkpoint_vi: "Tổng hợp, tranh luận, đọc dài, viết mạch lạc và nhận diện sắc thái cần kiểm duyệt sâu hơn.",
    checkpoint_en: "Synthesize, debate, read longer texts, write coherently, and notice nuance that needs deeper review.",
    cells: [
      {
        skill: "script",
        focus_vi: "Đọc văn bản dài hơn bằng Gurmukhi, nhận ra khác biệt văn phong và vùng miền.",
        focus_en: "Read longer Gurmukhi texts and notice register and regional variation.",
        can_do_vi: "Tóm tắt quyết định hoặc nội dung thông báo.",
        can_do_en: "Summarize a decision or notice.",
        examples: [{ gurmukhi: "ਸਾਰ ਇਹ ਹੈ ਕਿ ਫੈਸਲਾ ਅਜੇ ਬਾਕੀ ਹੈ।", romanization: "sar ih hai ki faisla aje baki hai", vi: "Tóm lại là quyết định vẫn còn chờ.", en: "The summary is that the decision is still pending." }],
        learner_trap_vi: "Không tuyên bố C2 là chứng chỉ chính thức; đây là mốc học tập nội bộ.",
        learner_trap_en: "Do not treat C2 as official certification; this is an internal learning milestone.",
      },
      {
        skill: "grammar",
        focus_vi: "Tóm tắt, nhượng bộ, phản biện, điều phối tranh luận.",
        focus_en: "Summarizing, concession, counterargument, and moderating debate.",
        can_do_vi: "Làm rõ vấn đề phức tạp mà không mất lịch sự.",
        can_do_en: "Clarify a complex issue without losing politeness.",
        examples: [{ gurmukhi: "ਇਸ ਮਾਮਲੇ ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਕਰੀਏ।", romanization: "is mamle nu hor spasht kariye", vi: "Hãy làm rõ thêm vấn đề này.", en: "Let us clarify this matter further." }],
      },
      {
        skill: "vocabulary",
        focus_vi: "Từ trừu tượng, văn phong trang trọng, cụm tranh luận.",
        focus_en: "Abstract vocabulary, formal register, and debate phrases.",
        can_do_vi: "Chọn từ phù hợp với văn bản công việc hoặc công quyền.",
        can_do_en: "Choose vocabulary suited to work or public-service writing.",
        examples: [{ gurmukhi: "ਫੈਸਲਾ", romanization: "faisla", vi: "quyết định", en: "decision" }],
      },
      {
        skill: "review",
        focus_vi: "Ôn toàn bộ ma trận: Gurmukhi, ngữ pháp, tình huống Canada, register.",
        focus_en: "Review the whole matrix: Gurmukhi, grammar, Canada contexts, and register.",
        can_do_vi: "Tự chẩn đoán lỗ hổng trước khi nhờ native review.",
        can_do_en: "Self-diagnose gaps before native review.",
        examples: [{ gurmukhi: "ਦੁਹਰਾਈ", romanization: "duhrai", vi: "ôn tập", en: "review" }],
        learner_trap_vi: "Sắc thái vùng miền và văn phong cao cần native review sau.",
        learner_trap_en: "Regional nuance and high-register style need later native review.",
      },
    ],
  },
];

export const PUNJABI_PROGRESSION_REVIEW_CHECKPOINTS = [
  {
    after_level: "A1" as const,
    vi: "Đọc được ít nhất 20 mục Gurmukhi quen thuộc trước khi nhìn romanization.",
    en: "Read at least 20 familiar Gurmukhi items before looking at romanization.",
  },
  {
    after_level: "A2" as const,
    vi: "Tự xử lý mua sắm, lịch hẹn và một biểu mẫu đơn giản.",
    en: "Handle shopping, appointment booking, and one simple form independently.",
  },
  {
    after_level: "B1" as const,
    vi: "Giải thích một vấn đề công việc hoặc giấy tờ bằng 3-4 câu nối ý.",
    en: "Explain a work or document issue in 3-4 connected sentences.",
  },
  {
    after_level: "B2" as const,
    vi: "Mô tả triệu chứng và lựa chọn giải pháp bằng câu lịch sự.",
    en: "Describe symptoms and solution options with polite phrasing.",
  },
  {
    after_level: "C1" as const,
    vi: "Viết yêu cầu trang trọng và làm mềm bất đồng trong họp.",
    en: "Write a formal request and soften disagreement in a meeting.",
  },
  {
    after_level: "C2" as const,
    vi: "Tóm tắt, phản biện và đánh dấu phần cần native review sau.",
    en: "Summarize, counterargue, and flag areas for later native review.",
  },
];

export const PUNJABI_PROGRESSION = {
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  script_note: PUNJABI_PROGRESSION_SCRIPT_NOTE,
  warnings: PUNJABI_PROGRESSION_WARNINGS,
  skills: PUNJABI_PROGRESSION_SKILLS,
  matrix: PUNJABI_PROGRESSION_MATRIX,
  review_checkpoints: PUNJABI_PROGRESSION_REVIEW_CHECKPOINTS,
} as const;

export default PUNJABI_PROGRESSION;
