// Punjabi C2 merge-readiness samples for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support merge-readiness samples only, not certification,
// official placement, legal/HR/medical/safety advice, or native-reviewed
// authority. Native review is deferred. Shahmukhi is mentioned only for script
// awareness, not as a full course.

export type PunjabiC2MergeReadinessFocus =
  | "nuanced_disagreement"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "audience_adaptation"
  | "sensitive_topic_framing"
  | "public_communication_calibration"
  | "register_safety";

export type PunjabiC2MergeReadinessStyle = "merge_readiness" | "final_regression" | "pre_integration" | "readiness";

export type PunjabiC2MergeReadinessPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2MergeReadinessCheck = {
  check_vi: string;
  check_en: string;
  signal_vi: string;
  signal_en: string;
};

export type PunjabiC2MergeReadinessTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2MergeReadinessSample = {
  id: string;
  focus: PunjabiC2MergeReadinessFocus;
  style: PunjabiC2MergeReadinessStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  readiness_goal_vi: string;
  readiness_goal_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  readiness_phrases: PunjabiC2MergeReadinessPhrase[];
  checks: PunjabiC2MergeReadinessCheck[];
  learner_trap?: PunjabiC2MergeReadinessTrap;
  canada_practical?: boolean;
};

export const C2_MERGE_READINESS_SAMPLES_DISCLAIMER = {
  vi: "Bộ mẫu merge-readiness Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi merge-readiness sample pack supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const c2MergeReadinessSamples: PunjabiC2MergeReadinessSample[] = [
  {
    id: "pa_c2_merge_nuanced_disagreement",
    focus: "nuanced_disagreement",
    style: "merge_readiness",
    title_vi: "Sẵn sàng merge: bất đồng có công nhận",
    title_en: "Merge-ready disagreement with validation",
    scenario_vi: "Bạn cần phản biện một đề xuất trước khi nhập nội dung vào bộ học.",
    scenario_en: "You need to challenge a proposal before the content is merged into the course set.",
    readiness_goal_vi: "Công nhận mục tiêu, rồi yêu cầu kiểm tra lại bằng chứng.",
    readiness_goal_en: "Validate the goal, then ask for another evidence check.",
    sample_gurmukhi:
      "ਮਕਸਦ ਠੀਕ ਲੱਗਦਾ ਹੈ, ਪਰ ਸਬੂਤ ਨੂੰ ਇੱਕ ਵਾਰੀ ਹੋਰ ਮਿਲਾ ਕੇ ਵੇਖੀਏ।",
    sample_romanization:
      "maqsad theek lagda hai, par saboot nu ikk vari hor mila ke vekhie.",
    sample_vi:
      "Mục tiêu có vẻ đúng, nhưng ta hãy đối chiếu bằng chứng thêm một lần nữa.",
    sample_en:
      "The goal seems sound, but let's cross-check the evidence once more.",
    readiness_phrases: [
      {
        gurmukhi: "ਮਕਸਦ ਠੀਕ ਲੱਗਦਾ ਹੈ",
        romanization: "maqsad theek lagda hai",
        vi: "Mục tiêu có vẻ đúng.",
        en: "The goal seems sound.",
      },
      {
        gurmukhi: "ਸਬੂਤ ਨੂੰ ਇੱਕ ਵਾਰੀ ਹੋਰ ਮਿਲਾ ਕੇ ਵੇਖੀਏ",
        romanization: "saboot nu ikk vari hor mila ke vekhie",
        vi: "Hãy đối chiếu bằng chứng thêm một lần nữa.",
        en: "Let's cross-check the evidence once more.",
      },
    ],
    checks: [
      {
        check_vi: "Có công nhận trước khi phản biện không?",
        check_en: "Does it validate before disagreeing?",
        signal_vi: "Có ਮਕਸਦ ਠੀਕ trước khi yêu cầu ਮਿਲਾ ਕੇ ਵੇਖੀਏ.",
        signal_en: "Uses the goal seems sound before asking to cross-check.",
      },
    ],
    learner_trap: {
      trap_vi: "Nói thẳng 'sai rồi' làm mất sắc thái C2.",
      trap_en: "Saying 'that is wrong' directly loses C2-level nuance.",
      repair_vi: "Giữ công nhận, rồi chuyển sang tiêu chí kiểm tra.",
      repair_en: "Keep validation, then move to the review criterion.",
    },
  },
  {
    id: "pa_c2_merge_diplomacy_canada",
    focus: "diplomacy",
    style: "pre_integration",
    title_vi: "Từ chối ngoại giao trong bối cảnh Canada",
    title_en: "Diplomatic decline in a Canada-practical context",
    scenario_vi: "Bạn không thể tham gia một buổi họp cộng đồng ở Canada nhưng muốn giữ quan hệ.",
    scenario_en: "You cannot attend a community meeting in Canada but want to preserve goodwill.",
    readiness_goal_vi: "Cảm ơn, nêu giới hạn hiện tại, và mở đường cho lần sau.",
    readiness_goal_en: "Thank them, state the current limit, and keep a future opening.",
    sample_gurmukhi:
      "ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ। ਇਸ ਹਫ਼ਤੇ ਮੇਰੇ ਲਈ ਆਉਣਾ ਔਖਾ ਹੈ, ਪਰ ਅਗਲੀ ਮੀਟਿੰਗ ਲਈ ਮੈਨੂੰ ਸ਼ਾਮਲ ਕਰ ਲਵੋ।",
    sample_romanization:
      "sadde lai dhanvaad. is hafte mere lai auna aukha hai, par agli meeting lai mainu shamil kar lavo.",
    sample_vi:
      "Cảm ơn lời mời. Tuần này tôi khó tham gia, nhưng xin cho tôi tham gia buổi họp sau.",
    sample_en:
      "Thank you for the invitation. It is hard for me to attend this week, but please include me in the next meeting.",
    readiness_phrases: [
      {
        gurmukhi: "ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ",
        romanization: "sadde lai dhanvaad",
        vi: "Cảm ơn lời mời.",
        en: "Thank you for the invitation.",
      },
      {
        gurmukhi: "ਅਗਲੀ ਮੀਟਿੰਗ ਲਈ ਮੈਨੂੰ ਸ਼ਾਮਲ ਕਰ ਲਵੋ",
        romanization: "agli meeting lai mainu shamil kar lavo",
        vi: "Xin cho tôi tham gia buổi họp sau.",
        en: "Please include me in the next meeting.",
      },
    ],
    checks: [
      {
        check_vi: "Có giữ thiện chí sau khi từ chối không?",
        check_en: "Does it preserve goodwill after declining?",
        signal_vi: "Có ਧੰਨਵਾਦ và ਅਗਲੀ ਮੀਟਿੰਗ.",
        signal_en: "Includes thanks and a next-meeting opening.",
      },
    ],
    learner_trap: {
      trap_vi: "Từ chối không lý do nghe lạnh trong email cộng đồng.",
      trap_en: "Declining without context can sound cold in community email.",
      repair_vi: "Dùng giới hạn thời gian ngắn và lời mở cho lần sau.",
      repair_en: "Use a brief time limit and an opening for later.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_merge_mediation",
    focus: "mediation",
    style: "merge_readiness",
    title_vi: "Trung gian không chọn phe",
    title_en: "Neutral mediation without choosing sides",
    scenario_vi: "Hai người đánh giá khác nhau về tiến độ và chất lượng.",
    scenario_en: "Two people judge timeline and quality differently.",
    readiness_goal_vi: "Đặt hai mối quan tâm song song rồi quay về tiêu chí chung.",
    readiness_goal_en: "Place both concerns in parallel, then return to shared criteria.",
    sample_gurmukhi:
      "ਇੱਕ ਪਾਸੇ ਸਮੇਂ ਦੀ ਗੱਲ ਹੈ, ਦੂਜੇ ਪਾਸੇ ਗੁਣਵੱਤਾ ਦੀ। ਆਓ ਦੋਵੇਂ ਨੂੰ ਇੱਕੋ ਮਾਪਦੰਡ ਨਾਲ ਵੇਖੀਏ।",
    sample_romanization:
      "ikk pase same di gall hai, duje pase gunvatta di. aao dovein nu ikko mapdand naal vekhie.",
    sample_vi:
      "Một phía là vấn đề thời gian, phía kia là chất lượng. Hãy xem cả hai theo cùng một tiêu chí.",
    sample_en:
      "One side is about timing, the other about quality. Let's look at both through the same criteria.",
    readiness_phrases: [
      {
        gurmukhi: "ਇੱਕ ਪਾਸੇ",
        romanization: "ikk pase",
        vi: "Một phía.",
        en: "On one side.",
      },
      {
        gurmukhi: "ਇੱਕੋ ਮਾਪਦੰਡ ਨਾਲ",
        romanization: "ikko mapdand naal",
        vi: "Theo cùng một tiêu chí.",
        en: "Through the same criteria.",
      },
    ],
    checks: [
      {
        check_vi: "Có giữ hai phía cân bằng không?",
        check_en: "Does it keep both sides balanced?",
        signal_vi: "Có ਇੱਕ ਪਾਸੇ và ਦੂਜੇ ਪਾਸੇ.",
        signal_en: "Uses one side and the other side.",
      },
    ],
    learner_trap: {
      trap_vi: "Tóm tắt theo một phía khiến câu thành phán xét.",
      trap_en: "Summarizing through one side turns the sentence into a verdict.",
      repair_vi: "Dùng cấu trúc song song rồi nêu tiêu chí chung.",
      repair_en: "Use parallel structure and then name the shared criterion.",
    },
  },
  {
    id: "pa_c2_merge_deescalation",
    focus: "deescalation",
    style: "readiness",
    title_vi: "Hạ nhiệt trước khi merge",
    title_en: "De-escalation before merge",
    scenario_vi: "Cuộc thảo luận về nội dung trở nên căng và có người nói chồng lên nhau.",
    scenario_en: "A content discussion becomes tense and people start speaking over each other.",
    readiness_goal_vi: "Chuyển từ cảm xúc sang quy trình nghe lần lượt.",
    readiness_goal_en: "Move from emotion to a turn-taking process.",
    sample_gurmukhi:
      "ਆਓ ਪਹਿਲਾਂ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ, ਫਿਰ ਫੈਸਲਾ ਕਰੀਏ ਕਿ ਕੀ merge ਲਈ ਤਿਆਰ ਹੈ।",
    sample_romanization:
      "aao pehlaan ikk-ikk gall sunie, fir faisla karie ki ki merge lai tiar hai.",
    sample_vi:
      "Ta hãy nghe từng ý trước, rồi quyết định phần nào đã sẵn sàng để merge.",
    sample_en:
      "Let's hear one point at a time first, then decide what is ready to merge.",
    readiness_phrases: [
      {
        gurmukhi: "ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ",
        romanization: "ikk-ikk gall sunie",
        vi: "Hãy nghe từng ý một.",
        en: "Let's hear one point at a time.",
      },
      {
        gurmukhi: "merge ਲਈ ਤਿਆਰ",
        romanization: "merge lai tiar",
        vi: "Sẵn sàng để merge.",
        en: "Ready to merge.",
      },
    ],
    checks: [
      {
        check_vi: "Có đưa cuộc thảo luận về quy trình không?",
        check_en: "Does it return the discussion to process?",
        signal_vi: "Có ਪਹਿਲਾਂ và ਫਿਰ để tạo thứ tự.",
        signal_en: "Uses first and then to sequence the process.",
      },
    ],
    learner_trap: {
      trap_vi: "Ra lệnh im lặng làm tăng căng thẳng.",
      trap_en: "Ordering people to be quiet escalates tension.",
      repair_vi: "Mời nghe lần lượt và nối với quyết định cụ thể.",
      repair_en: "Invite turn-taking and connect it to a concrete decision.",
    },
  },
  {
    id: "pa_c2_merge_audience_adaptation_canada",
    focus: "audience_adaptation",
    style: "final_regression",
    title_vi: "Điều chỉnh cho phụ huynh, đồng nghiệp, và cộng đồng",
    title_en: "Adapt for parents, coworkers, and community audiences",
    scenario_vi: "Bạn cần nói cùng một điểm cho nhóm cộng đồng đa thế hệ ở Canada.",
    scenario_en: "You need to state the same point for a multi-generational community group in Canada.",
    readiness_goal_vi: "Giữ ý chính nhưng giảm thuật ngữ và tăng lịch sự.",
    readiness_goal_en: "Keep the core message while reducing jargon and increasing politeness.",
    sample_gurmukhi:
      "ਜੇ ਮੈਂ ਸਧਾਰਨ ਤਰੀਕੇ ਨਾਲ ਕਹਾਂ, ਤਾਂ ਮੁੱਖ ਗੱਲ ਇਹ ਹੈ ਕਿ ਸਾਰਿਆਂ ਨੂੰ ਪਹਿਲਾਂ ਸੂਚਨਾ ਮਿਲੇ।",
    sample_romanization:
      "je main sadharan tarike naal kahan, tan mukh gall ih hai ki sarian nu pehlaan soochna mile.",
    sample_vi:
      "Nếu nói đơn giản hơn, ý chính là mọi người cần nhận thông báo trước.",
    sample_en:
      "Put simply, the main point is that everyone should receive notice in advance.",
    readiness_phrases: [
      {
        gurmukhi: "ਸਧਾਰਨ ਤਰੀਕੇ ਨਾਲ",
        romanization: "sadharan tarike naal",
        vi: "Theo cách đơn giản hơn.",
        en: "In a simpler way.",
      },
      {
        gurmukhi: "ਸਾਰਿਆਂ ਨੂੰ ਪਹਿਲਾਂ ਸੂਚਨਾ ਮਿਲੇ",
        romanization: "sarian nu pehlaan soochna mile",
        vi: "Mọi người nhận thông báo trước.",
        en: "Everyone receives notice in advance.",
      },
    ],
    checks: [
      {
        check_vi: "Có đổi giọng mà vẫn giữ ý không?",
        check_en: "Does it adjust tone while preserving the point?",
        signal_vi: "Có ਸਧਾਰਨ ਤਰੀਕੇ ਨਾਲ và ਮੁੱਖ ਗੱਲ.",
        signal_en: "Uses simpler way and main point.",
      },
    ],
    learner_trap: {
      trap_vi: "Dịch nguyên văn thuật ngữ nội bộ khiến người nghe khó theo.",
      trap_en: "Literal internal jargon makes the audience struggle.",
      repair_vi: "Nêu ý chính bằng câu ngắn và lịch sự.",
      repair_en: "State the core point in a short, polite sentence.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_merge_sensitive_topic",
    focus: "sensitive_topic_framing",
    style: "pre_integration",
    title_vi: "Đóng khung chủ đề nhạy cảm",
    title_en: "Frame a sensitive topic safely",
    scenario_vi: "Thảo luận chuyển sang danh tính cá nhân, chính trị, tôn giáo, hoặc tiền bạc.",
    scenario_en: "The discussion shifts toward personal identity, politics, religion, or money.",
    readiness_goal_vi: "Nhận diện độ nhạy cảm và quay lại phần liên quan đến nhiệm vụ.",
    readiness_goal_en: "Name the sensitivity and return to the task-relevant portion.",
    sample_gurmukhi:
      "ਇਹ ਗੱਲ ਸੰਵੇਦਨਸ਼ੀਲ ਹੋ ਸਕਦੀ ਹੈ, ਇਸ ਲਈ ਆਓ ਇਸ ਨੂੰ ਕੰਮ ਨਾਲ ਜੁੜੇ ਹਿੱਸੇ ਤੱਕ ਰੱਖੀਏ।",
    sample_romanization:
      "ih gall sanvedansheel ho sakdi hai, is lai aao is nu kamm naal jurre hisse takk rakhie.",
    sample_vi:
      "Điều này có thể nhạy cảm, vì vậy ta hãy giữ nó trong phần liên quan đến công việc.",
    sample_en:
      "This may be sensitive, so let's keep it to the work-related part.",
    readiness_phrases: [
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
        check_vi: "Có đặt ranh giới mà không tranh luận nội dung nhạy cảm không?",
        check_en: "Does it set a boundary without debating the sensitive content?",
        signal_vi: "Có ਹੋ ਸਕਦੀ ਹੈ để giảm khẳng định tuyệt đối.",
        signal_en: "Uses may be to avoid overstatement.",
      },
    ],
    learner_trap: {
      trap_vi: "Giải thích dài khiến câu giống tranh luận lập trường.",
      trap_en: "A long explanation can sound like taking a position.",
      repair_vi: "Đặt ranh giới ngắn và quay lại nhiệm vụ.",
      repair_en: "Set a short boundary and return to the task.",
    },
  },
  {
    id: "pa_c2_merge_public_communication",
    focus: "public_communication_calibration",
    style: "merge_readiness",
    title_vi: "Hiệu chỉnh thông báo công khai",
    title_en: "Calibrate a public announcement",
    scenario_vi: "Bạn cần sửa thông báo trước khi công khai để tránh hứa quá mức.",
    scenario_en: "You need to revise a public notice before release to avoid overpromising.",
    readiness_goal_vi: "Nêu hiện trạng, giới hạn, và bước tiếp theo rõ ràng.",
    readiness_goal_en: "State the current status, limits, and next step clearly.",
    sample_gurmukhi:
      "ਇਸ ਵੇਲੇ ਸਮੀਖਿਆ ਜਾਰੀ ਹੈ। ਜਦੋਂ ਜਾਣਕਾਰੀ ਪੱਕੀ ਹੋਵੇਗੀ, ਅਸੀਂ ਅਗਲਾ ਕਦਮ ਸਾਂਝਾ ਕਰਾਂਗੇ।",
    sample_romanization:
      "is vele samikhia jaari hai. jadon jaankari pakki hovegi, asin agla kadam sanjha karange.",
    sample_vi:
      "Hiện tại việc rà soát đang tiếp tục. Khi thông tin được xác nhận, chúng tôi sẽ chia sẻ bước tiếp theo.",
    sample_en:
      "The review is currently ongoing. When the information is confirmed, we will share the next step.",
    readiness_phrases: [
      {
        gurmukhi: "ਸਮੀਖਿਆ ਜਾਰੀ ਹੈ",
        romanization: "samikhia jaari hai",
        vi: "Việc rà soát đang tiếp tục.",
        en: "The review is ongoing.",
      },
      {
        gurmukhi: "ਜਾਣਕਾਰੀ ਪੱਕੀ ਹੋਵੇਗੀ",
        romanization: "jaankari pakki hovegi",
        vi: "Thông tin được xác nhận.",
        en: "The information is confirmed.",
      },
    ],
    checks: [
      {
        check_vi: "Có tránh hứa chắc khi chưa chắc không?",
        check_en: "Does it avoid promising certainty before confirmation?",
        signal_vi: "Có ਜਦੋਂ ਜਾਣਕਾਰੀ ਪੱਕੀ ਹੋਵੇਗੀ.",
        signal_en: "Uses when the information is confirmed.",
      },
    ],
    learner_trap: {
      trap_vi: "Viết 'chúng tôi sẽ giải quyết ngay' khi chưa có thời hạn.",
      trap_en: "Writing 'we will resolve it immediately' without a timeline.",
      repair_vi: "Nêu trạng thái và bước tiếp theo có điều kiện.",
      repair_en: "State status and a conditional next step.",
    },
  },
  {
    id: "pa_c2_merge_register_safety",
    focus: "register_safety",
    style: "readiness",
    title_vi: "An toàn register trước khi nhập bộ học",
    title_en: "Register safety before course import",
    scenario_vi: "Một câu quá thân mật cần dùng được trong email chuyên nghiệp.",
    scenario_en: "A very casual sentence needs to work in a professional email.",
    readiness_goal_vi: "Giữ sự ấm áp nhưng thêm lời cảm ơn và yêu cầu cụ thể.",
    readiness_goal_en: "Keep warmth while adding thanks and a concrete request.",
    sample_gurmukhi:
      "ਤੁਹਾਡੇ ਸਮੇਂ ਲਈ ਧੰਨਵਾਦ। ਕਿਰਪਾ ਕਰਕੇ ਜਦੋਂ ਸੁਵਿਧਾ ਹੋਵੇ, ਅਗਲਾ ਕਦਮ ਦੱਸ ਦਿਓ।",
    sample_romanization:
      "tuhade same lai dhanvaad. kirpa karke jadon suvidha hove, agla kadam dass deo.",
    sample_vi:
      "Cảm ơn thời gian của anh/chị. Khi thuận tiện, xin vui lòng cho biết bước tiếp theo.",
    sample_en:
      "Thank you for your time. When convenient, please let me know the next step.",
    readiness_phrases: [
      {
        gurmukhi: "ਤੁਹਾਡੇ ਸਮੇਂ ਲਈ ਧੰਨਵਾਦ",
        romanization: "tuhade same lai dhanvaad",
        vi: "Cảm ơn thời gian của anh/chị.",
        en: "Thank you for your time.",
      },
      {
        gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ",
        romanization: "kirpa karke",
        vi: "Xin vui lòng.",
        en: "Please.",
      },
    ],
    checks: [
      {
        check_vi: "Có đủ lịch sự mà không phóng đại không?",
        check_en: "Is it polite without exaggeration?",
        signal_vi: "Có ਧੰਨਵਾਦ, ਕਿਰਪਾ ਕਰਕੇ, và ਅਗਲਾ ਕਦਮ.",
        signal_en: "Includes thanks, please, and next step.",
      },
    ],
    learner_trap: {
      trap_vi: "Thêm quá nhiều kính ngữ làm câu nặng.",
      trap_en: "Adding too many honorifics makes the sentence heavy.",
      repair_vi: "Dùng một lời cảm ơn, một please, và yêu cầu rõ.",
      repair_en: "Use one thanks, one please, and a clear request.",
    },
    canada_practical: true,
  },
];

export const c2MergeReadinessSamplesByFocus = (
  focus: PunjabiC2MergeReadinessFocus,
): PunjabiC2MergeReadinessSample[] => c2MergeReadinessSamples.filter((item) => item.focus === focus);
