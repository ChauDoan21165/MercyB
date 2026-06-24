// Punjabi Canada public services pack for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary. Romanization is a bridge only. Shahmukhi is awareness
// only, not a full course. Native review is deferred.

export type PunjabiPublicServicesCanadaDomain =
  | "clinic"
  | "pharmacy"
  | "school_office"
  | "bank"
  | "government_office"
  | "library_community_center"
  | "emergency_help"
  | "workplace_safety"
  | "housing_repair"
  | "transport_customer_service";

export type PunjabiPublicServicesCanadaUse =
  | "service_support"
  | "service_recovery"
  | "public_service_recovery"
  | "practical_followup"
  | "review";

export type PunjabiPublicServicesCanadaItem = {
  id: string;
  domain: PunjabiPublicServicesCanadaDomain;
  use: PunjabiPublicServicesCanadaUse;
  situation_vi: string;
  situation_en: string;
  goal_vi: string;
  goal_en: string;
  phrase_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  support_pa: string[];
  public_service_check_vi: string;
  public_service_check_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiPublicServicesCanadaScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundaries: string[];
};

export const PUNJABI_PUBLIC_SERVICES_CANADA_SCOPE: PunjabiPublicServicesCanadaScope = {
  name: "Punjabi Canada Public Services Pack",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundaries: [
    "Language support only for Canada public-service situations.",
    "No medical, legal, financial, tenancy, or workplace safety advice.",
  ],
};

