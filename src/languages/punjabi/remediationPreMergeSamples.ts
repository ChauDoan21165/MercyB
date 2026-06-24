// Punjabi remediation pre-merge samples for Wave 49. Gurmukhi is primary;
// romanization is support only. These items are study support only, not
// official placement or certification. Native review is deferred. Shahmukhi is
// awareness only, not a full course. This is not A11 integration.

export type PunjabiRemediationPreMergeFocus =
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

export type PunjabiRemediationPreMergeCheck =
  | "pre-merge"
  | "pre-a11-checksum"
  | "runner-readiness"
  | "pre-integration";

export interface PunjabiRemediationPreMergeSample {
  id: string;
  focus: PunjabiRemediationPreMergeFocus;
  checkType: PunjabiRemediationPreMergeCheck;
  audience: "vi" | "en" | "both";
  preMergeRouteId: string;
  sourceArtifactIds: string[];
  prompt_pa: string;
  prompt_roman?: string;
  prompt_en: string;
  stableRepair_pa: string;
  stableRepair_roman?: string;
  stableRepair_en: string;
  learnerExplanation_vi: string;
  learnerExplanation_en: string;
  preMergeCheck: string;
  rejectionSignal_vi: string;
  rejectionSignal_en: string;
  commonTrap: string;
  canadaPractical?: boolean;
}

export const PUNJABI_REMEDIATION_PRE_MERGE_SAMPLES_NOTICE =
  "Wave 49 pre-merge samples only; not A11 integration. Study support only, not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_PRE_MERGE_FOCI: readonly PunjabiRemediationPreMergeFocus[] = [
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

export const PUNJABI_PRE_MERGE_CHECK_TYPES: readonly PunjabiRemediationPreMergeCheck[] = [
  "pre-merge",
  "pre-a11-checksum",
  "runner-readiness",
  "pre-integration",
] as const;

