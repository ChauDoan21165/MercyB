// Punjabi C2 evidence receipt samples for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support evidence receipt samples only, not certification,
// official placement, legal/HR/medical/safety advice, or native review.
// Native review is deferred. Shahmukhi is mentioned only for script awareness,
// not as a full course.

export type PunjabiC2EvidenceReceiptFocus =
  | "nuanced_disagreement"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "audience_adaptation"
  | "sensitive_topic_framing"
  | "public_communication_calibration"
  | "register_safety";

export type PunjabiC2EvidenceReceiptContext = "public" | "professional" | "community";
export type PunjabiC2EvidenceReceiptStyle =
  | "pre_a11_evidence_receipt"
  | "completion_record_receipt"
  | "inventory_seal_receipt"
  | "pre_integration";

export type PunjabiC2EvidenceReceiptPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2EvidenceReceiptCheck = {
  check_vi: string;
  check_en: string;
  signal_vi: string;
  signal_en: string;
};

export type PunjabiC2EvidenceReceiptTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2EvidenceReceiptSample = {
  id: string;
  focus: PunjabiC2EvidenceReceiptFocus;
  context: PunjabiC2EvidenceReceiptContext;
  style: PunjabiC2EvidenceReceiptStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  evidence_receipt_goal_vi: string;
  evidence_receipt_goal_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  evidence_receipt_phrases: PunjabiC2EvidenceReceiptPhrase[];
  evidence_receipt_checks: PunjabiC2EvidenceReceiptCheck[];
  learner_trap: PunjabiC2EvidenceReceiptTrap;
  canada_practical?: boolean;
};

