// Punjabi remediation ledger samples for Wave 55. Gurmukhi is primary;
// romanization is support only. These items are study support only, not
// official placement or certification. Native review is deferred. Shahmukhi is
// awareness only, not a full course. This is not A11 integration.

export type PunjabiRemediationLedgerFocus =
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

export type PunjabiRemediationLedgerStage =
  | "pre-a11-ledger"
  | "archive"
  | "signoff"
  | "pre-integration";

export interface PunjabiRemediationLedgerSample {
  id: string;
  focus: PunjabiRemediationLedgerFocus;
  stage: PunjabiRemediationLedgerStage;
  audience: "vi" | "en" | "both";
  ledgerId: string;
  sourceArtifactIds: string[];
  learnerPrompt_pa: string;
  learnerPrompt_roman?: string;
  learnerPrompt_en: string;
  ledgerRepair_pa: string;
  ledgerRepair_roman?: string;
  ledgerRepair_en: string;
  explanation_vi: string;
  explanation_en: string;
  ledgerCheck: string;
  commonTrap: string;
  rejectIf_vi: string;
  rejectIf_en: string;
  canadaPractical?: boolean;
}

export const PUNJABI_REMEDIATION_LEDGER_NOTICE =
  "Wave 55 remediation ledger samples only; not A11 integration. Study support only, not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_REMEDIATION_LEDGER_FOCI: readonly PunjabiRemediationLedgerFocus[] = [
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

export const PUNJABI_REMEDIATION_LEDGER_STAGES: readonly PunjabiRemediationLedgerStage[] = [
  "pre-a11-ledger",
  "archive",
  "signoff",
  "pre-integration",
] as const;

