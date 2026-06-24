// Punjabi remediation pre-A11-checksum samples for Wave 48. Gurmukhi is primary;
// romanization is support only. These items are study support only, not
// official placement or certification. Native review is deferred. Shahmukhi is
// awareness only, not a full course. This is not A11 integration.

export type PunjabiRemediationPreA11ChecksumFocus =
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

export type PunjabiRemediationPreA11ChecksumCheck =
  | "pre-a11-checksum"
  | "runner-readiness"
  | "pipeline-readiness"
  | "pre-integration";

export interface PunjabiRemediationPreA11ChecksumSample {
  id: string;
  focus: PunjabiRemediationPreA11ChecksumFocus;
  checkType: PunjabiRemediationPreA11ChecksumCheck;
  audience: "vi" | "en" | "both";
  checksumRouteId: string;
  sourceArtifactIds: string[];
  prompt_pa: string;
  prompt_roman?: string;
  prompt_en: string;
  checksumRepair_pa: string;
  checksumRepair_roman?: string;
  checksumRepair_en: string;
  checksumCriteria_vi: string;
  checksumCriteria_en: string;
  rejectionSignal_vi: string;
  rejectionSignal_en: string;
  checksumCheck: string;
  commonTrap: string;
  canadaPractical?: boolean;
}

export const PUNJABI_REMEDIATION_PRE_A11_CHECKSUM_SAMPLES_NOTICE =
  "Wave 48 pre-A11-checksum samples only; not A11 integration. Study support only, not official placement or certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_PRE_A11_CHECKSUM_FOCI: readonly PunjabiRemediationPreA11ChecksumFocus[] = [
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

export const PUNJABI_PRE_A11_CHECKSUM_CHECK_TYPES: readonly PunjabiRemediationPreA11ChecksumCheck[] = [
  "pre-a11-checksum",
  "runner-readiness",
  "pipeline-readiness",
  "pre-integration",
] as const;

