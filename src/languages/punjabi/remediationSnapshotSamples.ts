// Punjabi remediation snapshot samples for Wave 51. Gurmukhi is primary;
// romanization is support only. These items are study support only, not
// official placement or certification. Native review is deferred. Shahmukhi is
// awareness only, not a full course. This is not A11 integration.

export type PunjabiRemediationSnapshotFocus =
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

export type PunjabiRemediationSnapshotStage =
  | "pre-a11-snapshot"
  | "closure-packet"
  | "pre-merge"
  | "pre-integration";

export interface PunjabiRemediationSnapshotSample {
  id: string;
  focus: PunjabiRemediationSnapshotFocus;
  stage: PunjabiRemediationSnapshotStage;
  audience: "vi" | "en" | "both";
  snapshotId: string;
  sourceArtifactIds: string[];
  learnerPrompt_pa: string;
  learnerPrompt_roman?: string;
  learnerPrompt_en: string;
  stableRepair_pa: string;
  stableRepair_roman?: string;
  stableRepair_en: string;
  explanation_vi: string;
  explanation_en: string;
  snapshotCheck: string;
  commonTrap: string;
  rejectIf_vi: string;
  rejectIf_en: string;
  canadaPractical?: boolean;
}

export const PUNJABI_REMEDIATION_SNAPSHOT_NOTICE =
  "Wave 51 remediation snapshot samples only; not A11 integration. Study support only, not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_REMEDIATION_SNAPSHOT_FOCI: readonly PunjabiRemediationSnapshotFocus[] = [
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

export const PUNJABI_REMEDIATION_SNAPSHOT_STAGES: readonly PunjabiRemediationSnapshotStage[] = [
  "pre-a11-snapshot",
  "closure-packet",
  "pre-merge",
  "pre-integration",
] as const;

