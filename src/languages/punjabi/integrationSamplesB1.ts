export type PunjabiB1IntegrationSampleFocus =
  | "explain_situation"
  | "retell_event"
  | "clarify_next_steps"
  | "service_conversation"
  | "workplace_issue"
  | "housing_issue"
  | "school_community_task"
  | "register_aware_request";

export type PunjabiIntegrationSampleLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiIntegrationSampleTrap = {
  trap_en: string;
  trap_vi: string;
  repair: PunjabiIntegrationSampleLine;
};

export type PunjabiIntegrationFinalEvidence = {
  prompt_en: string;
  prompt_vi: string;
  sampleResponse: PunjabiIntegrationSampleLine;
  evidenceSignals_en: string[];
  evidenceSignals_vi: string[];
};

export type PunjabiB1IntegrationSample = {
  id: string;
  level: "B1";
  focus: PunjabiB1IntegrationSampleFocus;
  integrationSlot: string;
  title_en: string;
  title_vi: string;
  learnerTask_en: string;
  learnerTask_vi: string;
  canadaUseCase: string;
  setupLines: PunjabiIntegrationSampleLine[];
  finalEvidence: PunjabiIntegrationFinalEvidence;
  commonTraps: PunjabiIntegrationSampleTrap[];
  finalQaNote_en: string;
  finalQaNote_vi: string;
};

