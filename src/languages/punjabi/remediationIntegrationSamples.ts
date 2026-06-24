// src/languages/punjabi/remediationIntegrationSamples.ts
//
// Punjabi remediation integration samples for later app wiring. Gurmukhi is
// primary; romanization is included only as learner support. These samples are
// study support only, not official placement or certification. Native review is
// deferred.

export type PunjabiIntegrationSampleFocus =
  | "script-confusion"
  | "romanization-dependence"
  | "word-order"
  | "postpositions"
  | "gender-number-agreement"
  | "register-mismatch"
  | "vietnamese-transfer"
  | "english-transfer"
  | "canada-practical-phrase-gaps";

export type PunjabiIntegrationSampleUse =
  | "final-evidence"
  | "final-qa"
  | "handoff";

export interface PunjabiRemediationIntegrationSample {
  id: string;
  focus: PunjabiIntegrationSampleFocus;
  use: PunjabiIntegrationSampleUse;
  audience: "vi" | "en" | "both";
  sourceDeckId: string;
  routeId: string;
  evidence_pa: string;
  evidence_roman?: string;
  evidence_en: string;
  learnerPrompt_vi: string;
  learnerPrompt_en: string;
  expectedRepair: string;
  finalQaSignal: string;
  integrationNote_vi: string;
  integrationNote_en: string;
  commonTrap: string;
  canadaPractical?: boolean;
}

export const PUNJABI_REMEDIATION_INTEGRATION_SAMPLES_NOTICE =
  "Wave 20 integration samples only; not A11 integration. Study support only, not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_INTEGRATION_SAMPLE_FOCI: readonly PunjabiIntegrationSampleFocus[] = [
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

export const PUNJABI_INTEGRATION_SAMPLE_USES: readonly PunjabiIntegrationSampleUse[] = [
  "final-evidence",
  "final-qa",
  "handoff",
] as const;

