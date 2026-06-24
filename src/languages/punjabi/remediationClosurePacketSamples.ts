// Punjabi remediation closure packet samples for Wave 50. Gurmukhi is primary;
// romanization is support only. These items are study support only, not
// official placement or certification. Native review is deferred. Shahmukhi is
// awareness only, not a full course. This is not A11 integration.

export type PunjabiRemediationClosurePacketFocus =
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

export type PunjabiRemediationClosurePacketCheck =
  | "pre-a11-closure"
  | "pre-merge"
  | "ci-readiness"
  | "pre-integration";

export interface PunjabiRemediationClosurePacketSample {
  id: string;
  focus: PunjabiRemediationClosurePacketFocus;
  checkType: PunjabiRemediationClosurePacketCheck;
  audience: "vi" | "en" | "both";
  closurePacketId: string;
  evidenceArtifactIds: string[];
  prompt_pa: string;
  prompt_roman?: string;
  prompt_en: string;
  closureRepair_pa: string;
  closureRepair_roman?: string;
  closureRepair_en: string;
  learnerExplanation_vi: string;
  learnerExplanation_en: string;
  closureCheck: string;
  rejectIf_vi: string;
  rejectIf_en: string;
  commonTrap: string;
  canadaPractical?: boolean;
}

export const PUNJABI_REMEDIATION_CLOSURE_PACKET_NOTICE =
  "Wave 50 closure packet samples only; not A11 integration. Study support only, not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_CLOSURE_PACKET_FOCI: readonly PunjabiRemediationClosurePacketFocus[] = [
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

export const PUNJABI_CLOSURE_PACKET_CHECK_TYPES: readonly PunjabiRemediationClosurePacketCheck[] = [
  "pre-a11-closure",
  "pre-merge",
  "ci-readiness",
  "pre-integration",
] as const;

