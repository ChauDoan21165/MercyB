export type PunjabiB1ClosureValidationFocus =
  | "situation_explanation"
  | "event_retelling"
  | "clarification"
  | "service_recovery"
  | "issue_resolution"
  | "follow_up_message"
  | "workplace_task"
  | "housing_school_community"
  | "register_safe_repair";

export type PunjabiClosureValidationLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiClosureValidationTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiClosureValidationLine;
};

export type PunjabiClosureValidationCheck = {
  closureValidationPrompt_en: string;
  closureValidationPrompt_vi: string;
  sampleLine: PunjabiClosureValidationLine;
  closureSignals_en: string[];
  closureSignals_vi: string[];
};

export type PunjabiB1ClosureValidationCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1ClosureValidationFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  closureValidation: PunjabiClosureValidationCheck;
  commonTraps: PunjabiClosureValidationTrap[];
  finalCrossCheckNote_en: string;
  finalCrossCheckNote_vi: string;
  preIntegrationRoute_en: string;
  preIntegrationRoute_vi: string;
};

export const punjabiB1ClosureValidationSamples: PunjabiB1ClosureValidationCard[] = [
  {
    id: "b1-closure-situation-explanation",
    level: "B1",
    focus: "situation_explanation",
    title_en: "Close the situation explanation",
    title_vi: "Chốt phần giải thích tình huống",
    scenario_en:
      "You need to close a service explanation with the issue and next step still clear.",
    scenario_vi:
      "Bạn cần chốt phần giải thích dịch vụ khi vấn đề và bước tiếp theo vẫn rõ.",
    canadaContext:
      "Useful for Canadian service counters, newcomer centres, and community intake.",
    closureValidation: {
      closureValidationPrompt_en:
        "Close by naming the issue once and confirming the next step.",
      closureValidationPrompt_vi:
        "Chốt bằng cách nêu vấn đề một lần và xác nhận bước tiếp theo.",
      sampleLine: {
        pa: "ਇਹ ਮੁੱਦਾ ਸਪਸ਼ਟ ਹੈ, ਅਤੇ ਮੈਂ ਹੁਣ ਅਗਲਾ ਕਦਮ ਪੁਸ਼ਟੀ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization:
          "ih mudda spasht hai, ate main hun agla kadam pushti karna chahunda han.",
        en: "This issue is clear, and now I want to confirm the next step.",
        vi: "Vấn đề này đã rõ, và bây giờ tôi muốn xác nhận bước tiếp theo.",
      },
      closureSignals_en: ["Names issue", "Confirms next step", "Avoids new facts"],
      closureSignals_vi: ["Nêu vấn đề", "Xác nhận bước tiếp theo", "Tránh thêm thông tin mới"],
    },
    commonTraps: [
      {
        trap_en: "Adding a new problem at closure.",
        trap_vi: "Thêm vấn đề mới lúc chốt.",
        better: {
          pa: "ਅਖੀਰ ਵਿੱਚ ਸਿਰਫ਼ ਅਗਲਾ ਕਦਮ ਪੁੱਛੋ।",
          romanization: "akhir vich sirf agla kadam puchho.",
          en: "At the end, ask only for the next step.",
          vi: "Ở cuối, chỉ hỏi bước tiếp theo.",
        },
      },
    ],
    finalCrossCheckNote_en:
      "Language practice only, not medical advice. Closure-validation passes when the final line matches the earlier cross-check.",
    finalCrossCheckNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Xác thực chốt đạt khi câu cuối khớp với phần đối chiếu trước.",
    preIntegrationRoute_en:
      "Route to pre-integration only after the closing request stays stable.",
    preIntegrationRoute_vi:
      "Chỉ chuyển sang tiền tích hợp sau khi yêu cầu chốt ổn định.",
  },
  {
    id: "b1-closure-event-retelling",
    level: "B1",
    focus: "event_retelling",
    title_en: "Close the event retelling",
    title_vi: "Chốt phần kể lại sự việc",
    scenario_en:
      "You need to end an event retelling with the current result clear.",
    scenario_vi:
      "Bạn cần kết thúc phần kể lại sự việc với kết quả hiện tại rõ.",
    canadaContext:
      "Useful for Canadian housing, school, and workplace reports.",
    closureValidation: {
      closureValidationPrompt_en:
        "Keep the timeline in order and close with the current status.",
      closureValidationPrompt_vi:
        "Giữ dòng thời gian theo thứ tự và chốt bằng trạng thái hiện tại.",
      sampleLine: {
        pa: "ਪਹਿਲਾਂ ਸੁਨੇਹਾ ਗਿਆ, ਫਿਰ ਜਵਾਬ ਆਇਆ, ਅਤੇ ਹੁਣ ਮਿਤੀ ਤੈਅ ਹੈ।",
        romanization:
          "pehlan suneha gia, phir javab aia, ate hun miti tai hai.",
        en: "First the message went out, then the reply came, and now the date is set.",
        vi: "Trước hết tin nhắn được gửi, rồi có phản hồi, và bây giờ ngày đã được xác định.",
      },
      closureSignals_en: ["Ordered timeline", "Current status", "No extra side story"],
      closureSignals_vi: ["Dòng thời gian có thứ tự", "Trạng thái hiện tại", "Không thêm chuyện phụ"],
    },
    commonTraps: [
      {
        trap_en: "Ending before the listener knows the current result.",
        trap_vi: "Kết thúc trước khi người nghe biết kết quả hiện tại.",
        better: {
          pa: "ਹੁਣ ਹਾਲਤ ਇਹ ਹੈ।",
          romanization: "hun halat ih hai.",
          en: "Now the situation is this.",
          vi: "Bây giờ tình hình là như vậy.",
        },
      },
    ],
    finalCrossCheckNote_en:
      "Language practice only, not legal or financial advice. Shahmukhi is awareness only, not a full course.",
    finalCrossCheckNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ.",
    preIntegrationRoute_en:
      "Route to final-cross-check again if the closure changes the timeline.",
    preIntegrationRoute_vi:
      "Quay lại đối chiếu cuối nếu phần chốt làm đổi dòng thời gian.",
  },
  {
    id: "b1-closure-clarification",
    level: "B1",
    focus: "clarification",
    title_en: "Close by clarifying next steps",
    title_vi: "Chốt bằng cách làm rõ bước tiếp theo",
    scenario_en:
      "You need the date, time, or document confirmed before ending the exchange.",
    scenario_vi:
      "Bạn cần ngày, giờ hoặc giấy tờ được xác nhận trước khi kết thúc trao đổi.",
    canadaContext:
      "Useful for Canadian appointments, schools, public services, and program intake.",
    closureValidation: {
      closureValidationPrompt_en:
        "Ask for the last missing detail and request written confirmation.",
      closureValidationPrompt_vi:
        "Hỏi chi tiết cuối còn thiếu và xin xác nhận bằng văn bản.",
      sampleLine: {
        pa: "ਅੰਤ ਵਿੱਚ, ਕੀ ਤੁਸੀਂ ਸਮਾਂ ਅਤੇ ਪਤਾ ਲਿਖ ਕੇ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization:
          "ant vich, ki tusin sama ate pata likh ke bhej sakde ho?",
        en: "Finally, can you send the time and address in writing?",
        vi: "Cuối cùng, bạn có thể gửi giờ và địa chỉ bằng văn bản không?",
      },
      closureSignals_en: ["Final detail", "Written confirmation", "Clear next step"],
      closureSignals_vi: ["Chi tiết cuối", "Xác nhận bằng văn bản", "Bước tiếp theo rõ"],
    },
    commonTraps: [
      {
        trap_en: "Closing while still unsure about the time.",
        trap_vi: "Chốt khi vẫn chưa chắc về giờ.",
        better: {
          pa: "ਸਮਾਂ ਪੁਸ਼ਟੀ ਕਰਕੇ ਹੀ ਖਤਮ ਕਰੋ।",
          romanization: "sama pushti karke hi khatam karo.",
          en: "End only after confirming the time.",
          vi: "Chỉ kết thúc sau khi xác nhận giờ.",
        },
      },
    ],
    finalCrossCheckNote_en:
      "Closure-validation is ready when one final detail is clarified without reopening the whole task.",
    finalCrossCheckNote_vi:
      "Xác thực chốt sẵn sàng khi một chi tiết cuối được làm rõ mà không mở lại toàn bộ nhiệm vụ.",
    preIntegrationRoute_en:
      "Route to pre-integration clarification once the detail can be repeated.",
    preIntegrationRoute_vi:
      "Chuyển sang làm rõ tiền tích hợp khi chi tiết có thể lặp lại.",
  },
  {
    id: "b1-closure-service-recovery",
    level: "B1",
    focus: "service_recovery",
    title_en: "Close a recovered service exchange",
    title_vi: "Chốt trao đổi dịch vụ đã phục hồi",
    scenario_en:
      "A service conversation recovered from confusion and now needs a clean ending.",
    scenario_vi:
      "Cuộc trò chuyện dịch vụ đã phục hồi khỏi rối và giờ cần kết thúc gọn.",
    canadaContext:
      "Useful for Canadian support chats, phone lines, and public service desks.",
    closureValidation: {
      closureValidationPrompt_en:
        "Close by keeping the same request and confirming what happens next.",
      closureValidationPrompt_vi:
        "Chốt bằng cách giữ cùng yêu cầu và xác nhận điều xảy ra tiếp theo.",
      sampleLine: {
        pa: "ਠੀਕ ਹੈ, ਬੇਨਤੀ ਉਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਪੁਸ਼ਟੀ ਕਰੋ।",
        romanization:
          "thik hai, benti ohi hai. kirpa karke agla kadam pushti karo.",
        en: "Okay, the request is the same. Please confirm the next step.",
        vi: "Được, yêu cầu vẫn như cũ. Vui lòng xác nhận bước tiếp theo.",
      },
      closureSignals_en: ["Same request", "Polite close", "Next step confirmed"],
      closureSignals_vi: ["Cùng yêu cầu", "Chốt lịch sự", "Bước tiếp theo được xác nhận"],
    },
    commonTraps: [
      {
        trap_en: "Changing the request at the end of the recovery.",
        trap_vi: "Đổi yêu cầu ở cuối phần phục hồi.",
        better: {
          pa: "ਅਖੀਰ ਵਿੱਚ ਬੇਨਤੀ ਨਾ ਬਦਲੋ।",
          romanization: "akhir vich benti na badlo.",
          en: "Do not change the request at the end.",
          vi: "Đừng đổi yêu cầu ở cuối.",
        },
      },
    ],
    finalCrossCheckNote_en:
      "Native review is deferred. Closure-validation passes when service recovery ends without escalation.",
    finalCrossCheckNote_vi:
      "Đánh giá của người bản ngữ được để sau. Xác thực chốt đạt khi phục hồi dịch vụ kết thúc mà không leo thang.",
    preIntegrationRoute_en:
      "Route to service pre-integration when the closing reset is stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp dịch vụ khi câu chốt đặt lại ổn định.",
  },
  {
    id: "b1-closure-issue-resolution",
    level: "B1",
    focus: "issue_resolution",
    title_en: "Close issue resolution",
    title_vi: "Chốt giải quyết vấn đề",
    scenario_en:
      "An issue-resolution task needs the correction and confirmation closed together.",
    scenario_vi:
      "Nhiệm vụ giải quyết vấn đề cần chốt phần sửa và xác nhận cùng nhau.",
    canadaContext:
      "Useful for Canadian billing, tenant repair, school records, and community services.",
    closureValidation: {
      closureValidationPrompt_en:
        "End by checking whether the correction was made and confirmation was sent.",
      closureValidationPrompt_vi:
        "Kết thúc bằng cách kiểm tra phần sửa đã xong và xác nhận đã được gửi chưa.",
      sampleLine: {
        pa: "ਕੀ ਸੁਧਾਰ ਹੋ ਗਿਆ ਹੈ, ਅਤੇ ਕੀ ਤੁਸੀਂ ਪੁਸ਼ਟੀ ਭੇਜ ਦਿੱਤੀ ਹੈ?",
        romanization:
          "ki sudhar ho gia hai, ate ki tusin pushti bhej ditti hai?",
        en: "Has the correction been made, and have you sent confirmation?",
        vi: "Phần sửa đã xong chưa, và bạn đã gửi xác nhận chưa?",
      },
      closureSignals_en: ["Correction checked", "Confirmation requested", "No new issue"],
      closureSignals_vi: ["Kiểm tra phần sửa", "Yêu cầu xác nhận", "Không thêm vấn đề mới"],
    },
    commonTraps: [
      {
        trap_en: "Ending before confirmation is clear.",
        trap_vi: "Kết thúc trước khi xác nhận rõ.",
        better: {
          pa: "ਪੁਸ਼ਟੀ ਆਉਣ ਤੱਕ ਗੱਲ ਪੂਰੀ ਨਹੀਂ।",
          romanization: "pushti aun tak gall puri nahin.",
          en: "The matter is not complete until confirmation arrives.",
          vi: "Việc chưa hoàn tất cho đến khi có xác nhận.",
        },
      },
    ],
    finalCrossCheckNote_en:
      "Language practice only, not legal or financial advice. Closure should not invent policy outcomes.",
    finalCrossCheckNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Phần chốt không nên bịa kết quả chính sách.",
    preIntegrationRoute_en:
      "Route to issue-resolution pre-integration after correction and confirmation are linked.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp giải quyết vấn đề sau khi phần sửa và xác nhận được nối với nhau.",
  },
  {
    id: "b1-closure-follow-up-message",
    level: "B1",
    focus: "follow_up_message",
    title_en: "Close a follow-up message",
    title_vi: "Chốt tin nhắn theo dõi",
    scenario_en:
      "A follow-up needs a concise close that asks for the next step.",
    scenario_vi:
      "Tin nhắn theo dõi cần câu chốt ngắn hỏi bước tiếp theo.",
    canadaContext:
      "Useful for Canadian landlord, school, clinic, and community agency emails.",
    closureValidation: {
      closureValidationPrompt_en:
        "Close with reference to the previous request and the desired next step.",
      closureValidationPrompt_vi:
        "Chốt bằng cách nhắc yêu cầu trước và bước tiếp theo mong muốn.",
      sampleLine: {
        pa: "ਪਿਛਲੀ ਬੇਨਤੀ ਬਾਰੇ, ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।",
        romanization:
          "pichhli benti bare, kirpa karke mainu agla kadam dasso.",
        en: "Regarding the previous request, please tell me the next step.",
        vi: "Về yêu cầu trước, vui lòng cho tôi biết bước tiếp theo.",
      },
      closureSignals_en: ["Previous request", "Concise close", "Next step"],
      closureSignals_vi: ["Yêu cầu trước", "Chốt ngắn gọn", "Bước tiếp theo"],
    },
    commonTraps: [
      {
        trap_en: "Repeating the full story in the closing line.",
        trap_vi: "Lặp lại toàn bộ câu chuyện trong câu chốt.",
        better: {
          pa: "ਅਖੀਰ ਛੋਟਾ ਰੱਖੋ।",
          romanization: "akhir chhota rakho.",
          en: "Keep the ending short.",
          vi: "Giữ phần cuối ngắn.",
        },
      },
    ],
    finalCrossCheckNote_en:
      "Closure-validation is strong when the follow-up ends with action, not extra background.",
    finalCrossCheckNote_vi:
      "Xác thực chốt tốt khi phần theo dõi kết thúc bằng hành động, không thêm bối cảnh.",
    preIntegrationRoute_en:
      "Route to message pre-integration if the close is concise and actionable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp tin nhắn nếu câu chốt ngắn và có hành động.",
  },
  {
    id: "b1-closure-workplace-task",
    level: "B1",
    focus: "workplace_task",
    title_en: "Close a workplace update",
    title_vi: "Chốt cập nhật nơi làm việc",
    scenario_en:
      "A workplace update needs a respectful close with timing and action clear.",
    scenario_vi:
      "Cập nhật nơi làm việc cần câu chốt tôn trọng với thời gian và hành động rõ.",
    canadaContext:
      "Useful for Canadian shift updates, supervisor messages, and scheduling changes.",
    closureValidation: {
      closureValidationPrompt_en:
        "Close with timing, action taken, and respectful tone.",
      closureValidationPrompt_vi:
        "Chốt với thời gian, hành động đã làm và giọng tôn trọng.",
      sampleLine: {
        pa: "ਮੈਂ ਪੰਦਰਾਂ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ ਅਤੇ ਤੁਹਾਨੂੰ ਪਹਿਲਾਂ ਹੀ ਦੱਸ ਰਿਹਾ ਹਾਂ।",
        romanization:
          "main pandran mint der nal avanga ate tuhanu pehlan hi dass riha han.",
        en: "I will arrive fifteen minutes late, and I am letting you know in advance.",
        vi: "Tôi sẽ đến muộn mười lăm phút, và tôi báo cho bạn biết trước.",
      },
      closureSignals_en: ["Timing", "Advance notice", "Respectful register"],
      closureSignals_vi: ["Thời gian", "Báo trước", "Sắc thái tôn trọng"],
    },
    commonTraps: [
      {
        trap_en: "Ending with a casual phrase that sounds too informal.",
        trap_vi: "Kết thúc bằng câu quá thân mật.",
        better: {
          pa: "ਧੰਨਵਾਦ, ਮੈਂ ਅਪਡੇਟ ਭੇਜ ਦਿੱਤੀ ਹੈ।",
          romanization: "dhannvad, main update bhej ditti hai.",
          en: "Thank you, I have sent the update.",
          vi: "Cảm ơn, tôi đã gửi cập nhật.",
        },
      },
    ],
    finalCrossCheckNote_en:
      "Workplace closure-validation passes when timing and register survive the final-cross-check.",
    finalCrossCheckNote_vi:
      "Xác thực chốt nơi làm việc đạt khi thời gian và sắc thái qua được đối chiếu cuối.",
    preIntegrationRoute_en:
      "Route to workplace pre-integration after the close remains respectful.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp nơi làm việc sau khi câu chốt vẫn tôn trọng.",
  },
  {
    id: "b1-closure-housing-school-community",
    level: "B1",
    focus: "housing_school_community",
    title_en: "Close a public task request",
    title_vi: "Chốt yêu cầu nhiệm vụ công cộng",
    scenario_en:
      "A neutral request must close clearly across housing, school, and community offices.",
    scenario_vi:
      "Yêu cầu trung tính phải chốt rõ trong văn phòng nhà ở, trường học và cộng đồng.",
    canadaContext:
      "Useful for Canadian rental offices, schools, libraries, and newcomer centres.",
    closureValidation: {
      closureValidationPrompt_en:
        "Close by naming the form or service and asking for the final practical step.",
      closureValidationPrompt_vi:
        "Chốt bằng cách nêu mẫu đơn hoặc dịch vụ và hỏi bước thực tế cuối.",
      sampleLine: {
        pa: "ਇਸ ਸੇਵਾ ਲਈ ਅਖੀਰਲਾ ਕਦਮ ਕੀ ਹੈ?",
        romanization: "is seva lai akhirla kadam ki hai?",
        en: "What is the final step for this service?",
        vi: "Bước cuối cho dịch vụ này là gì?",
      },
      closureSignals_en: ["Names service", "Final step", "Neutral wording"],
      closureSignals_vi: ["Nêu dịch vụ", "Bước cuối", "Cách nói trung tính"],
    },
    commonTraps: [
      {
        trap_en: "Claiming rules instead of asking about process.",
        trap_vi: "Khẳng định quy định thay vì hỏi quy trình.",
        better: {
          pa: "ਮੈਂ ਪ੍ਰਕਿਰਿਆ ਬਾਰੇ ਪੁੱਛ ਰਿਹਾ ਹਾਂ।",
          romanization: "main prakiria bare puchh riha han.",
          en: "I am asking about the process.",
          vi: "Tôi đang hỏi về quy trình.",
        },
      },
    ],
    finalCrossCheckNote_en:
      "Closure-validation language stays practical and is not legal, financial, or eligibility advice.",
    finalCrossCheckNote_vi:
      "Ngôn ngữ chốt giữ tính thực tế và không phải tư vấn pháp lý, tài chính hoặc điều kiện đủ.",
    preIntegrationRoute_en:
      "Route to public-task pre-integration when the close works across settings.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp nhiệm vụ công khi câu chốt dùng được qua nhiều bối cảnh.",
  },
  {
    id: "b1-closure-register-safe-repair",
    level: "B1",
    focus: "register_safe_repair",
    title_en: "Close register-safe repair",
    title_vi: "Chốt phần sửa lời an toàn về sắc thái",
    scenario_en:
      "You softened a direct phrase and now need to close while keeping the request.",
    scenario_vi:
      "Bạn đã làm nhẹ câu trực tiếp và giờ cần chốt trong khi giữ yêu cầu.",
    canadaContext:
      "Useful for Canadian workplaces, service counters, housing offices, and schools.",
    closureValidation: {
      closureValidationPrompt_en:
        "Close with softer wording and the original request still visible.",
      closureValidationPrompt_vi:
        "Chốt bằng cách nói nhẹ hơn và yêu cầu ban đầu vẫn rõ.",
      sampleLine: {
        pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਨਰਮ ਤਰੀਕੇ ਨਾਲ ਕਹਿੰਦਾ ਹਾਂ: ਕੀ ਤੁਸੀਂ ਇਹ ਮੁੜ ਦੇਖ ਸਕਦੇ ਹੋ?",
        romanization:
          "maf karna, main naram tarike nal kahinda han: ki tusin ih mur dekh sakde ho?",
        en: "Sorry, I will say it more softly: could you look at this again?",
        vi: "Xin lỗi, tôi sẽ nói nhẹ hơn: bạn có thể xem lại phần này không?",
      },
      closureSignals_en: ["Softened tone", "Same request", "Specific close"],
      closureSignals_vi: ["Giọng nhẹ hơn", "Cùng yêu cầu", "Chốt cụ thể"],
    },
    commonTraps: [
      {
        trap_en: "Softening so much that the request disappears.",
        trap_vi: "Làm nhẹ quá mức khiến yêu cầu biến mất.",
        better: {
          pa: "ਲਹਿਜ਼ਾ ਨਰਮ ਹੈ, ਬੇਨਤੀ ਉਹੀ ਹੈ।",
          romanization: "lahiza naram hai, benti ohi hai.",
          en: "The tone is softer; the request is the same.",
          vi: "Giọng nhẹ hơn; yêu cầu vẫn như cũ.",
        },
      },
    ],
    finalCrossCheckNote_en:
      "Native review is deferred. Closure-validation passes when repair stays polite and tied to the same task.",
    finalCrossCheckNote_vi:
      "Đánh giá của người bản ngữ được để sau. Xác thực chốt đạt khi phần sửa vẫn lịch sự và gắn với cùng nhiệm vụ.",
    preIntegrationRoute_en:
      "Route to register-safe pre-integration when tone and task both remain clear.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp về sắc thái khi cả giọng và nhiệm vụ đều rõ.",
  },
];
