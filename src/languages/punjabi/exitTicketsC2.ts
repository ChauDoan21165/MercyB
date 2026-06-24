// Punjabi C2 exit tickets for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support exit tickets, not certification, official
// placement, legal/HR/medical/safety advice, or native-reviewed authority.
// Native review is deferred. Shahmukhi is mentioned only for script awareness,
// not as a full course.

export type PunjabiC2ExitFocus =
  | "nuanced_disagreement"
  | "negotiation"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "sensitive_topic_framing"
  | "audience_adaptation"
  | "advanced_register"
  | "community_discourse"
  | "professional_discourse"
  | "public_discourse";

export type PunjabiC2ExitStyle = "exit_ticket" | "final_proof" | "final_qa";

export type PunjabiC2ExitPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2ExitProof = {
  proof_vi: string;
  proof_en: string;
  signal_gurmukhi: string;
  signal_romanization: string;
};

export type PunjabiC2ExitTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2ExitTicket = {
  id: string;
  focus: PunjabiC2ExitFocus;
  style: PunjabiC2ExitStyle;
  title_vi: string;
  title_en: string;
  situation_vi: string;
  situation_en: string;
  task_vi: string;
  task_en: string;
  target_gurmukhi: string;
  target_romanization: string;
  target_vi: string;
  target_en: string;
  quick_phrases: PunjabiC2ExitPhrase[];
  final_proof: PunjabiC2ExitProof[];
  learner_trap?: PunjabiC2ExitTrap;
  canada_practical?: boolean;
};

