// Punjabi remediation traceability samples for Wave 62. Gurmukhi is primary;
// romanization is support only. These items are study support only, not
// official placement or certification. Native review is deferred. Shahmukhi is
// awareness only, not a full course. This is not A11 integration.

export type PunjabiRemediationTraceabilityFocus =
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

export type PunjabiRemediationTraceabilityStage =
  | "pre-a11-traceability"
  | "inventory-seal"
  | "catalog"
  | "pre-integration";

export interface PunjabiRemediationTraceabilitySample {
  id: string;
  focus: PunjabiRemediationTraceabilityFocus;
  stage: PunjabiRemediationTraceabilityStage;
  audience: "vi" | "en" | "both";
  traceabilityId: string;
  sourceArtifactIds: string[];
  learnerPrompt_pa: string;
  learnerPrompt_roman?: string;
  learnerPrompt_en: string;
  traceabilityRepair_pa: string;
  traceabilityRepair_roman?: string;
  traceabilityRepair_en: string;
  explanation_vi: string;
  explanation_en: string;
  traceabilityCheck: string;
  commonTrap: string;
  rejectIf_vi: string;
  rejectIf_en: string;
  canadaPractical?: boolean;
}

export const PUNJABI_REMEDIATION_TRACEABILITY_NOTICE =
  "Wave 62 remediation traceability samples only; not A11 integration. Study support only, not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_REMEDIATION_TRACEABILITY_FOCI: readonly PunjabiRemediationTraceabilityFocus[] = [
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

export const PUNJABI_REMEDIATION_TRACEABILITY_STAGES: readonly PunjabiRemediationTraceabilityStage[] = [
  "pre-a11-traceability",
  "inventory-seal",
  "catalog",
  "pre-integration",
] as const;

