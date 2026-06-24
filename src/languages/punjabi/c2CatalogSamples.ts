// Punjabi C2 catalog samples for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support catalog samples only, not certification,
// official placement, legal/HR/medical/safety advice, or native review.
// Native review is deferred. Shahmukhi is mentioned only for script awareness,
// not as a full course.

export type PunjabiC2CatalogFocus =
  | "nuanced_disagreement"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "audience_adaptation"
  | "sensitive_topic_framing"
  | "public_communication_calibration"
  | "register_safety";

export type PunjabiC2CatalogContext = "public" | "professional" | "community";
export type PunjabiC2CatalogStyle =
  | "pre_a11_catalog"
  | "bundle_catalog"
  | "receipt_catalog"
  | "pre_integration";

export type PunjabiC2CatalogPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2CatalogCheck = {
  check_vi: string;
  check_en: string;
  signal_vi: string;
  signal_en: string;
};

export type PunjabiC2CatalogTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2CatalogSample = {
  id: string;
  focus: PunjabiC2CatalogFocus;
  context: PunjabiC2CatalogContext;
  style: PunjabiC2CatalogStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  catalog_goal_vi: string;
  catalog_goal_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  catalog_phrases: PunjabiC2CatalogPhrase[];
  catalog_checks: PunjabiC2CatalogCheck[];
  learner_trap: PunjabiC2CatalogTrap;
  canada_practical?: boolean;
};

