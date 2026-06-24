// src/languages/punjabi/remediationMergeReadinessSamples.ts
//
// Punjabi remediation merge-readiness samples for Wave 32. Gurmukhi is
// primary; romanization is included only as support. These samples are study
// support only, not official placement or certification. Native review is
// deferred. Shahmukhi is awareness only, not a full course.

export type PunjabiMergeReadinessFocus =
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

export type PunjabiMergeReadinessCheck =
  | "merge-readiness"
  | "final-regression"
  | "pre-integration"
  | "route-link"
  | "canada-recovery";

export interface PunjabiRemediationMergeReadinessSample {
  id: string;
  focus: PunjabiMergeReadinessFocus;
  checkType: PunjabiMergeReadinessCheck;
  audience: "vi" | "en" | "both";
  mergeRouteId: string;
  sourceArtifactIds: string[];
  sample_pa: string;
  sample_roman?: string;
  sample_en: string;
  mergeRisk_vi: string;
  mergeRisk_en: string;
  readinessRepair_vi: string;
  readinessRepair_en: string;
  mergeReadinessCheck: string;
  preIntegrationCheck: string;
  commonTrap: string;
  canadaPractical?: boolean;
}

export const PUNJABI_REMEDIATION_MERGE_READINESS_SAMPLES_NOTICE =
  "Wave 32 merge-readiness samples only; not A11 integration. Study support only, not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_MERGE_READINESS_FOCI: readonly PunjabiMergeReadinessFocus[] = [
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

export const PUNJABI_MERGE_READINESS_CHECK_TYPES: readonly PunjabiMergeReadinessCheck[] = [
  "merge-readiness",
  "final-regression",
  "pre-integration",
  "route-link",
  "canada-recovery",
] as const;

