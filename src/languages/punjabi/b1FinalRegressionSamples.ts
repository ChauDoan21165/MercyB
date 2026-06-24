export type PunjabiB1FinalRegressionFocus =
  | "situation_explanation"
  | "event_retelling"
  | "clarification_strategy"
  | "service_recovery"
  | "issue_resolution"
  | "follow_up_message"
  | "workplace_task"
  | "housing_school_community"
  | "register_safe_repair";

export type PunjabiFinalRegressionLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiFinalRegressionTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiFinalRegressionLine;
};

export type PunjabiFinalRegressionPack = {
  finalRegressionPrompt_en: string;
  finalRegressionPrompt_vi: string;
  regressionLine: PunjabiFinalRegressionLine;
  regressionSignals_en: string[];
  regressionSignals_vi: string[];
};

export type PunjabiB1FinalRegressionCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1FinalRegressionFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  regressionPack: PunjabiFinalRegressionPack;
  commonTraps: PunjabiFinalRegressionTrap[];
  finalReadiness_en: string;
  finalReadiness_vi: string;
  integrationRoute_en: string;
  integrationRoute_vi: string;
};

export const punjabiB1FinalRegressionSamples: PunjabiB1FinalRegressionCard[] = [
  {
    id: "b1-regression-situation-explanation",
    level: "B1",
    focus: "situation_explanation",
    title_en: "Explain the situation again",
    title_vi: "Giải thích tình huống lại lần nữa",
    scenario_en:
      "You want a stable sample that explains the situation before moving into follow-up.",
    scenario_vi:
      "Bạn muốn một mẫu ổn định giải thích tình huống trước khi chuyển sang theo dõi.",
    canadaContext:
      "Useful for Canadian service counters, offices, and community intake desks.",
    regressionPack: {
      finalRegressionPrompt_en:
        "Keep the explanation short, factual, and easy to repeat.",
      finalRegressionPrompt_vi:
        "Giữ phần giải thích ngắn, dựa trên факт và dễ lặp lại.",
      regressionLine: {
        pa: "ਮੈਂ ਸਿਰਫ਼ ਇਹ ਦੱਸਣਾ ਚਾਹੁੰਦਾ ਹਾਂ ਕਿ ਕੀ ਹੋਇਆ ਸੀ।",
        romanization:
          "main sirf ih dassna chahunda han ki ki hoya si.",
        en: "I just want to explain what happened.",
        vi: "Tôi chỉ muốn giải thích điều đã xảy ra.",
      },
      regressionSignals_en: [
        "Names the event",
        "Stays factual",
        "Supports a clean repeat",
      ],
      regressionSignals_vi: [
        "Nêu sự việc",
        "Giữ факт",
        "Hỗ trợ lặp lại gọn",
      ],
    },
    commonTraps: [
      {
        trap_en: "Adding side details before the main point.",
        trap_vi: "Thêm chi tiết phụ trước điểm chính.",
        better: {
          pa: "ਪਹਿਲਾਂ ਮੁੱਖ ਗੱਲ, ਫਿਰ ਵੇਰਵੇ।",
          romanization: "pehlan mukh gall, phir vereve.",
          en: "Main point first, details after.",
          vi: "Nói ý chính trước, rồi đến chi tiết.",
        },
      },
    ],
    finalReadiness_en:
      "Language practice only, not medical advice. Language practice only, not legal or financial advice. Final regression is ready when the explanation stays short and consistent.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Mẫu hồi quy cuối sẵn sàng khi phần giải thích ngắn và nhất quán.",
    integrationRoute_en:
      "Route to B2 integrated packs if the explanation stays stable; otherwise review B1 explanation samples.",
    integrationRoute_vi:
      "Chuyển sang bộ tích hợp B2 nếu phần giải thích ổn định; nếu chưa thì xem lại mẫu giải thích B1.",
  },
  {
    id: "b1-regression-event-retelling",
    level: "B1",
    focus: "event_retelling",
    title_en: "Retell the event in sequence",
    title_vi: "Kể lại sự việc theo trình tự",
    scenario_en:
      "You need a sample that retells what happened from start to finish without confusion.",
    scenario_vi:
      "Bạn cần mẫu kể lại điều đã xảy ra từ đầu đến cuối mà không rối.",
    canadaContext:
      "Useful for Canadian school offices, service lines, and workplace incident reports.",
    regressionPack: {
      finalRegressionPrompt_en:
        "Retell the event in order and avoid jumping around.",
      finalRegressionPrompt_vi:
        "Kể lại sự việc theo thứ tự và tránh nhảy ý.",
      regressionLine: {
        pa: "ਪਹਿਲਾਂ ਇਹ ਹੋਇਆ, ਫਿਰ ਇਹ, ਅਤੇ ਅਖੀਰ ਵਿੱਚ ਇਹ।",
        romanization:
          "pehlan ih hoya, phir ih, ate akhri vich ih.",
        en: "First this happened, then this, and finally this.",
        vi: "Trước hết là việc này, rồi việc này, và cuối cùng là việc này.",
      },
      regressionSignals_en: [
        "Uses clear sequence",
        "Keeps events in order",
        "Ends cleanly",
      ],
      regressionSignals_vi: [
        "Dùng trình tự rõ",
        "Giữ sự việc theo thứ tự",
        "Kết thúc gọn",
      ],
    },
    commonTraps: [
      {
        trap_en: "Starting in the middle and confusing the listener.",
        trap_vi: "Bắt đầu ở giữa và làm người nghe rối.",
        better: {
          pa: "ਮੈਂ ਸ਼ੁਰੂ ਤੋਂ ਦੱਸਦਾ ਹਾਂ।",
          romanization: "main shuru ton dassda han.",
          en: "I will explain from the beginning.",
          vi: "Tôi sẽ giải thích từ đầu.",
        },
      },
    ],
    finalReadiness_en:
      "language practice only, not legal or financial advice. Shahmukhi is awareness only, not a full course. Final regression is ready when the retelling stays ordered and calm.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ. Mẫu hồi quy cuối sẵn sàng khi phần kể lại có thứ tự và bình tĩnh.",
    integrationRoute_en:
      "Route to B2 narrative repair tasks if the order stays stable.",
    integrationRoute_vi:
      "Chuyển sang nhiệm vụ sửa kể chuyện B2 nếu trình tự vẫn ổn định.",
  },
  {
    id: "b1-regression-clarification-strategy",
    level: "B1",
    focus: "clarification_strategy",
    title_en: "Use a clarification strategy",
    title_vi: "Dùng chiến lược làm rõ",
    scenario_en:
      "A fast instruction needs a repeatable clarification sample with written follow-up.",
    scenario_vi:
      "Một hướng dẫn nói nhanh cần mẫu làm rõ có thể lặp lại và theo dõi bằng văn bản.",
    canadaContext:
      "Useful for Canadian clinics, schools, offices, and settlement calls.",
    regressionPack: {
      finalRegressionPrompt_en:
        "Ask for repetition, confirm the details, and request written follow-up.",
      finalRegressionPrompt_vi:
        "Xin nhắc lại, xác nhận chi tiết và yêu cầu theo dõi bằng văn bản.",
      regressionLine: {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਬਾਰਾ ਕਹੋ। ਕੀ ਤੁਸੀਂ ਈਮੇਲ ਵਿੱਚ ਪੁਸ਼ਟੀ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization:
          "kirpa karke hauli dubara kaho. ki tusin email vich pushti bhej sakde ho?",
        en: "Please say it again slowly. Can you send confirmation by email?",
        vi: "Vui lòng nói lại chậm hơn. Bạn có thể gửi xác nhận qua email không?",
      },
      regressionSignals_en: [
        "Requests repetition",
        "Confirms details",
        "Asks for written follow-up",
      ],
      regressionSignals_vi: [
        "Xin nhắc lại",
        "Xác nhận chi tiết",
        "Hỏi theo dõi bằng văn bản",
      ],
    },
    commonTraps: [
      {
        trap_en: "Pretending to understand numbers and dates.",
        trap_vi: "Giả vờ hiểu số và ngày tháng.",
        better: {
          pa: "ਮਿਤੀ ਅਤੇ ਸਮਾਂ ਫਿਰ ਦੱਸੋ ਜੀ।",
          romanization: "miti ate sama phir dasso ji.",
          en: "Please tell me the date and time again.",
          vi: "Vui lòng cho tôi biết lại ngày và giờ.",
        },
      },
    ],
    finalReadiness_en:
      "Language practice only, not medical advice. Final regression is ready when the clarification stays precise and repeatable.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Mẫu hồi quy cuối sẵn sàng khi phần làm rõ chính xác và lặp lại được.",
    integrationRoute_en:
      "Route to B2 clarification and support calls if the details stay stable.",
    integrationRoute_vi:
      "Chuyển sang làm rõ và cuộc gọi hỗ trợ B2 nếu chi tiết vẫn ổn định.",
  },
  {
    id: "b1-regression-service-recovery",
    level: "B1",
    focus: "service_recovery",
    title_en: "Recover a service conversation",
    title_vi: "Phục hồi một cuộc trò chuyện dịch vụ",
    scenario_en:
      "A service call became confusing and you need a stable recovery sample.",
    scenario_vi:
      "Cuộc gọi dịch vụ bị rối và bạn cần mẫu phục hồi ổn định.",
    canadaContext:
      "Useful for Canadian service desks, billing lines, and support chats.",
    regressionPack: {
      finalRegressionPrompt_en:
        "Keep the same facts, the same request, and the same polite tone.",
      finalRegressionPrompt_vi:
        "Giữ cùng thông tin, cùng yêu cầu và cùng giọng lịch sự.",
      regressionLine: {
        pa: "ਮੈਂ ਆਪਣੀ ਬੇਨਤੀ ਨਹੀਂ ਬਦਲ ਰਿਹਾ। ਮੈਂ ਸਿਰਫ਼ ਇਸਨੂੰ ਸਾਫ਼ ਕਰ ਰਿਹਾ ਹਾਂ।",
        romanization:
          "main apni benti nahin badal riha. main sirf isnu saf kar riha han.",
        en: "I am not changing my request. I am only clarifying it.",
        vi: "Tôi không đổi yêu cầu của mình. Tôi chỉ đang làm rõ nó.",
      },
      regressionSignals_en: [
        "Keeps the request stable",
        "Explains the correction",
        "Avoids escalation",
      ],
      regressionSignals_vi: [
        "Giữ yêu cầu ổn định",
        "Giải thích phần sửa",
        "Tránh leo thang",
      ],
    },
    commonTraps: [
      {
        trap_en: "Changing details every time the conversation resets.",
        trap_vi: "Đổi chi tiết mỗi lần cuộc trò chuyện được đặt lại.",
        better: {
          pa: "ਮੈਂ ਉਹੀ ਗੱਲ ਮੁੜ ਸਪਸ਼ਟ ਕਰ ਰਿਹਾ ਹਾਂ।",
          romanization: "main ohi gall mudh spasht kar riha han.",
          en: "I am clarifying the same point again.",
          vi: "Tôi đang làm rõ lại cùng một điểm.",
        },
      },
    ],
    finalReadiness_en:
      "language practice only, not medical advice. Native review is deferred. Final regression is ready when the recovery stays stable and repeatable.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Đánh giá bản ngữ được hoãn lại. Mẫu hồi quy cuối sẵn sàng khi phần phục hồi ổn định và lặp lại được.",
    integrationRoute_en:
      "Route to B2 service problem-solving if the recovery remains stable.",
    integrationRoute_vi:
      "Chuyển sang giải quyết vấn đề dịch vụ B2 nếu phần phục hồi vẫn ổn định.",
  },
  {
    id: "b1-regression-issue-resolution",
    level: "B1",
    focus: "issue_resolution",
    title_en: "Resolve an issue cleanly",
    title_vi: "Giải quyết vấn đề gọn gàng",
    scenario_en:
      "You need a sample that links the issue, the correction, and the next step.",
    scenario_vi:
      "Bạn cần mẫu nối vấn đề, phần sửa và bước tiếp theo.",
    canadaContext:
      "Useful for Canadian billing desks, office support, and community services.",
    regressionPack: {
      finalRegressionPrompt_en:
        "Keep facts, correction, and next step together.",
      finalRegressionPrompt_vi:
        "Giữ तथ्य, phần sửa và bước tiếp theo đi cùng nhau.",
      regressionLine: {
        pa: "ਮੈਨੂੰ ਮੁੱਦਾ, ਸੁਧਾਰ, ਅਤੇ ਅਗਲਾ ਕਦਮ ਇਕੱਠੇ ਚਾਹੀਦੇ ਹਨ।",
        romanization:
          "mainu mudda, sudhar, ate agla kadam ikathe chahide han.",
        en: "I need the issue, the correction, and the next step together.",
        vi: "Tôi cần vấn đề, phần sửa và bước tiếp theo đi cùng nhau.",
      },
      regressionSignals_en: [
        "Links issue and correction",
        "Keeps a practical order",
        "Supports a final check",
      ],
      regressionSignals_vi: [
        "Nối vấn đề với phần sửa",
        "Giữ thứ tự thực tế",
        "Hỗ trợ kiểm tra cuối",
      ],
    },
    commonTraps: [
      {
        trap_en: "Asking for a fix but not checking whether it worked.",
        trap_vi: "Yêu cầu sửa nhưng không kiểm tra xem đã hiệu quả chưa.",
        better: {
          pa: "ਕੀ ਸੁਧਾਰ ਹੋ ਗਿਆ ਹੈ, ਜਾਂ ਮੈਨੂੰ ਮੁੜ ਪੁੱਛਣਾ ਚਾਹੀਦਾ ਹੈ?",
          romanization:
            "ki sudhar ho gia hai, ja mainu mudh puchhna chahida hai?",
          en: "Has the correction happened, or should I ask again?",
          vi: "Phần sửa đã xong chưa, hay tôi nên hỏi lại?",
        },
      },
    ],
    finalReadiness_en:
      "Language practice only, not legal or financial advice. Final regression is ready when the issue-resolution path is compact and checkable.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Mẫu hồi quy cuối sẵn sàng khi lộ trình giải quyết vấn đề ngắn gọn và có thể kiểm tra.",
    integrationRoute_en:
      "Route to B2 issue-resolution and complaint handling tasks when the correction is stable.",
    integrationRoute_vi:
      "Chuyển sang nhiệm vụ giải quyết vấn đề và xử lý khiếu nại B2 khi phần sửa ổn định.",
  },
  {
    id: "b1-regression-follow-up-message",
    level: "B1",
    focus: "follow_up_message",
    title_en: "Send a follow-up message",
    title_vi: "Gửi tin nhắn theo dõi",
    scenario_en:
      "You need a stable email or text sample that follows up on the earlier request.",
    scenario_vi:
      "Bạn cần mẫu email hoặc tin nhắn ổn định để theo dõi yêu cầu trước đó.",
    canadaContext:
      "Useful for Canadian office emails, landlord portals, and appointment reminders.",
    regressionPack: {
      finalRegressionPrompt_en:
        "Mention the earlier request and ask for one clear update.",
      finalRegressionPrompt_vi:
        "Nhắc yêu cầu trước và hỏi một cập nhật rõ ràng.",
      regressionLine: {
        pa: "ਮੈਂ ਆਪਣੀ ਪਿਛਲੀ ਬੇਨਤੀ ਬਾਰੇ ਇੱਕ ਛੋਟਾ ਅਪਡੇਟ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization:
          "main apni pichhli benti bare ik chota update chahunda han.",
        en: "I would like a short update about my previous request.",
        vi: "Tôi muốn một cập nhật ngắn về yêu cầu trước đó.",
      },
      regressionSignals_en: [
        "Refers to the earlier request",
        "Stays brief",
        "Asks for one update",
      ],
      regressionSignals_vi: [
        "Nhắc yêu cầu trước",
        "Giữ ngắn",
        "Hỏi một cập nhật",
      ],
    },
    commonTraps: [
      {
        trap_en: "Writing a brand-new message instead of following up.",
        trap_vi: "Viết tin nhắn mới hoàn toàn thay vì theo dõi.",
        better: {
          pa: "ਮੈਂ ਪੁਰਾਣੀ ਬੇਨਤੀ ਦੇ ਬਾਰੇ ਪੁੱਛ ਰਿਹਾ ਹਾਂ।",
          romanization: "main purani benti de bare puchh riha han.",
          en: "I am asking about the earlier request.",
          vi: "Tôi đang hỏi về yêu cầu trước đó.",
        },
      },
    ],
    finalReadiness_en:
      "language practice only, not legal or financial advice. Final regression is ready when the follow-up remains consistent and polite.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Mẫu hồi quy cuối sẵn sàng khi phần theo dõi nhất quán và lịch sự.",
    integrationRoute_en:
      "Route to B2 follow-up routing if the message stays stable.",
    integrationRoute_vi:
      "Chuyển sang định tuyến theo dõi B2 nếu tin nhắn giữ được tính ổn định.",
  },
  {
    id: "b1-regression-workplace-task",
    level: "B1",
    focus: "workplace_task",
    title_en: "Handle a workplace task clearly",
    title_vi: "Xử lý nhiệm vụ nơi làm việc rõ ràng",
    scenario_en:
      "You need a sample for work instructions, shift updates, and polite clarification.",
    scenario_vi:
      "Bạn cần mẫu cho hướng dẫn công việc, cập nhật ca làm và làm rõ lịch sự.",
    canadaContext:
      "Useful for Canadian retail, warehouse, hospitality, and office shifts.",
    regressionPack: {
      finalRegressionPrompt_en:
        "Keep the task, time, and responsibility aligned.",
      finalRegressionPrompt_vi:
        "Giữ nhiệm vụ, thời gian và trách nhiệm khớp nhau.",
      regressionLine: {
        pa: "ਮੈਨੂੰ ਕੰਮ, ਸਮਾਂ, ਅਤੇ ਜ਼ਿੰਮੇਵਾਰੀ ਸਪਸ਼ਟ ਚਾਹੀਦੀ ਹੈ।",
        romanization:
          "mainu kamm, sama, ate zimmedari spasht chahidi hai.",
        en: "I need the task, time, and responsibility to be clear.",
        vi: "Tôi cần nhiệm vụ, thời gian và trách nhiệm thật rõ.",
      },
      regressionSignals_en: [
        "Names the task",
        "Confirms the time",
        "Clarifies responsibility",
      ],
      regressionSignals_vi: [
        "Nêu nhiệm vụ",
        "Xác nhận thời gian",
        "Làm rõ trách nhiệm",
      ],
    },
    commonTraps: [
      {
        trap_en: "Changing the task description after the reply.",
        trap_vi: "Đổi mô tả nhiệm vụ sau khi có phản hồi.",
        better: {
          pa: "ਮੈਂ ਉਹੀ ਕੰਮ ਮੁੜ ਸਪਸ਼ਟ ਕਰ ਰਿਹਾ ਹਾਂ।",
          romanization: "main ohi kamm mudh spasht kar riha han.",
          en: "I am clarifying the same task again.",
          vi: "Tôi đang làm rõ lại cùng một nhiệm vụ.",
        },
      },
    ],
    finalReadiness_en:
      "Language practice only, not legal or financial advice. Final regression is ready when the workplace task stays stable and easy to verify.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Mẫu hồi quy cuối sẵn sàng khi nhiệm vụ nơi làm việc ổn định và dễ xác minh.",
    integrationRoute_en:
      "Route to B2 workplace update and shift-management tasks when the task flow is stable.",
    integrationRoute_vi:
      "Chuyển sang nhiệm vụ cập nhật nơi làm việc và quản lý ca B2 khi luồng việc ổn định.",
  },
  {
    id: "b1-regression-housing-school-community",
    level: "B1",
    focus: "housing_school_community",
    title_en: "Cover housing, school, and community follow-up",
    title_vi: "Bao phủ theo dõi nhà ở, trường học và cộng đồng",
    scenario_en:
      "You want one regression sample that works for housing, school, and community follow-up messages.",
    scenario_vi:
      "Bạn muốn một mẫu hồi quy dùng được cho tin nhắn theo dõi nhà ở, trường học và cộng đồng.",
    canadaContext:
      "Useful for Canadian rental offices, school offices, community centres, and newcomer programs.",
    regressionPack: {
      finalRegressionPrompt_en:
        "Keep the earlier request, the update, and the polite boundary together.",
      finalRegressionPrompt_vi:
        "Giữ yêu cầu trước, cập nhật và ranh giới lịch sự cùng nhau.",
      regressionLine: {
        pa: "ਮੈਂ ਆਪਣੀ ਪਿਛਲੀ ਬੇਨਤੀ ਨੂੰ ਸਪਸ਼ਟ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization:
          "main apni pichhli benti nu spasht karna chahunda han.",
        en: "I want to clarify my previous request.",
        vi: "Tôi muốn làm rõ yêu cầu trước đó.",
      },
      regressionSignals_en: [
        "Refers back to the earlier request",
        "Keeps the ask simple",
        "Supports follow-through",
      ],
      regressionSignals_vi: [
        "Nhắc yêu cầu trước",
        "Giữ yêu cầu đơn giản",
        "Hỗ trợ theo dõi đến cùng",
      ],
    },
    commonTraps: [
      {
        trap_en: "Making the message longer than the task needs.",
        trap_vi: "Làm tin nhắn dài hơn mức nhiệm vụ cần.",
        better: {
          pa: "ਛੋਟੀ ਗੱਲ ਬਿਹਤਰ ਹੈ।",
          romanization: "choti gall behatar hai.",
          en: "Short is better.",
          vi: "Ngắn là tốt hơn.",
        },
      },
    ],
    finalReadiness_en:
      "language practice only, not legal or financial advice. Native review is deferred. Final regression is ready when the message stays short, factual, and polite.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Đánh giá bản ngữ được hoãn lại. Mẫu hồi quy cuối sẵn sàng khi tin nhắn ngắn, факт và lịch sự.",
    integrationRoute_en:
      "Route to B2 school/community participation tasks if the request remains aligned.",
    integrationRoute_vi:
      "Chuyển sang nhiệm vụ tham gia trường học/cộng đồng B2 nếu yêu cầu vẫn khớp.",
  },
  {
    id: "b1-regression-register-safe-repair",
    level: "B1",
    focus: "register_safe_repair",
    title_en: "Use register-safe repair",
    title_vi: "Dùng cách sửa an toàn về sắc thái",
    scenario_en:
      "You need a sample that softens the message without losing meaning or the next step.",
    scenario_vi:
      "Bạn cần mẫu làm mềm thông điệp mà không mất ý nghĩa hoặc bước tiếp theo.",
    canadaContext:
      "Useful for Canadian service, workplace, and housing conversations that need a polite reset.",
    regressionPack: {
      finalRegressionPrompt_en:
        "Keep the meaning and soften the tone in the same line.",
      finalRegressionPrompt_vi:
        "Giữ ý nghĩa và làm mềm giọng trong cùng một câu.",
      regressionLine: {
        pa: "ਮੈਂ ਇਹ ਗੱਲ ਹੋਰ ਨਰਮ ਅਤੇ ਹੋਰ ਸਪਸ਼ਟ ਤਰੀਕੇ ਨਾਲ ਕਹਿਣੀ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization:
          "main eh gall hor narm ate hor spasht tarike nal kahini chahunda han.",
        en: "I want to say this more softly and more clearly.",
        vi: "Tôi muốn nói điều này mềm hơn và rõ hơn.",
      },
      regressionSignals_en: [
        "Softens the tone",
        "Keeps the meaning",
        "Signals a polite reset",
      ],
      regressionSignals_vi: [
        "Làm mềm giọng",
        "Giữ ý nghĩa",
        "Báo hiệu đặt lại lịch sự",
      ],
    },
    commonTraps: [
      {
        trap_en: "Over-apologizing until the request disappears.",
        trap_vi: "Xin lỗi quá nhiều đến mức yêu cầu biến mất.",
        better: {
          pa: "ਮੈਂ ਬੇਨਤੀ ਨੂੰ ਹੋਰ ਨਰਮ ਤਰੀਕੇ ਨਾਲ ਕਹਿ ਰਿਹਾ ਹਾਂ।",
          romanization:
            "main benti nu hor narm tarike nal kahi riha han.",
          en: "I am saying the request in a softer way.",
          vi: "Tôi đang nói yêu cầu theo cách mềm hơn.",
        },
      },
    ],
    finalReadiness_en:
      "Language practice only, not legal or financial advice. Shahmukhi is awareness only, not a full course. Final regression is ready when the repair is polite, stable, and reusable.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ. Mẫu hồi quy cuối sẵn sàng khi phần sửa lịch sự, ổn định và tái dùng được.",
    integrationRoute_en:
      "Route to B2 register-shift and repair tasks when the softened message stays clear.",
    integrationRoute_vi:
      "Chuyển sang nhiệm vụ chuyển sắc thái và sửa B2 khi thông điệp mềm hơn vẫn rõ.",
  },
];