export const punjabiRemediationPreA11ChecksumSamples: PunjabiRemediationPreA11ChecksumSample[] = [
  {
    id: "checksum-script-b-p-transit",
    focus: "script-confusion",
    checkType: "pre-a11-checksum",
    audience: "both",
    checksumRouteId: "route-script-babba-pappa",
    sourceArtifactIds: ["ship-script-b-p-transit", "gonogo-script-b-p-transit"],
    prompt_pa: "ਬੱਸ",
    prompt_roman: "bas",
    prompt_en: "bus",
    checksumRepair_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    checksumRepair_roman: "bas adda kitthe hai?",
    checksumRepair_en: "Where is the bus stand?",
    checksumCriteria_vi: "Chấp nhận khi người học đọc đúng ਬੱਸ và dùng câu hỏi bến xe buýt.",
    checksumCriteria_en: "Accept when the learner reads ਬੱਸ correctly and uses the bus-stand question.",
    rejectionSignal_vi: "Không chấp nhận nếu còn lẫn ਬ với ਪ hoặc chỉ đoán từ ngữ cảnh.",
    rejectionSignal_en: "Reject if ਬ and ਪ are still confused or the learner only guesses from context.",
    checksumCheck: "Confirm the checksum keeps the script contrast stable before A11.",
    commonTrap: "Guessing from transit context instead of reading Gurmukhi.",
    canadaPractical: true,
  },
  {
    id: "checksum-script-vowel-service",
    focus: "script-confusion",
    checkType: "runner-readiness",
    audience: "both",
    checksumRouteId: "route-script-vowel-signs",
    sourceArtifactIds: ["ship-script-vowel-service", "gonogo-script-vowel-help"],
    prompt_pa: "ਕੀ",
    prompt_roman: "ki",
    prompt_en: "question marker/do",
    checksumRepair_pa: "ਕੀ ਤੁਹਾਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
    checksumRepair_roman: "ki tuhanu madad chahidi hai?",
    checksumRepair_en: "Do you need help?",
    checksumCriteria_vi: "Chấp nhận khi dấu ੀ được đọc rõ trong câu hỏi trợ giúp.",
    checksumCriteria_en: "Accept when the ੀ sign is read clearly in the help question.",
    rejectionSignal_vi: "Không chấp nhận nếu dấu nguyên âm bị bỏ qua như dấu trang trí.",
    rejectionSignal_en: "Reject if the vowel sign is skipped as if it were decoration.",
    checksumCheck: "Confirm the checksum verifies vowel signs in service recovery.",
    commonTrap: "Treating vowel signs as decorative marks.",
    canadaPractical: true,
  },
  {
    id: "checksum-romanization-help",
    focus: "romanization-dependence",
    checkType: "pipeline-readiness",
    audience: "both",
    checksumRouteId: "romanization-read-gurmukhi-first",
    sourceArtifactIds: ["ship-romanization-help", "gonogo-romanization-help"],
    prompt_pa: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    prompt_roman: "mainu madad chahidi hai.",
    prompt_en: "I need help.",
    checksumRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਮਦਦ ਕਰੋ।",
    checksumRepair_roman: "kirpa karke mainu madad karo.",
    checksumRepair_en: "Please help me.",
    checksumCriteria_vi: "Chấp nhận khi Gurmukhi là dòng đọc chính và romanization chỉ hỗ trợ.",
    checksumCriteria_en: "Accept when Gurmukhi is the main reading line and romanization is support only.",
    rejectionSignal_vi: "Không chấp nhận nếu người học đọc romanization trước Gurmukhi.",
    rejectionSignal_en: "Reject if the learner reads romanization before Gurmukhi.",
    checksumCheck: "Confirm the checksum preserves Gurmukhi-first reading before integration.",
    commonTrap: "Using romanization as the main reading layer.",
    canadaPractical: true,
  },
  {
    id: "checksum-shahmukhi-awareness",
    focus: "romanization-dependence",
    checkType: "pre-integration",
    audience: "en",
    checksumRouteId: "gurmukhi-shahmukhi-awareness",
    sourceArtifactIds: ["ship-shahmukhi-awareness", "gonogo-shahmukhi-awareness"],
    prompt_pa: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਪੜ੍ਹਦੇ ਹਾਂ।",
    prompt_roman: "asi gurmukhi parhde haan.",
    prompt_en: "We study Gurmukhi.",
    checksumRepair_pa: "ਇਹ ਗੁਰਮੁਖੀ ਅਭਿਆਸ ਹੈ।",
    checksumRepair_roman: "ih gurmukhi abhyas hai.",
    checksumRepair_en: "This is Gurmukhi practice.",
    checksumCriteria_vi: "Chấp nhận khi Shahmukhi chỉ là nhận biết, không phải khóa đầy đủ.",
    checksumCriteria_en: "Accept when Shahmukhi remains awareness only, not a full course.",
    rejectionSignal_vi: "Không chấp nhận nếu nội dung mở thành syllabus Shahmukhi riêng.",
    rejectionSignal_en: "Reject if the content opens into a separate Shahmukhi syllabus.",
    checksumCheck: "Confirm the checksum rejects full-course Shahmukhi wording.",
    commonTrap: "Letting awareness notes become a second script syllabus.",
  },
  {
    id: "checksum-word-order-appointment",
    focus: "word-order",
    checkType: "runner-readiness",
    audience: "both",
    checksumRouteId: "canada-practical-booking-appointment",
    sourceArtifactIds: ["ship-word-order-appointment", "gonogo-word-order-appointment"],
    prompt_pa: "ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    prompt_roman: "kede vele hai?",
    prompt_en: "what time is it?",
    checksumRepair_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਵੇਲੇ ਹੈ?",
    checksumRepair_roman: "meri appointment kede vele hai?",
    checksumRepair_en: "What time is my appointment?",
    checksumCriteria_vi: "Chấp nhận khi câu hỏi giờ hẹn giữ trật tự Punjabi tự nhiên.",
    checksumCriteria_en: "Accept when the appointment time question keeps natural Punjabi order.",
    rejectionSignal_vi: "Không chấp nhận nếu câu hỏi sao chép trật tự tiếng Anh.",
    rejectionSignal_en: "Reject if the question copies English word order.",
    checksumCheck: "Confirm the checksum catches English question-order transfer.",
    commonTrap: "Borrowing English question order.",
    canadaPractical: true,
  },
  {
    id: "checksum-word-order-bank",
    focus: "word-order",
    checkType: "pre-a11-checksum",
    audience: "both",
    checksumRouteId: "canada-practical-open-account",
    sourceArtifactIds: ["ship-word-order-bank", "gonogo-word-order-bank"],
    prompt_pa: "ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ",
    prompt_roman: "khata kholna chahunda/chahundi haan",
    prompt_en: "want to open an account",
    checksumRepair_pa: "ਮੈਂ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।",
    checksumRepair_roman: "main khata kholna chahunda/chahundi haan.",
    checksumRepair_en: "I want to open an account.",
    checksumCriteria_vi: "Chấp nhận khi yêu cầu ngân hàng giữ cụm động từ Punjabi.",
    checksumCriteria_en: "Accept when the banking request keeps Punjabi verb order.",
    rejectionSignal_vi: "Không chấp nhận nếu yêu cầu mở tài khoản quay về trật tự tiếng Anh.",
    rejectionSignal_en: "Reject if the account-opening request reverts to English order.",
    checksumCheck: "Confirm the checksum catches broken bank-request word order.",
    commonTrap: "Copying English request order at the bank counter.",
    canadaPractical: true,
  },
  {
    id: "checksum-postposition-human-nu",
    focus: "postpositions",
    checkType: "pipeline-readiness",
    audience: "both",
    checksumRouteId: "postpositions-nu-human-object",
    sourceArtifactIds: ["ship-postposition-human-nu", "gonogo-postposition-human-nu"],
    prompt_pa: "ਉਸਨੂੰ",
    prompt_roman: "usnu",
    prompt_en: "him/her with ਨੂੰ",
    checksumRepair_pa: "ਕੀ ਤੁਸੀਂ ਉਸਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
    checksumRepair_roman: "ki tusi usnu phone kar sakde ho?",
    checksumRepair_en: "Can you call him/her?",
    checksumCriteria_vi: "Chấp nhận khi ਨੂੰ đánh dấu người cụ thể trong câu nhờ gọi.",
    checksumCriteria_en: "Accept when ਨੂੰ marks the specific person in the call request.",
    rejectionSignal_vi: "Không chấp nhận nếu người học bỏ ਨੂੰ vì ảnh hưởng tiếng Anh.",
    rejectionSignal_en: "Reject if the learner drops ਨੂੰ through English transfer.",
    checksumCheck: "Confirm the checksum catches missing ਨੂੰ in human-object recovery.",
    commonTrap: "Dropping ਨੂੰ because English has no matching marker.",
    canadaPractical: true,
  },
  {
    id: "checksum-postposition-location-office",
    focus: "postpositions",
    checkType: "pre-integration",
    audience: "en",
    checksumRouteId: "postpositions-location-vich",
    sourceArtifactIds: ["ship-postposition-location-office", "gonogo-postposition-location-office"],
    prompt_pa: "ਦਫ਼ਤਰ ਵਿੱਚ",
    prompt_roman: "daftar vich",
    prompt_en: "in the office",
    checksumRepair_pa: "ਦਫ਼ਤਰ ਵਿੱਚ ਮਦਦ ਮਿਲੇਗੀ।",
    checksumRepair_roman: "daftar vich madad milegi.",
    checksumRepair_en: "Help will be available in the office.",
    checksumCriteria_vi: "Chấp nhận khi danh từ + ਵਿੱਚ đúng trong câu văn phòng.",
    checksumCriteria_en: "Accept when noun + ਵਿੱਚ is correct in the office line.",
    rejectionSignal_vi: "Không chấp nhận nếu marker vị trí đặt trước danh từ theo tiếng Anh.",
    rejectionSignal_en: "Reject if the location marker is placed before the noun like English.",
    checksumCheck: "Confirm the checksum preserves noun plus postposition order.",
    commonTrap: "Putting the location marker before the noun like English.",
    canadaPractical: true,
  },
  {
    id: "checksum-agreement-library-book",
    focus: "agreement",
    checkType: "runner-readiness",
    audience: "both",
    checksumRouteId: "agreement-possessive-gender",
    sourceArtifactIds: ["ship-agreement-library-book", "release-agreement-book-library"],
    prompt_pa: "ਮੇਰੀ ਕਿਤਾਬ",
    prompt_roman: "meri kitab",
    prompt_en: "my book",
    checksumRepair_pa: "ਮੇਰੀ ਕਿਤਾਬ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਹੈ।",
    checksumRepair_roman: "meri kitab library vich hai.",
    checksumRepair_en: "My book is in the library.",
    checksumCriteria_vi: "Chấp nhận khi ਮੇਰੀ khớp với ਕਿਤਾਬ trước khi dùng câu thư viện.",
    checksumCriteria_en: "Accept when ਮੇਰੀ agrees with ਕਿਤਾਬ before the library sentence is used.",
    rejectionSignal_vi: "Không chấp nhận nếu người học dùng ਮੇਰਾ cho danh từ giống cái.",
    rejectionSignal_en: "Reject if the learner uses ਮੇਰਾ with the feminine noun.",
    checksumCheck: "Confirm the checksum catches possessive agreement errors.",
    commonTrap: "Choosing possessives by speaker gender.",
    canadaPractical: true,
  },
  {
    id: "checksum-agreement-roti",
    focus: "agreement",
    checkType: "pre-a11-checksum",
    audience: "both",
    checksumRouteId: "agreement-number-roti",
    sourceArtifactIds: ["ship-agreement-roti", "release-agreement-roti"],
    prompt_pa: "ਇੱਕ ਰੋਟੀ",
    prompt_roman: "ikk roti",
    prompt_en: "one roti",
    checksumRepair_pa: "ਮੈਂ ਇੱਕ ਰੋਟੀ ਖਾਣੀ ਹੈ।",
    checksumRepair_roman: "main ikk roti khani hai.",
    checksumRepair_en: "I need to eat one roti.",
    checksumCriteria_vi: "Chấp nhận khi số và giống trong câu thức ăn khớp tự nhiên.",
    checksumCriteria_en: "Accept when number and agreement in the food sentence stay natural.",
    rejectionSignal_vi: "Không chấp nhận nếu động từ và danh từ lệch số/giống.",
    rejectionSignal_en: "Reject if the verb and noun disagree in number or gender.",
    checksumCheck: "Confirm the checksum spots agreement drift in a food-order line.",
    commonTrap: "Forcing English-style singular/plural logic onto Punjabi.",
    canadaPractical: true,
  },
  {
    id: "checksum-register-cafe",
    focus: "register-mismatch",
    checkType: "pipeline-readiness",
    audience: "both",
    checksumRouteId: "register-cafe-polite-order",
    sourceArtifactIds: ["ship-register-cafe", "gonogo-register-cafe"],
    prompt_pa: "ਇਹ ਮੇਰੇ ਲਈ ਹੈ",
    prompt_roman: "ih mere lai hai",
    prompt_en: "this is for me",
    checksumRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਮੇਰੇ ਲਈ ਰੱਖੋ।",
    checksumRepair_roman: "kirpa karke ih mere lai rakho.",
    checksumRepair_en: "Please keep this for me.",
    checksumCriteria_vi: "Chấp nhận khi câu phục hồi giữ giọng lịch sự hơn bản thô.",
    checksumCriteria_en: "Accept when the recovery line keeps a more polite tone than the rough prompt.",
    rejectionSignal_vi: "Không chấp nhận nếu mệnh lệnh thô làm giọng lệch hẳn.",
    rejectionSignal_en: "Reject if a bare command shifts the register too far.",
    checksumCheck: "Confirm the checksum keeps request tone polite in public service.",
    commonTrap: "Using the same blunt tone everywhere.",
    canadaPractical: true,
  },
  {
    id: "checksum-transfer-vietnamese-help",
    focus: "vietnamese-transfer",
    checkType: "runner-readiness",
    audience: "vi",
    checksumRouteId: "transfer-vietnamese-help",
    sourceArtifactIds: ["ship-vietnamese-transfer-help", "gonogo-vietnamese-transfer-help"],
    prompt_pa: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    prompt_roman: "mainu madad chahidi hai.",
    prompt_en: "I need help.",
    checksumRepair_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਮਦਦ ਕਰੋ।",
    checksumRepair_roman: "kirpa karke mainu madad karo.",
    checksumRepair_en: "Please help me.",
    checksumCriteria_vi: "Chấp nhận khi câu Punjabi không còn mô hình từ-vựng hay ngữ pháp tiếng Việt.",
    checksumCriteria_en: "Accept when the Punjabi line no longer carries Vietnamese vocabulary or grammar patterns.",
    rejectionSignal_vi: "Không chấp nhận nếu người học chèn trật tự tiếng Việt vào câu trợ giúp.",
    rejectionSignal_en: "Reject if the learner inserts Vietnamese sentence order into the help line.",
    checksumCheck: "Confirm the checksum blocks Vietnamese transfer in the help phrase.",
    commonTrap: "Keeping Vietnamese word order under Punjabi words.",
    canadaPractical: true,
  },
  {
    id: "checksum-transfer-english-bank",
    focus: "english-transfer",
    checkType: "pre-integration",
    audience: "en",
    checksumRouteId: "transfer-english-bank",
    sourceArtifactIds: ["ship-english-transfer-bank", "gonogo-english-transfer-bank"],
    prompt_pa: "ਮੈਂ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।",
    prompt_roman: "main khata kholna chahunda/chahundi haan.",
    prompt_en: "I want to open an account.",
    checksumRepair_pa: "ਮੈਨੂੰ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਹੈ।",
    checksumRepair_roman: "mainu khata kholna hai.",
    checksumRepair_en: "I need to open an account.",
    checksumCriteria_vi: "Chấp nhận khi câu Punjabi không còn nhịp yêu cầu kiểu tiếng Anh.",
    checksumCriteria_en: "Accept when the Punjabi line no longer carries English request cadence.",
    rejectionSignal_vi: "Không chấp nhận nếu câu nghe như dịch từng chữ từ tiếng Anh.",
    rejectionSignal_en: "Reject if the line sounds like a word-for-word English translation.",
    checksumCheck: "Confirm the checksum removes English transfer from the banking line.",
    commonTrap: "Translating every English function word directly.",
    canadaPractical: true,
  },
  {
    id: "checksum-service-phrase-gaps",
    focus: "service-phrase-gaps",
    checkType: "pre-a11-checksum",
    audience: "both",
    checksumRouteId: "service-phrase-library",
    sourceArtifactIds: ["ship-service-phrase-library", "gonogo-service-phrase-library"],
    prompt_pa: "ਲਾਇਬ੍ਰੇਰੀ",
    prompt_roman: "library",
    prompt_en: "library",
    checksumRepair_pa: "ਕੀ ਇਹ ਕਿਤਾਬ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਹੈ?",
    checksumRepair_roman: "ki ih kitab library vich hai?",
    checksumRepair_en: "Is this book in the library?",
    checksumCriteria_vi: "Chấp nhận khi người học có câu dịch vụ đầy đủ chứ không chỉ một từ rời.",
    checksumCriteria_en: "Accept when the learner has a full service phrase, not just an isolated word.",
    rejectionSignal_vi: "Không chấp nhận nếu chỉ có danh từ dịch vụ mà không có câu dùng được.",
    rejectionSignal_en: "Reject if there is only the service noun and no usable sentence.",
    checksumCheck: "Confirm the checksum supplies a usable service phrase for Canada.",
    commonTrap: "Learning nouns without the full service sentence.",
    canadaPractical: true,
  },
  {
    id: "checksum-canada-recovery-clinic",
    focus: "canada-practical-recovery",
    checkType: "runner-readiness",
    audience: "both",
    checksumRouteId: "canada-practical-clinic-help",
    sourceArtifactIds: ["ship-canada-recovery-clinic", "gonogo-canada-recovery-clinic"],
    prompt_pa: "ਮੁਆਫ਼ ਕਰਨਾ",
    prompt_roman: "maaf karna",
    prompt_en: "sorry / excuse me",
    checksumRepair_pa: "ਮੁਆਫ਼ ਕਰਨਾ, ਕਲੀਨਿਕ ਕਿੱਥੇ ਹੈ?",
    checksumRepair_roman: "maaf karna, clinic kitthe hai?",
    checksumRepair_en: "Excuse me, where is the clinic?",
    checksumCriteria_vi: "Chấp nhận khi câu phục hồi dùng được ngay ở Canada trong tình huống hỏi đường.",
    checksumCriteria_en: "Accept when the recovery line is immediately usable in a Canadian asking-for-directions situation.",
    rejectionSignal_vi: "Không chấp nhận nếu câu chỉ là xin lỗi mà không có yêu cầu thực tế.",
    rejectionSignal_en: "Reject if the line is only an apology and not a practical request.",
    checksumCheck: "Confirm the checksum recovers a serviceable Canada-practical help phrase.",
    commonTrap: "Stopping at apology without the actual request.",
    canadaPractical: true,
  },
];

export const punjabiRemediationPreA11ChecksumSamplesByFocus = (
  focus: PunjabiRemediationPreA11ChecksumFocus,
) => punjabiRemediationPreA11ChecksumSamples.filter((sample) => sample.focus === focus);

export const punjabiRemediationPreA11ChecksumSamplesByContext = (
  audience: PunjabiRemediationPreA11ChecksumSample["audience"],
) => punjabiRemediationPreA11ChecksumSamples.filter((sample) => sample.audience === audience);

export default punjabiRemediationPreA11ChecksumSamples;
