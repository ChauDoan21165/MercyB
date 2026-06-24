// Punjabi remediation archive samples for Wave 54. Gurmukhi is primary;
// romanization is support only. These items are study support only, not
// official placement or certification. Native review is deferred. Shahmukhi is
// awareness only, not a full course. This is not A11 integration.

export type PunjabiRemediationArchiveFocus =
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

export type PunjabiRemediationArchiveStage =
  | "pre-a11-archive"
  | "signoff"
  | "seal"
  | "pre-integration";

export interface PunjabiRemediationArchiveSample {
  id: string;
  focus: PunjabiRemediationArchiveFocus;
  stage: PunjabiRemediationArchiveStage;
  audience: "vi" | "en" | "both";
  archiveId: string;
  sourceArtifactIds: string[];
  learnerPrompt_pa: string;
  learnerPrompt_roman?: string;
  learnerPrompt_en: string;
  archivedRepair_pa: string;
  archivedRepair_roman?: string;
  archivedRepair_en: string;
  explanation_vi: string;
  explanation_en: string;
  archiveCheck: string;
  commonTrap: string;
  rejectIf_vi: string;
  rejectIf_en: string;
  canadaPractical?: boolean;
}

export const PUNJABI_REMEDIATION_ARCHIVE_NOTICE =
  "Wave 54 remediation archive samples only; not A11 integration. Study support only, not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_REMEDIATION_ARCHIVE_FOCI: readonly PunjabiRemediationArchiveFocus[] = [
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

export const PUNJABI_REMEDIATION_ARCHIVE_STAGES: readonly PunjabiRemediationArchiveStage[] = [
  "pre-a11-archive",
  "signoff",
  "seal",
  "pre-integration",
] as const;

