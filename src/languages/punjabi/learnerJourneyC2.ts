// Punjabi C2 learner journey for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support learner journey, not certification, official
// placement, or native-reviewed authority. Native review is deferred.
// Shahmukhi is mentioned only for script awareness, not as a full course.

export type PunjabiC2JourneyStage =
  | "advanced_register"
  | "nuanced_disagreement"
  | "negotiation"
  | "diplomacy"
  | "deescalation"
  | "sensitive_topic_framing"
  | "community_discourse"
  | "professional_discourse"
  | "public_discourse"
  | "handoff_readiness";

export type PunjabiC2JourneyMode = "learn" | "practice" | "handoff" | "readiness";

export type PunjabiC2JourneyPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2JourneyCheckpoint = {
  checkpoint_vi: string;
  checkpoint_en: string;
  evidence_vi: string;
  evidence_en: string;
};

export type PunjabiC2JourneyTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2JourneyHandoff = {
  next_vi: string;
  next_en: string;
  ready_when_vi: string;
  ready_when_en: string;
};

export type PunjabiC2JourneyStep = {
  id: string;
  stage: PunjabiC2JourneyStage;
  mode: PunjabiC2JourneyMode;
  order: number;
  title_vi: string;
  title_en: string;
  learner_goal_vi: string;
  learner_goal_en: string;
  scenario_vi: string;
  scenario_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  key_phrases: PunjabiC2JourneyPhrase[];
  checkpoints: PunjabiC2JourneyCheckpoint[];
  handoff: PunjabiC2JourneyHandoff;
  learner_trap?: PunjabiC2JourneyTrap;
  canada_practical?: boolean;
};

