// Punjabi remediation signoff samples for Wave 53. Gurmukhi is primary;
// romanization is support only. These items are study support only, not
// official placement or certification. Native review is deferred. Shahmukhi is
// awareness only, not a full course. This is not A11 integration.

export type PunjabiRemediationSignoffFocus =
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

export type PunjabiRemediationSignoffStage =
  | "pre-a11-signoff"
  | "seal"
  | "snapshot"
  | "pre-integration";

export interface PunjabiRemediationSignoffSample {
  id: string;
  focus: PunjabiRemediationSignoffFocus;
  stage: PunjabiRemediationSignoffStage;
  audience: "vi" | "en" | "both";
  signoffId: string;
  sourceArtifactIds: string[];
  learnerPrompt_pa: string;
  learnerPrompt_roman?: string;
  learnerPrompt_en: string;
  signedRepair_pa: string;
  signedRepair_roman?: string;
  signedRepair_en: string;
  explanation_vi: string;
  explanation_en: string;
  signoffCheck: string;
  commonTrap: string;
  rejectIf_vi: string;
  rejectIf_en: string;
  canadaPractical?: boolean;
}

export const PUNJABI_REMEDIATION_SIGNOFF_NOTICE =
  "Wave 53 remediation signoff samples only; not A11 integration. Study support only, not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_REMEDIATION_SIGNOFF_FOCI: readonly PunjabiRemediationSignoffFocus[] = [
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

export const PUNJABI_REMEDIATION_SIGNOFF_STAGES: readonly PunjabiRemediationSignoffStage[] = [
  "pre-a11-signoff",
  "seal",
  "snapshot",
  "pre-integration",
] as const;

