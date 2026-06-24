export type PunjabiB1ShipCandidateFocus =
  | "situation_explanation"
  | "event_retelling"
  | "clarification"
  | "service_recovery"
  | "issue_resolution"
  | "follow_up_message"
  | "workplace_task"
  | "housing_school_community"
  | "register_safe_repair";

export type PunjabiShipCandidateLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiShipCandidateTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiShipCandidateLine;
};

export type PunjabiShipCandidateCheck = {
  shipCandidatePrompt_en: string;
  shipCandidatePrompt_vi: string;
  sampleLine: PunjabiShipCandidateLine;
  readinessSignals_en: string[];
  readinessSignals_vi: string[];
};

export type PunjabiB1ShipCandidateCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1ShipCandidateFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  shipCandidate: PunjabiShipCandidateCheck;
  commonTraps: PunjabiShipCandidateTrap[];
  goNoGoNote_en: string;
  goNoGoNote_vi: string;
  preIntegrationRoute_en: string;
  preIntegrationRoute_vi: string;
};

export const punjabiB1ShipCandidateSamples: PunjabiB1ShipCandidateCard[] = [
  {
    id: "b1-ship-situation-explanation",
    level: "B1",
    focus: "situation_explanation",
    title_en: "Ship-candidate situation explanation",
    title_vi: "Giải thích tình huống ứng viên bàn giao",
    scenario_en: "The learner explains one issue and asks for the next step.",
    scenario_vi: "Người học giải thích một vấn đề và hỏi bước tiếp theo.",
    canadaContext: "Useful for Canadian service desks and newcomer centres.",
    shipCandidate: {
      shipCandidatePrompt_en: "Keep the issue, time, and next step stable.",
      shipCandidatePrompt_vi: "Giữ vấn đề, thời gian và bước tiếp theo ổn định.",
      sampleLine: {
        pa: "ਇਹ ਮੁੱਦਾ ਅੱਜ ਆਇਆ ਹੈ, ਅਤੇ ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਚਾਹੀਦਾ ਹੈ।",
        romanization: "ih mudda ajj aia hai, ate mainu agla kadam chahida hai.",
        en: "This issue came up today, and I need the next step.",
        vi: "Vấn đề này xảy ra hôm nay, và tôi cần bước tiếp theo.",
      },
      readinessSignals_en: ["One issue", "Time marker", "Next step"],
      readinessSignals_vi: ["Một vấn đề", "Mốc thời gian", "Bước tiếp theo"],
    },
    commonTraps: [
      {
        trap_en: "Adding a new issue after go-no-go approval.",
        trap_vi: "Thêm vấn đề mới sau khi đạt go-no-go.",
        better: {
          pa: "ਇੱਕ ਹੀ ਮੁੱਦਾ ਰੱਖੋ।",
          romanization: "ik hi mudda rakho.",
          en: "Keep one issue only.",
          vi: "Chỉ giữ một vấn đề.",
        },
      },
    ],
    goNoGoNote_en:
      "Language practice only, not medical advice. Ship-candidate readiness requires the go-no-go facts to stay unchanged.",
    goNoGoNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Sẵn sàng bàn giao yêu cầu thông tin go-no-go không đổi.",
    preIntegrationRoute_en:
      "Route to pre-integration when the explanation remains stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp khi phần giải thích vẫn ổn định.",
  },
  {
    id: "b1-ship-event-retelling",
    level: "B1",
    focus: "event_retelling",
    title_en: "Ship-candidate event retelling",
    title_vi: "Kể lại sự việc ứng viên bàn giao",
    scenario_en: "The learner retells an event in a stable order.",
    scenario_vi: "Người học kể lại sự việc theo thứ tự ổn định.",
    canadaContext: "Useful for Canadian workplace, housing, and school reports.",
    shipCandidate: {
      shipCandidatePrompt_en: "Keep sequence and current status clear.",
      shipCandidatePrompt_vi: "Giữ trình tự và trạng thái hiện tại rõ.",
      sampleLine: {
        pa: "ਪਹਿਲਾਂ ਸੁਨੇਹਾ ਗਿਆ, ਫਿਰ ਜਵਾਬ ਆਇਆ, ਅਤੇ ਹੁਣ ਸਮਾਂ ਤੈਅ ਹੈ।",
        romanization: "pehlan suneha gia, phir javab aia, ate hun sama tai hai.",
        en: "First the message went out, then the reply came, and now the time is set.",
        vi: "Trước hết tin nhắn được gửi, rồi có phản hồi, và bây giờ giờ đã được xác định.",
      },
      readinessSignals_en: ["Sequence", "Current status", "No side story"],
      readinessSignals_vi: ["Trình tự", "Trạng thái hiện tại", "Không chuyện phụ"],
    },
    commonTraps: [
      {
        trap_en: "Changing the order at ship-candidate stage.",
        trap_vi: "Đổi thứ tự ở giai đoạn ứng viên bàn giao.",
        better: {
          pa: "ਉਹੀ ਕ੍ਰਮ ਵਰਤੋ।",
          romanization: "ohi kram varto.",
          en: "Use the same order.",
          vi: "Dùng cùng thứ tự.",
        },
      },
    ],
    goNoGoNote_en:
      "Language practice only, not legal or financial advice. Shahmukhi is awareness only, not a full course.",
    goNoGoNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ.",
    preIntegrationRoute_en:
      "Route to pre-integration when the timeline remains stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp khi dòng thời gian vẫn ổn định.",
  },
  {
    id: "b1-ship-clarification",
    level: "B1",
    focus: "clarification",
    title_en: "Ship-candidate clarification",
    title_vi: "Làm rõ ứng viên bàn giao",
    scenario_en: "The learner confirms the final date, time, or document.",
    scenario_vi: "Người học xác nhận ngày, giờ hoặc giấy tờ cuối.",
    canadaContext: "Useful for Canadian appointments and public-service intake.",
    shipCandidate: {
      shipCandidatePrompt_en: "Ask for the missing detail in writing.",
      shipCandidatePrompt_vi: "Hỏi chi tiết còn thiếu bằng văn bản.",
      sampleLine: {
        pa: "ਕੀ ਤੁਸੀਂ ਮਿਤੀ ਅਤੇ ਅਗਲਾ ਕਦਮ ਲਿਖ ਕੇ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin miti ate agla kadam likh ke bhej sakde ho?",
        en: "Can you send the date and next step in writing?",
        vi: "Bạn có thể gửi ngày và bước tiếp theo bằng văn bản không?",
      },
      readinessSignals_en: ["Specific detail", "Written confirmation", "Next step"],
      readinessSignals_vi: ["Chi tiết cụ thể", "Xác nhận bằng văn bản", "Bước tiếp theo"],
    },
    commonTraps: [
      {
        trap_en: "Shipping while the date is unclear.",
        trap_vi: "Bàn giao khi ngày vẫn chưa rõ.",
        better: {
          pa: "ਮਿਤੀ ਪਹਿਲਾਂ ਪੁਸ਼ਟੀ ਕਰੋ।",
          romanization: "miti pehlan pushti karo.",
          en: "Confirm the date first.",
          vi: "Xác nhận ngày trước.",
        },
      },
    ],
    goNoGoNote_en:
      "Ship-candidate clarification is ready when go-no-go leaves no unclear next step.",
    goNoGoNote_vi:
      "Làm rõ ứng viên bàn giao sẵn sàng khi go-no-go không còn bước tiếp theo mơ hồ.",
    preIntegrationRoute_en:
      "Route to pre-integration clarification after the detail can be repeated.",
    preIntegrationRoute_vi:
      "Chuyển sang làm rõ tiền tích hợp sau khi chi tiết có thể lặp lại.",
  },
  {
    id: "b1-ship-service-recovery",
    level: "B1",
    focus: "service_recovery",
    title_en: "Ship-candidate service recovery",
    title_vi: "Phục hồi dịch vụ ứng viên bàn giao",
    scenario_en: "The learner closes a recovered service exchange without changing the request.",
    scenario_vi: "Người học chốt trao đổi dịch vụ đã phục hồi mà không đổi yêu cầu.",
    canadaContext: "Useful for Canadian service counters, phone lines, and support chats.",
    shipCandidate: {
      shipCandidatePrompt_en: "Keep the reset polite and the request unchanged.",
      shipCandidatePrompt_vi: "Giữ phần đặt lại lịch sự và yêu cầu không đổi.",
      sampleLine: {
        pa: "ਬੇਨਤੀ ਉਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।",
        romanization: "benti ohi hai. kirpa karke agla kadam dasso.",
        en: "The request is the same. Please tell me the next step.",
        vi: "Yêu cầu vẫn như cũ. Vui lòng cho tôi biết bước tiếp theo.",
      },
      readinessSignals_en: ["Same request", "Polite reset", "Next step"],
      readinessSignals_vi: ["Cùng yêu cầu", "Đặt lại lịch sự", "Bước tiếp theo"],
    },
    commonTraps: [
      {
        trap_en: "Starting a new complaint during the ship check.",
        trap_vi: "Bắt đầu khiếu nại mới trong kiểm tra bàn giao.",
        better: {
          pa: "ਉਹੀ ਬੇਨਤੀ ਰੱਖੋ।",
          romanization: "ohi benti rakho.",
          en: "Keep the same request.",
          vi: "Giữ cùng yêu cầu.",
        },
      },
    ],
    goNoGoNote_en:
      "Native review is deferred. Ship-candidate service recovery must preserve the go-no-go reset.",
    goNoGoNote_vi:
      "Đánh giá của người bản ngữ được để sau. Phục hồi dịch vụ ứng viên bàn giao phải giữ câu đặt lại go-no-go.",
    preIntegrationRoute_en:
      "Route to service pre-integration when the reset remains stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp dịch vụ khi câu đặt lại vẫn ổn định.",
  },
  {
    id: "b1-ship-issue-resolution",
    level: "B1",
    focus: "issue_resolution",
    title_en: "Ship-candidate issue resolution",
    title_vi: "Giải quyết vấn đề ứng viên bàn giao",
    scenario_en: "The learner checks that correction and confirmation are linked.",
    scenario_vi: "Người học kiểm tra phần sửa và xác nhận được nối với nhau.",
    canadaContext: "Useful for Canadian billing, tenant repair, and school records.",
    shipCandidate: {
      shipCandidatePrompt_en: "Confirm correction and confirmation together.",
      shipCandidatePrompt_vi: "Xác nhận phần sửa và xác nhận cùng nhau.",
      sampleLine: {
        pa: "ਕੀ ਸੁਧਾਰ ਹੋ ਗਿਆ ਹੈ ਅਤੇ ਪੁਸ਼ਟੀ ਭੇਜੀ ਗਈ ਹੈ?",
        romanization: "ki sudhar ho gia hai ate pushti bheji gai hai?",
        en: "Has the correction been made and confirmation been sent?",
        vi: "Phần sửa đã xong và xác nhận đã được gửi chưa?",
      },
      readinessSignals_en: ["Correction", "Confirmation", "No new issue"],
      readinessSignals_vi: ["Phần sửa", "Xác nhận", "Không vấn đề mới"],
    },
    commonTraps: [
      {
        trap_en: "Accepting the fix before confirmation.",
        trap_vi: "Chấp nhận phần sửa trước khi có xác nhận.",
        better: {
          pa: "ਪੁਸ਼ਟੀ ਵੀ ਮੰਗੋ।",
          romanization: "pushti vi mango.",
          en: "Ask for confirmation too.",
          vi: "Cũng hãy xin xác nhận.",
        },
      },
    ],
    goNoGoNote_en:
      "Language practice only, not legal or financial advice. Ship-candidate issue resolution should not invent outcomes.",
    goNoGoNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Giải quyết vấn đề ứng viên bàn giao không nên bịa kết quả.",
    preIntegrationRoute_en:
      "Route to issue-resolution pre-integration when the correction is checkable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp giải quyết vấn đề khi phần sửa có thể kiểm tra.",
  },
  {
    id: "b1-ship-follow-up-message",
    level: "B1",
    focus: "follow_up_message",
    title_en: "Ship-candidate follow-up",
    title_vi: "Theo dõi ứng viên bàn giao",
    scenario_en: "The learner sends a concise follow-up tied to the previous request.",
    scenario_vi: "Người học gửi theo dõi ngắn gắn với yêu cầu trước.",
    canadaContext: "Useful for Canadian landlord, school, clinic, and agency emails.",
    shipCandidate: {
      shipCandidatePrompt_en: "Reference the previous request and ask for action.",
      shipCandidatePrompt_vi: "Nhắc yêu cầu trước và hỏi hành động.",
      sampleLine: {
        pa: "ਪਿਛਲੀ ਬੇਨਤੀ ਬਾਰੇ, ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?",
        romanization: "pichhli benti bare, agla kadam ki hai?",
        en: "Regarding the previous request, what is the next step?",
        vi: "Về yêu cầu trước, bước tiếp theo là gì?",
      },
      readinessSignals_en: ["Previous request", "Concise", "Action"],
      readinessSignals_vi: ["Yêu cầu trước", "Ngắn gọn", "Hành động"],
    },
    commonTraps: [
      {
        trap_en: "Restarting the whole case in the follow-up.",
        trap_vi: "Bắt đầu lại toàn bộ vụ việc trong phần theo dõi.",
        better: {
          pa: "ਇਹ ਸਿਰਫ਼ ਪਾਲਣਾ ਹੈ।",
          romanization: "ih sirf palna hai.",
          en: "This is only a follow-up.",
          vi: "Đây chỉ là phần theo dõi.",
        },
      },
    ],
    goNoGoNote_en:
      "Ship-candidate follow-up passes when go-no-go keeps the message short and actionable.",
    goNoGoNote_vi:
      "Theo dõi ứng viên bàn giao đạt khi go-no-go giữ tin nhắn ngắn và có hành động.",
    preIntegrationRoute_en:
      "Route to message pre-integration when the follow-up adds action, not confusion.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp tin nhắn khi theo dõi thêm hành động, không thêm rối.",
  },
  {
    id: "b1-ship-workplace-task",
    level: "B1",
    focus: "workplace_task",
    title_en: "Ship-candidate workplace update",
    title_vi: "Cập nhật nơi làm việc ứng viên bàn giao",
    scenario_en: "The learner gives timing and action in respectful workplace language.",
    scenario_vi: "Người học đưa thời gian và hành động bằng ngôn ngữ nơi làm việc tôn trọng.",
    canadaContext: "Useful for Canadian shift updates and supervisor messages.",
    shipCandidate: {
      shipCandidatePrompt_en: "Keep timing, action, and respectful register.",
      shipCandidatePrompt_vi: "Giữ thời gian, hành động và sắc thái tôn trọng.",
      sampleLine: {
        pa: "ਮੈਂ ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ ਅਤੇ ਪਹਿਲਾਂ ਹੀ ਦੱਸ ਰਿਹਾ ਹਾਂ।",
        romanization: "main das mint der nal avanga ate pehlan hi dass riha han.",
        en: "I will arrive ten minutes late and am letting you know in advance.",
        vi: "Tôi sẽ đến muộn mười phút và đang báo trước.",
      },
      readinessSignals_en: ["Timing", "Advance notice", "Respectful register"],
      readinessSignals_vi: ["Thời gian", "Báo trước", "Sắc thái tôn trọng"],
    },
    commonTraps: [
      {
        trap_en: "Using friend-level wording with a supervisor.",
        trap_vi: "Dùng lời thân mật như bạn bè với quản lý.",
        better: {
          pa: "ਮੈਂ ਤੁਹਾਨੂੰ ਪਹਿਲਾਂ ਸੂਚਿਤ ਕਰ ਰਿਹਾ ਹਾਂ।",
          romanization: "main tuhanu pehlan suchit kar riha han.",
          en: "I am informing you in advance.",
          vi: "Tôi thông báo trước cho bạn.",
        },
      },
    ],
    goNoGoNote_en:
      "Workplace ship-candidate status depends on go-no-go tone and timing remaining stable.",
    goNoGoNote_vi:
      "Trạng thái ứng viên bàn giao nơi làm việc phụ thuộc vào giọng và thời gian go-no-go vẫn ổn định.",
    preIntegrationRoute_en:
      "Route to workplace pre-integration when timing and tone remain stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp nơi làm việc khi thời gian và giọng vẫn ổn định.",
  },
  {
    id: "b1-ship-housing-school-community",
    level: "B1",
    focus: "housing_school_community",
    title_en: "Ship-candidate public task",
    title_vi: "Nhiệm vụ công cộng ứng viên bàn giao",
    scenario_en: "The learner uses neutral language across housing, school, and community settings.",
    scenario_vi: "Người học dùng ngôn ngữ trung tính qua nhà ở, trường học và cộng đồng.",
    canadaContext: "Useful for Canadian rental offices, schools, libraries, and newcomer centres.",
    shipCandidate: {
      shipCandidatePrompt_en: "Ask for the next form or step without policy claims.",
      shipCandidatePrompt_vi: "Hỏi mẫu đơn hoặc bước tiếp theo mà không khẳng định chính sách.",
      sampleLine: {
        pa: "ਇਸ ਸੇਵਾ ਲਈ ਅਗਲਾ ਫਾਰਮ ਜਾਂ ਕਦਮ ਕੀ ਹੈ?",
        romanization: "is seva lai agla form ja kadam ki hai?",
        en: "What is the next form or step for this service?",
        vi: "Mẫu đơn hoặc bước tiếp theo cho dịch vụ này là gì?",
      },
      readinessSignals_en: ["Neutral request", "Practical step", "No policy claim"],
      readinessSignals_vi: ["Yêu cầu trung tính", "Bước thực tế", "Không khẳng định chính sách"],
    },
    commonTraps: [
      {
        trap_en: "Inventing office rules.",
        trap_vi: "Bịa quy định văn phòng.",
        better: {
          pa: "ਮੈਂ ਪ੍ਰਕਿਰਿਆ ਬਾਰੇ ਪੁੱਛ ਰਿਹਾ ਹਾਂ।",
          romanization: "main prakiria bare puchh riha han.",
          en: "I am asking about the process.",
          vi: "Tôi đang hỏi về quy trình.",
        },
      },
    ],
    goNoGoNote_en:
      "Ship-candidate public-task language remains practical and avoids legal, financial, or eligibility advice.",
    goNoGoNote_vi:
      "Ngôn ngữ nhiệm vụ công cộng ứng viên bàn giao vẫn thực tế và tránh tư vấn pháp lý, tài chính hoặc điều kiện đủ.",
    preIntegrationRoute_en:
      "Route to public-task pre-integration when the request works across settings.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp nhiệm vụ công khi yêu cầu dùng được qua nhiều bối cảnh.",
  },
  {
    id: "b1-ship-register-safe-repair",
    level: "B1",
    focus: "register_safe_repair",
    title_en: "Ship-candidate register repair",
    title_vi: "Sửa sắc thái ứng viên bàn giao",
    scenario_en: "The learner softens tone while keeping the same request visible.",
    scenario_vi: "Người học làm nhẹ giọng trong khi giữ cùng yêu cầu rõ.",
    canadaContext: "Useful for Canadian workplaces, service counters, housing offices, and schools.",
    shipCandidate: {
      shipCandidatePrompt_en: "Keep the repaired tone polite and specific.",
      shipCandidatePrompt_vi: "Giữ phần sửa giọng lịch sự và cụ thể.",
      sampleLine: {
        pa: "ਮਾਫ਼ ਕਰਨਾ, ਨਰਮ ਤਰੀਕੇ ਨਾਲ ਕਹਿੰਦਾ ਹਾਂ: ਕੀ ਤੁਸੀਂ ਇਹ ਮੁੜ ਦੇਖ ਸਕਦੇ ਹੋ?",
        romanization: "maf karna, naram tarike nal kahinda han: ki tusin ih mur dekh sakde ho?",
        en: "Sorry, saying it more softly: could you look at this again?",
        vi: "Xin lỗi, nói nhẹ hơn: bạn có thể xem lại phần này không?",
      },
      readinessSignals_en: ["Softer tone", "Same request", "Specific task"],
      readinessSignals_vi: ["Giọng nhẹ hơn", "Cùng yêu cầu", "Nhiệm vụ cụ thể"],
    },
    commonTraps: [
      {
        trap_en: "Softening until the request disappears.",
        trap_vi: "Làm nhẹ đến mức yêu cầu biến mất.",
        better: {
          pa: "ਬੇਨਤੀ ਉਹੀ ਹੈ, ਲਹਿਜ਼ਾ ਨਰਮ ਹੈ।",
          romanization: "benti ohi hai, lahiza naram hai.",
          en: "The request is the same; the tone is softer.",
          vi: "Yêu cầu vẫn như cũ; giọng nhẹ hơn.",
        },
      },
    ],
    goNoGoNote_en:
      "Native review is deferred. Ship-candidate repair is ready when go-no-go keeps tone and task clear.",
    goNoGoNote_vi:
      "Đánh giá của người bản ngữ được để sau. Sửa lời ứng viên bàn giao sẵn sàng khi go-no-go giữ rõ giọng và nhiệm vụ.",
    preIntegrationRoute_en:
      "Route to register-safe pre-integration when the repair stays polite and specific.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp về sắc thái khi phần sửa vẫn lịch sự và cụ thể.",
  },
];
