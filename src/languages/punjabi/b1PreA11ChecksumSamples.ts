export type PunjabiB1PreA11ChecksumFocus =
  | "situation_explanation"
  | "event_retelling"
  | "clarification"
  | "service_recovery"
  | "issue_resolution"
  | "follow_up_message"
  | "workplace_task"
  | "housing_school_community"
  | "register_safe_repair";

export type PunjabiPreA11ChecksumLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiPreA11ChecksumTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiPreA11ChecksumLine;
};

export type PunjabiPreA11ChecksumCheck = {
  checksumPrompt_en: string;
  checksumPrompt_vi: string;
  sampleLine: PunjabiPreA11ChecksumLine;
  checksumSignals_en: string[];
  checksumSignals_vi: string[];
};

export type PunjabiB1PreA11ChecksumCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1PreA11ChecksumFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  preA11Checksum: PunjabiPreA11ChecksumCheck;
  commonTraps: PunjabiPreA11ChecksumTrap[];
  runnerReadinessNote_en: string;
  runnerReadinessNote_vi: string;
  preIntegrationRoute_en: string;
  preIntegrationRoute_vi: string;
};

export const punjabiB1PreA11ChecksumSamples: PunjabiB1PreA11ChecksumCard[] = [
  {
    id: "b1-pre-a11-checksum-situation-explanation",
    level: "B1",
    focus: "situation_explanation",
    title_en: "Pre-A11 checksum situation explanation",
    title_vi: "Tổng kiểm tra trước A11 cho giải thích tình huống",
    scenario_en: "The learner explains one stable problem, reason, and next step.",
    scenario_vi: "Người học giải thích một vấn đề, lý do, và bước tiếp theo ổn định.",
    canadaContext: "Useful for Canadian newcomer centres, clinic reception, and front desks.",
    preA11Checksum: {
      checksumPrompt_en: "Checksum passes when the line stays stable across runner and pipeline checks.",
      checksumPrompt_vi:
        "Tổng kiểm tra đạt khi câu vẫn ổn định qua kiểm tra runner và pipeline.",
      sampleLine: {
        pa: "ਮੈਂ ਦੇਰ ਨਾਲ ਆਇਆ ਕਿਉਂਕਿ ਬੱਸ ਦੇਰ ਨਾਲ ਸੀ। ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।",
        romanization:
          "main der nal aia kyonki bas der nal si. kirpa karke agla kadam dasso.",
        en: "I came late because the bus was late. Please tell me the next step.",
        vi: "Tôi đến muộn vì xe buýt trễ. Vui lòng cho tôi biết bước tiếp theo.",
      },
      checksumSignals_en: ["One reason", "One next step", "No new facts"],
      checksumSignals_vi: ["Một lý do", "Một bước tiếp theo", "Không thêm dữ kiện"],
    },
    commonTraps: [
      {
        trap_en: "Adding a new reason during the checksum pass.",
        trap_vi: "Thêm lý do mới trong lượt tổng kiểm tra.",
        better: {
          pa: "ਉਹੀ ਕਾਰਨ ਰੱਖੋ।",
          romanization: "ohi karan rakho.",
          en: "Keep the same reason.",
          vi: "Giữ cùng lý do.",
        },
      },
    ],
    runnerReadinessNote_en:
      "Language practice only, not medical advice. Pre-A11 checksum is ready when runner-readiness and pipeline-readiness stay aligned.",
    runnerReadinessNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Tổng kiểm tra trước A11 sẵn sàng khi sẵn sàng runner và pipeline vẫn khớp nhau.",
    preIntegrationRoute_en:
      "Route to pre-integration after the checksum evidence repeats unchanged.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp sau khi bằng chứng tổng kiểm tra lặp lại không đổi.",
  },
  {
    id: "b1-pre-a11-checksum-event-retelling",
    level: "B1",
    focus: "event_retelling",
    title_en: "Pre-A11 checksum event retelling",
    title_vi: "Tổng kiểm tra trước A11 cho kể lại sự việc",
    scenario_en: "The learner retells an event in a stable first-then-now order.",
    scenario_vi: "Người học kể lại sự việc theo trình tự trước tiên-rồi-bây giờ ổn định.",
    canadaContext: "Useful for Canadian school, workplace, and housing reports.",
    preA11Checksum: {
      checksumPrompt_en: "Checksum passes when sequence and status stay stable under review.",
      checksumPrompt_vi:
        "Tổng kiểm tra đạt khi trình tự và tình trạng vẫn ổn định khi rà soát.",
      sampleLine: {
        pa: "ਪਹਿਲਾਂ ਮੈਂ ਕਾਲ ਕੀਤੀ, ਫਿਰ ਸੁਨੇਹਾ ਛੱਡਿਆ, ਅਤੇ ਹੁਣ ਜਵਾਬ ਦੀ ਉਡੀਕ ਹੈ।",
        romanization:
          "pehlan main call kiti, phir suneha chhaddia, ate hun javab di udik hai.",
        en: "First I called, then I left a message, and now I am waiting for a reply.",
        vi: "Trước tiên tôi gọi, rồi để lại tin nhắn, và bây giờ tôi đang chờ phản hồi.",
      },
      checksumSignals_en: ["Fixed sequence", "Current status", "No side story"],
      checksumSignals_vi: ["Trình tự cố định", "Tình trạng hiện tại", "Không chuyện phụ"],
    },
    commonTraps: [
      {
        trap_en: "Changing the order during checksum review.",
        trap_vi: "Đổi thứ tự trong lúc rà soát tổng kiểm tra.",
        better: {
          pa: "ਉਹੀ ਕ੍ਰਮ ਵਰਤੋ।",
          romanization: "ohi kram varto.",
          en: "Use the same order.",
          vi: "Dùng cùng thứ tự.",
        },
      },
    ],
    runnerReadinessNote_en:
      "Language practice only, not legal or financial advice. Shahmukhi is awareness only, not a full course.",
    runnerReadinessNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ.",
    preIntegrationRoute_en:
      "Route to pre-integration when the checksum timeline remains stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp khi dòng thời gian tổng kiểm tra vẫn ổn định.",
  },
  {
    id: "b1-pre-a11-checksum-clarification",
    level: "B1",
    focus: "clarification",
    title_en: "Pre-A11 checksum clarification",
    title_vi: "Tổng kiểm tra trước A11 cho làm rõ",
    scenario_en: "The learner asks one written-confirmation question that stays narrow.",
    scenario_vi: "Người học hỏi một câu xác nhận bằng văn bản vẫn hẹp.",
    canadaContext: "Useful for Canadian appointments, intake desks, and school offices.",
    preA11Checksum: {
      checksumPrompt_en: "Checksum passes when the clarification is checkable and polite.",
      checksumPrompt_vi: "Tổng kiểm tra đạt khi phần làm rõ có thể kiểm tra và lịch sự.",
      sampleLine: {
        pa: "ਕੀ ਤੁਸੀਂ ਮਿਤੀ ਅਤੇ ਅਗਲਾ ਕਦਮ ਲਿਖ ਕੇ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin miti ate agla kadam likh ke bhej sakde ho?",
        en: "Can you send the date and next step in writing?",
        vi: "Bạn có thể gửi ngày và bước tiếp theo bằng văn bản không?",
      },
      checksumSignals_en: ["Specific detail", "Written confirmation", "Polite ask"],
      checksumSignals_vi: ["Chi tiết cụ thể", "Xác nhận bằng văn bản", "Yêu cầu lịch sự"],
    },
    commonTraps: [
      {
        trap_en: "Turning one clarification into several questions.",
        trap_vi: "Biến một câu làm rõ thành nhiều câu hỏi.",
        better: {
          pa: "ਇੱਕ ਹੀ ਸਵਾਲ ਰੱਖੋ।",
          romanization: "ik hi saval rakho.",
          en: "Keep one question.",
          vi: "Giữ một câu hỏi.",
        },
      },
    ],
    runnerReadinessNote_en:
      "Checksum passes runner-readiness when clarification remains pipeline-ready and stable.",
    runnerReadinessNote_vi:
      "Tổng kiểm tra đạt sẵn sàng runner khi phần làm rõ vẫn sẵn sàng pipeline và ổn định.",
    preIntegrationRoute_en:
      "Route to pre-integration clarification after the checksum detail stays stable.",
    preIntegrationRoute_vi:
      "Chuyển sang làm rõ tiền tích hợp sau khi chi tiết tổng kiểm tra vẫn ổn định.",
  },
  {
    id: "b1-pre-a11-checksum-service-recovery",
    level: "B1",
    focus: "service_recovery",
    title_en: "Pre-A11 checksum service recovery",
    title_vi: "Tổng kiểm tra trước A11 cho phục hồi dịch vụ",
    scenario_en: "The learner uses a polite reset and returns to the original request.",
    scenario_vi: "Người học dùng câu đặt lại lịch sự và quay về yêu cầu ban đầu.",
    canadaContext: "Useful for Canadian support chats, phone lines, and service counters.",
    preA11Checksum: {
      checksumPrompt_en: "Checksum passes when repair phrase and request stay unchanged.",
      checksumPrompt_vi: "Tổng kiểm tra đạt khi cụm sửa lỗi và yêu cầu vẫn không đổi.",
      sampleLine: {
        pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੇਰੀ ਬੇਨਤੀ ਉਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ ਜੀ।",
        romanization:
          "maf karna, meri benti ohi hai. kirpa karke agla kadam dasso ji.",
        en: "Sorry, my request is the same. Please tell me the next step.",
        vi: "Xin lỗi, yêu cầu của tôi vẫn như cũ. Vui lòng cho tôi biết bước tiếp theo.",
      },
      checksumSignals_en: ["Repair phrase", "Same request", "Register-safe close"],
      checksumSignals_vi: ["Cụm sửa lỗi", "Cùng yêu cầu", "Kết thúc đúng mức trang trọng"],
    },
    commonTraps: [
      {
        trap_en: "Adding a complaint during the checksum pass.",
        trap_vi: "Thêm khiếu nại trong lượt tổng kiểm tra.",
        better: {
          pa: "ਨਵੀਂ ਸ਼ਿਕਾਇਤ ਨਾ ਜੋੜੋ।",
          romanization: "navi shikait na joro.",
          en: "Do not add a new complaint.",
          vi: "Đừng thêm khiếu nại mới.",
        },
      },
    ],
    runnerReadinessNote_en:
      "Native review is deferred. Pre-A11 checksum is ready when service recovery stays pipeline-ready.",
    runnerReadinessNote_vi:
      "Đánh giá của người bản ngữ được để sau. Tổng kiểm tra trước A11 sẵn sàng khi phục hồi dịch vụ vẫn sẵn sàng pipeline.",
    preIntegrationRoute_en:
      "Route to service pre-integration after the checksum reset remains unchanged.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp dịch vụ sau khi câu đặt lại tổng kiểm tra vẫn không đổi.",
  },
  {
    id: "b1-pre-a11-checksum-issue-resolution",
    level: "B1",
    focus: "issue_resolution",
    title_en: "Pre-A11 checksum issue resolution",
    title_vi: "Tổng kiểm tra trước A11 cho giải quyết vấn đề",
    scenario_en: "The learner asks for correction confirmation without claiming the result.",
    scenario_vi: "Người học xin xác nhận phần sửa mà không tự khẳng định kết quả.",
    canadaContext: "Useful for Canadian rental repairs, account corrections, and school records.",
    preA11Checksum: {
      checksumPrompt_en: "Checksum passes when correction and confirmation remain linked.",
      checksumPrompt_vi: "Tổng kiểm tra đạt khi phần sửa và xác nhận vẫn được nối với nhau.",
      sampleLine: {
        pa: "ਜੇ ਸੁਧਾਰ ਹੋ ਗਿਆ ਹੈ, ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਪੁਸ਼ਟੀ ਭੇਜੋ।",
        romanization: "je sudhar ho gia hai, kirpa karke mainu pushti bhejo.",
        en: "If the correction has been made, please send me confirmation.",
        vi: "Nếu phần sửa đã xong, vui lòng gửi xác nhận cho tôi.",
      },
      checksumSignals_en: ["Conditional wording", "Correction", "Confirmation request"],
      checksumSignals_vi: ["Cách nói có điều kiện", "Phần sửa", "Yêu cầu xác nhận"],
    },
    commonTraps: [
      {
        trap_en: "Promising the issue is solved before confirmation.",
        trap_vi: "Hứa rằng vấn đề đã được giải quyết trước khi có xác nhận.",
        better: {
          pa: "ਪੁਸ਼ਟੀ ਤੋਂ ਪਹਿਲਾਂ ਨਤੀਜਾ ਨਾ ਦੱਸੋ।",
          romanization: "pushti ton pehlan natija na dasso.",
          en: "Do not state the result before confirmation.",
          vi: "Đừng nêu kết quả trước khi có xác nhận.",
        },
      },
    ],
    runnerReadinessNote_en:
      "Language practice only, not legal or financial advice. Checksum keeps requests separate from promises.",
    runnerReadinessNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Tổng kiểm tra giữ yêu cầu tách khỏi lời hứa.",
    preIntegrationRoute_en:
      "Route to issue-resolution pre-integration when confirmation wording remains stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp giải quyết vấn đề khi cách nói xác nhận vẫn ổn định.",
  },
  {
    id: "b1-pre-a11-checksum-follow-up-message",
    level: "B1",
    focus: "follow_up_message",
    title_en: "Pre-A11 checksum follow-up message",
    title_vi: "Tổng kiểm tra trước A11 cho tin nhắn theo dõi",
    scenario_en: "The learner sends a short status follow-up with prior context.",
    scenario_vi: "Người học gửi tin theo dõi tình trạng ngắn có bối cảnh trước.",
    canadaContext: "Useful for Canadian email, SMS, portals, and community program messages.",
    preA11Checksum: {
      checksumPrompt_en: "Checksum passes when the follow-up keeps context, date, and polite ask.",
      checksumPrompt_vi:
        "Tổng kiểm tra đạt khi tin theo dõi giữ bối cảnh, ngày, và yêu cầu lịch sự.",
      sampleLine: {
        pa: "ਮੈਂ ਮੰਗਲਵਾਰ ਵਾਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਪੁੱਛ ਰਿਹਾ ਹਾਂ। ਕੀ ਕੋਈ ਅਪਡੇਟ ਹੈ?",
        romanization:
          "main mangalvar vale sunehe bare puchh riha han. ki koi update hai?",
        en: "I am asking about Tuesday's message. Is there any update?",
        vi: "Tôi đang hỏi về tin nhắn hôm thứ Ba. Có cập nhật nào không?",
      },
      checksumSignals_en: ["Prior message", "Date marker", "Polite update ask"],
      checksumSignals_vi: ["Tin nhắn trước", "Mốc ngày", "Hỏi cập nhật lịch sự"],
    },
    commonTraps: [
      {
        trap_en: "Turning the checksum line into a complaint.",
        trap_vi: "Biến câu tổng kiểm tra thành khiếu nại.",
        better: {
          pa: "ਅਪਡੇਟ ਨਰਮੀ ਨਾਲ ਪੁੱਛੋ।",
          romanization: "update narmi nal puchho.",
          en: "Ask gently for an update.",
          vi: "Hỏi cập nhật nhẹ nhàng.",
        },
      },
    ],
    runnerReadinessNote_en:
      "Checksum is ready when runner-readiness and pipeline-readiness stay aligned.",
    runnerReadinessNote_vi:
      "Tổng kiểm tra sẵn sàng khi sẵn sàng runner và pipeline vẫn khớp nhau.",
    preIntegrationRoute_en:
      "Route to pre-integration messaging when date swaps keep the checksum stable.",
    preIntegrationRoute_vi:
      "Chuyển sang nhắn tin tiền tích hợp khi đổi ngày vẫn giữ tổng kiểm tra ổn định.",
  },
  {
    id: "b1-pre-a11-checksum-workplace-task",
    level: "B1",
    focus: "workplace_task",
    title_en: "Pre-A11 checksum workplace task",
    title_vi: "Tổng kiểm tra trước A11 cho nhiệm vụ nơi làm việc",
    scenario_en: "The learner confirms task, time, and backup contact without policy claims.",
    scenario_vi: "Người học xác nhận nhiệm vụ, thời gian, và liên hệ dự phòng mà không nêu chính sách.",
    canadaContext: "Useful for Canadian part-time jobs, volunteering, and team handoffs.",
    preA11Checksum: {
      checksumPrompt_en: "Checksum passes when all task fields are complete and repeatable.",
      checksumPrompt_vi: "Tổng kiểm tra đạt khi mọi phần nhiệm vụ đầy đủ và có thể lặp lại.",
      sampleLine: {
        pa: "ਮੈਂ ਤਿੰਨ ਵਜੇ ਲਿਸਟ ਚੈੱਕ ਕਰਾਂਗਾ। ਜੇ ਸਮੱਸਿਆ ਆਈ, ਮੈਂ ਸੁਪਰਵਾਈਜ਼ਰ ਨੂੰ ਦੱਸਾਂਗਾ।",
        romanization:
          "main tinn vaje list check karanga. je samassia ai, main supervisor nu dassanga.",
        en: "I will check the list at three. If a problem comes up, I will tell the supervisor.",
        vi: "Tôi sẽ kiểm tra danh sách lúc ba giờ. Nếu có vấn đề, tôi sẽ báo cho giám sát.",
      },
      checksumSignals_en: ["Task", "Time", "Backup contact"],
      checksumSignals_vi: ["Nhiệm vụ", "Thời gian", "Liên hệ dự phòng"],
    },
    commonTraps: [
      {
        trap_en: "Leaving out the backup contact.",
        trap_vi: "Bỏ thiếu người liên hệ dự phòng.",
        better: {
          pa: "ਕਿਸਨੂੰ ਦੱਸਣਾ ਹੈ, ਇਹ ਜੋੜੋ।",
          romanization: "kisnu dassna hai, ih joro.",
          en: "Add who to tell.",
          vi: "Thêm người cần báo.",
        },
      },
    ],
    runnerReadinessNote_en:
      "Checksum passes pipeline-readiness when the workplace sample remains practice-only and stable.",
    runnerReadinessNote_vi:
      "Tổng kiểm tra đạt sẵn sàng pipeline khi mẫu nơi làm việc vẫn chỉ là luyện tập và ổn định.",
    preIntegrationRoute_en:
      "Route to workplace pre-integration after task, time, and contact test cleanly.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp nơi làm việc sau khi nhiệm vụ, thời gian, và liên hệ kiểm tra tốt.",
  },
  {
    id: "b1-pre-a11-checksum-housing-school-community",
    level: "B1",
    focus: "housing_school_community",
    title_en: "Pre-A11 checksum housing, school, and community task",
    title_vi: "Tổng kiểm tra trước A11 cho nhiệm vụ nhà ở, trường học, và cộng đồng",
    scenario_en: "The learner asks for the right contact or time in a transferable request.",
    scenario_vi: "Người học hỏi đúng liên hệ hoặc thời gian trong yêu cầu có thể chuyển bối cảnh.",
    canadaContext: "Useful for Canadian rentals, school offices, libraries, and community programs.",
    preA11Checksum: {
      checksumPrompt_en: "Checksum passes when the request transfers without becoming vague.",
      checksumPrompt_vi: "Tổng kiểm tra đạt khi yêu cầu chuyển bối cảnh mà không mơ hồ.",
      sampleLine: {
        pa: "ਕੀ ਤੁਸੀਂ ਸਹੀ ਸੰਪਰਕ ਜਾਂ ਮਿਲਣ ਦਾ ਸਮਾਂ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin sahi sampark ja milan da sama bhej sakde ho?",
        en: "Can you send the right contact or a time to meet?",
        vi: "Bạn có thể gửi đúng liên hệ hoặc thời gian gặp không?",
      },
      checksumSignals_en: ["Right contact", "Meeting time", "Transferable request"],
      checksumSignals_vi: ["Đúng liên hệ", "Thời gian gặp", "Yêu cầu có thể chuyển bối cảnh"],
    },
    commonTraps: [
      {
        trap_en: "Using a generic checksum sentence with no clear action.",
        trap_vi: "Dùng câu tổng kiểm tra chung chung không có hành động rõ.",
        better: {
          pa: "ਸੰਪਰਕ ਜਾਂ ਸਮਾਂ ਸਾਫ਼ ਮੰਗੋ।",
          romanization: "sampark ja sama saf mango.",
          en: "Clearly ask for contact or time.",
          vi: "Hỏi rõ liên hệ hoặc thời gian.",
        },
      },
    ],
    runnerReadinessNote_en:
      "Checksum is ready when pipeline-readiness confirms the request works for housing, school, or community tasks.",
    runnerReadinessNote_vi:
      "Tổng kiểm tra sẵn sàng khi sẵn sàng pipeline xác nhận yêu cầu dùng được cho nhiệm vụ nhà ở, trường học, hoặc cộng đồng.",
    preIntegrationRoute_en:
      "Route to pre-integration when setting changes keep the checksum request stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp khi đổi bối cảnh vẫn giữ yêu cầu tổng kiểm tra ổn định.",
  },
  {
    id: "b1-pre-a11-checksum-register-safe-repair",
    level: "B1",
    focus: "register_safe_repair",
    title_en: "Pre-A11 checksum register-safe repair",
    title_vi: "Tổng kiểm tra trước A11 cho sửa câu đúng mức trang trọng",
    scenario_en: "The learner keeps a polite direct repair with the same meaning.",
    scenario_vi: "Người học giữ câu sửa lịch sự, trực tiếp, cùng nghĩa.",
    canadaContext: "Useful for Canadian service desks, school offices, and workplace messages.",
    preA11Checksum: {
      checksumPrompt_en: "Checksum passes when polite repair keeps the request visible.",
      checksumPrompt_vi: "Tổng kiểm tra đạt khi câu sửa lịch sự vẫn giữ yêu cầu rõ.",
      sampleLine: {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਦੱਸੋ ਕਿ ਇਹ ਕਦੋਂ ਮੁਕੰਮਲ ਹੋਵੇਗਾ।",
        romanization: "kirpa karke mainu dasso ki ih kadon mukammal hovega.",
        en: "Please tell me when this will be completed.",
        vi: "Vui lòng cho tôi biết khi nào việc này sẽ hoàn tất.",
      },
      checksumSignals_en: ["Polite marker", "Direct request", "Same meaning"],
      checksumSignals_vi: ["Dấu hiệu lịch sự", "Yêu cầu trực tiếp", "Cùng nghĩa"],
    },
    commonTraps: [
      {
        trap_en: "Softening until the checksum request disappears.",
        trap_vi: "Làm mềm đến mức yêu cầu tổng kiểm tra biến mất.",
        better: {
          pa: "ਨਰਮੀ ਨਾਲ ਸਪਸ਼ਟ ਬੇਨਤੀ ਕਰੋ।",
          romanization: "narmi nal sapasht benti karo.",
          en: "Make a clear request politely.",
          vi: "Đưa ra yêu cầu rõ một cách lịch sự.",
        },
      },
    ],
    runnerReadinessNote_en:
      "Native review is deferred. Pre-A11 checksum is ready when register-safe repair remains stable from runner-readiness to pre-integration.",
    runnerReadinessNote_vi:
      "Đánh giá của người bản ngữ được để sau. Tổng kiểm tra trước A11 sẵn sàng khi câu sửa đúng mức trang trọng ổn định từ sẵn sàng runner đến tiền tích hợp.",
    preIntegrationRoute_en:
      "Route to pre-integration repair drills after the checksum line remains direct.",
    preIntegrationRoute_vi:
      "Chuyển sang bài luyện sửa câu tiền tích hợp sau khi câu tổng kiểm tra vẫn trực tiếp.",
  },
];
