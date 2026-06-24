// Punjabi C2 final handoff set for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support final-handoff selectors only, not certification,
// official placement, legal/HR/medical/safety advice, or native-reviewed
// authority. Native review is deferred. Shahmukhi is mentioned only for script
// awareness, not as a full course.

export type PunjabiC2FinalHandoffFocus =
  | "nuanced_disagreement"
  | "audience_adaptation"
  | "mediation"
  | "deescalation"
  | "advanced_register"
  | "public_communication"
  | "sensitive_topic_framing"
  | "diplomacy"
  | "community_discourse"
  | "professional_discourse"
  | "public_service";

export type PunjabiC2FinalHandoffStyle = "final_handoff" | "pre_integration" | "final_readiness" | "regression";

export type PunjabiC2FinalHandoffPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2FinalHandoffCheck = {
  check_vi: string;
  check_en: string;
  signal_vi: string;
  signal_en: string;
};

export type PunjabiC2FinalHandoffTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2FinalHandoffItem = {
  id: string;
  focus: PunjabiC2FinalHandoffFocus;
  style: PunjabiC2FinalHandoffStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  handoff_goal_vi: string;
  handoff_goal_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  handoff_phrases: PunjabiC2FinalHandoffPhrase[];
  checks: PunjabiC2FinalHandoffCheck[];
  learner_trap?: PunjabiC2FinalHandoffTrap;
  canada_practical?: boolean;
};

