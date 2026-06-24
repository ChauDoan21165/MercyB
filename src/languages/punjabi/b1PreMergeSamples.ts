export type PunjabiB1PreMergeFocus =
  | "situation_explanation"
  | "event_retelling"
  | "clarification"
  | "service_recovery"
  | "issue_resolution"
  | "follow_up_message"
  | "workplace_task"
  | "housing_school_community"
  | "register_safe_repair";

export type PunjabiPreMergeLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiPreMergeTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiPreMergeLine;
};

export type PunjabiPreMergeCheck = {
  mergePrompt_en: string;
  mergePrompt_vi: string;
  sampleLine: PunjabiPreMergeLine;
  mergeSignals_en: string[];
  mergeSignals_vi: string[];
};

export type PunjabiB1PreMergeCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1PreMergeFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  preMergeCheck: PunjabiPreMergeCheck;
  commonTraps: PunjabiPreMergeTrap[];
  runnerReadinessNote_en: string;
  runnerReadinessNote_vi: string;
  preIntegrationRoute_en: string;
  preIntegrationRoute_vi: string;
};

export const punjabiB1PreMergeSamples: PunjabiB1PreMergeCard[] = [
  {
    id: "b1-pre-merge-situation-explanation",
    level: "B1",
    focus: "situation_explanation",
    title_en: "Pre-merge situation explanation",
    title_vi: "Giải thích tình huống trước khi gộp",
    scenario_en: "The learner explains one stable problem, reason, and next step.",
    scenario_vi: "Người học giải thích một vấn đề, lý do, và bước tiếp theo ổn định.",
    canadaContext: "Useful for Canadian newcomer centres, clinic reception, and front desks.",
    preMergeCheck: {
      mergePrompt_en: "Merge passes when the line stays stable across review and pre-merge checks.",
      mergePrompt_vi:
        "Gộp đạt khi câu vẫn ổn định qua kiểm tra rà soát và tiền gộp.",
      sampleLine: {
        pa: "ਮੈਂ ਦੇਰ ਨਾਲ ਆਇਆ ਕਿਉਂਕਿ ਬੱਸ ਦੇਰ ਨਾਲ ਸੀ। ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।",
        romanization:
          "main der nal aia kyonki bas der nal si. kirpa karke agla kadam dasso.",
        en: "I came late because the bus was late. Please tell me the next step.",
        vi: "Tôi đến muộn vì xe buýt trễ. Vui lòng cho tôi biết bước tiếp theo.",
      },
      mergeSignals_en: ["One reason", "One next step", "No new facts"],
      mergeSignals_vi: ["Một lý do", "Một bước tiếp theo", "Không thêm dữ kiện"],
    },
    commonTraps: [
      {
        trap_en: "Adding a new reason during the merge pass.",
        trap_vi: "Thêm lý do mới trong lượt gộp.",
        better: {
          pa: "ਉਹੀ ਕਾਰਨ ਰੱਖੋ।",
          romanization: "ohi karan rakho.",
          en: "Keep the same reason.",
          vi: "Giữ cùng lý do.",
        },
      },
    ],
    runnerReadinessNote_en:
      "Language practice only, not medical advice. Pre-merge is ready when runner-readiness and pipeline-readiness stay aligned.",
    runnerReadinessNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Tiền gộp sẵn sàng khi sẵn sàng runner và pipeline vẫn khớp nhau.",
    preIntegrationRoute_en:
      "Route to pre-integration after the pre-merge evidence repeats unchanged.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp sau khi bằng chứng tiền gộp lặp lại không đổi.",
  },
  {
    id: "b1-pre-merge-event-retelling",
    level: "B1",
    focus: "event_retelling",
    title_en: "Pre-merge event retelling",
    title_vi: "Kể lại sự việc trước khi gộp",
    scenario_en: "The learner retells an event in a stable first-then-now order.",
    scenario_vi: "Người học kể lại sự việc theo trình tự trước tiên-rồi-bây giờ ổn định.",
    canadaContext: "Useful for Canadian school, workplace, and housing reports.",
    preMergeCheck: {
      mergePrompt_en: "Merge passes when sequence and status stay stable under review.",
      mergePrompt_vi:
        "Gộp đạt khi trình tự và tình trạng vẫn ổn định khi rà soát.",
      sampleLine: {
        pa: "ਪਹਿਲਾਂ ਮੈਂ ਕਾਲ ਕੀਤੀ, ਫਿਰ ਸੁਨੇਹਾ ਛੱਡਿਆ, ਅਤੇ ਹੁਣ ਜਵਾਬ ਦੀ ਉਡੀਕ ਹੈ।",
        romanization:
          "pehlan main call kiti, phir suneha chhaddia, ate hun javab di udik hai.",
        en: "First I called, then I left a message, and now I am waiting for a reply.",
        vi: "Trước tiên tôi gọi, rồi để lại tin nhắn, và bây giờ tôi đang chờ phản hồi.",
      },
      mergeSignals_en: ["Fixed sequence", "Current status", "No side story"],
      mergeSignals_vi: ["Trình tự cố định", "Tình trạng hiện tại", "Không chuyện phụ"],
    },
    commonTraps: [
      {
        trap_en: "Changing the order during the merge review.",
        trap_vi: "Đổi thứ tự trong lúc rà soát gộp.",
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
      "Route to pre-integration when the pre-merge timeline remains stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp khi dòng thời gian tiền gộp vẫn ổn định.",
  },
  {
    id: "b1-pre-merge-clarification",
    level: "B1",
    focus: "clarification",
    title_en: "Pre-merge clarification",
    title_vi: "Làm rõ trước khi gộp",
    scenario_en: "The learner asks one written-confirmation question that stays narrow.",
    scenario_vi: "Người học hỏi một câu xác nhận bằng văn bản vẫn hẹp.",
    canadaContext: "Useful for Canadian appointments, intake desks, and school offices.",
    preMergeCheck: {
      mergePrompt_en: "Merge passes when the clarification is checkable and polite.",
      mergePrompt_vi: "Gộp đạt khi phần làm rõ có thể kiểm tra và lịch sự.",
      sampleLine: {
        pa: "ਕੀ ਤੁਸੀਂ ਮਿਤੀ ਅਤੇ ਅਗਲਾ ਕਦਮ ਲਿਖ ਕੇ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin miti ate agla kadam likh ke bhej sakde ho?",
        en: "Can you send the date and next step in writing?",
        vi: "Bạn có thể gửi ngày và bước tiếp theo bằng văn bản không?",
      },
      mergeSignals_en: ["Specific detail", "Written confirmation", "Polite ask"],
      mergeSignals_vi: ["Chi tiết cụ thể", "Xác nhận bằng văn bản", "Yêu cầu lịch sự"],
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
      "Merge passes runner-readiness when clarification remains pipeline-ready and stable.",
    runnerReadinessNote_vi:
      "Gộp đạt sẵn sàng runner khi phần làm rõ vẫn sẵn sàng pipeline và ổn định.",
    preIntegrationRoute_en:
      "Route to pre-integration clarification after the pre-merge detail stays stable.",
    preIntegrationRoute_vi:
      "Chuyển sang làm rõ tiền tích hợp sau khi chi tiết tiền gộp vẫn ổn định.",
  },
  {
    id: "b1-pre-merge-service-recovery",
    level: "B1",
    focus: "service_recovery",
    title_en: "Pre-merge service recovery",
    title_vi: "Phục hồi dịch vụ trước khi gộp",
    scenario_en: "The learner uses a polite reset and returns to the original request.",
    scenario_vi: "Người học dùng câu đặt lại lịch sự và quay về yêu cầu ban đầu.",
    canadaContext: "Useful for Canadian support chats, phone lines, and service counters.",
    preMergeCheck: {
      mergePrompt_en: "Merge passes when repair phrase and request stay unchanged.",
      mergePrompt_vi: "Gộp đạt khi cụm sửa lỗi và yêu cầu vẫn không đổi.",
      sampleLine: {
        pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੇਰੀ ਬੇਨਤੀ ਉਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ ਜੀ।",
        romanization:
          "maf karna, meri benti ohi hai. kirpa karke agla kadam dasso ji.",
        en: "Sorry, my request is the same. Please tell me the next step.",
        vi: "Xin lỗi, yêu cầu của tôi vẫn như cũ. Vui lòng cho tôi biết bước tiếp theo.",
      },
      mergeSignals_en: ["Repair phrase", "Same request", "Register-safe close"],
      mergeSignals_vi: ["Cụm sửa lỗi", "Cùng yêu cầu", "Kết thúc đúng mức trang trọng"],
    },
    commonTraps: [
      {
        trap_en: "Adding a complaint during the merge pass.",
        trap_vi: "Thêm khiếu nại trong lượt gộp.",
        better: {
          pa: "ਨਵੀਂ ਸ਼ਿਕਾਇਤ ਨਾ ਜੋੜੋ।",
          romanization: "navi shikait na joro.",
          en: "Do not add a new complaint.",
          vi: "Đừng thêm khiếu nại mới.",
        },
      },
    ],
    runnerReadinessNote_en:
      "Native review is deferred. Pre-merge is ready when service recovery stays pipeline-ready.",
    runnerReadinessNote_vi:
      "Đánh giá của người bản ngữ được để sau. Tiền gộp sẵn sàng khi phục hồi dịch vụ vẫn sẵn sàng pipeline.",
    preIntegrationRoute_en:
      "Route to service pre-integration after the pre-merge reset remains unchanged.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp dịch vụ sau khi câu đặt lại tiền gộp vẫn không đổi.",
  },
  {
    id: "b1-pre-merge-issue-resolution",
    level: "B1",
    focus: "issue_resolution",
    title_en: "Pre-merge issue resolution",
    title_vi: "Giải quyết vấn đề trước khi gộp",
    scenario_en: "The learner asks for correction confirmation without claiming the result.",
    scenario_vi: "Người học xin xác nhận phần sửa mà không tự khẳng định kết quả.",
    canadaContext: "Useful for Canadian rental repairs, account corrections, and school records.",
    preMergeCheck: {
      mergePrompt_en: "Merge passes when correction and confirmation remain linked.",
      mergePrompt_vi: "Gộp đạt khi phần sửa và xác nhận vẫn được nối với nhau.",
      sampleLine: {
        pa: "ਜੇ ਸੁਧਾਰ ਹੋ ਗਿਆ ਹੈ, ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਪੁਸ਼ਟੀ ਭੇਜੋ।",
        romanization: "je sudhar ho gia hai, kirpa karke mainu pushti bhejo.",
        en: "If the correction has been made, please send me confirmation.",
        vi: "Nếu phần sửa đã xong, vui lòng gửi xác nhận cho tôi.",
      },
      mergeSignals_en: ["Conditional wording", "Correction", "Confirmation request"],
      mergeSignals_vi: ["Cách nói có điều kiện", "Phần sửa", "Yêu cầu xác nhận"],
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
      "Language practice only, not legal or financial advice. Merge keeps requests separate from promises.",
    runnerReadinessNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Gộp giữ yêu cầu tách khỏi lời hứa.",
    preIntegrationRoute_en:
      "Route to pre-integration once the merge evidence repeats unchanged.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp khi bằng chứng gộp lặp lại không đổi.",
  },
  {
    id: "b1-pre-merge-follow-up-message",
    level: "B1",
    focus: "follow_up_message",
    title_en: "Pre-merge follow-up message",
    title_vi: "Tin nhắn theo dõi trước khi gộp",
    scenario_en: "The learner sends a short follow-up that keeps the same request.",
    scenario_vi: "Người học gửi tin nhắn theo dõi ngắn vẫn giữ cùng yêu cầu.",
    canadaContext: "Useful for Canadian job follow-ups, clinic reminders, and school emails.",
    preMergeCheck: {
      mergePrompt_en: "Merge passes when the follow-up stays short and stable.",
      mergePrompt_vi: "Gộp đạt khi tin nhắn theo dõi ngắn và ổn định.",
      sampleLine: {
        pa: "ਮੈਂ ਫਿਰ ਪੁੱਛ ਰਿਹਾ ਹਾਂ ਕਿ ਕੀ ਇਹ ਹੋ ਗਿਆ ਹੈ। ਧੰਨਵਾਦ।",
        romanization: "main phir puchh riha han ki ki eh ho gia hai. dhanvad.",
        en: "I am asking again whether this is done. Thank you.",
        vi: "Tôi đang hỏi lại xem việc này đã xong chưa. Cảm ơn.",
      },
      mergeSignals_en: ["Short follow-up", "Same request", "Polite close"],
      mergeSignals_vi: ["Theo dõi ngắn", "Cùng yêu cầu", "Kết thúc lịch sự"],
    },
    commonTraps: [
      {
        trap_en: "Turning a follow-up into a long new message.",
        trap_vi: "Biến tin nhắn theo dõi thành một tin dài mới.",
        better: {
          pa: "ਛੋਟਾ ਰੱਖੋ।",
          romanization: "chhota rakho.",
          en: "Keep it short.",
          vi: "Giữ ngắn gọn.",
        },
      },
    ],
    runnerReadinessNote_en:
      "Native review is deferred. Pre-merge follow-up stays ready when the same ask remains visible.",
    runnerReadinessNote_vi:
      "Đánh giá của người bản ngữ được để sau. Theo dõi tiền gộp sẵn sàng khi cùng yêu cầu vẫn rõ ràng.",
    preIntegrationRoute_en:
      "Route to pre-integration after the follow-up message remains unchanged.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp sau khi tin nhắn theo dõi vẫn không đổi.",
  },
  {
    id: "b1-pre-merge-workplace-task",
    level: "B1",
    focus: "workplace_task",
    title_en: "Pre-merge workplace task",
    title_vi: "Nhiệm vụ nơi làm việc trước khi gộp",
    scenario_en: "The learner reports progress and asks for one clear instruction.",
    scenario_vi: "Người học báo tiến độ và hỏi một chỉ dẫn rõ ràng.",
    canadaContext: "Useful for Canadian shift work, volunteer roles, and team check-ins.",
    preMergeCheck: {
      mergePrompt_en: "Merge passes when progress and request remain one clean unit.",
      mergePrompt_vi: "Gộp đạt khi tiến độ và yêu cầu vẫn là một khối rõ ràng.",
      sampleLine: {
        pa: "ਮੈਂ ਰਿਪੋਰਟ ਦਾ ਪਹਿਲਾ ਹਿੱਸਾ ਭੇਜ ਦਿੱਤਾ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।",
        romanization:
          "main report da pehla hissa bhej ditta hai. kirpa karke agla kadam dasso.",
        en: "I have sent the first part of the report. Please tell me the next step.",
        vi: "Tôi đã gửi phần đầu của báo cáo. Vui lòng cho tôi biết bước tiếp theo.",
      },
      mergeSignals_en: ["Progress update", "One instruction", "Clean unit"],
      mergeSignals_vi: ["Cập nhật tiến độ", "Một chỉ dẫn", "Khối rõ ràng"],
    },
    commonTraps: [
      {
        trap_en: "Mixing several tasks into one merge sentence.",
        trap_vi: "Trộn nhiều nhiệm vụ vào một câu gộp.",
        better: {
          pa: "ਇੱਕ ਕੰਮ, ਇੱਕ ਅਗਲਾ ਕਦਮ।",
          romanization: "ik kam, ik agla kadam.",
          en: "One task, one next step.",
          vi: "Một việc, một bước tiếp theo.",
        },
      },
    ],
    runnerReadinessNote_en:
      "Language practice only, not medical advice. Merge is ready when the work update stays stable.",
    runnerReadinessNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Gộp sẵn sàng khi cập nhật công việc vẫn ổn định.",
    preIntegrationRoute_en:
      "Route to pre-integration after the workplace message stays stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp sau khi tin nhắn nơi làm việc vẫn ổn định.",
  },
  {
    id: "b1-pre-merge-housing-school-community",
    level: "B1",
    focus: "housing_school_community",
    title_en: "Pre-merge housing, school, and community task",
    title_vi: "Nhiệm vụ nhà ở, trường học, và cộng đồng trước khi gộp",
    scenario_en: "The learner reports one housing, school, or community need with a direct ask.",
    scenario_vi:
      "Người học báo một nhu cầu về nhà ở, trường học, hoặc cộng đồng với yêu cầu trực tiếp.",
    canadaContext: "Useful for Canadian landlords, school offices, libraries, and community programs.",
    preMergeCheck: {
      mergePrompt_en: "Merge passes when the need and ask stay direct and stable.",
      mergePrompt_vi: "Gộp đạt khi nhu cầu và yêu cầu vẫn trực tiếp và ổn định.",
      sampleLine: {
        pa: "ਸਕੂਲ ਦੇ ਫਾਰਮ ਬਾਰੇ ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿੱਥੇ ਜਾਣਾ ਹੈ।",
        romanization:
          "school de form bare mainu madad chahidi hai. kirpa karke dasso kithe jana hai.",
        en: "I need help with the school form. Please tell me where to go.",
        vi: "Tôi cần giúp với mẫu của trường. Vui lòng cho tôi biết phải đến đâu.",
      },
      mergeSignals_en: ["Direct need", "One clear ask", "Stable setting"],
      mergeSignals_vi: ["Nhu cầu trực tiếp", "Một yêu cầu rõ", "Bối cảnh ổn định"],
    },
    commonTraps: [
      {
        trap_en: "Adding unrelated problems during the merge pass.",
        trap_vi: "Thêm vấn đề không liên quan trong lượt gộp.",
        better: {
          pa: "ਸਿਰਫ਼ ਉਹੀ ਗੱਲ ਰੱਖੋ।",
          romanization: "sirf ohi gal rakho.",
          en: "Keep only that point.",
          vi: "Chỉ giữ đúng điểm đó.",
        },
      },
    ],
    runnerReadinessNote_en:
      "Pre-merge keeps the community request stable and ready for pipeline review.",
    runnerReadinessNote_vi:
      "Gộp giữ yêu cầu cộng đồng ổn định và sẵn sàng cho rà soát pipeline.",
    preIntegrationRoute_en:
      "Route to pre-integration once the housing or school need stays unchanged.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp khi nhu cầu nhà ở hoặc trường học vẫn không đổi.",
  },
  {
    id: "b1-pre-merge-register-safe-repair",
    level: "B1",
    focus: "register_safe_repair",
    title_en: "Pre-merge register-safe repair",
    title_vi: "Sửa mức độ lịch sự an toàn trước khi gộp",
    scenario_en: "The learner softens a line without changing the request or claiming results.",
    scenario_vi:
      "Người học làm dịu câu nói mà không đổi yêu cầu hoặc tự nhận kết quả.",
    canadaContext: "Useful for Canadian service desks, clinics, and workplace emails.",
    preMergeCheck: {
      mergePrompt_en: "Merge passes when tone repair stays safe and unchanged in meaning.",
      mergePrompt_vi: "Gộp đạt khi phần sửa giọng điệu vẫn an toàn và không đổi nghĩa.",
      sampleLine: {
        pa: "ਕਿਰਪਾ ਕਰਕੇ, ਕੀ ਤੁਸੀਂ ਇਹ ਜਾਂਚ ਸਕਦੇ ਹੋ?",
        romanization: "kirpa karke, ki tusin eh janch sakde ho?",
        en: "Please, can you check this?",
        vi: "Làm ơn, bạn có thể kiểm tra việc này không?",
      },
      mergeSignals_en: ["Tone repair", "Same meaning", "No overclaim"],
      mergeSignals_vi: ["Sửa giọng điệu", "Không đổi nghĩa", "Không tự nhận quá mức"],
    },
    commonTraps: [
      {
        trap_en: "Making the repair too formal or too casual.",
        trap_vi: "Làm câu sửa quá trang trọng hoặc quá suồng sã.",
        better: {
          pa: "ਮੱਧਲਾ ਸੁਰ ਰੱਖੋ।",
          romanization: "madhla sur rakho.",
          en: "Keep a middle register.",
          vi: "Giữ mức độ trung tính.",
        },
      },
    ],
    runnerReadinessNote_en:
      "Native review is deferred. Pre-merge register-safe repair stays ready when tone and meaning match.",
    runnerReadinessNote_vi:
      "Đánh giá của người bản ngữ được để sau. Sửa mức lịch sự an toàn trước khi gộp sẵn sàng khi giọng điệu và nghĩa khớp nhau.",
    preIntegrationRoute_en:
      "Route to pre-integration after the repair line remains stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp sau khi câu sửa vẫn ổn định.",
  },
];
