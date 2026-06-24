export type PunjabiB1ExitTicketFocus =
  | "explain_situation"
  | "retell_event"
  | "clarify_next_step"
  | "service_conversation"
  | "workplace_issue"
  | "housing_issue"
  | "school_community_task"
  | "follow_up_message"
  | "register_aware_request";

export type PunjabiExitTicketLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiExitTicketTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiExitTicketLine;
};

export type PunjabiExitTicketProof = {
  prompt_en: string;
  prompt_vi: string;
  modelAnswer: PunjabiExitTicketLine;
  passCriteria_en: string[];
  passCriteria_vi: string[];
};

export type PunjabiB1ExitTicket = {
  id: string;
  level: "B1";
  focus: PunjabiB1ExitTicketFocus;
  title_en: string;
  title_vi: string;
  exitTask_en: string;
  exitTask_vi: string;
  canadaContext: string;
  readyPhrases: PunjabiExitTicketLine[];
  finalProof: PunjabiExitTicketProof;
  commonTraps: PunjabiExitTicketTrap[];
  finalQa_en: string;
  finalQa_vi: string;
};

export const punjabiB1ExitTickets: PunjabiB1ExitTicket[] = [
  {
    id: "b1-exit-explain-clinic-card",
    level: "B1",
    focus: "explain_situation",
    title_en: "Explain a clinic card issue",
    title_vi: "Giải thích vấn đề thẻ ở phòng khám",
    exitTask_en:
      "Explain that your health card was not accepted at check-in. Language practice only, not medical advice.",
    exitTask_vi:
      "Giải thích rằng thẻ y tế của bạn không được chấp nhận khi check-in. Chỉ luyện ngôn ngữ, không phải tư vấn y tế.",
    canadaContext:
      "Useful for Canadian clinic reception and newcomer health-service conversations.",
    readyPhrases: [
      {
        pa: "ਮੇਰਾ ਹੈਲਥ ਕਾਰਡ ਸਿਸਟਮ ਵਿੱਚ ਨਹੀਂ ਆ ਰਿਹਾ।",
        romanization: "mera health card system vich nahin aa riha.",
        en: "My health card is not showing in the system.",
        vi: "Thẻ y tế của tôi không hiện trong hệ thống.",
      },
      {
        pa: "ਮੇਰੇ ਕੋਲ ਹੋਰ ਪਹਿਚਾਣ ਪੱਤਰ ਹੈ।",
        romanization: "mere kol hor pahichan pattar hai.",
        en: "I have another piece of ID.",
        vi: "Tôi có giấy tờ tùy thân khác.",
      },
      {
        pa: "ਮੈਨੂੰ ਹੁਣ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
        romanization: "mainu hun ki karna chahida hai?",
        en: "What should I do now?",
        vi: "Bây giờ tôi nên làm gì?",
      },
    ],
    finalProof: {
      prompt_en:
        "Explain the check-in problem, offer ID, and ask what to do next.",
      prompt_vi:
        "Giải thích vấn đề khi check-in, đề nghị giấy tờ tùy thân và hỏi bước tiếp theo.",
      modelAnswer: {
        pa: "ਮੇਰਾ ਹੈਲਥ ਕਾਰਡ ਸਿਸਟਮ ਵਿੱਚ ਨਹੀਂ ਆ ਰਿਹਾ। ਮੇਰੇ ਕੋਲ ਹੋਰ ਪਹਿਚਾਣ ਪੱਤਰ ਹੈ; ਮੈਨੂੰ ਹੁਣ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
        romanization:
          "mera health card system vich nahin aa riha. mere kol hor pahichan pattar hai; mainu hun ki karna chahida hai?",
        en: "My health card is not showing in the system. I have another piece of ID; what should I do now?",
        vi: "Thẻ y tế của tôi không hiện trong hệ thống. Tôi có giấy tờ tùy thân khác; bây giờ tôi nên làm gì?",
      },
      passCriteria_en: ["States the issue", "Offers useful detail", "Asks next step"],
      passCriteria_vi: ["Nêu vấn đề", "Đưa chi tiết hữu ích", "Hỏi bước tiếp theo"],
    },
    commonTraps: [
      {
        trap_en: "Asking for medical advice instead of check-in instructions.",
        trap_vi: "Hỏi tư vấn y tế thay vì hướng dẫn check-in.",
        better: {
          pa: "ਮੈਂ ਸਿਰਫ਼ ਚੈਕ-ਇਨ ਦੀ ਜਾਣਕਾਰੀ ਪੁੱਛ ਰਿਹਾ ਹਾਂ।",
          romanization: "main sirf check-in di jankari puchh riha han.",
          en: "I am only asking for check-in information.",
          vi: "Tôi chỉ hỏi thông tin check-in.",
        },
      },
    ],
    finalQa_en:
      "Exit-ticket proof checks situation explanation, useful detail, and language-support guardrail.",
    finalQa_vi:
      "Bằng chứng vé ra kiểm tra giải thích tình huống, chi tiết hữu ích và giới hạn hỗ trợ ngôn ngữ.",
  },
  {
    id: "b1-exit-retell-appointment-change",
    level: "B1",
    focus: "retell_event",
    title_en: "Retell an appointment change",
    title_vi: "Kể lại việc đổi lịch hẹn",
    exitTask_en:
      "Retell why your appointment time changed after a phone call.",
    exitTask_vi:
      "Kể lại vì sao giờ hẹn của bạn thay đổi sau một cuộc gọi.",
    canadaContext:
      "Useful for Canadian clinics, schools, settlement agencies, and service appointments.",
    readyPhrases: [
      {
        pa: "ਉਹਨਾਂ ਨੇ ਮੈਨੂੰ ਸਵੇਰੇ ਫੋਨ ਕੀਤਾ।",
        romanization: "uhna ne mainu savere phone kita.",
        en: "They called me in the morning.",
        vi: "Họ gọi cho tôi vào buổi sáng.",
      },
      {
        pa: "ਪੁਰਾਣਾ ਸਮਾਂ ਉਪਲਬਧ ਨਹੀਂ ਸੀ।",
        romanization: "purana sama uplabdh nahin si.",
        en: "The old time was not available.",
        vi: "Giờ cũ không còn trống.",
      },
      {
        pa: "ਇਸ ਲਈ ਨਵਾਂ ਸਮਾਂ ਤਿੰਨ ਵਜੇ ਹੈ।",
        romanization: "is lai nava sama tinn vaje hai.",
        en: "So the new time is three o'clock.",
        vi: "Vì vậy giờ mới là ba giờ.",
      },
    ],
    finalProof: {
      prompt_en: "Retell the call, the reason, and the new time in order.",
      prompt_vi: "Kể lại cuộc gọi, lý do và giờ mới theo thứ tự.",
      modelAnswer: {
        pa: "ਉਹਨਾਂ ਨੇ ਮੈਨੂੰ ਸਵੇਰੇ ਫੋਨ ਕੀਤਾ ਕਿਉਂਕਿ ਪੁਰਾਣਾ ਸਮਾਂ ਉਪਲਬਧ ਨਹੀਂ ਸੀ। ਇਸ ਲਈ ਨਵਾਂ ਸਮਾਂ ਤਿੰਨ ਵਜੇ ਹੈ।",
        romanization:
          "uhna ne mainu savere phone kita kyonki purana sama uplabdh nahin si. is lai nava sama tinn vaje hai.",
        en: "They called me in the morning because the old time was not available. So the new time is three o'clock.",
        vi: "Họ gọi cho tôi vào buổi sáng vì giờ cũ không còn trống. Vì vậy giờ mới là ba giờ.",
      },
      passCriteria_en: ["Uses past event order", "Explains reason", "Gives new time"],
      passCriteria_vi: ["Kể theo thứ tự quá khứ", "Giải thích lý do", "Nêu giờ mới"],
    },
    commonTraps: [
      {
        trap_en: "Giving the new time without explaining what changed.",
        trap_vi: "Nêu giờ mới mà không giải thích điều gì đã thay đổi.",
        better: {
          pa: "ਸਮਾਂ ਬਦਲ ਗਿਆ ਕਿਉਂਕਿ ਪੁਰਾਣਾ ਸਮਾਂ ਉਪਲਬਧ ਨਹੀਂ ਸੀ।",
          romanization: "sama badal giya kyonki purana sama uplabdh nahin si.",
          en: "The time changed because the old time was not available.",
          vi: "Giờ đã đổi vì giờ cũ không còn trống.",
        },
      },
    ],
    finalQa_en:
      "Final-QA checks sequence, cause, and a concrete result.",
    finalQa_vi:
      "Kiểm tra cuối xác minh trình tự, nguyên nhân và kết quả cụ thể.",
  },
  {
    id: "b1-exit-clarify-deadline",
    level: "B1",
    focus: "clarify_next_step",
    title_en: "Clarify the next step",
    title_vi: "Làm rõ bước tiếp theo",
    exitTask_en:
      "Ask a service worker to repeat the next step, deadline, and email confirmation. Language support only, not legal or financial advice.",
    exitTask_vi:
      "Yêu cầu nhân viên dịch vụ lặp lại bước tiếp theo, hạn chót và xác nhận email. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính.",
    canadaContext:
      "Useful for Canadian public-service counters and settlement appointments; language practice only.",
    readyPhrases: [
      {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੁਬਾਰਾ ਦੱਸੋ।",
        romanization: "kirpa karke agla kadam dubara dasso.",
        en: "Please tell me the next step again.",
        vi: "Vui lòng nói lại bước tiếp theo.",
      },
      {
        pa: "ਆਖਰੀ ਤਾਰੀਖ ਕਦੋਂ ਹੈ?",
        romanization: "akhri tarikh kadon hai?",
        en: "When is the deadline?",
        vi: "Hạn chót là khi nào?",
      },
      {
        pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਮੈਨੂੰ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin ih mainu email kar sakde ho?",
        en: "Can you email this to me?",
        vi: "Bạn có thể gửi điều này cho tôi qua email không?",
      },
    ],
    finalProof: {
      prompt_en: "Clarify next step, deadline, and email confirmation.",
      prompt_vi: "Làm rõ bước tiếp theo, hạn chót và xác nhận qua email.",
      modelAnswer: {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੁਬਾਰਾ ਦੱਸੋ। ਆਖਰੀ ਤਾਰੀਖ ਕਦੋਂ ਹੈ, ਅਤੇ ਕੀ ਤੁਸੀਂ ਇਹ ਮੈਨੂੰ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?",
        romanization:
          "kirpa karke agla kadam dubara dasso. akhri tarikh kadon hai, ate ki tusin ih mainu email kar sakde ho?",
        en: "Please tell me the next step again. When is the deadline, and can you email this to me?",
        vi: "Vui lòng nói lại bước tiếp theo. Hạn chót là khi nào, và bạn có thể gửi điều này cho tôi qua email không?",
      },
      passCriteria_en: ["Asks for repetition", "Asks deadline", "Requests written confirmation"],
      passCriteria_vi: ["Yêu cầu lặp lại", "Hỏi hạn chót", "Yêu cầu xác nhận bằng văn bản"],
    },
    commonTraps: [
      {
        trap_en: "Nodding without confirming the next step.",
        trap_vi: "Gật đầu mà không xác nhận bước tiếp theo.",
        better: {
          pa: "ਮੈਨੂੰ ਪੱਕਾ ਕਰਨਾ ਹੈ ਕਿ ਮੈਂ ਠੀਕ ਸਮਝਿਆ।",
          romanization: "mainu pakka karna hai ki main thik samjhia.",
          en: "I want to make sure I understood correctly.",
          vi: "Tôi muốn chắc rằng tôi đã hiểu đúng.",
        },
      },
    ],
    finalQa_en:
      "Exit ticket is ready for final-proof checks that stay inside language support.",
    finalQa_vi:
      "Vé ra sẵn sàng cho kiểm tra bằng chứng cuối trong phạm vi hỗ trợ ngôn ngữ.",
  },
  {
    id: "b1-exit-service-refund",
    level: "B1",
    focus: "service_conversation",
    title_en: "Ask about a refund",
    title_vi: "Hỏi về hoàn tiền",
    exitTask_en:
      "Explain that you were charged twice and ask for the refund process.",
    exitTask_vi:
      "Giải thích rằng bạn bị tính tiền hai lần và hỏi quy trình hoàn tiền.",
    canadaContext:
      "Useful for Canadian store, phone, internet, and utility service desks.",
    readyPhrases: [
      {
        pa: "ਮੇਰੇ ਕਾਰਡ ਤੋਂ ਦੋ ਵਾਰ ਪੈਸੇ ਕੱਟੇ ਗਏ ਹਨ।",
        romanization: "mere card ton do var paise katte gaye han.",
        en: "Money was taken from my card twice.",
        vi: "Tiền đã bị trừ từ thẻ của tôi hai lần.",
      },
      {
        pa: "ਕੀ ਤੁਸੀਂ ਰਸੀਦ ਚੈੱਕ ਕਰ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin receipt check kar sakde ho?",
        en: "Can you check the receipt?",
        vi: "Bạn có thể kiểm tra biên lai không?",
      },
      {
        pa: "ਰਿਫੰਡ ਲਈ ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?",
        romanization: "refund lai agla kadam ki hai?",
        en: "What is the next step for a refund?",
        vi: "Bước tiếp theo để hoàn tiền là gì?",
      },
    ],
    finalProof: {
      prompt_en: "Explain the double charge and ask for refund next steps.",
      prompt_vi: "Giải thích việc bị tính hai lần và hỏi bước hoàn tiền tiếp theo.",
      modelAnswer: {
        pa: "ਮੇਰੇ ਕਾਰਡ ਤੋਂ ਦੋ ਵਾਰ ਪੈਸੇ ਕੱਟੇ ਗਏ ਹਨ। ਕੀ ਤੁਸੀਂ ਰਸੀਦ ਚੈੱਕ ਕਰ ਸਕਦੇ ਹੋ, ਅਤੇ ਰਿਫੰਡ ਲਈ ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?",
        romanization:
          "mere card ton do var paise katte gaye han. ki tusin receipt check kar sakde ho, ate refund lai agla kadam ki hai?",
        en: "Money was taken from my card twice. Can you check the receipt, and what is the next step for a refund?",
        vi: "Tiền đã bị trừ từ thẻ của tôi hai lần. Bạn có thể kiểm tra biên lai, và bước tiếp theo để hoàn tiền là gì?",
      },
      passCriteria_en: ["Names charge issue", "Requests checking", "Asks refund process"],
      passCriteria_vi: ["Nêu vấn đề tính tiền", "Yêu cầu kiểm tra", "Hỏi quy trình hoàn tiền"],
    },
    commonTraps: [
      {
        trap_en: "Starting with anger instead of a clear service request.",
        trap_vi: "Bắt đầu bằng tức giận thay vì yêu cầu dịch vụ rõ.",
        better: {
          pa: "ਮੈਨੂੰ ਇਹ ਚਾਰਜ ਸਮਝ ਨਹੀਂ ਆ ਰਿਹਾ।",
          romanization: "mainu ih charge samajh nahin aa riha.",
          en: "I do not understand this charge.",
          vi: "Tôi không hiểu khoản phí này.",
        },
      },
    ],
    finalQa_en:
      "Final-QA checks polite service conversation with problem, evidence, and next action.",
    finalQa_vi:
      "Kiểm tra cuối xác minh hội thoại dịch vụ lịch sự với vấn đề, bằng chứng và bước tiếp theo.",
  },
  {
    id: "b1-exit-workplace-safety",
    level: "B1",
    focus: "workplace_issue",
    title_en: "Report a workplace safety issue",
    title_vi: "Báo cáo vấn đề an toàn nơi làm việc",
    exitTask_en:
      "Tell a supervisor the floor is wet and ask what should be done first.",
    exitTask_vi:
      "Nói với quản lý rằng sàn bị ướt và hỏi nên làm gì trước.",
    canadaContext:
      "Useful for Canadian retail, food-service, warehouse, and office shifts.",
    readyPhrases: [
      {
        pa: "ਫਰਸ਼ ਗਿੱਲਾ ਹੈ।",
        romanization: "farsh gilla hai.",
        en: "The floor is wet.",
        vi: "Sàn bị ướt.",
      },
      {
        pa: "ਲੋਕ ਫਿਸਲ ਸਕਦੇ ਹਨ।",
        romanization: "lok phisal sakde han.",
        en: "People could slip.",
        vi: "Mọi người có thể trượt ngã.",
      },
      {
        pa: "ਮੈਂ ਪਹਿਲਾਂ ਕੀ ਕਰਾਂ?",
        romanization: "main pahilan ki karan?",
        en: "What should I do first?",
        vi: "Tôi nên làm gì trước?",
      },
    ],
    finalProof: {
      prompt_en: "Report the wet floor, risk, and priority question.",
      prompt_vi: "Báo cáo sàn ướt, rủi ro và câu hỏi ưu tiên.",
      modelAnswer: {
        pa: "ਫਰਸ਼ ਗਿੱਲਾ ਹੈ ਅਤੇ ਲੋਕ ਫਿਸਲ ਸਕਦੇ ਹਨ। ਮੈਂ ਪਹਿਲਾਂ ਕੀ ਕਰਾਂ?",
        romanization: "farsh gilla hai ate lok phisal sakde han. main pahilan ki karan?",
        en: "The floor is wet and people could slip. What should I do first?",
        vi: "Sàn bị ướt và mọi người có thể trượt ngã. Tôi nên làm gì trước?",
      },
      passCriteria_en: ["Reports hazard", "Explains risk", "Asks priority"],
      passCriteria_vi: ["Báo nguy cơ", "Giải thích rủi ro", "Hỏi ưu tiên"],
    },
    commonTraps: [
      {
        trap_en: "Reporting the task without naming the safety risk.",
        trap_vi: "Báo việc mà không nêu rủi ro an toàn.",
        better: {
          pa: "ਇਹ ਸੁਰੱਖਿਆ ਦਾ ਮੁੱਦਾ ਹੈ।",
          romanization: "ih surakhia da mudda hai.",
          en: "This is a safety issue.",
          vi: "Đây là vấn đề an toàn.",
        },
      },
    ],
    finalQa_en:
      "Exit-ticket proof checks workplace clarity, risk language, and request for priority.",
    finalQa_vi:
      "Bằng chứng vé ra kiểm tra độ rõ ở nơi làm việc, ngôn ngữ rủi ro và yêu cầu ưu tiên.",
  },
  {
    id: "b1-exit-housing-mailbox",
    level: "B1",
    focus: "housing_issue",
    title_en: "Report a housing mailbox issue",
    title_vi: "Báo cáo vấn đề hộp thư nhà ở",
    exitTask_en:
      "Tell the building manager your mailbox lock is broken and ask when it can be repaired.",
    exitTask_vi:
      "Nói với quản lý tòa nhà rằng khóa hộp thư bị hỏng và hỏi khi nào có thể sửa.",
    canadaContext:
      "Useful for Canadian apartment, condo, and building-management conversations.",
    readyPhrases: [
      {
        pa: "ਮੇਰੇ ਮੇਲਬਾਕਸ ਦਾ ਤਾਲਾ ਟੁੱਟ ਗਿਆ ਹੈ।",
        romanization: "mere mailbox da tala tutt giya hai.",
        en: "My mailbox lock is broken.",
        vi: "Khóa hộp thư của tôi bị hỏng.",
      },
      {
        pa: "ਮੈਂ ਆਪਣੀ ਡਾਕ ਨਹੀਂ ਕੱਢ ਸਕਦਾ।",
        romanization: "main apni dak nahin kadh sakda.",
        en: "I cannot take out my mail.",
        vi: "Tôi không thể lấy thư.",
      },
      {
        pa: "ਇਸ ਦੀ ਮੁਰੰਮਤ ਕਦੋਂ ਹੋ ਸਕਦੀ ਹੈ?",
        romanization: "is di murammat kadon ho sakdi hai?",
        en: "When can this be repaired?",
        vi: "Khi nào có thể sửa việc này?",
      },
    ],
    finalProof: {
      prompt_en: "Explain the mailbox problem, effect, and repair timing request.",
      prompt_vi: "Giải thích vấn đề hộp thư, ảnh hưởng và yêu cầu thời gian sửa.",
      modelAnswer: {
        pa: "ਮੇਰੇ ਮੇਲਬਾਕਸ ਦਾ ਤਾਲਾ ਟੁੱਟ ਗਿਆ ਹੈ ਅਤੇ ਮੈਂ ਆਪਣੀ ਡਾਕ ਨਹੀਂ ਕੱਢ ਸਕਦਾ। ਇਸ ਦੀ ਮੁਰੰਮਤ ਕਦੋਂ ਹੋ ਸਕਦੀ ਹੈ?",
        romanization:
          "mere mailbox da tala tutt giya hai ate main apni dak nahin kadh sakda. is di murammat kadon ho sakdi hai?",
        en: "My mailbox lock is broken and I cannot take out my mail. When can this be repaired?",
        vi: "Khóa hộp thư của tôi bị hỏng và tôi không thể lấy thư. Khi nào có thể sửa việc này?",
      },
      passCriteria_en: ["Names housing item", "Explains effect", "Asks repair timing"],
      passCriteria_vi: ["Nêu vật dụng nhà ở", "Giải thích ảnh hưởng", "Hỏi thời gian sửa"],
    },
    commonTraps: [
      {
        trap_en: "Saying broken without naming what is broken.",
        trap_vi: "Nói bị hỏng mà không nêu cái gì bị hỏng.",
        better: {
          pa: "ਮੇਲਬਾਕਸ ਦਾ ਤਾਲਾ ਟੁੱਟ ਗਿਆ ਹੈ।",
          romanization: "mailbox da tala tutt giya hai.",
          en: "The mailbox lock is broken.",
          vi: "Khóa hộp thư bị hỏng.",
        },
      },
    ],
    finalQa_en:
      "Final-proof checks practical housing detail and a clear follow-up request.",
    finalQa_vi:
      "Bằng chứng cuối kiểm tra chi tiết nhà ở thực tế và yêu cầu theo dõi rõ.",
  },
  {
    id: "b1-exit-school-form",
    level: "B1",
    focus: "school_community_task",
    title_en: "Ask about a school form",
    title_vi: "Hỏi về mẫu đơn ở trường",
    exitTask_en:
      "Ask school staff where to submit a form and whether a signature is needed.",
    exitTask_vi:
      "Hỏi nhân viên trường nộp mẫu đơn ở đâu và có cần chữ ký không.",
    canadaContext:
      "Useful for Canadian schools, daycare, community centres, and newcomer programs.",
    readyPhrases: [
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
    finalProof: {
      prompt_en: "Ask where to submit the form, signature need, and timing.",
      prompt_vi: "Hỏi nơi nộp mẫu đơn, có cần chữ ký không và thời gian.",
      modelAnswer: {
        pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਕਿੱਥੇ ਜਮ੍ਹਾਂ ਕਰਨਾ ਹੈ? ਕੀ ਇਸ ਤੇ ਦਸਤਖਤ ਚਾਹੀਦੇ ਹਨ, ਅਤੇ ਕੀ ਅੱਜ ਜਮ੍ਹਾਂ ਕਰਨਾ ਠੀਕ ਹੈ?",
        romanization:
          "mainu ih form kithe jamma karna hai? ki is te dastkhat chahide han, ate ki ajj jamma karna thik hai?",
        en: "Where do I need to submit this form? Does it need a signature, and is it okay to submit it today?",
        vi: "Tôi cần nộp mẫu đơn này ở đâu? Mẫu này có cần chữ ký không, và nộp hôm nay có được không?",
      },
      passCriteria_en: ["Asks location", "Asks requirement", "Asks timing"],
      passCriteria_vi: ["Hỏi địa điểm", "Hỏi yêu cầu", "Hỏi thời gian"],
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
    finalQa_en:
      "Exit-ticket proof checks school/community task handling with location, requirement, and timing.",
    finalQa_vi:
      "Bằng chứng vé ra kiểm tra xử lý việc trường/cộng đồng với địa điểm, yêu cầu và thời gian.",
  },
  {
    id: "b1-exit-follow-up-email",
    level: "B1",
    focus: "follow_up_message",
    title_en: "Write a follow-up message",
    title_vi: "Viết tin nhắn theo dõi",
    exitTask_en:
      "Write a short follow-up message after a service appointment was missed.",
    exitTask_vi:
      "Viết tin nhắn theo dõi ngắn sau khi cuộc hẹn dịch vụ bị lỡ.",
    canadaContext:
      "Useful for Canadian email, text, and portal messages to service providers.",
    readyPhrases: [
      {
        pa: "ਮੈਂ ਕੱਲ੍ਹ ਦੀ ਅਪਾਇੰਟਮੈਂਟ ਬਾਰੇ ਪੁੱਛਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization: "main kallh di appointment bare puchhna chahunda han.",
        en: "I want to ask about yesterday's appointment.",
        vi: "Tôi muốn hỏi về cuộc hẹn hôm qua.",
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
    finalProof: {
      prompt_en: "Write a brief follow-up message with issue and new-time request.",
      prompt_vi: "Viết tin nhắn theo dõi ngắn có vấn đề và yêu cầu giờ mới.",
      modelAnswer: {
        pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਮੈਂ ਕੱਲ੍ਹ ਦੀ ਅਪਾਇੰਟਮੈਂਟ ਬਾਰੇ ਪੁੱਛਣਾ ਚਾਹੁੰਦਾ ਹਾਂ। ਕੋਈ ਨਹੀਂ ਆਇਆ ਸੀ। ਕੀ ਅਸੀਂ ਨਵਾਂ ਸਮਾਂ ਰੱਖ ਸਕਦੇ ਹਾਂ?",
        romanization:
          "sat sri akal ji, main kallh di appointment bare puchhna chahunda han. koi nahin aaya si. ki asin nava sama rakh sakde han?",
        en: "Hello, I want to ask about yesterday's appointment. No one came. Can we set a new time?",
        vi: "Xin chào, tôi muốn hỏi về cuộc hẹn hôm qua. Không có ai đến. Chúng ta có thể đặt giờ mới không?",
      },
      passCriteria_en: ["Names previous appointment", "States issue", "Requests follow-up action"],
      passCriteria_vi: ["Nêu cuộc hẹn trước", "Nêu vấn đề", "Yêu cầu hành động theo dõi"],
    },
    commonTraps: [
      {
        trap_en: "Writing only please reply without context.",
        trap_vi: "Chỉ viết vui lòng trả lời mà không có ngữ cảnh.",
        better: {
          pa: "ਮੈਂ ਕੱਲ੍ਹ ਦੀ ਅਪਾਇੰਟਮੈਂਟ ਬਾਰੇ ਪੁੱਛ ਰਿਹਾ ਹਾਂ।",
          romanization: "main kallh di appointment bare puchh riha han.",
          en: "I am asking about yesterday's appointment.",
          vi: "Tôi đang hỏi về cuộc hẹn hôm qua.",
        },
      },
    ],
    finalQa_en:
      "Final-proof checks message format, context, and a clear follow-up request.",
    finalQa_vi:
      "Bằng chứng cuối kiểm tra dạng tin nhắn, ngữ cảnh và yêu cầu theo dõi rõ.",
  },
  {
    id: "b1-exit-register-aware-request",
    level: "B1",
    focus: "register_aware_request",
    title_en: "Make a polite service request",
    title_vi: "Đưa ra yêu cầu dịch vụ lịch sự",
    exitTask_en:
      "Ask staff to print one page using polite register with ਤੁਸੀਂ and ਜੀ.",
    exitTask_vi:
      "Nhờ nhân viên in một trang bằng mức lịch sự với ਤੁਸੀਂ và ਜੀ.",
    canadaContext:
      "Useful for Canadian libraries and settlement offices; Shahmukhi is script awareness only, not a full course.",
    readyPhrases: [
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
        pa: "ਧੰਨਵਾਦ ਜੀ, ਮੈਂ ਉਡੀਕ ਕਰ ਲੈਂਦਾ ਹਾਂ।",
        romanization: "dhannvad ji, main udik kar lainda han.",
        en: "Thank you, I can wait.",
        vi: "Cảm ơn ạ, tôi có thể chờ.",
      },
    ],
    finalProof: {
      prompt_en: "Make a polite request to print one page and thank the staff member.",
      prompt_vi: "Đưa ra yêu cầu lịch sự để in một trang và cảm ơn nhân viên.",
      modelAnswer: {
        pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਤੁਸੀਂ ਇਹ ਇੱਕ ਪੰਨਾ ਪ੍ਰਿੰਟ ਕਰ ਸਕਦੇ ਹੋ ਜੀ? ਮੈਨੂੰ ਸਿਰਫ਼ ਇੱਕ ਕਾਪੀ ਚਾਹੀਦੀ ਹੈ। ਧੰਨਵਾਦ ਜੀ।",
        romanization:
          "sat sri akal ji, tusin ih ikk panna print kar sakde ho ji? mainu sirf ikk copy chahidi hai. dhannvad ji.",
        en: "Hello, could you print this one page, please? I only need one copy. Thank you.",
        vi: "Xin chào ạ, bạn có thể in một trang này giúp tôi không ạ? Tôi chỉ cần một bản. Cảm ơn ạ.",
      },
      passCriteria_en: ["Uses polite register", "States request", "Adds quantity"],
      passCriteria_vi: ["Dùng mức lịch sự", "Nêu yêu cầu", "Thêm số lượng"],
    },
    commonTraps: [
      {
        trap_en: "Using a bare command instead of a polite request.",
        trap_vi: "Dùng mệnh lệnh cụt thay vì yêu cầu lịch sự.",
        better: {
          pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਪ੍ਰਿੰਟ ਕਰ ਦਿਓ ਜੀ।",
          romanization: "kirpa karke ih print kar dio ji.",
          en: "Please print this for me.",
          vi: "Vui lòng in điều này giúp tôi ạ.",
        },
      },
    ],
    finalQa_en:
      "Ready for exit-ticket final-QA: Gurmukhi is primary, Shahmukhi remains awareness only, and Native review is deferred.",
    finalQa_vi:
      "Sẵn sàng cho kiểm tra cuối vé ra: Gurmukhi là chính, Shahmukhi chỉ để nhận biết, và Native review is deferred.",
  },
];
