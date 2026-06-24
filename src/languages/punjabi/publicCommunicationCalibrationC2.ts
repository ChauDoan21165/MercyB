// Punjabi C2 public communication calibration for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support calibration, not certification, official
// placement, legal/HR/medical/safety advice, or native-reviewed authority.
// Native review is deferred. Shahmukhi is mentioned only for script awareness,
// not as a full course.

export type PunjabiC2PublicFocus =
  | "community_discourse"
  | "professional_discourse"
  | "public_discourse"
  | "public_service"
  | "tense_conversation"
  | "diplomacy"
  | "deescalation"
  | "sensitive_topic_framing"
  | "audience_adaptation"
  | "advanced_register"
  | "negotiation";

export type PunjabiC2PublicStyle = "final_hardening" | "export_readiness" | "review" | "regression";

export type PunjabiC2PublicPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2PublicCheck = {
  check_vi: string;
  check_en: string;
  signal_vi: string;
  signal_en: string;
};

export type PunjabiC2PublicTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2PublicCommunicationCalibration = {
  id: string;
  focus: PunjabiC2PublicFocus;
  style: PunjabiC2PublicStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  calibration_goal_vi: string;
  calibration_goal_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  calibration_phrases: PunjabiC2PublicPhrase[];
  checks: PunjabiC2PublicCheck[];
  learner_trap?: PunjabiC2PublicTrap;
  canada_practical?: boolean;
};

