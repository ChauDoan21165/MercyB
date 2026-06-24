// Punjabi Canada survival pre-merge samples for Vietnamese-speaking and
// English-speaking learners.
//
// This is content readiness data only. It is not A11 integration.
// Gurmukhi is primary. Romanization is a bridge only. Shahmukhi is awareness
// only, not a full course. Native review is deferred.

export type PunjabiCanadaSurvivalPreMergeDomain =
  | "clinic"
  | "pharmacy"
  | "school_childcare"
  | "bank"
  | "housing"
  | "transport"
  | "public_office"
  | "forms"
  | "interpreter_request"
  | "emergency_boundary"
  | "service_recovery"
  | "workplace_safety";

export type PunjabiCanadaSurvivalPreMergeCheck =
  | "pre_merge"
  | "pre_a11_checksum"
  | "runner_readiness"
  | "pre_integration";

export type PunjabiCanadaSurvivalPreMergeSample = {
  id: string;
  domain: PunjabiCanadaSurvivalPreMergeDomain;
  check: PunjabiCanadaSurvivalPreMergeCheck;
  phrase_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  canada_context_vi: string;
  canada_context_en: string;
  pre_merge_note_vi: string;
  pre_merge_note_en: string;
  runner_readiness_vi: string;
  runner_readiness_en: string;
  boundary_vi: string;
  boundary_en: string;
  support_pa: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaSurvivalPreMergeScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  readinessBoundary: string;
};

export const PUNJABI_CANADA_SURVIVAL_PRE_MERGE_SCOPE: PunjabiCanadaSurvivalPreMergeScope = {
  name: "Punjabi Canada Survival Pre-Merge Samples",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  readinessBoundary:
    "Pre-merge, pre-A11-checksum, runner-readiness, and pre-integration content samples for Canadian survival communication; not A11 integration, not legal advice, not medical advice, and not financial advice.",
};

export const PUNJABI_CANADA_SURVIVAL_PRE_MERGE_DOMAINS: PunjabiCanadaSurvivalPreMergeDomain[] = [
  "clinic",
  "pharmacy",
  "school_childcare",
  "bank",
  "housing",
  "transport",
  "public_office",
  "forms",
  "interpreter_request",
  "emergency_boundary",
  "service_recovery",
  "workplace_safety",
];

