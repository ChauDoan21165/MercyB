// Punjabi Canada survival integration samples for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner bridge only. Shahmukhi is
// mentioned for awareness, not taught as a parallel course. Native review is
// deferred.

export type PunjabiCanadaSurvivalIntegrationDomain =
  | "clinic"
  | "pharmacy"
  | "school_childcare"
  | "bank"
  | "housing"
  | "transport"
  | "public_office"
  | "service_desk"
  | "interpreter_request"
  | "emergency_boundary"
  | "workplace_safety";

export type PunjabiCanadaSurvivalIntegrationUse =
  | "integration_sample"
  | "final_evidence"
  | "final_qa";

export type PunjabiCanadaSurvivalIntegrationSample = {
  id: string;
  domain: PunjabiCanadaSurvivalIntegrationDomain;
  use: PunjabiCanadaSurvivalIntegrationUse;
  title_pa: string;
  title_vi: string;
  title_en: string;
  situation_vi: string;
  situation_en: string;
  learner_can_do_vi: string;
  learner_can_do_en: string;
  primary_line_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  support_lines_pa: string[];
  canada_practical_note_vi: string;
  canada_practical_note_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
  final_evidence_vi?: string;
  final_evidence_en?: string;
};

export type PunjabiCanadaSurvivalIntegrationScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  boundaries: string[];
};

export const PUNJABI_CANADA_SURVIVAL_INTEGRATION_SCOPE: PunjabiCanadaSurvivalIntegrationScope = {
  name: "Punjabi Canada Survival Integration Samples",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is the primary learning script. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  boundaries: [
    "Language support only for Canada survival situations.",
    "No medical, legal, immigration, financial, tenancy, or workplace safety advice.",
    "Native review is deferred.",
  ],
};

