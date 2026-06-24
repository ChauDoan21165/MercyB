// src/languages/punjabi/issueResolutionB1.ts
//
// Punjabi B1 issue-resolution pack for Vietnamese-speaking and English-
// speaking learners. Gurmukhi is primary; romanization is a support bridge.
// Shahmukhi is mentioned only for awareness, not taught as a full course.
//
// Native review is deferred; this module makes no native-review claim.

export type PunjabiB1IssueResolutionFocus =
  | "explain_problem"
  | "describe_happened"
  | "ask_options"
  | "clarify_next_step"
  | "polite_follow_up"
  | "workplace_resolution"
  | "housing_school_resolution"
  | "service_readiness_review";

export type PunjabiIssueResolutionLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiIssueResolutionTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiIssueResolutionLine;
};

export type PunjabiIssueResolutionNavigation = {
  ifResolved_en: string;
  ifResolved_vi: string;
  ifStuck_en: string;
  ifStuck_vi: string;
  remediation_en: string;
  remediation_vi: string;
};

export type PunjabiB1IssueResolutionCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1IssueResolutionFocus;
  title_en: string;
  title_vi: string;
  situation_en: string;
  situation_vi: string;
  canadaContext: string;
  resolutionGoal_en: string;
  resolutionGoal_vi: string;
  steps_en: string[];
  steps_vi: string[];
  usefulLanguage: PunjabiIssueResolutionLine[];
  modelResolution: PunjabiIssueResolutionLine;
  commonTraps: PunjabiIssueResolutionTrap[];
  navigation: PunjabiIssueResolutionNavigation;
};

