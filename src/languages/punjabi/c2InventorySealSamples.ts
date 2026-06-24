// Punjabi C2 inventory seal samples for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support inventory seal samples only, not certification,
// official placement, legal/HR/medical/safety advice, or native review.
// Native review is deferred. Shahmukhi is mentioned only for script awareness,
// not as a full course.

export type PunjabiC2InventorySealFocus =
  | "nuanced_disagreement"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "audience_adaptation"
  | "sensitive_topic_framing"
  | "public_communication_calibration"
  | "register_safety";

export type PunjabiC2InventorySealContext = "public" | "professional" | "community";
export type PunjabiC2InventorySealStyle =
  | "pre_a11_inventory_seal"
  | "catalog_seal"
  | "bundle_seal"
  | "pre_integration";

export type PunjabiC2InventorySealPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2InventorySealCheck = {
  check_vi: string;
  check_en: string;
  signal_vi: string;
  signal_en: string;
};

export type PunjabiC2InventorySealTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2InventorySealSample = {
  id: string;
  focus: PunjabiC2InventorySealFocus;
  context: PunjabiC2InventorySealContext;
  style: PunjabiC2InventorySealStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  inventory_seal_goal_vi: string;
  inventory_seal_goal_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  inventory_seal_phrases: PunjabiC2InventorySealPhrase[];
  inventory_seal_checks: PunjabiC2InventorySealCheck[];
  learner_trap: PunjabiC2InventorySealTrap;
  canada_practical?: boolean;
};

