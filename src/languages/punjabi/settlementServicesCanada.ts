// Punjabi Canada settlement services pack for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary. Romanization is a bridge only. Shahmukhi is awareness
// only, not a full course. Native review is deferred.

export type PunjabiSettlementServicesCanadaTopic =
  | "id_documents"
  | "address_update"
  | "forms"
  | "appointment_booking"
  | "interpreter_request"
  | "school_registration"
  | "library_help"
  | "community_help"
  | "benefits_service_desk"
  | "service_followup";

export type PunjabiSettlementServicesCanadaItem = {
  id: string;
  topic: PunjabiSettlementServicesCanadaTopic;
  situation_vi: string;
  situation_en: string;
  phrase_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  use_vi: string;
  use_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  support_pa: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiSettlementServicesCanadaScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundary: string;
};

export const PUNJABI_SETTLEMENT_SERVICES_CANADA_SCOPE: PunjabiSettlementServicesCanadaScope = {
  name: "Punjabi Canada Settlement Services Pack",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundary:
    "Language support for Canadian settlement-service desks, forms, appointments, school registration, libraries, community help, and benefits questions; not legal advice.",
};

export const PUNJABI_SETTLEMENT_SERVICES_CANADA_TOPICS: PunjabiSettlementServicesCanadaTopic[] = [
  "id_documents",
  "address_update",
  "forms",
  "appointment_booking",
  "interpreter_request",
  "school_registration",
  "library_help",
  "community_help",
  "benefits_service_desk",
  "service_followup",
];

