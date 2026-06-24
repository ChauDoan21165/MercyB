// Punjabi remediation catalog samples for Wave 58. Gurmukhi is primary;
// romanization is support only. These items are study support only, not
// official placement or certification. Native review is deferred. Shahmukhi is
// awareness only, not a full course. This is not A11 integration.

export type PunjabiRemediationCatalogFocus =
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

export type PunjabiRemediationCatalogStage =
  | "pre-a11-catalog"
  | "bundle"
  | "receipt"
  | "pre-integration";

export interface PunjabiRemediationCatalogSample {
  id: string;
  focus: PunjabiRemediationCatalogFocus;
  stage: PunjabiRemediationCatalogStage;
  audience: "vi" | "en" | "both";
  catalogId: string;
  sourceArtifactIds: string[];
  learnerPrompt_pa: string;
  learnerPrompt_roman?: string;
  learnerPrompt_en: string;
  catalogRepair_pa: string;
  catalogRepair_roman?: string;
  catalogRepair_en: string;
  explanation_vi: string;
  explanation_en: string;
  catalogCheck: string;
  commonTrap: string;
  rejectIf_vi: string;
  rejectIf_en: string;
  canadaPractical?: boolean;
}

export const PUNJABI_REMEDIATION_CATALOG_NOTICE =
  "Wave 58 remediation catalog samples only; not A11 integration. Study support only, not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_REMEDIATION_CATALOG_FOCI: readonly PunjabiRemediationCatalogFocus[] = [
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

export const PUNJABI_REMEDIATION_CATALOG_STAGES: readonly PunjabiRemediationCatalogStage[] = [
  "pre-a11-catalog",
  "bundle",
  "receipt",
  "pre-integration",
] as const;

