// Punjabi Canada survival acceptance samples for Vietnamese-speaking
// and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner bridge only. Shahmukhi is
// awareness only, not a full course. Native review is deferred.

export type PunjabiCanadaSurvivalAcceptanceDomain =
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
  | "service_recovery"
  | "workplace_safety";

export type PunjabiCanadaSurvivalAcceptanceUse =
  | "acceptance"
  | "closure_validation"
  | "pre_integration"
  | "handoff_check";

export type PunjabiCanadaSurvivalAcceptanceItem = {
  id: string;
  domain: PunjabiCanadaSurvivalAcceptanceDomain;
  use: PunjabiCanadaSurvivalAcceptanceUse;
  acceptance_vi: string;
  acceptance_en: string;
  goal_vi: string;
  goal_en: string;
  phrase_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  support_pa: string[];
  acceptance_check_vi: string;
  acceptance_check_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaSurvivalAcceptanceScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundaries: string[];
};

export const PUNJABI_CANADA_SURVIVAL_ACCEPTANCE_SCOPE: PunjabiCanadaSurvivalAcceptanceScope = {
  name: "Punjabi Canada Survival Acceptance Samples",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundaries: [
    "Language support only for Canada survival acceptance samples.",
    "No medical, legal, financial, tenancy, or workplace safety advice.",
  ],
};

