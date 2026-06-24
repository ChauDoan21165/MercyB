// src/languages/punjabi/integratedRoleplaySetB1.ts
//
// Punjabi B1 integrated roleplays for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary; romanization is a support bridge. Shahmukhi is
// mentioned only for awareness, not taught as a full course.
//
// Native review is deferred; this module makes no native-review claim.

export type PunjabiB1IntegratedRoleplayFocus =
  | "situation_clarification"
  | "polite_complaint_service"
  | "workplace_update"
  | "housing_school_issue"
  | "retell_and_repair"
  | "community_service_call"
  | "health_service_language"
  | "register_routing_review";

export type PunjabiIntegratedRoleplayLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiIntegratedRoleplayTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiIntegratedRoleplayLine;
};

export type PunjabiIntegratedRoleplayTurn = {
  speaker: "learner" | "staff" | "supervisor" | "teacher" | "friend";
  line: PunjabiIntegratedRoleplayLine;
};

export type PunjabiB1IntegratedRoleplay = {
  id: string;
  level: "B1";
  focus: PunjabiB1IntegratedRoleplayFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  integratedSkills_en: string[];
  integratedSkills_vi: string[];
  roleplayTurns: PunjabiIntegratedRoleplayTurn[];
  checkpointPrompt_en: string;
  checkpointPrompt_vi: string;
  learnerModelAnswer: PunjabiIntegratedRoleplayLine;
  commonTraps: PunjabiIntegratedRoleplayTrap[];
  readinessRoute_en: string;
  readinessRoute_vi: string;
};

