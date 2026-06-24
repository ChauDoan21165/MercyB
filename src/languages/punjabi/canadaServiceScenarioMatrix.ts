// Punjabi Canada service scenario matrix for Vietnamese-speaking and
// English-speaking learners.
//
// This is content readiness data only. It is not A11 integration.
// Gurmukhi is primary. Romanization is a bridge only. Shahmukhi is awareness
// only, not a full course. Native review is deferred.

export type PunjabiCanadaServiceScenarioDomain =
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

export type PunjabiCanadaServiceScenarioRoute =
  | "ready_for_content_integration"
  | "review_before_live_use"
  | "emergency_only";

export type PunjabiCanadaServiceScenario = {
  id: string;
  domain: PunjabiCanadaServiceScenarioDomain;
  route: PunjabiCanadaServiceScenarioRoute;
  scenario_vi: string;
  scenario_en: string;
  phrase_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  support_pa: string[];
  routing_note_vi: string;
  routing_note_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaServiceScenarioScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundary: string;
};

export const PUNJABI_CANADA_SERVICE_SCENARIO_MATRIX_SCOPE: PunjabiCanadaServiceScenarioScope = {
  name: "Punjabi Canada Service Scenario Matrix",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundary:
    "Scenario matrix for Canadian clinic, pharmacy, school and childcare, bank, housing, transport, public office, interpreter, emergency, and workplace safety communication; not A11 integration and not legal, medical, or financial advice.",
};