export const punjabiB1IntegrationSamples: PunjabiB1IntegrationSample[] = [
  {
    id: "b1-integration-explain-pharmacy-refill",
    level: "B1",
    focus: "explain_situation",
    integrationSlot: "b1_final_explain_situation",
    title_en: "Explain a pharmacy refill problem",
    title_vi: "Giải thích vấn đề lấy thêm thuốc ở nhà thuốc",
    learnerTask_en:
      "Explain that your refill is not ready and ask what information is missing. Language practice only, not medical advice.",
    learnerTask_vi:
      "Giải thích rằng thuốc lấy thêm của bạn chưa sẵn sàng và hỏi còn thiếu thông tin gì. Chỉ luyện ngôn ngữ, không phải tư vấn y tế.",
    canadaUseCase:
      "For Canadian pharmacy counters where learners need clear language support without giving medical advice.",
    setupLines: [
      {
        pa: "ਮੇਰੀ ਰੀਫਿਲ ਅਜੇ ਤਿਆਰ ਨਹੀਂ ਹੈ।",
        romanization: "meri refill aje tiyar nahin hai.",
        en: "My refill is not ready yet.",
        vi: "Thuốc lấy thêm của tôi vẫn chưa sẵn sàng.",
      },
      {
        pa: "ਮੈਂ ਪਿਛਲੇ ਹਫਤੇ ਬੇਨਤੀ ਕੀਤੀ ਸੀ।",
        romanization: "main pichhle hafte benti kiti si.",
        en: "I requested it last week.",
        vi: "Tôi đã yêu cầu tuần trước.",
      },
      {
        pa: "ਕਿਹੜੀ ਜਾਣਕਾਰੀ ਘੱਟ ਹੈ?",
        romanization: "kihri jankari ghatt hai?",
        en: "What information is missing?",
        vi: "Còn thiếu thông tin nào?",
      },
    ],
    finalEvidence: {
      prompt_en:
        "Explain the refill situation, mention the earlier request, and ask what is missing.",
      prompt_vi:
        "Giải thích tình huống lấy thêm thuốc, nhắc yêu cầu trước đó và hỏi còn thiếu gì.",
      sampleResponse: {
        pa: "ਮੇਰੀ ਰੀਫਿਲ ਅਜੇ ਤਿਆਰ ਨਹੀਂ ਹੈ। ਮੈਂ ਪਿਛਲੇ ਹਫਤੇ ਬੇਨਤੀ ਕੀਤੀ ਸੀ; ਕਿਹੜੀ ਜਾਣਕਾਰੀ ਘੱਟ ਹੈ?",
        romanization:
          "meri refill aje tiyar nahin hai. main pichhle hafte benti kiti si; kihri jankari ghatt hai?",
        en: "My refill is not ready yet. I requested it last week; what information is missing?",
        vi: "Thuốc lấy thêm của tôi vẫn chưa sẵn sàng. Tôi đã yêu cầu tuần trước; còn thiếu thông tin nào?",
      },
      evidenceSignals_en: [
        "Explains the present problem",
        "Gives prior timing",
        "Asks a clear missing-information question",
      ],
      evidenceSignals_vi: [
        "Giải thích vấn đề hiện tại",
        "Nêu thời điểm đã liên hệ",
        "Hỏi rõ thông tin còn thiếu",
      ],
    },
    commonTraps: [
      {
        trap_en: "Turning the language task into health advice.",
        trap_vi: "Biến bài luyện ngôn ngữ thành tư vấn sức khỏe.",
        repair: {
          pa: "ਮੈਂ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਸਮਝਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
          romanization: "main sirf jankari samajhna chahunda han.",
          en: "I only want to understand the information.",
          vi: "Tôi chỉ muốn hiểu thông tin.",
        },
      },
    ],
    finalQaNote_en:
      "Integration sample is ready for final-QA checks that verify situation, timing, and clarification.",
    finalQaNote_vi:
      "Mẫu tích hợp sẵn sàng cho kiểm tra cuối: xác minh tình huống, thời điểm và câu hỏi làm rõ.",
  },
  {
    id: "b1-integration-retell-transit-closure",
    level: "B1",
    focus: "retell_event",
    integrationSlot: "b1_final_retell_event",
    title_en: "Retell a transit closure event",
    title_vi: "Kể lại việc tuyến giao thông bị đóng",
    learnerTask_en:
      "Retell why you arrived late after a station closure and replacement bus.",
    learnerTask_vi:
      "Kể lại vì sao bạn đến trễ sau khi nhà ga đóng và phải đi xe buýt thay thế.",
    canadaUseCase:
      "For Canadian transit, school, and workplace lateness explanations.",
    setupLines: [
      {
        pa: "ਸਟੇਸ਼ਨ ਅਚਾਨਕ ਬੰਦ ਹੋ ਗਿਆ ਸੀ।",
        romanization: "station achanak band ho giya si.",
        en: "The station closed suddenly.",
        vi: "Nhà ga bất ngờ đóng cửa.",
      },
      {
        pa: "ਫਿਰ ਮੈਂ ਸ਼ਟਲ ਬੱਸ ਲਈ।",
        romanization: "phir main shuttle bus lai.",
        en: "Then I took the shuttle bus.",
        vi: "Sau đó tôi đi xe buýt thay thế.",
      },
      {
        pa: "ਇਸ ਕਰਕੇ ਮੈਂ ਪੰਦਰਾਂ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਇਆ।",
        romanization: "is karke main pandran mint der nal aaya.",
        en: "Because of this, I arrived fifteen minutes late.",
        vi: "Vì vậy, tôi đến trễ mười lăm phút.",
      },
    ],
    finalEvidence: {
      prompt_en:
        "Retell the closure, replacement transport, and result in order.",
      prompt_vi:
        "Kể lại việc đóng cửa, phương tiện thay thế và kết quả theo thứ tự.",
      sampleResponse: {
        pa: "ਸਟੇਸ਼ਨ ਅਚਾਨਕ ਬੰਦ ਹੋ ਗਿਆ ਸੀ, ਫਿਰ ਮੈਂ ਸ਼ਟਲ ਬੱਸ ਲਈ। ਇਸ ਕਰਕੇ ਮੈਂ ਪੰਦਰਾਂ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਇਆ।",
        romanization:
          "station achanak band ho giya si, phir main shuttle bus lai. is karke main pandran mint der nal aaya.",
        en: "The station closed suddenly, then I took the shuttle bus. Because of this, I arrived fifteen minutes late.",
        vi: "Nhà ga bất ngờ đóng cửa, sau đó tôi đi xe buýt thay thế. Vì vậy, tôi đến trễ mười lăm phút.",
      },
      evidenceSignals_en: [
        "Uses past-event language",
        "Orders events with then or because",
        "Includes the practical result",
      ],
      evidenceSignals_vi: [
        "Dùng ngôn ngữ kể sự kiện quá khứ",
        "Sắp xếp sự kiện bằng sau đó hoặc vì vậy",
        "Nêu kết quả thực tế",
      ],
    },
    commonTraps: [
      {
        trap_en: "Skipping connectors and making the timeline unclear.",
        trap_vi: "Bỏ từ nối khiến dòng thời gian không rõ.",
        repair: {
          pa: "ਪਹਿਲਾਂ ਸਟੇਸ਼ਨ ਬੰਦ ਸੀ, ਫਿਰ ਮੈਂ ਬੱਸ ਲਈ।",
          romanization: "pahilan station band si, phir main bus lai.",
          en: "First the station was closed, then I took the bus.",
          vi: "Trước tiên nhà ga đóng cửa, sau đó tôi đi xe buýt.",
        },
      },
    ],
    finalQaNote_en:
      "Use as final evidence for sequencing, cause-result language, and concise retelling.",
    finalQaNote_vi:
      "Dùng làm bằng chứng cuối cho trình tự, ngôn ngữ nguyên nhân-kết quả và kể lại ngắn gọn.",
  },
  {
    id: "b1-integration-clarify-benefits-paperwork",
    level: "B1",
    focus: "clarify_next_steps",
    integrationSlot: "b1_final_clarify_next_steps",
    title_en: "Clarify paperwork next steps",
    title_vi: "Làm rõ các bước giấy tờ tiếp theo",
    learnerTask_en:
      "Ask which documents to bring, the deadline, and whether the answer can be sent by email. Language support only, not legal or financial advice.",
    learnerTask_vi:
      "Hỏi cần mang giấy tờ nào, hạn chót là khi nào và có thể gửi câu trả lời qua email không. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính.",
    canadaUseCase:
      "For Canadian service counters, settlement appointments, and benefits paperwork; language practice only.",
    setupLines: [
      {
        pa: "ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਸਪਸ਼ਟ ਨਹੀਂ ਹੈ।",
        romanization: "mainu agla kadam sapasht nahin hai.",
        en: "The next step is not clear to me.",
        vi: "Bước tiếp theo chưa rõ với tôi.",
      },
      {
        pa: "ਮੈਨੂੰ ਕਿਹੜੇ ਕਾਗਜ਼ ਲਿਆਉਣੇ ਹਨ?",
        romanization: "mainu kihre kagaz liaune han?",
        en: "Which papers do I need to bring?",
        vi: "Tôi cần mang giấy tờ nào?",
      },
      {
        pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin ih email kar sakde ho?",
        en: "Can you email this?",
        vi: "Bạn có thể gửi điều này qua email không?",
      },
    ],
    finalEvidence: {
      prompt_en:
        "Clarify documents, deadline, and email confirmation in a polite way.",
      prompt_vi:
        "Làm rõ giấy tờ, hạn chót và xác nhận qua email một cách lịch sự.",
      sampleResponse: {
        pa: "ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਸਪਸ਼ਟ ਨਹੀਂ ਹੈ। ਮੈਨੂੰ ਕਿਹੜੇ ਕਾਗਜ਼ ਲਿਆਉਣੇ ਹਨ, ਆਖਰੀ ਤਾਰੀਖ ਕਦੋਂ ਹੈ, ਅਤੇ ਕੀ ਤੁਸੀਂ ਇਹ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?",
        romanization:
          "mainu agla kadam sapasht nahin hai. mainu kihre kagaz liaune han, akhri tarikh kadon hai, ate ki tusin ih email kar sakde ho?",
        en: "The next step is not clear to me. Which papers do I need to bring, when is the deadline, and can you email this?",
        vi: "Bước tiếp theo chưa rõ với tôi. Tôi cần mang giấy tờ nào, hạn chót là khi nào, và bạn có thể gửi qua email không?",
      },
      evidenceSignals_en: [
        "Asks for documents",
        "Asks for deadline",
        "Requests written confirmation",
      ],
      evidenceSignals_vi: [
        "Hỏi về giấy tờ",
        "Hỏi hạn chót",
        "Yêu cầu xác nhận bằng văn bản",
      ],
    },
    commonTraps: [
      {
        trap_en: "Asking for advice instead of clarifying instructions.",
        trap_vi: "Hỏi lời khuyên thay vì làm rõ hướng dẫn.",
        repair: {
          pa: "ਮੈਂ ਸਿਰਫ਼ ਹੁਕਮ ਸਮਝਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
          romanization: "main sirf hukam samajhna chahunda han.",
          en: "I only want to understand the instructions.",
          vi: "Tôi chỉ muốn hiểu hướng dẫn.",
        },
      },
    ],
    finalQaNote_en:
      "Final-QA should confirm the sample stays within language support and does not provide legal or financial advice.",
    finalQaNote_vi:
      "Kiểm tra cuối cần xác nhận mẫu chỉ hỗ trợ ngôn ngữ và không đưa tư vấn pháp lý hoặc tài chính.",
  },
  {
    id: "b1-integration-service-internet-outage",
    level: "B1",
    focus: "service_conversation",
    integrationSlot: "b1_final_service_conversation",
    title_en: "Service conversation about internet outage",
    title_vi: "Hội thoại dịch vụ về mất internet",
    learnerTask_en:
      "Explain that home internet is not working, ask if there is an outage, and request a repair window.",
    learnerTask_vi:
      "Giải thích rằng internet ở nhà không hoạt động, hỏi có sự cố khu vực không và yêu cầu khung giờ sửa.",
    canadaUseCase:
      "For Canadian phone, internet, utility, and service-provider conversations.",
    setupLines: [
      {
        pa: "ਘਰ ਦਾ ਇੰਟਰਨੈੱਟ ਸਵੇਰੇ ਤੋਂ ਨਹੀਂ ਚੱਲ ਰਿਹਾ।",
        romanization: "ghar da internet savere ton nahin chall riha.",
        en: "The home internet has not been working since morning.",
        vi: "Internet ở nhà không hoạt động từ sáng.",
      },
      {
        pa: "ਕੀ ਸਾਡੇ ਇਲਾਕੇ ਵਿੱਚ ਆਊਟੇਜ ਹੈ?",
        romanization: "ki sade ilake vich outage hai?",
        en: "Is there an outage in our area?",
        vi: "Khu vực của chúng tôi có sự cố mất dịch vụ không?",
      },
      {
        pa: "ਟੈਕਨੀਸ਼ਨ ਕਦੋਂ ਆ ਸਕਦਾ ਹੈ?",
        romanization: "technician kadon aa sakda hai?",
        en: "When can a technician come?",
        vi: "Khi nào kỹ thuật viên có thể đến?",
      },
    ],
    finalEvidence: {
      prompt_en:
        "Call the provider, explain the outage, and ask for a repair window.",
      prompt_vi:
        "Gọi nhà cung cấp, giải thích sự cố và hỏi khung giờ sửa chữa.",
      sampleResponse: {
        pa: "ਘਰ ਦਾ ਇੰਟਰਨੈੱਟ ਸਵੇਰੇ ਤੋਂ ਨਹੀਂ ਚੱਲ ਰਿਹਾ। ਕੀ ਸਾਡੇ ਇਲਾਕੇ ਵਿੱਚ ਆਊਟੇਜ ਹੈ, ਅਤੇ ਟੈਕਨੀਸ਼ਨ ਕਦੋਂ ਆ ਸਕਦਾ ਹੈ?",
        romanization:
          "ghar da internet savere ton nahin chall riha. ki sade ilake vich outage hai, ate technician kadon aa sakda hai?",
        en: "The home internet has not been working since morning. Is there an outage in our area, and when can a technician come?",
        vi: "Internet ở nhà không hoạt động từ sáng. Khu vực của chúng tôi có sự cố không, và khi nào kỹ thuật viên có thể đến?",
      },
      evidenceSignals_en: [
        "Names the service problem",
        "Asks a diagnostic question",
        "Requests a repair time",
      ],
      evidenceSignals_vi: [
        "Nêu vấn đề dịch vụ",
        "Hỏi câu chẩn đoán",
        "Yêu cầu thời gian sửa",
      ],
    },
    commonTraps: [
      {
        trap_en: "Only saying it is broken without asking for an action.",
        trap_vi: "Chỉ nói bị hỏng mà không yêu cầu hành động.",
        repair: {
          pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਮੁਰੰਮਤ ਦਾ ਸਮਾਂ ਦੱਸੋ।",
          romanization: "kirpa karke mainu murammat da sama dasso.",
          en: "Please tell me the repair time.",
          vi: "Vui lòng cho tôi biết thời gian sửa chữa.",
        },
      },
    ],
    finalQaNote_en:
      "Integration sample supports service-dialog QA for problem, question, and requested next action.",
    finalQaNote_vi:
      "Mẫu tích hợp hỗ trợ kiểm tra hội thoại dịch vụ: vấn đề, câu hỏi và hành động tiếp theo.",
  },
  {
    id: "b1-integration-workplace-shift-conflict",
    level: "B1",
    focus: "workplace_issue",
    integrationSlot: "b1_final_workplace_issue",
    title_en: "Workplace schedule issue",
    title_vi: "Vấn đề lịch làm việc",
    learnerTask_en:
      "Tell a supervisor that two shifts overlap and ask which shift should be changed.",
    learnerTask_vi:
      "Nói với quản lý rằng hai ca làm bị trùng và hỏi ca nào nên đổi.",
    canadaUseCase:
      "For Canadian retail, food-service, warehouse, and office scheduling conversations.",
    setupLines: [
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
    finalEvidence: {
      prompt_en:
        "Report the overlapping shifts and ask for a clear schedule decision.",
      prompt_vi:
        "Báo cáo hai ca bị trùng và hỏi quyết định lịch làm rõ ràng.",
      sampleResponse: {
        pa: "ਮੇਰੀਆਂ ਦੋ ਸ਼ਿਫਟਾਂ ਇਕੋ ਸਮੇਂ ਹਨ, ਸ਼ਾਇਦ ਸ਼ਡਿਊਲ ਵਿੱਚ ਗਲਤੀ ਹੈ। ਕਿਹੜੀ ਸ਼ਿਫਟ ਬਦਲਣੀ ਚਾਹੀਦੀ ਹੈ?",
        romanization:
          "merian do shiftan iko same han, shayad schedule vich galti hai. kihri shift badalni chahidi hai?",
        en: "My two shifts are at the same time; maybe there is a mistake in the schedule. Which shift should be changed?",
        vi: "Hai ca làm của tôi cùng một thời gian; có lẽ lịch làm có lỗi. Ca nào nên được đổi?",
      },
      evidenceSignals_en: [
        "Reports the conflict",
        "Keeps tone neutral",
        "Asks for a decision",
      ],
      evidenceSignals_vi: [
        "Báo cáo xung đột",
        "Giữ giọng trung lập",
        "Hỏi quyết định",
      ],
    },
    commonTraps: [
      {
        trap_en: "Blaming the supervisor instead of neutrally describing the conflict.",
        trap_vi: "Đổ lỗi cho quản lý thay vì mô tả xung đột một cách trung lập.",
        repair: {
          pa: "ਸ਼ਾਇਦ ਸ਼ਡਿਊਲ ਵਿੱਚ ਗਲਤੀ ਹੈ।",
          romanization: "shayad schedule vich galti hai.",
          en: "Maybe there is a mistake in the schedule.",
          vi: "Có lẽ lịch làm có lỗi.",
        },
      },
    ],
    finalQaNote_en:
      "Use as final evidence for workplace issue reporting with a neutral register and actionable request.",
    finalQaNote_vi:
      "Dùng làm bằng chứng cuối cho báo cáo vấn đề nơi làm việc với giọng trung lập và yêu cầu có thể hành động.",
  },
  {
    id: "b1-integration-housing-heat",
    level: "B1",
    focus: "housing_issue",
    integrationSlot: "b1_final_housing_issue",
    title_en: "Housing heat issue",
    title_vi: "Vấn đề sưởi trong nhà ở",
    learnerTask_en:
      "Tell the building manager the heat is not working and ask when someone can check it.",
    learnerTask_vi:
      "Nói với quản lý tòa nhà rằng hệ thống sưởi không hoạt động và hỏi khi nào có người kiểm tra.",
    canadaUseCase:
      "For Canadian tenant and building-management conversations during cold weather.",
    setupLines: [
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
    finalEvidence: {
      prompt_en:
        "Explain the heating issue, describe the effect, and ask for inspection timing.",
      prompt_vi:
        "Giải thích vấn đề sưởi, mô tả ảnh hưởng và hỏi thời gian kiểm tra.",
      sampleResponse: {
        pa: "ਅਪਾਰਟਮੈਂਟ ਵਿੱਚ ਹੀਟ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ ਅਤੇ ਕਮਰਾ ਬਹੁਤ ਠੰਢਾ ਹੈ। ਕੋਈ ਇਸਨੂੰ ਕਦੋਂ ਚੈੱਕ ਕਰ ਸਕਦਾ ਹੈ?",
        romanization:
          "apartment vich heat kamm nahin kar rahi ate kamra bahut thandha hai. koi isnu kadon check kar sakda hai?",
        en: "The heat is not working in the apartment and the room is very cold. When can someone check it?",
        vi: "Hệ thống sưởi trong căn hộ không hoạt động và phòng rất lạnh. Khi nào có người kiểm tra được?",
      },
      evidenceSignals_en: [
        "Names the housing system",
        "Describes the effect",
        "Requests inspection timing",
      ],
      evidenceSignals_vi: [
        "Nêu hệ thống trong nhà",
        "Mô tả ảnh hưởng",
        "Yêu cầu thời gian kiểm tra",
      ],
    },
    commonTraps: [
      {
        trap_en: "Saying only cold without explaining the housing issue.",
        trap_vi: "Chỉ nói lạnh mà không giải thích vấn đề nhà ở.",
        repair: {
          pa: "ਹੀਟ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ, ਇਸ ਲਈ ਕਮਰਾ ਠੰਢਾ ਹੈ।",
          romanization: "heat kamm nahin kar rahi, is lai kamra thandha hai.",
          en: "The heat is not working, so the room is cold.",
          vi: "Hệ thống sưởi không hoạt động, nên phòng lạnh.",
        },
      },
    ],
    finalQaNote_en:
      "Final-QA can verify practical detail, cause-effect wording, and a clear repair follow-up.",
    finalQaNote_vi:
      "Kiểm tra cuối có thể xác minh chi tiết thực tế, cách nói nguyên nhân-kết quả và yêu cầu sửa rõ.",
  },
  {
    id: "b1-integration-school-community-registration",
    level: "B1",
    focus: "school_community_task",
    integrationSlot: "b1_final_school_community_task",
    title_en: "Community class registration",
    title_vi: "Đăng ký lớp cộng đồng",
    learnerTask_en:
      "Ask whether there is space in a community class and what you need to bring on the first day.",
    learnerTask_vi:
      "Hỏi lớp cộng đồng còn chỗ không và ngày đầu tiên cần mang gì.",
    canadaUseCase:
      "For Canadian libraries, schools, newcomer centres, and community recreation programs.",
    setupLines: [
      {
        pa: "ਕੀ ਇਸ ਕਲਾਸ ਵਿੱਚ ਜਗ੍ਹਾ ਹੈ?",
        romanization: "ki is class vich jagha hai?",
        en: "Is there space in this class?",
        vi: "Lớp này còn chỗ không?",
      },
      {
        pa: "ਮੈਂ ਅੱਜ ਰਜਿਸਟਰ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization: "main ajj register karna chahunda han.",
        en: "I want to register today.",
        vi: "Tôi muốn đăng ký hôm nay.",
      },
      {
        pa: "ਪਹਿਲੇ ਦਿਨ ਮੈਨੂੰ ਕੀ ਲਿਆਉਣਾ ਚਾਹੀਦਾ ਹੈ?",
        romanization: "pahile din mainu ki liauna chahida hai?",
        en: "What should I bring on the first day?",
        vi: "Ngày đầu tiên tôi nên mang gì?",
      },
    ],
    finalEvidence: {
      prompt_en:
        "Ask about space, registration, and first-day materials for a community class.",
      prompt_vi:
        "Hỏi về chỗ trống, đăng ký và đồ cần mang ngày đầu cho lớp cộng đồng.",
      sampleResponse: {
        pa: "ਕੀ ਇਸ ਕਲਾਸ ਵਿੱਚ ਜਗ੍ਹਾ ਹੈ? ਮੈਂ ਅੱਜ ਰਜਿਸਟਰ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ, ਅਤੇ ਪਹਿਲੇ ਦਿਨ ਮੈਨੂੰ ਕੀ ਲਿਆਉਣਾ ਚਾਹੀਦਾ ਹੈ?",
        romanization:
          "ki is class vich jagha hai? main ajj register karna chahunda han, ate pahile din mainu ki liauna chahida hai?",
        en: "Is there space in this class? I want to register today, and what should I bring on the first day?",
        vi: "Lớp này còn chỗ không? Tôi muốn đăng ký hôm nay, và ngày đầu tiên tôi nên mang gì?",
      },
      evidenceSignals_en: [
        "Asks about availability",
        "States registration intention",
        "Asks for first-day requirements",
      ],
      evidenceSignals_vi: [
        "Hỏi về chỗ trống",
        "Nêu ý định đăng ký",
        "Hỏi yêu cầu ngày đầu",
      ],
    },
    commonTraps: [
      {
        trap_en: "Asking only how much without confirming space or next steps.",
        trap_vi: "Chỉ hỏi giá mà không xác nhận chỗ trống hoặc bước tiếp theo.",
        repair: {
          pa: "ਕੀ ਜਗ੍ਹਾ ਹੈ, ਅਤੇ ਮੈਂ ਕਿਵੇਂ ਰਜਿਸਟਰ ਕਰਾਂ?",
          romanization: "ki jagha hai, ate main kiven register karan?",
          en: "Is there space, and how do I register?",
          vi: "Còn chỗ không, và tôi đăng ký như thế nào?",
        },
      },
    ],
    finalQaNote_en:
      "Integration sample is useful for school/community task QA with availability, action, and preparation.",
    finalQaNote_vi:
      "Mẫu tích hợp hữu ích cho kiểm tra việc trường/cộng đồng với chỗ trống, hành động và chuẩn bị.",
  },
  {
    id: "b1-integration-register-aware-library",
    level: "B1",
    focus: "register_aware_request",
    integrationSlot: "b1_final_register_aware_request",
    title_en: "Polite library request",
    title_vi: "Yêu cầu lịch sự ở thư viện",
    learnerTask_en:
      "Ask library staff to help renew a card using polite ਤੁਸੀਂ and ਜੀ.",
    learnerTask_vi:
      "Nhờ nhân viên thư viện giúp gia hạn thẻ bằng cách dùng ਤੁਸੀਂ và ਜੀ lịch sự.",
    canadaUseCase:
      "For Canadian libraries and service counters; Shahmukhi appears as script awareness only, not a full course.",
    setupLines: [
      {
        pa: "ਤੁਸੀਂ ਮੇਰਾ ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ ਰੀਨਿਊ ਕਰ ਸਕਦੇ ਹੋ ਜੀ?",
        romanization: "tusin mera library card renew kar sakde ho ji?",
        en: "Could you renew my library card, please?",
        vi: "Bạn có thể gia hạn thẻ thư viện giúp tôi không ạ?",
      },
      {
        pa: "ਮੇਰੇ ਕੋਲ ਪਹਿਚਾਣ ਪੱਤਰ ਹੈ।",
        romanization: "mere kol pahichan pattar hai.",
        en: "I have identification with me.",
        vi: "Tôi có giấy tờ tùy thân.",
      },
      {
        pa: "ਧੰਨਵਾਦ ਜੀ, ਮੈਂ ਉਡੀਕ ਕਰ ਸਕਦਾ ਹਾਂ।",
        romanization: "dhannvad ji, main udik kar sakda han.",
        en: "Thank you, I can wait.",
        vi: "Cảm ơn ạ, tôi có thể chờ.",
      },
    ],
    finalEvidence: {
      prompt_en:
        "Make a polite request to renew a card and mention that you have ID.",
      prompt_vi:
        "Đưa ra yêu cầu lịch sự để gia hạn thẻ và nói rằng bạn có giấy tờ tùy thân.",
      sampleResponse: {
        pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਤੁਸੀਂ ਮੇਰਾ ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ ਰੀਨਿਊ ਕਰ ਸਕਦੇ ਹੋ ਜੀ? ਮੇਰੇ ਕੋਲ ਪਹਿਚਾਣ ਪੱਤਰ ਹੈ।",
        romanization:
          "sat sri akal ji, tusin mera library card renew kar sakde ho ji? mere kol pahichan pattar hai.",
        en: "Hello, could you renew my library card, please? I have identification with me.",
        vi: "Xin chào ạ, bạn có thể gia hạn thẻ thư viện giúp tôi không ạ? Tôi có giấy tờ tùy thân.",
      },
      evidenceSignals_en: [
        "Uses polite register",
        "Names the requested action",
        "Adds required supporting detail",
      ],
      evidenceSignals_vi: [
        "Dùng mức lịch sự",
        "Nêu hành động được yêu cầu",
        "Thêm chi tiết hỗ trợ cần thiết",
      ],
    },
    commonTraps: [
      {
        trap_en: "Using a direct command when staff-facing language should be softer.",
        trap_vi: "Dùng mệnh lệnh trực tiếp khi nói với nhân viên nên mềm hơn.",
        repair: {
          pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੀ ਮਦਦ ਕਰ ਦਿਓ ਜੀ।",
          romanization: "kirpa karke meri madad kar dio ji.",
          en: "Please help me.",
          vi: "Vui lòng giúp tôi ạ.",
        },
      },
    ],
    finalQaNote_en:
      "Ready for final-QA and later wiring: Gurmukhi remains primary, Shahmukhi is awareness only, and Native review is deferred.",
    finalQaNote_vi:
      "Sẵn sàng cho kiểm tra cuối và kết nối sau: Gurmukhi vẫn là chính, Shahmukhi chỉ để nhận biết, và Native review is deferred.",
  },
];
