// src/languages/punjabi/goldenSamplesB1.ts
//
// Punjabi B1 golden samples for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary; romanization is a support bridge. Shahmukhi is
// mentioned only for awareness, not taught as a full course.
//
// Native review is deferred; this module makes no native-review claim.

export type PunjabiB1GoldenSampleFocus =
  | "explain_situation"
  | "retell_event"
  | "ask_clarification"
  | "polite_complaint"
  | "service_conversation"
  | "workplace_task"
  | "housing_school_community"
  | "register_readiness";

export type PunjabiGoldenSampleLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiGoldenSampleTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiGoldenSampleLine;
};

export type PunjabiGoldenSampleQA = {
  finalPrompt_en: string;
  finalPrompt_vi: string;
  sampleAnswer: PunjabiGoldenSampleLine;
  whyItWorks_en: string[];
  whyItWorks_vi: string[];
};

export type PunjabiB1GoldenSample = {
  id: string;
  level: "B1";
  focus: PunjabiB1GoldenSampleFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  usefulLanguage: PunjabiGoldenSampleLine[];
  qa: PunjabiGoldenSampleQA;
  commonTraps: PunjabiGoldenSampleTrap[];
  integrationReadiness_en: string;
  integrationReadiness_vi: string;
};

export const punjabiB1GoldenSamples: PunjabiB1GoldenSample[] = [
  {
    id: "pa-b1-golden-01-explain-situation",
    level: "B1",
    focus: "explain_situation",
    title_en: "Golden sample: explain a practical situation",
    title_vi: "Mẫu chuẩn: giải thích tình huống thực tế",
    scenario_en: "Your access card does not open a community centre door.",
    scenario_vi: "Thẻ ra vào của bạn không mở được cửa trung tâm cộng đồng.",
    canadaContext: "Useful at libraries, recreation centres, settlement agencies, and building offices in Canada.",
    usefulLanguage: [
      { pa: "ਮੇਰਾ ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "mera card kam nahin kar riha.", en: "My card is not working.", vi: "Thẻ của tôi không hoạt động." },
      { pa: "ਦਰਵਾਜ਼ਾ ਨਹੀਂ ਖੁੱਲਦਾ।", romanization: "darvaza nahin khulda.", en: "The door does not open.", vi: "Cửa không mở." },
      { pa: "ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਦੱਸੋ ਜੀ।", romanization: "mainu agla kadam dasso ji.", en: "Please tell me the next step.", vi: "Vui lòng cho tôi biết bước tiếp theo." },
    ],
    qa: {
      finalPrompt_en: "Explain the card problem and ask what to do next.",
      finalPrompt_vi: "Giải thích vấn đề thẻ và hỏi nên làm gì tiếp.",
      sampleAnswer: {
        pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਮੇਰਾ ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ। ਇਸ ਕਰਕੇ ਦਰਵਾਜ਼ਾ ਨਹੀਂ ਖੁੱਲਦਾ। ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਦੱਸੋ ਜੀ।",
        romanization: "sat sri akal ji, mera card kam nahin kar riha. is karke darvaza nahin khulda. mainu agla kadam dasso ji.",
        en: "Hello, my card is not working. Because of this the door does not open. Please tell me the next step.",
        vi: "Xin chào, thẻ của tôi không hoạt động. Vì vậy cửa không mở. Vui lòng cho tôi biết bước tiếp theo.",
      },
      whyItWorks_en: ["Polite opening.", "Problem and impact are clear.", "Next step is requested."],
      whyItWorks_vi: ["Mở đầu lịch sự.", "Vấn đề và ảnh hưởng rõ.", "Có yêu cầu bước tiếp theo."],
    },
    commonTraps: [
      {
        trap_en: "Saying only 'card problem' without effect.",
        trap_vi: "Chỉ nói 'vấn đề thẻ' mà không nêu ảnh hưởng.",
        better: { pa: "ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰਦਾ, ਇਸ ਲਈ ਦਰਵਾਜ਼ਾ ਨਹੀਂ ਖੁੱਲਦਾ।", romanization: "card kam nahin karda, is lai darvaza nahin khulda.", en: "The card does not work, so the door does not open.", vi: "Thẻ không hoạt động, nên cửa không mở." },
      },
    ],
    integrationReadiness_en: "Ready when the learner can state problem, impact, and next step without switching to English.",
    integrationReadiness_vi: "Sẵn sàng khi người học nêu được vấn đề, ảnh hưởng và bước tiếp theo mà không chuyển sang tiếng Anh.",
  },
  {
    id: "pa-b1-golden-02-retell-event",
    level: "B1",
    focus: "retell_event",
    title_en: "Golden sample: retell an event",
    title_vi: "Mẫu chuẩn: kể lại sự việc",
    scenario_en: "A transit delay made you late for an appointment.",
    scenario_vi: "Trễ xe công cộng khiến bạn đến muộn cuộc hẹn.",
    canadaContext: "Useful for transit, school, work, clinic, and service-counter explanations.",
    usefulLanguage: [
      { pa: "ਪਹਿਲਾਂ ਬੱਸ ਦੇਰ ਨਾਲ ਆਈ।", romanization: "pahilan bus der naal aai.", en: "First the bus came late.", vi: "Trước tiên xe buýt đến muộn." },
      { pa: "ਫਿਰ ਅਗਲੀ ਬੱਸ ਨਿਕਲ ਗਈ।", romanization: "phir agli bus nikal gai.", en: "Then the next bus left.", vi: "Sau đó chuyến xe tiếp theo đã đi." },
      { pa: "ਇਸ ਕਰਕੇ ਮੈਂ ਦੇਰ ਨਾਲ ਪਹੁੰਚਿਆ।", romanization: "is karke main der naal pahunchia.", en: "Because of this I arrived late.", vi: "Vì vậy tôi đến muộn." },
    ],
    qa: {
      finalPrompt_en: "Retell why you arrived late and say what you did next.",
      finalPrompt_vi: "Kể lại vì sao bạn đến muộn và nói bạn đã làm gì tiếp theo.",
      sampleAnswer: {
        pa: "ਪਹਿਲਾਂ ਬੱਸ ਦੇਰ ਨਾਲ ਆਈ। ਫਿਰ ਅਗਲੀ ਬੱਸ ਨਿਕਲ ਗਈ। ਇਸ ਕਰਕੇ ਮੈਂ ਦੇਰ ਨਾਲ ਪਹੁੰਚਿਆ ਅਤੇ ਪਹਿਲਾਂ ਹੀ ਸੁਨੇਹਾ ਭੇਜਿਆ।",
        romanization: "pahilan bus der naal aai. phir agli bus nikal gai. is karke main der naal pahunchia ate pahilan hi suneha bhejia.",
        en: "First the bus came late. Then the next bus left. Because of this I arrived late and had already sent a message.",
        vi: "Trước tiên xe buýt đến muộn. Sau đó chuyến xe tiếp theo đã đi. Vì vậy tôi đến muộn và đã nhắn trước.",
      },
      whyItWorks_en: ["Sequence markers guide the listener.", "Cause and result are connected.", "Follow-up action is included."],
      whyItWorks_vi: ["Từ nối trình tự giúp người nghe theo dõi.", "Nguyên nhân và kết quả được nối.", "Có hành động tiếp theo."],
    },
    commonTraps: [
      {
        trap_en: "Listing facts without time order.",
        trap_vi: "Liệt kê sự việc mà không theo thứ tự thời gian.",
        better: { pa: "ਪਹਿਲਾਂ..., ਫਿਰ..., ਇਸ ਕਰਕੇ...", romanization: "pahilan..., phir..., is karke...", en: "First..., then..., because of this...", vi: "Trước tiên..., sau đó..., vì vậy..." },
      },
    ],
    integrationReadiness_en: "Ready when the learner can retell in order and include a result.",
    integrationReadiness_vi: "Sẵn sàng khi người học kể theo thứ tự và có kết quả.",
  },
  {
    id: "pa-b1-golden-03-ask-clarification",
    level: "B1",
    focus: "ask_clarification",
    title_en: "Golden sample: ask clarification",
    title_vi: "Mẫu chuẩn: hỏi làm rõ",
    scenario_en: "An office gives a deadline quickly. Language support only, not legal or medical advice.",
    scenario_vi: "Một văn phòng nói nhanh hạn chót. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn pháp lý hoặc y tế.",
    canadaContext: "Useful for clinic, school, settlement, and public-service calls as language practice only.",
    usefulLanguage: [
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਬਾਰਾ ਕਹੋ।", romanization: "kirpa karke hauli dubara kaho.", en: "Please say it again slowly.", vi: "Vui lòng nói lại chậm hơn." },
      { pa: "ਕੀ ਮਿਤੀ ਸ਼ੁੱਕਰਵਾਰ ਹੈ?", romanization: "ki miti shukkarvaar hai?", en: "Is the date Friday?", vi: "Ngày đó là thứ Sáu phải không?" },
      { pa: "ਕੀ ਤੁਸੀਂ ਈਮੇਲ ਵਿੱਚ ਪੁਸ਼ਟੀ ਭੇਜ ਸਕਦੇ ਹੋ?", romanization: "ki tusin email vich pushti bhej sakde ho?", en: "Can you send confirmation by email?", vi: "Bạn có thể gửi xác nhận qua email không?" },
    ],
    qa: {
      finalPrompt_en: "Ask them to repeat the deadline and request email confirmation.",
      finalPrompt_vi: "Xin họ nhắc lại hạn chót và yêu cầu xác nhận qua email.",
      sampleAnswer: {
        pa: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਬਾਰਾ ਕਹੋ। ਕੀ ਮਿਤੀ ਸ਼ੁੱਕਰਵਾਰ ਹੈ? ਕੀ ਤੁਸੀਂ ਈਮੇਲ ਵਿੱਚ ਪੁਸ਼ਟੀ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization: "maaf karna ji, kirpa karke hauli dubara kaho. ki miti shukkarvaar hai? ki tusin email vich pushti bhej sakde ho?",
        en: "Sorry, please say it again slowly. Is the date Friday? Can you send confirmation by email?",
        vi: "Xin lỗi, vui lòng nói lại chậm hơn. Ngày đó là thứ Sáu phải không? Bạn có thể gửi xác nhận qua email không?",
      },
      whyItWorks_en: ["Asks for slower repetition.", "Confirms a key detail.", "Requests written follow-up."],
      whyItWorks_vi: ["Xin nhắc lại chậm hơn.", "Xác nhận chi tiết chính.", "Yêu cầu theo dõi bằng văn bản."],
    },
    commonTraps: [
      {
        trap_en: "Pretending to understand the date.",
        trap_vi: "Giả vờ hiểu ngày tháng.",
        better: { pa: "ਮਿਤੀ ਫਿਰ ਦੱਸੋ ਜੀ।", romanization: "miti phir dasso ji.", en: "Please tell me the date again.", vi: "Vui lòng cho tôi biết lại ngày." },
      },
    ],
    integrationReadiness_en: "Ready when the learner repairs misunderstanding without advice claims.",
    integrationReadiness_vi: "Sẵn sàng khi người học xử lý hiểu nhầm mà không đưa ra tuyên bố tư vấn.",
  },
  {
    id: "pa-b1-golden-04-polite-complaint",
    level: "B1",
    focus: "polite_complaint",
    title_en: "Golden sample: polite complaint",
    title_vi: "Mẫu chuẩn: khiếu nại lịch sự",
    scenario_en: "An unexpected fee appears on a bill.",
    scenario_vi: "Một khoản phí bất ngờ xuất hiện trên hóa đơn.",
    canadaContext: "Useful for phone, bank, transit, utility, and service-counter conversations.",
    usefulLanguage: [
      { pa: "ਮੇਰੇ ਬਿੱਲ ਵਿੱਚ ਇਹ ਚਾਰਜ ਕੀ ਹੈ?", romanization: "mere bill vich eh charge ki hai?", en: "What is this charge on my bill?", vi: "Khoản phí này trên hóa đơn của tôi là gì?" },
      { pa: "ਕੀ ਇਹ ਗਲਤੀ ਹੋ ਸਕਦੀ ਹੈ?", romanization: "ki eh galti ho sakdi hai?", en: "Could this be a mistake?", vi: "Đây có thể là lỗi không?" },
      { pa: "ਠੀਕ ਹੋਣ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?", romanization: "theek hon vich kinna sama laggega?", en: "How long will it take to be corrected?", vi: "Sẽ mất bao lâu để sửa?" },
    ],
    qa: {
      finalPrompt_en: "Ask about an unexpected fee and confirm correction timing.",
      finalPrompt_vi: "Hỏi về khoản phí bất ngờ và xác nhận thời gian sửa.",
      sampleAnswer: {
        pa: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਮੇਰੇ ਬਿੱਲ ਵਿੱਚ ਇਹ ਚਾਰਜ ਕੀ ਹੈ? ਕੀ ਇਹ ਗਲਤੀ ਹੋ ਸਕਦੀ ਹੈ? ਜੇ ਹਾਂ, ਠੀਕ ਹੋਣ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?",
        romanization: "maaf karna ji, mere bill vich eh charge ki hai? ki eh galti ho sakdi hai? je han, theek hon vich kinna sama laggega?",
        en: "Excuse me, what is this charge on my bill? Could this be a mistake? If yes, how long will it take to be corrected?",
        vi: "Xin lỗi, khoản phí này trên hóa đơn của tôi là gì? Đây có thể là lỗi không? Nếu đúng, sẽ mất bao lâu để sửa?",
      },
      whyItWorks_en: ["Polite opening.", "Complaint stays factual.", "Correction timing is requested."],
      whyItWorks_vi: ["Mở đầu lịch sự.", "Khiếu nại giữ tính sự việc.", "Có hỏi thời gian sửa."],
    },
    commonTraps: [
      {
        trap_en: "Blaming the staff before asking for an explanation.",
        trap_vi: "Đổ lỗi cho nhân viên trước khi hỏi giải thích.",
        better: { pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਚਾਰਜ ਸਮਝਾ ਦਿਓ।", romanization: "kirpa karke eh charge samjha dio.", en: "Please explain this charge.", vi: "Vui lòng giải thích khoản phí này." },
      },
    ],
    integrationReadiness_en: "Ready when the learner can complain politely and ask a practical next step.",
    integrationReadiness_vi: "Sẵn sàng khi người học có thể khiếu nại lịch sự và hỏi bước tiếp theo thực tế.",
  },
  {
    id: "pa-b1-golden-05-service-conversation",
    level: "B1",
    focus: "service_conversation",
    title_en: "Golden sample: service conversation",
    title_vi: "Mẫu chuẩn: hội thoại dịch vụ",
    scenario_en: "A service cannot be completed today and you need options.",
    scenario_vi: "Một dịch vụ không thể hoàn thành hôm nay và bạn cần lựa chọn.",
    canadaContext: "Useful for service counters, school offices, community centres, and customer support.",
    usefulLanguage: [
      { pa: "ਮੇਰੇ ਕੋਲ ਹੋਰ ਕਿਹੜੇ ਵਿਕਲਪ ਹਨ?", romanization: "mere kol hor kihre vikalp han?", en: "What other options do I have?", vi: "Tôi còn những lựa chọn nào khác?" },
      { pa: "ਕਿਹੜਾ ਵਿਕਲਪ ਜਲਦੀ ਹੈ?", romanization: "kihra vikalp jaldi hai?", en: "Which option is faster?", vi: "Lựa chọn nào nhanh hơn?" },
      { pa: "ਮੈਂ ਹੁਣ ਕੀ ਕਰਾਂ?", romanization: "main hun ki karan?", en: "What should I do now?", vi: "Bây giờ tôi nên làm gì?" },
    ],
    qa: {
      finalPrompt_en: "Ask for options and choose a next step.",
      finalPrompt_vi: "Hỏi các lựa chọn và chọn bước tiếp theo.",
      sampleAnswer: {
        pa: "ਜੇ ਇਹ ਅੱਜ ਨਹੀਂ ਹੋ ਸਕਦਾ, ਮੇਰੇ ਕੋਲ ਹੋਰ ਕਿਹੜੇ ਵਿਕਲਪ ਹਨ? ਕਿਹੜਾ ਵਿਕਲਪ ਜਲਦੀ ਹੈ, ਅਤੇ ਮੈਂ ਹੁਣ ਕੀ ਕਰਾਂ?",
        romanization: "je eh ajj nahin ho sakda, mere kol hor kihre vikalp han? kihra vikalp jaldi hai, ate main hun ki karan?",
        en: "If this cannot happen today, what other options do I have? Which option is faster, and what should I do now?",
        vi: "Nếu việc này không thể làm hôm nay, tôi còn lựa chọn nào khác? Lựa chọn nào nhanh hơn, và bây giờ tôi nên làm gì?",
      },
      whyItWorks_en: ["Asks options.", "Compares options.", "Requests a clear next step."],
      whyItWorks_vi: ["Hỏi lựa chọn.", "So sánh lựa chọn.", "Yêu cầu bước tiếp theo rõ."],
    },
    commonTraps: [
      {
        trap_en: "Asking only yes/no and missing alternatives.",
        trap_vi: "Chỉ hỏi có/không và bỏ lỡ phương án khác.",
        better: { pa: "ਹੋਰ ਕਿਹੜੇ ਵਿਕਲਪ ਹਨ?", romanization: "hor kihre vikalp han?", en: "What other options are there?", vi: "Có lựa chọn nào khác?" },
      },
    ],
    integrationReadiness_en: "Ready when the learner can ask options and confirm a next step.",
    integrationReadiness_vi: "Sẵn sàng khi người học hỏi được lựa chọn và xác nhận bước tiếp theo.",
  },
  {
    id: "pa-b1-golden-06-workplace-task",
    level: "B1",
    focus: "workplace_task",
    title_en: "Golden sample: workplace task",
    title_vi: "Mẫu chuẩn: nhiệm vụ nơi làm việc",
    scenario_en: "A supply has not arrived, so a task cannot be finished today.",
    scenario_vi: "Đồ cung ứng chưa đến, nên một việc không thể hoàn thành hôm nay.",
    canadaContext: "Useful for office, retail, warehouse, restaurant, and community-service jobs.",
    usefulLanguage: [
      { pa: "ਸਪਲਾਈ ਅਜੇ ਨਹੀਂ ਆਈ।", romanization: "supply aje nahin aai.", en: "The supply has not arrived yet.", vi: "Đồ cung ứng vẫn chưa đến." },
      { pa: "ਮੈਂ ਦੂਜਾ ਕੰਮ ਪਹਿਲਾਂ ਕਰ ਸਕਦਾ ਹਾਂ।", romanization: "main duja kam pahilan kar sakda han.", en: "I can do another task first.", vi: "Tôi có thể làm việc khác trước." },
      { pa: "ਤੁਸੀਂ ਕਿਹੜਾ ਕੰਮ ਪਹਿਲਾਂ ਚਾਹੁੰਦੇ ਹੋ?", romanization: "tusin kihra kam pahilan chahunde ho?", en: "Which task do you want first?", vi: "Bạn muốn việc nào trước?" },
    ],
    qa: {
      finalPrompt_en: "Tell a supervisor about a blocker and offer an alternative.",
      finalPrompt_vi: "Nói với quản lý về trở ngại và đưa phương án khác.",
      sampleAnswer: {
        pa: "ਸਪਲਾਈ ਅਜੇ ਨਹੀਂ ਆਈ, ਇਸ ਲਈ ਇਹ ਕੰਮ ਅੱਜ ਪੂਰਾ ਨਹੀਂ ਹੋ ਸਕਦਾ। ਮੈਂ ਦੂਜਾ ਕੰਮ ਪਹਿਲਾਂ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਸੀਂ ਕਿਹੜਾ ਕੰਮ ਪਹਿਲਾਂ ਚਾਹੁੰਦੇ ਹੋ?",
        romanization: "supply aje nahin aai, is lai eh kam ajj pura nahin ho sakda. main duja kam pahilan kar sakda han. tusin kihra kam pahilan chahunde ho?",
        en: "The supply has not arrived yet, so this task cannot be finished today. I can do another task first. Which task do you want first?",
        vi: "Đồ cung ứng vẫn chưa đến, nên việc này không thể hoàn thành hôm nay. Tôi có thể làm việc khác trước. Bạn muốn việc nào trước?",
      },
      whyItWorks_en: ["Names blocker.", "Explains impact.", "Offers an alternative and asks priority."],
      whyItWorks_vi: ["Nêu trở ngại.", "Giải thích ảnh hưởng.", "Đưa phương án khác và hỏi ưu tiên."],
    },
    commonTraps: [
      {
        trap_en: "Saying only 'I cannot' without an option.",
        trap_vi: "Chỉ nói 'tôi không thể' mà không đưa lựa chọn.",
        better: { pa: "ਮੈਂ ਦੂਜਾ ਕੰਮ ਪਹਿਲਾਂ ਕਰ ਸਕਦਾ ਹਾਂ।", romanization: "main duja kam pahilan kar sakda han.", en: "I can do another task first.", vi: "Tôi có thể làm việc khác trước." },
      },
    ],
    integrationReadiness_en: "Ready when the learner reports blocker, impact, and alternative.",
    integrationReadiness_vi: "Sẵn sàng khi người học báo được trở ngại, ảnh hưởng và phương án khác.",
  },
  {
    id: "pa-b1-golden-07-housing-school-community",
    level: "B1",
    focus: "housing_school_community",
    title_en: "Golden sample: housing, school, and community task",
    title_vi: "Mẫu chuẩn: nhiệm vụ nhà ở, trường học và cộng đồng",
    scenario_en: "A school pickup time changed and you need to confirm if a form is needed.",
    scenario_vi: "Giờ đón ở trường đã thay đổi và bạn cần xác nhận có cần mẫu đơn không.",
    canadaContext: "Useful for school offices, childcare desks, tenant offices, and community centres.",
    usefulLanguage: [
      { pa: "ਮੇਰੇ ਬੱਚੇ ਦਾ ਪਿਕਅੱਪ ਸਮਾਂ ਬਦਲ ਗਿਆ ਹੈ।", romanization: "mere bache da pickup sama badal gia hai.", en: "My child's pickup time has changed.", vi: "Giờ đón con tôi đã thay đổi." },
      { pa: "ਅੱਜ ਤਿੰਨ ਵਜੇ ਲੈਣਾ ਹੈ।", romanization: "ajj tinn vaje laina hai.", en: "Today pickup is at three.", vi: "Hôm nay đón lúc ba giờ." },
      { pa: "ਕੀ ਕੋਈ ਫਾਰਮ ਭਰਨਾ ਹੈ?", romanization: "ki koi form bharna hai?", en: "Is there a form to fill out?", vi: "Có mẫu đơn nào cần điền không?" },
    ],
    qa: {
      finalPrompt_en: "Tell the school office about the pickup change and ask the next step.",
      finalPrompt_vi: "Nói với văn phòng trường về thay đổi giờ đón và hỏi bước tiếp theo.",
      sampleAnswer: {
        pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਮੇਰੇ ਬੱਚੇ ਦਾ ਪਿਕਅੱਪ ਸਮਾਂ ਬਦਲ ਗਿਆ ਹੈ। ਅੱਜ ਤਿੰਨ ਵਜੇ ਲੈਣਾ ਹੈ। ਕੀ ਕੋਈ ਫਾਰਮ ਭਰਨਾ ਹੈ?",
        romanization: "sat sri akal ji, mere bache da pickup sama badal gia hai. ajj tinn vaje laina hai. ki koi form bharna hai?",
        en: "Hello, my child's pickup time has changed. Today pickup is at three. Is there a form to fill out?",
        vi: "Xin chào, giờ đón con tôi đã thay đổi. Hôm nay đón lúc ba giờ. Có mẫu đơn nào cần điền không?",
      },
      whyItWorks_en: ["Identifies whose schedule changed.", "States the new time.", "Asks required action."],
      whyItWorks_vi: ["Xác định lịch của ai thay đổi.", "Nêu giờ mới.", "Hỏi hành động cần làm."],
    },
    commonTraps: [
      {
        trap_en: "Leaving out whose schedule changed.",
        trap_vi: "Bỏ sót lịch của ai thay đổi.",
        better: { pa: "ਮੇਰੇ ਬੱਚੇ ਦਾ ਪਿਕਅੱਪ ਸਮਾਂ ਬਦਲ ਗਿਆ ਹੈ।", romanization: "mere bache da pickup sama badal gia hai.", en: "My child's pickup time has changed.", vi: "Giờ đón con tôi đã thay đổi." },
      },
    ],
    integrationReadiness_en: "Ready when the learner gives enough detail for staff to act.",
    integrationReadiness_vi: "Sẵn sàng khi người học đưa đủ chi tiết để nhân viên xử lý.",
  },
  {
    id: "pa-b1-golden-08-register-readiness",
    level: "B1",
    focus: "register_readiness",
    title_en: "Golden sample: register-aware request and readiness",
    title_vi: "Mẫu chuẩn: yêu cầu đúng mức lịch sự và sẵn sàng",
    scenario_en: "You ask staff for help and decide your next learning route. Shahmukhi is awareness only, not a full course.",
    scenario_vi: "Bạn nhờ nhân viên giúp và quyết định lộ trình học tiếp. Shahmukhi chỉ để nhận biết, không phải khóa học đầy đủ.",
    canadaContext: "Useful with staff, supervisors, teachers, neighbours, elders, and service workers.",
    usefulLanguage: [
      { pa: "ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ ਜੀ?", romanization: "ki tusin madad kar sakde ho ji?", en: "Could you help, please?", vi: "Bạn có thể vui lòng giúp không?" },
      { pa: "ਮੈਨੂੰ ਸਪਸ਼ਟੀਕਰਨ ਦੀ ਹੋਰ ਅਭਿਆਸ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu spashtikaran di hor abhyas chahidi hai.", en: "I need more clarification practice.", vi: "Tôi cần luyện thêm làm rõ thông tin." },
      { pa: "ਮੈਂ ਪਹਿਲਾਂ B1 ਦੁਹਰਾਵਾਂਗਾ।", romanization: "main pahilan B1 duhravanga.", en: "I will review B1 first.", vi: "Tôi sẽ ôn B1 trước." },
    ],
    qa: {
      finalPrompt_en: "Make a polite request and state your next readiness route.",
      finalPrompt_vi: "Đưa ra yêu cầu lịch sự và nêu lộ trình sẵn sàng tiếp theo.",
      sampleAnswer: {
        pa: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ? ਮੈਨੂੰ ਸਪਸ਼ਟੀਕਰਨ ਦੀ ਹੋਰ ਅਭਿਆਸ ਚਾਹੀਦੀ ਹੈ, ਇਸ ਲਈ ਮੈਂ ਪਹਿਲਾਂ B1 ਦੁਹਰਾਵਾਂਗਾ।",
        romanization: "maaf karna ji, ki tusin madad kar sakde ho? mainu spashtikaran di hor abhyas chahidi hai, is lai main pahilan B1 duhravanga.",
        en: "Excuse me, could you help? I need more clarification practice, so I will review B1 first.",
        vi: "Xin lỗi, bạn có thể giúp không? Tôi cần luyện thêm làm rõ thông tin, vì vậy tôi sẽ ôn B1 trước.",
      },
      whyItWorks_en: ["Uses respectful ਤੁਸੀਂ and ਜੀ.", "Names the weak skill.", "Chooses a review route without claiming native review."],
      whyItWorks_vi: ["Dùng ਤੁਸੀਂ và ਜੀ tôn trọng.", "Nêu kỹ năng yếu.", "Chọn lộ trình ôn tập mà không tuyên bố có người bản ngữ xem lại."],
    },
    commonTraps: [
      {
        trap_en: "Using informal ਤੂੰ with unfamiliar adults or claiming native review.",
        trap_vi: "Dùng ਤੂੰ với người lớn chưa thân hoặc tuyên bố đã có người bản ngữ xem lại.",
        better: { pa: "ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ ਜੀ?", romanization: "ki tusin madad kar sakde ho ji?", en: "Could you help, please?", vi: "Bạn có thể vui lòng giúp không?" },
      },
    ],
    integrationReadiness_en: "Ready when the learner controls register and names the next route. Native review is deferred.",
    integrationReadiness_vi: "Sẵn sàng khi người học kiểm soát mức lịch sự và nêu lộ trình tiếp theo. Phần người bản ngữ xem lại được để sau.",
  },
];
