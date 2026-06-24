// Punjabi C2 integrated discourse tasks for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support integrated discourse tasks, not certification,
// official placement, legal/HR/medical/safety advice, or native-reviewed authority.
// Native review is deferred. Shahmukhi is mentioned only for script awareness,
// not as a full course.

export type PunjabiC2IntegratedFocus =
  | "negotiation_diplomacy"
  | "deescalation_register"
  | "sensitive_community"
  | "professional_repair"
  | "public_notice"
  | "nuanced_disagreement"
  | "community_mediation"
  | "handoff_readiness";

export type PunjabiC2IntegratedMode = "scenario" | "review" | "routing" | "readiness";

export type PunjabiC2IntegratedSkill =
  | "advanced_register"
  | "nuanced_disagreement"
  | "negotiation"
  | "diplomacy"
  | "deescalation"
  | "sensitive_topic_framing"
  | "community_discourse"
  | "professional_discourse"
  | "public_discourse";

export type PunjabiC2IntegratedPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2IntegratedCheckpoint = {
  checkpoint_vi: string;
  checkpoint_en: string;
  ready_signal_vi: string;
  ready_signal_en: string;
};

export type PunjabiC2IntegratedRoute = {
  if_missing_vi: string;
  if_missing_en: string;
  route_vi: string;
  route_en: string;
};

export type PunjabiC2IntegratedTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2IntegratedTask = {
  id: string;
  focus: PunjabiC2IntegratedFocus;
  mode: PunjabiC2IntegratedMode;
  skills: PunjabiC2IntegratedSkill[];
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  task_vi: string;
  task_en: string;
  useful_phrases: PunjabiC2IntegratedPhrase[];
  model_gurmukhi: string;
  model_romanization: string;
  model_vi: string;
  model_en: string;
  checkpoints: PunjabiC2IntegratedCheckpoint[];
  routing: PunjabiC2IntegratedRoute;
  learner_trap?: PunjabiC2IntegratedTrap;
  canada_practical?: boolean;
};