export const C2_FINAL_HANDOFF_SET_DISCLAIMER = {
  vi: "Bộ final-handoff Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi final-handoff set supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const c2FinalHandoffSet: PunjabiC2FinalHandoffItem[] = [
  {
    id: "pa_c2_finalhandoff_nuanced_disagreement",
    focus: "nuanced_disagreement",
    style: "final_handoff",
    title_vi: "Bàn giao bất đồng tinh tế",
    title_en: "Final handoff for nuanced disagreement",
    scenario_vi: "Bạn cần để lại một câu góp ý vẫn giữ công nhận và tránh chốt vội.",
    scenario_en: "You need a handoff sentence that validates and avoids a rushed closure.",
    handoff_goal_vi: "Giữ công nhận trước rồi mới chuyển sang điểm cần xem lại.",
    handoff_goal_en: "Keep validation first, then move to the point to review.",
    sample_gurmukhi:
      "ਮੈਂ ਮੁੱਢਲੇ ਮਕਸਦ ਨਾਲ ਸਹਿਮਤ ਹਾਂ, ਪਰ ਅਜੇ ਡਾਟੇ ਨੂੰ ਇੱਕ ਵਾਰੀ ਹੋਰ ਵੇਖਣਾ ਚਾਹੀਦਾ ਹੈ।",
    sample_romanization:
      "main muddle maqsad naal sahimat haan, par aje date nu ikk vari hor vekhna chahida hai.",
    sample_vi:
      "Tôi đồng ý với mục tiêu chính, nhưng dữ liệu vẫn nên được xem lại một lần nữa.",
    sample_en:
      "I agree with the main goal, but the data should still be reviewed once more.",
    handoff_phrases: [
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
    id: "pa_c2_finalhandoff_audience_adaptation_canada",
    focus: "audience_adaptation",
    style: "pre_integration",
    title_vi: "Bàn giao mức trang trọng theo người nghe",
    title_en: "Handoff for audience-based formality",
    scenario_vi: "Bạn cần để lại câu nói giống ý nhưng phù hợp với bạn bè, phụ huynh, hoặc đồng nghiệp.",
    scenario_en: "You need a same-meaning sentence that fits friends, parents, or coworkers.",
    handoff_goal_vi: "Giữ ý chính nhưng đổi mức lịch sự cho phù hợp.",
    handoff_goal_en: "Keep the core message while adjusting politeness to fit.",
    sample_gurmukhi:
      "ਜੇ ਮੈਂ ਥੋੜ੍ਹਾ ਸਧਾਰਨ ਤਰੀਕੇ ਨਾਲ ਕਹਾਂ, ਤਾਂ ਮੁੱਖ ਗੱਲ ਇਹ ਹੈ ਕਿ ਅੱਜ ਹੀ ਸਮਾਂ-ਸੂਚੀ ਸਾਫ਼ ਕਰਨੀ ਹੈ।",
    sample_romanization:
      "je main thorra sadharan tarike naal kahan, tan mukh gall ih hai ki ajj hi sama-suchi saf karni hai.",
    sample_vi:
      "Nếu tôi nói đơn giản hơn, ý chính là hôm nay cần làm rõ lịch trình.",
    sample_en:
      "If I say it more simply, the main point is that we need to clarify the schedule today.",
    handoff_phrases: [
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
    id: "pa_c2_finalhandoff_mediation",
    focus: "mediation",
    style: "final_handoff",
    title_vi: "Bàn giao trung gian không thiên vị",
    title_en: "Final handoff for neutral mediation",
    scenario_vi: "Hai phía bất đồng và bạn cần tóm tắt mà không chọn phe.",
    scenario_en: "Two sides disagree and you need to summarize without taking sides.",
    handoff_goal_vi: "Giữ hai phía song song rồi quay về tiêu chí chung.",
    handoff_goal_en: "Keep both sides parallel and return to shared criteria.",
    sample_gurmukhi:
      "ਇੱਕ ਪਾਸੇ ਸਮੇਂ ਦੀ ਚਿੰਤਾ ਹੈ, ਦੂਜੇ ਪਾਸੇ ਗੁਣਵੱਤਾ ਦੀ। ਆਓ ਦੋਵੇਂ ਗੱਲਾਂ ਨੂੰ ਇੱਕੋ ਮਾਪਦੰਡ ਨਾਲ ਵੇਖੀਏ।",
    sample_romanization:
      "ikk pase same di chinta hai, duje pase gunvatta di. aao dovein gallan nu ikko mapdand naal vekhie.",
    sample_vi:
      "Một phía lo về thời gian, phía kia lo về chất lượng. Hãy xem cả hai theo cùng một tiêu chí.",
    sample_en:
      "One side is concerned about time, and the other side is concerned about quality. Let's look at both through the same criteria.",
    handoff_phrases: [
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
    id: "pa_c2_finalhandoff_deescalation",
    focus: "deescalation",
    style: "final_readiness",
    title_vi: "Sẵn sàng hạ nhiệt cuộc họp",
    title_en: "Ready to de-escalate a meeting",
    scenario_vi: "Cuộc họp bắt đầu căng và mọi người nói chồng lên nhau.",
    scenario_en: "A meeting is getting tense and people are speaking over each other.",
    handoff_goal_vi: "Chọn câu đưa cuộc họp về quy trình thay vì cảm xúc.",
    handoff_goal_en: "Choose wording that returns the meeting to process instead of emotion.",
    sample_gurmukhi:
      "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ। ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ, ਇਸ ਲਈ ਬਾਰੀ-ਬਾਰੀ ਗੱਲ ਕਰੀਏ।",
    sample_romanization:
      "aao ikk-ikk gall sunie. maqsad hall labhna hai, is lai baari-baari gall karie.",
    sample_vi:
      "Ta hãy nghe từng ý một. Mục tiêu là tìm giải pháp, vì vậy hãy nói lần lượt.",
    sample_en:
      "Let's hear one point at a time. The goal is to find a solution, so let's speak in turn.",
    handoff_phrases: [
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
    id: "pa_c2_finalhandoff_register_safety",
    focus: "advanced_register",
    style: "pre_integration",
    title_vi: "Bàn giao an toàn đăng ký nâng cao",
    title_en: "Handoff for safe advanced register",
    scenario_vi: "Bạn viết cho trường, nơi làm, hoặc dịch vụ cộng đồng ở Canada.",
    scenario_en: "You are writing to a school, workplace, or community service in Canada.",
    handoff_goal_vi: "Giữ lịch sự, rõ ý, và đủ ấm.",
    handoff_goal_en: "Keep it polite, clear, and warm enough.",
    sample_gurmukhi:
      "ਤੁਹਾਡੇ ਸਮੇਂ ਅਤੇ ਸਹਿਯੋਗ ਲਈ ਧੰਨਵਾਦ। ਜੇ ਹੋ ਸਕੇ, ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੱਸ ਦਿਓ।",
    sample_romanization:
      "tuhade same ate sahiyog lai dhanvaad. je ho sake, kirpa karke agla kadam dass deo.",
    sample_vi:
      "Cảm ơn vì thời gian và sự hỗ trợ của anh/chị. Nếu được, xin cho biết bước tiếp theo.",
    sample_en:
      "Thank you for your time and support. If possible, please let me know the next step.",
    handoff_phrases: [
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
    id: "pa_c2_finalhandoff_public_communication",
    focus: "public_communication",
    style: "regression",
    title_vi: "Quay về mạch rõ trong phát biểu công khai",
    title_en: "Return to a clear thread in public speaking",
    scenario_vi: "Bạn phát biểu trước nhóm lớn hoặc trả lời trước công chúng.",
    scenario_en: "You are speaking to a large group or answering in public.",
    handoff_goal_vi: "Giữ cùng giọng, cùng mức lịch sự, và cùng ý chính.",
    handoff_goal_en: "Keep the same tone, the same politeness level, and the same main point.",
    sample_gurmukhi:
      "ਅਸੀਂ ਸਭ ਲਈ ਸਾਫ਼ ਸੁਨੇਹਾ ਰੱਖਣਾ ਚਾਹੁੰਦੇ ਹਾਂ: ਪਹਿਲਾਂ ਸੁਣੀਏ, ਫਿਰ ਅੱਗੇ ਵਧੀਏ।",
    sample_romanization:
      "asin sabh lai saf sandesha rakhna chahunde haan: pehlan suniye, fir agge vadhiye.",
    sample_vi:
      "Chúng ta muốn giữ một thông điệp rõ ràng cho mọi người: hãy nghe trước rồi tiến tiếp.",
    sample_en:
      "We want to keep a clear message for everyone: listen first, then move forward.",
    handoff_phrases: [
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
        signal_vi: "Có ਸਾਫ਼ ਅਤੇ ਪਹਿਲਾਂ ਸੁਣੀਏ.",
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
    id: "pa_c2_finalhandoff_sensitive_topics",
    focus: "sensitive_topic_framing",
    style: "final_handoff",
    title_vi: "Bàn giao khung an toàn cho chủ đề nhạy cảm",
    title_en: "Final handoff for safe sensitive-topic framing",
    scenario_vi: "Cuộc trò chuyện chạm vào chính trị, tôn giáo, tiền bạc, hoặc danh tính cá nhân.",
    scenario_en: "The conversation touches politics, religion, money, or personal identity.",
    handoff_goal_vi: "Nhận ra độ nhạy cảm rồi kéo lại phần liên quan đến nhiệm vụ.",
    handoff_goal_en: "Recognize the sensitivity and bring the discussion back to the task part.",
    sample_gurmukhi:
      "ਇਹ ਵਿਸ਼ਾ ਸੰਵੇਦਨਸ਼ੀਲ ਹੈ, ਇਸ ਲਈ ਆਓ ਕੰਮ ਵਾਲੇ ਹਿੱਸੇ ਤੇ ਧਿਆਨ ਦੇਈਏ।",
    sample_romanization:
      "ih visha sanvedansheel hai, is lai aao kamm wale hisse te dhiaan deie.",
    sample_vi:
      "Chủ đề này nhạy cảm, vì vậy ta hãy tập trung vào phần công việc.",
    sample_en:
      "This topic is sensitive, so let's focus on the work-related part.",
    handoff_phrases: [
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
  {
    id: "pa_c2_finalhandoff_diplomacy",
    focus: "diplomacy",
    style: "final_readiness",
    title_vi: "Sẵn sàng từ chối ngoại giao",
    title_en: "Ready to decline diplomatically",
    scenario_vi: "Bạn không thể nhận lời mời nhưng muốn giữ thiện chí.",
    scenario_en: "You cannot accept an invitation but want to keep goodwill.",
    handoff_goal_vi: "Từ chối mềm, có cảm ơn, và mở khả năng sau.",
    handoff_goal_en: "Decline softly with thanks and a future opening.",
    sample_gurmukhi:
      "ਤੁਹਾਡੇ ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਲਈ ਆਉਣਾ ਸੰਭਵ ਨਹੀਂ ਹੋਵੇਗਾ, ਪਰ ਅਗਲੇ ਮੌਕੇ ਲਈ ਮੈਨੂੰ ਖੁਸ਼ੀ ਰਹੇਗੀ।",
    sample_romanization:
      "tuhade sadde lai dhanvaad. is vele mere lai auna sambhav nahin hovega, par agle mauke lai mainu khushi rahegi.",
    sample_vi:
      "Cảm ơn lời mời. Hiện tại tôi không thể đến, nhưng tôi sẽ rất vui cho dịp sau.",
    sample_en:
      "Thank you for the invitation. At the moment I will not be able to come, but I would be happy for another time.",
    handoff_phrases: [
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
        check_vi: "Có cảm ơn trước khi giới hạn không?",
        check_en: "Does thanks come before the limit?",
        signal_vi: "Có ਧੰਨਵਾਦ và ਅਗਲੇ ਮੌਕੇ.",
        signal_en: "Includes thanks and another time.",
      },
    ],
    learner_trap: {
      trap_vi: "Dịch 'I refuse' quá cứng.",
      trap_en: "Translating 'I refuse' too bluntly.",
      repair_vi: "Dùng ਇਸ ਵੇਲੇ không thể và cảm ơn.",
      repair_en: "Use 'at the moment I cannot' plus thanks.",
    },
  },
  {
    id: "pa_c2_finalhandoff_community_discourse",
    focus: "community_discourse",
    style: "final_handoff",
    title_vi: "Bàn giao nói chuyện cộng đồng",
    title_en: "Final handoff for community discourse",
    scenario_vi: "Nhóm cộng đồng cần chia việc mà không gán vai theo định kiến.",
    scenario_en: "A community group needs to divide tasks without stereotype-based roles.",
    handoff_goal_vi: "Mời chọn việc theo thời gian, kỹ năng, và mức thoải mái.",
    handoff_goal_en: "Invite choices based on availability, skill, and comfort.",
    sample_gurmukhi:
      "ਅਸੀਂ ਕੰਮ ਰੁਚੀ, ਸਮੇਂ ਅਤੇ ਸੁਵਿਧਾ ਦੇ ਅਨੁਸਾਰ ਵੰਡ ਸਕਦੇ ਹਾਂ। ਜਿਸ ਨੂੰ ਸੁਵਿਧਾ ਹੋਵੇ, ਉਹ ਇਹ ਹਿੱਸਾ ਲੈ ਸਕਦਾ ਹੈ।",
    sample_romanization:
      "asin kamm ruchi, same ate suvidha de anusaar vand sakde haan. jis nu suvidha hove, oh ih hissa lai sakda hai.",
    sample_vi:
      "Chúng ta có thể chia việc theo sở thích, thời gian và mức thuận tiện. Ai thấy thuận tiện có thể nhận phần này.",
    sample_en:
      "We can divide the work by interest, availability, and comfort. Whoever feels comfortable can take this part.",
    handoff_phrases: [
      {
        gurmukhi: "ਰੁਚੀ ਅਤੇ ਸਮੇਂ ਦੇ ਅਨੁਸਾਰ",
        romanization: "ruchi ate same de anusaar",
        vi: "Theo sở thích và thời gian.",
        en: "According to interest and availability.",
      },
      {
        gurmukhi: "ਜਿਸ ਨੂੰ ਸੁਵਿਧਾ ਹੋਵੇ",
        romanization: "jis nu suvidha hove",
        vi: "Ai thấy thuận tiện.",
        en: "Whoever feels comfortable.",
      },
    ],
    checks: [
      {
        check_vi: "Có tiêu chí trung tính không?",
        check_en: "Are the criteria neutral?",
        signal_vi: "Có ਰੁਚੀ, ਸਮੇਂ, ਅਤੇ ਸੁਵਿਧਾ.",
        signal_en: "Includes interest, time, and comfort.",
      },
    ],
    learner_trap: {
      trap_vi: "Gán việc theo tuổi hay giới.",
      trap_en: "Assigning tasks by age or gender.",
      repair_vi: "Chuyển sang tiêu chí khả năng và thoải mái.",
      repair_en: "Shift to availability, capacity, and comfort.",
    },
  },
  {
    id: "pa_c2_finalhandoff_professional_discourse",
    focus: "professional_discourse",
    style: "pre_integration",
    title_vi: "Bàn giao góp ý chuyên nghiệp",
    title_en: "Final handoff for professional feedback",
    scenario_vi: "Bạn góp ý cho đồng nghiệp mà không làm mất mặt ai.",
    scenario_en: "You are giving feedback to a coworker without embarrassing anyone.",
    handoff_goal_vi: "Công nhận nỗ lực, nêu điểm cần chỉnh, rồi đưa hướng tiếp.",
    handoff_goal_en: "Acknowledge effort, name the adjustment, then give the next step.",
    sample_gurmukhi:
      "ਤੁਹਾਡਾ ਮਸੌਦਾ ਵਧੀਆ ਹੈ; ਸਿਰਫ਼ ਇਹ ਹਿੱਸਾ ਥੋੜ੍ਹਾ ਸਾਫ਼ ਕਰੀਏ ਤਾਂ ਸੁਨੇਹਾ ਹੋਰ ਮਜ਼ਬੂਤ ਹੋਵੇਗਾ।",
    sample_romanization:
      "tuhada masoda vadhia hai; sirf ih hissa thorra saf kariye tan sandesha hor majboot hovega.",
    sample_vi:
      "Bản nháp của bạn khá tốt; chỉ cần làm rõ phần này hơn thì thông điệp sẽ mạnh hơn.",
    sample_en:
      "Your draft is good; if we just make this part clearer, the message will be stronger.",
    handoff_phrases: [
      {
        gurmukhi: "ਤੁਹਾਡਾ ਮਸੌਦਾ ਵਧੀਆ ਹੈ",
        romanization: "tuhada masoda vadhia hai",
        vi: "Bản nháp của bạn khá tốt.",
        en: "Your draft is good.",
      },
      {
        gurmukhi: "ਸਿਰਫ਼ ਇਹ ਹਿੱਸਾ ਥੋੜ੍ਹਾ ਸਾਫ਼ ਕਰੀਏ",
        romanization: "sirf ih hissa thorra saf kariye",
        vi: "Chỉ cần làm rõ phần này hơn.",
        en: "Let's just make this part a bit clearer.",
      },
    ],
    checks: [
      {
        check_vi: "Có giữ giọng chuyên nghiệp mà vẫn mềm không?",
        check_en: "Does it stay professional while remaining soft?",
        signal_vi: "Có ਵਧੀਆ ਹੈ và ਸਾਫ਼ ਕਰੀਏ.",
        signal_en: "Includes good and let's make clearer.",
      },
    ],
    learner_trap: {
      trap_vi: "Góp ý quá thẳng làm người nghe co lại.",
      trap_en: "Feedback that is too direct makes the listener shut down.",
      repair_vi: "Mở bằng điểm mạnh rồi mới nói phần sửa.",
      repair_en: "Open with a strength, then mention the fix.",
    },
  },
  {
    id: "pa_c2_finalhandoff_public_service",
    focus: "public_service",
    style: "regression",
    title_vi: "Quay về quy trình ở quầy dịch vụ công",
    title_en: "Return to process at a public-service desk",
    scenario_vi: "Bạn đang ở quầy dịch vụ và chỉ có bản sao cùng email xác nhận.",
    scenario_en: "You are at a service desk with only a copy and a confirmation email.",
    handoff_goal_vi: "Nói theo quy trình: cái có, cái cần, và bước kế tiếp.",
    handoff_goal_en: "Follow the process: what you have, what you need, and the next step.",
    sample_gurmukhi:
      "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ। ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਅਤੇ ਪੁਸ਼ਟੀ ਵਾਲਾ ਈਮੇਲ ਹੈ; ਅਗਲਾ ਕਦਮ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
    sample_romanization:
      "mainu niyam di samajh hai. mere kol copy ate pushti wala email hai; agla kadam ki ho sakda hai?",
    sample_vi:
      "Tôi hiểu quy định. Tôi có bản sao và email xác nhận; bước tiếp theo có thể là gì?",
    sample_en:
      "I understand the rule. I have a copy and a confirmation email; what could the next step be?",
    handoff_phrases: [
      {
        gurmukhi: "ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਹੈ",
        romanization: "mere kol copy hai",
        vi: "Tôi có bản sao.",
        en: "I have a copy.",
      },
      {
        gurmukhi: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
        romanization: "agla kadam ki ho sakda hai?",
        vi: "Bước tiếp theo có thể là gì?",
        en: "What could the next step be?",
      },
    ],
    checks: [
      {
        check_vi: "Có nêu cái có trước rồi mới hỏi không?",
        check_en: "Does it state what you have before asking?",
        signal_vi: "Có ਕਾਪੀ và ਪੁਸ਼ਟੀ ਵਾਲਾ ਈਮੇਲ.",
        signal_en: "Includes copy and confirmation email.",
      },
    ],
    learner_trap: {
      trap_vi: "Chuyển sang đòi ngoại lệ ngay.",
      trap_en: "Switching to an exception request immediately.",
      repair_vi: "Theo quy trình: cái có, bước tiếp theo.",
      repair_en: "Follow the process: what you have, then the next step.",
    },
    canada_practical: true,
  },
];

export const c2FinalHandoffSetByFocus = (
  focus: PunjabiC2FinalHandoffFocus,
): PunjabiC2FinalHandoffItem[] => c2FinalHandoffSet.filter((item) => item.focus === focus);