export const C2_INVENTORY_SEAL_SAMPLES_DISCLAIMER = {
  vi: "Bộ inventory seal Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi inventory seal sample pack supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const c2InventorySealSamples: PunjabiC2InventorySealSample[] = [
  {
    id: "pa_c2_inventory_seal_nuanced_disagreement_pre_a11",
    focus: "nuanced_disagreement",
    context: "professional",
    style: "pre_a11_inventory_seal",
    title_vi: "inventory seal: bất đồng tinh tế",
    title_en: "inventory seal: nuanced disagreement",
    scenario_vi: "Bạn niêm phong mẫu phản biện trước khi chuyển sang A11 sau này.",
    scenario_en: "You seal a challenge sample before a later A11 handoff.",
    inventory_seal_goal_vi: "Công nhận điểm mạnh, nêu rủi ro còn lại, và chốt kiểm tra cuối.",
    inventory_seal_goal_en: "Acknowledge the strength, name the remaining risk, and close with a final check.",
    sample_gurmukhi: "ਮੁੱਖ ਦਲੀਲ ਮਜ਼ਬੂਤ ਹੈ, ਪਰ inventory seal ਤੋਂ ਪਹਿਲਾਂ ਇਸ ਜੋਖਮ ਨੂੰ ਆਖਰੀ ਵਾਰੀ ਪਰਖ ਲਈਏ।",
    sample_romanization: "mukh dalil mazboot hai, par inventory seal ton pehlan is jokham nu aakhri vari parakh laie.",
    sample_vi: "Lập luận chính mạnh, nhưng trước inventory seal hãy kiểm tra rủi ro này lần cuối.",
    sample_en: "The main argument is strong, but before the inventory seal let's test this risk one last time.",
    inventory_seal_phrases: [
      { gurmukhi: "ਮੁੱਖ ਦਲੀਲ ਮਜ਼ਬੂਤ ਹੈ", romanization: "mukh dalil mazboot hai", vi: "Lập luận chính mạnh.", en: "The main argument is strong." },
      { gurmukhi: "ਆਖਰੀ ਵਾਰੀ ਪਰਖ ਲਈਏ", romanization: "aakhri vari parakh laie", vi: "Hãy kiểm tra lần cuối.", en: "Let's test it one last time." },
    ],
    inventory_seal_checks: [
      { check_vi: "Có bất đồng mà vẫn giữ giọng hợp tác không?", check_en: "Does it disagree while preserving cooperation?", signal_vi: "Có ਮਜ਼ਬੂਤ and ਆਖਰੀ ਵਾਰੀ.", signal_en: "Uses strong and one last time." },
    ],
    learner_trap: {
      trap_vi: "Niêm phong mẫu khi còn phản biện chưa xử lý làm yếu độ tin cậy.",
      trap_en: "Sealing a sample with an unresolved challenge weakens confidence.",
      repair_vi: "Nêu điểm mạnh rồi kiểm tra rủi ro cuối.",
      repair_en: "Name the strength, then run the final risk check.",
    },
  },
  {
    id: "pa_c2_inventory_seal_diplomacy_catalog",
    focus: "diplomacy",
    context: "community",
    style: "catalog_seal",
    title_vi: "inventory seal: ngoại giao phạm vi",
    title_en: "inventory seal: scope diplomacy",
    scenario_vi: "Một nhóm cộng đồng ở Canada muốn thêm mục khi inventory seal đã gần xong.",
    scenario_en: "A Canadian community group wants to add an item when the inventory seal is nearly final.",
    inventory_seal_goal_vi: "Cảm ơn, giữ phạm vi hiện tại, và ghi lại cho vòng sau.",
    inventory_seal_goal_en: "Thank them, keep current scope, and record it for a later cycle.",
    sample_gurmukhi: "ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ; ਇਸ inventory seal ਵਿੱਚ ਹੱਦ ਇਹੀ ਰਹੇਗੀ, ਪਰ ਅਗਲੇ ਚੱਕਰ ਲਈ ਇਸ ਨੂੰ ਰੱਖਦੇ ਹਾਂ।",
    sample_romanization: "sujhaa lai dhanvaad; is inventory seal vich hadd ehi rahegi, par agle chakkar lai is nu rakhde haan.",
    sample_vi: "Cảm ơn đề xuất; trong inventory seal này phạm vi sẽ giữ như vậy, nhưng ta giữ lại cho vòng sau.",
    sample_en: "Thank you for the suggestion; in this inventory seal the scope will stay as is, but we will keep it for the next cycle.",
    inventory_seal_phrases: [
      { gurmukhi: "ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ", romanization: "sujhaa lai dhanvaad", vi: "Cảm ơn đề xuất.", en: "Thank you for the suggestion." },
      { gurmukhi: "ਅਗਲੇ ਚੱਕਰ ਲਈ", romanization: "agle chakkar lai", vi: "Cho vòng sau.", en: "For the next cycle." },
    ],
    inventory_seal_checks: [
      { check_vi: "Có giữ phạm vi mà không cắt ngang quan hệ không?", check_en: "Does it hold scope without cutting off rapport?", signal_vi: "Có ਧੰਨਵਾਦ and ਅਗਲੇ ਚੱਕਰ.", signal_en: "Uses thanks and next cycle." },
    ],
    learner_trap: {
      trap_vi: "Nói 'quá muộn' làm đề xuất nghe bị bác bỏ.",
      trap_en: "Saying 'too late' makes the suggestion sound dismissed.",
      repair_vi: "Cảm ơn và lưu đề xuất cho vòng sau.",
      repair_en: "Thank them and retain the suggestion for a later cycle.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_inventory_seal_mediation_bundle",
    focus: "mediation",
    context: "public",
    style: "bundle_seal",
    title_vi: "inventory seal: trung gian công khai",
    title_en: "inventory seal: public mediation",
    scenario_vi: "Hai bên bất đồng về câu chốt trước khi niêm phong inventory.",
    scenario_en: "Two sides disagree over the closing line before the inventory is sealed.",
    inventory_seal_goal_vi: "Ghi nhận hai phía, dùng tiêu chí chung, và chốt bước sau.",
    inventory_seal_goal_en: "Record both sides, use shared criteria, and confirm the next step.",
    sample_gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਗੱਲ inventory seal ਵਿੱਚ ਦਰਜ ਹੈ; ਅਗਲਾ ਕਦਮ ਸਾਂਝੇ ਮਾਪਦੰਡ ਦੇ ਆਧਾਰ ਤੇ ਹੋਵੇਗਾ।",
    sample_romanization: "dovein pasian di gall inventory seal vich darj hai; agla kadam sanjhe mapdand de aadhaar te hovega.",
    sample_vi: "Ý kiến của cả hai bên đã được ghi trong inventory seal; bước tiếp theo sẽ dựa trên tiêu chí chung.",
    sample_en: "Both sides' points are recorded in the inventory seal; the next step will be based on shared criteria.",
    inventory_seal_phrases: [
      { gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਗੱਲ", romanization: "dovein pasian di gall", vi: "Ý kiến của cả hai bên.", en: "Both sides' points." },
      { gurmukhi: "ਸਾਂਝੇ ਮਾਪਦੰਡ", romanization: "sanjhe mapdand", vi: "Tiêu chí chung.", en: "Shared criteria." },
    ],
    inventory_seal_checks: [
      { check_vi: "Có giữ trung lập khi chốt seal không?", check_en: "Does it stay neutral while sealing?", signal_vi: "Có ਦੋਵੇਂ ਪਾਸਿਆਂ and ਸਾਂਝੇ ਮਾਪਦੰਡ.", signal_en: "Uses both sides and shared criteria." },
    ],
    learner_trap: {
      trap_vi: "Niêm phong theo một bên làm mất trung lập.",
      trap_en: "Sealing toward one side loses neutrality.",
      repair_vi: "Ghi nhận cả hai bên rồi dựa vào tiêu chí chung.",
      repair_en: "Record both sides, then rely on shared criteria.",
    },
  },
  {
    id: "pa_c2_inventory_seal_deescalation_pre_integration",
    focus: "deescalation",
    context: "professional",
    style: "pre_integration",
    title_vi: "inventory seal: hạ nhiệt trước tích hợp",
    title_en: "inventory seal: de-escalation before integration",
    scenario_vi: "Một lỗi nhỏ bị nhắc lại trong cuộc họp inventory seal.",
    scenario_en: "A small issue is repeated during an inventory seal meeting.",
    inventory_seal_goal_vi: "Ghi nhận vấn đề, tách khỏi cá nhân, và chốt bước sửa.",
    inventory_seal_goal_en: "Acknowledge the issue, separate it from the person, and confirm the repair step.",
    sample_gurmukhi: "ਮੁੱਦਾ inventory seal ਵਿੱਚ ਦਰਜ ਹੈ; ਹੁਣ ਵਿਅਕਤੀ ਨਹੀਂ, ਸੁਧਾਰ ਦੇ ਕਦਮ ਨੂੰ ਪੱਕਾ ਕਰੀਏ।",
    sample_romanization: "mudda inventory seal vich darj hai; hun vyakti nahin, sudhaar de kadam nu pakka kariye.",
    sample_vi: "Vấn đề đã được ghi trong inventory seal; bây giờ không nhắm vào cá nhân, hãy ổn định bước sửa.",
    sample_en: "The issue is recorded in the inventory seal; now let's focus on the repair step, not the person.",
    inventory_seal_phrases: [
      { gurmukhi: "ਮੁੱਦਾ inventory seal ਵਿੱਚ ਦਰਜ ਹੈ", romanization: "mudda inventory seal vich darj hai", vi: "Vấn đề đã được ghi trong inventory seal.", en: "The issue is recorded in the inventory seal." },
      { gurmukhi: "ਵਿਅਕਤੀ ਨਹੀਂ", romanization: "vyakti nahin", vi: "Không nhắm vào cá nhân.", en: "Not the person." },
    ],
    inventory_seal_checks: [
      { check_vi: "Có hạ nhiệt bằng hành động sửa không?", check_en: "Does it de-escalate through a repair action?", signal_vi: "Có ਵਿਅਕਤੀ ਨਹੀਂ and ਸੁਧਾਰ.", signal_en: "Uses not the person and repair." },
    ],
    learner_trap: {
      trap_vi: "Lặp tên người khiến cuộc họp nóng lại.",
      trap_en: "Repeating a person's name reheats the meeting.",
      repair_vi: "Tách vấn đề khỏi người và chốt bước sửa.",
      repair_en: "Separate the issue from the person and confirm the repair step.",
    },
  },
  {
    id: "pa_c2_inventory_seal_audience_adaptation_canada",
    focus: "audience_adaptation",
    context: "community",
    style: "pre_a11_inventory_seal",
    title_vi: "inventory seal: chỉnh giọng cho nhóm đa thế hệ",
    title_en: "inventory seal: adapting for a multi-generational group",
    scenario_vi: "Bạn thông báo inventory seal cho phụ huynh, tình nguyện viên, và người học ở Canada.",
    scenario_en: "You announce the inventory seal to parents, volunteers, and learners in Canada.",
    inventory_seal_goal_vi: "Dùng câu dễ theo, nói trạng thái, và nêu khi nào dùng.",
    inventory_seal_goal_en: "Use easy-to-follow wording, state the status, and say when it will be used.",
    sample_gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ, inventory seal ਤਿਆਰ ਹੈ; ਅਗਲੇ ਹਫ਼ਤੇ ਇਹ ਕਲਾਸ ਵਿੱਚ ਵਰਤਿਆ ਜਾਵੇਗਾ।",
    sample_romanization: "sadharan shabdan vich, inventory seal tiar hai; agle hafte ih class vich vartia javega.",
    sample_vi: "Nói đơn giản, inventory seal đã sẵn sàng; tuần sau sẽ được dùng trong lớp.",
    sample_en: "In simple terms, the inventory seal is ready; next week it will be used in class.",
    inventory_seal_phrases: [
      { gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ", romanization: "sadharan shabdan vich", vi: "Nói bằng từ đơn giản.", en: "In simple terms." },
      { gurmukhi: "ਅਗਲੇ ਹਫ਼ਤੇ", romanization: "agle hafte", vi: "Tuần sau.", en: "Next week." },
    ],
    inventory_seal_checks: [
      { check_vi: "Người ngoài nhóm kỹ thuật có hiểu trạng thái không?", check_en: "Can people outside the technical group understand the status?", signal_vi: "Có ਸਧਾਰਨ and ਅਗਲੇ ਹਫ਼ਤੇ.", signal_en: "Uses simple and next week." },
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
    id: "pa_c2_inventory_seal_sensitive_topic_framing",
    focus: "sensitive_topic_framing",
    context: "public",
    style: "catalog_seal",
    title_vi: "inventory seal: khung chủ đề nhạy cảm",
    title_en: "inventory seal: sensitive-topic framing",
    scenario_vi: "Bạn niêm phong câu mở cho chủ đề nhạy cảm trong buổi cộng đồng.",
    scenario_en: "You seal an opening line for a sensitive topic in a community session.",
    inventory_seal_goal_vi: "Nói mục tiêu chung, giảm quy kết, và mời góp ý theo thứ tự.",
    inventory_seal_goal_en: "Name the shared goal, reduce blame, and invite input in order.",
    sample_gurmukhi: "ਮਕਸਦ ਦੋਸ਼ ਦੇਣਾ ਨਹੀਂ; ਇਸ inventory seal ਦਾ ਮਕਸਦ ਸਾਂਝਾ ਹੱਲ ਲੱਭਣਾ ਅਤੇ ਸੁਝਾਅ ਕ੍ਰਮ ਨਾਲ ਸੁਣਨਾ ਹੈ।",
    sample_romanization: "maqsad dosh dena nahin; is inventory seal da maqsad sanjha hall labhna ate sujhaa kram naal sunna hai.",
    sample_vi: "Mục đích không phải đổ lỗi; mục đích của inventory seal là tìm giải pháp chung và nghe góp ý theo thứ tự.",
    sample_en: "The aim is not to blame; this inventory seal's aim is to find a shared solution and hear suggestions in order.",
    inventory_seal_phrases: [
      { gurmukhi: "ਦੋਸ਼ ਦੇਣਾ ਨਹੀਂ", romanization: "dosh dena nahin", vi: "Không phải đổ lỗi.", en: "Not to blame." },
      { gurmukhi: "ਸਾਂਝਾ ਹੱਲ", romanization: "sanjha hall", vi: "Giải pháp chung.", en: "Shared solution." },
    ],
    inventory_seal_checks: [
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
    id: "pa_c2_inventory_seal_public_communication_calibration",
    focus: "public_communication_calibration",
    context: "public",
    style: "bundle_seal",
    title_vi: "inventory seal: cân chỉnh thông báo công khai",
    title_en: "inventory seal: public communication calibration",
    scenario_vi: "Bạn niêm phong mẫu thông báo thay đổi dịch vụ cộng đồng ở Canada.",
    scenario_en: "You seal a notice sample about a community-service change in Canada.",
    inventory_seal_goal_vi: "Nói thay đổi, lý do ngắn, và nơi nhận hỗ trợ.",
    inventory_seal_goal_en: "State the change, give a short reason, and name where to get support.",
    sample_gurmukhi: "ਸੇਵਾ ਦਾ ਸਮਾਂ ਬਦਲਿਆ ਹੈ; ਕਾਰਨ ਸਟਾਫ਼ ਦੀ ਘਾਟ ਹੈ, ਅਤੇ ਮਦਦ ਲਈ ਡੈਸਕ ਖੁੱਲ੍ਹਾ ਰਹੇਗਾ।",
    sample_romanization: "seva da sama badlia hai; karan staff di ghaat hai, ate madad lai desk khulla rahega.",
    sample_vi: "Giờ dịch vụ đã đổi; lý do là thiếu nhân sự, và bàn hỗ trợ sẽ vẫn mở.",
    sample_en: "The service time has changed; the reason is staff shortage, and the help desk will remain open.",
    inventory_seal_phrases: [
      { gurmukhi: "ਸੇਵਾ ਦਾ ਸਮਾਂ ਬਦਲਿਆ ਹੈ", romanization: "seva da sama badlia hai", vi: "Giờ dịch vụ đã đổi.", en: "The service time has changed." },
      { gurmukhi: "ਮਦਦ ਲਈ ਡੈਸਕ", romanization: "madad lai desk", vi: "Bàn hỗ trợ.", en: "Help desk." },
    ],
    inventory_seal_checks: [
      { check_vi: "Có rõ ràng mà không làm người nghe hoang mang không?", check_en: "Is it clear without making listeners alarmed?", signal_vi: "Có thay đổi, lý do, và hỗ trợ.", signal_en: "Includes change, reason, and support." },
    ],
    learner_trap: {
      trap_vi: "Nêu thay đổi nhưng không cho đường hỗ trợ.",
      trap_en: "Stating the change without a support path leaves people stuck.",
      repair_vi: "Thêm nơi nhận hỗ trợ hoặc bước tiếp theo.",
      repair_en: "Add where to get support or the next step.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_inventory_seal_register_safety",
    focus: "register_safety",
    context: "professional",
    style: "pre_integration",
    title_vi: "inventory seal: an toàn register",
    title_en: "inventory seal: register safety",
    scenario_vi: "Bạn sửa câu quá thân mật trước khi niêm phong inventory chuyên nghiệp.",
    scenario_en: "You repair an overly casual line before sealing a professional inventory.",
    inventory_seal_goal_vi: "Giữ lịch sự, cụ thể, không phóng đại, và có yêu cầu rõ.",
    inventory_seal_goal_en: "Stay polite, specific, not exaggerated, and clear in the request.",
    sample_gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇਸ inventory seal ਦੀ ਸਮੀਖਿਆ ਕਰੋ ਅਤੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।",
    sample_romanization: "kirpa karke is inventory seal di samikhia karo ate agla kadam daso.",
    sample_vi: "Vui lòng xem xét inventory seal này và cho biết bước tiếp theo.",
    sample_en: "Please review this inventory seal and advise the next step.",
    inventory_seal_phrases: [
      { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ", romanization: "kirpa karke", vi: "Vui lòng.", en: "Please." },
      { gurmukhi: "ਅਗਲਾ ਕਦਮ ਦੱਸੋ", romanization: "agla kadam daso", vi: "Cho biết bước tiếp theo.", en: "Advise the next step." },
    ],
    inventory_seal_checks: [
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

export const c2InventorySealSamplesByFocus = (focus: PunjabiC2InventorySealFocus) =>
  c2InventorySealSamples.filter((item) => item.focus === focus);

export const c2InventorySealSamplesByStyle = (style: PunjabiC2InventorySealStyle) =>
  c2InventorySealSamples.filter((item) => item.style === style);

export default c2InventorySealSamples;
