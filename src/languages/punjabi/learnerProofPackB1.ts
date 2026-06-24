export type PunjabiB1LearnerProofFocus =
  | "explain_situation"
  | "retell_event"
  | "clarify_next_step"
  | "follow_up_message"
  | "service_conversation"
  | "workplace_issue"
  | "housing_issue"
  | "school_community_task"
  | "register_aware_request";

export type PunjabiLearnerProofLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiLearnerProofTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiLearnerProofLine;
};

export type PunjabiLearnerProofPack = {
  prompt_en: string;
  prompt_vi: string;
  proofAnswer: PunjabiLearnerProofLine;
  proofSignals_en: string[];
  proofSignals_vi: string[];
};

export type PunjabiB1LearnerProofCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1LearnerProofFocus;
  title_en: string;
  title_vi: string;
  situation_en: string;
  situation_vi: string;
  canadaContext: string;
  readyLines: PunjabiLearnerProofLine[];
  learnerProof: PunjabiLearnerProofPack;
  commonTraps: PunjabiLearnerProofTrap[];
  ownerReview_en: string;
  ownerReview_vi: string;
  finalQa_en: string;
  finalQa_vi: string;
};

export const punjabiB1LearnerProofPack: PunjabiB1LearnerProofCard[] = [
  {
    id: "b1-proof-community-entry-pass",
    level: "B1",
    focus: "explain_situation",
    title_en: "Explain a community entry-pass issue",
    title_vi: "Giải thích vấn đề thẻ vào trung tâm cộng đồng",
    situation_en:
      "Your entry pass does not work at a community centre and you need to ask for help.",
    situation_vi:
      "Thẻ vào của bạn không hoạt động ở trung tâm cộng đồng và bạn cần nhờ giúp.",
    canadaContext:
      "Useful for Canadian community centres, libraries, and shared-building desks.",
    readyLines: [
      {
        pa: "ਮੇਰਾ ਪਾਸ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।",
        romanization: "mera pass kamm nahin kar riha.",
        en: "My pass is not working.",
        vi: "Thẻ của tôi không hoạt động.",
      },
      {
        pa: "ਮੈਨੂੰ ਅੰਦਰ ਜਾਣਾ ਹੈ।",
        romanization: "mainu andar jana hai.",
        en: "I need to go inside.",
        vi: "Tôi cần vào bên trong.",
      },
      {
        pa: "ਕੀ ਤੁਸੀਂ ਮੈਨੂੰ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin mainu madad kar sakde ho?",
        en: "Can you help me?",
        vi: "Bạn có thể giúp tôi không?",
      },
    ],
    learnerProof: {
      prompt_en: "Explain the pass problem and ask for help in two or three sentences.",
      prompt_vi:
        "Giải thích vấn đề thẻ vào và nhờ giúp trong hai hoặc ba câu.",
      proofAnswer: {
        pa: "ਮੇਰਾ ਪਾਸ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ। ਮੈਨੂੰ ਅੰਦਰ ਜਾਣਾ ਹੈ; ਕੀ ਤੁਸੀਂ ਮੈਨੂੰ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?",
        romanization:
          "mera pass kamm nahin kar riha. mainu andar jana hai; ki tusin mainu madad kar sakde ho?",
        en: "My pass is not working. I need to go inside; can you help me?",
        vi: "Thẻ của tôi không hoạt động. Tôi cần vào bên trong; bạn có thể giúp tôi không?",
      },
      proofSignals_en: [
        "Names the problem",
        "Adds the practical need",
        "Makes a polite request",
      ],
      proofSignals_vi: [
        "Nêu vấn đề",
        "Thêm nhu cầu thực tế",
        "Đưa yêu cầu lịch sự",
      ],
    },
    commonTraps: [
      {
        trap_en: "Saying only pass without describing the issue.",
        trap_vi: "Chỉ nói thẻ mà không mô tả vấn đề.",
        better: {
          pa: "ਮੇਰਾ ਪਾਸ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।",
          romanization: "mera pass kamm nahin kar riha.",
          en: "My pass is not working.",
          vi: "Thẻ của tôi không hoạt động.",
        },
      },
    ],
    ownerReview_en:
      "Language practice only, not medical advice. Owner review should confirm the situation is clear, short, and safe for a front-desk learner proof check.",
    ownerReview_vi:
      "Người duyệt cần xác nhận tình huống rõ, ngắn và an toàn cho kiểm tra bằng chứng ở quầy.",
    finalQa_en:
      "Final-QA checks B1 proof, Gurmukhi-first text, and polite help request wording.",
    finalQa_vi:
      "Kiểm tra cuối xác minh bằng chứng B1, chữ Gurmukhi là chính và cách nhờ giúp lịch sự.",
  },
  {
    id: "b1-proof-bus-delay",
    level: "B1",
    focus: "retell_event",
    title_en: "Retell a bus delay",
    title_vi: "Kể lại việc xe buýt trễ",
    situation_en:
      "You arrived late because the bus was delayed and you need to explain what happened.",
    situation_vi:
      "Bạn đến trễ vì xe buýt bị trễ và cần giải thích chuyện đã xảy ra.",
    canadaContext:
      "Useful for Canadian transit, school, and workplace lateness explanations.",
    readyLines: [
      {
        pa: "ਬੱਸ ਦੇਰ ਨਾਲ ਆਈ।",
        romanization: "bus der nal aai.",
        en: "The bus came late.",
        vi: "Xe buýt đến trễ.",
      },
      {
        pa: "ਮੈਂ ਪਹਿਲਾਂ ਹੀ ਨਿਕਲਿਆ ਸੀ।",
        romanization: "main pahilan hi niklia si.",
        en: "I had already left.",
        vi: "Tôi đã đi từ sớm.",
      },
      {
        pa: "ਇਸ ਕਰਕੇ ਮੈਂ ਦੇਰ ਨਾਲ ਪਹੁੰਚਿਆ।",
        romanization: "is karke main der nal pahunchia.",
        en: "Because of this, I arrived late.",
        vi: "Vì vậy tôi đến trễ.",
      },
    ],
    learnerProof: {
      prompt_en: "Retell the delay, your earlier action, and the result.",
      prompt_vi: "Kể lại việc trễ, hành động trước đó và kết quả.",
      proofAnswer: {
        pa: "ਮੈਂ ਪਹਿਲਾਂ ਹੀ ਨਿਕਲਿਆ ਸੀ, ਪਰ ਬੱਸ ਦੇਰ ਨਾਲ ਆਈ। ਇਸ ਕਰਕੇ ਮੈਂ ਦੇਰ ਨਾਲ ਪਹੁੰਚਿਆ।",
        romanization:
          "main pahilan hi niklia si, par bus der nal aai. is karke main der nal pahunchia.",
        en: "I had already left, but the bus came late. Because of this, I arrived late.",
        vi: "Tôi đã đi từ sớm, nhưng xe buýt đến trễ. Vì vậy tôi đến trễ.",
      },
      proofSignals_en: [
        "Uses past-time sequencing",
        "Shows cause and result",
        "Stays concise",
      ],
      proofSignals_vi: [
        "Dùng trình tự quá khứ",
        "Nêu nguyên nhân và kết quả",
        "Giữ ngắn gọn",
      ],
    },
    commonTraps: [
      {
        trap_en: "Jumping to the result without a cause.",
        trap_vi: "Nhảy tới kết quả mà không có nguyên nhân.",
        better: {
          pa: "ਬੱਸ ਦੇਰ ਨਾਲ ਆਈ, ਇਸ ਕਰਕੇ ਮੈਂ ਦੇਰ ਨਾਲ ਪਹੁੰਚਿਆ।",
          romanization: "bus der nal aai, is karke main der nal pahunchia.",
          en: "The bus came late, so I arrived late.",
          vi: "Xe buýt đến trễ, nên tôi đến trễ.",
        },
      },
    ],
    ownerReview_en:
      "language practice only, not legal or financial advice. Owner review should check that the sequence reads naturally and remains a learner proof, not a long narrative.",
    ownerReview_vi:
      "Người duyệt nên kiểm tra trình tự tự nhiên và đây là bằng chứng của người học, không phải một truyện dài.",
    finalQa_en:
      "Final-QA checks sequencing, cause-result wording, and compact retelling.",
    finalQa_vi:
      "Kiểm tra cuối xác minh trình tự, cách nói nguyên nhân-kết quả và kể lại ngắn.",
  },
  {
    id: "b1-proof-deadline-next-step",
    level: "B1",
    focus: "clarify_next_step",
    title_en: "Clarify a deadline and next step",
    title_vi: "Làm rõ hạn chót và bước tiếp theo",
    situation_en:
      "A service worker gives instructions and you need to confirm the deadline and next step.",
    situation_vi:
      "Nhân viên dịch vụ đưa hướng dẫn và bạn cần xác nhận hạn chót và bước tiếp theo.",
    canadaContext:
      "Useful for Canadian public-service counters and settlement appointments; language practice only.",
    readyLines: [
      {
        pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?",
        romanization: "agla kadam ki hai?",
        en: "What is the next step?",
        vi: "Bước tiếp theo là gì?",
      },
      {
        pa: "ਆਖਰੀ ਤਾਰੀਖ ਕਦੋਂ ਹੈ?",
        romanization: "akhri tarikh kadon hai?",
        en: "When is the deadline?",
        vi: "Hạn chót là khi nào?",
      },
      {
        pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਲਿਖ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin ih likh sakde ho?",
        en: "Can you write this down?",
        vi: "Bạn có thể viết điều này xuống không?",
      },
    ],
    learnerProof: {
      prompt_en: "Ask for the next step, deadline, and written confirmation.",
      prompt_vi: "Hỏi bước tiếp theo, hạn chót và xác nhận bằng văn bản.",
      proofAnswer: {
        pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ? ਆਖਰੀ ਤਾਰੀਖ ਕਦੋਂ ਹੈ, ਅਤੇ ਕੀ ਤੁਸੀਂ ਇਹ ਲਿਖ ਸਕਦੇ ਹੋ?",
        romanization:
          "agla kadam ki hai? akhri tarikh kadon hai, ate ki tusin ih likh sakde ho?",
        en: "What is the next step? When is the deadline, and can you write this down?",
        vi: "Bước tiếp theo là gì? Hạn chót là khi nào, và bạn có thể viết điều này xuống không?",
      },
      proofSignals_en: [
        "Asks for clarity",
        "Asks for timing",
        "Requests a written record",
      ],
      proofSignals_vi: [
        "Hỏi cho rõ",
        "Hỏi về thời gian",
        "Yêu cầu ghi lại",
      ],
    },
    commonTraps: [
      {
        trap_en: "Pretending to understand and then missing the deadline.",
        trap_vi: "Giả vờ hiểu rồi bỏ lỡ hạn chót.",
        better: {
          pa: "ਮੈਨੂੰ ਥੋੜ੍ਹੀ ਹੋਰ ਸਪਸ਼ਟਤਾ ਚਾਹੀਦੀ ਹੈ।",
          romanization: "mainu thorhi hor spashtata chahidi hai.",
          en: "I need a little more clarity.",
          vi: "Tôi cần thêm chút rõ ràng.",
        },
      },
    ],
    ownerReview_en:
      "Owner review should confirm the learner proof stays inside language support and does not drift into advice.",
    ownerReview_vi:
      "Người duyệt cần xác nhận bằng chứng chỉ nằm trong hỗ trợ ngôn ngữ và không biến thành tư vấn.",
    finalQa_en:
      "Final-QA checks deadline language, written confirmation, and Gurmukhi-first output.",
    finalQa_vi:
      "Kiểm tra cuối xác minh ngôn ngữ hạn chót, xác nhận bằng văn bản và đầu ra Gurmukhi là chính.",
  },
  {
    id: "b1-proof-followup-email",
    level: "B1",
    focus: "follow_up_message",
    title_en: "Write a follow-up message",
    title_vi: "Viết tin nhắn theo dõi",
    situation_en:
      "You need to send a short follow-up after a missed service appointment.",
    situation_vi:
      "Bạn cần gửi tin nhắn theo dõi ngắn sau một cuộc hẹn dịch vụ bị lỡ.",
    canadaContext:
      "Useful for Canadian email, text, and portal follow-ups with service staff.",
    readyLines: [
      {
        pa: "ਮੈਂ ਕੱਲ੍ਹ ਦੀ ਅਪਾਇੰਟਮੈਂਟ ਬਾਰੇ ਲਿਖ ਰਿਹਾ ਹਾਂ।",
        romanization: "main kallh di appointment bare likh riha han.",
        en: "I am writing about yesterday's appointment.",
        vi: "Tôi đang viết về cuộc hẹn hôm qua.",
      },
      {
        pa: "ਕੋਈ ਨਹੀਂ ਆਇਆ ਸੀ।",
        romanization: "koi nahin aaya si.",
        en: "No one came.",
        vi: "Không có ai đến.",
      },
      {
        pa: "ਕੀ ਅਸੀਂ ਨਵਾਂ ਸਮਾਂ ਰੱਖ ਸਕਦੇ ਹਾਂ?",
        romanization: "ki asin nava sama rakh sakde han?",
        en: "Can we set a new time?",
        vi: "Chúng ta có thể đặt giờ mới không?",
      },
    ],
    learnerProof: {
      prompt_en: "Write a follow-up message with context and a request for a new time.",
      prompt_vi: "Viết tin nhắn theo dõi có ngữ cảnh và yêu cầu giờ mới.",
      proofAnswer: {
        pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਮੈਂ ਕੱਲ੍ਹ ਦੀ ਅਪਾਇੰਟਮੈਂਟ ਬਾਰੇ ਲਿਖ ਰਿਹਾ ਹਾਂ। ਕੋਈ ਨਹੀਂ ਆਇਆ ਸੀ। ਕੀ ਅਸੀਂ ਨਵਾਂ ਸਮਾਂ ਰੱਖ ਸਕਦੇ ਹਾਂ?",
        romanization:
          "sat sri akal ji, main kallh di appointment bare likh riha han. koi nahin aaya si. ki asin nava sama rakh sakde han?",
        en: "Hello, I am writing about yesterday's appointment. No one came. Can we set a new time?",
        vi: "Xin chào ạ, tôi đang viết về cuộc hẹn hôm qua. Không có ai đến. Chúng ta có thể đặt giờ mới không?",
      },
      proofSignals_en: [
        "Names the original appointment",
        "States the issue",
        "Requests a new time",
      ],
      proofSignals_vi: [
        "Nêu cuộc hẹn ban đầu",
        "Nêu vấn đề",
        "Yêu cầu giờ mới",
      ],
    },
    commonTraps: [
      {
        trap_en: "Writing only please reply without the missed-appointment context.",
        trap_vi: "Chỉ viết vui lòng trả lời mà thiếu ngữ cảnh cuộc hẹn bị lỡ.",
        better: {
          pa: "ਮੈਂ ਕੱਲ੍ਹ ਦੀ ਅਪਾਇੰਟਮੈਂਟ ਬਾਰੇ ਪੁੱਛ ਰਿਹਾ ਹਾਂ।",
          romanization: "main kallh di appointment bare puchh riha han.",
          en: "I am asking about yesterday's appointment.",
          vi: "Tôi đang hỏi về cuộc hẹn hôm qua.",
        },
      },
    ],
    ownerReview_en:
      "Owner review should confirm the message is short, polite, and clearly a follow-up.",
    ownerReview_vi:
      "Người duyệt nên xác nhận tin nhắn ngắn, lịch sự và rõ là một tin theo dõi.",
    finalQa_en:
      "Final-QA checks follow-up context, new-time request, and concise messaging.",
    finalQa_vi:
      "Kiểm tra cuối xác minh ngữ cảnh theo dõi, yêu cầu giờ mới và nhắn ngắn gọn.",
  },
  {
    id: "b1-proof-internet-bill",
    level: "B1",
    focus: "service_conversation",
    title_en: "Handle an internet bill issue",
    title_vi: "Xử lý vấn đề hóa đơn internet",
    situation_en:
      "Your internet bill has an extra charge and you need to ask for help.",
    situation_vi:
      "Hóa đơn internet của bạn có một khoản phí thêm và bạn cần nhờ giúp.",
    canadaContext:
      "Useful for Canadian phone, internet, and utility service conversations.",
    readyLines: [
      {
        pa: "ਮੇਰੇ ਬਿੱਲ ਵਿੱਚ ਵਾਧੂ ਚਾਰਜ ਹੈ।",
        romanization: "mere bill vich vadhu charge hai.",
        en: "There is an extra charge on my bill.",
        vi: "Hóa đơn của tôi có khoản phí thêm.",
      },
      {
        pa: "ਕੀ ਤੁਸੀਂ ਇਸਨੂੰ ਚੈੱਕ ਕਰ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin isnu check kar sakde ho?",
        en: "Can you check this?",
        vi: "Bạn có thể kiểm tra điều này không?",
      },
      {
        pa: "ਜੇ ਇਹ ਗਲਤੀ ਹੈ, ਕੀ ਤੁਸੀਂ ਇਸਨੂੰ ਠੀਕ ਕਰ ਸਕਦੇ ਹੋ?",
        romanization: "je ih galti hai, ki tusin isnu thik kar sakde ho?",
        en: "If this is a mistake, can you fix it?",
        vi: "Nếu đây là lỗi, bạn có thể sửa không?",
      },
    ],
    learnerProof: {
      prompt_en: "Ask about the extra charge and the correction step.",
      prompt_vi: "Hỏi về khoản phí thêm và bước sửa lỗi.",
      proofAnswer: {
        pa: "ਮੇਰੇ ਬਿੱਲ ਵਿੱਚ ਵਾਧੂ ਚਾਰਜ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਸਨੂੰ ਚੈੱਕ ਕਰ ਸਕਦੇ ਹੋ, ਅਤੇ ਜੇ ਇਹ ਗਲਤੀ ਹੈ, ਕੀ ਤੁਸੀਂ ਇਸਨੂੰ ਠੀਕ ਕਰ ਸਕਦੇ ਹੋ?",
        romanization:
          "mere bill vich vadhu charge hai. ki tusin isnu check kar sakde ho, ate je ih galti hai, ki tusin isnu thik kar sakde ho?",
        en: "There is an extra charge on my bill. Can you check this, and if it is a mistake, can you fix it?",
        vi: "Hóa đơn của tôi có khoản phí thêm. Bạn có thể kiểm tra điều này, và nếu đó là lỗi, bạn có thể sửa không?",
      },
      proofSignals_en: [
        "Identifies the problem",
        "Requests checking",
        "Asks for correction",
      ],
      proofSignals_vi: [
        "Xác định vấn đề",
        "Yêu cầu kiểm tra",
        "Hỏi sửa lỗi",
      ],
    },
    commonTraps: [
      {
        trap_en: "Sounding accusatory before asking for a check.",
        trap_vi: "Nghe như buộc tội trước khi yêu cầu kiểm tra.",
        better: {
          pa: "ਮੈਨੂੰ ਇਹ ਚਾਰਜ ਸਮਝ ਨਹੀਂ ਆ ਰਿਹਾ।",
          romanization: "mainu ih charge samajh nahin aa riha.",
          en: "I do not understand this charge.",
          vi: "Tôi không hiểu khoản phí này.",
        },
      },
    ],
    ownerReview_en:
      "Owner review should confirm the proof pack is service-focused and still language practice only.",
    ownerReview_vi:
      "Người duyệt cần xác nhận bộ bằng chứng tập trung dịch vụ và vẫn chỉ là luyện ngôn ngữ.",
    finalQa_en:
      "Final-QA checks clarity, correction request, and Canada-practical billing language.",
    finalQa_vi:
      "Kiểm tra cuối xác minh độ rõ, yêu cầu sửa và ngôn ngữ hóa đơn phù hợp Canada.",
  },
  {
    id: "b1-proof-workplace-shift",
    level: "B1",
    focus: "workplace_issue",
    title_en: "Report a workplace shift conflict",
    title_vi: "Báo cáo xung đột ca làm",
    situation_en:
      "Two shifts overlap and you need to tell your supervisor what happened.",
    situation_vi:
      "Hai ca làm bị trùng và bạn cần nói với quản lý chuyện gì đã xảy ra.",
    canadaContext:
      "Useful for Canadian retail, warehouse, office, and food-service scheduling conversations.",
    readyLines: [
      {
        pa: "ਮੇਰੀਆਂ ਦੋ ਸ਼ਿਫਟਾਂ ਇਕੋ ਸਮੇਂ ਹਨ।",
        romanization: "merian do shiftan iko same han.",
        en: "My two shifts are at the same time.",
        vi: "Hai ca làm của tôi cùng một thời gian.",
      },
      {
        pa: "ਸ਼ਾਇਦ ਸ਼ਡਿਊਲ ਵਿੱਚ ਗਲਤੀ ਹੈ।",
        romanization: "shayad schedule vich galti hai.",
        en: "Maybe there is a mistake in the schedule.",
        vi: "Có lẽ lịch làm có lỗi.",
      },
      {
        pa: "ਕਿਹੜੀ ਸ਼ਿਫਟ ਬਦਲਣੀ ਚਾਹੀਦੀ ਹੈ?",
        romanization: "kihri shift badalni chahidi hai?",
        en: "Which shift should be changed?",
        vi: "Ca nào nên được đổi?",
      },
    ],
    learnerProof: {
      prompt_en: "Report the conflict and ask for a clear decision.",
      prompt_vi: "Báo cáo xung đột và hỏi quyết định rõ ràng.",
      proofAnswer: {
        pa: "ਮੇਰੀਆਂ ਦੋ ਸ਼ਿਫਟਾਂ ਇਕੋ ਸਮੇਂ ਹਨ, ਸ਼ਾਇਦ ਸ਼ਡਿਊਲ ਵਿੱਚ ਗਲਤੀ ਹੈ। ਕਿਹੜੀ ਸ਼ਿਫਟ ਬਦਲਣੀ ਚਾਹੀਦੀ ਹੈ?",
        romanization:
          "merian do shiftan iko same han, shayad schedule vich galti hai. kihri shift badalni chahidi hai?",
        en: "My two shifts are at the same time; maybe there is a mistake in the schedule. Which shift should be changed?",
        vi: "Hai ca làm của tôi cùng một thời gian; có lẽ lịch làm có lỗi. Ca nào nên được đổi?",
      },
      proofSignals_en: [
        "Reports the conflict",
        "Stays neutral",
        "Asks for a decision",
      ],
      proofSignals_vi: [
        "Báo cáo xung đột",
        "Giữ giọng trung lập",
        "Hỏi quyết định",
      ],
    },
    commonTraps: [
      {
        trap_en: "Blaming the supervisor instead of describing the overlap.",
        trap_vi: "Đổ lỗi cho quản lý thay vì mô tả việc bị trùng.",
        better: {
          pa: "ਸ਼ਾਇਦ ਸ਼ਡਿਊਲ ਵਿੱਚ ਗਲਤੀ ਹੈ।",
          romanization: "shayad schedule vich galti hai.",
          en: "Maybe there is a mistake in the schedule.",
          vi: "Có lẽ lịch làm có lỗi.",
        },
      },
    ],
    ownerReview_en:
      "Owner review should confirm the proof is neutral, brief, and suitable for workplace use.",
    ownerReview_vi:
      "Người duyệt cần xác nhận bằng chứng trung lập, ngắn và phù hợp nơi làm việc.",
    finalQa_en:
      "Final-QA checks neutral workplace language and a clear schedule action.",
    finalQa_vi:
      "Kiểm tra cuối xác minh ngôn ngữ nơi làm việc trung lập và hành động lịch làm rõ.",
  },
  {
    id: "b1-proof-housing-heat",
    level: "B1",
    focus: "housing_issue",
    title_en: "Report a housing heat issue",
    title_vi: "Báo cáo vấn đề sưởi trong nhà",
    situation_en:
      "The heat is not working in your apartment and you need to ask when it can be checked.",
    situation_vi:
      "Hệ thống sưởi trong căn hộ không hoạt động và bạn cần hỏi khi nào có thể kiểm tra.",
    canadaContext:
      "Useful for Canadian tenant and building-management conversations in cold weather.",
    readyLines: [
      {
        pa: "ਅਪਾਰਟਮੈਂਟ ਵਿੱਚ ਹੀਟ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।",
        romanization: "apartment vich heat kamm nahin kar rahi.",
        en: "The heat is not working in the apartment.",
        vi: "Hệ thống sưởi trong căn hộ không hoạt động.",
      },
      {
        pa: "ਕਮਰਾ ਬਹੁਤ ਠੰਢਾ ਹੈ।",
        romanization: "kamra bahut thandha hai.",
        en: "The room is very cold.",
        vi: "Phòng rất lạnh.",
      },
      {
        pa: "ਕੋਈ ਇਸਨੂੰ ਕਦੋਂ ਚੈੱਕ ਕਰ ਸਕਦਾ ਹੈ?",
        romanization: "koi isnu kadon check kar sakda hai?",
        en: "When can someone check it?",
        vi: "Khi nào có người kiểm tra được?",
      },
    ],
    learnerProof: {
      prompt_en: "Report the heat issue, the effect, and the check timing.",
      prompt_vi: "Báo cáo vấn đề sưởi, ảnh hưởng và thời gian kiểm tra.",
      proofAnswer: {
        pa: "ਅਪਾਰਟਮੈਂਟ ਵਿੱਚ ਹੀਟ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ ਅਤੇ ਕਮਰਾ ਬਹੁਤ ਠੰਢਾ ਹੈ। ਕੋਈ ਇਸਨੂੰ ਕਦੋਂ ਚੈੱਕ ਕਰ ਸਕਦਾ ਹੈ?",
        romanization:
          "apartment vich heat kamm nahin kar rahi ate kamra bahut thandha hai. koi isnu kadon check kar sakda hai?",
        en: "The heat is not working in the apartment and the room is very cold. When can someone check it?",
        vi: "Hệ thống sưởi trong căn hộ không hoạt động và phòng rất lạnh. Khi nào có người kiểm tra được?",
      },
      proofSignals_en: [
        "Names the housing item",
        "Describes the effect",
        "Asks for timing",
      ],
      proofSignals_vi: [
        "Nêu mục nhà ở",
        "Mô tả ảnh hưởng",
        "Hỏi thời gian",
      ],
    },
    commonTraps: [
      {
        trap_en: "Saying only cold without stating the housing problem.",
        trap_vi: "Chỉ nói lạnh mà không nêu vấn đề nhà ở.",
        better: {
          pa: "ਹੀਟ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ, ਇਸ ਲਈ ਕਮਰਾ ਠੰਢਾ ਹੈ।",
          romanization: "heat kamm nahin kar rahi, is lai kamra thandha hai.",
          en: "The heat is not working, so the room is cold.",
          vi: "Hệ thống sưởi không hoạt động, nên phòng lạnh.",
        },
      },
    ],
    ownerReview_en:
      "Owner review should confirm this stays a practical housing proof task rather than advice.",
    ownerReview_vi:
      "Người duyệt cần xác nhận đây là bài kiểm tra thực tế về nhà ở chứ không phải tư vấn.",
    finalQa_en:
      "Final-QA checks practical housing wording, timing, and learner proof clarity.",
    finalQa_vi:
      "Kiểm tra cuối xác minh cách nói thực tế về nhà ở, thời gian và độ rõ của bằng chứng.",
  },
  {
    id: "b1-proof-school-form",
    level: "B1",
    focus: "school_community_task",
    title_en: "Ask about a school form",
    title_vi: "Hỏi về mẫu đơn ở trường",
    situation_en:
      "You need to submit a school form and ask where it should go and whether it needs a signature.",
    situation_vi:
      "Bạn cần nộp mẫu đơn ở trường và hỏi nên nộp ở đâu và có cần chữ ký không.",
    canadaContext:
      "Useful for Canadian schools, daycare, community centres, and newcomer programs.",
    readyLines: [
      {
        pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਕਿੱਥੇ ਜਮ੍ਹਾਂ ਕਰਨਾ ਹੈ?",
        romanization: "mainu ih form kithe jamma karna hai?",
        en: "Where do I need to submit this form?",
        vi: "Tôi cần nộp mẫu đơn này ở đâu?",
      },
      {
        pa: "ਕੀ ਇਸ ਤੇ ਦਸਤਖਤ ਚਾਹੀਦੇ ਹਨ?",
        romanization: "ki is te dastkhat chahide han?",
        en: "Does it need a signature?",
        vi: "Mẫu này có cần chữ ký không?",
      },
      {
        pa: "ਕੀ ਅੱਜ ਜਮ੍ਹਾਂ ਕਰਨਾ ਠੀਕ ਹੈ?",
        romanization: "ki ajj jamma karna thik hai?",
        en: "Is it okay to submit it today?",
        vi: "Nộp hôm nay có được không?",
      },
    ],
    learnerProof: {
      prompt_en: "Ask where to submit the form, signature need, and timing.",
      prompt_vi: "Hỏi nơi nộp mẫu đơn, có cần chữ ký không và thời gian.",
      proofAnswer: {
        pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਕਿੱਥੇ ਜਮ੍ਹਾਂ ਕਰਨਾ ਹੈ? ਕੀ ਇਸ ਤੇ ਦਸਤਖਤ ਚਾਹੀਦੇ ਹਨ, ਅਤੇ ਕੀ ਅੱਜ ਜਮ੍ਹਾਂ ਕਰਨਾ ਠੀਕ ਹੈ?",
        romanization:
          "mainu ih form kithe jamma karna hai? ki is te dastkhat chahide han, ate ki ajj jamma karna thik hai?",
        en: "Where do I need to submit this form? Does it need a signature, and is it okay to submit it today?",
        vi: "Tôi cần nộp mẫu đơn này ở đâu? Mẫu này có cần chữ ký không, và nộp hôm nay có được không?",
      },
      proofSignals_en: ["Asks location", "Asks requirement", "Asks timing"],
      proofSignals_vi: ["Hỏi địa điểm", "Hỏi yêu cầu", "Hỏi thời gian"],
    },
    commonTraps: [
      {
        trap_en: "Submitting without checking signature requirements.",
        trap_vi: "Nộp mà không kiểm tra yêu cầu chữ ký.",
        better: {
          pa: "ਦਸਤਖਤ ਚਾਹੀਦੇ ਹਨ ਜਾਂ ਨਹੀਂ?",
          romanization: "dastkhat chahide han ja nahin?",
          en: "Is a signature needed or not?",
          vi: "Có cần chữ ký hay không?",
        },
      },
    ],
    ownerReview_en:
      "Owner review should confirm the proof pack is focused on school/community process language.",
    ownerReview_vi:
      "Người duyệt cần xác nhận bộ bằng chứng tập trung vào ngôn ngữ quy trình ở trường/cộng đồng.",
    finalQa_en:
      "Final-QA checks location, signature, timing, and the learner-proof format.",
    finalQa_vi:
      "Kiểm tra cuối xác minh địa điểm, chữ ký, thời gian và định dạng bằng chứng của người học.",
  },
  {
    id: "b1-proof-register-request",
    level: "B1",
    focus: "register_aware_request",
    title_en: "Make a polite register-aware request",
    title_vi: "Đưa ra yêu cầu lịch sự phù hợp mức đăng ký",
    situation_en:
      "You need staff to print one page, using polite ਤੁਸੀਂ and ਜੀ.",
    situation_vi:
      "Bạn cần nhân viên in một trang, dùng mức lịch sự với ਤੁਸੀਂ và ਜੀ.",
    canadaContext:
      "Useful for Canadian libraries and settlement offices; Shahmukhi is awareness only, not a full course.",
    readyLines: [
      {
        pa: "ਤੁਸੀਂ ਇਹ ਇੱਕ ਪੰਨਾ ਪ੍ਰਿੰਟ ਕਰ ਸਕਦੇ ਹੋ ਜੀ?",
        romanization: "tusin ih ikk panna print kar sakde ho ji?",
        en: "Could you print this one page, please?",
        vi: "Bạn có thể in một trang này giúp tôi không ạ?",
      },
      {
        pa: "ਮੈਨੂੰ ਸਿਰਫ਼ ਇੱਕ ਕਾਪੀ ਚਾਹੀਦੀ ਹੈ।",
        romanization: "mainu sirf ikk copy chahidi hai.",
        en: "I only need one copy.",
        vi: "Tôi chỉ cần một bản.",
      },
      {
        pa: "ਧੰਨਵਾਦ ਜੀ, ਮੈਂ ਉਡੀਕ ਕਰ ਸਕਦਾ ਹਾਂ।",
        romanization: "dhannvad ji, main udik kar sakda han.",
        en: "Thank you, I can wait.",
        vi: "Cảm ơn ạ, tôi có thể chờ.",
      },
    ],
    learnerProof: {
      prompt_en: "Make a polite print request and include the quantity.",
      prompt_vi: "Đưa ra yêu cầu in lịch sự và nói số lượng.",
      proofAnswer: {
        pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਤੁਸੀਂ ਇਹ ਇੱਕ ਪੰਨਾ ਪ੍ਰਿੰਟ ਕਰ ਸਕਦੇ ਹੋ ਜੀ? ਮੈਨੂੰ ਸਿਰਫ਼ ਇੱਕ ਕਾਪੀ ਚਾਹੀਦੀ ਹੈ।",
        romanization:
          "sat sri akal ji, tusin ih ikk panna print kar sakde ho ji? mainu sirf ikk copy chahidi hai.",
        en: "Hello, could you print this one page, please? I only need one copy.",
        vi: "Xin chào ạ, bạn có thể in một trang này giúp tôi không ạ? Tôi chỉ cần một bản.",
      },
      proofSignals_en: ["Uses polite register", "States request", "Adds quantity"],
      proofSignals_vi: ["Dùng mức lịch sự", "Nêu yêu cầu", "Thêm số lượng"],
    },
    commonTraps: [
      {
        trap_en: "Using a bare command instead of a soft request.",
        trap_vi: "Dùng mệnh lệnh cụt thay vì yêu cầu mềm.",
        better: {
          pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਪ੍ਰਿੰਟ ਕਰ ਦਿਓ ਜੀ।",
          romanization: "kirpa karke ih print kar dio ji.",
          en: "Please print this for me.",
          vi: "Vui lòng in điều này giúp tôi ạ.",
        },
      },
    ],
    ownerReview_en:
      "Owner review should confirm the register choice and the library/front-desk style are appropriate.",
    ownerReview_vi:
      "Người duyệt cần xác nhận lựa chọn mức lịch sự và phong cách quầy dịch vụ/thư viện là phù hợp.",
    finalQa_en:
      "Final-QA checks register awareness, quantity detail, proof-pack formatting, and Native review is deferred.",
    finalQa_vi:
      "Kiểm tra cuối xác minh mức lịch sự, chi tiết số lượng và định dạng bộ bằng chứng.",
  },
];