export const punjabiRemediationMergeReadinessSamples: PunjabiRemediationMergeReadinessSample[] = [
  {
    id: "merge-script-b-p-transit",
    focus: "script-confusion",
    checkType: "merge-readiness",
    audience: "both",
    mergeRouteId: "route-script-babba-pappa",
    sourceArtifactIds: ["dryrun-script-b-p-transit", "regression-script-b-p-transit"],
    sample_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    sample_roman: "bas adda kitthe hai?",
    sample_en: "Where is the bus stand?",
    mergeRisk_vi: "Khi gộp dữ liệu, kiểm tra chữ ਬ có thể bị giảm thành kiểm tra nghĩa.",
    mergeRisk_en: "During merge, the ਬ letter check can be reduced to a meaning check.",
    readinessRepair_vi: "Giữ đối chiếu ਬ/ਪ trước khi cho qua tình huống xe buýt.",
    readinessRepair_en: "Keep the ਬ/ਪ contrast before accepting the bus-stand situation.",
    mergeReadinessCheck: "Confirm merge readiness blocks the route when ਬ and ਪ are swapped.",
    preIntegrationCheck: "Confirm the sample remains Gurmukhi-primary before integration.",
    commonTrap: "Trusting transit context instead of reading the letter.",
    canadaPractical: true,
  },
  {
    id: "merge-script-vowel-help",
    focus: "script-confusion",
    checkType: "final-regression",
    audience: "both",
    mergeRouteId: "route-script-vowel-signs",
    sourceArtifactIds: ["dryrun-script-vowel-sign", "regression-script-vowel-help"],
    sample_pa: "ਕੀ ਤੁਹਾਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
    sample_roman: "ki tuhanu madad chahidi hai?",
    sample_en: "Do you need help?",
    mergeRisk_vi: "Dấu ੀ có thể bị mờ hoặc bỏ qua trong bản dữ liệu gộp.",
    mergeRisk_en: "The ੀ sign can become faint or ignored in merged data.",
    readinessRepair_vi: "Giữ dấu nguyên âm nhìn rõ và kiểm tra trước khi đọc cả câu.",
    readinessRepair_en: "Keep the vowel sign visible and check it before the full sentence.",
    mergeReadinessCheck: "Confirm merge readiness catches missing vowel-sign checks.",
    preIntegrationCheck: "Confirm the help phrase still shows the Gurmukhi vowel sign.",
    commonTrap: "Treating vowel signs as decorative marks.",
  },
  {
    id: "merge-romanization-gurmukhi-first",
    focus: "romanization-dependence",
    checkType: "pre-integration",
    audience: "both",
    mergeRouteId: "romanization-read-gurmukhi-first",
    sourceArtifactIds: ["dryrun-romanization-gurmukhi-first", "regression-romanization-gurmukhi-first"],
    sample_pa: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    sample_roman: "mainu madad chahidi hai.",
    sample_en: "I need help.",
    mergeRisk_vi: "Romanization có thể bị đẩy lên thành lớp đọc chính sau khi gộp.",
    mergeRisk_en: "Romanization can be promoted into the primary reading layer after merge.",
    readinessRepair_vi: "Giữ Gurmukhi là dòng chính; romanization chỉ hỗ trợ.",
    readinessRepair_en: "Keep Gurmukhi as the main line; romanization is support only.",
    mergeReadinessCheck: "Confirm merge readiness requires a Gurmukhi-first read.",
    preIntegrationCheck: "Confirm romanization never replaces the Gurmukhi sample.",
    commonTrap: "Using romanization as the main script.",
    canadaPractical: true,
  },
  {
    id: "merge-shahmukhi-awareness-scope",
    focus: "romanization-dependence",
    checkType: "route-link",
    audience: "both",
    mergeRouteId: "gurmukhi-shahmukhi-awareness",
    sourceArtifactIds: ["dryrun-shahmukhi-awareness", "regression-shahmukhi-awareness-scope"],
    sample_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਪੜ੍ਹਦੇ ਹਾਂ।",
    sample_roman: "asi gurmukhi parhde haan.",
    sample_en: "We study Gurmukhi.",
    mergeRisk_vi: "Ghi chú phạm vi có thể mở rộng thành khóa Shahmukhi đầy đủ.",
    mergeRisk_en: "The scope note can expand into a full Shahmukhi course.",
    readinessRepair_vi: "Nêu rõ Shahmukhi chỉ là nhận biết, không phải khóa đầy đủ.",
    readinessRepair_en: "State that Shahmukhi is awareness only, not a full course.",
    mergeReadinessCheck: "Confirm merge readiness flags full-course Shahmukhi wording.",
    preIntegrationCheck: "Confirm Gurmukhi remains the primary learning script.",
    commonTrap: "Letting awareness notes become a second syllabus.",
  },
  {
    id: "merge-word-order-sov",
    focus: "word-order",
    checkType: "merge-readiness",
    audience: "both",
    mergeRouteId: "word-order-object-before-verb",
    sourceArtifactIds: ["dryrun-word-order-sov", "regression-word-order-sov"],
    sample_pa: "ਮੈਂ ਸੇਬ ਖਾਂਦਾ ਹਾਂ।",
    sample_roman: "main seb khanda haan.",
    sample_en: "I eat an apple.",
    mergeRisk_vi: "Bản gộp có thể để chú giải tiếng Anh kéo câu Punjabi về SVO.",
    mergeRisk_en: "Merged copy can let the English gloss pull Punjabi back into SVO.",
    readinessRepair_vi: "Giữ tân ngữ trước động từ trong mẫu Punjabi.",
    readinessRepair_en: "Keep the object before the verb in the Punjabi sample.",
    mergeReadinessCheck: "Confirm merge readiness catches object-after-verb transfer.",
    preIntegrationCheck: "Confirm the gloss does not rewrite Punjabi word order.",
    commonTrap: "Copying English or Vietnamese sentence order.",
  },
  {
    id: "merge-word-order-appointment-time",
    focus: "word-order",
    checkType: "canada-recovery",
    audience: "both",
    mergeRouteId: "canada-practical-booking-appointment",
    sourceArtifactIds: ["dryrun-canada-appointment-time", "regression-canada-appointment-time"],
    sample_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    sample_roman: "meri appointment kede vele hai?",
    sample_en: "What time is my appointment?",
    mergeRisk_vi: "Câu đặt lịch có thể bị gộp thành mẫu hỏi tiếng Anh máy móc.",
    mergeRisk_en: "The appointment line can merge into a mechanical English question pattern.",
    readinessRepair_vi: "Giữ mẫu Punjabi ... ਕਿਹੜੇ ਵੇਲੇ ਹੈ? cho giờ hẹn.",
    readinessRepair_en: "Keep the Punjabi ... ਕਿਹੜੇ ਵੇਲੇ ਹੈ? pattern for appointment time.",
    mergeReadinessCheck: "Confirm merge readiness preserves the Punjabi appointment question.",
    preIntegrationCheck: "Confirm the phrase remains useful for a Canada appointment.",
    commonTrap: "Borrowing English order in a booking question.",
    canadaPractical: true,
  },
  {
    id: "merge-postposition-human-nu",
    focus: "postpositions",
    checkType: "final-regression",
    audience: "both",
    mergeRouteId: "postpositions-nu-human-object",
    sourceArtifactIds: ["dryrun-postposition-human-nu", "regression-postposition-human-nu"],
    sample_pa: "ਮੈਂ ਉਸਨੂੰ ਦੇਖਿਆ।",
    sample_roman: "main usnu dekhia.",
    sample_en: "I saw him/her.",
    mergeRisk_vi: "Marker ਨੂੰ có thể bị mất khi gộp các ví dụ tân ngữ.",
    mergeRisk_en: "The ਨੂੰ marker can be lost when object examples are merged.",
    readinessRepair_vi: "Giữ ਨੂੰ cho tân ngữ là người cụ thể.",
    readinessRepair_en: "Keep ਨੂੰ for a specific human object.",
    mergeReadinessCheck: "Confirm merge readiness catches missing ਨੂੰ in human-object lines.",
    preIntegrationCheck: "Confirm the route still checks postpositions, not only meaning.",
    commonTrap: "Applying English object marking to Punjabi.",
    canadaPractical: true,
  },
  {
    id: "merge-postposition-location-office",
    focus: "postpositions",
    checkType: "pre-integration",
    audience: "both",
    mergeRouteId: "postpositions-location-vich",
    sourceArtifactIds: ["dryrun-postposition-location-vich", "regression-postposition-location-vich"],
    sample_pa: "ਦਫ਼ਤਰ ਵਿੱਚ",
    sample_roman: "daftar vich",
    sample_en: "in the office",
    mergeRisk_vi: "Cụm địa điểm có thể bị đảo theo kiểu 'in office'.",
    mergeRisk_en: "The location phrase can be reversed into an English-like 'in office' order.",
    readinessRepair_vi: "Giữ thứ tự danh từ + ਵਿੱਚ khi gộp dữ liệu.",
    readinessRepair_en: "Keep noun + ਵਿੱਚ order when data is merged.",
    mergeReadinessCheck: "Confirm merge readiness catches preposition-before-noun transfer.",
    preIntegrationCheck: "Confirm the merged phrase remains ਦਫ਼ਤਰ ਵਿੱਚ.",
    commonTrap: "Matching English phrase order instead of Punjabi order.",
    canadaPractical: true,
  },
  {
    id: "merge-agreement-possessive-book",
    focus: "agreement",
    checkType: "merge-readiness",
    audience: "both",
    mergeRouteId: "agreement-possessive-gender",
    sourceArtifactIds: ["dryrun-agreement-possessive", "regression-agreement-possessive-book"],
    sample_pa: "ਮੇਰੀ ਕਿਤਾਬ ਇੱਥੇ ਹੈ।",
    sample_roman: "meri kitab itthe hai.",
    sample_en: "My book is here.",
    mergeRisk_vi: "Sở hữu có thể bị chuẩn hóa sai theo người nói thay vì danh từ.",
    mergeRisk_en: "Possessives can be wrongly normalized by speaker identity instead of noun gender.",
    readinessRepair_vi: "Giữ ਮੇਰੀ vì ਕਿਤਾਬ là giống cái.",
    readinessRepair_en: "Keep ਮੇਰੀ because ਕਿਤਾਬ is feminine.",
    mergeReadinessCheck: "Confirm merge readiness catches possessive agreement drift.",
    preIntegrationCheck: "Confirm the noun-based agreement note stays attached.",
    commonTrap: "Choosing possessives by speaker gender.",
  },
  {
    id: "merge-agreement-perfective-roti",
    focus: "agreement",
    checkType: "route-link",
    audience: "both",
    mergeRouteId: "gender-number-perfective-roti",
    sourceArtifactIds: ["dryrun-agreement-perfective", "regression-agreement-perfective-roti"],
    sample_pa: "ਉਸ ਨੇ ਰੋਟੀ ਖਾਧੀ।",
    sample_roman: "us ne roti khaadhi.",
    sample_en: "He/she ate roti.",
    mergeRisk_vi: "Khi gộp, động từ hoàn thành có thể mất liên kết với tân ngữ ਰੋਟੀ.",
    mergeRisk_en: "During merge, the perfective verb can lose its link to the object ਰੋਟੀ.",
    readinessRepair_vi: "Giữ ਖਾਧੀ khớp với ਰੋਟੀ.",
    readinessRepair_en: "Keep ਖਾਧੀ matched to ਰੋਟੀ.",
    mergeReadinessCheck: "Confirm merge readiness catches wrong perfective object agreement.",
    preIntegrationCheck: "Confirm the object noun remains visible in the sample.",
    commonTrap: "Using one verb ending for every noun.",
  },
  {
    id: "merge-register-tusi-service",
    focus: "register-mismatch",
    checkType: "final-regression",
    audience: "both",
    mergeRouteId: "register-tusi-not-tu",
    sourceArtifactIds: ["dryrun-register-tusi", "regression-register-tusi-service"],
    sample_pa: "ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?",
    sample_roman: "tusi kive ho?",
    sample_en: "How are you?",
    mergeRisk_vi: "Bản gộp có thể thay ਤੁਸੀਂ bằng ਤੂੰ trong bối cảnh lịch sự.",
    mergeRisk_en: "Merged copy can replace polite ਤੁਸੀਂ with familiar ਤੂੰ in polite settings.",
    readinessRepair_vi: "Giữ ਤੁਸੀਂ cho người lạ hoặc tình huống dịch vụ.",
    readinessRepair_en: "Keep ਤੁਸੀਂ for strangers or service situations.",
    mergeReadinessCheck: "Confirm merge readiness catches casual-vs-polite mismatch.",
    preIntegrationCheck: "Confirm the prompt does not normalize blunt familiar speech.",
    commonTrap: "Using friend-level speech at a service counter.",
  },
  {
    id: "merge-vietnamese-explicit-subject-work",
    focus: "vietnamese-transfer",
    checkType: "pre-integration",
    audience: "vi",
    mergeRouteId: "vietnamese-transfer-explicit-subject",
    sourceArtifactIds: ["dryrun-vietnamese-explicit-subject", "regression-vietnamese-explicit-subject-work"],
    sample_pa: "ਮੈਂ ਅੱਜ ਕੰਮ ਤੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ।",
    sample_roman: "main ajj kamm te janda/jandi haan.",
    sample_en: "I go to work today.",
    mergeRisk_vi: "Người học Việt có thể mất điểm nhắc viết rõ chủ ngữ khi dữ liệu được gộp.",
    mergeRisk_en: "Vietnamese-speaking learners can lose the explicit-subject reminder during merge.",
    readinessRepair_vi: "Giữ ਮੈਂ ở đầu câu khi nhiệm vụ yêu cầu chủ ngữ.",
    readinessRepair_en: "Keep ਮੈਂ at the start when the task requires a subject.",
    mergeReadinessCheck: "Confirm merge readiness catches dropped-subject transfer.",
    preIntegrationCheck: "Confirm the Vietnamese learner route remains explicit.",
    commonTrap: "Trusting context instead of writing the subject.",
    canadaPractical: true,
  },
  {
    id: "merge-english-copula-final",
    focus: "english-transfer",
    checkType: "route-link",
    audience: "en",
    mergeRouteId: "english-transfer-am-is-are",
    sourceArtifactIds: ["dryrun-english-copula-final", "regression-english-copula-final"],
    sample_pa: "ਮੈਂ ਵਿਦਿਆਰਥੀ ਹਾਂ।",
    sample_roman: "main vidyarthi haan.",
    sample_en: "I am a student.",
    mergeRisk_vi: "Người học tiếng Anh có thể thấy bản gộp đặt ਹਾਂ quá sớm theo 'I am'.",
    mergeRisk_en: "English-speaking learners can see merged copy place ਹਾਂ too early from 'I am'.",
    readinessRepair_vi: "Đặt ਹਾਂ ở cuối câu Punjabi.",
    readinessRepair_en: "Place ਹਾਂ at the end of the Punjabi sentence.",
    mergeReadinessCheck: "Confirm merge readiness catches direct English copula transfer.",
    preIntegrationCheck: "Confirm the English learner route keeps Punjabi order.",
    commonTrap: "Writing ਮੈਂ ਹਾਂ ਵਿਦਿਆਰਥੀ from English order.",
  },
  {
    id: "merge-service-library-open",
    focus: "service-phrase-gaps",
    checkType: "canada-recovery",
    audience: "both",
    mergeRouteId: "service-phrase-library-help",
    sourceArtifactIds: ["dryrun-service-library-open", "regression-service-library-open"],
    sample_pa: "ਕੀ ਲਾਇਬ੍ਰੇਰੀ ਖੁੱਲ੍ਹੀ ਹੈ?",
    sample_roman: "ki library khulli hai?",
    sample_en: "Is the library open?",
    mergeRisk_vi: "Khi gộp, câu hỏi giờ mở cửa có thể bị loại vì tưởng là ví dụ phụ.",
    mergeRisk_en: "During merge, the opening-hours question can be dropped as if it were optional.",
    readinessRepair_vi: "Giữ câu hỏi thư viện mở cửa trong nhóm dịch vụ thực tế.",
    readinessRepair_en: "Keep the library opening-hours question in the practical service group.",
    mergeReadinessCheck: "Confirm merge readiness keeps practical service openings covered.",
    preIntegrationCheck: "Confirm the line remains Canada-practical and service-ready.",
    commonTrap: "Skipping practical openings in service speech.",
    canadaPractical: true,
  },
  {
    id: "merge-service-application-deadline",
    focus: "service-phrase-gaps",
    checkType: "merge-readiness",
    audience: "both",
    mergeRouteId: "service-phrase-application-deadline",
    sourceArtifactIds: ["dryrun-service-application-deadline", "regression-service-application-deadline"],
    sample_pa: "ਅਰਜ਼ੀ ਦੀ ਆਖਰੀ ਮਿਤੀ ਕਦੋਂ ਹੈ?",
    sample_roman: "arzi di akhri miti kado hai?",
    sample_en: "When is the application deadline?",
    mergeRisk_vi: "Câu thủ tục có thể mất từ khóa ਅਰਜ਼ੀ hoặc ਆਖਰੀ ਮਿਤੀ.",
    mergeRisk_en: "The procedure line can lose either ਅਰਜ਼ੀ or ਆਖਰੀ ਮਿਤੀ.",
    readinessRepair_vi: "Giữ cả 'đơn' và 'hạn chót' trong câu hỏi.",
    readinessRepair_en: "Keep both the application and deadline terms in the question.",
    mergeReadinessCheck: "Confirm merge readiness preserves application and deadline terms.",
    preIntegrationCheck: "Confirm the route does not reduce the prompt to only 'when'.",
    commonTrap: "Asking only about time without the procedure noun.",
    canadaPractical: true,
  },
  {
    id: "merge-canada-bank-account",
    focus: "canada-practical-recovery",
    checkType: "canada-recovery",
    audience: "both",
    mergeRouteId: "canada-practical-open-account",
    sourceArtifactIds: ["dryrun-canada-bank-account", "regression-canada-bank-account"],
    sample_pa: "ਮੈਂ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।",
    sample_roman: "main khata kholna chahunda/chahundi haan.",
    sample_en: "I want to open an account.",
    mergeRisk_vi: "Yêu cầu ngân hàng có thể bị gộp thành trật tự tiếng Anh.",
    mergeRisk_en: "The bank request can be merged into English request order.",
    readinessRepair_vi: "Giữ ਖਾਤਾ ਖੋਲ੍ਹਣਾ trước ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ.",
    readinessRepair_en: "Keep ਖਾਤਾ ਖੋਲ੍ਹਣਾ before ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ.",
    mergeReadinessCheck: "Confirm merge readiness catches broken word order in the bank request.",
    preIntegrationCheck: "Confirm the line remains a practical Canada service phrase.",
    commonTrap: "Copying English request order at the bank counter.",
    canadaPractical: true,
  },
];
