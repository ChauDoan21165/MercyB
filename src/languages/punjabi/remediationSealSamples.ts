// Punjabi remediation seal samples for Wave 52. Gurmukhi is primary;
// romanization is support only. These items are study support only, not
// official placement or certification. Native review is deferred. Shahmukhi is
// awareness only, not a full course. This is not A11 integration.

export type PunjabiRemediationSealFocus =
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

export type PunjabiRemediationSealStage =
  | "pre-a11-seal"
  | "snapshot"
  | "closure-packet"
  | "pre-integration";

export interface PunjabiRemediationSealSample {
  id: string;
  focus: PunjabiRemediationSealFocus;
  stage: PunjabiRemediationSealStage;
  audience: "vi" | "en" | "both";
  sealId: string;
  sourceArtifactIds: string[];
  learnerPrompt_pa: string;
  learnerPrompt_roman?: string;
  learnerPrompt_en: string;
  sealedRepair_pa: string;
  sealedRepair_roman?: string;
  sealedRepair_en: string;
  explanation_vi: string;
  explanation_en: string;
  sealCheck: string;
  commonTrap: string;
  rejectIf_vi: string;
  rejectIf_en: string;
  canadaPractical?: boolean;
}

export const PUNJABI_REMEDIATION_SEAL_NOTICE =
  "Wave 52 remediation seal samples only; not A11 integration. Study support only, not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_REMEDIATION_SEAL_FOCI: readonly PunjabiRemediationSealFocus[] = [
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

export const PUNJABI_REMEDIATION_SEAL_STAGES: readonly PunjabiRemediationSealStage[] = [
  "pre-a11-seal",
  "snapshot",
  "closure-packet",
  "pre-integration",
] as const;

