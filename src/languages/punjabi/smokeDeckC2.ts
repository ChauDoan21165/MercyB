// Punjabi C2 smoke deck for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support smoke checks, not certification, official
// placement, legal/HR/medical/safety advice, or native-reviewed authority.
// Native review is deferred. Shahmukhi is mentioned only for script awareness,
// not as a full course.

export type PunjabiC2SmokeFocus =
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

export type PunjabiC2SmokeMode = "smoke_check" | "final_qa" | "integration_readiness";

export type PunjabiC2SmokePhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2SmokeExpected = {
  must_include_vi: string;
  must_include_en: string;
  avoid_vi: string;
  avoid_en: string;
};

export type PunjabiC2SmokeTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2SmokeCard = {
  id: string;
  focus: PunjabiC2SmokeFocus;
  mode: PunjabiC2SmokeMode;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  prompt_vi: string;
  prompt_en: string;
  model_gurmukhi: string;
  model_romanization: string;
  model_vi: string;
  model_en: string;
  quick_phrases: PunjabiC2SmokePhrase[];
  expected: PunjabiC2SmokeExpected;
  learner_trap?: PunjabiC2SmokeTrap;
  canada_practical?: boolean;
};

export const C2_SMOKE_DECK_DISCLAIMER = {
  vi: "Bộ kiểm tra nhanh Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi smoke deck supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const smokeDeckC2: PunjabiC2SmokeCard[] = [
  {
    id: "pa_c2_smoke_nuanced_disagreement",
    focus: "nuanced_disagreement",
    mode: "smoke_check",
    title_vi: "Kiểm tra bất đồng có sắc thái",
    title_en: "Smoke check nuanced disagreement",
    scenario_vi: "Bạn đồng ý mục tiêu nhưng thấy bằng chứng chưa rõ.",
    scenario_en: "You agree with the goal but think the evidence is unclear.",
    prompt_vi: "Công nhận mục tiêu rồi nêu lo ngại về bằng chứng.",
    prompt_en: "Validate the goal, then raise the concern about evidence.",
    model_gurmukhi:
      "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ, ਪਰ ਮੇਰੀ ਚਿੰਤਾ ਇਹ ਹੈ ਕਿ ਸਬੂਤ ਅਜੇ ਸਪਸ਼ਟ ਨਹੀਂ ਹਨ।",
    model_romanization:
      "maqsad naal main sahimat haan, par meri chinta ih hai ki sabut aje spasht nahin han.",
    model_vi:
      "Tôi đồng ý với mục tiêu, nhưng điều tôi lo là bằng chứng vẫn chưa rõ.",
    model_en:
      "I agree with the goal, but my concern is that the evidence is still not clear.",
    quick_phrases: [
      {
        gurmukhi: "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ",
        romanization: "maqsad naal main sahimat haan",
        vi: "Tôi đồng ý với mục tiêu.",
        en: "I agree with the goal.",
      },
      {
        gurmukhi: "ਮੇਰੀ ਚਿੰਤਾ ਇਹ ਹੈ",
        romanization: "meri chinta ih hai",
        vi: "Điều tôi lo là...",
        en: "My concern is...",
      },
    ],
    expected: {
      must_include_vi: "Công nhận + lo ngại cụ thể.",
      must_include_en: "Validation plus a specific concern.",
      avoid_vi: "Không mở đầu bằng 'sai'.",
      avoid_en: "Do not open with 'wrong'.",
    },
    learner_trap: {
      trap_vi: "Phản biện vào người nói.",
      trap_en: "Challenging the speaker personally.",
      repair_vi: "Chuyển về ਸਬੂਤ hoặc lập luận.",
      repair_en: "Shift to ਸਬੂਤ or reasoning.",
    },
  },
  {
    id: "pa_c2_smoke_negotiation_canada",
    focus: "negotiation",
    mode: "integration_readiness",
    title_vi: "Kiểm tra đàm phán dịch vụ công Canada",
    title_en: "Smoke check Canadian public-service negotiation",
    scenario_vi: "Bạn thiếu bản gốc nhưng có bản sao và email xác nhận.",
    scenario_en: "You lack the original but have a copy and confirmation email.",
    prompt_vi: "Tôn trọng quy định và hỏi bước tiếp theo.",
    prompt_en: "Respect the rule and ask for the next step.",
    model_gurmukhi:
      "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਅਤੇ ਪੁਸ਼ਟੀ ਵਾਲਾ ਈਮੇਲ ਹੈ; ਅਗਲਾ ਕਦਮ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
    model_romanization:
      "mainu niyam di samajh hai. is vele mere kol copy ate pushti wala email hai; agla kadam ki ho sakda hai?",
    model_vi:
      "Tôi hiểu quy định. Hiện tôi có bản sao và email xác nhận; bước tiếp theo có thể là gì?",
    model_en:
      "I understand the rule. Right now I have a copy and a confirmation email; what could the next step be?",
    quick_phrases: [
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
    expected: {
      must_include_vi: "Quy định + giấy tờ đang có + bước tiếp theo.",
      must_include_en: "Rule + available document + next step.",
      avoid_vi: "Không đòi ngoại lệ.",
      avoid_en: "Do not demand an exception.",
    },
    learner_trap: {
      trap_vi: "Chỉ nói mình không có giấy tờ.",
      trap_en: "Only saying that you do not have the document.",
      repair_vi: "Nêu cái có rồi hỏi bước tiếp theo.",
      repair_en: "State what you have, then ask for the next step.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_smoke_diplomacy",
    focus: "diplomacy",
    mode: "final_qa",
    title_vi: "Kiểm tra từ chối ngoại giao",
    title_en: "Smoke check diplomatic refusal",
    scenario_vi: "Bạn không thể nhận lời mời nhưng muốn giữ thiện chí.",
    scenario_en: "You cannot accept an invitation but want to preserve goodwill.",
    prompt_vi: "Cảm ơn, giới hạn hiện tại, mở dịp sau.",
    prompt_en: "Thank, set the present limit, leave a future opening.",
    model_gurmukhi:
      "ਤੁਹਾਡੇ ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਲਈ ਆਉਣਾ ਸੰਭਵ ਨਹੀਂ ਹੋਵੇਗਾ, ਪਰ ਅਗਲੇ ਮੌਕੇ ਲਈ ਖੁਸ਼ੀ ਰਹੇਗੀ।",
    model_romanization:
      "tuhade sadde lai dhanvaad. is vele mere lai auna sambhav nahin hovega, par agle mauke lai khushi rahegi.",
    model_vi:
      "Cảm ơn lời mời của anh/chị. Hiện tại tôi không thể đến, nhưng tôi sẽ rất vui cho dịp sau.",
    model_en:
      "Thank you for the invitation. At the moment I will not be able to come, but I would be happy for a future opportunity.",
    quick_phrases: [
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
    expected: {
      must_include_vi: "Cảm ơn + giới hạn + thiện chí tương lai.",
      must_include_en: "Thanks + limit + future goodwill.",
      avoid_vi: "Không dùng 'tôi từ chối' quá cứng.",
      avoid_en: "Avoid a stiff 'I refuse'.",
    },
    learner_trap: {
      trap_vi: "Từ chối quá ngắn làm mất quan hệ.",
      trap_en: "Refusing too briefly damages goodwill.",
      repair_vi: "Thêm ਧੰਨਵਾਦ and ਅਗਲਾ ਮੌਕਾ.",
      repair_en: "Add ਧੰਨਵਾਦ and ਅਗਲਾ ਮੌਕਾ.",
    },
  },
  {
    id: "pa_c2_smoke_mediation",
    focus: "mediation",
    mode: "smoke_check",
    title_vi: "Kiểm tra hòa giải hai phía",
    title_en: "Smoke check two-sided mediation",
    scenario_vi: "Hai bên bất đồng về thời gian và chất lượng.",
    scenario_en: "Two sides disagree about time and quality.",
    prompt_vi: "Tóm tắt cả hai phía mà không chọn phe.",
    prompt_en: "Summarize both sides without taking sides.",
    model_gurmukhi:
      "ਇੱਕ ਪਾਸੇ ਸਮੇਂ ਦੀ ਚਿੰਤਾ ਹੈ, ਅਤੇ ਦੂਜੇ ਪਾਸੇ ਕੰਮ ਦੀ ਗੁਣਵੱਤਾ ਦੀ ਚਿੰਤਾ ਹੈ। ਆਓ ਦੋਵੇਂ ਗੱਲਾਂ ਨੂੰ ਸਾਫ਼ ਕਰੀਏ।",
    model_romanization:
      "ikk pase same di chinta hai, ate duje pase kamm di gunvatta di chinta hai. aao dovein gallan nu saaf karie.",
    model_vi:
      "Một phía lo về thời gian, phía kia lo về chất lượng công việc. Ta hãy làm rõ cả hai việc.",
    model_en:
      "One side is concerned about time, and the other side is concerned about work quality. Let's clarify both points.",
    quick_phrases: [
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
    expected: {
      must_include_vi: "Hai phía + làm rõ.",
      must_include_en: "Both sides + clarification.",
      avoid_vi: "Không chọn phe.",
      avoid_en: "Do not take a side.",
    },
    learner_trap: {
      trap_vi: "Tóm tắt một bên như đúng và bên kia như sai.",
      trap_en: "Summarizing one side as right and the other as wrong.",
      repair_vi: "Dùng cấu trúc song song.",
      repair_en: "Use parallel structure.",
    },
  },
  {
    id: "pa_c2_smoke_deescalation",
    focus: "deescalation",
    mode: "integration_readiness",
    title_vi: "Kiểm tra hạ nhiệt",
    title_en: "Smoke check de-escalation",
    scenario_vi: "Mọi người nói chồng lên nhau trong cuộc họp cộng đồng.",
    scenario_en: "People are speaking over each other in a community meeting.",
    prompt_vi: "Đề xuất nghe từng lượt và nhắc mục tiêu chung.",
    prompt_en: "Suggest turn-taking and remind everyone of the shared goal.",
    model_gurmukhi:
      "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ। ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ, ਇਸ ਲਈ ਬਾਰੀ-ਬਾਰੀ ਗੱਲ ਕਰੀਏ।",
    model_romanization:
      "aao ikk-ikk gall sunie. maqsad hall labhna hai, is lai baari-baari gall karie.",
    model_vi:
      "Ta hãy nghe từng ý một. Mục tiêu là tìm giải pháp, vì vậy hãy nói lần lượt.",
    model_en:
      "Let's hear one point at a time. The goal is to find a solution, so let's speak in turn.",
    quick_phrases: [
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
    expected: {
      must_include_vi: "Lượt nói + mục tiêu chung.",
      must_include_en: "Turn-taking + shared goal.",
      avoid_vi: "Không ra lệnh 'bình tĩnh'.",
      avoid_en: "Do not command 'calm down'.",
    },
    learner_trap: {
      trap_vi: "Ra lệnh cảm xúc.",
      trap_en: "Commanding emotion.",
      repair_vi: "Đề xuất quy trình nói.",
      repair_en: "Suggest a speaking process.",
    },
  },
  {
    id: "pa_c2_smoke_sensitive_topic",
    focus: "sensitive_topic_framing",
    mode: "final_qa",
    title_vi: "Kiểm tra chủ đề nhạy cảm",
    title_en: "Smoke check sensitive-topic framing",
    scenario_vi: "Nhóm cần chia việc nhưng không muốn gán vai theo định kiến.",
    scenario_en: "The group needs to divide work without assigning roles by stereotype.",
    prompt_vi: "Mời nhận việc theo sở thích, thời gian, và sự thuận tiện.",
    prompt_en: "Invite tasks by interest, availability, and comfort.",
    model_gurmukhi:
      "ਅਸੀਂ ਕੰਮ ਰੁਚੀ ਅਤੇ ਸਮੇਂ ਦੇ ਅਨੁਸਾਰ ਵੰਡ ਸਕਦੇ ਹਾਂ। ਜਿਸ ਨੂੰ ਸੁਵਿਧਾ ਹੋਵੇ, ਉਹ ਇਹ ਹਿੱਸਾ ਲੈ ਸਕਦਾ ਹੈ।",
    model_romanization:
      "asin kamm ruchi ate same de anusaar vand sakde haan. jis nu suvidha hove, oh ih hissa lai sakda hai.",
    model_vi:
      "Chúng ta có thể chia việc theo sở thích và thời gian. Ai thấy thuận tiện có thể nhận phần này.",
    model_en:
      "We can divide the work by interest and availability. Whoever feels comfortable can take this part.",
    quick_phrases: [
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
    expected: {
      must_include_vi: "Tiêu chí trung tính + quyền chọn.",
      must_include_en: "Neutral criteria + choice.",
      avoid_vi: "Không gán theo tuổi, giới, gia đình, cộng đồng.",
      avoid_en: "Do not assign by age, gender, family, or community.",
    },
    learner_trap: {
      trap_vi: "Dùng định kiến để phân công nhanh.",
      trap_en: "Using stereotypes to assign roles quickly.",
      repair_vi: "Chuyển sang sở thích, thời gian, và mức thuận tiện.",
      repair_en: "Shift to interest, availability, and comfort.",
    },
  },
  {
    id: "pa_c2_smoke_advanced_register",
    focus: "advanced_register",
    mode: "smoke_check",
    title_vi: "Kiểm tra đăng ký nâng cao",
    title_en: "Smoke check advanced register",
    scenario_vi: "Bạn thông báo đổi giờ và vẫn muốn mời câu hỏi.",
    scenario_en: "You announce a time change while still inviting questions.",
    prompt_vi: "Giữ trang trọng, rõ, và không lạnh.",
    prompt_en: "Keep it formal, clear, and not cold.",
    model_gurmukhi:
      "ਕਿਰਪਾ ਕਰਕੇ ਧਿਆਨ ਦਿਓ ਕਿ ਸਮਾਂ ਬਦਲਿਆ ਗਿਆ ਹੈ। ਜੇ ਕੋਈ ਸਵਾਲ ਹੋਵੇ ਤਾਂ ਸਾਨੂੰ ਦੱਸੋ।",
    model_romanization:
      "kirpa karke dhiaan dio ki sama badlia gia hai. je koi sawal hove taan sanu dasso.",
    model_vi:
      "Xin vui lòng lưu ý rằng thời gian đã được thay đổi. Nếu có câu hỏi, xin cho chúng tôi biết.",
    model_en:
      "Please note that the time has been changed. If there is any question, please let us know.",
    quick_phrases: [
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
    expected: {
      must_include_vi: "Thông báo rõ + lời mời hỏi.",
      must_include_en: "Clear notice + invitation for questions.",
      avoid_vi: "Không quá thân mật hoặc quá lạnh.",
      avoid_en: "Avoid being too casual or too cold.",
    },
  },
  {
    id: "pa_c2_smoke_community_canada",
    focus: "community_discourse",
    mode: "integration_readiness",
    title_vi: "Kiểm tra điều phối cộng đồng Canada",
    title_en: "Smoke check Canadian community coordination",
    scenario_vi: "Nhóm tình nguyện ở Canada đồng ý cuối tuần nhưng chưa chọn ngày.",
    scenario_en: "A volunteer group in Canada agrees on the weekend but has not chosen a date.",
    prompt_vi: "Tóm tắt đồng thuận và bước lấy ý kiến.",
    prompt_en: "Summarize agreement and the input step.",
    model_gurmukhi:
      "ਹੁਣ ਤੱਕ ਸਹਿਮਤੀ ਇਹ ਹੈ ਕਿ ਸਮਾਗਮ ਹਫ਼ਤੇ ਦੇ ਅੰਤ ਹੋਵੇ। ਅਗਲਾ ਕਦਮ ਦੋ ਤਾਰੀਖਾਂ ਤੇ ਰਾਇ ਲੈਣਾ ਹੈ।",
    model_romanization:
      "hun takk sahimati ih hai ki samagam hafte de ant hove. agla kadam do tarikh'an te rai laina hai.",
    model_vi:
      "Đến giờ, điểm đồng thuận là sự kiện vào cuối tuần. Bước tiếp theo là lấy ý kiến về hai ngày.",
    model_en:
      "So far, the agreement is that the event should be on the weekend. The next step is to get views on two dates.",
    quick_phrases: [
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
    expected: {
      must_include_vi: "Đồng thuận + bước lấy ý kiến.",
      must_include_en: "Agreement + input step.",
      avoid_vi: "Không chốt thay nhóm khi chưa có ý kiến.",
      avoid_en: "Do not decide for the group before input.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_smoke_professional_discourse",
    focus: "professional_discourse",
    mode: "final_qa",
    title_vi: "Kiểm tra diễn ngôn chuyên nghiệp",
    title_en: "Smoke check professional discourse",
    scenario_vi: "Có lỗi quy trình ở nơi làm việc.",
    scenario_en: "There is a process error at work.",
    prompt_vi: "Nhận vấn đề qua quy trình, bước tiếp theo, và phòng lặp lại.",
    prompt_en: "Address the issue through process, next step, and prevention.",
    model_gurmukhi:
      "ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਮੁੜ ਵੇਖੀਏ ਅਤੇ ਅਗਲਾ ਕਦਮ ਸਪਸ਼ਟ ਕਰੀਏ, ਤਾਂ ਜੋ ਇਹ ਗੱਲ ਦੁਬਾਰਾ ਨਾ ਹੋਵੇ।",
    model_romanization:
      "prakiria nu mur vekhie ate agla kadam spasht karie, taan jo ih gall dubara na hove.",
    model_vi:
      "Hãy xem lại quy trình và làm rõ bước tiếp theo để việc này không lặp lại.",
    model_en:
      "Let's review the process and clarify the next step so this does not happen again.",
    quick_phrases: [
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
    expected: {
      must_include_vi: "Quy trình + bước tiếp theo.",
      must_include_en: "Process + next step.",
      avoid_vi: "Không hỏi 'ai sai?' đầu tiên.",
      avoid_en: "Do not first ask 'who was wrong?'.",
    },
    learner_trap: {
      trap_vi: "Tìm người chịu lỗi trước khi xem quy trình.",
      trap_en: "Finding the person at fault before reviewing process.",
      repair_vi: "Chuyển về ਪ੍ਰਕਿਰਿਆ and ਅਗਲਾ ਕਦਮ.",
      repair_en: "Shift to ਪ੍ਰਕਿਰਿਆ and ਅਗਲਾ ਕਦਮ.",
    },
  },
  {
    id: "pa_c2_smoke_public_discourse",
    focus: "public_discourse",
    mode: "smoke_check",
    title_vi: "Kiểm tra thông báo công khai",
    title_en: "Smoke check public notice",
    scenario_vi: "Bạn cần thông báo đổi giờ cho nhóm lớn.",
    scenario_en: "You need to announce a time change to a large group.",
    prompt_vi: "Nêu thay đổi và kênh cập nhật bằng giọng trung tính.",
    prompt_en: "State the change and update channel in a neutral tone.",
    model_gurmukhi:
      "ਸਮੇਂ ਵਿੱਚ ਤਬਦੀਲੀ ਕੀਤੀ ਗਈ ਹੈ। ਤਾਜ਼ਾ ਜਾਣਕਾਰੀ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਸੁਨੇਹਾ ਵੇਖੋ।",
    model_romanization:
      "same vich tabdili kiti gai hai. taza jaankari lai kirpa karke agla suneha vekho.",
    model_vi:
      "Đã có thay đổi về thời gian. Để có thông tin mới nhất, xin xem tin nhắn tiếp theo.",
    model_en:
      "A change has been made to the time. For the latest information, please check the next message.",
    quick_phrases: [
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
    expected: {
      must_include_vi: "Thay đổi + cập nhật.",
      must_include_en: "Change + update guidance.",
      avoid_vi: "Không dùng từ kịch tính.",
      avoid_en: "Avoid dramatic wording.",
    },
    learner_trap: {
      trap_vi: "Làm thông báo nhỏ nghe như khủng hoảng.",
      trap_en: "Making a small notice sound like a crisis.",
      repair_vi: "Dùng ਤਬਦੀਲੀ and ਤਾਜ਼ਾ ਜਾਣਕਾਰੀ.",
      repair_en: "Use ਤਬਦੀਲੀ and ਤਾਜ਼ਾ ਜਾਣਕਾਰੀ.",
    },
    canada_practical: true,
  },
];

export const smokeDeckC2ByFocus = (focus: PunjabiC2SmokeFocus): PunjabiC2SmokeCard[] =>
  smokeDeckC2.filter((card) => card.focus === focus);
