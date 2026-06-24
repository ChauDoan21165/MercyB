// Punjabi C2 readiness gate for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support readiness checks, not certification, placement
// authority, legal/HR/medical/safety advice, or native-reviewed assessment.
// Native review is deferred. Shahmukhi is mentioned only for script awareness,
// not as a full course.

export type PunjabiC2ReadinessFocus =
  | "nuanced_discourse"
  | "negotiation"
  | "deescalation"
  | "sensitive_topic_framing"
  | "advanced_register"
  | "community_communication"
  | "professional_communication"
  | "public_communication";

export type PunjabiC2ReadinessOutcome = "ready" | "review" | "route_to_practice";

export type PunjabiC2ReadinessPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2ReadinessCheckpoint = {
  criterion_vi: string;
  criterion_en: string;
  ready_signal_vi: string;
  ready_signal_en: string;
};

export type PunjabiC2ReadinessRoute = {
  if_missing_vi: string;
  if_missing_en: string;
  route_vi: string;
  route_en: string;
  outcome: PunjabiC2ReadinessOutcome;
};

export type PunjabiC2ReadinessTrap = {
  trap_vi: string;
  trap_en: string;
  stronger_vi: string;
  stronger_en: string;
};

export type PunjabiC2ReadinessGateItem = {
  id: string;
  focus: PunjabiC2ReadinessFocus;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  prompt_vi: string;
  prompt_en: string;
  target_phrases: PunjabiC2ReadinessPhrase[];
  model_gurmukhi: string;
  model_romanization: string;
  model_vi: string;
  model_en: string;
  checkpoints: PunjabiC2ReadinessCheckpoint[];
  routing: PunjabiC2ReadinessRoute;
  learner_trap?: PunjabiC2ReadinessTrap;
  canada_practical?: boolean;
};

