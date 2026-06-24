// src/languages/punjabi/interactionRepairA2.ts
//
// Punjabi A2 interaction-repair pack for Vietnamese-speaking and
// English-speaking learners. Gurmukhi is primary. Romanization is a practical
// reading aid, not a phonetic standard. Shahmukhi is mentioned only for
// awareness; this is not a Shahmukhi course. Native review is deferred.

export type PunjabiInteractionRepairA2Topic =
  | "ask_repetition"
  | "ask_slower"
  | "clarify_meaning"
  | "correct_misunderstanding"
  | "confirm_details"
  | "appointments"
  | "transport"
  | "housing"
  | "school_confusion"
  | "workplace_confusion";

export type PunjabiInteractionRepairA2Phrase = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
  when_vi: string;
  when_en: string;
};

export type PunjabiInteractionRepairA2Trap = {
  trap_vi: string;
  trap_en: string;
  better_pa: string;
  better_romanization: string;
};

export type PunjabiInteractionRepairA2Card = {
  id: string;
  topic: PunjabiInteractionRepairA2Topic;
  title_vi: string;
  title_en: string;
  situation_vi: string;
  situation_en: string;
  strategy_vi: string;
  strategy_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  phrases: PunjabiInteractionRepairA2Phrase[];
  traps: PunjabiInteractionRepairA2Trap[];
  mini_dialogue: {
    a_pa: string;
    a_romanization: string;
    b_pa: string;
    b_romanization: string;
    vi: string;
    en: string;
  };
};

