// Punjabi C2 MR-readiness evidence for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support MR-readiness evidence only, not certification,
// official placement, legal/HR/medical/safety advice, or native-reviewed
// authority. Native review is deferred. Shahmukhi is mentioned only for script
// awareness, not as a full course.

export type PunjabiC2MrReadinessFocus =
  | "nuanced_disagreement"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "audience_adaptation"
  | "sensitive_topic_framing"
  | "public_communication_calibration"
  | "register_safety";

export type PunjabiC2MrReadinessContext = "public" | "professional" | "community";
export type PunjabiC2MrReadinessStyle = "mr_readiness" | "final_freeze" | "final_lock" | "pre_integration";

export type PunjabiC2MrReadinessPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2MrReadinessCheck = {
  check_vi: string;
  check_en: string;
  signal_vi: string;
  signal_en: string;
};

export type PunjabiC2MrReadinessTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2MrReadinessEvidenceItem = {
  id: string;
  focus: PunjabiC2MrReadinessFocus;
  context: PunjabiC2MrReadinessContext;
  style: PunjabiC2MrReadinessStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  evidence_goal_vi: string;
  evidence_goal_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  mr_readiness_evidence_phrases: PunjabiC2MrReadinessPhrase[];
  checks: PunjabiC2MrReadinessCheck[];
  learner_trap?: PunjabiC2MrReadinessTrap;
  canada_practical?: boolean;
};