export const C2_READINESS_GATE_DISCLAIMER = {
  vi: "Cổng sẵn sàng Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay đánh giá chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi readiness gate is for study support only, not certification or official assessment. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const readinessGateC2Items: PunjabiC2ReadinessGateItem[] = [
  {
    id: "pa_c2_gate_nuanced_discourse",
    focus: "nuanced_discourse",
    title_vi: "Giữ sắc thái khi phản biện",
    title_en: "Maintain nuance while challenging a point",
    scenario_vi: "Bạn đồng ý với mục tiêu chung nhưng thấy lập luận còn thiếu bằng chứng.",
    scenario_en: "You agree with the shared goal but think the argument lacks evidence.",
    prompt_vi: "Công nhận mục tiêu, nêu điểm còn thiếu, và mời bổ sung bằng chứng.",
    prompt_en: "Acknowledge the goal, name what is missing, and invite more evidence.",
    target_phrases: [
      {
        gurmukhi: "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ",
        romanization: "maqsad naal main sahimat haan",
        vi: "Tôi đồng ý với mục tiêu.",
        en: "I agree with the goal.",
      },
      {
        gurmukhi: "ਸਬੂਤ ਹੋਰ ਸਪਸ਼ਟ ਹੋਣ ਤਾਂ ਗੱਲ ਮਜ਼ਬੂਤ ਹੋਵੇਗੀ",
        romanization: "sabut hor spasht hon taan gall mazbut hovegi",
        vi: "Nếu bằng chứng rõ hơn thì lập luận sẽ mạnh hơn.",
        en: "If the evidence is clearer, the point will be stronger.",
      },
    ],
    model_gurmukhi:
      "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ। ਜੇ ਸਬੂਤ ਹੋਰ ਸਪਸ਼ਟ ਹੋਣ ਤਾਂ ਇਹ ਗੱਲ ਹੋਰ ਮਜ਼ਬੂਤ ਹੋਵੇਗੀ।",
    model_romanization:
      "maqsad naal main sahimat haan. je sabut hor spasht hon taan ih gall hor mazbut hovegi.",
    model_vi:
      "Tôi đồng ý với mục tiêu. Nếu bằng chứng rõ hơn thì lập luận này sẽ mạnh hơn.",
    model_en:
      "I agree with the goal. If the evidence is clearer, this point will be stronger.",
    checkpoints: [
      {
        criterion_vi: "Công nhận trước khi phản biện.",
        criterion_en: "Validate before challenging.",
        ready_signal_vi: "Câu mở đầu không phủ nhận toàn bộ ý kiến.",
        ready_signal_en: "The opening does not dismiss the whole idea.",
      },
      {
        criterion_vi: "Phản biện vào bằng chứng, không vào người nói.",
        criterion_en: "Challenge evidence, not the speaker.",
        ready_signal_vi: "Trọng tâm là ਸਬੂਤ hoặc lập luận.",
        ready_signal_en: "The focus is ਸਬੂਤ or reasoning.",
      },
    ],
    routing: {
      if_missing_vi: "Nếu người học chỉ nói 'không đúng'.",
      if_missing_en: "If the learner only says 'that is not correct'.",
      route_vi: "Quay lại luyện sắc thái bất đồng và cụm công nhận mục tiêu.",
      route_en: "Route back to nuanced disagreement and goal-validation practice.",
      outcome: "route_to_practice",
    },
    learner_trap: {
      trap_vi: "Dịch trực tiếp 'I disagree' quá sớm.",
      trap_en: "Translating 'I disagree' too early.",
      stronger_vi: "Dùng công nhận + điều kiện: ਜੇ ... ਤਾਂ.",
      stronger_en: "Use validation plus condition: ਜੇ ... ਤਾਂ.",
    },
  },
  {
    id: "pa_c2_gate_negotiation_canada_service",
    focus: "negotiation",
    title_vi: "Đàm phán lựa chọn tại dịch vụ công Canada",
    title_en: "Negotiate options at a Canadian public service desk",
    scenario_vi: "Bạn thiếu một giấy tờ gốc nhưng có bản sao và email xác nhận.",
    scenario_en: "You lack an original document but have a copy and a confirmation email.",
    prompt_vi: "Tôn trọng quy định, nêu giấy tờ hiện có, và hỏi phương án tiếp theo.",
    prompt_en: "Respect the requirement, state what you have, and ask about next options.",
    target_phrases: [
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
    model_gurmukhi:
      "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਅਤੇ ਪੁਸ਼ਟੀ ਵਾਲਾ ਈਮੇਲ ਹੈ; ਅਗਲਾ ਕਦਮ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
    model_romanization:
      "mainu niyam di samajh hai. is vele mere kol copy ate pushti wala email hai; agla kadam ki ho sakda hai?",
    model_vi:
      "Tôi hiểu quy định. Hiện tôi có bản sao và email xác nhận; bước tiếp theo có thể là gì?",
    model_en:
      "I understand the rule. Right now I have a copy and a confirmation email; what could the next step be?",
    checkpoints: [
      {
        criterion_vi: "Không chống lại quy định.",
        criterion_en: "Does not argue against the requirement.",
        ready_signal_vi: "Bắt đầu bằng hiểu quy định rồi hỏi lựa chọn.",
        ready_signal_en: "Starts by understanding the rule, then asks for options.",
      },
      {
        criterion_vi: "Nêu thông tin có thật và giới hạn.",
        criterion_en: "States actual available documents and limits.",
        ready_signal_vi: "Không hứa có giấy tờ chưa có.",
        ready_signal_en: "Does not promise documents the learner does not have.",
      },
    ],
    routing: {
      if_missing_vi: "Nếu câu trả lời chỉ phàn nàn về quy định.",
      if_missing_en: "If the response only complains about the rule.",
      route_vi: "Luyện lại đàm phán có ràng buộc và hỏi lựa chọn.",
      route_en: "Review constrained negotiation and option-seeking language.",
      outcome: "review",
    },
    learner_trap: {
      trap_vi: "Nói 'tôi cần anh/chị chấp nhận cái này' nghe ép buộc.",
      trap_en: "Saying 'I need you to accept this' sounds coercive.",
      stronger_vi: "Hỏi về ਅਗਲਾ ਕਦਮ hoặc ਵਿਕਲਪ.",
      stronger_en: "Ask about ਅਗਲਾ ਕਦਮ or ਵਿਕਲਪ.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_gate_deescalation_meeting",
    focus: "deescalation",
    title_vi: "Hạ nhiệt cuộc họp căng",
    title_en: "De-escalate a tense meeting",
    scenario_vi: "Hai người đang nói chồng lên nhau và cuộc họp mất trọng tâm.",
    scenario_en: "Two people are talking over each other and the meeting is losing focus.",
    prompt_vi: "Đề xuất nghe từng lượt và đưa cuộc họp về mục tiêu chung.",
    prompt_en: "Suggest turn-taking and bring the meeting back to the shared goal.",
    target_phrases: [
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
    model_gurmukhi:
      "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ। ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ, ਇਸ ਲਈ ਹਰ ਨੁਕਤੇ ਨੂੰ ਬਾਰੀ ਨਾਲ ਵੇਖੀਏ।",
    model_romanization:
      "aao ikk-ikk gall sunie. maqsad hall labhna hai, is lai har nukte nu baari naal vekhie.",
    model_vi:
      "Ta hãy nghe từng ý một. Mục tiêu là tìm giải pháp, vì vậy hãy xem từng điểm lần lượt.",
    model_en:
      "Let's hear one point at a time. The goal is to find a solution, so let's look at each point in turn.",
    checkpoints: [
      {
        criterion_vi: "Đề xuất quy trình thay vì ra lệnh cảm xúc.",
        criterion_en: "Suggests process instead of commanding emotion.",
        ready_signal_vi: "Không dùng 'bình tĩnh đi' như mệnh lệnh.",
        ready_signal_en: "Does not use 'calm down' as a command.",
      },
    ],
    routing: {
      if_missing_vi: "Nếu người học trách móc hoặc nói quá trực diện.",
      if_missing_en: "If the learner blames people or sounds too direct.",
      route_vi: "Quay lại luyện hạ nhiệt bằng quy trình và mục tiêu chung.",
      route_en: "Route to de-escalation through process and shared-goal language.",
      outcome: "route_to_practice",
    },
    learner_trap: {
      trap_vi: "Nói 'đừng cãi nhau' có thể làm mất mặt người nghe.",
      trap_en: "Saying 'stop arguing' can make listeners lose face.",
      stronger_vi: "Đưa ra quy trình nghe lần lượt.",
      stronger_en: "Offer a turn-taking process.",
    },
  },
  {
    id: "pa_c2_gate_sensitive_framing",
    focus: "sensitive_topic_framing",
    title_vi: "Đóng khung chủ đề nhạy cảm",
    title_en: "Frame a sensitive topic carefully",
    scenario_vi: "Nhóm cộng đồng cần phân công việc mà không gán vai theo tuổi, giới, hay gia đình.",
    scenario_en:
      "A community group needs to assign tasks without age, gender, or family-role assumptions.",
    prompt_vi: "Mời chọn việc theo thời gian, kỹ năng, và mức thoải mái.",
    prompt_en: "Invite choices based on availability, skill, and comfort level.",
    target_phrases: [
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
    model_gurmukhi:
      "ਅਸੀਂ ਕੰਮ ਰੁਚੀ, ਸਮੇਂ ਅਤੇ ਸੁਵਿਧਾ ਦੇ ਅਨੁਸਾਰ ਵੰਡ ਸਕਦੇ ਹਾਂ। ਜਿਸ ਨੂੰ ਸੁਵਿਧਾ ਹੋਵੇ, ਉਹ ਇਹ ਹਿੱਸਾ ਲੈ ਸਕਦਾ ਹੈ।",
    model_romanization:
      "asin kamm ruchi, same ate suvidha de anusaar vand sakde haan. jis nu suvidha hove, oh ih hissa lai sakda hai.",
    model_vi:
      "Chúng ta có thể chia việc theo sở thích, thời gian và mức thuận tiện. Ai thấy thuận tiện có thể nhận phần này.",
    model_en:
      "We can divide the work according to interest, availability, and comfort. Whoever feels comfortable can take this part.",
    checkpoints: [
      {
        criterion_vi: "Không gán việc theo định kiến.",
        criterion_en: "Does not assign roles by stereotype.",
        ready_signal_vi: "Tiêu chí là thời gian, kỹ năng, hoặc sự thoải mái.",
        ready_signal_en: "Criteria are availability, skill, or comfort.",
      },
    ],
    routing: {
      if_missing_vi: "Nếu câu trả lời giả định ai phải làm việc nào.",
      if_missing_en: "If the response assumes who must do which task.",
      route_vi: "Luyện lại đóng khung chủ đề nhạy cảm và ngôn ngữ mời chọn.",
      route_en: "Review sensitive-topic framing and choice-inviting language.",
      outcome: "review",
    },
    learner_trap: {
      trap_vi: "Dùng 'người lớn tuổi/phụ nữ/đàn ông nên...' gây định kiến.",
      trap_en: "Using 'elders/women/men should...' creates stereotypes.",
      stronger_vi: "Dùng ਰੁਚੀ, ਸਮਾਂ, ਸੁਵਿਧਾ làm tiêu chí.",
      stronger_en: "Use ਰੁਚੀ, ਸਮਾਂ, ਸੁਵਿਧਾ as criteria.",
    },
  },
  {
    id: "pa_c2_gate_advanced_register",
    focus: "advanced_register",
    title_vi: "Chọn đăng ký trang trọng vừa đủ",
    title_en: "Choose a controlled formal register",
    scenario_vi: "Bạn viết thông báo chuyên nghiệp nhưng không muốn nghe quá xa cách.",
    scenario_en: "You are writing a professional notice but do not want to sound distant.",
    prompt_vi: "Dùng giọng trang trọng, rõ, và vẫn có tính hợp tác.",
    prompt_en: "Use a formal, clear, and still collaborative tone.",
    target_phrases: [
      {
        gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਧਿਆਨ ਦਿਓ",
        romanization: "kirpa karke dhiaan dio",
        vi: "Xin vui lòng lưu ý.",
        en: "Please note.",
      },
      {
        gurmukhi: "ਜੇ ਕੋਈ ਸਵਾਲ ਹੋਵੇ ਤਾਂ ਦੱਸੋ",
        romanization: "je koi sawal hove taan dasso",
        vi: "Nếu có câu hỏi, xin cho biết.",
        en: "If there is any question, please let us know.",
      },
    ],
    model_gurmukhi:
      "ਕਿਰਪਾ ਕਰਕੇ ਧਿਆਨ ਦਿਓ ਕਿ ਸਮਾਂ ਬਦਲਿਆ ਗਿਆ ਹੈ। ਜੇ ਕੋਈ ਸਵਾਲ ਹੋਵੇ ਤਾਂ ਸਾਨੂੰ ਦੱਸੋ।",
    model_romanization:
      "kirpa karke dhiaan dio ki sama badlia gia hai. je koi sawal hove taan sanu dasso.",
    model_vi:
      "Xin vui lòng lưu ý rằng thời gian đã được thay đổi. Nếu có câu hỏi, xin cho chúng tôi biết.",
    model_en:
      "Please note that the time has been changed. If there is any question, please let us know.",
    checkpoints: [
      {
        criterion_vi: "Trang trọng nhưng không lạnh.",
        criterion_en: "Formal without sounding cold.",
        ready_signal_vi: "Có lời mời hỏi lại hoặc làm rõ.",
        ready_signal_en: "Includes an invitation to ask or clarify.",
      },
    ],
    routing: {
      if_missing_vi: "Nếu câu quá thân mật hoặc quá cứng.",
      if_missing_en: "If the wording is too casual or too stiff.",
      route_vi: "Ôn lại đăng ký nâng cao và công thức thông báo lịch sự.",
      route_en: "Review advanced register and polite notice formulas.",
      outcome: "review",
    },
  },
  {
    id: "pa_c2_gate_community_communication",
    focus: "community_communication",
    title_vi: "Điều phối trao đổi cộng đồng",
    title_en: "Coordinate community communication",
    scenario_vi: "Nhóm cần quyết định ngày sự kiện nhưng có nhiều lịch khác nhau.",
    scenario_en: "A group needs to choose an event date but members have different schedules.",
    prompt_vi: "Tóm tắt điểm đồng thuận, nêu điểm còn mở, và đề xuất bước tiếp theo.",
    prompt_en: "Summarize agreement, name the open point, and propose a next step.",
    target_phrases: [
      {
        gurmukhi: "ਹੁਣ ਤੱਕ ਸਹਿਮਤੀ ਇਹ ਹੈ",
        romanization: "hun takk sahimati ih hai",
        vi: "Cho đến giờ, điểm đồng thuận là...",
        en: "So far, the agreement is...",
      },
      {
        gurmukhi: "ਅਗਲਾ ਕਦਮ ਇਹ ਹੋ ਸਕਦਾ ਹੈ",
        romanization: "agla kadam ih ho sakda hai",
        vi: "Bước tiếp theo có thể là...",
        en: "The next step could be...",
      },
    ],
    model_gurmukhi:
      "ਹੁਣ ਤੱਕ ਸਹਿਮਤੀ ਇਹ ਹੈ ਕਿ ਸਮਾਗਮ ਹਫ਼ਤੇ ਦੇ ਅੰਤ ਹੋਵੇ। ਅਗਲਾ ਕਦਮ ਇਹ ਹੋ ਸਕਦਾ ਹੈ ਕਿ ਅਸੀਂ ਦੋ ਤਾਰੀਖਾਂ ਤੇ ਰਾਇ ਲੈ ਲਈਏ।",
    model_romanization:
      "hun takk sahimati ih hai ki samagam hafte de ant hove. agla kadam ih ho sakda hai ki asin do tarikh'an te rai lai laie.",
    model_vi:
      "Cho đến giờ, điểm đồng thuận là sự kiện vào cuối tuần. Bước tiếp theo có thể là lấy ý kiến về hai ngày.",
    model_en:
      "So far, the agreement is that the event should be on the weekend. The next step could be to get views on two dates.",
    checkpoints: [
      {
        criterion_vi: "Tách đồng thuận khỏi việc còn mở.",
        criterion_en: "Separates agreement from the remaining open issue.",
        ready_signal_vi: "Có cả ਸਹਿਮਤੀ và ਅਗਲਾ ਕਦਮ.",
        ready_signal_en: "Includes both ਸਹਿਮਤੀ and ਅਗਲਾ ਕਦਮ.",
      },
    ],
    routing: {
      if_missing_vi: "Nếu người học chỉ nêu ý kiến cá nhân.",
      if_missing_en: "If the learner only states a personal preference.",
      route_vi: "Luyện lại tóm tắt điều phối nhóm.",
      route_en: "Route to group-coordination summary practice.",
      outcome: "route_to_practice",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_gate_professional_communication",
    focus: "professional_communication",
    title_vi: "Trao đổi chuyên nghiệp về lỗi quy trình",
    title_en: "Professional communication about a process error",
    scenario_vi: "Một lỗi xảy ra trong quy trình làm việc; bạn cần giữ trách nhiệm và tránh đổ lỗi.",
    scenario_en: "A process error occurred at work; you need accountability without blame.",
    prompt_vi: "Nhận sự cố, chuyển sang quy trình, và đề xuất kiểm tra lại.",
    prompt_en: "Acknowledge the issue, shift to process, and propose a review.",
    target_phrases: [
      {
        gurmukhi: "ਇਹ ਗੱਲ ਸਾਨੂੰ ਵੇਖਣੀ ਚਾਹੀਦੀ ਹੈ",
        romanization: "ih gall sanu vekhni chahidi hai",
        vi: "Việc này chúng ta nên xem lại.",
        en: "We should look at this matter.",
      },
      {
        gurmukhi: "ਪ੍ਰਕਿਰਿਆ ਕਿੱਥੇ ਅਸਪਸ਼ਟ ਸੀ",
        romanization: "prakiria kithe aspasht si",
        vi: "Quy trình chưa rõ ở đâu.",
        en: "Where the process was unclear.",
      },
    ],
    model_gurmukhi:
      "ਇਹ ਗੱਲ ਸਾਨੂੰ ਵੇਖਣੀ ਚਾਹੀਦੀ ਹੈ। ਪਹਿਲਾਂ ਇਹ ਸਮਝੀਏ ਕਿ ਪ੍ਰਕਿਰਿਆ ਕਿੱਥੇ ਅਸਪਸ਼ਟ ਸੀ, ਫਿਰ ਅਗਲਾ ਕਦਮ ਲਿਖੀਏ।",
    model_romanization:
      "ih gall sanu vekhni chahidi hai. pehlan ih samjhie ki prakiria kithe aspasht si, fir agla kadam likhie.",
    model_vi:
      "Việc này chúng ta nên xem lại. Trước hết hãy hiểu quy trình chưa rõ ở đâu, rồi viết bước tiếp theo.",
    model_en:
      "We should look at this matter. First let's understand where the process was unclear, then write the next step.",
    checkpoints: [
      {
        criterion_vi: "Giữ trách nhiệm nhưng không quy lỗi cá nhân.",
        criterion_en: "Keeps accountability without personal blame.",
        ready_signal_vi: "Nêu quy trình và bước tiếp theo.",
        ready_signal_en: "Names the process and next step.",
      },
    ],
    routing: {
      if_missing_vi: "Nếu phản hồi hỏi ngay 'ai làm sai?'.",
      if_missing_en: "If the response immediately asks 'who did it wrong?'.",
      route_vi: "Ôn lại ngôn ngữ sửa quy trình và trách nhiệm chuyên nghiệp.",
      route_en: "Review process-repair and professional accountability language.",
      outcome: "review",
    },
    learner_trap: {
      trap_vi: "Dùng giọng điều tra trước khi hiểu quy trình.",
      trap_en: "Using an investigative tone before understanding the process.",
      stronger_vi: "Nói về ਪ੍ਰਕਿਰਿਆ và ਅਗਲਾ ਕਦਮ.",
      stronger_en: "Talk about ਪ੍ਰਕਿਰਿਆ and ਅਗਲਾ ਕਦਮ.",
    },
  },
  {
    id: "pa_c2_gate_public_communication",
    focus: "public_communication",
    title_vi: "Phát biểu công khai ngắn và cân bằng",
    title_en: "Brief balanced public communication",
    scenario_vi: "Bạn thông báo thay đổi lịch cho một sự kiện cộng đồng và cần tránh gây hoang mang.",
    scenario_en:
      "You announce a schedule change for a community event and need to avoid confusion.",
    prompt_vi: "Nêu thay đổi, lý do trung tính, và cách nhận thông tin cập nhật.",
    prompt_en: "State the change, give a neutral reason, and explain how to get updates.",
    target_phrases: [
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
    model_gurmukhi:
      "ਸਮੇਂ ਵਿੱਚ ਤਬਦੀਲੀ ਕੀਤੀ ਗਈ ਹੈ ਤਾਂ ਜੋ ਪ੍ਰਬੰਧ ਸਾਫ਼ ਰਹੇ। ਤਾਜ਼ਾ ਜਾਣਕਾਰੀ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਸੁਨੇਹਾ ਵੇਖਦੇ ਰਹੋ।",
    model_romanization:
      "same vich tabdili kiti gai hai taan jo prabandh saaf rahe. taza jaankari lai kirpa karke suneha vekhde raho.",
    model_vi:
      "Đã có thay đổi về thời gian để việc tổ chức rõ ràng. Để có thông tin mới nhất, xin tiếp tục xem tin nhắn.",
    model_en:
      "A change has been made to the time so arrangements stay clear. For the latest information, please keep checking the message.",
    checkpoints: [
      {
        criterion_vi: "Thông báo rõ nhưng không kịch tính hóa.",
        criterion_en: "Clear notice without dramatizing.",
        ready_signal_vi: "Có thay đổi, lý do trung tính, và kênh cập nhật.",
        ready_signal_en: "Includes the change, a neutral reason, and an update channel.",
      },
    ],
    routing: {
      if_missing_vi: "Nếu thông báo thiếu bước cập nhật hoặc nghe gây hoang mang.",
      if_missing_en: "If the notice lacks update guidance or sounds alarming.",
      route_vi: "Luyện lại cấu trúc thông báo công khai: thay đổi, lý do, cập nhật.",
      route_en: "Practice public notice structure: change, reason, update.",
      outcome: "review",
    },
    canada_practical: true,
  },
];

export const readinessGateC2ByFocus = (
  focus: PunjabiC2ReadinessFocus,
): PunjabiC2ReadinessGateItem[] =>
  readinessGateC2Items.filter((item) => item.focus === focus);
