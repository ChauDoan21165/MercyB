// Punjabi remediation receipt samples for Wave 56. Gurmukhi is primary;
// romanization is support only. These items are study support only, not
// official placement or certification. Native review is deferred. Shahmukhi is
// awareness only, not a full course. This is not A11 integration.

export type PunjabiRemediationReceiptFocus =
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

export type PunjabiRemediationReceiptStage =
  | "pre-a11-receipt"
  | "ledger"
  | "archive"
  | "pre-integration";

export interface PunjabiRemediationReceiptSample {
  id: string;
  focus: PunjabiRemediationReceiptFocus;
  stage: PunjabiRemediationReceiptStage;
  audience: "vi" | "en" | "both";
  receiptId: string;
  sourceArtifactIds: string[];
  learnerPrompt_pa: string;
  learnerPrompt_roman?: string;
  learnerPrompt_en: string;
  receiptRepair_pa: string;
  receiptRepair_roman?: string;
  receiptRepair_en: string;
  explanation_vi: string;
  explanation_en: string;
  receiptCheck: string;
  commonTrap: string;
  rejectIf_vi: string;
  rejectIf_en: string;
  canadaPractical?: boolean;
}

export const PUNJABI_REMEDIATION_RECEIPT_NOTICE =
  "Wave 56 remediation receipt samples only; not A11 integration. Study support only, not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_REMEDIATION_RECEIPT_FOCI: readonly PunjabiRemediationReceiptFocus[] = [
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

export const PUNJABI_REMEDIATION_RECEIPT_STAGES: readonly PunjabiRemediationReceiptStage[] = [
  "pre-a11-receipt",
  "ledger",
  "archive",
  "pre-integration",
] as const;

