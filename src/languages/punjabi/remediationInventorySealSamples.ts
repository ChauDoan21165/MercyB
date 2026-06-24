// Punjabi remediation inventory seal samples for Wave 59. Gurmukhi is primary;
// romanization is support only. These items are study support only, not
// official placement or certification. Native review is deferred. Shahmukhi is
// awareness only, not a full course. This is not A11 integration.

export type PunjabiRemediationInventorySealFocus =
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

export type PunjabiRemediationInventorySealStage =
  | "pre-a11-inventory-seal"
  | "bundle"
  | "catalog"
  | "pre-integration";

export interface PunjabiRemediationInventorySealSample {
  id: string;
  focus: PunjabiRemediationInventorySealFocus;
  stage: PunjabiRemediationInventorySealStage;
  audience: "vi" | "en" | "both";
  inventorySealId: string;
  sourceArtifactIds: string[];
  learnerPrompt_pa: string;
  learnerPrompt_roman?: string;
  learnerPrompt_en: string;
  inventorySealRepair_pa: string;
  inventorySealRepair_roman?: string;
  inventorySealRepair_en: string;
  explanation_vi: string;
  explanation_en: string;
  inventorySealCheck: string;
  commonTrap: string;
  rejectIf_vi: string;
  rejectIf_en: string;
  canadaPractical?: boolean;
}

export const PUNJABI_REMEDIATION_INVENTORY_SEAL_NOTICE =
  "Wave 59 remediation inventory seal samples only; not A11 integration. Study support only, not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_REMEDIATION_INVENTORY_SEAL_FOCI: readonly PunjabiRemediationInventorySealFocus[] = [
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

export const PUNJABI_REMEDIATION_INVENTORY_SEAL_STAGES: readonly PunjabiRemediationInventorySealStage[] = [
  "pre-a11-inventory-seal",
  "bundle",
  "catalog",
  "pre-integration",
] as const;

