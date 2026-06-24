// src/languages/punjabi/learnerSignals.ts
//
// Punjabi learner signal definitions for routing. Gurmukhi is primary;
// romanization is included where useful. These signals are study support only,
// not official placement or certification. Native review is deferred.

export type PunjabiLearnerSignalType =
  | "script-confusion"
  | "romanization-dependence"
  | "literal-transfer"
  | "postposition-errors"
  | "agreement-errors"
  | "register-mismatch"
  | "survival-phrase-misuse"
  | "public-service-gaps";

export type PunjabiLearnerSignalAudience = "vi" | "en" | "both";

export type PunjabiSignalSeverity = "low" | "medium" | "high";

export interface PunjabiLearnerSignal {
  id: string;
  signalType: PunjabiLearnerSignalType;
  audience: PunjabiLearnerSignalAudience;
  severity: PunjabiSignalSeverity;
  detectorHint: string;
  exampleMistake: string;
  target_pa: string;
  target_roman?: string;
  target_en: string;
  interpretation_vi: string;
  interpretation_en: string;
  routingAction: string;
  suggestedPracticeIds: string[];
  commonTrap?: string;
  canadaPractical?: boolean;
}

export const PUNJABI_LEARNER_SIGNALS_NOTICE =
  "Study support only; not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_LEARNER_SIGNAL_TYPES: readonly PunjabiLearnerSignalType[] = [
  "script-confusion",
  "romanization-dependence",
  "literal-transfer",
  "postposition-errors",
  "agreement-errors",
  "register-mismatch",
  "survival-phrase-misuse",
  "public-service-gaps",
] as const;

export const PUNJABI_LEARNER_SIGNAL_AUDIENCES: readonly PunjabiLearnerSignalAudience[] = [
  "vi",
  "en",
  "both",
] as const;

export const PUNJABI_SIGNAL_SEVERITIES: readonly PunjabiSignalSeverity[] = [
  "low",
  "medium",
  "high",
] as const;

