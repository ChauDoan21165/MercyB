export type PunjabiB1CiReadinessFocus =
  | "situation_explanation"
  | "event_retelling"
  | "clarification"
  | "service_recovery"
  | "issue_resolution"
  | "follow_up_message"
  | "workplace_task"
  | "housing_school_community"
  | "register_safe_repair";

export type PunjabiCiReadinessLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiCiReadinessTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiCiReadinessLine;
};

export type PunjabiCiReadinessCheck = {
  ciReadinessPrompt_en: string;
  ciReadinessPrompt_vi: string;
  sampleLine: PunjabiCiReadinessLine;
  testSignals_en: string[];
  testSignals_vi: string[];
};

export type PunjabiB1CiReadinessCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1CiReadinessFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  ciReadiness: PunjabiCiReadinessCheck;
  commonTraps: PunjabiCiReadinessTrap[];
  mrReadinessNote_en: string;
  mrReadinessNote_vi: string;
  preIntegrationRoute_en: string;
  preIntegrationRoute_vi: string;
};

export const punjabiB1CiReadinessSamples: PunjabiB1CiReadinessCard[] = [
  {
    id: "b1-ci-readiness-situation-explanation",
    level: "B1",
    focus: "situation_explanation",
    title_en: "CI-readiness situation explanation",
    title_vi: "Mẫu sẵn sàng CI cho giải thích tình huống",
    scenario_en: "The learner explains one problem, one reason, and one requested next step.",
    scenario_vi: "Người học giải thích một vấn đề, một lý do, và một bước tiếp theo cần yêu cầu.",
    canadaContext: "Useful for Canadian newcomer centres, clinic reception, and front desks.",
    ciReadiness: {
      ciReadinessPrompt_en: "Pass CI-readiness when the explanation is stable under repeat tests.",
      ciReadinessPrompt_vi: "Đạt sẵn sàng CI khi phần giải thích ổn định qua kiểm tra lặp lại.",
      sampleLine: {
        pa: "ਮੈਂ ਦੇਰ ਨਾਲ ਆਇਆ ਕਿਉਂਕਿ ਬੱਸ ਦੇਰ ਨਾਲ ਸੀ। ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।",
        romanization:
          "main der nal aia kyonki bas der nal si. kirpa karke agla kadam dasso.",
        en: "I came late because the bus was late. Please tell me the next step.",
        vi: "Tôi đến muộn vì xe buýt trễ. Vui lòng cho tôi biết bước tiếp theo.",
      },
      testSignals_en: ["One reason", "One next step", "No new facts"],
      testSignals_vi: ["Một lý do", "Một bước tiếp theo", "Không thêm dữ kiện"],
    },
    commonTraps: [
      {
        trap_en: "Adding a second reason after MR-readiness.",
        trap_vi: "Thêm lý do thứ hai sau sẵn sàng MR.",
        better: {
          pa: "ਉਹੀ ਕਾਰਨ ਰੱਖੋ।",
          romanization: "ohi karan rakho.",
          en: "Keep the same reason.",
          vi: "Giữ cùng lý do.",
        },
      },
    ],
    mrReadinessNote_en:
      "Language practice only, not medical advice. CI-readiness is ready when MR-readiness and final-freeze stay aligned.",
    mrReadinessNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Sẵn sàng CI khi sẵn sàng MR và đóng băng cuối vẫn khớp nhau.",
    preIntegrationRoute_en:
      "Route to pre-integration after CI-readiness evidence repeats unchanged.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp sau khi bằng chứng sẵn sàng CI lặp lại không đổi.",
  },
  {
    id: "b1-ci-readiness-event-retelling",
    level: "B1",
    focus: "event_retelling",
    title_en: "CI-readiness event retelling",
    title_vi: "Mẫu sẵn sàng CI cho kể lại sự việc",
    scenario_en: "The learner retells an event in a testable first-then-now order.",
    scenario_vi: "Người học kể lại sự việc theo trình tự trước tiên-rồi-bây giờ có thể kiểm tra.",
    canadaContext: "Useful for Canadian school, workplace, and housing reports.",
    ciReadiness: {
      ciReadinessPrompt_en: "Pass CI-readiness when sequence and status do not drift.",
      ciReadinessPrompt_vi: "Đạt sẵn sàng CI khi trình tự và tình trạng không lệch.",
      sampleLine: {
        pa: "ਪਹਿਲਾਂ ਮੈਂ ਕਾਲ ਕੀਤੀ, ਫਿਰ ਸੁਨੇਹਾ ਛੱਡਿਆ, ਅਤੇ ਹੁਣ ਜਵਾਬ ਦੀ ਉਡੀਕ ਹੈ।",
        romanization:
          "pehlan main call kiti, phir suneha chhaddia, ate hun javab di udik hai.",
        en: "First I called, then I left a message, and now I am waiting for a reply.",
        vi: "Trước tiên tôi gọi, rồi để lại tin nhắn, và bây giờ tôi đang chờ phản hồi.",
      },
      testSignals_en: ["Fixed sequence", "Current status", "No side story"],
      testSignals_vi: ["Trình tự cố định", "Tình trạng hiện tại", "Không chuyện phụ"],
    },
    commonTraps: [
      {
        trap_en: "Changing the timeline between tests.",
        trap_vi: "Đổi dòng thời gian giữa các lần kiểm tra.",
        better: {
          pa: "ਉਹੀ ਕ੍ਰਮ ਵਰਤੋ।",
          romanization: "ohi kram varto.",
          en: "Use the same order.",
          vi: "Dùng cùng thứ tự.",
        },
      },
    ],
    mrReadinessNote_en:
      "Language practice only, not legal or financial advice. Shahmukhi is awareness only, not a full course.",
    mrReadinessNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ.",
    preIntegrationRoute_en:
      "Route to pre-integration when the CI-readiness timeline stays stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp khi dòng thời gian sẵn sàng CI vẫn ổn định.",
  },
  {
    id: "b1-ci-readiness-clarification",
    level: "B1",
    focus: "clarification",
    title_en: "CI-readiness clarification",
    title_vi: "Mẫu sẵn sàng CI cho làm rõ",
    scenario_en: "The learner asks one written-confirmation question that tests consistently.",
    scenario_vi: "Người học hỏi một câu xác nhận bằng văn bản kiểm tra ổn định.",
    canadaContext: "Useful for Canadian appointments, intake desks, and school offices.",
    ciReadiness: {
      ciReadinessPrompt_en: "Pass CI-readiness when the question stays narrow and checkable.",
      ciReadinessPrompt_vi: "Đạt sẵn sàng CI khi câu hỏi vẫn hẹp và có thể kiểm tra.",
      sampleLine: {
        pa: "ਕੀ ਤੁਸੀਂ ਮਿਤੀ ਅਤੇ ਅਗਲਾ ਕਦਮ ਲਿਖ ਕੇ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin miti ate agla kadam likh ke bhej sakde ho?",
        en: "Can you send the date and next step in writing?",
        vi: "Bạn có thể gửi ngày và bước tiếp theo bằng văn bản không?",
      },
      testSignals_en: ["Specific detail", "Written confirmation", "Polite ask"],
      testSignals_vi: ["Chi tiết cụ thể", "Xác nhận bằng văn bản", "Yêu cầu lịch sự"],
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
    mrReadinessNote_en:
      "CI-readiness passes MR-readiness when clarification remains final-freeze stable.",
    mrReadinessNote_vi:
      "Sẵn sàng CI đạt sẵn sàng MR khi phần làm rõ vẫn ổn định ở đóng băng cuối.",
    preIntegrationRoute_en:
      "Route to pre-integration clarification after the tested detail stays stable.",
    preIntegrationRoute_vi:
      "Chuyển sang làm rõ tiền tích hợp sau khi chi tiết đã kiểm tra vẫn ổn định.",
  },
  {
    id: "b1-ci-readiness-service-recovery",
    level: "B1",
    focus: "service_recovery",
    title_en: "CI-readiness service recovery",
    title_vi: "Mẫu sẵn sàng CI cho phục hồi dịch vụ",
    scenario_en: "The learner uses a stable polite reset and keeps the original request.",
    scenario_vi: "Người học dùng câu đặt lại lịch sự ổn định và giữ yêu cầu ban đầu.",
    canadaContext: "Useful for Canadian support chats, phone lines, and service counters.",
    ciReadiness: {
      ciReadinessPrompt_en: "Pass CI-readiness when tone repair and request stay unchanged.",
      ciReadinessPrompt_vi: "Đạt sẵn sàng CI khi câu sửa giọng và yêu cầu không đổi.",
      sampleLine: {
        pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੇਰੀ ਬੇਨਤੀ ਉਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ ਜੀ।",
        romanization:
          "maf karna, meri benti ohi hai. kirpa karke agla kadam dasso ji.",
        en: "Sorry, my request is the same. Please tell me the next step.",
        vi: "Xin lỗi, yêu cầu của tôi vẫn như cũ. Vui lòng cho tôi biết bước tiếp theo.",
      },
      testSignals_en: ["Repair phrase", "Same request", "Register-safe close"],
      testSignals_vi: ["Cụm sửa lỗi", "Cùng yêu cầu", "Kết thúc đúng mức trang trọng"],
    },
    commonTraps: [
      {
        trap_en: "Adding a complaint during the reset.",
        trap_vi: "Thêm khiếu nại trong câu đặt lại.",
        better: {
          pa: "ਨਵੀਂ ਸ਼ਿਕਾਇਤ ਨਾ ਜੋੜੋ।",
          romanization: "navi shikait na joro.",
          en: "Do not add a new complaint.",
          vi: "Đừng thêm khiếu nại mới.",
        },
      },
    ],
    mrReadinessNote_en:
      "Native review is deferred. CI-readiness is ready when service recovery stays MR-readiness stable.",
    mrReadinessNote_vi:
      "Đánh giá của người bản ngữ được để sau. Sẵn sàng CI khi phục hồi dịch vụ vẫn ổn định ở sẵn sàng MR.",
    preIntegrationRoute_en:
      "Route to service pre-integration after the tested reset remains unchanged.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp dịch vụ sau khi câu đặt lại đã kiểm tra vẫn không đổi.",
  },
  {
    id: "b1-ci-readiness-issue-resolution",
    level: "B1",
    focus: "issue_resolution",
    title_en: "CI-readiness issue resolution",
    title_vi: "Mẫu sẵn sàng CI cho giải quyết vấn đề",
    scenario_en: "The learner asks for confirmation without claiming the outcome.",
    scenario_vi: "Người học xin xác nhận mà không tự khẳng định kết quả.",
    canadaContext: "Useful for Canadian rental repairs, account corrections, and school records.",
    ciReadiness: {
      ciReadinessPrompt_en: "Pass CI-readiness when correction and confirmation stay linked.",
      ciReadinessPrompt_vi: "Đạt sẵn sàng CI khi phần sửa và xác nhận vẫn được nối với nhau.",
      sampleLine: {
        pa: "ਜੇ ਸੁਧਾਰ ਹੋ ਗਿਆ ਹੈ, ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਪੁਸ਼ਟੀ ਭੇਜੋ।",
        romanization: "je sudhar ho gia hai, kirpa karke mainu pushti bhejo.",
        en: "If the correction has been made, please send me confirmation.",
        vi: "Nếu phần sửa đã xong, vui lòng gửi xác nhận cho tôi.",
      },
      testSignals_en: ["Conditional wording", "Correction", "Confirmation request"],
      testSignals_vi: ["Cách nói có điều kiện", "Phần sửa", "Yêu cầu xác nhận"],
    },
    commonTraps: [
      {
        trap_en: "Stating the result before confirmation exists.",
        trap_vi: "Nêu kết quả trước khi có xác nhận.",
        better: {
          pa: "ਪੁਸ਼ਟੀ ਤੋਂ ਪਹਿਲਾਂ ਨਤੀਜਾ ਨਾ ਦੱਸੋ।",
          romanization: "pushti ton pehlan natija na dasso.",
          en: "Do not state the result before confirmation.",
          vi: "Đừng nêu kết quả trước khi có xác nhận.",
        },
      },
    ],
    mrReadinessNote_en:
      "Language practice only, not legal or financial advice. CI-readiness keeps requests separate from promises.",
    mrReadinessNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Sẵn sàng CI giữ yêu cầu tách khỏi lời hứa.",
    preIntegrationRoute_en:
      "Route to issue-resolution pre-integration when confirmation wording remains stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp giải quyết vấn đề khi cách nói xác nhận vẫn ổn định.",
  },
  {
    id: "b1-ci-readiness-follow-up-message",
    level: "B1",
    focus: "follow_up_message",
    title_en: "CI-readiness follow-up message",
    title_vi: "Mẫu sẵn sàng CI cho tin nhắn theo dõi",
    scenario_en: "The learner sends a brief status follow-up that remains polite under tests.",
    scenario_vi: "Người học gửi tin theo dõi tình trạng ngắn, vẫn lịch sự qua kiểm tra.",
    canadaContext: "Useful for Canadian email, SMS, portals, and community program messages.",
    ciReadiness: {
      ciReadinessPrompt_en: "Pass CI-readiness when the follow-up keeps context, date, and polite ask.",
      ciReadinessPrompt_vi: "Đạt sẵn sàng CI khi tin theo dõi giữ bối cảnh, ngày, và yêu cầu lịch sự.",
      sampleLine: {
        pa: "ਮੈਂ ਸੋਮਵਾਰ ਵਾਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਪੁੱਛ ਰਿਹਾ ਹਾਂ। ਕੀ ਕੋਈ ਅਪਡੇਟ ਹੈ?",
        romanization:
          "main somvar vale sunehe bare puchh riha han. ki koi update hai?",
        en: "I am asking about Monday's message. Is there any update?",
        vi: "Tôi đang hỏi về tin nhắn hôm thứ Hai. Có cập nhật nào không?",
      },
      testSignals_en: ["Prior message", "Date marker", "Polite update ask"],
      testSignals_vi: ["Tin nhắn trước", "Mốc ngày", "Hỏi cập nhật lịch sự"],
    },
    commonTraps: [
      {
        trap_en: "Making the test line sound like a complaint.",
        trap_vi: "Làm câu kiểm tra nghe như khiếu nại.",
        better: {
          pa: "ਅਪਡੇਟ ਨਰਮੀ ਨਾਲ ਪੁੱਛੋ।",
          romanization: "update narmi nal puchho.",
          en: "Ask gently for an update.",
          vi: "Hỏi cập nhật nhẹ nhàng.",
        },
      },
    ],
    mrReadinessNote_en:
      "CI-readiness passes MR-readiness when the follow-up remains brief through final-freeze.",
    mrReadinessNote_vi:
      "Sẵn sàng CI đạt sẵn sàng MR khi tin theo dõi vẫn ngắn qua đóng băng cuối.",
    preIntegrationRoute_en:
      "Route to pre-integration messaging when date swaps keep the tested structure stable.",
    preIntegrationRoute_vi:
      "Chuyển sang nhắn tin tiền tích hợp khi đổi ngày vẫn giữ cấu trúc đã kiểm tra ổn định.",
  },
  {
    id: "b1-ci-readiness-workplace-task",
    level: "B1",
    focus: "workplace_task",
    title_en: "CI-readiness workplace task",
    title_vi: "Mẫu sẵn sàng CI cho nhiệm vụ nơi làm việc",
    scenario_en: "The learner confirms task, time, and backup contact without policy claims.",
    scenario_vi: "Người học xác nhận nhiệm vụ, thời gian, và liên hệ dự phòng mà không nêu chính sách.",
    canadaContext: "Useful for Canadian part-time jobs, volunteering, and team handoffs.",
    ciReadiness: {
      ciReadinessPrompt_en: "Pass CI-readiness when all task fields are complete and repeatable.",
      ciReadinessPrompt_vi: "Đạt sẵn sàng CI khi mọi phần nhiệm vụ đầy đủ và có thể lặp lại.",
      sampleLine: {
        pa: "ਮੈਂ ਅੱਠ ਵਜੇ ਲਿਸਟ ਚੈੱਕ ਕਰਾਂਗਾ। ਜੇ ਸਮੱਸਿਆ ਆਈ, ਮੈਂ ਸੁਪਰਵਾਈਜ਼ਰ ਨੂੰ ਦੱਸਾਂਗਾ।",
        romanization:
          "main ath vaje list check karanga. je samassia ai, main supervisor nu dassanga.",
        en: "I will check the list at eight. If a problem comes up, I will tell the supervisor.",
        vi: "Tôi sẽ kiểm tra danh sách lúc tám giờ. Nếu có vấn đề, tôi sẽ báo cho giám sát.",
      },
      testSignals_en: ["Task", "Time", "Backup contact"],
      testSignals_vi: ["Nhiệm vụ", "Thời gian", "Liên hệ dự phòng"],
    },
    commonTraps: [
      {
        trap_en: "Leaving out who to tell if the task changes.",
        trap_vi: "Bỏ thiếu người cần báo nếu nhiệm vụ thay đổi.",
        better: {
          pa: "ਕਿਸਨੂੰ ਦੱਸਣਾ ਹੈ, ਇਹ ਜੋੜੋ।",
          romanization: "kisnu dassna hai, ih joro.",
          en: "Add who to tell.",
          vi: "Thêm người cần báo.",
        },
      },
    ],
    mrReadinessNote_en:
      "CI-readiness passes MR-readiness when the workplace sample remains practice-only and stable.",
    mrReadinessNote_vi:
      "Sẵn sàng CI đạt sẵn sàng MR khi mẫu nơi làm việc vẫn chỉ là luyện tập và ổn định.",
    preIntegrationRoute_en:
      "Route to workplace pre-integration after task, time, and contact test cleanly.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp nơi làm việc sau khi nhiệm vụ, thời gian, và liên hệ kiểm tra tốt.",
  },
  {
    id: "b1-ci-readiness-housing-school-community",
    level: "B1",
    focus: "housing_school_community",
    title_en: "CI-readiness housing, school, and community task",
    title_vi: "Mẫu sẵn sàng CI cho nhiệm vụ nhà ở, trường học, và cộng đồng",
    scenario_en: "The learner asks for a right contact or meeting time in a transferable way.",
    scenario_vi: "Người học hỏi đúng liên hệ hoặc thời gian gặp theo cách có thể chuyển bối cảnh.",
    canadaContext: "Useful for Canadian rentals, school offices, libraries, and community programs.",
    ciReadiness: {
      ciReadinessPrompt_en: "Pass CI-readiness when the request transfers without becoming vague.",
      ciReadinessPrompt_vi: "Đạt sẵn sàng CI khi yêu cầu chuyển bối cảnh mà không mơ hồ.",
      sampleLine: {
        pa: "ਕੀ ਤੁਸੀਂ ਸਹੀ ਸੰਪਰਕ ਜਾਂ ਮਿਲਣ ਦਾ ਸਮਾਂ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin sahi sampark ja milan da sama bhej sakde ho?",
        en: "Can you send the right contact or a time to meet?",
        vi: "Bạn có thể gửi đúng liên hệ hoặc thời gian gặp không?",
      },
      testSignals_en: ["Right contact", "Meeting time", "Transferable request"],
      testSignals_vi: ["Đúng liên hệ", "Thời gian gặp", "Yêu cầu có thể chuyển bối cảnh"],
    },
    commonTraps: [
      {
        trap_en: "Using a generic test sentence with no clear action.",
        trap_vi: "Dùng câu kiểm tra chung chung không có hành động rõ.",
        better: {
          pa: "ਸੰਪਰਕ ਜਾਂ ਸਮਾਂ ਸਾਫ਼ ਮੰਗੋ।",
          romanization: "sampark ja sama saf mango.",
          en: "Clearly ask for contact or time.",
          vi: "Hỏi rõ liên hệ hoặc thời gian.",
        },
      },
    ],
    mrReadinessNote_en:
      "CI-readiness is ready when MR-readiness confirms the request works for housing, school, or community tasks.",
    mrReadinessNote_vi:
      "Sẵn sàng CI khi sẵn sàng MR xác nhận yêu cầu dùng được cho nhiệm vụ nhà ở, trường học, hoặc cộng đồng.",
    preIntegrationRoute_en:
      "Route to pre-integration when setting changes keep the tested request stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp khi đổi bối cảnh vẫn giữ yêu cầu đã kiểm tra ổn định.",
  },
  {
    id: "b1-ci-readiness-register-safe-repair",
    level: "B1",
    focus: "register_safe_repair",
    title_en: "CI-readiness register-safe repair",
    title_vi: "Mẫu sẵn sàng CI cho sửa câu đúng mức trang trọng",
    scenario_en: "The learner preserves a polite direct repair that keeps the same meaning.",
    scenario_vi: "Người học giữ câu sửa lịch sự, trực tiếp, cùng nghĩa.",
    canadaContext: "Useful for Canadian service desks, school offices, and workplace messages.",
    ciReadiness: {
      ciReadinessPrompt_en: "Pass CI-readiness when polite repair keeps the request visible.",
      ciReadinessPrompt_vi: "Đạt sẵn sàng CI khi câu sửa lịch sự vẫn giữ yêu cầu rõ.",
      sampleLine: {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਦੱਸੋ ਕਿ ਇਹ ਕਦੋਂ ਮੁਕੰਮਲ ਹੋਵੇਗਾ।",
        romanization: "kirpa karke mainu dasso ki ih kadon mukammal hovega.",
        en: "Please tell me when this will be completed.",
        vi: "Vui lòng cho tôi biết khi nào việc này sẽ hoàn tất.",
      },
      testSignals_en: ["Polite marker", "Direct request", "Same meaning"],
      testSignals_vi: ["Dấu hiệu lịch sự", "Yêu cầu trực tiếp", "Cùng nghĩa"],
    },
    commonTraps: [
      {
        trap_en: "Softening until the tested request disappears.",
        trap_vi: "Làm mềm đến mức yêu cầu được kiểm tra biến mất.",
        better: {
          pa: "ਨਰਮੀ ਨਾਲ ਸਪਸ਼ਟ ਬੇਨਤੀ ਕਰੋ।",
          romanization: "narmi nal sapasht benti karo.",
          en: "Make a clear request politely.",
          vi: "Đưa ra yêu cầu rõ một cách lịch sự.",
        },
      },
    ],
    mrReadinessNote_en:
      "Native review is deferred. CI-readiness is ready when register-safe repair remains stable from MR-readiness to pre-integration.",
    mrReadinessNote_vi:
      "Đánh giá của người bản ngữ được để sau. Sẵn sàng CI khi câu sửa đúng mức trang trọng ổn định từ sẵn sàng MR đến tiền tích hợp.",
    preIntegrationRoute_en:
      "Route to pre-integration repair drills after the tested line remains direct.",
    preIntegrationRoute_vi:
      "Chuyển sang bài luyện sửa câu tiền tích hợp sau khi câu đã kiểm tra vẫn trực tiếp.",
  },
];
