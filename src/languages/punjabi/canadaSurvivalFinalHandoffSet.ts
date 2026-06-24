// Punjabi Canada survival final handoff set for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner bridge only. Shahmukhi is
// awareness only, not a full course. Native review is deferred.

export type PunjabiCanadaSurvivalFinalHandoffDomain =
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

export type PunjabiCanadaSurvivalFinalHandoffUse =
  | "final_handoff"
  | "pre_integration"
  | "final_readiness"
  | "export_readiness";

export type PunjabiCanadaSurvivalFinalHandoffItem = {
  id: string;
  domain: PunjabiCanadaSurvivalFinalHandoffDomain;
  use: PunjabiCanadaSurvivalFinalHandoffUse;
  handoff_vi: string;
  handoff_en: string;
  handoff_goal_vi: string;
  handoff_goal_en: string;
  handoff_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  support_pa: string[];
  review_vi: string;
  review_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaSurvivalFinalHandoffScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundaries: string[];
};

export const PUNJABI_CANADA_SURVIVAL_FINAL_HANDOFF_SCOPE: PunjabiCanadaSurvivalFinalHandoffScope = {
  name: "Punjabi Canada Survival Final Handoff Set",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundaries: [
    "Language support only for Canada survival final handoff items.",
    "No medical, legal, financial, tenancy, or workplace safety advice.",
  ],
};

