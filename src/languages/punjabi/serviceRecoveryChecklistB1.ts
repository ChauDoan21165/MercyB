export type PunjabiB1ServiceRecoveryChecklistFocus =
  | "clarify_issue"
  | "restate_facts"
  | "ask_next_steps"
  | "polite_follow_up"
  | "repair_misunderstanding"
  | "workplace_conversation"
  | "housing_conversation"
  | "school_community_conversation"
  | "service_conversation";

export type PunjabiServiceRecoveryChecklistLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiServiceRecoveryChecklistTrap = {
  trap_en: string;
  trap_vi: string;
  repair: PunjabiServiceRecoveryChecklistLine;
};

export type PunjabiServiceRecoveryChecklistPack = {
  finalStabilityPrompt_en: string;
  finalStabilityPrompt_vi: string;
  checklistLine: PunjabiServiceRecoveryChecklistLine;
  checklistSignals_en: string[];
  checklistSignals_vi: string[];
};

export type PunjabiB1ServiceRecoveryChecklistCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1ServiceRecoveryChecklistFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  checklistPack: PunjabiServiceRecoveryChecklistPack;
  commonTraps: PunjabiServiceRecoveryChecklistTrap[];
  exportReadiness_en: string;
  exportReadiness_vi: string;
  finalQuality_en: string;
  finalQuality_vi: string;
};

