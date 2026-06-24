// Punjabi C2 receipt samples for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support receipt samples only, not certification,
// official placement, legal/HR/medical/safety advice, or native review.
// Native review is deferred. Shahmukhi is mentioned only for script awareness,
// not as a full course.

export type PunjabiC2ReceiptFocus =
  | "nuanced_disagreement"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "audience_adaptation"
  | "sensitive_topic_framing"
  | "public_communication_calibration"
  | "register_safety";

export type PunjabiC2ReceiptContext = "public" | "professional" | "community";
export type PunjabiC2ReceiptStyle =
  | "pre_a11_receipt"
  | "ledger_receipt"
  | "archive_receipt"
  | "pre_integration";

export type PunjabiC2ReceiptPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2ReceiptCheck = {
  check_vi: string;
  check_en: string;
  signal_vi: string;
  signal_en: string;
};

export type PunjabiC2ReceiptTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2ReceiptSample = {
  id: string;
  focus: PunjabiC2ReceiptFocus;
  context: PunjabiC2ReceiptContext;
  style: PunjabiC2ReceiptStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  receipt_goal_vi: string;
  receipt_goal_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  receipt_phrases: PunjabiC2ReceiptPhrase[];
  receipt_checks: PunjabiC2ReceiptCheck[];
  learner_trap: PunjabiC2ReceiptTrap;
  canada_practical?: boolean;
};

