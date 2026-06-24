// src/languages/punjabi/listeningScripts.ts
//
// Punjabi listening-script practice for Vietnamese-speaking and English-
// speaking learners. Text only: no audio, no pronunciation scoring, no Azure.
// Gurmukhi is primary; romanization is a learner bridge. Shahmukhi is noted
// only as script awareness, not taught here. Native review is deferred.

export type PunjabiCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type PunjabiListeningTopic =
  | "greetings"
  | "market"
  | "transit"
  | "phone"
  | "workplace"
  | "appointment"
  | "public_service"
  | "housing"
  | "health"
  | "school";

export type PunjabiScriptLine = {
  speaker?: string;
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiKeyPhrase = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiComprehensionQuestion = {
  q_en: string;
  q_vi: string;
  answer_en: string;
  answer_vi: string;
};

export type PunjabiListeningScript = {
  id: string;
  level: PunjabiCefrLevel;
  topic: PunjabiListeningTopic;
  title_en: string;
  title_vi: string;
  goal_en: string;
  goal_vi: string;
  transcript: PunjabiScriptLine[];
  keyPhrases: PunjabiKeyPhrase[];
  questions: PunjabiComprehensionQuestion[];
  likelyConfusion_en: string;
  likelyConfusion_vi: string;
};

export const punjabiListeningScripts: PunjabiListeningScript[] = [
  {
    id: "pa-listen-a1-01-greeting-name",
    level: "A1",
    topic: "greetings",
    title_en: "Greeting and name",
    title_vi: "Chào hỏi và tên",
    goal_en: "Catch the greeting and the speaker's name.",
    goal_vi: "Nghe ra lời chào và tên người nói.",
    transcript: [
      { speaker: "A", pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ।", romanization: "sat sri akal ji.", en: "Hello.", vi: "Xin chào." },
      { speaker: "A", pa: "ਮੇਰਾ ਨਾਮ ਅਮਨ ਹੈ।", romanization: "mera naam Aman hai.", en: "My name is Aman.", vi: "Tôi tên là Aman." },
      { speaker: "B", pa: "ਤੁਹਾਨੂੰ ਮਿਲ ਕੇ ਖੁਸ਼ੀ ਹੋਈ।", romanization: "tuhanu mil ke khushi hoi.", en: "Nice to meet you.", vi: "Rất vui được gặp bạn." },
    ],
    keyPhrases: [
      { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", romanization: "sat sri akal", en: "hello", vi: "xin chào" },
      { pa: "ਮੇਰਾ ਨਾਮ", romanization: "mera naam", en: "my name", vi: "tên tôi" },
    ],
    questions: [
      { q_en: "What is the speaker's name?", q_vi: "Người nói tên gì?", answer_en: "Aman.", answer_vi: "Aman." },
    ],
    likelyConfusion_en: "ਜੀ adds politeness; it is not part of the name.",
    likelyConfusion_vi: "ਜੀ thể hiện lịch sự; nó không phải là một phần của tên.",
  },
  {
    id: "pa-listen-a1-02-market-price",
    level: "A1",
    topic: "market",
    title_en: "Asking a fruit price",
    title_vi: "Hỏi giá trái cây",
    goal_en: "Hear the item and the price.",
    goal_vi: "Nghe ra món hàng và giá.",
    transcript: [
      { speaker: "Customer", pa: "ਅੰਬ ਕਿੰਨੇ ਦੇ ਹਨ?", romanization: "amb kinne de han?", en: "How much are the mangoes?", vi: "Xoài giá bao nhiêu?" },
      { speaker: "Seller", pa: "ਤਿੰਨ ਡਾਲਰ ਕਿਲੋ।", romanization: "tinn dollar kilo.", en: "Three dollars a kilo.", vi: "Ba đô một ký." },
      { speaker: "Customer", pa: "ਮੈਨੂੰ ਇੱਕ ਕਿਲੋ ਦੇ ਦਿਓ।", romanization: "mainu ikk kilo de dio.", en: "Give me one kilo, please.", vi: "Cho tôi một ký." },
    ],
    keyPhrases: [
      { pa: "ਕਿੰਨੇ ਦੇ", romanization: "kinne de", en: "how much", vi: "bao nhiêu tiền" },
      { pa: "ਇੱਕ ਕਿਲੋ", romanization: "ikk kilo", en: "one kilo", vi: "một ký" },
    ],
    questions: [
      { q_en: "What does the customer buy?", q_vi: "Khách mua gì?", answer_en: "Mangoes.", answer_vi: "Xoài." },
      { q_en: "How much is one kilo?", q_vi: "Một ký giá bao nhiêu?", answer_en: "Three dollars.", answer_vi: "Ba đô." },
    ],
    likelyConfusion_en: "ਕਿੰਨੇ can sound close to ਕਿੱਥੇ; listen for ਦੇ after it to identify price.",
    likelyConfusion_vi: "ਕਿੰਨੇ có thể nghe gần giống ਕਿੱਥੇ; hãy nghe từ ਦੇ phía sau để nhận ra câu hỏi giá.",
  },
  {
    id: "pa-listen-a1-03-bus-stop",
    level: "A1",
    topic: "transit",
    title_en: "Finding the bus stop",
    title_vi: "Tìm trạm xe buýt",
    goal_en: "Catch a place word and a simple direction.",
    goal_vi: "Nghe ra địa điểm và hướng đơn giản.",
    transcript: [
      { speaker: "Learner", pa: "ਬੱਸ ਸਟਾਪ ਕਿੱਥੇ ਹੈ?", romanization: "bass stap kitthe hai?", en: "Where is the bus stop?", vi: "Trạm xe buýt ở đâu?" },
      { speaker: "Local", pa: "ਸਿੱਧੇ ਜਾਓ, ਫਿਰ ਖੱਬੇ ਮੁੜੋ।", romanization: "siddhe jao, phir khabbe muro.", en: "Go straight, then turn left.", vi: "Đi thẳng, rồi rẽ trái." },
      { speaker: "Local", pa: "ਸਟਾਪ ਬੈਂਕ ਦੇ ਕੋਲ ਹੈ।", romanization: "stap bank de kol hai.", en: "The stop is near the bank.", vi: "Trạm ở gần ngân hàng." },
    ],
    keyPhrases: [
      { pa: "ਕਿੱਥੇ ਹੈ", romanization: "kitthe hai", en: "where is it", vi: "ở đâu" },
      { pa: "ਖੱਬੇ ਮੁੜੋ", romanization: "khabbe muro", en: "turn left", vi: "rẽ trái" },
    ],
    questions: [
      { q_en: "Where is the bus stop?", q_vi: "Trạm xe buýt ở đâu?", answer_en: "Near the bank.", answer_vi: "Gần ngân hàng." },
    ],
    likelyConfusion_en: "ਖੱਬੇ means left; ਸੱਜੇ means right.",
    likelyConfusion_vi: "ਖੱਬੇ là bên trái; ਸੱਜੇ là bên phải.",
  },
  {
    id: "pa-listen-a1-04-phone-wrong-number",
    level: "A1",
    topic: "phone",
    title_en: "Wrong number",
    title_vi: "Gọi nhầm số",
    goal_en: "Hear that the call is a wrong number.",
    goal_vi: "Nghe ra đây là cuộc gọi nhầm số.",
    transcript: [
      { speaker: "Caller", pa: "ਹੈਲੋ, ਕੀ ਰਵੀ ਬੋਲ ਰਿਹਾ ਹੈ?", romanization: "hello, ki Ravi bol riha hai?", en: "Hello, is Ravi speaking?", vi: "A lô, có phải Ravi đang nói không?" },
      { speaker: "Receiver", pa: "ਨਹੀਂ ਜੀ, ਗਲਤ ਨੰਬਰ ਹੈ।", romanization: "nahin ji, galat number hai.", en: "No, this is the wrong number.", vi: "Không ạ, nhầm số rồi." },
      { speaker: "Caller", pa: "ਮਾਫ਼ ਕਰਨਾ।", romanization: "maaf karna.", en: "Sorry.", vi: "Xin lỗi." },
    ],
    keyPhrases: [
      { pa: "ਗਲਤ ਨੰਬਰ", romanization: "galat number", en: "wrong number", vi: "nhầm số" },
      { pa: "ਮਾਫ਼ ਕਰਨਾ", romanization: "maaf karna", en: "sorry", vi: "xin lỗi" },
    ],
    questions: [
      { q_en: "Who is the caller looking for?", q_vi: "Người gọi tìm ai?", answer_en: "Ravi.", answer_vi: "Ravi." },
    ],
    likelyConfusion_en: "ਬੋਲ ਰਿਹਾ ਹੈ means 'is speaking'; it is common on phone calls.",
    likelyConfusion_vi: "ਬੋਲ ਰਿਹਾ ਹੈ nghĩa là 'đang nói', thường dùng khi gọi điện.",
  },
  {
    id: "pa-listen-a1-05-school-time",
    level: "A1",
    topic: "school",
    title_en: "Class time",
    title_vi: "Giờ học",
    goal_en: "Catch the start time for class.",
    goal_vi: "Nghe ra giờ bắt đầu lớp học.",
    transcript: [
      { speaker: "Student", pa: "ਪੰਜਾਬੀ ਕਲਾਸ ਕਦੋਂ ਹੈ?", romanization: "Punjabi class kadon hai?", en: "When is Punjabi class?", vi: "Lớp Punjabi khi nào?" },
      { speaker: "Teacher", pa: "ਕਲਾਸ ਸ਼ਾਮ ਛੇ ਵਜੇ ਹੈ।", romanization: "class shaam chhe vaje hai.", en: "Class is at six in the evening.", vi: "Lớp học lúc sáu giờ tối." },
      { speaker: "Teacher", pa: "ਕਿਰਪਾ ਕਰਕੇ ਸਮੇਂ ਤੇ ਆਓ।", romanization: "kirpa karke same te aao.", en: "Please come on time.", vi: "Vui lòng đến đúng giờ." },
    ],
    keyPhrases: [
      { pa: "ਕਦੋਂ", romanization: "kadon", en: "when", vi: "khi nào" },
      { pa: "ਛੇ ਵਜੇ", romanization: "chhe vaje", en: "six o'clock", vi: "sáu giờ" },
    ],
    questions: [
      { q_en: "What time is class?", q_vi: "Lớp học lúc mấy giờ?", answer_en: "At six in the evening.", answer_vi: "Lúc sáu giờ tối." },
    ],
    likelyConfusion_en: "ਸ਼ਾਮ marks evening; ਸਵੇਰੇ marks morning.",
    likelyConfusion_vi: "ਸ਼ਾਮ chỉ buổi tối/chiều tối; ਸਵੇਰੇ chỉ buổi sáng.",
  },
  {
    id: "pa-listen-a2-01-work-break",
    level: "A2",
    topic: "workplace",
    title_en: "Taking a short break",
    title_vi: "Nghỉ giải lao ngắn",
    goal_en: "Identify the request and the return time.",
    goal_vi: "Nhận ra lời xin phép và giờ quay lại.",
    transcript: [
      { speaker: "Worker", pa: "ਕੀ ਮੈਂ ਦੱਸ ਮਿੰਟ ਦੀ ਬ੍ਰੇਕ ਲੈ ਸਕਦਾ ਹਾਂ?", romanization: "ki main dass mint di break lai sakda han?", en: "Can I take a ten-minute break?", vi: "Tôi có thể nghỉ mười phút không?" },
      { speaker: "Manager", pa: "ਠੀਕ ਹੈ, ਪਰ ਦੋ ਵਜੇ ਵਾਪਸ ਆ ਜਾਣਾ।", romanization: "theek hai, par do vaje wapas aa jana.", en: "Okay, but come back at two.", vi: "Được, nhưng quay lại lúc hai giờ." },
    ],
    keyPhrases: [
      { pa: "ਬ੍ਰੇਕ ਲੈ ਸਕਦਾ ਹਾਂ", romanization: "break lai sakda han", en: "can take a break", vi: "có thể nghỉ giải lao" },
      { pa: "ਵਾਪਸ ਆ ਜਾਣਾ", romanization: "wapas aa jana", en: "come back", vi: "quay lại" },
    ],
    questions: [
      { q_en: "How long is the break?", q_vi: "Nghỉ bao lâu?", answer_en: "Ten minutes.", answer_vi: "Mười phút." },
    ],
    likelyConfusion_en: "ਲੈ ਸਕਦਾ ਹਾਂ is male-speaker form; female speakers often say ਲੈ ਸਕਦੀ ਹਾਂ.",
    likelyConfusion_vi: "ਲੈ ਸਕਦਾ ਹਾਂ là dạng người nói nam; người nói nữ thường dùng ਲੈ ਸਕਦੀ ਹਾਂ.",
  },
  {
    id: "pa-listen-a2-02-appointment-date",
    level: "A2",
    topic: "appointment",
    title_en: "Booking an appointment",
    title_vi: "Đặt lịch hẹn",
    goal_en: "Catch the day and time.",
    goal_vi: "Nghe ra ngày và giờ.",
    transcript: [
      { speaker: "Client", pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨਾਲ ਅਪਾਇੰਟਮੈਂਟ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu doctor naal appointment chahidi hai.", en: "I need an appointment with the doctor.", vi: "Tôi cần lịch hẹn với bác sĩ." },
      { speaker: "Reception", pa: "ਵੀਰਵਾਰ ਸਵੇਰੇ ਦਸ ਵਜੇ ਖਾਲੀ ਹੈ।", romanization: "veerwaar savere dass vaje khaali hai.", en: "Thursday at ten in the morning is open.", vi: "Thứ Năm lúc mười giờ sáng còn trống." },
      { speaker: "Client", pa: "ਹਾਂ, ਇਹ ਠੀਕ ਹੈ।", romanization: "haan, eh theek hai.", en: "Yes, that is fine.", vi: "Vâng, như vậy được." },
    ],
    keyPhrases: [
      { pa: "ਅਪਾਇੰਟਮੈਂਟ ਚਾਹੀਦੀ ਹੈ", romanization: "appointment chahidi hai", en: "need an appointment", vi: "cần lịch hẹn" },
      { pa: "ਖਾਲੀ ਹੈ", romanization: "khaali hai", en: "is available", vi: "còn trống" },
    ],
    questions: [
      { q_en: "When is the appointment?", q_vi: "Lịch hẹn khi nào?", answer_en: "Thursday at 10 a.m.", answer_vi: "Thứ Năm lúc 10 giờ sáng." },
    ],
    likelyConfusion_en: "ਖਾਲੀ literally means empty, but in scheduling it means available.",
    likelyConfusion_vi: "ਖਾਲੀ nghĩa đen là trống/rỗng, trong đặt lịch nghĩa là còn lịch.",
  },
  {
    id: "pa-listen-a2-03-pharmacy-cough",
    level: "A2",
    topic: "health",
    title_en: "At the pharmacy",
    title_vi: "Ở hiệu thuốc",
    goal_en: "Hear the symptom and dosage instruction.",
    goal_vi: "Nghe ra triệu chứng và cách dùng thuốc.",
    transcript: [
      { speaker: "Customer", pa: "ਮੈਨੂੰ ਖੰਘ ਹੈ। ਕੋਈ ਦਵਾਈ ਹੈ?", romanization: "mainu khangh hai. koi davai hai?", en: "I have a cough. Is there any medicine?", vi: "Tôi bị ho. Có thuốc nào không?" },
      { speaker: "Pharmacist", pa: "ਇਹ ਦਵਾਈ ਦਿਨ ਵਿੱਚ ਦੋ ਵਾਰ ਲਓ।", romanization: "eh davai din vich do vaar lao.", en: "Take this medicine twice a day.", vi: "Uống thuốc này hai lần mỗi ngày." },
    ],
    keyPhrases: [
      { pa: "ਮੈਨੂੰ ਖੰਘ ਹੈ", romanization: "mainu khangh hai", en: "I have a cough", vi: "tôi bị ho" },
      { pa: "ਦੋ ਵਾਰ", romanization: "do vaar", en: "twice", vi: "hai lần" },
    ],
    questions: [
      { q_en: "What symptom does the customer have?", q_vi: "Khách có triệu chứng gì?", answer_en: "A cough.", answer_vi: "Bị ho." },
    ],
    likelyConfusion_en: "This is language practice only; medical decisions require a qualified professional.",
    likelyConfusion_vi: "Đây chỉ là hỗ trợ ngôn ngữ; quyết định y tế cần chuyên gia đủ chuyên môn.",
  },
  {
    id: "pa-listen-a2-04-rent-problem",
    level: "A2",
    topic: "housing",
    title_en: "A water problem",
    title_vi: "Vấn đề nước trong nhà",
    goal_en: "Understand a simple repair problem.",
    goal_vi: "Hiểu một vấn đề sửa chữa đơn giản.",
    transcript: [
      { speaker: "Tenant", pa: "ਬਾਥਰੂਮ ਵਿੱਚ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "bathroom vich paani leak ho riha hai.", en: "Water is leaking in the bathroom.", vi: "Nước đang rò trong phòng tắm." },
      { speaker: "Landlord", pa: "ਮੈਂ ਕੱਲ੍ਹ ਪਲੰਬਰ ਭੇਜਾਂਗਾ।", romanization: "main kallh plumber bhejanga.", en: "I will send a plumber tomorrow.", vi: "Tôi sẽ gửi thợ ống nước đến ngày mai." },
    ],
    keyPhrases: [
      { pa: "ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ", romanization: "paani leak ho riha hai", en: "water is leaking", vi: "nước đang rò" },
      { pa: "ਕੱਲ੍ਹ", romanization: "kallh", en: "tomorrow / yesterday by context", vi: "ngày mai / hôm qua tùy ngữ cảnh" },
    ],
    questions: [
      { q_en: "Who will come tomorrow?", q_vi: "Ai sẽ đến ngày mai?", answer_en: "A plumber.", answer_vi: "Thợ ống nước." },
    ],
    likelyConfusion_en: "ਕੱਲ੍ਹ can mean yesterday or tomorrow; future verbs like ਭੇਜਾਂਗਾ make it tomorrow here.",
    likelyConfusion_vi: "ਕੱਲ੍ਹ có thể là hôm qua hoặc ngày mai; động từ tương lai ਭੇਜਾਂਗਾ cho biết ở đây là ngày mai.",
  },
  {
    id: "pa-listen-a2-05-service-form",
    level: "A2",
    topic: "public_service",
    title_en: "Filling a form",
    title_vi: "Điền mẫu đơn",
    goal_en: "Catch what information is missing.",
    goal_vi: "Nghe ra thông tin còn thiếu.",
    transcript: [
      { speaker: "Clerk", pa: "ਇਸ ਫਾਰਮ ਤੇ ਤੁਹਾਡਾ ਪਤਾ ਨਹੀਂ ਹੈ।", romanization: "is form te tuhadda pata nahin hai.", en: "Your address is not on this form.", vi: "Mẫu này chưa có địa chỉ của bạn." },
      { speaker: "Visitor", pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਹੁਣ ਲਿਖ ਦਿੰਦਾ ਹਾਂ।", romanization: "maaf karna, main hun likh dinda han.", en: "Sorry, I will write it now.", vi: "Xin lỗi, tôi sẽ viết ngay." },
    ],
    keyPhrases: [
      { pa: "ਤੁਹਾਡਾ ਪਤਾ", romanization: "tuhadda pata", en: "your address", vi: "địa chỉ của bạn" },
      { pa: "ਲਿਖ ਦਿੰਦਾ ਹਾਂ", romanization: "likh dinda han", en: "I will write it", vi: "tôi sẽ viết" },
    ],
    questions: [
      { q_en: "What is missing from the form?", q_vi: "Mẫu đơn thiếu gì?", answer_en: "The address.", answer_vi: "Địa chỉ." },
    ],
    likelyConfusion_en: "ਪਤਾ means address here, not 'to know'.",
    likelyConfusion_vi: "ਪਤਾ ở đây nghĩa là địa chỉ, không phải 'biết'.",
  },
  {
    id: "pa-listen-b1-01-work-deadline",
    level: "B1",
    topic: "workplace",
    title_en: "Moving a deadline",
    title_vi: "Dời hạn chót",
    goal_en: "Notice the reason for asking for more time.",
    goal_vi: "Nhận ra lý do xin thêm thời gian.",
    transcript: [
      { speaker: "Employee", pa: "ਰਿਪੋਰਟ ਲਗਭਗ ਤਿਆਰ ਹੈ, ਪਰ ਦੋ ਚਾਰਟ ਬਾਕੀ ਹਨ।", romanization: "report lagbhag tiar hai, par do chart baaki han.", en: "The report is almost ready, but two charts remain.", vi: "Báo cáo gần xong, nhưng còn hai biểu đồ." },
      { speaker: "Employee", pa: "ਕੀ ਅਸੀਂ ਡੈਡਲਾਈਨ ਸ਼ੁੱਕਰਵਾਰ ਤੱਕ ਕਰ ਸਕਦੇ ਹਾਂ?", romanization: "ki asin deadline shukkarvaar takk kar sakde han?", en: "Can we move the deadline to Friday?", vi: "Chúng ta có thể dời hạn đến thứ Sáu không?" },
      { speaker: "Manager", pa: "ਠੀਕ ਹੈ, ਪਰ ਸਵੇਰੇ ਤੱਕ ਭੇਜੋ।", romanization: "theek hai, par savere takk bhejo.", en: "Okay, but send it by the morning.", vi: "Được, nhưng gửi trước buổi sáng." },
    ],
    keyPhrases: [
      { pa: "ਲਗਭਗ ਤਿਆਰ", romanization: "lagbhag tiar", en: "almost ready", vi: "gần sẵn sàng" },
      { pa: "ਸ਼ੁੱਕਰਵਾਰ ਤੱਕ", romanization: "shukkarvaar takk", en: "by Friday", vi: "trước/thành đến thứ Sáu" },
    ],
    questions: [
      { q_en: "Why does the employee need more time?", q_vi: "Vì sao nhân viên cần thêm thời gian?", answer_en: "Two charts are still unfinished.", answer_vi: "Còn hai biểu đồ chưa xong." },
    ],
    likelyConfusion_en: "ਤੱਕ marks a limit such as 'by' or 'until'; context decides.",
    likelyConfusion_vi: "ਤੱਕ đánh dấu giới hạn như 'trước hạn' hoặc 'đến khi'; ngữ cảnh quyết định.",
  },
  {
    id: "pa-listen-b1-02-phone-reschedule",
    level: "B1",
    topic: "phone",
    title_en: "Rescheduling by phone",
    title_vi: "Dời lịch qua điện thoại",
    goal_en: "Follow a polite change of plans.",
    goal_vi: "Theo dõi cách đổi lịch lịch sự.",
    transcript: [
      { speaker: "Caller", pa: "ਮੈਂ ਅੱਜ ਦੀ ਮੀਟਿੰਗ ਲਈ ਫ਼ੋਨ ਕਰ ਰਿਹਾ ਹਾਂ।", romanization: "main ajj di meeting lai phone kar riha han.", en: "I am calling about today's meeting.", vi: "Tôi gọi về cuộc họp hôm nay." },
      { speaker: "Caller", pa: "ਮੇਰੀ ਬੱਸ ਲੇਟ ਹੈ, ਇਸ ਕਰਕੇ ਮੈਂ ਸਮੇਂ ਤੇ ਨਹੀਂ ਪਹੁੰਚਾਂਗਾ।", romanization: "meri bass late hai, is karke main same te nahin pahunchanga.", en: "My bus is late, so I will not arrive on time.", vi: "Xe buýt của tôi trễ, nên tôi sẽ không đến đúng giờ." },
      { speaker: "Host", pa: "ਚਲੋ, ਅਸੀਂ ਮੀਟਿੰਗ ਤਿੰਨ ਵਜੇ ਕਰ ਲੈਂਦੇ ਹਾਂ।", romanization: "chalo, asin meeting tinn vaje kar lainde han.", en: "Okay, let's have the meeting at three.", vi: "Được, chúng ta họp lúc ba giờ." },
    ],
    keyPhrases: [
      { pa: "ਇਸ ਕਰਕੇ", romanization: "is karke", en: "because of this / so", vi: "vì vậy" },
      { pa: "ਸਮੇਂ ਤੇ", romanization: "same te", en: "on time", vi: "đúng giờ" },
    ],
    questions: [
      { q_en: "What is the new meeting time?", q_vi: "Giờ họp mới là khi nào?", answer_en: "Three o'clock.", answer_vi: "Ba giờ." },
    ],
    likelyConfusion_en: "ਕਰ ਲੈਂਦੇ ਹਾਂ softens the plan: 'let's do it' rather than a hard order.",
    likelyConfusion_vi: "ਕਰ ਲੈਂਦੇ ਹਾਂ làm câu mềm hơn: 'chúng ta làm nhé' chứ không phải mệnh lệnh cứng.",
  },
  {
    id: "pa-listen-b1-03-bank-documents",
    level: "B1",
    topic: "public_service",
    title_en: "Missing documents at a bank",
    title_vi: "Thiếu giấy tờ ở ngân hàng",
    goal_en: "Identify which documents are required.",
    goal_vi: "Xác định giấy tờ cần có.",
    transcript: [
      { speaker: "Clerk", pa: "ਖਾਤਾ ਖੋਲ੍ਹਣ ਲਈ ਪਾਸਪੋਰਟ ਅਤੇ ਪਤੇ ਦਾ ਸਬੂਤ ਚਾਹੀਦਾ ਹੈ।", romanization: "khata kholhan lai passport ate pate da saboot chahida hai.", en: "To open an account, you need a passport and proof of address.", vi: "Để mở tài khoản, bạn cần hộ chiếu và giấy chứng minh địa chỉ." },
      { speaker: "Customer", pa: "ਮੇਰੇ ਕੋਲ ਪਾਸਪੋਰਟ ਹੈ, ਪਰ ਬਿੱਲ ਘਰ ਰਹਿ ਗਿਆ।", romanization: "mere kol passport hai, par bill ghar reh gia.", en: "I have my passport, but the bill was left at home.", vi: "Tôi có hộ chiếu, nhưng hóa đơn để ở nhà." },
      { speaker: "Clerk", pa: "ਤੁਸੀਂ ਕੱਲ੍ਹ ਵਾਪਸ ਆ ਸਕਦੇ ਹੋ।", romanization: "tusin kallh wapas aa sakde ho.", en: "You can come back tomorrow.", vi: "Bạn có thể quay lại ngày mai." },
    ],
    keyPhrases: [
      { pa: "ਪਤੇ ਦਾ ਸਬੂਤ", romanization: "pate da saboot", en: "proof of address", vi: "chứng minh địa chỉ" },
      { pa: "ਘਰ ਰਹਿ ਗਿਆ", romanization: "ghar reh gia", en: "was left at home", vi: "để quên ở nhà" },
    ],
    questions: [
      { q_en: "Which document is missing?", q_vi: "Thiếu giấy tờ nào?", answer_en: "Proof of address / a bill.", answer_vi: "Chứng minh địa chỉ / hóa đơn." },
    ],
    likelyConfusion_en: "ਰਹਿ ਗਿਆ often means something was left behind accidentally.",
    likelyConfusion_vi: "ਰਹਿ ਗਿਆ thường nghĩa là một thứ bị bỏ quên ngoài ý muốn.",
  },
  {
    id: "pa-listen-b1-04-school-parent",
    level: "B1",
    topic: "school",
    title_en: "Parent-teacher message",
    title_vi: "Tin nhắn phụ huynh - giáo viên",
    goal_en: "Catch the concern and the requested action.",
    goal_vi: "Nghe ra mối quan ngại và việc được yêu cầu.",
    transcript: [
      { speaker: "Teacher", pa: "ਤੁਹਾਡਾ ਬੱਚਾ ਪੜ੍ਹਾਈ ਵਿੱਚ ਚੰਗਾ ਹੈ, ਪਰ ਹੋਮਵਰਕ ਦੇਰ ਨਾਲ ਦਿੰਦਾ ਹੈ।", romanization: "tuhadda bacha parhai vich changa hai, par homework der naal dinda hai.", en: "Your child is good in studies, but submits homework late.", vi: "Con bạn học tốt, nhưng nộp bài tập muộn." },
      { speaker: "Teacher", pa: "ਕਿਰਪਾ ਕਰਕੇ ਹਰ ਰਾਤ ਹੋਮਵਰਕ ਚੈੱਕ ਕਰੋ।", romanization: "kirpa karke har raat homework check karo.", en: "Please check homework every night.", vi: "Vui lòng kiểm tra bài tập mỗi tối." },
    ],
    keyPhrases: [
      { pa: "ਦੇਰ ਨਾਲ", romanization: "der naal", en: "late", vi: "muộn" },
      { pa: "ਹਰ ਰਾਤ", romanization: "har raat", en: "every night", vi: "mỗi tối" },
    ],
    questions: [
      { q_en: "What should the parent check?", q_vi: "Phụ huynh nên kiểm tra gì?", answer_en: "Homework.", answer_vi: "Bài tập về nhà." },
    ],
    likelyConfusion_en: "ਚੰਗਾ ਹੈ balances the criticism; Punjabi feedback often starts with a positive point.",
    likelyConfusion_vi: "ਚੰਗਾ ਹੈ cân bằng lời góp ý; phản hồi tiếng Punjabi thường mở đầu bằng điểm tích cực.",
  },
  {
    id: "pa-listen-b1-05-clinic-symptoms",
    level: "B1",
    topic: "health",
    title_en: "Explaining symptoms",
    title_vi: "Giải thích triệu chứng",
    goal_en: "Hear duration and severity.",
    goal_vi: "Nghe ra thời gian kéo dài và mức độ nặng nhẹ.",
    transcript: [
      { speaker: "Patient", pa: "ਮੈਨੂੰ ਤਿੰਨ ਦਿਨਾਂ ਤੋਂ ਬੁਖਾਰ ਹੈ।", romanization: "mainu tinn dinan ton bukhar hai.", en: "I have had a fever for three days.", vi: "Tôi bị sốt ba ngày nay." },
      { speaker: "Patient", pa: "ਰਾਤ ਨੂੰ ਜ਼ਿਆਦਾ ਤਕਲੀਫ਼ ਹੁੰਦੀ ਹੈ।", romanization: "raat nu zyada takleef hundi hai.", en: "At night the discomfort is worse.", vi: "Ban đêm khó chịu nhiều hơn." },
      { speaker: "Nurse", pa: "ਮੈਂ ਤੁਹਾਡਾ ਤਾਪਮਾਨ ਚੈੱਕ ਕਰਦੀ ਹਾਂ।", romanization: "main tuhadda taapmaan check kardi han.", en: "I will check your temperature.", vi: "Tôi sẽ kiểm tra nhiệt độ của bạn." },
    ],
    keyPhrases: [
      { pa: "ਤਿੰਨ ਦਿਨਾਂ ਤੋਂ", romanization: "tinn dinan ton", en: "for three days", vi: "trong ba ngày nay" },
      { pa: "ਜ਼ਿਆਦਾ ਤਕਲੀਫ਼", romanization: "zyada takleef", en: "more discomfort", vi: "khó chịu hơn" },
    ],
    questions: [
      { q_en: "How long has the patient had a fever?", q_vi: "Bệnh nhân bị sốt bao lâu?", answer_en: "Three days.", answer_vi: "Ba ngày." },
    ],
    likelyConfusion_en: "This is language support only; it is not medical advice.",
    likelyConfusion_vi: "Đây chỉ là hỗ trợ ngôn ngữ; không phải lời khuyên y tế.",
  },
  {
    id: "pa-listen-b1-06-housing-noise",
    level: "B1",
    topic: "housing",
    title_en: "Noise complaint",
    title_vi: "Phàn nàn về tiếng ồn",
    goal_en: "Understand a polite complaint and requested change.",
    goal_vi: "Hiểu lời phàn nàn lịch sự và yêu cầu thay đổi.",
    transcript: [
      { speaker: "Neighbor", pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੱਲ੍ਹ ਰਾਤ ਸੰਗੀਤ ਬਹੁਤ ਉੱਚਾ ਸੀ।", romanization: "maaf karna, kallh raat sangeet bahut uchcha si.", en: "Sorry, last night the music was very loud.", vi: "Xin lỗi, tối qua nhạc rất to." },
      { speaker: "Neighbor", pa: "ਕੀ ਤੁਸੀਂ ਦਸ ਵਜੇ ਤੋਂ ਬਾਅਦ ਆਵਾਜ਼ ਘੱਟ ਰੱਖ ਸਕਦੇ ਹੋ?", romanization: "ki tusin dass vaje ton baad aawaz ghatt rakh sakde ho?", en: "Can you keep the volume lower after ten?", vi: "Bạn có thể để âm lượng nhỏ hơn sau mười giờ không?" },
      { speaker: "Resident", pa: "ਜ਼ਰੂਰ, ਅੱਗੇ ਤੋਂ ਧਿਆਨ ਰੱਖਾਂਗਾ।", romanization: "zaroor, agge ton dhian rakhanga.", en: "Of course, I will be careful from now on.", vi: "Chắc chắn rồi, từ nay tôi sẽ chú ý." },
    ],
    keyPhrases: [
      { pa: "ਆਵਾਜ਼ ਘੱਟ", romanization: "aawaz ghatt", en: "lower volume", vi: "âm lượng nhỏ hơn" },
      { pa: "ਅੱਗੇ ਤੋਂ", romanization: "agge ton", en: "from now on", vi: "từ nay" },
    ],
    questions: [
      { q_en: "After what time should the volume be lower?", q_vi: "Sau mấy giờ nên nhỏ tiếng hơn?", answer_en: "After ten o'clock.", answer_vi: "Sau mười giờ." },
    ],
    likelyConfusion_en: "ਉੱਚਾ is 'high/loud' for volume; ਲੰਮਾ is 'long/tall'.",
    likelyConfusion_vi: "ਉੱਚਾ là cao/to cho âm lượng; ਲੰਮਾ là dài/cao về chiều dài.",
  },
  {
    id: "pa-listen-b1-07-transit-delay",
    level: "B1",
    topic: "transit",
    title_en: "Train delay announcement",
    title_vi: "Thông báo tàu trễ",
    goal_en: "Catch delay length and platform.",
    goal_vi: "Nghe ra thời gian trễ và sân ga.",
    transcript: [
      { speaker: "Announcement", pa: "ਧਿਆਨ ਦਿਓ, ਲੁਧਿਆਣਾ ਵਾਲੀ ਰੇਲ ਵੀਹ ਮਿੰਟ ਲੇਟ ਹੈ।", romanization: "dhian dio, Ludhiana wali rail vih mint late hai.", en: "Attention, the train to Ludhiana is twenty minutes late.", vi: "Chú ý, tàu đi Ludhiana trễ hai mươi phút." },
      { speaker: "Announcement", pa: "ਯਾਤਰੀ ਪਲੇਟਫਾਰਮ ਨੰਬਰ ਦੋ ਤੇ ਉਡੀਕ ਕਰਨ।", romanization: "yatri platform number do te udeek karan.", en: "Passengers should wait on platform number two.", vi: "Hành khách vui lòng chờ ở sân ga số hai." },
    ],
    keyPhrases: [
      { pa: "ਧਿਆਨ ਦਿਓ", romanization: "dhian dio", en: "attention", vi: "chú ý" },
      { pa: "ਵੀਹ ਮਿੰਟ ਲੇਟ", romanization: "vih mint late", en: "twenty minutes late", vi: "trễ hai mươi phút" },
    ],
    questions: [
      { q_en: "Which platform should passengers use?", q_vi: "Hành khách nên dùng sân ga nào?", answer_en: "Platform two.", answer_vi: "Sân ga số hai." },
    ],
    likelyConfusion_en: "ਵਾਲੀ links the destination to the train: 'the train going to Ludhiana'.",
    likelyConfusion_vi: "ਵਾਲੀ nối điểm đến với tàu: 'tàu đi Ludhiana'.",
  },
  {
    id: "pa-listen-b1-08-public-office-token",
    level: "B1",
    topic: "public_service",
    title_en: "Token at a public office",
    title_vi: "Số thứ tự ở cơ quan công",
    goal_en: "Follow the queue instruction.",
    goal_vi: "Theo dõi hướng dẫn xếp hàng.",
    transcript: [
      { speaker: "Clerk", pa: "ਪਹਿਲਾਂ ਮਸ਼ੀਨ ਤੋਂ ਟੋਕਨ ਲਓ।", romanization: "pahilan machine ton token lao.", en: "First take a token from the machine.", vi: "Trước tiên lấy số từ máy." },
      { speaker: "Clerk", pa: "ਜਦੋਂ ਤੁਹਾਡਾ ਨੰਬਰ ਆਵੇ, ਕਾਊਂਟਰ ਤਿੰਨ ਤੇ ਆਓ।", romanization: "jadon tuhadda number aave, counter tinn te aao.", en: "When your number comes, come to counter three.", vi: "Khi đến số của bạn, hãy đến quầy ba." },
    ],
    keyPhrases: [
      { pa: "ਟੋਕਨ ਲਓ", romanization: "token lao", en: "take a token", vi: "lấy số thứ tự" },
      { pa: "ਨੰਬਰ ਆਵੇ", romanization: "number aave", en: "number comes up", vi: "đến lượt số" },
    ],
    questions: [
      { q_en: "Which counter should the visitor go to?", q_vi: "Người khách nên đến quầy nào?", answer_en: "Counter three.", answer_vi: "Quầy ba." },
    ],
    likelyConfusion_en: "ਲਓ is a polite imperative; it is common in service instructions.",
    likelyConfusion_vi: "ਲਓ là mệnh lệnh lịch sự, thường gặp trong hướng dẫn dịch vụ.",
  },
  {
    id: "pa-listen-b2-01-work-feedback",
    level: "B2",
    topic: "workplace",
    title_en: "Balanced feedback",
    title_vi: "Phản hồi cân bằng",
    goal_en: "Separate praise, concern, and next step.",
    goal_vi: "Tách lời khen, mối lo và bước tiếp theo.",
    transcript: [
      { speaker: "Lead", pa: "ਤੁਹਾਡੀ ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ ਸਾਫ਼ ਸੀ, ਖ਼ਾਸ ਕਰਕੇ ਉਦਾਹਰਨਾਂ।", romanization: "tuhadi presentation saaf si, khas karke udaharanan.", en: "Your presentation was clear, especially the examples.", vi: "Bài trình bày của bạn rõ ràng, đặc biệt là các ví dụ." },
      { speaker: "Lead", pa: "ਪਰ ਅੰਕੜਿਆਂ ਦਾ ਸਰੋਤ ਹੋਰ ਸਪਸ਼ਟ ਲਿਖੋ।", romanization: "par ankrian da srot hor spasht likho.", en: "But write the source of the figures more clearly.", vi: "Nhưng hãy ghi nguồn số liệu rõ hơn." },
      { speaker: "Lead", pa: "ਸੋਧਿਆ ਹੋਇਆ ਵਰਜਨ ਸੋਮਵਾਰ ਤੱਕ ਭੇਜ ਦਿਓ।", romanization: "sodhia hoia version somvaar takk bhej dio.", en: "Send the revised version by Monday.", vi: "Gửi phiên bản đã sửa trước thứ Hai." },
    ],
    keyPhrases: [
      { pa: "ਖ਼ਾਸ ਕਰਕੇ", romanization: "khas karke", en: "especially", vi: "đặc biệt là" },
      { pa: "ਸੋਧਿਆ ਹੋਇਆ", romanization: "sodhia hoia", en: "revised", vi: "đã chỉnh sửa" },
    ],
    questions: [
      { q_en: "What needs to be clearer?", q_vi: "Điều gì cần rõ hơn?", answer_en: "The source of the figures.", answer_vi: "Nguồn số liệu." },
    ],
    likelyConfusion_en: "ਸਾਫ਼ can mean clean or clear; here it evaluates communication.",
    likelyConfusion_vi: "ਸਾਫ਼ có thể nghĩa là sạch hoặc rõ; ở đây nói về cách truyền đạt.",
  },
  {
    id: "pa-listen-b2-02-housing-lease",
    level: "B2",
    topic: "housing",
    title_en: "Lease renewal",
    title_vi: "Gia hạn hợp đồng thuê",
    goal_en: "Track conditions for renewing a lease.",
    goal_vi: "Theo dõi điều kiện gia hạn hợp đồng thuê.",
    transcript: [
      { speaker: "Landlord", pa: "ਲੀਜ਼ ਅਗਲੇ ਮਹੀਨੇ ਖ਼ਤਮ ਹੋ ਰਹੀ ਹੈ।", romanization: "lease agle mahine khatam ho rahi hai.", en: "The lease is ending next month.", vi: "Hợp đồng thuê hết hạn vào tháng tới." },
      { speaker: "Tenant", pa: "ਮੈਂ ਨਵੀਂ ਲੀਜ਼ ਸਾਈਨ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ, ਜੇ ਕਿਰਾਇਆ ਬਹੁਤ ਨਾ ਵਧੇ।", romanization: "main navi lease sign karna chahunda han, je kiraya bahut na vadhe.", en: "I want to sign a new lease if the rent does not increase too much.", vi: "Tôi muốn ký hợp đồng mới nếu tiền thuê không tăng quá nhiều." },
      { speaker: "Landlord", pa: "ਕਿਰਾਇਆ ਪੰਜਾਹ ਡਾਲਰ ਵਧੇਗਾ।", romanization: "kiraya panjah dollar vadhega.", en: "The rent will increase by fifty dollars.", vi: "Tiền thuê sẽ tăng năm mươi đô." },
    ],
    keyPhrases: [
      { pa: "ਖ਼ਤਮ ਹੋ ਰਹੀ ਹੈ", romanization: "khatam ho rahi hai", en: "is ending", vi: "đang kết thúc/sắp hết hạn" },
      { pa: "ਵਧੇਗਾ", romanization: "vadhega", en: "will increase", vi: "sẽ tăng" },
    ],
    questions: [
      { q_en: "How much will rent increase?", q_vi: "Tiền thuê tăng bao nhiêu?", answer_en: "Fifty dollars.", answer_vi: "Năm mươi đô." },
    ],
    likelyConfusion_en: "ਜੇ introduces a condition: 'if'.",
    likelyConfusion_vi: "ਜੇ mở đầu điều kiện: 'nếu'.",
  },
  {
    id: "pa-listen-b2-03-clinic-followup",
    level: "B2",
    topic: "health",
    title_en: "Follow-up instructions",
    title_vi: "Hướng dẫn tái khám",
    goal_en: "Catch conditions for returning to the clinic.",
    goal_vi: "Nghe điều kiện cần quay lại phòng khám.",
    transcript: [
      { speaker: "Doctor", pa: "ਜੇ ਦਰਦ ਘੱਟ ਨਾ ਹੋਵੇ ਜਾਂ ਬੁਖਾਰ ਵਧੇ, ਤਾਂ ਕਲੀਨਿਕ ਨੂੰ ਫ਼ੋਨ ਕਰੋ।", romanization: "je dard ghatt na hove jaan bukhar vadhe, tan clinic nu phone karo.", en: "If the pain does not decrease or the fever rises, call the clinic.", vi: "Nếu cơn đau không giảm hoặc sốt tăng, hãy gọi phòng khám." },
      { speaker: "Doctor", pa: "ਨਹੀਂ ਤਾਂ ਤਿੰਨ ਦਿਨ ਬਾਅਦ ਫਾਲੋ-ਅੱਪ ਲਈ ਆਓ।", romanization: "nahin tan tinn din baad follow-up lai aao.", en: "Otherwise come for a follow-up after three days.", vi: "Nếu không thì sau ba ngày đến tái khám." },
    ],
    keyPhrases: [
      { pa: "ਨਹੀਂ ਤਾਂ", romanization: "nahin tan", en: "otherwise", vi: "nếu không thì" },
      { pa: "ਤਿੰਨ ਦਿਨ ਬਾਅਦ", romanization: "tinn din baad", en: "after three days", vi: "sau ba ngày" },
    ],
    questions: [
      { q_en: "When is the routine follow-up?", q_vi: "Tái khám thông thường khi nào?", answer_en: "After three days.", answer_vi: "Sau ba ngày." },
    ],
    likelyConfusion_en: "Language support only: follow clinician instructions for actual care.",
    likelyConfusion_vi: "Chỉ hỗ trợ ngôn ngữ: hãy làm theo hướng dẫn của chuyên gia y tế khi chăm sóc thật.",
  },
  {
    id: "pa-listen-b2-04-community-announcement",
    level: "B2",
    topic: "public_service",
    title_en: "Community center announcement",
    title_vi: "Thông báo trung tâm cộng đồng",
    goal_en: "Identify event time, purpose, and registration rule.",
    goal_vi: "Nhận ra giờ, mục đích sự kiện và quy định đăng ký.",
    transcript: [
      { speaker: "Announcement", pa: "ਸ਼ਨੀਵਾਰ ਨੂੰ ਕਮਿਊਨਿਟੀ ਸੈਂਟਰ ਵਿੱਚ ਨੌਕਰੀ ਮੇਲਾ ਹੋਵੇਗਾ।", romanization: "shanivaar nu community center vich naukri mela hovega.", en: "On Saturday there will be a job fair at the community center.", vi: "Thứ Bảy sẽ có hội chợ việc làm ở trung tâm cộng đồng." },
      { speaker: "Announcement", pa: "ਸ਼ਾਮਲ ਹੋਣ ਲਈ ਆਨਲਾਈਨ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਲਾਜ਼ਮੀ ਹੈ।", romanization: "shamil hon lai online registration lazmi hai.", en: "Online registration is required to participate.", vi: "Cần đăng ký trực tuyến để tham gia." },
    ],
    keyPhrases: [
      { pa: "ਨੌਕਰੀ ਮੇਲਾ", romanization: "naukri mela", en: "job fair", vi: "hội chợ việc làm" },
      { pa: "ਲਾਜ਼ਮੀ ਹੈ", romanization: "lazmi hai", en: "is required", vi: "là bắt buộc" },
    ],
    questions: [
      { q_en: "What is required to participate?", q_vi: "Cần gì để tham gia?", answer_en: "Online registration.", answer_vi: "Đăng ký trực tuyến." },
    ],
    likelyConfusion_en: "ਮੇਲਾ can mean fair/festival; context makes it a job fair.",
    likelyConfusion_vi: "ਮੇਲਾ có thể là hội chợ/lễ hội; ngữ cảnh cho biết đây là hội chợ việc làm.",
  },
  {
    id: "pa-listen-b2-05-school-policy",
    level: "B2",
    topic: "school",
    title_en: "School phone policy",
    title_vi: "Quy định điện thoại ở trường",
    goal_en: "Understand rule, exception, and consequence.",
    goal_vi: "Hiểu quy định, ngoại lệ và hậu quả.",
    transcript: [
      { speaker: "Principal", pa: "ਕਲਾਸ ਦੌਰਾਨ ਫ਼ੋਨ ਬੈਗ ਵਿੱਚ ਰਹਿਣੇ ਚਾਹੀਦੇ ਹਨ।", romanization: "class dauran phone bag vich rahine chahide han.", en: "During class, phones should remain in bags.", vi: "Trong giờ học, điện thoại nên để trong cặp." },
      { speaker: "Principal", pa: "ਜੇ ਐਮਰਜੈਂਸੀ ਹੋਵੇ, ਵਿਦਿਆਰਥੀ ਅਧਿਆਪਕ ਤੋਂ ਇਜਾਜ਼ਤ ਲੈ ਸਕਦੇ ਹਨ।", romanization: "je emergency hove, vidyarthi adhiapak ton ijazat lai sakde han.", en: "If there is an emergency, students can get permission from the teacher.", vi: "Nếu có việc khẩn cấp, học sinh có thể xin phép giáo viên." },
    ],
    keyPhrases: [
      { pa: "ਦੌਰਾਨ", romanization: "dauran", en: "during", vi: "trong khi/trong suốt" },
      { pa: "ਇਜਾਜ਼ਤ", romanization: "ijazat", en: "permission", vi: "sự cho phép" },
    ],
    questions: [
      { q_en: "Where should phones stay during class?", q_vi: "Trong giờ học điện thoại nên ở đâu?", answer_en: "In bags.", answer_vi: "Trong cặp." },
    ],
    likelyConfusion_en: "ਚਾਹੀਦੇ ਹਨ expresses should/ought to, not a physical need.",
    likelyConfusion_vi: "ਚਾਹੀਦੇ ਹਨ diễn đạt 'nên/phải', không phải nhu cầu vật lý.",
  },
  {
    id: "pa-listen-c1-01-meeting-priorities",
    level: "C1",
    topic: "workplace",
    title_en: "Negotiating priorities",
    title_vi: "Thương lượng ưu tiên",
    goal_en: "Infer which task is deprioritized and why.",
    goal_vi: "Suy ra nhiệm vụ nào bị giảm ưu tiên và vì sao.",
    transcript: [
      { speaker: "Lead", pa: "ਜੇ ਅਸੀਂ ਦੋਵੇਂ ਪ੍ਰੋਜੈਕਟ ਇਕੱਠੇ ਚਲਾਏ, ਗੁਣਵੱਤਾ ਤੇ ਅਸਰ ਪਵੇਗਾ।", romanization: "je asin dove project ikatthe chalaye, gunvatta te asar pavega.", en: "If we run both projects together, quality will be affected.", vi: "Nếu chạy cả hai dự án cùng lúc, chất lượng sẽ bị ảnh hưởng." },
      { speaker: "Manager", pa: "ਫਿਰ ਪੁਰਾਣਾ ਅੱਪਡੇਟ ਰੋਕ ਕੇ ਗਾਹਕ ਵਾਲੇ ਕੰਮ ਨੂੰ ਪਹਿਲ ਦਿਓ।", romanization: "phir purana update rok ke gahak wale kamm nu pahal dio.", en: "Then pause the old update and prioritize the client work.", vi: "Vậy hãy tạm dừng bản cập nhật cũ và ưu tiên việc của khách hàng." },
    ],
    keyPhrases: [
      { pa: "ਅਸਰ ਪਵੇਗਾ", romanization: "asar pavega", en: "will have an effect", vi: "sẽ ảnh hưởng" },
      { pa: "ਪਹਿਲ ਦਿਓ", romanization: "pahal dio", en: "give priority", vi: "ưu tiên" },
    ],
    questions: [
      { q_en: "Which task is paused?", q_vi: "Nhiệm vụ nào bị tạm dừng?", answer_en: "The old update.", answer_vi: "Bản cập nhật cũ." },
    ],
    likelyConfusion_en: "ਗਾਹਕ ਵਾਲਾ ਕੰਮ means the client-related work, not work owned by the client.",
    likelyConfusion_vi: "ਗਾਹਕ ਵਾਲਾ ਕੰਮ nghĩa là việc liên quan đến khách hàng, không nhất thiết là việc do khách hàng sở hữu.",
  },
  {
    id: "pa-listen-c1-02-public-complaint",
    level: "C1",
    topic: "public_service",
    title_en: "Formal service complaint",
    title_vi: "Khiếu nại dịch vụ trang trọng",
    goal_en: "Identify the complaint, evidence, and requested remedy.",
    goal_vi: "Xác định khiếu nại, bằng chứng và cách xử lý được yêu cầu.",
    transcript: [
      { speaker: "Resident", pa: "ਮੈਂ ਪਿਛਲੇ ਮਹੀਨੇ ਵੀ ਇਹੀ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰਵਾਈ ਸੀ।", romanization: "main pichhle mahine vi ehi shikayat daraj karvai si.", en: "I filed the same complaint last month as well.", vi: "Tháng trước tôi cũng đã nộp cùng khiếu nại này." },
      { speaker: "Resident", pa: "ਮੇਰੇ ਕੋਲ ਰਸੀਦ ਅਤੇ ਤਸਵੀਰਾਂ ਹਨ, ਇਸ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਕੇਸ ਦੁਬਾਰਾ ਖੋਲ੍ਹੋ।", romanization: "mere kol raseed ate tasviran han, is lai kirpa karke case dubara kholo.", en: "I have the receipt and photos, so please reopen the case.", vi: "Tôi có biên nhận và hình ảnh, nên vui lòng mở lại hồ sơ." },
    ],
    keyPhrases: [
      { pa: "ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰਵਾਈ", romanization: "shikayat daraj karvai", en: "filed a complaint", vi: "đã nộp khiếu nại" },
      { pa: "ਦੁਬਾਰਾ ਖੋਲ੍ਹੋ", romanization: "dubara kholo", en: "reopen", vi: "mở lại" },
    ],
    questions: [
      { q_en: "What evidence does the resident have?", q_vi: "Cư dân có bằng chứng gì?", answer_en: "A receipt and photos.", answer_vi: "Biên nhận và hình ảnh." },
    ],
    likelyConfusion_en: "ਦਰਜ ਕਰਵਾਈ implies causing something to be officially registered.",
    likelyConfusion_vi: "ਦਰਜ ਕਰਵਾਈ hàm ý làm cho việc gì được ghi nhận chính thức.",
  },
  {
    id: "pa-listen-c1-03-academic-advice",
    level: "C1",
    topic: "school",
    title_en: "Academic advising",
    title_vi: "Tư vấn học thuật",
    goal_en: "Track prerequisite and recommendation language.",
    goal_vi: "Theo dõi điều kiện tiên quyết và lời khuyên.",
    transcript: [
      { speaker: "Advisor", pa: "ਇਸ ਕੋਰਸ ਲਈ ਪਹਿਲਾਂ ਰਿਸਰਚ ਮੈਥਡਜ਼ ਪਾਸ ਕਰਨਾ ਜ਼ਰੂਰੀ ਹੈ।", romanization: "is course lai pahilan research methods pass karna zaroori hai.", en: "For this course, passing Research Methods first is necessary.", vi: "Để học môn này, trước tiên cần qua môn Phương pháp nghiên cứu." },
      { speaker: "Advisor", pa: "ਮੇਰੀ ਸਲਾਹ ਹੈ ਕਿ ਤੁਸੀਂ ਅਗਲੇ ਸੈਮੈਸਟਰ ਵਿੱਚ ਅਰਜ਼ੀ ਦਿਓ।", romanization: "meri salah hai ki tusin agle semester vich arzi dio.", en: "My advice is that you apply next semester.", vi: "Tôi khuyên bạn nộp đơn vào học kỳ tới." },
    ],
    keyPhrases: [
      { pa: "ਜ਼ਰੂਰੀ ਹੈ", romanization: "zaroori hai", en: "is necessary", vi: "là cần thiết" },
      { pa: "ਮੇਰੀ ਸਲਾਹ ਹੈ", romanization: "meri salah hai", en: "my advice is", vi: "lời khuyên của tôi là" },
    ],
    questions: [
      { q_en: "When should the student apply?", q_vi: "Sinh viên nên nộp đơn khi nào?", answer_en: "Next semester.", answer_vi: "Học kỳ tới." },
    ],
    likelyConfusion_en: "ਅਰਜ਼ੀ ਦਿਓ means submit an application, not give a physical object.",
    likelyConfusion_vi: "ਅਰਜ਼ੀ ਦਿਓ nghĩa là nộp đơn, không phải đưa một đồ vật cụ thể.",
  },
  {
    id: "pa-listen-c1-04-health-insurance",
    level: "C1",
    topic: "health",
    title_en: "Insurance coverage question",
    title_vi: "Hỏi về bảo hiểm",
    goal_en: "Understand coverage limits and next steps.",
    goal_vi: "Hiểu giới hạn bảo hiểm và bước tiếp theo.",
    transcript: [
      { speaker: "Patient", pa: "ਕੀ ਇਹ ਟੈਸਟ ਮੇਰੀ ਇੰਸ਼ੋਰੈਂਸ ਵਿੱਚ ਕਵਰ ਹੁੰਦਾ ਹੈ ਜਾਂ ਪਹਿਲਾਂ ਮਨਜ਼ੂਰੀ ਚਾਹੀਦੀ ਹੈ?", romanization: "ki eh test meri insurance vich cover hunda hai jaan pahilan manzoori chahidi hai?", en: "Is this test covered by my insurance, or is prior approval needed?", vi: "Xét nghiệm này được bảo hiểm chi trả hay cần phê duyệt trước?" },
      { speaker: "Clerk", pa: "ਅਕਸਰ ਮਨਜ਼ੂਰੀ ਲੋੜੀਂਦੀ ਹੁੰਦੀ ਹੈ; ਅਸੀਂ ਫਾਰਮ ਅੱਜ ਭੇਜ ਦਿਆਂਗੇ।", romanization: "aksar manzoori lorindi hundi hai; asin form ajj bhej diange.", en: "Approval is usually required; we will send the form today.", vi: "Thường cần phê duyệt; chúng tôi sẽ gửi mẫu hôm nay." },
    ],
    keyPhrases: [
      { pa: "ਪਹਿਲਾਂ ਮਨਜ਼ੂਰੀ", romanization: "pahilan manzoori", en: "prior approval", vi: "phê duyệt trước" },
      { pa: "ਲੋੜੀਂਦੀ ਹੁੰਦੀ ਹੈ", romanization: "lorindi hundi hai", en: "is usually required", vi: "thường là cần thiết" },
    ],
    questions: [
      { q_en: "What will the office send today?", q_vi: "Văn phòng sẽ gửi gì hôm nay?", answer_en: "The form.", answer_vi: "Mẫu đơn." },
    ],
    likelyConfusion_en: "This script supports language comprehension only, not insurance or medical advice.",
    likelyConfusion_vi: "Bài này chỉ hỗ trợ nghe hiểu ngôn ngữ, không phải tư vấn bảo hiểm hay y tế.",
  },
  {
    id: "pa-listen-c1-05-transit-disruption",
    level: "C1",
    topic: "transit",
    title_en: "Service disruption",
    title_vi: "Gián đoạn dịch vụ",
    goal_en: "Hear cause, alternative, and compensation detail.",
    goal_vi: "Nghe nguyên nhân, phương án thay thế và chi tiết bồi hoàn.",
    transcript: [
      { speaker: "Announcement", pa: "ਤਕਨੀਕੀ ਖ਼ਰਾਬੀ ਕਰਕੇ ਮੈਟਰੋ ਸੇਵਾ ਅਗਲੇ ਚਾਲੀ ਮਿੰਟ ਬੰਦ ਰਹੇਗੀ।", romanization: "takniki kharabi karke metro seva agle chali mint band rahegi.", en: "Due to a technical fault, metro service will remain closed for the next forty minutes.", vi: "Do lỗi kỹ thuật, dịch vụ metro sẽ ngừng trong bốn mươi phút tới." },
      { speaker: "Announcement", pa: "ਟਿਕਟ ਵਾਲੇ ਯਾਤਰੀ ਬਦਲਵੀਂ ਬੱਸ ਮੁਫ਼ਤ ਵਰਤ ਸਕਦੇ ਹਨ।", romanization: "ticket wale yatri badalvin bass muft vart sakde han.", en: "Passengers with tickets can use the replacement bus for free.", vi: "Hành khách có vé có thể dùng xe buýt thay thế miễn phí." },
    ],
    keyPhrases: [
      { pa: "ਤਕਨੀਕੀ ਖ਼ਰਾਬੀ", romanization: "takniki kharabi", en: "technical fault", vi: "lỗi kỹ thuật" },
      { pa: "ਬਦਲਵੀਂ ਬੱਸ", romanization: "badalvin bass", en: "replacement bus", vi: "xe buýt thay thế" },
    ],
    questions: [
      { q_en: "How long will the metro be closed?", q_vi: "Metro sẽ ngừng bao lâu?", answer_en: "Forty minutes.", answer_vi: "Bốn mươi phút." },
    ],
    likelyConfusion_en: "ਵਾਲੇ marks passengers who have tickets: 'ticket-holding passengers'.",
    likelyConfusion_vi: "ਵਾਲੇ đánh dấu nhóm có vé: 'hành khách có vé'.",
  },
  {
    id: "pa-listen-c2-01-policy-meeting",
    level: "C2",
    topic: "workplace",
    title_en: "Policy trade-off",
    title_vi: "Đánh đổi trong chính sách",
    goal_en: "Infer the speaker's cautious agreement and reservation.",
    goal_vi: "Suy ra sự đồng ý thận trọng và điều còn dè dặt.",
    transcript: [
      { speaker: "Director", pa: "ਸਿਧਾਂਤਕ ਤੌਰ ਤੇ ਮੈਂ ਪ੍ਰਸਤਾਵ ਨਾਲ ਸਹਿਮਤ ਹਾਂ, ਪਰ ਲਾਗੂ ਕਰਨ ਦੀ ਸਮਾਂ-ਰੇਖਾ ਹਕੀਕਤੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।", romanization: "sidhantak taur te main prastav naal sahimat han, par lagu karan di sama-rekha hakikati honi chahidi hai.", en: "In principle I agree with the proposal, but the implementation timeline should be realistic.", vi: "Về nguyên tắc tôi đồng ý với đề xuất, nhưng lộ trình triển khai phải thực tế." },
      { speaker: "Director", pa: "ਜੇ ਸਟਾਫ਼ ਨੂੰ ਸਿਖਲਾਈ ਨਾ ਮਿਲੀ, ਨੀਤੀ ਕਾਗਜ਼ਾਂ ਤੱਕ ਹੀ ਰਹਿ ਜਾਵੇਗੀ।", romanization: "je staff nu sikhlai na mili, niti kagazan takk hi reh javegi.", en: "If staff do not receive training, the policy will remain only on paper.", vi: "Nếu nhân viên không được đào tạo, chính sách sẽ chỉ nằm trên giấy." },
    ],
    keyPhrases: [
      { pa: "ਸਿਧਾਂਤਕ ਤੌਰ ਤੇ", romanization: "sidhantak taur te", en: "in principle", vi: "về nguyên tắc" },
      { pa: "ਕਾਗਜ਼ਾਂ ਤੱਕ", romanization: "kagazan takk", en: "only on paper", vi: "chỉ trên giấy" },
    ],
    questions: [
      { q_en: "What reservation does the director express?", q_vi: "Giám đốc còn dè dặt điều gì?", answer_en: "The implementation timeline and staff training.", answer_vi: "Lộ trình triển khai và đào tạo nhân viên." },
    ],
    likelyConfusion_en: "ਸਹਿਮਤ ਹਾਂ signals agreement, but ਪਰ introduces the key reservation.",
    likelyConfusion_vi: "ਸਹਿਮਤ ਹਾਂ thể hiện đồng ý, nhưng ਪਰ mở ra điểm dè dặt chính.",
  },
  {
    id: "pa-listen-c2-02-public-hearing",
    level: "C2",
    topic: "public_service",
    title_en: "Public hearing comment",
    title_vi: "Phát biểu tại buổi tham vấn công",
    goal_en: "Distinguish concession, concern, and requested safeguard.",
    goal_vi: "Phân biệt nhượng bộ, mối lo và biện pháp bảo vệ được yêu cầu.",
    transcript: [
      { speaker: "Resident", pa: "ਅਸੀਂ ਵਿਕਾਸ ਦੇ ਵਿਰੋਧੀ ਨਹੀਂ, ਪਰ ਕਿਰਾਏਦਾਰਾਂ ਦੀ ਸੁਰੱਖਿਆ ਬਿਨਾਂ ਇਹ ਯੋਜਨਾ ਅਧੂਰੀ ਹੈ।", romanization: "asin vikas de virodhi nahin, par kirayedaran di surakhia bina eh yojna adhuri hai.", en: "We are not against development, but without tenant protections this plan is incomplete.", vi: "Chúng tôi không phản đối phát triển, nhưng thiếu bảo vệ người thuê thì kế hoạch này chưa đầy đủ." },
      { speaker: "Resident", pa: "ਕਮੇਟੀ ਨੂੰ ਬੇਦਖ਼ਲੀ ਰੋਕਣ ਲਈ ਸਪਸ਼ਟ ਨਿਯਮ ਜੋੜਣੇ ਚਾਹੀਦੇ ਹਨ।", romanization: "committee nu bedakhli rokan lai spasht niyam jodne chahide han.", en: "The committee should add clear rules to prevent eviction.", vi: "Ủy ban nên thêm quy định rõ ràng để ngăn trục xuất khỏi nhà thuê." },
    ],
    keyPhrases: [
      { pa: "ਵਿਰੋਧੀ ਨਹੀਂ", romanization: "virodhi nahin", en: "not opposed", vi: "không phản đối" },
      { pa: "ਬੇਦਖ਼ਲੀ ਰੋਕਣ ਲਈ", romanization: "bedakhli rokan lai", en: "to prevent eviction", vi: "để ngăn việc đuổi khỏi nhà" },
    ],
    questions: [
      { q_en: "What safeguard does the speaker request?", q_vi: "Người nói yêu cầu biện pháp bảo vệ nào?", answer_en: "Clear rules to prevent eviction.", answer_vi: "Quy định rõ ràng để ngăn trục xuất khỏi nhà thuê." },
    ],
    likelyConfusion_en: "Legal/public-office language here is for comprehension practice only, not legal advice.",
    likelyConfusion_vi: "Ngôn ngữ pháp lý/cơ quan công ở đây chỉ để luyện hiểu, không phải tư vấn pháp lý.",
  },
  {
    id: "pa-listen-c2-03-research-seminar",
    level: "C2",
    topic: "school",
    title_en: "Research seminar critique",
    title_vi: "Góp ý trong seminar nghiên cứu",
    goal_en: "Understand nuanced academic criticism.",
    goal_vi: "Hiểu góp ý học thuật tinh tế.",
    transcript: [
      { speaker: "Professor", pa: "ਦਲੀਲ ਦਿਲਚਸਪ ਹੈ, ਪਰ ਡਾਟਾ ਅਤੇ ਨਤੀਜੇ ਵਿਚਕਾਰ ਕਾਰਨ-ਸੰਬੰਧ ਹਾਲੇ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ।", romanization: "dalil dilchasp hai, par data ate natije vichkar karan-sambandh hale sabat nahin hunda.", en: "The argument is interesting, but a causal link between the data and conclusion is not yet proven.", vi: "Lập luận thú vị, nhưng quan hệ nhân quả giữa dữ liệu và kết luận chưa được chứng minh." },
      { speaker: "Professor", pa: "ਜੇ ਤੁਸੀਂ ਵਿਕਲਪੀ ਵਿਆਖਿਆਵਾਂ ਨੂੰ ਵੀ ਵੇਖੋ, ਪੇਪਰ ਮਜ਼ਬੂਤ ਹੋ ਜਾਵੇਗਾ।", romanization: "je tusin vikalpi viakhiawan nu vi vekho, paper mazboot ho javega.", en: "If you also examine alternative explanations, the paper will become stronger.", vi: "Nếu bạn cũng xem xét các cách giải thích thay thế, bài viết sẽ vững hơn." },
    ],
    keyPhrases: [
      { pa: "ਕਾਰਨ-ਸੰਬੰਧ", romanization: "karan-sambandh", en: "causal link", vi: "quan hệ nhân quả" },
      { pa: "ਵਿਕਲਪੀ ਵਿਆਖਿਆਵਾਂ", romanization: "vikalpi viakhiawan", en: "alternative explanations", vi: "giải thích thay thế" },
    ],
    questions: [
      { q_en: "What would strengthen the paper?", q_vi: "Điều gì sẽ làm bài viết vững hơn?", answer_en: "Examining alternative explanations.", answer_vi: "Xem xét các cách giải thích thay thế." },
    ],
    likelyConfusion_en: "ਦਿਲਚਸਪ is positive, but the main critique comes after ਪਰ.",
    likelyConfusion_vi: "ਦਿਲਚਸਪ là tích cực, nhưng góp ý chính xuất hiện sau ਪਰ.",
  },
  {
    id: "pa-listen-c2-04-ethics-complaint",
    level: "C2",
    topic: "public_service",
    title_en: "Ethics complaint intake",
    title_vi: "Tiếp nhận khiếu nại đạo đức",
    goal_en: "Follow evidence standards and procedural limits.",
    goal_vi: "Theo dõi chuẩn bằng chứng và giới hạn thủ tục.",
    transcript: [
      { speaker: "Officer", pa: "ਤੁਹਾਡਾ ਬਿਆਨ ਦਰਜ ਕੀਤਾ ਜਾਵੇਗਾ, ਪਰ ਜਾਂਚ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਲਿਖਤੀ ਸਬੂਤ ਲੋੜੀਂਦਾ ਹੈ।", romanization: "tuhadda bian daraj kita javega, par janch shuru karan lai likhti saboot lorinda hai.", en: "Your statement will be recorded, but written evidence is needed to start an investigation.", vi: "Lời trình bày của bạn sẽ được ghi nhận, nhưng cần bằng chứng bằng văn bản để bắt đầu điều tra." },
      { speaker: "Officer", pa: "ਅਸੀਂ ਕਾਨੂੰਨੀ ਸਲਾਹ ਨਹੀਂ ਦੇ ਸਕਦੇ; ਲੋੜ ਪਏ ਤਾਂ ਵਕੀਲ ਨਾਲ ਗੱਲ ਕਰੋ।", romanization: "asin kanuni salah nahin de sakde; lor pave tan vakil naal gall karo.", en: "We cannot give legal advice; if needed, speak with a lawyer.", vi: "Chúng tôi không thể tư vấn pháp lý; nếu cần, hãy nói chuyện với luật sư." },
    ],
    keyPhrases: [
      { pa: "ਲਿਖਤੀ ਸਬੂਤ", romanization: "likhti saboot", en: "written evidence", vi: "bằng chứng bằng văn bản" },
      { pa: "ਕਾਨੂੰਨੀ ਸਲਾਹ", romanization: "kanuni salah", en: "legal advice", vi: "tư vấn pháp lý" },
    ],
    questions: [
      { q_en: "What is needed to start an investigation?", q_vi: "Cần gì để bắt đầu điều tra?", answer_en: "Written evidence.", answer_vi: "Bằng chứng bằng văn bản." },
    ],
    likelyConfusion_en: "This is language support only; legal interpretation belongs to qualified professionals.",
    likelyConfusion_vi: "Đây chỉ là hỗ trợ ngôn ngữ; diễn giải pháp lý thuộc về chuyên gia đủ chuyên môn.",
  },
  {
    id: "pa-listen-c2-05-medical-consent",
    level: "C2",
    topic: "health",
    title_en: "Consent discussion",
    title_vi: "Trao đổi về đồng thuận điều trị",
    goal_en: "Recognize risk, alternative, and consent language.",
    goal_vi: "Nhận ra rủi ro, lựa chọn thay thế và ngôn ngữ đồng thuận.",
    transcript: [
      { speaker: "Clinician", pa: "ਇਸ ਪ੍ਰਕਿਰਿਆ ਦਾ ਫ਼ਾਇਦਾ ਜਲਦੀ ਨਤੀਜਾ ਹੈ, ਪਰ ਥੋੜ੍ਹਾ ਖੂਨ ਨਿਕਲਣ ਦਾ ਖ਼ਤਰਾ ਰਹਿੰਦਾ ਹੈ।", romanization: "is prakiria da faida jaldi natija hai, par thora khoon niklan da khatra rahinda hai.", en: "The benefit of this procedure is a quick result, but there remains a small risk of bleeding.", vi: "Lợi ích của thủ thuật này là có kết quả nhanh, nhưng vẫn có nguy cơ chảy máu nhẹ." },
      { speaker: "Clinician", pa: "ਤੁਸੀਂ ਇਨਕਾਰ ਵੀ ਕਰ ਸਕਦੇ ਹੋ ਜਾਂ ਹੋਰ ਵਿਕਲਪਾਂ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।", romanization: "tusin inkar vi kar sakde ho jaan hor vikalpan bare puchh sakde ho.", en: "You can also refuse or ask about other options.", vi: "Bạn cũng có thể từ chối hoặc hỏi về các lựa chọn khác." },
    ],
    keyPhrases: [
      { pa: "ਖ਼ਤਰਾ ਰਹਿੰਦਾ ਹੈ", romanization: "khatra rahinda hai", en: "risk remains", vi: "vẫn có rủi ro" },
      { pa: "ਇਨਕਾਰ ਕਰ ਸਕਦੇ ਹੋ", romanization: "inkar kar sakde ho", en: "can refuse", vi: "có thể từ chối" },
    ],
    questions: [
      { q_en: "What alternative right is mentioned?", q_vi: "Quyền lựa chọn nào được nhắc đến?", answer_en: "The patient can refuse or ask about other options.", answer_vi: "Bệnh nhân có thể từ chối hoặc hỏi về lựa chọn khác." },
    ],
    likelyConfusion_en: "Medical content is language practice only and not a substitute for professional care.",
    likelyConfusion_vi: "Nội dung y tế chỉ để luyện ngôn ngữ, không thay thế chăm sóc chuyên môn.",
  },
];
