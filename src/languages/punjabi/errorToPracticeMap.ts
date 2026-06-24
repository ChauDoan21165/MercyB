// src/languages/punjabi/errorToPracticeMap.ts
//
// Punjabi learner error-to-practice map. Gurmukhi is primary; romanization is
// included where useful. This is study support only. Native review is deferred.

export type PunjabiPracticeErrorType =
  | "script-confusion"
  | "romanization-dependence"
  | "word-order"
  | "postpositions"
  | "agreement"
  | "register"
  | "public-service-phrase-mismatch"
  | "workplace-communication-gaps";

export type PunjabiPracticeAudience = "vi" | "en" | "both";

export interface PunjabiErrorPracticeMapEntry {
  id: string;
  errorType: PunjabiPracticeErrorType;
  audience: PunjabiPracticeAudience;
  observedError: string;
  corrected_pa: string;
  corrected_roman?: string;
  meaning_en: string;
  explanation_vi: string;
  explanation_en: string;
  practiceType: string;
  practicePrompt_vi: string;
  practicePrompt_en: string;
  commonTrap?: string;
  routeIds: string[];
  canadaPractical?: boolean;
}

export const PUNJABI_ERROR_TO_PRACTICE_NOTICE =
  "Study support only; not official certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_PRACTICE_ERROR_TYPES: readonly PunjabiPracticeErrorType[] = [
  "script-confusion",
  "romanization-dependence",
  "word-order",
  "postpositions",
  "agreement",
  "register",
  "public-service-phrase-mismatch",
  "workplace-communication-gaps",
] as const;

export const PUNJABI_PRACTICE_AUDIENCES: readonly PunjabiPracticeAudience[] = [
  "vi",
  "en",
  "both",
] as const;

