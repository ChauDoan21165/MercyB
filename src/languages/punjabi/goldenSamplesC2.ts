// Punjabi C2 golden samples for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support golden samples, not certification, official
// placement, legal/HR/medical/safety advice, or native-reviewed authority.
// Native review is deferred. Shahmukhi is mentioned only for script awareness,
// not as a full course.

export type PunjabiC2GoldenFocus =
  | "nuanced_disagreement"
  | "negotiation"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "sensitive_topic_framing"
  | "advanced_register"
  | "community_discourse"
  | "professional_discourse"
  | "public_discourse";

export type PunjabiC2GoldenMode = "golden_sample" | "final_qa" | "integration_readiness";

export type PunjabiC2GoldenPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2GoldenQualityCheck = {
  check_vi: string;
  check_en: string;
  evidence_vi: string;
  evidence_en: string;
};

export type PunjabiC2GoldenTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2GoldenSample = {
  id: string;
  focus: PunjabiC2GoldenFocus;
  mode: PunjabiC2GoldenMode;
  title_vi: string;
  title_en: string;
  use_case_vi: string;
  use_case_en: string;
  prompt_vi: string;
  prompt_en: string;
  golden_gurmukhi: string;
  golden_romanization: string;
  golden_vi: string;
  golden_en: string;
  reusable_phrases: PunjabiC2GoldenPhrase[];
  quality_checks: PunjabiC2GoldenQualityCheck[];
  learner_trap?: PunjabiC2GoldenTrap;
  canada_practical?: boolean;
};

