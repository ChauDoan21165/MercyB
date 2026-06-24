// src/languages/punjabi/communicationTasksB1.ts
//
// Punjabi B1 communication task cards for Vietnamese-speaking and English-
// speaking learners. Gurmukhi is primary; romanization is a support bridge.
// Shahmukhi is mentioned only as awareness, not taught as a full course.
//
// Native review is deferred; this module makes no native-review claim.

export type PunjabiB1CommunicationFocus =
  | "explain_situation"
  | "clarification"
  | "polite_complaint"
  | "work_experience"
  | "health_symptoms"
  | "teacher_public_service"
  | "comparison"
  | "retelling_events";

export type PunjabiB1TaskPhrase = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiB1LearnerTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiB1TaskPhrase;
};

export type PunjabiB1CommunicationTask = {
  id: string;
  level: "B1";
  focus: PunjabiB1CommunicationFocus;
  title_en: string;
  title_vi: string;
  situation_en: string;
  situation_vi: string;
  learnerGoal_en: string;
  learnerGoal_vi: string;
  canadaContext?: string;
  usefulPhrases: PunjabiB1TaskPhrase[];
  modelResponse: PunjabiB1TaskPhrase;
  followUpPrompt_en: string;
  followUpPrompt_vi: string;
  learnerTraps: PunjabiB1LearnerTrap[];
};

