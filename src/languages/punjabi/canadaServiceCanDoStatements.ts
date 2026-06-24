// Punjabi Canada service can-do statements for Vietnamese-speaking and
// English-speaking learners.
//
// This is content readiness data only. It is not A11 integration.
// Gurmukhi is primary. Romanization is a bridge only. Shahmukhi is awareness
// only, not a full course. Native review is deferred.

export type PunjabiCanadaServiceCanDoDomain =
  | "clinic"
  | "pharmacy"
  | "school_childcare"
  | "bank"
  | "housing"
  | "transport"
  | "workplace_safety"
  | "interpreter_request"
  | "public_office"
  | "emergency_boundary";

export type PunjabiCanadaServiceCanDoLevel = "ready" | "needs_review" | "emergency_only";

export type PunjabiCanadaServiceCanDoStatement = {
  id: string;
  domain: PunjabiCanadaServiceCanDoDomain;
  level: PunjabiCanadaServiceCanDoLevel;
  checkpoint: string;
  can_do_vi: string;
  can_do_en: string;
  phrase_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  support_pa: string[];
  readiness_note_vi: string;
  readiness_note_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaServiceCanDoScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundary: string;
};

export const PUNJABI_CANADA_SERVICE_CAN_DO_SCOPE: PunjabiCanadaServiceCanDoScope = {
  name: "Punjabi Canada Service Can-Do Statements",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundary:
    "Can-do statements for Canadian clinic, pharmacy, school and childcare, bank, housing, transport, workplace safety, interpreter, public office, and emergency boundary communication; not A11 integration and not legal, medical, or financial advice.",
};

export const PUNJABI_CANADA_SERVICE_CAN_DO_DOMAINS: PunjabiCanadaServiceCanDoDomain[] = [
  "clinic",
  "pharmacy",
  "school_childcare",
  "bank",
  "housing",
  "transport",
  "workplace_safety",
  "interpreter_request",
  "public_office",
  "emergency_boundary",
];