export const C2_GOLDEN_SAMPLES_DISCLAIMER = {
  vi: "Các mẫu chuẩn Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "These C2 Punjabi golden samples support study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const goldenSamplesC2: PunjabiC2GoldenSample[] = [
  {
    id: "pa_c2_golden_nuanced_disagreement",
    focus: "nuanced_disagreement",
    mode: "golden_sample",
    title_vi: "Bất đồng tinh tế có bằng chứng",
    title_en: "Nuanced disagreement with evidence",
    use_case_vi: "Khi bạn đồng ý với mục tiêu nhưng cần đặt câu hỏi về dữ liệu.",
    use_case_en: "When you agree with the goal but need to question the evidence.",
    prompt_vi: "Công nhận mục tiêu, nêu lo ngại, và mời làm rõ bằng chứng.",
    prompt_en: "Validate the goal, name the concern, and invite clearer evidence.",
    golden_gurmukhi:
      "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ, ਪਰ ਮੇਰੀ ਚਿੰਤਾ ਇਹ ਹੈ ਕਿ ਸਬੂਤ ਅਜੇ ਸਪਸ਼ਟ ਨਹੀਂ ਹਨ। ਜੇ ਸਬੂਤ ਹੋਰ ਸਪਸ਼ਟ ਹੋਣ ਤਾਂ ਸੁਝਾਅ ਹੋਰ ਮਜ਼ਬੂਤ ਹੋਵੇਗਾ।",
    golden_romanization:
      "maqsad naal main sahimat haan, par meri chinta ih hai ki sabut aje spasht nahin han. je sabut hor spasht hon taan sujhaa hor mazbut hovega.",
    golden_vi:
      "Tôi đồng ý với mục tiêu, nhưng điều tôi lo là bằng chứng vẫn chưa rõ. Nếu bằng chứng rõ hơn thì đề xuất sẽ mạnh hơn.",
    golden_en:
      "I agree with the goal, but my concern is that the evidence is still not clear. If the evidence is clearer, the proposal will be stronger.",
    reusable_phrases: [
      {
        gurmukhi: "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ",
        romanization: "maqsad naal main sahimat haan",
        vi: "Tôi đồng ý với mục tiêu.",
        en: "I agree with the goal.",
      },
      {
        gurmukhi: "ਸਬੂਤ ਹੋਰ ਸਪਸ਼ਟ ਹੋਣ",
        romanization: "sabut hor spasht hon",
        vi: "Bằng chứng rõ hơn.",
        en: "The evidence being clearer.",
      },
    ],
    quality_checks: [
      {
        check_vi: "Có công nhận trước phản biện không?",
        check_en: "Is there validation before challenge?",
        evidence_vi: "Có ਮਕਸਦ và ਸਬੂਤ.",
        evidence_en: "Includes ਮਕਸਦ and ਸਬੂਤ.",
      },
    ],
    learner_trap: {
      trap_vi: "Nói 'ý này sai' quá sớm.",
      trap_en: "Saying 'this is wrong' too early.",
      repair_vi: "Công nhận mục tiêu rồi giới hạn phản biện vào bằng chứng.",
      repair_en: "Validate the goal, then limit the challenge to evidence.",
    },
  },
  {
    id: "pa_c2_golden_negotiation_canada",
    focus: "negotiation",
    mode: "integration_readiness",
    title_vi: "Đàm phán lựa chọn tại dịch vụ công Canada",
    title_en: "Negotiate options at a Canadian public service desk",
    use_case_vi: "Khi giấy tờ chưa đủ nhưng bạn muốn hỏi bước tiếp theo.",
    use_case_en: "When documentation is incomplete and you need to ask for the next step.",
    prompt_vi: "Tôn trọng quy định, nêu cái đang có, và hỏi lựa chọn.",
    prompt_en: "Respect the rule, state what you have, and ask for options.",
    golden_gurmukhi:
      "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਅਤੇ ਪੁਸ਼ਟੀ ਵਾਲਾ ਈਮੇਲ ਹੈ; ਅਗਲਾ ਕਦਮ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
    golden_romanization:
      "mainu niyam di samajh hai. is vele mere kol copy ate pushti wala email hai; agla kadam ki ho sakda hai?",
    golden_vi:
      "Tôi hiểu quy định. Hiện tôi có bản sao và email xác nhận; bước tiếp theo có thể là gì?",
    golden_en:
      "I understand the rule. Right now I have a copy and a confirmation email; what could the next step be?",
    reusable_phrases: [
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
    quality_checks: [
      {
        check_vi: "Có tránh đòi ngoại lệ không?",
        check_en: "Does it avoid demanding an exception?",
        evidence_vi: "Có ਨਿਯਮ ਦੀ ਸਮਝ trước câu hỏi.",
        evidence_en: "Includes ਨਿਯਮ ਦੀ ਸਮਝ before the question.",
      },
    ],
    learner_trap: {
      trap_vi: "Chỉ nói 'tôi không có' rồi dừng lại.",
      trap_en: "Only saying 'I do not have it' and stopping.",
      repair_vi: "Nêu giấy tờ đang có rồi hỏi bước tiếp theo.",
      repair_en: "State available documents, then ask for the next step.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_golden_diplomacy_refusal",
    focus: "diplomacy",
    mode: "final_qa",
    title_vi: "Từ chối ngoại giao",
    title_en: "Diplomatic refusal",
    use_case_vi: "Khi bạn phải nói không mà vẫn giữ thiện chí.",
    use_case_en: "When you need to say no while preserving goodwill.",
    prompt_vi: "Cảm ơn, giới hạn ở hiện tại, và mở khả năng tương lai.",
    prompt_en: "Thank, limit the present, and leave future possibility open.",
    golden_gurmukhi:
      "ਤੁਹਾਡੇ ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਲਈ ਆਉਣਾ ਸੰਭਵ ਨਹੀਂ ਹੋਵੇਗਾ, ਪਰ ਅਗਲੇ ਮੌਕੇ ਲਈ ਖੁਸ਼ੀ ਰਹੇਗੀ।",
    golden_romanization:
      "tuhade sadde lai dhanvaad. is vele mere lai auna sambhav nahin hovega, par agle mauke lai khushi rahegi.",
    golden_vi:
      "Cảm ơn lời mời của anh/chị. Hiện tại tôi không thể đến, nhưng tôi sẽ rất vui cho dịp sau.",
    golden_en:
      "Thank you for the invitation. At the moment I will not be able to come, but I would be happy for a future opportunity.",
    reusable_phrases: [
      {
        gurmukhi: "ਤੁਹਾਡੇ ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ",
        romanization: "tuhade sadde lai dhanvaad",
        vi: "Cảm ơn lời mời của anh/chị.",
        en: "Thank you for the invitation.",
      },
      {
        gurmukhi: "ਇਸ ਵੇਲੇ ਸੰਭਵ ਨਹੀਂ ਹੋਵੇਗਾ",
        romanization: "is vele sambhav nahin hovega",
        vi: "Hiện tại sẽ không khả thi.",
        en: "At the moment it will not be possible.",
      },
    ],
    quality_checks: [
      {
        check_vi: "Có cảm ơn trước giới hạn không?",
        check_en: "Does thanks come before the limit?",
        evidence_vi: "ਧੰਨਵਾਦ đứng trước ਸੰਭਵ ਨਹੀਂ.",
        evidence_en: "ਧੰਨਵਾਦ appears before ਸੰਭਵ ਨਹੀਂ.",
      },
    ],
    learner_trap: {
      trap_vi: "Dịch thẳng 'I refuse' quá nặng.",
      trap_en: "Directly translating 'I refuse' sounds too heavy.",
      repair_vi: "Dùng ਇਸ ਵੇਲੇ và lời cảm ơn.",
      repair_en: "Use ਇਸ ਵੇਲੇ and thanks.",
    },
  },
  {
    id: "pa_c2_golden_mediation_both_sides",
    focus: "mediation",
    mode: "golden_sample",
    title_vi: "Hòa giải bằng cách tóm tắt hai phía",
    title_en: "Mediate by summarizing both sides",
    use_case_vi: "Khi hai bên nói khác nhau và cần nghe mình được hiểu.",
    use_case_en: "When both sides differ and need to hear that they are understood.",
    prompt_vi: "Nêu lo ngại của mỗi phía rồi đưa về làm rõ.",
    prompt_en: "Name each side's concern and bring the discussion back to clarification.",
    golden_gurmukhi:
      "ਇੱਕ ਪਾਸੇ ਸਮੇਂ ਦੀ ਚਿੰਤਾ ਹੈ, ਅਤੇ ਦੂਜੇ ਪਾਸੇ ਕੰਮ ਦੀ ਗੁਣਵੱਤਾ ਦੀ ਚਿੰਤਾ ਹੈ। ਆਓ ਦੋਵੇਂ ਗੱਲਾਂ ਨੂੰ ਸਾਫ਼ ਕਰੀਏ।",
    golden_romanization:
      "ikk pase same di chinta hai, ate duje pase kamm di gunvatta di chinta hai. aao dovein gallan nu saaf karie.",
    golden_vi:
      "Một phía lo về thời gian, phía kia lo về chất lượng công việc. Ta hãy làm rõ cả hai việc.",
    golden_en:
      "One side is concerned about time, and the other side is concerned about work quality. Let's clarify both points.",
    reusable_phrases: [
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
    quality_checks: [
      {
        check_vi: "Có cân bằng hai phía không?",
        check_en: "Does it balance both sides?",
        evidence_vi: "Có ਇੱਕ ਪਾਸੇ và ਦੂਜੇ ਪਾਸੇ.",
        evidence_en: "Includes ਇੱਕ ਪਾਸੇ and ਦੂਜੇ ਪਾਸੇ.",
      },
    ],
    learner_trap: {
      trap_vi: "Tóm tắt một bên như sự thật và bên kia như vấn đề.",
      trap_en: "Summarizing one side as fact and the other as the problem.",
      repair_vi: "Dùng cấu trúc song song cho cả hai phía.",
      repair_en: "Use parallel structure for both sides.",
    },
  },
  {
    id: "pa_c2_golden_deescalation",
    focus: "deescalation",
    mode: "integration_readiness",
    title_vi: "Hạ nhiệt bằng lượt nói",
    title_en: "De-escalate through turn-taking",
    use_case_vi: "Khi cuộc nói chuyện căng và mọi người nói chồng lên nhau.",
    use_case_en: "When the conversation is tense and people talk over each other.",
    prompt_vi: "Đề xuất quy trình nghe từng lượt và nhắc mục tiêu chung.",
    prompt_en: "Suggest a turn-taking process and remind everyone of the shared goal.",
    golden_gurmukhi:
      "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ। ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ, ਇਸ ਲਈ ਬਾਰੀ-ਬਾਰੀ ਗੱਲ ਕਰੀਏ।",
    golden_romanization:
      "aao ikk-ikk gall sunie. maqsad hall labhna hai, is lai baari-baari gall karie.",
    golden_vi:
      "Ta hãy nghe từng ý một. Mục tiêu là tìm giải pháp, vì vậy hãy nói lần lượt.",
    golden_en:
      "Let's hear one point at a time. The goal is to find a solution, so let's speak in turn.",
    reusable_phrases: [
      {
        gurmukhi: "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ",
        romanization: "aao ikk-ikk gall sunie",
        vi: "Ta hãy nghe từng ý một.",
        en: "Let's hear one point at a time.",
      },
      {
        gurmukhi: "ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ",
        romanization: "maqsad hall labhna hai",
        vi: "Mục tiêu là tìm giải pháp.",
        en: "The goal is to find a solution.",
      },
    ],
    quality_checks: [
      {
        check_vi: "Có tránh ra lệnh cảm xúc không?",
        check_en: "Does it avoid commanding emotion?",
        evidence_vi: "Có ਇੱਕ-ਇੱਕ hoặc ਬਾਰੀ-ਬਾਰੀ.",
        evidence_en: "Includes ਇੱਕ-ਇੱਕ or ਬਾਰੀ-ਬਾਰੀ.",
      },
    ],
    learner_trap: {
      trap_vi: "Nói 'bình tĩnh đi' như mệnh lệnh.",
      trap_en: "Saying 'calm down' as a command.",
      repair_vi: "Đề xuất quy trình nói lần lượt.",
      repair_en: "Suggest a turn-taking process.",
    },
  },
  {
    id: "pa_c2_golden_sensitive_topic",
    focus: "sensitive_topic_framing",
    mode: "final_qa",
    title_vi: "Đóng khung chủ đề nhạy cảm",
    title_en: "Frame a sensitive topic",
    use_case_vi: "Khi phân công vai trò mà không muốn dựa vào định kiến.",
    use_case_en: "When assigning roles without relying on stereotypes.",
    prompt_vi: "Dùng tiêu chí sở thích, thời gian, và sự thuận tiện.",
    prompt_en: "Use interest, availability, and comfort criteria.",
    golden_gurmukhi:
      "ਅਸੀਂ ਕੰਮ ਰੁਚੀ ਅਤੇ ਸਮੇਂ ਦੇ ਅਨੁਸਾਰ ਵੰਡ ਸਕਦੇ ਹਾਂ। ਜਿਸ ਨੂੰ ਸੁਵਿਧਾ ਹੋਵੇ, ਉਹ ਇਹ ਹਿੱਸਾ ਲੈ ਸਕਦਾ ਹੈ।",
    golden_romanization:
      "asin kamm ruchi ate same de anusaar vand sakde haan. jis nu suvidha hove, oh ih hissa lai sakda hai.",
    golden_vi:
      "Chúng ta có thể chia việc theo sở thích và thời gian. Ai thấy thuận tiện có thể nhận phần này.",
    golden_en:
      "We can divide the work by interest and availability. Whoever feels comfortable can take this part.",
    reusable_phrases: [
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
    quality_checks: [
      {
        check_vi: "Có tránh định kiến không?",
        check_en: "Does it avoid stereotypes?",
        evidence_vi: "Tiêu chí là ਰੁਚੀ, ਸਮੇਂ, và ਸੁਵਿਧਾ.",
        evidence_en: "Criteria are ਰੁਚੀ, ਸਮੇਂ, and ਸੁਵਿਧਾ.",
      },
    ],
    learner_trap: {
      trap_vi: "Gán việc theo tuổi, giới, gia đình, hoặc cộng đồng.",
      trap_en: "Assigning work by age, gender, family, or community.",
      repair_vi: "Dùng tiêu chí trung tính và quyền chọn.",
      repair_en: "Use neutral criteria and choice.",
    },
  },
  {
    id: "pa_c2_golden_advanced_register",
    focus: "advanced_register",
    mode: "golden_sample",
    title_vi: "Thông báo trang trọng vừa đủ",
    title_en: "Controlled formal notice",
    use_case_vi: "Khi cần thông báo thay đổi mà vẫn mở cửa cho câu hỏi.",
    use_case_en: "When announcing a change while leaving room for questions.",
    prompt_vi: "Nêu thay đổi rõ, giữ lịch sự, và mời hỏi lại.",
    prompt_en: "State the change clearly, stay polite, and invite questions.",
    golden_gurmukhi:
      "ਕਿਰਪਾ ਕਰਕੇ ਧਿਆਨ ਦਿਓ ਕਿ ਸਮਾਂ ਬਦਲਿਆ ਗਿਆ ਹੈ। ਜੇ ਕੋਈ ਸਵਾਲ ਹੋਵੇ ਤਾਂ ਸਾਨੂੰ ਦੱਸੋ।",
    golden_romanization:
      "kirpa karke dhiaan dio ki sama badlia gia hai. je koi sawal hove taan sanu dasso.",
    golden_vi:
      "Xin vui lòng lưu ý rằng thời gian đã được thay đổi. Nếu có câu hỏi, xin cho chúng tôi biết.",
    golden_en:
      "Please note that the time has been changed. If there is any question, please let us know.",
    reusable_phrases: [
      {
        gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਧਿਆਨ ਦਿਓ",
        romanization: "kirpa karke dhiaan dio",
        vi: "Xin vui lòng lưu ý.",
        en: "Please note.",
      },
      {
        gurmukhi: "ਜੇ ਕੋਈ ਸਵਾਲ ਹੋਵੇ",
        romanization: "je koi sawal hove",
        vi: "Nếu có câu hỏi.",
        en: "If there is any question.",
      },
    ],
    quality_checks: [
      {
        check_vi: "Có trang trọng nhưng không lạnh không?",
        check_en: "Is it formal without being cold?",
        evidence_vi: "Có ਕਿਰਪਾ ਕਰਕੇ and ਸਵਾਲ.",
        evidence_en: "Includes ਕਿਰਪਾ ਕਰਕੇ and ਸਵਾਲ.",
      },
    ],
  },
  {
    id: "pa_c2_golden_community_discourse_canada",
    focus: "community_discourse",
    mode: "integration_readiness",
    title_vi: "Tóm tắt quyết định cộng đồng ở Canada",
    title_en: "Summarize a community decision in Canada",
    use_case_vi: "Khi nhóm đồng ý một phần nhưng vẫn cần lấy ý kiến.",
    use_case_en: "When a group partly agrees but still needs input.",
    prompt_vi: "Tóm tắt đồng thuận và nêu bước lấy ý kiến tiếp theo.",
    prompt_en: "Summarize agreement and name the next input step.",
    golden_gurmukhi:
      "ਹੁਣ ਤੱਕ ਸਹਿਮਤੀ ਇਹ ਹੈ ਕਿ ਸਮਾਗਮ ਹਫ਼ਤੇ ਦੇ ਅੰਤ ਹੋਵੇ। ਅਗਲਾ ਕਦਮ ਦੋ ਤਾਰੀਖਾਂ ਤੇ ਰਾਇ ਲੈਣਾ ਹੈ।",
    golden_romanization:
      "hun takk sahimati ih hai ki samagam hafte de ant hove. agla kadam do tarikh'an te rai laina hai.",
    golden_vi:
      "Đến giờ, điểm đồng thuận là sự kiện vào cuối tuần. Bước tiếp theo là lấy ý kiến về hai ngày.",
    golden_en:
      "So far, the agreement is that the event should be on the weekend. The next step is to get views on two dates.",
    reusable_phrases: [
      {
        gurmukhi: "ਹੁਣ ਤੱਕ ਸਹਿਮਤੀ ਇਹ ਹੈ",
        romanization: "hun takk sahimati ih hai",
        vi: "Đến giờ, điểm đồng thuận là...",
        en: "So far, the agreement is...",
      },
      {
        gurmukhi: "ਅਗਲਾ ਕਦਮ",
        romanization: "agla kadam",
        vi: "Bước tiếp theo.",
        en: "The next step.",
      },
    ],
    quality_checks: [
      {
        check_vi: "Có tách đồng thuận khỏi bước tiếp theo không?",
        check_en: "Does it separate agreement from next step?",
        evidence_vi: "Có ਸਹਿਮਤੀ and ਅਗਲਾ ਕਦਮ.",
        evidence_en: "Includes ਸਹਿਮਤੀ and ਅਗਲਾ ਕਦਮ.",
      },
    ],
    canada_practical: true,
  },
  {
    id: "pa_c2_golden_professional_discourse",
    focus: "professional_discourse",
    mode: "final_qa",
    title_vi: "Sửa lỗi quy trình chuyên nghiệp",
    title_en: "Professional process repair",
    use_case_vi: "Khi có lỗi công việc và cần giữ trách nhiệm mà không đổ lỗi.",
    use_case_en: "When there is a work error and accountability is needed without blame.",
    prompt_vi: "Nêu quy trình, bước tiếp theo, và phòng lặp lại.",
    prompt_en: "Name process, next step, and prevention.",
    golden_gurmukhi:
      "ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਮੁੜ ਵੇਖੀਏ ਅਤੇ ਅਗਲਾ ਕਦਮ ਸਪਸ਼ਟ ਕਰੀਏ, ਤਾਂ ਜੋ ਇਹ ਗੱਲ ਦੁਬਾਰਾ ਨਾ ਹੋਵੇ।",
    golden_romanization:
      "prakiria nu mur vekhie ate agla kadam spasht karie, taan jo ih gall dubara na hove.",
    golden_vi:
      "Hãy xem lại quy trình và làm rõ bước tiếp theo để việc này không lặp lại.",
    golden_en:
      "Let's review the process and clarify the next step so this does not happen again.",
    reusable_phrases: [
      {
        gurmukhi: "ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਮੁੜ ਵੇਖੀਏ",
        romanization: "prakiria nu mur vekhie",
        vi: "Hãy xem lại quy trình.",
        en: "Let's review the process.",
      },
      {
        gurmukhi: "ਅਗਲਾ ਕਦਮ ਸਪਸ਼ਟ ਕਰੀਏ",
        romanization: "agla kadam spasht karie",
        vi: "Hãy làm rõ bước tiếp theo.",
        en: "Let's clarify the next step.",
      },
    ],
    quality_checks: [
      {
        check_vi: "Có tránh đổ lỗi cá nhân không?",
        check_en: "Does it avoid personal blame?",
        evidence_vi: "Có ਪ੍ਰਕਿਰਿਆ and ਅਗਲਾ ਕਦਮ.",
        evidence_en: "Includes ਪ੍ਰਕਿਰਿਆ and ਅਗਲਾ ਕਦਮ.",
      },
    ],
    learner_trap: {
      trap_vi: "Hỏi 'ai sai?' quá sớm.",
      trap_en: "Asking 'who was wrong?' too early.",
      repair_vi: "Chuyển về quy trình và bước tiếp theo.",
      repair_en: "Shift to process and next step.",
    },
  },
  {
    id: "pa_c2_golden_public_discourse",
    focus: "public_discourse",
    mode: "golden_sample",
    title_vi: "Thông báo công khai không gây hoang mang",
    title_en: "Public notice without alarm",
    use_case_vi: "Khi cần thông báo đổi lịch hoặc cập nhật cho nhóm lớn.",
    use_case_en: "When announcing a schedule change or update to a large group.",
    prompt_vi: "Nêu thay đổi, giữ giọng trung tính, và chỉ nơi xem cập nhật.",
    prompt_en: "State the change, keep neutral tone, and give update guidance.",
    golden_gurmukhi:
      "ਸਮੇਂ ਵਿੱਚ ਤਬਦੀਲੀ ਕੀਤੀ ਗਈ ਹੈ। ਤਾਜ਼ਾ ਜਾਣਕਾਰੀ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਸੁਨੇਹਾ ਵੇਖੋ।",
    golden_romanization:
      "same vich tabdili kiti gai hai. taza jaankari lai kirpa karke agla suneha vekho.",
    golden_vi:
      "Đã có thay đổi về thời gian. Để có thông tin mới nhất, xin xem tin nhắn tiếp theo.",
    golden_en:
      "A change has been made to the time. For the latest information, please check the next message.",
    reusable_phrases: [
      {
        gurmukhi: "ਸਮੇਂ ਵਿੱਚ ਤਬਦੀਲੀ ਕੀਤੀ ਗਈ ਹੈ",
        romanization: "same vich tabdili kiti gai hai",
        vi: "Đã có thay đổi về thời gian.",
        en: "A change has been made to the time.",
      },
      {
        gurmukhi: "ਤਾਜ਼ਾ ਜਾਣਕਾਰੀ ਲਈ",
        romanization: "taza jaankari lai",
        vi: "Để có thông tin mới nhất.",
        en: "For the latest information.",
      },
    ],
    quality_checks: [
      {
        check_vi: "Có rõ thay đổi và kênh cập nhật không?",
        check_en: "Does it clearly state change and update channel?",
        evidence_vi: "Có ਤਬਦੀਲੀ and ਤਾਜ਼ਾ ਜਾਣਕਾਰੀ.",
        evidence_en: "Includes ਤਬਦੀਲੀ and ਤਾਜ਼ਾ ਜਾਣਕਾਰੀ.",
      },
    ],
    learner_trap: {
      trap_vi: "Dùng từ kịch tính cho thay đổi nhỏ.",
      trap_en: "Using dramatic wording for a small change.",
      repair_vi: "Dùng giọng trung tính và kênh cập nhật.",
      repair_en: "Use neutral tone and update guidance.",
    },
    canada_practical: true,
  },
];

export const goldenSamplesC2ByFocus = (
  focus: PunjabiC2GoldenFocus,
): PunjabiC2GoldenSample[] => goldenSamplesC2.filter((sample) => sample.focus === focus);
