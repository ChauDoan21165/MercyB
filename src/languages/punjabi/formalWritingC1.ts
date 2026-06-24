// Punjabi C1 formal writing pack for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught as a
// separate course here. Native review is deferred.
//
// Text data only: no audio, pronunciation scoring, Azure, auth, billing, RLS,
// Supabase, CI config, or unrelated integrations.

export type PunjabiFormalWritingCategory =
  | "formal_email"
  | "complaint"
  | "request"
  | "summary"
  | "argument_paragraph"
  | "application_statement"
  | "public_service_note"
  | "academic_transitions";

export type PunjabiFormalPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiFormalWritingEntry = {
  id: string;
  level: "C1";
  category: PunjabiFormalWritingCategory;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  writing_goal_vi: string;
  writing_goal_en: string;
  register_vi: string;
  register_en: string;
  template_phrases: readonly PunjabiFormalPhrase[];
  canada_example: PunjabiFormalPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
  practice_task_vi: string;
  practice_task_en: string;
};

export const formalWritingScriptAwareness = {
  vi: "Khóa này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết truyền thống chữ viết Punjabi khác, không phải một khóa học đầy đủ.",
  en: "This course uses Gurmukhi as the primary script. Shahmukhi is mentioned only for awareness of another Punjabi writing tradition, not as a full course.",
} as const;

