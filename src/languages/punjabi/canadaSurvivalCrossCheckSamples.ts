// Punjabi Canada survival cross-check samples for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner bridge only. Shahmukhi is
// awareness only, not a full course. Native review is deferred.

export type PunjabiCanadaSurvivalCrossCheckDomain =
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

export type PunjabiCanadaSurvivalCrossCheckUse =
  | "cross_check"
  | "verification"
  | "pre_integration"
  | "handoff_check";

export type PunjabiCanadaSurvivalCrossCheckItem = {
  id: string;
  domain: PunjabiCanadaSurvivalCrossCheckDomain;
  use: PunjabiCanadaSurvivalCrossCheckUse;
  cross_check_vi: string;
  cross_check_en: string;
  goal_vi: string;
  goal_en: string;
  phrase_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  support_pa: string[];
  verification_vi: string;
  verification_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaSurvivalCrossCheckScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundaries: string[];
};

export const PUNJABI_CANADA_SURVIVAL_CROSS_CHECK_SCOPE: PunjabiCanadaSurvivalCrossCheckScope = {
  name: "Punjabi Canada Survival Cross-Check Samples",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundaries: [
    "Language support only for Canada survival cross-check samples.",
    "No medical, legal, financial, tenancy, or workplace safety advice.",
  ],
};