export const PUNJABI_CANADA_SURVIVAL_FINAL_HANDOFF_SET: PunjabiCanadaSurvivalFinalHandoffItem[] = [
  {
    id: "pa-ca-handoff-clinic-001",
    domain: "clinic",
    use: "final_handoff",
    handoff_vi: "Quầy phòng khám hỏi nhanh và bạn cần một câu ổn định để trao lại.",
    handoff_en: "The clinic desk asks quickly and you need one stable line to hand over.",
    handoff_goal_vi: "Giữ một câu an toàn và xin nói chậm nếu cần.",
    handoff_goal_en: "Keep one safe line and ask for slower speech if needed.",
    handoff_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਸਮਝਾਓ।",
    romanization: "mainu samajh nahin aaya. kirpa karke hauli hauli samjhao.",
    meaning_vi: "Tôi chưa hiểu. Làm ơn giải thích chậm hơn.",
    meaning_en: "I did not understand. Please explain more slowly.",
    support_pa: ["ਮੈਨੂੰ ਇੱਥੇ ਦਰਦ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।"],
    review_vi: "Final handoff là chuyển đúng câu an toàn sang phần dùng thật.",
    review_en: "The final handoff passes the safe line into real use.",
    canada_example_vi: "Dùng ở phòng khám Canada khi quầy nói quá nhanh.",
    canada_example_en: "Use at a Canadian clinic when the desk speaks too quickly.",
    learner_trap_vi: "Đừng giả vờ hiểu nếu bạn chỉ nghe một nửa.",
    learner_trap_en: "Do not pretend to understand if you only heard half.",
  },
  {
    id: "pa-ca-handoff-pharmacy-002",
    domain: "pharmacy",
    use: "final_readiness",
    handoff_vi: "Dược sĩ hỏi về thuốc và bạn cần chuyển sang câu an toàn ngay.",
    handoff_en: "The pharmacist asks about medicine and you need to switch to a safe line immediately.",
    handoff_goal_vi: "Xác nhận lại câu hỏi và nói dị ứng trước.",
    handoff_goal_en: "Confirm the question and state the allergy first.",
    handoff_pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ? ਮੈਨੂੰ ਦਵਾਈ ਤੋਂ ਐਲਰਜੀ ਹੈ।",
    romanization: "ki tusin ih dubara keh sakde ho? mainu davai ton allergy hai.",
    meaning_vi: "Bạn có thể nói lại không? Tôi bị dị ứng với thuốc.",
    meaning_en: "Can you say that again? I am allergic to medicine.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    review_vi: "Giữ câu an toàn thuốc thật rõ trước khi đi tiếp.",
    review_en: "Keep the medicine-safety line clear before moving on.",
    canada_example_vi: "Ở nhà thuốc Canada, câu này giữ an toàn rõ ràng.",
    canada_example_en: "At a Canadian pharmacy, this keeps safety clear.",
    learner_trap_vi: "Đừng trả lời quá ngắn nếu câu hỏi gốc chưa rõ.",
    learner_trap_en: "Do not answer too briefly if the original question was unclear.",
  },
  {
    id: "pa-ca-handoff-school-003",
    domain: "school_childcare",
    use: "pre_integration",
    handoff_vi: "Trường hoặc childcare đưa form và bạn cần bàn giao đúng phần chưa hiểu.",
    handoff_en: "School or childcare gives you a form and you need to hand off the exact part you do not understand.",
    handoff_goal_vi: "Chỉ đúng chỗ kẹt và xin bản tiếng Anh nếu cần.",
    handoff_goal_en: "Point to the exact stuck part and ask for an English copy if needed.",
    handoff_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਹ ਹਿੱਸਾ ਦਿਖਾ ਸਕਦੇ ਹੋ?",
    romanization: "mainu ih form bharan vich madad chahidi hai. ki tusin ih hissa dikha sakde ho?",
    meaning_vi: "Tôi cần giúp điền mẫu đơn này. Bạn có thể chỉ phần này không?",
    meaning_en: "I need help filling out this form. Can you show this part?",
    support_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਨੋਟ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਦੇ ਸਕਦੇ ਹੋ?", "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ।"],
    review_vi: "Pre-integration là chạm đúng form trước khi nộp.",
    review_en: "Pre-integration means touching the form before submitting it.",
    canada_example_vi: "Dùng ở trường hoặc childcare Canada khi form làm bạn kẹt.",
    canada_example_en: "Use at a Canadian school or childcare centre when the form stalls you.",
    learner_trap_vi: "Đừng nộp form im lặng rồi hi vọng họ tự hiểu.",
    learner_trap_en: "Do not submit the form silently and hope they infer your need.",
  },
  {
    id: "pa-ca-handoff-bank-004",
    domain: "bank",
    use: "final_handoff",
    handoff_vi: "Ngân hàng đông và bạn muốn trao lại một câu thật ngắn.",
    handoff_en: "The bank is busy and you want to hand over a very short line.",
    handoff_goal_vi: "Nói muốn mở tài khoản và hỏi phí.",
    handoff_goal_en: "Say you want to open an account and ask about fees.",
    handoff_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਹੈ। ਫੀਸ ਕਿੰਨੀ ਹੈ?",
    romanization: "mainu bank khata kholhna hai. fees kinni hai?",
    meaning_vi: "Tôi muốn mở tài khoản ngân hàng. Phí là bao nhiêu?",
    meaning_en: "I want to open a bank account. How much is the fee?",
    support_pa: ["ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    review_vi: "Handoff tốt ở quầy ngân hàng là giữ mục tiêu không đổi.",
    review_en: "A good handoff at the bank keeps the goal unchanged.",
    canada_example_vi: "Ở quầy ngân hàng Canada, câu này đủ ngắn để dùng ngay.",
    canada_example_en: "At a Canadian bank counter, this is short enough to use immediately.",
    learner_trap_vi: "ਖਾਤਾ là tài khoản; đừng đổi thành ਕਾਰਡ.",
    learner_trap_en: "ਖਾਤਾ means account; do not swap it for ਕਾਰਡ.",
  },
  {
    id: "pa-ca-handoff-housing-005",
    domain: "housing",
    use: "final_readiness",
    handoff_vi: "Chủ nhà hứa sửa nhưng chưa cho thời gian.",
    handoff_en: "The landlord promises a fix but gives no time.",
    handoff_goal_vi: "Xin thời gian sửa và yêu cầu trả lời bằng văn bản.",
    handoff_goal_en: "Ask for a repair time and request a written reply.",
    handoff_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਲਈ ਸਮਾਂ ਦੱਸੋ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਕੇ ਭੇਜੋ।",
    romanization: "kirpa karke murammat lai samah daso. kirpa karke ih likh ke bhejo.",
    meaning_vi: "Làm ơn cho biết thời gian sửa chữa. Làm ơn gửi điều này bằng văn bản.",
    meaning_en: "Please give a repair time. Please send this in writing.",
    support_pa: ["ਹੀਟਿੰਗ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    review_vi: "Giữ yêu cầu ở mức dịch vụ, không đẩy sang tư vấn luật.",
    review_en: "Keep the request at the service level, not legal advice.",
    canada_example_vi: "Dùng ở nhà thuê Canada khi sự cố kéo dài.",
    canada_example_en: "Use in a Canadian rental when the issue drags on.",
    learner_trap_vi: "Đừng để lời hứa chung chung thay cho kế hoạch sửa.",
    learner_trap_en: "Do not let a vague promise replace a repair plan.",
  },
  {
    id: "pa-ca-handoff-transport-006",
    domain: "transport",
    use: "export_readiness",
    handoff_vi: "Tuyến xe đổi và bạn cần bàn giao một câu nhanh để xác nhận.",
    handoff_en: "The route changes and you need to hand over a quick confirmation line.",
    handoff_goal_vi: "Hỏi xe có đi downtown và nói nơi cần xuống.",
    handoff_goal_en: "Ask whether the bus goes downtown and say where you need to get off.",
    handoff_pa: "ਕੀ ਇਹ ਬੱਸ ਡਾਊਨਟਾਊਨ ਜਾਂਦੀ ਹੈ? ਮੈਨੂੰ ਇੱਥੇ ਉਤਰਨਾ ਹੈ।",
    romanization: "ki ih bus downtown jandi hai? mainu ithe utarna hai.",
    meaning_vi: "Xe buýt này có đi trung tâm không? Tôi cần xuống ở đây.",
    meaning_en: "Does this bus go downtown? I need to get off here.",
    support_pa: ["ਮੈਂ ਰਸਤਾ ਭੁੱਲ ਗਿਆ/ਗਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    review_vi: "Xuất dùng nhanh khi lịch trình thay đổi.",
    review_en: "Export-ready for quick use when schedules change.",
    canada_example_vi: "Dùng ở bến xe buýt Canada khi tuyến mới làm bạn lúng túng.",
    canada_example_en: "Use at a Canadian bus stop when a route change has confused you.",
    learner_trap_vi: "Đừng chỉ nhìn bảng English nếu Gurmukhi chưa rõ.",
    learner_trap_en: "Do not rely only on the English sign if the Gurmukhi is unclear.",
  },
  {
    id: "pa-ca-handoff-public-office-007",
    domain: "public_office",
    use: "final_handoff",
    handoff_vi: "Cơ quan công chuyển bạn giữa các quầy.",
    handoff_en: "The public office sends you between counters.",
    handoff_goal_vi: "Hỏi quầy đúng và xin danh sách giấy tờ.",
    handoff_goal_en: "Ask for the correct counter and request the document list.",
    handoff_pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ? ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?",
    romanization: "mainu kis counter te jana chahida hai? mainu kihre dastavez chahide han?",
    meaning_vi: "Tôi nên đến quầy nào? Tôi cần giấy tờ nào?",
    meaning_en: "Which counter should I go to? Which documents do I need?",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਨੰਬਰ ਲਿਖ ਦਿਓ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    review_vi: "Handoff an toàn là hỏi đúng quầy và đúng giấy tờ.",
    review_en: "A safe handoff means asking for the right counter and documents.",
    canada_example_vi: "Dùng ở trung tâm dịch vụ Canada khi bị chuyển quầy nhiều lần.",
    canada_example_en: "Use at a Canadian service centre when you are bounced between counters.",
    learner_trap_vi: "ਦਸਤਾਵੇਜ਼ là giấy tờ, không phải suy đoán thủ tục.",
    learner_trap_en: "ਦਸਤਾਵੇਜ਼ means documents, not a guess at the procedure.",
  },
  {
    id: "pa-ca-handoff-forms-008",
    domain: "forms_service_desk",
    use: "pre_integration",
    handoff_vi: "Bạn bị kẹt ở bàn dịch vụ vì chưa hiểu form.",
    handoff_en: "You are stuck at the service desk because you do not understand the form.",
    handoff_goal_vi: "Chỉ đúng phần kẹt và xin chỉ lại.",
    handoff_goal_en: "Point to the stuck part and ask to be shown again.",
    handoff_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਹ ਹਿੱਸਾ ਦਿਖਾ ਸਕਦੇ ਹੋ?",
    romanization: "mainu ih form bharan vich madad chahidi hai. ki tusin ih hissa dikha sakde ho?",
    meaning_vi: "Tôi cần giúp điền mẫu đơn này. Bạn có thể chỉ phần này không?",
    meaning_en: "I need help filling out this form. Can you show this part?",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਹਿੱਸਾ ਦਿਖਾਓ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    review_vi: "Pre-integration là quay lại đúng chỗ chưa hiểu.",
    review_en: "Pre-integration means returning to the exact part you did not understand.",
    canada_example_vi: "Dùng ở quầy dịch vụ Canada khi form làm bạn đứng hình.",
    canada_example_en: "Use at a Canadian service desk when the form stalls you.",
    learner_trap_vi: "Đừng chỉ đưa giấy; hãy nói rõ bạn cần gì.",
    learner_trap_en: "Do not only hand over the paper; state your need.",
  },
  {
    id: "pa-ca-handoff-interpreter-009",
    domain: "interpreter_request",
    use: "final_readiness",
    handoff_vi: "Tình huống vượt quá mức hiểu của bạn.",
    handoff_en: "The situation goes beyond your understanding.",
    handoff_goal_vi: "Xin thông dịch viên và nói chậm lại.",
    handoff_goal_en: "Request an interpreter and ask for slower speech.",
    handoff_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।",
    romanization: "mainu dubhashiye di lor hai. kirpa karke hauli hauli bolo.",
    meaning_vi: "Tôi cần thông dịch viên. Làm ơn nói chậm hơn.",
    meaning_en: "I need an interpreter. Please speak more slowly.",
    support_pa: ["ਮੈਂ ਅੰਗਰੇਜ਼ੀ/ਵਿਯਤਨਾਮੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    review_vi: "Bàn giao hỗ trợ ngôn ngữ trước khi tình huống đi xa hơn.",
    review_en: "Hand off language support before the situation moves further.",
    canada_example_vi: "Dùng ở phòng khám, trường, hay cơ quan công Canada.",
    canada_example_en: "Use at a Canadian clinic, school, or public office.",
    learner_trap_vi: "Đây là yêu cầu hỗ trợ, không phải hỏi lớp học.",
    learner_trap_en: "This requests support, not a class.",
  },
  {
    id: "pa-ca-handoff-emergency-010",
    domain: "emergency_boundary",
    use: "final_readiness",
    handoff_vi: "Có nguy hiểm thật sự và bạn phải nhờ gọi 911 ngay.",
    handoff_en: "There is real danger and you must ask for 911 immediately.",
    handoff_goal_vi: "Nói đây là khẩn cấp và xin gọi 911.",
    handoff_goal_en: "Say it is an emergency and ask to call 911.",
    handoff_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    romanization: "ih emergency hai. kirpa karke nau-ikk-ikk te call karo.",
    meaning_vi: "Đây là trường hợp khẩn cấp. Làm ơn gọi 911.",
    meaning_en: "This is an emergency. Please call 911.",
    support_pa: ["ਮਦਦ ਕਰੋ!", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    review_vi: "Biên này không thay thế dịch vụ khẩn cấp.",
    review_en: "This boundary does not replace emergency services.",
    canada_example_vi: "Ở Canada, câu này dùng để nhờ người khác gọi khẩn cấp.",
    canada_example_en: "In Canada, this is used to ask someone to call emergency services.",
    learner_trap_vi: "Bài học không thay thế hỗ trợ khẩn cấp.",
    learner_trap_en: "The lesson does not replace emergency support.",
  },
  {
    id: "pa-ca-handoff-workplace-011",
    domain: "workplace_safety",
    use: "final_handoff",
    handoff_vi: "Hướng dẫn an toàn nơi làm việc chưa rõ.",
    handoff_en: "Workplace safety instructions are unclear.",
    handoff_goal_vi: "Dừng lại, nói chưa hiểu, và xin chỉ lại.",
    handoff_goal_en: "Pause, say you did not understand, and ask to be shown again.",
    handoff_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਦੁਬਾਰਾ ਦਿਖਾਓ।",
    romanization: "mainu samajh nahin aaya. kirpa karke ih dubara dikhao.",
    meaning_vi: "Tôi chưa hiểu. Làm ơn chỉ lại việc này.",
    meaning_en: "I did not understand. Please show this again.",
    support_pa: ["ਸੁਰੱਖਿਆ ਨਿਯਮ ਕੀ ਹਨ?", "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।"],
    review_vi: "Handoff an toàn ở nơi làm việc là không giả vờ hiểu.",
    review_en: "A safe workplace handoff means not pretending to understand.",
    canada_example_vi: "Dùng với giám sát viên hoặc người hướng dẫn tại nơi làm việc Canada.",
    canada_example_en: "Use with a Canadian supervisor or trainer at work.",
    learner_trap_vi: "Đừng tiếp tục việc có rủi ro khi chưa rõ hướng dẫn.",
    learner_trap_en: "Do not continue risky work when the instructions are unclear.",
  },
];

export default PUNJABI_CANADA_SURVIVAL_FINAL_HANDOFF_SET;
