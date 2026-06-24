// src/languages/punjabi/microLessonsA2.ts
//
// Punjabi A2 micro-lessons for daily communication. Built for Vietnamese-
// speaking and English-speaking learners. Gurmukhi is primary; romanization is
// a practical reading aid, not a phonetic standard. Shahmukhi is mentioned only
// for script awareness, not taught as a full course. Native review is deferred.

export type PunjabiA2MicroLessonTopic =
  | "past_daily_actions"
  | "future_daily_actions"
  | "shopping"
  | "appointments"
  | "transport"
  | "housing"
  | "school"
  | "childcare"
  | "workplace_small_talk"
  | "polite_problem_description";

export type PunjabiA2MicroPhrase = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
  usage_vi: string;
  usage_en: string;
};

export type PunjabiA2MicroTrap = {
  trap_vi: string;
  trap_en: string;
  better_pa: string;
  better_romanization: string;
};

export type PunjabiA2MicroLesson = {
  id: string;
  topic: PunjabiA2MicroLessonTopic;
  title_vi: string;
  title_en: string;
  situation_vi: string;
  situation_en: string;
  grammar_vi: string;
  grammar_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  phrases: PunjabiA2MicroPhrase[];
  learner_traps: PunjabiA2MicroTrap[];
  canada_practical_vi?: string;
  canada_practical_en?: string;
  quick_practice: {
    prompt_vi: string;
    prompt_en: string;
    answer_pa: string;
    answer_romanization: string;
  };
};

