// src/languages/punjabi/remediationImportReadinessSamples.ts
//
// Punjabi remediation import-readiness samples for Wave 33. Gurmukhi is
// primary; romanization is included only as support. These samples are study
// support only, not official placement or certification. Native review is
// deferred. Shahmukhi is awareness only, not a full course.

export type PunjabiImportReadinessFocus =
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

export type PunjabiImportReadinessCheck =
  | "import-readiness"
  | "final-regression"
  | "pre-integration"
  | "schema-check"
  | "canada-recovery";

export interface PunjabiRemediationImportReadinessSample {
  id: string;
  focus: PunjabiImportReadinessFocus;
  checkType: PunjabiImportReadinessCheck;
  audience: "vi" | "en" | "both";
  importRouteId: string;
  sourceArtifactIds: string[];
  sample_pa: string;
  sample_roman?: string;
  sample_en: string;
  importRisk_vi: string;
  importRisk_en: string;
  expectedImportRepair_vi: string;
  expectedImportRepair_en: string;
  importReadinessCheck: string;
  preIntegrationCheck: string;
  commonTrap: string;
  canadaPractical?: boolean;
}

export const PUNJABI_REMEDIATION_IMPORT_READINESS_SAMPLES_NOTICE =
  "Wave 33 import-readiness samples only; not A11 integration. Study support only, not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_IMPORT_READINESS_FOCI: readonly PunjabiImportReadinessFocus[] = [
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

export const PUNJABI_IMPORT_READINESS_CHECK_TYPES: readonly PunjabiImportReadinessCheck[] = [
  "import-readiness",
  "final-regression",
  "pre-integration",
  "schema-check",
  "canada-recovery",
] as const;

