// src/languages/russian/lessons-a1-core.ts
//
// Russian A1 core lesson batch for Vietnamese learners.
// Converted (compact, app-ready) from the local Vietnamese-Russian archive:
//   course-a1-complete.md, russian-alphabet-vietnamese.md,
//   dialogues-beginner-001-050.md, grammar-exercises-001.md,
//   frequency-words-001.tsv.
// Standalone batch — does not modify the existing foundation lessons-a1/a2/b1.

import type { RussianLesson } from "./lessons";

export const lessons: RussianLesson[] = [
  {
    id: "russian_a1_core_greetings",
    level: "A1",
    category: "daily_survival",
    title_vi: "A1 Core: Chào hỏi và hỏi tên",
    title_en: "A1 Core: Greetings and asking names",
    intro_vi:
      "Bài mở đầu: chào lịch sự và thân mật, hỏi tên người khác, nói tên mình, và tạm biệt. Học nguyên cụm để dùng ngay.",
    intro_en:
      "Opening unit: greet formally and informally, ask someone's name, give your own, and say goodbye. Learn whole chunks for instant use.",
    sentences: [
      {
        russian: "Привет.",
        romanization: "Privet.",
        en: "Hi.",
        vi: "Chào (thân mật).",
        pronunciation_focus: ["dùng với bạn bè", "и nghe i", "trọng âm ở -вет"],
        pronunciation_focus_en: ["use with friends", "и sounds i", "stress on -вет"],
      },
      {
        russian: "Здравствуйте.",
        romanization: "Zdravstvuyte.",
        en: "Hello (polite).",
        vi: "Xin chào (lịch sự).",
        pronunciation_focus: ["cụm здр khó", "в trong -вств không bật", "dùng khi lịch sự"],
        pronunciation_focus_en: ["здр is a hard cluster", "в in -вств is silent", "use it politely"],
      },
      {
        russian: "Как вас зовут?",
        romanization: "Kak vas zovut?",
        en: "What is your name? (polite)",
        vi: "Anh/chị tên là gì?",
        pronunciation_focus: ["вас dạng lịch sự", "зовут nhấn -вут", "giọng hỏi nhẹ lên"],
        pronunciation_focus_en: ["вас is polite", "зовут stresses -вут", "question pitch rises a little"],
      },
      {
        russian: "Меня зовут Ан. До свидания.",
        romanization: "Menya zovut An. Do svidaniya.",
        en: "My name is An. Goodbye.",
        vi: "Tôi tên là An. Tạm biệt.",
        pronunciation_focus: ["меня nghe mye-NYA", "до свидания là cụm tạm biệt", "giữ tên rõ"],
        pronunciation_focus_en: ["меня sounds mye-NYA", "до свидания means goodbye", "keep the name clear"],
      },
    ],
    vocabulary: [
      { word: "привет", romanization: "privet", en: "hi", vi: "chào (thân mật)", pos: "interjection", pronunciation_vi: "pri-VYET", pronunciation_en: "pree-VYET" },
      { word: "здравствуйте", romanization: "zdravstvuyte", en: "hello (polite)", vi: "xin chào", pos: "interjection", pronunciation_vi: "ZDRAHS-tvuy-tye", pronunciation_en: "ZDRAHST-vooy-tyeh" },
      { word: "зовут", romanization: "zovut", en: "is named / call", vi: "gọi / tên là", pos: "verb", pronunciation_vi: "za-VOOT", pronunciation_en: "za-VOOT" },
      { word: "до свидания", romanization: "do svidaniya", en: "goodbye", vi: "tạm biệt", pos: "phrase", pronunciation_vi: "da svi-DA-ni-ya", pronunciation_en: "da svee-DAH-nya" },
    ],
    dialogue: [
      { speaker: "Ан", text: "Здравствуйте.", romanization: "Zdravstvuyte.", vi: "Xin chào.", en: "Hello." },
      { speaker: "Ира", text: "Здравствуйте. Как вас зовут?", romanization: "Zdravstvuyte. Kak vas zovut?", vi: "Xin chào. Anh/chị tên là gì?", en: "Hello. What is your name?" },
      { speaker: "Ан", text: "Меня зовут Ан. Очень приятно.", romanization: "Menya zovut An. Ochen priyatno.", vi: "Tôi tên là An. Rất vui được gặp.", en: "My name is An. Nice to meet you." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Xin chào.", answer: "Здравствуйте." },
          { prompt: "Tôi tên là Lan.", answer: "Меня зовут Лан." },
          { prompt: "Anh/chị tên là gì?", answer: "Как вас зовут?" },
        ],
      },
    ],
    cultural_notes_vi:
      "`Привет` dùng với bạn bè; `Здравствуйте` dùng với người lạ, người lớn tuổi, nơi công sở. Chọn sai mức lịch sự dễ gây khó chịu.",
    cultural_notes_en:
      "`Привет` is for friends; `Здравствуйте` is for strangers, elders, and formal settings. Picking the wrong register can feel rude.",
    tip_advice_vi: "Học `Меня зовут...` như một khối cố định, đừng dịch từng chữ.",
    tip_advice_en: "Memorize `Меня зовут...` as a fixed block; do not translate it word by word.",
  },
  {
    id: "russian_a1_core_yes_no_polite",
    level: "A1",
    category: "daily_survival",
    title_vi: "A1 Core: Có, không và lịch sự",
    title_en: "A1 Core: Yes, no, and politeness",
    intro_vi:
      "Những từ dùng nhiều nhất mỗi ngày: vâng, không, cảm ơn, làm ơn, xin lỗi. Ghép chúng thành câu lịch sự ngắn.",
    intro_en:
      "The most-used daily words: yes, no, thanks, please, sorry. Combine them into short polite phrases.",
    sentences: [
      {
        russian: "Да, спасибо.",
        romanization: "Da, spasibo.",
        en: "Yes, thank you.",
        vi: "Vâng, cảm ơn.",
        pronunciation_focus: ["да ngắn gọn", "о cuối спасибо nghe gần a", "trọng âm -си-"],
        pronunciation_focus_en: ["да is short", "final о in спасибо sounds a-like", "stress on -си-"],
      },
      {
        russian: "Нет, спасибо.",
        romanization: "Net, spasibo.",
        en: "No, thank you.",
        vi: "Không, cảm ơn.",
        pronunciation_focus: ["нет = không", "е nghe ye/e", "lịch sự khi từ chối"],
        pronunciation_focus_en: ["нет means no", "е sounds ye/e", "polite way to refuse"],
      },
      {
        russian: "Извините, пожалуйста.",
        romanization: "Izvinite, pozhaluysta.",
        en: "Excuse me, please.",
        vi: "Xin lỗi / cho hỏi.",
        pronunciation_focus: ["извините mở lời lịch sự", "пожалуйста đọc lướt -лу-", "л mềm trước й"],
        pronunciation_focus_en: ["извините opens politely", "пожалуйста glides over -лу-", "soft л before й"],
      },
      {
        russian: "Ничего.",
        romanization: "Nichego.",
        en: "It's nothing / no problem.",
        vi: "Không sao.",
        pronunciation_focus: ["г ở đây nghe v: ni-che-VO", "ч luôn mềm", "trọng âm cuối"],
        pronunciation_focus_en: ["г here sounds v: ni-che-VO", "ч is always soft", "stress on the last syllable"],
      },
    ],
    vocabulary: [
      { word: "да", romanization: "da", en: "yes", vi: "vâng / có", pos: "particle", pronunciation_vi: "da", pronunciation_en: "dah" },
      { word: "нет", romanization: "net", en: "no", vi: "không", pos: "particle", pronunciation_vi: "nyet", pronunciation_en: "nyet" },
      { word: "спасибо", romanization: "spasibo", en: "thank you", vi: "cảm ơn", pos: "interjection", pronunciation_vi: "spa-SI-ba", pronunciation_en: "spa-SEE-ba" },
      { word: "пожалуйста", romanization: "pozhaluysta", en: "please / you're welcome", vi: "làm ơn / không có gì", pos: "particle", pronunciation_vi: "pa-ZHA-lus-ta", pronunciation_en: "pa-ZHAL-sta" },
      { word: "извините", romanization: "izvinite", en: "excuse me / sorry", vi: "xin lỗi", pos: "verb", pronunciation_vi: "iz-vi-NI-tye", pronunciation_en: "eez-vee-NEE-tyeh" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Không, cảm ơn.", answer: "Нет, спасибо." },
          { prompt: "Cảm ơn nhiều.", answer: "Большое спасибо." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu.",
        instruction_en: "Fill the blank.",
        items: [{ prompt: "Да, ___.", answer: "спасибо" }],
      },
    ],
    cultural_notes_vi:
      "`Пожалуйста` vừa là 'làm ơn' khi nhờ, vừa là 'không có gì' khi đáp lời cảm ơn. Ngữ cảnh quyết định nghĩa.",
    cultural_notes_en:
      "`Пожалуйста` means both 'please' when requesting and 'you're welcome' when replying to thanks. Context decides.",
    tip_advice_vi: "Đừng quên `г` đọc thành `v` trong ничего, его, сегодня — đây là bẫy đọc kinh điển.",
    tip_advice_en: "Remember `г` is read as `v` in ничего, его, сегодня — a classic reading trap.",
  },
  {
    id: "russian_a1_core_pronouns",
    level: "A1",
    category: "daily_survival",
    title_vi: "A1 Core: Đại từ tôi, bạn, anh ấy, cô ấy",
    title_en: "A1 Core: Pronouns I, you, he, she",
    intro_vi:
      "Tiếng Nga ở thì hiện tại thường bỏ động từ 'là'. `Я студент` = 'Tôi (là) sinh viên'. Học các đại từ nhân xưng cơ bản.",
    intro_en:
      "Russian usually drops the verb 'to be' in the present. `Я студент` = 'I (am) a student'. Learn the basic personal pronouns.",
    sentences: [
      {
        russian: "Я студент.",
        romanization: "Ya student.",
        en: "I am a student.",
        vi: "Tôi là sinh viên.",
        pronunciation_focus: ["я đầu từ nghe ya", "không cần từ 'là'", "trọng âm -дент"],
        pronunciation_focus_en: ["initial я sounds ya", "no 'to be' needed", "stress on -дент"],
      },
      {
        russian: "Ты студент?",
        romanization: "Ty student?",
        en: "Are you a student?",
        vi: "Bạn là sinh viên à?",
        pronunciation_focus: ["ты thân mật", "ы không phải i Việt", "biến câu thành hỏi bằng giọng"],
        pronunciation_focus_en: ["ты is informal", "ы is not Vietnamese i", "intonation makes it a question"],
      },
      {
        russian: "Он врач, она учитель.",
        romanization: "On vrach, ona uchitel.",
        en: "He is a doctor, she is a teacher.",
        vi: "Anh ấy là bác sĩ, cô ấy là giáo viên.",
        pronunciation_focus: ["он = anh ấy", "она = cô ấy", "ч trong врач mềm"],
        pronunciation_focus_en: ["он means he", "она means she", "ч in врач is soft"],
      },
      {
        russian: "Она тоже студент.",
        romanization: "Ona tozhe student.",
        en: "She is also a student.",
        vi: "Cô ấy cũng là sinh viên.",
        pronunciation_focus: ["тоже = cũng", "ж là sh kêu", "о không nhấn nghe a"],
        pronunciation_focus_en: ["тоже means also", "ж is voiced sh", "unstressed о sounds a"],
      },
    ],
    vocabulary: [
      { word: "я", romanization: "ya", en: "I", vi: "tôi", pos: "pronoun", pronunciation_vi: "ya", pronunciation_en: "yah" },
      { word: "ты", romanization: "ty", en: "you (informal)", vi: "bạn / cậu", pos: "pronoun", pronunciation_vi: "ty", pronunciation_en: "tih" },
      { word: "он", romanization: "on", en: "he", vi: "anh ấy", pos: "pronoun", pronunciation_vi: "on", pronunciation_en: "ohn" },
      { word: "она", romanization: "ona", en: "she", vi: "cô ấy", pos: "pronoun", pronunciation_vi: "a-NA", pronunciation_en: "ah-NAH" },
      { word: "тоже", romanization: "tozhe", en: "also / too", vi: "cũng", pos: "adverb", pronunciation_vi: "TO-zhe", pronunciation_en: "TOH-zheh" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Cô ấy.", answer: "она" },
          { prompt: "Bạn là sinh viên à?", answer: "Ты студент?" },
          { prompt: "Vâng, tôi là sinh viên.", answer: "Да, я студент." },
        ],
      },
    ],
    cultural_notes_vi:
      "`Ты` thân mật (bạn bè, trẻ con); `Вы` lịch sự hoặc số nhiều. Người Việt nên mặc định dùng `Вы` khi chưa thân.",
    cultural_notes_en:
      "`Ты` is informal (friends, children); `Вы` is polite or plural. Vietnamese learners should default to `Вы` until close.",
    tip_advice_vi: "Đừng thêm 'là' vào câu. `Я студент`, không phải `Я есть студент`.",
    tip_advice_en: "Do not add 'to be'. Say `Я студент`, not `Я есть студент`.",
  },
  {
    id: "russian_a1_core_countries_origin",
    level: "A1",
    category: "daily_survival",
    title_vi: "A1 Core: Quốc gia và quê quán",
    title_en: "A1 Core: Countries and origin",
    intro_vi:
      "Hỏi và trả lời 'đến từ đâu'. Sau `из` (từ), tên nước đổi đuôi sang sinh cách: Вьетнам → из Вьетнама.",
    intro_en:
      "Ask and answer 'where from'. After `из` (from), the country name takes a genitive ending: Вьетнам → из Вьетнама.",
    sentences: [
      {
        russian: "Откуда вы?",
        romanization: "Otkuda vy?",
        en: "Where are you from? (polite)",
        vi: "Anh/chị đến từ đâu?",
        pronunciation_focus: ["откуда = từ đâu", "trọng âm -ку-", "вы lịch sự"],
        pronunciation_focus_en: ["откуда means where from", "stress on -ку-", "вы is polite"],
      },
      {
        russian: "Я из Вьетнама.",
        romanization: "Ya iz Vyetnama.",
        en: "I am from Vietnam.",
        vi: "Tôi đến từ Việt Nam.",
        pronunciation_focus: ["из + sinh cách", "Вьетнам → Вьетнама", "ь mềm giữ rõ"],
        pronunciation_focus_en: ["из takes genitive", "Вьетнам → Вьетнама", "keep the soft ь"],
      },
      {
        russian: "Вы из России?",
        romanization: "Vy iz Rossii?",
        en: "Are you from Russia?",
        vi: "Anh/chị đến từ Nga à?",
        pronunciation_focus: ["Россия → России", "сс đọc s dài", "giọng hỏi lên"],
        pronunciation_focus_en: ["Россия → России", "сс is a long s", "question pitch rises"],
      },
      {
        russian: "Нет, я из Ханоя.",
        romanization: "Net, ya iz Khanoya.",
        en: "No, I am from Hanoi.",
        vi: "Không, tôi từ Hà Nội.",
        pronunciation_focus: ["Ханой → Ханоя", "х gần kh", "tên thành phố cũng đổi đuôi"],
        pronunciation_focus_en: ["Ханой → Ханоя", "х is close to kh", "city names change endings too"],
      },
    ],
    vocabulary: [
      { word: "откуда", romanization: "otkuda", en: "where from", vi: "từ đâu", pos: "adverb", pronunciation_vi: "at-KU-da", pronunciation_en: "at-KOO-da" },
      { word: "из", romanization: "iz", en: "from", vi: "từ", pos: "preposition", pronunciation_vi: "iz", pronunciation_en: "eez" },
      { word: "Вьетнам", romanization: "Vyetnam", en: "Vietnam", vi: "Việt Nam", pos: "noun", pronunciation_vi: "vyet-NAM", pronunciation_en: "vyet-NAHM" },
      { word: "Россия", romanization: "Rossiya", en: "Russia", vi: "nước Nga", pos: "noun", pronunciation_vi: "ra-SI-ya", pronunciation_en: "ra-SEE-ya" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Tôi đến từ Việt Nam.", answer: "Я из Вьетнама." },
          { prompt: "Anh/chị đến từ đâu?", answer: "Откуда вы?" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền giới từ còn thiếu.",
        instruction_en: "Fill the missing preposition.",
        items: [{ prompt: "Я ___ Вьетнама.", answer: "из" }],
      },
    ],
    cultural_notes_vi:
      "Sinh cách (genitive) sau `из` là một trong những cách đầu tiên người học gặp. Tạm thời học theo từng nước, chưa cần thuộc quy tắc.",
    cultural_notes_en:
      "The genitive after `из` is one of the first cases learners meet. For now, learn it country by country, not by rule.",
    tip_advice_vi: "Lưu sẵn câu `Я из Вьетнама.` — bạn sẽ dùng nó rất nhiều khi mới sang Nga.",
    tip_advice_en: "Keep `Я из Вьетнама.` ready — you will use it constantly when new in Russia.",
  },
  {
    id: "russian_a1_core_this_who_what",
    level: "A1",
    category: "daily_survival",
    title_vi: "A1 Core: Đây là ai, đây là cái gì",
    title_en: "A1 Core: This is who, this is what",
    intro_vi:
      "`Это` = 'đây là / đó là' cho mọi giống và số. Dùng `Кто это?` cho người, `Что это?` cho vật.",
    intro_en:
      "`Это` = 'this/that is' for any gender and number. Use `Кто это?` for people, `Что это?` for things.",
    sentences: [
      {
        russian: "Кто это?",
        romanization: "Kto eto?",
        en: "Who is this?",
        vi: "Đây là ai?",
        pronunciation_focus: ["кто cụm kt", "không thêm nguyên âm", "это nghe E-ta"],
        pronunciation_focus_en: ["кто has kt cluster", "add no vowel", "это sounds E-ta"],
      },
      {
        russian: "Это моя сестра.",
        romanization: "Eto moya sestra.",
        en: "This is my sister.",
        vi: "Đây là chị/em gái tôi.",
        pronunciation_focus: ["моя hợp với danh từ giống cái", "сестра trọng âm cuối", "о đầu это nghe e"],
        pronunciation_focus_en: ["моя agrees with feminine noun", "сестра stresses the end", "initial о in это sounds e"],
      },
      {
        russian: "Что это?",
        romanization: "Chto eto?",
        en: "What is this?",
        vi: "Đây là cái gì?",
        pronunciation_focus: ["что đọc 'shto'", "ч ở đây thành sh", "это E-ta"],
        pronunciation_focus_en: ["что is read 'shto'", "ч becomes sh here", "это is E-ta"],
      },
      {
        russian: "Это книга.",
        romanization: "Eto kniga.",
        en: "This is a book.",
        vi: "Đây là quyển sách.",
        pronunciation_focus: ["không có mạo từ a/the", "кн cụm liền", "trọng âm кни-"],
        pronunciation_focus_en: ["no a/the article", "кн is a linked cluster", "stress on кни-"],
      },
    ],
    vocabulary: [
      { word: "это", romanization: "eto", en: "this is / that is", vi: "đây là / đó là", pos: "pronoun", pronunciation_vi: "E-ta", pronunciation_en: "EH-ta" },
      { word: "кто", romanization: "kto", en: "who", vi: "ai", pos: "pronoun", pronunciation_vi: "kto", pronunciation_en: "ktoh" },
      { word: "что", romanization: "chto", en: "what", vi: "cái gì", pos: "pronoun", pronunciation_vi: "shto", pronunciation_en: "shtoh" },
      { word: "книга", romanization: "kniga", en: "book", vi: "quyển sách", pos: "noun", pronunciation_vi: "KNI-ga", pronunciation_en: "KNEE-ga" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Đây là ai?", answer: "Кто это?" },
          { prompt: "Đây là gì?", answer: "Что это?" },
          { prompt: "Đây là mẹ tôi.", answer: "Это моя мама." },
        ],
      },
    ],
    cultural_notes_vi:
      "Tiếng Nga không có mạo từ (a/the). `Это книга` có thể là 'đây là một quyển sách' hay 'đây là quyển sách', tùy ngữ cảnh.",
    cultural_notes_en:
      "Russian has no articles (a/the). `Это книга` can mean 'this is a book' or 'this is the book' by context.",
    tip_advice_vi: "Nhớ `что` đọc là 'shto', không phải 'chto'. Đây là từ rất thường gặp.",
    tip_advice_en: "Remember `что` is pronounced 'shto', not 'chto'. It is a very frequent word.",
  },
  {
    id: "russian_a1_core_numbers_1_20",
    level: "A1",
    category: "daily_survival",
    title_vi: "A1 Core: Số 1–20 và đếm đồ",
    title_en: "A1 Core: Numbers 1–20 and counting",
    intro_vi:
      "Học số 1–20 và mẫu đếm vé. Lưu ý: sau 2/3/4 danh từ ở dạng đặc biệt (билет → два билета).",
    intro_en:
      "Learn numbers 1–20 and a counting pattern. Note: after 2/3/4 the noun takes a special form (билет → два билета).",
    sentences: [
      {
        russian: "Один, два, три, четыре, пять.",
        romanization: "Odin, dva, tri, chetyre, pyat.",
        en: "One, two, three, four, five.",
        vi: "Một, hai, ba, bốn, năm.",
        pronunciation_focus: ["пять có ь mềm", "ч trong четыре mềm", "trọng âm o-DIN"],
        pronunciation_focus_en: ["пять has soft ь", "ч in четыре is soft", "stress o-DIN"],
      },
      {
        russian: "Сколько билетов?",
        romanization: "Skolko biletov?",
        en: "How many tickets?",
        vi: "Bao nhiêu vé?",
        pronunciation_focus: ["сколько = bao nhiêu", "л mềm trước ь", "билетов dạng số nhiều"],
        pronunciation_focus_en: ["сколько means how many", "soft л before ь", "билетов is the plural form"],
      },
      {
        russian: "Два билета, пожалуйста.",
        romanization: "Dva bileta, pozhaluysta.",
        en: "Two tickets, please.",
        vi: "Hai vé, làm ơn.",
        pronunciation_focus: ["два + билета (không билет)", "trọng âm -ле-", "đuôi -а sau 2/3/4"],
        pronunciation_focus_en: ["два + билета (not билет)", "stress on -ле-", "-а ending after 2/3/4"],
      },
      {
        russian: "Десять, одиннадцать, двадцать.",
        romanization: "Desyat, odinnadtsat, dvadtsat.",
        en: "Ten, eleven, twenty.",
        vi: "Mười, mười một, hai mươi.",
        pronunciation_focus: ["-дцать đọc -tsat", "нн kéo dài nhẹ", "ь cuối mềm"],
        pronunciation_focus_en: ["-дцать reads -tsat", "нн is slightly long", "final ь is soft"],
      },
    ],
    vocabulary: [
      { word: "один", romanization: "odin", en: "one", vi: "một", pos: "numeral", pronunciation_vi: "a-DIN", pronunciation_en: "ah-DEEN" },
      { word: "два", romanization: "dva", en: "two", vi: "hai", pos: "numeral", pronunciation_vi: "dva", pronunciation_en: "dvah" },
      { word: "пять", romanization: "pyat", en: "five", vi: "năm", pos: "numeral", pronunciation_vi: "pyat", pronunciation_en: "pyaht" },
      { word: "сколько", romanization: "skolko", en: "how many / how much", vi: "bao nhiêu", pos: "adverb", pronunciation_vi: "SKOL-ka", pronunciation_en: "SKOHL-ka" },
      { word: "билет", romanization: "bilet", en: "ticket", vi: "vé", pos: "noun", pronunciation_vi: "bi-LYET", pronunciation_en: "bee-LYET" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Mười.", answer: "десять" },
          { prompt: "Bao nhiêu vé?", answer: "Сколько билетов?" },
          { prompt: "Hai vé, làm ơn.", answer: "Два билета, пожалуйста." },
        ],
      },
    ],
    cultural_notes_vi:
      "Số đếm trong tiếng Nga điều khiển dạng danh từ: 1 → билет, 2–4 → билета, 5+ → билетов. A1 chỉ cần nhận ra mẫu, chưa cần thuộc hết.",
    cultural_notes_en:
      "Numbers govern the noun form: 1 → билет, 2–4 → билета, 5+ → билетов. At A1 just recognize the pattern, no need to master it.",
    tip_advice_vi: "Tập đọc to dãy số mỗi ngày một lần để nhớ trọng âm.",
    tip_advice_en: "Read the number sequence aloud once a day to lock in the stress.",
  },
  {
    id: "russian_a1_core_food_drink",
    level: "A1",
    category: "daily_survival",
    title_vi: "A1 Core: Đồ ăn, thức uống và gọi món",
    title_en: "A1 Core: Food, drink, and ordering",
    intro_vi:
      "Gọi món bằng mẫu `Мне + món, пожалуйста` (cho tôi...). Thêm `без` (không có) để bỏ thành phần.",
    intro_en:
      "Order using `Мне + item, пожалуйста` (give me...). Add `без` (without) to remove an ingredient.",
    sentences: [
      {
        russian: "Мне чай, пожалуйста.",
        romanization: "Mne chay, pozhaluysta.",
        en: "Tea for me, please.",
        vi: "Cho tôi trà, làm ơn.",
        pronunciation_focus: ["мне = cho tôi", "чай một âm tiết", "kết bằng пожалуйста"],
        pronunciation_focus_en: ["мне means for me", "чай is one syllable", "end with пожалуйста"],
      },
      {
        russian: "Мне воду, пожалуйста.",
        romanization: "Mne vodu, pozhaluysta.",
        en: "Water for me, please.",
        vi: "Cho tôi nước, làm ơn.",
        pronunciation_focus: ["вода → воду (đối cách)", "о đầu nghe a", "trọng âm -ду"],
        pronunciation_focus_en: ["вода → воду (accusative)", "initial о sounds a", "stress on -ду"],
      },
      {
        russian: "Без сахара.",
        romanization: "Bez sakhara.",
        en: "Without sugar.",
        vi: "Không đường.",
        pronunciation_focus: ["без + sinh cách", "х gần kh", "сахар → сахара"],
        pronunciation_focus_en: ["без takes genitive", "х is close to kh", "сахар → сахара"],
      },
      {
        russian: "Что будете?",
        romanization: "Chto budete?",
        en: "What will you have?",
        vi: "Anh/chị dùng gì?",
        pronunciation_focus: ["что = shto", "будете lịch sự", "câu phục vụ hay hỏi"],
        pronunciation_focus_en: ["что = shto", "будете is polite", "a common waiter question"],
      },
    ],
    vocabulary: [
      { word: "вода", romanization: "voda", en: "water", vi: "nước", pos: "noun", pronunciation_vi: "va-DA", pronunciation_en: "va-DAH" },
      { word: "чай", romanization: "chay", en: "tea", vi: "trà", pos: "noun", pronunciation_vi: "chay", pronunciation_en: "chai" },
      { word: "кофе", romanization: "kofe", en: "coffee", vi: "cà phê", pos: "noun", pronunciation_vi: "KO-fe", pronunciation_en: "KOH-feh" },
      { word: "хлеб", romanization: "khleb", en: "bread", vi: "bánh mì", pos: "noun", pronunciation_vi: "khlep", pronunciation_en: "khlyep" },
      { word: "без", romanization: "bez", en: "without", vi: "không có", pos: "preposition", pronunciation_vi: "byes", pronunciation_en: "byez" },
    ],
    dialogue: [
      { speaker: "Официант", text: "Что будете?", romanization: "Chto budete?", vi: "Anh/chị dùng gì?", en: "What will you have?" },
      { speaker: "Лан", text: "Мне чай, пожалуйста.", romanization: "Mne chay, pozhaluysta.", vi: "Cho tôi trà, làm ơn.", en: "Tea for me, please." },
      { speaker: "Официант", text: "С сахаром?", romanization: "S sakharom?", vi: "Có đường không?", en: "With sugar?" },
      { speaker: "Лан", text: "Без сахара.", romanization: "Bez sakhara.", vi: "Không đường.", en: "Without sugar." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Cho tôi nước, làm ơn.", answer: "Мне воду, пожалуйста." },
          { prompt: "Không đường.", answer: "Без сахара." },
        ],
      },
    ],
    cultural_notes_vi:
      "Mẫu `Мне + đối cách` rất tiện để gọi món mà chưa cần chia động từ. Học sẵn `Мне чай / воду / кофе`.",
    cultural_notes_en:
      "The `Мне + accusative` pattern lets you order without conjugating a verb. Pre-learn `Мне чай / воду / кофе`.",
    tip_advice_vi: "Khi không chắc giống/cách của món, vẫn cứ nói `Мне + tên món` — người Nga vẫn hiểu.",
    tip_advice_en: "When unsure of gender/case, still say `Мне + item` — Russians will understand.",
  },
  {
    id: "russian_a1_core_shopping_prices",
    level: "A1",
    category: "practical_tasks",
    title_vi: "A1 Core: Mua sắm và hỏi giá",
    title_en: "A1 Core: Shopping and prices",
    intro_vi:
      "Hỏi giá bằng `Сколько стоит?`, xin trả thẻ bằng `Можно картой?`, và nhận xét `Это дорого` (đắt quá).",
    intro_en:
      "Ask the price with `Сколько стоит?`, ask to pay by card with `Можно картой?`, and react with `Это дорого` (that's expensive).",
    sentences: [
      {
        russian: "Сколько стоит хлеб?",
        romanization: "Skolko stoit khleb?",
        en: "How much is the bread?",
        vi: "Bánh mì bao nhiêu tiền?",
        pronunciation_focus: ["стоит = có giá", "сколько trọng âm đầu", "о đầu стоит nghe a"],
        pronunciation_focus_en: ["стоит means costs", "сколько stresses the start", "initial о in стоит sounds a"],
      },
      {
        russian: "Сто рублей.",
        romanization: "Sto rubley.",
        en: "One hundred rubles.",
        vi: "Một trăm rúp.",
        pronunciation_focus: ["сто = 100", "рубль → рублей", "trọng âm -лей"],
        pronunciation_focus_en: ["сто means 100", "рубль → рублей", "stress on -лей"],
      },
      {
        russian: "Можно картой?",
        romanization: "Mozhno kartoy?",
        en: "Can I pay by card?",
        vi: "Trả bằng thẻ được không?",
        pronunciation_focus: ["можно = được không", "карта → картой (công cụ cách)", "ж là sh kêu"],
        pronunciation_focus_en: ["можно means is it allowed", "карта → картой (instrumental)", "ж is voiced sh"],
      },
      {
        russian: "Это дорого.",
        romanization: "Eto dorogo.",
        en: "That's expensive.",
        vi: "Cái này đắt.",
        pronunciation_focus: ["дорого trọng âm đầu", "о không nhấn nghe a", "это E-ta"],
        pronunciation_focus_en: ["дорого stresses the first syllable", "unstressed о sounds a", "это E-ta"],
      },
    ],
    vocabulary: [
      { word: "магазин", romanization: "magazin", en: "shop", vi: "cửa hàng", pos: "noun", pronunciation_vi: "ma-ga-ZIN", pronunciation_en: "ma-ga-ZEEN" },
      { word: "стоит", romanization: "stoit", en: "costs", vi: "có giá", pos: "verb", pronunciation_vi: "STO-it", pronunciation_en: "STOH-eet" },
      { word: "карта", romanization: "karta", en: "card", vi: "thẻ", pos: "noun", pronunciation_vi: "KAR-ta", pronunciation_en: "KAR-ta" },
      { word: "дорого", romanization: "dorogo", en: "expensive", vi: "đắt", pos: "adverb", pronunciation_vi: "DO-ra-ga", pronunciation_en: "DOH-ra-ga" },
    ],
    dialogue: [
      { speaker: "Покупатель", text: "Сколько стоит хлеб?", romanization: "Skolko stoit khleb?", vi: "Bánh mì bao nhiêu tiền?", en: "How much is the bread?" },
      { speaker: "Продавец", text: "Сто рублей.", romanization: "Sto rubley.", vi: "Một trăm rúp.", en: "One hundred rubles." },
      { speaker: "Покупатель", text: "Можно картой?", romanization: "Mozhno kartoy?", vi: "Trả bằng thẻ được không?", en: "Can I pay by card?" },
      { speaker: "Продавец", text: "Да, можно.", romanization: "Da, mozhno.", vi: "Được.", en: "Yes, you can." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Bao nhiêu tiền?", answer: "Сколько стоит?" },
          { prompt: "Trả bằng thẻ được không?", answer: "Можно картой?" },
        ],
      },
    ],
    cultural_notes_vi:
      "Nhiều cửa hàng Nga nhận thẻ, nhưng chợ (рынок) thường cần tiền mặt (наличные). Hỏi `Можно картой?` trước khi mua.",
    cultural_notes_en:
      "Many Russian shops take cards, but markets (рынок) often need cash (наличные). Ask `Можно картой?` before buying.",
    tip_advice_vi: "Học `Сколько стоит?` như một khối — bạn không cần biết giống của món để hỏi giá.",
    tip_advice_en: "Learn `Сколько стоит?` as a block — you need no noun gender to ask a price.",
  },
  {
    id: "russian_a1_core_places_where",
    level: "A1",
    category: "daily_survival",
    title_vi: "A1 Core: Địa điểm và hỏi 'ở đâu'",
    title_en: "A1 Core: Places and asking 'where'",
    intro_vi:
      "Hỏi vị trí bằng `Где...?`. Để nói 'ở trong/tại', dùng `в` hoặc `на` + giới cách (школа → в школе).",
    intro_en:
      "Ask location with `Где...?`. To say 'in/at', use `в` or `на` + prepositional case (школа → в школе).",
    sentences: [
      {
        russian: "Извините, где метро?",
        romanization: "Izvinite, gde metro?",
        en: "Excuse me, where is the metro?",
        vi: "Xin lỗi, metro ở đâu?",
        pronunciation_focus: ["где cụm gd", "метро không đổi đuôi", "извините mở lời"],
        pronunciation_focus_en: ["где has gd cluster", "метро does not change", "извините opens politely"],
      },
      {
        russian: "Я дома.",
        romanization: "Ya doma.",
        en: "I am at home.",
        vi: "Tôi ở nhà.",
        pronunciation_focus: ["дома = ở nhà (trạng từ)", "о đầu nghe gần a", "trọng âm đầu"],
        pronunciation_focus_en: ["дома means at home (adverb)", "initial о sounds a-like", "stress on the first syllable"],
      },
      {
        russian: "Он в школе.",
        romanization: "On v shkole.",
        en: "He is at school.",
        vi: "Anh ấy ở trường.",
        pronunciation_focus: ["школа → в школе (giới cách)", "в đọc dính vào школе", "ш cứng"],
        pronunciation_focus_en: ["школа → в школе (prepositional)", "в links to школе", "ш is hard"],
      },
      {
        russian: "Она на работе.",
        romanization: "Ona na rabote.",
        en: "She is at work.",
        vi: "Cô ấy ở chỗ làm.",
        pronunciation_focus: ["работа → на работе", "на dùng với 'работа'", "trọng âm -бо-"],
        pronunciation_focus_en: ["работа → на работе", "на is used with 'работа'", "stress on -бо-"],
      },
    ],
    vocabulary: [
      { word: "где", romanization: "gde", en: "where", vi: "ở đâu", pos: "adverb", pronunciation_vi: "gdye", pronunciation_en: "gdyeh" },
      { word: "дом", romanization: "dom", en: "house / home", vi: "nhà", pos: "noun", pronunciation_vi: "dom", pronunciation_en: "dohm" },
      { word: "школа", romanization: "shkola", en: "school", vi: "trường học", pos: "noun", pronunciation_vi: "SHKO-la", pronunciation_en: "SHKOH-la" },
      { word: "метро", romanization: "metro", en: "metro / subway", vi: "tàu điện ngầm", pos: "noun", pronunciation_vi: "mi-TRO", pronunciation_en: "mee-TROH" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Nhà vệ sinh ở đâu?", answer: "Где туалет?" },
          { prompt: "Tôi ở nhà.", answer: "Я дома." },
          { prompt: "Cô ấy ở chỗ làm.", answer: "Она на работе." },
        ],
      },
    ],
    cultural_notes_vi:
      "Một số nơi đi với `на` (на работе, на почте) thay vì `в`. Đây là thói quen của ngôn ngữ, học theo từng cụm.",
    cultural_notes_en:
      "Some places take `на` (на работе, на почте) instead of `в`. It is idiomatic — learn it phrase by phrase.",
    tip_advice_vi: "Khi lạc đường, chỉ cần `Извините, где + nơi cần tìm?` là đủ.",
    tip_advice_en: "When lost, `Извините, где + place?` is all you need.",
  },
  {
    id: "russian_a1_core_transport",
    level: "A1",
    category: "practical_tasks",
    title_vi: "A1 Core: Đi lại và mua vé",
    title_en: "A1 Core: Transport and buying tickets",
    intro_vi:
      "Phương tiện công cộng và câu mua vé. `Куда?` = 'đi đâu', trả lời bằng `в + đối cách` (в центр).",
    intro_en:
      "Public transport and ticket phrases. `Куда?` = 'where to', answered with `в + accusative` (в центр).",
    sentences: [
      {
        russian: "Один билет, пожалуйста.",
        romanization: "Odin bilet, pozhaluysta.",
        en: "One ticket, please.",
        vi: "Một vé, làm ơn.",
        pronunciation_focus: ["один + билет (số ít)", "trọng âm o-DIN", "kết bằng пожалуйста"],
        pronunciation_focus_en: ["один + билет (singular)", "stress o-DIN", "end with пожалуйста"],
      },
      {
        russian: "Куда?",
        romanization: "Kuda?",
        en: "Where to?",
        vi: "Đi đâu?",
        pronunciation_focus: ["куда = đi đâu", "khác где (ở đâu)", "trọng âm -да"],
        pronunciation_focus_en: ["куда means where to", "different from где (where at)", "stress on -да"],
      },
      {
        russian: "В центр.",
        romanization: "V tsentr.",
        en: "To the center.",
        vi: "Vào trung tâm.",
        pronunciation_focus: ["в đi với chuyển động", "ц là ts", "cụm нтр cuối khó"],
        pronunciation_focus_en: ["в marks motion", "ц is ts", "final нтр cluster is hard"],
      },
      {
        russian: "Мне нужно такси.",
        romanization: "Mne nuzhno taksi.",
        en: "I need a taxi.",
        vi: "Tôi cần taxi.",
        pronunciation_focus: ["мне нужно = tôi cần", "ж là sh kêu", "такси trọng âm cuối"],
        pronunciation_focus_en: ["мне нужно means I need", "ж is voiced sh", "такси stresses the end"],
      },
    ],
    vocabulary: [
      { word: "автобус", romanization: "avtobus", en: "bus", vi: "xe buýt", pos: "noun", pronunciation_vi: "af-TO-bus", pronunciation_en: "af-TOH-boos" },
      { word: "поезд", romanization: "poyezd", en: "train", vi: "tàu hỏa", pos: "noun", pronunciation_vi: "PO-yest", pronunciation_en: "POH-yezd" },
      { word: "такси", romanization: "taksi", en: "taxi", vi: "taxi", pos: "noun", pronunciation_vi: "tak-SI", pronunciation_en: "tak-SEE" },
      { word: "куда", romanization: "kuda", en: "where to", vi: "đi đâu", pos: "adverb", pronunciation_vi: "ku-DA", pronunciation_en: "koo-DAH" },
    ],
    dialogue: [
      { speaker: "Пассажир", text: "Один билет, пожалуйста.", romanization: "Odin bilet, pozhaluysta.", vi: "Một vé, làm ơn.", en: "One ticket, please." },
      { speaker: "Кассир", text: "Куда?", romanization: "Kuda?", vi: "Đi đâu?", en: "Where to?" },
      { speaker: "Пассажир", text: "В центр.", romanization: "V tsentr.", vi: "Vào trung tâm.", en: "To the center." },
      { speaker: "Кассир", text: "Вот билет.", romanization: "Vot bilet.", vi: "Đây là vé.", en: "Here is the ticket." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Tôi cần taxi.", answer: "Мне нужно такси." },
          { prompt: "Một vé, làm ơn.", answer: "Один билет, пожалуйста." },
        ],
      },
    ],
    cultural_notes_vi:
      "Phân biệt `где` (ở đâu — đứng yên) và `куда` (đi đâu — chuyển động). Đây là cặp người Việt hay nhầm.",
    cultural_notes_en:
      "Distinguish `где` (where — static) from `куда` (where to — motion). Vietnamese learners often confuse this pair.",
    tip_advice_vi: "Ở metro Moskva/SPb, học sẵn tên trạm bằng Cyrillic vì bảng chỉ dẫn ít tiếng Anh.",
    tip_advice_en: "On the Moscow/St. Petersburg metro, pre-learn station names in Cyrillic — signage rarely has English.",
  },
  {
    id: "russian_a1_core_time_days",
    level: "A1",
    category: "daily_survival",
    title_vi: "A1 Core: Thời gian và buổi trong ngày",
    title_en: "A1 Core: Time and parts of the day",
    intro_vi:
      "Hỏi 'khi nào' bằng `Когда?` và trả lời bằng hôm nay/ngày mai/sáng/tối. Các từ buổi đứng một mình làm trạng từ.",
    intro_en:
      "Ask 'when' with `Когда?` and answer with today/tomorrow/morning/evening. The time-of-day words stand alone as adverbs.",
    sentences: [
      {
        russian: "Когда урок?",
        romanization: "Kogda urok?",
        en: "When is the lesson?",
        vi: "Bài học khi nào?",
        pronunciation_focus: ["когда = khi nào", "г đọc g (không v ở đây)", "урок trọng âm cuối"],
        pronunciation_focus_en: ["когда means when", "г is g here (not v)", "урок stresses the end"],
      },
      {
        russian: "Урок сегодня вечером.",
        romanization: "Urok segodnya vecherom.",
        en: "The lesson is this evening.",
        vi: "Bài học tối nay.",
        pronunciation_focus: ["сегодня: г = v (si-VOD-nya)", "вечером = buổi tối", "trọng âm -год-"],
        pronunciation_focus_en: ["сегодня: г = v (si-VOD-nya)", "вечером means in the evening", "stress on -год-"],
      },
      {
        russian: "Встреча завтра утром.",
        romanization: "Vstrecha zavtra utrom.",
        en: "The meeting is tomorrow morning.",
        vi: "Cuộc họp sáng mai.",
        pronunciation_focus: ["встреча cụm встр", "завтра = ngày mai", "утром = buổi sáng"],
        pronunciation_focus_en: ["встреча has встр cluster", "завтра means tomorrow", "утром means in the morning"],
      },
      {
        russian: "Сейчас? Нет, вечером.",
        romanization: "Seychas? Net, vecherom.",
        en: "Now? No, in the evening.",
        vi: "Bây giờ à? Không, buổi tối.",
        pronunciation_focus: ["сейчас = bây giờ", "ч mềm", "giọng hỏi rồi giọng khẳng định"],
        pronunciation_focus_en: ["сейчас means now", "ч is soft", "question pitch then statement pitch"],
      },
    ],
    vocabulary: [
      { word: "когда", romanization: "kogda", en: "when", vi: "khi nào", pos: "adverb", pronunciation_vi: "kag-DA", pronunciation_en: "kag-DAH" },
      { word: "сегодня", romanization: "segodnya", en: "today", vi: "hôm nay", pos: "adverb", pronunciation_vi: "si-VOD-nya", pronunciation_en: "see-VOHD-nya" },
      { word: "завтра", romanization: "zavtra", en: "tomorrow", vi: "ngày mai", pos: "adverb", pronunciation_vi: "ZAV-tra", pronunciation_en: "ZAHF-tra" },
      { word: "сейчас", romanization: "seychas", en: "now", vi: "bây giờ", pos: "adverb", pronunciation_vi: "sey-CHAS", pronunciation_en: "see-CHAHS" },
      { word: "вечером", romanization: "vecherom", en: "in the evening", vi: "buổi tối", pos: "adverb", pronunciation_vi: "VYE-che-ram", pronunciation_en: "VYEH-che-rom" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Bài học khi nào?", answer: "Когда урок?" },
          { prompt: "Cuộc họp ngày mai.", answer: "Встреча завтра." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ chỉ thời gian.",
        instruction_en: "Fill the time word.",
        items: [{ prompt: "Урок ___ вечером. (hôm nay)", answer: "сегодня" }],
      },
    ],
    cultural_notes_vi:
      "Người Nga thường nói buổi (утром/вечером) thay vì giờ chính xác trong câu hẹn đơn giản. Rất tiện ở trình độ A1.",
    cultural_notes_en:
      "Russians often state the part of day (утром/вечером) instead of an exact time in simple plans — handy at A1.",
    tip_advice_vi: "Ghi nhớ `сегодня` đọc 'si-VOD-nya' (г = v), đừng đọc theo mặt chữ.",
    tip_advice_en: "Remember `сегодня` is 'si-VOD-nya' (г = v); don't read it letter by letter.",
  },
  {
    id: "russian_a1_core_basic_verbs",
    level: "A1",
    category: "daily_survival",
    title_vi: "A1 Core: Động từ cơ bản ở ngôi 'tôi'",
    title_en: "A1 Core: Basic verbs in the 'I' form",
    intro_vi:
      "Sáu động từ thiết yếu ở ngôi `я`: nói, hiểu, biết, muốn, ăn, uống. Học dạng `я` trước, các ngôi khác để sau.",
    intro_en:
      "Six essential verbs in the `я` form: speak, understand, know, want, eat, drink. Learn the `я` form first; other persons later.",
    sentences: [
      {
        russian: "Я говорю по-русски.",
        romanization: "Ya govoryu po-russki.",
        en: "I speak Russian.",
        vi: "Tôi nói tiếng Nga.",
        pronunciation_focus: ["говорю trọng âm cuối", "по-русски = bằng tiếng Nga", "сс rõ"],
        pronunciation_focus_en: ["говорю stresses the end", "по-русски means in Russian", "clear сс"],
      },
      {
        russian: "Я не понимаю.",
        romanization: "Ya ne ponimayu.",
        en: "I don't understand.",
        vi: "Tôi không hiểu.",
        pronunciation_focus: ["не đứng trước động từ", "понимаю trọng âm -ма-", "câu cứu hộ rất hữu ích"],
        pronunciation_focus_en: ["не goes before the verb", "понимаю stresses -ма-", "a very useful rescue line"],
      },
      {
        russian: "Я хочу чай.",
        romanization: "Ya khochu chay.",
        en: "I want tea.",
        vi: "Tôi muốn trà.",
        pronunciation_focus: ["хочу: х gần kh", "trọng âm -чу", "ч mềm"],
        pronunciation_focus_en: ["хочу: х is close to kh", "stress on -чу", "ч is soft"],
      },
      {
        russian: "Я пью воду.",
        romanization: "Ya pyu vodu.",
        en: "I drink water.",
        vi: "Tôi uống nước.",
        pronunciation_focus: ["пью có ь mềm + ю", "вода → воду", "đừng tách п-ью"],
        pronunciation_focus_en: ["пью has soft ь + ю", "вода → воду", "do not split п-ью"],
      },
    ],
    vocabulary: [
      { word: "говорить", romanization: "govorit", en: "to speak", vi: "nói", pos: "verb", pronunciation_vi: "ga-va-RIT", pronunciation_en: "ga-va-REET" },
      { word: "понимать", romanization: "ponimat", en: "to understand", vi: "hiểu", pos: "verb", pronunciation_vi: "pa-ni-MAT", pronunciation_en: "pa-nee-MAHT" },
      { word: "хотеть", romanization: "khotet", en: "to want", vi: "muốn", pos: "verb", pronunciation_vi: "kha-TYET", pronunciation_en: "kha-TYET" },
      { word: "пить", romanization: "pit", en: "to drink", vi: "uống", pos: "verb", pronunciation_vi: "pit", pronunciation_en: "peet" },
      { word: "есть", romanization: "yest", en: "to eat", vi: "ăn", pos: "verb", pronunciation_vi: "yest", pronunciation_en: "yest" },
    ],
    dialogue: [
      { speaker: "Ира", text: "Ты говоришь по-русски?", romanization: "Ty govorish po-russki?", vi: "Bạn nói tiếng Nga không?", en: "Do you speak Russian?" },
      { speaker: "Лан", text: "Немного.", romanization: "Nemnogo.", vi: "Một chút.", en: "A little." },
      { speaker: "Ира", text: "Ты понимаешь?", romanization: "Ty ponimayesh?", vi: "Bạn hiểu không?", en: "Do you understand?" },
      { speaker: "Лан", text: "Да, понимаю.", romanization: "Da, ponimayu.", vi: "Vâng, tôi hiểu.", en: "Yes, I understand." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Tôi muốn trà.", answer: "Я хочу чай." },
          { prompt: "Tôi không hiểu.", answer: "Я не понимаю." },
          { prompt: "Tôi uống nước.", answer: "Я пью воду." },
        ],
      },
    ],
    cultural_notes_vi:
      "`Я не понимаю` và `Говорите медленнее, пожалуйста` (nói chậm hơn) là hai câu cứu hộ quan trọng nhất khi mới học.",
    cultural_notes_en:
      "`Я не понимаю` and `Говорите медленнее, пожалуйста` (speak slower) are the two most important rescue lines for beginners.",
    tip_advice_vi: "Ở A1 chỉ cần thuộc dạng `я` của động từ; bạn vẫn giao tiếp được phần lớn nhu cầu.",
    tip_advice_en: "At A1, knowing only the `я` form already covers most of your needs.",
  },
  {
    id: "russian_a1_core_need_can",
    level: "A1",
    category: "daily_survival",
    title_vi: "A1 Core: Cần, được phép và không được",
    title_en: "A1 Core: Need, permission, and prohibition",
    intro_vi:
      "`Мне нужно...` (tôi cần), `Можно...?` (được không?), `Нельзя` (không được). Ba mẫu cốt lõi để xử lý tình huống.",
    intro_en:
      "`Мне нужно...` (I need), `Можно...?` (may I?), `Нельзя` (not allowed). Three core patterns for handling situations.",
    sentences: [
      {
        russian: "Мне нужно такси.",
        romanization: "Mne nuzhno taksi.",
        en: "I need a taxi.",
        vi: "Tôi cần taxi.",
        pronunciation_focus: ["мне нужно cụm cố định", "нужно với danh từ trung tính/việc", "ж là sh kêu"],
        pronunciation_focus_en: ["мне нужно is a fixed chunk", "нужно with neuter noun/action", "ж is voiced sh"],
      },
      {
        russian: "Можно войти?",
        romanization: "Mozhno voyti?",
        en: "May I come in?",
        vi: "Tôi vào được không?",
        pronunciation_focus: ["можно = được không", "войти = đi vào", "giọng hỏi lịch sự"],
        pronunciation_focus_en: ["можно means may I", "войти means to enter", "polite question pitch"],
      },
      {
        russian: "Да, можно.",
        romanization: "Da, mozhno.",
        en: "Yes, you may.",
        vi: "Được.",
        pronunciation_focus: ["можно trọng âm đầu", "о cuối nghe a", "câu cho phép ngắn"],
        pronunciation_focus_en: ["можно stresses the start", "final о sounds a", "short permission line"],
      },
      {
        russian: "Нет, нельзя.",
        romanization: "Net, nelzya.",
        en: "No, it's not allowed.",
        vi: "Không, không được.",
        pronunciation_focus: ["нельзя trái nghĩa можно", "ь mềm + зя", "trọng âm -зя"],
        pronunciation_focus_en: ["нельзя is the opposite of можно", "soft ь + зя", "stress on -зя"],
      },
    ],
    vocabulary: [
      { word: "нужно", romanization: "nuzhno", en: "need / necessary", vi: "cần", pos: "predicate", pronunciation_vi: "NUZH-na", pronunciation_en: "NOOZH-na" },
      { word: "можно", romanization: "mozhno", en: "may / allowed", vi: "được phép", pos: "predicate", pronunciation_vi: "MOZH-na", pronunciation_en: "MOZH-na" },
      { word: "нельзя", romanization: "nelzya", en: "not allowed", vi: "không được", pos: "predicate", pronunciation_vi: "nyel-ZYA", pronunciation_en: "nyel-ZYAH" },
      { word: "войти", romanization: "voyti", en: "to enter", vi: "đi vào", pos: "verb", pronunciation_vi: "vay-TI", pronunciation_en: "vai-TEE" },
    ],
    dialogue: [
      { speaker: "Ан", text: "Можно войти?", romanization: "Mozhno voyti?", vi: "Em vào được không?", en: "May I come in?" },
      { speaker: "Учитель", text: "Да, можно.", romanization: "Da, mozhno.", vi: "Được.", en: "Yes, you may." },
      { speaker: "Ан", text: "Мне нужен учебник.", romanization: "Mne nuzhen uchebnik.", vi: "Em cần sách giáo khoa.", en: "I need a textbook." },
      { speaker: "Учитель", text: "Вот учебник.", romanization: "Vot uchebnik.", vi: "Đây là sách giáo khoa.", en: "Here is the textbook." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Tôi cần taxi.", answer: "Мне нужно такси." },
          { prompt: "Tôi vào được không?", answer: "Можно войти?" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ trái nghĩa với можно.",
        instruction_en: "Fill the opposite of можно.",
        items: [{ prompt: "Нет, ___.", answer: "нельзя" }],
      },
    ],
    cultural_notes_vi:
      "`Нужно/нужен/нужна/нужны` đổi theo giống và số của vật cần. A1 cứ dùng `нужно` chung trước, sửa dần sau.",
    cultural_notes_en:
      "`Нужно/нужен/нужна/нужны` changes by gender and number of the needed thing. At A1, use the general `нужно` first and refine later.",
    tip_advice_vi: "`Можно?` một mình (kèm cử chỉ) đã đủ xin phép trong nhiều tình huống thực tế.",
    tip_advice_en: "A standalone `Можно?` (with a gesture) is enough to ask permission in many real situations.",
  },
];

export default lessons;
