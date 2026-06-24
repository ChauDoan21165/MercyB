export type PunjabiB1RepairFollowUpGuardFocus =
  | "clarify_next_steps"
  | "restate_issue"
  | "repair_misunderstanding"
  | "follow_up_polite"
  | "workplace_conversation"
  | "housing_conversation"
  | "school_community_conversation"
  | "service_conversation"
  | "register_mistake_repair";

export type PunjabiRepairFollowUpGuardLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiRepairFollowUpGuardTrap = {
  trap_en: string;
  trap_vi: string;
  guard: PunjabiRepairFollowUpGuardLine;
};

export type PunjabiRepairFollowUpGuardPack = {
  finalSafetyPrompt_en: string;
  finalSafetyPrompt_vi: string;
  guardLine: PunjabiRepairFollowUpGuardLine;
  guardSignals_en: string[];
  guardSignals_vi: string[];
};

export type PunjabiB1RepairFollowUpGuard = {
  id: string;
  level: "B1";
  focus: PunjabiB1RepairFollowUpGuardFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  guardPack: PunjabiRepairFollowUpGuardPack;
  commonTraps: PunjabiRepairFollowUpGuardTrap[];
  exportReadiness_en: string;
  exportReadiness_vi: string;
  finalQuality_en: string;
  finalQuality_vi: string;
};

