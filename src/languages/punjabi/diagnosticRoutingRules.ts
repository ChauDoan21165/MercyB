// src/languages/punjabi/diagnosticRoutingRules.ts
//
// Punjabi diagnostic routing rules for app-side study support. Gurmukhi is
// primary; romanization appears where useful. These rules are not official
// placement or certification. Native review is deferred.

export type PunjabiRoutingLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type PunjabiRoutingSource =
  | "gurmukhi-script"
  | "romanization-dependence"
  | "vietnamese-transfer"
  | "english-transfer"
  | "postpositions"
  | "agreement"
  | "register"
  | "survival"
  | "public-service";

export interface PunjabiDiagnosticRoutingRule {
  id: string;
  observedSignal: string;
  level: PunjabiRoutingLevel;
  likelySource: PunjabiRoutingSource;
  nextModule: string;
  remediationDrill: string;
  reviewLoop: string;
  scriptSupport: string;
  registerSupport: string;
  example_pa: string;
  example_roman?: string;
  example_en: string;
  explanation_vi: string;
  explanation_en: string;
  commonTrap?: string;
  canadaPractical?: boolean;
}

export const PUNJABI_DIAGNOSTIC_ROUTING_NOTICE =
  "Study support only; not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_ROUTING_LEVELS: readonly PunjabiRoutingLevel[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
] as const;

export const PUNJABI_ROUTING_SOURCES: readonly PunjabiRoutingSource[] = [
  "gurmukhi-script",
  "romanization-dependence",
  "vietnamese-transfer",
  "english-transfer",
  "postpositions",
  "agreement",
  "register",
  "survival",
  "public-service",
] as const;

