// Punjabi C2 final review deck for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support final review, not certification, official
// placement, or native-reviewed authority. Native review is deferred.
// Shahmukhi is mentioned only for script awareness, not as a full course.

export type PunjabiC2FinalReviewFocus =
  | "nuanced_disagreement"
  | "negotiation"
  | "diplomacy"
  | "deescalation"
  | "sensitive_topic_framing"
  | "advanced_register"
  | "community_discourse"
  | "professional_discourse"
  | "public_discourse";

export type PunjabiC2FinalReviewMode = "qa" | "checkpoint" | "rewrite" | "scenario";

export type PunjabiC2FinalReviewPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2FinalReviewCheckpoint = {
  check_vi: string;
  check_en: string;
  pass_signal_vi: string;
  pass_signal_en: string;
};

export type PunjabiC2FinalReviewTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2FinalReviewCard = {
  id: string;
  focus: PunjabiC2FinalReviewFocus;
  mode: PunjabiC2FinalReviewMode;
  title_vi: string;
  title_en: string;
  prompt_vi: string;
  prompt_en: string;
  question_vi: string;
  question_en: string;
  answer_gurmukhi: string;
  answer_romanization: string;
  answer_vi: string;
  answer_en: string;
  useful_phrases: PunjabiC2FinalReviewPhrase[];
  checkpoints: PunjabiC2FinalReviewCheckpoint[];
  learner_trap?: PunjabiC2FinalReviewTrap;
  canada_practical?: boolean;
};

