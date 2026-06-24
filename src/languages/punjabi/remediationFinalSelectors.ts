// src/languages/punjabi/remediationFinalSelectors.ts
//
// Punjabi remediation final selectors for later integration. Gurmukhi is
// primary; romanization is included only as support. These selectors are study
// support only, not official placement or certification. Native review is
// deferred.

export type PunjabiFinalSelectorFocus =
  | "script-confusion"
  | "romanization-dependence"
  | "word-order"
  | "postpositions"
  | "agreement"
  | "register-mismatch"
  | "vietnamese-transfer"
  | "english-transfer"
  | "service-phrase-gaps"
  | "canada-practical-recovery";

export type PunjabiFinalSelectorEvidence =
  | "selector"
  | "pre-integration"
  | "final-readiness"
  | "routing"
  | "integration-readiness";

export interface PunjabiRemediationFinalSelectorItem {
  id: string;
  focus: PunjabiFinalSelectorFocus;
  evidenceType: PunjabiFinalSelectorEvidence;
  audience: "vi" | "en" | "both";
  remediationRouteId: string;
  sourceArtifactIds: string[];
  selector_pa: string;
  selector_roman?: string;
  selector_en: string;
  risk_vi: string;
  risk_en: string;
  selectorCheck: string;
  readinessCheck: string;
  ownerReviewPrompt_vi: string;
  ownerReviewPrompt_en: string;
  finalQaCheck: string;
  commonTrap: string;
  canadaPractical?: boolean;
}

export const PUNJABI_REMEDIATION_FINAL_SELECTORS_NOTICE =
  "Wave 28 final selectors only; not A11 integration. Study support only, not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_FINAL_SELECTOR_FOCI: readonly PunjabiFinalSelectorFocus[] = [
  "script-confusion",
  "romanization-dependence",
  "word-order",
  "postpositions",
  "agreement",
  "register-mismatch",
  "vietnamese-transfer",
  "english-transfer",
  "service-phrase-gaps",
  "canada-practical-recovery",
] as const;

export const PUNJABI_FINAL_SELECTOR_EVIDENCE_TYPES: readonly PunjabiFinalSelectorEvidence[] = [
  "selector",
  "pre-integration",
  "final-readiness",
  "routing",
  "integration-readiness",
] as const;

