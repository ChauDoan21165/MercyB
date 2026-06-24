// Punjabi remediation bundle samples for Wave 57. Gurmukhi is primary;
// romanization is support only. These items are study support only, not
// official placement or certification. Native review is deferred. Shahmukhi is
// awareness only, not a full course. This is not A11 integration.

export type PunjabiRemediationBundleFocus =
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

export type PunjabiRemediationBundleStage =
  | "pre-a11-bundle"
  | "receipt"
  | "ledger"
  | "pre-integration";

export interface PunjabiRemediationBundleSample {
  id: string;
  focus: PunjabiRemediationBundleFocus;
  stage: PunjabiRemediationBundleStage;
  audience: "vi" | "en" | "both";
  bundleId: string;
  sourceArtifactIds: string[];
  learnerPrompt_pa: string;
  learnerPrompt_roman?: string;
  learnerPrompt_en: string;
  bundleRepair_pa: string;
  bundleRepair_roman?: string;
  bundleRepair_en: string;
  explanation_vi: string;
  explanation_en: string;
  bundleCheck: string;
  commonTrap: string;
  rejectIf_vi: string;
  rejectIf_en: string;
  canadaPractical?: boolean;
}

export const PUNJABI_REMEDIATION_BUNDLE_NOTICE =
  "Wave 57 remediation bundle samples only; not A11 integration. Study support only, not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_REMEDIATION_BUNDLE_FOCI: readonly PunjabiRemediationBundleFocus[] = [
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

export const PUNJABI_REMEDIATION_BUNDLE_STAGES: readonly PunjabiRemediationBundleStage[] = [
  "pre-a11-bundle",
  "receipt",
  "ledger",
  "pre-integration",
] as const;