export const punjabiB1IntegratedRoleplaySet: PunjabiB1IntegratedRoleplay[] = [
  {
    id: "pa-b1-integrated-01-community-card",
    level: "B1",
    focus: "situation_clarification",
    title_en: "Explain a card problem and clarify next steps",
    title_vi: "Giải thích vấn đề thẻ và làm rõ bước tiếp theo",
    scenario_en: "Your community centre card does not open the door, and staff gives instructions quickly.",
    scenario_vi: "Thẻ trung tâm cộng đồng của bạn không mở cửa, và nhân viên nói hướng dẫn quá nhanh.",
    canadaContext: "Useful at libraries, recreation centres, newcomer programs, and community desks in Canada.",
    integratedSkills_en: ["Explain the situation.", "Ask for repetition.", "Confirm the next step."],
    integratedSkills_vi: ["Giải thích tình huống.", "Xin nhắc lại.", "Xác nhận bước tiếp theo."],
    roleplayTurns: [
      { speaker: "learner", line: { pa: "ਮੇਰਾ ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "mera card kam nahin kar riha.", en: "My card is not working.", vi: "Thẻ của tôi không hoạt động." } },
      { speaker: "staff", line: { pa: "ਤੁਸੀਂ ਦਫ਼ਤਰ ਵਿੱਚ ਫਾਰਮ ਭਰੋ।", romanization: "tusin daftar vich form bharo.", en: "Fill out a form in the office.", vi: "Hãy điền mẫu đơn ở văn phòng." } },
      { speaker: "learner", line: { pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਬਾਰਾ ਕਹੋ।", romanization: "kirpa karke hauli dubara kaho.", en: "Please say it again slowly.", vi: "Vui lòng nói lại chậm hơn." } },
    ],
    checkpointPrompt_en: "Explain the card problem, ask for repetition, and confirm where to go.",
    checkpointPrompt_vi: "Giải thích vấn đề thẻ, xin nhắc lại và xác nhận cần đi đâu.",
    learnerModelAnswer: {
      pa: "ਮੇਰਾ ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ, ਇਸ ਲਈ ਦਰਵਾਜ਼ਾ ਨਹੀਂ ਖੁੱਲਦਾ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਬਾਰਾ ਕਹੋ। ਕੀ ਮੈਨੂੰ ਦਫ਼ਤਰ ਵਿੱਚ ਫਾਰਮ ਭਰਨਾ ਹੈ?",
      romanization: "mera card kam nahin kar riha, is lai darvaza nahin khulda. kirpa karke hauli dubara kaho. ki mainu daftar vich form bharna hai?",
      en: "My card is not working, so the door does not open. Please say it again slowly. Do I need to fill out a form in the office?",
      vi: "Thẻ của tôi không hoạt động, nên cửa không mở. Vui lòng nói lại chậm hơn. Tôi có cần điền mẫu đơn ở văn phòng không?",
    },
    commonTraps: [
      {
        trap_en: "Explaining the problem but not checking the instruction.",
        trap_vi: "Giải thích vấn đề nhưng không kiểm tra hướng dẫn.",
        better: { pa: "ਕੀ ਮੈਨੂੰ ਦਫ਼ਤਰ ਵਿੱਚ ਜਾਣਾ ਹੈ?", romanization: "ki mainu daftar vich jana hai?", en: "Do I need to go to the office?", vi: "Tôi có cần đến văn phòng không?" },
      },
    ],
    readinessRoute_en: "If clear, route to B2 service problem-solving; otherwise review B1 clarification.",
    readinessRoute_vi: "Nếu rõ, chuyển sang giải quyết vấn đề dịch vụ B2; nếu chưa, ôn làm rõ B1.",
  },
  {
    id: "pa-b1-integrated-02-bill-complaint",
    level: "B1",
    focus: "polite_complaint_service",
    title_en: "Make a polite service complaint",
    title_vi: "Khiếu nại dịch vụ một cách lịch sự",
    scenario_en: "An unexpected charge appears on your phone or utility bill.",
    scenario_vi: "Một khoản phí bất ngờ xuất hiện trên hóa đơn điện thoại hoặc tiện ích.",
    canadaContext: "Useful for customer-service counters and phone support.",
    integratedSkills_en: ["Open politely.", "Explain the charge issue.", "Ask correction timing."],
    integratedSkills_vi: ["Mở đầu lịch sự.", "Giải thích vấn đề khoản phí.", "Hỏi thời gian sửa."],
    roleplayTurns: [
      { speaker: "learner", line: { pa: "ਮੇਰੇ ਬਿੱਲ ਵਿੱਚ ਇਹ ਚਾਰਜ ਸਮਝ ਨਹੀਂ ਆ ਰਿਹਾ।", romanization: "mere bill vich eh charge samajh nahin aa riha.", en: "I do not understand this charge on my bill.", vi: "Tôi không hiểu khoản phí này trên hóa đơn." } },
      { speaker: "staff", line: { pa: "ਮੈਂ ਵੇਖਦਾ ਹਾਂ।", romanization: "main vekhda han.", en: "I will check.", vi: "Tôi sẽ kiểm tra." } },
      { speaker: "learner", line: { pa: "ਜੇ ਇਹ ਗਲਤੀ ਹੈ, ਠੀਕ ਹੋਣ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?", romanization: "je eh galti hai, theek hon vich kinna sama laggega?", en: "If this is a mistake, how long will it take to be corrected?", vi: "Nếu đây là lỗi, sẽ mất bao lâu để sửa?" } },
    ],
    checkpointPrompt_en: "Ask about the charge without blaming staff and confirm the correction timeline.",
    checkpointPrompt_vi: "Hỏi về khoản phí mà không đổ lỗi cho nhân viên và xác nhận thời gian sửa.",
    learnerModelAnswer: {
      pa: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਮੇਰੇ ਬਿੱਲ ਵਿੱਚ ਇਹ ਚਾਰਜ ਸਮਝ ਨਹੀਂ ਆ ਰਿਹਾ। ਕੀ ਇਹ ਗਲਤੀ ਹੋ ਸਕਦੀ ਹੈ? ਜੇ ਹਾਂ, ਠੀਕ ਹੋਣ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?",
      romanization: "maaf karna ji, mere bill vich eh charge samajh nahin aa riha. ki eh galti ho sakdi hai? je han, theek hon vich kinna sama laggega?",
      en: "Excuse me, I do not understand this charge on my bill. Could this be a mistake? If yes, how long will it take to be corrected?",
      vi: "Xin lỗi, tôi không hiểu khoản phí này trên hóa đơn. Đây có thể là lỗi không? Nếu đúng, sẽ mất bao lâu để sửa?",
    },
    commonTraps: [
      {
        trap_en: "Starting with blame instead of asking for an explanation.",
        trap_vi: "Bắt đầu bằng đổ lỗi thay vì hỏi giải thích.",
        better: { pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਚਾਰਜ ਸਮਝਾ ਦਿਓ।", romanization: "kirpa karke eh charge samjha dio.", en: "Please explain this charge.", vi: "Vui lòng giải thích khoản phí này." },
      },
    ],
    readinessRoute_en: "If polite and factual, route to B2 complaint handling.",
    readinessRoute_vi: "Nếu lịch sự và đúng sự việc, chuyển sang xử lý khiếu nại B2.",
  },
  {
    id: "pa-b1-integrated-03-workplace-delay",
    level: "B1",
    focus: "workplace_update",
    title_en: "Report a workplace delay",
    title_vi: "Báo cáo chậm trễ nơi làm việc",
    scenario_en: "A supply has not arrived, so a task cannot be finished today.",
    scenario_vi: "Đồ cung ứng chưa đến, nên một việc không thể hoàn thành hôm nay.",
    canadaContext: "Useful for office, retail, warehouse, hospitality, and community-service jobs.",
    integratedSkills_en: ["Name the blocker.", "Explain impact.", "Offer a realistic alternative."],
    integratedSkills_vi: ["Nêu trở ngại.", "Giải thích ảnh hưởng.", "Đưa phương án thay thế thực tế."],
    roleplayTurns: [
      { speaker: "learner", line: { pa: "ਸਪਲਾਈ ਅਜੇ ਨਹੀਂ ਆਈ।", romanization: "supply aje nahin aai.", en: "The supply has not arrived yet.", vi: "Đồ cung ứng vẫn chưa đến." } },
      { speaker: "supervisor", line: { pa: "ਫਿਰ ਤੁਸੀਂ ਕੀ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "phir tusin ki kar sakde ho?", en: "Then what can you do?", vi: "Vậy bạn có thể làm gì?" } },
      { speaker: "learner", line: { pa: "ਮੈਂ ਹੋਰ ਕੰਮ ਪਹਿਲਾਂ ਕਰ ਸਕਦਾ ਹਾਂ।", romanization: "main hor kam pahilan kar sakda han.", en: "I can do other work first.", vi: "Tôi có thể làm việc khác trước." } },
    ],
    checkpointPrompt_en: "Tell your supervisor the blocker, impact, and alternative next step.",
    checkpointPrompt_vi: "Nói với quản lý trở ngại, ảnh hưởng và bước thay thế tiếp theo.",
    learnerModelAnswer: {
      pa: "ਸਪਲਾਈ ਅਜੇ ਨਹੀਂ ਆਈ, ਇਸ ਲਈ ਇਹ ਕੰਮ ਅੱਜ ਪੂਰਾ ਨਹੀਂ ਹੋ ਸਕਦਾ। ਮੈਂ ਹੋਰ ਕੰਮ ਪਹਿਲਾਂ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਸੀਂ ਕਿਹੜਾ ਕੰਮ ਪਹਿਲਾਂ ਚਾਹੁੰਦੇ ਹੋ?",
      romanization: "supply aje nahin aai, is lai eh kam ajj pura nahin ho sakda. main hor kam pahilan kar sakda han. tusin kihra kam pahilan chahunde ho?",
      en: "The supply has not arrived yet, so this task cannot be finished today. I can do other work first. Which task do you want first?",
      vi: "Đồ cung ứng vẫn chưa đến, nên việc này không thể hoàn thành hôm nay. Tôi có thể làm việc khác trước. Bạn muốn việc nào trước?",
    },
    commonTraps: [
      {
        trap_en: "Saying only 'I cannot' without reason or option.",
        trap_vi: "Chỉ nói 'tôi không thể' mà không nêu lý do hoặc lựa chọn.",
        better: { pa: "ਇਹ ਅਜੇ ਨਹੀਂ ਹੋ ਸਕਦਾ, ਪਰ ਮੈਂ ਦੂਜਾ ਕੰਮ ਕਰ ਸਕਦਾ ਹਾਂ।", romanization: "eh aje nahin ho sakda, par main duja kam kar sakda han.", en: "This cannot be done yet, but I can do another task.", vi: "Việc này chưa làm được, nhưng tôi có thể làm việc khác." },
      },
    ],
    readinessRoute_en: "If complete, route to B2 workplace status updates.",
    readinessRoute_vi: "Nếu đầy đủ, chuyển sang cập nhật tình trạng công việc B2.",
  },
  {
    id: "pa-b1-integrated-04-school-pickup",
    level: "B1",
    focus: "housing_school_issue",
    title_en: "Handle a school schedule change",
    title_vi: "Xử lý thay đổi lịch ở trường",
    scenario_en: "Your child must be picked up earlier today, and you need to ask the office what to do.",
    scenario_vi: "Hôm nay con bạn cần được đón sớm hơn, và bạn cần hỏi văn phòng nên làm gì.",
    canadaContext: "Useful at school offices, childcare desks, and parent communication counters.",
    integratedSkills_en: ["State old and new time.", "Ask if a form is needed.", "Use polite register."],
    integratedSkills_vi: ["Nêu giờ cũ và giờ mới.", "Hỏi có cần mẫu đơn không.", "Dùng mức lịch sự."],
    roleplayTurns: [
      { speaker: "learner", line: { pa: "ਅੱਜ ਪਿਕਅੱਪ ਸਮਾਂ ਬਦਲ ਗਿਆ ਹੈ।", romanization: "ajj pickup sama badal gia hai.", en: "Today the pickup time has changed.", vi: "Hôm nay giờ đón đã thay đổi." } },
      { speaker: "staff", line: { pa: "ਕਿਹੜਾ ਸਮਾਂ?", romanization: "kihra sama?", en: "What time?", vi: "Giờ nào?" } },
      { speaker: "learner", line: { pa: "ਤਿੰਨ ਵਜੇ, ਚਾਰ ਵਜੇ ਨਹੀਂ।", romanization: "tinn vaje, char vaje nahin.", en: "At three, not four.", vi: "Lúc ba giờ, không phải bốn giờ." } },
    ],
    checkpointPrompt_en: "Explain the schedule change and ask if a form or office note is needed.",
    checkpointPrompt_vi: "Giải thích thay đổi lịch và hỏi có cần mẫu đơn hoặc ghi chú văn phòng không.",
    learnerModelAnswer: {
      pa: "ਅੱਜ ਮੇਰੇ ਬੱਚੇ ਦਾ ਪਿਕਅੱਪ ਸਮਾਂ ਬਦਲ ਗਿਆ ਹੈ। ਤਿੰਨ ਵਜੇ ਲੈਣਾ ਹੈ, ਚਾਰ ਵਜੇ ਨਹੀਂ। ਕੀ ਕੋਈ ਫਾਰਮ ਭਰਨਾ ਹੈ?",
      romanization: "ajj mere bache da pickup sama badal gia hai. tinn vaje laina hai, char vaje nahin. ki koi form bharna hai?",
      en: "Today my child's pickup time has changed. Pickup is at three, not four. Is there a form to fill out?",
      vi: "Hôm nay giờ đón con tôi đã thay đổi. Đón lúc ba giờ, không phải bốn giờ. Có mẫu đơn nào cần điền không?",
    },
    commonTraps: [
      {
        trap_en: "Leaving out whose schedule changed.",
        trap_vi: "Bỏ sót lịch của ai thay đổi.",
        better: { pa: "ਮੇਰੇ ਬੱਚੇ ਦਾ ਪਿਕਅੱਪ ਸਮਾਂ ਬਦਲ ਗਿਆ ਹੈ।", romanization: "mere bache da pickup sama badal gia hai.", en: "My child's pickup time has changed.", vi: "Giờ đón con tôi đã thay đổi." },
      },
    ],
    readinessRoute_en: "If clear, route to B2 family-service conversations.",
    readinessRoute_vi: "Nếu rõ, chuyển sang hội thoại dịch vụ gia đình B2.",
  },
  {
    id: "pa-b1-integrated-05-retell-repair",
    level: "B1",
    focus: "retell_and_repair",
    title_en: "Retell an event and repair misunderstanding",
    title_vi: "Kể lại sự việc và sửa hiểu nhầm",
    scenario_en: "You arrived late because a bus connection changed, and a coworker misunderstood the reason.",
    scenario_vi: "Bạn đến muộn vì tuyến xe buýt nối chuyến thay đổi, và đồng nghiệp hiểu nhầm lý do.",
    canadaContext: "Useful for transit, work, school, and appointment delay explanations.",
    integratedSkills_en: ["Retell in order.", "Correct misunderstanding.", "State next action."],
    integratedSkills_vi: ["Kể theo thứ tự.", "Sửa hiểu nhầm.", "Nêu hành động tiếp theo."],
    roleplayTurns: [
      { speaker: "friend", line: { pa: "ਤੁਸੀਂ ਦੇਰ ਨਾਲ ਕਿਉਂ ਆਏ?", romanization: "tusin der naal kyon aaye?", en: "Why did you come late?", vi: "Vì sao bạn đến muộn?" } },
      { speaker: "learner", line: { pa: "ਪਹਿਲਾਂ ਬੱਸ ਦੇਰ ਨਾਲ ਆਈ।", romanization: "pahilan bus der naal aai.", en: "First the bus came late.", vi: "Trước tiên xe buýt đến muộn." } },
      { speaker: "learner", line: { pa: "ਫਿਰ ਅਗਲੀ ਬੱਸ ਨਿਕਲ ਗਈ।", romanization: "phir agli bus nikal gai.", en: "Then the next bus left.", vi: "Sau đó chuyến xe tiếp theo đã đi." } },
    ],
    checkpointPrompt_en: "Retell the delay with first/then/because and correct the misunderstanding.",
    checkpointPrompt_vi: "Kể lại chậm trễ bằng trước tiên/sau đó/vì vậy và sửa hiểu nhầm.",
    learnerModelAnswer: {
      pa: "ਪਹਿਲਾਂ ਬੱਸ ਦੇਰ ਨਾਲ ਆਈ। ਫਿਰ ਅਗਲੀ ਬੱਸ ਨਿਕਲ ਗਈ। ਇਸ ਕਰਕੇ ਮੈਂ ਦੇਰ ਨਾਲ ਆਇਆ, ਪਰ ਮੈਂ ਪਹਿਲਾਂ ਹੀ ਸੁਨੇਹਾ ਭੇਜਿਆ ਸੀ।",
      romanization: "pahilan bus der naal aai. phir agli bus nikal gai. is karke main der naal aaya, par main pahilan hi suneha bhejia si.",
      en: "First the bus came late. Then the next bus left. Because of this I came late, but I had already sent a message.",
      vi: "Trước tiên xe buýt đến muộn. Sau đó chuyến xe tiếp theo đã đi. Vì vậy tôi đến muộn, nhưng tôi đã nhắn trước rồi.",
    },
    commonTraps: [
      {
        trap_en: "Giving excuses without sequence markers.",
        trap_vi: "Đưa lý do mà không dùng từ nối trình tự.",
        better: { pa: "ਪਹਿਲਾਂ..., ਫਿਰ..., ਇਸ ਕਰਕੇ...", romanization: "pahilan..., phir..., is karke...", en: "First..., then..., because of this...", vi: "Trước tiên..., sau đó..., vì vậy..." },
      },
    ],
    readinessRoute_en: "If sequencing is stable, route to B2 narrative repair tasks.",
    readinessRoute_vi: "Nếu trình tự ổn, chuyển sang nhiệm vụ sửa hiểu nhầm trong kể chuyện B2.",
  },
  {
    id: "pa-b1-integrated-06-community-service-call",
    level: "B1",
    focus: "community_service_call",
    title_en: "Call a community service",
    title_vi: "Gọi dịch vụ cộng đồng",
    scenario_en: "You call a community centre to ask about a class, registration, and what to bring.",
    scenario_vi: "Bạn gọi trung tâm cộng đồng để hỏi về lớp học, đăng ký và cần mang gì.",
    canadaContext: "Useful for libraries, newcomer centres, recreation programs, and volunteer programs.",
    integratedSkills_en: ["Ask availability.", "Ask registration.", "Clarify what to bring."],
    integratedSkills_vi: ["Hỏi còn chỗ không.", "Hỏi đăng ký.", "Làm rõ cần mang gì."],
    roleplayTurns: [
      { speaker: "learner", line: { pa: "ਕੀ ਕਲਾਸ ਵਿੱਚ ਜਗ੍ਹਾ ਹੈ?", romanization: "ki class vich jagah hai?", en: "Is there space in the class?", vi: "Lớp còn chỗ không?" } },
      { speaker: "staff", line: { pa: "ਹਾਂ, ਪਰ ਰਜਿਸਟਰ ਕਰਨਾ ਪਵੇਗਾ।", romanization: "han, par register karna pavega.", en: "Yes, but you must register.", vi: "Có, nhưng bạn phải đăng ký." } },
      { speaker: "learner", line: { pa: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਕਿਵੇਂ ਕਰਨੀ ਹੈ?", romanization: "registration kiven karni hai?", en: "How do I register?", vi: "Tôi đăng ký bằng cách nào?" } },
    ],
    checkpointPrompt_en: "Ask about class space, registration, and what to bring.",
    checkpointPrompt_vi: "Hỏi lớp còn chỗ không, cách đăng ký và cần mang gì.",
    learnerModelAnswer: {
      pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਕੀ ਕਲਾਸ ਵਿੱਚ ਜਗ੍ਹਾ ਹੈ? ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਕਿਵੇਂ ਕਰਨੀ ਹੈ, ਅਤੇ ਮੈਨੂੰ ਕੀ ਲਿਆਉਣਾ ਚਾਹੀਦਾ ਹੈ?",
      romanization: "sat sri akal ji, ki class vich jagah hai? registration kiven karni hai, ate mainu ki liauna chahida hai?",
      en: "Hello, is there space in the class? How do I register, and what should I bring?",
      vi: "Xin chào, lớp còn chỗ không? Tôi đăng ký bằng cách nào, và nên mang gì?",
    },
    commonTraps: [
      {
        trap_en: "Asking only about the class but not registration.",
        trap_vi: "Chỉ hỏi về lớp mà không hỏi đăng ký.",
        better: { pa: "ਰਜਿਸਟਰ ਕਰਨ ਲਈ ਕੀ ਚਾਹੀਦਾ ਹੈ?", romanization: "register karan lai ki chahida hai?", en: "What is needed to register?", vi: "Cần gì để đăng ký?" },
      },
    ],
    readinessRoute_en: "If complete, route to B2 community participation tasks.",
    readinessRoute_vi: "Nếu đầy đủ, chuyển sang nhiệm vụ tham gia cộng đồng B2.",
  },
  {
    id: "pa-b1-integrated-07-clinic-language",
    level: "B1",
    focus: "health_service_language",
    title_en: "Use clinic language support safely",
    title_vi: "Dùng hỗ trợ ngôn ngữ phòng khám một cách an toàn",
    scenario_en: "You tell a clinic desk about a symptom and ask for an appointment. Language support only, not medical advice.",
    scenario_vi: "Bạn nói với quầy phòng khám về một triệu chứng và xin lịch hẹn. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn y tế.",
    canadaContext: "Useful for appointment desks, pharmacies, and clinic calls as language practice only.",
    integratedSkills_en: ["Describe symptom.", "Say duration.", "Ask appointment or next step without advice claims."],
    integratedSkills_vi: ["Mô tả triệu chứng.", "Nêu thời gian kéo dài.", "Xin lịch hẹn hoặc bước tiếp theo mà không đưa lời khuyên."],
    roleplayTurns: [
      { speaker: "learner", line: { pa: "ਮੈਨੂੰ ਦੋ ਦਿਨ ਤੋਂ ਖੰਘ ਹੈ।", romanization: "mainu do din ton khangh hai.", en: "I have had a cough for two days.", vi: "Tôi bị ho hai ngày rồi." } },
      { speaker: "staff", line: { pa: "ਕੀ ਤੁਸੀਂ ਅਪਾਇੰਟਮੈਂਟ ਚਾਹੁੰਦੇ ਹੋ?", romanization: "ki tusin appointment chahunde ho?", en: "Do you want an appointment?", vi: "Bạn muốn lịch hẹn không?" } },
      { speaker: "learner", line: { pa: "ਹਾਂ ਜੀ, ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।", romanization: "han ji, mainu agla kadam dasso.", en: "Yes, please tell me the next step.", vi: "Vâng, vui lòng cho tôi biết bước tiếp theo." } },
    ],
    checkpointPrompt_en: "Describe the symptom and ask for appointment steps as language practice only.",
    checkpointPrompt_vi: "Mô tả triệu chứng và hỏi các bước đặt lịch chỉ như luyện ngôn ngữ.",
    learnerModelAnswer: {
      pa: "ਮੈਨੂੰ ਦੋ ਦਿਨ ਤੋਂ ਖੰਘ ਹੈ। ਮੈਂ ਅਪਾਇੰਟਮੈਂਟ ਲੈਣੀ ਚਾਹੁੰਦਾ ਹਾਂ। ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਦੱਸੋ ਜੀ।",
      romanization: "mainu do din ton khangh hai. main appointment laini chahunda han. mainu agla kadam dasso ji.",
      en: "I have had a cough for two days. I want to make an appointment. Please tell me the next step.",
      vi: "Tôi bị ho hai ngày rồi. Tôi muốn đặt lịch hẹn. Vui lòng cho tôi biết bước tiếp theo.",
    },
    commonTraps: [
      {
        trap_en: "Turning language practice into treatment advice.",
        trap_vi: "Biến luyện ngôn ngữ thành lời khuyên điều trị.",
        better: { pa: "ਮੈਂ ਅਪਾਇੰਟਮੈਂਟ ਲੈਣੀ ਚਾਹੁੰਦਾ ਹਾਂ।", romanization: "main appointment laini chahunda han.", en: "I want to make an appointment.", vi: "Tôi muốn đặt lịch hẹn." },
      },
    ],
    readinessRoute_en: "If clear, route to healthcare communication practice with safety limits.",
    readinessRoute_vi: "Nếu rõ, chuyển sang luyện giao tiếp y tế có giới hạn an toàn.",
  },
  {
    id: "pa-b1-integrated-08-register-routing",
    level: "B1",
    focus: "register_routing_review",
    title_en: "Review register and routing",
    title_vi: "Ôn mức lịch sự và lộ trình",
    scenario_en: "You finish a roleplay and decide whether to review B1 or move toward B2.",
    scenario_vi: "Bạn hoàn thành vai diễn và quyết định ôn B1 hay chuyển dần sang B2.",
    canadaContext: "Useful for tutoring, settlement classes, self-study logs, and progress reviews.",
    integratedSkills_en: ["Use polite forms.", "Name a weak skill.", "Choose a next route."],
    integratedSkills_vi: ["Dùng dạng lịch sự.", "Nêu kỹ năng yếu.", "Chọn lộ trình tiếp theo."],
    roleplayTurns: [
      { speaker: "teacher", line: { pa: "ਤੁਹਾਡਾ ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", romanization: "tuhada agla kadam ki hai?", en: "What is your next step?", vi: "Bước tiếp theo của bạn là gì?" } },
      { speaker: "learner", line: { pa: "ਮੈਨੂੰ ਸਪਸ਼ਟੀਕਰਨ ਦੀ ਹੋਰ ਅਭਿਆਸ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu spashtikaran di hor abhyas chahidi hai.", en: "I need more clarification practice.", vi: "Tôi cần luyện thêm làm rõ thông tin." } },
      { speaker: "teacher", line: { pa: "ਠੀਕ ਹੈ, ਪਹਿਲਾਂ B1 ਦੁਹਰਾਓ।", romanization: "theek hai, pahilan B1 duhrao.", en: "Okay, review B1 first.", vi: "Được, hãy ôn B1 trước." } },
    ],
    checkpointPrompt_en: "Use polite Punjabi, name one weak skill, and choose a readiness route.",
    checkpointPrompt_vi: "Dùng Punjabi lịch sự, nêu một kỹ năng yếu và chọn lộ trình sẵn sàng.",
    learnerModelAnswer: {
      pa: "ਮੈਂ ਸੇਵਾ ਗੱਲਬਾਤ ਕਰ ਸਕਦਾ ਹਾਂ, ਪਰ ਮੈਨੂੰ ਸਪਸ਼ਟੀਕਰਨ ਦੀ ਹੋਰ ਅਭਿਆਸ ਚਾਹੀਦੀ ਹੈ। ਮੈਂ ਪਹਿਲਾਂ B1 ਦੁਹਰਾਵਾਂਗਾ, ਫਿਰ B2 ਸ਼ੁਰੂ ਕਰਾਂਗਾ। ਸ਼ਾਹਮੁਖੀ ਸਿਰਫ਼ ਜਾਣ-ਪਛਾਣ ਲਈ ਹੈ।",
      romanization: "main seva galbaat kar sakda han, par mainu spashtikaran di hor abhyas chahidi hai. main pahilan B1 duhravanga, phir B2 shuru karanga. Shahmukhi sirf jaan-pachhan lai hai.",
      en: "I can handle service conversation, but I need more clarification practice. I will review B1 first, then start B2. Shahmukhi is only for awareness.",
      vi: "Tôi có thể xử lý hội thoại dịch vụ, nhưng cần luyện thêm làm rõ thông tin. Tôi sẽ ôn B1 trước, rồi bắt đầu B2. Shahmukhi chỉ để nhận biết.",
    },
    commonTraps: [
      {
        trap_en: "Using ਤੂੰ with unfamiliar adults or claiming native review is complete.",
        trap_vi: "Dùng ਤੂੰ với người lớn chưa thân hoặc tuyên bố đã có người bản ngữ xem lại.",
        better: { pa: "ਕੀ ਤੁਸੀਂ ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਦੱਸ ਸਕਦੇ ਹੋ ਜੀ?", romanization: "ki tusin mainu agla kadam dass sakde ho ji?", en: "Could you please tell me the next step?", vi: "Bạn có thể vui lòng cho tôi biết bước tiếp theo không?" },
      },
    ],
    readinessRoute_en: "Route to targeted B1 review, B2 bridge, or teacher review. Native review is deferred.",
    readinessRoute_vi: "Chuyển sang ôn B1 có mục tiêu, cầu nối B2 hoặc giáo viên xem lại. Phần người bản ngữ xem lại được để sau.",
  },
];
