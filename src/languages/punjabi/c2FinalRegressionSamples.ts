// Punjabi C2 final regression samples for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support regression samples only, not certification,
// official placement, legal/HR/medical/safety advice, or native-reviewed
// authority. Native review is deferred. Shahmukhi is mentioned only for script
// awareness, not as a full course.

export type PunjabiC2RegressionFocus =
  | "nuanced_disagreement"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "audience_adaptation"
  | "sensitive_topic_framing"
  | "public_communication_calibration"
  | "register_safety";

export type PunjabiC2RegressionStyle = "final_regression" | "sanity" | "pre_integration" | "regression";

export type PunjabiC2RegressionPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2RegressionCheck = {
  check_vi: string;
  check_en: string;
  signal_vi: string;
  signal_en: string;
};

export type PunjabiC2RegressionTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2FinalRegressionSample = {
  id: string;
  focus: PunjabiC2RegressionFocus;
  style: PunjabiC2RegressionStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  regression_goal_vi: string;
  regression_goal_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  regression_phrases: PunjabiC2RegressionPhrase[];
  checks: PunjabiC2RegressionCheck[];
  learner_trap?: PunjabiC2RegressionTrap;
  canada_practical?: boolean;
};

export const C2_FINAL_REGRESSION_SAMPLES_DISCLAIMER = {
  vi: "Bộ mẫu hồi quy cuối Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi final regression sample pack supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const c2FinalRegressionSamples: PunjabiC2FinalRegressionSample[] = [
  {
    id: "pa_c2_regression_nuanced_disagreement",
    focus: "nuanced_disagreement",
    style: "final_regression",
    title_vi: "Hồi quy bất đồng tinh tế",
    title_en: "Regression sample for nuanced disagreement",
    scenario_vi: "Bạn muốn giữ sắc thái khi phản biện một ý còn thiếu dữ liệu.",
    scenario_en: "You want to preserve nuance while challenging an under-supported point.",
    regression_goal_vi: "Giữ công nhận, rồi đưa điểm cần kiểm tra lại.",
    regression_goal_en: "Keep validation, then introduce the point that needs another check.",
    sample_gurmukhi:
      "ਮੈਂ ਮੁੱਢਲੇ ਮਕਸਦ ਨਾਲ ਸਹਿਮਤ ਹਾਂ, ਪਰ ਅਜੇ ਡਾਟੇ ਨੂੰ ਇੱਕ ਵਾਰੀ ਹੋਰ ਵੇਖਣਾ ਚਾਹੀਦਾ ਹੈ।",
    sample_romanization:
      "main muddle maqsad naal sahimat haan, par aje date nu ikk vari hor vekhna chahida hai.",
    sample_vi:
      "Tôi đồng ý với mục tiêu chính, nhưng dữ liệu vẫn nên được xem lại một lần nữa.",
    sample_en:
      "I agree with the main goal, but the data should still be reviewed once more.",
    regression_phrases: [
      {
        gurmukhi: "ਮੈਂ ਮੁੱਢਲੇ ਮਕਸਦ ਨਾਲ ਸਹਿਮਤ ਹਾਂ",
        romanization: "main muddle maqsad naal sahimat haan",
        vi: "Tôi đồng ý với mục tiêu chính.",
        en: "I agree with the main goal.",
      },
      {
        gurmukhi: "ਇੱਕ ਵਾਰੀ ਹੋਰ ਵੇਖਣਾ ਚਾਹੀਦਾ ਹੈ",
        romanization: "ikk vari hor vekhna chahida hai",
        vi: "Nên xem lại một lần nữa.",
        en: "It should be reviewed once more.",
      },
    ],
    checks: [
      {
        check_vi: "Có công nhận trước khi góp ý không?",
        check_en: "Does it validate before critique?",
        signal_vi: "Có ਸਹਿਮਤ ਹਾਂ rồi mới nói ਵੇਖਣਾ ਚਾਹੀਦਾ ਹੈ.",
        signal_en: "Includes agree first and then review again.",
      },
    ],
    learner_trap: {
      trap_vi: "Mở bằng phủ định làm câu mất cân bằng.",
      trap_en: "Opening with a negation makes the sentence feel unbalanced.",
      repair_vi: "Giữ công nhận ở đầu và điểm cần xem ở sau.",
      repair_en: "Keep validation first and the point to review after it.",
    },
  },
  {
    id: "pa_c2_regression_diplomacy_canada",
    focus: "diplomacy",
    style: "sanity",
    title_vi: "Kiểm tra ngoại giao khi từ chối",
    title_en: "Diplomatic sanity check for declining",
    scenario_vi: "Bạn muốn từ chối lời mời mà vẫn giữ thiện chí.",
    scenario_en: "You want to decline an invitation while preserving goodwill.",
    regression_goal_vi: "Từ chối mềm, có cảm ơn, và mở khả năng sau.",
    regression_goal_en: "Decline softly with thanks and a future opening.",
    sample_gurmukhi:
      "ਤੁਹਾਡੇ ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਲਈ ਆਉਣਾ ਸੰਭਵ ਨਹੀਂ ਹੋਵੇਗਾ, ਪਰ ਅਗਲੇ ਮੌਕੇ ਲਈ ਮੈਨੂੰ ਖੁਸ਼ੀ ਰਹੇਗੀ।",
    sample_romanization:
      "tuhade sadde lai dhanvaad. is vele mere lai auna sambhav nahin hovega, par agle mauke lai mainu khushi rahegi.",
    sample_vi:
      "Cảm ơn lời mời. Hiện tại tôi không thể đến, nhưng tôi sẽ rất vui cho dịp sau.",
    sample_en:
      "Thank you for the invitation. At the moment I will not be able to come, but I would be happy for another time.",
    regression_phrases: [
      {
        gurmukhi: "ਤੁਹਾਡੇ ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ",
        romanization: "tuhade sadde lai dhanvaad",
        vi: "Cảm ơn lời mời.",
        en: "Thank you for the invitation.",
      },
      {
        gurmukhi: "ਅਗਲੇ ਮੌਕੇ ਲਈ",
        romanization: "agle mauke lai",
        vi: "Cho dịp sau.",
        en: "For another time.",
      },
    ],
    checks: [
      {
        check_vi: "Có cảm ơn trước khi từ chối không?",
        check_en: "Does it thank before refusing?",
        signal_vi: "Có ਧੰਨਵਾਦ trước ਸੰਭਵ ਨਹੀਂ.",
        signal_en: "Has ਧੰਨਵਾਦ before the refusal point.",
      },
    ],
    learner_trap: {
      trap_vi: "Dùng 'tôi từ chối' nghe quá cứng.",
      trap_en: "Using 'I refuse' sounds too stiff.",
      repair_vi: "Giới hạn bằng ਇਸ ਵੇਲੇ và mở dịp sau.",
      repair_en: "Limit with ਇਸ ਵੇਲੇ and leave a later opportunity open.",
    },
  },
  {
    id: "pa_c2_regression_mediation",
    focus: "mediation",
    style: "pre_integration",
    title_vi: "Hồi quy trung gian không thiên vị",
    title_en: "Regression for neutral mediation",
    scenario_vi: "Hai phía bất đồng và bạn cần tóm tắt mà không chọn phe.",
    scenario_en: "Two sides disagree and you need to summarize without taking sides.",
    regression_goal_vi: "Giữ hai phía song song rồi quay về tiêu chí chung.",
    regression_goal_en: "Keep both sides parallel and return to shared criteria.",
    sample_gurmukhi:
      "ਇੱਕ ਪਾਸੇ ਸਮੇਂ ਦੀ ਚਿੰਤਾ ਹੈ, ਦੂਜੇ ਪਾਸੇ ਗੁਣਵੱਤਾ ਦੀ। ਆਓ ਦੋਵੇਂ ਗੱਲਾਂ ਨੂੰ ਇੱਕੋ ਮਾਪਦੰਡ ਨਾਲ ਵੇਖੀਏ।",
    sample_romanization:
      "ikk pase same di chinta hai, duje pase gunvatta di. aao dovein gallan nu ikko mapdand naal vekhie.",
    sample_vi:
      "Một phía lo về thời gian, phía kia lo về chất lượng. Hãy xem cả hai theo cùng một tiêu chí.",
    sample_en:
      "One side is concerned about time, and the other side is concerned about quality. Let's look at both through the same criteria.",
    regression_phrases: [
      {
        gurmukhi: "ਇੱਕ ਪਾਸੇ",
        romanization: "ikk pase",
        vi: "Một phía.",
        en: "On one side.",
      },
      {
        gurmukhi: "ਦੂਜੇ ਪਾਸੇ",
        romanization: "duje pase",
        vi: "Phía kia.",
        en: "On the other side.",
      },
    ],
    checks: [
      {
        check_vi: "Có song song hai phía không?",
        check_en: "Does it place both sides in parallel?",
        signal_vi: "Có ਇੱਕ ਪਾਸੇ và ਦੂਜੇ ਪਾਸੇ.",
        signal_en: "Includes one side and the other side.",
      },
    ],
    learner_trap: {
      trap_vi: "Biến trung gian thành phán quyết ai đúng.",
      trap_en: "Turning mediation into a verdict on who is right.",
      repair_vi: "Giữ cấu trúc song song và quay về tiêu chí chung.",
      repair_en: "Keep the parallel structure and return to shared criteria.",
    },
  },
  {
    id: "pa_c2_regression_deescalation",
    focus: "deescalation",
    style: "regression",
    title_vi: "Hạ nhiệt cuộc họp căng",
    title_en: "De-escalate a tense meeting",
    scenario_vi: "Cuộc họp bắt đầu căng và mọi người nói chồng lên nhau.",
    scenario_en: "A meeting is getting tense and people are speaking over each other.",
    regression_goal_vi: "Đưa cuộc họp về quy trình thay vì cảm xúc.",
    regression_goal_en: "Bring the meeting back to process instead of emotion.",
    sample_gurmukhi:
      "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ। ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ, ਇਸ ਲਈ ਬਾਰੀ-ਬਾਰੀ ਗੱਲ ਕਰੀਏ।",
    sample_romanization:
      "aao ikk-ikk gall sunie. maqsad hall labhna hai, is lai baari-baari gall karie.",
    sample_vi:
      "Ta hãy nghe từng ý một. Mục tiêu là tìm giải pháp, vì vậy hãy nói lần lượt.",
    sample_en:
      "Let's hear one point at a time. The goal is to find a solution, so let's speak in turn.",
    regression_phrases: [
      {
        gurmukhi: "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ",
        romanization: "aao ikk-ikk gall sunie",
        vi: "Ta hãy nghe từng ý một.",
        en: "Let's hear one point at a time.",
      },
      {
        gurmukhi: "ਬਾਰੀ-ਬਾਰੀ ਗੱਲ ਕਰੀਏ",
        romanization: "baari-baari gall karie",
        vi: "Hãy nói lần lượt.",
        en: "Let's speak in turn.",
      },
    ],
    checks: [
      {
        check_vi: "Có đề xuất trình tự nói không?",
        check_en: "Does it propose a speaking order?",
        signal_vi: "Có ਬਾਰੀ-ਬਾਰੀ.",
        signal_en: "Includes turn-taking.",
      },
    ],
    learner_trap: {
      trap_vi: "Nói 'bình tĩnh đi' nghe áp đặt.",
      trap_en: "Saying 'calm down' sounds bossy.",
      repair_vi: "Đề xuất lượt nói và mục tiêu chung.",
      repair_en: "Suggest turn-taking and the shared goal.",
    },
  },
  {
    id: "pa_c2_regression_audience_adaptation_canada",
    focus: "audience_adaptation",
    style: "final_regression",
    title_vi: "Hồi quy độ trang trọng theo người nghe",
    title_en: "Regression for audience-based formality",
    scenario_vi: "Bạn phải nói lại cùng một ý cho bạn bè, phụ huynh, và đồng nghiệp.",
    scenario_en: "You need to say the same idea to friends, parents, and coworkers.",
    regression_goal_vi: "Giữ ý chính nhưng đổi mức lịch sự cho phù hợp.",
    regression_goal_en: "Keep the core message while adjusting politeness to fit.",
    sample_gurmukhi:
      "ਜੇ ਮੈਂ ਥੋੜ੍ਹਾ ਸਧਾਰਨ ਤਰੀਕੇ ਨਾਲ ਕਹਾਂ, ਤਾਂ ਮੁੱਖ ਗੱਲ ਇਹ ਹੈ ਕਿ ਅੱਜ ਹੀ ਸਮਾਂ-ਸੂਚੀ ਸਾਫ਼ ਕਰਨੀ ਹੈ।",
    sample_romanization:
      "je main thorra sadharan tarike naal kahan, tan mukh gall ih hai ki ajj hi sama-suchi saf karni hai.",
    sample_vi:
      "Nếu tôi nói đơn giản hơn, ý chính là hôm nay cần làm rõ lịch trình.",
    sample_en:
      "If I say it more simply, the main point is that we need to clarify the schedule today.",
    regression_phrases: [
      {
        gurmukhi: "ਜੇ ਮੈਂ ਥੋੜ੍ਹਾ ਸਧਾਰਨ ਤਰੀਕੇ ਨਾਲ ਕਹਾਂ",
        romanization: "je main thorra sadharan tarike naal kahan",
        vi: "Nếu tôi nói đơn giản hơn.",
        en: "If I say it more simply.",
      },
      {
        gurmukhi: "ਮੁੱਖ ਗੱਲ ਇਹ ਹੈ",
        romanization: "mukh gall ih hai",
        vi: "Ý chính là...",
        en: "The main point is...",
      },
    ],
    checks: [
      {
        check_vi: "Có đổi giọng nhưng giữ nội dung không?",
        check_en: "Does it change tone while keeping the message?",
        signal_vi: "Có ਮੁੱਖ ਗੱਲ và ਸਧਾਰਨ ਤਰੀਕੇ ਨਾਲ.",
        signal_en: "Includes main point and more simply.",
      },
    ],
    learner_trap: {
      trap_vi: "Đổi giọng quá mạnh làm mất nội dung.",
      trap_en: "Changing tone too much and losing the content.",
      repair_vi: "Giữ ý chính trước, chỉnh register sau.",
      repair_en: "Keep the core message first, then adjust register.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_regression_public_communication_calibration",
    focus: "public_communication_calibration",
    style: "sanity",
    title_vi: "Hiệu chỉnh giao tiếp công khai",
    title_en: "Public communication calibration",
    scenario_vi: "Bạn phát biểu trước nhóm lớn hoặc trả lời trước công chúng.",
    scenario_en: "You are speaking to a large group or answering in public.",
    regression_goal_vi: "Giữ cùng giọng, cùng mức lịch sự, và cùng ý chính.",
    regression_goal_en: "Keep the same tone, the same politeness level, and the same main point.",
    sample_gurmukhi:
      "ਅਸੀਂ ਸਭ ਲਈ ਸਾਫ਼ ਸੁਨੇਹਾ ਰੱਖਣਾ ਚਾਹੁੰਦੇ ਹਾਂ: ਪਹਿਲਾਂ ਸੁਣੀਏ, ਫਿਰ ਅੱਗੇ ਵਧੀਏ।",
    sample_romanization:
      "asin sabh lai saf sandesha rakhna chahunde haan: pehlan suniye, fir agge vadhiye.",
    sample_vi:
      "Chúng ta muốn giữ một thông điệp rõ ràng cho mọi người: hãy nghe trước rồi tiến tiếp.",
    sample_en:
      "We want to keep a clear message for everyone: listen first, then move forward.",
    regression_phrases: [
      {
        gurmukhi: "ਸਾਫ਼ ਸੁਨੇਹਾ",
        romanization: "saf sandesha",
        vi: "Thông điệp rõ ràng.",
        en: "Clear message.",
      },
      {
        gurmukhi: "ਪਹਿਲਾਂ ਸੁਣੀਏ, ਫਿਰ ਅੱਗੇ ਵਧੀਏ",
        romanization: "pehlan suniye, fir agge vadhiye",
        vi: "Hãy nghe trước rồi tiến tiếp.",
        en: "Listen first, then move forward.",
      },
    ],
    checks: [
      {
        check_vi: "Có giữ một giọng xuyên suốt không?",
        check_en: "Does it keep one tone throughout?",
        signal_vi: "Có ਸਾਫ਼ và ਪਹਿਲਾਂ ਸੁਣੀਏ.",
        signal_en: "Includes clear message and listen first.",
      },
    ],
    learner_trap: {
      trap_vi: "Đổi giọng liên tục trong cùng một phát biểu.",
      trap_en: "Changing tone repeatedly in one speech.",
      repair_vi: "Chọn một mức lịch sự rồi giữ đến hết.",
      repair_en: "Choose one politeness level and keep it through the end.",
    },
  },
  {
    id: "pa_c2_regression_register_safety",
    focus: "register_safety",
    style: "pre_integration",
    title_vi: "An toàn đăng ký cho hồi quy cuối",
    title_en: "Register safety for final regression",
    scenario_vi: "Bạn viết cho trường, nơi làm, hoặc dịch vụ cộng đồng ở Canada.",
    scenario_en: "You are writing to a school, workplace, or community service in Canada.",
    regression_goal_vi: "Giữ lịch sự, rõ ý, và đủ ấm.",
    regression_goal_en: "Keep it polite, clear, and warm enough.",
    sample_gurmukhi:
      "ਤੁਹਾਡੇ ਸਮੇਂ ਅਤੇ ਸਹਿਯੋਗ ਲਈ ਧੰਨਵਾਦ। ਜੇ ਹੋ ਸਕੇ, ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੱਸ ਦਿਓ।",
    sample_romanization:
      "tuhade same ate sahiyog lai dhanvaad. je ho sake, kirpa karke agla kadam dass deo.",
    sample_vi:
      "Cảm ơn vì thời gian và sự hỗ trợ của anh/chị. Nếu được, xin cho biết bước tiếp theo.",
    sample_en:
      "Thank you for your time and support. If possible, please let me know the next step.",
    regression_phrases: [
      {
        gurmukhi: "ਤੁਹਾਡੇ ਸਮੇਂ ਲਈ ਧੰਨਵਾਦ",
        romanization: "tuhade same lai dhanvaad",
        vi: "Cảm ơn vì thời gian của anh/chị.",
        en: "Thank you for your time.",
      },
      {
        gurmukhi: "ਅਗਲਾ ਕਦਮ ਦੱਸ ਦਿਓ",
        romanization: "agla kadam dass deo",
        vi: "Xin cho biết bước tiếp theo.",
        en: "Please let me know the next step.",
      },
    ],
    checks: [
      {
        check_vi: "Có đủ lịch sự mà không quá xa cách không?",
        check_en: "Is it polite without sounding distant?",
        signal_vi: "Có ਧੰਨਵਾਦ và ਅਗਲਾ ਕਦਮ.",
        signal_en: "Includes thanks and next step.",
      },
    ],
    learner_trap: {
      trap_vi: "Quá trang trọng nên nghe lạnh.",
      trap_en: "So formal that it sounds cold.",
      repair_vi: "Giữ câu ngắn, lịch sự, và có yêu cầu rõ.",
      repair_en: "Keep it short, polite, and explicitly useful.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_regression_sensitive_topics",
    focus: "sensitive_topic_framing",
    style: "final_regression",
    title_vi: "Hồi quy chủ đề nhạy cảm",
    title_en: "Regression sample for sensitive-topic framing",
    scenario_vi: "Cuộc trò chuyện chạm vào chính trị, tôn giáo, tiền bạc, hoặc danh tính cá nhân.",
    scenario_en: "The conversation touches politics, religion, money, or personal identity.",
    regression_goal_vi: "Nhận ra độ nhạy cảm rồi kéo lại phần liên quan đến nhiệm vụ.",
    regression_goal_en: "Recognize the sensitivity and bring the discussion back to the task part.",
    sample_gurmukhi:
      "ਇਹ ਵਿਸ਼ਾ ਸੰਵੇਦਨਸ਼ੀਲ ਹੈ, ਇਸ ਲਈ ਆਓ ਕੰਮ ਵਾਲੇ ਹਿੱਸੇ ਤੇ ਧਿਆਨ ਦੇਈਏ।",
    sample_romanization:
      "ih visha sanvedansheel hai, is lai aao kamm wale hisse te dhiaan deie.",
    sample_vi:
      "Chủ đề này nhạy cảm, vì vậy ta hãy tập trung vào phần công việc.",
    sample_en:
      "This topic is sensitive, so let's focus on the work-related part.",
    regression_phrases: [
      {
        gurmukhi: "ਇਹ ਵਿਸ਼ਾ ਸੰਵੇਦਨਸ਼ੀਲ ਹੈ",
        romanization: "ih visha sanvedansheel hai",
        vi: "Chủ đề này nhạy cảm.",
        en: "This topic is sensitive.",
      },
      {
        gurmukhi: "ਕੰਮ ਵਾਲੇ ਹਿੱਸੇ ਤੇ ਧਿਆਨ ਦੇਈਏ",
        romanization: "kamm wale hisse te dhiaan deie",
        vi: "Hãy tập trung vào phần công việc.",
        en: "Let's focus on the work-related part.",
      },
    ],
    checks: [
      {
        check_vi: "Có đặt ranh giới ngắn và không phán xét không?",
        check_en: "Does it set a short boundary without judgment?",
        signal_vi: "Có ਸੰਵੇਦਨਸ਼ੀਲ và ਕੰਮ ਵਾਲੇ ਹਿੱਸੇ.",
        signal_en: "Includes sensitive topic and work-related part.",
      },
    ],
    learner_trap: {
      trap_vi: "Đi sâu tranh luận khi chỉ cần giữ an toàn chủ đề.",
      trap_en: "Going too deep into debate when only topic safety is needed.",
      repair_vi: "Đặt ranh giới ngắn rồi chuyển hướng.",
      repair_en: "Set a short boundary and redirect.",
    },
  },
];

export const c2FinalRegressionSamplesByFocus = (
  focus: PunjabiC2RegressionFocus,
): PunjabiC2FinalRegressionSample[] => c2FinalRegressionSamples.filter((item) => item.focus === focus);