export const punjabiErrorToPracticeMap: PunjabiErrorPracticeMapEntry[] = [
  {
    id: "script-bus-babba-pappa",
    errorType: "script-confusion",
    audience: "both",
    observedError: "Reads ਬੱਸ as ਪੱਸ or guesses from context.",
    corrected_pa: "ਬੱਸ ਅੱਡਾ",
    corrected_roman: "bas adda",
    meaning_en: "bus stand",
    explanation_vi: "Lỗi cho thấy cần luyện phân biệt chữ Gurmukhi gần giống, nhất là ਬ và ਪ.",
    explanation_en: "This error points to similar-letter discrimination in Gurmukhi, especially ਬ and ਪ.",
    practiceType: "minimal-letter discrimination",
    practicePrompt_vi: "Khoanh ਬ trong 10 từ rồi đọc ਬੱਸ ਅੱਡਾ ba lần.",
    practicePrompt_en: "Circle ਬ in 10 words, then read ਬੱਸ ਅੱਡਾ three times.",
    commonTrap: "Guessing a transport word without reading the first letter.",
    routeIds: ["route-script-babba-pappa", "gurmukhi-pair-babba-pappa"],
    canadaPractical: true,
  },
  {
    id: "script-vowel-sign-ki",
    errorType: "script-confusion",
    audience: "both",
    observedError: "Reads ਕੀ as ਕ or ignores the vowel sign.",
    corrected_pa: "ਕੀ ਤੁਹਾਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
    corrected_roman: "ki tuhanu madad chahidi hai?",
    meaning_en: "Do you need help?",
    explanation_vi: "Dấu nguyên âm ੀ là một phần của chữ; bỏ qua nó làm đổi cách đọc.",
    explanation_en: "The ੀ vowel sign is part of the spelling; skipping it changes the reading.",
    practiceType: "vowel-sign scan",
    practicePrompt_vi: "Gạch chân dấu ੀ trước khi đọc cả câu.",
    practicePrompt_en: "Underline ੀ before reading the full sentence.",
    routeIds: ["route-script-vowel-signs", "gurmukhi-vowel-sign-ee"],
  },
  {
    id: "romanization-main-text",
    errorType: "romanization-dependence",
    audience: "both",
    observedError: "Can read mainu madad chahidi hai but not ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    corrected_pa: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    corrected_roman: "mainu madad chahidi hai.",
    meaning_en: "I need help.",
    explanation_vi: "Romanization đang thay thế Gurmukhi thay vì chỉ hỗ trợ kiểm tra.",
    explanation_en: "Romanization is replacing Gurmukhi instead of serving as a checking aid.",
    practiceType: "cover-romanization reading",
    practicePrompt_vi: "Che romanization, đọc Gurmukhi hai lần, rồi mở ra kiểm tra.",
    practicePrompt_en: "Cover romanization, read Gurmukhi twice, then reveal it to check.",
    commonTrap: "Treating romanization as the course's main script.",
    routeIds: ["route-romanization-cover-first", "romanization-read-gurmukhi-first"],
  },
  {
    id: "romanization-shahmukhi-mix",
    errorType: "romanization-dependence",
    audience: "both",
    observedError: "Mixes Gurmukhi spelling answers with Shahmukhi examples.",
    corrected_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਪੜ੍ਹਦੇ ਹਾਂ।",
    corrected_roman: "asi gurmukhi parhde haan.",
    meaning_en: "We study Gurmukhi.",
    explanation_vi: "Khóa này dùng Gurmukhi chính; Shahmukhi chỉ để nhận biết, không phải khóa đầy đủ.",
    explanation_en: "This course uses Gurmukhi as primary; Shahmukhi is awareness only, not a full course.",
    practiceType: "script-goal reset",
    practicePrompt_vi: "Gắn nhãn tài liệu: Gurmukhi chính, Shahmukhi chỉ nhận biết.",
    practicePrompt_en: "Label materials: Gurmukhi primary, Shahmukhi awareness only.",
    routeIds: ["route-romanization-shahmukhi-boundary", "gurmukhi-shahmukhi-awareness"],
  },
  {
    id: "word-order-object-after-verb",
    errorType: "word-order",
    audience: "both",
    observedError: "Says ਮੈਂ ਖਾਂਦਾ ਸੇਬ ਹਾਂ.",
    corrected_pa: "ਮੈਂ ਸੇਬ ਖਾਂਦਾ ਹਾਂ।",
    corrected_roman: "main seb khanda haan.",
    meaning_en: "I eat an apple.",
    explanation_vi: "Punjabi thường dùng trật tự chủ ngữ + tân ngữ + động từ.",
    explanation_en: "Punjabi commonly uses subject + object + verb order.",
    practiceType: "SOV reorder drill",
    practicePrompt_vi: "Sắp xếp 8 câu theo khung subject + object + verb.",
    practicePrompt_en: "Reorder 8 sentences using subject + object + verb.",
    commonTrap: "Copying Vietnamese or English SVO order.",
    routeIds: ["word-order-object-before-verb", "route-transfer-english-auxiliary"],
  },
  {
    id: "word-order-auxiliary-early",
    errorType: "word-order",
    audience: "en",
    observedError: "Writes ਮੈਂ ਹਾਂ ਵਿਦਿਆਰਥੀ.",
    corrected_pa: "ਮੈਂ ਵਿਦਿਆਰਥੀ ਹਾਂ।",
    corrected_roman: "main vidyarthi haan.",
    meaning_en: "I am a student.",
    explanation_vi: "Ảnh hưởng tiếng Anh đặt 'am' ngay sau chủ ngữ; Punjabi để ਹਾਂ cuối mệnh đề.",
    explanation_en: "English places 'am' after the subject; Punjabi puts ਹਾਂ at the clause end.",
    practiceType: "auxiliary-final drill",
    practicePrompt_vi: "Chuyển 10 câu 'I am X' sang ਮੈਂ X ਹਾਂ.",
    practicePrompt_en: "Convert 10 'I am X' sentences into ਮੈਂ X ਹਾਂ.",
    routeIds: ["english-transfer-am-is-are", "route-transfer-english-auxiliary"],
  },
  {
    id: "postposition-human-object-nu",
    errorType: "postpositions",
    audience: "both",
    observedError: "Says ਮੈਂ ਉਸ ਦੇਖਿਆ.",
    corrected_pa: "ਮੈਂ ਉਸਨੂੰ ਦੇਖਿਆ।",
    corrected_roman: "main usnu dekhia.",
    meaning_en: "I saw him/her.",
    explanation_vi: "Tân ngữ người cụ thể thường cần ਨੂੰ; tiếng Việt/Anh không có hậu giới từ này.",
    explanation_en: "A specific human object often needs ਨੂੰ; English/Vietnamese lack this postposition.",
    practiceType: "human-object ਨੂੰ drill",
    practicePrompt_vi: "Thêm ਨੂੰ vào 6 câu có người cụ thể làm tân ngữ.",
    practicePrompt_en: "Add ਨੂੰ to 6 sentences with a specific human object.",
    routeIds: ["route-postpositions-human-object", "postpositions-nu-human-object"],
  },
  {
    id: "postposition-location-before-noun",
    errorType: "postpositions",
    audience: "both",
    observedError: "Writes ਵਿੱਚ ਦਫ਼ਤਰ for 'in the office'.",
    corrected_pa: "ਦਫ਼ਤਰ ਵਿੱਚ",
    corrected_roman: "daftar vich",
    meaning_en: "in the office",
    explanation_vi: "Punjabi dùng hậu giới từ sau danh từ: danh từ + ਵਿੱਚ.",
    explanation_en: "Punjabi uses postpositions after nouns: noun + ਵਿੱਚ.",
    practiceType: "postposition order swap",
    practicePrompt_vi: "Đổi 10 cụm 'in/on/with X' sang X + hậu giới từ.",
    practicePrompt_en: "Convert 10 'in/on/with X' phrases into X + postposition.",
    routeIds: ["route-postpositions-location-order", "postpositions-location-vich"],
    canadaPractical: true,
  },
  {
    id: "agreement-mera-kitaab",
    errorType: "agreement",
    audience: "both",
    observedError: "Writes ਮੇਰਾ ਕਿਤਾਬ.",
    corrected_pa: "ਮੇਰੀ ਕਿਤਾਬ",
    corrected_roman: "meri kitaab",
    meaning_en: "my book",
    explanation_vi: "ਕਿਤਾਬ thường giống cái, nên sở hữu là ਮੇਰੀ.",
    explanation_en: "ਕਿਤਾਬ is typically feminine, so the possessive is ਮੇਰੀ.",
    practiceType: "possessive agreement chunks",
    practicePrompt_vi: "Ghép ਮੇਰਾ/ਮੇਰੀ/ਮੇਰੇ với 12 danh từ quen thuộc.",
    practicePrompt_en: "Match ਮੇਰਾ/ਮੇਰੀ/ਮੇਰੇ with 12 familiar nouns.",
    routeIds: ["route-agreement-mera-meri", "gender-number-mera-meri"],
  },
  {
    id: "agreement-roti-khaadha",
    errorType: "agreement",
    audience: "both",
    observedError: "Writes ਉਸ ਨੇ ਰੋਟੀ ਖਾਧਾ.",
    corrected_pa: "ਉਸ ਨੇ ਰੋਟੀ ਖਾਧੀ।",
    corrected_roman: "us ne roti khaadhi.",
    meaning_en: "He/she ate roti.",
    explanation_vi: "Trong mẫu này, ਰੋਟੀ đi với ਖਾਧੀ; cần luyện cụm quá khứ hoàn thành.",
    explanation_en: "In this pattern, ਰੋਟੀ pairs with ਖਾਧੀ; drill perfective chunks.",
    practiceType: "perfective agreement drill",
    practicePrompt_vi: "Điền dạng đúng cho ਰੋਟੀ, ਚਾਹ, ਅਤੇ ਪਾਣੀ trong câu quá khứ.",
    practicePrompt_en: "Fill the correct past form for ਰੋਟੀ, ਚਾਹ, and ਪਾਣੀ.",
    routeIds: ["route-agreement-perfective-roti", "gender-number-perfective-roti"],
  },
  {
    id: "register-tu-service-staff",
    errorType: "register",
    audience: "both",
    observedError: "Uses ਤੂੰ or ਫਾਰਮ ਦੇ! with service staff.",
    corrected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਫਾਰਮ ਦੇ ਦਿਓ ਜੀ।",
    corrected_roman: "kirpa karke mainu form de dio ji.",
    meaning_en: "Please give me the form.",
    explanation_vi: "Với nhân viên dịch vụ hoặc người lạ, dùng register lịch sự với ਕਿਰਪਾ ਕਰਕੇ và ਜੀ.",
    explanation_en: "With service staff or strangers, use polite register with ਕਿਰਪਾ ਕਰਕੇ and ਜੀ.",
    practiceType: "polite request rewrite",
    practicePrompt_vi: "Viết lại 8 mệnh lệnh thành lời nhờ lịch sự.",
    practicePrompt_en: "Rewrite 8 commands as polite requests.",
    commonTrap: "Using direct commands because they feel efficient.",
    routeIds: ["route-register-tu-with-staff", "register-service-counter"],
    canadaPractical: true,
  },
  {
    id: "public-service-library-card-noun-only",
    errorType: "public-service-phrase-mismatch",
    audience: "both",
    observedError: "Says only ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ at a counter.",
    corrected_pa: "ਮੈਂ ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ ਬਣਵਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।",
    corrected_roman: "main library card banvauna chahunda/chahundi haan.",
    meaning_en: "I would like to get a library card.",
    explanation_vi: "Danh từ riêng lẻ chưa phải yêu cầu; cần khung muốn làm/được cấp.",
    explanation_en: "A noun alone is not a request; use a want-to-get-issued frame.",
    practiceType: "service request frame substitution",
    practicePrompt_vi: "Thay ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ bằng ਹੈਲਥ ਕਾਰਡ và ਫਾਰਮ trong khung.",
    practicePrompt_en: "Replace ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ with ਹੈਲਥ ਕਾਰਡ and ਫਾਰਮ in the frame.",
    routeIds: ["route-public-service-library-card", "public-service-library-card"],
    canadaPractical: true,
  },
  {
    id: "public-service-deadline-question",
    errorType: "public-service-phrase-mismatch",
    audience: "both",
    observedError: "Cannot ask by when an application is due.",
    corrected_pa: "ਇਹ ਅਰਜ਼ੀ ਕਦੋਂ ਤੱਕ ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ?",
    corrected_roman: "ih arzi kadon takk jamma karni hai?",
    meaning_en: "By when must this application be submitted?",
    explanation_vi: "Thiếu cụm hạn nộp ਕਦੋਂ ਤੱਕ và động từ hành chính ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ.",
    explanation_en: "The learner is missing deadline phrase ਕਦੋਂ ਤੱਕ and administrative verb ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ.",
    practiceType: "deadline question drill",
    practicePrompt_vi: "Tạo 5 câu hỏi với ਕਦੋਂ ਤੱਕ cho biểu mẫu, giấy tờ, lịch hẹn.",
    practicePrompt_en: "Create 5 ਕਦੋਂ ਤੱਕ questions for forms, documents, and appointments.",
    routeIds: ["route-public-service-deadline", "workplace-public-service-form"],
    canadaPractical: true,
  },
  {
    id: "workplace-form-status",
    errorType: "workplace-communication-gaps",
    audience: "both",
    observedError: "Uses casual ਯਾਰ or cannot ask for application status in a workplace email.",
    corrected_pa: "ਸਤਿਕਾਰਯੋਗ ਸਰ, ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੀ ਅਰਜ਼ੀ ਦੀ ਸਥਿਤੀ ਦੱਸੋ।",
    corrected_roman: "satkaryog sir, kirpa karke meri arzi di sthiti dasso.",
    meaning_en: "Respected sir, please tell me the status of my application.",
    explanation_vi: "Email công việc cần mở đầu lịch sự, yêu cầu rõ, và từ hành chính đúng.",
    explanation_en: "Workplace email needs a polite opening, clear request, and correct administrative vocabulary.",
    practiceType: "formal workplace email frame",
    practicePrompt_vi: "Viết email 2 câu hỏi trạng thái đơn hoặc biểu mẫu.",
    practicePrompt_en: "Write a two-sentence email asking about an application or form status.",
    routeIds: ["route-register-formal-email", "workplace-public-service-form"],
    canadaPractical: true,
  },
];