export const C2_CATALOG_SAMPLES_DISCLAIMER = {
  vi: "Bộ catalog Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi catalog sample pack supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const c2CatalogSamples: PunjabiC2CatalogSample[] = [
  {
    id: "pa_c2_catalog_nuanced_disagreement_pre_a11",
    focus: "nuanced_disagreement",
    context: "professional",
    style: "pre_a11_catalog",
    title_vi: "catalog: bất đồng tinh tế",
    title_en: "catalog: nuanced disagreement",
    scenario_vi: "Bạn lưu một mẫu phản biện vào catalog trước khi chuyển tiếp sau này.",
    scenario_en: "You save a challenge sample in the catalog before a later handoff.",
    catalog_goal_vi: "Công nhận điểm mạnh, nêu rủi ro, và đề nghị kiểm tra thêm.",
    catalog_goal_en: "Acknowledge the strength, name the risk, and ask for one more check.",
    sample_gurmukhi: "ਮੁੱਖ ਦਲੀਲ ਮਜ਼ਬੂਤ ਹੈ, ਪਰ catalog ਵਿੱਚ ਰੱਖਣ ਤੋਂ ਪਹਿਲਾਂ ਇਸ ਜੋਖਮ ਨੂੰ ਹੋਰ ਪਰਖ ਲਈਏ।",
    sample_romanization: "mukh dalil mazboot hai, par catalog vich rakhan ton pehlan is jokham nu hor parakh laie.",
    sample_vi: "Lập luận chính mạnh, nhưng trước khi đưa vào catalog hãy kiểm tra rủi ro này thêm.",
    sample_en: "The main argument is strong, but before placing it in the catalog let's test this risk further.",
    catalog_phrases: [
      { gurmukhi: "ਮੁੱਖ ਦਲੀਲ ਮਜ਼ਬੂਤ ਹੈ", romanization: "mukh dalil mazboot hai", vi: "Lập luận chính mạnh.", en: "The main argument is strong." },
      { gurmukhi: "ਜੋਖਮ ਨੂੰ ਹੋਰ ਪਰਖ ਲਈਏ", romanization: "jokham nu hor parakh laie", vi: "Hãy kiểm tra rủi ro thêm.", en: "Let's test the risk further." },
    ],
    catalog_checks: [
      { check_vi: "Có phản biện mà vẫn giữ quan hệ chuyên nghiệp không?", check_en: "Does it challenge while preserving professional rapport?", signal_vi: "Có ਮਜ਼ਬੂਤ and ਜੋਖਮ.", signal_en: "Uses strong and risk." },
    ],
    learner_trap: {
      trap_vi: "Bắt đầu bằng phủ định toàn bộ làm mất sắc thái.",
      trap_en: "Starting with total rejection removes nuance.",
      repair_vi: "Công nhận phần mạnh rồi nêu điểm cần kiểm tra.",
      repair_en: "Acknowledge the strong part, then name what needs checking.",
    },
  },
  {
    id: "pa_c2_catalog_diplomacy_bundle",
    focus: "diplomacy",
    context: "community",
    style: "bundle_catalog",
    title_vi: "catalog: ngoại giao phạm vi",
    title_en: "catalog: scope diplomacy",
    scenario_vi: "Một nhóm cộng đồng ở Canada muốn thêm mục khi catalog đã gần chốt.",
    scenario_en: "A Canadian community group wants to add an item when the catalog is nearly final.",
    catalog_goal_vi: "Cảm ơn, giữ phạm vi hiện tại, và ghi lại cho vòng sau.",
    catalog_goal_en: "Thank them, keep current scope, and record it for a later cycle.",
    sample_gurmukhi: "ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ; ਇਸ catalog ਵਿੱਚ ਹੱਦ ਇਹੀ ਰਹੇਗੀ, ਪਰ ਅਗਲੇ ਚੱਕਰ ਲਈ ਇਸ ਨੂੰ ਰੱਖਦੇ ਹਾਂ।",
    sample_romanization: "sujhaa lai dhanvaad; is catalog vich hadd ehi rahegi, par agle chakkar lai is nu rakhde haan.",
    sample_vi: "Cảm ơn đề xuất; trong catalog này phạm vi sẽ giữ như vậy, nhưng ta giữ lại cho vòng sau.",
    sample_en: "Thank you for the suggestion; in this catalog the scope will stay as is, but we will keep it for the next cycle.",
    catalog_phrases: [
      { gurmukhi: "ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ", romanization: "sujhaa lai dhanvaad", vi: "Cảm ơn đề xuất.", en: "Thank you for the suggestion." },
      { gurmukhi: "ਅਗਲੇ ਚੱਕਰ ਲਈ", romanization: "agle chakkar lai", vi: "Cho vòng sau.", en: "For the next cycle." },
    ],
    catalog_checks: [
      { check_vi: "Có từ chối mở rộng mà vẫn lịch sự không?", check_en: "Does it decline expansion while staying polite?", signal_vi: "Có ਧੰਨਵਾਦ and ਅਗਲੇ ਚੱਕਰ.", signal_en: "Uses thanks and next cycle." },
    ],
    learner_trap: {
      trap_vi: "Nói 'không được' quá cụt làm mất ngoại giao.",
      trap_en: "A blunt 'no' loses diplomacy.",
      repair_vi: "Cảm ơn và chuyển đề xuất sang vòng sau.",
      repair_en: "Thank them and move the suggestion to a later cycle.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_catalog_mediation_receipt",
    focus: "mediation",
    context: "public",
    style: "receipt_catalog",
    title_vi: "catalog: trung gian công khai",
    title_en: "catalog: public mediation",
    scenario_vi: "Hai bên bất đồng về mẫu công khai trước khi mẫu được đưa vào catalog.",
    scenario_en: "Two sides disagree about a public sample before it enters the catalog.",
    catalog_goal_vi: "Ghi nhận hai phía, dùng tiêu chí chung, và chốt bước tiếp theo.",
    catalog_goal_en: "Record both sides, use shared criteria, and confirm the next step.",
    sample_gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਗੱਲ catalog ਵਿੱਚ ਦਰਜ ਹੈ; ਅਗਲਾ ਕਦਮ ਸਾਂਝੇ ਮਾਪਦੰਡ ਦੇ ਆਧਾਰ ਤੇ ਹੋਵੇਗਾ।",
    sample_romanization: "dovein pasian di gall catalog vich darj hai; agla kadam sanjhe mapdand de aadhaar te hovega.",
    sample_vi: "Ý kiến của cả hai bên đã được ghi trong catalog; bước tiếp theo sẽ dựa trên tiêu chí chung.",
    sample_en: "Both sides' points are recorded in the catalog; the next step will be based on shared criteria.",
    catalog_phrases: [
      { gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਗੱਲ", romanization: "dovein pasian di gall", vi: "Ý kiến của cả hai bên.", en: "Both sides' points." },
      { gurmukhi: "ਸਾਂਝੇ ਮਾਪਦੰਡ", romanization: "sanjhe mapdand", vi: "Tiêu chí chung.", en: "Shared criteria." },
    ],
    catalog_checks: [
      { check_vi: "Có giữ trung lập khi lưu mẫu không?", check_en: "Does it stay neutral while saving the sample?", signal_vi: "Có ਦੋਵੇਂ ਪਾਸਿਆਂ and ਸਾਂਝੇ ਮਾਪਦੰਡ.", signal_en: "Uses both sides and shared criteria." },
    ],
    learner_trap: {
      trap_vi: "Ghi nhận một bên nhiều hơn làm catalog thiếu cân bằng.",
      trap_en: "Recording one side more heavily makes the catalog unbalanced.",
      repair_vi: "Ghi nhận cả hai bên rồi quay về tiêu chí chung.",
      repair_en: "Record both sides, then return to shared criteria.",
    },
  },
  {
    id: "pa_c2_catalog_deescalation_pre_integration",
    focus: "deescalation",
    context: "professional",
    style: "pre_integration",
    title_vi: "catalog: hạ nhiệt trước tích hợp",
    title_en: "catalog: de-escalation before integration",
    scenario_vi: "Một lỗi nhỏ bị nhắc lại khi nhóm xem mẫu catalog cuối.",
    scenario_en: "A small issue is repeated while the group reviews the final catalog sample.",
    catalog_goal_vi: "Ghi nhận vấn đề, tách khỏi cá nhân, và quay về bước sửa.",
    catalog_goal_en: "Acknowledge the issue, separate it from the person, and return to the repair step.",
    sample_gurmukhi: "ਮੁੱਦਾ catalog ਵਿੱਚ ਦਰਜ ਹੈ; ਹੁਣ ਵਿਅਕਤੀ ਨਹੀਂ, ਸੁਧਾਰ ਦੇ ਕਦਮ ਨੂੰ ਪੱਕਾ ਕਰੀਏ।",
    sample_romanization: "mudda catalog vich darj hai; hun vyakti nahin, sudhaar de kadam nu pakka kariye.",
    sample_vi: "Vấn đề đã được ghi trong catalog; bây giờ không nhắm vào cá nhân, hãy ổn định bước sửa.",
    sample_en: "The issue is recorded in the catalog; now let's focus on the repair step, not the person.",
    catalog_phrases: [
      { gurmukhi: "ਮੁੱਦਾ catalog ਵਿੱਚ ਦਰਜ ਹੈ", romanization: "mudda catalog vich darj hai", vi: "Vấn đề đã được ghi trong catalog.", en: "The issue is recorded in the catalog." },
      { gurmukhi: "ਵਿਅਕਤੀ ਨਹੀਂ", romanization: "vyakti nahin", vi: "Không nhắm vào cá nhân.", en: "Not the person." },
    ],
    catalog_checks: [
      { check_vi: "Có hạ nhiệt bằng bước sửa cụ thể không?", check_en: "Does it de-escalate with a concrete repair step?", signal_vi: "Có ਵਿਅਕਤੀ ਨਹੀਂ and ਸੁਧਾਰ.", signal_en: "Uses not the person and repair." },
    ],
    learner_trap: {
      trap_vi: "Lặp tên người khiến cuộc họp nóng lại.",
      trap_en: "Repeating a person's name reheats the meeting.",
      repair_vi: "Tách vấn đề khỏi người và nêu bước sửa.",
      repair_en: "Separate the issue from the person and name the repair step.",
    },
  },
  {
    id: "pa_c2_catalog_audience_adaptation_canada",
    focus: "audience_adaptation",
    context: "community",
    style: "pre_a11_catalog",
    title_vi: "catalog: chỉnh giọng cho nhóm đa thế hệ",
    title_en: "catalog: adapting for a multi-generational group",
    scenario_vi: "Bạn thông báo catalog cho phụ huynh, tình nguyện viên, và người học ở Canada.",
    scenario_en: "You announce the catalog to parents, volunteers, and learners in Canada.",
    catalog_goal_vi: "Dùng câu dễ theo, nói trạng thái, và nêu khi nào dùng.",
    catalog_goal_en: "Use easy-to-follow wording, state the status, and say when it will be used.",
    sample_gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ, catalog ਤਿਆਰ ਹੈ; ਅਗਲੇ ਹਫ਼ਤੇ ਇਹ ਕਲਾਸ ਵਿੱਚ ਵਰਤਿਆ ਜਾਵੇਗਾ।",
    sample_romanization: "sadharan shabdan vich, catalog tiar hai; agle hafte ih class vich vartia javega.",
    sample_vi: "Nói đơn giản, catalog đã sẵn sàng; tuần sau sẽ được dùng trong lớp.",
    sample_en: "In simple terms, the catalog is ready; next week it will be used in class.",
    catalog_phrases: [
      { gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ", romanization: "sadharan shabdan vich", vi: "Nói bằng từ đơn giản.", en: "In simple terms." },
      { gurmukhi: "ਅਗਲੇ ਹਫ਼ਤੇ", romanization: "agle hafte", vi: "Tuần sau.", en: "Next week." },
    ],
    catalog_checks: [
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
    id: "pa_c2_catalog_sensitive_topic_framing",
    focus: "sensitive_topic_framing",
    context: "public",
    style: "bundle_catalog",
    title_vi: "catalog: khung chủ đề nhạy cảm",
    title_en: "catalog: sensitive-topic framing",
    scenario_vi: "Bạn lưu câu mở cho chủ đề nhạy cảm trong catalog cộng đồng.",
    scenario_en: "You save an opening line for a sensitive topic in a community catalog.",
    catalog_goal_vi: "Nói mục tiêu chung, giảm quy kết, và mời góp ý theo thứ tự.",
    catalog_goal_en: "Name the shared goal, reduce blame, and invite input in order.",
    sample_gurmukhi: "ਮਕਸਦ ਦੋਸ਼ ਦੇਣਾ ਨਹੀਂ; ਇਸ catalog ਦਾ ਮਕਸਦ ਸਾਂਝਾ ਹੱਲ ਲੱਭਣਾ ਅਤੇ ਸੁਝਾਅ ਕ੍ਰਮ ਨਾਲ ਸੁਣਨਾ ਹੈ।",
    sample_romanization: "maqsad dosh dena nahin; is catalog da maqsad sanjha hall labhna ate sujhaa kram naal sunna hai.",
    sample_vi: "Mục đích không phải đổ lỗi; mục đích của catalog là tìm giải pháp chung và nghe góp ý theo thứ tự.",
    sample_en: "The aim is not to blame; this catalog's aim is to find a shared solution and hear suggestions in order.",
    catalog_phrases: [
      { gurmukhi: "ਦੋਸ਼ ਦੇਣਾ ਨਹੀਂ", romanization: "dosh dena nahin", vi: "Không phải đổ lỗi.", en: "Not to blame." },
      { gurmukhi: "ਸਾਂਝਾ ਹੱਲ", romanization: "sanjha hall", vi: "Giải pháp chung.", en: "Shared solution." },
    ],
    catalog_checks: [
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
    id: "pa_c2_catalog_public_communication_calibration",
    focus: "public_communication_calibration",
    context: "public",
    style: "receipt_catalog",
    title_vi: "catalog: cân chỉnh thông báo công khai",
    title_en: "catalog: public communication calibration",
    scenario_vi: "Bạn lưu mẫu thông báo thay đổi dịch vụ cộng đồng ở Canada.",
    scenario_en: "You save a notice sample about a community-service change in Canada.",
    catalog_goal_vi: "Nói thay đổi, lý do ngắn, và nơi nhận hỗ trợ.",
    catalog_goal_en: "State the change, give a short reason, and name where to get support.",
    sample_gurmukhi: "ਸੇਵਾ ਦਾ ਸਮਾਂ ਬਦਲਿਆ ਹੈ; ਕਾਰਨ ਸਟਾਫ਼ ਦੀ ਘਾਟ ਹੈ, ਅਤੇ ਮਦਦ ਲਈ ਡੈਸਕ ਖੁੱਲ੍ਹਾ ਰਹੇਗਾ।",
    sample_romanization: "seva da sama badlia hai; karan staff di ghaat hai, ate madad lai desk khulla rahega.",
    sample_vi: "Giờ dịch vụ đã đổi; lý do là thiếu nhân sự, và bàn hỗ trợ sẽ vẫn mở.",
    sample_en: "The service time has changed; the reason is staff shortage, and the help desk will remain open.",
    catalog_phrases: [
      { gurmukhi: "ਸੇਵਾ ਦਾ ਸਮਾਂ ਬਦਲਿਆ ਹੈ", romanization: "seva da sama badlia hai", vi: "Giờ dịch vụ đã đổi.", en: "The service time has changed." },
      { gurmukhi: "ਮਦਦ ਲਈ ਡੈਸਕ", romanization: "madad lai desk", vi: "Bàn hỗ trợ.", en: "Help desk." },
    ],
    catalog_checks: [
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
    id: "pa_c2_catalog_register_safety",
    focus: "register_safety",
    context: "professional",
    style: "pre_integration",
    title_vi: "catalog: an toàn register",
    title_en: "catalog: register safety",
    scenario_vi: "Bạn sửa câu quá thân mật trước khi lưu vào catalog chuyên nghiệp.",
    scenario_en: "You repair an overly casual line before saving it in a professional catalog.",
    catalog_goal_vi: "Giữ lịch sự, cụ thể, không phóng đại, và có yêu cầu rõ.",
    catalog_goal_en: "Stay polite, specific, not exaggerated, and clear in the request.",
    sample_gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇਸ catalog ਦੀ ਸਮੀਖਿਆ ਕਰੋ ਅਤੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।",
    sample_romanization: "kirpa karke is catalog di samikhia karo ate agla kadam daso.",
    sample_vi: "Vui lòng xem xét catalog này và cho biết bước tiếp theo.",
    sample_en: "Please review this catalog and advise the next step.",
    catalog_phrases: [
      { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ", romanization: "kirpa karke", vi: "Vui lòng.", en: "Please." },
      { gurmukhi: "ਅਗਲਾ ਕਦਮ ਦੱਸੋ", romanization: "agla kadam daso", vi: "Cho biết bước tiếp theo.", en: "Advise the next step." },
    ],
    catalog_checks: [
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

export const c2CatalogSamplesByFocus = (focus: PunjabiC2CatalogFocus) =>
  c2CatalogSamples.filter((item) => item.focus === focus);

export const c2CatalogSamplesByStyle = (style: PunjabiC2CatalogStyle) =>
  c2CatalogSamples.filter((item) => item.style === style);

export default c2CatalogSamples;
