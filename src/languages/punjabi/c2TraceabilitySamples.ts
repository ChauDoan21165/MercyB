// Punjabi C2 traceability samples for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support traceability samples only, not certification,
// official placement, legal/HR/medical/safety advice, or native review.
// Native review is deferred. Shahmukhi is mentioned only for script awareness,
// not as a full course.

export type PunjabiC2TraceabilityFocus =
  | "nuanced_disagreement"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "audience_adaptation"
  | "sensitive_topic_framing"
  | "public_communication_calibration"
  | "register_safety";

export type PunjabiC2TraceabilityContext = "public" | "professional" | "community";
export type PunjabiC2TraceabilityStyle =
  | "pre_a11_traceability"
  | "evidence_receipt_trace"
  | "completion_record_trace"
  | "pre_integration";

export type PunjabiC2TraceabilityPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2TraceabilityCheck = {
  check_vi: string;
  check_en: string;
  signal_vi: string;
  signal_en: string;
};

export type PunjabiC2TraceabilityTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2TraceabilitySample = {
  id: string;
  focus: PunjabiC2TraceabilityFocus;
  context: PunjabiC2TraceabilityContext;
  style: PunjabiC2TraceabilityStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  traceability_goal_vi: string;
  traceability_goal_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  traceability_phrases: PunjabiC2TraceabilityPhrase[];
  traceability_checks: PunjabiC2TraceabilityCheck[];
  learner_trap: PunjabiC2TraceabilityTrap;
  canada_practical?: boolean;
};

