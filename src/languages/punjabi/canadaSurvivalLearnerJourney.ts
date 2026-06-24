// Punjabi Canada survival learner journey for Vietnamese-speaking and
// English-speaking learners.
//
// This is content readiness data only. It is not A11 integration.
// Gurmukhi is primary. Romanization is a bridge only. Shahmukhi is awareness
// only, not a full course. Native review is deferred.

export type PunjabiCanadaSurvivalJourneyDomain =
  | "clinic"
  | "pharmacy"
  | "school_childcare"
  | "bank"
  | "housing"
  | "transport"
  | "public_office"
  | "interpreter_request"
  | "emergency_boundary"
  | "workplace_safety";

export type PunjabiCanadaSurvivalJourneyStage =
  | "first_contact"
  | "clarify_details"
  | "handoff"
  | "safety_boundary";

export type PunjabiCanadaSurvivalJourneyItem = {
  id: string;
  domain: PunjabiCanadaSurvivalJourneyDomain;
  stage: PunjabiCanadaSurvivalJourneyStage;
  learner_step_vi: string;
  learner_step_en: string;
  phrase_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  support_pa: string[];
  handoff_vi: string;
  handoff_en: string;
  readiness_note_vi: string;
  readiness_note_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaSurvivalLearnerJourneyScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundary: string;
};

export const PUNJABI_CANADA_SURVIVAL_LEARNER_JOURNEY_SCOPE: PunjabiCanadaSurvivalLearnerJourneyScope = {
  name: "Punjabi Canada Survival Learner Journey",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundary:
    "Learner-journey content for Canadian clinic, pharmacy, school and childcare, bank, housing, transport, public office, interpreter, emergency, and workplace safety communication; not A11 integration and not legal, medical, or financial advice.",
};

export const PUNJABI_CANADA_SURVIVAL_JOURNEY_DOMAINS: PunjabiCanadaSurvivalJourneyDomain[] = [
  "clinic",
  "pharmacy",
  "school_childcare",
  "bank",
  "housing",
  "transport",
  "public_office",
  "interpreter_request",
  "emergency_boundary",
  "workplace_safety",
];

