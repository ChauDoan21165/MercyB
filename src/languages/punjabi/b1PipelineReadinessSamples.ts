export type PunjabiB1PipelineReadinessFocus =
  | "situation_explanation"
  | "event_retelling"
  | "clarification"
  | "service_recovery"
  | "issue_resolution"
  | "follow_up_message"
  | "workplace_task"
  | "housing_school_community"
  | "register_safe_repair";

export type PunjabiPipelineReadinessLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiPipelineReadinessTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiPipelineReadinessLine;
};

export type PunjabiPipelineReadinessCheck = {
  pipelineReadinessPrompt_en: string;
  pipelineReadinessPrompt_vi: string;
  sampleLine: PunjabiPipelineReadinessLine;
  pipelineSignals_en: string[];
  pipelineSignals_vi: string[];
};

export type PunjabiB1PipelineReadinessCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1PipelineReadinessFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  pipelineReadiness: PunjabiPipelineReadinessCheck;
  commonTraps: PunjabiPipelineReadinessTrap[];
  ciReadinessNote_en: string;
  ciReadinessNote_vi: string;
  preIntegrationRoute_en: string;
  preIntegrationRoute_vi: string;
};

export const punjabiB1PipelineReadinessSamples: PunjabiB1PipelineReadinessCard[] = [
  {
    id: "b1-pipeline-readiness-situation-explanation",
    level: "B1",
    focus: "situation_explanation",
    title_en: "Pipeline-readiness situation explanation",
    title_vi: "Mẫu sẵn sàng pipeline cho giải thích tình huống",
    scenario_en: "The learner explains one stable problem, reason, and next-step request.",
    scenario_vi: "Người học giải thích một vấn đề, lý do, và yêu cầu bước tiếp theo ổn định.",
    canadaContext: "Useful for Canadian newcomer centres, clinic reception, and front desks.",
    pipelineReadiness: {
      pipelineReadinessPrompt_en:
        "Pass pipeline-readiness when the line stays stable after CI-readiness checks.",
      pipelineReadinessPrompt_vi:
        "Đạt sẵn sàng pipeline khi câu vẫn ổn định sau kiểm tra sẵn sàng CI.",
      sampleLine: {
        pa: "ਮੈਂ ਦੇਰ ਨਾਲ ਆਇਆ ਕਿਉਂਕਿ ਬੱਸ ਦੇਰ ਨਾਲ ਸੀ। ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।",
        romanization:
          "main der nal aia kyonki bas der nal si. kirpa karke agla kadam dasso.",
        en: "I came late because the bus was late. Please tell me the next step.",
        vi: "Tôi đến muộn vì xe buýt trễ. Vui lòng cho tôi biết bước tiếp theo.",
      },
      pipelineSignals_en: ["One reason", "One next step", "No new facts"],
      pipelineSignals_vi: ["Một lý do", "Một bước tiếp theo", "Không thêm dữ kiện"],
    },
    commonTraps: [
      {
        trap_en: "Adding a new reason after CI-readiness.",
        trap_vi: "Thêm lý do mới sau sẵn sàng CI.",
        better: {
          pa: "ਉਹੀ ਕਾਰਨ ਰੱਖੋ।",
          romanization: "ohi karan rakho.",
          en: "Keep the same reason.",
          vi: "Giữ cùng lý do.",
        },
      },
    ],
    ciReadinessNote_en:
      "Language practice only, not medical advice. Pipeline-readiness is ready when CI-readiness and MR-readiness stay aligned.",
    ciReadinessNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Sẵn sàng pipeline khi sẵn sàng CI và sẵn sàng MR vẫn khớp nhau.",
    preIntegrationRoute_en:
      "Route to pre-integration after the pipeline evidence repeats unchanged.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp sau khi bằng chứng pipeline lặp lại không đổi.",
  },
  {
    id: "b1-pipeline-readiness-event-retelling",
    level: "B1",
    focus: "event_retelling",
    title_en: "Pipeline-readiness event retelling",
    title_vi: "Mẫu sẵn sàng pipeline cho kể lại sự việc",
    scenario_en: "The learner retells an event in a stable first-then-now order.",
    scenario_vi: "Người học kể lại sự việc theo trình tự trước tiên-rồi-bây giờ ổn định.",
    canadaContext: "Useful for Canadian school, workplace, and housing reports.",
    pipelineReadiness: {
      pipelineReadinessPrompt_en:
        "Pass pipeline-readiness when sequence and status remain test-stable.",
      pipelineReadinessPrompt_vi:
        "Đạt sẵn sàng pipeline khi trình tự và tình trạng vẫn ổn định qua kiểm tra.",
      sampleLine: {
        pa: "ਪਹਿਲਾਂ ਮੈਂ ਕਾਲ ਕੀਤੀ, ਫਿਰ ਸੁਨੇਹਾ ਛੱਡਿਆ, ਅਤੇ ਹੁਣ ਜਵਾਬ ਦੀ ਉਡੀਕ ਹੈ।",
        romanization:
          "pehlan main call kiti, phir suneha chhaddia, ate hun javab di udik hai.",
        en: "First I called, then I left a message, and now I am waiting for a reply.",
        vi: "Trước tiên tôi gọi, rồi để lại tin nhắn, và bây giờ tôi đang chờ phản hồi.",
      },
      pipelineSignals_en: ["Fixed sequence", "Current status", "No side story"],
      pipelineSignals_vi: ["Trình tự cố định", "Tình trạng hiện tại", "Không chuyện phụ"],
    },
    commonTraps: [
      {
        trap_en: "Changing the timeline during pipeline checks.",
        trap_vi: "Đổi dòng thời gian trong kiểm tra pipeline.",
        better: {
          pa: "ਉਹੀ ਕ੍ਰਮ ਵਰਤੋ।",
          romanization: "ohi kram varto.",
          en: "Use the same order.",
          vi: "Dùng cùng thứ tự.",
        },
      },
    ],
    ciReadinessNote_en:
      "Language practice only, not legal or financial advice. Shahmukhi is awareness only, not a full course.",
    ciReadinessNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ.",
    preIntegrationRoute_en:
      "Route to pre-integration when the pipeline timeline remains stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp khi dòng thời gian pipeline vẫn ổn định.",
  },
  {
    id: "b1-pipeline-readiness-clarification",
    level: "B1",
    focus: "clarification",
    title_en: "Pipeline-readiness clarification",
    title_vi: "Mẫu sẵn sàng pipeline cho làm rõ",
    scenario_en: "The learner asks one written-confirmation question that stays narrow.",
    scenario_vi: "Người học hỏi một câu xác nhận bằng văn bản vẫn hẹp.",
    canadaContext: "Useful for Canadian appointments, intake desks, and school offices.",
    pipelineReadiness: {
      pipelineReadinessPrompt_en:
        "Pass pipeline-readiness when the clarification is checkable and polite.",
      pipelineReadinessPrompt_vi:
        "Đạt sẵn sàng pipeline khi phần làm rõ có thể kiểm tra và lịch sự.",
      sampleLine: {
        pa: "ਕੀ ਤੁਸੀਂ ਮਿਤੀ ਅਤੇ ਅਗਲਾ ਕਦਮ ਲਿਖ ਕੇ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin miti ate agla kadam likh ke bhej sakde ho?",
        en: "Can you send the date and next step in writing?",
        vi: "Bạn có thể gửi ngày và bước tiếp theo bằng văn bản không?",
      },
      pipelineSignals_en: ["Specific detail", "Written confirmation", "Polite ask"],
      pipelineSignals_vi: ["Chi tiết cụ thể", "Xác nhận bằng văn bản", "Yêu cầu lịch sự"],
    },
    commonTraps: [
      {
        trap_en: "Expanding one clarification into several questions.",
        trap_vi: "Mở rộng một câu làm rõ thành nhiều câu hỏi.",
        better: {
          pa: "ਇੱਕ ਹੀ ਸਵਾਲ ਰੱਖੋ।",
          romanization: "ik hi saval rakho.",
          en: "Keep one question.",
          vi: "Giữ một câu hỏi.",
        },
      },
    ],
    ciReadinessNote_en:
      "Pipeline-readiness passes CI-readiness when clarification remains MR-readiness stable.",
    ciReadinessNote_vi:
      "Sẵn sàng pipeline đạt sẵn sàng CI khi phần làm rõ vẫn ổn định ở sẵn sàng MR.",
    preIntegrationRoute_en:
      "Route to pre-integration clarification after the pipeline detail stays stable.",
    preIntegrationRoute_vi:
      "Chuyển sang làm rõ tiền tích hợp sau khi chi tiết pipeline vẫn ổn định.",
  },
  {
    id: "b1-pipeline-readiness-service-recovery",
    level: "B1",
    focus: "service_recovery",
    title_en: "Pipeline-readiness service recovery",
    title_vi: "Mẫu sẵn sàng pipeline cho phục hồi dịch vụ",
    scenario_en: "The learner uses a polite reset and returns to the original request.",
    scenario_vi: "Người học dùng câu đặt lại lịch sự và quay về yêu cầu ban đầu.",
    canadaContext: "Useful for Canadian support chats, phone lines, and service counters.",
    pipelineReadiness: {
      pipelineReadinessPrompt_en:
        "Pass pipeline-readiness when repair phrase and request stay unchanged.",
      pipelineReadinessPrompt_vi:
        "Đạt sẵn sàng pipeline khi cụm sửa lỗi và yêu cầu vẫn không đổi.",
      sampleLine: {
        pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੇਰੀ ਬੇਨਤੀ ਉਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ ਜੀ।",
        romanization:
          "maf karna, meri benti ohi hai. kirpa karke agla kadam dasso ji.",
        en: "Sorry, my request is the same. Please tell me the next step.",
        vi: "Xin lỗi, yêu cầu của tôi vẫn như cũ. Vui lòng cho tôi biết bước tiếp theo.",
      },
      pipelineSignals_en: ["Repair phrase", "Same request", "Register-safe close"],
      pipelineSignals_vi: ["Cụm sửa lỗi", "Cùng yêu cầu", "Kết thúc đúng mức trang trọng"],
    },
    commonTraps: [
      {
        trap_en: "Adding a new complaint during the reset.",
        trap_vi: "Thêm khiếu nại mới trong câu đặt lại.",
        better: {
          pa: "ਨਵੀਂ ਸ਼ਿਕਾਇਤ ਨਾ ਜੋੜੋ।",
          romanization: "navi shikait na joro.",
          en: "Do not add a new complaint.",
          vi: "Đừng thêm khiếu nại mới.",
        },
      },
    ],
    ciReadinessNote_en:
      "Native review is deferred. Pipeline-readiness is ready when service recovery stays CI-readiness stable.",
    ciReadinessNote_vi:
      "Đánh giá của người bản ngữ được để sau. Sẵn sàng pipeline khi phục hồi dịch vụ vẫn ổn định ở sẵn sàng CI.",
    preIntegrationRoute_en:
      "Route to service pre-integration after the pipeline reset remains unchanged.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp dịch vụ sau khi câu đặt lại pipeline vẫn không đổi.",
  },
  {
    id: "b1-pipeline-readiness-issue-resolution",
    level: "B1",
    focus: "issue_resolution",
    title_en: "Pipeline-readiness issue resolution",
    title_vi: "Mẫu sẵn sàng pipeline cho giải quyết vấn đề",
    scenario_en: "The learner asks for correction confirmation without claiming the result.",
    scenario_vi: "Người học xin xác nhận phần sửa mà không tự khẳng định kết quả.",
    canadaContext: "Useful for Canadian rental repairs, account corrections, and school records.",
    pipelineReadiness: {
      pipelineReadinessPrompt_en:
        "Pass pipeline-readiness when correction and confirmation remain linked.",
      pipelineReadinessPrompt_vi:
        "Đạt sẵn sàng pipeline khi phần sửa và xác nhận vẫn được nối với nhau.",
      sampleLine: {
        pa: "ਜੇ ਸੁਧਾਰ ਹੋ ਗਿਆ ਹੈ, ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਪੁਸ਼ਟੀ ਭੇਜੋ।",
        romanization: "je sudhar ho gia hai, kirpa karke mainu pushti bhejo.",
        en: "If the correction has been made, please send me confirmation.",
        vi: "Nếu phần sửa đã xong, vui lòng gửi xác nhận cho tôi.",
      },
      pipelineSignals_en: ["Conditional wording", "Correction", "Confirmation request"],
      pipelineSignals_vi: ["Cách nói có điều kiện", "Phần sửa", "Yêu cầu xác nhận"],
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
    ciReadinessNote_en:
      "Language practice only, not legal or financial advice. Pipeline-readiness keeps requests separate from promises.",
    ciReadinessNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Sẵn sàng pipeline giữ yêu cầu tách khỏi lời hứa.",
    preIntegrationRoute_en:
      "Route to issue-resolution pre-integration when confirmation wording remains stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp giải quyết vấn đề khi cách nói xác nhận vẫn ổn định.",
  },
  {
    id: "b1-pipeline-readiness-follow-up-message",
    level: "B1",
    focus: "follow_up_message",
    title_en: "Pipeline-readiness follow-up message",
    title_vi: "Mẫu sẵn sàng pipeline cho tin nhắn theo dõi",
    scenario_en: "The learner sends a short status follow-up with prior context.",
    scenario_vi: "Người học gửi tin theo dõi tình trạng ngắn có bối cảnh trước.",
    canadaContext: "Useful for Canadian email, SMS, portals, and community program messages.",
    pipelineReadiness: {
      pipelineReadinessPrompt_en:
        "Pass pipeline-readiness when the follow-up keeps context, date, and polite ask.",
      pipelineReadinessPrompt_vi:
        "Đạt sẵn sàng pipeline khi tin theo dõi giữ bối cảnh, ngày, và yêu cầu lịch sự.",
      sampleLine: {
        pa: "ਮੈਂ ਮੰਗਲਵਾਰ ਵਾਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਪੁੱਛ ਰਿਹਾ ਹਾਂ। ਕੀ ਕੋਈ ਅਪਡੇਟ ਹੈ?",
        romanization:
          "main mangalvar vale sunehe bare puchh riha han. ki koi update hai?",
        en: "I am asking about Tuesday's message. Is there any update?",
        vi: "Tôi đang hỏi về tin nhắn hôm thứ Ba. Có cập nhật nào không?",
      },
      pipelineSignals_en: ["Prior message", "Date marker", "Polite update ask"],
      pipelineSignals_vi: ["Tin nhắn trước", "Mốc ngày", "Hỏi cập nhật lịch sự"],
    },
    commonTraps: [
      {
        trap_en: "Turning the pipeline line into a complaint.",
        trap_vi: "Biến câu pipeline thành khiếu nại.",
        better: {
          pa: "ਅਪਡੇਟ ਨਰਮੀ ਨਾਲ ਪੁੱਛੋ।",
          romanization: "update narmi nal puchho.",
          en: "Ask gently for an update.",
          vi: "Hỏi cập nhật nhẹ nhàng.",
        },
      },
    ],
    ciReadinessNote_en:
      "Pipeline-readiness passes CI-readiness when the follow-up remains brief through MR-readiness.",
    ciReadinessNote_vi:
      "Sẵn sàng pipeline đạt sẵn sàng CI khi tin theo dõi vẫn ngắn qua sẵn sàng MR.",
    preIntegrationRoute_en:
      "Route to pre-integration messaging when date swaps keep the pipeline structure stable.",
    preIntegrationRoute_vi:
      "Chuyển sang nhắn tin tiền tích hợp khi đổi ngày vẫn giữ cấu trúc pipeline ổn định.",
  },
  {
    id: "b1-pipeline-readiness-workplace-task",
    level: "B1",
    focus: "workplace_task",
    title_en: "Pipeline-readiness workplace task",
    title_vi: "Mẫu sẵn sàng pipeline cho nhiệm vụ nơi làm việc",
    scenario_en: "The learner confirms task, time, and backup contact without policy claims.",
    scenario_vi: "Người học xác nhận nhiệm vụ, thời gian, và liên hệ dự phòng mà không nêu chính sách.",
    canadaContext: "Useful for Canadian part-time jobs, volunteering, and team handoffs.",
    pipelineReadiness: {
      pipelineReadinessPrompt_en:
        "Pass pipeline-readiness when all task fields are complete and repeatable.",
      pipelineReadinessPrompt_vi:
        "Đạt sẵn sàng pipeline khi mọi phần nhiệm vụ đầy đủ và có thể lặp lại.",
      sampleLine: {
        pa: "ਮੈਂ ਨੌਂ ਵਜੇ ਲਿਸਟ ਚੈੱਕ ਕਰਾਂਗਾ। ਜੇ ਸਮੱਸਿਆ ਆਈ, ਮੈਂ ਸੁਪਰਵਾਈਜ਼ਰ ਨੂੰ ਦੱਸਾਂਗਾ।",
        romanization:
          "main naun vaje list check karanga. je samassia ai, main supervisor nu dassanga.",
        en: "I will check the list at nine. If a problem comes up, I will tell the supervisor.",
        vi: "Tôi sẽ kiểm tra danh sách lúc chín giờ. Nếu có vấn đề, tôi sẽ báo cho giám sát.",
      },
      pipelineSignals_en: ["Task", "Time", "Backup contact"],
      pipelineSignals_vi: ["Nhiệm vụ", "Thời gian", "Liên hệ dự phòng"],
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
    ciReadinessNote_en:
      "Pipeline-readiness passes CI-readiness when the workplace sample remains practice-only and stable.",
    ciReadinessNote_vi:
      "Sẵn sàng pipeline đạt sẵn sàng CI khi mẫu nơi làm việc vẫn chỉ là luyện tập và ổn định.",
    preIntegrationRoute_en:
      "Route to workplace pre-integration after task, time, and contact test cleanly.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp nơi làm việc sau khi nhiệm vụ, thời gian, và liên hệ kiểm tra tốt.",
  },
  {
    id: "b1-pipeline-readiness-housing-school-community",
    level: "B1",
    focus: "housing_school_community",
    title_en: "Pipeline-readiness housing, school, and community task",
    title_vi: "Mẫu sẵn sàng pipeline cho nhiệm vụ nhà ở, trường học, và cộng đồng",
    scenario_en: "The learner asks for the right contact or time in a transferable request.",
    scenario_vi: "Người học hỏi đúng liên hệ hoặc thời gian trong yêu cầu có thể chuyển bối cảnh.",
    canadaContext: "Useful for Canadian rentals, school offices, libraries, and community programs.",
    pipelineReadiness: {
      pipelineReadinessPrompt_en:
        "Pass pipeline-readiness when the request transfers without becoming vague.",
      pipelineReadinessPrompt_vi:
        "Đạt sẵn sàng pipeline khi yêu cầu chuyển bối cảnh mà không mơ hồ.",
      sampleLine: {
        pa: "ਕੀ ਤੁਸੀਂ ਸਹੀ ਸੰਪਰਕ ਜਾਂ ਮਿਲਣ ਦਾ ਸਮਾਂ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin sahi sampark ja milan da sama bhej sakde ho?",
        en: "Can you send the right contact or a time to meet?",
        vi: "Bạn có thể gửi đúng liên hệ hoặc thời gian gặp không?",
      },
      pipelineSignals_en: ["Right contact", "Meeting time", "Transferable request"],
      pipelineSignals_vi: ["Đúng liên hệ", "Thời gian gặp", "Yêu cầu có thể chuyển bối cảnh"],
    },
    commonTraps: [
      {
        trap_en: "Using a generic pipeline sentence with no clear action.",
        trap_vi: "Dùng câu pipeline chung chung không có hành động rõ.",
        better: {
          pa: "ਸੰਪਰਕ ਜਾਂ ਸਮਾਂ ਸਾਫ਼ ਮੰਗੋ।",
          romanization: "sampark ja sama saf mango.",
          en: "Clearly ask for contact or time.",
          vi: "Hỏi rõ liên hệ hoặc thời gian.",
        },
      },
    ],
    ciReadinessNote_en:
      "Pipeline-readiness is ready when CI-readiness confirms the request works for housing, school, or community tasks.",
    ciReadinessNote_vi:
      "Sẵn sàng pipeline khi sẵn sàng CI xác nhận yêu cầu dùng được cho nhiệm vụ nhà ở, trường học, hoặc cộng đồng.",
    preIntegrationRoute_en:
      "Route to pre-integration when setting changes keep the pipeline request stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp khi đổi bối cảnh vẫn giữ yêu cầu pipeline ổn định.",
  },
  {
    id: "b1-pipeline-readiness-register-safe-repair",
    level: "B1",
    focus: "register_safe_repair",
    title_en: "Pipeline-readiness register-safe repair",
    title_vi: "Mẫu sẵn sàng pipeline cho sửa câu đúng mức trang trọng",
    scenario_en: "The learner keeps a polite direct repair with the same meaning.",
    scenario_vi: "Người học giữ câu sửa lịch sự, trực tiếp, cùng nghĩa.",
    canadaContext: "Useful for Canadian service desks, school offices, and workplace messages.",
    pipelineReadiness: {
      pipelineReadinessPrompt_en:
        "Pass pipeline-readiness when polite repair keeps the request visible.",
      pipelineReadinessPrompt_vi:
        "Đạt sẵn sàng pipeline khi câu sửa lịch sự vẫn giữ yêu cầu rõ.",
      sampleLine: {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਦੱਸੋ ਕਿ ਇਹ ਕਦੋਂ ਮੁਕੰਮਲ ਹੋਵੇਗਾ।",
        romanization: "kirpa karke mainu dasso ki ih kadon mukammal hovega.",
        en: "Please tell me when this will be completed.",
        vi: "Vui lòng cho tôi biết khi nào việc này sẽ hoàn tất.",
      },
      pipelineSignals_en: ["Polite marker", "Direct request", "Same meaning"],
      pipelineSignals_vi: ["Dấu hiệu lịch sự", "Yêu cầu trực tiếp", "Cùng nghĩa"],
    },
    commonTraps: [
      {
        trap_en: "Softening until the pipeline request disappears.",
        trap_vi: "Làm mềm đến mức yêu cầu pipeline biến mất.",
        better: {
          pa: "ਨਰਮੀ ਨਾਲ ਸਪਸ਼ਟ ਬੇਨਤੀ ਕਰੋ।",
          romanization: "narmi nal sapasht benti karo.",
          en: "Make a clear request politely.",
          vi: "Đưa ra yêu cầu rõ một cách lịch sự.",
        },
      },
    ],
    ciReadinessNote_en:
      "Native review is deferred. Pipeline-readiness is ready when register-safe repair remains stable from CI-readiness to pre-integration.",
    ciReadinessNote_vi:
      "Đánh giá của người bản ngữ được để sau. Sẵn sàng pipeline khi câu sửa đúng mức trang trọng ổn định từ sẵn sàng CI đến tiền tích hợp.",
    preIntegrationRoute_en:
      "Route to pre-integration repair drills after the pipeline line remains direct.",
    preIntegrationRoute_vi:
      "Chuyển sang bài luyện sửa câu tiền tích hợp sau khi câu pipeline vẫn trực tiếp.",
  },
];
