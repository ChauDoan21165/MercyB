// Punjabi Canada survival stress tests for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary. Romanization is a bridge only. Shahmukhi is awareness
// only, not a full course. Native review is deferred.

export type PunjabiCanadaSurvivalStressDomain =
  | "clinic"
  | "pharmacy"
  | "school_childcare"
  | "bank"
  | "housing"
  | "transport"
  | "interpreter_request"
  | "emergency_boundary"
  | "workplace_safety"
  | "forms_service_desk";

export type PunjabiCanadaSurvivalStressUse =
  | "stress_test"
  | "final_risk"
  | "final_qa";

export type PunjabiCanadaSurvivalStressTest = {
  id: string;
  domain: PunjabiCanadaSurvivalStressDomain;
  use: PunjabiCanadaSurvivalStressUse;
  scenario_vi: string;
  scenario_en: string;
  learner_goal_vi: string;
  learner_goal_en: string;
  response_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  followup_pa: string[];
  risk_note_vi: string;
  risk_note_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaSurvivalStressPackScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  limits: string[];
};

export const PUNJABI_CANADA_SURVIVAL_STRESS_PACK_SCOPE: PunjabiCanadaSurvivalStressPackScope = {
  name: "Punjabi Canada Survival Stress Tests",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization helps recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  limits: [
    "Language support only for survival situations in Canada.",
    "No medical, legal, banking, tenancy, or workplace safety advice.",
  ],
};

