// Punjabi Canada service safety boundaries for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner bridge only. Shahmukhi is
// awareness only, not a full course. Native review is deferred.

export type PunjabiCanadaServiceSafetyBoundaryDomain =
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

export type PunjabiCanadaServiceSafetyBoundaryUse =
  | "service_safety"
  | "final_safety"
  | "final_quality"
  | "export_readiness"
  | "regression";

export type PunjabiCanadaServiceSafetyBoundaryItem = {
  id: string;
  domain: PunjabiCanadaServiceSafetyBoundaryDomain;
  use: PunjabiCanadaServiceSafetyBoundaryUse;
  boundary_vi: string;
  boundary_en: string;
  safer_goal_vi: string;
  safer_goal_en: string;
  safety_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  safe_steps_pa: string[];
  quality_note_vi: string;
  quality_note_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaServiceSafetyBoundaryScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundaries: string[];
};

export const PUNJABI_CANADA_SERVICE_SAFETY_BOUNDARY_SCOPE: PunjabiCanadaServiceSafetyBoundaryScope = {
  name: "Punjabi Canada Service Safety Boundaries",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization helps recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundaries: [
    "Language support only for Canada service safety boundaries.",
    "No medical, legal, financial, tenancy, or workplace safety advice.",
  ],
};

