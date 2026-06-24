// Punjabi C2 final-validation set for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support final-validation samples only, not certification,
// official placement, legal/HR/medical/safety advice, or native-reviewed
// authority. Native review is deferred. Shahmukhi is mentioned only for script
// awareness, not as a full course.

export type PunjabiC2FinalValidationFocus =
  | "nuanced_disagreement"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "audience_adaptation"
  | "sensitive_topic_framing"
  | "public_communication_calibration"
  | "register_safety";

export type PunjabiC2FinalValidationContext = "public" | "professional" | "community";
export type PunjabiC2FinalValidationStyle = "final_validation" | "cross_check" | "pre_integration" | "readiness";

export type PunjabiC2FinalValidationPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2FinalValidationCheck = {
  check_vi: string;
  check_en: string;
  signal_vi: string;
  signal_en: string;
};

export type PunjabiC2FinalValidationTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2FinalValidationSample = {
  id: string;
  focus: PunjabiC2FinalValidationFocus;
  context: PunjabiC2FinalValidationContext;
  style: PunjabiC2FinalValidationStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  validation_goal_vi: string;
  validation_goal_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  validation_phrases: PunjabiC2FinalValidationPhrase[];
  checks: PunjabiC2FinalValidationCheck[];
  learner_trap?: PunjabiC2FinalValidationTrap;
  canada_practical?: boolean;
};

