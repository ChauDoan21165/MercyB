// src/languages/russian/lessons-a1.ts
//
// Batch 1 A1 lessons converted from:
// course-a1-complete.md, russian-alphabet-vietnamese.md,
// dialogues-beginner-001-050.md, writing-practice-book.md,
// frequency-words-001.tsv, master-vocabulary.tsv, russian-exam-preparation.md.

import type { RussianLesson } from "./lessons";

export const lessons: RussianLesson[] = [
  {
    id: "russian_a1_cyrillic_stress",
    level: "A1",
    category: "script_foundation",
    title_vi: "A1: Chữ Cyrillic, trọng âm và bẫy chữ giống Latin",
    title_en: "A1: Cyrillic, stress, and Latin-lookalike traps",
    intro_vi:
      "Tiếng Nga dùng chữ Cyrillic. Người học Việt nên nhận diện mặt chữ, tránh đọc theo tiếng Anh, và nghe trọng âm thay vì thêm thanh điệu.",
    intro_en:
      "Russian uses Cyrillic. Vietnamese learners should learn the letter shapes, avoid English letter habits, and listen for stress instead of adding tones.",
    sentences: [
      {
        russian: "Привет.",
        romanization: "Privet.",
        en: "Hi.",
        vi: "Chào.",
        pronunciation_focus: ["П = p", "р là âm r rung/đập", "е nghe gần ye/e"],
        pronunciation_focus_en: ["П is p", "р is tapped or rolled r", "е sounds close to ye/e"],
      },
      {
        russian: "Спасибо.",
        romanization: "Spasibo.",
        en: "Thank you.",
        vi: "Cảm ơn.",
        pronunciation_focus: ["с = s", "и = i", "о không nhấn thường nghe gần a"],
        pronunciation_focus_en: ["с is s", "и is i", "unstressed о often sounds closer to a"],
      },
      {
        russian: "Я говорю по-русски.",
        romanization: "Ya govoryu po-russki.",
        en: "I speak Russian.",
        vi: "Tôi nói tiếng Nga.",
        pronunciation_focus: ["я ở đầu từ nghe ya", "г = g", "р không đọc như p Latin"],
        pronunciation_focus_en: ["initial я sounds ya", "г is g", "р is not Latin p"],
      },
      {
        russian: "Очень хорошо.",
        romanization: "Ochen khorosho.",
        en: "Very good.",
        vi: "Rất tốt.",
        pronunciation_focus: ["ч mềm và sắc", "х gần kh", "trọng âm ở -шо"],
        pronunciation_focus_en: ["ч is soft and sharp", "х is close to kh", "stress falls on -шо"],
      },
    ],
    vocabulary: [
      {
        cell_id: "b4e4ad0d-a1b6-4809-8899-db9257bc2208",
        word: "я",
        romanization: "ya",
        en: "I",
        vi: "tôi",
        pos: "pronoun",
        pronunciation_vi: "ya",
        pronunciation_en: "yah",
      },
      {
        cell_id: "27a0f948-0f51-4ca3-8138-d059adcdea2b",
        word: "говорить",
        romanization: "govorit",
        en: "to speak",
        vi: "nói",
        pos: "verb",
        pronunciation_vi: "ga-va-RIT",
        pronunciation_en: "ga-va-REET",
      },
      {
        cell_id: "9d10e015-03cf-4493-96ad-02e3e8a62236",
        word: "русский",
        romanization: "russkiy",
        en: "Russian",
        vi: "tiếng Nga / người Nga",
        pos: "adjective/noun",
        pronunciation_vi: "RUS-skiy",
        pronunciation_en: "ROOS-skee",
      },
      {
        cell_id: "22eedb74-d2fb-44d0-861b-2dea79504a1e",
        word: "хорошо",
        romanization: "khorosho",
        en: "good / well",
        vi: "tốt",
        pos: "adverb",
        pronunciation_vi: "kha-ra-SHO",
        pronunciation_en: "kha-ra-SHO",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối chữ Cyrillic với âm gần đúng.",
        instruction_en: "Match each Cyrillic letter with its closest sound.",
        items: [
          { prompt: "В", answer: "v" },
          { prompt: "Н", answer: "n" },
          { prompt: "Р", answer: "r" },
          { prompt: "С", answer: "s" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Cảm ơn.", answer: "Спасибо." },
          { prompt: "Tôi nói tiếng Nga.", answer: "Я говорю по-русски." },
        ],
      },
    ],
    cultural_notes_vi:
      "Một số chữ Nga nhìn giống Latin nhưng đọc khác: В = v, Н = n, Р = r, С = s, У = u. Hãy học mặt chữ trước khi học nhiều câu dài.",
    cultural_notes_en:
      "Some Russian letters look like Latin letters but sound different: В = v, Н = n, Р = r, С = s, У = u. Learn the script before loading many long sentences.",
    tip_advice_vi:
      "Đừng thêm nguyên âm phụ vào cụm phụ âm. Tập đọc chậm: кто, где, здравствуйте.",
    tip_advice_en:
      "Do not insert extra vowels into consonant clusters. Drill slowly: кто, где, здравствуйте.",
  },
  {
    id: "russian_a1_greetings_names",
    level: "A1",
    category: "daily_survival",
    title_vi: "A1: Chào hỏi và giới thiệu tên",
    title_en: "A1: Greetings and names",
    intro_vi:
      "Bài này chuyển nội dung A1 chào hỏi thành mẫu dùng ngay: nói tên, hỏi tên thân mật hoặc lịch sự, và kết thúc cuộc gặp.",
    intro_en:
      "This lesson turns the A1 greeting unit into usable patterns: give your name, ask names informally or politely, and close the interaction.",
    sentences: [
      {
        russian: "Здравствуйте.",
        romanization: "Zdravstvuyte.",
        en: "Hello.",
        vi: "Xin chào.",
        pronunciation_focus: ["здр là cụm khó", "вств đọc liền", "dùng khi lịch sự"],
        pronunciation_focus_en: ["здр is a hard cluster", "вств is linked", "use it politely"],
      },
      {
        russian: "Как вас зовут?",
        romanization: "Kak vas zovut?",
        en: "What is your name? (polite)",
        vi: "Anh/chị tên là gì?",
        pronunciation_focus: ["как ngắn", "вас là dạng lịch sự", "зовут nhấn ở -вут"],
        pronunciation_focus_en: ["как is short", "вас is polite", "зовут stresses -вут"],
      },
      {
        russian: "Меня зовут Ан.",
        romanization: "Menya zovut An.",
        en: "My name is An.",
        vi: "Tôi tên là An.",
        pronunciation_focus: ["меня nghe mye-NYA", "з = z", "tên riêng giữ rõ"],
        pronunciation_focus_en: ["меня sounds mye-NYA", "з is z", "keep names clear"],
      },
      {
        russian: "Очень приятно.",
        romanization: "Ochen priyatno.",
        en: "Nice to meet you.",
        vi: "Rất vui được gặp.",
        pronunciation_focus: ["ч mềm", "я trong приятно nghe ya", "о cuối nhẹ"],
        pronunciation_focus_en: ["ч is soft", "я in приятно sounds ya", "final о is light"],
      },
    ],
    vocabulary: [
      {
        cell_id: "eb34a788-0fe4-4bbe-9d31-fd6fcdb9d6e7",
        word: "Здравствуйте",
        romanization: "zdravstvuyte",
        en: "hello",
        vi: "xin chào lịch sự",
        pos: "interjection",
        pronunciation_vi: "ZDRAHV-stvuy-tye",
        pronunciation_en: "ZDRAHV-stvooy-tyeh",
      },
      {
        cell_id: "8dec42cc-a809-461d-b152-34d2d585c290",
        word: "как",
        romanization: "kak",
        en: "how / what",
        vi: "như thế nào",
        pos: "question word",
        pronunciation_vi: "kak",
        pronunciation_en: "kahk",
      },
      {
        cell_id: "53a11468-ba8b-465e-8bff-b25f78b09c43",
        word: "вас",
        romanization: "vas",
        en: "you (polite object form)",
        vi: "anh/chị/ông/bà",
        pos: "pronoun",
        pronunciation_vi: "vas",
        pronunciation_en: "vahs",
      },
      {
        cell_id: "02cc05f4-336e-47a6-a71d-0ae84af65681",
        word: "зовут",
        romanization: "zovut",
        en: "call / is named",
        vi: "gọi / tên là",
        pos: "verb",
        pronunciation_vi: "za-VOOT",
        pronunciation_en: "za-VOOT",
      },
    ],
    dialogue: [
      {
        cell_id: "1dcde44a-8c36-461f-a633-e503ddec58ff",
        speaker: "Ан",
        text: "Здравствуйте.",
        romanization: "Zdravstvuyte.",
        vi: "Xin chào.",
        en: "Hello.",
      },
      {
        cell_id: "4ae02323-ede0-406c-aa0c-360df01e9ccc",
        speaker: "Ира",
        text: "Здравствуйте. Как вас зовут?",
        romanization: "Zdravstvuyte. Kak vas zovut?",
        vi: "Xin chào. Anh/chị tên là gì?",
        en: "Hello. What is your name?",
      },
      {
        cell_id: "a745d590-552d-4779-a788-963127507b5b",
        speaker: "Ан",
        text: "Меня зовут Ан.",
        romanization: "Menya zovut An.",
        vi: "Tôi tên là An.",
        en: "My name is An.",
      },
      {
        cell_id: "c7c06565-8c88-42d9-a563-7abf6a8db542",
        speaker: "Ира",
        text: "Очень приятно.",
        romanization: "Ochen priyatno.",
        vi: "Rất vui được gặp.",
        en: "Nice to meet you.",
      },
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
      "`Вы/вас` dùng với người mới gặp, người lớn tuổi, hoặc tình huống công việc. `Ты/тебя` thân mật hơn.",
    cultural_notes_en:
      "`Вы/вас` is used with new people, older people, and work situations. `Ты/тебя` is more informal.",
    tip_advice_vi:
      "Học nguyên cụm `Меня зовут...` thay vì dịch từng chữ. Đây là mẫu giới thiệu an toàn nhất ở A1.",
    tip_advice_en:
      "Learn `Меня зовут...` as a whole chunk instead of translating word by word. It is the safest A1 self-introduction pattern.",
  },
  {
    id: "russian_a1_family_have",
    level: "A1",
    category: "daily_survival",
    title_vi: "A1: Gia đình và mẫu У меня есть",
    title_en: "A1: Family and the У меня есть pattern",
    intro_vi:
      "Tiếng Nga không dùng một động từ 'có' giống tiếng Việt trong mẫu sở hữu cơ bản. Học nguyên khung `У меня есть...` và `У меня нет...`.",
    intro_en:
      "Russian does not use a Vietnamese-style 'have' verb in the basic possession pattern. Learn `У меня есть...` and `У меня нет...` as frames.",
    sentences: [
      {
        russian: "У меня есть мама и папа.",
        romanization: "U menya yest mama i papa.",
        en: "I have a mother and father.",
        vi: "Tôi có mẹ và bố.",
        pronunciation_focus: ["у меня là một cụm", "есть đọc yest", "и = và"],
        pronunciation_focus_en: ["у меня is one chunk", "есть sounds yest", "и means and"],
      },
      {
        russian: "У тебя есть брат?",
        romanization: "U tebya yest brat?",
        en: "Do you have a brother?",
        vi: "Bạn có anh/em trai không?",
        pronunciation_focus: ["тебя nghe te-BYA", "брат có cụm br", "câu hỏi lên giọng nhẹ"],
        pronunciation_focus_en: ["тебя sounds te-BYA", "брат has br cluster", "question intonation rises slightly"],
      },
      {
        russian: "У меня нет сестры.",
        romanization: "U menya net sestry.",
        en: "I do not have a sister.",
        vi: "Tôi không có chị/em gái.",
        pronunciation_focus: ["нет + sinh cách", "сестры kết thúc -ы", "không thêm nguyên âm sau тр"],
        pronunciation_focus_en: ["нет takes genitive", "сестры ends in -ы", "do not add a vowel after тр"],
      },
      {
        russian: "Они во Вьетнаме.",
        romanization: "Oni vo Vyetname.",
        en: "They are in Vietnam.",
        vi: "Họ ở Việt Nam.",
        pronunciation_focus: ["они = họ", "во trước cụm khó", "Вьетнам giữ ь mềm"],
        pronunciation_focus_en: ["они means they", "во appears before difficult clusters", "Вьетнам keeps soft ь"],
      },
    ],
    vocabulary: [
      {
        cell_id: "37cd5d12-cfe4-46bf-92d8-bd2f7dac4bc9",
        word: "семья",
        romanization: "semya",
        en: "family",
        vi: "gia đình",
        pos: "noun",
        pronunciation_vi: "sem-YA",
        pronunciation_en: "sem-YAH",
      },
      {
        cell_id: "47ce7bf4-bdd8-4e95-9337-63e3186371bf",
        word: "мама",
        romanization: "mama",
        en: "mother",
        vi: "mẹ",
        pos: "noun",
        pronunciation_vi: "MA-ma",
        pronunciation_en: "MAH-mah",
      },
      {
        cell_id: "b866ea60-84c0-437a-ab9d-cd243afb246d",
        word: "брат",
        romanization: "brat",
        en: "brother",
        vi: "anh/em trai",
        pos: "noun",
        pronunciation_vi: "brat",
        pronunciation_en: "braht",
      },
      {
        cell_id: "ac2a10dc-2353-4924-90db-bde4e15429e2",
        word: "сестра",
        romanization: "sestra",
        en: "sister",
        vi: "chị/em gái",
        pos: "noun",
        pronunciation_vi: "ses-TRA",
        pronunciation_en: "ses-TRAH",
      },
    ],
    dialogue: [
      {
        cell_id: "168c6011-d6bc-4487-bbe6-aa74893be4d5",
        speaker: "Иван",
        text: "У тебя есть родители?",
        romanization: "U tebya yest roditeli?",
        vi: "Bạn có bố mẹ không?",
        en: "Do you have parents?",
      },
      {
        cell_id: "6c66ee41-0563-44d5-b690-99bea6d9be52",
        speaker: "Лан",
        text: "Да, есть мама и папа.",
        romanization: "Da, yest mama i papa.",
        vi: "Có, tôi có mẹ và bố.",
        en: "Yes, I have a mother and father.",
      },
      {
        cell_id: "bf98fd59-1fc1-4115-a281-9abfb09ad1bb",
        speaker: "Иван",
        text: "Они во Вьетнаме?",
        romanization: "Oni vo Vyetname?",
        vi: "Họ ở Việt Nam à?",
        en: "Are they in Vietnam?",
      },
      {
        cell_id: "7752e7cd-e677-489a-8511-7a030c0a6f0a",
        speaker: "Лан",
        text: "Да, они в Ханое.",
        romanization: "Da, oni v Khanoye.",
        vi: "Vâng, họ ở Hà Nội.",
        en: "Yes, they are in Hanoi.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu.",
        instruction_en: "Fill the blank.",
        items: [
          { prompt: "У меня ___ мама.", answer: "есть" },
          { prompt: "У меня ___ сестры.", answer: "нет" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [{ prompt: "Bạn có anh/em trai không?", answer: "У тебя есть брат?" }],
      },
    ],
    cultural_notes_vi:
      "Mẫu `У меня есть...` nghĩa đen gần như 'ở tôi có...', nhưng trong tiếng Việt nên hiểu tự nhiên là 'tôi có...'.",
    cultural_notes_en:
      "`У меня есть...` is literally closer to 'at me there is...', but naturally means 'I have...'.",
    tip_advice_vi:
      "Khi phủ định, học nguyên cụm `нет сестры`, `нет времени`. Sau `нет`, danh từ thường đổi sang sinh cách.",
    tip_advice_en:
      "For negatives, memorize chunks like `нет сестры`, `нет времени`. After `нет`, nouns usually move to genitive.",
  },
  {
    id: "russian_a1_self_intro_exam",
    level: "A1",
    category: "daily_survival",
    title_vi: "A1: Tự giới thiệu ngắn để viết và thi",
    title_en: "A1: Short self-introduction for writing and exams",
    intro_vi:
      "Bài này gom mẫu từ sách viết và đề thi A1: tên, quê, nơi sống, tuổi, việc học tiếng Nga và sở thích.",
    intro_en:
      "This lesson combines writing-book and A1 exam patterns: name, origin, current city, age, Russian study, and a hobby.",
    sentences: [
      {
        russian: "Меня зовут Линь.",
        romanization: "Menya zovut Lin.",
        en: "My name is Linh.",
        vi: "Tôi tên là Linh.",
        pronunciation_focus: ["меня zovut là cụm cố định", "Линь có ь mềm", "giữ n cuối nhẹ"],
        pronunciation_focus_en: ["меня зовут is a fixed chunk", "Линь has soft ь", "keep final n light"],
      },
      {
        russian: "Я из Вьетнама.",
        romanization: "Ya iz Vyetnama.",
        en: "I am from Vietnam.",
        vi: "Tôi đến từ Việt Nam.",
        pronunciation_focus: ["из + sinh cách", "Вьетнама đổi đuôi", "không đọc В như b"],
        pronunciation_focus_en: ["из takes genitive", "Вьетнама changes ending", "do not read В as b"],
      },
      {
        russian: "Сейчас я живу в Ханое.",
        romanization: "Seychas ya zhivu v Khanoye.",
        en: "Now I live in Hanoi.",
        vi: "Bây giờ tôi sống ở Hà Nội.",
        pronunciation_focus: ["сейчас thường dùng ở đầu câu", "ж = voiced sh", "в Ханое = ở Hà Nội"],
        pronunciation_focus_en: ["сейчас often starts the sentence", "ж is voiced sh", "в Ханое means in Hanoi"],
      },
      {
        russian: "Я учу русский язык.",
        romanization: "Ya uchu russkiy yazyk.",
        en: "I am learning Russian.",
        vi: "Tôi học tiếng Nga.",
        pronunciation_focus: ["учу = tôi học", "русский có ss rõ", "язык nhấn âm sau"],
        pronunciation_focus_en: ["учу means I learn", "русский keeps clear ss", "язык stresses the second syllable"],
      },
    ],
    vocabulary: [
      {
        cell_id: "2be22275-fc54-4313-8d49-f54d5522769f",
        word: "из",
        romanization: "iz",
        en: "from",
        vi: "từ",
        pos: "preposition",
        pronunciation_vi: "iz",
        pronunciation_en: "eez",
      },
      {
        cell_id: "589f142d-f37a-4c64-9de5-c0cb09051717",
        word: "сейчас",
        romanization: "seychas",
        en: "now",
        vi: "bây giờ",
        pos: "adverb",
        pronunciation_vi: "sey-CHAS",
        pronunciation_en: "see-CHAS",
      },
      {
        cell_id: "8d91fac4-004e-4177-857c-b4cb406ada0e",
        word: "жить",
        romanization: "zhit",
        en: "to live",
        vi: "sống",
        pos: "verb",
        pronunciation_vi: "zhit",
        pronunciation_en: "zheet",
      },
      {
        cell_id: "cd0f53cb-f5ea-4542-98c9-506268f6a582",
        word: "учить",
        romanization: "uchit",
        en: "to learn / teach",
        vi: "học / dạy",
        pos: "verb",
        pronunciation_vi: "u-CHIT",
        pronunciation_en: "oo-CHEET",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Tôi đến từ Việt Nam.", answer: "Я из Вьетнама." },
          { prompt: "Tôi học tiếng Nga.", answer: "Я учу русский язык." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Hoàn thành mẫu giới thiệu.",
        instruction_en: "Complete the self-introduction pattern.",
        items: [
          { prompt: "Меня ___ Линь.", answer: "зовут" },
          { prompt: "Я ___ Вьетнама.", answer: "из" },
        ],
      },
    ],
    cultural_notes_vi:
      "Ở A1, bài viết tốt là bài đơn giản và đúng. Không cần câu dài; chỉ cần 5-7 câu rõ về bản thân.",
    cultural_notes_en:
      "At A1, strong writing is simple and correct. You do not need long sentences; 5-7 clear sentences about yourself are enough.",
    tip_advice_vi:
      "Tập viết một đoạn cố định: tên, nước, thành phố, tuổi, lý do học. Sau đó thay dữ liệu cá nhân.",
    tip_advice_en:
      "Practice one fixed paragraph: name, country, city, age, reason for study. Then swap in your real details.",
  },
];

export default lessons;
