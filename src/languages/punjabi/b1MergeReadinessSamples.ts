export type PunjabiB1MergeReadinessFocus =
  | "situation_explanation"
  | "event_retelling"
  | "clarification"
  | "service_recovery"
  | "issue_resolution"
  | "follow_up_message"
  | "workplace_task"
  | "housing_school_community"
  | "register_safe_repair";

export type PunjabiMergeReadinessLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiMergeReadinessTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiMergeReadinessLine;
};

export type PunjabiMergeReadinessCheck = {
  mergePrompt_en: string;
  mergePrompt_vi: string;
  sampleLine: PunjabiMergeReadinessLine;
  verificationSignals_en: string[];
  verificationSignals_vi: string[];
};

export type PunjabiB1MergeReadinessCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1MergeReadinessFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  mergeReadiness: PunjabiMergeReadinessCheck;
  commonTraps: PunjabiMergeReadinessTrap[];
  finalRegressionNote_en: string;
  finalRegressionNote_vi: string;
  preIntegrationRoute_en: string;
  preIntegrationRoute_vi: string;
};

export const punjabiB1MergeReadinessSamples: PunjabiB1MergeReadinessCard[] = [
  {
    id: "b1-merge-situation-explanation",
    level: "B1",
    focus: "situation_explanation",
    title_en: "Explain the situation before merging",
    title_vi: "Giải thích tình huống trước khi gộp",
    scenario_en:
      "You need a stable explanation that can move into a larger workplace or service task.",
    scenario_vi:
      "Bạn cần một phần giải thích ổn định có thể đưa vào nhiệm vụ nơi làm việc hoặc dịch vụ lớn hơn.",
    canadaContext:
      "Useful for Canadian front desks, settlement offices, and service counters.",
    mergeReadiness: {
      mergePrompt_en:
        "State what happened, when it happened, and what you need next.",
      mergePrompt_vi:
        "Nêu điều đã xảy ra, thời điểm xảy ra và điều bạn cần tiếp theo.",
      sampleLine: {
        pa: "ਕੱਲ੍ਹ ਇਹ ਸਮੱਸਿਆ ਆਈ ਸੀ, ਇਸ ਲਈ ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਜਾਣਨਾ ਹੈ।",
        romanization:
          "kalh ih samassia ai si, is lai mainu agla kadam janna hai.",
        en: "This problem happened yesterday, so I need to know the next step.",
        vi: "Vấn đề này xảy ra hôm qua, nên tôi cần biết bước tiếp theo.",
      },
      verificationSignals_en: [
        "Names the problem",
        "Gives a simple time marker",
        "Connects to the next step",
      ],
      verificationSignals_vi: [
        "Nêu vấn đề",
        "Đưa mốc thời gian đơn giản",
        "Nối với bước tiếp theo",
      ],
    },
    commonTraps: [
      {
        trap_en: "Explaining feelings before the core facts.",
        trap_vi: "Giải thích cảm xúc trước thông tin chính.",
        better: {
          pa: "ਪਹਿਲਾਂ ਮੁੱਖ ਗੱਲ ਦੱਸਦਾ ਹਾਂ, ਫਿਰ ਵੇਰਵਾ।",
          romanization: "pehlan mukh gall dassda han, phir vera.",
          en: "I will say the main point first, then the detail.",
          vi: "Tôi sẽ nói ý chính trước, rồi đến chi tiết.",
        },
      },
    ],
    finalRegressionNote_en:
      "Language practice only, not medical advice. Merge readiness is strong when the same facts can be repeated without changing the request.",
    finalRegressionNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Sẵn sàng gộp khi cùng thông tin có thể được lặp lại mà không đổi yêu cầu.",
    preIntegrationRoute_en:
      "Route to pre-integration checks if the situation, time, and next step remain stable.",
    preIntegrationRoute_vi:
      "Chuyển sang kiểm tra tiền tích hợp nếu tình huống, thời gian và bước tiếp theo vẫn ổn định.",
  },
  {
    id: "b1-merge-event-retelling",
    level: "B1",
    focus: "event_retelling",
    title_en: "Retell events in a merge-safe order",
    title_vi: "Kể lại sự việc theo thứ tự an toàn để gộp",
    scenario_en:
      "You need a sequence that can be reused in a housing, school, or workplace report.",
    scenario_vi:
      "Bạn cần một trình tự có thể dùng lại trong báo cáo nhà ở, trường học hoặc nơi làm việc.",
    canadaContext:
      "Useful for Canadian tenant offices, school offices, and supervisor updates.",
    mergeReadiness: {
      mergePrompt_en:
        "Keep the order clear enough for another task to reuse it.",
      mergePrompt_vi:
        "Giữ thứ tự đủ rõ để nhiệm vụ khác có thể dùng lại.",
      sampleLine: {
        pa: "ਪਹਿਲਾਂ ਮੈਂ ਸੁਨੇਹਾ ਭੇਜਿਆ, ਫਿਰ ਜਵਾਬ ਆਇਆ, ਅਤੇ ਫਿਰ ਅਸੀਂ ਸਮਾਂ ਬਦਲਿਆ।",
        romanization:
          "pehlan main suneha bhejia, phir javab aia, ate phir asin sama badlia.",
        en: "First I sent a message, then a reply came, and then we changed the time.",
        vi: "Trước tiên tôi gửi tin nhắn, sau đó có phản hồi, rồi chúng tôi đổi giờ.",
      },
      verificationSignals_en: [
        "Uses first/then markers",
        "Keeps one timeline",
        "Avoids extra side stories",
      ],
      verificationSignals_vi: [
        "Dùng mốc trước/sau",
        "Giữ một dòng thời gian",
        "Tránh chuyện phụ",
      ],
    },
    commonTraps: [
      {
        trap_en: "Jumping back and forth in time.",
        trap_vi: "Nhảy qua lại trong dòng thời gian.",
        better: {
          pa: "ਮੈਂ ਗੱਲ ਕ੍ਰਮ ਵਿੱਚ ਦੱਸਾਂਗਾ।",
          romanization: "main gall kram vich dassanga.",
          en: "I will explain it in order.",
          vi: "Tôi sẽ giải thích theo thứ tự.",
        },
      },
    ],
    finalRegressionNote_en:
      "Language practice only, not legal or financial advice. Shahmukhi is awareness only, not a full course.",
    finalRegressionNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ.",
    preIntegrationRoute_en:
      "Route to final-regression samples if the timeline is still unstable.",
    preIntegrationRoute_vi:
      "Chuyển sang mẫu hồi quy cuối nếu dòng thời gian vẫn chưa ổn định.",
  },
  {
    id: "b1-merge-clarification",
    level: "B1",
    focus: "clarification",
    title_en: "Clarify before the task expands",
    title_vi: "Làm rõ trước khi nhiệm vụ mở rộng",
    scenario_en:
      "You want to confirm a date, place, or document before moving into a longer task.",
    scenario_vi:
      "Bạn muốn xác nhận ngày, nơi hoặc giấy tờ trước khi chuyển sang nhiệm vụ dài hơn.",
    canadaContext:
      "Useful for Canadian appointment desks, school forms, and community programs.",
    mergeReadiness: {
      mergePrompt_en:
        "Ask one clear clarification question and request written confirmation.",
      mergePrompt_vi:
        "Hỏi một câu làm rõ cụ thể và xin xác nhận bằng văn bản.",
      sampleLine: {
        pa: "ਕੀ ਤੁਸੀਂ ਮਿਤੀ ਅਤੇ ਪਤਾ ਈਮੇਲ ਵਿੱਚ ਪੁਸ਼ਟੀ ਕਰ ਸਕਦੇ ਹੋ?",
        romanization:
          "ki tusin miti ate pata email vich pushti kar sakde ho?",
        en: "Can you confirm the date and address by email?",
        vi: "Bạn có thể xác nhận ngày và địa chỉ qua email không?",
      },
      verificationSignals_en: [
        "Targets one detail",
        "Uses a polite request",
        "Asks for written confirmation",
      ],
      verificationSignals_vi: [
        "Nhắm một chi tiết",
        "Dùng yêu cầu lịch sự",
        "Xin xác nhận bằng văn bản",
      ],
    },
    commonTraps: [
      {
        trap_en: "Asking three unrelated questions at once.",
        trap_vi: "Hỏi ba câu không liên quan cùng lúc.",
        better: {
          pa: "ਪਹਿਲਾਂ ਮਿਤੀ ਦੀ ਪੁਸ਼ਟੀ ਕਰ ਲਈਏ।",
          romanization: "pehlan miti di pushti kar laie.",
          en: "Let's confirm the date first.",
          vi: "Hãy xác nhận ngày trước.",
        },
      },
    ],
    finalRegressionNote_en:
      "Final-regression readiness improves when the learner confirms one detail before adding more.",
    finalRegressionNote_vi:
      "Sẵn sàng hồi quy cuối tốt hơn khi người học xác nhận một chi tiết trước khi thêm chi tiết khác.",
    preIntegrationRoute_en:
      "Route to pre-integration clarification tasks when the learner can repeat the confirmed detail.",
    preIntegrationRoute_vi:
      "Chuyển sang nhiệm vụ làm rõ tiền tích hợp khi người học có thể lặp lại chi tiết đã xác nhận.",
  },
  {
    id: "b1-merge-service-recovery",
    level: "B1",
    focus: "service_recovery",
    title_en: "Recover service without changing the request",
    title_vi: "Phục hồi dịch vụ mà không đổi yêu cầu",
    scenario_en:
      "A service conversation became confusing and needs a clean reset before merging.",
    scenario_vi:
      "Cuộc trò chuyện dịch vụ bị rối và cần đặt lại gọn trước khi gộp.",
    canadaContext:
      "Useful for Canadian support chats, phone lines, and public service desks.",
    mergeReadiness: {
      mergePrompt_en:
        "Restate the same request and explain that you are clarifying, not changing it.",
      mergePrompt_vi:
        "Nói lại cùng yêu cầu và giải thích rằng bạn đang làm rõ, không đổi yêu cầu.",
      sampleLine: {
        pa: "ਮੈਂ ਬੇਨਤੀ ਨਹੀਂ ਬਦਲ ਰਿਹਾ, ਸਿਰਫ਼ ਇਸਨੂੰ ਸਾਫ਼ ਕਰ ਰਿਹਾ ਹਾਂ।",
        romanization:
          "main benti nahin badal riha, sirf isnu saf kar riha han.",
        en: "I am not changing the request, only clarifying it.",
        vi: "Tôi không đổi yêu cầu, chỉ làm rõ yêu cầu đó.",
      },
      verificationSignals_en: [
        "Keeps the same request",
        "Names the clarification",
        "Maintains polite register",
      ],
      verificationSignals_vi: [
        "Giữ cùng yêu cầu",
        "Nêu việc làm rõ",
        "Giữ sắc thái lịch sự",
      ],
    },
    commonTraps: [
      {
        trap_en: "Restarting with a different issue.",
        trap_vi: "Bắt đầu lại bằng một vấn đề khác.",
        better: {
          pa: "ਉਹੀ ਮੁੱਦਾ ਰੱਖੀਏ।",
          romanization: "ohi mudda rakhiye.",
          en: "Let's keep the same issue.",
          vi: "Hãy giữ cùng một vấn đề.",
        },
      },
    ],
    finalRegressionNote_en:
      "Native review is deferred. Merge readiness is strong when recovery language remains polite and repeatable.",
    finalRegressionNote_vi:
      "Đánh giá của người bản ngữ được để sau. Sẵn sàng gộp khi ngôn ngữ phục hồi vẫn lịch sự và lặp lại được.",
    preIntegrationRoute_en:
      "Route to service recovery integration only after the reset line stays stable.",
    preIntegrationRoute_vi:
      "Chỉ chuyển sang tích hợp phục hồi dịch vụ sau khi câu đặt lại ổn định.",
  },
  {
    id: "b1-merge-issue-resolution",
    level: "B1",
    focus: "issue_resolution",
    title_en: "Link issue, correction, and check",
    title_vi: "Nối vấn đề, phần sửa và kiểm tra",
    scenario_en:
      "You need to show whether an issue was corrected before a final merge check.",
    scenario_vi:
      "Bạn cần cho biết vấn đề đã được sửa chưa trước kiểm tra gộp cuối.",
    canadaContext:
      "Useful for Canadian billing offices, housing maintenance, and school administration.",
    mergeReadiness: {
      mergePrompt_en:
        "Name the issue, ask for the correction, and verify the result.",
      mergePrompt_vi:
        "Nêu vấn đề, yêu cầu sửa và xác minh kết quả.",
      sampleLine: {
        pa: "ਇਸ ਵਿੱਚ ਗਲਤੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਸਨੂੰ ਠੀਕ ਕਰਕੇ ਮੈਨੂੰ ਪੁਸ਼ਟੀ ਦੇ ਸਕਦੇ ਹੋ?",
        romanization:
          "is vich galti hai. ki tusin isnu thik karke mainu pushti de sakde ho?",
        en: "There is a mistake in this. Can you fix it and give me confirmation?",
        vi: "Có lỗi trong phần này. Bạn có thể sửa và xác nhận cho tôi không?",
      },
      verificationSignals_en: [
        "Identifies the issue",
        "Requests a correction",
        "Asks for confirmation",
      ],
      verificationSignals_vi: [
        "Xác định vấn đề",
        "Yêu cầu sửa",
        "Xin xác nhận",
      ],
    },
    commonTraps: [
      {
        trap_en: "Asking for help without naming what is wrong.",
        trap_vi: "Xin giúp mà không nêu điều sai.",
        better: {
          pa: "ਗਲਤੀ ਇੱਥੇ ਹੈ।",
          romanization: "galti ithe hai.",
          en: "The mistake is here.",
          vi: "Lỗi nằm ở đây.",
        },
      },
    ],
    finalRegressionNote_en:
      "Language practice only, not legal or financial advice. Final-regression checks should keep the correction visible.",
    finalRegressionNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Kiểm tra hồi quy cuối nên giữ phần sửa rõ ràng.",
    preIntegrationRoute_en:
      "Route to issue-resolution integration when the correction can be verified.",
    preIntegrationRoute_vi:
      "Chuyển sang tích hợp giải quyết vấn đề khi phần sửa có thể được xác minh.",
  },
  {
    id: "b1-merge-follow-up-message",
    level: "B1",
    focus: "follow_up_message",
    title_en: "Send a merge-ready follow-up",
    title_vi: "Gửi tin nhắn theo dõi sẵn sàng để gộp",
    scenario_en:
      "A short follow-up needs to connect the previous conversation to the next action.",
    scenario_vi:
      "Một tin nhắn theo dõi ngắn cần nối cuộc trò chuyện trước với hành động tiếp theo.",
    canadaContext:
      "Useful for Canadian emails to schools, landlords, clinics, and community agencies.",
    mergeReadiness: {
      mergePrompt_en:
        "Refer to the previous message, confirm the request, and ask for the next step.",
      mergePrompt_vi:
        "Nhắc tin nhắn trước, xác nhận yêu cầu và hỏi bước tiếp theo.",
      sampleLine: {
        pa: "ਪਿਛਲੇ ਸੁਨੇਹੇ ਬਾਰੇ, ਕੀ ਤੁਸੀਂ ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਦੱਸ ਸਕਦੇ ਹੋ?",
        romanization:
          "pichhle sunehe bare, ki tusin mainu agla kadam dass sakde ho?",
        en: "About the previous message, can you tell me the next step?",
        vi: "Về tin nhắn trước, bạn có thể cho tôi biết bước tiếp theo không?",
      },
      verificationSignals_en: [
        "References prior contact",
        "Keeps the request short",
        "Asks for next action",
      ],
      verificationSignals_vi: [
        "Nhắc liên hệ trước",
        "Giữ yêu cầu ngắn",
        "Hỏi hành động tiếp theo",
      ],
    },
    commonTraps: [
      {
        trap_en: "Writing a new full explanation instead of a follow-up.",
        trap_vi: "Viết lại toàn bộ giải thích thay vì theo dõi.",
        better: {
          pa: "ਇਹ ਪਿਛਲੇ ਸੁਨੇਹੇ ਦੀ ਪਾਲਣਾ ਹੈ।",
          romanization: "ih pichhle sunehe di palna hai.",
          en: "This is a follow-up to the previous message.",
          vi: "Đây là phần theo dõi tin nhắn trước.",
        },
      },
    ],
    finalRegressionNote_en:
      "Merge readiness is strong when the follow-up does not reopen unrelated details.",
    finalRegressionNote_vi:
      "Sẵn sàng gộp khi phần theo dõi không mở lại chi tiết không liên quan.",
    preIntegrationRoute_en:
      "Route to pre-integration message checks if the next step is clear.",
    preIntegrationRoute_vi:
      "Chuyển sang kiểm tra tin nhắn tiền tích hợp nếu bước tiếp theo rõ.",
  },
  {
    id: "b1-merge-workplace-task",
    level: "B1",
    focus: "workplace_task",
    title_en: "Merge a workplace update",
    title_vi: "Gộp một cập nhật nơi làm việc",
    scenario_en:
      "You need to explain a delay, give a reason, and offer a practical next step.",
    scenario_vi:
      "Bạn cần giải thích chậm trễ, đưa lý do và đề xuất bước tiếp theo thực tế.",
    canadaContext:
      "Useful for Canadian workplace scheduling, shift updates, and supervisor messages.",
    mergeReadiness: {
      mergePrompt_en:
        "Connect reason and plan without sounding too casual.",
      mergePrompt_vi:
        "Nối lý do và kế hoạch mà không quá thân mật.",
      sampleLine: {
        pa: "ਮੈਂ ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ, ਪਰ ਮੈਂ ਸ਼ਿਫਟ ਤੋਂ ਪਹਿਲਾਂ ਸੁਨੇਹਾ ਭੇਜ ਦਿੱਤਾ ਹੈ।",
        romanization:
          "main das mint der nal avanga, par main shift ton pehlan suneha bhej ditta hai.",
        en: "I will arrive ten minutes late, but I have sent a message before the shift.",
        vi: "Tôi sẽ đến muộn mười phút, nhưng tôi đã gửi tin nhắn trước ca làm.",
      },
      verificationSignals_en: [
        "Gives a time amount",
        "Explains the action taken",
        "Uses workplace-safe tone",
      ],
      verificationSignals_vi: [
        "Nêu lượng thời gian",
        "Giải thích hành động đã làm",
        "Dùng giọng phù hợp nơi làm việc",
      ],
    },
    commonTraps: [
      {
        trap_en: "Using a very casual tone with a supervisor.",
        trap_vi: "Dùng giọng quá thân mật với quản lý.",
        better: {
          pa: "ਮੈਂ ਤੁਹਾਨੂੰ ਪਹਿਲਾਂ ਦੱਸ ਰਿਹਾ ਹਾਂ।",
          romanization: "main tuhanu pehlan dass riha han.",
          en: "I am letting you know in advance.",
          vi: "Tôi báo cho bạn biết trước.",
        },
      },
    ],
    finalRegressionNote_en:
      "Final-readiness improves when the workplace message keeps reason, timing, and next step together.",
    finalRegressionNote_vi:
      "Sẵn sàng cuối tốt hơn khi tin nhắn nơi làm việc giữ lý do, thời gian và bước tiếp theo cùng nhau.",
    preIntegrationRoute_en:
      "Route to workplace integration only after the register remains respectful.",
    preIntegrationRoute_vi:
      "Chỉ chuyển sang tích hợp nơi làm việc sau khi sắc thái vẫn tôn trọng.",
  },
  {
    id: "b1-merge-housing-school-community",
    level: "B1",
    focus: "housing_school_community",
    title_en: "Connect housing, school, or community tasks",
    title_vi: "Kết nối nhiệm vụ nhà ở, trường học hoặc cộng đồng",
    scenario_en:
      "You need one sample that can adapt to a landlord, school office, or community program.",
    scenario_vi:
      "Bạn cần một mẫu có thể điều chỉnh cho chủ nhà, văn phòng trường hoặc chương trình cộng đồng.",
    canadaContext:
      "Useful for Canadian rental offices, school reception, libraries, and newcomer centres.",
    mergeReadiness: {
      mergePrompt_en:
        "Use a neutral request that names the document, appointment, or service.",
      mergePrompt_vi:
        "Dùng yêu cầu trung tính nêu giấy tờ, cuộc hẹn hoặc dịch vụ.",
      sampleLine: {
        pa: "ਮੈਨੂੰ ਇਸ ਫਾਰਮ ਬਾਰੇ ਮਦਦ ਚਾਹੀਦੀ ਹੈ ਅਤੇ ਮੈਂ ਸਮਾਂ ਪੁਸ਼ਟੀ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization:
          "mainu is form bare madad chahidi hai ate main sama pushti karna chahunda han.",
        en: "I need help with this form and I want to confirm the time.",
        vi: "Tôi cần giúp với mẫu đơn này và muốn xác nhận thời gian.",
      },
      verificationSignals_en: [
        "Names the form or service",
        "Keeps the request neutral",
        "Confirms a practical detail",
      ],
      verificationSignals_vi: [
        "Nêu mẫu đơn hoặc dịch vụ",
        "Giữ yêu cầu trung tính",
        "Xác nhận chi tiết thực tế",
      ],
    },
    commonTraps: [
      {
        trap_en: "Using the same greeting and register for every office.",
        trap_vi: "Dùng cùng lời chào và sắc thái cho mọi văn phòng.",
        better: {
          pa: "ਦਫ਼ਤਰ ਦੇ ਅਨੁਸਾਰ ਨਰਮ ਅਤੇ ਸਾਫ਼ ਬੋਲੋ।",
          romanization: "daftar de anusar naram ate saf bolo.",
          en: "Speak clearly and politely according to the office.",
          vi: "Nói rõ và lịch sự theo từng văn phòng.",
        },
      },
    ],
    finalRegressionNote_en:
      "Merge-readiness requires the learner to keep the task practical and avoid inventing policy details.",
    finalRegressionNote_vi:
      "Sẵn sàng gộp yêu cầu người học giữ nhiệm vụ thực tế và tránh bịa chi tiết chính sách.",
    preIntegrationRoute_en:
      "Route to community-task integration if the learner can swap the setting without changing the structure.",
    preIntegrationRoute_vi:
      "Chuyển sang tích hợp nhiệm vụ cộng đồng nếu người học có thể đổi bối cảnh mà không đổi cấu trúc.",
  },
  {
    id: "b1-merge-register-safe-repair",
    level: "B1",
    focus: "register_safe_repair",
    title_en: "Repair politely before merge",
    title_vi: "Sửa lời lịch sự trước khi gộp",
    scenario_en:
      "You said something too direct and need to repair the tone before continuing.",
    scenario_vi:
      "Bạn đã nói quá trực tiếp và cần sửa sắc thái trước khi tiếp tục.",
    canadaContext:
      "Useful for Canadian workplaces, service desks, schools, and housing offices.",
    mergeReadiness: {
      mergePrompt_en:
        "Acknowledge the wording, repair it politely, and continue with the same request.",
      mergePrompt_vi:
        "Thừa nhận cách nói, sửa lịch sự và tiếp tục cùng yêu cầu.",
      sampleLine: {
        pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੇਰਾ ਮਤਲਬ ਇਹ ਸੀ ਕਿ ਕੀ ਤੁਸੀਂ ਇਹ ਦੁਬਾਰਾ ਦੇਖ ਸਕਦੇ ਹੋ?",
        romanization:
          "maf karna, mera matlab ih si ki ki tusin ih dubara dekh sakde ho?",
        en: "Sorry, I meant: could you look at this again?",
        vi: "Xin lỗi, ý tôi là: bạn có thể xem lại phần này không?",
      },
      verificationSignals_en: [
        "Acknowledges the repair",
        "Uses a softer request",
        "Keeps the original task",
      ],
      verificationSignals_vi: [
        "Thừa nhận phần sửa",
        "Dùng yêu cầu nhẹ hơn",
        "Giữ nhiệm vụ ban đầu",
      ],
    },
    commonTraps: [
      {
        trap_en: "Apologizing and then dropping the original request.",
        trap_vi: "Xin lỗi rồi bỏ luôn yêu cầu ban đầu.",
        better: {
          pa: "ਮੈਂ ਗੱਲ ਨਰਮ ਕਰ ਰਿਹਾ ਹਾਂ, ਬੇਨਤੀ ਨਹੀਂ ਬਦਲ ਰਿਹਾ।",
          romanization:
            "main gall naram kar riha han, benti nahin badal riha.",
          en: "I am softening the wording, not changing the request.",
          vi: "Tôi đang làm cách nói nhẹ hơn, không đổi yêu cầu.",
        },
      },
    ],
    finalRegressionNote_en:
      "Native review is deferred. Merge-ready repair stays polite, clear, and tied to the same task.",
    finalRegressionNote_vi:
      "Đánh giá của người bản ngữ được để sau. Sửa lời sẵn sàng gộp vẫn lịch sự, rõ ràng và gắn với cùng nhiệm vụ.",
    preIntegrationRoute_en:
      "Route to register-safe pre-integration checks when the repair does not create a new issue.",
    preIntegrationRoute_vi:
      "Chuyển sang kiểm tra tiền tích hợp về sắc thái khi phần sửa không tạo vấn đề mới.",
  },
];
