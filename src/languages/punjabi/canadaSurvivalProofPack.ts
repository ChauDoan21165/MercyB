// Punjabi Canada survival proof pack for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary. Romanization supports recognition only. Shahmukhi is
// included as awareness, not as a full course. Native review is deferred.

export type PunjabiCanadaSurvivalProofDomain =
  | "clinic"
  | "pharmacy"
  | "school_childcare"
  | "bank"
  | "housing"
  | "transport"
  | "public_office"
  | "forms_service_desk"
  | "interpreter_request"
  | "emergency_boundary"
  | "workplace_safety";

export type PunjabiCanadaSurvivalProofUse =
  | "proof_pack"
  | "final_owner_review"
  | "final_qa";

export type PunjabiCanadaSurvivalProofItem = {
  id: string;
  domain: PunjabiCanadaSurvivalProofDomain;
  use: PunjabiCanadaSurvivalProofUse;
  evidenceTarget_vi: string;
  evidenceTarget_en: string;
  learnerTask_vi: string;
  learnerTask_en: string;
  proofLine_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  acceptableSupport_pa: string[];
  ownerReviewCue_vi: string;
  ownerReviewCue_en: string;
  canadaPractical_vi: string;
  canadaPractical_en: string;
  learnerTrap_vi?: string;
  learnerTrap_en?: string;
};

export type PunjabiCanadaSurvivalProofPackScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundary: string;
};

export const PUNJABI_CANADA_SURVIVAL_PROOF_PACK_SCOPE: PunjabiCanadaSurvivalProofPackScope = {
  name: "Punjabi Canada Survival Proof Pack",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization is a bridge. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundary:
    "This is language proof for Canada survival scenarios, not professional advice.",
};

