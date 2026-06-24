// src/languages/punjabi/situationalGrammarA2.ts
//
// Punjabi A2 situational grammar for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred.

export type PunjabiSituationalGrammarA2Topic =
  | "time"
  | "location"
  | "postpositions"
  | "routine"
  | "past_actions"
  | "future_actions"
  | "polite_questions"
  | "errands"
  | "appointments"
  | "housing"
  | "school_work";

export type PunjabiSituationalGrammarA2Example = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
  grammar_vi: string;
  grammar_en: string;
};

export type PunjabiSituationalGrammarA2Trap = {
  trap_vi: string;
  trap_en: string;
  better_pa: string;
  better_romanization: string;
};

export type PunjabiSituationalGrammarA2Card = {
  id: string;
  topic: PunjabiSituationalGrammarA2Topic;
  title_vi: string;
  title_en: string;
  situation_vi: string;
  situation_en: string;
  rule_vi: string;
  rule_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  examples: PunjabiSituationalGrammarA2Example[];
  traps: PunjabiSituationalGrammarA2Trap[];
  practice: {
    prompt_vi: string;
    prompt_en: string;
    answer_pa: string;
    answer_romanization: string;
  };
};

const scriptAwarenessVi = "Bài này dùng Gurmukhi làm chữ chính; Shahmukhi chỉ được nhắc để nhận biết.";
const scriptAwarenessEn = "This card uses Gurmukhi as the main script; Shahmukhi is mentioned only for awareness.";

