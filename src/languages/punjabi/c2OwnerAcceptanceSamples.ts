// Punjabi C2 owner-acceptance samples for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support owner-acceptance samples only, not certification,
// official placement, legal/HR/medical/safety advice, or native-reviewed
// authority. Native review is deferred. Shahmukhi is mentioned only for script
// awareness, not as a full course.

export type PunjabiC2OwnerAcceptanceFocus =
  | "nuanced_disagreement"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "audience_adaptation"
  | "sensitive_topic_framing"
  | "public_communication_calibration"
  | "register_safety";

export type PunjabiC2OwnerAcceptanceContext = "public" | "professional" | "community";
export type PunjabiC2OwnerAcceptanceStyle =
  | "owner_acceptance"
  | "final_acceptance"
  | "ship_candidate"
  | "pre_integration";

export type PunjabiC2OwnerAcceptancePhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2OwnerAcceptanceCheck = {
  check_vi: string;
  check_en: string;
  signal_vi: string;
  signal_en: string;
};

export type PunjabiC2OwnerAcceptanceTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2OwnerAcceptanceSample = {
  id: string;
  focus: PunjabiC2OwnerAcceptanceFocus;
  context: PunjabiC2OwnerAcceptanceContext;
  style: PunjabiC2OwnerAcceptanceStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  acceptance_goal_vi: string;
  acceptance_goal_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  owner_acceptance_phrases: PunjabiC2OwnerAcceptancePhrase[];
  checks: PunjabiC2OwnerAcceptanceCheck[];
  learner_trap?: PunjabiC2OwnerAcceptanceTrap;
  canada_practical?: boolean;
};