export const PUNJABI_CANADA_SURVIVAL_LEARNER_JOURNEY: PunjabiCanadaSurvivalJourneyItem[] = [
  {
    id: "pa-ca-journey-clinic-001",
    domain: "clinic",
    stage: "first_contact",
    learner_step_vi: "Bắt đầu ở quầy clinic bằng cách nói có appointment và xin nói chậm.",
    learner_step_en: "Start at the clinic desk by saying there is an appointment and asking for slow speech.",
    phrase_pa: "ਮੇਰੀ ਅੱਜ ਅਪਾਇੰਟਮੈਂਟ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।",
    romanization: "meri ajj appointment hai. kirpa karke hauli hauli bolo.",
    meaning_vi: "Hôm nay tôi có lịch hẹn. Làm ơn nói chậm hơn.",
    meaning_en: "I have an appointment today. Please speak slowly.",
    canada_example_vi: "Ở Canada, dùng trước khi đưa health card hoặc xác nhận tên tại clinic desk.",
    canada_example_en: "In Canada, use before giving a health card or confirming your name at a clinic desk.",
    support_pa: ["ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    handoff_vi: "Nếu chưa hiểu, chuyển sang xin viết bước tiếp theo.",
    handoff_en: "If unclear, hand off to asking for the next step in writing.",
    readiness_note_vi: "Sẵn sàng nếu người học có thể xin lặp lại thay vì chỉ gật đầu.",
    readiness_note_en: "Ready if the learner can ask for repetition instead of only nodding.",
    learner_trap_vi: "Đừng đoán giờ hẹn hoặc phòng nếu chưa nghe rõ.",
    learner_trap_en: "Do not guess the time or room if it was not clear.",
  },
  {
    id: "pa-ca-journey-pharmacy-002",
    domain: "pharmacy",
    stage: "clarify_details",
    learner_step_vi: "Ở pharmacy, lấy thuốc, báo dị ứng, và xin hướng dẫn viết ra.",
    learner_step_en: "At the pharmacy, pick up medicine, report an allergy, and ask for written instructions.",
    phrase_pa: "ਮੈਨੂੰ ਇਹ ਦਵਾਈ ਲੈਣੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹਦਾਇਤਾਂ ਲਿਖ ਦਿਓ।",
    romanization: "mainu ih davai laini hai. kirpa karke hadaitan likh dio.",
    meaning_vi: "Tôi cần lấy thuốc này. Làm ơn viết hướng dẫn ra.",
    meaning_en: "I need to pick up this medicine. Please write the instructions down.",
    canada_example_vi: "Ở Canada, pharmacist có thể hỏi dị ứng, thuốc hiện tại, hoặc thông tin pickup.",
    canada_example_en: "In Canada, a pharmacist may ask about allergies, current medicine, or pickup information.",
    support_pa: ["ਮੈਨੂੰ ਐਲਰਜੀ ਹੈ।", "ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਸਮਝਾ ਸਕਦੇ ਹੋ?"],
    handoff_vi: "Nếu nội dung quá quan trọng, chuyển sang xin thông dịch viên.",
    handoff_en: "If the details are too important, hand off to requesting an interpreter.",
    readiness_note_vi: "Cần nhớ đây chỉ là hỗ trợ giao tiếp, không phải lời khuyên y tế.",
    readiness_note_en: "Remember this is communication support, not medical advice.",
    learner_trap_vi: "Không tự đổi liều thuốc từ câu luyện.",
    learner_trap_en: "Do not change dosage from a practice line.",
  },
  {
    id: "pa-ca-journey-school-003",
    domain: "school_childcare",
    stage: "first_contact",
    learner_step_vi: "Liên hệ trường/daycare để báo con vắng, đổi pickup, hoặc hỏi form.",
    learner_step_en: "Contact school/daycare to report absence, change pickup, or ask about a form.",
    phrase_pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ। ਮੈਨੂੰ ਇਸ ਫਾਰਮ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    romanization: "mera bacha ajj gairhazir hai. mainu is form vich madad chahidi hai.",
    meaning_vi: "Hôm nay con tôi vắng mặt. Tôi cần giúp với mẫu đơn này.",
    meaning_en: "My child is absent today. I need help with this form.",
    canada_example_vi: "Ở Canada, dùng qua school app, phone, email, giấy note, hoặc daycare pickup.",
    canada_example_en: "In Canada, use through a school app, phone, email, paper note, or daycare pickup.",
    support_pa: ["ਅੱਜ ਹੋਰ ਵਿਅਕਤੀ ਲੈਣ ਆਵੇਗਾ/ਆਵੇਗੀ।", "ਕਿਰਪਾ ਕਰਕੇ ਅਧਿਆਪਕ ਨੂੰ ਦੱਸੋ।"],
    handoff_vi: "Sau câu mở đầu, đưa tên con, ngày, và chi tiết pickup/form.",
    handoff_en: "After the opening line, give the child name, date, and pickup/form detail.",
    readiness_note_vi: "Sẵn sàng nếu người học nêu được ai, ngày nào, và việc gì.",
    readiness_note_en: "Ready if the learner can state who, which day, and what task.",
    learner_trap_vi: "Đừng chỉ nói 'my child' nếu văn phòng có nhiều học sinh.",
    learner_trap_en: "Do not only say 'my child' when the office has many students.",
  },
  {
    id: "pa-ca-journey-bank-004",
    domain: "bank",
    stage: "clarify_details",
    learner_step_vi: "Ở bank, hỏi thông tin chung về tài khoản, phí, hoặc appointment.",
    learner_step_en: "At the bank, ask general information about an account, fees, or appointment.",
    phrase_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤੇ ਬਾਰੇ ਆਮ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਫੀਸ ਲਿਖ ਦਿਓ।",
    romanization: "mainu bank khate bare aam jankari chahidi hai. kirpa karke fees likh dio.",
    meaning_vi: "Tôi cần thông tin chung về tài khoản ngân hàng. Làm ơn viết phí ra.",
    meaning_en: "I need general information about a bank account. Please write down the fees.",
    canada_example_vi: "Ở Canada, dùng khi hỏi monthly fee, debit card, appointment, hoặc ID cần mang.",
    canada_example_en: "In Canada, use when asking about monthly fees, a debit card, appointment, or ID to bring.",
    support_pa: ["ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ।", "ਕੀ ਤੁਸੀਂ ਇਹ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?"],
    handoff_vi: "Nếu câu trả lời có lựa chọn tiền bạc, chuyển sang xin thông tin viết ra để review sau.",
    handoff_en: "If the answer includes money choices, hand off to asking for written information to review later.",
    readiness_note_vi: "Câu hỏi ở mức dịch vụ chung, không phải tư vấn tài chính.",
    readiness_note_en: "The question stays at general service level, not financial advice.",
    learner_trap_vi: "Đừng xem thông tin phí là khuyến nghị chọn sản phẩm.",
    learner_trap_en: "Do not treat fee information as a product recommendation.",
  },
  {
    id: "pa-ca-journey-housing-005",
    domain: "housing",
    stage: "handoff",
    learner_step_vi: "Với housing, báo sửa chữa, xác nhận unit/address, rồi xin thời gian viết ra.",
    learner_step_en: "For housing, report a repair, confirm unit/address, then ask for the time in writing.",
    phrase_pa: "ਮੇਰੇ ਘਰ ਵਿੱਚ ਮੁਰੰਮਤ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਸਮਾਂ ਲਿਖ ਦਿਓ।",
    romanization: "mere ghar vich murammat di lor hai. kirpa karke sama likh dio.",
    meaning_vi: "Nhà tôi cần sửa chữa. Làm ơn viết thời gian ra.",
    meaning_en: "My home needs a repair. Please write down the time.",
    canada_example_vi: "Ở Canada, dùng với landlord, building manager, rental office, hoặc maintenance desk.",
    canada_example_en: "In Canada, use with a landlord, building manager, rental office, or maintenance desk.",
    support_pa: ["ਕਿਰਾਇਆ ਕਦੋਂ ਦੇਣਾ ਹੈ?", "ਯੂਨਿਟ ਨੰਬਰ ਇਹ ਹੈ।"],
    handoff_vi: "Nếu thành vấn đề quyền thuê nhà, giữ câu ở mức giao tiếp và xin hỗ trợ phù hợp sau.",
    handoff_en: "If it becomes a tenancy-rights issue, keep the line as communication and seek appropriate support later.",
    readiness_note_vi: "Câu này hỗ trợ giao tiếp housing, không phải lời khuyên pháp lý.",
    readiness_note_en: "This supports housing communication, not legal advice.",
    learner_trap_vi: "Đừng bỏ unit number nếu ở apartment hoặc basement suite.",
    learner_trap_en: "Do not skip the unit number if in an apartment or basement suite.",
  },
  {
    id: "pa-ca-journey-transport-006",
    domain: "transport",
    stage: "clarify_details",
    learner_step_vi: "Khi đi transit, hỏi route, xác nhận chiều đi, báo trễ, hoặc hỏi lost and found.",
    learner_step_en: "When using transit, ask route, confirm direction, report delay, or ask lost and found.",
    phrase_pa: "ਇਸ ਪਤੇ ਲਈ ਕਿਹੜੀ ਬੱਸ ਲੈਣੀ ਹੈ? ਬੱਸ ਦੇਰ ਨਾਲ ਆ ਰਹੀ ਹੈ।",
    romanization: "is pate lai kihri bus laini hai? bus der nal aa rahi hai.",
    meaning_vi: "Tôi nên đi xe bus nào tới địa chỉ này? Xe bus đang tới trễ.",
    meaning_en: "Which bus should I take for this address? The bus is delayed.",
    canada_example_vi: "Ở Canada, dùng khi đi clinic, school, work, rental viewing, hoặc public office.",
    canada_example_en: "In Canada, use when going to a clinic, school, work, rental viewing, or public office.",
    support_pa: ["ਮੇਰੀ ਚੀਜ਼ ਗੁੰਮ ਗਈ ਹੈ।", "ਕੀ ਮੈਨੂੰ ਟ੍ਰਾਂਸਫਰ ਕਰਨਾ ਪਵੇਗਾ?"],
    handoff_vi: "Nếu sẽ trễ appointment, chuyển sang nhắn báo trễ ngắn gọn.",
    handoff_en: "If late for an appointment, hand off to a short delay message.",
    readiness_note_vi: "Sẵn sàng nếu người học hỏi route và chiều đi, không chỉ số bus.",
    readiness_note_en: "Ready if the learner asks route and direction, not only the bus number.",
    learner_trap_vi: "Đừng chờ tới sau giờ hẹn mới báo trễ.",
    learner_trap_en: "Do not wait until after the appointment time to report delay.",
  },
  {
    id: "pa-ca-journey-public-office-007",
    domain: "public_office",
    stage: "handoff",
    learner_step_vi: "Ở public office, hỏi đúng quầy, giấy tờ cần mang, và bước tiếp theo.",
    learner_step_en: "At a public office, ask the correct counter, required documents, and next step.",
    phrase_pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਹੈ? ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?",
    romanization: "mainu kis counter te jana hai? mainu kihre dastavez chahide han?",
    meaning_vi: "Tôi cần đi quầy nào? Tôi cần giấy tờ nào?",
    meaning_en: "Which counter should I go to? Which documents do I need?",
    canada_example_vi: "Ở Canada, dùng tại service centre, library desk, newcomer office, hoặc public office.",
    canada_example_en: "In Canada, use at a service centre, library desk, newcomer office, or public office.",
    support_pa: ["ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", "ਕਿਰਪਾ ਕਰਕੇ ਸੂਚੀ ਲਿਖ ਦਿਓ।"],
    handoff_vi: "Sau khi hỏi, xin danh sách và bước tiếp theo bằng văn bản.",
    handoff_en: "After asking, request the list and next step in writing.",
    readiness_note_vi: "Sẵn sàng nếu người học không tự đoán giấy tờ.",
    readiness_note_en: "Ready if the learner does not guess the documents.",
    learner_trap_vi: "Đừng rời quầy nếu chưa rõ bước tiếp theo.",
    learner_trap_en: "Do not leave the desk if the next step is unclear.",
  },
  {
    id: "pa-ca-journey-interpreter-008",
    domain: "interpreter_request",
    stage: "handoff",
    learner_step_vi: "Khi thông tin phức tạp, chuyển sang yêu cầu thông dịch viên trước khi tiếp tục.",
    learner_step_en: "When information is complex, hand off to requesting an interpreter before continuing.",
    phrase_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਆ ਚਾਹੀਦਾ ਹੈ। ਕੀ ਪੰਜਾਬੀ ਦੁਭਾਸ਼ੀਆ ਮਿਲ ਸਕਦਾ ਹੈ?",
    romanization: "mainu dubhashia chahida hai. ki Punjabi dubhashia mil sakda hai?",
    meaning_vi: "Tôi cần thông dịch viên. Có thể có thông dịch viên Punjabi không?",
    meaning_en: "I need an interpreter. Is a Punjabi interpreter available?",
    canada_example_vi: "Một số dịch vụ Canada có thể sắp xếp interpreter trực tiếp hoặc qua điện thoại.",
    canada_example_en: "Some Canadian services can arrange in-person or phone interpretation.",
    support_pa: ["ਮੈਨੂੰ ਪੂਰੀ ਗੱਲ ਸਮਝਣੀ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਦੱਸ ਦਿਓ।"],
    handoff_vi: "Dùng trước form, meeting, hoặc thông tin quá nhanh.",
    handoff_en: "Use before a form, meeting, or information that is too fast.",
    readiness_note_vi: "Đây là hỗ trợ ngôn ngữ, không phải tư vấn pháp lý.",
    readiness_note_en: "This is language support, not legal advice.",
    learner_trap_vi: "Đừng chờ tới cuối cuộc họp mới xin thông dịch.",
    learner_trap_en: "Do not wait until the end of the meeting to ask for interpretation.",
  },
  {
    id: "pa-ca-journey-emergency-009",
    domain: "emergency_boundary",
    stage: "safety_boundary",
    learner_step_vi: "Khi có nguy hiểm thật sự, dừng giải thích dài và nhờ gọi 911.",
    learner_step_en: "When there is real danger, stop long explanation and ask someone to call 911.",
    phrase_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    romanization: "ih emergency hai. kirpa karke nau-ikk-ikk te call karo.",
    meaning_vi: "Đây là trường hợp khẩn cấp. Làm ơn gọi 911.",
    meaning_en: "This is an emergency. Please call 911.",
    canada_example_vi: "Ở Canada, dùng 911 cho nguy hiểm khẩn cấp thật sự tại nhà, transit, nơi công cộng, hoặc nơi làm.",
    canada_example_en: "In Canada, use 911 for true immediate danger at home, on transit, in public, or at work.",
    support_pa: ["ਮੈਨੂੰ ਤੁਰੰਤ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਸਟਾਫ਼ ਨੂੰ ਬੁਲਾਓ।"],
    handoff_vi: "Sau câu này, ưu tiên an toàn và làm theo hướng dẫn của người ứng cứu.",
    handoff_en: "After this line, prioritize safety and follow responder instructions.",
    readiness_note_vi: "Chỉ dùng cho tình huống khẩn cấp thật sự.",
    readiness_note_en: "Use only for a true emergency.",
    learner_trap_vi: "Không dùng 911 cho vấn đề nhỏ.",
    learner_trap_en: "Do not use 911 for a small issue.",
  },
  {
    id: "pa-ca-journey-workplace-010",
    domain: "workplace_safety",
    stage: "safety_boundary",
    learner_step_vi: "Ở nơi làm, báo nguy cơ, xin PPE, hoặc xin nói với supervisor.",
    learner_step_en: "At work, report a hazard, request PPE, or ask to speak with a supervisor.",
    phrase_pa: "ਇੱਥੇ ਸੁਰੱਖਿਆ ਦੀ ਸਮੱਸਿਆ ਹੈ। ਕੀ ਮੈਂ ਸੁਪਰਵਾਈਜ਼ਰ ਨਾਲ ਗੱਲ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    romanization: "itthe surakhia di samasya hai. ki main supervisor nal gall kar sakda/sakdi haan?",
    meaning_vi: "Ở đây có vấn đề an toàn. Tôi có thể nói chuyện với supervisor không?",
    meaning_en: "There is a safety problem here. Can I speak with the supervisor?",
    canada_example_vi: "Ở Canada, dùng trong warehouse, restaurant, cleaning, construction, hoặc retail job.",
    canada_example_en: "In Canada, use in a warehouse, restaurant, cleaning, construction, or retail job.",
    support_pa: ["ਮੈਨੂੰ ਸੁਰੱਖਿਆ ਵਾਲਾ ਸਾਮਾਨ ਚਾਹੀਦਾ ਹੈ।", "ਮੈਨੂੰ ਕੰਮ ਤੇ ਚੋਟ ਲੱਗੀ ਹੈ।"],
    handoff_vi: "Nếu có chấn thương hoặc nguy hiểm ngay, chuyển sang câu emergency.",
    handoff_en: "If there is injury or immediate danger, hand off to the emergency line.",
    readiness_note_vi: "Câu chỉ giúp báo rõ vấn đề, không phải tranh luận luật lao động.",
    readiness_note_en: "The line only helps report clearly, not argue workplace law.",
    learner_trap_vi: "Nói nguy cơ cụ thể, không chỉ nói chung là không ổn.",
    learner_trap_en: "State the specific hazard, not only that something is not okay.",
  },
];

export default PUNJABI_CANADA_SURVIVAL_LEARNER_JOURNEY;
