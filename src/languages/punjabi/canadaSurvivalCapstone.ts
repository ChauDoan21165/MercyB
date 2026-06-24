// Punjabi Canada survival capstone for Vietnamese-speaking and English-speaking
// learners.
//
// Gurmukhi is primary. Romanization is a bridge only. Shahmukhi is awareness
// only, not a full course. Native review is deferred.

export type PunjabiCanadaSurvivalCapstoneDomain =
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

export type PunjabiCanadaSurvivalCapstoneItem = {
  id: string;
  domain: PunjabiCanadaSurvivalCapstoneDomain;
  checkpoint: string;
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

export type PunjabiCanadaSurvivalCapstoneScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundary: string;
};

export const PUNJABI_CANADA_SURVIVAL_CAPSTONE_SCOPE: PunjabiCanadaSurvivalCapstoneScope = {
  name: "Punjabi Canada Survival Capstone",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundary:
    "Capstone language support for Canadian clinic, pharmacy, school and childcare, bank, housing, transport, public office, interpreter, emergency, and workplace safety situations; not legal, medical, or financial advice.",
};

export const PUNJABI_CANADA_SURVIVAL_CAPSTONE_DOMAINS: PunjabiCanadaSurvivalCapstoneDomain[] = [
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

export const PUNJABI_CANADA_SURVIVAL_CAPSTONE: PunjabiCanadaSurvivalCapstoneItem[] = [
  {
    id: "pa-ca-capstone-clinic-001",
    domain: "clinic",
    checkpoint: "check_in_and_slow_repeat",
    situation_vi: "Bạn đến phòng khám và cần check-in, nói mình có hẹn, rồi xin nhân viên nói chậm.",
    situation_en: "You arrive at a clinic and need to check in, say you have an appointment, and ask staff to speak slowly.",
    phrase_pa: "ਮੇਰੀ ਅੱਜ ਅਪਾਇੰਟਮੈਂਟ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।",
    romanization: "meri ajj appointment hai. kirpa karke hauli hauli bolo.",
    meaning_vi: "Hôm nay tôi có lịch hẹn. Làm ơn nói chậm hơn.",
    meaning_en: "I have an appointment today. Please speak slowly.",
    use_vi: "Dùng ở quầy clinic khi bạn cần mở đầu rõ và giảm tốc độ nói.",
    use_en: "Use at clinic reception when you need a clear opening and slower speech.",
    canada_example_vi: "Ở Canada, có thể dùng trước khi đưa health card hoặc xác nhận tên.",
    canada_example_en: "In Canada, use before giving a health card or confirming your name.",
    support_pa: ["ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    learner_trap_vi: "Đừng gật đầu nếu chưa hiểu giờ hẹn hoặc bước tiếp theo.",
    learner_trap_en: "Do not nod along if the appointment time or next step is unclear.",
  },
  {
    id: "pa-ca-capstone-pharmacy-002",
    domain: "pharmacy",
    checkpoint: "pickup_and_written_instruction",
    situation_vi: "Bạn lấy thuốc ở pharmacy và cần xin hướng dẫn được viết ra.",
    situation_en: "You pick up medicine at a pharmacy and need instructions written down.",
    phrase_pa: "ਮੈਨੂੰ ਇਹ ਦਵਾਈ ਲੈਣੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹਦਾਇਤਾਂ ਲਿਖ ਦਿਓ।",
    romanization: "mainu ih davai laini hai. kirpa karke hadaitan likh dio.",
    meaning_vi: "Tôi cần lấy thuốc này. Làm ơn viết hướng dẫn ra.",
    meaning_en: "I need to pick up this medicine. Please write the instructions down.",
    use_vi: "Dùng để hỗ trợ giao tiếp ở pharmacy, không tự đổi cách dùng thuốc.",
    use_en: "Use for pharmacy communication support, not to change how medicine is used.",
    canada_example_vi: "Ở Canada, pharmacist có thể hỏi dị ứng hoặc thuốc đang dùng.",
    canada_example_en: "In Canada, a pharmacist may ask about allergies or current medicine.",
    support_pa: ["ਮੈਨੂੰ ਐਲਰਜੀ ਹੈ।", "ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਸਮਝਾ ਸਕਦੇ ਹੋ?"],
    learner_trap_vi: "ਹਦਾਇਤਾਂ là hướng dẫn; xin viết ra nếu số lần/ngày nghe chưa chắc.",
    learner_trap_en: "ਹਦਾਇਤਾਂ means instructions; ask for writing if frequency or timing is unclear.",
  },
  {
    id: "pa-ca-capstone-school-003",
    domain: "school_childcare",
    checkpoint: "absence_pickup_and_forms",
    situation_vi: "Bạn cần báo con vắng, hỏi pickup, hoặc xin giúp với form ở trường/daycare.",
    situation_en: "You need to report absence, ask about pickup, or get help with a school/daycare form.",
    phrase_pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ। ਮੈਨੂੰ ਫਾਰਮ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    romanization: "mera bacha ajj gairhazir hai. mainu form vich madad chahidi hai.",
    meaning_vi: "Hôm nay con tôi vắng mặt. Tôi cần giúp với mẫu đơn.",
    meaning_en: "My child is absent today. I need help with the form.",
    use_vi: "Dùng với school office, teacher, hoặc daycare staff khi thông tin cần rõ.",
    use_en: "Use with the school office, teacher, or daycare staff when details need to be clear.",
    canada_example_vi: "Ở Canada, school/daycare có thể dùng app, phone, email, hoặc giấy note.",
    canada_example_en: "In Canada, school/daycare communication may use an app, phone, email, or paper note.",
    support_pa: ["ਕੌਣ ਬੱਚੇ ਨੂੰ ਲੈਣ ਆਵੇਗਾ?", "ਕਿਰਪਾ ਕਰਕੇ ਅਧਿਆਪਕ ਨੂੰ ਦੱਸੋ।"],
    learner_trap_vi: "Nói rõ ngày và tên con; đừng chỉ nói 'my child' nếu văn phòng có nhiều học sinh.",
    learner_trap_en: "Say the date and child name; do not only say 'my child' when the office has many students.",
  },
  {
    id: "pa-ca-capstone-bank-004",
    domain: "bank",
    checkpoint: "fee_and_account_clarity",
    situation_vi: "Bạn ở ngân hàng và cần hỏi tài khoản hoặc phí bằng câu ngắn.",
    situation_en: "You are at a bank and need to ask about an account or fees with a short line.",
    phrase_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤੇ ਬਾਰੇ ਆਮ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਫੀਸ ਲਿਖ ਦਿਓ।",
    romanization: "mainu bank khate bare aam jankari chahidi hai. kirpa karke fees likh dio.",
    meaning_vi: "Tôi cần thông tin chung về tài khoản ngân hàng. Làm ơn viết phí ra.",
    meaning_en: "I need general information about a bank account. Please write down the fees.",
    use_vi: "Dùng để xin thông tin dịch vụ cơ bản, không phải tư vấn tài chính.",
    use_en: "Use for basic service information, not financial advice.",
    canada_example_vi: "Ở Canada, câu này hữu ích khi hỏi monthly fee, debit card, hoặc appointment.",
    canada_example_en: "In Canada, this is useful when asking about monthly fees, a debit card, or an appointment.",
    support_pa: ["ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ।", "ਕੀ ਤੁਸੀਂ ਇਹ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?"],
    learner_trap_vi: "ਆਮ ਜਾਣਕਾਰੀ là thông tin chung; đừng xem đây là lời khuyên chọn sản phẩm tài chính.",
    learner_trap_en: "ਆਮ ਜਾਣਕਾਰੀ means general information; do not treat it as advice choosing a financial product.",
  },
  {
    id: "pa-ca-capstone-housing-005",
    domain: "housing",
    checkpoint: "repair_rent_and_address",
    situation_vi: "Bạn cần báo sửa nhà, hỏi rent, hoặc xác nhận địa chỉ/unit.",
    situation_en: "You need to report a repair, ask about rent, or confirm an address/unit.",
    phrase_pa: "ਮੇਰੇ ਘਰ ਵਿੱਚ ਮੁਰੰਮਤ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਪਤਾ ਅਤੇ ਸਮਾਂ ਲਿਖ ਦਿਓ।",
    romanization: "mere ghar vich murammat di lor hai. kirpa karke pata ate sama likh dio.",
    meaning_vi: "Nhà tôi cần sửa chữa. Làm ơn viết địa chỉ và thời gian ra.",
    meaning_en: "My home needs a repair. Please write down the address and time.",
    use_vi: "Dùng với landlord, building manager, hoặc maintenance desk.",
    use_en: "Use with a landlord, building manager, or maintenance desk.",
    canada_example_vi: "Ở Canada, ghi rõ unit number, building, ngày giờ, và vấn đề cần sửa.",
    canada_example_en: "In Canada, include unit number, building, date/time, and the repair issue.",
    support_pa: ["ਕਿਰਾਇਆ ਕਦੋਂ ਦੇਣਾ ਹੈ?", "ਯੂਨਿਟ ਨੰਬਰ ਕੀ ਹੈ?"],
    learner_trap_vi: "ਮੁਰੰਮਤ là sửa chữa; đừng bỏ unit number nếu sống trong apartment.",
    learner_trap_en: "ਮੁਰੰਮਤ means repair; do not skip the unit number if you live in an apartment.",
  },
  {
    id: "pa-ca-capstone-transport-006",
    domain: "transport",
    checkpoint: "route_lost_item_and_delay",
    situation_vi: "Bạn cần hỏi route bus/train, báo trễ, hoặc hỏi lost and found.",
    situation_en: "You need to ask about a bus/train route, report a delay, or ask lost and found.",
    phrase_pa: "ਇਸ ਪਤੇ ਲਈ ਕਿਹੜੀ ਬੱਸ ਲੈਣੀ ਹੈ? ਬੱਸ ਦੇਰ ਨਾਲ ਆ ਰਹੀ ਹੈ।",
    romanization: "is pate lai kihri bus laini hai? bus der nal aa rahi hai.",
    meaning_vi: "Tôi nên đi xe bus nào tới địa chỉ này? Xe bus đang tới trễ.",
    meaning_en: "Which bus should I take for this address? The bus is delayed.",
    use_vi: "Dùng ở transit stop, station, hoặc khi nhắn báo trễ appointment.",
    use_en: "Use at a transit stop, station, or when messaging that you will be late.",
    canada_example_vi: "Ở Canada, hữu ích khi đi clinic, school, work, hoặc xem nhà thuê.",
    canada_example_en: "In Canada, useful when going to a clinic, school, work, or rental viewing.",
    support_pa: ["ਮੇਰੀ ਚੀਜ਼ ਗੁੰਮ ਗਈ ਹੈ।", "ਕੀ ਮੈਨੂੰ ਟ੍ਰਾਂਸਫਰ ਕਰਨਾ ਪਵੇਗਾ?"],
    learner_trap_vi: "ਕਿਹੜੀ là tuyến nào; luôn xác nhận chiều đi đúng hướng.",
    learner_trap_en: "ਕਿਹੜੀ means which; always confirm the travel direction.",
  },
  {
    id: "pa-ca-capstone-public-office-007",
    domain: "public_office",
    checkpoint: "counter_documents_and_next_step",
    situation_vi: "Bạn ở quầy dịch vụ công và cần hỏi đúng quầy, giấy tờ, bước tiếp theo.",
    situation_en: "You are at a public service desk and need to ask the right counter, documents, and next step.",
    phrase_pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਹੈ? ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?",
    romanization: "mainu kis counter te jana hai? mainu kihre dastavez chahide han?",
    meaning_vi: "Tôi cần đi quầy nào? Tôi cần giấy tờ nào?",
    meaning_en: "Which counter should I go to? Which documents do I need?",
    use_vi: "Dùng để tìm đúng hướng tại service desk, không đoán thủ tục.",
    use_en: "Use to find the right direction at a service desk, not to guess the process.",
    canada_example_vi: "Ở Canada, có thể dùng tại service centre, library desk, hoặc newcomer office.",
    canada_example_en: "In Canada, use at a service centre, library desk, or newcomer office.",
    support_pa: ["ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", "ਕਿਰਪਾ ਕਰਕੇ ਸੂਚੀ ਲਿਖ ਦਿਓ।"],
    learner_trap_vi: "ਦਸਤਾਵੇਜ਼ là giấy tờ; xin danh sách thay vì tự đoán.",
    learner_trap_en: "ਦਸਤਾਵੇਜ਼ means documents; ask for a list instead of guessing.",
  },
  {
    id: "pa-ca-capstone-interpreter-008",
    domain: "interpreter_request",
    checkpoint: "ask_before_complex_details",
    situation_vi: "Vấn đề phức tạp và bạn cần thông dịch viên trước khi ký, họp, hoặc giải thích.",
    situation_en: "The issue is complex and you need an interpreter before signing, meeting, or explaining.",
    phrase_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਆ ਚਾਹੀਦਾ ਹੈ। ਕੀ ਪੰਜਾਬੀ ਦੁਭਾਸ਼ੀਆ ਮਿਲ ਸਕਦਾ ਹੈ?",
    romanization: "mainu dubhashia chahida hai. ki Punjabi dubhashia mil sakda hai?",
    meaning_vi: "Tôi cần thông dịch viên. Có thể có thông dịch viên Punjabi không?",
    meaning_en: "I need an interpreter. Is a Punjabi interpreter available?",
    use_vi: "Dùng trước khi thông tin quan trọng trở nên quá nhanh hoặc quá chi tiết.",
    use_en: "Use before important information becomes too fast or too detailed.",
    canada_example_vi: "Một số dịch vụ Canada có thể sắp xếp interpreter trực tiếp hoặc qua điện thoại.",
    canada_example_en: "Some Canadian services can arrange in-person or phone interpretation.",
    support_pa: ["ਮੈਨੂੰ ਪੂਰੀ ਗੱਲ ਸਮਝਣੀ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਦੱਸ ਦਿਓ।"],
    learner_trap_vi: "ਦੁਭਾਸ਼ੀਆ là thông dịch viên; đây là hỗ trợ ngôn ngữ, không phải tư vấn pháp lý.",
    learner_trap_en: "ਦੁਭਾਸ਼ੀਆ means interpreter; this is language support, not legal advice.",
  },
  {
    id: "pa-ca-capstone-emergency-009",
    domain: "emergency_boundary",
    checkpoint: "stop_and_call_help",
    situation_vi: "Có nguy hiểm thật sự trong nhà, nơi công cộng, transit, hoặc nơi làm.",
    situation_en: "There is real danger at home, in public, on transit, or at work.",
    phrase_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    romanization: "ih emergency hai. kirpa karke nau-ikk-ikk te call karo.",
    meaning_vi: "Đây là trường hợp khẩn cấp. Làm ơn gọi 911.",
    meaning_en: "This is an emergency. Please call 911.",
    use_vi: "Dùng khi cần phản ứng ngay, không kéo dài giải thích.",
    use_en: "Use when immediate action is needed, without long explanation.",
    canada_example_vi: "Ở Canada, dùng 911 cho nguy hiểm khẩn cấp thật sự.",
    canada_example_en: "In Canada, use 911 for a true emergency.",
    support_pa: ["ਮੈਨੂੰ ਤੁਰੰਤ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਸਟਾਫ਼ ਨੂੰ ਬੁਲਾਓ।"],
    learner_trap_vi: "Đừng dùng câu khẩn cấp cho vấn đề nhỏ; dùng khi cần giúp ngay.",
    learner_trap_en: "Do not use the emergency line for a small issue; use it when help is needed now.",
  },
  {
    id: "pa-ca-capstone-workplace-010",
    domain: "workplace_safety",
    checkpoint: "report_hazard_ppe_and_supervisor",
    situation_vi: "Bạn bị thương, thấy nguy cơ, cần PPE, hoặc cần nói với supervisor.",
    situation_en: "You are injured, see a hazard, need PPE, or need to speak with a supervisor.",
    phrase_pa: "ਇੱਥੇ ਸੁਰੱਖਿਆ ਦੀ ਸਮੱਸਿਆ ਹੈ। ਕੀ ਮੈਂ ਸੁਪਰਵਾਈਜ਼ਰ ਨਾਲ ਗੱਲ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    romanization: "itthe surakhia di samasya hai. ki main supervisor nal gall kar sakda/sakdi haan?",
    meaning_vi: "Ở đây có vấn đề an toàn. Tôi có thể nói chuyện với supervisor không?",
    meaning_en: "There is a safety problem here. Can I speak with the supervisor?",
    use_vi: "Dùng để báo nguy cơ và chuyển tới người phụ trách, không tranh luận luật.",
    use_en: "Use to report a hazard and reach the responsible person, not to argue law.",
    canada_example_vi: "Ở Canada, hữu ích trong warehouse, restaurant, cleaning, construction, hoặc retail job.",
    canada_example_en: "In Canada, useful in a warehouse, restaurant, cleaning, construction, or retail job.",
    support_pa: ["ਮੈਨੂੰ ਸੁਰੱਖਿਆ ਵਾਲਾ ਸਾਮਾਨ ਚਾਹੀਦਾ ਹੈ।", "ਮੈਨੂੰ ਕੰਮ ਤੇ ਚੋਟ ਲੱਗੀ ਹੈ।"],
    learner_trap_vi: "ਸੁਰੱਖਿਆ là an toàn; nói nguy cơ cụ thể thay vì chỉ nói chung chung.",
    learner_trap_en: "ਸੁਰੱਖਿਆ means safety; state the specific hazard instead of staying general.",
  },
];

export default PUNJABI_CANADA_SURVIVAL_CAPSTONE;
