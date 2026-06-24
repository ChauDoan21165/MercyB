// Punjabi Canada emergency-boundary pack for Vietnamese-speaking and
// English-speaking learners.
//
// This is content readiness data only. It is not A11 integration.
// Gurmukhi is primary. Romanization is a bridge only. Shahmukhi is awareness
// only, not a full course. Native review is deferred.

export type PunjabiCanadaEmergencyBoundaryDomain =
  | "interpreter_request"
  | "urgent_vs_non_urgent"
  | "immediate_need"
  | "workplace_injury"
  | "housing_emergency"
  | "clinic_boundary"
  | "pharmacy_boundary"
  | "call_911_boundary"
  | "safety_disclaimer"
  | "review_remediation";

export type PunjabiCanadaEmergencyBoundaryLevel =
  | "first_words"
  | "clarify"
  | "handoff"
  | "boundary";

export type PunjabiCanadaEmergencyBoundaryItem = {
  id: string;
  domain: PunjabiCanadaEmergencyBoundaryDomain;
  level: PunjabiCanadaEmergencyBoundaryLevel;
  phrase_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  canada_context_vi: string;
  canada_context_en: string;
  boundary_vi: string;
  boundary_en: string;
  next_step_vi: string;
  next_step_en: string;
  support_pa: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaEmergencyBoundaryScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  safetyBoundary: string;
};

export const PUNJABI_CANADA_EMERGENCY_BOUNDARY_SCOPE: PunjabiCanadaEmergencyBoundaryScope = {
  name: "Punjabi Canada Emergency Boundary Pack",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  safetyBoundary:
    "Emergency-boundary communication for Canada: ask for an interpreter, name urgent or non-urgent need, describe immediate safety needs, and hand off to trained staff; not legal advice, not medical advice, and not workplace or housing rights advice.",
};

export const PUNJABI_CANADA_EMERGENCY_BOUNDARY_DOMAINS: PunjabiCanadaEmergencyBoundaryDomain[] = [
  "interpreter_request",
  "urgent_vs_non_urgent",
  "immediate_need",
  "workplace_injury",
  "housing_emergency",
  "clinic_boundary",
  "pharmacy_boundary",
  "call_911_boundary",
  "safety_disclaimer",
  "review_remediation",
];

