// Punjabi C2 bundle samples for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support bundle samples only, not certification,
// official placement, legal/HR/medical/safety advice, or native review.
// Native review is deferred. Shahmukhi is mentioned only for script awareness,
// not as a full course.

export type PunjabiC2BundleFocus =
  | "nuanced_disagreement"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "audience_adaptation"
  | "sensitive_topic_framing"
  | "public_communication_calibration"
  | "register_safety";

export type PunjabiC2BundleContext = "public" | "professional" | "community";
export type PunjabiC2BundleStyle =
  | "pre_a11_bundle"
  | "receipt_bundle"
  | "ledger_bundle"
  | "pre_integration";

export type PunjabiC2BundlePhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2BundleCheck = {
  check_vi: string;
  check_en: string;
  signal_vi: string;
  signal_en: string;
};

export type PunjabiC2BundleTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2BundleSample = {
  id: string;
  focus: PunjabiC2BundleFocus;
  context: PunjabiC2BundleContext;
  style: PunjabiC2BundleStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  bundle_goal_vi: string;
  bundle_goal_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  bundle_phrases: PunjabiC2BundlePhrase[];
  bundle_checks: PunjabiC2BundleCheck[];
  learner_trap: PunjabiC2BundleTrap;
  canada_practical?: boolean;
};