export const C2_EVIDENCE_RECEIPT_SAMPLES_DISCLAIMER = {
  vi: "Bộ evidence receipt Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi evidence receipt sample pack supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const c2EvidenceReceiptSamples: PunjabiC2EvidenceReceiptSample[] = [
  {
    id: "pa_c2_evidence_receipt_nuanced_disagreement_pre_a11",
    focus: "nuanced_disagreement",
    context: "professional",
    style: "pre_a11_evidence_receipt",
    title_vi: "evidence receipt: bất đồng tinh tế",
    title_en: "evidence receipt: nuanced disagreement",
    scenario_vi: "Bạn ghi bằng chứng rằng phản biện đã được xử lý trước khi chuyển A11 sau này.",
    scenario_en: "You record evidence that a challenge was handled before a later A11 handoff.",
    evidence_receipt_goal_vi: "Công nhận điểm mạnh, ghi rủi ro đã kiểm tra, và giữ record có thể truy vết.",
    evidence_receipt_goal_en: "Acknowledge the strength, record the checked risk, and keep the record traceable.",
    sample_gurmukhi: "ਮੁੱਖ ਦਲੀਲ ਮਜ਼ਬੂਤ ਹੈ; ਜੋਖਮ ਪਰਖਿਆ ਗਿਆ ਹੈ, ਇਸ ਲਈ evidence receipt ਵਿੱਚ ਇਹ ਦਰਜ ਕਰੀਏ।",
    sample_romanization: "mukh dalil mazboot hai; jokham parakhia giya hai, is lai evidence receipt vich ih darj kariye.",
    sample_vi: "Lập luận chính mạnh; rủi ro đã được kiểm tra, nên hãy ghi điều này trong evidence receipt.",
    sample_en: "The main argument is strong; the risk has been checked, so let's record this in the evidence receipt.",
    evidence_receipt_phrases: [
      { gurmukhi: "ਮੁੱਖ ਦਲੀਲ ਮਜ਼ਬੂਤ ਹੈ", romanization: "mukh dalil mazboot hai", vi: "Lập luận chính mạnh.", en: "The main argument is strong." },
      { gurmukhi: "ਜੋਖਮ ਪਰਖਿਆ ਗਿਆ ਹੈ", romanization: "jokham parakhia giya hai", vi: "Rủi ro đã được kiểm tra.", en: "The risk has been checked." },
    ],
    evidence_receipt_checks: [
      { check_vi: "Có ghi bằng chứng rằng bất đồng đã được xử lý không?", check_en: "Does it record evidence that disagreement was handled?", signal_vi: "Có ਮਜ਼ਬੂਤ and ਜੋਖਮ ਪਰਖਿਆ.", signal_en: "Uses strong and risk checked." },
    ],
    learner_trap: {
      trap_vi: "Ghi 'đã xong' nhưng không nêu bằng chứng làm receipt yếu.",
      trap_en: "Writing 'done' without evidence weakens the receipt.",
      repair_vi: "Ghi điểm mạnh và rủi ro đã kiểm tra.",
      repair_en: "Record the strength and the checked risk.",
    },
  },
  {
    id: "pa_c2_evidence_receipt_diplomacy_completion_record",
    focus: "diplomacy",
    context: "community",
    style: "completion_record_receipt",
    title_vi: "evidence receipt: ngoại giao phạm vi",
    title_en: "evidence receipt: scope diplomacy",
    scenario_vi: "Một nhóm cộng đồng ở Canada đề nghị thêm mục sau khi evidence receipt gần chốt.",
    scenario_en: "A Canadian community group suggests an addition when the evidence receipt is nearly final.",
    evidence_receipt_goal_vi: "Cảm ơn, giữ phạm vi đã ghi bằng chứng, và lưu đề xuất cho vòng sau.",
    evidence_receipt_goal_en: "Thank them, preserve the evidenced scope, and keep the suggestion for a later cycle.",
    sample_gurmukhi: "ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ; ਇਸ evidence receipt ਵਿੱਚ ਹੱਦ ਦਰਜ ਹੋ ਚੁੱਕੀ ਹੈ, ਪਰ ਅਗਲੇ ਚੱਕਰ ਲਈ ਇਸ ਨੂੰ ਰੱਖਦੇ ਹਾਂ।",
    sample_romanization: "sujhaa lai dhanvaad; is evidence receipt vich hadd darj ho chukki hai, par agle chakkar lai is nu rakhde haan.",
    sample_vi: "Cảm ơn đề xuất; trong evidence receipt này phạm vi đã được ghi, nhưng ta giữ lại cho vòng sau.",
    sample_en: "Thank you for the suggestion; in this evidence receipt the scope is already recorded, but we will keep it for the next cycle.",
    evidence_receipt_phrases: [
      { gurmukhi: "ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ", romanization: "sujhaa lai dhanvaad", vi: "Cảm ơn đề xuất.", en: "Thank you for the suggestion." },
      { gurmukhi: "ਅਗਲੇ ਚੱਕਰ ਲਈ", romanization: "agle chakkar lai", vi: "Cho vòng sau.", en: "For the next cycle." },
    ],
    evidence_receipt_checks: [
      { check_vi: "Có giữ phạm vi mà vẫn mở quan hệ cho vòng sau không?", check_en: "Does it preserve scope while keeping rapport for the next cycle?", signal_vi: "Có ਧੰਨਵਾਦ and ਅਗਲੇ ਚੱਕਰ.", signal_en: "Uses thanks and next cycle." },
    ],
    learner_trap: {
      trap_vi: "Nói 'không đổi nữa' quá cứng làm mất ngoại giao.",
      trap_en: "Saying 'no more changes' too rigidly loses diplomacy.",
      repair_vi: "Cảm ơn và nêu nơi đề xuất được giữ lại.",
      repair_en: "Thank them and state where the suggestion is retained.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_evidence_receipt_mediation_inventory_seal",
    focus: "mediation",
    context: "public",
    style: "inventory_seal_receipt",
    title_vi: "evidence receipt: trung gian công khai",
    title_en: "evidence receipt: public mediation",
    scenario_vi: "Hai bên cần thấy evidence receipt ghi rõ ý kiến hai phía và tiêu chí chung.",
    scenario_en: "Two sides need the evidence receipt to show both points and the shared criteria.",
    evidence_receipt_goal_vi: "Ghi nhận hai phía, nêu tiêu chí chung, và tránh nghiêng về một bên.",
    evidence_receipt_goal_en: "Record both sides, name shared criteria, and avoid leaning toward one side.",
    sample_gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਗੱਲ evidence receipt ਵਿੱਚ ਦਰਜ ਹੈ; ਫੈਸਲਾ ਸਾਂਝੇ ਮਾਪਦੰਡ ਦੇ ਆਧਾਰ ਤੇ ਹੋਇਆ ਹੈ।",
    sample_romanization: "dovein pasian di gall evidence receipt vich darj hai; faisla sanjhe mapdand de aadhaar te hoia hai.",
    sample_vi: "Ý kiến của cả hai bên đã được ghi trong evidence receipt; quyết định dựa trên tiêu chí chung.",
    sample_en: "Both sides' points are recorded in the evidence receipt; the decision was based on shared criteria.",
    evidence_receipt_phrases: [
      { gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਗੱਲ", romanization: "dovein pasian di gall", vi: "Ý kiến của cả hai bên.", en: "Both sides' points." },
      { gurmukhi: "ਸਾਂਝੇ ਮਾਪਦੰਡ", romanization: "sanjhe mapdand", vi: "Tiêu chí chung.", en: "Shared criteria." },
    ],
    evidence_receipt_checks: [
      { check_vi: "Có bằng chứng trung lập và tiêu chí chung không?", check_en: "Does it show neutral evidence and shared criteria?", signal_vi: "Có ਦੋਵੇਂ ਪਾਸਿਆਂ and ਸਾਂਝੇ ਮਾਪਦੰਡ.", signal_en: "Uses both sides and shared criteria." },
    ],
    learner_trap: {
      trap_vi: "Ghi bằng chứng như chiến thắng của một bên làm mất trung lập.",
      trap_en: "Recording evidence like one side won loses neutrality.",
      repair_vi: "Ghi cả hai phía và tiêu chí quyết định.",
      repair_en: "Record both sides and the decision criteria.",
    },
  },
  {
    id: "pa_c2_evidence_receipt_deescalation_pre_integration",
    focus: "deescalation",
    context: "professional",
    style: "pre_integration",
    title_vi: "evidence receipt: hạ nhiệt trước tích hợp",
    title_en: "evidence receipt: de-escalation before integration",
    scenario_vi: "Một lỗi nhỏ bị nhắc lại khi nhóm kiểm tra evidence receipt.",
    scenario_en: "A small issue is repeated while the group checks the evidence receipt.",
    evidence_receipt_goal_vi: "Ghi vấn đề, tách khỏi cá nhân, và nêu bằng chứng bước sửa.",
    evidence_receipt_goal_en: "Record the issue, separate it from the person, and name evidence of the repair step.",
    sample_gurmukhi: "ਮੁੱਦਾ evidence receipt ਵਿੱਚ ਦਰਜ ਹੈ; ਹੁਣ ਵਿਅਕਤੀ ਨਹੀਂ, ਸੁਧਾਰ ਦਾ ਕਦਮ ਪੱਕਾ ਹੋ ਚੁੱਕਾ ਹੈ।",
    sample_romanization: "mudda evidence receipt vich darj hai; hun vyakti nahin, sudhaar da kadam pakka ho chukka hai.",
    sample_vi: "Vấn đề đã được ghi trong evidence receipt; bây giờ không nhắm vào cá nhân, bước sửa đã được chốt.",
    sample_en: "The issue is recorded in the evidence receipt; now it is not about the person, and the repair step is confirmed.",
    evidence_receipt_phrases: [
      { gurmukhi: "ਮੁੱਦਾ evidence receipt ਵਿੱਚ ਦਰਜ ਹੈ", romanization: "mudda evidence receipt vich darj hai", vi: "Vấn đề đã được ghi trong evidence receipt.", en: "The issue is recorded in the evidence receipt." },
      { gurmukhi: "ਵਿਅਕਤੀ ਨਹੀਂ", romanization: "vyakti nahin", vi: "Không nhắm vào cá nhân.", en: "Not the person." },
    ],
    evidence_receipt_checks: [
      { check_vi: "Có hạ nhiệt bằng bằng chứng sửa lỗi không?", check_en: "Does it de-escalate through evidence of repair?", signal_vi: "Có ਵਿਅਕਤੀ ਨਹੀਂ and ਸੁਧਾਰ.", signal_en: "Uses not the person and repair." },
    ],
    learner_trap: {
      trap_vi: "Ghi tên người làm receipt giữ căng thẳng.",
      trap_en: "Recording the person's name keeps the receipt tense.",
      repair_vi: "Tách vấn đề khỏi người và ghi bước sửa.",
      repair_en: "Separate the issue from the person and record the repair step.",
    },
  },
  {
    id: "pa_c2_evidence_receipt_audience_adaptation_canada",
    focus: "audience_adaptation",
    context: "community",
    style: "pre_a11_evidence_receipt",
    title_vi: "evidence receipt: chỉnh giọng cho nhóm đa thế hệ",
    title_en: "evidence receipt: adapting for a multi-generational group",
    scenario_vi: "Bạn báo evidence receipt cho phụ huynh, tình nguyện viên, và người học ở Canada.",
    scenario_en: "You announce the evidence receipt to parents, volunteers, and learners in Canada.",
    evidence_receipt_goal_vi: "Dùng câu dễ theo, nói trạng thái đã ghi bằng chứng, và nêu khi nào dùng.",
    evidence_receipt_goal_en: "Use easy-to-follow wording, state evidenced status, and say when it will be used.",
    sample_gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ, evidence receipt ਪੂਰਾ ਹੈ; ਅਗਲੇ ਹਫ਼ਤੇ ਇਹ ਕਲਾਸ ਵਿੱਚ ਵਰਤਿਆ ਜਾਵੇਗਾ।",
    sample_romanization: "sadharan shabdan vich, evidence receipt poora hai; agle hafte ih class vich vartia javega.",
    sample_vi: "Nói đơn giản, evidence receipt đã hoàn tất; tuần sau sẽ được dùng trong lớp.",
    sample_en: "In simple terms, the evidence receipt is complete; next week it will be used in class.",
    evidence_receipt_phrases: [
      { gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ", romanization: "sadharan shabdan vich", vi: "Nói bằng từ đơn giản.", en: "In simple terms." },
      { gurmukhi: "ਅਗਲੇ ਹਫ਼ਤੇ", romanization: "agle hafte", vi: "Tuần sau.", en: "Next week." },
    ],
    evidence_receipt_checks: [
      { check_vi: "Người ngoài nhóm kỹ thuật có hiểu trạng thái không?", check_en: "Can people outside the technical group understand the status?", signal_vi: "Có ਸਧਾਰਨ and ਪੂਰਾ.", signal_en: "Uses simple and complete." },
    ],
    learner_trap: {
      trap_vi: "Dùng thuật ngữ nội bộ khiến phụ huynh khó theo.",
      trap_en: "Internal terms make the notice hard for parents to follow.",
      repair_vi: "Nói trạng thái hoàn tất và tuần áp dụng.",
      repair_en: "State completed status and the week of use.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_evidence_receipt_sensitive_topic_framing",
    focus: "sensitive_topic_framing",
    context: "public",
    style: "completion_record_receipt",
    title_vi: "evidence receipt: khung chủ đề nhạy cảm",
    title_en: "evidence receipt: sensitive-topic framing",
    scenario_vi: "Bạn ghi bằng chứng cho cách mở chủ đề nhạy cảm trong buổi cộng đồng.",
    scenario_en: "You record evidence for opening a sensitive topic in a community session.",
    evidence_receipt_goal_vi: "Nói mục tiêu chung, giảm quy kết, và ghi quy trình góp ý.",
    evidence_receipt_goal_en: "Name the shared goal, reduce blame, and record the input process.",
    sample_gurmukhi: "ਮਕਸਦ ਦੋਸ਼ ਦੇਣਾ ਨਹੀਂ ਸੀ; evidence receipt ਵਿੱਚ ਸਾਂਝਾ ਹੱਲ ਅਤੇ ਸੁਝਾਅ ਕ੍ਰਮ ਨਾਲ ਸੁਣਨ ਦੀ ਗੱਲ ਦਰਜ ਹੈ।",
    sample_romanization: "maqsad dosh dena nahin si; evidence receipt vich sanjha hall ate sujhaa kram naal sunnan di gall darj hai.",
    sample_vi: "Mục đích không phải đổ lỗi; evidence receipt ghi giải pháp chung và việc nghe góp ý theo thứ tự.",
    sample_en: "The aim was not to blame; the evidence receipt records the shared solution and hearing suggestions in order.",
    evidence_receipt_phrases: [
      { gurmukhi: "ਦੋਸ਼ ਦੇਣਾ ਨਹੀਂ ਸੀ", romanization: "dosh dena nahin si", vi: "Không phải đổ lỗi.", en: "It was not to blame." },
      { gurmukhi: "ਸਾਂਝਾ ਹੱਲ", romanization: "sanjha hall", vi: "Giải pháp chung.", en: "Shared solution." },
    ],
    evidence_receipt_checks: [
      { check_vi: "Có ghi khung nhạy cảm mà không quy lỗi không?", check_en: "Does it record sensitive framing without blame?", signal_vi: "Có ਦੋਸ਼ ਨਹੀਂ and ਸਾਂਝਾ ਹੱਲ.", signal_en: "Uses not blame and shared solution." },
    ],
    learner_trap: {
      trap_vi: "Ghi bằng chứng bằng lỗi của một nhóm làm chủ đề căng lại.",
      trap_en: "Recording evidence as one group's fault makes it tense again.",
      repair_vi: "Ghi mục tiêu chung và quy trình góp ý.",
      repair_en: "Record the shared goal and input process.",
    },
  },
  {
    id: "pa_c2_evidence_receipt_public_communication_calibration",
    focus: "public_communication_calibration",
    context: "public",
    style: "inventory_seal_receipt",
    title_vi: "evidence receipt: cân chỉnh thông báo công khai",
    title_en: "evidence receipt: public communication calibration",
    scenario_vi: "Bạn ghi bằng chứng cuối cho thông báo thay đổi dịch vụ cộng đồng ở Canada.",
    scenario_en: "You record final evidence for a community-service change notice in Canada.",
    evidence_receipt_goal_vi: "Nói thay đổi, lý do ngắn, và nơi nhận hỗ trợ.",
    evidence_receipt_goal_en: "State the change, give a short reason, and name where to get support.",
    sample_gurmukhi: "ਸੇਵਾ ਦਾ ਸਮਾਂ ਬਦਲਿਆ ਹੈ; ਕਾਰਨ ਸਟਾਫ਼ ਦੀ ਘਾਟ ਹੈ, ਅਤੇ ਮਦਦ ਲਈ ਡੈਸਕ ਖੁੱਲ੍ਹਾ ਰਹੇਗਾ।",
    sample_romanization: "seva da sama badlia hai; karan staff di ghaat hai, ate madad lai desk khulla rahega.",
    sample_vi: "Giờ dịch vụ đã đổi; lý do là thiếu nhân sự, và bàn hỗ trợ sẽ vẫn mở.",
    sample_en: "The service time has changed; the reason is staff shortage, and the help desk will remain open.",
    evidence_receipt_phrases: [
      { gurmukhi: "ਸੇਵਾ ਦਾ ਸਮਾਂ ਬਦਲਿਆ ਹੈ", romanization: "seva da sama badlia hai", vi: "Giờ dịch vụ đã đổi.", en: "The service time has changed." },
      { gurmukhi: "ਮਦਦ ਲਈ ਡੈਸਕ", romanization: "madad lai desk", vi: "Bàn hỗ trợ.", en: "Help desk." },
    ],
    evidence_receipt_checks: [
      { check_vi: "Có rõ ràng mà không làm người nghe hoang mang không?", check_en: "Is it clear without making listeners alarmed?", signal_vi: "Có thay đổi, lý do, và hỗ trợ.", signal_en: "Includes change, reason, and support." },
    ],
    learner_trap: {
      trap_vi: "Ghi thay đổi nhưng không ghi đường hỗ trợ.",
      trap_en: "Recording the change without a support path leaves people stuck.",
      repair_vi: "Thêm nơi nhận hỗ trợ hoặc bước tiếp theo.",
      repair_en: "Add where to get support or the next step.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_evidence_receipt_register_safety",
    focus: "register_safety",
    context: "professional",
    style: "pre_integration",
    title_vi: "evidence receipt: an toàn register",
    title_en: "evidence receipt: register safety",
    scenario_vi: "Bạn sửa câu quá thân mật trước khi ghi evidence receipt chuyên nghiệp.",
    scenario_en: "You repair an overly casual line before writing a professional evidence receipt.",
    evidence_receipt_goal_vi: "Giữ lịch sự, cụ thể, không phóng đại, và có yêu cầu rõ.",
    evidence_receipt_goal_en: "Stay polite, specific, not exaggerated, and clear in the request.",
    sample_gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇਸ evidence receipt ਦੀ ਸਮੀਖਿਆ ਕਰੋ ਅਤੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।",
    sample_romanization: "kirpa karke is evidence receipt di samikhia karo ate agla kadam daso.",
    sample_vi: "Vui lòng xem xét evidence receipt này và cho biết bước tiếp theo.",
    sample_en: "Please review this evidence receipt and advise the next step.",
    evidence_receipt_phrases: [
      { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ", romanization: "kirpa karke", vi: "Vui lòng.", en: "Please." },
      { gurmukhi: "ਅਗਲਾ ਕਦਮ ਦੱਸੋ", romanization: "agla kadam daso", vi: "Cho biết bước tiếp theo.", en: "Advise the next step." },
    ],
    evidence_receipt_checks: [
      { check_vi: "Có đủ lịch sự nhưng vẫn cụ thể không?", check_en: "Is it polite while staying specific?", signal_vi: "Có ਕਿਰਪਾ ਕਰਕੇ and ਅਗਲਾ ਕਦਮ.", signal_en: "Uses please and next step." },
    ],
    learner_trap: {
      trap_vi: "Quá thân mật hoặc quá giận làm mất register chuyên nghiệp.",
      trap_en: "Being too casual or angry loses professional register.",
      repair_vi: "Dùng câu lịch sự với yêu cầu cụ thể.",
      repair_en: "Use a polite line with a concrete request.",
    },
  },
];

export const c2EvidenceReceiptSamplesByFocus = (focus: PunjabiC2EvidenceReceiptFocus) =>
  c2EvidenceReceiptSamples.filter((item) => item.focus === focus);

export const c2EvidenceReceiptSamplesByStyle = (style: PunjabiC2EvidenceReceiptStyle) =>
  c2EvidenceReceiptSamples.filter((item) => item.style === style);

export default c2EvidenceReceiptSamples;