export const C2_RECEIPT_SAMPLES_DISCLAIMER = {
  vi: "Bộ receipt Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi receipt sample pack supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const c2ReceiptSamples: PunjabiC2ReceiptSample[] = [
  {
    id: "pa_c2_receipt_nuanced_disagreement_pre_a11",
    focus: "nuanced_disagreement",
    context: "professional",
    style: "pre_a11_receipt",
    title_vi: "receipt: bất đồng tinh tế",
    title_en: "receipt: nuanced disagreement",
    scenario_vi: "Bạn ghi nhận một phản biện trước khi khóa bộ mẫu cho A11 sau này.",
    scenario_en: "You record a challenge before a later A11 handoff.",
    receipt_goal_vi: "Công nhận điểm mạnh, nêu rủi ro, và đề nghị kiểm tra thêm.",
    receipt_goal_en: "Acknowledge the strength, name the risk, and ask for one more check.",
    sample_gurmukhi: "ਮੁੱਖ ਦਲੀਲ ਮਜ਼ਬੂਤ ਹੈ, ਪਰ receipt ਤੋਂ ਪਹਿਲਾਂ ਇਸ ਜੋਖਮ ਨੂੰ ਇੱਕ ਵਾਰੀ ਹੋਰ ਵੇਖ ਲਈਏ।",
    sample_romanization: "mukh dalil mazboot hai, par receipt ton pehlan is jokham nu ikk vari hor vekh laie.",
    sample_vi: "Lập luận chính mạnh, nhưng trước receipt hãy xem lại rủi ro này thêm một lần.",
    sample_en: "The main argument is strong, but before the receipt let's review this risk once more.",
    receipt_phrases: [
      { gurmukhi: "ਮੁੱਖ ਦਲੀਲ ਮਜ਼ਬੂਤ ਹੈ", romanization: "mukh dalil mazboot hai", vi: "Lập luận chính mạnh.", en: "The main argument is strong." },
      { gurmukhi: "ਜੋਖਮ ਨੂੰ ਇੱਕ ਵਾਰੀ ਹੋਰ ਵੇਖ ਲਈਏ", romanization: "jokham nu ikk vari hor vekh laie", vi: "Hãy xem lại rủi ro thêm một lần.", en: "Let's review the risk once more." },
    ],
    receipt_checks: [
      { check_vi: "Có phản biện mà không phủ định toàn bộ không?", check_en: "Does it challenge without rejecting everything?", signal_vi: "Có ਮਜ਼ਬੂਤ and ਜੋਖਮ.", signal_en: "Uses strong and risk." },
    ],
    learner_trap: {
      trap_vi: "Mở đầu bằng 'sai rồi' làm mất register C2.",
      trap_en: "Opening with 'this is wrong' weakens C2 register.",
      repair_vi: "Công nhận phần mạnh rồi mới nêu rủi ro.",
      repair_en: "Acknowledge the strong part before naming the risk.",
    },
  },
  {
    id: "pa_c2_receipt_diplomacy_ledger",
    focus: "diplomacy",
    context: "community",
    style: "ledger_receipt",
    title_vi: "receipt: ngoại giao với phạm vi",
    title_en: "receipt: scope diplomacy",
    scenario_vi: "Một nhóm cộng đồng ở Canada đề nghị thêm nội dung khi receipt đã gần chốt.",
    scenario_en: "A Canadian community group suggests extra content when the receipt is nearly final.",
    receipt_goal_vi: "Cảm ơn, giữ phạm vi hiện tại, và ghi lại cho vòng sau.",
    receipt_goal_en: "Thank them, keep current scope, and record it for a later cycle.",
    sample_gurmukhi: "ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ; ਇਸ receipt ਵਿੱਚ ਹੱਦ ਇਹੀ ਰਹੇਗੀ, ਪਰ ਅਗਲੇ ਚੱਕਰ ਲਈ ਨੋਟ ਕਰ ਲੈਂਦੇ ਹਾਂ।",
    sample_romanization: "sujhaa lai dhanvaad; is receipt vich hadd ehi rahegi, par agle chakkar lai note kar lainde haan.",
    sample_vi: "Cảm ơn đề xuất; trong receipt này phạm vi sẽ giữ như vậy, nhưng ta ghi lại cho vòng sau.",
    sample_en: "Thank you for the suggestion; in this receipt the scope will stay as is, but we will note it for the next cycle.",
    receipt_phrases: [
      { gurmukhi: "ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ", romanization: "sujhaa lai dhanvaad", vi: "Cảm ơn đề xuất.", en: "Thank you for the suggestion." },
      { gurmukhi: "ਅਗਲੇ ਚੱਕਰ ਲਈ ਨੋਟ", romanization: "agle chakkar lai note", vi: "Ghi lại cho vòng sau.", en: "Note for the next cycle." },
    ],
    receipt_checks: [
      { check_vi: "Có từ chối thêm phạm vi mà vẫn giữ quan hệ không?", check_en: "Does it decline extra scope while preserving rapport?", signal_vi: "Có ਧੰਨਵਾਦ and ਅਗਲੇ ਚੱਕਰ.", signal_en: "Uses thanks and next cycle." },
    ],
    learner_trap: {
      trap_vi: "Nói 'không thêm được' quá cụt.",
      trap_en: "Saying 'cannot add it' is too abrupt.",
      repair_vi: "Cảm ơn và ghi rõ nơi đề xuất sẽ được lưu.",
      repair_en: "Thank them and state where the suggestion is retained.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_receipt_mediation_archive",
    focus: "mediation",
    context: "public",
    style: "archive_receipt",
    title_vi: "receipt: trung gian trước archive",
    title_en: "receipt: mediation before archive",
    scenario_vi: "Hai bên không đồng ý về cách diễn đạt trong bản receipt công khai.",
    scenario_en: "Two sides disagree on the wording in a public receipt.",
    receipt_goal_vi: "Ghi nhận hai phía, dùng tiêu chí chung, và tách quyết định khỏi cảm xúc.",
    receipt_goal_en: "Record both sides, use shared criteria, and separate the decision from emotion.",
    sample_gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਗੱਲ receipt ਵਿੱਚ ਦਰਜ ਹੈ; ਅੰਤਿਮ ਲਫ਼ਜ਼ ਸਾਂਝੇ ਮਾਪਦੰਡ ਨਾਲ ਚੁਣੇ ਜਾਣਗੇ।",
    sample_romanization: "dovein pasian di gall receipt vich darj hai; antim lafz sanjhe mapdand naal chune jange.",
    sample_vi: "Ý kiến của cả hai bên đã được ghi trong receipt; câu cuối sẽ được chọn theo tiêu chí chung.",
    sample_en: "Both sides' points are recorded in the receipt; the final wording will be chosen by shared criteria.",
    receipt_phrases: [
      { gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਗੱਲ", romanization: "dovein pasian di gall", vi: "Ý kiến của cả hai bên.", en: "Both sides' points." },
      { gurmukhi: "ਸਾਂਝੇ ਮਾਪਦੰਡ ਨਾਲ", romanization: "sanjhe mapdand naal", vi: "Theo tiêu chí chung.", en: "By shared criteria." },
    ],
    receipt_checks: [
      { check_vi: "Có giữ trung lập khi ghi nhận không?", check_en: "Does it stay neutral while recording?", signal_vi: "Có ਦੋਵੇਂ ਪਾਸਿਆਂ and ਸਾਂਝੇ ਮਾਪਦੰਡ.", signal_en: "Uses both sides and shared criteria." },
    ],
    learner_trap: {
      trap_vi: "Ghi receipt nghiêng về một bên làm mất trung lập.",
      trap_en: "A receipt tilted toward one side loses neutrality.",
      repair_vi: "Ghi nhận cả hai bên rồi quay về tiêu chí chung.",
      repair_en: "Record both sides, then return to shared criteria.",
    },
  },
  {
    id: "pa_c2_receipt_deescalation_pre_integration",
    focus: "deescalation",
    context: "professional",
    style: "pre_integration",
    title_vi: "receipt: hạ nhiệt trước tích hợp",
    title_en: "receipt: de-escalation before integration",
    scenario_vi: "Cuộc họp căng vì lỗi nhỏ bị nhắc lại trước khi giao receipt.",
    scenario_en: "A meeting is tense because a small issue is repeated before receipt handoff.",
    receipt_goal_vi: "Nói vấn đề đã được ghi, dừng nhắm vào cá nhân, và chốt bước sửa.",
    receipt_goal_en: "Say the issue is recorded, stop personal targeting, and confirm the repair step.",
    sample_gurmukhi: "ਮੁੱਦਾ receipt ਵਿੱਚ ਦਰਜ ਹੈ; ਹੁਣ ਵਿਅਕਤੀ ਨਹੀਂ, ਸੁਧਾਰ ਦੇ ਕਦਮ ਨੂੰ ਪੱਕਾ ਕਰੀਏ।",
    sample_romanization: "mudda receipt vich darj hai; hun vyakti nahin, sudhaar de kadam nu pakka kariye.",
    sample_vi: "Vấn đề đã được ghi trong receipt; bây giờ không nhắm vào cá nhân, hãy ổn định bước sửa.",
    sample_en: "The issue is recorded in the receipt; now let's focus on the repair step, not the person.",
    receipt_phrases: [
      { gurmukhi: "ਮੁੱਦਾ receipt ਵਿੱਚ ਦਰਜ ਹੈ", romanization: "mudda receipt vich darj hai", vi: "Vấn đề đã được ghi trong receipt.", en: "The issue is recorded in the receipt." },
      { gurmukhi: "ਵਿਅਕਤੀ ਨਹੀਂ", romanization: "vyakti nahin", vi: "Không nhắm vào cá nhân.", en: "Not the person." },
    ],
    receipt_checks: [
      { check_vi: "Có hạ nhiệt bằng bước sửa cụ thể không?", check_en: "Does it de-escalate with a concrete repair step?", signal_vi: "Có ਵਿਅਕਤੀ ਨਹੀਂ and ਸੁਧਾਰ.", signal_en: "Uses not the person and repair." },
    ],
    learner_trap: {
      trap_vi: "Lặp tên người khiến căng thẳng quay lại.",
      trap_en: "Repeating a person's name brings tension back.",
      repair_vi: "Tách vấn đề khỏi người và nêu bước sửa.",
      repair_en: "Separate the issue from the person and name the repair step.",
    },
  },
  {
    id: "pa_c2_receipt_audience_adaptation_canada",
    focus: "audience_adaptation",
    context: "community",
    style: "pre_a11_receipt",
    title_vi: "receipt: chỉnh giọng cho nhóm đa thế hệ",
    title_en: "receipt: adapting for a multi-generational group",
    scenario_vi: "Bạn gửi receipt cho phụ huynh, tình nguyện viên, và người học ở Canada.",
    scenario_en: "You send a receipt to parents, volunteers, and learners in Canada.",
    receipt_goal_vi: "Nói bằng câu dễ theo, trạng thái rõ, và bước tiếp theo cụ thể.",
    receipt_goal_en: "Use easy-to-follow wording, clear status, and a concrete next step.",
    sample_gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ, receipt ਤਿਆਰ ਹੈ; ਅਗਲੇ ਹਫ਼ਤੇ ਇਹ ਕਲਾਸ ਵਿੱਚ ਵਰਤਾਂਗੇ।",
    sample_romanization: "sadharan shabdan vich, receipt tiar hai; agle hafte ih class vich vartange.",
    sample_vi: "Nói đơn giản, receipt đã sẵn sàng; tuần sau sẽ dùng trong lớp.",
    sample_en: "In simple terms, the receipt is ready; next week we will use it in class.",
    receipt_phrases: [
      { gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ", romanization: "sadharan shabdan vich", vi: "Nói bằng từ đơn giản.", en: "In simple terms." },
      { gurmukhi: "ਅਗਲੇ ਹਫ਼ਤੇ", romanization: "agle hafte", vi: "Tuần sau.", en: "Next week." },
    ],
    receipt_checks: [
      { check_vi: "Người ngoài nhóm kỹ thuật có hiểu bước tiếp theo không?", check_en: "Can people outside the technical group understand the next step?", signal_vi: "Có ਸਧਾਰਨ and ਅਗਲੇ ਹਫ਼ਤੇ.", signal_en: "Uses simple and next week." },
    ],
    learner_trap: {
      trap_vi: "Dùng thuật ngữ nội bộ khiến phụ huynh khó theo.",
      trap_en: "Internal terms make the note hard for parents to follow.",
      repair_vi: "Nêu trạng thái và thời điểm dùng.",
      repair_en: "State the status and when it will be used.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_receipt_sensitive_topic_framing",
    focus: "sensitive_topic_framing",
    context: "public",
    style: "archive_receipt",
    title_vi: "receipt: khung chủ đề nhạy cảm",
    title_en: "receipt: sensitive-topic framing",
    scenario_vi: "Bạn ghi lại cách mở chủ đề nhạy cảm trong buổi cộng đồng.",
    scenario_en: "You record how to open a sensitive topic in a community session.",
    receipt_goal_vi: "Đặt mục tiêu chung, giảm quy kết, và mời góp ý có cấu trúc.",
    receipt_goal_en: "Set a shared goal, reduce blame, and invite structured input.",
    sample_gurmukhi: "ਮਕਸਦ ਦੋਸ਼ ਦੇਣਾ ਨਹੀਂ; receipt ਦਾ ਮਕਸਦ ਸਾਂਝਾ ਹੱਲ ਲੱਭਣਾ ਅਤੇ ਸੁਝਾਅ ਕ੍ਰਮ ਨਾਲ ਸੁਣਨਾ ਹੈ।",
    sample_romanization: "maqsad dosh dena nahin; receipt da maqsad sanjha hall labhna ate sujhaa kram naal sunna hai.",
    sample_vi: "Mục đích không phải đổ lỗi; mục đích của receipt là tìm giải pháp chung và nghe góp ý theo thứ tự.",
    sample_en: "The aim is not to blame; the receipt's aim is to find a shared solution and hear suggestions in order.",
    receipt_phrases: [
      { gurmukhi: "ਦੋਸ਼ ਦੇਣਾ ਨਹੀਂ", romanization: "dosh dena nahin", vi: "Không phải đổ lỗi.", en: "Not to blame." },
      { gurmukhi: "ਸਾਂਝਾ ਹੱਲ ਲੱਭਣਾ", romanization: "sanjha hall labhna", vi: "Tìm giải pháp chung.", en: "Find a shared solution." },
    ],
    receipt_checks: [
      { check_vi: "Có giảm phòng thủ trước khi bàn vấn đề không?", check_en: "Does it reduce defensiveness before the issue is discussed?", signal_vi: "Có ਦੋਸ਼ ਨਹੀਂ and ਸਾਂਝਾ ਹੱਲ.", signal_en: "Uses not blame and shared solution." },
    ],
    learner_trap: {
      trap_vi: "Mở đầu bằng lỗi của một nhóm làm người nghe phòng thủ.",
      trap_en: "Opening with one group's fault makes listeners defensive.",
      repair_vi: "Mở bằng mục tiêu chung và quy trình nghe góp ý.",
      repair_en: "Open with the shared goal and the input process.",
    },
  },
  {
    id: "pa_c2_receipt_public_communication_calibration",
    focus: "public_communication_calibration",
    context: "public",
    style: "ledger_receipt",
    title_vi: "receipt: cân chỉnh thông báo công khai",
    title_en: "receipt: public communication calibration",
    scenario_vi: "Bạn ghi receipt cho thay đổi dịch vụ cộng đồng ở Canada.",
    scenario_en: "You write a receipt for a community-service change in Canada.",
    receipt_goal_vi: "Nói thay đổi, lý do ngắn, và nơi nhận hỗ trợ.",
    receipt_goal_en: "State the change, give a short reason, and name where to get support.",
    sample_gurmukhi: "ਸੇਵਾ ਦਾ ਸਮਾਂ ਬਦਲਿਆ ਹੈ; ਕਾਰਨ ਸਟਾਫ਼ ਦੀ ਘਾਟ ਹੈ, ਅਤੇ ਮਦਦ ਲਈ ਡੈਸਕ ਖੁੱਲ੍ਹਾ ਰਹੇਗਾ।",
    sample_romanization: "seva da sama badlia hai; karan staff di ghaat hai, ate madad lai desk khulla rahega.",
    sample_vi: "Giờ dịch vụ đã đổi; lý do là thiếu nhân sự, và bàn hỗ trợ sẽ vẫn mở.",
    sample_en: "The service time has changed; the reason is staff shortage, and the help desk will remain open.",
    receipt_phrases: [
      { gurmukhi: "ਸੇਵਾ ਦਾ ਸਮਾਂ ਬਦਲਿਆ ਹੈ", romanization: "seva da sama badlia hai", vi: "Giờ dịch vụ đã đổi.", en: "The service time has changed." },
      { gurmukhi: "ਮਦਦ ਲਈ ਡੈਸਕ", romanization: "madad lai desk", vi: "Bàn hỗ trợ.", en: "Help desk." },
    ],
    receipt_checks: [
      { check_vi: "Thông báo có rõ mà không gây hoang mang không?", check_en: "Is the notice clear without sounding alarming?", signal_vi: "Có thay đổi, lý do, và hỗ trợ.", signal_en: "Includes change, reason, and support." },
    ],
    learner_trap: {
      trap_vi: "Chỉ nêu vấn đề mà không cho đường hỗ trợ.",
      trap_en: "Naming only the problem gives no support path.",
      repair_vi: "Thêm nơi nhận hỗ trợ hoặc bước tiếp theo.",
      repair_en: "Add where to get support or the next step.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_receipt_register_safety",
    focus: "register_safety",
    context: "professional",
    style: "pre_integration",
    title_vi: "receipt: an toàn register",
    title_en: "receipt: register safety",
    scenario_vi: "Bạn sửa một câu quá thân mật trước khi lưu receipt cho môi trường chuyên nghiệp.",
    scenario_en: "You repair an overly casual line before saving a receipt for a professional setting.",
    receipt_goal_vi: "Giữ lịch sự, cụ thể, không phóng đại, và có yêu cầu rõ.",
    receipt_goal_en: "Stay polite, specific, not exaggerated, and clear in the request.",
    sample_gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇਸ receipt ਦੀ ਸਮੀਖਿਆ ਕਰੋ ਅਤੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।",
    sample_romanization: "kirpa karke is receipt di samikhia karo ate agla kadam daso.",
    sample_vi: "Vui lòng xem xét receipt này và cho biết bước tiếp theo.",
    sample_en: "Please review this receipt and advise the next step.",
    receipt_phrases: [
      { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ", romanization: "kirpa karke", vi: "Vui lòng.", en: "Please." },
      { gurmukhi: "ਅਗਲਾ ਕਦਮ ਦੱਸੋ", romanization: "agla kadam daso", vi: "Cho biết bước tiếp theo.", en: "Advise the next step." },
    ],
    receipt_checks: [
      { check_vi: "Có đủ lịch sự nhưng vẫn cụ thể không?", check_en: "Is it polite while staying specific?", signal_vi: "Có ਕਿਰਪਾ ਕਰਕੇ and ਅਗਲਾ ਕਦਮ.", signal_en: "Uses please and next step." },
    ],
    learner_trap: {
      trap_vi: "Quá thân mật hoặc quá giận làm mất giọng chuyên nghiệp.",
      trap_en: "Being too casual or angry loses professional register.",
      repair_vi: "Dùng câu lịch sự với yêu cầu cụ thể.",
      repair_en: "Use a polite line with a concrete request.",
    },
  },
];

export const c2ReceiptSamplesByFocus = (focus: PunjabiC2ReceiptFocus) =>
  c2ReceiptSamples.filter((item) => item.focus === focus);

export const c2ReceiptSamplesByStyle = (style: PunjabiC2ReceiptStyle) =>
  c2ReceiptSamples.filter((item) => item.style === style);

export default c2ReceiptSamples;
