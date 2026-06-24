// src/languages/punjabi/assessmentRubrics.ts
//
// Punjabi assessment rubrics for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary; romanization appears where useful. Rubrics are
// study support only, not official certification. Native review is deferred.

export type PunjabiAssessmentArea =
  | "script"
  | "vocabulary"
  | "grammar"
  | "functional-communication"
  | "register"
  | "survival-tasks"
  | "workplace-public-service"
  | "remediation-routing";

export type PunjabiAssessmentLevel = "emerging" | "developing" | "proficient";

export interface PunjabiRubricBand {
  level: PunjabiAssessmentLevel;
  descriptor_vi: string;
  descriptor_en: string;
  evidence_pa: string;
  evidence_roman?: string;
  evidence_en: string;
}

export interface PunjabiAssessmentRubric {
  id: string;
  area: PunjabiAssessmentArea;
  title: string;
  learnerTask_vi: string;
  learnerTask_en: string;
  bands: PunjabiRubricBand[];
  feedback_vi: string;
  feedback_en: string;
  commonTraps: string[];
  remediationRoute: string;
  canadaPractical?: boolean;
}

export const PUNJABI_ASSESSMENT_NOTICE =
  "Study support only; not official certification. Native review deferred. Shahmukhi is awareness only, not a full course.";

export const PUNJABI_ASSESSMENT_AREAS: readonly PunjabiAssessmentArea[] = [
  "script",
  "vocabulary",
  "grammar",
  "functional-communication",
  "register",
  "survival-tasks",
  "workplace-public-service",
  "remediation-routing",
] as const;

export const PUNJABI_ASSESSMENT_LEVELS: readonly PunjabiAssessmentLevel[] = [
  "emerging",
  "developing",
  "proficient",
] as const;

const band = (
  level: PunjabiAssessmentLevel,
  descriptor_vi: string,
  descriptor_en: string,
  evidence_pa: string,
  evidence_roman: string,
  evidence_en: string,
): PunjabiRubricBand => ({
  level,
  descriptor_vi,
  descriptor_en,
  evidence_pa,
  evidence_roman,
  evidence_en,
});

