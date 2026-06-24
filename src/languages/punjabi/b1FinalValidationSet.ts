export type PunjabiB1FinalValidationFocus =
  | "situation_explanation"
  | "event_retelling"
  | "clarification"
  | "service_recovery"
  | "issue_resolution"
  | "follow_up_message"
  | "workplace_task"
  | "housing_school_community"
  | "register_safe_repair";

export type PunjabiFinalValidationLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiFinalValidationTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiFinalValidationLine;
};

export type PunjabiFinalValidationCheck = {
  finalValidationPrompt_en: string;
  finalValidationPrompt_vi: string;
  sampleLine: PunjabiFinalValidationLine;
  validationSignals_en: string[];
  validationSignals_vi: string[];
};

export type PunjabiB1FinalValidationCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1FinalValidationFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  finalValidation: PunjabiFinalValidationCheck;
  commonTraps: PunjabiFinalValidationTrap[];
  crossCheckNote_en: string;
  crossCheckNote_vi: string;
  preIntegrationRoute_en: string;
  preIntegrationRoute_vi: string;
};

export const punjabiB1FinalValidationSet: PunjabiB1FinalValidationCard[] = [
  {
    id: "b1-final-validation-situation-explanation",
    level: "B1",
    focus: "situation_explanation",
    title_en: "Validate the situation explanation",
    title_vi: "Xác thực phần giải thích tình huống",
    scenario_en:
      "You need the same explanation to work in a service conversation and a written follow-up.",
    scenario_vi:
      "Bạn cần cùng phần giải thích dùng được trong trao đổi dịch vụ và phần theo dõi bằng văn bản.",
    canadaContext:
      "Useful for Canadian service counters, settlement offices, and public program intake.",
    finalValidation: {
      finalValidationPrompt_en:
        "Validate that the issue, timing, and next step are all present.",
      finalValidationPrompt_vi:
        "Xác thực rằng vấn đề, thời gian và bước tiếp theo đều có mặt.",
      sampleLine: {
        pa: "ਇਹ ਸਮੱਸਿਆ ਅੱਜ ਆਈ ਹੈ, ਅਤੇ ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਸਾਫ਼ ਚਾਹੀਦਾ ਹੈ।",
        romanization:
          "ih samassia ajj ai hai, ate mainu agla kadam saf chahida hai.",
        en: "This problem came up today, and I need the next step clearly.",
        vi: "Vấn đề này xảy ra hôm nay, và tôi cần bước tiếp theo rõ ràng.",
      },
      validationSignals_en: [
        "Names the problem",
        "Gives timing",
        "Asks for next step",
      ],
      validationSignals_vi: [
        "Nêu vấn đề",
        "Đưa thời gian",
        "Hỏi bước tiếp theo",
      ],
    },
    commonTraps: [
      {
        trap_en: "Adding a second unrelated issue during final validation.",
        trap_vi: "Thêm vấn đề thứ hai không liên quan trong lúc xác thực cuối.",
        better: {
          pa: "ਇੱਕ ਮੁੱਦਾ ਹੀ ਰੱਖੀਏ।",
          romanization: "ik mudda hi rakhiye.",
          en: "Let's keep only one issue.",
          vi: "Hãy giữ chỉ một vấn đề.",
        },
      },
    ],
    crossCheckNote_en:
      "Language practice only, not medical advice. Final-validation readiness is strong when the same explanation passes cross-check in speech and writing.",
    crossCheckNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Sẵn sàng xác thực cuối khi cùng phần giải thích qua được đối chiếu trong nói và viết.",
    preIntegrationRoute_en:
      "Route to pre-integration only if the explanation stays stable.",
    preIntegrationRoute_vi:
      "Chỉ chuyển sang tiền tích hợp nếu phần giải thích vẫn ổn định.",
  },
  {
    id: "b1-final-validation-event-retelling",
    level: "B1",
    focus: "event_retelling",
    title_en: "Validate event retelling",
    title_vi: "Xác thực phần kể lại sự việc",
    scenario_en:
      "A workplace, housing, or school report needs one clear order of events.",
    scenario_vi:
      "Báo cáo nơi làm việc, nhà ở hoặc trường học cần một thứ tự sự việc rõ ràng.",
    canadaContext:
      "Useful for Canadian supervisor notes, tenant messages, and school office updates.",
    finalValidation: {
      finalValidationPrompt_en:
        "Confirm that the event order does not change across versions.",
      finalValidationPrompt_vi:
        "Xác nhận thứ tự sự việc không đổi giữa các phiên bản.",
      sampleLine: {
        pa: "ਪਹਿਲਾਂ ਮੈਂ ਸੁਨੇਹਾ ਭੇਜਿਆ, ਫਿਰ ਜਵਾਬ ਆਇਆ, ਅਤੇ ਫਿਰ ਮਿਤੀ ਤੈਅ ਹੋਈ।",
        romanization:
          "pehlan main suneha bhejia, phir javab aia, ate phir miti tai hoi.",
        en: "First I sent a message, then a reply came, and then the date was set.",
        vi: "Trước hết tôi gửi tin nhắn, sau đó có phản hồi, rồi ngày được xác định.",
      },
      validationSignals_en: [
        "Uses sequence markers",
        "Keeps one timeline",
        "Ends with current status",
      ],
      validationSignals_vi: [
        "Dùng mốc trình tự",
        "Giữ một dòng thời gian",
        "Kết thúc bằng trạng thái hiện tại",
      ],
    },
    commonTraps: [
      {
        trap_en: "Retelling the same event in a new order each time.",
        trap_vi: "Kể cùng sự việc theo thứ tự mới mỗi lần.",
        better: {
          pa: "ਹਰ ਵਾਰੀ ਉਹੀ ਕ੍ਰਮ ਵਰਤੋ।",
          romanization: "har vari ohi kram varto.",
          en: "Use the same order every time.",
          vi: "Dùng cùng thứ tự mỗi lần.",
        },
      },
    ],
    crossCheckNote_en:
      "Language practice only, not legal or financial advice. Shahmukhi is awareness only, not a full course.",
    crossCheckNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ.",
    preIntegrationRoute_en:
      "Route to final-validation review again if the timeline changes.",
    preIntegrationRoute_vi:
      "Quay lại rà soát xác thực cuối nếu dòng thời gian thay đổi.",
  },
  {
    id: "b1-final-validation-clarification",
    level: "B1",
    focus: "clarification",
    title_en: "Validate clarification of next steps",
    title_vi: "Xác thực phần làm rõ bước tiếp theo",
    scenario_en:
      "You need to confirm a date, address, document, or room before continuing.",
    scenario_vi:
      "Bạn cần xác nhận ngày, địa chỉ, giấy tờ hoặc phòng trước khi tiếp tục.",
    canadaContext:
      "Useful for Canadian appointment desks, school forms, and community programs.",
    finalValidation: {
      finalValidationPrompt_en:
        "Ask for the missing detail and request written confirmation.",
      finalValidationPrompt_vi:
        "Hỏi chi tiết còn thiếu và xin xác nhận bằng văn bản.",
      sampleLine: {
        pa: "ਕੀ ਤੁਸੀਂ ਅਗਲਾ ਕਦਮ ਅਤੇ ਸਮਾਂ ਈਮੇਲ ਵਿੱਚ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization:
          "ki tusin agla kadam ate sama email vich bhej sakde ho?",
        en: "Can you send the next step and time by email?",
        vi: "Bạn có thể gửi bước tiếp theo và thời gian qua email không?",
      },
      validationSignals_en: [
        "Names next step",
        "Confirms time",
        "Requests written follow-up",
      ],
      validationSignals_vi: [
        "Nêu bước tiếp theo",
        "Xác nhận thời gian",
        "Xin theo dõi bằng văn bản",
      ],
    },
    commonTraps: [
      {
        trap_en: "Pretending a date or address is clear.",
        trap_vi: "Giả vờ ngày hoặc địa chỉ đã rõ.",
        better: {
          pa: "ਮੈਨੂੰ ਮਿਤੀ ਫਿਰ ਪੁਸ਼ਟੀ ਕਰਨੀ ਹੈ।",
          romanization: "mainu miti phir pushti karni hai.",
          en: "I need to confirm the date again.",
          vi: "Tôi cần xác nhận lại ngày.",
        },
      },
    ],
    crossCheckNote_en:
      "Final-validation succeeds when one unclear detail is named before more details are added.",
    crossCheckNote_vi:
      "Xác thực cuối đạt khi một chi tiết chưa rõ được nêu trước khi thêm chi tiết khác.",
    preIntegrationRoute_en:
      "Route to pre-integration clarification when the learner can repeat the confirmed detail.",
    preIntegrationRoute_vi:
      "Chuyển sang làm rõ tiền tích hợp khi người học có thể lặp lại chi tiết đã xác nhận.",
  },
  {
    id: "b1-final-validation-service-recovery",
    level: "B1",
    focus: "service_recovery",
    title_en: "Validate service recovery",
    title_vi: "Xác thực phục hồi dịch vụ",
    scenario_en:
      "A support call or service chat needs a polite reset before the next step.",
    scenario_vi:
      "Cuộc gọi hỗ trợ hoặc chat dịch vụ cần đặt lại lịch sự trước bước tiếp theo.",
    canadaContext:
      "Useful for Canadian public service desks, phone lines, and support chats.",
    finalValidation: {
      finalValidationPrompt_en:
        "Validate that the reset is polite and keeps the same request.",
      finalValidationPrompt_vi:
        "Xác thực phần đặt lại lịch sự và giữ cùng yêu cầu.",
      sampleLine: {
        pa: "ਮੈਂ ਆਪਣੀ ਬੇਨਤੀ ਫਿਰ ਸਾਫ਼ ਕਰਦਾ ਹਾਂ, ਪਰ ਬੇਨਤੀ ਉਹੀ ਹੈ।",
        romanization:
          "main apni benti phir saf karda han, par benti ohi hai.",
        en: "I will clarify my request again, but the request is the same.",
        vi: "Tôi sẽ làm rõ lại yêu cầu của mình, nhưng yêu cầu vẫn như cũ.",
      },
      validationSignals_en: [
        "Polite reset",
        "Same request",
        "Clear continuation",
      ],
      validationSignals_vi: [
        "Đặt lại lịch sự",
        "Cùng yêu cầu",
        "Tiếp tục rõ ràng",
      ],
    },
    commonTraps: [
      {
        trap_en: "Using the reset to start a new complaint.",
        trap_vi: "Dùng phần đặt lại để bắt đầu khiếu nại mới.",
        better: {
          pa: "ਪਹਿਲੀ ਬੇਨਤੀ ਹੀ ਜਾਰੀ ਰੱਖੀਏ।",
          romanization: "pehli benti hi jari rakhiye.",
          en: "Let's continue with the first request.",
          vi: "Hãy tiếp tục với yêu cầu đầu tiên.",
        },
      },
    ],
    crossCheckNote_en:
      "Native review is deferred. Service recovery is valid when the reset is repeatable and not escalatory.",
    crossCheckNote_vi:
      "Đánh giá của người bản ngữ được để sau. Phục hồi dịch vụ hợp lệ khi câu đặt lại lặp lại được và không leo thang.",
    preIntegrationRoute_en:
      "Route to service pre-integration only after the reset line stays stable.",
    preIntegrationRoute_vi:
      "Chỉ chuyển sang tiền tích hợp dịch vụ sau khi câu đặt lại ổn định.",
  },
  {
    id: "b1-final-validation-issue-resolution",
    level: "B1",
    focus: "issue_resolution",
    title_en: "Validate issue resolution",
    title_vi: "Xác thực giải quyết vấn đề",
    scenario_en:
      "You need to link a problem, correction, and confirmation in one checkable sample.",
    scenario_vi:
      "Bạn cần nối vấn đề, phần sửa và xác nhận trong một mẫu có thể kiểm tra.",
    canadaContext:
      "Useful for Canadian billing questions, tenant repair requests, and school records.",
    finalValidation: {
      finalValidationPrompt_en:
        "Confirm that the issue and requested correction remain linked.",
      finalValidationPrompt_vi:
        "Xác nhận vấn đề và phần sửa được yêu cầu vẫn gắn với nhau.",
      sampleLine: {
        pa: "ਇਸ ਰਿਕਾਰਡ ਵਿੱਚ ਗਲਤੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਸਨੂੰ ਠੀਕ ਕਰਕੇ ਮੈਨੂੰ ਪੁਸ਼ਟੀ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization:
          "is record vich galti hai. ki tusin isnu thik karke mainu pushti bhej sakde ho?",
        en: "There is a mistake in this record. Can you correct it and send me confirmation?",
        vi: "Có lỗi trong hồ sơ này. Bạn có thể sửa và gửi xác nhận cho tôi không?",
      },
      validationSignals_en: [
        "Names the record",
        "Requests correction",
        "Asks for confirmation",
      ],
      validationSignals_vi: [
        "Nêu hồ sơ",
        "Yêu cầu sửa",
        "Xin xác nhận",
      ],
    },
    commonTraps: [
      {
        trap_en: "Asking for confirmation without saying what must be corrected.",
        trap_vi: "Xin xác nhận mà không nói cần sửa điều gì.",
        better: {
          pa: "ਗਲਤੀ ਇਸ ਹਿੱਸੇ ਵਿੱਚ ਹੈ।",
          romanization: "galti is hisse vich hai.",
          en: "The mistake is in this part.",
          vi: "Lỗi nằm ở phần này.",
        },
      },
    ],
    crossCheckNote_en:
      "Language practice only, not legal or financial advice. Final validation should keep correction language practical.",
    crossCheckNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Xác thực cuối nên giữ ngôn ngữ sửa lỗi thực tế.",
    preIntegrationRoute_en:
      "Route to issue-resolution pre-integration when the correction is checkable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp giải quyết vấn đề khi phần sửa có thể kiểm tra.",
  },
  {
    id: "b1-final-validation-follow-up-message",
    level: "B1",
    focus: "follow_up_message",
    title_en: "Validate follow-up message",
    title_vi: "Xác thực tin nhắn theo dõi",
    scenario_en:
      "A follow-up message needs to refer to the earlier request and ask for the next step.",
    scenario_vi:
      "Tin nhắn theo dõi cần nhắc yêu cầu trước và hỏi bước tiếp theo.",
    canadaContext:
      "Useful for Canadian emails to landlords, school offices, clinics, and community agencies.",
    finalValidation: {
      finalValidationPrompt_en:
        "Validate that the follow-up does not restart the whole case.",
      finalValidationPrompt_vi:
        "Xác thực phần theo dõi không bắt đầu lại toàn bộ vụ việc.",
      sampleLine: {
        pa: "ਮੈਂ ਪਿਛਲੀ ਬੇਨਤੀ ਬਾਰੇ ਪਾਲਣਾ ਕਰ ਰਿਹਾ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।",
        romanization:
          "main pichhli benti bare palna kar riha han. kirpa karke agla kadam dasso.",
        en: "I am following up on the previous request. Please tell me the next step.",
        vi: "Tôi đang theo dõi yêu cầu trước. Vui lòng cho tôi biết bước tiếp theo.",
      },
      validationSignals_en: [
        "References previous request",
        "Stays concise",
        "Asks for next step",
      ],
      validationSignals_vi: [
        "Nhắc yêu cầu trước",
        "Giữ ngắn gọn",
        "Hỏi bước tiếp theo",
      ],
    },
    commonTraps: [
      {
        trap_en: "Repeating every old detail instead of following up.",
        trap_vi: "Lặp lại mọi chi tiết cũ thay vì theo dõi.",
        better: {
          pa: "ਇਹ ਪਾਲਣਾ ਹੈ, ਨਵੀਂ ਰਿਪੋਰਟ ਨਹੀਂ।",
          romanization: "ih palna hai, navi report nahin.",
          en: "This is a follow-up, not a new report.",
          vi: "Đây là phần theo dõi, không phải báo cáo mới.",
        },
      },
    ],
    crossCheckNote_en:
      "Final-validation is strong when the follow-up adds a next step without adding unrelated facts.",
    crossCheckNote_vi:
      "Xác thực cuối tốt khi phần theo dõi thêm bước tiếp theo mà không thêm thông tin không liên quan.",
    preIntegrationRoute_en:
      "Route to message pre-integration if the previous request and next action stay separate.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp tin nhắn nếu yêu cầu trước và hành động tiếp theo vẫn tách biệt.",
  },
  {
    id: "b1-final-validation-workplace-task",
    level: "B1",
    focus: "workplace_task",
    title_en: "Validate a workplace task",
    title_vi: "Xác thực nhiệm vụ nơi làm việc",
    scenario_en:
      "A workplace message must combine reason, timing, and action in respectful language.",
    scenario_vi:
      "Tin nhắn nơi làm việc phải kết hợp lý do, thời gian và hành động bằng ngôn ngữ tôn trọng.",
    canadaContext:
      "Useful for Canadian shift updates, supervisor messages, and schedule changes.",
    finalValidation: {
      finalValidationPrompt_en:
        "Check that the update is respectful, timed, and actionable.",
      finalValidationPrompt_vi:
        "Kiểm tra cập nhật có tôn trọng, có thời gian và có hành động.",
      sampleLine: {
        pa: "ਮੈਂ ਅੱਜ ਪੰਦਰਾਂ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ, ਅਤੇ ਮੈਂ ਸ਼ਿਫਟ ਤੋਂ ਪਹਿਲਾਂ ਦੱਸ ਰਿਹਾ ਹਾਂ।",
        romanization:
          "main ajj pandran mint der nal avanga, ate main shift ton pehlan dass riha han.",
        en: "I will arrive fifteen minutes late today, and I am letting you know before the shift.",
        vi: "Hôm nay tôi sẽ đến muộn mười lăm phút, và tôi báo trước ca làm.",
      },
      validationSignals_en: [
        "Gives timing",
        "Uses respectful register",
        "States action taken",
      ],
      validationSignals_vi: [
        "Nêu thời gian",
        "Dùng sắc thái tôn trọng",
        "Nói hành động đã làm",
      ],
    },
    commonTraps: [
      {
        trap_en: "Using friend-level casual language with a supervisor.",
        trap_vi: "Dùng ngôn ngữ thân mật như bạn bè với quản lý.",
        better: {
          pa: "ਮੈਂ ਤੁਹਾਨੂੰ ਪਹਿਲਾਂ ਸੂਚਿਤ ਕਰ ਰਿਹਾ ਹਾਂ।",
          romanization: "main tuhanu pehlan suchit kar riha han.",
          en: "I am informing you in advance.",
          vi: "Tôi thông báo trước cho bạn.",
        },
      },
    ],
    crossCheckNote_en:
      "Workplace final-validation passes when timing, reason, and action remain in a respectful register.",
    crossCheckNote_vi:
      "Xác thực cuối nơi làm việc đạt khi thời gian, lý do và hành động vẫn ở sắc thái tôn trọng.",
    preIntegrationRoute_en:
      "Route to workplace pre-integration after the register and timing pass cross-check.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp nơi làm việc sau khi sắc thái và thời gian qua đối chiếu.",
  },
  {
    id: "b1-final-validation-housing-school-community",
    level: "B1",
    focus: "housing_school_community",
    title_en: "Validate public task wording",
    title_vi: "Xác thực cách nói cho nhiệm vụ công cộng",
    scenario_en:
      "A neutral request must work for housing, school, and community settings without invented policy details.",
    scenario_vi:
      "Yêu cầu trung tính phải dùng được cho nhà ở, trường học và cộng đồng mà không bịa chi tiết chính sách.",
    canadaContext:
      "Useful for Canadian rental offices, schools, libraries, and newcomer centres.",
    finalValidation: {
      finalValidationPrompt_en:
        "Confirm that the request names the service or form and stays neutral.",
      finalValidationPrompt_vi:
        "Xác nhận yêu cầu nêu dịch vụ hoặc mẫu đơn và vẫn trung tính.",
      sampleLine: {
        pa: "ਮੈਨੂੰ ਇਸ ਫਾਰਮ ਅਤੇ ਅਗਲੀ ਮਿਤੀ ਬਾਰੇ ਸਪਸ਼ਟ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
        romanization:
          "mainu is form ate agli miti bare spasht madad chahidi hai.",
        en: "I need clear help with this form and the next date.",
        vi: "Tôi cần được giúp rõ ràng với mẫu đơn này và ngày tiếp theo.",
      },
      validationSignals_en: [
        "Names the form",
        "Asks for practical help",
        "Avoids policy claims",
      ],
      validationSignals_vi: [
        "Nêu mẫu đơn",
        "Xin giúp thực tế",
        "Tránh khẳng định chính sách",
      ],
    },
    commonTraps: [
      {
        trap_en: "Assuming every office follows the same rule.",
        trap_vi: "Cho rằng mọi văn phòng theo cùng một quy định.",
        better: {
          pa: "ਇਸ ਦਫ਼ਤਰ ਦੀ ਪ੍ਰਕਿਰਿਆ ਕੀ ਹੈ?",
          romanization: "is daftar di prakiria ki hai?",
          en: "What is this office's process?",
          vi: "Quy trình của văn phòng này là gì?",
        },
      },
    ],
    crossCheckNote_en:
      "Final-validation language should stay practical and avoid legal, financial, or eligibility advice.",
    crossCheckNote_vi:
      "Ngôn ngữ xác thực cuối nên giữ tính thực tế và tránh tư vấn pháp lý, tài chính hoặc điều kiện đủ.",
    preIntegrationRoute_en:
      "Route to public-task pre-integration if the wording works across housing, school, and community contexts.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp nhiệm vụ công nếu cách nói dùng được qua nhà ở, trường học và cộng đồng.",
  },
  {
    id: "b1-final-validation-register-safe-repair",
    level: "B1",
    focus: "register_safe_repair",
    title_en: "Validate register-safe repair",
    title_vi: "Xác thực phần sửa lời an toàn về sắc thái",
    scenario_en:
      "A direct phrase needs to be softened while keeping the original task active.",
    scenario_vi:
      "Một câu quá trực tiếp cần được làm nhẹ trong khi vẫn giữ nhiệm vụ ban đầu.",
    canadaContext:
      "Useful for Canadian workplaces, service counters, housing offices, and schools.",
    finalValidation: {
      finalValidationPrompt_en:
        "Check that the repair softens tone without deleting the request.",
      finalValidationPrompt_vi:
        "Kiểm tra phần sửa làm nhẹ giọng mà không xóa yêu cầu.",
      sampleLine: {
        pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੇਰਾ ਮਤਲਬ ਇਹ ਸੀ: ਕੀ ਤੁਸੀਂ ਇਹ ਦੁਬਾਰਾ ਦੇਖ ਸਕਦੇ ਹੋ?",
        romanization:
          "maf karna, mera matlab ih si: ki tusin ih dubara dekh sakde ho?",
        en: "Sorry, what I meant was: could you look at this again?",
        vi: "Xin lỗi, ý tôi là: bạn có thể xem lại phần này không?",
      },
      validationSignals_en: [
        "Acknowledges wording",
        "Softens register",
        "Keeps request active",
      ],
      validationSignals_vi: [
        "Thừa nhận cách nói",
        "Làm nhẹ sắc thái",
        "Giữ yêu cầu tiếp tục",
      ],
    },
    commonTraps: [
      {
        trap_en: "Apologizing and abandoning the actual request.",
        trap_vi: "Xin lỗi rồi bỏ luôn yêu cầu thật.",
        better: {
          pa: "ਬੇਨਤੀ ਉਹੀ ਹੈ, ਲਹਿਜ਼ਾ ਨਰਮ ਹੈ।",
          romanization: "benti ohi hai, lahiza naram hai.",
          en: "The request is the same; the tone is softer.",
          vi: "Yêu cầu vẫn như cũ; giọng nhẹ hơn.",
        },
      },
    ],
    crossCheckNote_en:
      "Native review is deferred. Final validation passes when the repair remains polite, specific, and tied to the same task.",
    crossCheckNote_vi:
      "Đánh giá của người bản ngữ được để sau. Xác thực cuối đạt khi phần sửa vẫn lịch sự, cụ thể và gắn với cùng nhiệm vụ.",
    preIntegrationRoute_en:
      "Route to register-safe pre-integration when tone and task both remain clear.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp về sắc thái khi cả giọng và nhiệm vụ đều rõ.",
  },
];
