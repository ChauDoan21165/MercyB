// src/languages/punjabi/communityTasksB1.ts
//
// Punjabi B1 community task cards for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary; romanization is a support bridge. Shahmukhi is
// mentioned only for awareness, not taught as a full course.
//
// Native review is deferred; this module makes no native-review claim.

export type PunjabiB1CommunityFocus =
  | "ask_local_help"
  | "community_center_needs"
  | "join_event"
  | "school_community_staff"
  | "describe_problem"
  | "ask_next_steps";

export type PunjabiCommunityPhrase = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiCommunityTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiCommunityPhrase;
};

export type PunjabiB1CommunityTask = {
  id: string;
  level: "B1";
  focus: PunjabiB1CommunityFocus;
  title_en: string;
  title_vi: string;
  communityContext_en: string;
  communityContext_vi: string;
  learnerGoal_en: string;
  learnerGoal_vi: string;
  canadaContext: string;
  usefulPhrases: PunjabiCommunityPhrase[];
  modelResponse: PunjabiCommunityPhrase;
  nextStepQuestion: PunjabiCommunityPhrase;
  practicePrompt_en: string;
  practicePrompt_vi: string;
  commonTraps: PunjabiCommunityTrap[];
};

export const punjabiB1CommunityTasks: PunjabiB1CommunityTask[] = [
  {
    id: "pa-b1-community-01-local-help",
    level: "B1",
    focus: "ask_local_help",
    title_en: "Ask where to get local help",
    title_vi: "Hỏi nơi nhận trợ giúp địa phương",
    communityContext_en: "You are new in the area and need help finding newcomer services.",
    communityContext_vi: "Bạn mới đến khu vực và cần tìm dịch vụ hỗ trợ người mới đến.",
    learnerGoal_en: "Ask politely where to get help and what documents to bring.",
    learnerGoal_vi: "Hỏi lịch sự nơi nhận trợ giúp và cần mang giấy tờ gì.",
    canadaContext: "Useful at libraries, settlement agencies, community centres, and city offices.",
    usefulPhrases: [
      { pa: "ਮੈਂ ਇੱਥੇ ਨਵਾਂ ਹਾਂ।", romanization: "main itthe nava han.", en: "I am new here.", vi: "Tôi mới ở đây." },
      { pa: "ਮੈਨੂੰ ਸਥਾਨਕ ਮਦਦ ਕਿੱਥੇ ਮਿਲ ਸਕਦੀ ਹੈ?", romanization: "mainu sthanak madad kitthe mil sakdi hai?", en: "Where can I get local help?", vi: "Tôi có thể nhận trợ giúp địa phương ở đâu?" },
      { pa: "ਕੀ ਮੈਨੂੰ ਕੋਈ ਦਸਤਾਵੇਜ਼ ਲਿਆਉਣਾ ਹੈ?", romanization: "ki mainu koi dastavez liauna hai?", en: "Do I need to bring any document?", vi: "Tôi có cần mang giấy tờ nào không?" },
    ],
    modelResponse: {
      pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਮੈਂ ਇੱਥੇ ਨਵਾਂ ਹਾਂ। ਮੈਨੂੰ ਸਥਾਨਕ ਮਦਦ ਕਿੱਥੇ ਮਿਲ ਸਕਦੀ ਹੈ, ਅਤੇ ਕੀ ਮੈਨੂੰ ਕੋਈ ਦਸਤਾਵੇਜ਼ ਲਿਆਉਣਾ ਹੈ?",
      romanization: "sat sri akal ji, main itthe nava han. mainu sthanak madad kitthe mil sakdi hai, ate ki mainu koi dastavez liauna hai?",
      en: "Hello, I am new here. Where can I get local help, and do I need to bring any document?",
      vi: "Xin chào, tôi mới ở đây. Tôi có thể nhận trợ giúp địa phương ở đâu, và có cần mang giấy tờ nào không?",
    },
    nextStepQuestion: { pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", romanization: "agla kadam ki hai?", en: "What is the next step?", vi: "Bước tiếp theo là gì?" },
    practicePrompt_en: "Ask where to get help with housing, forms, or language classes.",
    practicePrompt_vi: "Hỏi nơi nhận trợ giúp về nhà ở, mẫu đơn hoặc lớp ngôn ngữ.",
    commonTraps: [
      {
        trap_en: "Saying only 'help' without naming the type of help.",
        trap_vi: "Chỉ nói 'giúp đỡ' mà không nêu loại trợ giúp.",
        better: { pa: "ਮੈਨੂੰ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu form bharan vich madad chahidi hai.", en: "I need help filling out a form.", vi: "Tôi cần trợ giúp điền mẫu đơn." },
      },
    ],
  },
  {
    id: "pa-b1-community-02-community-center-needs",
    level: "B1",
    focus: "community_center_needs",
    title_en: "Explain needs at a community centre",
    title_vi: "Giải thích nhu cầu ở trung tâm cộng đồng",
    communityContext_en: "You ask a community centre about classes and family support.",
    communityContext_vi: "Bạn hỏi trung tâm cộng đồng về lớp học và hỗ trợ gia đình.",
    learnerGoal_en: "Explain your needs, ask available programs, and confirm registration.",
    learnerGoal_vi: "Giải thích nhu cầu, hỏi chương trình có sẵn và xác nhận đăng ký.",
    canadaContext: "Useful at neighbourhood houses, recreation centres, and newcomer programs.",
    usefulPhrases: [
      { pa: "ਮੈਨੂੰ ਅੰਗਰੇਜ਼ੀ ਕਲਾਸ ਅਤੇ ਬੱਚਿਆਂ ਲਈ ਗਤੀਵਿਧੀ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu angrezi class ate bachian lai gatividhi chahidi hai.", en: "I need an English class and an activity for children.", vi: "Tôi cần lớp tiếng Anh và hoạt động cho trẻ em." },
      { pa: "ਕਿਹੜੇ ਪ੍ਰੋਗਰਾਮ ਖਾਲੀ ਹਨ?", romanization: "kihre program khaali han?", en: "Which programs are available?", vi: "Chương trình nào còn chỗ?" },
      { pa: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਕਿਵੇਂ ਕਰਨੀ ਹੈ?", romanization: "registration kiven karni hai?", en: "How do I register?", vi: "Tôi đăng ký bằng cách nào?" },
    ],
    modelResponse: {
      pa: "ਮੈਨੂੰ ਅੰਗਰੇਜ਼ੀ ਕਲਾਸ ਅਤੇ ਬੱਚਿਆਂ ਲਈ ਗਤੀਵਿਧੀ ਚਾਹੀਦੀ ਹੈ। ਕਿਹੜੇ ਪ੍ਰੋਗਰਾਮ ਖਾਲੀ ਹਨ, ਅਤੇ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਕਿਵੇਂ ਕਰਨੀ ਹੈ?",
      romanization: "mainu angrezi class ate bachian lai gatividhi chahidi hai. kihre program khaali han, ate registration kiven karni hai?",
      en: "I need an English class and an activity for children. Which programs are available, and how do I register?",
      vi: "Tôi cần lớp tiếng Anh và hoạt động cho trẻ em. Chương trình nào còn chỗ, và tôi đăng ký bằng cách nào?",
    },
    nextStepQuestion: { pa: "ਕੀ ਕੋਈ ਫੀਸ ਜਾਂ ਉਡੀਕ-ਸੂਚੀ ਹੈ?", romanization: "ki koi fees jaan udeek-suchi hai?", en: "Is there a fee or a waitlist?", vi: "Có phí hoặc danh sách chờ không?" },
    practicePrompt_en: "Ask whether childcare is available during the class.",
    practicePrompt_vi: "Hỏi có giữ trẻ trong lúc học không.",
    commonTraps: [
      {
        trap_en: "Forgetting to ask about registration after finding a program.",
        trap_vi: "Quên hỏi cách đăng ký sau khi tìm được chương trình.",
        better: { pa: "ਰਜਿਸਟਰ ਕਰਨ ਲਈ ਕੀ ਚਾਹੀਦਾ ਹੈ?", romanization: "register karan lai ki chahida hai?", en: "What is needed to register?", vi: "Cần gì để đăng ký?" },
      },
    ],
  },
  {
    id: "pa-b1-community-03-join-event",
    level: "B1",
    focus: "join_event",
    title_en: "Join a local event",
    title_vi: "Tham gia sự kiện địa phương",
    communityContext_en: "You want to join a neighbourhood cleanup or cultural event.",
    communityContext_vi: "Bạn muốn tham gia dọn dẹp khu phố hoặc sự kiện văn hóa.",
    learnerGoal_en: "Ask time, place, registration, and what to bring.",
    learnerGoal_vi: "Hỏi thời gian, địa điểm, đăng ký và cần mang gì.",
    canadaContext: "Useful for library events, park cleanups, festivals, and volunteer activities.",
    usefulPhrases: [
      { pa: "ਮੈਂ ਇਸ ਇਵੈਂਟ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।", romanization: "main is event vich shamil hona chahunda han.", en: "I want to join this event.", vi: "Tôi muốn tham gia sự kiện này." },
      { pa: "ਇਹ ਕਿੱਥੇ ਅਤੇ ਕਦੋਂ ਹੈ?", romanization: "eh kitthe ate kadon hai?", en: "Where and when is it?", vi: "Sự kiện ở đâu và khi nào?" },
      { pa: "ਮੈਨੂੰ ਕੀ ਲਿਆਉਣਾ ਚਾਹੀਦਾ ਹੈ?", romanization: "mainu ki liauna chahida hai?", en: "What should I bring?", vi: "Tôi nên mang gì?" },
    ],
    modelResponse: {
      pa: "ਮੈਂ ਇਸ ਇਵੈਂਟ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਣਾ ਚਾਹੁੰਦਾ ਹਾਂ। ਇਹ ਕਿੱਥੇ ਅਤੇ ਕਦੋਂ ਹੈ, ਅਤੇ ਮੈਨੂੰ ਕੀ ਲਿਆਉਣਾ ਚਾਹੀਦਾ ਹੈ?",
      romanization: "main is event vich shamil hona chahunda han. eh kitthe ate kadon hai, ate mainu ki liauna chahida hai?",
      en: "I want to join this event. Where and when is it, and what should I bring?",
      vi: "Tôi muốn tham gia sự kiện này. Sự kiện ở đâu, khi nào, và tôi nên mang gì?",
    },
    nextStepQuestion: { pa: "ਕੀ ਪਹਿਲਾਂ ਰਜਿਸਟਰ ਕਰਨਾ ਪਵੇਗਾ?", romanization: "ki pahilan register karna pavega?", en: "Do I have to register first?", vi: "Tôi có phải đăng ký trước không?" },
    practicePrompt_en: "Ask about volunteering at a food bank or community garden.",
    practicePrompt_vi: "Hỏi về tình nguyện ở ngân hàng thực phẩm hoặc vườn cộng đồng.",
    commonTraps: [
      {
        trap_en: "Asking only where, but not when or what to bring.",
        trap_vi: "Chỉ hỏi ở đâu mà không hỏi khi nào hoặc cần mang gì.",
        better: { pa: "ਕਿਰਪਾ ਕਰਕੇ ਸਮਾਂ, ਥਾਂ ਅਤੇ ਲਿਆਉਣ ਵਾਲੀਆਂ ਚੀਜ਼ਾਂ ਦੱਸੋ।", romanization: "kirpa karke sama, than ate liaun valian cheezan dasso.", en: "Please tell me the time, place, and things to bring.", vi: "Vui lòng cho tôi biết thời gian, địa điểm và những thứ cần mang." },
      },
    ],
  },
  {
    id: "pa-b1-community-04-school-staff",
    level: "B1",
    focus: "school_community_staff",
    title_en: "Talk to school community staff",
    title_vi: "Nói chuyện với nhân viên trường/cộng đồng",
    communityContext_en: "You ask school staff about an after-school program.",
    communityContext_vi: "Bạn hỏi nhân viên trường về chương trình sau giờ học.",
    learnerGoal_en: "Ask eligibility, schedule, cost, and next steps.",
    learnerGoal_vi: "Hỏi điều kiện tham gia, lịch, phí và bước tiếp theo.",
    canadaContext: "Useful at school offices, parent centres, and after-school programs.",
    usefulPhrases: [
      { pa: "ਕੀ ਮੇਰਾ ਬੱਚਾ ਇਸ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋ ਸਕਦਾ ਹੈ?", romanization: "ki mera bacha is program vich shamil ho sakda hai?", en: "Can my child join this program?", vi: "Con tôi có thể tham gia chương trình này không?" },
      { pa: "ਸਮਾਂ ਅਤੇ ਫੀਸ ਕੀ ਹੈ?", romanization: "sama ate fees ki hai?", en: "What are the time and fee?", vi: "Thời gian và phí là gì?" },
      { pa: "ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਦੱਸੋ ਜੀ।", romanization: "mainu agla kadam dasso ji.", en: "Please tell me the next step.", vi: "Vui lòng cho tôi biết bước tiếp theo." },
    ],
    modelResponse: {
      pa: "ਕੀ ਮੇਰਾ ਬੱਚਾ ਇਸ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋ ਸਕਦਾ ਹੈ? ਸਮਾਂ ਅਤੇ ਫੀਸ ਕੀ ਹੈ? ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਦੱਸੋ ਜੀ।",
      romanization: "ki mera bacha is program vich shamil ho sakda hai? sama ate fees ki hai? mainu agla kadam dasso ji.",
      en: "Can my child join this program? What are the time and fee? Please tell me the next step.",
      vi: "Con tôi có thể tham gia chương trình này không? Thời gian và phí là gì? Vui lòng cho tôi biết bước tiếp theo.",
    },
    nextStepQuestion: { pa: "ਕੀ ਫਾਰਮ ਆਨਲਾਈਨ ਹੈ ਜਾਂ ਦਫ਼ਤਰ ਵਿੱਚ?", romanization: "ki form online hai jaan daftar vich?", en: "Is the form online or in the office?", vi: "Mẫu đơn ở trực tuyến hay tại văn phòng?" },
    practicePrompt_en: "Ask whether translation or parent support is available.",
    practicePrompt_vi: "Hỏi có phiên dịch hoặc hỗ trợ phụ huynh không.",
    commonTraps: [
      {
        trap_en: "Using informal ਤੂੰ with school staff.",
        trap_vi: "Dùng ਤੂੰ thân mật với nhân viên trường.",
        better: { pa: "ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusin madad kar sakde ho?", en: "Can you help?", vi: "Bạn có thể giúp không?" },
      },
    ],
  },
  {
    id: "pa-b1-community-05-describe-problem",
    level: "B1",
    focus: "describe_problem",
    title_en: "Describe a community problem",
    title_vi: "Mô tả một vấn đề cộng đồng",
    communityContext_en: "A park light is broken or a sidewalk is icy.",
    communityContext_vi: "Đèn công viên bị hỏng hoặc vỉa hè bị đóng băng.",
    learnerGoal_en: "Describe the problem, location, risk, and what help is needed.",
    learnerGoal_vi: "Mô tả vấn đề, vị trí, rủi ro và cần trợ giúp gì.",
    canadaContext: "Useful for city service requests, community offices, building managers, and 311-style calls.",
    usefulPhrases: [
      { pa: "ਇੱਥੇ ਲਾਈਟ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।", romanization: "itthe light kamm nahin kar rahi.", en: "The light here is not working.", vi: "Đèn ở đây không hoạt động." },
      { pa: "ਰਾਤ ਨੂੰ ਇਹ ਖਤਰਨਾਕ ਹੈ।", romanization: "raat nu eh khatarnak hai.", en: "At night this is dangerous.", vi: "Ban đêm việc này nguy hiểm." },
      { pa: "ਕੀ ਕੋਈ ਇਸ ਨੂੰ ਚੈੱਕ ਕਰ ਸਕਦਾ ਹੈ?", romanization: "ki koi is nu check kar sakda hai?", en: "Can someone check this?", vi: "Có ai kiểm tra việc này được không?" },
    ],
    modelResponse: {
      pa: "ਪਾਰਕ ਦੇ ਦਰਵਾਜ਼ੇ ਕੋਲ ਲਾਈਟ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ। ਰਾਤ ਨੂੰ ਇਹ ਖਤਰਨਾਕ ਹੈ। ਕੀ ਕੋਈ ਇਸ ਨੂੰ ਚੈੱਕ ਕਰ ਸਕਦਾ ਹੈ?",
      romanization: "park de darwaze kol light kamm nahin kar rahi. raat nu eh khatarnak hai. ki koi is nu check kar sakda hai?",
      en: "The light near the park entrance is not working. At night this is dangerous. Can someone check this?",
      vi: "Đèn gần cổng công viên không hoạt động. Ban đêm việc này nguy hiểm. Có ai kiểm tra được không?",
    },
    nextStepQuestion: { pa: "ਰਿਪੋਰਟ ਨੰਬਰ ਕਿਵੇਂ ਮਿਲੇਗਾ?", romanization: "report number kiven milega?", en: "How will I get the report number?", vi: "Tôi sẽ nhận số báo cáo bằng cách nào?" },
    practicePrompt_en: "Describe an icy sidewalk, broken playground item, or unsafe bus stop.",
    practicePrompt_vi: "Mô tả vỉa hè đóng băng, đồ chơi sân chơi bị hỏng hoặc trạm xe buýt không an toàn.",
    commonTraps: [
      {
        trap_en: "Saying 'there is a problem' without giving location.",
        trap_vi: "Nói 'có vấn đề' mà không nêu vị trí.",
        better: { pa: "ਸਮੱਸਿਆ ਪਾਰਕ ਦੇ ਦਰਵਾਜ਼ੇ ਕੋਲ ਹੈ।", romanization: "samasya park de darwaze kol hai.", en: "The problem is near the park entrance.", vi: "Vấn đề ở gần cổng công viên." },
      },
    ],
  },
  {
    id: "pa-b1-community-06-ask-next-steps",
    level: "B1",
    focus: "ask_next_steps",
    title_en: "Ask next steps after an intake meeting",
    title_vi: "Hỏi bước tiếp theo sau buổi tiếp nhận",
    communityContext_en: "You finish an intake meeting at a community or settlement agency.",
    communityContext_vi: "Bạn kết thúc buổi tiếp nhận tại cơ quan cộng đồng hoặc định cư.",
    learnerGoal_en: "Confirm next steps, documents, deadline, and contact method.",
    learnerGoal_vi: "Xác nhận bước tiếp theo, giấy tờ, hạn chót và cách liên hệ.",
    canadaContext: "Useful after newcomer intake, housing support, employment help, or community referrals.",
    usefulPhrases: [
      { pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", romanization: "agla kadam ki hai?", en: "What is the next step?", vi: "Bước tiếp theo là gì?" },
      { pa: "ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲਿਆਉਣੇ ਹਨ?", romanization: "mainu kihre dastavez liaune han?", en: "Which documents do I need to bring?", vi: "Tôi cần mang giấy tờ nào?" },
      { pa: "ਤੁਸੀਂ ਮੈਨੂੰ ਕਿਵੇਂ ਸੰਪਰਕ ਕਰੋਗੇ?", romanization: "tusin mainu kiven sampark karoge?", en: "How will you contact me?", vi: "Bạn sẽ liên hệ với tôi bằng cách nào?" },
    ],
    modelResponse: {
      pa: "ਧੰਨਵਾਦ ਜੀ। ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ? ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲਿਆਉਣੇ ਹਨ, ਅਤੇ ਤੁਸੀਂ ਮੈਨੂੰ ਕਿਵੇਂ ਸੰਪਰਕ ਕਰੋਗੇ?",
      romanization: "dhanvaad ji. agla kadam ki hai? mainu kihre dastavez liaune han, ate tusin mainu kiven sampark karoge?",
      en: "Thank you. What is the next step? Which documents do I need to bring, and how will you contact me?",
      vi: "Cảm ơn. Bước tiếp theo là gì? Tôi cần mang giấy tờ nào, và bạn sẽ liên hệ với tôi bằng cách nào?",
    },
    nextStepQuestion: { pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਈਮੇਲ ਵਿੱਚ ਭੇਜ ਸਕਦੇ ਹੋ?", romanization: "ki tusin eh email vich bhej sakde ho?", en: "Can you send this by email?", vi: "Bạn có thể gửi điều này qua email không?" },
    practicePrompt_en: "Ask for the next appointment time and whether you need to bring ID.",
    practicePrompt_vi: "Hỏi giờ hẹn tiếp theo và có cần mang ID không.",
    commonTraps: [
      {
        trap_en: "Leaving without confirming the contact method.",
        trap_vi: "Rời đi mà không xác nhận cách liên hệ.",
        better: { pa: "ਕੀ ਤੁਸੀਂ ਫ਼ੋਨ ਕਰੋਗੇ ਜਾਂ ਈਮੇਲ ਭੇਜੋਗੇ?", romanization: "ki tusin phone karoge jaan email bhejoge?", en: "Will you call or send an email?", vi: "Bạn sẽ gọi điện hay gửi email?" },
      },
    ],
  },
  {
    id: "pa-b1-community-07-library-card",
    level: "B1",
    focus: "community_center_needs",
    title_en: "Ask for a library card",
    title_vi: "Hỏi làm thẻ thư viện",
    communityContext_en: "You want a library card and access to classes or computers.",
    communityContext_vi: "Bạn muốn làm thẻ thư viện và sử dụng lớp học hoặc máy tính.",
    learnerGoal_en: "Ask requirements, services, and how to book a computer.",
    learnerGoal_vi: "Hỏi yêu cầu, dịch vụ và cách đặt máy tính.",
    canadaContext: "Useful at public libraries that provide settlement, language, computer, and children’s programs.",
    usefulPhrases: [
      { pa: "ਮੈਨੂੰ ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ ਬਣਾਉਣਾ ਹੈ।", romanization: "mainu library card banauna hai.", en: "I want to make/get a library card.", vi: "Tôi muốn làm thẻ thư viện." },
      { pa: "ਕੀ ਪਤੇ ਦਾ ਸਬੂਤ ਚਾਹੀਦਾ ਹੈ?", romanization: "ki pate da saboot chahida hai?", en: "Is proof of address needed?", vi: "Có cần chứng minh địa chỉ không?" },
      { pa: "ਕੰਪਿਊਟਰ ਕਿਵੇਂ ਬੁੱਕ ਕਰਨਾ ਹੈ?", romanization: "computer kiven book karna hai?", en: "How do I book a computer?", vi: "Tôi đặt máy tính bằng cách nào?" },
    ],
    modelResponse: {
      pa: "ਮੈਨੂੰ ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ ਬਣਾਉਣਾ ਹੈ। ਕੀ ਪਤੇ ਦਾ ਸਬੂਤ ਚਾਹੀਦਾ ਹੈ, ਅਤੇ ਕੰਪਿਊਟਰ ਕਿਵੇਂ ਬੁੱਕ ਕਰਨਾ ਹੈ?",
      romanization: "mainu library card banauna hai. ki pate da saboot chahida hai, ate computer kiven book karna hai?",
      en: "I want to get a library card. Is proof of address needed, and how do I book a computer?",
      vi: "Tôi muốn làm thẻ thư viện. Có cần chứng minh địa chỉ không, và tôi đặt máy tính bằng cách nào?",
    },
    nextStepQuestion: { pa: "ਕੀ ਕੋਈ ਮੁਫ਼ਤ ਕਲਾਸ ਵੀ ਹੈ?", romanization: "ki koi muft class vi hai?", en: "Is there also a free class?", vi: "Có lớp miễn phí nào không?" },
    practicePrompt_en: "Ask about printing, English class registration, or children’s story time.",
    practicePrompt_vi: "Hỏi về in ấn, đăng ký lớp tiếng Anh hoặc giờ kể chuyện cho trẻ em.",
    commonTraps: [
      {
        trap_en: "Using ਕਾਰਡ ਬਣਾਉਣਾ literally is acceptable, but clarify what card you mean.",
        trap_vi: "Dùng ਕਾਰਡ ਬਣਾਉਣਾ có thể hiểu được, nhưng cần nói rõ thẻ gì.",
        better: { pa: "ਮੈਨੂੰ ਲਾਇਬ੍ਰੇਰੀ ਕਾਰਡ ਚਾਹੀਦਾ ਹੈ।", romanization: "mainu library card chahida hai.", en: "I need a library card.", vi: "Tôi cần thẻ thư viện." },
      },
    ],
  },
  {
    id: "pa-b1-community-08-volunteer-question",
    level: "B1",
    focus: "join_event",
    title_en: "Ask about volunteering",
    title_vi: "Hỏi về tình nguyện",
    communityContext_en: "You want to volunteer at a community event but need details.",
    communityContext_vi: "Bạn muốn tình nguyện ở sự kiện cộng đồng nhưng cần chi tiết.",
    learnerGoal_en: "Ask role, time, training, and contact person.",
    learnerGoal_vi: "Hỏi vai trò, thời gian, đào tạo và người liên hệ.",
    canadaContext: "Useful for food banks, festivals, community gardens, and school events.",
    usefulPhrases: [
      { pa: "ਮੈਂ ਵਲੰਟੀਅਰ ਬਣਨਾ ਚਾਹੁੰਦਾ ਹਾਂ।", romanization: "main volunteer banna chahunda han.", en: "I want to be a volunteer.", vi: "Tôi muốn làm tình nguyện viên." },
      { pa: "ਮੇਰਾ ਕੰਮ ਕੀ ਹੋਵੇਗਾ?", romanization: "mera kamm ki hovega?", en: "What will my work be?", vi: "Công việc của tôi sẽ là gì?" },
      { pa: "ਕੀ ਕੋਈ ਟ੍ਰੇਨਿੰਗ ਹੈ?", romanization: "ki koi training hai?", en: "Is there any training?", vi: "Có đào tạo không?" },
    ],
    modelResponse: {
      pa: "ਮੈਂ ਵਲੰਟੀਅਰ ਬਣਨਾ ਚਾਹੁੰਦਾ ਹਾਂ। ਮੇਰਾ ਕੰਮ ਕੀ ਹੋਵੇਗਾ, ਸਮਾਂ ਕੀ ਹੈ, ਅਤੇ ਕੀ ਕੋਈ ਟ੍ਰੇਨਿੰਗ ਹੈ?",
      romanization: "main volunteer banna chahunda han. mera kamm ki hovega, sama ki hai, ate ki koi training hai?",
      en: "I want to volunteer. What will my work be, what is the time, and is there any training?",
      vi: "Tôi muốn làm tình nguyện viên. Công việc của tôi là gì, thời gian thế nào, và có đào tạo không?",
    },
    nextStepQuestion: { pa: "ਮੈਨੂੰ ਕਿਸ ਨਾਲ ਸੰਪਰਕ ਕਰਨਾ ਹੈ?", romanization: "mainu kis naal sampark karna hai?", en: "Who should I contact?", vi: "Tôi nên liên hệ với ai?" },
    practicePrompt_en: "Ask whether beginner English is okay for the volunteer role.",
    practicePrompt_vi: "Hỏi tiếng Anh mức mới bắt đầu có phù hợp với vai trò tình nguyện không.",
    commonTraps: [
      {
        trap_en: "Not asking about training before accepting a role.",
        trap_vi: "Không hỏi về đào tạo trước khi nhận vai trò.",
        better: { pa: "ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਟ੍ਰੇਨਿੰਗ ਹੋਵੇਗੀ?", romanization: "shuru karan ton pahilan training hovegi?", en: "Will there be training before starting?", vi: "Có đào tạo trước khi bắt đầu không?" },
      },
    ],
  },
];
