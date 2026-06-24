// src/languages/russian/lessons-a2.ts
//
// Batch 1 A2 lessons converted from:
// course-a2-complete.md, grammar-exercises-001.md,
// grammar-exercises-002.md, writing-corrections-corpus.md,
// master-vocabulary.tsv, russian-exam-preparation.md.

import type { RussianLesson } from "./lessons";

export const lessons: RussianLesson[] = [
  {
    id: "russian_a2_sentence_control",
    level: "A2",
    category: "case_control",
    title_vi: "A2: Kiểm soát câu, thời gian và trật tự từ",
    title_en: "A2: Sentence control, time, and word order",
    intro_vi:
      "A2 bắt đầu bằng câu đủ vai: ai làm gì, ở đâu, khi nào. Tiếng Nga có thể đổi trật tự từ vì đuôi cách giữ vai trò.",
    intro_en:
      "A2 starts with complete sentence roles: who does what, where, and when. Russian can move word order because case endings carry roles.",
    sentences: [
      {
        russian: "Я живу в Канаде.",
        romanization: "Ya zhivu v Kanade.",
        en: "I live in Canada.",
        vi: "Tôi sống ở Canada.",
        pronunciation_focus: ["живу nhấn -ву", "в Канаде dùng giới cách", "не đọc Canada theo tiếng Anh"],
        pronunciation_focus_en: ["живу stresses -ву", "в Канаде uses prepositional", "do not force English Canada"],
      },
      {
        russian: "Обычно я говорю по-английски.",
        romanization: "Obychno ya govoryu po-angliyski.",
        en: "Usually I speak English.",
        vi: "Thường tôi nói tiếng Anh.",
        pronunciation_focus: ["обычно = thường", "говорю nhấn cuối", "по-английски là trạng từ ngôn ngữ"],
        pronunciation_focus_en: ["обычно means usually", "говорю stresses the end", "по-английски is the language adverb"],
      },
      {
        russian: "Сейчас я изучаю русский язык.",
        romanization: "Seychas ya izuchayu russkiy yazyk.",
        en: "Now I am studying Russian.",
        vi: "Bây giờ tôi học tiếng Nga.",
        pronunciation_focus: ["изучаю trang trọng hơn учу", "язык nhấn -зык", "сейчас đặt đầu câu được"],
        pronunciation_focus_en: ["изучаю is more formal than учу", "язык stresses -зык", "сейчас can start the sentence"],
      },
      {
        russian: "Вечером я читаю книгу.",
        romanization: "Vecherom ya chitayu knigu.",
        en: "In the evening, I read a book.",
        vi: "Buổi tối tôi đọc sách.",
        pronunciation_focus: ["вечером đặt đầu để nhấn thời gian", "книгу là đối cách", "читаю có ch mềm"],
        pronunciation_focus_en: ["вечером is fronted for time focus", "книгу is accusative", "читаю has soft ch"],
      },
    ],
    vocabulary: [
      {
        word: "обычно",
        romanization: "obychno",
        en: "usually",
        vi: "thường",
        pos: "adverb",
        pronunciation_vi: "a-BYCH-na",
        pronunciation_en: "a-BICH-na",
      },
      {
        word: "иногда",
        romanization: "inogda",
        en: "sometimes",
        vi: "đôi khi",
        pos: "adverb",
        pronunciation_vi: "i-nag-DA",
        pronunciation_en: "ee-nag-DA",
      },
      {
        word: "каждый день",
        romanization: "kazhdyy den",
        en: "every day",
        vi: "mỗi ngày",
        pos: "phrase",
        pronunciation_vi: "KAZH-dyy dyen",
        pronunciation_en: "KAZH-dee dyen",
      },
      {
        word: "изучать",
        romanization: "izuchat",
        en: "to study",
        vi: "học / nghiên cứu",
        pos: "verb",
        pronunciation_vi: "i-zu-CHAT",
        pronunciation_en: "ee-zoo-CHAT",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Tôi sống ở Canada.", answer: "Я живу в Канаде." },
          { prompt: "Bây giờ tôi học tiếng Nga.", answer: "Сейчас я изучаю русский язык." },
        ],
      },
    ],
    cultural_notes_vi:
      "Tiếng Việt dựa nhiều vào trật tự từ. Tiếng Nga dựa thêm vào đuôi cách, nên A2 phải chú ý vai trò của danh từ.",
    cultural_notes_en:
      "Vietnamese leans heavily on word order. Russian also uses case endings, so A2 learners must track each noun's role.",
    tip_advice_vi:
      "Viết 6 câu về bản thân: sống ở đâu, làm/học ở đâu, nói ngôn ngữ nào, làm gì mỗi ngày, đôi khi làm gì, vì sao học tiếng Nga.",
    tip_advice_en:
      "Write 6 sentences about yourself: where you live, work/study, languages, daily routine, occasional actions, and why you study Russian.",
  },
  {
    id: "russian_a2_accusative_objects",
    level: "A2",
    category: "case_control",
    title_vi: "A2: Đối cách cho vật trực tiếp",
    title_en: "A2: Accusative for direct objects",
    intro_vi:
      "Đối cách trả lời câu hỏi 'thấy/mua/đọc/muốn cái gì'. Tiếng Việt không đổi danh từ, nhưng tiếng Nga đổi một số đuôi.",
    intro_en:
      "The accusative marks what you see, buy, read, want, or need. Vietnamese nouns do not change, but Russian often changes endings.",
    sentences: [
      {
        russian: "Я читаю книгу.",
        romanization: "Ya chitayu knigu.",
        en: "I read a book.",
        vi: "Tôi đọc sách.",
        pronunciation_focus: ["книга đổi thành книгу", "г trong книгу = g", "động từ читаю cần tân ngữ"],
        pronunciation_focus_en: ["книга becomes книгу", "г in книгу is g", "читаю takes a direct object"],
      },
      {
        russian: "Он покупает воду.",
        romanization: "On pokupayet vodu.",
        en: "He buys water.",
        vi: "Anh ấy mua nước.",
        pronunciation_focus: ["вода đổi thành воду", "покупает có nhiều âm", "он = anh ấy"],
        pronunciation_focus_en: ["вода becomes воду", "покупает has several syllables", "он means he"],
      },
      {
        russian: "Мы ищем автобус.",
        romanization: "My ishchem avtobus.",
        en: "We are looking for a bus.",
        vi: "Chúng tôi tìm xe buýt.",
        pronunciation_focus: ["автобус không đổi vì bất động vật giống đực", "щ trong ищем mềm", "мы = chúng tôi"],
        pronunciation_focus_en: ["автобус does not change as masculine inanimate", "щ in ищем is soft", "мы means we"],
      },
      {
        russian: "Я хочу чай.",
        romanization: "Ya khochu chay.",
        en: "I want tea.",
        vi: "Tôi muốn trà.",
        pronunciation_focus: ["хочу nhấn -чу", "чай không đổi", "х gần kh"],
        pronunciation_focus_en: ["хочу stresses -чу", "чай does not change", "х is close to kh"],
      },
    ],
    vocabulary: [
      {
        word: "читать",
        romanization: "chitat",
        en: "to read",
        vi: "đọc",
        pos: "verb",
        pronunciation_vi: "chi-TAT",
        pronunciation_en: "chee-TAT",
      },
      {
        word: "покупать",
        romanization: "pokupat",
        en: "to buy",
        vi: "mua",
        pos: "verb",
        pronunciation_vi: "pa-ku-PAT",
        pronunciation_en: "pa-koo-PAT",
      },
      {
        word: "искать",
        romanization: "iskat",
        en: "to look for",
        vi: "tìm",
        pos: "verb",
        pronunciation_vi: "is-KAT",
        pronunciation_en: "ees-KAT",
      },
      {
        word: "хотеть",
        romanization: "khotet",
        en: "to want",
        vi: "muốn",
        pos: "verb",
        pronunciation_vi: "kha-TYET",
        pronunciation_en: "kha-TYET",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn dạng đúng.",
        instruction_en: "Choose the correct form.",
        items: [
          { prompt: "Я читаю ___. (книга / книгу / книге)", answer: "книгу" },
          { prompt: "Я покупаю ___. (вода / воду / воде)", answer: "воду" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [{ prompt: "Tôi muốn trà.", answer: "Я хочу чай." }],
      },
    ],
    cultural_notes_vi:
      "Đối cách là một trong các điểm khác biệt lớn với tiếng Việt: vai trò 'vật bị tác động' nằm ở đuôi từ, không chỉ ở vị trí trong câu.",
    cultural_notes_en:
      "Accusative is a major difference from Vietnamese: the direct object's role appears in the ending, not only in word order.",
    tip_advice_vi:
      "Học cụm động từ + tân ngữ: `читать книгу`, `покупать воду`, `искать автобус`, `хотеть чай`.",
    tip_advice_en:
      "Learn verb + object chunks: `читать книгу`, `покупать воду`, `искать автобус`, `хотеть чай`.",
  },
  {
    id: "russian_a2_prepositional_location",
    level: "A2",
    category: "case_control",
    title_vi: "A2: Giới cách cho nơi chốn",
    title_en: "A2: Prepositional case for location",
    intro_vi:
      "Khi nói đang ở đâu, tiếng Nga thường dùng `в/на + giới cách`. Cần phân biệt hướng đi và vị trí.",
    intro_en:
      "For location, Russian often uses `в/на + prepositional`. Distinguish direction from being at a place.",
    sentences: [
      {
        russian: "Я живу в городе.",
        romanization: "Ya zhivu v gorode.",
        en: "I live in the city.",
        vi: "Tôi sống trong thành phố.",
        pronunciation_focus: ["город đổi thành городе", "в + nơi chốn", "ж trong живу"],
        pronunciation_focus_en: ["город becomes городе", "в + location", "ж in живу"],
      },
      {
        russian: "Она работает в офисе.",
        romanization: "Ona rabotayet v ofise.",
        en: "She works in an office.",
        vi: "Cô ấy làm việc ở văn phòng.",
        pronunciation_focus: ["офис đổi thành офисе", "работает nhịp đều", "она = cô ấy"],
        pronunciation_focus_en: ["офис becomes офисе", "работает has even rhythm", "она means she"],
      },
      {
        russian: "Мы сейчас на работе.",
        romanization: "My seychas na rabote.",
        en: "We are at work now.",
        vi: "Bây giờ chúng tôi đang ở chỗ làm.",
        pronunciation_focus: ["на работе là cụm cố định", "работа đổi thành работе", "сейчас đặt giữa câu được"],
        pronunciation_focus_en: ["на работе is a fixed phrase", "работа becomes работе", "сейчас can sit mid-sentence"],
      },
      {
        russian: "Документы на столе.",
        romanization: "Dokumenty na stole.",
        en: "The documents are on the table.",
        vi: "Tài liệu ở trên bàn.",
        pronunciation_focus: ["стол đổi thành столе", "trọng âm ở -ле", "không cần động từ hiện tại"],
        pronunciation_focus_en: ["стол becomes столе", "stress on -ле", "present-tense be is omitted"],
      },
    ],
    vocabulary: [
      {
        word: "город",
        romanization: "gorod",
        en: "city",
        vi: "thành phố",
        pos: "noun",
        pronunciation_vi: "GO-rat",
        pronunciation_en: "GO-rut",
      },
      {
        word: "офис",
        romanization: "ofis",
        en: "office",
        vi: "văn phòng",
        pos: "noun",
        pronunciation_vi: "O-fis",
        pronunciation_en: "OH-fees",
      },
      {
        word: "работа",
        romanization: "rabota",
        en: "work",
        vi: "công việc / chỗ làm",
        pos: "noun",
        pronunciation_vi: "ra-BO-ta",
        pronunciation_en: "ra-BO-ta",
      },
      {
        word: "стол",
        romanization: "stol",
        en: "table / desk",
        vi: "bàn",
        pos: "noun",
        pronunciation_vi: "stol",
        pronunciation_en: "stol",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Trả lời Где? bằng dạng nơi chốn.",
        instruction_en: "Answer Где? with the location form.",
        items: [
          { prompt: "Где ты живёшь? Я живу в ___. (город)", answer: "городе" },
          { prompt: "Где документы? Они на ___. (стол)", answer: "столе" },
        ],
      },
    ],
    cultural_notes_vi:
      "`В школу` là đi tới trường; `в школе` là ở trong trường. Người học Việt thường bỏ qua khác biệt hướng đi/vị trí vì tiếng Việt dùng thêm từ ngữ cảnh.",
    cultural_notes_en:
      "`В школу` means to school; `в школе` means in school. Vietnamese learners often miss direction vs location because Vietnamese relies on context words.",
    tip_advice_vi:
      "Đặt câu hỏi trước: `Где?` dùng vị trí; `Куда?` dùng hướng đi.",
    tip_advice_en:
      "Ask the question first: `Где?` is location; `Куда?` is direction.",
  },
  {
    id: "russian_a2_past_future_aspect",
    level: "A2",
    category: "case_control",
    title_vi: "A2: Quá khứ, tương lai và thể động từ",
    title_en: "A2: Past, future, and verb aspect",
    intro_vi:
      "Ở A2, người học bắt đầu kiểm soát thời gian và kết quả: đã làm, sẽ làm, làm thường xuyên, hay hoàn thành một lần.",
    intro_en:
      "At A2, learners start controlling time and result: did, will do, do regularly, or complete once.",
    sentences: [
      {
        russian: "Вчера я работал.",
        romanization: "Vchera ya rabotal.",
        en: "Yesterday I worked. (male speaker)",
        vi: "Hôm qua tôi đã làm việc. (người nói nam)",
        pronunciation_focus: ["вчера nhấn -ра", "работал dạng nam", "quá khứ đổi theo giống"],
        pronunciation_focus_en: ["вчера stresses -ра", "работал is masculine", "past tense agrees by gender"],
      },
      {
        russian: "Вчера Анна писала письмо.",
        romanization: "Vchera Anna pisala pismo.",
        en: "Yesterday Anna was writing a letter.",
        vi: "Hôm qua Anna đã viết thư.",
        pronunciation_focus: ["писала dạng nữ", "письмо giữ ь", "động từ quá khứ nữ kết thúc -а"],
        pronunciation_focus_en: ["писала is feminine", "письмо keeps ь", "feminine past often ends in -а"],
      },
      {
        russian: "Завтра я буду работать.",
        romanization: "Zavtra ya budu rabotat.",
        en: "Tomorrow I will work.",
        vi: "Ngày mai tôi sẽ làm việc.",
        pronunciation_focus: ["буду + động từ nguyên mẫu", "завтра = ngày mai", "không chia nguyên mẫu sau буду"],
        pronunciation_focus_en: ["буду + infinitive", "завтра means tomorrow", "do not conjugate the infinitive after буду"],
      },
      {
        russian: "Я читаю книгу каждый день.",
        romanization: "Ya chitayu knigu kazhdyy den.",
        en: "I read a book every day.",
        vi: "Tôi đọc sách mỗi ngày.",
        pronunciation_focus: ["mẫu lặp lại dùng chưa hoàn thành", "каждый день = mỗi ngày", "книгу là đối cách"],
        pronunciation_focus_en: ["routine uses imperfective", "каждый день means every day", "книгу is accusative"],
      },
    ],
    vocabulary: [
      {
        word: "вчера",
        romanization: "vchera",
        en: "yesterday",
        vi: "hôm qua",
        pos: "adverb",
        pronunciation_vi: "vche-RA",
        pronunciation_en: "vcheh-RA",
      },
      {
        word: "завтра",
        romanization: "zavtra",
        en: "tomorrow",
        vi: "ngày mai",
        pos: "adverb",
        pronunciation_vi: "ZAV-tra",
        pronunciation_en: "ZAV-tra",
      },
      {
        word: "буду",
        romanization: "budu",
        en: "I will",
        vi: "tôi sẽ",
        pos: "verb",
        pronunciation_vi: "BU-du",
        pronunciation_en: "BOO-doo",
      },
      {
        word: "каждый день",
        romanization: "kazhdyy den",
        en: "every day",
        vi: "mỗi ngày",
        pos: "phrase",
        pronunciation_vi: "KAZH-dyy dyen",
        pronunciation_en: "KAZH-dee dyen",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn dạng đúng.",
        instruction_en: "Choose the correct form.",
        items: [
          { prompt: "Анна ___ письмо. (писал / писала / писало)", answer: "писала" },
          { prompt: "Иван ___ книгу. (читал / читала / читало)", answer: "читал" },
          { prompt: "Завтра я ___ работать.", answer: "буду" },
        ],
      },
    ],
    cultural_notes_vi:
      "Tiếng Việt không chia động từ theo nam/nữ. Tiếng Nga quá khứ số ít thường cần giống: nam `работал`, nữ `работала`.",
    cultural_notes_en:
      "Vietnamese verbs do not change for gender. Russian singular past tense often needs gender: masculine `работал`, feminine `работала`.",
    tip_advice_vi:
      "Khi viết A2, gạch chân từ thời gian trước: вчера, сегодня, завтра, каждый день. Sau đó chọn dạng động từ.",
    tip_advice_en:
      "For A2 writing, underline the time word first: вчера, сегодня, завтра, каждый день. Then choose the verb form.",
  },
];

export default lessons;