export const punjabiRemediationArchiveSamples: PunjabiRemediationArchiveSample[] = [
  {
    id: "archive-script-bus-stop",
    focus: "script-confusion",
    stage: "pre-a11-archive",
    audience: "both",
    archiveId: "script-bus-stop-gurmukhi-archive",
    sourceArtifactIds: ["signoff-script-bus-stop", "seal-script-bus-stop"],
    learnerPrompt_pa: "ਬੱਸ ਅੱਡਾ",
    learnerPrompt_roman: "bas adda",
    learnerPrompt_en: "bus stop",
    archivedRepair_pa: "ਬੱਸ ਅੱਡਾ ਸੜਕ ਦੇ ਸਾਹਮਣੇ ਹੈ।",
    archivedRepair_roman: "bas adda sarak de sahmane hai.",
    archivedRepair_en: "The bus stop is across the street.",
    explanation_vi: "Archive giữ cụm Gurmukhi chính; romanization chỉ hỗ trợ âm.",
    explanation_en: "The archive keeps the Gurmukhi phrase primary; romanization only supports sound.",
    archiveCheck: "Confirm the pre-A11 archive preserves the full transit phrase in Gurmukhi.",
    commonTrap: "Guessing bus from context while skipping the Gurmukhi contrast.",
    rejectIf_vi: "Không chấp nhận nếu người học vẫn lẫn ਬ với ਪ.",
    rejectIf_en: "Reject if the learner still confuses ਬ with ਪ.",
    canadaPractical: true,
  },
  {
    id: "archive-romanization-boundary",
    focus: "romanization-dependence",
    stage: "signoff",
    audience: "both",
    archiveId: "romanization-support-only-archive",
    sourceArtifactIds: ["signoff-romanization-boundary", "seal-romanization-boundary"],
    learnerPrompt_pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਹਰਾਓ।",
    learnerPrompt_roman: "kirpa karke hauli duhrao.",
    learnerPrompt_en: "Please repeat slowly.",
    archivedRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਹੌਲੀ ਕਹੋ।",
    archivedRepair_roman: "kirpa karke dubara hauli kaho.",
    archivedRepair_en: "Please say it again slowly.",
    explanation_vi: "Archive xác nhận Gurmukhi là dòng đọc chính, không phải romanization.",
    explanation_en: "The archive confirms Gurmukhi is the reading line, not romanization.",
    archiveCheck: "Confirm the signoff archive keeps romanization as support only.",
    commonTrap: "Memorizing Latin spelling and losing the Gurmukhi sentence.",
    rejectIf_vi: "Không chấp nhận nếu romanization trở thành nội dung chính.",
    rejectIf_en: "Reject if romanization becomes the primary content.",
    canadaPractical: true,
  },
  {
    id: "archive-shahmukhi-awareness",
    focus: "romanization-dependence",
    stage: "pre-integration",
    audience: "en",
    archiveId: "shahmukhi-awareness-boundary-archive",
    sourceArtifactIds: ["signoff-shahmukhi-awareness", "seal-shahmukhi-awareness"],
    learnerPrompt_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਵਰਤਦੇ ਹਾਂ।",
    learnerPrompt_roman: "asi gurmukhi vartde haan.",
    learnerPrompt_en: "We use Gurmukhi.",
    archivedRepair_pa: "ਇਹ ਗੁਰਮੁਖੀ ਅਭਿਆਸ ਹੈ।",
    archivedRepair_roman: "ih gurmukhi abhyas hai.",
    archivedRepair_en: "This is Gurmukhi practice.",
    explanation_vi: "Shahmukhi chỉ là nhận biết hệ chữ khác, không phải khóa học đầy đủ.",
    explanation_en: "Shahmukhi is only awareness of another script, not a full course.",
    archiveCheck: "Confirm the pre-integration archive keeps Shahmukhi bounded to awareness.",
    commonTrap: "Expanding an awareness note into a separate Shahmukhi path.",
    rejectIf_vi: "Không chấp nhận nếu mục này mở thành giáo trình Shahmukhi.",
    rejectIf_en: "Reject if this item opens into a Shahmukhi syllabus.",
  },
  {
    id: "archive-word-order-appointment",
    focus: "word-order",
    stage: "seal",
    audience: "both",
    archiveId: "appointment-time-order-archive",
    sourceArtifactIds: ["signoff-word-order-appointment", "seal-word-order-appointment"],
    learnerPrompt_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    learnerPrompt_roman: "meri appointment kede vele hai?",
    learnerPrompt_en: "What time is my appointment?",
    archivedRepair_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    archivedRepair_roman: "meri appointment kede vele hai?",
    archivedRepair_en: "What time is my appointment?",
    explanation_vi: "Archive giữ trật tự Punjabi tự nhiên khi hỏi giờ hẹn.",
    explanation_en: "The archive keeps natural Punjabi order when asking appointment time.",
    archiveCheck: "Confirm the seal archive catches English-style question reordering.",
    commonTrap: "Moving the question words to copy English.",
    rejectIf_vi: "Không chấp nhận nếu câu hỏi sao chép trật tự tiếng Anh.",
    rejectIf_en: "Reject if the question copies English word order.",
    canadaPractical: true,
  },
  {
    id: "archive-postposition-library",
    focus: "postpositions",
    stage: "pre-integration",
    audience: "en",
    archiveId: "library-vich-postposition-archive",
    sourceArtifactIds: ["signoff-postposition-library", "seal-postposition-library"],
    learnerPrompt_pa: "ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ",
    learnerPrompt_roman: "library vich",
    learnerPrompt_en: "in the library",
    archivedRepair_pa: "ਮੈਂ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਫਾਰਮ ਭਰ ਰਿਹਾ/ਰਹੀ ਹਾਂ।",
    archivedRepair_roman: "main library vich form bhar riha/rahi haan.",
    archivedRepair_en: "I am filling out the form in the library.",
    explanation_vi: "ਵਿੱਚ là marker vị trí bắt buộc trong câu này.",
    explanation_en: "ਵਿੱਚ is the required location marker in this sentence.",
    archiveCheck: "Confirm the pre-integration archive preserves postpositions in location recovery.",
    commonTrap: "Dropping ਵਿੱਚ after thinking of the English preposition in.",
    rejectIf_vi: "Không chấp nhận nếu câu thiếu postposition Punjabi.",
    rejectIf_en: "Reject if the Punjabi postposition is missing.",
    canadaPractical: true,
  },
  {
    id: "archive-agreement-bank-card",
    focus: "agreement",
    stage: "signoff",
    audience: "both",
    archiveId: "bank-card-agreement-archive",
    sourceArtifactIds: ["signoff-agreement-bank-card", "seal-agreement-bank-card"],
    learnerPrompt_pa: "ਮੇਰਾ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।",
    learnerPrompt_roman: "mera card gumm giya hai.",
    learnerPrompt_en: "My card is lost.",
    archivedRepair_pa: "ਮੇਰਾ ਬੈਂਕ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।",
    archivedRepair_roman: "mera bank card gumm giya hai.",
    archivedRepair_en: "My bank card is lost.",
    explanation_vi: "Archive giữ ਮੇਰਾ và ਗਿਆ đồng bộ với ਨਾਂਵ trong câu báo mất thẻ.",
    explanation_en: "The archive keeps ਮੇਰਾ and ਗਿਆ aligned with the noun in the lost-card sentence.",
    archiveCheck: "Confirm the signoff archive keeps gender and number agreement stable.",
    commonTrap: "Reusing one ending for every noun after memorizing the pattern.",
    rejectIf_vi: "Không chấp nhận nếu agreement đổi ngẫu nhiên khi thêm ਬੈਂਕ.",
    rejectIf_en: "Reject if agreement changes randomly after adding ਬੈਂਕ.",
    canadaPractical: true,
  },
  {
    id: "archive-register-clinic",
    focus: "register-mismatch",
    stage: "pre-a11-archive",
    audience: "both",
    archiveId: "clinic-polite-register-archive",
    sourceArtifactIds: ["signoff-register-clinic", "seal-register-clinic"],
    learnerPrompt_pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨੂੰ ਮਿਲਣਾ ਹੈ।",
    learnerPrompt_roman: "mainu doctor nu milna hai.",
    learnerPrompt_en: "I need to see a doctor.",
    archivedRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਕੀ ਡਾਕਟਰ ਅੱਜ ਮਿਲ ਸਕਦੇ ਹਨ?",
    archivedRepair_roman: "kirpa karke dasso, ki doctor ajj mil sakde han?",
    archivedRepair_en: "Please tell me, can the doctor see me today?",
    explanation_vi: "Ở phòng khám, archive giữ yêu cầu lịch sự và đủ câu.",
    explanation_en: "At a clinic, the archive keeps the request polite and complete.",
    archiveCheck: "Confirm the pre-A11 archive keeps service register polite without over-formality.",
    commonTrap: "Sounding abrupt at reception by using a clipped sentence.",
    rejectIf_vi: "Không chấp nhận nếu câu sửa thành mệnh lệnh trống.",
    rejectIf_en: "Reject if the repair becomes a bare command.",
    canadaPractical: true,
  },
  {
    id: "archive-vietnamese-transfer-form",
    focus: "vietnamese-transfer",
    stage: "seal",
    audience: "vi",
    archiveId: "vi-transfer-form-help-archive",
    sourceArtifactIds: ["signoff-vietnamese-transfer-form", "seal-vietnamese-transfer-form"],
    learnerPrompt_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    learnerPrompt_roman: "mainu ih form chahida hai.",
    learnerPrompt_en: "I need this form.",
    archivedRepair_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    archivedRepair_roman: "mainu ih form bharan vich madad chahidi hai.",
    archivedRepair_en: "I need help filling out this form.",
    explanation_vi: "Không dịch từng mảnh từ tiếng Việt; giữ ਇਹ, ਵਿੱਚ, và cụm Punjabi rõ.",
    explanation_en: "Do not translate Vietnamese chunks directly; keep clear Punjabi ਇਹ, ਵਿੱਚ, and phrase shape.",
    archiveCheck: "Confirm the seal archive catches Vietnamese transfer in form-help requests.",
    commonTrap: "Building the Punjabi sentence from Vietnamese word chunks.",
    rejectIf_vi: "Không chấp nhận nếu marker Punjabi biến mất vì dịch từng mảnh.",
    rejectIf_en: "Reject if Punjabi markers disappear through chunk-by-chunk Vietnamese transfer.",
    canadaPractical: true,
  },
  {
    id: "archive-english-transfer-phone",
    focus: "english-transfer",
    stage: "pre-integration",
    audience: "en",
    archiveId: "english-transfer-nu-phone-archive",
    sourceArtifactIds: ["signoff-english-transfer-phone", "seal-english-transfer-phone"],
    learnerPrompt_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    learnerPrompt_roman: "ki tusi usnu phone kar sakde ho?",
    learnerPrompt_en: "Can you call him/her?",
    archivedRepair_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    archivedRepair_roman: "ki tusi usnu phone kar sakde ho?",
    archivedRepair_en: "Can you call him/her?",
    explanation_vi: "Punjabi cần ਨੂੰ cho người cụ thể, dù tiếng Anh không có marker tương ứng.",
    explanation_en: "Punjabi needs ਨੂੰ for a specific person even though English has no matching marker.",
    archiveCheck: "Confirm the pre-integration archive catches English transfer around ਨੂੰ.",
    commonTrap: "Dropping ਨੂੰ because the English sentence has no visible equivalent.",
    rejectIf_vi: "Không chấp nhận nếu ਉਸਨੂੰ bị rút thành ਉਸ vì ảnh hưởng tiếng Anh.",
    rejectIf_en: "Reject if ਉਸਨੂੰ is reduced to ਉਸ through English transfer.",
    canadaPractical: true,
  },
  {
    id: "archive-service-phrase-counter",
    focus: "service-phrase-gaps",
    stage: "signoff",
    audience: "both",
    archiveId: "full-service-counter-request-archive",
    sourceArtifactIds: ["signoff-service-phrase-counter", "seal-service-phrase-counter"],
    learnerPrompt_pa: "ਮਦਦ?",
    learnerPrompt_roman: "madad?",
    learnerPrompt_en: "Help?",
    archivedRepair_pa: "ਮਾਫ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?",
    archivedRepair_roman: "maaf karna, ki tusi meri madad kar sakde ho?",
    archivedRepair_en: "Excuse me, can you help me?",
    explanation_vi: "Ở quầy dịch vụ, archive giữ câu đầy đủ thay vì một từ rời.",
    explanation_en: "At a service counter, the archive keeps a complete sentence instead of one loose word.",
    archiveCheck: "Confirm the signoff archive includes complete service phrases.",
    commonTrap: "Using one emergency word for every routine service interaction.",
    rejectIf_vi: "Không chấp nhận nếu câu sửa vẫn chỉ là một từ.",
    rejectIf_en: "Reject if the repair is still only one word.",
    canadaPractical: true,
  },
  {
    id: "archive-canada-practical-pharmacy",
    focus: "canada-practical-recovery",
    stage: "pre-a11-archive",
    audience: "both",
    archiveId: "pharmacy-refill-recovery-archive",
    sourceArtifactIds: ["signoff-canada-practical-pharmacy", "seal-canada-practical-pharmacy"],
    learnerPrompt_pa: "ਮੇਰੀ ਦਵਾਈ ਮੁੱਕ ਗਈ ਹੈ।",
    learnerPrompt_roman: "meri davai mukk gai hai.",
    learnerPrompt_en: "My medicine has run out.",
    archivedRepair_pa: "ਕੀ ਮੈਂ ਫਾਰਮੇਸੀ ਵਿੱਚ ਆਪਣੀ ਦਵਾਈ ਦੁਬਾਰਾ ਲੈ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    archivedRepair_roman: "ki main pharmacy vich apni davai dubara lai sakda/sakdi haan?",
    archivedRepair_en: "Can I get my medicine again at the pharmacy?",
    explanation_vi: "Tình huống Canada thực tế: archive giữ câu lịch sự, postposition, và agreement.",
    explanation_en: "Canada-practical recovery: the archive keeps the polite question, postposition, and agreement.",
    archiveCheck: "Confirm the pre-A11 archive is stable for pharmacy recovery before later integration.",
    commonTrap: "Using English order and dropping ਵਿੱਚ in a pharmacy request.",
    rejectIf_vi: "Không chấp nhận nếu câu chỉ là ghi chú tiếng Anh dịch rời rạc.",
    rejectIf_en: "Reject if the sentence is only a loose translation of an English note.",
    canadaPractical: true,
  },
];

export function punjabiRemediationArchiveSamplesByFocus(
  focus: PunjabiRemediationArchiveFocus,
): PunjabiRemediationArchiveSample[] {
  return punjabiRemediationArchiveSamples.filter((sample) => sample.focus === focus);
}

export function punjabiRemediationArchiveSamplesByStage(
  stage: PunjabiRemediationArchiveStage,
): PunjabiRemediationArchiveSample[] {
  return punjabiRemediationArchiveSamples.filter((sample) => sample.stage === stage);
}

export function punjabiRemediationArchiveSamplesByAudience(
  audience: PunjabiRemediationArchiveSample["audience"],
): PunjabiRemediationArchiveSample[] {
  return punjabiRemediationArchiveSamples.filter((sample) => sample.audience === audience);
}