export const punjabiRemediationClosurePacketSamples: PunjabiRemediationClosurePacketSample[] = [
  {
    id: "closure-script-card-number",
    focus: "script-confusion",
    checkType: "pre-a11-closure",
    audience: "both",
    closurePacketId: "script-card-number-final",
    evidenceArtifactIds: ["premerge-script-card-number", "checksum-script-card-number"],
    prompt_pa: "ਕਾਰਡ",
    prompt_roman: "card",
    prompt_en: "card",
    closureRepair_pa: "ਮੇਰਾ ਕਾਰਡ ਨੰਬਰ ਇੱਥੇ ਹੈ।",
    closureRepair_roman: "mera card number ithe hai.",
    closureRepair_en: "My card number is here.",
    learnerExplanation_vi: "Đọc ਕਾਰਡ bằng Gurmukhi trước khi dùng câu dịch vụ.",
    learnerExplanation_en: "Read ਕਾਰਡ in Gurmukhi before using the service sentence.",
    closureCheck: "Confirm pre-A11 closure keeps the Gurmukhi card term visible.",
    rejectIf_vi: "Không chấp nhận nếu người học chỉ nhận ra chữ Latin card.",
    rejectIf_en: "Reject if the learner only recognizes the Latin word card.",
    commonTrap: "Using English spelling as the cue instead of reading Gurmukhi.",
    canadaPractical: true,
  },
  {
    id: "closure-script-stop-counter",
    focus: "script-confusion",
    checkType: "ci-readiness",
    audience: "both",
    closurePacketId: "script-stop-counter-final",
    evidenceArtifactIds: ["runner-script-bus-stop", "ci-script-stop-counter"],
    prompt_pa: "ਬੱਸ ਅੱਡਾ",
    prompt_roman: "bas adda",
    prompt_en: "bus stop",
    closureRepair_pa: "ਬੱਸ ਅੱਡਾ ਸੜਕ ਦੇ ਸਾਹਮਣੇ ਹੈ।",
    closureRepair_roman: "bas adda sarak de sahmane hai.",
    closureRepair_en: "The bus stop is across the street.",
    learnerExplanation_vi: "ਬੱਸ ਅੱਡਾ là cụm Gurmukhi chính; romanization chỉ hỗ trợ âm.",
    learnerExplanation_en: "ਬੱਸ ਅੱਡਾ is the primary Gurmukhi phrase; romanization only supports sound.",
    closureCheck: "Confirm CI-readiness keeps the full transit phrase intact.",
    rejectIf_vi: "Không chấp nhận nếu cụm bị rút xuống một từ đoán mò.",
    rejectIf_en: "Reject if the phrase is reduced to a guessed single word.",
    commonTrap: "Reading the first familiar letter and skipping the rest of the phrase.",
    canadaPractical: true,
  },
  {
    id: "closure-romanization-boundary",
    focus: "romanization-dependence",
    checkType: "pre-merge",
    audience: "both",
    closurePacketId: "gurmukhi-first-roman-support",
    evidenceArtifactIds: ["premerge-romanization-support", "checksum-gurmukhi-first"],
    prompt_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਹਰਾਓ।",
    prompt_roman: "kirpa karke duhrao.",
    prompt_en: "Please repeat.",
    closureRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਹਰਾਓ।",
    closureRepair_roman: "kirpa karke hauli duhrao.",
    closureRepair_en: "Please repeat slowly.",
    learnerExplanation_vi: "Romanization giúp kiểm tra âm, nhưng câu đóng gói phải bắt đầu từ Gurmukhi.",
    learnerExplanation_en: "Romanization helps check sound, but the closure packet must start from Gurmukhi.",
    closureCheck: "Confirm pre-merge closure does not make romanization the learning source.",
    rejectIf_vi: "Không chấp nhận nếu dòng Gurmukhi bị xem là phụ.",
    rejectIf_en: "Reject if the Gurmukhi line is treated as secondary.",
    commonTrap: "Practicing only romanization and losing the script link.",
    canadaPractical: true,
  },
  {
    id: "closure-shahmukhi-awareness",
    focus: "romanization-dependence",
    checkType: "pre-integration",
    audience: "en",
    closurePacketId: "shahmukhi-awareness-limit",
    evidenceArtifactIds: ["premerge-shahmukhi-awareness", "closure-script-boundary"],
    prompt_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਵਰਤਦੇ ਹਾਂ।",
    prompt_roman: "asi gurmukhi vartde haan.",
    prompt_en: "We use Gurmukhi.",
    closureRepair_pa: "ਇਹ ਗੁਰਮੁਖੀ ਪਾਠ ਹੈ।",
    closureRepair_roman: "ih gurmukhi path hai.",
    closureRepair_en: "This is a Gurmukhi lesson.",
    learnerExplanation_vi: "Shahmukhi chỉ là nhận biết hệ chữ khác, không phải khóa học riêng.",
    learnerExplanation_en: "Shahmukhi is only awareness of another script, not a separate course.",
    closureCheck: "Confirm pre-integration closure keeps Shahmukhi as awareness only.",
    rejectIf_vi: "Không chấp nhận nếu mục này mở rộng thành giáo trình Shahmukhi.",
    rejectIf_en: "Reject if this item expands into a Shahmukhi syllabus.",
    commonTrap: "Turning a boundary note into a second script path.",
  },
  {
    id: "closure-word-order-pharmacy",
    focus: "word-order",
    checkType: "pre-a11-closure",
    audience: "both",
    closurePacketId: "word-order-pharmacy-time",
    evidenceArtifactIds: ["premerge-word-order-appointment", "closure-pharmacy-time"],
    prompt_pa: "ਫਾਰਮੇਸੀ ਕਦੋਂ ਖੁੱਲ੍ਹਦੀ ਹੈ?",
    prompt_roman: "pharmacy kadon khulhdi hai?",
    prompt_en: "When does the pharmacy open?",
    closureRepair_pa: "ਫਾਰਮੇਸੀ ਕਦੋਂ ਖੁੱਲ੍ਹਦੀ ਹੈ?",
    closureRepair_roman: "pharmacy kadon khulhdi hai?",
    closureRepair_en: "When does the pharmacy open?",
    learnerExplanation_vi: "Giữ trật tự Punjabi tự nhiên khi hỏi giờ mở cửa.",
    learnerExplanation_en: "Keep natural Punjabi order when asking opening time.",
    closureCheck: "Confirm pre-A11 closure catches English-style question reordering.",
    rejectIf_vi: "Không chấp nhận nếu câu bị kéo theo trật tự tiếng Anh.",
    rejectIf_en: "Reject if the sentence is pulled into English word order.",
    commonTrap: "Moving question words only because English does it.",
    canadaPractical: true,
  },
  {
    id: "closure-postposition-library",
    focus: "postpositions",
    checkType: "pre-integration",
    audience: "en",
    closurePacketId: "postposition-library-vich",
    evidenceArtifactIds: ["premerge-postposition-office", "closure-library-location"],
    prompt_pa: "ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ",
    prompt_roman: "library vich",
    prompt_en: "in the library",
    closureRepair_pa: "ਮੈਂ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਉਡੀਕ ਕਰਾਂਗਾ।",
    closureRepair_roman: "main library vich udik karanga.",
    closureRepair_en: "I will wait in the library.",
    learnerExplanation_vi: "ਵਿੱਚ đi sau ਲਾਇਬ੍ਰੇਰੀ; đừng đặt marker trước danh từ.",
    learnerExplanation_en: "ਵਿੱਚ follows ਲਾਇਬ੍ਰੇਰੀ; do not place the marker before the noun.",
    closureCheck: "Confirm pre-integration closure preserves noun plus postposition order.",
    rejectIf_vi: "Không chấp nhận nếu dùng trật tự như giới từ tiếng Anh.",
    rejectIf_en: "Reject if it uses English preposition order.",
    commonTrap: "Translating 'in the library' word by word.",
    canadaPractical: true,
  },
  {
    id: "closure-agreement-card",
    focus: "agreement",
    checkType: "ci-readiness",
    audience: "both",
    closurePacketId: "agreement-health-card",
    evidenceArtifactIds: ["checksum-agreement-card", "closure-health-card"],
    prompt_pa: "ਹੈਲਥ ਕਾਰਡ",
    prompt_roman: "health card",
    prompt_en: "health card",
    closureRepair_pa: "ਮੇਰਾ ਹੈਲਥ ਕਾਰਡ ਨਵਾਂ ਹੈ।",
    closureRepair_roman: "mera health card nava hai.",
    closureRepair_en: "My health card is new.",
    learnerExplanation_vi: "ਕਾਰਡ giống đực trong câu này, nên dùng ਮੇਰਾ và ਨਵਾਂ.",
    learnerExplanation_en: "ਕਾਰਡ is masculine here, so use ਮੇਰਾ and ਨਵਾਂ.",
    closureCheck: "Confirm CI-readiness keeps gender agreement in service ID phrases.",
    rejectIf_vi: "Không chấp nhận nếu tính từ hoặc sở hữu từ không khớp.",
    rejectIf_en: "Reject if the adjective or possessive does not agree.",
    commonTrap: "Reusing one agreement pattern for every document noun.",
    canadaPractical: true,
  },
  {
    id: "closure-agreement-documents",
    focus: "agreement",
    checkType: "pre-merge",
    audience: "vi",
    closurePacketId: "agreement-documents-plural",
    evidenceArtifactIds: ["runner-agreement-forms", "closure-documents-plural"],
    prompt_pa: "ਦਸਤਾਵੇਜ਼",
    prompt_roman: "dastavez",
    prompt_en: "documents",
    closureRepair_pa: "ਮੇਰੇ ਦਸਤਾਵੇਜ਼ ਤਿਆਰ ਹਨ।",
    closureRepair_roman: "mere dastavez tiar han.",
    closureRepair_en: "My documents are ready.",
    learnerExplanation_vi: "Tiếng Việt không đổi nhiều ở số nhiều, nhưng Punjabi cần ਮੇਰੇ và ਹਨ.",
    learnerExplanation_en: "Vietnamese does not mark plural this way, but Punjabi needs ਮੇਰੇ and ਹਨ.",
    closureCheck: "Confirm pre-merge closure keeps plural agreement in paperwork lines.",
    rejectIf_vi: "Không chấp nhận nếu dùng dạng số ít cho nhiều giấy tờ.",
    rejectIf_en: "Reject if singular agreement is used for multiple documents.",
    commonTrap: "Letting Vietnamese no-plural transfer hide Punjabi agreement.",
    canadaPractical: true,
  },
  {
    id: "closure-register-window",
    focus: "register-mismatch",
    checkType: "pre-a11-closure",
    audience: "both",
    closurePacketId: "register-service-window-politeness",
    evidenceArtifactIds: ["premerge-register-request", "closure-register-window"],
    prompt_pa: "ਮੈਨੂੰ ਇਹ ਚਾਹੀਦਾ ਹੈ।",
    prompt_roman: "mainu ih chahida hai.",
    prompt_en: "I need this.",
    closureRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਦੇ ਸਕਦੇ ਹੋ?",
    closureRepair_roman: "kirpa karke mainu ih farm de sakde ho?",
    closureRepair_en: "Could you please give me this form?",
    learnerExplanation_vi: "Ở quầy dịch vụ, thêm ਕਿਰਪਾ ਕਰਕੇ và ਸਕਦੇ ਹੋ để giữ lịch sự.",
    learnerExplanation_en: "At a service window, add ਕਿਰਪਾ ਕਰਕੇ and ਸਕਦੇ ਹੋ for politeness.",
    closureCheck: "Confirm pre-A11 closure does not ship bare commands for service settings.",
    rejectIf_vi: "Không chấp nhận nếu câu nghe như ra lệnh.",
    rejectIf_en: "Reject if the sentence sounds like an order.",
    commonTrap: "Using the shortest possible request in a formal setting.",
    canadaPractical: true,
  },
  {
    id: "closure-transfer-vietnamese-address",
    focus: "vietnamese-transfer",
    checkType: "ci-readiness",
    audience: "vi",
    closurePacketId: "vietnamese-transfer-address-marker",
    evidenceArtifactIds: ["closure-address-canada", "ci-transfer-vietnamese-address"],
    prompt_pa: "ਮੇਰਾ ਪਤਾ",
    prompt_roman: "mera pata",
    prompt_en: "my address",
    closureRepair_pa: "ਮੇਰਾ ਪਤਾ ਇਸ ਫਾਰਮ ਵਿੱਚ ਹੈ।",
    closureRepair_roman: "mera pata is farm vich hai.",
    closureRepair_en: "My address is on this form.",
    learnerExplanation_vi: "Đừng bỏ marker ਵਿੱਚ; Punjabi cần marker vị trí sau ਫਾਰਮ.",
    learnerExplanation_en: "Do not drop ਵਿੱਚ; Punjabi needs the location marker after ਫਾਰਮ.",
    closureCheck: "Confirm CI-readiness blocks Vietnamese-style missing location markers.",
    rejectIf_vi: "Không chấp nhận nếu câu thiếu marker vị trí.",
    rejectIf_en: "Reject if the sentence lacks the location marker.",
    commonTrap: "Relying on context and leaving out Punjabi postpositions.",
    canadaPractical: true,
  },
  {
    id: "closure-transfer-english-bank",
    focus: "english-transfer",
    checkType: "pre-integration",
    audience: "en",
    closurePacketId: "english-transfer-bank-request",
    evidenceArtifactIds: ["premerge-transfer-english-account", "closure-bank-request"],
    prompt_pa: "ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਹੈ",
    prompt_roman: "khata kholna hai",
    prompt_en: "need to open an account",
    closureRepair_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਹੈ।",
    closureRepair_roman: "mainu bank khata kholna hai.",
    closureRepair_en: "I need to open a bank account.",
    learnerExplanation_vi: "Punjabi dùng khung ਮੈਨੂੰ ... ਹੈ thay vì sao chép từng chữ tiếng Anh.",
    learnerExplanation_en: "Punjabi uses the ਮੈਨੂੰ ... ਹੈ frame instead of copying every English word.",
    closureCheck: "Confirm pre-integration closure catches word-for-word English transfer.",
    rejectIf_vi: "Không chấp nhận nếu câu giữ cấu trúc tiếng Anh từng chữ.",
    rejectIf_en: "Reject if the line keeps word-for-word English structure.",
    commonTrap: "Translating every English function word into the Punjabi request.",
    canadaPractical: true,
  },
  {
    id: "closure-service-clinic",
    focus: "service-phrase-gaps",
    checkType: "pre-a11-closure",
    audience: "both",
    closurePacketId: "service-clinic-complete-request",
    evidenceArtifactIds: ["premerge-canada-clinic", "closure-service-clinic"],
    prompt_pa: "ਕਲੀਨਿਕ",
    prompt_roman: "clinic",
    prompt_en: "clinic",
    closureRepair_pa: "ਕੀ ਕਲੀਨਿਕ ਅੱਜ ਖੁੱਲ੍ਹਾ ਹੈ?",
    closureRepair_roman: "ki clinic ajj khulha hai?",
    closureRepair_en: "Is the clinic open today?",
    learnerExplanation_vi: "Một danh từ chưa đủ; cần câu hỏi dùng được ở Canada.",
    learnerExplanation_en: "A noun is not enough; keep a question usable in Canada.",
    closureCheck: "Confirm pre-A11 closure includes complete service phrases.",
    rejectIf_vi: "Không chấp nhận nếu chỉ còn từ rời.",
    rejectIf_en: "Reject if only an isolated word remains.",
    commonTrap: "Learning service nouns without a usable request.",
    canadaPractical: true,
  },
  {
    id: "closure-canada-recovery-delay",
    focus: "canada-practical-recovery",
    checkType: "pre-merge",
    audience: "both",
    closurePacketId: "canada-recovery-delay-appointment",
    evidenceArtifactIds: ["closure-recovery-delay", "premerge-word-order-appointment"],
    prompt_pa: "ਮੈਂ ਦੇਰ ਨਾਲ ਆ ਰਿਹਾ ਹਾਂ।",
    prompt_roman: "main der nal aa riha haan.",
    prompt_en: "I am arriving late.",
    closureRepair_pa: "ਮੁਆਫ਼ ਕਰਨਾ, ਮੈਂ ਅਪਾਇੰਟਮੈਂਟ ਲਈ ਦੇਰ ਨਾਲ ਆ ਰਿਹਾ ਹਾਂ।",
    closureRepair_roman: "maaf karna, main appointment lai der nal aa riha haan.",
    closureRepair_en: "Sorry, I am arriving late for the appointment.",
    learnerExplanation_vi: "Câu phục hồi nên nói xin lỗi và nêu rõ lịch hẹn bị trễ.",
    learnerExplanation_en: "A recovery line should apologize and name the delayed appointment.",
    closureCheck: "Confirm pre-merge closure keeps Canada-practical recovery specific.",
    rejectIf_vi: "Không chấp nhận nếu chỉ nói xin lỗi mà không nêu tình huống.",
    rejectIf_en: "Reject if it only apologizes without naming the situation.",
    commonTrap: "Stopping at apology instead of adding the practical detail.",
    canadaPractical: true,
  },
];

export const punjabiRemediationClosurePacketSamplesByFocus = (
  focus: PunjabiRemediationClosurePacketFocus,
) => punjabiRemediationClosurePacketSamples.filter((sample) => sample.focus === focus);

export const punjabiRemediationClosurePacketSamplesByAudience = (
  audience: PunjabiRemediationClosurePacketSample["audience"],
) => punjabiRemediationClosurePacketSamples.filter((sample) => sample.audience === audience);

export default punjabiRemediationClosurePacketSamples;
