// src/languages/punjabi/remediationSmokeDeck.ts
//
// Punjabi remediation smoke deck for final QA and integration readiness.
// Gurmukhi is primary; romanization is included only as support. This is study
// support only, not official placement or certification. Native review is
// deferred.

export type PunjabiSmokeDeckFocus =
  | "script-confusion"
  | "romanization-dependence"
  | "word-order"
  | "postpositions"
  | "gender-number-agreement"
  | "register-mismatch"
  | "vietnamese-transfer"
  | "english-transfer"
  | "canada-practical-phrase-gaps";

export type PunjabiSmokeDeckResult = "block" | "review" | "ready";

export interface PunjabiRemediationSmokeDeckItem {
  id: string;
  focus: PunjabiSmokeDeckFocus;
  expectedResult: PunjabiSmokeDeckResult;
  audience: "vi" | "en" | "both";
  prompt_vi: string;
  prompt_en: string;
  check_pa: string;
  check_roman?: string;
  check_en: string;
  passSignal: string;
  failSignal: string;
  remediationRouteId: string;
  qaNote_vi: string;
  qaNote_en: string;
  commonTrap: string;
  canadaPractical?: boolean;
}

export const PUNJABI_REMEDIATION_SMOKE_DECK_NOTICE =
  "Wave 19 smoke deck only; not A11 integration. Study support only, not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_SMOKE_DECK_FOCI: readonly PunjabiSmokeDeckFocus[] = [
  "script-confusion",
  "romanization-dependence",
  "word-order",
  "postpositions",
  "gender-number-agreement",
  "register-mismatch",
  "vietnamese-transfer",
  "english-transfer",
  "canada-practical-phrase-gaps",
] as const;

export const PUNJABI_SMOKE_DECK_RESULTS: readonly PunjabiSmokeDeckResult[] = [
  "block",
  "review",
  "ready",
] as const;