export const PUNJABI_CANADA_SURVIVAL_PRE_MERGE_SAMPLES: PunjabiCanadaSurvivalPreMergeSample[] = [
  {
    id: "pa-ca-pre-merge-clinic-001",
    domain: "clinic",
    check: "pre_merge",
    phrase_pa: "ਮੇਰੀ ਅੱਜ ਕਲਿਨਿਕ ਅਪਾਇੰਟਮੈਂਟ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।",
    romanization: "meri ajj clinic appointment hai. kirpa karke hauli bolo.",
    meaning_vi: "Hôm nay tôi có lịch hẹn ở clinic. Làm ơn nói chậm.",
    meaning_en: "I have a clinic appointment today. Please speak slowly.",
    canada_context_vi: "Ở Canada, dùng tại clinic desk trước khi xác nhận tên, giờ hẹn, hoặc phòng.",
    canada_context_en: "In Canada, use at a clinic desk before confirming name, appointment time, or room.",
    pre_merge_note_vi: "Pre-merge sample ổn định vì có appointment, repair line, và bước next-step.",
    pre_merge_note_en: "The pre-merge sample is stable because it has appointment, repair line, and next-step cue.",
    runner_readiness_vi: "Runner có thể kiểm tra Gurmukhi primary, romanization, VI/EN meaning, và clinic context.",
    runner_readiness_en: "A runner can check Gurmukhi primary, romanization, VI/EN meaning, and clinic context.",
    boundary_vi: "Câu này hỗ trợ giao tiếp clinic, không phải lời khuyên y tế.",
    boundary_en: "This supports clinic communication, not medical advice.",
    support_pa: ["ਮੇਰਾ ਨਾਮ ਇਹ ਹੈ।", "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?"],
    learner_trap_vi: "Đừng gật đầu nếu không nghe rõ tên hoặc giờ hẹn.",
    learner_trap_en: "Do not nod if name or appointment time is unclear.",
  },
  {
    id: "pa-ca-pre-merge-pharmacy-002",
    domain: "pharmacy",
    check: "pre_a11_checksum",
    phrase_pa: "ਮੈਨੂੰ ਇਹ ਦਵਾਈ ਲੈਣੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹਦਾਇਤਾਂ ਲਿਖ ਦਿਓ।",
    romanization: "mainu ih davai laini hai. kirpa karke hadaitan likh dio.",
    meaning_vi: "Tôi cần lấy thuốc này. Làm ơn viết hướng dẫn ra.",
    meaning_en: "I need to pick up this medicine. Please write the instructions down.",
    canada_context_vi: "Dùng tại pharmacy pickup counter khi hỏi label, refill, dị ứng, hoặc hướng dẫn.",
    canada_context_en: "Use at a pharmacy pickup counter when asking about label, refill, allergy, or instructions.",
    pre_merge_note_vi: "Pre-A11-checksum cần chứng minh sample không tự đưa liều hoặc chẩn đoán.",
    pre_merge_note_en: "The pre-A11-checksum should prove the sample does not provide dose or diagnosis.",
    runner_readiness_vi: "Runner có thể kiểm tra pharmacist handoff và written-instruction request.",
    runner_readiness_en: "A runner can check pharmacist handoff and written-instruction request.",
    boundary_vi: "Không dùng sample để quyết định liều thuốc.",
    boundary_en: "Do not use the sample to decide medicine dose.",
    support_pa: ["ਦਿਨ ਵਿੱਚ ਕਿੰਨੀ ਵਾਰ?", "ਮੈਨੂੰ ਐਲਰਜੀ ਹੈ।"],
    learner_trap_vi: "Đừng đoán liều nếu label hoặc lời nói chưa rõ.",
    learner_trap_en: "Do not guess dose if the label or spoken instruction is unclear.",
  },
  {
    id: "pa-ca-pre-merge-school-childcare-003",
    domain: "school_childcare",
    check: "runner_readiness",
    phrase_pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਅਧਿਆਪਕ ਨੂੰ ਦੱਸੋ।",
    romanization: "mera bacha ajj gairhazir hai. kirpa karke adhiapak nu dasso.",
    meaning_vi: "Hôm nay con tôi vắng mặt. Làm ơn báo giáo viên.",
    meaning_en: "My child is absent today. Please tell the teacher.",
    canada_context_vi: "Ở Canada, dùng qua school office, daycare desk, attendance phone line, email, hoặc app.",
    canada_context_en: "In Canada, use through a school office, daycare desk, attendance phone line, email, or app.",
    pre_merge_note_vi: "Sample ổn định khi có child, date, office/teacher action, và optional pickup detail.",
    pre_merge_note_en: "The sample is stable when it has child, date, office/teacher action, and optional pickup detail.",
    runner_readiness_vi: "Runner có thể kiểm tra school/childcare coverage và learner-trap coverage.",
    runner_readiness_en: "A runner can check school/childcare coverage and learner-trap coverage.",
    boundary_vi: "Câu này không thay thế policy của trường hoặc childcare.",
    boundary_en: "This does not replace school or childcare policy.",
    support_pa: ["ਬੱਚੇ ਦਾ ਨਾਮ ਇਹ ਹੈ।", "ਅੱਜ ਹੋਰ ਵਿਅਕਤੀ ਲੈਣ ਆਵੇਗਾ/ਆਵੇਗੀ।"],
    learner_trap_vi: "Đừng bỏ tên con hoặc lớp/daycare room nếu office cần.",
    learner_trap_en: "Do not skip child name or class/daycare room if the office needs it.",
  },
  {
    id: "pa-ca-pre-merge-bank-004",
    domain: "bank",
    check: "pre_merge",
    phrase_pa: "ਮੈਨੂੰ ਖਾਤੇ ਬਾਰੇ ਆਮ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਫੀਸ ਲਿਖ ਦਿਓ।",
    romanization: "mainu khate bare aam jankari chahidi hai. kirpa karke fees likh dio.",
    meaning_vi: "Tôi cần thông tin chung về tài khoản. Làm ơn viết phí ra.",
    meaning_en: "I need general account information. Please write down the fees.",
    canada_context_vi: "Dùng tại bank counter hoặc appointment khi hỏi monthly fee, debit card, hoặc ID cần mang.",
    canada_context_en: "Use at a bank counter or appointment when asking about monthly fee, debit card, or ID to bring.",
    pre_merge_note_vi: "Pre-merge sample phải giữ ở mức service information, không khuyến nghị sản phẩm.",
    pre_merge_note_en: "The pre-merge sample must stay at service information level, not product recommendation.",
    runner_readiness_vi: "Runner có thể kiểm tra general-information wording và written fee request.",
    runner_readiness_en: "A runner can check general-information wording and written fee request.",
    boundary_vi: "Câu này không phải tư vấn tài chính.",
    boundary_en: "This is not financial advice.",
    support_pa: ["ਕੀ ਇਹ ਮਹੀਨਾਵਾਰ ਫੀਸ ਹੈ?", "ਮੈਨੂੰ ਸੋਚਣ ਲਈ ਸਮਾਂ ਚਾਹੀਦਾ ਹੈ।"],
    learner_trap_vi: "Đừng coi fee list là lời khuyên chọn sản phẩm.",
    learner_trap_en: "Do not treat a fee list as advice to choose a product.",
  },
  {
    id: "pa-ca-pre-merge-housing-005",
    domain: "housing",
    check: "pre_integration",
    phrase_pa: "ਮੇਰੇ ਯੂਨਿਟ ਵਿੱਚ ਮੁਰੰਮਤ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਸਮਾਂ ਲਿਖ ਦਿਓ।",
    romanization: "mere unit vich murammat di lor hai. kirpa karke sama likh dio.",
    meaning_vi: "Unit của tôi cần sửa chữa. Làm ơn viết thời gian ra.",
    meaning_en: "My unit needs a repair. Please write down the time.",
    canada_context_vi: "Dùng với landlord, property manager, maintenance line, hoặc rental office ở Canada.",
    canada_context_en: "Use with a landlord, property manager, maintenance line, or rental office in Canada.",
    pre_merge_note_vi: "Pre-integration sample cần có unit, issue, repair time, và written confirmation.",
    pre_merge_note_en: "The pre-integration sample needs unit, issue, repair time, and written confirmation.",
    runner_readiness_vi: "Runner có thể kiểm tra housing task không chuyển thành tenancy advice.",
    runner_readiness_en: "A runner can check that the housing task does not become tenancy advice.",
    boundary_vi: "Câu này không phải tư vấn quyền thuê nhà.",
    boundary_en: "This is not tenancy rights advice.",
    support_pa: ["ਯੂਨਿਟ ਨੰਬਰ ਇਹ ਹੈ।", "ਸਮੱਸਿਆ ਤੁਰੰਤ ਹੈ।"],
    learner_trap_vi: "Đừng chỉ nói problem nếu có nước, điện, khóa, hoặc khói.",
    learner_trap_en: "Do not only say problem if there is water, electricity, lock, or smoke.",
  },
  {
    id: "pa-ca-pre-merge-transport-006",
    domain: "transport",
    check: "runner_readiness",
    phrase_pa: "ਇਸ ਪਤੇ ਲਈ ਕਿਹੜੀ ਬੱਸ ਲੈਣੀ ਹੈ? ਕੀ ਮੈਨੂੰ ਟ੍ਰਾਂਸਫਰ ਕਰਨਾ ਪਵੇਗਾ?",
    romanization: "is pate lai kihri bus laini hai? ki mainu transfer karna pavega?",
    meaning_vi: "Tôi nên đi xe bus nào tới địa chỉ này? Tôi có cần transfer không?",
    meaning_en: "Which bus should I take for this address? Do I need to transfer?",
    canada_context_vi: "Dùng khi đi clinic, school, work, public office, rental viewing, hoặc service desk bằng transit.",
    canada_context_en: "Use when going to a clinic, school, work, public office, rental viewing, or service desk by transit.",
    pre_merge_note_vi: "Runner-readiness sample cần route, direction, transfer, và delay repair line.",
    pre_merge_note_en: "The runner-readiness sample needs route, direction, transfer, and delay repair line.",
    runner_readiness_vi: "Runner có thể kiểm tra transport coverage bằng từ transit và bus.",
    runner_readiness_en: "A runner can check transport coverage through transit and bus terms.",
    boundary_vi: "Câu này không đảm bảo schedule transit.",
    boundary_en: "This does not guarantee transit schedule.",
    support_pa: ["ਬੱਸ ਦੇਰ ਨਾਲ ਆ ਰਹੀ ਹੈ।", "ਮੈਂ ਅਪਾਇੰਟਮੈਂਟ ਲਈ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ/ਆਵਾਂਗੀ।"],
    learner_trap_vi: "Đừng chỉ ghi bus number mà không xác nhận direction.",
    learner_trap_en: "Do not only note the bus number without confirming direction.",
  },
  {
    id: "pa-ca-pre-merge-public-office-007",
    domain: "public_office",
    check: "pre_merge",
    phrase_pa: "ਮੈਨੂੰ ਕਿਹੜੇ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਹੈ? ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?",
    romanization: "mainu kihre counter te jana hai? kihre dastavez chahide han?",
    meaning_vi: "Tôi cần đi quầy nào? Cần giấy tờ nào?",
    meaning_en: "Which counter should I go to? Which documents are needed?",
    canada_context_vi: "Dùng tại service centre, newcomer office, library desk, hoặc public office.",
    canada_context_en: "Use at a service centre, newcomer office, library desk, or public office.",
    pre_merge_note_vi: "Pre-merge sample ổn định nếu hỏi counter, documents, và next step.",
    pre_merge_note_en: "The pre-merge sample is stable if it asks counter, documents, and next step.",
    runner_readiness_vi: "Runner có thể kiểm tra public office flow và written checklist request.",
    runner_readiness_en: "A runner can check public office flow and written checklist request.",
    boundary_vi: "Câu này hỏi quy trình, không phải tư vấn pháp lý.",
    boundary_en: "This asks process, not legal advice.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਸੂਚੀ ਲਿਖ ਦਿਓ।", "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?"],
    learner_trap_vi: "Đừng rời quầy nếu chưa biết giấy tờ cần mang lần sau.",
    learner_trap_en: "Do not leave the counter before knowing what to bring next time.",
  },
  {
    id: "pa-ca-pre-merge-forms-008",
    domain: "forms",
    check: "pre_a11_checksum",
    phrase_pa: "ਇਸ ਫਾਰਮ ਵਿੱਚ ਗਲਤੀ ਹੈ। ਕੀ ਮੈਂ ਇਸ ਨੂੰ ਠੀਕ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    romanization: "is form vich galti hai. ki main is nu thik kar sakda/sakdi han?",
    meaning_vi: "Có lỗi trong form này. Tôi có thể sửa nó không?",
    meaning_en: "There is a mistake on this form. Can I correct it?",
    canada_context_vi: "Dùng khi form Canada có lỗi tên, ngày sinh, address, phone, appointment, hoặc document number.",
    canada_context_en: "Use when a Canadian form has a wrong name, birth date, address, phone, appointment, or document number.",
    pre_merge_note_vi: "Pre-A11-checksum cần chứng minh forms coverage và correction request rõ ràng.",
    pre_merge_note_en: "The pre-A11-checksum should prove forms coverage and clear correction request.",
    runner_readiness_vi: "Runner có thể kiểm tra correction, missing paper, service number, và polite follow-up vocabulary.",
    runner_readiness_en: "A runner can check correction, missing paper, service number, and polite follow-up vocabulary.",
    boundary_vi: "Không tự sửa giấy tờ chính thức nếu desk yêu cầu quy trình khác.",
    boundary_en: "Do not alter an official document if the desk requires another process.",
    support_pa: ["ਇੱਥੇ ਗਲਤ ਲਿਖਿਆ ਹੈ।", "ਸਹੀ ਜਾਣਕਾਰੀ ਇਹ ਹੈ।"],
    learner_trap_vi: "Đừng viết đè lên lỗi nếu form có quy định sửa lỗi.",
    learner_trap_en: "Do not write over an error if the form has correction rules.",
  },
  {
    id: "pa-ca-pre-merge-interpreter-009",
    domain: "interpreter_request",
    check: "pre_integration",
    phrase_pa: "ਮੈਨੂੰ ਪੰਜਾਬੀ ਦੁਭਾਸ਼ੀਆ ਚਾਹੀਦਾ ਹੈ। ਮੈਂ ਬਿਨਾਂ ਸਮਝੇ ਸਾਈਨ ਨਹੀਂ ਕਰਾਂਗਾ/ਕਰਾਂਗੀ।",
    romanization: "mainu Punjabi dubhashia chahida hai. main bina samjhe sign nahi karanga/karangi.",
    meaning_vi: "Tôi cần thông dịch viên tiếng Punjabi. Tôi sẽ không ký khi chưa hiểu.",
    meaning_en: "I need a Punjabi interpreter. I will not sign without understanding.",
    canada_context_vi: "Dùng tại clinic, public office, school, housing service, workplace, hoặc service desk.",
    canada_context_en: "Use at a clinic, public office, school, housing service, workplace, or service desk.",
    pre_merge_note_vi: "Pre-integration sample cần pause line, interpreter request, và no-signing-until-clear boundary.",
    pre_merge_note_en: "The pre-integration sample needs pause line, interpreter request, and no-signing-until-clear boundary.",
    runner_readiness_vi: "Runner có thể kiểm tra interpreter request không biến thành professional decision.",
    runner_readiness_en: "A runner can check that interpreter request does not become a professional decision.",
    boundary_vi: "Interpreter hỗ trợ ngôn ngữ, không thay thế quyết định chuyên môn.",
    boundary_en: "An interpreter supports language, not professional decisions.",
    support_pa: ["ਕੀ ਦੁਭਾਸ਼ੀਆ ਹੁਣ ਮਿਲ ਸਕਦਾ ਹੈ?", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।"],
    learner_trap_vi: "Đừng ký chỉ vì muốn kết thúc nhanh.",
    learner_trap_en: "Do not sign just to finish quickly.",
  },
  {
    id: "pa-ca-pre-merge-emergency-010",
    domain: "emergency_boundary",
    check: "pre_a11_checksum",
    phrase_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਮੈਨੂੰ ਹੁਣੇ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਮੇਰਾ ਪਤਾ ਇਹ ਹੈ।",
    romanization: "ih emergency hai. mainu hune madad chahidi hai. mera pata ih hai.",
    meaning_vi: "Đây là khẩn cấp. Tôi cần giúp ngay. Đây là địa chỉ của tôi.",
    meaning_en: "This is an emergency. I need help now. This is my address.",
    canada_context_vi: "Ở nhiều nơi tại Canada, dùng khi cần emergency service như 911.",
    canada_context_en: "In many places in Canada, use when emergency service such as 911 is needed.",
    pre_merge_note_vi: "Pre-A11-checksum cần immediate need, address, service type, và interpreter option.",
    pre_merge_note_en: "The pre-A11-checksum needs immediate need, address, service type, and interpreter option.",
    runner_readiness_vi: "Runner có thể kiểm tra emergency boundary không thay thế dịch vụ khẩn cấp.",
    runner_readiness_en: "A runner can check that emergency boundary does not replace emergency services.",
    boundary_vi: "Sample này không thay thế emergency services hoặc lời khuyên y tế/pháp lý.",
    boundary_en: "This sample does not replace emergency services or medical/legal advice.",
    support_pa: ["ਮੈਨੂੰ ਪੰਜਾਬੀ ਦੁਭਾਸ਼ੀਆ ਚਾਹੀਦਾ ਹੈ।", "ਮੈਂ ਫੋਨ ਤੇ ਰਹਾਂਗਾ/ਰਹਾਂਗੀ।"],
    learner_trap_vi: "Đừng kể chuyện dài trước khi nói vị trí nếu đang nguy hiểm.",
    learner_trap_en: "Do not give a long story before location when in danger.",
  },
  {
    id: "pa-ca-pre-merge-service-recovery-011",
    domain: "service_recovery",
    check: "runner_readiness",
    phrase_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਲਿਖ ਦਿਓ।",
    romanization: "mainu samajh nahi aia. kirpa karke agla kadam likh dio.",
    meaning_vi: "Tôi chưa hiểu. Làm ơn viết bước tiếp theo ra.",
    meaning_en: "I did not understand. Please write down the next step.",
    canada_context_vi: "Dùng khi service desk, clinic, school, bank, housing office, hoặc public office trả lời quá nhanh.",
    canada_context_en: "Use when a service desk, clinic, school, bank, housing office, or public office answers too quickly.",
    pre_merge_note_vi: "Runner-readiness sample cần repair phrase, written next step, và polite follow-up.",
    pre_merge_note_en: "The runner-readiness sample needs repair phrase, written next step, and polite follow-up.",
    runner_readiness_vi: "Runner có thể kiểm tra service recovery giúp learner không im lặng.",
    runner_readiness_en: "A runner can check that service recovery helps the learner avoid silence.",
    boundary_vi: "Câu này chỉ sửa lỗi giao tiếp, không quyết định kết quả hồ sơ.",
    boundary_en: "This only repairs communication, not case outcome.",
    support_pa: ["ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਸਮਝਾ ਸਕਦੇ ਹੋ?", "ਮੈਂ ਕਦੋਂ ਦੁਬਾਰਾ ਪੁੱਛ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?"],
    learner_trap_vi: "Đừng rời desk nếu chưa biết next step.",
    learner_trap_en: "Do not leave the desk if the next step is unclear.",
  },
  {
    id: "pa-ca-pre-merge-workplace-012",
    domain: "workplace_safety",
    check: "pre_integration",
    phrase_pa: "ਕੰਮ ਤੇ ਸੁਰੱਖਿਆ ਦੀ ਸਮੱਸਿਆ ਹੈ। ਮੈਨੂੰ ਸੁਪਰਵਾਈਜ਼ਰ ਨਾਲ ਗੱਲ ਕਰਨੀ ਹੈ।",
    romanization: "kamm te surakhia di samassia hai. mainu supervisor nal gall karni hai.",
    meaning_vi: "Có vấn đề an toàn ở nơi làm việc. Tôi cần nói với supervisor.",
    meaning_en: "There is a safety issue at work. I need to speak with a supervisor.",
    canada_context_vi: "Ở Canada, dùng khi PPE thiếu, có injury, near miss, unsafe area, hoặc cần first aid.",
    canada_context_en: "In Canada, use when PPE is missing, there is injury, near miss, unsafe area, or first aid is needed.",
    pre_merge_note_vi: "Pre-integration sample cần safety issue, supervisor handoff, và written report step.",
    pre_merge_note_en: "The pre-integration sample needs safety issue, supervisor handoff, and written report step.",
    runner_readiness_vi: "Runner có thể kiểm tra workplace task không chuyển thành claim guidance.",
    runner_readiness_en: "A runner can check that the workplace task does not become claim guidance.",
    boundary_vi: "Câu này không phải tư vấn pháp lý hoặc claim guidance.",
    boundary_en: "This is not legal advice or claim guidance.",
    support_pa: ["ਫਸਟ ਏਡ ਕਿੱਥੇ ਹੈ?", "ਕਿਰਪਾ ਕਰਕੇ ਰਿਪੋਰਟ ਦਾ ਕਦਮ ਲਿਖ ਦਿਓ।"],
    learner_trap_vi: "Đừng tiếp tục làm việc nếu bạn không hiểu safety instruction quan trọng.",
    learner_trap_en: "Do not keep working if you do not understand important safety instruction.",
  },
];

export default PUNJABI_CANADA_SURVIVAL_PRE_MERGE_SAMPLES;