export const C2_OWNER_ACCEPTANCE_SAMPLES_DISCLAIMER = {
  vi: "Bộ owner-acceptance Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi owner-acceptance sample pack supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const c2OwnerAcceptanceSamples: PunjabiC2OwnerAcceptanceSample[] = [
  {
    id: "pa_c2_owner_acceptance_nuanced_disagreement_professional",
    focus: "nuanced_disagreement",
    context: "professional",
    style: "owner_acceptance",
    title_vi: "Owner acceptance: bất đồng tinh tế",
    title_en: "Owner acceptance: nuanced disagreement",
    scenario_vi: "Bạn cần phản biện một tiêu chí duyệt cuối mà vẫn giữ nhịp hợp tác.",
    scenario_en: "You need to challenge a final acceptance criterion while preserving collaboration.",
    acceptance_goal_vi: "Công nhận mục tiêu, nêu giới hạn bằng chứng, rồi đề xuất kiểm tra lại.",
    acceptance_goal_en: "Validate the aim, name the evidence limit, then propose a recheck.",
    sample_gurmukhi: "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ, ਪਰ ਮਾਲਕਾਨਾ ਸਵੀਕ੍ਰਿਤੀ ਤੋਂ ਪਹਿਲਾਂ ਸਬੂਤ ਨੂੰ ਇੱਕ ਵਾਰੀ ਹੋਰ ਮਿਲਾ ਲਈਏ।",
    sample_romanization: "maqsad naal main sahimat haan, par malkana savikriti ton pehlaan saboot nu ikk vari hor mila laie.",
    sample_vi: "Tôi đồng ý với mục tiêu, nhưng trước owner acceptance ta hãy đối chiếu bằng chứng thêm một lần.",
    sample_en: "I agree with the aim, but before owner acceptance let's cross-check the evidence once more.",
    owner_acceptance_phrases: [
      { gurmukhi: "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ", romanization: "maqsad naal main sahimat haan", vi: "Tôi đồng ý với mục tiêu.", en: "I agree with the aim." },
      { gurmukhi: "ਸਬੂਤ ਨੂੰ ਇੱਕ ਵਾਰੀ ਹੋਰ ਮਿਲਾ ਲਈਏ", romanization: "saboot nu ikk vari hor mila laie", vi: "Hãy đối chiếu bằng chứng thêm một lần.", en: "Let's cross-check the evidence once more." },
    ],
    checks: [
      { check_vi: "Có bất đồng sau khi công nhận mục tiêu không?", check_en: "Does it disagree after validating the aim?", signal_vi: "Có ਸਹਿਮਤ ਹਾਂ trước ਪਰ.", signal_en: "Uses I agree before but." },
    ],
    learner_trap: {
      trap_vi: "Nói thẳng 'sai rồi' làm mất giọng owner-acceptance.",
      trap_en: "Saying 'that is wrong' directly breaks owner-acceptance tone.",
      repair_vi: "Công nhận mục tiêu rồi yêu cầu đối chiếu bằng chứng.",
      repair_en: "Validate the aim, then request an evidence cross-check.",
    },
  },
  {
    id: "pa_c2_owner_acceptance_diplomacy_community_canada",
    focus: "diplomacy",
    context: "community",
    style: "final_acceptance",
    title_vi: "Owner acceptance: từ chối ngoại giao",
    title_en: "Owner acceptance: diplomatic decline",
    scenario_vi: "Một hội nhóm ở Canada đề nghị thêm nội dung ngoài phạm vi ngay trước hạn chốt.",
    scenario_en: "A Canadian community group asks for out-of-scope content just before final acceptance.",
    acceptance_goal_vi: "Cảm ơn, giữ quan hệ, và chuyển yêu cầu sang vòng sau.",
    acceptance_goal_en: "Thank them, preserve the relationship, and move the request to a later cycle.",
    sample_gurmukhi: "ਤੁਹਾਡੇ ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ। ਇਸ ਵਾਰ ਹੱਦ ਪੱਕੀ ਰਹੇਗੀ, ਪਰ ਅਗਲੇ ਚੱਕਰ ਵਿੱਚ ਇਸ ਨੂੰ ਜ਼ਰੂਰ ਵੇਖਾਂਗੇ।",
    sample_romanization: "tuhade sujhaa lai dhanvaad. is vaar hadd pakki rahegi, par agle chakkar vich is nu zaroor vekhange.",
    sample_vi: "Cảm ơn góp ý của bạn. Lần này phạm vi sẽ giữ nguyên, nhưng vòng sau chúng tôi chắc chắn sẽ xem xét.",
    sample_en: "Thank you for the suggestion. This time the scope will stay fixed, but we will definitely review it in the next cycle.",
    owner_acceptance_phrases: [
      { gurmukhi: "ਤੁਹਾਡੇ ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ", romanization: "tuhade sujhaa lai dhanvaad", vi: "Cảm ơn góp ý của bạn.", en: "Thank you for the suggestion." },
      { gurmukhi: "ਅਗਲੇ ਚੱਕਰ ਵਿੱਚ", romanization: "agle chakkar vich", vi: "Trong vòng sau.", en: "In the next cycle." },
    ],
    checks: [
      { check_vi: "Có từ chối mà vẫn giữ cửa sau không?", check_en: "Does it decline while leaving a later opening?", signal_vi: "Có ਧੰਨਵਾਦ and ਅਗਲੇ ਚੱਕਰ.", signal_en: "Includes thanks and next cycle." },
    ],
    learner_trap: {
      trap_vi: "Từ chối quá lạnh làm người nghe thấy bị gạt bỏ.",
      trap_en: "A cold refusal makes the listener feel dismissed.",
      repair_vi: "Cảm ơn cụ thể và chuyển sang vòng sau.",
      repair_en: "Thank specifically and move it to a later cycle.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_owner_acceptance_mediation_public",
    focus: "mediation",
    context: "public",
    style: "owner_acceptance",
    title_vi: "Owner acceptance: trung gian công khai",
    title_en: "Owner acceptance: public mediation",
    scenario_vi: "Hai bên tranh luận tiêu chí duyệt và cần một câu chốt không thiên vị.",
    scenario_en: "Two sides debate acceptance criteria and need a neutral closing line.",
    acceptance_goal_vi: "Cân bằng hai mối quan tâm và đưa quyết định về tiêu chí chung.",
    acceptance_goal_en: "Balance both concerns and return the decision to shared criteria.",
    sample_gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਚਿੰਤਾ ਸਮਝ ਆਉਂਦੀ ਹੈ; ਮਾਲਕਾਨਾ ਫੈਸਲਾ ਸਾਂਝੇ ਮਾਪਦੰਡ ਨਾਲ ਹੀ ਕਰੀਏ।",
    sample_romanization: "dovein pasian di chinta samajh aundi hai; malkana faisla sanjhe mapdand naal hi kariye.",
    sample_vi: "Tôi hiểu mối quan tâm của cả hai bên; quyết định owner acceptance nên dựa trên tiêu chí chung.",
    sample_en: "Both sides' concerns are understandable; the owner decision should be made by shared criteria.",
    owner_acceptance_phrases: [
      { gurmukhi: "ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਚਿੰਤਾ", romanization: "dovein pasian di chinta", vi: "Mối quan tâm của cả hai bên.", en: "Both sides' concerns." },
      { gurmukhi: "ਸਾਂਝੇ ਮਾਪਦੰਡ ਨਾਲ", romanization: "sanjhe mapdand naal", vi: "Theo tiêu chí chung.", en: "By shared criteria." },
    ],
    checks: [
      { check_vi: "Có tránh chọn phe không?", check_en: "Does it avoid taking sides?", signal_vi: "Có ਦੋਵੇਂ ਪਾਸਿਆਂ and ਸਾਂਝੇ ਮਾਪਦੰਡ.", signal_en: "Uses both sides and shared criteria." },
    ],
    learner_trap: {
      trap_vi: "Khen một bên nhiều hơn làm mất trung lập.",
      trap_en: "Praising one side more heavily weakens neutrality.",
      repair_vi: "Nêu hai bên rồi chuyển về tiêu chí chung.",
      repair_en: "Name both sides, then return to shared criteria.",
    },
  },
  {
    id: "pa_c2_owner_acceptance_deescalation_professional",
    focus: "deescalation",
    context: "professional",
    style: "ship_candidate",
    title_vi: "Owner acceptance: hạ nhiệt trước khi chốt",
    title_en: "Owner acceptance: de-escalating before signoff",
    scenario_vi: "Cuộc họp duyệt cuối căng lên vì trách nhiệm chưa rõ.",
    scenario_en: "A final review meeting becomes tense because ownership is unclear.",
    acceptance_goal_vi: "Ghi nhận đã nghe, tách người khỏi vấn đề, rồi chốt trách nhiệm.",
    acceptance_goal_en: "Acknowledge what was heard, separate people from the issue, then close ownership.",
    sample_gurmukhi: "ਸਭ ਦੀ ਗੱਲ ਸੁਣ ਲਈ ਹੈ; ਹੁਣ ਵਿਅਕਤੀ ਨਹੀਂ, ਕੰਮ ਦੀ ਜ਼ਿੰਮੇਵਾਰੀ ਸਾਫ਼ ਕਰੀਏ।",
    sample_romanization: "sabh di gall sun lai hai; hun vyakti nahin, kamm di zimmedari saaf kariye.",
    sample_vi: "Đã nghe ý kiến mọi người; bây giờ không nói về cá nhân, hãy làm rõ trách nhiệm công việc.",
    sample_en: "Everyone has been heard; now let's focus on the work responsibility, not the person.",
    owner_acceptance_phrases: [
      { gurmukhi: "ਸਭ ਦੀ ਗੱਲ ਸੁਣ ਲਈ ਹੈ", romanization: "sabh di gall sun lai hai", vi: "Đã nghe ý kiến mọi người.", en: "Everyone has been heard." },
      { gurmukhi: "ਕੰਮ ਦੀ ਜ਼ਿੰਮੇਵਾਰੀ ਸਾਫ਼ ਕਰੀਏ", romanization: "kamm di zimmedari saaf kariye", vi: "Hãy làm rõ trách nhiệm công việc.", en: "Let's clarify the work responsibility." },
    ],
    checks: [
      { check_vi: "Có hạ nhiệt bằng quy trình thay vì đổ lỗi không?", check_en: "Does it de-escalate through process rather than blame?", signal_vi: "Có ਵਿਅਕਤੀ ਨਹੀਂ and ਜ਼ਿੰਮੇਵਾਰੀ.", signal_en: "Uses not the person and responsibility." },
    ],
    learner_trap: {
      trap_vi: "Nêu tên người chịu lỗi ở câu chốt làm căng thêm.",
      trap_en: "Naming who is at fault in the closing line escalates tension.",
      repair_vi: "Tách cá nhân khỏi trách nhiệm công việc.",
      repair_en: "Separate the person from the work responsibility.",
    },
  },
  {
    id: "pa_c2_owner_acceptance_audience_adaptation_canada",
    focus: "audience_adaptation",
    context: "community",
    style: "pre_integration",
    title_vi: "Owner acceptance: điều chỉnh cho nhóm đa thế hệ",
    title_en: "Owner acceptance: adapting for a multi-generational group",
    scenario_vi: "Bạn thông báo kết quả duyệt cho phụ huynh, tình nguyện viên, và người học ở Canada.",
    scenario_en: "You announce acceptance results to parents, volunteers, and learners in Canada.",
    acceptance_goal_vi: "Giữ thông điệp ngắn, dễ theo, và có hành động tiếp theo rõ.",
    acceptance_goal_en: "Keep the message short, easy to follow, and tied to a clear next action.",
    sample_gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ, ਸਮੱਗਰੀ ਮਨਜ਼ੂਰ ਹੈ; ਅਗਲੇ ਹਫ਼ਤੇ ਤੋਂ ਇਸ ਨੂੰ ਕਲਾਸ ਵਿੱਚ ਵਰਤਿਆ ਜਾਵੇਗਾ।",
    sample_romanization: "sadharan shabdan vich, samagri manzoor hai; agle hafte ton is nu class vich vartia javega.",
    sample_vi: "Nói đơn giản, nội dung đã được duyệt; từ tuần sau sẽ dùng trong lớp.",
    sample_en: "In simple terms, the content is approved; from next week it will be used in class.",
    owner_acceptance_phrases: [
      { gurmukhi: "ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ", romanization: "sadharan shabdan vich", vi: "Nói bằng từ đơn giản.", en: "In simple terms." },
      { gurmukhi: "ਅਗਲੇ ਹਫ਼ਤੇ ਤੋਂ", romanization: "agle hafte ton", vi: "Từ tuần sau.", en: "From next week." },
    ],
    checks: [
      { check_vi: "Có phù hợp nhóm đa thế hệ không?", check_en: "Is it suitable for a multi-generational audience?", signal_vi: "Có ਸਧਾਰਨ ਸ਼ਬਦਾਂ and hành động thời gian rõ.", signal_en: "Uses simple terms and a clear time-bound action." },
    ],
    learner_trap: {
      trap_vi: "Dùng thuật ngữ kiểm thử nội bộ khiến người ngoài khó hiểu.",
      trap_en: "Internal test terminology makes the message hard for outsiders.",
      repair_vi: "Dùng câu ngắn và hành động theo thời gian.",
      repair_en: "Use short wording and a time-bound action.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_owner_acceptance_sensitive_topic_public",
    focus: "sensitive_topic_framing",
    context: "public",
    style: "final_acceptance",
    title_vi: "Owner acceptance: khung chủ đề nhạy cảm",
    title_en: "Owner acceptance: sensitive-topic framing",
    scenario_vi: "Phản hồi công khai chạm đến chính trị, tôn giáo, tiền bạc, hoặc danh tính cá nhân.",
    scenario_en: "Public feedback touches politics, religion, money, or personal identity.",
    acceptance_goal_vi: "Đặt ranh giới tôn trọng và quay về phần liên quan nhiệm vụ.",
    acceptance_goal_en: "Set a respectful boundary and return to the task-relevant part.",
    sample_gurmukhi: "ਇਹ ਗੱਲ ਸੰਵੇਦਨਸ਼ੀਲ ਹੋ ਸਕਦੀ ਹੈ, ਇਸ ਲਈ ਸਵੀਕ੍ਰਿਤੀ ਨੂੰ ਕੰਮ ਨਾਲ ਜੁੜੇ ਹਿੱਸੇ ਤੱਕ ਰੱਖੀਏ।",
    sample_romanization: "ih gall sanvedansheel ho sakdi hai, is lai savikriti nu kamm naal jurre hisse takk rakhie.",
    sample_vi: "Điều này có thể nhạy cảm, vì vậy hãy giữ phần duyệt trong phạm vi liên quan đến công việc.",
    sample_en: "This may be sensitive, so let's keep acceptance to the work-related part.",
    owner_acceptance_phrases: [
      { gurmukhi: "ਸੰਵੇਦਨਸ਼ੀਲ ਹੋ ਸਕਦੀ ਹੈ", romanization: "sanvedansheel ho sakdi hai", vi: "Có thể nhạy cảm.", en: "May be sensitive." },
      { gurmukhi: "ਕੰਮ ਨਾਲ ਜੁੜੇ ਹਿੱਸੇ ਤੱਕ", romanization: "kamm naal jurre hisse takk", vi: "Trong phần liên quan công việc.", en: "To the work-related part." },
    ],
    checks: [
      { check_vi: "Có tránh biến duyệt nội dung thành tranh luận lập trường không?", check_en: "Does it avoid turning acceptance into a position debate?", signal_vi: "Có ਸੰਵੇਦਨਸ਼ੀਲ and ਕੰਮ ਨਾਲ ਜੁੜੇ.", signal_en: "Uses sensitive and work-related." },
    ],
    learner_trap: {
      trap_vi: "Thêm ý kiến cá nhân ở cuối làm lệch register.",
      trap_en: "Adding a personal opinion at the end shifts the register.",
      repair_vi: "Giữ ranh giới và quay về phạm vi công việc.",
      repair_en: "Keep the boundary and return to work scope.",
    },
  },
  {
    id: "pa_c2_owner_acceptance_public_calibration_professional",
    focus: "public_communication_calibration",
    context: "professional",
    style: "ship_candidate",
    title_vi: "Owner acceptance: cân chỉnh thông báo công khai",
    title_en: "Owner acceptance: calibrating a public notice",
    scenario_vi: "Bạn cần công bố quyết định duyệt mà không hứa quá mức.",
    scenario_en: "You need to announce an acceptance decision without overpromising.",
    acceptance_goal_vi: "Nêu trạng thái, phạm vi, và điểm còn theo dõi.",
    acceptance_goal_en: "State the status, scope, and what remains under monitoring.",
    sample_gurmukhi: "ਇਹ ਹਿੱਸਾ ਸਵੀਕਾਰ ਹੈ; ਫਿਰ ਵੀ ਵਰਤੋਂ ਦੌਰਾਨ ਆਉਣ ਵਾਲੀ ਪ੍ਰਤੀਕਿਰਿਆ ਨੂੰ ਧਿਆਨ ਨਾਲ ਵੇਖਾਂਗੇ।",
    sample_romanization: "ih hissa savikar hai; phir vi varton dauran aun vali pratikiria nu dhian naal vekhange.",
    sample_vi: "Phần này được chấp nhận; tuy vậy trong khi sử dụng chúng tôi vẫn sẽ theo dõi phản hồi cẩn thận.",
    sample_en: "This part is accepted; still, during use we will watch feedback carefully.",
    owner_acceptance_phrases: [
      { gurmukhi: "ਇਹ ਹਿੱਸਾ ਸਵੀਕਾਰ ਹੈ", romanization: "ih hissa savikar hai", vi: "Phần này được chấp nhận.", en: "This part is accepted." },
      { gurmukhi: "ਪ੍ਰਤੀਕਿਰਿਆ ਨੂੰ ਧਿਆਨ ਨਾਲ ਵੇਖਾਂਗੇ", romanization: "pratikiria nu dhian naal vekhange", vi: "Sẽ theo dõi phản hồi cẩn thận.", en: "We will watch feedback carefully." },
    ],
    checks: [
      { check_vi: "Có tránh hứa tuyệt đối không?", check_en: "Does it avoid absolute promises?", signal_vi: "Có ਫਿਰ ਵੀ and ਧਿਆਨ ਨਾਲ ਵੇਖਾਂਗੇ.", signal_en: "Uses still and will watch carefully." },
    ],
    learner_trap: {
      trap_vi: "Nói 'hoàn hảo' hoặc 'không còn lỗi' tạo cam kết quá mức.",
      trap_en: "Saying 'perfect' or 'no remaining issues' overcommits.",
      repair_vi: "Nêu chấp nhận có phạm vi và theo dõi phản hồi.",
      repair_en: "State scoped acceptance and continued feedback monitoring.",
    },
  },
  {
    id: "pa_c2_owner_acceptance_register_safety_community",
    focus: "register_safety",
    context: "community",
    style: "pre_integration",
    title_vi: "Owner acceptance: an toàn register cộng đồng",
    title_en: "Owner acceptance: community register safety",
    scenario_vi: "Bạn cần chốt nội dung cho nhóm cộng đồng mà không nghe như ra lệnh.",
    scenario_en: "You need to finalize community content without sounding commanding.",
    acceptance_goal_vi: "Dùng giọng kính trọng, nêu lựa chọn, và tránh mệnh lệnh trần.",
    acceptance_goal_en: "Use respectful tone, name the choice, and avoid bare commands.",
    sample_gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇਸ ਰੂਪ ਨੂੰ ਅੰਤਿਮ ਮੰਨੋ; ਜੇ ਕੋਈ ਵੱਡੀ ਚਿੰਤਾ ਹੋਵੇ ਤਾਂ ਨਰਮੀ ਨਾਲ ਸਾਂਝੀ ਕਰੋ।",
    sample_romanization: "kirpa karke is roop nu antim manno; je koi vaddi chinta hove tan narmi naal sanjhi karo.",
    sample_vi: "Xin hãy xem bản này là bản cuối; nếu có mối quan ngại lớn, xin chia sẻ nhẹ nhàng.",
    sample_en: "Please consider this the final version; if there is a major concern, please share it gently.",
    owner_acceptance_phrases: [
      { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ", romanization: "kirpa karke", vi: "Xin vui lòng.", en: "Please." },
      { gurmukhi: "ਨਰਮੀ ਨਾਲ ਸਾਂਝੀ ਕਰੋ", romanization: "narmi naal sanjhi karo", vi: "Chia sẻ nhẹ nhàng.", en: "Share gently." },
    ],
    checks: [
      { check_vi: "Có giữ register lịch sự khi chốt không?", check_en: "Does it keep polite register while closing?", signal_vi: "Có ਕਿਰਪਾ ਕਰਕੇ and ਨਰਮੀ ਨਾਲ.", signal_en: "Uses please and gently." },
    ],
    learner_trap: {
      trap_vi: "Mệnh lệnh trần nghe cứng trong bối cảnh cộng đồng.",
      trap_en: "Bare commands sound stiff in community contexts.",
      repair_vi: "Thêm kính ngữ và điều kiện chia sẻ quan ngại.",
      repair_en: "Add politeness and a condition for sharing concerns.",
    },
  },
];

export const c2OwnerAcceptanceSamplesByFocus = (focus: PunjabiC2OwnerAcceptanceFocus) =>
  c2OwnerAcceptanceSamples.filter((sample) => sample.focus === focus);

export const c2OwnerAcceptanceSamplesByContext = (context: PunjabiC2OwnerAcceptanceContext) =>
  c2OwnerAcceptanceSamples.filter((sample) => sample.context === context);