export const punjabiLearnerSignals: PunjabiLearnerSignal[] = [
  {
    id: "signal-script-b-p-confusion",
    signalType: "script-confusion",
    audience: "both",
    severity: "medium",
    detectorHint: "Learner confuses ਬ and ਪ in common words or transport signs.",
    exampleMistake: "Reads ਬੱਸ as ਪੱਸ.",
    target_pa: "ਬੱਸ ਅੱਡਾ",
    target_roman: "bas adda",
    target_en: "bus stand",
    interpretation_vi: "Tín hiệu này cho thấy cần luyện phân biệt chữ Gurmukhi gần giống.",
    interpretation_en: "This signal indicates a need for similar-letter Gurmukhi discrimination.",
    routingAction: "Route to script minimal-pair drills before longer reading.",
    suggestedPracticeIds: ["script-bus-babba-pappa", "route-script-babba-pappa"],
    commonTrap: "Guessing from context instead of reading the first letter.",
    canadaPractical: true,
  },
  {
    id: "signal-script-vowel-sign-skip",
    signalType: "script-confusion",
    audience: "both",
    severity: "medium",
    detectorHint: "Learner reads words as if vowel signs were absent.",
    exampleMistake: "Reads ਕੀ as ਕ.",
    target_pa: "ਕੀ ਤੁਹਾਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
    target_roman: "ki tuhanu madad chahidi hai?",
    target_en: "Do you need help?",
    interpretation_vi: "Người học chưa quét dấu nguyên âm trước khi đọc cả từ.",
    interpretation_en: "The learner is not scanning vowel signs before reading the full word.",
    routingAction: "Route to vowel-sign scan and Gurmukhi-first reading.",
    suggestedPracticeIds: ["script-vowel-sign-ki", "route-script-vowel-signs"],
  },
  {
    id: "signal-romanization-cannot-read-gurmukhi",
    signalType: "romanization-dependence",
    audience: "both",
    severity: "high",
    detectorHint: "Learner succeeds with Latin romanization but fails on the same Gurmukhi sentence.",
    exampleMistake: "Reads mainu madad chahidi hai but not ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    target_pa: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    target_roman: "mainu madad chahidi hai.",
    target_en: "I need help.",
    interpretation_vi: "Romanization đang trở thành văn bản chính, làm chậm đọc Gurmukhi.",
    interpretation_en: "Romanization is becoming the main text and slowing Gurmukhi reading.",
    routingAction: "Hide romanization by default and route to Gurmukhi-first drills.",
    suggestedPracticeIds: ["romanization-main-text", "route-romanization-cover-first"],
  },
  {
    id: "signal-romanization-shahmukhi-boundary",
    signalType: "romanization-dependence",
    audience: "both",
    severity: "low",
    detectorHint: "Learner mixes Gurmukhi spelling tasks with Shahmukhi reference material.",
    exampleMistake: "Uses Shahmukhi material as the answer to a Gurmukhi spelling drill.",
    target_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਪੜ੍ਹਦੇ ਹਾਂ।",
    target_roman: "asi gurmukhi parhde haan.",
    target_en: "We study Gurmukhi.",
    interpretation_vi: "Cần làm rõ: Gurmukhi là chính; Shahmukhi chỉ để nhận biết, không phải khóa đầy đủ.",
    interpretation_en: "Clarify that Gurmukhi is primary; Shahmukhi is awareness only, not a full course.",
    routingAction: "Route to script-goal reset before spelling assessment.",
    suggestedPracticeIds: ["romanization-shahmukhi-mix", "route-romanization-shahmukhi-boundary"],
  },
  {
    id: "signal-transfer-english-auxiliary",
    signalType: "literal-transfer",
    audience: "en",
    severity: "medium",
    detectorHint: "Learner places ਹਾਂ immediately after ਮੈਂ in identity sentences.",
    exampleMistake: "ਮੈਂ ਹਾਂ ਵਿਦਿਆਰਥੀ।",
    target_pa: "ਮੈਂ ਵਿਦਿਆਰਥੀ ਹਾਂ।",
    target_roman: "main vidyarthi haan.",
    target_en: "I am a student.",
    interpretation_vi: "Đây là chuyển dịch trật tự tiếng Anh 'I am X' sang Punjabi.",
    interpretation_en: "This is English 'I am X' word order transferred into Punjabi.",
    routingAction: "Route to auxiliary-final and SOV word-order practice.",
    suggestedPracticeIds: ["word-order-auxiliary-early", "route-transfer-english-auxiliary"],
  },
  {
    id: "signal-transfer-vietnamese-subject-drop",
    signalType: "literal-transfer",
    audience: "vi",
    severity: "medium",
    detectorHint: "Learner omits subject in written Punjabi where a clear subject is expected.",
    exampleMistake: "ਅੱਜ ਕੰਮ ਤੇ ਜਾਂਦਾ ਹਾਂ without ਮੈਂ in a beginner sentence.",
    target_pa: "ਮੈਂ ਅੱਜ ਕੰਮ ਤੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ।",
    target_roman: "main ajj kamm te janda/jandi haan.",
    target_en: "I go to work today.",
    interpretation_vi: "Ảnh hưởng tiếng Việt: có thể lược chủ ngữ khi ngữ cảnh rõ.",
    interpretation_en: "Vietnamese transfer: the subject can be dropped when context is clear.",
    routingAction: "Route to subject recovery and sentence-frame drills.",
    suggestedPracticeIds: ["route-transfer-vietnamese-subject-drop", "vietnamese-transfer-topic-drop"],
  },
  {
    id: "signal-transfer-svo-object",
    signalType: "literal-transfer",
    audience: "both",
    severity: "medium",
    detectorHint: "Learner places the object after the verb in simple Punjabi clauses.",
    exampleMistake: "ਮੈਂ ਖਾਂਦਾ ਸੇਬ ਹਾਂ।",
    target_pa: "ਮੈਂ ਸੇਬ ਖਾਂਦਾ ਹਾਂ।",
    target_roman: "main seb khanda haan.",
    target_en: "I eat an apple.",
    interpretation_vi: "Tiếng Việt/Anh đều có thể kéo người học về trật tự động từ trước tân ngữ.",
    interpretation_en: "Vietnamese/English can both pull learners toward verb-before-object order.",
    routingAction: "Route to SOV reorder drills.",
    suggestedPracticeIds: ["word-order-object-after-verb", "word-order-object-before-verb"],
  },
  {
    id: "signal-postposition-nu-missing",
    signalType: "postposition-errors",
    audience: "both",
    severity: "high",
    detectorHint: "Learner omits ਨੂੰ with a specific human object.",
    exampleMistake: "ਮੈਂ ਉਸ ਦੇਖਿਆ।",
    target_pa: "ਮੈਂ ਉਸਨੂੰ ਦੇਖਿਆ।",
    target_roman: "main usnu dekhia.",
    target_en: "I saw him/her.",
    interpretation_vi: "Người học chưa nhận ra hậu giới từ cho tân ngữ người/xác định.",
    interpretation_en: "The learner has not internalized postposition marking for definite human objects.",
    routingAction: "Route to human-object ਨੂੰ drills.",
    suggestedPracticeIds: ["postposition-human-object-nu", "route-postpositions-human-object"],
  },
  {
    id: "signal-postposition-location-order",
    signalType: "postposition-errors",
    audience: "both",
    severity: "medium",
    detectorHint: "Learner puts ਵਿੱਚ before the noun or copies English preposition order.",
    exampleMistake: "ਵਿੱਚ ਦਫ਼ਤਰ",
    target_pa: "ਦਫ਼ਤਰ ਵਿੱਚ",
    target_roman: "daftar vich",
    target_en: "in the office",
    interpretation_vi: "Đây là lỗi trật tự hậu giới từ: Punjabi đặt hậu giới từ sau danh từ.",
    interpretation_en: "This is postposition-order error: Punjabi puts the postposition after the noun.",
    routingAction: "Route to noun + postposition phrase swaps.",
    suggestedPracticeIds: ["postposition-location-before-noun", "route-postpositions-location-order"],
    canadaPractical: true,
  },
  {
    id: "signal-agreement-possessive",
    signalType: "agreement-errors",
    audience: "both",
    severity: "medium",
    detectorHint: "Learner uses ਮੇਰਾ as a default possessive for all nouns.",
    exampleMistake: "ਮੇਰਾ ਕਿਤਾਬ",
    target_pa: "ਮੇਰੀ ਕਿਤਾਬ",
    target_roman: "meri kitaab",
    target_en: "my book",
    interpretation_vi: "Tín hiệu này cho thấy cần luyện giống/số với cụm danh từ.",
    interpretation_en: "This signal indicates a need for gender/number noun-chunk practice.",
    routingAction: "Route to possessive agreement chunks.",
    suggestedPracticeIds: ["agreement-mera-kitaab", "route-agreement-mera-meri"],
  },
  {
    id: "signal-agreement-perfective",
    signalType: "agreement-errors",
    audience: "both",
    severity: "medium",
    detectorHint: "Learner uses masculine/default past form with ਰੋਟੀ.",
    exampleMistake: "ਉਸ ਨੇ ਰੋਟੀ ਖਾਧਾ।",
    target_pa: "ਉਸ ਨੇ ਰੋਟੀ ਖਾਧੀ।",
    target_roman: "us ne roti khaadhi.",
    target_en: "He/she ate roti.",
    interpretation_vi: "Lỗi cho thấy cần luyện mẫu quá khứ hoàn thành theo cụm quen thuộc.",
    interpretation_en: "The error points to perfective agreement practice through familiar chunks.",
    routingAction: "Route to perfective agreement drills.",
    suggestedPracticeIds: ["agreement-roti-khaadha", "route-agreement-perfective-roti"],
  },
  {
    id: "signal-register-tu-staff",
    signalType: "register-mismatch",
    audience: "both",
    severity: "high",
    detectorHint: "Learner uses ਤੂੰ or bare imperatives with staff, elders, or strangers.",
    exampleMistake: "ਫਾਰਮ ਦੇ!",
    target_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਫਾਰਮ ਦੇ ਦਿਓ ਜੀ।",
    target_roman: "kirpa karke mainu form de dio ji.",
    target_en: "Please give me the form.",
    interpretation_vi: "Tín hiệu register: câu có thể nghe quá thẳng hoặc bất lịch sự.",
    interpretation_en: "Register signal: the sentence may sound too direct or impolite.",
    routingAction: "Route to polite request rewrites with ਤੁਸੀਂ, ਕਿਰਪਾ ਕਰਕੇ, and ਜੀ.",
    suggestedPracticeIds: ["register-tu-service-staff", "route-register-tu-with-staff"],
    commonTrap: "Assuming short direct commands are neutral.",
    canadaPractical: true,
  },
  {
    id: "signal-survival-noun-only-help",
    signalType: "survival-phrase-misuse",
    audience: "both",
    severity: "high",
    detectorHint: "Learner uses isolated nouns instead of request frames in urgent/help contexts.",
    exampleMistake: "ਮਦਦ",
    target_pa: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    target_roman: "mainu madad chahidi hai.",
    target_en: "I need help.",
    interpretation_vi: "Danh từ riêng lẻ không đủ cho nhiệm vụ sinh tồn; cần khung yêu cầu.",
    interpretation_en: "A noun alone is not enough for survival tasks; the learner needs a request frame.",
    routingAction: "Route to survival request frame substitution.",
    suggestedPracticeIds: ["romanization-main-text", "functional-communication-help-request"],
    canadaPractical: true,
  },
  {
    id: "signal-survival-appointment-gap",
    signalType: "survival-phrase-misuse",
    audience: "both",
    severity: "high",
    detectorHint: "Learner names ਡਾਕਟਰ but cannot book or change an appointment.",
    exampleMistake: "ਡਾਕਟਰ ਅਪਾਇੰਟਮੈਂਟ?",
    target_pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨਾਲ ਅਪਾਇੰਟਮੈਂਟ ਲੈਣੀ ਹੈ।",
    target_roman: "mainu doctor naal appointment laini hai.",
    target_en: "I need to book an appointment with a doctor.",
    interpretation_vi: "Người học thiếu khung đặt lịch trong ngữ cảnh y tế.",
    interpretation_en: "The learner lacks an appointment-booking frame for clinic contexts.",
    routingAction: "Route to clinic appointment survival drills.",
    suggestedPracticeIds: ["route-vocabulary-health-service", "survival-clinic-appointment"],
    canadaPractical: true,
  },
  {
    id: "signal-public-service-card-request",
    signalType: "public-service-gaps",
    audience: "both",
    severity: "medium",
    detectorHint: "Learner says only the document/card noun at a counter.",
    exampleMistake: "ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ",
    target_pa: "ਮੈਂ ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ ਬਣਵਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।",
    target_roman: "main library card banvauna chahunda/chahundi haan.",
    target_en: "I would like to get a library card.",
    interpretation_vi: "Thiếu khung dịch vụ công để yêu cầu làm/được cấp giấy tờ.",
    interpretation_en: "The learner lacks a public-service frame for getting a document or card issued.",
    routingAction: "Route to document/card request frame substitutions.",
    suggestedPracticeIds: ["public-service-library-card-noun-only", "route-public-service-library-card"],
    canadaPractical: true,
  },
  {
    id: "signal-public-service-deadline",
    signalType: "public-service-gaps",
    audience: "both",
    severity: "medium",
    detectorHint: "Learner cannot ask by when a form or application is due.",
    exampleMistake: "ਅਰਜ਼ੀ ਕਦੋਂ?",
    target_pa: "ਇਹ ਅਰਜ਼ੀ ਕਦੋਂ ਤੱਕ ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ?",
    target_roman: "ih arzi kadon takk jamma karni hai?",
    target_en: "By when must this application be submitted?",
    interpretation_vi: "Thiếu cụm hạn nộp và động từ hành chính cho biểu mẫu.",
    interpretation_en: "The learner lacks deadline phrases and administrative verbs for forms.",
    routingAction: "Route to deadline and submission question drills.",
    suggestedPracticeIds: ["public-service-deadline-question", "route-public-service-deadline"],
    canadaPractical: true,
  },
];