export const punjabiRemediationIntegrationSamples: PunjabiRemediationIntegrationSample[] = [
  {
    id: "integration-script-b-p-transit",
    focus: "script-confusion",
    use: "final-evidence",
    audience: "both",
    sourceDeckId: "smoke-script-b-p-transit",
    routeId: "route-script-babba-pappa",
    evidence_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    evidence_roman: "bas adda kitthe hai?",
    evidence_en: "Where is the bus stand?",
    learnerPrompt_vi: "Đọc câu biển xe buýt và xác định chữ ਬ.",
    learnerPrompt_en: "Read the bus-stand sentence and identify ਬ.",
    expectedRepair: "Learner reads ਬੱਸ without ਬ/ਪ reversal.",
    finalQaSignal: "Script confusion is repaired before transit scenario handoff.",
    integrationNote_vi: "Dùng mẫu này để chặn hội thoại dài nếu chữ cơ bản còn sai.",
    integrationNote_en: "Use this sample to block longer dialogue if the basic letter contrast is still wrong.",
    commonTrap: "Guessing from transit context before reading the Gurmukhi letter.",
    canadaPractical: true,
  },
  {
    id: "integration-script-vowel-help",
    focus: "script-confusion",
    use: "final-qa",
    audience: "both",
    sourceDeckId: "smoke-script-vowel-question",
    routeId: "route-script-vowel-signs",
    evidence_pa: "ਕੀ ਤੁਹਾਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
    evidence_roman: "ki tuhanu madad chahidi hai?",
    evidence_en: "Do you need help?",
    learnerPrompt_vi: "Gạch chân ੀ trong ਕੀ trước khi đọc nghĩa.",
    learnerPrompt_en: "Underline ੀ in ਕੀ before reading the meaning.",
    expectedRepair: "Learner notices the vowel sign and reads ਕੀ correctly.",
    finalQaSignal: "Vowel-sign awareness is present during final QA.",
    integrationNote_vi: "Giữ hỗ trợ trực quan cho đến khi người học tự kiểm tra dấu nguyên âm.",
    integrationNote_en: "Keep visual support until the learner checks vowel signs independently.",
    commonTrap: "Treating vowel signs as decoration.",
  },
  {
    id: "integration-romanization-gurmukhi-first",
    focus: "romanization-dependence",
    use: "final-evidence",
    audience: "both",
    sourceDeckId: "smoke-romanization-gurmukhi-first",
    routeId: "romanization-read-gurmukhi-first",
    evidence_pa: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    evidence_roman: "mainu madad chahidi hai.",
    evidence_en: "I need help.",
    learnerPrompt_vi: "Che romanization và đọc Gurmukhi hai lần.",
    learnerPrompt_en: "Cover romanization and read Gurmukhi twice.",
    expectedRepair: "Learner reads Gurmukhi before revealing romanization.",
    finalQaSignal: "Romanization is used only as a later check.",
    integrationNote_vi: "Mẫu này kiểm tra hành vi đọc, không chỉ đáp án đúng.",
    integrationNote_en: "This sample checks reading behavior, not only the correct answer.",
    commonTrap: "Using romanization as the main script.",
    canadaPractical: true,
  },
  {
    id: "integration-shahmukhi-awareness",
    focus: "romanization-dependence",
    use: "handoff",
    audience: "both",
    sourceDeckId: "smoke-shahmukhi-scope",
    routeId: "gurmukhi-shahmukhi-awareness",
    evidence_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਪੜ੍ਹਦੇ ਹਾਂ।",
    evidence_roman: "asi gurmukhi parhde haan.",
    evidence_en: "We study Gurmukhi.",
    learnerPrompt_vi: "Nêu mục tiêu chữ viết của phần Punjabi này.",
    learnerPrompt_en: "State the script goal for this Punjabi section.",
    expectedRepair: "Learner states Gurmukhi is primary and Shahmukhi is awareness only.",
    finalQaSignal: "Script scope is clear before integration wiring.",
    integrationNote_vi: "Shahmukhi chỉ là nhận biết, không phải khóa đầy đủ.",
    integrationNote_en: "Shahmukhi is awareness only, not a full course.",
    commonTrap: "Mixing script goals during final QA.",
  },
  {
    id: "integration-word-order-sov",
    focus: "word-order",
    use: "final-qa",
    audience: "both",
    sourceDeckId: "smoke-word-order-sov",
    routeId: "word-order-object-before-verb",
    evidence_pa: "ਮੈਂ ਸੇਬ ਖਾਂਦਾ ਹਾਂ।",
    evidence_roman: "main seb khanda haan.",
    evidence_en: "I eat an apple.",
    learnerPrompt_vi: "Chỉ ra subject, object, verb và sửa trật tự nếu cần.",
    learnerPrompt_en: "Point out subject, object, and verb, and repair order if needed.",
    expectedRepair: "Learner places the object before the verb.",
    finalQaSignal: "SOV order is stable enough for free sentence handoff.",
    integrationNote_vi: "Dùng mẫu này trước khi cho người học viết câu mới.",
    integrationNote_en: "Use this sample before asking the learner to write new sentences.",
    commonTrap: "Copying Vietnamese or English SVO order.",
  },
  {
    id: "integration-english-auxiliary-final",
    focus: "english-transfer",
    use: "final-evidence",
    audience: "en",
    sourceDeckId: "smoke-english-auxiliary-final",
    routeId: "english-transfer-am-is-are",
    evidence_pa: "ਮੈਂ ਵਿਦਿਆਰਥੀ ਹਾਂ।",
    evidence_roman: "main vidyarthi haan.",
    evidence_en: "I am a student.",
    learnerPrompt_vi: "Sửa câu 'I am X' để ਹਾਂ đứng cuối.",
    learnerPrompt_en: "Repair the 'I am X' frame so ਹਾਂ comes last.",
    expectedRepair: "Learner produces ਮੈਂ X ਹਾਂ without English auxiliary order.",
    finalQaSignal: "English-transfer auxiliary order no longer blocks identity statements.",
    integrationNote_vi: "Mẫu này dành riêng cho người học chịu ảnh hưởng tiếng Anh.",
    integrationNote_en: "This sample is specific to learners affected by English transfer.",
    commonTrap: "Mapping English 'I am' directly to ਮੈਂ ਹਾਂ.",
  },
  {
    id: "integration-vietnamese-explicit-subject",
    focus: "vietnamese-transfer",
    use: "final-evidence",
    audience: "vi",
    sourceDeckId: "smoke-vietnamese-explicit-subject",
    routeId: "vietnamese-transfer-explicit-subject",
    evidence_pa: "ਮੈਂ ਅੱਜ ਕੰਮ ਤੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ।",
    evidence_roman: "main ajj kamm te janda/jandi haan.",
    evidence_en: "I go to work today.",
    learnerPrompt_vi: "Viết rõ chủ ngữ trước khi hoàn thành câu.",
    learnerPrompt_en: "Write the subject clearly before completing the sentence.",
    expectedRepair: "Learner adds ਮੈਂ or ਅਸੀਂ when the subject is needed.",
    finalQaSignal: "Vietnamese topic-drop transfer is controlled in short sentences.",
    integrationNote_vi: "Mẫu này giữ điểm neo chủ ngữ cho người học nói tiếng Việt.",
    integrationNote_en: "This sample keeps a subject anchor for Vietnamese-speaking learners.",
    commonTrap: "Leaving out the subject because context feels obvious.",
    canadaPractical: true,
  },
  {
    id: "integration-postposition-human-nu",
    focus: "postpositions",
    use: "final-qa",
    audience: "both",
    sourceDeckId: "smoke-postposition-human-nu",
    routeId: "postpositions-nu-human-object",
    evidence_pa: "ਮੈਂ ਉਸਨੂੰ ਦੇਖਿਆ।",
    evidence_roman: "main usnu dekhia.",
    evidence_en: "I saw him/her.",
    learnerPrompt_vi: "Kiểm tra người cụ thể làm tân ngữ và thêm ਨੂੰ.",
    learnerPrompt_en: "Check the specific human object and add ਨੂੰ.",
    expectedRepair: "Learner uses ਨੂੰ with a specific person without overusing it.",
    finalQaSignal: "Human-object postposition repair is ready for mixed practice.",
    integrationNote_vi: "Không chấm chỉ theo nghĩa; cần kiểm tra hậu giới từ.",
    integrationNote_en: "Do not grade only by meaning; check the postposition.",
    commonTrap: "Skipping ਨੂੰ because English and Vietnamese mark this differently.",
  },
  {
    id: "integration-postposition-location-office",
    focus: "postpositions",
    use: "handoff",
    audience: "both",
    sourceDeckId: "smoke-postposition-location-office",
    routeId: "postpositions-location-vich",
    evidence_pa: "ਦਫ਼ਤਰ ਵਿੱਚ",
    evidence_roman: "daftar vich",
    evidence_en: "in the office",
    learnerPrompt_vi: "Viết cụm nơi chốn theo khung danh từ + hậu giới từ.",
    learnerPrompt_en: "Write the location phrase as noun + postposition.",
    expectedRepair: "Learner produces noun + ਵਿੱਚ.",
    finalQaSignal: "Location postposition order is ready for service-location scenarios.",
    integrationNote_vi: "Mẫu này phù hợp cho tình huống văn phòng/dịch vụ ở Canada.",
    integrationNote_en: "This sample fits Canada office or service-location scenarios.",
    commonTrap: "Putting ਵਿੱਚ before the noun.",
    canadaPractical: true,
  },
  {
    id: "integration-agreement-possessive",
    focus: "gender-number-agreement",
    use: "final-qa",
    audience: "both",
    sourceDeckId: "smoke-agreement-possessive",
    routeId: "gender-number-mera-meri",
    evidence_pa: "ਮੇਰੀ ਕਿਤਾਬ",
    evidence_roman: "meri kitaab",
    evidence_en: "my book",
    learnerPrompt_vi: "Chọn possessive phù hợp với ਕਿਤਾਬ.",
    learnerPrompt_en: "Choose the possessive that matches ਕਿਤਾਬ.",
    expectedRepair: "Learner pairs ਮੇਰੀ with ਕਿਤਾਬ.",
    finalQaSignal: "Possessive agreement chunks are stable for familiar nouns.",
    integrationNote_vi: "Dùng mẫu này trước khi mở rộng sang danh từ mới.",
    integrationNote_en: "Use this sample before expanding to new nouns.",
    commonTrap: "Using ਮੇਰਾ for every noun.",
  },
  {
    id: "integration-agreement-perfective-roti",
    focus: "gender-number-agreement",
    use: "final-evidence",
    audience: "both",
    sourceDeckId: "smoke-agreement-perfective-roti",
    routeId: "gender-number-perfective-roti",
    evidence_pa: "ਉਸ ਨੇ ਰੋਟੀ ਖਾਧੀ।",
    evidence_roman: "us ne roti khaadhi.",
    evidence_en: "He/she ate roti.",
    learnerPrompt_vi: "Sửa cụm quá khứ hoàn thành với ਰੋਟੀ.",
    learnerPrompt_en: "Repair the perfective chunk with ਰੋਟੀ.",
    expectedRepair: "Learner uses ਖਾਧੀ with ਰੋਟੀ.",
    finalQaSignal: "Controlled perfective chunks are stable before free writing.",
    integrationNote_vi: "Mẫu này đo cụm quen thuộc, không phải viết tự do.",
    integrationNote_en: "This sample measures a familiar chunk, not free writing.",
    commonTrap: "Using one past form everywhere.",
  },
  {
    id: "integration-register-service-counter",
    focus: "register-mismatch",
    use: "final-evidence",
    audience: "both",
    sourceDeckId: "smoke-register-service-counter",
    routeId: "register-soften-requests",
    evidence_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਫਾਰਮ ਦੇ ਦਿਓ ਜੀ।",
    evidence_roman: "kirpa karke mainu form de dio ji.",
    evidence_en: "Please give me the form.",
    learnerPrompt_vi: "Làm mềm yêu cầu ở quầy dịch vụ.",
    learnerPrompt_en: "Soften the service-counter request.",
    expectedRepair: "Learner uses polite request markers with staff.",
    finalQaSignal: "Register repair is ready for public-service role play.",
    integrationNote_vi: "Câu đúng nghĩa vẫn phải đúng register trước khi handoff.",
    integrationNote_en: "A meaningful sentence still needs correct register before handoff.",
    commonTrap: "Using bare commands with staff.",
    canadaPractical: true,
  },
  {
    id: "integration-canada-library-card",
    focus: "canada-practical-phrase-gaps",
    use: "handoff",
    audience: "both",
    sourceDeckId: "smoke-canada-library-card",
    routeId: "public-service-library-card",
    evidence_pa: "ਮੈਂ ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ ਬਣਵਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।",
    evidence_roman: "main library card banvauna chahunda/chahundi haan.",
    evidence_en: "I would like to get a library card.",
    learnerPrompt_vi: "Tạo yêu cầu đầy đủ để làm thẻ thư viện.",
    learnerPrompt_en: "Create a full request to get a library card.",
    expectedRepair: "Learner produces a complete library-card request.",
    finalQaSignal: "Ready for library-card public-service scenario wiring.",
    integrationNote_vi: "Danh từ riêng lẻ chưa đủ cho tình huống dịch vụ.",
    integrationNote_en: "A noun alone is not enough for a service situation.",
    commonTrap: "Saying only ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ.",
    canadaPractical: true,
  },
  {
    id: "integration-canada-application-deadline",
    focus: "canada-practical-phrase-gaps",
    use: "handoff",
    audience: "both",
    sourceDeckId: "smoke-canada-application-deadline",
    routeId: "route-b2-deadline-submission",
    evidence_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਇਹ ਅਰਜ਼ੀ ਕਦੋਂ ਤੱਕ ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ?",
    evidence_roman: "kirpa karke dasso, ih arzi kadon takk jamma karni hai?",
    evidence_en: "Please tell me, by when must this application be submitted?",
    learnerPrompt_vi: "Hỏi hạn nộp đơn bằng câu lịch sự đầy đủ.",
    learnerPrompt_en: "Ask about an application deadline with a full polite sentence.",
    expectedRepair: "Learner asks for both deadline and submission action.",
    finalQaSignal: "Ready for application-deadline service scenario wiring.",
    integrationNote_vi: "Cần rõ cả thời hạn và hành động nộp đơn.",
    integrationNote_en: "Both the deadline and submission action must be clear.",
    commonTrap: "Asking only a vague 'when?' question.",
    canadaPractical: true,
  },
  {
    id: "integration-canada-clinic-appointment",
    focus: "canada-practical-phrase-gaps",
    use: "final-qa",
    audience: "both",
    sourceDeckId: "smoke-canada-clinic-appointment",
    routeId: "public-service-appointment-clinic",
    evidence_pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨਾਲ ਅਪਾਇੰਟਮੈਂਟ ਲੈਣੀ ਹੈ।",
    evidence_roman: "mainu doctor naal appointment laini hai.",
    evidence_en: "I need to book an appointment with a doctor.",
    learnerPrompt_vi: "Tạo câu đặt lịch hẹn bác sĩ.",
    learnerPrompt_en: "Create a sentence to book a doctor's appointment.",
    expectedRepair: "Learner produces the full appointment-booking frame.",
    finalQaSignal: "Clinic appointment phrase is ready for guided scenario practice.",
    integrationNote_vi: "Cần hành động đặt lịch, không chỉ danh từ ਡਾਕਟਰ.",
    integrationNote_en: "The booking action is needed, not only the noun ਡਾਕਟਰ.",
    commonTrap: "Knowing the noun but missing the service action.",
    canadaPractical: true,
  },
];