export const microLessonsA2: PunjabiA2MicroLesson[] = [
  {
    id: "pa_a2_micro_yesterday_routine",
    topic: "past_daily_actions",
    title_vi: "Kể việc đã làm hôm qua",
    title_en: "Saying what you did yesterday",
    situation_vi: "Bạn kể ngắn về sinh hoạt hôm qua.",
    situation_en: "You briefly describe yesterday's routine.",
    grammar_vi: "Quá khứ với nhiều động từ chuyển tác dùng ਨੇ cho người làm: ਮੈਂ ਨੇ không tự nhiên trong chuẩn thông dụng; thường dùng ਮੈਂ + tân ngữ + động từ quá khứ.",
    grammar_en: "Many transitive past clauses use ਨੇ for the doer. With ਮੈਂ, everyday standard Punjabi often uses ਮੈਂ + object + past verb rather than ਮੈਂ ਨੇ.",
    script_awareness_vi: "Gurmukhi là chữ chính ở đây; Shahmukhi chỉ là nhận biết tên chữ.",
    script_awareness_en: "Gurmukhi is the working script here; Shahmukhi is awareness by name only.",
    phrases: [
      { pa: "ਕੱਲ੍ਹ ਮੈਂ ਜਲਦੀ ਉੱਠਿਆ।", romanization: "kal main jaldi utthia.", vi: "Hôm qua tôi dậy sớm. (nam)", en: "Yesterday I woke up early. (male speaker)", usage_vi: "Dùng khi kể một hành động đã xong.", usage_en: "Use for a completed action." },
      { pa: "ਮੈਂ ਨਾਸ਼ਤਾ ਕੀਤਾ।", romanization: "main nashta kita.", vi: "Tôi đã ăn sáng.", en: "I had breakfast.", usage_vi: "ਕੀਤਾ dùng với ਕਰਨਾ trong quá khứ.", usage_en: "ਕੀਤਾ is the past form used with ਕਰਨਾ." },
      { pa: "ਸ਼ਾਮ ਨੂੰ ਮੈਂ ਘਰ ਆਇਆ।", romanization: "shaam nu main ghar aia.", vi: "Buổi tối tôi về nhà. (nam)", en: "In the evening I came home. (male speaker)", usage_vi: "ਸ਼ਾਮ ਨੂੰ đánh dấu thời gian.", usage_en: "ਸ਼ਾਮ ਨੂੰ marks the time." },
    ],
    learner_traps: [
      { trap_vi: "Người nói nữ cần đổi ਉੱਠਿਆ/ਆਇਆ thành ਉੱਠੀ/ਆਈ.", trap_en: "A female speaker changes ਉੱਠਿਆ/ਆਇਆ to ਉੱਠੀ/ਆਈ.", better_pa: "ਕੱਲ੍ਹ ਮੈਂ ਜਲਦੀ ਉੱਠੀ।", better_romanization: "kal main jaldi utthi." },
    ],
    quick_practice: { prompt_vi: "Nói: Hôm qua tôi làm việc.", prompt_en: "Say: Yesterday I worked.", answer_pa: "ਕੱਲ੍ਹ ਮੈਂ ਕੰਮ ਕੀਤਾ।", answer_romanization: "kal main kamm kita." },
  },
  {
    id: "pa_a2_micro_tomorrow_plan",
    topic: "future_daily_actions",
    title_vi: "Nói kế hoạch ngày mai",
    title_en: "Talking about tomorrow's plan",
    situation_vi: "Bạn nói mình sẽ làm gì ngày mai.",
    situation_en: "You say what you will do tomorrow.",
    grammar_vi: "Tương lai thường dùng đuôi -ਗਾ/-ਗੀ/-ਗੇ. Chọn theo người nói/chủ ngữ.",
    grammar_en: "The future often uses -ਗਾ/-ਗੀ/-ਗੇ. Choose the ending according to the speaker/subject.",
    script_awareness_vi: "Tiếp tục đọc Gurmukhi trước; Shahmukhi không phải nội dung học chính.",
    script_awareness_en: "Keep reading Gurmukhi first; Shahmukhi is not the main course content.",
    phrases: [
      { pa: "ਕੱਲ੍ਹ ਮੈਂ ਡਾਕਟਰ ਕੋਲ ਜਾਵਾਂਗਾ।", romanization: "kal main daktar kol javanga.", vi: "Ngày mai tôi sẽ đi bác sĩ. (nam)", en: "Tomorrow I will go to the doctor. (male speaker)", usage_vi: "ਕੋਲ dùng với nơi/người bạn đến gặp.", usage_en: "ਕੋਲ is used for the person/place you go to." },
      { pa: "ਮੈਂ ਸ਼ਾਮ ਨੂੰ ਫ਼ੋਨ ਕਰਾਂਗੀ।", romanization: "main shaam nu phone karangi.", vi: "Tôi sẽ gọi điện buổi tối. (nữ)", en: "I will call in the evening. (female speaker)", usage_vi: "-ਾਂਗੀ cho người nói nữ trong mẫu này.", usage_en: "-ਾਂਗੀ is used by a female speaker here." },
      { pa: "ਅਸੀਂ ਵੀਕਐਂਡ ਤੇ ਮਿਲਾਂਗੇ।", romanization: "asin weekend te milange.", vi: "Chúng ta/chúng tôi sẽ gặp cuối tuần.", en: "We will meet on the weekend.", usage_vi: "ਅਸੀਂ không luôn nói rõ có bao gồm người nghe hay không.", usage_en: "ਅਸੀਂ does not always mark whether the listener is included." },
    ],
    learner_traps: [
      { trap_vi: "Đừng dùng cùng một đuôi tương lai cho mọi chủ ngữ.", trap_en: "Do not use one future ending for every subject.", better_pa: "ਉਹ ਕੱਲ੍ਹ ਆਵੇਗੀ।", better_romanization: "oh kal aavegi." },
    ],
    canada_practical_vi: "Ở Canada, dùng ਵੀਕਐਂਡ ਤੇ rất tự nhiên khi hẹn lịch bằng Punjabi-English đời thường.",
    canada_practical_en: "In Canada, ਵੀਕਐਂਡ ਤੇ is natural in everyday Punjabi-English scheduling.",
    quick_practice: { prompt_vi: "Nói: Tôi sẽ đến ngày mai. (nữ)", prompt_en: "Say: I will come tomorrow. (female speaker)", answer_pa: "ਮੈਂ ਕੱਲ੍ਹ ਆਵਾਂਗੀ।", answer_romanization: "main kal aavangi." },
  },
  {
    id: "pa_a2_micro_grocery_shopping",
    topic: "shopping",
    title_vi: "Mua đồ ở siêu thị",
    title_en: "Buying groceries",
    situation_vi: "Bạn hỏi giá và số lượng khi mua đồ.",
    situation_en: "You ask price and quantity while shopping.",
    grammar_vi: "ਕਿੰਨੇ ਦਾ/ਦੀ? hỏi giá; ਮੈਨੂੰ ... ਚਾਹੀਦਾ/ਚਾਹੀਦੀ है nói 'tôi cần/muốn'.",
    grammar_en: "ਕਿੰਨੇ ਦਾ/ਦੀ? asks price; ਮੈਨੂੰ ... ਚਾਹੀਦਾ/ਚਾਹੀਦੀ ਹੈ means I need/want.",
    script_awareness_vi: "Gurmukhi là văn bản chính; Shahmukhi chỉ được nhắc để nhận biết.",
    script_awareness_en: "Gurmukhi is the main text; Shahmukhi is mentioned only for awareness.",
    phrases: [
      { pa: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?", romanization: "eh kinne da hai?", vi: "Cái này bao nhiêu tiền?", en: "How much is this?", usage_vi: "Dùng với món giống đực/số ít hoặc khi không chắc.", usage_en: "Use with masculine singular items or when unsure." },
      { pa: "ਮੈਨੂੰ ਦੋ ਕਿਲੋ ਆਲੂ ਚਾਹੀਦੇ ਹਨ।", romanization: "mainu do kilo aloo chahide han.", vi: "Tôi cần hai ký khoai tây.", en: "I need two kilos of potatoes.", usage_vi: "ਚਾਹੀਦੇ dùng với số nhiều.", usage_en: "ਚਾਹੀਦੇ is used with plural items." },
      { pa: "ਕੀ ਬੈਗ ਚਾਹੀਦਾ ਹੈ?", romanization: "ki bag chahida hai?", vi: "Có cần túi không?", en: "Do you need a bag?", usage_vi: "Câu hữu ích ở quầy tính tiền.", usage_en: "Useful at checkout." },
    ],
    learner_traps: [
      { trap_vi: "ਚਾਹੀਦਾ agrees với vật cần, không với người cần.", trap_en: "ਚਾਹੀਦਾ agrees with the needed thing, not the person who needs it.", better_pa: "ਮੈਨੂੰ ਚਾਹ ਚਾਹੀਦੀ ਹੈ।", better_romanization: "mainu chah chahidi hai." },
    ],
    canada_practical_vi: "Ở cửa hàng Canada, bạn có thể nghe ਬੈਗ, ਰਸੀਦ, ਡੈਬਿਟ như từ mượn trong Punjabi.",
    canada_practical_en: "In Canadian stores, you may hear loanwords such as ਬੈਗ, ਰਸੀਦ, ਡੈਬਿਟ in Punjabi.",
    quick_practice: { prompt_vi: "Nói: Tôi cần một túi.", prompt_en: "Say: I need one bag.", answer_pa: "ਮੈਨੂੰ ਇੱਕ ਬੈਗ ਚਾਹੀਦਾ ਹੈ।", answer_romanization: "mainu ikk bag chahida hai." },
  },
  {
    id: "pa_a2_micro_book_appointment",
    topic: "appointments",
    title_vi: "Đặt lịch hẹn",
    title_en: "Booking an appointment",
    situation_vi: "Bạn gọi để đặt hoặc đổi lịch hẹn.",
    situation_en: "You call to book or change an appointment.",
    grammar_vi: "ਮਿਲਣਾ là 'gặp'; ਸਮਾਂ ਲੈਣਾ là 'lấy/đặt giờ hẹn'. Dùng ਸਕਦਾ/ਸਕਦੀ for yêu cầu lịch sự.",
    grammar_en: "ਮਿਲਣਾ means meet; ਸਮਾਂ ਲੈਣਾ means book a time. Use ਸਕਦਾ/ਸਕਦੀ for polite requests.",
    script_awareness_vi: "Bài dùng Gurmukhi; Shahmukhi là awareness, không luyện viết.",
    script_awareness_en: "This lesson uses Gurmukhi; Shahmukhi is awareness, not writing practice.",
    phrases: [
      { pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨਾਲ ਸਮਾਂ ਲੈਣਾ ਹੈ।", romanization: "mainu daktar naal sama laina hai.", vi: "Tôi cần đặt lịch với bác sĩ.", en: "I need to book an appointment with the doctor.", usage_vi: "ਨਾਲ = với; ਸਮਾਂ ਲੈਣਾ là cụm đặt lịch.", usage_en: "ਨਾਲ = with; ਸਮਾਂ ਲੈਣਾ is the booking phrase." },
      { pa: "ਕੀ ਮੰਗਲਵਾਰ ਨੂੰ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "ki mangalvaar nu sama mil sakda hai?", vi: "Thứ Ba có giờ trống không?", en: "Is a time available on Tuesday?", usage_vi: "ਮਿਲ ਸਕਦਾ ਹੈ = có thể có/available.", usage_en: "ਮਿਲ ਸਕਦਾ ਹੈ = can be available." },
      { pa: "ਮੈਂ ਆਪਣੀ ਅਪਾਇੰਟਮੈਂਟ ਬਦਲਣੀ ਹੈ।", romanization: "main apni appointment badalni hai.", vi: "Tôi cần đổi lịch hẹn.", en: "I need to change my appointment.", usage_vi: "ਬਦਲਣੀ agrees với ਅਪਾਇੰਟਮੈਂਟ giống cái.", usage_en: "ਬਦਲਣੀ agrees with feminine ਅਪਾਇੰਟਮੈਂਟ." },
    ],
    learner_traps: [
      { trap_vi: "Không dịch 'appointment' bằng một động từ; dùng ਸਮਾਂ/ਅਪਾਇੰਟਮੈਂਟ theo ngữ cảnh.", trap_en: "Do not translate appointment as a verb; use ਸਮਾਂ/ਅਪਾਇੰਟਮੈਂਟ by context.", better_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਦੋ ਵਜੇ ਹੈ।", better_romanization: "meri appointment do vaje hai." },
    ],
    canada_practical_vi: "Trong phòng khám Canada, ਅਪਾਇੰਟਮੈਂਟ là từ mượn rất dễ gặp.",
    canada_practical_en: "In Canadian clinics, ਅਪਾਇੰਟਮੈਂਟ is a common loanword.",
    quick_practice: { prompt_vi: "Nói: Lịch hẹn của tôi lúc ba giờ.", prompt_en: "Say: My appointment is at three.", answer_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਤਿੰਨ ਵਜੇ ਹੈ।", answer_romanization: "meri appointment tinn vaje hai." },
  },
  {
    id: "pa_a2_micro_bus_train",
    topic: "transport",
    title_vi: "Đi xe buýt và tàu",
    title_en: "Taking the bus and train",
    situation_vi: "Bạn hỏi tuyến, trạm, và thời gian đến.",
    situation_en: "You ask about routes, stops, and arrival time.",
    grammar_vi: "ਕਿੱਥੇ, ਕਦੋਂ, ਕਿਹੜੀ giúp hỏi thông tin cụ thể. ਬੱਸ feminine nên ਆਉਂਦੀ.",
    grammar_en: "ਕਿੱਥੇ, ਕਦੋਂ, ਕਿਹੜੀ ask specific information. ਬੱਸ is feminine, so use ਆਉਂਦੀ.",
    script_awareness_vi: "Đọc Gurmukhi là mục tiêu; Shahmukhi chỉ là ghi nhớ rằng Punjabi cũng có bối cảnh chữ khác.",
    script_awareness_en: "Reading Gurmukhi is the goal; Shahmukhi is only awareness that Punjabi has another script context.",
    phrases: [
      { pa: "ਇਹ ਬੱਸ ਕਿੱਥੇ ਜਾਂਦੀ ਹੈ?", romanization: "eh bass kitthe jandi hai?", vi: "Xe buýt này đi đâu?", en: "Where does this bus go?", usage_vi: "ਜਾਂਦੀ agrees với ਬੱਸ.", usage_en: "ਜਾਂਦੀ agrees with ਬੱਸ." },
      { pa: "ਅਗਲੀ ਟ੍ਰੇਨ ਕਦੋਂ ਆਵੇਗੀ?", romanization: "agli train kadon aavegi?", vi: "Chuyến tàu tiếp theo khi nào đến?", en: "When will the next train arrive?", usage_vi: "ਆਵੇਗੀ agrees với ਟ੍ਰੇਨ giống cái.", usage_en: "ਆਵੇਗੀ agrees with feminine ਟ੍ਰੇਨ." },
      { pa: "ਕੀ ਇਹ ਸਟਾਪ ਮੇਨ ਸਟਰੀਟ ਲਈ ਹੈ?", romanization: "ki eh stop main street lai hai?", vi: "Trạm này có phải cho Main Street không?", en: "Is this stop for Main Street?", usage_vi: "ਲਈ = cho/để đi đến.", usage_en: "ਲਈ = for/toward." },
    ],
    learner_traps: [
      { trap_vi: "Đừng dùng ਜਾਂਦਾ với ਬੱਸ trong câu này.", trap_en: "Do not use ਜਾਂਦਾ with ਬੱਸ in this sentence.", better_pa: "ਬੱਸ ਕਿੱਥੇ ਜਾਂਦੀ ਹੈ?", better_romanization: "bass kitthe jandi hai?" },
    ],
    canada_practical_vi: "Ví dụ Canada có thể dùng ਨਾਮ đường như ਮੇਨ ਸਟਰੀਟ, ਸਰੀ ਸੈਂਟਰ, hoặc TTC/SkyTrain theo thành phố.",
    canada_practical_en: "Canadian examples can use street or transit names like ਮੇਨ ਸਟਰੀਟ, ਸਰੀ ਸੈਂਟਰ, or TTC/SkyTrain depending on the city.",
    quick_practice: { prompt_vi: "Nói: Xe buýt đến muộn.", prompt_en: "Say: The bus is coming late.", answer_pa: "ਬੱਸ ਦੇਰ ਨਾਲ ਆ ਰਹੀ ਹੈ।", answer_romanization: "bass der naal aa rahi hai." },
  },
  {
    id: "pa_a2_micro_rent_housing",
    topic: "housing",
    title_vi: "Nói về nhà thuê",
    title_en: "Talking about rental housing",
    situation_vi: "Bạn hỏi về phòng, tiền thuê, và vấn đề trong nhà.",
    situation_en: "You ask about a room, rent, and household problems.",
    grammar_vi: "ਮੇਰੇ ਕੋਲ = tôi có; ਕਿਰਾਇਆ = tiền thuê; ਵਿੱਚ/ਤੇ dùng cho vị trí.",
    grammar_en: "ਮੇਰੇ ਕੋਲ = I have; ਕਿਰਾਇਆ = rent; ਵਿੱਚ/ਤੇ mark location.",
    script_awareness_vi: "Gurmukhi là phần học chính; Shahmukhi chỉ xuất hiện như awareness.",
    script_awareness_en: "Gurmukhi is the main learning script; Shahmukhi appears only as awareness.",
    phrases: [
      { pa: "ਕੀ ਕਮਰਾ ਖਾਲੀ ਹੈ?", romanization: "ki kamra khali hai?", vi: "Phòng còn trống không?", en: "Is the room available?", usage_vi: "ਖਾਲੀ = trống/available.", usage_en: "ਖਾਲੀ = empty/available." },
      { pa: "ਕਿਰਾਇਆ ਕਿੰਨਾ ਹੈ?", romanization: "kiraya kinna hai?", vi: "Tiền thuê bao nhiêu?", en: "How much is the rent?", usage_vi: "ਕਿੰਨਾ hỏi số lượng/giá.", usage_en: "ਕਿੰਨਾ asks amount/price." },
      { pa: "ਬਾਥਰੂਮ ਵਿੱਚ ਪਾਣੀ ਨਹੀਂ ਆ ਰਿਹਾ।", romanization: "bathroom vich paani nahi aa riha.", vi: "Trong phòng tắm không có nước chảy.", en: "Water is not coming in the bathroom.", usage_vi: "Dùng để mô tả vấn đề lịch sự, trung tính.", usage_en: "Use to describe a problem politely and neutrally." },
    ],
    learner_traps: [
      { trap_vi: "Không nói ਮੈਂ ਕਿਰਾਇਆ ਹੈ cho 'tôi có tiền thuê'; dùng ਮੇਰੇ ਕੋਲ.", trap_en: "Do not say ਮੈਂ ਕਿਰਾਇਆ ਹੈ for 'I have rent money'; use ਮੇਰੇ ਕੋਲ.", better_pa: "ਮੇਰੇ ਕੋਲ ਕਿਰਾਇਆ ਹੈ।", better_romanization: "mere kol kiraya hai." },
    ],
    canada_practical_vi: "Ở Canada, basement room có thể được nói là ਬੇਸਮੈਂਟ ਕਮਰਾ trong giao tiếp đời thường.",
    canada_practical_en: "In Canada, basement room may be said as ਬੇਸਮੈਂਟ ਕਮਰਾ in everyday speech.",
    quick_practice: { prompt_vi: "Nói: Tiền thuê rất cao.", prompt_en: "Say: The rent is very high.", answer_pa: "ਕਿਰਾਇਆ ਬਹੁਤ ਜ਼ਿਆਦਾ ਹੈ।", answer_romanization: "kiraya bahut zyada hai." },
  },
  {
    id: "pa_a2_micro_school_message",
    topic: "school",
    title_vi: "Nhắn với trường học",
    title_en: "Messaging the school",
    situation_vi: "Bạn nói về lớp, bài tập, và vắng mặt.",
    situation_en: "You talk about class, homework, and absence.",
    grammar_vi: "ਮੇਰਾ/ਮੇਰੀ agrees với danh từ: ਮੇਰੀ ਕਲਾਸ, ਮੇਰਾ ਬੱਚਾ. ਨੂੰ đánh dấu ngày/thời gian.",
    grammar_en: "ਮੇਰਾ/ਮੇਰੀ agrees with the noun: ਮੇਰੀ ਕਲਾਸ, ਮੇਰਾ ਬੱਚਾ. ਨੂੰ marks day/time.",
    script_awareness_vi: "Bài tập đọc dùng Gurmukhi; Shahmukhi chỉ là awareness.",
    script_awareness_en: "Reading practice uses Gurmukhi; Shahmukhi is awareness only.",
    phrases: [
      { pa: "ਮੇਰੀ ਕਲਾਸ ਸਵੇਰੇ ਨੌਂ ਵਜੇ ਹੈ।", romanization: "meri class savere naun vaje hai.", vi: "Lớp của tôi lúc chín giờ sáng.", en: "My class is at nine in the morning.", usage_vi: "ਮੇਰੀ vì ਕਲਾਸ giống cái.", usage_en: "ਮੇਰੀ because ਕਲਾਸ is feminine." },
      { pa: "ਹੋਮਵਰਕ ਕਦੋਂ ਦੇਣਾ ਹੈ?", romanization: "homework kadon dena hai?", vi: "Khi nào nộp bài tập?", en: "When is the homework due?", usage_vi: "ਦੇਣਾ ở đây nghĩa là nộp/đưa.", usage_en: "ਦੇਣਾ here means submit/give in." },
      { pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆਵੇਗਾ।", romanization: "mera bachcha ajj school nahi aavega.", vi: "Con tôi hôm nay sẽ không đến trường.", en: "My child will not come to school today.", usage_vi: "Câu thông báo vắng mặt ngắn gọn.", usage_en: "A short absence notice." },
    ],
    learner_traps: [
      { trap_vi: "ਮੇਰਾ/ਮੇਰੀ phụ thuộc danh từ sau nó, không phụ thuộc giới của người nói.", trap_en: "ਮੇਰਾ/ਮੇਰੀ depends on the following noun, not the speaker's gender.", better_pa: "ਮੇਰੀ ਕਲਾਸ", better_romanization: "meri class" },
    ],
    canada_practical_vi: "Tin nhắn vắng học ở Canada thường cần lý do ngắn và ngày cụ thể.",
    canada_practical_en: "A school absence message in Canada usually needs a short reason and a clear date.",
    quick_practice: { prompt_vi: "Nói: Con tôi bị ốm hôm nay.", prompt_en: "Say: My child is sick today.", answer_pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਬਿਮਾਰ ਹੈ।", answer_romanization: "mera bachcha ajj bimaar hai." },
  },
  {
    id: "pa_a2_micro_childcare_pickup",
    topic: "childcare",
    title_vi: "Đón trẻ",
    title_en: "Childcare pickup",
    situation_vi: "Bạn nói về giờ đón và tình trạng của trẻ.",
    situation_en: "You talk about pickup time and the child's condition.",
    grammar_vi: "ਨੂੰ đánh dấu thời gian: ਤਿੰਨ ਵਜੇ ਨੂੰ ít tự nhiên hơn; thường nói ਤਿੰਨ ਵਜੇ. ਲਈ = cho.",
    grammar_en: "ਨੂੰ marks time in many phrases, but with clock time ਤਿੰਨ ਵਜੇ is usually enough. ਲਈ = for.",
    script_awareness_vi: "Gurmukhi là mục tiêu đọc; Shahmukhi không được triển khai thành khóa riêng.",
    script_awareness_en: "Gurmukhi is the reading target; Shahmukhi is not developed into a separate course.",
    phrases: [
      { pa: "ਮੈਂ ਬੱਚੇ ਨੂੰ ਤਿੰਨ ਵਜੇ ਲੈਣ ਆਵਾਂਗਾ।", romanization: "main bachche nu tinn vaje lain aavanga.", vi: "Tôi sẽ đến đón trẻ lúc ba giờ. (nam)", en: "I will come to pick up the child at three. (male speaker)", usage_vi: "ਲੈਣ ਆਉਣਾ = đến để đón/lấy.", usage_en: "ਲੈਣ ਆਉਣਾ = come to pick up." },
      { pa: "ਬੱਚੇ ਨੇ ਖਾਣਾ ਖਾਧਾ?", romanization: "bachche ne khana khadha?", vi: "Bé đã ăn chưa?", en: "Did the child eat?", usage_vi: "ਨੇ xuất hiện trong quá khứ chuyển tác.", usage_en: "ਨੇ appears in a transitive past question." },
      { pa: "ਉਸਨੂੰ ਥੋੜ੍ਹਾ ਬੁਖਾਰ ਹੈ।", romanization: "usnu thoda bukhar hai.", vi: "Bé hơi sốt.", en: "The child has a slight fever.", usage_vi: "ਉਸਨੂੰ ... ਹੈ dùng cho tình trạng sức khỏe.", usage_en: "ਉਸਨੂੰ ... ਹੈ is used for health conditions." },
    ],
    learner_traps: [
      { trap_vi: "Không nói ਉਹ ਬੁਖਾਰ ਹੈ; dùng ਉਸਨੂੰ ਬੁਖਾਰ ਹੈ.", trap_en: "Do not say ਉਹ ਬੁਖਾਰ ਹੈ; use ਉਸਨੂੰ ਬੁਖਾਰ ਹੈ.", better_pa: "ਉਸਨੂੰ ਬੁਖਾਰ ਹੈ।", better_romanization: "usnu bukhar hai." },
    ],
    canada_practical_vi: "Ở daycare Canada, pickup/drop-off thường được nói bằng từ mượn ਪਿਕਅੱਪ và ਡਰਾਪ ਆਫ਼ trong giao tiếp song ngữ.",
    canada_practical_en: "In Canadian daycare contexts, ਪਿਕਅੱਪ and ਡਰਾਪ ਆਫ਼ are common bilingual loanwords.",
    quick_practice: { prompt_vi: "Nói: Tôi sẽ đến đón lúc năm giờ. (nữ)", prompt_en: "Say: I will come to pick up at five. (female speaker)", answer_pa: "ਮੈਂ ਪੰਜ ਵਜੇ ਲੈਣ ਆਵਾਂਗੀ।", answer_romanization: "main panj vaje lain aavangi." },
  },
  {
    id: "pa_a2_micro_work_small_talk",
    topic: "workplace_small_talk",
    title_vi: "Nói chuyện nhẹ ở nơi làm việc",
    title_en: "Workplace small talk",
    situation_vi: "Bạn nói ngắn với đồng nghiệp về cuối tuần, thời tiết, và công việc.",
    situation_en: "You briefly chat with coworkers about the weekend, weather, and work.",
    grammar_vi: "Câu nhỏ lịch sự thường dùng ਤੁਸੀਂ và ਜੀ; không cần quá thân mật.",
    grammar_en: "Polite small talk often uses ਤੁਸੀਂ and ਜੀ; avoid sounding overly intimate.",
    script_awareness_vi: "Tất cả ví dụ dùng Gurmukhi; Shahmukhi chỉ là awareness.",
    script_awareness_en: "All examples use Gurmukhi; Shahmukhi is awareness only.",
    phrases: [
      { pa: "ਤੁਹਾਡਾ ਵੀਕਐਂਡ ਕਿਵੇਂ ਸੀ?", romanization: "tuhada weekend kiven si?", vi: "Cuối tuần của bạn thế nào?", en: "How was your weekend?", usage_vi: "ਤੁਹਾਡਾ lịch sự hơn ਤੇਰਾ.", usage_en: "ਤੁਹਾਡਾ is more polite than ਤੇਰਾ." },
      { pa: "ਅੱਜ ਮੌਸਮ ਚੰਗਾ ਹੈ।", romanization: "ajj mausam changa hai.", vi: "Hôm nay thời tiết đẹp.", en: "The weather is nice today.", usage_vi: "Câu mở đầu an toàn.", usage_en: "A safe opener." },
      { pa: "ਕੰਮ ਕਿਵੇਂ ਚੱਲ ਰਿਹਾ ਹੈ?", romanization: "kamm kiven chall riha hai?", vi: "Công việc đang thế nào?", en: "How is work going?", usage_vi: "ਚੱਲ ਰਿਹਾ = đang diễn tiến.", usage_en: "ਚੱਲ ਰਿਹਾ = going/progressing." },
    ],
    learner_traps: [
      { trap_vi: "Với đồng nghiệp chưa thân, tránh ਤੂੰ/ਤੇਰਾ.", trap_en: "With coworkers you do not know well, avoid ਤੂੰ/ਤੇਰਾ.", better_pa: "ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", better_romanization: "tuhada din kiven hai?" },
    ],
    canada_practical_vi: "Ở nơi làm việc Canada, weekend/weather small talk rất phổ biến và ít rủi ro.",
    canada_practical_en: "In Canadian workplaces, weekend/weather small talk is common and low-risk.",
    quick_practice: { prompt_vi: "Nói: Hôm nay công việc bận.", prompt_en: "Say: Work is busy today.", answer_pa: "ਅੱਜ ਕੰਮ ਬਹੁਤ ਰੁੱਝਿਆ ਹੈ।", answer_romanization: "ajj kamm bahut rujhia hai." },
  },
  {
    id: "pa_a2_micro_problem_description",
    topic: "polite_problem_description",
    title_vi: "Mô tả vấn đề lịch sự",
    title_en: "Describing a problem politely",
    situation_vi: "Bạn báo vấn đề với chủ nhà, nhân viên, hoặc đồng nghiệp.",
    situation_en: "You report a problem to a landlord, staff member, or coworker.",
    grammar_vi: "ਮੇਰੇ ਕੋਲ/ਵਿੱਚ + vấn đề + ਹੈ rất hữu ích. Dùng ਥੋੜ੍ਹੀ/ਥੋੜ੍ਹਾ để làm câu mềm hơn khi phù hợp.",
    grammar_en: "ਮੇਰੇ ਕੋਲ/ਵਿੱਚ + problem + ਹੈ is useful. Use ਥੋੜ੍ਹੀ/ਥੋੜ੍ਹਾ to soften where appropriate.",
    script_awareness_vi: "Gurmukhi là chữ làm việc; Shahmukhi chỉ là awareness trong phạm vi này.",
    script_awareness_en: "Gurmukhi is the working script; Shahmukhi is awareness only in this scope.",
    phrases: [
      { pa: "ਮੈਨੂੰ ਇੱਕ ਛੋਟੀ ਸਮੱਸਿਆ ਹੈ।", romanization: "mainu ikk chhoti samassia hai.", vi: "Tôi có một vấn đề nhỏ.", en: "I have a small problem.", usage_vi: "Cách mở đầu lịch sự.", usage_en: "A polite opener." },
      { pa: "ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "heater kamm nahi kar riha.", vi: "Máy sưởi không hoạt động.", en: "The heater is not working.", usage_vi: "Câu thực tế cho nhà ở.", usage_en: "A practical housing sentence." },
      { pa: "ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi madad kar sakde ho?", vi: "Bạn có thể giúp không?", en: "Can you help?", usage_vi: "ਸਕਦੇ ਹੋ làm yêu cầu lịch sự.", usage_en: "ਸਕਦੇ ਹੋ makes the request polite." },
    ],
    learner_traps: [
      { trap_vi: "Đừng bắt đầu bằng mệnh lệnh mạnh khi báo lỗi với người lạ.", trap_en: "Do not start with a strong command when reporting a problem to a stranger.", better_pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਇੱਕ ਸਮੱਸਿਆ ਹੈ।", better_romanization: "maaf karna, mainu ikk samassia hai." },
    ],
    canada_practical_vi: "Ở Canada, heater, lease, landlord có thể xuất hiện như từ mượn trong Punjabi đời thường.",
    canada_practical_en: "In Canada, heater, lease, and landlord may appear as loanwords in everyday Punjabi.",
    quick_practice: { prompt_vi: "Nói: Máy sưởi không hoạt động.", prompt_en: "Say: The heater is not working.", answer_pa: "ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", answer_romanization: "heater kamm nahi kar riha." },
  },
];
