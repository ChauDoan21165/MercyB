// Punjabi Canada survival final review for Vietnamese-speaking and
// English-speaking learners.
//
// This is content review data only. It is not A11 integration.
// Gurmukhi is primary. Romanization is a bridge only. Shahmukhi is awareness
// only, not a full course. Native review is deferred.

export type PunjabiCanadaSurvivalFinalReviewDomain =
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

export type PunjabiCanadaSurvivalFinalReviewItem = {
  id: string;
  domain: PunjabiCanadaSurvivalFinalReviewDomain;
  checkpoint: string;
  qa_prompt_vi: string;
  qa_prompt_en: string;
  phrase_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  support_pa: string[];
  final_review_note_vi: string;
  final_review_note_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaSurvivalFinalReviewScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundary: string;
};

export const PUNJABI_CANADA_SURVIVAL_FINAL_REVIEW_SCOPE: PunjabiCanadaSurvivalFinalReviewScope = {
  name: "Punjabi Canada Survival Final Review",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundary:
    "Final-review content for Canadian clinic, pharmacy, school and childcare, bank, housing, transport, public office, interpreter, emergency, and workplace safety communication; not A11 integration and not legal, medical, or financial advice.",
};

export const PUNJABI_CANADA_SURVIVAL_FINAL_REVIEW_DOMAINS: PunjabiCanadaSurvivalFinalReviewDomain[] = [
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

export const PUNJABI_CANADA_SURVIVAL_FINAL_REVIEW: PunjabiCanadaSurvivalFinalReviewItem[] = [
  {
    id: "pa-ca-final-review-clinic-001",
    domain: "clinic",
    checkpoint: "clinic_check_in_qa",
    qa_prompt_vi: "Bạn có thể check-in, nói có appointment, và xin nói chậm hoặc viết ra không?",
    qa_prompt_en: "Can you check in, say you have an appointment, and ask for slow speech or writing?",
    phrase_pa: "ਮੇਰੀ ਅੱਜ ਅਪਾਇੰਟਮੈਂਟ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।",
    romanization: "meri ajj appointment hai. kirpa karke hauli hauli bolo.",
    meaning_vi: "Hôm nay tôi có lịch hẹn. Làm ơn nói chậm hơn.",
    meaning_en: "I have an appointment today. Please speak slowly.",
    canada_example_vi: "Ở Canada, dùng tại clinic desk trước khi xác nhận tên hoặc đưa health card.",
    canada_example_en: "In Canada, use at a clinic desk before confirming your name or giving a health card.",
    support_pa: ["ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    final_review_note_vi: "Đạt nếu người học không chỉ gật đầu khi chưa hiểu bước tiếp theo.",
    final_review_note_en: "Pass if the learner does not simply nod when the next step is unclear.",
    learner_trap_vi: "Đừng đoán giờ hẹn hoặc phòng khám nếu chưa nghe rõ.",
    learner_trap_en: "Do not guess the appointment time or clinic room if unclear.",
  },
  {
    id: "pa-ca-final-review-pharmacy-002",
    domain: "pharmacy",
    checkpoint: "pharmacy_written_instruction_qa",
    qa_prompt_vi: "Bạn có thể lấy thuốc, báo dị ứng, và xin hướng dẫn viết ra mà không tự quyết định y tế không?",
    qa_prompt_en: "Can you pick up medicine, report an allergy, and ask for written instructions without making medical decisions?",
    phrase_pa: "ਮੈਨੂੰ ਇਹ ਦਵਾਈ ਲੈਣੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹਦਾਇਤਾਂ ਲਿਖ ਦਿਓ।",
    romanization: "mainu ih davai laini hai. kirpa karke hadaitan likh dio.",
    meaning_vi: "Tôi cần lấy thuốc này. Làm ơn viết hướng dẫn ra.",
    meaning_en: "I need to pick up this medicine. Please write the instructions down.",
    canada_example_vi: "Ở Canada, dùng khi pharmacist nói nhanh về pickup, dị ứng, hoặc hướng dẫn.",
    canada_example_en: "In Canada, use when a pharmacist speaks quickly about pickup, allergies, or instructions.",
    support_pa: ["ਮੈਨੂੰ ਐਲਰਜੀ ਹੈ।", "ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਸਮਝਾ ਸਕਦੇ ਹੋ?"],
    final_review_note_vi: "Đây là hỗ trợ giao tiếp, không phải lời khuyên y tế.",
    final_review_note_en: "This is communication support, not medical advice.",
    learner_trap_vi: "Không tự đổi liều thuốc từ câu luyện ngôn ngữ.",
    learner_trap_en: "Do not change dosage from a language practice line.",
  },
  {
    id: "pa-ca-final-review-school-003",
    domain: "school_childcare",
    checkpoint: "school_childcare_notice_qa",
    qa_prompt_vi: "Bạn có thể báo con vắng, cập nhật pickup, và hỏi form trường/daycare không?",
    qa_prompt_en: "Can you report absence, update pickup, and ask about a school/daycare form?",
    phrase_pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ। ਮੈਨੂੰ ਇਸ ਫਾਰਮ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    romanization: "mera bacha ajj gairhazir hai. mainu is form vich madad chahidi hai.",
    meaning_vi: "Hôm nay con tôi vắng mặt. Tôi cần giúp với mẫu đơn này.",
    meaning_en: "My child is absent today. I need help with this form.",
    canada_example_vi: "Ở Canada, dùng qua school app, phone, email, giấy note, hoặc daycare pickup.",
    canada_example_en: "In Canada, use through a school app, phone, email, paper note, or daycare pickup.",
    support_pa: ["ਅੱਜ ਹੋਰ ਵਿਅਕਤੀ ਲੈਣ ਆਵੇਗਾ/ਆਵੇਗੀ।", "ਕਿਰਪਾ ਕਰਕੇ ਅਧਿਆਪਕ ਨੂੰ ਦੱਸੋ।"],
    final_review_note_vi: "Đạt nếu người học nói rõ ngày, tên con, và nội dung cần cập nhật.",
    final_review_note_en: "Pass if the learner states the day, child name, and update clearly.",
    learner_trap_vi: "Đừng chỉ nói 'my child' nếu văn phòng có nhiều học sinh.",
    learner_trap_en: "Do not only say 'my child' when the office has many students.",
  },
  {
    id: "pa-ca-final-review-bank-004",
    domain: "bank",
    checkpoint: "bank_general_info_qa",
    qa_prompt_vi: "Bạn có thể hỏi thông tin chung về tài khoản và phí mà không xin tư vấn tài chính không?",
    qa_prompt_en: "Can you ask general account and fee questions without asking for financial advice?",
    phrase_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤੇ ਬਾਰੇ ਆਮ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਫੀਸ ਲਿਖ ਦਿਓ।",
    romanization: "mainu bank khate bare aam jankari chahidi hai. kirpa karke fees likh dio.",
    meaning_vi: "Tôi cần thông tin chung về tài khoản ngân hàng. Làm ơn viết phí ra.",
    meaning_en: "I need general information about a bank account. Please write down the fees.",
    canada_example_vi: "Ở Canada, dùng khi hỏi monthly fee, debit card, appointment, hoặc ID cần mang.",
    canada_example_en: "In Canada, use when asking about monthly fees, a debit card, an appointment, or ID to bring.",
    support_pa: ["ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ।", "ਕੀ ਤੁਸੀਂ ਇਹ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?"],
    final_review_note_vi: "Đạt nếu câu chỉ xin thông tin dịch vụ chung, không chọn sản phẩm tài chính.",
    final_review_note_en: "Pass if the line only asks for general service information, not product selection.",
    learner_trap_vi: "Đừng xem thông tin phí là lời khuyên tài chính.",
    learner_trap_en: "Do not treat fee information as financial advice.",
  },
  {
    id: "pa-ca-final-review-housing-005",
    domain: "housing",
    checkpoint: "housing_repair_address_qa",
    qa_prompt_vi: "Bạn có thể báo sửa chữa, hỏi rent date, và xác nhận địa chỉ/unit mà không xin tư vấn pháp lý không?",
    qa_prompt_en: "Can you report a repair, ask the rent date, and confirm address/unit without asking for legal advice?",
    phrase_pa: "ਮੇਰੇ ਘਰ ਵਿੱਚ ਮੁਰੰਮਤ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਸਮਾਂ ਲਿਖ ਦਿਓ।",
    romanization: "mere ghar vich murammat di lor hai. kirpa karke sama likh dio.",
    meaning_vi: "Nhà tôi cần sửa chữa. Làm ơn viết thời gian ra.",
    meaning_en: "My home needs a repair. Please write down the time.",
    canada_example_vi: "Ở Canada, dùng với landlord, building manager, rental office, hoặc maintenance desk.",
    canada_example_en: "In Canada, use with a landlord, building manager, rental office, or maintenance desk.",
    support_pa: ["ਕਿਰਾਇਆ ਕਦੋਂ ਦੇਣਾ ਹੈ?", "ਯੂਨਿਟ ਨੰਬਰ ਇਹ ਹੈ।"],
    final_review_note_vi: "Đạt nếu người học nêu vấn đề cụ thể và không biến câu thành tranh luận tenancy.",
    final_review_note_en: "Pass if the learner names the issue and does not turn the line into a tenancy dispute.",
    learner_trap_vi: "Đừng bỏ unit number nếu ở apartment hoặc basement suite.",
    learner_trap_en: "Do not skip the unit number if you live in an apartment or basement suite.",
  },
  {
    id: "pa-ca-final-review-transport-006",
    domain: "transport",
    checkpoint: "transport_route_delay_qa",
    qa_prompt_vi: "Bạn có thể hỏi tuyến, báo trễ, và hỏi lost and found không?",
    qa_prompt_en: "Can you ask about a route, report delay, and ask lost and found?",
    phrase_pa: "ਇਸ ਪਤੇ ਲਈ ਕਿਹੜੀ ਬੱਸ ਲੈਣੀ ਹੈ? ਬੱਸ ਦੇਰ ਨਾਲ ਆ ਰਹੀ ਹੈ।",
    romanization: "is pate lai kihri bus laini hai? bus der nal aa rahi hai.",
    meaning_vi: "Tôi nên đi xe bus nào tới địa chỉ này? Xe bus đang tới trễ.",
    meaning_en: "Which bus should I take for this address? The bus is delayed.",
    canada_example_vi: "Ở Canada, dùng khi đi clinic, school, work, rental viewing, hoặc public office.",
    canada_example_en: "In Canada, use when going to a clinic, school, work, rental viewing, or public office.",
    support_pa: ["ਮੇਰੀ ਚੀਜ਼ ਗੁੰਮ ਗਈ ਹੈ।", "ਕੀ ਮੈਨੂੰ ਟ੍ਰਾਂਸਫਰ ਕਰਨਾ ਪਵੇਗਾ?"],
    final_review_note_vi: "Đạt nếu người học hỏi route và xác nhận chiều đi, không chỉ số bus.",
    final_review_note_en: "Pass if the learner asks route and direction, not only the bus number.",
    learner_trap_vi: "Nhắn báo trễ sớm, đừng chờ tới sau giờ hẹn.",
    learner_trap_en: "Send a delay message early, not after the appointment time.",
  },
  {
    id: "pa-ca-final-review-public-office-007",
    domain: "public_office",
    checkpoint: "public_counter_documents_qa",
    qa_prompt_vi: "Bạn có thể hỏi đúng quầy, giấy tờ cần mang, và bước tiếp theo không?",
    qa_prompt_en: "Can you ask the right counter, required documents, and next step?",
    phrase_pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਹੈ? ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?",
    romanization: "mainu kis counter te jana hai? mainu kihre dastavez chahide han?",
    meaning_vi: "Tôi cần đi quầy nào? Tôi cần giấy tờ nào?",
    meaning_en: "Which counter should I go to? Which documents do I need?",
    canada_example_vi: "Ở Canada, dùng tại service centre, library desk, newcomer office, hoặc public office.",
    canada_example_en: "In Canada, use at a service centre, library desk, newcomer office, or public office.",
    support_pa: ["ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", "ਕਿਰਪਾ ਕਰਕੇ ਸੂਚੀ ਲਿਖ ਦਿਓ।"],
    final_review_note_vi: "Đạt nếu người học xin danh sách và bước tiếp theo bằng văn bản.",
    final_review_note_en: "Pass if the learner asks for a list and next step in writing.",
    learner_trap_vi: "Đừng tự đoán giấy tờ nếu có thể xin danh sách.",
    learner_trap_en: "Do not guess documents if you can ask for a list.",
  },
  {
    id: "pa-ca-final-review-interpreter-008",
    domain: "interpreter_request",
    checkpoint: "interpreter_request_qa",
    qa_prompt_vi: "Bạn có thể xin thông dịch viên trước form, meeting, hoặc thông tin phức tạp không?",
    qa_prompt_en: "Can you ask for an interpreter before a form, meeting, or complex information?",
    phrase_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਆ ਚਾਹੀਦਾ ਹੈ। ਕੀ ਪੰਜਾਬੀ ਦੁਭਾਸ਼ੀਆ ਮਿਲ ਸਕਦਾ ਹੈ?",
    romanization: "mainu dubhashia chahida hai. ki Punjabi dubhashia mil sakda hai?",
    meaning_vi: "Tôi cần thông dịch viên. Có thể có thông dịch viên Punjabi không?",
    meaning_en: "I need an interpreter. Is a Punjabi interpreter available?",
    canada_example_vi: "Một số dịch vụ Canada có thể sắp xếp interpreter trực tiếp hoặc qua điện thoại.",
    canada_example_en: "Some Canadian services can arrange in-person or phone interpretation.",
    support_pa: ["ਮੈਨੂੰ ਪੂਰੀ ਗੱਲ ਸਮਝਣੀ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਦੱਸ ਦਿਓ।"],
    final_review_note_vi: "Đạt nếu người học xin hỗ trợ ngôn ngữ trước khi thông tin quá nhanh.",
    final_review_note_en: "Pass if the learner asks for language support before information becomes too fast.",
    learner_trap_vi: "Đây là hỗ trợ ngôn ngữ, không phải tư vấn pháp lý.",
    learner_trap_en: "This is language support, not legal advice.",
  },
  {
    id: "pa-ca-final-review-emergency-009",
    domain: "emergency_boundary",
    checkpoint: "emergency_boundary_qa",
    qa_prompt_vi: "Bạn có thể nói đây là khẩn cấp và nhờ gọi 911 khi có nguy hiểm thật sự không?",
    qa_prompt_en: "Can you say this is an emergency and ask someone to call 911 when there is real danger?",
    phrase_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    romanization: "ih emergency hai. kirpa karke nau-ikk-ikk te call karo.",
    meaning_vi: "Đây là trường hợp khẩn cấp. Làm ơn gọi 911.",
    meaning_en: "This is an emergency. Please call 911.",
    canada_example_vi: "Ở Canada, dùng 911 cho nguy hiểm khẩn cấp thật sự tại nhà, transit, nơi công cộng, hoặc nơi làm.",
    canada_example_en: "In Canada, use 911 for true immediate danger at home, on transit, in public, or at work.",
    support_pa: ["ਮੈਨੂੰ ਤੁਰੰਤ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਸਟਾਫ਼ ਨੂੰ ਬੁਲਾਓ।"],
    final_review_note_vi: "Đạt nếu câu ngắn, rõ, và không kéo dài giải thích trong tình huống khẩn cấp.",
    final_review_note_en: "Pass if the line is short, clear, and avoids long explanation in an emergency.",
    learner_trap_vi: "Không dùng 911 cho vấn đề nhỏ.",
    learner_trap_en: "Do not use 911 for a small issue.",
  },
  {
    id: "pa-ca-final-review-workplace-010",
    domain: "workplace_safety",
    checkpoint: "workplace_safety_qa",
    qa_prompt_vi: "Bạn có thể báo nguy cơ, xin PPE, và xin nói với supervisor không?",
    qa_prompt_en: "Can you report a hazard, request PPE, and ask to speak with a supervisor?",
    phrase_pa: "ਇੱਥੇ ਸੁਰੱਖਿਆ ਦੀ ਸਮੱਸਿਆ ਹੈ। ਕੀ ਮੈਂ ਸੁਪਰਵਾਈਜ਼ਰ ਨਾਲ ਗੱਲ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    romanization: "itthe surakhia di samasya hai. ki main supervisor nal gall kar sakda/sakdi haan?",
    meaning_vi: "Ở đây có vấn đề an toàn. Tôi có thể nói chuyện với supervisor không?",
    meaning_en: "There is a safety problem here. Can I speak with the supervisor?",
    canada_example_vi: "Ở Canada, dùng trong warehouse, restaurant, cleaning, construction, hoặc retail job.",
    canada_example_en: "In Canada, use in a warehouse, restaurant, cleaning, construction, or retail job.",
    support_pa: ["ਮੈਨੂੰ ਸੁਰੱਖਿਆ ਵਾਲਾ ਸਾਮਾਨ ਚਾਹੀਦਾ ਹੈ।", "ਮੈਨੂੰ ਕੰਮ ਤੇ ਚੋਟ ਲੱਗੀ ਹੈ।"],
    final_review_note_vi: "Đạt nếu người học nói rõ nguy cơ và không biến câu thành tranh luận luật.",
    final_review_note_en: "Pass if the learner states the hazard clearly and does not turn the line into a legal argument.",
    learner_trap_vi: "Nói nguy cơ cụ thể, không chỉ nói chung là không ổn.",
    learner_trap_en: "State the specific hazard, not only that something is not okay.",
  },
];

export default PUNJABI_CANADA_SURVIVAL_FINAL_REVIEW;
