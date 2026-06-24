// Punjabi C2 cross-check samples for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support cross-check samples only, not certification,
// official placement, legal/HR/medical/safety advice, or native-reviewed
// authority. Native review is deferred. Shahmukhi is mentioned only for script
// awareness, not as a full course.

export type PunjabiC2CrossCheckFocus =
  | "nuanced_disagreement"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "audience_adaptation"
  | "sensitive_topic_framing"
  | "public_communication_calibration"
  | "register_safety";

export type PunjabiC2CrossCheckContext = "public" | "professional" | "community";
export type PunjabiC2CrossCheckStyle = "cross_check" | "verification" | "pre_integration" | "readiness";

export type PunjabiC2CrossCheckPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2CrossCheckGuard = {
  check_vi: string;
  check_en: string;
  safe_signal_vi: string;
  safe_signal_en: string;
};

export type PunjabiC2CrossCheckTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2CrossCheckSample = {
  id: string;
  focus: PunjabiC2CrossCheckFocus;
  context: PunjabiC2CrossCheckContext;
  style: PunjabiC2CrossCheckStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  cross_check_goal_vi: string;
  cross_check_goal_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  cross_check_phrases: PunjabiC2CrossCheckPhrase[];
  guards: PunjabiC2CrossCheckGuard[];
  learner_trap?: PunjabiC2CrossCheckTrap;
  canada_practical?: boolean;
};

