// src/languages/punjabi/learnerJourneyB1.ts
//
// Punjabi B1 learner journey for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary; romanization is a support bridge. Shahmukhi is
// mentioned only for awareness, not taught as a full course.
//
// Native review is deferred; this module makes no native-review claim.

export type PunjabiB1LearnerJourneyFocus =
  | "situation_explanation"
  | "event_retelling"
  | "clarification_strategy"
  | "service_conversation"
  | "workplace_task"
  | "housing_school_community"
  | "register_aware_request"
  | "handoff_readiness";

export type PunjabiLearnerJourneyLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiLearnerJourneyTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiLearnerJourneyLine;
};

export type PunjabiLearnerJourneyCheckpoint = {
  canDo_en: string;
  canDo_vi: string;
  learnerAction_en: string;
  learnerAction_vi: string;
  readyEvidence_en: string[];
  readyEvidence_vi: string[];
};

export type PunjabiB1LearnerJourneyStep = {
  id: string;
  level: "B1";
  order: number;
  focus: PunjabiB1LearnerJourneyFocus;
  title_en: string;
  title_vi: string;
  journeyMoment_en: string;
  journeyMoment_vi: string;
  canadaContext: string;
  checkpoint: PunjabiLearnerJourneyCheckpoint;
  usefulLanguage: PunjabiLearnerJourneyLine[];
  handoffLine: PunjabiLearnerJourneyLine;
  commonTraps: PunjabiLearnerJourneyTrap[];
  nextStep_en: string;
  nextStep_vi: string;
};

