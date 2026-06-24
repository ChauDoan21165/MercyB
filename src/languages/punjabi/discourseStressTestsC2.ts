// Punjabi C2 discourse stress tests for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support stress tests, not certification, official
// placement, legal/HR/medical/safety advice, or native-reviewed authority.
// Native review is deferred. Shahmukhi is mentioned only for script awareness,
// not as a full course.

export type PunjabiC2StressFocus =
  | "nuanced_disagreement"
  | "negotiation"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "audience_adaptation"
  | "sensitive_topic_framing"
  | "advanced_register"
  | "community_discourse"
  | "professional_discourse"
  | "public_discourse";

export type PunjabiC2StressStyle = "stress_test" | "final_risk" | "final_qa";

export type PunjabiC2StressPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2StressRisk = {
  risk_vi: string;
  risk_en: string;
  guard_vi: string;
  guard_en: string;
};

export type PunjabiC2StressTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2DiscourseStressTest = {
  id: string;
  focus: PunjabiC2StressFocus;
  style: PunjabiC2StressStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  task_vi: string;
  task_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  guard_phrases: PunjabiC2StressPhrase[];
  final_risks: PunjabiC2StressRisk[];
  learner_trap?: PunjabiC2StressTrap;
  canada_practical?: boolean;
};

export const C2_DISCOURSE_STRESS_TESTS_DISCLAIMER = {
  vi: "Các bài kiểm tra stress Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "These C2 Punjabi stress tests support study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const discourseStressTestsC2: PunjabiC2DiscourseStressTest[] = [
  {
    id: "pa_c2_stress_nuanced_disagreement",
    focus: "nuanced_disagreement",
    style: "stress_test",
    title_vi: "Stress test bất đồng tinh tế",
    title_en: "Stress test nuanced disagreement",
    scenario_vi: "Đề xuất có mục tiêu tốt nhưng kết luận quá nhanh.",
    scenario_en: "A proposal has a good goal but reaches a conclusion too fast.",
    task_vi: "Giữ đồng ý với mục tiêu nhưng siết phản biện vào dữ liệu.",
    task_en: "Keep agreement with the goal but tighten the challenge around data.",
    sample_gurmukhi:
      "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ, ਪਰ ਅੰਕੜੇ ਅਜੇ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਪਸ਼ਟ ਨਹੀਂ ਹਨ, ਇਸ ਲਈ ਨਤੀਜੇ ਤੋਂ ਪਹਿਲਾਂ ਇੱਕ ਵਾਰੀ ਹੋਰ ਵੇਖੀਏ।",
    sample_romanization:
      "maqsad naal main sahimat haan, par ankare aje puri tarah spasht nahin han, is lai natije ton pehlan ikk vari hor vekhie.",
    sample_vi:
      "Tôi đồng ý với mục tiêu, nhưng số liệu vẫn chưa hoàn toàn rõ, vì vậy hãy xem lại một lần nữa trước khi kết luận.",
    sample_en:
      "I agree with the goal, but the numbers are not fully clear yet, so let's look once more before concluding.",
    guard_phrases: [
      {
        gurmukhi: "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ",
        romanization: "maqsad naal main sahimat haan",
        vi: "Tôi đồng ý với mục tiêu.",
        en: "I agree with the goal.",
      },
      {
        gurmukhi: "ਇੱਕ ਵਾਰੀ ਹੋਰ ਵੇਖੀਏ",
        romanization: "ikk vari hor vekhie",
        vi: "Hãy xem lại một lần nữa.",
        en: "Let's look once more.",
      },
    ],
    final_risks: [
      {
        risk_vi: "Nghe như phủ định toàn bộ đề xuất.",
        risk_en: "Sounds like rejecting the entire proposal.",
        guard_vi: "Mở bằng công nhận rồi mới giới hạn phản biện.",
        guard_en: "Open with validation before narrowing the critique.",
      },
    ],
    learner_trap: {
      trap_vi: "Chỉ nói 'không đúng'.",
      trap_en: "Only saying 'not correct'.",
      repair_vi: "Nói mục tiêu trước, rồi chỉ vào ਅੰਕੜੇ.",
      repair_en: "State the goal first, then point to ਅੰਕੜੇ.",
    },
  },
  {
    id: "pa_c2_stress_negotiation_breakdown_canada",
    focus: "negotiation",
    style: "final_risk",
    title_vi: "Stress test đàm phán khi thủ tục bị chặn",
    title_en: "Stress test negotiation when procedure is blocked",
    scenario_vi: "Tại một dịch vụ công ở Canada, bạn chỉ có bản sao và email xác nhận.",
    scenario_en: "At a Canadian public service desk, you only have a copy and a confirmation email.",
    task_vi: "Giữ lịch sự, nêu cái có, hỏi lựa chọn tiếp theo, không đòi ngoại lệ.",
    task_en: "Stay polite, state what you have, ask for the next option, and do not demand an exception.",
    sample_gurmukhi:
      "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਅਤੇ ਪੁਸ਼ਟੀ ਵਾਲਾ ਈਮੇਲ ਹੈ; ਅਗਲਾ ਕਦਮ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
    sample_romanization:
      "mainu niyam di samajh hai. is vele mere kol copy ate pushti wala email hai; agla kadam ki ho sakda hai?",
    sample_vi:
      "Tôi hiểu quy định. Hiện tôi có bản sao và email xác nhận; bước tiếp theo có thể là gì?",
    sample_en:
      "I understand the rule. Right now I have a copy and a confirmation email; what could the next step be?",
    guard_phrases: [
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
    final_risks: [
      {
        risk_vi: "Nghe như gây áp lực để được chấp nhận.",
        risk_en: "Sounds like pressure to be accepted anyway.",
        guard_vi: "Nhấn vào quy định và phương án, không phải ngoại lệ.",
        guard_en: "Emphasize the rule and options, not an exception.",
      },
    ],
    learner_trap: {
      trap_vi: "Chỉ than 'tôi không có giấy'.",
      trap_en: "Only saying 'I don't have the paper'.",
      repair_vi: "Nêu cái đang có rồi hỏi lựa chọn.",
      repair_en: "State what you have, then ask for options.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_stress_diplomacy_refusal",
    focus: "diplomacy",
    style: "final_qa",
    title_vi: "Stress test từ chối ngoại giao",
    title_en: "Stress test diplomatic refusal",
    scenario_vi: "Bạn không thể nhận lời mời nhưng muốn giữ thiện chí.",
    scenario_en: "You cannot accept an invitation but want to keep goodwill.",
    task_vi: "Cảm ơn, giới hạn hiện tại, và mở đường cho dịp sau.",
    task_en: "Thank, set the present limit, and leave room for another time.",
    sample_gurmukhi:
      "ਤੁਹਾਡੇ ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਲਈ ਆਉਣਾ ਸੰਭਵ ਨਹੀਂ ਹੋਵੇਗਾ, ਪਰ ਅਗਲੇ ਮੌਕੇ ਲਈ ਮੈਨੂੰ ਖੁਸ਼ੀ ਰਹੇਗੀ।",
    sample_romanization:
      "tuhade sadde lai dhanvaad. is vele mere lai auna sambhav nahin hovega, par agle mauke lai mainu khushi rahegi.",
    sample_vi:
      "Cảm ơn lời mời. Hiện tại tôi không thể đến, nhưng tôi sẽ rất vui cho dịp sau.",
    sample_en:
      "Thank you for the invitation. At the moment I will not be able to come, but I would be happy for another time.",
    guard_phrases: [
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
    final_risks: [
      {
        risk_vi: "Từ chối quá cứng làm mất thiện chí.",
        risk_en: "A blunt refusal can damage goodwill.",
        guard_vi: "Dùng cảm ơn và mở lại dịp sau.",
        guard_en: "Use thanks and reopen the possibility later.",
      },
    ],
    learner_trap: {
      trap_vi: "Dịch thẳng 'I refuse' nghe quá nặng.",
      trap_en: "Translating 'I refuse' too bluntly sounds harsh.",
      repair_vi: "Dùng ਇਸ ਵੇਲੇ không thể và cảm ơn.",
      repair_en: "Use 'at the moment I cannot' plus thanks.",
    },
  },
  {
    id: "pa_c2_stress_mediation",
    focus: "mediation",
    style: "stress_test",
    title_vi: "Stress test hòa giải hai phía",
    title_en: "Stress test two-sided mediation",
    scenario_vi: "Hai bên bất đồng về thời gian và chất lượng.",
    scenario_en: "Two sides disagree about time and quality.",
    task_vi: "Tóm tắt hai lo ngại song song, không chọn phe.",
    task_en: "Summarize both concerns in parallel without taking sides.",
    sample_gurmukhi:
      "ਇੱਕ ਪਾਸੇ ਸਮੇਂ ਦੀ ਚਿੰਤਾ ਹੈ, ਅਤੇ ਦੂਜੇ ਪਾਸੇ ਗੁਣਵੱਤਾ ਦੀ ਚਿੰਤਾ ਹੈ। ਆਓ ਦੋਵੇਂ ਗੱਲਾਂ ਨੂੰ ਇੱਕੋ ਮਾਪਦੰਡ ਨਾਲ ਵੇਖੀਏ।",
    sample_romanization:
      "ikk pase same di chinta hai, ate duje pase gunvatta di chinta hai. aao dovein gallan nu ikko mapdand naal vekhie.",
    sample_vi:
      "Một phía lo về thời gian, và phía kia lo về chất lượng. Hãy xem cả hai theo cùng một tiêu chí.",
    sample_en:
      "One side is concerned about time, and the other side is concerned about quality. Let's look at both through the same criteria.",
    guard_phrases: [
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
    final_risks: [
      {
        risk_vi: "Biến tóm tắt thành phán quyết ai đúng.",
        risk_en: "Turning the summary into a judgment about who is right.",
        guard_vi: "Giữ cấu trúc song song và tiêu chí chung.",
        guard_en: "Keep parallel structure and shared criteria.",
      },
    ],
    learner_trap: {
      trap_vi: "Làm một bên thành đúng còn bên kia sai.",
      trap_en: "Making one side right and the other wrong.",
      repair_vi: "Dùng song song và tiêu chí.",
      repair_en: "Use parallel wording and criteria.",
    },
  },
  {
    id: "pa_c2_stress_deescalation_meeting",
    focus: "deescalation",
    style: "final_risk",
    title_vi: "Stress test hạ nhiệt cuộc họp",
    title_en: "Stress test meeting de-escalation",
    scenario_vi: "Trong cuộc họp cộng đồng, mọi người nói chồng lên nhau.",
    scenario_en: "In a community meeting, people are speaking over each other.",
    task_vi: "Đề xuất nói lần lượt và nhắc mục tiêu chung.",
    task_en: "Suggest turn-taking and remind everyone of the shared goal.",
    sample_gurmukhi:
      "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ। ਸਾਡਾ ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ, ਇਸ ਲਈ ਬਾਰੀ-ਬਾਰੀ ਗੱਲ ਕਰੀਏ।",
    sample_romanization:
      "aao ikk-ikk gall sunie. sada maqsad hall labhna hai, is lai baari-baari gall karie.",
    sample_vi:
      "Ta hãy nghe từng ý một. Mục tiêu của chúng ta là tìm giải pháp, vì vậy hãy nói lần lượt.",
    sample_en:
      "Let's hear one point at a time. Our goal is to find a solution, so let's speak in turn.",
    guard_phrases: [
      {
        gurmukhi: "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ",
        romanization: "aao ikk-ikk gall sunie",
        vi: "Ta hãy nghe từng ý một.",
        en: "Let's hear one point at a time.",
      },
      {
        gurmukhi: "ਸਾਡਾ ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ",
        romanization: "sada maqsad hall labhna hai",
        vi: "Mục tiêu của chúng ta là tìm giải pháp.",
        en: "Our goal is to find a solution.",
      },
    ],
    final_risks: [
      {
        risk_vi: "Nói 'bình tĩnh đi' làm căng hơn.",
        risk_en: "Saying 'calm down' can make tension worse.",
        guard_vi: "Chuyển sang quy trình nghe lần lượt.",
        guard_en: "Shift to a turn-taking process.",
      },
    ],
    learner_trap: {
      trap_vi: "Ra lệnh làm mọi người mất mặt.",
      trap_en: "Giving orders can make people lose face.",
      repair_vi: "Đề xuất quy trình thay vì mệnh lệnh.",
      repair_en: "Offer a process rather than a command.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_stress_audience_adaptation",
    focus: "audience_adaptation",
    style: "final_qa",
    title_vi: "Stress test điều chỉnh theo người nghe",
    title_en: "Stress test audience adaptation",
    scenario_vi: "Bạn cần nêu ý khác với người lớn tuổi hoặc trưởng nhóm.",
    scenario_en: "You need to offer a different view to an elder or group lead.",
    task_vi: "Giữ kính trọng, nêu góc nhìn nhỏ, tránh sửa lưng người nghe.",
    task_en: "Keep respect, offer a small perspective, and avoid sounding corrective.",
    sample_gurmukhi:
      "ਤੁਹਾਡੀ ਗੱਲ ਦੀ ਕਦਰ ਹੈ। ਮੇਰਾ ਇੱਕ ਛੋਟਾ ਜਿਹਾ ਨਜ਼ਰੀਆ ਹੈ ਕਿ ਅਸੀਂ ਇਹ ਪੱਖ ਵੀ ਵੇਖ ਸਕਦੇ ਹਾਂ।",
    sample_romanization:
      "tuhadi gall di kadar hai. mera ikk chhota jiha nazaria hai ki asin ih pakh vi vekh sakde haan.",
    sample_vi:
      "Tôi trân trọng ý của bác/anh/chị. Tôi có một góc nhìn nhỏ là chúng ta cũng có thể xem mặt này.",
    sample_en:
      "I value your point. I have one small perspective: we could also look at this side.",
    guard_phrases: [
      {
        gurmukhi: "ਤੁਹਾਡੀ ਗੱਲ ਦੀ ਕਦਰ ਹੈ",
        romanization: "tuhadi gall di kadar hai",
        vi: "Tôi trân trọng ý của bác/anh/chị.",
        en: "I value your point.",
      },
      {
        gurmukhi: "ਮੇਰਾ ਇੱਕ ਛੋਟਾ ਜਿਹਾ ਨਜ਼ਰੀਆ ਹੈ",
        romanization: "mera ikk chhota jiha nazaria hai",
        vi: "Tôi có một góc nhìn nhỏ.",
        en: "I have one small perspective.",
      },
    ],
    final_risks: [
      {
        risk_vi: "Giọng sửa lưng người lớn tuổi hoặc trưởng nhóm.",
        risk_en: "Sounds like correcting an elder or group lead.",
        guard_vi: "Bắt đầu bằng ਕਦਰ rồi mới thêm ਨਜ਼ਰੀਆ.",
        guard_en: "Start with ਕਦਰ before adding ਨਜ਼ਰੀਆ.",
      },
    ],
    learner_trap: {
      trap_vi: "Tưởng kính trọng là im luôn.",
      trap_en: "Assuming respect means staying silent.",
      repair_vi: "Dùng công nhận + góc nhìn nhỏ.",
      repair_en: "Use validation plus a small perspective.",
    },
  },
  {
    id: "pa_c2_stress_sensitive_topic_framing",
    focus: "sensitive_topic_framing",
    style: "final_risk",
    title_vi: "Stress test nêu chủ đề nhạy cảm",
    title_en: "Stress test sensitive-topic framing",
    scenario_vi: "Nhóm chia việc cho sự kiện nhưng dễ gán vai theo tuổi, giới, hoặc gia đình.",
    scenario_en: "A group divides event work but may assign roles by age, gender, or family.",
    task_vi: "Đưa tiêu chí trung tính: sở thích, thời gian, mức thoải mái.",
    task_en: "Use neutral criteria: interest, availability, and comfort level.",
    sample_gurmukhi:
      "ਅਸੀਂ ਕੰਮ ਰੁਚੀ, ਸਮੇਂ ਅਤੇ ਸੁਵਿਧਾ ਦੇ ਅਨੁਸਾਰ ਵੰਡ ਸਕਦੇ ਹਾਂ, ਕਿਸੇ ਦੀ ਉਮਰ ਜਾਂ ਪਰਿਵਾਰਕ ਭੂਮਿਕਾ ਦੇ ਆਧਾਰ ਤੇ ਨਹੀਂ।",
    sample_romanization:
      "asin kamm ruchi, same ate suvidha de anusaar vand sakde haan, kise di umar jaan parivaarak bhoomika de adhar te nahin.",
    sample_vi:
      "Chúng ta có thể chia việc theo sở thích, thời gian và mức thuận tiện, không dựa trên tuổi hay vai trò gia đình của ai.",
    sample_en:
      "We can divide the work by interest, availability, and comfort, not based on anyone's age or family role.",
    guard_phrases: [
      {
        gurmukhi: "ਰੁਚੀ, ਸਮੇਂ ਅਤੇ ਸੁਵਿਧਾ ਦੇ ਅਨੁਸਾਰ",
        romanization: "ruchi, same ate suvidha de anusaar",
        vi: "Theo sở thích, thời gian và mức thuận tiện.",
        en: "According to interest, availability, and comfort.",
      },
      {
        gurmukhi: "ਆਧਾਰ ਤੇ ਨਹੀਂ",
        romanization: "adhar te nahin",
        vi: "Không dựa trên.",
        en: "Not based on.",
      },
    ],
    final_risks: [
      {
        risk_vi: "Dùng nhãn xã hội thay cho tiêu chí.",
        risk_en: "Using social labels instead of criteria.",
        guard_vi: "Đổi sang tiêu chí tự nguyện và thuận tiện.",
        guard_en: "Switch to voluntary and comfort-based criteria.",
      },
    ],
    learner_trap: {
      trap_vi: "Phân công nhanh bằng định kiến.",
      trap_en: "Assigning quickly using stereotypes.",
      repair_vi: "Nêu tiêu chí trung tính.",
      repair_en: "State neutral criteria.",
    },
  },
  {
    id: "pa_c2_stress_advanced_register",
    focus: "advanced_register",
    style: "stress_test",
    title_vi: "Stress test đăng ký nâng cao",
    title_en: "Stress test advanced register",
    scenario_vi: "Bạn cần đổi hạn công việc mà không đổ lỗi cho ai.",
    scenario_en: "You need to change a work deadline without blaming anyone.",
    task_vi: "Giữ trang trọng, nêu ràng buộc, và đề xuất cách làm.",
    task_en: "Keep formal tone, name the constraint, and propose a path.",
    sample_gurmukhi:
      "ਮੌਜੂਦਾ ਸਮੇਂ ਦੀ ਪਾਬੰਦੀ ਨੂੰ ਦੇਖਦੇ ਹੋਏ, ਮੇਰਾ ਸੁਝਾਅ ਹੈ ਕਿ ਅਸੀਂ ਪਹਿਲਾਂ ਜ਼ਰੂਰੀ ਹਿੱਸਾ ਪੂਰਾ ਕਰੀਏ ਅਤੇ ਬਾਕੀ ਲਈ ਨਵੀਂ ਮਿਆਦ ਤੈਅ ਕਰੀਏ।",
    sample_romanization:
      "maujuda same di pabandi nu dekhde hoe, mera sujhaa hai ki asin pehlan zaruri hissa pura karie ate baaki lai navi miyaad tai karie.",
    sample_vi:
      "Xét ràng buộc thời gian hiện tại, đề xuất của tôi là trước hết hoàn thành phần cần thiết và đặt thời hạn mới cho phần còn lại.",
    sample_en:
      "Given the current time constraint, my suggestion is that we complete the essential part first and set a new deadline for the rest.",
    guard_phrases: [
      {
        gurmukhi: "ਮੇਰਾ ਸੁਝਾਅ ਹੈ",
        romanization: "mera sujhaa hai",
        vi: "Đề xuất của tôi là.",
        en: "My suggestion is.",
      },
      {
        gurmukhi: "ਨਵੀਂ ਮਿਆਦ ਤੈਅ ਕਰੀਏ",
        romanization: "navi miyaad tai karie",
        vi: "Ta đặt thời hạn mới.",
        en: "Let's set a new deadline.",
      },
    ],
    final_risks: [
      {
        risk_vi: "Nghe như một lời chỉ trích ngầm.",
        risk_en: "Sounds like a hidden criticism.",
        guard_vi: "Nói về ràng buộc và phương án, không nêu tên người.",
        guard_en: "Talk about the constraint and option, not the person.",
      },
    ],
    learner_trap: {
      trap_vi: "Chỉ đổ lỗi cho người làm chậm.",
      trap_en: "Only blaming the person who is late.",
      repair_vi: "Giữ giọng trang trọng và tập trung vào ਮਿਆਦ.",
      repair_en: "Keep the tone formal and focus on ਮਿਆਦ.",
    },
  },
  {
    id: "pa_c2_stress_community_discourse",
    focus: "community_discourse",
    style: "final_qa",
    title_vi: "Stress test diễn ngôn cộng đồng",
    title_en: "Stress test community discourse",
    scenario_vi: "Bạn thông báo thay đổi trong nhóm cộng đồng đa thế hệ.",
    scenario_en: "You announce a change in a multigenerational community group.",
    task_vi: "Giữ ấm áp, cảm ơn, và nêu thay đổi rõ.",
    task_en: "Keep warmth, thank people, and state the change clearly.",
    sample_gurmukhi:
      "ਸਾਡੀ ਕਮਿਊਨਿਟੀ ਦੇ ਸਹਿਯੋਗ ਲਈ ਧੰਨਵਾਦ। ਅੱਜ ਦੀ ਮੀਟਿੰਗ ਨਵੇਂ ਕਮਰੇ ਵਿੱਚ ਹੋਵੇਗੀ, ਅਤੇ ਅਸੀਂ ਸਭ ਨੂੰ ਉੱਥੇ ਮਿਲਾਂਗੇ।",
    sample_romanization:
      "sadi community de sahiyog lai dhanvaad. ajj di meeting nave kamre vich hovegi, ate asin sabh nu utthe milange.",
    sample_vi:
      "Cảm ơn sự hợp tác của cộng đồng chúng ta. Buổi họp hôm nay sẽ ở phòng mới, và chúng ta sẽ gặp mọi người ở đó.",
    sample_en:
      "Thank you for our community's cooperation. Today's meeting will be in the new room, and we will meet everyone there.",
    guard_phrases: [
      {
        gurmukhi: "ਕਮਿਊਨਿਟੀ ਦੇ ਸਹਿਯੋਗ ਲਈ ਧੰਨਵਾਦ",
        romanization: "community de sahiyog lai dhanvaad",
        vi: "Cảm ơn sự hợp tác của cộng đồng.",
        en: "Thank you for the community's cooperation.",
      },
      {
        gurmukhi: "ਅਸੀਂ ਸਭ ਨੂੰ ਉੱਥੇ ਮਿਲਾਂਗੇ",
        romanization: "asin sabh nu utthe milange",
        vi: "Chúng ta sẽ gặp mọi người ở đó.",
        en: "We will meet everyone there.",
      },
    ],
    final_risks: [
      {
        risk_vi: "Thông báo quá lạnh, thiếu kết nối cộng đồng.",
        risk_en: "The announcement feels cold and disconnected.",
        guard_vi: "Thêm cảm ơn và ngôn ngữ chung của nhóm.",
        guard_en: "Add thanks and shared-group language.",
      },
    ],
    learner_trap: {
      trap_vi: "Làm thông báo như giấy nhắc việc hành chính.",
      trap_en: "Making the announcement sound like an admin notice.",
      repair_vi: "Giữ ấm áp cộng đồng và thông tin rõ.",
      repair_en: "Keep community warmth and clear information.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_stress_professional_discourse",
    focus: "professional_discourse",
    style: "final_risk",
    title_vi: "Stress test sửa hiểu nhầm chuyên nghiệp",
    title_en: "Stress test professional repair",
    scenario_vi: "Email bị hiểu là phê bình, nhưng ý định là làm rõ phạm vi.",
    scenario_en: "An email is read as criticism, but the intent was to clarify scope.",
    task_vi: "Thừa nhận tác động, làm rõ ý định, và đề xuất bước sửa.",
    task_en: "Acknowledge impact, clarify intent, and propose a repair step.",
    sample_gurmukhi:
      "ਜੇ ਮੇਰਾ ਪਿਛਲਾ ਸੁਨੇਹਾ ਆਲੋਚਨਾ ਵਾਂਗ ਲੱਗਿਆ ਹੋਵੇ ਤਾਂ ਮੈਂ ਸਪਸ਼ਟ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ ਕਿ ਮੇਰਾ ਮਕਸਦ ਸਿਰਫ਼ ਕੰਮ ਦੀ ਹੱਦ ਸਾਫ਼ ਕਰਨਾ ਸੀ। ਆਓ ਇਸ ਨੂੰ ਨਵੇਂ ਨੋਟ ਵਿੱਚ ਹੋਰ ਸਪਸ਼ਟ ਕਰੀਏ।",
    sample_romanization:
      "je mera pichhla suneha alochna vaang laggia hove taan main spasht karna chaunda haan ki mera maqsad sirf kamm di hadd saaf karna si. aao is nu nave note vich hor spasht karie.",
    sample_vi:
      "Nếu tin nhắn trước của tôi nghe như lời phê bình, tôi muốn làm rõ rằng mục đích của tôi chỉ là làm rõ phạm vi công việc. Ta hãy làm nó rõ hơn trong ghi chú mới.",
    sample_en:
      "If my previous message sounded like criticism, I want to clarify that my purpose was only to define the work scope. Let's make it clearer in a new note.",
    guard_phrases: [
      {
        gurmukhi: "ਜੇ ਮੇਰਾ ਪਿਛਲਾ ਸੁਨੇਹਾ",
        romanization: "je mera pichhla suneha",
        vi: "Nếu tin nhắn trước của tôi.",
        en: "If my previous message.",
      },
      {
        gurmukhi: "ਮੇਰਾ ਮਕਸਦ ਸਿਰਫ਼",
        romanization: "mera maqsad sirf",
        vi: "Mục đích của tôi chỉ là.",
        en: "My purpose was only.",
      },
    ],
    final_risks: [
      {
        risk_vi: "Chỉ nói 'bạn hiểu sai' sẽ làm tăng phòng vệ.",
        risk_en: "Only saying 'you misunderstood' increases defensiveness.",
        guard_vi: "Thừa nhận cách câu có thể được nghe trước khi làm rõ.",
        guard_en: "Acknowledge how it may have sounded before clarifying.",
      },
    ],
    learner_trap: {
      trap_vi: "Phản ứng phòng thủ ngay lập tức.",
      trap_en: "Reacting defensively right away.",
      repair_vi: "Nói tác động trước, ý định sau.",
      repair_en: "Name the impact first, then the intent.",
    },
  },
  {
    id: "pa_c2_stress_public_discourse",
    focus: "public_discourse",
    style: "stress_test",
    title_vi: "Stress test thông báo công khai Canada",
    title_en: "Stress test Canadian public notice",
    scenario_vi: "Sự kiện đổi phòng vì thời tiết; cần báo rõ cho công chúng.",
    scenario_en: "An event changes rooms because of weather; the public must be informed clearly.",
    task_vi: "Nêu thay đổi, lý do ngắn, và hành động cần làm.",
    task_en: "State the change, brief reason, and required action.",
    sample_gurmukhi:
      "ਮੌਸਮ ਦੇ ਕਾਰਨ ਅੱਜ ਦਾ ਪ੍ਰੋਗਰਾਮ ਨਵੇਂ ਹਾਲ ਵਿੱਚ ਹੋਵੇਗਾ। ਕਿਰਪਾ ਕਰਕੇ ਮੁੱਖ ਦਰਵਾਜ਼ੇ ਤੋਂ ਅੰਦਰ ਆਓ; ਸਮਾਂ ਪਹਿਲਾਂ ਵਾਂਗ ਹੀ ਰਹੇਗਾ।",
    sample_romanization:
      "mausam de karan ajj da program nave hall vich hovega. kirpa karke mukh darwaze ton andar aao; sama pehlan vaang hi rahega.",
    sample_vi:
      "Do thời tiết, chương trình hôm nay sẽ diễn ra ở hội trường mới. Vui lòng vào từ cửa chính; thời gian vẫn như cũ.",
    sample_en:
      "Because of the weather, today's program will be in the new hall. Please enter through the main door; the time will remain the same.",
    guard_phrases: [
      {
        gurmukhi: "ਮੌਸਮ ਦੇ ਕਾਰਨ",
        romanization: "mausam de karan",
        vi: "Do thời tiết.",
        en: "Because of the weather.",
      },
      {
        gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਮੁੱਖ ਦਰਵਾਜ਼ੇ ਤੋਂ ਅੰਦਰ ਆਓ",
        romanization: "kirpa karke mukh darwaze ton andar aao",
        vi: "Vui lòng vào từ cửa chính.",
        en: "Please enter through the main door.",
      },
    ],
    final_risks: [
      {
        risk_vi: "Giải thích dài nhưng không có hành động cụ thể.",
        risk_en: "Long explanation without a concrete action.",
        guard_vi: "Thêm change + reason + action.",
        guard_en: "Include change + reason + action.",
      },
    ],
    learner_trap: {
      trap_vi: "Đổ thêm chi tiết gây rối.",
      trap_en: "Adding unnecessary detail that confuses people.",
      repair_vi: "Giữ thông báo ngắn, rõ, và chỉ dẫn.",
      repair_en: "Keep the notice short, clear, and directive.",
    },
    canada_practical: true,
  },
];

export const discourseStressTestsC2ByFocus = (
  focus: PunjabiC2StressFocus,
): PunjabiC2DiscourseStressTest[] =>
  discourseStressTestsC2.filter((item) => item.focus === focus);
