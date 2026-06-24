// Punjabi Canada service boundary checklist for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner bridge only. Shahmukhi is
// awareness only, not a full course. Native review is deferred.

export type PunjabiCanadaServiceBoundaryChecklistDomain =
  | "clinic"
  | "pharmacy"
  | "school_childcare"
  | "bank"
  | "housing"
  | "transport"
  | "public_office"
  | "forms"
  | "interpreter_request"
  | "emergency_boundary"
  | "workplace_safety";

export type PunjabiCanadaServiceBoundaryChecklistUse =
  | "checklist"
  | "final_stability"
  | "final_safety"
  | "final_quality"
  | "boundary"
  | "export_readiness"
  | "service_safety"
  | "regression";

export type PunjabiCanadaServiceBoundaryChecklistItem = {
  id: string;
  domain: PunjabiCanadaServiceBoundaryChecklistDomain;
  use: PunjabiCanadaServiceBoundaryChecklistUse;
  boundary_vi: string;
  boundary_en: string;
  checklist_goal_vi: string;
  checklist_goal_en: string;
  checklist_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  checklist_steps_pa: string[];
  stability_note_vi: string;
  stability_note_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaServiceBoundaryChecklistScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundaries: string[];
};

export const PUNJABI_CANADA_SERVICE_BOUNDARY_CHECKLIST_SCOPE: PunjabiCanadaServiceBoundaryChecklistScope = {
  name: "Punjabi Canada Service Boundary Checklist",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundaries: [
    "Language support only for Canada service boundary situations.",
    "No medical, legal, financial, tenancy, or workplace safety advice.",
  ],
};

