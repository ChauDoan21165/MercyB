// Punjabi C2 archive samples for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support archive samples only, not certification,
// official placement, legal/HR/medical/safety advice, or native-reviewed
// authority. Native review is deferred. Shahmukhi is mentioned only for script
// awareness, not as a full course.

export type PunjabiC2ArchiveFocus =
  | "nuanced_disagreement"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "audience_adaptation"
  | "sensitive_topic_framing"
  | "public_communication_calibration"
  | "register_safety";

export type PunjabiC2ArchiveContext = "public" | "professional" | "community";
export type PunjabiC2ArchiveStyle =
  | "pre_archive"
  | "archive_signoff"
  | "seal_ready"
  | "pre_integration";

export type PunjabiC2ArchivePhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2ArchiveCheck = {
  check_vi: string;
  check_en: string;
  signal_vi: string;
  signal_en: string;
};

export type PunjabiC2ArchiveTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2ArchiveSample = {
  id: string;
  focus: PunjabiC2ArchiveFocus;
  context: PunjabiC2ArchiveContext;
  style: PunjabiC2ArchiveStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  archive_goal_vi: string;
  archive_goal_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  archive_phrases: PunjabiC2ArchivePhrase[];
  checks: PunjabiC2ArchiveCheck[];
  learner_trap?: PunjabiC2ArchiveTrap;
  canada_practical?: boolean;
};

