export type PunjabiB1ReleaseCandidateFocus =
  | "situation_explanation"
  | "event_retelling"
  | "clarification"
  | "service_recovery"
  | "issue_resolution"
  | "follow_up_message"
  | "workplace_task"
  | "housing_school_community"
  | "register_safe_repair";

export type PunjabiReleaseCandidateLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiReleaseCandidateTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiReleaseCandidateLine;
};

export type PunjabiReleaseCandidateCheck = {
  releaseCandidatePrompt_en: string;
  releaseCandidatePrompt_vi: string;
  sampleLine: PunjabiReleaseCandidateLine;
  readinessSignals_en: string[];
  readinessSignals_vi: string[];
};

export type PunjabiB1ReleaseCandidateCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1ReleaseCandidateFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  releaseCandidate: PunjabiReleaseCandidateCheck;
  commonTraps: PunjabiReleaseCandidateTrap[];
  closureValidationNote_en: string;
  closureValidationNote_vi: string;
  preIntegrationRoute_en: string;
  preIntegrationRoute_vi: string;
};

export const punjabiB1ReleaseCandidateSamples: PunjabiB1ReleaseCandidateCard[] = [
  {
    id: "b1-release-situation-explanation",
    level: "B1",
    focus: "situation_explanation",
    title_en: "Release-ready situation explanation",
    title_vi: "Giải thích tình huống sẵn sàng phát hành",
    scenario_en:
      "The learner explains one service problem and asks for the next step.",
    scenario_vi:
      "Người học giải thích một vấn đề dịch vụ và hỏi bước tiếp theo.",
    canadaContext:
      "Useful for Canadian service desks, newcomer centres, and community intake.",
    releaseCandidate: {
      releaseCandidatePrompt_en:
        "Confirm the issue, time, and next step without adding a new problem.",
      releaseCandidatePrompt_vi:
        "Xác nhận vấn đề, thời gian và bước tiếp theo mà không thêm vấn đề mới.",
      sampleLine: {
        pa: "ਇਹ ਮੁੱਦਾ ਅੱਜ ਆਇਆ ਹੈ, ਅਤੇ ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਜਾਣਨਾ ਹੈ।",
        romanization: "ih mudda ajj aia hai, ate mainu agla kadam janna hai.",
        en: "This issue came up today, and I need to know the next step.",
        vi: "Vấn đề này xảy ra hôm nay, và tôi cần biết bước tiếp theo.",
      },
      readinessSignals_en: ["One issue", "Time marker", "Next-step request"],
      readinessSignals_vi: ["Một vấn đề", "Mốc thời gian", "Yêu cầu bước tiếp theo"],
    },
    commonTraps: [
      {
        trap_en: "Adding unrelated background at release-candidate stage.",
        trap_vi: "Thêm bối cảnh không liên quan ở giai đoạn ứng viên phát hành.",
        better: {
          pa: "ਮੁੱਖ ਗੱਲ ਇੱਕ ਵਾਰੀ ਸਾਫ਼ ਰੱਖੋ।",
          romanization: "mukh gall ik vari saf rakho.",
          en: "Keep the main point clear once.",
          vi: "Giữ ý chính rõ một lần.",
        },
      },
    ],
    closureValidationNote_en:
      "Language practice only, not medical advice. Release-candidate status depends on stable closure-validation.",
    closureValidationNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Trạng thái ứng viên phát hành phụ thuộc vào xác thực chốt ổn định.",
    preIntegrationRoute_en:
      "Route to pre-integration when the explanation is stable across speech and writing.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp khi phần giải thích ổn định qua nói và viết.",
  },
  {
    id: "b1-release-event-retelling",
    level: "B1",
    focus: "event_retelling",
    title_en: "Release-ready event retelling",
    title_vi: "Kể lại sự việc sẵn sàng phát hành",
    scenario_en:
      "The learner retells a workplace, housing, or school event in a fixed order.",
    scenario_vi:
      "Người học kể lại sự việc nơi làm việc, nhà ở hoặc trường học theo thứ tự cố định.",
    canadaContext:
      "Useful for Canadian workplace notes, tenant messages, and school office updates.",
    releaseCandidate: {
      releaseCandidatePrompt_en:
        "Keep the timeline stable and close with current status.",
      releaseCandidatePrompt_vi:
        "Giữ dòng thời gian ổn định và chốt bằng trạng thái hiện tại.",
      sampleLine: {
        pa: "ਪਹਿਲਾਂ ਮੈਂ ਸੁਨੇਹਾ ਭੇਜਿਆ, ਫਿਰ ਜਵਾਬ ਆਇਆ, ਅਤੇ ਹੁਣ ਸਮਾਂ ਤੈਅ ਹੈ।",
        romanization:
          "pehlan main suneha bhejia, phir javab aia, ate hun sama tai hai.",
        en: "First I sent a message, then a reply came, and now the time is set.",
        vi: "Trước hết tôi gửi tin nhắn, rồi có phản hồi, và bây giờ giờ đã được xác định.",
      },
      readinessSignals_en: ["Ordered events", "Current status", "No side story"],
      readinessSignals_vi: ["Sự việc có thứ tự", "Trạng thái hiện tại", "Không có chuyện phụ"],
    },
    commonTraps: [
      {
        trap_en: "Changing the timeline after closure-validation.",
        trap_vi: "Đổi dòng thời gian sau xác thực chốt.",
        better: {
          pa: "ਕ੍ਰਮ ਉਹੀ ਰੱਖੋ।",
          romanization: "kram ohi rakho.",
          en: "Keep the same order.",
          vi: "Giữ cùng thứ tự.",
        },
      },
    ],
    closureValidationNote_en:
      "Language practice only, not legal or financial advice. Shahmukhi is awareness only, not a full course.",
    closureValidationNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ.",
    preIntegrationRoute_en:
      "Route to pre-integration if the retelling stays stable in written and spoken checks.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp nếu phần kể lại ổn định trong kiểm tra viết và nói.",
  },
  {
    id: "b1-release-clarification",
    level: "B1",
    focus: "clarification",
    title_en: "Release-ready clarification",
    title_vi: "Làm rõ sẵn sàng phát hành",
    scenario_en:
      "The learner confirms one next-step detail before ending the exchange.",
    scenario_vi:
      "Người học xác nhận một chi tiết bước tiếp theo trước khi kết thúc trao đổi.",
    canadaContext:
      "Useful for Canadian appointments, school forms, and public-service intake.",
    releaseCandidate: {
      releaseCandidatePrompt_en:
        "Ask for the missing detail and request written confirmation.",
      releaseCandidatePrompt_vi:
        "Hỏi chi tiết còn thiếu và xin xác nhận bằng văn bản.",
      sampleLine: {
        pa: "ਕੀ ਤੁਸੀਂ ਅਗਲਾ ਕਦਮ ਅਤੇ ਮਿਤੀ ਲਿਖ ਕੇ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin agla kadam ate miti likh ke bhej sakde ho?",
        en: "Can you send the next step and date in writing?",
        vi: "Bạn có thể gửi bước tiếp theo và ngày bằng văn bản không?",
      },
      readinessSignals_en: ["Specific detail", "Written confirmation", "Clear close"],
      readinessSignals_vi: ["Chi tiết cụ thể", "Xác nhận bằng văn bản", "Chốt rõ"],
    },
    commonTraps: [
      {
        trap_en: "Closing while a key date is still unclear.",
        trap_vi: "Kết thúc khi ngày quan trọng vẫn chưa rõ.",
        better: {
          pa: "ਮਿਤੀ ਪਹਿਲਾਂ ਪੁਸ਼ਟੀ ਕਰੋ।",
          romanization: "miti pehlan pushti karo.",
          en: "Confirm the date first.",
          vi: "Xác nhận ngày trước.",
        },
      },
    ],
    closureValidationNote_en:
      "Release-candidate clarification passes when closure-validation leaves no unclear next step.",
    closureValidationNote_vi:
      "Làm rõ ứng viên phát hành đạt khi xác thực chốt không còn bước tiếp theo mơ hồ.",
    preIntegrationRoute_en:
      "Route to pre-integration clarification after the confirmed detail can be repeated.",
    preIntegrationRoute_vi:
      "Chuyển sang làm rõ tiền tích hợp sau khi chi tiết đã xác nhận có thể được lặp lại.",
  },
  {
    id: "b1-release-service-recovery",
    level: "B1",
    focus: "service_recovery",
    title_en: "Release-ready service recovery",
    title_vi: "Phục hồi dịch vụ sẵn sàng phát hành",
    scenario_en:
      "The learner resets a service conversation and closes with the same request.",
    scenario_vi:
      "Người học đặt lại cuộc trò chuyện dịch vụ và chốt với cùng yêu cầu.",
    canadaContext:
      "Useful for Canadian service counters, support chats, and phone lines.",
    releaseCandidate: {
      releaseCandidatePrompt_en:
        "Keep the reset polite and confirm the next service step.",
      releaseCandidatePrompt_vi:
        "Giữ phần đặt lại lịch sự và xác nhận bước dịch vụ tiếp theo.",
      sampleLine: {
        pa: "ਬੇਨਤੀ ਉਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਪੁਸ਼ਟੀ ਕਰੋ।",
        romanization: "benti ohi hai. kirpa karke agla kadam pushti karo.",
        en: "The request is the same. Please confirm the next step.",
        vi: "Yêu cầu vẫn như cũ. Vui lòng xác nhận bước tiếp theo.",
      },
      readinessSignals_en: ["Same request", "Polite reset", "Next step"],
      readinessSignals_vi: ["Cùng yêu cầu", "Đặt lại lịch sự", "Bước tiếp theo"],
    },
    commonTraps: [
      {
        trap_en: "Restarting a new service complaint at the end.",
        trap_vi: "Bắt đầu khiếu nại dịch vụ mới ở cuối.",
        better: {
          pa: "ਅਖੀਰ ਵਿੱਚ ਉਹੀ ਬੇਨਤੀ ਰੱਖੋ।",
          romanization: "akhir vich ohi benti rakho.",
          en: "Keep the same request at the end.",
          vi: "Giữ cùng yêu cầu ở cuối.",
        },
      },
    ],
    closureValidationNote_en:
      "Native review is deferred. Release-candidate service recovery is ready when closure-validation avoids escalation.",
    closureValidationNote_vi:
      "Đánh giá của người bản ngữ được để sau. Phục hồi dịch vụ ứng viên phát hành sẵn sàng khi xác thực chốt tránh leo thang.",
    preIntegrationRoute_en:
      "Route to service pre-integration when the reset works in chat and phone tasks.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp dịch vụ khi câu đặt lại dùng được trong chat và điện thoại.",
  },
  {
    id: "b1-release-issue-resolution",
    level: "B1",
    focus: "issue_resolution",
    title_en: "Release-ready issue resolution",
    title_vi: "Giải quyết vấn đề sẵn sàng phát hành",
    scenario_en:
      "The learner links the issue, correction, and confirmation request.",
    scenario_vi:
      "Người học nối vấn đề, phần sửa và yêu cầu xác nhận.",
    canadaContext:
      "Useful for Canadian billing, tenant repair, school records, and community services.",
    releaseCandidate: {
      releaseCandidatePrompt_en:
        "Ask whether the correction is complete and confirmation was sent.",
      releaseCandidatePrompt_vi:
        "Hỏi phần sửa đã hoàn tất và xác nhận đã được gửi chưa.",
      sampleLine: {
        pa: "ਕੀ ਸੁਧਾਰ ਪੂਰਾ ਹੋ ਗਿਆ ਹੈ ਅਤੇ ਪੁਸ਼ਟੀ ਭੇਜੀ ਗਈ ਹੈ?",
        romanization: "ki sudhar pura ho gia hai ate pushti bheji gai hai?",
        en: "Has the correction been completed and confirmation been sent?",
        vi: "Phần sửa đã hoàn tất và xác nhận đã được gửi chưa?",
      },
      readinessSignals_en: ["Correction complete", "Confirmation", "No new issue"],
      readinessSignals_vi: ["Sửa hoàn tất", "Xác nhận", "Không thêm vấn đề mới"],
    },
    commonTraps: [
      {
        trap_en: "Closing before confirming whether the correction happened.",
        trap_vi: "Chốt trước khi xác nhận phần sửa đã xảy ra chưa.",
        better: {
          pa: "ਸੁਧਾਰ ਦੀ ਪੁਸ਼ਟੀ ਪਹਿਲਾਂ ਕਰੋ।",
          romanization: "sudhar di pushti pehlan karo.",
          en: "Confirm the correction first.",
          vi: "Xác nhận phần sửa trước.",
        },
      },
    ],
    closureValidationNote_en:
      "Language practice only, not legal or financial advice. Release-candidate issue resolution should not invent outcomes.",
    closureValidationNote_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Giải quyết vấn đề ứng viên phát hành không nên bịa kết quả.",
    preIntegrationRoute_en:
      "Route to issue-resolution pre-integration when the correction is checkable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp giải quyết vấn đề khi phần sửa có thể kiểm tra.",
  },
  {
    id: "b1-release-follow-up-message",
    level: "B1",
    focus: "follow_up_message",
    title_en: "Release-ready follow-up",
    title_vi: "Theo dõi sẵn sàng phát hành",
    scenario_en:
      "The learner sends a concise follow-up connected to the previous request.",
    scenario_vi:
      "Người học gửi phần theo dõi ngắn nối với yêu cầu trước.",
    canadaContext:
      "Useful for Canadian emails to landlords, schools, clinics, and community agencies.",
    releaseCandidate: {
      releaseCandidatePrompt_en:
        "Refer to the previous request and ask for the next step.",
      releaseCandidatePrompt_vi:
        "Nhắc yêu cầu trước và hỏi bước tiếp theo.",
      sampleLine: {
        pa: "ਪਿਛਲੀ ਬੇਨਤੀ ਬਾਰੇ, ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?",
        romanization: "pichhli benti bare, agla kadam ki hai?",
        en: "Regarding the previous request, what is the next step?",
        vi: "Về yêu cầu trước, bước tiếp theo là gì?",
      },
      readinessSignals_en: ["Previous request", "Concise", "Next step"],
      readinessSignals_vi: ["Yêu cầu trước", "Ngắn gọn", "Bước tiếp theo"],
    },
    commonTraps: [
      {
        trap_en: "Repeating the whole case instead of following up.",
        trap_vi: "Lặp lại toàn bộ vụ việc thay vì theo dõi.",
        better: {
          pa: "ਇਹ ਸਿਰਫ਼ ਪਾਲਣਾ ਹੈ।",
          romanization: "ih sirf palna hai.",
          en: "This is only a follow-up.",
          vi: "Đây chỉ là phần theo dõi.",
        },
      },
    ],
    closureValidationNote_en:
      "Release-candidate follow-up passes when closure-validation keeps the message short and actionable.",
    closureValidationNote_vi:
      "Theo dõi ứng viên phát hành đạt khi xác thực chốt giữ tin nhắn ngắn và có hành động.",
    preIntegrationRoute_en:
      "Route to message pre-integration when the follow-up adds action, not confusion.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp tin nhắn khi phần theo dõi thêm hành động, không thêm rối.",
  },
  {
    id: "b1-release-workplace-task",
    level: "B1",
    focus: "workplace_task",
    title_en: "Release-ready workplace update",
    title_vi: "Cập nhật nơi làm việc sẵn sàng phát hành",
    scenario_en:
      "The learner gives a respectful workplace update with timing and action.",
    scenario_vi:
      "Người học đưa cập nhật nơi làm việc tôn trọng với thời gian và hành động.",
    canadaContext:
      "Useful for Canadian shift updates, supervisor messages, and scheduling changes.",
    releaseCandidate: {
      releaseCandidatePrompt_en:
        "Keep timing, action, and register ready for release.",
      releaseCandidatePrompt_vi:
        "Giữ thời gian, hành động và sắc thái sẵn sàng phát hành.",
      sampleLine: {
        pa: "ਮੈਂ ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ ਅਤੇ ਪਹਿਲਾਂ ਹੀ ਸੁਨੇਹਾ ਭੇਜ ਦਿੱਤਾ ਹੈ।",
        romanization:
          "main das mint der nal avanga ate pehlan hi suneha bhej ditta hai.",
        en: "I will arrive ten minutes late and have already sent a message.",
        vi: "Tôi sẽ đến muộn mười phút và đã gửi tin nhắn trước rồi.",
      },
      readinessSignals_en: ["Timing", "Action taken", "Respectful register"],
      readinessSignals_vi: ["Thời gian", "Hành động đã làm", "Sắc thái tôn trọng"],
    },
    commonTraps: [
      {
        trap_en: "Using casual friend language in a supervisor update.",
        trap_vi: "Dùng ngôn ngữ thân mật như bạn bè trong cập nhật cho quản lý.",
        better: {
          pa: "ਮੈਂ ਤੁਹਾਨੂੰ ਪਹਿਲਾਂ ਸੂਚਿਤ ਕਰ ਰਿਹਾ ਹਾਂ।",
          romanization: "main tuhanu pehlan suchit kar riha han.",
          en: "I am informing you in advance.",
          vi: "Tôi thông báo trước cho bạn.",
        },
      },
    ],
    closureValidationNote_en:
      "Workplace release-candidate status depends on respectful closure-validation.",
    closureValidationNote_vi:
      "Trạng thái ứng viên phát hành nơi làm việc phụ thuộc vào xác thực chốt tôn trọng.",
    preIntegrationRoute_en:
      "Route to workplace pre-integration when timing and tone remain stable.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp nơi làm việc khi thời gian và giọng vẫn ổn định.",
  },
  {
    id: "b1-release-housing-school-community",
    level: "B1",
    focus: "housing_school_community",
    title_en: "Release-ready public task",
    title_vi: "Nhiệm vụ công cộng sẵn sàng phát hành",
    scenario_en:
      "The learner uses one neutral request across housing, school, and community settings.",
    scenario_vi:
      "Người học dùng một yêu cầu trung tính qua bối cảnh nhà ở, trường học và cộng đồng.",
    canadaContext:
      "Useful for Canadian rental offices, schools, libraries, and newcomer centres.",
    releaseCandidate: {
      releaseCandidatePrompt_en:
        "Ask about the form, service, or final step without making policy claims.",
      releaseCandidatePrompt_vi:
        "Hỏi về mẫu đơn, dịch vụ hoặc bước cuối mà không khẳng định chính sách.",
      sampleLine: {
        pa: "ਇਸ ਸੇਵਾ ਲਈ ਅਗਲਾ ਫਾਰਮ ਜਾਂ ਕਦਮ ਕੀ ਹੈ?",
        romanization: "is seva lai agla form ja kadam ki hai?",
        en: "What is the next form or step for this service?",
        vi: "Mẫu đơn hoặc bước tiếp theo cho dịch vụ này là gì?",
      },
      readinessSignals_en: ["Neutral request", "Practical task", "No policy claim"],
      readinessSignals_vi: ["Yêu cầu trung tính", "Nhiệm vụ thực tế", "Không khẳng định chính sách"],
    },
    commonTraps: [
      {
        trap_en: "Inventing rules for an office or program.",
        trap_vi: "Bịa quy định cho văn phòng hoặc chương trình.",
        better: {
          pa: "ਮੈਂ ਸਿਰਫ਼ ਪ੍ਰਕਿਰਿਆ ਪੁੱਛ ਰਿਹਾ ਹਾਂ।",
          romanization: "main sirf prakiria puchh riha han.",
          en: "I am only asking about the process.",
          vi: "Tôi chỉ đang hỏi về quy trình.",
        },
      },
    ],
    closureValidationNote_en:
      "Release-candidate public-task language remains practical and avoids legal, financial, or eligibility advice.",
    closureValidationNote_vi:
      "Ngôn ngữ nhiệm vụ công cộng ứng viên phát hành vẫn thực tế và tránh tư vấn pháp lý, tài chính hoặc điều kiện đủ.",
    preIntegrationRoute_en:
      "Route to public-task pre-integration when the request works across settings.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp nhiệm vụ công khi yêu cầu dùng được qua nhiều bối cảnh.",
  },
  {
    id: "b1-release-register-safe-repair",
    level: "B1",
    focus: "register_safe_repair",
    title_en: "Release-ready register repair",
    title_vi: "Sửa sắc thái sẵn sàng phát hành",
    scenario_en:
      "The learner softens a direct request and keeps the original task visible.",
    scenario_vi:
      "Người học làm nhẹ yêu cầu trực tiếp và giữ nhiệm vụ ban đầu rõ.",
    canadaContext:
      "Useful for Canadian workplaces, service counters, housing offices, and schools.",
    releaseCandidate: {
      releaseCandidatePrompt_en:
        "Confirm that tone is softer but the request is still specific.",
      releaseCandidatePrompt_vi:
        "Xác nhận giọng nhẹ hơn nhưng yêu cầu vẫn cụ thể.",
      sampleLine: {
        pa: "ਮਾਫ਼ ਕਰਨਾ, ਨਰਮ ਤਰੀਕੇ ਨਾਲ ਕਹਿੰਦਾ ਹਾਂ: ਕੀ ਤੁਸੀਂ ਇਹ ਮੁੜ ਦੇਖ ਸਕਦੇ ਹੋ?",
        romanization:
          "maf karna, naram tarike nal kahinda han: ki tusin ih mur dekh sakde ho?",
        en: "Sorry, saying it more softly: could you look at this again?",
        vi: "Xin lỗi, nói nhẹ hơn: bạn có thể xem lại phần này không?",
      },
      readinessSignals_en: ["Softer register", "Same request", "Specific task"],
      readinessSignals_vi: ["Sắc thái nhẹ hơn", "Cùng yêu cầu", "Nhiệm vụ cụ thể"],
    },
    commonTraps: [
      {
        trap_en: "Softening so much that the request disappears.",
        trap_vi: "Làm nhẹ quá mức khiến yêu cầu biến mất.",
        better: {
          pa: "ਬੇਨਤੀ ਉਹੀ ਹੈ, ਲਹਿਜ਼ਾ ਨਰਮ ਹੈ।",
          romanization: "benti ohi hai, lahiza naram hai.",
          en: "The request is the same; the tone is softer.",
          vi: "Yêu cầu vẫn như cũ; giọng nhẹ hơn.",
        },
      },
    ],
    closureValidationNote_en:
      "Native review is deferred. Release-candidate repair is ready when closure-validation keeps tone and task clear.",
    closureValidationNote_vi:
      "Đánh giá của người bản ngữ được để sau. Sửa lời ứng viên phát hành sẵn sàng khi xác thực chốt giữ rõ giọng và nhiệm vụ.",
    preIntegrationRoute_en:
      "Route to register-safe pre-integration when the repair stays polite and specific.",
    preIntegrationRoute_vi:
      "Chuyển sang tiền tích hợp về sắc thái khi phần sửa vẫn lịch sự và cụ thể.",
  },
];
