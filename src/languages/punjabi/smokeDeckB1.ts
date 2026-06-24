export type PunjabiB1SmokeDeckFocus =
  | "explain_situation"
  | "retell_event"
  | "clarify_next_steps"
  | "service_conversation"
  | "workplace_issue"
  | "housing_issue"
  | "school_community_task"
  | "register_aware_request";

export type PunjabiSmokeDeckLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiSmokeDeckTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiSmokeDeckLine;
};

export type PunjabiSmokeDeckQA = {
  smokePrompt_en: string;
  smokePrompt_vi: string;
  sampleAnswer: PunjabiSmokeDeckLine;
  passSignals_en: string[];
  passSignals_vi: string[];
};

export type PunjabiB1SmokeDeckCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1SmokeDeckFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  usefulLanguage: PunjabiSmokeDeckLine[];
  qa: PunjabiSmokeDeckQA;
  commonTraps: PunjabiSmokeDeckTrap[];
  integrationReadiness_en: string;
  integrationReadiness_vi: string;
};

export const punjabiB1SmokeDeck: PunjabiB1SmokeDeckCard[] = [
  {
    id: "b1-smoke-explain-access-card",
    level: "B1",
    focus: "explain_situation",
    title_en: "Explain a practical problem",
    title_vi: "Giải thích một vấn đề thực tế",
    scenario_en:
      "Your community centre access card does not open the door before an evening class.",
    scenario_vi:
      "Thẻ ra vào trung tâm cộng đồng của bạn không mở được cửa trước lớp buổi tối.",
    canadaContext:
      "Useful for recreation centres, libraries, settlement agencies, and shared building entrances in Canada.",
    usefulLanguage: [
      {
        pa: "ਮੇਰਾ ਕਾਰਡ ਦਰਵਾਜ਼ਾ ਨਹੀਂ ਖੋਲ੍ਹ ਰਿਹਾ।",
        romanization: "mera card darvaza nahin kholh riha.",
        en: "My card is not opening the door.",
        vi: "Thẻ của tôi không mở được cửa.",
      },
      {
        pa: "ਮੇਰੀ ਕਲਾਸ ਸੱਤ ਵਜੇ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ।",
        romanization: "meri class satt vaje shuru hundi hai.",
        en: "My class starts at seven.",
        vi: "Lớp của tôi bắt đầu lúc bảy giờ.",
      },
      {
        pa: "ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin meri madad kar sakde ho?",
        en: "Can you help me?",
        vi: "Bạn có thể giúp tôi không?",
      },
    ],
    qa: {
      smokePrompt_en:
        "Explain the access-card problem in two or three sentences and ask for help.",
      smokePrompt_vi:
        "Hãy giải thích vấn đề với thẻ ra vào trong hai hoặc ba câu và nhờ giúp đỡ.",
      sampleAnswer: {
        pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਮੇਰਾ ਕਾਰਡ ਦਰਵਾਜ਼ਾ ਨਹੀਂ ਖੋਲ੍ਹ ਰਿਹਾ। ਮੇਰੀ ਕਲਾਸ ਸੱਤ ਵਜੇ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ, ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?",
        romanization:
          "sat sri akal ji, mera card darvaza nahin kholh riha. meri class satt vaje shuru hundi hai, ki tusin meri madad kar sakde ho?",
        en: "Hello, my card is not opening the door. My class starts at seven; can you help me?",
        vi: "Xin chào, thẻ của tôi không mở được cửa. Lớp của tôi bắt đầu lúc bảy giờ; bạn có thể giúp tôi không?",
      },
      passSignals_en: [
        "States the problem clearly",
        "Adds a time or reason",
        "Makes a polite request",
      ],
      passSignals_vi: [
        "Nói rõ vấn đề",
        "Thêm thời gian hoặc lý do",
        "Đưa ra yêu cầu lịch sự",
      ],
    },
    commonTraps: [
      {
        trap_en: "Using only one word like card or door without a complete problem.",
        trap_vi: "Chỉ dùng một từ như thẻ hoặc cửa mà không nói thành vấn đề đầy đủ.",
        better: {
          pa: "ਮੇਰਾ ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।",
          romanization: "mera card kamm nahin kar riha.",
          en: "My card is not working.",
          vi: "Thẻ của tôi không hoạt động.",
        },
      },
    ],
    integrationReadiness_en:
      "Ready for smoke-check display as a short B1 situation explanation with a clear help request.",
    integrationReadiness_vi:
      "Sẵn sàng cho kiểm tra nhanh ở mức B1: giải thích tình huống ngắn và yêu cầu giúp đỡ rõ ràng.",
  },
  {
    id: "b1-smoke-retell-bus-delay",
    level: "B1",
    focus: "retell_event",
    title_en: "Retell an event",
    title_vi: "Kể lại một sự việc",
    scenario_en:
      "You were late for an appointment because the bus was delayed and you need to explain what happened.",
    scenario_vi:
      "Bạn đến trễ cuộc hẹn vì xe buýt bị chậm và cần giải thích chuyện đã xảy ra.",
    canadaContext:
      "Useful for Canadian transit, clinics, schools, newcomer services, and offices where learners need to explain lateness.",
    usefulLanguage: [
      {
        pa: "ਬੱਸ ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਈ।",
        romanization: "bus das mint der nal aai.",
        en: "The bus came ten minutes late.",
        vi: "Xe buýt đến trễ mười phút.",
      },
      {
        pa: "ਮੈਂ ਪਹਿਲਾਂ ਹੀ ਨਿਕਲ ਗਿਆ ਸੀ।",
        romanization: "main pahilan hi nikal giya si.",
        en: "I had already left early.",
        vi: "Tôi đã đi sớm rồi.",
      },
      {
        pa: "ਇਸ ਕਰਕੇ ਮੈਂ ਮੀਟਿੰਗ ਲਈ ਦੇਰ ਨਾਲ ਪਹੁੰਚਿਆ।",
        romanization: "is karke main meeting lai der nal pahunchia.",
        en: "Because of this, I arrived late for the meeting.",
        vi: "Vì vậy, tôi đến cuộc họp trễ.",
      },
    ],
    qa: {
      smokePrompt_en:
        "Retell what happened with time order: first, then, because of that.",
      smokePrompt_vi:
        "Kể lại sự việc theo thứ tự thời gian: trước tiên, sau đó, vì vậy.",
      sampleAnswer: {
        pa: "ਮੈਂ ਪਹਿਲਾਂ ਹੀ ਨਿਕਲ ਗਿਆ ਸੀ, ਪਰ ਬੱਸ ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਈ। ਇਸ ਕਰਕੇ ਮੈਂ ਮੀਟਿੰਗ ਲਈ ਦੇਰ ਨਾਲ ਪਹੁੰਚਿਆ।",
        romanization:
          "main pahilan hi nikal giya si, par bus das mint der nal aai. is karke main meeting lai der nal pahunchia.",
        en: "I had already left early, but the bus came ten minutes late. Because of this, I arrived late for the meeting.",
        vi: "Tôi đã đi sớm rồi, nhưng xe buýt đến trễ mười phút. Vì vậy, tôi đến cuộc họp trễ.",
      },
      passSignals_en: [
        "Uses past-time framing",
        "Connects cause and result",
        "Keeps the story in order",
      ],
      passSignals_vi: [
        "Dùng khung thời gian quá khứ",
        "Nối nguyên nhân và kết quả",
        "Giữ câu chuyện đúng thứ tự",
      ],
    },
    commonTraps: [
      {
        trap_en: "Listing facts without connectors, making the story hard to follow.",
        trap_vi: "Liệt kê sự kiện mà không có từ nối, làm câu chuyện khó theo dõi.",
        better: {
          pa: "ਪਹਿਲਾਂ ਮੈਂ ਘਰ ਤੋਂ ਨਿਕਲਿਆ, ਫਿਰ ਬੱਸ ਦੇਰ ਨਾਲ ਆਈ।",
          romanization: "pahilan main ghar ton niklia, phir bus der nal aai.",
          en: "First I left home, then the bus came late.",
          vi: "Trước tiên tôi rời nhà, sau đó xe buýt đến trễ.",
        },
      },
    ],
    integrationReadiness_en:
      "Ready for final-QA checks that need sequencing, cause, and a concise past event.",
    integrationReadiness_vi:
      "Sẵn sàng cho kiểm tra cuối: cần trình tự, nguyên nhân và một sự việc quá khứ ngắn gọn.",
  },
  {
    id: "b1-smoke-clarify-office-next-steps",
    level: "B1",
    focus: "clarify_next_steps",
    title_en: "Clarify next steps",
    title_vi: "Làm rõ các bước tiếp theo",
    scenario_en:
      "At an office desk, you need to confirm the deadline and documents. Language support only, not legal or medical advice.",
    scenario_vi:
      "Tại quầy văn phòng, bạn cần xác nhận hạn chót và giấy tờ. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn pháp lý hoặc y tế.",
    canadaContext:
      "Useful for public-service counters and newcomer appointments in Canada; language practice only, not advice.",
    usefulLanguage: [
      {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੁਬਾਰਾ ਦੱਸੋ।",
        romanization: "kirpa karke agla kadam dubara dasso.",
        en: "Please tell me the next step again.",
        vi: "Vui lòng nói lại bước tiếp theo.",
      },
      {
        pa: "ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲਿਆਉਣੇ ਹਨ?",
        romanization: "mainu kihre dastavez liaune han?",
        en: "Which documents do I need to bring?",
        vi: "Tôi cần mang những giấy tờ nào?",
      },
      {
        pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਈਮੇਲ ਵਿੱਚ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin ih email vich bhej sakde ho?",
        en: "Can you send this by email?",
        vi: "Bạn có thể gửi điều này qua email không?",
      },
    ],
    qa: {
      smokePrompt_en:
        "Ask for the deadline, required documents, and written confirmation.",
      smokePrompt_vi:
        "Hãy hỏi hạn chót, giấy tờ cần thiết và xác nhận bằng văn bản.",
      sampleAnswer: {
        pa: "ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲਿਆਉਣੇ ਹਨ, ਅਤੇ ਆਖਰੀ ਤਾਰੀਖ ਕਦੋਂ ਹੈ? ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਈਮੇਲ ਵਿੱਚ ਭੇਜ ਦਿਓ।",
        romanization:
          "mainu kihre dastavez liaune han, ate akhri tarikh kadon hai? kirpa karke ih email vich bhej dio.",
        en: "Which documents do I need to bring, and when is the deadline? Please send this by email.",
        vi: "Tôi cần mang những giấy tờ nào, và hạn chót là khi nào? Vui lòng gửi điều này qua email.",
      },
      passSignals_en: [
        "Asks at least two clarifying questions",
        "Requests written confirmation",
        "Stays within language support",
      ],
      passSignals_vi: [
        "Hỏi ít nhất hai câu làm rõ",
        "Yêu cầu xác nhận bằng văn bản",
        "Giữ trong phạm vi hỗ trợ ngôn ngữ",
      ],
    },
    commonTraps: [
      {
        trap_en: "Pretending to understand instead of asking for slower repetition.",
        trap_vi: "Giả vờ hiểu thay vì yêu cầu nói chậm và lặp lại.",
        better: {
          pa: "ਮਾਫ ਕਰਨਾ, ਕਿਰਪਾ ਕਰਕੇ ਥੋੜ੍ਹਾ ਹੌਲੀ ਦੁਬਾਰਾ ਦੱਸੋ।",
          romanization: "maf karna, kirpa karke thora hauli dubara dasso.",
          en: "Sorry, please say it again a little more slowly.",
          vi: "Xin lỗi, vui lòng nói lại chậm hơn một chút.",
        },
      },
    ],
    integrationReadiness_en:
      "Ready for smoke-check tasks where learners must clarify next steps without giving legal or medical advice.",
    integrationReadiness_vi:
      "Sẵn sàng cho kiểm tra nhanh khi người học phải làm rõ bước tiếp theo mà không đưa tư vấn pháp lý hoặc y tế.",
  },
  {
    id: "b1-smoke-service-bill-charge",
    level: "B1",
    focus: "service_conversation",
    title_en: "Handle a service conversation",
    title_vi: "Xử lý hội thoại dịch vụ",
    scenario_en:
      "You call a service desk because your monthly bill has an unexpected charge.",
    scenario_vi:
      "Bạn gọi quầy dịch vụ vì hóa đơn tháng có một khoản phí bất ngờ.",
    canadaContext:
      "Useful for phone, internet, utility, and membership billing conversations in Canada.",
    usefulLanguage: [
      {
        pa: "ਮੇਰੇ ਬਿੱਲ ਵਿੱਚ ਇਹ ਵਾਧੂ ਚਾਰਜ ਕਿਉਂ ਹੈ?",
        romanization: "mere bill vich ih vadhu charge kyon hai?",
        en: "Why is this extra charge on my bill?",
        vi: "Tại sao hóa đơn của tôi có khoản phí thêm này?",
      },
      {
        pa: "ਕੀ ਤੁਸੀਂ ਇਸਨੂੰ ਚੈੱਕ ਕਰ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin isnu check kar sakde ho?",
        en: "Can you check this?",
        vi: "Bạn có thể kiểm tra điều này không?",
      },
      {
        pa: "ਜੇ ਇਹ ਗਲਤੀ ਹੈ, ਕੀ ਇਸਨੂੰ ਹਟਾਇਆ ਜਾ ਸਕਦਾ ਹੈ?",
        romanization: "je ih galti hai, ki isnu hataia ja sakda hai?",
        en: "If this is a mistake, can it be removed?",
        vi: "Nếu đây là lỗi, khoản này có thể được xóa không?",
      },
    ],
    qa: {
      smokePrompt_en:
        "Ask about an unexpected charge and request a clear option or correction.",
      smokePrompt_vi:
        "Hãy hỏi về khoản phí bất ngờ và yêu cầu một lựa chọn hoặc sửa lỗi rõ ràng.",
      sampleAnswer: {
        pa: "ਮੇਰੇ ਬਿੱਲ ਵਿੱਚ ਇਹ ਵਾਧੂ ਚਾਰਜ ਕਿਉਂ ਹੈ? ਕੀ ਤੁਸੀਂ ਇਸਨੂੰ ਚੈੱਕ ਕਰ ਸਕਦੇ ਹੋ, ਅਤੇ ਜੇ ਇਹ ਗਲਤੀ ਹੈ ਤਾਂ ਇਸਨੂੰ ਹਟਾ ਸਕਦੇ ਹੋ?",
        romanization:
          "mere bill vich ih vadhu charge kyon hai? ki tusin isnu check kar sakde ho, ate je ih galti hai tan isnu hata sakde ho?",
        en: "Why is this extra charge on my bill? Can you check it, and if it is a mistake, can you remove it?",
        vi: "Tại sao hóa đơn của tôi có khoản phí thêm này? Bạn có thể kiểm tra, và nếu đó là lỗi thì xóa khoản này không?",
      },
      passSignals_en: [
        "Identifies the charge",
        "Asks for checking",
        "Requests a next action",
      ],
      passSignals_vi: [
        "Xác định khoản phí",
        "Yêu cầu kiểm tra",
        "Yêu cầu hành động tiếp theo",
      ],
    },
    commonTraps: [
      {
        trap_en: "Sounding accusatory before asking for an explanation.",
        trap_vi: "Nghe như buộc tội trước khi hỏi lời giải thích.",
        better: {
          pa: "ਮੈਨੂੰ ਇਹ ਚਾਰਜ ਸਮਝ ਨਹੀਂ ਆ ਰਿਹਾ।",
          romanization: "mainu ih charge samajh nahin aa riha.",
          en: "I do not understand this charge.",
          vi: "Tôi không hiểu khoản phí này.",
        },
      },
    ],
    integrationReadiness_en:
      "Ready for service-dialog smoke tests that check problem, clarification, and polite resolution language.",
    integrationReadiness_vi:
      "Sẵn sàng cho kiểm tra hội thoại dịch vụ: vấn đề, làm rõ và ngôn ngữ giải quyết lịch sự.",
  },
  {
    id: "b1-smoke-workplace-supplies",
    level: "B1",
    focus: "workplace_issue",
    title_en: "Report a workplace issue",
    title_vi: "Báo cáo một vấn đề ở nơi làm việc",
    scenario_en:
      "At work, a needed supply has not arrived and you need to ask your supervisor what to prioritize.",
    scenario_vi:
      "Ở nơi làm việc, một vật tư cần thiết chưa đến và bạn cần hỏi quản lý nên ưu tiên việc gì.",
    canadaContext:
      "Useful for retail, warehouse, office, and food-service shift communication in Canada.",
    usefulLanguage: [
      {
        pa: "ਸਮਾਨ ਅਜੇ ਨਹੀਂ ਆਇਆ।",
        romanization: "saman aje nahin aaya.",
        en: "The supplies have not arrived yet.",
        vi: "Vật tư vẫn chưa đến.",
      },
      {
        pa: "ਮੈਂ ਇਸ ਵੇਲੇ ਕਿਹੜਾ ਕੰਮ ਪਹਿਲਾਂ ਕਰਾਂ?",
        romanization: "main is vele kihra kamm pahilan karan?",
        en: "Which task should I do first right now?",
        vi: "Bây giờ tôi nên làm việc nào trước?",
      },
      {
        pa: "ਜੇ ਸਮਾਨ ਆ ਜਾਵੇ, ਮੈਂ ਤੁਹਾਨੂੰ ਦੱਸ ਦਿਆਂਗਾ।",
        romanization: "je saman aa jave, main tuhanu dass dianga.",
        en: "If the supplies arrive, I will tell you.",
        vi: "Nếu vật tư đến, tôi sẽ báo cho bạn.",
      },
    ],
    qa: {
      smokePrompt_en:
        "Tell a supervisor the supply issue and ask what task to do first.",
      smokePrompt_vi:
        "Nói với quản lý về vấn đề vật tư và hỏi nên làm việc nào trước.",
      sampleAnswer: {
        pa: "ਸਮਾਨ ਅਜੇ ਨਹੀਂ ਆਇਆ, ਇਸ ਕਰਕੇ ਮੈਂ ਇਹ ਕੰਮ ਸ਼ੁਰੂ ਨਹੀਂ ਕਰ ਸਕਦਾ। ਮੈਂ ਇਸ ਵੇਲੇ ਕਿਹੜਾ ਕੰਮ ਪਹਿਲਾਂ ਕਰਾਂ?",
        romanization:
          "saman aje nahin aaya, is karke main ih kamm shuru nahin kar sakda. main is vele kihra kamm pahilan karan?",
        en: "The supplies have not arrived yet, so I cannot start this task. Which task should I do first right now?",
        vi: "Vật tư vẫn chưa đến, nên tôi chưa thể bắt đầu việc này. Bây giờ tôi nên làm việc nào trước?",
      },
      passSignals_en: [
        "Reports the blocker",
        "Explains the effect on work",
        "Asks for priority",
      ],
      passSignals_vi: [
        "Báo cáo điểm bị chặn",
        "Giải thích ảnh hưởng đến công việc",
        "Hỏi về ưu tiên",
      ],
    },
    commonTraps: [
      {
        trap_en: "Stopping at cannot work without offering a useful next step.",
        trap_vi: "Chỉ nói không thể làm mà không đề xuất bước tiếp theo hữu ích.",
        better: {
          pa: "ਮੈਂ ਹੋਰ ਕੰਮ ਸ਼ੁਰੂ ਕਰ ਸਕਦਾ ਹਾਂ।",
          romanization: "main hor kamm shuru kar sakda han.",
          en: "I can start another task.",
          vi: "Tôi có thể bắt đầu việc khác.",
        },
      },
    ],
    integrationReadiness_en:
      "Ready for workplace final-QA where learners must report a blocker and request prioritization.",
    integrationReadiness_vi:
      "Sẵn sàng cho kiểm tra cuối về nơi làm việc: báo cáo điểm bị chặn và hỏi ưu tiên.",
  },
  {
    id: "b1-smoke-housing-leak",
    level: "B1",
    focus: "housing_issue",
    title_en: "Explain a housing issue",
    title_vi: "Giải thích một vấn đề nhà ở",
    scenario_en:
      "You reported a leak under the kitchen sink and need to ask the building manager for an update.",
    scenario_vi:
      "Bạn đã báo rò rỉ dưới bồn rửa bếp và cần hỏi quản lý tòa nhà về cập nhật.",
    canadaContext:
      "Useful for tenant-landlord and building-management conversations in Canada; language practice only.",
    usefulLanguage: [
      {
        pa: "ਰਸੋਈ ਦੇ ਸਿੰਕ ਹੇਠਾਂ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ।",
        romanization: "rasoi de sink hethan pani leak ho riha hai.",
        en: "Water is leaking under the kitchen sink.",
        vi: "Nước đang rò dưới bồn rửa bếp.",
      },
      {
        pa: "ਮੈਂ ਕੱਲ੍ਹ ਇਸ ਬਾਰੇ ਸੁਨੇਹਾ ਭੇਜਿਆ ਸੀ।",
        romanization: "main kallh is bare suneha bhejia si.",
        en: "I sent a message about this yesterday.",
        vi: "Hôm qua tôi đã gửi tin nhắn về việc này.",
      },
      {
        pa: "ਮੁਰੰਮਤ ਕਦੋਂ ਹੋ ਸਕਦੀ ਹੈ?",
        romanization: "murammat kadon ho sakdi hai?",
        en: "When can the repair happen?",
        vi: "Khi nào có thể sửa chữa?",
      },
    ],
    qa: {
      smokePrompt_en:
        "Explain the leak, mention the earlier report, and ask for a repair update.",
      smokePrompt_vi:
        "Giải thích việc rò rỉ, nhắc báo cáo trước đó và hỏi cập nhật sửa chữa.",
      sampleAnswer: {
        pa: "ਰਸੋਈ ਦੇ ਸਿੰਕ ਹੇਠਾਂ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ। ਮੈਂ ਕੱਲ੍ਹ ਸੁਨੇਹਾ ਭੇਜਿਆ ਸੀ; ਮੁਰੰਮਤ ਕਦੋਂ ਹੋ ਸਕਦੀ ਹੈ?",
        romanization:
          "rasoi de sink hethan pani leak ho riha hai. main kallh suneha bhejia si; murammat kadon ho sakdi hai?",
        en: "Water is leaking under the kitchen sink. I sent a message yesterday; when can the repair happen?",
        vi: "Nước đang rò dưới bồn rửa bếp. Hôm qua tôi đã gửi tin nhắn; khi nào có thể sửa chữa?",
      },
      passSignals_en: [
        "Names the location",
        "Mentions prior contact",
        "Asks for timing",
      ],
      passSignals_vi: [
        "Nêu vị trí",
        "Nhắc lần liên hệ trước",
        "Hỏi thời gian",
      ],
    },
    commonTraps: [
      {
        trap_en: "Forgetting location details, which makes repair requests unclear.",
        trap_vi: "Quên chi tiết vị trí, khiến yêu cầu sửa chữa không rõ.",
        better: {
          pa: "ਸਿੰਕ ਹੇਠਾਂ, ਖੱਬੇ ਪਾਸੇ, ਪਾਣੀ ਆ ਰਿਹਾ ਹੈ।",
          romanization: "sink hethan, khabbe pase, pani aa riha hai.",
          en: "Under the sink, on the left side, water is coming out.",
          vi: "Dưới bồn rửa, bên trái, nước đang chảy ra.",
        },
      },
    ],
    integrationReadiness_en:
      "Ready for housing smoke-checks with practical detail, earlier contact, and a repair-time request.",
    integrationReadiness_vi:
      "Sẵn sàng cho kiểm tra nhanh về nhà ở với chi tiết thực tế, liên hệ trước và yêu cầu thời gian sửa.",
  },
  {
    id: "b1-smoke-school-pickup-change",
    level: "B1",
    focus: "school_community_task",
    title_en: "Manage a school or community task",
    title_vi: "Xử lý một việc ở trường hoặc cộng đồng",
    scenario_en:
      "You need to tell a school or community program that pickup time has changed today.",
    scenario_vi:
      "Bạn cần báo với trường hoặc chương trình cộng đồng rằng giờ đón hôm nay đã thay đổi.",
    canadaContext:
      "Useful for schools, daycare, after-school programs, library programs, and community classes in Canada.",
    usefulLanguage: [
      {
        pa: "ਅੱਜ ਪਿਕਅੱਪ ਦਾ ਸਮਾਂ ਬਦਲ ਗਿਆ ਹੈ।",
        romanization: "ajj pickup da sama badal giya hai.",
        en: "The pickup time has changed today.",
        vi: "Giờ đón hôm nay đã thay đổi.",
      },
      {
        pa: "ਮੇਰਾ ਭਰਾ ਪੰਜ ਵਜੇ ਆਵੇਗਾ।",
        romanization: "mera bhra panj vaje avega.",
        en: "My brother will come at five.",
        vi: "Anh trai/em trai tôi sẽ đến lúc năm giờ.",
      },
      {
        pa: "ਕੀ ਤੁਹਾਨੂੰ ਹੋਰ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ?",
        romanization: "ki tuhanu hor jankari chahidi hai?",
        en: "Do you need any other information?",
        vi: "Bạn có cần thêm thông tin nào không?",
      },
    ],
    qa: {
      smokePrompt_en:
        "Tell the program about the changed pickup time and check if more information is needed.",
      smokePrompt_vi:
        "Báo với chương trình về giờ đón đã thay đổi và kiểm tra xem có cần thêm thông tin không.",
      sampleAnswer: {
        pa: "ਅੱਜ ਪਿਕਅੱਪ ਦਾ ਸਮਾਂ ਬਦਲ ਗਿਆ ਹੈ। ਮੇਰਾ ਭਰਾ ਪੰਜ ਵਜੇ ਆਵੇਗਾ; ਕੀ ਤੁਹਾਨੂੰ ਹੋਰ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ?",
        romanization:
          "ajj pickup da sama badal giya hai. mera bhra panj vaje avega; ki tuhanu hor jankari chahidi hai?",
        en: "The pickup time has changed today. My brother will come at five; do you need any other information?",
        vi: "Giờ đón hôm nay đã thay đổi. Anh trai/em trai tôi sẽ đến lúc năm giờ; bạn có cần thêm thông tin nào không?",
      },
      passSignals_en: [
        "States the change",
        "Gives the new person or time",
        "Checks information needs",
      ],
      passSignals_vi: [
        "Nêu sự thay đổi",
        "Cho biết người hoặc giờ mới",
        "Kiểm tra nhu cầu thông tin",
      ],
    },
    commonTraps: [
      {
        trap_en: "Leaving out the new time or person, which creates safety confusion.",
        trap_vi: "Bỏ sót giờ hoặc người mới, gây nhầm lẫn về an toàn.",
        better: {
          pa: "ਪੰਜ ਵਜੇ ਮੇਰਾ ਭਰਾ ਆਵੇਗਾ।",
          romanization: "panj vaje mera bhra avega.",
          en: "At five, my brother will come.",
          vi: "Lúc năm giờ, anh trai/em trai tôi sẽ đến.",
        },
      },
    ],
    integrationReadiness_en:
      "Ready for school/community smoke-checks that need clear change details and confirmation.",
    integrationReadiness_vi:
      "Sẵn sàng cho kiểm tra nhanh ở trường/cộng đồng: cần chi tiết thay đổi rõ và xác nhận.",
  },
  {
    id: "b1-smoke-register-aware-request",
    level: "B1",
    focus: "register_aware_request",
    title_en: "Make a register-aware request",
    title_vi: "Đưa ra yêu cầu phù hợp mức lịch sự",
    scenario_en:
      "You need to ask a staff member to print a form, using polite register with ji and tusin.",
    scenario_vi:
      "Bạn cần nhờ nhân viên in một mẫu đơn, dùng mức lịch sự với ji và tusin.",
    canadaContext:
      "Useful for Canadian libraries, settlement offices, schools, and service counters; Shahmukhi is mentioned for awareness only, not as a full course.",
    usefulLanguage: [
      {
        pa: "ਤੁਸੀਂ ਇਹ ਫਾਰਮ ਪ੍ਰਿੰਟ ਕਰ ਸਕਦੇ ਹੋ ਜੀ?",
        romanization: "tusin ih form print kar sakde ho ji?",
        en: "Could you print this form, please?",
        vi: "Bạn có thể in mẫu đơn này giúp tôi không ạ?",
      },
      {
        pa: "ਮੈਨੂੰ ਦੋ ਕਾਪੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ।",
        romanization: "mainu do copies chahidiyan han.",
        en: "I need two copies.",
        vi: "Tôi cần hai bản.",
      },
      {
        pa: "ਧੰਨਵਾਦ ਜੀ, ਇਹ ਮੇਰੇ ਲਈ ਬਹੁਤ ਮਦਦਗਾਰ ਹੈ।",
        romanization: "dhannvad ji, ih mere lai bahut madadgar hai.",
        en: "Thank you, this is very helpful for me.",
        vi: "Cảm ơn ạ, điều này rất hữu ích cho tôi.",
      },
    ],
    qa: {
      smokePrompt_en:
        "Make a polite request to print a form and include the number of copies.",
      smokePrompt_vi:
        "Đưa ra yêu cầu lịch sự để in một mẫu đơn và nói số bản cần in.",
      sampleAnswer: {
        pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਤੁਸੀਂ ਇਹ ਫਾਰਮ ਪ੍ਰਿੰਟ ਕਰ ਸਕਦੇ ਹੋ ਜੀ? ਮੈਨੂੰ ਦੋ ਕਾਪੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ।",
        romanization:
          "sat sri akal ji, tusin ih form print kar sakde ho ji? mainu do copies chahidiyan han.",
        en: "Hello, could you print this form, please? I need two copies.",
        vi: "Xin chào ạ, bạn có thể in mẫu đơn này giúp tôi không ạ? Tôi cần hai bản.",
      },
      passSignals_en: [
        "Uses polite ਤੁਸੀਂ or ਜੀ",
        "States the task",
        "Includes a concrete detail",
      ],
      passSignals_vi: [
        "Dùng ਤੁਸੀਂ hoặc ਜੀ lịch sự",
        "Nêu việc cần làm",
        "Có một chi tiết cụ thể",
      ],
    },
    commonTraps: [
      {
        trap_en: "Using a bare command when a service-counter request needs a softer register.",
        trap_vi: "Dùng mệnh lệnh cụt khi yêu cầu ở quầy dịch vụ cần mềm hơn.",
        better: {
          pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਫਾਰਮ ਪ੍ਰਿੰਟ ਕਰ ਦਿਓ ਜੀ।",
          romanization: "kirpa karke ih form print kar dio ji.",
          en: "Please print this form for me.",
          vi: "Vui lòng in mẫu đơn này giúp tôi ạ.",
        },
      },
    ],
    integrationReadiness_en:
      "Ready for integration-readiness checks: Gurmukhi is primary, Shahmukhi awareness is limited to script awareness, and Native review is deferred.",
    integrationReadiness_vi:
      "Sẵn sàng cho kiểm tra tích hợp: Gurmukhi là chính, Shahmukhi chỉ để nhận biết chữ viết, và Native review is deferred.",
  },
];
