// Punjabi Canada survival readiness gate for Vietnamese-speaking and
// English-speaking learners.
//
// This is content readiness data only. It is not A11 integration.
// Gurmukhi is primary. Romanization is a bridge only. Shahmukhi is awareness
// only, not a full course. Native review is deferred.

export type PunjabiCanadaSurvivalReadinessDomain =
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

export type PunjabiCanadaSurvivalReadinessRoute =
  | "ready"
  | "review_before_live_use"
  | "emergency_escalation";

export type PunjabiCanadaSurvivalReadinessItem = {
  id: string;
  domain: PunjabiCanadaSurvivalReadinessDomain;
  route: PunjabiCanadaSurvivalReadinessRoute;
  checkpoint: string;
  learner_can_do_vi: string;
  learner_can_do_en: string;
  phrase_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  support_pa: string[];
  readiness_check_vi: string;
  readiness_check_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaSurvivalReadinessScope = {
  name: string;
  readinessLabel: "READY_FOR_A11_CONTENT_GATE";
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundary: string;
};

export const PUNJABI_CANADA_SURVIVAL_READINESS_GATE_SCOPE: PunjabiCanadaSurvivalReadinessScope = {
  name: "Punjabi Canada Survival Readiness Gate",
  readinessLabel: "READY_FOR_A11_CONTENT_GATE",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundary:
    "Content readiness gate for Canadian clinic, pharmacy, school and childcare, bank, housing, transport, public office, interpreter, emergency, and workplace safety language; not A11 integration and not legal, medical, or financial advice.",
};

export const PUNJABI_CANADA_SURVIVAL_READINESS_DOMAINS: PunjabiCanadaSurvivalReadinessDomain[] = [
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

export const PUNJABI_CANADA_SURVIVAL_READINESS_GATE: PunjabiCanadaSurvivalReadinessItem[] = [
  {
    id: "pa-ca-readiness-clinic-001",
    domain: "clinic",
    route: "ready",
    checkpoint: "clinic_check_in_slow_repeat",
    learner_can_do_vi: "Người học có thể check-in ở clinic, nói có appointment, và xin nói chậm/lặp lại.",
    learner_can_do_en: "The learner can check in at a clinic, say they have an appointment, and ask for slower repetition.",
    phrase_pa: "ਮੇਰੀ ਅੱਜ ਅਪਾਇੰਟਮੈਂਟ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "meri ajj appointment hai. kirpa karke hauli hauli dubara kaho.",
    meaning_vi: "Hôm nay tôi có lịch hẹn. Làm ơn nói lại chậm hơn.",
    meaning_en: "I have an appointment today. Please say it again slowly.",
    canada_example_vi: "Ở Canada, dùng ở clinic desk trước khi đưa health card hoặc xác nhận tên.",
    canada_example_en: "In Canada, use at a clinic desk before giving a health card or confirming your name.",
    support_pa: ["ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    readiness_check_vi: "Nếu người học có thể xin lặp lại và xin viết ra, mục clinic đạt gate nội dung.",
    readiness_check_en: "If the learner can ask for repetition and writing, the clinic content gate is met.",
    learner_trap_vi: "Đừng gật đầu nếu chưa hiểu bước tiếp theo.",
    learner_trap_en: "Do not nod if the next step is unclear.",
  },
  {
    id: "pa-ca-readiness-pharmacy-002",
    domain: "pharmacy",
    route: "review_before_live_use",
    checkpoint: "pharmacy_pickup_allergy_written_instruction",
    learner_can_do_vi: "Người học có thể lấy thuốc, báo dị ứng, và xin hướng dẫn viết ra mà không tự đổi cách dùng.",
    learner_can_do_en: "The learner can pick up medicine, report an allergy, and ask for written instructions without changing use.",
    phrase_pa: "ਮੈਨੂੰ ਇਹ ਦਵਾਈ ਲੈਣੀ ਹੈ। ਮੈਨੂੰ ਐਲਰਜੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹਦਾਇਤਾਂ ਲਿਖ ਦਿਓ।",
    romanization: "mainu ih davai laini hai. mainu allergy hai. kirpa karke hadaitan likh dio.",
    meaning_vi: "Tôi cần lấy thuốc này. Tôi có dị ứng. Làm ơn viết hướng dẫn ra.",
    meaning_en: "I need to pick up this medicine. I have an allergy. Please write the instructions down.",
    canada_example_vi: "Ở Canada, pharmacist có thể hỏi dị ứng, thuốc hiện tại, hoặc thông tin bảo hiểm.",
    canada_example_en: "In Canada, a pharmacist may ask about allergies, current medicine, or insurance information.",
    support_pa: ["ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਸਮਝਾ ਸਕਦੇ ਹੋ?", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    readiness_check_vi: "Route này cần review trước khi dùng thật vì có ranh giới y tế, nhưng câu chỉ hỗ trợ giao tiếp.",
    readiness_check_en: "This route needs review before live use because of medical boundaries, but the line only supports communication.",
    learner_trap_vi: "Không tự suy ra liều thuốc từ câu học ngôn ngữ.",
    learner_trap_en: "Do not infer dosage from a language-learning line.",
  },
  {
    id: "pa-ca-readiness-school-003",
    domain: "school_childcare",
    route: "ready",
    checkpoint: "absence_pickup_forms",
    learner_can_do_vi: "Người học có thể báo vắng, đổi pickup, và xin giúp với form trường/daycare.",
    learner_can_do_en: "The learner can report absence, change pickup, and ask for help with a school/daycare form.",
    phrase_pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ। ਮੈਨੂੰ ਇਸ ਫਾਰਮ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    romanization: "mera bacha ajj gairhazir hai. mainu is form vich madad chahidi hai.",
    meaning_vi: "Hôm nay con tôi vắng mặt. Tôi cần giúp với mẫu đơn này.",
    meaning_en: "My child is absent today. I need help with this form.",
    canada_example_vi: "Ở Canada, school office hoặc daycare có thể nhận thông báo qua app, phone, email, hoặc giấy note.",
    canada_example_en: "In Canada, a school office or daycare may accept notice by app, phone, email, or paper note.",
    support_pa: ["ਅੱਜ ਹੋਰ ਵਿਅਕਤੀ ਲੈਣ ਆਵੇਗਾ/ਆਵੇਗੀ।", "ਕਿਰਪਾ ਕਰਕੇ ਅਧਿਆਪਕ ਨੂੰ ਦੱਸੋ।"],
    readiness_check_vi: "Người học đạt gate nếu có thể nói ngày, tên con, mục đích form, và pickup rõ ràng.",
    readiness_check_en: "The gate is met if the learner can state day, child name, form purpose, and pickup clearly.",
    learner_trap_vi: "Đừng chỉ nói 'my child'; thêm tên và ngày cụ thể.",
    learner_trap_en: "Do not only say 'my child'; add the name and exact day.",
  },
  {
    id: "pa-ca-readiness-bank-004",
    domain: "bank",
    route: "review_before_live_use",
    checkpoint: "bank_account_fee_general_info",
    learner_can_do_vi: "Người học có thể hỏi thông tin chung về tài khoản và phí mà không xin lời khuyên tài chính.",
    learner_can_do_en: "The learner can ask general account and fee questions without requesting financial advice.",
    phrase_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤੇ ਬਾਰੇ ਆਮ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਫੀਸ ਲਿਖ ਦਿਓ।",
    romanization: "mainu bank khate bare aam jankari chahidi hai. kirpa karke fees likh dio.",
    meaning_vi: "Tôi cần thông tin chung về tài khoản ngân hàng. Làm ơn viết phí ra.",
    meaning_en: "I need general information about a bank account. Please write down the fees.",
    canada_example_vi: "Ở Canada, dùng để hỏi monthly fee, debit card, appointment, hoặc giấy tờ ID cần mang.",
    canada_example_en: "In Canada, use to ask about monthly fees, a debit card, an appointment, or ID to bring.",
    support_pa: ["ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ।", "ਕੀ ਤੁਸੀਂ ਇਹ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?"],
    readiness_check_vi: "Route cần review vì liên quan tiền; nội dung chỉ hỏi thông tin dịch vụ chung.",
    readiness_check_en: "This route needs review because money is involved; the content only asks for general service information.",
    learner_trap_vi: "Đừng biến câu hỏi phí thành quyết định chọn sản phẩm tài chính.",
    learner_trap_en: "Do not turn a fee question into a decision about choosing a financial product.",
  },
  {
    id: "pa-ca-readiness-housing-005",
    domain: "housing",
    route: "review_before_live_use",
    checkpoint: "housing_repair_rent_address",
    learner_can_do_vi: "Người học có thể báo sửa chữa, hỏi tiền thuê/ngày, và xác nhận địa chỉ/unit.",
    learner_can_do_en: "The learner can report repairs, ask rent/date questions, and confirm address/unit.",
    phrase_pa: "ਮੇਰੇ ਘਰ ਵਿੱਚ ਮੁਰੰਮਤ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਾਇਆ ਕਦੋਂ ਦੇਣਾ ਹੈ?",
    romanization: "mere ghar vich murammat di lor hai. kiraya kadon dena hai?",
    meaning_vi: "Nhà tôi cần sửa chữa. Khi nào cần trả tiền thuê?",
    meaning_en: "My home needs a repair. When is rent due?",
    canada_example_vi: "Ở Canada, dùng với landlord, building manager, rental office, hoặc maintenance desk.",
    canada_example_en: "In Canada, use with a landlord, building manager, rental office, or maintenance desk.",
    support_pa: ["ਯੂਨਿਟ ਨੰਬਰ ਇਹ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਸਮਾਂ ਲਿਖ ਦਿਓ।"],
    readiness_check_vi: "Route cần review vì housing có ranh giới tenancy/legal; câu chỉ hỗ trợ giao tiếp.",
    readiness_check_en: "This route needs review because housing has tenancy/legal boundaries; the line only supports communication.",
    learner_trap_vi: "Không xem câu học ngôn ngữ là lời khuyên thuê nhà.",
    learner_trap_en: "Do not treat a language-learning line as housing advice.",
  },
  {
    id: "pa-ca-readiness-transport-006",
    domain: "transport",
    route: "ready",
    checkpoint: "transport_route_delay_lost_item",
    learner_can_do_vi: "Người học có thể hỏi route, báo trễ, và hỏi lost and found.",
    learner_can_do_en: "The learner can ask about a route, report delay, and ask lost and found.",
    phrase_pa: "ਇਸ ਪਤੇ ਲਈ ਕਿਹੜੀ ਬੱਸ ਲੈਣੀ ਹੈ? ਬੱਸ ਦੇਰ ਨਾਲ ਆ ਰਹੀ ਹੈ।",
    romanization: "is pate lai kihri bus laini hai? bus der nal aa rahi hai.",
    meaning_vi: "Tôi nên đi xe bus nào tới địa chỉ này? Xe bus đang tới trễ.",
    meaning_en: "Which bus should I take for this address? The bus is delayed.",
    canada_example_vi: "Ở Canada, dùng khi đi clinic, school, work, rental viewing, hoặc service desk.",
    canada_example_en: "In Canada, use when going to a clinic, school, work, rental viewing, or service desk.",
    support_pa: ["ਮੇਰੀ ਚੀਜ਼ ਗੁੰਮ ਗਈ ਹੈ।", "ਕੀ ਮੈਨੂੰ ਟ੍ਰਾਂਸਫਰ ਕਰਨਾ ਪਵੇਗਾ?"],
    readiness_check_vi: "Người học đạt gate nếu có thể hỏi tuyến, chiều đi, và nhắn báo trễ ngắn gọn.",
    readiness_check_en: "The gate is met if the learner can ask route, direction, and send a short delay message.",
    learner_trap_vi: "Luôn xác nhận chiều đi, không chỉ số bus.",
    learner_trap_en: "Always confirm direction, not only the bus number.",
  },
  {
    id: "pa-ca-readiness-public-office-007",
    domain: "public_office",
    route: "ready",
    checkpoint: "public_counter_documents_next_step",
    learner_can_do_vi: "Người học có thể hỏi quầy đúng, giấy tờ cần mang, và bước tiếp theo.",
    learner_can_do_en: "The learner can ask the right counter, required documents, and next step.",
    phrase_pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਹੈ? ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?",
    romanization: "mainu kis counter te jana hai? mainu kihre dastavez chahide han?",
    meaning_vi: "Tôi cần đi quầy nào? Tôi cần giấy tờ nào?",
    meaning_en: "Which counter should I go to? Which documents do I need?",
    canada_example_vi: "Ở Canada, dùng tại service centre, library desk, newcomer office, hoặc public office.",
    canada_example_en: "In Canada, use at a service centre, library desk, newcomer office, or public office.",
    support_pa: ["ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", "ਕਿਰਪਾ ਕਰਕੇ ਸੂਚੀ ਲਿਖ ਦਿਓ।"],
    readiness_check_vi: "Người học đạt gate nếu có thể xin danh sách và xin bước tiếp theo viết ra.",
    readiness_check_en: "The gate is met if the learner can request a list and written next step.",
    learner_trap_vi: "Đừng tự đoán giấy tờ nếu quầy có thể viết danh sách.",
    learner_trap_en: "Do not guess documents if the desk can write a list.",
  },
  {
    id: "pa-ca-readiness-interpreter-008",
    domain: "interpreter_request",
    route: "ready",
    checkpoint: "interpreter_before_complex_task",
    learner_can_do_vi: "Người học có thể yêu cầu thông dịch viên trước cuộc họp, form, hoặc thông tin phức tạp.",
    learner_can_do_en: "The learner can request an interpreter before a meeting, form, or complex information.",
    phrase_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਆ ਚਾਹੀਦਾ ਹੈ। ਕੀ ਪੰਜਾਬੀ ਦੁਭਾਸ਼ੀਆ ਮਿਲ ਸਕਦਾ ਹੈ?",
    romanization: "mainu dubhashia chahida hai. ki Punjabi dubhashia mil sakda hai?",
    meaning_vi: "Tôi cần thông dịch viên. Có thể có thông dịch viên Punjabi không?",
    meaning_en: "I need an interpreter. Is a Punjabi interpreter available?",
    canada_example_vi: "Một số dịch vụ Canada có thể sắp xếp interpreter trực tiếp hoặc qua điện thoại.",
    canada_example_en: "Some Canadian services can arrange in-person or phone interpretation.",
    support_pa: ["ਮੈਨੂੰ ਪੂਰੀ ਗੱਲ ਸਮਝਣੀ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਦੱਸ ਦਿਓ।"],
    readiness_check_vi: "Người học đạt gate nếu biết xin interpreter trước khi thông tin trở nên quá nhanh.",
    readiness_check_en: "The gate is met if the learner can ask for an interpreter before information becomes too fast.",
    learner_trap_vi: "Đây là hỗ trợ ngôn ngữ, không phải tư vấn pháp lý.",
    learner_trap_en: "This is language support, not legal advice.",
  },
  {
    id: "pa-ca-readiness-emergency-009",
    domain: "emergency_boundary",
    route: "emergency_escalation",
    checkpoint: "true_emergency_call_911",
    learner_can_do_vi: "Người học có thể nói đây là khẩn cấp và nhờ gọi 911 khi có nguy hiểm thật sự.",
    learner_can_do_en: "The learner can say it is an emergency and ask someone to call 911 when there is real danger.",
    phrase_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    romanization: "ih emergency hai. kirpa karke nau-ikk-ikk te call karo.",
    meaning_vi: "Đây là trường hợp khẩn cấp. Làm ơn gọi 911.",
    meaning_en: "This is an emergency. Please call 911.",
    canada_example_vi: "Ở Canada, dùng 911 cho nguy hiểm khẩn cấp thật sự tại nhà, nơi công cộng, transit, hoặc nơi làm.",
    canada_example_en: "In Canada, use 911 for true immediate danger at home, in public, on transit, or at work.",
    support_pa: ["ਮੈਨੂੰ ਤੁਰੰਤ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਸਟਾਫ਼ ਨੂੰ ਬੁਲਾਓ।"],
    readiness_check_vi: "Route khẩn cấp đạt gate nếu câu ngắn, rõ, và không kéo dài giải thích.",
    readiness_check_en: "The emergency route is gate-ready if the line is short, clear, and avoids long explanation.",
    learner_trap_vi: "Không dùng 911 cho việc nhỏ; dùng khi cần phản ứng ngay.",
    learner_trap_en: "Do not use 911 for a small issue; use it when immediate response is needed.",
  },
  {
    id: "pa-ca-readiness-workplace-010",
    domain: "workplace_safety",
    route: "review_before_live_use",
    checkpoint: "workplace_hazard_ppe_supervisor",
    learner_can_do_vi: "Người học có thể báo nguy cơ, xin PPE, và xin nói với supervisor.",
    learner_can_do_en: "The learner can report a hazard, request PPE, and ask to speak with a supervisor.",
    phrase_pa: "ਇੱਥੇ ਸੁਰੱਖਿਆ ਦੀ ਸਮੱਸਿਆ ਹੈ। ਕੀ ਮੈਂ ਸੁਪਰਵਾਈਜ਼ਰ ਨਾਲ ਗੱਲ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    romanization: "itthe surakhia di samasya hai. ki main supervisor nal gall kar sakda/sakdi haan?",
    meaning_vi: "Ở đây có vấn đề an toàn. Tôi có thể nói chuyện với supervisor không?",
    meaning_en: "There is a safety problem here. Can I speak with the supervisor?",
    canada_example_vi: "Ở Canada, dùng trong warehouse, restaurant, cleaning, construction, hoặc retail job.",
    canada_example_en: "In Canada, use in a warehouse, restaurant, cleaning, construction, or retail job.",
    support_pa: ["ਮੈਨੂੰ ਸੁਰੱਖਿਆ ਵਾਲਾ ਸਾਮਾਨ ਚਾਹੀਦਾ ਹੈ।", "ਮੈਨੂੰ ਕੰਮ ਤੇ ਚੋਟ ਲੱਗੀ ਹੈ।"],
    readiness_check_vi: "Route cần review vì workplace safety có quy trình; câu chỉ giúp báo vấn đề rõ ràng.",
    readiness_check_en: "This route needs review because workplace safety has procedures; the line only helps report clearly.",
    learner_trap_vi: "Nói nguy cơ cụ thể; đừng chỉ nói chung là không ổn.",
    learner_trap_en: "State the specific hazard; do not only say something is not okay.",
  },
];

export default PUNJABI_CANADA_SURVIVAL_READINESS_GATE;