export const PUNJABI_CANADA_SERVICE_SCENARIO_DOMAINS: PunjabiCanadaServiceScenarioDomain[] = [
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

export const PUNJABI_CANADA_SERVICE_SCENARIO_MATRIX: PunjabiCanadaServiceScenario[] = [
  {
    id: "pa-ca-scenario-clinic-001",
    domain: "clinic",
    route: "ready_for_content_integration",
    scenario_vi: "Clinic check-in: nói có appointment, xin nói chậm, và xin ghi bước tiếp theo.",
    scenario_en: "Clinic check-in: say you have an appointment, ask for slow speech, and request the next step in writing.",
    phrase_pa: "ਮੇਰੀ ਅੱਜ ਅਪਾਇੰਟਮੈਂਟ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।",
    romanization: "meri ajj appointment hai. kirpa karke hauli hauli bolo.",
    meaning_vi: "Hôm nay tôi có lịch hẹn. Làm ơn nói chậm hơn.",
    meaning_en: "I have an appointment today. Please speak slowly.",
    canada_example_vi: "Ở Canada, dùng ở clinic desk khi xác nhận tên, giờ hẹn, hoặc health card.",
    canada_example_en: "In Canada, use at a clinic desk when confirming name, appointment time, or health card.",
    support_pa: ["ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    routing_note_vi: "Route sẵn sàng vì đây là giao tiếp dịch vụ cơ bản, không đưa lời khuyên y tế.",
    routing_note_en: "Route is ready because this is basic service communication and gives no medical advice.",
    learner_trap_vi: "Đừng gật đầu nếu chưa hiểu giờ hoặc bước tiếp theo.",
    learner_trap_en: "Do not nod if the time or next step is unclear.",
  },
  {
    id: "pa-ca-scenario-pharmacy-002",
    domain: "pharmacy",
    route: "review_before_live_use",
    scenario_vi: "Pharmacy pickup: lấy thuốc, báo dị ứng, và xin hướng dẫn viết ra.",
    scenario_en: "Pharmacy pickup: pick up medicine, report an allergy, and ask for written instructions.",
    phrase_pa: "ਮੈਨੂੰ ਇਹ ਦਵਾਈ ਲੈਣੀ ਹੈ। ਮੈਨੂੰ ਐਲਰਜੀ ਹੈ।",
    romanization: "mainu ih davai laini hai. mainu allergy hai.",
    meaning_vi: "Tôi cần lấy thuốc này. Tôi có dị ứng.",
    meaning_en: "I need to pick up this medicine. I have an allergy.",
    canada_example_vi: "Ở Canada, pharmacist có thể hỏi dị ứng, thuốc hiện tại, hoặc thông tin pickup.",
    canada_example_en: "In Canada, a pharmacist may ask about allergies, current medicine, or pickup information.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਹਦਾਇਤਾਂ ਲਿਖ ਦਿਓ।", "ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਸਮਝਾ ਸਕਦੇ ਹੋ?"],
    routing_note_vi: "Route cần review trước khi dùng thật vì có ranh giới y tế; nội dung chỉ hỗ trợ giao tiếp.",
    routing_note_en: "Route needs review before live use because of medical boundaries; content only supports communication.",
    learner_trap_vi: "Không tự suy ra liều thuốc từ câu học ngôn ngữ.",
    learner_trap_en: "Do not infer medicine dosage from a language-learning line.",
  },
  {
    id: "pa-ca-scenario-school-003",
    domain: "school_childcare",
    route: "ready_for_content_integration",
    scenario_vi: "School/daycare notice: báo vắng, cập nhật pickup, hoặc hỏi form.",
    scenario_en: "School/daycare notice: report absence, update pickup, or ask about a form.",
    phrase_pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ। ਮੈਨੂੰ ਇਸ ਫਾਰਮ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    romanization: "mera bacha ajj gairhazir hai. mainu is form vich madad chahidi hai.",
    meaning_vi: "Hôm nay con tôi vắng mặt. Tôi cần giúp với mẫu đơn này.",
    meaning_en: "My child is absent today. I need help with this form.",
    canada_example_vi: "Ở Canada, dùng với school office, teacher, hoặc daycare staff qua app, phone, email, hoặc note.",
    canada_example_en: "In Canada, use with the school office, teacher, or daycare staff by app, phone, email, or note.",
    support_pa: ["ਅੱਜ ਹੋਰ ਵਿਅਕਤੀ ਲੈਣ ਆਵੇਗਾ/ਆਵੇਗੀ।", "ਕਿਰਪਾ ਕਰਕੇ ਅਧਿਆਪਕ ਨੂੰ ਦੱਸੋ।"],
    routing_note_vi: "Route sẵn sàng nếu người học nói rõ ngày, tên con, và mục đích liên hệ.",
    routing_note_en: "Route is ready if the learner states day, child name, and contact purpose clearly.",
    learner_trap_vi: "Đừng quên tên con nếu văn phòng có nhiều học sinh.",
    learner_trap_en: "Do not forget the child name when the office has many students.",
  },
  {
    id: "pa-ca-scenario-bank-004",
    domain: "bank",
    route: "review_before_live_use",
    scenario_vi: "Bank service: hỏi thông tin chung về tài khoản, phí, hoặc appointment.",
    scenario_en: "Bank service: ask general information about an account, fees, or an appointment.",
    phrase_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤੇ ਬਾਰੇ ਆਮ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਫੀਸ ਲਿਖ ਦਿਓ।",
    romanization: "mainu bank khate bare aam jankari chahidi hai. kirpa karke fees likh dio.",
    meaning_vi: "Tôi cần thông tin chung về tài khoản ngân hàng. Làm ơn viết phí ra.",
    meaning_en: "I need general information about a bank account. Please write down the fees.",
    canada_example_vi: "Ở Canada, dùng khi hỏi monthly fee, debit card, appointment, hoặc ID cần mang.",
    canada_example_en: "In Canada, use when asking about monthly fees, a debit card, appointment, or ID to bring.",
    support_pa: ["ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ।", "ਕੀ ਤੁਸੀਂ ਇਹ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?"],
    routing_note_vi: "Route cần review vì liên quan tiền; câu chỉ hỏi thông tin dịch vụ chung.",
    routing_note_en: "Route needs review because money is involved; the line only asks for general service information.",
    learner_trap_vi: "Đừng xem thông tin phí là lời khuyên tài chính.",
    learner_trap_en: "Do not treat fee information as financial advice.",
  },
  {
    id: "pa-ca-scenario-housing-005",
    domain: "housing",
    route: "review_before_live_use",
    scenario_vi: "Housing service: báo sửa chữa, xác nhận unit/address, hoặc hỏi ngày trả rent.",
    scenario_en: "Housing service: report a repair, confirm unit/address, or ask the rent date.",
    phrase_pa: "ਮੇਰੇ ਘਰ ਵਿੱਚ ਮੁਰੰਮਤ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਸਮਾਂ ਲਿਖ ਦਿਓ।",
    romanization: "mere ghar vich murammat di lor hai. kirpa karke sama likh dio.",
    meaning_vi: "Nhà tôi cần sửa chữa. Làm ơn viết thời gian ra.",
    meaning_en: "My home needs a repair. Please write down the time.",
    canada_example_vi: "Ở Canada, dùng với landlord, building manager, rental office, hoặc maintenance desk.",
    canada_example_en: "In Canada, use with a landlord, building manager, rental office, or maintenance desk.",
    support_pa: ["ਕਿਰਾਇਆ ਕਦੋਂ ਦੇਣਾ ਹੈ?", "ਯੂਨਿਟ ਨੰਬਰ ਇਹ ਹੈ।"],
    routing_note_vi: "Route cần review vì housing có ranh giới tenancy/legal; câu chỉ hỗ trợ giao tiếp.",
    routing_note_en: "Route needs review because housing has tenancy/legal boundaries; the line only supports communication.",
    learner_trap_vi: "Đừng bỏ unit number nếu ở apartment hoặc basement suite.",
    learner_trap_en: "Do not skip the unit number if you live in an apartment or basement suite.",
  },
  {
    id: "pa-ca-scenario-transport-006",
    domain: "transport",
    route: "ready_for_content_integration",
    scenario_vi: "Transit service: hỏi route, báo delay, hoặc hỏi lost and found.",
    scenario_en: "Transit service: ask a route, report a delay, or ask lost and found.",
    phrase_pa: "ਇਸ ਪਤੇ ਲਈ ਕਿਹੜੀ ਬੱਸ ਲੈਣੀ ਹੈ? ਬੱਸ ਦੇਰ ਨਾਲ ਆ ਰਹੀ ਹੈ।",
    romanization: "is pate lai kihri bus laini hai? bus der nal aa rahi hai.",
    meaning_vi: "Tôi nên đi xe bus nào tới địa chỉ này? Xe bus đang tới trễ.",
    meaning_en: "Which bus should I take for this address? The bus is delayed.",
    canada_example_vi: "Ở Canada, dùng khi đi clinic, school, work, rental viewing, hoặc public office.",
    canada_example_en: "In Canada, use when going to a clinic, school, work, rental viewing, or public office.",
    support_pa: ["ਮੇਰੀ ਚੀਜ਼ ਗੁੰਮ ਗਈ ਹੈ।", "ਕੀ ਮੈਨੂੰ ਟ੍ਰਾਂਸਫਰ ਕਰਨਾ ਪਵੇਗਾ?"],
    routing_note_vi: "Route sẵn sàng nếu người học hỏi được tuyến, chiều đi, và báo trễ ngắn.",
    routing_note_en: "Route is ready if the learner can ask route, direction, and send a short delay note.",
    learner_trap_vi: "Luôn xác nhận chiều đi, không chỉ số bus.",
    learner_trap_en: "Always confirm direction, not only the bus number.",
  },
  {
    id: "pa-ca-scenario-public-office-007",
    domain: "public_office",
    route: "ready_for_content_integration",
    scenario_vi: "Public office: hỏi đúng quầy, giấy tờ cần mang, và bước tiếp theo.",
    scenario_en: "Public office: ask the right counter, required documents, and next step.",
    phrase_pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਹੈ? ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?",
    romanization: "mainu kis counter te jana hai? mainu kihre dastavez chahide han?",
    meaning_vi: "Tôi cần đi quầy nào? Tôi cần giấy tờ nào?",
    meaning_en: "Which counter should I go to? Which documents do I need?",
    canada_example_vi: "Ở Canada, dùng tại service centre, library desk, newcomer office, hoặc public office.",
    canada_example_en: "In Canada, use at a service centre, library desk, newcomer office, or public office.",
    support_pa: ["ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", "ਕਿਰਪਾ ਕਰਕੇ ਸੂਚੀ ਲਿਖ ਦਿਓ।"],
    routing_note_vi: "Route sẵn sàng nếu người học xin được danh sách và bước tiếp theo bằng văn bản.",
    routing_note_en: "Route is ready if the learner can request a list and next step in writing.",
    learner_trap_vi: "Đừng tự đoán giấy tờ nếu có thể xin danh sách.",
    learner_trap_en: "Do not guess documents if you can ask for a list.",
  },
  {
    id: "pa-ca-scenario-interpreter-008",
    domain: "interpreter_request",
    route: "ready_for_content_integration",
    scenario_vi: "Interpreter request: xin thông dịch viên trước form, meeting, hoặc thông tin phức tạp.",
    scenario_en: "Interpreter request: ask for an interpreter before a form, meeting, or complex information.",
    phrase_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਆ ਚਾਹੀਦਾ ਹੈ। ਕੀ ਪੰਜਾਬੀ ਦੁਭਾਸ਼ੀਆ ਮਿਲ ਸਕਦਾ ਹੈ?",
    romanization: "mainu dubhashia chahida hai. ki Punjabi dubhashia mil sakda hai?",
    meaning_vi: "Tôi cần thông dịch viên. Có thể có thông dịch viên Punjabi không?",
    meaning_en: "I need an interpreter. Is a Punjabi interpreter available?",
    canada_example_vi: "Một số dịch vụ Canada có thể sắp xếp interpreter trực tiếp hoặc qua điện thoại.",
    canada_example_en: "Some Canadian services can arrange in-person or phone interpretation.",
    support_pa: ["ਮੈਨੂੰ ਪੂਰੀ ਗੱਲ ਸਮਝਣੀ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਦੱਸ ਦਿਓ।"],
    routing_note_vi: "Route sẵn sàng vì đây là yêu cầu hỗ trợ ngôn ngữ, không phải tư vấn pháp lý.",
    routing_note_en: "Route is ready because this asks for language support, not legal advice.",
    learner_trap_vi: "Xin interpreter trước khi thông tin quá nhanh.",
    learner_trap_en: "Ask for an interpreter before the information becomes too fast.",
  },
  {
    id: "pa-ca-scenario-emergency-009",
    domain: "emergency_boundary",
    route: "emergency_only",
    scenario_vi: "Emergency boundary: có nguy hiểm thật sự và cần nhờ gọi 911 ngay.",
    scenario_en: "Emergency boundary: there is real danger and someone needs to call 911 immediately.",
    phrase_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    romanization: "ih emergency hai. kirpa karke nau-ikk-ikk te call karo.",
    meaning_vi: "Đây là trường hợp khẩn cấp. Làm ơn gọi 911.",
    meaning_en: "This is an emergency. Please call 911.",
    canada_example_vi: "Ở Canada, dùng 911 cho nguy hiểm khẩn cấp thật sự tại nhà, transit, nơi công cộng, hoặc nơi làm.",
    canada_example_en: "In Canada, use 911 for true immediate danger at home, on transit, in public, or at work.",
    support_pa: ["ਮੈਨੂੰ ਤੁਰੰਤ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਸਟਾਫ਼ ਨੂੰ ਬੁਲਾਓ।"],
    routing_note_vi: "Route chỉ dùng cho khẩn cấp; câu phải ngắn, rõ, và không kéo dài giải thích.",
    routing_note_en: "Route is emergency-only; the line must be short, clear, and avoid long explanation.",
    learner_trap_vi: "Không dùng 911 cho vấn đề nhỏ.",
    learner_trap_en: "Do not use 911 for a small issue.",
  },
  {
    id: "pa-ca-scenario-workplace-010",
    domain: "workplace_safety",
    route: "review_before_live_use",
    scenario_vi: "Workplace safety: báo nguy cơ, xin PPE, hoặc xin nói với supervisor.",
    scenario_en: "Workplace safety: report a hazard, request PPE, or ask to speak with a supervisor.",
    phrase_pa: "ਇੱਥੇ ਸੁਰੱਖਿਆ ਦੀ ਸਮੱਸਿਆ ਹੈ। ਕੀ ਮੈਂ ਸੁਪਰਵਾਈਜ਼ਰ ਨਾਲ ਗੱਲ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    romanization: "itthe surakhia di samasya hai. ki main supervisor nal gall kar sakda/sakdi haan?",
    meaning_vi: "Ở đây có vấn đề an toàn. Tôi có thể nói chuyện với supervisor không?",
    meaning_en: "There is a safety problem here. Can I speak with the supervisor?",
    canada_example_vi: "Ở Canada, dùng trong warehouse, restaurant, cleaning, construction, hoặc retail job.",
    canada_example_en: "In Canada, use in a warehouse, restaurant, cleaning, construction, or retail job.",
    support_pa: ["ਮੈਨੂੰ ਸੁਰੱਖਿਆ ਵਾਲਾ ਸਾਮਾਨ ਚਾਹੀਦਾ ਹੈ।", "ਮੈਨੂੰ ਕੰਮ ਤੇ ਚੋਟ ਲੱਗੀ ਹੈ।"],
    routing_note_vi: "Route cần review vì workplace safety có quy trình; câu chỉ giúp báo rõ vấn đề.",
    routing_note_en: "Route needs review because workplace safety has procedures; the line only helps report clearly.",
    learner_trap_vi: "Nói nguy cơ cụ thể, không chỉ nói chung là không ổn.",
    learner_trap_en: "State the specific hazard, not only that something is not okay.",
  },
];

export default PUNJABI_CANADA_SERVICE_SCENARIO_MATRIX;
