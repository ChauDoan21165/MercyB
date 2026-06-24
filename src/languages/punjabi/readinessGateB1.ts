// src/languages/punjabi/readinessGateB1.ts
//
// Punjabi B1 readiness gate for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary; romanization is a support bridge. Shahmukhi is
// mentioned only for awareness, not taught as a full course.
//
// Native review is deferred; this module makes no native-review claim.

export type PunjabiB1ReadinessFocus =
  | "explain_situation"
  | "retell_event"
  | "ask_clarification"
  | "workplace_service"
  | "housing_school"
  | "healthcare"
  | "transfer_register"
  | "routing_decision";

export type PunjabiReadinessLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiReadinessTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiReadinessLine;
};

export type PunjabiReadinessRoute = {
  ifLearnerCan_en: string;
  ifLearnerCan_vi: string;
  routeTo_en: string;
  routeTo_vi: string;
};

export type PunjabiB1ReadinessGateItem = {
  id: string;
  level: "B1";
  focus: PunjabiB1ReadinessFocus;
  checkpoint_en: string;
  checkpoint_vi: string;
  task_en: string;
  task_vi: string;
  canadaContext: string;
  successSignals_en: string[];
  successSignals_vi: string[];
  languageTools: PunjabiReadinessLine[];
  sampleResponse: PunjabiReadinessLine;
  commonTraps: PunjabiReadinessTrap[];
  routing: PunjabiReadinessRoute;
};