export const PUNJABI_CANADA_SERVICE_BOUNDARY_CHECKLIST: PunjabiCanadaServiceBoundaryChecklistItem[] = [
  {
    id: "pa-ca-check-clinic-001",
    domain: "clinic",
    use: "checklist",
    boundary_vi: "Phòng khám hỏi nhanh, bạn chỉ cần một câu kiểm tra an toàn.",
    boundary_en: "The clinic asks quickly and you only need one safety check line.",
    checklist_goal_vi: "Xin lặp lại và nói phần mình chưa hiểu.",
    checklist_goal_en: "Ask for repetition and name the part you did not understand.",
    checklist_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਸਮਝਾਓ।",
    romanization: "mainu samajh nahin aaya. kirpa karke hauli hauli samjhao.",
    meaning_vi: "Tôi chưa hiểu. Làm ơn giải thích chậm hơn.",
    meaning_en: "I did not understand. Please explain more slowly.",
    checklist_steps_pa: ["ਮੈਨੂੰ ਠੀਕ ਨਹੀਂ ਲੱਗ ਰਿਹਾ।", "ਮੈਨੂੰ ਇੱਥੇ ਦਰਦ ਹੈ।"],
    stability_note_vi: "Checklist tốt phải giữ bạn ở đúng bước an toàn đầu tiên.",
    stability_note_en: "A good checklist keeps you on the first safe step.",
    canada_example_vi: "Dùng ở quầy phòng khám Canada khi thông tin đi quá nhanh.",
    canada_example_en: "Use at a Canadian clinic desk when the information comes too fast.",
    learner_trap_vi: "Đừng im lặng rồi bỏ qua phần chưa hiểu.",
    learner_trap_en: "Do not go silent and skip the part you did not understand.",
  },
  {
    id: "pa-ca-check-pharmacy-002",
    domain: "pharmacy",
    use: "final_stability",
    boundary_vi: "Dược sĩ hỏi về an toàn thuốc và bạn cần giữ câu trả lời thật rõ.",
    boundary_en: "The pharmacist asks about medicine safety and you need a very clear response.",
    checklist_goal_vi: "Xác nhận lại và báo dị ứng trước.",
    checklist_goal_en: "Confirm the question and state the allergy first.",
    checklist_pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ? ਮੈਨੂੰ ਦਵਾਈ ਤੋਂ ਐਲਰਜੀ ਹੈ।",
    romanization: "ki tusin ih dubara keh sakde ho? mainu davai ton allergy hai.",
    meaning_vi: "Bạn có thể nói lại không? Tôi bị dị ứng với thuốc.",
    meaning_en: "Can you say that again? I am allergic to medicine.",
    checklist_steps_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    stability_note_vi: "Stability đến từ việc không đoán khi liên quan thuốc.",
    stability_note_en: "Stability comes from not guessing when medicine is involved.",
    canada_example_vi: "Ở nhà thuốc Canada, câu này giữ đường dây an toàn rõ ràng.",
    canada_example_en: "At a Canadian pharmacy, this keeps the safety line clear.",
    learner_trap_vi: "Đừng đoán tên thuốc nếu chưa nghe rõ.",
    learner_trap_en: "Do not guess the medicine name if you did not hear it clearly.",
  },
  {
    id: "pa-ca-check-school-003",
    domain: "school_childcare",
    use: "boundary",
    boundary_vi: "Trường đưa form và bạn cần một câu chỉ ranh giới an toàn.",
    boundary_en: "The school hands you a form and you need a single boundary line.",
    checklist_goal_vi: "Chỉ phần chưa rõ và xin bản tiếng Anh nếu cần.",
    checklist_goal_en: "Point to the unclear part and ask for an English copy if needed.",
    checklist_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਹ ਹਿੱਸਾ ਦਿਖਾ ਸਕਦੇ ਹੋ?",
    romanization: "mainu ih form bharan vich madad chahidi hai. ki tusin ih hissa dikha sakde ho?",
    meaning_vi: "Tôi cần giúp điền mẫu đơn này. Bạn có thể chỉ phần này không?",
    meaning_en: "I need help filling out this form. Can you show this part?",
    checklist_steps_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਨੋਟ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਦੇ ਸਕਦੇ ਹੋ?", "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ।"],
    stability_note_vi: "Ranh giới là chỉ ra chỗ kẹt trước khi nộp form.",
    stability_note_en: "The boundary is naming the blocker before submitting the form.",
    canada_example_vi: "Dùng ở trường hoặc childcare Canada khi form làm bạn dừng lại.",
    canada_example_en: "Use at a Canadian school or childcare centre when the form stalls you.",
    learner_trap_vi: "Đừng gửi form im lặng rồi hy vọng họ tự hiểu.",
    learner_trap_en: "Do not submit the form silently and hope they infer your need.",
  },
  {
    id: "pa-ca-check-bank-004",
    domain: "bank",
    use: "final_quality",
    boundary_vi: "Ngân hàng đông, và bạn cần câu ngắn nhưng đủ ý.",
    boundary_en: "The bank is busy, and you need a short but complete line.",
    checklist_goal_vi: "Nói muốn mở tài khoản và hỏi phí.",
    checklist_goal_en: "Say you want to open an account and ask about fees.",
    checklist_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਹੈ। ਫੀਸ ਕਿੰਨੀ ਹੈ?",
    romanization: "mainu bank khata kholhna hai. fees kinni hai?",
    meaning_vi: "Tôi muốn mở tài khoản ngân hàng. Phí là bao nhiêu?",
    meaning_en: "I want to open a bank account. How much is the fee?",
    checklist_steps_pa: ["ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    stability_note_vi: "Export-ready nghĩa là nói được nhanh mà vẫn đúng.",
    stability_note_en: "Export-ready means you can say it quickly and still be accurate.",
    canada_example_vi: "Ở quầy ngân hàng Canada, câu này đủ để mở đầu cuộc trao đổi.",
    canada_example_en: "At a Canadian bank counter, this is enough to start the exchange.",
    learner_trap_vi: "ਖਾਤਾ là tài khoản; đừng đổi thành ਕਾਰਡ.",
    learner_trap_en: "ਖਾਤਾ means account; do not swap it for ਕਾਰਡ.",
  },
  {
    id: "pa-ca-check-housing-005",
    domain: "housing",
    use: "final_stability",
    boundary_vi: "Chủ nhà nói sẽ sửa nhưng không cho thời gian.",
    boundary_en: "The landlord says it will be fixed but gives no time.",
    checklist_goal_vi: "Xin thời gian sửa và yêu cầu trả lời bằng văn bản.",
    checklist_goal_en: "Ask for a repair time and request a written reply.",
    checklist_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਲਈ ਸਮਾਂ ਦੱਸੋ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਕੇ ਭੇਜੋ।",
    romanization: "kirpa karke murammat lai samah daso. kirpa karke ih likh ke bhejo.",
    meaning_vi: "Làm ơn cho biết thời gian sửa chữa. Làm ơn gửi điều này bằng văn bản.",
    meaning_en: "Please give a repair time. Please send this in writing.",
    checklist_steps_pa: ["ਹੀਟਿੰਗ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    stability_note_vi: "Checklist ổn định phải giữ yêu cầu ở mức dịch vụ.",
    stability_note_en: "A stable checklist keeps the request at the service level.",
    canada_example_vi: "Dùng ở nhà thuê Canada khi sự cố chưa có lịch sửa.",
    canada_example_en: "Use in a Canadian rental when there is no repair schedule yet.",
    learner_trap_vi: "Đừng để lời hứa chung chung thay cho kế hoạch sửa.",
    learner_trap_en: "Do not let a vague promise replace a repair plan.",
  },
  {
    id: "pa-ca-check-transport-006",
    domain: "transport",
    use: "regression",
    boundary_vi: "Tuyến thay đổi và bạn cần câu kiểm tra lại ngay.",
    boundary_en: "The route changes and you need an immediate re-check line.",
    checklist_goal_vi: "Hỏi xe có đi downtown và nói nơi cần xuống.",
    checklist_goal_en: "Ask whether the bus goes downtown and say where you need to get off.",
    checklist_pa: "ਕੀ ਇਹ ਬੱਸ ਡਾਊਨਟਾਊਨ ਜਾਂਦੀ ਹੈ? ਮੈਨੂੰ ਇੱਥੇ ਉਤਰਨਾ ਹੈ।",
    romanization: "ki ih bus downtown jandi hai? mainu ithe utarna hai.",
    meaning_vi: "Xe buýt này có đi trung tâm không? Tôi cần xuống ở đây.",
    meaning_en: "Does this bus go downtown? I need to get off here.",
    checklist_steps_pa: ["ਮੈਂ ਰਸਤਾ ਭੁੱਲ ਗਿਆ/ਗਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    stability_note_vi: "Regression tốt là quay lại câu kiểm tra nhanh khi tuyến đổi.",
    stability_note_en: "Good regression means returning to the quick check line when the route changes.",
    canada_example_vi: "Dùng ở bến xe buýt Canada khi bảng giờ chạy thay đổi.",
    canada_example_en: "Use at a Canadian bus stop when the schedule board changes.",
    learner_trap_vi: "Đừng chỉ nhìn bảng English nếu chữ Gurmukhi vẫn chưa rõ.",
    learner_trap_en: "Do not rely only on the English sign if the Gurmukhi is still unclear.",
  },
  {
    id: "pa-ca-check-public-office-007",
    domain: "public_office",
    use: "final_safety",
    boundary_vi: "Quầy công vụ chuyển bạn nhiều lần và bạn cần giữ đúng chỗ.",
    boundary_en: "The public office sends you around repeatedly and you need to stay on the right track.",
    checklist_goal_vi: "Hỏi quầy đúng và xin danh sách giấy tờ.",
    checklist_goal_en: "Ask for the correct counter and request the document list.",
    checklist_pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ? ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?",
    romanization: "mainu kis counter te jana chahida hai? mainu kihre dastavez chahide han?",
    meaning_vi: "Tôi nên đến quầy nào? Tôi cần giấy tờ nào?",
    meaning_en: "Which counter should I go to? Which documents do I need?",
    checklist_steps_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਨੰਬਰ ਲਿਖ ਦਿਓ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    stability_note_vi: "Stable checklist phải đưa bạn về quầy đúng, không đi lòng vòng.",
    stability_note_en: "A stable checklist should take you to the right counter, not around in circles.",
    canada_example_vi: "Dùng ở trung tâm dịch vụ Canada khi bị chuyển quầy nhiều lần.",
    canada_example_en: "Use at a Canadian service centre when you are bounced between counters.",
    learner_trap_vi: "ਦਸਤਾਵੇਜ਼ là giấy tờ, không phải suy đoán thủ tục.",
    learner_trap_en: "ਦਸਤਾਵੇਜ਼ means documents, not a guess at the procedure.",
  },
  {
    id: "pa-ca-check-forms-008",
    domain: "forms",
    use: "regression",
    boundary_vi: "Bạn kẹt ở form và cần quay lại phần không hiểu.",
    boundary_en: "You are stuck on the form and need to return to the unclear part.",
    checklist_goal_vi: "Chỉ phần kẹt và xin chỉ lại.",
    checklist_goal_en: "Point to the stuck part and ask to be shown again.",
    checklist_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਹ ਹਿੱਸਾ ਦਿਖਾ ਸਕਦੇ ਹੋ?",
    romanization: "mainu ih form bharan vich madad chahidi hai. ki tusin ih hissa dikha sakde ho?",
    meaning_vi: "Tôi cần giúp điền mẫu đơn này. Bạn có thể chỉ phần này không?",
    meaning_en: "I need help filling out this form. Can you show this part?",
    checklist_steps_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਹਿੱਸਾ ਦਿਖਾਓ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    stability_note_vi: "Regression ở đây là quay về điểm kẹt, không đi thêm bước phụ.",
    stability_note_en: "Regression here means returning to the blocker, not adding extra side steps.",
    canada_example_vi: "Dùng ở quầy dịch vụ Canada khi form làm bạn đứng hình.",
    canada_example_en: "Use at a Canadian service desk when the form stalls you.",
    learner_trap_vi: "Đừng chỉ đưa giấy; hãy nói rõ cần gì.",
    learner_trap_en: "Do not only hand over the paper; say what you need.",
  },
  {
    id: "pa-ca-check-interpreter-009",
    domain: "interpreter_request",
    use: "export_readiness",
    boundary_vi: "Tình huống vượt quá mức hiểu của bạn và bạn cần hỗ trợ ngôn ngữ.",
    boundary_en: "The situation goes beyond your understanding and you need language support.",
    checklist_goal_vi: "Xin thông dịch viên và nói chậm lại.",
    checklist_goal_en: "Request an interpreter and ask for slower speech.",
    checklist_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।",
    romanization: "mainu dubhashiye di lor hai. kirpa karke hauli hauli bolo.",
    meaning_vi: "Tôi cần thông dịch viên. Làm ơn nói chậm hơn.",
    meaning_en: "I need an interpreter. Please speak more slowly.",
    checklist_steps_pa: ["ਮੈਂ ਅੰਗਰੇਜ਼ੀ/ਵਿਯਤਨਾਮੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    stability_note_vi: "Export-ready là biết xin hỗ trợ trước khi tình huống đi xa hơn.",
    stability_note_en: "Export-ready means knowing to request support before the situation moves further.",
    canada_example_vi: "Dùng ở phòng khám, trường, hay cơ quan công Canada.",
    canada_example_en: "Use at a Canadian clinic, school, or public office.",
    learner_trap_vi: "Đây là yêu cầu hỗ trợ, không phải hỏi lớp học.",
    learner_trap_en: "This requests support, not a class.",
  },
  {
    id: "pa-ca-check-emergency-010",
    domain: "emergency_boundary",
    use: "boundary",
    boundary_vi: "Có nguy hiểm thật sự và bạn phải nhờ gọi 911 ngay.",
    boundary_en: "There is real danger and you must ask for 911 immediately.",
    checklist_goal_vi: "Nói đây là khẩn cấp và xin gọi 911.",
    checklist_goal_en: "Say it is an emergency and ask to call 911.",
    checklist_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    romanization: "ih emergency hai. kirpa karke nau-ikk-ikk te call karo.",
    meaning_vi: "Đây là trường hợp khẩn cấp. Làm ơn gọi 911.",
    meaning_en: "This is an emergency. Please call 911.",
    checklist_steps_pa: ["ਮਦਦ ਕਰੋ!", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    stability_note_vi: "Biên an toàn ở đây là gọi trợ giúp, không chờ thêm.",
    stability_note_en: "The safety boundary here is to get help, not wait longer.",
    canada_example_vi: "Ở Canada, câu này dùng để nhờ người khác gọi khẩn cấp.",
    canada_example_en: "In Canada, this is used to ask someone to call emergency services.",
    learner_trap_vi: "Bài học không thay thế dịch vụ khẩn cấp.",
    learner_trap_en: "The lesson does not replace emergency services.",
  },
  {
    id: "pa-ca-check-workplace-011",
    domain: "workplace_safety",
    use: "service_safety",
    boundary_vi: "Bạn chưa hiểu hướng dẫn an toàn nhưng sắp phải làm việc.",
    boundary_en: "You do not understand the safety instructions but need to work.",
    checklist_goal_vi: "Dừng lại, nói chưa hiểu, và xin chỉ lại.",
    checklist_goal_en: "Pause, say you did not understand, and ask to be shown again.",
    checklist_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਦੁਬਾਰਾ ਦਿਖਾਓ।",
    romanization: "mainu samajh nahin aaya. kirpa karke ih dubara dikhao.",
    meaning_vi: "Tôi chưa hiểu. Làm ơn chỉ lại việc này.",
    meaning_en: "I did not understand. Please show this again.",
    checklist_steps_pa: ["ਸੁਰੱਖਿਆ ਨਿਯਮ ਕੀ ਹਨ?", "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।"],
    stability_note_vi: "Checklist tốt không cho phép giả vờ hiểu trong việc có rủi ro.",
    stability_note_en: "A good checklist does not allow pretending to understand risky work.",
    canada_example_vi: "Dùng với giám sát viên hoặc người hướng dẫn tại nơi làm việc Canada.",
    canada_example_en: "Use with a Canadian supervisor or trainer at work.",
    learner_trap_vi: "Đừng tiếp tục việc có rủi ro khi chưa rõ hướng dẫn.",
    learner_trap_en: "Do not continue risky work when the instructions are unclear.",
  },
];

export default PUNJABI_CANADA_SERVICE_BOUNDARY_CHECKLIST;