export const punjabiB1CommunicationTasks: PunjabiB1CommunicationTask[] = [
  {
    id: "pa-b1-task-01-explain-late-bus",
    level: "B1",
    focus: "explain_situation",
    title_en: "Explain why you are late",
    title_vi: "Giải thích vì sao đến muộn",
    situation_en: "You arrive late to an appointment because the bus was delayed.",
    situation_vi: "Bạn đến trễ lịch hẹn vì xe buýt bị trễ.",
    learnerGoal_en: "Explain the situation, apologize, and say what you can do next.",
    learnerGoal_vi: "Giải thích tình huống, xin lỗi và nói bước tiếp theo.",
    canadaContext: "Useful for clinic, school, settlement-office, or Service Canada appointments.",
    usefulPhrases: [
      { pa: "ਮੇਰੀ ਬੱਸ ਲੇਟ ਸੀ।", romanization: "meri bass late si.", en: "My bus was late.", vi: "Xe buýt của tôi bị trễ." },
      { pa: "ਇਸ ਕਰਕੇ ਮੈਂ ਸਮੇਂ ਤੇ ਨਹੀਂ ਪਹੁੰਚ ਸਕਿਆ।", romanization: "is karke main same te nahin pahunch sakia.", en: "Because of this, I could not arrive on time.", vi: "Vì vậy tôi không thể đến đúng giờ." },
      { pa: "ਕੀ ਅਸੀਂ ਫਿਰ ਵੀ ਗੱਲ ਕਰ ਸਕਦੇ ਹਾਂ?", romanization: "ki asin phir vi gall kar sakde han?", en: "Can we still talk?", vi: "Chúng ta vẫn có thể trao đổi không?" },
    ],
    modelResponse: {
      pa: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਮੇਰੀ ਬੱਸ ਲੇਟ ਸੀ। ਇਸ ਕਰਕੇ ਮੈਂ ਸਮੇਂ ਤੇ ਨਹੀਂ ਪਹੁੰਚ ਸਕਿਆ। ਕੀ ਅਸੀਂ ਫਿਰ ਵੀ ਗੱਲ ਕਰ ਸਕਦੇ ਹਾਂ?",
      romanization: "maaf karna ji, meri bass late si. is karke main same te nahin pahunch sakia. ki asin phir vi gall kar sakde han?",
      en: "Sorry, my bus was late, so I could not arrive on time. Can we still talk?",
      vi: "Xin lỗi, xe buýt của tôi bị trễ nên tôi không thể đến đúng giờ. Chúng ta vẫn trao đổi được không?",
    },
    followUpPrompt_en: "Now explain that traffic and snow made the trip slow.",
    followUpPrompt_vi: "Bây giờ giải thích rằng giao thông và tuyết làm chuyến đi chậm.",
    learnerTraps: [
      {
        trap_en: "Using only 'because' in English inside a Punjabi sentence.",
        trap_vi: "Chèn nguyên từ 'because' tiếng Anh vào câu Punjabi.",
        better: { pa: "ਇਸ ਕਰਕੇ ਮੈਂ ਲੇਟ ਹੋ ਗਿਆ।", romanization: "is karke main late ho gia.", en: "That is why I became late.", vi: "Vì vậy tôi đã đến muộn." },
      },
    ],
  },
  {
    id: "pa-b1-task-02-clarify-form",
    level: "B1",
    focus: "clarification",
    title_en: "Clarify a form question",
    title_vi: "Làm rõ câu hỏi trong mẫu đơn",
    situation_en: "A public-service form asks for information you do not understand.",
    situation_vi: "Một mẫu đơn dịch vụ công hỏi thông tin bạn không hiểu.",
    learnerGoal_en: "Ask for repetition, simpler wording, and a written note.",
    learnerGoal_vi: "Xin nhắc lại, dùng từ đơn giản hơn và ghi ra giấy.",
    canadaContext: "Useful at newcomer services, libraries, and municipal offices.",
    usefulPhrases: [
      { pa: "ਮੈਨੂੰ ਇਹ ਸਵਾਲ ਸਮਝ ਨਹੀਂ ਆਇਆ।", romanization: "mainu eh sawal samajh nahin aaya.", en: "I did not understand this question.", vi: "Tôi chưa hiểu câu hỏi này." },
      { pa: "ਕੀ ਤੁਸੀਂ ਸੌਖੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਸਮਝਾ ਸਕਦੇ ਹੋ?", romanization: "ki tusin saukhe shabdan vich samjha sakde ho?", en: "Can you explain it in simpler words?", vi: "Bạn có thể giải thích bằng từ đơn giản hơn không?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।", romanization: "kirpa karke eh likh dio.", en: "Please write it down.", vi: "Vui lòng viết ra." },
    ],
    modelResponse: {
      pa: "ਮੈਨੂੰ ਇਹ ਸਵਾਲ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕੀ ਤੁਸੀਂ ਸੌਖੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਸਮਝਾ ਕੇ ਲਿਖ ਦਿਓਗੇ?",
      romanization: "mainu eh sawal samajh nahin aaya. ki tusin saukhe shabdan vich samjha ke likh dioge?",
      en: "I did not understand this question. Could you explain it in simpler words and write it down?",
      vi: "Tôi chưa hiểu câu hỏi này. Bạn có thể giải thích bằng từ đơn giản hơn và viết ra không?",
    },
    followUpPrompt_en: "Ask whether you should write your current address or previous address.",
    followUpPrompt_vi: "Hỏi bạn nên ghi địa chỉ hiện tại hay địa chỉ trước đây.",
    learnerTraps: [
      {
        trap_en: "Saying only 'What?' can sound abrupt in service settings.",
        trap_vi: "Chỉ nói 'Cái gì?' có thể nghe cụt trong môi trường dịch vụ.",
        better: { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusin dubara keh sakde ho?", en: "Sorry, can you say that again?", vi: "Xin lỗi, bạn có thể nói lại không?" },
      },
    ],
  },
  {
    id: "pa-b1-task-03-complain-wrong-bill",
    level: "B1",
    focus: "polite_complaint",
    title_en: "Complain about a wrong bill",
    title_vi: "Phàn nàn về hóa đơn sai",
    situation_en: "Your restaurant bill includes an item you did not order.",
    situation_vi: "Hóa đơn nhà hàng có món bạn không gọi.",
    learnerGoal_en: "State the issue politely and ask staff to check.",
    learnerGoal_vi: "Nêu vấn đề lịch sự và nhờ nhân viên kiểm tra.",
    usefulPhrases: [
      { pa: "ਮੇਰੇ ਬਿੱਲ ਵਿੱਚ ਇੱਕ ਗਲਤੀ ਹੈ।", romanization: "mere bill vich ikk galti hai.", en: "There is a mistake in my bill.", vi: "Có một lỗi trong hóa đơn của tôi." },
      { pa: "ਮੈਂ ਇਹ ਆਰਡਰ ਨਹੀਂ ਕੀਤਾ ਸੀ।", romanization: "main eh order nahin kita si.", en: "I did not order this.", vi: "Tôi đã không gọi món này." },
      { pa: "ਕੀ ਤੁਸੀਂ ਕਿਰਪਾ ਕਰਕੇ ਚੈੱਕ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusin kirpa karke check kar sakde ho?", en: "Could you please check?", vi: "Bạn có thể vui lòng kiểm tra không?" },
    ],
    modelResponse: {
      pa: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਮੇਰੇ ਬਿੱਲ ਵਿੱਚ ਇੱਕ ਗਲਤੀ ਹੈ। ਮੈਂ ਇਹ ਆਰਡਰ ਨਹੀਂ ਕੀਤਾ ਸੀ। ਕੀ ਤੁਸੀਂ ਕਿਰਪਾ ਕਰਕੇ ਚੈੱਕ ਕਰ ਸਕਦੇ ਹੋ?",
      romanization: "maaf karna ji, mere bill vich ikk galti hai. main eh order nahin kita si. ki tusin kirpa karke check kar sakde ho?",
      en: "Excuse me, there is a mistake in my bill. I did not order this. Could you please check?",
      vi: "Xin lỗi, hóa đơn của tôi có lỗi. Tôi không gọi món này. Bạn có thể kiểm tra giúp không?",
    },
    followUpPrompt_en: "Ask for a corrected bill after the staff agrees.",
    followUpPrompt_vi: "Yêu cầu hóa đơn đã sửa sau khi nhân viên đồng ý.",
    learnerTraps: [
      {
        trap_en: "Starting with a direct accusation instead of the problem.",
        trap_vi: "Bắt đầu bằng lời buộc tội trực tiếp thay vì nêu vấn đề.",
        better: { pa: "ਸ਼ਾਇਦ ਬਿੱਲ ਵਿੱਚ ਗਲਤੀ ਹੈ।", romanization: "shayad bill vich galti hai.", en: "Maybe there is a mistake in the bill.", vi: "Có lẽ hóa đơn có lỗi." },
      },
    ],
  },
  {
    id: "pa-b1-task-04-work-experience-interview",
    level: "B1",
    focus: "work_experience",
    title_en: "Describe work experience",
    title_vi: "Mô tả kinh nghiệm làm việc",
    situation_en: "You are in a simple job interview.",
    situation_vi: "Bạn đang trong một buổi phỏng vấn đơn giản.",
    learnerGoal_en: "Describe past work, duties, and one strength.",
    learnerGoal_vi: "Mô tả công việc trước đây, nhiệm vụ và một điểm mạnh.",
    canadaContext: "Useful for entry-level interviews and employment-service practice.",
    usefulPhrases: [
      { pa: "ਮੈਂ ਦੋ ਸਾਲ ਗਾਹਕ ਸੇਵਾ ਵਿੱਚ ਕੰਮ ਕੀਤਾ ਹੈ।", romanization: "main do saal gahak seva vich kamm kita hai.", en: "I worked in customer service for two years.", vi: "Tôi đã làm dịch vụ khách hàng hai năm." },
      { pa: "ਮੇਰੀ ਜ਼ਿੰਮੇਵਾਰੀ ਗਾਹਕਾਂ ਦੀ ਮਦਦ ਕਰਨੀ ਸੀ।", romanization: "meri zimmedari gahakan di madad karni si.", en: "My responsibility was helping customers.", vi: "Trách nhiệm của tôi là giúp khách hàng." },
      { pa: "ਮੈਂ ਸਮੇਂ ਤੇ ਅਤੇ ਧਿਆਨ ਨਾਲ ਕੰਮ ਕਰਦਾ ਹਾਂ।", romanization: "main same te ate dhian naal kamm karda han.", en: "I work on time and carefully.", vi: "Tôi làm việc đúng giờ và cẩn thận." },
    ],
    modelResponse: {
      pa: "ਮੈਂ ਦੋ ਸਾਲ ਗਾਹਕ ਸੇਵਾ ਵਿੱਚ ਕੰਮ ਕੀਤਾ ਹੈ। ਮੇਰੀ ਜ਼ਿੰਮੇਵਾਰੀ ਗਾਹਕਾਂ ਦੀ ਮਦਦ ਕਰਨੀ ਸੀ, ਅਤੇ ਮੈਂ ਸਮੇਂ ਤੇ ਕੰਮ ਕਰਦਾ ਹਾਂ।",
      romanization: "main do saal gahak seva vich kamm kita hai. meri zimmedari gahakan di madad karni si, ate main same te kamm karda han.",
      en: "I worked in customer service for two years. My responsibility was helping customers, and I work on time.",
      vi: "Tôi đã làm dịch vụ khách hàng hai năm. Trách nhiệm của tôi là giúp khách hàng, và tôi làm việc đúng giờ.",
    },
    followUpPrompt_en: "Add one example of solving a customer problem.",
    followUpPrompt_vi: "Thêm một ví dụ về việc giải quyết vấn đề cho khách hàng.",
    learnerTraps: [
      {
        trap_en: "Mixing present and past without a time marker.",
        trap_vi: "Trộn hiện tại và quá khứ mà không có mốc thời gian.",
        better: { pa: "ਪਿਛਲੇ ਸਾਲ ਮੈਂ ਰੈਸਟੋਰੈਂਟ ਵਿੱਚ ਕੰਮ ਕੀਤਾ ਸੀ।", romanization: "pichhle saal main restaurant vich kamm kita si.", en: "Last year I worked in a restaurant.", vi: "Năm ngoái tôi đã làm ở nhà hàng." },
      },
    ],
  },
  {
    id: "pa-b1-task-05-health-symptoms-clinic",
    level: "B1",
    focus: "health_symptoms",
    title_en: "Explain symptoms at a clinic",
    title_vi: "Giải thích triệu chứng ở phòng khám",
    situation_en: "You need to explain symptoms to clinic staff.",
    situation_vi: "Bạn cần giải thích triệu chứng với nhân viên phòng khám.",
    learnerGoal_en: "Say the symptom, duration, and severity. This is language support only, not medical advice.",
    learnerGoal_vi: "Nói triệu chứng, thời gian kéo dài và mức độ. Đây chỉ là hỗ trợ ngôn ngữ, không phải tư vấn y tế.",
    canadaContext: "Useful for walk-in clinic or family-doctor reception conversations.",
    usefulPhrases: [
      { pa: "ਮੈਨੂੰ ਤਿੰਨ ਦਿਨਾਂ ਤੋਂ ਖੰਘ ਹੈ।", romanization: "mainu tinn dinan ton khangh hai.", en: "I have had a cough for three days.", vi: "Tôi bị ho ba ngày nay." },
      { pa: "ਰਾਤ ਨੂੰ ਜ਼ਿਆਦਾ ਤਕਲੀਫ਼ ਹੁੰਦੀ ਹੈ।", romanization: "raat nu zyada takleef hundi hai.", en: "It is worse at night.", vi: "Ban đêm khó chịu hơn." },
      { pa: "ਕੀ ਮੈਨੂੰ ਡਾਕਟਰ ਨੂੰ ਮਿਲਣਾ ਚਾਹੀਦਾ ਹੈ?", romanization: "ki mainu doctor nu milna chahida hai?", en: "Should I see a doctor?", vi: "Tôi có nên gặp bác sĩ không?" },
    ],
    modelResponse: {
      pa: "ਮੈਨੂੰ ਤਿੰਨ ਦਿਨਾਂ ਤੋਂ ਖੰਘ ਹੈ। ਰਾਤ ਨੂੰ ਜ਼ਿਆਦਾ ਤਕਲੀਫ਼ ਹੁੰਦੀ ਹੈ। ਕੀ ਮੈਨੂੰ ਡਾਕਟਰ ਨੂੰ ਮਿਲਣਾ ਚਾਹੀਦਾ ਹੈ?",
      romanization: "mainu tinn dinan ton khangh hai. raat nu zyada takleef hundi hai. ki mainu doctor nu milna chahida hai?",
      en: "I have had a cough for three days. It is worse at night. Should I see a doctor?",
      vi: "Tôi bị ho ba ngày nay. Ban đêm khó chịu hơn. Tôi có nên gặp bác sĩ không?",
    },
    followUpPrompt_en: "Change the symptom to fever and say it started yesterday.",
    followUpPrompt_vi: "Đổi triệu chứng thành sốt và nói bắt đầu từ hôm qua.",
    learnerTraps: [
      {
        trap_en: "Forgetting ਤੋਂ when saying how long a symptom has lasted.",
        trap_vi: "Quên dùng ਤੋਂ khi nói triệu chứng kéo dài bao lâu.",
        better: { pa: "ਕੱਲ੍ਹ ਤੋਂ ਸਿਰ ਦਰਦ ਹੈ।", romanization: "kallh ton sir dard hai.", en: "I have had a headache since yesterday.", vi: "Tôi đau đầu từ hôm qua." },
      },
    ],
  },
  {
    id: "pa-b1-task-06-teacher-meeting",
    level: "B1",
    focus: "teacher_public_service",
    title_en: "Talk with a teacher",
    title_vi: "Nói chuyện với giáo viên",
    situation_en: "A teacher says your child is late with homework.",
    situation_vi: "Giáo viên nói con bạn nộp bài tập muộn.",
    learnerGoal_en: "Ask what happened and what the child should practice.",
    learnerGoal_vi: "Hỏi chuyện gì xảy ra và con nên luyện gì.",
    usefulPhrases: [
      { pa: "ਕੀ ਤੁਸੀਂ ਮੈਨੂੰ ਸਮੱਸਿਆ ਸਮਝਾ ਸਕਦੇ ਹੋ?", romanization: "ki tusin mainu samasya samjha sakde ho?", en: "Can you explain the problem to me?", vi: "Bạn/thầy cô có thể giải thích vấn đề cho tôi không?" },
      { pa: "ਉਹ ਘਰ ਵਿੱਚ ਕੀ ਅਭਿਆਸ ਕਰੇ?", romanization: "oh ghar vich ki abhyas kare?", en: "What should they practice at home?", vi: "Con nên luyện gì ở nhà?" },
      { pa: "ਕੀ ਤੁਸੀਂ ਇੱਕ ਉਦਾਹਰਨ ਦੇ ਸਕਦੇ ਹੋ?", romanization: "ki tusin ikk udaharan de sakde ho?", en: "Can you give an example?", vi: "Bạn/thầy cô có thể cho một ví dụ không?" },
    ],
    modelResponse: {
      pa: "ਕੀ ਤੁਸੀਂ ਮੈਨੂੰ ਸਮੱਸਿਆ ਸਮਝਾ ਸਕਦੇ ਹੋ? ਉਹ ਘਰ ਵਿੱਚ ਕੀ ਅਭਿਆਸ ਕਰੇ, ਅਤੇ ਕੀ ਤੁਸੀਂ ਇੱਕ ਉਦਾਹਰਨ ਦੇ ਸਕਦੇ ਹੋ?",
      romanization: "ki tusin mainu samasya samjha sakde ho? oh ghar vich ki abhyas kare, ate ki tusin ikk udaharan de sakde ho?",
      en: "Can you explain the problem to me? What should they practice at home, and can you give an example?",
      vi: "Bạn/thầy cô có thể giải thích vấn đề cho tôi không? Con nên luyện gì ở nhà, và có thể cho ví dụ không?",
    },
    followUpPrompt_en: "Ask whether you should book another meeting next month.",
    followUpPrompt_vi: "Hỏi liệu bạn nên đặt một buổi họp khác vào tháng tới không.",
    learnerTraps: [
      {
        trap_en: "Using ਤੂੰ with teachers can sound too familiar.",
        trap_vi: "Dùng ਤੂੰ với giáo viên có thể quá thân mật.",
        better: { pa: "ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusin madad kar sakde ho?", en: "Can you help?", vi: "Bạn/thầy cô có thể giúp không?" },
      },
    ],
  },
  {
    id: "pa-b1-task-07-public-service-counter",
    level: "B1",
    focus: "teacher_public_service",
    title_en: "Ask at a service counter",
    title_vi: "Hỏi ở quầy dịch vụ công",
    situation_en: "You are at a public-service counter and a document is missing.",
    situation_vi: "Bạn ở quầy dịch vụ công và thiếu một giấy tờ.",
    learnerGoal_en: "Ask which document is missing and what deadline applies. Language support only, not legal advice.",
    learnerGoal_vi: "Hỏi thiếu giấy tờ nào và hạn chót là gì. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn pháp lý.",
    canadaContext: "Useful for municipal offices, Service Canada-style counters, or settlement support.",
    usefulPhrases: [
      { pa: "ਕਿਹੜਾ ਦਸਤਾਵੇਜ਼ ਘੱਟ ਹੈ?", romanization: "kihra dastavez ghatt hai?", en: "Which document is missing?", vi: "Thiếu giấy tờ nào?" },
      { pa: "ਆਖ਼ਰੀ ਤਾਰੀਖ ਕੀ ਹੈ?", romanization: "akhri tarikh ki hai?", en: "What is the deadline?", vi: "Hạn chót là ngày nào?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਕੇ ਦਿਓ।", romanization: "kirpa karke eh likh ke dio.", en: "Please give this to me in writing.", vi: "Vui lòng ghi điều này cho tôi." },
    ],
    modelResponse: {
      pa: "ਕਿਹੜਾ ਦਸਤਾਵੇਜ਼ ਘੱਟ ਹੈ? ਆਖ਼ਰੀ ਤਾਰੀਖ ਕੀ ਹੈ? ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਕੇ ਦਿਓ।",
      romanization: "kihra dastavez ghatt hai? akhri tarikh ki hai? kirpa karke eh likh ke dio.",
      en: "Which document is missing? What is the deadline? Please give this to me in writing.",
      vi: "Thiếu giấy tờ nào? Hạn chót là ngày nào? Vui lòng ghi điều này cho tôi.",
    },
    followUpPrompt_en: "Ask whether a copy is acceptable or the original is required.",
    followUpPrompt_vi: "Hỏi bản sao có được chấp nhận hay cần bản gốc.",
    learnerTraps: [
      {
        trap_en: "Confusing ਤਾਰੀਖ (date) with ਸਮਾਂ (time).",
        trap_vi: "Nhầm ਤਾਰੀਖ (ngày) với ਸਮਾਂ (giờ/thời gian).",
        better: { pa: "ਮੈਨੂੰ ਤਾਰੀਖ ਅਤੇ ਸਮਾਂ ਦੋਵੇਂ ਚਾਹੀਦੇ ਹਨ।", romanization: "mainu tarikh ate sama dove chahide han.", en: "I need both the date and the time.", vi: "Tôi cần cả ngày và giờ." },
      },
    ],
  },
  {
    id: "pa-b1-task-08-compare-apartments",
    level: "B1",
    focus: "comparison",
    title_en: "Compare two apartments",
    title_vi: "So sánh hai căn hộ",
    situation_en: "You compare two rentals before choosing.",
    situation_vi: "Bạn so sánh hai nơi thuê trước khi chọn.",
    learnerGoal_en: "Compare price, distance, and one advantage.",
    learnerGoal_vi: "So sánh giá, khoảng cách và một lợi điểm.",
    canadaContext: "Useful for rental searches and housing conversations.",
    usefulPhrases: [
      { pa: "ਪਹਿਲਾ ਅਪਾਰਟਮੈਂਟ ਸਸਤਾ ਹੈ।", romanization: "pahila apartment sasta hai.", en: "The first apartment is cheaper.", vi: "Căn hộ đầu tiên rẻ hơn." },
      { pa: "ਦੂਜਾ ਕੰਮ ਦੇ ਨੇੜੇ ਹੈ।", romanization: "duja kamm de nere hai.", en: "The second is closer to work.", vi: "Căn thứ hai gần chỗ làm hơn." },
      { pa: "ਮੇਰੇ ਲਈ ਨੇੜੇ ਹੋਣਾ ਜ਼ਿਆਦਾ ਜ਼ਰੂਰੀ ਹੈ।", romanization: "mere lai nere hona zyada zaroori hai.", en: "For me, being close is more important.", vi: "Với tôi, gần hơn là quan trọng hơn." },
    ],
    modelResponse: {
      pa: "ਪਹਿਲਾ ਅਪਾਰਟਮੈਂਟ ਸਸਤਾ ਹੈ, ਪਰ ਦੂਜਾ ਕੰਮ ਦੇ ਨੇੜੇ ਹੈ। ਮੇਰੇ ਲਈ ਨੇੜੇ ਹੋਣਾ ਜ਼ਿਆਦਾ ਜ਼ਰੂਰੀ ਹੈ।",
      romanization: "pahila apartment sasta hai, par duja kamm de nere hai. mere lai nere hona zyada zaroori hai.",
      en: "The first apartment is cheaper, but the second is closer to work. For me, being close is more important.",
      vi: "Căn hộ đầu tiên rẻ hơn, nhưng căn thứ hai gần chỗ làm hơn. Với tôi, gần là quan trọng hơn.",
    },
    followUpPrompt_en: "Compare a cheaper bus pass with a faster train route.",
    followUpPrompt_vi: "So sánh vé xe buýt rẻ hơn với tuyến tàu nhanh hơn.",
    learnerTraps: [
      {
        trap_en: "Forgetting to state the comparison point clearly.",
        trap_vi: "Quên nêu rõ tiêu chí so sánh.",
        better: { pa: "ਇਹ ਕੀਮਤ ਵਿੱਚ ਸਸਤਾ ਹੈ, ਪਰ ਸਮੇਂ ਵਿੱਚ ਲੰਮਾ ਹੈ।", romanization: "eh keemat vich sasta hai, par same vich lamma hai.", en: "This is cheaper in price, but longer in time.", vi: "Cái này rẻ hơn về giá, nhưng lâu hơn về thời gian." },
      },
    ],
  },
  {
    id: "pa-b1-task-09-retell-work-event",
    level: "B1",
    focus: "retelling_events",
    title_en: "Retell what happened at work",
    title_vi: "Kể lại chuyện xảy ra ở chỗ làm",
    situation_en: "Your manager asks why a delivery was delayed.",
    situation_vi: "Quản lý hỏi vì sao giao hàng bị trễ.",
    learnerGoal_en: "Retell events in order with cause and result.",
    learnerGoal_vi: "Kể lại sự việc theo thứ tự, có nguyên nhân và kết quả.",
    usefulPhrases: [
      { pa: "ਪਹਿਲਾਂ ਆਰਡਰ ਦੇਰ ਨਾਲ ਆਇਆ।", romanization: "pahilan order der naal aaya.", en: "First, the order arrived late.", vi: "Trước tiên, đơn hàng đến muộn." },
      { pa: "ਫਿਰ ਸਾਨੂੰ ਨਵਾਂ ਸਮਾਂ ਦੇਣਾ ਪਿਆ।", romanization: "phir sanu nava sama dena pia.", en: "Then we had to give a new time.", vi: "Sau đó chúng tôi phải đưa thời gian mới." },
      { pa: "ਅਖੀਰ ਵਿੱਚ ਗਾਹਕ ਨੂੰ ਫ਼ੋਨ ਕੀਤਾ।", romanization: "akhir vich gahak nu phone kita.", en: "In the end, we called the customer.", vi: "Cuối cùng, chúng tôi gọi cho khách hàng." },
    ],
    modelResponse: {
      pa: "ਪਹਿਲਾਂ ਆਰਡਰ ਦੇਰ ਨਾਲ ਆਇਆ। ਫਿਰ ਸਾਨੂੰ ਨਵਾਂ ਸਮਾਂ ਦੇਣਾ ਪਿਆ। ਅਖੀਰ ਵਿੱਚ ਗਾਹਕ ਨੂੰ ਫ਼ੋਨ ਕੀਤਾ।",
      romanization: "pahilan order der naal aaya. phir sanu nava sama dena pia. akhir vich gahak nu phone kita.",
      en: "First the order arrived late. Then we had to give a new time. In the end, we called the customer.",
      vi: "Trước tiên đơn hàng đến muộn. Sau đó chúng tôi phải đưa thời gian mới. Cuối cùng, chúng tôi gọi cho khách hàng.",
    },
    followUpPrompt_en: "Retell a school event using first, then, after that, finally.",
    followUpPrompt_vi: "Kể lại một sự việc ở trường dùng trước tiên, sau đó, tiếp theo, cuối cùng.",
    learnerTraps: [
      {
        trap_en: "Listing events without sequence markers.",
        trap_vi: "Liệt kê sự việc mà không có từ chỉ trình tự.",
        better: { pa: "ਉਸ ਤੋਂ ਬਾਅਦ ਮੈਂ ਮੈਨੇਜਰ ਨੂੰ ਦੱਸਿਆ।", romanization: "us ton baad main manager nu dassia.", en: "After that, I told the manager.", vi: "Sau đó, tôi báo cho quản lý." },
      },
    ],
  },
  {
    id: "pa-b1-task-10-clarify-phone-number",
    level: "B1",
    focus: "clarification",
    title_en: "Clarify a phone number",
    title_vi: "Làm rõ số điện thoại",
    situation_en: "Someone gives a phone number too quickly.",
    situation_vi: "Ai đó đọc số điện thoại quá nhanh.",
    learnerGoal_en: "Ask them to repeat and confirm the number.",
    learnerGoal_vi: "Xin họ lặp lại và xác nhận số.",
    usefulPhrases: [
      { pa: "ਨੰਬਰ ਥੋੜ੍ਹਾ ਹੌਲੀ ਕਹੋ ਜੀ।", romanization: "number thora hauli kaho ji.", en: "Please say the number a little slowly.", vi: "Vui lòng đọc số chậm hơn một chút." },
      { pa: "ਕੀ ਮੈਂ ਦੁਹਰਾ ਸਕਦਾ ਹਾਂ?", romanization: "ki main duhra sakda han?", en: "Can I repeat it?", vi: "Tôi có thể lặp lại không?" },
      { pa: "ਕੀ ਇਹ ਸਹੀ ਹੈ?", romanization: "ki eh sahi hai?", en: "Is this correct?", vi: "Như vậy đúng không?" },
    ],
    modelResponse: {
      pa: "ਨੰਬਰ ਥੋੜ੍ਹਾ ਹੌਲੀ ਕਹੋ ਜੀ। ਕੀ ਮੈਂ ਦੁਹਰਾ ਸਕਦਾ ਹਾਂ? ਕੀ ਇਹ ਸਹੀ ਹੈ?",
      romanization: "number thora hauli kaho ji. ki main duhra sakda han? ki eh sahi hai?",
      en: "Please say the number a little slowly. Can I repeat it? Is this correct?",
      vi: "Vui lòng đọc số chậm hơn một chút. Tôi có thể lặp lại không? Như vậy đúng không?",
    },
    followUpPrompt_en: "Confirm an email address with the same strategy.",
    followUpPrompt_vi: "Xác nhận địa chỉ email bằng cùng cách này.",
    learnerTraps: [
      {
        trap_en: "Pretending to understand numbers instead of confirming them.",
        trap_vi: "Giả vờ hiểu số thay vì xác nhận lại.",
        better: { pa: "ਮਾਫ਼ ਕਰਨਾ, ਨੰਬਰ ਦੁਬਾਰਾ ਕਹੋ ਜੀ।", romanization: "maaf karna, number dubara kaho ji.", en: "Sorry, please say the number again.", vi: "Xin lỗi, vui lòng đọc lại số." },
      },
    ],
  },
  {
    id: "pa-b1-task-11-compare-services",
    level: "B1",
    focus: "comparison",
    title_en: "Compare two services",
    title_vi: "So sánh hai dịch vụ",
    situation_en: "You compare two phone plans.",
    situation_vi: "Bạn so sánh hai gói điện thoại.",
    learnerGoal_en: "Compare cost, data, and contract length.",
    learnerGoal_vi: "So sánh chi phí, dữ liệu và thời hạn hợp đồng.",
    canadaContext: "Useful when choosing a phone plan, internet plan, or transit pass.",
    usefulPhrases: [
      { pa: "ਇਹ ਪਲਾਨ ਸਸਤਾ ਹੈ ਪਰ ਡਾਟਾ ਘੱਟ ਹੈ।", romanization: "eh plan sasta hai par data ghatt hai.", en: "This plan is cheaper but has less data.", vi: "Gói này rẻ hơn nhưng ít dữ liệu hơn." },
      { pa: "ਦੂਜੇ ਪਲਾਨ ਵਿੱਚ ਕਾਂਟ੍ਰੈਕਟ ਲੰਮਾ ਹੈ।", romanization: "duje plan vich contract lamma hai.", en: "The second plan has a longer contract.", vi: "Gói thứ hai có hợp đồng dài hơn." },
      { pa: "ਮੈਂ ਛੋਟਾ ਕਾਂਟ੍ਰੈਕਟ ਪਸੰਦ ਕਰਦਾ ਹਾਂ।", romanization: "main chhota contract pasand karda han.", en: "I prefer a shorter contract.", vi: "Tôi thích hợp đồng ngắn hơn." },
    ],
    modelResponse: {
      pa: "ਇਹ ਪਲਾਨ ਸਸਤਾ ਹੈ ਪਰ ਡਾਟਾ ਘੱਟ ਹੈ। ਦੂਜੇ ਪਲਾਨ ਵਿੱਚ ਕਾਂਟ੍ਰੈਕਟ ਲੰਮਾ ਹੈ। ਮੈਂ ਛੋਟਾ ਕਾਂਟ੍ਰੈਕਟ ਪਸੰਦ ਕਰਦਾ ਹਾਂ।",
      romanization: "eh plan sasta hai par data ghatt hai. duje plan vich contract lamma hai. main chhota contract pasand karda han.",
      en: "This plan is cheaper but has less data. The second plan has a longer contract. I prefer a shorter contract.",
      vi: "Gói này rẻ hơn nhưng ít dữ liệu hơn. Gói thứ hai có hợp đồng dài hơn. Tôi thích hợp đồng ngắn hơn.",
    },
    followUpPrompt_en: "Compare two bank accounts by fee and convenience.",
    followUpPrompt_vi: "So sánh hai tài khoản ngân hàng theo phí và sự tiện lợi.",
    learnerTraps: [
      {
        trap_en: "Using ਸਸਤਾ for everything; choose ਘੱਟ, ਵੱਧ, ਲੰਮਾ, ਨੇੜੇ as needed.",
        trap_vi: "Dùng ਸਸਤਾ cho mọi thứ; hãy chọn ਘੱਟ, ਵੱਧ, ਲੰਮਾ, ਨੇੜੇ tùy ý.",
        better: { pa: "ਇਹ ਨੇੜੇ ਹੈ ਪਰ ਮਹਿੰਗਾ ਹੈ।", romanization: "eh nere hai par mehnga hai.", en: "This is closer but expensive.", vi: "Cái này gần hơn nhưng đắt." },
      },
    ],
  },
  {
    id: "pa-b1-task-12-public-service-retell",
    level: "B1",
    focus: "retelling_events",
    title_en: "Retell a public-service visit",
    title_vi: "Kể lại một lần đến cơ quan dịch vụ công",
    situation_en: "You tell a friend what happened at a service counter.",
    situation_vi: "Bạn kể với bạn chuyện xảy ra ở quầy dịch vụ công.",
    learnerGoal_en: "Retell steps, documents, and next action. Language support only, not legal advice.",
    learnerGoal_vi: "Kể lại các bước, giấy tờ và hành động tiếp theo. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn pháp lý.",
    canadaContext: "Useful after a municipal, library, settlement, or Service Canada-style visit.",
    usefulPhrases: [
      { pa: "ਪਹਿਲਾਂ ਮੈਂ ਟੋਕਨ ਲਿਆ।", romanization: "pahilan main token lia.", en: "First I took a token.", vi: "Trước tiên tôi lấy số thứ tự." },
      { pa: "ਫਿਰ ਅਧਿਕਾਰੀ ਨੇ ਪਤੇ ਦਾ ਸਬੂਤ ਮੰਗਿਆ।", romanization: "phir adhikari ne pate da saboot mangia.", en: "Then the officer asked for proof of address.", vi: "Sau đó nhân viên yêu cầu giấy chứng minh địa chỉ." },
      { pa: "ਹੁਣ ਮੈਨੂੰ ਕੱਲ੍ਹ ਵਾਪਸ ਜਾਣਾ ਹੈ।", romanization: "hun mainu kallh wapas jana hai.", en: "Now I have to go back tomorrow.", vi: "Bây giờ tôi phải quay lại ngày mai." },
    ],
    modelResponse: {
      pa: "ਪਹਿਲਾਂ ਮੈਂ ਟੋਕਨ ਲਿਆ। ਫਿਰ ਅਧਿਕਾਰੀ ਨੇ ਪਤੇ ਦਾ ਸਬੂਤ ਮੰਗਿਆ। ਹੁਣ ਮੈਨੂੰ ਕੱਲ੍ਹ ਵਾਪਸ ਜਾਣਾ ਹੈ।",
      romanization: "pahilan main token lia. phir adhikari ne pate da saboot mangia. hun mainu kallh wapas jana hai.",
      en: "First I took a token. Then the officer asked for proof of address. Now I have to go back tomorrow.",
      vi: "Trước tiên tôi lấy số. Sau đó nhân viên yêu cầu giấy chứng minh địa chỉ. Bây giờ tôi phải quay lại ngày mai.",
    },
    followUpPrompt_en: "Retell the same visit but say the missing document was your passport.",
    followUpPrompt_vi: "Kể lại lần đó nhưng nói giấy tờ thiếu là hộ chiếu.",
    learnerTraps: [
      {
        trap_en: "Using ਕੱਲ੍ਹ without context; it can mean yesterday or tomorrow.",
        trap_vi: "Dùng ਕੱਲ੍ਹ thiếu ngữ cảnh; nó có thể là hôm qua hoặc ngày mai.",
        better: { pa: "ਕੱਲ੍ਹ ਸਵੇਰੇ ਵਾਪਸ ਜਾਣਾ ਹੈ।", romanization: "kallh savere wapas jana hai.", en: "I have to go back tomorrow morning.", vi: "Tôi phải quay lại sáng mai." },
      },
    ],
  },
];