export const punjabiRemediationSignoffSamples: PunjabiRemediationSignoffSample[] = [
  {
    id: "signoff-script-bus-stop",
    focus: "script-confusion",
    stage: "pre-a11-signoff",
    audience: "both",
    signoffId: "script-bus-stop-gurmukhi-signoff",
    sourceArtifactIds: ["seal-script-bus-stop", "snapshot-script-bus-stop"],
    learnerPrompt_pa: "ਬੱਸ ਅੱਡਾ",
    learnerPrompt_roman: "bas adda",
    learnerPrompt_en: "bus stop",
    signedRepair_pa: "ਬੱਸ ਅੱਡਾ ਸੜਕ ਦੇ ਸਾਹਮਣੇ ਹੈ।",
    signedRepair_roman: "bas adda sarak de sahmane hai.",
    signedRepair_en: "The bus stop is across the street.",
    explanation_vi: "Signoff giữ cụm Gurmukhi chính; romanization chỉ hỗ trợ âm.",
    explanation_en: "The signoff keeps the Gurmukhi phrase primary; romanization only supports sound.",
    signoffCheck: "Confirm the pre-A11 signoff preserves the full transit phrase in Gurmukhi.",
    commonTrap: "Guessing bus from context while skipping the Gurmukhi contrast.",
    rejectIf_vi: "Không chấp nhận nếu người học vẫn lẫn ਬ với ਪ.",
    rejectIf_en: "Reject if the learner still confuses ਬ with ਪ.",
    canadaPractical: true,
  },
  {
    id: "signoff-romanization-boundary",
    focus: "romanization-dependence",
    stage: "seal",
    audience: "both",
    signoffId: "romanization-support-only-signoff",
    sourceArtifactIds: ["seal-romanization-boundary", "snapshot-romanization-boundary"],
    learnerPrompt_pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਹਰਾਓ।",
    learnerPrompt_roman: "kirpa karke hauli duhrao.",
    learnerPrompt_en: "Please repeat slowly.",
    signedRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਹੌਲੀ ਕਹੋ।",
    signedRepair_roman: "kirpa karke dubara hauli kaho.",
    signedRepair_en: "Please say it again slowly.",
    explanation_vi: "Signoff xác nhận Gurmukhi là dòng đọc chính, không phải romanization.",
    explanation_en: "The signoff confirms Gurmukhi is the reading line, not romanization.",
    signoffCheck: "Confirm the seal signoff keeps romanization as support only.",
    commonTrap: "Memorizing Latin spelling and losing the Gurmukhi sentence.",
    rejectIf_vi: "Không chấp nhận nếu romanization trở thành nội dung chính.",
    rejectIf_en: "Reject if romanization becomes the primary content.",
    canadaPractical: true,
  },
  {
    id: "signoff-shahmukhi-awareness",
    focus: "romanization-dependence",
    stage: "pre-integration",
    audience: "en",
    signoffId: "shahmukhi-awareness-boundary-signoff",
    sourceArtifactIds: ["seal-shahmukhi-awareness", "snapshot-shahmukhi-awareness"],
    learnerPrompt_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਵਰਤਦੇ ਹਾਂ।",
    learnerPrompt_roman: "asi gurmukhi vartde haan.",
    learnerPrompt_en: "We use Gurmukhi.",
    signedRepair_pa: "ਇਹ ਗੁਰਮੁਖੀ ਅਭਿਆਸ ਹੈ।",
    signedRepair_roman: "ih gurmukhi abhyas hai.",
    signedRepair_en: "This is Gurmukhi practice.",
    explanation_vi: "Shahmukhi chỉ là nhận biết hệ chữ khác, không phải khóa học đầy đủ.",
    explanation_en: "Shahmukhi is only awareness of another script, not a full course.",
    signoffCheck: "Confirm the pre-integration signoff keeps Shahmukhi bounded to awareness.",
    commonTrap: "Expanding an awareness note into a separate Shahmukhi path.",
    rejectIf_vi: "Không chấp nhận nếu mục này mở thành giáo trình Shahmukhi.",
    rejectIf_en: "Reject if this item opens into a Shahmukhi syllabus.",
  },
  {
    id: "signoff-word-order-appointment",
    focus: "word-order",
    stage: "seal",
    audience: "both",
    signoffId: "appointment-time-order-signoff",
    sourceArtifactIds: ["seal-word-order-appointment", "snapshot-word-order-appointment"],
    learnerPrompt_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    learnerPrompt_roman: "meri appointment kede vele hai?",
    learnerPrompt_en: "What time is my appointment?",
    signedRepair_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    signedRepair_roman: "meri appointment kede vele hai?",
    signedRepair_en: "What time is my appointment?",
    explanation_vi: "Signoff giữ trật tự Punjabi tự nhiên khi hỏi giờ hẹn.",
    explanation_en: "The signoff keeps natural Punjabi order when asking appointment time.",
    signoffCheck: "Confirm the seal signoff catches English-style question reordering.",
    commonTrap: "Moving the question words to copy English.",
    rejectIf_vi: "Không chấp nhận nếu câu hỏi sao chép trật tự tiếng Anh.",
    rejectIf_en: "Reject if the question copies English word order.",
    canadaPractical: true,
  },
  {
    id: "signoff-postposition-library",
    focus: "postpositions",
    stage: "pre-integration",
    audience: "en",
    signoffId: "library-vich-postposition-signoff",
    sourceArtifactIds: ["seal-postposition-library", "snapshot-postposition-library"],
    learnerPrompt_pa: "ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ",
    learnerPrompt_roman: "library vich",
    learnerPrompt_en: "in the library",
    signedRepair_pa: "ਮੈਂ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਫਾਰਮ ਭਰ ਰਿਹਾ/ਰਹੀ ਹਾਂ।",
    signedRepair_roman: "main library vich form bhar riha/rahi haan.",
    signedRepair_en: "I am filling out the form in the library.",
    explanation_vi: "ਵਿੱਚ là marker vị trí bắt buộc trong câu này.",
    explanation_en: "ਵਿੱਚ is the required location marker in this sentence.",
    signoffCheck: "Confirm the pre-integration signoff preserves postpositions in location recovery.",
    commonTrap: "Dropping ਵਿੱਚ after thinking of the English preposition in.",
    rejectIf_vi: "Không chấp nhận nếu câu thiếu postposition Punjabi.",
    rejectIf_en: "Reject if the Punjabi postposition is missing.",
    canadaPractical: true,
  },
  {
    id: "signoff-agreement-bank-card",
    focus: "agreement",
    stage: "snapshot",
    audience: "both",
    signoffId: "bank-card-agreement-signoff",
    sourceArtifactIds: ["seal-agreement-bank-card", "snapshot-agreement-bank-card"],
    learnerPrompt_pa: "ਮੇਰਾ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।",
    learnerPrompt_roman: "mera card gumm giya hai.",
    learnerPrompt_en: "My card is lost.",
    signedRepair_pa: "ਮੇਰਾ ਬੈਂਕ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।",
    signedRepair_roman: "mera bank card gumm giya hai.",
    signedRepair_en: "My bank card is lost.",
    explanation_vi: "Signoff giữ ਮੇਰਾ và ਗਿਆ đồng bộ với ਨਾਂਵ trong câu báo mất thẻ.",
    explanation_en: "The signoff keeps ਮੇਰਾ and ਗਿਆ aligned with the noun in the lost-card sentence.",
    signoffCheck: "Confirm the snapshot signoff keeps gender and number agreement stable.",
    commonTrap: "Reusing one ending for every noun after memorizing the pattern.",
    rejectIf_vi: "Không chấp nhận nếu agreement đổi ngẫu nhiên khi thêm ਬੈਂਕ.",
    rejectIf_en: "Reject if agreement changes randomly after adding ਬੈਂਕ.",
    canadaPractical: true,
  },
  {
    id: "signoff-register-clinic",
    focus: "register-mismatch",
    stage: "pre-a11-signoff",
    audience: "both",
    signoffId: "clinic-polite-register-signoff",
    sourceArtifactIds: ["seal-register-clinic", "snapshot-register-clinic"],
    learnerPrompt_pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨੂੰ ਮਿਲਣਾ ਹੈ।",
    learnerPrompt_roman: "mainu doctor nu milna hai.",
    learnerPrompt_en: "I need to see a doctor.",
    signedRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਕੀ ਡਾਕਟਰ ਅੱਜ ਮਿਲ ਸਕਦੇ ਹਨ?",
    signedRepair_roman: "kirpa karke dasso, ki doctor ajj mil sakde han?",
    signedRepair_en: "Please tell me, can the doctor see me today?",
    explanation_vi: "Ở phòng khám, signoff giữ yêu cầu lịch sự và đủ câu.",
    explanation_en: "At a clinic, the signoff keeps the request polite and complete.",
    signoffCheck: "Confirm the pre-A11 signoff keeps service register polite without over-formality.",
    commonTrap: "Sounding abrupt at reception by using a clipped sentence.",
    rejectIf_vi: "Không chấp nhận nếu câu sửa thành mệnh lệnh trống.",
    rejectIf_en: "Reject if the repair becomes a bare command.",
    canadaPractical: true,
  },
  {
    id: "signoff-vietnamese-transfer-form",
    focus: "vietnamese-transfer",
    stage: "seal",
    audience: "vi",
    signoffId: "vi-transfer-form-help-signoff",
    sourceArtifactIds: ["seal-vietnamese-transfer-form", "snapshot-vietnamese-transfer-article"],
    learnerPrompt_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    learnerPrompt_roman: "mainu ih form chahida hai.",
    learnerPrompt_en: "I need this form.",
    signedRepair_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    signedRepair_roman: "mainu ih form bharan vich madad chahidi hai.",
    signedRepair_en: "I need help filling out this form.",
    explanation_vi: "Không dịch từng mảnh từ tiếng Việt; giữ ਇਹ, ਵਿੱਚ, và cụm Punjabi rõ.",
    explanation_en: "Do not translate Vietnamese chunks directly; keep clear Punjabi ਇਹ, ਵਿੱਚ, and phrase shape.",
    signoffCheck: "Confirm the seal signoff catches Vietnamese transfer in form-help requests.",
    commonTrap: "Building the Punjabi sentence from Vietnamese word chunks.",
    rejectIf_vi: "Không chấp nhận nếu marker Punjabi biến mất vì dịch từng mảnh.",
    rejectIf_en: "Reject if Punjabi markers disappear through chunk-by-chunk Vietnamese transfer.",
    canadaPractical: true,
  },
  {
    id: "signoff-english-transfer-phone",
    focus: "english-transfer",
    stage: "pre-integration",
    audience: "en",
    signoffId: "english-transfer-nu-phone-signoff",
    sourceArtifactIds: ["seal-english-transfer-phone", "snapshot-english-transfer-phone"],
    learnerPrompt_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    learnerPrompt_roman: "ki tusi usnu phone kar sakde ho?",
    learnerPrompt_en: "Can you call him/her?",
    signedRepair_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    signedRepair_roman: "ki tusi usnu phone kar sakde ho?",
    signedRepair_en: "Can you call him/her?",
    explanation_vi: "Punjabi cần ਨੂੰ cho người cụ thể, dù tiếng Anh không có marker tương ứng.",
    explanation_en: "Punjabi needs ਨੂੰ for a specific person even though English has no matching marker.",
    signoffCheck: "Confirm the pre-integration signoff catches English transfer around ਨੂੰ.",
    commonTrap: "Dropping ਨੂੰ because the English sentence has no visible equivalent.",
    rejectIf_vi: "Không chấp nhận nếu ਉਸਨੂੰ bị rút thành ਉਸ vì ảnh hưởng tiếng Anh.",
    rejectIf_en: "Reject if ਉਸਨੂੰ is reduced to ਉਸ through English transfer.",
    canadaPractical: true,
  },
  {
    id: "signoff-service-phrase-counter",
    focus: "service-phrase-gaps",
    stage: "snapshot",
    audience: "both",
    signoffId: "full-service-counter-request-signoff",
    sourceArtifactIds: ["seal-service-phrase-counter", "snapshot-service-phrase-recovery"],
    learnerPrompt_pa: "ਮਦਦ?",
    learnerPrompt_roman: "madad?",
    learnerPrompt_en: "Help?",
    signedRepair_pa: "ਮਾਫ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?",
    signedRepair_roman: "maaf karna, ki tusi meri madad kar sakde ho?",
    signedRepair_en: "Excuse me, can you help me?",
    explanation_vi: "Ở quầy dịch vụ, signoff giữ câu đầy đủ thay vì một từ rời.",
    explanation_en: "At a service counter, the signoff keeps a complete sentence instead of one loose word.",
    signoffCheck: "Confirm the snapshot signoff includes complete service phrases.",
    commonTrap: "Using one emergency word for every routine service interaction.",
    rejectIf_vi: "Không chấp nhận nếu câu sửa vẫn chỉ là một từ.",
    rejectIf_en: "Reject if the repair is still only one word.",
    canadaPractical: true,
  },
  {
    id: "signoff-canada-practical-pharmacy",
    focus: "canada-practical-recovery",
    stage: "pre-a11-signoff",
    audience: "both",
    signoffId: "pharmacy-refill-recovery-signoff",
    sourceArtifactIds: ["seal-canada-practical-pharmacy", "snapshot-canada-practical-pharmacy"],
    learnerPrompt_pa: "ਮੇਰੀ ਦਵਾਈ ਮੁੱਕ ਗਈ ਹੈ।",
    learnerPrompt_roman: "meri davai mukk gai hai.",
    learnerPrompt_en: "My medicine has run out.",
    signedRepair_pa: "ਕੀ ਮੈਂ ਫਾਰਮੇਸੀ ਵਿੱਚ ਆਪਣੀ ਦਵਾਈ ਦੁਬਾਰਾ ਲੈ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    signedRepair_roman: "ki main pharmacy vich apni davai dubara lai sakda/sakdi haan?",
    signedRepair_en: "Can I get my medicine again at the pharmacy?",
    explanation_vi: "Tình huống Canada thực tế: signoff giữ câu lịch sự, postposition, và agreement.",
    explanation_en: "Canada-practical recovery: the signoff keeps the polite question, postposition, and agreement.",
    signoffCheck: "Confirm the pre-A11 signoff is stable for pharmacy recovery before later integration.",
    commonTrap: "Using English order and dropping ਵਿੱਚ in a pharmacy request.",
    rejectIf_vi: "Không chấp nhận nếu câu chỉ là ghi chú tiếng Anh dịch rời rạc.",
    rejectIf_en: "Reject if the sentence is only a loose translation of an English note.",
    canadaPractical: true,
  },
];

export function punjabiRemediationSignoffSamplesByFocus(
  focus: PunjabiRemediationSignoffFocus,
): PunjabiRemediationSignoffSample[] {
  return punjabiRemediationSignoffSamples.filter((sample) => sample.focus === focus);
}

export function punjabiRemediationSignoffSamplesByStage(
  stage: PunjabiRemediationSignoffStage,
): PunjabiRemediationSignoffSample[] {
  return punjabiRemediationSignoffSamples.filter((sample) => sample.stage === stage);
}

export function punjabiRemediationSignoffSamplesByAudience(
  audience: PunjabiRemediationSignoffSample["audience"],
): PunjabiRemediationSignoffSample[] {
  return punjabiRemediationSignoffSamples.filter((sample) => sample.audience === audience);
}