export const PUNJABI_CANADA_SERVICE_SAFETY_BOUNDARIES: PunjabiCanadaServiceSafetyBoundaryItem[] = [
  {
    id: "pa-ca-safety-clinic-001",
    domain: "clinic",
    use: "service_safety",
    boundary_vi: "Nhân viên hỏi điều ngoài khả năng hiểu của bạn.",
    boundary_en: "Staff ask something beyond what you can understand.",
    safer_goal_vi: "Xin lặp lại, xin nói chậm, và chỉ trả lời phần chắc chắn.",
    safer_goal_en: "Ask for repetition, ask for slower speech, and only answer the part you know.",
    safety_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਸਮਝਾਓ।",
    romanization: "mainu samajh nahin aaya. kirpa karke hauli hauli samjhao.",
    meaning_vi: "Tôi chưa hiểu. Làm ơn giải thích chậm hơn.",
    meaning_en: "I did not understand. Please explain more slowly.",
    safe_steps_pa: ["ਮੈਨੂੰ ਠੀਕ ਨਹੀਂ ਲੱਗ ਰਿਹਾ।", "ਮੈਨੂੰ ਇੱਥੇ ਦਰਦ ਹੈ।"],
    quality_note_vi: "Mục tiêu là an toàn ngôn ngữ, không phải đoán cho xong.",
    quality_note_en: "The goal is language safety, not guessing to finish.",
    canada_example_vi: "Dùng ở phòng khám Canada khi quầy hỏi quá nhanh.",
    canada_example_en: "Use at a Canadian clinic when the desk speaks too quickly.",
    learner_trap_vi: "Đừng giả vờ hiểu khi chỉ nghe được một nửa.",
    learner_trap_en: "Do not pretend to understand when you only heard half.",
  },
  {
    id: "pa-ca-safety-pharmacy-002",
    domain: "pharmacy",
    use: "final_safety",
    boundary_vi: "Bạn chưa chắc câu hỏi của dược sĩ về an toàn thuốc.",
    boundary_en: "You are not sure about the pharmacist's medicine-safety question.",
    safer_goal_vi: "Xác nhận lại và nói dị ứng trước khi đi tiếp.",
    safer_goal_en: "Confirm the question and state the allergy before moving on.",
    safety_pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ? ਮੈਨੂੰ ਦਵਾਈ ਤੋਂ ਐਲਰਜੀ ਹੈ।",
    romanization: "ki tusin ih dubara keh sakde ho? mainu davai ton allergy hai.",
    meaning_vi: "Bạn có thể nói lại không? Tôi bị dị ứng với thuốc.",
    meaning_en: "Can you say that again? I am allergic to medicine.",
    safe_steps_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    quality_note_vi: "Không để câu hỏi an toàn bị mờ đi thành câu hỏi chung chung.",
    quality_note_en: "Do not let a safety question blur into a generic one.",
    canada_example_vi: "Ở nhà thuốc Canada, câu này giữ ranh giới an toàn rõ ràng.",
    canada_example_en: "At a Canadian pharmacy, this keeps the safety boundary clear.",
    learner_trap_vi: "Đừng đoán tên thuốc nếu chưa nghe rõ.",
    learner_trap_en: "Do not guess the medicine name if you did not hear it clearly.",
  },
  {
    id: "pa-ca-safety-school-003",
    domain: "school_childcare",
    use: "regression",
    boundary_vi: "Mẫu đơn có phần bạn không chắc nên điền.",
    boundary_en: "The form has a part you are not sure how to fill in.",
    safer_goal_vi: "Chỉ phần chưa rõ và xin ghi chú tiếng Anh nếu cần.",
    safer_goal_en: "Point to the unclear part and ask for an English note if needed.",
    safety_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਹ ਹਿੱਸਾ ਦਿਖਾ ਸਕਦੇ ਹੋ?",
    romanization: "mainu ih form bharan vich madad chahidi hai. ki tusin ih hissa dikha sakde ho?",
    meaning_vi: "Tôi cần giúp điền mẫu đơn này. Bạn có thể chỉ phần này không?",
    meaning_en: "I need help filling out this form. Can you show this part?",
    safe_steps_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਨੋਟ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਦੇ ਸਕਦੇ ਹੋ?", "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ।"],
    quality_note_vi: "Biên an toàn là nói rõ phần chưa hiểu trước khi nộp form.",
    quality_note_en: "The safety boundary is naming the unclear part before submitting the form.",
    canada_example_vi: "Dùng ở trường hoặc childcare Canada khi form làm bạn kẹt.",
    canada_example_en: "Use at a Canadian school or childcare centre when the form stalls you.",
    learner_trap_vi: "Đừng gửi form im lặng rồi hi vọng họ tự hiểu.",
    learner_trap_en: "Do not submit the form silently and hope they infer your need.",
  },
  {
    id: "pa-ca-safety-bank-004",
    domain: "bank",
    use: "final_quality",
    boundary_vi: "Ngân hàng đông và bạn cần nói rất ngắn nhưng vẫn chính xác.",
    boundary_en: "The bank is busy and you need a short but accurate line.",
    safer_goal_vi: "Nói bạn muốn mở tài khoản và hỏi phí.",
    safer_goal_en: "Say you want to open an account and ask about fees.",
    safety_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਹੈ। ਫੀਸ ਕਿੰਨੀ ਹੈ?",
    romanization: "mainu bank khata kholhna hai. fees kinni hai?",
    meaning_vi: "Tôi muốn mở tài khoản ngân hàng. Phí là bao nhiêu?",
    meaning_en: "I want to open a bank account. How much is the fee?",
    safe_steps_pa: ["ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    quality_note_vi: "Câu ngắn vẫn phải đủ ý để quầy xử lý đúng.",
    quality_note_en: "A short line still must carry enough meaning for the counter to act correctly.",
    canada_example_vi: "Ở quầy ngân hàng Canada, câu này tránh đi vòng trong giờ đông.",
    canada_example_en: "At a Canadian bank counter, this avoids roundabout talk during busy hours.",
    learner_trap_vi: "ਖਾਤਾ là tài khoản; đừng đổi thành ਕਾਰਡ.",
    learner_trap_en: "ਖਾਤਾ means account; do not swap it for ਕਾਰਡ.",
  },
  {
    id: "pa-ca-safety-housing-005",
    domain: "housing",
    use: "service_safety",
    boundary_vi: "Chủ nhà hứa sửa nhưng không cho thời gian cụ thể.",
    boundary_en: "The landlord promises a fix but gives no specific time.",
    safer_goal_vi: "Xin thời gian sửa và yêu cầu trả lời bằng văn bản.",
    safer_goal_en: "Ask for a repair time and request a written reply.",
    safety_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਲਈ ਸਮਾਂ ਦੱਸੋ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਕੇ ਭੇਜੋ।",
    romanization: "kirpa karke murammat lai samah daso. kirpa karke ih likh ke bhejo.",
    meaning_vi: "Làm ơn cho biết thời gian sửa chữa. Làm ơn gửi điều này bằng văn bản.",
    meaning_en: "Please give a repair time. Please send this in writing.",
    safe_steps_pa: ["ਹੀਟਿੰਗ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    quality_note_vi: "Giữ yêu cầu ở mức dịch vụ, không đẩy sang tư vấn luật.",
    quality_note_en: "Keep the request at the service level, not legal advice.",
    canada_example_vi: "Dùng ở nhà thuê Canada khi sự cố kéo dài mà chưa có lịch sửa.",
    canada_example_en: "Use in a Canadian rental when the issue drags on without a repair time.",
    learner_trap_vi: "Đừng để lời hứa chung chung thay cho kế hoạch sửa.",
    learner_trap_en: "Do not let a vague promise replace a repair plan.",
  },
  {
    id: "pa-ca-safety-transport-006",
    domain: "transport",
    use: "export_readiness",
    boundary_vi: "Tuyến xe thay đổi và bạn cần xác nhận nhanh.",
    boundary_en: "The route changes and you need a quick confirmation.",
    safer_goal_vi: "Hỏi xe có đi downtown và nói nơi bạn cần xuống.",
    safer_goal_en: "Ask whether the bus goes downtown and say where you need to get off.",
    safety_pa: "ਕੀ ਇਹ ਬੱਸ ਡਾਊਨਟਾਊਨ ਜਾਂਦੀ ਹੈ? ਮੈਨੂੰ ਇੱਥੇ ਉਤਰਨਾ ਹੈ।",
    romanization: "ki ih bus downtown jandi hai? mainu ithe utarna hai.",
    meaning_vi: "Xe buýt này có đi trung tâm không? Tôi cần xuống ở đây.",
    meaning_en: "Does this bus go downtown? I need to get off here.",
    safe_steps_pa: ["ਮੈਂ ਰਸਤਾ ਭੁੱਲ ਗਿਆ/ਗਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    quality_note_vi: "Xuất dùng nhanh khi lịch trình thay đổi và cần xác nhận ngay.",
    quality_note_en: "Export-ready for quick use when schedules change and confirmation is needed fast.",
    canada_example_vi: "Dùng ở bến xe buýt Canada khi tuyến mới làm bạn lúng túng.",
    canada_example_en: "Use at a Canadian bus stop when a route change has confused you.",
    learner_trap_vi: "Đừng chỉ nhìn bảng English nếu Gurmukhi chưa rõ.",
    learner_trap_en: "Do not rely only on the English sign if the Gurmukhi is unclear.",
  },
  {
    id: "pa-ca-safety-public-office-007",
    domain: "public_office",
    use: "final_safety",
    boundary_vi: "Quầy công vụ chuyển bạn nhiều lần và bạn cần kiểm tra đúng chỗ.",
    boundary_en: "The public office sends you around repeatedly and you need the correct place.",
    safer_goal_vi: "Hỏi quầy đúng và xin danh sách giấy tờ.",
    safer_goal_en: "Ask for the correct counter and request the document list.",
    safety_pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ? ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?",
    romanization: "mainu kis counter te jana chahida hai? mainu kihre dastavez chahide han?",
    meaning_vi: "Tôi nên đến quầy nào? Tôi cần giấy tờ nào?",
    meaning_en: "Which counter should I go to? Which documents do I need?",
    safe_steps_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਨੰਬਰ ਲਿਖ ਦਿਓ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    quality_note_vi: "Biên an toàn là hỏi đúng quầy và đúng danh sách, không đoán.",
    quality_note_en: "The safety boundary is asking for the correct counter and list, not guessing.",
    canada_example_vi: "Dùng ở trung tâm dịch vụ Canada khi bị chuyển quầy nhiều lần.",
    canada_example_en: "Use at a Canadian service centre when you are bounced between counters.",
    learner_trap_vi: "ਦਸਤਾਵੇਜ਼ là giấy tờ, không phải suy đoán thủ tục.",
    learner_trap_en: "ਦਸਤਾਵੇਜ਼ means documents, not a guess at the procedure.",
  },
  {
    id: "pa-ca-safety-forms-008",
    domain: "forms_service_desk",
    use: "regression",
    boundary_vi: "Bạn bị kẹt ở bàn dịch vụ vì không biết phần nào phải điền.",
    boundary_en: "You are stuck at the service desk because you do not know which part to fill in.",
    safer_goal_vi: "Chỉ phần kẹt và xin người ta chỉ lại.",
    safer_goal_en: "Point to the stuck part and ask to be shown again.",
    safety_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਹ ਹਿੱਸਾ ਦਿਖਾ ਸਕਦੇ ਹੋ?",
    romanization: "mainu ih form bharan vich madad chahidi hai. ki tusin ih hissa dikha sakde ho?",
    meaning_vi: "Tôi cần giúp điền mẫu đơn này. Bạn có thể chỉ phần này không?",
    meaning_en: "I need help filling out this form. Can you show this part?",
    safe_steps_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਹਿੱਸਾ ਦਿਖਾਓ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    quality_note_vi: "Hồi quy tốt khi cần quay lại điểm kẹt thay vì vòng vo.",
    quality_note_en: "Good regression behavior means returning to the blockage instead of circling around it.",
    canada_example_vi: "Dùng ở quầy dịch vụ Canada khi form làm bạn đứng hình.",
    canada_example_en: "Use at a Canadian service desk when the form stalls you.",
    learner_trap_vi: "Đừng chỉ đưa giấy; hãy nói rõ bạn cần gì.",
    learner_trap_en: "Do not only hand over the paper; state your need.",
  },
  {
    id: "pa-ca-safety-interpreter-009",
    domain: "interpreter_request",
    use: "service_safety",
    boundary_vi: "Tình huống vượt quá mức hiểu của bạn và bạn cần hỗ trợ ngôn ngữ.",
    boundary_en: "The situation goes beyond your understanding and you need language support.",
    safer_goal_vi: "Xin thông dịch viên và nói chậm lại.",
    safer_goal_en: "Request an interpreter and ask for slower speech.",
    safety_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।",
    romanization: "mainu dubhashiye di lor hai. kirpa karke hauli hauli bolo.",
    meaning_vi: "Tôi cần thông dịch viên. Làm ơn nói chậm hơn.",
    meaning_en: "I need an interpreter. Please speak more slowly.",
    safe_steps_pa: ["ਮੈਂ ਅੰਗਰੇਜ਼ੀ/ਵਿਯਤਨਾਮੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    quality_note_vi: "Nên dùng hỗ trợ ngôn ngữ trước khi tình huống đi xa hơn.",
    quality_note_en: "Use language support before the situation moves further.",
    canada_example_vi: "Dùng ở phòng khám, trường, hay cơ quan công Canada.",
    canada_example_en: "Use at a Canadian clinic, school, or public office.",
    learner_trap_vi: "Đây là yêu cầu hỗ trợ, không phải hỏi học thêm.",
    learner_trap_en: "This requests support, not a class.",
  },
  {
    id: "pa-ca-safety-emergency-010",
    domain: "emergency_boundary",
    use: "final_quality",
    boundary_vi: "Có nguy hiểm thật sự và bạn phải nhờ gọi 911 ngay.",
    boundary_en: "There is real danger and you must ask for 911 immediately.",
    safer_goal_vi: "Nói đây là khẩn cấp và xin gọi 911.",
    safer_goal_en: "Say it is an emergency and ask to call 911.",
    safety_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    romanization: "ih emergency hai. kirpa karke nau-ikk-ikk te call karo.",
    meaning_vi: "Đây là trường hợp khẩn cấp. Làm ơn gọi 911.",
    meaning_en: "This is an emergency. Please call 911.",
    safe_steps_pa: ["ਮਦਦ ਕਰੋ!", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    quality_note_vi: "Chất lượng tốt nhất là gọi trợ giúp ngay khi rủi ro có thật.",
    quality_note_en: "The best quality is to get help immediately when the risk is real.",
    canada_example_vi: "Ở Canada, câu này dùng để nhờ người khác gọi khẩn cấp.",
    canada_example_en: "In Canada, this is used to ask someone to call emergency services.",
    learner_trap_vi: "Bài học không thay thế dịch vụ khẩn cấp.",
    learner_trap_en: "The lesson does not replace emergency services.",
  },
  {
    id: "pa-ca-safety-workplace-011",
    domain: "workplace_safety",
    use: "service_safety",
    boundary_vi: "Bạn chưa hiểu hướng dẫn an toàn nhưng sắp phải làm việc.",
    boundary_en: "You do not understand the safety instructions but need to work.",
    safer_goal_vi: "Dừng lại, nói chưa hiểu, và xin chỉ lại.",
    safer_goal_en: "Pause, say you did not understand, and ask to be shown again.",
    safety_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਦੁਬਾਰਾ ਦਿਖਾਓ।",
    romanization: "mainu samajh nahin aaya. kirpa karke ih dubara dikhao.",
    meaning_vi: "Tôi chưa hiểu. Làm ơn chỉ lại việc này.",
    meaning_en: "I did not understand. Please show this again.",
    safe_steps_pa: ["ਸੁਰੱਖਿਆ ਨਿਯਮ ਕੀ ਹਨ?", "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।"],
    quality_note_vi: "Ranh giới an toàn ở nơi làm việc là không giả vờ hiểu.",
    quality_note_en: "The safety boundary at work is not pretending to understand.",
    canada_example_vi: "Dùng với giám sát viên hoặc người hướng dẫn tại nơi làm việc Canada.",
    canada_example_en: "Use with a Canadian supervisor or trainer at work.",
    learner_trap_vi: "Đừng tiếp tục việc có rủi ro khi chưa rõ hướng dẫn.",
    learner_trap_en: "Do not continue risky work when the instructions are unclear.",
  },
];

export default PUNJABI_CANADA_SERVICE_SAFETY_BOUNDARIES;
