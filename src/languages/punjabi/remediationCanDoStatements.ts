// src/languages/punjabi/remediationCanDoStatements.ts
//
// Punjabi remediation can-do statements for learner-facing readiness checks.
// Gurmukhi is primary; romanization is included where useful. These statements
// are study support only, not official placement or certification. Native
// review is deferred.

export type PunjabiCanDoFocus =
  | "script-confusion"
  | "romanization-dependence"
  | "word-order-transfer"
  | "postposition-errors"
  | "agreement-issues"
  | "register-mismatch"
  | "public-service-phrase-gaps";

export type PunjabiCanDoLevel = "foundation" | "guided" | "independent";

export type PunjabiCanDoAudience = "vi" | "en" | "both";

export interface PunjabiRemediationCanDoStatement {
  id: string;
  focus: PunjabiCanDoFocus;
  level: PunjabiCanDoLevel;
  audience: PunjabiCanDoAudience;
  canDo_vi: string;
  canDo_en: string;
  checkpointTask_vi: string;
  checkpointTask_en: string;
  evidence_pa: string;
  evidence_roman?: string;
  evidence_en: string;
  readinessSignal: string;
  nextRemediation: string;
  learnerTip_vi: string;
  learnerTip_en: string;
  commonTrap?: string;
  canadaPractical?: boolean;
}

export const PUNJABI_CAN_DO_NOTICE =
  "Study support only; not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course. This is Wave 12 only, not A11 integration.";

export const PUNJABI_CAN_DO_FOCI: readonly PunjabiCanDoFocus[] = [
  "script-confusion",
  "romanization-dependence",
  "word-order-transfer",
  "postposition-errors",
  "agreement-issues",
  "register-mismatch",
  "public-service-phrase-gaps",
] as const;

export const PUNJABI_CAN_DO_LEVELS: readonly PunjabiCanDoLevel[] = [
  "foundation",
  "guided",
  "independent",
] as const;

export const PUNJABI_CAN_DO_AUDIENCES: readonly PunjabiCanDoAudience[] = [
  "vi",
  "en",
  "both",
] as const;