export const punjabiRemediationBundleSamples: PunjabiRemediationBundleSample[] = [
  {
    id: "bundle-script-bus-stop",
    focus: "script-confusion",
    stage: "pre-a11-bundle",
    audience: "both",
    bundleId: "script-bus-stop-gurmukhi-bundle",
    sourceArtifactIds: ["receipt-script-bus-stop", "ledger-script-bus-stop"],
    learnerPrompt_pa: "ਬੱਸ ਅੱਡਾ",
    learnerPrompt_roman: "bas adda",
    learnerPrompt_en: "bus stop",
    bundleRepair_pa: "ਬੱਸ ਅੱਡਾ ਸੜਕ ਦੇ ਸਾਹਮਣੇ ਹੈ।",
    bundleRepair_roman: "bas adda sarak de sahmane hai.",
    bundleRepair_en: "The bus stop is across the street.",
    explanation_vi: "Bundle giữ cụm Gurmukhi chính; romanization chỉ hỗ trợ âm.",
    explanation_en: "The bundle keeps the Gurmukhi phrase primary; romanization only supports sound.",
    bundleCheck: "Confirm the pre-A11 bundle preserves the full transit phrase in Gurmukhi.",
    commonTrap: "Guessing bus from context while skipping the Gurmukhi contrast.",
    rejectIf_vi: "Không chấp nhận nếu người học vẫn lẫn ਬ với ਪ.",
    rejectIf_en: "Reject if the learner still confuses ਬ with ਪ.",
    canadaPractical: true,
  },
  {
    id: "bundle-romanization-boundary",
    focus: "romanization-dependence",
    stage: "receipt",
    audience: "both",
    bundleId: "romanization-support-only-bundle",
    sourceArtifactIds: ["receipt-romanization-boundary", "ledger-romanization-boundary"],
    learnerPrompt_pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਹਰਾਓ।",
    learnerPrompt_roman: "kirpa karke hauli duhrao.",
    learnerPrompt_en: "Please repeat slowly.",
    bundleRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਹੌਲੀ ਕਹੋ।",
    bundleRepair_roman: "kirpa karke dubara hauli kaho.",
    bundleRepair_en: "Please say it again slowly.",
    explanation_vi: "Bundle xác nhận Gurmukhi là dòng đọc chính, không phải romanization.",
    explanation_en: "The bundle confirms Gurmukhi is the reading line, not romanization.",
    bundleCheck: "Confirm the receipt bundle keeps romanization as support only.",
    commonTrap: "Memorizing Latin spelling and losing the Gurmukhi sentence.",
    rejectIf_vi: "Không chấp nhận nếu romanization trở thành nội dung chính.",
    rejectIf_en: "Reject if romanization becomes the primary content.",
    canadaPractical: true,
  },
  {
    id: "bundle-shahmukhi-awareness",
    focus: "romanization-dependence",
    stage: "pre-integration",
    audience: "en",
    bundleId: "shahmukhi-awareness-boundary-bundle",
    sourceArtifactIds: ["receipt-shahmukhi-awareness", "ledger-shahmukhi-awareness"],
    learnerPrompt_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਵਰਤਦੇ ਹਾਂ।",
    learnerPrompt_roman: "asi gurmukhi vartde haan.",
    learnerPrompt_en: "We use Gurmukhi.",
    bundleRepair_pa: "ਇਹ ਗੁਰਮੁਖੀ ਅਭਿਆਸ ਹੈ।",
    bundleRepair_roman: "ih gurmukhi abhyas hai.",
    bundleRepair_en: "This is Gurmukhi practice.",
    explanation_vi: "Shahmukhi chỉ là nhận biết hệ chữ khác, không phải khóa học đầy đủ.",
    explanation_en: "Shahmukhi is only awareness of another script, not a full course.",
    bundleCheck: "Confirm the pre-integration bundle keeps Shahmukhi bounded to awareness.",
    commonTrap: "Expanding an awareness note into a separate Shahmukhi path.",
    rejectIf_vi: "Không chấp nhận nếu mục này mở thành giáo trình Shahmukhi.",
    rejectIf_en: "Reject if this item opens into a Shahmukhi syllabus.",
  },
  {
    id: "bundle-word-order-appointment",
    focus: "word-order",
    stage: "ledger",
    audience: "both",
    bundleId: "appointment-time-order-bundle",
    sourceArtifactIds: ["receipt-word-order-appointment", "ledger-word-order-appointment"],
    learnerPrompt_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    learnerPrompt_roman: "meri appointment kede vele hai?",
    learnerPrompt_en: "What time is my appointment?",
    bundleRepair_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    bundleRepair_roman: "meri appointment kede vele hai?",
    bundleRepair_en: "What time is my appointment?",
    explanation_vi: "Bundle giữ trật tự Punjabi tự nhiên khi hỏi giờ hẹn.",
    explanation_en: "The bundle keeps natural Punjabi order when asking appointment time.",
    bundleCheck: "Confirm the ledger bundle catches English-style question reordering.",
    commonTrap: "Moving the question words to copy English.",
    rejectIf_vi: "Không chấp nhận nếu câu hỏi sao chép trật tự tiếng Anh.",
    rejectIf_en: "Reject if the question copies English word order.",
    canadaPractical: true,
  },
  {
    id: "bundle-postposition-library",
    focus: "postpositions",
    stage: "pre-integration",
    audience: "en",
    bundleId: "library-vich-postposition-bundle",
    sourceArtifactIds: ["receipt-postposition-library", "ledger-postposition-library"],
    learnerPrompt_pa: "ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ",
    learnerPrompt_roman: "library vich",
    learnerPrompt_en: "in the library",
    bundleRepair_pa: "ਮੈਂ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਫਾਰਮ ਭਰ ਰਿਹਾ/ਰਹੀ ਹਾਂ।",
    bundleRepair_roman: "main library vich form bhar riha/rahi haan.",
    bundleRepair_en: "I am filling out the form in the library.",
    explanation_vi: "ਵਿੱਚ là marker vị trí bắt buộc trong câu này.",
    explanation_en: "ਵਿੱਚ is the required location marker in this sentence.",
    bundleCheck: "Confirm the pre-integration bundle preserves postpositions in location recovery.",
    commonTrap: "Dropping ਵਿੱਚ after thinking of the English preposition in.",
    rejectIf_vi: "Không chấp nhận nếu câu thiếu postposition Punjabi.",
    rejectIf_en: "Reject if the Punjabi postposition is missing.",
    canadaPractical: true,
  },
  {
    id: "bundle-agreement-bank-card",
    focus: "agreement",
    stage: "receipt",
    audience: "both",
    bundleId: "bank-card-agreement-bundle",
    sourceArtifactIds: ["receipt-agreement-bank-card", "ledger-agreement-bank-card"],
    learnerPrompt_pa: "ਮੇਰਾ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।",
    learnerPrompt_roman: "mera card gumm giya hai.",
    learnerPrompt_en: "My card is lost.",
    bundleRepair_pa: "ਮੇਰਾ ਬੈਂਕ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।",
    bundleRepair_roman: "mera bank card gumm giya hai.",
    bundleRepair_en: "My bank card is lost.",
    explanation_vi: "Bundle giữ ਮੇਰਾ và ਗਿਆ đồng bộ với ਨਾਂਵ trong câu báo mất thẻ.",
    explanation_en: "The bundle keeps ਮੇਰਾ and ਗਿਆ aligned with the noun in the lost-card sentence.",
    bundleCheck: "Confirm the receipt bundle keeps gender and number agreement stable.",
    commonTrap: "Reusing one ending for every noun after memorizing the pattern.",
    rejectIf_vi: "Không chấp nhận nếu agreement đổi ngẫu nhiên khi thêm ਬੈਂਕ.",
    rejectIf_en: "Reject if agreement changes randomly after adding ਬੈਂਕ.",
    canadaPractical: true,
  },
  {
    id: "bundle-register-clinic",
    focus: "register-mismatch",
    stage: "pre-a11-bundle",
    audience: "both",
    bundleId: "clinic-polite-register-bundle",
    sourceArtifactIds: ["receipt-register-clinic", "ledger-register-clinic"],
    learnerPrompt_pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨੂੰ ਮਿਲਣਾ ਹੈ।",
    learnerPrompt_roman: "mainu doctor nu milna hai.",
    learnerPrompt_en: "I need to see a doctor.",
    bundleRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਕੀ ਡਾਕਟਰ ਅੱਜ ਮਿਲ ਸਕਦੇ ਹਨ?",
    bundleRepair_roman: "kirpa karke dasso, ki doctor ajj mil sakde han?",
    bundleRepair_en: "Please tell me, can the doctor see me today?",
    explanation_vi: "Ở phòng khám, bundle giữ yêu cầu lịch sự và đủ câu.",
    explanation_en: "At a clinic, the bundle keeps the request polite and complete.",
    bundleCheck: "Confirm the pre-A11 bundle keeps service register polite without over-formality.",
    commonTrap: "Sounding abrupt at reception by using a clipped sentence.",
    rejectIf_vi: "Không chấp nhận nếu câu sửa thành mệnh lệnh trống.",
    rejectIf_en: "Reject if the repair becomes a bare command.",
    canadaPractical: true,
  },
  {
    id: "bundle-vietnamese-transfer-form",
    focus: "vietnamese-transfer",
    stage: "ledger",
    audience: "vi",
    bundleId: "vi-transfer-form-help-bundle",
    sourceArtifactIds: ["receipt-vietnamese-transfer-form", "ledger-vietnamese-transfer-form"],
    learnerPrompt_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    learnerPrompt_roman: "mainu ih form chahida hai.",
    learnerPrompt_en: "I need this form.",
    bundleRepair_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    bundleRepair_roman: "mainu ih form bharan vich madad chahidi hai.",
    bundleRepair_en: "I need help filling out this form.",
    explanation_vi: "Không dịch từng mảnh từ tiếng Việt; giữ ਇਹ, ਵਿੱਚ, và cụm Punjabi rõ.",
    explanation_en: "Do not translate Vietnamese chunks directly; keep clear Punjabi ਇਹ, ਵਿੱਚ, and phrase shape.",
    bundleCheck: "Confirm the ledger bundle catches Vietnamese transfer in form-help requests.",
    commonTrap: "Building the Punjabi sentence from Vietnamese word chunks.",
    rejectIf_vi: "Không chấp nhận nếu marker Punjabi biến mất vì dịch từng mảnh.",
    rejectIf_en: "Reject if Punjabi markers disappear through chunk-by-chunk Vietnamese transfer.",
    canadaPractical: true,
  },
  {
    id: "bundle-english-transfer-phone",
    focus: "english-transfer",
    stage: "pre-integration",
    audience: "en",
    bundleId: "english-transfer-nu-phone-bundle",
    sourceArtifactIds: ["receipt-english-transfer-phone", "ledger-english-transfer-phone"],
    learnerPrompt_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    learnerPrompt_roman: "ki tusi usnu phone kar sakde ho?",
    learnerPrompt_en: "Can you call him/her?",
    bundleRepair_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    bundleRepair_roman: "ki tusi usnu phone kar sakde ho?",
    bundleRepair_en: "Can you call him/her?",
    explanation_vi: "Punjabi cần ਨੂੰ cho người cụ thể, dù tiếng Anh không có marker tương ứng.",
    explanation_en: "Punjabi needs ਨੂੰ for a specific person even though English has no matching marker.",
    bundleCheck: "Confirm the pre-integration bundle catches English transfer around ਨੂੰ.",
    commonTrap: "Dropping ਨੂੰ because the English sentence has no visible equivalent.",
    rejectIf_vi: "Không chấp nhận nếu ਉਸਨੂੰ bị rút thành ਉਸ vì ảnh hưởng tiếng Anh.",
    rejectIf_en: "Reject if ਉਸਨੂੰ is reduced to ਉਸ through English transfer.",
    canadaPractical: true,
  },
  {
    id: "bundle-service-phrase-counter",
    focus: "service-phrase-gaps",
    stage: "receipt",
    audience: "both",
    bundleId: "full-service-counter-request-bundle",
    sourceArtifactIds: ["receipt-service-phrase-counter", "ledger-service-phrase-counter"],
    learnerPrompt_pa: "ਮਦਦ?",
    learnerPrompt_roman: "madad?",
    learnerPrompt_en: "Help?",
    bundleRepair_pa: "ਮਾਫ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?",
    bundleRepair_roman: "maaf karna, ki tusi meri madad kar sakde ho?",
    bundleRepair_en: "Excuse me, can you help me?",
    explanation_vi: "Ở quầy dịch vụ, bundle giữ câu đầy đủ thay vì một từ rời.",
    explanation_en: "At a service counter, the bundle keeps a complete sentence instead of one loose word.",
    bundleCheck: "Confirm the receipt bundle includes complete service phrases.",
    commonTrap: "Using one emergency word for every routine service interaction.",
    rejectIf_vi: "Không chấp nhận nếu câu sửa vẫn chỉ là một từ.",
    rejectIf_en: "Reject if the repair is still only one word.",
    canadaPractical: true,
  },
  {
    id: "bundle-canada-practical-pharmacy",
    focus: "canada-practical-recovery",
    stage: "pre-a11-bundle",
    audience: "both",
    bundleId: "pharmacy-refill-recovery-bundle",
    sourceArtifactIds: ["receipt-canada-practical-pharmacy", "ledger-canada-practical-pharmacy"],
    learnerPrompt_pa: "ਮੇਰੀ ਦਵਾਈ ਮੁੱਕ ਗਈ ਹੈ।",
    learnerPrompt_roman: "meri davai mukk gai hai.",
    learnerPrompt_en: "My medicine has run out.",
    bundleRepair_pa: "ਕੀ ਮੈਂ ਫਾਰਮੇਸੀ ਵਿੱਚ ਆਪਣੀ ਦਵਾਈ ਦੁਬਾਰਾ ਲੈ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    bundleRepair_roman: "ki main pharmacy vich apni davai dubara lai sakda/sakdi haan?",
    bundleRepair_en: "Can I get my medicine again at the pharmacy?",
    explanation_vi: "Tình huống Canada thực tế: bundle giữ câu lịch sự, postposition, và agreement.",
    explanation_en: "Canada-practical recovery: the bundle keeps the polite question, postposition, and agreement.",
    bundleCheck: "Confirm the pre-A11 bundle is stable for pharmacy recovery before later integration.",
    commonTrap: "Using English order and dropping ਵਿੱਚ in a pharmacy request.",
    rejectIf_vi: "Không chấp nhận nếu câu chỉ là ghi chú tiếng Anh dịch rời rạc.",
    rejectIf_en: "Reject if the sentence is only a loose translation of an English note.",
    canadaPractical: true,
  },
];

export function punjabiRemediationBundleSamplesByFocus(
  focus: PunjabiRemediationBundleFocus,
): PunjabiRemediationBundleSample[] {
  return punjabiRemediationBundleSamples.filter((sample) => sample.focus === focus);
}

export function punjabiRemediationBundleSamplesByStage(
  stage: PunjabiRemediationBundleStage,
): PunjabiRemediationBundleSample[] {
  return punjabiRemediationBundleSamples.filter((sample) => sample.stage === stage);
}

export function punjabiRemediationBundleSamplesByAudience(
  audience: PunjabiRemediationBundleSample["audience"],
): PunjabiRemediationBundleSample[] {
  return punjabiRemediationBundleSamples.filter((sample) => sample.audience === audience);
}