export const punjabiRemediationSmokeDeck: PunjabiRemediationSmokeDeckItem[] = [
  {
    id: "smoke-script-b-p-transit",
    focus: "script-confusion",
    expectedResult: "block",
    audience: "both",
    prompt_vi: "Đọc biển giao thông và xác định chữ đầu.",
    prompt_en: "Read the transit sign and identify the first letter.",
    check_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    check_roman: "bas adda kitthe hai?",
    check_en: "Where is the bus stand?",
    passSignal: "Reads ਬੱਸ without ਬ/ਪ reversal.",
    failSignal: "Reads or writes ਪੱਸ, or guesses from context.",
    remediationRouteId: "route-script-babba-pappa",
    qaNote_vi: "Nếu còn nhầm chữ, chặn hội thoại dài và quay lại luyện chữ.",
    qaNote_en: "If letter confusion remains, block longer dialogue and return to script drill.",
    commonTrap: "Guessing public signs from context before reading Gurmukhi.",
    canadaPractical: true,
  },
  {
    id: "smoke-script-vowel-question",
    focus: "script-confusion",
    expectedResult: "review",
    audience: "both",
    prompt_vi: "Kiểm tra dấu nguyên âm trước khi đọc nghĩa.",
    prompt_en: "Check the vowel sign before reading meaning.",
    check_pa: "ਕੀ ਤੁਹਾਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
    check_roman: "ki tuhanu madad chahidi hai?",
    check_en: "Do you need help?",
    passSignal: "Names ੀ and reads ਕੀ correctly.",
    failSignal: "Skips ੀ or reads only the base consonant.",
    remediationRouteId: "route-script-vowel-signs",
    qaNote_vi: "Dấu nguyên âm là một phần bắt buộc của chữ.",
    qaNote_en: "The vowel sign is a required part of the word.",
    commonTrap: "Treating vowel signs as decoration.",
  },
  {
    id: "smoke-romanization-gurmukhi-first",
    focus: "romanization-dependence",
    expectedResult: "block",
    audience: "both",
    prompt_vi: "Che romanization và đọc Gurmukhi trước.",
    prompt_en: "Cover romanization and read Gurmukhi first.",
    check_pa: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    check_roman: "mainu madad chahidi hai.",
    check_en: "I need help.",
    passSignal: "Reads Gurmukhi before revealing romanization.",
    failSignal: "Needs romanization to read the sentence.",
    remediationRouteId: "romanization-read-gurmukhi-first",
    qaNote_vi: "Romanization chỉ dùng để tự kiểm tra sau.",
    qaNote_en: "Romanization is only for later self-checking.",
    commonTrap: "Using romanization as the primary script.",
    canadaPractical: true,
  },
  {
    id: "smoke-shahmukhi-scope",
    focus: "romanization-dependence",
    expectedResult: "ready",
    audience: "both",
    prompt_vi: "Nêu mục tiêu chữ viết của phần này.",
    prompt_en: "State the script goal for this section.",
    check_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਪੜ੍ਹਦੇ ਹਾਂ।",
    check_roman: "asi gurmukhi parhde haan.",
    check_en: "We study Gurmukhi.",
    passSignal: "States Gurmukhi is primary and Shahmukhi is awareness only.",
    failSignal: "Expects Shahmukhi as a full course in this deck.",
    remediationRouteId: "gurmukhi-shahmukhi-awareness",
    qaNote_vi: "Shahmukhi chỉ để nhận biết, không phải khóa đầy đủ.",
    qaNote_en: "Shahmukhi is awareness only, not a full course.",
    commonTrap: "Mixing script goals during final QA.",
  },
  {
    id: "smoke-word-order-sov",
    focus: "word-order",
    expectedResult: "review",
    audience: "both",
    prompt_vi: "Sửa câu theo trật tự subject + object + verb.",
    prompt_en: "Repair the sentence using subject + object + verb order.",
    check_pa: "ਮੈਂ ਸੇਬ ਖਾਂਦਾ ਹਾਂ।",
    check_roman: "main seb khanda haan.",
    check_en: "I eat an apple.",
    passSignal: "Places ਸੇਬ before the verb.",
    failSignal: "Produces object-after-verb order.",
    remediationRouteId: "word-order-object-before-verb",
    qaNote_vi: "Tân ngữ đứng trước động từ trong mẫu này.",
    qaNote_en: "The object comes before the verb in this frame.",
    commonTrap: "Copying Vietnamese or English SVO order.",
  },
  {
    id: "smoke-english-auxiliary-final",
    focus: "english-transfer",
    expectedResult: "block",
    audience: "en",
    prompt_vi: "Sửa câu chịu ảnh hưởng 'I am X' của tiếng Anh.",
    prompt_en: "Repair the sentence affected by English 'I am X' order.",
    check_pa: "ਮੈਂ ਵਿਦਿਆਰਥੀ ਹਾਂ।",
    check_roman: "main vidyarthi haan.",
    check_en: "I am a student.",
    passSignal: "Places ਹਾਂ at the end.",
    failSignal: "Writes ਮੈਂ ਹਾਂ ਵਿਦਿਆਰਥੀ.",
    remediationRouteId: "english-transfer-am-is-are",
    qaNote_vi: "Đưa ਹਾਂ về cuối khung ਮੈਂ X ਹਾਂ.",
    qaNote_en: "Move ਹਾਂ to the end of the frame ਮੈਂ X ਹਾਂ.",
    commonTrap: "Mapping English 'I am' directly to ਮੈਂ ਹਾਂ.",
  },
  {
    id: "smoke-vietnamese-explicit-subject",
    focus: "vietnamese-transfer",
    expectedResult: "review",
    audience: "vi",
    prompt_vi: "Viết rõ chủ ngữ trước khi hoàn thành câu Punjabi.",
    prompt_en: "Write the subject clearly before completing the Punjabi sentence.",
    check_pa: "ਮੈਂ ਅੱਜ ਕੰਮ ਤੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ।",
    check_roman: "main ajj kamm te janda/jandi haan.",
    check_en: "I go to work today.",
    passSignal: "Includes an explicit ਮੈਂ or ਅਸੀਂ when needed.",
    failSignal: "Drops the subject because context feels clear.",
    remediationRouteId: "vietnamese-transfer-explicit-subject",
    qaNote_vi: "Tiếng Việt có thể bỏ chủ ngữ; mẫu Punjabi cần điểm neo rõ.",
    qaNote_en: "Vietnamese can drop subjects; the Punjabi sample needs a clear anchor.",
    commonTrap: "Leaving out the subject by Vietnamese habit.",
    canadaPractical: true,
  },
  {
    id: "smoke-postposition-human-nu",
    focus: "postpositions",
    expectedResult: "review",
    audience: "both",
    prompt_vi: "Kiểm tra tân ngữ người cụ thể và hậu giới từ ਨੂੰ.",
    prompt_en: "Check the specific human object and the postposition ਨੂੰ.",
    check_pa: "ਮੈਂ ਉਸਨੂੰ ਦੇਖਿਆ।",
    check_roman: "main usnu dekhia.",
    check_en: "I saw him/her.",
    passSignal: "Adds ਨੂੰ to the specific human object.",
    failSignal: "Writes ਮੈਂ ਉਸ ਦੇਖਿਆ.",
    remediationRouteId: "postpositions-nu-human-object",
    qaNote_vi: "Với người cụ thể làm tân ngữ, kiểm tra ਨੂੰ.",
    qaNote_en: "For a specific person as object, check for ਨੂੰ.",
    commonTrap: "Skipping ਨੂੰ because English and Vietnamese mark this differently.",
  },
  {
    id: "smoke-postposition-location-office",
    focus: "postpositions",
    expectedResult: "ready",
    audience: "both",
    prompt_vi: "Viết cụm nơi chốn theo khung danh từ + hậu giới từ.",
    prompt_en: "Write the location phrase as noun + postposition.",
    check_pa: "ਦਫ਼ਤਰ ਵਿੱਚ",
    check_roman: "daftar vich",
    check_en: "in the office",
    passSignal: "Produces noun + ਵਿੱਚ.",
    failSignal: "Places ਵਿੱਚ before the noun.",
    remediationRouteId: "postpositions-location-vich",
    qaNote_vi: "Punjabi dùng 'office-in', không phải 'in-office'.",
    qaNote_en: "Punjabi uses 'office-in', not 'in-office'.",
    commonTrap: "Using English or Vietnamese preposition order.",
    canadaPractical: true,
  },
  {
    id: "smoke-agreement-possessive",
    focus: "gender-number-agreement",
    expectedResult: "review",
    audience: "both",
    prompt_vi: "Chọn possessive phù hợp với ਕਿਤਾਬ.",
    prompt_en: "Choose the possessive that matches ਕਿਤਾਬ.",
    check_pa: "ਮੇਰੀ ਕਿਤਾਬ",
    check_roman: "meri kitaab",
    check_en: "my book",
    passSignal: "Pairs ਮੇਰੀ with ਕਿਤਾਬ.",
    failSignal: "Uses ਮੇਰਾ for every noun.",
    remediationRouteId: "gender-number-mera-meri",
    qaNote_vi: "Học theo cụm danh từ thay vì một từ 'my' duy nhất.",
    qaNote_en: "Learn noun chunks instead of one universal word for 'my'.",
    commonTrap: "Ignoring gender/number agreement in noun chunks.",
  },
  {
    id: "smoke-agreement-perfective-roti",
    focus: "gender-number-agreement",
    expectedResult: "review",
    audience: "both",
    prompt_vi: "Sửa cụm quá khứ hoàn thành với ਰੋਟੀ.",
    prompt_en: "Repair the perfective chunk with ਰੋਟੀ.",
    check_pa: "ਉਸ ਨੇ ਰੋਟੀ ਖਾਧੀ।",
    check_roman: "us ne roti khaadhi.",
    check_en: "He/she ate roti.",
    passSignal: "Uses ਖਾਧੀ with ਰੋਟੀ.",
    failSignal: "Uses ਖਾਧਾ in this controlled chunk.",
    remediationRouteId: "gender-number-perfective-roti",
    qaNote_vi: "Ổn định cụm quen thuộc trước khi viết tự do.",
    qaNote_en: "Stabilize familiar chunks before free writing.",
    commonTrap: "Using one past form everywhere.",
  },
  {
    id: "smoke-register-service-counter",
    focus: "register-mismatch",
    expectedResult: "block",
    audience: "both",
    prompt_vi: "Làm mềm yêu cầu ở quầy dịch vụ.",
    prompt_en: "Soften the service-counter request.",
    check_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਫਾਰਮ ਦੇ ਦਿਓ ਜੀ।",
    check_roman: "kirpa karke mainu form de dio ji.",
    check_en: "Please give me the form.",
    passSignal: "Uses polite request markers such as ਕਿਰਪਾ ਕਰਕੇ and ਜੀ.",
    failSignal: "Uses a bare command such as ਫਾਰਮ ਦੇ!",
    remediationRouteId: "register-soften-requests",
    qaNote_vi: "Câu đúng nghĩa vẫn cần đúng register.",
    qaNote_en: "A meaningful sentence still needs the right register.",
    commonTrap: "Using bare commands with staff.",
    canadaPractical: true,
  },
  {
    id: "smoke-canada-library-card",
    focus: "canada-practical-phrase-gaps",
    expectedResult: "ready",
    audience: "both",
    prompt_vi: "Tạo yêu cầu đầy đủ để làm thẻ thư viện.",
    prompt_en: "Create a full request to get a library card.",
    check_pa: "ਮੈਂ ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ ਬਣਵਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।",
    check_roman: "main library card banvauna chahunda/chahundi haan.",
    check_en: "I would like to get a library card.",
    passSignal: "Produces a complete library-card request.",
    failSignal: "Says only ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ.",
    remediationRouteId: "public-service-library-card",
    qaNote_vi: "Danh từ riêng lẻ chưa phải yêu cầu dịch vụ.",
    qaNote_en: "A noun alone is not a service request.",
    commonTrap: "Using vocabulary recall where a full request is needed.",
    canadaPractical: true,
  },
  {
    id: "smoke-canada-application-deadline",
    focus: "canada-practical-phrase-gaps",
    expectedResult: "ready",
    audience: "both",
    prompt_vi: "Hỏi hạn nộp đơn bằng câu lịch sự đầy đủ.",
    prompt_en: "Ask about an application deadline with a full polite sentence.",
    check_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਇਹ ਅਰਜ਼ੀ ਕਦੋਂ ਤੱਕ ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ?",
    check_roman: "kirpa karke dasso, ih arzi kadon takk jamma karni hai?",
    check_en: "Please tell me, by when must this application be submitted?",
    passSignal: "Asks for both deadline and submission action.",
    failSignal: "Asks only a vague 'when?' question.",
    remediationRouteId: "route-b2-deadline-submission",
    qaNote_vi: "Kết hợp ਕਦੋਂ ਤੱਕ với ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ.",
    qaNote_en: "Combine ਕਦੋਂ ਤੱਕ with ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ.",
    commonTrap: "Missing the submission verb in deadline questions.",
    canadaPractical: true,
  },
  {
    id: "smoke-canada-clinic-appointment",
    focus: "canada-practical-phrase-gaps",
    expectedResult: "review",
    audience: "both",
    prompt_vi: "Tạo câu đặt lịch hẹn bác sĩ.",
    prompt_en: "Create a sentence to book a doctor's appointment.",
    check_pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨਾਲ ਅਪਾਇੰਟਮੈਂਟ ਲੈਣੀ ਹੈ।",
    check_roman: "mainu doctor naal appointment laini hai.",
    check_en: "I need to book an appointment with a doctor.",
    passSignal: "Produces the full appointment-booking frame.",
    failSignal: "Says only ਡਾਕਟਰ.",
    remediationRouteId: "public-service-appointment-clinic",
    qaNote_vi: "Cần hành động đặt lịch, không chỉ danh từ ਡਾਕਟਰ.",
    qaNote_en: "Use the booking action, not only the noun ਡਾਕਟਰ.",
    commonTrap: "Knowing the noun but missing the service action.",
    canadaPractical: true,
  },
];