export const punjabiRemediationTraceabilitySamples: PunjabiRemediationTraceabilitySample[] = [
  {
    id: "traceability-script-bus-stop",
    focus: "script-confusion",
    stage: "pre-a11-traceability",
    audience: "both",
    traceabilityId: "script-bus-stop-gurmukhi-traceability",
    sourceArtifactIds: ["catalog-script-bus-stop", "inventory-seal-script-bus-stop"],
    learnerPrompt_pa: "ਬੱਸ ਅੱਡਾ",
    learnerPrompt_roman: "bas adda",
    learnerPrompt_en: "bus stop",
    traceabilityRepair_pa: "ਬੱਸ ਅੱਡਾ ਸੜਕ ਦੇ ਸਾਹਮਣੇ ਹੈ।",
    traceabilityRepair_roman: "bas adda sarak de sahmane hai.",
    traceabilityRepair_en: "The bus stop is across the street.",
    explanation_vi: "Traceability giữ cụm Gurmukhi chính; romanization chỉ hỗ trợ âm.",
    explanation_en: "The traceability keeps the Gurmukhi phrase primary; romanization only supports sound.",
    traceabilityCheck: "Confirm the pre-A11 traceability preserves the full transit phrase in Gurmukhi.",
    commonTrap: "Guessing bus from context while skipping the Gurmukhi contrast.",
    rejectIf_vi: "Không chấp nhận nếu người học vẫn lẫn ਬ với ਪ.",
    rejectIf_en: "Reject if the learner still confuses ਬ with ਪ.",
    canadaPractical: true,
  },
  {
    id: "traceability-romanization-boundary",
    focus: "romanization-dependence",
    stage: "catalog",
    audience: "both",
    traceabilityId: "romanization-support-only-traceability",
    sourceArtifactIds: ["catalog-romanization-boundary", "inventory-seal-romanization-boundary"],
    learnerPrompt_pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਹਰਾਓ।",
    learnerPrompt_roman: "kirpa karke hauli duhrao.",
    learnerPrompt_en: "Please repeat slowly.",
    traceabilityRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਹੌਲੀ ਕਹੋ।",
    traceabilityRepair_roman: "kirpa karke dubara hauli kaho.",
    traceabilityRepair_en: "Please say it again slowly.",
    explanation_vi: "Traceability xác nhận Gurmukhi là dòng đọc chính, không phải romanization.",
    explanation_en: "The traceability confirms Gurmukhi is the reading line, not romanization.",
    traceabilityCheck: "Confirm the catalog traceability keeps romanization as support only.",
    commonTrap: "Memorizing Latin spelling and losing the Gurmukhi sentence.",
    rejectIf_vi: "Không chấp nhận nếu romanization trở thành nội dung chính.",
    rejectIf_en: "Reject if romanization becomes the primary content.",
    canadaPractical: true,
  },
  {
    id: "traceability-shahmukhi-awareness",
    focus: "romanization-dependence",
    stage: "pre-integration",
    audience: "en",
    traceabilityId: "shahmukhi-awareness-boundary-traceability",
    sourceArtifactIds: ["catalog-shahmukhi-awareness", "inventory-seal-shahmukhi-awareness"],
    learnerPrompt_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਵਰਤਦੇ ਹਾਂ।",
    learnerPrompt_roman: "asi gurmukhi vartde haan.",
    learnerPrompt_en: "We use Gurmukhi.",
    traceabilityRepair_pa: "ਇਹ ਗੁਰਮੁਖੀ ਅਭਿਆਸ ਹੈ।",
    traceabilityRepair_roman: "ih gurmukhi abhyas hai.",
    traceabilityRepair_en: "This is Gurmukhi practice.",
    explanation_vi: "Shahmukhi chỉ là nhận biết hệ chữ khác, không phải khóa học đầy đủ.",
    explanation_en: "Shahmukhi is only awareness of another script, not a full course.",
    traceabilityCheck: "Confirm the pre-integration traceability keeps Shahmukhi bounded to awareness.",
    commonTrap: "Expanding an awareness note into a separate Shahmukhi path.",
    rejectIf_vi: "Không chấp nhận nếu mục này mở thành giáo trình Shahmukhi.",
    rejectIf_en: "Reject if this item opens into a Shahmukhi syllabus.",
  },
  {
    id: "traceability-word-order-appointment",
    focus: "word-order",
    stage: "inventory-seal",
    audience: "both",
    traceabilityId: "appointment-time-order-traceability",
    sourceArtifactIds: ["catalog-word-order-appointment", "inventory-seal-word-order-appointment"],
    learnerPrompt_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    learnerPrompt_roman: "meri appointment kede vele hai?",
    learnerPrompt_en: "What time is my appointment?",
    traceabilityRepair_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    traceabilityRepair_roman: "meri appointment kede vele hai?",
    traceabilityRepair_en: "What time is my appointment?",
    explanation_vi: "Traceability giữ trật tự Punjabi tự nhiên khi hỏi giờ hẹn.",
    explanation_en: "The traceability keeps natural Punjabi order when asking appointment time.",
    traceabilityCheck: "Confirm the inventory seal traceability catches English-style question reordering.",
    commonTrap: "Moving the question words to copy English.",
    rejectIf_vi: "Không chấp nhận nếu câu hỏi sao chép trật tự tiếng Anh.",
    rejectIf_en: "Reject if the question copies English word order.",
    canadaPractical: true,
  },
  {
    id: "traceability-postposition-library",
    focus: "postpositions",
    stage: "pre-integration",
    audience: "en",
    traceabilityId: "library-vich-postposition-traceability",
    sourceArtifactIds: ["catalog-postposition-library", "inventory-seal-postposition-library"],
    learnerPrompt_pa: "ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ",
    learnerPrompt_roman: "library vich",
    learnerPrompt_en: "in the library",
    traceabilityRepair_pa: "ਮੈਂ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਫਾਰਮ ਭਰ ਰਿਹਾ/ਰਹੀ ਹਾਂ।",
    traceabilityRepair_roman: "main library vich form bhar riha/rahi haan.",
    traceabilityRepair_en: "I am filling out the form in the library.",
    explanation_vi: "ਵਿੱਚ là marker vị trí bắt buộc trong câu này.",
    explanation_en: "ਵਿੱਚ is the required location marker in this sentence.",
    traceabilityCheck: "Confirm the pre-integration traceability preserves postpositions in location recovery.",
    commonTrap: "Dropping ਵਿੱਚ after thinking of the English preposition in.",
    rejectIf_vi: "Không chấp nhận nếu câu thiếu postposition Punjabi.",
    rejectIf_en: "Reject if the Punjabi postposition is missing.",
    canadaPractical: true,
  },
  {
    id: "traceability-agreement-bank-card",
    focus: "agreement",
    stage: "catalog",
    audience: "both",
    traceabilityId: "bank-card-agreement-traceability",
    sourceArtifactIds: ["catalog-agreement-bank-card", "inventory-seal-agreement-bank-card"],
    learnerPrompt_pa: "ਮੇਰਾ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।",
    learnerPrompt_roman: "mera card gumm giya hai.",
    learnerPrompt_en: "My card is lost.",
    traceabilityRepair_pa: "ਮੇਰਾ ਬੈਂਕ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।",
    traceabilityRepair_roman: "mera bank card gumm giya hai.",
    traceabilityRepair_en: "My bank card is lost.",
    explanation_vi: "Traceability giữ ਮੇਰਾ và ਗਿਆ đồng bộ với ਨਾਂਵ trong câu báo mất thẻ.",
    explanation_en: "The traceability keeps ਮੇਰਾ and ਗਿਆ aligned with the noun in the lost-card sentence.",
    traceabilityCheck: "Confirm the catalog traceability keeps gender and number agreement stable.",
    commonTrap: "Reusing one ending for every noun after memorizing the pattern.",
    rejectIf_vi: "Không chấp nhận nếu agreement đổi ngẫu nhiên khi thêm ਬੈਂਕ.",
    rejectIf_en: "Reject if agreement changes randomly after adding ਬੈਂਕ.",
    canadaPractical: true,
  },
  {
    id: "traceability-register-clinic",
    focus: "register-mismatch",
    stage: "pre-a11-traceability",
    audience: "both",
    traceabilityId: "clinic-polite-register-traceability",
    sourceArtifactIds: ["catalog-register-clinic", "inventory-seal-register-clinic"],
    learnerPrompt_pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨੂੰ ਮਿਲਣਾ ਹੈ।",
    learnerPrompt_roman: "mainu doctor nu milna hai.",
    learnerPrompt_en: "I need to see a doctor.",
    traceabilityRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਕੀ ਡਾਕਟਰ ਅੱਜ ਮਿਲ ਸਕਦੇ ਹਨ?",
    traceabilityRepair_roman: "kirpa karke dasso, ki doctor ajj mil sakde han?",
    traceabilityRepair_en: "Please tell me, can the doctor see me today?",
    explanation_vi: "Ở phòng khám, traceability giữ yêu cầu lịch sự và đủ câu.",
    explanation_en: "At a clinic, the traceability keeps the request polite and complete.",
    traceabilityCheck: "Confirm the pre-A11 traceability keeps service register polite without over-formality.",
    commonTrap: "Sounding abrupt at reception by using a clipped sentence.",
    rejectIf_vi: "Không chấp nhận nếu câu sửa thành mệnh lệnh trống.",
    rejectIf_en: "Reject if the repair becomes a bare command.",
    canadaPractical: true,
  },
  {
    id: "traceability-vietnamese-transfer-form",
    focus: "vietnamese-transfer",
    stage: "inventory-seal",
    audience: "vi",
    traceabilityId: "vi-transfer-form-help-traceability",
    sourceArtifactIds: ["catalog-vietnamese-transfer-form", "inventory-seal-vietnamese-transfer-form"],
    learnerPrompt_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    learnerPrompt_roman: "mainu ih form chahida hai.",
    learnerPrompt_en: "I need this form.",
    traceabilityRepair_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    traceabilityRepair_roman: "mainu ih form bharan vich madad chahidi hai.",
    traceabilityRepair_en: "I need help filling out this form.",
    explanation_vi: "Không dịch từng mảnh từ tiếng Việt; giữ ਇਹ, ਵਿੱਚ, và cụm Punjabi rõ.",
    explanation_en: "Do not translate Vietnamese chunks directly; keep clear Punjabi ਇਹ, ਵਿੱਚ, and phrase shape.",
    traceabilityCheck: "Confirm the inventory seal traceability catches Vietnamese transfer in form-help requests.",
    commonTrap: "Building the Punjabi sentence from Vietnamese word chunks.",
    rejectIf_vi: "Không chấp nhận nếu marker Punjabi biến mất vì dịch từng mảnh.",
    rejectIf_en: "Reject if Punjabi markers disappear through chunk-by-chunk Vietnamese transfer.",
    canadaPractical: true,
  },
  {
    id: "traceability-english-transfer-phone",
    focus: "english-transfer",
    stage: "pre-integration",
    audience: "en",
    traceabilityId: "english-transfer-nu-phone-traceability",
    sourceArtifactIds: ["catalog-english-transfer-phone", "inventory-seal-english-transfer-phone"],
    learnerPrompt_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    learnerPrompt_roman: "ki tusi usnu phone kar sakde ho?",
    learnerPrompt_en: "Can you call him/her?",
    traceabilityRepair_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    traceabilityRepair_roman: "ki tusi usnu phone kar sakde ho?",
    traceabilityRepair_en: "Can you call him/her?",
    explanation_vi: "Punjabi cần ਨੂੰ cho người cụ thể, dù tiếng Anh không có marker tương ứng.",
    explanation_en: "Punjabi needs ਨੂੰ for a specific person even though English has no matching marker.",
    traceabilityCheck: "Confirm the pre-integration traceability catches English transfer around ਨੂੰ.",
    commonTrap: "Dropping ਨੂੰ because the English sentence has no visible equivalent.",
    rejectIf_vi: "Không chấp nhận nếu ਉਸਨੂੰ bị rút thành ਉਸ vì ảnh hưởng tiếng Anh.",
    rejectIf_en: "Reject if ਉਸਨੂੰ is reduced to ਉਸ through English transfer.",
    canadaPractical: true,
  },
  {
    id: "traceability-service-phrase-counter",
    focus: "service-phrase-gaps",
    stage: "catalog",
    audience: "both",
    traceabilityId: "full-service-counter-request-traceability",
    sourceArtifactIds: ["catalog-service-phrase-counter", "inventory-seal-service-phrase-counter"],
    learnerPrompt_pa: "ਮਦਦ?",
    learnerPrompt_roman: "madad?",
    learnerPrompt_en: "Help?",
    traceabilityRepair_pa: "ਮਾਫ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?",
    traceabilityRepair_roman: "maaf karna, ki tusi meri madad kar sakde ho?",
    traceabilityRepair_en: "Excuse me, can you help me?",
    explanation_vi: "Ở quầy dịch vụ, traceability giữ câu đầy đủ thay vì một từ rời.",
    explanation_en: "At a service counter, the traceability keeps a complete sentence instead of one loose word.",
    traceabilityCheck: "Confirm the catalog traceability includes complete service phrases.",
    commonTrap: "Using one emergency word for every routine service interaction.",
    rejectIf_vi: "Không chấp nhận nếu câu sửa vẫn chỉ là một từ.",
    rejectIf_en: "Reject if the repair is still only one word.",
    canadaPractical: true,
  },
  {
    id: "traceability-canada-practical-pharmacy",
    focus: "canada-practical-recovery",
    stage: "pre-a11-traceability",
    audience: "both",
    traceabilityId: "pharmacy-refill-recovery-traceability",
    sourceArtifactIds: ["catalog-canada-practical-pharmacy", "inventory-seal-canada-practical-pharmacy"],
    learnerPrompt_pa: "ਮੇਰੀ ਦਵਾਈ ਮੁੱਕ ਗਈ ਹੈ।",
    learnerPrompt_roman: "meri davai mukk gai hai.",
    learnerPrompt_en: "My medicine has run out.",
    traceabilityRepair_pa: "ਕੀ ਮੈਂ ਫਾਰਮੇਸੀ ਵਿੱਚ ਆਪਣੀ ਦਵਾਈ ਦੁਬਾਰਾ ਲੈ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    traceabilityRepair_roman: "ki main pharmacy vich apni davai dubara lai sakda/sakdi haan?",
    traceabilityRepair_en: "Can I get my medicine again at the pharmacy?",
    explanation_vi: "Tình huống Canada thực tế: traceability giữ câu lịch sự, postposition, và agreement.",
    explanation_en: "Canada-practical recovery: the traceability keeps the polite question, postposition, and agreement.",
    traceabilityCheck: "Confirm the pre-A11 traceability is stable for pharmacy recovery before later integration.",
    commonTrap: "Using English order and dropping ਵਿੱਚ in a pharmacy request.",
    rejectIf_vi: "Không chấp nhận nếu câu chỉ là ghi chú tiếng Anh dịch rời rạc.",
    rejectIf_en: "Reject if the sentence is only a loose translation of an English note.",
    canadaPractical: true,
  },
];

export function punjabiRemediationTraceabilitySamplesByFocus(
  focus: PunjabiRemediationTraceabilityFocus,
): PunjabiRemediationTraceabilitySample[] {
  return punjabiRemediationTraceabilitySamples.filter((sample) => sample.focus === focus);
}

export function punjabiRemediationTraceabilitySamplesByStage(
  stage: PunjabiRemediationTraceabilityStage,
): PunjabiRemediationTraceabilitySample[] {
  return punjabiRemediationTraceabilitySamples.filter((sample) => sample.stage === stage);
}

export function punjabiRemediationTraceabilitySamplesByAudience(
  audience: PunjabiRemediationTraceabilitySample["audience"],
): PunjabiRemediationTraceabilitySample[] {
  return punjabiRemediationTraceabilitySamples.filter((sample) => sample.audience === audience);
}