export const PUNJABI_CANADA_EMERGENCY_BOUNDARY_PACK: PunjabiCanadaEmergencyBoundaryItem[] = [
  {
    id: "pa-ca-emergency-boundary-interpreter-001",
    domain: "interpreter_request",
    level: "first_words",
    phrase_pa: "ਮੈਨੂੰ ਪੰਜਾਬੀ ਦੁਭਾਸ਼ੀਆ ਚਾਹੀਦਾ ਹੈ। ਇਹ ਜ਼ਰੂਰੀ ਗੱਲ ਹੈ।",
    romanization: "mainu Punjabi dubhashia chahida hai. ih zaruri gall hai.",
    meaning_vi: "Tôi cần thông dịch viên tiếng Punjabi. Đây là việc quan trọng.",
    meaning_en: "I need a Punjabi interpreter. This is important.",
    canada_context_vi:
      "Ở Canada, dùng tại clinic, hospital desk, pharmacy, public office, school office, hoặc workplace reporting desk.",
    canada_context_en:
      "In Canada, use at a clinic, hospital desk, pharmacy, public office, school office, or workplace reporting desk.",
    boundary_vi:
      "Câu này chỉ yêu cầu hỗ trợ ngôn ngữ; không thay thế lời giải thích chuyên môn của nhân viên.",
    boundary_en:
      "This only requests language support; it does not replace explanations from trained staff.",
    next_step_vi: "Sau đó nói bạn có cần ngay bây giờ hay có thể đợi appointment.",
    next_step_en: "Then say whether you need help now or can wait for an appointment.",
    support_pa: ["ਕੀ ਦੁਭਾਸ਼ੀਆ ਹੁਣ ਮਿਲ ਸਕਦਾ ਹੈ?", "ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੀ ਗੱਲ ਲਿਖੋ।"],
    learner_trap_vi: "Đừng nói yes nếu bạn chưa hiểu nội dung nguy cơ hoặc giấy tờ.",
    learner_trap_en: "Do not say yes if you did not understand the risk or paperwork.",
  },
  {
    id: "pa-ca-emergency-boundary-urgent-002",
    domain: "urgent_vs_non_urgent",
    level: "clarify",
    phrase_pa: "ਇਹ ਬਹੁਤ ਜ਼ਰੂਰੀ ਹੈ। ਇਹ ਆਮ ਸਵਾਲ ਨਹੀਂ ਹੈ।",
    romanization: "ih bahut zaruri hai. ih aam sawal nahi hai.",
    meaning_vi: "Việc này rất khẩn cấp. Đây không phải câu hỏi thông thường.",
    meaning_en: "This is very urgent. This is not a regular question.",
    canada_context_vi:
      "Dùng khi bạn cần nhân viên phân loại mức độ ưu tiên ở clinic, pharmacy, housing desk, hoặc workplace.",
    canada_context_en:
      "Use when staff need to triage priority at a clinic, pharmacy, housing desk, or workplace.",
    boundary_vi: "Không dùng câu luyện này để tự chẩn đoán; hãy để nhân viên đánh giá mức khẩn cấp.",
    boundary_en: "Do not use this practice line to self-diagnose; let staff assess urgency.",
    next_step_vi: "Nói ngắn gọn: ai bị ảnh hưởng, chuyện gì xảy ra, đang ở đâu.",
    next_step_en: "Briefly say who is affected, what happened, and where you are.",
    support_pa: ["ਹੁਣੇ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", "ਇਹ ਜ਼ਰੂਰੀ ਨਹੀਂ ਹੈ, ਪਰ ਮੈਨੂੰ ਸਲਾਹ ਚਾਹੀਦੀ ਹੈ।"],
    learner_trap_vi: "Đừng dùng 'urgent' cho mọi việc; nếu không khẩn, nói rõ là non-urgent.",
    learner_trap_en: "Do not use urgent for everything; if it is not urgent, say it is non-urgent.",
  },
  {
    id: "pa-ca-emergency-boundary-need-003",
    domain: "immediate_need",
    level: "first_words",
    phrase_pa: "ਮੈਨੂੰ ਹੁਣੇ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਮੈਂ ਸੁਰੱਖਿਅਤ ਨਹੀਂ ਹਾਂ।",
    romanization: "mainu hune madad chahidi hai. main surakhiat nahi han.",
    meaning_vi: "Tôi cần giúp ngay bây giờ. Tôi không an toàn.",
    meaning_en: "I need help now. I am not safe.",
    canada_context_vi:
      "Dùng khi có nguy cơ tức thời ở public place, transit, housing, workplace, hoặc khi gọi dịch vụ khẩn cấp.",
    canada_context_en:
      "Use when there is immediate risk in a public place, transit, housing, workplace, or when calling emergency services.",
    boundary_vi: "Nếu có nguy hiểm ngay lập tức ở Canada, hãy dùng số khẩn cấp địa phương như 911.",
    boundary_en: "If there is immediate danger in Canada, use local emergency numbers such as 911.",
    next_step_vi: "Nói địa chỉ, landmark, số điện thoại, và bạn có cần interpreter không.",
    next_step_en: "Give the address, landmark, phone number, and whether you need an interpreter.",
    support_pa: ["ਮੇਰਾ ਪਤਾ ਇਹ ਹੈ।", "ਮੈਂ ਫੋਨ ਤੇ ਰਹਾਂਗਾ/ਰਹਾਂਗੀ।"],
    learner_trap_vi: "Đừng kể chuyện dài trước khi nói vị trí nếu đang nguy hiểm.",
    learner_trap_en: "Do not give a long story before your location when you are in danger.",
  },
  {
    id: "pa-ca-emergency-boundary-workplace-004",
    domain: "workplace_injury",
    level: "handoff",
    phrase_pa: "ਕੰਮ ਤੇ ਮੈਨੂੰ ਚੋਟ ਲੱਗੀ ਹੈ। ਮੈਨੂੰ ਸੁਰੱਖਿਅਤ ਥਾਂ ਤੇ ਜਾਣਾ ਹੈ।",
    romanization: "kamm te mainu chot laggi hai. mainu surakhiat than te jana hai.",
    meaning_vi: "Tôi bị thương ở nơi làm việc. Tôi cần đến chỗ an toàn.",
    meaning_en: "I was injured at work. I need to go to a safe place.",
    canada_context_vi:
      "Ở Canada, dùng với supervisor, first aid attendant, security, hoặc reception khi báo workplace injury.",
    canada_context_en:
      "In Canada, use with a supervisor, first aid attendant, security, or reception when reporting a workplace injury.",
    boundary_vi: "Câu này giúp báo sự cố; không phải tư vấn pháp lý hoặc hướng dẫn claim.",
    boundary_en: "This helps report an incident; it is not legal advice or claim guidance.",
    next_step_vi: "Xin first aid, ghi thời gian xảy ra, và hỏi bước báo cáo tiếp theo bằng văn bản.",
    next_step_en: "Ask for first aid, note the time, and ask for the next reporting step in writing.",
    support_pa: ["ਫਸਟ ਏਡ ਕਿੱਥੇ ਹੈ?", "ਕਿਰਪਾ ਕਰਕੇ ਰਿਪੋਰਟ ਦਾ ਕਦਮ ਲਿਖ ਦਿਓ।"],
    learner_trap_vi: "Đừng tiếp tục làm việc nếu bạn không an toàn hoặc cần first aid.",
    learner_trap_en: "Do not keep working if you are unsafe or need first aid.",
  },
  {
    id: "pa-ca-emergency-boundary-housing-005",
    domain: "housing_emergency",
    level: "handoff",
    phrase_pa: "ਮੇਰੇ ਘਰ ਵਿੱਚ ਤੁਰੰਤ ਸਮੱਸਿਆ ਹੈ। ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ।",
    romanization: "mere ghar vich turant samassia hai. pani leak ho riha hai.",
    meaning_vi: "Nhà tôi có vấn đề khẩn cấp. Nước đang rò rỉ.",
    meaning_en: "There is an urgent problem in my home. Water is leaking.",
    canada_context_vi:
      "Dùng với landlord, building manager, maintenance line, hoặc condo/rental emergency number ở Canada.",
    canada_context_en:
      "Use with a landlord, building manager, maintenance line, or condo/rental emergency number in Canada.",
    boundary_vi: "Giữ nội dung ở mức báo nguy cơ an toàn; không phải tư vấn quyền thuê nhà.",
    boundary_en: "Keep this at safety-risk reporting level; it is not tenancy rights advice.",
    next_step_vi: "Đưa unit number, address, ảnh nếu được yêu cầu, và xin thời gian phản hồi.",
    next_step_en: "Give the unit number, address, photos if requested, and ask for response time.",
    support_pa: ["ਯੂਨਿਟ ਨੰਬਰ ਇਹ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਕਦੋਂ ਆਓਗੇ ਲਿਖ ਦਿਓ।"],
    learner_trap_vi: "Đừng chỉ nói 'problem' mà không nêu loại nguy cơ như nước, điện, khóa, khói.",
    learner_trap_en: "Do not only say problem without naming the risk, such as water, electricity, lock, or smoke.",
  },
  {
    id: "pa-ca-emergency-boundary-clinic-006",
    domain: "clinic_boundary",
    level: "boundary",
    phrase_pa: "ਮੈਨੂੰ ਡਾਕਟਰੀ ਸਲਾਹ ਚਾਹੀਦੀ ਹੈ। ਮੈਂ ਸਿਰਫ਼ ਅਨੁਵਾਦ ਦਾ ਅਭਿਆਸ ਕਰ ਰਿਹਾ/ਰਹੀ ਹਾਂ।",
    romanization: "mainu doktari salah chahidi hai. main siraf anuvad da abhyas kar riha/rahi han.",
    meaning_vi: "Tôi cần lời giải thích y tế từ nhân viên y tế. Tôi chỉ đang luyện giao tiếp.",
    meaning_en: "I need medical guidance from medical staff. I am only practicing communication.",
    canada_context_vi:
      "Dùng để tách câu luyện khỏi quyết định sức khỏe tại clinic, walk-in clinic, hoặc hospital desk.",
    canada_context_en:
      "Use to separate practice language from health decisions at a clinic, walk-in clinic, or hospital desk.",
    boundary_vi: "Không tự dùng câu trong pack này để quyết định điều trị hoặc trì hoãn chăm sóc.",
    boundary_en: "Do not use lines in this pack to decide treatment or delay care.",
    next_step_vi: "Xin clinician hoặc nurse giải thích lại bằng từ đơn giản và viết bước tiếp theo.",
    next_step_en: "Ask the clinician or nurse to explain again in simple words and write the next step.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਆਸਾਨ ਸ਼ਬਦਾਂ ਵਿੱਚ ਸਮਝਾਓ।", "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?"],
    learner_trap_vi: "Đừng dịch sai triệu chứng vì ngại hỏi lại.",
    learner_trap_en: "Do not misstate symptoms because you are embarrassed to ask again.",
  },
  {
    id: "pa-ca-emergency-boundary-pharmacy-007",
    domain: "pharmacy_boundary",
    level: "boundary",
    phrase_pa: "ਮੈਨੂੰ ਦਵਾਈ ਬਾਰੇ ਫਾਰਮਾਸਿਸਟ ਨਾਲ ਗੱਲ ਕਰਨੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਖੁਰਾਕ ਲਿਖ ਦਿਓ।",
    romanization: "mainu davai bare pharmacist nal gall karni hai. kirpa karke khurak likh dio.",
    meaning_vi: "Tôi cần nói với pharmacist về thuốc. Làm ơn viết liều dùng ra.",
    meaning_en: "I need to speak with the pharmacist about the medicine. Please write the dose down.",
    canada_context_vi:
      "Ở Canada, dùng khi pickup thuốc, hỏi dị ứng, side effects, refill, hoặc chỉ dẫn trên nhãn.",
    canada_context_en:
      "In Canada, use when picking up medicine, asking about allergies, side effects, refills, or label instructions.",
    boundary_vi: "Pack này không đưa lời khuyên về liều; hãy xác nhận với pharmacist hoặc prescriber.",
    boundary_en: "This pack does not give dosing advice; confirm with a pharmacist or prescriber.",
    next_step_vi: "Yêu cầu written instructions và nói rõ nếu bạn chưa hiểu số lần/ngày.",
    next_step_en: "Ask for written instructions and state if times per day are unclear.",
    support_pa: ["ਮੈਨੂੰ ਐਲਰਜੀ ਹੈ।", "ਦਿਨ ਵਿੱਚ ਕਿੰਨੀ ਵਾਰ?"],
    learner_trap_vi: "Đừng đoán liều từ trí nhớ nếu nhãn hoặc lời nói chưa rõ.",
    learner_trap_en: "Do not guess the dose from memory if the label or speech was unclear.",
  },
  {
    id: "pa-ca-emergency-boundary-911-008",
    domain: "call_911_boundary",
    level: "boundary",
    phrase_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਮੈਨੂੰ ਐਂਬੂਲੈਂਸ, ਪੁਲਿਸ, ਜਾਂ ਫਾਇਰ ਦੀ ਲੋੜ ਹੈ।",
    romanization: "ih emergency hai. mainu ambulance, police, ja fire di lor hai.",
    meaning_vi: "Đây là tình huống khẩn cấp. Tôi cần ambulance, police, hoặc fire.",
    meaning_en: "This is an emergency. I need an ambulance, police, or fire.",
    canada_context_vi:
      "Ở nhiều nơi tại Canada, 911 là số khẩn cấp cho nguy hiểm tức thời, cháy, thương tích nặng, hoặc bạo lực.",
    canada_context_en:
      "In many places in Canada, 911 is the emergency number for immediate danger, fire, serious injury, or violence.",
    boundary_vi: "Nếu không chắc số tại địa phương, tìm số khẩn cấp chính thức; pack này không thay thế dịch vụ khẩn cấp.",
    boundary_en:
      "If unsure about the local number, find the official emergency number; this pack does not replace emergency services.",
    next_step_vi: "Nói loại dịch vụ cần, địa chỉ, cross street, và ngôn ngữ bạn cần.",
    next_step_en: "Say the service needed, address, cross street, and language you need.",
    support_pa: ["ਮੈਨੂੰ ਪੰਜਾਬੀ ਦੁਭਾਸ਼ੀਆ ਚਾਹੀਦਾ ਹੈ।", "ਮੇਰਾ ਪਤਾ ਇਹ ਹੈ।"],
    learner_trap_vi: "Đừng cúp máy khi chưa được bảo; ở lại line nếu an toàn.",
    learner_trap_en: "Do not hang up until told; stay on the line if it is safe.",
  },
  {
    id: "pa-ca-emergency-boundary-disclaimer-009",
    domain: "safety_disclaimer",
    level: "boundary",
    phrase_pa: "ਇਹ ਸਿਰਫ਼ ਭਾਸ਼ਾ ਦੀ ਮਦਦ ਹੈ। ਫੈਸਲਾ ਮਾਹਿਰ ਕਰੇਗਾ।",
    romanization: "ih siraf bhasha di madad hai. faisla mahir karega.",
    meaning_vi: "Đây chỉ là hỗ trợ ngôn ngữ. Quyết định thuộc về người có chuyên môn.",
    meaning_en: "This is only language support. The decision belongs to a qualified professional.",
    canada_context_vi:
      "Dùng trong review lesson để nhắc learner không xem câu mẫu là lời khuyên y tế, pháp lý, tài chính, hoặc tenancy.",
    canada_context_en:
      "Use in review lessons to remind learners not to treat sample lines as medical, legal, financial, or tenancy advice.",
    boundary_vi: "Mục tiêu là nói rõ nhu cầu và chuyển tiếp tới nhân viên phù hợp.",
    boundary_en: "The goal is to state the need clearly and hand off to the appropriate staff.",
    next_step_vi: "Khi nội dung có rủi ro cao, xin interpreter và xin bước tiếp theo bằng văn bản.",
    next_step_en: "When content is high risk, ask for an interpreter and the next step in writing.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਮਾਹਿਰ ਨੂੰ ਬੁਲਾਓ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    learner_trap_vi: "Đừng biến câu học thành quyết định chuyên môn.",
    learner_trap_en: "Do not turn a learning sentence into a professional decision.",
  },
  {
    id: "pa-ca-emergency-boundary-review-010",
    domain: "review_remediation",
    level: "handoff",
    phrase_pa: "ਮੈਂ ਦੁਬਾਰਾ ਕਹਿੰਦਾ/ਕਹਿੰਦੀ ਹਾਂ: ਮੈਨੂੰ ਹੁਣੇ ਮਦਦ, ਦੁਭਾਸ਼ੀਆ, ਅਤੇ ਅਗਲਾ ਕਦਮ ਚਾਹੀਦਾ ਹੈ।",
    romanization:
      "main dubara kahinda/kahindi han: mainu hune madad, dubhashia, ate agla kadam chahida hai.",
    meaning_vi:
      "Tôi nói lại: tôi cần giúp ngay, thông dịch viên, và bước tiếp theo.",
    meaning_en: "I will say it again: I need help now, an interpreter, and the next step.",
    canada_context_vi:
      "Dùng trong remediation khi learner bị đứng hình ở clinic, pharmacy, housing, transit, public office, hoặc workplace.",
    canada_context_en:
      "Use in remediation when a learner freezes at a clinic, pharmacy, housing, transit, public office, or workplace.",
    boundary_vi: "Đây là câu review để lấy lại quyền giao tiếp, không phải kết luận chuyên môn.",
    boundary_en: "This is a review line to regain communication, not a professional conclusion.",
    next_step_vi: "Sau câu này, chọn một chi tiết: vị trí, vấn đề, người bị ảnh hưởng, hoặc giấy tờ cần viết.",
    next_step_en: "After this line, choose one detail: location, problem, affected person, or written document needed.",
    support_pa: ["ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।", "ਕੀ ਤੁਸੀਂ ਹੌਲੀ ਹੌਲੀ ਬੋਲ ਸਕਦੇ ਹੋ?"],
    learner_trap_vi: "Đừng im lặng khi không hiểu; dùng câu repair trước khi ký hoặc đồng ý.",
    learner_trap_en: "Do not stay silent when unclear; use a repair line before signing or agreeing.",
  },
];

export default PUNJABI_CANADA_EMERGENCY_BOUNDARY_PACK;