export const formalWritingC1: PunjabiFormalWritingEntry[] = [
  {
    id: "pa_c1_fw_formal_email_advisor",
    level: "C1",
    category: "formal_email",
    title_pa: "ਸਲਾਹਕਾਰ ਨੂੰ ਰਸਮੀ ਈਮੇਲ",
    title_rom: "salahkar nu rasmi email",
    title_vi: "Email trang trọng cho cố vấn",
    title_en: "Formal email to an advisor",
    writing_goal_vi: "Viết email có lời chào, mục đích rõ, yêu cầu cụ thể, và kết thúc lịch sự.",
    writing_goal_en: "Write an email with greeting, clear purpose, specific request, and polite closing.",
    register_vi: "Trang trọng, trực tiếp vừa đủ, dùng ਜੀ và ਕਿਰਪਾ ਕਰਕੇ khi phù hợp.",
    register_en: "Formal, sufficiently direct, using ਜੀ and ਕਿਰਪਾ ਕਰਕੇ where appropriate.",
    template_phrases: [
      {
        pa: "ਸਤਿਕਾਰਯੋਗ ਪ੍ਰੋਫੈਸਰ ਜੀ,",
        rom: "satkaryog professor ji,",
        vi: "Kính gửi Giáo sư,",
        en: "Respected Professor,",
      },
      {
        pa: "ਮੈਂ ਤੁਹਾਨੂੰ ... ਬਾਰੇ ਲਿਖ ਰਿਹਾ/ਰਹੀ ਹਾਂ।",
        rom: "main tuhanu ... bare likh riha/rahi han.",
        vi: "Tôi viết thư cho thầy/cô về...",
        en: "I am writing to you about...",
      },
      {
        pa: "ਜੇ ਸੰਭਵ ਹੋਵੇ, ਕਿਰਪਾ ਕਰਕੇ ... ਤੱਕ ਜਵਾਬ ਦਿਓ।",
        rom: "je sambhav hove, kirpa karke ... takk jawab dio.",
        vi: "Nếu có thể, xin vui lòng trả lời trước...",
        en: "If possible, please respond by...",
      },
    ],
    canada_example: {
      context_vi: "Email cho cố vấn học tập tại một đại học Canada.",
      context_en: "Emailing an academic advisor at a Canadian university.",
      pa: "ਮੈਂ ਤੁਹਾਨੂੰ ਕੈਨੇਡਾ ਵਿੱਚ ਆਪਣੇ ਕੋਰਸ ਚੋਣ ਬਾਰੇ ਲਿਖ ਰਹੀ ਹਾਂ ਅਤੇ ਅਗਲੇ ਹਫ਼ਤੇ ਮਿਲਣ ਦਾ ਸਮਾਂ ਮੰਗਣਾ ਚਾਹੁੰਦੀ ਹਾਂ।",
      rom: "main tuhanu Canada vich apne course chon bare likh rahi han ate agle hafte milan da sama mangna chahundi han.",
      vi: "Tôi viết cho cô về việc chọn môn học ở Canada và muốn xin lịch gặp vào tuần tới.",
      en: "I am writing to you about my course selection in Canada and would like to request a meeting next week.",
    },
    learner_traps_vi: [
      "Đừng viết quá thân mật như nhắn tin cho bạn.",
      "Yêu cầu nên có thời hạn hoặc hành động cụ thể.",
    ],
    learner_traps_en: [
      "Do not write as casually as a message to a friend.",
      "A request should include a specific action or deadline.",
    ],
    practice_task_vi: "Viết email 120 từ xin lịch gặp cố vấn về kế hoạch học kỳ.",
    practice_task_en: "Write a 120-word email requesting an advisor meeting about a semester plan.",
  },
  {
    id: "pa_c1_fw_complaint_service",
    level: "C1",
    category: "complaint",
    title_pa: "ਸੇਵਾ ਬਾਰੇ ਸ਼ਿਕਾਇਤ",
    title_rom: "seva bare shikayat",
    title_vi: "Thư khiếu nại về dịch vụ",
    title_en: "Complaint about a service",
    writing_goal_vi: "Nêu vấn đề, bằng chứng, tác động, và yêu cầu giải quyết mà vẫn giữ giọng chuyên nghiệp.",
    writing_goal_en: "State problem, evidence, impact, and requested resolution while keeping a professional tone.",
    register_vi: "Lịch sự nhưng chắc chắn; tránh xúc phạm cá nhân.",
    register_en: "Polite but firm; avoid personal insults.",
    template_phrases: [
      {
        pa: "ਮੈਂ ... ਸੇਵਾ ਬਾਰੇ ਆਪਣੀ ਚਿੰਤਾ ਦਰਜ ਕਰਵਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।",
        rom: "main ... seva bare apni chinta darj karvauna chahunda/chahundi han.",
        vi: "Tôi muốn ghi nhận mối quan ngại của mình về dịch vụ...",
        en: "I would like to register my concern about the ... service.",
      },
      {
        pa: "ਸਮੱਸਿਆ ਦਾ ਪ੍ਰਭਾਵ ਇਹ ਹੋਇਆ ਕਿ ...",
        rom: "samasya da prabhav ih hoia ki ...",
        vi: "Tác động của vấn đề là...",
        en: "The impact of the problem was that...",
      },
      {
        pa: "ਮੈਂ ਬੇਨਤੀ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿ ਇਸ ਮਾਮਲੇ ਦੀ ਸਮੀਖਿਆ ਕੀਤੀ ਜਾਵੇ।",
        rom: "main benati karda/kardi han ki is mamle di samikhia kiti jave.",
        vi: "Tôi đề nghị vấn đề này được xem xét.",
        en: "I request that this matter be reviewed.",
      },
    ],
    canada_example: {
      context_vi: "Khiếu nại về dịch vụ nhà ở sinh viên tại Canada.",
      context_en: "Complaining about student housing service in Canada.",
      pa: "ਮੈਂ ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਨਿਵਾਸ ਸੇਵਾ ਬਾਰੇ ਆਪਣੀ ਚਿੰਤਾ ਦਰਜ ਕਰਵਾਉਣਾ ਚਾਹੁੰਦਾ ਹਾਂ, ਕਿਉਂਕਿ ਮੁਰੰਮਤ ਦੀ ਬੇਨਤੀ ਤਿੰਨ ਹਫ਼ਤਿਆਂ ਤੋਂ ਅਧੂਰੀ ਹੈ।",
      rom: "main Canada vich vidyarthi nivas seva bare apni chinta darj karvauna chahunda han, kyonki murammat di benati tinn haftian ton adhuri hai.",
      vi: "Tôi muốn ghi nhận quan ngại về dịch vụ ký túc xá sinh viên ở Canada vì yêu cầu sửa chữa đã ba tuần chưa hoàn tất.",
      en: "I would like to register my concern about student residence service in Canada because the repair request has been incomplete for three weeks.",
    },
    learner_traps_vi: [
      "Đừng chỉ phàn nàn; hãy nêu cách giải quyết mong muốn.",
      "Không dùng giọng đe dọa nếu mục tiêu là giải quyết hành chính.",
    ],
    learner_traps_en: [
      "Do not only complain; state the resolution you want.",
      "Avoid threatening language when the goal is administrative resolution.",
    ],
    practice_task_vi: "Viết thư khiếu nại 150 từ về dịch vụ bị chậm.",
    practice_task_en: "Write a 150-word complaint about a delayed service.",
  },
  {
    id: "pa_c1_fw_request_extension",
    level: "C1",
    category: "request",
    title_pa: "ਮਿਆਦ ਵਧਾਉਣ ਦੀ ਬੇਨਤੀ",
    title_rom: "miad vadhaun di benati",
    title_vi: "Yêu cầu gia hạn",
    title_en: "Requesting an extension",
    writing_goal_vi: "Xin gia hạn với lý do ngắn, trách nhiệm cá nhân, và mốc mới rõ ràng.",
    writing_goal_en: "Request an extension with a brief reason, personal responsibility, and clear new date.",
    register_vi: "Khiêm tốn, có trách nhiệm, không đổ lỗi quá dài.",
    register_en: "Humble, responsible, without a long excuse.",
    template_phrases: [
      {
        pa: "ਮੈਂ ਮਿਆਦ ਵਿੱਚ ਵਾਧੇ ਦੀ ਨਿਮਰ ਬੇਨਤੀ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ।",
        rom: "main miad vich vadhe di nimar benati karda/kardi han.",
        vi: "Tôi kính đề nghị được gia hạn thời hạn.",
        en: "I respectfully request an extension of the deadline.",
      },
      {
        pa: "ਮੈਂ ਇਸ ਦੇਰੀ ਲਈ ਆਪਣੀ ਜ਼ਿੰਮੇਵਾਰੀ ਸਮਝਦਾ/ਸਮਝਦੀ ਹਾਂ।",
        rom: "main is deri lai apni zimmedari samjhda/samjhdi han.",
        vi: "Tôi hiểu trách nhiệm của mình đối với sự chậm trễ này.",
        en: "I understand my responsibility for this delay.",
      },
      {
        pa: "ਮੈਂ ਕੰਮ ... ਤੱਕ ਪੂਰਾ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।",
        rom: "main kam ... takk pura kar sakda/sakdi han.",
        vi: "Tôi có thể hoàn thành công việc trước...",
        en: "I can complete the work by...",
      },
    ],
    canada_example: {
      context_vi: "Xin gia hạn bài tập tại một cao đẳng Canada.",
      context_en: "Requesting an assignment extension at a Canadian college.",
      pa: "ਮੈਂ ਕੈਨੇਡਾ ਦੇ ਆਪਣੇ ਕਾਲਜ ਕੋਰਸ ਲਈ ਅਸਾਈਨਮੈਂਟ ਦੀ ਮਿਆਦ ਵਿੱਚ ਦੋ ਦਿਨਾਂ ਦੇ ਵਾਧੇ ਦੀ ਨਿਮਰ ਬੇਨਤੀ ਕਰਦੀ ਹਾਂ।",
      rom: "main Canada de apne college course lai assignment di miad vich do dinan de vadhe di nimar benati kardi han.",
      vi: "Tôi kính đề nghị được gia hạn hai ngày cho bài tập trong khóa học cao đẳng của mình ở Canada.",
      en: "I respectfully request a two-day extension for the assignment in my Canadian college course.",
    },
    learner_traps_vi: [
      "Đừng viết lý do quá dài làm mất trọng tâm yêu cầu.",
      "Luôn đề xuất ngày hoàn thành mới.",
    ],
    learner_traps_en: [
      "Do not make the reason so long that the request loses focus.",
      "Always propose a new completion date.",
    ],
    practice_task_vi: "Viết email xin gia hạn 80-100 từ với ngày mới cụ thể.",
    practice_task_en: "Write an 80-100 word extension request with a specific new date.",
  },
  {
    id: "pa_c1_fw_summary_report",
    level: "C1",
    category: "summary",
    title_pa: "ਰਿਪੋਰਟ ਦਾ ਰਸਮੀ ਸਾਰ",
    title_rom: "report da rasmi saar",
    title_vi: "Tóm tắt báo cáo trang trọng",
    title_en: "Formal report summary",
    writing_goal_vi: "Tóm tắt mục tiêu, phát hiện chính, và hàm ý mà không thêm chi tiết thừa.",
    writing_goal_en: "Summarize aim, main findings, and implications without excess detail.",
    register_vi: "Trung lập, nén thông tin, tránh nhận xét cảm tính.",
    register_en: "Neutral, compressed, avoiding emotional commentary.",
    template_phrases: [
      {
        pa: "ਰਿਪੋਰਟ ਦਾ ਮੁੱਖ ਉਦੇਸ਼ ... ਦੀ ਸਮੀਖਿਆ ਕਰਨਾ ਹੈ।",
        rom: "report da mukh udesh ... di samikhia karna hai.",
        vi: "Mục tiêu chính của báo cáo là xem xét...",
        en: "The main aim of the report is to review...",
      },
      {
        pa: "ਮੁੱਖ ਨਤੀਜੇ ਦੱਸਦੇ ਹਨ ਕਿ ...",
        rom: "mukh natije dassde han ki ...",
        vi: "Các kết quả chính cho thấy rằng...",
        en: "The main findings show that...",
      },
      {
        pa: "ਇਸ ਦਾ ਅਰਥ ਹੈ ਕਿ ਅਗਲੇ ਕਦਮਾਂ ਵਿੱਚ ... ਲੋੜੀਂਦਾ ਹੈ।",
        rom: "is da arth hai ki agle kadman vich ... lorinda hai.",
        vi: "Điều này có nghĩa là trong các bước tiếp theo cần...",
        en: "This means that the next steps require...",
      },
    ],
    canada_example: {
      context_vi: "Tóm tắt báo cáo về hỗ trợ sinh viên ở Canada.",
      context_en: "Summarizing a report about student support in Canada.",
      pa: "ਰਿਪੋਰਟ ਦਾ ਮੁੱਖ ਉਦੇਸ਼ ਕੈਨੇਡਾ ਵਿੱਚ ਨਵੇਂ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਸਹਾਇਤਾ ਸੇਵਾਵਾਂ ਦੀ ਸਮੀਖਿਆ ਕਰਨਾ ਹੈ।",
      rom: "report da mukh udesh Canada vich nave vidyarthian lai sahaita sevavan di samikhia karna hai.",
      vi: "Mục tiêu chính của báo cáo là xem xét các dịch vụ hỗ trợ cho sinh viên mới ở Canada.",
      en: "The main aim of the report is to review support services for new students in Canada.",
    },
    learner_traps_vi: [
      "Không tóm tắt theo thứ tự từng câu của nguồn; nhóm ý theo chức năng.",
      "Không thêm ý kiến riêng nếu nhiệm vụ chỉ yêu cầu summary.",
    ],
    learner_traps_en: [
      "Do not summarize source sentence by sentence; group ideas by function.",
      "Do not add personal opinion if the task asks only for a summary.",
    ],
    practice_task_vi: "Tóm tắt một báo cáo giả định trong 4 câu.",
    practice_task_en: "Summarize a hypothetical report in four sentences.",
  },
  {
    id: "pa_c1_fw_argument_paragraph",
    level: "C1",
    category: "argument_paragraph",
    title_pa: "ਦਲੀਲੀ ਪੈਰਾ",
    title_rom: "daleeli paira",
    title_vi: "Đoạn văn lập luận",
    title_en: "Argument paragraph",
    writing_goal_vi: "Viết đoạn có câu chủ đề, bằng chứng, phân tích, và câu kết nối lại luận điểm.",
    writing_goal_en: "Write a paragraph with topic sentence, evidence, analysis, and link back.",
    register_vi: "Học thuật, có điều kiện, tránh khẳng định quá mức.",
    register_en: "Academic, qualified, avoiding overstatement.",
    template_phrases: [
      {
        pa: "ਇਸ ਪੈਰੇ ਦੀ ਮੁੱਖ ਦਲੀਲ ਇਹ ਹੈ ਕਿ ...",
        rom: "is paire di mukh daleel ih hai ki ...",
        vi: "Luận điểm chính của đoạn này là...",
        en: "The main argument of this paragraph is that...",
      },
      {
        pa: "ਇਸ ਦਲੀਲ ਲਈ ਇੱਕ ਮਹੱਤਵਪੂਰਨ ਸਬੂਤ ... ਹੈ।",
        rom: "is daleel lai ikk mahatvapuran sabut ... hai.",
        vi: "Một bằng chứng quan trọng cho lập luận này là...",
        en: "One important piece of evidence for this argument is...",
      },
      {
        pa: "ਇਸ ਲਈ, ਇਹ ਗੱਲ ਵੱਡੀ ਦਲੀਲ ਨੂੰ ਮਜ਼ਬੂਤ ਕਰਦੀ ਹੈ।",
        rom: "is lai, ih gall vaddi daleel nu mazbut kardi hai.",
        vi: "Vì vậy, điều này củng cố lập luận lớn hơn.",
        en: "Therefore, this point strengthens the broader argument.",
      },
    ],
    canada_example: {
      context_vi: "Đoạn lập luận về giao thông công cộng ở Canada.",
      context_en: "Argument paragraph about public transport in Canada.",
      pa: "ਇਸ ਪੈਰੇ ਦੀ ਮੁੱਖ ਦਲੀਲ ਇਹ ਹੈ ਕਿ ਕੈਨੇਡਾ ਦੇ ਵੱਡੇ ਸ਼ਹਿਰਾਂ ਵਿੱਚ ਆਵਾਜਾਈ ਵਿਦਿਆਰਥੀ ਸਫ਼ਲਤਾ ਨਾਲ ਜੁੜੀ ਹੋਈ ਹੈ।",
      rom: "is paire di mukh daleel ih hai ki Canada de vadde shehran vich aavajai vidyarthi safalta nal judi hoi hai.",
      vi: "Luận điểm chính của đoạn này là giao thông ở các thành phố lớn của Canada có liên quan đến thành công của sinh viên.",
      en: "The main argument of this paragraph is that transit in large Canadian cities is linked to student success.",
    },
    learner_traps_vi: [
      "Một đoạn C1 không nên chỉ có ý kiến; phải có bằng chứng hoặc lý do.",
      "Không kết đoạn bằng ví dụ; hãy kết bằng ý nghĩa của ví dụ.",
    ],
    learner_traps_en: [
      "A C1 paragraph should not be only opinion; it needs evidence or reasoning.",
      "Do not end the paragraph with an example; end with the meaning of the example.",
    ],
    practice_task_vi: "Viết đoạn 5 câu về một yếu tố ảnh hưởng đến thành công học tập.",
    practice_task_en: "Write a five-sentence paragraph about one factor affecting academic success.",
  },
  {
    id: "pa_c1_fw_application_statement",
    level: "C1",
    category: "application_statement",
    title_pa: "ਅਰਜ਼ੀ ਬਿਆਨ",
    title_rom: "arzi biaan",
    title_vi: "Bài/đoạn tuyên bố ứng tuyển",
    title_en: "Application statement",
    writing_goal_vi: "Nêu mục tiêu, kinh nghiệm liên quan, và lý do phù hợp với chương trình hoặc vị trí.",
    writing_goal_en: "State goal, relevant experience, and fit with a program or position.",
    register_vi: "Tự tin nhưng không khoe khoang; cụ thể hơn khẩu hiệu.",
    register_en: "Confident but not boastful; more specific than slogans.",
    template_phrases: [
      {
        pa: "ਮੇਰਾ ਅਕਾਦਮਿਕ ਲਕਸ਼ ... ਹੈ।",
        rom: "mera academic laksh ... hai.",
        vi: "Mục tiêu học thuật của tôi là...",
        en: "My academic goal is...",
      },
      {
        pa: "ਮੇਰੇ ਪਿਛਲੇ ਤਜਰਬੇ ਨੇ ਮੈਨੂੰ ... ਲਈ ਤਿਆਰ ਕੀਤਾ ਹੈ।",
        rom: "mere pichhle tajarbe ne mainu ... lai tiar kita hai.",
        vi: "Kinh nghiệm trước đây đã chuẩn bị cho tôi cho...",
        en: "My previous experience has prepared me for...",
      },
      {
        pa: "ਇਹ ਪ੍ਰੋਗਰਾਮ ਮੇਰੇ ਲਕਸ਼ ਨਾਲ ਇਸ ਲਈ ਜੁੜਦਾ ਹੈ ਕਿਉਂਕਿ ...",
        rom: "ih program mere laksh nal is lai jurda hai kyonki ...",
        vi: "Chương trình này phù hợp với mục tiêu của tôi vì...",
        en: "This program connects with my goal because...",
      },
    ],
    canada_example: {
      context_vi: "Tuyên bố ứng tuyển chương trình sau đại học ở Canada.",
      context_en: "Application statement for a graduate program in Canada.",
      pa: "ਇਹ ਕੈਨੇਡੀਅਨ ਪ੍ਰੋਗਰਾਮ ਮੇਰੇ ਲਕਸ਼ ਨਾਲ ਇਸ ਲਈ ਜੁੜਦਾ ਹੈ ਕਿਉਂਕਿ ਇਹ ਖੋਜ ਅਤੇ ਸਮੁਦਾਇਕ ਅਭਿਆਸ ਦੋਵਾਂ ਨੂੰ ਜੋੜਦਾ ਹੈ।",
      rom: "ih Canadian program mere laksh nal is lai jurda hai kyonki ih khoj ate samudayik abhyaas dovan nu jorda hai.",
      vi: "Chương trình Canada này phù hợp với mục tiêu của tôi vì nó kết hợp nghiên cứu và thực hành cộng đồng.",
      en: "This Canadian program connects with my goal because it combines research and community practice.",
    },
    learner_traps_vi: [
      "Tránh câu chung như 'tôi rất đam mê' nếu không có ví dụ cụ thể.",
      "Không lặp lại CV; giải thích ý nghĩa của kinh nghiệm.",
    ],
    learner_traps_en: [
      "Avoid generic statements like 'I am very passionate' without a concrete example.",
      "Do not repeat the CV; explain the meaning of the experience.",
    ],
    practice_task_vi: "Viết đoạn 130 từ giải thích vì sao bạn phù hợp với một chương trình.",
    practice_task_en: "Write a 130-word paragraph explaining why you fit a program.",
  },
  {
    id: "pa_c1_fw_public_service_note",
    level: "C1",
    category: "public_service_note",
    title_pa: "ਜਨਤਕ ਸੇਵਾ ਨੋਟ",
    title_rom: "jantak seva note",
    title_vi: "Thông báo dịch vụ công",
    title_en: "Public-service note",
    writing_goal_vi: "Viết thông báo ngắn, rõ đối tượng, hành động cần làm, thời gian, và hỗ trợ.",
    writing_goal_en: "Write a short notice with audience, action, timing, and support.",
    register_vi: "Rõ ràng, không vòng vo; lịch sự với người đọc đa dạng.",
    register_en: "Clear, not indirect; polite to a diverse readership.",
    template_phrases: [
      {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਧਿਆਨ ਦਿਓ ਕਿ ...",
        rom: "kirpa karke dhian dio ki ...",
        vi: "Xin lưu ý rằng...",
        en: "Please note that...",
      },
      {
        pa: "ਇਹ ਬਦਲਾਅ ... ਤੋਂ ਲਾਗੂ ਹੋਵੇਗਾ।",
        rom: "ih badlaa ... ton lagu hovega.",
        vi: "Thay đổi này sẽ có hiệu lực từ...",
        en: "This change will take effect from...",
      },
      {
        pa: "ਸਹਾਇਤਾ ਲਈ ... ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
        rom: "sahaita lai ... nal sampark karo.",
        vi: "Để được hỗ trợ, hãy liên hệ...",
        en: "For assistance, contact...",
      },
    ],
    canada_example: {
      context_vi: "Thông báo dịch vụ công cho sinh viên mới ở Canada.",
      context_en: "Public-service note for new students in Canada.",
      pa: "ਕਿਰਪਾ ਕਰਕੇ ਧਿਆਨ ਦਿਓ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਨਵੇਂ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਸਿਹਤ ਬੀਮਾ ਜਾਣਕਾਰੀ ਸੈਸ਼ਨ ਸੋਮਵਾਰ ਨੂੰ ਹੋਵੇਗਾ।",
      rom: "kirpa karke dhian dio ki Canada vich nave vidyarthian lai sehat bima jankari session somvar nu hovega.",
      vi: "Xin lưu ý rằng buổi thông tin bảo hiểm y tế cho sinh viên mới ở Canada sẽ diễn ra vào thứ Hai.",
      en: "Please note that the health insurance information session for new students in Canada will take place on Monday.",
    },
    learner_traps_vi: [
      "Đừng dùng văn quá học thuật trong thông báo dịch vụ; người đọc cần hành động nhanh.",
      "Luôn nêu kênh liên hệ hoặc bước tiếp theo.",
    ],
    learner_traps_en: [
      "Do not use overly academic prose in a service notice; readers need quick action.",
      "Always include a contact channel or next step.",
    ],
    practice_task_vi: "Viết thông báo 90 từ về thay đổi lịch một dịch vụ sinh viên.",
    practice_task_en: "Write a 90-word notice about a change in a student service schedule.",
  },
  {
    id: "pa_c1_fw_transition_contrast",
    level: "C1",
    category: "academic_transitions",
    title_pa: "ਵਿਰੋਧੀ ਵਿਚਾਰਾਂ ਲਈ ਬਦਲਾਅ",
    title_rom: "virodhi vicharan lai badlaa",
    title_vi: "Chuyển ý cho quan điểm đối lập",
    title_en: "Transitions for contrasting ideas",
    writing_goal_vi: "Liên kết hai ý trái chiều mà vẫn giữ mạch lập luận rõ.",
    writing_goal_en: "Link two opposing ideas while keeping the argument clear.",
    register_vi: "Học thuật, cân bằng, tránh chuyển ý đột ngột.",
    register_en: "Academic, balanced, avoiding abrupt shifts.",
    template_phrases: [
      {
        pa: "ਇਸ ਦੇ ਉਲਟ, ...",
        rom: "is de ulat, ...",
        vi: "Ngược lại,...",
        en: "In contrast,...",
      },
      {
        pa: "ਹਾਲਾਂਕਿ ਇਹ ਗੱਲ ਸਹੀ ਹੈ, ਫਿਰ ਵੀ ...",
        rom: "halanki ih gall sahi hai, phir vi ...",
        vi: "Mặc dù điều này đúng, tuy vậy...",
        en: "Although this point is valid, still...",
      },
      {
        pa: "ਦੂਜੇ ਪਾਸੇ, ...",
        rom: "duje pase, ...",
        vi: "Mặt khác,...",
        en: "On the other hand,...",
      },
    ],
    canada_example: {
      context_vi: "Chuyển ý trong bài luận về học trực tuyến ở Canada.",
      context_en: "Transitioning in an essay about online learning in Canada.",
      pa: "ਦੂਜੇ ਪਾਸੇ, ਕੈਨੇਡਾ ਦੇ ਪਿੰਡਾਂ ਵਿੱਚ ਆਨਲਾਈਨ ਸਿੱਖਿਆ ਪਹੁੰਚ ਵਧਾ ਸਕਦੀ ਹੈ।",
      rom: "duje pase, Canada de pindan vich online sikhia pahunch vadha sakdi hai.",
      vi: "Mặt khác, tại các vùng nông thôn Canada, học trực tuyến có thể mở rộng khả năng tiếp cận.",
      en: "On the other hand, in rural Canada, online learning can expand access.",
    },
    learner_traps_vi: [
      "Không dùng 'ngược lại' nếu ý sau chỉ là ví dụ thêm, không phải đối lập.",
      "Sau chuyển ý, cần giải thích quan hệ giữa hai ý.",
    ],
    learner_traps_en: [
      "Do not use 'in contrast' if the next point is only another example, not an opposition.",
      "After a transition, explain the relationship between the two ideas.",
    ],
    practice_task_vi: "Viết 4 câu nối lợi ích và giới hạn của một chính sách giáo dục.",
    practice_task_en: "Write four sentences linking benefits and limits of an education policy.",
  },
  {
    id: "pa_c1_fw_transition_cause",
    level: "C1",
    category: "academic_transitions",
    title_pa: "ਕਾਰਨ-ਨਤੀਜਾ ਬਦਲਾਅ",
    title_rom: "karan-natija badlaa",
    title_vi: "Chuyển ý nguyên nhân-kết quả",
    title_en: "Cause-effect transitions",
    writing_goal_vi: "Dẫn từ nguyên nhân sang hệ quả mà không phóng đại quan hệ nhân quả.",
    writing_goal_en: "Move from cause to effect without overstating causation.",
    register_vi: "Thận trọng, có điều kiện, chính xác về mức độ quan hệ.",
    register_en: "Careful, qualified, precise about strength of relationship.",
    template_phrases: [
      {
        pa: "ਇਸ ਦੇ ਨਤੀਜੇ ਵਜੋਂ, ...",
        rom: "is de natije vajon, ...",
        vi: "Kết quả là,...",
        en: "As a result,...",
      },
      {
        pa: "ਇਹ ਕਾਰਕ ... ਵਿੱਚ ਯੋਗਦਾਨ ਪਾ ਸਕਦਾ ਹੈ।",
        rom: "ih karak ... vich yogdan pa sakda hai.",
        vi: "Yếu tố này có thể góp phần vào...",
        en: "This factor may contribute to...",
      },
      {
        pa: "ਇਸ ਸੰਬੰਧ ਨੂੰ ਸਾਵਧਾਨੀ ਨਾਲ ਸਮਝਣਾ ਚਾਹੀਦਾ ਹੈ।",
        rom: "is sambandh nu savdhani nal samajhna chahida hai.",
        vi: "Quan hệ này nên được hiểu một cách thận trọng.",
        en: "This relationship should be understood cautiously.",
      },
    ],
    canada_example: {
      context_vi: "Chuyển ý trong đoạn về chi phí sinh hoạt ở Canada.",
      context_en: "Transitioning in a paragraph about cost of living in Canada.",
      pa: "ਇਹ ਕਾਰਕ ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਕੰਮ ਦੇ ਘੰਟਿਆਂ ਵਿੱਚ ਵਾਧੇ ਲਈ ਯੋਗਦਾਨ ਪਾ ਸਕਦਾ ਹੈ।",
      rom: "ih karak Canada vich vidyarthian de kam de ghantian vich vadhe lai yogdan pa sakda hai.",
      vi: "Yếu tố này có thể góp phần vào việc tăng số giờ làm của sinh viên ở Canada.",
      en: "This factor may contribute to increased student work hours in Canada.",
    },
    learner_traps_vi: [
      "Tránh nói 'gây ra' khi bạn chỉ có bằng chứng góp phần.",
      "Dùng có thể/góp phần khi quan hệ chưa được chứng minh trực tiếp.",
    ],
    learner_traps_en: [
      "Avoid saying 'causes' when you only have evidence of contribution.",
      "Use may/contribute when the relationship is not directly proven.",
    ],
    practice_task_vi: "Viết ba câu chuyển từ chi phí cao sang ảnh hưởng học tập.",
    practice_task_en: "Write three sentences moving from high costs to academic impact.",
  },
];