export const punjabiB1RepairFollowUpGuards: PunjabiB1RepairFollowUpGuard[] = [
  {
    id: "b1-guard-clarify-next-step",
    level: "B1",
    focus: "clarify_next_steps",
    title_en: "Clarify the next step",
    title_vi: "Làm rõ bước tiếp theo",
    scenario_en:
      "You got an unclear instruction and need to ask what happens next.",
    scenario_vi:
      "Bạn nhận hướng dẫn không rõ và cần hỏi điều gì sẽ xảy ra tiếp theo.",
    canadaContext:
      "Useful for Canadian service counters, clinics, and settlement offices.",
    guardPack: {
      finalSafetyPrompt_en:
        "Ask for the next step, deadline, and a written note.",
      finalSafetyPrompt_vi:
        "Hỏi bước tiếp theo, hạn chót và ghi chú bằng văn bản.",
      guardLine: {
        pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ, ਅਤੇ ਕੀ ਤੁਸੀਂ ਇਹ ਲਿਖ ਸਕਦੇ ਹੋ?",
        romanization:
          "agla kadam ki hai, ate ki tusin ih likh sakde ho?",
        en: "What is the next step, and can you write this down?",
        vi: "Bước tiếp theo là gì, và bạn có thể viết điều này xuống không?",
      },
      guardSignals_en: [
        "Clarifies action",
        "Requests writing",
        "Keeps the turn open",
      ],
      guardSignals_vi: [
        "Làm rõ hành động",
        "Yêu cầu ghi lại",
        "Giữ lượt nói mở",
      ],
    },
    commonTraps: [
      {
        trap_en: "Nodding without confirming the next step.",
        trap_vi: "Gật đầu mà không xác nhận bước tiếp theo.",
        guard: {
          pa: "ਮੈਨੂੰ ਪੱਕਾ ਕਰਨਾ ਹੈ ਕਿ ਮੈਂ ਠੀਕ ਸਮਝਿਆ ਹੈ।",
          romanization: "mainu pakka karna hai ki main thik samjhia hai.",
          en: "I want to make sure I understood correctly.",
          vi: "Tôi muốn chắc rằng tôi đã hiểu đúng.",
        },
      },
    ],
    exportReadiness_en:
      "Language practice only, not medical advice. Final safety is ready when the learner can recover the next step cleanly.",
    exportReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Sẵn sàng cuối khi người học có thể phục hồi bước tiếp theo rõ ràng.",
    finalQuality_en:
      "Final quality checks next-step clarity, written confirmation, and Gurmukhi-first output.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh bước tiếp theo rõ, xác nhận bằng văn bản và đầu ra Gurmukhi là chính.",
  },
  {
    id: "b1-guard-restate-issue",
    level: "B1",
    focus: "restate_issue",
    title_en: "Restate the issue",
    title_vi: "Nói lại vấn đề",
    scenario_en:
      "A listener misunderstood your problem and you need to restate it plainly.",
    scenario_vi:
      "Người nghe hiểu sai vấn đề của bạn và bạn cần nói lại một cách rõ.",
    canadaContext:
      "Useful for Canadian retail, office, and service conversations.",
    guardPack: {
      finalSafetyPrompt_en:
        "Restate the issue and keep the tone neutral.",
      finalSafetyPrompt_vi:
        "Nói lại vấn đề và giữ giọng trung lập.",
      guardLine: {
        pa: "ਮੇਰਾ ਮਤਲਬ ਇਹ ਸੀ, ਉਹ ਨਹੀਂ।",
        romanization: "mera matlab ih si, oh nahin.",
        en: "I meant this, not that.",
        vi: "Ý tôi là điều này, không phải điều kia.",
      },
      guardSignals_en: [
        "Corrects the meaning",
        "Stays calm",
        "Keeps the topic focused",
      ],
      guardSignals_vi: [
        "Sửa lại ý nghĩa",
        "Giữ bình tĩnh",
        "Giữ chủ đề tập trung",
      ],
    },
    commonTraps: [
      {
        trap_en: "Explaining too much and losing the point.",
        trap_vi: "Giải thích quá nhiều và mất trọng tâm.",
        guard: {
          pa: "ਮੈਂ ਸਿਰਫ਼ ਮੁੱਦਾ ਸਾਫ਼ ਕਰ ਰਿਹਾ ਹਾਂ।",
          romanization: "main sirf mudda saf kar riha han.",
          en: "I am only clarifying the issue.",
          vi: "Tôi chỉ đang làm rõ vấn đề.",
        },
      },
    ],
    exportReadiness_en:
      "language practice only, not legal or financial advice. Final safety is ready when the restatement is short and factual.",
    exportReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Sẵn sàng cuối khi lời nói lại ngắn và факт.",
    finalQuality_en:
      "Final quality checks issue restatement, neutral wording, and clear correction.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh nói lại vấn đề, cách nói trung lập và sửa rõ.",
  },
  {
    id: "b1-guard-repair-misunderstanding",
    level: "B1",
    focus: "repair_misunderstanding",
    title_en: "Repair a misunderstanding",
    title_vi: "Sửa một hiểu lầm",
    scenario_en:
      "The other person misunderstood you and you need to repair the exchange politely.",
    scenario_vi:
      "Người kia hiểu sai bạn và bạn cần sửa cuộc trao đổi một cách lịch sự.",
    canadaContext:
      "Useful for Canadian housing, school, and service conversations.",
    guardPack: {
      finalSafetyPrompt_en:
        "Acknowledge the misunderstanding and restart the topic calmly.",
      finalSafetyPrompt_vi:
        "Thừa nhận hiểu lầm và khởi động lại chủ đề bình tĩnh.",
      guardLine: {
        pa: "ਸ਼ਾਇਦ ਮੈਂ ਸਾਫ਼ ਨਹੀਂ ਬੋਲਿਆ ਸੀ। ਮੈਂ ਫਿਰ ਤੋਂ ਦੱਸਦਾ ਹਾਂ।",
        romanization:
          "shayad main saf nahin bolia si. main phir ton dassda han.",
        en: "Maybe I was not clear. I will explain again.",
        vi: "Có lẽ tôi chưa nói rõ. Tôi sẽ giải thích lại.",
      },
      guardSignals_en: [
        "Acknowledges the gap",
        "Takes responsibility for clarity",
        "Restarts smoothly",
      ],
      guardSignals_vi: [
        "Thừa nhận khoảng thiếu",
        "Nhận trách nhiệm về độ rõ",
        "Khởi động lại mượt",
      ],
    },
    commonTraps: [
      {
        trap_en: "Arguing about who misunderstood instead of repairing.",
        trap_vi: "Cãi nhau về ai hiểu sai thay vì sửa.",
        guard: {
          pa: "ਆਓ ਮੁੜ ਤੋਂ ਸ਼ੁਰੂ ਕਰੀਏ।",
          romanization: "ao mudh ton shuru kariye.",
          en: "Let's start again.",
          vi: "Hãy bắt đầu lại.",
        },
      },
    ],
    exportReadiness_en:
      "Final safety is ready when the exchange is reset without blame.",
    exportReadiness_vi:
      "Sẵn sàng cuối khi cuộc trao đổi được đặt lại mà không đổ lỗi.",
    finalQuality_en:
      "Final quality checks misunderstanding repair, calm restart, and Gurmukhi-first output.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh sửa hiểu lầm, khởi động lại bình tĩnh và đầu ra Gurmukhi là chính.",
  },
  {
    id: "b1-guard-follow-up-polite",
    level: "B1",
    focus: "follow_up_polite",
    title_en: "Follow up politely",
    title_vi: "Theo dõi lịch sự",
    scenario_en:
      "You need to follow up on a missed message or appointment without sounding pushy.",
    scenario_vi:
      "Bạn cần theo dõi một tin nhắn hoặc cuộc hẹn bị lỡ mà không nghe thúc ép.",
    canadaContext:
      "Useful for Canadian email, portal, and text follow-ups.",
    guardPack: {
      finalSafetyPrompt_en:
        "Mention the original item and ask for an update politely.",
      finalSafetyPrompt_vi:
        "Nhắc mục ban đầu và hỏi cập nhật một cách lịch sự.",
      guardLine: {
        pa: "ਮੈਂ ਆਪਣੀ ਪਿਛਲੀ ਬੇਨਤੀ ਬਾਰੇ ਪੁੱਛ ਰਿਹਾ ਹਾਂ। ਕੀ ਕੋਈ ਅਪਡੇਟ ਹੈ?",
        romanization:
          "main apni pichhli benti bare puchh riha han. ki koi update hai?",
        en: "I am asking about my previous request. Is there any update?",
        vi: "Tôi đang hỏi về yêu cầu trước đó. Có cập nhật gì không?",
      },
      guardSignals_en: [
        "Names the earlier request",
        "Asks for status",
        "Keeps tone respectful",
      ],
      guardSignals_vi: [
        "Nêu yêu cầu trước",
        "Hỏi tình trạng",
        "Giữ giọng tôn trọng",
      ],
    },
    commonTraps: [
      {
        trap_en: "Sending a message that only says answer me.",
        trap_vi: "Gửi tin nhắn chỉ nói trả lời tôi.",
        guard: {
          pa: "ਮੈਂ ਸਿਰਫ਼ ਅਪਡੇਟ ਚਾਹੁੰਦਾ ਹਾਂ।",
          romanization: "main sirf update chahunda han.",
          en: "I only want an update.",
          vi: "Tôi chỉ muốn một bản cập nhật.",
        },
      },
    ],
    exportReadiness_en:
      "Language practice only, not legal or financial advice. Final safety is ready when the follow-up is specific and courteous.",
    exportReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Sẵn sàng cuối khi theo dõi cụ thể và lịch sự.",
    finalQuality_en:
      "Final quality checks polite follow-up, concise status request, and export readiness.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh theo dõi lịch sự, yêu cầu tình trạng ngắn gọn và sẵn sàng xuất.",
  },
  {
    id: "b1-guard-workplace-conversation",
    level: "B1",
    focus: "workplace_conversation",
    title_en: "Continue a workplace conversation",
    title_vi: "Tiếp tục cuộc trò chuyện nơi làm việc",
    scenario_en:
      "A work instruction was interrupted and you need to continue it clearly.",
    scenario_vi:
      "Một hướng dẫn công việc bị ngắt và bạn cần tiếp tục nó rõ ràng.",
    canadaContext:
      "Useful for Canadian retail, warehouse, office, and food-service shifts.",
    guardPack: {
      finalSafetyPrompt_en:
        "Resume the instruction and keep the work thread intact.",
      finalSafetyPrompt_vi:
        "Tiếp tục hướng dẫn và giữ mạch công việc nguyên vẹn.",
      guardLine: {
        pa: "ਹੁਣ ਅਗਲਾ ਹਿੱਸਾ ਇਹ ਹੈ।",
        romanization: "hun agla hissa ih hai.",
        en: "The next part is this.",
        vi: "Phần tiếp theo là thế này.",
      },
      guardSignals_en: [
        "Resumes the task",
        "Keeps the thread open",
        "Stays practical",
      ],
      guardSignals_vi: [
        "Tiếp tục nhiệm vụ",
        "Giữ mạch mở",
        "Mang tính thực tế",
      ],
    },
    commonTraps: [
      {
        trap_en: "Starting from scratch after every interruption.",
        trap_vi: "Bắt đầu lại từ đầu sau mọi lần ngắt.",
        guard: {
          pa: "ਮੈਂ ਜਿੱਥੇ ਰੁਕਿਆ ਸੀ, ਉੱਥੋਂ ਜਾਰੀ ਕਰਦਾ ਹਾਂ।",
          romanization: "main jithe rukia si, uthon jari karda han.",
          en: "I will continue from where I stopped.",
          vi: "Tôi sẽ tiếp tục từ chỗ đã dừng.",
        },
      },
    ],
    exportReadiness_en:
      "Final safety is ready when the continuation keeps the workplace flow clear.",
    exportReadiness_vi:
      "Sẵn sàng cuối khi phần tiếp tục giữ luồng công việc rõ.",
    finalQuality_en:
      "Final quality checks workplace continuation, sequencing, and clear handoff language.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh tiếp tục nơi làm việc, trình tự và ngôn ngữ chuyển giao rõ.",
  },
  {
    id: "b1-guard-housing-conversation",
    level: "B1",
    focus: "housing_conversation",
    title_en: "Continue a housing conversation",
    title_vi: "Tiếp tục cuộc trò chuyện nhà ở",
    scenario_en:
      "A repair or housing question is unresolved and you need to keep the conversation going.",
    scenario_vi:
      "Một câu hỏi về sửa chữa hoặc nhà ở chưa được giải quyết và bạn cần tiếp tục cuộc trò chuyện.",
    canadaContext:
      "Useful for Canadian tenant and building-management conversations.",
    guardPack: {
      finalSafetyPrompt_en:
        "Ask for the update and keep the repair request open.",
      finalSafetyPrompt_vi:
        "Hỏi cập nhật và giữ yêu cầu sửa chữa mở.",
      guardLine: {
        pa: "ਮੈਨੂੰ ਹਾਲੇ ਅਪਡੇਟ ਨਹੀਂ ਮਿਲੀ।",
        romanization: "mainu hale update nahin mili.",
        en: "I have not received an update yet.",
        vi: "Tôi هنوز chưa nhận được cập nhật.",
      },
      guardSignals_en: [
        "States the missing update",
        "Keeps the issue factual",
        "Invites a reply",
      ],
      guardSignals_vi: [
        "Nêu thiếu cập nhật",
        "Giữ vấn đề theo факт",
        "Mời phản hồi",
      ],
    },
    commonTraps: [
      {
        trap_en: "Threatening before asking for the status.",
        trap_vi: "Dọa trước khi hỏi tình trạng.",
        guard: {
          pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਅਪਡੇਟ ਦਿਓ।",
          romanization: "kirpa karke mainu update dio.",
          en: "Please give me an update.",
          vi: "Vui lòng cho tôi biết cập nhật.",
        },
      },
    ],
    exportReadiness_en:
      "Language practice only, not medical advice. Final safety is ready when the housing update stays calm and precise.",
    exportReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Sẵn sàng cuối khi cập nhật nhà ở bình tĩnh và chính xác.",
    finalQuality_en:
      "Final quality checks housing continuation, timing, and respectful follow-up.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh tiếp tục nhà ở, thời gian và theo dõi tôn trọng.",
  },
  {
    id: "b1-guard-school-community-conversation",
    level: "B1",
    focus: "school_community_conversation",
    title_en: "Continue a school or community conversation",
    title_vi: "Tiếp tục cuộc trò chuyện trường hoặc cộng đồng",
    scenario_en:
      "A school or community reply was incomplete and you need to ask again politely.",
    scenario_vi:
      "Phản hồi từ trường hoặc cộng đồng chưa đầy đủ và bạn cần hỏi lại lịch sự.",
    canadaContext:
      "Useful for Canadian schools, daycare, libraries, and community classes.",
    guardPack: {
      finalSafetyPrompt_en:
        "Ask for the missing detail and keep the thread respectful.",
      finalSafetyPrompt_vi:
        "Hỏi chi tiết còn thiếu và giữ mạch tôn trọng.",
      guardLine: {
        pa: "ਮੈਨੂੰ ਇੱਕ ਹੋਰ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ।",
        romanization: "mainu ikk hor jankari chahidi hai.",
        en: "I need one more piece of information.",
        vi: "Tôi cần thêm một thông tin nữa.",
      },
      guardSignals_en: [
        "Requests the missing detail",
        "Keeps the thread open",
        "Remains courteous",
      ],
      guardSignals_vi: [
        "Yêu cầu chi tiết còn thiếu",
        "Giữ mạch mở",
        "Vẫn lịch sự",
      ],
    },
    commonTraps: [
      {
        trap_en: "Repeating the same question with frustration.",
        trap_vi: "Lặp lại cùng một câu hỏi với sự bực bội.",
        guard: {
          pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਮੁੜ ਸਮਝਾ ਸਕਦੇ ਹੋ?",
          romanization: "ki tusin ih mudh samjha sakde ho?",
          en: "Can you explain this again?",
          vi: "Bạn có thể giải thích lại không?",
        },
      },
    ],
    exportReadiness_en:
      "Final safety is ready when the conversation continues without friction.",
    exportReadiness_vi:
      "Sẵn sàng cuối khi cuộc trò chuyện tiếp tục không có ma sát.",
    finalQuality_en:
      "Final quality checks school/community continuation, missing detail, and polite repetition.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh tiếp tục trường/cộng đồng, chi tiết còn thiếu và lặp lại lịch sự.",
  },
  {
    id: "b1-guard-service-conversation",
    level: "B1",
    focus: "service_conversation",
    title_en: "Continue a service conversation",
    title_vi: "Tiếp tục cuộc trò chuyện dịch vụ",
    scenario_en:
      "A billing or account answer was incomplete and you need to continue the service conversation.",
    scenario_vi:
      "Câu trả lời về hóa đơn hoặc tài khoản chưa đầy đủ và bạn cần tiếp tục cuộc trò chuyện dịch vụ.",
    canadaContext:
      "Useful for Canadian phone, internet, billing, and support desks.",
    guardPack: {
      finalSafetyPrompt_en:
        "Ask the service desk to continue the explanation.",
      finalSafetyPrompt_vi:
        "Yêu cầu quầy dịch vụ tiếp tục giải thích.",
      guardLine: {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਜਾਰੀ ਰੱਖੋ।",
        romanization: "kirpa karke jari rakho.",
        en: "Please continue.",
        vi: "Vui lòng tiếp tục.",
      },
      guardSignals_en: [
        "Keeps the service thread open",
        "Signals a missing detail",
        "Stays polite",
      ],
      guardSignals_vi: [
        "Giữ mạch dịch vụ mở",
        "Báo thiếu chi tiết",
        "Giữ lịch sự",
      ],
    },
    commonTraps: [
      {
        trap_en: "Ending the conversation before the issue is clear.",
        trap_vi: "Kết thúc cuộc trò chuyện trước khi vấn đề rõ.",
        guard: {
          pa: "ਮੈਨੂੰ ਹੋਰ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ।",
          romanization: "mainu hor jankari chahidi hai.",
          en: "I need more information.",
          vi: "Tôi cần thêm thông tin.",
        },
      },
    ],
    exportReadiness_en:
      "Language practice only, not legal or financial advice. Final safety is ready when the service thread stays open and clear.",
    exportReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Sẵn sàng cuối khi mạch dịch vụ mở và rõ.",
    finalQuality_en:
      "Final quality checks service continuation, missing detail, and polite reopening of the turn.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh tiếp tục dịch vụ, chi tiết còn thiếu và mở lại lượt nói lịch sự.",
  },
  {
    id: "b1-guard-register-repair",
    level: "B1",
    focus: "register_mistake_repair",
    title_en: "Repair a register mistake",
    title_vi: "Sửa lỗi mức lịch sự",
    scenario_en:
      "Your first sentence sounded too direct, and you need to soften it for a front desk.",
    scenario_vi:
      "Câu đầu tiên của bạn nghe quá trực tiếp và bạn cần làm mềm nó ở quầy.",
    canadaContext:
      "Useful for Canadian libraries, offices, and service counters; Shahmukhi is awareness only, not a full course.",
    guardPack: {
      finalSafetyPrompt_en:
        "Rewrite the request with polite register and continue the interaction.",
      finalSafetyPrompt_vi:
        "Viết lại yêu cầu bằng mức lịch sự và tiếp tục tương tác.",
      guardLine: {
        pa: "ਮਾਫ ਕਰਨਾ ਜੀ, ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?",
        romanization: "maf karna ji, ki tusin meri madad kar sakde ho?",
        en: "Sorry, can you help me?",
        vi: "Xin lỗi ạ, bạn có thể giúp tôi không?",
      },
      guardSignals_en: [
        "Softens the request",
        "Uses polite register",
        "Keeps the conversation open",
      ],
      guardSignals_vi: [
        "Làm mềm yêu cầu",
        "Dùng mức lịch sự",
        "Giữ cuộc trò chuyện mở",
      ],
    },
    commonTraps: [
      {
        trap_en: "Keeping the command form instead of softening it.",
        trap_vi: "Giữ dạng mệnh lệnh thay vì làm mềm nó.",
        guard: {
          pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੀ ਮਦਦ ਕਰ ਦਿਓ ਜੀ।",
          romanization: "kirpa karke meri madad kar dio ji.",
          en: "Please help me.",
          vi: "Vui lòng giúp tôi ạ.",
        },
      },
    ],
    exportReadiness_en:
      "Final safety is ready when the register repair lowers pressure and keeps respect.",
    exportReadiness_vi:
      "Sẵn sàng cuối khi sửa mức lịch sự làm mềm áp lực và giữ tôn trọng.",
    finalQuality_en:
      "Final quality checks register repair, direct-to-polite conversion, Gurmukhi-first output, and Native review is deferred.",
    finalQuality_vi:
      "Kiểm tra chất lượng cuối xác minh sửa mức lịch sự, chuyển từ trực tiếp sang nhã nhặn và đầu ra Gurmukhi là chính.",
  },
];
