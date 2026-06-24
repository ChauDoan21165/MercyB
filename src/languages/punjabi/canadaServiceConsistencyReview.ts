// Punjabi Canada service consistency review for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner bridge only. Shahmukhi is
// awareness only, not a full course. Native review is deferred.

export type PunjabiCanadaServiceConsistencyDomain =
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

export type PunjabiCanadaServiceConsistencyUse =
  | "consistency_review"
  | "final_guardrail"
  | "export_readiness"
  | "integration_readiness";

export type PunjabiCanadaServiceConsistencyItem = {
  id: string;
  domain: PunjabiCanadaServiceConsistencyDomain;
  use: PunjabiCanadaServiceConsistencyUse;
  scenario_vi: string;
  scenario_en: string;
  consistency_goal_vi: string;
  consistency_goal_en: string;
  review_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  support_pa: string[];
  guardrail_vi: string;
  guardrail_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaServiceConsistencyReviewScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundaries: string[];
};

export const PUNJABI_CANADA_SERVICE_CONSISTENCY_REVIEW_SCOPE: PunjabiCanadaServiceConsistencyReviewScope = {
  name: "Punjabi Canada Service Consistency Review",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundaries: [
    "Language support only for Canada service consistency situations.",
    "No medical, legal, financial, tenancy, or workplace safety advice.",
  ],
};

