// Punjabi Canada survival final-freeze samples for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner bridge only. Shahmukhi is
// awareness only, not a full course. Native review is deferred.

export type PunjabiCanadaSurvivalFinalFreezeDomain =
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

export type PunjabiCanadaSurvivalFinalFreezeUse =
  | "final_freeze"
  | "owner_acceptance"
  | "final_lock"
  | "pre_integration";

export type PunjabiCanadaSurvivalFinalFreezeItem = {
  id: string;
  domain: PunjabiCanadaSurvivalFinalFreezeDomain;
  use: PunjabiCanadaSurvivalFinalFreezeUse;
  final_freeze_vi: string;
  final_freeze_en: string;
  goal_vi: string;
  goal_en: string;
  phrase_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  support_pa: string[];
  final_freeze_check_vi: string;
  final_freeze_check_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaSurvivalFinalFreezeScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundaries: string[];
};

export const PUNJABI_CANADA_SURVIVAL_FINAL_FREEZE_SCOPE: PunjabiCanadaSurvivalFinalFreezeScope = {
  name: "Punjabi Canada Survival Final Freeze Samples",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundaries: [
    "Language support only for Canada survival final-freeze samples.",
    "No medical, legal, financial, tenancy, or workplace safety advice.",
  ],
};

export const PUNJABI_CANADA_SURVIVAL_FINAL_FREEZE_SAMPLES: PunjabiCanadaSurvivalFinalFreezeItem[] = [
  {
    id: "pa-ca-finalfreeze-clinic-001",
    domain: "clinic",
    use: "final_freeze",
    final_freeze_vi: "Khóa cuối câu phòng khám để người học xin nói chậm và nhắc lại trước khi trả lời.",
    final_freeze_en: "Final-freeze the clinic line so the learner can ask for slow speech and a repeat before answering.",
    goal_vi: "Xin giải thích lại mà không giả vờ đã hiểu.",
    goal_en: "Ask for another explanation without pretending to understand.",
    phrase_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "mainu samajh nahin aaya. kirpa karke hauli hauli dubara kaho.",
    meaning_vi: "Tôi chưa hiểu. Làm ơn nói lại chậm hơn.",
    meaning_en: "I did not understand. Please say it again slowly.",
    support_pa: ["ਮੈਨੂੰ ਇੱਥੇ ਦਰਦ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    final_freeze_check_vi: "Final-freeze giữ câu ở hỗ trợ ngôn ngữ, không đưa lời khuyên y tế.",
    final_freeze_check_en: "Final-freeze keeps this as language support, not medical advice.",
    canada_example_vi: "Dùng ở phòng khám Canada khi nhân viên hỏi nhanh về triệu chứng.",
    canada_example_en: "Use at a Canadian clinic when staff ask quickly about symptoms.",
    learner_trap_vi: "Đừng chỉ gật đầu nếu bạn chưa hiểu bước tiếp theo.",
    learner_trap_en: "Do not just nod if you do not understand the next step.",
  },
  {
    id: "pa-ca-finalfreeze-pharmacy-002",
    domain: "pharmacy",
    use: "final_lock",
    final_freeze_vi: "Khóa cuối câu nhà thuốc để nêu dị ứng và xin ghi thông tin bằng văn bản.",
    final_freeze_en: "Final-freeze the pharmacy line for stating an allergy and asking for written information.",
    goal_vi: "Nêu dị ứng rõ, không tự thêm hướng dẫn dùng thuốc.",
    goal_en: "State the allergy clearly without adding medicine-use directions.",
    phrase_pa: "ਮੈਨੂੰ ਦਵਾਈ ਤੋਂ ਐਲਰਜੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਜਾਣਕਾਰੀ ਲਿਖ ਦਿਓ।",
    romanization: "mainu davai ton allergy hai. kirpa karke ih jankari likh dio.",
    meaning_vi: "Tôi bị dị ứng với thuốc. Làm ơn viết thông tin này ra.",
    meaning_en: "I am allergic to medicine. Please write this information down.",
    support_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    final_freeze_check_vi: "Final-lock xác nhận câu không thêm liều lượng hoặc tư vấn thuốc.",
    final_freeze_check_en: "Final-lock confirms the line adds no dosage or medicine advice.",
    canada_example_vi: "Dùng ở nhà thuốc Canada khi cần xác nhận an toàn bằng văn bản.",
    canada_example_en: "Use at a Canadian pharmacy when written confirmation is needed.",
    learner_trap_vi: "Đừng đoán tên thuốc nếu bạn không chắc.",
    learner_trap_en: "Do not guess a medicine name if you are not sure.",
  },
  {
    id: "pa-ca-finalfreeze-school-003",
    domain: "school_childcare",
    use: "pre_integration",
    final_freeze_vi: "Khóa cuối câu trường học hoặc childcare khi phụ huynh cần hiểu thông báo.",
    final_freeze_en: "Final-freeze the school or childcare line when a parent needs to understand a notice.",
    goal_vi: "Xin giải thích phần thông báo trước khi ký hoặc nộp.",
    goal_en: "Ask for the notice section to be explained before signing or submitting.",
    phrase_pa: "ਮੈਨੂੰ ਇਹ ਨੋਟ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕੀ ਤੁਸੀਂ ਇਹ ਹਿੱਸਾ ਸਮਝਾ ਸਕਦੇ ਹੋ?",
    romanization: "mainu ih note samajh nahin aaya. ki tusin ih hissa samjha sakde ho?",
    meaning_vi: "Tôi chưa hiểu thông báo này. Bạn có thể giải thích phần này không?",
    meaning_en: "I did not understand this note. Can you explain this part?",
    support_pa: ["ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਦਿਓ।"],
    final_freeze_check_vi: "Pre-integration xác nhận câu nối được với trường, childcare, và form.",
    final_freeze_check_en: "Pre-integration confirms the line connects to school, childcare, and form flows.",
    canada_example_vi: "Dùng ở trường hoặc childcare Canada khi thông báo có phần chưa rõ.",
    canada_example_en: "Use at a Canadian school or childcare centre when a notice is unclear.",
    learner_trap_vi: "Đừng ký nếu phần bắt buộc còn mơ hồ.",
    learner_trap_en: "Do not sign if a required section is still unclear.",
  },
  {
    id: "pa-ca-finalfreeze-bank-004",
    domain: "bank",
    use: "owner_acceptance",
    final_freeze_vi: "Khóa cuối câu ngân hàng để mở tài khoản và hỏi phí mà không chuyển sang tư vấn tiền bạc.",
    final_freeze_en: "Final-freeze the bank line for opening an account and asking fees without moving into money advice.",
    goal_vi: "Nói mục tiêu ngắn gọn và xin ghi phí.",
    goal_en: "State the goal briefly and ask for fees in writing.",
    phrase_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਫੀਸ ਲਿਖ ਦਿਓ।",
    romanization: "mainu bank khata kholhna hai. kirpa karke fees likh dio.",
    meaning_vi: "Tôi muốn mở tài khoản ngân hàng. Làm ơn viết phí ra.",
    meaning_en: "I want to open a bank account. Please write down the fee.",
    support_pa: ["ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    final_freeze_check_vi: "Owner Acceptance giữ câu ngoài thẻ, vay, hoặc lời khuyên tài chính.",
    final_freeze_check_en: "Owner Acceptance keeps the line away from cards, loans, or financial advice.",
    canada_example_vi: "Dùng ở quầy ngân hàng Canada khi cần biết phí tài khoản.",
    canada_example_en: "Use at a Canadian bank counter when account fees need to be clear.",
    learner_trap_vi: "ਖਾਤਾ là tài khoản; đừng đổi mục tiêu trong cùng câu.",
    learner_trap_en: "ਖਾਤਾ means account; do not change the goal in the same line.",
  },
  {
    id: "pa-ca-finalfreeze-housing-005",
    domain: "housing",
    use: "final_freeze",
    final_freeze_vi: "Khóa cuối câu nhà thuê để xin lịch sửa và phản hồi bằng văn bản.",
    final_freeze_en: "Final-freeze the rental line for asking a repair timeline and written reply.",
    goal_vi: "Xin thời gian sửa rõ ràng nhưng không đưa tư vấn luật thuê nhà.",
    goal_en: "Ask for a clear repair time without giving tenancy advice.",
    phrase_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਦਾ ਸਮਾਂ ਦੱਸੋ ਅਤੇ ਇਹ ਲਿਖ ਕੇ ਭੇਜੋ।",
    romanization: "kirpa karke murammat da samah daso ate ih likh ke bhejo.",
    meaning_vi: "Làm ơn cho biết thời gian sửa chữa và gửi điều này bằng văn bản.",
    meaning_en: "Please give the repair time and send this in writing.",
    support_pa: ["ਹੀਟਿੰਗ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।", "ਮੈਨੂੰ ਇਹ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    final_freeze_check_vi: "Final-freeze xác nhận câu chỉ xin lịch và văn bản, không phải tư vấn pháp lý.",
    final_freeze_check_en: "Final-freeze confirms the line only asks for timing and writing, not legal advice.",
    canada_example_vi: "Dùng ở nhà thuê Canada khi cần lịch sửa rõ ràng.",
    canada_example_en: "Use in a Canadian rental when a clear repair timeline is needed.",
    learner_trap_vi: "Đừng để lời hứa chung thay cho ngày giờ cụ thể.",
    learner_trap_en: "Do not let a vague promise replace a specific date or time.",
  },
  {
    id: "pa-ca-finalfreeze-transport-006",
    domain: "transport",
    use: "pre_integration",
    final_freeze_vi: "Khóa cuối câu giao thông để hỏi đúng tuyến và điểm xuống.",
    final_freeze_en: "Final-freeze the transit line for checking the route and stop.",
    goal_vi: "Xác nhận xe đi đâu và nơi cần xuống.",
    goal_en: "Confirm where the bus goes and where to get off.",
    phrase_pa: "ਕੀ ਇਹ ਬੱਸ ਡਾਊਨਟਾਊਨ ਜਾਂਦੀ ਹੈ? ਮੈਨੂੰ ਕਿਹੜੇ ਸਟਾਪ ਤੇ ਉਤਰਨਾ ਹੈ?",
    romanization: "ki ih bus downtown jandi hai? mainu kihre stop te utarna hai?",
    meaning_vi: "Xe buýt này có đi trung tâm không? Tôi cần xuống trạm nào?",
    meaning_en: "Does this bus go downtown? Which stop should I get off at?",
    support_pa: ["ਮੈਂ ਰਸਤਾ ਭੁੱਲ ਗਿਆ/ਗਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।"],
    final_freeze_check_vi: "Pre-integration xác nhận câu nối được với chỉ đường và lịch trình.",
    final_freeze_check_en: "Pre-integration confirms the line connects to directions and schedule content.",
    canada_example_vi: "Dùng ở bến xe buýt Canada khi tuyến hoặc trạm làm bạn lúng túng.",
    canada_example_en: "Use at a Canadian bus stop when the route or stop is confusing.",
    learner_trap_vi: "Đừng hỏi quá chung nếu bạn cần một trạm cụ thể.",
    learner_trap_en: "Do not ask too generally if you need one specific stop.",
  },
  {
    id: "pa-ca-finalfreeze-public-office-007",
    domain: "public_office",
    use: "final_lock",
    final_freeze_vi: "Khóa cuối câu cơ quan công để hỏi quầy đúng và giấy tờ cần có.",
    final_freeze_en: "Final-freeze the public-office line for asking the right counter and required documents.",
    goal_vi: "Xin danh sách giấy tờ mà không tự đoán thủ tục.",
    goal_en: "Ask for the document list without guessing the process.",
    phrase_pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ? ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?",
    romanization: "mainu kis counter te jana chahida hai? mainu kihre dastavez chahide han?",
    meaning_vi: "Tôi nên đến quầy nào? Tôi cần giấy tờ nào?",
    meaning_en: "Which counter should I go to? Which documents do I need?",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਨੰਬਰ ਲਿਖ ਦਿਓ।", "ਮੈਨੂੰ ਫਾਰਮ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।"],
    final_freeze_check_vi: "Final-lock xác nhận câu dùng được ở quầy dịch vụ và form.",
    final_freeze_check_en: "Final-lock confirms the line works at a service counter and with forms.",
    canada_example_vi: "Dùng ở trung tâm dịch vụ Canada khi bạn bị chuyển quầy.",
    canada_example_en: "Use at a Canadian service centre when you are sent between counters.",
    learner_trap_vi: "ਦਸਤਾਵੇਜ਼ là giấy tờ; đừng tự điền nếu chưa rõ.",
    learner_trap_en: "ਦਸਤਾਵੇਜ਼ means documents; do not fill things in if unclear.",
  },
  {
    id: "pa-ca-finalfreeze-forms-008",
    domain: "forms_service_desk",
    use: "final_freeze",
    final_freeze_vi: "Khóa cuối câu bàn dịch vụ để chỉ phần form chưa hiểu.",
    final_freeze_en: "Final-freeze the service-desk line for pointing to the unclear form section.",
    goal_vi: "Chỉ đúng phần kẹt và xin hướng dẫn lại.",
    goal_en: "Point to the stuck part and ask to be shown again.",
    phrase_pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਹਿੱਸਾ ਦਿਖਾਓ। ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਸਮਝ ਨਹੀਂ ਆਇਆ।",
    romanization: "kirpa karke ih hissa dikhao. mainu ih form samajh nahin aaya.",
    meaning_vi: "Làm ơn chỉ phần này. Tôi chưa hiểu mẫu đơn này.",
    meaning_en: "Please show this part. I did not understand this form.",
    support_pa: ["ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    final_freeze_check_vi: "Final-freeze xác nhận câu form đủ rõ trước khi khóa nội dung.",
    final_freeze_check_en: "Final-freeze confirms the form line is clear before content freeze.",
    canada_example_vi: "Dùng ở quầy dịch vụ Canada khi form làm bạn kẹt.",
    canada_example_en: "Use at a Canadian service desk when a form stalls you.",
    learner_trap_vi: "Đừng nói chung chung nếu chỉ một phần form bị kẹt.",
    learner_trap_en: "Do not speak vaguely if only one form section is the problem.",
  },
  {
    id: "pa-ca-finalfreeze-interpreter-009",
    domain: "interpreter_request",
    use: "owner_acceptance",
    final_freeze_vi: "Khóa cuối câu xin thông dịch viên khi tình huống vượt quá mức hiểu.",
    final_freeze_en: "Final-freeze the interpreter request when the situation exceeds the learner's understanding.",
    goal_vi: "Xin hỗ trợ ngôn ngữ trước khi tiếp tục.",
    goal_en: "Request language support before continuing.",
    phrase_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।",
    romanization: "mainu dubhashiye di lor hai. kirpa karke hauli hauli bolo.",
    meaning_vi: "Tôi cần thông dịch viên. Làm ơn nói chậm hơn.",
    meaning_en: "I need an interpreter. Please speak more slowly.",
    support_pa: ["ਮੈਂ ਅੰਗਰੇਜ਼ੀ/ਵਿਯਤਨਾਮੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    final_freeze_check_vi: "Owner Acceptance xác nhận Shahmukhi chỉ là nhận biết, không phải khóa học đầy đủ.",
    final_freeze_check_en: "Owner Acceptance confirms Shahmukhi is awareness only, not a full course.",
    canada_example_vi: "Dùng ở phòng khám, trường, cơ quan công hoặc ngân hàng Canada.",
    canada_example_en: "Use at a Canadian clinic, school, public office, or bank.",
    learner_trap_vi: "Đừng chờ đến cuối cuộc hẹn mới xin hỗ trợ ngôn ngữ.",
    learner_trap_en: "Do not wait until the end of the appointment to ask for language support.",
  },
  {
    id: "pa-ca-finalfreeze-emergency-010",
    domain: "emergency_boundary",
    use: "final_lock",
    final_freeze_vi: "Khóa cuối câu khẩn cấp khi có nguy hiểm thật sự và cần gọi 911.",
    final_freeze_en: "Final-freeze the emergency line when there is real danger and 911 is needed.",
    goal_vi: "Giữ câu ngắn, rõ, và đúng ranh giới khẩn cấp.",
    goal_en: "Keep the line short, clear, and within the emergency boundary.",
    phrase_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    romanization: "ih emergency hai. kirpa karke nau-ikk-ikk te call karo.",
    meaning_vi: "Đây là trường hợp khẩn cấp. Làm ơn gọi 911.",
    meaning_en: "This is an emergency. Please call 911.",
    support_pa: ["ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", "ਮੈਂ ਸੁਰੱਖਿਅਤ ਨਹੀਂ ਹਾਂ।"],
    final_freeze_check_vi: "Final-lock giữ câu rõ và không thay thế dịch vụ khẩn cấp.",
    final_freeze_check_en: "Final-lock keeps the line clear and does not replace emergency services.",
    canada_example_vi: "Ở Canada, dùng câu này khi có nguy hiểm thật sự và cần gọi 911.",
    canada_example_en: "In Canada, use this line when there is real danger and 911 is needed.",
    learner_trap_vi: "Đừng dùng câu khẩn cấp cho việc thường ngày.",
    learner_trap_en: "Do not use the emergency line for routine issues.",
  },
  {
    id: "pa-ca-finalfreeze-recovery-011",
    domain: "service_recovery",
    use: "final_freeze",
    final_freeze_vi: "Khóa cuối câu phục hồi dịch vụ khi thông tin sai hoặc chưa khớp.",
    final_freeze_en: "Final-freeze the service-recovery line when information is wrong or does not match.",
    goal_vi: "Xin kiểm tra lại lịch sự và không đổ lỗi.",
    goal_en: "Ask for a polite re-check without blaming.",
    phrase_pa: "ਮਾਫ਼ ਕਰਨਾ, ਇਹ ਜਾਣਕਾਰੀ ਠੀਕ ਨਹੀਂ ਲੱਗਦੀ। ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਚੈੱਕ ਕਰ ਸਕਦੇ ਹੋ?",
    romanization: "maaf karna, ih jankari thik nahin lagdi. ki tusin dubara check kar sakde ho?",
    meaning_vi: "Xin lỗi, thông tin này có vẻ chưa đúng. Bạn có thể kiểm tra lại không?",
    meaning_en: "Sorry, this information does not seem right. Can you check again?",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    final_freeze_check_vi: "Final-freeze xác nhận câu sửa lỗi vẫn lịch sự và thực tế.",
    final_freeze_check_en: "Final-freeze confirms the correction line stays polite and practical.",
    canada_example_vi: "Dùng ở quầy dịch vụ Canada khi thông tin trên giấy không khớp.",
    canada_example_en: "Use at a Canadian service desk when written information does not match.",
    learner_trap_vi: "Đừng bắt đầu bằng lời buộc tội nếu mục tiêu là kiểm tra lại.",
    learner_trap_en: "Do not start with an accusation if the goal is to re-check.",
  },
  {
    id: "pa-ca-finalfreeze-workplace-012",
    domain: "workplace_safety",
    use: "pre_integration",
    final_freeze_vi: "Khóa cuối câu nơi làm việc khi người học chưa hiểu hướng dẫn an toàn.",
    final_freeze_en: "Final-freeze the workplace line when the learner did not understand a safety instruction.",
    goal_vi: "Xin nhắc lại trước khi làm việc chưa hiểu.",
    goal_en: "Ask for a repeat before doing a task you did not understand.",
    phrase_pa: "ਮੈਨੂੰ ਸੁਰੱਖਿਆ ਹਦਾਇਤ ਸਮਝ ਨਹੀਂ ਆਈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਦੱਸੋ।",
    romanization: "mainu surakhia hadayat samajh nahin aayi. kirpa karke dubara daso.",
    meaning_vi: "Tôi chưa hiểu hướng dẫn an toàn. Làm ơn nói lại.",
    meaning_en: "I did not understand the safety instruction. Please tell me again.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।", "ਕੀ ਤੁਸੀਂ ਇਹ ਦਿਖਾ ਸਕਦੇ ਹੋ?"],
    final_freeze_check_vi: "Pre-integration giữ câu ở mức xin làm rõ ngôn ngữ, không đưa hướng dẫn kỹ thuật.",
    final_freeze_check_en: "Pre-integration keeps this as language clarification, not technical instruction.",
    canada_example_vi: "Dùng ở nơi làm việc Canada trước khi làm việc bạn chưa hiểu.",
    canada_example_en: "Use at a Canadian workplace before doing a task you did not understand.",
    learner_trap_vi: "Đừng bắt đầu việc nếu hướng dẫn an toàn chưa rõ.",
    learner_trap_en: "Do not start the task if the safety instruction is unclear.",
  },
];

export default PUNJABI_CANADA_SURVIVAL_FINAL_FREEZE_SAMPLES;