export const C2_EXIT_TICKETS_DISCLAIMER = {
  vi: "Các vé thoát Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "These C2 Punjabi exit tickets support study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const exitTicketsC2: PunjabiC2ExitTicket[] = [
  {
    id: "pa_c2_exit_nuanced_disagreement",
    focus: "nuanced_disagreement",
    style: "exit_ticket",
    title_vi: "Rời bài với bất đồng có sắc thái",
    title_en: "Exit with nuanced disagreement",
    situation_vi: "Bạn nghe một đề xuất có mục tiêu tốt nhưng bằng chứng còn thiếu.",
    situation_en: "You hear a proposal with a good goal but incomplete evidence.",
    task_vi: "Viết một câu công nhận mục tiêu rồi nêu điều cần làm rõ.",
    task_en: "Write one sentence that validates the goal, then names what needs clarification.",
    target_gurmukhi:
      "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ, ਪਰ ਸਬੂਤ ਹੋਰ ਸਪਸ਼ਟ ਹੋਣ ਤਾਂ ਫ਼ੈਸਲਾ ਹੋਰ ਮਜ਼ਬੂਤ ਹੋਵੇਗਾ।",
    target_romanization:
      "maqsad naal main sahimat haan, par sabut hor spasht hon taan faisla hor mazbut hovega.",
    target_vi:
      "Tôi đồng ý với mục tiêu, nhưng nếu bằng chứng rõ hơn thì quyết định sẽ mạnh hơn.",
    target_en:
      "I agree with the goal, but if the evidence is clearer, the decision will be stronger.",
    quick_phrases: [
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
    final_proof: [
      {
        proof_vi: "Có công nhận và điều kiện về bằng chứng.",
        proof_en: "Has validation and an evidence condition.",
        signal_gurmukhi: "ਸਬੂਤ",
        signal_romanization: "sabut",
      },
    ],
    learner_trap: {
      trap_vi: "Chỉ nói 'không đúng' không đạt C2.",
      trap_en: "Only saying 'not correct' is not C2-level control.",
      repair_vi: "Thêm công nhận và tiêu chí bằng chứng.",
      repair_en: "Add validation and an evidence criterion.",
    },
  },
  {
    id: "pa_c2_exit_negotiation_canada",
    focus: "negotiation",
    style: "final_proof",
    title_vi: "Vé thoát đàm phán dịch vụ công Canada",
    title_en: "Exit ticket for Canadian public-service negotiation",
    situation_vi: "Bạn thiếu bản gốc nhưng có bản sao và email xác nhận.",
    situation_en: "You lack the original but have a copy and confirmation email.",
    task_vi: "Tôn trọng quy định và hỏi bước tiếp theo.",
    task_en: "Respect the rule and ask for the next step.",
    target_gurmukhi:
      "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਅਤੇ ਪੁਸ਼ਟੀ ਵਾਲਾ ਈਮੇਲ ਹੈ; ਅਗਲਾ ਕਦਮ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
    target_romanization:
      "mainu niyam di samajh hai. is vele mere kol copy ate pushti wala email hai; agla kadam ki ho sakda hai?",
    target_vi:
      "Tôi hiểu quy định. Hiện tôi có bản sao và email xác nhận; bước tiếp theo có thể là gì?",
    target_en:
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
    final_proof: [
      {
        proof_vi: "Không đòi ngoại lệ; có quy định và bước tiếp theo.",
        proof_en: "Does not demand an exception; includes rule and next step.",
        signal_gurmukhi: "ਨਿਯਮ",
        signal_romanization: "niyam",
      },
    ],
    learner_trap: {
      trap_vi: "Phàn nàn về quy định thay vì hỏi lựa chọn.",
      trap_en: "Complaining about the rule instead of asking for options.",
      repair_vi: "Nêu giấy tờ đang có rồi hỏi ਅਗਲਾ ਕਦਮ.",
      repair_en: "State available documents, then ask ਅਗਲਾ ਕਦਮ.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_exit_diplomacy",
    focus: "diplomacy",
    style: "final_qa",
    title_vi: "Vé thoát từ chối ngoại giao",
    title_en: "Exit ticket for diplomatic refusal",
    situation_vi: "Bạn không thể nhận lời mời nhưng muốn giữ thiện chí.",
    situation_en: "You cannot accept an invitation but want to preserve goodwill.",
    task_vi: "Cảm ơn, giới hạn hiện tại, mở dịp sau.",
    task_en: "Thank, set the present limit, and leave a future opening.",
    target_gurmukhi:
      "ਤੁਹਾਡੇ ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਲਈ ਸ਼ਾਮਲ ਹੋਣਾ ਸੰਭਵ ਨਹੀਂ ਹੋਵੇਗਾ, ਪਰ ਅਗਲੇ ਮੌਕੇ ਲਈ ਖੁਸ਼ੀ ਰਹੇਗੀ।",
    target_romanization:
      "tuhade sadde lai dhanvaad. is vele mere lai shamil hona sambhav nahin hovega, par agle mauke lai khushi rahegi.",
    target_vi:
      "Cảm ơn lời mời của anh/chị. Hiện tại tôi không thể tham gia, nhưng tôi sẽ rất vui cho dịp sau.",
    target_en:
      "Thank you for the invitation. At the moment I will not be able to join, but I would be happy for a future opportunity.",
    quick_phrases: [
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
        en: "For a future opportunity.",
      },
    ],
    final_proof: [
      {
        proof_vi: "Từ chối mềm bằng cảm ơn và cơ hội tương lai.",
        proof_en: "Softens refusal through thanks and future opportunity.",
        signal_gurmukhi: "ਧੰਨਵਾਦ",
        signal_romanization: "dhanvaad",
      },
    ],
    learner_trap: {
      trap_vi: "Dịch 'I refuse' quá cứng.",
      trap_en: "Translating 'I refuse' too bluntly.",
      repair_vi: "Dùng ਇਸ ਵੇਲੇ and ਅਗਲਾ ਮੌਕਾ.",
      repair_en: "Use ਇਸ ਵੇਲੇ and ਅਗਲਾ ਮੌਕਾ.",
    },
  },
  {
    id: "pa_c2_exit_mediation",
    focus: "mediation",
    style: "exit_ticket",
    title_vi: "Vé thoát hòa giải hai phía",
    title_en: "Exit ticket for two-sided mediation",
    situation_vi: "Hai bên bất đồng về thời gian và chất lượng.",
    situation_en: "Two sides disagree about time and quality.",
    task_vi: "Tóm tắt hai phía mà không chọn phe.",
    task_en: "Summarize both sides without taking sides.",
    target_gurmukhi:
      "ਇੱਕ ਪਾਸੇ ਸਮੇਂ ਦੀ ਚਿੰਤਾ ਹੈ, ਅਤੇ ਦੂਜੇ ਪਾਸੇ ਗੁਣਵੱਤਾ ਦੀ ਚਿੰਤਾ ਹੈ। ਆਓ ਦੋਵੇਂ ਗੱਲਾਂ ਨੂੰ ਸਾਫ਼ ਕਰੀਏ।",
    target_romanization:
      "ikk pase same di chinta hai, ate duje pase gunvatta di chinta hai. aao dovein gallan nu saaf karie.",
    target_vi:
      "Một phía lo về thời gian, và phía kia lo về chất lượng. Ta hãy làm rõ cả hai việc.",
    target_en:
      "One side is concerned about time, and the other side is concerned about quality. Let's clarify both points.",
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
    final_proof: [
      {
        proof_vi: "Cấu trúc song song thể hiện trung lập.",
        proof_en: "Parallel structure shows neutrality.",
        signal_gurmukhi: "ਇੱਕ ਪਾਸੇ",
        signal_romanization: "ikk pase",
      },
    ],
    learner_trap: {
      trap_vi: "Tóm tắt như một bên đúng và một bên sai.",
      trap_en: "Summarizing one side as right and the other as wrong.",
      repair_vi: "Dùng ਇੱਕ ਪਾਸੇ / ਦੂਜੇ ਪਾਸੇ.",
      repair_en: "Use ਇੱਕ ਪਾਸੇ / ਦੂਜੇ ਪਾਸੇ.",
    },
  },
  {
    id: "pa_c2_exit_deescalation",
    focus: "deescalation",
    style: "final_proof",
    title_vi: "Vé thoát hạ nhiệt cuộc họp",
    title_en: "Exit ticket for meeting de-escalation",
    situation_vi: "Mọi người nói chồng lên nhau trong cuộc họp cộng đồng.",
    situation_en: "People are speaking over each other in a community meeting.",
    task_vi: "Đề xuất nghe từng lượt và nhắc mục tiêu chung.",
    task_en: "Suggest turn-taking and remind everyone of the shared goal.",
    target_gurmukhi:
      "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ। ਸਾਡਾ ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ, ਇਸ ਲਈ ਬਾਰੀ-ਬਾਰੀ ਗੱਲ ਕਰੀਏ।",
    target_romanization:
      "aao ikk-ikk gall sunie. sada maqsad hall labhna hai, is lai baari-baari gall karie.",
    target_vi:
      "Ta hãy nghe từng ý một. Mục tiêu của chúng ta là tìm giải pháp, vì vậy hãy nói lần lượt.",
    target_en:
      "Let's hear one point at a time. Our goal is to find a solution, so let's speak in turn.",
    quick_phrases: [
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
    final_proof: [
      {
        proof_vi: "Hạ nhiệt bằng quy trình thay vì ra lệnh.",
        proof_en: "De-escalates through process instead of command.",
        signal_gurmukhi: "ਬਾਰੀ-ਬਾਰੀ",
        signal_romanization: "baari-baari",
      },
    ],
    learner_trap: {
      trap_vi: "Nói 'bình tĩnh đi' làm tăng căng thẳng.",
      trap_en: "Saying 'calm down' can increase tension.",
      repair_vi: "Dùng quy trình nghe từng lượt.",
      repair_en: "Use a turn-taking listening process.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_exit_sensitive_topic",
    focus: "sensitive_topic_framing",
    style: "final_qa",
    title_vi: "Vé thoát chủ đề nhạy cảm",
    title_en: "Exit ticket for sensitive-topic framing",
    situation_vi: "Nhóm chia việc cho sự kiện, cần tránh gán vai theo tuổi, giới, hoặc gia đình.",
    situation_en: "A group divides event work and must avoid assigning roles by age, gender, or family.",
    task_vi: "Đưa tiêu chí trung tính: sở thích, thời gian, mức thoải mái.",
    task_en: "Use neutral criteria: interest, availability, comfort level.",
    target_gurmukhi:
      "ਅਸੀਂ ਕੰਮ ਰੁਚੀ, ਸਮੇਂ ਅਤੇ ਸੁਵਿਧਾ ਦੇ ਅਨੁਸਾਰ ਵੰਡ ਸਕਦੇ ਹਾਂ, ਕਿਸੇ ਦੀ ਉਮਰ ਜਾਂ ਪਰਿਵਾਰਕ ਭੂਮਿਕਾ ਦੇ ਆਧਾਰ ਤੇ ਨਹੀਂ।",
    target_romanization:
      "asin kamm ruchi, same ate suvidha de anusaar vand sakde haan, kise di umar jaan parivaarak bhoomika de adhar te nahin.",
    target_vi:
      "Chúng ta có thể chia việc theo sở thích, thời gian và mức thuận tiện, không dựa trên tuổi hay vai trò gia đình của ai.",
    target_en:
      "We can divide the work by interest, availability, and comfort, not based on anyone's age or family role.",
    quick_phrases: [
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
    final_proof: [
      {
        proof_vi: "Có tiêu chí trung tính và loại bỏ định kiến.",
        proof_en: "Includes neutral criteria and excludes stereotypes.",
        signal_gurmukhi: "ਰੁਚੀ, ਸਮੇਂ ਅਤੇ ਸੁਵਿਧਾ",
        signal_romanization: "ruchi, same ate suvidha",
      },
    ],
    learner_trap: {
      trap_vi: "Dùng nhãn xã hội để phân công nhanh.",
      trap_en: "Using social labels to assign tasks quickly.",
      repair_vi: "Chuyển sang tiêu chí tự nguyện và thuận tiện.",
      repair_en: "Shift to voluntary and comfort-based criteria.",
    },
  },
  {
    id: "pa_c2_exit_audience_adaptation",
    focus: "audience_adaptation",
    style: "exit_ticket",
    title_vi: "Vé thoát điều chỉnh theo người nghe",
    title_en: "Exit ticket for audience adaptation",
    situation_vi: "Bạn cần nêu ý khác với người lớn tuổi hoặc trưởng nhóm.",
    situation_en: "You need to offer a different view to an elder or group lead.",
    task_vi: "Giữ kính trọng, nêu góc nhìn nhỏ, tránh sửa lưng.",
    task_en: "Keep respect, offer a small perspective, and avoid sounding corrective.",
    target_gurmukhi:
      "ਤੁਹਾਡੀ ਗੱਲ ਦੀ ਕਦਰ ਹੈ। ਮੇਰਾ ਇੱਕ ਛੋਟਾ ਜਿਹਾ ਨਜ਼ਰੀਆ ਹੈ ਕਿ ਅਸੀਂ ਇਹ ਪੱਖ ਵੀ ਵੇਖ ਸਕਦੇ ਹਾਂ।",
    target_romanization:
      "tuhadi gall di kadar hai. mera ikk chhota jiha nazaria hai ki asin ih pakh vi vekh sakde haan.",
    target_vi:
      "Tôi trân trọng ý của bác/anh/chị. Tôi có một góc nhìn nhỏ là chúng ta cũng có thể xem mặt này.",
    target_en:
      "I value your point. I have one small perspective: we could also look at this side.",
    quick_phrases: [
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
    final_proof: [
      {
        proof_vi: "Người nghe được tôn trọng trước khi thêm góc nhìn.",
        proof_en: "The audience is respected before adding a perspective.",
        signal_gurmukhi: "ਕਦਰ",
        signal_romanization: "kadar",
      },
    ],
    learner_trap: {
      trap_vi: "Tưởng kính trọng nghĩa là im lặng tuyệt đối.",
      trap_en: "Assuming respect means total silence.",
      repair_vi: "Dùng ਕਦਰ plus ਨਜ਼ਰੀਆ.",
      repair_en: "Use ਕਦਰ plus ਨਜ਼ਰੀਆ.",
    },
  },
  {
    id: "pa_c2_exit_advanced_register",
    focus: "advanced_register",
    style: "final_proof",
    title_vi: "Vé thoát đăng ký chuyên nghiệp",
    title_en: "Exit ticket for advanced professional register",
    situation_vi: "Bạn cần đổi hạn công việc mà không đổ lỗi.",
    situation_en: "You need to change a work deadline without assigning blame.",
    task_vi: "Nêu ràng buộc, đề xuất phương án, giữ giọng trang trọng.",
    task_en: "Name the constraint, propose an option, and keep formal tone.",
    target_gurmukhi:
      "ਮੌਜੂਦਾ ਸਮੇਂ ਦੀ ਪਾਬੰਦੀ ਨੂੰ ਦੇਖਦੇ ਹੋਏ, ਮੇਰਾ ਸੁਝਾਅ ਹੈ ਕਿ ਅਸੀਂ ਪਹਿਲਾਂ ਜ਼ਰੂਰੀ ਹਿੱਸਾ ਪੂਰਾ ਕਰੀਏ ਅਤੇ ਬਾਕੀ ਲਈ ਨਵੀਂ ਮਿਆਦ ਤੈਅ ਕਰੀਏ।",
    target_romanization:
      "maujuda same di pabandi nu dekhde hoe, mera sujhaa hai ki asin pehlan zaruri hissa pura karie ate baaki lai navi miyaad tai karie.",
    target_vi:
      "Xét ràng buộc thời gian hiện tại, đề xuất của tôi là trước hết hoàn thành phần cần thiết và đặt thời hạn mới cho phần còn lại.",
    target_en:
      "Given the current time constraint, my suggestion is that we complete the essential part first and set a new deadline for the rest.",
    quick_phrases: [
      {
        gurmukhi: "ਮੌਜੂਦਾ ਸਮੇਂ ਦੀ ਪਾਬੰਦੀ",
        romanization: "maujuda same di pabandi",
        vi: "Ràng buộc thời gian hiện tại.",
        en: "The current time constraint.",
      },
      {
        gurmukhi: "ਮੇਰਾ ਸੁਝਾਅ ਹੈ",
        romanization: "mera sujhaa hai",
        vi: "Đề xuất của tôi là.",
        en: "My suggestion is.",
      },
    ],
    final_proof: [
      {
        proof_vi: "Giọng trang trọng tập trung vào ràng buộc và phương án.",
        proof_en: "Formal tone focuses on constraint and option.",
        signal_gurmukhi: "ਸੁਝਾਅ",
        signal_romanization: "sujhaa",
      },
    ],
    learner_trap: {
      trap_vi: "Nêu tên người gây chậm trễ.",
      trap_en: "Naming the person who caused the delay.",
      repair_vi: "Nói về ਪਾਬੰਦੀ and ਮਿਆਦ.",
      repair_en: "Talk about ਪਾਬੰਦੀ and ਮਿਆਦ.",
    },
  },
  {
    id: "pa_c2_exit_community_discourse",
    focus: "community_discourse",
    style: "exit_ticket",
    title_vi: "Vé thoát diễn ngôn cộng đồng",
    title_en: "Exit ticket for community discourse",
    situation_vi: "Bạn thông báo thay đổi trong nhóm cộng đồng có nhiều độ tuổi.",
    situation_en: "You announce a change in a multigenerational community group.",
    task_vi: "Giữ ấm áp, cảm ơn, và nêu thay đổi rõ.",
    task_en: "Keep warmth, thank people, and state the change clearly.",
    target_gurmukhi:
      "ਸਾਡੀ ਕਮਿਊਨਿਟੀ ਦੇ ਸਹਿਯੋਗ ਲਈ ਧੰਨਵਾਦ। ਅੱਜ ਦੀ ਮੀਟਿੰਗ ਨਵੇਂ ਕਮਰੇ ਵਿੱਚ ਹੋਵੇਗੀ, ਅਤੇ ਅਸੀਂ ਸਭ ਨੂੰ ਉੱਥੇ ਮਿਲਾਂਗੇ।",
    target_romanization:
      "sadi community de sahiyog lai dhanvaad. ajj di meeting nave kamre vich hovegi, ate asin sabh nu utthe milange.",
    target_vi:
      "Cảm ơn sự hợp tác của cộng đồng chúng ta. Buổi họp hôm nay sẽ ở phòng mới, và chúng ta sẽ gặp mọi người ở đó.",
    target_en:
      "Thank you for our community's cooperation. Today's meeting will be in the new room, and we will meet everyone there.",
    quick_phrases: [
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
    final_proof: [
      {
        proof_vi: "Có cảm ơn và thông tin thay đổi cụ thể.",
        proof_en: "Includes thanks and specific change information.",
        signal_gurmukhi: "ਸਹਿਯੋਗ ਲਈ ਧੰਨਵਾਦ",
        signal_romanization: "sahiyog lai dhanvaad",
      },
    ],
    learner_trap: {
      trap_vi: "Thông báo quá lạnh, thiếu kết nối cộng đồng.",
      trap_en: "The notice is too cold and lacks community connection.",
      repair_vi: "Thêm ਧੰਨਵਾਦ and người nghe chung.",
      repair_en: "Add ਧੰਨਵਾਦ and shared audience language.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_exit_professional_discourse",
    focus: "professional_discourse",
    style: "final_qa",
    title_vi: "Vé thoát sửa hiểu nhầm chuyên nghiệp",
    title_en: "Exit ticket for professional misunderstanding repair",
    situation_vi: "Email của bạn bị hiểu như phê bình, nhưng ý định là làm rõ phạm vi.",
    situation_en: "Your email was read as criticism, but your intent was to clarify scope.",
    task_vi: "Thừa nhận tác động, làm rõ ý định, đề xuất bước sửa.",
    task_en: "Acknowledge impact, clarify intent, and propose a repair step.",
    target_gurmukhi:
      "ਜੇ ਮੇਰਾ ਪਿਛਲਾ ਸੁਨੇਹਾ ਆਲੋਚਨਾ ਵਾਂਗ ਲੱਗਿਆ ਹੋਵੇ ਤਾਂ ਮੈਂ ਸਪਸ਼ਟ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ ਕਿ ਮੇਰਾ ਮਕਸਦ ਸਿਰਫ਼ ਕੰਮ ਦੀ ਹੱਦ ਸਾਫ਼ ਕਰਨਾ ਸੀ। ਆਓ ਇਸ ਨੂੰ ਨਵੇਂ ਨੋਟ ਵਿੱਚ ਹੋਰ ਸਪਸ਼ਟ ਕਰੀਏ।",
    target_romanization:
      "je mera pichhla suneha alochna vaang laggia hove taan main spasht karna chaunda haan ki mera maqsad sirf kamm di hadd saaf karna si. aao is nu nave note vich hor spasht karie.",
    target_vi:
      "Nếu tin nhắn trước của tôi nghe như lời phê bình, tôi muốn làm rõ rằng mục đích của tôi chỉ là làm rõ phạm vi công việc. Ta hãy làm nó rõ hơn trong ghi chú mới.",
    target_en:
      "If my previous message sounded like criticism, I want to clarify that my purpose was only to define the work scope. Let's make it clearer in a new note.",
    quick_phrases: [
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
    final_proof: [
      {
        proof_vi: "Có thừa nhận tác động trước khi giải thích ý định.",
        proof_en: "Acknowledges impact before explaining intent.",
        signal_gurmukhi: "ਜੇ",
        signal_romanization: "je",
      },
    ],
    learner_trap: {
      trap_vi: "Nói 'bạn hiểu sai' làm tăng phòng vệ.",
      trap_en: "Saying 'you misunderstood' increases defensiveness.",
      repair_vi: "Thừa nhận cách câu có thể được nghe rồi nói ਮਕਸਦ.",
      repair_en: "Acknowledge how it may have sounded, then state ਮਕਸਦ.",
    },
  },
  {
    id: "pa_c2_exit_public_discourse_canada",
    focus: "public_discourse",
    style: "final_proof",
    title_vi: "Vé thoát thông báo công khai Canada",
    title_en: "Exit ticket for Canadian public notice",
    situation_vi: "Sự kiện đổi phòng vì thời tiết; cần thông báo rõ cho công chúng.",
    situation_en: "An event changes room because of weather; the public notice must be clear.",
    task_vi: "Nêu thay đổi, lý do ngắn, và hành động cần làm.",
    task_en: "State the change, brief reason, and required action.",
    target_gurmukhi:
      "ਮੌਸਮ ਦੇ ਕਾਰਨ ਅੱਜ ਦਾ ਪ੍ਰੋਗਰਾਮ ਨਵੇਂ ਹਾਲ ਵਿੱਚ ਹੋਵੇਗਾ। ਕਿਰਪਾ ਕਰਕੇ ਮੁੱਖ ਦਰਵਾਜ਼ੇ ਤੋਂ ਅੰਦਰ ਆਓ; ਸਮਾਂ ਪਹਿਲਾਂ ਵਾਂਗ ਹੀ ਰਹੇਗਾ।",
    target_romanization:
      "mausam de karan ajj da program nave hall vich hovega. kirpa karke mukh darwaze ton andar aao; sama pehlan vaang hi rahega.",
    target_vi:
      "Do thời tiết, chương trình hôm nay sẽ diễn ra ở hội trường mới. Vui lòng vào từ cửa chính; thời gian vẫn như cũ.",
    target_en:
      "Because of the weather, today's program will be in the new hall. Please enter through the main door; the time will remain the same.",
    quick_phrases: [
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
    final_proof: [
      {
        proof_vi: "Có thay đổi, lý do, hành động, và thời gian giữ nguyên.",
        proof_en: "Includes change, reason, action, and unchanged time.",
        signal_gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ",
        signal_romanization: "kirpa karke",
      },
    ],
    learner_trap: {
      trap_vi: "Giải thích dài nhưng thiếu hành động cho người đọc.",
      trap_en: "Giving a long explanation but no reader action.",
      repair_vi: "Thêm ਕਿਰਪਾ ਕਰਕੇ plus hướng cụ thể.",
      repair_en: "Add ਕਿਰਪਾ ਕਰਕੇ plus concrete direction.",
    },
    canada_practical: true,
  },
];

export const exitTicketsC2ByFocus = (
  focus: PunjabiC2ExitFocus,
): PunjabiC2ExitTicket[] => exitTicketsC2.filter((ticket) => ticket.focus === focus);
