export type PunjabiB1OwnerAcceptanceFocus =
  | "situation_explanation"
  | "event_retelling"
  | "clarification"
  | "service_recovery"
  | "issue_resolution"
  | "follow_up_message"
  | "workplace_task"
  | "housing_school_community"
  | "register_safe_repair";

export type PunjabiOwnerAcceptanceLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiOwnerAcceptanceTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiOwnerAcceptanceLine;
};

export type PunjabiOwnerAcceptanceCheck = {
  ownerAcceptancePrompt_en: string;
  ownerAcceptancePrompt_vi: string;
  sampleLine: PunjabiOwnerAcceptanceLine;
  finalAcceptanceSignals_en: string[];
  finalAcceptanceSignals_vi: string[];
};

export type PunjabiB1OwnerAcceptanceCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1OwnerAcceptanceFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  ownerAcceptance: PunjabiOwnerAcceptanceCheck;
  commonTraps: PunjabiOwnerAcceptanceTrap[];
  finalAcceptanceNote_en: string;
  finalAcceptanceNote_vi: string;
  preIntegrationRoute_en: string;
  preIntegrationRoute_vi: string;
};

export const punjabiB1OwnerAcceptanceSamples: PunjabiB1OwnerAcceptanceCard[] = [
  {
    id: "b1-owner-acceptance-situation-explanation",
    level: "B1",
    focus: "situation_explanation",
    title_en: "Owner acceptance situation explanation",
    title_vi: "Chủ sở hữu nghiệm thu phần giải thích tình huống",
    scenario_en: "The learner explains a practical problem, the reason, and the requested next step.",
    scenario_vi: "Người học giải thích một vấn đề thực tế, lý do, và bước tiếp theo cần yêu cầu.",
    canadaContext: "Useful for Canadian newcomer centres, clinics, and service counters.",
    ownerAcceptance: {
      ownerAcceptancePrompt_en:
        "Owner acceptance checks whether the explanation is clear enough for independent use.",
      ownerAcceptancePrompt_vi:
        "Chủ sở hữu nghiệm thu xem phần giải thích có đủ rõ để dùng độc lập không.",
      sampleLine: {
        pa: "ਮੇਰੀ ਮੁਲਾਕਾਤ ਅੱਜ ਨਹੀਂ ਹੋ ਸਕੀ ਕਿਉਂਕਿ ਬੱਸ ਦੇਰ ਨਾਲ ਆਈ। ਕੀ ਮੈਨੂੰ ਨਵਾਂ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?",
        romanization:
          "meri mulakat ajj nahin ho saki kyonki bas der nal ai. ki mainu nava sama mil sakda hai?",
        en: "My appointment could not happen today because the bus came late. Can I get a new time?",
        vi: "Cuộc hẹn của tôi không thể diễn ra hôm nay vì xe buýt đến muộn. Tôi có thể có giờ mới không?",
      },
      finalAcceptanceSignals_en: ["One problem", "Reason given", "Clear next-step ask"],
      finalAcceptanceSignals_vi: ["Một vấn đề", "Có lý do", "Yêu cầu bước tiếp theo rõ"],
    },
    commonTraps: [
      {
        trap_en: "Giving a long story before the needed action.",
        trap_vi: "Kể dài trước khi nói hành động cần thiết.",
        better: {
          pa: "ਕਾਰਨ ਛੋਟਾ ਰੱਖੋ ਅਤੇ ਬੇਨਤੀ ਸਾਫ਼ ਕਰੋ।",
          romanization: "karan chhota rakho ate benti saf karo.",
          en: "Keep the reason short and make the request clear.",
          vi: "Giữ lý do ngắn và nêu yêu cầu rõ.",
        },
      },
    ],
    finalAcceptanceNote_en:
      "Language practice only, not medical advice. Final-acceptance is ready when the owner can approve the ship-candidate without adding facts.",
    finalAcceptanceNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Đạt nghiệm thu cuối khi chủ sở hữu có thể duyệt bản bàn giao mà không thêm dữ kiện.",
    preIntegrationRoute_en:
      "Route to pre-integration when the learner repeats the same reason and request.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp khi người học lặp lại cùng lý do và yêu cầu.",
  },
  {
    id: "b1-owner-acceptance-event-retelling",
    level: "B1",
    focus: "event_retelling",
    title_en: "Owner acceptance event retelling",
    title_vi: "Chủ sở hữu nghiệm thu phần kể lại sự việc",
    scenario_en: "The learner retells an event in order and states the current status.",
    scenario_vi: "Người học kể lại sự việc theo thứ tự và nêu tình trạng hiện tại.",
    canadaContext: "Useful for Canadian school, workplace, and housing reports.",
    ownerAcceptance: {
      ownerAcceptancePrompt_en:
        "Final acceptance checks sequence, time markers, and current status.",
      ownerAcceptancePrompt_vi:
        "Nghiệm thu cuối kiểm tra trình tự, mốc thời gian, và tình trạng hiện tại.",
      sampleLine: {
        pa: "ਪਹਿਲਾਂ ਮੈਂ ਈਮੇਲ ਭੇਜੀ, ਫਿਰ ਦਫ਼ਤਰ ਤੋਂ ਜਵਾਬ ਆਇਆ, ਅਤੇ ਹੁਣ ਮੀਟਿੰਗ ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਹੈ।",
        romanization:
          "pehlan main email bheji, phir daftar ton javab aia, ate hun meeting shukkarvar nu hai.",
        en: "First I sent the email, then the office replied, and now the meeting is on Friday.",
        vi: "Trước tiên tôi gửi email, rồi văn phòng trả lời, và bây giờ cuộc họp vào thứ Sáu.",
      },
      finalAcceptanceSignals_en: ["Sequence", "Reply or result", "Current status"],
      finalAcceptanceSignals_vi: ["Trình tự", "Phản hồi hoặc kết quả", "Tình trạng hiện tại"],
    },
    commonTraps: [
      {
        trap_en: "Changing the order during final acceptance.",
        trap_vi: "Đổi thứ tự trong lúc nghiệm thu cuối.",
        better: {
          pa: "ਉਹੀ ਕ੍ਰਮ ਵਰਤੋ।",
          romanization: "ohi kram varto.",
          en: "Use the same order.",
          vi: "Dùng cùng thứ tự.",
        },
      },
    ],
    finalAcceptanceNote_en:
      "Language practice only, not legal or financial advice. Shahmukhi is awareness only, not a full course.",
    finalAcceptanceNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ.",
    preIntegrationRoute_en:
      "Route to pre-integration when the retelling is stable across final-acceptance checks.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp khi phần kể lại ổn định qua các kiểm tra nghiệm thu cuối.",
  },
  {
    id: "b1-owner-acceptance-clarification",
    level: "B1",
    focus: "clarification",
    title_en: "Owner acceptance clarification",
    title_vi: "Chủ sở hữu nghiệm thu phần làm rõ",
    scenario_en: "The learner asks for one missing detail and confirms it in writing.",
    scenario_vi: "Người học hỏi một chi tiết còn thiếu và xác nhận bằng văn bản.",
    canadaContext: "Useful for Canadian appointments, intake forms, and class instructions.",
    ownerAcceptance: {
      ownerAcceptancePrompt_en:
        "Owner acceptance checks whether the question is specific and polite.",
      ownerAcceptancePrompt_vi:
        "Chủ sở hữu nghiệm thu xem câu hỏi có cụ thể và lịch sự không.",
      sampleLine: {
        pa: "ਕੀ ਤੁਸੀਂ ਕਿਰਪਾ ਕਰਕੇ ਲਿਖ ਸਕਦੇ ਹੋ ਕਿ ਮੈਨੂੰ ਕਿਹੜਾ ਫਾਰਮ ਭਰਨਾ ਹੈ?",
        romanization:
          "ki tusin kirpa karke likh sakde ho ki mainu kihra farm bharna hai?",
        en: "Could you please write which form I need to fill out?",
        vi: "Bạn có thể vui lòng viết tôi cần điền mẫu nào không?",
      },
      finalAcceptanceSignals_en: ["Specific missing detail", "Polite request", "Written channel"],
      finalAcceptanceSignals_vi: ["Chi tiết thiếu cụ thể", "Yêu cầu lịch sự", "Kênh bằng văn bản"],
    },
    commonTraps: [
      {
        trap_en: "Asking a vague question such as 'what now?'",
        trap_vi: "Hỏi mơ hồ như 'giờ sao?'",
        better: {
          pa: "ਗੁੰਮ ਜਾਣਕਾਰੀ ਦਾ ਨਾਮ ਦੱਸੋ।",
          romanization: "gumm jankari da nam dasso.",
          en: "Name the missing information.",
          vi: "Nêu tên thông tin còn thiếu.",
        },
      },
    ],
    finalAcceptanceNote_en:
      "Owner-acceptance passes when the clarification can move from ship-candidate to final-acceptance without broadening the task.",
    finalAcceptanceNote_vi:
      "Đạt nghiệm thu chủ sở hữu khi phần làm rõ có thể đi từ bàn giao sang nghiệm thu cuối mà không mở rộng nhiệm vụ.",
    preIntegrationRoute_en:
      "Route to pre-integration after the learner can repeat the confirmed detail.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp sau khi người học có thể lặp lại chi tiết đã xác nhận.",
  },
  {
    id: "b1-owner-acceptance-service-recovery",
    level: "B1",
    focus: "service_recovery",
    title_en: "Owner acceptance service recovery",
    title_vi: "Chủ sở hữu nghiệm thu phục hồi dịch vụ",
    scenario_en: "The learner repairs tone and returns to the original service request.",
    scenario_vi: "Người học sửa giọng điệu và quay lại yêu cầu dịch vụ ban đầu.",
    canadaContext: "Useful for Canadian service desks, phone calls, and support chats.",
    ownerAcceptance: {
      ownerAcceptancePrompt_en:
        "Final acceptance checks that the repair is polite and the request stays unchanged.",
      ownerAcceptancePrompt_vi:
        "Nghiệm thu cuối kiểm tra câu sửa có lịch sự và yêu cầu có giữ nguyên không.",
      sampleLine: {
        pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਸਪਸ਼ਟ ਕਰਦਾ ਹਾਂ। ਮੇਰੀ ਬੇਨਤੀ ਉਹੀ ਹੈ: ਅਗਲਾ ਕਦਮ ਦੱਸੋ ਜੀ।",
        romanization:
          "maf karna, main sapasht karda han. meri benti ohi hai: agla kadam dasso ji.",
        en: "Sorry, let me clarify. My request is the same: please tell me the next step.",
        vi: "Xin lỗi, để tôi làm rõ. Yêu cầu của tôi vẫn như cũ: vui lòng cho tôi biết bước tiếp theo.",
      },
      finalAcceptanceSignals_en: ["Repair phrase", "Same request", "Polite register"],
      finalAcceptanceSignals_vi: ["Cụm sửa lỗi giao tiếp", "Cùng yêu cầu", "Mức trang trọng lịch sự"],
    },
    commonTraps: [
      {
        trap_en: "Repairing tone but adding a new complaint.",
        trap_vi: "Sửa giọng nhưng thêm khiếu nại mới.",
        better: {
          pa: "ਨਵੀਂ ਸ਼ਿਕਾਇਤ ਨਾ ਜੋੜੋ।",
          romanization: "navi shikait na joro.",
          en: "Do not add a new complaint.",
          vi: "Đừng thêm khiếu nại mới.",
        },
      },
    ],
    finalAcceptanceNote_en:
      "Native review is deferred. Owner-acceptance is ready when the register-safe repair remains final-acceptance stable.",
    finalAcceptanceNote_vi:
      "Đánh giá của người bản ngữ được để sau. Đạt nghiệm thu chủ sở hữu khi câu sửa đúng mức trang trọng vẫn ổn định ở nghiệm thu cuối.",
    preIntegrationRoute_en:
      "Route to service pre-integration when the same request survives a reset.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp dịch vụ khi cùng yêu cầu vẫn giữ được sau câu đặt lại.",
  },
  {
    id: "b1-owner-acceptance-issue-resolution",
    level: "B1",
    focus: "issue_resolution",
    title_en: "Owner acceptance issue resolution",
    title_vi: "Chủ sở hữu nghiệm thu giải quyết vấn đề",
    scenario_en: "The learner checks a correction and asks for confirmation without claiming the outcome.",
    scenario_vi: "Người học kiểm tra phần sửa và xin xác nhận mà không tự khẳng định kết quả.",
    canadaContext: "Useful for Canadian tenant repairs, school records, and account corrections.",
    ownerAcceptance: {
      ownerAcceptancePrompt_en:
        "Owner acceptance checks whether the learner separates request, correction, and confirmation.",
      ownerAcceptancePrompt_vi:
        "Chủ sở hữu nghiệm thu xem người học có tách yêu cầu, phần sửa, và xác nhận không.",
      sampleLine: {
        pa: "ਕੀ ਸੁਧਾਰ ਮੁਕੰਮਲ ਹੋ ਗਿਆ ਹੈ? ਜੇ ਹਾਂ, ਕਿਰਪਾ ਕਰਕੇ ਛੋਟੀ ਪੁਸ਼ਟੀ ਭੇਜੋ।",
        romanization:
          "ki sudhar mukammal ho gia hai? je han, kirpa karke chhoti pushti bhejo.",
        en: "Has the correction been completed? If yes, please send a short confirmation.",
        vi: "Phần sửa đã hoàn tất chưa? Nếu rồi, vui lòng gửi một xác nhận ngắn.",
      },
      finalAcceptanceSignals_en: ["Correction check", "Conditional wording", "Confirmation request"],
      finalAcceptanceSignals_vi: ["Kiểm tra phần sửa", "Cách nói có điều kiện", "Yêu cầu xác nhận"],
    },
    commonTraps: [
      {
        trap_en: "Saying the fix is done before receiving confirmation.",
        trap_vi: "Nói phần sửa đã xong trước khi nhận xác nhận.",
        better: {
          pa: "ਪੁਸ਼ਟੀ ਆਉਣ ਤੱਕ ਸਵਾਲ ਵਜੋਂ ਰੱਖੋ।",
          romanization: "pushti aun takk saval vajon rakho.",
          en: "Keep it as a question until confirmation arrives.",
          vi: "Giữ nó như một câu hỏi cho đến khi có xác nhận.",
        },
      },
    ],
    finalAcceptanceNote_en:
      "Language practice only, not legal or financial advice. Final-acceptance should not invent promises or outcomes.",
    finalAcceptanceNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Nghiệm thu cuối không nên bịa lời hứa hoặc kết quả.",
    preIntegrationRoute_en:
      "Route to issue-resolution pre-integration when the confirmation step is explicit.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp giải quyết vấn đề khi bước xác nhận rõ ràng.",
  },
  {
    id: "b1-owner-acceptance-follow-up-message",
    level: "B1",
    focus: "follow_up_message",
    title_en: "Owner acceptance follow-up message",
    title_vi: "Chủ sở hữu nghiệm thu tin nhắn theo dõi",
    scenario_en: "The learner follows up after a previous message without sounding demanding.",
    scenario_vi: "Người học theo dõi sau tin nhắn trước đó mà không nghe như đòi hỏi.",
    canadaContext: "Useful for Canadian email, SMS, and portal messages.",
    ownerAcceptance: {
      ownerAcceptancePrompt_en:
        "Final acceptance checks context, date marker, and polite status request.",
      ownerAcceptancePrompt_vi:
        "Nghiệm thu cuối kiểm tra bối cảnh, mốc ngày, và yêu cầu cập nhật lịch sự.",
      sampleLine: {
        pa: "ਮੈਂ ਮੰਗਲਵਾਰ ਵਾਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਪੁੱਛ ਰਿਹਾ ਹਾਂ। ਕੀ ਕੋਈ ਅਪਡੇਟ ਹੈ?",
        romanization:
          "main mangalvar vale sunehe bare puchh riha han. ki koi update hai?",
        en: "I am asking about Tuesday's message. Is there any update?",
        vi: "Tôi đang hỏi về tin nhắn hôm thứ Ba. Có cập nhật nào không?",
      },
      finalAcceptanceSignals_en: ["Previous message", "Date marker", "Polite update ask"],
      finalAcceptanceSignals_vi: ["Tin nhắn trước", "Mốc ngày", "Hỏi cập nhật lịch sự"],
    },
    commonTraps: [
      {
        trap_en: "Using urgent language when the task only needs a status check.",
        trap_vi: "Dùng ngôn ngữ khẩn cấp khi nhiệm vụ chỉ cần kiểm tra tình trạng.",
        better: {
          pa: "ਅਪਡੇਟ ਨਰਮੀ ਨਾਲ ਪੁੱਛੋ।",
          romanization: "update narmi nal puchho.",
          en: "Ask gently for an update.",
          vi: "Hỏi cập nhật một cách nhẹ nhàng.",
        },
      },
    ],
    finalAcceptanceNote_en:
      "Owner-acceptance is ready when the follow-up remains brief from ship-candidate through final-acceptance.",
    finalAcceptanceNote_vi:
      "Đạt nghiệm thu chủ sở hữu khi tin theo dõi vẫn ngắn từ bàn giao đến nghiệm thu cuối.",
    preIntegrationRoute_en:
      "Route to pre-integration messaging after the learner can change the date marker.",
    preIntegrationRoute_vi:
      "Chuyển sang nhắn tin tiền tích hợp sau khi người học có thể đổi mốc ngày.",
  },
  {
    id: "b1-owner-acceptance-workplace-task",
    level: "B1",
    focus: "workplace_task",
    title_en: "Owner acceptance workplace task",
    title_vi: "Chủ sở hữu nghiệm thu nhiệm vụ nơi làm việc",
    scenario_en: "The learner confirms a task, time, and backup communication.",
    scenario_vi: "Người học xác nhận nhiệm vụ, thời gian, và cách báo dự phòng.",
    canadaContext: "Useful for Canadian part-time work, volunteering, and team handoffs.",
    ownerAcceptance: {
      ownerAcceptancePrompt_en:
        "Owner acceptance checks that the learner can act independently without adding policy claims.",
      ownerAcceptancePrompt_vi:
        "Chủ sở hữu nghiệm thu xem người học có thể tự xử lý mà không thêm tuyên bố chính sách không.",
      sampleLine: {
        pa: "ਮੈਂ ਚਾਰ ਵਜੇ ਲਿਸਟ ਚੈੱਕ ਕਰਾਂਗਾ। ਜੇ ਕੰਮ ਮੁਕੰਮਲ ਨਾ ਹੋਇਆ, ਮੈਂ ਟੀਮ ਲੀਡ ਨੂੰ ਦੱਸਾਂਗਾ।",
        romanization:
          "main char vaje list check karanga. je kamm mukammal na hoia, main team lead nu dassanga.",
        en: "I will check the list at four. If the work is not complete, I will tell the team lead.",
        vi: "Tôi sẽ kiểm tra danh sách lúc bốn giờ. Nếu việc chưa xong, tôi sẽ báo cho trưởng nhóm.",
      },
      finalAcceptanceSignals_en: ["Task", "Time", "Backup communication"],
      finalAcceptanceSignals_vi: ["Nhiệm vụ", "Thời gian", "Trao đổi dự phòng"],
    },
    commonTraps: [
      {
        trap_en: "Confirming the task but not the backup action.",
        trap_vi: "Xác nhận nhiệm vụ nhưng không nêu hành động dự phòng.",
        better: {
          pa: "ਜੇ ਸਮੱਸਿਆ ਆਏ ਤਾਂ ਕਿਸਨੂੰ ਦੱਸਣਾ ਹੈ, ਇਹ ਦੱਸੋ।",
          romanization: "je samassia ae tan kisnu dassna hai, ih dasso.",
          en: "Say who to tell if a problem comes up.",
          vi: "Nói sẽ báo cho ai nếu có vấn đề.",
        },
      },
    ],
    finalAcceptanceNote_en:
      "Final-acceptance passes when the workplace sample is stable and practice-only.",
    finalAcceptanceNote_vi:
      "Đạt nghiệm thu cuối khi mẫu nơi làm việc ổn định và chỉ là luyện tập.",
    preIntegrationRoute_en:
      "Route to workplace pre-integration when task, time, and backup action are repeatable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp nơi làm việc khi nhiệm vụ, thời gian, và hành động dự phòng có thể lặp lại.",
  },
  {
    id: "b1-owner-acceptance-housing-school-community",
    level: "B1",
    focus: "housing_school_community",
    title_en: "Owner acceptance housing, school, and community task",
    title_vi: "Chủ sở hữu nghiệm thu nhiệm vụ nhà ở, trường học, và cộng đồng",
    scenario_en: "The learner reports a practical need and asks for a workable time or contact.",
    scenario_vi: "Người học báo một nhu cầu thực tế và hỏi thời gian hoặc liên hệ phù hợp.",
    canadaContext: "Useful for Canadian rentals, school offices, libraries, and community programs.",
    ownerAcceptance: {
      ownerAcceptancePrompt_en:
        "Owner acceptance checks whether the task works across housing, school, or community settings.",
      ownerAcceptancePrompt_vi:
        "Chủ sở hữu nghiệm thu xem nhiệm vụ có dùng được trong bối cảnh nhà ở, trường học, hoặc cộng đồng không.",
      sampleLine: {
        pa: "ਮੈਨੂੰ ਇਸ ਬਾਰੇ ਸਹੀ ਵਿਅਕਤੀ ਨਾਲ ਗੱਲ ਕਰਨੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਸੰਪਰਕ ਜਾਂ ਸਮਾਂ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization:
          "mainu is bare sahi viakti nal gall karni hai. ki tusin sampark ja sama bhej sakde ho?",
        en: "I need to speak with the right person about this. Can you send the contact or time?",
        vi: "Tôi cần nói chuyện với đúng người về việc này. Bạn có thể gửi liên hệ hoặc thời gian không?",
      },
      finalAcceptanceSignals_en: ["Practical need", "Right contact", "Time or contact request"],
      finalAcceptanceSignals_vi: ["Nhu cầu thực tế", "Đúng người liên hệ", "Yêu cầu thời gian hoặc liên hệ"],
    },
    commonTraps: [
      {
        trap_en: "Using one vague sentence for every setting.",
        trap_vi: "Dùng một câu mơ hồ cho mọi bối cảnh.",
        better: {
          pa: "ਥਾਂ ਅਤੇ ਸੰਪਰਕ ਸਾਫ਼ ਕਰੋ।",
          romanization: "than ate sampark saf karo.",
          en: "Clarify the place and contact.",
          vi: "Làm rõ nơi và người liên hệ.",
        },
      },
    ],
    finalAcceptanceNote_en:
      "Owner-acceptance is ready when the same structure can transfer to housing, school, or community tasks.",
    finalAcceptanceNote_vi:
      "Đạt nghiệm thu chủ sở hữu khi cùng cấu trúc có thể chuyển sang nhiệm vụ nhà ở, trường học, hoặc cộng đồng.",
    preIntegrationRoute_en:
      "Route to pre-integration when the learner can swap the setting without changing the core request.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp khi người học có thể đổi bối cảnh mà không đổi yêu cầu cốt lõi.",
  },
  {
    id: "b1-owner-acceptance-register-safe-repair",
    level: "B1",
    focus: "register_safe_repair",
    title_en: "Owner acceptance register-safe repair",
    title_vi: "Chủ sở hữu nghiệm thu sửa câu đúng mức trang trọng",
    scenario_en: "The learner repairs a blunt sentence into polite, direct Punjabi.",
    scenario_vi: "Người học sửa một câu cộc thành tiếng Punjabi lịch sự và trực tiếp.",
    canadaContext: "Useful for Canadian school offices, service desks, and workplace messages.",
    ownerAcceptance: {
      ownerAcceptancePrompt_en:
        "Final acceptance checks that the repair is polite without losing the request.",
      ownerAcceptancePrompt_vi:
        "Nghiệm thu cuối kiểm tra câu sửa có lịch sự mà không làm mất yêu cầu không.",
      sampleLine: {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਦੱਸੋ ਕਿ ਇਹ ਕਦੋਂ ਮੁਕੰਮਲ ਹੋ ਸਕਦਾ ਹੈ।",
        romanization: "kirpa karke mainu dasso ki ih kadon mukammal ho sakda hai.",
        en: "Please tell me when this can be completed.",
        vi: "Vui lòng cho tôi biết khi nào việc này có thể hoàn tất.",
      },
      finalAcceptanceSignals_en: ["Polite marker", "Direct request", "Same meaning"],
      finalAcceptanceSignals_vi: ["Dấu hiệu lịch sự", "Yêu cầu trực tiếp", "Cùng nghĩa"],
    },
    commonTraps: [
      {
        trap_en: "Softening the sentence until the action is unclear.",
        trap_vi: "Làm mềm câu đến mức hành động không rõ.",
        better: {
          pa: "ਨਰਮੀ ਅਤੇ ਸਪਸ਼ਟਤਾ ਦੋਵੇਂ ਰੱਖੋ।",
          romanization: "narmi ate sapashtata dovein rakho.",
          en: "Keep both politeness and clarity.",
          vi: "Giữ cả lịch sự và rõ ràng.",
        },
      },
    ],
    finalAcceptanceNote_en:
      "Native review is deferred. Final-acceptance is ready when register-safe repair keeps the same meaning from owner-acceptance to pre-integration.",
    finalAcceptanceNote_vi:
      "Đánh giá của người bản ngữ được để sau. Đạt nghiệm thu cuối khi câu sửa đúng mức trang trọng giữ cùng nghĩa từ nghiệm thu chủ sở hữu đến tiền tích hợp.",
    preIntegrationRoute_en:
      "Route to pre-integration repair drills when the polite line remains direct.",
    preIntegrationRoute_vi:
      "Chuyển sang bài luyện sửa câu tiền tích hợp khi câu lịch sự vẫn trực tiếp.",
  },
];
