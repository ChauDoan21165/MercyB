// Punjabi remediation audit-trail samples for Wave 63. Gurmukhi is primary;
// romanization is support only. These items are study support only, not
// official placement or certification. Native review is deferred. Shahmukhi is
// awareness only, not a full course. This is not A11 integration.

export type PunjabiRemediationAuditTrailFocus =
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

export type PunjabiRemediationAuditTrailStage =
  | "pre-a11-audit-trail"
  | "inventory-seal"
  | "catalog"
  | "pre-integration";

export interface PunjabiRemediationAuditTrailSample {
  id: string;
  focus: PunjabiRemediationAuditTrailFocus;
  stage: PunjabiRemediationAuditTrailStage;
  audience: "vi" | "en" | "both";
  auditTrailId: string;
  sourceArtifactIds: string[];
  learnerPrompt_pa: string;
  learnerPrompt_roman?: string;
  learnerPrompt_en: string;
  auditTrailRepair_pa: string;
  auditTrailRepair_roman?: string;
  auditTrailRepair_en: string;
  explanation_vi: string;
  explanation_en: string;
  auditTrailCheck: string;
  commonTrap: string;
  rejectIf_vi: string;
  rejectIf_en: string;
  canadaPractical?: boolean;
}

export const PUNJABI_REMEDIATION_AUDIT_TRAIL_NOTICE =
  "Wave 63 remediation audit-trail samples only; not A11 integration. Study support only, not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_REMEDIATION_AUDIT_TRAIL_FOCI: readonly PunjabiRemediationAuditTrailFocus[] = [
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

export const PUNJABI_REMEDIATION_AUDIT_TRAIL_STAGES: readonly PunjabiRemediationAuditTrailStage[] = [
  "pre-a11-audit-trail",
  "inventory-seal",
  "catalog",
  "pre-integration",
] as const;