export const C2_FINAL_VALIDATION_SET_DISCLAIMER = {
  vi: "Bộ final-validation Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi final-validation set supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const c2FinalValidationSet: PunjabiC2FinalValidationSample[] = [
  {
    id: "pa_c2_validation_nuanced_disagreement_professional",
    focus: "nuanced_disagreement",
    context: "professional",
    style: "final_validation",
    title_vi: "Xác thực cuối: bất đồng tinh tế",
    title_en: "Final validation for nuanced disagreement",
    scenario_vi: "Bạn cần phản biện một kết luận trong bối cảnh chuyên nghiệp mà không làm mất hợp tác.",
    scenario_en: "You need to challenge a conclusion professionally without weakening cooperation.",
    validation_goal_vi: "Công nhận phần hợp lý, rồi yêu cầu kiểm tra cơ sở.",
    validation_goal_en: "Acknowledge the reasonable part, then request a check of the basis.",
    sample_gurmukhi:
      "ਇਹ ਦਲੀਲ ਸਮਝ ਆਉਂਦੀ ਹੈ, ਪਰ ਫੈਸਲੇ ਤੋਂ ਪਹਿਲਾਂ ਆਧਾਰ ਨੂੰ ਇੱਕ ਵਾਰੀ ਹੋਰ ਵੇਖਣਾ ਚਾਹੀਦਾ ਹੈ।",
    sample_romanization:
      "ih daleel samajh aundi hai, par faisle ton pehlaan aadhaar nu ikk vari hor vekhna chahida hai.",
    sample_vi:
      "Lập luận này có thể hiểu được, nhưng trước khi quyết định nên xem lại cơ sở thêm một lần nữa.",
    sample_en:
      "This argument is understandable, but before deciding, the basis should be reviewed once more.",
    validation_phrases: [
      {
        gurmukhi: "ਇਹ ਦਲੀਲ ਸਮਝ ਆਉਂਦੀ ਹੈ",
        romanization: "ih daleel samajh aundi hai",
        vi: "Lập luận này có thể hiểu được.",
        en: "This argument is understandable.",
      },
      {
        gurmukhi: "ਫੈਸਲੇ ਤੋਂ ਪਹਿਲਾਂ",
        romanization: "faisle ton pehlaan",
        vi: "Trước khi quyết định.",
        en: "Before deciding.",
      },
    ],
    checks: [
      {
        check_vi: "Có giữ công nhận trước khi đặt nghi vấn không?",
        check_en: "Does it keep validation before raising doubt?",
        signal_vi: "Có ਸਮਝ ਆਉਂਦੀ ਹੈ trước ਆਧਾਰ ਨੂੰ ਵੇਖਣਾ.",
        signal_en: "Uses understandable before reviewing the basis.",
      },
    ],
    learner_trap: {
      trap_vi: "Nói 'lập luận sai' làm mất sắc thái ngoại giao.",
      trap_en: "Saying 'the argument is wrong' loses diplomatic nuance.",
      repair_vi: "Công nhận phần có thể hiểu rồi kiểm tra cơ sở.",
      repair_en: "Acknowledge what is understandable, then check the basis.",
    },
  },
  {
    id: "pa_c2_validation_diplomacy_community_canada",
    focus: "diplomacy",
    context: "community",
    style: "cross_check",
    title_vi: "Xác thực từ chối lịch sự trong cộng đồng Canada",
    title_en: "Validate a diplomatic decline in a Canadian community context",
    scenario_vi: "Bạn cần từ chối tham gia một hoạt động cộng đồng ở Canada nhưng vẫn giữ quan hệ.",
    scenario_en: "You need to decline a Canadian community activity while preserving the relationship.",
    validation_goal_vi: "Cảm ơn, nêu giới hạn, và mở cơ hội sau.",
    validation_goal_en: "Thank them, state the limit, and keep a future opening.",
    sample_gurmukhi:
      "ਤੁਹਾਡੇ ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ। ਇਸ ਵਾਰ ਸ਼ਾਮਲ ਹੋਣਾ ਮੇਰੇ ਲਈ ਸੰਭਵ ਨਹੀਂ, ਪਰ ਅਗਲੇ ਮੌਕੇ ਲਈ ਮੈਨੂੰ ਯਾਦ ਰੱਖੋ।",
    sample_romanization:
      "tuhade sadde lai dhanvaad. is vaar shamil hona mere lai sambhav nahin, par agle mauke lai mainu yaad rakho.",
    sample_vi:
      "Cảm ơn lời mời của anh/chị. Lần này tôi không thể tham gia, nhưng xin hãy nhớ đến tôi cho dịp sau.",
    sample_en:
      "Thank you for the invitation. I cannot join this time, but please keep me in mind for the next opportunity.",
    validation_phrases: [
      {
        gurmukhi: "ਤੁਹਾਡੇ ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ",
        romanization: "tuhade sadde lai dhanvaad",
        vi: "Cảm ơn lời mời của anh/chị.",
        en: "Thank you for the invitation.",
      },
      {
        gurmukhi: "ਅਗਲੇ ਮੌਕੇ ਲਈ",
        romanization: "agle mauke lai",
        vi: "Cho dịp sau.",
        en: "For the next opportunity.",
      },
    ],
    checks: [
      {
        check_vi: "Có từ chối mà vẫn giữ thiện chí không?",
        check_en: "Does it decline while preserving goodwill?",
        signal_vi: "Có ਧੰਨਵਾਦ and ਅਗਲੇ ਮੌਕੇ.",
        signal_en: "Includes thanks and next opportunity.",
      },
    ],
    learner_trap: {
      trap_vi: "Từ chối ngắn quá nghe như cắt liên hệ.",
      trap_en: "A too-short refusal can sound like cutting off the relationship.",
      repair_vi: "Thêm cảm ơn và lời mở cho dịp sau.",
      repair_en: "Add thanks and an opening for a later opportunity.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_validation_mediation_public",
    focus: "mediation",
    context: "public",
    style: "final_validation",
    title_vi: "Xác thực trung gian công khai",
    title_en: "Final validation for public mediation",
    scenario_vi: "Hai nhóm có ưu tiên khác nhau và bạn cần tóm tắt mà không chọn phe.",
    scenario_en: "Two groups have different priorities and you need to summarize without taking sides.",
    validation_goal_vi: "Giữ hai phía song song và quay về tiêu chí chung.",
    validation_goal_en: "Keep both sides parallel and return to shared criteria.",
    sample_gurmukhi:
      "ਇੱਕ ਪਾਸੇ ਪਹੁੰਚ ਦੀ ਚਿੰਤਾ ਹੈ, ਦੂਜੇ ਪਾਸੇ ਗੁਣਵੱਤਾ ਦੀ। ਸਾਂਝਾ ਫੈਸਲਾ ਦੋਵੇਂ ਮਾਪਦੰਡਾਂ ਨੂੰ ਵੇਖ ਕੇ ਕਰੀਏ।",
    sample_romanization:
      "ikk pase pahunch di chinta hai, duje pase gunvatta di. sanjha faisla dovein mapdandan nu vekh ke karie.",
    sample_vi:
      "Một phía lo về khả năng tiếp cận, phía kia lo về chất lượng. Hãy quyết định chung sau khi xem cả hai tiêu chí.",
    sample_en:
      "One side is concerned about access, the other about quality. Let's make a shared decision after looking at both criteria.",
    validation_phrases: [
      {
        gurmukhi: "ਇੱਕ ਪਾਸੇ",
        romanization: "ikk pase",
        vi: "Một phía.",
        en: "On one side.",
      },
      {
        gurmukhi: "ਸਾਂਝਾ ਫੈਸਲਾ",
        romanization: "sanjha faisla",
        vi: "Quyết định chung.",
        en: "Shared decision.",
      },
    ],
    checks: [
      {
        check_vi: "Có giữ trung lập và có tiêu chí chung không?",
        check_en: "Does it stay neutral and use shared criteria?",
        signal_vi: "Có ਇੱਕ ਪਾਸੇ, ਦੂਜੇ ਪਾਸੇ, và ਸਾਂਝਾ ਫੈਸਲਾ.",
        signal_en: "Uses one side, the other side, and shared decision.",
      },
    ],
    learner_trap: {
      trap_vi: "Tóm tắt như thể một bên đúng hơn bên kia.",
      trap_en: "Summarizing as if one side is more correct than the other.",
      repair_vi: "Đặt hai phía song song và chốt bằng tiêu chí chung.",
      repair_en: "Place both sides in parallel and close with shared criteria.",
    },
  },
  {
    id: "pa_c2_validation_deescalation_professional",
    focus: "deescalation",
    context: "professional",
    style: "readiness",
    title_vi: "Xác thực hạ nhiệt cuộc họp",
    title_en: "Validate meeting de-escalation",
    scenario_vi: "Cuộc họp chuyên nghiệp đang căng và mọi người nói chồng lên nhau.",
    scenario_en: "A professional meeting is tense and people are speaking over each other.",
    validation_goal_vi: "Đưa cuộc họp về quy trình nghe lần lượt và ghi quyết định.",
    validation_goal_en: "Return the meeting to turn-taking and recorded decisions.",
    sample_gurmukhi:
      "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ, ਫਿਰ ਜੋ ਫੈਸਲਾ ਬਣੇ ਉਸ ਨੂੰ ਸਾਫ਼ ਲਿਖ ਲਈਏ।",
    sample_romanization:
      "aao ikk-ikk gall sunie, fir jo faisla bane us nu saaf likh laie.",
    sample_vi:
      "Ta hãy nghe từng ý một, rồi viết rõ quyết định được thống nhất.",
    sample_en:
      "Let's hear one point at a time, then clearly write down the decision that emerges.",
    validation_phrases: [
      {
        gurmukhi: "ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ",
        romanization: "ikk-ikk gall sunie",
        vi: "Hãy nghe từng ý một.",
        en: "Let's hear one point at a time.",
      },
      {
        gurmukhi: "ਸਾਫ਼ ਲਿਖ ਲਈਏ",
        romanization: "saaf likh laie",
        vi: "Hãy viết rõ.",
        en: "Let's write it clearly.",
      },
    ],
    checks: [
      {
        check_vi: "Có hạ nhiệt bằng quy trình thay vì mệnh lệnh không?",
        check_en: "Does it de-escalate through process rather than command?",
        signal_vi: "Có ਸੁਣੀਏ and ਫਿਰ.",
        signal_en: "Uses listen and then.",
      },
    ],
    learner_trap: {
      trap_vi: "Ra lệnh trực tiếp có thể làm giọng căng hơn.",
      trap_en: "Direct commands can make the tone tenser.",
      repair_vi: "Mời nghe lần lượt rồi ghi quyết định rõ.",
      repair_en: "Invite turn-taking, then record the decision clearly.",
    },
  },
  {
    id: "pa_c2_validation_audience_adaptation_community_canada",
    focus: "audience_adaptation",
    context: "community",
    style: "pre_integration",
    title_vi: "Xác thực điều chỉnh cho nhóm đa thế hệ",
    title_en: "Validate adaptation for a multi-generational group",
    scenario_vi: "Bạn nói với phụ huynh, tình nguyện viên, và người học trẻ trong cộng đồng Canada.",
    scenario_en: "You are speaking to parents, volunteers, and younger learners in a Canadian community.",
    validation_goal_vi: "Giữ ý chính, giảm thuật ngữ, và không hạ thấp người nghe.",
    validation_goal_en: "Keep the point, reduce jargon, and avoid talking down to the audience.",
    sample_gurmukhi:
      "ਜੇ ਮੈਂ ਸਧਾਰਨ ਤਰੀਕੇ ਨਾਲ ਕਹਾਂ, ਮੁੱਖ ਗੱਲ ਇਹ ਹੈ ਕਿ ਸੂਚਨਾ ਪਹਿਲਾਂ ਮਿਲੇ ਤਾਂ ਸਭ ਤਿਆਰੀ ਕਰ ਸਕਦੇ ਹਨ।",
    sample_romanization:
      "je main sadharan tarike naal kahan, mukh gall ih hai ki soochna pehlaan mile tan sabh tiari kar sakde han.",
    sample_vi:
      "Nếu nói đơn giản hơn, ý chính là nếu nhận thông báo trước thì mọi người có thể chuẩn bị.",
    sample_en:
      "Put simply, the main point is that if notice comes in advance, everyone can prepare.",
    validation_phrases: [
      {
        gurmukhi: "ਸਧਾਰਨ ਤਰੀਕੇ ਨਾਲ",
        romanization: "sadharan tarike naal",
        vi: "Theo cách đơn giản hơn.",
        en: "In a simpler way.",
      },
      {
        gurmukhi: "ਸਭ ਤਿਆਰੀ ਕਰ ਸਕਦੇ ਹਨ",
        romanization: "sabh tiari kar sakde han",
        vi: "Mọi người có thể chuẩn bị.",
        en: "Everyone can prepare.",
      },
    ],
    checks: [
      {
        check_vi: "Có đơn giản hóa mà không mất ý không?",
        check_en: "Does it simplify without losing the point?",
        signal_vi: "Có ਮੁੱਖ ਗੱਲ and ਸਧਾਰਨ ਤਰੀਕੇ ਨਾਲ.",
        signal_en: "Uses main point and simpler way.",
      },
    ],
    learner_trap: {
      trap_vi: "Giải thích quá mức làm câu nghe dạy đời.",
      trap_en: "Over-explaining can sound patronizing.",
      repair_vi: "Nói ý chính ngắn và tôn trọng người nghe.",
      repair_en: "State the main point briefly and respect the audience.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_validation_sensitive_topic_public",
    focus: "sensitive_topic_framing",
    context: "public",
    style: "cross_check",
    title_vi: "Xác thực đóng khung chủ đề nhạy cảm",
    title_en: "Validate sensitive-topic framing",
    scenario_vi: "Cuộc trao đổi công khai chạm vào chính trị, tôn giáo, tiền bạc, hoặc danh tính cá nhân.",
    scenario_en: "A public exchange touches politics, religion, money, or personal identity.",
    validation_goal_vi: "Nhận diện độ nhạy cảm và quay về phần liên quan nhiệm vụ.",
    validation_goal_en: "Recognize the sensitivity and return to the task-relevant part.",
    sample_gurmukhi:
      "ਇਹ ਗੱਲ ਸੰਵੇਦਨਸ਼ੀਲ ਹੋ ਸਕਦੀ ਹੈ, ਇਸ ਲਈ ਆਓ ਇਸ ਨੂੰ ਕੰਮ ਨਾਲ ਜੁੜੇ ਹਿੱਸੇ ਤੱਕ ਰੱਖੀਏ।",
    sample_romanization:
      "ih gall sanvedansheel ho sakdi hai, is lai aao is nu kamm naal jurre hisse takk rakhie.",
    sample_vi:
      "Điều này có thể nhạy cảm, vì vậy ta hãy giữ nó trong phần liên quan đến công việc.",
    sample_en:
      "This may be sensitive, so let's keep it to the work-related part.",
    validation_phrases: [
      {
        gurmukhi: "ਸੰਵੇਦਨਸ਼ੀਲ ਹੋ ਸਕਦੀ ਹੈ",
        romanization: "sanvedansheel ho sakdi hai",
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
    checks: [
      {
        check_vi: "Có tránh tranh luận lập trường không?",
        check_en: "Does it avoid debating positions?",
        signal_vi: "Có ਹੋ ਸਕਦੀ ਹੈ and ਕੰਮ ਨਾਲ ਜੁੜੇ.",
        signal_en: "Uses may be and work-related.",
      },
    ],
    learner_trap: {
      trap_vi: "Đi sâu vào quan điểm cá nhân làm mất an toàn register.",
      trap_en: "Going into personal views weakens register safety.",
      repair_vi: "Đặt ranh giới ngắn và quay lại nhiệm vụ.",
      repair_en: "Set a short boundary and return to the task.",
    },
  },
  {
    id: "pa_c2_validation_public_communication",
    focus: "public_communication_calibration",
    context: "public",
    style: "final_validation",
    title_vi: "Xác thực thông báo công khai",
    title_en: "Final validation for public communication",
    scenario_vi: "Thông báo cần rõ ràng nhưng thông tin cuối cùng chưa được xác nhận.",
    scenario_en: "A notice must be clear, but final information has not been confirmed.",
    validation_goal_vi: "Nêu trạng thái hiện tại, điều kiện xác nhận, và bước tiếp theo.",
    validation_goal_en: "State current status, confirmation condition, and next step.",
    sample_gurmukhi:
      "ਇਸ ਵੇਲੇ ਸਮੀਖਿਆ ਜਾਰੀ ਹੈ। ਪੁਸ਼ਟੀ ਹੋਣ ਤੇ ਅਗਲਾ ਕਦਮ ਸਾਂਝਾ ਕੀਤਾ ਜਾਵੇਗਾ।",
    sample_romanization:
      "is vele samikhia jaari hai. pushti hon te agla kadam sanjha kita jaavega.",
    sample_vi:
      "Hiện tại việc rà soát đang tiếp tục. Khi được xác nhận, bước tiếp theo sẽ được chia sẻ.",
    sample_en:
      "The review is currently ongoing. Once confirmed, the next step will be shared.",
    validation_phrases: [
      {
        gurmukhi: "ਸਮੀਖਿਆ ਜਾਰੀ ਹੈ",
        romanization: "samikhia jaari hai",
        vi: "Việc rà soát đang tiếp tục.",
        en: "The review is ongoing.",
      },
      {
        gurmukhi: "ਅਗਲਾ ਕਦਮ",
        romanization: "agla kadam",
        vi: "Bước tiếp theo.",
        en: "Next step.",
      },
    ],
    checks: [
      {
        check_vi: "Có tránh hứa chắc trước khi xác nhận không?",
        check_en: "Does it avoid certainty before confirmation?",
        signal_vi: "Có ਜਾਰੀ ਹੈ and ਪੁਸ਼ਟੀ ਹੋਣ ਤੇ.",
        signal_en: "Uses ongoing and once confirmed.",
      },
    ],
    learner_trap: {
      trap_vi: "Hứa kết quả khi thông tin chưa chắc.",
      trap_en: "Promising an outcome before information is certain.",
      repair_vi: "Dùng trạng thái hiện tại và điều kiện xác nhận.",
      repair_en: "Use current status and a confirmation condition.",
    },
  },
  {
    id: "pa_c2_validation_register_safety_professional_canada",
    focus: "register_safety",
    context: "professional",
    style: "readiness",
    title_vi: "Xác thực an toàn register trong email",
    title_en: "Validate register safety in email",
    scenario_vi: "Bạn cần biến câu thân mật thành email chuyên nghiệp dùng được ở Canada.",
    scenario_en: "You need to turn a casual sentence into a professional email usable in Canada.",
    validation_goal_vi: "Giữ yêu cầu rõ, thêm lịch sự vừa đủ, và tránh quá trang trọng.",
    validation_goal_en: "Keep the request clear, add enough politeness, and avoid over-formality.",
    sample_gurmukhi:
      "ਕਿਰਪਾ ਕਰਕੇ ਜਦੋਂ ਸੁਵਿਧਾ ਹੋਵੇ, ਅਗਲਾ ਕਦਮ ਦੱਸ ਦਿਓ। ਤੁਹਾਡੇ ਸਮੇਂ ਲਈ ਧੰਨਵਾਦ।",
    sample_romanization:
      "kirpa karke jadon suvidha hove, agla kadam dass deo. tuhade same lai dhanvaad.",
    sample_vi:
      "Khi thuận tiện, xin vui lòng cho biết bước tiếp theo. Cảm ơn thời gian của anh/chị.",
    sample_en:
      "When convenient, please let me know the next step. Thank you for your time.",
    validation_phrases: [
      {
        gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ",
        romanization: "kirpa karke",
        vi: "Xin vui lòng.",
        en: "Please.",
      },
      {
        gurmukhi: "ਤੁਹਾਡੇ ਸਮੇਂ ਲਈ ਧੰਨਵਾਦ",
        romanization: "tuhade same lai dhanvaad",
        vi: "Cảm ơn thời gian của anh/chị.",
        en: "Thank you for your time.",
      },
    ],
    checks: [
      {
        check_vi: "Có lịch sự, rõ hành động, và không quá nặng không?",
        check_en: "Is it polite, action-clear, and not too heavy?",
        signal_vi: "Có ਕਿਰਪਾ ਕਰਕੇ, ਅਗਲਾ ਕਦਮ, and ਧੰਨਵਾਦ.",
        signal_en: "Includes please, next step, and thanks.",
      },
    ],
    learner_trap: {
      trap_vi: "Thêm quá nhiều công thức lịch sự làm yêu cầu bị mờ.",
      trap_en: "Adding too many polite formulas can blur the request.",
      repair_vi: "Dùng please, yêu cầu cụ thể, và cảm ơn ngắn.",
      repair_en: "Use please, a concrete request, and brief thanks.",
    },
    canada_practical: true,
  },
];

export const c2FinalValidationSetByFocus = (
  focus: PunjabiC2FinalValidationFocus,
): PunjabiC2FinalValidationSample[] => c2FinalValidationSet.filter((item) => item.focus === focus);

export const c2FinalValidationSetByContext = (
  context: PunjabiC2FinalValidationContext,
): PunjabiC2FinalValidationSample[] => c2FinalValidationSet.filter((item) => item.context === context);