export const punjabiRemediationSnapshotSamples: PunjabiRemediationSnapshotSample[] = [
  {
    id: "snapshot-script-bus-stop",
    focus: "script-confusion",
    stage: "pre-a11-snapshot",
    audience: "both",
    snapshotId: "script-babba-pappa-transit",
    sourceArtifactIds: ["checksum-script-b-p-transit", "closure-script-stop-counter"],
    learnerPrompt_pa: "ਬੱਸ ਅੱਡਾ",
    learnerPrompt_roman: "bas adda",
    learnerPrompt_en: "bus stop",
    stableRepair_pa: "ਬੱਸ ਅੱਡਾ ਸੜਕ ਦੇ ਸਾਹਮਣੇ ਹੈ।",
    stableRepair_roman: "bas adda sarak de sahmane hai.",
    stableRepair_en: "The bus stop is across the street.",
    explanation_vi: "Đọc cụm Gurmukhi trước; romanization chỉ giúp kiểm tra âm.",
    explanation_en: "Read the Gurmukhi phrase first; romanization only supports sound.",
    snapshotCheck: "Confirm the snapshot keeps the transit phrase readable in Gurmukhi.",
    commonTrap: "Guessing from the English-looking transit context instead of reading ਬੱਸ.",
    rejectIf_vi: "Không chấp nhận nếu người học còn lẫn ਬ với ਪ.",
    rejectIf_en: "Reject if the learner still confuses ਬ with ਪ.",
    canadaPractical: true,
  },
  {
    id: "snapshot-romanization-boundary",
    focus: "romanization-dependence",
    stage: "closure-packet",
    audience: "both",
    snapshotId: "gurmukhi-first-roman-support",
    sourceArtifactIds: ["closure-romanization-boundary", "checksum-romanization-help"],
    learnerPrompt_pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਹਰਾਓ।",
    learnerPrompt_roman: "kirpa karke hauli duhrao.",
    learnerPrompt_en: "Please repeat slowly.",
    stableRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਹੌਲੀ ਕਹੋ।",
    stableRepair_roman: "kirpa karke dubara hauli kaho.",
    stableRepair_en: "Please say it again slowly.",
    explanation_vi: "Romanization là lớp hỗ trợ, không phải dòng học chính.",
    explanation_en: "Romanization is a support layer, not the main learning line.",
    snapshotCheck: "Confirm the closure packet preserves Gurmukhi-first practice.",
    commonTrap: "Practicing the Latin letters and skipping the Gurmukhi line.",
    rejectIf_vi: "Không chấp nhận nếu Gurmukhi bị xem là phụ.",
    rejectIf_en: "Reject if Gurmukhi is treated as secondary.",
    canadaPractical: true,
  },
  {
    id: "snapshot-shahmukhi-awareness",
    focus: "romanization-dependence",
    stage: "pre-integration",
    audience: "en",
    snapshotId: "shahmukhi-awareness-limit",
    sourceArtifactIds: ["closure-shahmukhi-awareness", "checksum-shahmukhi-awareness"],
    learnerPrompt_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਵਰਤਦੇ ਹਾਂ।",
    learnerPrompt_roman: "asi gurmukhi vartde haan.",
    learnerPrompt_en: "We use Gurmukhi.",
    stableRepair_pa: "ਇਹ ਗੁਰਮੁਖੀ ਅਭਿਆਸ ਹੈ।",
    stableRepair_roman: "ih gurmukhi abhyas hai.",
    stableRepair_en: "This is Gurmukhi practice.",
    explanation_vi: "Shahmukhi chỉ là nhận biết hệ chữ khác, không phải khóa học đầy đủ.",
    explanation_en: "Shahmukhi is only awareness of another script, not a full course.",
    snapshotCheck: "Confirm the pre-integration snapshot keeps Shahmukhi bounded to awareness.",
    commonTrap: "Turning a script-awareness note into a second script syllabus.",
    rejectIf_vi: "Không chấp nhận nếu mục này mở thành giáo trình Shahmukhi riêng.",
    rejectIf_en: "Reject if this item opens into a separate Shahmukhi course.",
  },
  {
    id: "snapshot-word-order-appointment",
    focus: "word-order",
    stage: "pre-merge",
    audience: "both",
    snapshotId: "appointment-time-word-order",
    sourceArtifactIds: ["checksum-word-order-appointment", "closure-word-order-pharmacy"],
    learnerPrompt_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    learnerPrompt_roman: "meri appointment kede vele hai?",
    learnerPrompt_en: "What time is my appointment?",
    stableRepair_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    stableRepair_roman: "meri appointment kede vele hai?",
    stableRepair_en: "What time is my appointment?",
    explanation_vi: "Giữ trật tự Punjabi tự nhiên khi hỏi giờ hẹn.",
    explanation_en: "Keep natural Punjabi order when asking appointment time.",
    snapshotCheck: "Confirm the pre-merge snapshot catches English-style question reordering.",
    commonTrap: "Moving words around only because English asks questions that way.",
    rejectIf_vi: "Không chấp nhận nếu câu hỏi sao chép trật tự tiếng Anh.",
    rejectIf_en: "Reject if the question copies English word order.",
    canadaPractical: true,
  },
  {
    id: "snapshot-postposition-library",
    focus: "postpositions",
    stage: "pre-integration",
    audience: "en",
    snapshotId: "library-location-vich",
    sourceArtifactIds: ["checksum-postposition-location-office", "closure-postposition-library"],
    learnerPrompt_pa: "ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ",
    learnerPrompt_roman: "library vich",
    learnerPrompt_en: "in the library",
    stableRepair_pa: "ਮੈਂ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਫਾਰਮ ਭਰ ਰਿਹਾ/ਰਹੀ ਹਾਂ।",
    stableRepair_roman: "main library vich form bhar riha/rahi haan.",
    stableRepair_en: "I am filling out the form in the library.",
    explanation_vi: "ਵਿੱਚ đánh dấu vị trí; không bỏ marker chỉ vì tiếng Anh dùng in.",
    explanation_en: "ਵਿੱਚ marks location; do not drop the marker because English uses in.",
    snapshotCheck: "Confirm the pre-integration snapshot preserves postpositions in location recovery.",
    commonTrap: "Dropping ਵਿੱਚ after translating the English preposition mentally.",
    rejectIf_vi: "Không chấp nhận nếu câu thiếu postposition Punjabi.",
    rejectIf_en: "Reject if the Punjabi postposition is missing.",
    canadaPractical: true,
  },
  {
    id: "snapshot-agreement-bank-card",
    focus: "agreement",
    stage: "closure-packet",
    audience: "both",
    snapshotId: "bank-card-gender-number",
    sourceArtifactIds: ["closure-script-card-number", "checksum-word-order-bank"],
    learnerPrompt_pa: "ਮੇਰਾ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।",
    learnerPrompt_roman: "mera card gumm giya hai.",
    learnerPrompt_en: "My card is lost.",
    stableRepair_pa: "ਮੇਰਾ ਬੈਂਕ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।",
    stableRepair_roman: "mera bank card gumm giya hai.",
    stableRepair_en: "My bank card is lost.",
    explanation_vi: "ਮੇਰਾ ਅਤੇ ਗਿਆ ਨੂੰ ਨਾਂਵ ਨਾਲ ਮਿਲਾ ਕੇ ਰੱਖੋ trong câu báo mất thẻ.",
    explanation_en: "Keep ਮੇਰਾ and ਗਿਆ aligned with the noun in the lost-card sentence.",
    snapshotCheck: "Confirm the closure packet keeps gender and number agreement stable.",
    commonTrap: "Using one memorized ending for every noun.",
    rejectIf_vi: "Không chấp nhận nếu agreement bị đổi ngẫu nhiên sau khi thêm ਬੈਂਕ.",
    rejectIf_en: "Reject if agreement changes randomly after adding ਬੈਂਕ.",
    canadaPractical: true,
  },
  {
    id: "snapshot-register-clinic",
    focus: "register-mismatch",
    stage: "pre-a11-snapshot",
    audience: "both",
    snapshotId: "clinic-polite-service-register",
    sourceArtifactIds: ["closure-service-clinic", "checksum-service-gap-clinic"],
    learnerPrompt_pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨੂੰ ਮਿਲਣਾ ਹੈ।",
    learnerPrompt_roman: "mainu doctor nu milna hai.",
    learnerPrompt_en: "I need to see a doctor.",
    stableRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਕੀ ਡਾਕਟਰ ਅੱਜ ਮਿਲ ਸਕਦੇ ਹਨ?",
    stableRepair_roman: "kirpa karke dasso, ki doctor ajj mil sakde han?",
    stableRepair_en: "Please tell me, can the doctor see me today?",
    explanation_vi: "Trong phòng khám, dùng yêu cầu lịch sự thay vì câu cụt.",
    explanation_en: "At a clinic, use a polite request instead of a clipped sentence.",
    snapshotCheck: "Confirm the snapshot keeps service register polite without over-formality.",
    commonTrap: "Sounding too blunt at a reception desk.",
    rejectIf_vi: "Không chấp nhận nếu câu sửa thành mệnh lệnh trống.",
    rejectIf_en: "Reject if the repair becomes a bare command.",
    canadaPractical: true,
  },
  {
    id: "snapshot-vietnamese-transfer-article",
    focus: "vietnamese-transfer",
    stage: "pre-merge",
    audience: "vi",
    snapshotId: "vi-transfer-no-article-copy",
    sourceArtifactIds: ["premerge-vietnamese-transfer-service", "checksum-vietnamese-transfer-form"],
    learnerPrompt_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    learnerPrompt_roman: "mainu ih form chahida hai.",
    learnerPrompt_en: "I need this form.",
    stableRepair_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    stableRepair_roman: "mainu ih form bharan vich madad chahidi hai.",
    stableRepair_en: "I need help filling out this form.",
    explanation_vi: "Không thêm cấu trúc kiểu tiếng Việt; dùng ਇਹ và postposition Punjabi rõ ràng.",
    explanation_en: "Do not import Vietnamese structure; use clear Punjabi ਇਹ and postposition marking.",
    snapshotCheck: "Confirm the pre-merge snapshot catches Vietnamese transfer in form-help requests.",
    commonTrap: "Translating Vietnamese word chunks directly into Punjabi.",
    rejectIf_vi: "Không chấp nhận nếu câu Punjabi mất marker vì dịch từng mảnh từ tiếng Việt.",
    rejectIf_en: "Reject if Punjabi markers disappear through chunk-by-chunk Vietnamese transfer.",
    canadaPractical: true,
  },
  {
    id: "snapshot-english-transfer-phone",
    focus: "english-transfer",
    stage: "pre-integration",
    audience: "en",
    snapshotId: "english-transfer-phone-call",
    sourceArtifactIds: ["checksum-postposition-human-nu", "closure-english-transfer-phone"],
    learnerPrompt_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    learnerPrompt_roman: "ki tusi usnu phone kar sakde ho?",
    learnerPrompt_en: "Can you call him/her?",
    stableRepair_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    stableRepair_roman: "ki tusi usnu phone kar sakde ho?",
    stableRepair_en: "Can you call him/her?",
    explanation_vi: "Punjabi cần ਨੂੰ cho người cụ thể, dù tiếng Anh không có marker giống vậy.",
    explanation_en: "Punjabi needs ਨੂੰ for a specific person even though English has no matching marker.",
    snapshotCheck: "Confirm the pre-integration snapshot catches English transfer around ਨੂੰ.",
    commonTrap: "Dropping ਨੂੰ because the English sentence does not show it.",
    rejectIf_vi: "Không chấp nhận nếu ਉਸਨੂੰ bị rút thành ਉਸ vì ảnh hưởng tiếng Anh.",
    rejectIf_en: "Reject if ਉਸਨੂੰ is reduced to ਉਸ through English transfer.",
    canadaPractical: true,
  },
  {
    id: "snapshot-service-phrase-recovery",
    focus: "service-phrase-gaps",
    stage: "closure-packet",
    audience: "both",
    snapshotId: "service-counter-full-request",
    sourceArtifactIds: ["closure-service-counter", "checksum-service-gap-counter"],
    learnerPrompt_pa: "ਮਦਦ?",
    learnerPrompt_roman: "madad?",
    learnerPrompt_en: "Help?",
    stableRepair_pa: "ਮਾਫ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?",
    stableRepair_roman: "maaf karna, ki tusi meri madad kar sakde ho?",
    stableRepair_en: "Excuse me, can you help me?",
    explanation_vi: "Ở quầy dịch vụ, dùng câu đầy đủ thay vì một từ rời.",
    explanation_en: "At a service counter, use a complete sentence instead of one loose word.",
    snapshotCheck: "Confirm the closure packet includes complete service phrases.",
    commonTrap: "Relying on a single emergency word for routine service.",
    rejectIf_vi: "Không chấp nhận nếu câu sửa vẫn chỉ là một từ.",
    rejectIf_en: "Reject if the repair is still only one word.",
    canadaPractical: true,
  },
  {
    id: "snapshot-canada-practical-pharmacy",
    focus: "canada-practical-recovery",
    stage: "pre-a11-snapshot",
    audience: "both",
    snapshotId: "pharmacy-refill-recovery",
    sourceArtifactIds: ["closure-word-order-pharmacy", "checksum-service-pharmacy"],
    learnerPrompt_pa: "ਮੇਰੀ ਦਵਾਈ ਮੁੱਕ ਗਈ ਹੈ।",
    learnerPrompt_roman: "meri davai mukk gai hai.",
    learnerPrompt_en: "My medicine has run out.",
    stableRepair_pa: "ਕੀ ਮੈਂ ਫਾਰਮੇਸੀ ਵਿੱਚ ਆਪਣੀ ਦਵਾਈ ਦੁਬਾਰਾ ਲੈ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    stableRepair_roman: "ki main pharmacy vich apni davai dubara lai sakda/sakdi haan?",
    stableRepair_en: "Can I get my medicine again at the pharmacy?",
    explanation_vi: "Tình huống Canada thực tế: giữ câu lịch sự, postposition, và agreement.",
    explanation_en: "Canada-practical recovery: keep the polite question, postposition, and agreement.",
    snapshotCheck: "Confirm the pre-A11 snapshot is useful for pharmacy recovery before later integration.",
    commonTrap: "Using English order and dropping ਵਿੱਚ in a pharmacy request.",
    rejectIf_vi: "Không chấp nhận nếu câu chỉ là ghi chú tiếng Anh được dịch rời rạc.",
    rejectIf_en: "Reject if the sentence is only a loose translation of an English note.",
    canadaPractical: true,
  },
];

export function punjabiRemediationSnapshotSamplesByFocus(
  focus: PunjabiRemediationSnapshotFocus,
): PunjabiRemediationSnapshotSample[] {
  return punjabiRemediationSnapshotSamples.filter((sample) => sample.focus === focus);
}

export function punjabiRemediationSnapshotSamplesByStage(
  stage: PunjabiRemediationSnapshotStage,
): PunjabiRemediationSnapshotSample[] {
  return punjabiRemediationSnapshotSamples.filter((sample) => sample.stage === stage);
}

export function punjabiRemediationSnapshotSamplesByAudience(
  audience: PunjabiRemediationSnapshotSample["audience"],
): PunjabiRemediationSnapshotSample[] {
  return punjabiRemediationSnapshotSamples.filter((sample) => sample.audience === audience);
}