export const PUNJABI_CANADA_SURVIVAL_INTEGRATION_SAMPLES: PunjabiCanadaSurvivalIntegrationSample[] = [
  {
    id: "pa-ca-integrate-clinic-001",
    domain: "clinic",
    use: "integration_sample",
    title_pa: "ਕਲਿਨਿਕ ਵਿੱਚ ਮਦਦ",
    title_vi: "Hỗ trợ ở phòng khám",
    title_en: "Help at a clinic",
    situation_vi: "Bạn đến quầy phòng khám và cần nói triệu chứng đơn giản.",
    situation_en: "You arrive at a clinic desk and need to state a simple symptom.",
    learner_can_do_vi: "Nói mình không khỏe, chỉ nơi đau, và xin giải thích chậm.",
    learner_can_do_en: "Say you feel unwell, point to pain, and ask for a slow explanation.",
    primary_line_pa: "ਮੈਨੂੰ ਠੀਕ ਨਹੀਂ ਲੱਗ ਰਿਹਾ।",
    romanization: "mainu theek nahin lag riha.",
    meaning_vi: "Tôi thấy không khỏe.",
    meaning_en: "I do not feel well.",
    support_lines_pa: ["ਮੈਨੂੰ ਇੱਥੇ ਦਰਦ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਸਮਝਾਓ।"],
    canada_practical_note_vi: "Dùng để mở đầu cuộc nói chuyện; nhân viên y tế sẽ hỏi thêm chi tiết.",
    canada_practical_note_en: "Use it to start the conversation; clinic staff will ask follow-up questions.",
    learner_trap_vi: "Đừng dùng câu này như chẩn đoán; nó chỉ báo tình trạng.",
    learner_trap_en: "Do not use this as a diagnosis; it only reports how you feel.",
  },
  {
    id: "pa-ca-integrate-pharmacy-002",
    domain: "pharmacy",
    use: "final_evidence",
    title_pa: "ਫਾਰਮੇਸੀ ਅਤੇ ਐਲਰਜੀ",
    title_vi: "Nhà thuốc và dị ứng",
    title_en: "Pharmacy and allergy",
    situation_vi: "Bạn cần báo dị ứng thuốc trước khi hỏi dược sĩ.",
    situation_en: "You need to report a medicine allergy before asking a pharmacist.",
    learner_can_do_vi: "Nêu dị ứng và xin hướng dẫn dễ hiểu.",
    learner_can_do_en: "State an allergy and ask for plain guidance.",
    primary_line_pa: "ਮੈਨੂੰ ਦਵਾਈ ਤੋਂ ਐਲਰਜੀ ਹੈ।",
    romanization: "mainu davai ton allergy hai.",
    meaning_vi: "Tôi bị dị ứng với thuốc.",
    meaning_en: "I am allergic to medicine.",
    support_lines_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਮਝਾ ਸਕਦੇ ਹੋ?", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    canada_practical_note_vi: "Ở Canada, nói rõ dị ứng trước khi nhận hoặc hỏi về thuốc.",
    canada_practical_note_en: "In Canada, state allergies clearly before receiving or asking about medicine.",
    learner_trap_vi: "ਫਾਰਮੇਸੀ là nhà thuốc; không phải mọi nhân viên đều là bác sĩ.",
    learner_trap_en: "ਫਾਰਮੇਸੀ means pharmacy; not every staff member is a doctor.",
    final_evidence_vi: "Người học có thể đọc câu Gurmukhi và giải thích bằng tiếng Việt hoặc tiếng Anh.",
    final_evidence_en: "The learner can read the Gurmukhi line and explain it in Vietnamese or English.",
  },
  {
    id: "pa-ca-integrate-school-003",
    domain: "school_childcare",
    use: "integration_sample",
    title_pa: "ਸਕੂਲ ਅਤੇ ਚਾਈਲਡਕੇਅਰ",
    title_vi: "Trường học và giữ trẻ",
    title_en: "School and childcare",
    situation_vi: "Bạn cần báo với văn phòng rằng con bạn vắng mặt.",
    situation_en: "You need to tell the office that your child is absent.",
    learner_can_do_vi: "Báo vắng mặt và xin ghi chú bằng tiếng Anh khi cần.",
    learner_can_do_en: "Report an absence and ask for an English note when needed.",
    primary_line_pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ।",
    romanization: "mera bacha aj gair-hazar hai.",
    meaning_vi: "Con tôi hôm nay vắng mặt.",
    meaning_en: "My child is absent today.",
    support_lines_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਨੋਟ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਦੇ ਸਕਦੇ ਹੋ?", "ਮੀਟਿੰਗ ਕਦੋਂ ਹੈ?"],
    canada_practical_note_vi: "Câu này phù hợp cho văn phòng trường, giáo viên, hoặc trung tâm giữ trẻ.",
    canada_practical_note_en: "This works for a school office, teacher, or childcare centre.",
    learner_trap_vi: "ਬੱਚਾ là con/trẻ; đừng nhầm với người lớn đi học.",
    learner_trap_en: "ਬੱਚਾ means child; do not use it for an adult learner.",
  },
  {
    id: "pa-ca-integrate-bank-004",
    domain: "bank",
    use: "final_qa",
    title_pa: "ਬੈਂਕ ਖਾਤਾ",
    title_vi: "Tài khoản ngân hàng",
    title_en: "Bank account",
    situation_vi: "Bạn vào ngân hàng để mở tài khoản và hỏi phí.",
    situation_en: "You enter a bank to open an account and ask about fees.",
    learner_can_do_vi: "Nói mục đích, nêu mình mới đến, và hỏi phí.",
    learner_can_do_en: "State the purpose, say you are new, and ask about fees.",
    primary_line_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਹੈ।",
    romanization: "mainu bank khata kholhna hai.",
    meaning_vi: "Tôi muốn mở tài khoản ngân hàng.",
    meaning_en: "I want to open a bank account.",
    support_lines_pa: ["ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ।", "ਫੀਸ ਕਿੰਨੀ ਹੈ?"],
    canada_practical_note_vi: "Đây là ngôn ngữ giao tiếp tại quầy, không phải tư vấn tài chính.",
    canada_practical_note_en: "This is counter-service language, not financial advice.",
    learner_trap_vi: "ਖਾਤਾ là tài khoản; ਕਾਰਡ là thẻ.",
    learner_trap_en: "ਖਾਤਾ means account; ਕਾਰਡ means card.",
    final_evidence_vi: "Người học chọn đúng câu khi tình huống là mở tài khoản.",
    final_evidence_en: "The learner selects the right line when the situation is opening an account.",
  },
  {
    id: "pa-ca-integrate-housing-005",
    domain: "housing",
    use: "integration_sample",
    title_pa: "ਕਿਰਾਏ ਦਾ ਘਰ",
    title_vi: "Nhà thuê",
    title_en: "Rental housing",
    situation_vi: "Bạn cần báo vấn đề sưởi và xin thời gian sửa chữa.",
    situation_en: "You need to report a heating problem and ask for a repair time.",
    learner_can_do_vi: "Báo vấn đề trong nhà thuê và xin phản hồi bằng văn bản.",
    learner_can_do_en: "Report a rental issue and ask for a written response.",
    primary_line_pa: "ਹੀਟਿੰਗ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।",
    romanization: "heating kamm nahin kar rahi.",
    meaning_vi: "Máy sưởi không hoạt động.",
    meaning_en: "The heating is not working.",
    support_lines_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਲਈ ਸਮਾਂ ਦੱਸੋ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਕੇ ਭੇਜੋ।"],
    canada_practical_note_vi: "Dùng cho giao tiếp với chủ nhà hoặc quản lý; không phải tư vấn luật thuê nhà.",
    canada_practical_note_en: "Use with a landlord or property manager; it is not tenancy legal advice.",
    learner_trap_vi: "ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ nói đồ vật không hoạt động, không phải người không làm việc.",
    learner_trap_en: "ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ means an item is not working, not that a person is not working.",
  },
  {
    id: "pa-ca-integrate-transport-006",
    domain: "transport",
    use: "integration_sample",
    title_pa: "ਬੱਸ ਅਤੇ ਰਸਤਾ",
    title_vi: "Xe buýt và đường đi",
    title_en: "Bus and route",
    situation_vi: "Bạn không chắc xe buýt có đi đến trung tâm hay không.",
    situation_en: "You are not sure whether the bus goes downtown.",
    learner_can_do_vi: "Hỏi tuyến xe và nói mình cần xuống ở đâu.",
    learner_can_do_en: "Ask about the route and say where you need to get off.",
    primary_line_pa: "ਕੀ ਇਹ ਬੱਸ ਡਾਊਨਟਾਊਨ ਜਾਂਦੀ ਹੈ?",
    romanization: "ki ih bus downtown jandi hai?",
    meaning_vi: "Xe buýt này có đi trung tâm không?",
    meaning_en: "Does this bus go downtown?",
    support_lines_pa: ["ਮੈਨੂੰ ਇੱਥੇ ਉਤਰਨਾ ਹੈ।", "ਮੈਂ ਰਸਤਾ ਭੁੱਲ ਗਿਆ/ਗਈ ਹਾਂ।"],
    canada_practical_note_vi: "Hữu ích ở trạm xe buýt hoặc khi hỏi tài xế/người đi đường.",
    canada_practical_note_en: "Useful at a bus stop or when asking a driver or passerby.",
    learner_trap_vi: "ਡਾਊਨਟਾਊਨ là từ mượn; vẫn đọc theo Gurmukhi trong câu.",
    learner_trap_en: "ਡਾਊਨਟਾਊਨ is a loanword; still read it through Gurmukhi in the sentence.",
  },
  {
    id: "pa-ca-integrate-public-office-007",
    domain: "public_office",
    use: "final_evidence",
    title_pa: "ਸਰਕਾਰੀ ਦਫ਼ਤਰ",
    title_vi: "Cơ quan công quyền",
    title_en: "Public office",
    situation_vi: "Bạn cần biết nên đến quầy nào và cần giấy tờ gì.",
    situation_en: "You need to know which counter to visit and which documents are needed.",
    learner_can_do_vi: "Hỏi quầy, giấy tờ, và xin viết số xuống.",
    learner_can_do_en: "Ask about the counter, documents, and request that a number be written down.",
    primary_line_pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ?",
    romanization: "mainu kis counter te jana chahida hai?",
    meaning_vi: "Tôi nên đến quầy nào?",
    meaning_en: "Which counter should I go to?",
    support_lines_pa: ["ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?", "ਕਿਰਪਾ ਕਰਕੇ ਨੰਬਰ ਲਿਖ ਦਿਓ।"],
    canada_practical_note_vi: "Dùng ở trung tâm dịch vụ, thư viện, văn phòng thành phố, hoặc cơ quan công.",
    canada_practical_note_en: "Use at service centres, libraries, city offices, or public offices.",
    learner_trap_vi: "ਦਸਤਾਵੇਜ਼ là giấy tờ; không tự đoán yêu cầu chính thức từ bài học.",
    learner_trap_en: "ਦਸਤਾਵੇਜ਼ means documents; do not infer official requirements from this lesson.",
    final_evidence_vi: "Người học có thể chọn câu hỏi quầy và câu hỏi giấy tờ cho cùng một tình huống.",
    final_evidence_en: "The learner can select both the counter question and document question for one situation.",
  },
  {
    id: "pa-ca-integrate-service-desk-008",
    domain: "service_desk",
    use: "integration_sample",
    title_pa: "ਸਰਵਿਸ ਡੈਸਕ",
    title_vi: "Quầy dịch vụ",
    title_en: "Service desk",
    situation_vi: "Bạn cần điền mẫu đơn nhưng chưa hiểu một phần.",
    situation_en: "You need to fill out a form but do not understand one part.",
    learner_can_do_vi: "Xin nhân viên chỉ phần cần điền và giải thích chậm.",
    learner_can_do_en: "Ask staff to show the part to fill in and explain slowly.",
    primary_line_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    romanization: "mainu ih form bharan vich madad chahidi hai.",
    meaning_vi: "Tôi cần giúp điền mẫu đơn này.",
    meaning_en: "I need help filling out this form.",
    support_lines_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਹਿੱਸਾ ਦਿਖਾਓ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    canada_practical_note_vi: "Câu này phù hợp ở quầy tiếp nhận, thư viện, trường, hoặc văn phòng dịch vụ.",
    canada_practical_note_en: "This fits reception desks, libraries, schools, or service offices.",
    learner_trap_vi: "ਫਾਰਮ là mẫu đơn; đừng chỉ đưa giấy mà không nói yêu cầu.",
    learner_trap_en: "ਫਾਰਮ means form; do not only hand over the paper without saying what you need.",
  },
  {
    id: "pa-ca-integrate-interpreter-009",
    domain: "interpreter_request",
    use: "final_qa",
    title_pa: "ਦੁਭਾਸ਼ੀਆ ਮੰਗਣਾ",
    title_vi: "Yêu cầu thông dịch viên",
    title_en: "Requesting an interpreter",
    situation_vi: "Bạn không hiểu đủ và cần thông dịch viên.",
    situation_en: "You do not understand enough and need an interpreter.",
    learner_can_do_vi: "Yêu cầu thông dịch viên và nói ngôn ngữ của mình.",
    learner_can_do_en: "Request an interpreter and state your language.",
    primary_line_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ।",
    romanization: "mainu dubhashiye di lor hai.",
    meaning_vi: "Tôi cần thông dịch viên.",
    meaning_en: "I need an interpreter.",
    support_lines_pa: ["ਮੈਂ ਅੰਗਰੇਜ਼ੀ/ਵਿਯਤਨਾਮੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    canada_practical_note_vi: "Dùng ở phòng khám, trường, văn phòng công, hoặc dịch vụ cộng đồng khi cần hỗ trợ ngôn ngữ.",
    canada_practical_note_en: "Use at clinics, schools, public offices, or community services when language support is needed.",
    learner_trap_vi: "ਦੁਭਾਸ਼ੀਆ là thông dịch viên; ਇਹ không phải yêu cầu một khóa học ngôn ngữ.",
    learner_trap_en: "ਦੁਭਾਸ਼ੀਆ means interpreter; this is not a request for a language class.",
    final_evidence_vi: "Người học biết chọn câu này thay vì đoán trong tình huống quan trọng.",
    final_evidence_en: "The learner knows to choose this line instead of guessing in an important situation.",
  },
  {
    id: "pa-ca-integrate-emergency-010",
    domain: "emergency_boundary",
    use: "final_evidence",
    title_pa: "ਐਮਰਜੈਂਸੀ ਹੱਦ",
    title_vi: "Ranh giới khẩn cấp",
    title_en: "Emergency boundary",
    situation_vi: "Có nguy hiểm hoặc tai nạn và bạn cần người khác gọi 911.",
    situation_en: "There is danger or an accident and you need someone to call 911.",
    learner_can_do_vi: "Nói đây là khẩn cấp và xin gọi 911, không tự xử lý bằng bài học.",
    learner_can_do_en: "Say it is an emergency and ask for 911, without trying to manage it through the lesson.",
    primary_line_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ।",
    romanization: "ih emergency hai.",
    meaning_vi: "Đây là trường hợp khẩn cấp.",
    meaning_en: "This is an emergency.",
    support_lines_pa: ["ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।", "ਮਦਦ ਕਰੋ!"],
    canada_practical_note_vi: "Ở Canada, dùng câu này để yêu cầu trợ giúp khẩn cấp; gọi 911 khi cần.",
    canada_practical_note_en: "In Canada, use this to request urgent help; call 911 when needed.",
    learner_trap_vi: "Bài học không thay thế dịch vụ khẩn cấp hoặc hướng dẫn an toàn.",
    learner_trap_en: "The lesson does not replace emergency services or safety instructions.",
    final_evidence_vi: "Người học biết ranh giới: dùng ngôn ngữ để gọi trợ giúp, không trì hoãn.",
    final_evidence_en: "The learner knows the boundary: use language to get help, not to delay.",
  },
  {
    id: "pa-ca-integrate-workplace-011",
    domain: "workplace_safety",
    use: "final_qa",
    title_pa: "ਕੰਮ ਦੀ ਸੁਰੱਖਿਆ",
    title_vi: "An toàn nơi làm việc",
    title_en: "Workplace safety",
    situation_vi: "Bạn chưa hiểu quy tắc an toàn hoặc cách làm một việc.",
    situation_en: "You did not understand a safety rule or how to do a task.",
    learner_can_do_vi: "Nói chưa hiểu, xin chỉ lại, và hỏi quy tắc an toàn.",
    learner_can_do_en: "Say you did not understand, ask to be shown again, and ask about safety rules.",
    primary_line_pa: "ਸੁਰੱਖਿਆ ਨਿਯਮ ਕੀ ਹਨ?",
    romanization: "surakhia niyam ki han?",
    meaning_vi: "Quy tắc an toàn là gì?",
    meaning_en: "What are the safety rules?",
    support_lines_pa: ["ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਦੁਬਾਰਾ ਦਿਖਾਓ।"],
    canada_practical_note_vi: "Dùng với quản lý hoặc người hướng dẫn; đây chỉ là ngôn ngữ hỏi lại.",
    canada_practical_note_en: "Use with a supervisor or trainer; this is only language for asking again.",
    learner_trap_vi: "Không giả vờ hiểu trong tình huống an toàn.",
    learner_trap_en: "Do not pretend to understand in a safety situation.",
    final_evidence_vi: "Người học chọn câu an toàn khi tình huống có rủi ro tại nơi làm việc.",
    final_evidence_en: "The learner selects the safety question when a workplace risk is present.",
  },
];

export default PUNJABI_CANADA_SURVIVAL_INTEGRATION_SAMPLES;
