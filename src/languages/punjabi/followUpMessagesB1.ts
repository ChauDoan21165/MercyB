// src/languages/punjabi/followUpMessagesB1.ts
//
// Punjabi B1 follow-up messages for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary; romanization is a support bridge. Shahmukhi is
// mentioned only for awareness, not taught as a full course.
//
// Native review is deferred; this module makes no native-review claim.

export type PunjabiB1FollowUpFocus =
  | "workplace_update"
  | "school_next_step"
  | "housing_repair"
  | "clinic_clarification"
  | "public_service_document"
  | "community_program"
  | "thank_and_confirm"
  | "readiness_remediation";

export type PunjabiFollowUpLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiFollowUpTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiFollowUpLine;
};

export type PunjabiFollowUpReview = {
  qualityCheck_en: string[];
  qualityCheck_vi: string[];
  ifClear_en: string;
  ifClear_vi: string;
  remediation_en: string;
  remediation_vi: string;
};

export type PunjabiB1FollowUpMessage = {
  id: string;
  level: "B1";
  focus: PunjabiB1FollowUpFocus;
  title_en: string;
  title_vi: string;
  context_en: string;
  context_vi: string;
  canadaContext: string;
  messagePurpose_en: string;
  messagePurpose_vi: string;
  messageMoves_en: string[];
  messageMoves_vi: string[];
  usefulLanguage: PunjabiFollowUpLine[];
  modelMessage: PunjabiFollowUpLine;
  commonTraps: PunjabiFollowUpTrap[];
  review: PunjabiFollowUpReview;
};

