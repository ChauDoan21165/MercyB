// src/languages/punjabi/problemSolvingB1.ts
//
// Punjabi B1 problem-solving task cards for Vietnamese-speaking and English-
// speaking learners. Gurmukhi is primary; romanization is a learner bridge.
// Shahmukhi is mentioned only for awareness, not taught as a full course.
//
// Native review is deferred; this module makes no native-review claim.

export type PunjabiB1ProblemDomain =
  | "service"
  | "workplace"
  | "housing"
  | "healthcare"
  | "school";

export type PunjabiB1ProblemStep =
  | "explain_issue"
  | "ask_options"
  | "propose_solution"
  | "clarify_next_steps";

export type PunjabiProblemPhrase = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiProblemTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiProblemPhrase;
};

export type PunjabiB1ProblemSolvingTask = {
  id: string;
  level: "B1";
  domain: PunjabiB1ProblemDomain;
  steps: PunjabiB1ProblemStep[];
  title_en: string;
  title_vi: string;
  situation_en: string;
  situation_vi: string;
  learnerGoal_en: string;
  learnerGoal_vi: string;
  canadaContext?: string;
  issuePhrase: PunjabiProblemPhrase;
  optionQuestion: PunjabiProblemPhrase;
  proposedSolution: PunjabiProblemPhrase;
  nextStepClarifier: PunjabiProblemPhrase;
  modelDialogue: PunjabiProblemPhrase[];
  commonTraps: PunjabiProblemTrap[];
};

