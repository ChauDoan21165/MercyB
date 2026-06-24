// Punjabi Canada service recovery pack for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary. Romanization is a bridge only. Shahmukhi is awareness
// only, not a full course. Native review is deferred.

export type PunjabiCanadaServiceRecoveryDomain =
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

export type PunjabiCanadaServiceRecoveryUse =
  | "service_recovery"
  | "final_hardening"
  | "export_readiness"
  | "review"
  | "regression";

export type PunjabiCanadaServiceRecoveryItem = {
  id: string;
  domain: PunjabiCanadaServiceRecoveryDomain;
  use: PunjabiCanadaServiceRecoveryUse;
  failure_vi: string;
  failure_en: string;
  recovery_goal_vi: string;
  recovery_goal_en: string;
  recovery_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  recovery_steps_pa: string[];
  hardening_note_vi: string;
  hardening_note_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaServiceRecoveryPackScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundaries: string[];
};

export const PUNJABI_CANADA_SERVICE_RECOVERY_PACK_SCOPE: PunjabiCanadaServiceRecoveryPackScope = {
  name: "Punjabi Canada Service Recovery Pack",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundaries: [
    "Language support only for Canada service recovery situations.",
    "No medical, legal, financial, tenancy, or workplace safety advice.",
  ],
};

