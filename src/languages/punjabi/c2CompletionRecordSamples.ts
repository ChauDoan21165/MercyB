// Punjabi C2 completion record samples for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support completion record samples only, not certification,
// official placement, legal/HR/medical/safety advice, or native review.
// Native review is deferred. Shahmukhi is mentioned only for script awareness,
// not as a full course.

export type PunjabiC2CompletionRecordFocus =
  | "nuanced_disagreement"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "audience_adaptation"
  | "sensitive_topic_framing"
  | "public_communication_calibration"
  | "register_safety";

export type PunjabiC2CompletionRecordContext = "public" | "professional" | "community";
export type PunjabiC2CompletionRecordStyle =
  | "pre_a11_completion_record"
  | "inventory_seal_record"
  | "catalog_record"
  | "pre_integration";

export type PunjabiC2CompletionRecordPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2CompletionRecordCheck = {
  check_vi: string;
  check_en: string;
  signal_vi: string;
  signal_en: string;
};

export type PunjabiC2CompletionRecordTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2CompletionRecordSample = {
  id: string;
  focus: PunjabiC2CompletionRecordFocus;
  context: PunjabiC2CompletionRecordContext;
  style: PunjabiC2CompletionRecordStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  completion_record_goal_vi: string;
  completion_record_goal_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  completion_record_phrases: PunjabiC2CompletionRecordPhrase[];
  completion_record_checks: PunjabiC2CompletionRecordCheck[];
  learner_trap: PunjabiC2CompletionRecordTrap;
  canada_practical?: boolean;
};