export const PUNJABI_CANADA_SERVICE_CAN_DO_STATEMENTS: PunjabiCanadaServiceCanDoStatement[] = [
  {
    id: "pa-ca-can-do-clinic-001",
    domain: "clinic",
    level: "ready",
    checkpoint: "clinic_check_in_and_clarify",
    can_do_vi: "Tôi có thể check-in ở clinic, nói có hẹn, và xin nhân viên nói chậm hoặc viết ra.",
    can_do_en: "I can check in at a clinic, say I have an appointment, and ask staff to speak slowly or write things down.",
    phrase_pa: "ਮੇਰੀ ਅੱਜ ਅਪਾਇੰਟਮੈਂਟ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।",
    romanization: "meri ajj appointment hai. kirpa karke hauli hauli bolo.",
    meaning_vi: "Hôm nay tôi có lịch hẹn. Làm ơn nói chậm hơn.",
    meaning_en: "I have an appointment today. Please speak slowly.",
    canada_example_vi: "Ở Canada, dùng tại clinic desk khi đưa health card hoặc xác nhận tên.",
    canada_example_en: "In Canada, use at a clinic desk when giving a health card or confirming your name.",
    support_pa: ["ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    readiness_note_vi: "Sẵn sàng nếu người học có thể xin lặp lại và xin ghi thông tin.",
    readiness_note_en: "Ready if the learner can ask for repetition and written information.",
    learner_trap_vi: "Đừng chỉ gật đầu nếu chưa hiểu bước tiếp theo.",
    learner_trap_en: "Do not just nod if the next step is unclear.",
  },
  {
    id: "pa-ca-can-do-pharmacy-002",
    domain: "pharmacy",
    level: "needs_review",
    checkpoint: "pharmacy_pickup_and_allergy",
    can_do_vi: "Tôi có thể lấy thuốc, báo dị ứng, và xin hướng dẫn bằng văn bản mà không tự quyết định y tế.",
    can_do_en: "I can pick up medicine, report an allergy, and ask for written instructions without making medical decisions.",
    phrase_pa: "ਮੈਨੂੰ ਇਹ ਦਵਾਈ ਲੈਣੀ ਹੈ। ਮੈਨੂੰ ਐਲਰਜੀ ਹੈ।",
    romanization: "mainu ih davai laini hai. mainu allergy hai.",
    meaning_vi: "Tôi cần lấy thuốc này. Tôi có dị ứng.",
    meaning_en: "I need to pick up this medicine. I have an allergy.",
    canada_example_vi: "Ở Canada, pharmacist có thể hỏi dị ứng, thuốc hiện tại, hoặc hướng dẫn pickup.",
    canada_example_en: "In Canada, a pharmacist may ask about allergies, current medicine, or pickup instructions.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਹਦਾਇਤਾਂ ਲਿਖ ਦਿਓ।", "ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਸਮਝਾ ਸਕਦੇ ਹੋ?"],
    readiness_note_vi: "Cần review vì có ranh giới y tế; nội dung chỉ hỗ trợ giao tiếp.",
    readiness_note_en: "Needs review because of medical boundaries; the content only supports communication.",
    learner_trap_vi: "Không dùng câu này để tự đổi liều hoặc cách dùng thuốc.",
    learner_trap_en: "Do not use this line to change dosage or medicine use.",
  },
  {
    id: "pa-ca-can-do-school-003",
    domain: "school_childcare",
    level: "ready",
    checkpoint: "school_absence_pickup_forms",
    can_do_vi: "Tôi có thể báo con vắng, cập nhật pickup, và xin giúp với form trường hoặc daycare.",
    can_do_en: "I can report a child's absence, update pickup, and ask for help with a school or daycare form.",
    phrase_pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ। ਮੈਨੂੰ ਇਸ ਫਾਰਮ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    romanization: "mera bacha ajj gairhazir hai. mainu is form vich madad chahidi hai.",
    meaning_vi: "Hôm nay con tôi vắng mặt. Tôi cần giúp với mẫu đơn này.",
    meaning_en: "My child is absent today. I need help with this form.",
    canada_example_vi: "Ở Canada, dùng với school office, teacher, hoặc daycare staff qua app, phone, email, hoặc giấy note.",
    canada_example_en: "In Canada, use with the school office, teacher, or daycare staff by app, phone, email, or paper note.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਅਧਿਆਪਕ ਨੂੰ ਦੱਸੋ।", "ਅੱਜ ਹੋਰ ਵਿਅਕਤੀ ਲੈਣ ਆਵੇਗਾ/ਆਵੇਗੀ।"],
    readiness_note_vi: "Sẵn sàng nếu người học nói rõ ngày, tên con, và mục đích form/pickup.",
    readiness_note_en: "Ready if the learner states the day, child name, and form or pickup purpose clearly.",
    learner_trap_vi: "Đừng quên tên con và ngày cụ thể.",
    learner_trap_en: "Do not forget the child name and exact day.",
  },
  {
    id: "pa-ca-can-do-bank-004",
    domain: "bank",
    level: "needs_review",
    checkpoint: "bank_general_info_and_fees",
    can_do_vi: "Tôi có thể hỏi thông tin chung về tài khoản, phí, và giấy tờ cần mang mà không xin tư vấn tài chính.",
    can_do_en: "I can ask general questions about an account, fees, and documents to bring without asking for financial advice.",
    phrase_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤੇ ਬਾਰੇ ਆਮ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਫੀਸ ਲਿਖ ਦਿਓ।",
    romanization: "mainu bank khate bare aam jankari chahidi hai. kirpa karke fees likh dio.",
    meaning_vi: "Tôi cần thông tin chung về tài khoản ngân hàng. Làm ơn viết phí ra.",
    meaning_en: "I need general information about a bank account. Please write down the fees.",
    canada_example_vi: "Ở Canada, dùng khi hỏi monthly fee, debit card, appointment, hoặc ID cần mang.",
    canada_example_en: "In Canada, use when asking about monthly fees, a debit card, appointment, or ID to bring.",
    support_pa: ["ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ।", "ਕੀ ਤੁਸੀਂ ਇਹ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?"],
    readiness_note_vi: "Cần review vì liên quan tiền; câu chỉ hỏi thông tin dịch vụ chung.",
    readiness_note_en: "Needs review because money is involved; the line only asks for general service information.",
    learner_trap_vi: "Không xem thông tin phí là lời khuyên chọn sản phẩm.",
    learner_trap_en: "Do not treat fee information as advice choosing a product.",
  },
  {
    id: "pa-ca-can-do-housing-005",
    domain: "housing",
    level: "needs_review",
    checkpoint: "housing_repair_rent_address",
    can_do_vi: "Tôi có thể báo sửa chữa, hỏi ngày trả rent, và xác nhận địa chỉ/unit mà không xin tư vấn pháp lý.",
    can_do_en: "I can report a repair, ask the rent due date, and confirm address/unit without asking for legal advice.",
    phrase_pa: "ਮੇਰੇ ਘਰ ਵਿੱਚ ਮੁਰੰਮਤ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਾਇਆ ਕਦੋਂ ਦੇਣਾ ਹੈ?",
    romanization: "mere ghar vich murammat di lor hai. kiraya kadon dena hai?",
    meaning_vi: "Nhà tôi cần sửa chữa. Khi nào cần trả tiền thuê?",
    meaning_en: "My home needs a repair. When is rent due?",
    canada_example_vi: "Ở Canada, dùng với landlord, building manager, rental office, hoặc maintenance desk.",
    canada_example_en: "In Canada, use with a landlord, building manager, rental office, or maintenance desk.",
    support_pa: ["ਯੂਨਿਟ ਨੰਬਰ ਇਹ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਸਮਾਂ ਲਿਖ ਦਿਓ।"],
    readiness_note_vi: "Cần review vì housing có ranh giới tenancy/legal; câu chỉ hỗ trợ giao tiếp.",
    readiness_note_en: "Needs review because housing has tenancy/legal boundaries; the line only supports communication.",
    learner_trap_vi: "Đừng bỏ unit number nếu ở apartment hoặc basement suite.",
    learner_trap_en: "Do not skip the unit number if you live in an apartment or basement suite.",
  },
  {
    id: "pa-ca-can-do-transport-006",
    domain: "transport",
    level: "ready",
    checkpoint: "transport_route_delay_lost_item",
    can_do_vi: "Tôi có thể hỏi tuyến bus/train, báo trễ, và hỏi lost and found.",
    can_do_en: "I can ask about a bus/train route, report a delay, and ask lost and found.",
    phrase_pa: "ਇਸ ਪਤੇ ਲਈ ਕਿਹੜੀ ਬੱਸ ਲੈਣੀ ਹੈ? ਬੱਸ ਦੇਰ ਨਾਲ ਆ ਰਹੀ ਹੈ।",
    romanization: "is pate lai kihri bus laini hai? bus der nal aa rahi hai.",
    meaning_vi: "Tôi nên đi xe bus nào tới địa chỉ này? Xe bus đang tới trễ.",
    meaning_en: "Which bus should I take for this address? The bus is delayed.",
    canada_example_vi: "Ở Canada, dùng khi đi clinic, school, work, rental viewing, hoặc public office.",
    canada_example_en: "In Canada, use when going to a clinic, school, work, rental viewing, or public office.",
    support_pa: ["ਮੇਰੀ ਚੀਜ਼ ਗੁੰਮ ਗਈ ਹੈ।", "ਕੀ ਮੈਨੂੰ ਟ੍ਰਾਂਸਫਰ ਕਰਨਾ ਪਵੇਗਾ?"],
    readiness_note_vi: "Sẵn sàng nếu người học hỏi được tuyến, chiều đi, và gửi tin nhắn báo trễ ngắn.",
    readiness_note_en: "Ready if the learner can ask route, direction, and send a short delay message.",
    learner_trap_vi: "Luôn xác nhận chiều đi, không chỉ số bus.",
    learner_trap_en: "Always confirm direction, not only the bus number.",
  },
  {
    id: "pa-ca-can-do-workplace-007",
    domain: "workplace_safety",
    level: "needs_review",
    checkpoint: "workplace_hazard_ppe_supervisor",
    can_do_vi: "Tôi có thể báo nguy cơ an toàn, xin PPE, và xin nói với supervisor.",
    can_do_en: "I can report a safety hazard, request PPE, and ask to speak with a supervisor.",
    phrase_pa: "ਇੱਥੇ ਸੁਰੱਖਿਆ ਦੀ ਸਮੱਸਿਆ ਹੈ। ਕੀ ਮੈਂ ਸੁਪਰਵਾਈਜ਼ਰ ਨਾਲ ਗੱਲ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    romanization: "itthe surakhia di samasya hai. ki main supervisor nal gall kar sakda/sakdi haan?",
    meaning_vi: "Ở đây có vấn đề an toàn. Tôi có thể nói chuyện với supervisor không?",
    meaning_en: "There is a safety problem here. Can I speak with the supervisor?",
    canada_example_vi: "Ở Canada, dùng trong warehouse, restaurant, cleaning, construction, hoặc retail job.",
    canada_example_en: "In Canada, use in a warehouse, restaurant, cleaning, construction, or retail job.",
    support_pa: ["ਮੈਨੂੰ ਸੁਰੱਖਿਆ ਵਾਲਾ ਸਾਮਾਨ ਚਾਹੀਦਾ ਹੈ।", "ਮੈਨੂੰ ਕੰਮ ਤੇ ਚੋਟ ਲੱਗੀ ਹੈ।"],
    readiness_note_vi: "Cần review vì workplace safety có quy trình; câu chỉ giúp báo rõ vấn đề.",
    readiness_note_en: "Needs review because workplace safety has procedures; the line only helps report clearly.",
    learner_trap_vi: "Nói nguy cơ cụ thể, không chỉ nói chung là không ổn.",
    learner_trap_en: "State the specific hazard, not only that something is not okay.",
  },
  {
    id: "pa-ca-can-do-interpreter-008",
    domain: "interpreter_request",
    level: "ready",
    checkpoint: "interpreter_before_complex_service",
    can_do_vi: "Tôi có thể yêu cầu thông dịch viên trước form, cuộc họp, hoặc thông tin dịch vụ phức tạp.",
    can_do_en: "I can request an interpreter before a form, meeting, or complex service information.",
    phrase_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਆ ਚਾਹੀਦਾ ਹੈ। ਕੀ ਪੰਜਾਬੀ ਦੁਭਾਸ਼ੀਆ ਮਿਲ ਸਕਦਾ ਹੈ?",
    romanization: "mainu dubhashia chahida hai. ki Punjabi dubhashia mil sakda hai?",
    meaning_vi: "Tôi cần thông dịch viên. Có thể có thông dịch viên Punjabi không?",
    meaning_en: "I need an interpreter. Is a Punjabi interpreter available?",
    canada_example_vi: "Một số dịch vụ Canada có thể sắp xếp interpreter trực tiếp hoặc qua điện thoại.",
    canada_example_en: "Some Canadian services can arrange in-person or phone interpretation.",
    support_pa: ["ਮੈਨੂੰ ਪੂਰੀ ਗੱਲ ਸਮਝਣੀ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਦੱਸ ਦਿਓ।"],
    readiness_note_vi: "Sẵn sàng nếu người học biết xin interpreter trước khi nội dung quá nhanh.",
    readiness_note_en: "Ready if the learner can ask for an interpreter before content becomes too fast.",
    learner_trap_vi: "Đây là hỗ trợ ngôn ngữ, không phải tư vấn pháp lý.",
    learner_trap_en: "This is language support, not legal advice.",
  },
  {
    id: "pa-ca-can-do-public-office-009",
    domain: "public_office",
    level: "ready",
    checkpoint: "public_counter_documents_next_step",
    can_do_vi: "Tôi có thể hỏi đúng quầy, giấy tờ cần mang, và bước tiếp theo tại public office.",
    can_do_en: "I can ask the right counter, required documents, and next step at a public office.",
    phrase_pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਹੈ? ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?",
    romanization: "mainu kis counter te jana hai? mainu kihre dastavez chahide han?",
    meaning_vi: "Tôi cần đi quầy nào? Tôi cần giấy tờ nào?",
    meaning_en: "Which counter should I go to? Which documents do I need?",
    canada_example_vi: "Ở Canada, dùng tại service centre, library desk, newcomer office, hoặc public office.",
    canada_example_en: "In Canada, use at a service centre, library desk, newcomer office, or public office.",
    support_pa: ["ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", "ਕਿਰਪਾ ਕਰਕੇ ਸੂਚੀ ਲਿਖ ਦਿਓ।"],
    readiness_note_vi: "Sẵn sàng nếu người học xin được danh sách và bước tiếp theo viết ra.",
    readiness_note_en: "Ready if the learner can request a list and the next step in writing.",
    learner_trap_vi: "Đừng tự đoán giấy tờ nếu có thể xin danh sách.",
    learner_trap_en: "Do not guess documents if you can ask for a list.",
  },
  {
    id: "pa-ca-can-do-emergency-010",
    domain: "emergency_boundary",
    level: "emergency_only",
    checkpoint: "true_emergency_call_911",
    can_do_vi: "Tôi có thể nói đây là khẩn cấp và nhờ gọi 911 khi có nguy hiểm thật sự.",
    can_do_en: "I can say it is an emergency and ask someone to call 911 when there is real danger.",
    phrase_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    romanization: "ih emergency hai. kirpa karke nau-ikk-ikk te call karo.",
    meaning_vi: "Đây là trường hợp khẩn cấp. Làm ơn gọi 911.",
    meaning_en: "This is an emergency. Please call 911.",
    canada_example_vi: "Ở Canada, dùng 911 cho nguy hiểm khẩn cấp thật sự tại nhà, nơi công cộng, transit, hoặc nơi làm.",
    canada_example_en: "In Canada, use 911 for true immediate danger at home, in public, on transit, or at work.",
    support_pa: ["ਮੈਨੂੰ ਤੁਰੰਤ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਸਟਾਫ਼ ਨੂੰ ਬੁਲਾਓ।"],
    readiness_note_vi: "Chỉ dùng cho tình huống khẩn cấp; câu phải ngắn và rõ.",
    readiness_note_en: "Use only for emergency situations; the line must be short and clear.",
    learner_trap_vi: "Không dùng 911 cho vấn đề nhỏ.",
    learner_trap_en: "Do not use 911 for a small issue.",
  },
];

export default PUNJABI_CANADA_SERVICE_CAN_DO_STATEMENTS;