export const punjabiB1LearnerJourney: PunjabiB1LearnerJourneyStep[] = [
  {
    id: "pa-b1-journey-01-explain",
    level: "B1",
    order: 1,
    focus: "situation_explanation",
    title_en: "Start by explaining real situations",
    title_vi: "Bắt đầu bằng giải thích tình huống thật",
    journeyMoment_en: "Learner explains what is wrong, why it matters, and what they need next.",
    journeyMoment_vi: "Người học giải thích có vấn đề gì, vì sao quan trọng và cần gì tiếp theo.",
    canadaContext: "Useful at apartment offices, libraries, community centres, and public counters in Canada.",
    checkpoint: {
      canDo_en: "I can explain a practical problem with location, impact, and next step.",
      canDo_vi: "Tôi có thể giải thích vấn đề thực tế với vị trí, ảnh hưởng và bước tiếp theo.",
      learnerAction_en: "Explain that a door card is not working and ask where to get help.",
      learnerAction_vi: "Giải thích thẻ cửa không hoạt động và hỏi nhận trợ giúp ở đâu.",
      readyEvidence_en: ["Problem is named.", "Impact is clear.", "Next step is requested politely."],
      readyEvidence_vi: ["Vấn đề được nêu.", "Ảnh hưởng rõ.", "Yêu cầu bước tiếp theo lịch sự."],
    },
    usefulLanguage: [
      { pa: "ਮੇਰਾ ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "mera card kam nahin kar riha.", en: "My card is not working.", vi: "Thẻ của tôi không hoạt động." },
      { pa: "ਦਰਵਾਜ਼ਾ ਨਹੀਂ ਖੁੱਲਦਾ।", romanization: "darvaza nahin khulda.", en: "The door does not open.", vi: "Cửa không mở." },
      { pa: "ਮੈਨੂੰ ਮਦਦ ਕਿੱਥੇ ਮਿਲ ਸਕਦੀ ਹੈ?", romanization: "mainu madad kitthe mil sakdi hai?", en: "Where can I get help?", vi: "Tôi có thể nhận trợ giúp ở đâu?" },
    ],
    handoffLine: {
      pa: "ਮੇਰਾ ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ, ਇਸ ਲਈ ਦਰਵਾਜ਼ਾ ਨਹੀਂ ਖੁੱਲਦਾ। ਮੈਨੂੰ ਮਦਦ ਕਿੱਥੇ ਮਿਲ ਸਕਦੀ ਹੈ?",
      romanization: "mera card kam nahin kar riha, is lai darvaza nahin khulda. mainu madad kitthe mil sakdi hai?",
      en: "My card is not working, so the door does not open. Where can I get help?",
      vi: "Thẻ của tôi không hoạt động, nên cửa không mở. Tôi có thể nhận trợ giúp ở đâu?",
    },
    commonTraps: [
      {
        trap_en: "Naming the object without the effect.",
        trap_vi: "Nêu đồ vật mà không nói ảnh hưởng.",
        better: { pa: "ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰਦਾ, ਇਸ ਲਈ ਦਰਵਾਜ਼ਾ ਨਹੀਂ ਖੁੱਲਦਾ।", romanization: "card kam nahin karda, is lai darvaza nahin khulda.", en: "The card does not work, so the door does not open.", vi: "Thẻ không hoạt động, nên cửa không mở." },
      },
    ],
    nextStep_en: "Move to event retelling once the learner can explain problem plus impact.",
    nextStep_vi: "Chuyển sang kể lại sự việc khi người học giải thích được vấn đề cộng ảnh hưởng.",
  },
  {
    id: "pa-b1-journey-02-retell",
    level: "B1",
    order: 2,
    focus: "event_retelling",
    title_en: "Retell what happened",
    title_vi: "Kể lại chuyện đã xảy ra",
    journeyMoment_en: "Learner retells events in order with a cause and result.",
    journeyMoment_vi: "Người học kể lại sự việc theo thứ tự với nguyên nhân và kết quả.",
    canadaContext: "Useful for transit delays, workplace updates, school calls, and appointment explanations.",
    checkpoint: {
      canDo_en: "I can retell a short event using first, then, and because of this.",
      canDo_vi: "Tôi có thể kể lại một sự việc ngắn bằng trước tiên, sau đó và vì vậy.",
      learnerAction_en: "Retell why you arrived late after the bus changed.",
      learnerAction_vi: "Kể lại vì sao bạn đến muộn sau khi xe buýt thay đổi.",
      readyEvidence_en: ["Events are ordered.", "Reason is included.", "Result or next action is included."],
      readyEvidence_vi: ["Sự việc có thứ tự.", "Có lý do.", "Có kết quả hoặc hành động tiếp theo."],
    },
    usefulLanguage: [
      { pa: "ਪਹਿਲਾਂ ਬੱਸ ਦੇਰ ਨਾਲ ਆਈ।", romanization: "pahilan bus der naal aai.", en: "First the bus came late.", vi: "Trước tiên xe buýt đến muộn." },
      { pa: "ਫਿਰ ਅਗਲੀ ਬੱਸ ਨਿਕਲ ਗਈ।", romanization: "phir agli bus nikal gai.", en: "Then the next bus left.", vi: "Sau đó chuyến xe tiếp theo đã đi." },
      { pa: "ਇਸ ਕਰਕੇ ਮੈਂ ਦੇਰ ਨਾਲ ਆਇਆ।", romanization: "is karke main der naal aaya.", en: "Because of this I came late.", vi: "Vì vậy tôi đến muộn." },
    ],
    handoffLine: {
      pa: "ਪਹਿਲਾਂ ਬੱਸ ਦੇਰ ਨਾਲ ਆਈ। ਫਿਰ ਅਗਲੀ ਬੱਸ ਨਿਕਲ ਗਈ। ਇਸ ਕਰਕੇ ਮੈਂ ਦੇਰ ਨਾਲ ਆਇਆ ਅਤੇ ਸੁਨੇਹਾ ਭੇਜਿਆ।",
      romanization: "pahilan bus der naal aai. phir agli bus nikal gai. is karke main der naal aaya ate suneha bhejia.",
      en: "First the bus came late. Then the next bus left. Because of this I came late and sent a message.",
      vi: "Trước tiên xe buýt đến muộn. Sau đó chuyến xe tiếp theo đã đi. Vì vậy tôi đến muộn và đã nhắn tin.",
    },
    commonTraps: [
      {
        trap_en: "Retelling without sequence markers.",
        trap_vi: "Kể lại mà không dùng từ nối trình tự.",
        better: { pa: "ਪਹਿਲਾਂ..., ਫਿਰ..., ਇਸ ਕਰਕੇ...", romanization: "pahilan..., phir..., is karke...", en: "First..., then..., because of this...", vi: "Trước tiên..., sau đó..., vì vậy..." },
      },
    ],
    nextStep_en: "Move to clarification when the learner can retell cause and result.",
    nextStep_vi: "Chuyển sang làm rõ khi người học kể được nguyên nhân và kết quả.",
  },
  {
    id: "pa-b1-journey-03-clarify",
    level: "B1",
    order: 3,
    focus: "clarification_strategy",
    title_en: "Clarify fast information",
    title_vi: "Làm rõ thông tin nói nhanh",
    journeyMoment_en: "Learner asks for repetition, confirms key details, and requests written follow-up. Language support only, not legal or medical advice.",
    journeyMoment_vi: "Người học xin nhắc lại, xác nhận chi tiết chính và yêu cầu theo dõi bằng văn bản. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn pháp lý hoặc y tế.",
    canadaContext: "Useful for phone calls with clinics, schools, offices, and settlement agencies.",
    checkpoint: {
      canDo_en: "I can clarify dates, documents, places, and next steps.",
      canDo_vi: "Tôi có thể làm rõ ngày, giấy tờ, địa điểm và bước tiếp theo.",
      learnerAction_en: "Ask an office to repeat the deadline and confirm it by email.",
      learnerAction_vi: "Xin văn phòng nhắc lại hạn chót và xác nhận qua email.",
      readyEvidence_en: ["Asks for slower repetition.", "Repeats detail back.", "Requests written confirmation."],
      readyEvidence_vi: ["Xin nhắc lại chậm hơn.", "Lặp lại chi tiết.", "Yêu cầu xác nhận bằng văn bản."],
    },
    usefulLanguage: [
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਬਾਰਾ ਕਹੋ।", romanization: "kirpa karke hauli dubara kaho.", en: "Please say it again slowly.", vi: "Vui lòng nói lại chậm hơn." },
      { pa: "ਕੀ ਮਿਤੀ ਸੋਮਵਾਰ ਹੈ?", romanization: "ki miti somvaar hai?", en: "Is the date Monday?", vi: "Ngày đó là thứ Hai phải không?" },
      { pa: "ਕੀ ਤੁਸੀਂ ਈਮੇਲ ਵਿੱਚ ਪੁਸ਼ਟੀ ਭੇਜ ਸਕਦੇ ਹੋ?", romanization: "ki tusin email vich pushti bhej sakde ho?", en: "Can you send confirmation by email?", vi: "Bạn có thể gửi xác nhận qua email không?" },
    ],
    handoffLine: {
      pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਬਾਰਾ ਕਹੋ। ਕੀ ਮਿਤੀ ਸੋਮਵਾਰ ਹੈ? ਕੀ ਤੁਸੀਂ ਈਮੇਲ ਵਿੱਚ ਪੁਸ਼ਟੀ ਭੇਜ ਸਕਦੇ ਹੋ?",
      romanization: "kirpa karke hauli dubara kaho. ki miti somvaar hai? ki tusin email vich pushti bhej sakde ho?",
      en: "Please say it again slowly. Is the date Monday? Can you send confirmation by email?",
      vi: "Vui lòng nói lại chậm hơn. Ngày đó là thứ Hai phải không? Bạn có thể gửi xác nhận qua email không?",
    },
    commonTraps: [
      {
        trap_en: "Pretending to understand numbers and dates.",
        trap_vi: "Giả vờ hiểu số và ngày tháng.",
        better: { pa: "ਮਿਤੀ ਅਤੇ ਸਮਾਂ ਫਿਰ ਦੱਸੋ ਜੀ।", romanization: "miti ate sama phir dasso ji.", en: "Please tell me the date and time again.", vi: "Vui lòng cho tôi biết lại ngày và giờ." },
      },
    ],
    nextStep_en: "Move to service conversations when the learner can repair misunderstanding.",
    nextStep_vi: "Chuyển sang hội thoại dịch vụ khi người học xử lý được hiểu nhầm.",
  },
  {
    id: "pa-b1-journey-04-service",
    level: "B1",
    order: 4,
    focus: "service_conversation",
    title_en: "Handle service conversations",
    title_vi: "Xử lý hội thoại dịch vụ",
    journeyMoment_en: "Learner asks about a fee or service issue politely and confirms correction timing.",
    journeyMoment_vi: "Người học hỏi về khoản phí hoặc vấn đề dịch vụ lịch sự và xác nhận thời gian sửa.",
    canadaContext: "Useful for bank, phone, utility, transit, library, and customer-service contexts.",
    checkpoint: {
      canDo_en: "I can ask about an unexpected fee without blaming staff.",
      canDo_vi: "Tôi có thể hỏi về khoản phí bất ngờ mà không đổ lỗi cho nhân viên.",
      learnerAction_en: "Ask why a charge appears and when correction will happen.",
      learnerAction_vi: "Hỏi vì sao có khoản phí và khi nào sẽ sửa.",
      readyEvidence_en: ["Polite opening.", "Factual question.", "Correction timing is requested."],
      readyEvidence_vi: ["Mở đầu lịch sự.", "Câu hỏi theo sự việc.", "Có hỏi thời gian sửa."],
    },
    usefulLanguage: [
      { pa: "ਮੇਰੇ ਬਿੱਲ ਵਿੱਚ ਇਹ ਚਾਰਜ ਕੀ ਹੈ?", romanization: "mere bill vich eh charge ki hai?", en: "What is this charge on my bill?", vi: "Khoản phí này trên hóa đơn của tôi là gì?" },
      { pa: "ਕੀ ਇਹ ਗਲਤੀ ਹੋ ਸਕਦੀ ਹੈ?", romanization: "ki eh galti ho sakdi hai?", en: "Could this be a mistake?", vi: "Đây có thể là lỗi không?" },
      { pa: "ਠੀਕ ਹੋਣ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?", romanization: "theek hon vich kinna sama laggega?", en: "How long will it take to be corrected?", vi: "Sẽ mất bao lâu để sửa?" },
    ],
    handoffLine: {
      pa: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਮੇਰੇ ਬਿੱਲ ਵਿੱਚ ਇਹ ਚਾਰਜ ਕੀ ਹੈ? ਕੀ ਇਹ ਗਲਤੀ ਹੋ ਸਕਦੀ ਹੈ? ਠੀਕ ਹੋਣ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?",
      romanization: "maaf karna ji, mere bill vich eh charge ki hai? ki eh galti ho sakdi hai? theek hon vich kinna sama laggega?",
      en: "Excuse me, what is this charge on my bill? Could this be a mistake? How long will it take to be corrected?",
      vi: "Xin lỗi, khoản phí này trên hóa đơn của tôi là gì? Đây có thể là lỗi không? Sẽ mất bao lâu để sửa?",
    },
    commonTraps: [
      {
        trap_en: "Starting with anger before asking for an explanation.",
        trap_vi: "Bắt đầu bằng giận dữ trước khi hỏi giải thích.",
        better: { pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਚਾਰਜ ਸਮਝਾ ਦਿਓ।", romanization: "kirpa karke eh charge samjha dio.", en: "Please explain this charge.", vi: "Vui lòng giải thích khoản phí này." },
      },
    ],
    nextStep_en: "Move to workplace tasks when service questions stay factual and polite.",
    nextStep_vi: "Chuyển sang nhiệm vụ nơi làm việc khi câu hỏi dịch vụ giữ được sự việc và lịch sự.",
  },
  {
    id: "pa-b1-journey-05-workplace",
    level: "B1",
    order: 5,
    focus: "workplace_task",
    title_en: "Report workplace blockers",
    title_vi: "Báo cáo trở ngại nơi làm việc",
    journeyMoment_en: "Learner reports blockers, current status, and a realistic alternative.",
    journeyMoment_vi: "Người học báo cáo trở ngại, tình trạng hiện tại và phương án thay thế thực tế.",
    canadaContext: "Useful in offices, retail, warehouses, restaurants, and community-service jobs.",
    checkpoint: {
      canDo_en: "I can explain why a task is delayed and ask what priority comes next.",
      canDo_vi: "Tôi có thể giải thích vì sao việc bị chậm và hỏi ưu tiên tiếp theo là gì.",
      learnerAction_en: "Tell a supervisor supplies are missing and offer another task.",
      learnerAction_vi: "Nói với quản lý thiếu đồ cung ứng và đề xuất việc khác.",
      readyEvidence_en: ["Blocker is named.", "Impact is explained.", "Alternative is offered."],
      readyEvidence_vi: ["Trở ngại được nêu.", "Ảnh hưởng được giải thích.", "Có đưa phương án khác."],
    },
    usefulLanguage: [
      { pa: "ਸਪਲਾਈ ਅਜੇ ਨਹੀਂ ਆਈ।", romanization: "supply aje nahin aai.", en: "The supply has not arrived yet.", vi: "Đồ cung ứng vẫn chưa đến." },
      { pa: "ਇਹ ਕੰਮ ਅੱਜ ਪੂਰਾ ਨਹੀਂ ਹੋ ਸਕਦਾ।", romanization: "eh kam ajj pura nahin ho sakda.", en: "This task cannot be finished today.", vi: "Việc này không thể hoàn thành hôm nay." },
      { pa: "ਮੈਂ ਦੂਜਾ ਕੰਮ ਪਹਿਲਾਂ ਕਰ ਸਕਦਾ ਹਾਂ।", romanization: "main duja kam pahilan kar sakda han.", en: "I can do another task first.", vi: "Tôi có thể làm việc khác trước." },
    ],
    handoffLine: {
      pa: "ਸਪਲਾਈ ਅਜੇ ਨਹੀਂ ਆਈ, ਇਸ ਲਈ ਇਹ ਕੰਮ ਅੱਜ ਪੂਰਾ ਨਹੀਂ ਹੋ ਸਕਦਾ। ਮੈਂ ਦੂਜਾ ਕੰਮ ਪਹਿਲਾਂ ਕਰ ਸਕਦਾ ਹਾਂ।",
      romanization: "supply aje nahin aai, is lai eh kam ajj pura nahin ho sakda. main duja kam pahilan kar sakda han.",
      en: "The supply has not arrived yet, so this task cannot be finished today. I can do another task first.",
      vi: "Đồ cung ứng vẫn chưa đến, nên việc này không thể hoàn thành hôm nay. Tôi có thể làm việc khác trước.",
    },
    commonTraps: [
      {
        trap_en: "Saying only 'not possible' with no alternative.",
        trap_vi: "Chỉ nói 'không thể' mà không có phương án khác.",
        better: { pa: "ਇਹ ਅਜੇ ਨਹੀਂ ਹੋ ਸਕਦਾ, ਪਰ ਮੈਂ ਦੂਜਾ ਕੰਮ ਕਰ ਸਕਦਾ ਹਾਂ।", romanization: "eh aje nahin ho sakda, par main duja kam kar sakda han.", en: "This cannot be done yet, but I can do another task.", vi: "Việc này chưa làm được, nhưng tôi có thể làm việc khác." },
      },
    ],
    nextStep_en: "Move to housing, school, and community tasks after workplace updates are clear.",
    nextStep_vi: "Chuyển sang nhiệm vụ nhà ở, trường học và cộng đồng sau khi cập nhật công việc rõ.",
  },
  {
    id: "pa-b1-journey-06-housing-school-community",
    level: "B1",
    order: 6,
    focus: "housing_school_community",
    title_en: "Handle housing, school, and community tasks",
    title_vi: "Xử lý nhiệm vụ nhà ở, trường học và cộng đồng",
    journeyMoment_en: "Learner asks practical questions about schedules, registration, forms, and repairs.",
    journeyMoment_vi: "Người học đặt câu hỏi thực tế về lịch, đăng ký, mẫu đơn và sửa chữa.",
    canadaContext: "Useful for schools, childcare, tenant offices, community centres, and newcomer programs.",
    checkpoint: {
      canDo_en: "I can ask practical next-step questions with enough detail.",
      canDo_vi: "Tôi có thể hỏi bước tiếp theo thực tế với đủ chi tiết.",
      learnerAction_en: "Ask about changed pickup time and whether a form is needed.",
      learnerAction_vi: "Hỏi về giờ đón đã thay đổi và có cần mẫu đơn không.",
      readyEvidence_en: ["Person or place is identified.", "Changed detail is clear.", "Next action is requested."],
      readyEvidence_vi: ["Xác định người hoặc nơi.", "Chi tiết thay đổi rõ.", "Có hỏi hành động tiếp theo."],
    },
    usefulLanguage: [
      { pa: "ਅੱਜ ਪਿਕਅੱਪ ਸਮਾਂ ਬਦਲ ਗਿਆ ਹੈ।", romanization: "ajj pickup sama badal gia hai.", en: "Today the pickup time has changed.", vi: "Hôm nay giờ đón đã thay đổi." },
      { pa: "ਤਿੰਨ ਵਜੇ, ਚਾਰ ਵਜੇ ਨਹੀਂ।", romanization: "tinn vaje, char vaje nahin.", en: "At three, not four.", vi: "Lúc ba giờ, không phải bốn giờ." },
      { pa: "ਕੀ ਕੋਈ ਫਾਰਮ ਭਰਨਾ ਹੈ?", romanization: "ki koi form bharna hai?", en: "Is there a form to fill out?", vi: "Có mẫu đơn nào cần điền không?" },
    ],
    handoffLine: {
      pa: "ਅੱਜ ਮੇਰੇ ਬੱਚੇ ਦਾ ਪਿਕਅੱਪ ਸਮਾਂ ਬਦਲ ਗਿਆ ਹੈ। ਤਿੰਨ ਵਜੇ, ਚਾਰ ਵਜੇ ਨਹੀਂ। ਕੀ ਕੋਈ ਫਾਰਮ ਭਰਨਾ ਹੈ?",
      romanization: "ajj mere bache da pickup sama badal gia hai. tinn vaje, char vaje nahin. ki koi form bharna hai?",
      en: "Today my child's pickup time has changed. At three, not four. Is there a form to fill out?",
      vi: "Hôm nay giờ đón con tôi đã thay đổi. Lúc ba giờ, không phải bốn giờ. Có mẫu đơn nào cần điền không?",
    },
    commonTraps: [
      {
        trap_en: "Forgetting to say whose schedule changed.",
        trap_vi: "Quên nói lịch của ai thay đổi.",
        better: { pa: "ਮੇਰੇ ਬੱਚੇ ਦਾ ਪਿਕਅੱਪ ਸਮਾਂ ਬਦਲ ਗਿਆ ਹੈ।", romanization: "mere bache da pickup sama badal gia hai.", en: "My child's pickup time has changed.", vi: "Giờ đón con tôi đã thay đổi." },
      },
    ],
    nextStep_en: "Move to register-aware requests when practical questions include enough detail.",
    nextStep_vi: "Chuyển sang yêu cầu đúng mức lịch sự khi câu hỏi thực tế đủ chi tiết.",
  },
  {
    id: "pa-b1-journey-07-register",
    level: "B1",
    order: 7,
    focus: "register_aware_request",
    title_en: "Make register-aware requests",
    title_vi: "Đưa ra yêu cầu đúng mức lịch sự",
    journeyMoment_en: "Learner chooses polite address, softens requests, and avoids direct transfer from English or Vietnamese.",
    journeyMoment_vi: "Người học chọn cách xưng hô lịch sự, làm mềm yêu cầu và tránh chuyển di trực tiếp từ tiếng Anh hoặc tiếng Việt.",
    canadaContext: "Useful with staff, teachers, supervisors, neighbours, elders, and service workers.",
    checkpoint: {
      canDo_en: "I can use ਤੁਸੀਂ, ਜੀ, and question forms with unfamiliar adults.",
      canDo_vi: "Tôi có thể dùng ਤੁਸੀਂ, ਜੀ và dạng câu hỏi với người lớn chưa thân.",
      learnerAction_en: "Ask staff to explain a form again politely.",
      learnerAction_vi: "Nhờ nhân viên giải thích lại mẫu đơn một cách lịch sự.",
      readyEvidence_en: ["Uses ਤੁਸੀਂ.", "Uses a question form.", "Adds ਜੀ or ਕਿਰਪਾ ਕਰਕੇ naturally."],
      readyEvidence_vi: ["Dùng ਤੁਸੀਂ.", "Dùng dạng câu hỏi.", "Thêm ਜੀ hoặc ਕਿਰਪਾ ਕਰਕੇ tự nhiên."],
    },
    usefulLanguage: [
      { pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਦੁਬਾਰਾ ਸਮਝਾ ਸਕਦੇ ਹੋ?", romanization: "ki tusin eh dubara samjha sakde ho?", en: "Can you explain this again?", vi: "Bạn có thể giải thích lại không?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਾਈਨ ਦਿਖਾ ਦਿਓ।", romanization: "kirpa karke eh line dikha dio.", en: "Please show me this line.", vi: "Vui lòng chỉ cho tôi dòng này." },
      { pa: "ਧੰਨਵਾਦ ਜੀ, ਹੁਣ ਸਮਝ ਆ ਗਿਆ।", romanization: "dhannvaad ji, hun samajh aa gia.", en: "Thank you, now I understand.", vi: "Cảm ơn, bây giờ tôi hiểu rồi." },
    ],
    handoffLine: {
      pa: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਕੀ ਤੁਸੀਂ ਇਹ ਫਾਰਮ ਦੁਬਾਰਾ ਸਮਝਾ ਸਕਦੇ ਹੋ? ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਾਈਨ ਦਿਖਾ ਦਿਓ।",
      romanization: "maaf karna ji, ki tusin eh form dubara samjha sakde ho? kirpa karke eh line dikha dio.",
      en: "Excuse me, can you explain this form again? Please show me this line.",
      vi: "Xin lỗi, bạn có thể giải thích lại mẫu đơn này không? Vui lòng chỉ cho tôi dòng này.",
    },
    commonTraps: [
      {
        trap_en: "Using informal ਤੂੰ or a direct command with staff.",
        trap_vi: "Dùng ਤੂੰ thân mật hoặc mệnh lệnh trực tiếp với nhân viên.",
        better: { pa: "ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ ਜੀ?", romanization: "ki tusin madad kar sakde ho ji?", en: "Could you help, please?", vi: "Bạn có thể vui lòng giúp không?" },
      },
    ],
    nextStep_en: "Move to final handoff once register is polite and consistent.",
    nextStep_vi: "Chuyển sang bàn giao cuối khi mức lịch sự ổn định.",
  },
  {
    id: "pa-b1-journey-08-handoff",
    level: "B1",
    order: 8,
    focus: "handoff_readiness",
    title_en: "Choose the B1 handoff route",
    title_vi: "Chọn lộ trình bàn giao B1",
    journeyMoment_en: "Learner names strengths, weak points, and the next route after B1. Shahmukhi is awareness only, not a full course.",
    journeyMoment_vi: "Người học nêu điểm mạnh, điểm yếu và lộ trình sau B1. Shahmukhi chỉ để nhận biết, không phải khóa học đầy đủ.",
    canadaContext: "Useful for tutoring, settlement classes, self-study plans, and progress meetings.",
    checkpoint: {
      canDo_en: "I can summarize my B1 readiness and choose review, B2 bridge, or teacher review.",
      canDo_vi: "Tôi có thể tóm tắt mức sẵn sàng B1 và chọn ôn tập, cầu nối B2 hoặc giáo viên xem lại.",
      learnerAction_en: "Say what you can do, what needs practice, and your next route.",
      learnerAction_vi: "Nói bạn làm được gì, cần luyện gì và lộ trình tiếp theo.",
      readyEvidence_en: ["Names a strength.", "Names a weak skill.", "Chooses a route without claiming native review."],
      readyEvidence_vi: ["Nêu một điểm mạnh.", "Nêu một kỹ năng yếu.", "Chọn lộ trình mà không tuyên bố có người bản ngữ xem lại."],
    },
    usefulLanguage: [
      { pa: "ਮੈਂ ਸੇਵਾ ਗੱਲਬਾਤ ਕਰ ਸਕਦਾ ਹਾਂ।", romanization: "main seva galbaat kar sakda han.", en: "I can handle service conversation.", vi: "Tôi có thể xử lý hội thoại dịch vụ." },
      { pa: "ਮੈਨੂੰ ਸਪਸ਼ਟੀਕਰਨ ਦੀ ਹੋਰ ਅਭਿਆਸ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu spashtikaran di hor abhyas chahidi hai.", en: "I need more clarification practice.", vi: "Tôi cần luyện thêm làm rõ thông tin." },
      { pa: "ਮੈਂ ਪਹਿਲਾਂ B1 ਦੁਹਰਾਵਾਂਗਾ, ਫਿਰ B2 ਸ਼ੁਰੂ ਕਰਾਂਗਾ।", romanization: "main pahilan B1 duhravanga, phir B2 shuru karanga.", en: "I will review B1 first, then start B2.", vi: "Tôi sẽ ôn B1 trước, rồi bắt đầu B2." },
    ],
    handoffLine: {
      pa: "ਮੈਂ ਸੇਵਾ ਗੱਲਬਾਤ ਕਰ ਸਕਦਾ ਹਾਂ, ਪਰ ਮੈਨੂੰ ਸਪਸ਼ਟੀਕਰਨ ਦੀ ਹੋਰ ਅਭਿਆਸ ਚਾਹੀਦੀ ਹੈ। ਮੈਂ ਪਹਿਲਾਂ B1 ਦੁਹਰਾਵਾਂਗਾ, ਫਿਰ B2 ਸ਼ੁਰੂ ਕਰਾਂਗਾ।",
      romanization: "main seva galbaat kar sakda han, par mainu spashtikaran di hor abhyas chahidi hai. main pahilan B1 duhravanga, phir B2 shuru karanga.",
      en: "I can handle service conversation, but I need more clarification practice. I will review B1 first, then start B2.",
      vi: "Tôi có thể xử lý hội thoại dịch vụ, nhưng cần luyện thêm làm rõ thông tin. Tôi sẽ ôn B1 trước, rồi bắt đầu B2.",
    },
    commonTraps: [
      {
        trap_en: "Saying 'complete' without evidence or claiming native review.",
        trap_vi: "Nói 'hoàn thành' mà không có bằng chứng hoặc tuyên bố đã có người bản ngữ xem lại.",
        better: { pa: "ਮੈਨੂੰ ਫੋਨ ਤੇ ਹੋਰ ਅਭਿਆਸ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu phone te hor abhyas chahidi hai.", en: "I need more phone practice.", vi: "Tôi cần luyện thêm qua điện thoại." },
      },
    ],
    nextStep_en: "Route to targeted B1 review, B2 bridge, or teacher review. Native review is deferred.",
    nextStep_vi: "Chuyển sang ôn B1 có mục tiêu, cầu nối B2 hoặc giáo viên xem lại. Phần người bản ngữ xem lại được để sau.",
  },
];