export const C2_PUBLIC_COMMUNICATION_CALIBRATION_DISCLAIMER = {
  vi: "Gói hiệu chỉnh giao tiếp công khai Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi public communication calibration pack supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const publicCommunicationCalibrationC2: PunjabiC2PublicCommunicationCalibration[] = [
  {
    id: "pa_c2_public_final_hardening_community",
    focus: "community_discourse",
    style: "final_hardening",
    title_vi: "Cứng hóa thông báo cộng đồng",
    title_en: "Harden a community announcement",
    scenario_vi: "Bạn cần đăng thông báo thay đổi lịch họp cho cộng đồng đa thế hệ.",
    scenario_en: "You need to post a schedule change for a multigenerational community group.",
    calibration_goal_vi: "Giữ ấm áp, rõ ràng, và ngắn gọn.",
    calibration_goal_en: "Stay warm, clear, and concise.",
    sample_gurmukhi:
      "ਸਾਡੀ ਕਮਿਊਨਿਟੀ ਦੇ ਸਹਿਯੋਗ ਲਈ ਧੰਨਵਾਦ। ਅੱਜ ਦੀ ਮੀਟਿੰਗ ਨਵੇਂ ਕਮਰੇ ਵਿੱਚ ਹੋਵੇਗੀ, ਅਤੇ ਅਸੀਂ ਸਭ ਨੂੰ ਉੱਥੇ ਮਿਲਾਂਗੇ।",
    sample_romanization:
      "sadi community de sahiyog lai dhanvaad. ajj di meeting nave kamre vich hovegi, ate asin sabh nu utthe milange.",
    sample_vi:
      "Cảm ơn sự hợp tác của cộng đồng chúng ta. Buổi họp hôm nay sẽ ở phòng mới, và chúng ta sẽ gặp mọi người ở đó.",
    sample_en:
      "Thank you for our community's cooperation. Today's meeting will be in the new room, and we will meet everyone there.",
    calibration_phrases: [
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
        check_vi: "Có thay đổi, lý do ngắn, và hành động rõ không?",
        check_en: "Does it include the change, a brief reason, and a clear action?",
        signal_vi: "Có đổi phòng và chỉ dẫn.",
        signal_en: "Includes room change and direction.",
      },
    ],
    learner_trap: {
      trap_vi: "Viết quá hành chính làm mất giọng cộng đồng.",
      trap_en: "Writing too bureaucratically loses the community tone.",
      repair_vi: "Giữ ਧੰਨਵਾਦ và ngôn ngữ chung.",
      repair_en: "Keep thanks and shared-group language.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_public_export_readiness_service",
    focus: "public_service",
    style: "export_readiness",
    title_vi: "Sẵn sàng xuất bản cho dịch vụ công",
    title_en: "Export-ready public-service notice",
    scenario_vi: "Bạn phải thông báo thay đổi thủ tục cho người dân.",
    scenario_en: "You must announce a procedural change to the public.",
    calibration_goal_vi: "Tôn trọng quy định, nêu phương án tiếp theo, không gây áp lực.",
    calibration_goal_en: "Respect the rule, give the next option, and avoid pressure.",
    sample_gurmukhi:
      "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਅਤੇ ਪੁਸ਼ਟੀ ਵਾਲਾ ਈਮੇਲ ਹੈ; ਅਗਲਾ ਕਦਮ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
    sample_romanization:
      "mainu niyam di samajh hai. is vele mere kol copy ate pushti wala email hai; agla kadam ki ho sakda hai?",
    sample_vi:
      "Tôi hiểu quy định. Hiện tôi có bản sao và email xác nhận; bước tiếp theo có thể là gì?",
    sample_en:
      "I understand the rule. Right now I have a copy and a confirmation email; what could the next step be?",
    calibration_phrases: [
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
        check_vi: "Có tránh đòi ngoại lệ không?",
        check_en: "Does it avoid demanding an exception?",
        signal_vi: "Có quy định rồi mới hỏi.",
        signal_en: "Rule comes before the question.",
      },
    ],
    learner_trap: {
      trap_vi: "Đổ lỗi cho quầy tiếp nhận.",
      trap_en: "Blaming the front desk.",
      repair_vi: "Nói cái đang có rồi hỏi bước tiếp theo.",
      repair_en: "State what you have, then ask for the next step.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_public_review_diplomacy",
    focus: "diplomacy",
    style: "review",
    title_vi: "Rà soát câu từ ngoại giao",
    title_en: "Review diplomatic wording",
    scenario_vi: "Bạn phải từ chối lời mời nhưng vẫn giữ quan hệ tốt.",
    scenario_en: "You need to decline an invitation while preserving good relations.",
    calibration_goal_vi: "Từ chối mềm, có cảm ơn, và mở khả năng tương lai.",
    calibration_goal_en: "Decline softly with thanks and a future opening.",
    sample_gurmukhi:
      "ਤੁਹਾਡੇ ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਲਈ ਆਉਣਾ ਸੰਭਵ ਨਹੀਂ ਹੋਵੇਗਾ, ਪਰ ਅਗਲੇ ਮੌਕੇ ਲਈ ਮੈਨੂੰ ਖੁਸ਼ੀ ਰਹੇਗੀ।",
    sample_romanization:
      "tuhade sadde lai dhanvaad. is vele mere lai auna sambhav nahin hovega, par agle mauke lai mainu khushi rahegi.",
    sample_vi:
      "Cảm ơn lời mời. Hiện tại tôi không thể đến, nhưng tôi sẽ rất vui cho dịp sau.",
    sample_en:
      "Thank you for the invitation. At the moment I will not be able to come, but I would be happy for another time.",
    calibration_phrases: [
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
        check_vi: "Có cảm ơn trước khi nói không thể không?",
        check_en: "Does thanks come before the refusal?",
        signal_vi: "Có ਧੰਨਵਾਦ và ਅਗਲੇ ਮੌਕੇ.",
        signal_en: "Includes ਧੰਨਵਾਦ and another time.",
      },
    ],
    learner_trap: {
      trap_vi: "Dịch thẳng 'I refuse' quá cứng.",
      trap_en: "Translating 'I refuse' too bluntly.",
      repair_vi: "Dùng ਇਸ ਵੇਲੇ không thể và cảm ơn.",
      repair_en: "Use 'at the moment I cannot' plus thanks.",
    },
  },
  {
    id: "pa_c2_public_regression_deescalation",
    focus: "deescalation",
    style: "regression",
    title_vi: "Thụt lùi an toàn về hạ nhiệt",
    title_en: "Safe regression to de-escalation",
    scenario_vi: "Cuộc họp bắt đầu căng và mọi người nói chồng lên nhau.",
    scenario_en: "A meeting is getting tense and people are speaking over each other.",
    calibration_goal_vi: "Chuyển về quy trình thay vì ra lệnh cảm xúc.",
    calibration_goal_en: "Shift to process instead of emotional commands.",
    sample_gurmukhi:
      "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ। ਸਾਡਾ ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ, ਇਸ ਲਈ ਬਾਰੀ-ਬਾਰੀ ਗੱਲ ਕਰੀਏ।",
    sample_romanization:
      "aao ikk-ikk gall sunie. sada maqsad hall labhna hai, is lai baari-baari gall karie.",
    sample_vi:
      "Ta hãy nghe từng ý một. Mục tiêu của chúng ta là tìm giải pháp, vì vậy hãy nói lần lượt.",
    sample_en:
      "Let's hear one point at a time. Our goal is to find a solution, so let's speak in turn.",
    calibration_phrases: [
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
    checks: [
      {
        check_vi: "Có đề xuất quy trình nghe không?",
        check_en: "Does it propose a listening process?",
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
    id: "pa_c2_public_sensitive_topic_framing",
    focus: "sensitive_topic_framing",
    style: "final_hardening",
    title_vi: "Cứng hóa chủ đề nhạy cảm",
    title_en: "Harden sensitive-topic framing",
    scenario_vi: "Nhóm cần chia việc mà không gán vai theo tuổi, giới, hoặc gia đình.",
    scenario_en: "A group needs to divide work without assigning roles by age, gender, or family.",
    calibration_goal_vi: "Dùng tiêu chí trung tính và tránh định kiến.",
    calibration_goal_en: "Use neutral criteria and avoid stereotypes.",
    sample_gurmukhi:
      "ਅਸੀਂ ਕੰਮ ਰੁਚੀ, ਸਮੇਂ ਅਤੇ ਸੁਵਿਧਾ ਦੇ ਅਨੁਸਾਰ ਵੰਡ ਸਕਦੇ ਹਾਂ, ਕਿਸੇ ਦੀ ਉਮਰ ਜਾਂ ਪਰਿਵਾਰਕ ਭੂਮਿਕਾ ਦੇ ਆਧਾਰ ਤੇ ਨਹੀਂ।",
    sample_romanization:
      "asin kamm ruchi, same ate suvidha de anusaar vand sakde haan, kise di umar jaan parivaarak bhoomika de adhar te nahin.",
    sample_vi:
      "Chúng ta có thể chia việc theo sở thích, thời gian và mức thuận tiện, không dựa trên tuổi hay vai trò gia đình của ai.",
    sample_en:
      "We can divide the work by interest, availability, and comfort, not based on anyone's age or family role.",
    calibration_phrases: [
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
        check_vi: "Có tiêu chí trung tính thay cho nhãn xã hội không?",
        check_en: "Does it use neutral criteria instead of social labels?",
        signal_vi: "Có ਰੁਚੀ và ਸੁਵਿਧਾ.",
        signal_en: "Includes interest and comfort.",
      },
    ],
    learner_trap: {
      trap_vi: "Dùng định kiến cho nhanh.",
      trap_en: "Using stereotypes for speed.",
      repair_vi: "Chuyển sang tiêu chí tự nguyện và thuận tiện.",
      repair_en: "Switch to voluntary and comfort-based criteria.",
    },
  },
  {
    id: "pa_c2_public_audience_adaptation",
    focus: "audience_adaptation",
    style: "export_readiness",
    title_vi: "Sẵn sàng xuất bản cho người nghe khác nhau",
    title_en: "Export-ready for different audiences",
    scenario_vi: "Bạn cần nêu cùng một nội dung cho người lớn tuổi, đồng nghiệp, và công chúng.",
    scenario_en: "You need the same content for elders, colleagues, and the public.",
    calibration_goal_vi: "Giữ kính trọng, rõ ràng, và không nghe như sửa lưng.",
    calibration_goal_en: "Keep respect, clarity, and avoid sounding corrective.",
    sample_gurmukhi:
      "ਤੁਹਾਡੀ ਗੱਲ ਦੀ ਕਦਰ ਹੈ। ਮੇਰਾ ਇੱਕ ਛੋਟਾ ਜਿਹਾ ਨਜ਼ਰੀਆ ਹੈ ਕਿ ਅਸੀਂ ਇਹ ਪੱਖ ਵੀ ਵੇਖ ਸਕਦੇ ਹਾਂ।",
    sample_romanization:
      "tuhadi gall di kadar hai. mera ikk chhota jiha nazaria hai ki asin ih pakh vi vekh sakde haan.",
    sample_vi:
      "Tôi trân trọng ý của anh/chị. Tôi có một góc nhìn nhỏ là chúng ta cũng có thể xem mặt này.",
    sample_en:
      "I value your point. I have one small perspective: we could also look at this side.",
    calibration_phrases: [
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
        check_vi: "Có công nhận trước khi thêm góc nhìn không?",
        check_en: "Does it validate before adding perspective?",
        signal_vi: "Có ਕਦਰ trước ਨਜ਼ਰੀਆ.",
        signal_en: "Validation comes before perspective.",
      },
    ],
    learner_trap: {
      trap_vi: "Lẫn kính trọng với im lặng tuyệt đối.",
      trap_en: "Confusing respect with total silence.",
      repair_vi: "Công nhận rồi mới thêm góc nhìn.",
      repair_en: "Validate first, then add perspective.",
    },
  },
  {
    id: "pa_c2_public_advanced_register",
    focus: "advanced_register",
    style: "final_hardening",
    title_vi: "Đăng ký nâng cao cho thông báo công khai",
    title_en: "Advanced register for public notices",
    scenario_vi: "Bạn cần viết thông báo thay đổi mà vẫn trang trọng.",
    scenario_en: "You need to write a change notice that still sounds formal.",
    calibration_goal_vi: "Trang trọng, súc tích, và có chỉ dẫn.",
    calibration_goal_en: "Formal, concise, and directive.",
    sample_gurmukhi:
      "ਮੌਸਮ ਦੇ ਕਾਰਨ ਅੱਜ ਦਾ ਪ੍ਰੋਗਰਾਮ ਨਵੇਂ ਹਾਲ ਵਿੱਚ ਹੋਵੇਗਾ। ਕਿਰਪਾ ਕਰਕੇ ਮੁੱਖ ਦਰਵਾਜ਼ੇ ਤੋਂ ਅੰਦਰ ਆਓ; ਸਮਾਂ ਪਹਿਲਾਂ ਵਾਂਗ ਹੀ ਰਹੇਗਾ।",
    sample_romanization:
      "mausam de karan ajj da program nave hall vich hovega. kirpa karke mukh darwaze ton andar aao; sama pehlan vaang hi rahega.",
    sample_vi:
      "Do thời tiết, chương trình hôm nay sẽ diễn ra ở hội trường mới. Vui lòng vào từ cửa chính; thời gian vẫn như cũ.",
    sample_en:
      "Because of the weather, today's program will be in the new hall. Please enter through the main door; the time will remain the same.",
    calibration_phrases: [
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
    checks: [
      {
        check_vi: "Có thay đổi, lý do, và hành động cụ thể không?",
        check_en: "Does it include change, reason, and action?",
        signal_vi: "Có đổi phòng và chỉ dẫn.",
        signal_en: "Includes room change and direction.",
      },
    ],
    learner_trap: {
      trap_vi: "Nói vòng vo mà thiếu hành động.",
      trap_en: "Being wordy without a concrete action.",
      repair_vi: "Thêm ਕਿਰਪਾ ਕਰਕੇ plus hướng đi rõ.",
      repair_en: "Add ਕਿਰਪਾ ਕਰਕੇ plus clear direction.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_public_tense_conversation",
    focus: "tense_conversation",
    style: "review",
    title_vi: "Rà soát cuộc nói chuyện căng",
    title_en: "Review a tense conversation",
    scenario_vi: "Cuộc nói chuyện bắt đầu căng và có nguy cơ thành tranh cãi.",
    scenario_en: "A conversation is turning tense and may become an argument.",
    calibration_goal_vi: "Hạ nhiệt bằng quy trình, không bằng mệnh lệnh.",
    calibration_goal_en: "Lower tension with process, not commands.",
    sample_gurmukhi:
      "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ। ਸਾਡਾ ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ, ਇਸ ਲਈ ਪਹਿਲਾਂ ਹਰ ਨੁਕਤਾ ਬਾਰੀ ਨਾਲ ਸੁਣੀਏ।",
    sample_romanization:
      "aao ikk-ikk gall sunie. sada maqsad hall labhna hai, is lai pehlan har nukta baari naal sunie.",
    sample_vi:
      "Ta hãy nghe từng ý một. Mục tiêu của chúng ta là tìm giải pháp, vì vậy trước hết hãy nghe từng điểm lần lượt.",
    sample_en:
      "Let's hear one point at a time. Our goal is to find a solution, so first let's hear each point in turn.",
    calibration_phrases: [
      {
        gurmukhi: "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ",
        romanization: "aao ikk-ikk gall sunie",
        vi: "Ta hãy nghe từng ý một.",
        en: "Let's hear one point at a time.",
      },
      {
        gurmukhi: "ਬਾਰੀ ਨਾਲ",
        romanization: "baari naal",
        vi: "Lần lượt.",
        en: "In turn.",
      },
    ],
    checks: [
      {
        check_vi: "Có quy trình nghe thay vì ra lệnh cảm xúc không?",
        check_en: "Is there a listening process instead of an emotional command?",
        signal_vi: "Có ਬਾਰੀ ਨਾਲ.",
        signal_en: "Includes turn-taking.",
      },
    ],
    learner_trap: {
      trap_vi: "Nói 'bình tĩnh đi' làm căng hơn.",
      trap_en: "Saying 'calm down' makes it worse.",
      repair_vi: "Đề xuất lượt nói và mục tiêu chung.",
      repair_en: "Suggest turn-taking and the shared goal.",
    },
  },
  {
    id: "pa_c2_public_professional_discourse",
    focus: "professional_discourse",
    style: "export_readiness",
    title_vi: "Sẵn sàng xuất bản cho ngữ cảnh chuyên nghiệp",
    title_en: "Export-ready for professional context",
    scenario_vi: "Email công việc bị hiểu là phê bình, nhưng ý định là làm rõ phạm vi.",
    scenario_en: "A work email is read as criticism, but the intent was to clarify scope.",
    calibration_goal_vi: "Thừa nhận tác động, làm rõ ý định, và đề xuất sửa.",
    calibration_goal_en: "Acknowledge impact, clarify intent, and propose a repair.",
    sample_gurmukhi:
      "ਜੇ ਮੇਰਾ ਪਿਛਲਾ ਸੁਨੇਹਾ ਆਲੋਚਨਾ ਵਾਂਗ ਲੱਗਿਆ ਹੋਵੇ ਤਾਂ ਮੈਂ ਸਪਸ਼ਟ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ ਕਿ ਮੇਰਾ ਮਕਸਦ ਸਿਰਫ਼ ਕੰਮ ਦੀ ਹੱਦ ਸਾਫ਼ ਕਰਨਾ ਸੀ। ਆਓ ਇਸ ਨੂੰ ਨਵੇਂ ਨੋਟ ਵਿੱਚ ਹੋਰ ਸਪਸ਼ਟ ਕਰੀਏ।",
    sample_romanization:
      "je mera pichhla suneha alochna vaang laggia hove taan main spasht karna chaunda haan ki mera maqsad sirf kamm di hadd saaf karna si. aao is nu nave note vich hor spasht karie.",
    sample_vi:
      "Nếu tin nhắn trước của tôi nghe như lời phê bình, tôi muốn làm rõ rằng mục đích của tôi chỉ là làm rõ phạm vi công việc. Ta hãy làm nó rõ hơn trong ghi chú mới.",
    sample_en:
      "If my previous message sounded like criticism, I want to clarify that my purpose was only to define the work scope. Let's make it clearer in a new note.",
    calibration_phrases: [
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
        check_vi: "Có thừa nhận tác động trước khi làm rõ ý định không?",
        check_en: "Does it acknowledge impact before clarifying intent?",
        signal_vi: "Có ਜੇ ... ਲੱਗਿਆ ਹੋਵੇ.",
        signal_en: "Includes 'if it sounded like...'.",
      },
    ],
    learner_trap: {
      trap_vi: "Nói 'bạn hiểu sai' quá nhanh.",
      trap_en: "Saying 'you misunderstood' too quickly.",
      repair_vi: "Nói tác động trước, ý định sau.",
      repair_en: "Name impact first, then intent.",
    },
  },
  {
    id: "pa_c2_public_negotiation",
    focus: "negotiation",
    style: "regression",
    title_vi: "Thụt lùi an toàn về đàm phán",
    title_en: "Safe regression to negotiation",
    scenario_vi: "Bạn chỉ có bản sao và email xác nhận khi đi làm thủ tục.",
    scenario_en: "You only have a copy and confirmation email when handling a procedure.",
    calibration_goal_vi: "Nhấn vào cái có và hỏi lựa chọn tiếp theo.",
    calibration_goal_en: "Emphasize what you have and ask for the next option.",
    sample_gurmukhi:
      "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਅਤੇ ਪੁਸ਼ਟੀ ਵਾਲਾ ਈਮੇਲ ਹੈ; ਕੀ ਤੁਸੀਂ ਦੱਸ ਸਕਦੇ ਹੋ ਕਿ ਅਗਲਾ ਕਦਮ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
    sample_romanization:
      "mainu niyam di samajh hai. is vele mere kol copy ate pushti wala email hai; ki tusin dass sakde ho ki agla kadam ki ho sakda hai?",
    sample_vi:
      "Tôi hiểu quy định. Hiện tôi có bản sao và email xác nhận; anh/chị có thể cho biết bước tiếp theo có thể là gì không?",
    sample_en:
      "I understand the rule. Right now I have a copy and a confirmation email; could you tell me what the next step could be?",
    calibration_phrases: [
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
        check_vi: "Có tránh đòi ngoại lệ không?",
        check_en: "Does it avoid demanding an exception?",
        signal_vi: "Có quy định trước câu hỏi.",
        signal_en: "Rule comes before the question.",
      },
    ],
    learner_trap: {
      trap_vi: "Chỉ than giấy tờ thiếu.",
      trap_en: "Only complaining about missing paper.",
      repair_vi: "Nêu cái đang có rồi hỏi cách đi tiếp.",
      repair_en: "State what you have, then ask how to proceed.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_public_final_review",
    focus: "public_discourse",
    style: "final_hardening",
    title_vi: "Khóa cứng diễn ngôn công khai",
    title_en: "Harden public discourse",
    scenario_vi: "Thông báo công khai cần đủ rõ để người dân làm đúng ngay.",
    scenario_en: "A public notice must be clear enough for people to act correctly right away.",
    calibration_goal_vi: "Ngắn, rõ, có thời gian và hành động.",
    calibration_goal_en: "Short, clear, with time and action.",
    sample_gurmukhi:
      "ਮੌਸਮ ਦੇ ਕਾਰਨ ਅੱਜ ਦਾ ਪ੍ਰੋਗਰਾਮ ਨਵੇਂ ਹਾਲ ਵਿੱਚ ਹੋਵੇਗਾ। ਕਿਰਪਾ ਕਰਕੇ ਮੁੱਖ ਦਰਵਾਜ਼ੇ ਤੋਂ ਅੰਦਰ ਆਓ; ਸਮਾਂ ਪਹਿਲਾਂ ਵਾਂਗ ਹੀ ਰਹੇਗਾ।",
    sample_romanization:
      "mausam de karan ajj da program nave hall vich hovega. kirpa karke mukh darwaze ton andar aao; sama pehlan vaang hi rahega.",
    sample_vi:
      "Do thời tiết, chương trình hôm nay sẽ diễn ra ở hội trường mới. Vui lòng vào từ cửa chính; thời gian vẫn như cũ.",
    sample_en:
      "Because of the weather, today's program will be in the new hall. Please enter through the main door; the time will remain the same.",
    calibration_phrases: [
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
        check_vi: "Có đủ thay đổi, chỉ dẫn, và thời gian không?",
        check_en: "Does it include change, direction, and time?",
        signal_vi: "Có vào cửa chính.",
        signal_en: "Includes main-door direction.",
      },
    ],
    learner_trap: {
      trap_vi: "Đưa quá nhiều lý do gây rối.",
      trap_en: "Giving too many reasons and causing confusion.",
      repair_vi: "Giữ thông báo ngắn, rõ, và chỉ dẫn.",
      repair_en: "Keep the notice short, clear, and directive.",
    },
    canada_practical: true,
  },
];

export const publicCommunicationCalibrationC2ByFocus = (
  focus: PunjabiC2PublicFocus,
): PunjabiC2PublicCommunicationCalibration[] =>
  publicCommunicationCalibrationC2.filter((item) => item.focus === focus);