export const punjabiB1ServiceRecoveryChecklist: PunjabiB1ServiceRecoveryChecklistCard[] = [
  {
    id: "b1-service-checklist-clarify-issue",
    level: "B1",
    focus: "clarify_issue",
    title_en: "Clarify the issue first",
    title_vi: "Làm rõ vấn đề trước",
    scenario_en:
      "A service answer is unclear and you need to identify the exact issue before moving on.",
    scenario_vi:
      "Câu trả lời dịch vụ không rõ và bạn cần xác định chính xác vấn đề trước khi đi tiếp.",
    canadaContext:
      "Useful for Canadian service counters, phone support, and intake desks.",
    checklistPack: {
      finalStabilityPrompt_en:
        "Use a short checklist: issue, facts, next step, and follow-up.",
      finalStabilityPrompt_vi:
        "Dùng danh sách ngắn: vấn đề, факт, bước tiếp theo và theo dõi.",
      checklistLine: {
        pa: "ਆਓ ਪਹਿਲਾਂ ਮੁੱਦਾ ਸਾਫ਼ ਕਰੀਏ, ਫਿਰ ਅਗਲਾ ਕਦਮ ਦੇਖੀਏ।",
        romanization:
          "ao pehlan mudda saf kariye, phir agla kadam dekhiye.",
        en: "Let's clarify the issue first, then look at the next step.",
        vi: "Hãy làm rõ vấn đề trước, rồi xem bước tiếp theo.",
      },
      checklistSignals_en: [
        "Names the issue",
        "Keeps the sequence clear",
        "Moves to the next step",
      ],
      checklistSignals_vi: [
        "Nêu vấn đề",
        "Giữ trình tự rõ",
        "Chuyển sang bước tiếp theo",
      ],
    },
    commonTraps: [
      {
        trap_en: "Jumping ahead before the issue is clear.",
        trap_vi: "Nhảy sang bước sau trước khi vấn đề rõ.",
        repair: {
          pa: "ਮੈਨੂੰ ਪਹਿਲਾਂ ਇਹ ਸਮਝ ਲੈਣ ਦਿਓ ਕਿ ਸਮੱਸਿਆ ਕੀ ਹੈ।",
          romanization:
            "mainu pehlan ih samajh lain dio ki samasya ki hai.",
          en: "Let me first understand what the problem is.",
          vi: "Hãy để tôi hiểu trước vấn đề là gì.",
        },
      },
    ],
    exportReadiness_en:
      "Language practice only, not medical advice. Language practice only, not legal or financial advice. Final stability is ready when the learner can keep the checklist short and factual.",
    exportReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Sẵn sàng cuối khi người học giữ được danh sách ngắn và фактичес.",
    finalQuality_en:
      "Final quality checks checklist flow, boundary awareness, and Gurmukhi-first output.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh luồng danh sách, nhận biết ranh giới và đầu ra Gurmukhi là chính.",
  },
  {
    id: "b1-service-checklist-restate-facts",
    level: "B1",
    focus: "restate_facts",
    title_en: "Restate the facts clearly",
    title_vi: "Nhắc lại факт rõ ràng",
    scenario_en:
      "The listener missed key details and you need to restate the facts without sounding defensive.",
    scenario_vi:
      "Người nghe bỏ sót chi tiết quan trọng và bạn cần nhắc lại факт mà không nghe phòng thủ.",
    canadaContext:
      "Useful for Canadian billing desks, housing offices, and school support teams.",
    checklistPack: {
      finalStabilityPrompt_en:
        "Restate the facts, keep the boundary calm, and check understanding.",
      finalStabilityPrompt_vi:
        "Nhắc lại факт, giữ ranh giới bình tĩnh và kiểm tra mức hiểu.",
      checklistLine: {
        pa: "ਮੇਰਾ ਮਤਲਬ ਇਹ ਸੀ: ਤਾਰੀਖ, ਸਮਾਂ, ਅਤੇ ਠੀਕ ਕੰਮ।",
        romanization:
          "mera matlab ih si: tarikh, sama, ate thik kamm.",
        en: "I meant the date, the time, and the correct task.",
        vi: "Ý tôi là ngày, giờ và nhiệm vụ đúng.",
      },
      checklistSignals_en: [
        "Restates only the facts",
        "Avoids defensiveness",
        "Confirms the details",
      ],
      checklistSignals_vi: [
        "Chỉ nhắc lại факт",
        "Tránh phòng thủ",
        "Xác nhận chi tiết",
      ],
    },
    commonTraps: [
      {
        trap_en: "Adding extra argument instead of clear facts.",
        trap_vi: "Thêm tranh luận thay vì факт rõ.",
        repair: {
          pa: "ਮੈਂ ਸਿਰਫ਼ ਵੇਰਵੇ ਸਾਫ਼ ਕਰ ਰਿਹਾ ਹਾਂ।",
          romanization: "main sirf vereve saf kar riha han.",
          en: "I am only clarifying the details.",
          vi: "Tôi chỉ đang làm rõ chi tiết.",
        },
      },
    ],
    exportReadiness_en:
      "language practice only, not legal or financial advice. Final stability is ready when the facts are restated without escalation.",
    exportReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Sẵn sàng cuối khi факт được nhắc lại mà không leo thang.",
    finalQuality_en:
      "Final quality checks facts, boundary setting, checklist order, and review-safe output.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh факт, đặt ranh giới, thứ tự danh sách và đầu ra an toàn cho review.",
  },
  {
    id: "b1-service-checklist-ask-next-steps",
    level: "B1",
    focus: "ask_next_steps",
    title_en: "Ask for the next step",
    title_vi: "Hỏi bước tiếp theo",
    scenario_en:
      "You understand the issue and need to ask what you should do next.",
    scenario_vi:
      "Bạn đã hiểu vấn đề và cần hỏi mình nên làm gì tiếp theo.",
    canadaContext:
      "Useful for Canadian clinic desks, service centers, and municipal offices.",
    checklistPack: {
      finalStabilityPrompt_en:
        "Ask for the next step, the deadline, and whether you should write it down.",
      finalStabilityPrompt_vi:
        "Hỏi bước tiếp theo, hạn chót và liệu bạn có nên ghi lại hay không.",
      checklistLine: {
        pa: "ਹੁਣ ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ, ਅਤੇ ਕੀ ਮੈਂ ਇਹ ਲਿਖ ਲਵਾਂ?",
        romanization:
          "hun agla kadam ki hai, ate ki main ih likh lavan?",
        en: "What is the next step now, and should I write it down?",
        vi: "Bây giờ bước tiếp theo là gì, và tôi có nên ghi lại không?",
      },
      checklistSignals_en: [
        "Asks for action",
        "Checks the deadline",
        "Requests a written note",
      ],
      checklistSignals_vi: [
        "Hỏi hành động",
        "Kiểm tra hạn chót",
        "Yêu cầu ghi chú",
      ],
    },
    commonTraps: [
      {
        trap_en: "Leaving without a clear action item.",
        trap_vi: "Rời đi mà không có mục hành động rõ.",
        repair: {
          pa: "ਮੈਨੂੰ ਪੱਕਾ ਕਦਮ ਚਾਹੀਦਾ ਹੈ।",
          romanization: "mainu pakka kadam chahida hai.",
          en: "I need a clear step.",
          vi: "Tôi cần một bước rõ ràng.",
        },
      },
    ],
    exportReadiness_en:
      "Language practice only, not medical advice. Shahmukhi is awareness only, not a full course. Final stability is ready when the next step is concrete and checkable.",
    exportReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ. Sẵn sàng cuối khi bước tiếp theo cụ thể và có thể kiểm tra.",
    finalQuality_en:
      "Final quality checks next-step clarity, checklist discipline, and boundary-safe wording.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh độ rõ bước tiếp theo, kỷ luật danh sách và cách nói an toàn về ranh giới.",
  },
  {
    id: "b1-service-checklist-polite-follow-up",
    level: "B1",
    focus: "polite_follow_up",
    title_en: "Follow up politely",
    title_vi: "Theo dõi một cách lịch sự",
    scenario_en:
      "A request was missed and you need to follow up without sounding demanding.",
    scenario_vi:
      "Một yêu cầu bị bỏ sót và bạn cần theo dõi mà không nghe đòi hỏi.",
    canadaContext:
      "Useful for Canadian email, text, and portal follow-ups with offices or landlords.",
    checklistPack: {
      finalStabilityPrompt_en:
        "Mention the original request, keep the tone calm, and ask for an update.",
      finalStabilityPrompt_vi:
        "Nhắc yêu cầu ban đầu, giữ giọng bình tĩnh và hỏi cập nhật.",
      checklistLine: {
        pa: "ਮੈਂ ਆਪਣੀ ਪਿਛਲੀ ਬੇਨਤੀ ਬਾਰੇ ਫਿਰ ਪੁੱਛ ਰਿਹਾ ਹਾਂ। ਕੀ ਕੋਈ ਅਪਡੇਟ ਹੈ?",
        romanization:
          "main apni pichhli benti bare phir puchh riha han. ki koi update hai?",
        en: "I am following up on my previous request. Is there any update?",
        vi: "Tôi đang theo dõi yêu cầu trước đó. Có cập nhật gì không?",
      },
      checklistSignals_en: [
        "Refers to the earlier request",
        "Stays polite",
        "Asks for an update",
      ],
      checklistSignals_vi: [
        "Nhắc yêu cầu trước",
        "Giữ lịch sự",
        "Hỏi cập nhật",
      ],
    },
    commonTraps: [
      {
        trap_en: "Sounding impatient before stating the request.",
        trap_vi: "Nghe thiếu kiên nhẫn trước khi nêu yêu cầu.",
        repair: {
          pa: "ਮੈਂ ਸਿਰਫ਼ ਅਪਡੇਟ ਚਾਹੁੰਦਾ ਹਾਂ, ਜੀ।",
          romanization: "main sirf update chahunda han, ji.",
          en: "I only want an update, please.",
          vi: "Tôi chỉ muốn một cập nhật thôi ạ.",
        },
      },
    ],
    exportReadiness_en:
      "language practice only, not legal or financial advice. Final stability is ready when the follow-up stays calm, brief, and measurable.",
    exportReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Sẵn sàng cuối khi theo dõi bình tĩnh, ngắn và đo được.",
    finalQuality_en:
      "Final quality checks polite follow-up, checklist order, regression-safe phrasing, and Gurmukhi-first output.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh theo dõi lịch sự, thứ tự danh sách, cách nói chống lỗi hồi quy và đầu ra Gurmukhi là chính.",
  },
  {
    id: "b1-service-checklist-repair-misunderstanding",
    level: "B1",
    focus: "repair_misunderstanding",
    title_en: "Repair a misunderstanding",
    title_vi: "Sửa một hiểu lầm",
    scenario_en:
      "The other person got the wrong idea and you need to repair the conversation calmly.",
    scenario_vi:
      "Người kia hiểu sai ý và bạn cần sửa cuộc trò chuyện một cách bình tĩnh.",
    canadaContext:
      "Useful for Canadian service desks, workplaces, and community programs.",
    checklistPack: {
      finalStabilityPrompt_en:
        "Acknowledge the misunderstanding, restate the facts, and reset the tone.",
      finalStabilityPrompt_vi:
        "Thừa nhận hiểu lầm, nhắc lại факт và đặt lại giọng nói.",
      checklistLine: {
        pa: "ਸ਼ਾਇਦ ਗੱਲ ਸਾਫ਼ ਨਹੀਂ ਸੀ। ਮੈਂ ਫਿਰ ਤੋਂ ਦੱਸਦਾ ਹਾਂ।",
        romanization:
          "shayad gall saf nahin si. main phir ton dassda han.",
        en: "Maybe the message was not clear. I will explain again.",
        vi: "Có lẽ thông điệp chưa rõ. Tôi sẽ giải thích lại.",
      },
      checklistSignals_en: [
        "Acknowledges the misunderstanding",
        "Restarts calmly",
        "Keeps the tone neutral",
      ],
      checklistSignals_vi: [
        "Thừa nhận hiểu lầm",
        "Khởi động lại bình tĩnh",
        "Giữ giọng trung lập",
      ],
    },
    commonTraps: [
      {
        trap_en: "Arguing about blame instead of repairing the exchange.",
        trap_vi: "Tranh luận về lỗi thay vì sửa cuộc trao đổi.",
        repair: {
          pa: "ਆਓ ਮੁੜ ਤੋਂ ਸ਼ੁਰੂ ਕਰੀਏ।",
          romanization: "ao mudh ton shuru kariye.",
          en: "Let's start again.",
          vi: "Hãy bắt đầu lại.",
        },
      },
    ],
    exportReadiness_en:
      "Language practice only, not medical advice. Native review is deferred. Final stability is ready when the repair is calm and easy to reuse.",
    exportReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Đánh giá bản ngữ được hoãn lại. Sẵn sàng cuối khi phần sửa bình tĩnh và dễ tái dùng.",
    finalQuality_en:
      "Final quality checks misunderstanding repair, boundary reset, checklist flow, and quality review readiness.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh sửa hiểu lầm, đặt lại ranh giới, luồng danh sách và sẵn sàng cho rà soát chất lượng.",
  },
  {
    id: "b1-service-checklist-workplace-conversation",
    level: "B1",
    focus: "workplace_conversation",
    title_en: "Recover a workplace conversation",
    title_vi: "Phục hồi một cuộc trò chuyện nơi làm việc",
    scenario_en:
      "A shift, task, or schedule conversation became confusing and you need to recover it politely.",
    scenario_vi:
      "Cuộc trò chuyện về ca làm, nhiệm vụ hoặc lịch bị rối và bạn cần phục hồi lịch sự.",
    canadaContext:
      "Useful for Canadian retail, warehouse, and office workplaces.",
    checklistPack: {
      finalStabilityPrompt_en:
        "Check the task, the time, and who is responsible before ending the conversation.",
      finalStabilityPrompt_vi:
        "Kiểm tra nhiệm vụ, thời gian và ai chịu trách nhiệm trước khi kết thúc.",
      checklistLine: {
        pa: "ਮੈਂ ਸਿਰਫ਼ ਇਹ ਪੱਕਾ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ ਕਿ ਕੰਮ ਅਤੇ ਸਮਾਂ ਠੀਕ ਹਨ।",
        romanization:
          "main sirf ih pakka karna chahunda han ki kamm ate sama thik han.",
        en: "I just want to confirm the task and the time are correct.",
        vi: "Tôi chỉ muốn xác nhận nhiệm vụ và thời gian là đúng.",
      },
      checklistSignals_en: [
        "Confirms the task",
        "Confirms the time",
        "Keeps responsibility clear",
      ],
      checklistSignals_vi: [
        "Xác nhận nhiệm vụ",
        "Xác nhận thời gian",
        "Làm rõ trách nhiệm",
      ],
    },
    commonTraps: [
      {
        trap_en: "Assuming the schedule is correct without checking it.",
        trap_vi: "Cho rằng lịch đúng mà không kiểm tra.",
        repair: {
          pa: "ਕੀ ਅਸੀਂ ਇਕ ਵਾਰ ਫਿਰ ਚੈੱਕ ਕਰ ਸਕਦੇ ਹਾਂ?",
          romanization: "ki asin ik var phir check kar sakde han?",
          en: "Can we check it once more?",
          vi: "Chúng ta có thể kiểm tra lại một lần nữa không?",
        },
      },
    ],
    exportReadiness_en:
      "language practice only, not legal or financial advice. Final stability is ready when the workplace checklist is precise and low-friction.",
    exportReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Sẵn sàng cuối khi danh sách ở nơi làm việc chính xác và ít ma sát.",
    finalQuality_en:
      "Final quality checks workplace clarity, boundary awareness, regression control, and Gurmukhi-first output.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh độ rõ ở nơi làm việc, nhận biết ranh giới, kiểm soát hồi quy và đầu ra Gurmukhi là chính.",
  },
  {
    id: "b1-service-checklist-housing-conversation",
    level: "B1",
    focus: "housing_conversation",
    title_en: "Recover a housing conversation",
    title_vi: "Phục hồi một cuộc trò chuyện về nhà ở",
    scenario_en:
      "A repair or landlord conversation needs a calm follow-up with clear facts.",
    scenario_vi:
      "Cuộc trò chuyện với chủ nhà hoặc về sửa chữa cần theo dõi bình tĩnh với факт rõ.",
    canadaContext:
      "Useful for Canadian rental offices, building managers, and tenant support lines.",
    checklistPack: {
      finalStabilityPrompt_en:
        "State the repair facts, ask for timing, and set a respectful boundary.",
      finalStabilityPrompt_vi:
        "Nêu факт sửa chữa, hỏi thời gian và đặt ranh giới tôn trọng.",
      checklistLine: {
        pa: "ਮੈਂ ਮੁਰੰਮਤ ਬਾਰੇ ਅਪਡੇਟ ਚਾਹੁੰਦਾ ਹਾਂ। ਇਹ ਕਦੋਂ ਹੋਵੇਗੀ?",
        romanization:
          "main murammat bare update chahunda han. ih kadon hovegi?",
        en: "I would like an update on the repair. When will it happen?",
        vi: "Tôi muốn có cập nhật về việc sửa chữa. Khi nào việc này sẽ diễn ra?",
      },
      checklistSignals_en: [
        "Names the repair",
        "Asks for timing",
        "Keeps the boundary respectful",
      ],
      checklistSignals_vi: [
        "Nêu việc sửa chữa",
        "Hỏi thời gian",
        "Giữ ranh giới tôn trọng",
      ],
    },
    commonTraps: [
      {
        trap_en: "Starting with a threat instead of a factual update request.",
        trap_vi: "Bắt đầu bằng đe doạ thay vì yêu cầu cập nhật факт.",
        repair: {
          pa: "ਮੈਨੂੰ ਸਿਰਫ਼ ਸਾਫ਼ ਅਪਡੇਟ ਚਾਹੀਦਾ ਹੈ।",
          romanization: "mainu sirf saf update chahida hai.",
          en: "I only need a clear update.",
          vi: "Tôi chỉ cần một cập nhật rõ ràng.",
        },
      },
    ],
    exportReadiness_en:
      "Language practice only, not medical advice. Language practice only, not legal or financial advice. Final stability is ready when housing follow-up stays calm, factual, and boundary-aware.",
    exportReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Sẵn sàng cuối khi theo dõi nhà ở bình tĩnh, факт và có ranh giới.",
    finalQuality_en:
      "Final quality checks housing follow-up, checklist consistency, boundary control, and review-ready wording.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh theo dõi nhà ở, tính nhất quán của danh sách, kiểm soát ranh giới và cách nói sẵn sàng cho rà soát.",
  },
  {
    id: "b1-service-checklist-school-community-conversation",
    level: "B1",
    focus: "school_community_conversation",
    title_en: "Recover a school or community conversation",
    title_vi: "Phục hồi cuộc trò chuyện ở trường hoặc cộng đồng",
    scenario_en:
      "You need to follow up with a school office or community service in a calm, clear way.",
    scenario_vi:
      "Bạn cần theo dõi với văn phòng trường học hoặc dịch vụ cộng đồng theo cách bình tĩnh, rõ ràng.",
    canadaContext:
      "Useful for Canadian school offices, community centres, and settlement programs.",
    checklistPack: {
      finalStabilityPrompt_en:
        "Keep the follow-up short, respectful, and easy to check.",
      finalStabilityPrompt_vi:
        "Giữ theo dõi ngắn, tôn trọng và dễ kiểm tra.",
      checklistLine: {
        pa: "ਮੈਂ ਆਪਣੇ ਪਿਛਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਅਪਡੇਟ ਲੈਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization:
          "main apne pichhle sunehe bare update laina chahunda han.",
        en: "I would like to get an update about my previous message.",
        vi: "Tôi muốn nhận cập nhật về tin nhắn trước đó của mình.",
      },
      checklistSignals_en: [
        "Refers to the previous message",
        "Stays respectful",
        "Keeps the ask simple",
      ],
      checklistSignals_vi: [
        "Nhắc tin nhắn trước",
        "Giữ tôn trọng",
        "Giữ yêu cầu đơn giản",
      ],
    },
    commonTraps: [
      {
        trap_en: "Making the follow-up too long for a simple update.",
        trap_vi: "Làm theo dõi quá dài cho một cập nhật đơn giản.",
        repair: {
          pa: "ਮੈਂ ਸਿਰਫ਼ ਇੱਕ ਛੋਟਾ ਜਿਹਾ ਅਪਡੇਟ ਚਾਹੁੰਦਾ ਹਾਂ।",
          romanization: "main sirf ik chota jeha update chahunda han.",
          en: "I only want a short update.",
          vi: "Tôi chỉ muốn một cập nhật ngắn.",
        },
      },
    ],
    exportReadiness_en:
      "language practice only, not legal or financial advice. Final stability is ready when school or community follow-up stays short, factual, and calm.",
    exportReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Sẵn sàng cuối khi theo dõi trường học hoặc cộng đồng ngắn, факт và bình tĩnh.",
    finalQuality_en:
      "Final quality checks school/community follow-up, checklist discipline, and regression-safe clarity.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh theo dõi trường học/cộng đồng, kỷ luật danh sách và độ rõ chống lỗi hồi quy.",
  },
  {
    id: "b1-service-checklist-service-conversation",
    level: "B1",
    focus: "service_conversation",
    title_en: "Recover a service conversation",
    title_vi: "Phục hồi cuộc trò chuyện dịch vụ",
    scenario_en:
      "A service call or counter conversation needs a careful recovery after confusion.",
    scenario_vi:
      "Cuộc gọi hoặc cuộc trò chuyện ở quầy dịch vụ cần phục hồi cẩn thận sau nhầm lẫn.",
    canadaContext:
      "Useful for Canadian service desks, billing lines, and customer support chats.",
    checklistPack: {
      finalStabilityPrompt_en:
        "Check the issue, the account detail, and the next step before you end the call.",
      finalStabilityPrompt_vi:
        "Kiểm tra vấn đề, chi tiết tài khoản và bước tiếp theo trước khi kết thúc.",
      checklistLine: {
        pa: "ਮੈਂ ਮੁੱਦਾ ਸਮਝਣਾ ਚਾਹੁੰਦਾ ਹਾਂ ਅਤੇ ਫਿਰ ਅਗਲਾ ਕਦਮ ਜਾਣਨਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization:
          "main mudda samajhna chahunda han ate phir agla kadam jan-na chahunda han.",
        en: "I want to understand the issue and then know the next step.",
        vi: "Tôi muốn hiểu vấn đề rồi biết bước tiếp theo.",
      },
      checklistSignals_en: [
        "Separates issue from next step",
        "Keeps the call moving",
        "Avoids confusion",
      ],
      checklistSignals_vi: [
        "Tách vấn đề khỏi bước tiếp theo",
        "Giữ cuộc gọi tiếp tục",
        "Tránh nhầm lẫn",
      ],
    },
    commonTraps: [
      {
        trap_en: "Ending the call without confirming the next action.",
        trap_vi: "Kết thúc cuộc gọi mà không xác nhận hành động tiếp theo.",
        repair: {
          pa: "ਕੀ ਤੁਸੀਂ ਅਖੀਰ ਵਿੱਚ ਮੁੜ ਦੱਸ ਸਕਦੇ ਹੋ ਕਿ ਮੈਨੂੰ ਕੀ ਕਰਨਾ ਹੈ?",
          romanization:
            "ki tusin akhri vich mudh dass sakde ho ki mainu ki karna hai?",
          en: "Can you repeat at the end what I need to do?",
          vi: "Bạn có thể nhắc lại ở cuối là tôi cần làm gì không?",
        },
      },
    ],
    exportReadiness_en:
      "Language practice only, not medical advice. Shahmukhi is awareness only, not a full course. Native review is deferred. Final stability is ready when the service recovery is reusable, calm, and checkable.",
    exportReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ. Đánh giá bản ngữ được hoãn lại. Sẵn sàng cuối khi phần phục hồi dịch vụ có thể tái dùng, bình tĩnh và kiểm tra được.",
    finalQuality_en:
      "Final quality checks service recovery, checklist discipline, boundary safety, and Gurmukhi-first output.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh phục hồi dịch vụ, kỷ luật danh sách, an toàn ranh giới và đầu ra Gurmukhi là chính.",
  },
];