export const C2_BUNDLE_SAMPLES_DISCLAIMER = {
  vi: "Bộ bundle Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi bundle sample pack supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const c2BundleSamples: PunjabiC2BundleSample[] = [
  {
    id: "pa_c2_bundle_nuanced_disagreement_pre_a11",
    focus: "nuanced_disagreement",
    context: "professional",
    style: "pre_a11_bundle",
    title_vi: "bundle: bất đồng tinh tế",
    title_en: "bundle: nuanced disagreement",
    scenario_vi: "Bạn đóng gói một phản biện ổn định trước khi chuyển sang A11 sau này.",
    scenario_en: "You package a stable challenge line before a later A11 handoff.",
    bundle_goal_vi: "Công nhận phần mạnh, nêu điểm cần kiểm tra, và giữ giọng hợp tác.",
    bundle_goal_en: "Acknowledge the strong part, name what needs checking, and keep a cooperative tone.",
    sample_gurmukhi: "ਮੁੱਖ ਦਲੀਲ ਮਜ਼ਬੂਤ ਹੈ, ਪਰ bundle ਤੋਂ ਪਹਿਲਾਂ ਇਸ ਜੋਖਮ ਨੂੰ ਇੱਕ ਵਾਰੀ ਹੋਰ ਪਰਖ ਲਈਏ।",
    sample_romanization: "mukh dalil mazboot hai, par bundle ton pehlan is jokham nu ikk vari hor parakh laie.",
    sample_vi: "Lập luận chính mạnh, nhưng trước bundle hãy kiểm tra rủi ro này thêm một lần.",
    sample_en: "The main argument is strong, but before the bundle let's test this risk once more.",
    bundle_phrases: [
      { gurmukhi: "ਮੁੱਖ ਦਲੀਲ ਮਜ਼ਬੂਤ ਹੈ", romanization: "mukh dalil mazboot hai", vi: "Lập luận chính mạnh.", en: "The main argument is strong." },
      { gurmukhi: "ਇੱਕ ਵਾਰੀ ਹੋਰ ਪਰਖ ਲਈਏ", romanization: "ikk vari hor parakh laie", vi: "Hãy kiểm tra thêm một lần.", en: "Let's test it once more." },
    ],
    bundle_checks: [
      { check_vi: "Có bất đồng nhưng vẫn giữ hợp tác không?", check_en: "Does it disagree while preserving cooperation?", signal_vi: "Có ਮਜ਼ਬੂਤ and ਪਰਖ.", signal_en: "Uses strong and test." },
    ],
    learner_trap: {
      trap_vi: "Bác bỏ ngay từ đầu làm mất độ tinh tế.",
      trap_en: "Rejecting immediately removes nuance.",
      repair_vi: "Công nhận phần mạnh rồi đề nghị kiểm tra.",
      repair_en: "Acknowledge the strong part, then request a check.",
    },
  },
  {
    id: "pa_c2_bundle_diplomacy_receipt",
    focus: "diplomacy",
    context: "community",
    style: "receipt_bundle",
    title_vi: "bundle: ngoại giao phạm vi",
    title_en: "bundle: scope diplomacy",
    scenario_vi: "Một nhóm cộng đồng ở Canada muốn thêm mục mới khi bundle đã gần xong.",
    scenario_en: "A Canadian community group wants to add a new item when the bundle is nearly complete.",
    bundle_goal_vi: "Cảm ơn, giữ phạm vi hiện tại, và ghi lại cho vòng sau.",
    bundle_goal_en: "Thank them, hold the current scope, and record it for a later cycle.",
    sample_gurmukhi: "ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ; ਇਸ bundle ਵਿੱਚ ਹੱਦ ਇਹੀ ਰਹੇਗੀ, ਪਰ ਅਗਲੇ ਚੱਕਰ ਲਈ ਇਸ ਨੂੰ ਰੱਖਦੇ ਹਾਂ।",
    sample_romanization: "sujhaa lai dhanvaad; is bundle vich hadd ehi rahegi, par agle chakkar lai is nu rakhde haan.",
    sample_vi: "Cảm ơn đề xuất; trong bundle này phạm vi sẽ giữ như vậy, nhưng ta giữ lại cho vòng sau.",
    sample_en: "Thank you for the suggestion; in this bundle the scope will stay as is, but we will keep it for the next cycle.",
    bundle_phrases: [
      { gurmukhi: "ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ", romanization: "sujhaa lai dhanvaad", vi: "Cảm ơn đề xuất.", en: "Thank you for the suggestion." },
      { gurmukhi: "ਅਗਲੇ ਚੱਕਰ ਲਈ", romanization: "agle chakkar lai", vi: "Cho vòng sau.", en: "For the next cycle." },
    ],
    bundle_checks: [
      { check_vi: "Có từ chối thêm phạm vi mà vẫn lịch sự không?", check_en: "Does it decline extra scope while staying polite?", signal_vi: "Có ਧੰਨਵਾਦ and ਅਗਲੇ ਚੱਕਰ.", signal_en: "Uses thanks and next cycle." },
    ],
    learner_trap: {
      trap_vi: "Nói 'quá muộn' nghe như đóng cửa đối thoại.",
      trap_en: "Saying 'too late' sounds like closing the conversation.",
      repair_vi: "Cảm ơn và chuyển đề xuất sang vòng sau.",
      repair_en: "Thank them and move the suggestion to a later cycle.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_bundle_mediation_ledger",
    focus: "mediation",
    context: "public",
    style: "ledger_bundle",
    title_vi: "bundle: trung gian công khai",
    title_en: "bundle: public mediation",
    scenario_vi: "Hai bên bất đồng về câu chốt trong bundle công khai.",
    scenario_en: "Two sides disagree over the closing line in a public bundle.",
    bundle_goal_vi: "Ghi nhận hai phía, dùng tiêu chí chung, và chốt bước tiếp theo.",
    bundle_goal_en: "Record both sides, use shared criteria, and confirm the next step.",
    sample_gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਗੱਲ bundle ਵਿੱਚ ਦਰਜ ਹੈ; ਅਗਲਾ ਕਦਮ ਸਾਂਝੇ ਮਾਪਦੰਡ ਦੇ ਆਧਾਰ ਤੇ ਹੋਵੇਗਾ।",
    sample_romanization: "dovein pasian di gall bundle vich darj hai; agla kadam sanjhe mapdand de aadhaar te hovega.",
    sample_vi: "Ý kiến của cả hai bên đã được ghi trong bundle; bước tiếp theo sẽ dựa trên tiêu chí chung.",
    sample_en: "Both sides' points are recorded in the bundle; the next step will be based on shared criteria.",
    bundle_phrases: [
      { gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਗੱਲ", romanization: "dovein pasian di gall", vi: "Ý kiến của cả hai bên.", en: "Both sides' points." },
      { gurmukhi: "ਸਾਂਝੇ ਮਾਪਦੰਡ", romanization: "sanjhe mapdand", vi: "Tiêu chí chung.", en: "Shared criteria." },
    ],
    bundle_checks: [
      { check_vi: "Có giữ trung lập khi đóng gói không?", check_en: "Does it stay neutral while bundling?", signal_vi: "Có ਦੋਵੇਂ ਪਾਸਿਆਂ and ਸਾਂਝੇ ਮਾਪਦੰਡ.", signal_en: "Uses both sides and shared criteria." },
    ],
    learner_trap: {
      trap_vi: "Khen một bên quá nhiều làm bundle lệch cân bằng.",
      trap_en: "Praising one side too much tilts the bundle.",
      repair_vi: "Ghi nhận cả hai bên rồi quay về tiêu chí chung.",
      repair_en: "Record both sides, then return to shared criteria.",
    },
  },
  {
    id: "pa_c2_bundle_deescalation_pre_integration",
    focus: "deescalation",
    context: "professional",
    style: "pre_integration",
    title_vi: "bundle: hạ nhiệt trước tích hợp",
    title_en: "bundle: de-escalation before integration",
    scenario_vi: "Một lỗi nhỏ bị nhắc lại trong cuộc họp trước khi bundle được chốt.",
    scenario_en: "A small issue is repeated in a meeting before the bundle is finalized.",
    bundle_goal_vi: "Ghi nhận vấn đề, tách khỏi cá nhân, và quay về bước sửa.",
    bundle_goal_en: "Acknowledge the issue, separate it from the person, and return to the repair step.",
    sample_gurmukhi: "ਮੁੱਦਾ bundle ਵਿੱਚ ਦਰਜ ਹੈ; ਹੁਣ ਵਿਅਕਤੀ ਨਹੀਂ, ਸੁਧਾਰ ਦੇ ਕਦਮ ਨੂੰ ਪੱਕਾ ਕਰੀਏ।",
    sample_romanization: "mudda bundle vich darj hai; hun vyakti nahin, sudhaar de kadam nu pakka kariye.",
    sample_vi: "Vấn đề đã được ghi trong bundle; bây giờ không nhắm vào cá nhân, hãy ổn định bước sửa.",
    sample_en: "The issue is recorded in the bundle; now let's focus on the repair step, not the person.",
    bundle_phrases: [
      { gurmukhi: "ਮੁੱਦਾ bundle ਵਿੱਚ ਦਰਜ ਹੈ", romanization: "mudda bundle vich darj hai", vi: "Vấn đề đã được ghi trong bundle.", en: "The issue is recorded in the bundle." },
      { gurmukhi: "ਸੁਧਾਰ ਦੇ ਕਦਮ", romanization: "sudhaar de kadam", vi: "Bước sửa.", en: "Repair step." },
    ],
    bundle_checks: [
      { check_vi: "Có hạ nhiệt bằng hành động sửa không?", check_en: "Does it de-escalate through a repair action?", signal_vi: "Có ਵਿਅਕਤੀ ਨਹੀਂ and ਸੁਧਾਰ.", signal_en: "Uses not the person and repair." },
    ],
    learner_trap: {
      trap_vi: "Lặp tên người làm cuộc họp nóng lại.",
      trap_en: "Repeating a person's name reheats the meeting.",
      repair_vi: "Nói vấn đề đã ghi và chốt bước sửa.",
      repair_en: "Say the issue is recorded and confirm the repair step.",
    },
  },
  {
    id: "pa_c2_bundle_audience_adaptation_canada",
    focus: "audience_adaptation",
    context: "community",
    style: "pre_a11_bundle",
    title_vi: "bundle: chỉnh giọng cho nhóm đa thế hệ",
    title_en: "bundle: adapting for a multi-generational group",
    scenario_vi: "Bạn thông báo bundle cho phụ huynh, tình nguyện viên, và người học ở Canada.",
    scenario_en: "You announce the bundle to parents, volunteers, and learners in Canada.",
    bundle_goal_vi: "Dùng câu dễ theo, nói trạng thái, và nêu khi nào dùng.",
    bundle_goal_en: "Use easy-to-follow wording, state the status, and say when it will be used.",
    sample_gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ, bundle ਤਿਆਰ ਹੈ; ਅਗਲੇ ਹਫ਼ਤੇ ਇਹ ਕਲਾਸ ਵਿੱਚ ਵਰਤਿਆ ਜਾਵੇਗਾ।",
    sample_romanization: "sadharan shabdan vich, bundle tiar hai; agle hafte ih class vich vartia javega.",
    sample_vi: "Nói đơn giản, bundle đã sẵn sàng; tuần sau sẽ được dùng trong lớp.",
    sample_en: "In simple terms, the bundle is ready; next week it will be used in class.",
    bundle_phrases: [
      { gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ", romanization: "sadharan shabdan vich", vi: "Nói bằng từ đơn giản.", en: "In simple terms." },
      { gurmukhi: "ਅਗਲੇ ਹਫ਼ਤੇ", romanization: "agle hafte", vi: "Tuần sau.", en: "Next week." },
    ],
    bundle_checks: [
      { check_vi: "Người ngoài nhóm kỹ thuật có hiểu không?", check_en: "Can people outside the technical group understand it?", signal_vi: "Có ਸਧਾਰਨ and ਅਗਲੇ ਹਫ਼ਤੇ.", signal_en: "Uses simple and next week." },
    ],
    learner_trap: {
      trap_vi: "Dùng thuật ngữ nội bộ khiến phụ huynh khó theo.",
      trap_en: "Internal terms make the notice hard for parents to follow.",
      repair_vi: "Nói trạng thái cuối và tuần áp dụng.",
      repair_en: "State final status and the week of use.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_bundle_sensitive_topic_framing",
    focus: "sensitive_topic_framing",
    context: "public",
    style: "receipt_bundle",
    title_vi: "bundle: khung chủ đề nhạy cảm",
    title_en: "bundle: sensitive-topic framing",
    scenario_vi: "Bạn cần đóng gói câu mở cho chủ đề nhạy cảm trong buổi cộng đồng.",
    scenario_en: "You need to package an opening line for a sensitive topic in a community session.",
    bundle_goal_vi: "Nói mục tiêu chung, giảm quy kết, và mời góp ý theo thứ tự.",
    bundle_goal_en: "Name the shared goal, reduce blame, and invite input in order.",
    sample_gurmukhi: "ਮਕਸਦ ਦੋਸ਼ ਦੇਣਾ ਨਹੀਂ; ਇਸ bundle ਦਾ ਮਕਸਦ ਸਾਂਝਾ ਹੱਲ ਲੱਭਣਾ ਅਤੇ ਸੁਝਾਅ ਕ੍ਰਮ ਨਾਲ ਸੁਣਨਾ ਹੈ।",
    sample_romanization: "maqsad dosh dena nahin; is bundle da maqsad sanjha hall labhna ate sujhaa kram naal sunna hai.",
    sample_vi: "Mục đích không phải đổ lỗi; mục đích của bundle là tìm giải pháp chung và nghe góp ý theo thứ tự.",
    sample_en: "The aim is not to blame; this bundle's aim is to find a shared solution and hear suggestions in order.",
    bundle_phrases: [
      { gurmukhi: "ਦੋਸ਼ ਦੇਣਾ ਨਹੀਂ", romanization: "dosh dena nahin", vi: "Không phải đổ lỗi.", en: "Not to blame." },
      { gurmukhi: "ਸਾਂਝਾ ਹੱਲ", romanization: "sanjha hall", vi: "Giải pháp chung.", en: "Shared solution." },
    ],
    bundle_checks: [
      { check_vi: "Có giảm phòng thủ trước khi bàn vấn đề không?", check_en: "Does it reduce defensiveness before the issue is discussed?", signal_vi: "Có ਦੋਸ਼ ਨਹੀਂ and ਸਾਂਝਾ ਹੱਲ.", signal_en: "Uses not blame and shared solution." },
    ],
    learner_trap: {
      trap_vi: "Mở bằng lỗi của một nhóm làm chủ đề căng hơn.",
      trap_en: "Opening with one group's fault makes the topic more tense.",
      repair_vi: "Mở bằng mục tiêu chung và quy trình góp ý.",
      repair_en: "Open with the shared goal and input process.",
    },
  },
  {
    id: "pa_c2_bundle_public_communication_calibration",
    focus: "public_communication_calibration",
    context: "public",
    style: "ledger_bundle",
    title_vi: "bundle: cân chỉnh thông báo công khai",
    title_en: "bundle: public communication calibration",
    scenario_vi: "Bạn đóng gói thông báo thay đổi dịch vụ cộng đồng ở Canada.",
    scenario_en: "You package a notice about a community-service change in Canada.",
    bundle_goal_vi: "Nói thay đổi, lý do ngắn, và nơi nhận hỗ trợ.",
    bundle_goal_en: "State the change, give a short reason, and name where to get support.",
    sample_gurmukhi: "ਸੇਵਾ ਦਾ ਸਮਾਂ ਬਦਲਿਆ ਹੈ; ਕਾਰਨ ਸਟਾਫ਼ ਦੀ ਘਾਟ ਹੈ, ਅਤੇ ਮਦਦ ਲਈ ਡੈਸਕ ਖੁੱਲ੍ਹਾ ਰਹੇਗਾ।",
    sample_romanization: "seva da sama badlia hai; karan staff di ghaat hai, ate madad lai desk khulla rahega.",
    sample_vi: "Giờ dịch vụ đã đổi; lý do là thiếu nhân sự, và bàn hỗ trợ sẽ vẫn mở.",
    sample_en: "The service time has changed; the reason is staff shortage, and the help desk will remain open.",
    bundle_phrases: [
      { gurmukhi: "ਸੇਵਾ ਦਾ ਸਮਾਂ ਬਦਲਿਆ ਹੈ", romanization: "seva da sama badlia hai", vi: "Giờ dịch vụ đã đổi.", en: "The service time has changed." },
      { gurmukhi: "ਮਦਦ ਲਈ ਡੈਸਕ", romanization: "madad lai desk", vi: "Bàn hỗ trợ.", en: "Help desk." },
    ],
    bundle_checks: [
      { check_vi: "Có rõ ràng mà không làm người nghe hoang mang không?", check_en: "Is it clear without making listeners alarmed?", signal_vi: "Có change, reason, and support path.", signal_en: "Includes change, reason, and support path." },
    ],
    learner_trap: {
      trap_vi: "Nêu thay đổi nhưng không cho bước hỗ trợ.",
      trap_en: "Stating the change without a support path leaves people stuck.",
      repair_vi: "Thêm nơi nhận hỗ trợ hoặc bước tiếp theo.",
      repair_en: "Add where to get support or the next step.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_bundle_register_safety",
    focus: "register_safety",
    context: "professional",
    style: "pre_integration",
    title_vi: "bundle: an toàn register",
    title_en: "bundle: register safety",
    scenario_vi: "Bạn sửa câu quá thân mật trước khi đưa vào bundle chuyên nghiệp.",
    scenario_en: "You repair an overly casual line before placing it in a professional bundle.",
    bundle_goal_vi: "Giữ lịch sự, cụ thể, không phóng đại, và có yêu cầu rõ.",
    bundle_goal_en: "Stay polite, specific, not exaggerated, and clear in the request.",
    sample_gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇਸ bundle ਦੀ ਸਮੀਖਿਆ ਕਰੋ ਅਤੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।",
    sample_romanization: "kirpa karke is bundle di samikhia karo ate agla kadam daso.",
    sample_vi: "Vui lòng xem xét bundle này và cho biết bước tiếp theo.",
    sample_en: "Please review this bundle and advise the next step.",
    bundle_phrases: [
      { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ", romanization: "kirpa karke", vi: "Vui lòng.", en: "Please." },
      { gurmukhi: "ਅਗਲਾ ਕਦਮ ਦੱਸੋ", romanization: "agla kadam daso", vi: "Cho biết bước tiếp theo.", en: "Advise the next step." },
    ],
    bundle_checks: [
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

export const c2BundleSamplesByFocus = (focus: PunjabiC2BundleFocus) =>
  c2BundleSamples.filter((item) => item.focus === focus);

export const c2BundleSamplesByStyle = (style: PunjabiC2BundleStyle) =>
  c2BundleSamples.filter((item) => item.style === style);

export default c2BundleSamples;
