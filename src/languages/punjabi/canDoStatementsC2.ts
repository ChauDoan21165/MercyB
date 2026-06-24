// Punjabi C2 can-do statements for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support self-assessment statements, not certification,
// official placement, or native-reviewed authority. Native review is deferred.
// Shahmukhi is mentioned only for script awareness, not as a full course.

export type PunjabiC2CanDoFocus =
  | "nuanced_disagreement"
  | "negotiation"
  | "diplomacy"
  | "conflict_deescalation"
  | "sensitive_topic_framing"
  | "community_discourse"
  | "professional_discourse"
  | "public_discourse";

export type PunjabiC2CanDoEvidence = "spoken" | "written" | "mediation" | "checkpoint";

export type PunjabiC2CanDoStatus = "ready" | "near_ready" | "needs_practice";

export type PunjabiC2CanDoPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2CanDoCheckpoint = {
  can_do_vi: string;
  can_do_en: string;
  evidence_vi: string;
  evidence_en: string;
};

export type PunjabiC2CanDoTrap = {
  trap_vi: string;
  trap_en: string;
  better_vi: string;
  better_en: string;
};

export type PunjabiC2CanDoReadiness = {
  self_check_vi: string;
  self_check_en: string;
  ready_signal_vi: string;
  ready_signal_en: string;
  status_if_missing: PunjabiC2CanDoStatus;
};

export type PunjabiC2CanDoStatement = {
  id: string;
  focus: PunjabiC2CanDoFocus;
  evidence_type: PunjabiC2CanDoEvidence;
  title_vi: string;
  title_en: string;
  statement_vi: string;
  statement_en: string;
  learner_context_vi: string;
  learner_context_en: string;
  sample_phrases: PunjabiC2CanDoPhrase[];
  model_gurmukhi: string;
  model_romanization: string;
  model_vi: string;
  model_en: string;
  checkpoints: PunjabiC2CanDoCheckpoint[];
  readiness: PunjabiC2CanDoReadiness;
  learner_trap?: PunjabiC2CanDoTrap;
  canada_practical?: boolean;
};

