// Punjabi Canada survival golden samples for Vietnamese-speaking and
// English-speaking learners.
//
// This is content readiness data only. It is not A11 integration.
// Gurmukhi is primary. Romanization is a bridge only. Shahmukhi is awareness
// only, not a full course. Native review is deferred.

export type PunjabiCanadaSurvivalGoldenDomain =
  | "clinic"
  | "pharmacy"
  | "school_childcare"
  | "bank"
  | "housing"
  | "transport"
  | "public_office"
  | "interpreter_request"
  | "emergency_boundary"
  | "service_desk"
  | "workplace_safety";

export type PunjabiCanadaSurvivalGoldenUse =
  | "golden_sample"
  | "final_qa"
  | "integration_readiness"
  | "remediation";

export type PunjabiCanadaSurvivalGoldenSample = {
  id: string;
  domain: PunjabiCanadaSurvivalGoldenDomain;
  use: PunjabiCanadaSurvivalGoldenUse;
  phrase_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  canada_context_vi: string;
  canada_context_en: string;
  final_qa_vi: string;
  final_qa_en: string;
  readiness_signal_vi: string;
  readiness_signal_en: string;
  boundary_vi: string;
  boundary_en: string;
  support_pa: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaSurvivalGoldenScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  readinessBoundary: string;
};

export const PUNJABI_CANADA_SURVIVAL_GOLDEN_SCOPE: PunjabiCanadaSurvivalGoldenScope = {
  name: "Punjabi Canada Survival Golden Samples",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  readinessBoundary:
    "Golden-sample, final-QA, and integration-readiness content for Canadian survival situations; not A11 integration, not legal advice, not medical advice, and not financial advice.",
};

export const PUNJABI_CANADA_SURVIVAL_GOLDEN_DOMAINS: PunjabiCanadaSurvivalGoldenDomain[] = [
  "clinic",
  "pharmacy",
  "school_childcare",
  "bank",
  "housing",
  "transport",
  "public_office",
  "interpreter_request",
  "emergency_boundary",
  "service_desk",
  "workplace_safety",
];

