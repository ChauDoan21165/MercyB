// src/languages/punjabi/canDoStatementsB1.ts
//
// Punjabi B1 can-do statements for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary; romanization is a support bridge. Shahmukhi is
// mentioned only for awareness, not taught as a full course.
//
// Native review is deferred; this module makes no native-review claim.

export type PunjabiB1CanDoFocus =
  | "explain_situation"
  | "retell_event"
  | "clarify_next_steps"
  | "service_conversation"
  | "workplace_issue"
  | "housing_school_issue"
  | "register_aware_request"
  | "readiness_routing";

export type PunjabiCanDoLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiCanDoTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiCanDoLine;
};

export type PunjabiCanDoCheckpoint = {
  canDo_en: string;
  canDo_vi: string;
  evidencePrompt_en: string;
  evidencePrompt_vi: string;
  readyWhen_en: string[];
  readyWhen_vi: string[];
  routeIfReady_en: string;
  routeIfReady_vi: string;
  routeIfNeedsPractice_en: string;
  routeIfNeedsPractice_vi: string;
};

export type PunjabiB1CanDoStatement = {
  id: string;
  level: "B1";
  focus: PunjabiB1CanDoFocus;
  title_en: string;
  title_vi: string;
  learnerContext_en: string;
  learnerContext_vi: string;
  canadaContext: string;
  checkpoint: PunjabiCanDoCheckpoint;
  usefulLanguage: PunjabiCanDoLine[];
  modelEvidence: PunjabiCanDoLine;
  commonTraps: PunjabiCanDoTrap[];
};