export const punjabiB1ReadinessGate: PunjabiB1ReadinessGateItem[] = [
  {
    id: "pa-b1-ready-01-explain-situation",
    level: "B1",
    focus: "explain_situation",
    checkpoint_en: "Explain a practical situation with cause, impact, and requested next step.",
    checkpoint_vi: "Giải thích một tình huống thực tế với nguyên nhân, ảnh hưởng và bước tiếp theo mong muốn.",
    task_en: "Tell a building office that a hallway light is broken and ask when it will be fixed.",
    task_vi: "Nói với văn phòng tòa nhà rằng đèn hành lang bị hỏng và hỏi khi nào sẽ sửa.",
    canadaContext: "Useful for rental buildings, condo offices, and maintenance requests in Canada.",
    successSignals_en: ["Names the problem.", "Gives location and impact.", "Asks for timing politely."],
    successSignals_vi: ["Nêu vấn đề.", "Nói vị trí và ảnh hưởng.", "Hỏi thời gian một cách lịch sự."],
    languageTools: [
      { pa: "ਦੂਜੀ ਮੰਜ਼ਿਲ ਦਾ ਬੱਤੀ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।", romanization: "duji manzil di batti kam nahin kar rahi.", en: "The light on the second floor is not working.", vi: "Đèn ở tầng hai không hoạt động." },
      { pa: "ਰਾਤ ਨੂੰ ਰਸਤਾ ਹਨੇਰਾ ਹੁੰਦਾ ਹੈ।", romanization: "raat nu rasta hanera hunda hai.", en: "At night the hallway is dark.", vi: "Ban đêm lối đi tối." },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਇਹ ਕਦੋਂ ਠੀਕ ਹੋਵੇਗੀ?", romanization: "kirpa karke dasso, eh kadon theek hovegi?", en: "Please tell me, when will it be fixed?", vi: "Vui lòng cho tôi biết khi nào sẽ sửa." },
    ],
    sampleResponse: {
      pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਦੂਜੀ ਮੰਜ਼ਿਲ ਦੀ ਬੱਤੀ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ। ਰਾਤ ਨੂੰ ਰਸਤਾ ਹਨੇਰਾ ਹੁੰਦਾ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਇਹ ਕਦੋਂ ਠੀਕ ਹੋਵੇਗੀ?",
      romanization: "sat sri akal ji, duji manzil di batti kam nahin kar rahi. raat nu rasta hanera hunda hai. kirpa karke dasso, eh kadon theek hovegi?",
      en: "Hello, the light on the second floor is not working. At night the hallway is dark. Please tell me, when will it be fixed?",
      vi: "Xin chào, đèn ở tầng hai không hoạt động. Ban đêm lối đi tối. Vui lòng cho tôi biết khi nào sẽ sửa.",
    },
    commonTraps: [
      {
        trap_en: "Giving only the complaint without impact or next step.",
        trap_vi: "Chỉ phàn nàn mà không nói ảnh hưởng hoặc bước tiếp theo.",
        better: { pa: "ਇਹ ਹਨੇਰਾ ਹੈ, ਇਸ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਦਾ ਸਮਾਂ ਦੱਸੋ।", romanization: "eh hanera hai, is lai kirpa karke murammat da sama dasso.", en: "It is dark, so please tell me the repair time.", vi: "Chỗ này tối, vì vậy vui lòng cho biết thời gian sửa." },
      },
    ],
    routing: {
      ifLearnerCan_en: "Learner can explain problem, impact, and next step without switching to English.",
      ifLearnerCan_vi: "Người học có thể giải thích vấn đề, ảnh hưởng và bước tiếp theo mà không chuyển sang tiếng Anh.",
      routeTo_en: "Route to B1 scenario expansion or B2 problem-resolution tasks.",
      routeTo_vi: "Chuyển sang mở rộng tình huống B1 hoặc nhiệm vụ giải quyết vấn đề B2.",
    },
  },
  {
    id: "pa-b1-ready-02-retell-event",
    level: "B1",
    focus: "retell_event",
    checkpoint_en: "Retell events in order with sequence markers and a result.",
    checkpoint_vi: "Kể lại sự việc theo thứ tự với từ nối trình tự và kết quả.",
    task_en: "Retell what happened when you missed a bus connection.",
    task_vi: "Kể lại chuyện xảy ra khi bạn lỡ chuyến xe buýt nối tuyến.",
    canadaContext: "Useful for transit, school, work, and appointment explanations.",
    successSignals_en: ["Uses first/then/after that.", "States the reason.", "Explains the result and next action."],
    successSignals_vi: ["Dùng trước tiên/sau đó/sau việc đó.", "Nêu lý do.", "Giải thích kết quả và hành động tiếp theo."],
    languageTools: [
      { pa: "ਪਹਿਲਾਂ ਬੱਸ ਦੇਰ ਨਾਲ ਆਈ।", romanization: "pahilan bus der naal aai.", en: "First, the bus came late.", vi: "Trước tiên, xe buýt đến muộn." },
      { pa: "ਫਿਰ ਮੇਰੀ ਅਗਲੀ ਬੱਸ ਨਿਕਲ ਗਈ।", romanization: "phir meri agli bus nikal gai.", en: "Then my next bus left.", vi: "Sau đó chuyến xe tiếp theo của tôi đã đi." },
      { pa: "ਇਸ ਕਰਕੇ ਮੈਂ ਪੰਦਰਾਂ ਮਿੰਟ ਲੇਟ ਹੋ ਗਿਆ।", romanization: "is karke main pandran mint late ho gia.", en: "Because of this I was fifteen minutes late.", vi: "Vì vậy tôi trễ mười lăm phút." },
    ],
    sampleResponse: {
      pa: "ਪਹਿਲਾਂ ਬੱਸ ਦੇਰ ਨਾਲ ਆਈ। ਫਿਰ ਮੇਰੀ ਅਗਲੀ ਬੱਸ ਨਿਕਲ ਗਈ। ਇਸ ਕਰਕੇ ਮੈਂ ਪੰਦਰਾਂ ਮਿੰਟ ਲੇਟ ਹੋ ਗਿਆ ਅਤੇ ਮੈਂ ਦਫ਼ਤਰ ਨੂੰ ਸੁਨੇਹਾ ਭੇਜਿਆ।",
      romanization: "pahilan bus der naal aai. phir meri agli bus nikal gai. is karke main pandran mint late ho gia ate main daftar nu suneha bhejia.",
      en: "First, the bus came late. Then my next bus left. Because of this I was fifteen minutes late, and I sent the office a message.",
      vi: "Trước tiên, xe buýt đến muộn. Sau đó chuyến xe tiếp theo đã đi. Vì vậy tôi trễ mười lăm phút và đã nhắn cho văn phòng.",
    },
    commonTraps: [
      {
        trap_en: "Listing events without time order, so the listener cannot follow.",
        trap_vi: "Liệt kê sự việc không theo thứ tự thời gian, khiến người nghe khó hiểu.",
        better: { pa: "ਪਹਿਲਾਂ..., ਫਿਰ..., ਇਸ ਕਰਕੇ...", romanization: "pahilan..., phir..., is karke...", en: "First..., then..., because of this...", vi: "Trước tiên..., sau đó..., vì vậy..." },
      },
    ],
    routing: {
      ifLearnerCan_en: "Learner can retell a short event with cause and result.",
      ifLearnerCan_vi: "Người học có thể kể lại sự việc ngắn với nguyên nhân và kết quả.",
      routeTo_en: "Route to B1 narrative practice or B2 extended storytelling.",
      routeTo_vi: "Chuyển sang luyện kể chuyện B1 hoặc kể chuyện mở rộng B2.",
    },
  },
  {
    id: "pa-b1-ready-03-ask-clarification",
    level: "B1",
    focus: "ask_clarification",
    checkpoint_en: "Ask for repetition, confirm details, and request written follow-up.",
    checkpoint_vi: "Xin nhắc lại, xác nhận chi tiết và yêu cầu theo dõi bằng văn bản.",
    task_en: "Clarify appointment details from a clinic or community office. Language support only, not medical or legal advice.",
    task_vi: "Làm rõ chi tiết lịch hẹn từ phòng khám hoặc văn phòng cộng đồng. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn y tế hoặc pháp lý.",
    canadaContext: "Useful for phone calls where dates, room numbers, and forms matter.",
    successSignals_en: ["Asks them to slow down.", "Repeats time and place back.", "Asks for text or email confirmation."],
    successSignals_vi: ["Xin họ nói chậm hơn.", "Lặp lại giờ và địa điểm.", "Xin xác nhận bằng tin nhắn hoặc email."],
    languageTools: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਹੌਲੀ ਦੁਬਾਰਾ ਕਹੋ ਜੀ।", romanization: "maaf karna, hauli dubara kaho ji.", en: "Sorry, please say it again slowly.", vi: "Xin lỗi, vui lòng nói lại chậm hơn." },
      { pa: "ਕੀ ਮੈਂ ਸਮਾਂ ਅਤੇ ਥਾਂ ਦੁਹਰਾ ਸਕਦਾ ਹਾਂ?", romanization: "ki main sama ate than duhra sakda han?", en: "Can I repeat the time and place?", vi: "Tôi có thể lặp lại giờ và địa điểm không?" },
      { pa: "ਕੀ ਤੁਸੀਂ ਪੁਸ਼ਟੀ ਸੁਨੇਹੇ ਵਿੱਚ ਭੇਜ ਸਕਦੇ ਹੋ?", romanization: "ki tusin pushti sunehe vich bhej sakde ho?", en: "Can you send the confirmation in a message?", vi: "Bạn có thể gửi xác nhận bằng tin nhắn không?" },
    ],
    sampleResponse: {
      pa: "ਮਾਫ਼ ਕਰਨਾ, ਹੌਲੀ ਦੁਬਾਰਾ ਕਹੋ ਜੀ। ਕੀ ਮੈਂ ਸਮਾਂ ਅਤੇ ਥਾਂ ਦੁਹਰਾ ਸਕਦਾ ਹਾਂ? ਕੀ ਤੁਸੀਂ ਪੁਸ਼ਟੀ ਸੁਨੇਹੇ ਵਿੱਚ ਭੇਜ ਸਕਦੇ ਹੋ?",
      romanization: "maaf karna, hauli dubara kaho ji. ki main sama ate than duhra sakda han? ki tusin pushti sunehe vich bhej sakde ho?",
      en: "Sorry, please say it again slowly. Can I repeat the time and place? Can you send the confirmation in a message?",
      vi: "Xin lỗi, vui lòng nói lại chậm hơn. Tôi có thể lặp lại giờ và địa điểm không? Bạn có thể gửi xác nhận bằng tin nhắn không?",
    },
    commonTraps: [
      {
        trap_en: "Saying yes before confirming numbers or dates.",
        trap_vi: "Nói đồng ý trước khi xác nhận số hoặc ngày.",
        better: { pa: "ਕਿਰਪਾ ਕਰਕੇ ਤਾਰੀਖ ਅਤੇ ਸਮਾਂ ਫਿਰ ਦੱਸੋ।", romanization: "kirpa karke tarikh ate sama phir dasso.", en: "Please tell me the date and time again.", vi: "Vui lòng cho tôi biết lại ngày và giờ." },
      },
    ],
    routing: {
      ifLearnerCan_en: "Learner can repair misunderstanding during a live conversation.",
      ifLearnerCan_vi: "Người học có thể xử lý hiểu nhầm trong cuộc trò chuyện trực tiếp.",
      routeTo_en: "Route to phone-call checkpoints or B2 negotiation practice.",
      routeTo_vi: "Chuyển sang điểm kiểm tra gọi điện hoặc luyện thương lượng B2.",
    },
  },
  {
    id: "pa-b1-ready-04-workplace-service",
    level: "B1",
    focus: "workplace_service",
    checkpoint_en: "Handle workplace or service conversations with polite register and clear next steps.",
    checkpoint_vi: "Xử lý cuộc trò chuyện nơi làm việc hoặc dịch vụ với mức độ lịch sự và bước tiếp theo rõ.",
    task_en: "Tell a supervisor that a customer is waiting and ask what to do next.",
    task_vi: "Nói với quản lý rằng khách đang chờ và hỏi nên làm gì tiếp.",
    canadaContext: "Useful for retail, warehouse, restaurant, office, and community-service jobs.",
    successSignals_en: ["Uses polite ਤੁਸੀਂ or ਜੀ.", "States current situation.", "Asks for an action or priority."],
    successSignals_vi: ["Dùng ਤੁਸੀਂ hoặc ਜੀ lịch sự.", "Nêu tình trạng hiện tại.", "Hỏi hành động hoặc ưu tiên."],
    languageTools: [
      { pa: "ਇੱਕ ਗਾਹਕ ਦਸ ਮਿੰਟ ਤੋਂ ਉਡੀਕ ਕਰ ਰਿਹਾ ਹੈ।", romanization: "ikk gahak dass mint ton udeek kar riha hai.", en: "A customer has been waiting for ten minutes.", vi: "Một khách hàng đã chờ mười phút." },
      { pa: "ਮੈਂ ਕੀ ਕਰਾਂ?", romanization: "main ki karan?", en: "What should I do?", vi: "Tôi nên làm gì?" },
      { pa: "ਕੀ ਪਹਿਲਾਂ ਇਹ ਕੰਮ ਕਰਨਾ ਹੈ?", romanization: "ki pahilan eh kam karna hai?", en: "Should this task be done first?", vi: "Có nên làm việc này trước không?" },
    ],
    sampleResponse: {
      pa: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਇੱਕ ਗਾਹਕ ਦਸ ਮਿੰਟ ਤੋਂ ਉਡੀਕ ਕਰ ਰਿਹਾ ਹੈ। ਕੀ ਪਹਿਲਾਂ ਇਹ ਕੰਮ ਕਰਨਾ ਹੈ ਜਾਂ ਮੈਂ ਗਾਹਕ ਦੀ ਮਦਦ ਕਰਾਂ?",
      romanization: "maaf karna ji, ikk gahak dass mint ton udeek kar riha hai. ki pahilan eh kam karna hai jaan main gahak di madad karan?",
      en: "Excuse me, a customer has been waiting for ten minutes. Should this task be done first, or should I help the customer?",
      vi: "Xin lỗi, một khách hàng đã chờ mười phút. Nên làm việc này trước hay tôi giúp khách hàng?",
    },
    commonTraps: [
      {
        trap_en: "Using informal ਤੂੰ with supervisors, staff, or service workers.",
        trap_vi: "Dùng ਤੂੰ thân mật với quản lý, nhân viên hoặc người cung cấp dịch vụ.",
        better: { pa: "ਕੀ ਤੁਸੀਂ ਮੈਨੂੰ ਦੱਸ ਸਕਦੇ ਹੋ?", romanization: "ki tusin mainu dass sakde ho?", en: "Can you tell me?", vi: "Bạn có thể cho tôi biết không?" },
      },
    ],
    routing: {
      ifLearnerCan_en: "Learner can keep the register polite while asking for direction.",
      ifLearnerCan_vi: "Người học có thể giữ mức lịch sự khi hỏi hướng dẫn.",
      routeTo_en: "Route to workplace scenarios or B2 customer-resolution tasks.",
      routeTo_vi: "Chuyển sang tình huống nơi làm việc hoặc nhiệm vụ xử lý khách hàng B2.",
    },
  },
  {
    id: "pa-b1-ready-05-housing-school",
    level: "B1",
    focus: "housing_school",
    checkpoint_en: "Ask practical questions in housing and school settings with enough detail.",
    checkpoint_vi: "Đặt câu hỏi thực tế trong bối cảnh nhà ở và trường học với đủ chi tiết.",
    task_en: "Ask a school office about a changed pickup time for your child.",
    task_vi: "Hỏi văn phòng trường về giờ đón con đã thay đổi.",
    canadaContext: "Useful for school offices, parent-teacher meetings, childcare, and housing offices.",
    successSignals_en: ["Identifies the child or unit.", "States the changed detail.", "Asks what action is needed."],
    successSignals_vi: ["Xác định con hoặc căn hộ.", "Nêu chi tiết đã thay đổi.", "Hỏi cần làm gì."],
    languageTools: [
      { pa: "ਅੱਜ ਮੇਰੇ ਬੱਚੇ ਨੂੰ ਤਿੰਨ ਵਜੇ ਲੈਣਾ ਹੈ।", romanization: "ajj mere bache nu tinn vaje laina hai.", en: "Today I need to pick up my child at three.", vi: "Hôm nay tôi cần đón con lúc ba giờ." },
      { pa: "ਆਮ ਤੌਰ ਤੇ ਸਮਾਂ ਚਾਰ ਵਜੇ ਹੁੰਦਾ ਹੈ।", romanization: "aam taur te sama char vaje hunda hai.", en: "Usually the time is four o'clock.", vi: "Thông thường giờ là bốn giờ." },
      { pa: "ਕੀ ਮੈਨੂੰ ਦਫ਼ਤਰ ਨੂੰ ਦੱਸਣਾ ਪਵੇਗਾ?", romanization: "ki mainu daftar nu dassna pavega?", en: "Do I have to tell the office?", vi: "Tôi có phải báo cho văn phòng không?" },
    ],
    sampleResponse: {
      pa: "ਅੱਜ ਮੇਰੇ ਬੱਚੇ ਨੂੰ ਤਿੰਨ ਵਜੇ ਲੈਣਾ ਹੈ। ਆਮ ਤੌਰ ਤੇ ਸਮਾਂ ਚਾਰ ਵਜੇ ਹੁੰਦਾ ਹੈ। ਕੀ ਮੈਨੂੰ ਦਫ਼ਤਰ ਨੂੰ ਦੱਸਣਾ ਪਵੇਗਾ ਜਾਂ ਕੋਈ ਫਾਰਮ ਭਰਨਾ ਹੈ?",
      romanization: "ajj mere bache nu tinn vaje laina hai. aam taur te sama char vaje hunda hai. ki mainu daftar nu dassna pavega jaan koi form bharna hai?",
      en: "Today I need to pick up my child at three. Usually the time is four o'clock. Do I have to tell the office or fill out a form?",
      vi: "Hôm nay tôi cần đón con lúc ba giờ. Thông thường là bốn giờ. Tôi có phải báo cho văn phòng hoặc điền mẫu đơn không?",
    },
    commonTraps: [
      {
        trap_en: "Leaving out the changed time, so staff cannot act.",
        trap_vi: "Bỏ sót giờ đã thay đổi, nên nhân viên không thể xử lý.",
        better: { pa: "ਅੱਜ ਸਮਾਂ ਚਾਰ ਦੀ ਥਾਂ ਤਿੰਨ ਵਜੇ ਹੈ।", romanization: "ajj sama char di than tinn vaje hai.", en: "Today the time is three instead of four.", vi: "Hôm nay giờ là ba thay vì bốn." },
      },
    ],
    routing: {
      ifLearnerCan_en: "Learner can ask detail-rich questions in family and housing routines.",
      ifLearnerCan_vi: "Người học có thể đặt câu hỏi đủ chi tiết trong sinh hoạt gia đình và nhà ở.",
      routeTo_en: "Route to school/community tasks or B2 family-service conversations.",
      routeTo_vi: "Chuyển sang nhiệm vụ trường/cộng đồng hoặc hội thoại dịch vụ gia đình B2.",
    },
  },
  {
    id: "pa-b1-ready-06-healthcare",
    level: "B1",
    focus: "healthcare",
    checkpoint_en: "Describe symptoms, timing, and concern clearly. Language support only, not medical advice.",
    checkpoint_vi: "Mô tả triệu chứng, thời gian và lo lắng rõ ràng. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn y tế.",
    task_en: "Tell a clinic receptionist about a recurring headache and ask for an appointment.",
    task_vi: "Nói với lễ tân phòng khám về đau đầu tái diễn và xin lịch hẹn.",
    canadaContext: "Useful for clinics, pharmacies, nurse lines, and appointment desks as language practice only.",
    successSignals_en: ["Names symptom.", "Says how long or how often.", "Asks for appointment or next step."],
    successSignals_vi: ["Nêu triệu chứng.", "Nói kéo dài bao lâu hoặc thường xuyên thế nào.", "Xin lịch hẹn hoặc bước tiếp theo."],
    languageTools: [
      { pa: "ਮੈਨੂੰ ਤਿੰਨ ਦਿਨ ਤੋਂ ਸਿਰ ਦਰਦ ਹੈ।", romanization: "mainu tinn din ton sir dard hai.", en: "I have had a headache for three days.", vi: "Tôi bị đau đầu ba ngày rồi." },
      { pa: "ਦਰਦ ਵਾਰ-ਵਾਰ ਆਉਂਦਾ ਹੈ।", romanization: "dard vaar-vaar aunda hai.", en: "The pain comes again and again.", vi: "Cơn đau lặp lại nhiều lần." },
      { pa: "ਕੀ ਮੈਨੂੰ ਅਪਾਇੰਟਮੈਂਟ ਮਿਲ ਸਕਦੀ ਹੈ?", romanization: "ki mainu appointment mil sakdi hai?", en: "Can I get an appointment?", vi: "Tôi có thể đặt lịch hẹn không?" },
    ],
    sampleResponse: {
      pa: "ਮੈਨੂੰ ਤਿੰਨ ਦਿਨ ਤੋਂ ਸਿਰ ਦਰਦ ਹੈ ਅਤੇ ਦਰਦ ਵਾਰ-ਵਾਰ ਆਉਂਦਾ ਹੈ। ਕੀ ਮੈਨੂੰ ਅਪਾਇੰਟਮੈਂਟ ਮਿਲ ਸਕਦੀ ਹੈ? ਜੇ ਲੋੜ ਹੈ, ਮੈਂ ਹੋਰ ਜਾਣਕਾਰੀ ਦੇ ਸਕਦਾ ਹਾਂ।",
      romanization: "mainu tinn din ton sir dard hai ate dard vaar-vaar aunda hai. ki mainu appointment mil sakdi hai? je lor hai, main hor jankari de sakda han.",
      en: "I have had a headache for three days, and the pain keeps coming back. Can I get an appointment? If needed, I can give more information.",
      vi: "Tôi bị đau đầu ba ngày rồi và cơn đau cứ lặp lại. Tôi có thể đặt lịch hẹn không? Nếu cần, tôi có thể cung cấp thêm thông tin.",
    },
    commonTraps: [
      {
        trap_en: "Using vague words like 'not good' without symptom or timing.",
        trap_vi: "Dùng từ mơ hồ như 'không khỏe' mà không nêu triệu chứng hoặc thời gian.",
        better: { pa: "ਮੈਨੂੰ ਤਿੰਨ ਦਿਨ ਤੋਂ ਸਿਰ ਦਰਦ ਹੈ।", romanization: "mainu tinn din ton sir dard hai.", en: "I have had a headache for three days.", vi: "Tôi bị đau đầu ba ngày rồi." },
      },
    ],
    routing: {
      ifLearnerCan_en: "Learner can describe health context clearly while recognizing it is language practice only.",
      ifLearnerCan_vi: "Người học có thể mô tả bối cảnh sức khỏe rõ ràng và hiểu đây chỉ là luyện ngôn ngữ.",
      routeTo_en: "Route to healthcare communication scenarios with safety disclaimers.",
      routeTo_vi: "Chuyển sang tình huống giao tiếp y tế có nhắc rõ giới hạn an toàn.",
    },
  },
  {
    id: "pa-b1-ready-07-transfer-register",
    level: "B1",
    focus: "transfer_register",
    checkpoint_en: "Avoid common Vietnamese/English transfer mistakes and choose polite register.",
    checkpoint_vi: "Tránh lỗi chuyển di từ tiếng Việt/tiếng Anh và chọn mức lịch sự phù hợp.",
    task_en: "Repair a sentence that sounds too direct in a service conversation.",
    task_vi: "Sửa một câu nghe quá trực tiếp trong cuộc trò chuyện dịch vụ.",
    canadaContext: "Useful when speaking with staff, neighbours, coworkers, teachers, and service workers.",
    successSignals_en: ["Uses ਜੀ or polite wording.", "Avoids word-for-word English order when it sounds unclear.", "Chooses ਤੁਸੀਂ for respectful address."],
    successSignals_vi: ["Dùng ਜੀ hoặc cách nói lịch sự.", "Tránh trật tự từng chữ theo tiếng Anh khi gây khó hiểu.", "Chọn ਤੁਸੀਂ để xưng hô lịch sự."],
    languageTools: [
      { pa: "ਮੈਨੂੰ ਇਹ ਸਮਝ ਨਹੀਂ ਆ ਰਿਹਾ।", romanization: "mainu eh samajh nahin aa riha.", en: "I do not understand this.", vi: "Tôi không hiểu điều này." },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰ ਦਿਓ।", romanization: "kirpa karke madad kar dio.", en: "Please help me with it.", vi: "Vui lòng giúp tôi việc này." },
      { pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਦੁਬਾਰਾ ਸਮਝਾ ਸਕਦੇ ਹੋ?", romanization: "ki tusin eh dubara samjha sakde ho?", en: "Can you explain this again?", vi: "Bạn có thể giải thích lại không?" },
    ],
    sampleResponse: {
      pa: "ਮੈਨੂੰ ਇਹ ਸਮਝ ਨਹੀਂ ਆ ਰਿਹਾ। ਕੀ ਤੁਸੀਂ ਇਹ ਦੁਬਾਰਾ ਸਮਝਾ ਸਕਦੇ ਹੋ ਜੀ?",
      romanization: "mainu eh samajh nahin aa riha. ki tusin eh dubara samjha sakde ho ji?",
      en: "I do not understand this. Could you explain it again, please?",
      vi: "Tôi không hiểu điều này. Bạn có thể vui lòng giải thích lại không?",
    },
    commonTraps: [
      {
        trap_en: "Translating 'you explain' too directly and sounding like an order.",
        trap_vi: "Dịch 'bạn giải thích' quá trực tiếp và nghe như ra lệnh.",
        better: { pa: "ਕੀ ਤੁਸੀਂ ਸਮਝਾ ਸਕਦੇ ਹੋ ਜੀ?", romanization: "ki tusin samjha sakde ho ji?", en: "Could you explain, please?", vi: "Bạn có thể vui lòng giải thích không?" },
      },
    ],
    routing: {
      ifLearnerCan_en: "Learner can self-correct direct register and choose listener-appropriate forms.",
      ifLearnerCan_vi: "Người học có thể tự sửa mức nói quá trực tiếp và chọn dạng phù hợp với người nghe.",
      routeTo_en: "Route to B1 register repair drills or B2 workplace politeness tasks.",
      routeTo_vi: "Chuyển sang luyện sửa mức lịch sự B1 hoặc nhiệm vụ lịch sự nơi làm việc B2.",
    },
  },
  {
    id: "pa-b1-ready-08-routing-decision",
    level: "B1",
    focus: "routing_decision",
    checkpoint_en: "Make a readiness decision after a checkpoint and choose the next study route.",
    checkpoint_vi: "Đưa ra quyết định sẵn sàng sau điểm kiểm tra và chọn lộ trình học tiếp theo.",
    task_en: "After a role-play, say whether you need more B1 practice or can move to B2 preparation.",
    task_vi: "Sau một vai diễn, nói bạn cần luyện B1 thêm hay có thể chuyển sang chuẩn bị B2.",
    canadaContext: "Useful for tutoring, settlement classes, self-study plans, and progress meetings.",
    successSignals_en: ["Names the weak skill.", "Chooses a concrete next route.", "Mentions script awareness without turning it into a course."],
    successSignals_vi: ["Nêu kỹ năng yếu.", "Chọn lộ trình tiếp theo cụ thể.", "Nhắc nhận biết chữ viết mà không biến thành khóa học."],
    languageTools: [
      { pa: "ਮੈਨੂੰ ਸਪਸ਼ਟੀਕਰਨ ਪੁੱਛਣ ਦੀ ਹੋਰ ਅਭਿਆਸ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu spashtikaran puchhan di hor abhyas chahidi hai.", en: "I need more practice asking for clarification.", vi: "Tôi cần luyện thêm cách hỏi làm rõ." },
      { pa: "ਮੈਂ ਅਗਲੇ ਪੱਧਰ ਲਈ ਤਿਆਰ ਹਾਂ।", romanization: "main agle paddar lai tiar han.", en: "I am ready for the next level.", vi: "Tôi sẵn sàng cho cấp độ tiếp theo." },
      { pa: "ਸ਼ਾਹਮੁਖੀ ਬਾਰੇ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਰੱਖਣੀ ਹੈ; ਇਹ ਪੂਰਾ ਕੋਰਸ ਨਹੀਂ ਹੈ।", romanization: "Shahmukhi bare sirf jankari rakhni hai; eh pura course nahin hai.", en: "Shahmukhi is for awareness only; this is not a full course.", vi: "Shahmukhi chỉ để nhận biết; đây không phải khóa học đầy đủ." },
    ],
    sampleResponse: {
      pa: "ਮੈਂ ਆਮ ਗੱਲਬਾਤ ਕਰ ਸਕਦਾ ਹਾਂ, ਪਰ ਮੈਨੂੰ ਸਪਸ਼ਟੀਕਰਨ ਪੁੱਛਣ ਦੀ ਹੋਰ ਅਭਿਆਸ ਚਾਹੀਦੀ ਹੈ। ਇਸ ਲਈ ਮੈਂ ਪਹਿਲਾਂ B1 ਫੋਨ ਕਾਲਾਂ ਦੁਹਰਾਵਾਂਗਾ, ਫਿਰ ਅਗਲੇ ਪੱਧਰ ਲਈ ਤਿਆਰੀ ਕਰਾਂਗਾ।",
      romanization: "main aam galbaat kar sakda han, par mainu spashtikaran puchhan di hor abhyas chahidi hai. is lai main pahilan B1 phone callan duhravanga, phir agle paddar lai tiari karanga.",
      en: "I can handle general conversation, but I need more practice asking for clarification. So I will review B1 phone calls first, then prepare for the next level.",
      vi: "Tôi có thể xử lý hội thoại thông thường, nhưng cần luyện thêm cách hỏi làm rõ. Vì vậy tôi sẽ ôn gọi điện B1 trước, rồi chuẩn bị cho cấp độ tiếp theo.",
    },
    commonTraps: [
      {
        trap_en: "Saying only 'pass' or 'fail' without choosing what to study next.",
        trap_vi: "Chỉ nói 'đạt' hoặc 'trượt' mà không chọn học gì tiếp.",
        better: { pa: "ਮੈਨੂੰ ਕਾਰਨ ਦੱਸਣ ਦੀ ਅਭਿਆਸ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu karan dassan di abhyas chahidi hai.", en: "I need practice explaining reasons.", vi: "Tôi cần luyện giải thích lý do." },
      },
    ],
    routing: {
      ifLearnerCan_en: "Learner can identify their own next route after the readiness gate.",
      ifLearnerCan_vi: "Người học có thể tự xác định lộ trình tiếp theo sau cổng đánh giá.",
      routeTo_en: "Route to targeted B1 review, B2 bridge, or teacher review. Native review is deferred.",
      routeTo_vi: "Chuyển sang ôn B1 có mục tiêu, cầu nối B2 hoặc giáo viên xem lại. Phần người bản ngữ xem lại được để sau.",
    },
  },
];
