// src/languages/punjabi/remediationGoldenSamples.ts
//
// Punjabi remediation golden samples for final QA and integration readiness.
// Gurmukhi is primary; romanization is included only as support. These samples
// are study support only, not official placement or certification. Native
// review is deferred.

export type PunjabiGoldenSampleFocus =
  | "script-confusion"
  | "romanization-dependence"
  | "word-order"
  | "postpositions"
  | "gender-number-agreement"
  | "register-mismatch"
  | "vietnamese-transfer"
  | "english-transfer"
  | "canada-practical-phrase-gaps";

export type PunjabiGoldenSampleReadiness = "needs-repair" | "guided-pass" | "integration-ready";

export interface PunjabiRemediationGoldenSample {
  id: string;
  focus: PunjabiGoldenSampleFocus;
  readiness: PunjabiGoldenSampleReadiness;
  audience: "vi" | "en" | "both";
  flawed_pa?: string;
  golden_pa: string;
  golden_roman?: string;
  golden_en: string;
  explanation_vi: string;
  explanation_en: string;
  qaCheck_vi: string;
  qaCheck_en: string;
  integrationSignal: string;
  remediationRouteId: string;
  commonTrap: string;
  canadaPractical?: boolean;
}

export const PUNJABI_REMEDIATION_GOLDEN_SAMPLES_NOTICE =
  "Wave 18 golden samples only; not A11 integration. Study support only, not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_GOLDEN_SAMPLE_FOCI: readonly PunjabiGoldenSampleFocus[] = [
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

export const PUNJABI_GOLDEN_SAMPLE_READINESS: readonly PunjabiGoldenSampleReadiness[] = [
  "needs-repair",
  "guided-pass",
  "integration-ready",
] as const;

