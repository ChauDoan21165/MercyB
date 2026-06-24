// Punjabi Canada survival exit tickets for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary. Romanization is included as a learner bridge.
// Shahmukhi is awareness only. Native review is deferred.

export type PunjabiCanadaSurvivalExitTicketDomain =
  | "clinic"
  | "pharmacy"
  | "school_childcare"
  | "bank"
  | "housing"
  | "transport"
  | "public_office"
  | "forms_service_desk"
  | "interpreter_request"
  | "emergency_boundary"
  | "workplace_safety";

export type PunjabiCanadaSurvivalExitTicketUse =
  | "exit_ticket"
  | "final_proof"
  | "final_qa";

export type PunjabiCanadaSurvivalExitTicket = {
  id: string;
  domain: PunjabiCanadaSurvivalExitTicketDomain;
  use: PunjabiCanadaSurvivalExitTicketUse;
  prompt_vi: string;
  prompt_en: string;
  expected_line_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  pass_criteria_vi: string[];
  pass_criteria_en: string[];
  repair_hint_vi: string;
  repair_hint_en: string;
  canada_context_vi: string;
  canada_context_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaSurvivalExitTicketScope = {
  name: string;
  learnerAudience: string[];
  scriptPolicy: string;
  reviewPolicy: string;
  safetyBoundary: string;
};

export const PUNJABI_CANADA_SURVIVAL_EXIT_TICKET_SCOPE: PunjabiCanadaSurvivalExitTicketScope = {
  name: "Punjabi Canada Survival Exit Tickets",
  learnerAudience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary; romanization is a support bridge. Shahmukhi is awareness only.",
  reviewPolicy: "Native review is deferred.",
  safetyBoundary:
    "These tickets check language readiness for Canada survival situations; they do not give professional advice.",
};

export const PUNJABI_CANADA_SURVIVAL_EXIT_TICKETS: PunjabiCanadaSurvivalExitTicket[] = [
  {
    id: "pa-ca-exit-clinic-001",
    domain: "clinic",
    use: "exit_ticket",
    prompt_vi: "Bạn ở quầy phòng khám và cần nói rằng mình không khỏe.",
    prompt_en: "You are at a clinic desk and need to say you do not feel well.",
    expected_line_pa: "ਮੈਨੂੰ ਠੀਕ ਨਹੀਂ ਲੱਗ ਰਿਹਾ।",
    romanization: "mainu theek nahin lag riha.",
    meaning_vi: "Tôi thấy không khỏe.",
    meaning_en: "I do not feel well.",
    pass_criteria_vi: ["Đọc được câu Gurmukhi.", "Giải thích là báo tình trạng, không chẩn đoán.", "Có thể thêm ਮੈਨੂੰ ਇੱਥੇ ਦਰਦ ਹੈ।"],
    pass_criteria_en: ["Reads the Gurmukhi line.", "Explains that it reports condition, not diagnosis.", "Can add ਮੈਨੂੰ ਇੱਥੇ ਦਰਦ ਹੈ।"],
    repair_hint_vi: "Ôn lại cụm ਠੀਕ ਨਹੀਂ và câu chỉ nơi đau.",
    repair_hint_en: "Review ਠੀਕ ਨਹੀਂ and the line for pointing to pain.",
    canada_context_vi: "Dùng ở phòng khám Canada để bắt đầu mô tả triệu chứng đơn giản.",
    canada_context_en: "Use at a Canadian clinic to begin describing a simple symptom.",
    learner_trap_vi: "Không tự biến câu này thành lời khuyên y tế.",
    learner_trap_en: "Do not turn this line into medical advice.",
  },
  {
    id: "pa-ca-exit-pharmacy-002",
    domain: "pharmacy",
    use: "final_proof",
    prompt_vi: "Bạn cần báo dị ứng thuốc ở nhà thuốc.",
    prompt_en: "You need to state a medicine allergy at a pharmacy.",
    expected_line_pa: "ਮੈਨੂੰ ਦਵਾਈ ਤੋਂ ਐਲਰਜੀ ਹੈ।",
    romanization: "mainu davai ton allergy hai.",
    meaning_vi: "Tôi bị dị ứng với thuốc.",
    meaning_en: "I am allergic to medicine.",
    pass_criteria_vi: ["Nhận ra ਦਵਾਈ là thuốc.", "Nói rõ đây là thông tin an toàn.", "Xin giải thích chậm nếu chưa hiểu."],
    pass_criteria_en: ["Recognizes ਦਵਾਈ as medicine.", "States that this is safety information.", "Asks for a slower explanation if needed."],
    repair_hint_vi: "Ôn cặp ਦਵਾਈ và ਐਲਰਜੀ trước khi làm lại.",
    repair_hint_en: "Review ਦਵਾਈ and ਐਲਰਜੀ before trying again.",
    canada_context_vi: "Ở Canada, nên báo dị ứng rõ ràng trước khi hỏi hoặc nhận thuốc.",
    canada_context_en: "In Canada, allergies should be stated clearly before asking about or receiving medicine.",
    learner_trap_vi: "ਫਾਰਮੇਸੀ là nhà thuốc; không tự cho rằng câu trả lời là chỉ định điều trị.",
    learner_trap_en: "ਫਾਰਮੇਸੀ is pharmacy; do not treat the response as treatment direction.",
  },
  {
    id: "pa-ca-exit-school-003",
    domain: "school_childcare",
    use: "exit_ticket",
    prompt_vi: "Bạn gọi trường hoặc nơi giữ trẻ để báo con vắng mặt hôm nay.",
    prompt_en: "You call a school or childcare centre to say your child is absent today.",
    expected_line_pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ।",
    romanization: "mera bacha aj gair-hazar hai.",
    meaning_vi: "Con tôi hôm nay vắng mặt.",
    meaning_en: "My child is absent today.",
    pass_criteria_vi: ["Đọc đúng ਬੱਚਾ.", "Nêu đúng hôm nay là ਅੱਜ.", "Có thể hỏi thêm ਮੀਟਿੰਗ ਕਦੋਂ ਹੈ? khi cần."],
    pass_criteria_en: ["Reads ਬੱਚਾ correctly.", "Identifies ਅੱਜ as today.", "Can add ਮੀਟਿੰਗ ਕਦੋਂ ਹੈ? when needed."],
    repair_hint_vi: "Ôn từ ਬੱਚਾ, ਅੱਜ, và ਗੈਰਹਾਜ਼ਰ theo cụm.",
    repair_hint_en: "Review ਬੱਚਾ, ਅੱਜ, and ਗੈਰਹਾਜ਼ਰ as a chunk.",
    canada_context_vi: "Dùng khi nói với văn phòng trường, giáo viên, hoặc trung tâm giữ trẻ.",
    canada_context_en: "Use this with school offices, teachers, or childcare centres.",
    learner_trap_vi: "Đừng dùng ਬੱਚਾ cho người lớn đi học.",
    learner_trap_en: "Do not use ਬੱਚਾ for an adult student.",
  },
  {
    id: "pa-ca-exit-bank-004",
    domain: "bank",
    use: "final_qa",
    prompt_vi: "Bạn muốn mở tài khoản ngân hàng và cần nói mục đích tại quầy.",
    prompt_en: "You want to open a bank account and need to state your purpose at the counter.",
    expected_line_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਹੈ।",
    romanization: "mainu bank khata kholhna hai.",
    meaning_vi: "Tôi muốn mở tài khoản ngân hàng.",
    meaning_en: "I want to open a bank account.",
    pass_criteria_vi: ["Phân biệt ਖਾਤਾ với ਕਾਰਡ.", "Nói được mục đích mở tài khoản.", "Hỏi ਫੀਸ ਕਿੰਨੀ ਹੈ? khi cần."],
    pass_criteria_en: ["Distinguishes ਖਾਤਾ from ਕਾਰਡ.", "States the purpose of opening an account.", "Asks ਫੀਸ ਕਿੰਨੀ ਹੈ? when needed."],
    repair_hint_vi: "Ôn ba từ ਬੈਂਕ, ਖਾਤਾ, ਅਤੇ ਫੀਸ.",
    repair_hint_en: "Review ਬੈਂਕ, ਖਾਤਾ, and ਫੀਸ.",
    canada_context_vi: "Đây là ngôn ngữ giao tiếp ngân hàng ở Canada, không phải tư vấn tài chính.",
    canada_context_en: "This is Canadian bank-service language, not financial advice.",
    learner_trap_vi: "Không hỏi hoặc chọn sản phẩm tài chính chỉ dựa vào vé thoát này.",
    learner_trap_en: "Do not ask for or choose financial products based only on this ticket.",
  },
  {
    id: "pa-ca-exit-housing-005",
    domain: "housing",
    use: "exit_ticket",
    prompt_vi: "Bạn cần báo rằng máy sưởi trong nhà thuê không hoạt động.",
    prompt_en: "You need to report that heating in a rental is not working.",
    expected_line_pa: "ਹੀਟਿੰਗ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।",
    romanization: "heating kamm nahin kar rahi.",
    meaning_vi: "Máy sưởi không hoạt động.",
    meaning_en: "The heating is not working.",
    pass_criteria_vi: ["Đọc được ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ.", "Nói đây là sự cố sửa chữa.", "Xin phản hồi bằng văn bản khi cần."],
    pass_criteria_en: ["Reads ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ.", "Says this is a repair issue.", "Asks for a written response when needed."],
    repair_hint_vi: "Ôn cụm ਮੁਰੰਮਤ và ਲਿਖ ਕੇ ਭੇਜੋ.",
    repair_hint_en: "Review ਮੁਰੰਮਤ and ਲਿਖ ਕੇ ਭੇਜੋ.",
    canada_context_vi: "Dùng với chủ nhà hoặc quản lý nhà thuê ở Canada.",
    canada_context_en: "Use with a landlord or rental property manager in Canada.",
    learner_trap_vi: "Câu này không phải tư vấn pháp lý về thuê nhà.",
    learner_trap_en: "This line is not tenancy legal advice.",
  },
  {
    id: "pa-ca-exit-transport-006",
    domain: "transport",
    use: "exit_ticket",
    prompt_vi: "Bạn cần hỏi xe buýt này có đi trung tâm không.",
    prompt_en: "You need to ask whether this bus goes downtown.",
    expected_line_pa: "ਕੀ ਇਹ ਬੱਸ ਡਾਊਨਟਾਊਨ ਜਾਂਦੀ ਹੈ?",
    romanization: "ki ih bus downtown jandi hai?",
    meaning_vi: "Xe buýt này có đi trung tâm không?",
    meaning_en: "Does this bus go downtown?",
    pass_criteria_vi: ["Nhận ra đây là câu hỏi yes/no.", "Đọc được ਬੱਸ và ਡਾਊਨਟਾਊਨ.", "Có thể nói ਮੈਨੂੰ ਇੱਥੇ ਉਤਰਨਾ ਹੈ।"],
    pass_criteria_en: ["Recognizes this as a yes/no question.", "Reads ਬੱਸ and ਡਾਊਨਟਾਊਨ.", "Can say ਮੈਨੂੰ ਇੱਥੇ ਉਤਰਨਾ ਹੈ।"],
    repair_hint_vi: "Ôn ਕੀ ở đầu câu hỏi và cụm ਬੱਸ ਜਾਂਦੀ ਹੈ.",
    repair_hint_en: "Review initial ਕੀ and the chunk ਬੱਸ ਜਾਂਦੀ ਹੈ.",
    canada_context_vi: "Hữu ích tại trạm xe buýt hoặc khi hỏi tài xế trong thành phố Canada.",
    canada_context_en: "Useful at a bus stop or when asking a driver in a Canadian city.",
    learner_trap_vi: "Đừng chỉ nhìn chữ Latin downtown; vẫn xác nhận bằng Gurmukhi.",
    learner_trap_en: "Do not rely only on Latin downtown; confirm through Gurmukhi.",
  },
  {
    id: "pa-ca-exit-public-office-007",
    domain: "public_office",
    use: "final_proof",
    prompt_vi: "Bạn ở cơ quan công và cần biết nên đến quầy nào.",
    prompt_en: "You are at a public office and need to know which counter to visit.",
    expected_line_pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ?",
    romanization: "mainu kis counter te jana chahida hai?",
    meaning_vi: "Tôi nên đến quầy nào?",
    meaning_en: "Which counter should I go to?",
    pass_criteria_vi: ["Hiểu ਕਿਸ là nào.", "Nói được ý hỏi quầy.", "Có thể thêm câu hỏi giấy tờ."],
    pass_criteria_en: ["Understands ਕਿਸ as which.", "Can express the counter question.", "Can add a document question."],
    repair_hint_vi: "Ôn ਕਾਊਂਟਰ và ਦਸਤਾਵੇਜ਼ theo tình huống dịch vụ.",
    repair_hint_en: "Review ਕਾਊਂਟਰ and ਦਸਤਾਵੇਜ਼ in a service situation.",
    canada_context_vi: "Dùng ở trung tâm dịch vụ, thư viện, văn phòng thành phố, hoặc cơ quan công.",
    canada_context_en: "Use at service centres, libraries, city offices, or public offices.",
    learner_trap_vi: "Không tự đoán yêu cầu giấy tờ chính thức từ bài học.",
    learner_trap_en: "Do not infer official document requirements from the lesson.",
  },
  {
    id: "pa-ca-exit-forms-008",
    domain: "forms_service_desk",
    use: "final_qa",
    prompt_vi: "Bạn chưa hiểu một phần trong mẫu đơn và cần xin giúp.",
    prompt_en: "You do not understand part of a form and need help.",
    expected_line_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    romanization: "mainu ih form bharan vich madad chahidi hai.",
    meaning_vi: "Tôi cần giúp điền mẫu đơn này.",
    meaning_en: "I need help filling out this form.",
    pass_criteria_vi: ["Nhận ra ਫਾਰਮ là mẫu đơn.", "Nói được mình cần ਮਦਦ.", "Yêu cầu chỉ phần chưa hiểu."],
    pass_criteria_en: ["Recognizes ਫਾਰਮ as form.", "Can say they need ਮਦਦ.", "Asks to be shown the unclear part."],
    repair_hint_vi: "Ôn cụm ਫਾਰਮ ਭਰਨ và ਮਦਦ ਚਾਹੀਦੀ ਹੈ.",
    repair_hint_en: "Review ਫਾਰਮ ਭਰਨ and ਮਦਦ ਚਾਹੀਦੀ ਹੈ.",
    canada_context_vi: "Câu này dùng ở quầy dịch vụ, trường, thư viện, hoặc văn phòng tiếp nhận.",
    canada_context_en: "This line works at service desks, schools, libraries, or reception offices.",
    learner_trap_vi: "Đừng đưa giấy im lặng; nói rõ bạn cần giúp phần nào.",
    learner_trap_en: "Do not silently hand over the paper; say which part needs help.",
  },
  {
    id: "pa-ca-exit-interpreter-009",
    domain: "interpreter_request",
    use: "final_proof",
    prompt_vi: "Bạn không hiểu đủ trong tình huống quan trọng và cần thông dịch viên.",
    prompt_en: "You do not understand enough in an important situation and need an interpreter.",
    expected_line_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ।",
    romanization: "mainu dubhashiye di lor hai.",
    meaning_vi: "Tôi cần thông dịch viên.",
    meaning_en: "I need an interpreter.",
    pass_criteria_vi: ["Đọc được ਦੁਭਾਸ਼ੀਏ.", "Nêu đúng nhu cầu ngôn ngữ.", "Không đoán khi chưa hiểu."],
    pass_criteria_en: ["Reads ਦੁਭਾਸ਼ੀਏ.", "States the language-support need.", "Does not guess when not understanding."],
    repair_hint_vi: "Ôn câu chính và câu ਮੈਂ ਅੰਗਰੇਜ਼ੀ/ਵਿਯਤਨਾਮੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ।",
    repair_hint_en: "Review the main line and ਮੈਂ ਅੰਗਰੇਜ਼ੀ/ਵਿਯਤਨਾਮੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ।",
    canada_context_vi: "Dùng ở phòng khám, trường, cơ quan công, hoặc dịch vụ cộng đồng tại Canada.",
    canada_context_en: "Use at clinics, schools, public offices, or community services in Canada.",
    learner_trap_vi: "Đây là yêu cầu hỗ trợ ngôn ngữ, không phải câu xin học tiếng.",
    learner_trap_en: "This requests language support; it is not asking for language lessons.",
  },
  {
    id: "pa-ca-exit-emergency-010",
    domain: "emergency_boundary",
    use: "final_proof",
    prompt_vi: "Có nguy hiểm hoặc tai nạn và bạn cần người khác gọi 911.",
    prompt_en: "There is danger or an accident and you need someone to call 911.",
    expected_line_pa: "ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    romanization: "kirpa karke nau-ikk-ikk te call karo.",
    meaning_vi: "Làm ơn gọi 911.",
    meaning_en: "Please call 911.",
    pass_criteria_vi: ["Nói được câu gọi 911.", "Biết đây là ranh giới khẩn cấp.", "Không trì hoãn bằng luyện tập thêm."],
    pass_criteria_en: ["Can say the 911 line.", "Knows this is an emergency boundary.", "Does not delay by doing more practice."],
    repair_hint_vi: "Ôn câu ਮਦਦ ਕਰੋ! và ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। cùng câu gọi 911.",
    repair_hint_en: "Review ਮਦਦ ਕਰੋ! and ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। with the 911 line.",
    canada_context_vi: "Ở Canada, dùng khi cần trợ giúp khẩn cấp thật sự.",
    canada_context_en: "In Canada, use this when real urgent help is needed.",
    learner_trap_vi: "Vé thoát này không thay thế dịch vụ khẩn cấp.",
    learner_trap_en: "This ticket does not replace emergency services.",
  },
  {
    id: "pa-ca-exit-workplace-011",
    domain: "workplace_safety",
    use: "final_qa",
    prompt_vi: "Bạn chưa hiểu quy tắc an toàn ở nơi làm việc.",
    prompt_en: "You do not understand a workplace safety rule.",
    expected_line_pa: "ਸੁਰੱਖਿਆ ਨਿਯਮ ਕੀ ਹਨ?",
    romanization: "surakhia niyam ki han?",
    meaning_vi: "Quy tắc an toàn là gì?",
    meaning_en: "What are the safety rules?",
    pass_criteria_vi: ["Đọc được ਸੁਰੱਖਿਆ.", "Hỏi lại thay vì giả vờ hiểu.", "Có thể xin chỉ lại bằng câu ਦੁਬਾਰਾ ਦਿਖਾਓ."],
    pass_criteria_en: ["Reads ਸੁਰੱਖਿਆ.", "Asks again instead of pretending to understand.", "Can ask to be shown again with ਦੁਬਾਰਾ ਦਿਖਾਓ."],
    repair_hint_vi: "Ôn cụm ਸੁਰੱਖਿਆ ਨਿਯਮ và ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।",
    repair_hint_en: "Review ਸੁਰੱਖਿਆ ਨਿਯਮ and ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।",
    canada_context_vi: "Dùng với quản lý hoặc người hướng dẫn tại nơi làm việc ở Canada.",
    canada_context_en: "Use with a supervisor or trainer at a Canadian workplace.",
    learner_trap_vi: "Không tiếp tục việc có rủi ro khi chưa hiểu hướng dẫn an toàn.",
    learner_trap_en: "Do not continue risky work when safety instructions are unclear.",
  },
];

export default PUNJABI_CANADA_SURVIVAL_EXIT_TICKETS;
