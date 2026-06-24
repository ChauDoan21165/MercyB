export type PunjabiB1MrReadinessFocus =
  | "situation_explanation"
  | "event_retelling"
  | "clarification"
  | "service_recovery"
  | "issue_resolution"
  | "follow_up_message"
  | "workplace_task"
  | "housing_school_community"
  | "register_safe_repair";

export type PunjabiMrReadinessLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiMrReadinessTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiMrReadinessLine;
};

export type PunjabiMrReadinessCheck = {
  mrReadinessPrompt_en: string;
  mrReadinessPrompt_vi: string;
  sampleLine: PunjabiMrReadinessLine;
  evidenceSignals_en: string[];
  evidenceSignals_vi: string[];
};

export type PunjabiB1MrReadinessCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1MrReadinessFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  mrReadiness: PunjabiMrReadinessCheck;
  commonTraps: PunjabiMrReadinessTrap[];
  finalFreezeNote_en: string;
  finalFreezeNote_vi: string;
  preIntegrationRoute_en: string;
  preIntegrationRoute_vi: string;
};

export const punjabiB1MrReadinessEvidence: PunjabiB1MrReadinessCard[] = [
  {
    id: "b1-mr-readiness-situation-explanation",
    level: "B1",
    focus: "situation_explanation",
    title_en: "MR-readiness situation explanation",
    title_vi: "Bằng chứng sẵn sàng MR cho giải thích tình huống",
    scenario_en: "The learner explains one practical problem and asks for one next step.",
    scenario_vi: "Người học giải thích một vấn đề thực tế và hỏi một bước tiếp theo.",
    canadaContext: "Useful for Canadian newcomer centres, front desks, and clinic reception.",
    mrReadiness: {
      mrReadinessPrompt_en: "Evidence is ready when the explanation matches the final-freeze wording.",
      mrReadinessPrompt_vi: "Bằng chứng sẵn sàng khi phần giải thích khớp cách nói đã đóng băng cuối.",
      sampleLine: {
        pa: "ਮੈਂ ਅੱਜ ਦੇਰ ਨਾਲ ਆਇਆ ਕਿਉਂਕਿ ਬੱਸ ਦੇਰ ਨਾਲ ਸੀ। ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।",
        romanization:
          "main ajj der nal aia kyonki bas der nal si. kirpa karke agla kadam dasso.",
        en: "I came late today because the bus was late. Please tell me the next step.",
        vi: "Hôm nay tôi đến muộn vì xe buýt trễ. Vui lòng cho tôi biết bước tiếp theo.",
      },
      evidenceSignals_en: ["One reason", "One request", "Stable final-lock wording"],
      evidenceSignals_vi: ["Một lý do", "Một yêu cầu", "Cách nói khóa cuối ổn định"],
    },
    commonTraps: [
      {
        trap_en: "Adding a new reason during MR-readiness evidence.",
        trap_vi: "Thêm lý do mới trong bằng chứng sẵn sàng MR.",
        better: {
          pa: "ਉਹੀ ਕਾਰਨ ਰੱਖੋ।",
          romanization: "ohi karan rakho.",
          en: "Keep the same reason.",
          vi: "Giữ cùng lý do.",
        },
      },
    ],
    finalFreezeNote_en:
      "Language practice only, not medical advice. MR-readiness is ready when final-freeze and final-lock stay aligned.",
    finalFreezeNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Sẵn sàng MR khi đóng băng cuối và khóa cuối vẫn khớp nhau.",
    preIntegrationRoute_en:
      "Route to pre-integration after the MR-readiness evidence repeats unchanged.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp sau khi bằng chứng sẵn sàng MR lặp lại không đổi.",
  },
  {
    id: "b1-mr-readiness-event-retelling",
    level: "B1",
    focus: "event_retelling",
    title_en: "MR-readiness event retelling",
    title_vi: "Bằng chứng sẵn sàng MR cho kể lại sự việc",
    scenario_en: "The learner retells a fixed sequence and current status.",
    scenario_vi: "Người học kể lại một trình tự cố định và tình trạng hiện tại.",
    canadaContext: "Useful for Canadian workplace, school, and housing reports.",
    mrReadiness: {
      mrReadinessPrompt_en: "Evidence is ready when first, then, now stays in the same order.",
      mrReadinessPrompt_vi: "Bằng chứng sẵn sàng khi trước tiên, rồi, bây giờ giữ cùng thứ tự.",
      sampleLine: {
        pa: "ਪਹਿਲਾਂ ਮੈਂ ਫਾਰਮ ਭਰਿਆ, ਫਿਰ ਦਫ਼ਤਰ ਗਿਆ, ਅਤੇ ਹੁਣ ਜਵਾਬ ਦੀ ਉਡੀਕ ਹੈ।",
        romanization:
          "pehlan main farm bharia, phir daftar gia, ate hun javab di udik hai.",
        en: "First I filled out the form, then I went to the office, and now I am waiting for a reply.",
        vi: "Trước tiên tôi điền mẫu, rồi đến văn phòng, và bây giờ tôi đang chờ phản hồi.",
      },
      evidenceSignals_en: ["Fixed sequence", "Current status", "No side story"],
      evidenceSignals_vi: ["Trình tự cố định", "Tình trạng hiện tại", "Không chuyện phụ"],
    },
    commonTraps: [
      {
        trap_en: "Changing the order after final-freeze.",
        trap_vi: "Đổi thứ tự sau đóng băng cuối.",
        better: {
          pa: "ਉਹੀ ਕ੍ਰਮ ਵਰਤੋ।",
          romanization: "ohi kram varto.",
          en: "Use the same order.",
          vi: "Dùng cùng thứ tự.",
        },
      },
    ],
    finalFreezeNote_en:
      "Language practice only, not legal or financial advice. Shahmukhi is awareness only, not a full course.",
    finalFreezeNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ.",
    preIntegrationRoute_en:
      "Route to pre-integration when the MR-readiness timeline remains stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp khi dòng thời gian sẵn sàng MR vẫn ổn định.",
  },
  {
    id: "b1-mr-readiness-clarification",
    level: "B1",
    focus: "clarification",
    title_en: "MR-readiness clarification",
    title_vi: "Bằng chứng sẵn sàng MR cho làm rõ",
    scenario_en: "The learner asks one checkable written-confirmation question.",
    scenario_vi: "Người học hỏi một câu xác nhận bằng văn bản có thể kiểm tra.",
    canadaContext: "Useful for Canadian appointments, intake desks, and school offices.",
    mrReadiness: {
      mrReadinessPrompt_en: "Evidence is ready when the question stays narrow and polite.",
      mrReadinessPrompt_vi: "Bằng chứng sẵn sàng khi câu hỏi vẫn hẹp và lịch sự.",
      sampleLine: {
        pa: "ਕੀ ਤੁਸੀਂ ਮਿਤੀ ਅਤੇ ਅਗਲਾ ਕਦਮ ਲਿਖ ਕੇ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin miti ate agla kadam likh ke bhej sakde ho?",
        en: "Can you send the date and next step in writing?",
        vi: "Bạn có thể gửi ngày và bước tiếp theo bằng văn bản không?",
      },
      evidenceSignals_en: ["Specific detail", "Written confirmation", "Polite ask"],
      evidenceSignals_vi: ["Chi tiết cụ thể", "Xác nhận bằng văn bản", "Yêu cầu lịch sự"],
    },
    commonTraps: [
      {
        trap_en: "Widening one clarification into several questions.",
        trap_vi: "Mở rộng một câu làm rõ thành nhiều câu hỏi.",
        better: {
          pa: "ਇੱਕ ਹੀ ਸਵਾਲ ਰੱਖੋ।",
          romanization: "ik hi saval rakho.",
          en: "Keep one question.",
          vi: "Giữ một câu hỏi.",
        },
      },
    ],
    finalFreezeNote_en:
      "MR-readiness passes final-freeze when clarification remains final-lock stable.",
    finalFreezeNote_vi:
      "Sẵn sàng MR đạt đóng băng cuối khi phần làm rõ vẫn ổn định ở khóa cuối.",
    preIntegrationRoute_en:
      "Route to pre-integration clarification after the evidence detail stays stable.",
    preIntegrationRoute_vi:
      "Chuyển sang làm rõ tiền tích hợp sau khi chi tiết bằng chứng vẫn ổn định.",
  },
  {
    id: "b1-mr-readiness-service-recovery",
    level: "B1",
    focus: "service_recovery",
    title_en: "MR-readiness service recovery",
    title_vi: "Bằng chứng sẵn sàng MR cho phục hồi dịch vụ",
    scenario_en: "The learner resets tone and returns to the original request.",
    scenario_vi: "Người học đặt lại giọng điệu và quay về yêu cầu ban đầu.",
    canadaContext: "Useful for Canadian support chats, phone lines, and service counters.",
    mrReadiness: {
      mrReadinessPrompt_en: "Evidence is ready when the reset keeps the same request and register.",
      mrReadinessPrompt_vi: "Bằng chứng sẵn sàng khi câu đặt lại giữ cùng yêu cầu và mức trang trọng.",
      sampleLine: {
        pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੇਰੀ ਬੇਨਤੀ ਉਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ ਜੀ।",
        romanization:
          "maf karna, meri benti ohi hai. kirpa karke agla kadam dasso ji.",
        en: "Sorry, my request is the same. Please tell me the next step.",
        vi: "Xin lỗi, yêu cầu của tôi vẫn như cũ. Vui lòng cho tôi biết bước tiếp theo.",
      },
      evidenceSignals_en: ["Repair phrase", "Same request", "Register-safe close"],
      evidenceSignals_vi: ["Cụm sửa lỗi", "Cùng yêu cầu", "Kết thúc đúng mức trang trọng"],
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
    finalFreezeNote_en:
      "Native review is deferred. MR-readiness is ready when service recovery stays final-freeze stable.",
    finalFreezeNote_vi:
      "Đánh giá của người bản ngữ được để sau. Sẵn sàng MR khi phục hồi dịch vụ vẫn ổn định ở đóng băng cuối.",
    preIntegrationRoute_en:
      "Route to service pre-integration after the reset remains unchanged.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp dịch vụ sau khi câu đặt lại vẫn không đổi.",
  },
  {
    id: "b1-mr-readiness-issue-resolution",
    level: "B1",
    focus: "issue_resolution",
    title_en: "MR-readiness issue resolution",
    title_vi: "Bằng chứng sẵn sàng MR cho giải quyết vấn đề",
    scenario_en: "The learner asks for confirmation without inventing an outcome.",
    scenario_vi: "Người học xin xác nhận mà không bịa kết quả.",
    canadaContext: "Useful for Canadian rental repairs, account corrections, and school records.",
    mrReadiness: {
      mrReadinessPrompt_en: "Evidence is ready when correction and confirmation stay linked.",
      mrReadinessPrompt_vi: "Bằng chứng sẵn sàng khi phần sửa và xác nhận vẫn được nối với nhau.",
      sampleLine: {
        pa: "ਜੇ ਸੁਧਾਰ ਹੋ ਗਿਆ ਹੈ, ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਪੁਸ਼ਟੀ ਭੇਜੋ।",
        romanization: "je sudhar ho gia hai, kirpa karke mainu pushti bhejo.",
        en: "If the correction has been made, please send me confirmation.",
        vi: "Nếu phần sửa đã xong, vui lòng gửi xác nhận cho tôi.",
      },
      evidenceSignals_en: ["Conditional wording", "Correction", "Confirmation request"],
      evidenceSignals_vi: ["Cách nói có điều kiện", "Phần sửa", "Yêu cầu xác nhận"],
    },
    commonTraps: [
      {
        trap_en: "Claiming the issue is solved before confirmation.",
        trap_vi: "Khẳng định vấn đề đã giải quyết trước khi có xác nhận.",
        better: {
          pa: "ਪੁਸ਼ਟੀ ਤੋਂ ਪਹਿਲਾਂ ਨਤੀਜਾ ਨਾ ਦੱਸੋ।",
          romanization: "pushti ton pehlan natija na dasso.",
          en: "Do not state the result before confirmation.",
          vi: "Đừng nêu kết quả trước khi có xác nhận.",
        },
      },
    ],
    finalFreezeNote_en:
      "Language practice only, not legal or financial advice. MR-readiness evidence keeps requests separate from promises.",
    finalFreezeNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Bằng chứng sẵn sàng MR giữ yêu cầu tách khỏi lời hứa.",
    preIntegrationRoute_en:
      "Route to issue-resolution pre-integration when confirmation wording remains stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp giải quyết vấn đề khi cách nói xác nhận vẫn ổn định.",
  },
  {
    id: "b1-mr-readiness-follow-up-message",
    level: "B1",
    focus: "follow_up_message",
    title_en: "MR-readiness follow-up message",
    title_vi: "Bằng chứng sẵn sàng MR cho tin nhắn theo dõi",
    scenario_en: "The learner sends a brief follow-up with date and status question.",
    scenario_vi: "Người học gửi tin theo dõi ngắn có ngày và câu hỏi tình trạng.",
    canadaContext: "Useful for Canadian email, SMS, portals, and community program messages.",
    mrReadiness: {
      mrReadinessPrompt_en: "Evidence is ready when the follow-up stays short and polite.",
      mrReadinessPrompt_vi: "Bằng chứng sẵn sàng khi tin theo dõi vẫn ngắn và lịch sự.",
      sampleLine: {
        pa: "ਮੈਂ ਸ਼ੁੱਕਰਵਾਰ ਵਾਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਪੁੱਛ ਰਿਹਾ ਹਾਂ। ਕੀ ਕੋਈ ਅਪਡੇਟ ਹੈ?",
        romanization:
          "main shukkarvar vale sunehe bare puchh riha han. ki koi update hai?",
        en: "I am asking about Friday's message. Is there any update?",
        vi: "Tôi đang hỏi về tin nhắn hôm thứ Sáu. Có cập nhật nào không?",
      },
      evidenceSignals_en: ["Prior message", "Date marker", "Polite update ask"],
      evidenceSignals_vi: ["Tin nhắn trước", "Mốc ngày", "Hỏi cập nhật lịch sự"],
    },
    commonTraps: [
      {
        trap_en: "Turning the evidence line into a complaint.",
        trap_vi: "Biến câu bằng chứng thành khiếu nại.",
        better: {
          pa: "ਅਪਡੇਟ ਨਰਮੀ ਨਾਲ ਪੁੱਛੋ।",
          romanization: "update narmi nal puchho.",
          en: "Ask gently for an update.",
          vi: "Hỏi cập nhật nhẹ nhàng.",
        },
      },
    ],
    finalFreezeNote_en:
      "MR-readiness passes final-freeze when the follow-up remains brief through final-lock.",
    finalFreezeNote_vi:
      "Sẵn sàng MR đạt đóng băng cuối khi tin theo dõi vẫn ngắn qua khóa cuối.",
    preIntegrationRoute_en:
      "Route to pre-integration messaging when date swaps keep the evidence stable.",
    preIntegrationRoute_vi:
      "Chuyển sang nhắn tin tiền tích hợp khi đổi ngày vẫn giữ bằng chứng ổn định.",
  },
  {
    id: "b1-mr-readiness-workplace-task",
    level: "B1",
    focus: "workplace_task",
    title_en: "MR-readiness workplace task",
    title_vi: "Bằng chứng sẵn sàng MR cho nhiệm vụ nơi làm việc",
    scenario_en: "The learner confirms task, time, and backup contact.",
    scenario_vi: "Người học xác nhận nhiệm vụ, thời gian, và liên hệ dự phòng.",
    canadaContext: "Useful for Canadian part-time jobs, volunteering, and team handoffs.",
    mrReadiness: {
      mrReadinessPrompt_en: "Evidence is ready when task fields are complete and policy-free.",
      mrReadinessPrompt_vi: "Bằng chứng sẵn sàng khi các phần nhiệm vụ đầy đủ và không nêu chính sách.",
      sampleLine: {
        pa: "ਮੈਂ ਸੱਤ ਵਜੇ ਲਿਸਟ ਚੈੱਕ ਕਰਾਂਗਾ। ਜੇ ਸਮੱਸਿਆ ਆਈ, ਮੈਂ ਸੁਪਰਵਾਈਜ਼ਰ ਨੂੰ ਦੱਸਾਂਗਾ।",
        romanization:
          "main satt vaje list check karanga. je samassia ai, main supervisor nu dassanga.",
        en: "I will check the list at seven. If a problem comes up, I will tell the supervisor.",
        vi: "Tôi sẽ kiểm tra danh sách lúc bảy giờ. Nếu có vấn đề, tôi sẽ báo cho giám sát.",
      },
      evidenceSignals_en: ["Task", "Time", "Backup contact"],
      evidenceSignals_vi: ["Nhiệm vụ", "Thời gian", "Liên hệ dự phòng"],
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
    finalFreezeNote_en:
      "MR-readiness passes final-freeze when the workplace evidence remains practice-only and stable.",
    finalFreezeNote_vi:
      "Sẵn sàng MR đạt đóng băng cuối khi bằng chứng nơi làm việc vẫn chỉ là luyện tập và ổn định.",
    preIntegrationRoute_en:
      "Route to workplace pre-integration after task, time, and contact are stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp nơi làm việc sau khi nhiệm vụ, thời gian, và liên hệ ổn định.",
  },
  {
    id: "b1-mr-readiness-housing-school-community",
    level: "B1",
    focus: "housing_school_community",
    title_en: "MR-readiness housing, school, and community task",
    title_vi: "Bằng chứng sẵn sàng MR cho nhiệm vụ nhà ở, trường học, và cộng đồng",
    scenario_en: "The learner asks for the right contact or time in a transferable request.",
    scenario_vi: "Người học hỏi đúng liên hệ hoặc thời gian trong một yêu cầu có thể chuyển bối cảnh.",
    canadaContext: "Useful for Canadian rentals, school offices, libraries, and community programs.",
    mrReadiness: {
      mrReadinessPrompt_en: "Evidence is ready when the request transfers without becoming vague.",
      mrReadinessPrompt_vi: "Bằng chứng sẵn sàng khi yêu cầu chuyển bối cảnh mà không mơ hồ.",
      sampleLine: {
        pa: "ਕੀ ਤੁਸੀਂ ਸਹੀ ਸੰਪਰਕ ਜਾਂ ਮਿਲਣ ਦਾ ਸਮਾਂ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin sahi sampark ja milan da sama bhej sakde ho?",
        en: "Can you send the right contact or a time to meet?",
        vi: "Bạn có thể gửi đúng liên hệ hoặc thời gian gặp không?",
      },
      evidenceSignals_en: ["Right contact", "Meeting time", "Transferable request"],
      evidenceSignals_vi: ["Đúng liên hệ", "Thời gian gặp", "Yêu cầu có thể chuyển bối cảnh"],
    },
    commonTraps: [
      {
        trap_en: "Using a generic sentence with no action.",
        trap_vi: "Dùng câu chung chung không có hành động.",
        better: {
          pa: "ਸੰਪਰਕ ਜਾਂ ਸਮਾਂ ਸਾਫ਼ ਮੰਗੋ।",
          romanization: "sampark ja sama saf mango.",
          en: "Clearly ask for contact or time.",
          vi: "Hỏi rõ liên hệ hoặc thời gian.",
        },
      },
    ],
    finalFreezeNote_en:
      "MR-readiness is ready when final-freeze confirms the request works for housing, school, or community tasks.",
    finalFreezeNote_vi:
      "Sẵn sàng MR khi đóng băng cuối xác nhận yêu cầu dùng được cho nhiệm vụ nhà ở, trường học, hoặc cộng đồng.",
    preIntegrationRoute_en:
      "Route to pre-integration when setting changes keep the evidence stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp khi đổi bối cảnh vẫn giữ bằng chứng ổn định.",
  },
  {
    id: "b1-mr-readiness-register-safe-repair",
    level: "B1",
    focus: "register_safe_repair",
    title_en: "MR-readiness register-safe repair",
    title_vi: "Bằng chứng sẵn sàng MR cho sửa câu đúng mức trang trọng",
    scenario_en: "The learner preserves a polite direct repair with the same meaning.",
    scenario_vi: "Người học giữ câu sửa lịch sự, trực tiếp, cùng nghĩa.",
    canadaContext: "Useful for Canadian service desks, school offices, and workplace messages.",
    mrReadiness: {
      mrReadinessPrompt_en: "Evidence is ready when polite repair keeps the request visible.",
      mrReadinessPrompt_vi: "Bằng chứng sẵn sàng khi câu sửa lịch sự vẫn giữ yêu cầu rõ.",
      sampleLine: {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਦੱਸੋ ਕਿ ਇਹ ਕਦੋਂ ਮੁਕੰਮਲ ਹੋਵੇਗਾ।",
        romanization: "kirpa karke mainu dasso ki ih kadon mukammal hovega.",
        en: "Please tell me when this will be completed.",
        vi: "Vui lòng cho tôi biết khi nào việc này sẽ hoàn tất.",
      },
      evidenceSignals_en: ["Polite marker", "Direct request", "Same meaning"],
      evidenceSignals_vi: ["Dấu hiệu lịch sự", "Yêu cầu trực tiếp", "Cùng nghĩa"],
    },
    commonTraps: [
      {
        trap_en: "Softening until the requested action disappears.",
        trap_vi: "Làm mềm đến mức hành động được yêu cầu biến mất.",
        better: {
          pa: "ਨਰਮੀ ਨਾਲ ਸਪਸ਼ਟ ਬੇਨਤੀ ਕਰੋ।",
          romanization: "narmi nal sapasht benti karo.",
          en: "Make a clear request politely.",
          vi: "Đưa ra yêu cầu rõ một cách lịch sự.",
        },
      },
    ],
    finalFreezeNote_en:
      "Native review is deferred. MR-readiness is ready when register-safe repair remains stable from final-freeze to pre-integration.",
    finalFreezeNote_vi:
      "Đánh giá của người bản ngữ được để sau. Sẵn sàng MR khi câu sửa đúng mức trang trọng ổn định từ đóng băng cuối đến tiền tích hợp.",
    preIntegrationRoute_en:
      "Route to pre-integration repair drills after the evidence line remains direct.",
    preIntegrationRoute_vi:
      "Chuyển sang bài luyện sửa câu tiền tích hợp sau khi câu bằng chứng vẫn trực tiếp.",
  },
];