export const punjabiB1CanDoStatements: PunjabiB1CanDoStatement[] = [
  {
    id: "pa-b1-cando-01-explain-situation",
    level: "B1",
    focus: "explain_situation",
    title_en: "I can explain a practical situation",
    title_vi: "Tôi có thể giải thích một tình huống thực tế",
    learnerContext_en: "You explain what happened, why it matters, and what you need next.",
    learnerContext_vi: "Bạn giải thích chuyện gì xảy ra, vì sao quan trọng và bạn cần gì tiếp theo.",
    canadaContext: "Useful for rental offices, libraries, clinics, school offices, and community counters in Canada.",
    checkpoint: {
      canDo_en: "I can explain a problem with cause, impact, and requested next step.",
      canDo_vi: "Tôi có thể giải thích vấn đề với nguyên nhân, ảnh hưởng và bước tiếp theo mong muốn.",
      evidencePrompt_en: "Explain that your building mailbox key does not work and ask what to do next.",
      evidencePrompt_vi: "Giải thích chìa khóa hộp thư của tòa nhà không dùng được và hỏi nên làm gì tiếp.",
      readyWhen_en: ["Problem is clear.", "Impact is included.", "Next step is requested politely."],
      readyWhen_vi: ["Vấn đề rõ.", "Có nêu ảnh hưởng.", "Yêu cầu bước tiếp theo lịch sự."],
      routeIfReady_en: "Move to B1 problem-solving or B2 service-resolution tasks.",
      routeIfReady_vi: "Chuyển sang giải quyết vấn đề B1 hoặc xử lý dịch vụ B2.",
      routeIfNeedsPractice_en: "Review B1 explain-problem cards and practice location plus impact.",
      routeIfNeedsPractice_vi: "Ôn thẻ giải thích vấn đề B1 và luyện vị trí cộng ảnh hưởng.",
    },
    usefulLanguage: [
      { pa: "ਮੇਰੀ ਮੇਲਬਾਕਸ ਦੀ ਚਾਬੀ ਕੰਮ ਨਹੀਂ ਕਰਦੀ।", romanization: "meri mailbox di chabi kam nahin kardi.", en: "My mailbox key does not work.", vi: "Chìa khóa hộp thư của tôi không dùng được." },
      { pa: "ਮੈਂ ਚਿੱਠੀਆਂ ਨਹੀਂ ਲੈ ਸਕਦਾ।", romanization: "main chitthian nahin lai sakda.", en: "I cannot collect my letters.", vi: "Tôi không thể lấy thư." },
      { pa: "ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਦੱਸੋ ਜੀ।", romanization: "mainu agla kadam dasso ji.", en: "Please tell me the next step.", vi: "Vui lòng cho tôi biết bước tiếp theo." },
    ],
    modelEvidence: {
      pa: "ਮੇਰੀ ਮੇਲਬਾਕਸ ਦੀ ਚਾਬੀ ਕੰਮ ਨਹੀਂ ਕਰਦੀ, ਇਸ ਲਈ ਮੈਂ ਚਿੱਠੀਆਂ ਨਹੀਂ ਲੈ ਸਕਦਾ। ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਦੱਸੋ ਜੀ।",
      romanization: "meri mailbox di chabi kam nahin kardi, is lai main chitthian nahin lai sakda. mainu agla kadam dasso ji.",
      en: "My mailbox key does not work, so I cannot collect my letters. Please tell me the next step.",
      vi: "Chìa khóa hộp thư của tôi không dùng được, nên tôi không thể lấy thư. Vui lòng cho tôi biết bước tiếp theo.",
    },
    commonTraps: [
      {
        trap_en: "Naming only the object, like 'key problem', without explaining the impact.",
        trap_vi: "Chỉ nêu đồ vật như 'vấn đề chìa khóa' mà không giải thích ảnh hưởng.",
        better: { pa: "ਚਾਬੀ ਕੰਮ ਨਹੀਂ ਕਰਦੀ, ਇਸ ਲਈ ਮੈਂ ਚਿੱਠੀਆਂ ਨਹੀਂ ਲੈ ਸਕਦਾ।", romanization: "chabi kam nahin kardi, is lai main chitthian nahin lai sakda.", en: "The key does not work, so I cannot collect my letters.", vi: "Chìa khóa không dùng được, nên tôi không thể lấy thư." },
      },
    ],
  },
  {
    id: "pa-b1-cando-02-retell-event",
    level: "B1",
    focus: "retell_event",
    title_en: "I can retell events in order",
    title_vi: "Tôi có thể kể lại sự việc theo thứ tự",
    learnerContext_en: "You retell a short event with sequence markers, reason, and result.",
    learnerContext_vi: "Bạn kể lại một sự việc ngắn với từ nối trình tự, lý do và kết quả.",
    canadaContext: "Useful for explaining delays at work, school, transit, or appointments.",
    checkpoint: {
      canDo_en: "I can retell a short real-life event using first, then, and because of this.",
      canDo_vi: "Tôi có thể kể lại một sự việc đời thường bằng trước tiên, sau đó và vì vậy.",
      evidencePrompt_en: "Retell why you arrived late to an appointment.",
      evidencePrompt_vi: "Kể lại vì sao bạn đến muộn một cuộc hẹn.",
      readyWhen_en: ["Events are in time order.", "Cause and result are connected.", "The listener knows what happened next."],
      readyWhen_vi: ["Sự việc theo thứ tự thời gian.", "Nguyên nhân và kết quả được nối rõ.", "Người nghe biết chuyện gì xảy ra tiếp."],
      routeIfReady_en: "Move to B1 narrative tasks or B2 extended event reports.",
      routeIfReady_vi: "Chuyển sang nhiệm vụ kể chuyện B1 hoặc báo cáo sự việc mở rộng B2.",
      routeIfNeedsPractice_en: "Practice sequence markers with one-minute retells.",
      routeIfNeedsPractice_vi: "Luyện từ nối trình tự bằng bài kể một phút.",
    },
    usefulLanguage: [
      { pa: "ਪਹਿਲਾਂ ਟ੍ਰੈਫਿਕ ਬਹੁਤ ਸੀ।", romanization: "pahilan traffic bahut si.", en: "First, there was a lot of traffic.", vi: "Trước tiên, giao thông rất đông." },
      { pa: "ਫਿਰ ਬੱਸ ਹੌਲੀ ਚੱਲੀ।", romanization: "phir bus hauli challi.", en: "Then the bus moved slowly.", vi: "Sau đó xe buýt chạy chậm." },
      { pa: "ਇਸ ਕਰਕੇ ਮੈਂ ਦੇਰ ਨਾਲ ਪਹੁੰਚਿਆ।", romanization: "is karke main der naal pahunchia.", en: "Because of this, I arrived late.", vi: "Vì vậy tôi đến muộn." },
    ],
    modelEvidence: {
      pa: "ਪਹਿਲਾਂ ਟ੍ਰੈਫਿਕ ਬਹੁਤ ਸੀ। ਫਿਰ ਬੱਸ ਹੌਲੀ ਚੱਲੀ। ਇਸ ਕਰਕੇ ਮੈਂ ਦੇਰ ਨਾਲ ਪਹੁੰਚਿਆ ਅਤੇ ਦਫ਼ਤਰ ਨੂੰ ਸੁਨੇਹਾ ਭੇਜਿਆ।",
      romanization: "pahilan traffic bahut si. phir bus hauli challi. is karke main der naal pahunchia ate daftar nu suneha bhejia.",
      en: "First, there was a lot of traffic. Then the bus moved slowly. Because of this, I arrived late and sent the office a message.",
      vi: "Trước tiên, giao thông rất đông. Sau đó xe buýt chạy chậm. Vì vậy tôi đến muộn và đã nhắn cho văn phòng.",
    },
    commonTraps: [
      {
        trap_en: "Using ਕੱਲ੍ਹ without context; it can mean yesterday or tomorrow.",
        trap_vi: "Dùng ਕੱਲ੍ਹ thiếu ngữ cảnh; từ này có thể nghĩa là hôm qua hoặc ngày mai.",
        better: { pa: "ਕੱਲ੍ਹ ਸਵੇਰੇ ਦਸ ਵਜੇ", romanization: "kallh savere dass vaje", en: "tomorrow morning at ten", vi: "sáng mai lúc mười giờ" },
      },
    ],
  },
  {
    id: "pa-b1-cando-03-clarify-next-steps",
    level: "B1",
    focus: "clarify_next_steps",
    title_en: "I can clarify next steps",
    title_vi: "Tôi có thể làm rõ bước tiếp theo",
    learnerContext_en: "You ask for repetition, confirm details, and request written follow-up. Language support only, not legal or medical advice.",
    learnerContext_vi: "Bạn xin nhắc lại, xác nhận chi tiết và yêu cầu theo dõi bằng văn bản. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn pháp lý hoặc y tế.",
    canadaContext: "Useful for clinics, schools, settlement agencies, and service counters.",
    checkpoint: {
      canDo_en: "I can clarify dates, documents, locations, and next steps when information is fast.",
      canDo_vi: "Tôi có thể làm rõ ngày, giấy tờ, địa điểm và bước tiếp theo khi thông tin nói nhanh.",
      evidencePrompt_en: "Ask an office to repeat which document you need and where to send it.",
      evidencePrompt_vi: "Xin văn phòng nhắc lại bạn cần giấy tờ nào và gửi ở đâu.",
      readyWhen_en: ["Asks for slower repetition.", "Repeats key details back.", "Requests written confirmation if needed."],
      readyWhen_vi: ["Xin nhắc lại chậm hơn.", "Lặp lại chi tiết chính.", "Yêu cầu xác nhận bằng văn bản nếu cần."],
      routeIfReady_en: "Move to B1 phone checkpoints or B2 negotiation practice.",
      routeIfReady_vi: "Chuyển sang điểm kiểm tra gọi điện B1 hoặc luyện thương lượng B2.",
      routeIfNeedsPractice_en: "Review clarification phrases and number/date confirmation.",
      routeIfNeedsPractice_vi: "Ôn câu làm rõ và xác nhận số/ngày.",
    },
    usefulLanguage: [
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਬਾਰਾ ਕਹੋ।", romanization: "kirpa karke hauli dubara kaho.", en: "Please say it again slowly.", vi: "Vui lòng nói lại chậm hơn." },
      { pa: "ਕਿਹੜਾ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦਾ ਹੈ?", romanization: "kihra dastavez chahida hai?", en: "Which document is needed?", vi: "Cần giấy tờ nào?" },
      { pa: "ਮੈਂ ਇਹ ਕਿੱਥੇ ਭੇਜਣਾ ਹੈ?", romanization: "main eh kitthe bhejna hai?", en: "Where should I send this?", vi: "Tôi nên gửi cái này ở đâu?" },
    ],
    modelEvidence: {
      pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਬਾਰਾ ਕਹੋ। ਕਿਹੜਾ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦਾ ਹੈ, ਅਤੇ ਮੈਂ ਇਹ ਕਿੱਥੇ ਭੇਜਣਾ ਹੈ?",
      romanization: "kirpa karke hauli dubara kaho. kihra dastavez chahida hai, ate main eh kitthe bhejna hai?",
      en: "Please say it again slowly. Which document is needed, and where should I send this?",
      vi: "Vui lòng nói lại chậm hơn. Cần giấy tờ nào, và tôi nên gửi cái này ở đâu?",
    },
    commonTraps: [
      {
        trap_en: "Pretending to understand instead of asking for repetition.",
        trap_vi: "Giả vờ hiểu thay vì xin nhắc lại.",
        better: { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਸਪਸ਼ਟ ਨਹੀਂ ਹੋਇਆ।", romanization: "maaf karna, mainu spasht nahin hoia.", en: "Sorry, it was not clear to me.", vi: "Xin lỗi, tôi chưa rõ." },
      },
    ],
  },
  {
    id: "pa-b1-cando-04-service-conversation",
    level: "B1",
    focus: "service_conversation",
    title_en: "I can handle a service conversation",
    title_vi: "Tôi có thể xử lý cuộc trò chuyện dịch vụ",
    learnerContext_en: "You explain the issue, ask options, and confirm the correction or next step.",
    learnerContext_vi: "Bạn giải thích vấn đề, hỏi lựa chọn và xác nhận việc sửa hoặc bước tiếp theo.",
    canadaContext: "Useful for banks, phone plans, transit passes, utilities, and public counters.",
    checkpoint: {
      canDo_en: "I can ask about an incorrect fee or service issue without blaming staff.",
      canDo_vi: "Tôi có thể hỏi về khoản phí sai hoặc vấn đề dịch vụ mà không đổ lỗi cho nhân viên.",
      evidencePrompt_en: "Ask why an unexpected fee appears on your bill.",
      evidencePrompt_vi: "Hỏi vì sao có khoản phí bất ngờ trên hóa đơn.",
      readyWhen_en: ["Opens politely.", "Asks what the fee is for.", "Confirms when correction will happen."],
      readyWhen_vi: ["Mở đầu lịch sự.", "Hỏi khoản phí dùng cho gì.", "Xác nhận khi nào sẽ sửa."],
      routeIfReady_en: "Move to service-conversation role plays or B2 complaint handling.",
      routeIfReady_vi: "Chuyển sang vai diễn dịch vụ hoặc xử lý khiếu nại B2.",
      routeIfNeedsPractice_en: "Practice factual service questions before longer complaints.",
      routeIfNeedsPractice_vi: "Luyện câu hỏi dịch vụ mang tính sự việc trước khi khiếu nại dài.",
    },
    usefulLanguage: [
      { pa: "ਮੇਰੇ ਬਿੱਲ ਵਿੱਚ ਇਹ ਫੀਸ ਕੀ ਹੈ?", romanization: "mere bill vich eh fees ki hai?", en: "What is this fee on my bill?", vi: "Khoản phí này trên hóa đơn của tôi là gì?" },
      { pa: "ਕੀ ਇਹ ਗਲਤੀ ਹੋ ਸਕਦੀ ਹੈ?", romanization: "ki eh galti ho sakdi hai?", en: "Could this be a mistake?", vi: "Đây có thể là lỗi không?" },
      { pa: "ਠੀਕ ਕੀਤਾ ਬਿੱਲ ਕਦੋਂ ਮਿਲੇਗਾ?", romanization: "theek kita bill kadon milega?", en: "When will I receive the corrected bill?", vi: "Khi nào tôi sẽ nhận hóa đơn đã sửa?" },
    ],
    modelEvidence: {
      pa: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਮੇਰੇ ਬਿੱਲ ਵਿੱਚ ਇਹ ਫੀਸ ਕੀ ਹੈ? ਕੀ ਇਹ ਗਲਤੀ ਹੋ ਸਕਦੀ ਹੈ? ਜੇ ਹਾਂ, ਠੀਕ ਕੀਤਾ ਬਿੱਲ ਕਦੋਂ ਮਿਲੇਗਾ?",
      romanization: "maaf karna ji, mere bill vich eh fees ki hai? ki eh galti ho sakdi hai? je han, theek kita bill kadon milega?",
      en: "Excuse me, what is this fee on my bill? Could this be a mistake? If yes, when will I receive the corrected bill?",
      vi: "Xin lỗi, khoản phí này trên hóa đơn của tôi là gì? Đây có thể là lỗi không? Nếu đúng, khi nào tôi sẽ nhận hóa đơn đã sửa?",
    },
    commonTraps: [
      {
        trap_en: "Starting with anger before asking what happened.",
        trap_vi: "Bắt đầu bằng giận dữ trước khi hỏi chuyện gì xảy ra.",
        better: { pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਫੀਸ ਸਮਝਾ ਦਿਓ।", romanization: "kirpa karke eh fees samjha dio.", en: "Please explain this fee.", vi: "Vui lòng giải thích khoản phí này." },
      },
    ],
  },
  {
    id: "pa-b1-cando-05-workplace-issue",
    level: "B1",
    focus: "workplace_issue",
    title_en: "I can report a workplace issue",
    title_vi: "Tôi có thể báo cáo vấn đề nơi làm việc",
    learnerContext_en: "You report a blocker, explain what you can do now, and ask or suggest the next step.",
    learnerContext_vi: "Bạn báo cáo trở ngại, giải thích hiện giờ có thể làm gì và hỏi hoặc đề xuất bước tiếp theo.",
    canadaContext: "Useful in office, retail, warehouse, hospitality, and community-service work.",
    checkpoint: {
      canDo_en: "I can tell a supervisor about a delay or missing item with a realistic plan.",
      canDo_vi: "Tôi có thể nói với quản lý về chậm trễ hoặc thiếu đồ với kế hoạch thực tế.",
      evidencePrompt_en: "Explain that one file is missing and say when you can finish.",
      evidencePrompt_vi: "Giải thích còn thiếu một tệp và nói khi nào bạn có thể hoàn thành.",
      readyWhen_en: ["Names the blocker.", "Gives current status.", "Offers a realistic deadline or option."],
      readyWhen_vi: ["Nêu trở ngại.", "Nêu tình trạng hiện tại.", "Đưa hạn chót hoặc lựa chọn thực tế."],
      routeIfReady_en: "Move to workplace scenarios or B2 project update tasks.",
      routeIfReady_vi: "Chuyển sang tình huống nơi làm việc hoặc nhiệm vụ cập nhật dự án B2.",
      routeIfNeedsPractice_en: "Practice cause plus proposed solution in short workplace updates.",
      routeIfNeedsPractice_vi: "Luyện nguyên nhân cộng giải pháp đề xuất trong cập nhật công việc ngắn.",
    },
    usefulLanguage: [
      { pa: "ਇੱਕ ਫ਼ਾਈਲ ਅਜੇ ਨਹੀਂ ਮਿਲੀ।", romanization: "ikk file aje nahin mili.", en: "One file has not arrived yet.", vi: "Một tệp vẫn chưa có." },
      { pa: "ਮੈਂ ਅੱਜ ਸੰਖੇਪ ਭੇਜ ਸਕਦਾ ਹਾਂ।", romanization: "main ajj sankhep bhej sakda han.", en: "I can send the summary today.", vi: "Tôi có thể gửi bản tóm tắt hôm nay." },
      { pa: "ਪੂਰਾ ਕੰਮ ਕੱਲ੍ਹ ਸਵੇਰੇ ਹੋ ਜਾਵੇਗਾ।", romanization: "pura kam kallh savere ho javega.", en: "The full work will be done tomorrow morning.", vi: "Toàn bộ công việc sẽ xong sáng mai." },
    ],
    modelEvidence: {
      pa: "ਇੱਕ ਫ਼ਾਈਲ ਅਜੇ ਨਹੀਂ ਮਿਲੀ, ਇਸ ਕਰਕੇ ਪੂਰਾ ਕੰਮ ਅੱਜ ਨਹੀਂ ਹੋਵੇਗਾ। ਮੈਂ ਅੱਜ ਸੰਖੇਪ ਭੇਜ ਸਕਦਾ ਹਾਂ ਅਤੇ ਪੂਰਾ ਕੰਮ ਕੱਲ੍ਹ ਸਵੇਰੇ ਹੋ ਜਾਵੇਗਾ।",
      romanization: "ikk file aje nahin mili, is karke pura kam ajj nahin hovega. main ajj sankhep bhej sakda han ate pura kam kallh savere ho javega.",
      en: "One file has not arrived yet, so the full work will not be done today. I can send the summary today, and the full work will be done tomorrow morning.",
      vi: "Một tệp vẫn chưa có, nên toàn bộ công việc sẽ không xong hôm nay. Tôi có thể gửi bản tóm tắt hôm nay và toàn bộ công việc sẽ xong sáng mai.",
    },
    commonTraps: [
      {
        trap_en: "Saying only 'I cannot' without giving the reason or alternative.",
        trap_vi: "Chỉ nói 'tôi không thể' mà không nêu lý do hoặc phương án khác.",
        better: { pa: "ਫ਼ਾਈਲ ਨਹੀਂ ਮਿਲੀ, ਪਰ ਮੈਂ ਸੰਖੇਪ ਭੇਜ ਸਕਦਾ ਹਾਂ।", romanization: "file nahin mili, par main sankhep bhej sakda han.", en: "The file has not arrived, but I can send the summary.", vi: "Tệp chưa có, nhưng tôi có thể gửi bản tóm tắt." },
      },
    ],
  },
  {
    id: "pa-b1-cando-06-housing-school-issue",
    level: "B1",
    focus: "housing_school_issue",
    title_en: "I can report housing or school issues",
    title_vi: "Tôi có thể báo cáo vấn đề nhà ở hoặc trường học",
    learnerContext_en: "You identify the person, place, changed detail, and requested action.",
    learnerContext_vi: "Bạn xác định người, nơi, chi tiết thay đổi và hành động mong muốn.",
    canadaContext: "Useful for school offices, childcare, tenant communication, and building management.",
    checkpoint: {
      canDo_en: "I can report a schedule, pickup, or repair issue with enough detail.",
      canDo_vi: "Tôi có thể báo cáo vấn đề lịch, đón con hoặc sửa chữa với đủ chi tiết.",
      evidencePrompt_en: "Tell the school that pickup time changed today and ask whether a form is needed.",
      evidencePrompt_vi: "Nói với trường rằng giờ đón hôm nay thay đổi và hỏi có cần mẫu đơn không.",
      readyWhen_en: ["Identifies whose schedule changed.", "States old and new time.", "Asks what action is required."],
      readyWhen_vi: ["Xác định lịch của ai thay đổi.", "Nêu giờ cũ và giờ mới.", "Hỏi cần hành động gì."],
      routeIfReady_en: "Move to school/community scenarios or B2 family-service conversations.",
      routeIfReady_vi: "Chuyển sang tình huống trường/cộng đồng hoặc hội thoại dịch vụ gia đình B2.",
      routeIfNeedsPractice_en: "Practice old time, new time, and required action.",
      routeIfNeedsPractice_vi: "Luyện giờ cũ, giờ mới và hành động cần làm.",
    },
    usefulLanguage: [
      { pa: "ਅੱਜ ਸਮਾਂ ਬਦਲ ਗਿਆ ਹੈ।", romanization: "ajj sama badal gia hai.", en: "Today the time has changed.", vi: "Hôm nay giờ đã thay đổi." },
      { pa: "ਤਿੰਨ ਵਜੇ ਲੈਣਾ ਹੈ, ਚਾਰ ਵਜੇ ਨਹੀਂ।", romanization: "tinn vaje laina hai, char vaje nahin.", en: "Pickup is at three, not four.", vi: "Đón lúc ba giờ, không phải bốn giờ." },
      { pa: "ਕੀ ਕੋਈ ਫਾਰਮ ਭਰਨਾ ਹੈ?", romanization: "ki koi form bharna hai?", en: "Is there a form to fill out?", vi: "Có mẫu đơn nào cần điền không?" },
    ],
    modelEvidence: {
      pa: "ਅੱਜ ਮੇਰੇ ਬੱਚੇ ਦਾ ਸਮਾਂ ਬਦਲ ਗਿਆ ਹੈ। ਤਿੰਨ ਵਜੇ ਲੈਣਾ ਹੈ, ਚਾਰ ਵਜੇ ਨਹੀਂ। ਕੀ ਕੋਈ ਫਾਰਮ ਭਰਨਾ ਹੈ?",
      romanization: "ajj mere bache da sama badal gia hai. tinn vaje laina hai, char vaje nahin. ki koi form bharna hai?",
      en: "Today my child's time has changed. Pickup is at three, not four. Is there a form to fill out?",
      vi: "Hôm nay giờ của con tôi đã thay đổi. Đón lúc ba giờ, không phải bốn giờ. Có mẫu đơn nào cần điền không?",
    },
    commonTraps: [
      {
        trap_en: "Leaving out whose schedule changed.",
        trap_vi: "Bỏ sót lịch của ai đã thay đổi.",
        better: { pa: "ਮੇਰੇ ਬੱਚੇ ਦਾ ਪਿਕਅੱਪ ਸਮਾਂ ਬਦਲ ਗਿਆ ਹੈ।", romanization: "mere bache da pickup sama badal gia hai.", en: "My child's pickup time has changed.", vi: "Giờ đón con tôi đã thay đổi." },
      },
    ],
  },
  {
    id: "pa-b1-cando-07-register-aware-request",
    level: "B1",
    focus: "register_aware_request",
    title_en: "I can make register-aware requests",
    title_vi: "Tôi có thể đưa ra yêu cầu đúng mức lịch sự",
    learnerContext_en: "You choose respectful address and soften requests with ਜੀ, ਕਿਰਪਾ ਕਰਕੇ, or question forms.",
    learnerContext_vi: "Bạn chọn cách xưng hô tôn trọng và làm mềm yêu cầu bằng ਜੀ, ਕਿਰਪਾ ਕਰਕੇ hoặc dạng câu hỏi.",
    canadaContext: "Useful with supervisors, neighbours, teachers, staff, elders, and service workers.",
    checkpoint: {
      canDo_en: "I can avoid overly direct requests and choose polite forms for unfamiliar adults.",
      canDo_vi: "Tôi có thể tránh yêu cầu quá trực tiếp và chọn dạng lịch sự với người lớn chưa thân.",
      evidencePrompt_en: "Ask a staff member to explain a form again politely.",
      evidencePrompt_vi: "Yêu cầu nhân viên giải thích lại một mẫu đơn một cách lịch sự.",
      readyWhen_en: ["Uses ਤੁਸੀਂ instead of ਤੂੰ.", "Uses a question form.", "Adds ਜੀ or ਕਿਰਪਾ ਕਰਕੇ naturally."],
      readyWhen_vi: ["Dùng ਤੁਸੀਂ thay vì ਤੂੰ.", "Dùng dạng câu hỏi.", "Thêm ਜੀ hoặc ਕਿਰਪਾ ਕਰਕੇ tự nhiên."],
      routeIfReady_en: "Move to B1 register repair or B2 professional interaction tasks.",
      routeIfReady_vi: "Chuyển sang sửa mức lịch sự B1 hoặc tương tác chuyên nghiệp B2.",
      routeIfNeedsPractice_en: "Practice changing direct commands into polite questions.",
      routeIfNeedsPractice_vi: "Luyện đổi mệnh lệnh trực tiếp thành câu hỏi lịch sự.",
    },
    usefulLanguage: [
      { pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਦੁਬਾਰਾ ਸਮਝਾ ਸਕਦੇ ਹੋ?", romanization: "ki tusin eh dubara samjha sakde ho?", en: "Can you explain this again?", vi: "Bạn có thể giải thích lại không?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਾਈਨ ਦਿਖਾ ਦਿਓ।", romanization: "kirpa karke eh line dikha dio.", en: "Please show me this line.", vi: "Vui lòng chỉ cho tôi dòng này." },
      { pa: "ਧੰਨਵਾਦ ਜੀ, ਹੁਣ ਸਮਝ ਆ ਗਿਆ।", romanization: "dhannvaad ji, hun samajh aa gia.", en: "Thank you, now I understand.", vi: "Cảm ơn, bây giờ tôi hiểu rồi." },
    ],
    modelEvidence: {
      pa: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਕੀ ਤੁਸੀਂ ਇਹ ਫਾਰਮ ਦੁਬਾਰਾ ਸਮਝਾ ਸਕਦੇ ਹੋ? ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਾਈਨ ਦਿਖਾ ਦਿਓ।",
      romanization: "maaf karna ji, ki tusin eh form dubara samjha sakde ho? kirpa karke eh line dikha dio.",
      en: "Excuse me, can you explain this form again? Please show me this line.",
      vi: "Xin lỗi, bạn có thể giải thích lại mẫu đơn này không? Vui lòng chỉ cho tôi dòng này.",
    },
    commonTraps: [
      {
        trap_en: "Translating a direct English command into Punjabi and sounding abrupt.",
        trap_vi: "Dịch mệnh lệnh trực tiếp từ tiếng Anh sang Punjabi và nghe cộc.",
        better: { pa: "ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ ਜੀ?", romanization: "ki tusin madad kar sakde ho ji?", en: "Could you help, please?", vi: "Bạn có thể vui lòng giúp không?" },
      },
    ],
  },
  {
    id: "pa-b1-cando-08-readiness-routing",
    level: "B1",
    focus: "readiness_routing",
    title_en: "I can choose my next learning route",
    title_vi: "Tôi có thể chọn lộ trình học tiếp theo",
    learnerContext_en: "You use can-do evidence to decide whether to review B1 or prepare for B2.",
    learnerContext_vi: "Bạn dùng bằng chứng can-do để quyết định ôn B1 hay chuẩn bị B2.",
    canadaContext: "Useful for tutoring sessions, settlement classes, self-study logs, and progress reviews.",
    checkpoint: {
      canDo_en: "I can name what I can do, what still needs practice, and my next route.",
      canDo_vi: "Tôi có thể nêu điều mình làm được, điều còn cần luyện và lộ trình tiếp theo.",
      evidencePrompt_en: "After a B1 role-play, say whether you are ready for B2 bridge tasks.",
      evidencePrompt_vi: "Sau vai diễn B1, nói bạn đã sẵn sàng cho nhiệm vụ cầu nối B2 chưa.",
      readyWhen_en: ["Names one strength.", "Names one weak skill.", "Chooses review, B2 bridge, or teacher review."],
      readyWhen_vi: ["Nêu một điểm mạnh.", "Nêu một kỹ năng yếu.", "Chọn ôn tập, cầu nối B2 hoặc giáo viên xem lại."],
      routeIfReady_en: "Move to B2 bridge tasks while keeping Shahmukhi as awareness only, not a full course.",
      routeIfReady_vi: "Chuyển sang nhiệm vụ cầu nối B2, vẫn giữ Shahmukhi ở mức nhận biết, không phải khóa học đầy đủ.",
      routeIfNeedsPractice_en: "Review the B1 can-do item with the weakest evidence. Native review is deferred.",
      routeIfNeedsPractice_vi: "Ôn mục can-do B1 có bằng chứng yếu nhất. Phần người bản ngữ xem lại được để sau.",
    },
    usefulLanguage: [
      { pa: "ਮੈਂ ਸੇਵਾ ਗੱਲਬਾਤ ਕਰ ਸਕਦਾ ਹਾਂ।", romanization: "main seva galbaat kar sakda han.", en: "I can handle a service conversation.", vi: "Tôi có thể xử lý hội thoại dịch vụ." },
      { pa: "ਮੈਨੂੰ ਹੋਰ ਸਪਸ਼ਟੀਕਰਨ ਅਭਿਆਸ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu hor spashtikaran abhyas chahidi hai.", en: "I need more clarification practice.", vi: "Tôi cần luyện thêm làm rõ thông tin." },
      { pa: "ਮੈਂ ਪਹਿਲਾਂ B1 ਦੁਹਰਾਵਾਂਗਾ, ਫਿਰ B2 ਸ਼ੁਰੂ ਕਰਾਂਗਾ।", romanization: "main pahilan B1 duhravanga, phir B2 shuru karanga.", en: "I will review B1 first, then start B2.", vi: "Tôi sẽ ôn B1 trước, rồi bắt đầu B2." },
    ],
    modelEvidence: {
      pa: "ਮੈਂ ਸੇਵਾ ਗੱਲਬਾਤ ਕਰ ਸਕਦਾ ਹਾਂ, ਪਰ ਮੈਨੂੰ ਹੋਰ ਸਪਸ਼ਟੀਕਰਨ ਅਭਿਆਸ ਚਾਹੀਦੀ ਹੈ। ਮੈਂ ਪਹਿਲਾਂ B1 ਦੁਹਰਾਵਾਂਗਾ, ਫਿਰ B2 ਸ਼ੁਰੂ ਕਰਾਂਗਾ।",
      romanization: "main seva galbaat kar sakda han, par mainu hor spashtikaran abhyas chahidi hai. main pahilan B1 duhravanga, phir B2 shuru karanga.",
      en: "I can handle a service conversation, but I need more clarification practice. I will review B1 first, then start B2.",
      vi: "Tôi có thể xử lý hội thoại dịch vụ, nhưng cần luyện thêm làm rõ thông tin. Tôi sẽ ôn B1 trước, rồi bắt đầu B2.",
    },
    commonTraps: [
      {
        trap_en: "Saying only 'I passed' without naming evidence or the next route.",
        trap_vi: "Chỉ nói 'tôi đã đạt' mà không nêu bằng chứng hoặc lộ trình tiếp theo.",
        better: { pa: "ਮੈਂ ਸਮੱਸਿਆ ਸਮਝਾ ਸਕਦਾ ਹਾਂ, ਪਰ ਫੋਨ ਤੇ ਹੋਰ ਅਭਿਆਸ ਚਾਹੀਦੀ ਹੈ।", romanization: "main samassia samjha sakda han, par phone te hor abhyas chahidi hai.", en: "I can explain a problem, but I need more practice on the phone.", vi: "Tôi có thể giải thích vấn đề, nhưng cần luyện thêm qua điện thoại." },
      },
    ],
  },
];
