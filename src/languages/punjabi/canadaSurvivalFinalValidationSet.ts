// Punjabi Canada survival final validation set for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner bridge only. Shahmukhi is
// awareness only, not a full course. Native review is deferred.

export type PunjabiCanadaSurvivalFinalValidationDomain =
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

export type PunjabiCanadaSurvivalFinalValidationUse =
  | "final_validation"
  | "cross_check"
  | "pre_integration"
  | "handoff_check";

export type PunjabiCanadaSurvivalFinalValidationItem = {
  id: string;
  domain: PunjabiCanadaSurvivalFinalValidationDomain;
  use: PunjabiCanadaSurvivalFinalValidationUse;
  validation_vi: string;
  validation_en: string;
  goal_vi: string;
  goal_en: string;
  phrase_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  support_pa: string[];
  final_check_vi: string;
  final_check_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaSurvivalFinalValidationScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundaries: string[];
};

export const PUNJABI_CANADA_SURVIVAL_FINAL_VALIDATION_SCOPE: PunjabiCanadaSurvivalFinalValidationScope = {
  name: "Punjabi Canada Survival Final Validation Set",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundaries: [
    "Language support only for Canada survival final-validation samples.",
    "No medical, legal, financial, tenancy, or workplace safety advice.",
  ],
};