export const PUNJABI_CANADA_SURVIVAL_STRESS_TESTS: PunjabiCanadaSurvivalStressTest[] = [
  {
    id: "pa-ca-stress-clinic-001",
    domain: "clinic",
    use: "stress_test",
    scenario_vi: "Nhân viên hỏi nhanh và bạn chỉ hiểu một phần ở quầy phòng khám.",
    scenario_en: "Staff speak quickly and you only understand part of it at the clinic desk.",
    learner_goal_vi: "Xin lặp lại và nói mình không khỏe.",
    learner_goal_en: "Ask for repetition and say you do not feel well.",
    response_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਸਮਝਾਓ।",
    romanization: "mainu samajh nahin aaya. kirpa karke hauli hauli samjhao.",
    meaning_vi: "Tôi chưa hiểu. Làm ơn giải thích chậm hơn.",
    meaning_en: "I did not understand. Please explain more slowly.",
    followup_pa: ["ਮੈਨੂੰ ਠੀਕ ਨਹੀਂ ਲੱਗ ਰਿਹਾ।", "ਮੈਨੂੰ ਇੱਥੇ ਦਰਦ ਹੈ।"],
    risk_note_vi: "Câu này chỉ xin lặp lại; không thay thế mô tả triệu chứng.",
    risk_note_en: "This asks for repetition only; it does not replace symptom description.",
    canada_example_vi: "Dùng khi quầy phòng khám Canada hỏi quá nhanh.",
    canada_example_en: "Use when a Canadian clinic desk speaks too quickly.",
    learner_trap_vi: "Đừng im lặng khi chỉ nghe được một nửa.",
    learner_trap_en: "Do not stay silent when you only understand half.",
  },
  {
    id: "pa-ca-stress-pharmacy-002",
    domain: "pharmacy",
    use: "final_risk",
    scenario_vi: "Dược sĩ hỏi về dị ứng nhưng bạn không chắc mình nghe đúng.",
    scenario_en: "The pharmacist asks about allergies, but you are not sure you heard correctly.",
    learner_goal_vi: "Xác nhận lại và báo dị ứng rõ ràng.",
    learner_goal_en: "Confirm the question and state the allergy clearly.",
    response_pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ? ਮੈਨੂੰ ਦਵਾਈ ਤੋਂ ਐਲਰਜੀ ਹੈ।",
    romanization: "ki tusin ih dubara keh sakde ho? mainu davai ton allergy hai.",
    meaning_vi: "Bạn có thể nói lại không? Tôi bị dị ứng với thuốc.",
    meaning_en: "Can you say that again? I am allergic to medicine.",
    followup_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    risk_note_vi: "Khi liên quan thuốc, ưu tiên nói rõ dị ứng hơn là đoán.",
    risk_note_en: "When medicine is involved, clarity about allergies matters more than guessing.",
    canada_example_vi: "Ở nhà thuốc Canada, câu này giúp tránh hiểu sai thông tin an toàn.",
    canada_example_en: "At a Canadian pharmacy, this helps avoid misunderstanding safety information.",
    learner_trap_vi: "Đừng dùng câu ngắn quá nếu chưa hiểu câu hỏi ban đầu.",
    learner_trap_en: "Do not answer with an overly short line if you did not understand the original question.",
  },
  {
    id: "pa-ca-stress-school-003",
    domain: "school_childcare",
    use: "stress_test",
    scenario_vi: "Văn phòng trường đưa mẫu đơn và bạn không biết phải điền phần nào trước.",
    scenario_en: "The school office gives you a form and you do not know which part to fill in first.",
    learner_goal_vi: "Xin chỉ phần cần điền và hỏi nếu có ghi chú tiếng Anh.",
    learner_goal_en: "Ask which part to fill in and whether there is an English note.",
    response_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਹ ਹਿੱਸਾ ਦਿਖਾ ਸਕਦੇ ਹੋ?",
    romanization: "mainu ih form bharan vich madad chahidi hai. ki tusin ih hissa dikha sakde ho?",
    meaning_vi: "Tôi cần giúp điền mẫu đơn này. Bạn có thể chỉ phần này không?",
    meaning_en: "I need help filling out this form. Can you show this part?",
    followup_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਨੋਟ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਦੇ ਸਕਦੇ ਹੋ?", "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ।"],
    risk_note_vi: "Form chỉ là mẫu đơn; không đoán câu trả lời nếu phần nào chưa rõ.",
    risk_note_en: "A form is only paperwork; do not guess if any part is unclear.",
    canada_example_vi: "Dùng ở văn phòng trường hoặc trung tâm giữ trẻ tại Canada.",
    canada_example_en: "Use at a Canadian school office or childcare centre.",
    learner_trap_vi: "Đừng chỉ nói form mà không chỉ rõ phần cần giúp.",
    learner_trap_en: "Do not only say form without naming the part you need help with.",
  },
  {
    id: "pa-ca-stress-bank-004",
    domain: "bank",
    use: "final_qa",
    scenario_vi: "Ngân hàng đang đông và bạn phải nói nhu cầu thật ngắn gọn.",
    scenario_en: "The bank is busy and you need to say your need very briefly.",
    learner_goal_vi: "Nói mình muốn mở tài khoản và hỏi phí.",
    learner_goal_en: "Say you want to open an account and ask about fees.",
    response_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਹੈ। ਫੀਸ ਕਿੰਨੀ ਹੈ?",
    romanization: "mainu bank khata kholhna hai. fees kinni hai?",
    meaning_vi: "Tôi muốn mở tài khoản ngân hàng. Phí là bao nhiêu?",
    meaning_en: "I want to open a bank account. How much is the fee?",
    followup_pa: ["ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    risk_note_vi: "Ngắn gọn là tốt, nhưng phải đúng ý và đúng từ.",
    risk_note_en: "Brief is fine, but the meaning and wording still need to be correct.",
    canada_example_vi: "Ở quầy ngân hàng Canada, câu này xử lý tình huống đông người.",
    canada_example_en: "At a Canadian bank counter, this handles a busy situation.",
    learner_trap_vi: "ਖਾਤਾ là tài khoản; đừng thay bằng ਕਾਰਡ.",
    learner_trap_en: "ਖਾਤਾ means account; do not replace it with ਕਾਰਡ.",
  },
  {
    id: "pa-ca-stress-housing-005",
    domain: "housing",
    use: "stress_test",
    scenario_vi: "Chủ nhà nói sẽ sửa nhưng không cho thời gian cụ thể.",
    scenario_en: "The landlord says it will be fixed but does not give a specific time.",
    learner_goal_vi: "Yêu cầu thời gian sửa và xin câu trả lời bằng văn bản.",
    learner_goal_en: "Ask for a repair time and request a written reply.",
    response_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਲਈ ਸਮਾਂ ਦੱਸੋ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਕੇ ਭੇਜੋ।",
    romanization: "kirpa karke murammat lai samah daso. kirpa karke ih likh ke bhejo.",
    meaning_vi: "Làm ơn cho biết thời gian sửa chữa. Làm ơn gửi điều này bằng văn bản.",
    meaning_en: "Please give a repair time. Please send this in writing.",
    followup_pa: ["ਹੀਟਿੰਗ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    risk_note_vi: "Đừng để yêu cầu trôi đi thành cuộc nói chuyện chung chung.",
    risk_note_en: "Do not let the request drift into a vague conversation.",
    canada_example_vi: "Dùng cho căn hộ thuê ở Canada khi một vấn đề kéo dài.",
    canada_example_en: "Use for a Canadian rental when a problem keeps dragging on.",
    learner_trap_vi: "Phải nhấn vào sự cố cụ thể, không chỉ nói nhà có vấn đề.",
    learner_trap_en: "You need the specific issue, not only that the home has a problem.",
  },
  {
    id: "pa-ca-stress-transport-006",
    domain: "transport",
    use: "final_risk",
    scenario_vi: "Tuyến xe bị đổi và bạn cần xác nhận có đi downtown không.",
    scenario_en: "The route changed and you need to confirm whether it goes downtown.",
    learner_goal_vi: "Hỏi xe có đi trung tâm và nói mình cần xuống.",
    learner_goal_en: "Ask whether the bus goes downtown and say where you need to get off.",
    response_pa: "ਕੀ ਇਹ ਬੱਸ ਡਾਊਨਟਾਊਨ ਜਾਂਦੀ ਹੈ? ਮੈਨੂੰ ਇੱਥੇ ਉਤਰਨਾ ਹੈ।",
    romanization: "ki ih bus downtown jandi hai? mainu ithe utarna hai.",
    meaning_vi: "Xe buýt này có đi trung tâm không? Tôi cần xuống ở đây.",
    meaning_en: "Does this bus go downtown? I need to get off here.",
    followup_pa: ["ਮੈਂ ਰਸਤਾ ਭੁੱਲ ਗਿਆ/ਗਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    risk_note_vi: "Khi xe đổi tuyến, xác nhận lại ngay thay vì đoán.",
    risk_note_en: "When a route changes, confirm immediately rather than guessing.",
    canada_example_vi: "Dùng ở bến xe buýt Canada khi bạn không chắc tuyến mới.",
    canada_example_en: "Use at a Canadian bus stop when you are unsure about a new route.",
    learner_trap_vi: "Đừng chỉ xem bảng tiếng Anh nếu không chắc chữ Gurmukhi.",
    learner_trap_en: "Do not rely only on the English sign if the Gurmukhi is unclear.",
  },
  {
    id: "pa-ca-stress-interpreter-007",
    domain: "interpreter_request",
    use: "final_qa",
    scenario_vi: "Tình huống quan trọng và bạn không hiểu đủ để tự quyết.",
    scenario_en: "The situation is important and you do not understand enough to decide on your own.",
    learner_goal_vi: "Yêu cầu thông dịch viên ngay.",
    learner_goal_en: "Request an interpreter right away.",
    response_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।",
    romanization: "mainu dubhashiye di lor hai. kirpa karke hauli hauli bolo.",
    meaning_vi: "Tôi cần thông dịch viên. Làm ơn nói chậm hơn.",
    meaning_en: "I need an interpreter. Please speak more slowly.",
    followup_pa: ["ਮੈਂ ਅੰਗਰੇਜ਼ੀ/ਵਿਯਤਨਾਮੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    risk_note_vi: "Không đoán trong tình huống quan trọng; xin hỗ trợ ngôn ngữ.",
    risk_note_en: "Do not guess in an important situation; ask for language support.",
    canada_example_vi: "Dùng ở phòng khám, trường, hoặc cơ quan công Canada.",
    canada_example_en: "Use at a Canadian clinic, school, or public office.",
    learner_trap_vi: "Đây là yêu cầu hỗ trợ, không phải hỏi học thêm.",
    learner_trap_en: "This requests support, not a class.",
  },
  {
    id: "pa-ca-stress-emergency-008",
    domain: "emergency_boundary",
    use: "final_risk",
    scenario_vi: "Có nguy hiểm thật sự và bạn cần ai đó gọi 911 ngay.",
    scenario_en: "There is real danger and you need someone to call 911 now.",
    learner_goal_vi: "Nói đây là khẩn cấp và xin gọi 911.",
    learner_goal_en: "Say it is an emergency and ask to call 911.",
    response_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    romanization: "ih emergency hai. kirpa karke nau-ikk-ikk te call karo.",
    meaning_vi: "Đây là trường hợp khẩn cấp. Làm ơn gọi 911.",
    meaning_en: "This is an emergency. Please call 911.",
    followup_pa: ["ਮਦਦ ਕਰੋ!", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    risk_note_vi: "Không trì hoãn bằng thêm luyện tập khi có nguy hiểm thật.",
    risk_note_en: "Do not delay with more practice when there is real danger.",
    canada_example_vi: "Ở Canada, câu này dùng để nhờ người khác gọi khẩn cấp.",
    canada_example_en: "In Canada, this is used to ask someone to call emergency services.",
    learner_trap_vi: "Bài học không thay thế dịch vụ khẩn cấp.",
    learner_trap_en: "The lesson does not replace emergency services.",
  },
  {
    id: "pa-ca-stress-workplace-009",
    domain: "workplace_safety",
    use: "stress_test",
    scenario_vi: "Bạn không hiểu hướng dẫn an toàn nhưng sắp phải làm việc ngay.",
    scenario_en: "You do not understand the safety instructions but need to work right away.",
    learner_goal_vi: "Dừng lại, xin chỉ lại, và nói chưa hiểu.",
    learner_goal_en: "Pause, ask to be shown again, and say you did not understand.",
    response_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਦੁਬਾਰਾ ਦਿਖਾਓ।",
    romanization: "mainu samajh nahin aaya. kirpa karke ih dubara dikhao.",
    meaning_vi: "Tôi chưa hiểu. Làm ơn chỉ lại việc này.",
    meaning_en: "I did not understand. Please show this again.",
    followup_pa: ["ਸੁਰੱਖਿਆ ਨਿਯਮ ਕੀ ਹਨ?", "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।"],
    risk_note_vi: "An toàn ưu tiên hơn tốc độ.",
    risk_note_en: "Safety matters more than speed.",
    canada_example_vi: "Dùng với giám sát viên hoặc người hướng dẫn ở nơi làm việc Canada.",
    canada_example_en: "Use with a Canadian supervisor or trainer at work.",
    learner_trap_vi: "Đừng giả vờ hiểu nếu đây là việc có rủi ro.",
    learner_trap_en: "Do not pretend to understand if the task is risky.",
  },
  {
    id: "pa-ca-stress-forms-010",
    domain: "forms_service_desk",
    use: "final_risk",
    scenario_vi: "Quầy dịch vụ chuyển bạn từ tờ này sang tờ khác và bạn bị rối.",
    scenario_en: "The service desk keeps sending you from one sheet to another and you are confused.",
    learner_goal_vi: "Yêu cầu người ta chỉ rõ phần cần điền.",
    learner_goal_en: "Ask for the exact part that needs to be filled in.",
    response_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਹ ਹਿੱਸਾ ਦਿਖਾ ਸਕਦੇ ਹੋ?",
    romanization: "mainu ih form bharan vich madad chahidi hai. ki tusin ih hissa dikha sakde ho?",
    meaning_vi: "Tôi cần giúp điền mẫu đơn này. Bạn có thể chỉ phần này không?",
    meaning_en: "I need help filling out this form. Can you show this part?",
    followup_pa: ["ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।", "ਕਿਰਪਾ ਕਰਕੇ ਨੰਬਰ ਲਿਖ ਦਿਓ।"],
    risk_note_vi: "Giữ yêu cầu vào đúng phần đang gây rối.",
    risk_note_en: "Keep the request focused on the part that is causing confusion.",
    canada_example_vi: "Dùng ở quầy dịch vụ Canada khi giấy tờ bị trả qua lại.",
    canada_example_en: "Use at a Canadian service desk when paperwork keeps getting bounced around.",
    learner_trap_vi: "Đừng chỉ cầm giấy; phải nói rõ phần nào cần hỗ trợ.",
    learner_trap_en: "Do not only hold the paper; state which part needs help.",
  },
];

export default PUNJABI_CANADA_SURVIVAL_STRESS_TESTS;
