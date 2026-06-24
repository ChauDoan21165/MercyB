// src/languages/punjabi/workplaceScenariosB1.ts
//
// Punjabi B1 workplace scenarios for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary; romanization is a support bridge. Shahmukhi is
// mentioned only for awareness, not taught as a full course.
//
// Native review is deferred; this module makes no native-review claim.

export type PunjabiB1WorkplaceFocus =
  | "supervisor_clarification"
  | "task_handoff"
  | "schedule_change"
  | "safety_concern"
  | "customer_issue"
  | "training_question"
  | "polite_disagreement"
  | "incident_explanation";

export type PunjabiWorkplaceLine = {
  speaker: "learner" | "supervisor" | "coworker" | "customer";
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiWorkplacePhrase = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiWorkplaceTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiWorkplacePhrase;
};

export type PunjabiB1WorkplaceScenario = {
  id: string;
  level: "B1";
  focus: PunjabiB1WorkplaceFocus;
  title_en: string;
  title_vi: string;
  workplaceContext_en: string;
  workplaceContext_vi: string;
  learnerGoal_en: string;
  learnerGoal_vi: string;
  canadaContext: string;
  usefulPhrases: PunjabiWorkplacePhrase[];
  modelExchange: PunjabiWorkplaceLine[];
  escalationPhrase: PunjabiWorkplacePhrase;
  followUpTask_en: string;
  followUpTask_vi: string;
  commonTraps: PunjabiWorkplaceTrap[];
};