export const PUNJABI_CANADA_SURVIVAL_CROSS_CHECK_SAMPLES: PunjabiCanadaSurvivalCrossCheckItem[] = [
  {
    id: "pa-ca-cross-clinic-001",
    domain: "clinic",
    use: "cross_check",
    cross_check_vi: "Kiểm câu phòng khám khi nhân viên nói nhanh và người học cần xin giải thích chậm.",
    cross_check_en: "Check the clinic line when staff speak quickly and the learner needs slower explanation.",
    goal_vi: "Xác minh câu xin nói chậm kết nối được với luồng phòng khám.",
    goal_en: "Verify that the slow-speech request connects to a clinic flow.",
    phrase_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਸਮਝਾਓ।",
    romanization: "mainu samajh nahin aaya. kirpa karke hauli hauli samjhao.",
    meaning_vi: "Tôi chưa hiểu. Làm ơn giải thích chậm hơn.",
    meaning_en: "I did not understand. Please explain more slowly.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।", "ਮੈਨੂੰ ਇੱਥੇ ਦਰਦ ਹੈ।"],
    verification_vi: "Cross-check giữ câu ở mức hỗ trợ ngôn ngữ, không đưa lời khuyên y tế.",
    verification_en: "The cross-check keeps this as language support, not medical advice.",
    canada_example_vi: "Dùng ở phòng khám Canada khi quầy tiếp nhận nói quá nhanh.",
    canada_example_en: "Use at a Canadian clinic when reception speaks too quickly.",
    learner_trap_vi: "Đừng gật đầu nếu bạn chưa hiểu câu hỏi.",
    learner_trap_en: "Do not nod if you did not understand the question.",
  },
  {
    id: "pa-ca-cross-pharmacy-002",
    domain: "pharmacy",
    use: "verification",
    cross_check_vi: "Kiểm câu nhà thuốc để người học nêu dị ứng và xin ghi lại.",
    cross_check_en: "Check the pharmacy line so the learner can state an allergy and ask for writing.",
    goal_vi: "Xác minh câu dị ứng rõ trước khi nối với phần nhà thuốc.",
    goal_en: "Verify the allergy line before connecting it to pharmacy content.",
    phrase_pa: "ਮੈਨੂੰ ਦਵਾਈ ਤੋਂ ਐਲਰਜੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।",
    romanization: "mainu davai ton allergy hai. kirpa karke ih likh dio.",
    meaning_vi: "Tôi bị dị ứng với thuốc. Làm ơn viết điều này ra.",
    meaning_en: "I am allergic to medicine. Please write this down.",
    support_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    verification_vi: "Verification kiểm người học không đoán tên thuốc hoặc cách dùng thuốc.",
    verification_en: "Verification checks that the learner does not guess medicine names or usage.",
    canada_example_vi: "Dùng ở nhà thuốc Canada khi cần xác nhận thông tin bằng văn bản.",
    canada_example_en: "Use at a Canadian pharmacy when written confirmation is needed.",
    learner_trap_vi: "Đừng tự thêm liều lượng vào câu học ngôn ngữ.",
    learner_trap_en: "Do not add dosage to a language-learning line.",
  },
  {
    id: "pa-ca-cross-school-003",
    domain: "school_childcare",
    use: "pre_integration",
    cross_check_vi: "Kiểm câu form cho trường và childcare trước khi đưa vào luồng lớn.",
    cross_check_en: "Check the form line for school and childcare before a larger flow.",
    goal_vi: "Xác minh người học chỉ đúng phần form chưa hiểu.",
    goal_en: "Verify that the learner points to the exact unclear form section.",
    phrase_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਹ ਹਿੱਸਾ ਦਿਖਾ ਸਕਦੇ ਹੋ?",
    romanization: "mainu ih form bharan vich madad chahidi hai. ki tusin ih hissa dikha sakde ho?",
    meaning_vi: "Tôi cần giúp điền mẫu đơn này. Bạn có thể chỉ phần này không?",
    meaning_en: "I need help filling out this form. Can you show this part?",
    support_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਨੋਟ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਦੇ ਸਕਦੇ ਹੋ?", "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ।"],
    verification_vi: "Pre-integration kiểm câu dùng được cho cả trường và childcare.",
    verification_en: "Pre-integration checks that the line works for both school and childcare.",
    canada_example_vi: "Dùng ở trường hoặc childcare Canada khi form làm bạn kẹt.",
    canada_example_en: "Use at a Canadian school or childcare centre when a form stalls you.",
    learner_trap_vi: "Đừng nộp form im lặng nếu phần bắt buộc chưa rõ.",
    learner_trap_en: "Do not submit silently if a required section is unclear.",
  },
  {
    id: "pa-ca-cross-bank-004",
    domain: "bank",
    use: "handoff_check",
    cross_check_vi: "Kiểm câu ngân hàng để người học giữ mục tiêu mở tài khoản và hỏi phí.",
    cross_check_en: "Check the bank line so the learner keeps the account-opening and fee goal.",
    goal_vi: "Xác minh câu ngắn ở quầy ngân hàng không thành tư vấn tài chính.",
    goal_en: "Verify that the short bank-counter line does not become financial advice.",
    phrase_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਹੈ। ਫੀਸ ਕਿੰਨੀ ਹੈ?",
    romanization: "mainu bank khata kholhna hai. fees kinni hai?",
    meaning_vi: "Tôi muốn mở tài khoản ngân hàng. Phí là bao nhiêu?",
    meaning_en: "I want to open a bank account. How much is the fee?",
    support_pa: ["ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    verification_vi: "Handoff check xác nhận mục tiêu không trôi sang thẻ hoặc khoản vay.",
    verification_en: "The handoff check confirms the goal does not drift to cards or loans.",
    canada_example_vi: "Ở quầy ngân hàng Canada, câu này đủ ngắn để dùng ngay.",
    canada_example_en: "At a Canadian bank counter, this is short enough to use immediately.",
    learner_trap_vi: "ਖਾਤਾ là tài khoản; đừng đổi mục tiêu giữa câu.",
    learner_trap_en: "ਖਾਤਾ means account; do not change goals mid-line.",
  },
  {
    id: "pa-ca-cross-housing-005",
    domain: "housing",
    use: "cross_check",
    cross_check_vi: "Kiểm câu nhà thuê khi cần thời gian sửa và phản hồi bằng văn bản.",
    cross_check_en: "Check the rental line when repair timing and a written reply are needed.",
    goal_vi: "Xác minh câu dịch vụ nhà ở giữ ranh giới ngôn ngữ.",
    goal_en: "Verify that the housing service line keeps a language boundary.",
    phrase_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਲਈ ਸਮਾਂ ਦੱਸੋ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਕੇ ਭੇਜੋ।",
    romanization: "kirpa karke murammat lai samah daso. kirpa karke ih likh ke bhejo.",
    meaning_vi: "Làm ơn cho biết thời gian sửa chữa. Làm ơn gửi điều này bằng văn bản.",
    meaning_en: "Please give a repair time. Please send this in writing.",
    support_pa: ["ਹੀਟਿੰਗ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    verification_vi: "Cross-check không biến câu sửa chữa thành tư vấn luật thuê nhà.",
    verification_en: "The cross-check does not turn the repair line into tenancy advice.",
    canada_example_vi: "Dùng ở nhà thuê Canada khi cần lịch sửa rõ ràng.",
    canada_example_en: "Use in a Canadian rental when a clear repair timeline is needed.",
    learner_trap_vi: "Đừng để lời hứa chung thay cho thời gian cụ thể.",
    learner_trap_en: "Do not let a vague promise replace a specific time.",
  },
  {
    id: "pa-ca-cross-transport-006",
    domain: "transport",
    use: "pre_integration",
    cross_check_vi: "Kiểm câu giao thông để người học xác nhận tuyến và nơi cần xuống.",
    cross_check_en: "Check the transport line so the learner confirms the route and stop.",
    goal_vi: "Xác minh câu hỏi tuyến xe nối được với phần chỉ đường.",
    goal_en: "Verify that the route question connects to directions content.",
    phrase_pa: "ਕੀ ਇਹ ਬੱਸ ਡਾਊਨਟਾਊਨ ਜਾਂਦੀ ਹੈ? ਮੈਨੂੰ ਇੱਥੇ ਉਤਰਨਾ ਹੈ।",
    romanization: "ki ih bus downtown jandi hai? mainu ithe utarna hai.",
    meaning_vi: "Xe buýt này có đi trung tâm không? Tôi cần xuống ở đây.",
    meaning_en: "Does this bus go downtown? I need to get off here.",
    support_pa: ["ਮੈਂ ਰਸਤਾ ਭੁੱਲ ਗਿਆ/ਗਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    verification_vi: "Pre-integration kiểm câu vẫn dùng được khi tuyến hoặc lịch thay đổi.",
    verification_en: "Pre-integration checks that the line still works when a route or schedule changes.",
    canada_example_vi: "Dùng ở bến xe buýt Canada khi tuyến làm bạn lúng túng.",
    canada_example_en: "Use at a Canadian bus stop when the route is confusing.",
    learner_trap_vi: "Đừng hỏi quá chung nếu bạn cần một trạm cụ thể.",
    learner_trap_en: "Do not ask too generally if you need a specific stop.",
  },
  {
    id: "pa-ca-cross-public-office-007",
    domain: "public_office",
    use: "verification",
    cross_check_vi: "Kiểm câu cơ quan công khi người học bị chuyển giữa các quầy.",
    cross_check_en: "Check the public-office line when the learner is sent between counters.",
    goal_vi: "Xác minh câu hỏi quầy và giấy tờ cần thiết.",
    goal_en: "Verify the counter and document question.",
    phrase_pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ? ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?",
    romanization: "mainu kis counter te jana chahida hai? mainu kihre dastavez chahide han?",
    meaning_vi: "Tôi nên đến quầy nào? Tôi cần giấy tờ nào?",
    meaning_en: "Which counter should I go to? Which documents do I need?",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਨੰਬਰ ਲਿਖ ਦਿਓ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    verification_vi: "Verification đảm bảo câu có thể nối với luồng form và quầy dịch vụ.",
    verification_en: "Verification ensures the line can connect with form and service-counter flows.",
    canada_example_vi: "Dùng ở trung tâm dịch vụ Canada khi bạn bị chuyển quầy nhiều lần.",
    canada_example_en: "Use at a Canadian service centre when you are sent between counters.",
    learner_trap_vi: "ਦਸਤਾਵੇਜ਼ là giấy tờ; đừng tự đoán thủ tục.",
    learner_trap_en: "ਦਸਤਾਵੇਜ਼ means documents; do not guess the process.",
  },
  {
    id: "pa-ca-cross-forms-008",
    domain: "forms_service_desk",
    use: "cross_check",
    cross_check_vi: "Kiểm câu bàn dịch vụ để người học chỉ đúng phần form chưa hiểu.",
    cross_check_en: "Check the service-desk line so the learner points to the unclear form section.",
    goal_vi: "Xác minh câu form đủ rõ trước khi ghép với public office.",
    goal_en: "Verify that the form line is clear before linking it to public office content.",
    phrase_pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਹਿੱਸਾ ਦਿਖਾਓ। ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਸਮਝ ਨਹੀਂ ਆਇਆ।",
    romanization: "kirpa karke ih hissa dikhao. mainu ih form samajh nahin aaya.",
    meaning_vi: "Làm ơn chỉ phần này. Tôi chưa hiểu mẫu đơn này.",
    meaning_en: "Please show this part. I did not understand this form.",
    support_pa: ["ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    verification_vi: "Cross-check kiểm câu không lẫn với yêu cầu dịch vụ khác.",
    verification_en: "The cross-check confirms the line is not mixed with another service request.",
    canada_example_vi: "Dùng ở quầy dịch vụ Canada khi bạn cần hoàn tất form.",
    canada_example_en: "Use at a Canadian service desk when you need to complete a form.",
    learner_trap_vi: "Đừng nói chung chung nếu chỉ một phần form bị kẹt.",
    learner_trap_en: "Do not speak vaguely if only one form section is the problem.",
  },
  {
    id: "pa-ca-cross-interpreter-009",
    domain: "interpreter_request",
    use: "handoff_check",
    cross_check_vi: "Kiểm câu xin thông dịch viên khi tình huống vượt quá mức hiểu.",
    cross_check_en: "Check the interpreter request when the situation exceeds the learner's understanding.",
    goal_vi: "Xác minh câu xin hỗ trợ ngôn ngữ trước khi đi tiếp.",
    goal_en: "Verify the language-support request before continuing.",
    phrase_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।",
    romanization: "mainu dubhashiye di lor hai. kirpa karke hauli hauli bolo.",
    meaning_vi: "Tôi cần thông dịch viên. Làm ơn nói chậm hơn.",
    meaning_en: "I need an interpreter. Please speak more slowly.",
    support_pa: ["ਮੈਂ ਅੰਗਰੇਜ਼ੀ/ਵਿਯਤਨਾਮੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    verification_vi: "Handoff check xác nhận Shahmukhi chỉ là nhận biết, không phải khóa học đầy đủ.",
    verification_en: "The handoff check confirms Shahmukhi is awareness only, not a full course.",
    canada_example_vi: "Dùng ở phòng khám, trường, cơ quan công hoặc ngân hàng Canada.",
    canada_example_en: "Use at a Canadian clinic, school, public office, or bank.",
    learner_trap_vi: "Đừng chờ đến cuối cuộc hẹn mới xin hỗ trợ ngôn ngữ.",
    learner_trap_en: "Do not wait until the end of the appointment to ask for language support.",
  },
  {
    id: "pa-ca-cross-emergency-010",
    domain: "emergency_boundary",
    use: "verification",
    cross_check_vi: "Kiểm câu khẩn cấp để người học có thể xin gọi 911 khi có nguy hiểm thật sự.",
    cross_check_en: "Check the emergency line so the learner can ask for 911 when there is real danger.",
    goal_vi: "Xác minh ranh giới khẩn cấp rõ và ngắn.",
    goal_en: "Verify a clear and short emergency boundary.",
    phrase_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    romanization: "ih emergency hai. kirpa karke nau-ikk-ikk te call karo.",
    meaning_vi: "Đây là trường hợp khẩn cấp. Làm ơn gọi 911.",
    meaning_en: "This is an emergency. Please call 911.",
    support_pa: ["ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", "ਮੈਂ ਸੁਰੱਖਿਅਤ ਨਹੀਂ ਹਾਂ।"],
    verification_vi: "Verification giữ câu khẩn cấp rõ và không thay thế dịch vụ khẩn cấp.",
    verification_en: "Verification keeps the emergency line clear and does not replace emergency services.",
    canada_example_vi: "Ở Canada, dùng câu này khi có nguy hiểm thật sự và cần gọi 911.",
    canada_example_en: "In Canada, use this line when there is real danger and 911 is needed.",
    learner_trap_vi: "Đừng dùng câu khẩn cấp cho việc thường ngày.",
    learner_trap_en: "Do not use the emergency line for routine issues.",
  },
  {
    id: "pa-ca-cross-workplace-011",
    domain: "workplace_safety",
    use: "pre_integration",
    cross_check_vi: "Kiểm câu nơi làm việc khi người học chưa hiểu hướng dẫn an toàn.",
    cross_check_en: "Check the workplace line when the learner did not understand a safety instruction.",
    goal_vi: "Xác minh câu xin nhắc lại trước khi làm việc.",
    goal_en: "Verify the repeat request before the learner does the task.",
    phrase_pa: "ਮੈਨੂੰ ਸੁਰੱਖਿਆ ਹਦਾਇਤ ਸਮਝ ਨਹੀਂ ਆਈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਦੱਸੋ।",
    romanization: "mainu surakhia hadayat samajh nahin aayi. kirpa karke dubara daso.",
    meaning_vi: "Tôi chưa hiểu hướng dẫn an toàn. Làm ơn nói lại.",
    meaning_en: "I did not understand the safety instruction. Please tell me again.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।", "ਕੀ ਤੁਸੀਂ ਇਹ ਦਿਖਾ ਸਕਦੇ ਹੋ?"],
    verification_vi: "Pre-integration giữ câu ở mức xin làm rõ ngôn ngữ, không đưa hướng dẫn kỹ thuật.",
    verification_en: "Pre-integration keeps this as language clarification, not technical instruction.",
    canada_example_vi: "Dùng ở nơi làm việc Canada trước khi làm việc bạn chưa hiểu.",
    canada_example_en: "Use at a Canadian workplace before doing a task you did not understand.",
    learner_trap_vi: "Đừng bắt đầu việc nếu hướng dẫn an toàn chưa rõ.",
    learner_trap_en: "Do not start the task if the safety instruction is unclear.",
  },
];

export default PUNJABI_CANADA_SURVIVAL_CROSS_CHECK_SAMPLES;