export const C2_FINAL_REVIEW_DECK_DISCLAIMER = {
  vi: "Bộ ôn tập cuối Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi final review deck supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const finalReviewDeckC2: PunjabiC2FinalReviewCard[] = [
  {
    id: "pa_c2_final_nuanced_disagreement",
    focus: "nuanced_disagreement",
    mode: "rewrite",
    title_vi: "Viết lại bất đồng quá thẳng",
    title_en: "Rewrite overly direct disagreement",
    prompt_vi: "Câu gốc: 'Ý này sai.' Hãy giữ bất đồng nhưng thêm sắc thái.",
    prompt_en: "Original: 'This idea is wrong.' Keep the disagreement but add nuance.",
    question_vi: "Bạn sẽ công nhận điểm nào trước khi phản biện?",
    question_en: "What will you validate before challenging the point?",
    answer_gurmukhi:
      "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ, ਪਰ ਮੇਰੀ ਚਿੰਤਾ ਇਹ ਹੈ ਕਿ ਸਬੂਤ ਅਜੇ ਸਪਸ਼ਟ ਨਹੀਂ ਹਨ।",
    answer_romanization:
      "maqsad naal main sahimat haan, par meri chinta ih hai ki sabut aje spasht nahin han.",
    answer_vi:
      "Tôi đồng ý với mục tiêu, nhưng điều tôi lo là bằng chứng vẫn chưa rõ.",
    answer_en:
      "I agree with the goal, but my concern is that the evidence is still not clear.",
    useful_phrases: [
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
        check_vi: "Có công nhận trước bất đồng không?",
        check_en: "Is there validation before disagreement?",
        pass_signal_vi: "Có ਮਕਸਦ hoặc điểm chung.",
        pass_signal_en: "Includes ਮਕਸਦ or common ground.",
      },
      {
        check_vi: "Bất đồng có nhắm vào bằng chứng không?",
        check_en: "Does the disagreement target evidence?",
        pass_signal_vi: "Nêu ਸਬੂਤ thay vì chê người.",
        pass_signal_en: "Names ਸਬੂਤ instead of criticizing a person.",
      },
    ],
    learner_trap: {
      trap_vi: "Dịch thẳng 'wrong' bằng giọng phán xét.",
      trap_en: "Translating 'wrong' with a judging tone.",
      repair_vi: "Chuyển sang 'chưa rõ' hoặc 'cần thêm bằng chứng'.",
      repair_en: "Shift to 'not clear yet' or 'needs more evidence'.",
    },
  },
  {
    id: "pa_c2_final_negotiation_canada",
    focus: "negotiation",
    mode: "scenario",
    title_vi: "Hỏi lựa chọn tại quầy dịch vụ Canada",
    title_en: "Ask for options at a Canadian service desk",
    prompt_vi: "Bạn thiếu bản gốc nhưng có bản sao và email xác nhận.",
    prompt_en: "You lack the original but have a copy and a confirmation email.",
    question_vi: "Câu nào vừa tôn trọng quy định vừa mở ra bước tiếp theo?",
    question_en: "What sentence respects the rule while opening a next step?",
    answer_gurmukhi:
      "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ। ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਅਤੇ ਪੁਸ਼ਟੀ ਵਾਲਾ ਈਮੇਲ ਹੈ; ਕੀ ਕੋਈ ਹੋਰ ਵਿਕਲਪ ਹੋ ਸਕਦਾ ਹੈ?",
    answer_romanization:
      "mainu niyam di samajh hai. mere kol copy ate pushti wala email hai; ki koi hor vikalp ho sakda hai?",
    answer_vi:
      "Tôi hiểu quy định. Tôi có bản sao và email xác nhận; có lựa chọn khác nào không?",
    answer_en:
      "I understand the rule. I have a copy and a confirmation email; could there be another option?",
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
    checkpoints: [
      {
        check_vi: "Có thừa nhận quy định không?",
        check_en: "Does it acknowledge the rule?",
        pass_signal_vi: "Có ਨਿਯਮ ਦੀ ਸਮਝ.",
        pass_signal_en: "Includes ਨਿਯਮ ਦੀ ਸਮਝ.",
      },
      {
        check_vi: "Có hỏi lựa chọn thay vì đòi ngoại lệ không?",
        check_en: "Does it ask for options instead of demanding an exception?",
        pass_signal_vi: "Có ਵਿਕਲਪ.",
        pass_signal_en: "Includes ਵਿਕਲਪ.",
      },
    ],
    learner_trap: {
      trap_vi: "Nói 'anh/chị phải chấp nhận' làm câu nghe ép buộc.",
      trap_en: "Saying 'you must accept this' sounds coercive.",
      repair_vi: "Hỏi về ਵਿਕਲਪ hoặc ਅਗਲਾ ਕਦਮ.",
      repair_en: "Ask about ਵਿਕਲਪ or ਅਗਲਾ ਕਦਮ.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_final_diplomacy_refusal",
    focus: "diplomacy",
    mode: "qa",
    title_vi: "Từ chối ngoại giao",
    title_en: "Diplomatic refusal",
    prompt_vi: "Một lời mời tốt nhưng không phù hợp với lịch của bạn.",
    prompt_en: "A good invitation does not fit your schedule.",
    question_vi: "Làm sao nói không mà vẫn giữ thiện chí?",
    question_en: "How do you say no while preserving goodwill?",
    answer_gurmukhi:
      "ਤੁਹਾਡੇ ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਲਈ ਆਉਣਾ ਸੰਭਵ ਨਹੀਂ ਹੋਵੇਗਾ, ਪਰ ਅਗਲੇ ਮੌਕੇ ਲਈ ਖੁਸ਼ੀ ਰਹੇਗੀ।",
    answer_romanization:
      "tuhade sadde lai dhanvaad. is vele mere lai auna sambhav nahin hovega, par agle mauke lai khushi rahegi.",
    answer_vi:
      "Cảm ơn lời mời của anh/chị. Hiện tại tôi không thể đến, nhưng tôi sẽ rất vui cho dịp sau.",
    answer_en:
      "Thank you for the invitation. At the moment I will not be able to come, but I would be happy for a future opportunity.",
    useful_phrases: [
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
        check_vi: "Có cảm ơn trước khi từ chối không?",
        check_en: "Does it thank before refusing?",
        pass_signal_vi: "Có ਧੰਨਵਾਦ trước ਸੰਭਵ ਨਹੀਂ.",
        pass_signal_en: "Has ਧੰਨਵਾਦ before ਸੰਭਵ ਨਹੀਂ.",
      },
    ],
    learner_trap: {
      trap_vi: "Dùng 'tôi từ chối' nghe quá cứng.",
      trap_en: "Using 'I refuse' sounds too stiff.",
      repair_vi: "Giới hạn bằng ਇਸ ਵੇਲੇ và mở dịp sau.",
      repair_en: "Limit with ਇਸ ਵੇਲੇ and leave a later opportunity open.",
    },
  },
  {
    id: "pa_c2_final_deescalation",
    focus: "deescalation",
    mode: "checkpoint",
    title_vi: "Hạ nhiệt khi nói chồng lên nhau",
    title_en: "De-escalate overlapping speech",
    prompt_vi: "Hai người trong cuộc họp cộng đồng đang nói cùng lúc.",
    prompt_en: "Two people in a community meeting are speaking at the same time.",
    question_vi: "Câu nào điều phối quy trình mà không phán xét cảm xúc?",
    question_en: "What sentence coordinates process without judging emotion?",
    answer_gurmukhi:
      "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ। ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ, ਇਸ ਲਈ ਬਾਰੀ-ਬਾਰੀ ਗੱਲ ਕਰੀਏ।",
    answer_romanization:
      "aao ikk-ikk gall sunie. maqsad hall labhna hai, is lai baari-baari gall karie.",
    answer_vi:
      "Ta hãy nghe từng ý một. Mục tiêu là tìm giải pháp, vì vậy hãy nói lần lượt.",
    answer_en:
      "Let's hear one point at a time. The goal is to find a solution, so let's speak in turn.",
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
    checkpoints: [
      {
        check_vi: "Có đề xuất quy trình không?",
        check_en: "Does it propose a process?",
        pass_signal_vi: "Có ਇੱਕ-ਇੱਕ hoặc ਬਾਰੀ-ਬਾਰੀ.",
        pass_signal_en: "Includes ਇੱਕ-ਇੱਕ or ਬਾਰੀ-ਬਾਰੀ.",
      },
      {
        check_vi: "Có tránh ra lệnh cảm xúc không?",
        check_en: "Does it avoid emotional commands?",
        pass_signal_vi: "Không dùng câu kiểu 'bình tĩnh đi'.",
        pass_signal_en: "Avoids phrases like 'calm down'.",
      },
    ],
    learner_trap: {
      trap_vi: "Nói 'đừng cãi nữa' dễ làm người nghe mất mặt.",
      trap_en: "Saying 'stop arguing' may make listeners lose face.",
      repair_vi: "Dùng quy trình nghe lần lượt.",
      repair_en: "Use a turn-taking listening process.",
    },
  },
  {
    id: "pa_c2_final_sensitive_topic",
    focus: "sensitive_topic_framing",
    mode: "rewrite",
    title_vi: "Sửa câu có định kiến vai trò",
    title_en: "Repair a stereotype-based role assignment",
    prompt_vi: "Câu gốc gán việc theo tuổi hoặc giới. Hãy đổi sang tiêu chí trung tính.",
    prompt_en: "The original assigns work by age or gender. Change it to neutral criteria.",
    question_vi: "Bạn dùng tiêu chí nào để mời người tham gia?",
    question_en: "Which criteria do you use to invite participation?",
    answer_gurmukhi:
      "ਅਸੀਂ ਕੰਮ ਰੁਚੀ, ਸਮੇਂ ਅਤੇ ਸੁਵਿਧਾ ਦੇ ਅਨੁਸਾਰ ਵੰਡ ਸਕਦੇ ਹਾਂ। ਜਿਸ ਨੂੰ ਸੁਵਿਧਾ ਹੋਵੇ, ਉਹ ਇਹ ਹਿੱਸਾ ਲੈ ਸਕਦਾ ਹੈ।",
    answer_romanization:
      "asin kamm ruchi, same ate suvidha de anusaar vand sakde haan. jis nu suvidha hove, oh ih hissa lai sakda hai.",
    answer_vi:
      "Chúng ta có thể chia việc theo sở thích, thời gian và mức thuận tiện. Ai thấy thuận tiện có thể nhận phần này.",
    answer_en:
      "We can divide the work by interest, availability, and comfort. Whoever feels comfortable can take this part.",
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
    checkpoints: [
      {
        check_vi: "Có tránh gán vai theo định kiến không?",
        check_en: "Does it avoid stereotype-based assignment?",
        pass_signal_vi: "Tiêu chí là ਰੁਚੀ, ਸਮਾਂ, hoặc ਸੁਵਿਧਾ.",
        pass_signal_en: "Criteria are ਰੁਚੀ, ਸਮਾਂ, or ਸੁਵਿਧਾ.",
      },
    ],
    learner_trap: {
      trap_vi: "Dùng 'người lớn tuổi/phụ nữ/đàn ông nên...' gây định kiến.",
      trap_en: "Using 'elders/women/men should...' creates stereotypes.",
      repair_vi: "Mời theo thời gian, khả năng, và mức thoải mái.",
      repair_en: "Invite by availability, capacity, and comfort.",
    },
  },
  {
    id: "pa_c2_final_advanced_register",
    focus: "advanced_register",
    mode: "qa",
    title_vi: "Thông báo trang trọng vừa đủ",
    title_en: "Controlled formal notice",
    prompt_vi: "Bạn cần báo đổi giờ họp mà vẫn mở đường cho câu hỏi.",
    prompt_en: "You need to announce a meeting time change while inviting questions.",
    question_vi: "Câu nào trang trọng nhưng không lạnh?",
    question_en: "What wording is formal without sounding cold?",
    answer_gurmukhi:
      "ਕਿਰਪਾ ਕਰਕੇ ਧਿਆਨ ਦਿਓ ਕਿ ਮੀਟਿੰਗ ਦਾ ਸਮਾਂ ਬਦਲਿਆ ਗਿਆ ਹੈ। ਜੇ ਕੋਈ ਸਵਾਲ ਹੋਵੇ ਤਾਂ ਸਾਨੂੰ ਦੱਸੋ।",
    answer_romanization:
      "kirpa karke dhiaan dio ki meeting da sama badlia gia hai. je koi sawal hove taan sanu dasso.",
    answer_vi:
      "Xin vui lòng lưu ý rằng giờ họp đã được thay đổi. Nếu có câu hỏi, xin cho chúng tôi biết.",
    answer_en:
      "Please note that the meeting time has been changed. If there is any question, please let us know.",
    useful_phrases: [
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
    checkpoints: [
      {
        check_vi: "Có thông báo rõ thay đổi không?",
        check_en: "Does it clearly announce the change?",
        pass_signal_vi: "Có ਸਮਾਂ ਬਦਲਿਆ ਗਿਆ ਹੈ.",
        pass_signal_en: "Includes ਸਮਾਂ ਬਦਲਿਆ ਗਿਆ ਹੈ.",
      },
      {
        check_vi: "Có mở cửa cho câu hỏi không?",
        check_en: "Does it leave room for questions?",
        pass_signal_vi: "Có ਸਵਾਲ hoặc ਦੱਸੋ.",
        pass_signal_en: "Includes ਸਵਾਲ or ਦੱਸੋ.",
      },
    ],
  },
  {
    id: "pa_c2_final_community_discourse_canada",
    focus: "community_discourse",
    mode: "checkpoint",
    title_vi: "Tóm tắt quyết định nhóm cộng đồng",
    title_en: "Summarize a community group decision",
    prompt_vi: "Nhóm tình nguyện ở Canada đã đồng ý cuối tuần nhưng chưa chọn ngày.",
    prompt_en: "A volunteer group in Canada agrees on the weekend but has not chosen a date.",
    question_vi: "Câu nào tách đồng thuận khỏi bước tiếp theo?",
    question_en: "What sentence separates agreement from the next step?",
    answer_gurmukhi:
      "ਹੁਣ ਤੱਕ ਸਹਿਮਤੀ ਇਹ ਹੈ ਕਿ ਸਮਾਗਮ ਹਫ਼ਤੇ ਦੇ ਅੰਤ ਹੋਵੇ। ਅਗਲਾ ਕਦਮ ਦੋ ਤਾਰੀਖਾਂ ਤੇ ਰਾਇ ਲੈਣਾ ਹੈ।",
    answer_romanization:
      "hun takk sahimati ih hai ki samagam hafte de ant hove. agla kadam do tarikh'an te rai laina hai.",
    answer_vi:
      "Đến giờ, điểm đồng thuận là sự kiện vào cuối tuần. Bước tiếp theo là lấy ý kiến về hai ngày.",
    answer_en:
      "So far, the agreement is that the event should be on the weekend. The next step is to get views on two dates.",
    useful_phrases: [
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
        check_vi: "Có tóm tắt đồng thuận không?",
        check_en: "Does it summarize agreement?",
        pass_signal_vi: "Có ਸਹਿਮਤੀ.",
        pass_signal_en: "Includes ਸਹਿਮਤੀ.",
      },
      {
        check_vi: "Có bước tiếp theo rõ không?",
        check_en: "Is the next step clear?",
        pass_signal_vi: "Có ਅਗਲਾ ਕਦਮ.",
        pass_signal_en: "Includes ਅਗਲਾ ਕਦਮ.",
      },
    ],
    canada_practical: true,
  },
  {
    id: "pa_c2_final_professional_discourse",
    focus: "professional_discourse",
    mode: "scenario",
    title_vi: "Sửa lỗi quy trình trong công việc",
    title_en: "Handle a workplace process error",
    prompt_vi: "Có lỗi quy trình; cần nhận trách nhiệm mà không đổ lỗi cá nhân.",
    prompt_en: "There is a process error; accountability is needed without personal blame.",
    question_vi: "Câu nào chuyển trọng tâm sang quy trình và bước tiếp theo?",
    question_en: "What sentence shifts focus to process and next step?",
    answer_gurmukhi:
      "ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਮੁੜ ਵੇਖੀਏ ਅਤੇ ਅਗਲਾ ਕਦਮ ਸਪਸ਼ਟ ਕਰੀਏ, ਤਾਂ ਜੋ ਇਹ ਗੱਲ ਦੁਬਾਰਾ ਨਾ ਹੋਵੇ।",
    answer_romanization:
      "prakiria nu mur vekhie ate agla kadam spasht karie, taan jo ih gall dubara na hove.",
    answer_vi:
      "Hãy xem lại quy trình và làm rõ bước tiếp theo để việc này không lặp lại.",
    answer_en:
      "Let's review the process and clarify the next step so this does not happen again.",
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
    checkpoints: [
      {
        check_vi: "Có tránh truy lỗi cá nhân không?",
        check_en: "Does it avoid personal blame?",
        pass_signal_vi: "Nói về ਪ੍ਰਕਿਰਿਆ trước.",
        pass_signal_en: "Talks about ਪ੍ਰਕਿਰਿਆ first.",
      },
    ],
    learner_trap: {
      trap_vi: "Hỏi 'ai làm sai?' quá sớm.",
      trap_en: "Asking 'who did it wrong?' too early.",
      repair_vi: "Chuyển về quy trình, bước tiếp theo, và phòng lặp lại.",
      repair_en: "Shift to process, next step, and prevention.",
    },
  },
  {
    id: "pa_c2_final_public_discourse",
    focus: "public_discourse",
    mode: "qa",
    title_vi: "Thông báo công khai không gây hoang mang",
    title_en: "Public notice without alarm",
    prompt_vi: "Bạn cần thông báo đổi lịch một sự kiện cộng đồng.",
    prompt_en: "You need to announce a schedule change for a community event.",
    question_vi: "Câu nào rõ, trung tính, và có hướng dẫn cập nhật?",
    question_en: "What wording is clear, neutral, and includes update guidance?",
    answer_gurmukhi:
      "ਸਮੇਂ ਵਿੱਚ ਤਬਦੀਲੀ ਕੀਤੀ ਗਈ ਹੈ। ਤਾਜ਼ਾ ਜਾਣਕਾਰੀ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਸੁਨੇਹਾ ਵੇਖੋ।",
    answer_romanization:
      "same vich tabdili kiti gai hai. taza jaankari lai kirpa karke agla suneha vekho.",
    answer_vi:
      "Đã có thay đổi về thời gian. Để có thông tin mới nhất, xin xem tin nhắn tiếp theo.",
    answer_en:
      "A change has been made to the time. For the latest information, please check the next message.",
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
    checkpoints: [
      {
        check_vi: "Có nêu thay đổi rõ không?",
        check_en: "Does it clearly state the change?",
        pass_signal_vi: "Có ਤਬਦੀਲੀ.",
        pass_signal_en: "Includes ਤਬਦੀਲੀ.",
      },
      {
        check_vi: "Có nơi xem cập nhật không?",
        check_en: "Is there update guidance?",
        pass_signal_vi: "Có ਤਾਜ਼ਾ ਜਾਣਕਾਰੀ.",
        pass_signal_en: "Includes ਤਾਜ਼ਾ ਜਾਣਕਾਰੀ.",
      },
    ],
    learner_trap: {
      trap_vi: "Dùng từ kịch tính cho thay đổi nhỏ.",
      trap_en: "Using dramatic words for a small change.",
      repair_vi: "Dùng giọng trung tính và chỉ dẫn cập nhật.",
      repair_en: "Use neutral tone and update guidance.",
    },
    canada_practical: true,
  },
];

export const finalReviewDeckC2ByFocus = (
  focus: PunjabiC2FinalReviewFocus,
): PunjabiC2FinalReviewCard[] =>
  finalReviewDeckC2.filter((card) => card.focus === focus);