export const punjabiRemediationReceiptSamples: PunjabiRemediationReceiptSample[] = [
  {
    id: "receipt-script-bus-stop",
    focus: "script-confusion",
    stage: "pre-a11-receipt",
    audience: "both",
    receiptId: "script-bus-stop-gurmukhi-receipt",
    sourceArtifactIds: ["ledger-script-bus-stop", "archive-script-bus-stop"],
    learnerPrompt_pa: "ਬੱਸ ਅੱਡਾ",
    learnerPrompt_roman: "bas adda",
    learnerPrompt_en: "bus stop",
    receiptRepair_pa: "ਬੱਸ ਅੱਡਾ ਸੜਕ ਦੇ ਸਾਹਮਣੇ ਹੈ।",
    receiptRepair_roman: "bas adda sarak de sahmane hai.",
    receiptRepair_en: "The bus stop is across the street.",
    explanation_vi: "Receipt giữ cụm Gurmukhi chính; romanization chỉ hỗ trợ âm.",
    explanation_en: "The receipt keeps the Gurmukhi phrase primary; romanization only supports sound.",
    receiptCheck: "Confirm the pre-A11 receipt preserves the full transit phrase in Gurmukhi.",
    commonTrap: "Guessing bus from context while skipping the Gurmukhi contrast.",
    rejectIf_vi: "Không chấp nhận nếu người học vẫn lẫn ਬ với ਪ.",
    rejectIf_en: "Reject if the learner still confuses ਬ with ਪ.",
    canadaPractical: true,
  },
  {
    id: "receipt-romanization-boundary",
    focus: "romanization-dependence",
    stage: "ledger",
    audience: "both",
    receiptId: "romanization-support-only-receipt",
    sourceArtifactIds: ["ledger-romanization-boundary", "archive-romanization-boundary"],
    learnerPrompt_pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਹਰਾਓ।",
    learnerPrompt_roman: "kirpa karke hauli duhrao.",
    learnerPrompt_en: "Please repeat slowly.",
    receiptRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਹੌਲੀ ਕਹੋ।",
    receiptRepair_roman: "kirpa karke dubara hauli kaho.",
    receiptRepair_en: "Please say it again slowly.",
    explanation_vi: "Receipt xác nhận Gurmukhi là dòng đọc chính, không phải romanization.",
    explanation_en: "The receipt confirms Gurmukhi is the reading line, not romanization.",
    receiptCheck: "Confirm the ledger receipt keeps romanization as support only.",
    commonTrap: "Memorizing Latin spelling and losing the Gurmukhi sentence.",
    rejectIf_vi: "Không chấp nhận nếu romanization trở thành nội dung chính.",
    rejectIf_en: "Reject if romanization becomes the primary content.",
    canadaPractical: true,
  },
  {
    id: "receipt-shahmukhi-awareness",
    focus: "romanization-dependence",
    stage: "pre-integration",
    audience: "en",
    receiptId: "shahmukhi-awareness-boundary-receipt",
    sourceArtifactIds: ["ledger-shahmukhi-awareness", "archive-shahmukhi-awareness"],
    learnerPrompt_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਵਰਤਦੇ ਹਾਂ।",
    learnerPrompt_roman: "asi gurmukhi vartde haan.",
    learnerPrompt_en: "We use Gurmukhi.",
    receiptRepair_pa: "ਇਹ ਗੁਰਮੁਖੀ ਅਭਿਆਸ ਹੈ।",
    receiptRepair_roman: "ih gurmukhi abhyas hai.",
    receiptRepair_en: "This is Gurmukhi practice.",
    explanation_vi: "Shahmukhi chỉ là nhận biết hệ chữ khác, không phải khóa học đầy đủ.",
    explanation_en: "Shahmukhi is only awareness of another script, not a full course.",
    receiptCheck: "Confirm the pre-integration receipt keeps Shahmukhi bounded to awareness.",
    commonTrap: "Expanding an awareness note into a separate Shahmukhi path.",
    rejectIf_vi: "Không chấp nhận nếu mục này mở thành giáo trình Shahmukhi.",
    rejectIf_en: "Reject if this item opens into a Shahmukhi syllabus.",
  },
  {
    id: "receipt-word-order-appointment",
    focus: "word-order",
    stage: "archive",
    audience: "both",
    receiptId: "appointment-time-order-receipt",
    sourceArtifactIds: ["ledger-word-order-appointment", "archive-word-order-appointment"],
    learnerPrompt_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    learnerPrompt_roman: "meri appointment kede vele hai?",
    learnerPrompt_en: "What time is my appointment?",
    receiptRepair_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    receiptRepair_roman: "meri appointment kede vele hai?",
    receiptRepair_en: "What time is my appointment?",
    explanation_vi: "Receipt giữ trật tự Punjabi tự nhiên khi hỏi giờ hẹn.",
    explanation_en: "The receipt keeps natural Punjabi order when asking appointment time.",
    receiptCheck: "Confirm the archive receipt catches English-style question reordering.",
    commonTrap: "Moving the question words to copy English.",
    rejectIf_vi: "Không chấp nhận nếu câu hỏi sao chép trật tự tiếng Anh.",
    rejectIf_en: "Reject if the question copies English word order.",
    canadaPractical: true,
  },
  {
    id: "receipt-postposition-library",
    focus: "postpositions",
    stage: "pre-integration",
    audience: "en",
    receiptId: "library-vich-postposition-receipt",
    sourceArtifactIds: ["ledger-postposition-library", "archive-postposition-library"],
    learnerPrompt_pa: "ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ",
    learnerPrompt_roman: "library vich",
    learnerPrompt_en: "in the library",
    receiptRepair_pa: "ਮੈਂ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਫਾਰਮ ਭਰ ਰਿਹਾ/ਰਹੀ ਹਾਂ।",
    receiptRepair_roman: "main library vich form bhar riha/rahi haan.",
    receiptRepair_en: "I am filling out the form in the library.",
    explanation_vi: "ਵਿੱਚ là marker vị trí bắt buộc trong câu này.",
    explanation_en: "ਵਿੱਚ is the required location marker in this sentence.",
    receiptCheck: "Confirm the pre-integration receipt preserves postpositions in location recovery.",
    commonTrap: "Dropping ਵਿੱਚ after thinking of the English preposition in.",
    rejectIf_vi: "Không chấp nhận nếu câu thiếu postposition Punjabi.",
    rejectIf_en: "Reject if the Punjabi postposition is missing.",
    canadaPractical: true,
  },
  {
    id: "receipt-agreement-bank-card",
    focus: "agreement",
    stage: "ledger",
    audience: "both",
    receiptId: "bank-card-agreement-receipt",
    sourceArtifactIds: ["ledger-agreement-bank-card", "archive-agreement-bank-card"],
    learnerPrompt_pa: "ਮੇਰਾ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।",
    learnerPrompt_roman: "mera card gumm giya hai.",
    learnerPrompt_en: "My card is lost.",
    receiptRepair_pa: "ਮੇਰਾ ਬੈਂਕ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।",
    receiptRepair_roman: "mera bank card gumm giya hai.",
    receiptRepair_en: "My bank card is lost.",
    explanation_vi: "Receipt giữ ਮੇਰਾ và ਗਿਆ đồng bộ với ਨਾਂਵ trong câu báo mất thẻ.",
    explanation_en: "The receipt keeps ਮੇਰਾ and ਗਿਆ aligned with the noun in the lost-card sentence.",
    receiptCheck: "Confirm the ledger receipt keeps gender and number agreement stable.",
    commonTrap: "Reusing one ending for every noun after memorizing the pattern.",
    rejectIf_vi: "Không chấp nhận nếu agreement đổi ngẫu nhiên khi thêm ਬੈਂਕ.",
    rejectIf_en: "Reject if agreement changes randomly after adding ਬੈਂਕ.",
    canadaPractical: true,
  },
  {
    id: "receipt-register-clinic",
    focus: "register-mismatch",
    stage: "pre-a11-receipt",
    audience: "both",
    receiptId: "clinic-polite-register-receipt",
    sourceArtifactIds: ["ledger-register-clinic", "archive-register-clinic"],
    learnerPrompt_pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨੂੰ ਮਿਲਣਾ ਹੈ।",
    learnerPrompt_roman: "mainu doctor nu milna hai.",
    learnerPrompt_en: "I need to see a doctor.",
    receiptRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਕੀ ਡਾਕਟਰ ਅੱਜ ਮਿਲ ਸਕਦੇ ਹਨ?",
    receiptRepair_roman: "kirpa karke dasso, ki doctor ajj mil sakde han?",
    receiptRepair_en: "Please tell me, can the doctor see me today?",
    explanation_vi: "Ở phòng khám, receipt giữ yêu cầu lịch sự và đủ câu.",
    explanation_en: "At a clinic, the receipt keeps the request polite and complete.",
    receiptCheck: "Confirm the pre-A11 receipt keeps service register polite without over-formality.",
    commonTrap: "Sounding abrupt at reception by using a clipped sentence.",
    rejectIf_vi: "Không chấp nhận nếu câu sửa thành mệnh lệnh trống.",
    rejectIf_en: "Reject if the repair becomes a bare command.",
    canadaPractical: true,
  },
  {
    id: "receipt-vietnamese-transfer-form",
    focus: "vietnamese-transfer",
    stage: "archive",
    audience: "vi",
    receiptId: "vi-transfer-form-help-receipt",
    sourceArtifactIds: ["ledger-vietnamese-transfer-form", "archive-vietnamese-transfer-form"],
    learnerPrompt_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    learnerPrompt_roman: "mainu ih form chahida hai.",
    learnerPrompt_en: "I need this form.",
    receiptRepair_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    receiptRepair_roman: "mainu ih form bharan vich madad chahidi hai.",
    receiptRepair_en: "I need help filling out this form.",
    explanation_vi: "Không dịch từng mảnh từ tiếng Việt; giữ ਇਹ, ਵਿੱਚ, và cụm Punjabi rõ.",
    explanation_en: "Do not translate Vietnamese chunks directly; keep clear Punjabi ਇਹ, ਵਿੱਚ, and phrase shape.",
    receiptCheck: "Confirm the archive receipt catches Vietnamese transfer in form-help requests.",
    commonTrap: "Building the Punjabi sentence from Vietnamese word chunks.",
    rejectIf_vi: "Không chấp nhận nếu marker Punjabi biến mất vì dịch từng mảnh.",
    rejectIf_en: "Reject if Punjabi markers disappear through chunk-by-chunk Vietnamese transfer.",
    canadaPractical: true,
  },
  {
    id: "receipt-english-transfer-phone",
    focus: "english-transfer",
    stage: "pre-integration",
    audience: "en",
    receiptId: "english-transfer-nu-phone-receipt",
    sourceArtifactIds: ["ledger-english-transfer-phone", "archive-english-transfer-phone"],
    learnerPrompt_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    learnerPrompt_roman: "ki tusi usnu phone kar sakde ho?",
    learnerPrompt_en: "Can you call him/her?",
    receiptRepair_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    receiptRepair_roman: "ki tusi usnu phone kar sakde ho?",
    receiptRepair_en: "Can you call him/her?",
    explanation_vi: "Punjabi cần ਨੂੰ cho người cụ thể, dù tiếng Anh không có marker tương ứng.",
    explanation_en: "Punjabi needs ਨੂੰ for a specific person even though English has no matching marker.",
    receiptCheck: "Confirm the pre-integration receipt catches English transfer around ਨੂੰ.",
    commonTrap: "Dropping ਨੂੰ because the English sentence has no visible equivalent.",
    rejectIf_vi: "Không chấp nhận nếu ਉਸਨੂੰ bị rút thành ਉਸ vì ảnh hưởng tiếng Anh.",
    rejectIf_en: "Reject if ਉਸਨੂੰ is reduced to ਉਸ through English transfer.",
    canadaPractical: true,
  },
  {
    id: "receipt-service-phrase-counter",
    focus: "service-phrase-gaps",
    stage: "ledger",
    audience: "both",
    receiptId: "full-service-counter-request-receipt",
    sourceArtifactIds: ["ledger-service-phrase-counter", "archive-service-phrase-counter"],
    learnerPrompt_pa: "ਮਦਦ?",
    learnerPrompt_roman: "madad?",
    learnerPrompt_en: "Help?",
    receiptRepair_pa: "ਮਾਫ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?",
    receiptRepair_roman: "maaf karna, ki tusi meri madad kar sakde ho?",
    receiptRepair_en: "Excuse me, can you help me?",
    explanation_vi: "Ở quầy dịch vụ, receipt giữ câu đầy đủ thay vì một từ rời.",
    explanation_en: "At a service counter, the receipt keeps a complete sentence instead of one loose word.",
    receiptCheck: "Confirm the ledger receipt includes complete service phrases.",
    commonTrap: "Using one emergency word for every routine service interaction.",
    rejectIf_vi: "Không chấp nhận nếu câu sửa vẫn chỉ là một từ.",
    rejectIf_en: "Reject if the repair is still only one word.",
    canadaPractical: true,
  },
  {
    id: "receipt-canada-practical-pharmacy",
    focus: "canada-practical-recovery",
    stage: "pre-a11-receipt",
    audience: "both",
    receiptId: "pharmacy-refill-recovery-receipt",
    sourceArtifactIds: ["ledger-canada-practical-pharmacy", "archive-canada-practical-pharmacy"],
    learnerPrompt_pa: "ਮੇਰੀ ਦਵਾਈ ਮੁੱਕ ਗਈ ਹੈ।",
    learnerPrompt_roman: "meri davai mukk gai hai.",
    learnerPrompt_en: "My medicine has run out.",
    receiptRepair_pa: "ਕੀ ਮੈਂ ਫਾਰਮੇਸੀ ਵਿੱਚ ਆਪਣੀ ਦਵਾਈ ਦੁਬਾਰਾ ਲੈ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    receiptRepair_roman: "ki main pharmacy vich apni davai dubara lai sakda/sakdi haan?",
    receiptRepair_en: "Can I get my medicine again at the pharmacy?",
    explanation_vi: "Tình huống Canada thực tế: receipt giữ câu lịch sự, postposition, và agreement.",
    explanation_en: "Canada-practical recovery: the receipt keeps the polite question, postposition, and agreement.",
    receiptCheck: "Confirm the pre-A11 receipt is stable for pharmacy recovery before later integration.",
    commonTrap: "Using English order and dropping ਵਿੱਚ in a pharmacy request.",
    rejectIf_vi: "Không chấp nhận nếu câu chỉ là ghi chú tiếng Anh dịch rời rạc.",
    rejectIf_en: "Reject if the sentence is only a loose translation of an English note.",
    canadaPractical: true,
  },
];

export function punjabiRemediationReceiptSamplesByFocus(
  focus: PunjabiRemediationReceiptFocus,
): PunjabiRemediationReceiptSample[] {
  return punjabiRemediationReceiptSamples.filter((sample) => sample.focus === focus);
}

export function punjabiRemediationReceiptSamplesByStage(
  stage: PunjabiRemediationReceiptStage,
): PunjabiRemediationReceiptSample[] {
  return punjabiRemediationReceiptSamples.filter((sample) => sample.stage === stage);
}

export function punjabiRemediationReceiptSamplesByAudience(
  audience: PunjabiRemediationReceiptSample["audience"],
): PunjabiRemediationReceiptSample[] {
  return punjabiRemediationReceiptSamples.filter((sample) => sample.audience === audience);
}
