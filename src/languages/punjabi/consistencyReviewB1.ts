export type PunjabiB1ConsistencyReviewFocus =
  | "explain_situation"
  | "retell_event"
  | "service_recovery"
  | "follow_up_message"
  | "workplace_conversation"
  | "housing_conversation"
  | "school_community_conversation"
  | "register_safe_repair"
  | "consistency_review";

export type PunjabiConsistencyReviewLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiConsistencyReviewTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiConsistencyReviewLine;
};

export type PunjabiConsistencyReviewPack = {
  finalGuardrailPrompt_en: string;
  finalGuardrailPrompt_vi: string;
  consistencyLine: PunjabiConsistencyReviewLine;
  consistencySignals_en: string[];
  consistencySignals_vi: string[];
};

export type PunjabiB1ConsistencyReviewCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1ConsistencyReviewFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  consistencyPack: PunjabiConsistencyReviewPack;
  commonTraps: PunjabiConsistencyReviewTrap[];
  integrationReadiness_en: string;
  integrationReadiness_vi: string;
  finalQuality_en: string;
  finalQuality_vi: string;
};

export const punjabiB1ConsistencyReview: PunjabiB1ConsistencyReviewCard[] = [
  {
    id: "b1-consistency-explain-situation",
    level: "B1",
    focus: "explain_situation",
    title_en: "Explain the situation clearly",
    title_vi: "Giải thích tình huống rõ ràng",
    scenario_en:
      "You need to explain what happened in a short, clear way before the conversation moves on.",
    scenario_vi:
      "Bạn cần giải thích điều đã xảy ra theo cách ngắn gọn, rõ ràng trước khi cuộc trò chuyện đi tiếp.",
    canadaContext:
      "Useful for Canadian service counters, offices, and community intake desks.",
    consistencyPack: {
      finalGuardrailPrompt_en:
        "Keep the explanation short, factual, and easy to repeat.",
      finalGuardrailPrompt_vi:
        "Giữ phần giải thích ngắn, dựa trên thông tin và dễ lặp lại.",
      consistencyLine: {
        pa: "ਮੈਂ ਸਿਰਫ਼ ਇਹ ਦੱਸਣਾ ਚਾਹੁੰਦਾ ਹਾਂ ਕਿ ਕੀ ਹੋਇਆ ਸੀ।",
        romanization:
          "main sirf ih dassna chahunda han ki ki hoya si.",
        en: "I just want to explain what happened.",
        vi: "Tôi chỉ muốn giải thích điều đã xảy ra.",
      },
      consistencySignals_en: [
        "Explains the event",
        "Keeps the sequence clear",
        "Stays repeatable",
      ],
      consistencySignals_vi: [
        "Giải thích sự việc",
        "Giữ trình tự rõ",
        "Dễ lặp lại",
      ],
    },
    commonTraps: [
      {
        trap_en: "Adding too many side details before the main point.",
        trap_vi: "Thêm quá nhiều chi tiết phụ trước điểm chính.",
        better: {
          pa: "ਪਹਿਲਾਂ ਮੁੱਖ ਗੱਲ, ਫਿਰ ਵੇਰਵੇ।",
          romanization: "pehlan mukh gall, phir vereve.",
          en: "Main point first, details after.",
          vi: "Nói ý chính trước, rồi đến chi tiết.",
        },
      },
    ],
    integrationReadiness_en:
      "Language practice only, not medical advice. Language practice only, not legal or financial advice. Ready for integration-readiness checks when the explanation stays short and consistent.",
    integrationReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Sẵn sàng cho kiểm tra tích hợp khi phần giải thích ngắn và nhất quán.",
    finalQuality_en:
      "Final quality checks consistency, boundary safety, Gurmukhi-first output, and review-ready wording.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh tính nhất quán, an toàn ranh giới, đầu ra Gurmukhi là chính và cách nói sẵn sàng review.",
  },
  {
    id: "b1-consistency-retell-event",
    level: "B1",
    focus: "retell_event",
    title_en: "Retell the event in order",
    title_vi: "Kể lại sự việc theo thứ tự",
    scenario_en:
      "A listener asks you to retell what happened from start to finish without confusion.",
    scenario_vi:
      "Người nghe muốn bạn kể lại điều đã xảy ra từ đầu đến cuối mà không rối.",
    canadaContext:
      "Useful for Canadian school offices, service lines, and workplace incident reports.",
    consistencyPack: {
      finalGuardrailPrompt_en:
        "Retell the event in order and avoid jumping around.",
      finalGuardrailPrompt_vi:
        "Kể lại sự việc theo thứ tự và tránh nhảy ý.",
      consistencyLine: {
        pa: "ਪਹਿਲਾਂ ਇਹ ਹੋਇਆ, ਫਿਰ ਇਹ, ਅਤੇ ਅਖੀਰ ਵਿੱਚ ਇਹ।",
        romanization:
          "pehlan ih hoya, phir ih, ate akhri vich ih.",
        en: "First this happened, then this, and finally this.",
        vi: "Trước hết là việc này, rồi việc này, và cuối cùng là việc này.",
      },
      consistencySignals_en: [
        "Uses clear sequence",
        "Keeps events in order",
        "Ends cleanly",
      ],
      consistencySignals_vi: [
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
    integrationReadiness_en:
      "language practice only, not legal or financial advice. Shahmukhi is awareness only, not a full course. Ready for integration-readiness checks when the retelling stays ordered and calm.",
    integrationReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ. Sẵn sàng cho kiểm tra tích hợp khi phần kể lại có thứ tự và bình tĩnh.",
    finalQuality_en:
      "Final quality checks event order, consistency, register safety, and Gurmukhi-first output.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh thứ tự sự việc, tính nhất quán, an toàn sắc thái và đầu ra Gurmukhi là chính.",
  },
  {
    id: "b1-consistency-service-recovery",
    level: "B1",
    focus: "service_recovery",
    title_en: "Recover a service conversation consistently",
    title_vi: "Phục hồi hội thoại dịch vụ một cách nhất quán",
    scenario_en:
      "A service call became confusing and you need to recover the thread without changing your story.",
    scenario_vi:
      "Cuộc gọi dịch vụ trở nên rối và bạn cần phục hồi mạch mà không đổi câu chuyện.",
    canadaContext:
      "Useful for Canadian service desks, billing lines, and support chats.",
    consistencyPack: {
      finalGuardrailPrompt_en:
        "Keep the same facts, the same request, and the same polite tone.",
      finalGuardrailPrompt_vi:
        "Giữ cùng thông tin, cùng yêu cầu và cùng giọng lịch sự.",
      consistencyLine: {
        pa: "ਮੈਂ ਆਪਣੀ ਬੇਨਤੀ ਨਹੀਂ ਬਦਲ ਰਿਹਾ। ਮੈਂ ਸਿਰਫ਼ ਇਸਨੂੰ ਸਾਫ਼ ਕਰ ਰਿਹਾ ਹਾਂ।",
        romanization:
          "main apni benti nahin badal riha. main sirf isnu saf kar riha han.",
        en: "I am not changing my request. I am only clarifying it.",
        vi: "Tôi không đổi yêu cầu của mình. Tôi chỉ đang làm rõ nó.",
      },
      consistencySignals_en: [
        "Keeps the request stable",
        "Explains the correction",
        "Avoids escalation",
      ],
      consistencySignals_vi: [
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
    integrationReadiness_en:
      "Language practice only, not medical advice. Native review is deferred. Ready for integration-readiness checks when the service recovery stays stable and repeatable.",
    integrationReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Đánh giá bản ngữ được hoãn lại. Sẵn sàng cho kiểm tra tích hợp khi phần phục hồi dịch vụ ổn định và lặp lại được.",
    finalQuality_en:
      "Final quality checks service recovery, consistency, boundary awareness, and checklist discipline.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh phục hồi dịch vụ, tính nhất quán, nhận biết ranh giới và kỷ luật danh sách.",
  },
  {
    id: "b1-consistency-follow-up-message",
    level: "B1",
    focus: "follow_up_message",
    title_en: "Send a consistent follow-up message",
    title_vi: "Gửi tin nhắn theo dõi nhất quán",
    scenario_en:
      "You need to follow up by text or email and keep the message aligned with the earlier request.",
    scenario_vi:
      "Bạn cần theo dõi bằng tin nhắn hoặc email và giữ nội dung khớp với yêu cầu trước đó.",
    canadaContext:
      "Useful for Canadian office emails, landlord portals, and appointment reminders.",
    consistencyPack: {
      finalGuardrailPrompt_en:
        "Mention the earlier request and ask for one clear update.",
      finalGuardrailPrompt_vi:
        "Nhắc yêu cầu trước và hỏi một cập nhật rõ ràng.",
      consistencyLine: {
        pa: "ਮੈਂ ਆਪਣੀ ਪਿਛਲੀ ਬੇਨਤੀ ਬਾਰੇ ਇੱਕ ਛੋਟਾ ਅਪਡੇਟ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization:
          "main apni pichhli benti bare ik chota update chahunda han.",
        en: "I would like a short update about my previous request.",
        vi: "Tôi muốn một cập nhật ngắn về yêu cầu trước đó.",
      },
      consistencySignals_en: [
        "Refers to the earlier message",
        "Stays short",
        "Asks for one update",
      ],
      consistencySignals_vi: [
        "Nhắc tin nhắn trước",
        "Giữ ngắn",
        "Hỏi một cập nhật",
      ],
    },
    commonTraps: [
      {
        trap_en: "Sending a new request instead of following up on the old one.",
        trap_vi: "Gửi yêu cầu mới thay vì theo dõi yêu cầu cũ.",
        better: {
          pa: "ਮੈਂ ਪੁਰਾਣੀ ਬੇਨਤੀ ਦੇ ਬਾਰੇ ਪੁੱਛ ਰਿਹਾ ਹਾਂ।",
          romanization: "main purani benti de bare puchh riha han.",
          en: "I am asking about the earlier request.",
          vi: "Tôi đang hỏi về yêu cầu trước đó.",
        },
      },
    ],
    integrationReadiness_en:
      "language practice only, not legal or financial advice. Ready for integration-readiness checks when the follow-up remains consistent and respectful.",
    integrationReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Sẵn sàng cho kiểm tra tích hợp khi phần theo dõi nhất quán và tôn trọng.",
    finalQuality_en:
      "Final quality checks follow-up consistency, reminder safety, and Gurmukhi-first output.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh tính nhất quán khi theo dõi, an toàn khi nhắc lại và đầu ra Gurmukhi là chính.",
  },
  {
    id: "b1-consistency-workplace-conversation",
    level: "B1",
    focus: "workplace_conversation",
    title_en: "Keep a workplace conversation consistent",
    title_vi: "Giữ cuộc trò chuyện nơi làm việc nhất quán",
    scenario_en:
      "A shift or task discussion needs a clear and stable explanation that does not change halfway through.",
    scenario_vi:
      "Cuộc thảo luận về ca làm hoặc nhiệm vụ cần lời giải thích rõ và ổn định, không đổi giữa chừng.",
    canadaContext:
      "Useful for Canadian retail, warehouse, and office shift conversations.",
    consistencyPack: {
      finalGuardrailPrompt_en:
        "Repeat the task, the time, and the responsibility in the same order.",
      finalGuardrailPrompt_vi:
        "Lặp lại nhiệm vụ, thời gian và trách nhiệm theo cùng một thứ tự.",
      consistencyLine: {
        pa: "ਕੰਮ, ਸਮਾਂ, ਅਤੇ ਜ਼ਿੰਮੇਵਾਰੀ—ਇਹੀ ਤਿੰਨ ਗੱਲਾਂ ਹਨ।",
        romanization:
          "kamm, sama, ate zimmedari—ihi tin gallan han.",
        en: "Task, time, and responsibility are the three points.",
        vi: "Nhiệm vụ, thời gian và trách nhiệm là ba điểm.",
      },
      consistencySignals_en: [
        "Names the three points",
        "Keeps the order stable",
        "Supports a work handoff",
      ],
      consistencySignals_vi: [
        "Nêu ba điểm",
        "Giữ thứ tự ổn định",
        "Hỗ trợ bàn giao công việc",
      ],
    },
    commonTraps: [
      {
        trap_en: "Rephrasing the task so much that the handoff becomes unclear.",
        trap_vi: "Diễn đạt lại nhiệm vụ quá nhiều đến mức bàn giao không rõ.",
        better: {
          pa: "ਮੈਂ ਓਹੀ ਕੰਮ ਮੁੜ ਸਪਸ਼ਟ ਕਰ ਰਿਹਾ ਹਾਂ।",
          romanization: "main ohi kamm mudh spasht kar riha han.",
          en: "I am clarifying the same task again.",
          vi: "Tôi đang làm rõ lại cùng một nhiệm vụ.",
        },
      },
    ],
    integrationReadiness_en:
      "Language practice only, not medical advice. Language practice only, not legal or financial advice. Ready for integration-readiness checks when the work conversation stays stable and easy to verify.",
    integrationReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Sẵn sàng cho kiểm tra tích hợp khi cuộc trò chuyện nơi làm việc ổn định và dễ xác minh.",
    finalQuality_en:
      "Final quality checks workplace consistency, boundary safety, and reviewable wording.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh tính nhất quán ở nơi làm việc, an toàn ranh giới và cách nói có thể rà soát.",
  },
  {
    id: "b1-consistency-housing-conversation",
    level: "B1",
    focus: "housing_conversation",
    title_en: "Keep a housing conversation consistent",
    title_vi: "Giữ cuộc trò chuyện về nhà ở nhất quán",
    scenario_en:
      "A repair or landlord follow-up needs the same facts repeated calmly and clearly.",
    scenario_vi:
      "Theo dõi với chủ nhà hoặc việc sửa chữa cần lặp lại cùng thông tin một cách bình tĩnh và rõ ràng.",
    canadaContext:
      "Useful for Canadian rental offices, tenant support, and building management.",
    consistencyPack: {
      finalGuardrailPrompt_en:
        "Keep the repair fact, the timing, and the request aligned.",
      finalGuardrailPrompt_vi:
        "Giữ факт sửa chữa, thời gian và yêu cầu khớp nhau.",
      consistencyLine: {
        pa: "ਮੁਰੰਮਤ ਦੀ ਗੱਲ ਉਹੀ ਰਹਿਣੀ ਚਾਹੀਦੀ ਹੈ: ਕੀ, ਕਦੋਂ, ਅਤੇ ਕਿਵੇਂ।",
        romanization:
          "murammat di gall ohi rehnhi chahidi hai: ki, kadon, ate kivein.",
        en: "The repair details should stay the same: what, when, and how.",
        vi: "Chi tiết sửa chữa nên giữ nguyên: cái gì, khi nào và như thế nào.",
      },
      consistencySignals_en: [
        "Keeps the repair details stable",
        "Names the timing",
        "Stays easy to verify",
      ],
      consistencySignals_vi: [
        "Giữ chi tiết sửa chữa ổn định",
        "Nêu thời gian",
        "Dễ xác minh",
      ],
    },
    commonTraps: [
      {
        trap_en: "Switching from repair details to complaints too quickly.",
        trap_vi: "Chuyển từ chi tiết sửa chữa sang than phiền quá nhanh.",
        better: {
          pa: "ਪਹਿਲਾਂ ਮੁਰੰਮਤ ਦੀ ਪੁਸ਼ਟੀ ਕਰੀਏ।",
          romanization: "pehlan murammat di pushti kariye.",
          en: "Let's confirm the repair first.",
          vi: "Hãy xác nhận việc sửa chữa trước.",
        },
      },
    ],
    integrationReadiness_en:
      "language practice only, not legal or financial advice. Ready for integration-readiness checks when the housing message stays factual, consistent, and polite.",
    integrationReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Sẵn sàng cho kiểm tra tích hợp khi tin nhắn về nhà ở giữ được tính факт, nhất quán và lịch sự.",
    finalQuality_en:
      "Final quality checks housing consistency, boundary control, and Gurmukhi-first output.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh tính nhất quán về nhà ở, kiểm soát ranh giới và đầu ra Gurmukhi là chính.",
  },
  {
    id: "b1-consistency-school-community-conversation",
    level: "B1",
    focus: "school_community_conversation",
    title_en: "Keep a school or community conversation consistent",
    title_vi: "Giữ cuộc trò chuyện ở trường hoặc cộng đồng nhất quán",
    scenario_en:
      "A school office or community contact needs a repeatable explanation and a calm request.",
    scenario_vi:
      "Văn phòng trường hoặc liên hệ cộng đồng cần lời giải thích có thể lặp lại và một yêu cầu bình tĩnh.",
    canadaContext:
      "Useful for Canadian school offices, settlement programs, and community centres.",
    consistencyPack: {
      finalGuardrailPrompt_en:
        "Restate the same request and keep the wording simple.",
      finalGuardrailPrompt_vi:
        "Nhắc lại cùng yêu cầu và giữ cách nói đơn giản.",
      consistencyLine: {
        pa: "ਮੈਂ ਆਪਣੀ ਪਿਛਲੀ ਬੇਨਤੀ ਨੂੰ ਸਪਸ਼ਟ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization:
          "main apni pichhli benti nu spasht karna chahunda han.",
        en: "I want to clarify my previous request.",
        vi: "Tôi muốn làm rõ yêu cầu trước đó của mình.",
      },
      consistencySignals_en: [
        "Refers to the earlier request",
        "Stays simple",
        "Supports follow-through",
      ],
      consistencySignals_vi: [
        "Nhắc yêu cầu trước",
        "Giữ đơn giản",
        "Hỗ trợ theo dõi đến cùng",
      ],
    },
    commonTraps: [
      {
        trap_en: "Making the message more formal than needed and losing clarity.",
        trap_vi: "Làm tin nhắn quá trang trọng và mất độ rõ.",
        better: {
          pa: "ਛੋਟੀ ਅਤੇ ਸਾਫ਼ ਗੱਲ ਬਿਹਤਰ ਹੈ।",
          romanization: "choti ate saf gall behatar hai.",
          en: "Short and clear is better.",
          vi: "Ngắn gọn và rõ ràng là tốt hơn.",
        },
      },
    ],
    integrationReadiness_en:
      "Language practice only, not medical advice. Shahmukhi is awareness only, not a full course. Ready for integration-readiness checks when the community conversation remains consistent and easy to repeat.",
    integrationReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ. Sẵn sàng cho kiểm tra tích hợp khi cuộc trò chuyện cộng đồng nhất quán và dễ lặp lại.",
    finalQuality_en:
      "Final quality checks school/community consistency, checklist order, and review-safe wording.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh tính nhất quán ở trường/cộng đồng, thứ tự danh sách và cách nói an toàn cho review.",
  },
  {
    id: "b1-consistency-register-safe-repair",
    level: "B1",
    focus: "register_safe_repair",
    title_en: "Use register-safe repair",
    title_vi: "Dùng cách sửa an toàn về sắc thái",
    scenario_en:
      "Your first line sounded too direct, and you need to repair the register without losing the message.",
    scenario_vi:
      "Câu đầu của bạn nghe quá trực tiếp, và bạn cần sửa sắc thái mà không mất nội dung.",
    canadaContext:
      "Useful for Canadian service, workplace, and housing conversations that need a polite reset.",
    consistencyPack: {
      finalGuardrailPrompt_en:
        "Keep the message, soften the register, and check consistency again.",
      finalGuardrailPrompt_vi:
        "Giữ nội dung, làm mềm sắc thái và kiểm tra lại tính nhất quán.",
      consistencyLine: {
        pa: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਮੈਂ ਇਸਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਅਤੇ ਨਰਮ ਕਹਿਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization:
          "maf karna ji, main isnu hor spasht ate narm kahina chahunda han.",
        en: "Sorry, I want to say this more clearly and more softly.",
        vi: "Xin lỗi ạ, tôi muốn nói điều này rõ hơn và mềm hơn.",
      },
      consistencySignals_en: [
        "Softens the tone",
        "Keeps the message intact",
        "Signals a reset",
      ],
      consistencySignals_vi: [
        "Làm mềm giọng",
        "Giữ nội dung",
        "Báo hiệu đặt lại",
      ],
    },
    commonTraps: [
      {
        trap_en: "Over-apologizing and hiding the actual request.",
        trap_vi: "Xin lỗi quá nhiều và làm mờ yêu cầu thật.",
        better: {
          pa: "ਮੈਂ ਬੇਨਤੀ ਨੂੰ ਨਰਮ ਤਰੀਕੇ ਨਾਲ ਦੁਬਾਰਾ ਕਹਿ ਰਿਹਾ ਹਾਂ।",
          romanization:
            "main benti nu narm tarike nal dubara kahi riha han.",
          en: "I am restating the request in a softer way.",
          vi: "Tôi đang nói lại yêu cầu theo cách mềm hơn.",
        },
      },
    ],
    integrationReadiness_en:
      "language practice only, not legal or financial advice. Native review is deferred. Ready for integration-readiness checks when the repair stays polite, consistent, and easy to reuse.",
    integrationReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Đánh giá bản ngữ được hoãn lại. Sẵn sàng cho kiểm tra tích hợp khi phần sửa lịch sự, nhất quán và dễ tái dùng.",
    finalQuality_en:
      "Final quality checks register-safe repair, consistency, boundary awareness, and Gurmukhi-first output.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh sửa sắc thái an toàn, tính nhất quán, nhận biết ranh giới và đầu ra Gurmukhi là chính.",
  },
  {
    id: "b1-consistency-review",
    level: "B1",
    focus: "consistency_review",
    title_en: "Do a consistency review",
    title_vi: "Thực hiện rà soát tính nhất quán",
    scenario_en:
      "You want to check that the explanation, retelling, and follow-up all sound aligned.",
    scenario_vi:
      "Bạn muốn kiểm tra rằng phần giải thích, kể lại và theo dõi đều nghe khớp nhau.",
    canadaContext:
      "Useful for Canadian language support, service follow-ups, and community intake reviews.",
    consistencyPack: {
      finalGuardrailPrompt_en:
        "Check that the message, the facts, and the tone all match.",
      finalGuardrailPrompt_vi:
        "Kiểm tra rằng thông điệp, thông tin và giọng điệu đều khớp.",
      consistencyLine: {
        pa: "ਮੈਂ ਇੱਕ ਵਾਰ ਫਿਰ ਦੇਖਣਾ ਚਾਹੁੰਦਾ ਹਾਂ ਕਿ ਸਭ ਕੁਝ ਮਿਲਦਾ ਹੈ ਜਾਂ ਨਹੀਂ।",
        romanization:
          "main ik var phir dekhna chahunda han ki sabh kujh milda hai ja nahin.",
        en: "I want to check once more whether everything matches.",
        vi: "Tôi muốn kiểm tra lại xem mọi thứ có khớp nhau không.",
      },
      consistencySignals_en: [
        "Checks alignment",
        "Supports a final pass",
        "Prevents drift",
      ],
      consistencySignals_vi: [
        "Kiểm tra độ khớp",
        "Hỗ trợ lượt rà soát cuối",
        "Ngăn lệch ý",
      ],
    },
    commonTraps: [
      {
        trap_en: "Skipping the final check because the draft already sounds okay.",
        trap_vi: "Bỏ qua bước kiểm tra cuối vì bản nháp có vẻ đã ổn.",
        better: {
          pa: "ਆਖ਼ਰੀ ਜਾਂਚ ਫਿਰ ਵੀ ਜ਼ਰੂਰੀ ਹੈ।",
          romanization: "akhri janch phir vi zaruri hai.",
          en: "The final check is still necessary.",
          vi: "Bước kiểm tra cuối vẫn cần thiết.",
        },
      },
    ],
    integrationReadiness_en:
      "Language practice only, not medical advice. Language practice only, not legal or financial advice. Shahmukhi is awareness only, not a full course. Native review is deferred. Ready for integration-readiness checks when the review remains consistent, calm, and repeatable.",
    integrationReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ. Đánh giá bản ngữ được hoãn lại. Sẵn sàng cho kiểm tra tích hợp khi phần rà soát nhất quán, bình tĩnh và có thể lặp lại.",
    finalQuality_en:
      "Final quality checks consistency, final-guardrail discipline, checklist flow, and review readiness.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh tính nhất quán, kỷ luật rào chắn cuối, luồng danh sách và sẵn sàng rà soát.",
  },
];
