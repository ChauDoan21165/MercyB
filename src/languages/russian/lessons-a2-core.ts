// src/languages/russian/lessons-a2-core.ts
//
// A2 core lesson batch for Vietnamese learners moving from A1 to A2.
// Compact, app-ready content converted from the local Vietnamese-Russian archive:
//   course-a2-complete.md, dialogues-beginner-051-100.md,
//   grammar-exercises-002.md, cases-cheatsheet.md, frequency-words-1001-2000.tsv.
//
// Focus: daily life, the six cases at A2 depth, past/future, directions,
// buying, appointments, and combining everything in connected speech.
// This file is a standalone batch; it does not alter the foundation modules.

import type { RussianLesson } from "./lessons";

export const lessons: RussianLesson[] = [
  {
    id: "russian_a2c_daily_routine",
    level: "A2",
    category: "daily_survival",
    title_vi: "A2: Sinh hoạt hằng ngày và thời gian",
    title_en: "A2: Daily life and time expressions",
    intro_vi:
      "A2 bắt đầu từ nhịp sống hằng ngày: thức dậy, làm việc, ăn, nghỉ. Học gắn từ chỉ thời gian với động từ lặp lại.",
    intro_en:
      "A2 starts from your daily rhythm: waking, working, eating, resting. Tie time words to repeated-action verbs.",
    sentences: [
      {
        russian: "Утром я завтракаю дома.",
        romanization: "Utrom ya zavtrakayu doma.",
        en: "In the morning I have breakfast at home.",
        vi: "Buổi sáng tôi ăn sáng ở nhà.",
        pronunciation_focus: ["утром = buổi sáng, đặt đầu câu", "завтракаю nhấn -тра", "дома = ở nhà"],
        pronunciation_focus_en: ["утром means in the morning, fronted", "завтракаю stresses -тра", "дома means at home"],
      },
      {
        russian: "Днём я работаю в офисе.",
        romanization: "Dnyom ya rabotayu v ofise.",
        en: "During the day I work in the office.",
        vi: "Ban ngày tôi làm việc ở văn phòng.",
        pronunciation_focus: ["днём có ё nhấn", "работаю nhịp đều", "в офисе là giới cách"],
        pronunciation_focus_en: ["днём has stressed ё", "работаю has even rhythm", "в офисе is prepositional"],
      },
      {
        russian: "Вечером я ужинаю и отдыхаю.",
        romanization: "Vecherom ya uzhinayu i otdykhayu.",
        en: "In the evening I have dinner and rest.",
        vi: "Buổi tối tôi ăn tối và nghỉ ngơi.",
        pronunciation_focus: ["вечером = buổi tối", "и = và nối hai động từ", "отдыхаю nhấn -ха"],
        pronunciation_focus_en: ["вечером means in the evening", "и links the two verbs", "отдыхаю stresses -ха"],
      },
      {
        russian: "Каждый день я учу русский язык.",
        romanization: "Kazhdyy den ya uchu russkiy yazyk.",
        en: "Every day I study Russian.",
        vi: "Mỗi ngày tôi học tiếng Nga.",
        pronunciation_focus: ["mẫu lặp lại dùng thể chưa hoàn thành", "каждый день = mỗi ngày", "язык là đối cách"],
        pronunciation_focus_en: ["routine uses the imperfective", "каждый день means every day", "язык is accusative"],
      },
    ],
    vocabulary: [
      { word: "утром", romanization: "utrom", en: "in the morning", vi: "buổi sáng", pos: "adverb", pronunciation_vi: "U-tram", pronunciation_en: "OO-trum" },
      { word: "днём", romanization: "dnyom", en: "in the afternoon", vi: "ban ngày", pos: "adverb", pronunciation_vi: "dnyom", pronunciation_en: "dnyom" },
      { word: "вечером", romanization: "vecherom", en: "in the evening", vi: "buổi tối", pos: "adverb", pronunciation_vi: "VE-che-ram", pronunciation_en: "VYE-che-rum" },
      { word: "отдыхать", romanization: "otdykhat", en: "to rest", vi: "nghỉ ngơi", pos: "verb", pronunciation_vi: "at-dy-HAT", pronunciation_en: "at-dy-HAHT" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ chỉ thời gian hợp lý.",
        instruction_en: "Fill in a logical time word.",
        items: [
          { prompt: "___ я завтракаю дома. (sáng)", answer: "Утром" },
          { prompt: "___ я ужинаю. (tối)", answer: "Вечером" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [{ prompt: "Mỗi ngày tôi học tiếng Nga.", answer: "Каждый день я учу русский язык." }],
      },
    ],
    cultural_notes_vi:
      "Tiếng Việt thường nói 'buổi sáng', 'buổi tối'. Tiếng Nga dùng dạng công cụ cách cố định: утром, днём, вечером, ночью — học nguyên cụm.",
    cultural_notes_en:
      "Vietnamese says 'in the morning/evening' with helper words. Russian uses fixed instrumental forms: утром, днём, вечером, ночью — memorize them whole.",
    tip_advice_vi: "Viết thời khóa biểu một ngày bằng 5 câu, mỗi câu mở đầu bằng một từ chỉ thời gian.",
    tip_advice_en: "Write your day in 5 sentences, each one opening with a time word.",
  },
  {
    id: "russian_a2c_accusative_buying",
    level: "A2",
    category: "case_control",
    title_vi: "A2: Đối cách — mua và muốn vật gì",
    title_en: "A2: Accusative — what you buy and want",
    intro_vi:
      "Đối cách trả lời 'cái gì?' sau động từ. Danh từ giống cái -а thường đổi thành -у; giống đực bất động vật giữ nguyên.",
    intro_en:
      "The accusative answers 'what?' after a verb. Feminine -а nouns usually become -у; inanimate masculine nouns stay the same.",
    sentences: [
      {
        russian: "Я покупаю воду и хлеб.",
        romanization: "Ya pokupayu vodu i khleb.",
        en: "I am buying water and bread.",
        vi: "Tôi mua nước và bánh mì.",
        pronunciation_focus: ["вода → воду", "хлеб giống đực không đổi", "покупаю nhấn -па"],
        pronunciation_focus_en: ["вода → воду", "хлеб is masculine, unchanged", "покупаю stresses -pa"],
      },
      {
        russian: "Она хочет новую сумку.",
        romanization: "Ona khochet novuyu sumku.",
        en: "She wants a new bag.",
        vi: "Cô ấy muốn một cái túi mới.",
        pronunciation_focus: ["tính từ cũng đổi: новая → новую", "сумка → сумку", "хочет nhấn -чет"],
        pronunciation_focus_en: ["the adjective also shifts: новая → новую", "сумка → сумку", "хочет stresses -chet"],
      },
      {
        russian: "Мы берём этот билет.",
        romanization: "My beryom etot bilet.",
        en: "We are taking this ticket.",
        vi: "Chúng tôi lấy vé này.",
        pronunciation_focus: ["билет giống đực bất động vật giữ nguyên", "берём có ё nhấn", "этот = cái này"],
        pronunciation_focus_en: ["билет stays as masculine inanimate", "берём has stressed ё", "этот means this"],
      },
      {
        russian: "Я хочу зелёный чай.",
        romanization: "Ya khochu zelyonyy chay.",
        en: "I want green tea.",
        vi: "Tôi muốn trà xanh.",
        pronunciation_focus: ["чай không đổi", "зелёный có ё", "хочу nhấn -чу"],
        pronunciation_focus_en: ["чай stays the same", "зелёный has ё", "хочу stresses -chu"],
      },
    ],
    vocabulary: [
      { word: "покупать", romanization: "pokupat", en: "to buy", vi: "mua", pos: "verb", pronunciation_vi: "pa-ku-PAT", pronunciation_en: "pa-koo-PAHT" },
      { word: "брать", romanization: "brat", en: "to take", vi: "lấy", pos: "verb", pronunciation_vi: "brat", pronunciation_en: "braht" },
      { word: "сумка", romanization: "sumka", en: "bag", vi: "túi", pos: "noun", pronunciation_vi: "SUM-ka", pronunciation_en: "SOOM-ka" },
      { word: "билет", romanization: "bilet", en: "ticket", vi: "vé", pos: "noun", pronunciation_vi: "bi-LYET", pronunciation_en: "bee-LYET" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn dạng đối cách đúng.",
        instruction_en: "Choose the correct accusative form.",
        items: [
          { prompt: "Я покупаю ___. (вода / воду / воде)", answer: "воду" },
          { prompt: "Она хочет ___ сумку. (новый / новая / новую)", answer: "новую" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [{ prompt: "Tôi muốn trà xanh.", answer: "Я хочу зелёный чай." }],
      },
    ],
    cultural_notes_vi:
      "Khác tiếng Việt, tính từ tiếng Nga đổi theo cách cùng danh từ: новая сумка → новую сумку. Học cả cụm tính từ + danh từ.",
    cultural_notes_en:
      "Unlike Vietnamese, Russian adjectives shift case with the noun: новая сумка → новую сумку. Learn the adjective + noun chunk together.",
    tip_advice_vi: "Lập danh sách mua sắm 5 món, viết mỗi món sau `Я покупаю …` ở đối cách.",
    tip_advice_en: "Make a 5-item shopping list and write each after `Я покупаю …` in the accusative.",
  },
  {
    id: "russian_a2c_genitive_possession",
    level: "A2",
    category: "case_control",
    title_vi: "A2: Sinh cách — sở hữu và 'không có'",
    title_en: "A2: Genitive — possession and absence",
    intro_vi:
      "Sinh cách diễn đạt 'của ai', 'không có', 'từ đâu' và số lượng. Danh từ giống cái -а thường đổi thành -ы/-и.",
    intro_en:
      "The genitive expresses 'whose', 'without/none', 'from where', and quantity. Feminine -а nouns usually become -ы/-и.",
    sentences: [
      {
        russian: "Это книга мамы.",
        romanization: "Eto kniga mamy.",
        en: "This is mom's book.",
        vi: "Đây là sách của mẹ.",
        pronunciation_focus: ["мама → мамы chỉ sở hữu", "không cần từ 'của'", "это = đây là"],
        pronunciation_focus_en: ["мама → мамы shows possession", "no separate word for 'of'", "это means this is"],
      },
      {
        russian: "У меня нет времени.",
        romanization: "U menya net vremeni.",
        en: "I have no time.",
        vi: "Tôi không có thời gian.",
        pronunciation_focus: ["нет + sinh cách = không có", "время → времени", "у меня = tôi có"],
        pronunciation_focus_en: ["нет + genitive = there is no", "время → времени", "у меня means I have"],
      },
      {
        russian: "Я иду из магазина.",
        romanization: "Ya idu iz magazina.",
        en: "I am coming from the store.",
        vi: "Tôi đi từ cửa hàng về.",
        pronunciation_focus: ["из + sinh cách = từ (nơi)", "магазин → магазина", "иду = đang đi bộ"],
        pronunciation_focus_en: ["из + genitive = from (a place)", "магазин → магазина", "иду means going on foot"],
      },
      {
        russian: "Дайте чашку чая, пожалуйста.",
        romanization: "Dayte chashku chaya, pozhaluysta.",
        en: "Give me a cup of tea, please.",
        vi: "Cho tôi một tách trà, làm ơn.",
        pronunciation_focus: ["чая là sinh cách chỉ số lượng", "чашку là đối cách (vật được đưa)", "дайте lịch sự"],
        pronunciation_focus_en: ["чая is genitive of quantity", "чашку is accusative (the thing given)", "дайте is polite"],
      },
    ],
    vocabulary: [
      { word: "нет", romanization: "net", en: "there is no", vi: "không có", pos: "particle", pronunciation_vi: "nyet", pronunciation_en: "nyet" },
      { word: "из", romanization: "iz", en: "from (out of)", vi: "từ", pos: "preposition", pronunciation_vi: "iz", pronunciation_en: "eez" },
      { word: "магазин", romanization: "magazin", en: "store", vi: "cửa hàng", pos: "noun", pronunciation_vi: "ma-ga-ZIN", pronunciation_en: "ma-ga-ZEEN" },
      { word: "время", romanization: "vremya", en: "time", vi: "thời gian", pos: "noun", pronunciation_vi: "VRE-mya", pronunciation_en: "VRYE-mya" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền dạng sinh cách.",
        instruction_en: "Fill in the genitive form.",
        items: [
          { prompt: "Это книга ___. (мама)", answer: "мамы" },
          { prompt: "У меня нет ___. (время)", answer: "времени" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [{ prompt: "Tôi đi từ cửa hàng về.", answer: "Я иду из магазина." }],
      },
    ],
    cultural_notes_vi:
      "Tiếng Việt nói 'không có thời gian' bằng từ riêng. Tiếng Nga ghép `нет` với sinh cách: нет времени, нет денег.",
    cultural_notes_en:
      "Vietnamese marks 'don't have' with words. Russian pairs `нет` with the genitive: нет времени, нет денег.",
    tip_advice_vi: "Tập mẫu `У меня нет …`: денег, времени, билета. Đây là câu rất hay dùng.",
    tip_advice_en: "Drill `У меня нет …`: денег, времени, билета. It is a high-frequency pattern.",
  },
  {
    id: "russian_a2c_dative_people",
    level: "A2",
    category: "case_control",
    title_vi: "A2: Tặng cách — cho ai, giúp ai",
    title_en: "A2: Dative — to/for whom, helping people",
    intro_vi:
      "Tặng cách chỉ người nhận: cho ai, giúp ai, ai bao nhiêu tuổi. Một số động từ như помогать luôn đi với tặng cách.",
    intro_en:
      "The dative marks the recipient: to/for whom, helping whom, someone's age. Verbs like помогать always take the dative.",
    sentences: [
      {
        russian: "Я помогаю маме.",
        romanization: "Ya pomogayu mame.",
        en: "I help mom.",
        vi: "Tôi giúp mẹ.",
        pronunciation_focus: ["помогать đòi tặng cách", "мама → маме", "tiếng Nga hiểu là 'giúp cho mẹ'"],
        pronunciation_focus_en: ["помогать requires the dative", "мама → маме", "Russian reads it as 'help to mom'"],
      },
      {
        russian: "Дай мне телефон.",
        romanization: "Day mne telefon.",
        en: "Give me the phone.",
        vi: "Đưa cho tôi điện thoại.",
        pronunciation_focus: ["мне = cho tôi (tặng cách của я)", "телефон là đối cách", "дай thân mật"],
        pronunciation_focus_en: ["мне means to me (dative of я)", "телефон is accusative", "дай is informal"],
      },
      {
        russian: "Сколько вам лет?",
        romanization: "Skolko vam let?",
        en: "How old are you?",
        vi: "Bạn bao nhiêu tuổi?",
        pronunciation_focus: ["вам là tặng cách lịch sự của вы", "лет dùng sau số lớn", "câu tuổi dùng tặng cách"],
        pronunciation_focus_en: ["вам is polite dative of вы", "лет follows larger numbers", "age uses the dative"],
      },
      {
        russian: "Мне нужно лекарство.",
        romanization: "Mne nuzhno lekarstvo.",
        en: "I need medicine.",
        vi: "Tôi cần thuốc.",
        pronunciation_focus: ["мне нужно = tôi cần", "lекарство là chủ thể cần", "нужно không đổi với danh từ trung"],
        pronunciation_focus_en: ["мне нужно = I need", "лекарство is the needed thing", "нужно stays for neuter nouns"],
      },
    ],
    vocabulary: [
      { word: "помогать", romanization: "pomogat", en: "to help", vi: "giúp", pos: "verb", pronunciation_vi: "pa-ma-GAT", pronunciation_en: "pa-ma-GAHT" },
      { word: "мне", romanization: "mne", en: "to me", vi: "cho tôi", pos: "pronoun", pronunciation_vi: "mnye", pronunciation_en: "mnye" },
      { word: "нужно", romanization: "nuzhno", en: "need / necessary", vi: "cần", pos: "predicate", pronunciation_vi: "NUZH-na", pronunciation_en: "NOOZH-na" },
      { word: "лекарство", romanization: "lekarstvo", en: "medicine", vi: "thuốc", pos: "noun", pronunciation_vi: "le-KAR-stva", pronunciation_en: "le-KAR-stva" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền dạng tặng cách.",
        instruction_en: "Fill in the dative form.",
        items: [
          { prompt: "Я помогаю ___. (мама)", answer: "маме" },
          { prompt: "Сколько ___ лет? (вы)", answer: "вам" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [{ prompt: "Tôi cần thuốc.", answer: "Мне нужно лекарство." }],
      },
    ],
    cultural_notes_vi:
      "Người học Việt hay quên đổi cách sau помогать vì tiếng Việt nói thẳng 'giúp mẹ'. Hãy gắn động từ này với tặng cách ngay từ đầu.",
    cultural_notes_en:
      "Vietnamese learners forget to shift case after помогать because Vietnamese says 'help mom' directly. Bind this verb to the dative from day one.",
    tip_advice_vi: "Học thuộc tặng cách đại từ: мне, тебе, ему, ей, нам, вам, им. Dùng hằng ngày.",
    tip_advice_en: "Memorize the dative pronouns: мне, тебе, ему, ей, нам, вам, им. Use them daily.",
  },
  {
    id: "russian_a2c_instrumental_with",
    level: "A2",
    category: "case_control",
    title_vi: "A2: Công cụ cách — với ai, bằng gì",
    title_en: "A2: Instrumental — with whom, by what",
    intro_vi:
      "Công cụ cách chỉ phương tiện, người đi cùng, hoặc nghề nghiệp. Sau `с` (với) danh từ thường thêm -ом/-ой.",
    intro_en:
      "The instrumental marks tools, companions, or profession. After `с` (with), nouns usually take -ом/-ой.",
    sentences: [
      {
        russian: "Я иду с другом.",
        romanization: "Ya idu s drugom.",
        en: "I am going with a friend.",
        vi: "Tôi đi với bạn.",
        pronunciation_focus: ["с + công cụ cách = với", "друг → другом", "nữ: с подругой"],
        pronunciation_focus_en: ["с + instrumental = with", "друг → другом", "feminine: с подругой"],
      },
      {
        russian: "Я пишу ручкой.",
        romanization: "Ya pishu ruchkoy.",
        en: "I write with a pen.",
        vi: "Tôi viết bằng bút.",
        pronunciation_focus: ["công cụ không cần giới từ", "ручка → ручкой", "пишу nhấn -шу"],
        pronunciation_focus_en: ["a tool needs no preposition", "ручка → ручкой", "пишу stresses -shu"],
      },
      {
        russian: "Она работает врачом.",
        romanization: "Ona rabotayet vrachom.",
        en: "She works as a doctor.",
        vi: "Cô ấy làm bác sĩ.",
        pronunciation_focus: ["nghề nghiệp dùng công cụ cách", "врач → врачом", "работать + nghề"],
        pronunciation_focus_en: ["profession uses the instrumental", "врач → врачом", "работать + role"],
      },
      {
        russian: "Мы едем с детьми.",
        romanization: "My yedem s detmi.",
        en: "We are going with the children.",
        vi: "Chúng tôi đi cùng các con.",
        pronunciation_focus: ["едем = đi bằng xe", "дети → детьми bất quy tắc", "с + công cụ cách"],
        pronunciation_focus_en: ["едем means going by vehicle", "дети → детьми is irregular", "с + instrumental"],
      },
    ],
    vocabulary: [
      { word: "с", romanization: "s", en: "with", vi: "với / cùng", pos: "preposition", pronunciation_vi: "s", pronunciation_en: "s" },
      { word: "друг", romanization: "drug", en: "friend", vi: "bạn", pos: "noun", pronunciation_vi: "druk", pronunciation_en: "drook" },
      { word: "ручка", romanization: "ruchka", en: "pen", vi: "bút", pos: "noun", pronunciation_vi: "RUCH-ka", pronunciation_en: "ROOCH-ka" },
      { word: "врач", romanization: "vrach", en: "doctor", vi: "bác sĩ", pos: "noun", pronunciation_vi: "vrach", pronunciation_en: "vrahch" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền dạng công cụ cách.",
        instruction_en: "Fill in the instrumental form.",
        items: [
          { prompt: "Я иду с ___. (друг)", answer: "другом" },
          { prompt: "Она работает ___. (врач)", answer: "врачом" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [{ prompt: "Tôi viết bằng bút.", answer: "Я пишу ручкой." }],
      },
    ],
    cultural_notes_vi:
      "Tiếng Việt dùng 'bằng' và 'với' là từ riêng. Tiếng Nga gộp ý này vào đuôi công cụ cách, đôi khi không cần giới từ.",
    cultural_notes_en:
      "Vietnamese uses separate words for 'by' and 'with'. Russian folds both into the instrumental ending, sometimes with no preposition.",
    tip_advice_vi: "Phân biệt: công cụ (bằng gì) không có giới từ; đi cùng ai thì thêm `с`.",
    tip_advice_en: "Distinguish: a tool (by what) takes no preposition; a companion takes `с`.",
  },
  {
    id: "russian_a2c_prepositional_places",
    level: "A2",
    category: "case_control",
    title_vi: "A2: Giới cách — sống, làm, học ở đâu",
    title_en: "A2: Prepositional — where you live, work, study",
    intro_vi:
      "Giới cách trả lời `Где?` (ở đâu) sau `в/на`. Phân biệt với `Куда?` (đi đâu) dùng đối cách.",
    intro_en:
      "The prepositional answers `Где?` (where) after `в/на`. Contrast `Куда?` (to where), which uses the accusative.",
    sentences: [
      {
        russian: "Я живу в Москве.",
        romanization: "Ya zhivu v Moskve.",
        en: "I live in Moscow.",
        vi: "Tôi sống ở Moscow.",
        pronunciation_focus: ["в + giới cách chỉ vị trí", "Москва → Москве", "живу nhấn -ву"],
        pronunciation_focus_en: ["в + prepositional marks location", "Москва → Москве", "живу stresses -vu"],
      },
      {
        russian: "Я работаю на заводе.",
        romanization: "Ya rabotayu na zavode.",
        en: "I work at a factory.",
        vi: "Tôi làm việc ở nhà máy.",
        pronunciation_focus: ["một số nơi làm dùng `на`", "завод → заводе", "на заводе là cụm cố định"],
        pronunciation_focus_en: ["some workplaces take `на`", "завод → заводе", "на заводе is a set phrase"],
      },
      {
        russian: "Дети учатся в школе.",
        romanization: "Deti uchatsya v shkole.",
        en: "The children study at school.",
        vi: "Bọn trẻ học ở trường.",
        pronunciation_focus: ["школа → школе", "учатся = đang học", "в школе chỉ vị trí"],
        pronunciation_focus_en: ["школа → школе", "учатся means they study", "в школе marks location"],
      },
      {
        russian: "Завтра я еду в Москву.",
        romanization: "Zavtra ya yedu v Moskvu.",
        en: "Tomorrow I am going to Moscow.",
        vi: "Ngày mai tôi đi Moscow.",
        pronunciation_focus: ["hướng đi: Москва → Москву (đối cách)", "еду = đi bằng xe", "so sánh с в Москве"],
        pronunciation_focus_en: ["direction: Москва → Москву (accusative)", "еду means going by vehicle", "contrast with в Москве"],
      },
    ],
    vocabulary: [
      { word: "жить", romanization: "zhit", en: "to live", vi: "sống", pos: "verb", pronunciation_vi: "zhit", pronunciation_en: "zhyt" },
      { word: "завод", romanization: "zavod", en: "factory", vi: "nhà máy", pos: "noun", pronunciation_vi: "za-VOT", pronunciation_en: "za-VOHT" },
      { word: "школа", romanization: "shkola", en: "school", vi: "trường", pos: "noun", pronunciation_vi: "SHKO-la", pronunciation_en: "SHKOH-la" },
      { word: "где", romanization: "gde", en: "where", vi: "ở đâu", pos: "adverb", pronunciation_vi: "gdye", pronunciation_en: "gdye" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn vị trí (Где?) hay hướng đi (Куда?).",
        instruction_en: "Choose location (Где?) or direction (Куда?).",
        items: [
          { prompt: "Я живу в ___. (Москва)", answer: "Москве" },
          { prompt: "Завтра я еду в ___. (Москва)", answer: "Москву" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [{ prompt: "Tôi làm việc ở nhà máy.", answer: "Я работаю на заводе." }],
      },
    ],
    cultural_notes_vi:
      "Người học Việt thường nói `ở/đến` bằng cùng một cấu trúc. Tiếng Nga bắt buộc phân biệt: `Где?` → giới cách; `Куда?` → đối cách.",
    cultural_notes_en:
      "Vietnamese learners use one structure for `at` and `to`. Russian forces the split: `Где?` → prepositional; `Куда?` → accusative.",
    tip_advice_vi: "Trước khi nói, tự hỏi `Где` hay `Куда`. Câu hỏi quyết định đuôi từ.",
    tip_advice_en: "Before speaking, ask yourself `Где` or `Куда`. The question decides the ending.",
  },
  {
    id: "russian_a2c_past_tense",
    level: "A2",
    category: "case_control",
    title_vi: "A2: Quá khứ — kể chuyện hôm qua",
    title_en: "A2: Past tense — talking about yesterday",
    intro_vi:
      "Quá khứ tiếng Nga đổi theo giống và số: nam -л, nữ -ла, trung -ло, số nhiều -ли. Người nói nữ tự dùng dạng -ла.",
    intro_en:
      "Russian past tense agrees by gender and number: masc -л, fem -ла, neuter -ло, plural -ли. A female speaker uses the -ла form.",
    sentences: [
      {
        russian: "Вчера я работал весь день.",
        romanization: "Vchera ya rabotal ves den.",
        en: "Yesterday I worked all day. (male speaker)",
        vi: "Hôm qua tôi làm việc cả ngày. (người nói nam)",
        pronunciation_focus: ["работал dạng nam", "вчера = hôm qua", "весь день = cả ngày"],
        pronunciation_focus_en: ["работал is masculine", "вчера means yesterday", "весь день means all day"],
      },
      {
        russian: "Анна купила хлеб утром.",
        romanization: "Anna kupila khleb utrom.",
        en: "Anna bought bread in the morning.",
        vi: "Anna đã mua bánh mì buổi sáng.",
        pronunciation_focus: ["купила dạng nữ", "купить là thể hoàn thành", "хлеб là đối cách"],
        pronunciation_focus_en: ["купила is feminine", "купить is perfective", "хлеб is accusative"],
      },
      {
        russian: "Мы были дома вечером.",
        romanization: "My byli doma vecherom.",
        en: "We were at home in the evening.",
        vi: "Buổi tối chúng tôi đã ở nhà.",
        pronunciation_focus: ["были = đã, dạng số nhiều của быть", "дома = ở nhà", "vắng mặt động từ ở hiện tại"],
        pronunciation_focus_en: ["были is plural past of быть", "дома means at home", "be is dropped in the present"],
      },
      {
        russian: "Я опоздал на работу.",
        romanization: "Ya opozdal na rabotu.",
        en: "I was late for work. (male speaker)",
        vi: "Tôi đã đến trễ chỗ làm. (người nói nam)",
        pronunciation_focus: ["nam опоздал, nữ опоздала", "на работу chỉ hướng đến", "опоздать là hoàn thành"],
        pronunciation_focus_en: ["male опоздал, female опоздала", "на работу marks direction", "опоздать is perfective"],
      },
    ],
    vocabulary: [
      { word: "вчера", romanization: "vchera", en: "yesterday", vi: "hôm qua", pos: "adverb", pronunciation_vi: "vche-RA", pronunciation_en: "vche-RAH" },
      { word: "купить", romanization: "kupit", en: "to buy (once)", vi: "mua (xong)", pos: "verb", pronunciation_vi: "ku-PIT", pronunciation_en: "koo-PEET" },
      { word: "быть", romanization: "byt", en: "to be", vi: "thì / ở", pos: "verb", pronunciation_vi: "byt", pronunciation_en: "byt" },
      { word: "опоздать", romanization: "opozdat", en: "to be late", vi: "đến trễ", pos: "verb", pronunciation_vi: "a-paz-DAT", pronunciation_en: "a-paz-DAHT" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn dạng quá khứ đúng theo giống.",
        instruction_en: "Choose the past form by gender.",
        items: [
          { prompt: "Анна ___ хлеб. (купил / купила / купило)", answer: "купила" },
          { prompt: "Иван ___ весь день. (работал / работала)", answer: "работал" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga (người nói nữ).",
        instruction_en: "Translate into Russian (female speaker).",
        items: [{ prompt: "Hôm qua tôi đã ở nhà.", answer: "Вчера я была дома." }],
      },
    ],
    cultural_notes_vi:
      "Tiếng Việt dùng 'đã' cho mọi chủ thể. Tiếng Nga đổi đuôi động từ theo giống người/vật, không theo người nói chia ngôi.",
    cultural_notes_en:
      "Vietnamese marks past with 'đã' for everyone. Russian changes the ending by the subject's gender, not by grammatical person.",
    tip_advice_vi: "Khi kể chuyện hôm qua, xác định chủ thể là nam/nữ/số nhiều trước, rồi chọn -л/-ла/-ли.",
    tip_advice_en: "When recounting yesterday, fix the subject as masc/fem/plural first, then pick -л/-ла/-ли.",
  },
  {
    id: "russian_a2c_future_plans",
    level: "A2",
    category: "case_control",
    title_vi: "A2: Tương lai — kế hoạch ngày mai",
    title_en: "A2: Future tense — tomorrow's plans",
    intro_vi:
      "Có hai tương lai: `буду + nguyên mẫu` (chưa hoàn thành, quá trình) và động từ hoàn thành chia hiện tại (kết quả một lần).",
    intro_en:
      "Two futures: `буду + infinitive` (imperfective, process) and a perfective verb conjugated like the present (a single result).",
    sentences: [
      {
        russian: "Завтра я буду работать.",
        romanization: "Zavtra ya budu rabotat.",
        en: "Tomorrow I will work.",
        vi: "Ngày mai tôi sẽ làm việc.",
        pronunciation_focus: ["буду + nguyên mẫu, không chia", "работать giữ nguyên", "завтра = ngày mai"],
        pronunciation_focus_en: ["буду + infinitive, do not conjugate it", "работать stays as is", "завтра means tomorrow"],
      },
      {
        russian: "Я куплю билеты завтра.",
        romanization: "Ya kuplyu bilety zavtra.",
        en: "I will buy the tickets tomorrow.",
        vi: "Ngày mai tôi sẽ mua vé.",
        pronunciation_focus: ["куплю là tương lai hoàn thành một lần", "билеты số nhiều đối cách", "không cần буду"],
        pronunciation_focus_en: ["куплю is a one-time perfective future", "билеты plural accusative", "no буду needed"],
      },
      {
        russian: "Вечером мы будем смотреть фильм.",
        romanization: "Vecherom my budem smotret film.",
        en: "In the evening we will watch a film.",
        vi: "Buổi tối chúng tôi sẽ xem phim.",
        pronunciation_focus: ["будем cho 'chúng tôi'", "смотреть giữ nguyên", "quá trình → dùng буду + nguyên mẫu"],
        pronunciation_focus_en: ["будем for 'we'", "смотреть stays infinitive", "process → буду + infinitive"],
      },
      {
        russian: "Я позвоню тебе вечером.",
        romanization: "Ya pozvonyu tebe vecherom.",
        en: "I will call you in the evening.",
        vi: "Buổi tối tôi sẽ gọi cho bạn.",
        pronunciation_focus: ["позвоню hoàn thành, một cuộc gọi", "тебе là tặng cách", "позвонить nhấn cuối"],
        pronunciation_focus_en: ["позвоню is perfective, one call", "тебе is dative", "позвонить stresses the end"],
      },
    ],
    vocabulary: [
      { word: "завтра", romanization: "zavtra", en: "tomorrow", vi: "ngày mai", pos: "adverb", pronunciation_vi: "ZAV-tra", pronunciation_en: "ZAHV-tra" },
      { word: "буду", romanization: "budu", en: "I will (be)", vi: "tôi sẽ", pos: "verb", pronunciation_vi: "BU-du", pronunciation_en: "BOO-doo" },
      { word: "купить", romanization: "kupit", en: "to buy (once)", vi: "mua (xong)", pos: "verb", pronunciation_vi: "ku-PIT", pronunciation_en: "koo-PEET" },
      { word: "позвонить", romanization: "pozvonit", en: "to call (once)", vi: "gọi điện", pos: "verb", pronunciation_vi: "paz-va-NIT", pronunciation_en: "paz-va-NEET" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn tương lai phù hợp.",
        instruction_en: "Choose the correct future.",
        items: [
          { prompt: "Завтра я ___ работать. (буду / куплю)", answer: "буду" },
          { prompt: "Я ___ билеты завтра. (буду / куплю)", answer: "куплю" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [{ prompt: "Buổi tối tôi sẽ gọi cho bạn.", answer: "Я позвоню тебе вечером." }],
      },
    ],
    cultural_notes_vi:
      "Tiếng Việt chỉ cần 'sẽ' cho mọi tương lai. Tiếng Nga buộc chọn: quá trình (буду + nguyên mẫu) hay kết quả một lần (động từ hoàn thành).",
    cultural_notes_en:
      "Vietnamese uses one 'sẽ' for any future. Russian forces a choice: process (буду + infinitive) or single result (a perfective verb).",
    tip_advice_vi: "Hỏi: hành động kéo dài/lặp lại hay xong một lần? Đó là chìa khóa chọn thể.",
    tip_advice_en: "Ask: is the action ongoing/repeated or finished once? That choice picks the aspect.",
  },
  {
    id: "russian_a2c_directions",
    level: "A2",
    category: "practical_tasks",
    title_vi: "A2: Hỏi đường và phương tiện",
    title_en: "A2: Asking directions and transport",
    intro_vi:
      "Để đi lại, cần hỏi `Где…?`, hiểu trái/phải/thẳng, và biết tên bến xe, trạm. Câu ngắn nhưng cứu nguy.",
    intro_en:
      "To get around, ask `Где…?`, understand left/right/straight, and know stop and station names. Short phrases that save you.",
    sentences: [
      {
        russian: "Где остановка автобуса?",
        romanization: "Gde ostanovka avtobusa?",
        en: "Where is the bus stop?",
        vi: "Trạm xe buýt ở đâu?",
        pronunciation_focus: ["остановка = trạm dừng", "автобуса là sinh cách 'của xe buýt'", "Где mở đầu câu hỏi nơi"],
        pronunciation_focus_en: ["остановка means stop", "автобуса is genitive 'of the bus'", "Где opens a location question"],
      },
      {
        russian: "Идите прямо, потом налево.",
        romanization: "Idite pryamo, potom nalevo.",
        en: "Go straight, then to the left.",
        vi: "Đi thẳng, sau đó rẽ trái.",
        pronunciation_focus: ["идите là mệnh lệnh lịch sự", "прямо = thẳng", "налево = bên trái"],
        pronunciation_focus_en: ["идите is a polite imperative", "прямо means straight", "налево means to the left"],
      },
      {
        russian: "Это далеко отсюда?",
        romanization: "Eto daleko otsyuda?",
        en: "Is it far from here?",
        vi: "Chỗ đó có xa đây không?",
        pronunciation_focus: ["далеко = xa", "отсюда = từ đây", "câu hỏi không cần trợ động từ"],
        pronunciation_focus_en: ["далеко means far", "отсюда means from here", "no helper verb needed"],
      },
      {
        russian: "Я еду в центр на метро.",
        romanization: "Ya yedu v tsentr na metro.",
        en: "I am going to the center by metro.",
        vi: "Tôi đi vào trung tâm bằng tàu điện ngầm.",
        pronunciation_focus: ["на метро = bằng tàu điện ngầm", "в центр là hướng đi", "еду dùng cho xe"],
        pronunciation_focus_en: ["на метро means by metro", "в центр marks direction", "еду is for vehicles"],
      },
    ],
    vocabulary: [
      { word: "остановка", romanization: "ostanovka", en: "stop", vi: "trạm dừng", pos: "noun", pronunciation_vi: "as-ta-NOF-ka", pronunciation_en: "as-ta-NOHF-ka" },
      { word: "налево", romanization: "nalevo", en: "to the left", vi: "rẽ trái", pos: "adverb", pronunciation_vi: "na-LYE-va", pronunciation_en: "na-LYE-va" },
      { word: "направо", romanization: "napravo", en: "to the right", vi: "rẽ phải", pos: "adverb", pronunciation_vi: "na-PRA-va", pronunciation_en: "na-PRAH-va" },
      { word: "прямо", romanization: "pryamo", en: "straight", vi: "đi thẳng", pos: "adverb", pronunciation_vi: "PRYA-ma", pronunciation_en: "PRYAH-ma" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ chỉ hướng với nghĩa.",
        instruction_en: "Match the direction word to its meaning.",
        items: [
          { prompt: "налево", answer: "rẽ trái" },
          { prompt: "направо", answer: "rẽ phải" },
          { prompt: "прямо", answer: "đi thẳng" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [{ prompt: "Trạm xe buýt ở đâu?", answer: "Где остановка автобуса?" }],
      },
    ],
    cultural_notes_vi:
      "Ở Nga, người ta thường chỉ đường bằng mệnh lệnh lịch sự (идите, поверните). Đừng ngại — đó là cách nói chuẩn, không thô.",
    cultural_notes_en:
      "In Russia, directions come as polite imperatives (идите, поверните). Don't worry — that is standard and not rude.",
    tip_advice_vi: "Học 4 từ cứu nguy: прямо, налево, направо, остановка. Đủ để đi lại cơ bản.",
    tip_advice_en: "Learn 4 survival words: прямо, налево, направо, остановка. Enough to move around.",
  },
  {
    id: "russian_a2c_shopping_paying",
    level: "A2",
    category: "practical_tasks",
    title_vi: "A2: Mua sắm và thanh toán",
    title_en: "A2: Shopping and paying",
    intro_vi:
      "Ở cửa hàng cần hỏi giá, trả bằng thẻ, xin hóa đơn. Mẫu `Сколько стоит…?` và `Можно…?` rất mạnh.",
    intro_en:
      "At the store you ask prices, pay by card, request a receipt. The patterns `Сколько стоит…?` and `Можно…?` are powerful.",
    sentences: [
      {
        russian: "Сколько это стоит?",
        romanization: "Skolko eto stoit?",
        en: "How much does this cost?",
        vi: "Cái này giá bao nhiêu?",
        pronunciation_focus: ["сколько = bao nhiêu", "стоит = có giá", "это = cái này"],
        pronunciation_focus_en: ["сколько means how much", "стоит means costs", "это means this"],
      },
      {
        russian: "Можно картой?",
        romanization: "Mozhno kartoy?",
        en: "Can I pay by card?",
        vi: "Trả bằng thẻ được không?",
        pronunciation_focus: ["можно = có được không", "карта → картой (công cụ cách)", "câu rất ngắn nhưng đủ ý"],
        pronunciation_focus_en: ["можно means may I / is it allowed", "карта → картой (instrumental)", "short but complete"],
      },
      {
        russian: "Дайте чек, пожалуйста.",
        romanization: "Dayte chek, pozhaluysta.",
        en: "Give me the receipt, please.",
        vi: "Cho tôi hóa đơn, làm ơn.",
        pronunciation_focus: ["дайте lịch sự", "чек = hóa đơn/biên lai", "пожалуйста làm câu lịch sự"],
        pronunciation_focus_en: ["дайте is polite", "чек means receipt", "пожалуйста softens the request"],
      },
      {
        russian: "Мне нужен пакет.",
        romanization: "Mne nuzhen paket.",
        en: "I need a bag.",
        vi: "Tôi cần một cái túi.",
        pronunciation_focus: ["нужен hợp với danh từ giống đực", "пакет = túi mua hàng", "мне = tôi cần"],
        pronunciation_focus_en: ["нужен agrees with a masculine noun", "пакет means shopping bag", "мне = I need"],
      },
    ],
    vocabulary: [
      { word: "сколько", romanization: "skolko", en: "how much", vi: "bao nhiêu", pos: "adverb", pronunciation_vi: "SKOL-ka", pronunciation_en: "SKOL-ka" },
      { word: "стоить", romanization: "stoit", en: "to cost", vi: "có giá", pos: "verb", pronunciation_vi: "STO-it", pronunciation_en: "STOH-eet" },
      { word: "карта", romanization: "karta", en: "card", vi: "thẻ", pos: "noun", pronunciation_vi: "KAR-ta", pronunciation_en: "KAR-ta" },
      { word: "чек", romanization: "chek", en: "receipt", vi: "hóa đơn", pos: "noun", pronunciation_vi: "chek", pronunciation_en: "chek" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Hoàn thành câu mua sắm.",
        instruction_en: "Complete the shopping phrase.",
        items: [
          { prompt: "___ это стоит? (bao nhiêu)", answer: "Сколько" },
          { prompt: "Можно ___? (bằng thẻ)", answer: "картой" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [{ prompt: "Cho tôi hóa đơn, làm ơn.", answer: "Дайте чек, пожалуйста." }],
      },
    ],
    cultural_notes_vi:
      "Ở Nga, thanh toán thẻ rất phổ biến và `Можно картой?` đủ để hỏi. Số tiền sau số đếm đổi đuôi: десять рублей.",
    cultural_notes_en:
      "Card payment is common in Russia and `Можно картой?` is enough to ask. Currency after numbers changes ending: десять рублей.",
    tip_advice_vi: "Thuộc lòng ba câu: `Сколько стоит?`, `Можно картой?`, `Дайте чек`. Đủ qua một lần mua hàng.",
    tip_advice_en: "Memorize three lines: `Сколько стоит?`, `Можно картой?`, `Дайте чек`. Enough for one purchase.",
  },
  {
    id: "russian_a2c_appointments",
    level: "A2",
    category: "practical_tasks",
    title_vi: "A2: Lịch hẹn — bác sĩ và cơ quan",
    title_en: "A2: Appointments — doctor and office",
    intro_vi:
      "Đặt và xác nhận lịch hẹn: nói có hẹn, hỏi phòng số mấy, báo trễ. Dùng `запись`, `к + tặng cách`, số phòng.",
    intro_en:
      "Make and confirm appointments: state you have one, ask the room number, report being late. Use `запись`, `к + dative`, room numbers.",
    sentences: [
      {
        russian: "У меня запись к врачу.",
        romanization: "U menya zapis k vrachu.",
        en: "I have an appointment with the doctor.",
        vi: "Tôi có lịch hẹn với bác sĩ.",
        pronunciation_focus: ["запись = lịch hẹn", "к + tặng cách: врач → врачу", "у меня = tôi có"],
        pronunciation_focus_en: ["запись means appointment", "к + dative: врач → врачу", "у меня means I have"],
      },
      {
        russian: "Какой кабинет?",
        romanization: "Kakoy kabinet?",
        en: "Which room?",
        vi: "Phòng số mấy?",
        pronunciation_focus: ["кабинет = phòng khám/làm việc", "какой = nào/số mấy", "câu hỏi ngắn"],
        pronunciation_focus_en: ["кабинет means office/exam room", "какой means which", "a short question"],
      },
      {
        russian: "Когда у меня приём?",
        romanization: "Kogda u menya priyom?",
        en: "When is my appointment?",
        vi: "Buổi hẹn của tôi khi nào?",
        pronunciation_focus: ["когда = khi nào", "приём = buổi tiếp/khám", "приём có ё nhấn"],
        pronunciation_focus_en: ["когда means when", "приём means reception/visit", "приём has stressed ё"],
      },
      {
        russian: "Извините, я немного опоздаю.",
        romanization: "Izvinite, ya nemnogo opozdayu.",
        en: "Sorry, I will be a little late.",
        vi: "Xin lỗi, tôi sẽ đến trễ một chút.",
        pronunciation_focus: ["извините lịch sự", "немного = một chút", "опоздаю là tương lai hoàn thành"],
        pronunciation_focus_en: ["извините is polite", "немного means a little", "опоздаю is perfective future"],
      },
    ],
    vocabulary: [
      { word: "запись", romanization: "zapis", en: "appointment", vi: "lịch hẹn", pos: "noun", pronunciation_vi: "ZA-pis", pronunciation_en: "ZAH-pees" },
      { word: "врач", romanization: "vrach", en: "doctor", vi: "bác sĩ", pos: "noun", pronunciation_vi: "vrach", pronunciation_en: "vrahch" },
      { word: "кабинет", romanization: "kabinet", en: "office / room", vi: "phòng", pos: "noun", pronunciation_vi: "ka-bi-NYET", pronunciation_en: "ka-bee-NYET" },
      { word: "приём", romanization: "priyom", en: "reception / visit", vi: "buổi hẹn", pos: "noun", pronunciation_vi: "pri-YOM", pronunciation_en: "pree-YOM" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền dạng đúng.",
        instruction_en: "Fill in the correct form.",
        items: [
          { prompt: "У меня запись к ___. (врач)", answer: "врачу" },
          { prompt: "Какой ___? (phòng)", answer: "кабинет" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [{ prompt: "Tôi có lịch hẹn với bác sĩ.", answer: "У меня запись к врачу." }],
      },
    ],
    cultural_notes_vi:
      "Ở cơ quan/bệnh viện Nga, người ta hỏi `фамилия` (họ) chứ không phải tên. `фамилия` không có nghĩa 'gia đình'.",
    cultural_notes_en:
      "At Russian offices/clinics they ask for `фамилия` (surname), not first name. `фамилия` does not mean 'family'.",
    tip_advice_vi: "Chuẩn bị trước: họ tên, giờ hẹn, tên bác sĩ. Mang theo giấy hẹn để đọc số phòng.",
    tip_advice_en: "Prepare in advance: your surname, the time, the doctor's name. Bring the slip to read the room number.",
  },
  {
    id: "russian_a2c_connected_speech",
    level: "A2",
    category: "connected_speech",
    title_vi: "A2: Nối ý — gộp cách, thời và thể",
    title_en: "A2: Connected speech — joining case, tense, aspect",
    intro_vi:
      "Cuối A2, hãy nối nhiều câu thành đoạn: dùng потому что (vì), поэтому (nên), и (và) để kể một việc trọn vẹn.",
    intro_en:
      "By the end of A2, join sentences into a paragraph: use потому что (because), поэтому (so), и (and) to tell a complete story.",
    sentences: [
      {
        russian: "Вчера я был занят, поэтому я не позвонил.",
        romanization: "Vchera ya byl zanyat, poetomu ya ne pozvonil.",
        en: "Yesterday I was busy, so I did not call. (male speaker)",
        vi: "Hôm qua tôi bận, nên tôi không gọi. (người nói nam)",
        pronunciation_focus: ["поэтому = vì vậy/nên", "был занят dạng nam", "не trước động từ phủ định"],
        pronunciation_focus_en: ["поэтому means therefore/so", "был занят is masculine", "не before the verb negates"],
      },
      {
        russian: "Я учу русский, потому что работаю в России.",
        romanization: "Ya uchu russkiy, potomu chto rabotayu v Rossii.",
        en: "I study Russian because I work in Russia.",
        vi: "Tôi học tiếng Nga vì tôi làm việc ở Nga.",
        pronunciation_focus: ["потому что = vì", "в России là giới cách", "hai mệnh đề nối bằng dấu phẩy"],
        pronunciation_focus_en: ["потому что means because", "в России is prepositional", "two clauses joined by a comma"],
      },
      {
        russian: "Сначала я куплю билет, потом поеду домой.",
        romanization: "Snachala ya kuplyu bilet, potom poyedu domoy.",
        en: "First I will buy a ticket, then I will go home.",
        vi: "Trước tiên tôi sẽ mua vé, sau đó về nhà.",
        pronunciation_focus: ["сначала… потом… = trước… sau…", "куплю/поеду là tương lai hoàn thành", "домой = về nhà (hướng)"],
        pronunciation_focus_en: ["сначала… потом… = first… then…", "куплю/поеду are perfective future", "домой = homeward (direction)"],
      },
      {
        russian: "Если будет время, я отдохну.",
        romanization: "Esli budet vremya, ya otdokhnu.",
        en: "If there is time, I will rest.",
        vi: "Nếu có thời gian, tôi sẽ nghỉ.",
        pronunciation_focus: ["если = nếu", "будет время = sẽ có thời gian", "отдохну là tương lai hoàn thành"],
        pronunciation_focus_en: ["если means if", "будет время = there will be time", "отдохну is perfective future"],
      },
    ],
    vocabulary: [
      { word: "потому что", romanization: "potomu chto", en: "because", vi: "vì", pos: "conjunction", pronunciation_vi: "pa-ta-MU shta", pronunciation_en: "pa-ta-MOO shto" },
      { word: "поэтому", romanization: "poetomu", en: "therefore / so", vi: "vì vậy", pos: "conjunction", pronunciation_vi: "pa-E-ta-mu", pronunciation_en: "pa-EH-ta-moo" },
      { word: "сначала", romanization: "snachala", en: "first / at first", vi: "trước tiên", pos: "adverb", pronunciation_vi: "sna-CHA-la", pronunciation_en: "sna-CHAH-la" },
      { word: "если", romanization: "esli", en: "if", vi: "nếu", pos: "conjunction", pronunciation_vi: "YE-sli", pronunciation_en: "YES-lee" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn liên từ hợp lý.",
        instruction_en: "Choose the logical connector.",
        items: [
          { prompt: "Я был занят, ___ не позвонил. (потому что / поэтому)", answer: "поэтому" },
          { prompt: "Я учу русский, ___ работаю в России. (потому что / поэтому)", answer: "потому что" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [{ prompt: "Nếu có thời gian, tôi sẽ nghỉ.", answer: "Если будет время, я отдохну." }],
      },
    ],
    cultural_notes_vi:
      "Người học Việt hay nói từng câu rời. Bước A2 quan trọng là dùng liên từ để câu chuyện liền mạch, giống cách kể tự nhiên.",
    cultural_notes_en:
      "Vietnamese learners often speak in separate sentences. The key A2 step is using connectors so the story flows naturally.",
    tip_advice_vi: "Mỗi ngày viết một đoạn 4 câu có ít nhất 2 liên từ: и, потому что, поэтому, потом.",
    tip_advice_en: "Each day write a 4-sentence paragraph with at least 2 connectors: и, потому что, поэтому, потом.",
  },
];

export default lessons;
