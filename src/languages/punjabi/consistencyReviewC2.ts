// Punjabi C2 consistency review for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support review only, not certification, official
// placement, legal/HR/medical/safety advice, or native-reviewed authority.
// Native review is deferred. Shahmukhi is mentioned only for script awareness,
// not as a full course.

export type PunjabiC2ConsistencyFocus =
  | "nuanced_disagreement"
  | "negotiation"
  | "mediation"
  | "deescalation"
  | "audience_adaptation"
  | "sensitive_topic_framing"
  | "advanced_register"
  | "community_discourse"
  | "professional_discourse"
  | "public_discourse"
  | "public_service";

export type PunjabiC2ConsistencyStyle =
  | "consistency_check"
  | "final_guardrail"
  | "integration_readiness"
  | "regression";

export type PunjabiC2ConsistencyPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2ConsistencyCheck = {
  check_vi: string;
  check_en: string;
  signal_vi: string;
  signal_en: string;
};

export type PunjabiC2ConsistencyTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2ConsistencyReview = {
  id: string;
  focus: PunjabiC2ConsistencyFocus;
  style: PunjabiC2ConsistencyStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  consistency_goal_vi: string;
  consistency_goal_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  review_phrases: PunjabiC2ConsistencyPhrase[];
  checks: PunjabiC2ConsistencyCheck[];
  learner_trap?: PunjabiC2ConsistencyTrap;
  canada_practical?: boolean;
};

