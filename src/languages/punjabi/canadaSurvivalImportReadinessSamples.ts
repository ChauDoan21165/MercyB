// Punjabi Canada survival import-readiness samples for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner bridge only. Shahmukhi is
// awareness only, not a full course. Native review is deferred.

export type PunjabiCanadaSurvivalImportReadinessDomain =
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

export type PunjabiCanadaSurvivalImportReadinessUse =
  | "import_readiness"
  | "final_regression"
  | "pre_integration"
  | "handoff_check";

export type PunjabiCanadaSurvivalImportReadinessItem = {
  id: string;
  domain: PunjabiCanadaSurvivalImportReadinessDomain;
  use: PunjabiCanadaSurvivalImportReadinessUse;
  import_vi: string;
  import_en: string;
  goal_vi: string;
  goal_en: string;
  phrase_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  support_pa: string[];
  import_check_vi: string;
  import_check_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaSurvivalImportReadinessScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundaries: string[];
};

export const PUNJABI_CANADA_SURVIVAL_IMPORT_READINESS_SCOPE: PunjabiCanadaSurvivalImportReadinessScope = {
  name: "Punjabi Canada Survival Import Readiness Samples",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundaries: [
    "Language support only for Canada survival import-readiness samples.",
    "No medical, legal, financial, tenancy, or workplace safety advice.",
  ],
};