export const punjabiB1WorkplaceScenarios: PunjabiB1WorkplaceScenario[] = [
  {
    id: "pa-b1-work-01-supervisor-priority",
    level: "B1",
    focus: "supervisor_clarification",
    title_en: "Clarify task priority with a supervisor",
    title_vi: "Làm rõ ưu tiên công việc với quản lý",
    workplaceContext_en: "You have two tasks and are not sure which one is urgent.",
    workplaceContext_vi: "Bạn có hai nhiệm vụ và không chắc việc nào gấp.",
    learnerGoal_en: "Ask which task to do first, the deadline, and the expected result.",
    learnerGoal_vi: "Hỏi việc nào làm trước, hạn chót và kết quả mong đợi.",
    canadaContext: "Useful for retail, warehouse, office, hospitality, and community-service jobs in Canada.",
    usefulPhrases: [
      { pa: "ਕਿਹੜਾ ਕੰਮ ਪਹਿਲਾਂ ਕਰਨਾ ਹੈ?", romanization: "kihra kamm pahilan karna hai?", en: "Which task should be done first?", vi: "Nhiệm vụ nào nên làm trước?" },
      { pa: "ਇਸ ਦੀ ਡੈਡਲਾਈਨ ਕੀ ਹੈ?", romanization: "is di deadline ki hai?", en: "What is its deadline?", vi: "Hạn chót của việc này là gì?" },
      { pa: "ਕੀ ਤੁਸੀਂ ਉਦਾਹਰਨ ਦਿਖਾ ਸਕਦੇ ਹੋ?", romanization: "ki tusin udaharan dikha sakde ho?", en: "Can you show an example?", vi: "Bạn có thể cho xem ví dụ không?" },
    ],
    modelExchange: [
      { speaker: "learner", pa: "ਮੇਰੇ ਕੋਲ ਦੋ ਕੰਮ ਹਨ। ਕਿਹੜਾ ਕੰਮ ਪਹਿਲਾਂ ਕਰਨਾ ਹੈ?", romanization: "mere kol do kamm han. kihra kamm pahilan karna hai?", en: "I have two tasks. Which task should be done first?", vi: "Tôi có hai nhiệm vụ. Nhiệm vụ nào nên làm trước?" },
      { speaker: "supervisor", pa: "ਪਹਿਲਾਂ ਗਾਹਕ ਵਾਲੀ ਫ਼ਾਈਲ ਪੂਰੀ ਕਰੋ।", romanization: "pahilan gahak wali file puri karo.", en: "Finish the customer file first.", vi: "Hoàn thành hồ sơ khách hàng trước." },
      { speaker: "learner", pa: "ਠੀਕ ਹੈ। ਇਸ ਦੀ ਡੈਡਲਾਈਨ ਕੀ ਹੈ?", romanization: "theek hai. is di deadline ki hai?", en: "Okay. What is its deadline?", vi: "Được. Hạn chót là khi nào?" },
    ],
    escalationPhrase: { pa: "ਜੇ ਇਹ ਜ਼ਰੂਰੀ ਹੈ, ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਲਿਖਤੀ ਹਦਾਇਤ ਭੇਜ ਦਿਓ।", romanization: "je eh zaroori hai, kirpa karke mainu likhti hadait bhej dio.", en: "If this is urgent, please send me written instructions.", vi: "Nếu việc này khẩn cấp, vui lòng gửi hướng dẫn bằng văn bản." },
    followUpTask_en: "Ask your supervisor what quality standard to follow.",
    followUpTask_vi: "Hỏi quản lý nên theo tiêu chuẩn chất lượng nào.",
    commonTraps: [
      {
        trap_en: "Nodding without clarifying priority.",
        trap_vi: "Gật đầu mà không làm rõ ưu tiên.",
        better: { pa: "ਪਹਿਲਾਂ ਕਿਹੜਾ ਕੰਮ ਜ਼ਰੂਰੀ ਹੈ?", romanization: "pahilan kihra kamm zaroori hai?", en: "Which work is urgent first?", vi: "Việc nào cần gấp trước?" },
      },
    ],
  },
  {
    id: "pa-b1-work-02-task-handoff",
    level: "B1",
    focus: "task_handoff",
    title_en: "Hand off an unfinished task",
    title_vi: "Bàn giao việc chưa xong",
    workplaceContext_en: "Your shift is ending, but one task is not complete.",
    workplaceContext_vi: "Ca làm của bạn sắp hết, nhưng một việc chưa xong.",
    learnerGoal_en: "Explain status, what remains, and where the information is.",
    learnerGoal_vi: "Giải thích tình trạng, phần còn lại và thông tin ở đâu.",
    canadaContext: "Useful for shift work in retail, food service, care, warehouse, and front-desk jobs.",
    usefulPhrases: [
      { pa: "ਇਹ ਕੰਮ ਅੱਧਾ ਪੂਰਾ ਹੈ।", romanization: "eh kamm addha pura hai.", en: "This task is half complete.", vi: "Việc này hoàn thành một nửa." },
      { pa: "ਬਾਕੀ ਹਿੱਸਾ ਇੱਥੇ ਲਿਖਿਆ ਹੈ।", romanization: "baaki hissa itthe likhia hai.", en: "The remaining part is written here.", vi: "Phần còn lại được ghi ở đây." },
      { pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਅੱਗੇ ਲੈ ਸਕਦੇ ਹੋ?", romanization: "ki tusin eh agge lai sakde ho?", en: "Can you take this forward?", vi: "Bạn có thể tiếp tục việc này không?" },
    ],
    modelExchange: [
      { speaker: "learner", pa: "ਮੇਰਾ ਸ਼ਿਫਟ ਮੁੱਕ ਰਿਹਾ ਹੈ। ਇਹ ਕੰਮ ਅੱਧਾ ਪੂਰਾ ਹੈ।", romanization: "mera shift mukk riha hai. eh kamm addha pura hai.", en: "My shift is ending. This task is half complete.", vi: "Ca của tôi sắp kết thúc. Việc này xong một nửa." },
      { speaker: "coworker", pa: "ਬਾਕੀ ਕੀ ਕਰਨਾ ਹੈ?", romanization: "baaki ki karna hai?", en: "What remains to be done?", vi: "Còn phải làm gì?" },
      { speaker: "learner", pa: "ਬਾਕੀ ਹਿੱਸਾ ਇੱਥੇ ਲਿਖਿਆ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਹ ਅੱਗੇ ਲੈ ਸਕਦੇ ਹੋ?", romanization: "baaki hissa itthe likhia hai. ki tusin eh agge lai sakde ho?", en: "The remaining part is written here. Can you take this forward?", vi: "Phần còn lại ghi ở đây. Bạn có thể tiếp tục không?" },
    ],
    escalationPhrase: { pa: "ਜੇ ਸਮਝ ਨਾ ਆਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੇਜਰ ਨੂੰ ਪੁੱਛੋ।", romanization: "je samajh na aave, kirpa karke manager nu puchho.", en: "If it is not clear, please ask the manager.", vi: "Nếu chưa rõ, vui lòng hỏi quản lý." },
    followUpTask_en: "Add one sentence about where the file or tool is located.",
    followUpTask_vi: "Thêm một câu nói hồ sơ hoặc dụng cụ ở đâu.",
    commonTraps: [
      {
        trap_en: "Saying 'not finished' without saying what remains.",
        trap_vi: "Nói 'chưa xong' mà không nói còn gì.",
        better: { pa: "ਸਿਰਫ਼ ਆਖ਼ਰੀ ਪੰਨਾ ਚੈੱਕ ਕਰਨਾ ਬਾਕੀ ਹੈ।", romanization: "sirf akhri panna check karna baaki hai.", en: "Only the last page remains to be checked.", vi: "Chỉ còn kiểm tra trang cuối." },
      },
    ],
  },
  {
    id: "pa-b1-work-03-schedule-change",
    level: "B1",
    focus: "schedule_change",
    title_en: "Request a schedule change",
    title_vi: "Xin đổi lịch làm",
    workplaceContext_en: "Your shift conflicts with an important appointment.",
    workplaceContext_vi: "Ca làm của bạn trùng với một lịch hẹn quan trọng.",
    learnerGoal_en: "Explain the conflict, offer availability, and ask for confirmation.",
    learnerGoal_vi: "Giải thích trùng lịch, đưa thời gian rảnh và xin xác nhận.",
    canadaContext: "Useful for part-time and hourly jobs where schedules change often.",
    usefulPhrases: [
      { pa: "ਮੇਰਾ ਸ਼ਿਫਟ ਅਪਾਇੰਟਮੈਂਟ ਨਾਲ ਟਕਰਾ ਰਿਹਾ ਹੈ।", romanization: "mera shift appointment naal takra riha hai.", en: "My shift conflicts with an appointment.", vi: "Ca làm của tôi trùng với lịch hẹn." },
      { pa: "ਮੈਂ ਸ਼ਾਮ ਵਾਲਾ ਸ਼ਿਫਟ ਕਰ ਸਕਦਾ ਹਾਂ।", romanization: "main shaam wala shift kar sakda han.", en: "I can work the evening shift.", vi: "Tôi có thể làm ca tối." },
      { pa: "ਕੀ ਨਵਾਂ ਸ਼ਡਿਊਲ ਟੈਕਸਟ ਕਰ ਦਿਓਗੇ?", romanization: "ki nava schedule text kar dioge?", en: "Can you text the new schedule?", vi: "Bạn có thể nhắn lịch mới không?" },
    ],
    modelExchange: [
      { speaker: "learner", pa: "ਮੇਰਾ ਸ਼ਿਫਟ ਅਪਾਇੰਟਮੈਂਟ ਨਾਲ ਟਕਰਾ ਰਿਹਾ ਹੈ। ਕੀ ਮੈਂ ਸ਼ਿਫਟ ਬਦਲ ਸਕਦਾ ਹਾਂ?", romanization: "mera shift appointment naal takra riha hai. ki main shift badal sakda han?", en: "My shift conflicts with an appointment. Can I change shifts?", vi: "Ca của tôi trùng với lịch hẹn. Tôi đổi ca được không?" },
      { speaker: "supervisor", pa: "ਤੁਸੀਂ ਕਿਹੜਾ ਸਮਾਂ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "tusin kihra sama kar sakde ho?", en: "What time can you work?", vi: "Bạn làm được giờ nào?" },
      { speaker: "learner", pa: "ਮੈਂ ਸ਼ਾਮ ਵਾਲਾ ਸ਼ਿਫਟ ਕਰ ਸਕਦਾ ਹਾਂ। ਕੀ ਨਵਾਂ ਸ਼ਡਿਊਲ ਟੈਕਸਟ ਕਰ ਦਿਓਗੇ?", romanization: "main shaam wala shift kar sakda han. ki nava schedule text kar dioge?", en: "I can work the evening shift. Can you text the new schedule?", vi: "Tôi có thể làm ca tối. Bạn nhắn lịch mới được không?" },
    ],
    escalationPhrase: { pa: "ਜੇ ਸ਼ਿਫਟ ਨਹੀਂ ਬਦਲ ਸਕਦਾ, ਕੀ ਮੈਂ ਛੁੱਟੀ ਲਈ ਅਰਜ਼ੀ ਦੇ ਸਕਦਾ ਹਾਂ?", romanization: "je shift nahin badal sakda, ki main chhutti lai arzi de sakda han?", en: "If I cannot change the shift, can I request leave?", vi: "Nếu không đổi ca được, tôi có thể xin nghỉ không?" },
    followUpTask_en: "Ask whether you need to find a coworker to swap with.",
    followUpTask_vi: "Hỏi bạn có cần tìm đồng nghiệp đổi ca không.",
    commonTraps: [
      {
        trap_en: "Only saying you cannot come without offering a time you can work.",
        trap_vi: "Chỉ nói không đến được mà không đưa giờ có thể làm.",
        better: { pa: "ਮੈਂ ਸਵੇਰੇ ਨਹੀਂ ਆ ਸਕਦਾ, ਪਰ ਸ਼ਾਮ ਨੂੰ ਆ ਸਕਦਾ ਹਾਂ।", romanization: "main savere nahin aa sakda, par shaam nu aa sakda han.", en: "I cannot come in the morning, but I can come in the evening.", vi: "Tôi không đến sáng được, nhưng có thể đến tối." },
      },
    ],
  },
  {
    id: "pa-b1-work-04-safety-concern",
    level: "B1",
    focus: "safety_concern",
    title_en: "Report a safety concern",
    title_vi: "Báo mối lo an toàn",
    workplaceContext_en: "The floor is wet near a customer walkway.",
    workplaceContext_vi: "Sàn bị ướt gần lối đi của khách.",
    learnerGoal_en: "Explain the risk, say what action you took, and ask what else to do.",
    learnerGoal_vi: "Giải thích rủi ro, nói hành động đã làm và hỏi cần làm gì nữa.",
    canadaContext: "Useful in workplaces where safety reporting is expected.",
    usefulPhrases: [
      { pa: "ਫਰਸ਼ ਗਿੱਲਾ ਹੈ ਅਤੇ ਲੋਕ ਫਿਸਲ ਸਕਦੇ ਹਨ।", romanization: "farsh gilla hai ate lok phisal sakde han.", en: "The floor is wet and people could slip.", vi: "Sàn bị ướt và mọi người có thể trượt." },
      { pa: "ਮੈਂ ਸਾਈਨ ਲਾ ਦਿੱਤਾ ਹੈ।", romanization: "main sign la ditta hai.", en: "I have put up a sign.", vi: "Tôi đã đặt biển báo." },
      { pa: "ਹੋਰ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?", romanization: "hor ki karna chahida hai?", en: "What else should be done?", vi: "Cần làm gì nữa?" },
    ],
    modelExchange: [
      { speaker: "learner", pa: "ਫਰਸ਼ ਗਿੱਲਾ ਹੈ ਅਤੇ ਲੋਕ ਫਿਸਲ ਸਕਦੇ ਹਨ।", romanization: "farsh gilla hai ate lok phisal sakde han.", en: "The floor is wet and people could slip.", vi: "Sàn bị ướt và mọi người có thể trượt." },
      { speaker: "supervisor", pa: "ਕੀ ਤੁਸੀਂ ਸਾਈਨ ਲਾਇਆ ਹੈ?", romanization: "ki tusin sign laia hai?", en: "Have you put up a sign?", vi: "Bạn đã đặt biển báo chưa?" },
      { speaker: "learner", pa: "ਹਾਂ ਜੀ, ਮੈਂ ਸਾਈਨ ਲਾ ਦਿੱਤਾ ਹੈ। ਹੋਰ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?", romanization: "haan ji, main sign la ditta hai. hor ki karna chahida hai?", en: "Yes, I have put up a sign. What else should be done?", vi: "Rồi, tôi đã đặt biển báo. Cần làm gì nữa?" },
    ],
    escalationPhrase: { pa: "ਜੇ ਇਹ ਖਤਰਨਾਕ ਹੈ, ਕਿਰਪਾ ਕਰਕੇ ਇਲਾਕਾ ਬੰਦ ਕਰ ਦਿਓ।", romanization: "je eh khatarnak hai, kirpa karke ilaka band kar dio.", en: "If this is dangerous, please close the area.", vi: "Nếu việc này nguy hiểm, vui lòng đóng khu vực đó." },
    followUpTask_en: "Add whether anyone was hurt and who witnessed the issue.",
    followUpTask_vi: "Thêm có ai bị thương không và ai chứng kiến vấn đề.",
    commonTraps: [
      {
        trap_en: "Reporting the problem but not the safety action.",
        trap_vi: "Báo vấn đề nhưng không nói hành động an toàn.",
        better: { pa: "ਮੈਂ ਪਹਿਲਾਂ ਸਾਈਨ ਲਾਇਆ, ਫਿਰ ਤੁਹਾਨੂੰ ਦੱਸਿਆ।", romanization: "main pahilan sign laia, phir tuhanu dassia.", en: "I put up a sign first, then told you.", vi: "Tôi đặt biển báo trước, rồi báo cho bạn/quản lý." },
      },
    ],
  },
  {
    id: "pa-b1-work-05-customer-issue",
    level: "B1",
    focus: "customer_issue",
    title_en: "Handle a customer issue",
    title_vi: "Xử lý vấn đề với khách hàng",
    workplaceContext_en: "A customer says they received the wrong item.",
    workplaceContext_vi: "Khách hàng nói họ nhận sai món/hàng.",
    learnerGoal_en: "Acknowledge the issue, ask for details, and offer a next step.",
    learnerGoal_vi: "Ghi nhận vấn đề, hỏi chi tiết và đưa bước tiếp theo.",
    canadaContext: "Useful for retail, food service, customer support, and front desk roles.",
    usefulPhrases: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਇਹ ਚੈੱਕ ਕਰਦਾ ਹਾਂ।", romanization: "maaf karna, main eh check karda han.", en: "Sorry, I will check this.", vi: "Xin lỗi, tôi sẽ kiểm tra việc này." },
      { pa: "ਤੁਹਾਡਾ ਆਰਡਰ ਨੰਬਰ ਕੀ ਹੈ?", romanization: "tuhadda order number ki hai?", en: "What is your order number?", vi: "Số đơn hàng của bạn là gì?" },
      { pa: "ਮੈਂ ਮੈਨੇਜਰ ਨੂੰ ਬੁਲਾਂਦਾ ਹਾਂ।", romanization: "main manager nu bulanda han.", en: "I will call the manager.", vi: "Tôi sẽ gọi quản lý." },
    ],
    modelExchange: [
      { speaker: "customer", pa: "ਮੈਨੂੰ ਗਲਤ ਆਈਟਮ ਮਿਲੀ ਹੈ।", romanization: "mainu galat item mili hai.", en: "I received the wrong item.", vi: "Tôi nhận sai món/hàng." },
      { speaker: "learner", pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਇਹ ਚੈੱਕ ਕਰਦਾ ਹਾਂ। ਤੁਹਾਡਾ ਆਰਡਰ ਨੰਬਰ ਕੀ ਹੈ?", romanization: "maaf karna, main eh check karda han. tuhadda order number ki hai?", en: "Sorry, I will check this. What is your order number?", vi: "Xin lỗi, tôi sẽ kiểm tra. Số đơn hàng của bạn là gì?" },
      { speaker: "learner", pa: "ਜੇ ਲੋੜ ਹੋਵੇ, ਮੈਂ ਮੈਨੇਜਰ ਨੂੰ ਬੁਲਾਂਦਾ ਹਾਂ।", romanization: "je lor hove, main manager nu bulanda han.", en: "If needed, I will call the manager.", vi: "Nếu cần, tôi sẽ gọi quản lý." },
    ],
    escalationPhrase: { pa: "ਮੈਂ ਇਸ ਵੇਲੇ ਫ਼ੈਸਲਾ ਨਹੀਂ ਕਰ ਸਕਦਾ, ਪਰ ਮੈਨੇਜਰ ਮਦਦ ਕਰ ਸਕਦੇ ਹਨ।", romanization: "main is vele faisla nahin kar sakda, par manager madad kar sakde han.", en: "I cannot make the decision right now, but the manager can help.", vi: "Hiện tại tôi không thể quyết định, nhưng quản lý có thể giúp." },
    followUpTask_en: "Ask whether the customer wants an exchange or a refund.",
    followUpTask_vi: "Hỏi khách muốn đổi hàng hay hoàn tiền.",
    commonTraps: [
      {
        trap_en: "Arguing before checking the details.",
        trap_vi: "Tranh luận trước khi kiểm tra chi tiết.",
        better: { pa: "ਪਹਿਲਾਂ ਮੈਂ ਰਸੀਦ ਚੈੱਕ ਕਰ ਲੈਂਦਾ ਹਾਂ।", romanization: "pahilan main raseed check kar lainda han.", en: "First, I will check the receipt.", vi: "Trước tiên tôi sẽ kiểm tra biên nhận." },
      },
    ],
  },
  {
    id: "pa-b1-work-06-training-question",
    level: "B1",
    focus: "training_question",
    title_en: "Ask a training question",
    title_vi: "Hỏi trong buổi đào tạo",
    workplaceContext_en: "You are learning a new system or procedure.",
    workplaceContext_vi: "Bạn đang học một hệ thống hoặc quy trình mới.",
    learnerGoal_en: "Ask for repetition, an example, and where to find instructions.",
    learnerGoal_vi: "Xin nhắc lại, xin ví dụ và hỏi nơi tìm hướng dẫn.",
    canadaContext: "Useful during onboarding, safety training, and software training.",
    usefulPhrases: [
      { pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਕਦਮ ਦੁਬਾਰਾ ਦਿਖਾ ਸਕਦੇ ਹੋ?", romanization: "ki tusin eh kadam dubara dikha sakde ho?", en: "Can you show this step again?", vi: "Bạn có thể chỉ lại bước này không?" },
      { pa: "ਕੀ ਕੋਈ ਉਦਾਹਰਨ ਹੈ?", romanization: "ki koi udaharan hai?", en: "Is there an example?", vi: "Có ví dụ không?" },
      { pa: "ਹਦਾਇਤਾਂ ਕਿੱਥੇ ਮਿਲਣਗੀਆਂ?", romanization: "hadaitan kitthe milangian?", en: "Where can I find the instructions?", vi: "Tôi có thể tìm hướng dẫn ở đâu?" },
    ],
    modelExchange: [
      { speaker: "learner", pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਇਹ ਕਦਮ ਦੁਬਾਰਾ ਦਿਖਾ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusin eh kadam dubara dikha sakde ho?", en: "Sorry, can you show this step again?", vi: "Xin lỗi, bạn có thể chỉ lại bước này không?" },
      { speaker: "supervisor", pa: "ਹਾਂ, ਪਹਿਲਾਂ ਇਹ ਬਟਨ ਦਬਾਓ।", romanization: "haan, pahilan eh button dabao.", en: "Yes, first press this button.", vi: "Được, trước tiên bấm nút này." },
      { speaker: "learner", pa: "ਧੰਨਵਾਦ। ਕੀ ਕੋਈ ਉਦਾਹਰਨ ਹੈ ਅਤੇ ਹਦਾਇਤਾਂ ਕਿੱਥੇ ਮਿਲਣਗੀਆਂ?", romanization: "dhanvaad. ki koi udaharan hai ate hadaitan kitthe milangian?", en: "Thank you. Is there an example, and where can I find the instructions?", vi: "Cảm ơn. Có ví dụ không và tôi tìm hướng dẫn ở đâu?" },
    ],
    escalationPhrase: { pa: "ਜੇ ਮੈਂ ਗਲਤੀ ਕਰਾਂ, ਕਿਰਪਾ ਕਰਕੇ ਤੁਰੰਤ ਦੱਸੋ।", romanization: "je main galti karan, kirpa karke turant dasso.", en: "If I make a mistake, please tell me immediately.", vi: "Nếu tôi làm sai, vui lòng nói ngay." },
    followUpTask_en: "Ask whether you can practice once while someone watches.",
    followUpTask_vi: "Hỏi bạn có thể thực hành một lần khi có người quan sát không.",
    commonTraps: [
      {
        trap_en: "Pretending to understand a procedure you cannot repeat.",
        trap_vi: "Giả vờ hiểu quy trình mà bạn không thể làm lại.",
        better: { pa: "ਮੈਂ ਸਮਝਣਾ ਚਾਹੁੰਦਾ ਹਾਂ, ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦਿਖਾਓ।", romanization: "main samajhna chahunda han, kirpa karke hauli dikhao.", en: "I want to understand; please show it slowly.", vi: "Tôi muốn hiểu; vui lòng chỉ chậm hơn." },
      },
    ],
  },
  {
    id: "pa-b1-work-07-polite-disagreement",
    level: "B1",
    focus: "polite_disagreement",
    title_en: "Disagree politely in a team discussion",
    title_vi: "Bất đồng lịch sự trong trao đổi nhóm",
    workplaceContext_en: "You think a proposed plan will take too long.",
    workplaceContext_vi: "Bạn nghĩ kế hoạch được đề xuất sẽ mất quá nhiều thời gian.",
    learnerGoal_en: "Acknowledge the idea, explain your concern, and suggest another option.",
    learnerGoal_vi: "Ghi nhận ý kiến, giải thích lo ngại và đề xuất lựa chọn khác.",
    canadaContext: "Useful for team meetings and collaborative workplaces.",
    usefulPhrases: [
      { pa: "ਮੈਂ ਤੁਹਾਡੀ ਗੱਲ ਸਮਝਦਾ ਹਾਂ।", romanization: "main tuhadi gall samajhda han.", en: "I understand your point.", vi: "Tôi hiểu ý bạn." },
      { pa: "ਮੇਰੀ ਚਿੰਤਾ ਸਮੇਂ ਬਾਰੇ ਹੈ।", romanization: "meri chinta same bare hai.", en: "My concern is about time.", vi: "Điều tôi lo là thời gian." },
      { pa: "ਕੀ ਅਸੀਂ ਛੋਟਾ ਵਿਕਲਪ ਵੇਖ ਸਕਦੇ ਹਾਂ?", romanization: "ki asin chhota vikalp vekh sakde han?", en: "Can we look at a smaller option?", vi: "Chúng ta có thể xem lựa chọn nhỏ hơn không?" },
    ],
    modelExchange: [
      { speaker: "coworker", pa: "ਮੇਰੇ ਖ਼ਿਆਲ ਨਾਲ ਅਸੀਂ ਪੂਰੀ ਸੂਚੀ ਅੱਜ ਕਰ ਸਕਦੇ ਹਾਂ।", romanization: "mere khayal naal asin puri suchi ajj kar sakde han.", en: "I think we can do the whole list today.", vi: "Tôi nghĩ hôm nay chúng ta có thể làm toàn bộ danh sách." },
      { speaker: "learner", pa: "ਮੈਂ ਤੁਹਾਡੀ ਗੱਲ ਸਮਝਦਾ ਹਾਂ, ਪਰ ਮੇਰੀ ਚਿੰਤਾ ਸਮੇਂ ਬਾਰੇ ਹੈ।", romanization: "main tuhadi gall samajhda han, par meri chinta same bare hai.", en: "I understand your point, but my concern is about time.", vi: "Tôi hiểu ý bạn, nhưng điều tôi lo là thời gian." },
      { speaker: "learner", pa: "ਕੀ ਅਸੀਂ ਪਹਿਲਾਂ ਛੋਟਾ ਵਿਕਲਪ ਵੇਖ ਸਕਦੇ ਹਾਂ?", romanization: "ki asin pahilan chhota vikalp vekh sakde han?", en: "Can we first look at a smaller option?", vi: "Trước tiên chúng ta xem lựa chọn nhỏ hơn được không?" },
    ],
    escalationPhrase: { pa: "ਜੇ ਫ਼ੈਸਲਾ ਅੱਜ ਕਰਨਾ ਹੈ, ਕੀ ਅਸੀਂ ਜੋਖ਼ਮ ਵੀ ਲਿਖ ਸਕਦੇ ਹਾਂ?", romanization: "je faisla ajj karna hai, ki asin jokham vi likh sakde han?", en: "If we must decide today, can we also write down the risks?", vi: "Nếu hôm nay phải quyết định, chúng ta cũng ghi rủi ro được không?" },
    followUpTask_en: "Add one sentence supporting your concern with a concrete example.",
    followUpTask_vi: "Thêm một câu ủng hộ lo ngại của bạn bằng ví dụ cụ thể.",
    commonTraps: [
      {
        trap_en: "Starting with 'No' can sound abrupt in a team setting.",
        trap_vi: "Bắt đầu bằng 'Không' có thể nghe cụt trong nhóm.",
        better: { pa: "ਮੈਂ ਸਮਝਦਾ ਹਾਂ, ਪਰ ਮੇਰਾ ਸੁਝਾਅ ਵੱਖਰਾ ਹੈ।", romanization: "main samajhda han, par mera sujhao vakhra hai.", en: "I understand, but my suggestion is different.", vi: "Tôi hiểu, nhưng đề xuất của tôi khác." },
      },
    ],
  },
  {
    id: "pa-b1-work-08-incident-explanation",
    level: "B1",
    focus: "incident_explanation",
    title_en: "Explain a workplace incident",
    title_vi: "Giải thích một sự cố ở nơi làm việc",
    workplaceContext_en: "A delivery was delayed because a label was wrong.",
    workplaceContext_vi: "Một đơn giao bị trễ vì nhãn sai.",
    learnerGoal_en: "Retell what happened, give the cause, and explain the fix.",
    learnerGoal_vi: "Kể lại chuyện xảy ra, nêu nguyên nhân và giải thích cách xử lý.",
    canadaContext: "Useful for warehouse, delivery, office admin, and customer support jobs.",
    usefulPhrases: [
      { pa: "ਪਹਿਲਾਂ ਲੇਬਲ ਗਲਤ ਲੱਗ ਗਿਆ।", romanization: "pahilan label galat lagg gia.", en: "First, the wrong label was attached.", vi: "Trước tiên, nhãn sai đã được dán." },
      { pa: "ਇਸ ਕਰਕੇ ਡਿਲਿਵਰੀ ਲੇਟ ਹੋ ਗਈ।", romanization: "is karke delivery late ho gai.", en: "Because of this, the delivery became late.", vi: "Vì vậy đơn giao bị trễ." },
      { pa: "ਮੈਂ ਨਵਾਂ ਲੇਬਲ ਲਾ ਕੇ ਗਾਹਕ ਨੂੰ ਫ਼ੋਨ ਕੀਤਾ।", romanization: "main nava label la ke gahak nu phone kita.", en: "I put on a new label and called the customer.", vi: "Tôi dán nhãn mới và gọi cho khách." },
    ],
    modelExchange: [
      { speaker: "supervisor", pa: "ਡਿਲਿਵਰੀ ਕਿਉਂ ਲੇਟ ਹੋਈ?", romanization: "delivery kyon late hoi?", en: "Why was the delivery late?", vi: "Vì sao đơn giao bị trễ?" },
      { speaker: "learner", pa: "ਪਹਿਲਾਂ ਲੇਬਲ ਗਲਤ ਲੱਗ ਗਿਆ। ਇਸ ਕਰਕੇ ਡਿਲਿਵਰੀ ਲੇਟ ਹੋ ਗਈ।", romanization: "pahilan label galat lagg gia. is karke delivery late ho gai.", en: "First, the wrong label was attached. Because of this, the delivery became late.", vi: "Trước tiên nhãn sai được dán. Vì vậy đơn giao bị trễ." },
      { speaker: "learner", pa: "ਮੈਂ ਨਵਾਂ ਲੇਬਲ ਲਾ ਕੇ ਗਾਹਕ ਨੂੰ ਫ਼ੋਨ ਕੀਤਾ।", romanization: "main nava label la ke gahak nu phone kita.", en: "I put on a new label and called the customer.", vi: "Tôi dán nhãn mới và gọi cho khách." },
    ],
    escalationPhrase: { pa: "ਜੇ ਰਿਪੋਰਟ ਚਾਹੀਦੀ ਹੈ, ਮੈਂ ਘਟਨਾ ਲਿਖ ਕੇ ਭੇਜ ਦਿਆਂਗਾ।", romanization: "je report chahidi hai, main ghatna likh ke bhej dianga.", en: "If a report is needed, I will write and send the incident.", vi: "Nếu cần báo cáo, tôi sẽ viết và gửi sự cố." },
    followUpTask_en: "Add one sentence about how to prevent the same issue next time.",
    followUpTask_vi: "Thêm một câu về cách tránh vấn đề này lần sau.",
    commonTraps: [
      {
        trap_en: "Explaining blame before explaining sequence.",
        trap_vi: "Giải thích lỗi thuộc về ai trước khi kể trình tự.",
        better: { pa: "ਪਹਿਲਾਂ ਕੀ ਹੋਇਆ, ਫਿਰ ਕੀ ਕੀਤਾ, ਇਹ ਦੱਸੋ।", romanization: "pahilan ki hoia, phir ki kita, eh dasso.", en: "Say what happened first, then what was done.", vi: "Hãy nói trước tiên chuyện gì xảy ra, rồi đã làm gì." },
      },
    ],
  },
];
