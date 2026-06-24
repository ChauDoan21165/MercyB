// src/languages/punjabi/remediationCapstone.ts
//
// Punjabi remediation capstone checkpoints for Vietnamese-speaking and
// English-speaking learners. Gurmukhi is primary; romanization is included
// where useful. This is study support only, not official certification.
// Native review is deferred.

export type PunjabiCapstoneFocus =
  | "script-confusion"
  | "romanization-dependence"
  | "word-order"
  | "postpositions"
  | "agreement"
  | "register-mismatch"
  | "vietnamese-transfer"
  | "english-transfer"
  | "canada-practical-phrase-gaps";

export type PunjabiCapstoneAudience = "vi" | "en" | "both";

export interface PunjabiRemediationCapstoneItem {
  id: string;
  focus: PunjabiCapstoneFocus;
  audience: PunjabiCapstoneAudience;
  checkpointTitle: string;
  learnerTask_vi: string;
  learnerTask_en: string;
  stimulus_pa: string;
  stimulus_roman?: string;
  expected_pa: string;
  expected_roman?: string;
  expected_en: string;
  diagnosisCue: string;
  routeIfMissed: string;
  feedback_vi: string;
  feedback_en: string;
  commonTrap?: string;
  canadaPractical?: boolean;
}

export const PUNJABI_REMEDIATION_CAPSTONE_NOTICE =
  "Study support only; not official certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_CAPSTONE_FOCI: readonly PunjabiCapstoneFocus[] = [
  "script-confusion",
  "romanization-dependence",
  "word-order",
  "postpositions",
  "agreement",
  "register-mismatch",
  "vietnamese-transfer",
  "english-transfer",
  "canada-practical-phrase-gaps",
] as const;

export const PUNJABI_CAPSTONE_AUDIENCES: readonly PunjabiCapstoneAudience[] = [
  "vi",
  "en",
  "both",
] as const;

