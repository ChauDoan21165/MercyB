// src/languages/swahili/lessons-c1.ts
//
// Swahili (Kiswahili) C1 advanced lessons for Vietnamese learners.
// Adapted from A5-authored C1 room JSONs (swahili_c1_c101–c114).
//
// C1 topics: complex sentence building, verb extensions mastery,
// relative clauses, proverbs & idioms, register switching, advanced
// noun class agreement, narrative storytelling, abstract concepts,
// persuasive argumentation, professional/business Swahili, literary
// and poetic language, conditional/hypothetical speech, cultural
// communication nuances, and precision opinion expression.
//
// Each lesson carries bilingual Vietnamese + English pedagogy with
// Swahili target sentences, vocabulary, cultural notes, and exercises.

import type { SwahiliLesson } from "./lessons";

const lessons: SwahiliLesson[] = [

  // ─────────────────────────────────────────── complex_sentences (c101)
  {
    id: "swahili_c1_complex_sentences",
    level: "C1",
    category: "complex_sentences",
    title_vi: "Xây dựng câu phức trong tiếng Swahili",
    title_en: "Advanced Swahili sentence building",
    intro_vi:
      "Học cách xây dựng câu Swahili phức tạp với nhiều mệnh đề — dùng liên từ để nối ý, lồng mệnh đề phụ, và duy trì hòa hợp danh từ xuyên suốt câu dài. Các mẫu cấu trúc này giúp tiếng Swahili của bạn nghe tự nhiên và tinh tế ở trình độ nâng cao.",
    intro_en:
      "Learn to build complex Swahili sentences with multiple clauses — connecting ideas with conjunctions, embedding subordinate clauses, and maintaining correct noun class agreement across long sentences. These structural patterns make your Swahili sound natural and sophisticated at an advanced level.",
    sentences: [
      {
        sw: "Nilikwenda sokoni na nilinunua matunda.",
        en: "I went to the market and I bought fruit.",
        vi: "Tôi đã đi chợ và tôi đã mua trái cây.",
        pronunciation_focus: [
          "ni-li-KWEN-da = tôi đã đi (quá khứ -li-)",
          "so-KO-ni = ở chợ (lớp 9/10 + hậu tố -ni)",
          "NA = và (liên từ nối hai mệnh đề)",
          "ni-li-NU-nu-a = tôi đã mua",
        ],
        pronunciation_focus_en: [
          "nilikwenda = I went (past -li-)",
          "sokoni = at the market (class 9/10 + locative -ni)",
          "na = and (conjunction linking two clauses)",
          "nilinunua = I bought",
        ],
      },
      {
        sw: "Alijaribu kufika mapema lakini basi lilichelewa.",
        en: "He tried to arrive early but the bus was late.",
        vi: "Anh ấy đã cố đến sớm nhưng xe buýt bị trễ.",
        pronunciation_focus: [
          "a-li-ja-RI-bu = anh ấy đã cố (quá khứ -li-)",
          "ku-FI-ka = đến (nguyên mẫu, đối tượng của 'cố')",
          "la-KI-ni = nhưng (liên từ tương phản)",
          "li-li-che-LE-wa = nó bị trễ (lớp 5, quá khứ + bị động)",
        ],
        pronunciation_focus_en: [
          "alijaribu = he tried (past -li-)",
          "kufika = to arrive (infinitive)",
          "lakini = but (contrast conjunction)",
          "lilichelewa = it was late (class 5, past + stative)",
        ],
      },
      {
        sw: "Ninaamini kwamba elimu ni muhimu.",
        en: "I believe that education is important.",
        vi: "Tôi tin rằng giáo dục là quan trọng.",
        pronunciation_focus: [
          "ni-na-A-mi-ni = tôi tin (hiện tại -na-)",
          "KWA-mba = rằng (liên từ mệnh đề phụ)",
          "e-LI-mu = giáo dục (lớp 9, từ mượn Ả Rập)",
          "mu-HI-mu = quan trọng",
        ],
        pronunciation_focus_en: [
          "ninaamini = I believe (present -na-)",
          "kwamba = that (subordinating conjunction)",
          "elimu = education (class 9, Arabic loanword)",
          "muhimu = important",
        ],
      },
      {
        sw: "Tulipika chakula, kisha tukala pamoja.",
        en: "We cooked food, then we ate together.",
        vi: "Chúng tôi nấu đồ ăn, rồi cùng ăn với nhau.",
        pronunciation_focus: [
          "tu-li-PI-ka = chúng tôi đã nấu (quá khứ -li-)",
          "KI-sha = rồi thì (liên từ chỉ trình tự)",
          "tu-KA-la = chúng tôi ăn (thì -ka- kể chuyện)",
          "pa-MO-ja = cùng nhau",
        ],
        pronunciation_focus_en: [
          "tulipika = we cooked (past -li-)",
          "kisha = then (sequence conjunction)",
          "tukala = we ate (-ka- narrative tense)",
          "pamoja = together",
        ],
      },
      {
        sw: "Ninasoma kwa bidii ili nifaulu mtihani.",
        en: "I study hard so that I pass the exam.",
        vi: "Tôi học chăm để thi đậu.",
        pronunciation_focus: [
          "ni-na-SO-ma = tôi học / tôi đọc (hiện tại -na-)",
          "kwa bi-DI-i = chăm chỉ (nghĩa đen: bằng nỗ lực)",
          "I-li = để mà (liên từ chỉ mục đích)",
          "ni-FA-u-lu = tôi đậu (giả định -e)",
        ],
        pronunciation_focus_en: [
          "ninasoma = I study / I read (present -na-)",
          "kwa bidii = diligently (lit: with effort)",
          "ili = so that (purpose conjunction)",
          "nifaulu = I pass (subjunctive -e)",
        ],
      },
      {
        sw: "Ingawa mvua ilinyesha, tuliendelea na safari.",
        en: "Although it rained, we continued with the journey.",
        vi: "Mặc dù trời mưa, chúng tôi vẫn tiếp tục chuyến đi.",
        pronunciation_focus: [
          "i-NGA-wa = mặc dù (liên từ tương phản)",
          "MVU-a = mưa (lớp 9/10)",
          "i-li-NYE-sha = trời đã mưa (quá khứ -li-)",
          "tu-li-en-de-LE-a = chúng tôi tiếp tục (quá khứ + applicative)",
        ],
        pronunciation_focus_en: [
          "ingawa = although (contrast conjunction)",
          "mvua = rain (class 9/10)",
          "ilinyesha = it rained (past -li-)",
          "tuliendelea = we continued (past + applicative)",
        ],
      },
    ],
    cultural_notes_vi:
      "Tiếng Swahili dùng liên từ rất linh hoạt để tạo câu phức. Na (và), lakini (nhưng), au (hoặc) nối hai mệnh đề độc lập. " +
      "Kwamba (rằng) và kwa sababu (bởi vì) lồng mệnh đề phụ. Kisha và halafu (rồi, sau đó) thường đi với thì -ka- để kể chuỗi hành động. " +
      "Ili (để mà) yêu cầu động từ theo sau ở dạng giả định (tận cùng -e). Người Tanzania đánh giá cao cách nói có cấu trúc, mạch lạc trong giao tiếp trang trọng.",
    cultural_notes_en:
      "Swahili uses conjunctions flexibly to build complex sentences. Na (and), lakini (but), au (or) join two independent clauses. " +
      "Kwamba (that) and kwa sababu (because) embed subordinate clauses. Kisha and halafu (then) often pair with the -ka- tense for narrative sequence. " +
      "Ili (so that) requires the following verb in the subjunctive (ending in -e). Tanzanians value structured, coherent speech in formal communication.",
    tip_advice_vi:
      "Luyện mỗi ngày: lấy hai câu đơn và nối bằng na, lakini, kwa sababu, halafu, hoặc ili. " +
      "Khi dùng ili, luôn kiểm tra động từ sau nó có tận cùng -e không: ili nifaulu (đúng), ili nitafaulu (sai). " +
      "Với kisha/halafu, tập dùng -ka- ở động từ thứ hai: Tulipika, kisha tukala.",
    tip_advice_en:
      "Daily practice: take two simple sentences and join them with na, lakini, kwa sababu, halafu, or ili. " +
      "When using ili, always check that the following verb ends in -e: ili nifaulu (correct), ili nitafaulu (wrong). " +
      "With kisha/halafu, practice using -ka- on the second verb: Tulipika, kisha tukala.",
    vocabulary: [
      { word: "na", en: "and", vi: "và", pos: "conjunction", pronunciation_vi: "NA", pronunciation_en: "nah" },
      { word: "lakini", en: "but", vi: "nhưng", pos: "conjunction", pronunciation_vi: "la-KI-ni", pronunciation_en: "lah-KEE-nee" },
      { word: "kwamba", en: "that (subordinator)", vi: "rằng", pos: "conjunction", pronunciation_vi: "KWA-mba", pronunciation_en: "KWAHM-bah" },
      { word: "kisha", en: "then / afterwards", vi: "rồi thì", pos: "conjunction", pronunciation_vi: "KI-sha", pronunciation_en: "KEE-shah" },
      { word: "ili", en: "so that / in order to", vi: "để mà", pos: "conjunction", pronunciation_vi: "I-li", pronunciation_en: "EE-lee" },
      { word: "ingawa", en: "although / even though", vi: "mặc dù", pos: "conjunction", pronunciation_vi: "i-NGA-wa", pronunciation_en: "ee-NGAH-wah" },
      { word: "kwa sababu", en: "because", vi: "bởi vì", pos: "conjunction phrase", pronunciation_vi: "kwa sa-BA-bu", pronunciation_en: "kwah sah-BAH-boo" },
      { word: "kwa hivyo", en: "therefore", vi: "vì vậy", pos: "conjunction phrase", pronunciation_vi: "kwa HI-vyo", pronunciation_en: "kwah HEE-vyoh" },
    ],
    exercises: [
      {
        type: "fill_blank",
        question: "Nilikwenda sokoni ____ nilinunua matunda.",
        answer: "na",
        hint_vi: "và",
        hint_en: "and",
      },
      {
        type: "translation",
        vietnamese: "Tôi học chăm để thi đậu.",
        english: "I study hard so that I pass the exam.",
        swahili: "Ninasoma kwa bidii ili nifaulu mtihani.",
      },
    ],
  },

  // ──────────────────────────────────────── verb_extensions (c102)
  {
    id: "swahili_c1_verb_extensions",
    level: "C1",
    category: "verb_extensions",
    title_vi: "Làm chủ các dạng mở rộng động từ trong tiếng Swahili",
    title_en: "Mastering verb extensions in Swahili",
    intro_vi:
      "Khám phá hệ thống mở rộng động từ phong phú trong tiếng Swahili — dạng ứng dụng (-i-/-e-), sai khiến (-sh-/-z-), bị động (-w-/-liw-), hỗ tương (-an-), và trạng thái (-ik-). Học cách thêm một tiếp tố duy nhất có thể biến đổi ý nghĩa, và cách kết hợp nhiều đuôi mở rộng trong cùng một động từ.",
    intro_en:
      "Explore the rich system of verb extensions in Swahili — applicative (-i-/-e-), causative (-sh-/-z-), passive (-w-/-liw-), reciprocal (-an-), and stative (-ik-). Learn how adding a single infix can transform meaning and how to combine multiple extensions in one verb.",
    sentences: [
      {
        sw: "Ninapikia watoto chakula.",
        en: "I cook food for the children.",
        vi: "Tôi nấu đồ ăn cho bọn trẻ.",
        pronunciation_focus: [
          "ni-na-PI-ki-a = tôi nấu cho (applicative -i-)",
          "wa-TO-to = bọn trẻ (lớp 2, số nhiều của mtoto)",
          "cha-KU-la = đồ ăn (lớp 7)",
        ],
        pronunciation_focus_en: [
          "ninapikia = I cook for (applicative -i-)",
          "watoto = children (class 2, plural of mtoto)",
          "chakula = food (class 7)",
        ],
      },
      {
        sw: "Walimu wanafundisha wanafunzi shuleni.",
        en: "Teachers teach students at school.",
        vi: "Thầy cô dạy học sinh ở trường.",
        pronunciation_focus: [
          "wa-LI-mu = thầy cô (lớp 2, từ mượn Ả Rập)",
          "wa-na-FUN-di-sha = họ dạy (causative -sh-: khiến học)",
          "wa-na-FUN-zi = học sinh (lớp 2)",
          "shu-LE-ni = ở trường (lớp 9 + hậu tố -ni)",
        ],
        pronunciation_focus_en: [
          "walimu = teachers (class 2, Arabic loanword)",
          "wanafundisha = they teach (causative -sh-: cause to learn)",
          "wanafunzi = students (class 2)",
          "shuleni = at school (class 9 + locative -ni)",
        ],
      },
      {
        sw: "Somo linafundishwa na mwalimu.",
        en: "The lesson is taught by the teacher.",
        vi: "Bài học được dạy bởi thầy giáo.",
        pronunciation_focus: [
          "SO-mo = bài học (lớp 5)",
          "li-na-fun-DI-shwa = nó được dạy (bị động -w- sau causative)",
          "na mwa-LI-mu = bởi thầy giáo (na = by)",
        ],
        pronunciation_focus_en: [
          "somo = lesson (class 5)",
          "linafundishwa = it is taught (passive -w- after causative)",
          "na mwalimu = by the teacher (na = by)",
        ],
      },
      {
        sw: "Wanafunzi wanasaidiana darasani.",
        en: "The students help each other in class.",
        vi: "Học sinh giúp đỡ lẫn nhau trong lớp.",
        pronunciation_focus: [
          "wa-na-sa-i-di-A-na = họ giúp nhau (reciprocal -an-)",
          "da-ra-SA-ni = trong lớp học (lớp 9 + hậu tố -ni)",
        ],
        pronunciation_focus_en: [
          "wanasaidiana = they help each other (reciprocal -an-)",
          "darasani = in the classroom (class 9 + locative -ni)",
        ],
      },
      {
        sw: "Mlango unafunguka polepole.",
        en: "The door is opening slowly.",
        vi: "Cánh cửa đang mở từ từ.",
        pronunciation_focus: [
          "MLA-ngo = cánh cửa (lớp 3)",
          "u-na-fun-GU-ka = nó đang mở ra (stative -uk-: tự mở)",
          "po-le-PO-le = từ từ, chậm rãi",
        ],
        pronunciation_focus_en: [
          "mlango = door (class 3)",
          "unafunguka = it is opening (stative -uk-: opens by itself)",
          "polepole = slowly",
        ],
      },
      {
        sw: "Alifundishiana na mwenzake.",
        en: "He taught together with his colleague.",
        vi: "Anh ấy đã dạy cùng với đồng nghiệp.",
        pronunciation_focus: [
          "a-li-fun-di-shi-A-na = anh ấy dạy cùng nhau (causative + applicative + reciprocal)",
          "na mwe-NZA-ke = với đồng nghiệp của anh ấy",
        ],
        pronunciation_focus_en: [
          "alifundishiana = he taught together (causative + applicative + reciprocal)",
          "na mwenzake = with his colleague",
        ],
      },
    ],
    cultural_notes_vi:
      "Đuôi mở rộng động từ (vinyambuo) là một trong những đặc điểm đặc trưng nhất của ngữ pháp Bantu. " +
      "Người Swahili bản xứ dùng các đuôi này một cách tự nhiên trong mọi cuộc trò chuyện — việc làm chủ chúng phân biệt người học nâng cao với người trung cấp. " +
      "Đặc biệt, dạng applicative rất phổ biến trong giao tiếp hàng ngày để chỉ người hưởng lợi từ hành động.",
    cultural_notes_en:
      "Verb extensions (vinyambuo) are one of the most characteristic features of Bantu grammar. " +
      "Native Swahili speakers use these extensions naturally in all conversations — mastering them separates advanced learners from intermediate ones. " +
      "The applicative form is especially common in daily communication to indicate who benefits from an action.",
    tip_advice_vi:
      "Lấy một động từ gốc và áp dụng lần lượt từng đuôi mở rộng. Ví dụ với gốc -som- (đọc/học): soma (đọc), somea (đọc cho ai), somesha (dạy = khiến đọc), somwa (được đọc), somana (học cùng nhau), someka (có thể đọc được). " +
      "Tập nhận diện đuôi mở rộng khi nghe để đoán nghĩa.",
    tip_advice_en:
      "Take one root verb and apply each extension in sequence. Example with root -som- (read/study): soma (read), somea (read to/for), somesha (teach = cause to learn), somwa (be read), somana (study together), someka (be readable). " +
      "Practice identifying extensions when listening to infer meaning.",
    vocabulary: [
      { word: "kupikia", en: "to cook for", vi: "nấu cho", pos: "verb (applicative)", pronunciation_vi: "ku-PI-ki-a", pronunciation_en: "koo-PEE-kee-ah" },
      { word: "kufundisha", en: "to teach", vi: "dạy", pos: "verb (causative)", pronunciation_vi: "ku-fun-DI-sha", pronunciation_en: "koo-foon-DEE-shah" },
      { word: "kusaidiana", en: "to help each other", vi: "giúp đỡ lẫn nhau", pos: "verb (reciprocal)", pronunciation_vi: "ku-sa-i-di-A-na", pronunciation_en: "koo-sah-ee-dee-AH-nah" },
      { word: "kufunguka", en: "to open (by itself)", vi: "tự mở", pos: "verb (stative)", pronunciation_vi: "ku-fun-GU-ka", pronunciation_en: "koo-foon-GOO-kah" },
      { word: "kufungwa", en: "to be closed", vi: "bị đóng", pos: "verb (passive)", pronunciation_vi: "ku-FU-ngwa", pronunciation_en: "koo-FOO-ngwah" },
      { word: "vinyambuo", en: "verb extensions", vi: "đuôi mở rộng động từ", pos: "noun (class 8)", pronunciation_vi: "vi-nya-MBU-o", pronunciation_en: "vee-nyahm-BOO-oh" },
    ],
    exercises: [
      {
        type: "fill_blank",
        question: "Walimu wana____ wanafunzi shuleni. (fundisha = dạy)",
        answer: "fundisha",
        hint_vi: "dạng causative của -fund- (học)",
        hint_en: "causative form of -fund- (learn)",
      },
      {
        type: "translation",
        vietnamese: "Học sinh giúp đỡ lẫn nhau trong lớp.",
        english: "The students help each other in class.",
        swahili: "Wanafunzi wanasaidiana darasani.",
      },
    ],
  },

  // ───────────────────────────────────── relative_clauses (c103)
  {
    id: "swahili_c1_relative_clauses",
    level: "C1",
    category: "relative_clauses",
    title_vi: "Mệnh đề quan hệ chuyên sâu trong tiếng Swahili",
    title_en: "Relative clauses in depth",
    intro_vi:
      "Học hai cách chính để tạo mệnh đề quan hệ trong tiếng Swahili — phương pháp amba- tường minh và phương pháp tiếp tố gọn nhẹ. Làm chủ cách khớp dấu hiệu quan hệ với đúng lớp danh từ, và biết khi nào chọn amba- hay tiếp tố tùy theo ngữ cảnh trang trọng hay thân mật.",
    intro_en:
      "Learn the two main ways to form relative clauses in Swahili — the explicit amba- method and the compact infix method. Master matching the relative marker to the correct noun class, and know when to choose amba- vs infix depending on formal or informal context.",
    sentences: [
      {
        sw: "Mtu ambaye anaimba ni dada yangu.",
        en: "The person who is singing is my sister.",
        vi: "Người đang hát là chị tôi.",
        pronunciation_focus: [
          "MTU = người (lớp 1)",
          "a-MBA-ye = người mà (amba- lớp 1)",
          "a-na-I-mba = anh ấy/cô ấy đang hát",
          "DA-da YA-ngu = chị tôi",
        ],
        pronunciation_focus_en: [
          "mtu = person (class 1)",
          "ambaye = who (amba- class 1)",
          "anaimba = he/she is singing",
          "dada yangu = my sister",
        ],
      },
      {
        sw: "Mtoto anayecheza ni wangu.",
        en: "The child who is playing is mine.",
        vi: "Đứa trẻ đang chơi là của tôi.",
        pronunciation_focus: [
          "MTO-to = đứa trẻ (lớp 1)",
          "a-NA-ye-che-za = người đang chơi (tiếp tố -ye- lớp 1)",
          "WA-ngu = của tôi",
        ],
        pronunciation_focus_en: [
          "mtoto = child (class 1)",
          "anayecheza = who is playing (infix -ye- class 1)",
          "wangu = mine",
        ],
      },
      {
        sw: "Kitabu nilichokisoma kinazungumzia historia.",
        en: "The book that I read discusses history.",
        vi: "Quyển sách tôi đã đọc bàn về lịch sử.",
        pronunciation_focus: [
          "ki-TA-bu = quyển sách (lớp 7)",
          "ni-li-cho-KI-so-ma = mà tôi đã đọc (tiếp tố -cho- + tân ngữ -ki-)",
          "ki-na-zu-ngu-MZI-a = nó bàn về (applicative)",
          "his-TO-ri-a = lịch sử",
        ],
        pronunciation_focus_en: [
          "kitabu = book (class 7)",
          "nilichokisoma = that I read (infix -cho- + object -ki-)",
          "kinazungumzia = it discusses (applicative)",
          "historia = history",
        ],
      },
      {
        sw: "Chakula ninachokipenda ni wali.",
        en: "The food that I like is rice.",
        vi: "Món tôi thích là cơm.",
        pronunciation_focus: [
          "cha-KU-la = đồ ăn (lớp 7)",
          "ni-NA-cho-ki-PEN-da = mà tôi thích (tiếp tố -cho- + tân ngữ -ki-)",
          "WA-li = cơm (lớp 11)",
        ],
        pronunciation_focus_en: [
          "chakula = food (class 7)",
          "ninachokipenda = that I like (infix -cho- + object -ki-)",
          "wali = rice (class 11)",
        ],
      },
      {
        sw: "Watu wanaokaa hapa wanapenda muziki.",
        en: "The people who live here like music.",
        vi: "Những người sống ở đây thích âm nhạc.",
        pronunciation_focus: [
          "WA-tu = những người (lớp 2)",
          "wa-NA-o-ka-a = những người sống (tiếp tố -o- lớp 2)",
          "HA-pa = ở đây",
          "mu-ZI-ki = âm nhạc",
        ],
        pronunciation_focus_en: [
          "watu = people (class 2)",
          "wanaokaa = who live (infix -o- class 2)",
          "hapa = here",
          "muziki = music",
        ],
      },
      {
        sw: "Mwanafunzi aliyepata alama za juu atazawadiwa.",
        en: "The student who got high marks will be rewarded.",
        vi: "Học sinh đạt điểm cao sẽ được thưởng.",
        pronunciation_focus: [
          "mwa-na-FUN-zi = học sinh (lớp 1)",
          "a-li-YE-pa-ta = người đã đạt (tiếp tố -ye- + quá khứ)",
          "a-LA-ma za JU-u = điểm cao",
          "a-ta-za-wa-DI-wa = sẽ được thưởng (tương lai + bị động)",
        ],
        pronunciation_focus_en: [
          "mwanafunzi = student (class 1)",
          "aliyepata = who got (infix -ye- + past)",
          "alama za juu = high marks",
          "atazawadiwa = will be rewarded (future + passive)",
        ],
      },
    ],
    cultural_notes_vi:
      "Người Swahili bản xứ dùng cả hai phương pháp một cách tự nhiên. Amba- nghe có chủ ý và trang trọng hơn, phù hợp với văn viết và diễn thuyết. " +
      "Tiếp tố nghe gọn và tự nhiên hơn, phổ biến trong hội thoại hàng ngày. Việc chọn đúng phương pháp theo ngữ cảnh là dấu hiệu của người nói thành thạo.",
    cultural_notes_en:
      "Native Swahili speakers use both methods naturally. Amba- sounds deliberate and formal, suitable for writing and public speaking. " +
      "The infix sounds compact and natural, common in everyday conversation. Choosing the right method for context marks a proficient speaker.",
    tip_advice_vi:
      "Luyện mỗi ngày: chọn một danh từ và tạo ba câu quan hệ — một với amba-, một với tiếp tố, một hỏi đáp. " +
      "Học thuộc bảng tiếp tố quan hệ theo lớp danh từ: -ye- (l.1), -o- (l.2/3), -yo- (l.4/6/9), -lo- (l.5), -cho- (l.7), -vyo- (l.8), -zo- (l.10).",
    tip_advice_en:
      "Daily practice: pick a noun and make three relative sentences — one with amba-, one with infix, one as Q&A. " +
      "Memorise the relative infix table by noun class: -ye- (cl.1), -o- (cl.2/3), -yo- (cl.4/6/9), -lo- (cl.5), -cho- (cl.7), -vyo- (cl.8), -zo- (cl.10).",
    vocabulary: [
      { word: "ambaye", en: "who (class 1)", vi: "người mà (lớp 1)", pos: "relative pronoun", pronunciation_vi: "a-MBA-ye", pronunciation_en: "ahm-BAH-yeh" },
      { word: "ambavyo", en: "which (class 8)", vi: "những cái mà (lớp 8)", pos: "relative pronoun", pronunciation_vi: "a-MBA-vyo", pronunciation_en: "ahm-BAH-vyoh" },
      { word: "anaye", en: "who (infix, class 1)", vi: "người (tiếp tố l.1)", pos: "relative infix", pronunciation_vi: "a-NA-ye", pronunciation_en: "ah-NAH-yeh" },
      { word: "kinacho", en: "which (infix, class 7)", vi: "cái mà (tiếp tố l.7)", pos: "relative infix", pronunciation_vi: "ki-NA-cho", pronunciation_en: "kee-NAH-choh" },
      { word: "nilichokisoma", en: "that I read", vi: "mà tôi đã đọc", pos: "verb + relative + object", pronunciation_vi: "ni-li-cho-ki-SO-ma", pronunciation_en: "nee-lee-choh-kee-SOH-mah" },
      { word: "historia", en: "history", vi: "lịch sử", pos: "noun (class 9)", pronunciation_vi: "his-TO-ri-a", pronunciation_en: "hees-TOH-ree-ah" },
    ],
    exercises: [
      {
        type: "fill_blank",
        question: "Mtu ____ anaimba ni dada yangu.",
        answer: "ambaye",
        hint_vi: "người mà (đại từ quan hệ lớp 1)",
        hint_en: "who (class 1 relative pronoun)",
      },
      {
        type: "translation",
        vietnamese: "Quyển sách tôi đã đọc bàn về lịch sử.",
        english: "The book that I read discusses history.",
        swahili: "Kitabu nilichokisoma kinazungumzia historia.",
      },
    ],
  },

  // ───────────────────────────────────── idioms_proverbs (c104)
  {
    id: "swahili_c1_proverbs",
    level: "C1",
    category: "idioms_proverbs",
    title_vi: "Tục ngữ và thành ngữ Swahili (methali)",
    title_en: "Swahili proverbs and wisdom sayings",
    intro_vi:
      "Khám phá thế giới phong phú của tục ngữ Swahili (methali) và thành ngữ. Tục ngữ là trung tâm của văn hóa Swahili, được dùng hàng ngày trong hội thoại, diễn thuyết, và văn viết. Học chúng sẽ làm sâu sắc thêm hiểu biết văn hóa của bạn và khiến tiếng Swahili của bạn nghe khôn ngoan và gắn kết với truyền thống Đông Phi.",
    intro_en:
      "Explore the rich world of Swahili proverbs (methali) and idiomatic expressions. Proverbs are central to Swahili culture — used daily in conversations, speeches, and writing. Learning them deepens your cultural understanding and makes your Swahili sound wise and connected to East African tradition.",
    sentences: [
      {
        sw: "Haraka haraka haina baraka.",
        en: "Hurry hurry has no blessing. (Haste makes waste.)",
        vi: "Vội vã không có phước. (Dục tốc bất đạt.)",
        pronunciation_focus: [
          "ha-RA-ka ha-RA-ka = vội vội vàng vàng",
          "ha-I-na = nó không có",
          "ba-RA-ka = phước lành (từ mượn Ả Rập)",
        ],
        pronunciation_focus_en: [
          "haraka haraka = hurry hurry",
          "haina = it does not have",
          "baraka = blessing (Arabic loanword)",
        ],
      },
      {
        sw: "Polepole ndiyo mwendo.",
        en: "Slowly is indeed the way. (Slow and steady wins.)",
        vi: "Chậm rãi mới đúng là cách đi.",
        pronunciation_focus: [
          "po-le-PO-le = chậm rãi, từ từ",
          "NDI-yo = chính là (nhấn mạnh)",
          "MWEN-do = cách đi, tốc độ (lớp 3)",
        ],
        pronunciation_focus_en: [
          "polepole = slowly",
          "ndiyo = indeed / that is",
          "mwendo = pace / way (class 3)",
        ],
      },
      {
        sw: "Umoja ni nguvu, utengano ni udhaifu.",
        en: "Unity is strength, division is weakness.",
        vi: "Đoàn kết là sức mạnh, chia rẽ là yếu đuối.",
        pronunciation_focus: [
          "u-MO-ja = đoàn kết (lớp 14, danh từ trừu tượng)",
          "NGU-vu = sức mạnh (lớp 9/10)",
          "u-te-NGA-no = chia rẽ (lớp 14)",
          "u-dha-I-fu = yếu đuối (lớp 14, từ mượn Ả Rập)",
        ],
        pronunciation_focus_en: [
          "umoja = unity (class 14 abstract noun)",
          "nguvu = strength (class 9/10)",
          "utengano = division (class 14)",
          "udhaifu = weakness (class 14, Arabic loanword)",
        ],
      },
      {
        sw: "Mvumilivu hula mbivu.",
        en: "The patient one eats ripe fruit. (Patience brings rewards.)",
        vi: "Người kiên nhẫn ăn quả chín.",
        pronunciation_focus: [
          "mvu-mi-LI-vu = người kiên nhẫn (lớp 1)",
          "HU-la = thường ăn (thói quen, thì -hu-)",
          "MBI-vu = quả chín (lớp 9/10)",
        ],
        pronunciation_focus_en: [
          "mvumilivu = patient person (class 1)",
          "hula = habitually eats (habitual -hu-)",
          "mbivu = ripe (class 9/10)",
        ],
      },
      {
        sw: "Kidole kimoja hakivunji chawa.",
        en: "One finger does not crush a louse. (You need others.)",
        vi: "Một ngón tay không bóp chết được con rận.",
        pronunciation_focus: [
          "ki-DO-le = ngón tay (lớp 7)",
          "ki-MO-ja = một (lớp 7)",
          "ha-ki-VU-nji = nó không bóp vỡ (phủ định)",
          "CHA-wa = con rận (lớp 7/8)",
        ],
        pronunciation_focus_en: [
          "kidole = finger (class 7)",
          "kimoja = one (class 7)",
          "hakivunji = it does not crush (negative)",
          "chawa = louse (class 7/8)",
        ],
      },
      {
        sw: "Maneno matamu humtoa nyoka pangoni.",
        en: "Sweet words draw the snake out of its hole.",
        vi: "Lời ngọt lôi được rắn ra khỏi hang.",
        pronunciation_focus: [
          "ma-NE-no ma-TA-mu = lời ngọt (lớp 6)",
          "hu-MTO-a = thường lôi ra (thói quen, applicative)",
          "NYO-ka = rắn (lớp 9/10)",
          "pa-NGO-ni = trong hang (lớp 5 + hậu tố -ni)",
        ],
        pronunciation_focus_en: [
          "maneno matamu = sweet words (class 6)",
          "humtoa = habitually draws out (habitual + applicative)",
          "nyoka = snake (class 9/10)",
          "pangoni = in the cave/hole (class 5 + locative -ni)",
        ],
      },
    ],
    cultural_notes_vi:
      "Tục ngữ (methali) là xương sống của giao tiếp khôn ngoan trong văn hóa Swahili. Người Đông Phi đan tục ngữ vào hội thoại một cách tự nhiên — " +
      "nêu tục ngữ, rồi liên kết với tình huống hiện tại. Trẻ em học tục ngữ từ nhỏ qua lời kể của ông bà. Sử dụng tục ngữ đúng lúc được xem là dấu hiệu của sự trưởng thành và khôn ngoan.",
    cultural_notes_en:
      "Proverbs (methali) are the backbone of wise communication in Swahili culture. East Africans weave proverbs naturally into conversation — " +
      "state the proverb, then connect it to the current situation. Children learn proverbs from elders' storytelling. Using the right proverb at the right moment is seen as a mark of maturity and wisdom.",
    tip_advice_vi:
      "Mỗi ngày học một câu tục ngữ. Đọc to, viết một tình huống ngắn mà bạn có thể dùng nó. " +
      "Mẫu hay: nêu tục ngữ → giải thích nghĩa đen → giải thích nghĩa bóng → áp dụng vào tình huống thực tế.",
    tip_advice_en:
      "Learn one proverb per day. Speak it aloud, write a short situation where you could use it. " +
      "Good pattern: state proverb → explain literal meaning → explain figurative meaning → apply to a real situation.",
    vocabulary: [
      { word: "methali", en: "proverb", vi: "tục ngữ", pos: "noun (class 9/10)", pronunciation_vi: "me-THA-li", pronunciation_en: "meh-THAH-lee" },
      { word: "haraka", en: "hurry / speed", vi: "vội vã", pos: "noun (class 9)", pronunciation_vi: "ha-RA-ka", pronunciation_en: "hah-RAH-kah" },
      { word: "baraka", en: "blessing", vi: "phước lành", pos: "noun (class 9/10)", pronunciation_vi: "ba-RA-ka", pronunciation_en: "bah-RAH-kah" },
      { word: "umoja", en: "unity", vi: "đoàn kết", pos: "noun (class 14)", pronunciation_vi: "u-MO-ja", pronunciation_en: "oo-MOH-jah" },
      { word: "nguvu", en: "strength / power", vi: "sức mạnh", pos: "noun (class 9/10)", pronunciation_vi: "NGU-vu", pronunciation_en: "NGOO-voo" },
      { word: "mvumilivu", en: "patient person", vi: "người kiên nhẫn", pos: "noun (class 1)", pronunciation_vi: "mvu-mi-LI-vu", pronunciation_en: "mvoo-mee-LEE-voo" },
      { word: "subira", en: "patience", vi: "sự kiên nhẫn", pos: "noun (class 9)", pronunciation_vi: "su-BI-ra", pronunciation_en: "soo-BEE-rah" },
      { word: "hadithi", en: "story / tale", vi: "câu chuyện", pos: "noun (class 9/10)", pronunciation_vi: "ha-DI-thi", pronunciation_en: "hah-DEE-thee" },
    ],
    exercises: [
      {
        type: "fill_blank",
        question: "Haraka haraka ____ baraka.",
        answer: "haina",
        hint_vi: "không có",
        hint_en: "does not have",
      },
      {
        type: "matching",
        pairs: [
          { left: "Haraka haraka haina baraka", right: "Haste makes waste" },
          { left: "Umoja ni nguvu", right: "Unity is strength" },
          { left: "Mvumilivu hula mbivu", right: "Patience brings rewards" },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────── register (c105)
  {
    id: "swahili_c1_register",
    level: "C1",
    category: "register",
    title_vi: "Phong cách trang trọng và thân mật trong tiếng Swahili",
    title_en: "Formal and informal Swahili register",
    intro_vi:
      "Học cách chuyển đổi giữa phong cách trang trọng và thân mật trong tiếng Swahili. Nắm vững cách dùng kính ngữ Shikamoo, danh xưng trang trọng, tiếng lóng bạn bè, và nghệ thuật chuyển đổi linh hoạt giữa các phong cách tùy theo bối cảnh xã hội.",
    intro_en:
      "Learn to navigate between formal and informal Swahili registers. Master the Shikamoo respect greeting, formal titles, peer slang, and the art of fluidly shifting registers according to social context.",
    sentences: [
      {
        sw: "Shikamoo, mzee. — Marahaba, mwanangu.",
        en: "I greet you with respect, elder. — I accept your respect, my child.",
        vi: "Cháu kính chào bác. — Ta nhận, con ạ.",
        pronunciation_focus: ["shi-ka-MO-o = con ôm chân ngài", "MZE-e = người lớn tuổi", "ma-ra-HA-ba = ta nhận"],
        pronunciation_focus_en: ["Shikamoo = I hold your feet (respect)", "mzee = elder", "Marahaba = I accept your respect"],
      },
      {
        sw: "Bwana Mkurugenzi, nina ombi.",
        en: "Mr. Director, I have a request.",
        vi: "Thưa Ông Giám đốc, tôi có một thỉnh cầu.",
        pronunciation_focus: ["BWA-na = Ông/Ngài", "m-ku-ru-GEN-zi = giám đốc", "OM-bi = thỉnh cầu"],
        pronunciation_focus_en: ["Bwana = Mr./Sir", "Mkurugenzi = director", "ombi = request"],
      },
      {
        sw: "Mambo, vipi leo? — Poa, safi kabisa.",
        en: "What's up, how's today? — Cool, totally fine.",
        vi: "Có gì không, hôm nay sao? — Ngầu, ổn hết.",
        pronunciation_focus: ["MAM-bo = có chuyện gì?", "VI-pi = thế nào?", "PO-a = ngầu (slang)"],
        pronunciation_focus_en: ["Mambo = what's up?", "Vipi = how?", "Poa = cool (slang)"],
      },
      {
        sw: "Mheshimiwa Waziri, asante kwa wito wako.",
        en: "Honorable Minister, thank you for your invitation.",
        vi: "Kính thưa Bộ trưởng, cảm ơn lời mời của ngài.",
        pronunciation_focus: ["mhe-shi-MI-wa = Kính thưa", "wa-ZI-ri = bộ trưởng", "WI-to = lời mời"],
        pronunciation_focus_en: ["Mheshimiwa = Honorable", "Waziri = Minister", "wito = invitation"],
      },
      {
        sw: "Mpendwa, napenda kukujulisha kwamba tumepokea maombi yako.",
        en: "Dear, I wish to inform you that we have received your application.",
        vi: "Kính gửi, tôi muốn thông báo rằng chúng tôi đã nhận được đơn của quý vị.",
        pronunciation_focus: ["MPE-ndwa = Kính gửi", "ku-ku-ju-LI-sha = thông báo", "ma-OM-bi = đơn"],
        pronunciation_focus_en: ["Mpendwa = Dear (formal)", "kukujulisha = inform you", "maombi = application"],
      },
    ],
    cultural_notes_vi:
      "Kính ngữ Shikamoo là một trong những đặc điểm văn hóa quan trọng nhất của người Swahili, chỉ dùng khi chào người lớn tuổi hơn đáng kể. " +
      "Tuyệt đối không dùng Shikamoo với bạn cùng trang lứa. Trong môi trường chuyên nghiệp, luôn dùng danh xưng + họ, không gọi tên trống.",
    cultural_notes_en:
      "Shikamoo is one of the most important cultural markers in Swahili — only used when greeting significantly older people. " +
      "Never use it with peers. In professional settings, always use title + surname, never a bare first name.",
    tip_advice_vi:
      "Diễn đạt cùng một nội dung bằng ba phong cách: thân mật (bạn bè), lịch sự (đồng nghiệp), trang trọng (quan chức). " +
      "Ví dụ với 'Tôi cần giúp đỡ': 'Nisaidie jamani!' → 'Tafadhali naomba msaada' → 'Ninaomba msaada wako Mheshimiwa.'",
    tip_advice_en:
      "Express the same message in three registers: informal, polite, formal. " +
      "Example with 'I need help': 'Nisaidie jamani!' → 'Tafadhali naomba msaada' → 'Ninaomba msaada wako Mheshimiwa.'",
    vocabulary: [
      { word: "Shikamoo", en: "respect greeting (to elders)", vi: "lời chào kính trọng", pos: "greeting", pronunciation_vi: "shi-ka-MO-o", pronunciation_en: "shee-kah-MOH-oh" },
      { word: "Marahaba", en: "I accept your respect", vi: "ta nhận", pos: "response", pronunciation_vi: "ma-ra-HA-ba", pronunciation_en: "mah-rah-HAH-bah" },
      { word: "Bwana", en: "Mr./Sir", vi: "Ông/Ngài", pos: "title", pronunciation_vi: "BWA-na", pronunciation_en: "BWAH-nah" },
      { word: "Mheshimiwa", en: "Honorable", vi: "Kính thưa", pos: "title", pronunciation_vi: "mhe-shi-MI-wa", pronunciation_en: "mheh-shee-MEE-wah" },
      { word: "Mambo", en: "What's up?", vi: "Có gì không?", pos: "greeting (informal)", pronunciation_vi: "MAM-bo", pronunciation_en: "MAHM-boh" },
      { word: "Poa", en: "cool/fine (slang)", vi: "ngầu/ổn", pos: "slang", pronunciation_vi: "PO-a", pronunciation_en: "POH-ah" },
      { word: "ombi", en: "request", vi: "thỉnh cầu", pos: "noun (class 5/6)", pronunciation_vi: "OM-bi", pronunciation_en: "OHM-bee" },
      { word: "msaada", en: "help/assistance", vi: "sự giúp đỡ", pos: "noun (class 3)", pronunciation_vi: "msa-A-da", pronunciation_en: "msah-AH-dah" },
    ],
    exercises: [
      { type: "fill_blank", question: "____, mzee. — Marahaba, mwanangu.", answer: "Shikamoo", hint_vi: "lời chào kính trọng", hint_en: "respect greeting" },
      { type: "translation", vietnamese: "Kính thưa Bộ trưởng, cảm ơn lời mời của ngài.", english: "Honorable Minister, thank you for your invitation.", swahili: "Mheshimiwa Waziri, asante kwa wito wako." },
    ],
  },

  // ──────────────────────────────────────── noun_classes (c106)
  {
    id: "swahili_c1_noun_classes",
    level: "C1",
    category: "noun_classes",
    title_vi: "Hòa hợp lớp danh từ nâng cao",
    title_en: "Advanced noun class agreement",
    intro_vi:
      "Nâng cao khả năng làm chủ hòa hợp lớp danh từ trên mọi thành phần câu — tính từ, sở hữu, chỉ định từ, động từ, và tiếp tố tân ngữ. Hòa hợp hoàn hảo trong câu phức là điều phân biệt người nói nâng cao với người trung cấp.",
    intro_en:
      "Deepen your command of noun class agreement across all parts of speech — adjectives, possessives, demonstratives, verbs, and object infixes. Perfect agreement in complex sentences separates advanced from intermediate speakers.",
    sentences: [
      {
        sw: "Hiki kitabu kizuri ni changu, kile kikubwa ni chako.",
        en: "This good book is mine, that big one is yours.",
        vi: "Quyển sách hay này là của tôi, quyển to kia là của bạn.",
        pronunciation_focus: ["HI-ki = cái này (l.7)", "ki-ZU-ri = tốt (l.7)", "CHA-ngu = của tôi (l.7)", "KI-le = cái kia (l.7)"],
        pronunciation_focus_en: ["hiki = this (cl.7)", "kizuri = good (cl.7)", "changu = mine (cl.7)", "kile = that (cl.7)"],
      },
      {
        sw: "Watu wazuri wanaokaa hapa ni wangu.",
        en: "The good people who live here are mine.",
        vi: "Những người tốt sống ở đây là của tôi.",
        pronunciation_focus: ["WA-tu wa-ZU-ri = người tốt (l.2)", "wa-NA-o-ka-a = sống (l.2)", "WA-ngu = của tôi (l.2)"],
        pronunciation_focus_en: ["watu wazuri = good people (cl.2)", "wanaokaa = who live (cl.2)", "wangu = my (cl.2)"],
      },
      {
        sw: "Gari langu jipya lina rangi nyekundu.",
        en: "My new car has a red color.",
        vi: "Chiếc xe mới của tôi có màu đỏ.",
        pronunciation_focus: ["GA-ri LA-ngu = xe của tôi (l.5)", "JI-pya = mới (l.5)", "li-na = nó có (l.5)"],
        pronunciation_focus_en: ["gari langu = my car (cl.5)", "jipya = new (cl.5)", "lina = it has (cl.5)"],
      },
      {
        sw: "Miti mirefu iliyoanguka ilizuia barabara.",
        en: "The tall trees that fell blocked the road.",
        vi: "Những cây cao bị đổ đã chặn đường.",
        pronunciation_focus: ["MI-ti mi-RE-fu = cây cao (l.4)", "i-li-YO-a-ngu-ka = đã đổ (l.4)", "i-li-ZU-i-a = đã chặn (l.4)"],
        pronunciation_focus_en: ["miti mirefu = tall trees (cl.4)", "iliyoanguka = that fell (cl.4)", "ilizuia = they blocked (cl.4)"],
      },
      {
        sw: "Nilimwona mtoto na nilimpa zawadi.",
        en: "I saw the child and I gave him a gift.",
        vi: "Tôi đã thấy đứa trẻ và tôi đã tặng nó một món quà.",
        pronunciation_focus: ["ni-li-MWO-na = tôi thấy cậu ấy (tân ngữ -m-)", "ni-li-MPA = tôi cho cậu ấy (tân ngữ -m-)"],
        pronunciation_focus_en: ["nilimwona = I saw him (object -m-)", "nilimpa = I gave him (object -m-)"],
      },
    ],
    cultural_notes_vi:
      "Hòa hợp lớp danh từ (ngeli) là linh hồn của ngữ pháp Swahili. Người bản xứ nhận ra ngay lỗi hòa hợp — đặc biệt là lỗi sở hữu (dùng 'yangu' thay vì 'changu' cho lớp 7). " +
      "Làm chủ hòa hợp là điều phân biệt rõ nhất giữa người học nâng cao và trung cấp.",
    cultural_notes_en:
      "Noun class agreement (ngeli) is the soul of Swahili grammar. Native speakers instantly notice agreement errors — especially possessive errors (using 'yangu' instead of 'changu' for class 7). " +
      "Mastering agreement is the clearest divider between advanced and intermediate learners.",
    tip_advice_vi:
      "Xây chuỗi hòa hợp mỗi ngày: danh từ + tính từ + sở hữu + chỉ định từ + động từ. Học thuộc tiền tố sở hữu: w- (l.1,2,3), l- (l.5), ch- (l.7), y- (l.4,6,9), z- (l.10).",
    tip_advice_en:
      "Build a daily agreement chain: noun + adjective + possessive + demonstrative + verb. Memorise possessive prefixes: w- (cl.1,2,3), l- (cl.5), ch- (cl.7), y- (cl.4,6,9), z- (cl.10).",
    vocabulary: [
      { word: "ngeli", en: "noun class", vi: "lớp danh từ", pos: "noun (class 9/10)", pronunciation_vi: "NGE-li", pronunciation_en: "NGEH-lee" },
      { word: "kizuri", en: "good (class 7)", vi: "tốt/hay (l.7)", pos: "adjective", pronunciation_vi: "ki-ZU-ri", pronunciation_en: "kee-ZOO-ree" },
      { word: "changu", en: "my (class 7)", vi: "của tôi (l.7)", pos: "possessive", pronunciation_vi: "CHA-ngu", pronunciation_en: "CHAH-ngoo" },
      { word: "langu", en: "my (class 5)", vi: "của tôi (l.5)", pos: "possessive", pronunciation_vi: "LA-ngu", pronunciation_en: "LAH-ngoo" },
      { word: "yangu", en: "my (class 9)", vi: "của tôi (l.9)", pos: "possessive", pronunciation_vi: "YA-ngu", pronunciation_en: "YAH-ngoo" },
      { word: "jipya", en: "new (class 5)", vi: "mới (l.5)", pos: "adjective", pronunciation_vi: "JI-pya", pronunciation_en: "JEE-pyah" },
      { word: "mrefu", en: "tall/long (class 1)", vi: "cao/dài", pos: "adjective", pronunciation_vi: "MRE-fu", pronunciation_en: "MREH-foo" },
      { word: "zawadi", en: "gift", vi: "quà", pos: "noun (class 9/10)", pronunciation_vi: "za-WA-di", pronunciation_en: "zah-WAH-dee" },
    ],
    exercises: [
      { type: "fill_blank", question: "Hiki kitabu ni ____. (của tôi, lớp 7)", answer: "changu", hint_vi: "sở hữu lớp 7", hint_en: "possessive class 7" },
      { type: "translation", vietnamese: "Quyển sách hay này là của tôi, quyển to kia là của bạn.", english: "This good book is mine, that big one is yours.", swahili: "Hiki kitabu kizuri ni changu, kile kikubwa ni chako." },
    ],
  },

  // ────────────────────────────────────────── narrative (c107)
  {
    id: "swahili_c1_narrative",
    level: "C1",
    category: "narrative",
    title_vi: "Kể chuyện và tường thuật trong tiếng Swahili",
    title_en: "Narrative and storytelling in Swahili",
    intro_vi:
      "Học nghệ thuật kể chuyện trong tiếng Swahili — thì mở đầu -li-, thì -ka- liên tiếp, đối thoại trực tiếp, cao trào và kết thúc. Văn hóa Swahili rất coi trọng truyền miệng, và người kể chuyện hay được kính trọng.",
    intro_en:
      "Learn the art of storytelling in Swahili — the -li- opening tense, -ka- consecutive tense, direct speech, climax and resolution. Swahili culture deeply values oral tradition.",
    sentences: [
      {
        sw: "Hapo zamani za kale, palikuwa na mkulima maskini.",
        en: "Long long ago, there was a poor farmer.",
        vi: "Ngày xửa ngày xưa, có một người nông dân nghèo.",
        pronunciation_focus: ["HA-po za-MA-ni = ngày xưa", "pa-li-KU-wa = có (lớp 16)", "mku-LI-ma = nông dân"],
        pronunciation_focus_en: ["hapo zamani = long ago", "palikuwa = there was (class 16)", "mkulima = farmer"],
      },
      {
        sw: "Aliamka, akaoga, akavaa nguo, akakunywa chai, kisha akaenda shambani.",
        en: "He woke up, bathed, dressed, drank tea, then went to the farm.",
        vi: "Anh ấy thức dậy, tắm rửa, mặc quần áo, uống trà, rồi ra đồng.",
        pronunciation_focus: ["a-li-AM-ka = thức dậy (-li-)", "a-KA-o-ga = rồi tắm (-ka-)", "a-KA-va-a = rồi mặc", "a-KA-nywa = rồi uống"],
        pronunciation_focus_en: ["aliamka = woke (-li-)", "akaoga = then bathed (-ka-)", "akavaa = then dressed", "akakunywa = then drank"],
      },
      {
        sw: "Mke akauliza, 'Umeleta nini kutoka sokoni?' Mume akajibu, 'Nimeleta matunda na mboga.'",
        en: "The wife asked, 'What have you brought from the market?' The husband answered, 'I have brought fruit and vegetables.'",
        vi: "Vợ hỏi, 'Anh mang gì từ chợ về?' Chồng đáp, 'Anh mang trái cây và rau.'",
        pronunciation_focus: ["a-ka-u-LI-za = rồi hỏi", "u-ME-le-ta = bạn đã mang (-me-)", "a-ka-JI-bu = rồi trả lời"],
        pronunciation_focus_en: ["akauliza = then asked", "umeleta = you have brought (-me-)", "akajibu = then answered"],
      },
      {
        sw: "Ghafla, akasikia sauti kubwa. Hatimaye, walifika salama nyumbani.",
        en: "Suddenly, he heard a loud sound. Finally, they arrived safely home.",
        vi: "Bỗng nhiên, anh ta nghe một tiếng động lớn. Cuối cùng, họ đã về đến nhà an toàn.",
        pronunciation_focus: ["GHAF-la = bỗng nhiên", "a-ka-si-KI-a = rồi nghe", "ha-ti-MA-ye = cuối cùng", "sa-LA-ma = an toàn"],
        pronunciation_focus_en: ["ghafla = suddenly", "akasikia = then heard", "hatimaye = finally", "salama = safe"],
      },
      {
        sw: "Hadithi hii inatufundisha kwamba subira huvuta heri.",
        en: "This story teaches us that patience brings blessings.",
        vi: "Câu chuyện này dạy chúng ta rằng kiên nhẫn kéo phước về.",
        pronunciation_focus: ["ha-DI-thi = câu chuyện", "i-na-tu-FUN-di-sha = nó dạy chúng ta", "su-BI-ra = kiên nhẫn"],
        pronunciation_focus_en: ["hadithi = story", "inatufundisha = it teaches us", "subira = patience"],
      },
    ],
    cultural_notes_vi:
      "Kể chuyện (hadithi) là nghệ thuật được trân trọng trong văn hóa Swahili. Người lớn tuổi kể chuyện cho trẻ em vào buổi tối, truyền dạy giá trị đạo đức. " +
      "Thì -ka- là 'động cơ' của truyện kể — nó đưa câu chuyện tiến tới mà không cần lặp dấu hiệu thời gian.",
    cultural_notes_en:
      "Storytelling (hadithi) is a treasured art in Swahili culture. Elders tell stories to children at night, passing down moral values. " +
      "The -ka- tense is the engine of narrative — it moves the story forward without repeating time markers.",
    tip_advice_vi:
      "Mỗi ngày kể to một câu chuyện ngắn: (1) Bối cảnh (-li-), (2) 3-5 hành động (-ka-), (3) Cao trào, (4) Bài học.",
    tip_advice_en:
      "Tell one short story aloud each day: (1) Setting (-li-), (2) 3-5 actions (-ka-), (3) Climax, (4) Moral.",
    vocabulary: [
      { word: "hapo zamani", en: "long ago/once upon a time", vi: "ngày xửa ngày xưa", pos: "time phrase", pronunciation_vi: "HA-po za-MA-ni", pronunciation_en: "HAH-poh zah-MAH-nee" },
      { word: "ghafla", en: "suddenly", vi: "bỗng nhiên", pos: "adverb", pronunciation_vi: "GHAF-la", pronunciation_en: "GHAHF-lah" },
      { word: "hatimaye", en: "finally", vi: "cuối cùng", pos: "adverb", pronunciation_vi: "ha-ti-MA-ye", pronunciation_en: "hah-tee-MAH-yeh" },
      { word: "akasema", en: "he/she then said", vi: "rồi nói", pos: "verb (-ka-)", pronunciation_vi: "a-ka-SE-ma", pronunciation_en: "ah-kah-SEH-mah" },
      { word: "hadithi", en: "story/tale", vi: "câu chuyện", pos: "noun (class 9/10)", pronunciation_vi: "ha-DI-thi", pronunciation_en: "hah-DEE-thee" },
      { word: "salama", en: "safe/peaceful", vi: "an toàn/bình yên", pos: "adjective", pronunciation_vi: "sa-LA-ma", pronunciation_en: "sah-LAH-mah" },
    ],
    exercises: [
      { type: "fill_blank", question: "Hapo zamani za kale, ____ na mkulima maskini.", answer: "palikuwa", hint_vi: "có (quá khứ, lớp 16)", hint_en: "there was (past, class 16)" },
      { type: "translation", vietnamese: "Anh ấy thức dậy, tắm rửa, mặc quần áo, rồi ra đồng.", english: "He woke up, bathed, dressed, then went to the farm.", swahili: "Aliamka, akaoga, akavaa nguo, kisha akaenda shambani." },
    ],
  },

  // ──────────────────────────────────────────── academic (c108)
  {
    id: "swahili_c1_abstract_concepts",
    level: "C1",
    category: "academic",
    title_vi: "Diễn đạt khái niệm trừu tượng trong tiếng Swahili",
    title_en: "Expressing abstract concepts in Swahili",
    intro_vi:
      "Học cách diễn đạt ý tưởng trừu tượng — tự do, công lý, bình đẳng, đạo đức. Khám phá danh từ trừu tượng lớp u-, từ mượn Ả Rập cho khái niệm tri thức, và các mẫu câu triết học.",
    intro_en:
      "Learn to express abstract ideas — freedom, justice, equality, morality. Explore u-class abstract nouns, Arabic loanwords for intellectual concepts, and philosophical sentence patterns.",
    sentences: [
      {
        sw: "Uhuru ni haki ya kila binadamu.",
        en: "Freedom is the right of every human being.",
        vi: "Tự do là quyền của mỗi con người.",
        pronunciation_focus: ["u-HU-ru = tự do (l.14)", "HA-ki = quyền (Ả Rập)", "bi-na-DA-mu = con người"],
        pronunciation_focus_en: ["uhuru = freedom (cl.14)", "haki = right (Arabic)", "binadamu = human being"],
      },
      {
        sw: "Usawa wa kijinsia ni muhimu kwa maendeleo ya jamii.",
        en: "Gender equality is important for society's development.",
        vi: "Bình đẳng giới là quan trọng cho sự phát triển của xã hội.",
        pronunciation_focus: ["u-SA-wa = bình đẳng (l.14)", "ma-en-de-LE-o = phát triển (l.6)", "ja-MI-i = xã hội"],
        pronunciation_focus_en: ["usawa = equality (cl.14)", "maendeleo = development (cl.6)", "jamii = society"],
      },
      {
        sw: "Mabadiliko ya tabianchi yanatishia mustakabali wa dunia.",
        en: "Climate change threatens the future of the world.",
        vi: "Biến đổi khí hậu đe dọa tương lai của thế giới.",
        pronunciation_focus: ["ma-ba-di-LI-ko = thay đổi (l.6)", "ya-na-ti-SHI-a = đe dọa", "mus-ta-ka-BA-li = tương lai"],
        pronunciation_focus_en: ["mabadiliko = changes (cl.6)", "yanatishia = threatens", "mustakabali = future"],
      },
      {
        sw: "Maadili mema ni msingi wa jamii yenye amani.",
        en: "Good morals are the foundation of a peaceful society.",
        vi: "Đạo đức tốt là nền tảng của một xã hội hòa bình.",
        pronunciation_focus: ["ma-a-DI-li = đạo đức (l.6)", "Msi-ngi = nền tảng (l.3)", "a-MA-ni = hòa bình"],
        pronunciation_focus_en: ["maadili = morals (cl.6)", "msingi = foundation (cl.3)", "amani = peace"],
      },
    ],
    cultural_notes_vi:
      "Từ vựng trừu tượng Swahili rút từ hai nguồn: lớp u- cho khái niệm bản địa (uhuru, umoja, usawa) và từ mượn Ả Rập cho khái niệm tri thức (haki, fikra, maarifa). " +
      "Sự pha trộn Bantu-Ả Rập này tạo nên ngôn ngữ tri thức phong phú.",
    cultural_notes_en:
      "Abstract Swahili vocabulary draws from two sources: u-class for indigenous concepts (uhuru, umoja, usawa) and Arabic loanwords for intellectual concepts (haki, fikra, maarifa). " +
      "This Bantu-Arabic blend creates a rich intellectual language.",
    tip_advice_vi:
      "Chọn một khái niệm trừu tượng và nói về nó trong 60 giây bằng Swahili. Tập tạo danh từ trừu tượng: -zuri → uzuri, -tajiri → utajiri, -refu → urefu.",
    tip_advice_en:
      "Pick one abstract concept and speak about it for 60 seconds in Swahili. Practice forming abstract nouns: -zuri → uzuri, -tajiri → utajiri, -refu → urefu.",
    vocabulary: [
      { word: "uhuru", en: "freedom/independence", vi: "tự do", pos: "noun (class 14)", pronunciation_vi: "u-HU-ru", pronunciation_en: "oo-HOO-roo" },
      { word: "usawa", en: "equality", vi: "bình đẳng", pos: "noun (class 14)", pronunciation_vi: "u-SA-wa", pronunciation_en: "oo-SAH-wah" },
      { word: "haki", en: "right/justice", vi: "công lý", pos: "noun (class 9)", pronunciation_vi: "HA-ki", pronunciation_en: "HAH-kee" },
      { word: "maadili", en: "ethics/morals", vi: "đạo đức", pos: "noun (class 6)", pronunciation_vi: "ma-a-DI-li", pronunciation_en: "mah-ah-DEE-lee" },
      { word: "maendeleo", en: "development/progress", vi: "phát triển", pos: "noun (class 6)", pronunciation_vi: "ma-en-de-LE-o", pronunciation_en: "mah-ehn-deh-LEH-oh" },
      { word: "amani", en: "peace", vi: "hòa bình", pos: "noun (class 9)", pronunciation_vi: "a-MA-ni", pronunciation_en: "ah-MAH-nee" },
      { word: "ukweli", en: "truth", vi: "sự thật", pos: "noun (class 14)", pronunciation_vi: "u-KWE-li", pronunciation_en: "oo-KWEH-lee" },
      { word: "maarifa", en: "knowledge", vi: "tri thức", pos: "noun (class 6)", pronunciation_vi: "ma-a-RI-fa", pronunciation_en: "mah-ah-REE-fah" },
    ],
    exercises: [
      { type: "fill_blank", question: "____ ni haki ya kila binadamu. (Tự do)", answer: "Uhuru", hint_vi: "danh từ trừu tượng lớp 14", hint_en: "class 14 abstract noun" },
      { type: "translation", vietnamese: "Bình đẳng giới là quan trọng cho sự phát triển của xã hội.", english: "Gender equality is important for society's development.", swahili: "Usawa wa kijinsia ni muhimu kwa maendeleo ya jamii." },
    ],
  },

  // ───────────────────────────────────────────── debate (c109)
  {
    id: "swahili_c1_persuasive",
    level: "C1",
    category: "debate",
    title_vi: "Tiếng Swahili thuyết phục và tranh luận",
    title_en: "Persuasive and argumentative Swahili",
    intro_vi:
      "Học ngôn ngữ thuyết phục — trình bày lập luận, phản bác tôn trọng, câu hỏi tu từ, bằng chứng, và kết thúc mạnh mẽ. Kỹ năng cần thiết cho tranh luận, họp hành, và thuyết trình.",
    intro_en:
      "Learn persuasive language — structuring arguments, respectful refutation, rhetorical questions, evidence, and impactful closing. Essential for debates, meetings, and presentations.",
    sentences: [
      {
        sw: "Kwanza, ninaamini kwamba elimu ni haki ya kila mtu. Pili, nchi zenye elimu bora zina uchumi imara. Kwa hivyo, tunapaswa kuwekeza zaidi katika elimu.",
        en: "First, I believe education is a right for all. Second, countries with good education have strong economies. Therefore, we should invest more in education.",
        vi: "Thứ nhất, tôi tin giáo dục là quyền của mọi người. Thứ hai, nước có giáo dục tốt có kinh tế mạnh. Vì vậy, ta nên đầu tư nhiều hơn vào giáo dục.",
        pronunciation_focus: ["KWA-nza = thứ nhất", "PI-li = thứ hai", "kwa HI-vyo = vì vậy", "ku-we-KE-za = đầu tư"],
        pronunciation_focus_en: ["kwanza = first", "pili = second", "kwa hivyo = therefore", "kuwekeza = to invest"],
      },
      {
        sw: "Ninaheshimu maoni yako, lakini naona kwamba kuna njia nyingine.",
        en: "I respect your opinion, but I see that there is another way.",
        vi: "Tôi tôn trọng ý kiến của bạn, nhưng tôi thấy có một cách khác.",
        pronunciation_focus: ["ni-na-he-SHI-mu = tôi tôn trọng", "ma-O-ni = ý kiến", "NJI-a nyi-NGI-ne = cách khác"],
        pronunciation_focus_en: ["ninaheshimu = I respect", "maoni = opinions", "njia nyingine = another way"],
      },
      {
        sw: "Je, hii ni haki? Je, tunataka jamii ya aina gani?",
        en: "Is this justice? What kind of society do we want?",
        vi: "Đây có phải là công lý không? Chúng ta muốn xã hội kiểu gì?",
        pronunciation_focus: ["Je = liệu (từ hỏi tu từ)", "HA-ki = công lý", "A-i-na GA-ni? = kiểu gì?"],
        pronunciation_focus_en: ["Je = (rhetorical question)", "haki = justice", "aina gani? = what kind?"],
      },
      {
        sw: "Kwa kumalizia, tunayo fursa ya kihistoria ya kubadilisha mwelekeo wa nchi yetu.",
        en: "In conclusion, we have a historic opportunity to change our country's direction.",
        vi: "Để kết luận, chúng ta có cơ hội lịch sử để thay đổi hướng đi của đất nước.",
        pronunciation_focus: ["kwa ku-ma-LI-zi-a = để kết luận", "FUR-sa = cơ hội", "mwe-le-KE-o = hướng đi"],
        pronunciation_focus_en: ["kwa kumalizia = in conclusion", "fursa = opportunity", "mwelekeo = direction"],
      },
    ],
    cultural_notes_vi:
      "Tranh luận Swahili coi trọng tôn trọng và gián tiếp. Phản bác trực diện bị coi là thô lỗ. " +
      "Luôn dùng cụm làm mềm: 'Ninaheshimu maoni yako, lakini...' hoặc 'Ninaelewa unachosema...'",
    cultural_notes_en:
      "Swahili debate values respect and indirectness. Direct contradiction is rude. " +
      "Always use softening frames: 'Ninaheshimu maoni yako, lakini...' or 'Ninaelewa unachosema...'",
    tip_advice_vi:
      "Chọn một chủ đề, tranh luận cả hai phía 2 phút mỗi bên. Cấu trúc: Kwanza... Pili... Kwa hivyo... Khi phản bác: 'Ninaheshimu... lakini...'",
    tip_advice_en:
      "Pick a topic, argue both sides 2 min each. Structure: Kwanza... Pili... Kwa hivyo... When refuting: 'Ninaheshimu... lakini...'",
    vocabulary: [
      { word: "kwanza", en: "first/firstly", vi: "thứ nhất", pos: "adverb", pronunciation_vi: "KWA-nza", pronunciation_en: "KWAHN-zah" },
      { word: "kwa hivyo", en: "therefore", vi: "vì vậy", pos: "phrase", pronunciation_vi: "kwa HI-vyo", pronunciation_en: "kwah HEE-vyoh" },
      { word: "ninaheshimu", en: "I respect", vi: "tôi tôn trọng", pos: "verb", pronunciation_vi: "ni-na-he-SHI-mu", pronunciation_en: "nee-nah-heh-SHEE-moo" },
      { word: "kwa kumalizia", en: "in conclusion", vi: "để kết luận", pos: "phrase", pronunciation_vi: "kwa ku-ma-LI-zi-a", pronunciation_en: "kwah koo-mah-LEE-zee-ah" },
      { word: "uchumi", en: "economy", vi: "kinh tế", pos: "noun (class 14)", pronunciation_vi: "u-CHU-mi", pronunciation_en: "oo-CHOO-mee" },
      { word: "fursa", en: "opportunity", vi: "cơ hội", pos: "noun (class 9/10)", pronunciation_vi: "FUR-sa", pronunciation_en: "FOOR-sah" },
    ],
    exercises: [
      { type: "fill_blank", question: "____, ninaamini kwamba elimu ni haki. ____, nchi zenye elimu bora zina uchumi imara.", answer: "Kwanza... Pili", hint_vi: "thứ nhất... thứ hai", hint_en: "first... second" },
      { type: "translation", vietnamese: "Tôi tôn trọng ý kiến của bạn, nhưng tôi thấy có một cách khác.", english: "I respect your opinion, but I see another way.", swahili: "Ninaheshimu maoni yako, lakini naona kuna njia nyingine." },
    ],
  },

  // ─────────────────────────────────────────── business (c110)
  {
    id: "swahili_c1_professional",
    level: "C1",
    category: "business",
    title_vi: "Tiếng Swahili chuyên nghiệp và thương mại",
    title_en: "Professional and business Swahili",
    intro_vi:
      "Học tiếng Swahili chuyên nghiệp cho nơi làm việc và kinh doanh — từ vựng họp hành, email, đàm phán, thuyết trình, và cách nói gián tiếp lịch sự đặc trưng của văn hóa chuyên nghiệp Đông Phi.",
    intro_en:
      "Learn professional Swahili for workplace and business — meeting vocabulary, email, negotiation, presentations, and the polite indirectness of East African professional culture.",
    sentences: [
      {
        sw: "Mkutano umeanza. Ajenda ya leo ina mambo matatu muhimu.",
        en: "The meeting has started. Today's agenda has three important items.",
        vi: "Cuộc họp đã bắt đầu. Chương trình hôm nay có ba mục quan trọng.",
        pronunciation_focus: ["mku-TA-no = cuộc họp", "u-me-A-nza = đã bắt đầu", "a-JEN-da = chương trình"],
        pronunciation_focus_en: ["mkutano = meeting", "umeanza = has started", "ajenda = agenda"],
      },
      {
        sw: "Tunapenda kukujulisha kwamba maombi yako yamekubaliwa.",
        en: "We wish to inform you that your application has been accepted.",
        vi: "Chúng tôi muốn thông báo rằng đơn của quý vị đã được chấp nhận.",
        pronunciation_focus: ["tu-na-PEN-da = chúng tôi muốn", "ku-ku-ju-LI-sha = thông báo", "ya-me-ku-ba-LI-wa = đã được chấp nhận"],
        pronunciation_focus_en: ["tunapenda = we wish", "kukujulisha = inform you", "yamekubaliwa = have been accepted"],
      },
      {
        sw: "Ningependa kuchangia hoja moja kuhusu bajeti ya mwaka ujao.",
        en: "I would like to contribute one point regarding next year's budget.",
        vi: "Tôi xin đóng góp một ý kiến về ngân sách năm tới.",
        pronunciation_focus: ["ni-nge-PEN-da = tôi muốn (lịch sự)", "ku-cha-NGI-a = đóng góp", "ba-JE-ti = ngân sách"],
        pronunciation_focus_en: ["ningependa = I would like", "kuchangia = to contribute", "bajeti = budget"],
      },
      {
        sw: "Bei gani unayotoa? Tunaweza kujadili punguzo ikiwa utaagiza kwa wingi.",
        en: "What price are you offering? We can discuss a discount if you order in bulk.",
        vi: "Anh/chị đưa ra giá bao nhiêu? Có thể thảo luận giảm giá nếu đặt số lượng lớn.",
        pronunciation_focus: ["BE-i GA-ni? = giá bao nhiêu?", "pu-NGU-zo = giảm giá", "kwa WI-ngi = số lượng lớn"],
        pronunciation_focus_en: ["bei gani? = what price?", "punguzo = discount", "kwa wingi = in bulk"],
      },
    ],
    cultural_notes_vi:
      "Văn hóa chuyên nghiệp Đông Phi ưa giao tiếp gián tiếp. Thay vì 'Haiwezekani' (Không thể), nói 'Tutaangalia zaidi' (Sẽ xem xét thêm). " +
      "Email chuyên nghiệp mở đầu 'Ndugu' và kết thúc 'Wako mtiifu' hoặc 'Salamu njema'.",
    cultural_notes_en:
      "East African professional culture favors indirect communication. Instead of 'Haiwezekani' (Impossible), say 'Tutaangalia zaidi' (We'll look into it). " +
      "Professional emails open with 'Ndugu' and close with 'Wako mtiifu' or 'Salamu njema'.",
    tip_advice_vi:
      "Mô phỏng một tình huống kinh doanh mỗi ngày. Luôn dùng 'ningependa' (tôi muốn, lịch sự) thay vì 'nataka' (tôi muốn, thẳng).",
    tip_advice_en:
      "Simulate one business scenario daily. Always use 'ningependa' (polite) instead of 'nataka' (direct).",
    vocabulary: [
      { word: "mkutano", en: "meeting", vi: "cuộc họp", pos: "noun (class 3/4)", pronunciation_vi: "mku-TA-no", pronunciation_en: "mkoo-TAH-noh" },
      { word: "ajenda", en: "agenda", vi: "chương trình", pos: "noun (class 9)", pronunciation_vi: "a-JEN-da", pronunciation_en: "ah-JEN-dah" },
      { word: "bajeti", en: "budget", vi: "ngân sách", pos: "noun (class 9/10)", pronunciation_vi: "ba-JE-ti", pronunciation_en: "bah-JEH-tee" },
      { word: "taarifa", en: "notice/report", vi: "thông báo", pos: "noun (class 9/10)", pronunciation_vi: "ta-a-RI-fa", pronunciation_en: "tah-ah-REE-fah" },
      { word: "punguzo", en: "discount", vi: "giảm giá", pos: "noun (class 5/6)", pronunciation_vi: "pu-NGU-zo", pronunciation_en: "poo-NGOO-zoh" },
      { word: "kuchangia", en: "to contribute", vi: "đóng góp", pos: "verb", pronunciation_vi: "ku-cha-NGI-a", pronunciation_en: "koo-chah-NGEE-ah" },
      { word: "ushirikiano", en: "cooperation", vi: "hợp tác", pos: "noun (class 14)", pronunciation_vi: "u-shi-ri-ki-A-no", pronunciation_en: "oo-shee-ree-kee-AH-noh" },
      { word: "maombi", en: "application", vi: "đơn/hồ sơ", pos: "noun (class 6)", pronunciation_vi: "ma-OM-bi", pronunciation_en: "mah-OHM-bee" },
    ],
    exercises: [
      { type: "fill_blank", question: "Ningependa ____ hoja moja kuhusu bajeti.", answer: "kuchangia", hint_vi: "đóng góp", hint_en: "to contribute" },
      { type: "translation", vietnamese: "Chúng tôi muốn thông báo rằng đơn của quý vị đã được chấp nhận.", english: "We wish to inform you that your application has been accepted.", swahili: "Tunapenda kukujulisha kwamba maombi yako yamekubaliwa." },
    ],
  },

  // ──────────────────────────────────────────── literary (c111)
  {
    id: "swahili_c1_literary",
    level: "C1",
    category: "literary",
    title_vi: "Tiếng Swahili văn chương và thi ca",
    title_en: "Literary and poetic Swahili",
    intro_vi:
      "Khám phá vẻ đẹp của Swahili văn chương — ẩn dụ và so sánh, nhịp điệu và vần trong thơ ushairi, nhân hóa, lặp và song hành. Swahili có truyền thống thi ca phong phú kéo dài hàng thế kỷ.",
    intro_en:
      "Explore the beauty of literary Swahili — metaphor and simile, rhythm and rhyme in ushairi poetry, personification, repetition and parallelism. Swahili has a rich poetic tradition stretching back centuries.",
    sentences: [
      {
        sw: "Moyo wake ni mweupe kama theluji.",
        en: "His heart is white as snow.",
        vi: "Trái tim anh trắng như tuyết.",
        pronunciation_focus: ["MO-yo = trái tim", "MWE-u-pe = trắng", "KA-ma = như", "the-LU-ji = tuyết"],
        pronunciation_focus_en: ["moyo = heart", "mweupe = white", "kama = like/as", "theluji = snow"],
      },
      {
        sw: "Maisha ni safari ndefu yenye vilima na mabonde.",
        en: "Life is a long journey with hills and valleys.",
        vi: "Cuộc đời là chuyến đi dài với đồi và thung lũng.",
        pronunciation_focus: ["ma-I-sha = cuộc đời", "sa-FA-ri = chuyến đi", "vi-LI-ma = đồi", "ma-BON-de = thung lũng"],
        pronunciation_focus_en: ["maisha = life", "safari = journey", "vilima = hills", "mabonde = valleys"],
      },
      {
        sw: "Upepo ulinong'ona jina lake kwenye masikio ya miti.",
        en: "The wind whispered her name into the ears of the trees.",
        vi: "Gió thì thầm tên cô ấy vào tai những hàng cây.",
        pronunciation_focus: ["u-PE-po = gió", "u-li-no-NGO-na = đã thì thầm (nhân hóa)", "ma-si-KI-o = tai"],
        pronunciation_focus_en: ["upepo = wind", "ulinong'ona = whispered (personification)", "masikio = ears"],
      },
      {
        sw: "Ewe mpenzi wangu wee, wewe taa yangu njiani, wewe nuru yangu gizani.",
        en: "Oh my beloved, you are my lamp on the road, you are my light in the darkness.",
        vi: "Ôi người yêu dấu, bạn là ngọn đèn của tôi trên đường, bạn là ánh sáng của tôi trong bóng tối.",
        pronunciation_focus: ["E-we = ôi (thán từ thi ca)", "TA-a = đèn", "NU-ru = ánh sáng", "gi-ZA-ni = trong bóng tối"],
        pronunciation_focus_en: ["Ewe = oh (poetic)", "taa = lamp", "nuru = light", "gizani = in darkness"],
      },
    ],
    cultural_notes_vi:
      "Thơ Swahili cổ điển (ushairi) có niêm luật nghiêm ngặt: khổ bốn dòng, mỗi dòng 8 hoặc 16 âm tiết, vần cuối nhất quán. " +
      "Thể loại utendi là sử thi kể chuyện dài bằng thơ. Ngày nay, spoken word và hip-hop Swahili tiếp nối truyền thống này.",
    cultural_notes_en:
      "Classical Swahili poetry (ushairi) follows strict rules: four-line stanzas, 8 or 16 syllables per line, consistent end rhyme. " +
      "The utendi form is long narrative epic. Today, Swahili spoken word and hip-hop continue this tradition.",
    tip_advice_vi:
      "Sáng tác một khổ thơ Swahili bốn dòng mỗi tuần. Dùng ẩn dụ thiên nhiên: bahari, milima, jua, mwezi, nyota.",
    tip_advice_en:
      "Compose one four-line Swahili stanza each week. Use nature metaphors: bahari (ocean), milima (mountains), jua (sun), mwezi (moon), nyota (stars).",
    vocabulary: [
      { word: "ushairi", en: "poetry", vi: "thơ ca", pos: "noun (class 14)", pronunciation_vi: "u-SHA-i-ri", pronunciation_en: "oo-SHAH-ee-ree" },
      { word: "kama", en: "like/as", vi: "như", pos: "preposition", pronunciation_vi: "KA-ma", pronunciation_en: "KAH-mah" },
      { word: "istiara", en: "metaphor", vi: "ẩn dụ", pos: "noun (class 9)", pronunciation_vi: "is-ti-A-ra", pronunciation_en: "ees-tee-AH-rah" },
      { word: "ubeti", en: "stanza/verse", vi: "khổ thơ", pos: "noun (class 14)", pronunciation_vi: "u-BE-ti", pronunciation_en: "oo-BEH-tee" },
      { word: "nuru", en: "light", vi: "ánh sáng", pos: "noun (class 9)", pronunciation_vi: "NU-ru", pronunciation_en: "NOO-roo" },
      { word: "giza", en: "darkness", vi: "bóng tối", pos: "noun (class 5)", pronunciation_vi: "GI-za", pronunciation_en: "GHEE-zah" },
    ],
    exercises: [
      { type: "fill_blank", question: "Moyo wake ni mweupe ____ theluji.", answer: "kama", hint_vi: "như", hint_en: "like/as" },
      { type: "translation", vietnamese: "Cuộc đời là một chuyến đi dài với đồi và thung lũng.", english: "Life is a long journey with hills and valleys.", swahili: "Maisha ni safari ndefu yenye vilima na mabonde." },
    ],
  },

  // ──────────────────────────────────────── conditional (c112)
  {
    id: "swahili_c1_conditional",
    level: "C1",
    category: "conditional",
    title_vi: "Câu điều kiện và giả định trong tiếng Swahili",
    title_en: "Conditional and hypothetical speech in Swahili",
    intro_vi:
      "Học cách diễn đạt điều kiện, giả định, và phản thực — điều kiện thực (-ki-), giả định (-nge-), phản thực quá khứ (-ngali-), điều kiện hỗn hợp, và cách nói ước muốn và tiếc nuối.",
    intro_en:
      "Learn to express conditions, hypotheticals, and counterfactuals — real (-ki-), hypothetical (-nge-), past counterfactual (-ngali-), mixed conditionals, and expressing wishes and regrets.",
    sentences: [
      {
        sw: "Ukienda sokoni, utanunua matunda.",
        en: "If you go to the market, you will buy fruit.",
        vi: "Nếu bạn đi chợ, bạn sẽ mua trái cây.",
        pronunciation_focus: ["u-KI-en-da = nếu bạn đi (-ki-)", "u-ta-NU-nu-a = bạn sẽ mua (-ta-)"],
        pronunciation_focus_en: ["ukienda = if you go (-ki-)", "utanunua = you will buy (-ta-)"],
      },
      {
        sw: "Ningekuwa na pesa, ningenunua nyumba.",
        en: "If I had money, I would buy a house.",
        vi: "Nếu tôi có tiền, tôi sẽ mua nhà.",
        pronunciation_focus: ["ni-NGE-ku-wa = nếu tôi có (-nge-)", "ni-nge-NU-nu-a = tôi sẽ mua (-nge-)"],
        pronunciation_focus_en: ["ningekuwa = if I had (-nge-)", "ningenunua = I would buy (-nge-)"],
      },
      {
        sw: "Ningalijua, nisingalikuja.",
        en: "If I had known, I would not have come.",
        vi: "Nếu tôi đã biết, tôi đã không đến.",
        pronunciation_focus: ["ni-nga-li-JU-a = nếu tôi đã biết (-ngali-)", "ni-si-nga-li-KU-ja = tôi đã không đến"],
        pronunciation_focus_en: ["ningalijua = if I had known (-ngali-)", "nisingalikuja = I would not have come"],
      },
      {
        sw: "Laiti ningekuwa na muda zaidi, ningesafiri ulimwenguni kote.",
        en: "If only I had more time, I would travel around the world.",
        vi: "Ước gì tôi có nhiều thời gian hơn, tôi sẽ đi du lịch khắp thế giới.",
        pronunciation_focus: ["LA-i-ti = ước gì", "ni-nge-SA-fi-ri = tôi sẽ du lịch", "u-li-MWE-ngu-ni = khắp thế giới"],
        pronunciation_focus_en: ["laiti = if only", "ningesafiri = I would travel", "ulimwenguni = around the world"],
      },
    ],
    cultural_notes_vi:
      "Người Swahili dùng điều kiện tự nhiên trong giao tiếp. -ki- phổ biến nhất trong hội thoại hàng ngày. " +
      "-nge- và -ngali- thể hiện sự tinh tế, thường dùng trong văn viết và thảo luận trang trọng. Laiti mang sắc thái cảm xúc mạnh.",
    cultural_notes_en:
      "Swahili speakers use conditionals naturally. -ki- is most common in daily conversation. " +
      "-nge- and -ngali- show sophistication, often in writing and formal discussion. Laiti carries strong emotion.",
    tip_advice_vi:
      "Xây chuỗi điều kiện: -ki- (thực) → -nge- (giả định) → -ngali- (phản thực). Nikisoma → nitafaulu. Ningesoma → ningefaulu. Ningalisoma → ningalifaulu.",
    tip_advice_en:
      "Build conditional chain: -ki- (real) → -nge- (hypothetical) → -ngali- (counterfactual). Nikisoma → nitafaulu. Ningesoma → ningefaulu. Ningalisoma → ningalifaulu.",
    vocabulary: [
      { word: "ikiwa", en: "if", vi: "nếu", pos: "conjunction", pronunciation_vi: "i-KI-wa", pronunciation_en: "ee-KEE-wah" },
      { word: "laiti", en: "if only", vi: "ước gì", pos: "particle", pronunciation_vi: "LA-i-ti", pronunciation_en: "LAH-ee-tee" },
      { word: "ningekuwa", en: "if I were/had", vi: "nếu tôi có", pos: "verb (-nge-)", pronunciation_vi: "ni-nge-KU-wa", pronunciation_en: "nee-ngeh-KOO-wah" },
      { word: "ningalijua", en: "if I had known", vi: "nếu tôi đã biết", pos: "verb (-ngali-)", pronunciation_vi: "ni-nga-li-JU-a", pronunciation_en: "nee-ngah-lee-JOO-ah" },
      { word: "usingekuwa", en: "if you were not", vi: "nếu bạn không", pos: "verb (neg -nge-)", pronunciation_vi: "u-si-nge-KU-wa", pronunciation_en: "oo-see-ngeh-KOO-wah" },
      { word: "usingalikosa", en: "you would not have missed", vi: "bạn đã không lỡ", pos: "verb (neg -ngali-)", pronunciation_vi: "u-si-nga-li-KO-sa", pronunciation_en: "oo-see-ngah-lee-KOH-sah" },
    ],
    exercises: [
      { type: "fill_blank", question: "____ na pesa, ningenunua nyumba. (Nếu tôi có tiền)", answer: "Ningekuwa", hint_vi: "điều kiện giả định -nge-", hint_en: "hypothetical -nge-" },
      { type: "translation", vietnamese: "Ước gì tôi có nhiều thời gian hơn.", english: "If only I had more time.", swahili: "Laiti ningekuwa na muda zaidi." },
    ],
  },

  // ──────────────────────────────────── cultural_nuances (c113)
  {
    id: "swahili_c1_cultural_nuances",
    level: "C1",
    category: "cultural_nuances",
    title_vi: "Sắc thái văn hóa trong giao tiếp Swahili",
    title_en: "Cultural nuances in Swahili communication",
    intro_vi:
      "Khám phá những tầng văn hóa sâu sắc trong giao tiếp Swahili — từ chối gián tiếp, xưng hô theo tuổi tác và địa vị, nghi thức chào hỏi, quan hệ đùa giỡn utani, và ngôn ngữ hiếu khách.",
    intro_en:
      "Explore deep cultural layers in Swahili communication — indirect refusal, age and status in address, greeting rituals, the utani joking relationship, and hospitality language.",
    sentences: [
      {
        sw: "Labda baadaye. Tutaona. (Từ chối lịch sự.)",
        en: "Maybe later. We will see. (Polite refusal.)",
        vi: "Có lẽ để sau. Để xem đã. (Từ chối lịch sự.)",
        pronunciation_focus: ["LAB-da = có lẽ", "ba-a-DA-ye = sau này", "tu-ta-O-na = chúng ta sẽ thấy"],
        pronunciation_focus_en: ["labda = maybe", "baadaye = later", "tutaona = we will see"],
      },
      {
        sw: "Mzee, mmeamka salama? (Dùng 'mme-' số nhiều cho một người — kính ngữ.)",
        en: "Elder, have you (plural) woken peacefully? (Plural for one person — respect.)",
        vi: "Thưa bác, bác (số nhiều) đã thức dậy bình an chứ ạ? (Số nhiều cho một người — kính ngữ.)",
        pronunciation_focus: ["MZE-e = người lớn tuổi", "mme-AM-ka = các ngài thức dậy (số nhiều)", "sa-LA-ma = bình an"],
        pronunciation_focus_en: ["mzee = elder", "mmeamka = you (pl.) woke", "salama = peaceful"],
      },
      {
        sw: "Karibu! Karibu chai! Usiwe na haraka, tunafurahi kuwa nawe.",
        en: "Welcome! Please have tea! Don't rush, we are happy to have you.",
        vi: "Chào mừng! Mời dùng trà! Đừng vội, chúng tôi vui vì có bạn.",
        pronunciation_focus: ["ka-RI-bu = chào mừng", "U-si-we na ha-RA-ka = đừng vội", "tu-na-FU-ra-hi = chúng tôi vui"],
        pronunciation_focus_en: ["karibu = welcome", "usiwe na haraka = don't rush", "tunafurahi = we are happy"],
      },
      {
        sw: "Sio rahisi. Nitajaribu. Bado. (Tất cả đều là từ chối gián tiếp.)",
        en: "It's not easy. I will try. Not yet. (All are indirect refusals.)",
        vi: "Không dễ đâu. Tôi sẽ cố. Chưa được. (Tất cả là từ chối gián tiếp.)",
        pronunciation_focus: ["SI-o ra-HI-si = không dễ (ẩn: không)", "ni-ta-ja-RI-bu = tôi sẽ cố (ẩn: chắc không)", "BA-do = chưa (ẩn: không)"],
        pronunciation_focus_en: ["sio rahisi = it's not easy (implied: no)", "nitajaribu = I'll try (implied: prob not)", "bado = not yet (implied: no)"],
      },
    ],
    cultural_notes_vi:
      "Từ chối trực tiếp (Hapana) bị coi là thô lỗ trong hầu hết ngữ cảnh Swahili. " +
      "Thay vào đó dùng chiến lược gián tiếp. Nghi thức chào hỏi đầy đủ có thể kéo dài vài phút, hỏi thăm mọi khía cạnh cuộc sống. " +
      "Quan hệ đùa giỡn utani cho phép nói đùa giữa một số nhóm dân tộc mà không bị coi là xúc phạm.",
    cultural_notes_en:
      "Direct refusal (Hapana) is rude in most Swahili contexts. " +
      "Use indirect strategies instead. A full greeting ritual can last several minutes, inquiring about every aspect of life. " +
      "The utani joking relationship permits playful teasing between certain ethnic groups.",
    tip_advice_vi:
      "Mỗi ngày thực hành một tình huống văn hóa: thăm nhà bạn Swahili (chào hỏi dài → nhận đồ uống → từ chối lần đầu → nhận lần hai → tạm biệt dài). Tập dùng ít nhất 3 cách từ chối gián tiếp.",
    tip_advice_en:
      "Practice one cultural scenario daily: visiting a Swahili friend (long greeting → accept drink → first refusal → accept on second offer → long farewell). Use at least 3 indirect refusal forms.",
    vocabulary: [
      { word: "labda", en: "maybe/perhaps", vi: "có lẽ", pos: "adverb", pronunciation_vi: "LAB-da", pronunciation_en: "LAHB-dah" },
      { word: "tutaona", en: "we will see (polite refusal)", vi: "để xem đã", pos: "phrase", pronunciation_vi: "tu-ta-O-na", pronunciation_en: "too-tah-OH-nah" },
      { word: "karibu", en: "welcome/come in", vi: "chào mừng/mời vào", pos: "greeting", pronunciation_vi: "ka-RI-bu", pronunciation_en: "kah-REE-boo" },
      { word: "utani", en: "joking relationship", vi: "quan hệ đùa giỡn", pos: "noun (class 14)", pronunciation_vi: "u-TA-ni", pronunciation_en: "oo-TAH-nee" },
      { word: "heshima", en: "respect/honor", vi: "kính trọng", pos: "noun (class 9)", pronunciation_vi: "he-SHI-ma", pronunciation_en: "heh-SHEE-mah" },
      { word: "bado", en: "not yet (indirect no)", vi: "chưa được", pos: "adverb", pronunciation_vi: "BA-do", pronunciation_en: "BAH-doh" },
    ],
    exercises: [
      { type: "fill_blank", question: "____ baadaye. (Có lẽ để sau — từ chối lịch sự)", answer: "Labda", hint_vi: "có lẽ", hint_en: "maybe" },
      { type: "matching", pairs: [{ left: "Labda baadaye", right: "Maybe later (indirect no)" }, { left: "Nitajaribu", right: "I will try (probably not)" }, { left: "Tutaona", right: "We will see (diplomatic no)" }] },
    ],
  },

  // ──────────────────────────────────────────── opinions (c114)
  {
    id: "swahili_c1_opinions",
    level: "C1",
    category: "opinions",
    title_vi: "Diễn đạt quan điểm chính xác trong tiếng Swahili",
    title_en: "Expressing opinions with precision in Swahili",
    intro_vi:
      "Học cách diễn đạt quan điểm rõ ràng, lịch sự, và tinh tế — từ đồng ý có sắc thái đến phản đối lịch sự, từ thêm góc nhìn đến bày tỏ sự không chắc chắn. Ở trình độ C1, ý kiến mạnh vẫn cần được nói ra cân bằng và thấu đáo.",
    intro_en:
      "Learn to express opinions clearly, politely, and with nuance — from balanced agreement to polite disagreement, from adding perspective to expressing uncertainty. At C1, strong opinions must still sound balanced and thoughtful.",
    sentences: [
      {
        sw: "Mimi naona tofauti. Kwa mtazamo wangu, kuna njia nyingine.",
        en: "I see it differently. From my perspective, there is another way.",
        vi: "Tôi thấy khác. Theo cách nhìn của tôi, có một cách khác.",
        pronunciation_focus: ["mi-MI na-O-na = tôi thấy", "kwa mta-ZA-mo WA-ngu = theo góc nhìn của tôi"],
        pronunciation_focus_en: ["mimi naona = I see", "kwa mtazamo wangu = from my perspective"],
      },
      {
        sw: "Nakubaliana na wewe, hasa kuhusu umuhimu wa elimu. Ningependa kuongeza kwamba afya pia ni muhimu.",
        en: "I agree with you, especially about education. I would like to add that health is also important.",
        vi: "Tôi đồng ý với bạn, đặc biệt về giáo dục. Tôi muốn thêm rằng sức khỏe cũng quan trọng.",
        pronunciation_focus: ["na-ku-ba-li-A-na = tôi đồng ý", "HA-sa = đặc biệt", "ku-o-NGE-za = thêm vào"],
        pronunciation_focus_en: ["nakubaliana = I agree", "hasa = especially", "kuongeza = to add"],
      },
      {
        sw: "Ninaelewa unachosema, lakini nina wasiwasi kuhusu gharama.",
        en: "I understand what you are saying, but I have concerns about the cost.",
        vi: "Tôi hiểu điều bạn đang nói, nhưng tôi có lo ngại về chi phí.",
        pronunciation_focus: ["ni-na-e-LE-wa = tôi hiểu", "wa-si-WA-si = lo ngại", "gha-RA-ma = chi phí"],
        pronunciation_focus_en: ["ninaelewa = I understand", "wasiwasi = concerns", "gharama = cost"],
      },
      {
        sw: "Bado ninatafakari. Sijafikia uamuzi wa mwisho.",
        en: "I am still thinking. I have not reached a final decision.",
        vi: "Tôi vẫn đang suy nghĩ. Tôi chưa đi đến quyết định cuối cùng.",
        pronunciation_focus: ["ba-DO = vẫn/chưa", "ni-na-ta-fa-KA-ri = tôi đang suy nghĩ", "u-a-MU-zi = quyết định"],
        pronunciation_focus_en: ["bado = still/not yet", "ninatafakari = I am thinking", "uamuzi = decision"],
      },
      {
        sw: "Kwa uaminifu, naamini kwamba huu ndio mwelekeo sahihi.",
        en: "Honestly, I believe that this is indeed the right direction.",
        vi: "Thành thật mà nói, tôi tin rằng đây chính là hướng đi đúng.",
        pronunciation_focus: ["kwa u-a-mi-NI-fu = thành thật", "na-a-MI-ni = tôi tin", "sa-HI-hi = đúng"],
        pronunciation_focus_en: ["kwa uaminifu = honestly", "naamini = I believe", "sahihi = correct"],
      },
    ],
    cultural_notes_vi:
      "Người Swahili coi trọng hài hòa trong thảo luận. Quan điểm mạnh được đánh giá cao nhưng phải trình bày cân bằng. " +
      "'Kwa mtazamo wangu' và 'Mimi naona' đóng khung ý kiến cá nhân mà không áp đặt. Nói 'Bado ninatafakari' là dấu hiệu chín chắn, không phải do dự.",
    cultural_notes_en:
      "Swahili speakers value harmony in discussion. Strong opinions are respected but must be balanced. " +
      "'Kwa mtazamo wangu' and 'Mimi naona' frame personal views without imposing. Saying 'Bado ninatafakari' signals maturity, not hesitation.",
    tip_advice_vi:
      "Khi bày tỏ quan điểm mạnh: 'Kwa mtazamo wangu...' Khi không chắc: 'Bado ninatafakari...' Khi đồng ý, thêm đóng góp: 'Nakubaliana... na ningeongeza...'",
    tip_advice_en:
      "Strong opinion: 'Kwa mtazamo wangu...' Uncertain: 'Bado ninatafakari...' Agreeing, add: 'Nakubaliana... na ningeongeza...'",
    vocabulary: [
      { word: "mtazamo", en: "perspective/view", vi: "góc nhìn", pos: "noun (class 3)", pronunciation_vi: "mta-ZA-mo", pronunciation_en: "mtah-ZAH-moh" },
      { word: "nakubaliana", en: "I agree", vi: "tôi đồng ý", pos: "verb (reciprocal)", pronunciation_vi: "na-ku-ba-li-A-na", pronunciation_en: "nah-koo-bah-lee-AH-nah" },
      { word: "wasiwasi", en: "concern/worry", vi: "lo ngại", pos: "noun (class 11)", pronunciation_vi: "wa-si-WA-si", pronunciation_en: "wah-see-WAH-see" },
      { word: "uamuzi", en: "decision", vi: "quyết định", pos: "noun (class 14)", pronunciation_vi: "u-a-MU-zi", pronunciation_en: "oo-ah-MOO-zee" },
      { word: "kwa uaminifu", en: "honestly", vi: "thành thật", pos: "phrase", pronunciation_vi: "kwa u-a-mi-NI-fu", pronunciation_en: "kwah oo-ah-mee-NEE-foo" },
      { word: "sahihi", en: "correct/right", vi: "đúng", pos: "adjective", pronunciation_vi: "sa-HI-hi", pronunciation_en: "sah-HEE-hee" },
    ],
    exercises: [
      { type: "fill_blank", question: "____ mtazamo wangu, kuna njia nyingine.", answer: "Kwa", hint_vi: "theo", hint_en: "from/according to" },
      { type: "translation", vietnamese: "Tôi hiểu điều bạn đang nói, nhưng tôi có lo ngại về chi phí.", english: "I understand what you're saying, but I have concerns about the cost.", swahili: "Ninaelewa unachosema, lakini nina wasiwasi kuhusu gharama." },
    ],
  },
];

export default lessons;