export const PUNJABI_CANADA_SERVICE_RECOVERY_PACK: PunjabiCanadaServiceRecoveryItem[] = [
  {
    id: "pa-ca-recover-clinic-001",
    domain: "clinic",
    use: "service_recovery",
    failure_vi: "Quầy phòng khám hỏi quá nhanh và bạn bỏ lỡ một phần quan trọng.",
    failure_en: "The clinic desk speaks too quickly and you miss part of something important.",
    recovery_goal_vi: "Xin lặp lại, nói mình chưa hiểu, rồi quay lại mô tả triệu chứng.",
    recovery_goal_en: "Ask for repetition, say you did not understand, then return to the symptom description.",
    recovery_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਸਮਝਾਓ। ਮੈਨੂੰ ਠੀਕ ਨਹੀਂ ਲੱਗ ਰਿਹਾ।",
    romanization: "mainu samajh nahin aaya. kirpa karke hauli hauli samjhao. mainu theek nahin lag riha.",
    meaning_vi: "Tôi chưa hiểu. Làm ơn giải thích chậm hơn. Tôi thấy không khỏe.",
    meaning_en: "I did not understand. Please explain more slowly. I do not feel well.",
    recovery_steps_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।", "ਮੈਨੂੰ ਇੱਥੇ ਦਰਦ ਹੈ।"],
    hardening_note_vi: "Cần phục hồi mạch hội thoại, không chỉ dịch một câu riêng.",
    hardening_note_en: "You need to recover the conversation flow, not only translate one line.",
    canada_example_vi: "Ở quầy phòng khám Canada, câu này giúp bạn quay lại đúng việc đang xử lý.",
    canada_example_en: "At a Canadian clinic desk, this helps you get back to the task at hand.",
    learner_trap_vi: "Đừng im lặng hoặc chuyển sang kể chuyện dài khi chỉ cần làm rõ một chỗ.",
    learner_trap_en: "Do not go silent or launch into a long story when only one point needs clarification.",
  },
  {
    id: "pa-ca-recover-pharmacy-002",
    domain: "pharmacy",
    use: "final_hardening",
    failure_vi: "Bạn không chắc dược sĩ hỏi về dị ứng hay thuốc hiện tại.",
    failure_en: "You are not sure whether the pharmacist asked about allergies or current medicine.",
    recovery_goal_vi: "Xác nhận lại câu hỏi và báo dị ứng trước.",
    recovery_goal_en: "Confirm the question and state the allergy first.",
    recovery_pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ? ਮੈਨੂੰ ਦਵਾਈ ਤੋਂ ਐਲਰਜੀ ਹੈ।",
    romanization: "ki tusin ih dubara keh sakde ho? mainu davai ton allergy hai.",
    meaning_vi: "Bạn có thể nói lại không? Tôi bị dị ứng với thuốc.",
    meaning_en: "Can you say that again? I am allergic to medicine.",
    recovery_steps_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    hardening_note_vi: "Phải ưu tiên an toàn khi thông tin nghe không rõ.",
    hardening_note_en: "Safety comes first when the wording is unclear.",
    canada_example_vi: "Ở nhà thuốc Canada, câu này chặn việc hiểu lầm thông tin an toàn.",
    canada_example_en: "At a Canadian pharmacy, this prevents misunderstanding safety information.",
    learner_trap_vi: "Đừng trả lời bằng một từ nếu câu hỏi gốc chưa rõ.",
    learner_trap_en: "Do not answer with a one-word response if the original question was unclear.",
  },
  {
    id: "pa-ca-recover-school-003",
    domain: "school_childcare",
    use: "review",
    failure_vi: "Trường đưa form và bạn không biết phần nào là bắt buộc.",
    failure_en: "The school hands you a form and you do not know which part is required.",
    recovery_goal_vi: "Xin chỉ phần cần điền và hỏi về ghi chú tiếng Anh.",
    recovery_goal_en: "Ask which part to fill in and whether there is an English note.",
    recovery_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਹ ਹਿੱਸਾ ਦਿਖਾ ਸਕਦੇ ਹੋ?",
    romanization: "mainu ih form bharan vich madad chahidi hai. ki tusin ih hissa dikha sakde ho?",
    meaning_vi: "Tôi cần giúp điền mẫu đơn này. Bạn có thể chỉ phần này không?",
    meaning_en: "I need help filling out this form. Can you show this part?",
    recovery_steps_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਨੋਟ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਦੇ ਸਕਦੇ ਹੋ?", "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ।"],
    hardening_note_vi: "Khi hồi phục sau nhầm lẫn giấy tờ, phải gọi đúng mục cần giúp.",
    hardening_note_en: "When recovering from paperwork confusion, name the exact part that needs help.",
    canada_example_vi: "Dùng ở văn phòng trường Canada hoặc trung tâm giữ trẻ sau khi bị rối form.",
    canada_example_en: "Use at a Canadian school office or childcare centre after form confusion.",
    learner_trap_vi: "Đừng chỉ nói có form; phải chỉ phần gây kẹt.",
    learner_trap_en: "Do not only mention the form; point to the part that is stuck.",
  },
  {
    id: "pa-ca-recover-bank-004",
    domain: "bank",
    use: "export_readiness",
    failure_vi: "Ngân hàng đông, nhân viên hỏi nhanh, và bạn cần câu ngắn để tiếp tục.",
    failure_en: "The bank is busy, the staff ask quickly, and you need a short line to continue.",
    recovery_goal_vi: "Nói mục tiêu, xác nhận bạn mới đến, và hỏi phí.",
    recovery_goal_en: "State your goal, confirm that you are new, and ask about fees.",
    recovery_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਹੈ। ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ। ਫੀਸ ਕਿੰਨੀ ਹੈ?",
    romanization: "mainu bank khata kholhna hai. main nava aia/navi ai han. fees kinni hai?",
    meaning_vi: "Tôi muốn mở tài khoản ngân hàng. Tôi mới đến. Phí là bao nhiêu?",
    meaning_en: "I want to open a bank account. I am new here. How much is the fee?",
    recovery_steps_pa: ["ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    hardening_note_vi: "Câu ngắn phải đủ thông tin để quầy xử lý tiếp.",
    hardening_note_en: "A short line still needs enough information for the counter to proceed.",
    canada_example_vi: "Ở quầy ngân hàng Canada, câu này giữ cuộc trao đổi đi đúng hướng.",
    canada_example_en: "At a Canadian bank counter, this keeps the exchange on track.",
    learner_trap_vi: "ਖਾਤਾ là tài khoản; không đổi thành ਕਾਰਡ khi đang nói về mở tài khoản.",
    learner_trap_en: "ਖਾਤਾ means account; do not swap it for ਕਾਰਡ when opening an account.",
  },
  {
    id: "pa-ca-recover-housing-005",
    domain: "housing",
    use: "service_recovery",
    failure_vi: "Chủ nhà hứa sửa nhưng không cho thời gian và bạn cần kéo cuộc nói chuyện về sửa chữa.",
    failure_en: "The landlord promises a fix but gives no time and you need to pull the conversation back to repair.",
    recovery_goal_vi: "Xin thời gian sửa và yêu cầu trả lời bằng văn bản.",
    recovery_goal_en: "Ask for a repair time and request a written reply.",
    recovery_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਲਈ ਸਮਾਂ ਦੱਸੋ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਕੇ ਭੇਜੋ।",
    romanization: "kirpa karke murammat lai samah daso. kirpa karke ih likh ke bhejo.",
    meaning_vi: "Làm ơn cho biết thời gian sửa chữa. Làm ơn gửi điều này bằng văn bản.",
    meaning_en: "Please give a repair time. Please send this in writing.",
    recovery_steps_pa: ["ਹੀਟਿੰਗ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    hardening_note_vi: "Đừng để lời hứa chung chung thay cho kế hoạch sửa cụ thể.",
    hardening_note_en: "Do not let a vague promise replace a specific repair plan.",
    canada_example_vi: "Dùng khi nhà thuê ở Canada có lỗi kéo dài mà chưa có lịch sửa.",
    canada_example_en: "Use when a Canadian rental has a long-running issue and no repair time.",
    learner_trap_vi: "Phải gắn yêu cầu vào sự cố конкрет, không chỉ nói nhà có vấn đề.",
    learner_trap_en: "Attach the request to a specific problem, not just a vague house issue.",
  },
  {
    id: "pa-ca-recover-transport-006",
    domain: "transport",
    use: "regression",
    failure_vi: "Xe đổi tuyến và bạn không chắc vẫn đi downtown.",
    failure_en: "The route changed and you are not sure it still goes downtown.",
    recovery_goal_vi: "Xác nhận tuyến mới và nói nơi cần xuống.",
    recovery_goal_en: "Confirm the new route and say where you need to get off.",
    recovery_pa: "ਕੀ ਇਹ ਬੱਸ ਡਾਊਨਟਾਊਨ ਜਾਂਦੀ ਹੈ? ਮੈਨੂੰ ਇੱਥੇ ਉਤਰਨਾ ਹੈ।",
    romanization: "ki ih bus downtown jandi hai? mainu ithe utarna hai.",
    meaning_vi: "Xe buýt này có đi trung tâm không? Tôi cần xuống ở đây.",
    meaning_en: "Does this bus go downtown? I need to get off here.",
    recovery_steps_pa: ["ਮੈਂ ਰਸਤਾ ਭੁੱਲ ਗਿਆ/ਗਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    hardening_note_vi: "Khi tuyến thay đổi, cần xác nhận lại ngay.",
    hardening_note_en: "When a route changes, confirm it immediately.",
    canada_example_vi: "Dùng tại bến xe buýt Canada sau khi biển báo thay đổi.",
    canada_example_en: "Use at a Canadian bus stop after a route change.",
    learner_trap_vi: "Đừng chỉ dựa vào bảng English nếu Gurmukhi vẫn chưa rõ.",
    learner_trap_en: "Do not rely only on the English sign if the Gurmukhi is still unclear.",
  },
  {
    id: "pa-ca-recover-public-office-007",
    domain: "public_office",
    use: "final_hardening",
    failure_vi: "Cơ quan công chuyển bạn giữa các quầy và bạn cần biết phải đi đâu.",
    failure_en: "The public office sends you between counters and you need to know where to go.",
    recovery_goal_vi: "Hỏi quầy đúng và xin danh sách giấy tờ.",
    recovery_goal_en: "Ask for the correct counter and request the list of documents.",
    recovery_pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ? ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?",
    romanization: "mainu kis counter te jana chahida hai? mainu kihre dastavez chahide han?",
    meaning_vi: "Tôi nên đến quầy nào? Tôi cần giấy tờ nào?",
    meaning_en: "Which counter should I go to? Which documents do I need?",
    recovery_steps_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਨੰਬਰ ਲਿਖ ਦਿਓ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    hardening_note_vi: "Phục hồi luồng xử lý bằng câu hỏi đúng trọng tâm.",
    hardening_note_en: "Recover the workflow with the right focused question.",
    canada_example_vi: "Dùng ở trung tâm dịch vụ Canada khi quầy bị chuyển lòng vòng.",
    canada_example_en: "Use at a Canadian service centre when you are bounced between desks.",
    learner_trap_vi: "ਦਸਤਾਵੇਜ਼ là giấy tờ, không phải phỏng đoán thủ tục.",
    learner_trap_en: "ਦਸਤਾਵੇਜ਼ means documents, not a guess at the procedure.",
  },
  {
    id: "pa-ca-recover-service-desk-008",
    domain: "service_desk",
    use: "review",
    failure_vi: "Bạn bị trả qua lại giữa các giấy tờ và cần kéo lại người giúp ở quầy.",
    failure_en: "You are bounced between papers and need the desk helper to reset the conversation.",
    recovery_goal_vi: "Nói bạn cần giúp điền form và chỉ phần đang kẹt.",
    recovery_goal_en: "Say you need help filling the form and point to the stuck part.",
    recovery_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਹ ਹਿੱਸਾ ਦਿਖਾ ਸਕਦੇ ਹੋ?",
    romanization: "mainu ih form bharan vich madad chahidi hai. ki tusin ih hissa dikha sakde ho?",
    meaning_vi: "Tôi cần giúp điền mẫu đơn này. Bạn có thể chỉ phần này không?",
    meaning_en: "I need help filling out this form. Can you show this part?",
    recovery_steps_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਹਿੱਸਾ ਦਿਖਾਓ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    hardening_note_vi: "Khôi phục bằng cách chỉ đúng nơi bị kẹt thay vì đi vòng.",
    hardening_note_en: "Recover by pointing to the exact blockage instead of circling around it.",
    canada_example_vi: "Dùng ở quầy dịch vụ Canada khi mẫu đơn làm bạn đứng hình.",
    canada_example_en: "Use at a Canadian service desk when the form stalls you.",
    learner_trap_vi: "Đừng chỉ đưa giấy; hãy nói bạn cần gì.",
    learner_trap_en: "Do not only hand over the paper; say what you need.",
  },
  {
    id: "pa-ca-recover-interpreter-009",
    domain: "interpreter_request",
    use: "export_readiness",
    failure_vi: "Một tình huống quan trọng vượt quá mức hiểu của bạn và bạn cần hỗ trợ ngôn ngữ ngay.",
    failure_en: "An important situation goes beyond your understanding and you need language support now.",
    recovery_goal_vi: "Xin thông dịch viên và nói chậm lại.",
    recovery_goal_en: "Request an interpreter and ask for slower speech.",
    recovery_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।",
    romanization: "mainu dubhashiye di lor hai. kirpa karke hauli hauli bolo.",
    meaning_vi: "Tôi cần thông dịch viên. Làm ơn nói chậm hơn.",
    meaning_en: "I need an interpreter. Please speak more slowly.",
    recovery_steps_pa: ["ਮੈਂ ਅੰਗਰੇਜ਼ੀ/ਵਿਯਤਨਾਮੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    hardening_note_vi: "Xuất sang người hỗ trợ khi câu chuyện không thể tự xử lý bằng đoán.",
    hardening_note_en: "Export to language support when the situation cannot be handled by guessing.",
    canada_example_vi: "Dùng ở phòng khám, trường, hay cơ quan công Canada.",
    canada_example_en: "Use at a Canadian clinic, school, or public office.",
    learner_trap_vi: "Đây là yêu cầu hỗ trợ, không phải hỏi lớp học.",
    learner_trap_en: "This asks for support, not for a class.",
  },
  {
    id: "pa-ca-recover-emergency-010",
    domain: "emergency_boundary",
    use: "final_hardening",
    failure_vi: "Có nguy hiểm thật sự và bạn cần người khác gọi 911 ngay, không thêm chần chừ.",
    failure_en: "There is real danger and you need someone to call 911 now, with no delay.",
    recovery_goal_vi: "Nói đây là khẩn cấp và xin gọi 911.",
    recovery_goal_en: "Say it is an emergency and ask to call 911.",
    recovery_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    romanization: "ih emergency hai. kirpa karke nau-ikk-ikk te call karo.",
    meaning_vi: "Đây là trường hợp khẩn cấp. Làm ơn gọi 911.",
    meaning_en: "This is an emergency. Please call 911.",
    recovery_steps_pa: ["ਮਦਦ ਕਰੋ!", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    hardening_note_vi: "Trong khẩn cấp, mục tiêu là gọi trợ giúp, không phải luyện thêm.",
    hardening_note_en: "In an emergency, the goal is to get help, not to practice more.",
    canada_example_vi: "Ở Canada, câu này dùng để nhờ người khác gọi khẩn cấp.",
    canada_example_en: "In Canada, this is used to ask someone to call emergency services.",
    learner_trap_vi: "Bài học không thay thế dịch vụ khẩn cấp.",
    learner_trap_en: "The lesson does not replace emergency services.",
  },
  {
    id: "pa-ca-recover-workplace-011",
    domain: "workplace_safety",
    use: "regression",
    failure_vi: "Bạn chưa hiểu hướng dẫn an toàn nhưng sắp phải làm việc ngay.",
    failure_en: "You do not understand the safety instructions but need to work immediately.",
    recovery_goal_vi: "Dừng lại, nói chưa hiểu, và xin chỉ lại.",
    recovery_goal_en: "Pause, say you did not understand, and ask to be shown again.",
    recovery_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਦੁਬਾਰਾ ਦਿਖਾਓ।",
    romanization: "mainu samajh nahin aaya. kirpa karke ih dubara dikhao.",
    meaning_vi: "Tôi chưa hiểu. Làm ơn chỉ lại việc này.",
    meaning_en: "I did not understand. Please show this again.",
    recovery_steps_pa: ["ਸੁਰੱਖਿਆ ਨਿਯਮ ਕੀ ਹਨ?", "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।"],
    hardening_note_vi: "An toàn có giá trị hơn việc cố làm cho xong.",
    hardening_note_en: "Safety matters more than getting the task done quickly.",
    canada_example_vi: "Dùng với giám sát viên hoặc người hướng dẫn tại nơi làm việc Canada.",
    canada_example_en: "Use with a Canadian supervisor or trainer at work.",
    learner_trap_vi: "Đừng giả vờ hiểu nếu đây là việc có rủi ro.",
    learner_trap_en: "Do not pretend to understand if the task is risky.",
  },
];

export default PUNJABI_CANADA_SERVICE_RECOVERY_PACK;