export const punjabiRemediationCapstone: PunjabiRemediationCapstoneItem[] = [
  {
    id: "capstone-script-bus-sign",
    focus: "script-confusion",
    audience: "both",
    checkpointTitle: "Read a Canada-practical transit sign",
    learnerTask_vi: "Đọc biển Gurmukhi và nêu địa điểm.",
    learnerTask_en: "Read the Gurmukhi sign and state the place.",
    stimulus_pa: "ਬੱਸ ਅੱਡਾ",
    stimulus_roman: "bas adda",
    expected_pa: "ਇਹ ਬੱਸ ਅੱਡਾ ਹੈ।",
    expected_roman: "ih bas adda hai.",
    expected_en: "This is a bus stand.",
    diagnosisCue: "Confuses ਬ with ਪ or guesses from the image/context.",
    routeIfMissed: "route-script-babba-pappa",
    feedback_vi: "Quay lại luyện phân biệt ਬ/ਪ trước khi đọc thông báo dài hơn.",
    feedback_en: "Return to ਬ/ਪ discrimination before longer notices.",
    commonTrap: "Guessing transport vocabulary without reading the first Gurmukhi letter.",
    canadaPractical: true,
  },
  {
    id: "capstone-script-vowel-help",
    focus: "script-confusion",
    audience: "both",
    checkpointTitle: "Scan vowel signs before reading",
    learnerTask_vi: "Gạch chân dấu nguyên âm rồi đọc câu hỏi.",
    learnerTask_en: "Underline the vowel sign, then read the question.",
    stimulus_pa: "ਕੀ ਤੁਹਾਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
    stimulus_roman: "ki tuhanu madad chahidi hai?",
    expected_pa: "ਕੀ = question marker",
    expected_roman: "ki",
    expected_en: "ki marks a yes/no question here.",
    diagnosisCue: "Reads ਕੀ as ਕ or skips the ੀ sign.",
    routeIfMissed: "route-script-vowel-signs",
    feedback_vi: "Dấu ੀ là một phần của cách đọc, không phải chi tiết trang trí.",
    feedback_en: "The ੀ sign is part of the reading, not decoration.",
  },
  {
    id: "capstone-romanization-cover",
    focus: "romanization-dependence",
    audience: "both",
    checkpointTitle: "Read Gurmukhi with romanization hidden",
    learnerTask_vi: "Che romanization và đọc câu Gurmukhi trước.",
    learnerTask_en: "Cover romanization and read the Gurmukhi sentence first.",
    stimulus_pa: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    stimulus_roman: "mainu madad chahidi hai.",
    expected_pa: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    expected_roman: "mainu madad chahidi hai.",
    expected_en: "I need help.",
    diagnosisCue: "Can read Latin romanization but not the same Gurmukhi sentence.",
    routeIfMissed: "route-romanization-cover-first",
    feedback_vi: "Romanization chỉ dùng để kiểm tra sau, không thay thế Gurmukhi.",
    feedback_en: "Romanization is a later check, not a replacement for Gurmukhi.",
    commonTrap: "Treating romanization as the main course script.",
  },
  {
    id: "capstone-shahmukhi-awareness-boundary",
    focus: "romanization-dependence",
    audience: "both",
    checkpointTitle: "Keep script goals separate",
    learnerTask_vi: "Chọn mục tiêu chữ viết chính của bài này.",
    learnerTask_en: "Choose the primary script goal for this lesson.",
    stimulus_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਪੜ੍ਹਦੇ ਹਾਂ।",
    stimulus_roman: "asi gurmukhi parhde haan.",
    expected_pa: "ਗੁਰਮੁਖੀ ਮੁੱਖ ਹੈ।",
    expected_roman: "gurmukhi mukh hai.",
    expected_en: "Gurmukhi is primary.",
    diagnosisCue: "Mixes Shahmukhi reference material into Gurmukhi spelling answers.",
    routeIfMissed: "route-romanization-shahmukhi-boundary",
    feedback_vi: "Shahmukhi chỉ để nhận biết trong khóa này, không phải khóa đầy đủ.",
    feedback_en: "Shahmukhi is awareness only here, not a full course.",
  },
  {
    id: "capstone-word-order-sov",
    focus: "word-order",
    audience: "both",
    checkpointTitle: "Repair SOV order",
    learnerTask_vi: "Sửa câu sai theo trật tự Punjabi tự nhiên.",
    learnerTask_en: "Correct the sentence into natural Punjabi order.",
    stimulus_pa: "ਮੈਂ ਖਾਂਦਾ ਸੇਬ ਹਾਂ।",
    stimulus_roman: "main khanda seb haan.",
    expected_pa: "ਮੈਂ ਸੇਬ ਖਾਂਦਾ ਹਾਂ।",
    expected_roman: "main seb khanda haan.",
    expected_en: "I eat an apple.",
    diagnosisCue: "Places object after the verb from English/Vietnamese SVO transfer.",
    routeIfMissed: "word-order-object-before-verb",
    feedback_vi: "Đặt tân ngữ trước động từ: subject + object + verb.",
    feedback_en: "Place the object before the verb: subject + object + verb.",
  },
  {
    id: "capstone-word-order-auxiliary",
    focus: "english-transfer",
    audience: "en",
    checkpointTitle: "Move auxiliary to the end",
    learnerTask_vi: "Sửa câu bị ảnh hưởng bởi tiếng Anh.",
    learnerTask_en: "Fix the sentence affected by English order.",
    stimulus_pa: "ਮੈਂ ਹਾਂ ਵਿਦਿਆਰਥੀ।",
    stimulus_roman: "main haan vidyarthi.",
    expected_pa: "ਮੈਂ ਵਿਦਿਆਰਥੀ ਹਾਂ।",
    expected_roman: "main vidyarthi haan.",
    expected_en: "I am a student.",
    diagnosisCue: "Places ਹਾਂ like English 'am'.",
    routeIfMissed: "route-transfer-english-auxiliary",
    feedback_vi: "Trong Punjabi, ਹਾਂ thường đứng cuối mệnh đề.",
    feedback_en: "In Punjabi, ਹਾਂ normally closes the clause.",
  },
  {
    id: "capstone-postposition-nu",
    focus: "postpositions",
    audience: "both",
    checkpointTitle: "Mark a definite human object",
    learnerTask_vi: "Thêm hậu giới từ đúng cho tân ngữ là người.",
    learnerTask_en: "Add the correct postposition for a human object.",
    stimulus_pa: "ਮੈਂ ਉਸ ___ ਦੇਖਿਆ।",
    stimulus_roman: "main us ___ dekhia.",
    expected_pa: "ਮੈਂ ਉਸਨੂੰ ਦੇਖਿਆ।",
    expected_roman: "main usnu dekhia.",
    expected_en: "I saw him/her.",
    diagnosisCue: "Omitted ਨੂੰ with a specific person.",
    routeIfMissed: "route-postpositions-human-object",
    feedback_vi: "Với người cụ thể làm tân ngữ, kiểm tra ਨੂੰ.",
    feedback_en: "For a specific person as object, check for ਨੂੰ.",
  },
  {
    id: "capstone-postposition-location",
    focus: "postpositions",
    audience: "both",
    checkpointTitle: "Use noun plus postposition order",
    learnerTask_vi: "Viết 'in the office' theo trật tự Punjabi.",
    learnerTask_en: "Write 'in the office' in Punjabi order.",
    stimulus_pa: "ਦਫ਼ਤਰ + ਵਿੱਚ",
    expected_pa: "ਦਫ਼ਤਰ ਵਿੱਚ",
    expected_roman: "daftar vich",
    expected_en: "in the office",
    diagnosisCue: "Uses English/Vietnamese preposition order, e.g. ਵਿੱਚ ਦਫ਼ਤਰ.",
    routeIfMissed: "route-postpositions-location-order",
    feedback_vi: "Punjabi đặt hậu giới từ sau danh từ.",
    feedback_en: "Punjabi places the postposition after the noun.",
    canadaPractical: true,
  },
  {
    id: "capstone-agreement-possessive",
    focus: "agreement",
    audience: "both",
    checkpointTitle: "Match possessive to noun gender",
    learnerTask_vi: "Chọn dạng 'my' phù hợp với ਕਿਤਾਬ.",
    learnerTask_en: "Choose the form of 'my' that matches ਕਿਤਾਬ.",
    stimulus_pa: "___ ਕਿਤਾਬ",
    stimulus_roman: "___ kitaab",
    expected_pa: "ਮੇਰੀ ਕਿਤਾਬ",
    expected_roman: "meri kitaab",
    expected_en: "my book",
    diagnosisCue: "Uses ਮੇਰਾ as a default for all nouns.",
    routeIfMissed: "route-agreement-mera-meri",
    feedback_vi: "Học cụm danh từ theo giống/số: ਮੇਰੀ ਕਿਤਾਬ, ਮੇਰਾ ਫ਼ੋਨ.",
    feedback_en: "Learn gender/number chunks: ਮੇਰੀ ਕਿਤਾਬ, ਮੇਰਾ ਫ਼ੋਨ.",
  },
  {
    id: "capstone-agreement-perfective",
    focus: "agreement",
    audience: "both",
    checkpointTitle: "Repair perfective agreement",
    learnerTask_vi: "Điền dạng đúng của 'eat' với ਰੋਟੀ.",
    learnerTask_en: "Fill the correct form of 'eat' with ਰੋਟੀ.",
    stimulus_pa: "ਉਸ ਨੇ ਰੋਟੀ ___।",
    stimulus_roman: "us ne roti ___.",
    expected_pa: "ਉਸ ਨੇ ਰੋਟੀ ਖਾਧੀ।",
    expected_roman: "us ne roti khaadhi.",
    expected_en: "He/she ate roti.",
    diagnosisCue: "Uses ਖਾਧਾ instead of ਖਾਧੀ with ਰੋਟੀ.",
    routeIfMissed: "route-agreement-perfective-roti",
    feedback_vi: "Luyện cụm quá khứ hoàn thành quen thuộc: ਰੋਟੀ ਖਾਧੀ.",
    feedback_en: "Drill familiar perfective chunks: ਰੋਟੀ ਖਾਧੀ.",
  },
  {
    id: "capstone-register-counter-request",
    focus: "register-mismatch",
    audience: "both",
    checkpointTitle: "Rewrite a service-counter command",
    learnerTask_vi: "Chuyển mệnh lệnh thành lời nhờ lịch sự ở quầy dịch vụ.",
    learnerTask_en: "Turn a command into a polite service-counter request.",
    stimulus_pa: "ਫਾਰਮ ਦੇ!",
    stimulus_roman: "form de!",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਫਾਰਮ ਦੇ ਦਿਓ ਜੀ।",
    expected_roman: "kirpa karke mainu form de dio ji.",
    expected_en: "Please give me the form.",
    diagnosisCue: "Uses bare imperative or ਤੂੰ with staff.",
    routeIfMissed: "route-register-tu-with-staff",
    feedback_vi: "Dùng ਕਿਰਪਾ ਕਰਕੇ và ਜੀ để làm câu phù hợp register.",
    feedback_en: "Use ਕਿਰਪਾ ਕਰਕੇ and ਜੀ to make the request register-appropriate.",
    commonTrap: "Thinking short commands are neutral in service contexts.",
    canadaPractical: true,
  },
  {
    id: "capstone-vietnamese-subject-recovery",
    focus: "vietnamese-transfer",
    audience: "vi",
    checkpointTitle: "Recover the written subject",
    learnerTask_vi: "Thêm chủ ngữ rõ cho câu viết.",
    learnerTask_en: "Add a clear subject to the written sentence.",
    stimulus_pa: "ਅੱਜ ਕੰਮ ਤੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ।",
    stimulus_roman: "ajj kamm te janda/jandi haan.",
    expected_pa: "ਮੈਂ ਅੱਜ ਕੰਮ ਤੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ।",
    expected_roman: "main ajj kamm te janda/jandi haan.",
    expected_en: "I go to work today.",
    diagnosisCue: "Drops subject because Vietnamese context allows it.",
    routeIfMissed: "route-a2-vietnamese-subject-drop",
    feedback_vi: "Trong bài viết Punjabi, hãy hỏi 'ai làm?' và thêm chủ ngữ.",
    feedback_en: "In Punjabi writing practice, ask 'who does it?' and add the subject.",
  },
  {
    id: "capstone-canada-library-card",
    focus: "canada-practical-phrase-gaps",
    audience: "both",
    checkpointTitle: "Request a library card",
    learnerTask_vi: "Nói bạn muốn làm thẻ thư viện.",
    learnerTask_en: "Say that you would like to get a library card.",
    stimulus_pa: "ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ",
    stimulus_roman: "library card",
    expected_pa: "ਮੈਂ ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ ਬਣਵਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।",
    expected_roman: "main library card banvauna chahunda/chahundi haan.",
    expected_en: "I would like to get a library card.",
    diagnosisCue: "Uses only a noun instead of a service request frame.",
    routeIfMissed: "route-public-service-library-card",
    feedback_vi: "Danh từ riêng lẻ chưa phải yêu cầu; dùng khung ਬਣਵਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ.",
    feedback_en: "A noun alone is not a request; use the ਬਣਵਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ frame.",
    canadaPractical: true,
  },
  {
    id: "capstone-canada-application-deadline",
    focus: "canada-practical-phrase-gaps",
    audience: "both",
    checkpointTitle: "Ask about an application deadline",
    learnerTask_vi: "Hỏi hạn nộp đơn một cách lịch sự.",
    learnerTask_en: "Ask politely about an application deadline.",
    stimulus_pa: "ਅਰਜ਼ੀ / deadline",
    stimulus_roman: "arzi / deadline",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਇਹ ਅਰਜ਼ੀ ਕਦੋਂ ਤੱਕ ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ?",
    expected_roman: "kirpa karke dasso, ih arzi kadon takk jamma karni hai?",
    expected_en: "Please tell me, by when must this application be submitted?",
    diagnosisCue: "Cannot combine deadline phrase, submission verb, and polite register.",
    routeIfMissed: "route-b2-deadline-submission",
    feedback_vi: "Kết hợp ਕਦੋਂ ਤੱਕ, ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ, và ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ.",
    feedback_en: "Combine ਕਦੋਂ ਤੱਕ, ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ, and ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ.",
    canadaPractical: true,
  },
  {
    id: "capstone-canada-clinic-appointment",
    focus: "canada-practical-phrase-gaps",
    audience: "both",
    checkpointTitle: "Book a clinic appointment",
    learnerTask_vi: "Nói bạn cần đặt lịch hẹn với bác sĩ.",
    learnerTask_en: "Say that you need to book a doctor's appointment.",
    stimulus_pa: "ਡਾਕਟਰ / ਅਪਾਇੰਟਮੈਂਟ",
    stimulus_roman: "doctor / appointment",
    expected_pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨਾਲ ਅਪਾਇੰਟਮੈਂਟ ਲੈਣੀ ਹੈ।",
    expected_roman: "mainu doctor naal appointment laini hai.",
    expected_en: "I need to book an appointment with a doctor.",
    diagnosisCue: "Names the doctor but cannot form the appointment request.",
    routeIfMissed: "route-vocabulary-health-service",
    feedback_vi: "Học nguyên khung đặt lịch, không chỉ danh từ ਡਾਕਟਰ.",
    feedback_en: "Learn the full appointment frame, not only the noun ਡਾਕਟਰ.",
    canadaPractical: true,
  },
];
