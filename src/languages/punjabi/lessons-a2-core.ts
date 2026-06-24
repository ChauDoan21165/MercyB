// src/languages/punjabi/lessons-a2-core.ts
//
// Punjabi CEFR A2 core lesson batch for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary throughout. Romanization is learner-facing and practical,
// not a phonetic standard. Shahmukhi is mentioned only as script awareness:
// Punjabi can also be written in Shahmukhi, but this course teaches Gurmukhi.

export type PunjabiCategoryId =
  | "daily_routine"
  | "directions"
  | "time"
  | "weather"
  | "simple_past"
  | "simple_future"
  | "requests"
  | "preferences"
  | "health"
  | "school_work";

export type PunjabiCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type PunjabiLessonSentence = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
  grammar_vi: string[];
  grammar_en: string[];
};

export type PunjabiVocabEntry = {
  word: string;
  romanization: string;
  vi: string;
  en: string;
  pos: string;
};

export type PunjabiDialogueLine = {
  speaker: string;
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiCommonMistake = {
  mistake: string;
  fix_vi: string;
  fix_en: string;
};

export type PunjabiExercise = Record<string, unknown>;

export type PunjabiLesson = {
  id: string;
  category: PunjabiCategoryId;
  level: PunjabiCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: PunjabiLessonSentence[];
  grammar_notes_vi: string;
  grammar_notes_en: string;
  common_mistakes: PunjabiCommonMistake[];
  cultural_notes_vi: string;
  cultural_notes_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  vocabulary: PunjabiVocabEntry[];
  dialogue: PunjabiDialogueLine[];
  exercises: PunjabiExercise[];
};

export const lessons: PunjabiLesson[] = [
  {
    id: "punjabi_a2_daily_routine",
    category: "daily_routine",
    level: "A2",
    title_vi: "Sinh hoạt hằng ngày",
    title_en: "Daily routine",
    sentences: [
      {
        pa: "ਮੈਂ ਸਵੇਰੇ ਛੇ ਵਜੇ ਉੱਠਦਾ ਹਾਂ।",
        romanization: "main savere chhe vaje utthda haan.",
        vi: "Tôi thức dậy lúc sáu giờ sáng.",
        en: "I wake up at six in the morning.",
        grammar_vi: ["ਮੈਂ = tôi; động từ thói quen thường dùng đuôi -ਦਾ/-ਦੀ + ਹਾਂ.", "ਸਵੇਰੇ đứng trước cụm giờ để nói buổi sáng."],
        grammar_en: ["ਮੈਂ = I; habitual verbs often use -ਦਾ/-ਦੀ + ਹਾਂ.", "ਸਵੇਰੇ comes before the clock phrase for morning time."],
      },
      {
        pa: "ਮੈਂ ਨਾਸ਼ਤਾ ਕਰਕੇ ਕੰਮ ਤੇ ਜਾਂਦਾ ਹਾਂ।",
        romanization: "main nashta karke kamm te janda haan.",
        vi: "Tôi ăn sáng rồi đi làm.",
        en: "I have breakfast and then go to work.",
        grammar_vi: ["ਕਰਕੇ = làm xong/rồi; nối hai hành động.", "ਤੇ sau địa điểm nghĩa là 'đến/ở' trong cụm thường ngày."],
        grammar_en: ["ਕਰਕੇ means after doing; it links two actions.", "ਤੇ after a place can mean to/at in daily phrases."],
      },
      {
        pa: "ਸ਼ਾਮ ਨੂੰ ਮੈਂ ਘਰ ਵਾਪਸ ਆਉਂਦਾ ਹਾਂ।",
        romanization: "shaam nu main ghar wapas aunda haan.",
        vi: "Buổi tối tôi trở về nhà.",
        en: "In the evening I come back home.",
        grammar_vi: ["ਨੂੰ đánh dấu thời gian: ਸ਼ਾਮ ਨੂੰ = vào buổi tối.", "ਵਾਪਸ ਆਉਣਾ = quay lại/trở về."],
        grammar_en: ["ਨੂੰ marks time: ਸ਼ਾਮ ਨੂੰ = in the evening.", "ਵਾਪਸ ਆਉਣਾ means to come back."],
      },
    ],
    grammar_notes_vi:
      "Punjabi thường theo trật tự SOV: Chủ ngữ + thông tin phụ + Tân ngữ + Động từ. Với thói quen, dùng gốc động từ + ਦਾ/ਦੀ/ਦੇ + ਹਾਂ/ਹੈ/ਹਨ. Người nói nữ thường dùng -ਦੀ cho bản thân: ਮੈਂ ਜਾਂਦੀ ਹਾਂ.",
    grammar_notes_en:
      "Punjabi is usually SOV: Subject + extra information + Object + Verb. For habits, use verb stem + ਦਾ/ਦੀ/ਦੇ + ਹਾਂ/ਹੈ/ਹਨ. A female speaker usually says -ਦੀ for herself: ਮੈਂ ਜਾਂਦੀ ਹਾਂ.",
    common_mistakes: [
      {
        mistake: "Putting the verb before the object: ਮੈਂ ਜਾਂਦਾ ਕੰਮ.",
        fix_vi: "Đặt động từ ở cuối: ਮੈਂ ਕੰਮ ਤੇ ਜਾਂਦਾ ਹਾਂ.",
        fix_en: "Put the verb at the end: ਮੈਂ ਕੰਮ ਤੇ ਜਾਂਦਾ ਹਾਂ.",
      },
    ],
    cultural_notes_vi:
      "Trong hội thoại thân mật, người Punjabi hay hỏi về ăn uống và công việc như cách mở đầu lịch sự.",
    cultural_notes_en:
      "In casual Punjabi conversation, questions about food and work are common friendly openers.",
    script_awareness_vi:
      "Bài này dùng Gurmukhi. Shahmukhi cũng được dùng cho Punjabi ở một số cộng đồng, nhưng không phải trọng tâm khóa này.",
    script_awareness_en:
      "This lesson uses Gurmukhi. Shahmukhi is also used for Punjabi in some communities, but it is not the focus here.",
    vocabulary: [
      { word: "ਸਵੇਰੇ", romanization: "savere", vi: "buổi sáng", en: "in the morning", pos: "adverb" },
      { word: "ਉੱਠਣਾ", romanization: "utthna", vi: "thức dậy", en: "to wake up", pos: "verb" },
      { word: "ਨਾਸ਼ਤਾ", romanization: "nashta", vi: "bữa sáng", en: "breakfast", pos: "noun" },
      { word: "ਕੰਮ", romanization: "kamm", vi: "công việc", en: "work", pos: "noun" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਤੁਸੀਂ ਕਦੋਂ ਉੱਠਦੇ ਹੋ?", romanization: "tusi kadon utthde ho?", vi: "Bạn thức dậy lúc nào?", en: "When do you wake up?" },
      { speaker: "B", pa: "ਮੈਂ ਸੱਤ ਵਜੇ ਉੱਠਦਾ ਹਾਂ।", romanization: "main satt vaje utthda haan.", vi: "Tôi dậy lúc bảy giờ.", en: "I wake up at seven." },
    ],
    exercises: [
      { type: "translate", prompt_vi: "Nói: Tôi đi làm buổi sáng.", prompt_en: "Say: I go to work in the morning.", answer: "ਮੈਂ ਸਵੇਰੇ ਕੰਮ ਤੇ ਜਾਂਦਾ ਹਾਂ।" },
    ],
  },
  {
    id: "punjabi_a2_directions_places",
    category: "directions",
    level: "A2",
    title_vi: "Hỏi đường và địa điểm",
    title_en: "Directions and places",
    sentences: [
      {
        pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
        romanization: "bass adda kitthe hai?",
        vi: "Bến xe buýt ở đâu?",
        en: "Where is the bus stop?",
        grammar_vi: ["ਕਿੱਥੇ = ở đâu; thường đứng trước ਹੈ.", "ਹੈ là động từ 'là/ở' cho số ít."],
        grammar_en: ["ਕਿੱਥੇ = where; it usually comes before ਹੈ.", "ਹੈ is the singular be/located verb."],
      },
      {
        pa: "ਸਿੱਧਾ ਜਾਓ, ਫਿਰ ਖੱਬੇ ਮੁੜੋ।",
        romanization: "siddha jao, phir khabbe muro.",
        vi: "Đi thẳng, rồi rẽ trái.",
        en: "Go straight, then turn left.",
        grammar_vi: ["ਜਾਓ và ਮੁੜੋ là mệnh lệnh lịch sự.", "ਫਿਰ = rồi/sau đó."],
        grammar_en: ["ਜਾਓ and ਮੁੜੋ are polite commands.", "ਫਿਰ = then/after that."],
      },
      {
        pa: "ਦੁਕਾਨ ਸੱਜੇ ਪਾਸੇ ਹੈ।",
        romanization: "dukan sajje pase hai.",
        vi: "Cửa hàng ở phía bên phải.",
        en: "The shop is on the right side.",
        grammar_vi: ["ਪਾਸੇ = phía/bên; tính từ hướng đứng trước.", "ਸੱਜੇ/ਖੱਬੇ dùng cho phải/trái."],
        grammar_en: ["ਪਾਸੇ = side; the direction word comes before it.", "ਸੱਜੇ/ਖੱਬੇ are right/left."],
      },
    ],
    grammar_notes_vi:
      "Hỏi vị trí dùng ਕਿੱਥੇ ਹੈ? Với chỉ đường lịch sự, dùng dạng mệnh lệnh -ਓ: ਜਾਓ, ਮੁੜੋ, ਰੁਕੋ. Punjabi đặt cụm địa điểm trước động từ: ਦੁਕਾਨ ਸੱਜੇ ਪਾਸੇ ਹੈ.",
    grammar_notes_en:
      "Ask location with ਕਿੱਥੇ ਹੈ? For polite directions, use the -ਓ command form: ਜਾਓ, ਮੁੜੋ, ਰੁਕੋ. Punjabi places the location phrase before the verb: ਦੁਕਾਨ ਸੱਜੇ ਪਾਸੇ ਹੈ.",
    common_mistakes: [
      {
        mistake: "Using informal commands with strangers.",
        fix_vi: "Khi hỏi đường, dùng dạng lịch sự -ਓ: ਜਾਓ, ਮੁੜੋ.",
        fix_en: "With strangers, use polite -ਓ commands: ਜਾਓ, ਮੁੜੋ.",
      },
    ],
    cultural_notes_vi:
      "Thêm ਜੀ sau lời cảm ơn hoặc xưng hô làm câu mềm hơn: ਧੰਨਵਾਦ ਜੀ.",
    cultural_notes_en:
      "Adding ਜੀ after thanks or address makes the sentence warmer: ਧੰਨਵਾਦ ਜੀ.",
    script_awareness_vi: "Gurmukhi là chữ chính trong bài; Shahmukhi chỉ cần nhận biết ở mức tên gọi.",
    script_awareness_en: "Gurmukhi is the active script here; Shahmukhi is only awareness by name.",
    vocabulary: [
      { word: "ਕਿੱਥੇ", romanization: "kitthe", vi: "ở đâu", en: "where", pos: "question word" },
      { word: "ਸਿੱਧਾ", romanization: "siddha", vi: "thẳng", en: "straight", pos: "adverb" },
      { word: "ਖੱਬੇ", romanization: "khabbe", vi: "bên trái", en: "left", pos: "direction" },
      { word: "ਸੱਜੇ", romanization: "sajje", vi: "bên phải", en: "right", pos: "direction" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਮਾਫ਼ ਕਰਨਾ, ਹਸਪਤਾਲ ਕਿੱਥੇ ਹੈ?", romanization: "maaf karna, haspatal kitthe hai?", vi: "Xin lỗi, bệnh viện ở đâu?", en: "Excuse me, where is the hospital?" },
      { speaker: "B", pa: "ਸਿੱਧਾ ਜਾਓ, ਫਿਰ ਸੱਜੇ ਮੁੜੋ।", romanization: "siddha jao, phir sajje muro.", vi: "Đi thẳng, rồi rẽ phải.", en: "Go straight, then turn right." },
    ],
    exercises: [
      { type: "fill_blank", prompt: "ਬੈਂਕ ___ ਹੈ? (where)", answer: "ਕਿੱਥੇ" },
    ],
  },
  {
    id: "punjabi_a2_time_appointments",
    category: "time",
    level: "A2",
    title_vi: "Giờ giấc và hẹn gặp",
    title_en: "Time and appointments",
    sentences: [
      {
        pa: "ਹੁਣ ਕਿੰਨੇ ਵਜੇ ਹਨ?",
        romanization: "hun kinne vaje han?",
        vi: "Bây giờ là mấy giờ?",
        en: "What time is it now?",
        grammar_vi: ["ਕਿੰਨੇ ਵਜੇ = mấy giờ.", "ਹਨ dùng vì ਵਜੇ ở dạng số nhiều."],
        grammar_en: ["ਕਿੰਨੇ ਵਜੇ = what time.", "ਹਨ is used because ਵਜੇ is plural in this expression."],
      },
      {
        pa: "ਮੀਟਿੰਗ ਦੋ ਵਜੇ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ।",
        romanization: "meeting do vaje shuru hundi hai.",
        vi: "Cuộc họp bắt đầu lúc hai giờ.",
        en: "The meeting starts at two o'clock.",
        grammar_vi: ["Thời gian ਦੋ ਵਜੇ đứng trước động từ.", "ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ = bắt đầu, giống 'becomes started'."],
        grammar_en: ["The time ਦੋ ਵਜੇ comes before the verb.", "ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ means starts."],
      },
      {
        pa: "ਕੀ ਅਸੀਂ ਕੱਲ੍ਹ ਮਿਲ ਸਕਦੇ ਹਾਂ?",
        romanization: "ki asin kallh mil sakde haan?",
        vi: "Ngày mai chúng ta có thể gặp nhau không?",
        en: "Can we meet tomorrow?",
        grammar_vi: ["ਕੀ ở đầu câu tạo câu hỏi yes/no.", "ਸਕਦੇ ਹਾਂ = có thể, với chủ ngữ số nhiều/chúng ta."],
        grammar_en: ["ਕੀ at the start makes a yes/no question.", "ਸਕਦੇ ਹਾਂ = can, with plural/we subject."],
      },
    ],
    grammar_notes_vi:
      "Câu hỏi yes/no thường bắt đầu bằng ਕੀ. Với giờ, dùng số + ਵਜੇ. Từ thời gian như ਅੱਜ, ਕੱਲ੍ਹ, ਹੁਣ thường đứng trước cụm động từ.",
    grammar_notes_en:
      "Yes/no questions often begin with ਕੀ. For clock time, use number + ਵਜੇ. Time words like ਅੱਜ, ਕੱਲ੍ਹ, ਹੁਣ usually come before the verb phrase.",
    common_mistakes: [
      {
        mistake: "Confusing ਕੱਲ੍ਹ as only tomorrow.",
        fix_vi: "ਕੱਲ੍ਹ có thể là hôm qua hoặc ngày mai; ngữ cảnh và thì giúp phân biệt.",
        fix_en: "ਕੱਲ੍ਹ can mean yesterday or tomorrow; context and tense separate the meaning.",
      },
    ],
    cultural_notes_vi: "Giờ hẹn trong nói chuyện thường dùng hệ 12 giờ kèm sáng/chiều khi cần rõ.",
    cultural_notes_en: "Spoken appointments often use a 12-hour clock with morning/evening context when needed.",
    script_awareness_vi: "Tiếp tục đọc Gurmukhi trước; Shahmukhi chỉ là thông tin nhận biết.",
    script_awareness_en: "Keep reading Gurmukhi first; Shahmukhi remains awareness only.",
    vocabulary: [
      { word: "ਹੁਣ", romanization: "hun", vi: "bây giờ", en: "now", pos: "adverb" },
      { word: "ਵਜੇ", romanization: "vaje", vi: "giờ", en: "o'clock", pos: "time word" },
      { word: "ਕੱਲ੍ਹ", romanization: "kallh", vi: "hôm qua/ngày mai", en: "yesterday/tomorrow", pos: "time word" },
      { word: "ਮਿਲਣਾ", romanization: "milna", vi: "gặp", en: "to meet", pos: "verb" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਕੀ ਤੁਸੀਂ ਤਿੰਨ ਵਜੇ ਖਾਲੀ ਹੋ?", romanization: "ki tusi tinn vaje khali ho?", vi: "Bạn rảnh lúc ba giờ không?", en: "Are you free at three?" },
      { speaker: "B", pa: "ਹਾਂ, ਮੈਂ ਤਿੰਨ ਵਜੇ ਆ ਸਕਦਾ ਹਾਂ।", romanization: "haan, main tinn vaje aa sakda haan.", vi: "Vâng, tôi có thể đến lúc ba giờ.", en: "Yes, I can come at three." },
    ],
    exercises: [
      { type: "choice", prompt: "ਕਿੰਨੇ ਵਜੇ?", answer: "What time?", options: ["What time?", "Where?", "Why?"] },
    ],
  },
  {
    id: "punjabi_a2_weather_plans",
    category: "weather",
    level: "A2",
    title_vi: "Thời tiết và kế hoạch",
    title_en: "Weather and plans",
    sentences: [
      {
        pa: "ਅੱਜ ਮੌਸਮ ਚੰਗਾ ਹੈ।",
        romanization: "ajj mausam changa hai.",
        vi: "Hôm nay thời tiết đẹp.",
        en: "The weather is nice today.",
        grammar_vi: ["ਚੰਗਾ đồng ý với ਮੌਸਮ giống đực số ít.", "ਅੱਜ có thể đứng đầu câu."],
        grammar_en: ["ਚੰਗਾ agrees with masculine singular ਮੌਸਮ.", "ਅੱਜ can lead the sentence."],
      },
      {
        pa: "ਕੱਲ੍ਹ ਮੀਂਹ ਪਿਆ ਸੀ।",
        romanization: "kallh meenh pia si.",
        vi: "Hôm qua trời đã mưa.",
        en: "It rained yesterday.",
        grammar_vi: ["ਮੀਂਹ ਪੈਣਾ = mưa rơi; quá khứ: ਪਿਆ ਸੀ.", "ਕੱਲ੍ਹ ở đây hiểu là hôm qua nhờ quá khứ."],
        grammar_en: ["ਮੀਂਹ ਪੈਣਾ literally means rain falls; past: ਪਿਆ ਸੀ.", "ਕੱਲ੍ਹ means yesterday here because the verb is past."],
      },
      {
        pa: "ਜੇ ਠੰਢ ਹੋਵੇਗੀ, ਮੈਂ ਕੋਟ ਪਾਵਾਂਗਾ।",
        romanization: "je thand hovegi, main coat pavanga.",
        vi: "Nếu trời lạnh, tôi sẽ mặc áo khoác.",
        en: "If it is cold, I will wear a coat.",
        grammar_vi: ["ਜੇ = nếu; mệnh đề điều kiện đứng đầu tự nhiên.", "ਪਾਵਾਂਗਾ là tương lai ngôi tôi cho người nói nam."],
        grammar_en: ["ਜੇ = if; the condition can naturally come first.", "ਪਾਵਾਂਗਾ is first-person future for a male speaker."],
      },
    ],
    grammar_notes_vi:
      "Thời tiết dùng nhiều cụm cố định: ਮੀਂਹ ਪੈਣਾ, ਠੰਢ ਹੋਣਾ, ਗਰਮੀ ਹੋਣਾ. Tính từ Punjabi thường đổi theo giống/số: ਚੰਗਾ, ਚੰਗੀ, ਚੰਗੇ.",
    grammar_notes_en:
      "Weather uses fixed chunks: ਮੀਂਹ ਪੈਣਾ, ਠੰਢ ਹੋਣਾ, ਗਰਮੀ ਹੋਣਾ. Punjabi adjectives often change by gender/number: ਚੰਗਾ, ਚੰਗੀ, ਚੰਗੇ.",
    common_mistakes: [
      {
        mistake: "Translating 'it rains' with an empty subject.",
        fix_vi: "Punjabi không cần 'it'; dùng cụm ਮੀਂਹ ਪੈਂਦਾ ਹੈ hoặc ਮੀਂਹ ਪਿਆ ਸੀ.",
        fix_en: "Punjabi does not need dummy 'it'; use ਮੀਂਹ ਪੈਂਦਾ ਹੈ or ਮੀਂਹ ਪਿਆ ਸੀ.",
      },
    ],
    cultural_notes_vi: "Nói về thời tiết là cách dễ mở chuyện, nhất là trước khi bàn kế hoạch đi lại.",
    cultural_notes_en: "Weather talk is an easy opener, especially before discussing travel plans.",
    script_awareness_vi: "Mục tiêu đọc/viết là Gurmukhi; Shahmukhi chỉ được nhắc để nhận biết sự tồn tại.",
    script_awareness_en: "The reading/writing target is Gurmukhi; Shahmukhi is mentioned only for awareness.",
    vocabulary: [
      { word: "ਮੌਸਮ", romanization: "mausam", vi: "thời tiết", en: "weather", pos: "noun" },
      { word: "ਮੀਂਹ", romanization: "meenh", vi: "mưa", en: "rain", pos: "noun" },
      { word: "ਠੰਢ", romanization: "thand", vi: "lạnh", en: "cold", pos: "noun/adjective" },
      { word: "ਗਰਮੀ", romanization: "garmi", vi: "nóng", en: "heat", pos: "noun" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਅੱਜ ਬਾਹਰ ਚੱਲੀਏ?", romanization: "ajj bahar challiye?", vi: "Hôm nay ra ngoài nhé?", en: "Shall we go outside today?" },
      { speaker: "B", pa: "ਹਾਂ, ਮੌਸਮ ਚੰਗਾ ਹੈ।", romanization: "haan, mausam changa hai.", vi: "Ừ, thời tiết đẹp.", en: "Yes, the weather is nice." },
    ],
    exercises: [
      { type: "fill_blank", prompt: "ਕੱਲ੍ਹ ___ ਪਿਆ ਸੀ। (rain)", answer: "ਮੀਂਹ" },
    ],
  },
  {
    id: "punjabi_a2_simple_past",
    category: "simple_past",
    level: "A2",
    title_vi: "Quá khứ đơn trong việc hằng ngày",
    title_en: "Simple past for daily events",
    sentences: [
      {
        pa: "ਮੈਂ ਕੱਲ੍ਹ ਬਾਜ਼ਾਰ ਗਿਆ ਸੀ।",
        romanization: "main kallh bazar gia si.",
        vi: "Hôm qua tôi đã đi chợ.",
        en: "I went to the market yesterday.",
        grammar_vi: ["ਗਿਆ ਸੀ = đã đi, người nói nam.", "Người nói nữ thường nói ਗਈ ਸੀ."],
        grammar_en: ["ਗਿਆ ਸੀ = went, for a male speaker.", "A female speaker usually says ਗਈ ਸੀ."],
      },
      {
        pa: "ਉਸ ਨੇ ਚਾਹ ਪੀਤੀ।",
        romanization: "us ne chah piti.",
        vi: "Anh ấy/cô ấy đã uống trà.",
        en: "He/she drank tea.",
        grammar_vi: ["ਨੇ đánh dấu chủ thể trong nhiều câu quá khứ ngoại động.", "ਪੀਤੀ đồng ý với ਚਾਹ giống cái."],
        grammar_en: ["ਨੇ marks the doer in many transitive past sentences.", "ਪੀਤੀ agrees with feminine ਚਾਹ."],
      },
      {
        pa: "ਅਸੀਂ ਫ਼ਿਲਮ ਦੇਖੀ।",
        romanization: "asin film dekhi.",
        vi: "Chúng tôi đã xem phim.",
        en: "We watched a movie.",
        grammar_vi: ["ਦੇਖੀ đồng ý với ਫ਼ਿਲਮ giống cái.", "Có thể nghe ਅਸੀਂ ਨੇ trong một số cách nói, nhưng ਅਸੀਂ ਫ਼ਿਲਮ ਦੇਖੀ rất tự nhiên."],
        grammar_en: ["ਦੇਖੀ agrees with feminine ਫ਼ਿਲਮ.", "You may hear ਅਸੀਂ ਨੇ in some speech, but ਅਸੀਂ ਫ਼ਿਲਮ ਦੇਖੀ is natural."],
      },
    ],
    grammar_notes_vi:
      "Quá khứ Punjabi có phần khó ở agreement. Với nhiều động từ ngoại động, chủ thể có ਨੇ và động từ đồng ý với tân ngữ: ਉਸ ਨੇ ਚਾਹ ਪੀਤੀ. Với ਜਾਣਾ, người nói nam/female đổi ਗਿਆ/ਗਈ.",
    grammar_notes_en:
      "Punjabi past tense is tricky because of agreement. With many transitive verbs, the doer takes ਨੇ and the verb agrees with the object: ਉਸ ਨੇ ਚਾਹ ਪੀਤੀ. With ਜਾਣਾ, speaker gender changes ਗਿਆ/ਗਈ.",
    common_mistakes: [
      {
        mistake: "Using ਗਿਆ for every speaker.",
        fix_vi: "Đổi theo người nói/chủ ngữ: nam ਗਿਆ, nữ ਗਈ, số nhiều ਗਏ.",
        fix_en: "Match the subject/speaker: masculine ਗਿਆ, feminine ਗਈ, plural ਗਏ.",
      },
    ],
    cultural_notes_vi: "Ở A2, ưu tiên các cụm quá khứ hay dùng thay vì cố phân tích mọi biến thể.",
    cultural_notes_en: "At A2, prioritize common past-tense chunks before analyzing every variation.",
    script_awareness_vi: "Tất cả ví dụ dùng Gurmukhi; Shahmukhi không được dạy như hệ chữ thứ hai ở đây.",
    script_awareness_en: "All examples use Gurmukhi; Shahmukhi is awareness only, not taught as a second script here.",
    vocabulary: [
      { word: "ਕੱਲ੍ਹ", romanization: "kallh", vi: "hôm qua/ngày mai", en: "yesterday/tomorrow", pos: "time word" },
      { word: "ਬਾਜ਼ਾਰ", romanization: "bazar", vi: "chợ", en: "market", pos: "noun" },
      { word: "ਪੀਣਾ", romanization: "pina", vi: "uống", en: "to drink", pos: "verb" },
      { word: "ਦੇਖਣਾ", romanization: "dekhna", vi: "xem", en: "to watch/see", pos: "verb" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਤੁਸੀਂ ਕੱਲ੍ਹ ਕੀ ਕੀਤਾ?", romanization: "tusi kallh ki kita?", vi: "Hôm qua bạn đã làm gì?", en: "What did you do yesterday?" },
      { speaker: "B", pa: "ਮੈਂ ਬਾਜ਼ਾਰ ਗਿਆ ਸੀ।", romanization: "main bazar gia si.", vi: "Tôi đã đi chợ.", en: "I went to the market." },
    ],
    exercises: [
      { type: "choice", prompt: "Female speaker: I went.", answer: "ਮੈਂ ਗਈ ਸੀ।", options: ["ਮੈਂ ਗਿਆ ਸੀ।", "ਮੈਂ ਗਈ ਸੀ।"] },
    ],
  },
  {
    id: "punjabi_a2_simple_future",
    category: "simple_future",
    level: "A2",
    title_vi: "Tương lai đơn và dự định",
    title_en: "Simple future and plans",
    sentences: [
      {
        pa: "ਮੈਂ ਕੱਲ੍ਹ ਫ਼ੋਨ ਕਰਾਂਗਾ।",
        romanization: "main kallh phone karanga.",
        vi: "Ngày mai tôi sẽ gọi điện.",
        en: "I will call tomorrow.",
        grammar_vi: ["ਕਰਾਂਗਾ = tôi sẽ làm/gọi, người nói nam.", "Người nói nữ thường dùng ਕਰਾਂਗੀ."],
        grammar_en: ["ਕਰਾਂਗਾ = I will do/call, for a male speaker.", "A female speaker usually uses ਕਰਾਂਗੀ."],
      },
      {
        pa: "ਅਸੀਂ ਸ਼ਾਮ ਨੂੰ ਪੜ੍ਹਾਂਗੇ।",
        romanization: "asin shaam nu parhange.",
        vi: "Chúng tôi sẽ học vào buổi tối.",
        en: "We will study in the evening.",
        grammar_vi: ["-ਾਂਗੇ là đuôi tương lai cho 'chúng tôi/chúng ta'.", "ਨੂੰ đánh dấu thời gian."],
        grammar_en: ["-ਾਂਗੇ is the future ending for we.", "ਨੂੰ marks time."],
      },
      {
        pa: "ਉਹ ਜਲਦੀ ਆਵੇਗੀ।",
        romanization: "oh jaldi aavegi.",
        vi: "Cô ấy sẽ đến sớm.",
        en: "She will come soon.",
        grammar_vi: ["ਆਵੇਗੀ đồng ý với chủ ngữ giống cái.", "ਜਲਦੀ = sớm/nhanh."],
        grammar_en: ["ਆਵੇਗੀ agrees with a feminine subject.", "ਜਲਦੀ = soon/quickly."],
      },
    ],
    grammar_notes_vi:
      "Tương lai thường thêm đuôi vào gốc động từ: ਕਰਾਂਗਾ/ਕਰਾਂਗੀ, ਆਵੇਗਾ/ਆਵੇਗੀ, ਪੜ੍ਹਾਂਗੇ. Đuôi thay đổi theo ngôi, số và giống.",
    grammar_notes_en:
      "The future often adds endings to the verb stem: ਕਰਾਂਗਾ/ਕਰਾਂਗੀ, ਆਵੇਗਾ/ਆਵੇਗੀ, ਪੜ੍ਹਾਂਗੇ. The ending changes for person, number, and gender.",
    common_mistakes: [
      {
        mistake: "Using one future ending for everyone.",
        fix_vi: "Học theo cụm chủ ngữ: ਮੈਂ ਕਰਾਂਗਾ/ਕਰਾਂਗੀ, ਅਸੀਂ ਕਰਾਂਗੇ, ਉਹ ਕਰੇਗੀ.",
        fix_en: "Learn endings with subjects: ਮੈਂ ਕਰਾਂਗਾ/ਕਰਾਂਗੀ, ਅਸੀਂ ਕਰਾਂਗੇ, ਉਹ ਕਰੇਗੀ.",
      },
    ],
    cultural_notes_vi: "Khi hứa sẽ gọi/đến, thêm ਜ਼ਰੂਰ để nhấn mạnh: ਮੈਂ ਜ਼ਰੂਰ ਆਵਾਂਗਾ.",
    cultural_notes_en: "When promising to call/come, add ਜ਼ਰੂਰ for emphasis: ਮੈਂ ਜ਼ਰੂਰ ਆਵਾਂਗਾ.",
    script_awareness_vi: "Gurmukhi là hệ chữ luyện tập; Shahmukhi chỉ được nhắc để người học không bất ngờ khi gặp tên này.",
    script_awareness_en: "Gurmukhi is the practice script; Shahmukhi is mentioned only so learners recognize the name.",
    vocabulary: [
      { word: "ਫ਼ੋਨ ਕਰਨਾ", romanization: "phone karna", vi: "gọi điện", en: "to call", pos: "verb phrase" },
      { word: "ਪੜ੍ਹਨਾ", romanization: "parhna", vi: "học/đọc", en: "to study/read", pos: "verb" },
      { word: "ਜਲਦੀ", romanization: "jaldi", vi: "sớm/nhanh", en: "soon/quickly", pos: "adverb" },
      { word: "ਜ਼ਰੂਰ", romanization: "zarur", vi: "chắc chắn", en: "certainly", pos: "adverb" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਕੀ ਤੁਸੀਂ ਕੱਲ੍ਹ ਆਓਗੇ?", romanization: "ki tusi kallh aaoge?", vi: "Ngày mai bạn sẽ đến chứ?", en: "Will you come tomorrow?" },
      { speaker: "B", pa: "ਹਾਂ, ਮੈਂ ਜ਼ਰੂਰ ਆਵਾਂਗਾ।", romanization: "haan, main zarur aavanga.", vi: "Vâng, tôi chắc chắn sẽ đến.", en: "Yes, I will certainly come." },
    ],
    exercises: [
      { type: "fill_blank", prompt: "ਮੈਂ ਕੱਲ੍ਹ ਫ਼ੋਨ ___।", answer: "ਕਰਾਂਗਾ" },
    ],
  },
  {
    id: "punjabi_a2_polite_requests",
    category: "requests",
    level: "A2",
    title_vi: "Yêu cầu lịch sự",
    title_en: "Polite requests",
    sentences: [
      {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।",
        romanization: "kirpa karke hauli bolo.",
        vi: "Làm ơn nói chậm thôi.",
        en: "Please speak slowly.",
        grammar_vi: ["ਕਿਰਪਾ ਕਰਕੇ = làm ơn.", "ਬੋਲੋ là mệnh lệnh lịch sự."],
        grammar_en: ["ਕਿਰਪਾ ਕਰਕੇ = please.", "ਬੋਲੋ is a polite command."],
      },
      {
        pa: "ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusi meri madad kar sakde ho?",
        vi: "Bạn có thể giúp tôi không?",
        en: "Can you help me?",
        grammar_vi: ["ਮੇਰੀ đồng ý với ਮਦਦ giống cái.", "ਕਰ ਸਕਦੇ ਹੋ = bạn có thể làm."],
        grammar_en: ["ਮੇਰੀ agrees with feminine ਮਦਦ.", "ਕਰ ਸਕਦੇ ਹੋ = you can do."],
      },
      {
        pa: "ਮੈਨੂੰ ਇੱਕ ਗਲਾਸ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
        romanization: "mainu ikk glass pani chahida hai.",
        vi: "Tôi cần một ly nước.",
        en: "I need a glass of water.",
        grammar_vi: ["ਮੈਨੂੰ = cho tôi/đối với tôi.", "ਚਾਹੀਦਾ ਹੈ diễn tả cần/muốn một cách lịch sự."],
        grammar_en: ["ਮੈਨੂੰ = to me/for me.", "ਚਾਹੀਦਾ ਹੈ expresses need/want politely."],
      },
    ],
    grammar_notes_vi:
      "Yêu cầu lịch sự có ba khung A2 mạnh: ਕਿਰਪਾ ਕਰਕੇ + mệnh lệnh, ਕੀ ਤੁਸੀਂ ... ਸਕਦੇ ਹੋ?, và ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ. Dùng ਤੁਸੀਂ với người lạ hoặc người lớn tuổi.",
    grammar_notes_en:
      "Three strong A2 request frames are ਕਿਰਪਾ ਕਰਕੇ + command, ਕੀ ਤੁਸੀਂ ... ਸਕਦੇ ਹੋ?, and ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ. Use ਤੁਸੀਂ with strangers or elders.",
    common_mistakes: [
      {
        mistake: "Using ਤੂੰ with strangers.",
        fix_vi: "ਤੂੰ rất thân mật. Dùng ਤੁਸੀਂ để lịch sự và an toàn.",
        fix_en: "ਤੂੰ is very informal. Use ਤੁਸੀਂ to stay polite and safe.",
      },
    ],
    cultural_notes_vi: "ਜੀ và ਕਿਰਪਾ ਕਰਕੇ giúp câu mềm hơn, nhất là khi nhờ người lạ.",
    cultural_notes_en: "ਜੀ and ਕਿਰਪਾ ਕਰਕੇ soften requests, especially with strangers.",
    script_awareness_vi: "Bài học vẫn lấy Gurmukhi làm chữ chính; Shahmukhi chỉ là nhận biết văn hóa chữ viết.",
    script_awareness_en: "The lesson remains Gurmukhi-first; Shahmukhi is only writing-system awareness.",
    vocabulary: [
      { word: "ਕਿਰਪਾ ਕਰਕੇ", romanization: "kirpa karke", vi: "làm ơn", en: "please", pos: "phrase" },
      { word: "ਹੌਲੀ", romanization: "hauli", vi: "chậm/nhẹ", en: "slowly/softly", pos: "adverb" },
      { word: "ਮਦਦ", romanization: "madad", vi: "sự giúp đỡ", en: "help", pos: "noun" },
      { word: "ਚਾਹੀਦਾ", romanization: "chahida", vi: "cần", en: "needed", pos: "modal adjective" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖੋ।", romanization: "kirpa karke ih likho.", vi: "Làm ơn viết cái này.", en: "Please write this." },
      { speaker: "B", pa: "ਜੀ, ਮੈਂ ਲਿਖਦਾ ਹਾਂ।", romanization: "ji, main likhda haan.", vi: "Vâng, tôi viết đây.", en: "Yes, I will write it." },
    ],
    exercises: [
      { type: "rewrite", prompt: "Make polite: ਹੌਲੀ ਬੋਲ.", answer: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।" },
    ],
  },
  {
    id: "punjabi_a2_preferences",
    category: "preferences",
    level: "A2",
    title_vi: "Sở thích và lựa chọn",
    title_en: "Preferences and choices",
    sentences: [
      {
        pa: "ਮੈਨੂੰ ਪੰਜਾਬੀ ਸੰਗੀਤ ਪਸੰਦ ਹੈ।",
        romanization: "mainu punjabi sangeet pasand hai.",
        vi: "Tôi thích nhạc Punjabi.",
        en: "I like Punjabi music.",
        grammar_vi: ["ਮੈਨੂੰ ... ਪਸੰਦ ਹੈ = tôi thích ...", "Cấu trúc nghĩa đen gần như 'đối với tôi ... được thích'."],
        grammar_en: ["ਮੈਨੂੰ ... ਪਸੰਦ ਹੈ = I like ...", "The literal shape is closer to 'to me ... is liked'."],
      },
      {
        pa: "ਤੁਹਾਨੂੰ ਚਾਹ ਚਾਹੀਦੀ ਹੈ ਜਾਂ ਕਾਫ਼ੀ?",
        romanization: "tuhanu chah chahidi hai jaan coffee?",
        vi: "Bạn muốn trà hay cà phê?",
        en: "Would you like tea or coffee?",
        grammar_vi: ["ਜਾਂ = hoặc/hay trong lựa chọn.", "ਚਾਹੀਦੀ đồng ý với ਚਾਹ giống cái."],
        grammar_en: ["ਜਾਂ = or in choices.", "ਚਾਹੀਦੀ agrees with feminine ਚਾਹ."],
      },
      {
        pa: "ਮੈਨੂੰ ਮਸਾਲੇਦਾਰ ਖਾਣਾ ਜ਼ਿਆਦਾ ਪਸੰਦ ਹੈ।",
        romanization: "mainu masaledar khana zyada pasand hai.",
        vi: "Tôi thích đồ ăn cay hơn.",
        en: "I prefer spicy food more.",
        grammar_vi: ["ਜ਼ਿਆਦਾ ਪਸੰਦ = thích hơn/nhiều hơn.", "ਖਾਣਾ là danh từ giống đực số ít nên ਮਸਾਲੇਦਾਰ không đổi rõ ở đây."],
        grammar_en: ["ਜ਼ਿਆਦਾ ਪਸੰਦ = like more/prefer.", "ਖਾਣਾ is masculine singular; ਮਸਾਲੇਦਾਰ stays the same here."],
      },
    ],
    grammar_notes_vi:
      "Với 'thích', Punjabi dùng experiencer + ਨੂੰ: ਮੈਨੂੰ/ਤੁਹਾਨੂੰ ... ਪਸੰਦ ਹੈ. Đây khác tiếng Anh 'I like' nhưng khá gần tiếng Việt 'đối với tôi thì...'.",
    grammar_notes_en:
      "For liking, Punjabi uses experiencer + ਨੂੰ: ਮੈਨੂੰ/ਤੁਹਾਨੂੰ ... ਪਸੰਦ ਹੈ. This differs from English 'I like' and is closer to 'to me, ... is pleasing'.",
    common_mistakes: [
      {
        mistake: "Saying ਮੈਂ ਪਸੰਦ ... by copying English word order.",
        fix_vi: "Dùng ਮੈਨੂੰ + vật được thích + ਪਸੰਦ ਹੈ.",
        fix_en: "Use ਮੈਨੂੰ + liked thing + ਪਸੰਦ ਹੈ.",
      },
    ],
    cultural_notes_vi: "Khi được mời đồ ăn/uống, trả lời mềm bằng ਥੋੜ੍ਹੀ/ਥੋੜ੍ਹਾ hoặc ਨਹੀਂ ਧੰਨਵਾਦ.",
    cultural_notes_en: "When offered food or drink, soften answers with ਥੋੜ੍ਹੀ/ਥੋੜ੍ਹਾ or ਨਹੀਂ ਧੰਨਵਾਦ.",
    script_awareness_vi: "Gurmukhi là chữ học chính; Shahmukhi chỉ được nhắc như một hệ chữ Punjabi khác.",
    script_awareness_en: "Gurmukhi is the main learning script; Shahmukhi is only noted as another Punjabi script.",
    vocabulary: [
      { word: "ਪਸੰਦ", romanization: "pasand", vi: "thích", en: "liked/preference", pos: "noun/adjective" },
      { word: "ਜਾਂ", romanization: "jaan", vi: "hoặc", en: "or", pos: "conjunction" },
      { word: "ਮਸਾਲੇਦਾਰ", romanization: "masaledar", vi: "cay/nhiều gia vị", en: "spicy", pos: "adjective" },
      { word: "ਜ਼ਿਆਦਾ", romanization: "zyada", vi: "hơn/nhiều", en: "more", pos: "adverb" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਤੁਹਾਨੂੰ ਕੀ ਪਸੰਦ ਹੈ?", romanization: "tuhanu ki pasand hai?", vi: "Bạn thích gì?", en: "What do you like?" },
      { speaker: "B", pa: "ਮੈਨੂੰ ਚਾਹ ਅਤੇ ਸੰਗੀਤ ਪਸੰਦ ਹੈ।", romanization: "mainu chah ate sangeet pasand hai.", vi: "Tôi thích trà và âm nhạc.", en: "I like tea and music." },
    ],
    exercises: [
      { type: "translate", prompt_vi: "Tôi thích cà phê.", prompt_en: "I like coffee.", answer: "ਮੈਨੂੰ ਕਾਫ਼ੀ ਪਸੰਦ ਹੈ।" },
    ],
  },
  {
    id: "punjabi_a2_health_basics",
    category: "health",
    level: "A2",
    title_vi: "Sức khỏe cơ bản",
    title_en: "Health basics",
    sentences: [
      {
        pa: "ਮੇਰੇ ਸਿਰ ਵਿੱਚ ਦਰਦ ਹੈ।",
        romanization: "mere sir vich dard hai.",
        vi: "Tôi bị đau đầu.",
        en: "I have a headache.",
        grammar_vi: ["ਮੇਰੇ ਸਿਰ ਵਿੱਚ = trong/ở đầu của tôi.", "ਦਰਦ ਹੈ = có đau."],
        grammar_en: ["ਮੇਰੇ ਸਿਰ ਵਿੱਚ = in my head.", "ਦਰਦ ਹੈ = there is pain."],
      },
      {
        pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨੂੰ ਮਿਲਣਾ ਹੈ।",
        romanization: "mainu doctor nu milna hai.",
        vi: "Tôi cần gặp bác sĩ.",
        en: "I need to see a doctor.",
        grammar_vi: ["ਮੈਨੂੰ ... ਮਿਲਣਾ ਹੈ = tôi cần/phải gặp.", "ਡਾਕਟਰ ਨੂੰ đánh dấu người được gặp."],
        grammar_en: ["ਮੈਨੂੰ ... ਮਿਲਣਾ ਹੈ = I need/have to meet.", "ਡਾਕਟਰ ਨੂੰ marks the person being met."],
      },
      {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਦਵਾਈ ਕਦੋਂ ਲੈਣੀ ਹੈ?",
        romanization: "kirpa karke davai kadon laini hai?",
        vi: "Làm ơn cho biết khi nào phải uống thuốc?",
        en: "Please, when should I take the medicine?",
        grammar_vi: ["ਕਦੋਂ = khi nào.", "ਲੈਣੀ đồng ý với ਦਵਾਈ giống cái."],
        grammar_en: ["ਕਦੋਂ = when.", "ਲੈਣੀ agrees with feminine ਦਵਾਈ."],
      },
    ],
    grammar_notes_vi:
      "Triệu chứng thường nói bằng 'ở bộ phận cơ thể + đau có': ਮੇਰੇ ਪੇਟ ਵਿੱਚ ਦਰਦ ਹੈ. Với nhu cầu y tế, ਮੈਨੂੰ ... ਹੈ là khung rất hữu ích.",
    grammar_notes_en:
      "Symptoms are often expressed as 'in body part + pain exists': ਮੇਰੇ ਪੇਟ ਵਿੱਚ ਦਰਦ ਹੈ. For medical needs, ਮੈਨੂੰ ... ਹੈ is a very useful frame.",
    common_mistakes: [
      {
        mistake: "Directly translating 'I am headache'.",
        fix_vi: "Nói 'đau có ở đầu tôi': ਮੇਰੇ ਸਿਰ ਵਿੱਚ ਦਰਦ ਹੈ.",
        fix_en: "Say 'pain exists in my head': ਮੇਰੇ ਸਿਰ ਵਿੱਚ ਦਰਦ ਹੈ.",
      },
    ],
    cultural_notes_vi: "Trong tình huống y tế, nói chậm, dùng câu ngắn và đưa thông tin thời gian: ਕੱਲ੍ਹ ਤੋਂ = từ hôm qua.",
    cultural_notes_en: "In medical situations, speak slowly, use short sentences, and give timing: ਕੱਲ੍ਹ ਤੋਂ = since yesterday.",
    script_awareness_vi: "Gurmukhi là chữ cần đọc trong tình huống này; Shahmukhi chỉ là nhận biết.",
    script_awareness_en: "Gurmukhi is the script to read in this lesson; Shahmukhi is awareness only.",
    vocabulary: [
      { word: "ਸਿਰ", romanization: "sir", vi: "đầu", en: "head", pos: "noun" },
      { word: "ਦਰਦ", romanization: "dard", vi: "đau", en: "pain", pos: "noun" },
      { word: "ਡਾਕਟਰ", romanization: "doctor", vi: "bác sĩ", en: "doctor", pos: "noun" },
      { word: "ਦਵਾਈ", romanization: "davai", vi: "thuốc", en: "medicine", pos: "noun" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਤੁਹਾਨੂੰ ਕੀ ਸਮੱਸਿਆ ਹੈ?", romanization: "tuhanu ki samassia hai?", vi: "Bạn có vấn đề gì?", en: "What problem do you have?" },
      { speaker: "B", pa: "ਮੇਰੇ ਸਿਰ ਵਿੱਚ ਦਰਦ ਹੈ।", romanization: "mere sir vich dard hai.", vi: "Tôi bị đau đầu.", en: "I have a headache." },
    ],
    exercises: [
      { type: "fill_blank", prompt: "ਮੇਰੇ ਪੇਟ ਵਿੱਚ ___ ਹੈ। (pain)", answer: "ਦਰਦ" },
    ],
  },
  {
    id: "punjabi_a2_school_work",
    category: "school_work",
    level: "A2",
    title_vi: "Trường học và công việc",
    title_en: "School and work basics",
    sentences: [
      {
        pa: "ਮੈਂ ਦਫ਼ਤਰ ਵਿੱਚ ਕੰਮ ਕਰਦਾ ਹਾਂ।",
        romanization: "main daftar vich kamm karda haan.",
        vi: "Tôi làm việc trong văn phòng.",
        en: "I work in an office.",
        grammar_vi: ["ਵਿੱਚ = trong/ở trong.", "ਕੰਮ ਕਰਦਾ ਹਾਂ = tôi làm việc, người nói nam."],
        grammar_en: ["ਵਿੱਚ = in/inside.", "ਕੰਮ ਕਰਦਾ ਹਾਂ = I work, for a male speaker."],
      },
      {
        pa: "ਮੇਰੀ ਕਲਾਸ ਨੌਂ ਵਜੇ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ।",
        romanization: "meri class naun vaje shuru hundi hai.",
        vi: "Lớp của tôi bắt đầu lúc chín giờ.",
        en: "My class starts at nine o'clock.",
        grammar_vi: ["ਮੇਰੀ vì ਕਲਾਸ được xử lý như giống cái.", "ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ đồng ý với ਕਲਾਸ."],
        grammar_en: ["ਮੇਰੀ is used because ਕਲਾਸ is treated as feminine.", "ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ agrees with ਕਲਾਸ."],
      },
      {
        pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਈਮੇਲ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusi ih email bhej sakde ho?",
        vi: "Bạn có thể gửi email này không?",
        en: "Can you send this email?",
        grammar_vi: ["ਇਹ = này/cái này, đứng trước danh từ.", "ਭੇਜ ਸਕਦੇ ਹੋ = bạn có thể gửi."],
        grammar_en: ["ਇਹ = this, placed before the noun.", "ਭੇਜ ਸਕਦੇ ਹੋ = you can send."],
      },
    ],
    grammar_notes_vi:
      "Trong bối cảnh học/việc, các cụm địa điểm dùng ਵਿੱਚ hoặc ਤੇ: ਦਫ਼ਤਰ ਵਿੱਚ, ਕੰਮ ਤੇ. Câu nhờ đồng nghiệp dùng ਕੀ ਤੁਸੀਂ ... ਸਕਦੇ ਹੋ? để lịch sự.",
    grammar_notes_en:
      "For school/work places, use ਵਿੱਚ or ਤੇ: ਦਫ਼ਤਰ ਵਿੱਚ, ਕੰਮ ਤੇ. Requests to coworkers use ਕੀ ਤੁਸੀਂ ... ਸਕਦੇ ਹੋ? for politeness.",
    common_mistakes: [
      {
        mistake: "Dropping postpositions like ਵਿੱਚ/ਤੇ.",
        fix_vi: "Punjabi cần hậu giới từ sau danh từ: ਦਫ਼ਤਰ ਵਿੱਚ, ਸਕੂਲ ਤੇ.",
        fix_en: "Punjabi needs postpositions after nouns: ਦਫ਼ਤਰ ਵਿੱਚ, ਸਕੂਲ ਤੇ.",
      },
    ],
    cultural_notes_vi: "Trong môi trường chuyên nghiệp, ਤੁਸੀਂ an toàn hơn ਤੂੰ; thêm ਜੀ khi gọi tên người lớn tuổi hơn.",
    cultural_notes_en: "In professional settings, ਤੁਸੀਂ is safer than ਤੂੰ; add ਜੀ when addressing an elder.",
    script_awareness_vi: "Các biểu mẫu trong bài dùng Gurmukhi; Shahmukhi chỉ được nhắc ở mức nhận biết.",
    script_awareness_en: "The forms in this lesson use Gurmukhi; Shahmukhi is only noted for awareness.",
    vocabulary: [
      { word: "ਦਫ਼ਤਰ", romanization: "daftar", vi: "văn phòng", en: "office", pos: "noun" },
      { word: "ਕਲਾਸ", romanization: "class", vi: "lớp học", en: "class", pos: "noun" },
      { word: "ਈਮੇਲ", romanization: "email", vi: "email", en: "email", pos: "noun" },
      { word: "ਭੇਜਣਾ", romanization: "bhejna", vi: "gửi", en: "to send", pos: "verb" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਤੁਹਾਡੀ ਕਲਾਸ ਕਦੋਂ ਹੈ?", romanization: "tuhadi class kadon hai?", vi: "Lớp của bạn khi nào?", en: "When is your class?" },
      { speaker: "B", pa: "ਮੇਰੀ ਕਲਾਸ ਨੌਂ ਵਜੇ ਹੈ।", romanization: "meri class naun vaje hai.", vi: "Lớp của tôi lúc chín giờ.", en: "My class is at nine." },
    ],
    exercises: [
      { type: "translate", prompt_vi: "Bạn có thể gửi email này không?", prompt_en: "Can you send this email?", answer: "ਕੀ ਤੁਸੀਂ ਇਹ ਈਮੇਲ ਭੇਜ ਸਕਦੇ ਹੋ?" },
    ],
  },
  {
    id: "punjabi_a2_review_mixed_day",
    category: "daily_routine",
    level: "A2",
    title_vi: "Ôn tập: một ngày đơn giản",
    title_en: "Review: a simple day",
    sentences: [
      {
        pa: "ਸਵੇਰੇ ਮੈਂ ਪੜ੍ਹਦਾ ਹਾਂ, ਫਿਰ ਕੰਮ ਤੇ ਜਾਂਦਾ ਹਾਂ।",
        romanization: "savere main parhda haan, phir kamm te janda haan.",
        vi: "Buổi sáng tôi học, rồi đi làm.",
        en: "In the morning I study, then go to work.",
        grammar_vi: ["ਫਿਰ nối trình tự hành động.", "Hai động từ thói quen đều kết thúc bằng ਹਾਂ."],
        grammar_en: ["ਫਿਰ links a sequence of actions.", "Both habitual verbs end with ਹਾਂ."],
      },
      {
        pa: "ਦੁਪਹਿਰ ਨੂੰ ਮੈਂ ਦੋਸਤ ਨੂੰ ਫ਼ੋਨ ਕੀਤਾ।",
        romanization: "dupehar nu main dost nu phone kita.",
        vi: "Buổi trưa tôi đã gọi điện cho bạn.",
        en: "At noon I called a friend.",
        grammar_vi: ["ਦੁਪਹਿਰ ਨੂੰ = vào buổi trưa.", "ਫ਼ੋਨ ਕੀਤਾ = đã gọi điện."],
        grammar_en: ["ਦੁਪਹਿਰ ਨੂੰ = at noon/in the afternoon.", "ਫ਼ੋਨ ਕੀਤਾ = called by phone."],
      },
      {
        pa: "ਰਾਤ ਨੂੰ ਮੈਂ ਜਲਦੀ ਸੋਵਾਂਗਾ।",
        romanization: "raat nu main jaldi sovanga.",
        vi: "Tối nay tôi sẽ ngủ sớm.",
        en: "At night I will sleep early.",
        grammar_vi: ["ਰਾਤ ਨੂੰ = vào ban đêm/tối.", "ਸੋਵਾਂਗਾ là tương lai của ਸੌਣਾ cho người nói nam."],
        grammar_en: ["ਰਾਤ ਨੂੰ = at night.", "ਸੋਵਾਂਗਾ is future of ਸੌਣਾ for a male speaker."],
      },
    ],
    grammar_notes_vi:
      "Bài ôn kết hợp hiện tại thói quen, quá khứ và tương lai. Dấu thời gian giúp người nghe hiểu thì: ਸਵੇਰੇ, ਦੁਪਹਿਰ ਨੂੰ, ਰਾਤ ਨੂੰ, ਕੱਲ੍ਹ.",
    grammar_notes_en:
      "This review combines habitual present, past, and future. Time markers help listeners understand tense: ਸਵੇਰੇ, ਦੁਪਹਿਰ ਨੂੰ, ਰਾਤ ਨੂੰ, ਕੱਲ੍ਹ.",
    common_mistakes: [
      {
        mistake: "Depending only on English-style tense thinking.",
        fix_vi: "Trong Punjabi, hãy nghe cả đuôi động từ lẫn từ thời gian để hiểu nghĩa.",
        fix_en: "In Punjabi, use both verb endings and time words to understand tense.",
      },
    ],
    cultural_notes_vi: "Một đoạn kể ngày đơn giản là mục tiêu A2 thực tế: ngắn, rõ thời gian, động từ quen thuộc.",
    cultural_notes_en: "A simple day narration is a practical A2 goal: short, time-marked, and built from familiar verbs.",
    script_awareness_vi: "Ôn bằng Gurmukhi; Shahmukhi chỉ là nhận biết, không phải nội dung kiểm tra.",
    script_awareness_en: "Review in Gurmukhi; Shahmukhi is awareness only, not tested content.",
    vocabulary: [
      { word: "ਦੁਪਹਿਰ", romanization: "dupehar", vi: "buổi trưa", en: "noon/afternoon", pos: "noun" },
      { word: "ਰਾਤ", romanization: "raat", vi: "đêm/tối", en: "night", pos: "noun" },
      { word: "ਦੋਸਤ", romanization: "dost", vi: "bạn bè", en: "friend", pos: "noun" },
      { word: "ਸੌਣਾ", romanization: "sauna", vi: "ngủ", en: "to sleep", pos: "verb" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਅੱਜ ਤੁਸੀਂ ਕੀ ਕਰੋਗੇ?", romanization: "ajj tusi ki karoge?", vi: "Hôm nay bạn sẽ làm gì?", en: "What will you do today?" },
      { speaker: "B", pa: "ਮੈਂ ਪੜ੍ਹਾਂਗਾ ਅਤੇ ਕੰਮ ਤੇ ਜਾਵਾਂਗਾ।", romanization: "main parhanga ate kamm te javanga.", vi: "Tôi sẽ học và đi làm.", en: "I will study and go to work." },
    ],
    exercises: [
      { type: "sequence", prompt: "Order a day: ਸਵੇਰੇ / ਦੁਪਹਿਰ ਨੂੰ / ਰਾਤ ਨੂੰ", answer: ["ਸਵੇਰੇ", "ਦੁਪਹਿਰ ਨੂੰ", "ਰਾਤ ਨੂੰ"] },
    ],
  },
];
