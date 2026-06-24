// Punjabi Canada survival smoke deck for Vietnamese-speaking and
// English-speaking learners.
//
// This is content readiness data only. It is not A11 integration.
// Gurmukhi is primary. Romanization is a bridge only. Shahmukhi is awareness
// only, not a full course. Native review is deferred.

export type PunjabiCanadaSurvivalSmokeDomain =
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

export type PunjabiCanadaSurvivalSmokeCheck =
  | "smoke_check"
  | "final_qa"
  | "integration_readiness"
  | "repair";

export type PunjabiCanadaSurvivalSmokeItem = {
  id: string;
  domain: PunjabiCanadaSurvivalSmokeDomain;
  check: PunjabiCanadaSurvivalSmokeCheck;
  task_vi: string;
  task_en: string;
  phrase_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  canada_context_vi: string;
  canada_context_en: string;
  smoke_expectation_vi: string;
  smoke_expectation_en: string;
  readiness_note_vi: string;
  readiness_note_en: string;
  boundary_vi: string;
  boundary_en: string;
  support_pa: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaSurvivalSmokeScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  smokeBoundary: string;
};

export const PUNJABI_CANADA_SURVIVAL_SMOKE_SCOPE: PunjabiCanadaSurvivalSmokeScope = {
  name: "Punjabi Canada Survival Smoke Deck",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  smokeBoundary:
    "Representative smoke-check, final-QA, and integration-readiness content for Canadian survival tasks; not A11 integration, not legal advice, not medical advice, and not financial advice.",
};

export const PUNJABI_CANADA_SURVIVAL_SMOKE_DOMAINS: PunjabiCanadaSurvivalSmokeDomain[] = [
  "clinic",
  "pharmacy",
  "school_childcare",
  "bank",
  "housing",
  "transport",
  "public_office",
  "service_desk",
  "interpreter_request",
  "emergency_boundary",
  "workplace_safety",
];

