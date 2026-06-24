export type PunjabiB1AcceptanceFocus =
  | "situation_explanation"
  | "event_retelling"
  | "clarification"
  | "service_recovery"
  | "issue_resolution"
  | "follow_up_message"
  | "workplace_task"
  | "housing_task"
  | "register_safe_repair";

export type PunjabiAcceptanceLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiAcceptanceTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiAcceptanceLine;
};

export type PunjabiAcceptanceCheck = {
  acceptancePrompt_en: string;
  acceptancePrompt_vi: string;
  sampleLine: PunjabiAcceptanceLine;
  acceptanceSignals_en: string[];
  acceptanceSignals_vi: string[];
};

export type PunjabiB1AcceptanceCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1AcceptanceFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  acceptance: PunjabiAcceptanceCheck;
  commonTraps: PunjabiAcceptanceTrap[];
  shipCandidateNote_en: string;
  shipCandidateNote_vi: string;
  preIntegrationRoute_en: string;
  preIntegrationRoute_vi: string;
};

export const punjabiB1AcceptanceSamples: PunjabiB1AcceptanceCard[] = [
  {
    id: "b1-acceptance-situation-explanation",
    level: "B1",
    focus: "situation_explanation",
    title_en: "Acceptance situation explanation",
    title_vi: "Giải thích tình huống để nghiệm thu",
    scenario_en: "The learner explains what happened, why it matters, and what help is needed.",
    scenario_vi: "Người học giải thích điều đã xảy ra, vì sao quan trọng, và cần hỗ trợ gì.",
    canadaContext: "Useful at Canadian newcomer centres, clinics, and front desks.",
    acceptance: {
      acceptancePrompt_en: "Can the learner state one situation, one reason, and one next step?",
      acceptancePrompt_vi:
        "Người học có nêu được một tình huống, một lý do, và một bước tiếp theo không?",
      sampleLine: {
        pa: "ਮੇਰੀ ਮੁਲਾਕਾਤ ਰਹਿ ਗਈ ਕਿਉਂਕਿ ਬੱਸ ਦੇਰ ਨਾਲ ਆਈ, ਇਸ ਲਈ ਮੈਨੂੰ ਨਵਾਂ ਸਮਾਂ ਚਾਹੀਦਾ ਹੈ।",
        romanization:
          "meri mulakat reh gai kyonki bas der nal ai, is lai mainu nava sama chahida hai.",
        en: "I missed my appointment because the bus came late, so I need a new time.",
        vi: "Tôi lỡ cuộc hẹn vì xe buýt đến muộn, nên tôi cần một giờ mới.",
      },
      acceptanceSignals_en: ["Clear event", "Reason", "Specific next step"],
      acceptanceSignals_vi: ["Sự việc rõ", "Lý do", "Bước tiếp theo cụ thể"],
    },
    commonTraps: [
      {
        trap_en: "Explaining many side problems before the main request.",
        trap_vi: "Giải thích nhiều vấn đề phụ trước yêu cầu chính.",
        better: {
          pa: "ਮੁੱਖ ਗੱਲ ਪਹਿਲਾਂ ਦੱਸੋ।",
          romanization: "mukh gall pehlan dasso.",
          en: "Say the main point first.",
          vi: "Nói ý chính trước.",
        },
      },
    ],
    shipCandidateNote_en:
      "Language practice only, not medical advice. Acceptance is ship-candidate ready when the explanation survives go-no-go without new facts.",
    shipCandidateNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Đạt nghiệm thu để bàn giao khi phần giải thích qua go-no-go mà không thêm dữ kiện mới.",
    preIntegrationRoute_en:
      "Route to pre-integration when the reason and next step stay stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp khi lý do và bước tiếp theo vẫn ổn định.",
  },
  {
    id: "b1-acceptance-event-retelling",
    level: "B1",
    focus: "event_retelling",
    title_en: "Acceptance event retelling",
    title_vi: "Kể lại sự việc để nghiệm thu",
    scenario_en: "The learner retells an event in order and names the current result.",
    scenario_vi: "Người học kể lại sự việc theo thứ tự và nêu kết quả hiện tại.",
    canadaContext: "Useful for Canadian workplace, school, and housing incident reports.",
    acceptance: {
      acceptancePrompt_en: "Can the learner keep sequence, time markers, and result aligned?",
      acceptancePrompt_vi:
        "Người học có giữ được trình tự, mốc thời gian, và kết quả khớp nhau không?",
      sampleLine: {
        pa: "ਪਹਿਲਾਂ ਮੈਂ ਫਾਰਮ ਭਰਿਆ, ਫਿਰ ਦਫ਼ਤਰ ਗਿਆ, ਅਤੇ ਹੁਣ ਉਹ ਜਵਾਬ ਦੀ ਉਡੀਕ ਕਰ ਰਹੇ ਹਨ।",
        romanization:
          "pehlan main farm bharia, phir daftar gia, ate hun oh javab di udik kar rahe han.",
        en: "First I filled out the form, then I went to the office, and now they are waiting for a reply.",
        vi: "Trước tiên tôi điền mẫu, rồi đến văn phòng, và bây giờ họ đang chờ phản hồi.",
      },
      acceptanceSignals_en: ["Ordered steps", "Current result", "No timeline jump"],
      acceptanceSignals_vi: ["Các bước theo thứ tự", "Kết quả hiện tại", "Không nhảy mốc thời gian"],
    },
    commonTraps: [
      {
        trap_en: "Using then and now without a real order.",
        trap_vi: "Dùng rồi và bây giờ nhưng không có thứ tự thật.",
        better: {
          pa: "ਪਹਿਲਾਂ, ਫਿਰ, ਹੁਣ ਵਰਤੋ।",
          romanization: "pehlan, phir, hun varto.",
          en: "Use first, then, now.",
          vi: "Dùng trước tiên, rồi, bây giờ.",
        },
      },
    ],
    shipCandidateNote_en:
      "Language practice only, not legal or financial advice. Shahmukhi is awareness only, not a full course.",
    shipCandidateNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ.",
    preIntegrationRoute_en:
      "Route to pre-integration when the retelling is repeatable in the same order.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp khi phần kể lại có thể lặp theo cùng thứ tự.",
  },
  {
    id: "b1-acceptance-clarification",
    level: "B1",
    focus: "clarification",
    title_en: "Acceptance clarification",
    title_vi: "Làm rõ để nghiệm thu",
    scenario_en: "The learner asks for missing information and confirms what they understood.",
    scenario_vi: "Người học hỏi thông tin còn thiếu và xác nhận điều đã hiểu.",
    canadaContext: "Useful for Canadian appointments, public services, and class instructions.",
    acceptance: {
      acceptancePrompt_en: "Can the learner ask for one missing detail without sounding abrupt?",
      acceptancePrompt_vi:
        "Người học có hỏi một chi tiết còn thiếu mà không nghe cộc không?",
      sampleLine: {
        pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਇਹ ਗੱਲ ਫਿਰ ਲਿਖ ਸਕਦੇ ਹੋ ਕਿ ਮੈਨੂੰ ਕਿਹੜਾ ਦਸਤਾਵੇਜ਼ ਲਿਆਉਣਾ ਹੈ?",
        romanization:
          "maf karna, ki tusin ih gall phir likh sakde ho ki mainu kihra dastavez liauna hai?",
        en: "Sorry, can you write again which document I need to bring?",
        vi: "Xin lỗi, bạn có thể viết lại tôi cần mang giấy tờ nào không?",
      },
      acceptanceSignals_en: ["Polite opener", "Single missing detail", "Written confirmation"],
      acceptanceSignals_vi: ["Mở lời lịch sự", "Một chi tiết thiếu", "Xác nhận bằng văn bản"],
    },
    commonTraps: [
      {
        trap_en: "Asking three unclear questions at once.",
        trap_vi: "Hỏi ba câu không rõ cùng lúc.",
        better: {
          pa: "ਇੱਕ ਸਵਾਲ ਪੁੱਛੋ।",
          romanization: "ik saval puchho.",
          en: "Ask one question.",
          vi: "Hỏi một câu.",
        },
      },
    ],
    shipCandidateNote_en:
      "Acceptance passes go-no-go when the clarification asks one checkable question.",
    shipCandidateNote_vi:
      "Phần làm rõ đạt go-no-go khi chỉ hỏi một câu có thể kiểm tra.",
    preIntegrationRoute_en:
      "Route to pre-integration clarification after the learner can repeat the confirmed detail.",
    preIntegrationRoute_vi:
      "Chuyển sang làm rõ tiền tích hợp sau khi người học có thể lặp lại chi tiết đã xác nhận.",
  },
  {
    id: "b1-acceptance-service-recovery",
    level: "B1",
    focus: "service_recovery",
    title_en: "Acceptance service recovery",
    title_vi: "Phục hồi dịch vụ để nghiệm thu",
    scenario_en: "The learner resets a difficult exchange and keeps the original request stable.",
    scenario_vi: "Người học đặt lại một trao đổi khó và giữ yêu cầu ban đầu ổn định.",
    canadaContext: "Useful for Canadian service counters, support chats, and phone queues.",
    acceptance: {
      acceptancePrompt_en: "Can the learner repair the tone and return to the same request?",
      acceptancePrompt_vi:
        "Người học có sửa giọng điệu và quay lại cùng yêu cầu không?",
      sampleLine: {
        pa: "ਸ਼ਾਇਦ ਮੈਂ ਸਪਸ਼ਟ ਨਹੀਂ ਸੀ। ਮੇਰੀ ਬੇਨਤੀ ਉਹੀ ਹੈ: ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।",
        romanization:
          "shayad main sapasht nahin si. meri benti ohi hai: kirpa karke agla kadam dasso.",
        en: "Maybe I was not clear. My request is the same: please tell me the next step.",
        vi: "Có lẽ tôi chưa rõ. Yêu cầu của tôi vẫn như cũ: vui lòng cho tôi biết bước tiếp theo.",
      },
      acceptanceSignals_en: ["Repair phrase", "Same request", "Polite next-step ask"],
      acceptanceSignals_vi: ["Cụm sửa lỗi giao tiếp", "Cùng yêu cầu", "Hỏi bước tiếp theo lịch sự"],
    },
    commonTraps: [
      {
        trap_en: "Apologizing but changing the request.",
        trap_vi: "Xin lỗi nhưng lại đổi yêu cầu.",
        better: {
          pa: "ਬੇਨਤੀ ਉਹੀ ਰੱਖੋ।",
          romanization: "benti ohi rakho.",
          en: "Keep the request the same.",
          vi: "Giữ yêu cầu như cũ.",
        },
      },
    ],
    shipCandidateNote_en:
      "Native review is deferred. Acceptance is ready when the recovery line remains register-safe and go-no-go stable.",
    shipCandidateNote_vi:
      "Đánh giá của người bản ngữ được để sau. Đạt nghiệm thu khi câu phục hồi giữ đúng mức trang trọng và ổn định ở go-no-go.",
    preIntegrationRoute_en:
      "Route to service pre-integration when the reset phrase works across channels.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp dịch vụ khi câu đặt lại dùng được qua nhiều kênh.",
  },
  {
    id: "b1-acceptance-issue-resolution",
    level: "B1",
    focus: "issue_resolution",
    title_en: "Acceptance issue resolution",
    title_vi: "Giải quyết vấn đề để nghiệm thu",
    scenario_en: "The learner checks the fix, asks for confirmation, and avoids inventing outcomes.",
    scenario_vi: "Người học kiểm tra phần sửa, xin xác nhận, và tránh bịa kết quả.",
    canadaContext: "Useful for Canadian tenant repairs, school records, and service corrections.",
    acceptance: {
      acceptancePrompt_en: "Can the learner link the fix to written confirmation?",
      acceptancePrompt_vi:
        "Người học có nối phần sửa với xác nhận bằng văn bản không?",
      sampleLine: {
        pa: "ਜੇ ਸੁਧਾਰ ਹੋ ਗਿਆ ਹੈ, ਕੀ ਤੁਸੀਂ ਮੈਨੂੰ ਛੋਟੀ ਪੁਸ਼ਟੀ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization:
          "je sudhar ho gia hai, ki tusin mainu chhoti pushti bhej sakde ho?",
        en: "If the correction has been made, can you send me a short confirmation?",
        vi: "Nếu phần sửa đã xong, bạn có thể gửi cho tôi một xác nhận ngắn không?",
      },
      acceptanceSignals_en: ["Conditional wording", "Correction", "Confirmation request"],
      acceptanceSignals_vi: ["Cách nói có điều kiện", "Phần sửa", "Yêu cầu xác nhận"],
    },
    commonTraps: [
      {
        trap_en: "Saying the issue is solved before confirmation arrives.",
        trap_vi: "Nói vấn đề đã giải quyết trước khi có xác nhận.",
        better: {
          pa: "ਪਹਿਲਾਂ ਪੁਸ਼ਟੀ ਲਓ।",
          romanization: "pehlan pushti lao.",
          en: "Get confirmation first.",
          vi: "Lấy xác nhận trước.",
        },
      },
    ],
    shipCandidateNote_en:
      "Language practice only, not legal or financial advice. Acceptance should not turn a request into a promise.",
    shipCandidateNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Phần nghiệm thu không nên biến yêu cầu thành lời hứa.",
    preIntegrationRoute_en:
      "Route to issue-resolution pre-integration when the confirmation step is explicit.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp giải quyết vấn đề khi bước xác nhận rõ ràng.",
  },
  {
    id: "b1-acceptance-follow-up-message",
    level: "B1",
    focus: "follow_up_message",
    title_en: "Acceptance follow-up message",
    title_vi: "Tin nhắn theo dõi để nghiệm thu",
    scenario_en: "The learner sends a short follow-up after no reply.",
    scenario_vi: "Người học gửi một tin nhắn theo dõi ngắn sau khi chưa có phản hồi.",
    canadaContext: "Useful for Canadian email, SMS, and portal messages.",
    acceptance: {
      acceptancePrompt_en: "Can the learner follow up with context, date, and a polite ask?",
      acceptancePrompt_vi:
        "Người học có theo dõi với bối cảnh, ngày, và yêu cầu lịch sự không?",
      sampleLine: {
        pa: "ਮੈਂ ਸੋਮਵਾਰ ਵਾਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਪੁੱਛ ਰਿਹਾ ਹਾਂ। ਕੀ ਕੋਈ ਨਵੀਂ ਜਾਣਕਾਰੀ ਹੈ?",
        romanization:
          "main somvar vale sunehe bare puchh riha han. ki koi navi jankari hai?",
        en: "I am asking about Monday's message. Is there any new information?",
        vi: "Tôi đang hỏi về tin nhắn hôm thứ Hai. Có thông tin mới nào không?",
      },
      acceptanceSignals_en: ["Previous contact", "Date marker", "Polite status question"],
      acceptanceSignals_vi: ["Liên hệ trước đó", "Mốc ngày", "Câu hỏi tình trạng lịch sự"],
    },
    commonTraps: [
      {
        trap_en: "Writing a follow-up that sounds like a complaint.",
        trap_vi: "Viết tin theo dõi nghe như khiếu nại.",
        better: {
          pa: "ਨਵੀਂ ਜਾਣਕਾਰੀ ਨਰਮੀ ਨਾਲ ਪੁੱਛੋ।",
          romanization: "navi jankari narmi nal puchho.",
          en: "Ask gently for new information.",
          vi: "Hỏi nhẹ nhàng về thông tin mới.",
        },
      },
    ],
    shipCandidateNote_en:
      "Acceptance is ship-candidate ready when the follow-up stays brief, polite, and go-no-go stable.",
    shipCandidateNote_vi:
      "Đạt nghiệm thu để bàn giao khi tin theo dõi vẫn ngắn, lịch sự, và ổn định ở go-no-go.",
    preIntegrationRoute_en:
      "Route to pre-integration messaging after the learner can adapt the date marker.",
    preIntegrationRoute_vi:
      "Chuyển sang nhắn tin tiền tích hợp sau khi người học có thể đổi mốc ngày.",
  },
  {
    id: "b1-acceptance-workplace-task",
    level: "B1",
    focus: "workplace_task",
    title_en: "Acceptance workplace task",
    title_vi: "Nhiệm vụ nơi làm việc để nghiệm thu",
    scenario_en: "The learner confirms a shift task and asks what to do if timing changes.",
    scenario_vi: "Người học xác nhận nhiệm vụ ca làm và hỏi cần làm gì nếu thời gian thay đổi.",
    canadaContext: "Useful for Canadian part-time jobs, volunteer shifts, and team handoffs.",
    acceptance: {
      acceptancePrompt_en: "Can the learner confirm task, time, and backup action?",
      acceptancePrompt_vi:
        "Người học có xác nhận nhiệm vụ, thời gian, và hành động dự phòng không?",
      sampleLine: {
        pa: "ਮੈਂ ਤਿੰਨ ਵਜੇ ਸਟਾਕ ਚੈੱਕ ਕਰਾਂਗਾ। ਜੇ ਸਮਾਂ ਬਦਲੇ, ਮੈਂ ਸੁਪਰਵਾਈਜ਼ਰ ਨੂੰ ਦੱਸਾਂਗਾ।",
        romanization:
          "main tinn vaje stak check karanga. je sama badle, main supervisor nu dassanga.",
        en: "I will check stock at three. If the time changes, I will tell the supervisor.",
        vi: "Tôi sẽ kiểm tra hàng lúc ba giờ. Nếu thời gian thay đổi, tôi sẽ báo cho giám sát.",
      },
      acceptanceSignals_en: ["Task", "Time", "Backup communication"],
      acceptanceSignals_vi: ["Nhiệm vụ", "Thời gian", "Trao đổi dự phòng"],
    },
    commonTraps: [
      {
        trap_en: "Confirming the task but not the time.",
        trap_vi: "Xác nhận nhiệm vụ nhưng không xác nhận thời gian.",
        better: {
          pa: "ਕੰਮ ਅਤੇ ਸਮਾਂ ਦੋਵੇਂ ਦੱਸੋ।",
          romanization: "kamm ate sama dovein dasso.",
          en: "Say both the task and the time.",
          vi: "Nói cả nhiệm vụ và thời gian.",
        },
      },
    ],
    shipCandidateNote_en:
      "Acceptance passes go-no-go when the workplace task can be repeated without adding workplace policy claims.",
    shipCandidateNote_vi:
      "Đạt go-no-go khi nhiệm vụ nơi làm việc có thể lặp lại mà không thêm tuyên bố về chính sách công ty.",
    preIntegrationRoute_en:
      "Route to workplace pre-integration when task, time, and backup action are stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp nơi làm việc khi nhiệm vụ, thời gian, và hành động dự phòng ổn định.",
  },
  {
    id: "b1-acceptance-housing-task",
    level: "B1",
    focus: "housing_task",
    title_en: "Acceptance housing task",
    title_vi: "Nhiệm vụ nhà ở để nghiệm thu",
    scenario_en: "The learner reports a housing repair and asks for a visit window.",
    scenario_vi: "Người học báo một sửa chữa nhà ở và hỏi khung giờ ghé qua.",
    canadaContext: "Useful for Canadian rentals, residence offices, and maintenance desks.",
    acceptance: {
      acceptancePrompt_en: "Can the learner describe the repair and ask for a practical time window?",
      acceptancePrompt_vi:
        "Người học có mô tả phần cần sửa và hỏi khung giờ thực tế không?",
      sampleLine: {
        pa: "ਸਿੰਕ ਤੋਂ ਪਾਣੀ ਟਪਕ ਰਿਹਾ ਹੈ। ਕੀ ਮੁਰੰਮਤ ਲਈ ਸਵੇਰੇ ਜਾਂ ਦੁਪਹਿਰ ਦਾ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?",
        romanization:
          "sink ton pani tapak riha hai. ki murammat lai savere ja dupahir da sama mil sakda hai?",
        en: "Water is dripping from the sink. Can I get a morning or afternoon time for the repair?",
        vi: "Nước đang nhỏ từ bồn rửa. Tôi có thể có khung giờ buổi sáng hoặc buổi chiều để sửa không?",
      },
      acceptanceSignals_en: ["Problem location", "Repair request", "Time window"],
      acceptanceSignals_vi: ["Vị trí vấn đề", "Yêu cầu sửa chữa", "Khung giờ"],
    },
    commonTraps: [
      {
        trap_en: "Using too much emotion instead of the repair detail.",
        trap_vi: "Dùng quá nhiều cảm xúc thay vì chi tiết sửa chữa.",
        better: {
          pa: "ਥਾਂ ਅਤੇ ਸਮੱਸਿਆ ਸਾਫ਼ ਦੱਸੋ।",
          romanization: "than ate samassia saf dasso.",
          en: "State the place and problem clearly.",
          vi: "Nêu rõ nơi và vấn đề.",
        },
      },
    ],
    shipCandidateNote_en:
      "Language practice only, not legal or financial advice. Acceptance focuses on reporting and scheduling, not tenant-rights advice.",
    shipCandidateNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Nghiệm thu tập trung vào báo lỗi và hẹn lịch, không phải tư vấn quyền thuê nhà.",
    preIntegrationRoute_en:
      "Route to housing pre-integration when the learner can keep repair facts stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp nhà ở khi người học giữ được dữ kiện sửa chữa ổn định.",
  },
  {
    id: "b1-acceptance-register-safe-repair",
    level: "B1",
    focus: "register_safe_repair",
    title_en: "Acceptance register-safe repair",
    title_vi: "Sửa câu đúng mức trang trọng để nghiệm thu",
    scenario_en: "The learner changes a blunt sentence into a polite but direct repair.",
    scenario_vi: "Người học đổi một câu cộc thành câu sửa lịch sự nhưng trực tiếp.",
    canadaContext: "Useful for Canadian school offices, service desks, and community programs.",
    acceptance: {
      acceptancePrompt_en: "Can the learner soften tone without hiding the request?",
      acceptancePrompt_vi:
        "Người học có làm mềm giọng mà không che mất yêu cầu không?",
      sampleLine: {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਦੱਸੋ ਕਿ ਇਹ ਕੰਮ ਕਦੋਂ ਮੁਕੰਮਲ ਹੋਵੇਗਾ।",
        romanization: "kirpa karke mainu dasso ki ih kamm kadon mukammal hovega.",
        en: "Please tell me when this work will be completed.",
        vi: "Vui lòng cho tôi biết khi nào việc này sẽ hoàn tất.",
      },
      acceptanceSignals_en: ["Polite marker", "Direct request", "No blame wording"],
      acceptanceSignals_vi: ["Dấu hiệu lịch sự", "Yêu cầu trực tiếp", "Không dùng lời đổ lỗi"],
    },
    commonTraps: [
      {
        trap_en: "Making the repair so soft that the request disappears.",
        trap_vi: "Sửa quá mềm đến mức yêu cầu biến mất.",
        better: {
          pa: "ਨਰਮੀ ਨਾਲ ਸਾਫ਼ ਬੇਨਤੀ ਕਰੋ।",
          romanization: "narmi nal saf benti karo.",
          en: "Make a clear request politely.",
          vi: "Đưa ra yêu cầu rõ một cách lịch sự.",
        },
      },
    ],
    shipCandidateNote_en:
      "Native review is deferred. Acceptance is ready when register-safe repair keeps the same meaning across go-no-go checks.",
    shipCandidateNote_vi:
      "Đánh giá của người bản ngữ được để sau. Đạt nghiệm thu khi câu sửa đúng mức trang trọng giữ cùng nghĩa qua kiểm tra go-no-go.",
    preIntegrationRoute_en:
      "Route to pre-integration repair practice when the polite version remains direct.",
    preIntegrationRoute_vi:
      "Chuyển sang luyện sửa câu tiền tích hợp khi phiên bản lịch sự vẫn trực tiếp.",
  },
];