export const PUNJABI_CANADA_SURVIVAL_ACCEPTANCE_SAMPLES: PunjabiCanadaSurvivalAcceptanceItem[] = [
  {
    id: "pa-ca-acceptance-clinic-001",
    domain: "clinic",
    use: "acceptance",
    acceptance_vi: "Đóng kiểm câu phòng khám khi người học cần xin giải thích chậm trước khi trả lời.",
    acceptance_en: "Close-check the clinic line when the learner needs slower explanation before answering.",
    goal_vi: "Giữ câu xin nói chậm nối được với luồng phòng khám.",
    goal_en: "Keep the slow-speech request connected to the clinic flow.",
    phrase_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਸਮਝਾਓ।",
    romanization: "mainu samajh nahin aaya. kirpa karke hauli hauli samjhao.",
    meaning_vi: "Tôi chưa hiểu. Làm ơn giải thích chậm hơn.",
    meaning_en: "I did not understand. Please explain more slowly.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।", "ਮੈਨੂੰ ਇੱਥੇ ਦਰਦ ਹੈ।"],
    acceptance_check_vi: "Acceptance giữ câu ở mức hỗ trợ ngôn ngữ, không đưa lời khuyên y tế.",
    acceptance_check_en: "Acceptance keeps this as language support, not medical advice.",
    canada_example_vi: "Dùng ở phòng khám Canada khi quầy tiếp nhận nói quá nhanh.",
    canada_example_en: "Use at a Canadian clinic when reception speaks too quickly.",
    learner_trap_vi: "Đừng gật đầu nếu bạn chưa hiểu hướng dẫn.",
    learner_trap_en: "Do not nod if you did not understand the instruction.",
  },
  {
    id: "pa-ca-acceptance-pharmacy-002",
    domain: "pharmacy",
    use: "closure_validation",
    acceptance_vi: "Đóng kiểm câu nhà thuốc để người học nêu dị ứng và xin ghi lại thông tin.",
    acceptance_en: "Close-check the pharmacy line so the learner can state an allergy and ask for writing.",
    goal_vi: "Nêu dị ứng rõ ràng và không đoán tên thuốc.",
    goal_en: "State the allergy clearly and avoid guessing medicine names.",
    phrase_pa: "ਮੈਨੂੰ ਦਵਾਈ ਤੋਂ ਐਲਰਜੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।",
    romanization: "mainu davai ton allergy hai. kirpa karke ih likh dio.",
    meaning_vi: "Tôi bị dị ứng với thuốc. Làm ơn viết điều này ra.",
    meaning_en: "I am allergic to medicine. Please write this down.",
    support_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    acceptance_check_vi: "Closure-validation xác nhận câu không thêm liều lượng hoặc hướng dẫn thuốc.",
    acceptance_check_en: "The closure validation confirms the line does not add dosage or medicine instructions.",
    canada_example_vi: "Dùng ở nhà thuốc Canada khi cần xác nhận thông tin bằng văn bản.",
    canada_example_en: "Use at a Canadian pharmacy when written confirmation is needed.",
    learner_trap_vi: "Đừng tự thêm cách dùng thuốc vào câu học ngôn ngữ.",
    learner_trap_en: "Do not add medicine-use directions to a language-learning line.",
  },
  {
    id: "pa-ca-acceptance-school-003",
    domain: "school_childcare",
    use: "pre_integration",
    acceptance_vi: "Đóng kiểm câu form dùng được cho trường và childcare khi người học bị kẹt.",
    acceptance_en: "Close-check the form line for school and childcare when the learner is stuck.",
    goal_vi: "Chỉ đúng phần form chưa hiểu trước khi nộp.",
    goal_en: "Point to the exact unclear form section before submitting.",
    phrase_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਹ ਹਿੱਸਾ ਦਿਖਾ ਸਕਦੇ ਹੋ?",
    romanization: "mainu ih form bharan vich madad chahidi hai. ki tusin ih hissa dikha sakde ho?",
    meaning_vi: "Tôi cần giúp điền mẫu đơn này. Bạn có thể chỉ phần này không?",
    meaning_en: "I need help filling out this form. Can you show this part?",
    support_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਨੋਟ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਦੇ ਸਕਦੇ ਹੋ?", "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ।"],
    acceptance_check_vi: "Pre-integration xác nhận câu nối được với trường, childcare, và form.",
    acceptance_check_en: "Pre-integration confirms the line connects to school, childcare, and form flows.",
    canada_example_vi: "Dùng ở trường hoặc childcare Canada khi form làm bạn kẹt.",
    canada_example_en: "Use at a Canadian school or childcare centre when a form stalls you.",
    learner_trap_vi: "Đừng nộp form im lặng nếu phần bắt buộc chưa rõ.",
    learner_trap_en: "Do not submit silently if a required section is unclear.",
  },
  {
    id: "pa-ca-acceptance-bank-004",
    domain: "bank",
    use: "handoff_check",
    acceptance_vi: "Đóng kiểm câu ngân hàng giữ mục tiêu mở tài khoản và hỏi phí.",
    acceptance_en: "Close-check the bank line so it keeps the account-opening and fee goal.",
    goal_vi: "Nói mục tiêu chính mà không chuyển sang tư vấn tài chính.",
    goal_en: "State the main goal without shifting into financial advice.",
    phrase_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਹੈ। ਫੀਸ ਕਿੰਨੀ ਹੈ?",
    romanization: "mainu bank khata kholhna hai. fees kinni hai?",
    meaning_vi: "Tôi muốn mở tài khoản ngân hàng. Phí là bao nhiêu?",
    meaning_en: "I want to open a bank account. How much is the fee?",
    support_pa: ["ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    acceptance_check_vi: "Handoff check xác nhận câu không trôi sang thẻ, vay, hoặc lời khuyên tiền bạc.",
    acceptance_check_en: "The handoff check confirms the line does not drift to cards, loans, or money advice.",
    canada_example_vi: "Ở quầy ngân hàng Canada, câu này đủ ngắn để dùng ngay.",
    canada_example_en: "At a Canadian bank counter, this is short enough to use immediately.",
    learner_trap_vi: "ਖਾਤਾ là tài khoản; đừng đổi mục tiêu giữa câu.",
    learner_trap_en: "ਖਾਤਾ means account; do not change goals mid-line.",
  },
  {
    id: "pa-ca-acceptance-housing-005",
    domain: "housing",
    use: "acceptance",
    acceptance_vi: "Đóng kiểm câu nhà thuê khi cần thời gian sửa và phản hồi bằng văn bản.",
    acceptance_en: "Close-check the rental line when repair timing and a written reply are needed.",
    goal_vi: "Xin lịch sửa rõ ràng và giữ ranh giới hỗ trợ ngôn ngữ.",
    goal_en: "Ask for a clear repair timeline and keep a language-support boundary.",
    phrase_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਲਈ ਸਮਾਂ ਦੱਸੋ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਕੇ ਭੇਜੋ।",
    romanization: "kirpa karke murammat lai samah daso. kirpa karke ih likh ke bhejo.",
    meaning_vi: "Làm ơn cho biết thời gian sửa chữa. Làm ơn gửi điều này bằng văn bản.",
    meaning_en: "Please give a repair time. Please send this in writing.",
    support_pa: ["ਹੀਟਿੰਗ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    acceptance_check_vi: "Acceptance không biến câu sửa chữa thành tư vấn luật thuê nhà.",
    acceptance_check_en: "Acceptance does not turn the repair line into tenancy advice.",
    canada_example_vi: "Dùng ở nhà thuê Canada khi cần lịch sửa rõ ràng.",
    canada_example_en: "Use in a Canadian rental when a clear repair timeline is needed.",
    learner_trap_vi: "Đừng để lời hứa chung thay cho thời gian cụ thể.",
    learner_trap_en: "Do not let a vague promise replace a specific time.",
  },
  {
    id: "pa-ca-acceptance-transport-006",
    domain: "transport",
    use: "pre_integration",
    acceptance_vi: "Đóng kiểm câu giao thông khi người học cần hỏi tuyến xe và điểm xuống.",
    acceptance_en: "Close-check the transport line when the learner needs route and stop confirmation.",
    goal_vi: "Hỏi đúng hướng xe và nơi cần xuống.",
    goal_en: "Ask for the correct bus direction and where to get off.",
    phrase_pa: "ਕੀ ਇਹ ਬੱਸ ਡਾਊਨਟਾਊਨ ਜਾਂਦੀ ਹੈ? ਮੈਨੂੰ ਇੱਥੇ ਉਤਰਨਾ ਹੈ।",
    romanization: "ki ih bus downtown jandi hai? mainu ithe utarna hai.",
    meaning_vi: "Xe buýt này có đi trung tâm không? Tôi cần xuống ở đây.",
    meaning_en: "Does this bus go downtown? I need to get off here.",
    support_pa: ["ਮੈਂ ਰਸਤਾ ਭੁੱਲ ਗਿਆ/ਗਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    acceptance_check_vi: "Pre-integration xác nhận câu nối được với phần chỉ đường và lịch trình.",
    acceptance_check_en: "Pre-integration confirms the line connects to directions and schedule content.",
    canada_example_vi: "Dùng ở bến xe buýt Canada khi tuyến làm bạn lúng túng.",
    canada_example_en: "Use at a Canadian bus stop when the route is confusing.",
    learner_trap_vi: "Đừng hỏi quá chung nếu bạn cần một trạm cụ thể.",
    learner_trap_en: "Do not ask too generally if you need a specific stop.",
  },
  {
    id: "pa-ca-acceptance-public-office-007",
    domain: "public_office",
    use: "closure_validation",
    acceptance_vi: "Đóng kiểm câu cơ quan công khi người học cần biết quầy và giấy tờ.",
    acceptance_en: "Close-check the public-office line when the learner needs the right counter and documents.",
    goal_vi: "Hỏi quầy đúng và danh sách giấy tờ cần thiết.",
    goal_en: "Ask for the right counter and the required document list.",
    phrase_pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ? ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?",
    romanization: "mainu kis counter te jana chahida hai? mainu kihre dastavez chahide han?",
    meaning_vi: "Tôi nên đến quầy nào? Tôi cần giấy tờ nào?",
    meaning_en: "Which counter should I go to? Which documents do I need?",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਨੰਬਰ ਲਿਖ ਦਿਓ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    acceptance_check_vi: "Closure-validation xác nhận câu nối được với form và quầy dịch vụ.",
    acceptance_check_en: "The closure validation confirms the line connects to form and service-counter flows.",
    canada_example_vi: "Dùng ở trung tâm dịch vụ Canada khi bạn bị chuyển quầy nhiều lần.",
    canada_example_en: "Use at a Canadian service centre when you are sent between counters.",
    learner_trap_vi: "ਦਸਤਾਵੇਜ਼ là giấy tờ; đừng tự đoán thủ tục.",
    learner_trap_en: "ਦਸਤਾਵੇਜ਼ means documents; do not guess the process.",
  },
  {
    id: "pa-ca-acceptance-forms-008",
    domain: "forms_service_desk",
    use: "acceptance",
    acceptance_vi: "Đóng kiểm câu bàn dịch vụ khi người học cần chỉ phần form chưa hiểu.",
    acceptance_en: "Close-check the service-desk line when the learner needs to show the unclear form section.",
    goal_vi: "Chỉ đúng phần kẹt và xin hướng dẫn lại.",
    goal_en: "Point to the stuck part and ask to be shown again.",
    phrase_pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਹਿੱਸਾ ਦਿਖਾਓ। ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਸਮਝ ਨਹੀਂ ਆਇਆ।",
    romanization: "kirpa karke ih hissa dikhao. mainu ih form samajh nahin aaya.",
    meaning_vi: "Làm ơn chỉ phần này. Tôi chưa hiểu mẫu đơn này.",
    meaning_en: "Please show this part. I did not understand this form.",
    support_pa: ["ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    acceptance_check_vi: "Acceptance xác nhận câu form đủ rõ trước khi ghép vào luồng cuối.",
    acceptance_check_en: "Acceptance confirms the form line is clear before final flow linking.",
    canada_example_vi: "Dùng ở quầy dịch vụ Canada khi bạn cần hoàn tất form.",
    canada_example_en: "Use at a Canadian service desk when you need to complete a form.",
    learner_trap_vi: "Đừng nói chung chung nếu chỉ một phần form bị kẹt.",
    learner_trap_en: "Do not speak vaguely if only one form section is the problem.",
  },
  {
    id: "pa-ca-acceptance-interpreter-009",
    domain: "interpreter_request",
    use: "handoff_check",
    acceptance_vi: "Đóng kiểm câu xin thông dịch viên khi tình huống vượt quá mức hiểu.",
    acceptance_en: "Close-check the interpreter request when the situation exceeds the learner's understanding.",
    goal_vi: "Xin hỗ trợ ngôn ngữ trước khi tiếp tục.",
    goal_en: "Request language support before continuing.",
    phrase_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।",
    romanization: "mainu dubhashiye di lor hai. kirpa karke hauli hauli bolo.",
    meaning_vi: "Tôi cần thông dịch viên. Làm ơn nói chậm hơn.",
    meaning_en: "I need an interpreter. Please speak more slowly.",
    support_pa: ["ਮੈਂ ਅੰਗਰੇਜ਼ੀ/ਵਿਯਤਨਾਮੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    acceptance_check_vi: "Handoff check xác nhận Shahmukhi chỉ là nhận biết, không phải khóa học đầy đủ.",
    acceptance_check_en: "The handoff check confirms Shahmukhi is awareness only, not a full course.",
    canada_example_vi: "Dùng ở phòng khám, trường, cơ quan công hoặc ngân hàng Canada.",
    canada_example_en: "Use at a Canadian clinic, school, public office, or bank.",
    learner_trap_vi: "Đừng chờ đến cuối cuộc hẹn mới xin hỗ trợ ngôn ngữ.",
    learner_trap_en: "Do not wait until the end of the appointment to ask for language support.",
  },
  {
    id: "pa-ca-acceptance-emergency-010",
    domain: "emergency_boundary",
    use: "closure_validation",
    acceptance_vi: "Đóng kiểm câu khẩn cấp khi có nguy hiểm thật sự và cần gọi 911.",
    acceptance_en: "Close-check the emergency line when there is real danger and 911 is needed.",
    goal_vi: "Giữ câu khẩn cấp ngắn, rõ, và đúng ranh giới.",
    goal_en: "Keep the emergency line short, clear, and bounded.",
    phrase_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    romanization: "ih emergency hai. kirpa karke nau-ikk-ikk te call karo.",
    meaning_vi: "Đây là trường hợp khẩn cấp. Làm ơn gọi 911.",
    meaning_en: "This is an emergency. Please call 911.",
    support_pa: ["ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", "ਮੈਂ ਸੁਰੱਖਿਅਤ ਨਹੀਂ ਹਾਂ।"],
    acceptance_check_vi: "Closure-validation giữ câu khẩn cấp rõ và không thay thế dịch vụ khẩn cấp.",
    acceptance_check_en: "The closure validation keeps the emergency line clear and does not replace emergency services.",
    canada_example_vi: "Ở Canada, dùng câu này khi có nguy hiểm thật sự và cần gọi 911.",
    canada_example_en: "In Canada, use this line when there is real danger and 911 is needed.",
    learner_trap_vi: "Đừng dùng câu khẩn cấp cho việc thường ngày.",
    learner_trap_en: "Do not use the emergency line for routine issues.",
  },
  {
    id: "pa-ca-acceptance-recovery-011",
    domain: "service_recovery",
    use: "acceptance",
    acceptance_vi: "Đóng kiểm câu phục hồi dịch vụ khi thông tin sai hoặc chưa khớp.",
    acceptance_en: "Close-check the service-recovery line when information is wrong or does not match.",
    goal_vi: "Xin kiểm tra lại lịch sự và không đổ lỗi.",
    goal_en: "Ask for a polite re-check without blaming.",
    phrase_pa: "ਮਾਫ਼ ਕਰਨਾ, ਇਹ ਜਾਣਕਾਰੀ ਠੀਕ ਨਹੀਂ ਲੱਗਦੀ। ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਚੈੱਕ ਕਰ ਸਕਦੇ ਹੋ?",
    romanization: "maaf karna, ih jankari thik nahin lagdi. ki tusin dubara check kar sakde ho?",
    meaning_vi: "Xin lỗi, thông tin này có vẻ chưa đúng. Bạn có thể kiểm tra lại không?",
    meaning_en: "Sorry, this information does not seem right. Can you check again?",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    acceptance_check_vi: "Acceptance xác nhận câu sửa lỗi vẫn lịch sự và thực tế.",
    acceptance_check_en: "Acceptance confirms the correction line stays polite and practical.",
    canada_example_vi: "Dùng ở quầy dịch vụ Canada khi thông tin trên giấy không khớp.",
    canada_example_en: "Use at a Canadian service desk when the written information does not match.",
    learner_trap_vi: "Đừng bắt đầu bằng lời buộc tội nếu mục tiêu là kiểm tra lại.",
    learner_trap_en: "Do not start with an accusation if the goal is to re-check.",
  },
  {
    id: "pa-ca-acceptance-workplace-012",
    domain: "workplace_safety",
    use: "pre_integration",
    acceptance_vi: "Đóng kiểm câu nơi làm việc khi người học chưa hiểu hướng dẫn an toàn.",
    acceptance_en: "Close-check the workplace line when the learner did not understand a safety instruction.",
    goal_vi: "Xin nhắc lại trước khi làm việc chưa hiểu.",
    goal_en: "Ask for a repeat before doing the task you did not understand.",
    phrase_pa: "ਮੈਨੂੰ ਸੁਰੱਖਿਆ ਹਦਾਇਤ ਸਮਝ ਨਹੀਂ ਆਈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਦੱਸੋ।",
    romanization: "mainu surakhia hadayat samajh nahin aayi. kirpa karke dubara daso.",
    meaning_vi: "Tôi chưa hiểu hướng dẫn an toàn. Làm ơn nói lại.",
    meaning_en: "I did not understand the safety instruction. Please tell me again.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।", "ਕੀ ਤੁਸੀਂ ਇਹ ਦਿਖਾ ਸਕਦੇ ਹੋ?"],
    acceptance_check_vi: "Pre-integration giữ câu ở mức xin làm rõ ngôn ngữ, không đưa hướng dẫn kỹ thuật.",
    acceptance_check_en: "Pre-integration keeps this as language clarification, not technical instruction.",
    canada_example_vi: "Dùng ở nơi làm việc Canada trước khi làm việc bạn chưa hiểu.",
    canada_example_en: "Use at a Canadian workplace before doing a task you did not understand.",
    learner_trap_vi: "Đừng bắt đầu việc nếu hướng dẫn an toàn chưa rõ.",
    learner_trap_en: "Do not start the task if the safety instruction is unclear.",
  },
];

export default PUNJABI_CANADA_SURVIVAL_ACCEPTANCE_SAMPLES;