export const C2_INTEGRATED_DISCOURSE_TASKS_DISCLAIMER = {
  vi: "Các nhiệm vụ diễn ngôn tích hợp Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "These C2 Punjabi integrated discourse tasks support study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const integratedDiscourseTasksC2: PunjabiC2IntegratedTask[] = [
  {
    id: "pa_c2_integrated_negotiation_diplomacy_canada",
    focus: "negotiation_diplomacy",
    mode: "scenario",
    skills: ["negotiation", "diplomacy", "advanced_register"],
    title_vi: "Đàm phán lựa chọn giấy tờ với giọng ngoại giao",
    title_en: "Negotiate document options with diplomacy",
    scenario_vi: "Bạn thiếu bản gốc ở một dịch vụ công Canada nhưng có bản sao và email xác nhận.",
    scenario_en: "You lack an original document at a Canadian public service but have a copy and confirmation email.",
    task_vi: "Thừa nhận quy định, nêu cái đang có, hỏi lựa chọn tiếp theo mà không đòi ngoại lệ.",
    task_en: "Acknowledge the rule, state what you have, and ask for the next option without demanding an exception.",
    useful_phrases: [
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
    model_gurmukhi:
      "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਅਤੇ ਪੁਸ਼ਟੀ ਵਾਲਾ ਈਮੇਲ ਹੈ; ਕੀ ਕੋਈ ਹੋਰ ਵਿਕਲਪ ਹੋ ਸਕਦਾ ਹੈ?",
    model_romanization:
      "mainu niyam di samajh hai. is vele mere kol copy ate pushti wala email hai; ki koi hor vikalp ho sakda hai?",
    model_vi:
      "Tôi hiểu quy định. Hiện tôi có bản sao và email xác nhận; có lựa chọn khác nào không?",
    model_en:
      "I understand the rule. Right now I have a copy and a confirmation email; could there be another option?",
    checkpoints: [
      {
        checkpoint_vi: "Tôn trọng ràng buộc trước khi hỏi lựa chọn.",
        checkpoint_en: "Respects the constraint before asking for options.",
        ready_signal_vi: "Có ਨਿਯਮ và ਵਿਕਲਪ.",
        ready_signal_en: "Includes ਨਿਯਮ and ਵਿਕਲਪ.",
      },
    ],
    routing: {
      if_missing_vi: "Nếu câu nghe như yêu cầu ngoại lệ.",
      if_missing_en: "If the sentence sounds like demanding an exception.",
      route_vi: "Quay lại luyện đàm phán có ràng buộc và từ chối/đề nghị ngoại giao.",
      route_en: "Route to constrained negotiation and diplomatic request practice.",
    },
    learner_trap: {
      trap_vi: "Nói 'anh/chị phải chấp nhận' làm mất tính ngoại giao.",
      trap_en: "Saying 'you must accept this' removes diplomacy.",
      repair_vi: "Hỏi về ਵਿਕਲਪ hoặc ਅਗਲਾ ਕਦਮ.",
      repair_en: "Ask about ਵਿਕਲਪ or ਅਗਲਾ ਕਦਮ.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_integrated_deescalation_register",
    focus: "deescalation_register",
    mode: "review",
    skills: ["deescalation", "advanced_register", "community_discourse"],
    title_vi: "Hạ nhiệt với đăng ký trang trọng vừa đủ",
    title_en: "De-escalate with controlled formal register",
    scenario_vi: "Hai người nói chồng lên nhau trong cuộc họp cộng đồng.",
    scenario_en: "Two people speak over each other in a community meeting.",
    task_vi: "Đề xuất quy trình nghe từng lượt và nhắc mục tiêu chung.",
    task_en: "Suggest a turn-taking process and remind everyone of the shared goal.",
    useful_phrases: [
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
      "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ। ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ, ਇਸ ਲਈ ਬਾਰੀ-ਬਾਰੀ ਗੱਲ ਕਰੀਏ।",
    model_romanization:
      "aao ikk-ikk gall sunie. maqsad hall labhna hai, is lai baari-baari gall karie.",
    model_vi:
      "Ta hãy nghe từng ý một. Mục tiêu là tìm giải pháp, vì vậy hãy nói lần lượt.",
    model_en:
      "Let's hear one point at a time. The goal is to find a solution, so let's speak in turn.",
    checkpoints: [
      {
        checkpoint_vi: "Đề xuất quy trình thay vì phán xét cảm xúc.",
        checkpoint_en: "Suggests process instead of judging emotion.",
        ready_signal_vi: "Có ਇੱਕ-ਇੱਕ hoặc ਬਾਰੀ-ਬਾਰੀ.",
        ready_signal_en: "Includes ਇੱਕ-ਇੱਕ or ਬਾਰੀ-ਬਾਰੀ.",
      },
    ],
    routing: {
      if_missing_vi: "Nếu câu ra lệnh 'bình tĩnh đi'.",
      if_missing_en: "If the sentence commands people to calm down.",
      route_vi: "Ôn lại hạ nhiệt bằng quy trình và mục tiêu chung.",
      route_en: "Review de-escalation through process and shared-goal language.",
    },
    learner_trap: {
      trap_vi: "Nói 'đừng cãi nhau' dễ làm người nghe mất mặt.",
      trap_en: "Saying 'stop arguing' can make listeners lose face.",
      repair_vi: "Dùng quy trình nghe lần lượt.",
      repair_en: "Use a turn-taking listening process.",
    },
  },
  {
    id: "pa_c2_integrated_sensitive_community",
    focus: "sensitive_community",
    mode: "scenario",
    skills: ["sensitive_topic_framing", "community_discourse", "diplomacy"],
    title_vi: "Phân công việc cộng đồng không định kiến",
    title_en: "Assign community work without stereotypes",
    scenario_vi: "Nhóm chuẩn bị sự kiện và cần chia việc mà không gán vai theo tuổi, giới, hoặc gia đình.",
    scenario_en: "A group is preparing an event and needs to divide tasks without assigning roles by age, gender, or family.",
    task_vi: "Mời người tham gia theo sở thích, thời gian, và mức thoải mái.",
    task_en: "Invite participation by interest, availability, and comfort level.",
    useful_phrases: [
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
      "We can divide the work by interest, availability, and comfort. Whoever feels comfortable can take this part.",
    checkpoints: [
      {
        checkpoint_vi: "Tiêu chí phân công trung tính.",
        checkpoint_en: "Assignment criteria are neutral.",
        ready_signal_vi: "Có ਰੁਚੀ, ਸਮਾਂ, hoặc ਸੁਵਿਧਾ.",
        ready_signal_en: "Includes ਰੁਚੀ, ਸਮਾਂ, or ਸੁਵਿਧਾ.",
      },
    ],
    routing: {
      if_missing_vi: "Nếu câu gán vai theo định kiến.",
      if_missing_en: "If the sentence assigns roles by stereotype.",
      route_vi: "Luyện lại đóng khung chủ đề nhạy cảm và mời chọn.",
      route_en: "Route to sensitive-topic framing and invitation language.",
    },
    learner_trap: {
      trap_vi: "Dùng 'người lớn tuổi/phụ nữ/đàn ông nên...' gây định kiến.",
      trap_en: "Using 'elders/women/men should...' creates stereotypes.",
      repair_vi: "Chuyển sang tiêu chí thời gian, khả năng, và sự thoải mái.",
      repair_en: "Shift to availability, capacity, and comfort.",
    },
  },
  {
    id: "pa_c2_integrated_professional_repair",
    focus: "professional_repair",
    mode: "routing",
    skills: ["professional_discourse", "deescalation", "advanced_register"],
    title_vi: "Sửa lỗi quy trình không đổ lỗi",
    title_en: "Repair a process error without blame",
    scenario_vi: "Một lỗi công việc xảy ra và nhóm bắt đầu tìm người chịu lỗi.",
    scenario_en: "A workplace error occurred and the group starts looking for who is at fault.",
    task_vi: "Chuyển trọng tâm sang quy trình, bước tiếp theo, và phòng lặp lại.",
    task_en: "Shift focus to process, next step, and prevention.",
    useful_phrases: [
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
    model_gurmukhi:
      "ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਮੁੜ ਵੇਖੀਏ ਅਤੇ ਅਗਲਾ ਕਦਮ ਸਪਸ਼ਟ ਕਰੀਏ, ਤਾਂ ਜੋ ਇਹ ਗੱਲ ਦੁਬਾਰਾ ਨਾ ਹੋਵੇ।",
    model_romanization:
      "prakiria nu mur vekhie ate agla kadam spasht karie, taan jo ih gall dubara na hove.",
    model_vi:
      "Hãy xem lại quy trình và làm rõ bước tiếp theo để việc này không lặp lại.",
    model_en:
      "Let's review the process and clarify the next step so this does not happen again.",
    checkpoints: [
      {
        checkpoint_vi: "Giữ trách nhiệm qua quy trình.",
        checkpoint_en: "Keeps accountability through process.",
        ready_signal_vi: "Có ਪ੍ਰਕਿਰਿਆ và ਅਗਲਾ ਕਦਮ.",
        ready_signal_en: "Includes ਪ੍ਰਕਿਰਿਆ and ਅਗਲਾ ਕਦਮ.",
      },
    ],
    routing: {
      if_missing_vi: "Nếu phản hồi hỏi 'ai làm sai?' quá sớm.",
      if_missing_en: "If the response asks 'who was wrong?' too early.",
      route_vi: "Ôn lại diễn ngôn chuyên nghiệp và hạ nhiệt trách lỗi.",
      route_en: "Review professional discourse and blame de-escalation.",
    },
    learner_trap: {
      trap_vi: "Dùng giọng điều tra khi chưa hiểu quy trình.",
      trap_en: "Using an investigative tone before understanding the process.",
      repair_vi: "Nêu quy trình, bước tiếp theo, và mục tiêu phòng lặp lại.",
      repair_en: "Name process, next step, and prevention.",
    },
  },
  {
    id: "pa_c2_integrated_public_notice_canada",
    focus: "public_notice",
    mode: "review",
    skills: ["public_discourse", "advanced_register", "community_discourse"],
    title_vi: "Thông báo đổi lịch không gây hoang mang",
    title_en: "Announce a schedule change without alarm",
    scenario_vi: "Một sự kiện cộng đồng ở Canada đổi giờ vào phút cuối.",
    scenario_en: "A community event in Canada changes time at the last minute.",
    task_vi: "Thông báo thay đổi, dùng lý do trung tính, và chỉ nơi xem cập nhật.",
    task_en: "Announce the change, use a neutral reason, and say where to check updates.",
    useful_phrases: [
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
      "ਸਮੇਂ ਵਿੱਚ ਤਬਦੀਲੀ ਕੀਤੀ ਗਈ ਹੈ। ਤਾਜ਼ਾ ਜਾਣਕਾਰੀ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਸੁਨੇਹਾ ਵੇਖੋ।",
    model_romanization:
      "same vich tabdili kiti gai hai. taza jaankari lai kirpa karke agla suneha vekho.",
    model_vi:
      "Đã có thay đổi về thời gian. Để có thông tin mới nhất, xin xem tin nhắn tiếp theo.",
    model_en:
      "A change has been made to the time. For the latest information, please check the next message.",
    checkpoints: [
      {
        checkpoint_vi: "Rõ thay đổi và kênh cập nhật.",
        checkpoint_en: "Clear change and update channel.",
        ready_signal_vi: "Có ਤਬਦੀਲੀ và ਤਾਜ਼ਾ ਜਾਣਕਾਰੀ.",
        ready_signal_en: "Includes ਤਬਦੀਲੀ and ਤਾਜ਼ਾ ਜਾਣਕਾਰੀ.",
      },
    ],
    routing: {
      if_missing_vi: "Nếu thông báo thiếu kênh cập nhật hoặc nghe kịch tính.",
      if_missing_en: "If the notice lacks update guidance or sounds dramatic.",
      route_vi: "Luyện lại thông báo công khai: thay đổi, lý do trung tính, cập nhật.",
      route_en: "Practice public notice structure: change, neutral reason, update.",
    },
    learner_trap: {
      trap_vi: "Dùng từ kịch tính cho thay đổi nhỏ.",
      trap_en: "Using dramatic wording for a small change.",
      repair_vi: "Dùng giọng trung tính với ਤਬਦੀਲੀ.",
      repair_en: "Use neutral wording with ਤਬਦੀਲੀ.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_integrated_nuanced_disagreement",
    focus: "nuanced_disagreement",
    mode: "readiness",
    skills: ["nuanced_disagreement", "diplomacy", "professional_discourse"],
    title_vi: "Bất đồng chuyên nghiệp với bằng chứng",
    title_en: "Professional disagreement with evidence",
    scenario_vi: "Bạn thấy đề xuất có mục tiêu tốt nhưng thiếu dữ liệu hỗ trợ.",
    scenario_en: "You think a proposal has a good goal but lacks supporting data.",
    task_vi: "Công nhận mục tiêu, giới hạn bất đồng vào bằng chứng, và mời bổ sung.",
    task_en: "Validate the goal, limit disagreement to evidence, and invite additions.",
    useful_phrases: [
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
    model_gurmukhi:
      "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ। ਜੇ ਸਬੂਤ ਹੋਰ ਸਪਸ਼ਟ ਹੋਣ ਤਾਂ ਇਹ ਸੁਝਾਅ ਹੋਰ ਮਜ਼ਬੂਤ ਹੋਵੇਗਾ।",
    model_romanization:
      "maqsad naal main sahimat haan. je sabut hor spasht hon taan ih sujhaa hor mazbut hovega.",
    model_vi:
      "Tôi đồng ý với mục tiêu. Nếu bằng chứng rõ hơn thì đề xuất này sẽ mạnh hơn.",
    model_en:
      "I agree with the goal. If the evidence is clearer, this proposal will be stronger.",
    checkpoints: [
      {
        checkpoint_vi: "Bất đồng có điều kiện và có trọng tâm.",
        checkpoint_en: "The disagreement is conditional and focused.",
        ready_signal_vi: "Có ਜੇ...ਤਾਂ và ਸਬੂਤ.",
        ready_signal_en: "Includes ਜੇ...ਤਾਂ and ਸਬੂਤ.",
      },
    ],
    routing: {
      if_missing_vi: "Nếu câu chỉ nói 'không đúng'.",
      if_missing_en: "If the sentence only says 'not correct'.",
      route_vi: "Quay lại luyện bất đồng có sắc thái và bằng chứng.",
      route_en: "Route to nuanced disagreement and evidence framing.",
    },
    learner_trap: {
      trap_vi: "Phản biện vào người nói thay vì dữ liệu.",
      trap_en: "Challenging the speaker instead of the data.",
      repair_vi: "Nói về ਸਬੂਤ hoặc ਨਜ਼ਰੀਆ.",
      repair_en: "Talk about ਸਬੂਤ or ਨਜ਼ਰੀਆ.",
    },
  },
  {
    id: "pa_c2_integrated_community_mediation",
    focus: "community_mediation",
    mode: "routing",
    skills: ["community_discourse", "deescalation", "negotiation", "sensitive_topic_framing"],
    title_vi: "Hòa giải lịch sự trong nhóm cộng đồng",
    title_en: "Polite mediation in a community group",
    scenario_vi: "Nhóm đồng ý tổ chức cuối tuần nhưng chưa thống nhất ngày và có ý kiến căng.",
    scenario_en: "A group agrees on the weekend but not the date, and comments are becoming tense.",
    task_vi: "Tóm tắt đồng thuận, hạ nhiệt, rồi đề xuất lấy ý kiến về hai lựa chọn.",
    task_en: "Summarize agreement, de-escalate, then propose getting views on two options.",
    useful_phrases: [
      {
        gurmukhi: "ਹੁਣ ਤੱਕ ਸਹਿਮਤੀ ਇਹ ਹੈ",
        romanization: "hun takk sahimati ih hai",
        vi: "Đến giờ, điểm đồng thuận là...",
        en: "So far, the agreement is...",
      },
      {
        gurmukhi: "ਦੋ ਚੋਣਾਂ ਤੇ ਰਾਇ ਲੈ ਲਈਏ",
        romanization: "do chonan te rai lai laie",
        vi: "Hãy lấy ý kiến về hai lựa chọn.",
        en: "Let's get views on two choices.",
      },
    ],
    model_gurmukhi:
      "ਹੁਣ ਤੱਕ ਸਹਿਮਤੀ ਇਹ ਹੈ ਕਿ ਸਮਾਗਮ ਹਫ਼ਤੇ ਦੇ ਅੰਤ ਹੋਵੇ। ਆਓ ਦੋ ਚੋਣਾਂ ਤੇ ਰਾਇ ਲੈ ਲਈਏ ਅਤੇ ਫਿਰ ਫੈਸਲਾ ਕਰੀਏ।",
    model_romanization:
      "hun takk sahimati ih hai ki samagam hafte de ant hove. aao do chonan te rai lai laie ate fir faisla karie.",
    model_vi:
      "Đến giờ, điểm đồng thuận là sự kiện vào cuối tuần. Hãy lấy ý kiến về hai lựa chọn rồi quyết định.",
    model_en:
      "So far, the agreement is that the event should be on the weekend. Let's get views on two choices and then decide.",
    checkpoints: [
      {
        checkpoint_vi: "Có tóm tắt trước đề xuất.",
        checkpoint_en: "Summarizes before proposing.",
        ready_signal_vi: "Có ਸਹਿਮਤੀ và ਰਾਇ.",
        ready_signal_en: "Includes ਸਹਿਮਤੀ and ਰਾਇ.",
      },
    ],
    routing: {
      if_missing_vi: "Nếu người học chỉ nêu sở thích riêng.",
      if_missing_en: "If the learner only states a personal preference.",
      route_vi: "Ôn lại điều phối cộng đồng và đàm phán lựa chọn.",
      route_en: "Review community coordination and choice negotiation.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_integrated_handoff_readiness",
    focus: "handoff_readiness",
    mode: "readiness",
    skills: ["advanced_register", "public_discourse", "professional_discourse", "diplomacy"],
    title_vi: "Bàn giao rõ ràng cho người phụ trách tiếp theo",
    title_en: "Clear handoff to the next responsible person",
    scenario_vi: "Bạn kết thúc vai trò điều phối và cần bàn giao thông tin còn mở.",
    scenario_en: "You are ending a coordinator role and need to hand off open information.",
    task_vi: "Tóm tắt việc đã xong, việc còn mở, và cách liên hệ mà không tự nhận thẩm quyền quá mức.",
    task_en: "Summarize what is done, what remains open, and contact paths without overstating authority.",
    useful_phrases: [
      {
        gurmukhi: "ਹੁਣ ਤੱਕ ਇਹ ਕੰਮ ਪੂਰਾ ਹੋਇਆ ਹੈ",
        romanization: "hun takk ih kamm pura hoia hai",
        vi: "Đến giờ, việc này đã hoàn tất.",
        en: "So far, this work has been completed.",
      },
      {
        gurmukhi: "ਅਗਲਾ ਧਿਆਨ ਇਸ ਗੱਲ ਤੇ ਰਹੇਗਾ",
        romanization: "agla dhiaan is gall te rahega",
        vi: "Trọng tâm tiếp theo sẽ là việc này.",
        en: "The next focus will be this matter.",
      },
    ],
    model_gurmukhi:
      "ਹੁਣ ਤੱਕ ਇਹ ਕੰਮ ਪੂਰਾ ਹੋਇਆ ਹੈ। ਅਗਲਾ ਧਿਆਨ ਸਮੇਂ ਦੀ ਪੁਸ਼ਟੀ ਤੇ ਰਹੇਗਾ, ਅਤੇ ਸਵਾਲ ਹੋਣ ਤਾਂ ਕਿਰਪਾ ਕਰਕੇ ਅਗਲੇ ਸੰਪਰਕ ਨੂੰ ਲਿਖੋ।",
    model_romanization:
      "hun takk ih kamm pura hoia hai. agla dhiaan same di pushti te rahega, ate sawal hon taan kirpa karke agle sampark nu likho.",
    model_vi:
      "Đến giờ, việc này đã hoàn tất. Trọng tâm tiếp theo là xác nhận thời gian, và nếu có câu hỏi xin viết cho đầu mối tiếp theo.",
    model_en:
      "So far, this work has been completed. The next focus will be confirming the time, and if there are questions, please write to the next contact.",
    checkpoints: [
      {
        checkpoint_vi: "Bàn giao có việc đã xong, việc còn mở, và kênh liên hệ.",
        checkpoint_en: "The handoff has completed work, open work, and a contact path.",
        ready_signal_vi: "Có ਪੂਰਾ ਹੋਇਆ, ਅਗਲਾ ਧਿਆਨ, và ਸੰਪਰਕ.",
        ready_signal_en: "Includes ਪੂਰਾ ਹੋਇਆ, ਅਗਲਾ ਧਿਆਨ, and ਸੰਪਰਕ.",
      },
    ],
    routing: {
      if_missing_vi: "Nếu bàn giao chỉ là lời chào kết thúc.",
      if_missing_en: "If the handoff is only a closing greeting.",
      route_vi: "Luyện lại bàn giao bằng tóm tắt, điểm còn mở, và liên hệ.",
      route_en: "Route to handoff practice with summary, open point, and contact.",
    },
  },
];

export const integratedDiscourseTasksC2ByFocus = (
  focus: PunjabiC2IntegratedFocus,
): PunjabiC2IntegratedTask[] =>
  integratedDiscourseTasksC2.filter((task) => task.focus === focus);