export const C2_CONSISTENCY_REVIEW_DISCLAIMER = {
  vi: "Bộ rà soát nhất quán Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi consistency review supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const consistencyReviewC2: PunjabiC2ConsistencyReview[] = [
  {
    id: "pa_c2_consistency_nuanced_disagreement",
    focus: "nuanced_disagreement",
    style: "consistency_check",
    title_vi: "Nhất quán khi bất đồng tinh tế",
    title_en: "Consistency for nuanced disagreement",
    scenario_vi: "Bạn cần phản biện mà vẫn giữ mạch lịch sự trong họp hoặc lớp.",
    scenario_en: "You need to challenge a point while staying polite in a meeting or class.",
    consistency_goal_vi: "Giữ cấu trúc công nhận trước, góp ý sau, ở mọi câu.",
    consistency_goal_en: "Keep the validate-first, critique-second structure across the reply.",
    sample_gurmukhi:
      "ਮੈਂ ਮੁੱਢਲੇ ਮਕਸਦ ਨਾਲ ਸਹਿਮਤ ਹਾਂ, ਪਰ ਅਸੀਂ ਅਜੇ ਇਕ ਹੋਰ ਵਾਰ ਡਾਟਾ ਵੇਖ ਲਵਾਂ ਤਾਂ ਵਧੀਆ ਰਹੇਗਾ।",
    sample_romanization:
      "main muddle maqsad naal sahimat haan, par asin aje ikk hor vaar data vekh lavan tan vadhia rahega.",
    sample_vi:
      "Tôi đồng ý với mục tiêu chính, nhưng sẽ tốt hơn nếu chúng ta xem dữ liệu thêm một lần nữa.",
    sample_en:
      "I agree with the main goal, but it would be better if we looked at the data one more time.",
    review_phrases: [
      {
        gurmukhi: "ਮੈਂ ਮੁੱਢਲੇ ਮਕਸਦ ਨਾਲ ਸਹਿਮਤ ਹਾਂ",
        romanization: "main muddle maqsad naal sahimat haan",
        vi: "Tôi đồng ý với mục tiêu chính.",
        en: "I agree with the main goal.",
      },
      {
        gurmukhi: "ਇਕ ਹੋਰ ਵਾਰ ਡਾਟਾ ਵੇਖ ਲਵਾਂ",
        romanization: "ikk hor vaar data vekh lavan",
        vi: "Hãy xem dữ liệu thêm một lần nữa.",
        en: "Let's look at the data one more time.",
      },
    ],
    checks: [
      {
        check_vi: "Có công nhận rồi mới góp ý không?",
        check_en: "Does it validate before it critiques?",
        signal_vi: "Có ਸਹਿਮਤ ਹਾਂ rồi mới nói ਵੇਖ ਲਵਾਂ.",
        signal_en: "Includes agree first and let's look again later.",
      },
    ],
    learner_trap: {
      trap_vi: "Mở đầu bằng phản bác thẳng làm câu mất cân bằng.",
      trap_en: "Opening with a blunt rebuttal makes the reply feel off-balance.",
      repair_vi: "Giữ công nhận ở đầu và phản biện ở sau.",
      repair_en: "Keep validation at the front and critique after it.",
    },
  },
  {
    id: "pa_c2_consistency_negotiation_canada",
    focus: "negotiation",
    style: "final_guardrail",
    title_vi: "Ranh giới nhất quán khi đàm phán ở Canada",
    title_en: "Consistent boundaries in Canada negotiation",
    scenario_vi: "Bạn chỉ có bản sao và email xác nhận ở quầy dịch vụ công.",
    scenario_en: "You only have a copy and a confirmation email at a public-service desk.",
    consistency_goal_vi: "Nói rõ cái có, hỏi bước tiếp theo, và không trượt sang yêu cầu ngoại lệ.",
    consistency_goal_en: "State what you have, ask for the next step, and avoid drifting into exception requests.",
    sample_gurmukhi:
      "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਅਤੇ ਪੁਸ਼ਟੀ ਵਾਲਾ ਈਮੇਲ ਹੈ; ਅਗਲਾ ਕਦਮ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
    sample_romanization:
      "mainu niyam di samajh hai. is vele mere kol copy ate pushti wala email hai; agla kadam ki ho sakda hai?",
    sample_vi:
      "Tôi hiểu quy định. Hiện tôi có bản sao và email xác nhận; bước tiếp theo có thể là gì?",
    sample_en:
      "I understand the rule. Right now I have a copy and a confirmation email; what could the next step be?",
    review_phrases: [
      {
        gurmukhi: "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ",
        romanization: "mainu niyam di samajh hai",
        vi: "Tôi hiểu quy định.",
        en: "I understand the rule.",
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
        check_vi: "Có nói cái đang có trước khi hỏi không?",
        check_en: "Does it name what you have before asking?",
        signal_vi: "Có bản sao và email xác nhận.",
        signal_en: "Includes copy and confirmation email.",
      },
    ],
    learner_trap: {
      trap_vi: "Đòi ngoại lệ ngay làm câu mất nhịp.",
      trap_en: "Asking for an exception right away breaks the tone.",
      repair_vi: "Nêu giấy tờ có rồi mới hỏi bước tiếp theo.",
      repair_en: "State the documents you have, then ask for the next step.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_consistency_mediation",
    focus: "mediation",
    style: "integration_readiness",
    title_vi: "Sẵn sàng hòa giải mà không chọn phe",
    title_en: "Ready to mediate without taking sides",
    scenario_vi: "Hai phía bất đồng và bạn phải tóm tắt lại cho rõ.",
    scenario_en: "Two sides disagree and you need to restate the issue clearly.",
    consistency_goal_vi: "Giữ hai phía song song và quay về tiêu chí chung.",
    consistency_goal_en: "Keep both sides parallel and return to shared criteria.",
    sample_gurmukhi:
      "ਇੱਕ ਪਾਸੇ ਸਮੇਂ ਦੀ ਚਿੰਤਾ ਹੈ, ਦੂਜੇ ਪਾਸੇ ਗੁਣਵੱਤਾ ਦੀ ਚਿੰਤਾ ਹੈ। ਆਓ ਦੋਵੇਂ ਗੱਲਾਂ ਨੂੰ ਇੱਕੋ ਮਾਪਦੰਡ ਨਾਲ ਵੇਖੀਏ।",
    sample_romanization:
      "ikk pase same di chinta hai, duje pase gunvatta di chinta hai. aao dovein gallan nu ikko mapdand naal vekhie.",
    sample_vi:
      "Một phía lo về thời gian, phía kia lo về chất lượng. Hãy xem cả hai theo cùng một tiêu chí.",
    sample_en:
      "One side is concerned about time, and the other side is concerned about quality. Let's look at both using the same criteria.",
    review_phrases: [
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
        check_vi: "Có đặt hai phía song song không?",
        check_en: "Does it place both sides in parallel?",
        signal_vi: "Có ਇੱਕ ਪਾਸੇ và ਦੂਜੇ ਪਾਸੇ.",
        signal_en: "Includes one side and the other side.",
      },
    ],
    learner_trap: {
      trap_vi: "Biến hòa giải thành phán quyết ai đúng.",
      trap_en: "Turning mediation into a verdict on who is right.",
      repair_vi: "Giữ song song và quay về tiêu chí chung.",
      repair_en: "Keep the parallel structure and return to shared criteria.",
    },
  },
  {
    id: "pa_c2_consistency_deescalation",
    focus: "deescalation",
    style: "regression",
    title_vi: "Thụt lùi an toàn về hạ nhiệt",
    title_en: "Safe regression to de-escalation",
    scenario_vi: "Cuộc họp bắt đầu căng và mọi người nói chồng lên nhau.",
    scenario_en: "A meeting is getting tense and people are speaking over each other.",
    consistency_goal_vi: "Chuyển từ cảm xúc sang quy trình một cách ổn định.",
    consistency_goal_en: "Shift from emotion to process in a stable way.",
    sample_gurmukhi:
      "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ। ਸਾਡਾ ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ, ਇਸ ਲਈ ਬਾਰੀ-ਬਾਰੀ ਗੱਲ ਕਰੀਏ।",
    sample_romanization:
      "aao ikk-ikk gall sunie. sada maqsad hall labhna hai, is lai baari-baari gall karie.",
    sample_vi:
      "Ta hãy nghe từng ý một. Mục tiêu của chúng ta là tìm giải pháp, vì vậy hãy nói lần lượt.",
    sample_en:
      "Let's hear one point at a time. Our goal is to find a solution, so let's speak in turn.",
    review_phrases: [
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
    id: "pa_c2_consistency_audience_adaptation",
    focus: "audience_adaptation",
    style: "consistency_check",
    title_vi: "Nhất quán khi đổi theo người nghe",
    title_en: "Consistency when adapting to the audience",
    scenario_vi: "Bạn phải đổi từ nói với bạn bè sang nói với người lớn tuổi hoặc đồng nghiệp.",
    scenario_en: "You need to shift from friends to older adults or coworkers.",
    consistency_goal_vi: "Giữ ý chính nhưng đổi mức trang trọng cho đúng người nghe.",
    consistency_goal_en: "Keep the core message while adjusting the formality level to the audience.",
    sample_gurmukhi:
      "ਜੇ ਮੈਂ ਥੋੜ੍ਹਾ ਸਧਾਰਨ ਤਰੀਕੇ ਨਾਲ ਕਹਾਂ, ਤਾਂ ਮੁੱਖ ਗੱਲ ਇਹ ਹੈ ਕਿ ਅਸੀਂ ਅੱਜ ਹੀ ਸਮਾਂ-ਸੂਚੀ ਸਾਫ਼ ਕਰਨੀ ਹੈ।",
    sample_romanization:
      "je main thorra sadharan tarike naal kahan, tan mukh gall ih hai ki asin ajj hi sama-suchi saf karni hai.",
    sample_vi:
      "Nếu tôi nói theo cách đơn giản hơn, ý chính là hôm nay chúng ta cần làm rõ lịch trình.",
    sample_en:
      "If I say it more simply, the main point is that we need to clarify the schedule today.",
    review_phrases: [
      {
        gurmukhi: "ਜੇ ਮੈਂ ਥੋੜ੍ਹਾ ਸਧਾਰਨ ਤਰੀਕੇ ਨਾਲ ਕਹਾਂ",
        romanization: "je main thorra sadharan tarike naal kahan",
        vi: "Nếu tôi nói theo cách đơn giản hơn.",
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
        check_vi: "Có giữ ý chính khi đổi mức trang trọng không?",
        check_en: "Does it keep the core message while changing formality?",
        signal_vi: "Có ਮੁੱਖ ਗੱਲ và đơn giản hơn.",
        signal_en: "Includes main point and simpler wording.",
      },
    ],
    learner_trap: {
      trap_vi: "Đổi giọng nhưng làm mất nội dung.",
      trap_en: "Changing tone while losing the message.",
      repair_vi: "Giữ ý chính rồi mới chỉnh register.",
      repair_en: "Keep the core message, then adjust register.",
    },
  },
  {
    id: "pa_c2_consistency_sensitive_framing",
    focus: "sensitive_topic_framing",
    style: "final_guardrail",
    title_vi: "Khung an toàn cho chủ đề nhạy cảm",
    title_en: "Safe framing for sensitive topics",
    scenario_vi: "Cuộc trò chuyện chạm vào chính trị, tôn giáo, tiền bạc, hoặc danh tính cá nhân.",
    scenario_en: "The conversation touches politics, religion, money, or personal identity.",
    consistency_goal_vi: "Nhận ra độ nhạy cảm và kéo lại phần liên quan đến nhiệm vụ.",
    consistency_goal_en: "Recognize the sensitivity and bring the discussion back to the task-relevant part.",
    sample_gurmukhi:
      "ਇਹ ਵਿਸ਼ਾ ਸੰਵੇਦਨਸ਼ੀਲ ਹੈ, ਇਸ ਲਈ ਆਓ ਕੰਮ ਵਾਲੇ ਹਿੱਸੇ ਤੇ ਧਿਆਨ ਦੇਈਏ।",
    sample_romanization:
      "ih visha sanvedansheel hai, is lai aao kamm wale hisse te dhiaan deie.",
    sample_vi:
      "Chủ đề này nhạy cảm, vì vậy ta hãy tập trung vào phần công việc.",
    sample_en:
      "This topic is sensitive, so let's focus on the work-related part.",
    review_phrases: [
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
        check_vi: "Có nêu ranh giới ngắn và không phán xét không?",
        check_en: "Does it set a short boundary without judgment?",
        signal_vi: "Có ਸੰਵੇਦਨਸ਼ੀਲ và ਕੰਮ ਵਾਲੇ ਹਿੱਸੇ.",
        signal_en: "Includes sensitive topic and work-related part.",
      },
    ],
    learner_trap: {
      trap_vi: "Đi sâu vào tranh luận khi chỉ cần giữ an toàn chủ đề.",
      trap_en: "Going too deep into debate when only topic safety is needed.",
      repair_vi: "Đặt ranh giới ngắn rồi chuyển hướng.",
      repair_en: "Set a short boundary and redirect.",
    },
  },
  {
    id: "pa_c2_consistency_advanced_register",
    focus: "advanced_register",
    style: "integration_readiness",
    title_vi: "Độ trang trọng nâng cao cho email chuyên nghiệp",
    title_en: "Advanced register for professional email",
    scenario_vi: "Bạn viết thư cho trường, chỗ làm, hoặc dịch vụ cộng đồng ở Canada.",
    scenario_en: "You are writing to a school, workplace, or community service in Canada.",
    consistency_goal_vi: "Giữ giọng lịch sự, rõ ý, và không quá khô.",
    consistency_goal_en: "Keep the tone polite, clear, and not overly stiff.",
    sample_gurmukhi:
      "ਤੁਹਾਡੇ ਸਮੇਂ ਅਤੇ ਸਹਿਯੋਗ ਲਈ ਧੰਨਵਾਦ। ਜੇ ਹੋ ਸਕੇ, ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੱਸ ਦਿਓ।",
    sample_romanization:
      "tuhade same ate sahiyog lai dhanvaad. je ho sake, kirpa karke agla kadam dass deo.",
    sample_vi:
      "Cảm ơn vì thời gian và sự hỗ trợ của anh/chị. Nếu được, xin cho biết bước tiếp theo.",
    sample_en:
      "Thank you for your time and support. If possible, please let me know the next step.",
    review_phrases: [
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
        check_vi: "Có đủ lịch sự mà vẫn rõ ràng không?",
        check_en: "Is it polite while still being clear?",
        signal_vi: "Có ਧੰਨਵਾਦ và ਅਗਲਾ ਕਦਮ.",
        signal_en: "Includes thanks and next step.",
      },
    ],
    learner_trap: {
      trap_vi: "Quá trang trọng nên nghe xa cách.",
      trap_en: "So formal that it sounds distant.",
      repair_vi: "Giữ câu ngắn, lịch sự, và có yêu cầu rõ.",
      repair_en: "Keep it short, polite, and explicitly useful.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_consistency_community_discourse",
    focus: "community_discourse",
    style: "regression",
    title_vi: "Quay lại quy trình trong thảo luận cộng đồng",
    title_en: "Return to process in community discussion",
    scenario_vi: "Cuộc thảo luận nhóm bị kéo sang chuyện cá nhân.",
    scenario_en: "A group discussion is drifting into personal matters.",
    consistency_goal_vi: "Kéo mọi người về tiêu chí chung, không tăng nhiệt.",
    consistency_goal_en: "Bring everyone back to shared criteria without raising the temperature.",
    sample_gurmukhi:
      "ਚਲੋ ਅਸੀਂ ਮਾਪਦੰਡਾਂ ਤੇ ਵਾਪਸ ਆਈਏ। ਇਸ ਨਾਲ ਫੈਸਲਾ ਸਭ ਲਈ ਸਾਫ਼ ਰਹੇਗਾ।",
    sample_romanization:
      "chalo asin mapdandan te vapas aie. is naal faisla sabh lai saf rahega.",
    sample_vi:
      "Chúng ta hãy quay lại các tiêu chí. Như vậy quyết định sẽ rõ cho mọi người.",
    sample_en:
      "Let's return to the criteria. That will keep the decision clear for everyone.",
    review_phrases: [
      {
        gurmukhi: "ਮਾਪਦੰਡਾਂ ਤੇ ਵਾਪਸ ਆਈਏ",
        romanization: "mapdandan te vapas aie",
        vi: "Hãy quay lại các tiêu chí.",
        en: "Let's return to the criteria.",
      },
      {
        gurmukhi: "ਫੈਸਲਾ ਸਭ ਲਈ ਸਾਫ਼ ਰਹੇਗਾ",
        romanization: "faisla sabh lai saf rahega",
        vi: "Quyết định sẽ rõ cho mọi người.",
        en: "The decision will stay clear for everyone.",
      },
    ],
    checks: [
      {
        check_vi: "Có nhắc về tiêu chí chung không?",
        check_en: "Does it refer back to shared criteria?",
        signal_vi: "Có ਮਾਪਦੰਡਾਂ ਤੇ ਵਾਪਸ ਆਈਏ.",
        signal_en: "Includes return to criteria.",
      },
    ],
    learner_trap: {
      trap_vi: "Bỏ qua tiêu chí và nói theo cảm xúc.",
      trap_en: "Skipping criteria and speaking from emotion.",
      repair_vi: "Nhắc lại tiêu chí rồi mới kết luận.",
      repair_en: "Restate the criteria before concluding.",
    },
  },
  {
    id: "pa_c2_consistency_professional_discourse",
    focus: "professional_discourse",
    style: "final_guardrail",
    title_vi: "Ranh giới nhất quán trong môi trường chuyên nghiệp",
    title_en: "Consistent guardrails in professional discourse",
    scenario_vi: "Bạn góp ý cho đồng nghiệp mà không làm mất mặt ai.",
    scenario_en: "You are giving feedback to a coworker without causing embarrassment.",
    consistency_goal_vi: "Công nhận nỗ lực, nêu điểm cần chỉnh, rồi đưa hướng đi tiếp.",
    consistency_goal_en: "Acknowledge effort, name the adjustment, then give the next step.",
    sample_gurmukhi:
      "ਤੁਹਾਡਾ ਮਸੌਦਾ ਵਧੀਆ ਹੈ; ਸਿਰਫ਼ ਇਹ ਹਿੱਸਾ ਥੋੜ੍ਹਾ ਸਾਫ਼ ਕਰੀਏ ਤਾਂ ਸੁਨੇਹਾ ਹੋਰ ਮਜ਼ਬੂਤ ਹੋਵੇਗਾ।",
    sample_romanization:
      "tuhada masoda vadhia hai; sirf ih hissa thorra saf kariye tan sandesha hor majboot hovega.",
    sample_vi:
      "Bản nháp của bạn khá tốt; chỉ cần làm rõ phần này hơn thì thông điệp sẽ mạnh hơn.",
    sample_en:
      "Your draft is good; if we just make this part clearer, the message will be stronger.",
    review_phrases: [
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
    id: "pa_c2_consistency_public_discourse",
    focus: "public_discourse",
    style: "consistency_check",
    title_vi: "Nhất quán trong phát biểu công khai",
    title_en: "Consistency in public remarks",
    scenario_vi: "Bạn phát biểu trước nhóm lớn hoặc trả lời trước công chúng.",
    scenario_en: "You are speaking to a large group or answering in public.",
    consistency_goal_vi: "Giữ cùng giọng, cùng mức lịch sự, và cùng ý chính từ đầu đến cuối.",
    consistency_goal_en: "Keep the same tone, the same politeness level, and the same main point throughout.",
    sample_gurmukhi:
      "ਅਸੀਂ ਸਾਰੇ ਲਈ ਸਾਫ਼ ਅਤੇ ਸਲੋਣਾ ਸੁਨੇਹਾ ਰੱਖਣਾ ਚਾਹੁੰਦੇ ਹਾਂ: ਪਹਿਲਾਂ ਸੁਣੀਏ, ਫਿਰ ਅੱਗੇ ਵਧੀਏ।",
    sample_romanization:
      "asin sare lai saf ate salona sandesha rakhna chahunde haan: pehlan suniye, fir agge vadhiye.",
    sample_vi:
      "Chúng ta muốn giữ một thông điệp rõ ràng và dễ nghe cho الجميع: hãy nghe trước rồi hãy tiến tiếp.",
    sample_en:
      "We want to keep a clear and approachable message for everyone: listen first, then move forward.",
    review_phrases: [
      {
        gurmukhi: "ਸਾਫ਼ ਅਤੇ ਸਲੋਣਾ ਸੁਨੇਹਾ",
        romanization: "saf ate salona sandesha",
        vi: "Thông điệp rõ ràng và dễ nghe.",
        en: "Clear and approachable message.",
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
        signal_vi: "Có ਸਾਫ਼, ਸਲੋਣਾ, ਪਹਿਲਾਂ ਸੁਣੀਏ.",
        signal_en: "Includes clear, approachable, and listen first.",
      },
    ],
    learner_trap: {
      trap_vi: "Đang nói công khai nhưng đổi giọng liên tục.",
      trap_en: "Changing tone repeatedly in a public setting.",
      repair_vi: "Chọn một mức lịch sự rồi giữ nguyên đến hết.",
      repair_en: "Choose one politeness level and keep it to the end.",
    },
  },
  {
    id: "pa_c2_consistency_public_service",
    focus: "public_service",
    style: "integration_readiness",
    title_vi: "Sẵn sàng khi nói với dịch vụ công",
    title_en: "Ready for public-service interaction",
    scenario_vi: "Bạn đang ở quầy dịch vụ và chỉ có bản sao cùng email xác nhận.",
    scenario_en: "You are at a service desk with only a copy and a confirmation email.",
    consistency_goal_vi: "Nói theo quy trình: cái có, cái cần, và bước kế tiếp.",
    consistency_goal_en: "Follow the process: what you have, what you need, and the next step.",
    sample_gurmukhi:
      "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ। ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਅਤੇ ਪੁਸ਼ਟੀ ਵਾਲਾ ਈਮੇਲ ਹੈ; ਅਗਲਾ ਕਦਮ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
    sample_romanization:
      "mainu niyam di samajh hai. mere kol copy ate pushti wala email hai; agla kadam ki ho sakda hai?",
    sample_vi:
      "Tôi hiểu quy định. Tôi có bản sao và email xác nhận; bước tiếp theo có thể là gì?",
    sample_en:
      "I understand the rule. I have a copy and a confirmation email; what could the next step be?",
    review_phrases: [
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

export const consistencyReviewC2ByFocus = (
  focus: PunjabiC2ConsistencyFocus,
): PunjabiC2ConsistencyReview[] => consistencyReviewC2.filter((item) => item.focus === focus);