export const punjabiRemediationGoldenSamples: PunjabiRemediationGoldenSample[] = [
  {
    id: "golden-script-b-p-transit",
    focus: "script-confusion",
    readiness: "needs-repair",
    audience: "both",
    flawed_pa: "ਪੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    golden_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    golden_roman: "bas adda kitthe hai?",
    golden_en: "Where is the bus stand?",
    explanation_vi: "Mẫu vàng yêu cầu đọc đúng ਬ trong ਬੱਸ trước khi đoán nghĩa biển giao thông.",
    explanation_en: "This golden sample requires reading ਬ in ਬੱਸ before guessing the transit sign meaning.",
    qaCheck_vi: "Khoanh ਬ rồi đọc cả câu không nhìn romanization.",
    qaCheck_en: "Circle ਬ, then read the whole sentence without romanization.",
    integrationSignal: "Learner reads a new transit sign without ਬ/ਪ reversal.",
    remediationRouteId: "route-script-babba-pappa",
    commonTrap: "Guessing from transport context before reading the first letter.",
    canadaPractical: true,
  },
  {
    id: "golden-script-vowel-help",
    focus: "script-confusion",
    readiness: "guided-pass",
    audience: "both",
    flawed_pa: "ਕ ਤੁਹਾਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
    golden_pa: "ਕੀ ਤੁਹਾਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
    golden_roman: "ki tuhanu madad chahidi hai?",
    golden_en: "Do you need help?",
    explanation_vi: "Dấu ੀ là một phần của ਕੀ, không phải trang trí.",
    explanation_en: "The ੀ sign is part of ਕੀ, not decoration.",
    qaCheck_vi: "Gạch chân ੀ trước khi đọc nghĩa câu hỏi.",
    qaCheck_en: "Underline ੀ before reading the question meaning.",
    integrationSignal: "Learner notices vowel signs before final QA meaning checks.",
    remediationRouteId: "route-script-vowel-signs",
    commonTrap: "Reading only the base consonant and inferring the question.",
  },
  {
    id: "golden-romanization-gurmukhi-first",
    focus: "romanization-dependence",
    readiness: "needs-repair",
    audience: "both",
    golden_pa: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    golden_roman: "mainu madad chahidi hai.",
    golden_en: "I need help.",
    explanation_vi: "Gurmukhi là dòng chính; romanization chỉ kiểm tra sau.",
    explanation_en: "Gurmukhi is the main line; romanization is only a later check.",
    qaCheck_vi: "Che romanization và đọc Gurmukhi hai lần.",
    qaCheck_en: "Cover romanization and read Gurmukhi twice.",
    integrationSignal: "Learner reads Gurmukhi first in final QA samples.",
    remediationRouteId: "romanization-read-gurmukhi-first",
    commonTrap: "Reading romanization fluently while Gurmukhi remains weak.",
    canadaPractical: true,
  },
  {
    id: "golden-shahmukhi-awareness",
    focus: "romanization-dependence",
    readiness: "integration-ready",
    audience: "both",
    golden_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਪੜ੍ਹਦੇ ਹਾਂ।",
    golden_roman: "asi gurmukhi parhde haan.",
    golden_en: "We study Gurmukhi.",
    explanation_vi: "Shahmukhi chỉ để nhận biết trong phần này, không phải khóa đầy đủ.",
    explanation_en: "Shahmukhi is awareness only in this section, not a full course.",
    qaCheck_vi: "Nêu rõ Gurmukhi là chữ chính trước bài đọc.",
    qaCheck_en: "State that Gurmukhi is primary before the reading task.",
    integrationSignal: "Learner keeps Gurmukhi as the working script in integration QA.",
    remediationRouteId: "gurmukhi-shahmukhi-awareness",
    commonTrap: "Expecting Shahmukhi to be tested as a full course here.",
  },
  {
    id: "golden-word-order-sov",
    focus: "word-order",
    readiness: "guided-pass",
    audience: "both",
    flawed_pa: "ਮੈਂ ਖਾਂਦਾ ਹਾਂ ਸੇਬ।",
    golden_pa: "ਮੈਂ ਸੇਬ ਖਾਂਦਾ ਹਾਂ।",
    golden_roman: "main seb khanda haan.",
    golden_en: "I eat an apple.",
    explanation_vi: "Trong câu đơn, tân ngữ ਸੇਬ đứng trước động từ.",
    explanation_en: "In this simple sentence, the object ਸੇਬ comes before the verb.",
    qaCheck_vi: "Chỉ ra subject, object, verb theo đúng thứ tự.",
    qaCheck_en: "Point out the subject, object, and verb in the correct order.",
    integrationSignal: "Learner repairs SVO transfer before free sentence production.",
    remediationRouteId: "word-order-object-before-verb",
    commonTrap: "Copying Vietnamese or English SVO order during fast translation.",
  },
  {
    id: "golden-english-auxiliary-final",
    focus: "english-transfer",
    readiness: "needs-repair",
    audience: "en",
    flawed_pa: "ਮੈਂ ਹਾਂ ਵਿਦਿਆਰਥੀ।",
    golden_pa: "ਮੈਂ ਵਿਦਿਆਰਥੀ ਹਾਂ।",
    golden_roman: "main vidyarthi haan.",
    golden_en: "I am a student.",
    explanation_vi: "Ảnh hưởng tiếng Anh đặt ਹਾਂ quá sớm; Punjabi để ਹਾਂ cuối khung.",
    explanation_en: "English transfer places ਹਾਂ too early; Punjabi keeps ਹਾਂ at the end of the frame.",
    qaCheck_vi: "Chuyển 'I am X' thành ਮੈਂ X ਹਾਂ.",
    qaCheck_en: "Convert 'I am X' into ਮੈਂ X ਹਾਂ.",
    integrationSignal: "Learner produces identity statements without English auxiliary order.",
    remediationRouteId: "english-transfer-am-is-are",
    commonTrap: "Mapping English 'I am' directly to ਮੈਂ ਹਾਂ.",
  },
  {
    id: "golden-vietnamese-subject-explicit",
    focus: "vietnamese-transfer",
    readiness: "guided-pass",
    audience: "vi",
    golden_pa: "ਮੈਂ ਅੱਜ ਕੰਮ ਤੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ।",
    golden_roman: "main ajj kamm te janda/jandi haan.",
    golden_en: "I go to work today.",
    explanation_vi: "Tiếng Việt có thể bỏ chủ ngữ theo ngữ cảnh; mẫu Punjabi cần viết rõ ਮੈਂ.",
    explanation_en: "Vietnamese can omit a context-clear subject; this Punjabi sample writes ਮੈਂ clearly.",
    qaCheck_vi: "Kiểm tra người làm hành động đã được viết rõ chưa.",
    qaCheck_en: "Check whether the doer of the action is written clearly.",
    integrationSignal: "Learner supplies explicit subjects in controlled integration samples.",
    remediationRouteId: "vietnamese-transfer-explicit-subject",
    commonTrap: "Leaving out the subject because context feels obvious.",
    canadaPractical: true,
  },
  {
    id: "golden-postposition-human-nu",
    focus: "postpositions",
    readiness: "guided-pass",
    audience: "both",
    flawed_pa: "ਮੈਂ ਉਸ ਦੇਖਿਆ।",
    golden_pa: "ਮੈਂ ਉਸਨੂੰ ਦੇਖਿਆ।",
    golden_roman: "main usnu dekhia.",
    golden_en: "I saw him/her.",
    explanation_vi: "Tân ngữ người cụ thể cần kiểm tra ਨੂੰ.",
    explanation_en: "A specific human object needs a check for ਨੂੰ.",
    qaCheck_vi: "Hỏi tân ngữ có phải người cụ thể không.",
    qaCheck_en: "Ask whether the object is a specific person.",
    integrationSignal: "Learner adds ਨੂੰ without adding it mechanically everywhere.",
    remediationRouteId: "postpositions-nu-human-object",
    commonTrap: "Skipping ਨੂੰ because English and Vietnamese do not mark this relation similarly.",
  },
  {
    id: "golden-postposition-location-office",
    focus: "postpositions",
    readiness: "integration-ready",
    audience: "both",
    flawed_pa: "ਵਿੱਚ ਦਫ਼ਤਰ",
    golden_pa: "ਦਫ਼ਤਰ ਵਿੱਚ",
    golden_roman: "daftar vich",
    golden_en: "in the office",
    explanation_vi: "Punjabi dùng danh từ + hậu giới từ, như ਦਫ਼ਤਰ ਵਿੱਚ.",
    explanation_en: "Punjabi uses noun + postposition, as in ਦਫ਼ਤਰ ਵਿੱਚ.",
    qaCheck_vi: "Viết danh từ trước, rồi đến ਵਿੱਚ.",
    qaCheck_en: "Write the noun first, then ਵਿੱਚ.",
    integrationSignal: "Learner explains noun + postposition order for service locations.",
    remediationRouteId: "postpositions-location-vich",
    commonTrap: "Putting ਵਿੱਚ before the noun by English/Vietnamese transfer.",
    canadaPractical: true,
  },
  {
    id: "golden-agreement-possessive-kitaab",
    focus: "gender-number-agreement",
    readiness: "guided-pass",
    audience: "both",
    flawed_pa: "ਮੇਰਾ ਕਿਤਾਬ",
    golden_pa: "ਮੇਰੀ ਕਿਤਾਬ",
    golden_roman: "meri kitaab",
    golden_en: "my book",
    explanation_vi: "Mẫu vàng kiểm tra agreement trong cụm danh từ, không học một từ 'my' duy nhất.",
    explanation_en: "The golden sample checks agreement in a noun chunk, not one universal word for 'my'.",
    qaCheck_vi: "Ghép ਮੇਰੀ với ਕਿਤਾਬ và giải thích theo cụm.",
    qaCheck_en: "Pair ਮੇਰੀ with ਕਿਤਾਬ and explain it as a chunk.",
    integrationSignal: "Learner matches possessive forms with familiar nouns.",
    remediationRouteId: "gender-number-mera-meri",
    commonTrap: "Using ਮੇਰਾ for every noun.",
  },
  {
    id: "golden-agreement-roti-perfective",
    focus: "gender-number-agreement",
    readiness: "guided-pass",
    audience: "both",
    flawed_pa: "ਉਸ ਨੇ ਰੋਟੀ ਖਾਧਾ।",
    golden_pa: "ਉਸ ਨੇ ਰੋਟੀ ਖਾਧੀ।",
    golden_roman: "us ne roti khaadhi.",
    golden_en: "He/she ate roti.",
    explanation_vi: "Cụm ਰੋਟੀ ਖਾਧੀ cần ổn định trước khi viết tự do.",
    explanation_en: "The chunk ਰੋਟੀ ਖਾਧੀ should be stable before free writing.",
    qaCheck_vi: "Sửa dạng quá khứ trong câu kiểm soát.",
    qaCheck_en: "Repair the past form in a controlled sentence.",
    integrationSignal: "Learner repairs familiar perfective chunks consistently.",
    remediationRouteId: "gender-number-perfective-roti",
    commonTrap: "Using one past form everywhere.",
  },
  {
    id: "golden-register-service-counter",
    focus: "register-mismatch",
    readiness: "needs-repair",
    audience: "both",
    flawed_pa: "ਫਾਰਮ ਦੇ!",
    golden_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਫਾਰਮ ਦੇ ਦਿਓ ਜੀ।",
    golden_roman: "kirpa karke mainu form de dio ji.",
    golden_en: "Please give me the form.",
    explanation_vi: "Câu dịch vụ công cần register lịch sự, không chỉ đúng nghĩa.",
    explanation_en: "A public-service sentence needs polite register, not only correct meaning.",
    qaCheck_vi: "Thêm ਕਿਰਪਾ ਕਰਕੇ và ਜੀ khi nói với nhân viên.",
    qaCheck_en: "Add ਕਿਰਪਾ ਕਰਕੇ and ਜੀ when speaking with staff.",
    integrationSignal: "Learner softens commands before service role play.",
    remediationRouteId: "register-soften-requests",
    commonTrap: "Assuming a bare command is acceptable because it is understandable.",
    canadaPractical: true,
  },
  {
    id: "golden-canada-library-card",
    focus: "canada-practical-phrase-gaps",
    readiness: "integration-ready",
    audience: "both",
    flawed_pa: "ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ",
    golden_pa: "ਮੈਂ ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ ਬਣਵਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।",
    golden_roman: "main library card banvauna chahunda/chahundi haan.",
    golden_en: "I would like to get a library card.",
    explanation_vi: "Từ vựng riêng lẻ chưa đủ; cần khung yêu cầu đầy đủ.",
    explanation_en: "A single vocabulary item is not enough; use a complete request frame.",
    qaCheck_vi: "Nói cả câu yêu cầu làm thẻ thư viện.",
    qaCheck_en: "Say the complete request for getting a library card.",
    integrationSignal: "Learner produces a complete library-card request.",
    remediationRouteId: "public-service-library-card",
    commonTrap: "Saying only the noun at a public-service desk.",
    canadaPractical: true,
  },
  {
    id: "golden-canada-application-deadline",
    focus: "canada-practical-phrase-gaps",
    readiness: "integration-ready",
    audience: "both",
    golden_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਇਹ ਅਰਜ਼ੀ ਕਦੋਂ ਤੱਕ ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ?",
    golden_roman: "kirpa karke dasso, ih arzi kadon takk jamma karni hai?",
    golden_en: "Please tell me, by when must this application be submitted?",
    explanation_vi: "Câu hỏi hạn nộp cần nêu rõ thời hạn và hành động ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ.",
    explanation_en: "A deadline question needs both the deadline and the action ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ.",
    qaCheck_vi: "Kết hợp ਕਦੋਂ ਤੱਕ với ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ.",
    qaCheck_en: "Combine ਕਦੋਂ ਤੱਕ with ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ.",
    integrationSignal: "Learner asks for both deadline and submission action politely.",
    remediationRouteId: "route-b2-deadline-submission",
    commonTrap: "Asking only a vague 'when?' question.",
    canadaPractical: true,
  },
  {
    id: "golden-canada-clinic-appointment",
    focus: "canada-practical-phrase-gaps",
    readiness: "guided-pass",
    audience: "both",
    flawed_pa: "ਡਾਕਟਰ",
    golden_pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨਾਲ ਅਪਾਇੰਟਮੈਂਟ ਲੈਣੀ ਹੈ।",
    golden_roman: "mainu doctor naal appointment laini hai.",
    golden_en: "I need to book an appointment with a doctor.",
    explanation_vi: "Tình huống phòng khám cần khung đặt lịch, không chỉ danh từ ਡਾਕਟਰ.",
    explanation_en: "A clinic situation needs the booking frame, not only the noun ਡਾਕਟਰ.",
    qaCheck_vi: "Dùng khung ਅਪਾਇੰਟਮੈਂਟ ਲੈਣੀ ਹੈ.",
    qaCheck_en: "Use the frame ਅਪਾਇੰਟਮੈਂਟ ਲੈਣੀ ਹੈ.",
    integrationSignal: "Learner produces a full clinic appointment request.",
    remediationRouteId: "public-service-appointment-clinic",
    commonTrap: "Knowing the noun for doctor but missing the service action.",
    canadaPractical: true,
  },
];