export const punjabiRemediationCatalogSamples: PunjabiRemediationCatalogSample[] = [
  {
    id: "catalog-script-bus-stop",
    focus: "script-confusion",
    stage: "pre-a11-catalog",
    audience: "both",
    catalogId: "script-bus-stop-gurmukhi-catalog",
    sourceArtifactIds: ["receipt-script-bus-stop", "bundle-script-bus-stop"],
    learnerPrompt_pa: "ਬੱਸ ਅੱਡਾ",
    learnerPrompt_roman: "bas adda",
    learnerPrompt_en: "bus stop",
    catalogRepair_pa: "ਬੱਸ ਅੱਡਾ ਸੜਕ ਦੇ ਸਾਹਮਣੇ ਹੈ।",
    catalogRepair_roman: "bas adda sarak de sahmane hai.",
    catalogRepair_en: "The bus stop is across the street.",
    explanation_vi: "Catalog giữ cụm Gurmukhi chính; romanization chỉ hỗ trợ âm.",
    explanation_en: "The catalog keeps the Gurmukhi phrase primary; romanization only supports sound.",
    catalogCheck: "Confirm the pre-A11 catalog preserves the full transit phrase in Gurmukhi.",
    commonTrap: "Guessing bus from context while skipping the Gurmukhi contrast.",
    rejectIf_vi: "Không chấp nhận nếu người học vẫn lẫn ਬ với ਪ.",
    rejectIf_en: "Reject if the learner still confuses ਬ with ਪ.",
    canadaPractical: true,
  },
  {
    id: "catalog-romanization-boundary",
    focus: "romanization-dependence",
    stage: "receipt",
    audience: "both",
    catalogId: "romanization-support-only-catalog",
    sourceArtifactIds: ["receipt-romanization-boundary", "bundle-romanization-boundary"],
    learnerPrompt_pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਹਰਾਓ।",
    learnerPrompt_roman: "kirpa karke hauli duhrao.",
    learnerPrompt_en: "Please repeat slowly.",
    catalogRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਹੌਲੀ ਕਹੋ।",
    catalogRepair_roman: "kirpa karke dubara hauli kaho.",
    catalogRepair_en: "Please say it again slowly.",
    explanation_vi: "Catalog xác nhận Gurmukhi là dòng đọc chính, không phải romanization.",
    explanation_en: "The catalog confirms Gurmukhi is the reading line, not romanization.",
    catalogCheck: "Confirm the receipt catalog keeps romanization as support only.",
    commonTrap: "Memorizing Latin spelling and losing the Gurmukhi sentence.",
    rejectIf_vi: "Không chấp nhận nếu romanization trở thành nội dung chính.",
    rejectIf_en: "Reject if romanization becomes the primary content.",
    canadaPractical: true,
  },
  {
    id: "catalog-shahmukhi-awareness",
    focus: "romanization-dependence",
    stage: "pre-integration",
    audience: "en",
    catalogId: "shahmukhi-awareness-boundary-catalog",
    sourceArtifactIds: ["receipt-shahmukhi-awareness", "bundle-shahmukhi-awareness"],
    learnerPrompt_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਵਰਤਦੇ ਹਾਂ।",
    learnerPrompt_roman: "asi gurmukhi vartde haan.",
    learnerPrompt_en: "We use Gurmukhi.",
    catalogRepair_pa: "ਇਹ ਗੁਰਮੁਖੀ ਅਭਿਆਸ ਹੈ।",
    catalogRepair_roman: "ih gurmukhi abhyas hai.",
    catalogRepair_en: "This is Gurmukhi practice.",
    explanation_vi: "Shahmukhi chỉ là nhận biết hệ chữ khác, không phải khóa học đầy đủ.",
    explanation_en: "Shahmukhi is only awareness of another script, not a full course.",
    catalogCheck: "Confirm the pre-integration catalog keeps Shahmukhi bounded to awareness.",
    commonTrap: "Expanding an awareness note into a separate Shahmukhi path.",
    rejectIf_vi: "Không chấp nhận nếu mục này mở thành giáo trình Shahmukhi.",
    rejectIf_en: "Reject if this item opens into a Shahmukhi syllabus.",
  },
  {
    id: "catalog-word-order-appointment",
    focus: "word-order",
    stage: "bundle",
    audience: "both",
    catalogId: "appointment-time-order-catalog",
    sourceArtifactIds: ["receipt-word-order-appointment", "bundle-word-order-appointment"],
    learnerPrompt_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    learnerPrompt_roman: "meri appointment kede vele hai?",
    learnerPrompt_en: "What time is my appointment?",
    catalogRepair_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    catalogRepair_roman: "meri appointment kede vele hai?",
    catalogRepair_en: "What time is my appointment?",
    explanation_vi: "Catalog giữ trật tự Punjabi tự nhiên khi hỏi giờ hẹn.",
    explanation_en: "The catalog keeps natural Punjabi order when asking appointment time.",
    catalogCheck: "Confirm the bundle catalog catches English-style question reordering.",
    commonTrap: "Moving the question words to copy English.",
    rejectIf_vi: "Không chấp nhận nếu câu hỏi sao chép trật tự tiếng Anh.",
    rejectIf_en: "Reject if the question copies English word order.",
    canadaPractical: true,
  },
  {
    id: "catalog-postposition-library",
    focus: "postpositions",
    stage: "pre-integration",
    audience: "en",
    catalogId: "library-vich-postposition-catalog",
    sourceArtifactIds: ["receipt-postposition-library", "bundle-postposition-library"],
    learnerPrompt_pa: "ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ",
    learnerPrompt_roman: "library vich",
    learnerPrompt_en: "in the library",
    catalogRepair_pa: "ਮੈਂ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਫਾਰਮ ਭਰ ਰਿਹਾ/ਰਹੀ ਹਾਂ।",
    catalogRepair_roman: "main library vich form bhar riha/rahi haan.",
    catalogRepair_en: "I am filling out the form in the library.",
    explanation_vi: "ਵਿੱਚ là marker vị trí bắt buộc trong câu này.",
    explanation_en: "ਵਿੱਚ is the required location marker in this sentence.",
    catalogCheck: "Confirm the pre-integration catalog preserves postpositions in location recovery.",
    commonTrap: "Dropping ਵਿੱਚ after thinking of the English preposition in.",
    rejectIf_vi: "Không chấp nhận nếu câu thiếu postposition Punjabi.",
    rejectIf_en: "Reject if the Punjabi postposition is missing.",
    canadaPractical: true,
  },
  {
    id: "catalog-agreement-bank-card",
    focus: "agreement",
    stage: "receipt",
    audience: "both",
    catalogId: "bank-card-agreement-catalog",
    sourceArtifactIds: ["receipt-agreement-bank-card", "bundle-agreement-bank-card"],
    learnerPrompt_pa: "ਮੇਰਾ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।",
    learnerPrompt_roman: "mera card gumm giya hai.",
    learnerPrompt_en: "My card is lost.",
    catalogRepair_pa: "ਮੇਰਾ ਬੈਂਕ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।",
    catalogRepair_roman: "mera bank card gumm giya hai.",
    catalogRepair_en: "My bank card is lost.",
    explanation_vi: "Catalog giữ ਮੇਰਾ và ਗਿਆ đồng bộ với ਨਾਂਵ trong câu báo mất thẻ.",
    explanation_en: "The catalog keeps ਮੇਰਾ and ਗਿਆ aligned with the noun in the lost-card sentence.",
    catalogCheck: "Confirm the receipt catalog keeps gender and number agreement stable.",
    commonTrap: "Reusing one ending for every noun after memorizing the pattern.",
    rejectIf_vi: "Không chấp nhận nếu agreement đổi ngẫu nhiên khi thêm ਬੈਂਕ.",
    rejectIf_en: "Reject if agreement changes randomly after adding ਬੈਂਕ.",
    canadaPractical: true,
  },
  {
    id: "catalog-register-clinic",
    focus: "register-mismatch",
    stage: "pre-a11-catalog",
    audience: "both",
    catalogId: "clinic-polite-register-catalog",
    sourceArtifactIds: ["receipt-register-clinic", "bundle-register-clinic"],
    learnerPrompt_pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨੂੰ ਮਿਲਣਾ ਹੈ।",
    learnerPrompt_roman: "mainu doctor nu milna hai.",
    learnerPrompt_en: "I need to see a doctor.",
    catalogRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਕੀ ਡਾਕਟਰ ਅੱਜ ਮਿਲ ਸਕਦੇ ਹਨ?",
    catalogRepair_roman: "kirpa karke dasso, ki doctor ajj mil sakde han?",
    catalogRepair_en: "Please tell me, can the doctor see me today?",
    explanation_vi: "Ở phòng khám, catalog giữ yêu cầu lịch sự và đủ câu.",
    explanation_en: "At a clinic, the catalog keeps the request polite and complete.",
    catalogCheck: "Confirm the pre-A11 catalog keeps service register polite without over-formality.",
    commonTrap: "Sounding abrupt at reception by using a clipped sentence.",
    rejectIf_vi: "Không chấp nhận nếu câu sửa thành mệnh lệnh trống.",
    rejectIf_en: "Reject if the repair becomes a bare command.",
    canadaPractical: true,
  },
  {
    id: "catalog-vietnamese-transfer-form",
    focus: "vietnamese-transfer",
    stage: "bundle",
    audience: "vi",
    catalogId: "vi-transfer-form-help-catalog",
    sourceArtifactIds: ["receipt-vietnamese-transfer-form", "bundle-vietnamese-transfer-form"],
    learnerPrompt_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    learnerPrompt_roman: "mainu ih form chahida hai.",
    learnerPrompt_en: "I need this form.",
    catalogRepair_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    catalogRepair_roman: "mainu ih form bharan vich madad chahidi hai.",
    catalogRepair_en: "I need help filling out this form.",
    explanation_vi: "Không dịch từng mảnh từ tiếng Việt; giữ ਇਹ, ਵਿੱਚ, và cụm Punjabi rõ.",
    explanation_en: "Do not translate Vietnamese chunks directly; keep clear Punjabi ਇਹ, ਵਿੱਚ, and phrase shape.",
    catalogCheck: "Confirm the bundle catalog catches Vietnamese transfer in form-help requests.",
    commonTrap: "Building the Punjabi sentence from Vietnamese word chunks.",
    rejectIf_vi: "Không chấp nhận nếu marker Punjabi biến mất vì dịch từng mảnh.",
    rejectIf_en: "Reject if Punjabi markers disappear through chunk-by-chunk Vietnamese transfer.",
    canadaPractical: true,
  },
  {
    id: "catalog-english-transfer-phone",
    focus: "english-transfer",
    stage: "pre-integration",
    audience: "en",
    catalogId: "english-transfer-nu-phone-catalog",
    sourceArtifactIds: ["receipt-english-transfer-phone", "bundle-english-transfer-phone"],
    learnerPrompt_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    learnerPrompt_roman: "ki tusi usnu phone kar sakde ho?",
    learnerPrompt_en: "Can you call him/her?",
    catalogRepair_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    catalogRepair_roman: "ki tusi usnu phone kar sakde ho?",
    catalogRepair_en: "Can you call him/her?",
    explanation_vi: "Punjabi cần ਨੂੰ cho người cụ thể, dù tiếng Anh không có marker tương ứng.",
    explanation_en: "Punjabi needs ਨੂੰ for a specific person even though English has no matching marker.",
    catalogCheck: "Confirm the pre-integration catalog catches English transfer around ਨੂੰ.",
    commonTrap: "Dropping ਨੂੰ because the English sentence has no visible equivalent.",
    rejectIf_vi: "Không chấp nhận nếu ਉਸਨੂੰ bị rút thành ਉਸ vì ảnh hưởng tiếng Anh.",
    rejectIf_en: "Reject if ਉਸਨੂੰ is reduced to ਉਸ through English transfer.",
    canadaPractical: true,
  },
  {
    id: "catalog-service-phrase-counter",
    focus: "service-phrase-gaps",
    stage: "receipt",
    audience: "both",
    catalogId: "full-service-counter-request-catalog",
    sourceArtifactIds: ["receipt-service-phrase-counter", "bundle-service-phrase-counter"],
    learnerPrompt_pa: "ਮਦਦ?",
    learnerPrompt_roman: "madad?",
    learnerPrompt_en: "Help?",
    catalogRepair_pa: "ਮਾਫ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?",
    catalogRepair_roman: "maaf karna, ki tusi meri madad kar sakde ho?",
    catalogRepair_en: "Excuse me, can you help me?",
    explanation_vi: "Ở quầy dịch vụ, catalog giữ câu đầy đủ thay vì một từ rời.",
    explanation_en: "At a service counter, the catalog keeps a complete sentence instead of one loose word.",
    catalogCheck: "Confirm the receipt catalog includes complete service phrases.",
    commonTrap: "Using one emergency word for every routine service interaction.",
    rejectIf_vi: "Không chấp nhận nếu câu sửa vẫn chỉ là một từ.",
    rejectIf_en: "Reject if the repair is still only one word.",
    canadaPractical: true,
  },
  {
    id: "catalog-canada-practical-pharmacy",
    focus: "canada-practical-recovery",
    stage: "pre-a11-catalog",
    audience: "both",
    catalogId: "pharmacy-refill-recovery-catalog",
    sourceArtifactIds: ["receipt-canada-practical-pharmacy", "bundle-canada-practical-pharmacy"],
    learnerPrompt_pa: "ਮੇਰੀ ਦਵਾਈ ਮੁੱਕ ਗਈ ਹੈ।",
    learnerPrompt_roman: "meri davai mukk gai hai.",
    learnerPrompt_en: "My medicine has run out.",
    catalogRepair_pa: "ਕੀ ਮੈਂ ਫਾਰਮੇਸੀ ਵਿੱਚ ਆਪਣੀ ਦਵਾਈ ਦੁਬਾਰਾ ਲੈ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    catalogRepair_roman: "ki main pharmacy vich apni davai dubara lai sakda/sakdi haan?",
    catalogRepair_en: "Can I get my medicine again at the pharmacy?",
    explanation_vi: "Tình huống Canada thực tế: catalog giữ câu lịch sự, postposition, và agreement.",
    explanation_en: "Canada-practical recovery: the catalog keeps the polite question, postposition, and agreement.",
    catalogCheck: "Confirm the pre-A11 catalog is stable for pharmacy recovery before later integration.",
    commonTrap: "Using English order and dropping ਵਿੱਚ in a pharmacy request.",
    rejectIf_vi: "Không chấp nhận nếu câu chỉ là ghi chú tiếng Anh dịch rời rạc.",
    rejectIf_en: "Reject if the sentence is only a loose translation of an English note.",
    canadaPractical: true,
  },
];

export function punjabiRemediationCatalogSamplesByFocus(
  focus: PunjabiRemediationCatalogFocus,
): PunjabiRemediationCatalogSample[] {
  return punjabiRemediationCatalogSamples.filter((sample) => sample.focus === focus);
}

export function punjabiRemediationCatalogSamplesByStage(
  stage: PunjabiRemediationCatalogStage,
): PunjabiRemediationCatalogSample[] {
  return punjabiRemediationCatalogSamples.filter((sample) => sample.stage === stage);
}

export function punjabiRemediationCatalogSamplesByAudience(
  audience: PunjabiRemediationCatalogSample["audience"],
): PunjabiRemediationCatalogSample[] {
  return punjabiRemediationCatalogSamples.filter((sample) => sample.audience === audience);
}