export const PUNJABI_CANADA_SERVICE_CONSISTENCY_REVIEW: PunjabiCanadaServiceConsistencyItem[] = [
  {
    id: "pa-ca-consistency-clinic-001",
    domain: "clinic",
    use: "consistency_review",
    scenario_vi: "Quầy phòng khám hỏi nhanh và bạn muốn trả lời nhất quán, không đổi ý giữa chừng.",
    scenario_en: "The clinic desk asks quickly and you want to answer consistently, without changing your mind mid-way.",
    consistency_goal_vi: "Nói mình chưa hiểu, xin nói chậm, rồi giữ đúng một thông tin an toàn.",
    consistency_goal_en: "Say you did not understand, ask for slower speech, then keep to one safe fact.",
    review_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਸਮਝਾਓ। ਮੈਨੂੰ ਠੀਕ ਨਹੀਂ ਲੱਗ ਰਿਹਾ।",
    romanization: "mainu samajh nahin aaya. kirpa karke hauli hauli samjhao. mainu theek nahin lag riha.",
    meaning_vi: "Tôi chưa hiểu. Làm ơn giải thích chậm hơn. Tôi thấy không khỏe.",
    meaning_en: "I did not understand. Please explain more slowly. I do not feel well.",
    support_pa: ["ਮੈਨੂੰ ਇੱਥੇ ਦਰਦ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।"],
    guardrail_vi: "Consistency ở đây là giữ một câu an toàn thay vì nhảy qua nhiều ý.",
    guardrail_en: "Consistency here means keeping one safe line instead of jumping across ideas.",
    canada_example_vi: "Dùng ở phòng khám Canada để câu trả lời không bị lệch khi bạn căng thẳng.",
    canada_example_en: "Use at a Canadian clinic so your answer does not drift when you are stressed.",
    learner_trap_vi: "Đừng sửa câu giữa chừng nếu thông tin an toàn chưa rõ.",
    learner_trap_en: "Do not rewrite the line halfway if the safety information is still unclear.",
  },
  {
    id: "pa-ca-consistency-pharmacy-002",
    domain: "pharmacy",
    use: "final_guardrail",
    scenario_vi: "Dược sĩ hỏi về thuốc và bạn cần giữ câu trả lời an toàn, rõ ràng, nhất quán.",
    scenario_en: "The pharmacist asks about medicine and you need a safe, clear, consistent answer.",
    consistency_goal_vi: "Xác nhận lại câu hỏi và báo dị ứng trước khi nói tiếp.",
    consistency_goal_en: "Confirm the question and state the allergy before continuing.",
    review_pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ? ਮੈਨੂੰ ਦਵਾਈ ਤੋਂ ਐਲਰਜੀ ਹੈ।",
    romanization: "ki tusin ih dubara keh sakde ho? mainu davai ton allergy hai.",
    meaning_vi: "Bạn có thể nói lại không? Tôi bị dị ứng với thuốc.",
    meaning_en: "Can you say that again? I am allergic to medicine.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    guardrail_vi: "Không đoán tên thuốc nếu chưa nghe rõ.",
    guardrail_en: "Do not guess the medicine name if you did not hear it clearly.",
    canada_example_vi: "Ở nhà thuốc Canada, câu này giữ thông tin an toàn nhất quán.",
    canada_example_en: "At a Canadian pharmacy, this keeps safety information consistent.",
    learner_trap_vi: "Đừng trả lời ngắn nếu câu hỏi gốc chưa rõ.",
    learner_trap_en: "Do not answer too briefly if the original question was unclear.",
  },
  {
    id: "pa-ca-consistency-school-003",
    domain: "school_childcare",
    use: "integration_readiness",
    scenario_vi: "Văn phòng trường đưa form và bạn muốn các câu mình nói khớp nhau từ đầu đến cuối.",
    scenario_en: "The school office gives you a form and you want your answers to match from start to finish.",
    consistency_goal_vi: "Chỉ phần chưa hiểu và xin bản tiếng Anh nếu cần.",
    consistency_goal_en: "Point to the unclear part and ask for an English copy if needed.",
    review_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਹ ਹਿੱਸਾ ਦਿਖਾ ਸਕਦੇ ਹੋ?",
    romanization: "mainu ih form bharan vich madad chahidi hai. ki tusin ih hissa dikha sakde ho?",
    meaning_vi: "Tôi cần giúp điền mẫu đơn này. Bạn có thể chỉ phần này không?",
    meaning_en: "I need help filling out this form. Can you show this part?",
    support_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਨੋਟ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਦੇ ਸਕਦੇ ਹੋ?", "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ।"],
    guardrail_vi: "Consistency là giữ một cách nói rõ ràng thay vì trả lời khác nhau mỗi lần.",
    guardrail_en: "Consistency means keeping a clear line instead of changing answers each time.",
    canada_example_vi: "Dùng ở trường hoặc childcare Canada khi form làm bạn phải hỏi lại.",
    canada_example_en: "Use at a Canadian school or childcare centre when the form forces a follow-up.",
    learner_trap_vi: "Đừng gửi form im lặng rồi hy vọng người ta tự hiểu.",
    learner_trap_en: "Do not submit the form silently and hope they infer your need.",
  },
  {
    id: "pa-ca-consistency-bank-004",
    domain: "bank",
    use: "final_guardrail",
    scenario_vi: "Ngân hàng đông và bạn cần nói ngắn nhưng không được lệch mục tiêu.",
    scenario_en: "The bank is busy and you need to be brief without drifting from the goal.",
    consistency_goal_vi: "Nói muốn mở tài khoản, nêu là người mới, và hỏi phí.",
    consistency_goal_en: "Say you want to open an account, note that you are new, and ask about fees.",
    review_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਹੈ। ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ। ਫੀਸ ਕਿੰਨੀ ਹੈ?",
    romanization: "mainu bank khata kholhna hai. main nava aia/navi ai han. fees kinni hai?",
    meaning_vi: "Tôi muốn mở tài khoản ngân hàng. Tôi mới đến. Phí là bao nhiêu?",
    meaning_en: "I want to open a bank account. I am new here. How much is the fee?",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।", "ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ।"],
    guardrail_vi: "Đừng đổi sang chủ đề thẻ khi mục tiêu là mở tài khoản.",
    guardrail_en: "Do not switch to card topics when the goal is opening an account.",
    canada_example_vi: "Ở quầy ngân hàng Canada, câu này giữ cuộc nói chuyện đồng nhất.",
    canada_example_en: "At a Canadian bank counter, this keeps the conversation aligned.",
    learner_trap_vi: "ਖਾਤਾ là tài khoản; không đổi thành ਕਾਰਡ.",
    learner_trap_en: "ਖਾਤਾ means account; do not swap it for ਕਾਰਡ.",
  },
  {
    id: "pa-ca-consistency-housing-005",
    domain: "housing",
    use: "consistency_review",
    scenario_vi: "Chủ nhà hứa sửa nhưng chưa cho thời gian và bạn cần giữ yêu cầu ổn định.",
    scenario_en: "The landlord promises a fix but gives no time and you need to keep the request stable.",
    consistency_goal_vi: "Xin thời gian sửa và yêu cầu trả lời bằng văn bản.",
    consistency_goal_en: "Ask for a repair time and request a written reply.",
    review_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਲਈ ਸਮਾਂ ਦੱਸੋ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਕੇ ਭੇਜੋ।",
    romanization: "kirpa karke murammat lai samah daso. kirpa karke ih likh ke bhejo.",
    meaning_vi: "Làm ơn cho biết thời gian sửa chữa. Làm ơn gửi điều này bằng văn bản.",
    meaning_en: "Please give a repair time. Please send this in writing.",
    support_pa: ["ਹੀਟਿੰਗ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    guardrail_vi: "Giữ yêu cầu ở mức dịch vụ, không chuyển sang tư vấn luật.",
    guardrail_en: "Keep the request at the service level, not legal advice.",
    canada_example_vi: "Dùng ở nhà thuê Canada khi sự cố kéo dài mà chưa có lịch sửa.",
    canada_example_en: "Use in a Canadian rental when the issue drags on without a repair time.",
    learner_trap_vi: "Đừng để lời hứa chung chung thay cho kế hoạch sửa.",
    learner_trap_en: "Do not let a vague promise replace a repair plan.",
  },
  {
    id: "pa-ca-consistency-transport-006",
    domain: "transport",
    use: "export_readiness",
    scenario_vi: "Tuyến thay đổi và bạn cần một câu nhất quán để xác nhận nhanh.",
    scenario_en: "The route changes and you need a consistent line for a quick confirmation.",
    consistency_goal_vi: "Hỏi xe có đi downtown và nói nơi cần xuống.",
    consistency_goal_en: "Ask whether the bus goes downtown and say where you need to get off.",
    review_pa: "ਕੀ ਇਹ ਬੱਸ ਡਾਊਨਟਾਊਨ ਜਾਂਦੀ ਹੈ? ਮੈਨੂੰ ਇੱਥੇ ਉਤਰਨਾ ਹੈ।",
    romanization: "ki ih bus downtown jandi hai? mainu ithe utarna hai.",
    meaning_vi: "Xe buýt này có đi trung tâm không? Tôi cần xuống ở đây.",
    meaning_en: "Does this bus go downtown? I need to get off here.",
    support_pa: ["ਮੈਂ ਰਸਤਾ ਭੁੱਲ ਗਿਆ/ਗਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    guardrail_vi: "Xuất dùng nhanh khi lịch trình thay đổi và bạn cần nhất quán.",
    guardrail_en: "Export-ready for quick use when schedules change and you need consistency.",
    canada_example_vi: "Dùng ở bến xe buýt Canada khi tuyến mới làm bạn bối rối.",
    canada_example_en: "Use at a Canadian bus stop when a route change has confused you.",
    learner_trap_vi: "Đừng chỉ nhìn bảng English nếu Gurmukhi vẫn chưa rõ.",
    learner_trap_en: "Do not rely only on the English sign if the Gurmukhi is still unclear.",
  },
  {
    id: "pa-ca-consistency-public-office-007",
    domain: "public_office",
    use: "final_guardrail",
    scenario_vi: "Cơ quan công chuyển bạn giữa các quầy và bạn cần giữ cùng một mục tiêu.",
    scenario_en: "The public office sends you between counters and you need to keep the same goal.",
    consistency_goal_vi: "Hỏi quầy đúng và xin danh sách giấy tờ.",
    consistency_goal_en: "Ask for the correct counter and request the document list.",
    review_pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ? ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?",
    romanization: "mainu kis counter te jana chahida hai? mainu kihre dastavez chahide han?",
    meaning_vi: "Tôi nên đến quầy nào? Tôi cần giấy tờ nào?",
    meaning_en: "Which counter should I go to? Which documents do I need?",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਨੰਬਰ ਲਿਖ ਦਿਓ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    guardrail_vi: "Đừng đoán thủ tục; cứ hỏi đúng quầy và đúng giấy tờ.",
    guardrail_en: "Do not guess the procedure; ask for the right counter and documents.",
    canada_example_vi: "Dùng ở trung tâm dịch vụ Canada khi bị chuyển quầy nhiều lần.",
    canada_example_en: "Use at a Canadian service centre when you are bounced between counters.",
    learner_trap_vi: "ਦਸਤਾਵੇਜ਼ là giấy tờ, không phải suy đoán thủ tục.",
    learner_trap_en: "ਦਸਤਾਵੇਜ਼ means documents, not a guess at the procedure.",
  },
  {
    id: "pa-ca-consistency-forms-008",
    domain: "forms_service_desk",
    use: "consistency_review",
    scenario_vi: "Bạn bị kẹt ở quầy dịch vụ và muốn quay lại cùng một chỗ chưa hiểu.",
    scenario_en: "You are stuck at the service desk and want to return to the same unclear part.",
    consistency_goal_vi: "Chỉ phần kẹt và xin chỉ lại.",
    consistency_goal_en: "Point to the stuck part and ask to be shown again.",
    review_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਹ ਹਿੱਸਾ ਦਿਖਾ ਸਕਦੇ ਹੋ?",
    romanization: "mainu ih form bharan vich madad chahidi hai. ki tusin ih hissa dikha sakde ho?",
    meaning_vi: "Tôi cần giúp điền mẫu đơn này. Bạn có thể chỉ phần này không?",
    meaning_en: "I need help filling out this form. Can you show this part?",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਹਿੱਸਾ ਦਿਖਾਓ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    guardrail_vi: "Giữ câu hỏi ở đúng phần đang gây kẹt.",
    guardrail_en: "Keep the question on the exact stuck part.",
    canada_example_vi: "Dùng ở quầy dịch vụ Canada khi form làm bạn đứng hình.",
    canada_example_en: "Use at a Canadian service desk when the form stalls you.",
    learner_trap_vi: "Đừng chỉ đưa giấy; hãy nói rõ bạn cần gì.",
    learner_trap_en: "Do not only hand over the paper; state your need.",
  },
  {
    id: "pa-ca-consistency-interpreter-009",
    domain: "interpreter_request",
    use: "integration_readiness",
    scenario_vi: "Tình huống quan trọng vượt quá mức hiểu của bạn và bạn cần hỗ trợ ngôn ngữ.",
    scenario_en: "The situation goes beyond your understanding and you need language support.",
    consistency_goal_vi: "Xin thông dịch viên và nói chậm lại.",
    consistency_goal_en: "Request an interpreter and ask for slower speech.",
    review_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।",
    romanization: "mainu dubhashiye di lor hai. kirpa karke hauli hauli bolo.",
    meaning_vi: "Tôi cần thông dịch viên. Làm ơn nói chậm hơn.",
    meaning_en: "I need an interpreter. Please speak more slowly.",
    support_pa: ["ਮੈਂ ਅੰਗਰੇਜ਼ੀ/ਵਿਯਤਨਾਮੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    guardrail_vi: "Nên bật hỗ trợ ngôn ngữ trước khi tình huống đi xa hơn.",
    guardrail_en: "Turn on language support before the situation moves further.",
    canada_example_vi: "Dùng ở phòng khám, trường, hay cơ quan công Canada.",
    canada_example_en: "Use at a Canadian clinic, school, or public office.",
    learner_trap_vi: "Đây là yêu cầu hỗ trợ, không phải hỏi lớp học.",
    learner_trap_en: "This requests support, not a class.",
  },
  {
    id: "pa-ca-consistency-emergency-010",
    domain: "emergency_boundary",
    use: "final_guardrail",
    scenario_vi: "Có nguy hiểm thật sự và bạn phải nhờ gọi 911 ngay.",
    scenario_en: "There is real danger and you must ask for 911 immediately.",
    consistency_goal_vi: "Nói đây là khẩn cấp và xin gọi 911.",
    consistency_goal_en: "Say it is an emergency and ask to call 911.",
    review_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    romanization: "ih emergency hai. kirpa karke nau-ikk-ikk te call karo.",
    meaning_vi: "Đây là trường hợp khẩn cấp. Làm ơn gọi 911.",
    meaning_en: "This is an emergency. Please call 911.",
    support_pa: ["ਮਦਦ ਕਰੋ!", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    guardrail_vi: "Ranh giới ở đây là gọi trợ giúp, không trì hoãn.",
    guardrail_en: "The boundary here is to get help, not delay.",
    canada_example_vi: "Ở Canada, câu này dùng để nhờ người khác gọi khẩn cấp.",
    canada_example_en: "In Canada, this is used to ask someone to call emergency services.",
    learner_trap_vi: "Bài học không thay thế dịch vụ khẩn cấp.",
    learner_trap_en: "The lesson does not replace emergency services.",
  },
  {
    id: "pa-ca-consistency-workplace-011",
    domain: "workplace_safety",
    use: "consistency_review",
    scenario_vi: "Bạn chưa hiểu hướng dẫn an toàn nhưng sắp phải làm việc.",
    scenario_en: "You do not understand the safety instructions but need to work.",
    consistency_goal_vi: "Dừng lại, nói chưa hiểu, và xin chỉ lại.",
    consistency_goal_en: "Pause, say you did not understand, and ask to be shown again.",
    review_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਦੁਬਾਰਾ ਦਿਖਾਓ।",
    romanization: "mainu samajh nahin aaya. kirpa karke ih dubara dikhao.",
    meaning_vi: "Tôi chưa hiểu. Làm ơn chỉ lại việc này.",
    meaning_en: "I did not understand. Please show this again.",
    support_pa: ["ਸੁਰੱਖਿਆ ਨਿਯਮ ਕੀ ਹਨ?", "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।"],
    guardrail_vi: "Không giả vờ hiểu trong việc có rủi ro.",
    guardrail_en: "Do not pretend to understand risky work.",
    canada_example_vi: "Dùng với giám sát viên hoặc người hướng dẫn tại nơi làm việc Canada.",
    canada_example_en: "Use with a Canadian supervisor or trainer at work.",
    learner_trap_vi: "Đừng tiếp tục việc có rủi ro khi chưa rõ hướng dẫn.",
    learner_trap_en: "Do not continue risky work when the instructions are unclear.",
  },
];

export default PUNJABI_CANADA_SERVICE_CONSISTENCY_REVIEW;