export const C2_CROSS_CHECK_SAMPLES_DISCLAIMER = {
  vi: "Bộ mẫu cross-check Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi cross-check sample pack supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const c2CrossCheckSamples: PunjabiC2CrossCheckSample[] = [
  {
    id: "pa_c2_cross_nuanced_disagreement_professional",
    focus: "nuanced_disagreement",
    context: "professional",
    style: "cross_check",
    title_vi: "Kiểm tra bất đồng trong email chuyên nghiệp",
    title_en: "Cross-check disagreement in a professional email",
    scenario_vi: "Bạn cần phản biện một kết luận nhưng vẫn giữ giọng hợp tác.",
    scenario_en: "You need to challenge a conclusion while keeping a collaborative tone.",
    cross_check_goal_vi: "Giữ công nhận trước, rồi yêu cầu xem lại cơ sở.",
    cross_check_goal_en: "Keep validation first, then ask to review the basis.",
    sample_gurmukhi: "ਨਤੀਜਾ ਸਮਝ ਆਉਂਦਾ ਹੈ, ਪਰ ਆਧਾਰ ਨੂੰ ਇੱਕ ਵਾਰੀ ਹੋਰ ਵੇਖਣਾ ਲਾਭਦਾਇਕ ਰਹੇਗਾ।",
    sample_romanization: "natija samajh aunda hai, par aadhaar nu ikk vari hor vekhna labhdaik rahega.",
    sample_vi: "Tôi hiểu kết luận, nhưng xem lại cơ sở thêm một lần nữa sẽ hữu ích.",
    sample_en: "I understand the conclusion, but reviewing the basis once more would be useful.",
    cross_check_phrases: [
      {
        gurmukhi: "ਨਤੀਜਾ ਸਮਝ ਆਉਂਦਾ ਹੈ",
        romanization: "natija samajh aunda hai",
        vi: "Tôi hiểu kết luận.",
        en: "I understand the conclusion.",
      },
      {
        gurmukhi: "ਆਧਾਰ ਨੂੰ ਇੱਕ ਵਾਰੀ ਹੋਰ ਵੇਖਣਾ",
        romanization: "aadhaar nu ikk vari hor vekhna",
        vi: "Xem lại cơ sở thêm một lần nữa.",
        en: "Reviewing the basis once more.",
      },
    ],
    guards: [
      {
        check_vi: "Có phản biện mà không phủ định trực diện không?",
        check_en: "Does it challenge without blunt negation?",
        safe_signal_vi: "Có ਸਮਝ ਆਉਂਦਾ ਹੈ trước khi nói ਵੇਖਣਾ.",
        safe_signal_en: "Uses understand before review.",
      },
    ],
    learner_trap: {
      trap_vi: "Mở bằng 'không đúng' làm câu quá gắt.",
      trap_en: "Opening with 'not correct' makes the sentence too sharp.",
      repair_vi: "Công nhận kết luận rồi đề nghị xem lại cơ sở.",
      repair_en: "Acknowledge the conclusion, then suggest reviewing the basis.",
    },
  },
  {
    id: "pa_c2_cross_diplomacy_community_canada",
    focus: "diplomacy",
    context: "community",
    style: "verification",
    title_vi: "Kiểm tra từ chối lịch sự trong cộng đồng Canada",
    title_en: "Verify a polite decline in a Canadian community setting",
    scenario_vi: "Bạn không thể tham dự một buổi họp cộng đồng nhưng muốn giữ thiện chí.",
    scenario_en: "You cannot attend a community meeting but want to preserve goodwill.",
    cross_check_goal_vi: "Cảm ơn, giới hạn thời điểm, và mở khả năng sau.",
    cross_check_goal_en: "Thank them, limit the timing, and keep a future opening.",
    sample_gurmukhi:
      "ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ। ਇਸ ਵਾਰ ਆਉਣਾ ਸੰਭਵ ਨਹੀਂ, ਪਰ ਅਗਲੀ ਵਾਰੀ ਮੈਨੂੰ ਜ਼ਰੂਰ ਦੱਸੋ।",
    sample_romanization:
      "sadde lai dhanvaad. is vaar auna sambhav nahin, par agli vari mainu zaroor dasso.",
    sample_vi: "Cảm ơn lời mời. Lần này tôi không thể đến, nhưng lần sau xin hãy báo cho tôi.",
    sample_en: "Thank you for the invitation. I cannot come this time, but please let me know next time.",
    cross_check_phrases: [
      {
        gurmukhi: "ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ",
        romanization: "sadde lai dhanvaad",
        vi: "Cảm ơn lời mời.",
        en: "Thank you for the invitation.",
      },
      {
        gurmukhi: "ਅਗਲੀ ਵਾਰੀ",
        romanization: "agli vari",
        vi: "Lần sau.",
        en: "Next time.",
      },
    ],
    guards: [
      {
        check_vi: "Có giữ quan hệ sau khi từ chối không?",
        check_en: "Does it preserve the relationship after declining?",
        safe_signal_vi: "Có ਧੰਨਵਾਦ và ਅਗਲੀ ਵਾਰੀ.",
        safe_signal_en: "Includes thanks and next time.",
      },
    ],
    learner_trap: {
      trap_vi: "Từ chối không cảm ơn nghe lạnh trong bối cảnh cộng đồng.",
      trap_en: "Declining without thanks sounds cold in a community setting.",
      repair_vi: "Thêm cảm ơn và lời mở cho lần sau.",
      repair_en: "Add thanks and an opening for next time.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_cross_mediation_public",
    focus: "mediation",
    context: "public",
    style: "cross_check",
    title_vi: "Kiểm tra trung gian trong phát biểu công khai",
    title_en: "Cross-check mediation in a public statement",
    scenario_vi: "Hai nhóm có ưu tiên khác nhau và bạn cần tóm tắt không thiên vị.",
    scenario_en: "Two groups have different priorities and you need a neutral summary.",
    cross_check_goal_vi: "Đặt hai phía song song và quay về tiêu chí chung.",
    cross_check_goal_en: "Place both sides in parallel and return to shared criteria.",
    sample_gurmukhi:
      "ਇੱਕ ਪਾਸੇ ਪਹੁੰਚ ਦੀ ਚਿੰਤਾ ਹੈ, ਦੂਜੇ ਪਾਸੇ ਗੁਣਵੱਤਾ ਦੀ। ਆਓ ਦੋਵੇਂ ਗੱਲਾਂ ਨੂੰ ਸਾਂਝੇ ਮਾਪਦੰਡ ਨਾਲ ਵੇਖੀਏ।",
    sample_romanization:
      "ikk pase pahunch di chinta hai, duje pase gunvatta di. aao dovein gallan nu sanjhe mapdand naal vekhie.",
    sample_vi:
      "Một phía lo về khả năng tiếp cận, phía kia lo về chất lượng. Hãy xem cả hai theo tiêu chí chung.",
    sample_en:
      "One side is concerned about access, the other about quality. Let's view both through shared criteria.",
    cross_check_phrases: [
      {
        gurmukhi: "ਇੱਕ ਪਾਸੇ",
        romanization: "ikk pase",
        vi: "Một phía.",
        en: "On one side.",
      },
      {
        gurmukhi: "ਸਾਂਝੇ ਮਾਪਦੰਡ ਨਾਲ",
        romanization: "sanjhe mapdand naal",
        vi: "Theo tiêu chí chung.",
        en: "Through shared criteria.",
      },
    ],
    guards: [
      {
        check_vi: "Có giữ hai phía cân bằng không?",
        check_en: "Does it keep both sides balanced?",
        safe_signal_vi: "Có ਇੱਕ ਪਾਸੇ và ਦੂਜੇ ਪਾਸੇ.",
        safe_signal_en: "Uses one side and the other side.",
      },
    ],
    learner_trap: {
      trap_vi: "Tóm tắt như thể một phía đang gây lỗi.",
      trap_en: "Summarizing as if one side is at fault.",
      repair_vi: "Dùng cấu trúc song song và tiêu chí chung.",
      repair_en: "Use parallel structure and shared criteria.",
    },
  },
  {
    id: "pa_c2_cross_deescalation_professional",
    focus: "deescalation",
    context: "professional",
    style: "readiness",
    title_vi: "Kiểm tra hạ nhiệt trong cuộc họp",
    title_en: "Check de-escalation in a meeting",
    scenario_vi: "Cuộc họp căng và nhiều người nói chồng lên nhau.",
    scenario_en: "A meeting is tense and several people are speaking over each other.",
    cross_check_goal_vi: "Đưa trao đổi về quy trình lần lượt.",
    cross_check_goal_en: "Return the exchange to a turn-taking process.",
    sample_gurmukhi: "ਆਓ ਪਹਿਲਾਂ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ, ਫਿਰ ਸਾਂਝਾ ਫੈਸਲਾ ਲਿਖੀਏ।",
    sample_romanization: "aao pehlaan ikk-ikk gall sunie, fir sanjha faisla likhie.",
    sample_vi: "Ta hãy nghe từng ý trước, rồi viết lại quyết định chung.",
    sample_en: "Let's hear one point at a time first, then write the shared decision.",
    cross_check_phrases: [
      {
        gurmukhi: "ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ",
        romanization: "ikk-ikk gall sunie",
        vi: "Hãy nghe từng ý một.",
        en: "Let's hear one point at a time.",
      },
      {
        gurmukhi: "ਸਾਂਝਾ ਫੈਸਲਾ",
        romanization: "sanjha faisla",
        vi: "Quyết định chung.",
        en: "Shared decision.",
      },
    ],
    guards: [
      {
        check_vi: "Có hạ nhiệt bằng quy trình thay vì mệnh lệnh không?",
        check_en: "Does it de-escalate through process rather than command?",
        safe_signal_vi: "Có ਪਹਿਲਾਂ và ਫਿਰ.",
        safe_signal_en: "Uses first and then.",
      },
    ],
    learner_trap: {
      trap_vi: "Ra lệnh 'dừng lại' dễ làm giọng căng hơn.",
      trap_en: "Commanding people to stop can sharpen the tone.",
      repair_vi: "Mời nghe lần lượt và chốt quyết định chung.",
      repair_en: "Invite turn-taking and close with a shared decision.",
    },
  },
  {
    id: "pa_c2_cross_audience_adaptation_community_canada",
    focus: "audience_adaptation",
    context: "community",
    style: "pre_integration",
    title_vi: "Kiểm tra điều chỉnh cho nhóm đa thế hệ",
    title_en: "Check adaptation for a multi-generational group",
    scenario_vi: "Bạn cần nói cùng một ý cho phụ huynh, người trẻ, và tình nguyện viên ở Canada.",
    scenario_en: "You need to say the same point to parents, younger people, and volunteers in Canada.",
    cross_check_goal_vi: "Giữ ý chính, giảm thuật ngữ, và giữ lịch sự.",
    cross_check_goal_en: "Keep the core point, reduce jargon, and stay polite.",
    sample_gurmukhi:
      "ਜੇ ਮੈਂ ਸਧਾਰਨ ਤਰੀਕੇ ਨਾਲ ਕਹਾਂ, ਮੁੱਖ ਗੱਲ ਇਹ ਹੈ ਕਿ ਸਾਰਿਆਂ ਨੂੰ ਪਹਿਲਾਂ ਸੂਚਨਾ ਮਿਲਣੀ ਚਾਹੀਦੀ ਹੈ।",
    sample_romanization:
      "je main sadharan tarike naal kahan, mukh gall ih hai ki sarian nu pehlaan soochna milni chahidi hai.",
    sample_vi:
      "Nếu nói đơn giản hơn, ý chính là mọi người nên nhận thông báo trước.",
    sample_en:
      "Put simply, the main point is that everyone should receive notice in advance.",
    cross_check_phrases: [
      {
        gurmukhi: "ਸਧਾਰਨ ਤਰੀਕੇ ਨਾਲ",
        romanization: "sadharan tarike naal",
        vi: "Theo cách đơn giản hơn.",
        en: "In a simpler way.",
      },
      {
        gurmukhi: "ਮੁੱਖ ਗੱਲ ਇਹ ਹੈ",
        romanization: "mukh gall ih hai",
        vi: "Ý chính là...",
        en: "The main point is...",
      },
    ],
    guards: [
      {
        check_vi: "Có giữ nội dung trong khi đổi register không?",
        check_en: "Does it preserve content while changing register?",
        safe_signal_vi: "Có ਸਧਾਰਨ ਤਰੀਕੇ ਨਾਲ và ਮੁੱਖ ਗੱਲ.",
        safe_signal_en: "Uses simpler way and main point.",
      },
    ],
    learner_trap: {
      trap_vi: "Đổi giọng quá nhiều làm mất yêu cầu chính.",
      trap_en: "Changing tone too much loses the main request.",
      repair_vi: "Giữ ý chính và chỉ đơn giản hóa cách nói.",
      repair_en: "Keep the core point and only simplify the wording.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_cross_sensitive_topic_public",
    focus: "sensitive_topic_framing",
    context: "public",
    style: "verification",
    title_vi: "Kiểm tra chủ đề nhạy cảm nơi công khai",
    title_en: "Verify sensitive-topic framing in public",
    scenario_vi: "Cuộc trao đổi chạm vào chính trị, tôn giáo, tiền bạc, hoặc danh tính cá nhân.",
    scenario_en: "The exchange touches politics, religion, money, or personal identity.",
    cross_check_goal_vi: "Đặt ranh giới ngắn và quay lại phần liên quan nhiệm vụ.",
    cross_check_goal_en: "Set a short boundary and return to the task-relevant part.",
    sample_gurmukhi:
      "ਇਹ ਵਿਸ਼ਾ ਸੰਵੇਦਨਸ਼ੀਲ ਹੋ ਸਕਦਾ ਹੈ, ਇਸ ਲਈ ਆਓ ਗੱਲ ਨੂੰ ਕੰਮ ਨਾਲ ਜੁੜੇ ਹਿੱਸੇ ਤੱਕ ਰੱਖੀਏ।",
    sample_romanization:
      "ih visha sanvedansheel ho sakda hai, is lai aao gall nu kamm naal jurre hisse takk rakhie.",
    sample_vi:
      "Chủ đề này có thể nhạy cảm, vì vậy ta hãy giữ cuộc trao đổi trong phần liên quan đến công việc.",
    sample_en:
      "This topic may be sensitive, so let's keep the exchange to the work-related part.",
    cross_check_phrases: [
      {
        gurmukhi: "ਸੰਵੇਦਨਸ਼ੀਲ ਹੋ ਸਕਦਾ ਹੈ",
        romanization: "sanvedansheel ho sakda hai",
        vi: "Có thể nhạy cảm.",
        en: "May be sensitive.",
      },
      {
        gurmukhi: "ਕੰਮ ਨਾਲ ਜੁੜੇ ਹਿੱਸੇ ਤੱਕ",
        romanization: "kamm naal jurre hisse takk",
        vi: "Trong phần liên quan đến công việc.",
        en: "To the work-related part.",
      },
    ],
    guards: [
      {
        check_vi: "Có tránh tranh luận lập trường không?",
        check_en: "Does it avoid debating positions?",
        safe_signal_vi: "Có ਹੋ ਸਕਦਾ ਹੈ và ਕੰਮ ਨਾਲ ਜੁੜੇ.",
        safe_signal_en: "Uses may be and work-related.",
      },
    ],
    learner_trap: {
      trap_vi: "Giải thích quan điểm cá nhân làm mất an toàn register.",
      trap_en: "Explaining a personal stance weakens register safety.",
      repair_vi: "Đặt ranh giới và chuyển về nhiệm vụ.",
      repair_en: "Set the boundary and return to the task.",
    },
  },
  {
    id: "pa_c2_cross_public_communication",
    focus: "public_communication_calibration",
    context: "public",
    style: "cross_check",
    title_vi: "Kiểm tra thông báo công khai không hứa quá mức",
    title_en: "Cross-check a public notice for overpromising",
    scenario_vi: "Thông báo cần rõ nhưng chưa có thông tin xác nhận cuối cùng.",
    scenario_en: "The notice needs to be clear, but final information is not confirmed.",
    cross_check_goal_vi: "Nêu trạng thái hiện tại và điều kiện xác nhận trước bước sau.",
    cross_check_goal_en: "State current status and confirmation condition before the next step.",
    sample_gurmukhi:
      "ਇਸ ਵੇਲੇ ਜਾਣਕਾਰੀ ਦੀ ਜਾਂਚ ਜਾਰੀ ਹੈ। ਪੁਸ਼ਟੀ ਹੋਣ ਤੇ ਅਗਲਾ ਕਦਮ ਸਾਂਝਾ ਕੀਤਾ ਜਾਵੇਗਾ।",
    sample_romanization:
      "is vele jaankari di jaanch jaari hai. pushti hon te agla kadam sanjha kita jaavega.",
    sample_vi:
      "Hiện tại thông tin vẫn đang được kiểm tra. Khi được xác nhận, bước tiếp theo sẽ được chia sẻ.",
    sample_en:
      "The information is currently still being checked. Once confirmed, the next step will be shared.",
    cross_check_phrases: [
      {
        gurmukhi: "ਜਾਂਚ ਜਾਰੀ ਹੈ",
        romanization: "jaanch jaari hai",
        vi: "Việc kiểm tra đang tiếp tục.",
        en: "The check is ongoing.",
      },
      {
        gurmukhi: "ਪੁਸ਼ਟੀ ਹੋਣ ਤੇ",
        romanization: "pushti hon te",
        vi: "Khi được xác nhận.",
        en: "Once confirmed.",
      },
    ],
    guards: [
      {
        check_vi: "Có tránh cam kết chắc khi chưa xác nhận không?",
        check_en: "Does it avoid certainty before confirmation?",
        safe_signal_vi: "Có ਜਾਂਚ ਜਾਰੀ ਹੈ và ਪੁਸ਼ਟੀ ਹੋਣ ਤੇ.",
        safe_signal_en: "Uses ongoing check and once confirmed.",
      },
    ],
    learner_trap: {
      trap_vi: "Hứa thời hạn hoặc kết quả khi chưa có dữ liệu.",
      trap_en: "Promising a timeline or outcome without confirmed data.",
      repair_vi: "Nêu trạng thái và điều kiện xác nhận.",
      repair_en: "State status and the confirmation condition.",
    },
  },
  {
    id: "pa_c2_cross_register_safety_professional",
    focus: "register_safety",
    context: "professional",
    style: "readiness",
    title_vi: "Kiểm tra register trong yêu cầu chuyên nghiệp",
    title_en: "Check register in a professional request",
    scenario_vi: "Một câu nhắn thân mật cần dùng được trong email công việc.",
    scenario_en: "A casual text needs to work in a professional email.",
    cross_check_goal_vi: "Giữ yêu cầu rõ, thêm lịch sự vừa đủ, không quá xa cách.",
    cross_check_goal_en: "Keep the request clear, add enough politeness, and avoid sounding distant.",
    sample_gurmukhi:
      "ਕਿਰਪਾ ਕਰਕੇ ਜਦੋਂ ਸੁਵਿਧਾ ਹੋਵੇ, ਅਗਲਾ ਕਦਮ ਦੱਸ ਦਿਓ। ਤੁਹਾਡੇ ਸਮੇਂ ਲਈ ਧੰਨਵਾਦ।",
    sample_romanization:
      "kirpa karke jadon suvidha hove, agla kadam dass deo. tuhade same lai dhanvaad.",
    sample_vi:
      "Khi thuận tiện, xin vui lòng cho biết bước tiếp theo. Cảm ơn thời gian của anh/chị.",
    sample_en:
      "When convenient, please let me know the next step. Thank you for your time.",
    cross_check_phrases: [
      {
        gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ",
        romanization: "kirpa karke",
        vi: "Xin vui lòng.",
        en: "Please.",
      },
      {
        gurmukhi: "ਅਗਲਾ ਕਦਮ",
        romanization: "agla kadam",
        vi: "Bước tiếp theo.",
        en: "Next step.",
      },
    ],
    guards: [
      {
        check_vi: "Có lịch sự mà vẫn rõ hành động cần làm không?",
        check_en: "Is it polite while keeping the needed action clear?",
        safe_signal_vi: "Có ਕਿਰਪਾ ਕਰਕੇ, ਅਗਲਾ ਕਦਮ, và ਧੰਨਵਾਦ.",
        safe_signal_en: "Includes please, next step, and thanks.",
      },
    ],
    learner_trap: {
      trap_vi: "Thêm kính ngữ dài khiến yêu cầu bị mờ.",
      trap_en: "Adding long honorific wording can blur the request.",
      repair_vi: "Dùng please, yêu cầu cụ thể, và cảm ơn ngắn.",
      repair_en: "Use please, a concrete request, and brief thanks.",
    },
    canada_practical: true,
  },
];

export const c2CrossCheckSamplesByFocus = (
  focus: PunjabiC2CrossCheckFocus,
): PunjabiC2CrossCheckSample[] => c2CrossCheckSamples.filter((item) => item.focus === focus);

export const c2CrossCheckSamplesByContext = (
  context: PunjabiC2CrossCheckContext,
): PunjabiC2CrossCheckSample[] => c2CrossCheckSamples.filter((item) => item.context === context);