export const punjabiRemediationInventorySealSamples: PunjabiRemediationInventorySealSample[] = [
  {
    id: "inventory-seal-script-bus-stop",
    focus: "script-confusion",
    stage: "pre-a11-inventory-seal",
    audience: "both",
    inventorySealId: "script-bus-stop-gurmukhi-inventory-seal",
    sourceArtifactIds: ["catalog-script-bus-stop", "bundle-script-bus-stop"],
    learnerPrompt_pa: "ਬੱਸ ਅੱਡਾ",
    learnerPrompt_roman: "bas adda",
    learnerPrompt_en: "bus stop",
    inventorySealRepair_pa: "ਬੱਸ ਅੱਡਾ ਸੜਕ ਦੇ ਸਾਹਮਣੇ ਹੈ।",
    inventorySealRepair_roman: "bas adda sarak de sahmane hai.",
    inventorySealRepair_en: "The bus stop is across the street.",
    explanation_vi: "InventorySeal giữ cụm Gurmukhi chính; romanization chỉ hỗ trợ âm.",
    explanation_en: "The inventory seal keeps the Gurmukhi phrase primary; romanization only supports sound.",
    inventorySealCheck: "Confirm the pre-A11 inventory seal preserves the full transit phrase in Gurmukhi.",
    commonTrap: "Guessing bus from context while skipping the Gurmukhi contrast.",
    rejectIf_vi: "Không chấp nhận nếu người học vẫn lẫn ਬ với ਪ.",
    rejectIf_en: "Reject if the learner still confuses ਬ with ਪ.",
    canadaPractical: true,
  },
  {
    id: "inventory-seal-romanization-boundary",
    focus: "romanization-dependence",
    stage: "catalog",
    audience: "both",
    inventorySealId: "romanization-support-only-inventory-seal",
    sourceArtifactIds: ["catalog-romanization-boundary", "bundle-romanization-boundary"],
    learnerPrompt_pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਹਰਾਓ।",
    learnerPrompt_roman: "kirpa karke hauli duhrao.",
    learnerPrompt_en: "Please repeat slowly.",
    inventorySealRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਹੌਲੀ ਕਹੋ।",
    inventorySealRepair_roman: "kirpa karke dubara hauli kaho.",
    inventorySealRepair_en: "Please say it again slowly.",
    explanation_vi: "InventorySeal xác nhận Gurmukhi là dòng đọc chính, không phải romanization.",
    explanation_en: "The inventory seal confirms Gurmukhi is the reading line, not romanization.",
    inventorySealCheck: "Confirm the catalog inventory seal keeps romanization as support only.",
    commonTrap: "Memorizing Latin spelling and losing the Gurmukhi sentence.",
    rejectIf_vi: "Không chấp nhận nếu romanization trở thành nội dung chính.",
    rejectIf_en: "Reject if romanization becomes the primary content.",
    canadaPractical: true,
  },
  {
    id: "inventory-seal-shahmukhi-awareness",
    focus: "romanization-dependence",
    stage: "pre-integration",
    audience: "en",
    inventorySealId: "shahmukhi-awareness-boundary-inventory-seal",
    sourceArtifactIds: ["catalog-shahmukhi-awareness", "bundle-shahmukhi-awareness"],
    learnerPrompt_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਵਰਤਦੇ ਹਾਂ।",
    learnerPrompt_roman: "asi gurmukhi vartde haan.",
    learnerPrompt_en: "We use Gurmukhi.",
    inventorySealRepair_pa: "ਇਹ ਗੁਰਮੁਖੀ ਅਭਿਆਸ ਹੈ।",
    inventorySealRepair_roman: "ih gurmukhi abhyas hai.",
    inventorySealRepair_en: "This is Gurmukhi practice.",
    explanation_vi: "Shahmukhi chỉ là nhận biết hệ chữ khác, không phải khóa học đầy đủ.",
    explanation_en: "Shahmukhi is only awareness of another script, not a full course.",
    inventorySealCheck: "Confirm the pre-integration inventory seal keeps Shahmukhi bounded to awareness.",
    commonTrap: "Expanding an awareness note into a separate Shahmukhi path.",
    rejectIf_vi: "Không chấp nhận nếu mục này mở thành giáo trình Shahmukhi.",
    rejectIf_en: "Reject if this item opens into a Shahmukhi syllabus.",
  },
  {
    id: "inventory-seal-word-order-appointment",
    focus: "word-order",
    stage: "bundle",
    audience: "both",
    inventorySealId: "appointment-time-order-inventory-seal",
    sourceArtifactIds: ["catalog-word-order-appointment", "bundle-word-order-appointment"],
    learnerPrompt_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    learnerPrompt_roman: "meri appointment kede vele hai?",
    learnerPrompt_en: "What time is my appointment?",
    inventorySealRepair_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    inventorySealRepair_roman: "meri appointment kede vele hai?",
    inventorySealRepair_en: "What time is my appointment?",
    explanation_vi: "InventorySeal giữ trật tự Punjabi tự nhiên khi hỏi giờ hẹn.",
    explanation_en: "The inventory seal keeps natural Punjabi order when asking appointment time.",
    inventorySealCheck: "Confirm the bundle inventory seal catches English-style question reordering.",
    commonTrap: "Moving the question words to copy English.",
    rejectIf_vi: "Không chấp nhận nếu câu hỏi sao chép trật tự tiếng Anh.",
    rejectIf_en: "Reject if the question copies English word order.",
    canadaPractical: true,
  },
  {
    id: "inventory-seal-postposition-library",
    focus: "postpositions",
    stage: "pre-integration",
    audience: "en",
    inventorySealId: "library-vich-postposition-inventory-seal",
    sourceArtifactIds: ["catalog-postposition-library", "bundle-postposition-library"],
    learnerPrompt_pa: "ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ",
    learnerPrompt_roman: "library vich",
    learnerPrompt_en: "in the library",
    inventorySealRepair_pa: "ਮੈਂ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਫਾਰਮ ਭਰ ਰਿਹਾ/ਰਹੀ ਹਾਂ।",
    inventorySealRepair_roman: "main library vich form bhar riha/rahi haan.",
    inventorySealRepair_en: "I am filling out the form in the library.",
    explanation_vi: "ਵਿੱਚ là marker vị trí bắt buộc trong câu này.",
    explanation_en: "ਵਿੱਚ is the required location marker in this sentence.",
    inventorySealCheck: "Confirm the pre-integration inventory seal preserves postpositions in location recovery.",
    commonTrap: "Dropping ਵਿੱਚ after thinking of the English preposition in.",
    rejectIf_vi: "Không chấp nhận nếu câu thiếu postposition Punjabi.",
    rejectIf_en: "Reject if the Punjabi postposition is missing.",
    canadaPractical: true,
  },
  {
    id: "inventory-seal-agreement-bank-card",
    focus: "agreement",
    stage: "catalog",
    audience: "both",
    inventorySealId: "bank-card-agreement-inventory-seal",
    sourceArtifactIds: ["catalog-agreement-bank-card", "bundle-agreement-bank-card"],
    learnerPrompt_pa: "ਮੇਰਾ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।",
    learnerPrompt_roman: "mera card gumm giya hai.",
    learnerPrompt_en: "My card is lost.",
    inventorySealRepair_pa: "ਮੇਰਾ ਬੈਂਕ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।",
    inventorySealRepair_roman: "mera bank card gumm giya hai.",
    inventorySealRepair_en: "My bank card is lost.",
    explanation_vi: "InventorySeal giữ ਮੇਰਾ và ਗਿਆ đồng bộ với ਨਾਂਵ trong câu báo mất thẻ.",
    explanation_en: "The inventory seal keeps ਮੇਰਾ and ਗਿਆ aligned with the noun in the lost-card sentence.",
    inventorySealCheck: "Confirm the catalog inventory seal keeps gender and number agreement stable.",
    commonTrap: "Reusing one ending for every noun after memorizing the pattern.",
    rejectIf_vi: "Không chấp nhận nếu agreement đổi ngẫu nhiên khi thêm ਬੈਂਕ.",
    rejectIf_en: "Reject if agreement changes randomly after adding ਬੈਂਕ.",
    canadaPractical: true,
  },
  {
    id: "inventory-seal-register-clinic",
    focus: "register-mismatch",
    stage: "pre-a11-inventory-seal",
    audience: "both",
    inventorySealId: "clinic-polite-register-inventory-seal",
    sourceArtifactIds: ["catalog-register-clinic", "bundle-register-clinic"],
    learnerPrompt_pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨੂੰ ਮਿਲਣਾ ਹੈ।",
    learnerPrompt_roman: "mainu doctor nu milna hai.",
    learnerPrompt_en: "I need to see a doctor.",
    inventorySealRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਕੀ ਡਾਕਟਰ ਅੱਜ ਮਿਲ ਸਕਦੇ ਹਨ?",
    inventorySealRepair_roman: "kirpa karke dasso, ki doctor ajj mil sakde han?",
    inventorySealRepair_en: "Please tell me, can the doctor see me today?",
    explanation_vi: "Ở phòng khám, inventory seal giữ yêu cầu lịch sự và đủ câu.",
    explanation_en: "At a clinic, the inventory seal keeps the request polite and complete.",
    inventorySealCheck: "Confirm the pre-A11 inventory seal keeps service register polite without over-formality.",
    commonTrap: "Sounding abrupt at reception by using a clipped sentence.",
    rejectIf_vi: "Không chấp nhận nếu câu sửa thành mệnh lệnh trống.",
    rejectIf_en: "Reject if the repair becomes a bare command.",
    canadaPractical: true,
  },
  {
    id: "inventory-seal-vietnamese-transfer-form",
    focus: "vietnamese-transfer",
    stage: "bundle",
    audience: "vi",
    inventorySealId: "vi-transfer-form-help-inventory-seal",
    sourceArtifactIds: ["catalog-vietnamese-transfer-form", "bundle-vietnamese-transfer-form"],
    learnerPrompt_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    learnerPrompt_roman: "mainu ih form chahida hai.",
    learnerPrompt_en: "I need this form.",
    inventorySealRepair_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    inventorySealRepair_roman: "mainu ih form bharan vich madad chahidi hai.",
    inventorySealRepair_en: "I need help filling out this form.",
    explanation_vi: "Không dịch từng mảnh từ tiếng Việt; giữ ਇਹ, ਵਿੱਚ, và cụm Punjabi rõ.",
    explanation_en: "Do not translate Vietnamese chunks directly; keep clear Punjabi ਇਹ, ਵਿੱਚ, and phrase shape.",
    inventorySealCheck: "Confirm the bundle inventory seal catches Vietnamese transfer in form-help requests.",
    commonTrap: "Building the Punjabi sentence from Vietnamese word chunks.",
    rejectIf_vi: "Không chấp nhận nếu marker Punjabi biến mất vì dịch từng mảnh.",
    rejectIf_en: "Reject if Punjabi markers disappear through chunk-by-chunk Vietnamese transfer.",
    canadaPractical: true,
  },
  {
    id: "inventory-seal-english-transfer-phone",
    focus: "english-transfer",
    stage: "pre-integration",
    audience: "en",
    inventorySealId: "english-transfer-nu-phone-inventory-seal",
    sourceArtifactIds: ["catalog-english-transfer-phone", "bundle-english-transfer-phone"],
    learnerPrompt_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    learnerPrompt_roman: "ki tusi usnu phone kar sakde ho?",
    learnerPrompt_en: "Can you call him/her?",
    inventorySealRepair_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    inventorySealRepair_roman: "ki tusi usnu phone kar sakde ho?",
    inventorySealRepair_en: "Can you call him/her?",
    explanation_vi: "Punjabi cần ਨੂੰ cho người cụ thể, dù tiếng Anh không có marker tương ứng.",
    explanation_en: "Punjabi needs ਨੂੰ for a specific person even though English has no matching marker.",
    inventorySealCheck: "Confirm the pre-integration inventory seal catches English transfer around ਨੂੰ.",
    commonTrap: "Dropping ਨੂੰ because the English sentence has no visible equivalent.",
    rejectIf_vi: "Không chấp nhận nếu ਉਸਨੂੰ bị rút thành ਉਸ vì ảnh hưởng tiếng Anh.",
    rejectIf_en: "Reject if ਉਸਨੂੰ is reduced to ਉਸ through English transfer.",
    canadaPractical: true,
  },
  {
    id: "inventory-seal-service-phrase-counter",
    focus: "service-phrase-gaps",
    stage: "catalog",
    audience: "both",
    inventorySealId: "full-service-counter-request-inventory-seal",
    sourceArtifactIds: ["catalog-service-phrase-counter", "bundle-service-phrase-counter"],
    learnerPrompt_pa: "ਮਦਦ?",
    learnerPrompt_roman: "madad?",
    learnerPrompt_en: "Help?",
    inventorySealRepair_pa: "ਮਾਫ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?",
    inventorySealRepair_roman: "maaf karna, ki tusi meri madad kar sakde ho?",
    inventorySealRepair_en: "Excuse me, can you help me?",
    explanation_vi: "Ở quầy dịch vụ, inventory seal giữ câu đầy đủ thay vì một từ rời.",
    explanation_en: "At a service counter, the inventory seal keeps a complete sentence instead of one loose word.",
    inventorySealCheck: "Confirm the catalog inventory seal includes complete service phrases.",
    commonTrap: "Using one emergency word for every routine service interaction.",
    rejectIf_vi: "Không chấp nhận nếu câu sửa vẫn chỉ là một từ.",
    rejectIf_en: "Reject if the repair is still only one word.",
    canadaPractical: true,
  },
  {
    id: "inventory-seal-canada-practical-pharmacy",
    focus: "canada-practical-recovery",
    stage: "pre-a11-inventory-seal",
    audience: "both",
    inventorySealId: "pharmacy-refill-recovery-inventory-seal",
    sourceArtifactIds: ["catalog-canada-practical-pharmacy", "bundle-canada-practical-pharmacy"],
    learnerPrompt_pa: "ਮੇਰੀ ਦਵਾਈ ਮੁੱਕ ਗਈ ਹੈ।",
    learnerPrompt_roman: "meri davai mukk gai hai.",
    learnerPrompt_en: "My medicine has run out.",
    inventorySealRepair_pa: "ਕੀ ਮੈਂ ਫਾਰਮੇਸੀ ਵਿੱਚ ਆਪਣੀ ਦਵਾਈ ਦੁਬਾਰਾ ਲੈ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    inventorySealRepair_roman: "ki main pharmacy vich apni davai dubara lai sakda/sakdi haan?",
    inventorySealRepair_en: "Can I get my medicine again at the pharmacy?",
    explanation_vi: "Tình huống Canada thực tế: inventory seal giữ câu lịch sự, postposition, và agreement.",
    explanation_en: "Canada-practical recovery: the inventory seal keeps the polite question, postposition, and agreement.",
    inventorySealCheck: "Confirm the pre-A11 inventory seal is stable for pharmacy recovery before later integration.",
    commonTrap: "Using English order and dropping ਵਿੱਚ in a pharmacy request.",
    rejectIf_vi: "Không chấp nhận nếu câu chỉ là ghi chú tiếng Anh dịch rời rạc.",
    rejectIf_en: "Reject if the sentence is only a loose translation of an English note.",
    canadaPractical: true,
  },
];

export function punjabiRemediationInventorySealSamplesByFocus(
  focus: PunjabiRemediationInventorySealFocus,
): PunjabiRemediationInventorySealSample[] {
  return punjabiRemediationInventorySealSamples.filter((sample) => sample.focus === focus);
}

export function punjabiRemediationInventorySealSamplesByStage(
  stage: PunjabiRemediationInventorySealStage,
): PunjabiRemediationInventorySealSample[] {
  return punjabiRemediationInventorySealSamples.filter((sample) => sample.stage === stage);
}

export function punjabiRemediationInventorySealSamplesByAudience(
  audience: PunjabiRemediationInventorySealSample["audience"],
): PunjabiRemediationInventorySealSample[] {
  return punjabiRemediationInventorySealSamples.filter((sample) => sample.audience === audience);
}