export const punjabiAssessmentRubrics: PunjabiAssessmentRubric[] = [
  {
    id: "script-gurmukhi-sign-reading",
    area: "script",
    title: "Gurmukhi sign and short-message reading",
    learnerTask_vi: "Đọc một biển ngắn bằng Gurmukhi và nêu nghĩa chính.",
    learnerTask_en: "Read a short Gurmukhi sign and state the main meaning.",
    bands: [
      band(
        "emerging",
        "Nhận ra vài chữ nhưng đoán nhiều từ romanization hoặc ngữ cảnh.",
        "Recognizes a few letters but guesses heavily from romanization or context.",
        "ਬੱਸ ਅੱਡਾ",
        "bas adda",
        "bus stand",
      ),
      band(
        "developing",
        "Đọc được từ quen thuộc nhưng còn nhầm dấu nguyên âm hoặc phụ âm gần giống.",
        "Reads familiar words but still confuses vowel signs or similar consonants.",
        "ਕਲਿਨਿਕ ਖੁੱਲ੍ਹਾ ਹੈ।",
        "clinic khullha hai.",
        "The clinic is open.",
      ),
      band(
        "proficient",
        "Đọc Gurmukhi trước, dùng romanization chỉ để kiểm tra, và tóm tắt đúng.",
        "Reads Gurmukhi first, uses romanization only to check, and summarizes accurately.",
        "ਦਫ਼ਤਰ ਸੋਮਵਾਰ ਨੂੰ ਬੰਦ ਰਹੇਗਾ।",
        "daftar somvaar nu band rahega.",
        "The office will be closed on Monday.",
      ),
    ],
    feedback_vi: "Nếu vẫn cần romanization trước, quay lại luyện nhận diện chữ và dấu nguyên âm Gurmukhi.",
    feedback_en: "If romanization is still needed first, return to Gurmukhi letter and vowel-sign drills.",
    commonTraps: ["Confusing ਬ/ਪ", "Skipping ੀ or ੁ signs", "Treating Shahmukhi as this course's main script"],
    remediationRoute: "gurmukhi-confusion",
    canadaPractical: true,
  },
  {
    id: "vocabulary-public-service-core",
    area: "vocabulary",
    title: "Public-service vocabulary in context",
    learnerTask_vi: "Giải thích các từ thường gặp trên mẫu đơn hoặc thông báo.",
    learnerTask_en: "Explain common words on forms or notices.",
    bands: [
      band(
        "emerging",
        "Biết một số từ riêng lẻ nhưng không dùng được trong câu dịch vụ.",
        "Knows isolated words but cannot use them in service sentences.",
        "ਪਤਾ",
        "pata",
        "address",
      ),
      band(
        "developing",
        "Hiểu từ chính và đoán được hành động cần làm trong câu ngắn.",
        "Understands the key word and can infer the required action in a short sentence.",
        "ਆਪਣਾ ਪਤਾ ਲਿਖੋ।",
        "aapna pata likho.",
        "Write your address.",
      ),
      band(
        "proficient",
        "Phân biệt từ hành chính gần nghĩa và trả lời được bằng cụm Punjabi phù hợp.",
        "Distinguishes related administrative words and responds with a fitting Punjabi phrase.",
        "ਅਰਜ਼ੀ ਇੱਥੇ ਜਮ੍ਹਾਂ ਕਰੋ।",
        "arzi itthe jamma karo.",
        "Submit the application here.",
      ),
    ],
    feedback_vi: "Luyện từ theo cụm Canada-practical: ਪਤਾ, ਦਸਤਖ਼ਤ, ਅਰਜ਼ੀ, ਜਨਮ ਮਿਤੀ.",
    feedback_en: "Practice Canada-practical chunks: ਪਤਾ, ਦਸਤਖ਼ਤ, ਅਰਜ਼ੀ, ਜਨਮ ਮਿਤੀ.",
    commonTraps: ["Memorizing English glosses without Punjabi use", "Confusing ਪਤਾ with appointment details"],
    remediationRoute: "public-service-context",
    canadaPractical: true,
  },
  {
    id: "grammar-postpositions-and-order",
    area: "grammar",
    title: "Postpositions and Punjabi clause order",
    learnerTask_vi: "Sắp xếp câu có hậu giới từ và động từ cuối.",
    learnerTask_en: "Order a sentence with a postposition and final verb.",
    bands: [
      band(
        "emerging",
        "Dùng trật tự Anh/Việt, đặt hậu giới từ trước danh từ hoặc động từ quá sớm.",
        "Uses English/Vietnamese order, placing the postposition before the noun or the verb too early.",
        "ਵਿੱਚ ਕਮਰਾ ਮੈਂ ਹਾਂ",
        "vich kamra main haan",
        "incorrect order for 'I am in the room'",
      ),
      band(
        "developing",
        "Đặt được phần lớn câu nhưng còn thiếu dạng postposition hoặc trợ động từ cuối.",
        "Gets most of the sentence order but still misses the postposition form or final auxiliary.",
        "ਮੈਂ ਕਮਰਾ ਵਿੱਚ ਹਾਂ।",
        "main kamra vich haan.",
        "I am in the room, with form issues.",
      ),
      band(
        "proficient",
        "Dùng danh từ + hậu giới từ và giữ động từ/trợ động từ ở cuối mệnh đề.",
        "Uses noun + postposition and keeps the verb/auxiliary at the end of the clause.",
        "ਮੈਂ ਕਮਰੇ ਵਿੱਚ ਹਾਂ।",
        "main kamre vich haan.",
        "I am in the room.",
      ),
    ],
    feedback_vi: "Chấm theo hai điểm: hậu giới từ sau danh từ và cụm động từ ở cuối.",
    feedback_en: "Score two things: postposition after the noun and the verb phrase at the end.",
    commonTraps: ["English preposition order", "Vietnamese SVO transfer", "Dropping ਨੂੰ with people"],
    remediationRoute: "postpositions",
  },
  {
    id: "grammar-gender-number-agreement",
    area: "grammar",
    title: "Gender and number agreement",
    learnerTask_vi: "Chọn dạng sở hữu/tính từ/động từ phù hợp với danh từ.",
    learnerTask_en: "Choose the possessive, adjective, or verb form that matches the noun.",
    bands: [
      band(
        "emerging",
        "Dùng một dạng cố định như ਮੇਰਾ hoặc ਚੰਗਾ cho mọi danh từ.",
        "Uses one fixed form such as ਮੇਰਾ or ਚੰਗਾ for every noun.",
        "ਮੇਰਾ ਕਿਤਾਬ",
        "mera kitaab",
        "incorrect 'my book'",
      ),
      band(
        "developing",
        "Đúng với cụm quen thuộc nhưng chưa ổn định khi đổi số hoặc đổi danh từ.",
        "Correct with familiar chunks but unstable when number or noun changes.",
        "ਚੰਗਾ ਮੁੰਡੇ",
        "changa munde",
        "partly incorrect 'good boys'",
      ),
      band(
        "proficient",
        "Điều chỉnh được sở hữu, tính từ, và dạng động từ trong câu quen thuộc.",
        "Adjusts possessives, adjectives, and verb forms in familiar sentences.",
        "ਮੇਰੀ ਕਿਤਾਬ ਮੇਜ਼ ਤੇ ਹੈ।",
        "meri kitaab mez te hai.",
        "My book is on the table.",
      ),
    ],
    feedback_vi: "Nếu sai, định tuyến sang luyện cụm: ਮੇਰੀ ਕਿਤਾਬ, ਚੰਗੇ ਮੁੰਡੇ, ਰੋਟੀ ਖਾਧੀ.",
    feedback_en: "If incorrect, route to chunk drills: ਮੇਰੀ ਕਿਤਾਬ, ਚੰਗੇ ਮੁੰਡੇ, ਰੋਟੀ ਖਾਧੀ.",
    commonTraps: ["English 'my' flattening", "Vietnamese no-gender transfer", "Changing noun but not adjective"],
    remediationRoute: "gender-number-agreement",
  },
  {
    id: "functional-communication-help-request",
    area: "functional-communication",
    title: "Clear help request",
    learnerTask_vi: "Nói bạn cần giúp đỡ và nêu vấn đề ngắn gọn.",
    learnerTask_en: "Say that you need help and state the problem briefly.",
    bands: [
      band(
        "emerging",
        "Chỉ nêu danh từ hoặc dùng tiếng Anh xen vào, người nghe phải đoán nhu cầu.",
        "Only names a noun or inserts English, so the listener must guess the need.",
        "ਮਦਦ",
        "madad",
        "help",
      ),
      band(
        "developing",
        "Nói được nhu cầu chính nhưng thiếu chi tiết hoặc hậu giới từ quan trọng.",
        "States the main need but lacks detail or an important postposition.",
        "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
        "mainu madad chahidi hai.",
        "I need help.",
      ),
      band(
        "proficient",
        "Nêu nhu cầu, bối cảnh, và câu hỏi tiếp theo rõ ràng.",
        "States the need, context, and follow-up question clearly.",
        "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
        "mainu ih form bharan vich madad chahidi hai.",
        "I need help filling out this form.",
      ),
    ],
    feedback_vi: "Ưu tiên khả năng người nghe hiểu và hành động, không chấm phát âm/audio.",
    feedback_en: "Prioritize whether the listener can understand and act; no audio or pronunciation scoring.",
    commonTraps: ["Noun-only requests", "Missing ਵਿੱਚ for task context", "Overusing romanization"],
    remediationRoute: "public-service-context",
    canadaPractical: true,
  },
  {
    id: "register-service-counter",
    area: "register",
    title: "Service-counter politeness",
    learnerTask_vi: "Chuyển câu mệnh lệnh thành lời nhờ lịch sự tại quầy dịch vụ.",
    learnerTask_en: "Turn a command into a polite request at a service counter.",
    bands: [
      band(
        "emerging",
        "Dùng mệnh lệnh trống hoặc đại từ quá thân mật với nhân viên.",
        "Uses a bare command or overly intimate pronoun with staff.",
        "ਫਾਰਮ ਦੇ!",
        "form de!",
        "Give the form!",
      ),
      band(
        "developing",
        "Có từ lịch sự nhưng câu còn cứng hoặc thiếu ਜੀ.",
        "Has a polite word but still sounds stiff or lacks ਜੀ.",
        "ਕਿਰਪਾ ਕਰਕੇ ਫਾਰਮ ਦਿਓ।",
        "kirpa karke form dio.",
        "Please give the form.",
      ),
      band(
        "proficient",
        "Dùng ਕਿਰਪਾ ਕਰਕੇ, dạng yêu cầu tự nhiên, và ਜੀ khi phù hợp.",
        "Uses ਕਿਰਪਾ ਕਰਕੇ, a natural request form, and ਜੀ where appropriate.",
        "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਫਾਰਮ ਦੇ ਦਿਓ ਜੀ।",
        "kirpa karke mainu form de dio ji.",
        "Please give me the form.",
      ),
    ],
    feedback_vi: "Nếu dùng ਤੂੰ hoặc mệnh lệnh trống, chuyển sang luyện register và honorifics.",
    feedback_en: "If using ਤੂੰ or bare imperatives, route to register and honorific practice.",
    commonTraps: ["Using ਤੂੰ with staff", "Translating concise English commands too directly"],
    remediationRoute: "register-mismatch",
    canadaPractical: true,
  },
  {
    id: "survival-clinic-appointment",
    area: "survival-tasks",
    title: "Clinic appointment task",
    learnerTask_vi: "Đặt lịch hoặc đổi lịch hẹn với phòng khám.",
    learnerTask_en: "Book or reschedule a clinic appointment.",
    bands: [
      band(
        "emerging",
        "Biết từ ਡਾਕਟਰ nhưng không tạo được yêu cầu hoàn chỉnh.",
        "Knows ਡਾਕਟਰ but cannot form a complete request.",
        "ਡਾਕਟਰ",
        "doctor",
        "doctor",
      ),
      band(
        "developing",
        "Tạo được câu cần lịch hẹn nhưng thiếu thời gian hoặc lịch sự.",
        "Forms a need-for-appointment sentence but lacks time detail or politeness.",
        "ਮੈਨੂੰ ਡਾਕਟਰ ਨਾਲ ਅਪਾਇੰਟਮੈਂਟ ਲੈਣੀ ਹੈ।",
        "mainu doctor naal appointment laini hai.",
        "I need to book an appointment with a doctor.",
      ),
      band(
        "proficient",
        "Nêu nhu cầu, thời gian, và lựa chọn đổi lịch rõ ràng.",
        "States need, time, and rescheduling option clearly.",
        "ਕੀ ਮੈਂ ਆਪਣੀ ਅਪਾਇੰਟਮੈਂਟ ਕੱਲ੍ਹ ਲਈ ਬਦਲ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
        "ki main apni appointment kallh lai badal sakda/sakdi haan?",
        "Can I change my appointment to tomorrow?",
      ),
    ],
    feedback_vi: "Đánh giá theo khả năng hoàn thành nhiệm vụ sinh tồn, không theo chứng chỉ chính thức.",
    feedback_en: "Assess task completion for survival communication, not official certification.",
    commonTraps: ["Only naming the place", "Missing polite question frame", "Confusing ਕੱਲ੍ਹ context"],
    remediationRoute: "public-service-context",
    canadaPractical: true,
  },
  {
    id: "workplace-public-service-form",
    area: "workplace-public-service",
    title: "Workplace or public-service form interaction",
    learnerTask_vi: "Hỏi cách nộp đơn hoặc điền biểu mẫu ở nơi làm việc/dịch vụ công.",
    learnerTask_en: "Ask how to submit an application or complete a form at work/public service.",
    bands: [
      band(
        "emerging",
        "Nhận ra một từ trên biểu mẫu nhưng không hỏi được bước tiếp theo.",
        "Recognizes one form word but cannot ask the next step.",
        "ਅਰਜ਼ੀ",
        "arzi",
        "application",
      ),
      band(
        "developing",
        "Hỏi được câu đơn nhưng thiếu chi tiết như nơi nộp hoặc hạn nộp.",
        "Can ask a simple question but lacks details such as where or when to submit.",
        "ਮੈਂ ਇਹ ਫਾਰਮ ਕਿੱਥੇ ਦੇਣਾ ਹੈ?",
        "main ih form kitthe dena hai?",
        "Where should I give this form?",
      ),
      band(
        "proficient",
        "Hỏi rõ tài liệu, hạn nộp, hoặc bước tiếp theo bằng register phù hợp.",
        "Clearly asks about documents, deadline, or next step with suitable register.",
        "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਇਹ ਅਰਜ਼ੀ ਕਦੋਂ ਤੱਕ ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ?",
        "kirpa karke dasso, ih arzi kadon takk jamma karni hai?",
        "Please tell me, by when must this application be submitted?",
      ),
    ],
    feedback_vi: "Nếu câu thiếu hành động như ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ, chuyển sang luyện ngữ cảnh dịch vụ công.",
    feedback_en: "If the sentence lacks an action such as ਜਮ੍ਹਾਂ ਕਰਨੀ ਹੈ, route to public-service context work.",
    commonTraps: ["Using only English workplace words", "Missing deadline phrase ਕਦੋਂ ਤੱਕ"],
    remediationRoute: "public-service-context",
    canadaPractical: true,
  },
  {
    id: "remediation-routing-error-patterns",
    area: "remediation-routing",
    title: "Route errors to the next study action",
    learnerTask_vi: "Nhìn lỗi của người học và chọn hướng luyện tiếp theo.",
    learnerTask_en: "Look at a learner error and choose the next study route.",
    bands: [
      band(
        "emerging",
        "Chỉ sửa đáp án đúng/sai mà không xác định nguyên nhân lỗi.",
        "Only marks right/wrong without identifying the cause.",
        "ਮੈਂ ਹਾਂ ਵਿਦਿਆਰਥੀ।",
        "main haan vidyarthi.",
        "I am student, wrong order.",
      ),
      band(
        "developing",
        "Xác định được nhóm lỗi lớn nhưng tuyến luyện còn chung chung.",
        "Identifies the broad error family but gives a generic study route.",
        "ਮੈਂ ਵਿਦਿਆਰਥੀ ਹਾਂ।",
        "main vidyarthi haan.",
        "I am a student.",
      ),
      band(
        "proficient",
        "Gắn lỗi với tuyến luyện cụ thể: word order, postpositions, agreement, register, or script.",
        "Maps the error to a specific route: word order, postpositions, agreement, register, or script.",
        "ਰੂਟ: word-order -> ਹਾਂ ਅੰਤ ਵਿੱਚ.",
        "route: word-order -> haan ant vich",
        "Route to word-order remediation.",
      ),
    ],
    feedback_vi: "Rubric này giúp ứng dụng chọn bài sửa lỗi tiếp theo, không phải đánh giá chính thức.",
    feedback_en: "This rubric helps the app choose the next remediation step, not an official evaluation.",
    commonTraps: ["Over-correcting unrelated grammar", "Routing script errors to grammar drills"],
    remediationRoute: "word-order",
  },
  {
    id: "script-romanization-dependence",
    area: "script",
    title: "Romanization dependence check",
    learnerTask_vi: "Đọc câu Gurmukhi khi romanization bị che.",
    learnerTask_en: "Read the Gurmukhi sentence with romanization covered.",
    bands: [
      band(
        "emerging",
        "Không đọc được nếu không thấy romanization trước.",
        "Cannot read unless romanization is visible first.",
        "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
        "mainu madad chahidi hai.",
        "I need help.",
      ),
      band(
        "developing",
        "Đọc được từ quen thuộc nhưng ngập ngừng với dấu nguyên âm hoặc phụ âm thêm dấu.",
        "Reads familiar words but hesitates on vowel signs or marked consonants.",
        "ਫ਼ੋਨ ਕਿੱਥੇ ਹੈ?",
        "phone kitthe hai?",
        "Where is the phone?",
      ),
      band(
        "proficient",
        "Đọc Gurmukhi độc lập rồi dùng romanization chỉ để kiểm tra cuối.",
        "Reads Gurmukhi independently and uses romanization only as a final check.",
        "ਮੈਂ ਫਾਰਮ ਭਰ ਰਿਹਾ/ਰਹੀ ਹਾਂ।",
        "main form bhar riha/rahi haan.",
        "I am filling out the form.",
      ),
    ],
    feedback_vi: "Nếu phụ thuộc romanization, route sang remediation 'romanization-dependence'.",
    feedback_en: "If dependent on romanization, route to romanization-dependence remediation.",
    commonTraps: ["Reading Latin text first", "Assuming romanization spelling is standardized"],
    remediationRoute: "romanization-dependence",
    canadaPractical: true,
  },
];
