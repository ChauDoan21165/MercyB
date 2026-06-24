export type PunjabiB1FinalLockFocus =
  | "situation_explanation"
  | "event_retelling"
  | "clarification"
  | "service_recovery"
  | "issue_resolution"
  | "follow_up_message"
  | "workplace_task"
  | "housing_school_community"
  | "register_safe_repair";

export type PunjabiFinalLockLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiFinalLockTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiFinalLockLine;
};

export type PunjabiFinalLockCheck = {
  finalLockPrompt_en: string;
  finalLockPrompt_vi: string;
  sampleLine: PunjabiFinalLockLine;
  lockSignals_en: string[];
  lockSignals_vi: string[];
};

export type PunjabiB1FinalLockCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1FinalLockFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  finalLock: PunjabiFinalLockCheck;
  commonTraps: PunjabiFinalLockTrap[];
  ownerAcceptanceNote_en: string;
  ownerAcceptanceNote_vi: string;
  preIntegrationRoute_en: string;
  preIntegrationRoute_vi: string;
};

export const punjabiB1FinalLockSamples: PunjabiB1FinalLockCard[] = [
  {
    id: "b1-final-lock-situation-explanation",
    level: "B1",
    focus: "situation_explanation",
    title_en: "Final-lock situation explanation",
    title_vi: "Khóa cuối phần giải thích tình huống",
    scenario_en: "The learner explains one situation, reason, and action without adding new details.",
    scenario_vi: "Người học giải thích một tình huống, lý do, và hành động mà không thêm chi tiết mới.",
    canadaContext: "Useful for Canadian newcomer centres, service desks, and clinic reception.",
    finalLock: {
      finalLockPrompt_en: "Freeze only if the problem, reason, and next step stay unchanged.",
      finalLockPrompt_vi: "Chỉ khóa khi vấn đề, lý do, và bước tiếp theo không đổi.",
      sampleLine: {
        pa: "ਮੈਂ ਅੱਜ ਦੇਰ ਨਾਲ ਪਹੁੰਚਿਆ ਕਿਉਂਕਿ ਬੱਸ ਦੇਰ ਨਾਲ ਸੀ। ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।",
        romanization:
          "main ajj der nal pahunchia kyonki bas der nal si. kirpa karke mainu agla kadam dasso.",
        en: "I arrived late today because the bus was late. Please tell me the next step.",
        vi: "Hôm nay tôi đến muộn vì xe buýt trễ. Vui lòng cho tôi biết bước tiếp theo.",
      },
      lockSignals_en: ["One situation", "One reason", "Stable next step"],
      lockSignals_vi: ["Một tình huống", "Một lý do", "Bước tiếp theo ổn định"],
    },
    commonTraps: [
      {
        trap_en: "Adding a second reason during final lock.",
        trap_vi: "Thêm lý do thứ hai trong lúc khóa cuối.",
        better: {
          pa: "ਇੱਕ ਹੀ ਕਾਰਨ ਰੱਖੋ।",
          romanization: "ik hi karan rakho.",
          en: "Keep only one reason.",
          vi: "Chỉ giữ một lý do.",
        },
      },
    ],
    ownerAcceptanceNote_en:
      "Language practice only, not medical advice. Final-lock is ready when owner-acceptance and final-acceptance agree.",
    ownerAcceptanceNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Sẵn sàng khóa cuối khi nghiệm thu chủ sở hữu và nghiệm thu cuối khớp nhau.",
    preIntegrationRoute_en:
      "Route to pre-integration after the locked explanation repeats cleanly.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp sau khi phần giải thích đã khóa lặp lại rõ ràng.",
  },
  {
    id: "b1-final-lock-event-retelling",
    level: "B1",
    focus: "event_retelling",
    title_en: "Final-lock event retelling",
    title_vi: "Khóa cuối phần kể lại sự việc",
    scenario_en: "The learner retells an event in a fixed order with current status.",
    scenario_vi: "Người học kể lại sự việc theo thứ tự cố định kèm tình trạng hiện tại.",
    canadaContext: "Useful for Canadian workplace, school, and housing reports.",
    finalLock: {
      finalLockPrompt_en: "Lock only if the sequence remains first, then, now.",
      finalLockPrompt_vi: "Chỉ khóa nếu trình tự vẫn là trước tiên, rồi, bây giờ.",
      sampleLine: {
        pa: "ਪਹਿਲਾਂ ਮੈਂ ਕਾਲ ਕੀਤੀ, ਫਿਰ ਸੁਨੇਹਾ ਛੱਡਿਆ, ਅਤੇ ਹੁਣ ਜਵਾਬ ਦੀ ਉਡੀਕ ਹੈ।",
        romanization:
          "pehlan main call kiti, phir suneha chhaddia, ate hun javab di udik hai.",
        en: "First I called, then I left a message, and now I am waiting for a reply.",
        vi: "Trước tiên tôi gọi, rồi để lại tin nhắn, và bây giờ tôi đang chờ phản hồi.",
      },
      lockSignals_en: ["Fixed sequence", "Current status", "No side story"],
      lockSignals_vi: ["Trình tự cố định", "Tình trạng hiện tại", "Không chuyện phụ"],
    },
    commonTraps: [
      {
        trap_en: "Moving the current status before the event sequence.",
        trap_vi: "Đưa tình trạng hiện tại lên trước trình tự sự việc.",
        better: {
          pa: "ਕ੍ਰਮ ਪਹਿਲਾਂ, ਹਾਲਤ ਬਾਅਦ ਦੱਸੋ।",
          romanization: "kram pehlan, halat baad dasso.",
          en: "Give the sequence first, then the status.",
          vi: "Nêu trình tự trước, rồi tình trạng.",
        },
      },
    ],
    ownerAcceptanceNote_en:
      "Language practice only, not legal or financial advice. Shahmukhi is awareness only, not a full course.",
    ownerAcceptanceNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ.",
    preIntegrationRoute_en:
      "Route to pre-integration when the final-lock timeline is repeatable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp khi dòng thời gian đã khóa có thể lặp lại.",
  },
  {
    id: "b1-final-lock-clarification",
    level: "B1",
    focus: "clarification",
    title_en: "Final-lock clarification",
    title_vi: "Khóa cuối phần làm rõ",
    scenario_en: "The learner asks one precise clarification question before the content freezes.",
    scenario_vi: "Người học hỏi một câu làm rõ chính xác trước khi khóa nội dung.",
    canadaContext: "Useful for Canadian appointments, intake desks, and class messages.",
    finalLock: {
      finalLockPrompt_en: "Lock only if the question asks for one checkable detail.",
      finalLockPrompt_vi: "Chỉ khóa nếu câu hỏi yêu cầu một chi tiết có thể kiểm tra.",
      sampleLine: {
        pa: "ਕੀ ਤੁਸੀਂ ਕਿਰਪਾ ਕਰਕੇ ਮਿਤੀ ਅਤੇ ਸਮਾਂ ਲਿਖ ਕੇ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin kirpa karke miti ate sama likh ke bhej sakde ho?",
        en: "Could you please send the date and time in writing?",
        vi: "Bạn có thể vui lòng gửi ngày và giờ bằng văn bản không?",
      },
      lockSignals_en: ["Single detail set", "Polite wording", "Written confirmation"],
      lockSignals_vi: ["Một nhóm chi tiết", "Cách nói lịch sự", "Xác nhận bằng văn bản"],
    },
    commonTraps: [
      {
        trap_en: "Locking while the missing detail is still vague.",
        trap_vi: "Khóa khi chi tiết còn thiếu vẫn mơ hồ.",
        better: {
          pa: "ਲੌਕ ਤੋਂ ਪਹਿਲਾਂ ਵੇਰਵਾ ਪੁਸ਼ਟੀ ਕਰੋ।",
          romanization: "lock ton pehlan verva pushti karo.",
          en: "Confirm the detail before lock.",
          vi: "Xác nhận chi tiết trước khi khóa.",
        },
      },
    ],
    ownerAcceptanceNote_en:
      "Final-lock passes owner-acceptance when the clarification does not broaden the task.",
    ownerAcceptanceNote_vi:
      "Khóa cuối đạt nghiệm thu chủ sở hữu khi phần làm rõ không mở rộng nhiệm vụ.",
    preIntegrationRoute_en:
      "Route to pre-integration clarification when the confirmed detail is stable.",
    preIntegrationRoute_vi:
      "Chuyển sang làm rõ tiền tích hợp khi chi tiết đã xác nhận ổn định.",
  },
  {
    id: "b1-final-lock-service-recovery",
    level: "B1",
    focus: "service_recovery",
    title_en: "Final-lock service recovery",
    title_vi: "Khóa cuối phần phục hồi dịch vụ",
    scenario_en: "The learner locks a polite reset that returns to the original request.",
    scenario_vi: "Người học khóa một câu đặt lại lịch sự quay về yêu cầu ban đầu.",
    canadaContext: "Useful for Canadian support chats, phone lines, and public counters.",
    finalLock: {
      finalLockPrompt_en: "Lock only if the repair line keeps the same request and register.",
      finalLockPrompt_vi: "Chỉ khóa nếu câu sửa giữ cùng yêu cầu và mức trang trọng.",
      sampleLine: {
        pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਦੁਬਾਰਾ ਸਪਸ਼ਟ ਕਰਦਾ ਹਾਂ। ਬੇਨਤੀ ਉਹੀ ਹੈ: ਅਗਲਾ ਕਦਮ ਦੱਸੋ ਜੀ।",
        romanization:
          "maf karna, main dubara sapasht karda han. benti ohi hai: agla kadam dasso ji.",
        en: "Sorry, I will clarify again. The request is the same: please tell me the next step.",
        vi: "Xin lỗi, tôi sẽ làm rõ lại. Yêu cầu vẫn như cũ: vui lòng cho tôi biết bước tiếp theo.",
      },
      lockSignals_en: ["Repair phrase", "Same request", "Register-safe close"],
      lockSignals_vi: ["Cụm sửa lỗi", "Cùng yêu cầu", "Kết thúc đúng mức trang trọng"],
    },
    commonTraps: [
      {
        trap_en: "Making the reset polite but changing the request.",
        trap_vi: "Đặt lại lịch sự nhưng đổi yêu cầu.",
        better: {
          pa: "ਬੇਨਤੀ ਨਾ ਬਦਲੋ।",
          romanization: "benti na badlo.",
          en: "Do not change the request.",
          vi: "Đừng đổi yêu cầu.",
        },
      },
    ],
    ownerAcceptanceNote_en:
      "Native review is deferred. Final-lock is ready when service recovery remains final-acceptance stable.",
    ownerAcceptanceNote_vi:
      "Đánh giá của người bản ngữ được để sau. Sẵn sàng khóa cuối khi phục hồi dịch vụ vẫn ổn định ở nghiệm thu cuối.",
    preIntegrationRoute_en:
      "Route to service pre-integration after the reset works in the same wording.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp dịch vụ sau khi câu đặt lại dùng được với cùng cách nói.",
  },
  {
    id: "b1-final-lock-issue-resolution",
    level: "B1",
    focus: "issue_resolution",
    title_en: "Final-lock issue resolution",
    title_vi: "Khóa cuối phần giải quyết vấn đề",
    scenario_en: "The learner locks a correction check and confirmation request.",
    scenario_vi: "Người học khóa câu kiểm tra phần sửa và yêu cầu xác nhận.",
    canadaContext: "Useful for Canadian rental repairs, account corrections, and school records.",
    finalLock: {
      finalLockPrompt_en: "Lock only if the line checks the fix without inventing the outcome.",
      finalLockPrompt_vi: "Chỉ khóa nếu câu kiểm tra phần sửa mà không bịa kết quả.",
      sampleLine: {
        pa: "ਕੀ ਇਹ ਸੁਧਾਰ ਹੋ ਗਿਆ ਹੈ? ਜੇ ਹਾਂ, ਮੈਨੂੰ ਪੁਸ਼ਟੀ ਭੇਜੋ ਜੀ।",
        romanization: "ki ih sudhar ho gia hai? je han, mainu pushti bhejo ji.",
        en: "Has this correction been made? If yes, please send me confirmation.",
        vi: "Phần sửa này đã được thực hiện chưa? Nếu rồi, vui lòng gửi xác nhận cho tôi.",
      },
      lockSignals_en: ["Correction check", "Conditional wording", "Confirmation ask"],
      lockSignals_vi: ["Kiểm tra phần sửa", "Cách nói có điều kiện", "Yêu cầu xác nhận"],
    },
    commonTraps: [
      {
        trap_en: "Freezing a sentence that promises the issue is solved.",
        trap_vi: "Khóa một câu hứa rằng vấn đề đã được giải quyết.",
        better: {
          pa: "ਨਤੀਜਾ ਪੁਸ਼ਟੀ ਨਾਲ ਜੋੜੋ।",
          romanization: "natija pushti nal joro.",
          en: "Link the result to confirmation.",
          vi: "Gắn kết quả với xác nhận.",
        },
      },
    ],
    ownerAcceptanceNote_en:
      "Language practice only, not legal or financial advice. Final-lock should keep requests separate from promises.",
    ownerAcceptanceNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Khóa cuối nên giữ yêu cầu tách khỏi lời hứa.",
    preIntegrationRoute_en:
      "Route to issue-resolution pre-integration when the confirmation wording is fixed.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp giải quyết vấn đề khi cách nói xác nhận đã cố định.",
  },
  {
    id: "b1-final-lock-follow-up-message",
    level: "B1",
    focus: "follow_up_message",
    title_en: "Final-lock follow-up message",
    title_vi: "Khóa cuối tin nhắn theo dõi",
    scenario_en: "The learner locks a brief follow-up with prior context and a status question.",
    scenario_vi: "Người học khóa một tin theo dõi ngắn có bối cảnh trước đó và câu hỏi tình trạng.",
    canadaContext: "Useful for Canadian email, SMS, portals, and community program messages.",
    finalLock: {
      finalLockPrompt_en: "Lock only if the message stays short and polite.",
      finalLockPrompt_vi: "Chỉ khóa nếu tin nhắn vẫn ngắn và lịch sự.",
      sampleLine: {
        pa: "ਮੈਂ ਬੁੱਧਵਾਰ ਵਾਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਪੁੱਛ ਰਿਹਾ ਹਾਂ। ਕੀ ਕੋਈ ਨਵੀਂ ਜਾਣਕਾਰੀ ਹੈ?",
        romanization:
          "main budhvar vale sunehe bare puchh riha han. ki koi navi jankari hai?",
        en: "I am asking about Wednesday's message. Is there any new information?",
        vi: "Tôi đang hỏi về tin nhắn hôm thứ Tư. Có thông tin mới nào không?",
      },
      lockSignals_en: ["Prior message", "Date marker", "Polite status question"],
      lockSignals_vi: ["Tin nhắn trước", "Mốc ngày", "Câu hỏi tình trạng lịch sự"],
    },
    commonTraps: [
      {
        trap_en: "Adding pressure language in the final version.",
        trap_vi: "Thêm ngôn ngữ gây áp lực trong phiên bản cuối.",
        better: {
          pa: "ਸਥਿਤੀ ਨਰਮੀ ਨਾਲ ਪੁੱਛੋ।",
          romanization: "sthiti narmi nal puchho.",
          en: "Ask gently about the status.",
          vi: "Hỏi tình trạng một cách nhẹ nhàng.",
        },
      },
    ],
    ownerAcceptanceNote_en:
      "Final-lock is owner-acceptance ready when the follow-up remains brief through final-acceptance.",
    ownerAcceptanceNote_vi:
      "Khóa cuối sẵn sàng cho nghiệm thu chủ sở hữu khi tin theo dõi vẫn ngắn qua nghiệm thu cuối.",
    preIntegrationRoute_en:
      "Route to pre-integration messaging when the date marker can be swapped safely.",
    preIntegrationRoute_vi:
      "Chuyển sang nhắn tin tiền tích hợp khi mốc ngày có thể thay an toàn.",
  },
  {
    id: "b1-final-lock-workplace-task",
    level: "B1",
    focus: "workplace_task",
    title_en: "Final-lock workplace task",
    title_vi: "Khóa cuối nhiệm vụ nơi làm việc",
    scenario_en: "The learner locks a workplace task with time and backup communication.",
    scenario_vi: "Người học khóa một nhiệm vụ nơi làm việc có thời gian và trao đổi dự phòng.",
    canadaContext: "Useful for Canadian part-time jobs, volunteer shifts, and team handoffs.",
    finalLock: {
      finalLockPrompt_en: "Lock only if task, time, and backup action are all present.",
      finalLockPrompt_vi: "Chỉ khóa nếu có đủ nhiệm vụ, thời gian, và hành động dự phòng.",
      sampleLine: {
        pa: "ਮੈਂ ਪੰਜ ਵਜੇ ਲਿਸਟ ਚੈੱਕ ਕਰਾਂਗਾ। ਜੇ ਸਮੱਸਿਆ ਆਈ, ਮੈਂ ਟੀਮ ਲੀਡ ਨੂੰ ਦੱਸਾਂਗਾ।",
        romanization:
          "main panj vaje list check karanga. je samassia ai, main team lead nu dassanga.",
        en: "I will check the list at five. If a problem comes up, I will tell the team lead.",
        vi: "Tôi sẽ kiểm tra danh sách lúc năm giờ. Nếu có vấn đề, tôi sẽ báo cho trưởng nhóm.",
      },
      lockSignals_en: ["Task", "Time", "Backup contact"],
      lockSignals_vi: ["Nhiệm vụ", "Thời gian", "Liên hệ dự phòng"],
    },
    commonTraps: [
      {
        trap_en: "Locking the task without saying who to tell.",
        trap_vi: "Khóa nhiệm vụ mà không nói báo cho ai.",
        better: {
          pa: "ਕਿਸਨੂੰ ਦੱਸਣਾ ਹੈ, ਇਹ ਜੋੜੋ।",
          romanization: "kisnu dassna hai, ih joro.",
          en: "Add who to tell.",
          vi: "Thêm người cần báo.",
        },
      },
    ],
    ownerAcceptanceNote_en:
      "Final-lock passes owner-acceptance when it avoids workplace policy claims and stays practice-only.",
    ownerAcceptanceNote_vi:
      "Khóa cuối đạt nghiệm thu chủ sở hữu khi tránh tuyên bố chính sách nơi làm việc và chỉ là luyện tập.",
    preIntegrationRoute_en:
      "Route to workplace pre-integration when all three task fields are stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp nơi làm việc khi cả ba phần nhiệm vụ đều ổn định.",
  },
  {
    id: "b1-final-lock-housing-school-community",
    level: "B1",
    focus: "housing_school_community",
    title_en: "Final-lock housing, school, and community task",
    title_vi: "Khóa cuối nhiệm vụ nhà ở, trường học, và cộng đồng",
    scenario_en: "The learner locks a transferable request for the right contact or time.",
    scenario_vi: "Người học khóa một yêu cầu có thể chuyển bối cảnh để xin đúng liên hệ hoặc thời gian.",
    canadaContext: "Useful for Canadian rentals, school offices, libraries, and community programs.",
    finalLock: {
      finalLockPrompt_en: "Lock only if the core request transfers without becoming vague.",
      finalLockPrompt_vi: "Chỉ khóa nếu yêu cầu cốt lõi chuyển bối cảnh mà không trở nên mơ hồ.",
      sampleLine: {
        pa: "ਮੈਨੂੰ ਸਹੀ ਵਿਅਕਤੀ ਨਾਲ ਗੱਲ ਕਰਨੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਸੰਪਰਕ ਜਾਂ ਸਮਾਂ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization:
          "mainu sahi viakti nal gall karni hai. ki tusin sampark ja sama bhej sakde ho?",
        en: "I need to speak with the right person. Can you send the contact or time?",
        vi: "Tôi cần nói chuyện với đúng người. Bạn có thể gửi liên hệ hoặc thời gian không?",
      },
      lockSignals_en: ["Right contact", "Time or contact", "Transferable request"],
      lockSignals_vi: ["Đúng người liên hệ", "Thời gian hoặc liên hệ", "Yêu cầu có thể chuyển bối cảnh"],
    },
    commonTraps: [
      {
        trap_en: "Using a generic sentence that no longer names the action.",
        trap_vi: "Dùng câu chung chung không còn nêu hành động.",
        better: {
          pa: "ਸੰਪਰਕ ਜਾਂ ਸਮਾਂ ਸਾਫ਼ ਮੰਗੋ।",
          romanization: "sampark ja sama saf mango.",
          en: "Clearly ask for the contact or time.",
          vi: "Hỏi rõ liên hệ hoặc thời gian.",
        },
      },
    ],
    ownerAcceptanceNote_en:
      "Final-lock is ready when owner-acceptance confirms the same wording works for housing, school, or community tasks.",
    ownerAcceptanceNote_vi:
      "Sẵn sàng khóa cuối khi nghiệm thu chủ sở hữu xác nhận cùng cách nói dùng được cho nhiệm vụ nhà ở, trường học, hoặc cộng đồng.",
    preIntegrationRoute_en:
      "Route to pre-integration when setting swaps do not change the locked request.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp khi đổi bối cảnh không làm thay đổi yêu cầu đã khóa.",
  },
  {
    id: "b1-final-lock-register-safe-repair",
    level: "B1",
    focus: "register_safe_repair",
    title_en: "Final-lock register-safe repair",
    title_vi: "Khóa cuối sửa câu đúng mức trang trọng",
    scenario_en: "The learner locks a polite, direct repair that keeps the same meaning.",
    scenario_vi: "Người học khóa một câu sửa lịch sự, trực tiếp, giữ cùng nghĩa.",
    canadaContext: "Useful for Canadian service desks, school offices, and workplace messages.",
    finalLock: {
      finalLockPrompt_en: "Lock only if politeness does not hide the request.",
      finalLockPrompt_vi: "Chỉ khóa nếu sự lịch sự không che mất yêu cầu.",
      sampleLine: {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਦੱਸੋ ਕਿ ਇਹ ਕੰਮ ਕਦੋਂ ਮੁਕੰਮਲ ਹੋ ਸਕਦਾ ਹੈ।",
        romanization: "kirpa karke mainu dasso ki ih kamm kadon mukammal ho sakda hai.",
        en: "Please tell me when this work can be completed.",
        vi: "Vui lòng cho tôi biết khi nào việc này có thể hoàn tất.",
      },
      lockSignals_en: ["Polite marker", "Direct request", "Same meaning"],
      lockSignals_vi: ["Dấu hiệu lịch sự", "Yêu cầu trực tiếp", "Cùng nghĩa"],
    },
    commonTraps: [
      {
        trap_en: "Softening the sentence until the requested action disappears.",
        trap_vi: "Làm mềm câu đến mức hành động được yêu cầu biến mất.",
        better: {
          pa: "ਨਰਮੀ ਨਾਲ ਸਾਫ਼ ਬੇਨਤੀ ਰੱਖੋ।",
          romanization: "narmi nal saf benti rakho.",
          en: "Keep a clear request with politeness.",
          vi: "Giữ yêu cầu rõ với sự lịch sự.",
        },
      },
    ],
    ownerAcceptanceNote_en:
      "Native review is deferred. Final-lock is ready when register-safe repair stays stable from final-acceptance to pre-integration.",
    ownerAcceptanceNote_vi:
      "Đánh giá của người bản ngữ được để sau. Sẵn sàng khóa cuối khi câu sửa đúng mức trang trọng ổn định từ nghiệm thu cuối đến tiền tích hợp.",
    preIntegrationRoute_en:
      "Route to pre-integration repair drills after the locked polite line remains direct.",
    preIntegrationRoute_vi:
      "Chuyển sang bài luyện sửa câu tiền tích hợp sau khi câu lịch sự đã khóa vẫn trực tiếp.",
  },
];