export const punjabiB1IssueResolutionPack: PunjabiB1IssueResolutionCard[] = [
  {
    id: "pa-b1-issue-01-explain-problem",
    level: "B1",
    focus: "explain_problem",
    title_en: "Explain the problem clearly",
    title_vi: "Giải thích vấn đề rõ ràng",
    situation_en: "Your access card does not open a community centre door.",
    situation_vi: "Thẻ ra vào của bạn không mở được cửa trung tâm cộng đồng.",
    canadaContext: "Useful at libraries, recreation centres, settlement agencies, and building offices in Canada.",
    resolutionGoal_en: "Name the problem, explain the impact, and ask where to get help.",
    resolutionGoal_vi: "Nêu vấn đề, giải thích ảnh hưởng và hỏi nhận trợ giúp ở đâu.",
    steps_en: ["State what is not working.", "Say the effect.", "Ask for the next help point."],
    steps_vi: ["Nêu thứ không hoạt động.", "Nói ảnh hưởng.", "Hỏi điểm trợ giúp tiếp theo."],
    usefulLanguage: [
      { pa: "ਮੇਰਾ ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "mera card kam nahin kar riha.", en: "My card is not working.", vi: "Thẻ của tôi không hoạt động." },
      { pa: "ਦਰਵਾਜ਼ਾ ਨਹੀਂ ਖੁੱਲਦਾ।", romanization: "darvaza nahin khulda.", en: "The door does not open.", vi: "Cửa không mở." },
      { pa: "ਮੈਨੂੰ ਮਦਦ ਕਿੱਥੇ ਮਿਲ ਸਕਦੀ ਹੈ?", romanization: "mainu madad kitthe mil sakdi hai?", en: "Where can I get help?", vi: "Tôi có thể nhận trợ giúp ở đâu?" },
    ],
    modelResolution: {
      pa: "ਮੇਰਾ ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ, ਇਸ ਲਈ ਦਰਵਾਜ਼ਾ ਨਹੀਂ ਖੁੱਲਦਾ। ਮੈਨੂੰ ਮਦਦ ਕਿੱਥੇ ਮਿਲ ਸਕਦੀ ਹੈ?",
      romanization: "mera card kam nahin kar riha, is lai darvaza nahin khulda. mainu madad kitthe mil sakdi hai?",
      en: "My card is not working, so the door does not open. Where can I get help?",
      vi: "Thẻ của tôi không hoạt động, nên cửa không mở. Tôi có thể nhận trợ giúp ở đâu?",
    },
    commonTraps: [
      {
        trap_en: "Saying only 'card problem' without effect or request.",
        trap_vi: "Chỉ nói 'vấn đề thẻ' mà không nêu ảnh hưởng hoặc yêu cầu.",
        better: { pa: "ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰਦਾ, ਇਸ ਲਈ ਦਰਵਾਜ਼ਾ ਨਹੀਂ ਖੁੱਲਦਾ।", romanization: "card kam nahin karda, is lai darvaza nahin khulda.", en: "The card does not work, so the door does not open.", vi: "Thẻ không hoạt động, nên cửa không mở." },
      },
    ],
    navigation: {
      ifResolved_en: "Move to asking options once the listener understands the problem.",
      ifResolved_vi: "Chuyển sang hỏi lựa chọn khi người nghe hiểu vấn đề.",
      ifStuck_en: "Return to problem plus impact sentence frames.",
      ifStuck_vi: "Quay lại khung câu vấn đề cộng ảnh hưởng.",
      remediation_en: "Practice one sentence for object, effect, and request.",
      remediation_vi: "Luyện một câu cho đồ vật, ảnh hưởng và yêu cầu.",
    },
  },
  {
    id: "pa-b1-issue-02-describe-happened",
    level: "B1",
    focus: "describe_happened",
    title_en: "Describe what happened",
    title_vi: "Mô tả chuyện đã xảy ra",
    situation_en: "A bus delay caused you to miss an appointment.",
    situation_vi: "Xe buýt trễ khiến bạn lỡ một cuộc hẹn.",
    canadaContext: "Useful for transit, work, school, clinic, and service-counter delay explanations.",
    resolutionGoal_en: "Retell the event in order and connect cause to result.",
    resolutionGoal_vi: "Kể lại sự việc theo thứ tự và nối nguyên nhân với kết quả.",
    steps_en: ["Use first/then.", "State the cause.", "State the result and follow-up action."],
    steps_vi: ["Dùng trước tiên/sau đó.", "Nêu nguyên nhân.", "Nêu kết quả và hành động tiếp theo."],
    usefulLanguage: [
      { pa: "ਪਹਿਲਾਂ ਬੱਸ ਦੇਰ ਨਾਲ ਆਈ।", romanization: "pahilan bus der naal aai.", en: "First the bus came late.", vi: "Trước tiên xe buýt đến muộn." },
      { pa: "ਫਿਰ ਅਗਲੀ ਬੱਸ ਨਿਕਲ ਗਈ।", romanization: "phir agli bus nikal gai.", en: "Then the next bus left.", vi: "Sau đó chuyến xe tiếp theo đã đi." },
      { pa: "ਇਸ ਕਰਕੇ ਮੈਂ ਅਪਾਇੰਟਮੈਂਟ ਲਈ ਦੇਰ ਨਾਲ ਪਹੁੰਚਿਆ।", romanization: "is karke main appointment lai der naal pahunchia.", en: "Because of this I arrived late for the appointment.", vi: "Vì vậy tôi đến muộn cuộc hẹn." },
    ],
    modelResolution: {
      pa: "ਪਹਿਲਾਂ ਬੱਸ ਦੇਰ ਨਾਲ ਆਈ। ਫਿਰ ਅਗਲੀ ਬੱਸ ਨਿਕਲ ਗਈ। ਇਸ ਕਰਕੇ ਮੈਂ ਅਪਾਇੰਟਮੈਂਟ ਲਈ ਦੇਰ ਨਾਲ ਪਹੁੰਚਿਆ ਅਤੇ ਪਹਿਲਾਂ ਹੀ ਸੁਨੇਹਾ ਭੇਜਿਆ।",
      romanization: "pahilan bus der naal aai. phir agli bus nikal gai. is karke main appointment lai der naal pahunchia ate pahilan hi suneha bhejia.",
      en: "First the bus came late. Then the next bus left. Because of this I arrived late for the appointment and had already sent a message.",
      vi: "Trước tiên xe buýt đến muộn. Sau đó chuyến xe tiếp theo đã đi. Vì vậy tôi đến muộn cuộc hẹn và đã nhắn trước.",
    },
    commonTraps: [
      {
        trap_en: "Listing facts without sequence or result.",
        trap_vi: "Liệt kê sự việc mà không có trình tự hoặc kết quả.",
        better: { pa: "ਪਹਿਲਾਂ..., ਫਿਰ..., ਇਸ ਕਰਕੇ...", romanization: "pahilan..., phir..., is karke...", en: "First..., then..., because of this...", vi: "Trước tiên..., sau đó..., vì vậy..." },
      },
    ],
    navigation: {
      ifResolved_en: "Move to clarifying whether the appointment can still happen.",
      ifResolved_vi: "Chuyển sang làm rõ liệu cuộc hẹn vẫn có thể diễn ra không.",
      ifStuck_en: "Review sequence marker drills.",
      ifStuck_vi: "Ôn bài luyện từ nối trình tự.",
      remediation_en: "Retell in three lines: first, then, because of this.",
      remediation_vi: "Kể lại bằng ba dòng: trước tiên, sau đó, vì vậy.",
    },
  },
  {
    id: "pa-b1-issue-03-ask-options",
    level: "B1",
    focus: "ask_options",
    title_en: "Ask for options",
    title_vi: "Hỏi các lựa chọn",
    situation_en: "A service cannot be completed today, so you need another option.",
    situation_vi: "Một dịch vụ không thể hoàn thành hôm nay, nên bạn cần lựa chọn khác.",
    canadaContext: "Useful for service counters, school offices, community programs, and customer support.",
    resolutionGoal_en: "Ask what options are available and choose a practical next step.",
    resolutionGoal_vi: "Hỏi có những lựa chọn nào và chọn bước tiếp theo thực tế.",
    steps_en: ["Ask about options.", "Ask which option is faster or easier.", "Confirm what you should do."],
    steps_vi: ["Hỏi về lựa chọn.", "Hỏi lựa chọn nào nhanh hơn hoặc dễ hơn.", "Xác nhận bạn nên làm gì."],
    usefulLanguage: [
      { pa: "ਮੇਰੇ ਕੋਲ ਹੋਰ ਕਿਹੜੇ ਵਿਕਲਪ ਹਨ?", romanization: "mere kol hor kihre vikalp han?", en: "What other options do I have?", vi: "Tôi còn những lựa chọn nào khác?" },
      { pa: "ਕਿਹੜਾ ਵਿਕਲਪ ਜਲਦੀ ਹੈ?", romanization: "kihra vikalp jaldi hai?", en: "Which option is faster?", vi: "Lựa chọn nào nhanh hơn?" },
      { pa: "ਮੈਂ ਹੁਣ ਕੀ ਕਰਾਂ?", romanization: "main hun ki karan?", en: "What should I do now?", vi: "Bây giờ tôi nên làm gì?" },
    ],
    modelResolution: {
      pa: "ਜੇ ਇਹ ਅੱਜ ਨਹੀਂ ਹੋ ਸਕਦਾ, ਮੇਰੇ ਕੋਲ ਹੋਰ ਕਿਹੜੇ ਵਿਕਲਪ ਹਨ? ਕਿਹੜਾ ਵਿਕਲਪ ਜਲਦੀ ਹੈ, ਅਤੇ ਮੈਂ ਹੁਣ ਕੀ ਕਰਾਂ?",
      romanization: "je eh ajj nahin ho sakda, mere kol hor kihre vikalp han? kihra vikalp jaldi hai, ate main hun ki karan?",
      en: "If this cannot happen today, what other options do I have? Which option is faster, and what should I do now?",
      vi: "Nếu việc này không thể làm hôm nay, tôi còn lựa chọn nào khác? Lựa chọn nào nhanh hơn, và bây giờ tôi nên làm gì?",
    },
    commonTraps: [
      {
        trap_en: "Asking only yes/no and missing possible alternatives.",
        trap_vi: "Chỉ hỏi có/không và bỏ lỡ các phương án khác.",
        better: { pa: "ਹੋਰ ਕਿਹੜੇ ਵਿਕਲਪ ਹਨ?", romanization: "hor kihre vikalp han?", en: "What other options are there?", vi: "Có những lựa chọn nào khác?" },
      },
    ],
    navigation: {
      ifResolved_en: "Move to clarifying the chosen next step.",
      ifResolved_vi: "Chuyển sang làm rõ bước tiếp theo đã chọn.",
      ifStuck_en: "Review option questions with ਕਿਹੜਾ and ਕੀ.",
      ifStuck_vi: "Ôn câu hỏi lựa chọn với ਕਿਹੜਾ và ਕੀ.",
      remediation_en: "Practice asking for two options before choosing one.",
      remediation_vi: "Luyện hỏi hai lựa chọn trước khi chọn một.",
    },
  },
  {
    id: "pa-b1-issue-04-clarify-next-step",
    level: "B1",
    focus: "clarify_next_step",
    title_en: "Clarify the next step",
    title_vi: "Làm rõ bước tiếp theo",
    situation_en: "An office gives a deadline and document instruction quickly. Language support only, not legal or medical advice.",
    situation_vi: "Một văn phòng nói nhanh hạn chót và hướng dẫn giấy tờ. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn pháp lý hoặc y tế.",
    canadaContext: "Useful for school, clinic, settlement, and public-service phone calls.",
    resolutionGoal_en: "Ask for repetition, repeat the detail back, and request confirmation.",
    resolutionGoal_vi: "Xin nhắc lại, lặp lại chi tiết và yêu cầu xác nhận.",
    steps_en: ["Ask them to slow down.", "Confirm date or document.", "Ask for email or text confirmation."],
    steps_vi: ["Xin họ nói chậm hơn.", "Xác nhận ngày hoặc giấy tờ.", "Xin xác nhận qua email hoặc tin nhắn."],
    usefulLanguage: [
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਬਾਰਾ ਕਹੋ।", romanization: "kirpa karke hauli dubara kaho.", en: "Please say it again slowly.", vi: "Vui lòng nói lại chậm hơn." },
      { pa: "ਕੀ ਮਿਤੀ ਸ਼ੁੱਕਰਵਾਰ ਹੈ?", romanization: "ki miti shukkarvaar hai?", en: "Is the date Friday?", vi: "Ngày đó là thứ Sáu phải không?" },
      { pa: "ਕੀ ਤੁਸੀਂ ਪੁਸ਼ਟੀ ਈਮੇਲ ਵਿੱਚ ਭੇਜ ਸਕਦੇ ਹੋ?", romanization: "ki tusin pushti email vich bhej sakde ho?", en: "Can you send confirmation by email?", vi: "Bạn có thể gửi xác nhận qua email không?" },
    ],
    modelResolution: {
      pa: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਬਾਰਾ ਕਹੋ। ਕੀ ਮਿਤੀ ਸ਼ੁੱਕਰਵਾਰ ਹੈ? ਕੀ ਤੁਸੀਂ ਪੁਸ਼ਟੀ ਈਮੇਲ ਵਿੱਚ ਭੇਜ ਸਕਦੇ ਹੋ?",
      romanization: "maaf karna ji, kirpa karke hauli dubara kaho. ki miti shukkarvaar hai? ki tusin pushti email vich bhej sakde ho?",
      en: "Sorry, please say it again slowly. Is the date Friday? Can you send confirmation by email?",
      vi: "Xin lỗi, vui lòng nói lại chậm hơn. Ngày đó là thứ Sáu phải không? Bạn có thể gửi xác nhận qua email không?",
    },
    commonTraps: [
      {
        trap_en: "Pretending to understand a deadline.",
        trap_vi: "Giả vờ hiểu hạn chót.",
        better: { pa: "ਮਿਤੀ ਫਿਰ ਦੱਸੋ ਜੀ।", romanization: "miti phir dasso ji.", en: "Please tell me the date again.", vi: "Vui lòng cho tôi biết lại ngày." },
      },
    ],
    navigation: {
      ifResolved_en: "Move to polite follow-up if the answer is delayed.",
      ifResolved_vi: "Chuyển sang theo dõi lịch sự nếu câu trả lời bị chậm.",
      ifStuck_en: "Review date, time, and document confirmation.",
      ifStuck_vi: "Ôn xác nhận ngày, giờ và giấy tờ.",
      remediation_en: "Repeat one detail back before asking for email confirmation.",
      remediation_vi: "Lặp lại một chi tiết trước khi xin xác nhận qua email.",
    },
  },
  {
    id: "pa-b1-issue-05-polite-follow-up",
    level: "B1",
    focus: "polite_follow_up",
    title_en: "Follow up politely",
    title_vi: "Theo dõi một cách lịch sự",
    situation_en: "You reported a problem last week and have not received an update.",
    situation_vi: "Bạn đã báo một vấn đề tuần trước và chưa nhận được cập nhật.",
    canadaContext: "Useful for maintenance, school, service tickets, community programs, and workplace messages.",
    resolutionGoal_en: "Refer to the earlier report, ask for status, and request an estimated time.",
    resolutionGoal_vi: "Nhắc báo cáo trước đó, hỏi tình trạng và xin thời gian dự kiến.",
    steps_en: ["Mention when you reported it.", "Ask for status.", "Ask for estimated time."],
    steps_vi: ["Nhắc bạn đã báo khi nào.", "Hỏi tình trạng.", "Xin thời gian dự kiến."],
    usefulLanguage: [
      { pa: "ਮੈਂ ਪਿਛਲੇ ਹਫ਼ਤੇ ਇਹ ਸਮੱਸਿਆ ਦੱਸੀ ਸੀ।", romanization: "main pichhle hafte eh samassia dassi si.", en: "I reported this problem last week.", vi: "Tôi đã báo vấn đề này tuần trước." },
      { pa: "ਹੁਣ ਇਸ ਦੀ ਸਥਿਤੀ ਕੀ ਹੈ?", romanization: "hun is di sthiti ki hai?", en: "What is its status now?", vi: "Hiện tình trạng của việc này là gì?" },
      { pa: "ਲਗਭਗ ਕਦੋਂ ਠੀਕ ਹੋਵੇਗਾ?", romanization: "lagbhag kadon theek hovega?", en: "Approximately when will it be fixed?", vi: "Khoảng khi nào sẽ được sửa?" },
    ],
    modelResolution: {
      pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਮੈਂ ਪਿਛਲੇ ਹਫ਼ਤੇ ਇਹ ਸਮੱਸਿਆ ਦੱਸੀ ਸੀ। ਹੁਣ ਇਸ ਦੀ ਸਥਿਤੀ ਕੀ ਹੈ? ਲਗਭਗ ਕਦੋਂ ਠੀਕ ਹੋਵੇਗਾ?",
      romanization: "sat sri akal ji, main pichhle hafte eh samassia dassi si. hun is di sthiti ki hai? lagbhag kadon theek hovega?",
      en: "Hello, I reported this problem last week. What is its status now? Approximately when will it be fixed?",
      vi: "Xin chào, tôi đã báo vấn đề này tuần trước. Hiện tình trạng của việc này là gì? Khoảng khi nào sẽ được sửa?",
    },
    commonTraps: [
      {
        trap_en: "Sounding angry without giving the earlier report date.",
        trap_vi: "Nghe tức giận mà không nêu ngày đã báo trước đó.",
        better: { pa: "ਮੈਂ ਪਿਛਲੇ ਹਫ਼ਤੇ ਇਹ ਦੱਸਿਆ ਸੀ।", romanization: "main pichhle hafte eh dassia si.", en: "I reported this last week.", vi: "Tôi đã báo việc này tuần trước." },
      },
    ],
    navigation: {
      ifResolved_en: "Move to final confirmation and thank the listener.",
      ifResolved_vi: "Chuyển sang xác nhận cuối và cảm ơn người nghe.",
      ifStuck_en: "Review polite time and status questions.",
      ifStuck_vi: "Ôn câu hỏi lịch sự về thời gian và tình trạng.",
      remediation_en: "Use past report plus current status plus estimate.",
      remediation_vi: "Dùng báo cáo trước đó cộng tình trạng hiện tại cộng ước lượng.",
    },
  },
  {
    id: "pa-b1-issue-06-workplace-resolution",
    level: "B1",
    focus: "workplace_resolution",
    title_en: "Resolve a workplace blocker",
    title_vi: "Giải quyết trở ngại nơi làm việc",
    situation_en: "A supply has not arrived, so a task cannot be finished today.",
    situation_vi: "Đồ cung ứng chưa đến, nên một việc không thể hoàn thành hôm nay.",
    canadaContext: "Useful for office, retail, warehouse, restaurant, and community-service jobs.",
    resolutionGoal_en: "Explain the blocker, offer an alternative, and ask priority.",
    resolutionGoal_vi: "Giải thích trở ngại, đưa phương án khác và hỏi ưu tiên.",
    steps_en: ["Name the missing item.", "Explain effect on work.", "Offer another task or ask priority."],
    steps_vi: ["Nêu món còn thiếu.", "Giải thích ảnh hưởng đến công việc.", "Đưa việc khác hoặc hỏi ưu tiên."],
    usefulLanguage: [
      { pa: "ਸਪਲਾਈ ਅਜੇ ਨਹੀਂ ਆਈ।", romanization: "supply aje nahin aai.", en: "The supply has not arrived yet.", vi: "Đồ cung ứng vẫn chưa đến." },
      { pa: "ਇਹ ਕੰਮ ਅੱਜ ਪੂਰਾ ਨਹੀਂ ਹੋ ਸਕਦਾ।", romanization: "eh kam ajj pura nahin ho sakda.", en: "This task cannot be finished today.", vi: "Việc này không thể hoàn thành hôm nay." },
      { pa: "ਤੁਸੀਂ ਕਿਹੜਾ ਕੰਮ ਪਹਿਲਾਂ ਚਾਹੁੰਦੇ ਹੋ?", romanization: "tusin kihra kam pahilan chahunde ho?", en: "Which task do you want first?", vi: "Bạn muốn việc nào trước?" },
    ],
    modelResolution: {
      pa: "ਸਪਲਾਈ ਅਜੇ ਨਹੀਂ ਆਈ, ਇਸ ਲਈ ਇਹ ਕੰਮ ਅੱਜ ਪੂਰਾ ਨਹੀਂ ਹੋ ਸਕਦਾ। ਮੈਂ ਦੂਜਾ ਕੰਮ ਪਹਿਲਾਂ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਸੀਂ ਕਿਹੜਾ ਕੰਮ ਪਹਿਲਾਂ ਚਾਹੁੰਦੇ ਹੋ?",
      romanization: "supply aje nahin aai, is lai eh kam ajj pura nahin ho sakda. main duja kam pahilan kar sakda han. tusin kihra kam pahilan chahunde ho?",
      en: "The supply has not arrived yet, so this task cannot be finished today. I can do another task first. Which task do you want first?",
      vi: "Đồ cung ứng vẫn chưa đến, nên việc này không thể hoàn thành hôm nay. Tôi có thể làm việc khác trước. Bạn muốn việc nào trước?",
    },
    commonTraps: [
      {
        trap_en: "Saying 'I cannot' without a realistic option.",
        trap_vi: "Nói 'tôi không thể' mà không đưa lựa chọn thực tế.",
        better: { pa: "ਮੈਂ ਦੂਜਾ ਕੰਮ ਪਹਿਲਾਂ ਕਰ ਸਕਦਾ ਹਾਂ।", romanization: "main duja kam pahilan kar sakda han.", en: "I can do another task first.", vi: "Tôi có thể làm việc khác trước." },
      },
    ],
    navigation: {
      ifResolved_en: "Move to B2 workplace status reports.",
      ifResolved_vi: "Chuyển sang báo cáo tình trạng công việc B2.",
      ifStuck_en: "Review cause plus alternative sentence frames.",
      ifStuck_vi: "Ôn khung câu nguyên nhân cộng phương án khác.",
      remediation_en: "Practice blocker, impact, option, priority.",
      remediation_vi: "Luyện trở ngại, ảnh hưởng, lựa chọn, ưu tiên.",
    },
  },
  {
    id: "pa-b1-issue-07-housing-school-resolution",
    level: "B1",
    focus: "housing_school_resolution",
    title_en: "Resolve housing or school issues",
    title_vi: "Giải quyết vấn đề nhà ở hoặc trường học",
    situation_en: "A pickup time or repair detail has changed and the office needs clear information.",
    situation_vi: "Giờ đón hoặc chi tiết sửa chữa đã thay đổi và văn phòng cần thông tin rõ.",
    canadaContext: "Useful for school offices, childcare, tenant offices, and building maintenance.",
    resolutionGoal_en: "Identify who or where, state the changed detail, and ask required action.",
    resolutionGoal_vi: "Xác định ai hoặc ở đâu, nêu chi tiết thay đổi và hỏi hành động cần làm.",
    steps_en: ["Identify child, unit, or place.", "State old and new detail.", "Ask if a form or note is needed."],
    steps_vi: ["Xác định con, căn hộ hoặc nơi.", "Nêu chi tiết cũ và mới.", "Hỏi có cần mẫu đơn hoặc ghi chú không."],
    usefulLanguage: [
      { pa: "ਅੱਜ ਪਿਕਅੱਪ ਸਮਾਂ ਬਦਲ ਗਿਆ ਹੈ।", romanization: "ajj pickup sama badal gia hai.", en: "Today the pickup time has changed.", vi: "Hôm nay giờ đón đã thay đổi." },
      { pa: "ਤਿੰਨ ਵਜੇ, ਚਾਰ ਵਜੇ ਨਹੀਂ।", romanization: "tinn vaje, char vaje nahin.", en: "At three, not four.", vi: "Lúc ba giờ, không phải bốn giờ." },
      { pa: "ਕੀ ਕੋਈ ਫਾਰਮ ਭਰਨਾ ਹੈ?", romanization: "ki koi form bharna hai?", en: "Is there a form to fill out?", vi: "Có mẫu đơn nào cần điền không?" },
    ],
    modelResolution: {
      pa: "ਅੱਜ ਮੇਰੇ ਬੱਚੇ ਦਾ ਪਿਕਅੱਪ ਸਮਾਂ ਬਦਲ ਗਿਆ ਹੈ। ਤਿੰਨ ਵਜੇ, ਚਾਰ ਵਜੇ ਨਹੀਂ। ਕੀ ਕੋਈ ਫਾਰਮ ਭਰਨਾ ਹੈ?",
      romanization: "ajj mere bache da pickup sama badal gia hai. tinn vaje, char vaje nahin. ki koi form bharna hai?",
      en: "Today my child's pickup time has changed. At three, not four. Is there a form to fill out?",
      vi: "Hôm nay giờ đón con tôi đã thay đổi. Lúc ba giờ, không phải bốn giờ. Có mẫu đơn nào cần điền không?",
    },
    commonTraps: [
      {
        trap_en: "Leaving out whose schedule or repair changed.",
        trap_vi: "Bỏ sót lịch của ai hoặc phần sửa chữa nào đã thay đổi.",
        better: { pa: "ਮੇਰੇ ਬੱਚੇ ਦਾ ਪਿਕਅੱਪ ਸਮਾਂ ਬਦਲ ਗਿਆ ਹੈ।", romanization: "mere bache da pickup sama badal gia hai.", en: "My child's pickup time has changed.", vi: "Giờ đón con tôi đã thay đổi." },
      },
    ],
    navigation: {
      ifResolved_en: "Move to school/community roleplays or B2 family-service tasks.",
      ifResolved_vi: "Chuyển sang vai diễn trường/cộng đồng hoặc nhiệm vụ dịch vụ gia đình B2.",
      ifStuck_en: "Review who, what changed, and what action is needed.",
      ifStuck_vi: "Ôn ai, điều gì thay đổi và cần hành động gì.",
      remediation_en: "Use old time/new time or place/problem/action frames.",
      remediation_vi: "Dùng khung giờ cũ/giờ mới hoặc nơi/vấn đề/hành động.",
    },
  },
  {
    id: "pa-b1-issue-08-service-readiness-review",
    level: "B1",
    focus: "service_readiness_review",
    title_en: "Review readiness after issue resolution",
    title_vi: "Ôn mức sẵn sàng sau giải quyết vấn đề",
    situation_en: "After a roleplay, you decide whether to review B1 or move toward B2. Shahmukhi is awareness only, not a full course.",
    situation_vi: "Sau vai diễn, bạn quyết định ôn B1 hay chuyển dần sang B2. Shahmukhi chỉ để nhận biết, không phải khóa học đầy đủ.",
    canadaContext: "Useful for tutoring, settlement classes, self-study logs, and progress meetings.",
    resolutionGoal_en: "Name what was resolved, what still needs practice, and the next route.",
    resolutionGoal_vi: "Nêu điều đã giải quyết, điều còn cần luyện và lộ trình tiếp theo.",
    steps_en: ["Name a resolved skill.", "Name one weak point.", "Choose remediation, review, or B2 bridge."],
    steps_vi: ["Nêu một kỹ năng đã xử lý được.", "Nêu một điểm yếu.", "Chọn sửa lỗi, ôn tập hoặc cầu nối B2."],
    usefulLanguage: [
      { pa: "ਮੈਂ ਸਮੱਸਿਆ ਸਮਝਾ ਸਕਦਾ ਹਾਂ।", romanization: "main samassia samjha sakda han.", en: "I can explain a problem.", vi: "Tôi có thể giải thích vấn đề." },
      { pa: "ਮੈਨੂੰ ਵਿਕਲਪ ਪੁੱਛਣ ਦੀ ਹੋਰ ਅਭਿਆਸ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu vikalp puchhan di hor abhyas chahidi hai.", en: "I need more practice asking for options.", vi: "Tôi cần luyện thêm cách hỏi lựa chọn." },
      { pa: "ਮੈਂ ਪਹਿਲਾਂ B1 ਦੁਹਰਾਵਾਂਗਾ, ਫਿਰ B2 ਸ਼ੁਰੂ ਕਰਾਂਗਾ।", romanization: "main pahilan B1 duhravanga, phir B2 shuru karanga.", en: "I will review B1 first, then start B2.", vi: "Tôi sẽ ôn B1 trước, rồi bắt đầu B2." },
    ],
    modelResolution: {
      pa: "ਮੈਂ ਸਮੱਸਿਆ ਸਮਝਾ ਸਕਦਾ ਹਾਂ, ਪਰ ਮੈਨੂੰ ਵਿਕਲਪ ਪੁੱਛਣ ਦੀ ਹੋਰ ਅਭਿਆਸ ਚਾਹੀਦੀ ਹੈ। ਮੈਂ ਪਹਿਲਾਂ B1 ਦੁਹਰਾਵਾਂਗਾ, ਫਿਰ B2 ਸ਼ੁਰੂ ਕਰਾਂਗਾ।",
      romanization: "main samassia samjha sakda han, par mainu vikalp puchhan di hor abhyas chahidi hai. main pahilan B1 duhravanga, phir B2 shuru karanga.",
      en: "I can explain a problem, but I need more practice asking for options. I will review B1 first, then start B2.",
      vi: "Tôi có thể giải thích vấn đề, nhưng cần luyện thêm cách hỏi lựa chọn. Tôi sẽ ôn B1 trước, rồi bắt đầu B2.",
    },
    commonTraps: [
      {
        trap_en: "Saying 'done' without evidence or claiming native review.",
        trap_vi: "Nói 'xong' mà không có bằng chứng hoặc tuyên bố đã có người bản ngữ xem lại.",
        better: { pa: "ਮੈਨੂੰ ਫਾਲੋ-ਅੱਪ ਦੀ ਹੋਰ ਅਭਿਆਸ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu follow-up di hor abhyas chahidi hai.", en: "I need more follow-up practice.", vi: "Tôi cần luyện thêm cách theo dõi." },
      },
    ],
    navigation: {
      ifResolved_en: "Route to B2 bridge tasks or teacher review. Native review is deferred.",
      ifResolved_vi: "Chuyển sang nhiệm vụ cầu nối B2 hoặc giáo viên xem lại. Phần người bản ngữ xem lại được để sau.",
      ifStuck_en: "Return to the weakest issue-resolution card.",
      ifStuck_vi: "Quay lại thẻ giải quyết vấn đề yếu nhất.",
      remediation_en: "Choose one weak function: explain, retell, options, clarify, or follow up.",
      remediation_vi: "Chọn một chức năng yếu: giải thích, kể lại, hỏi lựa chọn, làm rõ hoặc theo dõi.",
    },
  },
];