export const C2_COMPLETION_RECORD_SAMPLES_DISCLAIMER = {
  vi: "Bộ completion record Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi completion record sample pack supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const c2CompletionRecordSamples: PunjabiC2CompletionRecordSample[] = [
  {
    id: "pa_c2_completion_record_nuanced_disagreement_pre_a11",
    focus: "nuanced_disagreement",
    context: "professional",
    style: "pre_a11_completion_record",
    title_vi: "completion record: bất đồng tinh tế",
    title_en: "completion record: nuanced disagreement",
    scenario_vi: "Bạn ghi completion record cho mẫu phản biện trước khi chuyển A11 sau này.",
    scenario_en: "You record completion for a challenge sample before a later A11 handoff.",
    completion_record_goal_vi: "Công nhận điểm mạnh, ghi rủi ro đã kiểm tra, và chốt mẫu ổn định.",
    completion_record_goal_en: "Acknowledge the strength, record the checked risk, and close the stable sample.",
    sample_gurmukhi: "ਮੁੱਖ ਦਲੀਲ ਮਜ਼ਬੂਤ ਹੈ; ਜੋਖਮ ਆਖਰੀ ਵਾਰੀ ਪਰਖਿਆ ਗਿਆ ਹੈ, ਇਸ ਲਈ completion record ਪੱਕਾ ਕਰੀਏ।",
    sample_romanization: "mukh dalil mazboot hai; jokham aakhri vari parakhia giya hai, is lai completion record pakka kariye.",
    sample_vi: "Lập luận chính mạnh; rủi ro đã được kiểm tra lần cuối, nên hãy ổn định completion record.",
    sample_en: "The main argument is strong; the risk has been checked one last time, so let's confirm the completion record.",
    completion_record_phrases: [
      { gurmukhi: "ਮੁੱਖ ਦਲੀਲ ਮਜ਼ਬੂਤ ਹੈ", romanization: "mukh dalil mazboot hai", vi: "Lập luận chính mạnh.", en: "The main argument is strong." },
      { gurmukhi: "ਜੋਖਮ ਆਖਰੀ ਵਾਰੀ ਪਰਖਿਆ ਗਿਆ ਹੈ", romanization: "jokham aakhri vari parakhia giya hai", vi: "Rủi ro đã được kiểm tra lần cuối.", en: "The risk has been checked one last time." },
    ],
    completion_record_checks: [
      { check_vi: "Có ghi bất đồng đã được xử lý không?", check_en: "Does it record that disagreement was handled?", signal_vi: "Có ਮਜ਼ਬੂਤ and ਜੋਖਮ ਪਰਖਿਆ.", signal_en: "Uses strong and risk checked." },
    ],
    learner_trap: {
      trap_vi: "Ghi hoàn tất khi rủi ro chưa được nhắc làm record yếu.",
      trap_en: "Marking completion without naming the risk weakens the record.",
      repair_vi: "Ghi điểm mạnh và rủi ro đã kiểm tra.",
      repair_en: "Record the strength and the checked risk.",
    },
  },
  {
    id: "pa_c2_completion_record_diplomacy_inventory_seal",
    focus: "diplomacy",
    context: "community",
    style: "inventory_seal_record",
    title_vi: "completion record: ngoại giao phạm vi",
    title_en: "completion record: scope diplomacy",
    scenario_vi: "Một nhóm cộng đồng ở Canada đề nghị thêm mục sau khi completion record đã gần chốt.",
    scenario_en: "A Canadian community group suggests an addition after the completion record is nearly final.",
    completion_record_goal_vi: "Cảm ơn, giữ phạm vi đã hoàn tất, và ghi lại cho vòng sau.",
    completion_record_goal_en: "Thank them, keep the completed scope, and record it for a later cycle.",
    sample_gurmukhi: "ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ; ਇਸ completion record ਵਿੱਚ ਹੱਦ ਪੂਰੀ ਹੋ ਚੁੱਕੀ ਹੈ, ਪਰ ਅਗਲੇ ਚੱਕਰ ਲਈ ਇਸ ਨੂੰ ਰੱਖਦੇ ਹਾਂ।",
    sample_romanization: "sujhaa lai dhanvaad; is completion record vich hadd poori ho chukki hai, par agle chakkar lai is nu rakhde haan.",
    sample_vi: "Cảm ơn đề xuất; trong completion record này phạm vi đã hoàn tất, nhưng ta giữ lại cho vòng sau.",
    sample_en: "Thank you for the suggestion; in this completion record the scope is complete, but we will keep it for the next cycle.",
    completion_record_phrases: [
      { gurmukhi: "ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ", romanization: "sujhaa lai dhanvaad", vi: "Cảm ơn đề xuất.", en: "Thank you for the suggestion." },
      { gurmukhi: "ਅਗਲੇ ਚੱਕਰ ਲਈ", romanization: "agle chakkar lai", vi: "Cho vòng sau.", en: "For the next cycle." },
    ],
    completion_record_checks: [
      { check_vi: "Có giữ phạm vi đã hoàn tất mà vẫn lịch sự không?", check_en: "Does it preserve completed scope while staying polite?", signal_vi: "Có ਧੰਨਵਾਦ and ਅਗਲੇ ਚੱਕਰ.", signal_en: "Uses thanks and next cycle." },
    ],
    learner_trap: {
      trap_vi: "Nói 'đã xong rồi' quá cụt làm mất ngoại giao.",
      trap_en: "Saying 'it is done' too abruptly loses diplomacy.",
      repair_vi: "Cảm ơn và lưu đề xuất cho vòng sau.",
      repair_en: "Thank them and retain the suggestion for a later cycle.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_completion_record_mediation_catalog",
    focus: "mediation",
    context: "public",
    style: "catalog_record",
    title_vi: "completion record: trung gian công khai",
    title_en: "completion record: public mediation",
    scenario_vi: "Hai bên muốn record cuối ghi rõ rằng cả hai ý kiến đã được cân nhắc.",
    scenario_en: "Two sides want the final record to show that both points were considered.",
    completion_record_goal_vi: "Ghi nhận hai phía, dùng tiêu chí chung, và chốt quyết định.",
    completion_record_goal_en: "Record both sides, use shared criteria, and confirm the decision.",
    sample_gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਗੱਲ completion record ਵਿੱਚ ਦਰਜ ਹੈ; ਫੈਸਲਾ ਸਾਂਝੇ ਮਾਪਦੰਡ ਦੇ ਆਧਾਰ ਤੇ ਹੋਇਆ ਹੈ।",
    sample_romanization: "dovein pasian di gall completion record vich darj hai; faisla sanjhe mapdand de aadhaar te hoia hai.",
    sample_vi: "Ý kiến của cả hai bên đã được ghi trong completion record; quyết định dựa trên tiêu chí chung.",
    sample_en: "Both sides' points are recorded in the completion record; the decision was based on shared criteria.",
    completion_record_phrases: [
      { gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਗੱਲ", romanization: "dovein pasian di gall", vi: "Ý kiến của cả hai bên.", en: "Both sides' points." },
      { gurmukhi: "ਸਾਂਝੇ ਮਾਪਦੰਡ", romanization: "sanjhe mapdand", vi: "Tiêu chí chung.", en: "Shared criteria." },
    ],
    completion_record_checks: [
      { check_vi: "Có ghi trung lập và tiêu chí chung không?", check_en: "Does it record neutrality and shared criteria?", signal_vi: "Có ਦੋਵੇਂ ਪਾਸਿਆਂ and ਸਾਂਝੇ ਮਾਪਦੰਡ.", signal_en: "Uses both sides and shared criteria." },
    ],
    learner_trap: {
      trap_vi: "Ghi record như chiến thắng của một bên làm mất trung lập.",
      trap_en: "Writing the record like one side won loses neutrality.",
      repair_vi: "Ghi nhận cả hai bên và tiêu chí quyết định.",
      repair_en: "Record both sides and the decision criteria.",
    },
  },
  {
    id: "pa_c2_completion_record_deescalation_pre_integration",
    focus: "deescalation",
    context: "professional",
    style: "pre_integration",
    title_vi: "completion record: hạ nhiệt trước tích hợp",
    title_en: "completion record: de-escalation before integration",
    scenario_vi: "Một lỗi nhỏ bị nhắc lại khi nhóm chốt completion record.",
    scenario_en: "A small issue is repeated while the group closes the completion record.",
    completion_record_goal_vi: "Ghi nhận vấn đề, tách khỏi cá nhân, và nêu bước sửa đã chốt.",
    completion_record_goal_en: "Acknowledge the issue, separate it from the person, and state the confirmed repair step.",
    sample_gurmukhi: "ਮੁੱਦਾ completion record ਵਿੱਚ ਦਰਜ ਹੈ; ਹੁਣ ਵਿਅਕਤੀ ਨਹੀਂ, ਸੁਧਾਰ ਦਾ ਕਦਮ ਪੱਕਾ ਹੋ ਚੁੱਕਾ ਹੈ।",
    sample_romanization: "mudda completion record vich darj hai; hun vyakti nahin, sudhaar da kadam pakka ho chukka hai.",
    sample_vi: "Vấn đề đã được ghi trong completion record; bây giờ không nhắm vào cá nhân, bước sửa đã được chốt.",
    sample_en: "The issue is recorded in the completion record; now it is not about the person, and the repair step is confirmed.",
    completion_record_phrases: [
      { gurmukhi: "ਮੁੱਦਾ completion record ਵਿੱਚ ਦਰਜ ਹੈ", romanization: "mudda completion record vich darj hai", vi: "Vấn đề đã được ghi trong completion record.", en: "The issue is recorded in the completion record." },
      { gurmukhi: "ਵਿਅਕਤੀ ਨਹੀਂ", romanization: "vyakti nahin", vi: "Không nhắm vào cá nhân.", en: "Not the person." },
    ],
    completion_record_checks: [
      { check_vi: "Có hạ nhiệt bằng bước sửa đã chốt không?", check_en: "Does it de-escalate with a confirmed repair step?", signal_vi: "Có ਵਿਅਕਤੀ ਨਹੀਂ and ਸੁਧਾਰ.", signal_en: "Uses not the person and repair." },
    ],
    learner_trap: {
      trap_vi: "Ghi tên người làm record tiếp tục căng.",
      trap_en: "Recording the person's name keeps the record tense.",
      repair_vi: "Tách vấn đề khỏi người và nêu bước sửa.",
      repair_en: "Separate the issue from the person and state the repair step.",
    },
  },
  {
    id: "pa_c2_completion_record_audience_adaptation_canada",
    focus: "audience_adaptation",
    context: "community",
    style: "pre_a11_completion_record",
    title_vi: "completion record: chỉnh giọng cho nhóm đa thế hệ",
    title_en: "completion record: adapting for a multi-generational group",
    scenario_vi: "Bạn báo completion record cho phụ huynh, tình nguyện viên, và người học ở Canada.",
    scenario_en: "You announce the completion record to parents, volunteers, and learners in Canada.",
    completion_record_goal_vi: "Dùng câu dễ theo, nói trạng thái đã hoàn tất, và nêu khi nào dùng.",
    completion_record_goal_en: "Use easy-to-follow wording, state completed status, and say when it will be used.",
    sample_gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ, completion record ਪੂਰਾ ਹੈ; ਅਗਲੇ ਹਫ਼ਤੇ ਇਹ ਕਲਾਸ ਵਿੱਚ ਵਰਤਿਆ ਜਾਵੇਗਾ।",
    sample_romanization: "sadharan shabdan vich, completion record poora hai; agle hafte ih class vich vartia javega.",
    sample_vi: "Nói đơn giản, completion record đã hoàn tất; tuần sau sẽ được dùng trong lớp.",
    sample_en: "In simple terms, the completion record is complete; next week it will be used in class.",
    completion_record_phrases: [
      { gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ", romanization: "sadharan shabdan vich", vi: "Nói bằng từ đơn giản.", en: "In simple terms." },
      { gurmukhi: "ਅਗਲੇ ਹਫ਼ਤੇ", romanization: "agle hafte", vi: "Tuần sau.", en: "Next week." },
    ],
    completion_record_checks: [
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
    id: "pa_c2_completion_record_sensitive_topic_framing",
    focus: "sensitive_topic_framing",
    context: "public",
    style: "inventory_seal_record",
    title_vi: "completion record: khung chủ đề nhạy cảm",
    title_en: "completion record: sensitive-topic framing",
    scenario_vi: "Bạn ghi record cuối cho cách mở chủ đề nhạy cảm trong buổi cộng đồng.",
    scenario_en: "You write the final record for opening a sensitive topic in a community session.",
    completion_record_goal_vi: "Nói mục tiêu chung, giảm quy kết, và ghi quy trình góp ý.",
    completion_record_goal_en: "Name the shared goal, reduce blame, and record the input process.",
    sample_gurmukhi: "ਮਕਸਦ ਦੋਸ਼ ਦੇਣਾ ਨਹੀਂ ਸੀ; completion record ਵਿੱਚ ਸਾਂਝਾ ਹੱਲ ਅਤੇ ਸੁਝਾਅ ਕ੍ਰਮ ਨਾਲ ਸੁਣਨ ਦੀ ਗੱਲ ਦਰਜ ਹੈ।",
    sample_romanization: "maqsad dosh dena nahin si; completion record vich sanjha hall ate sujhaa kram naal sunnan di gall darj hai.",
    sample_vi: "Mục đích không phải đổ lỗi; completion record ghi giải pháp chung và việc nghe góp ý theo thứ tự.",
    sample_en: "The aim was not to blame; the completion record notes the shared solution and hearing suggestions in order.",
    completion_record_phrases: [
      { gurmukhi: "ਦੋਸ਼ ਦੇਣਾ ਨਹੀਂ ਸੀ", romanization: "dosh dena nahin si", vi: "Không phải đổ lỗi.", en: "It was not to blame." },
      { gurmukhi: "ਸਾਂਝਾ ਹੱਲ", romanization: "sanjha hall", vi: "Giải pháp chung.", en: "Shared solution." },
    ],
    completion_record_checks: [
      { check_vi: "Có giữ khung nhạy cảm mà không quy kết không?", check_en: "Does it preserve sensitive framing without blame?", signal_vi: "Có ਦੋਸ਼ ਨਹੀਂ and ਸਾਂਝਾ ਹੱਲ.", signal_en: "Uses not blame and shared solution." },
    ],
    learner_trap: {
      trap_vi: "Ghi record bằng lỗi của một nhóm làm chủ đề căng lại.",
      trap_en: "Recording the issue as one group's fault makes it tense again.",
      repair_vi: "Ghi mục tiêu chung và quy trình góp ý.",
      repair_en: "Record the shared goal and input process.",
    },
  },
  {
    id: "pa_c2_completion_record_public_communication_calibration",
    focus: "public_communication_calibration",
    context: "public",
    style: "catalog_record",
    title_vi: "completion record: cân chỉnh thông báo công khai",
    title_en: "completion record: public communication calibration",
    scenario_vi: "Bạn ghi record cuối cho thông báo thay đổi dịch vụ cộng đồng ở Canada.",
    scenario_en: "You write the final record for a community-service change notice in Canada.",
    completion_record_goal_vi: "Nói thay đổi, lý do ngắn, và nơi nhận hỗ trợ.",
    completion_record_goal_en: "State the change, give a short reason, and name where to get support.",
    sample_gurmukhi: "ਸੇਵਾ ਦਾ ਸਮਾਂ ਬਦਲਿਆ ਹੈ; ਕਾਰਨ ਸਟਾਫ਼ ਦੀ ਘਾਟ ਹੈ, ਅਤੇ ਮਦਦ ਲਈ ਡੈਸਕ ਖੁੱਲ੍ਹਾ ਰਹੇਗਾ।",
    sample_romanization: "seva da sama badlia hai; karan staff di ghaat hai, ate madad lai desk khulla rahega.",
    sample_vi: "Giờ dịch vụ đã đổi; lý do là thiếu nhân sự, và bàn hỗ trợ sẽ vẫn mở.",
    sample_en: "The service time has changed; the reason is staff shortage, and the help desk will remain open.",
    completion_record_phrases: [
      { gurmukhi: "ਸੇਵਾ ਦਾ ਸਮਾਂ ਬਦਲਿਆ ਹੈ", romanization: "seva da sama badlia hai", vi: "Giờ dịch vụ đã đổi.", en: "The service time has changed." },
      { gurmukhi: "ਮਦਦ ਲਈ ਡੈਸਕ", romanization: "madad lai desk", vi: "Bàn hỗ trợ.", en: "Help desk." },
    ],
    completion_record_checks: [
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
    id: "pa_c2_completion_record_register_safety",
    focus: "register_safety",
    context: "professional",
    style: "pre_integration",
    title_vi: "completion record: an toàn register",
    title_en: "completion record: register safety",
    scenario_vi: "Bạn sửa câu quá thân mật trước khi ghi completion record chuyên nghiệp.",
    scenario_en: "You repair an overly casual line before writing a professional completion record.",
    completion_record_goal_vi: "Giữ lịch sự, cụ thể, không phóng đại, và có yêu cầu rõ.",
    completion_record_goal_en: "Stay polite, specific, not exaggerated, and clear in the request.",
    sample_gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇਸ completion record ਦੀ ਸਮੀਖਿਆ ਕਰੋ ਅਤੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।",
    sample_romanization: "kirpa karke is completion record di samikhia karo ate agla kadam daso.",
    sample_vi: "Vui lòng xem xét completion record này và cho biết bước tiếp theo.",
    sample_en: "Please review this completion record and advise the next step.",
    completion_record_phrases: [
      { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ", romanization: "kirpa karke", vi: "Vui lòng.", en: "Please." },
      { gurmukhi: "ਅਗਲਾ ਕਦਮ ਦੱਸੋ", romanization: "agla kadam daso", vi: "Cho biết bước tiếp theo.", en: "Advise the next step." },
    ],
    completion_record_checks: [
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

export const c2CompletionRecordSamplesByFocus = (focus: PunjabiC2CompletionRecordFocus) =>
  c2CompletionRecordSamples.filter((item) => item.focus === focus);

export const c2CompletionRecordSamplesByStyle = (style: PunjabiC2CompletionRecordStyle) =>
  c2CompletionRecordSamples.filter((item) => item.style === style);

export default c2CompletionRecordSamples;
