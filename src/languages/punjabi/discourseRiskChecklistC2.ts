// Punjabi C2 discourse risk checklist for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support checklist, not certification, official placement,
// legal/HR/medical/safety advice, or native-reviewed authority. Native review
// is deferred. Shahmukhi is mentioned only for script awareness, not as a full
// course.

export type PunjabiC2RiskFocus =
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
  | "public_discourse"
  | "public_service";

export type PunjabiC2RiskStyle = "final_stability" | "boundary" | "checklist" | "regression";

export type PunjabiC2RiskPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2RiskCheck = {
  check_vi: string;
  check_en: string;
  signal_vi: string;
  signal_en: string;
};

export type PunjabiC2RiskTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2DiscourseRiskChecklist = {
  id: string;
  focus: PunjabiC2RiskFocus;
  style: PunjabiC2RiskStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  risk_goal_vi: string;
  risk_goal_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  checklist_phrases: PunjabiC2RiskPhrase[];
  checks: PunjabiC2RiskCheck[];
  learner_trap?: PunjabiC2RiskTrap;
  canada_practical?: boolean;
};

export const C2_DISCOURSE_RISK_CHECKLIST_DISCLAIMER = {
  vi: "Danh sách kiểm tra rủi ro Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi discourse risk checklist supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const discourseRiskChecklistC2: PunjabiC2DiscourseRiskChecklist[] = [
  {
    id: "pa_c2_risk_nuanced_disagreement",
    focus: "nuanced_disagreement",
    style: "checklist",
    title_vi: "Kiểm tra rủi ro bất đồng tinh tế",
    title_en: "Risk checklist for nuanced disagreement",
    scenario_vi: "Bạn muốn phản biện mà không phủ định toàn bộ ý của người khác.",
    scenario_en: "You want to challenge a point without dismissing the other person's idea.",
    risk_goal_vi: "Bảo vệ sắc thái: công nhận trước, phản biện sau.",
    risk_goal_en: "Protect nuance: validate first, critique second.",
    sample_gurmukhi:
      "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ, ਪਰ ਅੰਕੜੇ ਅਜੇ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਪਸ਼ਟ ਨਹੀਂ ਹਨ, ਇਸ ਲਈ ਨਤੀਜੇ ਤੋਂ ਪਹਿਲਾਂ ਇੱਕ ਵਾਰੀ ਹੋਰ ਵੇਖੀਏ।",
    sample_romanization:
      "maqsad naal main sahimat haan, par ankare aje puri tarah spasht nahin han, is lai natije ton pehlan ikk vari hor vekhie.",
    sample_vi:
      "Tôi đồng ý với mục tiêu, nhưng số liệu vẫn chưa hoàn toàn rõ, vì vậy hãy xem lại một lần nữa trước khi kết luận.",
    sample_en:
      "I agree with the goal, but the numbers are not fully clear yet, so let's look once more before concluding.",
    checklist_phrases: [
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
    checks: [
      {
        check_vi: "Có công nhận trước khi phản biện không?",
        check_en: "Does validation come before critique?",
        signal_vi: "Có ਸਹਿਮਤ ਹਾਂ và ਵੇਖੀਏ.",
        signal_en: "Includes agree and let's look.",
      },
    ],
    learner_trap: {
      trap_vi: "Mở đầu bằng 'sai rồi' làm mất sắc thái.",
      trap_en: "Opening with 'that's wrong' loses nuance.",
      repair_vi: "Nêu mục tiêu chung rồi nhắc đến dữ liệu.",
      repair_en: "Name the shared goal, then mention data.",
    },
  },
  {
    id: "pa_c2_risk_negotiation_canada",
    focus: "negotiation",
    style: "boundary",
    title_vi: "Ranh giới an toàn cho đàm phán Canada",
    title_en: "Safety boundary for Canadian negotiation",
    scenario_vi: "Bạn chỉ có bản sao và email xác nhận ở quầy dịch vụ công.",
    scenario_en: "You only have a copy and a confirmation email at a public-service desk.",
    risk_goal_vi: "Nêu cái có, hỏi bước tiếp theo, không đòi ngoại lệ.",
    risk_goal_en: "State what you have, ask for the next step, and do not demand an exception.",
    sample_gurmukhi:
      "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਅਤੇ ਪੁਸ਼ਟੀ ਵਾਲਾ ਈਮੇਲ ਹੈ; ਅਗਲਾ ਕਦਮ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
    sample_romanization:
      "mainu niyam di samajh hai. is vele mere kol copy ate pushti wala email hai; agla kadam ki ho sakda hai?",
    sample_vi:
      "Tôi hiểu quy định. Hiện tôi có bản sao và email xác nhận; bước tiếp theo có thể là gì?",
    sample_en:
      "I understand the rule. Right now I have a copy and a confirmation email; what could the next step be?",
    checklist_phrases: [
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
        check_vi: "Có nói về cái đang có trước khi hỏi không?",
        check_en: "Does it name what you have before asking?",
        signal_vi: "Có copy và email xác nhận.",
        signal_en: "Includes copy and confirmation email.",
      },
    ],
    learner_trap: {
      trap_vi: "Đòi ngoại lệ ngay lập tức.",
      trap_en: "Demanding an exception immediately.",
      repair_vi: "Nêu giấy tờ có rồi hỏi cách đi tiếp.",
      repair_en: "State available documents, then ask how to proceed.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_risk_diplomacy",
    focus: "diplomacy",
    style: "final_stability",
    title_vi: "Ổn định ngoại giao khi từ chối",
    title_en: "Diplomatic stability when declining",
    scenario_vi: "Bạn không thể nhận lời mời nhưng muốn giữ thiện chí.",
    scenario_en: "You cannot accept an invitation but want to preserve goodwill.",
    risk_goal_vi: "Từ chối mềm, có cảm ơn, và mở khả năng sau.",
    risk_goal_en: "Decline softly with thanks and a future opening.",
    sample_gurmukhi:
      "ਤੁਹਾਡੇ ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਲਈ ਆਉਣਾ ਸੰਭਵ ਨਹੀਂ ਹੋਵੇਗਾ, ਪਰ ਅਗਲੇ ਮੌਕੇ ਲਈ ਮੈਨੂੰ ਖੁਸ਼ੀ ਰਹੇਗੀ।",
    sample_romanization:
      "tuhade sadde lai dhanvaad. is vele mere lai auna sambhav nahin hovega, par agle mauke lai mainu khushi rahegi.",
    sample_vi:
      "Cảm ơn lời mời. Hiện tại tôi không thể đến, nhưng tôi sẽ rất vui cho dịp sau.",
    sample_en:
      "Thank you for the invitation. At the moment I will not be able to come, but I would be happy for another time.",
    checklist_phrases: [
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
        check_vi: "Có thanks trước limit không?",
        check_en: "Does thanks come before the limit?",
        signal_vi: "Có ਧੰਨਵਾਦ và dịp sau.",
        signal_en: "Includes thanks and another time.",
      },
    ],
    learner_trap: {
      trap_vi: "Dịch 'I refuse' quá cứng.",
      trap_en: "Translating 'I refuse' too harshly.",
      repair_vi: "Dùng ਇਸ ਵੇਲੇ không thể và cảm ơn.",
      repair_en: "Use 'at the moment I cannot' plus thanks.",
    },
  },
  {
    id: "pa_c2_risk_mediation",
    focus: "mediation",
    style: "checklist",
    title_vi: "Kiểm tra rủi ro hòa giải",
    title_en: "Risk checklist for mediation",
    scenario_vi: "Hai bên bất đồng và bạn cần tóm tắt mà không chọn phe.",
    scenario_en: "Two sides disagree and you need to summarize without taking sides.",
    risk_goal_vi: "Nêu hai phía song song và quay về tiêu chí chung.",
    risk_goal_en: "State both sides in parallel and return to shared criteria.",
    sample_gurmukhi:
      "ਇੱਕ ਪਾਸੇ ਸਮੇਂ ਦੀ ਚਿੰਤਾ ਹੈ, ਅਤੇ ਦੂਜੇ ਪਾਸੇ ਗੁਣਵੱਤਾ ਦੀ ਚਿੰਤਾ ਹੈ। ਆਓ ਦੋਵੇਂ ਗੱਲਾਂ ਨੂੰ ਇੱਕੋ ਮਾਪਦੰਡ ਨਾਲ ਵੇਖੀਏ।",
    sample_romanization:
      "ikk pase same di chinta hai, ate duje pase gunvatta di chinta hai. aao dovein gallan nu ikko mapdand naal vekhie.",
    sample_vi:
      "Một phía lo về thời gian, và phía kia lo về chất lượng. Hãy xem cả hai theo cùng một tiêu chí.",
    sample_en:
      "One side is concerned about time, and the other side is concerned about quality. Let's look at both through the same criteria.",
    checklist_phrases: [
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
        check_en: "Does it present both sides in parallel?",
        signal_vi: "Có ਇੱਕ ਪਾਸੇ và ਦੂਜੇ ਪਾਸੇ.",
        signal_en: "Includes one side and the other side.",
      },
    ],
    learner_trap: {
      trap_vi: "Biến hòa giải thành phán quyết ai đúng.",
      trap_en: "Turning mediation into a judgment about who is right.",
      repair_vi: "Giữ song song và quay về tiêu chí chung.",
      repair_en: "Keep the parallel structure and return to shared criteria.",
    },
  },
  {
    id: "pa_c2_risk_deescalation",
    focus: "deescalation",
    style: "regression",
    title_vi: "Thụt lùi an toàn về hạ nhiệt",
    title_en: "Safe regression to de-escalation",
    scenario_vi: "Cuộc họp bắt đầu căng và mọi người nói chồng lên nhau.",
    scenario_en: "A meeting is getting tense and people are speaking over each other.",
    risk_goal_vi: "Đưa cuộc nói chuyện về lượt nói và mục tiêu chung.",
    risk_goal_en: "Bring the conversation back to turn-taking and the shared goal.",
    sample_gurmukhi:
      "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ। ਸਾਡਾ ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ, ਇਸ ਲਈ ਬਾਰੀ-ਬਾਰੀ ਗੱਲ ਕਰੀਏ।",
    sample_romanization:
      "aao ikk-ikk gall sunie. sada maqsad hall labhna hai, is lai baari-baari gall karie.",
    sample_vi:
      "Ta hãy nghe từng ý một. Mục tiêu của chúng ta là tìm giải pháp, vì vậy hãy nói lần lượt.",
    sample_en:
      "Let's hear one point at a time. Our goal is to find a solution, so let's speak in turn.",
    checklist_phrases: [
      {
        gurmukhi: "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ",
        romanization: "aao ikk-ikk gall sunie",
        vi: "Ta hãy nghe từng ý một.",
        en: "Let's hear one point at a time.",
      },
      {
        gurmukhi: "ਬਾਰੀ-ਬਾਰੀ",
        romanization: "baari-baari",
        vi: "Lần lượt.",
        en: "In turn.",
      },
    ],
    checks: [
      {
        check_vi: "Có quy trình thay vì mệnh lệnh cảm xúc không?",
        check_en: "Is there a process instead of an emotional command?",
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
    canada_practical: true,
  },
  {
    id: "pa_c2_risk_sensitive_topic",
    focus: "sensitive_topic_framing",
    style: "final_stability",
    title_vi: "Ổn định chủ đề nhạy cảm",
    title_en: "Stabilize a sensitive topic",
    scenario_vi: "Nhóm chia việc mà dễ gán vai theo tuổi, giới, hoặc gia đình.",
    scenario_en: "A group divides work and may assign roles by age, gender, or family.",
    risk_goal_vi: "Dùng tiêu chí trung tính và tránh định kiến.",
    risk_goal_en: "Use neutral criteria and avoid stereotypes.",
    sample_gurmukhi:
      "ਅਸੀਂ ਕੰਮ ਰੁਚੀ, ਸਮੇਂ ਅਤੇ ਸੁਵਿਧਾ ਦੇ ਅਨੁਸਾਰ ਵੰਡ ਸਕਦੇ ਹਾਂ, ਕਿਸੇ ਦੀ ਉਮਰ ਜਾਂ ਪਰਿਵਾਰਕ ਭੂਮਿਕਾ ਦੇ ਆਧਾਰ ਤੇ ਨਹੀਂ।",
    sample_romanization:
      "asin kamm ruchi, same ate suvidha de anusaar vand sakde haan, kise di umar jaan parivaarak bhoomika de adhar te nahin.",
    sample_vi:
      "Chúng ta có thể chia việc theo sở thích, thời gian và mức thuận tiện, không dựa trên tuổi hay vai trò gia đình của ai.",
    sample_en:
      "We can divide the work by interest, availability, and comfort, not based on anyone's age or family role.",
    checklist_phrases: [
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
    checks: [
      {
        check_vi: "Có tiêu chí trung tính thay nhãn xã hội không?",
        check_en: "Does it use neutral criteria instead of social labels?",
        signal_vi: "Có ਰੁਚੀ và ਸੁਵਿਧਾ.",
        signal_en: "Includes interest and comfort.",
      },
    ],
    learner_trap: {
      trap_vi: "Phân công nhanh bằng định kiến.",
      trap_en: "Assigning quickly with stereotypes.",
      repair_vi: "Chuyển sang tiêu chí tự nguyện và thuận tiện.",
      repair_en: "Switch to voluntary and comfort-based criteria.",
    },
  },
  {
    id: "pa_c2_risk_audience_adaptation",
    focus: "audience_adaptation",
    style: "boundary",
    title_vi: "Ranh giới cho điều chỉnh theo người nghe",
    title_en: "Boundary for audience adaptation",
    scenario_vi: "Bạn cần nêu ý khác với người lớn tuổi hoặc trưởng nhóm.",
    scenario_en: "You need to offer a different view to an elder or group lead.",
    risk_goal_vi: "Kính trọng trước, góc nhìn sau, không sửa lưng.",
    risk_goal_en: "Respect first, perspective after, without sounding corrective.",
    sample_gurmukhi:
      "ਤੁਹਾਡੀ ਗੱਲ ਦੀ ਕਦਰ ਹੈ। ਮੇਰਾ ਇੱਕ ਛੋਟਾ ਜਿਹਾ ਨਜ਼ਰੀਆ ਹੈ ਕਿ ਅਸੀਂ ਇਹ ਪੱਖ ਵੀ ਵੇਖ ਸਕਦੇ ਹਾਂ।",
    sample_romanization:
      "tuhadi gall di kadar hai. mera ikk chhota jiha nazaria hai ki asin ih pakh vi vekh sakde haan.",
    sample_vi:
      "Tôi trân trọng ý của anh/chị. Tôi có một góc nhìn nhỏ là chúng ta cũng có thể xem mặt này.",
    sample_en:
      "I value your point. I have one small perspective: we could also look at this side.",
    checklist_phrases: [
      {
        gurmukhi: "ਤੁਹਾਡੀ ਗੱਲ ਦੀ ਕਦਰ ਹੈ",
        romanization: "tuhadi gall di kadar hai",
        vi: "Tôi trân trọng ý của anh/chị.",
        en: "I value your point.",
      },
      {
        gurmukhi: "ਮੇਰਾ ਇੱਕ ਛੋਟਾ ਜਿਹਾ ਨਜ਼ਰੀਆ ਹੈ",
        romanization: "mera ikk chhota jiha nazaria hai",
        vi: "Tôi có một góc nhìn nhỏ.",
        en: "I have one small perspective.",
      },
    ],
    checks: [
      {
        check_vi: "Có validation trước perspective không?",
        check_en: "Does validation come before perspective?",
        signal_vi: "Có ਕਦਰ trước ਨਜ਼ਰੀਆ.",
        signal_en: "Validation comes before perspective.",
      },
    ],
    learner_trap: {
      trap_vi: "Tưởng kính trọng là im hẳn.",
      trap_en: "Assuming respect means total silence.",
      repair_vi: "Công nhận rồi mới thêm góc nhìn.",
      repair_en: "Validate first, then add perspective.",
    },
  },
  {
    id: "pa_c2_risk_advanced_register",
    focus: "advanced_register",
    style: "checklist",
    title_vi: "Kiểm tra đăng ký nâng cao",
    title_en: "Check advanced register",
    scenario_vi: "Bạn cần đổi hạn công việc mà không đổ lỗi.",
    scenario_en: "You need to change a work deadline without assigning blame.",
    risk_goal_vi: "Trang trọng, tập trung vào ràng buộc và phương án.",
    risk_goal_en: "Formal, focused on constraint and option.",
    sample_gurmukhi:
      "ਮੌਜੂਦਾ ਸਮੇਂ ਦੀ ਪਾਬੰਦੀ ਨੂੰ ਦੇਖਦੇ ਹੋਏ, ਮੇਰਾ ਸੁਝਾਅ ਹੈ ਕਿ ਅਸੀਂ ਪਹਿਲਾਂ ਜ਼ਰੂਰੀ ਹਿੱਸਾ ਪੂਰਾ ਕਰੀਏ ਅਤੇ ਬਾਕੀ ਲਈ ਨਵੀਂ ਮਿਆਦ ਤੈਅ ਕਰੀਏ।",
    sample_romanization:
      "maujuda same di pabandi nu dekhde hoe, mera sujhaa hai ki asin pehlan zaruri hissa pura karie ate baaki lai navi miyaad tai karie.",
    sample_vi:
      "Xét ràng buộc thời gian hiện tại, đề xuất của tôi là trước hết hoàn thành phần cần thiết và đặt thời hạn mới cho phần còn lại.",
    sample_en:
      "Given the current time constraint, my suggestion is that we complete the essential part first and set a new deadline for the rest.",
    checklist_phrases: [
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
    checks: [
      {
        check_vi: "Có nêu ràng buộc và phương án không?",
        check_en: "Does it name the constraint and the option?",
        signal_vi: "Có ਪਾਬੰਦੀ và ਸੁਝਾਅ.",
        signal_en: "Includes constraint and suggestion.",
      },
    ],
    learner_trap: {
      trap_vi: "Đổ lỗi trực tiếp cho người trễ.",
      trap_en: "Directly blaming the person who is late.",
      repair_vi: "Nói về ràng buộc và thời hạn.",
      repair_en: "Talk about the constraint and deadline.",
    },
  },
  {
    id: "pa_c2_risk_community",
    focus: "community_discourse",
    style: "final_stability",
    title_vi: "Ổn định giọng cộng đồng",
    title_en: "Stabilize community tone",
    scenario_vi: "Bạn đăng thông báo cho nhóm cộng đồng đa thế hệ.",
    scenario_en: "You are posting an announcement for a multigenerational community group.",
    risk_goal_vi: "Giữ ấm áp, rõ ràng, và không làm khó người đọc.",
    risk_goal_en: "Stay warm, clear, and not burdensome to the reader.",
    sample_gurmukhi:
      "ਸਾਡੀ ਕਮਿਊਨਿਟੀ ਦੇ ਸਹਿਯੋਗ ਲਈ ਧੰਨਵਾਦ। ਅੱਜ ਦੀ ਮੀਟਿੰਗ ਨਵੇਂ ਕਮਰੇ ਵਿੱਚ ਹੋਵੇਗੀ, ਅਤੇ ਅਸੀਂ ਸਭ ਨੂੰ ਉੱਥੇ ਮਿਲਾਂਗੇ।",
    sample_romanization:
      "sadi community de sahiyog lai dhanvaad. ajj di meeting nave kamre vich hovegi, ate asin sabh nu utthe milange.",
    sample_vi:
      "Cảm ơn sự hợp tác của cộng đồng chúng ta. Buổi họp hôm nay sẽ ở phòng mới, và chúng ta sẽ gặp mọi người ở đó.",
    sample_en:
      "Thank you for our community's cooperation. Today's meeting will be in the new room, and we will meet everyone there.",
    checklist_phrases: [
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
    checks: [
      {
        check_vi: "Có giọng cộng đồng thay vì hành chính lạnh không?",
        check_en: "Does it sound community-based rather than coldly administrative?",
        signal_vi: "Có ਧੰਨਵਾਦ và 'chúng ta'.",
        signal_en: "Includes thanks and 'we'.",
      },
    ],
    learner_trap: {
      trap_vi: "Làm thông báo như giấy nhắc việc.",
      trap_en: "Making the announcement sound like a notice board memo.",
      repair_vi: "Thêm ਧੰਨਵਾਦ và ngôn ngữ chung.",
      repair_en: "Add thanks and shared language.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_risk_professional",
    focus: "professional_discourse",
    style: "boundary",
    title_vi: "Ranh giới cho giọng chuyên nghiệp",
    title_en: "Boundary for professional tone",
    scenario_vi: "Email bị hiểu là phê bình, nhưng ý định là làm rõ phạm vi.",
    scenario_en: "An email is read as criticism, but the intent was to clarify scope.",
    risk_goal_vi: "Thừa nhận tác động, làm rõ ý định, và đề xuất sửa.",
    risk_goal_en: "Acknowledge impact, clarify intent, and propose a repair.",
    sample_gurmukhi:
      "ਜੇ ਮੇਰਾ ਪਿਛਲਾ ਸੁਨੇਹਾ ਆਲੋਚਨਾ ਵਾਂਗ ਲੱਗਿਆ ਹੋਵੇ ਤਾਂ ਮੈਂ ਸਪਸ਼ਟ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ ਕਿ ਮੇਰਾ ਮਕਸਦ ਸਿਰਫ਼ ਕੰਮ ਦੀ ਹੱਦ ਸਾਫ਼ ਕਰਨਾ ਸੀ। ਆਓ ਇਸ ਨੂੰ ਨਵੇਂ ਨੋਟ ਵਿੱਚ ਹੋਰ ਸਪਸ਼ਟ ਕਰੀਏ।",
    sample_romanization:
      "je mera pichhla suneha alochna vaang laggia hove taan main spasht karna chaunda haan ki mera maqsad sirf kamm di hadd saaf karna si. aao is nu nave note vich hor spasht karie.",
    sample_vi:
      "Nếu tin nhắn trước của tôi nghe như lời phê bình, tôi muốn làm rõ rằng mục đích của tôi chỉ là làm rõ phạm vi công việc. Ta hãy làm nó rõ hơn trong ghi chú mới.",
    sample_en:
      "If my previous message sounded like criticism, I want to clarify that my purpose was only to define the work scope. Let's make it clearer in a new note.",
    checklist_phrases: [
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
    checks: [
      {
        check_vi: "Có impact trước intent không?",
        check_en: "Does impact come before intent?",
        signal_vi: "Có ਜੇ ... ਲੱਗਿਆ ਹੋਵੇ.",
        signal_en: "Includes 'if my message sounded like...'.",
      },
    ],
    learner_trap: {
      trap_vi: "Chỉ nói 'bạn hiểu sai'.",
      trap_en: "Only saying 'you misunderstood'.",
      repair_vi: "Thừa nhận cách câu được nghe rồi nói mục đích.",
      repair_en: "Acknowledge how it was heard, then state intent.",
    },
  },
  {
    id: "pa_c2_risk_public",
    focus: "public_discourse",
    style: "final_stability",
    title_vi: "Ổn định giọng công khai",
    title_en: "Stabilize public tone",
    scenario_vi: "Sự kiện đổi phòng vì thời tiết; thông báo phải rõ cho công chúng.",
    scenario_en: "An event changes rooms because of weather; the notice must be clear for the public.",
    risk_goal_vi: "Ngắn, rõ, có thời gian và hành động.",
    risk_goal_en: "Short, clear, with time and action.",
    sample_gurmukhi:
      "ਮੌਸਮ ਦੇ ਕਾਰਨ ਅੱਜ ਦਾ ਪ੍ਰੋਗਰਾਮ ਨਵੇਂ ਹਾਲ ਵਿੱਚ ਹੋਵੇਗਾ। ਕਿਰਪਾ ਕਰਕੇ ਮੁੱਖ ਦਰਵਾਜ਼ੇ ਤੋਂ ਅੰਦਰ ਆਓ; ਸਮਾਂ ਪਹਿਲਾਂ ਵਾਂਗ ਹੀ ਰਹੇਗਾ।",
    sample_romanization:
      "mausam de karan ajj da program nave hall vich hovega. kirpa karke mukh darwaze ton andar aao; sama pehlan vaang hi rahega.",
    sample_vi:
      "Do thời tiết, chương trình hôm nay sẽ diễn ra ở hội trường mới. Vui lòng vào từ cửa chính; thời gian vẫn như cũ.",
    sample_en:
      "Because of the weather, today's program will be in the new hall. Please enter through the main door; the time will remain the same.",
    checklist_phrases: [
      {
        gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਮੁੱਖ ਦਰਵਾਜ਼ੇ ਤੋਂ ਅੰਦਰ ਆਓ",
        romanization: "kirpa karke mukh darwaze ton andar aao",
        vi: "Vui lòng vào từ cửa chính.",
        en: "Please enter through the main door.",
      },
      {
        gurmukhi: "ਸਮਾਂ ਪਹਿਲਾਂ ਵਾਂਗ ਹੀ ਰਹੇਗਾ",
        romanization: "sama pehlan vaang hi rahega",
        vi: "Thời gian vẫn như cũ.",
        en: "The time will remain the same.",
      },
    ],
    checks: [
      {
        check_vi: "Có thay đổi, chỉ dẫn, và thời gian không?",
        check_en: "Does it include change, direction, and time?",
        signal_vi: "Có vào cửa chính.",
        signal_en: "Includes main-door direction.",
      },
    ],
    learner_trap: {
      trap_vi: "Lý do quá dài làm loãng thông báo.",
      trap_en: "Too much explanation dilutes the notice.",
      repair_vi: "Giữ ngắn, rõ, và chỉ dẫn.",
      repair_en: "Keep it short, clear, and directive.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_risk_public_service",
    focus: "public_service",
    style: "checklist",
    title_vi: "Kiểm tra quầy dịch vụ công",
    title_en: "Public-service desk checklist",
    scenario_vi: "Bạn đang làm thủ tục và chỉ có bản sao cùng email xác nhận.",
    scenario_en: "You are at a service desk with only a copy and a confirmation email.",
    risk_goal_vi: "Lịch sự, nêu cái có, và hỏi bước tiếp theo thay vì đòi ngoại lệ.",
    risk_goal_en: "Be polite, state what you have, and ask for the next step instead of demanding an exception.",
    sample_gurmukhi:
      "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਅਤੇ ਪੁਸ਼ਟੀ ਵਾਲਾ ਈਮੇਲ ਹੈ; ਅਗਲਾ ਕਦਮ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
    sample_romanization:
      "mainu niyam di samajh hai. is vele mere kol copy ate pushti wala email hai; agla kadam ki ho sakda hai?",
    sample_vi:
      "Tôi hiểu quy định. Hiện tôi có bản sao và email xác nhận; bước tiếp theo có thể là gì?",
    sample_en:
      "I understand the rule. Right now I have a copy and a confirmation email; what could the next step be?",
    checklist_phrases: [
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
        check_vi: "Có nêu cái đang có trước khi hỏi không?",
        check_en: "Does it state what you have before asking?",
        signal_vi: "Có copy và email xác nhận.",
        signal_en: "Includes copy and confirmation email.",
      },
    ],
    learner_trap: {
      trap_vi: "Kêu đòi ngoại lệ.",
      trap_en: "Demanding an exception.",
      repair_vi: "Nêu giấy tờ có rồi hỏi bước tiếp theo.",
      repair_en: "State available documents, then ask the next step.",
    },
    canada_practical: true,
  },
];

export const discourseRiskChecklistC2ByFocus = (
  focus: PunjabiC2RiskFocus,
): PunjabiC2DiscourseRiskChecklist[] =>
  discourseRiskChecklistC2.filter((item) => item.focus === focus);