export const PUNJABI_CANADA_SURVIVAL_PROOF_PACK: PunjabiCanadaSurvivalProofItem[] = [
  {
    id: "pa-ca-proof-clinic-001",
    domain: "clinic",
    use: "proof_pack",
    evidenceTarget_vi: "Người học có thể bắt đầu cuộc nói chuyện ở phòng khám.",
    evidenceTarget_en: "The learner can start a clinic conversation.",
    learnerTask_vi: "Đọc câu Gurmukhi, nói nghĩa, rồi thêm một câu xin giải thích chậm.",
    learnerTask_en: "Read the Gurmukhi line, state the meaning, then add a slow-explanation request.",
    proofLine_pa: "ਮੈਨੂੰ ਠੀਕ ਨਹੀਂ ਲੱਗ ਰਿਹਾ।",
    romanization: "mainu theek nahin lag riha.",
    meaning_vi: "Tôi thấy không khỏe.",
    meaning_en: "I do not feel well.",
    acceptableSupport_pa: ["ਮੈਨੂੰ ਇੱਥੇ ਦਰਦ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਸਮਝਾਓ।"],
    ownerReviewCue_vi: "Chấp nhận nếu người học không biến câu này thành chẩn đoán.",
    ownerReviewCue_en: "Accept if the learner does not turn this line into a diagnosis.",
    canadaPractical_vi: "Dùng ở phòng khám Canada để mở đầu mô tả triệu chứng đơn giản.",
    canadaPractical_en: "Use at a Canadian clinic to begin describing a simple symptom.",
    learnerTrap_vi: "ਠੀਕ ਨਹੀਂ là không ổn; không phải tên bệnh.",
    learnerTrap_en: "ਠੀਕ ਨਹੀਂ means not okay; it is not a disease name.",
  },
  {
    id: "pa-ca-proof-pharmacy-002",
    domain: "pharmacy",
    use: "final_owner_review",
    evidenceTarget_vi: "Người học có thể báo dị ứng thuốc trước khi hỏi dược sĩ.",
    evidenceTarget_en: "The learner can report a medicine allergy before asking a pharmacist.",
    learnerTask_vi: "Chọn đúng câu khi tình huống có thuốc và dị ứng.",
    learnerTask_en: "Choose the correct line when the situation includes medicine and allergy.",
    proofLine_pa: "ਮੈਨੂੰ ਦਵਾਈ ਤੋਂ ਐਲਰਜੀ ਹੈ।",
    romanization: "mainu davai ton allergy hai.",
    meaning_vi: "Tôi bị dị ứng với thuốc.",
    meaning_en: "I am allergic to medicine.",
    acceptableSupport_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਮਝਾ ਸਕਦੇ ਹੋ?", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    ownerReviewCue_vi: "Tìm dấu hiệu người học phân biệt ਦਵਾਈ và ਫਾਰਮੇਸੀ.",
    ownerReviewCue_en: "Look for evidence that the learner distinguishes ਦਵਾਈ and ਫਾਰਮੇਸੀ.",
    canadaPractical_vi: "Ở Canada, nói rõ dị ứng trước khi nhận hoặc hỏi về thuốc.",
    canadaPractical_en: "In Canada, state allergies clearly before receiving or asking about medicine.",
    learnerTrap_vi: "Không coi câu trả lời ở quầy là chỉ định điều trị.",
    learnerTrap_en: "Do not treat a counter response as treatment direction.",
  },
  {
    id: "pa-ca-proof-school-003",
    domain: "school_childcare",
    use: "proof_pack",
    evidenceTarget_vi: "Người học có thể báo vắng mặt cho trường hoặc nơi giữ trẻ.",
    evidenceTarget_en: "The learner can report an absence to a school or childcare centre.",
    learnerTask_vi: "Đọc câu, nêu ai vắng mặt, và hỏi ghi chú tiếng Anh khi cần.",
    learnerTask_en: "Read the line, say who is absent, and ask for an English note if needed.",
    proofLine_pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ।",
    romanization: "mera bacha aj gair-hazar hai.",
    meaning_vi: "Con tôi hôm nay vắng mặt.",
    meaning_en: "My child is absent today.",
    acceptableSupport_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਨੋਟ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਦੇ ਸਕਦੇ ਹੋ?", "ਮੀਟਿੰਗ ਕਦੋਂ ਹੈ?"],
    ownerReviewCue_vi: "Chấp nhận nếu người học hiểu ਬੱਚਾ là trẻ/con.",
    ownerReviewCue_en: "Accept if the learner understands ਬੱਚਾ as child.",
    canadaPractical_vi: "Dùng khi nói với văn phòng trường, giáo viên, hoặc trung tâm giữ trẻ ở Canada.",
    canadaPractical_en: "Use with Canadian school offices, teachers, or childcare centres.",
    learnerTrap_vi: "Đừng dùng ਬੱਚਾ cho người lớn đi học.",
    learnerTrap_en: "Do not use ਬੱਚਾ for an adult learner.",
  },
  {
    id: "pa-ca-proof-bank-004",
    domain: "bank",
    use: "final_qa",
    evidenceTarget_vi: "Người học có thể nói mục đích mở tài khoản và hỏi phí.",
    evidenceTarget_en: "The learner can state the purpose of opening an account and ask about fees.",
    learnerTask_vi: "Đọc câu chính, phân biệt tài khoản và thẻ, rồi hỏi phí.",
    learnerTask_en: "Read the main line, distinguish account from card, then ask about fees.",
    proofLine_pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਹੈ।",
    romanization: "mainu bank khata kholhna hai.",
    meaning_vi: "Tôi muốn mở tài khoản ngân hàng.",
    meaning_en: "I want to open a bank account.",
    acceptableSupport_pa: ["ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ।", "ਫੀਸ ਕਿੰਨੀ ਹੈ?"],
    ownerReviewCue_vi: "Chấp nhận nếu người học gọi đây là ngôn ngữ giao tiếp, không phải tư vấn tài chính.",
    ownerReviewCue_en: "Accept if the learner treats this as service language, not financial advice.",
    canadaPractical_vi: "Dùng tại quầy ngân hàng Canada khi nói nhu cầu cơ bản.",
    canadaPractical_en: "Use at a Canadian bank counter to state a basic service need.",
    learnerTrap_vi: "ਖਾਤਾ là tài khoản; ਕਾਰਡ là thẻ.",
    learnerTrap_en: "ਖਾਤਾ means account; ਕਾਰਡ means card.",
  },
  {
    id: "pa-ca-proof-housing-005",
    domain: "housing",
    use: "proof_pack",
    evidenceTarget_vi: "Người học có thể báo sự cố sửa chữa trong nhà thuê.",
    evidenceTarget_en: "The learner can report a repair issue in rental housing.",
    learnerTask_vi: "Đọc câu, nêu sự cố, và xin phản hồi bằng văn bản.",
    learnerTask_en: "Read the line, name the issue, and ask for a written response.",
    proofLine_pa: "ਹੀਟਿੰਗ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।",
    romanization: "heating kamm nahin kar rahi.",
    meaning_vi: "Máy sưởi không hoạt động.",
    meaning_en: "The heating is not working.",
    acceptableSupport_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਲਈ ਸਮਾਂ ਦੱਸੋ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਕੇ ਭੇਜੋ।"],
    ownerReviewCue_vi: "Chấp nhận nếu người học không biến câu này thành tư vấn luật thuê nhà.",
    ownerReviewCue_en: "Accept if the learner does not turn this into tenancy legal advice.",
    canadaPractical_vi: "Dùng với chủ nhà hoặc quản lý nhà thuê ở Canada.",
    canadaPractical_en: "Use with a landlord or rental property manager in Canada.",
    learnerTrap_vi: "ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ nói đồ vật không hoạt động.",
    learnerTrap_en: "ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ says that an item is not working.",
  },
  {
    id: "pa-ca-proof-transport-006",
    domain: "transport",
    use: "proof_pack",
    evidenceTarget_vi: "Người học có thể hỏi tuyến xe buýt và điểm xuống.",
    evidenceTarget_en: "The learner can ask about a bus route and getting off.",
    learnerTask_vi: "Đọc câu hỏi yes/no và thêm câu cần xuống ở đây.",
    learnerTask_en: "Read the yes/no question and add the line for needing to get off here.",
    proofLine_pa: "ਕੀ ਇਹ ਬੱਸ ਡਾਊਨਟਾਊਨ ਜਾਂਦੀ ਹੈ?",
    romanization: "ki ih bus downtown jandi hai?",
    meaning_vi: "Xe buýt này có đi trung tâm không?",
    meaning_en: "Does this bus go downtown?",
    acceptableSupport_pa: ["ਮੈਨੂੰ ਇੱਥੇ ਉਤਰਨਾ ਹੈ।", "ਮੈਂ ਰਸਤਾ ਭੁੱਲ ਗਿਆ/ਗਈ ਹਾਂ।"],
    ownerReviewCue_vi: "Chấp nhận nếu người học nhận ra ਕੀ mở câu hỏi.",
    ownerReviewCue_en: "Accept if the learner recognizes ਕੀ as opening a question.",
    canadaPractical_vi: "Hữu ích ở trạm xe buýt hoặc khi hỏi tài xế trong thành phố Canada.",
    canadaPractical_en: "Useful at a bus stop or when asking a driver in a Canadian city.",
    learnerTrap_vi: "ਡਾਊਨਟਾਊਨ là từ mượn nhưng vẫn đọc trong câu Gurmukhi.",
    learnerTrap_en: "ਡਾਊਨਟਾਊਨ is a loanword but still read it in the Gurmukhi sentence.",
  },
  {
    id: "pa-ca-proof-public-office-007",
    domain: "public_office",
    use: "final_owner_review",
    evidenceTarget_vi: "Người học có thể hỏi đúng quầy và giấy tờ ở cơ quan công.",
    evidenceTarget_en: "The learner can ask about the right counter and documents at a public office.",
    learnerTask_vi: "Đọc câu hỏi quầy rồi thêm câu hỏi giấy tờ.",
    learnerTask_en: "Read the counter question, then add the document question.",
    proofLine_pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ?",
    romanization: "mainu kis counter te jana chahida hai?",
    meaning_vi: "Tôi nên đến quầy nào?",
    meaning_en: "Which counter should I go to?",
    acceptableSupport_pa: ["ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?", "ਕਿਰਪਾ ਕਰਕੇ ਨੰਬਰ ਲਿਖ ਦਿਓ।"],
    ownerReviewCue_vi: "Tìm bằng chứng người học không tự đoán yêu cầu chính thức.",
    ownerReviewCue_en: "Look for evidence that the learner does not guess official requirements.",
    canadaPractical_vi: "Dùng ở trung tâm dịch vụ, thư viện, văn phòng thành phố, hoặc cơ quan công tại Canada.",
    canadaPractical_en: "Use at service centres, libraries, city offices, or public offices in Canada.",
    learnerTrap_vi: "ਦਸਤਾਵੇਜ਼ là giấy tờ; bài học không quyết định giấy tờ nào là bắt buộc.",
    learnerTrap_en: "ਦਸਤਾਵੇਜ਼ means documents; the lesson does not decide which documents are required.",
  },
  {
    id: "pa-ca-proof-forms-008",
    domain: "forms_service_desk",
    use: "final_qa",
    evidenceTarget_vi: "Người học có thể xin giúp ở quầy khi điền mẫu đơn.",
    evidenceTarget_en: "The learner can ask for service-desk help when filling out a form.",
    learnerTask_vi: "Đọc câu chính, chỉ phần chưa hiểu, và xin nhân viên chỉ lại.",
    learnerTask_en: "Read the main line, point to the unclear part, and ask staff to show it again.",
    proofLine_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    romanization: "mainu ih form bharan vich madad chahidi hai.",
    meaning_vi: "Tôi cần giúp điền mẫu đơn này.",
    meaning_en: "I need help filling out this form.",
    acceptableSupport_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਹਿੱਸਾ ਦਿਖਾਓ।", "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।"],
    ownerReviewCue_vi: "Chấp nhận nếu người học nêu rõ cần giúp phần nào.",
    ownerReviewCue_en: "Accept if the learner clearly identifies the part needing help.",
    canadaPractical_vi: "Câu này dùng ở quầy dịch vụ, trường, thư viện, hoặc văn phòng tiếp nhận Canada.",
    canadaPractical_en: "This line works at Canadian service desks, schools, libraries, or reception offices.",
    learnerTrap_vi: "Không chỉ đưa giấy im lặng; nói rõ yêu cầu.",
    learnerTrap_en: "Do not silently hand over the paper; state the request.",
  },
  {
    id: "pa-ca-proof-interpreter-009",
    domain: "interpreter_request",
    use: "final_owner_review",
    evidenceTarget_vi: "Người học biết yêu cầu thông dịch viên thay vì đoán.",
    evidenceTarget_en: "The learner knows to request an interpreter instead of guessing.",
    learnerTask_vi: "Đọc câu, nêu ngôn ngữ của mình, và nói chậm khi cần.",
    learnerTask_en: "Read the line, state their language, and ask for slow speech if needed.",
    proofLine_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ।",
    romanization: "mainu dubhashiye di lor hai.",
    meaning_vi: "Tôi cần thông dịch viên.",
    meaning_en: "I need an interpreter.",
    acceptableSupport_pa: ["ਮੈਂ ਅੰਗਰੇਜ਼ੀ/ਵਿਯਤਨਾਮੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ।", "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।"],
    ownerReviewCue_vi: "Tìm bằng chứng người học biết không đoán trong tình huống quan trọng.",
    ownerReviewCue_en: "Look for evidence that the learner knows not to guess in important situations.",
    canadaPractical_vi: "Dùng ở phòng khám, trường, cơ quan công, hoặc dịch vụ cộng đồng Canada.",
    canadaPractical_en: "Use at Canadian clinics, schools, public offices, or community services.",
    learnerTrap_vi: "ਦੁਭਾਸ਼ੀਆ là thông dịch viên, không phải khóa học.",
    learnerTrap_en: "ਦੁਭਾਸ਼ੀਆ means interpreter, not a class.",
  },
  {
    id: "pa-ca-proof-emergency-010",
    domain: "emergency_boundary",
    use: "final_owner_review",
    evidenceTarget_vi: "Người học biết ranh giới khẩn cấp và câu gọi 911.",
    evidenceTarget_en: "The learner knows the emergency boundary and the 911 line.",
    learnerTask_vi: "Đọc câu gọi 911 và nói không trì hoãn trong nguy hiểm.",
    learnerTask_en: "Read the 911 line and say not to delay in danger.",
    proofLine_pa: "ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    romanization: "kirpa karke nau-ikk-ikk te call karo.",
    meaning_vi: "Làm ơn gọi 911.",
    meaning_en: "Please call 911.",
    acceptableSupport_pa: ["ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ।", "ਮਦਦ ਕਰੋ!"],
    ownerReviewCue_vi: "Chấp nhận nếu người học chọn gọi trợ giúp thay vì luyện thêm.",
    ownerReviewCue_en: "Accept if the learner chooses getting help instead of more practice.",
    canadaPractical_vi: "Ở Canada, dùng khi cần trợ giúp khẩn cấp thật sự.",
    canadaPractical_en: "In Canada, use when real urgent help is needed.",
    learnerTrap_vi: "Bài học không thay thế dịch vụ khẩn cấp.",
    learnerTrap_en: "The lesson does not replace emergency services.",
  },
  {
    id: "pa-ca-proof-workplace-011",
    domain: "workplace_safety",
    use: "final_qa",
    evidenceTarget_vi: "Người học có thể hỏi lại về an toàn nơi làm việc.",
    evidenceTarget_en: "The learner can ask again about workplace safety.",
    learnerTask_vi: "Đọc câu hỏi quy tắc an toàn, nói chưa hiểu, và xin chỉ lại.",
    learnerTask_en: "Read the safety-rule question, say they did not understand, and ask to be shown again.",
    proofLine_pa: "ਸੁਰੱਖਿਆ ਨਿਯਮ ਕੀ ਹਨ?",
    romanization: "surakhia niyam ki han?",
    meaning_vi: "Quy tắc an toàn là gì?",
    meaning_en: "What are the safety rules?",
    acceptableSupport_pa: ["ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਦੁਬਾਰਾ ਦਿਖਾਓ।"],
    ownerReviewCue_vi: "Chấp nhận nếu người học không giả vờ hiểu trong tình huống an toàn.",
    ownerReviewCue_en: "Accept if the learner does not pretend to understand in a safety situation.",
    canadaPractical_vi: "Dùng với quản lý hoặc người hướng dẫn tại nơi làm việc ở Canada.",
    canadaPractical_en: "Use with a supervisor or trainer at a Canadian workplace.",
    learnerTrap_vi: "Không tiếp tục việc có rủi ro khi chưa hiểu hướng dẫn.",
    learnerTrap_en: "Do not continue risky work when instructions are unclear.",
  },
];

export default PUNJABI_CANADA_SURVIVAL_PROOF_PACK;
