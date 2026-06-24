export type PunjabiB1CrossCheckFocus =
  | "situation_explanation"
  | "event_retelling"
  | "clarification"
  | "service_recovery"
  | "issue_resolution"
  | "follow_up_message"
  | "workplace_task"
  | "housing_school_community"
  | "register_safe_repair";

export type PunjabiCrossCheckLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiCrossCheckTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiCrossCheckLine;
};

export type PunjabiCrossCheckVerification = {
  crossCheckPrompt_en: string;
  crossCheckPrompt_vi: string;
  sampleLine: PunjabiCrossCheckLine;
  verificationSignals_en: string[];
  verificationSignals_vi: string[];
};

export type PunjabiB1CrossCheckCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1CrossCheckFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  crossCheck: PunjabiCrossCheckVerification;
  commonTraps: PunjabiCrossCheckTrap[];
  preIntegrationNote_en: string;
  preIntegrationNote_vi: string;
  verificationRoute_en: string;
  verificationRoute_vi: string;
};

export const punjabiB1CrossCheckSamples: PunjabiB1CrossCheckCard[] = [
  {
    id: "b1-cross-check-situation-explanation",
    level: "B1",
    focus: "situation_explanation",
    title_en: "Cross-check the situation before action",
    title_vi: "Đối chiếu tình huống trước khi hành động",
    scenario_en:
      "You need to verify that the same situation explanation works for a service desk and a follow-up email.",
    scenario_vi:
      "Bạn cần xác minh cùng phần giải thích tình huống dùng được ở quầy dịch vụ và email theo dõi.",
    canadaContext:
      "Useful for Canadian service counters, settlement offices, and community intake desks.",
    crossCheck: {
      crossCheckPrompt_en:
        "Check that the issue, time, and requested next step stay the same.",
      crossCheckPrompt_vi:
        "Kiểm tra vấn đề, thời gian và bước tiếp theo được yêu cầu vẫn giống nhau.",
      sampleLine: {
        pa: "ਇਹ ਮੁੱਦਾ ਕੱਲ੍ਹ ਆਇਆ ਸੀ, ਅਤੇ ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਪੁਸ਼ਟੀ ਕਰਨਾ ਹੈ।",
        romanization:
          "ih mudda kalh aia si, ate mainu agla kadam pushti karna hai.",
        en: "This issue came up yesterday, and I need to confirm the next step.",
        vi: "Vấn đề này xảy ra hôm qua, và tôi cần xác nhận bước tiếp theo.",
      },
      verificationSignals_en: [
        "Same issue",
        "Same time marker",
        "Same next-step request",
      ],
      verificationSignals_vi: [
        "Cùng vấn đề",
        "Cùng mốc thời gian",
        "Cùng yêu cầu bước tiếp theo",
      ],
    },
    commonTraps: [
      {
        trap_en: "Changing the main fact when moving from speech to email.",
        trap_vi: "Đổi thông tin chính khi chuyển từ nói sang email.",
        better: {
          pa: "ਮੁੱਖ ਗੱਲ ਉਹੀ ਰੱਖੋ।",
          romanization: "mukh gall ohi rakho.",
          en: "Keep the main point the same.",
          vi: "Giữ nguyên ý chính.",
        },
      },
    ],
    preIntegrationNote_en:
      "Language practice only, not medical advice. Cross-check readiness is strong when the explanation survives a format change.",
    preIntegrationNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Sẵn sàng đối chiếu khi phần giải thích vẫn ổn khi đổi định dạng.",
    verificationRoute_en:
      "Route to pre-integration verification if the facts remain stable.",
    verificationRoute_vi:
      "Chuyển sang xác minh tiền tích hợp nếu thông tin vẫn ổn định.",
  },
  {
    id: "b1-cross-check-event-retelling",
    level: "B1",
    focus: "event_retelling",
    title_en: "Cross-check event order",
    title_vi: "Đối chiếu thứ tự sự việc",
    scenario_en:
      "A housing or workplace report needs the same event order across notes and spoken explanation.",
    scenario_vi:
      "Một báo cáo nhà ở hoặc nơi làm việc cần cùng thứ tự sự việc trong ghi chú và phần nói.",
    canadaContext:
      "Useful for Canadian tenant messages, school offices, and supervisor updates.",
    crossCheck: {
      crossCheckPrompt_en:
        "Verify the sequence before adding the next action.",
      crossCheckPrompt_vi:
        "Xác minh trình tự trước khi thêm hành động tiếp theo.",
      sampleLine: {
        pa: "ਪਹਿਲਾਂ ਮੈਂ ਫੋਟੋ ਭੇਜੀ, ਫਿਰ ਦਫ਼ਤਰ ਨੇ ਜਵਾਬ ਦਿੱਤਾ, ਅਤੇ ਫਿਰ ਸਮਾਂ ਤੈਅ ਹੋਇਆ।",
        romanization:
          "pehlan main photo bheji, phir daftar ne javab ditta, ate phir sama tai hoya.",
        en: "First I sent the photo, then the office replied, and then the time was set.",
        vi: "Trước hết tôi gửi ảnh, rồi văn phòng trả lời, sau đó thời gian được xác định.",
      },
      verificationSignals_en: [
        "Uses sequence markers",
        "Keeps one timeline",
        "Ends with the current status",
      ],
      verificationSignals_vi: [
        "Dùng mốc trình tự",
        "Giữ một dòng thời gian",
        "Kết thúc bằng trạng thái hiện tại",
      ],
    },
    commonTraps: [
      {
        trap_en: "Adding a later detail before the first event is clear.",
        trap_vi: "Thêm chi tiết sau trước khi sự việc đầu rõ.",
        better: {
          pa: "ਪਹਿਲੀ ਗੱਲ ਪਹਿਲਾਂ ਦੱਸੋ।",
          romanization: "pehli gall pehlan dasso.",
          en: "Say the first point first.",
          vi: "Nói điểm đầu tiên trước.",
        },
      },
    ],
    preIntegrationNote_en:
      "Language practice only, not legal or financial advice. Shahmukhi is awareness only, not a full course.",
    preIntegrationNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ.",
    verificationRoute_en:
      "Route to final-regression review if the timeline changes between versions.",
    verificationRoute_vi:
      "Chuyển sang rà soát hồi quy cuối nếu dòng thời gian đổi giữa các phiên bản.",
  },
  {
    id: "b1-cross-check-clarification",
    level: "B1",
    focus: "clarification",
    title_en: "Cross-check clarification details",
    title_vi: "Đối chiếu chi tiết làm rõ",
    scenario_en:
      "You need to confirm a date, address, or document before a longer task starts.",
    scenario_vi:
      "Bạn cần xác nhận ngày, địa chỉ hoặc giấy tờ trước khi nhiệm vụ dài hơn bắt đầu.",
    canadaContext:
      "Useful for Canadian appointments, school forms, library cards, and program intake.",
    crossCheck: {
      crossCheckPrompt_en:
        "Ask for one missing detail and confirm how it will be sent.",
      crossCheckPrompt_vi:
        "Hỏi một chi tiết còn thiếu và xác nhận cách gửi chi tiết đó.",
      sampleLine: {
        pa: "ਕੀ ਤੁਸੀਂ ਮਿਤੀ ਅਤੇ ਪਤਾ ਲਿਖ ਕੇ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin miti ate pata likh ke bhej sakde ho?",
        en: "Can you send the date and address in writing?",
        vi: "Bạn có thể gửi ngày và địa chỉ bằng văn bản không?",
      },
      verificationSignals_en: [
        "Targets specific details",
        "Requests written confirmation",
        "Avoids vague confusion",
      ],
      verificationSignals_vi: [
        "Nhắm chi tiết cụ thể",
        "Xin xác nhận bằng văn bản",
        "Tránh mơ hồ",
      ],
    },
    commonTraps: [
      {
        trap_en: "Saying only that everything is unclear.",
        trap_vi: "Chỉ nói mọi thứ đều không rõ.",
        better: {
          pa: "ਮੈਨੂੰ ਸਿਰਫ਼ ਪਤਾ ਸਪਸ਼ਟ ਕਰਨਾ ਹੈ।",
          romanization: "mainu sirf pata spasht karna hai.",
          en: "I only need to clarify the address.",
          vi: "Tôi chỉ cần làm rõ địa chỉ.",
        },
      },
    ],
    preIntegrationNote_en:
      "Cross-check readiness improves when the learner verifies one detail before adding another.",
    preIntegrationNote_vi:
      "Sẵn sàng đối chiếu tốt hơn khi người học xác minh một chi tiết trước khi thêm chi tiết khác.",
    verificationRoute_en:
      "Route to pre-integration clarification if the same question works in phone and email contexts.",
    verificationRoute_vi:
      "Chuyển sang làm rõ tiền tích hợp nếu cùng câu hỏi dùng được trong điện thoại và email.",
  },
  {
    id: "b1-cross-check-service-recovery",
    level: "B1",
    focus: "service_recovery",
    title_en: "Cross-check a service reset",
    title_vi: "Đối chiếu câu đặt lại dịch vụ",
    scenario_en:
      "A service conversation reset needs to keep the request stable and polite.",
    scenario_vi:
      "Phần đặt lại cuộc trò chuyện dịch vụ cần giữ yêu cầu ổn định và lịch sự.",
    canadaContext:
      "Useful for Canadian support chats, service phone lines, and front desks.",
    crossCheck: {
      crossCheckPrompt_en:
        "Verify that the reset clarifies the request without changing it.",
      crossCheckPrompt_vi:
        "Xác minh phần đặt lại làm rõ yêu cầu mà không đổi yêu cầu.",
      sampleLine: {
        pa: "ਮੈਂ ਬੇਨਤੀ ਨਹੀਂ ਬਦਲ ਰਿਹਾ, ਸਿਰਫ਼ ਇਸਨੂੰ ਦੁਬਾਰਾ ਸਾਫ਼ ਕਰ ਰਿਹਾ ਹਾਂ।",
        romanization:
          "main benti nahin badal riha, sirf isnu dubara saf kar riha han.",
        en: "I am not changing the request; I am only making it clear again.",
        vi: "Tôi không đổi yêu cầu; tôi chỉ làm rõ lại yêu cầu đó.",
      },
      verificationSignals_en: [
        "Same request",
        "Clear reset",
        "Polite service register",
      ],
      verificationSignals_vi: [
        "Cùng yêu cầu",
        "Đặt lại rõ",
        "Sắc thái dịch vụ lịch sự",
      ],
    },
    commonTraps: [
      {
        trap_en: "Starting a new complaint during the reset.",
        trap_vi: "Bắt đầu khiếu nại mới trong lúc đặt lại.",
        better: {
          pa: "ਇੱਕ ਹੀ ਬੇਨਤੀ ਰੱਖੀਏ।",
          romanization: "ik hi benti rakhiye.",
          en: "Let's keep one request.",
          vi: "Hãy giữ một yêu cầu.",
        },
      },
    ],
    preIntegrationNote_en:
      "Native review is deferred. Cross-check service recovery is ready when the reset is repeatable.",
    preIntegrationNote_vi:
      "Đánh giá của người bản ngữ được để sau. Phục hồi dịch vụ sẵn sàng đối chiếu khi câu đặt lại lặp lại được.",
    verificationRoute_en:
      "Route to service-recovery integration after the same reset works in chat and phone tasks.",
    verificationRoute_vi:
      "Chuyển sang tích hợp phục hồi dịch vụ sau khi cùng câu đặt lại dùng được trong chat và điện thoại.",
  },
  {
    id: "b1-cross-check-issue-resolution",
    level: "B1",
    focus: "issue_resolution",
    title_en: "Cross-check issue and correction",
    title_vi: "Đối chiếu vấn đề và phần sửa",
    scenario_en:
      "You need to verify that an issue, correction, and confirmation request stay linked.",
    scenario_vi:
      "Bạn cần xác minh vấn đề, phần sửa và yêu cầu xác nhận vẫn gắn với nhau.",
    canadaContext:
      "Useful for Canadian billing, housing maintenance, school records, and public services.",
    crossCheck: {
      crossCheckPrompt_en:
        "Name the issue, request correction, and ask how confirmation will happen.",
      crossCheckPrompt_vi:
        "Nêu vấn đề, yêu cầu sửa và hỏi cách xác nhận.",
      sampleLine: {
        pa: "ਇਸ ਜਾਣਕਾਰੀ ਵਿੱਚ ਗਲਤੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਸਨੂੰ ਠੀਕ ਕਰਕੇ ਪੁਸ਼ਟੀ ਭੇਜੋਗੇ?",
        romanization:
          "is jankari vich galti hai. ki tusin isnu thik karke pushti bhejoge?",
        en: "There is a mistake in this information. Will you correct it and send confirmation?",
        vi: "Có lỗi trong thông tin này. Bạn sẽ sửa và gửi xác nhận chứ?",
      },
      verificationSignals_en: [
        "Names the error",
        "Requests correction",
        "Asks for confirmation",
      ],
      verificationSignals_vi: [
        "Nêu lỗi",
        "Yêu cầu sửa",
        "Xin xác nhận",
      ],
    },
    commonTraps: [
      {
        trap_en: "Asking for confirmation before naming the correction.",
        trap_vi: "Xin xác nhận trước khi nêu phần cần sửa.",
        better: {
          pa: "ਪਹਿਲਾਂ ਗਲਤੀ ਦੱਸੋ, ਫਿਰ ਪੁਸ਼ਟੀ ਮੰਗੋ।",
          romanization: "pehlan galti dasso, phir pushti mango.",
          en: "First name the mistake, then ask for confirmation.",
          vi: "Trước tiên nêu lỗi, rồi xin xác nhận.",
        },
      },
    ],
    preIntegrationNote_en:
      "Language practice only, not legal or financial advice. The cross-check should not invent policy details.",
    preIntegrationNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Phần đối chiếu không nên bịa chi tiết chính sách.",
    verificationRoute_en:
      "Route to issue-resolution pre-integration when the correction is checkable.",
    verificationRoute_vi:
      "Chuyển sang tiền tích hợp giải quyết vấn đề khi phần sửa có thể kiểm tra.",
  },
  {
    id: "b1-cross-check-follow-up-message",
    level: "B1",
    focus: "follow_up_message",
    title_en: "Cross-check follow-up continuity",
    title_vi: "Đối chiếu sự liên tục của tin nhắn theo dõi",
    scenario_en:
      "A follow-up message needs to connect to the previous contact without restarting the whole case.",
    scenario_vi:
      "Tin nhắn theo dõi cần nối với liên hệ trước mà không kể lại toàn bộ vụ việc.",
    canadaContext:
      "Useful for Canadian emails to landlords, school offices, clinics, and community agencies.",
    crossCheck: {
      crossCheckPrompt_en:
        "Refer to the previous request and ask for the next practical step.",
      crossCheckPrompt_vi:
        "Nhắc yêu cầu trước và hỏi bước thực tế tiếp theo.",
      sampleLine: {
        pa: "ਮੈਂ ਪਿਛਲੀ ਬੇਨਤੀ ਬਾਰੇ ਪਾਲਣਾ ਕਰ ਰਿਹਾ ਹਾਂ। ਕੀ ਅਗਲਾ ਕਦਮ ਤੈਅ ਹੋ ਗਿਆ ਹੈ?",
        romanization:
          "main pichhli benti bare palna kar riha han. ki agla kadam tai ho gia hai?",
        en: "I am following up on the previous request. Has the next step been set?",
        vi: "Tôi đang theo dõi yêu cầu trước. Bước tiếp theo đã được xác định chưa?",
      },
      verificationSignals_en: [
        "References prior contact",
        "Keeps the message short",
        "Asks for next step",
      ],
      verificationSignals_vi: [
        "Nhắc liên hệ trước",
        "Giữ tin nhắn ngắn",
        "Hỏi bước tiếp theo",
      ],
    },
    commonTraps: [
      {
        trap_en: "Adding unrelated background in the follow-up.",
        trap_vi: "Thêm bối cảnh không liên quan trong tin nhắn theo dõi.",
        better: {
          pa: "ਇਹ ਸਿਰਫ਼ ਪਿਛਲੀ ਬੇਨਤੀ ਦੀ ਪਾਲਣਾ ਹੈ।",
          romanization: "ih sirf pichhli benti di palna hai.",
          en: "This is only a follow-up to the previous request.",
          vi: "Đây chỉ là phần theo dõi yêu cầu trước.",
        },
      },
    ],
    preIntegrationNote_en:
      "Cross-check readiness is strong when the follow-up adds action but not new confusion.",
    preIntegrationNote_vi:
      "Sẵn sàng đối chiếu khi phần theo dõi thêm hành động mà không thêm rối.",
    verificationRoute_en:
      "Route to message pre-integration if the previous request and next step stay separate.",
    verificationRoute_vi:
      "Chuyển sang tiền tích hợp tin nhắn nếu yêu cầu trước và bước tiếp theo vẫn tách biệt.",
  },
  {
    id: "b1-cross-check-workplace-task",
    level: "B1",
    focus: "workplace_task",
    title_en: "Cross-check a workplace update",
    title_vi: "Đối chiếu cập nhật nơi làm việc",
    scenario_en:
      "A workplace update must explain the situation, timing, and next action respectfully.",
    scenario_vi:
      "Cập nhật nơi làm việc phải giải thích tình huống, thời gian và hành động tiếp theo một cách tôn trọng.",
    canadaContext:
      "Useful for Canadian shift updates, supervisor messages, and workplace scheduling.",
    crossCheck: {
      crossCheckPrompt_en:
        "Verify reason, timing, and action before using the update.",
      crossCheckPrompt_vi:
        "Xác minh lý do, thời gian và hành động trước khi dùng cập nhật.",
      sampleLine: {
        pa: "ਮੈਂ ਅੱਜ ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ, ਅਤੇ ਮੈਂ ਟੀਮ ਨੂੰ ਪਹਿਲਾਂ ਸੁਨੇਹਾ ਭੇਜ ਦਿੱਤਾ ਹੈ।",
        romanization:
          "main ajj das mint der nal avanga, ate main team nu pehlan suneha bhej ditta hai.",
        en: "I will arrive ten minutes late today, and I have already messaged the team.",
        vi: "Hôm nay tôi sẽ đến muộn mười phút, và tôi đã nhắn cho đội trước rồi.",
      },
      verificationSignals_en: [
        "Gives timing",
        "States action taken",
        "Keeps workplace register",
      ],
      verificationSignals_vi: [
        "Nêu thời gian",
        "Nói hành động đã làm",
        "Giữ sắc thái nơi làm việc",
      ],
    },
    commonTraps: [
      {
        trap_en: "Sounding too casual for a supervisor message.",
        trap_vi: "Nghe quá thân mật cho tin nhắn gửi quản lý.",
        better: {
          pa: "ਮੈਂ ਤੁਹਾਨੂੰ ਪਹਿਲਾਂ ਜਾਣਕਾਰੀ ਦੇ ਰਿਹਾ ਹਾਂ।",
          romanization: "main tuhanu pehlan jankari de riha han.",
          en: "I am giving you the information in advance.",
          vi: "Tôi báo thông tin cho bạn trước.",
        },
      },
    ],
    preIntegrationNote_en:
      "Workplace cross-checks are ready when the tone stays respectful and the timing remains precise.",
    preIntegrationNote_vi:
      "Đối chiếu nơi làm việc sẵn sàng khi giọng vẫn tôn trọng và thời gian vẫn chính xác.",
    verificationRoute_en:
      "Route to workplace integration after reason, timing, and action pass verification.",
    verificationRoute_vi:
      "Chuyển sang tích hợp nơi làm việc sau khi lý do, thời gian và hành động được xác minh.",
  },
  {
    id: "b1-cross-check-housing-school-community",
    level: "B1",
    focus: "housing_school_community",
    title_en: "Cross-check public task wording",
    title_vi: "Đối chiếu cách nói cho nhiệm vụ công cộng",
    scenario_en:
      "One neutral request needs to work across housing, school, and community-service settings.",
    scenario_vi:
      "Một yêu cầu trung tính cần dùng được trong bối cảnh nhà ở, trường học và dịch vụ cộng đồng.",
    canadaContext:
      "Useful for Canadian rental offices, school reception, libraries, and newcomer centres.",
    crossCheck: {
      crossCheckPrompt_en:
        "Verify that the request names the form, appointment, or service without assuming policy.",
      crossCheckPrompt_vi:
        "Xác minh yêu cầu nêu mẫu đơn, cuộc hẹn hoặc dịch vụ mà không giả định chính sách.",
      sampleLine: {
        pa: "ਮੈਨੂੰ ਇਸ ਫਾਰਮ ਅਤੇ ਅਗਲੀ ਮਿਤੀ ਬਾਰੇ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
        romanization: "mainu is form ate agli miti bare madad chahidi hai.",
        en: "I need help with this form and the next date.",
        vi: "Tôi cần giúp với mẫu đơn này và ngày tiếp theo.",
      },
      verificationSignals_en: [
        "Names the task",
        "Uses neutral wording",
        "Avoids policy claims",
      ],
      verificationSignals_vi: [
        "Nêu nhiệm vụ",
        "Dùng cách nói trung tính",
        "Tránh khẳng định chính sách",
      ],
    },
    commonTraps: [
      {
        trap_en: "Inventing eligibility or office rules.",
        trap_vi: "Bịa điều kiện đủ hoặc quy định văn phòng.",
        better: {
          pa: "ਮੈਂ ਸਿਰਫ਼ ਪ੍ਰਕਿਰਿਆ ਪੁੱਛ ਰਿਹਾ ਹਾਂ।",
          romanization: "main sirf prakiria puchh riha han.",
          en: "I am only asking about the process.",
          vi: "Tôi chỉ đang hỏi về quy trình.",
        },
      },
    ],
    preIntegrationNote_en:
      "Cross-check language should stay practical and not become legal, financial, or policy advice.",
    preIntegrationNote_vi:
      "Ngôn ngữ đối chiếu nên giữ tính thực tế và không trở thành tư vấn pháp lý, tài chính hoặc chính sách.",
    verificationRoute_en:
      "Route to public-service pre-integration if the request works across all three settings.",
    verificationRoute_vi:
      "Chuyển sang tiền tích hợp dịch vụ công nếu yêu cầu dùng được ở cả ba bối cảnh.",
  },
  {
    id: "b1-cross-check-register-safe-repair",
    level: "B1",
    focus: "register_safe_repair",
    title_en: "Cross-check register-safe repair",
    title_vi: "Đối chiếu phần sửa lời an toàn về sắc thái",
    scenario_en:
      "You need to repair wording that sounded too direct while keeping the original task.",
    scenario_vi:
      "Bạn cần sửa cách nói nghe quá trực tiếp nhưng vẫn giữ nhiệm vụ ban đầu.",
    canadaContext:
      "Useful for Canadian workplaces, service counters, housing offices, and schools.",
    crossCheck: {
      crossCheckPrompt_en:
        "Verify that the repair softens tone without deleting the request.",
      crossCheckPrompt_vi:
        "Xác minh phần sửa làm nhẹ giọng mà không xóa yêu cầu.",
      sampleLine: {
        pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਇਹ ਨਰਮ ਤਰੀਕੇ ਨਾਲ ਕਹਿਣਾ ਚਾਹੁੰਦਾ ਹਾਂ: ਕੀ ਤੁਸੀਂ ਇਹ ਮੁੜ ਦੇਖ ਸਕਦੇ ਹੋ?",
        romanization:
          "maf karna, main ih naram tarike nal kahina chahunda han: ki tusin ih mur dekh sakde ho?",
        en: "Sorry, I want to say this more softly: could you look at this again?",
        vi: "Xin lỗi, tôi muốn nói nhẹ hơn: bạn có thể xem lại phần này không?",
      },
      verificationSignals_en: [
        "Acknowledges tone",
        "Softens wording",
        "Keeps the task",
      ],
      verificationSignals_vi: [
        "Thừa nhận sắc thái",
        "Làm nhẹ cách nói",
        "Giữ nhiệm vụ",
      ],
    },
    commonTraps: [
      {
        trap_en: "Apologizing and losing the actual request.",
        trap_vi: "Xin lỗi rồi mất luôn yêu cầu thật.",
        better: {
          pa: "ਲਹਿਜ਼ਾ ਨਰਮ ਹੈ, ਬੇਨਤੀ ਉਹੀ ਹੈ।",
          romanization: "lahiza naram hai, benti ohi hai.",
          en: "The tone is softer; the request is the same.",
          vi: "Giọng nhẹ hơn; yêu cầu vẫn như cũ.",
        },
      },
    ],
    preIntegrationNote_en:
      "Native review is deferred. Register-safe repair is cross-check ready when tone and task both remain clear.",
    preIntegrationNote_vi:
      "Đánh giá của người bản ngữ được để sau. Sửa lời an toàn về sắc thái sẵn sàng đối chiếu khi cả giọng và nhiệm vụ đều rõ.",
    verificationRoute_en:
      "Route to register-safe pre-integration when the repaired wording remains polite and specific.",
    verificationRoute_vi:
      "Chuyển sang tiền tích hợp về sắc thái khi cách nói đã sửa vẫn lịch sự và cụ thể.",
  },
];