export const PUNJABI_SETTLEMENT_SERVICES_CANADA: PunjabiSettlementServicesCanadaItem[] = [
  {
    id: "pa-ca-settlement-id-001",
    topic: "id_documents",
    situation_vi: "Bạn ở quầy settlement và cần hỏi giấy tờ tùy thân nào được chấp nhận.",
    situation_en: "You are at a settlement desk and need to ask which ID documents are accepted.",
    phrase_pa: "ਮੈਨੂੰ ਕਿਹੜੀ ਪਹਿਚਾਣ ਲਿਆਉਣੀ ਚਾਹੀਦੀ ਹੈ?",
    romanization: "mainu kihri pahichan liauni chahidi hai?",
    meaning_vi: "Tôi nên mang giấy tờ tùy thân nào?",
    meaning_en: "Which identification should I bring?",
    use_vi: "Dùng trước khi quay lại appointment để tránh thiếu giấy tờ.",
    use_en: "Use before returning for an appointment so documents are not missing.",
    canada_example_vi: "Ở Canada, service desk có thể hỏi photo ID, proof of address, hoặc immigration document.",
    canada_example_en: "In Canada, a service desk may ask for photo ID, proof of address, or an immigration document.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਸੂਚੀ ਲਿਖ ਦਿਓ।", "ਮੇਰੇ ਕੋਲ ਇਹ ਦਸਤਾਵੇਜ਼ ਹੈ।"],
    learner_trap_vi: "ਪਹਿਚਾਣ là ID; đừng đoán nếu bạn chưa chắc loại giấy tờ.",
    learner_trap_en: "ਪਹਿਚਾਣ means ID; do not guess if the document type is unclear.",
  },
  {
    id: "pa-ca-settlement-address-002",
    topic: "address_update",
    situation_vi: "Bạn mới chuyển nhà và cần cập nhật địa chỉ với dịch vụ hỗ trợ định cư.",
    situation_en: "You moved and need to update your address with a settlement support service.",
    phrase_pa: "ਮੇਰਾ ਪਤਾ ਬਦਲ ਗਿਆ ਹੈ। ਮੈਂ ਨਵਾਂ ਪਤਾ ਦੇਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।",
    romanization: "mera pata badal giya hai. main nava pata dena chahunda/chahundi haan.",
    meaning_vi: "Địa chỉ của tôi đã thay đổi. Tôi muốn cung cấp địa chỉ mới.",
    meaning_en: "My address has changed. I want to give my new address.",
    use_vi: "Dùng khi nhân viên cần thông tin liên lạc mới.",
    use_en: "Use when staff need current contact information.",
    canada_example_vi: "Hữu ích sau khi đổi căn hộ, nhà thuê, hoặc phòng ở Canada.",
    canada_example_en: "Useful after changing an apartment, rental home, or room in Canada.",
    support_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਅਪਡੇਟ ਕਰ ਸਕਦੇ ਹੋ?", "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਪੁਸ਼ਟੀ ਦਿਓ।"],
    learner_trap_vi: "ਪਤਾ là địa chỉ; nhớ nói cả unit/apartment number nếu có.",
    learner_trap_en: "ਪਤਾ means address; include the unit or apartment number if there is one.",
  },
  {
    id: "pa-ca-settlement-forms-003",
    topic: "forms",
    situation_vi: "Bạn có form giấy hoặc online nhưng không hiểu phần bắt buộc.",
    situation_en: "You have a paper or online form but do not understand the required section.",
    phrase_pa: "ਮੈਨੂੰ ਇਸ ਫਾਰਮ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਇਹ ਹਿੱਸਾ ਸਮਝ ਨਹੀਂ ਆਇਆ।",
    romanization: "mainu is form vich madad chahidi hai. ih hissa samajh nahin aaya.",
    meaning_vi: "Tôi cần giúp với mẫu đơn này. Tôi chưa hiểu phần này.",
    meaning_en: "I need help with this form. I did not understand this section.",
    use_vi: "Chỉ vào đúng phần trên form thay vì nói chung chung.",
    use_en: "Point to the exact part of the form instead of asking generally.",
    canada_example_vi: "Dùng tại settlement agency, newcomer centre, hoặc service desk ở Canada.",
    canada_example_en: "Use at a settlement agency, newcomer centre, or service desk in Canada.",
    support_pa: ["ਕੀ ਇਹ ਲਾਜ਼ਮੀ ਹੈ?", "ਕਿਰਪਾ ਕਰਕੇ ਉਦਾਹਰਨ ਦਿਓ।"],
    learner_trap_vi: "ਲਾਜ਼ਮੀ là bắt buộc; đừng ký hoặc nộp nếu phần bắt buộc còn mơ hồ.",
    learner_trap_en: "ਲਾਜ਼ਮੀ means required; do not sign or submit if a required part is unclear.",
  },
  {
    id: "pa-ca-settlement-appointment-004",
    topic: "appointment_booking",
    situation_vi: "Bạn cần đặt hoặc đổi lịch hẹn với nhân viên hỗ trợ định cư.",
    situation_en: "You need to book or change an appointment with a settlement worker.",
    phrase_pa: "ਕੀ ਮੈਨੂੰ ਅਪਾਇੰਟਮੈਂਟ ਮਿਲ ਸਕਦੀ ਹੈ? ਮੈਨੂੰ ਸਮਾਂ ਬਦਲਣਾ ਹੈ।",
    romanization: "ki mainu appointment mil sakdi hai? mainu sama badalna hai.",
    meaning_vi: "Tôi có thể đặt lịch hẹn không? Tôi cần đổi giờ.",
    meaning_en: "Can I get an appointment? I need to change the time.",
    use_vi: "Dùng khi gọi điện hoặc hỏi trực tiếp ở quầy.",
    use_en: "Use on the phone or in person at the desk.",
    canada_example_vi: "Ở Canada, nhiều dịch vụ newcomer cần appointment trước.",
    canada_example_en: "In Canada, many newcomer services require an appointment first.",
    support_pa: ["ਕੀ ਤੁਸੀਂ ਸਮਾਂ ਲਿਖ ਸਕਦੇ ਹੋ?", "ਮੈਨੂੰ ਈਮੇਲ ਭੇਜ ਦਿਓ।"],
    learner_trap_vi: "Đừng chỉ nghe giờ hẹn; xin viết ra để tránh nhầm AM/PM hoặc ngày.",
    learner_trap_en: "Do not only listen to the time; ask for it in writing to avoid AM/PM or date confusion.",
  },
  {
    id: "pa-ca-settlement-interpreter-005",
    topic: "interpreter_request",
    situation_vi: "Vấn đề giấy tờ phức tạp và bạn cần thông dịch viên.",
    situation_en: "The paperwork issue is complex and you need an interpreter.",
    phrase_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਆ ਚਾਹੀਦਾ ਹੈ। ਕੀ ਪੰਜਾਬੀ ਦੁਭਾਸ਼ੀਆ ਮਿਲ ਸਕਦਾ ਹੈ?",
    romanization: "mainu dubhashia chahida hai. ki Punjabi dubhashia mil sakda hai?",
    meaning_vi: "Tôi cần thông dịch viên. Có thể có thông dịch viên Punjabi không?",
    meaning_en: "I need an interpreter. Is a Punjabi interpreter available?",
    use_vi: "Dùng trước khi giải thích chi tiết để giảm hiểu lầm.",
    use_en: "Use before detailed explanation to reduce misunderstanding.",
    canada_example_vi: "Một số dịch vụ Canada có thể sắp xếp interpreter trực tiếp hoặc qua điện thoại.",
    canada_example_en: "Some Canadian services can arrange in-person or phone interpretation.",
    support_pa: ["ਮੈਨੂੰ ਪੂਰੀ ਗੱਲ ਸਮਝਣੀ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    learner_trap_vi: "ਦੁਭਾਸ਼ੀਆ là thông dịch viên; đây là yêu cầu hỗ trợ ngôn ngữ, không phải lời khuyên pháp lý.",
    learner_trap_en: "ਦੁਭਾਸ਼ੀਆ means interpreter; this asks for language support, not legal advice.",
  },
  {
    id: "pa-ca-settlement-school-006",
    topic: "school_registration",
    situation_vi: "Bạn cần đăng ký trường cho con và hỏi giấy tờ cần mang.",
    situation_en: "You need to register a child for school and ask which documents to bring.",
    phrase_pa: "ਮੈਂ ਆਪਣੇ ਬੱਚੇ ਨੂੰ ਸਕੂਲ ਵਿੱਚ ਦਾਖਲ ਕਰਵਾਉਣਾ ਹੈ। ਮੈਨੂੰ ਕੀ ਲਿਆਉਣਾ ਚਾਹੀਦਾ ਹੈ?",
    romanization: "main apne bache nu school vich dakhil karvauna hai. mainu ki liauna chahida hai?",
    meaning_vi: "Tôi muốn đăng ký trường cho con. Tôi nên mang gì?",
    meaning_en: "I want to register my child for school. What should I bring?",
    use_vi: "Dùng ở school office, school board, hoặc newcomer school support.",
    use_en: "Use at a school office, school board, or newcomer school support service.",
    canada_example_vi: "Ở Canada, trường có thể hỏi proof of address, birth document, hoặc immunization record.",
    canada_example_en: "In Canada, schools may ask for proof of address, a birth document, or an immunization record.",
    support_pa: ["ਮੇਰਾ ਬੱਚਾ ਨਵਾਂ ਆਇਆ ਹੈ।", "ਕੀ ਕੋਈ ਸੂਚੀ ਹੈ?"],
    learner_trap_vi: "ਦਾਖਲ ਕਰਵਾਉਣਾ là đăng ký/nhập học; đừng dùng câu này cho appointment y tế.",
    learner_trap_en: "ਦਾਖਲ ਕਰਵਾਉਣਾ here means enroll; do not use this line for a medical appointment.",
  },
  {
    id: "pa-ca-settlement-library-007",
    topic: "library_help",
    situation_vi: "Bạn muốn hỏi thư viện về thẻ library card, lớp tiếng Anh, hoặc máy tính.",
    situation_en: "You want to ask the library about a library card, English class, or computer.",
    phrase_pa: "ਮੈਨੂੰ ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ ਬਣਵਾਉਣਾ ਹੈ। ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?",
    romanization: "mainu library card banvauna hai. ki tusin madad kar sakde ho?",
    meaning_vi: "Tôi muốn làm thẻ thư viện. Bạn có thể giúp không?",
    meaning_en: "I want to get a library card. Can you help?",
    use_vi: "Dùng ở thư viện công cộng khi cần tài nguyên miễn phí.",
    use_en: "Use at a public library when asking for free resources.",
    canada_example_vi: "Thư viện Canada thường có máy tính, lớp học, thông tin cộng đồng, và sách cho newcomer.",
    canada_example_en: "Canadian libraries often have computers, classes, community information, and books for newcomers.",
    support_pa: ["ਕੀ ਇੱਥੇ ਅੰਗਰੇਜ਼ੀ ਕਲਾਸ ਹੈ?", "ਮੈਨੂੰ ਕੰਪਿਊਟਰ ਵਰਤਣਾ ਹੈ।"],
    learner_trap_vi: "ਲਾਇਬ੍ਰੇਰੀ là thư viện; nhiều dịch vụ ở đây không phải cửa hàng trả phí.",
    learner_trap_en: "ਲਾਇਬ੍ਰੇਰੀ means library; many services here are not paid shop services.",
  },
  {
    id: "pa-ca-settlement-community-008",
    topic: "community_help",
    situation_vi: "Bạn cần hỏi trung tâm cộng đồng về lớp, food bank, childcare, hoặc hoạt động gia đình.",
    situation_en: "You need to ask a community centre about classes, a food bank, childcare, or family activities.",
    phrase_pa: "ਮੈਨੂੰ ਕਮਿਊਨਿਟੀ ਸੇਵਾ ਬਾਰੇ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ।",
    romanization: "mainu community seva bare jankari chahidi hai.",
    meaning_vi: "Tôi cần thông tin về dịch vụ cộng đồng.",
    meaning_en: "I need information about community services.",
    use_vi: "Dùng khi chưa biết đúng chương trình hoặc đúng quầy.",
    use_en: "Use when you do not know the right program or desk yet.",
    canada_example_vi: "Dùng tại community centre hoặc newcomer agency ở Canada khi hỏi lớp hoặc hỗ trợ gia đình.",
    canada_example_en: "Use at a Canadian community centre or newcomer agency when asking about classes or family support.",
    support_pa: ["ਕੀ ਇਹ ਮੁਫ਼ਤ ਹੈ?", "ਮੈਂ ਕਿੱਥੇ ਰਜਿਸਟਰ ਕਰਾਂ?"],
    learner_trap_vi: "ਸੇਵਾ là dịch vụ; hỏi thông tin trước, đừng giả định bạn đủ điều kiện.",
    learner_trap_en: "ਸੇਵਾ means service; ask for information first and do not assume eligibility.",
  },
  {
    id: "pa-ca-settlement-benefits-009",
    topic: "benefits_service_desk",
    situation_vi: "Bạn ở quầy dịch vụ và cần hỏi về benefits hoặc chương trình hỗ trợ mà không xin tư vấn pháp lý.",
    situation_en: "You are at a service desk and need to ask about benefits or support programs without asking for legal advice.",
    phrase_pa: "ਮੈਨੂੰ ਬੈਨਿਫਿਟਸ ਬਾਰੇ ਆਮ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ। ਮੈਂ ਕਿਸ ਨਾਲ ਗੱਲ ਕਰਾਂ?",
    romanization: "mainu benefits bare aam jankari chahidi hai. main kis nal gall karan?",
    meaning_vi: "Tôi cần thông tin chung về benefits. Tôi nên nói chuyện với ai?",
    meaning_en: "I need general information about benefits. Who should I speak with?",
    use_vi: "Dùng để xin đúng người hoặc đúng quầy, không để quyết định hồ sơ.",
    use_en: "Use to find the right person or desk, not to decide an application.",
    canada_example_vi: "Ở Canada, service desk có thể hướng dẫn bạn tới website, form, hoặc nhân viên phù hợp.",
    canada_example_en: "In Canada, a service desk may direct you to a website, form, or appropriate worker.",
    support_pa: ["ਕੀ ਤੁਸੀਂ ਲਿੰਕ ਲਿਖ ਸਕਦੇ ਹੋ?", "ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।"],
    learner_trap_vi: "ਆਮ ਜਾਣਕਾਰੀ là thông tin chung; không biến câu hỏi thành yêu cầu tư vấn pháp lý.",
    learner_trap_en: "ਆਮ ਜਾਣਕਾਰੀ means general information; do not turn the question into a request for legal advice.",
  },
  {
    id: "pa-ca-settlement-followup-010",
    topic: "service_followup",
    situation_vi: "Sau cuộc hẹn, bạn cần xác nhận bước tiếp theo, deadline, hoặc email liên hệ.",
    situation_en: "After an appointment, you need to confirm the next step, deadline, or contact email.",
    phrase_pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ? ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।",
    romanization: "agla kadam ki hai? kirpa karke ih likh dio.",
    meaning_vi: "Bước tiếp theo là gì? Làm ơn viết ra.",
    meaning_en: "What is the next step? Please write it down.",
    use_vi: "Dùng cuối buổi gặp để tránh quên việc cần làm.",
    use_en: "Use at the end of a meeting so you do not forget what to do.",
    canada_example_vi: "Hữu ích khi nhân viên Canada đưa deadline, số hồ sơ, hoặc email follow-up.",
    canada_example_en: "Useful when Canadian staff give a deadline, file number, or follow-up email.",
    support_pa: ["ਮੈਨੂੰ ਕਦੋਂ ਵਾਪਸ ਆਉਣਾ ਹੈ?", "ਕੀ ਤੁਸੀਂ ਈਮੇਲ ਭੇਜੋਗੇ?"],
    learner_trap_vi: "ਅਗਲਾ ਕਦਮ là bước tiếp theo; đừng rời quầy nếu deadline còn chưa rõ.",
    learner_trap_en: "ਅਗਲਾ ਕਦਮ means next step; do not leave the desk if the deadline is unclear.",
  },
];

export default PUNJABI_SETTLEMENT_SERVICES_CANADA;