export const punjabiB1ProblemSolvingTasks: PunjabiB1ProblemSolvingTask[] = [
  {
    id: "pa-b1-problem-01-service-card-not-working",
    level: "B1",
    domain: "service",
    steps: ["explain_issue", "ask_options", "propose_solution", "clarify_next_steps"],
    title_en: "Card does not work at a service desk",
    title_vi: "Thẻ không hoạt động ở quầy dịch vụ",
    situation_en: "Your library, transit, or community-centre card does not work.",
    situation_vi: "Thẻ thư viện, phương tiện công cộng hoặc trung tâm cộng đồng của bạn không hoạt động.",
    learnerGoal_en: "Explain what happened, ask your options, and confirm the next step.",
    learnerGoal_vi: "Giải thích chuyện xảy ra, hỏi lựa chọn và xác nhận bước tiếp theo.",
    canadaContext: "Useful at public libraries, recreation centres, transit desks, and settlement offices.",
    issuePhrase: { pa: "ਮੇਰਾ ਕਾਰਡ ਮਸ਼ੀਨ ਵਿੱਚ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "mera card machine vich kamm nahin kar riha.", en: "My card is not working in the machine.", vi: "Thẻ của tôi không hoạt động trong máy." },
    optionQuestion: { pa: "ਮੇਰੇ ਕੋਲ ਕਿਹੜੇ ਵਿਕਲਪ ਹਨ?", romanization: "mere kol kihre vikalp han?", en: "What options do I have?", vi: "Tôi có những lựa chọn nào?" },
    proposedSolution: { pa: "ਕੀ ਤੁਸੀਂ ਨਵਾਂ ਕਾਰਡ ਜਾਰੀ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusin nava card jari kar sakde ho?", en: "Can you issue a new card?", vi: "Bạn có thể cấp thẻ mới không?" },
    nextStepClarifier: { pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", romanization: "agla kadam ki hai?", en: "What is the next step?", vi: "Bước tiếp theo là gì?" },
    modelDialogue: [
      { pa: "ਮੇਰਾ ਕਾਰਡ ਮਸ਼ੀਨ ਵਿੱਚ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "mera card machine vich kamm nahin kar riha.", en: "My card is not working in the machine.", vi: "Thẻ của tôi không hoạt động trong máy." },
      { pa: "ਮੇਰੇ ਕੋਲ ਕਿਹੜੇ ਵਿਕਲਪ ਹਨ?", romanization: "mere kol kihre vikalp han?", en: "What options do I have?", vi: "Tôi có những lựa chọn nào?" },
      { pa: "ਜੇ ਲੋੜ ਹੈ, ਕੀ ਤੁਸੀਂ ਨਵਾਂ ਕਾਰਡ ਜਾਰੀ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "je lor hai, ki tusin nava card jari kar sakde ho?", en: "If needed, can you issue a new card?", vi: "Nếu cần, bạn có thể cấp thẻ mới không?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਲਿਖ ਦਿਓ।", romanization: "kirpa karke agla kadam likh dio.", en: "Please write down the next step.", vi: "Vui lòng ghi bước tiếp theo." },
    ],
    commonTraps: [
      {
        trap_en: "Saying only 'not working' without explaining where it failed.",
        trap_vi: "Chỉ nói 'không hoạt động' mà không giải thích lỗi xảy ra ở đâu.",
        better: { pa: "ਕਾਰਡ ਮਸ਼ੀਨ ਵਿੱਚ ਪਾਇਆ, ਪਰ ਗਲਤੀ ਆਈ।", romanization: "card machine vich paia, par galti aai.", en: "I put the card in the machine, but an error appeared.", vi: "Tôi đưa thẻ vào máy, nhưng hiện lỗi." },
      },
    ],
  },
  {
    id: "pa-b1-problem-02-work-deadline-risk",
    level: "B1",
    domain: "workplace",
    steps: ["explain_issue", "ask_options", "propose_solution", "clarify_next_steps"],
    title_en: "A deadline is at risk",
    title_vi: "Hạn chót có nguy cơ bị trễ",
    situation_en: "A work report cannot be finished today because one file is missing.",
    situation_vi: "Một báo cáo công việc không thể xong hôm nay vì thiếu một tệp.",
    learnerGoal_en: "Explain the blocker, ask options, propose a realistic new time, and confirm priority.",
    learnerGoal_vi: "Giải thích trở ngại, hỏi lựa chọn, đề xuất giờ mới thực tế và xác nhận ưu tiên.",
    canadaContext: "Useful for entry-level office, retail, warehouse, and community-service jobs.",
    issuePhrase: { pa: "ਇੱਕ ਫ਼ਾਈਲ ਅਜੇ ਨਹੀਂ ਮਿਲੀ, ਇਸ ਕਰਕੇ ਰਿਪੋਰਟ ਪੂਰੀ ਨਹੀਂ ਹੋ ਸਕਦੀ।", romanization: "ikk file aje nahin mili, is karke report puri nahin ho sakdi.", en: "One file has not arrived yet, so the report cannot be completed.", vi: "Một tệp chưa có, nên báo cáo chưa thể hoàn thành." },
    optionQuestion: { pa: "ਕੀ ਪਹਿਲਾਂ ਛੋਟਾ ਵਰਜਨ ਭੇਜਣਾ ਠੀਕ ਰਹੇਗਾ?", romanization: "ki pahilan chhota version bhejna theek rahega?", en: "Would it be okay to send a short version first?", vi: "Gửi bản ngắn trước có được không?" },
    proposedSolution: { pa: "ਮੈਂ ਅੱਜ ਸੰਖੇਪ ਭੇਜ ਸਕਦਾ ਹਾਂ ਅਤੇ ਪੂਰੀ ਰਿਪੋਰਟ ਕੱਲ੍ਹ ਸਵੇਰੇ।", romanization: "main ajj sankhep bhej sakda han ate puri report kallh savere.", en: "I can send the summary today and the full report tomorrow morning.", vi: "Tôi có thể gửi bản tóm tắt hôm nay và báo cáo đầy đủ sáng mai." },
    nextStepClarifier: { pa: "ਤੁਹਾਡੇ ਲਈ ਕਿਹੜਾ ਵਿਕਲਪ ਜ਼ਿਆਦਾ ਜ਼ਰੂਰੀ ਹੈ?", romanization: "tuhade lai kihra vikalp zyada zaroori hai?", en: "Which option is more important for you?", vi: "Với bạn/quản lý, lựa chọn nào quan trọng hơn?" },
    modelDialogue: [
      { pa: "ਇੱਕ ਫ਼ਾਈਲ ਅਜੇ ਨਹੀਂ ਮਿਲੀ, ਇਸ ਕਰਕੇ ਰਿਪੋਰਟ ਪੂਰੀ ਨਹੀਂ ਹੋ ਸਕਦੀ।", romanization: "ikk file aje nahin mili, is karke report puri nahin ho sakdi.", en: "One file has not arrived yet, so the report cannot be completed.", vi: "Một tệp chưa có, nên báo cáo chưa thể hoàn thành." },
      { pa: "ਕੀ ਪਹਿਲਾਂ ਛੋਟਾ ਵਰਜਨ ਭੇਜਣਾ ਠੀਕ ਰਹੇਗਾ?", romanization: "ki pahilan chhota version bhejna theek rahega?", en: "Would it be okay to send a short version first?", vi: "Gửi bản ngắn trước có được không?" },
      { pa: "ਮੈਂ ਅੱਜ ਸੰਖੇਪ ਭੇਜ ਸਕਦਾ ਹਾਂ ਅਤੇ ਪੂਰੀ ਰਿਪੋਰਟ ਕੱਲ੍ਹ ਸਵੇਰੇ।", romanization: "main ajj sankhep bhej sakda han ate puri report kallh savere.", en: "I can send the summary today and the full report tomorrow morning.", vi: "Tôi có thể gửi bản tóm tắt hôm nay và báo cáo đầy đủ sáng mai." },
    ],
    commonTraps: [
      {
        trap_en: "Only apologizing without proposing a next action.",
        trap_vi: "Chỉ xin lỗi mà không đề xuất hành động tiếp theo.",
        better: { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਕੱਲ੍ਹ ਸਵੇਰੇ ਅੱਠ ਵਜੇ ਤੱਕ ਭੇਜਾਂਗਾ।", romanization: "maaf karna, main kallh savere atth vaje takk bhejanga.", en: "Sorry, I will send it by eight tomorrow morning.", vi: "Xin lỗi, tôi sẽ gửi trước tám giờ sáng mai." },
      },
    ],
  },
  {
    id: "pa-b1-problem-03-housing-heat",
    level: "B1",
    domain: "housing",
    steps: ["explain_issue", "ask_options", "propose_solution", "clarify_next_steps"],
    title_en: "Heating problem in a rental",
    title_vi: "Vấn đề sưởi trong nhà thuê",
    situation_en: "The heat is not working and the room is cold.",
    situation_vi: "Hệ thống sưởi không hoạt động và phòng lạnh.",
    learnerGoal_en: "Explain the problem, ask repair options, propose timing, and request written confirmation.",
    learnerGoal_vi: "Giải thích vấn đề, hỏi lựa chọn sửa chữa, đề xuất thời gian và xin xác nhận bằng văn bản.",
    canadaContext: "Useful for tenant-landlord or building-manager conversations in winter.",
    issuePhrase: { pa: "ਕਮਰੇ ਵਿੱਚ ਹੀਟ ਨਹੀਂ ਆ ਰਹੀ ਅਤੇ ਬਹੁਤ ਠੰਢ ਹੈ।", romanization: "kamre vich heat nahin aa rahi ate bahut thandh hai.", en: "Heat is not coming into the room and it is very cold.", vi: "Phòng không có sưởi và rất lạnh." },
    optionQuestion: { pa: "ਕੀ ਅੱਜ ਮੁਰੰਮਤ ਹੋ ਸਕਦੀ ਹੈ ਜਾਂ ਅਸਥਾਈ ਹੀਟਰ ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "ki ajj murammat ho sakdi hai jaan asthai heater mil sakda hai?", en: "Can it be repaired today, or can I get a temporary heater?", vi: "Có thể sửa hôm nay không, hoặc tôi có thể nhận máy sưởi tạm không?" },
    proposedSolution: { pa: "ਜੇ ਮੁਰੰਮਤ ਕੱਲ੍ਹ ਹੋਵੇਗੀ, ਕਿਰਪਾ ਕਰਕੇ ਅੱਜ ਅਸਥਾਈ ਹੀਟਰ ਦਿਓ।", romanization: "je murammat kallh hovegi, kirpa karke ajj asthai heater dio.", en: "If the repair is tomorrow, please provide a temporary heater today.", vi: "Nếu ngày mai mới sửa, vui lòng cho tôi máy sưởi tạm hôm nay." },
    nextStepClarifier: { pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਦਾ ਸਮਾਂ ਲਿਖ ਕੇ ਭੇਜੋ।", romanization: "kirpa karke murammat da sama likh ke bhejo.", en: "Please send the repair time in writing.", vi: "Vui lòng gửi thời gian sửa bằng văn bản." },
    modelDialogue: [
      { pa: "ਕਮਰੇ ਵਿੱਚ ਹੀਟ ਨਹੀਂ ਆ ਰਹੀ ਅਤੇ ਬਹੁਤ ਠੰਢ ਹੈ।", romanization: "kamre vich heat nahin aa rahi ate bahut thandh hai.", en: "Heat is not coming into the room and it is very cold.", vi: "Phòng không có sưởi và rất lạnh." },
      { pa: "ਕੀ ਅੱਜ ਮੁਰੰਮਤ ਹੋ ਸਕਦੀ ਹੈ ਜਾਂ ਅਸਥਾਈ ਹੀਟਰ ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "ki ajj murammat ho sakdi hai jaan asthai heater mil sakda hai?", en: "Can it be repaired today, or can I get a temporary heater?", vi: "Có thể sửa hôm nay không, hoặc tôi có thể nhận máy sưởi tạm không?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਦਾ ਸਮਾਂ ਲਿਖ ਕੇ ਭੇਜੋ।", romanization: "kirpa karke murammat da sama likh ke bhejo.", en: "Please send the repair time in writing.", vi: "Vui lòng gửi thời gian sửa bằng văn bản." },
    ],
    commonTraps: [
      {
        trap_en: "Leaving out how urgent the housing problem is.",
        trap_vi: "Không nêu mức độ khẩn cấp của vấn đề nhà ở.",
        better: { pa: "ਬੱਚੇ ਘਰ ਵਿੱਚ ਹਨ, ਇਸ ਕਰਕੇ ਇਹ ਜ਼ਰੂਰੀ ਹੈ।", romanization: "bache ghar vich han, is karke eh zaroori hai.", en: "Children are at home, so this is urgent.", vi: "Có trẻ em ở nhà, nên việc này khẩn cấp." },
      },
    ],
  },
  {
    id: "pa-b1-problem-04-healthcare-appointment",
    level: "B1",
    domain: "healthcare",
    steps: ["explain_issue", "ask_options", "propose_solution", "clarify_next_steps"],
    title_en: "Clinic appointment problem",
    title_vi: "Vấn đề lịch hẹn phòng khám",
    situation_en: "You cannot attend the clinic appointment time offered.",
    situation_vi: "Bạn không thể đến giờ hẹn phòng khám được đề xuất.",
    learnerGoal_en: "Explain the schedule conflict, ask options, and confirm the new time. Language support only, not medical advice.",
    learnerGoal_vi: "Giải thích trùng lịch, hỏi lựa chọn và xác nhận giờ mới. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn y tế.",
    canadaContext: "Useful for walk-in clinic, family doctor, pharmacy clinic, or public-health appointments.",
    issuePhrase: { pa: "ਇਸ ਸਮੇਂ ਮੈਂ ਕੰਮ ਤੇ ਹਾਂ, ਇਸ ਕਰਕੇ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "is same main kamm te han, is karke nahin aa sakda.", en: "At this time I am at work, so I cannot come.", vi: "Giờ này tôi đang đi làm, nên không thể đến." },
    optionQuestion: { pa: "ਕੀ ਸ਼ਾਮ ਜਾਂ ਅਗਲੇ ਦਿਨ ਕੋਈ ਸਮਾਂ ਖਾਲੀ ਹੈ?", romanization: "ki shaam jaan agle din koi sama khaali hai?", en: "Is there any evening time or next-day time available?", vi: "Có giờ buổi tối hoặc ngày hôm sau còn trống không?" },
    proposedSolution: { pa: "ਜੇ ਸੰਭਵ ਹੈ, ਮੈਂ ਕੱਲ੍ਹ ਸਵੇਰੇ ਆ ਸਕਦਾ ਹਾਂ।", romanization: "je sambhav hai, main kallh savere aa sakda han.", en: "If possible, I can come tomorrow morning.", vi: "Nếu được, tôi có thể đến sáng mai." },
    nextStepClarifier: { pa: "ਕੀ ਤੁਸੀਂ ਨਵਾਂ ਸਮਾਂ ਟੈਕਸਟ ਰਾਹੀਂ ਭੇਜ ਸਕਦੇ ਹੋ?", romanization: "ki tusin nava sama text rahin bhej sakde ho?", en: "Can you send the new time by text?", vi: "Bạn có thể gửi giờ mới qua tin nhắn không?" },
    modelDialogue: [
      { pa: "ਇਸ ਸਮੇਂ ਮੈਂ ਕੰਮ ਤੇ ਹਾਂ, ਇਸ ਕਰਕੇ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "is same main kamm te han, is karke nahin aa sakda.", en: "At this time I am at work, so I cannot come.", vi: "Giờ này tôi đang đi làm, nên không thể đến." },
      { pa: "ਕੀ ਸ਼ਾਮ ਜਾਂ ਅਗਲੇ ਦਿਨ ਕੋਈ ਸਮਾਂ ਖਾਲੀ ਹੈ?", romanization: "ki shaam jaan agle din koi sama khaali hai?", en: "Is there any evening time or next-day time available?", vi: "Có giờ buổi tối hoặc ngày hôm sau còn trống không?" },
      { pa: "ਜੇ ਸੰਭਵ ਹੈ, ਮੈਂ ਕੱਲ੍ਹ ਸਵੇਰੇ ਆ ਸਕਦਾ ਹਾਂ।", romanization: "je sambhav hai, main kallh savere aa sakda han.", en: "If possible, I can come tomorrow morning.", vi: "Nếu được, tôi có thể đến sáng mai." },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਨਵਾਂ ਸਮਾਂ ਟੈਕਸਟ ਰਾਹੀਂ ਭੇਜੋ।", romanization: "kirpa karke nava sama text rahin bhejo.", en: "Please send the new time by text.", vi: "Vui lòng gửi giờ mới qua tin nhắn." },
    ],
    commonTraps: [
      {
        trap_en: "Sounding like you are refusing care instead of rescheduling.",
        trap_vi: "Nghe như bạn từ chối chăm sóc thay vì đổi lịch.",
        better: { pa: "ਮੈਂ ਆਉਣਾ ਚਾਹੁੰਦਾ ਹਾਂ, ਪਰ ਮੈਨੂੰ ਹੋਰ ਸਮਾਂ ਚਾਹੀਦਾ ਹੈ।", romanization: "main auna chahunda han, par mainu hor sama chahida hai.", en: "I want to come, but I need another time.", vi: "Tôi muốn đến, nhưng cần giờ khác." },
      },
    ],
  },
  {
    id: "pa-b1-problem-05-school-homework",
    level: "B1",
    domain: "school",
    steps: ["explain_issue", "ask_options", "propose_solution", "clarify_next_steps"],
    title_en: "Child is missing homework",
    title_vi: "Con thiếu bài tập",
    situation_en: "A teacher says your child has not submitted homework.",
    situation_vi: "Giáo viên nói con bạn chưa nộp bài tập.",
    learnerGoal_en: "Ask what is missing, propose a plan, and clarify how to submit it.",
    learnerGoal_vi: "Hỏi thiếu gì, đề xuất kế hoạch và làm rõ cách nộp.",
    canadaContext: "Useful for parent-teacher conversations and school office follow-up.",
    issuePhrase: { pa: "ਮੈਨੂੰ ਪਤਾ ਲੱਗਿਆ ਕਿ ਹੋਮਵਰਕ ਅਜੇ ਜਮ੍ਹਾ ਨਹੀਂ ਹੋਇਆ।", romanization: "mainu pata laggia ki homework aje jama nahin hoia.", en: "I found out that the homework has not been submitted yet.", vi: "Tôi biết rằng bài tập vẫn chưa được nộp." },
    optionQuestion: { pa: "ਕਿਹੜਾ ਕੰਮ ਬਾਕੀ ਹੈ ਅਤੇ ਕਦੋਂ ਤੱਕ ਦੇਣਾ ਹੈ?", romanization: "kihra kamm baaki hai ate kadon takk dena hai?", en: "Which work is still left and by when should it be submitted?", vi: "Còn bài nào và phải nộp trước khi nào?" },
    proposedSolution: { pa: "ਅਸੀਂ ਅੱਜ ਰਾਤ ਇਹ ਪੂਰਾ ਕਰਕੇ ਕੱਲ੍ਹ ਭੇਜਾਂਗੇ।", romanization: "asin ajj raat eh pura karke kallh bhejange.", en: "We will complete it tonight and send it tomorrow.", vi: "Chúng tôi sẽ hoàn thành tối nay và gửi ngày mai." },
    nextStepClarifier: { pa: "ਕੀ ਇਹ ਈਮੇਲ ਨਾਲ ਭੇਜਣਾ ਹੈ ਜਾਂ ਕਲਾਸ ਵਿੱਚ ਲਿਆਉਣਾ ਹੈ?", romanization: "ki eh email naal bhejna hai jaan class vich liauna hai?", en: "Should it be sent by email or brought to class?", vi: "Nên gửi qua email hay mang đến lớp?" },
    modelDialogue: [
      { pa: "ਮੈਨੂੰ ਪਤਾ ਲੱਗਿਆ ਕਿ ਹੋਮਵਰਕ ਅਜੇ ਜਮ੍ਹਾ ਨਹੀਂ ਹੋਇਆ।", romanization: "mainu pata laggia ki homework aje jama nahin hoia.", en: "I found out that the homework has not been submitted yet.", vi: "Tôi biết rằng bài tập vẫn chưa được nộp." },
      { pa: "ਕਿਹੜਾ ਕੰਮ ਬਾਕੀ ਹੈ ਅਤੇ ਕਦੋਂ ਤੱਕ ਦੇਣਾ ਹੈ?", romanization: "kihra kamm baaki hai ate kadon takk dena hai?", en: "Which work is still left and by when should it be submitted?", vi: "Còn bài nào và phải nộp trước khi nào?" },
      { pa: "ਅਸੀਂ ਅੱਜ ਰਾਤ ਇਹ ਪੂਰਾ ਕਰਕੇ ਕੱਲ੍ਹ ਭੇਜਾਂਗੇ।", romanization: "asin ajj raat eh pura karke kallh bhejange.", en: "We will complete it tonight and send it tomorrow.", vi: "Chúng tôi sẽ hoàn thành tối nay và gửi ngày mai." },
    ],
    commonTraps: [
      {
        trap_en: "Using direct blame instead of asking what is missing.",
        trap_vi: "Đổ lỗi trực tiếp thay vì hỏi thiếu gì.",
        better: { pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿਹੜਾ ਕੰਮ ਬਾਕੀ ਹੈ।", romanization: "kirpa karke dasso kihra kamm baaki hai.", en: "Please tell me which work is left.", vi: "Vui lòng cho tôi biết còn bài nào." },
      },
    ],
  },
  {
    id: "pa-b1-problem-06-service-bill-error",
    level: "B1",
    domain: "service",
    steps: ["explain_issue", "ask_options", "propose_solution", "clarify_next_steps"],
    title_en: "Incorrect bill or fee",
    title_vi: "Hóa đơn hoặc khoản phí sai",
    situation_en: "You see a fee that you do not understand.",
    situation_vi: "Bạn thấy một khoản phí mà bạn không hiểu.",
    learnerGoal_en: "Explain the charge, ask what it is for, propose a correction, and confirm the timeline.",
    learnerGoal_vi: "Giải thích khoản phí, hỏi lý do, đề xuất sửa và xác nhận thời gian xử lý.",
    canadaContext: "Useful for phone plans, bank accounts, utilities, and community fees.",
    issuePhrase: { pa: "ਮੇਰੇ ਬਿੱਲ ਵਿੱਚ ਇਹ ਫੀਸ ਸਮਝ ਨਹੀਂ ਆ ਰਹੀ।", romanization: "mere bill vich eh fees samajh nahin aa rahi.", en: "I do not understand this fee on my bill.", vi: "Tôi không hiểu khoản phí này trên hóa đơn." },
    optionQuestion: { pa: "ਇਹ ਫੀਸ ਕਿਸ ਲਈ ਹੈ?", romanization: "eh fees kis lai hai?", en: "What is this fee for?", vi: "Khoản phí này dùng cho gì?" },
    proposedSolution: { pa: "ਜੇ ਇਹ ਗਲਤੀ ਹੈ, ਕਿਰਪਾ ਕਰਕੇ ਬਿੱਲ ਠੀਕ ਕਰੋ।", romanization: "je eh galti hai, kirpa karke bill theek karo.", en: "If this is a mistake, please correct the bill.", vi: "Nếu đây là lỗi, vui lòng sửa hóa đơn." },
    nextStepClarifier: { pa: "ਠੀਕ ਕੀਤਾ ਬਿੱਲ ਕਦੋਂ ਮਿਲੇਗਾ?", romanization: "theek kita bill kadon milega?", en: "When will I receive the corrected bill?", vi: "Khi nào tôi sẽ nhận hóa đơn đã sửa?" },
    modelDialogue: [
      { pa: "ਮੇਰੇ ਬਿੱਲ ਵਿੱਚ ਇਹ ਫੀਸ ਸਮਝ ਨਹੀਂ ਆ ਰਹੀ।", romanization: "mere bill vich eh fees samajh nahin aa rahi.", en: "I do not understand this fee on my bill.", vi: "Tôi không hiểu khoản phí này trên hóa đơn." },
      { pa: "ਇਹ ਫੀਸ ਕਿਸ ਲਈ ਹੈ?", romanization: "eh fees kis lai hai?", en: "What is this fee for?", vi: "Khoản phí này dùng cho gì?" },
      { pa: "ਜੇ ਇਹ ਗਲਤੀ ਹੈ, ਕਿਰਪਾ ਕਰਕੇ ਬਿੱਲ ਠੀਕ ਕਰੋ।", romanization: "je eh galti hai, kirpa karke bill theek karo.", en: "If this is a mistake, please correct the bill.", vi: "Nếu đây là lỗi, vui lòng sửa hóa đơn." },
      { pa: "ਠੀਕ ਕੀਤਾ ਬਿੱਲ ਕਦੋਂ ਮਿਲੇਗਾ?", romanization: "theek kita bill kadon milega?", en: "When will I receive the corrected bill?", vi: "Khi nào tôi sẽ nhận hóa đơn đã sửa?" },
    ],
    commonTraps: [
      {
        trap_en: "Starting with anger instead of asking for an explanation.",
        trap_vi: "Bắt đầu bằng giận dữ thay vì hỏi giải thích.",
        better: { pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਫੀਸ ਸਮਝਾ ਦਿਓ।", romanization: "kirpa karke eh fees samjha dio.", en: "Please explain this fee.", vi: "Vui lòng giải thích khoản phí này." },
      },
    ],
  },
  {
    id: "pa-b1-problem-07-workplace-shift-conflict",
    level: "B1",
    domain: "workplace",
    steps: ["explain_issue", "ask_options", "propose_solution", "clarify_next_steps"],
    title_en: "Shift conflict",
    title_vi: "Trùng lịch ca làm",
    situation_en: "Your work shift conflicts with an important appointment.",
    situation_vi: "Ca làm của bạn trùng với một lịch hẹn quan trọng.",
    learnerGoal_en: "Explain the conflict, ask whether swapping is possible, and confirm the schedule.",
    learnerGoal_vi: "Giải thích trùng lịch, hỏi có thể đổi ca không và xác nhận lịch.",
    canadaContext: "Useful for hourly work and manager conversations.",
    issuePhrase: { pa: "ਮੇਰਾ ਸ਼ਿਫਟ ਇੱਕ ਜ਼ਰੂਰੀ ਅਪਾਇੰਟਮੈਂਟ ਨਾਲ ਟਕਰਾ ਰਿਹਾ ਹੈ।", romanization: "mera shift ikk zaroori appointment naal takra riha hai.", en: "My shift conflicts with an important appointment.", vi: "Ca làm của tôi trùng với một lịch hẹn quan trọng." },
    optionQuestion: { pa: "ਕੀ ਮੈਂ ਕਿਸੇ ਨਾਲ ਸ਼ਿਫਟ ਬਦਲ ਸਕਦਾ ਹਾਂ?", romanization: "ki main kise naal shift badal sakda han?", en: "Can I swap shifts with someone?", vi: "Tôi có thể đổi ca với ai đó không?" },
    proposedSolution: { pa: "ਮੈਂ ਸ਼ਾਮ ਵਾਲਾ ਸ਼ਿਫਟ ਕਰ ਸਕਦਾ ਹਾਂ।", romanization: "main shaam wala shift kar sakda han.", en: "I can work the evening shift.", vi: "Tôi có thể làm ca tối." },
    nextStepClarifier: { pa: "ਕੀ ਤੁਸੀਂ ਨਵਾਂ ਸ਼ਡਿਊਲ ਟੈਕਸਟ ਕਰ ਦਿਓਗੇ?", romanization: "ki tusin nava schedule text kar dioge?", en: "Can you text me the new schedule?", vi: "Bạn/quản lý có thể nhắn lịch mới cho tôi không?" },
    modelDialogue: [
      { pa: "ਮੇਰਾ ਸ਼ਿਫਟ ਇੱਕ ਜ਼ਰੂਰੀ ਅਪਾਇੰਟਮੈਂਟ ਨਾਲ ਟਕਰਾ ਰਿਹਾ ਹੈ।", romanization: "mera shift ikk zaroori appointment naal takra riha hai.", en: "My shift conflicts with an important appointment.", vi: "Ca làm của tôi trùng với một lịch hẹn quan trọng." },
      { pa: "ਕੀ ਮੈਂ ਕਿਸੇ ਨਾਲ ਸ਼ਿਫਟ ਬਦਲ ਸਕਦਾ ਹਾਂ?", romanization: "ki main kise naal shift badal sakda han?", en: "Can I swap shifts with someone?", vi: "Tôi có thể đổi ca với ai đó không?" },
      { pa: "ਮੈਂ ਸ਼ਾਮ ਵਾਲਾ ਸ਼ਿਫਟ ਕਰ ਸਕਦਾ ਹਾਂ।", romanization: "main shaam wala shift kar sakda han.", en: "I can work the evening shift.", vi: "Tôi có thể làm ca tối." },
    ],
    commonTraps: [
      {
        trap_en: "Using only 'I cannot come' without offering availability.",
        trap_vi: "Chỉ nói 'tôi không đến được' mà không đưa thời gian có thể làm.",
        better: { pa: "ਮੈਂ ਸਵੇਰੇ ਨਹੀਂ ਆ ਸਕਦਾ, ਪਰ ਸ਼ਾਮ ਨੂੰ ਆ ਸਕਦਾ ਹਾਂ।", romanization: "main savere nahin aa sakda, par shaam nu aa sakda han.", en: "I cannot come in the morning, but I can come in the evening.", vi: "Tôi không đến buổi sáng được, nhưng có thể đến buổi tối." },
      },
    ],
  },
  {
    id: "pa-b1-problem-08-housing-noise",
    level: "B1",
    domain: "housing",
    steps: ["explain_issue", "ask_options", "propose_solution", "clarify_next_steps"],
    title_en: "Noise problem with a neighbor",
    title_vi: "Vấn đề tiếng ồn với hàng xóm",
    situation_en: "A neighbor's music is loud after quiet hours.",
    situation_vi: "Nhạc của hàng xóm lớn sau giờ yên tĩnh.",
    learnerGoal_en: "Explain the issue politely, propose a practical limit, and clarify building rules.",
    learnerGoal_vi: "Giải thích vấn đề lịch sự, đề xuất giới hạn thực tế và làm rõ quy định tòa nhà.",
    canadaContext: "Useful for apartment and shared-housing conversations.",
    issuePhrase: { pa: "ਰਾਤ ਨੂੰ ਸੰਗੀਤ ਬਹੁਤ ਉੱਚਾ ਹੁੰਦਾ ਹੈ।", romanization: "raat nu sangeet bahut uchcha hunda hai.", en: "At night the music is very loud.", vi: "Ban đêm nhạc rất lớn." },
    optionQuestion: { pa: "ਕੀ ਦਸ ਵਜੇ ਤੋਂ ਬਾਅਦ ਆਵਾਜ਼ ਘੱਟ ਰੱਖ ਸਕਦੇ ਹੋ?", romanization: "ki dass vaje ton baad aawaz ghatt rakh sakde ho?", en: "Can you keep the volume lower after ten?", vi: "Bạn có thể để âm lượng nhỏ hơn sau mười giờ không?" },
    proposedSolution: { pa: "ਆਓ ਦਸ ਵਜੇ ਤੋਂ ਬਾਅਦ ਸ਼ਾਂਤ ਸਮਾਂ ਰੱਖੀਏ।", romanization: "aao dass vaje ton baad shant sama rakhiye.", en: "Let us keep quiet time after ten.", vi: "Chúng ta giữ giờ yên tĩnh sau mười giờ nhé." },
    nextStepClarifier: { pa: "ਜੇ ਫਿਰ ਸਮੱਸਿਆ ਹੋਵੇ, ਮੈਂ ਕਿਸ ਨਾਲ ਗੱਲ ਕਰਾਂ?", romanization: "je phir samasya hove, main kis naal gall karan?", en: "If there is a problem again, who should I speak with?", vi: "Nếu lại có vấn đề, tôi nên nói với ai?" },
    modelDialogue: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਰਾਤ ਨੂੰ ਸੰਗੀਤ ਬਹੁਤ ਉੱਚਾ ਹੁੰਦਾ ਹੈ।", romanization: "maaf karna, raat nu sangeet bahut uchcha hunda hai.", en: "Sorry, at night the music is very loud.", vi: "Xin lỗi, ban đêm nhạc rất lớn." },
      { pa: "ਕੀ ਦਸ ਵਜੇ ਤੋਂ ਬਾਅਦ ਆਵਾਜ਼ ਘੱਟ ਰੱਖ ਸਕਦੇ ਹੋ?", romanization: "ki dass vaje ton baad aawaz ghatt rakh sakde ho?", en: "Can you keep the volume lower after ten?", vi: "Bạn có thể để âm lượng nhỏ hơn sau mười giờ không?" },
      { pa: "ਆਓ ਦਸ ਵਜੇ ਤੋਂ ਬਾਅਦ ਸ਼ਾਂਤ ਸਮਾਂ ਰੱਖੀਏ।", romanization: "aao dass vaje ton baad shant sama rakhiye.", en: "Let us keep quiet time after ten.", vi: "Chúng ta giữ giờ yên tĩnh sau mười giờ nhé." },
    ],
    commonTraps: [
      {
        trap_en: "Sounding accusatory instead of specific.",
        trap_vi: "Nghe như buộc tội thay vì nêu cụ thể.",
        better: { pa: "ਕੱਲ੍ਹ ਰਾਤ ਗਿਆਰਾਂ ਵਜੇ ਆਵਾਜ਼ ਉੱਚੀ ਸੀ।", romanization: "kallh raat giaran vaje aawaz uchchi si.", en: "Last night at eleven, the volume was loud.", vi: "Tối qua lúc mười một giờ âm lượng lớn." },
      },
    ],
  },
  {
    id: "pa-b1-problem-09-healthcare-medicine",
    level: "B1",
    domain: "healthcare",
    steps: ["explain_issue", "ask_options", "propose_solution", "clarify_next_steps"],
    title_en: "Medicine instructions are unclear",
    title_vi: "Hướng dẫn dùng thuốc không rõ",
    situation_en: "You received medicine but do not understand how to take it.",
    situation_vi: "Bạn nhận thuốc nhưng không hiểu cách dùng.",
    learnerGoal_en: "Explain confusion, ask options, and confirm dosage. Language support only, not medical advice.",
    learnerGoal_vi: "Giải thích điều chưa rõ, hỏi lựa chọn và xác nhận liều dùng. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn y tế.",
    canadaContext: "Useful at pharmacies and clinic counters.",
    issuePhrase: { pa: "ਮੈਨੂੰ ਦਵਾਈ ਦੀ ਹਦਾਇਤ ਸਮਝ ਨਹੀਂ ਆਈ।", romanization: "mainu davai di hadait samajh nahin aai.", en: "I did not understand the medicine instruction.", vi: "Tôi chưa hiểu hướng dẫn dùng thuốc." },
    optionQuestion: { pa: "ਕੀ ਇਹ ਖਾਣੇ ਨਾਲ ਲੈਣੀ ਹੈ ਜਾਂ ਖਾਲੀ ਪੇਟ?", romanization: "ki eh khane naal laini hai jaan khaali pet?", en: "Should I take it with food or on an empty stomach?", vi: "Tôi nên uống cùng thức ăn hay lúc bụng đói?" },
    proposedSolution: { pa: "ਕਿਰਪਾ ਕਰਕੇ ਸਮਾਂ ਅਤੇ ਮਾਤਰਾ ਲੇਬਲ ਤੇ ਲਿਖ ਦਿਓ।", romanization: "kirpa karke sama ate matra label te likh dio.", en: "Please write the time and amount on the label.", vi: "Vui lòng ghi thời gian và liều lượng trên nhãn." },
    nextStepClarifier: { pa: "ਜੇ ਤਕਲੀਫ਼ ਵਧੇ ਤਾਂ ਮੈਨੂੰ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?", romanization: "je takleef vadhe tan mainu ki karna chahida hai?", en: "If the discomfort increases, what should I do?", vi: "Nếu khó chịu tăng lên, tôi nên làm gì?" },
    modelDialogue: [
      { pa: "ਮੈਨੂੰ ਦਵਾਈ ਦੀ ਹਦਾਇਤ ਸਮਝ ਨਹੀਂ ਆਈ।", romanization: "mainu davai di hadait samajh nahin aai.", en: "I did not understand the medicine instruction.", vi: "Tôi chưa hiểu hướng dẫn dùng thuốc." },
      { pa: "ਕੀ ਇਹ ਖਾਣੇ ਨਾਲ ਲੈਣੀ ਹੈ ਜਾਂ ਖਾਲੀ ਪੇਟ?", romanization: "ki eh khane naal laini hai jaan khaali pet?", en: "Should I take it with food or on an empty stomach?", vi: "Tôi nên uống cùng thức ăn hay lúc bụng đói?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਸਮਾਂ ਅਤੇ ਮਾਤਰਾ ਲੇਬਲ ਤੇ ਲਿਖ ਦਿਓ।", romanization: "kirpa karke sama ate matra label te likh dio.", en: "Please write the time and amount on the label.", vi: "Vui lòng ghi thời gian và liều lượng trên nhãn." },
    ],
    commonTraps: [
      {
        trap_en: "Guessing dosage instead of confirming it.",
        trap_vi: "Đoán liều dùng thay vì xác nhận.",
        better: { pa: "ਮਾਤਰਾ ਕਿੰਨੀ ਹੈ?", romanization: "matra kinni hai?", en: "What is the amount/dose?", vi: "Liều lượng là bao nhiêu?" },
      },
    ],
  },
  {
    id: "pa-b1-problem-10-school-absence",
    level: "B1",
    domain: "school",
    steps: ["explain_issue", "ask_options", "propose_solution", "clarify_next_steps"],
    title_en: "Explain a school absence",
    title_vi: "Giải thích vắng học",
    situation_en: "Your child missed class and needs to catch up.",
    situation_vi: "Con bạn vắng học và cần bắt kịp bài.",
    learnerGoal_en: "Explain the absence, ask what was missed, propose catch-up, and confirm submission.",
    learnerGoal_vi: "Giải thích vắng mặt, hỏi đã lỡ gì, đề xuất bắt kịp và xác nhận cách nộp.",
    canadaContext: "Useful for school attendance offices and teacher messages.",
    issuePhrase: { pa: "ਮੇਰਾ ਬੱਚਾ ਬੀਮਾਰ ਸੀ, ਇਸ ਕਰਕੇ ਕਲਾਸ ਵਿੱਚ ਨਹੀਂ ਆ ਸਕਿਆ।", romanization: "mera bacha bimar si, is karke class vich nahin aa sakia.", en: "My child was sick, so they could not come to class.", vi: "Con tôi bị bệnh, nên không thể đến lớp." },
    optionQuestion: { pa: "ਉਸ ਨੇ ਕਿਹੜਾ ਕੰਮ ਮਿਸ ਕੀਤਾ?", romanization: "us ne kihra kamm miss kita?", en: "What work did they miss?", vi: "Con đã lỡ bài nào?" },
    proposedSolution: { pa: "ਅਸੀਂ ਹਫ਼ਤੇ ਦੇ ਅੰਤ ਤੱਕ ਕੰਮ ਪੂਰਾ ਕਰਾਂਗੇ।", romanization: "asin hafte de ant takk kamm pura karange.", en: "We will complete the work by the weekend.", vi: "Chúng tôi sẽ hoàn thành bài trước cuối tuần." },
    nextStepClarifier: { pa: "ਕੀ ਕੰਮ ਆਨਲਾਈਨ ਜਮ੍ਹਾ ਕਰਨਾ ਹੈ?", romanization: "ki kamm online jama karna hai?", en: "Should the work be submitted online?", vi: "Bài có cần nộp trực tuyến không?" },
    modelDialogue: [
      { pa: "ਮੇਰਾ ਬੱਚਾ ਬੀਮਾਰ ਸੀ, ਇਸ ਕਰਕੇ ਕਲਾਸ ਵਿੱਚ ਨਹੀਂ ਆ ਸਕਿਆ।", romanization: "mera bacha bimar si, is karke class vich nahin aa sakia.", en: "My child was sick, so they could not come to class.", vi: "Con tôi bị bệnh, nên không thể đến lớp." },
      { pa: "ਉਸ ਨੇ ਕਿਹੜਾ ਕੰਮ ਮਿਸ ਕੀਤਾ?", romanization: "us ne kihra kamm miss kita?", en: "What work did they miss?", vi: "Con đã lỡ bài nào?" },
      { pa: "ਅਸੀਂ ਹਫ਼ਤੇ ਦੇ ਅੰਤ ਤੱਕ ਕੰਮ ਪੂਰਾ ਕਰਾਂਗੇ।", romanization: "asin hafte de ant takk kamm pura karange.", en: "We will complete the work by the weekend.", vi: "Chúng tôi sẽ hoàn thành bài trước cuối tuần." },
      { pa: "ਕੀ ਕੰਮ ਆਨਲਾਈਨ ਜਮ੍ਹਾ ਕਰਨਾ ਹੈ?", romanization: "ki kamm online jama karna hai?", en: "Should the work be submitted online?", vi: "Bài có cần nộp trực tuyến không?" },
    ],
    commonTraps: [
      {
        trap_en: "Forgetting to ask what was missed.",
        trap_vi: "Quên hỏi đã lỡ phần nào.",
        better: { pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਅੱਜ ਕਿਹੜਾ ਪਾਠ ਹੋਇਆ।", romanization: "kirpa karke dasso ajj kihra paath hoia.", en: "Please tell me which lesson happened today.", vi: "Vui lòng cho tôi biết hôm nay học bài nào." },
      },
    ],
  },
];