export const punjabiDiagnosticRoutingRules: PunjabiDiagnosticRoutingRule[] = [
  {
    id: "route-a1-script-b-p",
    observedSignal: "Learner confuses ਬ and ਪ in a basic sign.",
    level: "A1",
    likelySource: "gurmukhi-script",
    nextModule: "Gurmukhi similar-letter reading",
    remediationDrill: "Circle ਬ and ਪ in minimal pairs, then read the sign without romanization.",
    reviewLoop: "Repeat after 24 hours with new signs before moving to sentence reading.",
    scriptSupport: "Show enlarged Gurmukhi letters first; romanization appears only after the attempt.",
    registerSupport: "Neutral register; focus on reading accuracy.",
    example_pa: "ਬੱਸ ਅੱਡਾ",
    example_roman: "bas adda",
    example_en: "bus stand",
    explanation_vi: "Tuyến này sửa lỗi nhận diện chữ Gurmukhi trước khi luyện câu dài.",
    explanation_en: "This route repairs Gurmukhi letter recognition before longer sentence practice.",
    commonTrap: "Guessing the word from bus context instead of reading the first letter.",
    canadaPractical: true,
  },
  {
    id: "route-a1-script-vowel-sign",
    observedSignal: "Learner skips vowel signs such as ੀ in short words.",
    level: "A1",
    likelySource: "gurmukhi-script",
    nextModule: "Vowel-sign scan",
    remediationDrill: "Name the base consonant and vowel sign before reading the word.",
    reviewLoop: "Do five short words, then one sentence with the same sign.",
    scriptSupport: "Highlight ੀ, ੁ, and ੇ in Gurmukhi; romanization is a final check.",
    registerSupport: "Neutral reading support.",
    example_pa: "ਕੀ ਤੁਹਾਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
    example_roman: "ki tuhanu madad chahidi hai?",
    example_en: "Do you need help?",
    explanation_vi: "Nếu bỏ dấu nguyên âm, người học cần quay về quét chữ trước khi đọc nghĩa.",
    explanation_en: "If vowel signs are skipped, route back to visual scanning before meaning work.",
  },
  {
    id: "route-a1-romanization-main-text",
    observedSignal: "Learner can read romanization but not the same Gurmukhi sentence.",
    level: "A1",
    likelySource: "romanization-dependence",
    nextModule: "Gurmukhi-first survival phrases",
    remediationDrill: "Cover romanization, read Gurmukhi twice, then reveal romanization for checking.",
    reviewLoop: "Three Gurmukhi-first attempts across two sessions before adding new phrases.",
    scriptSupport: "Romanization is hidden by default and shown after self-check.",
    registerSupport: "Use neutral survival phrases before polite service requests.",
    example_pa: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    example_roman: "mainu madad chahidi hai.",
    example_en: "I need help.",
    explanation_vi: "Romanization nên hỗ trợ, không thay thế Gurmukhi trong bài đọc chính.",
    explanation_en: "Romanization should support, not replace, Gurmukhi in the main reading task.",
    commonTrap: "Treating inconsistent romanization spellings as separate Punjabi words.",
  },
  {
    id: "route-a2-vietnamese-subject-drop",
    observedSignal: "Vietnamese-speaking learner drops the subject in written Punjabi.",
    level: "A2",
    likelySource: "vietnamese-transfer",
    nextModule: "Subject recovery and sentence frames",
    remediationDrill: "Ask 'who does it?' before each sentence and add ਮੈਂ, ਉਹ, or ਅਸੀਂ.",
    reviewLoop: "Rewrite five subjectless sentences, then produce three new daily-routine sentences.",
    scriptSupport: "Keep Gurmukhi frames visible; romanization only for lower-level reading help.",
    registerSupport: "Neutral register; focus on complete written sentences.",
    example_pa: "ਮੈਂ ਅੱਜ ਕੰਮ ਤੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ।",
    example_roman: "main ajj kamm te janda/jandi haan.",
    example_en: "I go to work today.",
    explanation_vi: "Tiếng Việt có thể lược chủ ngữ, nhưng Punjabi viết luyện tập cần chủ ngữ rõ.",
    explanation_en: "Vietnamese can drop subjects, but Punjabi practice writing needs a clear subject.",
  },
  {
    id: "route-a2-english-auxiliary-order",
    observedSignal: "English-speaking learner writes ਮੈਂ ਹਾਂ ਵਿਦਿਆਰਥੀ.",
    level: "A2",
    likelySource: "english-transfer",
    nextModule: "Auxiliary-final word order",
    remediationDrill: "Convert 10 'I am X' sentences into ਮੈਂ X ਹਾਂ.",
    reviewLoop: "Mix identity, location, and adjective sentences after 80% accuracy.",
    scriptSupport: "Show the Gurmukhi frame ਮੈਂ ___ ਹਾਂ with optional romanization.",
    registerSupport: "Neutral identity statements.",
    example_pa: "ਮੈਂ ਵਿਦਿਆਰਥੀ ਹਾਂ।",
    example_roman: "main vidyarthi haan.",
    example_en: "I am a student.",
    explanation_vi: "Lỗi này đến từ trật tự tiếng Anh; cần giữ ਹਾਂ ở cuối mệnh đề Punjabi.",
    explanation_en: "This comes from English order; Punjabi keeps ਹਾਂ at the end of the clause.",
  },
  {
    id: "route-a2-postposition-nu",
    observedSignal: "Learner omits ਨੂੰ with a specific human object.",
    level: "A2",
    likelySource: "postpositions",
    nextModule: "Human object ਨੂੰ",
    remediationDrill: "Sort objects into human/specific vs non-specific, then add ਨੂੰ where needed.",
    reviewLoop: "Review after a mixed object drill with ਦੇਖਿਆ, ਬੁਲਾਇਆ, and ਮਿਲਿਆ.",
    scriptSupport: "Highlight ਨੂੰ in Gurmukhi examples.",
    registerSupport: "Neutral; later combine with polite service phrases.",
    example_pa: "ਮੈਂ ਉਸਨੂੰ ਦੇਖਿਆ।",
    example_roman: "main usnu dekhia.",
    example_en: "I saw him/her.",
    explanation_vi: "Tân ngữ người cụ thể thường cần ਨੂੰ, khác tiếng Việt và tiếng Anh.",
    explanation_en: "A specific human object often needs ਨੂੰ, unlike English and Vietnamese.",
  },
  {
    id: "route-a2-postposition-location",
    observedSignal: "Learner writes ਵਿੱਚ ਦਫ਼ਤਰ instead of ਦਫ਼ਤਰ ਵਿੱਚ.",
    level: "A2",
    likelySource: "postpositions",
    nextModule: "Noun plus postposition phrases",
    remediationDrill: "Swap ten English/Vietnamese preposition phrases into Punjabi noun + postposition order.",
    reviewLoop: "Use the same phrase inside a full sentence after phrase accuracy is stable.",
    scriptSupport: "Keep the postposition in bold after the noun.",
    registerSupport: "Neutral; include service-location examples.",
    example_pa: "ਦਫ਼ਤਰ ਵਿੱਚ ਲਾਈਨ ਲੰਬੀ ਹੈ।",
    example_roman: "daftar vich line lambi hai.",
    example_en: "The line in the office is long.",
    explanation_vi: "Punjabi dùng hậu giới từ sau danh từ; đây là lỗi trật tự rất phổ biến.",
    explanation_en: "Punjabi puts postpositions after nouns; this is a common order error.",
    canadaPractical: true,
  },
  {
    id: "route-b1-possessive-agreement",
    observedSignal: "Learner uses ਮੇਰਾ for feminine nouns such as ਕਿਤਾਬ.",
    level: "B1",
    likelySource: "agreement",
    nextModule: "Gender-number noun chunks",
    remediationDrill: "Match ਮੇਰਾ/ਮੇਰੀ/ਮੇਰੇ with familiar nouns and then write full sentences.",
    reviewLoop: "Return to the same nouns in a writing prompt one week later.",
    scriptSupport: "Show noun chunks in Gurmukhi first.",
    registerSupport: "Neutral; no register penalty unless used in a formal task.",
    example_pa: "ਮੇਰੀ ਕਿਤਾਬ ਮੇਜ਼ ਤੇ ਹੈ।",
    example_roman: "meri kitaab mez te hai.",
    example_en: "My book is on the table.",
    explanation_vi: "Người học cần học cụm danh từ theo giống/số thay vì dùng một dạng sở hữu cho mọi danh từ.",
    explanation_en: "The learner needs gender/number noun chunks instead of one possessive for all nouns.",
  },
  {
    id: "route-b1-perfective-agreement",
    observedSignal: "Learner writes ਉਸ ਨੇ ਰੋਟੀ ਖਾਧਾ.",
    level: "B1",
    likelySource: "agreement",
    nextModule: "Perfective agreement chunks",
    remediationDrill: "Drill food/action chunks: ਰੋਟੀ ਖਾਧੀ, ਚਾਹ ਪੀਤੀ, ਪਾਣੀ ਪੀਤਾ.",
    reviewLoop: "Alternate recognition and production drills until forms are stable.",
    scriptSupport: "Group the Gurmukhi noun and verb form as one chunk.",
    registerSupport: "Neutral register.",
    example_pa: "ਉਸ ਨੇ ਰੋਟੀ ਖਾਧੀ।",
    example_roman: "us ne roti khaadhi.",
    example_en: "He/she ate roti.",
    explanation_vi: "Lỗi cho thấy cần luyện thỏa thuận trong mẫu quá khứ hoàn thành.",
    explanation_en: "This shows a need for agreement practice in perfective patterns.",
  },
  {
    id: "route-b1-register-staff-request",
    observedSignal: "Learner uses bare commands with service staff.",
    level: "B1",
    likelySource: "register",
    nextModule: "Polite service-counter requests",
    remediationDrill: "Rewrite bare commands with ਕਿਰਪਾ ਕਰਕੇ, ਤੁਸੀਂ, and ਜੀ where natural.",
    reviewLoop: "Role-play one counter exchange after written rewrites.",
    scriptSupport: "Gurmukhi phrase frames with optional romanization for lower confidence readers.",
    registerSupport: "Require polite forms before marking task complete.",
    example_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਫਾਰਮ ਦੇ ਦਿਓ ਜੀ।",
    example_roman: "kirpa karke mainu form de dio ji.",
    example_en: "Please give me the form.",
    explanation_vi: "Câu trực tiếp có thể hoàn thành nghĩa nhưng sai register trong quầy dịch vụ.",
    explanation_en: "A direct command may convey meaning but fails service-counter register.",
    commonTrap: "Thinking short commands are always efficient.",
    canadaPractical: true,
  },
  {
    id: "route-b1-survival-help-frame",
    observedSignal: "Learner says only ਮਦਦ in a help context.",
    level: "B1",
    likelySource: "survival",
    nextModule: "Survival request frames",
    remediationDrill: "Substitute nouns into ਮੈਨੂੰ ___ ਚਾਹੀਦਾ/ਚਾਹੀਦੀ ਹੈ.",
    reviewLoop: "Practice urgent and non-urgent versions separately.",
    scriptSupport: "Keep the request frame in Gurmukhi; show romanization after first attempt.",
    registerSupport: "Add ਜੀ or ਕਿਰਪਾ ਕਰਕੇ in service contexts.",
    example_pa: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    example_roman: "mainu madad chahidi hai.",
    example_en: "I need help.",
    explanation_vi: "Danh từ riêng lẻ không đủ cho tình huống sinh tồn; cần khung yêu cầu.",
    explanation_en: "A noun alone is not enough for survival communication; use a request frame.",
    canadaPractical: true,
  },
  {
    id: "route-b2-library-card-request",
    observedSignal: "Learner names a card/document but cannot request one.",
    level: "B2",
    likelySource: "public-service",
    nextModule: "Document and card request frames",
    remediationDrill: "Swap ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ, ਹੈਲਥ ਕਾਰਡ, and ਫਾਰਮ into the request frame.",
    reviewLoop: "After frame practice, ask one follow-up question about documents needed.",
    scriptSupport: "Use Gurmukhi service words first; romanization as a hover/check aid.",
    registerSupport: "Use polite first-person request, not bare noun.",
    example_pa: "ਮੈਂ ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ ਬਣਵਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।",
    example_roman: "main library card banvauna chahunda/chahundi haan.",
    example_en: "I would like to get a library card.",
    explanation_vi: "Người học thiếu khung yêu cầu làm/được cấp giấy tờ trong dịch vụ công.",
    explanation_en: "The learner lacks a public-service frame for getting a document or card issued.",
    canadaPractical: true,
  },
  {
    id: "route-b2-deadline-submission",
    observedSignal: "Learner cannot ask by when an application is due.",
    level: "B2",
    likelySource: "public-service",
    nextModule: "Deadline and submission questions",
    remediationDrill: "Create questions with ਕਦੋਂ ਤੱਕ and ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ for forms, files, and appointments.",
    reviewLoop: "Recheck in a workplace email prompt after phrase drilling.",
    scriptSupport: "Highlight ਕਦੋਂ ਤੱਕ and ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ in Gurmukhi.",
    registerSupport: "Add ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ for a polite service counter question.",
    example_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਇਹ ਅਰਜ਼ੀ ਕਦੋਂ ਤੱਕ ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ?",
    example_roman: "kirpa karke dasso, ih arzi kadon takk jamma karni hai?",
    example_en: "Please tell me, by when must this application be submitted?",
    explanation_vi: "Tuyến này kết hợp từ hành chính, hạn nộp, và register lịch sự.",
    explanation_en: "This route combines administrative vocabulary, deadline language, and polite register.",
    canadaPractical: true,
  },
  {
    id: "route-c1-workplace-status-email",
    observedSignal: "Learner uses casual wording in a workplace/public-service email.",
    level: "C1",
    likelySource: "register",
    nextModule: "Formal workplace email routing",
    remediationDrill: "Rewrite casual messages with greeting, request, reason, and polite closing.",
    reviewLoop: "Compare two versions and identify which phrases make the register formal.",
    scriptSupport: "Gurmukhi model email with line-by-line romanization only if needed.",
    registerSupport: "Require formal opening and request formula before advanced writing.",
    example_pa: "ਸਤਿਕਾਰਯੋਗ ਸਰ, ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੀ ਅਰਜ਼ੀ ਦੀ ਸਥਿਤੀ ਦੱਸੋ।",
    example_roman: "satkaryog sir, kirpa karke meri arzi di sthiti dasso.",
    example_en: "Respected sir, please tell me the status of my application.",
    explanation_vi: "Ở mức cao hơn, lỗi không chỉ là ngữ pháp mà còn là mức độ trang trọng.",
    explanation_en: "At higher levels, the issue is not only grammar but also formality control.",
    canadaPractical: true,
  },
  {
    id: "route-c2-public-statement-register",
    observedSignal: "Learner can communicate meaning but cannot soften a public or formal correction.",
    level: "C2",
    likelySource: "register",
    nextModule: "Formal public-statement repair",
    remediationDrill: "Rewrite blunt statements into accountable, formal, face-saving Punjabi.",
    reviewLoop: "Return to the same function in a policy or workplace scenario.",
    scriptSupport: "No romanization by default; provide it only as optional review.",
    registerSupport: "Focus on diplomacy, accountability, and indirect phrasing.",
    example_pa: "ਸਾਡੇ ਵੱਲੋਂ ਹੋਈ ਗ਼ਲਤੀ ਲਈ ਅਸੀਂ ਖੇਦ ਪ੍ਰਗਟ ਕਰਦੇ ਹਾਂ।",
    example_roman: "sade vallon hoi ghalti lai asi khed pragat karde haan.",
    example_en: "We express regret for the mistake made by us.",
    explanation_vi: "Tuyến này dành cho kiểm soát diễn ngôn trang trọng, không phải chứng chỉ chính thức.",
    explanation_en: "This route targets formal discourse control, not official certification.",
  },
];
