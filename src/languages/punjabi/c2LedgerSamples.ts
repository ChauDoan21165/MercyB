// Punjabi C2 ledger samples for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support ledger samples only, not certification,
// official placement, or native-reviewed authority. Native review is deferred.
// Shahmukhi is mentioned only for script awareness, not as a full course.

export type PunjabiC2LedgerFocus =
  | "nuanced_disagreement"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "audience_adaptation"
  | "sensitive_topic_framing"
  | "public_communication_calibration"
  | "register_safety";

export type PunjabiC2LedgerContext = "public" | "professional" | "community";
export type PunjabiC2LedgerStyle =
  | "pre_a11_ledger"
  | "archive"
  | "signoff"
  | "pre_integration";

export type PunjabiC2LedgerPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2LedgerTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2LedgerSample = {
  id: string;
  focus: PunjabiC2LedgerFocus;
  context: PunjabiC2LedgerContext;
  style: PunjabiC2LedgerStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  ledger_goal_vi: string;
  ledger_goal_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  ledger_phrases: PunjabiC2LedgerPhrase[];
  learner_trap: PunjabiC2LedgerTrap;
  canada_practical?: boolean;
};

export const C2_LEDGER_SAMPLES_DISCLAIMER = {
  vi: "Bộ ledger Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi ledger sample pack supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const c2LedgerSamples: PunjabiC2LedgerSample[] = [
  {
    id: "pa_c2_ledger_nuanced_disagreement_pre_a11",
    focus: "nuanced_disagreement",
    context: "professional",
    style: "pre_a11_ledger",
    title_vi: "ledger: bất đồng tinh tế",
    title_en: "ledger: nuanced disagreement",
    scenario_vi: "Bạn cần phản biện một kế hoạch mà vẫn giữ quan hệ chuyên nghiệp.",
    scenario_en: "You need to challenge a plan while preserving a professional relationship.",
    ledger_goal_vi: "Công nhận hướng đi, nêu điểm yếu, rồi đề xuất kiểm tra thêm.",
    ledger_goal_en: "Validate the direction, name the weak point, then suggest another check.",
    sample_gurmukhi: "ਦਿਸ਼ਾ ਠੀਕ ਹੈ, ਪਰ ਫੈਸਲੇ ਤੋਂ ਪਹਿਲਾਂ ਇਸ ਦਲੀਲ ਨੂੰ ਇੱਕ ਵਾਰੀ ਹੋਰ ਪਰਖ ਲਈਏ।",
    sample_romanization: "disha theek hai, par faisle ton pehlan is dalil nu ikk vari hor parakh laie.",
    sample_vi: "Hướng đi đúng, nhưng trước khi quyết định hãy kiểm tra lập luận này thêm một lần.",
    sample_en: "The direction is right, but before deciding let's test this argument once more.",
    ledger_phrases: [
      { gurmukhi: "ਦਿਸ਼ਾ ਠੀਕ ਹੈ", romanization: "disha theek hai", vi: "Hướng đi đúng.", en: "The direction is right." },
      { gurmukhi: "ਇੱਕ ਵਾਰੀ ਹੋਰ ਪਰਖ ਲਈਏ", romanization: "ikk vari hor parakh laie", vi: "Hãy kiểm tra thêm một lần.", en: "Let's test it once more." },
    ],
    learner_trap: {
      trap_vi: "Phản đối quá thẳng làm mất register an toàn.",
      trap_en: "Over-direct disagreement weakens register safety.",
      repair_vi: "Công nhận hướng đi trước khi nêu kiểm tra.",
      repair_en: "Validate the direction before requesting a check.",
    },
  },
  {
    id: "pa_c2_ledger_diplomacy_archive",
    focus: "diplomacy",
    context: "community",
    style: "archive",
    title_vi: "ledger: ngoại giao phạm vi",
    title_en: "ledger: scope diplomacy",
    scenario_vi: "Nhóm cộng đồng Canada muốn thêm phạm vi vào phút cuối.",
    scenario_en: "A Canadian community group wants to add scope at the last minute.",
    ledger_goal_vi: "Cảm ơn, giữ phạm vi hiện tại, và mở vòng sau.",
    ledger_goal_en: "Thank them, keep the current scope, and open a later cycle.",
    sample_gurmukhi: "ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ; ਇਸ ਵੇਲੇ ਹੱਦ ਨਹੀਂ ਬਦਲਾਂਗੇ, ਪਰ ਅਗਲੇ ਚੱਕਰ ਲਈ ਇਸ ਨੂੰ ਰੱਖਦੇ ਹਾਂ।",
    sample_romanization: "sujhaa lai dhanvaad; is vele hadd nahin badlange, par agle chakkar lai is nu rakhde haan.",
    sample_vi: "Cảm ơn đề xuất; hiện tại ta không đổi phạm vi, nhưng sẽ giữ lại cho vòng sau.",
    sample_en: "Thank you for the suggestion; we will not change the scope now, but we will keep it for the next cycle.",
    ledger_phrases: [
      { gurmukhi: "ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ", romanization: "sujhaa lai dhanvaad", vi: "Cảm ơn đề xuất.", en: "Thank you for the suggestion." },
      { gurmukhi: "ਅਗਲੇ ਚੱਕਰ ਲਈ", romanization: "agle chakkar lai", vi: "Cho vòng sau.", en: "For the next cycle." },
    ],
    learner_trap: {
      trap_vi: "Nói 'quá muộn' nghe cắt ngang.",
      trap_en: "Saying 'too late' sounds dismissive.",
      repair_vi: "Cảm ơn và chuyển ý kiến sang vòng sau.",
      repair_en: "Thank them and move the idea to the next cycle.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_ledger_mediation_pre_integration",
    focus: "mediation",
    context: "public",
    style: "pre_integration",
    title_vi: "ledger: trung gian công khai",
    title_en: "ledger: public mediation",
    scenario_vi: "Hai bên bất đồng và cần câu chốt không thiên vị.",
    scenario_en: "Two sides disagree and need a neutral closing line.",
    ledger_goal_vi: "Ghi nhận hai phía, dùng tiêu chí chung, và chốt bước tiếp theo.",
    ledger_goal_en: "Acknowledge both sides, use shared criteria, and confirm the next step.",
    sample_gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਗੱਲ ਦਰਜ ਹੈ; ਅਗਲਾ ਕਦਮ ਸਾਂਝੇ ਮਾਪਦੰਡ ਦੇ ਆਧਾਰ ਤੇ ਹੋਵੇਗਾ।",
    sample_romanization: "dovein pasian di gall darj hai; agla kadam sanjhe mapdand de aadhaar te hovega.",
    sample_vi: "Ý kiến của cả hai bên đã được ghi nhận; bước tiếp theo sẽ dựa trên tiêu chí chung.",
    sample_en: "Both sides' points are recorded; the next step will be based on shared criteria.",
    ledger_phrases: [
      { gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਗੱਲ ਦਰਜ ਹੈ", romanization: "dovein pasian di gall darj hai", vi: "Ý kiến hai bên đã được ghi nhận.", en: "Both sides' points are recorded." },
      { gurmukhi: "ਸਾਂਝੇ ਮਾਪਦੰਡ", romanization: "sanjhe mapdand", vi: "Tiêu chí chung.", en: "Shared criteria." },
    ],
    learner_trap: {
      trap_vi: "Khen một bên quá nhiều làm mất trung lập.",
      trap_en: "Praising one side too much loses neutrality.",
      repair_vi: "Quay về tiêu chí chung.",
      repair_en: "Return to shared criteria.",
    },
  },
  {
    id: "pa_c2_ledger_deescalation_signoff",
    focus: "deescalation",
    context: "professional",
    style: "signoff",
    title_vi: "ledger: hạ nhiệt trách nhiệm",
    title_en: "ledger: de-escalating ownership",
    scenario_vi: "Một lỗi nhỏ bị nhắc lại trong cuộc họp căng.",
    scenario_en: "A small issue keeps being repeated in a tense meeting.",
    ledger_goal_vi: "Tách vấn đề khỏi cá nhân và đưa về bước sửa.",
    ledger_goal_en: "Separate the issue from the person and return to the repair step.",
    sample_gurmukhi: "ਮੁੱਦਾ ਦਰਜ ਹੈ; ਹੁਣ ਵਿਅਕਤੀ ਨਹੀਂ, ਸੁਧਾਰ ਦੇ ਕਦਮ ਨੂੰ ਪੱਕਾ ਕਰੀਏ।",
    sample_romanization: "mudda darj hai; hun vyakti nahin, sudhaar de kadam nu pakka kariye.",
    sample_vi: "Vấn đề đã ghi nhận; bây giờ không nói về cá nhân, hãy ổn định bước sửa.",
    sample_en: "The issue is recorded; now let's focus on the repair step, not the person.",
    ledger_phrases: [
      { gurmukhi: "ਮੁੱਦਾ ਦਰਜ ਹੈ", romanization: "mudda darj hai", vi: "Vấn đề đã ghi nhận.", en: "The issue is recorded." },
      { gurmukhi: "ਸੁਧਾਰ ਦੇ ਕਦਮ", romanization: "sudhaar de kadam", vi: "Bước sửa.", en: "Repair step." },
    ],
    learner_trap: {
      trap_vi: "Lặp tên người làm cuộc họp nóng lại.",
      trap_en: "Repeating a person's name reheats the meeting.",
      repair_vi: "Nói vấn đề đã ghi nhận và chốt bước sửa.",
      repair_en: "Say the issue is recorded and confirm the repair step.",
    },
  },
  {
    id: "pa_c2_ledger_audience_adaptation_canada",
    focus: "audience_adaptation",
    context: "community",
    style: "pre_a11_ledger",
    title_vi: "ledger: chỉnh giọng cho nhóm đa thế hệ",
    title_en: "ledger: adapting for a multi-generational group",
    scenario_vi: "Bạn thông báo cho phụ huynh, tình nguyện viên, và người học ở Canada.",
    scenario_en: "You address parents, volunteers, and learners in Canada.",
    ledger_goal_vi: "Dùng câu dễ theo, nói trạng thái, và nêu bước tiếp theo.",
    ledger_goal_en: "Use easy-to-follow wording, state the status, and name the next step.",
    sample_gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ, ਅੰਤਿਮ ਰੂਪ ਤਿਆਰ ਹੈ; ਅਗਲੇ ਹਫ਼ਤੇ ਇਹ ਕਲਾਸ ਵਿੱਚ ਵਰਤਾਂਗੇ।",
    sample_romanization: "sadharan shabdan vich, antim roop tiar hai; agle hafte ih class vich vartange.",
    sample_vi: "Nói đơn giản, bản cuối đã sẵn sàng; tuần sau sẽ dùng trong lớp.",
    sample_en: "In simple terms, the final version is ready; next week we will use it in class.",
    ledger_phrases: [
      { gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ", romanization: "sadharan shabdan vich", vi: "Nói bằng từ đơn giản.", en: "In simple terms." },
      { gurmukhi: "ਅਗਲੇ ਹਫ਼ਤੇ", romanization: "agle hafte", vi: "Tuần sau.", en: "Next week." },
    ],
    learner_trap: {
      trap_vi: "Dùng thuật ngữ nội bộ khiến người ngoài khó theo.",
      trap_en: "Internal terms make the message hard for outsiders to follow.",
      repair_vi: "Nói trạng thái cuối và thời điểm áp dụng.",
      repair_en: "State final status and when it applies.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_ledger_sensitive_topic_framing",
    focus: "sensitive_topic_framing",
    context: "public",
    style: "archive",
    title_vi: "ledger: khung chủ đề nhạy cảm",
    title_en: "ledger: sensitive-topic framing",
    scenario_vi: "Bạn cần mở một chủ đề nhạy cảm trong buổi cộng đồng mà không làm người nghe phòng thủ.",
    scenario_en: "You need to open a sensitive topic in a community session without making listeners defensive.",
    ledger_goal_vi: "Nói mục tiêu chung, giảm quy kết, và mời góp ý có cấu trúc.",
    ledger_goal_en: "Name the shared goal, reduce blame, and invite structured input.",
    sample_gurmukhi: "ਮਕਸਦ ਦੋਸ਼ ਦੇਣਾ ਨਹੀਂ, ਸਾਂਝਾ ਹੱਲ ਲੱਭਣਾ ਹੈ; ਆਓ ਸੁਝਾਅ ਕ੍ਰਮ ਨਾਲ ਸੁਣੀਏ।",
    sample_romanization: "maqsad dosh dena nahin, sanjha hall labhna hai; aao sujhaa kram naal suniye.",
    sample_vi: "Mục đích không phải đổ lỗi mà tìm giải pháp chung; hãy nghe góp ý theo thứ tự.",
    sample_en: "The goal is not to blame but to find a shared solution; let's hear suggestions in order.",
    ledger_phrases: [
      { gurmukhi: "ਦੋਸ਼ ਦੇਣਾ ਨਹੀਂ", romanization: "dosh dena nahin", vi: "Không phải đổ lỗi.", en: "Not to blame." },
      { gurmukhi: "ਸਾਂਝਾ ਹੱਲ", romanization: "sanjha hall", vi: "Giải pháp chung.", en: "Shared solution." },
    ],
    learner_trap: {
      trap_vi: "Mở đầu bằng lỗi của một nhóm làm chủ đề căng hơn.",
      trap_en: "Opening with one group's fault makes the topic more tense.",
      repair_vi: "Mở bằng mục tiêu chung.",
      repair_en: "Open with the shared goal.",
    },
  },
  {
    id: "pa_c2_ledger_public_communication_calibration",
    focus: "public_communication_calibration",
    context: "public",
    style: "pre_integration",
    title_vi: "ledger: cân chỉnh thông báo công khai",
    title_en: "ledger: public communication calibration",
    scenario_vi: "Bạn cần thông báo thay đổi dịch vụ công cộng ở Canada một cách rõ và bình tĩnh.",
    scenario_en: "You need to announce a Canadian public-service change clearly and calmly.",
    ledger_goal_vi: "Nói thay đổi, lý do ngắn, và lựa chọn hỗ trợ.",
    ledger_goal_en: "State the change, give a short reason, and offer support options.",
    sample_gurmukhi: "ਸੇਵਾ ਦਾ ਸਮਾਂ ਬਦਲਿਆ ਹੈ; ਕਾਰਨ ਸਟਾਫ਼ ਦੀ ਘਾਟ ਹੈ, ਅਤੇ ਮਦਦ ਲਈ ਕਾਊਂਟਰ ਖੁੱਲ੍ਹਾ ਹੈ।",
    sample_romanization: "seva da sama badlia hai; karan staff di ghaat hai, ate madad lai counter khulla hai.",
    sample_vi: "Giờ dịch vụ đã đổi; lý do là thiếu nhân sự, và quầy hỗ trợ vẫn mở.",
    sample_en: "The service time has changed; the reason is staff shortage, and the help counter is open.",
    ledger_phrases: [
      { gurmukhi: "ਸੇਵਾ ਦਾ ਸਮਾਂ ਬਦਲਿਆ ਹੈ", romanization: "seva da sama badlia hai", vi: "Giờ dịch vụ đã đổi.", en: "The service time has changed." },
      { gurmukhi: "ਮਦਦ ਲਈ ਕਾਊਂਟਰ", romanization: "madad lai counter", vi: "Quầy hỗ trợ.", en: "Help counter." },
    ],
    learner_trap: {
      trap_vi: "Thông báo chỉ nêu vấn đề mà không nêu lựa chọn hỗ trợ.",
      trap_en: "A notice that only names the problem gives no support path.",
      repair_vi: "Thêm nơi hoặc cách nhận hỗ trợ.",
      repair_en: "Add where or how to get support.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_ledger_register_safety",
    focus: "register_safety",
    context: "professional",
    style: "signoff",
    title_vi: "ledger: an toàn register",
    title_en: "ledger: register safety",
    scenario_vi: "Bạn cần sửa câu quá thân mật trước khi gửi cho quản lý hoặc cơ quan dịch vụ.",
    scenario_en: "You need to repair an overly casual line before sending it to a manager or service office.",
    ledger_goal_vi: "Giữ lịch sự, cụ thể, và không phóng đại.",
    ledger_goal_en: "Stay polite, specific, and avoid exaggeration.",
    sample_gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇਸ ਮੁੱਦੇ ਦੀ ਸਮੀਖਿਆ ਕਰੋ ਅਤੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।",
    sample_romanization: "kirpa karke is mudde di samikhia karo ate agla kadam daso.",
    sample_vi: "Làm ơn xem xét vấn đề này và cho biết bước tiếp theo.",
    sample_en: "Please review this issue and advise the next step.",
    ledger_phrases: [
      { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ", romanization: "kirpa karke", vi: "Làm ơn.", en: "Please." },
      { gurmukhi: "ਅਗਲਾ ਕਦਮ ਦੱਸੋ", romanization: "agla kadam daso", vi: "Cho biết bước tiếp theo.", en: "Advise the next step." },
    ],
    learner_trap: {
      trap_vi: "Viết quá thân mật hoặc quá giận làm mất register chuyên nghiệp.",
      trap_en: "Writing too casually or angrily loses professional register.",
      repair_vi: "Dùng câu lịch sự, cụ thể, và yêu cầu bước tiếp theo.",
      repair_en: "Use a polite, specific line that asks for the next step.",
    },
  },
];

export const c2LedgerSamplesByFocus = (focus: PunjabiC2LedgerFocus) =>
  c2LedgerSamples.filter((item) => item.focus === focus);

export const c2LedgerSamplesByStyle = (style: PunjabiC2LedgerStyle) =>
  c2LedgerSamples.filter((item) => item.style === style);

export default c2LedgerSamples;