export const PUNJABI_PUBLIC_SERVICES_CANADA: PunjabiPublicServicesCanadaItem[] = [
  {
    id: "pa-ca-public-clinic-001",
    domain: "clinic",
    use: "service_support",
    situation_vi: "Quầy phòng khám hỏi nhanh và bạn cần câu ngắn để xin lặp lại.",
    situation_en: "The clinic desk asks quickly and you need a short line to ask for repetition.",
    goal_vi: "Xin nói chậm hơn và nhắc lại phần quan trọng.",
    goal_en: "Ask for slower speech and repetition of the important part.",
    phrase_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "mainu samajh nahin aaya. kirpa karke hauli hauli dubara kaho.",
    meaning_vi: "Tôi chưa hiểu. Làm ơn nói lại chậm hơn.",
    meaning_en: "I did not understand. Please say it again slowly.",
    support_pa: ["ਮੈਨੂੰ ਇੱਥੇ ਦਰਦ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    public_service_check_vi: "Câu chỉ hỗ trợ giao tiếp, không biến thành lời khuyên y tế.",
    public_service_check_en: "The line only supports communication and does not become medical advice.",
    canada_example_vi: "Dùng ở quầy phòng khám Canada khi nhân viên nói quá nhanh.",
    canada_example_en: "Use at a Canadian clinic desk when staff speak too quickly.",
    learner_trap_vi: "Đừng chỉ gật đầu nếu bạn chưa hiểu bước tiếp theo.",
    learner_trap_en: "Do not just nod if you do not understand the next step.",
  },
  {
    id: "pa-ca-public-pharmacy-002",
    domain: "pharmacy",
    use: "service_recovery",
    situation_vi: "Nhà thuốc hỏi về dị ứng hoặc thuốc hiện tại mà bạn cần xác nhận lại.",
    situation_en: "The pharmacy asks about allergies or current medicine and you need to confirm.",
    goal_vi: "Nêu dị ứng trước và xin ghi lại bằng văn bản.",
    goal_en: "State the allergy first and ask for it in writing.",
    phrase_pa: "ਮੈਨੂੰ ਦਵਾਈ ਤੋਂ ਐਲਰਜੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਜਾਣਕਾਰੀ ਲਿਖ ਦਿਓ।",
    romanization: "mainu davai ton allergy hai. kirpa karke ih jankari likh dio.",
    meaning_vi: "Tôi bị dị ứng với thuốc. Làm ơn viết thông tin này ra.",
    meaning_en: "I am allergic to medicine. Please write this information down.",
    support_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    public_service_check_vi: "Câu giữ an toàn thông tin, không thêm hướng dẫn dùng thuốc.",
    public_service_check_en: "The line keeps safety clear and adds no medicine-use directions.",
    canada_example_vi: "Dùng ở nhà thuốc Canada khi cần xác nhận an toàn bằng văn bản.",
    canada_example_en: "Use at a Canadian pharmacy when written confirmation is needed.",
    learner_trap_vi: "Đừng đoán tên thuốc nếu bạn không chắc.",
    learner_trap_en: "Do not guess a medicine name if you are not sure.",
  },
  {
    id: "pa-ca-public-school-office-003",
    domain: "school_office",
    use: "public_service_recovery",
    situation_vi: "Trường đưa thông báo hoặc form và bạn cần biết phần nào quan trọng.",
    situation_en: "The school gives you a notice or form and you need to know what matters.",
    goal_vi: "Xin giải thích phần cần điền trước khi nộp.",
    goal_en: "Ask for the part to be explained before submitting it.",
    phrase_pa: "ਮੈਨੂੰ ਇਹ ਨੋਟ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕੀ ਤੁਸੀਂ ਇਹ ਹਿੱਸਾ ਸਮਝਾ ਸਕਦੇ ਹੋ?",
    romanization: "mainu ih note samajh nahin aaya. ki tusin ih hissa samjha sakde ho?",
    meaning_vi: "Tôi chưa hiểu thông báo này. Bạn có thể giải thích phần này không?",
    meaning_en: "I did not understand this note. Can you explain this part?",
    support_pa: ["ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਦਿਓ।"],
    public_service_check_vi: "Câu phục hồi phải chỉ đúng phần kẹt, không chỉ nói chung chung về trường.",
    public_service_check_en: "The recovery line should point to the exact blockage, not just school in general.",
    canada_example_vi: "Dùng ở văn phòng trường hoặc childcare Canada sau khi bị rối giấy tờ.",
    canada_example_en: "Use at a Canadian school office or childcare centre after form confusion.",
    learner_trap_vi: "Đừng ký nếu phần bắt buộc còn mơ hồ.",
    learner_trap_en: "Do not sign if a required section is still unclear.",
  },
  {
    id: "pa-ca-public-bank-004",
    domain: "bank",
    use: "service_support",
    situation_vi: "Ngân hàng đông và bạn cần hỏi mở tài khoản hoặc phí bằng một câu ngắn.",
    situation_en: "The bank is busy and you need a short line to ask about opening an account or fees.",
    goal_vi: "Nói mục tiêu ngắn gọn và xin phí bằng văn bản.",
    goal_en: "State the goal briefly and ask for fees in writing.",
    phrase_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਫੀਸ ਲਿਖ ਦਿਓ।",
    romanization: "mainu bank khata kholhna hai. kirpa karke fees likh dio.",
    meaning_vi: "Tôi muốn mở tài khoản ngân hàng. Làm ơn viết phí ra.",
    meaning_en: "I want to open a bank account. Please write down the fee.",
    support_pa: ["ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    public_service_check_vi: "Câu chỉ ở mức dịch vụ, không trượt sang tư vấn tài chính.",
    public_service_check_en: "The line stays in service support and does not become financial advice.",
    canada_example_vi: "Dùng ở quầy ngân hàng Canada khi cần biết phí tài khoản.",
    canada_example_en: "Use at a Canadian bank counter when account fees need to be clear.",
    learner_trap_vi: "ਖਾਤਾ là tài khoản; đừng đổi mục tiêu giữa câu.",
    learner_trap_en: "ਖਾਤਾ means account; do not change the goal in the same line.",
  },
  {
    id: "pa-ca-public-government-office-005",
    domain: "government_office",
    use: "public_service_recovery",
    situation_vi: "Cơ quan công chuyển bạn giữa nhiều quầy và bạn cần đúng quầy đúng giấy tờ.",
    situation_en: "The government office sends you between counters and you need the right desk and documents.",
    goal_vi: "Hỏi quầy đúng và xin danh sách giấy tờ.",
    goal_en: "Ask for the correct counter and request the document list.",
    phrase_pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ? ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?",
    romanization: "mainu kis counter te jana chahida hai? mainu kihre dastavez chahide han?",
    meaning_vi: "Tôi nên đến quầy nào? Tôi cần giấy tờ nào?",
    meaning_en: "Which counter should I go to? Which documents do I need?",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਨੰਬਰ ਲਿਖ ਦਿਓ।", "ਮੈਨੂੰ ਫਾਰਮ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।"],
    public_service_check_vi: "Câu phục hồi phải bám vào quầy và giấy tờ, không đoán thủ tục.",
    public_service_check_en: "The recovery line must stay on counter and documents, not guesses about the process.",
    canada_example_vi: "Dùng ở trung tâm dịch vụ Canada khi bạn bị chuyển quầy lòng vòng.",
    canada_example_en: "Use at a Canadian service centre when you are sent between desks.",
    learner_trap_vi: "ਦਸਤਾਵੇਜ਼ là giấy tờ; đừng tự điền nếu chưa rõ.",
    learner_trap_en: "ਦਸਤਾਵੇਜ਼ means documents; do not fill things in if unclear.",
  },
  {
    id: "pa-ca-public-library-center-006",
    domain: "library_community_center",
    use: "review",
    situation_vi: "Thư viện hoặc trung tâm cộng đồng có lớp, mượn sách, hoặc quy định bạn cần hỏi lại.",
    situation_en: "The library or community centre has a class, book, or rule you need to ask about.",
    goal_vi: "Xin giúp tìm đúng sách hoặc hiểu quy định.",
    goal_en: "Ask for help finding the right book or understanding the rule.",
    phrase_pa: "ਮੈਨੂੰ ਇਹ ਕਿਤਾਬ ਲੱਭਣ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਇਹ ਕਿੱਥੇ ਹੈ?",
    romanization: "mainu ih kitab labhan vich madad chahidi hai. ih kithe hai?",
    meaning_vi: "Tôi cần giúp tìm cuốn sách này. Nó ở đâu?",
    meaning_en: "I need help finding this book. Where is it?",
    support_pa: ["ਕੀ ਇਹ ਕਿਤਾਬ ਉਧਾਰ ਮਿਲਦੀ ਹੈ?", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਹਿੱਸਾ ਸਮਝਾਓ।"],
    public_service_check_vi: "Câu phải dùng được cho sách, lớp, hoặc quy định cộng đồng.",
    public_service_check_en: "The line should work for books, classes, or community rules.",
    canada_example_vi: "Dùng ở thư viện hoặc trung tâm cộng đồng Canada khi cần hỏi nhanh.",
    canada_example_en: "Use at a Canadian library or community centre when you need a quick question.",
    learner_trap_vi: "Đừng dùng từ quá trang trọng nếu chỉ cần hỏi lối đi.",
    learner_trap_en: "Do not use overly formal wording if you only need to ask for help.",
  },
  {
    id: "pa-ca-public-emergency-007",
    domain: "emergency_help",
    use: "public_service_recovery",
    situation_vi: "Có nguy hiểm thật sự và bạn cần người khác gọi 911 ngay.",
    situation_en: "There is real danger and you need someone to call 911 immediately.",
    goal_vi: "Nói đây là khẩn cấp và xin gọi 911.",
    goal_en: "Say it is an emergency and ask to call 911.",
    phrase_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    romanization: "ih emergency hai. kirpa karke nau-ikk-ikk te call karo.",
    meaning_vi: "Đây là trường hợp khẩn cấp. Làm ơn gọi 911.",
    meaning_en: "This is an emergency. Please call 911.",
    support_pa: ["ਮੇਰੀ ਮਦਦ ਕਰੋ।", "ਉੱਥੇ ਖੜੇ ਹੋ ਜਾਓ।"],
    public_service_check_vi: "Câu chỉ để gọi hỗ trợ khẩn cấp, không kéo dài giải thích.",
    public_service_check_en: "The line is only for emergency support and does not drag out explanation.",
    canada_example_vi: "Dùng ở Canada khi bạn cần gọi cấp cứu ngay.",
    canada_example_en: "Use in Canada when you need emergency help immediately.",
    learner_trap_vi: "Đừng nói vòng vo khi thời gian rất gấp.",
    learner_trap_en: "Do not be roundabout when time is critical.",
  },
  {
    id: "pa-ca-public-workplace-008",
    domain: "workplace_safety",
    use: "public_service_recovery",
    situation_vi: "Nơi làm việc có vấn đề an toàn và bạn cần báo cho người phụ trách.",
    situation_en: "There is a safety issue at work and you need to report it to the person in charge.",
    goal_vi: "Báo vấn đề và xin bước xử lý ngay.",
    goal_en: "Report the issue and ask for immediate next steps.",
    phrase_pa: "ਇਹ ਸੁਰੱਖਿਆ ਦੀ ਸਮੱਸਿਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੁਣੇ ਵੇਖੋ।",
    romanization: "ih surakhia di samasya hai. kirpa karke hunne vekho.",
    meaning_vi: "Đây là vấn đề an toàn. Làm ơn xem ngay.",
    meaning_en: "This is a safety issue. Please look right away.",
    support_pa: ["ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    public_service_check_vi: "Câu báo việc an toàn, không biến thành lời khuyên nghề nghiệp.",
    public_service_check_en: "The line reports a safety issue and does not become occupational advice.",
    canada_example_vi: "Dùng ở công việc Canada khi cần báo sự cố an toàn gấp.",
    canada_example_en: "Use at a Canadian workplace when you need to report a safety issue urgently.",
    learner_trap_vi: "Đừng giảm nhẹ vấn đề nếu vẫn còn nguy hiểm.",
    learner_trap_en: "Do not soften the issue if danger is still present.",
  },
  {
    id: "pa-ca-public-housing-repair-009",
    domain: "housing_repair",
    use: "service_support",
    situation_vi: "Nhà thuê có hỏng hóc và bạn cần xin lịch sửa bằng văn bản.",
    situation_en: "Your rental has a repair problem and you need a written repair schedule.",
    goal_vi: "Xin thời gian sửa rõ ràng.",
    goal_en: "Ask for a clear repair time.",
    phrase_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਦਾ ਸਮਾਂ ਦੱਸੋ ਅਤੇ ਇਹ ਲਿਖ ਕੇ ਭੇਜੋ।",
    romanization: "kirpa karke murammat da samah daso ate ih likh ke bhejo.",
    meaning_vi: "Làm ơn cho biết thời gian sửa chữa và gửi điều này bằng văn bản.",
    meaning_en: "Please give the repair time and send this in writing.",
    support_pa: ["ਹੀਟਿੰਗ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।", "ਮੈਨੂੰ ਇਹ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    public_service_check_vi: "Câu chỉ xin lịch và văn bản, không phải tư vấn nhà ở.",
    public_service_check_en: "The line only asks for timing and writing, not housing advice.",
    canada_example_vi: "Dùng ở nhà thuê Canada khi cần lịch sửa rõ ràng.",
    canada_example_en: "Use in a Canadian rental when a clear repair timeline is needed.",
    learner_trap_vi: "Đừng để lời hứa chung thay cho ngày giờ cụ thể.",
    learner_trap_en: "Do not let a vague promise replace a specific date or time.",
  },
  {
    id: "pa-ca-public-transport-010",
    domain: "transport_customer_service",
    use: "service_support",
    situation_vi: "Xe buýt đổi tuyến hoặc bảng thông tin làm bạn không chắc nơi xuống.",
    situation_en: "The bus route changed or the sign leaves you unsure where to get off.",
    goal_vi: "Xác nhận tuyến và điểm xuống.",
    goal_en: "Confirm the route and the stop.",
    phrase_pa: "ਕੀ ਇਹ ਬੱਸ ਡਾਊਨਟਾਊਨ ਜਾਂਦੀ ਹੈ? ਮੈਨੂੰ ਕਿਹੜੇ ਸਟਾਪ ਤੇ ਉਤਰਨਾ ਹੈ?",
    romanization: "ki ih bus downtown jandi hai? mainu kihre stop te utarna hai?",
    meaning_vi: "Xe buýt này có đi trung tâm không? Tôi cần xuống trạm nào?",
    meaning_en: "Does this bus go downtown? Which stop should I get off at?",
    support_pa: ["ਮੈਂ ਰਸਤਾ ਭੁੱਲ ਗਿਆ/ਗਈ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।"],
    public_service_check_vi: "Câu phải phục hồi đúng tuyến và trạm, không chỉ hỏi chung chung.",
    public_service_check_en: "The line should recover the route and stop, not ask vaguely.",
    canada_example_vi: "Dùng ở bến xe buýt Canada khi tuyến hoặc trạm làm bạn lúng túng.",
    canada_example_en: "Use at a Canadian bus stop when the route or stop is confusing.",
    learner_trap_vi: "Đừng chỉ dựa vào bảng tiếng Anh nếu Gurmukhi vẫn chưa rõ.",
    learner_trap_en: "Do not rely only on the English sign if the Gurmukhi is still unclear.",
  },
];

export const punjabiPublicServicesCanadaByDomain = (
  domain: PunjabiPublicServicesCanadaDomain,
) => PUNJABI_PUBLIC_SERVICES_CANADA.filter((item) => item.domain === domain);

export const punjabiPublicServicesCanadaByUse = (
  use: PunjabiPublicServicesCanadaUse,
) => PUNJABI_PUBLIC_SERVICES_CANADA.filter((item) => item.use === use);

export default PUNJABI_PUBLIC_SERVICES_CANADA;
