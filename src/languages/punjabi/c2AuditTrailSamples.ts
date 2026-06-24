// Punjabi C2 audit trail samples for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support audit trail samples only, not certification,
// official placement, legal/HR/medical/safety advice, or native review.
// Native review is deferred. Shahmukhi is mentioned only for script awareness,
// not as a full course.

export type PunjabiC2AuditTrailFocus =
  | "nuanced_disagreement"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "audience_adaptation"
  | "sensitive_topic_framing"
  | "public_communication_calibration"
  | "register_safety";

export type PunjabiC2AuditTrailContext = "public" | "professional" | "community";
export type PunjabiC2AuditTrailStyle =
  | "pre_a11_audit_trail"
  | "traceability_audit"
  | "evidence_receipt_audit"
  | "pre_integration";

export type PunjabiC2AuditTrailPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2AuditTrailCheck = {
  check_vi: string;
  check_en: string;
  signal_vi: string;
  signal_en: string;
};

export type PunjabiC2AuditTrailTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2AuditTrailSample = {
  id: string;
  focus: PunjabiC2AuditTrailFocus;
  context: PunjabiC2AuditTrailContext;
  style: PunjabiC2AuditTrailStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  audit_trail_goal_vi: string;
  audit_trail_goal_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  audit_trail_phrases: PunjabiC2AuditTrailPhrase[];
  audit_trail_checks: PunjabiC2AuditTrailCheck[];
  learner_trap: PunjabiC2AuditTrailTrap;
  canada_practical?: boolean;
};