export const punjabiB1FollowUpMessages: PunjabiB1FollowUpMessage[] = [
  {
    id: "pa-b1-follow-01-workplace-update",
    level: "B1",
    focus: "workplace_update",
    title_en: "Follow up on a workplace blocker",
    title_vi: "Theo dõi trở ngại nơi làm việc",
    context_en: "You told your supervisor a supply was missing and need to ask what to do next.",
    context_vi: "Bạn đã nói với quản lý rằng thiếu đồ cung ứng và cần hỏi nên làm gì tiếp.",
    canadaContext: "Useful for office, retail, warehouse, restaurant, and community-service jobs in Canada.",
    messagePurpose_en: "Restate the issue, ask priority, and offer an alternative task.",
    messagePurpose_vi: "Nhắc lại vấn đề, hỏi ưu tiên và đề xuất việc thay thế.",
    messageMoves_en: ["Restate the blocker.", "Say current status.", "Ask for priority or next step."],
    messageMoves_vi: ["Nhắc lại trở ngại.", "Nêu tình trạng hiện tại.", "Hỏi ưu tiên hoặc bước tiếp theo."],
    usefulLanguage: [
      { pa: "ਸਪਲਾਈ ਅਜੇ ਨਹੀਂ ਆਈ।", romanization: "supply aje nahin aai.", en: "The supply has not arrived yet.", vi: "Đồ cung ứng vẫn chưa đến." },
      { pa: "ਮੈਂ ਦੂਜਾ ਕੰਮ ਪਹਿਲਾਂ ਕਰ ਸਕਦਾ ਹਾਂ।", romanization: "main duja kam pahilan kar sakda han.", en: "I can do another task first.", vi: "Tôi có thể làm việc khác trước." },
      { pa: "ਤੁਸੀਂ ਕਿਹੜਾ ਕੰਮ ਪਹਿਲਾਂ ਚਾਹੁੰਦੇ ਹੋ?", romanization: "tusin kihra kam pahilan chahunde ho?", en: "Which task do you want first?", vi: "Bạn muốn việc nào trước?" },
    ],
    modelMessage: {
      pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਸਪਲਾਈ ਅਜੇ ਨਹੀਂ ਆਈ। ਮੈਂ ਦੂਜਾ ਕੰਮ ਪਹਿਲਾਂ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਸੀਂ ਕਿਹੜਾ ਕੰਮ ਪਹਿਲਾਂ ਚਾਹੁੰਦੇ ਹੋ?",
      romanization: "sat sri akal ji, supply aje nahin aai. main duja kam pahilan kar sakda han. tusin kihra kam pahilan chahunde ho?",
      en: "Hello, the supply has not arrived yet. I can do another task first. Which task do you want first?",
      vi: "Xin chào, đồ cung ứng vẫn chưa đến. Tôi có thể làm việc khác trước. Bạn muốn việc nào trước?",
    },
    commonTraps: [
      {
        trap_en: "Only saying the work is impossible without offering an alternative.",
        trap_vi: "Chỉ nói việc không thể làm mà không đưa phương án khác.",
        better: { pa: "ਮੈਂ ਦੂਜਾ ਕੰਮ ਪਹਿਲਾਂ ਕਰ ਸਕਦਾ ਹਾਂ।", romanization: "main duja kam pahilan kar sakda han.", en: "I can do another task first.", vi: "Tôi có thể làm việc khác trước." },
      },
    ],
    review: {
      qualityCheck_en: ["Polite opening.", "Issue is restated.", "Next priority is requested."],
      qualityCheck_vi: ["Mở đầu lịch sự.", "Vấn đề được nhắc lại.", "Có hỏi ưu tiên tiếp theo."],
      ifClear_en: "Route to B2 workplace status updates.",
      ifClear_vi: "Chuyển sang cập nhật tình trạng công việc B2.",
      remediation_en: "Practice blocker plus alternative plus priority question.",
      remediation_vi: "Luyện trở ngại cộng phương án khác cộng câu hỏi ưu tiên.",
    },
  },
  {
    id: "pa-b1-follow-02-school-next-step",
    level: "B1",
    focus: "school_next_step",
    title_en: "Ask a school office for the next step",
    title_vi: "Hỏi văn phòng trường bước tiếp theo",
    context_en: "A pickup time changed and you need to confirm whether a form is required.",
    context_vi: "Giờ đón đã thay đổi và bạn cần xác nhận có cần mẫu đơn không.",
    canadaContext: "Useful for school offices, childcare desks, and parent communication in Canada.",
    messagePurpose_en: "Restate the schedule change and ask if a form or office note is needed.",
    messagePurpose_vi: "Nhắc lại thay đổi lịch và hỏi có cần mẫu đơn hoặc ghi chú văn phòng không.",
    messageMoves_en: ["Identify whose schedule changed.", "State the new time.", "Ask for required action."],
    messageMoves_vi: ["Xác định lịch của ai thay đổi.", "Nêu giờ mới.", "Hỏi hành động cần làm."],
    usefulLanguage: [
      { pa: "ਮੇਰੇ ਬੱਚੇ ਦਾ ਪਿਕਅੱਪ ਸਮਾਂ ਬਦਲ ਗਿਆ ਹੈ।", romanization: "mere bache da pickup sama badal gia hai.", en: "My child's pickup time has changed.", vi: "Giờ đón con tôi đã thay đổi." },
      { pa: "ਅੱਜ ਤਿੰਨ ਵਜੇ ਲੈਣਾ ਹੈ।", romanization: "ajj tinn vaje laina hai.", en: "Today pickup is at three.", vi: "Hôm nay đón lúc ba giờ." },
      { pa: "ਕੀ ਕੋਈ ਫਾਰਮ ਭਰਨਾ ਹੈ?", romanization: "ki koi form bharna hai?", en: "Is there a form to fill out?", vi: "Có mẫu đơn nào cần điền không?" },
    ],
    modelMessage: {
      pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਮੇਰੇ ਬੱਚੇ ਦਾ ਪਿਕਅੱਪ ਸਮਾਂ ਬਦਲ ਗਿਆ ਹੈ। ਅੱਜ ਤਿੰਨ ਵਜੇ ਲੈਣਾ ਹੈ। ਕੀ ਕੋਈ ਫਾਰਮ ਭਰਨਾ ਹੈ?",
      romanization: "sat sri akal ji, mere bache da pickup sama badal gia hai. ajj tinn vaje laina hai. ki koi form bharna hai?",
      en: "Hello, my child's pickup time has changed. Today pickup is at three. Is there a form to fill out?",
      vi: "Xin chào, giờ đón con tôi đã thay đổi. Hôm nay đón lúc ba giờ. Có mẫu đơn nào cần điền không?",
    },
    commonTraps: [
      {
        trap_en: "Leaving out whose pickup time changed.",
        trap_vi: "Bỏ sót giờ đón của ai đã thay đổi.",
        better: { pa: "ਮੇਰੇ ਬੱਚੇ ਦਾ ਪਿਕਅੱਪ ਸਮਾਂ ਬਦਲ ਗਿਆ ਹੈ।", romanization: "mere bache da pickup sama badal gia hai.", en: "My child's pickup time has changed.", vi: "Giờ đón con tôi đã thay đổi." },
      },
    ],
    review: {
      qualityCheck_en: ["Child or schedule is identified.", "New time is clear.", "Required action is requested."],
      qualityCheck_vi: ["Con hoặc lịch được xác định.", "Giờ mới rõ.", "Có hỏi hành động cần làm."],
      ifClear_en: "Route to school/community roleplays.",
      ifClear_vi: "Chuyển sang vai diễn trường học/cộng đồng.",
      remediation_en: "Practice who, changed detail, and next-step question.",
      remediation_vi: "Luyện ai, chi tiết thay đổi và câu hỏi bước tiếp theo.",
    },
  },
  {
    id: "pa-b1-follow-03-housing-repair",
    level: "B1",
    focus: "housing_repair",
    title_en: "Request an update on housing repair",
    title_vi: "Yêu cầu cập nhật về sửa chữa nhà ở",
    context_en: "You reported a leak last week and need a polite update.",
    context_vi: "Bạn đã báo rò nước tuần trước và cần cập nhật lịch sự.",
    canadaContext: "Useful for tenant, building-manager, residence, and maintenance communication in Canada.",
    messagePurpose_en: "Mention the earlier report, restate the issue, and ask for estimated repair time.",
    messagePurpose_vi: "Nhắc báo cáo trước đó, nêu lại vấn đề và hỏi thời gian sửa dự kiến.",
    messageMoves_en: ["Mention when you reported it.", "Restate the issue.", "Ask for estimated timing."],
    messageMoves_vi: ["Nhắc đã báo khi nào.", "Nêu lại vấn đề.", "Hỏi thời gian dự kiến."],
    usefulLanguage: [
      { pa: "ਮੈਂ ਪਿਛਲੇ ਹਫ਼ਤੇ ਲੀਕ ਬਾਰੇ ਦੱਸਿਆ ਸੀ।", romanization: "main pichhle hafte leak bare dassia si.", en: "I reported the leak last week.", vi: "Tôi đã báo chỗ rò tuần trước." },
      { pa: "ਫਰਸ਼ ਅਜੇ ਵੀ ਗਿੱਲਾ ਹੈ।", romanization: "farsh aje vi gilla hai.", en: "The floor is still wet.", vi: "Sàn vẫn còn ướt." },
      { pa: "ਮੁਰੰਮਤ ਲਗਭਗ ਕਦੋਂ ਹੋਵੇਗੀ?", romanization: "murammat lagbhag kadon hovegi?", en: "Approximately when will the repair happen?", vi: "Khoảng khi nào sẽ sửa?" },
    ],
    modelMessage: {
      pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਮੈਂ ਪਿਛਲੇ ਹਫ਼ਤੇ ਲੀਕ ਬਾਰੇ ਦੱਸਿਆ ਸੀ। ਫਰਸ਼ ਅਜੇ ਵੀ ਗਿੱਲਾ ਹੈ। ਮੁਰੰਮਤ ਲਗਭਗ ਕਦੋਂ ਹੋਵੇਗੀ?",
      romanization: "sat sri akal ji, main pichhle hafte leak bare dassia si. farsh aje vi gilla hai. murammat lagbhag kadon hovegi?",
      en: "Hello, I reported the leak last week. The floor is still wet. Approximately when will the repair happen?",
      vi: "Xin chào, tôi đã báo chỗ rò tuần trước. Sàn vẫn còn ướt. Khoảng khi nào sẽ sửa?",
    },
    commonTraps: [
      {
        trap_en: "Following up without saying when the issue was reported.",
        trap_vi: "Theo dõi mà không nói vấn đề đã được báo khi nào.",
        better: { pa: "ਮੈਂ ਪਿਛਲੇ ਹਫ਼ਤੇ ਇਹ ਦੱਸਿਆ ਸੀ।", romanization: "main pichhle hafte eh dassia si.", en: "I reported this last week.", vi: "Tôi đã báo việc này tuần trước." },
      },
    ],
    review: {
      qualityCheck_en: ["Earlier report is referenced.", "Current issue is clear.", "Estimated timing is requested."],
      qualityCheck_vi: ["Có nhắc báo cáo trước.", "Vấn đề hiện tại rõ.", "Có hỏi thời gian dự kiến."],
      ifClear_en: "Route to B2 housing issue resolution.",
      ifClear_vi: "Chuyển sang giải quyết vấn đề nhà ở B2.",
      remediation_en: "Practice earlier date, current status, and timing question.",
      remediation_vi: "Luyện ngày đã báo, tình trạng hiện tại và câu hỏi thời gian.",
    },
  },
  {
    id: "pa-b1-follow-04-clinic-clarification",
    level: "B1",
    focus: "clinic_clarification",
    title_en: "Clarify a clinic appointment message",
    title_vi: "Làm rõ tin nhắn lịch hẹn phòng khám",
    context_en: "A clinic sends appointment information and you need to confirm the time and location. Language support only, not medical advice.",
    context_vi: "Phòng khám gửi thông tin lịch hẹn và bạn cần xác nhận giờ, địa điểm. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn y tế.",
    canadaContext: "Useful for clinic desks, appointment calls, and pharmacy communication as language practice only.",
    messagePurpose_en: "Thank them, confirm time/place, and ask what to bring.",
    messagePurpose_vi: "Cảm ơn, xác nhận giờ/nơi và hỏi cần mang gì.",
    messageMoves_en: ["Thank the clinic.", "Confirm time and place.", "Ask what to bring."],
    messageMoves_vi: ["Cảm ơn phòng khám.", "Xác nhận giờ và nơi.", "Hỏi cần mang gì."],
    usefulLanguage: [
      { pa: "ਸੁਨੇਹੇ ਲਈ ਧੰਨਵਾਦ ਜੀ।", romanization: "sunehe lai dhannvaad ji.", en: "Thank you for the message.", vi: "Cảm ơn vì tin nhắn." },
      { pa: "ਕੀ ਅਪਾਇੰਟਮੈਂਟ ਮੰਗਲਵਾਰ ਦਸ ਵਜੇ ਹੈ?", romanization: "ki appointment mangalvaar dass vaje hai?", en: "Is the appointment Tuesday at ten?", vi: "Lịch hẹn là thứ Ba lúc mười giờ phải không?" },
      { pa: "ਮੈਨੂੰ ਕੀ ਲਿਆਉਣਾ ਚਾਹੀਦਾ ਹੈ?", romanization: "mainu ki liauna chahida hai?", en: "What should I bring?", vi: "Tôi nên mang gì?" },
    ],
    modelMessage: {
      pa: "ਸੁਨੇਹੇ ਲਈ ਧੰਨਵਾਦ ਜੀ। ਕੀ ਅਪਾਇੰਟਮੈਂਟ ਮੰਗਲਵਾਰ ਦਸ ਵਜੇ ਕਮਰਾ ਪੰਜ ਵਿੱਚ ਹੈ? ਮੈਨੂੰ ਕੀ ਲਿਆਉਣਾ ਚਾਹੀਦਾ ਹੈ?",
      romanization: "sunehe lai dhannvaad ji. ki appointment mangalvaar dass vaje kamra panj vich hai? mainu ki liauna chahida hai?",
      en: "Thank you for the message. Is the appointment Tuesday at ten in room five? What should I bring?",
      vi: "Cảm ơn vì tin nhắn. Lịch hẹn là thứ Ba lúc mười giờ ở phòng năm phải không? Tôi nên mang gì?",
    },
    commonTraps: [
      {
        trap_en: "Treating language practice as medical guidance.",
        trap_vi: "Xem luyện ngôn ngữ như hướng dẫn y tế.",
        better: { pa: "ਮੈਨੂੰ ਅਪਾਇੰਟਮੈਂਟ ਦੀ ਜਾਣਕਾਰੀ ਪੱਕੀ ਕਰਨੀ ਹੈ।", romanization: "mainu appointment di jankari pakki karni hai.", en: "I need to confirm the appointment information.", vi: "Tôi cần xác nhận thông tin lịch hẹn." },
      },
    ],
    review: {
      qualityCheck_en: ["Thanks are included.", "Time and place are confirmed.", "No medical advice is claimed."],
      qualityCheck_vi: ["Có lời cảm ơn.", "Giờ và nơi được xác nhận.", "Không tuyên bố tư vấn y tế."],
      ifClear_en: "Route to healthcare communication practice with safety limits.",
      ifClear_vi: "Chuyển sang luyện giao tiếp y tế có giới hạn an toàn.",
      remediation_en: "Practice confirm time, place, and what to bring.",
      remediation_vi: "Luyện xác nhận giờ, nơi và cần mang gì.",
    },
  },
  {
    id: "pa-b1-follow-05-public-service-document",
    level: "B1",
    focus: "public_service_document",
    title_en: "Follow up on a public-service document",
    title_vi: "Theo dõi giấy tờ dịch vụ công",
    context_en: "You submitted a form and need to ask if anything else is needed. Language support only, not legal advice.",
    context_vi: "Bạn đã nộp mẫu đơn và cần hỏi có cần gì thêm không. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn pháp lý.",
    canadaContext: "Useful for municipal, settlement, school, or public-service counters as language practice only.",
    messagePurpose_en: "Restate submission, ask whether anything is missing, and clarify the next step.",
    messagePurpose_vi: "Nhắc việc đã nộp, hỏi còn thiếu gì không và làm rõ bước tiếp theo.",
    messageMoves_en: ["State what you submitted.", "Ask whether anything is missing.", "Ask next step."],
    messageMoves_vi: ["Nêu bạn đã nộp gì.", "Hỏi còn thiếu gì không.", "Hỏi bước tiếp theo."],
    usefulLanguage: [
      { pa: "ਮੈਂ ਫਾਰਮ ਕੱਲ੍ਹ ਭੇਜਿਆ ਸੀ।", romanization: "main form kallh bhejia si.", en: "I sent the form yesterday.", vi: "Tôi đã gửi mẫu đơn hôm qua." },
      { pa: "ਕੀ ਕੋਈ ਦਸਤਾਵੇਜ਼ ਅਜੇ ਵੀ ਚਾਹੀਦਾ ਹੈ?", romanization: "ki koi dastavez aje vi chahida hai?", en: "Is any document still needed?", vi: "Có còn cần giấy tờ nào không?" },
      { pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", romanization: "agla kadam ki hai?", en: "What is the next step?", vi: "Bước tiếp theo là gì?" },
    ],
    modelMessage: {
      pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਮੈਂ ਫਾਰਮ ਕੱਲ੍ਹ ਭੇਜਿਆ ਸੀ। ਕੀ ਕੋਈ ਦਸਤਾਵੇਜ਼ ਅਜੇ ਵੀ ਚਾਹੀਦਾ ਹੈ? ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?",
      romanization: "sat sri akal ji, main form kallh bhejia si. ki koi dastavez aje vi chahida hai? agla kadam ki hai?",
      en: "Hello, I sent the form yesterday. Is any document still needed? What is the next step?",
      vi: "Xin chào, tôi đã gửi mẫu đơn hôm qua. Có còn cần giấy tờ nào không? Bước tiếp theo là gì?",
    },
    commonTraps: [
      {
        trap_en: "Asking for a legal decision instead of language for the next step.",
        trap_vi: "Hỏi quyết định pháp lý thay vì ngôn ngữ cho bước tiếp theo.",
        better: { pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", romanization: "agla kadam ki hai?", en: "What is the next step?", vi: "Bước tiếp theo là gì?" },
      },
    ],
    review: {
      qualityCheck_en: ["Submission is named.", "Missing documents are checked.", "Next step is requested."],
      qualityCheck_vi: ["Có nêu thứ đã nộp.", "Có kiểm tra giấy tờ thiếu.", "Có hỏi bước tiếp theo."],
      ifClear_en: "Route to B2 public-service communication with disclaimers.",
      ifClear_vi: "Chuyển sang giao tiếp dịch vụ công B2 có nhắc giới hạn.",
      remediation_en: "Practice submitted item, missing item, next-step pattern.",
      remediation_vi: "Luyện mẫu đã nộp gì, còn thiếu gì, bước tiếp theo.",
    },
  },
  {
    id: "pa-b1-follow-06-community-program",
    level: "B1",
    focus: "community_program",
    title_en: "Follow up about a community program",
    title_vi: "Theo dõi về chương trình cộng đồng",
    context_en: "You asked about a class or community event and need to confirm registration.",
    context_vi: "Bạn đã hỏi về lớp học hoặc sự kiện cộng đồng và cần xác nhận đăng ký.",
    canadaContext: "Useful for libraries, newcomer programs, recreation centres, and volunteer groups.",
    messagePurpose_en: "Thank them, confirm availability, and ask how to register.",
    messagePurpose_vi: "Cảm ơn, xác nhận còn chỗ và hỏi cách đăng ký.",
    messageMoves_en: ["Thank the staff.", "Confirm class or event space.", "Ask registration step."],
    messageMoves_vi: ["Cảm ơn nhân viên.", "Xác nhận lớp hoặc sự kiện còn chỗ.", "Hỏi bước đăng ký."],
    usefulLanguage: [
      { pa: "ਜਾਣਕਾਰੀ ਲਈ ਧੰਨਵਾਦ ਜੀ।", romanization: "jankari lai dhannvaad ji.", en: "Thank you for the information.", vi: "Cảm ơn vì thông tin." },
      { pa: "ਕੀ ਕਲਾਸ ਵਿੱਚ ਅਜੇ ਜਗ੍ਹਾ ਹੈ?", romanization: "ki class vich aje jagah hai?", en: "Is there still space in the class?", vi: "Lớp vẫn còn chỗ không?" },
      { pa: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਕਿਵੇਂ ਕਰਨੀ ਹੈ?", romanization: "registration kiven karni hai?", en: "How do I register?", vi: "Tôi đăng ký bằng cách nào?" },
    ],
    modelMessage: {
      pa: "ਜਾਣਕਾਰੀ ਲਈ ਧੰਨਵਾਦ ਜੀ। ਕੀ ਕਲਾਸ ਵਿੱਚ ਅਜੇ ਜਗ੍ਹਾ ਹੈ? ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਕਿਵੇਂ ਕਰਨੀ ਹੈ?",
      romanization: "jankari lai dhannvaad ji. ki class vich aje jagah hai? registration kiven karni hai?",
      en: "Thank you for the information. Is there still space in the class? How do I register?",
      vi: "Cảm ơn vì thông tin. Lớp vẫn còn chỗ không? Tôi đăng ký bằng cách nào?",
    },
    commonTraps: [
      {
        trap_en: "Thanking but forgetting to ask the registration step.",
        trap_vi: "Cảm ơn nhưng quên hỏi bước đăng ký.",
        better: { pa: "ਰਜਿਸਟਰ ਕਰਨ ਲਈ ਕੀ ਚਾਹੀਦਾ ਹੈ?", romanization: "register karan lai ki chahida hai?", en: "What is needed to register?", vi: "Cần gì để đăng ký?" },
      },
    ],
    review: {
      qualityCheck_en: ["Thanks are included.", "Availability is checked.", "Registration step is requested."],
      qualityCheck_vi: ["Có lời cảm ơn.", "Có kiểm tra còn chỗ.", "Có hỏi bước đăng ký."],
      ifClear_en: "Route to community participation tasks.",
      ifClear_vi: "Chuyển sang nhiệm vụ tham gia cộng đồng.",
      remediation_en: "Practice thank, availability, registration.",
      remediation_vi: "Luyện cảm ơn, còn chỗ, đăng ký.",
    },
  },
  {
    id: "pa-b1-follow-07-thank-confirm",
    level: "B1",
    focus: "thank_and_confirm",
    title_en: "Thank and confirm after help",
    title_vi: "Cảm ơn và xác nhận sau khi được giúp",
    context_en: "Someone explained the next step and you want to confirm you understood.",
    context_vi: "Ai đó đã giải thích bước tiếp theo và bạn muốn xác nhận mình đã hiểu.",
    canadaContext: "Useful in workplace, school, service, housing, clinic, and community settings.",
    messagePurpose_en: "Thank the listener, restate the action, and confirm timing.",
    messagePurpose_vi: "Cảm ơn người nghe, nhắc lại hành động và xác nhận thời gian.",
    messageMoves_en: ["Thank them.", "Restate what you will do.", "Confirm when it will happen."],
    messageMoves_vi: ["Cảm ơn họ.", "Nhắc lại bạn sẽ làm gì.", "Xác nhận khi nào sẽ làm."],
    usefulLanguage: [
      { pa: "ਮਦਦ ਲਈ ਧੰਨਵਾਦ ਜੀ।", romanization: "madad lai dhannvaad ji.", en: "Thank you for the help.", vi: "Cảm ơn vì sự giúp đỡ." },
      { pa: "ਮੈਂ ਫਾਰਮ ਅੱਜ ਭੇਜਾਂਗਾ।", romanization: "main form ajj bhejanga.", en: "I will send the form today.", vi: "Tôi sẽ gửi mẫu đơn hôm nay." },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਕੀ ਇਹ ਠੀਕ ਹੈ?", romanization: "kirpa karke dasso, ki eh theek hai?", en: "Please tell me, is this correct?", vi: "Vui lòng cho tôi biết, như vậy đúng không?" },
    ],
    modelMessage: {
      pa: "ਮਦਦ ਲਈ ਧੰਨਵਾਦ ਜੀ। ਮੈਂ ਫਾਰਮ ਅੱਜ ਭੇਜਾਂਗਾ। ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਕੀ ਇਹ ਠੀਕ ਹੈ?",
      romanization: "madad lai dhannvaad ji. main form ajj bhejanga. kirpa karke dasso, ki eh theek hai?",
      en: "Thank you for the help. I will send the form today. Please tell me, is this correct?",
      vi: "Cảm ơn vì sự giúp đỡ. Tôi sẽ gửi mẫu đơn hôm nay. Vui lòng cho tôi biết, như vậy đúng không?",
    },
    commonTraps: [
      {
        trap_en: "Saying thanks but not confirming the action.",
        trap_vi: "Nói cảm ơn nhưng không xác nhận hành động.",
        better: { pa: "ਮੈਂ ਫਾਰਮ ਅੱਜ ਭੇਜਾਂਗਾ।", romanization: "main form ajj bhejanga.", en: "I will send the form today.", vi: "Tôi sẽ gửi mẫu đơn hôm nay." },
      },
    ],
    review: {
      qualityCheck_en: ["Thanks are clear.", "Action is restated.", "Confirmation question is polite."],
      qualityCheck_vi: ["Lời cảm ơn rõ.", "Hành động được nhắc lại.", "Câu hỏi xác nhận lịch sự."],
      ifClear_en: "Route to final-quality review.",
      ifClear_vi: "Chuyển sang ôn chất lượng cuối.",
      remediation_en: "Practice thank, action, confirmation in one message.",
      remediation_vi: "Luyện cảm ơn, hành động, xác nhận trong một tin nhắn.",
    },
  },
  {
    id: "pa-b1-follow-08-readiness-remediation",
    level: "B1",
    focus: "readiness_remediation",
    title_en: "Review follow-up readiness",
    title_vi: "Ôn mức sẵn sàng viết tin theo dõi",
    context_en: "After writing a follow-up message, you decide what to review next. Shahmukhi is awareness only, not a full course.",
    context_vi: "Sau khi viết tin theo dõi, bạn quyết định cần ôn gì tiếp. Shahmukhi chỉ để nhận biết, không phải khóa học đầy đủ.",
    canadaContext: "Useful for tutoring, settlement classes, self-study logs, and progress reviews.",
    messagePurpose_en: "Name the follow-up function you can do and the one that still needs practice.",
    messagePurpose_vi: "Nêu chức năng theo dõi bạn làm được và chức năng còn cần luyện.",
    messageMoves_en: ["Name a strength.", "Name a weak follow-up function.", "Choose remediation or B2 bridge."],
    messageMoves_vi: ["Nêu một điểm mạnh.", "Nêu một chức năng theo dõi còn yếu.", "Chọn sửa lỗi hoặc cầu nối B2."],
    usefulLanguage: [
      { pa: "ਮੈਂ ਅਪਡੇਟ ਮੰਗ ਸਕਦਾ ਹਾਂ।", romanization: "main update mang sakda han.", en: "I can ask for an update.", vi: "Tôi có thể yêu cầu cập nhật." },
      { pa: "ਮੈਨੂੰ ਧੰਨਵਾਦ ਅਤੇ ਪੁਸ਼ਟੀ ਦੀ ਹੋਰ ਅਭਿਆਸ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu dhannvaad ate pushti di hor abhyas chahidi hai.", en: "I need more practice with thanks and confirmation.", vi: "Tôi cần luyện thêm cảm ơn và xác nhận." },
      { pa: "ਮੈਂ ਪਹਿਲਾਂ B1 ਸੁਨੇਹੇ ਦੁਹਰਾਵਾਂਗਾ।", romanization: "main pahilan B1 sunehe duhravanga.", en: "I will review B1 messages first.", vi: "Tôi sẽ ôn tin nhắn B1 trước." },
    ],
    modelMessage: {
      pa: "ਮੈਂ ਅਪਡੇਟ ਮੰਗ ਸਕਦਾ ਹਾਂ, ਪਰ ਮੈਨੂੰ ਧੰਨਵਾਦ ਅਤੇ ਪੁਸ਼ਟੀ ਦੀ ਹੋਰ ਅਭਿਆਸ ਚਾਹੀਦੀ ਹੈ। ਮੈਂ ਪਹਿਲਾਂ B1 ਸੁਨੇਹੇ ਦੁਹਰਾਵਾਂਗਾ, ਫਿਰ B2 ਸ਼ੁਰੂ ਕਰਾਂਗਾ।",
      romanization: "main update mang sakda han, par mainu dhannvaad ate pushti di hor abhyas chahidi hai. main pahilan B1 sunehe duhravanga, phir B2 shuru karanga.",
      en: "I can ask for an update, but I need more practice with thanks and confirmation. I will review B1 messages first, then start B2.",
      vi: "Tôi có thể yêu cầu cập nhật, nhưng cần luyện thêm cảm ơn và xác nhận. Tôi sẽ ôn tin nhắn B1 trước, rồi bắt đầu B2.",
    },
    commonTraps: [
      {
        trap_en: "Claiming the message is native-reviewed or fully complete without evidence.",
        trap_vi: "Tuyên bố tin nhắn đã được người bản ngữ xem lại hoặc hoàn toàn xong mà không có bằng chứng.",
        better: { pa: "ਮੈਨੂੰ ਹੋਰ ਅਭਿਆਸ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu hor abhyas chahidi hai.", en: "I need more practice.", vi: "Tôi cần luyện thêm." },
      },
    ],
    review: {
      qualityCheck_en: ["Strength is named.", "Weak function is named.", "No native-review claim is made."],
      qualityCheck_vi: ["Có nêu điểm mạnh.", "Có nêu chức năng yếu.", "Không tuyên bố người bản ngữ đã xem lại."],
      ifClear_en: "Route to B2 bridge or teacher review. Native review is deferred.",
      ifClear_vi: "Chuyển sang cầu nối B2 hoặc giáo viên xem lại. Phần người bản ngữ xem lại được để sau.",
      remediation_en: "Return to the weakest follow-up message type.",
      remediation_vi: "Quay lại loại tin nhắn theo dõi yếu nhất.",
    },
  },
];