export const punjabiRemediationPreMergeSamples: PunjabiRemediationPreMergeSample[] = [
  {
    id: "premerge-script-bus-stop",
    focus: "script-confusion",
    checkType: "pre-merge",
    audience: "both",
    preMergeRouteId: "script-babba-pappa-bus-stop",
    sourceArtifactIds: ["checksum-script-b-p-transit", "runner-script-b-p-transit"],
    prompt_pa: "ਬੱਸ",
    prompt_roman: "bas",
    prompt_en: "bus",
    stableRepair_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    stableRepair_roman: "bas adda kitthe hai?",
    stableRepair_en: "Where is the bus stop?",
    learnerExplanation_vi: "Đọc chữ Gurmukhi ਬੱਸ trước, rồi dùng cả câu hỏi nơi xe buýt.",
    learnerExplanation_en: "Read the Gurmukhi ਬੱਸ first, then use the full bus-stop question.",
    preMergeCheck: "Confirm pre-merge content keeps ਬ and ਪ contrasts stable.",
    rejectionSignal_vi: "Không chấp nhận nếu người học đoán từ ngữ cảnh mà không đọc chữ.",
    rejectionSignal_en: "Reject if the learner guesses from context without reading the letters.",
    commonTrap: "Treating ਬ and ਪ as interchangeable because romanization hides the contrast.",
    canadaPractical: true,
  },
  {
    id: "premerge-script-vowel-help",
    focus: "script-confusion",
    checkType: "runner-readiness",
    audience: "both",
    preMergeRouteId: "script-vowel-sign-help",
    sourceArtifactIds: ["checksum-script-vowel-service", "runner-script-vowel-service"],
    prompt_pa: "ਕੀ",
    prompt_roman: "ki",
    prompt_en: "question marker/do",
    stableRepair_pa: "ਕੀ ਤੁਹਾਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
    stableRepair_roman: "ki tuhanu madad chahidi hai?",
    stableRepair_en: "Do you need help?",
    learnerExplanation_vi: "Dấu ੀ đổi cách đọc, nên câu trợ giúp phải giữ ਕੀ rõ ràng.",
    learnerExplanation_en: "The ੀ sign changes the reading, so the help question must keep ਕੀ clear.",
    preMergeCheck: "Confirm runner-readiness keeps vowel signs visible in service phrases.",
    rejectionSignal_vi: "Không chấp nhận nếu dấu nguyên âm bị bỏ như trang trí.",
    rejectionSignal_en: "Reject if the vowel sign is skipped as decoration.",
    commonTrap: "Reading only the base consonant and ignoring vowel signs.",
    canadaPractical: true,
  },
  {
    id: "premerge-romanization-support",
    focus: "romanization-dependence",
    checkType: "pre-a11-checksum",
    audience: "both",
    preMergeRouteId: "gurmukhi-first-help",
    sourceArtifactIds: ["checksum-romanization-help", "runner-romanization-help"],
    prompt_pa: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    prompt_roman: "mainu madad chahidi hai.",
    prompt_en: "I need help.",
    stableRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਮਦਦ ਕਰੋ।",
    stableRepair_roman: "kirpa karke mainu madad karo.",
    stableRepair_en: "Please help me.",
    learnerExplanation_vi: "Romanization chỉ giúp kiểm tra âm; dòng chính để học là Gurmukhi.",
    learnerExplanation_en: "Romanization only supports sound checking; the main study line is Gurmukhi.",
    preMergeCheck: "Confirm the pre-A11 checksum keeps Gurmukhi as the primary readable field.",
    rejectionSignal_vi: "Không chấp nhận nếu bài học bắt đầu bằng romanization thay vì Gurmukhi.",
    rejectionSignal_en: "Reject if the lesson starts from romanization instead of Gurmukhi.",
    commonTrap: "Memorizing romanization and never mapping it back to Gurmukhi.",
    canadaPractical: true,
  },
  {
    id: "premerge-shahmukhi-awareness",
    focus: "romanization-dependence",
    checkType: "pre-integration",
    audience: "en",
    preMergeRouteId: "shahmukhi-awareness-boundary",
    sourceArtifactIds: ["checksum-shahmukhi-awareness", "runner-shahmukhi-awareness"],
    prompt_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਪੜ੍ਹਦੇ ਹਾਂ।",
    prompt_roman: "asi gurmukhi parhde haan.",
    prompt_en: "We study Gurmukhi.",
    stableRepair_pa: "ਇਹ ਗੁਰਮੁਖੀ ਅਭਿਆਸ ਹੈ।",
    stableRepair_roman: "ih gurmukhi abhyas hai.",
    stableRepair_en: "This is Gurmukhi practice.",
    learnerExplanation_vi: "Shahmukhi chỉ được nhắc để nhận biết hệ chữ khác, không mở khóa riêng.",
    learnerExplanation_en: "Shahmukhi is mentioned only for awareness of another script, not as a separate course.",
    preMergeCheck: "Confirm pre-integration text does not expand Shahmukhi into a full course.",
    rejectionSignal_vi: "Không chấp nhận nếu mục này biến thành giáo trình Shahmukhi.",
    rejectionSignal_en: "Reject if this item turns into a Shahmukhi syllabus.",
    commonTrap: "Letting a script-awareness note become a second course path.",
  },
  {
    id: "premerge-word-order-appointment",
    focus: "word-order",
    checkType: "pre-merge",
    audience: "both",
    preMergeRouteId: "canada-appointment-time",
    sourceArtifactIds: ["checksum-word-order-appointment", "runner-word-order-appointment"],
    prompt_pa: "ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    prompt_roman: "kede vele hai?",
    prompt_en: "what time is it?",
    stableRepair_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    stableRepair_roman: "meri appointment kede vele hai?",
    stableRepair_en: "What time is my appointment?",
    learnerExplanation_vi: "Giữ cụm giờ ở vị trí tự nhiên của Punjabi khi hỏi lịch hẹn.",
    learnerExplanation_en: "Keep the time phrase in natural Punjabi position when asking about an appointment.",
    preMergeCheck: "Confirm pre-merge data catches English-style question order.",
    rejectionSignal_vi: "Không chấp nhận nếu câu hỏi sao chép trật tự tiếng Anh.",
    rejectionSignal_en: "Reject if the question copies English word order.",
    commonTrap: "Moving every question word to match English.",
    canadaPractical: true,
  },
  {
    id: "premerge-postposition-office",
    focus: "postpositions",
    checkType: "pre-integration",
    audience: "en",
    preMergeRouteId: "postposition-office-vich",
    sourceArtifactIds: ["checksum-postposition-location-office", "runner-postposition-location-office"],
    prompt_pa: "ਦਫ਼ਤਰ ਵਿੱਚ",
    prompt_roman: "daftar vich",
    prompt_en: "in the office",
    stableRepair_pa: "ਦਫ਼ਤਰ ਵਿੱਚ ਮਦਦ ਮਿਲੇਗੀ।",
    stableRepair_roman: "daftar vich madad milegi.",
    stableRepair_en: "Help will be available in the office.",
    learnerExplanation_vi: "Trong Punjabi, marker vị trí như ਵਿੱਚ đi sau danh từ.",
    learnerExplanation_en: "In Punjabi, a location marker like ਵਿੱਚ comes after the noun.",
    preMergeCheck: "Confirm pre-integration keeps noun plus postposition order.",
    rejectionSignal_vi: "Không chấp nhận nếu đặt marker trước danh từ theo tiếng Anh.",
    rejectionSignal_en: "Reject if the marker is placed before the noun like English.",
    commonTrap: "Translating 'in the office' word by word into preposition order.",
    canadaPractical: true,
  },
  {
    id: "premerge-agreement-book",
    focus: "agreement",
    checkType: "pre-a11-checksum",
    audience: "both",
    preMergeRouteId: "agreement-library-book",
    sourceArtifactIds: ["checksum-agreement-library-book", "runner-agreement-library-book"],
    prompt_pa: "ਕਿਤਾਬ",
    prompt_roman: "kitab",
    prompt_en: "book",
    stableRepair_pa: "ਇਹ ਕਿਤਾਬ ਨਵੀਂ ਹੈ।",
    stableRepair_roman: "ih kitab navin hai.",
    stableRepair_en: "This book is new.",
    learnerExplanation_vi: "ਕਿਤਾਬ là danh từ giống cái, nên tính từ dùng ਨਵੀਂ.",
    learnerExplanation_en: "ਕਿਤਾਬ is feminine, so the adjective uses ਨਵੀਂ.",
    preMergeCheck: "Confirm the pre-A11 checksum preserves gender agreement.",
    rejectionSignal_vi: "Không chấp nhận nếu tính từ không khớp với ਕਿਤਾਬ.",
    rejectionSignal_en: "Reject if the adjective does not agree with ਕਿਤਾਬ.",
    commonTrap: "Using one adjective form for every noun.",
    canadaPractical: true,
  },
  {
    id: "premerge-agreement-forms",
    focus: "agreement",
    checkType: "runner-readiness",
    audience: "vi",
    preMergeRouteId: "agreement-forms-number",
    sourceArtifactIds: ["runner-agreement-forms", "merge-agreement-form-stack"],
    prompt_pa: "ਫਾਰਮ",
    prompt_roman: "farm",
    prompt_en: "form/forms",
    stableRepair_pa: "ਇਹ ਫਾਰਮ ਭਰੇ ਹੋਏ ਹਨ।",
    stableRepair_roman: "ih farm bhare hoe han.",
    stableRepair_en: "These forms are filled out.",
    learnerExplanation_vi: "Tiếng Việt không đổi theo số nhiều, nhưng Punjabi cần khớp với nhiều biểu mẫu.",
    learnerExplanation_en: "Vietnamese does not mark plural agreement this way, but Punjabi must match multiple forms.",
    preMergeCheck: "Confirm runner-readiness keeps plural agreement for service paperwork.",
    rejectionSignal_vi: "Không chấp nhận nếu dùng dạng số ít cho nhiều biểu mẫu.",
    rejectionSignal_en: "Reject if a singular form is used for multiple forms.",
    commonTrap: "Carrying Vietnamese no-plural habit into Punjabi agreement.",
    canadaPractical: true,
  },
  {
    id: "premerge-register-request",
    focus: "register-mismatch",
    checkType: "pre-merge",
    audience: "both",
    preMergeRouteId: "register-polite-service-request",
    sourceArtifactIds: ["merge-register-service-window", "runner-register-service-window"],
    prompt_pa: "ਦੇ",
    prompt_roman: "de",
    prompt_en: "give",
    stableRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਫਾਰਮ ਦੇ ਸਕਦੇ ਹੋ?",
    stableRepair_roman: "kirpa karke ih farm de sakde ho?",
    stableRepair_en: "Could you please give this form?",
    learnerExplanation_vi: "Ở quầy dịch vụ, thêm ਕਿਰਪਾ ਕਰਕੇ và ਸਕਦੇ ਹੋ để giữ giọng lịch sự.",
    learnerExplanation_en: "At a service counter, add ਕਿਰਪਾ ਕਰਕੇ and ਸਕਦੇ ਹੋ to keep the request polite.",
    preMergeCheck: "Confirm pre-merge samples do not flatten polite service register.",
    rejectionSignal_vi: "Không chấp nhận nếu câu nghe như mệnh lệnh trống.",
    rejectionSignal_en: "Reject if the line sounds like a bare command.",
    commonTrap: "Using the shortest verb form in a formal service setting.",
    canadaPractical: true,
  },
  {
    id: "premerge-transfer-vietnamese-subject",
    focus: "vietnamese-transfer",
    checkType: "runner-readiness",
    audience: "vi",
    preMergeRouteId: "vietnamese-transfer-need-help",
    sourceArtifactIds: ["checksum-transfer-vietnamese-help", "merge-vietnamese-subject-final"],
    prompt_pa: "ਮਦਦ ਚਾਹੀਦੀ ਹੈ",
    prompt_roman: "madad chahidi hai",
    prompt_en: "need help",
    stableRepair_pa: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    stableRepair_roman: "mainu madad chahidi hai.",
    stableRepair_en: "I need help.",
    learnerExplanation_vi: "Đừng bỏ ਮੈਨੂੰ; Punjabi cần đánh dấu người cần giúp trong câu này.",
    learnerExplanation_en: "Do not drop ਮੈਨੂੰ; Punjabi needs the person needing help marked here.",
    preMergeCheck: "Confirm runner-readiness blocks Vietnamese subject-dropping transfer.",
    rejectionSignal_vi: "Không chấp nhận nếu câu thiếu người cần giúp.",
    rejectionSignal_en: "Reject if the sentence omits who needs help.",
    commonTrap: "Dropping the experiencer because Vietnamese context often carries it.",
    canadaPractical: true,
  },
  {
    id: "premerge-transfer-english-account",
    focus: "english-transfer",
    checkType: "pre-integration",
    audience: "en",
    preMergeRouteId: "english-transfer-bank-account",
    sourceArtifactIds: ["checksum-transfer-english-bank", "merge-canada-bank-account"],
    prompt_pa: "ਖਾਤਾ ਖੋਲ੍ਹਣਾ",
    prompt_roman: "khata kholna",
    prompt_en: "open an account",
    stableRepair_pa: "ਮੈਨੂੰ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਹੈ।",
    stableRepair_roman: "mainu khata kholna hai.",
    stableRepair_en: "I need to open an account.",
    learnerExplanation_vi: "Câu Punjabi dùng khung ਮੈਨੂੰ ... ਹੈ, không cần sao chép từng chữ tiếng Anh.",
    learnerExplanation_en: "The Punjabi line uses the ਮੈਨੂੰ ... ਹੈ frame and does not need word-for-word English.",
    preMergeCheck: "Confirm pre-integration catches direct English request transfer.",
    rejectionSignal_vi: "Không chấp nhận nếu câu giữ nhịp 'I need to' từng chữ.",
    rejectionSignal_en: "Reject if the line keeps the word-for-word 'I need to' rhythm.",
    commonTrap: "Translating every English function word into the bank request.",
    canadaPractical: true,
  },
  {
    id: "premerge-service-library",
    focus: "service-phrase-gaps",
    checkType: "pre-a11-checksum",
    audience: "both",
    preMergeRouteId: "service-phrase-library-available",
    sourceArtifactIds: ["checksum-service-phrase-gaps", "merge-service-library-open"],
    prompt_pa: "ਲਾਇਬ੍ਰੇਰੀ",
    prompt_roman: "library",
    prompt_en: "library",
    stableRepair_pa: "ਕੀ ਇਹ ਕਿਤਾਬ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਹੈ?",
    stableRepair_roman: "ki ih kitab library vich hai?",
    stableRepair_en: "Is this book in the library?",
    learnerExplanation_vi: "Một từ dịch vụ chưa đủ; cần cả câu dùng được tại thư viện.",
    learnerExplanation_en: "A service noun is not enough; keep a usable library sentence.",
    preMergeCheck: "Confirm the pre-A11 checksum includes complete service phrases.",
    rejectionSignal_vi: "Không chấp nhận nếu chỉ còn danh từ rời.",
    rejectionSignal_en: "Reject if only the isolated noun remains.",
    commonTrap: "Learning place nouns without practical service questions.",
    canadaPractical: true,
  },
  {
    id: "premerge-canada-clinic",
    focus: "canada-practical-recovery",
    checkType: "pre-merge",
    audience: "both",
    preMergeRouteId: "canada-clinic-directions",
    sourceArtifactIds: ["checksum-canada-recovery-clinic", "runner-canada-recovery-clinic"],
    prompt_pa: "ਮੁਆਫ਼ ਕਰਨਾ",
    prompt_roman: "maaf karna",
    prompt_en: "sorry / excuse me",
    stableRepair_pa: "ਮੁਆਫ਼ ਕਰਨਾ, ਕਲੀਨਿਕ ਕਿੱਥੇ ਹੈ?",
    stableRepair_roman: "maaf karna, clinic kitthe hai?",
    stableRepair_en: "Excuse me, where is the clinic?",
    learnerExplanation_vi: "Ở Canada, câu phục hồi nên nối lời xin lỗi với yêu cầu cụ thể.",
    learnerExplanation_en: "In Canada, a recovery line should connect the apology to a specific request.",
    preMergeCheck: "Confirm pre-merge recovery remains practical for clinic directions.",
    rejectionSignal_vi: "Không chấp nhận nếu chỉ xin lỗi mà không hỏi điều cần thiết.",
    rejectionSignal_en: "Reject if the learner only apologizes and does not ask for what they need.",
    commonTrap: "Stopping at apology instead of adding the real request.",
    canadaPractical: true,
  },
];

export const punjabiRemediationPreMergeSamplesByFocus = (focus: PunjabiRemediationPreMergeFocus) =>
  punjabiRemediationPreMergeSamples.filter((sample) => sample.focus === focus);

export const punjabiRemediationPreMergeSamplesByContext = (
  audience: PunjabiRemediationPreMergeSample["audience"],
) => punjabiRemediationPreMergeSamples.filter((sample) => sample.audience === audience);

export default punjabiRemediationPreMergeSamples;