export const C2_ARCHIVE_SAMPLES_DISCLAIMER = {
  vi: "Bộ archive Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi archive sample pack supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const c2ArchiveSamples: PunjabiC2ArchiveSample[] = [
  {
    id: "pa_c2_archive_nuanced_disagreement_pre_archive",
    focus: "nuanced_disagreement",
    context: "professional",
    style: "pre_archive",
    title_vi: "archive: bất đồng tinh tế",
    title_en: "archive: nuanced disagreement",
    scenario_vi: "Bạn lưu một câu phản biện gọn trước khi khóa bản cuối.",
    scenario_en: "You archive a concise challenge line before the final version is locked.",
    archive_goal_vi: "Công nhận hướng đi, nêu điểm còn yếu, rồi giữ giọng ổn định.",
    archive_goal_en: "Validate the direction, name the weak point, then keep the tone steady.",
    sample_gurmukhi: "ਦਿਸ਼ਾ ਠੀਕ ਹੈ, ਪਰ archive ਤੋਂ ਪਹਿਲਾਂ ਇਸ ਦਲੀਲ ਨੂੰ ਇੱਕ ਵਾਰੀ ਹੋਰ ਪਰਖ ਲਈਏ।",
    sample_romanization: "disha theek hai, par archive ton pehlaan is dalil nu ikk vari hor parakh laie.",
    sample_vi: "Hướng đi đúng, nhưng trước khi lưu archive hãy kiểm tra lập luận này thêm một lần.",
    sample_en: "The direction is right, but before archiving let's test this argument once more.",
    archive_phrases: [
      { gurmukhi: "ਦਿਸ਼ਾ ਠੀਕ ਹੈ", romanization: "disha theek hai", vi: "Hướng đi đúng.", en: "The direction is right." },
      { gurmukhi: "ਇੱਕ ਵਾਰੀ ਹੋਰ ਪਰਖ ਲਈਏ", romanization: "ikk vari hor parakh laie", vi: "Hãy kiểm tra thêm một lần.", en: "Let's test it once more." },
    ],
    checks: [
      { check_vi: "Có bất đồng mà vẫn giữ nhịp bình tĩnh không?", check_en: "Does it disagree while staying calm?", signal_vi: "Có ਦਿਸ਼ਾ ਠੀਕ và ਪਰਖ.", signal_en: "Uses direction is right and test." },
    ],
    learner_trap: {
      trap_vi: "Bác bỏ thẳng làm mất cân bằng giọng.",
      trap_en: "Direct rejection throws off the tone balance.",
      repair_vi: "Công nhận hướng đi rồi yêu cầu kiểm tra thêm.",
      repair_en: "Validate the direction, then ask for another check.",
    },
  },
  {
    id: "pa_c2_archive_diplomacy_seal_ready",
    focus: "diplomacy",
    context: "community",
    style: "seal_ready",
    title_vi: "archive: ngoại giao phạm vi",
    title_en: "archive: scope diplomacy",
    scenario_vi: "Nhóm cộng đồng ở Canada muốn thêm ý kiến sau khi đã gần seal.",
    scenario_en: "A Canadian community group wants to add a suggestion after the sample is nearly sealed.",
    archive_goal_vi: "Cảm ơn, giữ phạm vi hiện tại, và mở vòng sau.",
    archive_goal_en: "Thank them, keep the current scope, and open a later cycle.",
    sample_gurmukhi: "ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ। ਇਸ archive ਵਿੱਚ ਹੱਦ ਨਹੀਂ ਬਦਲੇਗੀ, ਪਰ ਅਗਲੇ ਚੱਕਰ ਲਈ ਇਸ ਨੂੰ ਸੰਭਾਲ ਲੈਂਦੇ ਹਾਂ।",
    sample_romanization: "sujhaa lai dhanvaad. is archive vich hadd nahin badlegi, par agle chakkar lai is nu sambhaal lainde haan.",
    sample_vi: "Cảm ơn đề xuất. Trong archive này phạm vi sẽ không đổi, nhưng ta sẽ giữ lại cho vòng sau.",
    sample_en: "Thank you for the suggestion. In this archive the scope will not change, but we will keep it for the next cycle.",
    archive_phrases: [
      { gurmukhi: "ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ", romanization: "sujhaa lai dhanvaad", vi: "Cảm ơn đề xuất.", en: "Thank you for the suggestion." },
      { gurmukhi: "ਅਗਲੇ ਚੱਕਰ ਲਈ", romanization: "agle chakkar lai", vi: "Cho vòng sau.", en: "For the next cycle." },
    ],
    checks: [
      { check_vi: "Có từ chối thay đổi mà vẫn giữ quan hệ không?", check_en: "Does it decline a change while preserving rapport?", signal_vi: "Có ਧੰਨਵਾਦ and ਅਗਲੇ ਚੱਕਰ.", signal_en: "Includes thanks and next cycle." },
    ],
    learner_trap: {
      trap_vi: "Nói 'quá muộn rồi' nghe cắt ngang.",
      trap_en: "Saying 'it is too late' sounds dismissive.",
      repair_vi: "Cảm ơn và chuyển đề xuất sang vòng sau.",
      repair_en: "Thank them and move the suggestion to the next cycle.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_archive_mediation_pre_integration",
    focus: "mediation",
    context: "public",
    style: "pre_integration",
    title_vi: "archive: trung gian công khai",
    title_en: "archive: public mediation",
    scenario_vi: "Hai bên bất đồng về bản cuối và cần câu chốt không thiên vị.",
    scenario_en: "Two sides disagree about the final version and need a neutral closing line.",
    archive_goal_vi: "Ghi nhận hai phía, dùng tiêu chí chung, và ổn định quyết định.",
    archive_goal_en: "Acknowledge both sides, use shared criteria, and confirm the decision.",
    sample_gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਗੱਲ ਦਰਜ ਹੈ; archive ਸਾਂਝੇ ਮਾਪਦੰਡ ਦੇ ਆਧਾਰ ਤੇ ਕੀਤਾ ਜਾਵੇਗਾ।",
    sample_romanization: "dovein pasian di gall darj hai; archive sanjhe mapdand de aadhaar te kita javega.",
    sample_vi: "Ý kiến của cả hai bên đã được ghi nhận; archive sẽ dựa trên tiêu chí chung.",
    sample_en: "Both sides' points are recorded; the archive decision will be based on shared criteria.",
    archive_phrases: [
      { gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਗੱਲ ਦਰਜ ਹੈ", romanization: "dovein pasian di gall darj hai", vi: "Ý kiến của cả hai bên đã được ghi nhận.", en: "Both sides' points are recorded." },
      { gurmukhi: "ਸਾਂਝੇ ਮਾਪਦੰਡ ਦੇ ਆਧਾਰ ਤੇ", romanization: "sanjhe mapdand de aadhaar te", vi: "Dựa trên tiêu chí chung.", en: "Based on shared criteria." },
    ],
    checks: [
      { check_vi: "Có giữ trung lập khi chốt không?", check_en: "Does it stay neutral while closing?", signal_vi: "Có ਦੋਵੇਂ ਪਾਸਿਆਂ and ਸਾਂਝੇ ਮਾਪਦੰਡ.", signal_en: "Uses both sides and shared criteria." },
    ],
    learner_trap: {
      trap_vi: "Chốt bằng lời khen một bên làm lệch cân bằng.",
      trap_en: "Closing with praise for one side tilts the balance.",
      repair_vi: "Ghi nhận hai bên và đưa về tiêu chí chung.",
      repair_en: "Record both sides and return to shared criteria.",
    },
  },
  {
    id: "pa_c2_archive_deescalation_archive_signoff",
    focus: "deescalation",
    context: "professional",
    style: "archive_signoff",
    title_vi: "archive: hạ nhiệt trách nhiệm",
    title_en: "archive: de-escalating ownership",
    scenario_vi: "Cuộc họp archive căng vì một lỗi nhỏ còn được nhắc lại.",
    scenario_en: "An archive meeting is tense because a small issue keeps being repeated.",
    archive_goal_vi: "Ghi nhận vấn đề, tách khỏi cá nhân, và ổn định hành động sửa.",
    archive_goal_en: "Acknowledge the issue, separate it from the person, and confirm the repair action.",
    sample_gurmukhi: "ਮੁੱਦਾ ਦਰਜ ਹੋ ਗਿਆ ਹੈ; ਹੁਣ ਵਿਅਕਤੀ ਨਹੀਂ, ਸੁਧਾਰ ਦੇ ਕਦਮ ਨੂੰ archive ਵਿੱਚ ਪੱਕਾ ਕਰੀਏ।",
    sample_romanization: "mudda darj ho giya hai; hun vyakti nahin, sudhaar de kadam nu archive vich pakka kariye.",
    sample_vi: "Vấn đề đã được ghi nhận; bây giờ không nói về cá nhân, hãy ổn định bước sửa trong archive.",
    sample_en: "The issue has been recorded; now let's focus on the repair step, not the person, in the archive.",
    archive_phrases: [
      { gurmukhi: "ਮੁੱਦਾ ਦਰਜ ਹੋ ਗਿਆ ਹੈ", romanization: "mudda darj ho giya hai", vi: "Vấn đề đã được ghi nhận.", en: "The issue has been recorded." },
      { gurmukhi: "ਸੁਧਾਰ ਦੇ ਕਦਮ", romanization: "sudhaar de kadam", vi: "Bước sửa.", en: "The repair step." },
    ],
    checks: [
      { check_vi: "Có hạ nhiệt bằng hành động sửa không?", check_en: "Does it de-escalate through a repair action?", signal_vi: "Có ਵਿਅਕਤੀ ਨਹੀਂ and ਸੁਧਾਰ.", signal_en: "Uses not the person and repair." },
    ],
    learner_trap: {
      trap_vi: "Lặp tên người liên quan làm cuộc họp nóng lại.",
      trap_en: "Repeating the person's name reheats the meeting.",
      repair_vi: "Nói vấn đề đã ghi nhận và ổn định bước sửa.",
      repair_en: "Say the issue is recorded and confirm the repair step.",
    },
  },
  {
    id: "pa_c2_archive_audience_adaptation_canada",
    focus: "audience_adaptation",
    context: "community",
    style: "pre_archive",
    title_vi: "archive: thông báo cho nhóm đa thế hệ",
    title_en: "archive: notice for a multi-generational group",
    scenario_vi: "Bạn báo cho phụ huynh, tình nguyện viên, và người học ở Canada rằng bản cuối đã chốt.",
    scenario_en: "You tell parents, volunteers, and learners in Canada that the final version has been archived.",
    archive_goal_vi: "Dùng câu dễ theo, nói trạng thái, và nêu bước tiếp theo.",
    archive_goal_en: "Use easy-to-follow wording, state the status, and name the next step.",
    sample_gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ, ਅੰਤਿਮ ਰੂਪ ਪੱਕਾ ਹੋ ਗਿਆ ਹੈ; ਅਗਲੇ ਹਫ਼ਤੇ ਇਹ ਕਲਾਸ ਵਿੱਚ ਵਰਤਿਆ ਜਾਵੇਗਾ।",
    sample_romanization: "sadharan shabdan vich, antim roop pakka ho giya hai; agle hafte ih class vich vartia javega.",
    sample_vi: "Nói đơn giản, bản cuối đã sẵn sàng; tuần sau sẽ dùng trong lớp.",
    sample_en: "In simple terms, the final version is ready; next week it will be used in class.",
    archive_phrases: [
      { gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ", romanization: "sadharan shabdan vich", vi: "Nói bằng từ đơn giản.", en: "In simple terms." },
      { gurmukhi: "ਅੰਤਿਮ ਰੂਪ ਪੱਕਾ ਹੋ ਗਿਆ ਹੈ", romanization: "antim roop pakka ho giya hai", vi: "Bản cuối đã được ổn định.", en: "The final version is ready." },
    ],
    checks: [
      { check_vi: "Có phù hợp người nghe ngoài nhóm kỹ thuật không?", check_en: "Is it suitable for a non-technical audience?", signal_vi: "Có ਸਧਾਰਨ ਸ਼ਬਦਾਂ and thời gian cụ thể.", signal_en: "Uses simple terms and a concrete time." },
    ],
    learner_trap: {
      trap_vi: "Dùng thuật ngữ nội bộ như merge khiến phụ huynh khó theo.",
      trap_en: "Internal terms such as merge make the notice hard for parents to follow.",
      repair_vi: "Nói trạng thái cuối và tuần áp dụng.",
      repair_en: "State final status and the week of use.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_archive_sensitive_topic_framing_seal_ready",
    focus: "sensitive_topic_framing",
    context: "public",
    style: "seal_ready",
    title_vi: "archive: khung chủ đề nhạy cảm",
    title_en: "archive: sensitive-topic framing",
    scenario_vi: "Một nhận xét công khai kéo bản cuối sang chính trị, tôn giáo, tiền bạc, hoặc danh tính cá nhân.",
    scenario_en: "A public comment pulls the archive toward politics, religion, money, or personal identity.",
    archive_goal_vi: "Đặt ranh giới ngắn, tôn trọng, và quay về phần liên quan nhiệm vụ.",
    archive_goal_en: "Set a brief respectful boundary and return to the task-relevant part.",
    sample_gurmukhi: "ਇਹ ਵਿਸ਼ਾ ਸੰਵੇਦਨਸ਼ੀਲ ਹੈ, ਇਸ ਲਈ archive ਨੂੰ ਕੰਮ ਨਾਲ ਜੁੜੇ ਹਿੱਸੇ ਤੱਕ ਹੀ ਰੱਖੀਏ।",
    sample_romanization: "ih visha sanvedansheel hai, is lai archive nu kamm naal jurre hisse takk hi rakhie.",
    sample_vi: "Chủ đề này nhạy cảm, vì vậy hãy giữ archive chỉ trong phần liên quan công việc.",
    sample_en: "This topic is sensitive, so let's keep the archive only to the work-related part.",
    archive_phrases: [
      { gurmukhi: "ਵਿਸ਼ਾ ਸੰਵੇਦਨਸ਼ੀਲ ਹੈ", romanization: "visha sanvedansheel hai", vi: "Chủ đề nhạy cảm.", en: "The topic is sensitive." },
      { gurmukhi: "ਕੰਮ ਨਾਲ ਜੁੜੇ ਹਿੱਸੇ ਤੱਕ", romanization: "kamm naal jurre hisse takk", vi: "Trong phần liên quan công việc.", en: "To the work-related part." },
    ],
    checks: [
      { check_vi: "Có giữ ranh giới mà không gây gắt không?", check_en: "Does it set a boundary without sounding harsh?", signal_vi: "Có ਸੰਵੇਦਨਸ਼ੀਲ and ਕੰਮ ਨਾਲ ਜੁੜੇ.", signal_en: "Uses sensitive and work-related." },
    ],
    learner_trap: {
      trap_vi: "Trả lời dài làm chủ đề rẽ sang tranh luận.",
      trap_en: "A long reply lets the topic slide into debate.",
      repair_vi: "Đặt ranh giới ngắn và quay về nhiệm vụ.",
      repair_en: "Set a short boundary and return to the task.",
    },
  },
  {
    id: "pa_c2_archive_public_communication_calibration",
    focus: "public_communication_calibration",
    context: "public",
    style: "pre_integration",
    title_vi: "archive: hiệu chỉnh giao tiếp công khai",
    title_en: "archive: public communication calibration",
    scenario_vi: "Bạn cần câu chốt cho bản tin công khai ở Canada mà không làm nó quá cứng hay quá mơ hồ.",
    scenario_en: "You need a closing line for a public notice in Canada without making it too rigid or too vague.",
    archive_goal_vi: "Giữ rõ ràng, có thể dùng ngay, và vừa phải với nhiều người nghe.",
    archive_goal_en: "Keep it clear, usable, and appropriately measured for a broad audience.",
    sample_gurmukhi: "ਅਸੀਂ ਗੱਲ ਸੁਣ ਲਈ ਹੈ; ਹੁਣ archive ਨੂੰ ਐਨਾ ਸਾਫ਼ ਰੱਖੀਏ ਕਿ ਹਰ ਕੋਈ ਅਗਲਾ ਕਦਮ ਸਮਝ ਲਵੇ।",
    sample_romanization: "asin gall sun lai hai; hun archive nu aina saaf rakhie ki har koi agla kadam samajh lave.",
    sample_vi: "Chúng tôi đã lắng nghe; giờ hãy giữ archive đủ rõ để mọi người hiểu bước tiếp theo.",
    sample_en: "We have heard the concern; now let's keep the archive clear enough for everyone to understand the next step.",
    archive_phrases: [
      { gurmukhi: "ਹਰ ਕੋਈ ਅਗਲਾ ਕਦਮ ਸਮਝ ਲਵੇ", romanization: "har koi agla kadam samajh lave", vi: "Để mọi người hiểu bước tiếp theo.", en: "So everyone understands the next step." },
      { gurmukhi: "ਐਨਾ ਸਾਫ਼ ਰੱਖੀਏ", romanization: "aina saaf rakhie", vi: "Hãy giữ đủ rõ.", en: "Let's keep it clear enough." },
    ],
    checks: [
      { check_vi: "Có cân bằng giữa rõ ràng và mềm không?", check_en: "Does it balance clarity and restraint?", signal_vi: "Có ਸਾਫ਼ ਅਤੇ ਅਗਲਾ ਕਦਮ.", signal_en: "Uses clear and next step." },
    ],
    learner_trap: {
      trap_vi: "Quá mềm khiến thông báo thiếu hướng đi.",
      trap_en: "Too much softness leaves the notice without direction.",
      repair_vi: "Nói rõ bước tiếp theo bằng giọng vừa phải.",
      repair_en: "State the next step in a measured tone.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_archive_register_safety",
    focus: "register_safety",
    context: "professional",
    style: "archive_signoff",
    title_vi: "archive: an toàn mức độ lịch sự",
    title_en: "archive: register safety",
    scenario_vi: "Bạn có một câu quá thẳng và cần lưu nó như mẫu sửa để dùng với giáo viên, lễ tân, hoặc quản lý.",
    scenario_en: "You have a blunt line and need to archive the repaired version for use with a teacher, receptionist, or supervisor.",
    archive_goal_vi: "Đổi câu thẳng thành câu lịch sự nhưng vẫn cụ thể.",
    archive_goal_en: "Turn the blunt line into a polite but still concrete request.",
    sample_gurmukhi: "ਮੈਨੂੰ ਇਹ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਸਮਝਾ ਦਿਓ, ਫਿਰ archive ਨੂੰ seal ਕਰੀਏ।",
    sample_romanization: "mainu eh samajh nahin aaya. kirpa karke eh samjha dio, phir archive nu seal kariye.",
    sample_vi: "Tôi chưa hiểu điều này. Vui lòng giải thích giúp tôi, rồi hãy đóng seal archive.",
    sample_en: "I did not understand this. Please explain it, then let's seal the archive.",
    archive_phrases: [
      { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਸਮਝਾ ਦਿਓ", romanization: "kirpa karke eh samjha dio", vi: "Vui lòng giải thích giúp tôi.", en: "Please explain this." },
      { gurmukhi: "ਕੋਈ ਉਦਾਹਰਨ ਦੇ ਸਕਦੇ ਹੋ?", romanization: "koi udaharan de sakde ho?", vi: "Bạn có thể cho ví dụ không?", en: "Can you give an example?" },
    ],
    checks: [
      { check_vi: "Có đủ lịch sự nhưng vẫn dùng được không?", check_en: "Is it polite without becoming vague?", signal_vi: "Có explain và ਉਦਾਹਰਨ.", signal_en: "Uses explain and example." },
    ],
    learner_trap: {
      trap_vi: "Lịch sự nhưng mơ hồ khiến người nghe không biết phải làm gì.",
      trap_en: "Polite but vague wording leaves the listener unsure what to do.",
      repair_vi: "Giữ lịch sự và thêm yêu cầu cụ thể.",
      repair_en: "Stay polite and add a concrete request.",
    },
    canada_practical: true,
  },
];

export const c2ArchiveSamplesByFocus = (focus: PunjabiC2ArchiveFocus) =>
  c2ArchiveSamples.filter((item) => item.focus === focus);

export const c2ArchiveSamplesByStyle = (style: PunjabiC2ArchiveStyle) =>
  c2ArchiveSamples.filter((item) => item.style === style);

