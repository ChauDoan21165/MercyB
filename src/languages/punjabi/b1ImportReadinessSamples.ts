export type PunjabiB1ImportReadinessFocus =
  | "situation_explanation"
  | "event_retelling"
  | "clarification"
  | "service_recovery"
  | "issue_resolution"
  | "follow_up_message"
  | "workplace_task"
  | "housing_school_community"
  | "register_safe_repair";

export type PunjabiImportReadinessLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiImportReadinessTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiImportReadinessLine;
};

export type PunjabiImportReadinessCheck = {
  importPrompt_en: string;
  importPrompt_vi: string;
  sampleLine: PunjabiImportReadinessLine;
  readinessSignals_en: string[];
  readinessSignals_vi: string[];
};

export type PunjabiB1ImportReadinessCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1ImportReadinessFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  importReadiness: PunjabiImportReadinessCheck;
  commonTraps: PunjabiImportReadinessTrap[];
  finalRegressionNote_en: string;
  finalRegressionNote_vi: string;
  preIntegrationRoute_en: string;
  preIntegrationRoute_vi: string;
};

export const punjabiB1ImportReadinessSamples: PunjabiB1ImportReadinessCard[] = [
  {
    id: "b1-import-situation-explanation",
    level: "B1",
    focus: "situation_explanation",
    title_en: "Import a stable situation explanation",
    title_vi: "Nhập phần giải thích tình huống ổn định",
    scenario_en:
      "You need one compact explanation that can be imported into a service, housing, or school task.",
    scenario_vi:
      "Bạn cần một phần giải thích ngắn có thể nhập vào nhiệm vụ dịch vụ, nhà ở hoặc trường học.",
    canadaContext:
      "Useful for Canadian newcomer centres, public counters, and appointment desks.",
    importReadiness: {
      importPrompt_en:
        "Keep the main fact, time, and requested next step in one reusable line.",
      importPrompt_vi:
        "Giữ thông tin chính, thời gian và bước tiếp theo trong một câu có thể dùng lại.",
      sampleLine: {
        pa: "ਅੱਜ ਸਵੇਰੇ ਇਹ ਮੁੱਦਾ ਆਇਆ, ਅਤੇ ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਚਾਹੀਦਾ ਹੈ।",
        romanization:
          "ajj savere ih mudda aia, ate mainu agla kadam chahida hai.",
        en: "This issue came up this morning, and I need the next step.",
        vi: "Vấn đề này xảy ra sáng nay, và tôi cần bước tiếp theo.",
      },
      readinessSignals_en: [
        "One main issue",
        "Clear time marker",
        "Reusable next-step request",
      ],
      readinessSignals_vi: [
        "Một vấn đề chính",
        "Mốc thời gian rõ",
        "Yêu cầu bước tiếp theo có thể dùng lại",
      ],
    },
    commonTraps: [
      {
        trap_en: "Importing a long story instead of a compact explanation.",
        trap_vi: "Nhập một câu chuyện dài thay vì giải thích ngắn.",
        better: {
          pa: "ਮੈਂ ਮੁੱਖ ਗੱਲ ਇੱਕ ਵਾਕ ਵਿੱਚ ਰੱਖਾਂਗਾ।",
          romanization: "main mukh gall ik vak vich rakhanga.",
          en: "I will keep the main point in one sentence.",
          vi: "Tôi sẽ giữ ý chính trong một câu.",
        },
      },
    ],
    finalRegressionNote_en:
      "Language practice only, not medical advice. Import readiness is strong when the same explanation can be reused without adding new facts.",
    finalRegressionNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Sẵn sàng nhập khi cùng phần giải thích có thể dùng lại mà không thêm thông tin mới.",
    preIntegrationRoute_en:
      "Route to pre-integration checks when the imported explanation stays stable across tasks.",
    preIntegrationRoute_vi:
      "Chuyển sang kiểm tra tiền tích hợp khi phần giải thích đã nhập vẫn ổn định qua nhiều nhiệm vụ.",
  },
  {
    id: "b1-import-event-retelling",
    level: "B1",
    focus: "event_retelling",
    title_en: "Import an ordered event retelling",
    title_vi: "Nhập phần kể lại sự việc có thứ tự",
    scenario_en:
      "A report needs an ordered sequence that can be reused without confusing the listener.",
    scenario_vi:
      "Một báo cáo cần trình tự có thứ tự để dùng lại mà không làm người nghe rối.",
    canadaContext:
      "Useful for Canadian workplace notes, school offices, and housing maintenance updates.",
    importReadiness: {
      importPrompt_en:
        "Use sequence words and keep every event in the same order.",
      importPrompt_vi:
        "Dùng từ chỉ trình tự và giữ mọi sự việc theo cùng thứ tự.",
      sampleLine: {
        pa: "ਪਹਿਲਾਂ ਮੈਂ ਕਾਲ ਕੀਤੀ, ਫਿਰ ਸੁਨੇਹਾ ਛੱਡਿਆ, ਅਤੇ ਬਾਅਦ ਵਿੱਚ ਜਵਾਬ ਮਿਲਿਆ।",
        romanization:
          "pehlan main call kiti, phir suneha chhaddia, ate baad vich javab milia.",
        en: "First I called, then I left a message, and later I received a reply.",
        vi: "Trước hết tôi gọi, rồi để lại tin nhắn, và sau đó nhận được phản hồi.",
      },
      readinessSignals_en: [
        "Uses sequence markers",
        "Keeps one timeline",
        "Can be copied into a report",
      ],
      readinessSignals_vi: [
        "Dùng dấu hiệu trình tự",
        "Giữ một dòng thời gian",
        "Có thể đưa vào báo cáo",
      ],
    },
    commonTraps: [
      {
        trap_en: "Changing the order each time the story is retold.",
        trap_vi: "Đổi thứ tự mỗi lần kể lại.",
        better: {
          pa: "ਹਰ ਵਾਰੀ ਉਹੀ ਕ੍ਰਮ ਰੱਖੋ।",
          romanization: "har vari ohi kram rakho.",
          en: "Keep the same order every time.",
          vi: "Giữ cùng thứ tự mỗi lần.",
        },
      },
    ],
    finalRegressionNote_en:
      "Language practice only, not legal or financial advice. Shahmukhi is awareness only, not a full course.",
    finalRegressionNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ.",
    preIntegrationRoute_en:
      "Route to final-regression review if the imported timeline is not yet stable.",
    preIntegrationRoute_vi:
      "Chuyển sang rà soát hồi quy cuối nếu dòng thời gian đã nhập chưa ổn định.",
  },
  {
    id: "b1-import-clarification",
    level: "B1",
    focus: "clarification",
    title_en: "Import one clarification request",
    title_vi: "Nhập một yêu cầu làm rõ",
    scenario_en:
      "You need a clarification line that can be inserted into calls, emails, and front-desk talks.",
    scenario_vi:
      "Bạn cần một câu làm rõ có thể chèn vào cuộc gọi, email và trao đổi tại quầy.",
    canadaContext:
      "Useful for Canadian appointment confirmations, school forms, and community program intake.",
    importReadiness: {
      importPrompt_en:
        "Ask for one missing detail and make the confirmation channel clear.",
      importPrompt_vi:
        "Hỏi một chi tiết còn thiếu và làm rõ kênh xác nhận.",
      sampleLine: {
        pa: "ਕੀ ਤੁਸੀਂ ਸਮਾਂ ਅਤੇ ਕਮਰਾ ਨੰਬਰ ਲਿਖ ਕੇ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization:
          "ki tusin sama ate kamra number likh ke bhej sakde ho?",
        en: "Can you send the time and room number in writing?",
        vi: "Bạn có thể gửi giờ và số phòng bằng văn bản không?",
      },
      readinessSignals_en: [
        "Asks for missing details",
        "Requests written confirmation",
        "Fits calls or emails",
      ],
      readinessSignals_vi: [
        "Hỏi chi tiết còn thiếu",
        "Xin xác nhận bằng văn bản",
        "Phù hợp cuộc gọi hoặc email",
      ],
    },
    commonTraps: [
      {
        trap_en: "Saying only 'I do not understand' without naming what is missing.",
        trap_vi: "Chỉ nói 'tôi không hiểu' mà không nêu thiếu điều gì.",
        better: {
          pa: "ਮੈਨੂੰ ਸਮਾਂ ਸਪਸ਼ਟ ਨਹੀਂ ਹੈ।",
          romanization: "mainu sama spasht nahin hai.",
          en: "The time is not clear to me.",
          vi: "Thời gian chưa rõ với tôi.",
        },
      },
    ],
    finalRegressionNote_en:
      "Import readiness improves when the learner can name the missing detail before asking again.",
    finalRegressionNote_vi:
      "Sẵn sàng nhập tốt hơn khi người học có thể nêu chi tiết còn thiếu trước khi hỏi lại.",
    preIntegrationRoute_en:
      "Route to pre-integration clarification when the same line works in phone and email tasks.",
    preIntegrationRoute_vi:
      "Chuyển sang làm rõ tiền tích hợp khi cùng câu dùng được trong nhiệm vụ điện thoại và email.",
  },
  {
    id: "b1-import-service-recovery",
    level: "B1",
    focus: "service_recovery",
    title_en: "Import a polite service reset",
    title_vi: "Nhập câu đặt lại dịch vụ lịch sự",
    scenario_en:
      "A service interaction needs a reusable reset that keeps the same request.",
    scenario_vi:
      "Một tương tác dịch vụ cần câu đặt lại có thể dùng lại và giữ cùng yêu cầu.",
    canadaContext:
      "Useful for Canadian service desks, help lines, and support chats.",
    importReadiness: {
      importPrompt_en:
        "Reset the conversation politely and keep the original request visible.",
      importPrompt_vi:
        "Đặt lại cuộc trò chuyện lịch sự và giữ yêu cầu ban đầu rõ.",
      sampleLine: {
        pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਆਪਣੀ ਬੇਨਤੀ ਸਾਫ਼ ਤਰੀਕੇ ਨਾਲ ਫਿਰ ਕਹਿੰਦਾ ਹਾਂ।",
        romanization:
          "maf karna, main apni benti saf tarike nal phir kahinda han.",
        en: "Sorry, I will say my request again clearly.",
        vi: "Xin lỗi, tôi sẽ nói lại yêu cầu của mình một cách rõ ràng.",
      },
      readinessSignals_en: [
        "Resets politely",
        "Keeps the request visible",
        "Avoids blame language",
      ],
      readinessSignals_vi: [
        "Đặt lại lịch sự",
        "Giữ yêu cầu rõ",
        "Tránh ngôn ngữ đổ lỗi",
      ],
    },
    commonTraps: [
      {
        trap_en: "Blaming the listener instead of repairing the conversation.",
        trap_vi: "Đổ lỗi cho người nghe thay vì sửa cuộc trò chuyện.",
        better: {
          pa: "ਆਓ ਗੱਲ ਨੂੰ ਸਾਫ਼ ਕਰੀਏ।",
          romanization: "ao gall nu saf kariye.",
          en: "Let's make the conversation clear.",
          vi: "Hãy làm cuộc trò chuyện rõ hơn.",
        },
      },
    ],
    finalRegressionNote_en:
      "Native review is deferred. Import-ready service recovery stays polite, compact, and repeatable.",
    finalRegressionNote_vi:
      "Đánh giá của người bản ngữ được để sau. Phục hồi dịch vụ sẵn sàng nhập vẫn lịch sự, ngắn gọn và lặp lại được.",
    preIntegrationRoute_en:
      "Route to service-recovery integration after the reset line stays stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tích hợp phục hồi dịch vụ sau khi câu đặt lại ổn định.",
  },
  {
    id: "b1-import-issue-resolution",
    level: "B1",
    focus: "issue_resolution",
    title_en: "Import an issue-resolution request",
    title_vi: "Nhập yêu cầu giải quyết vấn đề",
    scenario_en:
      "You need a line that identifies a problem, asks for correction, and requests confirmation.",
    scenario_vi:
      "Bạn cần một câu xác định vấn đề, yêu cầu sửa và xin xác nhận.",
    canadaContext:
      "Useful for Canadian tenant repair requests, billing corrections, and school records.",
    importReadiness: {
      importPrompt_en:
        "Name the issue and ask for a correction that can be confirmed.",
      importPrompt_vi:
        "Nêu vấn đề và yêu cầu phần sửa có thể được xác nhận.",
      sampleLine: {
        pa: "ਇਸ ਰਿਕਾਰਡ ਵਿੱਚ ਗਲਤ ਜਾਣਕਾਰੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਸਨੂੰ ਠੀਕ ਕਰ ਸਕਦੇ ਹੋ?",
        romanization:
          "is record vich galat jankari hai. ki tusin isnu thik kar sakde ho?",
        en: "There is incorrect information in this record. Can you correct it?",
        vi: "Có thông tin sai trong hồ sơ này. Bạn có thể sửa không?",
      },
      readinessSignals_en: [
        "Names the record",
        "States the problem",
        "Requests correction",
      ],
      readinessSignals_vi: [
        "Nêu hồ sơ",
        "Nói vấn đề",
        "Yêu cầu sửa",
      ],
    },
    commonTraps: [
      {
        trap_en: "Asking for correction without saying where the error is.",
        trap_vi: "Yêu cầu sửa mà không nói lỗi ở đâu.",
        better: {
          pa: "ਗਲਤ ਜਾਣਕਾਰੀ ਇਸ ਲਾਈਨ ਵਿੱਚ ਹੈ।",
          romanization: "galat jankari is line vich hai.",
          en: "The incorrect information is in this line.",
          vi: "Thông tin sai nằm ở dòng này.",
        },
      },
    ],
    finalRegressionNote_en:
      "Language practice only, not legal or financial advice. Final-regression review should keep issue and correction together.",
    finalRegressionNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Rà soát hồi quy cuối nên giữ vấn đề và phần sửa cùng nhau.",
    preIntegrationRoute_en:
      "Route to issue-resolution pre-integration once the correction request is checkable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp giải quyết vấn đề khi yêu cầu sửa có thể kiểm tra.",
  },
  {
    id: "b1-import-follow-up-message",
    level: "B1",
    focus: "follow_up_message",
    title_en: "Import a short follow-up message",
    title_vi: "Nhập tin nhắn theo dõi ngắn",
    scenario_en:
      "You need a follow-up that can be reused after a call, email, or appointment.",
    scenario_vi:
      "Bạn cần phần theo dõi có thể dùng lại sau cuộc gọi, email hoặc cuộc hẹn.",
    canadaContext:
      "Useful for Canadian school, clinic, landlord, and community agency emails.",
    importReadiness: {
      importPrompt_en:
        "Connect to the previous contact and ask for the next practical action.",
      importPrompt_vi:
        "Nối với liên hệ trước và hỏi hành động thực tế tiếp theo.",
      sampleLine: {
        pa: "ਮੈਂ ਆਪਣੀ ਪਿਛਲੀ ਬੇਨਤੀ ਬਾਰੇ ਪਾਲਣਾ ਕਰ ਰਿਹਾ ਹਾਂ। ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?",
        romanization:
          "main apni pichhli benti bare palna kar riha han. agla kadam ki hai?",
        en: "I am following up on my previous request. What is the next step?",
        vi: "Tôi đang theo dõi yêu cầu trước của mình. Bước tiếp theo là gì?",
      },
      readinessSignals_en: [
        "References previous request",
        "Stays compact",
        "Asks for next step",
      ],
      readinessSignals_vi: [
        "Nhắc yêu cầu trước",
        "Giữ ngắn gọn",
        "Hỏi bước tiếp theo",
      ],
    },
    commonTraps: [
      {
        trap_en: "Restarting the full case in every follow-up.",
        trap_vi: "Kể lại toàn bộ vụ việc trong mỗi lần theo dõi.",
        better: {
          pa: "ਇਹ ਸਿਰਫ਼ ਪਾਲਣਾ ਵਾਲਾ ਸੁਨੇਹਾ ਹੈ।",
          romanization: "ih sirf palna vala suneha hai.",
          en: "This is only a follow-up message.",
          vi: "Đây chỉ là tin nhắn theo dõi.",
        },
      },
    ],
    finalRegressionNote_en:
      "Import readiness is strong when the follow-up keeps the old request and new next step separate.",
    finalRegressionNote_vi:
      "Sẵn sàng nhập khi phần theo dõi tách rõ yêu cầu cũ và bước tiếp theo mới.",
    preIntegrationRoute_en:
      "Route to follow-up integration if the message does not introduce unrelated issues.",
    preIntegrationRoute_vi:
      "Chuyển sang tích hợp theo dõi nếu tin nhắn không đưa thêm vấn đề không liên quan.",
  },
  {
    id: "b1-import-workplace-task",
    level: "B1",
    focus: "workplace_task",
    title_en: "Import a workplace-safe update",
    title_vi: "Nhập cập nhật phù hợp nơi làm việc",
    scenario_en:
      "A workplace task needs a short update that explains timing and action.",
    scenario_vi:
      "Một nhiệm vụ nơi làm việc cần cập nhật ngắn giải thích thời gian và hành động.",
    canadaContext:
      "Useful for Canadian shift changes, supervisor messages, and schedule notes.",
    importReadiness: {
      importPrompt_en:
        "Use respectful register and include timing, reason, and action.",
      importPrompt_vi:
        "Dùng sắc thái tôn trọng và gồm thời gian, lý do, hành động.",
      sampleLine: {
        pa: "ਮੈਂ ਅੱਜ ਦੇ ਸ਼ਡਿਊਲ ਬਾਰੇ ਦੱਸ ਰਿਹਾ ਹਾਂ: ਮੈਂ ਪੰਦਰਾਂ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ।",
        romanization:
          "main ajj de schedule bare dass riha han: main pandran mint der nal avanga.",
        en: "I am updating you about today's schedule: I will arrive fifteen minutes late.",
        vi: "Tôi cập nhật về lịch hôm nay: tôi sẽ đến muộn mười lăm phút.",
      },
      readinessSignals_en: [
        "Uses respectful update language",
        "Gives timing",
        "Fits supervisor communication",
      ],
      readinessSignals_vi: [
        "Dùng ngôn ngữ cập nhật tôn trọng",
        "Nêu thời gian",
        "Phù hợp trao đổi với quản lý",
      ],
    },
    commonTraps: [
      {
        trap_en: "Using friend-level casual language in a supervisor update.",
        trap_vi: "Dùng ngôn ngữ thân mật như bạn bè trong cập nhật cho quản lý.",
        better: {
          pa: "ਮੈਂ ਤੁਹਾਨੂੰ ਪਹਿਲਾਂ ਹੀ ਜਾਣਕਾਰੀ ਦੇ ਰਿਹਾ ਹਾਂ।",
          romanization: "main tuhanu pehlan hi jankari de riha han.",
          en: "I am giving you the information in advance.",
          vi: "Tôi báo thông tin cho bạn trước.",
        },
      },
    ],
    finalRegressionNote_en:
      "Final-regression checks should keep the workplace tone respectful and practical.",
    finalRegressionNote_vi:
      "Kiểm tra hồi quy cuối nên giữ sắc thái nơi làm việc tôn trọng và thực tế.",
    preIntegrationRoute_en:
      "Route to workplace pre-integration when timing and action are both clear.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp nơi làm việc khi thời gian và hành động đều rõ.",
  },
  {
    id: "b1-import-housing-school-community",
    level: "B1",
    focus: "housing_school_community",
    title_en: "Import a neutral public-task request",
    title_vi: "Nhập yêu cầu nhiệm vụ công cộng trung tính",
    scenario_en:
      "You need a reusable request for a landlord, school office, library, or community program.",
    scenario_vi:
      "Bạn cần yêu cầu có thể dùng lại cho chủ nhà, văn phòng trường, thư viện hoặc chương trình cộng đồng.",
    canadaContext:
      "Useful for Canadian rental offices, school reception, libraries, and settlement agencies.",
    importReadiness: {
      importPrompt_en:
        "Name the form, service, or appointment and ask for help clearly.",
      importPrompt_vi:
        "Nêu mẫu đơn, dịch vụ hoặc cuộc hẹn và xin giúp rõ ràng.",
      sampleLine: {
        pa: "ਮੈਨੂੰ ਇਸ ਸੇਵਾ ਲਈ ਕਿਹੜਾ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ?",
        romanization: "mainu is seva lai kihra form chahida hai?",
        en: "Which form do I need for this service?",
        vi: "Tôi cần mẫu đơn nào cho dịch vụ này?",
      },
      readinessSignals_en: [
        "Names a public task",
        "Uses neutral register",
        "Can move across settings",
      ],
      readinessSignals_vi: [
        "Nêu nhiệm vụ công cộng",
        "Dùng sắc thái trung tính",
        "Có thể chuyển qua nhiều bối cảnh",
      ],
    },
    commonTraps: [
      {
        trap_en: "Assuming every office uses the same process.",
        trap_vi: "Cho rằng mọi văn phòng dùng cùng quy trình.",
        better: {
          pa: "ਇਸ ਦਫ਼ਤਰ ਵਿੱਚ ਪ੍ਰਕਿਰਿਆ ਕੀ ਹੈ?",
          romanization: "is daftar vich prakiria ki hai?",
          en: "What is the process in this office?",
          vi: "Quy trình ở văn phòng này là gì?",
        },
      },
    ],
    finalRegressionNote_en:
      "Import readiness requires practical language only; do not invent policy or eligibility details.",
    finalRegressionNote_vi:
      "Sẵn sàng nhập chỉ cần ngôn ngữ thực tế; không bịa chính sách hoặc điều kiện đủ.",
    preIntegrationRoute_en:
      "Route to public-service integration if the same structure works across housing, school, and community tasks.",
    preIntegrationRoute_vi:
      "Chuyển sang tích hợp dịch vụ công nếu cùng cấu trúc dùng được qua nhiệm vụ nhà ở, trường học và cộng đồng.",
  },
  {
    id: "b1-import-register-safe-repair",
    level: "B1",
    focus: "register_safe_repair",
    title_en: "Import a register-safe repair",
    title_vi: "Nhập phần sửa lời an toàn về sắc thái",
    scenario_en:
      "You need a reusable line for softening a request without abandoning it.",
    scenario_vi:
      "Bạn cần một câu có thể dùng lại để làm yêu cầu nhẹ hơn mà không bỏ yêu cầu đó.",
    canadaContext:
      "Useful for Canadian workplaces, tenant conversations, school offices, and service counters.",
    importReadiness: {
      importPrompt_en:
        "Soften the wording, keep the request, and continue politely.",
      importPrompt_vi:
        "Làm nhẹ cách nói, giữ yêu cầu và tiếp tục lịch sự.",
      sampleLine: {
        pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਇਹ ਹੋਰ ਨਰਮ ਤਰੀਕੇ ਨਾਲ ਕਹਿਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization:
          "maf karna, main ih hor naram tarike nal kahina chahunda han.",
        en: "Sorry, I want to say this in a softer way.",
        vi: "Xin lỗi, tôi muốn nói điều này nhẹ nhàng hơn.",
      },
      readinessSignals_en: [
        "Acknowledges wording",
        "Softens the request",
        "Keeps the task active",
      ],
      readinessSignals_vi: [
        "Thừa nhận cách nói",
        "Làm nhẹ yêu cầu",
        "Giữ nhiệm vụ tiếp tục",
      ],
    },
    commonTraps: [
      {
        trap_en: "Softening so much that the request disappears.",
        trap_vi: "Làm nhẹ quá mức khiến yêu cầu biến mất.",
        better: {
          pa: "ਬੇਨਤੀ ਉਹੀ ਹੈ, ਸਿਰਫ਼ ਬੋਲਣ ਦਾ ਤਰੀਕਾ ਨਰਮ ਹੈ।",
          romanization:
            "benti ohi hai, sirf bolan da tarika naram hai.",
          en: "The request is the same; only the wording is softer.",
          vi: "Yêu cầu vẫn như cũ; chỉ cách nói nhẹ hơn.",
        },
      },
    ],
    finalRegressionNote_en:
      "Native review is deferred. Import-ready repair keeps register safe without changing the task.",
    finalRegressionNote_vi:
      "Đánh giá của người bản ngữ được để sau. Phần sửa sẵn sàng nhập giữ sắc thái an toàn mà không đổi nhiệm vụ.",
    preIntegrationRoute_en:
      "Route to register-safe pre-integration if the repair line stays polite and specific.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp về sắc thái nếu câu sửa vẫn lịch sự và cụ thể.",
  },
];