export const C2_TRACEABILITY_SAMPLES_DISCLAIMER = {
  vi: "Bộ traceability Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi traceability sample pack supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const c2TraceabilitySamples: PunjabiC2TraceabilitySample[] = [
  {
    id: "pa_c2_traceability_nuanced_disagreement_pre_a11",
    focus: "nuanced_disagreement",
    context: "professional",
    style: "pre_a11_traceability",
    title_vi: "traceability: bất đồng tinh tế",
    title_en: "traceability: nuanced disagreement",
    scenario_vi: "Bạn nối mẫu phản biện với mục tiêu trước khi chuyển A11 sau này.",
    scenario_en: "You link a challenge sample to its goal before a later A11 handoff.",
    traceability_goal_vi: "Nối điểm mạnh, rủi ro đã kiểm tra, và mục tiêu học tập.",
    traceability_goal_en: "Link the strength, the checked risk, and the learning goal.",
    sample_gurmukhi: "ਮੁੱਖ ਦਲੀਲ ਮਜ਼ਬੂਤ ਹੈ; ਜੋਖਮ ਪਰਖਿਆ ਗਿਆ ਹੈ, ਅਤੇ traceability ਵਿੱਚ ਇਸ ਨੂੰ ਟੀਚੇ ਨਾਲ ਜੋੜੀਏ।",
    sample_romanization: "mukh dalil mazboot hai; jokham parakhia giya hai, ate traceability vich is nu teechay naal jorie.",
    sample_vi: "Lập luận chính mạnh; rủi ro đã được kiểm tra, và trong traceability hãy nối nó với mục tiêu.",
    sample_en: "The main argument is strong; the risk has been checked, and in traceability let's link it to the goal.",
    traceability_phrases: [
      { gurmukhi: "ਮੁੱਖ ਦਲੀਲ ਮਜ਼ਬੂਤ ਹੈ", romanization: "mukh dalil mazboot hai", vi: "Lập luận chính mạnh.", en: "The main argument is strong." },
      { gurmukhi: "ਟੀਚੇ ਨਾਲ ਜੋੜੀਏ", romanization: "teechay naal jorie", vi: "Hãy nối với mục tiêu.", en: "Let's link it to the goal." },
    ],
    traceability_checks: [
      { check_vi: "Có nối phản biện với mục tiêu không?", check_en: "Does it link the challenge to a goal?", signal_vi: "Có ਜੋਖਮ and ਟੀਚਾ.", signal_en: "Uses risk and goal." },
    ],
    learner_trap: {
      trap_vi: "Ghi câu phản biện nhưng không nối mục tiêu làm trace yếu.",
      trap_en: "Recording the challenge without a goal makes traceability weak.",
      repair_vi: "Nối điểm mạnh, rủi ro, và mục tiêu học tập.",
      repair_en: "Link the strength, risk, and learning goal.",
    },
  },
  {
    id: "pa_c2_traceability_diplomacy_evidence_receipt",
    focus: "diplomacy",
    context: "community",
    style: "evidence_receipt_trace",
    title_vi: "traceability: ngoại giao phạm vi",
    title_en: "traceability: scope diplomacy",
    scenario_vi: "Một nhóm cộng đồng ở Canada muốn biết đề xuất của họ sẽ được nối với vòng nào.",
    scenario_en: "A Canadian community group wants to know which cycle their suggestion is linked to.",
    traceability_goal_vi: "Cảm ơn, giữ phạm vi hiện tại, và nối đề xuất với vòng sau.",
    traceability_goal_en: "Thank them, keep current scope, and link the suggestion to a later cycle.",
    sample_gurmukhi: "ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ; ਇਸ traceability ਵਿੱਚ ਹੱਦ ਇਹੀ ਰਹੇਗੀ, ਪਰ ਅਗਲੇ ਚੱਕਰ ਨਾਲ ਇਸ ਨੂੰ ਜੋੜਦੇ ਹਾਂ।",
    sample_romanization: "sujhaa lai dhanvaad; is traceability vich hadd ehi rahegi, par agle chakkar naal is nu jorde haan.",
    sample_vi: "Cảm ơn đề xuất; trong traceability này phạm vi sẽ giữ như vậy, nhưng ta nối nó với vòng sau.",
    sample_en: "Thank you for the suggestion; in this traceability record the scope stays as is, but we link it to the next cycle.",
    traceability_phrases: [
      { gurmukhi: "ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ", romanization: "sujhaa lai dhanvaad", vi: "Cảm ơn đề xuất.", en: "Thank you for the suggestion." },
      { gurmukhi: "ਅਗਲੇ ਚੱਕਰ ਨਾਲ ਜੋੜਦੇ ਹਾਂ", romanization: "agle chakkar naal jorde haan", vi: "Nối với vòng sau.", en: "We link it to the next cycle." },
    ],
    traceability_checks: [
      { check_vi: "Có giữ phạm vi và tạo đường theo dõi không?", check_en: "Does it hold scope and create a follow-up path?", signal_vi: "Có ਧੰਨਵਾਦ and ਅਗਲੇ ਚੱਕਰ.", signal_en: "Uses thanks and next cycle." },
    ],
    learner_trap: {
      trap_vi: "Chỉ nói 'để sau' mà không nối vòng sau làm mơ hồ.",
      trap_en: "Only saying 'later' without a linked cycle is vague.",
      repair_vi: "Nói cảm ơn và nối đề xuất với vòng sau.",
      repair_en: "Thank them and link the suggestion to a later cycle.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_traceability_mediation_completion_record",
    focus: "mediation",
    context: "public",
    style: "completion_record_trace",
    title_vi: "traceability: trung gian công khai",
    title_en: "traceability: public mediation",
    scenario_vi: "Hai bên cần thấy ý kiến của họ được nối với tiêu chí chung.",
    scenario_en: "Two sides need to see their points linked to shared criteria.",
    traceability_goal_vi: "Ghi hai phía, nối với tiêu chí chung, và tránh nghiêng về một bên.",
    traceability_goal_en: "Record both sides, link them to shared criteria, and avoid leaning toward one side.",
    sample_gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਗੱਲ traceability ਵਿੱਚ ਦਰਜ ਹੈ; ਫੈਸਲਾ ਸਾਂਝੇ ਮਾਪਦੰਡ ਨਾਲ ਜੋੜਿਆ ਗਿਆ ਹੈ।",
    sample_romanization: "dovein pasian di gall traceability vich darj hai; faisla sanjhe mapdand naal joria giya hai.",
    sample_vi: "Ý kiến của cả hai bên đã được ghi trong traceability; quyết định được nối với tiêu chí chung.",
    sample_en: "Both sides' points are recorded in traceability; the decision is linked to shared criteria.",
    traceability_phrases: [
      { gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਗੱਲ", romanization: "dovein pasian di gall", vi: "Ý kiến của cả hai bên.", en: "Both sides' points." },
      { gurmukhi: "ਸਾਂਝੇ ਮਾਪਦੰਡ", romanization: "sanjhe mapdand", vi: "Tiêu chí chung.", en: "Shared criteria." },
    ],
    traceability_checks: [
      { check_vi: "Có nối hai phía với tiêu chí chung không?", check_en: "Does it link both sides to shared criteria?", signal_vi: "Có ਦੋਵੇਂ ਪਾਸਿਆਂ and ਸਾਂਝੇ ਮਾਪਦੰਡ.", signal_en: "Uses both sides and shared criteria." },
    ],
    learner_trap: {
      trap_vi: "Nối quyết định với một bên làm mất trung lập.",
      trap_en: "Linking the decision to one side loses neutrality.",
      repair_vi: "Nối cả hai phía với tiêu chí chung.",
      repair_en: "Link both sides to shared criteria.",
    },
  },
  {
    id: "pa_c2_traceability_deescalation_pre_integration",
    focus: "deescalation",
    context: "professional",
    style: "pre_integration",
    title_vi: "traceability: hạ nhiệt trước tích hợp",
    title_en: "traceability: de-escalation before integration",
    scenario_vi: "Một lỗi nhỏ bị nhắc lại khi nhóm nối bằng chứng với bước sửa.",
    scenario_en: "A small issue is repeated while the group links evidence to the repair step.",
    traceability_goal_vi: "Ghi vấn đề, tách khỏi cá nhân, và nối với bước sửa.",
    traceability_goal_en: "Record the issue, separate it from the person, and link it to the repair step.",
    sample_gurmukhi: "ਮੁੱਦਾ traceability ਵਿੱਚ ਦਰਜ ਹੈ; ਹੁਣ ਵਿਅਕਤੀ ਨਹੀਂ, ਇਸ ਨੂੰ ਸੁਧਾਰ ਦੇ ਕਦਮ ਨਾਲ ਜੋੜੀਏ।",
    sample_romanization: "mudda traceability vich darj hai; hun vyakti nahin, is nu sudhaar de kadam naal jorie.",
    sample_vi: "Vấn đề đã được ghi trong traceability; bây giờ không nhắm vào cá nhân, hãy nối nó với bước sửa.",
    sample_en: "The issue is recorded in traceability; now it is not about the person, so let's link it to the repair step.",
    traceability_phrases: [
      { gurmukhi: "ਵਿਅਕਤੀ ਨਹੀਂ", romanization: "vyakti nahin", vi: "Không nhắm vào cá nhân.", en: "Not the person." },
      { gurmukhi: "ਸੁਧਾਰ ਦੇ ਕਦਮ ਨਾਲ ਜੋੜੀਏ", romanization: "sudhaar de kadam naal jorie", vi: "Nối với bước sửa.", en: "Link it to the repair step." },
    ],
    traceability_checks: [
      { check_vi: "Có hạ nhiệt bằng đường nối đến bước sửa không?", check_en: "Does it de-escalate by linking to the repair step?", signal_vi: "Có ਵਿਅਕਤੀ ਨਹੀਂ and ਸੁਧਾਰ.", signal_en: "Uses not the person and repair." },
    ],
    learner_trap: {
      trap_vi: "Nối lỗi với tên người giữ căng thẳng.",
      trap_en: "Linking the issue to a person's name keeps tension.",
      repair_vi: "Nối vấn đề với bước sửa, không với cá nhân.",
      repair_en: "Link the issue to the repair step, not the person.",
    },
  },
  {
    id: "pa_c2_traceability_audience_adaptation_canada",
    focus: "audience_adaptation",
    context: "community",
    style: "pre_a11_traceability",
    title_vi: "traceability: chỉnh giọng cho nhóm đa thế hệ",
    title_en: "traceability: adapting for a multi-generational group",
    scenario_vi: "Bạn báo traceability cho phụ huynh, tình nguyện viên, và người học ở Canada.",
    scenario_en: "You announce the traceability record to parents, volunteers, and learners in Canada.",
    traceability_goal_vi: "Dùng câu dễ theo, nói trạng thái, và nêu khi nào dùng.",
    traceability_goal_en: "Use easy-to-follow wording, state the status, and say when it will be used.",
    sample_gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ, traceability ਪੂਰੀ ਹੈ; ਅਗਲੇ ਹਫ਼ਤੇ ਇਹ ਕਲਾਸ ਵਿੱਚ ਵਰਤਿਆ ਜਾਵੇਗਾ।",
    sample_romanization: "sadharan shabdan vich, traceability poori hai; agle hafte ih class vich vartia javega.",
    sample_vi: "Nói đơn giản, traceability đã hoàn tất; tuần sau sẽ được dùng trong lớp.",
    sample_en: "In simple terms, traceability is complete; next week it will be used in class.",
    traceability_phrases: [
      { gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ", romanization: "sadharan shabdan vich", vi: "Nói bằng từ đơn giản.", en: "In simple terms." },
      { gurmukhi: "ਅਗਲੇ ਹਫ਼ਤੇ", romanization: "agle hafte", vi: "Tuần sau.", en: "Next week." },
    ],
    traceability_checks: [
      { check_vi: "Người ngoài nhóm kỹ thuật có hiểu trạng thái không?", check_en: "Can people outside the technical group understand the status?", signal_vi: "Có ਸਧਾਰਨ and ਪੂਰੀ.", signal_en: "Uses simple and complete." },
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
    id: "pa_c2_traceability_sensitive_topic_framing",
    focus: "sensitive_topic_framing",
    context: "public",
    style: "evidence_receipt_trace",
    title_vi: "traceability: khung chủ đề nhạy cảm",
    title_en: "traceability: sensitive-topic framing",
    scenario_vi: "Bạn nối chủ đề nhạy cảm với mục tiêu chung và quy trình góp ý.",
    scenario_en: "You link a sensitive topic to the shared goal and input process.",
    traceability_goal_vi: "Nói mục tiêu chung, giảm quy kết, và nối với quy trình góp ý.",
    traceability_goal_en: "Name the shared goal, reduce blame, and link to the input process.",
    sample_gurmukhi: "ਮਕਸਦ ਦੋਸ਼ ਦੇਣਾ ਨਹੀਂ ਸੀ; traceability ਵਿੱਚ ਸਾਂਝਾ ਹੱਲ ਅਤੇ ਸੁਝਾਅ ਦੇ ਕ੍ਰਮ ਨੂੰ ਜੋੜੀਏ।",
    sample_romanization: "maqsad dosh dena nahin si; traceability vich sanjha hall ate sujhaa de kram nu jorie.",
    sample_vi: "Mục đích không phải đổ lỗi; trong traceability hãy nối giải pháp chung và thứ tự góp ý.",
    sample_en: "The aim was not to blame; in traceability let's link the shared solution and the order for input.",
    traceability_phrases: [
      { gurmukhi: "ਦੋਸ਼ ਦੇਣਾ ਨਹੀਂ ਸੀ", romanization: "dosh dena nahin si", vi: "Không phải đổ lỗi.", en: "It was not to blame." },
      { gurmukhi: "ਸਾਂਝਾ ਹੱਲ", romanization: "sanjha hall", vi: "Giải pháp chung.", en: "Shared solution." },
    ],
    traceability_checks: [
      { check_vi: "Có nối chủ đề nhạy cảm với mục tiêu chung không?", check_en: "Does it link the sensitive topic to a shared goal?", signal_vi: "Có ਦੋਸ਼ ਨਹੀਂ and ਸਾਂਝਾ ਹੱਲ.", signal_en: "Uses not blame and shared solution." },
    ],
    learner_trap: {
      trap_vi: "Nối chủ đề với lỗi của một nhóm làm chủ đề căng lại.",
      trap_en: "Linking the topic to one group's fault makes it tense again.",
      repair_vi: "Nối với mục tiêu chung và quy trình góp ý.",
      repair_en: "Link to the shared goal and input process.",
    },
  },
  {
    id: "pa_c2_traceability_public_communication_calibration",
    focus: "public_communication_calibration",
    context: "public",
    style: "completion_record_trace",
    title_vi: "traceability: cân chỉnh thông báo công khai",
    title_en: "traceability: public communication calibration",
    scenario_vi: "Bạn nối thông báo thay đổi dịch vụ cộng đồng ở Canada với lý do và hỗ trợ.",
    scenario_en: "You link a Canadian community-service change notice to its reason and support path.",
    traceability_goal_vi: "Nói thay đổi, lý do ngắn, và đường nhận hỗ trợ.",
    traceability_goal_en: "State the change, give a short reason, and name the support path.",
    sample_gurmukhi: "ਸੇਵਾ ਦਾ ਸਮਾਂ ਬਦਲਿਆ ਹੈ; ਕਾਰਨ ਸਟਾਫ਼ ਦੀ ਘਾਟ ਹੈ, ਅਤੇ traceability ਵਿੱਚ ਮਦਦ ਵਾਲੇ ਡੈਸਕ ਨਾਲ ਜੋੜੀਏ।",
    sample_romanization: "seva da sama badlia hai; karan staff di ghaat hai, ate traceability vich madad wale desk naal jorie.",
    sample_vi: "Giờ dịch vụ đã đổi; lý do là thiếu nhân sự, và trong traceability hãy nối với bàn hỗ trợ.",
    sample_en: "The service time has changed; the reason is staff shortage, and in traceability let's link it to the help desk.",
    traceability_phrases: [
      { gurmukhi: "ਸੇਵਾ ਦਾ ਸਮਾਂ ਬਦਲਿਆ ਹੈ", romanization: "seva da sama badlia hai", vi: "Giờ dịch vụ đã đổi.", en: "The service time has changed." },
      { gurmukhi: "ਮਦਦ ਵਾਲੇ ਡੈਸਕ", romanization: "madad wale desk", vi: "Bàn hỗ trợ.", en: "Help desk." },
    ],
    traceability_checks: [
      { check_vi: "Có nối thay đổi với lý do và hỗ trợ không?", check_en: "Does it link the change to reason and support?", signal_vi: "Có service change, reason, and help desk.", signal_en: "Includes service change, reason, and help desk." },
    ],
    learner_trap: {
      trap_vi: "Nối thay đổi mà không có hỗ trợ làm người đọc kẹt.",
      trap_en: "Linking a change without support leaves readers stuck.",
      repair_vi: "Thêm lý do ngắn và nơi nhận hỗ trợ.",
      repair_en: "Add a short reason and where to get support.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_traceability_register_safety",
    focus: "register_safety",
    context: "professional",
    style: "pre_integration",
    title_vi: "traceability: an toàn register",
    title_en: "traceability: register safety",
    scenario_vi: "Bạn nối câu đã sửa với mục tiêu register chuyên nghiệp.",
    scenario_en: "You link a repaired line to the professional register goal.",
    traceability_goal_vi: "Giữ lịch sự, cụ thể, không phóng đại, và có yêu cầu rõ.",
    traceability_goal_en: "Stay polite, specific, not exaggerated, and clear in the request.",
    sample_gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇਸ traceability ਦੀ ਸਮੀਖਿਆ ਕਰੋ ਅਤੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।",
    sample_romanization: "kirpa karke is traceability di samikhia karo ate agla kadam daso.",
    sample_vi: "Vui lòng xem xét traceability này và cho biết bước tiếp theo.",
    sample_en: "Please review this traceability record and advise the next step.",
    traceability_phrases: [
      { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ", romanization: "kirpa karke", vi: "Vui lòng.", en: "Please." },
      { gurmukhi: "ਅਗਲਾ ਕਦਮ ਦੱਸੋ", romanization: "agla kadam daso", vi: "Cho biết bước tiếp theo.", en: "Advise the next step." },
    ],
    traceability_checks: [
      { check_vi: "Có nối câu sửa với register chuyên nghiệp không?", check_en: "Does it link the repair to professional register?", signal_vi: "Có ਕਿਰਪਾ ਕਰਕੇ and ਅਗਲਾ ਕਦਮ.", signal_en: "Uses please and next step." },
    ],
    learner_trap: {
      trap_vi: "Quá thân mật hoặc quá giận làm mất register chuyên nghiệp.",
      trap_en: "Being too casual or angry loses professional register.",
      repair_vi: "Dùng câu lịch sự với yêu cầu cụ thể.",
      repair_en: "Use a polite line with a concrete request.",
    },
  },
];

export const c2TraceabilitySamplesByFocus = (focus: PunjabiC2TraceabilityFocus) =>
  c2TraceabilitySamples.filter((item) => item.focus === focus);

export const c2TraceabilitySamplesByStyle = (style: PunjabiC2TraceabilityStyle) =>
  c2TraceabilitySamples.filter((item) => item.style === style);

export default c2TraceabilitySamples;
