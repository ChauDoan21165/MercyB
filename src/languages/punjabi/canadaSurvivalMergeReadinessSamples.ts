// Punjabi Canada survival merge-readiness samples for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner bridge only. Shahmukhi is
// awareness only, not a full course. Native review is deferred.

export type PunjabiCanadaSurvivalMergeReadinessDomain =
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

export type PunjabiCanadaSurvivalMergeReadinessUse =
  | "merge_readiness"
  | "final_regression"
  | "pre_integration"
  | "handoff_check";

export type PunjabiCanadaSurvivalMergeReadinessItem = {
  id: string;
  domain: PunjabiCanadaSurvivalMergeReadinessDomain;
  use: PunjabiCanadaSurvivalMergeReadinessUse;
  merge_vi: string;
  merge_en: string;
  goal_vi: string;
  goal_en: string;
  phrase_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  support_pa: string[];
  merge_check_vi: string;
  merge_check_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaSurvivalMergeReadinessScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundaries: string[];
};

export const PUNJABI_CANADA_SURVIVAL_MERGE_READINESS_SCOPE: PunjabiCanadaSurvivalMergeReadinessScope = {
  name: "Punjabi Canada Survival Merge Readiness Samples",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundaries: [
    "Language support only for Canada survival merge-readiness samples.",
    "No medical, legal, financial, tenancy, or workplace safety advice.",
  ],
};

