// src/languages/russian/lessons-b1-core.ts
//
// B1 core lesson batch converted from the local Vietnamese-Russian archive:
// course-b1-foundation.md, course-b1-intermediate.md, b1-standard-audit.md,
// cases-workbook-v2.md, aspect-motion-mastery.md, russian-grammar-reference-v2.md.
//
// Focus: the six cases, verbal aspect, motion verbs, and connected B1 speech for
// Vietnamese learners moving from A2 to B1. Compact and app-ready; this batch is
// standalone and does not modify the existing foundation files.

import type { RussianLesson } from "./lessons";

export const lessons: RussianLesson[] = [
  {
    id: "russian_b1_core_genitive_possession_quantity",
    level: "B1",
    category: "case_control",
    title_vi: "B1: Cách 2 (родительный) — sở hữu, số lượng, phủ định",
    title_en: "B1: Genitive case — possession, quantity, negation",
    intro_vi:
      "Cách sinh cách (родительный) trả lời 'của ai' và 'không có gì'. Tiếng Việt dùng 'của', 'không có', 'gần'; tiếng Nga đổi đuôi từ.",
    intro_en:
      "The genitive answers 'whose' and 'there is no…'. Vietnamese uses 'của', 'không có', 'gần'; Russian changes the word ending instead.",
    sentences: [
      {
        russian: "У меня нет времени.",
        romanization: "U menya net vremeni.",
        en: "I have no time.",
        vi: "Tôi không có thời gian.",
        pronunciation_focus: ["нет + cách 2", "время → времени", "У меня = tôi có/không có"],
        pronunciation_focus_en: ["нет takes genitive", "время → времени", "У меня = I have"],
      },
      {
        russian: "Это машина моего брата.",
        romanization: "Eto mashina moyego brata.",
        en: "This is my brother's car.",
        vi: "Đây là xe của anh trai tôi.",
        pronunciation_focus: ["брат → брата", "мой → моего", "sở hữu = cách 2"],
        pronunciation_focus_en: ["брат → брата", "мой → моего", "possession = genitive"],
      },
      {
        russian: "У нас много работы.",
        romanization: "U nas mnogo raboty.",
        en: "We have a lot of work.",
        vi: "Chúng tôi có nhiều việc.",
        pronunciation_focus: ["много + cách 2", "работа → работы", "số lượng đổi đuôi"],
        pronunciation_focus_en: ["много takes genitive", "работа → работы", "quantity changes ending"],
      },
      {
        russian: "Магазин около вокзала.",
        romanization: "Magazin okolo vokzala.",
        en: "The shop is near the station.",
        vi: "Cửa hàng ở gần nhà ga.",
        pronunciation_focus: ["около + cách 2", "вокзал → вокзала", "вокз- có з"],
        pronunciation_focus_en: ["около takes genitive", "вокзал → вокзала", "вокз- has з"],
      },
      {
        russian: "Я пришёл без документов.",
        romanization: "Ya prishyol bez dokumentov.",
        en: "I came without documents.",
        vi: "Tôi đến mà không có giấy tờ.",
        pronunciation_focus: ["без + cách 2", "документы → документов", "без = không có"],
        pronunciation_focus_en: ["без takes genitive", "документы → документов", "без = without"],
      },
    ],
    vocabulary: [
      { cell_id: "3fc26084-df33-414a-8000-c957d041722c", word: "нет", romanization: "net", en: "there is no", vi: "không có", pos: "particle (+gen)", pronunciation_vi: "nhét", pronunciation_en: "nyet" },
      { cell_id: "67942996-5179-4e1b-885c-407d4644dc02", word: "много", romanization: "mnogo", en: "a lot / many", vi: "nhiều", pos: "quantifier (+gen)", pronunciation_vi: "MNÔ-ga", pronunciation_en: "MNO-ga" },
      { cell_id: "da5f71f9-b6ce-49c2-8b1e-9922af9be60f", word: "около", romanization: "okolo", en: "near / around", vi: "gần", pos: "preposition (+gen)", pronunciation_vi: "Ô-ka-la", pronunciation_en: "O-ka-la" },
      { cell_id: "abbfb236-3d10-4490-83ba-66e7fcb90132", word: "без", romanization: "bez", en: "without", vi: "không có / thiếu", pos: "preposition (+gen)", pronunciation_vi: "bez", pronunciation_en: "byez" },
      { cell_id: "2420278f-85f4-4c4d-9cea-7bb869eaf9ac", word: "брат", romanization: "brat", en: "brother", vi: "anh/em trai", pos: "noun (m)", pronunciation_vi: "brát", pronunciation_en: "braht" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga (dùng cách 2).",
        instruction_en: "Translate into Russian (use genitive).",
        items: [
          { prompt: "Tôi không có thời gian.", answer: "У меня нет времени." },
          { prompt: "Đây là xe của anh trai tôi.", answer: "Это машина моего брата." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền đuôi cách 2.",
        instruction_en: "Fill in the genitive ending.",
        items: [{ prompt: "У нас много _____. (работа)", answer: "работы" }],
      },
    ],
    cultural_notes_vi:
      "Cách 2 xuất hiện rất nhiều ở B1: sau нет, много, мало, без, около, у. Học theo cụm thay vì học rời từng từ.",
    cultural_notes_en:
      "Genitive is everywhere at B1: after нет, много, мало, без, около, у. Learn it in chunks, not as isolated words.",
    tip_advice_vi: "Nhớ công thức: 'У меня нет + cách 2' để nói 'tôi không có…'.",
    tip_advice_en: "Memorize the frame 'У меня нет + genitive' to say 'I don't have…'.",
  },
  {
    id: "russian_b1_core_dative_recipient_age",
    level: "B1",
    category: "case_control",
    title_vi: "B1: Cách 3 (дательный) — người nhận, tuổi, sở thích",
    title_en: "B1: Dative case — recipient, age, liking",
    intro_vi:
      "Cách tặng cách (дательный) chỉ người nhận ('cho ai') và dùng với нравиться, нужно, помогать, và khi nói tuổi.",
    intro_en:
      "The dative marks the recipient ('to whom') and is used with нравиться, нужно, помогать, and to say someone's age.",
    sentences: [
      {
        russian: "Я звоню другу.",
        romanization: "Ya zvonyu drugu.",
        en: "I am calling a friend.",
        vi: "Tôi đang gọi cho bạn.",
        pronunciation_focus: ["звонить + cách 3", "друг → другу", "звон- có з"],
        pronunciation_focus_en: ["звонить takes dative", "друг → другу", "звон- has з"],
      },
      {
        russian: "Мне нравится эта книга.",
        romanization: "Mne nravitsya eta kniga.",
        en: "I like this book.",
        vi: "Tôi thích quyển sách này.",
        pronunciation_focus: ["я → мне", "нравиться có -ться", "chủ thể thích ở cách 3"],
        pronunciation_focus_en: ["я → мне", "нравиться has -ться", "the liker is in dative"],
      },
      {
        russian: "Сколько тебе лет?",
        romanization: "Skolko tebe let?",
        en: "How old are you?",
        vi: "Bạn bao nhiêu tuổi?",
        pronunciation_focus: ["ты → тебе", "лет = năm tuổi", "tuổi dùng cách 3"],
        pronunciation_focus_en: ["ты → тебе", "лет = years (of age)", "age uses dative"],
      },
      {
        russian: "Менеджеру нужно помочь.",
        romanization: "Menedzheru nuzhno pomoch.",
        en: "The manager needs help.",
        vi: "Cần giúp đỡ quản lý.",
        pronunciation_focus: ["менеджер → менеджеру", "нужно + nguyên mẫu", "помочь là hoàn thành"],
        pronunciation_focus_en: ["менеджер → менеджеру", "нужно + infinitive", "помочь is perfective"],
      },
      {
        russian: "Дайте это мне, пожалуйста.",
        romanization: "Dayte eto mne, pozhaluysta.",
        en: "Give this to me, please.",
        vi: "Làm ơn đưa cái này cho tôi.",
        pronunciation_focus: ["дать → дайте (mệnh lệnh)", "я → мне", "пожалуйста đọc lướt"],
        pronunciation_focus_en: ["дать → дайте (imperative)", "я → мне", "пожалуйста is said quickly"],
      },
    ],
    vocabulary: [
      { cell_id: "13a4c0c2-d7eb-429b-8a26-53912cde0151", word: "нравиться", romanization: "nravitsya", en: "to be pleasing / to like", vi: "thích", pos: "verb (+dat subject)", pronunciation_vi: "NRA-vit-sya", pronunciation_en: "NRA-veet-sya" },
      { cell_id: "b3260b64-8fce-4b4c-854f-d9e7c7c1ef00", word: "нужно", romanization: "nuzhno", en: "need to / it is necessary", vi: "cần", pos: "predicative (+dat)", pronunciation_vi: "NÚZH-na", pronunciation_en: "NOOZH-na" },
      { cell_id: "efc19170-bb25-4224-ba78-d18e41a565df", word: "помогать", romanization: "pomogat", en: "to help", vi: "giúp đỡ", pos: "verb (+dat)", pronunciation_vi: "pa-ma-GÁT", pronunciation_en: "pa-ma-GAHT" },
      { cell_id: "500fe092-e2c4-4b05-83b1-92bb020bed49", word: "звонить", romanization: "zvonit", en: "to call", vi: "gọi điện", pos: "verb (+dat)", pronunciation_vi: "zva-NÍT", pronunciation_en: "zva-NEET" },
      { cell_id: "aa7d7883-9dc7-46e4-8782-7486ce95b664", word: "мне", romanization: "mne", en: "to me", vi: "cho tôi / với tôi", pos: "pronoun (dat)", pronunciation_vi: "mnhe", pronunciation_en: "mnye" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga (dùng cách 3).",
        instruction_en: "Translate into Russian (use dative).",
        items: [
          { prompt: "Tôi thích quyển sách này.", answer: "Мне нравится эта книга." },
          { prompt: "Tôi đang gọi cho bạn.", answer: "Я звоню другу." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Đổi đại từ sang cách 3.",
        instruction_en: "Put the pronoun in the dative.",
        items: [{ prompt: "Сколько _____ лет? (ты)", answer: "тебе" }],
      },
    ],
    cultural_notes_vi:
      "Người Nga nói 'мне нравится…' chứ không nói 'я люблю…' cho những cái thích nhẹ nhàng hằng ngày. Chủ thể đứng ở cách 3.",
    cultural_notes_en:
      "Russians say 'мне нравится…' rather than 'я люблю…' for everyday mild liking. The experiencer goes in the dative.",
    tip_advice_vi: "Học cặp 'Мне нужно + nguyên mẫu' để nói 'tôi cần làm gì đó'.",
    tip_advice_en: "Learn 'Мне нужно + infinitive' to say 'I need to do something'.",
  },
  {
    id: "russian_b1_core_instrumental_with_means",
    level: "B1",
    category: "case_control",
    title_vi: "B1: Cách 5 (творительный) — bằng, với, nghề nghiệp",
    title_en: "B1: Instrumental case — by means of, with, profession",
    intro_vi:
      "Cách công cụ (творительный) trả lời 'bằng gì' và 'với ai'. Cũng dùng cho nghề nghiệp với работать và глагол быть.",
    intro_en:
      "The instrumental answers 'by what means' and 'with whom'. It also marks a profession with работать and быть.",
    sentences: [
      {
        russian: "Я пишу ручкой.",
        romanization: "Ya pishu ruchkoy.",
        en: "I write with a pen.",
        vi: "Tôi viết bằng bút.",
        pronunciation_focus: ["ручка → ручкой", "công cụ không cần giới từ", "пишу từ писать"],
        pronunciation_focus_en: ["ручка → ручкой", "tool needs no preposition", "пишу from писать"],
      },
      {
        russian: "Он работает водителем.",
        romanization: "On rabotayet voditelem.",
        en: "He works as a driver.",
        vi: "Anh ấy làm tài xế.",
        pronunciation_focus: ["водитель → водителем", "работать + cách 5", "nghề nghiệp đổi đuôi"],
        pronunciation_focus_en: ["водитель → водителем", "работать + instrumental", "profession changes ending"],
      },
      {
        russian: "Я иду с другом.",
        romanization: "Ya idu s drugom.",
        en: "I am going with a friend.",
        vi: "Tôi đi với một người bạn.",
        pronunciation_focus: ["с + cách 5", "друг → другом", "с = cùng với"],
        pronunciation_focus_en: ["с + instrumental", "друг → другом", "с = together with"],
      },
      {
        russian: "Мы едем поездом.",
        romanization: "My yedem poyezdom.",
        en: "We are going by train.",
        vi: "Chúng tôi đi bằng tàu hỏa.",
        pronunciation_focus: ["поезд → поездом", "phương tiện = cách 5", "едем từ ехать"],
        pronunciation_focus_en: ["поезд → поездом", "means of transport = instrumental", "едем from ехать"],
      },
      {
        russian: "Я доволен результатом.",
        romanization: "Ya dovolen rezultatom.",
        en: "I am satisfied with the result.",
        vi: "Tôi hài lòng với kết quả.",
        pronunciation_focus: ["доволен + cách 5", "результат → результатом", "cảm xúc + cách 5"],
        pronunciation_focus_en: ["доволен + instrumental", "результат → результатом", "feeling + instrumental"],
      },
    ],
    vocabulary: [
      { cell_id: "3be1da5f-b194-4688-bc97-df9d268f375d", word: "с", romanization: "s", en: "with", vi: "với / cùng", pos: "preposition (+ins)", pronunciation_vi: "x (xờ)", pronunciation_en: "s" },
      { cell_id: "62ff7636-179b-4639-b395-108bab3dcec5", word: "работать", romanization: "rabotat", en: "to work", vi: "làm việc", pos: "verb (+ins for job)", pronunciation_vi: "ra-BÔ-tat", pronunciation_en: "ra-BO-taht" },
      { cell_id: "38e08a77-8669-45a3-b030-6499d02707c1", word: "ручка", romanization: "ruchka", en: "pen", vi: "bút", pos: "noun (f)", pronunciation_vi: "RÚCH-ka", pronunciation_en: "ROOCH-ka" },
      { cell_id: "9c64f63a-c4b5-4f07-a1af-943e6b6d8086", word: "поезд", romanization: "poyezd", en: "train", vi: "tàu hỏa", pos: "noun (m)", pronunciation_vi: "PÔ-yezd", pronunciation_en: "PO-yezd" },
      { cell_id: "0306ab15-ec62-40b3-8831-82d799e3698f", word: "доволен", romanization: "dovolen", en: "satisfied / pleased", vi: "hài lòng", pos: "adjective (short)", pronunciation_vi: "da-VÔ-len", pronunciation_en: "da-VO-len" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga (dùng cách 5).",
        instruction_en: "Translate into Russian (use instrumental).",
        items: [
          { prompt: "Anh ấy làm tài xế.", answer: "Он работает водителем." },
          { prompt: "Tôi đi với một người bạn.", answer: "Я иду с другом." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền đuôi cách 5.",
        instruction_en: "Fill in the instrumental ending.",
        items: [{ prompt: "Мы едем _____. (поезд)", answer: "поездом" }],
      },
    ],
    cultural_notes_vi:
      "Khi nói nghề, người Nga dùng 'работать + cách 5': работать врачом, водителем, продавцом. Đừng dùng cách 1 ở đây.",
    cultural_notes_en:
      "To state a job, Russians use 'работать + instrumental': работать врачом, водителем, продавцом. Don't use the nominative here.",
    tip_advice_vi: "Phân biệt с (với, +cách 5) và из (từ, +cách 2) để không lẫn.",
    tip_advice_en: "Separate с (with, +instrumental) from из (from, +genitive) so they don't blur.",
  },
  {
    id: "russian_b1_core_prepositional_location_topic",
    level: "B1",
    category: "case_control",
    title_vi: "B1: Cách 6 (предложный) — vị trí và chủ đề",
    title_en: "B1: Prepositional case — location and topic",
    intro_vi:
      "Cách giới từ (предложный) chỉ vị trí (в/на = ở trong/trên) và chủ đề (о = về). Luôn đi sau giới từ.",
    intro_en:
      "The prepositional marks location (в/на = in/on) and topic (о = about). It never appears without a preposition.",
    sentences: [
      {
        russian: "Я живу в Москве.",
        romanization: "Ya zhivu v Moskve.",
        en: "I live in Moscow.",
        vi: "Tôi sống ở Mát-xcơ-va.",
        pronunciation_focus: ["в + cách 6 (vị trí)", "Москва → Москве", "живу từ жить"],
        pronunciation_focus_en: ["в + prepositional (location)", "Москва → Москве", "живу from жить"],
      },
      {
        russian: "Книга на столе.",
        romanization: "Kniga na stole.",
        en: "The book is on the table.",
        vi: "Quyển sách ở trên bàn.",
        pronunciation_focus: ["на + cách 6", "стол → столе", "на = trên (vị trí)"],
        pronunciation_focus_en: ["на + prepositional", "стол → столе", "на = on (location)"],
      },
      {
        russian: "Мы говорим о работе.",
        romanization: "My govorim o rabote.",
        en: "We are talking about work.",
        vi: "Chúng tôi đang nói về công việc.",
        pronunciation_focus: ["о + cách 6 (chủ đề)", "работа → работе", "говорить о"],
        pronunciation_focus_en: ["о + prepositional (topic)", "работа → работе", "говорить о"],
      },
      {
        russian: "Он думает о будущем.",
        romanization: "On dumayet o budushchem.",
        en: "He is thinking about the future.",
        vi: "Anh ấy đang nghĩ về tương lai.",
        pronunciation_focus: ["думать о + cách 6", "будущее → будущем", "будущ- có щ"],
        pronunciation_focus_en: ["думать о + prepositional", "будущее → будущем", "будущ- has щ"],
      },
      {
        russian: "Вчера я был в магазине.",
        romanization: "Vchera ya byl v magazine.",
        en: "Yesterday I was at the shop.",
        vi: "Hôm qua tôi ở cửa hàng.",
        pronunciation_focus: ["был + в + cách 6", "магазин → магазине", "vị trí, không phải hướng"],
        pronunciation_focus_en: ["был + в + prepositional", "магазин → магазине", "location, not direction"],
      },
    ],
    vocabulary: [
      { cell_id: "ad6c0a03-383e-4385-9b72-9d272a807f7f", word: "в", romanization: "v", en: "in / at (location)", vi: "ở trong", pos: "preposition (+prep)", pronunciation_vi: "v (vờ)", pronunciation_en: "v" },
      { cell_id: "563f3970-656a-4d66-92ae-2546ada01c60", word: "на", romanization: "na", en: "on / at (location)", vi: "ở trên", pos: "preposition (+prep)", pronunciation_vi: "na", pronunciation_en: "nah" },
      { cell_id: "dcb02918-e3af-4e21-b3f0-8c7d2180c7b7", word: "о / об", romanization: "o / ob", en: "about", vi: "về", pos: "preposition (+prep)", pronunciation_vi: "ô / ôb", pronunciation_en: "o / ob" },
      { cell_id: "308cddbf-27c2-44d3-b6e9-9a5796805f73", word: "думать", romanization: "dumat", en: "to think", vi: "nghĩ", pos: "verb (думать о)", pronunciation_vi: "DU-mat", pronunciation_en: "DOO-maht" },
      { cell_id: "5cef6da9-c56b-49c9-829f-22c44a415c1c", word: "жить", romanization: "zhit", en: "to live", vi: "sống", pos: "verb (жить в)", pronunciation_vi: "zhít", pronunciation_en: "zheet" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga (dùng cách 6).",
        instruction_en: "Translate into Russian (use prepositional).",
        items: [
          { prompt: "Tôi sống ở Mát-xcơ-va.", answer: "Я живу в Москве." },
          { prompt: "Chúng tôi đang nói về công việc.", answer: "Мы говорим о работе." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền đuôi cách 6.",
        instruction_en: "Fill in the prepositional ending.",
        items: [{ prompt: "Книга на _____. (стол)", answer: "столе" }],
      },
    ],
    cultural_notes_vi:
      "Phân biệt vị trí và hướng: 'в магазине' (ở cửa hàng, cách 6) khác 'в магазин' (vào cửa hàng, cách 4).",
    cultural_notes_en:
      "Separate location from direction: 'в магазине' (at the shop, prepositional) vs 'в магазин' (into the shop, accusative).",
    tip_advice_vi: "Hỏi 'где?' (ở đâu) → cách 6; hỏi 'куда?' (đi đâu) → cách 4.",
    tip_advice_en: "Ask 'где?' (where, static) → prepositional; ask 'куда?' (where to) → accusative.",
  },
  {
    id: "russian_b1_core_accusative_object_direction",
    level: "B1",
    category: "case_control",
    title_vi: "B1: Cách 4 (винительный) — tân ngữ, hướng đi, danh từ động vật",
    title_en: "B1: Accusative case — object, direction, animate nouns",
    intro_vi:
      "Cách đối cách (винительный) chỉ tân ngữ trực tiếp và hướng đi (в/на + cách 4). Với danh từ chỉ người/động vật giống đực, đuôi giống cách 2.",
    intro_en:
      "The accusative marks the direct object and direction (в/на + accusative). Animate masculine nouns copy the genitive ending.",
    sentences: [
      {
        russian: "Я вижу брата.",
        romanization: "Ya vizhu brata.",
        en: "I see my brother.",
        vi: "Tôi nhìn thấy anh trai.",
        pronunciation_focus: ["danh từ động vật: брат → брата", "вижу từ видеть", "đuôi giống cách 2"],
        pronunciation_focus_en: ["animate: брат → брата", "вижу from видеть", "ending copies genitive"],
      },
      {
        russian: "Мы идём в магазин.",
        romanization: "My idyom v magazin.",
        en: "We are going to the shop.",
        vi: "Chúng tôi đi đến cửa hàng.",
        pronunciation_focus: ["в + cách 4 (hướng)", "магазин giữ nguyên (bất động)", "куда? → cách 4"],
        pronunciation_focus_en: ["в + accusative (direction)", "магазин unchanged (inanimate)", "куда? → accusative"],
      },
      {
        russian: "Я читаю интересную книгу.",
        romanization: "Ya chitayu interesnuyu knigu.",
        en: "I am reading an interesting book.",
        vi: "Tôi đang đọc một quyển sách hay.",
        pronunciation_focus: ["книга → книгу", "интересная → интересную", "tính từ hợp đuôi"],
        pronunciation_focus_en: ["книга → книгу", "интересная → интересную", "adjective agrees"],
      },
      {
        russian: "Она ждёт подругу.",
        romanization: "Ona zhdyot podrugu.",
        en: "She is waiting for a friend.",
        vi: "Cô ấy đang đợi bạn gái.",
        pronunciation_focus: ["ждать + cách 4", "подруга → подругу", "ждёт có ё"],
        pronunciation_focus_en: ["ждать + accusative", "подруга → подругу", "ждёт has ё"],
      },
      {
        russian: "Положи это на стол.",
        romanization: "Polozhi eto na stol.",
        en: "Put this on the table.",
        vi: "Đặt cái này lên bàn.",
        pronunciation_focus: ["на + cách 4 (hướng lên)", "стол giữ nguyên", "положи là mệnh lệnh"],
        pronunciation_focus_en: ["на + accusative (onto)", "стол unchanged", "положи is imperative"],
      },
    ],
    vocabulary: [
      { cell_id: "26328808-552f-4ae1-beab-75177d2d87cb", word: "видеть", romanization: "videt", en: "to see", vi: "nhìn thấy", pos: "verb (+acc)", pronunciation_vi: "VÍ-det", pronunciation_en: "VEE-det" },
      { cell_id: "36b50e64-53f0-4d58-8ff4-bb4bcdff16ce", word: "ждать", romanization: "zhdat", en: "to wait for", vi: "đợi", pos: "verb (+acc)", pronunciation_vi: "zhdát", pronunciation_en: "zhdaht" },
      { cell_id: "19eb0a03-2219-4aa6-8ea8-c304ef7c82ee", word: "магазин", romanization: "magazin", en: "shop", vi: "cửa hàng", pos: "noun (m)", pronunciation_vi: "ma-ga-ZÍN", pronunciation_en: "ma-ga-ZEEN" },
      { cell_id: "37c4eeee-33ef-4c6a-9295-aafa24671e99", word: "книга", romanization: "kniga", en: "book", vi: "quyển sách", pos: "noun (f)", pronunciation_vi: "KNÍ-ga", pronunciation_en: "KNEE-ga" },
      { cell_id: "4ed134df-c8ca-4db7-8c6e-bf9b82cd606c", word: "положить", romanization: "polozhit", en: "to put / lay", vi: "đặt / để", pos: "verb (pf, +acc)", pronunciation_vi: "pa-la-ZHÍT", pronunciation_en: "pa-la-ZHEET" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga (dùng cách 4).",
        instruction_en: "Translate into Russian (use accusative).",
        items: [
          { prompt: "Tôi nhìn thấy anh trai.", answer: "Я вижу брата." },
          { prompt: "Chúng tôi đi đến cửa hàng.", answer: "Мы идём в магазин." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Đổi danh từ động vật sang cách 4.",
        instruction_en: "Put the animate noun in the accusative.",
        items: [{ prompt: "Она ждёт _____. (подруга)", answer: "подругу" }],
      },
    ],
    cultural_notes_vi:
      "Mẹo lớn nhất: danh từ chỉ người/động vật giống đực ở cách 4 trông giống cách 2 (вижу брата, друга), còn đồ vật giữ nguyên (вижу стол).",
    cultural_notes_en:
      "Key trick: animate masculine nouns look like the genitive in the accusative (вижу брата, друга), while inanimate ones stay unchanged (вижу стол).",
    tip_advice_vi: "Cùng giới từ в/на: cách 4 = hướng đi (куда), cách 6 = vị trí (где).",
    tip_advice_en: "Same в/на prepositions: accusative = direction (куда), prepositional = location (где).",
  },
  {
    id: "russian_b1_core_aspect_process_result",
    level: "B1",
    category: "case_control",
    title_vi: "B1: Thể động từ — quá trình (chưa hoàn thành) vs kết quả (hoàn thành)",
    title_en: "B1: Verbal aspect — process (imperfective) vs result (perfective)",
    intro_vi:
      "Thể tiếng Nga không giống 'đã' của tiếng Việt. Hỏi: 'đang trong quá trình / lặp lại?' → chưa hoàn thành; 'xong, có kết quả?' → hoàn thành.",
    intro_en:
      "Russian aspect is not Vietnamese 'đã'. Ask: 'in process / repeated?' → imperfective; 'finished, with a result?' → perfective.",
    sentences: [
      {
        russian: "Я обычно проверяю документы.",
        romanization: "Ya obychno proveryayu dokumenty.",
        en: "I usually check the documents.",
        vi: "Tôi thường kiểm tra giấy tờ.",
        pronunciation_focus: ["обычно → thói quen → chưa hoàn thành", "проверять (НСВ)", "lặp lại"],
        pronunciation_focus_en: ["обычно → habit → imperfective", "проверять (impf)", "repeated"],
      },
      {
        russian: "Я проверил документы и поехал.",
        romanization: "Ya proveril dokumenty i poyekhal.",
        en: "I checked the documents and set off.",
        vi: "Tôi kiểm tra xong giấy tờ rồi đi.",
        pronunciation_focus: ["проверить (СВ) → kết quả", "xong rồi mới đi", "một hành động trọn vẹn"],
        pronunciation_focus_en: ["проверить (pf) → result", "finished, then left", "one whole action"],
      },
      {
        russian: "Она читала книгу весь вечер.",
        romanization: "Ona chitala knigu ves vecher.",
        en: "She was reading a book all evening.",
        vi: "Cô ấy đọc sách cả buổi tối.",
        pronunciation_focus: ["весь вечер → quá trình kéo dài", "читать (НСВ)", "không nói xong hay chưa"],
        pronunciation_focus_en: ["весь вечер → ongoing process", "читать (impf)", "no claim it finished"],
      },
      {
        russian: "Она прочитала книгу за два дня.",
        romanization: "Ona prochitala knigu za dva dnya.",
        en: "She read the book in two days.",
        vi: "Cô ấy đọc xong sách trong hai ngày.",
        pronunciation_focus: ["прочитать (СВ) → đọc xong", "за два дня → kết quả trong khoảng", "tiền tố про-"],
        pronunciation_focus_en: ["прочитать (pf) → finished it", "за два дня → result within a span", "prefix про-"],
      },
      {
        russian: "Что ты делаешь? — Я пишу отчёт.",
        romanization: "Chto ty delayesh? — Ya pishu otchyot.",
        en: "What are you doing? — I'm writing a report.",
        vi: "Bạn đang làm gì? — Tôi đang viết báo cáo.",
        pronunciation_focus: ["делать/писать (НСВ) → đang làm", "что đọc 'chto'", "quá trình hiện tại"],
        pronunciation_focus_en: ["делать/писать (impf) → in progress", "что said 'shto'", "current process"],
      },
    ],
    vocabulary: [
      { cell_id: "f62f6ec0-5218-4e3a-b586-ed7119f802eb", word: "проверять / проверить", romanization: "proveryat / proverit", en: "to check (impf/pf)", vi: "kiểm tra", pos: "verb pair", pronunciation_vi: "pra-ve-RIÁT / pra-VÉ-rit", pronunciation_en: "pra-ve-RYAT / pra-VE-rit" },
      { cell_id: "605c973c-8328-4679-a003-73e94fb5a6d6", word: "читать / прочитать", romanization: "chitat / prochitat", en: "to read (impf/pf)", vi: "đọc", pos: "verb pair", pronunciation_vi: "chi-TÁT / pra-chi-TÁT", pronunciation_en: "chi-TAHT / pra-chi-TAHT" },
      { cell_id: "23dad0d9-2c94-4170-a56e-d139f68cc401", word: "писать / написать", romanization: "pisat / napisat", en: "to write (impf/pf)", vi: "viết", pos: "verb pair", pronunciation_vi: "pi-SÁT / na-pi-SÁT", pronunciation_en: "pee-SAHT / na-pee-SAHT" },
      { cell_id: "76cac10b-64c9-4cf0-a078-0c95c9f8afb6", word: "обычно", romanization: "obychno", en: "usually", vi: "thường", pos: "adverb", pronunciation_vi: "a-BÝCH-na", pronunciation_en: "a-BICH-na" },
      { cell_id: "d24bce20-1835-4fde-8167-2d1d3eb3b46a", word: "отчёт", romanization: "otchyot", en: "report", vi: "báo cáo", pos: "noun (m)", pronunciation_vi: "at-CHIÓT", pronunciation_en: "at-CHYOT" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn thể đúng (chưa hoàn thành / hoàn thành).",
        instruction_en: "Choose the correct aspect (impf / pf).",
        items: [
          { prompt: "Я обычно _____ документы. (проверять/проверить)", answer: "проверяю", options: ["проверяю", "проверю"] },
          { prompt: "Я _____ документы и поехал. (проверять/проверить)", answer: "проверил", options: ["проверял", "проверил"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch, chú ý thể.",
        instruction_en: "Translate, watching aspect.",
        items: [{ prompt: "Cô ấy đọc xong sách trong hai ngày.", answer: "Она прочитала книгу за два дня." }],
      },
    ],
    cultural_notes_vi:
      "Câu chỉ quá trình thường đi với 'весь день, обычно, долго'; câu chỉ kết quả đi với 'уже, за час, наконец'. Những từ này là tín hiệu chọn thể.",
    cultural_notes_en:
      "Process clauses pair with 'весь день, обычно, долго'; result clauses pair with 'уже, за час, наконец'. These markers signal the aspect.",
    tip_advice_vi: "Trước khi nói, tự hỏi 'xong chưa, có kết quả không?'. Có → hoàn thành; chưa rõ → chưa hoàn thành.",
    tip_advice_en: "Before speaking, ask 'finished, any result?'. Yes → perfective; unclear → imperfective.",
  },
  {
    id: "russian_b1_core_aspect_future_planning",
    level: "B1",
    category: "case_control",
    title_vi: "B1: Thể ở tương lai — kế hoạch, thói quen, việc hoàn thành",
    title_en: "B1: Aspect in the future — plans, habits, completed actions",
    intro_vi:
      "Tương lai chưa hoàn thành dùng 'буду + nguyên mẫu' (quá trình/thói quen). Tương lai hoàn thành dùng dạng chia trực tiếp của động từ СВ (một việc xong).",
    intro_en:
      "Imperfective future uses 'буду + infinitive' (process/habit). Perfective future is the conjugated perfective verb itself (one completed action).",
    sentences: [
      {
        russian: "Завтра я буду работать весь день.",
        romanization: "Zavtra ya budu rabotat ves den.",
        en: "Tomorrow I will be working all day.",
        vi: "Ngày mai tôi sẽ làm việc cả ngày.",
        pronunciation_focus: ["буду + работать (НСВ)", "весь день → quá trình", "tương lai kéo dài"],
        pronunciation_focus_en: ["буду + работать (impf)", "весь день → process", "ongoing future"],
      },
      {
        russian: "Я сделаю это завтра.",
        romanization: "Ya sdelayu eto zavtra.",
        en: "I will do this tomorrow.",
        vi: "Tôi sẽ làm xong việc này ngày mai.",
        pronunciation_focus: ["сделаю (СВ) → tương lai hoàn thành", "không cần буду", "kết quả một lần"],
        pronunciation_focus_en: ["сделаю (pf) → perfective future", "no буду needed", "one-off result"],
      },
      {
        russian: "Я буду учить русский каждый день.",
        romanization: "Ya budu uchit russkiy kazhdyy den.",
        en: "I will study Russian every day.",
        vi: "Tôi sẽ học tiếng Nga mỗi ngày.",
        pronunciation_focus: ["каждый день → thói quen → НСВ", "буду + учить", "lặp lại"],
        pronunciation_focus_en: ["каждый день → habit → impf", "буду + учить", "repeated"],
      },
      {
        russian: "Когда я закончу, я позвоню.",
        romanization: "Kogda ya zakonchu, ya pozvonyu.",
        en: "When I finish, I'll call.",
        vi: "Khi nào tôi làm xong, tôi sẽ gọi.",
        pronunciation_focus: ["закончу + позвоню (СВ)", "xong việc 1 rồi việc 2", "chuỗi hành động hoàn thành"],
        pronunciation_focus_en: ["закончу + позвоню (pf)", "finish one, then the next", "sequence of completed acts"],
      },
      {
        russian: "Я долго искал ключи и наконец нашёл.",
        romanization: "Ya dolgo iskal klyuchi i nakonets nashyol.",
        en: "I looked for the keys for a long time and finally found them.",
        vi: "Tôi tìm chìa khóa rất lâu và cuối cùng đã thấy.",
        pronunciation_focus: ["искал (НСВ, quá trình) → нашёл (СВ, kết quả)", "долго vs наконец", "cặp tìm/thấy"],
        pronunciation_focus_en: ["искал (impf process) → нашёл (pf result)", "долго vs наконец", "look/find pair"],
      },
    ],
    vocabulary: [
      { cell_id: "ee177712-e6fe-4a74-b780-f461cd5e486b", word: "буду", romanization: "budu", en: "I will (impf future helper)", vi: "tôi sẽ (trợ động từ)", pos: "auxiliary", pronunciation_vi: "BÚ-du", pronunciation_en: "BOO-doo" },
      { cell_id: "09a6439a-d799-4253-abfa-27c13ea25848", word: "сделать", romanization: "sdelat", en: "to do / get done (pf)", vi: "làm xong", pos: "verb (pf)", pronunciation_vi: "ZDÉ-lat", pronunciation_en: "ZDYE-laht" },
      { cell_id: "66932e85-ec1f-4150-a4c2-2ab2979f42d5", word: "закончить", romanization: "zakonchit", en: "to finish (pf)", vi: "kết thúc / xong", pos: "verb (pf)", pronunciation_vi: "za-KÔN-chit", pronunciation_en: "za-KON-chit" },
      { cell_id: "532eedb7-8e8e-443c-bf8f-e60a15a794c7", word: "искать / найти", romanization: "iskat / nayti", en: "to look for / to find (impf/pf)", vi: "tìm / thấy", pos: "verb pair", pronunciation_vi: "is-KÁT / nai-TÍ", pronunciation_en: "is-KAHT / nai-TEE" },
      { cell_id: "798b2630-901a-4a17-868f-d35841210fa1", word: "каждый день", romanization: "kazhdyy den", en: "every day", vi: "mỗi ngày", pos: "phrase", pronunciation_vi: "KÁZH-dyi den", pronunciation_en: "KAZH-diy den" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn tương lai đúng.",
        instruction_en: "Choose the correct future.",
        items: [
          { prompt: "Я _____ русский каждый день. (учить, НСВ)", answer: "буду учить", options: ["буду учить", "выучу"] },
          { prompt: "Я _____ это завтра. (сделать, СВ)", answer: "сделаю", options: ["буду делать", "сделаю"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [{ prompt: "Khi nào tôi làm xong, tôi sẽ gọi.", answer: "Когда я закончу, я позвоню." }],
      },
    ],
    cultural_notes_vi:
      "Sai phổ biến của người Việt: nói 'буду сделать'. Không có chuyện đó — буду chỉ ghép với động từ chưa hoàn thành.",
    cultural_notes_en:
      "Common Vietnamese mistake: saying 'буду сделать'. That never happens — буду only combines with imperfective verbs.",
    tip_advice_vi: "Mệnh đề 'когда/если' về tương lai dùng động từ hoàn thành: 'когда закончу', không phải 'когда буду заканчивать'.",
    tip_advice_en: "Future 'когда/если' clauses use the perfective: 'когда закончу', not 'когда буду заканчивать'.",
  },
  {
    id: "russian_b1_core_motion_go_walk_ride",
    level: "B1",
    category: "case_control",
    title_vi: "B1: Động từ chuyển động — идти/ходить, ехать/ездить",
    title_en: "B1: Motion verbs — идти/ходить (foot), ехать/ездить (vehicle)",
    intro_vi:
      "Một chiều/đang đi cụ thể → идти (bộ), ехать (xe). Thói quen/đi rồi về/nhiều lần → ходить (bộ), ездить (xe).",
    intro_en:
      "One-way/right-now → идти (on foot), ехать (by vehicle). Habit/round trip/repeated → ходить (on foot), ездить (by vehicle).",
    sentences: [
      {
        russian: "Сейчас я иду на работу.",
        romanization: "Seychas ya idu na rabotu.",
        en: "Right now I'm walking to work.",
        vi: "Bây giờ tôi đang đi bộ đến chỗ làm.",
        pronunciation_focus: ["идти → một chiều, lúc này", "сейчас = tín hiệu", "đi bộ"],
        pronunciation_focus_en: ["идти → one-way, right now", "сейчас signals it", "on foot"],
      },
      {
        russian: "Я хожу в спортзал каждый день.",
        romanization: "Ya khozhu v sportzal kazhdyy den.",
        en: "I go to the gym every day.",
        vi: "Tôi đi tập gym mỗi ngày.",
        pronunciation_focus: ["ходить → thói quen", "каждый день = lặp lại", "đi rồi về"],
        pronunciation_focus_en: ["ходить → habit", "каждый день = repeated", "round trip"],
      },
      {
        russian: "Завтра мы едем в Москву.",
        romanization: "Zavtra my yedem v Moskvu.",
        en: "Tomorrow we are going to Moscow.",
        vi: "Ngày mai chúng tôi đi Mát-xcơ-va.",
        pronunciation_focus: ["ехать → một chuyến cụ thể bằng xe", "в Москву = cách 4 (hướng)", "có kế hoạch"],
        pronunciation_focus_en: ["ехать → one specific trip by vehicle", "в Москву = accusative (direction)", "planned"],
      },
      {
        russian: "Я часто езжу к родителям.",
        romanization: "Ya chasto yezzhu k roditelyam.",
        en: "I often go to my parents'.",
        vi: "Tôi hay về thăm bố mẹ.",
        pronunciation_focus: ["ездить → nhiều lần bằng xe", "часто = tín hiệu", "к + cách 3 (đến chỗ ai)"],
        pronunciation_focus_en: ["ездить → repeated by vehicle", "часто signals it", "к + dative (to someone's place)"],
      },
      {
        russian: "Куда ты идёшь?",
        romanization: "Kuda ty idyosh?",
        en: "Where are you going?",
        vi: "Bạn đang đi đâu đấy?",
        pronunciation_focus: ["куда = đi đâu", "идёшь → đang đi một chiều", "ё trong идёшь"],
        pronunciation_focus_en: ["куда = where to", "идёшь → going one-way now", "ё in идёшь"],
      },
    ],
    vocabulary: [
      { cell_id: "6c5c94d9-4849-4e86-898a-3557f400c43b", word: "идти", romanization: "idti", en: "to go on foot (one-way/now)", vi: "đi bộ (một chiều)", pos: "verb (unidirectional)", pronunciation_vi: "it-TÍ", pronunciation_en: "it-TEE" },
      { cell_id: "c95e361f-1262-47c0-8015-8734e7fdaea5", word: "ходить", romanization: "khodit", en: "to go on foot (habit/round trip)", vi: "đi bộ (thói quen)", pos: "verb (multidirectional)", pronunciation_vi: "kha-DÍT", pronunciation_en: "kha-DEET" },
      { cell_id: "045dbbc4-ac66-4950-ae29-ca15d590d043", word: "ехать", romanization: "yekhat", en: "to go by vehicle (one-way/now)", vi: "đi xe (một chiều)", pos: "verb (unidirectional)", pronunciation_vi: "YÉ-khat", pronunciation_en: "YE-khat" },
      { cell_id: "e8491e89-99d9-443c-93bc-dcdfd027e714", word: "ездить", romanization: "yezdit", en: "to go by vehicle (habit/round trip)", vi: "đi xe (thói quen)", pos: "verb (multidirectional)", pronunciation_vi: "YÉZ-dit", pronunciation_en: "YEZ-dit" },
      { cell_id: "37075d94-30f5-4cf3-8e6f-cc9e8d6d5fbe", word: "куда", romanization: "kuda", en: "where to", vi: "đi đâu", pos: "adverb", pronunciation_vi: "ku-DÁ", pronunciation_en: "koo-DAH" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn động từ chuyển động đúng.",
        instruction_en: "Choose the correct motion verb.",
        items: [
          { prompt: "Каждый день я _____ в спортзал.", answer: "хожу", options: ["иду", "хожу"] },
          { prompt: "Сейчас я _____ на работу.", answer: "иду", options: ["иду", "хожу"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [{ prompt: "Tôi hay về thăm bố mẹ.", answer: "Я часто езжу к родителям." }],
      },
    ],
    cultural_notes_vi:
      "Tiếng Việt chỉ có một từ 'đi'. Tiếng Nga buộc bạn chọn: đi bộ hay đi xe, một chiều hay lặp lại. Nghĩ kỹ trước khi nói.",
    cultural_notes_en:
      "Vietnamese has one word 'đi'. Russian forces a choice: on foot or by vehicle, one-way or repeated. Decide before you speak.",
    tip_advice_vi: "Tín hiệu nhanh: сейчас/туда → идти/ехать; обычно/часто/каждый день → ходить/ездить.",
    tip_advice_en: "Quick cues: сейчас/туда → идти/ехать; обычно/часто/каждый день → ходить/ездить.",
  },
  {
    id: "russian_b1_core_motion_prefixes",
    level: "B1",
    category: "case_control",
    title_vi: "B1: Tiền tố chuyển động — при-, у-, в-, вы-, за-",
    title_en: "B1: Motion prefixes — при-, у-, в-, вы-, за-",
    intro_vi:
      "Tiền tố thêm hướng vào động từ chuyển động: при- (đến), у- (rời đi), в-/во- (vào), вы- (ra), за- (ghé qua). Khi có tiền tố, động từ thường thành thể hoàn thành.",
    intro_en:
      "Prefixes add direction to motion verbs: при- (arrive), у- (leave), в-/во- (enter), вы- (exit), за- (drop by). With a prefix, the verb is usually perfective.",
    sentences: [
      {
        russian: "Я пришёл домой в семь часов.",
        romanization: "Ya prishyol domoy v sem chasov.",
        en: "I arrived home at seven o'clock.",
        vi: "Tôi về đến nhà lúc bảy giờ.",
        pronunciation_focus: ["при- = đến nơi", "пришёл (СВ, quá khứ giống đực)", "домой = về nhà"],
        pronunciation_focus_en: ["при- = arrival", "пришёл (pf, masc past)", "домой = homeward"],
      },
      {
        russian: "Он ушёл рано утром.",
        romanization: "On ushyol rano utrom.",
        en: "He left early in the morning.",
        vi: "Anh ấy rời đi sớm vào buổi sáng.",
        pronunciation_focus: ["у- = rời đi", "ушёл (СВ)", "утром = cách 5 chỉ thời gian"],
        pronunciation_focus_en: ["у- = departure", "ушёл (pf)", "утром = instrumental of time"],
      },
      {
        russian: "Войдите, пожалуйста.",
        romanization: "Voydite, pozhaluysta.",
        en: "Come in, please.",
        vi: "Mời vào.",
        pronunciation_focus: ["в-/во- = vào trong", "войти → войдите (mệnh lệnh)", "lịch sự"],
        pronunciation_focus_en: ["в-/во- = entering", "войти → войдите (imperative)", "polite"],
      },
      {
        russian: "Автобус уже уехал.",
        romanization: "Avtobus uzhe uyekhal.",
        en: "The bus has already left.",
        vi: "Xe buýt đã đi rồi.",
        pronunciation_focus: ["у- + ехать = rời đi bằng xe", "уехал (СВ)", "уже = đã"],
        pronunciation_focus_en: ["у- + ехать = depart by vehicle", "уехал (pf)", "уже = already"],
      },
      {
        russian: "Я зайду к тебе вечером.",
        romanization: "Ya zaydu k tebe vecherom.",
        en: "I'll drop by your place in the evening.",
        vi: "Tối tôi sẽ ghé qua chỗ bạn.",
        pronunciation_focus: ["за- = ghé qua một chút", "зайду (СВ, tương lai)", "к тебе = cách 3"],
        pronunciation_focus_en: ["за- = drop by briefly", "зайду (pf, future)", "к тебе = dative"],
      },
    ],
    vocabulary: [
      { cell_id: "fb01e214-f629-4836-b269-4ccbd852e6e7", word: "прийти", romanization: "priyti", en: "to arrive (on foot)", vi: "đến (đi bộ)", pos: "verb (pf)", pronunciation_vi: "prii-TÍ", pronunciation_en: "pree-TEE" },
      { cell_id: "5cef6fba-0cf0-43a6-987f-d7dcb19e8ae3", word: "уйти", romanization: "uyti", en: "to leave (on foot)", vi: "rời đi (đi bộ)", pos: "verb (pf)", pronunciation_vi: "ui-TÍ", pronunciation_en: "oo-TEE" },
      { cell_id: "bfd37b9e-ad50-4265-8752-e5b2bcfb60cd", word: "войти", romanization: "voyti", en: "to enter", vi: "đi vào", pos: "verb (pf)", pronunciation_vi: "vai-TÍ", pronunciation_en: "vai-TEE" },
      { cell_id: "e630c19b-f7f4-48ac-8f6c-36d84868a4d7", word: "уехать", romanization: "uyekhat", en: "to leave (by vehicle)", vi: "rời đi (bằng xe)", pos: "verb (pf)", pronunciation_vi: "u-YÉ-khat", pronunciation_en: "oo-YE-khat" },
      { cell_id: "c65dd75b-450c-4396-b358-acc64b82f5c1", word: "зайти", romanization: "zayti", en: "to drop by", vi: "ghé qua", pos: "verb (pf)", pronunciation_vi: "zai-TÍ", pronunciation_en: "zai-TEE" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Ghép tiền tố với nghĩa.",
        instruction_en: "Match the prefix to its meaning.",
        items: [
          { prompt: "при-", answer: "đến nơi / arrive" },
          { prompt: "у-", answer: "rời đi / leave" },
          { prompt: "в-/во-", answer: "đi vào / enter" },
          { prompt: "за-", answer: "ghé qua / drop by" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Tôi về đến nhà lúc bảy giờ.", answer: "Я пришёл домой в семь часов." },
          { prompt: "Tối tôi sẽ ghé qua chỗ bạn.", answer: "Я зайду к тебе вечером." },
        ],
      },
    ],
    cultural_notes_vi:
      "Cùng một gốc đi, đổi tiền tố là đổi cả câu chuyện: пришёл (đã đến) ≠ ушёл (đã đi) ≠ зашёл (ghé qua). Học tiền tố là chìa khóa nghe hiểu B1.",
    cultural_notes_en:
      "Same root, new prefix, new story: пришёл (arrived) ≠ ушёл (left) ≠ зашёл (dropped by). Prefixes are the key to B1 listening.",
    tip_advice_vi: "Học theo cặp đối lập: при- (đến) ↔ у- (đi), в- (vào) ↔ вы- (ra). Dễ nhớ hơn.",
    tip_advice_en: "Learn opposite pairs: при- (arrive) ↔ у- (leave), в- (enter) ↔ вы- (exit). Easier to retain.",
  },
  {
    id: "russian_b1_core_relative_clauses_kotoryy",
    level: "B1",
    category: "connected_speech",
    title_vi: "B1: Mệnh đề quan hệ với который",
    title_en: "B1: Relative clauses with который",
    intro_vi:
      "который ('mà / người mà') nối hai câu thành một. Nó đổi theo giống/số của danh từ đứng trước, nhưng đổi theo cách của vai trò trong mệnh đề phụ.",
    intro_en:
      "который ('which/who/that') links two clauses. It agrees in gender/number with the noun before it, but takes the case of its role inside the clause.",
    sentences: [
      {
        russian: "Это человек, который мне помог.",
        romanization: "Eto chelovek, kotoryy mne pomog.",
        en: "This is the person who helped me.",
        vi: "Đây là người đã giúp tôi.",
        pronunciation_focus: ["который = chủ ngữ → cách 1", "giống đực số ít", "dấu phẩy trước который"],
        pronunciation_focus_en: ["который = subject → nominative", "masculine singular", "comma before который"],
      },
      {
        russian: "Книга, которую я читаю, очень интересная.",
        romanization: "Kniga, kotoruyu ya chitayu, ochen interesnaya.",
        en: "The book I am reading is very interesting.",
        vi: "Quyển sách tôi đang đọc rất hay.",
        pronunciation_focus: ["которую = tân ngữ → cách 4", "giống cái (книга)", "hai dấu phẩy bao mệnh đề"],
        pronunciation_focus_en: ["которую = object → accusative", "feminine (книга)", "clause inside commas"],
      },
      {
        russian: "Город, в котором я живу, большой.",
        romanization: "Gorod, v kotorom ya zhivu, bolshoy.",
        en: "The city I live in is big.",
        vi: "Thành phố tôi đang sống thì lớn.",
        pronunciation_focus: ["в котором = cách 6 (vị trí)", "giống đực (город)", "giới từ đứng trước который"],
        pronunciation_focus_en: ["в котором = prepositional (location)", "masculine (город)", "preposition before который"],
      },
      {
        russian: "Друг, с которым я работаю, очень добрый.",
        romanization: "Drug, s kotorym ya rabotayu, ochen dobryy.",
        en: "The friend I work with is very kind.",
        vi: "Người bạn tôi làm cùng rất tốt bụng.",
        pronunciation_focus: ["с которым = cách 5", "с = với", "giống đực (друг)"],
        pronunciation_focus_en: ["с которым = instrumental", "с = with", "masculine (друг)"],
      },
      {
        russian: "Я знаю место, где можно вкусно поесть.",
        romanization: "Ya znayu mesto, gde mozhno vkusno poyest.",
        en: "I know a place where you can eat well.",
        vi: "Tôi biết một chỗ ăn ngon.",
        pronunciation_focus: ["где thay cho 'в котором' khi chỉ nơi chốn", "можно + nguyên mẫu", "поесть (СВ)"],
        pronunciation_focus_en: ["где replaces 'в котором' for places", "можно + infinitive", "поесть (pf)"],
      },
    ],
    vocabulary: [
      { cell_id: "263ae4d3-6585-4475-9c68-c95a73acac21", word: "который", romanization: "kotoryy", en: "which / who / that", vi: "mà / người mà", pos: "relative pronoun", pronunciation_vi: "ka-TÔ-ryi", pronunciation_en: "ka-TO-riy" },
      { cell_id: "df4fb321-78e9-4b50-91ff-4a9804c66ffd", word: "которую", romanization: "kotoruyu", en: "which (fem. accusative)", vi: "mà (cái 4, giống cái)", pos: "relative pronoun", pronunciation_vi: "ka-TÔ-ru-yu", pronunciation_en: "ka-TO-roo-yoo" },
      { cell_id: "029df2e6-e28b-4496-8b0a-63233e4e28ca", word: "где", romanization: "gde", en: "where", vi: "nơi mà", pos: "relative adverb", pronunciation_vi: "gđê", pronunciation_en: "gdye" },
      { cell_id: "dbe193a2-094a-4815-b409-a2a234cb6b2c", word: "человек", romanization: "chelovek", en: "person", vi: "người", pos: "noun (m)", pronunciation_vi: "che-la-VÉK", pronunciation_en: "che-la-VYEK" },
      { cell_id: "87d513c1-74ee-49c6-ac48-aed649024a4f", word: "место", romanization: "mesto", en: "place", vi: "chỗ / nơi", pos: "noun (n)", pronunciation_vi: "MIÉS-ta", pronunciation_en: "MYES-ta" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền dạng đúng của который.",
        instruction_en: "Fill in the correct form of который.",
        items: [
          { prompt: "Книга, _____ я читаю, интересная.", answer: "которую" },
          { prompt: "Город, в _____ я живу, большой.", answer: "котором" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Nối thành một câu với который.",
        instruction_en: "Join into one sentence with который.",
        items: [{ prompt: "Đây là người đã giúp tôi.", answer: "Это человек, который мне помог." }],
      },
    ],
    cultural_notes_vi:
      "Mệnh đề quan hệ là dấu hiệu rõ nhất của trình độ B1: câu dài hơn, ý liền mạch hơn. Luôn nhớ dấu phẩy trước который.",
    cultural_notes_en:
      "Relative clauses are the clearest sign of B1: longer, more connected sentences. Always put a comma before который.",
    tip_advice_vi: "Quy tắc 2 bước: (1) giống/số lấy từ danh từ trước; (2) cách lấy từ vai trò trong mệnh đề phụ.",
    tip_advice_en: "Two-step rule: (1) gender/number from the preceding noun; (2) case from its role in the clause.",
  },
  {
    id: "russian_b1_core_conjunctions_condition_purpose",
    level: "B1",
    category: "connected_speech",
    title_vi: "B1: Nối câu — если, когда, чтобы, хотя",
    title_en: "B1: Linking clauses — если, когда, чтобы, хотя",
    intro_vi:
      "Để nói trôi chảy ở B1 cần liên từ: если (nếu), когда (khi), чтобы (để), хотя (mặc dù). Lưu ý: sau чтобы dùng nguyên mẫu hoặc quá khứ.",
    intro_en:
      "Fluent B1 needs linkers: если (if), когда (when), чтобы (in order to), хотя (although). Note: after чтобы use the infinitive or past form.",
    sentences: [
      {
        russian: "Если будет время, я приду.",
        romanization: "Yesli budet vremya, ya pridu.",
        en: "If there is time, I will come.",
        vi: "Nếu có thời gian, tôi sẽ đến.",
        pronunciation_focus: ["если = nếu", "будет время → tương lai", "приду (СВ)"],
        pronunciation_focus_en: ["если = if", "будет время → future", "приду (pf)"],
      },
      {
        russian: "Когда я приеду, я тебе позвоню.",
        romanization: "Kogda ya priyedu, ya tebe pozvonyu.",
        en: "When I arrive, I'll call you.",
        vi: "Khi tôi đến, tôi sẽ gọi cho bạn.",
        pronunciation_focus: ["когда + СВ cho việc tương lai", "приеду + позвоню", "тебе = cách 3"],
        pronunciation_focus_en: ["когда + pf for future events", "приеду + позвоню", "тебе = dative"],
      },
      {
        russian: "Я учу русский, чтобы найти работу.",
        romanization: "Ya uchu russkiy, chtoby nayti rabotu.",
        en: "I study Russian in order to find a job.",
        vi: "Tôi học tiếng Nga để tìm việc làm.",
        pronunciation_focus: ["чтобы + nguyên mẫu (cùng chủ ngữ)", "найти (СВ)", "mục đích"],
        pronunciation_focus_en: ["чтобы + infinitive (same subject)", "найти (pf)", "purpose"],
      },
      {
        russian: "Хотя было трудно, я не сдался.",
        romanization: "Khotya bylo trudno, ya ne sdalsya.",
        en: "Although it was hard, I didn't give up.",
        vi: "Mặc dù khó, tôi đã không bỏ cuộc.",
        pronunciation_focus: ["хотя = mặc dù", "было трудно = vô nhân xưng", "сдаться có -ться"],
        pronunciation_focus_en: ["хотя = although", "было трудно = impersonal", "сдаться has -ться"],
      },
      {
        russian: "Скажи мне, когда будешь готов.",
        romanization: "Skazhi mne, kogda budesh gotov.",
        en: "Tell me when you're ready.",
        vi: "Hãy báo tôi khi bạn sẵn sàng.",
        pronunciation_focus: ["скажи = mệnh lệnh (СВ)", "будешь готов = tương lai", "готов = sẵn sàng"],
        pronunciation_focus_en: ["скажи = imperative (pf)", "будешь готов = future", "готов = ready"],
      },
    ],
    vocabulary: [
      { cell_id: "42ed3af2-7208-40e6-b76d-27f44cda6d8f", word: "если", romanization: "yesli", en: "if", vi: "nếu", pos: "conjunction", pronunciation_vi: "YÉS-li", pronunciation_en: "YES-lee" },
      { cell_id: "658d9fb8-7e3f-4065-a7af-3227e1f195ae", word: "когда", romanization: "kogda", en: "when", vi: "khi", pos: "conjunction", pronunciation_vi: "kag-DÁ", pronunciation_en: "kag-DAH" },
      { cell_id: "0c84d152-8d46-4091-be1f-63c5c6991a43", word: "чтобы", romanization: "chtoby", en: "in order to / so that", vi: "để", pos: "conjunction", pronunciation_vi: "SHTÔ-by", pronunciation_en: "SHTO-by" },
      { cell_id: "44774ef3-1e4b-4fc1-a64a-0ad13101e4cd", word: "хотя", romanization: "khotya", en: "although", vi: "mặc dù", pos: "conjunction", pronunciation_vi: "kha-TIÁ", pronunciation_en: "kha-TYA" },
      { cell_id: "b26a9d97-4a73-4aed-8cac-96ab647fe7d6", word: "готов", romanization: "gotov", en: "ready", vi: "sẵn sàng", pos: "adjective (short)", pronunciation_vi: "ga-TÔV", pronunciation_en: "ga-TOV" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn liên từ phù hợp.",
        instruction_en: "Choose the right conjunction.",
        items: [
          { prompt: "Я учу русский, _____ найти работу.", answer: "чтобы", options: ["чтобы", "потому что"] },
          { prompt: "_____ будет время, я приду.", answer: "Если", options: ["Если", "Хотя"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [{ prompt: "Khi tôi đến, tôi sẽ gọi cho bạn.", answer: "Когда я приеду, я тебе позвоню." }],
      },
    ],
    cultural_notes_vi:
      "Khác tiếng Việt: mệnh đề если/когда nói về tương lai phải dùng động từ tương lai/hoàn thành ('если будет', 'когда приеду'), không dùng hiện tại.",
    cultural_notes_en:
      "Unlike Vietnamese: future если/когда clauses use a future/perfective verb ('если будет', 'когда приеду'), never the present.",
    tip_advice_vi: "Phân biệt чтобы (mục đích, để) với потому что (lý do, vì) — người Việt hay dùng lẫn.",
    tip_advice_en: "Separate чтобы (purpose, 'to') from потому что (reason, 'because') — they're easy to confuse.",
  },
  {
    id: "russian_b1_core_practical_problem_solving",
    level: "B1",
    category: "practical_tasks",
    title_vi: "B1: Tình huống thực tế — giải quyết vấn đề lịch sự",
    title_en: "B1: Practical situation — solving a problem politely",
    intro_vi:
      "Ở B1 bạn cần xử lý trục trặc: báo vấn đề, hỏi cho rõ, đề nghị giải pháp, và cảm ơn. Đây là các khung câu dùng được ngay.",
    intro_en:
      "At B1 you must handle hiccups: report a problem, ask for clarity, propose a fix, and thank. These are ready-to-use frames.",
    sentences: [
      {
        russian: "Извините, у меня проблема с заказом.",
        romanization: "Izvinite, u menya problema s zakazom.",
        en: "Excuse me, I have a problem with my order.",
        vi: "Xin lỗi, tôi có vấn đề với đơn hàng.",
        pronunciation_focus: ["проблема с + cách 5", "заказ → заказом", "извините = lịch sự"],
        pronunciation_focus_en: ["проблема с + instrumental", "заказ → заказом", "извините = polite opener"],
      },
      {
        russian: "Можете объяснить, что случилось?",
        romanization: "Mozhete obyasnit, chto sluchilos?",
        en: "Can you explain what happened?",
        vi: "Anh/chị giải thích giúp chuyện gì đã xảy ra được không?",
        pronunciation_focus: ["можете + nguyên mẫu = đề nghị lịch sự", "что đọc 'shto'", "случилось (СВ, quá khứ)"],
        pronunciation_focus_en: ["можете + infinitive = polite request", "что said 'shto'", "случилось (pf past)"],
      },
      {
        russian: "Я хотел бы поменять это, если можно.",
        romanization: "Ya khotel by pomenyat eto, yesli mozhno.",
        en: "I would like to change this, if possible.",
        vi: "Tôi muốn đổi cái này, nếu được.",
        pronunciation_focus: ["хотел бы = muốn (lịch sự, điều kiện)", "поменять (СВ)", "если можно = nếu được"],
        pronunciation_focus_en: ["хотел бы = would like (polite conditional)", "поменять (pf)", "если можно = if possible"],
      },
      {
        russian: "К сожалению, это пока не работает.",
        romanization: "K sozhaleniyu, eto poka ne rabotayet.",
        en: "Unfortunately, this isn't working yet.",
        vi: "Tiếc là cái này vẫn chưa hoạt động.",
        pronunciation_focus: ["к сожалению = tiếc là", "пока = tạm thời/chưa", "не работает (НСВ)"],
        pronunciation_focus_en: ["к сожалению = unfortunately", "пока = for now / not yet", "не работает (impf)"],
      },
      {
        russian: "Спасибо за помощь, теперь всё понятно.",
        romanization: "Spasibo za pomoshch, teper vsyo ponyatno.",
        en: "Thanks for the help, now everything is clear.",
        vi: "Cảm ơn đã giúp, giờ thì mọi thứ đã rõ.",
        pronunciation_focus: ["спасибо за + cách 4", "помощь → за помощь", "понятно = đã rõ"],
        pronunciation_focus_en: ["спасибо за + accusative", "помощь → за помощь", "понятно = clear"],
      },
    ],
    vocabulary: [
      { cell_id: "c498716d-149e-4fff-a504-363a6ace9269", word: "проблема", romanization: "problema", en: "problem", vi: "vấn đề", pos: "noun (f)", pronunciation_vi: "pra-BLÉ-ma", pronunciation_en: "pra-BLYE-ma" },
      { cell_id: "5922357d-a973-4260-a4eb-80f666ac734e", word: "объяснить", romanization: "obyasnit", en: "to explain (pf)", vi: "giải thích", pos: "verb (pf)", pronunciation_vi: "ab-yas-NÍT", pronunciation_en: "ab-yas-NEET" },
      { cell_id: "89d09bb7-9204-473c-b274-c88309566f87", word: "поменять", romanization: "pomenyat", en: "to change / swap (pf)", vi: "đổi", pos: "verb (pf)", pronunciation_vi: "pa-me-NIÁT", pronunciation_en: "pa-me-NYAT" },
      { cell_id: "31e7101c-8e43-4aba-8d44-3ac113344a27", word: "к сожалению", romanization: "k sozhaleniyu", en: "unfortunately", vi: "tiếc là", pos: "phrase", pronunciation_vi: "k sa-zha-LÉ-ni-yu", pronunciation_en: "k sa-zha-LYE-nee-yoo" },
      { cell_id: "a7f7351a-a83b-4595-947b-206fd493fe46", word: "помощь", romanization: "pomoshch", en: "help", vi: "sự giúp đỡ", pos: "noun (f)", pronunciation_vi: "PÔ-mashch", pronunciation_en: "PO-moshch" },
    ],
    dialogue: [
      { cell_id: "dc5df7fa-7050-473f-8696-6dff31acdd9e", speaker: "Клиент", text: "Извините, у меня проблема с заказом.", romanization: "Izvinite, u menya problema s zakazom.", vi: "Xin lỗi, tôi có vấn đề với đơn hàng.", en: "Excuse me, I have a problem with my order." },
      { cell_id: "4129b60c-7c3a-4f23-b5d2-36545a9dac44", speaker: "Сотрудник", text: "Конечно. Можете объяснить, что случилось?", romanization: "Konechno. Mozhete obyasnit, chto sluchilos?", vi: "Tất nhiên. Anh/chị nói rõ chuyện gì được không?", en: "Of course. Can you explain what happened?" },
      { cell_id: "9b6ba5bc-6657-4e04-87f7-8037a5d81cbb", speaker: "Клиент", text: "Пришёл не тот размер. Я хотел бы поменять его.", romanization: "Prishyol ne tot razmer. Ya khotel by pomenyat yego.", vi: "Giao sai cỡ. Tôi muốn đổi.", en: "The wrong size arrived. I'd like to change it." },
      { cell_id: "1d645192-7df3-4b6c-b074-a3b0f0195dd6", speaker: "Сотрудник", text: "Хорошо, мы поменяем сегодня.", romanization: "Khorosho, my pomenyaem segodnya.", vi: "Được, hôm nay chúng tôi sẽ đổi.", en: "All right, we'll change it today." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch các khung câu xử lý vấn đề.",
        instruction_en: "Translate these problem-solving frames.",
        items: [
          { prompt: "Xin lỗi, tôi có vấn đề với đơn hàng.", answer: "Извините, у меня проблема с заказом." },
          { prompt: "Tôi muốn đổi cái này, nếu được.", answer: "Я хотел бы поменять это, если можно." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Hoàn thành lời cảm ơn.",
        instruction_en: "Complete the thank-you line.",
        items: [{ prompt: "Спасибо за _____. (помощь)", answer: "помощь" }],
      },
    ],
    cultural_notes_vi:
      "Người Nga đánh giá cao sự thẳng thắn nhưng lịch sự: mở đầu bằng 'извините', dùng 'хотел бы' thay vì 'хочу' để mềm hơn.",
    cultural_notes_en:
      "Russians value direct but polite speech: open with 'извините', and use 'хотел бы' instead of 'хочу' to soften the request.",
    tip_advice_vi: "Học thuộc 4 bước: nêu vấn đề → hỏi cho rõ → đề nghị giải pháp → cảm ơn. Dùng được cho hầu hết tình huống dịch vụ.",
    tip_advice_en: "Memorize the 4 steps: state the problem → ask for clarity → propose a fix → thank. It fits almost any service situation.",
  },
];