export const PUNJABI_CANADA_SURVIVAL_GOLDEN_SAMPLES: PunjabiCanadaSurvivalGoldenSample[] = [
  {
    id: "pa-ca-golden-clinic-001",
    domain: "clinic",
    use: "golden_sample",
    phrase_pa: "ਮੇਰੀ ਅੱਜ ਕਲਿਨਿਕ ਅਪਾਇੰਟਮੈਂਟ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਮੇਰਾ ਨਾਮ ਚੈੱਕ ਕਰੋ।",
    romanization: "meri ajj clinic appointment hai. kirpa karke mera nam check karo.",
    meaning_vi: "Hôm nay tôi có lịch hẹn ở clinic. Làm ơn kiểm tra tên tôi.",
    meaning_en: "I have a clinic appointment today. Please check my name.",
    canada_context_vi:
      "Ở Canada, dùng ở clinic desk trước khi đưa health card hoặc xác nhận appointment time.",
    canada_context_en:
      "In Canada, use at a clinic desk before showing a health card or confirming appointment time.",
    final_qa_vi: "Golden sample phải có người, nơi, việc cần làm, và lời xin nói chậm nếu cần.",
    final_qa_en: "A golden sample should include person, place, task, and a slow-speech request if needed.",
    readiness_signal_vi: "Learner sẵn sàng nếu có thể hỏi lại tên, giờ, phòng, và bước tiếp theo.",
    readiness_signal_en: "The learner is ready if they can recheck name, time, room, and next step.",
    boundary_vi: "Đây là câu giao tiếp tại clinic, không phải lời khuyên y tế.",
    boundary_en: "This is clinic communication, not medical advice.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।", "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?"],
    learner_trap_vi: "Đừng chỉ gật đầu nếu tên hoặc giờ hẹn nghe chưa rõ.",
    learner_trap_en: "Do not only nod if the name or appointment time is unclear.",
  },
  {
    id: "pa-ca-golden-pharmacy-002",
    domain: "pharmacy",
    use: "final_qa",
    phrase_pa: "ਮੈਨੂੰ ਇਹ ਦਵਾਈ ਲੈਣੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹਦਾਇਤਾਂ ਲਿਖ ਦਿਓ।",
    romanization: "mainu ih davai laini hai. kirpa karke hadaitan likh dio.",
    meaning_vi: "Tôi cần lấy thuốc này. Làm ơn viết hướng dẫn ra.",
    meaning_en: "I need to pick up this medicine. Please write the instructions down.",
    canada_context_vi:
      "Dùng tại pharmacy pickup counter khi hỏi label, refill, dị ứng, hoặc thời điểm uống thuốc.",
    canada_context_en:
      "Use at a pharmacy pickup counter when asking about the label, refill, allergy, or timing.",
    final_qa_vi: "Final QA cần xác nhận câu không tự đưa liều thuốc hoặc chẩn đoán.",
    final_qa_en: "Final QA should confirm the line does not provide dosage or diagnosis.",
    readiness_signal_vi: "Learner sẵn sàng nếu xin pharmacist viết số lần/ngày thay vì đoán.",
    readiness_signal_en: "The learner is ready if they ask the pharmacist to write times per day instead of guessing.",
    boundary_vi: "Không dùng sample để quyết định liều; xác nhận với pharmacist hoặc prescriber.",
    boundary_en: "Do not use the sample to decide dose; confirm with a pharmacist or prescriber.",
    support_pa: ["ਦਿਨ ਵਿੱਚ ਕਿੰਨੀ ਵਾਰ?", "ਮੈਨੂੰ ਐਲਰਜੀ ਹੈ।"],
    learner_trap_vi: "Đừng dùng trí nhớ thay cho nhãn thuốc hoặc hướng dẫn viết ra.",
    learner_trap_en: "Do not use memory instead of the label or written instructions.",
  },
  {
    id: "pa-ca-golden-school-childcare-003",
    domain: "school_childcare",
    use: "golden_sample",
    phrase_pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਅਧਿਆਪਕ ਨੂੰ ਦੱਸੋ।",
    romanization: "mera bacha ajj gairhazir hai. kirpa karke adhiapak nu dasso.",
    meaning_vi: "Hôm nay con tôi vắng mặt. Làm ơn báo giáo viên.",
    meaning_en: "My child is absent today. Please tell the teacher.",
    canada_context_vi:
      "Ở Canada, dùng qua school office, daycare pickup desk, attendance phone line, email, hoặc app.",
    canada_context_en:
      "In Canada, use through a school office, daycare pickup desk, attendance phone line, email, or app.",
    final_qa_vi: "Golden sample cần nêu child, date, reason hoặc action, và contact nếu cần.",
    final_qa_en: "A golden sample should name the child, date, reason or action, and contact if needed.",
    readiness_signal_vi: "Learner sẵn sàng nếu có thể thêm tên con và lớp/daycare room.",
    readiness_signal_en: "The learner is ready if they can add the child's name and class/daycare room.",
    boundary_vi: "Câu này chỉ hỗ trợ thông báo trường/daycare, không thay thế policy của trường.",
    boundary_en: "This only supports school/daycare notice, not school policy.",
    support_pa: ["ਬੱਚੇ ਦਾ ਨਾਮ ਇਹ ਹੈ।", "ਕਲਾਸ ਨੰਬਰ ਇਹ ਹੈ।"],
    learner_trap_vi: "Đừng chỉ nói 'my child' nếu office cần tên và lớp.",
    learner_trap_en: "Do not only say my child if the office needs name and class.",
  },
  {
    id: "pa-ca-golden-bank-004",
    domain: "bank",
    use: "final_qa",
    phrase_pa: "ਮੈਨੂੰ ਖਾਤੇ ਬਾਰੇ ਆਮ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ। ਫੀਸ ਕਿੰਨੀ ਹੈ?",
    romanization: "mainu khate bare aam jankari chahidi hai. fees kinni hai?",
    meaning_vi: "Tôi cần thông tin chung về tài khoản. Phí là bao nhiêu?",
    meaning_en: "I need general information about the account. How much is the fee?",
    canada_context_vi:
      "Dùng tại bank appointment hoặc counter khi hỏi monthly fee, debit card, ID cần mang, hoặc statement.",
    canada_context_en:
      "Use at a bank appointment or counter when asking about monthly fee, debit card, ID to bring, or statement.",
    final_qa_vi: "Final QA cần giữ câu ở mức thông tin chung, không khuyến nghị sản phẩm.",
    final_qa_en: "Final QA should keep the line at general information level, not product recommendation.",
    readiness_signal_vi: "Learner sẵn sàng nếu xin phí và điều kiện viết ra để review sau.",
    readiness_signal_en: "The learner is ready if they ask for fees and conditions in writing for later review.",
    boundary_vi: "Câu này không phải tư vấn tài chính.",
    boundary_en: "This is not financial advice.",
    support_pa: ["ਕੀ ਤੁਸੀਂ ਇਹ ਲਿਖ ਸਕਦੇ ਹੋ?", "ਮੈਨੂੰ ਸੋਚਣ ਲਈ ਸਮਾਂ ਚਾਹੀਦਾ ਹੈ।"],
    learner_trap_vi: "Đừng coi câu trả lời về fee là lời khuyên chọn sản phẩm.",
    learner_trap_en: "Do not treat fee information as advice to choose a product.",
  },
  {
    id: "pa-ca-golden-housing-005",
    domain: "housing",
    use: "integration_readiness",
    phrase_pa: "ਮੇਰੇ ਯੂਨਿਟ ਵਿੱਚ ਮੁਰੰਮਤ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਸਮਾਂ ਲਿਖ ਦਿਓ।",
    romanization: "mere unit vich murammat di lor hai. kirpa karke sama likh dio.",
    meaning_vi: "Unit của tôi cần sửa chữa. Làm ơn viết thời gian ra.",
    meaning_en: "My unit needs a repair. Please write down the time.",
    canada_context_vi:
      "Dùng với landlord, property manager, maintenance line, hoặc rental office ở Canada.",
    canada_context_en:
      "Use with a landlord, property manager, maintenance line, or rental office in Canada.",
    final_qa_vi: "Integration-readiness cần có unit, issue, access time, và written confirmation.",
    final_qa_en: "Integration-readiness needs unit, issue, access time, and written confirmation.",
    readiness_signal_vi: "Learner sẵn sàng nếu nêu được unit number và không bỏ qua safety issue.",
    readiness_signal_en: "The learner is ready if they can state the unit number and do not skip a safety issue.",
    boundary_vi: "Câu này hỗ trợ báo sửa chữa, không phải tư vấn quyền thuê nhà.",
    boundary_en: "This supports repair reporting, not tenancy rights advice.",
    support_pa: ["ਯੂਨਿਟ ਨੰਬਰ ਇਹ ਹੈ।", "ਸਮੱਸਿਆ ਤੁਰੰਤ ਹੈ।"],
    learner_trap_vi: "Đừng nói 'home problem' mà không nêu loại vấn đề hoặc unit.",
    learner_trap_en: "Do not say home problem without naming the issue or unit.",
  },
  {
    id: "pa-ca-golden-transport-006",
    domain: "transport",
    use: "remediation",
    phrase_pa: "ਇਸ ਪਤੇ ਲਈ ਕਿਹੜੀ ਬੱਸ ਲੈਣੀ ਹੈ? ਕੀ ਮੈਨੂੰ ਟ੍ਰਾਂਸਫਰ ਕਰਨਾ ਪਵੇਗਾ?",
    romanization: "is pate lai kihri bus laini hai? ki mainu transfer karna pavega?",
    meaning_vi: "Tôi nên đi xe bus nào tới địa chỉ này? Tôi có cần transfer không?",
    meaning_en: "Which bus should I take for this address? Do I need to transfer?",
    canada_context_vi:
      "Dùng khi đi clinic, school, work, public office, rental viewing, hoặc service desk bằng transit.",
    canada_context_en:
      "Use when going to a clinic, school, work, public office, rental viewing, or service desk by transit.",
    final_qa_vi: "Remediation sample cần giúp learner hỏi route, direction, transfer, và delay.",
    final_qa_en: "A remediation sample should help the learner ask route, direction, transfer, and delay.",
    readiness_signal_vi: "Learner sẵn sàng nếu không chỉ ghi bus number mà còn xác nhận direction.",
    readiness_signal_en: "The learner is ready if they do not only note the bus number but also confirm direction.",
    boundary_vi: "Câu này chỉ hỗ trợ điều hướng transit, không đảm bảo schedule.",
    boundary_en: "This only supports transit navigation, not schedule guarantees.",
    support_pa: ["ਬੱਸ ਦੇਰ ਨਾਲ ਆ ਰਹੀ ਹੈ।", "ਮੈਂ ਅਪਾਇੰਟਮੈਂਟ ਲਈ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ/ਆਵਾਂਗੀ।"],
    learner_trap_vi: "Đừng quên báo trễ appointment nếu transit bị delay.",
    learner_trap_en: "Do not forget to report appointment delay if transit is delayed.",
  },
  {
    id: "pa-ca-golden-public-office-007",
    domain: "public_office",
    use: "golden_sample",
    phrase_pa: "ਮੈਨੂੰ ਕਿਹੜੇ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਹੈ? ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?",
    romanization: "mainu kihre counter te jana hai? agla kadam ki hai?",
    meaning_vi: "Tôi cần đi quầy nào? Bước tiếp theo là gì?",
    meaning_en: "Which counter should I go to? What is the next step?",
    canada_context_vi:
      "Dùng tại service centre, library desk, newcomer office, government-style counter, hoặc community service desk.",
    canada_context_en:
      "Use at a service centre, library desk, newcomer office, government-style counter, or community service desk.",
    final_qa_vi: "Golden sample cần hỏi counter, documents, waiting process, và next step.",
    final_qa_en: "A golden sample should ask counter, documents, waiting process, and next step.",
    readiness_signal_vi: "Learner sẵn sàng nếu xin staff viết checklist thay vì tự đoán.",
    readiness_signal_en: "The learner is ready if they ask staff to write a checklist instead of guessing.",
    boundary_vi: "Câu này hỏi quy trình, không phải lời khuyên pháp lý hoặc eligibility.",
    boundary_en: "This asks process, not legal advice or eligibility advice.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਸੂਚੀ ਲਿਖ ਦਿਓ।", "ਮੇਰਾ ਨੰਬਰ ਕਦੋਂ ਬੁਲਾਇਆ ਜਾਵੇਗਾ?"],
    learner_trap_vi: "Đừng rời counter nếu chưa biết bước tiếp theo.",
    learner_trap_en: "Do not leave the counter if the next step is unclear.",
  },
  {
    id: "pa-ca-golden-interpreter-008",
    domain: "interpreter_request",
    use: "integration_readiness",
    phrase_pa: "ਮੈਨੂੰ ਪੰਜਾਬੀ ਦੁਭਾਸ਼ੀਆ ਚਾਹੀਦਾ ਹੈ। ਇਹ ਫਾਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ।",
    romanization: "mainu Punjabi dubhashia chahida hai. ih form mahatvapuran hai.",
    meaning_vi: "Tôi cần thông dịch viên tiếng Punjabi. Form này quan trọng.",
    meaning_en: "I need a Punjabi interpreter. This form is important.",
    canada_context_vi:
      "Dùng ở clinic, hospital desk, public office, school, housing service, hoặc service desk khi thông tin quan trọng.",
    canada_context_en:
      "Use at a clinic, hospital desk, public office, school, housing service, or service desk when information is important.",
    final_qa_vi: "Integration-readiness cần tách request interpreter khỏi quyết định chuyên môn.",
    final_qa_en: "Integration-readiness must separate interpreter request from professional decisions.",
    readiness_signal_vi: "Learner sẵn sàng nếu xin interpreter trước khi ký hoặc đồng ý điều gì chưa rõ.",
    readiness_signal_en: "The learner is ready if they ask for an interpreter before signing or agreeing to unclear content.",
    boundary_vi: "Interpreter hỗ trợ ngôn ngữ; quyết định chuyên môn thuộc về staff phù hợp.",
    boundary_en: "An interpreter supports language; professional decisions belong to appropriate staff.",
    support_pa: ["ਕੀ ਦੁਭਾਸ਼ੀਆ ਹੁਣ ਮਿਲ ਸਕਦਾ ਹੈ?", "ਮੈਂ ਬਿਨਾਂ ਸਮਝੇ ਸਾਈਨ ਨਹੀਂ ਕਰਾਂਗਾ/ਕਰਾਂਗੀ।"],
    learner_trap_vi: "Đừng ký chỉ vì câu nói nghe lịch sự nhưng bạn chưa hiểu.",
    learner_trap_en: "Do not sign only because the wording sounds polite if you do not understand.",
  },
  {
    id: "pa-ca-golden-emergency-009",
    domain: "emergency_boundary",
    use: "final_qa",
    phrase_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਮੈਨੂੰ ਹੁਣੇ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    romanization: "ih emergency hai. mainu hune madad chahidi hai.",
    meaning_vi: "Đây là tình huống khẩn cấp. Tôi cần giúp ngay.",
    meaning_en: "This is an emergency. I need help now.",
    canada_context_vi:
      "Ở Canada, dùng khi có nguy hiểm tức thời; ở nhiều nơi có thể gọi 911 cho emergency.",
    canada_context_en:
      "In Canada, use when there is immediate danger; in many places 911 can be used for emergency.",
    final_qa_vi: "Final QA cần có immediate need, location, service type, và interpreter request nếu cần.",
    final_qa_en: "Final QA needs immediate need, location, service type, and interpreter request if needed.",
    readiness_signal_vi: "Learner sẵn sàng nếu nói vị trí trước khi kể chi tiết dài.",
    readiness_signal_en: "The learner is ready if they give location before a long explanation.",
    boundary_vi: "Pack này không thay thế dịch vụ khẩn cấp hoặc lời khuyên y tế/pháp lý.",
    boundary_en: "This pack does not replace emergency services or medical/legal advice.",
    support_pa: ["ਮੇਰਾ ਪਤਾ ਇਹ ਹੈ।", "ਮੈਨੂੰ ਪੰਜਾਬੀ ਦੁਭਾਸ਼ੀਆ ਚਾਹੀਦਾ ਹੈ।"],
    learner_trap_vi: "Đừng cúp máy khi chưa được bảo nếu đang gọi emergency.",
    learner_trap_en: "Do not hang up until told if calling emergency.",
  },
  {
    id: "pa-ca-golden-service-desk-010",
    domain: "service_desk",
    use: "golden_sample",
    phrase_pa: "ਮੇਰਾ ਸਰਵਿਸ ਨੰਬਰ ਇਹ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਸਥਿਤੀ ਚੈੱਕ ਕਰੋ।",
    romanization: "mera service number ih hai. kirpa karke sthiti check karo.",
    meaning_vi: "Đây là service number của tôi. Làm ơn kiểm tra tình trạng.",
    meaning_en: "This is my service number. Please check the status.",
    canada_context_vi:
      "Dùng tại service desk khi follow-up application, ticket, appointment, missing paper, hoặc correction request.",
    canada_context_en:
      "Use at a service desk when following up on an application, ticket, appointment, missing paper, or correction request.",
    final_qa_vi: "Golden sample cần có service number, submission date, và polite next-step request.",
    final_qa_en: "A golden sample needs service number, submission date, and polite next-step request.",
    readiness_signal_vi: "Learner sẵn sàng nếu giữ reference number và hỏi timeframe một cách lịch sự.",
    readiness_signal_en: "The learner is ready if they keep the reference number and ask timeframe politely.",
    boundary_vi: "Status check không đảm bảo kết quả hồ sơ hoặc quyền lợi.",
    boundary_en: "A status check does not guarantee file outcome or entitlement.",
    support_pa: ["ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", "ਮੈਂ ਕਦੋਂ ਦੁਬਾਰਾ ਪੁੱਛ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?"],
    learner_trap_vi: "Đừng follow-up mà không ghi ngày nộp và reference number nếu có.",
    learner_trap_en: "Do not follow up without recording submission date and reference number if available.",
  },
  {
    id: "pa-ca-golden-workplace-011",
    domain: "workplace_safety",
    use: "remediation",
    phrase_pa: "ਕੰਮ ਤੇ ਸੁਰੱਖਿਆ ਦੀ ਸਮੱਸਿਆ ਹੈ। ਮੈਨੂੰ ਸੁਪਰਵਾਈਜ਼ਰ ਨਾਲ ਗੱਲ ਕਰਨੀ ਹੈ।",
    romanization: "kamm te surakhia di samassia hai. mainu supervisor nal gall karni hai.",
    meaning_vi: "Có vấn đề an toàn ở nơi làm việc. Tôi cần nói với supervisor.",
    meaning_en: "There is a safety issue at work. I need to speak with a supervisor.",
    canada_context_vi:
      "Ở Canada, dùng khi PPE thiếu, khu vực không an toàn, injury, near miss, hoặc cần first aid.",
    canada_context_en:
      "In Canada, use when PPE is missing, an area is unsafe, there is injury, near miss, or first aid is needed.",
    final_qa_vi: "Remediation sample cần nêu safety issue, person to contact, and written next step.",
    final_qa_en: "A remediation sample needs the safety issue, person to contact, and written next step.",
    readiness_signal_vi: "Learner sẵn sàng nếu báo unsafe work bằng câu ngắn thay vì im lặng.",
    readiness_signal_en: "The learner is ready if they report unsafe work with a short line instead of staying silent.",
    boundary_vi: "Câu này hỗ trợ báo cáo an toàn, không phải tư vấn pháp lý hoặc claim.",
    boundary_en: "This supports safety reporting, not legal advice or claim guidance.",
    support_pa: ["ਫਸਟ ਏਡ ਕਿੱਥੇ ਹੈ?", "ਕਿਰਪਾ ਕਰਕੇ ਰਿਪੋਰਟ ਦਾ ਕਦਮ ਲਿਖ ਦਿਓ।"],
    learner_trap_vi: "Đừng tiếp tục công việc nếu bạn không hiểu hướng dẫn an toàn quan trọng.",
    learner_trap_en: "Do not continue work if you do not understand important safety instructions.",
  },
];

export default PUNJABI_CANADA_SURVIVAL_GOLDEN_SAMPLES;