export const PUNJABI_CANADA_SURVIVAL_MERGE_READINESS_SAMPLES: PunjabiCanadaSurvivalMergeReadinessItem[] = [
  {
    id: "pa-ca-merge-clinic-001",
    domain: "clinic",
    use: "merge_readiness",
    merge_vi: "Quầy phòng khám hỏi nhanh và người học cần câu xin nhắc lại trước khi đi tiếp.",
    merge_en: "The clinic desk asks quickly and the learner needs a repeat request before continuing.",
    goal_vi: "Xin nói chậm và giữ rõ đây là hỗ trợ ngôn ngữ.",
    goal_en: "Ask for slower speech and keep the need framed as language support.",
    phrase_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਸਮਝਾਓ।",
    romanization: "mainu samajh nahin aaya. kirpa karke hauli hauli samjhao.",
    meaning_vi: "Tôi chưa hiểu. Làm ơn giải thích chậm hơn.",
    meaning_en: "I did not understand. Please explain more slowly.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।", "ਮੈਨੂੰ ਇੱਥੇ ਦਰਦ ਹੈ।"],
    merge_check_vi: "Merge check: câu này nối được với phòng khám mà không đưa lời khuyên y tế.",
    merge_check_en: "Merge check: this connects to a clinic flow without giving medical advice.",
    canada_example_vi: "Dùng ở phòng khám Canada khi quầy nói quá nhanh.",
    canada_example_en: "Use at a Canadian clinic when the desk speaks too quickly.",
    learner_trap_vi: "Đừng gật đầu nếu bạn chưa hiểu hướng dẫn.",
    learner_trap_en: "Do not nod along if you did not understand the instruction.",
  },
  {
    id: "pa-ca-merge-pharmacy-002",
    domain: "pharmacy",
    use: "final_regression",
    merge_vi: "Ở nhà thuốc, người học cần nói rõ dị ứng và xin ghi lại thông tin.",
    merge_en: "At the pharmacy, the learner needs to state an allergy and ask for written information.",
    goal_vi: "Nêu dị ứng bằng câu ngắn và xin viết lại.",
    goal_en: "State the allergy in a short sentence and ask for it in writing.",
    phrase_pa: "ਮੈਨੂੰ ਦਵਾਈ ਤੋਂ ਐਲਰਜੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।",
    romanization: "mainu davai ton allergy hai. kirpa karke ih likh dio.",
    meaning_vi: "Tôi bị dị ứng với thuốc. Làm ơn viết điều này ra.",
    meaning_en: "I am allergic to medicine. Please write this down.",
    support_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    merge_check_vi: "Final regression kiểm câu dị ứng, không đoán tên thuốc.",
    merge_check_en: "The final regression checks the allergy line without guessing medicine names.",
    canada_example_vi: "Dùng ở nhà thuốc Canada khi cần xác nhận thông tin an toàn bằng ngôn ngữ.",
    canada_example_en: "Use at a Canadian pharmacy when you need language confirmation for safety information.",
    learner_trap_vi: "Đừng thay ਦਵਾਈ bằng tên thuốc bạn không chắc.",
    learner_trap_en: "Do not replace ਦਵਾਈ with a medicine name you are unsure about.",
  },
  {
    id: "pa-ca-merge-school-003",
    domain: "school_childcare",
    use: "pre_integration",
    merge_vi: "Trường hoặc childcare gửi form và người học cần hỏi đúng phần chưa hiểu.",
    merge_en: "School or childcare sends a form and the learner needs to ask about the exact unclear part.",
    goal_vi: "Chỉ phần kẹt, xin giúp, và giữ câu đủ lịch sự.",
    goal_en: "Point to the stuck part, ask for help, and keep the line polite.",
    phrase_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਹ ਹਿੱਸਾ ਦਿਖਾ ਸਕਦੇ ਹੋ?",
    romanization: "mainu ih form bharan vich madad chahidi hai. ki tusin ih hissa dikha sakde ho?",
    meaning_vi: "Tôi cần giúp điền mẫu đơn này. Bạn có thể chỉ phần này không?",
    meaning_en: "I need help filling out this form. Can you show this part?",
    support_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਨੋਟ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਦੇ ਸਕਦੇ ਹੋ?", "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ।"],
    merge_check_vi: "Pre-integration kiểm trường và childcare cùng dùng được một mẫu câu.",
    merge_check_en: "Pre-integration checks that school and childcare can share one usable pattern.",
    canada_example_vi: "Dùng ở trường hoặc childcare Canada khi form làm bạn kẹt.",
    canada_example_en: "Use at a Canadian school or childcare centre when the form stalls you.",
    learner_trap_vi: "Đừng chỉ đưa giấy mà không nói bạn cần giúp phần nào.",
    learner_trap_en: "Do not only hand over the paper without saying which part needs help.",
  },
  {
    id: "pa-ca-merge-bank-004",
    domain: "bank",
    use: "handoff_check",
    merge_vi: "Tại ngân hàng, người học cần giữ mục tiêu mở tài khoản và hỏi phí.",
    merge_en: "At the bank, the learner needs to stay on the account-opening goal and ask about fees.",
    goal_vi: "Nói mục tiêu chính và hỏi phí bằng câu ngắn.",
    goal_en: "State the main goal and ask about fees in a short line.",
    phrase_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਹੈ। ਫੀਸ ਕਿੰਨੀ ਹੈ?",
    romanization: "mainu bank khata kholhna hai. fees kinni hai?",
    meaning_vi: "Tôi muốn mở tài khoản ngân hàng. Phí là bao nhiêu?",
    meaning_en: "I want to open a bank account. How much is the fee?",
    support_pa: ["ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    merge_check_vi: "Handoff check giữ nội dung ở mức ngôn ngữ, không tư vấn tài chính.",
    merge_check_en: "The handoff check keeps this as language support, not financial advice.",
    canada_example_vi: "Ở quầy ngân hàng Canada, câu này đủ ngắn để dùng ngay.",
    canada_example_en: "At a Canadian bank counter, this is short enough to use immediately.",
    learner_trap_vi: "ਖਾਤਾ là tài khoản; đừng đổi sang thẻ nếu mục tiêu chưa đổi.",
    learner_trap_en: "ਖਾਤਾ means account; do not switch to card if the goal has not changed.",
  },
  {
    id: "pa-ca-merge-housing-005",
    domain: "housing",
    use: "merge_readiness",
    merge_vi: "Vấn đề nhà thuê cần câu xin thời gian sửa và phản hồi bằng văn bản.",
    merge_en: "A rental issue needs a line asking for repair timing and a written reply.",
    goal_vi: "Xin thời gian sửa, không biến thành tư vấn luật thuê nhà.",
    goal_en: "Ask for repair timing without turning it into tenancy legal advice.",
    phrase_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਲਈ ਸਮਾਂ ਦੱਸੋ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਕੇ ਭੇਜੋ।",
    romanization: "kirpa karke murammat lai samah daso. kirpa karke ih likh ke bhejo.",
    meaning_vi: "Làm ơn cho biết thời gian sửa chữa. Làm ơn gửi điều này bằng văn bản.",
    meaning_en: "Please give a repair time. Please send this in writing.",
    support_pa: ["ਹੀਟਿੰਗ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    merge_check_vi: "Merge-readiness kiểm ranh giới dịch vụ trước khi đưa vào luồng lớn.",
    merge_check_en: "Merge-readiness checks the service boundary before a larger flow.",
    canada_example_vi: "Dùng ở nhà thuê Canada khi cần lịch sửa rõ ràng.",
    canada_example_en: "Use in a Canadian rental when you need a clear repair timeline.",
    learner_trap_vi: "Đừng dùng câu này như lời khuyên pháp lý.",
    learner_trap_en: "Do not use this as legal advice.",
  },
  {
    id: "pa-ca-merge-transport-006",
    domain: "transport",
    use: "pre_integration",
    merge_vi: "Tuyến xe đổi và người học cần xác nhận hướng đi trước khi lên xe.",
    merge_en: "The route changes and the learner needs to confirm direction before boarding.",
    goal_vi: "Hỏi xe có đi đúng hướng và nói nơi cần xuống.",
    goal_en: "Ask whether the bus goes the right way and say where you need to get off.",
    phrase_pa: "ਕੀ ਇਹ ਬੱਸ ਡਾਊਨਟਾਊਨ ਜਾਂਦੀ ਹੈ? ਮੈਨੂੰ ਇੱਥੇ ਉਤਰਨਾ ਹੈ।",
    romanization: "ki ih bus downtown jandi hai? mainu ithe utarna hai.",
    meaning_vi: "Xe buýt này có đi trung tâm không? Tôi cần xuống ở đây.",
    meaning_en: "Does this bus go downtown? I need to get off here.",
    support_pa: ["ਮੈਂ ਰਸਤਾ ਭੁੱਲ ਗਿਆ/ਗਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    merge_check_vi: "Pre-integration kiểm câu hỏi tuyến xe có thể ghép với phần chỉ đường.",
    merge_check_en: "Pre-integration checks that the route question can connect to directions.",
    canada_example_vi: "Dùng ở bến xe buýt Canada khi lịch trình hoặc tuyến làm bạn lúng túng.",
    canada_example_en: "Use at a Canadian bus stop when a schedule or route is confusing.",
    learner_trap_vi: "Đừng chỉ hỏi downtown nếu bạn cần xuống ở điểm cụ thể.",
    learner_trap_en: "Do not only ask about downtown if you need a specific stop.",
  },
  {
    id: "pa-ca-merge-public-office-007",
    domain: "public_office",
    use: "handoff_check",
    merge_vi: "Cơ quan công chuyển quầy và người học cần hỏi đúng quầy cùng giấy tờ.",
    merge_en: "A public office sends the learner between counters, so they need the right counter and documents.",
    goal_vi: "Hỏi nơi cần đến và danh sách giấy tờ.",
    goal_en: "Ask where to go and which documents are needed.",
    phrase_pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ? ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?",
    romanization: "mainu kis counter te jana chahida hai? mainu kihre dastavez chahide han?",
    meaning_vi: "Tôi nên đến quầy nào? Tôi cần giấy tờ nào?",
    meaning_en: "Which counter should I go to? Which documents do I need?",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਨੰਬਰ ਲਿਖ ਦਿਓ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    merge_check_vi: "Handoff check xác nhận câu có thể chuyển giữa quầy và form.",
    merge_check_en: "The handoff check confirms the line can move between counter and form contexts.",
    canada_example_vi: "Dùng ở trung tâm dịch vụ Canada khi bạn bị chuyển quầy nhiều lần.",
    canada_example_en: "Use at a Canadian service centre when you are sent between counters.",
    learner_trap_vi: "ਦਸਤਾਵੇਜ਼ là giấy tờ; đừng tự đoán thủ tục.",
    learner_trap_en: "ਦਸਤਾਵੇਜ਼ means documents; do not guess the procedure.",
  },
  {
    id: "pa-ca-merge-forms-008",
    domain: "forms_service_desk",
    use: "final_regression",
    merge_vi: "Ở bàn dịch vụ, người học cần xin chỉ lại phần form đang kẹt.",
    merge_en: "At the service desk, the learner needs to ask to be shown the stuck form section again.",
    goal_vi: "Chỉ phần chưa hiểu và xin hướng dẫn lại.",
    goal_en: "Point to the unclear part and ask to be shown again.",
    phrase_pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਹਿੱਸਾ ਦਿਖਾਓ। ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਸਮਝ ਨਹੀਂ ਆਇਆ।",
    romanization: "kirpa karke ih hissa dikhao. mainu ih form samajh nahin aaya.",
    meaning_vi: "Làm ơn chỉ phần này. Tôi chưa hiểu mẫu đơn này.",
    meaning_en: "Please show this part. I did not understand this form.",
    support_pa: ["ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    merge_check_vi: "Final regression kiểm câu form không bị lẫn với yêu cầu dịch vụ khác.",
    merge_check_en: "The final regression checks that the form line does not blur into another service request.",
    canada_example_vi: "Dùng ở quầy dịch vụ Canada khi bạn cần hoàn tất form.",
    canada_example_en: "Use at a Canadian service desk when you need to complete a form.",
    learner_trap_vi: "Đừng nói chung chung 'tôi không biết' nếu chỉ một phần bị kẹt.",
    learner_trap_en: "Do not say only 'I do not know' if one section is the problem.",
  },
  {
    id: "pa-ca-merge-interpreter-009",
    domain: "interpreter_request",
    use: "merge_readiness",
    merge_vi: "Khi tình huống vượt quá mức hiểu, người học cần xin thông dịch viên.",
    merge_en: "When the situation exceeds the learner's understanding, they need to request an interpreter.",
    goal_vi: "Xin hỗ trợ ngôn ngữ rõ ràng trước khi tiếp tục.",
    goal_en: "Request language support clearly before continuing.",
    phrase_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।",
    romanization: "mainu dubhashiye di lor hai. kirpa karke hauli hauli bolo.",
    meaning_vi: "Tôi cần thông dịch viên. Làm ơn nói chậm hơn.",
    meaning_en: "I need an interpreter. Please speak more slowly.",
    support_pa: ["ਮੈਂ ਅੰਗਰੇਜ਼ੀ/ਵਿਯਤਨਾਮੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    merge_check_vi: "Merge-readiness xác nhận đây là yêu cầu hỗ trợ, không phải bài học Shahmukhi.",
    merge_check_en: "Merge-readiness confirms this is a support request, not a Shahmukhi lesson.",
    canada_example_vi: "Dùng ở phòng khám, trường, cơ quan công hoặc ngân hàng Canada.",
    canada_example_en: "Use at a Canadian clinic, school, public office, or bank.",
    learner_trap_vi: "Đừng chờ đến khi đã ký hoặc nộp xong mới xin hỗ trợ.",
    learner_trap_en: "Do not wait until after signing or submitting to ask for support.",
  },
  {
    id: "pa-ca-merge-emergency-010",
    domain: "emergency_boundary",
    use: "pre_integration",
    merge_vi: "Nếu có nguy hiểm thật sự, người học cần câu gọi 911, không mô tả dài.",
    merge_en: "If there is real danger, the learner needs a 911 line, not a long description.",
    goal_vi: "Nói đây là khẩn cấp và xin gọi 911.",
    goal_en: "Say it is an emergency and ask someone to call 911.",
    phrase_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    romanization: "ih emergency hai. kirpa karke nau-ikk-ikk te call karo.",
    meaning_vi: "Đây là trường hợp khẩn cấp. Làm ơn gọi 911.",
    meaning_en: "This is an emergency. Please call 911.",
    support_pa: ["ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", "ਮੈਂ ਸੁਰੱਖਿਅਤ ਨਹੀਂ ਹਾਂ।"],
    merge_check_vi: "Pre-integration giữ ranh giới khẩn cấp rõ và không thay thế dịch vụ khẩn cấp.",
    merge_check_en: "Pre-integration keeps the emergency boundary clear and does not replace emergency services.",
    canada_example_vi: "Ở Canada, dùng câu này khi có nguy hiểm thật sự và cần gọi 911.",
    canada_example_en: "In Canada, use this line when there is real danger and 911 is needed.",
    learner_trap_vi: "Đừng dùng câu khẩn cấp cho việc thường ngày.",
    learner_trap_en: "Do not use the emergency line for routine issues.",
  },
  {
    id: "pa-ca-merge-workplace-011",
    domain: "workplace_safety",
    use: "handoff_check",
    merge_vi: "Ở nơi làm việc, người học cần nói chưa hiểu hướng dẫn an toàn.",
    merge_en: "At work, the learner needs to say they do not understand the safety instruction.",
    goal_vi: "Xin nhắc lại chậm hơn trước khi làm việc.",
    goal_en: "Ask for the instruction again more slowly before doing the task.",
    phrase_pa: "ਮੈਨੂੰ ਸੁਰੱਖਿਆ ਹਦਾਇਤ ਸਮਝ ਨਹੀਂ ਆਈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਦੱਸੋ।",
    romanization: "mainu surakhia hadayat samajh nahin aayi. kirpa karke dubara daso.",
    meaning_vi: "Tôi chưa hiểu hướng dẫn an toàn. Làm ơn nói lại.",
    meaning_en: "I did not understand the safety instruction. Please tell me again.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।", "ਕੀ ਤੁਸੀਂ ਇਹ ਦਿਖਾ ਸਕਦੇ ਹੋ?"],
    merge_check_vi: "Handoff check giữ câu ở mức xin làm rõ ngôn ngữ, không đưa hướng dẫn an toàn kỹ thuật.",
    merge_check_en: "The handoff check keeps this as language clarification, not technical safety instruction.",
    canada_example_vi: "Dùng ở nơi làm việc Canada trước khi thực hiện việc bạn chưa hiểu.",
    canada_example_en: "Use at a Canadian workplace before doing a task you did not understand.",
    learner_trap_vi: "Đừng bắt đầu việc nếu câu an toàn chưa rõ.",
    learner_trap_en: "Do not start the task if the safety line is unclear.",
  },
];

export default PUNJABI_CANADA_SURVIVAL_MERGE_READINESS_SAMPLES;