export const situationalGrammarA2: PunjabiSituationalGrammarA2Card[] = [
  {
    id: "pa_a2_sitgram_time_clock",
    topic: "time",
    title_vi: "Nói giờ hẹn",
    title_en: "Saying appointment times",
    situation_vi: "Bạn nói giờ lớp, ca làm, hoặc lịch hẹn.",
    situation_en: "You state the time of a class, shift, or appointment.",
    rule_vi: "Cụm giờ dùng số + ਵਜੇ. Với ngày/buổi, Punjabi thường dùng ਨੂੰ: ਸੋਮਵਾਰ ਨੂੰ, ਸ਼ਾਮ ਨੂੰ.",
    rule_en: "Clock time uses number + ਵਜੇ. Days and parts of the day often use ਨੂੰ: ਸੋਮਵਾਰ ਨੂੰ, ਸ਼ਾਮ ਨੂੰ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Hữu ích khi nói lịch clinic, shift, class ở Canada.",
    canada_practical_en: "Useful for clinic, shift, and class schedules in Canada.",
    examples: [
      { pa: "ਮੇਰੀ ਕਲਾਸ ਨੌਂ ਵਜੇ ਹੈ।", romanization: "meri class naun vaje hai.", vi: "Lớp của tôi lúc chín giờ.", en: "My class is at nine.", grammar_vi: "ਨੌਂ ਵਜੇ = lúc chín giờ; ਮੇਰੀ agrees với ਕਲਾਸ.", grammar_en: "ਨੌਂ ਵਜੇ = at nine; ਮੇਰੀ agrees with ਕਲਾਸ." },
      { pa: "ਮੀਟਿੰਗ ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਹੈ।", romanization: "meeting shukkarvaar nu hai.", vi: "Cuộc họp vào thứ Sáu.", en: "The meeting is on Friday.", grammar_vi: "ਨੂੰ đánh dấu ngày.", grammar_en: "ਨੂੰ marks the day." },
    ],
    traps: [
      { trap_vi: "Đừng nói chỉ ਤਿੰਨ cho 'at three'; thêm ਵਜੇ.", trap_en: "Do not say only ਤਿੰਨ for 'at three'; add ਵਜੇ.", better_pa: "ਤਿੰਨ ਵਜੇ", better_romanization: "tinn vaje" },
    ],
    practice: { prompt_vi: "Nói: Lịch hẹn lúc hai giờ.", prompt_en: "Say: The appointment is at two.", answer_pa: "ਅਪਾਇੰਟਮੈਂਟ ਦੋ ਵਜੇ ਹੈ।", answer_romanization: "appointment do vaje hai." },
  },
  {
    id: "pa_a2_sitgram_location_home",
    topic: "location",
    title_vi: "Nói vị trí trong nhà",
    title_en: "Saying locations at home",
    situation_vi: "Bạn mô tả đồ vật hoặc người đang ở đâu.",
    situation_en: "You describe where an item or person is.",
    rule_vi: "ਵਿੱਚ = trong/ở trong; ਤੇ = trên/ở tại; ਕੋਲ = gần/bên cạnh hoặc 'có' trong một số mẫu.",
    rule_en: "ਵਿੱਚ = in/inside; ਤੇ = on/at; ਕੋਲ = near/beside or 'have' in some patterns.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    examples: [
      { pa: "ਚਾਬੀ ਦਰਵਾਜ਼ੇ ਕੋਲ ਹੈ।", romanization: "chabi darvaze kol hai.", vi: "Chìa khóa ở gần cửa.", en: "The key is near the door.", grammar_vi: "ਕੋਲ đứng sau danh từ chỉ mốc vị trí.", grammar_en: "ਕੋਲ follows the reference noun." },
      { pa: "ਬੱਚਾ ਕਮਰੇ ਵਿੱਚ ਹੈ।", romanization: "bachcha kamre vich hai.", vi: "Đứa trẻ ở trong phòng.", en: "The child is in the room.", grammar_vi: "ਵਿੱਚ đi sau ਕਮਰੇ.", grammar_en: "ਵਿੱਚ follows ਕਮਰੇ." },
    ],
    traps: [
      { trap_vi: "Không đặt postposition trước danh từ như English.", trap_en: "Do not put the postposition before the noun like English.", better_pa: "ਕਮਰੇ ਵਿੱਚ", better_romanization: "kamre vich" },
    ],
    practice: { prompt_vi: "Nói: Túi ở trên bàn.", prompt_en: "Say: The bag is on the table.", answer_pa: "ਬੈਗ ਮੇਜ਼ ਤੇ ਹੈ।", answer_romanization: "bag mez te hai." },
  },
  {
    id: "pa_a2_sitgram_nu_ton_lai",
    topic: "postpositions",
    title_vi: "ਨੂੰ, ਤੋਂ, ਲਈ trong việc vặt",
    title_en: "ਨੂੰ, ਤੋਂ, ਲਈ in errands",
    situation_vi: "Bạn nói đi đâu, cho ai, và từ đâu.",
    situation_en: "You say where you go, for whom, and from where.",
    rule_vi: "ਨੂੰ đánh dấu người nhận/thời gian; ਤੋਂ = từ; ਲਈ = cho/vì.",
    rule_en: "ਨੂੰ marks recipient/time; ਤੋਂ = from; ਲਈ = for.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được khi gửi form, pickup đồ, hoặc mua thuốc cho người nhà.",
    canada_practical_en: "Useful for submitting forms, picking things up, or buying medicine for family.",
    examples: [
      { pa: "ਮੈਂ ਮਾਂ ਲਈ ਦਵਾਈ ਲੈ ਰਿਹਾ ਹਾਂ।", romanization: "main maan lai davai lai riha haan.", vi: "Tôi đang lấy/mua thuốc cho mẹ. (nam)", en: "I am getting medicine for my mother. (male speaker)", grammar_vi: "ਲਈ = cho; ਲੈ ਰਿਹਾ là tiếp diễn.", grammar_en: "ਲਈ = for; ਲੈ ਰਿਹਾ is progressive." },
      { pa: "ਮੈਂ ਘਰ ਤੋਂ ਆ ਰਿਹਾ ਹਾਂ।", romanization: "main ghar ton aa riha haan.", vi: "Tôi đang đến từ nhà. (nam)", en: "I am coming from home. (male speaker)", grammar_vi: "ਤੋਂ đứng sau nơi xuất phát.", grammar_en: "ਤੋਂ follows the starting point." },
    ],
    traps: [
      { trap_vi: "ਲਈ và ਨੂੰ không thay thế nhau hoàn toàn.", trap_en: "ਲਈ and ਨੂੰ are not fully interchangeable.", better_pa: "ਬੱਚੇ ਲਈ ਖਾਣਾ", better_romanization: "bachche lai khana" },
    ],
    practice: { prompt_vi: "Nói: Tôi mua sữa cho con.", prompt_en: "Say: I buy milk for the child.", answer_pa: "ਮੈਂ ਬੱਚੇ ਲਈ ਦੁੱਧ ਖਰੀਦਦਾ ਹਾਂ।", answer_romanization: "main bachche lai dudh khareedda haan." },
  },
  {
    id: "pa_a2_sitgram_routine_habit",
    topic: "routine",
    title_vi: "Thói quen hằng ngày",
    title_en: "Daily habits",
    situation_vi: "Bạn nói việc thường làm vào sáng/tối.",
    situation_en: "You say what you usually do in the morning/evening.",
    rule_vi: "Thói quen dùng gốc động từ + ਦਾ/ਦੀ/ਦੇ + ਹਾਂ/ਹੈ/ਹਨ. Người nói nữ thường dùng -ਦੀ cho bản thân.",
    rule_en: "Habits use verb stem + ਦਾ/ਦੀ/ਦੇ + ਹਾਂ/ਹੈ/ਹਨ. A female speaker usually uses -ਦੀ for herself.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    examples: [
      { pa: "ਮੈਂ ਸਵੇਰੇ ਚਾਹ ਪੀਂਦੀ ਹਾਂ।", romanization: "main savere chah peendi haan.", vi: "Tôi uống trà buổi sáng. (nữ)", en: "I drink tea in the morning. (female speaker)", grammar_vi: "ਪੀਂਦੀ agrees với người nói nữ.", grammar_en: "ਪੀਂਦੀ agrees with a female speaker." },
      { pa: "ਅਸੀਂ ਰਾਤ ਨੂੰ ਖਾਣਾ ਖਾਂਦੇ ਹਾਂ।", romanization: "asin raat nu khana khande haan.", vi: "Chúng tôi ăn tối vào buổi tối.", en: "We eat at night.", grammar_vi: "ਖਾਂਦੇ dùng với ਅਸੀਂ.", grammar_en: "ਖਾਂਦੇ is used with ਅਸੀਂ." },
    ],
    traps: [
      { trap_vi: "Đừng dùng dạng nam mặc định cho mọi người nói.", trap_en: "Do not use the masculine form as default for every speaker.", better_pa: "ਮੈਂ ਜਾਂਦੀ ਹਾਂ।", better_romanization: "main jandi haan." },
    ],
    practice: { prompt_vi: "Nói: Tôi đi làm buổi sáng. (nam)", prompt_en: "Say: I go to work in the morning. (male speaker)", answer_pa: "ਮੈਂ ਸਵੇਰੇ ਕੰਮ ਤੇ ਜਾਂਦਾ ਹਾਂ।", answer_romanization: "main savere kamm te janda haan." },
  },
  {
    id: "pa_a2_sitgram_past_errand",
    topic: "past_actions",
    title_vi: "Kể việc đã làm",
    title_en: "Reporting completed actions",
    situation_vi: "Bạn kể đã mua, gửi, hoặc nộp một thứ.",
    situation_en: "You say you bought, sent, or submitted something.",
    rule_vi: "Trong nhiều câu quá khứ chuyển tác, người làm dùng ਨੇ; động từ có thể agree với tân ngữ.",
    rule_en: "In many transitive past clauses, the doer takes ਨੇ; the verb may agree with the object.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    examples: [
      { pa: "ਰੀਨਾ ਨੇ ਰਸੀਦ ਭੇਜੀ।", romanization: "reena ne raseed bheji.", vi: "Reena đã gửi hóa đơn.", en: "Reena sent the receipt.", grammar_vi: "ਭੇਜੀ agrees với ਰਸੀਦ giống cái.", grammar_en: "ਭੇਜੀ agrees with feminine ਰਸੀਦ." },
      { pa: "ਅਸੀਂ ਫਾਰਮ ਜਮ੍ਹਾਂ ਕੀਤਾ।", romanization: "asin form jamma kita.", vi: "Chúng tôi đã nộp mẫu.", en: "We submitted the form.", grammar_vi: "ਜਮ੍ਹਾਂ ਕੀਤਾ = đã nộp.", grammar_en: "ਜਮ੍ਹਾਂ ਕੀਤਾ = submitted." },
    ],
    traps: [
      { trap_vi: "Không dùng cùng một dạng ਕੀਤਾ cho mọi tân ngữ nếu đang luyện agreement.", trap_en: "Do not use ਕੀਤਾ for every object when practicing agreement.", better_pa: "ਚਿੱਠੀ ਭੇਜੀ।", better_romanization: "chitthi bheji." },
    ],
    practice: { prompt_vi: "Nói: Aman đã uống trà.", prompt_en: "Say: Aman drank tea.", answer_pa: "ਅਮਨ ਨੇ ਚਾਹ ਪੀਤੀ।", answer_romanization: "aman ne chah peeti." },
  },
  {
    id: "pa_a2_sitgram_future_plan",
    topic: "future_actions",
    title_vi: "Kế hoạch tương lai gần",
    title_en: "Near-future plans",
    situation_vi: "Bạn nói sẽ đến, gọi, hoặc đổi lịch.",
    situation_en: "You say you will come, call, or reschedule.",
    rule_vi: "Tương lai dùng -ਗਾ/-ਗੀ/-ਗੇ. Dạng đổi theo người nói/chủ ngữ.",
    rule_en: "The future uses -ਗਾ/-ਗੀ/-ਗੇ. The form changes with speaker/subject.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    examples: [
      { pa: "ਮੈਂ ਸ਼ਾਮ ਨੂੰ ਫ਼ੋਨ ਕਰਾਂਗਾ।", romanization: "main shaam nu phone karanga.", vi: "Tôi sẽ gọi buổi tối. (nam)", en: "I will call in the evening. (male speaker)", grammar_vi: "ਕਰਾਂਗਾ là tương lai của người nói nam.", grammar_en: "ਕਰਾਂਗਾ is future for a male speaker." },
      { pa: "ਉਹ ਕੱਲ੍ਹ ਆਵੇਗੀ।", romanization: "oh kal aavegi.", vi: "Cô ấy sẽ đến ngày mai.", en: "She will come tomorrow.", grammar_vi: "ਆਵੇਗੀ agrees với chủ ngữ nữ.", grammar_en: "ਆਵੇਗੀ agrees with a feminine subject." },
    ],
    traps: [
      { trap_vi: "Người nói nữ không dùng ਕਰਾਂਗਾ cho bản thân.", trap_en: "A female speaker does not use ਕਰਾਂਗਾ for herself.", better_pa: "ਮੈਂ ਫ਼ੋਨ ਕਰਾਂਗੀ।", better_romanization: "main phone karangi." },
    ],
    practice: { prompt_vi: "Nói: Tôi sẽ đến muộn. (nữ)", prompt_en: "Say: I will come late. (female speaker)", answer_pa: "ਮੈਂ ਦੇਰ ਨਾਲ ਆਵਾਂਗੀ।", answer_romanization: "main der naal aavangi." },
  },
  {
    id: "pa_a2_sitgram_polite_request",
    topic: "polite_questions",
    title_vi: "Câu hỏi lịch sự",
    title_en: "Polite questions",
    situation_vi: "Bạn nhờ giúp, hỏi đường, hoặc xin nhắc lại.",
    situation_en: "You ask for help, directions, or repetition.",
    rule_vi: "ਕੀ + ਤੁਸੀਂ + ... ਸਕਦੇ ਹੋ? là mẫu lịch sự 'bạn có thể... không?'.",
    rule_en: "ਕੀ + ਤੁਸੀਂ + ... ਸਕਦੇ ਹੋ? is the polite 'can you...?' frame.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    examples: [
      { pa: "ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi meri madad kar sakde ho?", vi: "Bạn có thể giúp tôi không?", en: "Can you help me?", grammar_vi: "ਤੁਸੀਂ giữ giọng lịch sự.", grammar_en: "ਤੁਸੀਂ keeps the tone polite." },
      { pa: "ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "ki tusi dubara keh sakde ho?", vi: "Bạn có thể nói lại không?", en: "Can you say it again?", grammar_vi: "ਦੁਬਾਰਾ = lại/một lần nữa.", grammar_en: "ਦੁਬਾਰਾ = again." },
    ],
    traps: [
      { trap_vi: "Với người lạ, tránh mệnh lệnh ngắn nếu có thể dùng câu hỏi.", trap_en: "With strangers, avoid a short command when a question is possible.", better_pa: "ਕੀ ਤੁਸੀਂ ਦੱਸ ਸਕਦੇ ਹੋ?", better_romanization: "ki tusi dass sakde ho?" },
    ],
    practice: { prompt_vi: "Nói: Bạn có thể mở cửa không?", prompt_en: "Say: Can you open the door?", answer_pa: "ਕੀ ਤੁਸੀਂ ਦਰਵਾਜ਼ਾ ਖੋਲ੍ਹ ਸਕਦੇ ਹੋ?", answer_romanization: "ki tusi darvaza kholh sakde ho?" },
  },
  {
    id: "pa_a2_sitgram_appointment_reschedule",
    topic: "appointments",
    title_vi: "Đổi lịch hẹn",
    title_en: "Rescheduling appointments",
    situation_vi: "Bạn đổi lịch với phòng khám hoặc văn phòng.",
    situation_en: "You reschedule with a clinic or office.",
    rule_vi: "ਬਦਲਣਾ = đổi; ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ? hỏi có giờ trống không.",
    rule_en: "ਬਦਲਣਾ = change; ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ? asks whether a time is available.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "ਅਪਾਇੰਟਮੈਂਟ và ਕਲਿਨਿਕ là từ mượn thường gặp ở Canada.",
    canada_practical_en: "ਅਪਾਇੰਟਮੈਂਟ and ਕਲਿਨਿਕ are common loanwords in Canada.",
    examples: [
      { pa: "ਮੈਂ ਆਪਣੀ ਅਪਾਇੰਟਮੈਂਟ ਬਦਲਣੀ ਹੈ।", romanization: "main apni appointment badalni hai.", vi: "Tôi cần đổi lịch hẹn.", en: "I need to change my appointment.", grammar_vi: "ਬਦਲਣੀ agrees với ਅਪਾਇੰਟਮੈਂਟ.", grammar_en: "ਬਦਲਣੀ agrees with ਅਪਾਇੰਟਮੈਂਟ." },
      { pa: "ਕੀ ਸੋਮਵਾਰ ਨੂੰ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "ki somvaar nu sama mil sakda hai?", vi: "Thứ Hai có giờ trống không?", en: "Is a time available on Monday?", grammar_vi: "ਨੂੰ đánh dấu ngày.", grammar_en: "ਨੂੰ marks the day." },
    ],
    traps: [
      { trap_vi: "Đừng bỏ ngày mới khi đổi lịch; câu sẽ thiếu thông tin.", trap_en: "Do not omit the new day when rescheduling; the sentence lacks information.", better_pa: "ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?", better_romanization: "shukkarvaar nu sama mil sakda hai?" },
    ],
    practice: { prompt_vi: "Nói: Tôi cần đổi giờ.", prompt_en: "Say: I need to change the time.", answer_pa: "ਮੈਨੂੰ ਸਮਾਂ ਬਦਲਣਾ ਹੈ।", answer_romanization: "mainu sama badalna hai." },
  },
  {
    id: "pa_a2_sitgram_housing_problem",
    topic: "housing",
    title_vi: "Vấn đề nhà ở",
    title_en: "Housing problems",
    situation_vi: "Bạn báo vấn đề với nước, máy sưởi, hoặc phòng.",
    situation_en: "You report an issue with water, heat, or a room.",
    rule_vi: "ਨਹੀਂ ਆ ਰਿਹਾ/ਰਹੀ dùng để nói thứ gì không đến/không hoạt động theo quá trình; ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ dùng cho thiết bị.",
    rule_en: "ਨਹੀਂ ਆ ਰਿਹਾ/ਰਹੀ says something is not coming/flowing; ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ says a device is not working.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Heater, basement, landlord có thể được mượn âm trong Punjabi Canada.",
    canada_practical_en: "Heater, basement, and landlord may be borrowed in Canadian Punjabi.",
    examples: [
      { pa: "ਬਾਥਰੂਮ ਵਿੱਚ ਪਾਣੀ ਨਹੀਂ ਆ ਰਿਹਾ।", romanization: "bathroom vich paani nahi aa riha.", vi: "Trong phòng tắm không có nước chảy.", en: "Water is not coming in the bathroom.", grammar_vi: "ਵਿੱਚ = trong; ਨਹੀਂ ਆ ਰਿਹਾ mô tả vấn đề đang xảy ra.", grammar_en: "ਵਿੱਚ = in; ਨਹੀਂ ਆ ਰਿਹਾ describes an ongoing issue." },
      { pa: "ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "heater kamm nahi kar riha.", vi: "Máy sưởi không hoạt động.", en: "The heater is not working.", grammar_vi: "ਕੰਮ ਕਰਨਾ = hoạt động/làm việc.", grammar_en: "ਕੰਮ ਕਰਨਾ = work/function." },
    ],
    traps: [
      { trap_vi: "Không dùng câu quá mạnh khi báo lỗi; mở bằng ਮਾਫ਼ ਕਰਨਾ nếu cần.", trap_en: "Avoid a harsh opening when reporting a problem; start with ਮਾਫ਼ ਕਰਨਾ if needed.", better_pa: "ਮਾਫ਼ ਕਰਨਾ, ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", better_romanization: "maaf karna, heater kamm nahi kar riha." },
    ],
    practice: { prompt_vi: "Nói: Trong bếp nước đang rò.", prompt_en: "Say: Water is leaking in the kitchen.", answer_pa: "ਰਸੋਈ ਵਿੱਚ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ।", answer_romanization: "rasoi vich paani leak ho riha hai." },
  },
  {
    id: "pa_a2_sitgram_school_work_notice",
    topic: "school_work",
    title_vi: "Thông báo trường/làm việc",
    title_en: "School/work notices",
    situation_vi: "Bạn báo vắng, nộp bài, hoặc hỏi hạn.",
    situation_en: "You report absence, submit work, or ask a deadline.",
    rule_vi: "ਕਦੋਂ ਦੇਣਾ ਹੈ? hỏi hạn nộp. ਨਹੀਂ ਆ ਸਕਦਾ/ਸਕਦੀ nói không thể đến.",
    rule_en: "ਕਦੋਂ ਦੇਣਾ ਹੈ? asks when something is due. ਨਹੀਂ ਆ ਸਕਦਾ/ਸਕਦੀ says cannot come.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được cho school, daycare, workplace shift messages ở Canada.",
    canada_practical_en: "Usable for school, daycare, and workplace shift messages in Canada.",
    examples: [
      { pa: "ਹੋਮਵਰਕ ਕਦੋਂ ਦੇਣਾ ਹੈ?", romanization: "homework kadon dena hai?", vi: "Khi nào phải nộp bài tập?", en: "When is the homework due?", grammar_vi: "ਦੇਣਾ ở đây = nộp.", grammar_en: "ਦੇਣਾ here = submit." },
      { pa: "ਮੈਂ ਅੱਜ ਕੰਮ ਤੇ ਨਹੀਂ ਆ ਸਕਦੀ।", romanization: "main ajj kamm te nahi aa sakdi.", vi: "Hôm nay tôi không thể đi làm. (nữ)", en: "I cannot come to work today. (female speaker)", grammar_vi: "ਸਕਦੀ agrees với người nói nữ.", grammar_en: "ਸਕਦੀ agrees with a female speaker." },
    ],
    traps: [
      { trap_vi: "Người nói nam dùng ਸਕਦਾ, người nói nữ dùng ਸਕਦੀ.", trap_en: "A male speaker uses ਸਕਦਾ; a female speaker uses ਸਕਦੀ.", better_pa: "ਮੈਂ ਨਹੀਂ ਆ ਸਕਦਾ।", better_romanization: "main nahi aa sakda." },
    ],
    practice: { prompt_vi: "Nói: Hôm nay con tôi không thể đến trường.", prompt_en: "Say: My child cannot come to school today.", answer_pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", answer_romanization: "mera bachcha ajj school nahi aa sakda." },
  },
  {
    id: "pa_a2_sitgram_errand_need",
    topic: "errands",
    title_vi: "Nói thứ cần mua/làm",
    title_en: "Saying what you need to buy/do",
    situation_vi: "Bạn nói cần mua đồ hoặc làm một việc vặt.",
    situation_en: "You say you need to buy something or do an errand.",
    rule_vi: "ਮੈਨੂੰ ... ਚਾਹੀਦਾ/ਚਾਹੀਦੀ/ਚਾਹੀਦੇ ਹਨ agrees với thứ cần. ਕੰਮ ਕਰਨਾ/ਕਰਵਾਉਣਾ khác nhau: tự làm vs nhờ làm.",
    rule_en: "ਮੈਨੂੰ ... ਚਾਹੀਦਾ/ਚਾਹੀਦੀ/ਚਾਹੀਦੇ ਹਨ agrees with the needed thing. ਕਰਨਾ vs ਕਰਵਾਉਣਾ: do yourself vs get done.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Có thể dùng với errands như pharmacy, grocery, bank, post office.",
    canada_practical_en: "Works for errands like pharmacy, grocery, bank, and post office.",
    examples: [
      { pa: "ਮੈਨੂੰ ਦੋ ਬੈਗ ਚਾਹੀਦੇ ਹਨ।", romanization: "mainu do bag chahide han.", vi: "Tôi cần hai túi.", en: "I need two bags.", grammar_vi: "ਚਾਹੀਦੇ ਹਨ dùng với số nhiều.", grammar_en: "ਚਾਹੀਦੇ ਹਨ is used with plural items." },
      { pa: "ਮੈਨੂੰ ਕਾਰਡ ਬਣਵਾਉਣਾ ਹੈ।", romanization: "mainu card banvauna hai.", vi: "Tôi cần làm/thủ tục lấy thẻ.", en: "I need to get a card made.", grammar_vi: "ਬਣਵਾਉਣਾ = nhờ/được làm ra.", grammar_en: "ਬਣਵਾਉਣਾ = get made/arranged." },
    ],
    traps: [
      { trap_vi: "ਚਾਹੀਦਾ không agrees với người nói; nó agrees với vật cần.", trap_en: "ਚਾਹੀਦਾ does not agree with the speaker; it agrees with the needed item.", better_pa: "ਮੈਨੂੰ ਰਸੀਦ ਚਾਹੀਦੀ ਹੈ।", better_romanization: "mainu raseed chahidi hai." },
    ],
    practice: { prompt_vi: "Nói: Tôi cần ba vé.", prompt_en: "Say: I need three tickets.", answer_pa: "ਮੈਨੂੰ ਤਿੰਨ ਟਿਕਟਾਂ ਚਾਹੀਦੀਆਂ ਹਨ।", answer_romanization: "mainu tinn ticktan chahidian han." },
  },
];