export const C2_AUDIT_TRAIL_SAMPLES_DISCLAIMER = {
  vi: "Bộ audit trail Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi audit trail sample pack supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const c2AuditTrailSamples: PunjabiC2AuditTrailSample[] = [
  {
    id: "pa_c2_audit_trail_nuanced_disagreement_pre_a11",
    focus: "nuanced_disagreement",
    context: "professional",
    style: "pre_a11_audit_trail",
    title_vi: "audit trail: bất đồng tinh tế",
    title_en: "audit trail: nuanced disagreement",
    scenario_vi: "Bạn ghi audit trail cho phản biện đã được xử lý trước khi chuyển A11 sau này.",
    scenario_en: "You log an audit trail for a handled challenge before a later A11 handoff.",
    audit_trail_goal_vi: "Nối điểm mạnh, rủi ro đã kiểm tra, và quyết định cuối.",
    audit_trail_goal_en: "Link the strength, checked risk, and final decision.",
    sample_gurmukhi: "ਮੁੱਖ ਦਲੀਲ ਮਜ਼ਬੂਤ ਹੈ; ਜੋਖਮ ਪਰਖਿਆ ਗਿਆ ਹੈ, ਅਤੇ audit trail ਵਿੱਚ ਫੈਸਲੇ ਨਾਲ ਜੋੜੀਏ।",
    sample_romanization: "mukh dalil mazboot hai; jokham parakhia giya hai, ate audit trail vich faisle naal jorie.",
    sample_vi: "Lập luận chính mạnh; rủi ro đã được kiểm tra, và trong audit trail hãy nối với quyết định.",
    sample_en: "The main argument is strong; the risk has been checked, and in the audit trail let's link it to the decision.",
    audit_trail_phrases: [
      { gurmukhi: "ਮੁੱਖ ਦਲੀਲ ਮਜ਼ਬੂਤ ਹੈ", romanization: "mukh dalil mazboot hai", vi: "Lập luận chính mạnh.", en: "The main argument is strong." },
      { gurmukhi: "ਫੈਸਲੇ ਨਾਲ ਜੋੜੀਏ", romanization: "faisle naal jorie", vi: "Hãy nối với quyết định.", en: "Let's link it to the decision." },
    ],
    audit_trail_checks: [
      { check_vi: "Có nối phản biện với quyết định cuối không?", check_en: "Does it link the challenge to the final decision?", signal_vi: "Có ਜੋਖਮ and ਫੈਸਲਾ.", signal_en: "Uses risk and decision." },
    ],
    learner_trap: {
      trap_vi: "Ghi phản biện mà không nối quyết định làm audit trail yếu.",
      trap_en: "Recording a challenge without the decision weakens the audit trail.",
      repair_vi: "Nối điểm mạnh, rủi ro đã kiểm tra, và quyết định.",
      repair_en: "Link the strength, checked risk, and decision.",
    },
  },
  {
    id: "pa_c2_audit_trail_diplomacy_traceability",
    focus: "diplomacy",
    context: "community",
    style: "traceability_audit",
    title_vi: "audit trail: ngoại giao phạm vi",
    title_en: "audit trail: scope diplomacy",
    scenario_vi: "Một nhóm cộng đồng ở Canada muốn thấy đề xuất của họ được ghi vào vòng sau.",
    scenario_en: "A Canadian community group wants to see their suggestion logged for the next cycle.",
    audit_trail_goal_vi: "Cảm ơn, giữ phạm vi hiện tại, và nối đề xuất với vòng sau.",
    audit_trail_goal_en: "Thank them, keep current scope, and link the suggestion to a later cycle.",
    sample_gurmukhi: "ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ; ਇਸ audit trail ਵਿੱਚ ਹੱਦ ਇਹੀ ਰਹੇਗੀ, ਪਰ ਅਗਲੇ ਚੱਕਰ ਨਾਲ ਇਸ ਨੂੰ ਜੋੜਦੇ ਹਾਂ।",
    sample_romanization: "sujhaa lai dhanvaad; is audit trail vich hadd ehi rahegi, par agle chakkar naal is nu jorde haan.",
    sample_vi: "Cảm ơn đề xuất; trong audit trail này phạm vi sẽ giữ như vậy, nhưng ta nối nó với vòng sau.",
    sample_en: "Thank you for the suggestion; in this audit trail the scope stays as is, but we link it to the next cycle.",
    audit_trail_phrases: [
      { gurmukhi: "ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ", romanization: "sujhaa lai dhanvaad", vi: "Cảm ơn đề xuất.", en: "Thank you for the suggestion." },
      { gurmukhi: "ਅਗਲੇ ਚੱਕਰ ਨਾਲ", romanization: "agle chakkar naal", vi: "Với vòng sau.", en: "With the next cycle." },
    ],
    audit_trail_checks: [
      { check_vi: "Có giữ quan hệ và tạo đường theo dõi không?", check_en: "Does it preserve rapport and create a follow-up path?", signal_vi: "Có ਧੰਨਵਾਦ and ਅਗਲੇ ਚੱਕਰ.", signal_en: "Uses thanks and next cycle." },
    ],
    learner_trap: {
      trap_vi: "Chỉ nói 'để sau' mà không ghi đường theo dõi.",
      trap_en: "Only saying 'later' without logging the path is vague.",
      repair_vi: "Cảm ơn và nối đề xuất với vòng sau.",
      repair_en: "Thank them and link the suggestion to a later cycle.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_audit_trail_mediation_evidence_receipt",
    focus: "mediation",
    context: "public",
    style: "evidence_receipt_audit",
    title_vi: "audit trail: trung gian công khai",
    title_en: "audit trail: public mediation",
    scenario_vi: "Hai bên cần audit trail cho thấy ý kiến hai phía và tiêu chí chung.",
    scenario_en: "Two sides need an audit trail showing both points and shared criteria.",
    audit_trail_goal_vi: "Ghi hai phía, nối với tiêu chí chung, và tránh nghiêng về một bên.",
    audit_trail_goal_en: "Record both sides, link them to shared criteria, and avoid leaning toward one side.",
    sample_gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਗੱਲ audit trail ਵਿੱਚ ਦਰਜ ਹੈ; ਫੈਸਲਾ ਸਾਂਝੇ ਮਾਪਦੰਡ ਨਾਲ ਜੋੜਿਆ ਗਿਆ ਹੈ।",
    sample_romanization: "dovein pasian di gall audit trail vich darj hai; faisla sanjhe mapdand naal joria giya hai.",
    sample_vi: "Ý kiến của cả hai bên đã được ghi trong audit trail; quyết định được nối với tiêu chí chung.",
    sample_en: "Both sides' points are recorded in the audit trail; the decision is linked to shared criteria.",
    audit_trail_phrases: [
      { gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਗੱਲ", romanization: "dovein pasian di gall", vi: "Ý kiến của cả hai bên.", en: "Both sides' points." },
      { gurmukhi: "ਸਾਂਝੇ ਮਾਪਦੰਡ", romanization: "sanjhe mapdand", vi: "Tiêu chí chung.", en: "Shared criteria." },
    ],
    audit_trail_checks: [
      { check_vi: "Có ghi trung lập và tiêu chí chung không?", check_en: "Does it log neutrality and shared criteria?", signal_vi: "Có ਦੋਵੇਂ ਪਾਸਿਆਂ and ਸਾਂਝੇ ਮਾਪਦੰਡ.", signal_en: "Uses both sides and shared criteria." },
    ],
    learner_trap: {
      trap_vi: "Ghi audit như một bên thắng làm mất trung lập.",
      trap_en: "Logging the audit like one side won loses neutrality.",
      repair_vi: "Ghi cả hai phía và tiêu chí chung.",
      repair_en: "Record both sides and shared criteria.",
    },
  },
  {
    id: "pa_c2_audit_trail_deescalation_pre_integration",
    focus: "deescalation",
    context: "professional",
    style: "pre_integration",
    title_vi: "audit trail: hạ nhiệt trước tích hợp",
    title_en: "audit trail: de-escalation before integration",
    scenario_vi: "Một lỗi nhỏ bị nhắc lại khi nhóm ghi audit trail trước tích hợp.",
    scenario_en: "A small issue is repeated while the group logs the audit trail before integration.",
    audit_trail_goal_vi: "Ghi vấn đề, tách khỏi cá nhân, và nối với bước sửa.",
    audit_trail_goal_en: "Record the issue, separate it from the person, and link it to the repair step.",
    sample_gurmukhi: "ਮੁੱਦਾ audit trail ਵਿੱਚ ਦਰਜ ਹੈ; ਹੁਣ ਵਿਅਕਤੀ ਨਹੀਂ, ਇਸ ਨੂੰ ਸੁਧਾਰ ਦੇ ਕਦਮ ਨਾਲ ਜੋੜੀਏ।",
    sample_romanization: "mudda audit trail vich darj hai; hun vyakti nahin, is nu sudhaar de kadam naal jorie.",
    sample_vi: "Vấn đề đã được ghi trong audit trail; bây giờ không nhắm vào cá nhân, hãy nối nó với bước sửa.",
    sample_en: "The issue is recorded in the audit trail; now it is not about the person, so let's link it to the repair step.",
    audit_trail_phrases: [
      { gurmukhi: "ਵਿਅਕਤੀ ਨਹੀਂ", romanization: "vyakti nahin", vi: "Không nhắm vào cá nhân.", en: "Not the person." },
      { gurmukhi: "ਸੁਧਾਰ ਦੇ ਕਦਮ ਨਾਲ", romanization: "sudhaar de kadam naal", vi: "Với bước sửa.", en: "With the repair step." },
    ],
    audit_trail_checks: [
      { check_vi: "Có hạ nhiệt bằng đường nối đến bước sửa không?", check_en: "Does it de-escalate by linking to the repair step?", signal_vi: "Có ਵਿਅਕਤੀ ਨਹੀਂ and ਸੁਧਾਰ.", signal_en: "Uses not the person and repair." },
    ],
    learner_trap: {
      trap_vi: "Ghi lỗi với tên người giữ căng thẳng.",
      trap_en: "Logging the issue with a person's name keeps tension.",
      repair_vi: "Nối vấn đề với bước sửa, không với cá nhân.",
      repair_en: "Link the issue to the repair step, not the person.",
    },
  },
  {
    id: "pa_c2_audit_trail_audience_adaptation_canada",
    focus: "audience_adaptation",
    context: "community",
    style: "pre_a11_audit_trail",
    title_vi: "audit trail: chỉnh giọng cho nhóm đa thế hệ",
    title_en: "audit trail: adapting for a multi-generational group",
    scenario_vi: "Bạn báo audit trail cho phụ huynh, tình nguyện viên, và người học ở Canada.",
    scenario_en: "You announce the audit trail to parents, volunteers, and learners in Canada.",
    audit_trail_goal_vi: "Dùng câu dễ theo, nói trạng thái, và nêu khi nào dùng.",
    audit_trail_goal_en: "Use easy-to-follow wording, state the status, and say when it will be used.",
    sample_gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ, audit trail ਪੂਰਾ ਹੈ; ਅਗਲੇ ਹਫ਼ਤੇ ਇਹ ਕਲਾਸ ਵਿੱਚ ਵਰਤਿਆ ਜਾਵੇਗਾ।",
    sample_romanization: "sadharan shabdan vich, audit trail poora hai; agle hafte ih class vich vartia javega.",
    sample_vi: "Nói đơn giản, audit trail đã hoàn tất; tuần sau sẽ được dùng trong lớp.",
    sample_en: "In simple terms, the audit trail is complete; next week it will be used in class.",
    audit_trail_phrases: [
      { gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ", romanization: "sadharan shabdan vich", vi: "Nói bằng từ đơn giản.", en: "In simple terms." },
      { gurmukhi: "ਅਗਲੇ ਹਫ਼ਤੇ", romanization: "agle hafte", vi: "Tuần sau.", en: "Next week." },
    ],
    audit_trail_checks: [
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
    id: "pa_c2_audit_trail_sensitive_topic_framing",
    focus: "sensitive_topic_framing",
    context: "public",
    style: "traceability_audit",
    title_vi: "audit trail: khung chủ đề nhạy cảm",
    title_en: "audit trail: sensitive-topic framing",
    scenario_vi: "Bạn ghi audit trail cho chủ đề nhạy cảm, mục tiêu chung, và quy trình góp ý.",
    scenario_en: "You log an audit trail for a sensitive topic, shared goal, and input process.",
    audit_trail_goal_vi: "Nói mục tiêu chung, giảm quy kết, và nối với quy trình góp ý.",
    audit_trail_goal_en: "Name the shared goal, reduce blame, and link to the input process.",
    sample_gurmukhi: "ਮਕਸਦ ਦੋਸ਼ ਦੇਣਾ ਨਹੀਂ ਸੀ; audit trail ਵਿੱਚ ਸਾਂਝਾ ਹੱਲ ਅਤੇ ਸੁਝਾਅ ਦੇ ਕ੍ਰਮ ਨੂੰ ਜੋੜੀਏ।",
    sample_romanization: "maqsad dosh dena nahin si; audit trail vich sanjha hall ate sujhaa de kram nu jorie.",
    sample_vi: "Mục đích không phải đổ lỗi; trong audit trail hãy nối giải pháp chung và thứ tự góp ý.",
    sample_en: "The aim was not to blame; in the audit trail let's link the shared solution and the order for input.",
    audit_trail_phrases: [
      { gurmukhi: "ਦੋਸ਼ ਦੇਣਾ ਨਹੀਂ ਸੀ", romanization: "dosh dena nahin si", vi: "Không phải đổ lỗi.", en: "It was not to blame." },
      { gurmukhi: "ਸਾਂਝਾ ਹੱਲ", romanization: "sanjha hall", vi: "Giải pháp chung.", en: "Shared solution." },
    ],
    audit_trail_checks: [
      { check_vi: "Có nối chủ đề nhạy cảm với mục tiêu chung không?", check_en: "Does it link the sensitive topic to a shared goal?", signal_vi: "Có ਦੋਸ਼ ਨਹੀਂ and ਸਾਂਝਾ ਹੱਲ.", signal_en: "Uses not blame and shared solution." },
    ],
    learner_trap: {
      trap_vi: "Ghi chủ đề như lỗi của một nhóm làm căng lại.",
      trap_en: "Logging the topic as one group's fault makes it tense again.",
      repair_vi: "Ghi mục tiêu chung và quy trình góp ý.",
      repair_en: "Log the shared goal and input process.",
    },
  },
  {
    id: "pa_c2_audit_trail_public_communication_calibration",
    focus: "public_communication_calibration",
    context: "public",
    style: "evidence_receipt_audit",
    title_vi: "audit trail: cân chỉnh thông báo công khai",
    title_en: "audit trail: public communication calibration",
    scenario_vi: "Bạn ghi audit trail cho thông báo thay đổi dịch vụ cộng đồng ở Canada.",
    scenario_en: "You log an audit trail for a community-service change notice in Canada.",
    audit_trail_goal_vi: "Nói thay đổi, lý do ngắn, và đường nhận hỗ trợ.",
    audit_trail_goal_en: "State the change, give a short reason, and name the support path.",
    sample_gurmukhi: "ਸੇਵਾ ਦਾ ਸਮਾਂ ਬਦਲਿਆ ਹੈ; ਕਾਰਨ ਸਟਾਫ਼ ਦੀ ਘਾਟ ਹੈ, ਅਤੇ audit trail ਵਿੱਚ ਮਦਦ ਵਾਲੇ ਡੈਸਕ ਨਾਲ ਜੋੜੀਏ।",
    sample_romanization: "seva da sama badlia hai; karan staff di ghaat hai, ate audit trail vich madad wale desk naal jorie.",
    sample_vi: "Giờ dịch vụ đã đổi; lý do là thiếu nhân sự, và trong audit trail hãy nối với bàn hỗ trợ.",
    sample_en: "The service time has changed; the reason is staff shortage, and in the audit trail let's link it to the help desk.",
    audit_trail_phrases: [
      { gurmukhi: "ਸੇਵਾ ਦਾ ਸਮਾਂ ਬਦਲਿਆ ਹੈ", romanization: "seva da sama badlia hai", vi: "Giờ dịch vụ đã đổi.", en: "The service time has changed." },
      { gurmukhi: "ਮਦਦ ਵਾਲੇ ਡੈਸਕ", romanization: "madad wale desk", vi: "Bàn hỗ trợ.", en: "Help desk." },
    ],
    audit_trail_checks: [
      { check_vi: "Có nối thay đổi với lý do và hỗ trợ không?", check_en: "Does it link the change to reason and support?", signal_vi: "Có service change, reason, and help desk.", signal_en: "Includes service change, reason, and help desk." },
    ],
    learner_trap: {
      trap_vi: "Ghi thay đổi mà không có hỗ trợ làm người đọc kẹt.",
      trap_en: "Logging a change without support leaves readers stuck.",
      repair_vi: "Thêm lý do ngắn và nơi nhận hỗ trợ.",
      repair_en: "Add a short reason and where to get support.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_audit_trail_register_safety",
    focus: "register_safety",
    context: "professional",
    style: "pre_integration",
    title_vi: "audit trail: an toàn register",
    title_en: "audit trail: register safety",
    scenario_vi: "Bạn ghi audit trail cho câu đã sửa theo register chuyên nghiệp.",
    scenario_en: "You log an audit trail for a line repaired into professional register.",
    audit_trail_goal_vi: "Giữ lịch sự, cụ thể, không phóng đại, và có yêu cầu rõ.",
    audit_trail_goal_en: "Stay polite, specific, not exaggerated, and clear in the request.",
    sample_gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇਸ audit trail ਦੀ ਸਮੀਖਿਆ ਕਰੋ ਅਤੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।",
    sample_romanization: "kirpa karke is audit trail di samikhia karo ate agla kadam daso.",
    sample_vi: "Vui lòng xem xét audit trail này và cho biết bước tiếp theo.",
    sample_en: "Please review this audit trail and advise the next step.",
    audit_trail_phrases: [
      { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ", romanization: "kirpa karke", vi: "Vui lòng.", en: "Please." },
      { gurmukhi: "ਅਗਲਾ ਕਦਮ ਦੱਸੋ", romanization: "agla kadam daso", vi: "Cho biết bước tiếp theo.", en: "Advise the next step." },
    ],
    audit_trail_checks: [
      { check_vi: "Có ghi register chuyên nghiệp rõ ràng không?", check_en: "Does it log clear professional register?", signal_vi: "Có ਕਿਰਪਾ ਕਰਕੇ and ਅਗਲਾ ਕਦਮ.", signal_en: "Uses please and next step." },
    ],
    learner_trap: {
      trap_vi: "Quá thân mật hoặc quá giận làm mất register chuyên nghiệp.",
      trap_en: "Being too casual or angry loses professional register.",
      repair_vi: "Dùng câu lịch sự với yêu cầu cụ thể.",
      repair_en: "Use a polite line with a concrete request.",
    },
  },
];

export const c2AuditTrailSamplesByFocus = (focus: PunjabiC2AuditTrailFocus) =>
  c2AuditTrailSamples.filter((item) => item.focus === focus);

export const c2AuditTrailSamplesByStyle = (style: PunjabiC2AuditTrailStyle) =>
  c2AuditTrailSamples.filter((item) => item.style === style);

export default c2AuditTrailSamples;