export const PUNJABI_CANADA_SURVIVAL_IMPORT_READINESS_SAMPLES: PunjabiCanadaSurvivalImportReadinessItem[] = [
  {
    id: "pa-ca-import-clinic-001",
    domain: "clinic",
    use: "import_readiness",
    import_vi: "Quầy phòng khám hỏi nhanh và người học cần câu xin giải thích chậm trước khi tiếp tục.",
    import_en: "The clinic desk asks quickly and the learner needs a slow-explanation line before continuing.",
    goal_vi: "Nhập được câu hỗ trợ ngôn ngữ cho luồng phòng khám.",
    goal_en: "Import a language-support line for the clinic flow.",
    phrase_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਸਮਝਾਓ।",
    romanization: "mainu samajh nahin aaya. kirpa karke hauli hauli samjhao.",
    meaning_vi: "Tôi chưa hiểu. Làm ơn giải thích chậm hơn.",
    meaning_en: "I did not understand. Please explain more slowly.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।", "ਮੈਨੂੰ ਇੱਥੇ ਦਰਦ ਹੈ।"],
    import_check_vi: "Import-readiness kiểm câu phòng khám không biến thành lời khuyên y tế.",
    import_check_en: "Import-readiness checks that the clinic line does not become medical advice.",
    canada_example_vi: "Dùng ở phòng khám Canada khi nhân viên nói quá nhanh.",
    canada_example_en: "Use at a Canadian clinic when staff speak too quickly.",
    learner_trap_vi: "Đừng giả vờ hiểu nếu chỉ nghe được một nửa.",
    learner_trap_en: "Do not pretend to understand if you only heard half.",
  },
  {
    id: "pa-ca-import-pharmacy-002",
    domain: "pharmacy",
    use: "final_regression",
    import_vi: "Ở nhà thuốc, người học cần nêu dị ứng và xin ghi lại bằng câu ngắn.",
    import_en: "At the pharmacy, the learner needs to state an allergy and ask for it in writing.",
    goal_vi: "Giữ câu dị ứng rõ để nhập vào bộ survival.",
    goal_en: "Keep the allergy line clear for import into the survival set.",
    phrase_pa: "ਮੈਨੂੰ ਦਵਾਈ ਤੋਂ ਐਲਰਜੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।",
    romanization: "mainu davai ton allergy hai. kirpa karke ih likh dio.",
    meaning_vi: "Tôi bị dị ứng với thuốc. Làm ơn viết điều này ra.",
    meaning_en: "I am allergic to medicine. Please write this down.",
    support_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    import_check_vi: "Final regression xác nhận người học không đoán tên thuốc.",
    import_check_en: "The final regression confirms the learner does not guess medicine names.",
    canada_example_vi: "Dùng ở nhà thuốc Canada khi cần xác nhận thông tin bằng văn bản.",
    canada_example_en: "Use at a Canadian pharmacy when written confirmation is needed.",
    learner_trap_vi: "Đừng tự thêm liều lượng hoặc hướng dẫn dùng thuốc.",
    learner_trap_en: "Do not add dosage or medicine-use instructions yourself.",
  },
  {
    id: "pa-ca-import-school-003",
    domain: "school_childcare",
    use: "pre_integration",
    import_vi: "Trường hoặc childcare đưa form và người học cần chỉ đúng phần chưa hiểu.",
    import_en: "School or childcare gives a form and the learner needs to point to the unclear part.",
    goal_vi: "Nhập câu hỗ trợ form dùng được cho trường và childcare.",
    goal_en: "Import a form-help line usable for school and childcare.",
    phrase_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਹ ਹਿੱਸਾ ਦਿਖਾ ਸਕਦੇ ਹੋ?",
    romanization: "mainu ih form bharan vich madad chahidi hai. ki tusin ih hissa dikha sakde ho?",
    meaning_vi: "Tôi cần giúp điền mẫu đơn này. Bạn có thể chỉ phần này không?",
    meaning_en: "I need help filling out this form. Can you show this part?",
    support_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਨੋਟ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਦੇ ਸਕਦੇ ਹੋ?", "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ।"],
    import_check_vi: "Pre-integration kiểm câu đủ cụ thể trước khi vào luồng form.",
    import_check_en: "Pre-integration checks that the line is specific enough before the form flow.",
    canada_example_vi: "Dùng ở trường hoặc childcare Canada khi form làm bạn kẹt.",
    canada_example_en: "Use at a Canadian school or childcare centre when a form stalls you.",
    learner_trap_vi: "Đừng nộp form im lặng nếu chưa hiểu phần bắt buộc.",
    learner_trap_en: "Do not submit the form silently if a required section is unclear.",
  },
  {
    id: "pa-ca-import-bank-004",
    domain: "bank",
    use: "handoff_check",
    import_vi: "Tại ngân hàng, người học cần nói mở tài khoản và hỏi phí mà không xin tư vấn tài chính.",
    import_en: "At the bank, the learner needs to ask about opening an account and fees without seeking financial advice.",
    goal_vi: "Nhập câu mục tiêu ngắn cho quầy ngân hàng.",
    goal_en: "Import a short goal line for the bank counter.",
    phrase_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਹੈ। ਫੀਸ ਕਿੰਨੀ ਹੈ?",
    romanization: "mainu bank khata kholhna hai. fees kinni hai?",
    meaning_vi: "Tôi muốn mở tài khoản ngân hàng. Phí là bao nhiêu?",
    meaning_en: "I want to open a bank account. How much is the fee?",
    support_pa: ["ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    import_check_vi: "Handoff check giữ nội dung là hỗ trợ ngôn ngữ, không phải tư vấn tiền bạc.",
    import_check_en: "The handoff check keeps this as language support, not money advice.",
    canada_example_vi: "Ở quầy ngân hàng Canada, câu này đủ ngắn để dùng ngay.",
    canada_example_en: "At a Canadian bank counter, this is short enough to use immediately.",
    learner_trap_vi: "ਖਾਤਾ là tài khoản; đừng đổi sang thẻ nếu chưa cần.",
    learner_trap_en: "ਖਾਤਾ means account; do not switch to card if that is not the need.",
  },
  {
    id: "pa-ca-import-housing-005",
    domain: "housing",
    use: "import_readiness",
    import_vi: "Nhà thuê có vấn đề sửa chữa và người học cần xin thời gian cùng phản hồi bằng văn bản.",
    import_en: "A rental has a repair issue and the learner needs a repair time plus a written reply.",
    goal_vi: "Nhập câu dịch vụ nhà ở mà không đưa lời khuyên thuê nhà.",
    goal_en: "Import a housing service line without giving tenancy advice.",
    phrase_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਲਈ ਸਮਾਂ ਦੱਸੋ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਕੇ ਭੇਜੋ।",
    romanization: "kirpa karke murammat lai samah daso. kirpa karke ih likh ke bhejo.",
    meaning_vi: "Làm ơn cho biết thời gian sửa chữa. Làm ơn gửi điều này bằng văn bản.",
    meaning_en: "Please give a repair time. Please send this in writing.",
    support_pa: ["ਹੀਟਿੰਗ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    import_check_vi: "Import-readiness kiểm ranh giới dịch vụ trước khi đưa vào bộ dùng thật.",
    import_check_en: "Import-readiness checks the service boundary before real-use import.",
    canada_example_vi: "Dùng ở nhà thuê Canada khi cần lịch sửa rõ ràng.",
    canada_example_en: "Use in a Canadian rental when a clear repair timeline is needed.",
    learner_trap_vi: "Đừng biến câu này thành tranh luận pháp lý.",
    learner_trap_en: "Do not turn this line into a legal argument.",
  },
  {
    id: "pa-ca-import-transport-006",
    domain: "transport",
    use: "pre_integration",
    import_vi: "Tuyến xe thay đổi và người học cần hỏi xe có đi đúng hướng không.",
    import_en: "A route changes and the learner needs to ask whether the bus goes the right way.",
    goal_vi: "Nhập câu xác nhận tuyến và điểm xuống.",
    goal_en: "Import a route-confirmation and stop line.",
    phrase_pa: "ਕੀ ਇਹ ਬੱਸ ਡਾਊਨਟਾਊਨ ਜਾਂਦੀ ਹੈ? ਮੈਨੂੰ ਇੱਥੇ ਉਤਰਨਾ ਹੈ।",
    romanization: "ki ih bus downtown jandi hai? mainu ithe utarna hai.",
    meaning_vi: "Xe buýt này có đi trung tâm không? Tôi cần xuống ở đây.",
    meaning_en: "Does this bus go downtown? I need to get off here.",
    support_pa: ["ਮੈਂ ਰਸਤਾ ਭੁੱਲ ਗਿਆ/ਗਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    import_check_vi: "Pre-integration kiểm câu có thể nối với luồng chỉ đường.",
    import_check_en: "Pre-integration checks that the line can connect to a directions flow.",
    canada_example_vi: "Dùng ở bến xe buýt Canada khi tuyến hoặc lịch làm bạn lúng túng.",
    canada_example_en: "Use at a Canadian bus stop when a route or schedule is confusing.",
    learner_trap_vi: "Đừng chỉ hỏi downtown nếu bạn cần một trạm cụ thể.",
    learner_trap_en: "Do not only ask about downtown if you need a specific stop.",
  },
  {
    id: "pa-ca-import-public-office-007",
    domain: "public_office",
    use: "handoff_check",
    import_vi: "Cơ quan công chuyển quầy và người học cần hỏi đúng quầy cùng giấy tờ.",
    import_en: "A public office sends the learner between counters, so they need to ask for the right counter and documents.",
    goal_vi: "Nhập câu hỏi quầy và giấy tờ cần thiết.",
    goal_en: "Import a counter-and-document question.",
    phrase_pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ? ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?",
    romanization: "mainu kis counter te jana chahida hai? mainu kihre dastavez chahide han?",
    meaning_vi: "Tôi nên đến quầy nào? Tôi cần giấy tờ nào?",
    meaning_en: "Which counter should I go to? Which documents do I need?",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਨੰਬਰ ਲਿਖ ਦਿਓ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    import_check_vi: "Handoff check đảm bảo câu nhập được vào luồng cơ quan công và form.",
    import_check_en: "The handoff check ensures the line can import into public-office and form flows.",
    canada_example_vi: "Dùng ở trung tâm dịch vụ Canada khi bạn bị chuyển quầy nhiều lần.",
    canada_example_en: "Use at a Canadian service centre when you are sent between counters.",
    learner_trap_vi: "ਦਸਤਾਵੇਜ਼ là giấy tờ; đừng tự đoán thủ tục.",
    learner_trap_en: "ਦਸਤਾਵੇਜ਼ means documents; do not guess the process.",
  },
  {
    id: "pa-ca-import-forms-008",
    domain: "forms_service_desk",
    use: "final_regression",
    import_vi: "Ở bàn dịch vụ, người học cần xin chỉ lại phần form đang kẹt.",
    import_en: "At a service desk, the learner needs to ask to be shown the stuck form section again.",
    goal_vi: "Nhập câu chỉ phần form chưa hiểu.",
    goal_en: "Import a line for pointing to the unclear form section.",
    phrase_pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਹਿੱਸਾ ਦਿਖਾਓ। ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਸਮਝ ਨਹੀਂ ਆਇਆ।",
    romanization: "kirpa karke ih hissa dikhao. mainu ih form samajh nahin aaya.",
    meaning_vi: "Làm ơn chỉ phần này. Tôi chưa hiểu mẫu đơn này.",
    meaning_en: "Please show this part. I did not understand this form.",
    support_pa: ["ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    import_check_vi: "Final regression kiểm câu form đủ rõ, không lẫn với yêu cầu khác.",
    import_check_en: "The final regression checks that the form line is clear and not mixed with another request.",
    canada_example_vi: "Dùng ở quầy dịch vụ Canada khi bạn cần hoàn tất form.",
    canada_example_en: "Use at a Canadian service desk when you need to complete a form.",
    learner_trap_vi: "Đừng nói chung chung nếu chỉ một phần form bị kẹt.",
    learner_trap_en: "Do not speak vaguely if only one form section is the problem.",
  },
  {
    id: "pa-ca-import-interpreter-009",
    domain: "interpreter_request",
    use: "import_readiness",
    import_vi: "Khi tình huống vượt quá mức hiểu, người học cần xin thông dịch viên trước khi đi tiếp.",
    import_en: "When a situation exceeds the learner's understanding, they need to request an interpreter before continuing.",
    goal_vi: "Nhập câu xin hỗ trợ ngôn ngữ rõ ràng.",
    goal_en: "Import a clear language-support request.",
    phrase_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।",
    romanization: "mainu dubhashiye di lor hai. kirpa karke hauli hauli bolo.",
    meaning_vi: "Tôi cần thông dịch viên. Làm ơn nói chậm hơn.",
    meaning_en: "I need an interpreter. Please speak more slowly.",
    support_pa: ["ਮੈਂ ਅੰਗਰੇਜ਼ੀ/ਵਿਯਤਨਾਮੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    import_check_vi: "Import-readiness xác nhận đây là yêu cầu hỗ trợ, không phải bài học Shahmukhi.",
    import_check_en: "Import-readiness confirms this is a support request, not a Shahmukhi lesson.",
    canada_example_vi: "Dùng ở phòng khám, trường, cơ quan công hoặc ngân hàng Canada.",
    canada_example_en: "Use at a Canadian clinic, school, public office, or bank.",
    learner_trap_vi: "Đừng chờ đến cuối buổi hẹn mới xin hỗ trợ.",
    learner_trap_en: "Do not wait until the end of the appointment to ask for support.",
  },
  {
    id: "pa-ca-import-emergency-010",
    domain: "emergency_boundary",
    use: "pre_integration",
    import_vi: "Nếu có nguy hiểm thật sự, người học cần câu gọi 911 thật ngắn.",
    import_en: "If there is real danger, the learner needs a very short 911 line.",
    goal_vi: "Nhập câu khẩn cấp rõ ràng và không thay thế dịch vụ khẩn cấp.",
    goal_en: "Import a clear emergency line that does not replace emergency services.",
    phrase_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    romanization: "ih emergency hai. kirpa karke nau-ikk-ikk te call karo.",
    meaning_vi: "Đây là trường hợp khẩn cấp. Làm ơn gọi 911.",
    meaning_en: "This is an emergency. Please call 911.",
    support_pa: ["ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", "ਮੈਂ ਸੁਰੱਖਿਅਤ ਨਹੀਂ ਹਾਂ।"],
    import_check_vi: "Pre-integration giữ ranh giới khẩn cấp rõ trước khi nhập.",
    import_check_en: "Pre-integration keeps the emergency boundary clear before import.",
    canada_example_vi: "Ở Canada, dùng câu này khi có nguy hiểm thật sự và cần gọi 911.",
    canada_example_en: "In Canada, use this line when there is real danger and 911 is needed.",
    learner_trap_vi: "Đừng dùng câu khẩn cấp cho việc thường ngày.",
    learner_trap_en: "Do not use the emergency line for routine issues.",
  },
  {
    id: "pa-ca-import-recovery-011",
    domain: "service_recovery",
    use: "handoff_check",
    import_vi: "Khi dịch vụ bị sai hoặc thiếu, người học cần xin sửa lại bằng câu lịch sự.",
    import_en: "When service is wrong or incomplete, the learner needs a polite correction request.",
    goal_vi: "Nhập câu phục hồi dịch vụ không đổ lỗi.",
    goal_en: "Import a service-recovery line without blaming.",
    phrase_pa: "ਮਾਫ਼ ਕਰਨਾ, ਇਹ ਜਾਣਕਾਰੀ ਠੀਕ ਨਹੀਂ ਲੱਗਦੀ। ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਚੈੱਕ ਕਰ ਸਕਦੇ ਹੋ?",
    romanization: "maaf karna, ih jankari thik nahin lagdi. ki tusin dubara check kar sakde ho?",
    meaning_vi: "Xin lỗi, thông tin này có vẻ chưa đúng. Bạn có thể kiểm tra lại không?",
    meaning_en: "Sorry, this information does not seem right. Can you check again?",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    import_check_vi: "Handoff check xác nhận câu sửa lỗi vẫn lịch sự và thực tế.",
    import_check_en: "The handoff check confirms the correction line stays polite and practical.",
    canada_example_vi: "Dùng ở quầy dịch vụ Canada khi thông tin trên giấy không khớp.",
    canada_example_en: "Use at a Canadian service desk when the written information does not match.",
    learner_trap_vi: "Đừng bắt đầu bằng lời buộc tội nếu mục tiêu là kiểm tra lại.",
    learner_trap_en: "Do not start with an accusation if the goal is to re-check.",
  },
  {
    id: "pa-ca-import-workplace-012",
    domain: "workplace_safety",
    use: "final_regression",
    import_vi: "Ở nơi làm việc, người học cần nói chưa hiểu hướng dẫn an toàn trước khi làm.",
    import_en: "At work, the learner needs to say they did not understand the safety instruction before doing the task.",
    goal_vi: "Nhập câu xin làm rõ hướng dẫn an toàn bằng ngôn ngữ.",
    goal_en: "Import a language-clarification line for safety instructions.",
    phrase_pa: "ਮੈਨੂੰ ਸੁਰੱਖਿਆ ਹਦਾਇਤ ਸਮਝ ਨਹੀਂ ਆਈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਦੱਸੋ।",
    romanization: "mainu surakhia hadayat samajh nahin aayi. kirpa karke dubara daso.",
    meaning_vi: "Tôi chưa hiểu hướng dẫn an toàn. Làm ơn nói lại.",
    meaning_en: "I did not understand the safety instruction. Please tell me again.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।", "ਕੀ ਤੁਸੀਂ ਇਹ ਦਿਖਾ ਸਕਦੇ ਹੋ?"],
    import_check_vi: "Final regression giữ câu ở mức xin làm rõ ngôn ngữ, không đưa hướng dẫn kỹ thuật.",
    import_check_en: "The final regression keeps this as language clarification, not technical instruction.",
    canada_example_vi: "Dùng ở nơi làm việc Canada trước khi làm việc bạn chưa hiểu.",
    canada_example_en: "Use at a Canadian workplace before doing a task you did not understand.",
    learner_trap_vi: "Đừng bắt đầu việc nếu hướng dẫn an toàn chưa rõ.",
    learner_trap_en: "Do not start the task if the safety instruction is unclear.",
  },
];

export default PUNJABI_CANADA_SURVIVAL_IMPORT_READINESS_SAMPLES;