export const C2_CAN_DO_STATEMENTS_DISCLAIMER = {
  vi: "Các câu 'tôi có thể' Punjabi C2 này chỉ hỗ trợ tự học, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "These C2 Punjabi can-do statements support self-study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const canDoStatementsC2: PunjabiC2CanDoStatement[] = [
  {
    id: "pa_c2_can_do_nuanced_disagreement",
    focus: "nuanced_disagreement",
    evidence_type: "spoken",
    title_vi: "Phản biện có sắc thái",
    title_en: "Nuanced disagreement",
    statement_vi: "Tôi có thể phản biện một ý kiến mạnh mà vẫn công nhận mục tiêu chung.",
    statement_en: "I can challenge a strong opinion while still validating the shared goal.",
    learner_context_vi: "Dùng trong họp nhóm, thảo luận học thuật, hoặc trao đổi cộng đồng.",
    learner_context_en: "Use in group meetings, academic discussion, or community exchange.",
    sample_phrases: [
      {
        gurmukhi: "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ",
        romanization: "maqsad naal main sahimat haan",
        vi: "Tôi đồng ý với mục tiêu.",
        en: "I agree with the goal.",
      },
      {
        gurmukhi: "ਪਰ ਮੇਰੀ ਚਿੰਤਾ ਇਹ ਹੈ",
        romanization: "par meri chinta ih hai",
        vi: "Nhưng điều tôi lo là...",
        en: "But my concern is...",
      },
    ],
    model_gurmukhi:
      "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ, ਪਰ ਮੇਰੀ ਚਿੰਤਾ ਇਹ ਹੈ ਕਿ ਸਬੂਤ ਅਜੇ ਪੂਰੇ ਨਹੀਂ ਹਨ।",
    model_romanization:
      "maqsad naal main sahimat haan, par meri chinta ih hai ki sabut aje pure nahin han.",
    model_vi:
      "Tôi đồng ý với mục tiêu, nhưng điều tôi lo là bằng chứng vẫn chưa đầy đủ.",
    model_en:
      "I agree with the goal, but my concern is that the evidence is not complete yet.",
    checkpoints: [
      {
        can_do_vi: "Công nhận trước khi nêu bất đồng.",
        can_do_en: "Validate before stating disagreement.",
        evidence_vi: "Câu trả lời có cả ਮਕਸਦ và ਚਿੰਤਾ.",
        evidence_en: "The response includes both ਮਕਸਦ and ਚਿੰਤਾ.",
      },
      {
        can_do_vi: "Phản biện vào ý, không vào người.",
        can_do_en: "Challenges the idea, not the person.",
        evidence_vi: "Không dùng câu chê người nghe.",
        evidence_en: "Does not criticize the listener personally.",
      },
    ],
    readiness: {
      self_check_vi: "Tôi có thể nói khác ý mà không làm câu nghe như phủ nhận toàn bộ không?",
      self_check_en: "Can I disagree without making the sentence sound like total rejection?",
      ready_signal_vi: "Bất đồng được giới hạn bằng lý do cụ thể.",
      ready_signal_en: "The disagreement is limited by a specific reason.",
      status_if_missing: "needs_practice",
    },
    learner_trap: {
      trap_vi: "Mở đầu bằng 'không đúng' làm mất sắc thái C2.",
      trap_en: "Opening with 'not correct' loses C2 nuance.",
      better_vi: "Dùng công nhận mục tiêu trước.",
      better_en: "Validate the goal first.",
    },
  },
  {
    id: "pa_c2_can_do_negotiation_canada",
    focus: "negotiation",
    evidence_type: "mediation",
    title_vi: "Đàm phán có ràng buộc",
    title_en: "Constrained negotiation",
    statement_vi:
      "Tôi có thể thương lượng lựa chọn tiếp theo khi có quy định hoặc giấy tờ chưa đủ.",
    statement_en:
      "I can negotiate next options when rules or documents create constraints.",
    learner_context_vi: "Hữu ích tại dịch vụ công, trường học, hoặc nơi làm việc ở Canada.",
    learner_context_en: "Useful at public services, schools, or workplaces in Canada.",
    sample_phrases: [
      {
        gurmukhi: "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ",
        romanization: "mainu niyam di samajh hai",
        vi: "Tôi hiểu quy định.",
        en: "I understand the rule.",
      },
      {
        gurmukhi: "ਕੀ ਕੋਈ ਹੋਰ ਵਿਕਲਪ ਹੈ?",
        romanization: "ki koi hor vikalp hai?",
        vi: "Có lựa chọn khác không?",
        en: "Is there another option?",
      },
    ],
    model_gurmukhi:
      "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ। ਮੇਰੇ ਕੋਲ ਇਸ ਵੇਲੇ ਕਾਪੀ ਹੈ; ਕੀ ਕੋਈ ਹੋਰ ਵਿਕਲਪ ਹੈ?",
    model_romanization:
      "mainu niyam di samajh hai. mere kol is vele copy hai; ki koi hor vikalp hai?",
    model_vi:
      "Tôi hiểu quy định. Hiện tôi có bản sao; có lựa chọn khác không?",
    model_en:
      "I understand the rule. Right now I have a copy; is there another option?",
    checkpoints: [
      {
        can_do_vi: "Tôn trọng quy định trước khi hỏi lựa chọn.",
        can_do_en: "Respects the rule before asking for options.",
        evidence_vi: "Có ਨਿਯਮ và ਵਿਕਲਪ trong phản hồi.",
        evidence_en: "Includes ਨਿਯਮ and ਵਿਕਲਪ in the response.",
      },
    ],
    readiness: {
      self_check_vi: "Tôi có thể hỏi lựa chọn mà không nghe như đòi ngoại lệ không?",
      self_check_en: "Can I ask for options without sounding like I demand an exception?",
      ready_signal_vi: "Câu hỏi mở ra bước tiếp theo.",
      ready_signal_en: "The question opens a next step.",
      status_if_missing: "near_ready",
    },
    learner_trap: {
      trap_vi: "Chỉ nói 'tôi không có' rồi dừng lại.",
      trap_en: "Only saying 'I do not have it' and stopping.",
      better_vi: "Nêu cái đang có rồi hỏi ਵਿਕਲਪ.",
      better_en: "State what you have, then ask about ਵਿਕਲਪ.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_can_do_diplomacy",
    focus: "diplomacy",
    evidence_type: "written",
    title_vi: "Ngoại giao khi từ chối",
    title_en: "Diplomatic refusal",
    statement_vi: "Tôi có thể từ chối một đề xuất mà vẫn giữ thiện chí hợp tác.",
    statement_en: "I can refuse a proposal while preserving goodwill.",
    learner_context_vi: "Dùng khi trả lời lời mời, đề xuất dự án, hoặc yêu cầu không phù hợp.",
    learner_context_en:
      "Use when responding to invitations, project proposals, or unsuitable requests.",
    sample_phrases: [
      {
        gurmukhi: "ਤੁਹਾਡੇ ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ",
        romanization: "tuhade sujhaa lai dhanvaad",
        vi: "Cảm ơn đề xuất của anh/chị.",
        en: "Thank you for your suggestion.",
      },
      {
        gurmukhi: "ਇਸ ਵੇਲੇ ਇਹ ਸੰਭਵ ਨਹੀਂ ਹੋਵੇਗਾ",
        romanization: "is vele ih sambhav nahin hovega",
        vi: "Hiện tại việc này sẽ không khả thi.",
        en: "At the moment this will not be possible.",
      },
    ],
    model_gurmukhi:
      "ਤੁਹਾਡੇ ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ। ਇਸ ਵੇਲੇ ਇਹ ਸੰਭਵ ਨਹੀਂ ਹੋਵੇਗਾ, ਪਰ ਅਸੀਂ ਹੋਰ ਮੌਕੇ ਲਈ ਸੰਪਰਕ ਵਿੱਚ ਰਹਿ ਸਕਦੇ ਹਾਂ।",
    model_romanization:
      "tuhade sujhaa lai dhanvaad. is vele ih sambhav nahin hovega, par asin hor mauke lai sampark vich rahi sakde haan.",
    model_vi:
      "Cảm ơn đề xuất của anh/chị. Hiện tại việc này sẽ không khả thi, nhưng chúng ta có thể giữ liên lạc cho cơ hội khác.",
    model_en:
      "Thank you for your suggestion. At the moment this will not be possible, but we can stay in touch for another opportunity.",
    checkpoints: [
      {
        can_do_vi: "Cảm ơn trước khi từ chối.",
        can_do_en: "Thanks before refusing.",
        evidence_vi: "Từ chối được làm mềm bằng ਧੰਨਵਾਦ và ਇਸ ਵੇਲੇ.",
        evidence_en: "The refusal is softened with ਧੰਨਵਾਦ and ਇਸ ਵੇਲੇ.",
      },
    ],
    readiness: {
      self_check_vi: "Tôi có thể nói không mà vẫn để lại quan hệ tốt không?",
      self_check_en: "Can I say no while leaving the relationship intact?",
      ready_signal_vi: "Có giới hạn hiện tại và khả năng tương lai.",
      ready_signal_en: "Includes a present limit and future possibility.",
      status_if_missing: "near_ready",
    },
    learner_trap: {
      trap_vi: "Dịch thẳng 'I refuse' nghe quá nặng.",
      trap_en: "Directly translating 'I refuse' sounds too heavy.",
      better_vi: "Dùng ਇਸ ਵੇਲੇ ਇਹ ਸੰਭਵ ਨਹੀਂ ਹੋਵੇਗਾ.",
      better_en: "Use ਇਸ ਵੇਲੇ ਇਹ ਸੰਭਵ ਨਹੀਂ ਹੋਵੇਗਾ.",
    },
  },
  {
    id: "pa_c2_can_do_conflict_deescalation",
    focus: "conflict_deescalation",
    evidence_type: "spoken",
    title_vi: "Hạ nhiệt xung đột",
    title_en: "Conflict de-escalation",
    statement_vi: "Tôi có thể hạ nhiệt cuộc trao đổi bằng quy trình và mục tiêu chung.",
    statement_en: "I can de-escalate an exchange through process and a shared goal.",
    learner_context_vi: "Dùng trong cuộc họp cộng đồng, nhóm học, hoặc nơi làm việc.",
    learner_context_en: "Use in community meetings, study groups, or workplaces.",
    sample_phrases: [
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
        can_do_vi: "Đề xuất cách nói chuyện thay vì phán xét cảm xúc.",
        can_do_en: "Suggests a speaking process instead of judging emotion.",
        evidence_vi: "Có một quy trình nghe hoặc nói lần lượt.",
        evidence_en: "Includes a turn-taking listening or speaking process.",
      },
    ],
    readiness: {
      self_check_vi: "Tôi có tránh ra lệnh 'bình tĩnh' không?",
      self_check_en: "Do I avoid commanding people to 'calm down'?",
      ready_signal_vi: "Câu tập trung vào bਾਰੀ-ਬਾਰੀ và ਹੱਲ.",
      ready_signal_en: "The sentence focuses on ਬਾਰੀ-ਬਾਰੀ and ਹੱਲ.",
      status_if_missing: "needs_practice",
    },
    learner_trap: {
      trap_vi: "Nói 'đừng cãi nhau' có thể làm căng thẳng hơn.",
      trap_en: "Saying 'stop arguing' can raise tension.",
      better_vi: "Đề xuất nghe từng lượt.",
      better_en: "Suggest hearing each turn.",
    },
  },
  {
    id: "pa_c2_can_do_sensitive_topic",
    focus: "sensitive_topic_framing",
    evidence_type: "written",
    title_vi: "Đóng khung chủ đề nhạy cảm",
    title_en: "Sensitive-topic framing",
    statement_vi:
      "Tôi có thể nêu chủ đề nhạy cảm mà không dựa vào định kiến về tuổi, giới, gia đình, hoặc cộng đồng.",
    statement_en:
      "I can frame sensitive topics without relying on assumptions about age, gender, family, or community.",
    learner_context_vi: "Dùng khi phân công vai trò, góp ý, hoặc mời tham gia.",
    learner_context_en: "Use when assigning roles, giving feedback, or inviting participation.",
    sample_phrases: [
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
      "ਅਸੀਂ ਕੰਮ ਰੁਚੀ ਅਤੇ ਸਮੇਂ ਦੇ ਅਨੁਸਾਰ ਵੰਡ ਸਕਦੇ ਹਾਂ। ਜਿਸ ਨੂੰ ਸੁਵਿਧਾ ਹੋਵੇ, ਉਹ ਇਹ ਹਿੱਸਾ ਲੈ ਸਕਦਾ ਹੈ।",
    model_romanization:
      "asin kamm ruchi ate same de anusaar vand sakde haan. jis nu suvidha hove, oh ih hissa lai sakda hai.",
    model_vi:
      "Chúng ta có thể chia việc theo sở thích và thời gian. Ai thấy thuận tiện có thể nhận phần này.",
    model_en:
      "We can divide the work according to interest and availability. Whoever feels comfortable can take this part.",
    checkpoints: [
      {
        can_do_vi: "Dùng tiêu chí trung tính.",
        can_do_en: "Uses neutral criteria.",
        evidence_vi: "Tiêu chí là ਰੁਚੀ, ਸਮਾਂ, hoặc ਸੁਵਿਧਾ.",
        evidence_en: "Criteria are ਰੁਚੀ, ਸਮਾਂ, or ਸੁਵਿਧਾ.",
      },
    ],
    readiness: {
      self_check_vi: "Tôi có tránh gán vai theo định kiến không?",
      self_check_en: "Do I avoid assigning roles through stereotypes?",
      ready_signal_vi: "Người nghe có quyền chọn hoặc từ chối.",
      ready_signal_en: "Listeners can choose or decline.",
      status_if_missing: "needs_practice",
    },
    learner_trap: {
      trap_vi: "Dùng 'ai đó nên làm vì họ là...' tạo định kiến.",
      trap_en: "Using 'someone should do it because they are...' creates stereotypes.",
      better_vi: "Mời theo khả năng, thời gian, và sự thoải mái.",
      better_en: "Invite by capacity, availability, and comfort.",
    },
  },
  {
    id: "pa_c2_can_do_community_discourse",
    focus: "community_discourse",
    evidence_type: "checkpoint",
    title_vi: "Điều phối diễn ngôn cộng đồng",
    title_en: "Community discourse control",
    statement_vi: "Tôi có thể tóm tắt đồng thuận, điểm còn mở, và bước tiếp theo cho nhóm.",
    statement_en: "I can summarize agreement, open points, and next steps for a group.",
    learner_context_vi: "Hữu ích khi họp cộng đồng, tổ chức sự kiện, hoặc nhóm tình nguyện ở Canada.",
    learner_context_en:
      "Useful in community meetings, event planning, or volunteer groups in Canada.",
    sample_phrases: [
      {
        gurmukhi: "ਹੁਣ ਤੱਕ ਸਹਿਮਤੀ ਇਹ ਹੈ",
        romanization: "hun takk sahimati ih hai",
        vi: "Đến giờ, điểm đồng thuận là...",
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
      "Đến giờ, điểm đồng thuận là sự kiện vào cuối tuần. Bước tiếp theo có thể là lấy ý kiến về hai ngày.",
    model_en:
      "So far, the agreement is that the event should be on the weekend. The next step could be to get views on two dates.",
    checkpoints: [
      {
        can_do_vi: "Tách đồng thuận khỏi câu hỏi còn mở.",
        can_do_en: "Separates agreement from the remaining open question.",
        evidence_vi: "Có ਸਹਿਮਤੀ và ਅਗਲਾ ਕਦਮ.",
        evidence_en: "Includes ਸਹਿਮਤੀ and ਅਗਲਾ ਕਦਮ.",
      },
    ],
    readiness: {
      self_check_vi: "Tôi có đang điều phối nhóm thay vì chỉ nêu ý kiến riêng không?",
      self_check_en: "Am I coordinating the group rather than only stating my preference?",
      ready_signal_vi: "Nghe như một bản tóm tắt nhóm.",
      ready_signal_en: "Sounds like a group summary.",
      status_if_missing: "near_ready",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_can_do_professional_discourse",
    focus: "professional_discourse",
    evidence_type: "written",
    title_vi: "Diễn ngôn chuyên nghiệp",
    title_en: "Professional discourse",
    statement_vi:
      "Tôi có thể xử lý lỗi hoặc thay đổi quy trình bằng giọng trách nhiệm nhưng không đổ lỗi.",
    statement_en:
      "I can handle errors or process changes with accountable but non-blaming language.",
    learner_context_vi: "Dùng trong email công việc, biên bản, hoặc cập nhật dự án.",
    learner_context_en: "Use in work email, minutes, or project updates.",
    sample_phrases: [
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
        can_do_vi: "Nhận vấn đề qua quy trình.",
        can_do_en: "Addresses the issue through process.",
        evidence_vi: "Không hỏi 'ai sai' trước.",
        evidence_en: "Does not ask 'who was wrong' first.",
      },
    ],
    readiness: {
      self_check_vi: "Tôi có giữ trách nhiệm mà không đổ lỗi cá nhân không?",
      self_check_en: "Can I keep accountability without personal blame?",
      ready_signal_vi: "Có quy trình, bước tiếp theo, và mục tiêu phòng lặp lại.",
      ready_signal_en: "Includes process, next step, and prevention.",
      status_if_missing: "near_ready",
    },
    learner_trap: {
      trap_vi: "Dùng giọng điều tra quá sớm.",
      trap_en: "Using an investigative tone too early.",
      better_vi: "Chuyển về ਪ੍ਰਕਿਰਿਆ và ਅਗਲਾ ਕਦਮ.",
      better_en: "Shift to ਪ੍ਰਕਿਰਿਆ and ਅਗਲਾ ਕਦਮ.",
    },
  },
  {
    id: "pa_c2_can_do_public_discourse",
    focus: "public_discourse",
    evidence_type: "written",
    title_vi: "Thông báo công khai cân bằng",
    title_en: "Balanced public notice",
    statement_vi:
      "Tôi có thể thông báo thay đổi công khai bằng ngôn ngữ rõ, trung tính, và có hướng dẫn cập nhật.",
    statement_en:
      "I can announce a public change with clear, neutral language and update guidance.",
    learner_context_vi: "Dùng cho sự kiện cộng đồng, lớp học, hoặc nhóm dịch vụ ở Canada.",
    learner_context_en: "Use for community events, classes, or service groups in Canada.",
    sample_phrases: [
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
        can_do_vi: "Nêu thay đổi và kênh cập nhật.",
        can_do_en: "States the change and update channel.",
        evidence_vi: "Có ਤਬਦੀਲੀ và ਤਾਜ਼ਾ ਜਾਣਕਾਰੀ.",
        evidence_en: "Includes ਤਬਦੀਲੀ and ਤਾਜ਼ਾ ਜਾਣਕਾਰੀ.",
      },
    ],
    readiness: {
      self_check_vi: "Thông báo có rõ nhưng không gây hoang mang không?",
      self_check_en: "Is the notice clear without causing alarm?",
      ready_signal_vi: "Người đọc biết thay đổi là gì và xem cập nhật ở đâu.",
      ready_signal_en: "Readers know what changed and where to check updates.",
      status_if_missing: "near_ready",
    },
    learner_trap: {
      trap_vi: "Dùng từ quá kịch tính cho thay đổi nhỏ.",
      trap_en: "Using dramatic wording for a small change.",
      better_vi: "Dùng giọng trung tính với ਤਬਦੀਲੀ.",
      better_en: "Use neutral wording with ਤਬਦੀਲੀ.",
    },
    canada_practical: true,
  },
];

export const canDoStatementsC2ByFocus = (
  focus: PunjabiC2CanDoFocus,
): PunjabiC2CanDoStatement[] =>
  canDoStatementsC2.filter((statement) => statement.focus === focus);