export const C2_MR_READINESS_EVIDENCE_DISCLAIMER = {
  vi: "Bộ MR-readiness Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi MR-readiness evidence pack supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const c2MrReadinessEvidence: PunjabiC2MrReadinessEvidenceItem[] = [
  {
    id: "pa_c2_mr_readiness_nuanced_disagreement_professional",
    focus: "nuanced_disagreement",
    context: "professional",
    style: "mr_readiness",
    title_vi: "MR readiness: bất đồng tinh tế",
    title_en: "MR readiness: nuanced disagreement",
    scenario_vi: "Bạn cần phản biện một điểm trước khi ổn định bản cuối.",
    scenario_en: "You need to challenge one point before locking the final version.",
    evidence_goal_vi: "Công nhận hướng đi, nêu điểm còn yếu, rồi đề xuất kiểm tra cuối.",
    evidence_goal_en: "Validate the direction, name the weak point, then propose a final check.",
    sample_gurmukhi: "ਦਿਸ਼ਾ ਠੀਕ ਹੈ, ਪਰ MR readiness ਤੋਂ ਪਹਿਲਾਂ ਇਸ ਦਲੀਲ ਨੂੰ ਇੱਕ ਵਾਰੀ ਹੋਰ ਪਰਖ ਲਈਏ।",
    sample_romanization: "disha theek hai, par MR readiness ton pehlaan is dalil nu ikk vari hor parakh laie.",
    sample_vi: "Hướng đi đúng, nhưng trước MR readiness ta hãy kiểm tra lập luận này thêm một lần.",
    sample_en: "The direction is right, but before MR readiness let's test this argument once more.",
    mr_readiness_evidence_phrases: [
      { gurmukhi: "ਦਿਸ਼ਾ ਠੀਕ ਹੈ", romanization: "disha theek hai", vi: "Hướng đi đúng.", en: "The direction is right." },
      { gurmukhi: "ਦਲੀਲ ਨੂੰ ਇੱਕ ਵਾਰੀ ਹੋਰ ਪਰਖ ਲਈਏ", romanization: "dalil nu ikk vari hor parakh laie", vi: "Hãy kiểm tra lập luận thêm một lần.", en: "Let's test the argument once more." },
    ],
    checks: [
      { check_vi: "Có phản biện mà vẫn giữ đồng thuận không?", check_en: "Does it challenge while preserving alignment?", signal_vi: "Có ਦਿਸ਼ਾ ਠੀਕ before ਪਰ.", signal_en: "Uses direction is right before but." },
    ],
    learner_trap: {
      trap_vi: "Phủ định thẳng trước lúc ổn định làm giọng quá căng.",
      trap_en: "Direct negation before MR readiness makes the tone too tense.",
      repair_vi: "Công nhận hướng đi rồi yêu cầu kiểm tra lập luận.",
      repair_en: "Validate the direction, then request an argument check.",
    },
  },
  {
    id: "pa_c2_mr_readiness_diplomacy_community_canada",
    focus: "diplomacy",
    context: "community",
    style: "final_freeze",
    title_vi: "MR readiness: ngoại giao phạm vi",
    title_en: "MR readiness: scope diplomacy",
    scenario_vi: "Một nhóm cộng đồng ở Canada muốn thêm đề xuất sau hạn ổn định.",
    scenario_en: "A Canadian community group wants to add a suggestion after the MR review deadline.",
    evidence_goal_vi: "Cảm ơn, giữ phạm vi hiện tại, và mở vòng sau.",
    evidence_goal_en: "Thank them, keep the current scope, and open a later cycle.",
    sample_gurmukhi: "ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ। ਇਸ MR readiness ਵਿੱਚ ਹੱਦ ਨਹੀਂ ਬਦਲੇਗੀ, ਪਰ ਅਗਲੇ ਚੱਕਰ ਲਈ ਇਸ ਨੂੰ ਸੰਭਾਲ ਲੈਂਦੇ ਹਾਂ।",
    sample_romanization: "sujhaa lai dhanvaad. is MR readiness vich hadd nahin badlegi, par agle chakkar lai is nu sambhaal lainde haan.",
    sample_vi: "Cảm ơn đề xuất. Trong MR readiness này phạm vi sẽ không đổi, nhưng ta sẽ giữ lại cho vòng sau.",
    sample_en: "Thank you for the suggestion. In this MR readiness the scope will not change, but we will keep it for the next cycle.",
    mr_readiness_evidence_phrases: [
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
    id: "pa_c2_mr_readiness_mediation_public",
    focus: "mediation",
    context: "public",
    style: "final_lock",
    title_vi: "MR readiness: trung gian công khai",
    title_en: "MR readiness: public mediation",
    scenario_vi: "Hai bên bất đồng về bản cuối và cần câu chốt không thiên vị.",
    scenario_en: "Two sides disagree about the final version and need a neutral closing line.",
    evidence_goal_vi: "Ghi nhận hai phía, dùng tiêu chí chung, và ổn định quyết định.",
    evidence_goal_en: "Acknowledge both sides, use shared criteria, and confirm the decision.",
    sample_gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਗੱਲ ਦਰਜ ਹੈ; MR readiness ਸਾਂਝੇ ਮਾਪਦੰਡ ਦੇ ਆਧਾਰ ਤੇ ਕੀਤਾ ਜਾਵੇਗਾ।",
    sample_romanization: "dovein pasian di gall darj hai; MR readiness sanjhe mapdand de aadhaar te kita javega.",
    sample_vi: "Ý kiến của cả hai bên đã được ghi nhận; MR readiness sẽ dựa trên tiêu chí chung.",
    sample_en: "Both sides' points are recorded; the MR readiness will be based on shared criteria.",
    mr_readiness_evidence_phrases: [
      { gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਗੱਲ ਦਰਜ ਹੈ", romanization: "dovein pasian di gall darj hai", vi: "Ý kiến của cả hai bên đã được ghi nhận.", en: "Both sides' points are recorded." },
      { gurmukhi: "ਸਾਂਝੇ ਮਾਪਦੰਡ ਦੇ ਆਧਾਰ ਤੇ", romanization: "sanjhe mapdand de aadhaar te", vi: "Dựa trên tiêu chí chung.", en: "Based on shared criteria." },
    ],
    checks: [
      { check_vi: "Có giữ trung lập khi ổn định không?", check_en: "Does it stay neutral while locking?", signal_vi: "Có ਦੋਵੇਂ ਪਾਸਿਆਂ and ਸਾਂਝੇ ਮਾਪਦੰਡ.", signal_en: "Uses both sides and shared criteria." },
    ],
    learner_trap: {
      trap_vi: "Chốt bằng lời khen một bên làm lệch cân bằng.",
      trap_en: "Closing with praise for one side tilts the balance.",
      repair_vi: "Ghi nhận hai bên và đưa về tiêu chí chung.",
      repair_en: "Record both sides and return to shared criteria.",
    },
  },
  {
    id: "pa_c2_mr_readiness_deescalation_professional",
    focus: "deescalation",
    context: "professional",
    style: "mr_readiness",
    title_vi: "MR readiness: hạ nhiệt trách nhiệm",
    title_en: "MR readiness: de-escalating ownership",
    scenario_vi: "Cuộc họp ổn định cuối căng vì một lỗi nhỏ còn được nhắc lại.",
    scenario_en: "A MR readiness meeting is tense because a small issue keeps being repeated.",
    evidence_goal_vi: "Ghi nhận vấn đề, tách khỏi cá nhân, và ổn định hành động sửa.",
    evidence_goal_en: "Acknowledge the issue, separate it from the person, and confirm the repair action.",
    sample_gurmukhi: "ਮੁੱਦਾ ਦਰਜ ਹੋ ਗਿਆ ਹੈ; ਹੁਣ ਵਿਅਕਤੀ ਨਹੀਂ, ਸੁਧਾਰ ਦੇ ਕਦਮ ਨੂੰ MR readiness ਵਿੱਚ ਪੱਕਾ ਕਰੀਏ।",
    sample_romanization: "mudda darj ho giya hai; hun vyakti nahin, sudhaar de kadam nu MR readiness vich pakka kariye.",
    sample_vi: "Vấn đề đã được ghi nhận; bây giờ không nói về cá nhân, hãy ổn định bước sửa trong MR readiness.",
    sample_en: "The issue has been recorded; now let's focus on the repair step, not the person, in MR readiness.",
    mr_readiness_evidence_phrases: [
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
    id: "pa_c2_mr_readiness_audience_adaptation_canada",
    focus: "audience_adaptation",
    context: "community",
    style: "pre_integration",
    title_vi: "MR readiness: thông báo cho nhóm đa thế hệ",
    title_en: "MR readiness: notice for a multi-generational group",
    scenario_vi: "Bạn báo cho phụ huynh, tình nguyện viên, và người học ở Canada rằng bản cuối đã ổn định.",
    scenario_en: "You tell parents, volunteers, and learners in Canada that the stability evidence is ready.",
    evidence_goal_vi: "Dùng câu dễ theo, nói trạng thái, và nêu bước tiếp theo.",
    evidence_goal_en: "Use easy-to-follow wording, state the status, and name the next step.",
    sample_gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ, ਅੰਤਿਮ ਰੂਪ ਪੱਕਾ ਹੋ ਗਿਆ ਹੈ; ਅਗਲੇ ਹਫ਼ਤੇ ਇਹ ਕਲਾਸ ਵਿੱਚ ਵਰਤਿਆ ਜਾਵੇਗਾ।",
    sample_romanization: "sadharan shabdan vich, antim roop pakka ho giya hai; agle hafte ih class vich vartia javega.",
    sample_vi: "Nói đơn giản, bằng chứng đã sẵn sàng; tuần sau sẽ dùng trong lớp.",
    sample_en: "In simple terms, the stability evidence is ready; next week it will be used in class.",
    mr_readiness_evidence_phrases: [
      { gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ", romanization: "sadharan shabdan vich", vi: "Nói bằng từ đơn giản.", en: "In simple terms." },
      { gurmukhi: "ਅੰਤਿਮ ਰੂਪ ਪੱਕਾ ਹੋ ਗਿਆ ਹੈ", romanization: "antim roop pakka ho giya hai", vi: "Bản cuối đã được ổn định.", en: "The stability evidence is ready." },
    ],
    checks: [
      { check_vi: "Có phù hợp người nghe ngoài nhóm kỹ thuật không?", check_en: "Is it suitable for a non-technical audience?", signal_vi: "Có ਸਧਾਰਨ ਸ਼ਬਦਾਂ and thời gian cụ thể.", signal_en: "Uses simple terms and a concrete time." },
    ],
    learner_trap: {
      trap_vi: "Dùng thuật ngữ nội bộ như checksum khiến phụ huynh khó theo.",
      trap_en: "Internal terms such as checksum make the notice hard for parents to follow.",
      repair_vi: "Nói trạng thái cuối và tuần áp dụng.",
      repair_en: "State final status and the week of use.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_mr_readiness_sensitive_topic_public",
    focus: "sensitive_topic_framing",
    context: "public",
    style: "final_lock",
    title_vi: "MR readiness: khung chủ đề nhạy cảm",
    title_en: "MR readiness: sensitive-topic framing",
    scenario_vi: "Một nhận xét công khai kéo bản ổn định cuối sang chính trị, tôn giáo, tiền bạc, hoặc danh tính cá nhân.",
    scenario_en: "A public comment pulls the MR readiness toward politics, religion, money, or personal identity.",
    evidence_goal_vi: "Đặt ranh giới ngắn, tôn trọng, và quay về phần liên quan nhiệm vụ.",
    evidence_goal_en: "Set a brief respectful boundary and return to the task-relevant part.",
    sample_gurmukhi: "ਇਹ ਵਿਸ਼ਾ ਸੰਵੇਦਨਸ਼ੀਲ ਹੈ, ਇਸ ਲਈ MR readiness ਨੂੰ ਕੰਮ ਨਾਲ ਜੁੜੇ ਹਿੱਸੇ ਤੱਕ ਹੀ ਰੱਖੀਏ।",
    sample_romanization: "ih visha sanvedansheel hai, is lai MR readiness nu kamm naal jurre hisse takk hi rakhie.",
    sample_vi: "Chủ đề này nhạy cảm, vì vậy hãy giữ MR readiness chỉ trong phần liên quan công việc.",
    sample_en: "This topic is sensitive, so let's keep MR readiness only to the work-related part.",
    mr_readiness_evidence_phrases: [
      { gurmukhi: "ਵਿਸ਼ਾ ਸੰਵੇਦਨਸ਼ੀਲ ਹੈ", romanization: "visha sanvedansheel hai", vi: "Chủ đề nhạy cảm.", en: "The topic is sensitive." },
      { gurmukhi: "ਕੰਮ ਨਾਲ ਜੁੜੇ ਹਿੱਸੇ ਤੱਕ", romanization: "kamm naal jurre hisse takk", vi: "Trong phần liên quan công việc.", en: "To the work-related part." },
    ],
    checks: [
      { check_vi: "Có tránh tranh luận lập trường không?", check_en: "Does it avoid debating positions?", signal_vi: "Có ਸੰਵੇਦਨਸ਼ੀਲ and ਕੰਮ ਨਾਲ ਜੁੜੇ.", signal_en: "Uses sensitive and work-related." },
    ],
    learner_trap: {
      trap_vi: "Thêm lập trường cá nhân làm mất an toàn register.",
      trap_en: "Adding a personal position weakens register safety.",
      repair_vi: "Đặt ranh giới và trở lại phạm vi công việc.",
      repair_en: "Set the boundary and return to work scope.",
    },
  },
  {
    id: "pa_c2_mr_readiness_public_calibration_professional",
    focus: "public_communication_calibration",
    context: "professional",
    style: "final_freeze",
    title_vi: "MR readiness: cân chỉnh thông báo",
    title_en: "MR readiness: calibrated announcement",
    scenario_vi: "Bạn công bố rằng nội dung đã ổn định nhưng vẫn cần theo dõi phản hồi.",
    scenario_en: "You announce that content is stable while still monitoring feedback.",
    evidence_goal_vi: "Nêu trạng thái ổn định, phạm vi, và điểm còn theo dõi.",
    evidence_goal_en: "State stable status, scope, and what remains under monitoring.",
    sample_gurmukhi: "ਇਹ ਹਿੱਸਾ MR readiness ਵਿੱਚ ਹੈ; ਵਰਤੋਂ ਦੌਰਾਨ ਆਉਣ ਵਾਲੀ ਪ੍ਰਤੀਕਿਰਿਆ ਨੂੰ ਫਿਰ ਵੀ ਧਿਆਨ ਨਾਲ ਵੇਖਾਂਗੇ।",
    sample_romanization: "ih hissa MR readiness vich hai; varton dauran aun vali pratikiria nu phir vi dhian naal vekhange.",
    sample_vi: "Phần này đã ở MR readiness; tuy vậy trong quá trình sử dụng chúng tôi vẫn sẽ theo dõi phản hồi cẩn thận.",
    sample_en: "This part is in MR readiness; still, during use we will watch feedback carefully.",
    mr_readiness_evidence_phrases: [
      { gurmukhi: "MR readiness ਵਿੱਚ ਹੈ", romanization: "MR readiness vich hai", vi: "Đang ở MR readiness.", en: "Is in MR readiness." },
      { gurmukhi: "ਧਿਆਨ ਨਾਲ ਵੇਖਾਂਗੇ", romanization: "dhian naal vekhange", vi: "Sẽ theo dõi cẩn thận.", en: "Will watch carefully." },
    ],
    checks: [
      { check_vi: "Có tránh hứa tuyệt đối không?", check_en: "Does it avoid absolute promises?", signal_vi: "Có ਫਿਰ ਵੀ and ਪ੍ਰਤੀਕਿਰਿਆ.", signal_en: "Uses still and feedback." },
    ],
    learner_trap: {
      trap_vi: "Nói 'không còn gì cần xem' tạo cam kết quá mức.",
      trap_en: "Saying 'nothing remains to review' overcommits.",
      repair_vi: "Khóa phạm vi nhưng vẫn nhắc theo dõi phản hồi.",
      repair_en: "Freeze the scope while still noting feedback monitoring.",
    },
  },
  {
    id: "pa_c2_mr_readiness_register_safety_community",
    focus: "register_safety",
    context: "community",
    style: "pre_integration",
    title_vi: "MR readiness: an toàn register cộng đồng",
    title_en: "MR readiness: community register safety",
    scenario_vi: "Bạn cần chốt bản cuối cho nhóm cộng đồng mà không nghe như ra lệnh.",
    scenario_en: "You need to close the final version for a community group without sounding commanding.",
    evidence_goal_vi: "Dùng kính ngữ, chốt trạng thái, và mở lối góp ý lớn một cách nhẹ.",
    evidence_goal_en: "Use polite wording, close status, and leave a gentle path for major concerns.",
    sample_gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇਸ ਨੂੰ ਅੰਤਿਮ ਰੂਪ ਮੰਨੋ; ਜੇ ਕੋਈ ਵੱਡੀ ਚਿੰਤਾ ਹੋਵੇ ਤਾਂ ਨਰਮੀ ਨਾਲ ਦੱਸੋ।",
    sample_romanization: "kirpa karke is nu antim roop manno; je koi vaddi chinta hove tan narmi naal dasso.",
    sample_vi: "Xin hãy xem đây là bản cuối; nếu có mối quan ngại lớn, xin nói nhẹ nhàng.",
    sample_en: "Please consider this the final version; if there is a major concern, please say so gently.",
    mr_readiness_evidence_phrases: [
      { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ", romanization: "kirpa karke", vi: "Xin vui lòng.", en: "Please." },
      { gurmukhi: "ਨਰਮੀ ਨਾਲ ਦੱਸੋ", romanization: "narmi naal dasso", vi: "Xin nói nhẹ nhàng.", en: "Please say so gently." },
    ],
    checks: [
      { check_vi: "Có chốt mà vẫn lịch sự không?", check_en: "Does it close while staying polite?", signal_vi: "Có ਕਿਰਪਾ ਕਰਕੇ and ਨਰਮੀ ਨਾਲ.", signal_en: "Uses please and gently." },
    ],
    learner_trap: {
      trap_vi: "Dùng mệnh lệnh trần làm câu chốt nghe cứng.",
      trap_en: "Bare commands make the closing line sound stiff.",
      repair_vi: "Thêm kính ngữ và điều kiện cho quan ngại lớn.",
      repair_en: "Add politeness and a condition for major concerns.",
    },
  },
];

export const c2MrReadinessEvidenceByFocus = (focus: PunjabiC2MrReadinessFocus) =>
  c2MrReadinessEvidence.filter((sample) => sample.focus === focus);

export const c2MrReadinessEvidenceByContext = (context: PunjabiC2MrReadinessContext) =>
  c2MrReadinessEvidence.filter((sample) => sample.context === context);