export const C2_LEARNER_JOURNEY_DISCLAIMER = {
  vi: "Lộ trình người học Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi learner journey supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const learnerJourneyC2: PunjabiC2JourneyStep[] = [
  {
    id: "pa_c2_journey_01_advanced_register",
    stage: "advanced_register",
    mode: "learn",
    order: 1,
    title_vi: "Điều chỉnh đăng ký nâng cao",
    title_en: "Control advanced register",
    learner_goal_vi: "Tôi kiểm soát được giọng trang trọng mà vẫn hợp tác.",
    learner_goal_en: "I can control formal tone while staying collaborative.",
    scenario_vi: "Bạn thông báo đổi giờ họp và muốn để ngỏ câu hỏi.",
    scenario_en: "You announce a meeting time change and want to invite questions.",
    sample_gurmukhi:
      "ਕਿਰਪਾ ਕਰਕੇ ਧਿਆਨ ਦਿਓ ਕਿ ਸਮਾਂ ਬਦਲਿਆ ਗਿਆ ਹੈ। ਜੇ ਕੋਈ ਸਵਾਲ ਹੋਵੇ ਤਾਂ ਦੱਸੋ।",
    sample_romanization:
      "kirpa karke dhiaan dio ki sama badlia gia hai. je koi sawal hove taan dasso.",
    sample_vi:
      "Xin vui lòng lưu ý rằng thời gian đã được thay đổi. Nếu có câu hỏi, xin cho biết.",
    sample_en:
      "Please note that the time has been changed. If there is any question, please let us know.",
    key_phrases: [
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
    checkpoints: [
      {
        checkpoint_vi: "Trang trọng nhưng không lạnh.",
        checkpoint_en: "Formal but not cold.",
        evidence_vi: "Có lời mời hỏi lại.",
        evidence_en: "Includes an invitation to ask.",
      },
    ],
    handoff: {
      next_vi: "Chuyển sang bất đồng có sắc thái.",
      next_en: "Move to nuanced disagreement.",
      ready_when_vi: "Người học có thể thông báo rõ và mở cửa cho câu hỏi.",
      ready_when_en: "The learner can announce clearly and leave room for questions.",
    },
  },
  {
    id: "pa_c2_journey_02_nuanced_disagreement",
    stage: "nuanced_disagreement",
    mode: "practice",
    order: 2,
    title_vi: "Bất đồng có sắc thái",
    title_en: "Nuanced disagreement",
    learner_goal_vi: "Tôi phản biện ý kiến mà vẫn công nhận mục tiêu chung.",
    learner_goal_en: "I can challenge an idea while validating the shared goal.",
    scenario_vi: "Một đề xuất có mục tiêu tốt nhưng thiếu bằng chứng.",
    scenario_en: "A proposal has a good goal but lacks evidence.",
    sample_gurmukhi:
      "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ, ਪਰ ਮੇਰੀ ਚਿੰਤਾ ਇਹ ਹੈ ਕਿ ਸਬੂਤ ਅਜੇ ਸਪਸ਼ਟ ਨਹੀਂ ਹਨ।",
    sample_romanization:
      "maqsad naal main sahimat haan, par meri chinta ih hai ki sabut aje spasht nahin han.",
    sample_vi:
      "Tôi đồng ý với mục tiêu, nhưng điều tôi lo là bằng chứng vẫn chưa rõ.",
    sample_en:
      "I agree with the goal, but my concern is that the evidence is still not clear.",
    key_phrases: [
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
    checkpoints: [
      {
        checkpoint_vi: "Phản biện vào bằng chứng, không vào người.",
        checkpoint_en: "Challenges evidence, not the person.",
        evidence_vi: "Có ਸਬੂਤ hoặc lý do cụ thể.",
        evidence_en: "Includes ਸਬੂਤ or a specific reason.",
      },
    ],
    handoff: {
      next_vi: "Chuyển sang đàm phán có ràng buộc.",
      next_en: "Move to constrained negotiation.",
      ready_when_vi: "Bất đồng có công nhận và lý do cụ thể.",
      ready_when_en: "The disagreement has validation and a specific reason.",
    },
    learner_trap: {
      trap_vi: "Mở đầu bằng 'không đúng' quá trực diện.",
      trap_en: "Opening with 'not correct' is too direct.",
      repair_vi: "Công nhận mục tiêu trước rồi nêu lo ngại.",
      repair_en: "Validate the goal first, then name the concern.",
    },
  },
  {
    id: "pa_c2_journey_03_negotiation_canada",
    stage: "negotiation",
    mode: "practice",
    order: 3,
    title_vi: "Đàm phán trong ràng buộc",
    title_en: "Negotiate within constraints",
    learner_goal_vi: "Tôi hỏi lựa chọn tiếp theo mà vẫn tôn trọng quy định.",
    learner_goal_en: "I can ask for next options while respecting rules.",
    scenario_vi: "Ở Canada, bạn có bản sao giấy tờ nhưng chưa có bản gốc.",
    scenario_en: "In Canada, you have a copy of a document but not the original.",
    sample_gurmukhi:
      "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ। ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਹੈ; ਕੀ ਕੋਈ ਹੋਰ ਵਿਕਲਪ ਹੋ ਸਕਦਾ ਹੈ?",
    sample_romanization:
      "mainu niyam di samajh hai. mere kol copy hai; ki koi hor vikalp ho sakda hai?",
    sample_vi:
      "Tôi hiểu quy định. Tôi có bản sao; có lựa chọn khác nào không?",
    sample_en:
      "I understand the rule. I have a copy; could there be another option?",
    key_phrases: [
      {
        gurmukhi: "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ",
        romanization: "mainu niyam di samajh hai",
        vi: "Tôi hiểu quy định.",
        en: "I understand the rule.",
      },
      {
        gurmukhi: "ਕੀ ਕੋਈ ਹੋਰ ਵਿਕਲਪ ਹੋ ਸਕਦਾ ਹੈ?",
        romanization: "ki koi hor vikalp ho sakda hai?",
        vi: "Có lựa chọn khác nào không?",
        en: "Could there be another option?",
      },
    ],
    checkpoints: [
      {
        checkpoint_vi: "Hỏi lựa chọn thay vì đòi ngoại lệ.",
        checkpoint_en: "Asks for options instead of demanding an exception.",
        evidence_vi: "Có ਨਿਯਮ và ਵਿਕਲਪ.",
        evidence_en: "Includes ਨਿਯਮ and ਵਿਕਲਪ.",
      },
    ],
    handoff: {
      next_vi: "Chuyển sang ngoại giao khi từ chối hoặc giới hạn.",
      next_en: "Move to diplomacy when refusing or setting limits.",
      ready_when_vi: "Người học có thể mở bước tiếp theo mà không ép buộc.",
      ready_when_en: "The learner can open a next step without coercion.",
    },
    learner_trap: {
      trap_vi: "Nói 'anh/chị phải chấp nhận' nghe ép buộc.",
      trap_en: "Saying 'you must accept this' sounds coercive.",
      repair_vi: "Hỏi về ਵਿਕਲਪ hoặc ਅਗਲਾ ਕਦਮ.",
      repair_en: "Ask about ਵਿਕਲਪ or ਅਗਲਾ ਕਦਮ.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_journey_04_diplomacy",
    stage: "diplomacy",
    mode: "practice",
    order: 4,
    title_vi: "Ngoại giao khi nói không",
    title_en: "Diplomacy when saying no",
    learner_goal_vi: "Tôi từ chối mà vẫn giữ thiện chí.",
    learner_goal_en: "I can refuse while preserving goodwill.",
    scenario_vi: "Bạn không thể nhận lời mời nhưng muốn giữ quan hệ tốt.",
    scenario_en: "You cannot accept an invitation but want to keep goodwill.",
    sample_gurmukhi:
      "ਤੁਹਾਡੇ ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ। ਇਸ ਵੇਲੇ ਆਉਣਾ ਸੰਭਵ ਨਹੀਂ ਹੋਵੇਗਾ, ਪਰ ਅਗਲੇ ਮੌਕੇ ਲਈ ਖੁਸ਼ੀ ਰਹੇਗੀ।",
    sample_romanization:
      "tuhade sadde lai dhanvaad. is vele auna sambhav nahin hovega, par agle mauke lai khushi rahegi.",
    sample_vi:
      "Cảm ơn lời mời của anh/chị. Hiện tại việc đến sẽ không khả thi, nhưng tôi sẽ vui cho dịp sau.",
    sample_en:
      "Thank you for the invitation. At the moment coming will not be possible, but I would be happy for a future opportunity.",
    key_phrases: [
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
    checkpoints: [
      {
        checkpoint_vi: "Cảm ơn trước khi giới hạn.",
        checkpoint_en: "Thanks before setting the limit.",
        evidence_vi: "Có ਧੰਨਵਾਦ trước ਸੰਭਵ ਨਹੀਂ.",
        evidence_en: "Includes ਧੰਨਵਾਦ before ਸੰਭਵ ਨਹੀਂ.",
      },
    ],
    handoff: {
      next_vi: "Chuyển sang hạ nhiệt khi cảm xúc tăng.",
      next_en: "Move to de-escalation when emotions rise.",
      ready_when_vi: "Từ chối rõ nhưng vẫn để quan hệ mở.",
      ready_when_en: "The refusal is clear but leaves the relationship open.",
    },
    learner_trap: {
      trap_vi: "Dịch 'I refuse' quá cứng.",
      trap_en: "Translating 'I refuse' too stiffly.",
      repair_vi: "Dùng ਇਸ ਵੇਲੇ và cảm ơn.",
      repair_en: "Use ਇਸ ਵੇਲੇ and thanks.",
    },
  },
  {
    id: "pa_c2_journey_05_deescalation",
    stage: "deescalation",
    mode: "practice",
    order: 5,
    title_vi: "Hạ nhiệt bằng quy trình",
    title_en: "De-escalate through process",
    learner_goal_vi: "Tôi giảm căng thẳng bằng lượt nói và mục tiêu chung.",
    learner_goal_en: "I can reduce tension through turn-taking and shared goals.",
    scenario_vi: "Hai người nói chồng lên nhau trong cuộc họp cộng đồng.",
    scenario_en: "Two people are speaking over each other in a community meeting.",
    sample_gurmukhi:
      "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ। ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ, ਇਸ ਲਈ ਬਾਰੀ-ਬਾਰੀ ਗੱਲ ਕਰੀਏ।",
    sample_romanization:
      "aao ikk-ikk gall sunie. maqsad hall labhna hai, is lai baari-baari gall karie.",
    sample_vi:
      "Ta hãy nghe từng ý một. Mục tiêu là tìm giải pháp, vì vậy hãy nói lần lượt.",
    sample_en:
      "Let's hear one point at a time. The goal is to find a solution, so let's speak in turn.",
    key_phrases: [
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
    checkpoints: [
      {
        checkpoint_vi: "Không ra lệnh cảm xúc.",
        checkpoint_en: "Does not command emotions.",
        evidence_vi: "Có quy trình ਇੱਕ-ਇੱਕ hoặc ਬਾਰੀ-ਬਾਰੀ.",
        evidence_en: "Has an ਇੱਕ-ਇੱਕ or ਬਾਰੀ-ਬਾਰੀ process.",
      },
    ],
    handoff: {
      next_vi: "Chuyển sang đóng khung chủ đề nhạy cảm.",
      next_en: "Move to sensitive-topic framing.",
      ready_when_vi: "Người học điều phối quy trình thay vì phán xét.",
      ready_when_en: "The learner coordinates process instead of judging.",
    },
    learner_trap: {
      trap_vi: "Nói 'đừng cãi nữa' có thể làm căng hơn.",
      trap_en: "Saying 'stop arguing' can increase tension.",
      repair_vi: "Đề xuất nghe từng lượt.",
      repair_en: "Suggest hearing each turn.",
    },
  },
  {
    id: "pa_c2_journey_06_sensitive_topic",
    stage: "sensitive_topic_framing",
    mode: "practice",
    order: 6,
    title_vi: "Đóng khung chủ đề nhạy cảm",
    title_en: "Frame sensitive topics",
    learner_goal_vi: "Tôi tránh định kiến khi phân công hoặc mời tham gia.",
    learner_goal_en: "I can avoid stereotypes when assigning roles or inviting participation.",
    scenario_vi: "Nhóm chia việc cho sự kiện cộng đồng.",
    scenario_en: "A group is dividing work for a community event.",
    sample_gurmukhi:
      "ਅਸੀਂ ਕੰਮ ਰੁਚੀ ਅਤੇ ਸਮੇਂ ਦੇ ਅਨੁਸਾਰ ਵੰਡ ਸਕਦੇ ਹਾਂ। ਜਿਸ ਨੂੰ ਸੁਵਿਧਾ ਹੋਵੇ, ਉਹ ਇਹ ਹਿੱਸਾ ਲੈ ਸਕਦਾ ਹੈ।",
    sample_romanization:
      "asin kamm ruchi ate same de anusaar vand sakde haan. jis nu suvidha hove, oh ih hissa lai sakda hai.",
    sample_vi:
      "Chúng ta có thể chia việc theo sở thích và thời gian. Ai thấy thuận tiện có thể nhận phần này.",
    sample_en:
      "We can divide the work according to interest and availability. Whoever feels comfortable can take this part.",
    key_phrases: [
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
    checkpoints: [
      {
        checkpoint_vi: "Tiêu chí trung tính, không định kiến.",
        checkpoint_en: "Neutral criteria, not stereotypes.",
        evidence_vi: "Có ਰੁਚੀ, ਸਮਾਂ, hoặc ਸੁਵਿਧਾ.",
        evidence_en: "Includes ਰੁਚੀ, ਸਮਾਂ, or ਸੁਵਿਧਾ.",
      },
    ],
    handoff: {
      next_vi: "Chuyển sang điều phối diễn ngôn cộng đồng.",
      next_en: "Move to community discourse coordination.",
      ready_when_vi: "Người nghe có quyền chọn theo khả năng và thời gian.",
      ready_when_en: "Listeners can choose by capacity and availability.",
    },
    learner_trap: {
      trap_vi: "Gán vai theo tuổi, giới, hoặc gia đình.",
      trap_en: "Assigning roles by age, gender, or family.",
      repair_vi: "Dùng tiêu chí ruchi, time, và comfort.",
      repair_en: "Use interest, availability, and comfort criteria.",
    },
  },
  {
    id: "pa_c2_journey_07_community_discourse_canada",
    stage: "community_discourse",
    mode: "handoff",
    order: 7,
    title_vi: "Điều phối nhóm cộng đồng",
    title_en: "Coordinate community discourse",
    learner_goal_vi: "Tôi tóm tắt đồng thuận, điểm còn mở, và bước tiếp theo.",
    learner_goal_en: "I can summarize agreement, open issues, and next steps.",
    scenario_vi: "Nhóm tình nguyện ở Canada đồng ý cuối tuần nhưng chưa chọn ngày.",
    scenario_en: "A volunteer group in Canada agrees on the weekend but has not chosen a date.",
    sample_gurmukhi:
      "ਹੁਣ ਤੱਕ ਸਹਿਮਤੀ ਇਹ ਹੈ ਕਿ ਸਮਾਗਮ ਹਫ਼ਤੇ ਦੇ ਅੰਤ ਹੋਵੇ। ਅਗਲਾ ਕਦਮ ਦੋ ਤਾਰੀਖਾਂ ਤੇ ਰਾਇ ਲੈਣਾ ਹੈ।",
    sample_romanization:
      "hun takk sahimati ih hai ki samagam hafte de ant hove. agla kadam do tarikh'an te rai laina hai.",
    sample_vi:
      "Đến giờ, điểm đồng thuận là sự kiện vào cuối tuần. Bước tiếp theo là lấy ý kiến về hai ngày.",
    sample_en:
      "So far, the agreement is that the event should be on the weekend. The next step is to get views on two dates.",
    key_phrases: [
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
    checkpoints: [
      {
        checkpoint_vi: "Tách đồng thuận khỏi bước tiếp theo.",
        checkpoint_en: "Separates agreement from next step.",
        evidence_vi: "Có ਸਹਿਮਤੀ và ਅਗਲਾ ਕਦਮ.",
        evidence_en: "Includes ਸਹਿਮਤੀ and ਅਗਲਾ ਕਦਮ.",
      },
    ],
    handoff: {
      next_vi: "Chuyển sang diễn ngôn chuyên nghiệp.",
      next_en: "Move to professional discourse.",
      ready_when_vi: "Người học điều phối nhóm, không chỉ nêu ý riêng.",
      ready_when_en: "The learner coordinates the group, not only personal preference.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_journey_08_professional_discourse",
    stage: "professional_discourse",
    mode: "handoff",
    order: 8,
    title_vi: "Diễn ngôn chuyên nghiệp khi có lỗi",
    title_en: "Professional discourse after an error",
    learner_goal_vi: "Tôi xử lý lỗi qua quy trình và bước tiếp theo, không đổ lỗi.",
    learner_goal_en: "I can handle errors through process and next steps without blame.",
    scenario_vi: "Một lỗi xảy ra trong quy trình làm việc.",
    scenario_en: "An error happens in a workplace process.",
    sample_gurmukhi:
      "ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਮੁੜ ਵੇਖੀਏ ਅਤੇ ਅਗਲਾ ਕਦਮ ਸਪਸ਼ਟ ਕਰੀਏ, ਤਾਂ ਜੋ ਇਹ ਗੱਲ ਦੁਬਾਰਾ ਨਾ ਹੋਵੇ।",
    sample_romanization:
      "prakiria nu mur vekhie ate agla kadam spasht karie, taan jo ih gall dubara na hove.",
    sample_vi:
      "Hãy xem lại quy trình và làm rõ bước tiếp theo để việc này không lặp lại.",
    sample_en:
      "Let's review the process and clarify the next step so this does not happen again.",
    key_phrases: [
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
    checkpoints: [
      {
        checkpoint_vi: "Trách nhiệm không thành truy lỗi cá nhân.",
        checkpoint_en: "Accountability does not become personal blame.",
        evidence_vi: "Có ਪ੍ਰਕਿਰਿਆ và prevention.",
        evidence_en: "Includes ਪ੍ਰਕਿਰਿਆ and prevention.",
      },
    ],
    handoff: {
      next_vi: "Chuyển sang thông báo công khai.",
      next_en: "Move to public discourse.",
      ready_when_vi: "Người học nói được về lỗi mà không hỏi 'ai sai' trước.",
      ready_when_en: "The learner can discuss an error without first asking 'who was wrong'.",
    },
    learner_trap: {
      trap_vi: "Dùng giọng điều tra quá sớm.",
      trap_en: "Using an investigative tone too early.",
      repair_vi: "Chuyển về quy trình và bước tiếp theo.",
      repair_en: "Shift to process and next step.",
    },
  },
  {
    id: "pa_c2_journey_09_public_discourse",
    stage: "public_discourse",
    mode: "readiness",
    order: 9,
    title_vi: "Diễn ngôn công khai rõ và trung tính",
    title_en: "Clear neutral public discourse",
    learner_goal_vi: "Tôi thông báo thay đổi rõ ràng mà không gây hoang mang.",
    learner_goal_en: "I can announce changes clearly without causing alarm.",
    scenario_vi: "Một sự kiện cộng đồng ở Canada đổi giờ.",
    scenario_en: "A community event in Canada changes time.",
    sample_gurmukhi:
      "ਸਮੇਂ ਵਿੱਚ ਤਬਦੀਲੀ ਕੀਤੀ ਗਈ ਹੈ। ਤਾਜ਼ਾ ਜਾਣਕਾਰੀ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਸੁਨੇਹਾ ਵੇਖੋ।",
    sample_romanization:
      "same vich tabdili kiti gai hai. taza jaankari lai kirpa karke agla suneha vekho.",
    sample_vi:
      "Đã có thay đổi về thời gian. Để có thông tin mới nhất, xin xem tin nhắn tiếp theo.",
    sample_en:
      "A change has been made to the time. For the latest information, please check the next message.",
    key_phrases: [
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
    checkpoints: [
      {
        checkpoint_vi: "Có thay đổi và kênh cập nhật.",
        checkpoint_en: "Includes change and update channel.",
        evidence_vi: "Có ਤਬਦੀਲੀ và ਤਾਜ਼ਾ ਜਾਣਕਾਰੀ.",
        evidence_en: "Includes ਤਬਦੀਲੀ and ਤਾਜ਼ਾ ਜਾਣਕਾਰੀ.",
      },
    ],
    handoff: {
      next_vi: "Chuyển sang tổng kiểm tra sẵn sàng.",
      next_en: "Move to final readiness check.",
      ready_when_vi: "Người đọc biết thay đổi là gì và xem cập nhật ở đâu.",
      ready_when_en: "Readers know what changed and where to check updates.",
    },
    learner_trap: {
      trap_vi: "Dùng từ kịch tính cho thay đổi nhỏ.",
      trap_en: "Using dramatic wording for a small change.",
      repair_vi: "Dùng giọng trung tính và kênh cập nhật.",
      repair_en: "Use neutral tone and an update channel.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_journey_10_handoff_readiness",
    stage: "handoff_readiness",
    mode: "readiness",
    order: 10,
    title_vi: "Bàn giao sẵn sàng C2",
    title_en: "C2 readiness handoff",
    learner_goal_vi: "Tôi tóm tắt năng lực, điểm còn mở, và bước luyện tiếp theo.",
    learner_goal_en: "I can summarize strengths, open points, and next practice steps.",
    scenario_vi: "Bạn kết thúc giai đoạn C2 và bàn giao kế hoạch luyện tập tiếp.",
    scenario_en: "You complete the C2 stage and hand off the next practice plan.",
    sample_gurmukhi:
      "ਹੁਣ ਤੱਕ ਇਹ ਕੰਮ ਪੂਰਾ ਹੋਇਆ ਹੈ। ਅਗਲਾ ਧਿਆਨ ਜਟਿਲ ਗੱਲਬਾਤ ਵਿੱਚ ਰਜਿਸਟਰ ਅਤੇ ਸਪਸ਼ਟਤਾ ਤੇ ਰਹੇਗਾ।",
    sample_romanization:
      "hun takk ih kamm pura hoia hai. agla dhiaan jatil gallbaat vich register ate spashtata te rahega.",
    sample_vi:
      "Đến giờ, phần này đã hoàn tất. Trọng tâm tiếp theo sẽ là đăng ký và độ rõ trong trao đổi phức tạp.",
    sample_en:
      "So far, this work has been completed. The next focus will be register and clarity in complex discussion.",
    key_phrases: [
      {
        gurmukhi: "ਹੁਣ ਤੱਕ ਇਹ ਕੰਮ ਪੂਰਾ ਹੋਇਆ ਹੈ",
        romanization: "hun takk ih kamm pura hoia hai",
        vi: "Đến giờ, phần này đã hoàn tất.",
        en: "So far, this work has been completed.",
      },
      {
        gurmukhi: "ਅਗਲਾ ਧਿਆਨ",
        romanization: "agla dhiaan",
        vi: "Trọng tâm tiếp theo.",
        en: "The next focus.",
      },
    ],
    checkpoints: [
      {
        checkpoint_vi: "Có tóm tắt và bước tiếp theo.",
        checkpoint_en: "Includes summary and next step.",
        evidence_vi: "Có ਪੂਰਾ ਹੋਇਆ và ਅਗਲਾ ਧਿਆਨ.",
        evidence_en: "Includes ਪੂਰਾ ਹੋਇਆ and ਅਗਲਾ ਧਿਆਨ.",
      },
    ],
    handoff: {
      next_vi: "Tiếp tục luyện với người hướng dẫn hoặc cộng đồng; thẩm định bản xứ vẫn được hoãn.",
      next_en: "Continue practice with an instructor or community; native review remains deferred.",
      ready_when_vi: "Người học có thể tự chỉ ra điểm mạnh, điểm còn mở, và bước luyện tiếp.",
      ready_when_en: "The learner can name strengths, open points, and next practice steps.",
    },
    learner_trap: {
      trap_vi: "Tự nhận đã hoàn hảo hoặc được thẩm định bản xứ.",
      trap_en: "Claiming perfection or native review.",
      repair_vi: "Nói rõ đây là bước luyện tiếp và thẩm định bản xứ được hoãn.",
      repair_en: "State this is continued practice and native review is deferred.",
    },
  },
];

export const learnerJourneyC2ByStage = (
  stage: PunjabiC2JourneyStage,
): PunjabiC2JourneyStep[] => learnerJourneyC2.filter((step) => step.stage === stage);