export const PUNJABI_CANADA_SURVIVAL_SMOKE_DECK: PunjabiCanadaSurvivalSmokeItem[] = [
  {
    id: "pa-ca-smoke-clinic-001",
    domain: "clinic",
    check: "smoke_check",
    task_vi: "Check-in ở clinic và xin nói chậm.",
    task_en: "Check in at a clinic and ask for slow speech.",
    phrase_pa: "ਮੇਰੀ ਅੱਜ ਅਪਾਇੰਟਮੈਂਟ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।",
    romanization: "meri ajj appointment hai. kirpa karke hauli bolo.",
    meaning_vi: "Hôm nay tôi có lịch hẹn. Làm ơn nói chậm.",
    meaning_en: "I have an appointment today. Please speak slowly.",
    canada_context_vi: "Ở Canada, dùng tại clinic desk trước khi xác nhận tên, health card, hoặc phòng.",
    canada_context_en: "In Canada, use at a clinic desk before confirming name, health card, or room.",
    smoke_expectation_vi: "Smoke check đạt nếu câu nêu appointment và repair request rõ ràng.",
    smoke_expectation_en: "Smoke check passes if the line states appointment and a repair request clearly.",
    readiness_note_vi: "Learner sẵn sàng nếu hỏi lại giờ hoặc phòng khi chưa rõ.",
    readiness_note_en: "The learner is ready if they ask again about time or room when unclear.",
    boundary_vi: "Câu này không phải lời khuyên y tế.",
    boundary_en: "This is not medical advice.",
    support_pa: ["ਮੇਰਾ ਨਾਮ ਇਹ ਹੈ।", "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?"],
    learner_trap_vi: "Đừng gật đầu nếu không nghe rõ tên hoặc giờ hẹn.",
    learner_trap_en: "Do not nod if the name or appointment time is unclear.",
  },
  {
    id: "pa-ca-smoke-pharmacy-002",
    domain: "pharmacy",
    check: "final_qa",
    task_vi: "Pickup thuốc và xin hướng dẫn viết ra.",
    task_en: "Pick up medicine and ask for written instructions.",
    phrase_pa: "ਮੈਨੂੰ ਇਹ ਦਵਾਈ ਲੈਣੀ ਹੈ। ਹਦਾਇਤਾਂ ਲਿਖ ਦਿਓ ਜੀ।",
    romanization: "mainu ih davai laini hai. hadaitan likh dio ji.",
    meaning_vi: "Tôi cần lấy thuốc này. Xin viết hướng dẫn ra.",
    meaning_en: "I need to pick up this medicine. Please write the instructions down.",
    canada_context_vi: "Dùng tại pharmacy pickup counter khi hỏi label, refill, hoặc dị ứng.",
    canada_context_en: "Use at a pharmacy pickup counter when asking about the label, refill, or allergy.",
    smoke_expectation_vi: "Final QA đạt nếu sample không tự đưa liều hoặc chẩn đoán.",
    smoke_expectation_en: "Final QA passes if the sample does not provide dose or diagnosis.",
    readiness_note_vi: "Learner cần xin pharmacist xác nhận số lần/ngày.",
    readiness_note_en: "The learner should ask the pharmacist to confirm times per day.",
    boundary_vi: "Không dùng câu này để quyết định liều thuốc.",
    boundary_en: "Do not use this line to decide medicine dose.",
    support_pa: ["ਦਿਨ ਵਿੱਚ ਕਿੰਨੀ ਵਾਰ?", "ਮੈਨੂੰ ਐਲਰਜੀ ਹੈ।"],
    learner_trap_vi: "Đừng đoán từ trí nhớ nếu label chưa rõ.",
    learner_trap_en: "Do not guess from memory if the label is unclear.",
  },
  {
    id: "pa-ca-smoke-school-childcare-003",
    domain: "school_childcare",
    check: "smoke_check",
    task_vi: "Báo con vắng mặt hoặc thay đổi pickup.",
    task_en: "Report a child absence or pickup change.",
    phrase_pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਦਫ਼ਤਰ ਨੂੰ ਦੱਸੋ।",
    romanization: "mera bacha ajj gairhazir hai. kirpa karke daftar nu dasso.",
    meaning_vi: "Hôm nay con tôi vắng mặt. Làm ơn báo văn phòng.",
    meaning_en: "My child is absent today. Please tell the office.",
    canada_context_vi: "Ở Canada, dùng qua school office, daycare desk, attendance line, hoặc app.",
    canada_context_en: "In Canada, use through a school office, daycare desk, attendance line, or app.",
    smoke_expectation_vi: "Smoke check đạt nếu có child, date, và action cần làm.",
    smoke_expectation_en: "Smoke check passes if it includes child, date, and needed action.",
    readiness_note_vi: "Learner sẵn sàng nếu thêm tên con và lớp/daycare room.",
    readiness_note_en: "The learner is ready if they add the child's name and class/daycare room.",
    boundary_vi: "Câu này không thay thế policy của school hoặc childcare.",
    boundary_en: "This does not replace school or childcare policy.",
    support_pa: ["ਬੱਚੇ ਦਾ ਨਾਮ ਇਹ ਹੈ।", "ਅੱਜ ਹੋਰ ਵਿਅਕਤੀ ਲੈਣ ਆਵੇਗਾ/ਆਵੇਗੀ।"],
    learner_trap_vi: "Đừng bỏ tên con nếu office có nhiều học sinh.",
    learner_trap_en: "Do not skip the child's name when the office has many students.",
  },
  {
    id: "pa-ca-smoke-bank-004",
    domain: "bank",
    check: "final_qa",
    task_vi: "Hỏi thông tin chung về tài khoản và phí.",
    task_en: "Ask general information about an account and fees.",
    phrase_pa: "ਮੈਨੂੰ ਖਾਤੇ ਬਾਰੇ ਆਮ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ। ਫੀਸ ਲਿਖ ਦਿਓ ਜੀ।",
    romanization: "mainu khate bare aam jankari chahidi hai. fees likh dio ji.",
    meaning_vi: "Tôi cần thông tin chung về tài khoản. Xin viết phí ra.",
    meaning_en: "I need general account information. Please write down the fees.",
    canada_context_vi: "Dùng tại bank counter hoặc appointment khi hỏi monthly fee, debit card, hoặc ID.",
    canada_context_en: "Use at a bank counter or appointment when asking about monthly fee, debit card, or ID.",
    smoke_expectation_vi: "Final QA đạt nếu sample giữ ở mức thông tin dịch vụ chung.",
    smoke_expectation_en: "Final QA passes if the sample stays at general service information level.",
    readiness_note_vi: "Learner sẵn sàng nếu xin thông tin viết ra để review sau.",
    readiness_note_en: "The learner is ready if they ask for written information to review later.",
    boundary_vi: "Câu này không phải tư vấn tài chính.",
    boundary_en: "This is not financial advice.",
    support_pa: ["ਕੀ ਇਹ ਮਹੀਨਾਵਾਰ ਫੀਸ ਹੈ?", "ਮੈਨੂੰ ਸੋਚਣ ਲਈ ਸਮਾਂ ਚਾਹੀਦਾ ਹੈ।"],
    learner_trap_vi: "Đừng xem fee list là khuyến nghị chọn sản phẩm.",
    learner_trap_en: "Do not treat a fee list as a product recommendation.",
  },
  {
    id: "pa-ca-smoke-housing-005",
    domain: "housing",
    check: "integration_readiness",
    task_vi: "Báo sửa chữa hoặc nguy cơ trong rental unit.",
    task_en: "Report a repair or risk in a rental unit.",
    phrase_pa: "ਮੇਰੇ ਯੂਨਿਟ ਵਿੱਚ ਸਮੱਸਿਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਦਾ ਸਮਾਂ ਲਿਖ ਦਿਓ।",
    romanization: "mere unit vich samassia hai. kirpa karke murammat da sama likh dio.",
    meaning_vi: "Unit của tôi có vấn đề. Làm ơn viết thời gian sửa chữa.",
    meaning_en: "There is a problem in my unit. Please write the repair time.",
    canada_context_vi: "Dùng với landlord, property manager, maintenance line, hoặc rental office.",
    canada_context_en: "Use with a landlord, property manager, maintenance line, or rental office.",
    smoke_expectation_vi: "Integration-readiness đạt nếu có unit, issue, access time, và written confirmation.",
    smoke_expectation_en: "Integration-readiness passes if it has unit, issue, access time, and written confirmation.",
    readiness_note_vi: "Learner cần nêu unit number và issue cụ thể.",
    readiness_note_en: "The learner should state the unit number and specific issue.",
    boundary_vi: "Câu này không phải tư vấn quyền thuê nhà.",
    boundary_en: "This is not tenancy rights advice.",
    support_pa: ["ਯੂਨਿਟ ਨੰਬਰ ਇਹ ਹੈ।", "ਸਮੱਸਿਆ ਤੁਰੰਤ ਹੈ।"],
    learner_trap_vi: "Đừng chỉ nói problem nếu có nước, điện, khóa, hoặc khói.",
    learner_trap_en: "Do not only say problem if there is water, electricity, lock, or smoke.",
  },
  {
    id: "pa-ca-smoke-transport-006",
    domain: "transport",
    check: "repair",
    task_vi: "Hỏi bus/transit route và báo trễ.",
    task_en: "Ask for a bus/transit route and report delay.",
    phrase_pa: "ਇਸ ਪਤੇ ਲਈ ਕਿਹੜੀ ਬੱਸ ਲੈਣੀ ਹੈ? ਮੈਂ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ/ਆਵਾਂਗੀ।",
    romanization: "is pate lai kihri bus laini hai? main der nal avanga/avangi.",
    meaning_vi: "Tôi nên đi xe bus nào tới địa chỉ này? Tôi sẽ đến trễ.",
    meaning_en: "Which bus should I take for this address? I will arrive late.",
    canada_context_vi: "Dùng khi đi clinic, school, work, public office, hoặc rental viewing bằng transit.",
    canada_context_en: "Use when going to a clinic, school, work, public office, or rental viewing by transit.",
    smoke_expectation_vi: "Repair check đạt nếu learner hỏi route và có câu báo delay.",
    smoke_expectation_en: "Repair check passes if the learner asks route and has a delay line.",
    readiness_note_vi: "Learner sẵn sàng nếu xác nhận direction và transfer.",
    readiness_note_en: "The learner is ready if they confirm direction and transfer.",
    boundary_vi: "Câu này không đảm bảo schedule transit.",
    boundary_en: "This does not guarantee transit schedule.",
    support_pa: ["ਕੀ ਮੈਨੂੰ ਟ੍ਰਾਂਸਫਰ ਕਰਨਾ ਪਵੇਗਾ?", "ਬੱਸ ਦੇਰ ਨਾਲ ਆ ਰਹੀ ਹੈ।"],
    learner_trap_vi: "Đừng chỉ ghi số bus mà không xác nhận chiều đi.",
    learner_trap_en: "Do not only write the bus number without confirming direction.",
  },
  {
    id: "pa-ca-smoke-public-office-007",
    domain: "public_office",
    check: "smoke_check",
    task_vi: "Hỏi đúng counter, document list, và next step.",
    task_en: "Ask the correct counter, document list, and next step.",
    phrase_pa: "ਮੈਨੂੰ ਕਿਹੜੇ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਹੈ? ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?",
    romanization: "mainu kihre counter te jana hai? kihre dastavez chahide han?",
    meaning_vi: "Tôi cần đi quầy nào? Cần giấy tờ nào?",
    meaning_en: "Which counter should I go to? Which documents are needed?",
    canada_context_vi: "Dùng tại service centre, newcomer office, library desk, hoặc public office.",
    canada_context_en: "Use at a service centre, newcomer office, library desk, or public office.",
    smoke_expectation_vi: "Smoke check đạt nếu hỏi counter, documents, và next step bằng văn bản.",
    smoke_expectation_en: "Smoke check passes if it asks counter, documents, and written next step.",
    readiness_note_vi: "Learner sẵn sàng nếu không tự đoán giấy tờ.",
    readiness_note_en: "The learner is ready if they do not guess documents.",
    boundary_vi: "Câu này hỏi quy trình, không phải tư vấn pháp lý.",
    boundary_en: "This asks process, not legal advice.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਸੂਚੀ ਲਿਖ ਦਿਓ।", "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?"],
    learner_trap_vi: "Đừng rời desk nếu chưa biết cần mang gì lần sau.",
    learner_trap_en: "Do not leave the desk before knowing what to bring next time.",
  },
  {
    id: "pa-ca-smoke-service-desk-008",
    domain: "service_desk",
    check: "final_qa",
    task_vi: "Follow up bằng service number hoặc reference number.",
    task_en: "Follow up with a service number or reference number.",
    phrase_pa: "ਮੇਰਾ ਸਰਵਿਸ ਨੰਬਰ ਇਹ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਸਥਿਤੀ ਚੈੱਕ ਕਰੋ।",
    romanization: "mera service number ih hai. kirpa karke sthiti check karo.",
    meaning_vi: "Đây là service number của tôi. Làm ơn kiểm tra tình trạng.",
    meaning_en: "This is my service number. Please check the status.",
    canada_context_vi: "Dùng tại service desk khi hỏi application, ticket, appointment, hoặc missing paper.",
    canada_context_en: "Use at a service desk when asking about an application, ticket, appointment, or missing paper.",
    smoke_expectation_vi: "Final QA đạt nếu có reference number, polite follow-up, và expected next step.",
    smoke_expectation_en: "Final QA passes if it has reference number, polite follow-up, and expected next step.",
    readiness_note_vi: "Learner sẵn sàng nếu ghi ngày nộp và kênh follow-up.",
    readiness_note_en: "The learner is ready if they record submission date and follow-up channel.",
    boundary_vi: "Status check không đảm bảo kết quả hồ sơ.",
    boundary_en: "A status check does not guarantee file outcome.",
    support_pa: ["ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", "ਮੈਂ ਕਦੋਂ ਦੁਬਾਰਾ ਪੁੱਛ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?"],
    learner_trap_vi: "Đừng nhầm service number với phone number.",
    learner_trap_en: "Do not confuse a service number with a phone number.",
  },
  {
    id: "pa-ca-smoke-interpreter-009",
    domain: "interpreter_request",
    check: "integration_readiness",
    task_vi: "Xin interpreter trước khi ký hoặc đồng ý điều quan trọng.",
    task_en: "Ask for an interpreter before signing or agreeing to important content.",
    phrase_pa: "ਮੈਨੂੰ ਪੰਜਾਬੀ ਦੁਭਾਸ਼ੀਆ ਚਾਹੀਦਾ ਹੈ। ਮੈਂ ਬਿਨਾਂ ਸਮਝੇ ਸਾਈਨ ਨਹੀਂ ਕਰਾਂਗਾ/ਕਰਾਂਗੀ।",
    romanization: "mainu Punjabi dubhashia chahida hai. main bina samjhe sign nahi karanga/karangi.",
    meaning_vi: "Tôi cần thông dịch viên tiếng Punjabi. Tôi sẽ không ký khi chưa hiểu.",
    meaning_en: "I need a Punjabi interpreter. I will not sign without understanding.",
    canada_context_vi: "Dùng tại clinic, public office, school, housing service, workplace, hoặc service desk.",
    canada_context_en: "Use at a clinic, public office, school, housing service, workplace, or service desk.",
    smoke_expectation_vi: "Integration-readiness đạt nếu learner biết tạm dừng và xin language support.",
    smoke_expectation_en: "Integration-readiness passes if the learner can pause and request language support.",
    readiness_note_vi: "Learner sẵn sàng nếu xin viết next step khi interpreter chưa có.",
    readiness_note_en: "The learner is ready if they ask for written next step when an interpreter is unavailable.",
    boundary_vi: "Interpreter hỗ trợ ngôn ngữ, không thay thế quyết định chuyên môn.",
    boundary_en: "An interpreter supports language, not professional decisions.",
    support_pa: ["ਕੀ ਦੁਭਾਸ਼ੀਆ ਹੁਣ ਮਿਲ ਸਕਦਾ ਹੈ?", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    learner_trap_vi: "Đừng ký chỉ vì muốn kết thúc nhanh.",
    learner_trap_en: "Do not sign just to finish quickly.",
  },
  {
    id: "pa-ca-smoke-emergency-010",
    domain: "emergency_boundary",
    check: "final_qa",
    task_vi: "Nói rõ emergency, vị trí, và nhu cầu ngay lập tức.",
    task_en: "State emergency, location, and immediate need.",
    phrase_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਮੈਨੂੰ ਹੁਣੇ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਮੇਰਾ ਪਤਾ ਇਹ ਹੈ।",
    romanization: "ih emergency hai. mainu hune madad chahidi hai. mera pata ih hai.",
    meaning_vi: "Đây là khẩn cấp. Tôi cần giúp ngay. Đây là địa chỉ của tôi.",
    meaning_en: "This is an emergency. I need help now. This is my address.",
    canada_context_vi: "Ở nhiều nơi tại Canada, dùng khi cần emergency service như 911.",
    canada_context_en: "In many places in Canada, use when emergency service such as 911 is needed.",
    smoke_expectation_vi: "Final QA đạt nếu có danger, immediate need, address, và interpreter option.",
    smoke_expectation_en: "Final QA passes if it has danger, immediate need, address, and interpreter option.",
    readiness_note_vi: "Learner sẵn sàng nếu nói location trước khi kể chi tiết dài.",
    readiness_note_en: "The learner is ready if they give location before a long story.",
    boundary_vi: "Deck này không thay thế emergency services hoặc lời khuyên y tế/pháp lý.",
    boundary_en: "This deck does not replace emergency services or medical/legal advice.",
    support_pa: ["ਮੈਨੂੰ ਪੰਜਾਬੀ ਦੁਭਾਸ਼ੀਆ ਚਾਹੀਦਾ ਹੈ।", "ਮੈਂ ਫੋਨ ਤੇ ਰਹਾਂਗਾ/ਰਹਾਂਗੀ।"],
    learner_trap_vi: "Đừng cúp máy trước khi được bảo nếu đang gọi emergency.",
    learner_trap_en: "Do not hang up before being told if calling emergency.",
  },
  {
    id: "pa-ca-smoke-workplace-011",
    domain: "workplace_safety",
    check: "repair",
    task_vi: "Báo workplace safety issue hoặc injury.",
    task_en: "Report a workplace safety issue or injury.",
    phrase_pa: "ਕੰਮ ਤੇ ਸੁਰੱਖਿਆ ਦੀ ਸਮੱਸਿਆ ਹੈ। ਮੈਨੂੰ ਸੁਪਰਵਾਈਜ਼ਰ ਨਾਲ ਗੱਲ ਕਰਨੀ ਹੈ।",
    romanization: "kamm te surakhia di samassia hai. mainu supervisor nal gall karni hai.",
    meaning_vi: "Có vấn đề an toàn ở nơi làm việc. Tôi cần nói với supervisor.",
    meaning_en: "There is a safety issue at work. I need to speak with a supervisor.",
    canada_context_vi: "Ở Canada, dùng khi PPE thiếu, có injury, near miss, hoặc cần first aid.",
    canada_context_en: "In Canada, use when PPE is missing, there is injury, near miss, or first aid is needed.",
    smoke_expectation_vi: "Repair check đạt nếu learner nêu safety issue và xin next reporting step.",
    smoke_expectation_en: "Repair check passes if the learner names the safety issue and asks next reporting step.",
    readiness_note_vi: "Learner sẵn sàng nếu không im lặng khi không hiểu safety instruction.",
    readiness_note_en: "The learner is ready if they do not stay silent when safety instruction is unclear.",
    boundary_vi: "Câu này không phải tư vấn pháp lý hoặc claim guidance.",
    boundary_en: "This is not legal advice or claim guidance.",
    support_pa: ["ਫਸਟ ਏਡ ਕਿੱਥੇ ਹੈ?", "ਕਿਰਪਾ ਕਰਕੇ ਰਿਪੋਰਟ ਦਾ ਕਦਮ ਲਿਖ ਦਿਓ।"],
    learner_trap_vi: "Đừng tiếp tục làm việc nếu bạn không an toàn.",
    learner_trap_en: "Do not keep working if you are not safe.",
  },
];

export default PUNJABI_CANADA_SURVIVAL_SMOKE_DECK;