export const punjabiRemediationLedgerSamples: PunjabiRemediationLedgerSample[] = [
  {
    id: "ledger-script-bus-stop",
    focus: "script-confusion",
    stage: "pre-a11-ledger",
    audience: "both",
    ledgerId: "script-bus-stop-gurmukhi-ledger",
    sourceArtifactIds: ["archive-script-bus-stop", "signoff-script-bus-stop"],
    learnerPrompt_pa: "ਬੱਸ ਅੱਡਾ",
    learnerPrompt_roman: "bas adda",
    learnerPrompt_en: "bus stop",
    ledgerRepair_pa: "ਬੱਸ ਅੱਡਾ ਸੜਕ ਦੇ ਸਾਹਮਣੇ ਹੈ।",
    ledgerRepair_roman: "bas adda sarak de sahmane hai.",
    ledgerRepair_en: "The bus stop is across the street.",
    explanation_vi: "Ledger giữ cụm Gurmukhi chính; romanization chỉ hỗ trợ âm.",
    explanation_en: "The ledger keeps the Gurmukhi phrase primary; romanization only supports sound.",
    ledgerCheck: "Confirm the pre-A11 ledger preserves the full transit phrase in Gurmukhi.",
    commonTrap: "Guessing bus from context while skipping the Gurmukhi contrast.",
    rejectIf_vi: "Không chấp nhận nếu người học vẫn lẫn ਬ với ਪ.",
    rejectIf_en: "Reject if the learner still confuses ਬ with ਪ.",
    canadaPractical: true,
  },
  {
    id: "ledger-romanization-boundary",
    focus: "romanization-dependence",
    stage: "archive",
    audience: "both",
    ledgerId: "romanization-support-only-ledger",
    sourceArtifactIds: ["archive-romanization-boundary", "signoff-romanization-boundary"],
    learnerPrompt_pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਹਰਾਓ।",
    learnerPrompt_roman: "kirpa karke hauli duhrao.",
    learnerPrompt_en: "Please repeat slowly.",
    ledgerRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਹੌਲੀ ਕਹੋ।",
    ledgerRepair_roman: "kirpa karke dubara hauli kaho.",
    ledgerRepair_en: "Please say it again slowly.",
    explanation_vi: "Ledger xác nhận Gurmukhi là dòng đọc chính, không phải romanization.",
    explanation_en: "The ledger confirms Gurmukhi is the reading line, not romanization.",
    ledgerCheck: "Confirm the archive ledger keeps romanization as support only.",
    commonTrap: "Memorizing Latin spelling and losing the Gurmukhi sentence.",
    rejectIf_vi: "Không chấp nhận nếu romanization trở thành nội dung chính.",
    rejectIf_en: "Reject if romanization becomes the primary content.",
    canadaPractical: true,
  },
  {
    id: "ledger-shahmukhi-awareness",
    focus: "romanization-dependence",
    stage: "pre-integration",
    audience: "en",
    ledgerId: "shahmukhi-awareness-boundary-ledger",
    sourceArtifactIds: ["archive-shahmukhi-awareness", "signoff-shahmukhi-awareness"],
    learnerPrompt_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਵਰਤਦੇ ਹਾਂ।",
    learnerPrompt_roman: "asi gurmukhi vartde haan.",
    learnerPrompt_en: "We use Gurmukhi.",
    ledgerRepair_pa: "ਇਹ ਗੁਰਮੁਖੀ ਅਭਿਆਸ ਹੈ।",
    ledgerRepair_roman: "ih gurmukhi abhyas hai.",
    ledgerRepair_en: "This is Gurmukhi practice.",
    explanation_vi: "Shahmukhi chỉ là nhận biết hệ chữ khác, không phải khóa học đầy đủ.",
    explanation_en: "Shahmukhi is only awareness of another script, not a full course.",
    ledgerCheck: "Confirm the pre-integration ledger keeps Shahmukhi bounded to awareness.",
    commonTrap: "Expanding an awareness note into a separate Shahmukhi path.",
    rejectIf_vi: "Không chấp nhận nếu mục này mở thành giáo trình Shahmukhi.",
    rejectIf_en: "Reject if this item opens into a Shahmukhi syllabus.",
  },
  {
    id: "ledger-word-order-appointment",
    focus: "word-order",
    stage: "signoff",
    audience: "both",
    ledgerId: "appointment-time-order-ledger",
    sourceArtifactIds: ["archive-word-order-appointment", "signoff-word-order-appointment"],
    learnerPrompt_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    learnerPrompt_roman: "meri appointment kede vele hai?",
    learnerPrompt_en: "What time is my appointment?",
    ledgerRepair_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    ledgerRepair_roman: "meri appointment kede vele hai?",
    ledgerRepair_en: "What time is my appointment?",
    explanation_vi: "Ledger giữ trật tự Punjabi tự nhiên khi hỏi giờ hẹn.",
    explanation_en: "The ledger keeps natural Punjabi order when asking appointment time.",
    ledgerCheck: "Confirm the signoff ledger catches English-style question reordering.",
    commonTrap: "Moving the question words to copy English.",
    rejectIf_vi: "Không chấp nhận nếu câu hỏi sao chép trật tự tiếng Anh.",
    rejectIf_en: "Reject if the question copies English word order.",
    canadaPractical: true,
  },
  {
    id: "ledger-postposition-library",
    focus: "postpositions",
    stage: "pre-integration",
    audience: "en",
    ledgerId: "library-vich-postposition-ledger",
    sourceArtifactIds: ["archive-postposition-library", "signoff-postposition-library"],
    learnerPrompt_pa: "ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ",
    learnerPrompt_roman: "library vich",
    learnerPrompt_en: "in the library",
    ledgerRepair_pa: "ਮੈਂ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਫਾਰਮ ਭਰ ਰਿਹਾ/ਰਹੀ ਹਾਂ।",
    ledgerRepair_roman: "main library vich form bhar riha/rahi haan.",
    ledgerRepair_en: "I am filling out the form in the library.",
    explanation_vi: "ਵਿੱਚ là marker vị trí bắt buộc trong câu này.",
    explanation_en: "ਵਿੱਚ is the required location marker in this sentence.",
    ledgerCheck: "Confirm the pre-integration ledger preserves postpositions in location recovery.",
    commonTrap: "Dropping ਵਿੱਚ after thinking of the English preposition in.",
    rejectIf_vi: "Không chấp nhận nếu câu thiếu postposition Punjabi.",
    rejectIf_en: "Reject if the Punjabi postposition is missing.",
    canadaPractical: true,
  },
  {
    id: "ledger-agreement-bank-card",
    focus: "agreement",
    stage: "archive",
    audience: "both",
    ledgerId: "bank-card-agreement-ledger",
    sourceArtifactIds: ["archive-agreement-bank-card", "signoff-agreement-bank-card"],
    learnerPrompt_pa: "ਮੇਰਾ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।",
    learnerPrompt_roman: "mera card gumm giya hai.",
    learnerPrompt_en: "My card is lost.",
    ledgerRepair_pa: "ਮੇਰਾ ਬੈਂਕ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।",
    ledgerRepair_roman: "mera bank card gumm giya hai.",
    ledgerRepair_en: "My bank card is lost.",
    explanation_vi: "Ledger giữ ਮੇਰਾ và ਗਿਆ đồng bộ với ਨਾਂਵ trong câu báo mất thẻ.",
    explanation_en: "The ledger keeps ਮੇਰਾ and ਗਿਆ aligned with the noun in the lost-card sentence.",
    ledgerCheck: "Confirm the archive ledger keeps gender and number agreement stable.",
    commonTrap: "Reusing one ending for every noun after memorizing the pattern.",
    rejectIf_vi: "Không chấp nhận nếu agreement đổi ngẫu nhiên khi thêm ਬੈਂਕ.",
    rejectIf_en: "Reject if agreement changes randomly after adding ਬੈਂਕ.",
    canadaPractical: true,
  },
  {
    id: "ledger-register-clinic",
    focus: "register-mismatch",
    stage: "pre-a11-ledger",
    audience: "both",
    ledgerId: "clinic-polite-register-ledger",
    sourceArtifactIds: ["archive-register-clinic", "signoff-register-clinic"],
    learnerPrompt_pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨੂੰ ਮਿਲਣਾ ਹੈ।",
    learnerPrompt_roman: "mainu doctor nu milna hai.",
    learnerPrompt_en: "I need to see a doctor.",
    ledgerRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਕੀ ਡਾਕਟਰ ਅੱਜ ਮਿਲ ਸਕਦੇ ਹਨ?",
    ledgerRepair_roman: "kirpa karke dasso, ki doctor ajj mil sakde han?",
    ledgerRepair_en: "Please tell me, can the doctor see me today?",
    explanation_vi: "Ở phòng khám, ledger giữ yêu cầu lịch sự và đủ câu.",
    explanation_en: "At a clinic, the ledger keeps the request polite and complete.",
    ledgerCheck: "Confirm the pre-A11 ledger keeps service register polite without over-formality.",
    commonTrap: "Sounding abrupt at reception by using a clipped sentence.",
    rejectIf_vi: "Không chấp nhận nếu câu sửa thành mệnh lệnh trống.",
    rejectIf_en: "Reject if the repair becomes a bare command.",
    canadaPractical: true,
  },
  {
    id: "ledger-vietnamese-transfer-form",
    focus: "vietnamese-transfer",
    stage: "signoff",
    audience: "vi",
    ledgerId: "vi-transfer-form-help-ledger",
    sourceArtifactIds: ["archive-vietnamese-transfer-form", "signoff-vietnamese-transfer-form"],
    learnerPrompt_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    learnerPrompt_roman: "mainu ih form chahida hai.",
    learnerPrompt_en: "I need this form.",
    ledgerRepair_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    ledgerRepair_roman: "mainu ih form bharan vich madad chahidi hai.",
    ledgerRepair_en: "I need help filling out this form.",
    explanation_vi: "Không dịch từng mảnh từ tiếng Việt; giữ ਇਹ, ਵਿੱਚ, và cụm Punjabi rõ.",
    explanation_en: "Do not translate Vietnamese chunks directly; keep clear Punjabi ਇਹ, ਵਿੱਚ, and phrase shape.",
    ledgerCheck: "Confirm the signoff ledger catches Vietnamese transfer in form-help requests.",
    commonTrap: "Building the Punjabi sentence from Vietnamese word chunks.",
    rejectIf_vi: "Không chấp nhận nếu marker Punjabi biến mất vì dịch từng mảnh.",
    rejectIf_en: "Reject if Punjabi markers disappear through chunk-by-chunk Vietnamese transfer.",
    canadaPractical: true,
  },
  {
    id: "ledger-english-transfer-phone",
    focus: "english-transfer",
    stage: "pre-integration",
    audience: "en",
    ledgerId: "english-transfer-nu-phone-ledger",
    sourceArtifactIds: ["archive-english-transfer-phone", "signoff-english-transfer-phone"],
    learnerPrompt_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    learnerPrompt_roman: "ki tusi usnu phone kar sakde ho?",
    learnerPrompt_en: "Can you call him/her?",
    ledgerRepair_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    ledgerRepair_roman: "ki tusi usnu phone kar sakde ho?",
    ledgerRepair_en: "Can you call him/her?",
    explanation_vi: "Punjabi cần ਨੂੰ cho người cụ thể, dù tiếng Anh không có marker tương ứng.",
    explanation_en: "Punjabi needs ਨੂੰ for a specific person even though English has no matching marker.",
    ledgerCheck: "Confirm the pre-integration ledger catches English transfer around ਨੂੰ.",
    commonTrap: "Dropping ਨੂੰ because the English sentence has no visible equivalent.",
    rejectIf_vi: "Không chấp nhận nếu ਉਸਨੂੰ bị rút thành ਉਸ vì ảnh hưởng tiếng Anh.",
    rejectIf_en: "Reject if ਉਸਨੂੰ is reduced to ਉਸ through English transfer.",
    canadaPractical: true,
  },
  {
    id: "ledger-service-phrase-counter",
    focus: "service-phrase-gaps",
    stage: "archive",
    audience: "both",
    ledgerId: "full-service-counter-request-ledger",
    sourceArtifactIds: ["archive-service-phrase-counter", "signoff-service-phrase-counter"],
    learnerPrompt_pa: "ਮਦਦ?",
    learnerPrompt_roman: "madad?",
    learnerPrompt_en: "Help?",
    ledgerRepair_pa: "ਮਾਫ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?",
    ledgerRepair_roman: "maaf karna, ki tusi meri madad kar sakde ho?",
    ledgerRepair_en: "Excuse me, can you help me?",
    explanation_vi: "Ở quầy dịch vụ, ledger giữ câu đầy đủ thay vì một từ rời.",
    explanation_en: "At a service counter, the ledger keeps a complete sentence instead of one loose word.",
    ledgerCheck: "Confirm the archive ledger includes complete service phrases.",
    commonTrap: "Using one emergency word for every routine service interaction.",
    rejectIf_vi: "Không chấp nhận nếu câu sửa vẫn chỉ là một từ.",
    rejectIf_en: "Reject if the repair is still only one word.",
    canadaPractical: true,
  },
  {
    id: "ledger-canada-practical-pharmacy",
    focus: "canada-practical-recovery",
    stage: "pre-a11-ledger",
    audience: "both",
    ledgerId: "pharmacy-refill-recovery-ledger",
    sourceArtifactIds: ["archive-canada-practical-pharmacy", "signoff-canada-practical-pharmacy"],
    learnerPrompt_pa: "ਮੇਰੀ ਦਵਾਈ ਮੁੱਕ ਗਈ ਹੈ।",
    learnerPrompt_roman: "meri davai mukk gai hai.",
    learnerPrompt_en: "My medicine has run out.",
    ledgerRepair_pa: "ਕੀ ਮੈਂ ਫਾਰਮੇਸੀ ਵਿੱਚ ਆਪਣੀ ਦਵਾਈ ਦੁਬਾਰਾ ਲੈ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    ledgerRepair_roman: "ki main pharmacy vich apni davai dubara lai sakda/sakdi haan?",
    ledgerRepair_en: "Can I get my medicine again at the pharmacy?",
    explanation_vi: "Tình huống Canada thực tế: ledger giữ câu lịch sự, postposition, và agreement.",
    explanation_en: "Canada-practical recovery: the ledger keeps the polite question, postposition, and agreement.",
    ledgerCheck: "Confirm the pre-A11 ledger is stable for pharmacy recovery before later integration.",
    commonTrap: "Using English order and dropping ਵਿੱਚ in a pharmacy request.",
    rejectIf_vi: "Không chấp nhận nếu câu chỉ là ghi chú tiếng Anh dịch rời rạc.",
    rejectIf_en: "Reject if the sentence is only a loose translation of an English note.",
    canadaPractical: true,
  },
];

export function punjabiRemediationLedgerSamplesByFocus(
  focus: PunjabiRemediationLedgerFocus,
): PunjabiRemediationLedgerSample[] {
  return punjabiRemediationLedgerSamples.filter((sample) => sample.focus === focus);
}

export function punjabiRemediationLedgerSamplesByStage(
  stage: PunjabiRemediationLedgerStage,
): PunjabiRemediationLedgerSample[] {
  return punjabiRemediationLedgerSamples.filter((sample) => sample.stage === stage);
}

export function punjabiRemediationLedgerSamplesByAudience(
  audience: PunjabiRemediationLedgerSample["audience"],
): PunjabiRemediationLedgerSample[] {
  return punjabiRemediationLedgerSamples.filter((sample) => sample.audience === audience);
}