export const punjabiRemediationSealSamples: PunjabiRemediationSealSample[] = [
  {
    id: "seal-script-bus-stop",
    focus: "script-confusion",
    stage: "pre-a11-seal",
    audience: "both",
    sealId: "script-bus-stop-gurmukhi-seal",
    sourceArtifactIds: ["snapshot-script-bus-stop", "closure-script-stop-counter"],
    learnerPrompt_pa: "ਬੱਸ ਅੱਡਾ",
    learnerPrompt_roman: "bas adda",
    learnerPrompt_en: "bus stop",
    sealedRepair_pa: "ਬੱਸ ਅੱਡਾ ਸੜਕ ਦੇ ਸਾਹਮਣੇ ਹੈ।",
    sealedRepair_roman: "bas adda sarak de sahmane hai.",
    sealedRepair_en: "The bus stop is across the street.",
    explanation_vi: "Seal giữ cụm Gurmukhi chính; romanization chỉ là hỗ trợ âm.",
    explanation_en: "The seal keeps the Gurmukhi phrase primary; romanization only supports sound.",
    sealCheck: "Confirm the pre-A11 seal preserves the full transit phrase in Gurmukhi.",
    commonTrap: "Reading the context as bus and skipping the Gurmukhi contrast.",
    rejectIf_vi: "Không chấp nhận nếu người học vẫn lẫn ਬ với ਪ.",
    rejectIf_en: "Reject if the learner still confuses ਬ with ਪ.",
    canadaPractical: true,
  },
  {
    id: "seal-romanization-boundary",
    focus: "romanization-dependence",
    stage: "snapshot",
    audience: "both",
    sealId: "romanization-support-only-seal",
    sourceArtifactIds: ["snapshot-romanization-boundary", "checksum-romanization-help"],
    learnerPrompt_pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਹਰਾਓ।",
    learnerPrompt_roman: "kirpa karke hauli duhrao.",
    learnerPrompt_en: "Please repeat slowly.",
    sealedRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਹੌਲੀ ਕਹੋ।",
    sealedRepair_roman: "kirpa karke dubara hauli kaho.",
    sealedRepair_en: "Please say it again slowly.",
    explanation_vi: "Seal khóa Gurmukhi làm dòng đọc chính, không khóa romanization làm bài học.",
    explanation_en: "The seal locks Gurmukhi as the reading line, not romanization as the lesson.",
    sealCheck: "Confirm the snapshot seal keeps romanization as support only.",
    commonTrap: "Memorizing Latin spelling while losing the Gurmukhi sentence.",
    rejectIf_vi: "Không chấp nhận nếu romanization trở thành nội dung chính.",
    rejectIf_en: "Reject if romanization becomes the primary content.",
    canadaPractical: true,
  },
  {
    id: "seal-shahmukhi-awareness",
    focus: "romanization-dependence",
    stage: "pre-integration",
    audience: "en",
    sealId: "shahmukhi-awareness-boundary-seal",
    sourceArtifactIds: ["snapshot-shahmukhi-awareness", "closure-shahmukhi-awareness"],
    learnerPrompt_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਵਰਤਦੇ ਹਾਂ।",
    learnerPrompt_roman: "asi gurmukhi vartde haan.",
    learnerPrompt_en: "We use Gurmukhi.",
    sealedRepair_pa: "ਇਹ ਗੁਰਮੁਖੀ ਅਭਿਆਸ ਹੈ।",
    sealedRepair_roman: "ih gurmukhi abhyas hai.",
    sealedRepair_en: "This is Gurmukhi practice.",
    explanation_vi: "Shahmukhi chỉ là nhận biết hệ chữ khác, không phải khóa học đầy đủ.",
    explanation_en: "Shahmukhi is only awareness of another script, not a full course.",
    sealCheck: "Confirm the pre-integration seal keeps Shahmukhi bounded to awareness.",
    commonTrap: "Expanding an awareness note into a separate Shahmukhi path.",
    rejectIf_vi: "Không chấp nhận nếu mục này mở thành giáo trình Shahmukhi.",
    rejectIf_en: "Reject if this item opens into a Shahmukhi syllabus.",
  },
  {
    id: "seal-word-order-appointment",
    focus: "word-order",
    stage: "closure-packet",
    audience: "both",
    sealId: "appointment-time-order-seal",
    sourceArtifactIds: ["snapshot-word-order-appointment", "checksum-word-order-appointment"],
    learnerPrompt_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    learnerPrompt_roman: "meri appointment kede vele hai?",
    learnerPrompt_en: "What time is my appointment?",
    sealedRepair_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    sealedRepair_roman: "meri appointment kede vele hai?",
    sealedRepair_en: "What time is my appointment?",
    explanation_vi: "Seal giữ trật tự Punjabi tự nhiên khi hỏi giờ hẹn.",
    explanation_en: "The seal keeps natural Punjabi order when asking appointment time.",
    sealCheck: "Confirm the closure-packet seal catches English-style question reordering.",
    commonTrap: "Moving the question words to copy English.",
    rejectIf_vi: "Không chấp nhận nếu câu hỏi sao chép trật tự tiếng Anh.",
    rejectIf_en: "Reject if the question copies English word order.",
    canadaPractical: true,
  },
  {
    id: "seal-postposition-library",
    focus: "postpositions",
    stage: "pre-integration",
    audience: "en",
    sealId: "library-vich-postposition-seal",
    sourceArtifactIds: ["snapshot-postposition-library", "closure-postposition-library"],
    learnerPrompt_pa: "ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ",
    learnerPrompt_roman: "library vich",
    learnerPrompt_en: "in the library",
    sealedRepair_pa: "ਮੈਂ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਫਾਰਮ ਭਰ ਰਿਹਾ/ਰਹੀ ਹਾਂ।",
    sealedRepair_roman: "main library vich form bhar riha/rahi haan.",
    sealedRepair_en: "I am filling out the form in the library.",
    explanation_vi: "ਵਿੱਚ là marker vị trí bắt buộc trong câu này.",
    explanation_en: "ਵਿੱਚ is the required location marker in this sentence.",
    sealCheck: "Confirm the pre-integration seal preserves postpositions in location recovery.",
    commonTrap: "Dropping ਵਿੱਚ after thinking of the English preposition in.",
    rejectIf_vi: "Không chấp nhận nếu câu thiếu postposition Punjabi.",
    rejectIf_en: "Reject if the Punjabi postposition is missing.",
    canadaPractical: true,
  },
  {
    id: "seal-agreement-bank-card",
    focus: "agreement",
    stage: "snapshot",
    audience: "both",
    sealId: "bank-card-agreement-seal",
    sourceArtifactIds: ["snapshot-agreement-bank-card", "closure-script-card-number"],
    learnerPrompt_pa: "ਮੇਰਾ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।",
    learnerPrompt_roman: "mera card gumm giya hai.",
    learnerPrompt_en: "My card is lost.",
    sealedRepair_pa: "ਮੇਰਾ ਬੈਂਕ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।",
    sealedRepair_roman: "mera bank card gumm giya hai.",
    sealedRepair_en: "My bank card is lost.",
    explanation_vi: "Seal giữ ਮੇਰਾ và ਗਿਆ đồng bộ với ਨਾਂਵ trong câu báo mất thẻ.",
    explanation_en: "The seal keeps ਮੇਰਾ and ਗਿਆ aligned with the noun in the lost-card sentence.",
    sealCheck: "Confirm the snapshot seal keeps gender and number agreement stable.",
    commonTrap: "Reusing one ending for every noun after memorizing the pattern.",
    rejectIf_vi: "Không chấp nhận nếu agreement đổi ngẫu nhiên khi thêm ਬੈਂਕ.",
    rejectIf_en: "Reject if agreement changes randomly after adding ਬੈਂਕ.",
    canadaPractical: true,
  },
  {
    id: "seal-register-clinic",
    focus: "register-mismatch",
    stage: "pre-a11-seal",
    audience: "both",
    sealId: "clinic-polite-register-seal",
    sourceArtifactIds: ["snapshot-register-clinic", "closure-service-clinic"],
    learnerPrompt_pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨੂੰ ਮਿਲਣਾ ਹੈ।",
    learnerPrompt_roman: "mainu doctor nu milna hai.",
    learnerPrompt_en: "I need to see a doctor.",
    sealedRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਕੀ ਡਾਕਟਰ ਅੱਜ ਮਿਲ ਸਕਦੇ ਹਨ?",
    sealedRepair_roman: "kirpa karke dasso, ki doctor ajj mil sakde han?",
    sealedRepair_en: "Please tell me, can the doctor see me today?",
    explanation_vi: "Ở phòng khám, seal giữ yêu cầu lịch sự và đủ câu.",
    explanation_en: "At a clinic, the seal keeps the request polite and complete.",
    sealCheck: "Confirm the pre-A11 seal keeps service register polite without over-formality.",
    commonTrap: "Sounding abrupt at reception by using a clipped sentence.",
    rejectIf_vi: "Không chấp nhận nếu câu sửa thành mệnh lệnh trống.",
    rejectIf_en: "Reject if the repair becomes a bare command.",
    canadaPractical: true,
  },
  {
    id: "seal-vietnamese-transfer-form",
    focus: "vietnamese-transfer",
    stage: "closure-packet",
    audience: "vi",
    sealId: "vi-transfer-form-help-seal",
    sourceArtifactIds: ["snapshot-vietnamese-transfer-article", "premerge-vietnamese-transfer-service"],
    learnerPrompt_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    learnerPrompt_roman: "mainu ih form chahida hai.",
    learnerPrompt_en: "I need this form.",
    sealedRepair_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    sealedRepair_roman: "mainu ih form bharan vich madad chahidi hai.",
    sealedRepair_en: "I need help filling out this form.",
    explanation_vi: "Không dịch từng mảnh từ tiếng Việt; giữ ਇਹ, ਵਿੱਚ, và cụm Punjabi rõ.",
    explanation_en: "Do not translate Vietnamese chunks directly; keep clear Punjabi ਇਹ, ਵਿੱਚ, and phrase shape.",
    sealCheck: "Confirm the closure-packet seal catches Vietnamese transfer in form-help requests.",
    commonTrap: "Building the Punjabi sentence from Vietnamese word chunks.",
    rejectIf_vi: "Không chấp nhận nếu marker Punjabi biến mất vì dịch từng mảnh.",
    rejectIf_en: "Reject if Punjabi markers disappear through chunk-by-chunk Vietnamese transfer.",
    canadaPractical: true,
  },
  {
    id: "seal-english-transfer-phone",
    focus: "english-transfer",
    stage: "pre-integration",
    audience: "en",
    sealId: "english-transfer-nu-phone-seal",
    sourceArtifactIds: ["snapshot-english-transfer-phone", "checksum-postposition-human-nu"],
    learnerPrompt_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    learnerPrompt_roman: "ki tusi usnu phone kar sakde ho?",
    learnerPrompt_en: "Can you call him/her?",
    sealedRepair_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    sealedRepair_roman: "ki tusi usnu phone kar sakde ho?",
    sealedRepair_en: "Can you call him/her?",
    explanation_vi: "Punjabi cần ਨੂੰ cho người cụ thể, dù tiếng Anh không có marker tương ứng.",
    explanation_en: "Punjabi needs ਨੂੰ for a specific person even though English has no matching marker.",
    sealCheck: "Confirm the pre-integration seal catches English transfer around ਨੂੰ.",
    commonTrap: "Dropping ਨੂੰ because the English sentence has no visible equivalent.",
    rejectIf_vi: "Không chấp nhận nếu ਉਸਨੂੰ bị rút thành ਉਸ vì ảnh hưởng tiếng Anh.",
    rejectIf_en: "Reject if ਉਸਨੂੰ is reduced to ਉਸ through English transfer.",
    canadaPractical: true,
  },
  {
    id: "seal-service-phrase-counter",
    focus: "service-phrase-gaps",
    stage: "snapshot",
    audience: "both",
    sealId: "full-service-counter-request-seal",
    sourceArtifactIds: ["snapshot-service-phrase-recovery", "closure-service-counter"],
    learnerPrompt_pa: "ਮਦਦ?",
    learnerPrompt_roman: "madad?",
    learnerPrompt_en: "Help?",
    sealedRepair_pa: "ਮਾਫ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?",
    sealedRepair_roman: "maaf karna, ki tusi meri madad kar sakde ho?",
    sealedRepair_en: "Excuse me, can you help me?",
    explanation_vi: "Ở quầy dịch vụ, seal giữ câu đầy đủ thay vì một từ rời.",
    explanation_en: "At a service counter, the seal keeps a complete sentence instead of one loose word.",
    sealCheck: "Confirm the snapshot seal includes complete service phrases.",
    commonTrap: "Using one emergency word for every routine service interaction.",
    rejectIf_vi: "Không chấp nhận nếu câu sửa vẫn chỉ là một từ.",
    rejectIf_en: "Reject if the repair is still only one word.",
    canadaPractical: true,
  },
  {
    id: "seal-canada-practical-pharmacy",
    focus: "canada-practical-recovery",
    stage: "pre-a11-seal",
    audience: "both",
    sealId: "pharmacy-refill-recovery-seal",
    sourceArtifactIds: ["snapshot-canada-practical-pharmacy", "closure-word-order-pharmacy"],
    learnerPrompt_pa: "ਮੇਰੀ ਦਵਾਈ ਮੁੱਕ ਗਈ ਹੈ।",
    learnerPrompt_roman: "meri davai mukk gai hai.",
    learnerPrompt_en: "My medicine has run out.",
    sealedRepair_pa: "ਕੀ ਮੈਂ ਫਾਰਮੇਸੀ ਵਿੱਚ ਆਪਣੀ ਦਵਾਈ ਦੁਬਾਰਾ ਲੈ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    sealedRepair_roman: "ki main pharmacy vich apni davai dubara lai sakda/sakdi haan?",
    sealedRepair_en: "Can I get my medicine again at the pharmacy?",
    explanation_vi: "Tình huống Canada thực tế: seal giữ câu lịch sự, postposition, và agreement.",
    explanation_en: "Canada-practical recovery: the seal keeps the polite question, postposition, and agreement.",
    sealCheck: "Confirm the pre-A11 seal is stable for pharmacy recovery before later integration.",
    commonTrap: "Using English order and dropping ਵਿੱਚ in a pharmacy request.",
    rejectIf_vi: "Không chấp nhận nếu câu chỉ là ghi chú tiếng Anh dịch rời rạc.",
    rejectIf_en: "Reject if the sentence is only a loose translation of an English note.",
    canadaPractical: true,
  },
];

export function punjabiRemediationSealSamplesByFocus(
  focus: PunjabiRemediationSealFocus,
): PunjabiRemediationSealSample[] {
  return punjabiRemediationSealSamples.filter((sample) => sample.focus === focus);
}

export function punjabiRemediationSealSamplesByStage(
  stage: PunjabiRemediationSealStage,
): PunjabiRemediationSealSample[] {
  return punjabiRemediationSealSamples.filter((sample) => sample.stage === stage);
}

export function punjabiRemediationSealSamplesByAudience(
  audience: PunjabiRemediationSealSample["audience"],
): PunjabiRemediationSealSample[] {
  return punjabiRemediationSealSamples.filter((sample) => sample.audience === audience);
}