export const punjabiRemediationAuditTrailSamples: PunjabiRemediationAuditTrailSample[] = [
  {
    id: "audit-trail-script-bus-stop",
    focus: "script-confusion",
    stage: "pre-a11-audit-trail",
    audience: "both",
    auditTrailId: "script-bus-stop-gurmukhi-audit-trail",
    sourceArtifactIds: ["catalog-script-bus-stop", "inventory-seal-script-bus-stop"],
    learnerPrompt_pa: "ਬੱਸ ਅੱਡਾ",
    learnerPrompt_roman: "bas adda",
    learnerPrompt_en: "bus stop",
    auditTrailRepair_pa: "ਬੱਸ ਅੱਡਾ ਸੜਕ ਦੇ ਸਾਹਮਣੇ ਹੈ।",
    auditTrailRepair_roman: "bas adda sarak de sahmane hai.",
    auditTrailRepair_en: "The bus stop is across the street.",
    explanation_vi: "Audit trail giữ cụm Gurmukhi chính; romanization chỉ hỗ trợ âm.",
    explanation_en: "The audit-trail keeps the Gurmukhi phrase primary; romanization only supports sound.",
    auditTrailCheck: "Confirm the pre-A11 audit-trail preserves the full transit phrase in Gurmukhi.",
    commonTrap: "Guessing bus from context while skipping the Gurmukhi contrast.",
    rejectIf_vi: "Không chấp nhận nếu người học vẫn lẫn ਬ với ਪ.",
    rejectIf_en: "Reject if the learner still confuses ਬ with ਪ.",
    canadaPractical: true,
  },
  {
    id: "audit-trail-romanization-boundary",
    focus: "romanization-dependence",
    stage: "catalog",
    audience: "both",
    auditTrailId: "romanization-support-only-audit-trail",
    sourceArtifactIds: ["catalog-romanization-boundary", "inventory-seal-romanization-boundary"],
    learnerPrompt_pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਹਰਾਓ।",
    learnerPrompt_roman: "kirpa karke hauli duhrao.",
    learnerPrompt_en: "Please repeat slowly.",
    auditTrailRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਹੌਲੀ ਕਹੋ।",
    auditTrailRepair_roman: "kirpa karke dubara hauli kaho.",
    auditTrailRepair_en: "Please say it again slowly.",
    explanation_vi: "Audit trail xác nhận Gurmukhi là dòng đọc chính, không phải romanization.",
    explanation_en: "The audit-trail confirms Gurmukhi is the reading line, not romanization.",
    auditTrailCheck: "Confirm the catalog audit-trail keeps romanization as support only.",
    commonTrap: "Memorizing Latin spelling and losing the Gurmukhi sentence.",
    rejectIf_vi: "Không chấp nhận nếu romanization trở thành nội dung chính.",
    rejectIf_en: "Reject if romanization becomes the primary content.",
    canadaPractical: true,
  },
  {
    id: "audit-trail-shahmukhi-awareness",
    focus: "romanization-dependence",
    stage: "pre-integration",
    audience: "en",
    auditTrailId: "shahmukhi-awareness-boundary-audit-trail",
    sourceArtifactIds: ["catalog-shahmukhi-awareness", "inventory-seal-shahmukhi-awareness"],
    learnerPrompt_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਵਰਤਦੇ ਹਾਂ।",
    learnerPrompt_roman: "asi gurmukhi vartde haan.",
    learnerPrompt_en: "We use Gurmukhi.",
    auditTrailRepair_pa: "ਇਹ ਗੁਰਮੁਖੀ ਅਭਿਆਸ ਹੈ।",
    auditTrailRepair_roman: "ih gurmukhi abhyas hai.",
    auditTrailRepair_en: "This is Gurmukhi practice.",
    explanation_vi: "Shahmukhi chỉ là nhận biết hệ chữ khác, không phải khóa học đầy đủ.",
    explanation_en: "Shahmukhi is only awareness of another script, not a full course.",
    auditTrailCheck: "Confirm the pre-integration audit-trail keeps Shahmukhi bounded to awareness.",
    commonTrap: "Expanding an awareness note into a separate Shahmukhi path.",
    rejectIf_vi: "Không chấp nhận nếu mục này mở thành giáo trình Shahmukhi.",
    rejectIf_en: "Reject if this item opens into a Shahmukhi syllabus.",
  },
  {
    id: "audit-trail-word-order-appointment",
    focus: "word-order",
    stage: "inventory-seal",
    audience: "both",
    auditTrailId: "appointment-time-order-audit-trail",
    sourceArtifactIds: ["catalog-word-order-appointment", "inventory-seal-word-order-appointment"],
    learnerPrompt_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    learnerPrompt_roman: "meri appointment kede vele hai?",
    learnerPrompt_en: "What time is my appointment?",
    auditTrailRepair_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    auditTrailRepair_roman: "meri appointment kede vele hai?",
    auditTrailRepair_en: "What time is my appointment?",
    explanation_vi: "Audit trail giữ trật tự Punjabi tự nhiên khi hỏi giờ hẹn.",
    explanation_en: "The audit-trail keeps natural Punjabi order when asking appointment time.",
    auditTrailCheck: "Confirm the inventory seal audit-trail catches English-style question reordering.",
    commonTrap: "Moving the question words to copy English.",
    rejectIf_vi: "Không chấp nhận nếu câu hỏi sao chép trật tự tiếng Anh.",
    rejectIf_en: "Reject if the question copies English word order.",
    canadaPractical: true,
  },
  {
    id: "audit-trail-postposition-library",
    focus: "postpositions",
    stage: "pre-integration",
    audience: "en",
    auditTrailId: "library-vich-postposition-audit-trail",
    sourceArtifactIds: ["catalog-postposition-library", "inventory-seal-postposition-library"],
    learnerPrompt_pa: "ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ",
    learnerPrompt_roman: "library vich",
    learnerPrompt_en: "in the library",
    auditTrailRepair_pa: "ਮੈਂ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਫਾਰਮ ਭਰ ਰਿਹਾ/ਰਹੀ ਹਾਂ।",
    auditTrailRepair_roman: "main library vich form bhar riha/rahi haan.",
    auditTrailRepair_en: "I am filling out the form in the library.",
    explanation_vi: "ਵਿੱਚ là marker vị trí bắt buộc trong câu này.",
    explanation_en: "ਵਿੱਚ is the required location marker in this sentence.",
    auditTrailCheck: "Confirm the pre-integration audit-trail preserves postpositions in location recovery.",
    commonTrap: "Dropping ਵਿੱਚ after thinking of the English preposition in.",
    rejectIf_vi: "Không chấp nhận nếu câu thiếu postposition Punjabi.",
    rejectIf_en: "Reject if the Punjabi postposition is missing.",
    canadaPractical: true,
  },
  {
    id: "audit-trail-agreement-bank-card",
    focus: "agreement",
    stage: "catalog",
    audience: "both",
    auditTrailId: "bank-card-agreement-audit-trail",
    sourceArtifactIds: ["catalog-agreement-bank-card", "inventory-seal-agreement-bank-card"],
    learnerPrompt_pa: "ਮੇਰਾ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।",
    learnerPrompt_roman: "mera card gumm giya hai.",
    learnerPrompt_en: "My card is lost.",
    auditTrailRepair_pa: "ਮੇਰਾ ਬੈਂਕ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।",
    auditTrailRepair_roman: "mera bank card gumm giya hai.",
    auditTrailRepair_en: "My bank card is lost.",
    explanation_vi: "Audit trail giữ ਮੇਰਾ và ਗਿਆ đồng bộ với ਨਾਂਵ trong câu báo mất thẻ.",
    explanation_en: "The audit-trail keeps ਮੇਰਾ and ਗਿਆ aligned with the noun in the lost-card sentence.",
    auditTrailCheck: "Confirm the catalog audit-trail keeps gender and number agreement stable.",
    commonTrap: "Reusing one ending for every noun after memorizing the pattern.",
    rejectIf_vi: "Không chấp nhận nếu agreement đổi ngẫu nhiên khi thêm ਬੈਂਕ.",
    rejectIf_en: "Reject if agreement changes randomly after adding ਬੈਂਕ.",
    canadaPractical: true,
  },
  {
    id: "audit-trail-register-clinic",
    focus: "register-mismatch",
    stage: "pre-a11-audit-trail",
    audience: "both",
    auditTrailId: "clinic-polite-register-audit-trail",
    sourceArtifactIds: ["catalog-register-clinic", "inventory-seal-register-clinic"],
    learnerPrompt_pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨੂੰ ਮਿਲਣਾ ਹੈ।",
    learnerPrompt_roman: "mainu doctor nu milna hai.",
    learnerPrompt_en: "I need to see a doctor.",
    auditTrailRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਕੀ ਡਾਕਟਰ ਅੱਜ ਮਿਲ ਸਕਦੇ ਹਨ?",
    auditTrailRepair_roman: "kirpa karke dasso, ki doctor ajj mil sakde han?",
    auditTrailRepair_en: "Please tell me, can the doctor see me today?",
    explanation_vi: "Ở phòng khám, audit-trail giữ yêu cầu lịch sự và đủ câu.",
    explanation_en: "At a clinic, the audit-trail keeps the request polite and complete.",
    auditTrailCheck: "Confirm the pre-A11 audit-trail keeps service register polite without over-formality.",
    commonTrap: "Sounding abrupt at reception by using a clipped sentence.",
    rejectIf_vi: "Không chấp nhận nếu câu sửa thành mệnh lệnh trống.",
    rejectIf_en: "Reject if the repair becomes a bare command.",
    canadaPractical: true,
  },
  {
    id: "audit-trail-vietnamese-transfer-form",
    focus: "vietnamese-transfer",
    stage: "inventory-seal",
    audience: "vi",
    auditTrailId: "vi-transfer-form-help-audit-trail",
    sourceArtifactIds: ["catalog-vietnamese-transfer-form", "inventory-seal-vietnamese-transfer-form"],
    learnerPrompt_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    learnerPrompt_roman: "mainu ih form chahida hai.",
    learnerPrompt_en: "I need this form.",
    auditTrailRepair_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    auditTrailRepair_roman: "mainu ih form bharan vich madad chahidi hai.",
    auditTrailRepair_en: "I need help filling out this form.",
    explanation_vi: "Không dịch từng mảnh từ tiếng Việt; giữ ਇਹ, ਵਿੱਚ, và cụm Punjabi rõ.",
    explanation_en: "Do not translate Vietnamese chunks directly; keep clear Punjabi ਇਹ, ਵਿੱਚ, and phrase shape.",
    auditTrailCheck: "Confirm the inventory seal audit-trail catches Vietnamese transfer in form-help requests.",
    commonTrap: "Building the Punjabi sentence from Vietnamese word chunks.",
    rejectIf_vi: "Không chấp nhận nếu marker Punjabi biến mất vì dịch từng mảnh.",
    rejectIf_en: "Reject if Punjabi markers disappear through chunk-by-chunk Vietnamese transfer.",
    canadaPractical: true,
  },
  {
    id: "audit-trail-english-transfer-phone",
    focus: "english-transfer",
    stage: "pre-integration",
    audience: "en",
    auditTrailId: "english-transfer-nu-phone-audit-trail",
    sourceArtifactIds: ["catalog-english-transfer-phone", "inventory-seal-english-transfer-phone"],
    learnerPrompt_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    learnerPrompt_roman: "ki tusi usnu phone kar sakde ho?",
    learnerPrompt_en: "Can you call him/her?",
    auditTrailRepair_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    auditTrailRepair_roman: "ki tusi usnu phone kar sakde ho?",
    auditTrailRepair_en: "Can you call him/her?",
    explanation_vi: "Punjabi cần ਨੂੰ cho người cụ thể, dù tiếng Anh không có marker tương ứng.",
    explanation_en: "Punjabi needs ਨੂੰ for a specific person even though English has no matching marker.",
    auditTrailCheck: "Confirm the pre-integration audit-trail catches English transfer around ਨੂੰ.",
    commonTrap: "Dropping ਨੂੰ because the English sentence has no visible equivalent.",
    rejectIf_vi: "Không chấp nhận nếu ਉਸਨੂੰ bị rút thành ਉਸ vì ảnh hưởng tiếng Anh.",
    rejectIf_en: "Reject if ਉਸਨੂੰ is reduced to ਉਸ through English transfer.",
    canadaPractical: true,
  },
  {
    id: "audit-trail-service-phrase-counter",
    focus: "service-phrase-gaps",
    stage: "catalog",
    audience: "both",
    auditTrailId: "full-service-counter-request-audit-trail",
    sourceArtifactIds: ["catalog-service-phrase-counter", "inventory-seal-service-phrase-counter"],
    learnerPrompt_pa: "ਮਦਦ?",
    learnerPrompt_roman: "madad?",
    learnerPrompt_en: "Help?",
    auditTrailRepair_pa: "ਮਾਫ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?",
    auditTrailRepair_roman: "maaf karna, ki tusi meri madad kar sakde ho?",
    auditTrailRepair_en: "Excuse me, can you help me?",
    explanation_vi: "Ở quầy dịch vụ, audit-trail giữ câu đầy đủ thay vì một từ rời.",
    explanation_en: "At a service counter, the audit-trail keeps a complete sentence instead of one loose word.",
    auditTrailCheck: "Confirm the catalog audit-trail includes complete service phrases.",
    commonTrap: "Using one emergency word for every routine service interaction.",
    rejectIf_vi: "Không chấp nhận nếu câu sửa vẫn chỉ là một từ.",
    rejectIf_en: "Reject if the repair is still only one word.",
    canadaPractical: true,
  },
  {
    id: "audit-trail-canada-practical-pharmacy",
    focus: "canada-practical-recovery",
    stage: "pre-a11-audit-trail",
    audience: "both",
    auditTrailId: "pharmacy-refill-recovery-audit-trail",
    sourceArtifactIds: ["catalog-canada-practical-pharmacy", "inventory-seal-canada-practical-pharmacy"],
    learnerPrompt_pa: "ਮੇਰੀ ਦਵਾਈ ਮੁੱਕ ਗਈ ਹੈ।",
    learnerPrompt_roman: "meri davai mukk gai hai.",
    learnerPrompt_en: "My medicine has run out.",
    auditTrailRepair_pa: "ਕੀ ਮੈਂ ਫਾਰਮੇਸੀ ਵਿੱਚ ਆਪਣੀ ਦਵਾਈ ਦੁਬਾਰਾ ਲੈ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    auditTrailRepair_roman: "ki main pharmacy vich apni davai dubara lai sakda/sakdi haan?",
    auditTrailRepair_en: "Can I get my medicine again at the pharmacy?",
    explanation_vi: "Tình huống Canada thực tế: audit-trail giữ câu lịch sự, postposition, và agreement.",
    explanation_en: "Canada-practical recovery: the audit-trail keeps the polite question, postposition, and agreement.",
    auditTrailCheck: "Confirm the pre-A11 audit-trail is stable for pharmacy recovery before later integration.",
    commonTrap: "Using English order and dropping ਵਿੱਚ in a pharmacy request.",
    rejectIf_vi: "Không chấp nhận nếu câu chỉ là ghi chú tiếng Anh dịch rời rạc.",
    rejectIf_en: "Reject if the sentence is only a loose translation of an English note.",
    canadaPractical: true,
  },
];

export function punjabiRemediationAuditTrailSamplesByFocus(
  focus: PunjabiRemediationAuditTrailFocus,
): PunjabiRemediationAuditTrailSample[] {
  return punjabiRemediationAuditTrailSamples.filter((sample) => sample.focus === focus);
}

export function punjabiRemediationAuditTrailSamplesByStage(
  stage: PunjabiRemediationAuditTrailStage,
): PunjabiRemediationAuditTrailSample[] {
  return punjabiRemediationAuditTrailSamples.filter((sample) => sample.stage === stage);
}

export function punjabiRemediationAuditTrailSamplesByAudience(
  audience: PunjabiRemediationAuditTrailSample["audience"],
): PunjabiRemediationAuditTrailSample[] {
  return punjabiRemediationAuditTrailSamples.filter((sample) => sample.audience === audience);
}