const scriptAwarenessVi = "Dùng Gurmukhi làm chữ chính; Shahmukhi chỉ được nhắc để nhận biết, không phải một khóa riêng.";
const scriptAwarenessEn = "Gurmukhi is the main script; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const interactionRepairA2: PunjabiInteractionRepairA2Card[] = [
  {
    id: "pa_a2_repair_repeat_general",
    topic: "ask_repetition",
    title_vi: "Xin nhắc lại",
    title_en: "Asking for repetition",
    situation_vi: "Bạn không nghe rõ một câu và cần người kia nói lại.",
    situation_en: "You did not hear a sentence clearly and need it repeated.",
    strategy_vi: "Mở đầu bằng ਮਾਫ਼ ਕਰਨਾ để mềm giọng, rồi dùng ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ.",
    strategy_en: "Start with ਮਾਫ਼ ਕਰਨਾ to soften the tone, then use ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    phrases: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi dubara keh sakde ho?", vi: "Xin lỗi, bạn có thể nói lại không?", en: "Sorry, can you say that again?", when_vi: "Dùng với người lạ, giáo viên, nhân viên.", when_en: "Use with strangers, teachers, or staff." },
      { pa: "ਮੈਂ ਠੀਕ ਨਾਲ ਨਹੀਂ ਸੁਣਿਆ।", romanization: "main theek naal nahi sunia.", vi: "Tôi không nghe rõ.", en: "I did not hear clearly.", when_vi: "Giải thích lý do cần nhắc lại.", when_en: "Explain why you need repetition." },
      { pa: "ਇੱਕ ਵਾਰ ਫਿਰ, ਕਿਰਪਾ ਕਰਕੇ।", romanization: "ikk vaar phir, kirpa karke.", vi: "Một lần nữa, làm ơn.", en: "One more time, please.", when_vi: "Câu ngắn ở A2, lịch sự vừa đủ.", when_en: "A short A2-level polite phrase." },
    ],
    traps: [
      { trap_vi: "Đừng chỉ nói ਕੀ? với người lạ; nghe cụt.", trap_en: "Do not only say ਕੀ? to a stranger; it sounds abrupt.", better_pa: "ਮਾਫ਼ ਕਰਨਾ, ਦੁਬਾਰਾ ਕਹੋ ਜੀ।", better_romanization: "maaf karna, dubara kaho ji." },
    ],
    mini_dialogue: {
      a_pa: "ਫਾਰਮ ਕੱਲ੍ਹ ਦੇਣਾ ਹੈ।",
      a_romanization: "form kal dena hai.",
      b_pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?",
      b_romanization: "maaf karna, ki tusi dubara keh sakde ho?",
      vi: "A: Phải nộp mẫu ngày mai. B: Xin lỗi, bạn có thể nói lại không?",
      en: "A: The form is due tomorrow. B: Sorry, can you say that again?",
    },
  },
  {
    id: "pa_a2_repair_slow_down",
    topic: "ask_slower",
    title_vi: "Xin nói chậm hơn",
    title_en: "Asking someone to speak slower",
    situation_vi: "Người kia nói nhanh quá.",
    situation_en: "The other person is speaking too fast.",
    strategy_vi: "Nói thẳng nhưng lịch sự: ਹੌਲੀ ਬੋਲੋ ਜੀ hoặc ਥੋੜ੍ਹਾ ਹੌਲੀ.",
    strategy_en: "Be direct but polite: ਹੌਲੀ ਬੋਲੋ ਜੀ or ਥੋੜ੍ਹਾ ਹੌਲੀ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    phrases: [
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਥੋੜ੍ਹਾ ਹੌਲੀ ਬੋਲੋ।", romanization: "kirpa karke thoda hauli bolo.", vi: "Làm ơn nói chậm hơn một chút.", en: "Please speak a little slower.", when_vi: "Dùng trong lớp, clinic, văn phòng.", when_en: "Use in class, clinics, or offices." },
      { pa: "ਮੈਂ ਪੰਜਾਬੀ ਸਿੱਖ ਰਿਹਾ ਹਾਂ।", romanization: "main punjabi sikh riha haan.", vi: "Tôi đang học Punjabi. (nam)", en: "I am learning Punjabi. (male speaker)", when_vi: "Giải thích trình độ để người kia điều chỉnh.", when_en: "Explain your level so the other person adjusts." },
      { pa: "ਹੌਲੀ ਬੋਲੋ ਜੀ।", romanization: "hauli bolo ji.", vi: "Xin nói chậm hơn.", en: "Please speak slowly.", when_vi: "Bản rất ngắn, vẫn có ਜੀ để lịch sự.", when_en: "Very short but still polite with ਜੀ." },
    ],
    traps: [
      { trap_vi: "Người nói nữ: ਸਿੱਖ ਰਹੀ ਹਾਂ, không ਸਿੱਖ ਰਿਹਾ ਹਾਂ.", trap_en: "Female speaker: ਸਿੱਖ ਰਹੀ ਹਾਂ, not ਸਿੱਖ ਰਿਹਾ ਹਾਂ.", better_pa: "ਮੈਂ ਪੰਜਾਬੀ ਸਿੱਖ ਰਹੀ ਹਾਂ।", better_romanization: "main punjabi sikh rahi haan." },
    ],
    canada_practical_vi: "Hữu ích khi nói với nhân viên service Canada, clinic, school office.",
    canada_practical_en: "Useful with service staff, clinics, and school offices in Canada.",
    mini_dialogue: {
      a_pa: "ਤੁਹਾਡੀ ਅਪਾਇੰਟਮੈਂਟ ਦੋ ਵਜੇ ਹੈ।",
      a_romanization: "tuhadi appointment do vaje hai.",
      b_pa: "ਕਿਰਪਾ ਕਰਕੇ ਥੋੜ੍ਹਾ ਹੌਲੀ ਬੋਲੋ।",
      b_romanization: "kirpa karke thoda hauli bolo.",
      vi: "A: Lịch hẹn của bạn lúc hai giờ. B: Làm ơn nói chậm hơn một chút.",
      en: "A: Your appointment is at two. B: Please speak a little slower.",
    },
  },
  {
    id: "pa_a2_repair_word_meaning",
    topic: "clarify_meaning",
    title_vi: "Hỏi nghĩa một từ",
    title_en: "Clarifying a word meaning",
    situation_vi: "Bạn nghe một từ mới và cần nghĩa.",
    situation_en: "You hear a new word and need the meaning.",
    strategy_vi: "Dùng ਇਸਦਾ ਕੀ ਮਤਲਬ ਹੈ? để hỏi 'cái này nghĩa là gì?'.",
    strategy_en: "Use ਇਸਦਾ ਕੀ ਮਤਲਬ ਹੈ? to ask 'what does this mean?'.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    phrases: [
      { pa: "ਇਸਦਾ ਕੀ ਮਤਲਬ ਹੈ?", romanization: "isda ki matlab hai?", vi: "Cái này nghĩa là gì?", en: "What does this mean?", when_vi: "Dùng cho một từ/cụm vừa nghe hoặc đọc.", when_en: "Use for a word/phrase you just heard or read." },
      { pa: "ਇਹ ਸ਼ਬਦ ਮੈਨੂੰ ਨਹੀਂ ਪਤਾ।", romanization: "eh shabad mainu nahi pata.", vi: "Tôi không biết từ này.", en: "I do not know this word.", when_vi: "Nói rõ vấn đề là từ vựng.", when_en: "Clarify that the issue is vocabulary." },
      { pa: "ਕੀ ਤੁਸੀਂ ਉਦਾਹਰਨ ਦੇ ਸਕਦੇ ਹੋ?", romanization: "ki tusi udaharan de sakde ho?", vi: "Bạn có thể cho ví dụ không?", en: "Can you give an example?", when_vi: "Khi định nghĩa vẫn chưa đủ rõ.", when_en: "When the definition is still unclear." },
    ],
    traps: [
      { trap_vi: "ਮਤਲਬ là 'nghĩa/ý', không phải lúc nào cũng là 'purpose'.", trap_en: "ਮਤਲਬ means meaning/point, not always 'purpose'.", better_pa: "ਇਸਦਾ ਮਤਲਬ ਕੀ ਹੈ?", better_romanization: "isda matlab ki hai?" },
    ],
    mini_dialogue: {
      a_pa: "ਇਹ ਰਸੀਦ ਹੈ।",
      a_romanization: "eh raseed hai.",
      b_pa: "ਰਸੀਦ ਦਾ ਕੀ ਮਤਲਬ ਹੈ?",
      b_romanization: "raseed da ki matlab hai?",
      vi: "A: Đây là hóa đơn. B: 'ਰਸੀਦ' nghĩa là gì?",
      en: "A: This is a receipt. B: What does ਰਸੀਦ mean?",
    },
  },
  {
    id: "pa_a2_repair_correct_misunderstanding",
    topic: "correct_misunderstanding",
    title_vi: "Sửa hiểu lầm nhẹ nhàng",
    title_en: "Correcting a misunderstanding gently",
    situation_vi: "Người kia hiểu sai ngày, giờ, hoặc ý của bạn.",
    situation_en: "The other person misunderstood the day, time, or your meaning.",
    strategy_vi: "Dùng ਨਹੀਂ, ਮੇਰਾ ਮਤਲਬ... để sửa nhẹ, tránh giọng cứng.",
    strategy_en: "Use ਨਹੀਂ, ਮੇਰਾ ਮਤਲਬ... to correct gently without sounding harsh.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    phrases: [
      { pa: "ਨਹੀਂ, ਮੇਰਾ ਮਤਲਬ ਕੱਲ੍ਹ ਸੀ।", romanization: "nahi, mera matlab kal si.", vi: "Không, ý tôi là ngày mai/hôm qua theo ngữ cảnh.", en: "No, I meant kal (tomorrow/yesterday by context).", when_vi: "Cẩn thận vì ਕੱਲ੍ਹ có thể cần ngữ cảnh.", when_en: "Be careful because ਕੱਲ੍ਹ needs context." },
      { pa: "ਮੈਂ ਤਿੰਨ ਵਜੇ ਨਹੀਂ, ਚਾਰ ਵਜੇ ਆਵਾਂਗਾ।", romanization: "main tinn vaje nahi, chaar vaje aavanga.", vi: "Tôi sẽ đến lúc bốn giờ, không phải ba giờ. (nam)", en: "I will come at four, not three. (male speaker)", when_vi: "Dùng cấu trúc 'không phải X, mà Y'.", when_en: "Use the 'not X, but Y' repair pattern." },
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਸਾਫ਼ ਨਹੀਂ ਕਿਹਾ।", romanization: "maaf karna, main saaf nahi keha.", vi: "Xin lỗi, tôi nói chưa rõ.", en: "Sorry, I was not clear.", when_vi: "Giảm căng thẳng khi sửa lại.", when_en: "Reduces tension when correcting." },
    ],
    traps: [
      { trap_vi: "ਕੱਲ੍ਹ có thể gây mơ hồ; thêm ਦਿਨ/date nếu cần.", trap_en: "ਕੱਲ੍ਹ can be ambiguous; add a day/date if needed.", better_pa: "ਸੋਮਵਾਰ ਨੂੰ", better_romanization: "somvaar nu" },
    ],
    mini_dialogue: {
      a_pa: "ਤੁਸੀਂ ਤਿੰਨ ਵਜੇ ਆਓਗੇ?",
      a_romanization: "tusi tinn vaje aaoge?",
      b_pa: "ਨਹੀਂ, ਚਾਰ ਵਜੇ ਆਵਾਂਗਾ।",
      b_romanization: "nahi, chaar vaje aavanga.",
      vi: "A: Bạn sẽ đến lúc ba giờ à? B: Không, tôi sẽ đến lúc bốn giờ.",
      en: "A: Will you come at three? B: No, I will come at four.",
    },
  },
  {
    id: "pa_a2_repair_confirm_details",
    topic: "confirm_details",
    title_vi: "Xác nhận chi tiết",
    title_en: "Confirming details",
    situation_vi: "Bạn cần chắc chắn về ngày, giờ, địa chỉ, hoặc số phòng.",
    situation_en: "You need to confirm the day, time, address, or room number.",
    strategy_vi: "Lặp lại thông tin và hỏi ਠੀਕ ਹੈ? hoặc ਸਹੀ ਹੈ?",
    strategy_en: "Repeat the information and ask ਠੀਕ ਹੈ? or ਸਹੀ ਹੈ?",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Rất hữu ích khi xác nhận địa chỉ, suite number, unit number ở Canada.",
    canada_practical_en: "Very useful when confirming addresses, suite numbers, and unit numbers in Canada.",
    phrases: [
      { pa: "ਤਾਂ ਮੀਟਿੰਗ ਦੋ ਵਜੇ ਹੈ, ਠੀਕ ਹੈ?", romanization: "tan meeting do vaje hai, theek hai?", vi: "Vậy cuộc họp lúc hai giờ, đúng không?", en: "So the meeting is at two, right?", when_vi: "Dùng khi lặp lại thông tin vừa nghe.", when_en: "Use when repeating what you heard." },
      { pa: "ਪਤਾ ਦੁਬਾਰਾ ਦੱਸੋ ਜੀ।", romanization: "pata dubara dasso ji.", vi: "Xin cho biết lại địa chỉ.", en: "Please tell me the address again.", when_vi: "Khi cần xác nhận địa chỉ.", when_en: "When confirming an address." },
      { pa: "ਕੀ ਇਹ ਸਹੀ ਹੈ?", romanization: "ki eh sahi hai?", vi: "Cái này có đúng không?", en: "Is this correct?", when_vi: "Dùng với số, tên, spelling, thông tin.", when_en: "Use for numbers, names, spelling, and details." },
    ],
    traps: [
      { trap_vi: "ਠੀਕ ਹੈ? có thể là xác nhận, không chỉ 'okay'.", trap_en: "ਠੀਕ ਹੈ? can confirm, not only mean 'okay'.", better_pa: "ਦੋ ਵਜੇ, ਠੀਕ ਹੈ?", better_romanization: "do vaje, theek hai?" },
    ],
    mini_dialogue: {
      a_pa: "ਕਮਰਾ ਨੰਬਰ ਪੰਜ ਹੈ।",
      a_romanization: "kamra number panj hai.",
      b_pa: "ਕਮਰਾ ਨੰਬਰ ਪੰਜ, ਠੀਕ ਹੈ?",
      b_romanization: "kamra number panj, theek hai?",
      vi: "A: Phòng số năm. B: Phòng số năm, đúng không?",
      en: "A: Room number five. B: Room number five, right?",
    },
  },
  {
    id: "pa_a2_repair_appointment_confusion",
    topic: "appointments",
    title_vi: "Nhầm lịch hẹn",
    title_en: "Appointment confusion",
    situation_vi: "Bạn không chắc lịch hẹn là ngày nào hoặc cần đổi lịch.",
    situation_en: "You are unsure what day the appointment is or need to reschedule.",
    strategy_vi: "Hỏi rõ ngày/giờ, rồi xác nhận bằng câu lặp lại.",
    strategy_en: "Ask for the day/time clearly, then confirm by repeating it.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Áp dụng ở clinic, dentist, school office tại Canada.",
    canada_practical_en: "Applies to clinics, dentists, and school offices in Canada.",
    phrases: [
      { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਦਿਨ ਹੈ?", romanization: "meri appointment kihre din hai?", vi: "Lịch hẹn của tôi vào ngày nào?", en: "What day is my appointment?", when_vi: "Khi không chắc ngày.", when_en: "When you are unsure of the day." },
      { pa: "ਕੀ ਮੈਂ ਸਮਾਂ ਬਦਲ ਸਕਦਾ ਹਾਂ?", romanization: "ki main sama badal sakda haan?", vi: "Tôi có thể đổi giờ không? (nam)", en: "Can I change the time? (male speaker)", when_vi: "Người nói nữ dùng ਸਕਦੀ.", when_en: "A female speaker uses ਸਕਦੀ." },
      { pa: "ਸੋਮਵਾਰ ਦੋ ਵਜੇ, ਠੀਕ ਹੈ?", romanization: "somvaar do vaje, theek hai?", vi: "Thứ Hai lúc hai giờ, đúng không?", en: "Monday at two, correct?", when_vi: "Xác nhận sau khi nghe thông tin.", when_en: "Confirm after receiving the information." },
    ],
    traps: [
      { trap_vi: "ਸਕਦਾ/ਸਕਦੀ đổi theo người nói.", trap_en: "ਸਕਦਾ/ਸਕਦੀ changes with the speaker.", better_pa: "ਕੀ ਮੈਂ ਸਮਾਂ ਬਦਲ ਸਕਦੀ ਹਾਂ?", better_romanization: "ki main sama badal sakdi haan?" },
    ],
    mini_dialogue: {
      a_pa: "ਤੁਹਾਡੀ ਅਪਾਇੰਟਮੈਂਟ ਸੋਮਵਾਰ ਨੂੰ ਹੈ।",
      a_romanization: "tuhadi appointment somvaar nu hai.",
      b_pa: "ਸੋਮਵਾਰ ਦੋ ਵਜੇ, ਠੀਕ ਹੈ?",
      b_romanization: "somvaar do vaje, theek hai?",
      vi: "A: Lịch hẹn của bạn vào thứ Hai. B: Thứ Hai lúc hai giờ, đúng không?",
      en: "A: Your appointment is on Monday. B: Monday at two, correct?",
    },
  },
  {
    id: "pa_a2_repair_transport_confusion",
    topic: "transport",
    title_vi: "Nhầm tuyến xe/tàu",
    title_en: "Transit confusion",
    situation_vi: "Bạn không chắc xe buýt/tàu này đi đâu hoặc xuống ở đâu.",
    situation_en: "You are unsure where this bus/train goes or where to get off.",
    strategy_vi: "Hỏi bằng ਇਹ ... ਕਿੱਥੇ ਜਾਂਦੀ ਹੈ? và ਉਤਰਨਾ cho 'xuống'.",
    strategy_en: "Ask with ਇਹ ... ਕਿੱਥੇ ਜਾਂਦੀ ਹੈ? and use ਉਤਰਨਾ for 'get off'.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng với TTC, SkyTrain, bus stop, platform trong bối cảnh Canada.",
    canada_practical_en: "Use with TTC, SkyTrain, bus stops, and platforms in Canada.",
    phrases: [
      { pa: "ਇਹ ਬੱਸ ਕਿੱਥੇ ਜਾਂਦੀ ਹੈ?", romanization: "eh bass kitthe jandi hai?", vi: "Xe buýt này đi đâu?", en: "Where does this bus go?", when_vi: "ਜਾਂਦੀ agrees với ਬੱਸ.", when_en: "ਜਾਂਦੀ agrees with ਬੱਸ." },
      { pa: "ਮੈਨੂੰ ਕਿੱਥੇ ਉਤਰਨਾ ਹੈ?", romanization: "mainu kitthe utarna hai?", vi: "Tôi phải xuống ở đâu?", en: "Where should I get off?", when_vi: "Dùng khi hỏi điểm xuống.", when_en: "Use when asking the stop to get off." },
      { pa: "ਕੀ ਇਹ ਸਹੀ ਪਲੇਟਫਾਰਮ ਹੈ?", romanization: "ki eh sahi platform hai?", vi: "Đây có phải sân ga đúng không?", en: "Is this the correct platform?", when_vi: "Xác nhận trước khi đi.", when_en: "Confirm before boarding." },
    ],
    traps: [
      { trap_vi: "Đừng dùng ਜਾਂਦਾ với ਬੱਸ nếu đang giữ agreement giống cái.", trap_en: "Do not use ਜਾਂਦਾ with ਬੱਸ when keeping feminine agreement.", better_pa: "ਬੱਸ ਜਾਂਦੀ ਹੈ।", better_romanization: "bass jandi hai." },
    ],
    mini_dialogue: {
      a_pa: "ਇਹ ਬੱਸ ਸਰੀ ਸੈਂਟਰ ਜਾਂਦੀ ਹੈ।",
      a_romanization: "eh bass surrey centre jandi hai.",
      b_pa: "ਮੈਨੂੰ ਕਿੱਥੇ ਉਤਰਨਾ ਹੈ?",
      b_romanization: "mainu kitthe utarna hai?",
      vi: "A: Xe buýt này đi Surrey Centre. B: Tôi phải xuống ở đâu?",
      en: "A: This bus goes to Surrey Centre. B: Where should I get off?",
    },
  },
  {
    id: "pa_a2_repair_housing_confusion",
    topic: "housing",
    title_vi: "Không rõ vấn đề nhà ở",
    title_en: "Housing confusion",
    situation_vi: "Bạn cần giải thích vấn đề trong nhà nhưng chưa biết từ chính xác.",
    situation_en: "You need to explain a housing issue but do not know the exact word.",
    strategy_vi: "Dùng ਚੀਜ਼, ਸਮੱਸਿਆ, ਇੱਥੇ để nói vòng quanh khi thiếu từ.",
    strategy_en: "Use ਚੀਜ਼, ਸਮੱਸਿਆ, ਇੱਥੇ to talk around a missing word.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Hữu ích khi nói với landlord, building manager, maintenance.",
    canada_practical_en: "Useful with landlords, building managers, and maintenance.",
    phrases: [
      { pa: "ਇੱਥੇ ਇੱਕ ਸਮੱਸਿਆ ਹੈ।", romanization: "itthe ikk samassia hai.", vi: "Ở đây có một vấn đề.", en: "There is a problem here.", when_vi: "Mở đầu khi chưa biết mô tả chi tiết.", when_en: "Open when you do not know the detailed description yet." },
      { pa: "ਮੈਨੂੰ ਇਸ ਚੀਜ਼ ਦਾ ਨਾਮ ਨਹੀਂ ਪਤਾ।", romanization: "mainu is cheez da naam nahi pata.", vi: "Tôi không biết tên của thứ này.", en: "I do not know the name of this thing.", when_vi: "Dùng khi chỉ vào vật/ảnh.", when_en: "Use when pointing to an object/photo." },
      { pa: "ਕੀ ਤੁਸੀਂ ਆ ਕੇ ਦੇਖ ਸਕਦੇ ਹੋ?", romanization: "ki tusi aa ke dekh sakde ho?", vi: "Bạn có thể đến xem không?", en: "Can you come and look?", when_vi: "Yêu cầu hỗ trợ sửa chữa lịch sự.", when_en: "A polite repair-support request." },
    ],
    traps: [
      { trap_vi: "Đừng im lặng khi thiếu từ; dùng 'tôi không biết tên thứ này'.", trap_en: "Do not go silent when missing a word; say 'I do not know the name of this thing'.", better_pa: "ਮੈਨੂੰ ਇਸਦਾ ਨਾਮ ਨਹੀਂ ਪਤਾ।", better_romanization: "mainu isda naam nahi pata." },
    ],
    mini_dialogue: {
      a_pa: "ਕੀ ਸਮੱਸਿਆ ਹੈ?",
      a_romanization: "ki samassia hai?",
      b_pa: "ਮੈਨੂੰ ਇਸ ਚੀਜ਼ ਦਾ ਨਾਮ ਨਹੀਂ ਪਤਾ, ਪਰ ਇਹ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।",
      b_romanization: "mainu is cheez da naam nahi pata, par eh kamm nahi kar rahi.",
      vi: "A: Vấn đề là gì? B: Tôi không biết tên thứ này, nhưng nó không hoạt động.",
      en: "A: What is the problem? B: I do not know this thing's name, but it is not working.",
    },
  },
  {
    id: "pa_a2_repair_school_confusion",
    topic: "school_confusion",
    title_vi: "Không rõ thông tin ở trường",
    title_en: "School confusion",
    situation_vi: "Bạn không chắc hạn bài tập, phòng học, hoặc thông báo của trường.",
    situation_en: "You are unsure about homework deadlines, rooms, or school notices.",
    strategy_vi: "Hỏi bằng ਕਦੋਂ, ਕਿੱਥੇ, ਕਿਹੜਾ và xác nhận lại.",
    strategy_en: "Ask with ਕਦੋਂ, ਕਿੱਥੇ, ਕਿਹੜਾ and confirm back.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được trong school office, daycare, parent-teacher messages.",
    canada_practical_en: "Usable in school offices, daycare, and parent-teacher messages.",
    phrases: [
      { pa: "ਹੋਮਵਰਕ ਕਦੋਂ ਦੇਣਾ ਹੈ?", romanization: "homework kadon dena hai?", vi: "Khi nào phải nộp bài tập?", en: "When is the homework due?", when_vi: "Hỏi hạn nộp.", when_en: "Ask a due date." },
      { pa: "ਕਲਾਸ ਕਿਹੜੇ ਕਮਰੇ ਵਿੱਚ ਹੈ?", romanization: "class kihre kamre vich hai?", vi: "Lớp ở phòng nào?", en: "Which room is the class in?", when_vi: "Hỏi địa điểm lớp.", when_en: "Ask class location." },
      { pa: "ਮੈਂ ਨੋਟਿਸ ਨਹੀਂ ਸਮਝਿਆ।", romanization: "main notice nahi samjhia.", vi: "Tôi chưa hiểu thông báo. (nam)", en: "I did not understand the notice. (male speaker)", when_vi: "Người nói nữ dùng ਸਮਝੀ.", when_en: "A female speaker uses ਸਮਝੀ." },
    ],
    traps: [
      { trap_vi: "ਸਮਝਿਆ/ਸਮਝੀ đổi theo người nói trong câu này.", trap_en: "ਸਮਝਿਆ/ਸਮਝੀ changes with the speaker in this sentence.", better_pa: "ਮੈਂ ਨੋਟਿਸ ਨਹੀਂ ਸਮਝੀ।", better_romanization: "main notice nahi samjhi." },
    ],
    mini_dialogue: {
      a_pa: "ਹੋਮਵਰਕ ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਦੇਣਾ ਹੈ।",
      a_romanization: "homework shukkarvaar nu dena hai.",
      b_pa: "ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ, ਠੀਕ ਹੈ?",
      b_romanization: "shukkarvaar nu, theek hai?",
      vi: "A: Bài tập phải nộp thứ Sáu. B: Thứ Sáu, đúng không?",
      en: "A: The homework is due Friday. B: Friday, correct?",
    },
  },
  {
    id: "pa_a2_repair_workplace_confusion",
    topic: "workplace_confusion",
    title_vi: "Không rõ ở nơi làm việc",
    title_en: "Workplace confusion",
    situation_vi: "Bạn cần xác nhận nhiệm vụ, ca làm, hoặc hướng dẫn.",
    situation_en: "You need to confirm a task, shift, or instruction.",
    strategy_vi: "Dùng ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ và ਪੁੱਛ ਸਕਦਾ/ਸਕਦੀ để hỏi lại chuyên nghiệp.",
    strategy_en: "Use ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ and ਪੁੱਛ ਸਕਦਾ/ਸਕਦੀ to ask again professionally.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Hữu ích trong shift work, training, warehouse, retail, office.",
    canada_practical_en: "Useful in shift work, training, warehouses, retail, and offices.",
    phrases: [
      { pa: "ਮੈਨੂੰ ਇਹ ਹਦਾਇਤ ਸਮਝ ਨਹੀਂ ਆਈ।", romanization: "mainu eh hidayat samajh nahi aai.", vi: "Tôi chưa hiểu hướng dẫn này.", en: "I did not understand this instruction.", when_vi: "Nói thẳng nhưng không thô.", when_en: "Direct but not rude." },
      { pa: "ਕੀ ਮੈਂ ਇੱਕ ਸਵਾਲ ਪੁੱਛ ਸਕਦਾ ਹਾਂ?", romanization: "ki main ikk sawaal puchh sakda haan?", vi: "Tôi có thể hỏi một câu không? (nam)", en: "Can I ask a question? (male speaker)", when_vi: "Người nói nữ dùng ਸਕਦੀ.", when_en: "A female speaker uses ਸਕਦੀ." },
      { pa: "ਮੇਰਾ ਸ਼ਿਫ਼ਟ ਕਦੋਂ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ?", romanization: "mera shift kadon shuru hunda hai?", vi: "Ca của tôi bắt đầu khi nào?", en: "When does my shift start?", when_vi: "Hỏi lịch làm việc.", when_en: "Ask about work schedule." },
    ],
    traps: [
      { trap_vi: "Với workplace, tránh ਤੂੰ nếu chưa thân; dùng ਤੁਸੀਂ hoặc câu trung tính.", trap_en: "At work, avoid ਤੂੰ unless close; use ਤੁਸੀਂ or neutral phrasing.", better_pa: "ਕੀ ਤੁਸੀਂ ਸਮਝਾ ਸਕਦੇ ਹੋ?", better_romanization: "ki tusi samjha sakde ho?" },
    ],
    mini_dialogue: {
      a_pa: "ਪਹਿਲਾਂ ਇਹ ਰਿਪੋਰਟ ਪੂਰੀ ਕਰੋ।",
      a_romanization: "pehlan eh report poori karo.",
      b_pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਇਹ ਹਦਾਇਤ ਸਮਝ ਨਹੀਂ ਆਈ।",
      b_romanization: "maaf karna, mainu eh hidayat samajh nahi aai.",
      vi: "A: Trước tiên hoàn thành báo cáo này. B: Xin lỗi, tôi chưa hiểu hướng dẫn này.",
      en: "A: Finish this report first. B: Sorry, I did not understand this instruction.",
    },
  },
];
