// src/languages/punjabi/serviceConversationsB1.ts
//
// Punjabi B1 service conversation cards for Vietnamese-speaking and English-
// speaking learners. Gurmukhi is primary; romanization is a support bridge.
// Shahmukhi is mentioned only for awareness, not taught as a full course.
//
// Native review is deferred; this module makes no native-review claim.

export type PunjabiB1ServiceDomain =
  | "clinic"
  | "pharmacy"
  | "bank"
  | "school"
  | "housing_repair"
  | "workplace_supervisor"
  | "public_office"
  | "library_community_center"
  | "transport_customer_service";

export type PunjabiServiceLine = {
  speaker: "learner" | "staff";
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiServicePhrase = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiServiceTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiServicePhrase;
};

export type PunjabiB1ServiceConversation = {
  id: string;
  level: "B1";
  domain: PunjabiB1ServiceDomain;
  title_en: string;
  title_vi: string;
  situation_en: string;
  situation_vi: string;
  learnerGoal_en: string;
  learnerGoal_vi: string;
  canadaContext: string;
  keyPhrases: PunjabiServicePhrase[];
  conversation: PunjabiServiceLine[];
  followUpTask_en: string;
  followUpTask_vi: string;
  commonTraps: PunjabiServiceTrap[];
};

export const punjabiB1ServiceConversations: PunjabiB1ServiceConversation[] = [
  {
    id: "pa-b1-service-01-clinic-reschedule",
    level: "B1",
    domain: "clinic",
    title_en: "Reschedule a clinic appointment",
    title_vi: "Dời lịch hẹn phòng khám",
    situation_en: "You cannot attend a clinic appointment because of work.",
    situation_vi: "Bạn không thể đến lịch hẹn phòng khám vì công việc.",
    learnerGoal_en: "Explain the conflict, ask for another time, and confirm the new appointment. Language support only, not medical advice.",
    learnerGoal_vi: "Giải thích trùng lịch, xin giờ khác và xác nhận lịch mới. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn y tế.",
    canadaContext: "Useful for walk-in clinics, family doctors, and community health centres in Canada.",
    keyPhrases: [
      { pa: "ਮੈਂ ਇਹ ਸਮਾਂ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "main eh sama nahin aa sakda.", en: "I cannot come at this time.", vi: "Tôi không thể đến giờ này." },
      { pa: "ਕੀ ਹੋਰ ਸਮਾਂ ਖਾਲੀ ਹੈ?", romanization: "ki hor sama khaali hai?", en: "Is another time available?", vi: "Có giờ khác còn trống không?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਨਵਾਂ ਸਮਾਂ ਪੁਸ਼ਟੀ ਕਰੋ।", romanization: "kirpa karke nava sama pushti karo.", en: "Please confirm the new time.", vi: "Vui lòng xác nhận giờ mới." },
    ],
    conversation: [
      { speaker: "learner", pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਮੈਂ ਇਹ ਸਮਾਂ ਨਹੀਂ ਆ ਸਕਦਾ ਕਿਉਂਕਿ ਮੈਂ ਕੰਮ ਤੇ ਹਾਂ।", romanization: "sat sri akal ji, main eh sama nahin aa sakda kyonki main kamm te han.", en: "Hello, I cannot come at this time because I am at work.", vi: "Xin chào, tôi không thể đến giờ này vì tôi đang đi làm." },
      { speaker: "staff", pa: "ਕੋਈ ਗੱਲ ਨਹੀਂ। ਕੀ ਕੱਲ੍ਹ ਸਵੇਰੇ ਦਸ ਵਜੇ ਠੀਕ ਹੈ?", romanization: "koi gall nahin. ki kallh savere dass vaje theek hai?", en: "No problem. Is tomorrow morning at ten okay?", vi: "Không sao. Sáng mai lúc mười giờ được không?" },
      { speaker: "learner", pa: "ਹਾਂ ਜੀ, ਕਿਰਪਾ ਕਰਕੇ ਨਵਾਂ ਸਮਾਂ ਟੈਕਸਟ ਰਾਹੀਂ ਭੇਜ ਦਿਓ।", romanization: "haan ji, kirpa karke nava sama text rahin bhej dio.", en: "Yes, please send the new time by text.", vi: "Vâng, vui lòng gửi giờ mới qua tin nhắn." },
    ],
    followUpTask_en: "Ask whether you need to bring your health card or ID.",
    followUpTask_vi: "Hỏi bạn có cần mang thẻ y tế hoặc ID không.",
    commonTraps: [
      {
        trap_en: "Sounding like you are refusing care instead of rescheduling.",
        trap_vi: "Nghe như từ chối chăm sóc thay vì đổi lịch.",
        better: { pa: "ਮੈਂ ਆਉਣਾ ਚਾਹੁੰਦਾ ਹਾਂ, ਪਰ ਮੈਨੂੰ ਹੋਰ ਸਮਾਂ ਚਾਹੀਦਾ ਹੈ।", romanization: "main auna chahunda han, par mainu hor sama chahida hai.", en: "I want to come, but I need another time.", vi: "Tôi muốn đến, nhưng cần giờ khác." },
      },
    ],
  },
  {
    id: "pa-b1-service-02-pharmacy-directions",
    level: "B1",
    domain: "pharmacy",
    title_en: "Ask about medicine directions",
    title_vi: "Hỏi hướng dẫn dùng thuốc",
    situation_en: "You receive medicine but do not understand the label.",
    situation_vi: "Bạn nhận thuốc nhưng không hiểu nhãn.",
    learnerGoal_en: "Ask how and when to take medicine. Language support only, not medical advice.",
    learnerGoal_vi: "Hỏi cách và thời điểm dùng thuốc. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn y tế.",
    canadaContext: "Useful at pharmacies and clinic counters.",
    keyPhrases: [
      { pa: "ਇਹ ਦਵਾਈ ਕਿਵੇਂ ਲੈਣੀ ਹੈ?", romanization: "eh davai kiven laini hai?", en: "How should I take this medicine?", vi: "Tôi nên dùng thuốc này như thế nào?" },
      { pa: "ਖਾਣੇ ਨਾਲ ਜਾਂ ਖਾਲੀ ਪੇਟ?", romanization: "khane naal jaan khaali pet?", en: "With food or on an empty stomach?", vi: "Cùng thức ăn hay lúc bụng đói?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਲੇਬਲ ਤੇ ਲਿਖ ਦਿਓ।", romanization: "kirpa karke label te likh dio.", en: "Please write it on the label.", vi: "Vui lòng ghi trên nhãn." },
    ],
    conversation: [
      { speaker: "learner", pa: "ਮੈਨੂੰ ਇਹ ਹਦਾਇਤ ਸਮਝ ਨਹੀਂ ਆਈ। ਇਹ ਦਵਾਈ ਕਿਵੇਂ ਲੈਣੀ ਹੈ?", romanization: "mainu eh hadait samajh nahin aai. eh davai kiven laini hai?", en: "I did not understand this instruction. How should I take this medicine?", vi: "Tôi chưa hiểu hướng dẫn này. Tôi nên dùng thuốc này thế nào?" },
      { speaker: "staff", pa: "ਦਿਨ ਵਿੱਚ ਦੋ ਵਾਰ, ਖਾਣੇ ਤੋਂ ਬਾਅਦ।", romanization: "din vich do vaar, khane ton baad.", en: "Twice a day, after food.", vi: "Hai lần mỗi ngày, sau khi ăn." },
      { speaker: "learner", pa: "ਧੰਨਵਾਦ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲੇਬਲ ਤੇ ਲਿਖ ਦਿਓ।", romanization: "dhanvaad. kirpa karke eh label te likh dio.", en: "Thank you. Please write that on the label.", vi: "Cảm ơn. Vui lòng ghi điều đó trên nhãn." },
    ],
    followUpTask_en: "Ask what to do if the symptoms get worse.",
    followUpTask_vi: "Hỏi nên làm gì nếu triệu chứng nặng hơn.",
    commonTraps: [
      {
        trap_en: "Guessing dosage instead of confirming it.",
        trap_vi: "Đoán liều dùng thay vì xác nhận.",
        better: { pa: "ਮਾਤਰਾ ਕਿੰਨੀ ਹੈ?", romanization: "matra kinni hai?", en: "What is the dose?", vi: "Liều lượng là bao nhiêu?" },
      },
    ],
  },
  {
    id: "pa-b1-service-03-bank-fee",
    level: "B1",
    domain: "bank",
    title_en: "Ask about a bank fee",
    title_vi: "Hỏi về khoản phí ngân hàng",
    situation_en: "You see an unexpected fee on your account.",
    situation_vi: "Bạn thấy một khoản phí bất ngờ trong tài khoản.",
    learnerGoal_en: "Ask what the fee is for and request written terms.",
    learnerGoal_vi: "Hỏi phí dùng cho gì và yêu cầu điều khoản bằng văn bản.",
    canadaContext: "Useful for chequing accounts, debit cards, and monthly account fees.",
    keyPhrases: [
      { pa: "ਇਹ ਫੀਸ ਕਿਸ ਲਈ ਹੈ?", romanization: "eh fees kis lai hai?", en: "What is this fee for?", vi: "Khoản phí này dùng cho gì?" },
      { pa: "ਕੀ ਇਹ ਮਹੀਨਾਵਾਰ ਫੀਸ ਹੈ?", romanization: "ki eh mahinavaar fees hai?", en: "Is this a monthly fee?", vi: "Đây là phí hàng tháng phải không?" },
      { pa: "ਲਿਖਤੀ ਸ਼ਰਤਾਂ ਦਿਖਾਓ ਜੀ।", romanization: "likhti shartan dikhao ji.", en: "Please show me the written terms.", vi: "Vui lòng cho tôi xem điều khoản bằng văn bản." },
    ],
    conversation: [
      { speaker: "learner", pa: "ਮੇਰੇ ਖਾਤੇ ਵਿੱਚ ਇਹ ਫੀਸ ਲੱਗੀ ਹੈ। ਇਹ ਕਿਸ ਲਈ ਹੈ?", romanization: "mere khate vich eh fees laggi hai. eh kis lai hai?", en: "This fee was charged to my account. What is it for?", vi: "Tài khoản của tôi bị tính khoản phí này. Khoản này dùng cho gì?" },
      { speaker: "staff", pa: "ਇਹ ਮਹੀਨਾਵਾਰ ਖਾਤਾ ਫੀਸ ਹੈ।", romanization: "eh mahinavaar khata fees hai.", en: "This is a monthly account fee.", vi: "Đây là phí tài khoản hàng tháng." },
      { speaker: "learner", pa: "ਕੀ ਕੋਈ ਘੱਟ ਫੀਸ ਵਾਲਾ ਵਿਕਲਪ ਹੈ? ਲਿਖਤੀ ਸ਼ਰਤਾਂ ਦਿਖਾਓ ਜੀ।", romanization: "ki koi ghatt fees wala vikalp hai? likhti shartan dikhao ji.", en: "Is there an option with a lower fee? Please show me the written terms.", vi: "Có lựa chọn phí thấp hơn không? Vui lòng cho tôi xem điều khoản bằng văn bản." },
    ],
    followUpTask_en: "Ask whether student, newcomer, or low-fee account options exist.",
    followUpTask_vi: "Hỏi có lựa chọn tài khoản sinh viên, người mới đến hoặc phí thấp không.",
    commonTraps: [
      {
        trap_en: "Agreeing before seeing terms in writing.",
        trap_vi: "Đồng ý trước khi xem điều khoản bằng văn bản.",
        better: { pa: "ਮੈਂ ਸਾਈਨ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਸ਼ਰਤਾਂ ਪੜ੍ਹਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।", romanization: "main sign karan ton pahilan shartan parhna chahunda han.", en: "I want to read the terms before signing.", vi: "Tôi muốn đọc điều khoản trước khi ký." },
      },
    ],
  },
  {
    id: "pa-b1-service-04-school-homework",
    level: "B1",
    domain: "school",
    title_en: "Talk with a teacher about homework",
    title_vi: "Trao đổi với giáo viên về bài tập",
    situation_en: "The teacher says your child missed homework.",
    situation_vi: "Giáo viên nói con bạn thiếu bài tập.",
    learnerGoal_en: "Ask what is missing, how to submit it, and how to help at home.",
    learnerGoal_vi: "Hỏi thiếu gì, nộp bằng cách nào và hỗ trợ ở nhà ra sao.",
    canadaContext: "Useful for parent-teacher meetings and school-office follow-up.",
    keyPhrases: [
      { pa: "ਕਿਹੜਾ ਕੰਮ ਬਾਕੀ ਹੈ?", romanization: "kihra kamm baaki hai?", en: "Which work is left?", vi: "Còn bài nào?" },
      { pa: "ਘਰ ਵਿੱਚ ਕੀ ਅਭਿਆਸ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?", romanization: "ghar vich ki abhyas karna chahida hai?", en: "What should be practiced at home?", vi: "Ở nhà nên luyện gì?" },
      { pa: "ਕੀ ਇਹ ਆਨਲਾਈਨ ਜਮ੍ਹਾ ਕਰਨਾ ਹੈ?", romanization: "ki eh online jama karna hai?", en: "Should this be submitted online?", vi: "Bài này cần nộp trực tuyến không?" },
    ],
    conversation: [
      { speaker: "learner", pa: "ਮੈਨੂੰ ਪਤਾ ਲੱਗਿਆ ਕਿ ਹੋਮਵਰਕ ਬਾਕੀ ਹੈ। ਕਿਹੜਾ ਕੰਮ ਬਾਕੀ ਹੈ?", romanization: "mainu pata laggia ki homework baaki hai. kihra kamm baaki hai?", en: "I found out homework is missing. Which work is left?", vi: "Tôi biết còn thiếu bài tập. Còn bài nào?" },
      { speaker: "staff", pa: "ਮੈਥ ਦਾ ਇੱਕ ਪੇਜ ਅਤੇ ਪੜ੍ਹਾਈ ਦੀ ਰਿਪੋਰਟ।", romanization: "math da ikk page ate parhai di report.", en: "One math page and the reading report.", vi: "Một trang toán và báo cáo đọc." },
      { speaker: "learner", pa: "ਅਸੀਂ ਅੱਜ ਰਾਤ ਪੂਰਾ ਕਰਾਂਗੇ। ਕੀ ਇਹ ਆਨਲਾਈਨ ਜਮ੍ਹਾ ਕਰਨਾ ਹੈ?", romanization: "asin ajj raat pura karange. ki eh online jama karna hai?", en: "We will finish it tonight. Should this be submitted online?", vi: "Chúng tôi sẽ làm xong tối nay. Có cần nộp trực tuyến không?" },
    ],
    followUpTask_en: "Ask the teacher for one example of good homework.",
    followUpTask_vi: "Xin giáo viên một ví dụ về bài tập tốt.",
    commonTraps: [
      {
        trap_en: "Using ਤੂੰ with teachers can sound too familiar.",
        trap_vi: "Dùng ਤੂੰ với giáo viên có thể quá thân mật.",
        better: { pa: "ਕੀ ਤੁਸੀਂ ਉਦਾਹਰਨ ਦੇ ਸਕਦੇ ਹੋ?", romanization: "ki tusin udaharan de sakde ho?", en: "Can you give an example?", vi: "Bạn/thầy cô có thể cho ví dụ không?" },
      },
    ],
  },
  {
    id: "pa-b1-service-05-housing-repair",
    level: "B1",
    domain: "housing_repair",
    title_en: "Request a housing repair",
    title_vi: "Yêu cầu sửa chữa nhà ở",
    situation_en: "Water is leaking under the sink.",
    situation_vi: "Nước rò dưới bồn rửa.",
    learnerGoal_en: "Explain the problem, ask repair timing, and request written confirmation.",
    learnerGoal_vi: "Giải thích vấn đề, hỏi thời gian sửa và xin xác nhận bằng văn bản.",
    canadaContext: "Useful for tenant-landlord, building-manager, and maintenance conversations.",
    keyPhrases: [
      { pa: "ਸਿੰਕ ਹੇਠਾਂ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "sink hethan paani leak ho riha hai.", en: "Water is leaking under the sink.", vi: "Nước đang rò dưới bồn rửa." },
      { pa: "ਮੁਰੰਮਤ ਕਦੋਂ ਹੋਵੇਗੀ?", romanization: "murammat kadon hovegi?", en: "When will the repair happen?", vi: "Khi nào sẽ sửa?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਸਮਾਂ ਲਿਖ ਕੇ ਭੇਜੋ।", romanization: "kirpa karke sama likh ke bhejo.", en: "Please send the time in writing.", vi: "Vui lòng gửi thời gian bằng văn bản." },
    ],
    conversation: [
      { speaker: "learner", pa: "ਸਿੰਕ ਹੇਠਾਂ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ ਅਤੇ ਫਰਸ਼ ਗਿੱਲਾ ਹੈ।", romanization: "sink hethan paani leak ho riha hai ate farsh gilla hai.", en: "Water is leaking under the sink and the floor is wet.", vi: "Nước đang rò dưới bồn rửa và sàn bị ướt." },
      { speaker: "staff", pa: "ਅਸੀਂ ਕੱਲ੍ਹ ਪਲੰਬਰ ਭੇਜ ਸਕਦੇ ਹਾਂ।", romanization: "asin kallh plumber bhej sakde han.", en: "We can send a plumber tomorrow.", vi: "Chúng tôi có thể gửi thợ ống nước ngày mai." },
      { speaker: "learner", pa: "ਠੀਕ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਸਮਾਂ ਲਿਖ ਕੇ ਭੇਜੋ।", romanization: "theek hai. kirpa karke sama likh ke bhejo.", en: "Okay. Please send the time in writing.", vi: "Được. Vui lòng gửi thời gian bằng văn bản." },
    ],
    followUpTask_en: "Ask what to do if the leak becomes worse tonight.",
    followUpTask_vi: "Hỏi nên làm gì nếu tối nay nước rò nặng hơn.",
    commonTraps: [
      {
        trap_en: "Not saying where the leak is.",
        trap_vi: "Không nói nước rò ở đâu.",
        better: { pa: "ਲੀਕ ਸਿੰਕ ਹੇਠਾਂ ਹੈ।", romanization: "leak sink hethan hai.", en: "The leak is under the sink.", vi: "Chỗ rò ở dưới bồn rửa." },
      },
    ],
  },
  {
    id: "pa-b1-service-06-workplace-supervisor",
    level: "B1",
    domain: "workplace_supervisor",
    title_en: "Ask a supervisor about a task",
    title_vi: "Hỏi quản lý về nhiệm vụ",
    situation_en: "You are not sure which task has priority.",
    situation_vi: "Bạn không chắc nhiệm vụ nào ưu tiên.",
    learnerGoal_en: "Clarify priority, deadline, and expected result.",
    learnerGoal_vi: "Làm rõ ưu tiên, hạn chót và kết quả mong đợi.",
    canadaContext: "Useful for entry-level work, retail, warehouse, office, and community jobs.",
    keyPhrases: [
      { pa: "ਕਿਹੜਾ ਕੰਮ ਪਹਿਲਾਂ ਕਰਨਾ ਹੈ?", romanization: "kihra kamm pahilan karna hai?", en: "Which task should be done first?", vi: "Nhiệm vụ nào nên làm trước?" },
      { pa: "ਇਸ ਦੀ ਡੈਡਲਾਈਨ ਕੀ ਹੈ?", romanization: "is di deadline ki hai?", en: "What is its deadline?", vi: "Hạn chót của việc này là gì?" },
      { pa: "ਕੀ ਤੁਸੀਂ ਉਦਾਹਰਨ ਦਿਖਾ ਸਕਦੇ ਹੋ?", romanization: "ki tusin udaharan dikha sakde ho?", en: "Can you show an example?", vi: "Bạn/quản lý có thể cho xem ví dụ không?" },
    ],
    conversation: [
      { speaker: "learner", pa: "ਮੇਰੇ ਕੋਲ ਦੋ ਕੰਮ ਹਨ। ਕਿਹੜਾ ਕੰਮ ਪਹਿਲਾਂ ਕਰਨਾ ਹੈ?", romanization: "mere kol do kamm han. kihra kamm pahilan karna hai?", en: "I have two tasks. Which task should be done first?", vi: "Tôi có hai nhiệm vụ. Nhiệm vụ nào nên làm trước?" },
      { speaker: "staff", pa: "ਪਹਿਲਾਂ ਗਾਹਕ ਵਾਲੀ ਫ਼ਾਈਲ ਪੂਰੀ ਕਰੋ।", romanization: "pahilan gahak wali file puri karo.", en: "Finish the customer file first.", vi: "Hoàn thành hồ sơ khách hàng trước." },
      { speaker: "learner", pa: "ਠੀਕ ਹੈ। ਇਸ ਦੀ ਡੈਡਲਾਈਨ ਕੀ ਹੈ?", romanization: "theek hai. is di deadline ki hai?", en: "Okay. What is its deadline?", vi: "Được. Hạn chót của việc này là gì?" },
    ],
    followUpTask_en: "Ask what quality standard or example you should follow.",
    followUpTask_vi: "Hỏi nên theo tiêu chuẩn chất lượng hoặc ví dụ nào.",
    commonTraps: [
      {
        trap_en: "Nodding without clarifying priority.",
        trap_vi: "Gật đầu mà không làm rõ ưu tiên.",
        better: { pa: "ਪਹਿਲਾਂ ਕਿਹੜਾ ਕੰਮ ਜ਼ਰੂਰੀ ਹੈ?", romanization: "pahilan kihra kamm zaroori hai?", en: "Which work is urgent first?", vi: "Việc nào cần gấp trước?" },
      },
    ],
  },
  {
    id: "pa-b1-service-07-public-office",
    level: "B1",
    domain: "public_office",
    title_en: "Ask about a missing document",
    title_vi: "Hỏi về giấy tờ còn thiếu",
    situation_en: "A public-office clerk says your application is incomplete.",
    situation_vi: "Nhân viên cơ quan công nói hồ sơ của bạn chưa đủ.",
    learnerGoal_en: "Ask which document is missing, deadline, and next step. Language support only, not legal advice.",
    learnerGoal_vi: "Hỏi thiếu giấy tờ nào, hạn chót và bước tiếp theo. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn pháp lý.",
    canadaContext: "Useful at municipal offices, settlement services, and Service Canada-style counters.",
    keyPhrases: [
      { pa: "ਕਿਹੜਾ ਦਸਤਾਵੇਜ਼ ਘੱਟ ਹੈ?", romanization: "kihra dastavez ghatt hai?", en: "Which document is missing?", vi: "Thiếu giấy tờ nào?" },
      { pa: "ਆਖ਼ਰੀ ਤਾਰੀਖ ਕੀ ਹੈ?", romanization: "akhri tarikh ki hai?", en: "What is the deadline?", vi: "Hạn chót là ngày nào?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।", romanization: "kirpa karke eh likh dio.", en: "Please write this down.", vi: "Vui lòng ghi điều này ra." },
    ],
    conversation: [
      { speaker: "learner", pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਹੜਾ ਦਸਤਾਵੇਜ਼ ਘੱਟ ਹੈ?", romanization: "mainu samajh nahin aaya. kihra dastavez ghatt hai?", en: "I did not understand. Which document is missing?", vi: "Tôi chưa hiểu. Thiếu giấy tờ nào?" },
      { speaker: "staff", pa: "ਪਤੇ ਦਾ ਸਬੂਤ ਚਾਹੀਦਾ ਹੈ।", romanization: "pate da saboot chahida hai.", en: "Proof of address is needed.", vi: "Cần chứng minh địa chỉ." },
      { speaker: "learner", pa: "ਆਖ਼ਰੀ ਤਾਰੀਖ ਕੀ ਹੈ? ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।", romanization: "akhri tarikh ki hai? kirpa karke eh likh dio.", en: "What is the deadline? Please write this down.", vi: "Hạn chót là ngày nào? Vui lòng ghi điều này ra." },
    ],
    followUpTask_en: "Ask whether a utility bill copy is acceptable.",
    followUpTask_vi: "Hỏi bản sao hóa đơn tiện ích có được chấp nhận không.",
    commonTraps: [
      {
        trap_en: "Confusing ਦਸਤਾਵੇਜ਼ with ਅਰਜ਼ੀ; document and application are not the same.",
        trap_vi: "Nhầm ਦਸਤਾਵੇਜ਼ với ਅਰਜ਼ੀ; giấy tờ và hồ sơ/đơn không giống nhau.",
        better: { pa: "ਮੇਰੀ ਅਰਜ਼ੀ ਵਿੱਚ ਕਿਹੜਾ ਦਸਤਾਵੇਜ਼ ਘੱਟ ਹੈ?", romanization: "meri arzi vich kihra dastavez ghatt hai?", en: "Which document is missing from my application?", vi: "Hồ sơ của tôi thiếu giấy tờ nào?" },
      },
    ],
  },
  {
    id: "pa-b1-service-08-library-community-center",
    level: "B1",
    domain: "library_community_center",
    title_en: "Register for a community class",
    title_vi: "Đăng ký lớp ở trung tâm cộng đồng",
    situation_en: "You want to register for an English, computer, or community class.",
    situation_vi: "Bạn muốn đăng ký lớp tiếng Anh, máy tính hoặc cộng đồng.",
    learnerGoal_en: "Ask about schedule, fee, registration, and ID requirements.",
    learnerGoal_vi: "Hỏi lịch, phí, cách đăng ký và yêu cầu ID.",
    canadaContext: "Useful at public libraries, newcomer centres, and recreation/community centres.",
    keyPhrases: [
      { pa: "ਇਹ ਕਲਾਸ ਕਦੋਂ ਹੁੰਦੀ ਹੈ?", romanization: "eh class kadon hundi hai?", en: "When does this class happen?", vi: "Lớp này diễn ra khi nào?" },
      { pa: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਕਿਵੇਂ ਕਰਨੀ ਹੈ?", romanization: "registration kiven karni hai?", en: "How do I register?", vi: "Tôi đăng ký bằng cách nào?" },
      { pa: "ਕੀ ਫੀਸ ਜਾਂ ਆਈਡੀ ਚਾਹੀਦੀ ਹੈ?", romanization: "ki fees jaan ID chahidi hai?", en: "Is a fee or ID needed?", vi: "Có cần phí hoặc ID không?" },
    ],
    conversation: [
      { speaker: "learner", pa: "ਮੈਂ ਕੰਪਿਊਟਰ ਕਲਾਸ ਲਈ ਰਜਿਸਟਰ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ। ਇਹ ਕਲਾਸ ਕਦੋਂ ਹੁੰਦੀ ਹੈ?", romanization: "main computer class lai register karna chahunda han. eh class kadon hundi hai?", en: "I want to register for the computer class. When does this class happen?", vi: "Tôi muốn đăng ký lớp máy tính. Lớp này diễn ra khi nào?" },
      { speaker: "staff", pa: "ਹਰ ਮੰਗਲਵਾਰ ਸ਼ਾਮ ਛੇ ਵਜੇ।", romanization: "har mangalvaar shaam chhe vaje.", en: "Every Tuesday at six in the evening.", vi: "Mỗi thứ Ba lúc sáu giờ tối." },
      { speaker: "learner", pa: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਕਿਵੇਂ ਕਰਨੀ ਹੈ? ਕੀ ਫੀਸ ਜਾਂ ਆਈਡੀ ਚਾਹੀਦੀ ਹੈ?", romanization: "registration kiven karni hai? ki fees jaan ID chahidi hai?", en: "How do I register? Is a fee or ID needed?", vi: "Tôi đăng ký bằng cách nào? Có cần phí hoặc ID không?" },
    ],
    followUpTask_en: "Ask whether childcare, online attendance, or a waiting list is available.",
    followUpTask_vi: "Hỏi có giữ trẻ, học trực tuyến hoặc danh sách chờ không.",
    commonTraps: [
      {
        trap_en: "Asking only the time and forgetting registration requirements.",
        trap_vi: "Chỉ hỏi giờ mà quên yêu cầu đăng ký.",
        better: { pa: "ਰਜਿਸਟਰ ਕਰਨ ਲਈ ਕੀ ਚਾਹੀਦਾ ਹੈ?", romanization: "register karan lai ki chahida hai?", en: "What is needed to register?", vi: "Cần gì để đăng ký?" },
      },
    ],
  },
  {
    id: "pa-b1-service-09-transport-customer-service",
    level: "B1",
    domain: "transport_customer_service",
    title_en: "Ask about a delayed bus or train",
    title_vi: "Hỏi về xe buýt hoặc tàu bị trễ",
    situation_en: "Your bus or train is delayed and you need another route.",
    situation_vi: "Xe buýt hoặc tàu của bạn bị trễ và bạn cần tuyến khác.",
    learnerGoal_en: "Explain the delay, ask for options, and confirm platform/stop and time.",
    learnerGoal_vi: "Giải thích việc trễ, hỏi lựa chọn và xác nhận sân ga/trạm cùng giờ.",
    canadaContext: "Useful for city transit, regional buses, train stations, and customer-service counters.",
    keyPhrases: [
      { pa: "ਮੇਰੀ ਬੱਸ ਲੇਟ ਹੈ।", romanization: "meri bass late hai.", en: "My bus is late.", vi: "Xe buýt của tôi bị trễ." },
      { pa: "ਹੋਰ ਰਸਤਾ ਕਿਹੜਾ ਹੈ?", romanization: "hor rasta kihra hai?", en: "What is another route?", vi: "Tuyến khác là tuyến nào?" },
      { pa: "ਕਿਹੜੇ ਸਟਾਪ ਤੇ ਉਡੀਕ ਕਰਨੀ ਹੈ?", romanization: "kihre stop te udeek karni hai?", en: "At which stop should I wait?", vi: "Tôi nên chờ ở trạm nào?" },
    ],
    conversation: [
      { speaker: "learner", pa: "ਮੇਰੀ ਬੱਸ ਲੇਟ ਹੈ ਅਤੇ ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਹੈ। ਹੋਰ ਰਸਤਾ ਕਿਹੜਾ ਹੈ?", romanization: "meri bass late hai ate meri appointment hai. hor rasta kihra hai?", en: "My bus is late and I have an appointment. What is another route?", vi: "Xe buýt của tôi bị trễ và tôi có lịch hẹn. Tuyến khác là tuyến nào?" },
      { speaker: "staff", pa: "ਤੁਸੀਂ ਰੂਟ ਪੰਜ ਲੈ ਸਕਦੇ ਹੋ। ਉਹ ਦਸ ਮਿੰਟ ਵਿੱਚ ਆਵੇਗੀ।", romanization: "tusin route panj lai sakde ho. oh dass mint vich aavegi.", en: "You can take route five. It will come in ten minutes.", vi: "Bạn có thể đi tuyến số năm. Xe sẽ đến trong mười phút." },
      { speaker: "learner", pa: "ਧੰਨਵਾਦ। ਕਿਹੜੇ ਸਟਾਪ ਤੇ ਉਡੀਕ ਕਰਨੀ ਹੈ?", romanization: "dhanvaad. kihre stop te udeek karni hai?", en: "Thank you. At which stop should I wait?", vi: "Cảm ơn. Tôi nên chờ ở trạm nào?" },
    ],
    followUpTask_en: "Ask whether your current ticket works for the replacement route.",
    followUpTask_vi: "Hỏi vé hiện tại có dùng được cho tuyến thay thế không.",
    commonTraps: [
      {
        trap_en: "Confusing ਰਸਤਾ (route/way) with ਪਤਾ (address).",
        trap_vi: "Nhầm ਰਸਤਾ (tuyến/đường đi) với ਪਤਾ (địa chỉ).",
        better: { pa: "ਮੈਨੂੰ ਹੋਰ ਰਸਤਾ ਚਾਹੀਦਾ ਹੈ।", romanization: "mainu hor rasta chahida hai.", en: "I need another route.", vi: "Tôi cần tuyến khác." },
      },
    ],
  },
];