export const PUNJABI_CANADA_SURVIVAL_FINAL_VALIDATION_SET: PunjabiCanadaSurvivalFinalValidationItem[] = [
  {
    id: "pa-ca-validation-clinic-001",
    domain: "clinic",
    use: "final_validation",
    validation_vi: "Xác nhận câu phòng khám khi người học cần xin giải thích chậm và giữ an toàn ngôn ngữ.",
    validation_en: "Validate the clinic line when the learner needs slower explanation and safe language support.",
    goal_vi: "Giữ câu xin nói chậm kết nối được với phòng khám.",
    goal_en: "Keep the slow-speech request connected to the clinic flow.",
    phrase_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਸਮਝਾਓ।",
    romanization: "mainu samajh nahin aaya. kirpa karke hauli hauli samjhao.",
    meaning_vi: "Tôi chưa hiểu. Làm ơn giải thích chậm hơn.",
    meaning_en: "I did not understand. Please explain more slowly.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।", "ਮੈਨੂੰ ਇੱਥੇ ਦਰਦ ਹੈ।"],
    final_check_vi: "Final-validation giữ câu ở mức hỗ trợ ngôn ngữ, không đưa lời khuyên y tế.",
    final_check_en: "Final validation keeps this as language support, not medical advice.",
    canada_example_vi: "Dùng ở phòng khám Canada khi quầy tiếp nhận nói quá nhanh.",
    canada_example_en: "Use at a Canadian clinic when reception speaks too quickly.",
    learner_trap_vi: "Đừng gật đầu nếu bạn chưa hiểu hướng dẫn.",
    learner_trap_en: "Do not nod if you did not understand the instruction.",
  },
  {
    id: "pa-ca-validation-pharmacy-002",
    domain: "pharmacy",
    use: "cross_check",
    validation_vi: "Xác nhận câu nhà thuốc để người học nêu dị ứng và xin ghi lại thông tin.",
    validation_en: "Validate the pharmacy line so the learner can state an allergy and ask for written information.",
    goal_vi: "Giữ câu dị ứng rõ ràng trước khi nối với luồng nhà thuốc.",
    goal_en: "Keep the allergy line clear before linking it to the pharmacy flow.",
    phrase_pa: "ਮੈਨੂੰ ਦਵਾਈ ਤੋਂ ਐਲਰਜੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।",
    romanization: "mainu davai ton allergy hai. kirpa karke ih likh dio.",
    meaning_vi: "Tôi bị dị ứng với thuốc. Làm ơn viết điều này ra.",
    meaning_en: "I am allergic to medicine. Please write this down.",
    support_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    final_check_vi: "Cross-check xác nhận người học không đoán tên thuốc hoặc cách dùng thuốc.",
    final_check_en: "The cross-check confirms the learner does not guess medicine names or usage.",
    canada_example_vi: "Dùng ở nhà thuốc Canada khi cần xác nhận thông tin bằng văn bản.",
    canada_example_en: "Use at a Canadian pharmacy when written confirmation is needed.",
    learner_trap_vi: "Đừng tự thêm liều lượng vào câu học ngôn ngữ.",
    learner_trap_en: "Do not add dosage to a language-learning line.",
  },
  {
    id: "pa-ca-validation-school-003",
    domain: "school_childcare",
    use: "pre_integration",
    validation_vi: "Xác nhận câu form dùng được cho trường và childcare khi người học bị kẹt.",
    validation_en: "Validate that the form line works for school and childcare when the learner is stuck.",
    goal_vi: "Chỉ đúng phần form chưa hiểu trước khi nộp.",
    goal_en: "Point to the exact unclear form section before submitting.",
    phrase_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਹ ਹਿੱਸਾ ਦਿਖਾ ਸਕਦੇ ਹੋ?",
    romanization: "mainu ih form bharan vich madad chahidi hai. ki tusin ih hissa dikha sakde ho?",
    meaning_vi: "Tôi cần giúp điền mẫu đơn này. Bạn có thể chỉ phần này không?",
    meaning_en: "I need help filling out this form. Can you show this part?",
    support_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਨੋਟ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਦੇ ਸਕਦੇ ਹੋ?", "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ।"],
    final_check_vi: "Pre-integration xác nhận câu có thể nối với trường, childcare, và form.",
    final_check_en: "Pre-integration confirms the line can connect to school, childcare, and form flows.",
    canada_example_vi: "Dùng ở trường hoặc childcare Canada khi form làm bạn kẹt.",
    canada_example_en: "Use at a Canadian school or childcare centre when a form stalls you.",
    learner_trap_vi: "Đừng nộp form im lặng nếu phần bắt buộc chưa rõ.",
    learner_trap_en: "Do not submit silently if a required section is unclear.",
  },
  {
    id: "pa-ca-validation-bank-004",
    domain: "bank",
    use: "handoff_check",
    validation_vi: "Xác nhận câu ngân hàng giữ mục tiêu mở tài khoản và hỏi phí thật ngắn.",
    validation_en: "Validate that the bank line keeps the account-opening and fee goal short.",
    goal_vi: "Nói mục tiêu chính mà không chuyển sang tư vấn tài chính.",
    goal_en: "State the main goal without shifting into financial advice.",
    phrase_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਹੈ। ਫੀਸ ਕਿੰਨੀ ਹੈ?",
    romanization: "mainu bank khata kholhna hai. fees kinni hai?",
    meaning_vi: "Tôi muốn mở tài khoản ngân hàng. Phí là bao nhiêu?",
    meaning_en: "I want to open a bank account. How much is the fee?",
    support_pa: ["ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    final_check_vi: "Handoff check xác nhận câu không trôi sang thẻ, vay, hoặc lời khuyên tiền bạc.",
    final_check_en: "The handoff check confirms the line does not drift to cards, loans, or money advice.",
    canada_example_vi: "Ở quầy ngân hàng Canada, câu này đủ ngắn để dùng ngay.",
    canada_example_en: "At a Canadian bank counter, this is short enough to use immediately.",
    learner_trap_vi: "ਖਾਤਾ là tài khoản; đừng đổi mục tiêu giữa câu.",
    learner_trap_en: "ਖਾਤਾ means account; do not change goals mid-line.",
  },
  {
    id: "pa-ca-validation-housing-005",
    domain: "housing",
    use: "final_validation",
    validation_vi: "Xác nhận câu nhà thuê khi cần thời gian sửa và phản hồi bằng văn bản.",
    validation_en: "Validate the rental line when repair timing and a written reply are needed.",
    goal_vi: "Xin lịch sửa rõ ràng và giữ ranh giới hỗ trợ ngôn ngữ.",
    goal_en: "Ask for a clear repair timeline and keep a language-support boundary.",
    phrase_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਲਈ ਸਮਾਂ ਦੱਸੋ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਕੇ ਭੇਜੋ।",
    romanization: "kirpa karke murammat lai samah daso. kirpa karke ih likh ke bhejo.",
    meaning_vi: "Làm ơn cho biết thời gian sửa chữa. Làm ơn gửi điều này bằng văn bản.",
    meaning_en: "Please give a repair time. Please send this in writing.",
    support_pa: ["ਹੀਟਿੰਗ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    final_check_vi: "Final-validation không biến câu sửa chữa thành tư vấn luật thuê nhà.",
    final_check_en: "Final validation does not turn the repair line into tenancy advice.",
    canada_example_vi: "Dùng ở nhà thuê Canada khi cần lịch sửa rõ ràng.",
    canada_example_en: "Use in a Canadian rental when a clear repair timeline is needed.",
    learner_trap_vi: "Đừng để lời hứa chung thay cho thời gian cụ thể.",
    learner_trap_en: "Do not let a vague promise replace a specific time.",
  },
  {
    id: "pa-ca-validation-transport-006",
    domain: "transport",
    use: "pre_integration",
    validation_vi: "Xác nhận câu giao thông khi người học cần hỏi tuyến xe và điểm xuống.",
    validation_en: "Validate the transport line when the learner needs to ask about the route and stop.",
    goal_vi: "Hỏi đúng hướng xe và nơi cần xuống.",
    goal_en: "Ask for the correct bus direction and where to get off.",
    phrase_pa: "ਕੀ ਇਹ ਬੱਸ ਡਾਊਨਟਾਊਨ ਜਾਂਦੀ ਹੈ? ਮੈਨੂੰ ਇੱਥੇ ਉਤਰਨਾ ਹੈ।",
    romanization: "ki ih bus downtown jandi hai? mainu ithe utarna hai.",
    meaning_vi: "Xe buýt này có đi trung tâm không? Tôi cần xuống ở đây.",
    meaning_en: "Does this bus go downtown? I need to get off here.",
    support_pa: ["ਮੈਂ ਰਸਤਾ ਭੁੱਲ ਗਿਆ/ਗਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    final_check_vi: "Pre-integration xác nhận câu nối được với phần chỉ đường và lịch trình.",
    final_check_en: "Pre-integration confirms the line connects to directions and schedule content.",
    canada_example_vi: "Dùng ở bến xe buýt Canada khi tuyến làm bạn lúng túng.",
    canada_example_en: "Use at a Canadian bus stop when the route is confusing.",
    learner_trap_vi: "Đừng hỏi quá chung nếu bạn cần một trạm cụ thể.",
    learner_trap_en: "Do not ask too generally if you need a specific stop.",
  },
  {
    id: "pa-ca-validation-public-office-007",
    domain: "public_office",
    use: "cross_check",
    validation_vi: "Xác nhận câu cơ quan công khi người học cần biết quầy và giấy tờ.",
    validation_en: "Validate the public-office line when the learner needs the correct counter and documents.",
    goal_vi: "Hỏi quầy đúng và danh sách giấy tờ cần thiết.",
    goal_en: "Ask for the right counter and the required document list.",
    phrase_pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ? ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?",
    romanization: "mainu kis counter te jana chahida hai? mainu kihre dastavez chahide han?",
    meaning_vi: "Tôi nên đến quầy nào? Tôi cần giấy tờ nào?",
    meaning_en: "Which counter should I go to? Which documents do I need?",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਨੰਬਰ ਲਿਖ ਦਿਓ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    final_check_vi: "Cross-check xác nhận câu nối được với form và quầy dịch vụ.",
    final_check_en: "The cross-check confirms the line connects to form and service-counter flows.",
    canada_example_vi: "Dùng ở trung tâm dịch vụ Canada khi bạn bị chuyển quầy nhiều lần.",
    canada_example_en: "Use at a Canadian service centre when you are sent between counters.",
    learner_trap_vi: "ਦਸਤਾਵੇਜ਼ là giấy tờ; đừng tự đoán thủ tục.",
    learner_trap_en: "ਦਸਤਾਵੇਜ਼ means documents; do not guess the process.",
  },
  {
    id: "pa-ca-validation-forms-008",
    domain: "forms_service_desk",
    use: "final_validation",
    validation_vi: "Xác nhận câu bàn dịch vụ khi người học cần chỉ phần form chưa hiểu.",
    validation_en: "Validate the service-desk line when the learner needs to show the unclear form section.",
    goal_vi: "Chỉ đúng phần kẹt và xin hướng dẫn lại.",
    goal_en: "Point to the stuck part and ask to be shown again.",
    phrase_pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਹਿੱਸਾ ਦਿਖਾਓ। ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਸਮਝ ਨਹੀਂ ਆਇਆ।",
    romanization: "kirpa karke ih hissa dikhao. mainu ih form samajh nahin aaya.",
    meaning_vi: "Làm ơn chỉ phần này. Tôi chưa hiểu mẫu đơn này.",
    meaning_en: "Please show this part. I did not understand this form.",
    support_pa: ["ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    final_check_vi: "Final-validation xác nhận câu form đủ rõ trước khi ghép vào luồng cuối.",
    final_check_en: "Final validation confirms the form line is clear before final flow linking.",
    canada_example_vi: "Dùng ở quầy dịch vụ Canada khi bạn cần hoàn tất form.",
    canada_example_en: "Use at a Canadian service desk when you need to complete a form.",
    learner_trap_vi: "Đừng nói chung chung nếu chỉ một phần form bị kẹt.",
    learner_trap_en: "Do not speak vaguely if only one form section is the problem.",
  },
  {
    id: "pa-ca-validation-interpreter-009",
    domain: "interpreter_request",
    use: "handoff_check",
    validation_vi: "Xác nhận câu xin thông dịch viên khi tình huống vượt quá mức hiểu.",
    validation_en: "Validate the interpreter request when the situation exceeds the learner's understanding.",
    goal_vi: "Xin hỗ trợ ngôn ngữ trước khi tiếp tục.",
    goal_en: "Request language support before continuing.",
    phrase_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।",
    romanization: "mainu dubhashiye di lor hai. kirpa karke hauli hauli bolo.",
    meaning_vi: "Tôi cần thông dịch viên. Làm ơn nói chậm hơn.",
    meaning_en: "I need an interpreter. Please speak more slowly.",
    support_pa: ["ਮੈਂ ਅੰਗਰੇਜ਼ੀ/ਵਿਯਤਨਾਮੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    final_check_vi: "Handoff check xác nhận Shahmukhi chỉ là nhận biết, không phải khóa học đầy đủ.",
    final_check_en: "The handoff check confirms Shahmukhi is awareness only, not a full course.",
    canada_example_vi: "Dùng ở phòng khám, trường, cơ quan công hoặc ngân hàng Canada.",
    canada_example_en: "Use at a Canadian clinic, school, public office, or bank.",
    learner_trap_vi: "Đừng chờ đến cuối cuộc hẹn mới xin hỗ trợ ngôn ngữ.",
    learner_trap_en: "Do not wait until the end of the appointment to ask for language support.",
  },
  {
    id: "pa-ca-validation-emergency-010",
    domain: "emergency_boundary",
    use: "cross_check",
    validation_vi: "Xác nhận câu khẩn cấp khi có nguy hiểm thật sự và cần gọi 911.",
    validation_en: "Validate the emergency line when there is real danger and 911 is needed.",
    goal_vi: "Giữ câu khẩn cấp ngắn, rõ, và đúng ranh giới.",
    goal_en: "Keep the emergency line short, clear, and bounded.",
    phrase_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    romanization: "ih emergency hai. kirpa karke nau-ikk-ikk te call karo.",
    meaning_vi: "Đây là trường hợp khẩn cấp. Làm ơn gọi 911.",
    meaning_en: "This is an emergency. Please call 911.",
    support_pa: ["ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", "ਮੈਂ ਸੁਰੱਖਿਅਤ ਨਹੀਂ ਹਾਂ।"],
    final_check_vi: "Cross-check giữ câu khẩn cấp rõ và không thay thế dịch vụ khẩn cấp.",
    final_check_en: "The cross-check keeps the emergency line clear and does not replace emergency services.",
    canada_example_vi: "Ở Canada, dùng câu này khi có nguy hiểm thật sự và cần gọi 911.",
    canada_example_en: "In Canada, use this line when there is real danger and 911 is needed.",
    learner_trap_vi: "Đừng dùng câu khẩn cấp cho việc thường ngày.",
    learner_trap_en: "Do not use the emergency line for routine issues.",
  },
  {
    id: "pa-ca-validation-workplace-011",
    domain: "workplace_safety",
    use: "pre_integration",
    validation_vi: "Xác nhận câu nơi làm việc khi người học chưa hiểu hướng dẫn an toàn.",
    validation_en: "Validate the workplace line when the learner did not understand a safety instruction.",
    goal_vi: "Xin nhắc lại trước khi làm việc chưa hiểu.",
    goal_en: "Ask for a repeat before doing the task you did not understand.",
    phrase_pa: "ਮੈਨੂੰ ਸੁਰੱਖਿਆ ਹਦਾਇਤ ਸਮਝ ਨਹੀਂ ਆਈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਦੱਸੋ।",
    romanization: "mainu surakhia hadayat samajh nahin aayi. kirpa karke dubara daso.",
    meaning_vi: "Tôi chưa hiểu hướng dẫn an toàn. Làm ơn nói lại.",
    meaning_en: "I did not understand the safety instruction. Please tell me again.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।", "ਕੀ ਤੁਸੀਂ ਇਹ ਦਿਖਾ ਸਕਦੇ ਹੋ?"],
    final_check_vi: "Pre-integration giữ câu ở mức xin làm rõ ngôn ngữ, không đưa hướng dẫn kỹ thuật.",
    final_check_en: "Pre-integration keeps this as language clarification, not technical instruction.",
    canada_example_vi: "Dùng ở nơi làm việc Canada trước khi làm việc bạn chưa hiểu.",
    canada_example_en: "Use at a Canadian workplace before doing a task you did not understand.",
    learner_trap_vi: "Đừng bắt đầu việc nếu hướng dẫn an toàn chưa rõ.",
    learner_trap_en: "Do not start the task if the safety instruction is unclear.",
  },
];

export default PUNJABI_CANADA_SURVIVAL_FINAL_VALIDATION_SET;