export const punjabiRemediationFinalSelectors: PunjabiRemediationFinalSelectorItem[] = [
  {
    id: "selector-script-b-p-transit",
    focus: "script-confusion",
    evidenceType: "selector",
    audience: "both",
    remediationRouteId: "route-script-babba-pappa",
    sourceArtifactIds: ["review-script-b-p-transit", "checklist-script-b-p-transit"],
    selector_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    selector_roman: "bas adda kitthe hai?",
    selector_en: "Where is the bus stand?",
    risk_vi: "Tầng chọn cuối có thể vẫn để người học bỏ qua chữ viết.",
    risk_en: "The final selector layer can still let script reading slip away.",
    selectorCheck: "Keep a letter-level selection before routing.",
    readinessCheck: "Do not approve a meaning-only selector for script prompts.",
    ownerReviewPrompt_vi: "Xác nhận selector cuối vẫn giữ đọc chữ.",
    ownerReviewPrompt_en: "Confirm the final selector still requires reading the letters.",
    finalQaCheck: "Confirm final QA blocks handoff on script guessing.",
    commonTrap: "Treating transit meaning as enough to select the route.",
    canadaPractical: true,
  },
  {
    id: "selector-script-vowel-help",
    focus: "script-confusion",
    evidenceType: "pre-integration",
    audience: "both",
    remediationRouteId: "route-script-vowel-signs",
    sourceArtifactIds: ["review-script-vowel-help", "checklist-script-vowel-help"],
    selector_pa: "ਕੀ ਤੁਹਾਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
    selector_roman: "ki tuhanu madad chahidi hai?",
    selector_en: "Do you need help?",
    risk_vi: "Dấu nguyên âm có thể bị bỏ qua ở tầng tiền tích hợp.",
    risk_en: "Vowel marks can be ignored in the pre-integration layer.",
    selectorCheck: "Keep the vowel mark visible in selection previews.",
    readinessCheck: "Do not treat vowel signs as optional layout detail.",
    ownerReviewPrompt_vi: "Kiểm tra dấu nguyên âm còn nhìn thấy rõ không.",
    ownerReviewPrompt_en: "Check whether the vowel sign still shows clearly.",
    finalQaCheck: "Confirm final QA catches dropped vowel signs.",
    commonTrap: "Cleaning formatting until the vowel mark is lost.",
  },
  {
    id: "selector-romanization-gurmukhi-first",
    focus: "romanization-dependence",
    evidenceType: "final-readiness",
    audience: "both",
    remediationRouteId: "romanization-read-gurmukhi-first",
    sourceArtifactIds: ["review-romanization-gurmukhi-first", "checklist-romanization-gurmukhi-first"],
    selector_pa: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    selector_roman: "mainu madad chahidi hai.",
    selector_en: "I need help.",
    risk_vi: "Người học có thể quay lại đọc romanization trước Gurmukhi.",
    risk_en: "Learners can slip back into romanization-first reading.",
    selectorCheck: "Keep Gurmukhi as the first reading target.",
    readinessCheck: "Do not let romanization define the primary script.",
    ownerReviewPrompt_vi: "Xác nhận selector vẫn ưu tiên Gurmukhi trước.",
    ownerReviewPrompt_en: "Confirm the selector still prioritizes Gurmukhi first.",
    finalQaCheck: "Confirm final QA requires a Gurmukhi-first read.",
    commonTrap: "Using romanization as the main reading layer.",
    canadaPractical: true,
  },
  {
    id: "selector-shahmukhi-awareness-scope",
    focus: "romanization-dependence",
    evidenceType: "routing",
    audience: "both",
    remediationRouteId: "gurmukhi-shahmukhi-awareness",
    sourceArtifactIds: ["review-shahmukhi-awareness-scope", "checklist-shahmukhi-awareness-scope"],
    selector_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਪੜ੍ਹਦੇ ਹਾਂ।",
    selector_roman: "asi gurmukhi parhde haan.",
    selector_en: "We study Gurmukhi.",
    risk_vi: "Phạm vi có thể bị mở rộng thành khóa Shahmukhi đầy đủ.",
    risk_en: "The scope can expand into a full Shahmukhi course.",
    selectorCheck: "Keep Shahmukhi as awareness only.",
    readinessCheck: "Do not expand scope into a dual-script syllabus.",
    ownerReviewPrompt_vi: "Xác nhận Shahmukhi chỉ là nhận biết.",
    ownerReviewPrompt_en: "Confirm Shahmukhi stays awareness only.",
    finalQaCheck: "Confirm final QA flags full-course Shahmukhi wording.",
    commonTrap: "Mixing scope notes with reading goals.",
  },
  {
    id: "selector-word-order-sov",
    focus: "word-order",
    evidenceType: "selector",
    audience: "both",
    remediationRouteId: "word-order-object-before-verb",
    sourceArtifactIds: ["review-word-order-sov", "checklist-word-order-sov"],
    selector_pa: "ਮੈਂ ਸੇਬ ਖਾਂਦਾ ਹਾਂ।",
    selector_roman: "main seb khanda haan.",
    selector_en: "I eat an apple.",
    risk_vi: "Câu cuối có thể trượt về trật tự SVO quen thuộc.",
    risk_en: "The final sentence can still drift back to familiar SVO order.",
    selectorCheck: "Keep the object before the verb phrase.",
    readinessCheck: "Do not let the English gloss rewrite Punjabi order.",
    ownerReviewPrompt_vi: "Kiểm tra câu cuối không chuyển sang trật tự Anh/Việt.",
    ownerReviewPrompt_en: "Check that the final sentence does not shift into English/Vietnamese order.",
    finalQaCheck: "Confirm final QA catches object-after-verb transfer.",
    commonTrap: "Copying English or Vietnamese sentence order.",
  },
  {
    id: "selector-english-transfer-auxiliary-final",
    focus: "english-transfer",
    evidenceType: "pre-integration",
    audience: "en",
    remediationRouteId: "english-transfer-am-is-are",
    sourceArtifactIds: ["review-english-transfer-auxiliary-final", "checklist-english-transfer-auxiliary-final"],
    selector_pa: "ਮੈਂ ਵਿਦਿਆਰਥੀ ਹਾਂ।",
    selector_roman: "main vidyarthi haan.",
    selector_en: "I am a student.",
    risk_vi: "Người học tiếng Anh có thể kéo ਹਾਂ lên trước trong selector cuối.",
    risk_en: "English-speaking learners can pull ਹਾਂ too early in the final selector.",
    selectorCheck: "Keep ਹਾਂ at the sentence end.",
    readinessCheck: "Do not mirror English copular order.",
    ownerReviewPrompt_vi: "Xác nhận bản cuối giữ mẫu Punjabi tự nhiên.",
    ownerReviewPrompt_en: "Confirm the final copy keeps natural Punjabi order.",
    finalQaCheck: "Confirm final QA catches direct English copula transfer.",
    commonTrap: "Writing ਮੈਂ ਹਾਂ ਵਿਦਿਆਰਥੀ from the English model.",
  },
  {
    id: "selector-vietnamese-transfer-explicit-subject",
    focus: "vietnamese-transfer",
    evidenceType: "routing",
    audience: "vi",
    remediationRouteId: "vietnamese-transfer-explicit-subject",
    sourceArtifactIds: ["review-vietnamese-transfer-explicit-subject", "checklist-vietnamese-transfer-explicit-subject"],
    selector_pa: "ਮੈਂ ਅੱਜ ਕੰਮ ਤੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ।",
    selector_roman: "main ajj kamm te janda/jandi haan.",
    selector_en: "I go to work today.",
    risk_vi: "Người học Việt có thể bỏ chủ ngữ nếu selector không giữ ranh giới rõ.",
    risk_en: "Vietnamese-speaking learners can drop the subject if the selector boundary is unclear.",
    selectorCheck: "Keep a visible subject anchor.",
    readinessCheck: "Require explicit subject where the task asks for it.",
    ownerReviewPrompt_vi: "Xác nhận selector còn rõ cho người học Việt.",
    ownerReviewPrompt_en: "Confirm the selector stays clear for Vietnamese-speaking learners.",
    finalQaCheck: "Confirm final QA catches dropped-subject transfer.",
    commonTrap: "Trusting context instead of writing the subject.",
    canadaPractical: true,
  },
  {
    id: "selector-postposition-human-nu",
    focus: "postpositions",
    evidenceType: "final-readiness",
    audience: "both",
    remediationRouteId: "postpositions-nu-human-object",
    sourceArtifactIds: ["review-postposition-human-nu", "checklist-postposition-human-nu"],
    selector_pa: "ਮੈਂ ਉਸਨੂੰ ਦੇਖਿਆ।",
    selector_roman: "main usnu dekhia.",
    selector_en: "I saw him/her.",
    risk_vi: "Bản cuối vẫn có thể bỏ marker ਨੂੰ với tân ngữ người cụ thể.",
    risk_en: "The final build can still omit ਨੂੰ with a specific human object.",
    selectorCheck: "Use ਨੂੰ only for a specific human object.",
    readinessCheck: "Do not attach ਨੂੰ to every object mechanically.",
    ownerReviewPrompt_vi: "Xác nhận selector không ép dùng ਨੂੰ cho mọi tân ngữ.",
    ownerReviewPrompt_en: "Confirm the selector does not force ਨੂੰ onto every object.",
    finalQaCheck: "Confirm final QA catches omission and overuse of ਨੂੰ.",
    commonTrap: "Copying English object marking into Punjabi.",
  },
  {
    id: "selector-postposition-location-office",
    focus: "postpositions",
    evidenceType: "integration-readiness",
    audience: "both",
    remediationRouteId: "postpositions-location-vich",
    sourceArtifactIds: ["review-postposition-location-office", "checklist-postposition-location-office"],
    selector_pa: "ਦਫ਼ਤਰ ਵਿੱਚ",
    selector_roman: "daftar vich",
    selector_en: "in the office",
    risk_vi: "Bản tích hợp có thể đảo ngược danh từ và hậu giới từ.",
    risk_en: "The integration can reverse the noun and postposition.",
    selectorCheck: "Keep noun + ਵਿੱਚ order.",
    readinessCheck: "Do not render it as preposition-before-noun English.",
    ownerReviewPrompt_vi: "Kiểm tra cụm còn dùng được trong văn phòng hoặc dịch vụ không.",
    ownerReviewPrompt_en: "Check whether the phrase still works in office or service contexts.",
    finalQaCheck: "Confirm final QA catches preposition-before-noun transfer.",
    commonTrap: "Matching English phrase order instead of Punjabi order.",
    canadaPractical: true,
  },
  {
    id: "selector-agreement-possessive-book",
    focus: "agreement",
    evidenceType: "final-readiness",
    audience: "both",
    remediationRouteId: "agreement-possessive-gender",
    sourceArtifactIds: ["review-agreement-possessive-book", "checklist-agreement-possessive-book"],
    selector_pa: "ਮੇਰੀ ਕਿਤਾਬ ਇੱਥੇ ਹੈ।",
    selector_roman: "meri kitab itthe hai.",
    selector_en: "My book is here.",
    risk_vi: "Bản cuối vẫn có thể sai hòa hợp sở hữu theo giới tính danh từ.",
    risk_en: "The final build can still break possessive agreement by noun gender.",
    selectorCheck: "Keep the possessive form aligned with the noun.",
    readinessCheck: "Do not replace noun-based agreement with speaker-based habits.",
    ownerReviewPrompt_vi: "Xác nhận selector không làm mất quy tắc hòa hợp cơ bản.",
    ownerReviewPrompt_en: "Confirm the selector does not erase the basic agreement rule.",
    finalQaCheck: "Confirm final QA catches possessive agreement errors.",
    commonTrap: "Choosing possessives by speaker gender instead of noun gender.",
  },
  {
    id: "selector-register-service-counter",
    focus: "register-mismatch",
    evidenceType: "final-readiness",
    audience: "both",
    remediationRouteId: "register-service-counter-politeness",
    sourceArtifactIds: ["review-register-service-counter", "checklist-register-service-counter"],
    selector_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਫਾਰਮ ਦੇ ਦਿਓ ਜੀ।",
    selector_roman: "kirpa karke mainu form de dio ji.",
    selector_en: "Please give me the form.",
    risk_vi: "Bản cuối có thể hạ mức lịch sự của quầy dịch vụ xuống quá thấp.",
    risk_en: "The final build can drop service-counter politeness too low.",
    selectorCheck: "Keep the service request polite and office-safe.",
    readinessCheck: "Do not swap in a classroom-short command.",
    ownerReviewPrompt_vi: "Xác nhận selector dùng được cho văn phòng, thư viện, hoặc quầy dịch vụ.",
    ownerReviewPrompt_en: "Confirm the selector is usable for offices, libraries, or service counters.",
    finalQaCheck: "Confirm final QA catches casual command wording.",
    commonTrap: "Using a short classroom command in a public-service setting.",
    canadaPractical: true,
  },
  {
    id: "selector-service-phrase-library-help",
    focus: "service-phrase-gaps",
    evidenceType: "selector",
    audience: "both",
    remediationRouteId: "service-phrase-library-help",
    sourceArtifactIds: ["review-service-phrase-library-help", "checklist-service-phrase-library-help"],
    selector_pa: "ਮੈਂ ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ ਬਣਵਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।",
    selector_roman: "main library card banvauna chahunda/chahundi haan.",
    selector_en: "I want to get a library card made.",
    risk_vi: "Cụm dịch vụ có thể bị rút xuống thành từ vựng rời rạc.",
    risk_en: "The service phrase can get reduced to isolated vocabulary.",
    selectorCheck: "Keep a full service phrase, not only a noun.",
    readinessCheck: "Do not treat the request as a word list.",
    ownerReviewPrompt_vi: "Kiểm tra câu phục vụ còn dùng được tại thư viện không.",
    ownerReviewPrompt_en: "Check whether the service phrase is still usable at a library counter.",
    finalQaCheck: "Confirm final QA preserves a practical service phrase.",
    commonTrap: "Knowing the service noun but not the usable request.",
    canadaPractical: true,
  },
  {
    id: "selector-canada-library-card",
    focus: "canada-practical-recovery",
    evidenceType: "final-readiness",
    audience: "both",
    remediationRouteId: "canada-practical-library-card",
    sourceArtifactIds: ["review-canada-library-card", "checklist-canada-library-card"],
    selector_pa: "ਮੈਂ ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ ਬਣਵਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।",
    selector_roman: "main library card banvauna chahunda/chahundi haan.",
    selector_en: "I want to get a library card made.",
    risk_vi: "Cụm thư viện có thể bị cắt xuống chỉ còn từ vựng rời.",
    risk_en: "The library phrase can get reduced to isolated vocabulary.",
    selectorCheck: "Keep the full request sentence intact.",
    readinessCheck: "Do not remove the request frame from the phrase.",
    ownerReviewPrompt_vi: "Xác nhận câu đủ thực dụng cho dịch vụ thư viện ở Canada.",
    ownerReviewPrompt_en: "Confirm the sentence stays practical for Canadian library services.",
    finalQaCheck: "Confirm final QA keeps the practical library scenario intact.",
    commonTrap: "Having the noun but not the request.",
    canadaPractical: true,
  },
  {
    id: "selector-canada-application-deadline",
    focus: "canada-practical-recovery",
    evidenceType: "integration-readiness",
    audience: "both",
    remediationRouteId: "canada-practical-application-deadline",
    sourceArtifactIds: ["review-canada-application-deadline", "checklist-canada-application-deadline"],
    selector_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਇਹ ਅਰਜ਼ੀ ਕਦੋਂ ਤੱਕ ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ?",
    selector_roman: "kirpa karke dasso, ih arzi kadon takk jammha karni hai?",
    selector_en: "Please tell me, by when do I need to submit this application?",
    risk_vi: "Cụm hạn nộp có thể bị rơi mất khi tích hợp cuối.",
    risk_en: "The deadline phrase can still drop out during final integration.",
    selectorCheck: "Keep ਕਦੋਂ ਤੱਕ in the final selector.",
    readinessCheck: "Do not strip the deadline phrase from the request.",
    ownerReviewPrompt_vi: "Kiểm tra selector còn dùng được cho biểu mẫu hoặc hồ sơ không.",
    ownerReviewPrompt_en: "Check whether the selector still works for forms or applications.",
    finalQaCheck: "Confirm final QA catches missing deadline wording.",
    commonTrap: "Remembering ਅਰਜ਼ੀ but not the due-date question.",
    canadaPractical: true,
  },
  {
    id: "selector-canada-clinic-appointment",
    focus: "canada-practical-recovery",
    evidenceType: "routing",
    audience: "both",
    remediationRouteId: "canada-practical-clinic-appointment",
    sourceArtifactIds: ["review-canada-clinic-appointment", "checklist-canada-clinic-appointment"],
    selector_pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨਾਲ ਅਪਾਇੰਟਮੈਂਟ ਲੈਣੀ ਹੈ।",
    selector_roman: "mainu daktar nal appointment laini hai.",
    selector_en: "I need to make an appointment with a doctor.",
    risk_vi: "Cụm y tế có thể bị giản lược thành từ vay mượn rời rạc.",
    risk_en: "The clinic phrase can be reduced to isolated loanwords.",
    selectorCheck: "Keep ਨਾਲ and the full need statement.",
    readinessCheck: "Do not remove the request frame during export.",
    ownerReviewPrompt_vi: "Xác nhận câu chỉ hỗ trợ học tập, không thành tư vấn y tế.",
    ownerReviewPrompt_en: "Confirm the sentence is study support and not medical advice.",
    finalQaCheck: "Confirm final QA preserves practical clinic wording without audio or scoring dependencies.",
    commonTrap: "Using only the English loanword without Punjabi structure.",
    canadaPractical: true,
  },
];