export const punjabiRemediationCanDoStatements: PunjabiRemediationCanDoStatement[] = [
  {
    id: "can-do-script-b-p-foundation",
    focus: "script-confusion",
    level: "foundation",
    audience: "both",
    canDo_vi: "Tôi có thể phân biệt ਬ và ਪ trong từ quen thuộc.",
    canDo_en: "I can distinguish ਬ and ਪ in familiar words.",
    checkpointTask_vi: "Đọc biển ngắn và khoanh chữ ਬ.",
    checkpointTask_en: "Read a short sign and circle ਬ.",
    evidence_pa: "ਬੱਸ ਅੱਡਾ",
    evidence_roman: "bas adda",
    evidence_en: "bus stand",
    readinessSignal: "Reads the sign without confusing ਬ/ਪ.",
    nextRemediation: "gurmukhi-pair-babba-pappa",
    learnerTip_vi: "Đọc chữ đầu trước khi đoán nghĩa từ ngữ cảnh.",
    learnerTip_en: "Read the first letter before guessing from context.",
    commonTrap: "Guessing transport words from context.",
    canadaPractical: true,
  },
  {
    id: "can-do-script-vowel-guided",
    focus: "script-confusion",
    level: "guided",
    audience: "both",
    canDo_vi: "Tôi có thể nhận ra dấu nguyên âm trước khi đọc cả từ.",
    canDo_en: "I can notice vowel signs before reading the whole word.",
    checkpointTask_vi: "Gạch chân ੀ trong câu hỏi rồi đọc câu.",
    checkpointTask_en: "Underline ੀ in the question, then read it.",
    evidence_pa: "ਕੀ ਤੁਹਾਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
    evidence_roman: "ki tuhanu madad chahidi hai?",
    evidence_en: "Do you need help?",
    readinessSignal: "Names the vowel sign and reads ਕੀ correctly.",
    nextRemediation: "gurmukhi-vowel-sign-ee",
    learnerTip_vi: "Dấu nguyên âm là một phần của chữ, không phải trang trí.",
    learnerTip_en: "The vowel sign is part of the word, not decoration.",
  },
  {
    id: "can-do-romanization-cover-foundation",
    focus: "romanization-dependence",
    level: "foundation",
    audience: "both",
    canDo_vi: "Tôi có thể đọc câu Gurmukhi quen thuộc khi romanization bị che.",
    canDo_en: "I can read a familiar Gurmukhi sentence when romanization is hidden.",
    checkpointTask_vi: "Che romanization và đọc câu Gurmukhi hai lần.",
    checkpointTask_en: "Cover romanization and read the Gurmukhi sentence twice.",
    evidence_pa: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    evidence_roman: "mainu madad chahidi hai.",
    evidence_en: "I need help.",
    readinessSignal: "Reads Gurmukhi first, then uses romanization only to check.",
    nextRemediation: "romanization-read-gurmukhi-first",
    learnerTip_vi: "Romanization là công cụ kiểm tra sau, không phải dòng đọc chính.",
    learnerTip_en: "Romanization is a later check, not the main reading line.",
  },
  {
    id: "can-do-shahmukhi-awareness-independent",
    focus: "romanization-dependence",
    level: "independent",
    audience: "both",
    canDo_vi: "Tôi có thể nói rõ rằng bài này dùng Gurmukhi chính.",
    canDo_en: "I can state that this lesson uses Gurmukhi as primary.",
    checkpointTask_vi: "Chọn mục tiêu chữ viết chính của khóa.",
    checkpointTask_en: "Choose the primary script goal of the course.",
    evidence_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਪੜ੍ਹਦੇ ਹਾਂ।",
    evidence_roman: "asi gurmukhi parhde haan.",
    evidence_en: "We study Gurmukhi.",
    readinessSignal: "Keeps Shahmukhi as awareness only, not a full course.",
    nextRemediation: "gurmukhi-shahmukhi-awareness",
    learnerTip_vi: "Shahmukhi chỉ để nhận biết trong phần này.",
    learnerTip_en: "Shahmukhi is awareness only in this section.",
  },
  {
    id: "can-do-word-order-sov-guided",
    focus: "word-order-transfer",
    level: "guided",
    audience: "both",
    canDo_vi: "Tôi có thể đặt tân ngữ trước động từ trong câu đơn.",
    canDo_en: "I can place the object before the verb in simple sentences.",
    checkpointTask_vi: "Sắp xếp câu theo khung subject + object + verb.",
    checkpointTask_en: "Order the sentence with subject + object + verb.",
    evidence_pa: "ਮੈਂ ਸੇਬ ਖਾਂਦਾ ਹਾਂ।",
    evidence_roman: "main seb khanda haan.",
    evidence_en: "I eat an apple.",
    readinessSignal: "Correctly repairs SVO transfer into Punjabi SOV order.",
    nextRemediation: "word-order-object-before-verb",
    learnerTip_vi: "Trước khi nói động từ, hãy đặt vật/người bị tác động vào trước.",
    learnerTip_en: "Before the verb, place the thing or person being acted on.",
  },
  {
    id: "can-do-english-auxiliary-guided",
    focus: "word-order-transfer",
    level: "guided",
    audience: "en",
    canDo_vi: "Tôi có thể đưa ਹਾਂ về cuối câu 'I am X'.",
    canDo_en: "I can move ਹਾਂ to the end of 'I am X' sentences.",
    checkpointTask_vi: "Sửa câu bị ảnh hưởng bởi tiếng Anh.",
    checkpointTask_en: "Correct a sentence affected by English order.",
    evidence_pa: "ਮੈਂ ਵਿਦਿਆਰਥੀ ਹਾਂ।",
    evidence_roman: "main vidyarthi haan.",
    evidence_en: "I am a student.",
    readinessSignal: "Produces ਮੈਂ X ਹਾਂ without placing ਹਾਂ after ਮੈਂ.",
    nextRemediation: "english-transfer-am-is-are",
    learnerTip_vi: "Đừng đặt 'am' theo trật tự tiếng Anh.",
    learnerTip_en: "Do not place 'am' according to English order.",
  },
  {
    id: "can-do-vietnamese-subject-guided",
    focus: "word-order-transfer",
    level: "guided",
    audience: "vi",
    canDo_vi: "Tôi có thể thêm chủ ngữ rõ khi viết câu Punjabi ngắn.",
    canDo_en: "I can add a clear subject when writing short Punjabi sentences.",
    checkpointTask_vi: "Sửa câu thiếu chủ ngữ bằng cách thêm ਮੈਂ hoặc ਅਸੀਂ.",
    checkpointTask_en: "Repair a missing-subject sentence by adding ਮੈਂ or ਅਸੀਂ.",
    evidence_pa: "ਮੈਂ ਅੱਜ ਕੰਮ ਤੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ।",
    evidence_roman: "main ajj kamm te janda/jandi haan.",
    evidence_en: "I go to work today.",
    readinessSignal: "Adds an explicit Punjabi subject instead of relying on Vietnamese topic-drop habits.",
    nextRemediation: "vietnamese-transfer-explicit-subject",
    learnerTip_vi: "Tiếng Việt có thể bỏ chủ ngữ theo ngữ cảnh; trong bài Punjabi, hãy viết rõ chủ ngữ trước.",
    learnerTip_en: "Vietnamese can omit a context-clear subject; in Punjabi practice, write the subject clearly first.",
    commonTrap: "Leaving out the subject because the context feels obvious.",
  },
  {
    id: "can-do-postposition-nu-guided",
    focus: "postposition-errors",
    level: "guided",
    audience: "both",
    canDo_vi: "Tôi có thể dùng ਨੂੰ với tân ngữ người cụ thể.",
    canDo_en: "I can use ਨੂੰ with a specific human object.",
    checkpointTask_vi: "Điền hậu giới từ đúng trong câu có 'him/her'.",
    checkpointTask_en: "Fill the correct postposition in a sentence with 'him/her'.",
    evidence_pa: "ਮੈਂ ਉਸਨੂੰ ਦੇਖਿਆ।",
    evidence_roman: "main usnu dekhia.",
    evidence_en: "I saw him/her.",
    readinessSignal: "Adds ਨੂੰ without adding it mechanically to every object.",
    nextRemediation: "postpositions-nu-human-object",
    learnerTip_vi: "Với người cụ thể làm tân ngữ, kiểm tra ਨੂੰ.",
    learnerTip_en: "For a specific person as object, check for ਨੂੰ.",
  },
  {
    id: "can-do-postposition-location-independent",
    focus: "postposition-errors",
    level: "independent",
    audience: "both",
    canDo_vi: "Tôi có thể dùng trật tự danh từ + hậu giới từ trong cụm nơi chốn.",
    canDo_en: "I can use noun + postposition order in location phrases.",
    checkpointTask_vi: "Viết 'in the office' bằng Punjabi.",
    checkpointTask_en: "Write 'in the office' in Punjabi.",
    evidence_pa: "ਦਫ਼ਤਰ ਵਿੱਚ",
    evidence_roman: "daftar vich",
    evidence_en: "in the office",
    readinessSignal: "Produces noun + ਵਿੱਚ instead of English/Vietnamese preposition order.",
    nextRemediation: "postpositions-location-vich",
    learnerTip_vi: "Hãy nghĩ 'office-in', không phải 'in-office'.",
    learnerTip_en: "Think 'office-in', not 'in-office'.",
    canadaPractical: true,
  },
  {
    id: "can-do-agreement-possessive-guided",
    focus: "agreement-issues",
    level: "guided",
    audience: "both",
    canDo_vi: "Tôi có thể chọn ਮੇਰਾ/ਮੇਰੀ/ਮੇਰੇ theo danh từ.",
    canDo_en: "I can choose ਮੇਰਾ/ਮੇਰੀ/ਮੇਰੇ according to the noun.",
    checkpointTask_vi: "Chọn dạng 'my' phù hợp với ਕਿਤਾਬ.",
    checkpointTask_en: "Choose the form of 'my' that matches ਕਿਤਾਬ.",
    evidence_pa: "ਮੇਰੀ ਕਿਤਾਬ",
    evidence_roman: "meri kitaab",
    evidence_en: "my book",
    readinessSignal: "Uses ਮੇਰੀ with ਕਿਤਾਬ and can explain the chunk.",
    nextRemediation: "gender-number-mera-meri",
    learnerTip_vi: "Học theo cụm danh từ, không học một từ 'my' duy nhất.",
    learnerTip_en: "Learn noun chunks, not one universal word for 'my'.",
  },
  {
    id: "can-do-agreement-perfective-guided",
    focus: "agreement-issues",
    level: "guided",
    audience: "both",
    canDo_vi: "Tôi có thể dùng cụm quá khứ hoàn thành quen thuộc như ਰੋਟੀ ਖਾਧੀ.",
    canDo_en: "I can use familiar perfective chunks such as ਰੋਟੀ ਖਾਧੀ.",
    checkpointTask_vi: "Điền dạng đúng của 'eat' với ਰੋਟੀ.",
    checkpointTask_en: "Fill the correct form of 'eat' with ਰੋਟੀ.",
    evidence_pa: "ਉਸ ਨੇ ਰੋਟੀ ਖਾਧੀ।",
    evidence_roman: "us ne roti khaadhi.",
    evidence_en: "He/she ate roti.",
    readinessSignal: "Produces ਖਾਧੀ with ਰੋਟੀ in a controlled sentence.",
    nextRemediation: "gender-number-perfective-roti",
    learnerTip_vi: "Luyện theo cụm cố định trước khi viết tự do.",
    learnerTip_en: "Drill fixed chunks before free writing.",
  },
  {
    id: "can-do-register-counter-guided",
    focus: "register-mismatch",
    level: "guided",
    audience: "both",
    canDo_vi: "Tôi có thể biến mệnh lệnh thành lời nhờ lịch sự ở quầy dịch vụ.",
    canDo_en: "I can turn a command into a polite service-counter request.",
    checkpointTask_vi: "Viết lại 'ਫਾਰਮ ਦੇ!' cho lịch sự.",
    checkpointTask_en: "Rewrite 'ਫਾਰਮ ਦੇ!' politely.",
    evidence_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਫਾਰਮ ਦੇ ਦਿਓ ਜੀ।",
    evidence_roman: "kirpa karke mainu form de dio ji.",
    evidence_en: "Please give me the form.",
    readinessSignal: "Uses ਕਿਰਪਾ ਕਰਕੇ and ਜੀ in service contexts.",
    nextRemediation: "register-soften-requests",
    learnerTip_vi: "Câu đúng nghĩa vẫn có thể chưa đúng register.",
    learnerTip_en: "A sentence can be meaningful but still wrong for register.",
    commonTrap: "Using bare commands with staff.",
    canadaPractical: true,
  },
  {
    id: "can-do-public-service-library-card",
    focus: "public-service-phrase-gaps",
    level: "independent",
    audience: "both",
    canDo_vi: "Tôi có thể yêu cầu làm thẻ thư viện bằng câu đầy đủ.",
    canDo_en: "I can request a library card with a complete sentence.",
    checkpointTask_vi: "Nói bạn muốn làm thẻ thư viện.",
    checkpointTask_en: "Say that you would like to get a library card.",
    evidence_pa: "ਮੈਂ ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ ਬਣਵਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।",
    evidence_roman: "main library card banvauna chahunda/chahundi haan.",
    evidence_en: "I would like to get a library card.",
    readinessSignal: "Uses a full service request frame, not just a noun.",
    nextRemediation: "public-service-library-card",
    learnerTip_vi: "Danh từ riêng lẻ chưa phải yêu cầu.",
    learnerTip_en: "A noun alone is not a request.",
    canadaPractical: true,
  },
  {
    id: "can-do-public-service-deadline",
    focus: "public-service-phrase-gaps",
    level: "independent",
    audience: "both",
    canDo_vi: "Tôi có thể hỏi hạn nộp đơn một cách lịch sự.",
    canDo_en: "I can ask politely about an application deadline.",
    checkpointTask_vi: "Hỏi 'đơn này phải nộp trước khi nào?'",
    checkpointTask_en: "Ask 'by when must this application be submitted?'",
    evidence_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਇਹ ਅਰਜ਼ੀ ਕਦੋਂ ਤੱਕ ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ?",
    evidence_roman: "kirpa karke dasso, ih arzi kadon takk jamma karni hai?",
    evidence_en: "Please tell me, by when must this application be submitted?",
    readinessSignal: "Combines polite opener, deadline phrase, and submission verb.",
    nextRemediation: "route-b2-deadline-submission",
    learnerTip_vi: "Kết hợp ਕਦੋਂ ਤੱਕ với ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ.",
    learnerTip_en: "Combine ਕਦੋਂ ਤੱਕ with ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ.",
    canadaPractical: true,
  },
  {
    id: "can-do-public-service-clinic",
    focus: "public-service-phrase-gaps",
    level: "guided",
    audience: "both",
    canDo_vi: "Tôi có thể nói rằng tôi cần đặt lịch hẹn với bác sĩ.",
    canDo_en: "I can say that I need to book a doctor's appointment.",
    checkpointTask_vi: "Tạo một câu đặt lịch hẹn với bác sĩ.",
    checkpointTask_en: "Create one sentence to book a doctor's appointment.",
    evidence_pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨਾਲ ਅਪਾਇੰਟਮੈਂਟ ਲੈਣੀ ਹੈ।",
    evidence_roman: "mainu doctor naal appointment laini hai.",
    evidence_en: "I need to book an appointment with a doctor.",
    readinessSignal: "Produces a full appointment frame instead of only ਡਾਕਟਰ.",
    nextRemediation: "public-service-appointment-clinic",
    learnerTip_vi: "Biết danh từ ਡਾਕਟਰ chưa đủ; cần khung chức năng.",
    learnerTip_en: "Knowing ਡਾਕਟਰ is not enough; use the functional frame.",
    canadaPractical: true,
  },
];