export const punjabiRemediationImportReadinessSamples: PunjabiRemediationImportReadinessSample[] = [
  {
    id: "import-script-b-p-transit",
    focus: "script-confusion",
    checkType: "import-readiness",
    audience: "both",
    importRouteId: "route-script-babba-pappa",
    sourceArtifactIds: ["dryrun-script-b-p-transit", "merge-script-b-p-transit"],
    sample_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    sample_roman: "bas adda kitthe hai?",
    sample_en: "Where is the bus stand?",
    importRisk_vi: "Khi import, câu xe buýt có thể chỉ kiểm tra nghĩa và bỏ đối chiếu ਬ/ਪ.",
    importRisk_en: "On import, the bus prompt can test meaning while dropping the ਬ/ਪ contrast.",
    expectedImportRepair_vi: "Giữ đối chiếu chữ ਬ và ਪ trong cùng bản ghi import.",
    expectedImportRepair_en: "Keep the ਬ and ਪ letter contrast in the same import record.",
    importReadinessCheck: "Confirm import readiness blocks completion when ਬ and ਪ are swapped.",
    preIntegrationCheck: "Confirm the imported sample stays Gurmukhi-primary.",
    commonTrap: "Guessing from transit context instead of reading the letter.",
    canadaPractical: true,
  },
  {
    id: "import-script-vowel-help",
    focus: "script-confusion",
    checkType: "schema-check",
    audience: "both",
    importRouteId: "route-script-vowel-signs",
    sourceArtifactIds: ["dryrun-script-vowel-sign", "merge-script-vowel-help"],
    sample_pa: "ਕੀ ਤੁਹਾਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
    sample_roman: "ki tuhanu madad chahidi hai?",
    sample_en: "Do you need help?",
    importRisk_vi: "Dấu ੀ có thể bị coi là chi tiết trình bày thay vì dữ liệu cần kiểm tra.",
    importRisk_en: "The ੀ sign can be treated as display detail instead of checked data.",
    expectedImportRepair_vi: "Giữ dấu nguyên âm trong trường Gurmukhi và kiểm tra trước câu đầy đủ.",
    expectedImportRepair_en: "Keep the vowel sign in the Gurmukhi field and check it before the full line.",
    importReadinessCheck: "Confirm import readiness catches missing vowel-sign checks.",
    preIntegrationCheck: "Confirm the imported phrase remains legible in Gurmukhi.",
    commonTrap: "Treating vowel signs as decorative marks.",
  },
  {
    id: "import-romanization-gurmukhi-first",
    focus: "romanization-dependence",
    checkType: "pre-integration",
    audience: "both",
    importRouteId: "romanization-read-gurmukhi-first",
    sourceArtifactIds: ["dryrun-romanization-gurmukhi-first", "merge-romanization-gurmukhi-first"],
    sample_pa: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    sample_roman: "mainu madad chahidi hai.",
    sample_en: "I need help.",
    importRisk_vi: "Import có thể đặt romanization trước Gurmukhi trong giao diện học.",
    importRisk_en: "Import can place romanization before Gurmukhi in the learner view.",
    expectedImportRepair_vi: "Giữ Gurmukhi là trường chính; romanization chỉ là trường hỗ trợ.",
    expectedImportRepair_en: "Keep Gurmukhi as the primary field; romanization is support only.",
    importReadinessCheck: "Confirm import readiness requires a Gurmukhi-first read.",
    preIntegrationCheck: "Confirm romanization never replaces the Gurmukhi sample.",
    commonTrap: "Using romanization as the main script.",
    canadaPractical: true,
  },
  {
    id: "import-shahmukhi-awareness-scope",
    focus: "romanization-dependence",
    checkType: "schema-check",
    audience: "both",
    importRouteId: "gurmukhi-shahmukhi-awareness",
    sourceArtifactIds: ["dryrun-shahmukhi-awareness", "merge-shahmukhi-awareness-scope"],
    sample_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਪੜ੍ਹਦੇ ਹਾਂ।",
    sample_roman: "asi gurmukhi parhde haan.",
    sample_en: "We study Gurmukhi.",
    importRisk_vi: "Trường ghi chú có thể bị hiểu thành khóa Shahmukhi đầy đủ.",
    importRisk_en: "The note field can be interpreted as a full Shahmukhi course.",
    expectedImportRepair_vi: "Giữ Shahmukhi ở mức nhận biết và không tạo syllabus riêng.",
    expectedImportRepair_en: "Keep Shahmukhi at awareness level and do not create a separate syllabus.",
    importReadinessCheck: "Confirm import readiness flags full-course Shahmukhi wording.",
    preIntegrationCheck: "Confirm Gurmukhi remains the primary script target.",
    commonTrap: "Letting awareness notes become a second course.",
  },
  {
    id: "import-word-order-sov",
    focus: "word-order",
    checkType: "import-readiness",
    audience: "both",
    importRouteId: "word-order-object-before-verb",
    sourceArtifactIds: ["dryrun-word-order-sov", "merge-word-order-sov"],
    sample_pa: "ਮੈਂ ਸੇਬ ਖਾਂਦਾ ਹਾਂ।",
    sample_roman: "main seb khanda haan.",
    sample_en: "I eat an apple.",
    importRisk_vi: "Bản import có thể để bản dịch tiếng Anh kéo câu Punjabi về SVO.",
    importRisk_en: "The import can let the English translation pull Punjabi back into SVO.",
    expectedImportRepair_vi: "Giữ mẫu chủ ngữ + tân ngữ + động từ trong trường Punjabi.",
    expectedImportRepair_en: "Keep subject + object + verb in the Punjabi field.",
    importReadinessCheck: "Confirm import readiness catches object-after-verb transfer.",
    preIntegrationCheck: "Confirm the gloss does not rewrite Punjabi word order.",
    commonTrap: "Copying English or Vietnamese sentence order.",
  },
  {
    id: "import-word-order-appointment-time",
    focus: "word-order",
    checkType: "canada-recovery",
    audience: "both",
    importRouteId: "canada-practical-booking-appointment",
    sourceArtifactIds: ["dryrun-canada-appointment-time", "merge-word-order-appointment-time"],
    sample_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    sample_roman: "meri appointment kede vele hai?",
    sample_en: "What time is my appointment?",
    importRisk_vi: "Câu đặt lịch có thể bị import thành trật tự hỏi tiếng Anh.",
    importRisk_en: "The appointment question can be imported in English question order.",
    expectedImportRepair_vi: "Giữ mẫu Punjabi ... ਕਿਹੜੇ ਵੇਲੇ ਹੈ? cho giờ hẹn.",
    expectedImportRepair_en: "Keep the Punjabi ... ਕਿਹੜੇ ਵੇਲੇ ਹੈ? pattern for appointment time.",
    importReadinessCheck: "Confirm import readiness preserves the Punjabi appointment question.",
    preIntegrationCheck: "Confirm the phrase remains useful for a Canada appointment.",
    commonTrap: "Borrowing English order in a booking question.",
    canadaPractical: true,
  },
  {
    id: "import-postposition-human-nu",
    focus: "postpositions",
    checkType: "final-regression",
    audience: "both",
    importRouteId: "postpositions-nu-human-object",
    sourceArtifactIds: ["dryrun-postposition-human-nu", "merge-postposition-human-nu"],
    sample_pa: "ਮੈਂ ਉਸਨੂੰ ਦੇਖਿਆ।",
    sample_roman: "main usnu dekhia.",
    sample_en: "I saw him/her.",
    importRisk_vi: "Marker ਨੂੰ có thể bị tách khỏi câu khi import ví dụ tân ngữ.",
    importRisk_en: "The ਨੂੰ marker can be separated from the line when object examples are imported.",
    expectedImportRepair_vi: "Giữ ਨੂੰ trong câu với tân ngữ là người cụ thể.",
    expectedImportRepair_en: "Keep ਨੂੰ in the sentence with a specific human object.",
    importReadinessCheck: "Confirm import readiness catches missing ਨੂੰ in human-object lines.",
    preIntegrationCheck: "Confirm the route still checks postpositions, not only meaning.",
    commonTrap: "Applying English object marking to Punjabi.",
    canadaPractical: true,
  },
  {
    id: "import-postposition-location-office",
    focus: "postpositions",
    checkType: "pre-integration",
    audience: "both",
    importRouteId: "postpositions-location-vich",
    sourceArtifactIds: ["dryrun-postposition-location-vich", "merge-postposition-location-office"],
    sample_pa: "ਦਫ਼ਤਰ ਵਿੱਚ",
    sample_roman: "daftar vich",
    sample_en: "in the office",
    importRisk_vi: "Trường địa điểm có thể bị đảo thành giới từ trước danh từ.",
    importRisk_en: "The location field can be reversed into preposition-before-noun order.",
    expectedImportRepair_vi: "Giữ danh từ + ਵਿੱਚ trong bản ghi import.",
    expectedImportRepair_en: "Keep noun + ਵਿੱਚ in the import record.",
    importReadinessCheck: "Confirm import readiness catches preposition-before-noun transfer.",
    preIntegrationCheck: "Confirm the imported phrase remains ਦਫ਼ਤਰ ਵਿੱਚ.",
    commonTrap: "Matching English phrase order instead of Punjabi order.",
    canadaPractical: true,
  },
  {
    id: "import-agreement-possessive-book",
    focus: "agreement",
    checkType: "import-readiness",
    audience: "both",
    importRouteId: "agreement-possessive-gender",
    sourceArtifactIds: ["dryrun-agreement-possessive", "merge-agreement-possessive-book"],
    sample_pa: "ਮੇਰੀ ਕਿਤਾਬ ਇੱਥੇ ਹੈ।",
    sample_roman: "meri kitab itthe hai.",
    sample_en: "My book is here.",
    importRisk_vi: "Import có thể làm mất ghi chú rằng sở hữu phụ thuộc vào giống của danh từ.",
    importRisk_en: "Import can lose the note that possessives depend on noun gender.",
    expectedImportRepair_vi: "Giữ ਮੇਰੀ vì ਕਿਤਾਬ là giống cái.",
    expectedImportRepair_en: "Keep ਮੇਰੀ because ਕਿਤਾਬ is feminine.",
    importReadinessCheck: "Confirm import readiness catches possessive agreement drift.",
    preIntegrationCheck: "Confirm the noun-based agreement note stays attached.",
    commonTrap: "Choosing possessives by speaker gender.",
  },
  {
    id: "import-agreement-perfective-roti",
    focus: "agreement",
    checkType: "schema-check",
    audience: "both",
    importRouteId: "gender-number-perfective-roti",
    sourceArtifactIds: ["dryrun-agreement-perfective", "merge-agreement-perfective-roti"],
    sample_pa: "ਉਸ ਨੇ ਰੋਟੀ ਖਾਧੀ।",
    sample_roman: "us ne roti khaadhi.",
    sample_en: "He/she ate roti.",
    importRisk_vi: "Động từ hoàn thành có thể bị import như kết thúc mặc định, không khớp ਰੋਟੀ.",
    importRisk_en: "The perfective verb can be imported as a default ending, not matched to ਰੋਟੀ.",
    expectedImportRepair_vi: "Giữ ਖਾਧੀ khớp với tân ngữ ਰੋਟੀ.",
    expectedImportRepair_en: "Keep ਖਾਧੀ matched to the object ਰੋਟੀ.",
    importReadinessCheck: "Confirm import readiness catches wrong perfective object agreement.",
    preIntegrationCheck: "Confirm the object noun remains visible in the sample.",
    commonTrap: "Using one verb ending for every noun.",
  },
  {
    id: "import-register-tusi-service",
    focus: "register-mismatch",
    checkType: "final-regression",
    audience: "both",
    importRouteId: "register-tusi-not-tu",
    sourceArtifactIds: ["dryrun-register-tusi", "merge-register-tusi-service"],
    sample_pa: "ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?",
    sample_roman: "tusi kive ho?",
    sample_en: "How are you?",
    importRisk_vi: "Bản import có thể thay đại từ lịch sự bằng dạng thân mật quá mức.",
    importRisk_en: "The import can replace polite address with an overly familiar form.",
    expectedImportRepair_vi: "Giữ ਤੁਸੀਂ cho người lạ hoặc tình huống dịch vụ.",
    expectedImportRepair_en: "Keep ਤੁਸੀਂ for strangers or service situations.",
    importReadinessCheck: "Confirm import readiness catches casual-vs-polite mismatch.",
    preIntegrationCheck: "Confirm the prompt does not normalize blunt familiar speech.",
    commonTrap: "Using friend-level speech at a service counter.",
  },
  {
    id: "import-vietnamese-explicit-subject-work",
    focus: "vietnamese-transfer",
    checkType: "pre-integration",
    audience: "vi",
    importRouteId: "vietnamese-transfer-explicit-subject",
    sourceArtifactIds: ["dryrun-vietnamese-explicit-subject", "merge-vietnamese-explicit-subject-work"],
    sample_pa: "ਮੈਂ ਅੱਜ ਕੰਮ ਤੇ ਜਾਂਦਾ/ਜਾਂਦੀ ਹਾਂ।",
    sample_roman: "main ajj kamm te janda/jandi haan.",
    sample_en: "I go to work today.",
    importRisk_vi: "Người học Việt có thể mất nhắc nhở viết rõ chủ ngữ khi import.",
    importRisk_en: "Vietnamese-speaking learners can lose the explicit-subject reminder during import.",
    expectedImportRepair_vi: "Giữ ਮੈਂ ở đầu câu khi nhiệm vụ yêu cầu chủ ngữ.",
    expectedImportRepair_en: "Keep ਮੈਂ at the start when the task requires a subject.",
    importReadinessCheck: "Confirm import readiness catches dropped-subject transfer.",
    preIntegrationCheck: "Confirm the Vietnamese learner route remains explicit.",
    commonTrap: "Trusting context instead of writing the subject.",
    canadaPractical: true,
  },
  {
    id: "import-english-copula-final",
    focus: "english-transfer",
    checkType: "schema-check",
    audience: "en",
    importRouteId: "english-transfer-am-is-are",
    sourceArtifactIds: ["dryrun-english-copula-final", "merge-english-copula-final"],
    sample_pa: "ਮੈਂ ਵਿਦਿਆਰਥੀ ਹਾਂ।",
    sample_roman: "main vidyarthi haan.",
    sample_en: "I am a student.",
    importRisk_vi: "Người học tiếng Anh có thể thấy import đặt ਹਾਂ theo trật tự 'I am'.",
    importRisk_en: "English-speaking learners can see import place ਹਾਂ in 'I am' order.",
    expectedImportRepair_vi: "Đặt ਹਾਂ ở cuối câu Punjabi.",
    expectedImportRepair_en: "Place ਹਾਂ at the end of the Punjabi sentence.",
    importReadinessCheck: "Confirm import readiness catches direct English copula transfer.",
    preIntegrationCheck: "Confirm the English learner route keeps Punjabi order.",
    commonTrap: "Writing ਮੈਂ ਹਾਂ ਵਿਦਿਆਰਥੀ from English order.",
  },
  {
    id: "import-service-library-open",
    focus: "service-phrase-gaps",
    checkType: "canada-recovery",
    audience: "both",
    importRouteId: "service-phrase-library-help",
    sourceArtifactIds: ["dryrun-service-library-open", "merge-service-library-open"],
    sample_pa: "ਕੀ ਲਾਇਬ੍ਰੇਰੀ ਖੁੱਲ੍ਹੀ ਹੈ?",
    sample_roman: "ki library khulli hai?",
    sample_en: "Is the library open?",
    importRisk_vi: "Câu hỏi giờ mở cửa có thể bị loại vì tưởng là ví dụ phụ.",
    importRisk_en: "The opening-hours question can be dropped as if it were optional.",
    expectedImportRepair_vi: "Giữ câu hỏi thư viện mở cửa trong nhóm dịch vụ thực tế.",
    expectedImportRepair_en: "Keep the library opening-hours question in the practical service group.",
    importReadinessCheck: "Confirm import readiness keeps practical service openings covered.",
    preIntegrationCheck: "Confirm the line remains Canada-practical and service-ready.",
    commonTrap: "Skipping practical openings in service speech.",
    canadaPractical: true,
  },
  {
    id: "import-service-application-deadline",
    focus: "service-phrase-gaps",
    checkType: "import-readiness",
    audience: "both",
    importRouteId: "service-phrase-application-deadline",
    sourceArtifactIds: ["dryrun-service-application-deadline", "merge-service-application-deadline"],
    sample_pa: "ਅਰਜ਼ੀ ਦੀ ਆਖਰੀ ਮਿਤੀ ਕਦੋਂ ਹੈ?",
    sample_roman: "arzi di akhri miti kado hai?",
    sample_en: "When is the application deadline?",
    importRisk_vi: "Câu thủ tục có thể mất từ khóa ਅਰਜ਼ੀ hoặc ਆਖਰੀ ਮਿਤੀ trong import.",
    importRisk_en: "The procedure line can lose either ਅਰਜ਼ੀ or ਆਖਰੀ ਮਿਤੀ during import.",
    expectedImportRepair_vi: "Giữ cả 'đơn' và 'hạn chót' trong câu hỏi.",
    expectedImportRepair_en: "Keep both the application and deadline terms in the question.",
    importReadinessCheck: "Confirm import readiness preserves application and deadline terms.",
    preIntegrationCheck: "Confirm the route does not reduce the prompt to only 'when'.",
    commonTrap: "Asking only about time without the procedure noun.",
    canadaPractical: true,
  },
  {
    id: "import-canada-bank-account",
    focus: "canada-practical-recovery",
    checkType: "canada-recovery",
    audience: "both",
    importRouteId: "canada-practical-open-account",
    sourceArtifactIds: ["dryrun-canada-bank-account", "merge-canada-bank-account"],
    sample_pa: "ਮੈਂ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।",
    sample_roman: "main khata kholna chahunda/chahundi haan.",
    sample_en: "I want to open an account.",
    importRisk_vi: "Yêu cầu ngân hàng có thể bị import theo trật tự tiếng Anh.",
    importRisk_en: "The bank request can be imported in English request order.",
    expectedImportRepair_vi: "Giữ ਖਾਤਾ ਖੋਲ੍ਹਣਾ trước ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ.",
    expectedImportRepair_en: "Keep ਖਾਤਾ ਖੋਲ੍ਹਣਾ before ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ.",
    importReadinessCheck: "Confirm import readiness catches broken word order in the bank request.",
    preIntegrationCheck: "Confirm the line remains a practical Canada service phrase.",
    commonTrap: "Copying English request order at the bank counter.",
    canadaPractical: true,
  },
];
