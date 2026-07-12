// src/languages/swahili/lessons-c1.ts
//
// Swahili C1 (Advanced) lessons — adapted from A5-authored room JSONs
// (swahili_c1_c101 through swahili_c1_c114, 2026-06-23).
//
// 14 lessons covering all existing C1 categories. Each lesson preserves
// the bilingual Vietnamese + English pedagogy from the source rooms:
// every sentence carries sw + en + vi, syllable-broken pronunciation
// guides, noun-class-annotated vocabulary, and cultural context.
//
// Vietnamese-first pedagogy with English companion fields.

import type { SwahiliLesson } from "./lessons";

const lessons: SwahiliLesson[] = [
  // ══════════════════════════════════════════════════════════════════
  // C1-01 — Complex Sentences
  // ══════════════════════════════════════════════════════════════════
  {
    id: "swahili_c1_complex_sentences",
    level: "C1",
    category: "complex_sentences",
    title_vi: "Xây dựng câu phức trong tiếng Swahili",
    title_en: "Advanced Swahili Sentence Building",
    intro_vi:
      "Học cách xây dựng câu Swahili phức tạp với nhiều mệnh đề. " +
      "Bạn sẽ nối ý bằng liên từ (na, lakini, au, kwa hivyo), lồng " +
      "mệnh đề phụ (kwamba, kwa sababu, ili), và duy trì hòa hợp " +
      "danh từ xuyên suốt câu dài.",
    intro_en:
      "Learn to build complex Swahili sentences with multiple clauses. " +
      "Connect ideas with conjunctions (na, lakini, au, kwa hivyo), " +
      "embed subordinate clauses (kwamba, kwa sababu, ili), and keep " +
      "noun class agreement correct across long sentences.",
    sentences: [
      {
        sw: "Nilikwenda sokoni na nilinunua matunda.",
        en: "I went to the market and I bought fruit.",
        vi: "Tôi đã đi chợ và tôi đã mua trái cây.",
        pronunciation_focus: [
          "ni-li-KWEN-da = tôi đã đi",
          "so-KO-ni = ở chợ (locative -ni)",
          "na ni-li-NU-nu-a = và tôi đã mua",
          "ma-TUN-da = trái cây (lớp 6)",
        ],
        pronunciation_focus_en: [
          "nilikwenda = I went",
          "sokoni = at the market (locative -ni)",
          "na nilinunua = and I bought",
          "matunda = fruit (class 6)",
        ],
      },
      {
        sw: "Alijaribu kufika mapema lakini basi lilichelewa.",
        en: "He tried to arrive early but the bus was late.",
        vi: "Anh ấy đã cố đến sớm nhưng xe buýt bị trễ.",
        pronunciation_focus: [
          "a-li-JA-ri-bu = anh ấy đã cố",
          "ku-FI-ka = đến nơi",
          "ma-PE-ma = sớm",
          "la-KI-ni = nhưng",
          "BA-si li-li-che-LE-wa = xe buýt bị trễ (lớp 5)",
        ],
        pronunciation_focus_en: [
          "alijaribu = he tried",
          "kufika = to arrive",
          "mapema = early",
          "lakini = but",
          "basi lilichelewa = the bus was late (class 5)",
        ],
      },
      {
        sw: "Ninaamini kwamba elimu ni muhimu.",
        en: "I believe that education is important.",
        vi: "Tôi tin rằng giáo dục là quan trọng.",
        pronunciation_focus: [
          "ni-na-A-mi-ni = tôi tin",
          "KWA-mba = rằng (liên từ phụ thuộc)",
          "e-LI-mu = giáo dục",
          "mu-HI-mu = quan trọng",
        ],
        pronunciation_focus_en: [
          "ninaamini = I believe",
          "kwamba = that (subordinator)",
          "elimu = education",
          "muhimu = important",
        ],
      },
      {
        sw: "Nilichelewa kwa sababu gari langu liliharibika.",
        en: "I was late because my car broke down.",
        vi: "Tôi đến trễ vì xe tôi bị hỏng.",
        pronunciation_focus: [
          "ni-li-che-LE-wa = tôi bị trễ",
          "kwa SA-BA-bu = bởi vì",
          "GA-ri LAN-gu = xe của tôi (lớp 5)",
          "li-li-ha-RI-bi-ka = nó bị hỏng (stative -ik-)",
        ],
        pronunciation_focus_en: [
          "nilichelewa = I was late",
          "kwa sababu = because",
          "gari langu = my car (class 5)",
          "liliharibika = it broke down (stative -ik-)",
        ],
      },
      {
        sw: "Tulipika chakula, kisha tukala pamoja.",
        en: "We cooked food, then we ate together.",
        vi: "Chúng tôi nấu đồ ăn, rồi cùng ăn với nhau.",
        pronunciation_focus: [
          "tu-li-PI-ka = chúng tôi đã nấu",
          "cha-KU-la = đồ ăn (lớp 7)",
          "KI-sha = rồi thì",
          "tu-KA-la = rồi chúng tôi ăn (thì -ka- kể chuyện)",
        ],
        pronunciation_focus_en: [
          "tulipika = we cooked",
          "chakula = food (class 7)",
          "kisha = then",
          "tukala = then we ate (-ka- narrative tense)",
        ],
      },
      {
        sw: "Ninasoma kwa bidii ili nifaulu mtihani.",
        en: "I study hard so that I pass the exam.",
        vi: "Tôi học chăm chỉ để thi đậu.",
        pronunciation_focus: [
          "ni-na-SO-ma = tôi học",
          "kwa bi-DI-i = chăm chỉ",
          "I-li = để mà (liên từ chỉ mục đích)",
          "ni-FA-u-lu = tôi đậu (giả định, đuôi -e)",
        ],
        pronunciation_focus_en: [
          "ninasoma = I study",
          "kwa bidii = diligently",
          "ili = so that (purpose)",
          "nifaulu = I pass (subjunctive -e)",
        ],
      },
      {
        sw: "Ingawa mvua ilinyesha, tuliendelea na safari.",
        en: "Although it rained, we continued with the journey.",
        vi: "Mặc dù trời mưa, chúng tôi vẫn tiếp tục chuyến đi.",
        pronunciation_focus: [
          "i-NGA-wa = mặc dù",
          "MVU-a i-li-NYE-sha = mưa đã rơi",
          "tu-li-en-de-LE-a = chúng tôi tiếp tục",
          "sa-FA-ri = chuyến đi",
        ],
        pronunciation_focus_en: [
          "ingawa = although",
          "mvua ilinyesha = it rained",
          "tuliendelea = we continued",
          "safari = journey",
        ],
      },
    ],
    vocabulary: [
      { cell_id: "09a94137-e7a8-407a-847e-7bd58575a4cb", word: "na", en: "and", vi: "và", pos: "conjunction" },
      { cell_id: "f4fa3571-bd6b-4763-85e2-4b97a59bc862", word: "lakini", en: "but", vi: "nhưng", pos: "conjunction" },
      { cell_id: "d06d012d-d805-4101-9208-d86285fdbf96", word: "kwa sababu", en: "because", vi: "bởi vì", pos: "conjunction" },
      { cell_id: "a71b1c2a-29ee-4f19-9f37-8c36cdfd166c", word: "kwamba", en: "that (subordinator)", vi: "rằng", pos: "conjunction" },
      { cell_id: "e9843106-1a0f-4d71-ac5c-2e7f4b9d40bf", word: "kisha", en: "then, afterwards", vi: "rồi thì", pos: "adverb" },
      { cell_id: "36874439-17fd-4bd5-8d71-875b54ba4e3c", word: "ili", en: "so that, in order to", vi: "để mà", pos: "conjunction" },
      { cell_id: "4088738f-46f3-4367-b703-a0e5d85b21b9", word: "ingawa", en: "although", vi: "mặc dù", pos: "conjunction" },
      { cell_id: "9b33cc88-6aef-46cd-a926-41aa4ce0adf6", word: "ijapokuwa", en: "even though", vi: "mặc dù, dẫu rằng", pos: "conjunction" },
    ],
    cultural_notes_vi:
      "Người Tanzania và Kenya thường dùng câu dài nhiều mệnh đề trong " +
      "hội thoại hàng ngày. Thì -ka- (như trong 'tukala') là dấu hiệu " +
      "của người kể chuyện có kinh nghiệm — nó nối các hành động liên " +
      "tiếp mà không cần lặp chủ ngữ. Khi dùng 'ili' (để mà), động từ " +
      "sau nó luôn ở dạng giả định tận cùng -e.",
    cultural_notes_en:
      "Tanzanians and Kenyans often speak in long multi-clause sentences. " +
      "The -ka- tense (as in 'tukala') is a marker of an experienced " +
      "storyteller — it chains consecutive actions without repeating the " +
      "subject. After 'ili' (so that), the verb always takes the " +
      "subjunctive ending -e.",
    tip_advice_vi:
      "Bài luyện: Lấy 2 câu đơn, nối bằng na/lakini/kwa sababu/ili. " +
      "Rồi thêm ý thứ ba với kisha. Ví dụ: Niliamka asubuhi + Nilikunywa " +
      "chai → Niliamka asubuhi na nilikunywa chai, kisha nikaanza kufanya " +
      "kazi. Tập xây từ 2 lên 3 mệnh đề mỗi ngày.",
    tip_advice_en:
      "Daily drill: Join 2 simple sentences with na/lakini/kwa sababu/ili. " +
      "Add a 3rd idea with kisha. Example: Niliamka asubuhi + Nilikunywa " +
      "chai → Niliamka asubuhi na nilikunywa chai, kisha nikaanza kufanya " +
      "kazi. Build from 2 clauses to 3 daily.",
  },

  // ══════════════════════════════════════════════════════════════════
  // C1-02 — Verb Extensions
  // ══════════════════════════════════════════════════════════════════
  {
    id: "swahili_c1_verb_extensions",
    level: "C1",
    category: "verb_extensions",
    title_vi: "Làm chủ các dạng mở rộng động từ",
    title_en: "Mastering Verb Extensions in Swahili",
    intro_vi:
      "Khám phá hệ thống đuôi mở rộng động từ — ứng dụng (-i-/-e-), " +
      "sai khiến (-sh-/-z-), bị động (-w-/-liw-), hỗ tương (-an-), " +
      "và trạng thái (-ik-). Học cách chồng nhiều đuôi trên cùng một " +
      "động từ — dấu hiệu của tiếng Swahili nâng cao thực thụ.",
    intro_en:
      "Explore verb extensions — applicative (-i-/-e-), causative " +
      "(-sh-/-z-), passive (-w-/-liw-), reciprocal (-an-), and stative " +
      "(-ik-). Learn to stack multiple extensions on one verb — a " +
      "hallmark of true advanced Swahili.",
    sentences: [
      {
        sw: "Ninapikia watoto chakula.",
        en: "I cook food for the children.",
        vi: "Tôi nấu đồ ăn cho bọn trẻ.",
        pronunciation_focus: [
          "ni-na-PI-ki-a = tôi nấu cho (ứng dụng -i-)",
          "wa-TO-to = trẻ em (lớp 2)",
          "cha-KU-la = đồ ăn (lớp 7)",
        ],
        pronunciation_focus_en: [
          "ninapikia = I cook for (applicative -i-)",
          "watoto = children (class 2)",
          "chakula = food (class 7)",
        ],
      },
      {
        sw: "Walimu wanafundisha wanafunzi shuleni.",
        en: "Teachers teach students at school.",
        vi: "Thầy cô dạy học sinh ở trường.",
        pronunciation_focus: [
          "wa-LI-mu = thầy cô (lớp 2)",
          "wa-na-FUN-di-sha = họ dạy (sai khiến -sh-, gốc -fund-)",
          "wa-na-FUN-zi = học sinh",
          "shu-LE-ni = ở trường",
        ],
        pronunciation_focus_en: [
          "walimu = teachers (class 2)",
          "wanafundisha = they teach (causative -sh- from -fund-)",
          "wanafunzi = students",
          "shuleni = at school",
        ],
      },
      {
        sw: "Somo linafundishwa na mwalimu.",
        en: "The lesson is taught by the teacher.",
        vi: "Bài học được dạy bởi thầy giáo.",
        pronunciation_focus: [
          "SO-mo = bài học (lớp 5)",
          "li-na-fun-DI-shwa = nó được dạy (bị động -w-)",
          "na mwa-LI-mu = bởi thầy giáo",
        ],
        pronunciation_focus_en: [
          "somo = lesson (class 5)",
          "linafundishwa = it is taught (passive -w-)",
          "na mwalimu = by the teacher",
        ],
      },
      {
        sw: "Wanafunzi wanasaidiana darasani.",
        en: "The students help each other in class.",
        vi: "Học sinh giúp đỡ lẫn nhau trong lớp.",
        pronunciation_focus: [
          "wa-na-fun-zi = học sinh (lớp 2)",
          "wa-na-sa-i-di-A-na = họ giúp nhau (hỗ tương -an-)",
          "da-ra-SA-ni = trong lớp học",
        ],
        pronunciation_focus_en: [
          "wanafunzi = students (class 2)",
          "wanasaidiana = they help each other (reciprocal -an-)",
          "darasani = in the classroom",
        ],
      },
      {
        sw: "Nilimsomea binti yangu kitabu.",
        en: "I read a book to my daughter.",
        vi: "Tôi đọc sách cho con gái tôi.",
        pronunciation_focus: [
          "ni-li-m-so-ME-a = tôi đọc cho cô ấy (ứng dụng -e-)",
          "BI-nti YAN-gu = con gái của tôi",
          "ki-TA-bu = sách (lớp 7)",
        ],
        pronunciation_focus_en: [
          "nilimsomea = I read to her (applicative -e-)",
          "binti yangu = my daughter",
          "kitabu = book (class 7)",
        ],
      },
      {
        sw: "Nilimsomeshewa binti yangu kitabu na mwalimu.",
        en: "The teacher made me read a book to my daughter.",
        vi: "Thầy giáo bắt tôi đọc sách cho con gái tôi.",
        pronunciation_focus: [
          "ni-li-m-so-me-SHE-wa = tôi bị bắt đọc cho cô ấy",
          "gốc -som- + ứng dụng -e- + sai khiến -sh- + bị động -w-",
        ],
        pronunciation_focus_en: [
          "nilimsomeshewa = I was made to read to her",
          "root -som- + applic -e- + caus -sh- + pass -w-",
        ],
      },
    ],
    vocabulary: [
      { cell_id: "126251a3-39fb-4b92-bdee-d8bbf29bee3a", word: "kupikia", en: "to cook for", vi: "nấu cho", pos: "verb", ngeli: "applic -i-/-e-" },
      { cell_id: "3b386ad0-7001-4ada-aebb-8a5bda1476f6", word: "kufundisha", en: "to teach", vi: "dạy", pos: "verb", ngeli: "caus -sh-" },
      { cell_id: "61ab331f-ba43-4e02-ba4f-dc29fc2976f1", word: "kulaza", en: "to put to bed", vi: "cho đi ngủ", pos: "verb", ngeli: "caus -z-" },
      { cell_id: "1a9bb56d-d29d-4fc9-a9ef-5aa44304e166", word: "kujengwa", en: "to be built", vi: "được xây", pos: "verb", ngeli: "pass -w-" },
      { cell_id: "4f11b674-67d0-4480-91b1-cfaeedb58d3b", word: "kusaidiana", en: "to help each other", vi: "giúp nhau", pos: "verb", ngeli: "recip -an-" },
      { cell_id: "472f107d-ec4a-4da2-a2cb-d9c1e57e2a34", word: "kuharibika", en: "to break down / spoil", vi: "bị hỏng", pos: "verb", ngeli: "stat -ik-" },
      { cell_id: "c2e736f0-a810-428d-841e-9e6cb55d9a61", word: "kulisha", en: "to feed (cause to eat)", vi: "cho ăn", pos: "verb", ngeli: "caus -sh-" },
      { cell_id: "2e756d6e-f439-4411-bd40-2ebc3218378d", word: "kupendana", en: "to love each other", vi: "yêu nhau", pos: "verb", ngeli: "recip -an-" },
    ],
    cultural_notes_vi:
      "Hệ thống đuôi mở rộng là một trong những đặc điểm độc đáo nhất của " +
      "Swahili. Người bản xứ chồng 3–4 đuôi trên cùng một động từ. Dùng " +
      "đúng dạng ứng dụng khi nói về người hưởng lợi là dấu hiệu của người " +
      "nói có học thức. Dạng hỗ tương (-an-) rất phổ biến trong giao tiếp " +
      "xã hội hàng ngày.",
    cultural_notes_en:
      "The verb extension system is one of Swahili's most distinctive " +
      "features. Native speakers stack 3–4 extensions on one verb. Correct " +
      "use of the applicative for beneficiaries marks educated speech. The " +
      "reciprocal (-an-) is ubiquitous in daily social interaction.",
    tip_advice_vi:
      "Luyện hàng ngày: lấy gốc -som-, áp dụng từng đuôi theo chuỗi: " +
      "Nasoma → Ninasomea → Ninasomesha → Ninasomwa → Tunasomana → " +
      "Ninasomeshewa. Làm với 2–3 gốc khác mỗi ngày để thấm nhuần hệ thống.",
    tip_advice_en:
      "Daily drill: take root -som-, apply each extension in chain: " +
      "Nasoma → Ninasomea → Ninasomesha → Ninasomwa → Tunasomana → " +
      "Ninasomeshewa. Do this with 2–3 roots daily to internalize the system.",
  },

  // ══════════════════════════════════════════════════════════════════
  // C1-03 — Relative Clauses
  // ══════════════════════════════════════════════════════════════════
  {
    id: "swahili_c1_relative_clauses",
    level: "C1",
    category: "relative_clauses",
    title_vi: "Mệnh đề quan hệ chuyên sâu",
    title_en: "Relative Clauses in Depth",
    intro_vi:
      "Học hai cách tạo mệnh đề quan hệ: phương pháp amba- (rõ ràng, " +
      "trang trọng) và phương pháp tiếp tố (gọn, tự nhiên). Nắm vững " +
      "cách khớp dấu hiệu quan hệ với từng lớp danh từ, và kỹ thuật " +
      "lồng mệnh đề quan hệ trong mệnh đề quan hệ — dấu hiệu C1 thực thụ.",
    intro_en:
      "Learn two ways to form relative clauses: the amba- method (clear, " +
      "formal) and the infix method (compact, natural). Master how to " +
      "match relative markers to each noun class, and how to embed " +
      "relative clauses inside relative clauses — a true C1 marker.",
    sentences: [
      {
        sw: "Mtu ambaye anaimba ni dada yangu.",
        en: "The person who is singing is my sister.",
        vi: "Người đang hát là chị tôi.",
        pronunciation_focus: [
          "Mtu = người (lớp 1)",
          "a-MBA-ye = người mà (amba- lớp 1)",
          "a-na-I-mba = đang hát",
          "DA-da YAN-gu = chị của tôi",
        ],
        pronunciation_focus_en: [
          "Mtu = person (class 1)",
          "ambaye = who (amba- class 1)",
          "anaimba = is singing",
          "dada yangu = my sister",
        ],
      },
      {
        sw: "Vitabu ambavyo viko mezani ni vyangu.",
        en: "The books which are on the table are mine.",
        vi: "Những quyển sách ở trên bàn là của tôi.",
        pronunciation_focus: [
          "vi-TA-bu = sách (lớp 8)",
          "a-MBA-vyo = những cái mà (amba- lớp 8)",
          "VI-ko me-ZA-ni = ở trên bàn",
          "VYAN-gu = của tôi (lớp 8)",
        ],
        pronunciation_focus_en: [
          "vitabu = books (class 8)",
          "ambavyo = which (amba- class 8)",
          "viko mezani = are on the table",
          "vyangu = mine (class 8)",
        ],
      },
      {
        sw: "Mtoto anayecheza ni wangu.",
        en: "The child who is playing is mine.",
        vi: "Đứa trẻ đang chơi là của tôi.",
        pronunciation_focus: [
          "M-TO-to = đứa trẻ (lớp 1)",
          "a-NA-ye-che-za = đứa đang chơi (tiếp tố -ye- lớp 1)",
          "WAN-gu = của tôi (lớp 1)",
        ],
        pronunciation_focus_en: [
          "mtoto = child (class 1)",
          "anayecheza = who is playing (infix -ye- class 1)",
          "wangu = mine (class 1)",
        ],
      },
      {
        sw: "Chakula ninachokipenda ni wali.",
        en: "The food that I like is rice.",
        vi: "Món tôi thích là cơm.",
        pronunciation_focus: [
          "cha-KU-la = đồ ăn (lớp 7)",
          "ni-NA-cho-ki-PEN-da = cái mà tôi thích (tiếp tố -cho- lớp 7)",
          "WA-li = cơm",
        ],
        pronunciation_focus_en: [
          "chakula = food (class 7)",
          "ninachokipenda = that I like (infix -cho- class 7)",
          "wali = rice",
        ],
      },
      {
        sw: "Mwanafunzi ambaye alipata alama za juu zaidi atazawadiwa.",
        en: "The student who got the highest marks will be rewarded.",
        vi: "Học sinh đạt điểm cao nhất sẽ được thưởng.",
        pronunciation_focus: [
          "mwa-na-FUN-zi = học sinh (lớp 1)",
          "a-MBA-ye a-li-PA-ta = người mà đã đạt",
          "a-LA-ma za JU-u = điểm cao",
          "a-ta-za-wa-DI-wa = sẽ được thưởng",
        ],
        pronunciation_focus_en: [
          "mwanafunzi = student (class 1)",
          "ambaye alipata = who got",
          "alama za juu = high marks",
          "atazawadiwa = will be rewarded",
        ],
      },
      {
        sw: "Mtu ninayemjua ambaye anafanya kazi hospitalini ni daktari.",
        en: "The person I know who works at the hospital is a doctor.",
        vi: "Người tôi quen, làm ở bệnh viện, là bác sĩ.",
        pronunciation_focus: [
          "ni-NA-ye-m-JU-a = người mà tôi biết (tiếp tố -ye-)",
          "a-MBA-ye a-na-FA-nya = người mà làm (amba-)",
          "ho-spi-ta-LI-ni = ở bệnh viện",
          "dak-TA-ri = bác sĩ",
        ],
        pronunciation_focus_en: [
          "ninayemjua = whom I know (infix -ye-)",
          "ambaye anafanya = who works (amba-)",
          "hospitalini = at the hospital",
          "daktari = doctor",
        ],
      },
    ],
    vocabulary: [
      { cell_id: "8bb4f197-48c6-4bdc-8f06-47598b691165", word: "ambaye", en: "who (class 1 sg)", vi: "người mà (lớp 1)", pos: "rel. pronoun", ngeli: "1" },
      { cell_id: "3a5aef43-e835-4d93-9cfd-0560da2cee67", word: "ambao", en: "who (class 2 pl)", vi: "những người mà (lớp 2)", pos: "rel. pronoun", ngeli: "2" },
      { cell_id: "a912ad53-95ec-4956-8475-c1ca645a1ecd", word: "ambacho", en: "which (class 7)", vi: "cái mà (lớp 7)", pos: "rel. pronoun", ngeli: "7" },
      { cell_id: "f7c1a276-bed3-424b-b6d9-3ba07fd301e4", word: "ambavyo", en: "which (class 8)", vi: "những cái mà (lớp 8)", pos: "rel. pronoun", ngeli: "8" },
      { cell_id: "09d39da3-6cf5-4ebd-a7cf-01f5d1d06216", word: "ambayo", en: "which (classes 4/6/9)", vi: "cái mà (lớp 4/6/9)", pos: "rel. pronoun", ngeli: "4/6/9" },
      { cell_id: "a5acd5a9-78e5-44a6-90f3-db7a287b3e3b", word: "ambalo", en: "which (class 5)", vi: "cái mà (lớp 5)", pos: "rel. pronoun", ngeli: "5" },
      { cell_id: "1f992622-6f07-49b4-b2a7-fb175ea08fb2", word: "-ye-", en: "class 1 relative infix", vi: "tiếp tố quan hệ lớp 1", pos: "infix", ngeli: "1" },
      { cell_id: "9301ed6e-9717-4ee0-98b7-a3971bd5c67a", word: "-cho-", en: "class 7 relative infix", vi: "tiếp tố quan hệ lớp 7", pos: "infix", ngeli: "7" },
    ],
    cultural_notes_vi:
      "Trong văn nói hàng ngày, người Swahili ưa dùng tiếp tố (gọn, tự " +
      "nhiên). Amba- xuất hiện nhiều trong văn viết và phát biểu trang " +
      "trọng. Người nói nâng cao biết chọn cách nào dựa trên ngữ cảnh. " +
      "Lồng mệnh đề quan hệ (dùng cả tiếp tố lẫn amba- trong một câu) là " +
      "dấu hiệu bạn đang tư duy bằng tiếng Swahili.",
    cultural_notes_en:
      "In everyday speech, Swahili speakers prefer the infix (compact, " +
      "natural). Amba- appears more in writing and formal speeches. " +
      "Advanced speakers choose based on context. Embedding relatives " +
      "(using both infix and amba- in one sentence) shows you are " +
      "thinking in Swahili.",
    tip_advice_vi:
      "Chọn một danh từ, tạo 3 câu: (1) amba-, (2) tiếp tố, (3) lồng " +
      "ghép. Ví dụ: daktari → Daktari ambaye alinitibu ni mzuri. / " +
      "Daktari aliyenitibu ni mzuri. / Daktari ninayemjua ambaye alinitibu " +
      "jana ni mzuri sana. Làm với 3 danh từ mỗi ngày.",
    tip_advice_en:
      "Pick a noun, make 3 sentences: (1) amba-, (2) infix, (3) embedded. " +
      "Example: daktari → Daktari ambaye alinitibu ni mzuri. / Daktari " +
      "aliyenitibu ni mzuri. / Daktari ninayemjua ambaye alinitibu jana " +
      "ni mzuri sana. Do with 3 nouns daily.",
  },

  // ══════════════════════════════════════════════════════════════════
  // C1-04 — Idioms & Proverbs
  // ══════════════════════════════════════════════════════════════════
  {
    id: "swahili_c1_idioms_proverbs",
    level: "C1",
    category: "idioms_proverbs",
    title_vi: "Tục ngữ và thành ngữ Swahili",
    title_en: "Swahili Proverbs and Wisdom Sayings",
    intro_vi:
      "Khám phá thế giới tục ngữ Swahili (methali) và thành ngữ hiện đại. " +
      "Tục ngữ là trung tâm của văn hóa Swahili — được dùng hàng ngày " +
      "trong hội thoại, họp hành, và cả tin nhắn. Học chúng để tiếng " +
      "Swahili của bạn nghe khôn ngoan và gắn kết văn hóa sâu sắc.",
    intro_en:
      "Discover Swahili proverbs (methali) and modern idioms. Proverbs " +
      "are central to Swahili culture — used daily in conversation, " +
      "meetings, and even text messages. Learning them makes your Swahili " +
      "sound wise and culturally connected.",
    sentences: [
      {
        sw: "Haraka haraka haina baraka.",
        en: "Hurry hurry has no blessing. (Haste makes waste.)",
        vi: "Vội vã không có phước. (Dục tốc bất đạt.)",
        pronunciation_focus: [
          "ha-RA-ka = vội vàng",
          "ha-I-na = nó không có",
          "ba-RA-ka = phước lành",
        ],
        pronunciation_focus_en: [
          "haraka = hurry",
          "haina = it has no",
          "baraka = blessing",
        ],
      },
      {
        sw: "Polepole ndiyo mwendo.",
        en: "Slowly is indeed the way. (Slow and steady wins.)",
        vi: "Chậm rãi mới đúng là cách đi.",
        pronunciation_focus: [
          "po-LE-po-LE = từ từ, chậm rãi",
          "NDI-yo = quả thật là",
          "MWEN-do = cách đi, hành trình",
        ],
        pronunciation_focus_en: [
          "polepole = slowly",
          "ndiyo = indeed is",
          "mwendo = way / pace",
        ],
      },
      {
        sw: "Umoja ni nguvu, utengano ni udhaifu.",
        en: "Unity is strength, division is weakness.",
        vi: "Đoàn kết là sức mạnh, chia rẽ là yếu đuối.",
        pronunciation_focus: [
          "u-MO-ja = sự đoàn kết (lớp 14)",
          "NGU-vu = sức mạnh",
          "u-te-NGA-no = sự chia rẽ (lớp 14)",
          "u-dha-I-fu = sự yếu đuối (lớp 14)",
        ],
        pronunciation_focus_en: [
          "umoja = unity (class 14)",
          "nguvu = strength",
          "utengano = division (class 14)",
          "udhaifu = weakness (class 14)",
        ],
      },
      {
        sw: "Kidole kimoja hakivunji chawa.",
        en: "One finger does not crush a louse. (You need others.)",
        vi: "Một ngón tay không bóp chết được con rận.",
        pronunciation_focus: [
          "ki-DO-le = ngón tay (lớp 7)",
          "ki-MO-ja = một (lớp 7)",
          "ha-ki-VUN-ji = nó không bóp vỡ",
          "CHA-wa = con rận",
        ],
        pronunciation_focus_en: [
          "kidole = finger (class 7)",
          "kimoja = one (class 7)",
          "hakivunji = it does not crush",
          "chawa = louse",
        ],
      },
      {
        sw: "Subira huvuta heri.",
        en: "Patience pulls blessings.",
        vi: "Kiên nhẫn kéo phước về.",
        pronunciation_focus: [
          "su-BI-ra = kiên nhẫn",
          "hu-VU-ta = nó kéo (thói quen, hu-)",
          "HE-ri = phước lành, điều tốt",
        ],
        pronunciation_focus_en: [
          "subira = patience",
          "huvuta = it pulls (habitual hu-)",
          "heri = blessings / good things",
        ],
      },
      {
        sw: "Mvumilivu hula mbivu.",
        en: "The patient one eats ripe fruit.",
        vi: "Người kiên nhẫn ăn quả chín.",
        pronunciation_focus: [
          "m-vu-mi-LI-vu = người kiên nhẫn (lớp 1)",
          "HU-la = ăn (thói quen)",
          "MBI-vu = quả chín",
        ],
        pronunciation_focus_en: [
          "mvumilivu = patient person (class 1)",
          "hula = eats (habitual)",
          "mbivu = ripe fruit",
        ],
      },
      {
        sw: "Ana mkono mrefu.",
        en: "He has a long hand. (He is a thief / corrupt.)",
        vi: "Anh ta có tay dài. (Kẻ trộm / tham nhũng.)",
        pronunciation_focus: [
          "A-na = anh ấy có",
          "m-KO-no = bàn tay",
          "m-RE-fu = dài",
        ],
        pronunciation_focus_en: [
          "ana = he has",
          "mkono = hand",
          "mrefu = long",
        ],
      },
    ],
    vocabulary: [
      { cell_id: "e03398c1-b507-4888-8851-815510abc001", word: "methali", en: "proverb", vi: "tục ngữ", pos: "noun", ngeli: "9/10" },
      { cell_id: "283705df-391d-4f19-a132-09190e637ec5", word: "haraka", en: "hurry / speed", vi: "sự vội vã", pos: "noun", ngeli: "9" },
      { cell_id: "81e2de04-faa6-4ffe-8b93-091bf9513500", word: "baraka", en: "blessing", vi: "phước lành", pos: "noun", ngeli: "9/10" },
      { cell_id: "875b4424-1246-4bac-9040-80b424a604af", word: "subira", en: "patience", vi: "sự kiên nhẫn", pos: "noun", ngeli: "9" },
      { cell_id: "2a2f3152-1dfa-40cf-9bb9-f7595e09041d", word: "umoja", en: "unity", vi: "sự đoàn kết", pos: "noun", ngeli: "14" },
      { cell_id: "83734be0-ce77-4e60-90b0-12f585c586a7", word: "nguvu", en: "strength / power", vi: "sức mạnh", pos: "noun", ngeli: "9/10" },
      { cell_id: "20429531-45e0-4923-add0-ed6b8a99b5b4", word: "polepole", en: "slowly", vi: "từ từ, chậm rãi", pos: "adverb" },
      { cell_id: "fa42d2d8-0900-46ff-993e-deea3053eb5b", word: "mkono mrefu", en: "long hand (idiom: thief)", vi: "tay dài (kẻ trộm)", pos: "idiom" },
    ],
    idiom_glosses: [
      {
        idiom: "Haraka haraka haina baraka",
        literal: "Hurry hurry has no blessing",
        meaning: "Haste makes waste — rushing leads to mistakes",
        example: "Nilifanya makosa kwa sababu ya haraka. Kweli, haraka haraka haina baraka.",
        example_en: "I made mistakes because of rushing. Truly, haste makes waste.",
      },
      {
        idiom: "Kidole kimoja hakivunji chawa",
        literal: "One finger does not crush a louse",
        meaning: "You cannot do everything alone; cooperation is essential",
        example: "Tushirikiane, maana kidole kimoja hakivunji chawa.",
        example_en: "Let us cooperate, because one finger cannot crush a louse.",
      },
      {
        idiom: "Mvumilivu hula mbivu",
        literal: "The patient one eats ripe fruit",
        meaning: "Patience is rewarded; good things come to those who wait",
        example: "Usiwe na haraka. Mvumilivu hula mbivu.",
        example_en: "Don't be in a hurry. The patient one eats ripe fruit.",
      },
      {
        idiom: "Ana mkono mrefu",
        literal: "He has a long hand",
        meaning: "He is a thief or corrupt — reaches where he shouldn't",
        example: "Mkurugenzi huyo ana mkono mrefu — fedha zote zimepotea.",
        example_en: "That director has a long hand — all the money has disappeared.",
      },
    ],
    cultural_notes_vi:
      "Tục ngữ Swahili không phải là ngôn ngữ cổ — chúng được dùng sống " +
      "động hàng ngày ở Đông Phi. Mẫu chung: nêu tục ngữ, rồi liên kết " +
      "với tình huống hiện tại. Người Tanzania dẫn tục ngữ trong họp hành, " +
      "tranh luận, và cả tin nhắn WhatsApp. Đây là nghệ thuật giao tiếp " +
      "được trọng vọng.",
    cultural_notes_en:
      "Swahili proverbs are not archaic — they are used daily across East " +
      "Africa. The common pattern: state the proverb, then connect it to " +
      "the current situation. Tanzanians quote proverbs in meetings, " +
      "debates, and even WhatsApp messages. This is a respected art.",
    tip_advice_vi:
      "Học 1 câu tục ngữ mỗi ngày. Đọc to, viết tình huống dùng nó, rồi " +
      "nói cả cụm: tục ngữ + liên kết. Sau 1 tháng bạn có 30 câu để dùng " +
      "trong hội thoại thực tế.",
    tip_advice_en:
      "Learn 1 proverb per day. Say it aloud, write a situation for it, " +
      "then speak: proverb + connection. In 1 month you'll have 30 proverbs " +
      "ready for real conversation.",
  },

  // ══════════════════════════════════════════════════════════════════
  // C1-05 — Register
  // ══════════════════════════════════════════════════════════════════
  {
    id: "swahili_c1_register",
    level: "C1",
    category: "register",
    title_vi: "Phong cách trang trọng và thân mật",
    title_en: "Formal and Informal Swahili Register",
    intro_vi:
      "Học cách chuyển đổi giữa phong cách trang trọng và thân mật. " +
      "Nắm vững Shikamoo/Marahaba cho người lớn tuổi, danh xưng " +
      "Bwana/Bibi/Mheshimiwa cho môi trường chuyên nghiệp, và tiếng " +
      "lóng thân mật Mambo/Poa/Safi cho bạn bè.",
    intro_en:
      "Learn to shift between formal and informal registers. Master " +
      "Shikamoo/Marahaba for elders, titles Bwana/Bibi/Mheshimiwa for " +
      "professional settings, and casual Mambo/Poa/Safi for friends.",
    sentences: [
      {
        sw: "Shikamoo, mzee.",
        en: "I greet you with respect, elder.",
        vi: "Cháu kính chào bác.",
        pronunciation_focus: [
          "shi-ka-MO-o = con ôm chân ngài (kính trọng)",
          "MZE-e = người lớn tuổi",
        ],
        pronunciation_focus_en: [
          "Shikamoo = I hold your feet (respect greeting)",
          "mzee = elder",
        ],
      },
      {
        sw: "Marahaba, mwanangu.",
        en: "I accept your respect, my child.",
        vi: "Ta nhận sự kính trọng của con.",
        pronunciation_focus: [
          "ma-ra-HA-ba = ta nhận (đáp Shikamoo)",
          "mwa-NA-ngu = con của ta",
        ],
        pronunciation_focus_en: [
          "Marahaba = I accept (response to Shikamoo)",
          "mwanangu = my child",
        ],
      },
      {
        sw: "Bwana Mkurugenzi, nina ombi.",
        en: "Mr. Director, I have a request.",
        vi: "Thưa Ông Giám đốc, tôi có một thỉnh cầu.",
        pronunciation_focus: [
          "BWA-na = Ông / Ngài",
          "m-ku-ru-GEN-zi = giám đốc",
          "OM-bi = thỉnh cầu (lớp 5)",
        ],
        pronunciation_focus_en: [
          "Bwana = Mr. / Sir",
          "mkurugenzi = director",
          "ombi = request (class 5)",
        ],
      },
      {
        sw: "Mheshimiwa Waziri, asante kwa wito wako.",
        en: "Honorable Minister, thank you for your invitation.",
        vi: "Kính thưa Bộ trưởng, cảm ơn lời mời của ngài.",
        pronunciation_focus: [
          "m-he-shi-MI-wa = Kính thưa (quan chức)",
          "wa-ZI-ri = bộ trưởng",
          "WI-to = lời mời",
        ],
        pronunciation_focus_en: [
          "Mheshimiwa = Honorable (official title)",
          "Waziri = Minister",
          "wito = invitation",
        ],
      },
      {
        sw: "Mambo, vipi leo? — Poa, safi.",
        en: "What's up, how's today? — Cool, fine.",
        vi: "Ê bạn, hôm nay sao? — Ổn, ngon.",
        pronunciation_focus: [
          "MAM-bo = có gì không? (thân mật)",
          "VI-pi = như thế nào?",
          "PO-a = ngầu / ổn (thân mật)",
          "SA-fi = sạch / ổn (thân mật)",
        ],
        pronunciation_focus_en: [
          "Mambo = what's up? (informal)",
          "vipi = how?",
          "Poa = cool (informal)",
          "Safi = fine (informal)",
        ],
      },
      {
        sw: "Ndugu, tunapenda kukujulisha kwamba ombi lako limepokelewa.",
        en: "Dear Sir/Madam, we wish to inform you that your request has been received.",
        vi: "Kính gửi quý vị, chúng tôi xin thông báo đơn của quý vị đã được tiếp nhận.",
        pronunciation_focus: [
          "NDU-gu = kính gửi (trang trọng trung tính)",
          "tu-na-PEN-da = chúng tôi mong muốn",
          "li-me-po-ke-LE-wa = đã được tiếp nhận (bị động)",
        ],
        pronunciation_focus_en: [
          "Ndugu = Dear (formal neutral)",
          "tunapenda = we wish to",
          "limepokelewa = it has been received (passive)",
        ],
      },
    ],
    vocabulary: [
      { cell_id: "a47ab118-a8c8-46e6-87d8-c16a3b399d74", word: "Shikamoo", en: "respect greeting (elder)", vi: "kính chào người lớn", pos: "greeting" },
      { cell_id: "33480112-0a9e-4229-b5c3-4f86f798c617", word: "Marahaba", en: "acceptance of respect", vi: "nhận sự kính trọng", pos: "response" },
      { cell_id: "c87157a1-ed57-4cd4-8e90-317c25d818bb", word: "Bwana", en: "Mr. / Sir", vi: "Ông / Ngài", pos: "title" },
      { cell_id: "0c4936c5-0afe-445b-bfe7-a8cfc771689a", word: "Bibi", en: "Mrs. / Madam", vi: "Bà / Quý bà", pos: "title" },
      { cell_id: "c5c48709-18fb-4d22-93e5-626f96b51ba8", word: "Ndugu", en: "Comrade / Dear (neutral)", vi: "Kính gửi (trung tính)", pos: "title" },
      { cell_id: "0bf626bd-03f6-4dd4-9bc3-1782cfa3d747", word: "Mheshimiwa", en: "Honorable (official)", vi: "Kính thưa (quan chức)", pos: "title" },
      { cell_id: "6c1fd5f1-d436-40be-b0a0-75f2e3630766", word: "Mambo", en: "what's up? (informal)", vi: "có gì không? (thân mật)", pos: "greeting" },
      { cell_id: "8738064b-4f8b-45af-bbf1-e854e94e21f2", word: "Poa", en: "cool / fine (informal)", vi: "ổn / ngầu (thân mật)", pos: "response" },
    ],
    register_notes_vi:
      "Shikamoo TUYỆT ĐỐI không dùng với người cùng trang lứa hoặc trẻ " +
      "hơn — chỉ dành cho người lớn tuổi. Trong môi trường chuyên nghiệp, " +
      "luôn dùng Bwana/Bibi/Ndugu + chức danh. Với bạn bè, Swahili rút " +
      "gọn nhanh, gọn, thoải mái. Chuyển đổi linh hoạt giữa các phong " +
      "cách trong cùng cuộc trò chuyện là dấu hiệu nâng cao thực thụ.",
    register_notes_en:
      "Shikamoo is NEVER used with peers or younger people — only for " +
      "elders. In professional settings, always use Bwana/Bibi/Ndugu + " +
      "title. With friends, Swahili drops to fast, clipped, relaxed forms. " +
      "Fluid shifting between registers in one conversation is the mark " +
      "of a truly advanced speaker.",
    tip_advice_vi:
      "Diễn đạt cùng 1 ý bằng 3 phong cách: (1) kính trọng người lớn, " +
      "(2) trang trọng ngang hàng, (3) thân mật bạn bè. Ví dụ 'Tôi cần " +
      "bạn giúp' → Shikamoo mzee, naomba msaada wako. / Ndugu, ningehitaji " +
      "msaada wako. / Bro, naomba mkono tafadhali. Luyện 5 ý mỗi ngày.",
    tip_advice_en:
      "Express the same idea in 3 registers: (1) respectful to elder, " +
      "(2) formal to equal, (3) informal to friend. Example 'I need your " +
      "help' → Shikamoo mzee, naomba msaada wako. / Ndugu, ningehitaji " +
      "msaada wako. / Bro, naomba mkono tafadhali. Practice with 5 ideas daily.",
  },

  // ══════════════════════════════════════════════════════════════════
  // C1-06 — Noun Classes
  // ══════════════════════════════════════════════════════════════════
  {
    id: "swahili_c1_noun_classes",
    level: "C1",
    category: "noun_classes",
    title_vi: "Hòa hợp lớp danh từ nâng cao",
    title_en: "Advanced Noun Class Agreement",
    intro_vi:
      "Nâng cao khả năng hòa hợp lớp danh từ (ngeli) trên mọi thành " +
      "phần câu: tính từ, sở hữu, chỉ định từ, và động từ. Hòa hợp " +
      "hoàn hảo là điều phân biệt người nói nâng cao với trung cấp.",
    intro_en:
      "Deepen noun class agreement (ngeli) across all parts of speech: " +
      "adjectives, possessives, demonstratives, and verbs. Perfect " +
      "agreement is what separates advanced speakers from intermediate.",
    sentences: [
      {
        sw: "Mtu mzuri, watu wazuri.",
        en: "A good person, good people.",
        vi: "Người tốt, những người tốt.",
        pronunciation_focus: [
          "Mtu MZU-ri = người tốt (lớp 1, tính từ m-)",
          "Watu wa-ZU-ri = người tốt (lớp 2, tính từ wa-)",
        ],
        pronunciation_focus_en: [
          "mtu mzuri = good person (class 1 adj m-)",
          "watu wazuri = good people (class 2 adj wa-)",
        ],
      },
      {
        sw: "Gari langu kubwa lile linaenda.",
        en: "That big car of mine is going.",
        vi: "Chiếc xe lớn đó của tôi đang chạy.",
        pronunciation_focus: [
          "GA-ri LAN-gu = xe của tôi (sở hữu la-, lớp 5)",
          "KU-bwa = lớn (tính từ, lớp 5)",
          "LI-le = cái đó (chỉ định xa, lớp 5)",
          "li-na-EN-da = đang đi (chủ ngữ li-, lớp 5)",
        ],
        pronunciation_focus_en: [
          "gari langu = my car (poss la-, class 5)",
          "kubwa = big (adj, class 5)",
          "lile = that (far dem, class 5)",
          "linaenda = is going (subj li-, class 5)",
        ],
      },
      {
        sw: "Kitabu changu kizuri hiki kinazungumzia historia.",
        en: "This good book of mine discusses history.",
        vi: "Quyển sách hay này của tôi bàn về lịch sử.",
        pronunciation_focus: [
          "ki-TA-bu CHAN-gu = sách của tôi (sở hữu cha-, lớp 7)",
          "ki-ZU-ri = hay (tính từ ki-, lớp 7)",
          "HI-ki = cái này (chỉ định gần, lớp 7)",
          "ki-na-zu-ngu-MZI-a = bàn về (chủ ngữ ki-, lớp 7)",
        ],
        pronunciation_focus_en: [
          "kitabu changu = my book (poss cha-, class 7)",
          "kizuri = good (adj ki-, class 7)",
          "hiki = this (near dem, class 7)",
          "kinazungumzia = discusses (subj ki-, class 7)",
        ],
      },
      {
        sw: "Nilimwona jana.",
        en: "I saw him yesterday.",
        vi: "Tôi đã thấy anh ấy hôm qua.",
        pronunciation_focus: [
          "ni-li-MWO-na = tôi thấy anh ấy (tân ngữ -m-, lớp 1)",
          "JA-na = hôm qua",
        ],
        pronunciation_focus_en: [
          "nilimwona = I saw him (obj infix -m-, class 1)",
          "jana = yesterday",
        ],
      },
      {
        sw: "Tutakinunua kitabu.",
        en: "We will buy the book.",
        vi: "Chúng tôi sẽ mua quyển sách đó.",
        pronunciation_focus: [
          "tu-ta-KI-nu-NU-a = chúng tôi sẽ mua nó",
          "-ki- = tiếp tố tân ngữ lớp 7 (kitabu)",
        ],
        pronunciation_focus_en: [
          "tutakinunua = we will buy it",
          "-ki- = object infix class 7 (for kitabu)",
        ],
      },
      {
        sw: "Hiki kitabu ni changu, kile ni chako.",
        en: "This book is mine, that one is yours.",
        vi: "Quyển sách này của tôi, quyển kia của bạn.",
        pronunciation_focus: [
          "HI-ki ki-TA-bu = sách này (lớp 7)",
          "CHAN-gu = của tôi (lớp 7)",
          "KI-le = cái kia (lớp 7)",
          "CHA-ko = của bạn (lớp 7)",
        ],
        pronunciation_focus_en: [
          "hiki kitabu = this book (class 7)",
          "changu = mine (class 7)",
          "kile = that one (class 7)",
          "chako = yours (class 7)",
        ],
      },
    ],
    vocabulary: [
      { cell_id: "5d98798c-2c00-4101-862d-07ada4a19802", word: "huyu", en: "this (class 1)", vi: "người này (lớp 1)", pos: "demonstrative", ngeli: "1" },
      { cell_id: "ba385ccb-83b5-4f31-ab5b-075ed4ce97bd", word: "hawa", en: "these (class 2)", vi: "những người này (lớp 2)", pos: "demonstrative", ngeli: "2" },
      { cell_id: "99304b94-45a5-40c8-990a-861afb88b9b0", word: "hili", en: "this (class 5)", vi: "cái này (lớp 5)", pos: "demonstrative", ngeli: "5" },
      { cell_id: "70f69f5a-347b-4be5-b5ea-03f7218a8636", word: "hiki", en: "this (class 7)", vi: "cái này (lớp 7)", pos: "demonstrative", ngeli: "7" },
      { cell_id: "0d9e1167-360f-48fa-81ff-f03e98edcc23", word: "hii", en: "this (class 9)", vi: "cái này (lớp 9)", pos: "demonstrative", ngeli: "9" },
      { cell_id: "f6a6ffe7-8a70-48e0-b1ab-11c9c7a21ee2", word: "yule", en: "that (class 1)", vi: "người kia (lớp 1)", pos: "demonstrative", ngeli: "1" },
      { cell_id: "dac6f4b5-94c5-42d2-8fb8-cb210837495e", word: "lile", en: "that (class 5)", vi: "cái kia (lớp 5)", pos: "demonstrative", ngeli: "5" },
      { cell_id: "e15d5aa3-c534-49d8-9208-a56fc668337e", word: "kile", en: "that (class 7)", vi: "cái kia (lớp 7)", pos: "demonstrative", ngeli: "7" },
    ],
    cultural_notes_vi:
      "Hòa hợp lớp danh từ (ngeli) là 'trái tim' của ngữ pháp Swahili. " +
      "Người bản xứ cảm nhận lỗi hòa hợp ngay lập tức. Ở C1, hòa hợp " +
      "phải thành phản xạ tự động. Tiếp tố tân ngữ (-m-, -ki-, -li-, " +
      "v.v.) làm Swahili nghe chính xác và như người bản xứ — thiếu " +
      "chúng là dấu hiệu rõ nhất của người học.",
    cultural_notes_en:
      "Noun class agreement (ngeli) is the 'heart' of Swahili grammar. " +
      "Native speakers feel agreement errors immediately. At C1, " +
      "agreement must be automatic. Object infixes (-m-, -ki-, -li-, " +
      "etc.) make Swahili sound precise and native-like — missing them " +
      "is the clearest learner marker.",
    tip_advice_vi:
      "Xây chuỗi hòa hợp mỗi ngày: danh từ + tính từ + sở hữu + chỉ định " +
      "từ + động từ. Ví dụ: gari → gari kubwa langu hili linaenda. " +
      "Làm 1 chuỗi cho mỗi lớp danh từ.",
    tip_advice_en:
      "Build an agreement chain daily: noun + adjective + possessive + " +
      "demonstrative + verb. Example: gari → gari kubwa langu hili " +
      "linaenda. Do one chain per noun class.",
  },

  // ══════════════════════════════════════════════════════════════════
  // C1-07 — Narrative
  // ══════════════════════════════════════════════════════════════════
  {
    id: "swahili_c1_narrative",
    level: "C1",
    category: "narrative",
    title_vi: "Kể chuyện và tường thuật",
    title_en: "Narrative and Storytelling in Swahili",
    intro_vi:
      "Học nghệ thuật kể chuyện bằng tiếng Swahili: mở đầu với -li-, " +
      "chuỗi hành động với -ka-, đối thoại trực tiếp, cao trào với " +
      "ghafla, và kết thúc với mwishowe/hatimaye. Văn hóa Swahili rất " +
      "coi trọng truyền miệng — người kể chuyện giỏi được kính trọng.",
    intro_en:
      "Learn the art of Swahili storytelling: open with -li-, chain " +
      "actions with -ka-, use direct dialogue, climax with ghafla, and " +
      "resolve with mwishowe/hatimaye. Swahili culture is deeply oral — " +
      "good storytellers are respected in every community.",
    sentences: [
      {
        sw: "Hapo zamani za kale, palikuwa na mzee mmoja.",
        en: "Once upon a time, long ago, there was an old man.",
        vi: "Ngày xửa ngày xưa, có một ông già.",
        pronunciation_focus: [
          "HA-po za-MA-ni za KA-le = ngày xửa ngày xưa",
          "pa-li-KU-wa = có (lớp 16, -li- quá khứ)",
          "MZE-e MMO-ja = một ông già",
        ],
        pronunciation_focus_en: [
          "Hapo zamani za kale = once upon a time",
          "palikuwa = there was (class 16, -li- past)",
          "mzee mmoja = one old man",
        ],
      },
      {
        sw: "Alamka asubuhi, akaoga, akavaa nguo, akaenda shambani.",
        en: "He woke up, bathed, dressed, and went to the farm.",
        vi: "Ông thức dậy, tắm rửa, mặc đồ, rồi ra ruộng.",
        pronunciation_focus: [
          "a-LA-m-ka = ông thức dậy (-li- mở đầu)",
          "a-KA-o-ga = rồi tắm (-ka- liên tiếp)",
          "a-KA-va-a = rồi mặc",
          "a-KA-en-da sham-BA-ni = rồi ra ruộng",
        ],
        pronunciation_focus_en: [
          "alamka = he woke (-li- opening)",
          "akaoga = then bathed (-ka- consecutive)",
          "akavaa = then dressed",
          "akaenda shambani = then went to the farm",
        ],
      },
      {
        sw: "Akasema, 'Mimi nimechoka sana leo.'",
        en: "He said, 'I am very tired today.'",
        vi: "Ông nói, 'Hôm nay tôi mệt quá.'",
        pronunciation_focus: [
          "a-KA-SE-ma = rồi ông nói (-ka- dẫn lời)",
          "ni-me-CHO-ka = tôi đã mệt (hiện tại hoàn thành)",
          "SA-na = rất",
        ],
        pronunciation_focus_en: [
          "akasema = then he said (-ka- introduces speech)",
          "nimechoka = I am tired (present perfect)",
          "sana = very",
        ],
      },
      {
        sw: "Ghafla, akasikia sauti kubwa nyuma yake!",
        en: "Suddenly, he heard a loud voice behind him!",
        vi: "Bỗng nhiên, ông nghe một giọng lớn sau lưng!",
        pronunciation_focus: [
          "GHA-fla = bỗng nhiên (cao trào)",
          "a-ka-si-KI-a = rồi ông nghe",
          "sa-U-ti KU-bwa = giọng lớn",
          "NYU-ma YA-ke = sau lưng ông",
        ],
        pronunciation_focus_en: [
          "ghafla = suddenly (climax)",
          "akasikia = then he heard",
          "sauti kubwa = loud voice",
          "nyuma yake = behind him",
        ],
      },
      {
        sw: "Mwishowe, alirudi nyumbani akiwa na furaha.",
        en: "Finally, he returned home with joy.",
        vi: "Cuối cùng, ông trở về nhà với niềm vui.",
        pronunciation_focus: [
          "mwi-SHO-we = cuối cùng (kết)",
          "a-li-RU-di = ông trở về",
          "a-KI-wa na fu-RA-ha = trong niềm vui (-ki- trạng thái)",
        ],
        pronunciation_focus_en: [
          "mwishowe = finally (resolution)",
          "alirudi = he returned",
          "akiwa na furaha = with joy (-ki- state)",
        ],
      },
    ],
    vocabulary: [
      { cell_id: "671915d9-5279-4a3c-84ad-c77f97c4c848", word: "hapo zamani", en: "once upon a time", vi: "ngày xửa ngày xưa", pos: "phrase" },
      { cell_id: "bdac70c7-8b78-48d1-aaea-88a1c8cac20a", word: "ghafla", en: "suddenly", vi: "bỗng nhiên", pos: "adverb" },
      { cell_id: "d591d849-2537-48ae-a4a4-f87dbd3c6ff2", word: "hatimaye", en: "finally / at last", vi: "cuối cùng", pos: "adverb" },
      { cell_id: "8b0a2c78-c2e0-4192-bb94-ed710e73faee", word: "mwishowe", en: "in the end", vi: "cuối cùng", pos: "adverb" },
      { cell_id: "0fbe1e56-97c3-48d9-8a5c-842bf5b97410", word: "akasema", en: "then he/she said", vi: "rồi nói", pos: "verb (-ka-)" },
      { cell_id: "4e2e9114-4c72-48b7-8ac7-b384b6ca3ab6", word: "akamjibu", en: "then answered him/her", vi: "rồi trả lời", pos: "verb (-ka-)" },
      { cell_id: "d42107c3-c230-4ebd-815f-29fb724d309e", word: "kusimulia", en: "to narrate", vi: "kể chuyện", pos: "verb" },
      { cell_id: "bf3523c5-e733-4930-accd-764569089314", word: "hadithi", en: "story", vi: "câu chuyện", pos: "noun", ngeli: "9/10" },
    ],
    cultural_notes_vi:
      "Kể chuyện (kusimulia hadithi) là nghệ thuật được kính trọng trong " +
      "văn hóa Swahili. Thì -ka- là 'động cơ' của câu chuyện — nó cho " +
      "phép kể hàng loạt hành động mà không lặp chủ ngữ. Người nghe Đông " +
      "Phi mong đợi: mở đầu rõ ràng, chuỗi -ka-, đối thoại, một khoảnh " +
      "khắc ghafla, và bài học ở cuối.",
    cultural_notes_en:
      "Storytelling (kusimulia hadithi) is a respected art in Swahili " +
      "culture. -ka- is the 'engine' of the story — it chains actions " +
      "without repeating the subject. East African listeners expect: " +
      "clear setting, -ka- chain, dialogue, a ghafla moment, and a lesson.",
    tip_advice_vi:
      "Kể 1 câu chuyện ngắn mỗi ngày: (1) bối cảnh -li-, (2) 4–6 hành " +
      "động -ka-, (3) 1 câu đối thoại, (4) 1 khoảnh khắc ghafla, (5) kết " +
      "mwishowe/hatimaye. Tập kể to thành tiếng.",
    tip_advice_en:
      "Tell a short story daily: (1) -li- setting, (2) 4–6 -ka- actions, " +
      "(3) 1 line of dialogue, (4) a ghafla moment, (5) mwishowe/hatimaye " +
      "resolution. Speak it aloud.",
  },

  // ══════════════════════════════════════════════════════════════════
  // C1-08 — Academic / Abstract Concepts
  // ══════════════════════════════════════════════════════════════════
  {
    id: "swahili_c1_academic",
    level: "C1",
    category: "academic",
    title_vi: "Diễn đạt khái niệm trừu tượng",
    title_en: "Expressing Abstract Concepts in Swahili",
    intro_vi:
      "Học cách diễn đạt ý niệm trừu tượng: công lý, tự do, bình đẳng, " +
      "sự thay đổi, đạo đức. Từ vựng trừu tượng dựa vào lớp danh từ 14 " +
      "(u-: uhuru, usawa, umoja) và từ mượn Ả Rập (haki, dhana, sheria).",
    intro_en:
      "Learn to express abstract ideas: justice, freedom, equality, change, " +
      "morality. Abstract vocabulary draws on noun class 14 (u-: uhuru, " +
      "usawa, umoja) and Arabic loanwords (haki, dhana, sheria).",
    sentences: [
      {
        sw: "Uhuru ni haki ya kila mtu.",
        en: "Freedom is the right of every person.",
        vi: "Tự do là quyền của mỗi con người.",
        pronunciation_focus: [
          "u-HU-ru = tự do (lớp 14, trừu tượng)",
          "HA-ki = quyền / công lý (từ Ả Rập)",
          "KI-la MTU = mỗi người",
        ],
        pronunciation_focus_en: [
          "uhuru = freedom (class 14, abstract)",
          "haki = right / justice (Arabic loan)",
          "kila mtu = every person",
        ],
      },
      {
        sw: "Mabadiliko ya tabianchi yanaathiri kila kona ya dunia.",
        en: "Climate change affects every corner of the world.",
        vi: "Biến đổi khí hậu ảnh hưởng mọi ngóc ngách thế giới.",
        pronunciation_focus: [
          "ma-ba-di-LI-ko = biến đổi (lớp 6)",
          "ta-bi-AN-chi = khí hậu (từ Ả Rập)",
          "ya-na-a-THI-ri = chúng ảnh hưởng",
          "du-NI-a = thế giới",
        ],
        pronunciation_focus_en: [
          "mabadiliko = changes (class 6)",
          "tabianchi = climate (Arabic loan)",
          "yanaathiri = they affect",
          "dunia = world",
        ],
      },
      {
        sw: "Hali ya hewa inabadilika haraka sana.",
        en: "The climate is changing very rapidly. (intransitive)",
        vi: "Khí hậu đang tự thay đổi rất nhanh. (tự thân)",
        pronunciation_focus: [
          "HA-li ya HE-wa = khí hậu",
          "i-na-ba-di-LI-ka = tự thay đổi (stative -ik-)",
          "ha-RA-ka SA-na = rất nhanh",
        ],
        pronunciation_focus_en: [
          "hali ya hewa = climate",
          "inabadilika = it is changing (stative -ik-)",
          "haraka sana = very fast",
        ],
      },
      {
        sw: "Watu wanabadilisha mazingira kwa shughuli zao.",
        en: "People are changing the environment through their activities.",
        vi: "Con người đang làm thay đổi môi trường qua hoạt động.",
        pronunciation_focus: [
          "wa-na-ba-di-LI-sha = họ làm thay đổi (transitive -sh-)",
          "ma-zi-NGI-ra = môi trường",
          "shu-GHU-li = hoạt động",
        ],
        pronunciation_focus_en: [
          "wanabadilisha = they are changing (transitive -sh-)",
          "mazingira = environment",
          "shughuli = activities",
        ],
      },
      {
        sw: "Sheria mpya inalenga kulinda haki za wananchi wote.",
        en: "The new law aims to protect the rights of all citizens.",
        vi: "Luật mới nhằm bảo vệ quyền của mọi công dân.",
        pronunciation_focus: [
          "SHE-ri-a MPYA = luật mới",
          "i-na-LEN-ga = nó nhằm",
          "ku-LIN-da = bảo vệ",
          "wa-NAN-chi = công dân",
        ],
        pronunciation_focus_en: [
          "sheria mpya = new law",
          "inalenga = it aims to",
          "kulinda = to protect",
          "wananchi = citizens",
        ],
      },
    ],
    vocabulary: [
      { cell_id: "8fc4efda-cf04-45ed-ab06-e5964f5e2769", word: "uhuru", en: "freedom / independence", vi: "tự do", pos: "noun", ngeli: "14" },
      { cell_id: "e27479b3-d8fa-4ab5-9734-35946a422e4b", word: "usawa", en: "equality", vi: "sự bình đẳng", pos: "noun", ngeli: "14" },
      { cell_id: "0cdabc73-07f0-4838-b236-aed9263cea7d", word: "umoja", en: "unity", vi: "sự đoàn kết", pos: "noun", ngeli: "14" },
      { cell_id: "ed0fec07-1485-40f6-b012-aaac48079791", word: "haki", en: "justice / right", vi: "công lý / quyền", pos: "noun", ngeli: "9/10" },
      { cell_id: "8f654694-fba6-44fb-80ee-2e72c5214a30", word: "amani", en: "peace", vi: "hòa bình", pos: "noun", ngeli: "9/10" },
      { cell_id: "1ce07ba4-c4c8-4aa2-8818-02a13ef72de3", word: "sheria", en: "law", vi: "luật pháp", pos: "noun", ngeli: "9/10" },
      { cell_id: "148ed985-f471-43d5-a96a-fde5fde41f46", word: "dhana", en: "concept / idea", vi: "khái niệm", pos: "noun", ngeli: "9/10" },
      { cell_id: "a760f16e-d2a2-4cbd-8c1e-69649fdea551", word: "maarifa", en: "knowledge", vi: "tri thức", pos: "noun", ngeli: "6" },
      { cell_id: "7d3dd02b-10de-4926-9ec2-ef5774b2eb8e", word: "kubadilika", en: "to change (intransitive)", vi: "thay đổi (tự thân)", pos: "verb", ngeli: "stat -ik-" },
      { cell_id: "55ef204d-50d7-455e-b824-e8e4a074358a", word: "kubadilisha", en: "to change (transitive)", vi: "làm thay đổi", pos: "verb", ngeli: "caus -sh-" },
    ],
    cultural_notes_vi:
      "Lớp danh từ 14 (tiền tố u-) là cổng vào thế giới ý niệm: uhuru, " +
      "usawa, umoja, uadilifu… Từ mượn Ả Rập như haki, dhana, sheria mang " +
      "sắc thái học thuật và xuất hiện trong văn bản chính phủ, báo chí, " +
      "giáo dục đại học. Phân biệt kubadilika (tự thay đổi) và kubadilisha " +
      "(làm thay đổi) là điểm ngữ pháp C1 quan trọng.",
    cultural_notes_en:
      "Noun class 14 (u- prefix) is the gateway to abstract ideas: uhuru, " +
      "usawa, umoja, uadilifu… Arabic loanwords like haki, dhana, sheria " +
      "carry scholarly weight and appear in government, journalism, and " +
      "academia. The kubadilika vs. kubadilisha distinction is a key C1 " +
      "grammar point.",
    tip_advice_vi:
      "Chọn 1 khái niệm trừu tượng mỗi ngày, định nghĩa bằng Swahili, " +
      "cho ví dụ đời sống, bày tỏ quan điểm cá nhân — tất cả trong 60 " +
      "giây. Ví dụ: 'Uhuru ni hali ya mtu kuweza kufanya maamuzi yake " +
      "mwenyewe.'",
    tip_advice_en:
      "Pick an abstract concept daily, define it in Swahili, give a life " +
      "example, express a personal view — all in 60 seconds. Example: " +
      "'Uhuru ni hali ya mtu kuweza kufanya maamuzi yake mwenyewe.'",
  },

  // ══════════════════════════════════════════════════════════════════
  // C1-09 — Debate
  // ══════════════════════════════════════════════════════════════════
  {
    id: "swahili_c1_debate",
    level: "C1",
    category: "debate",
    title_vi: "Tiếng Swahili thuyết phục và tranh luận",
    title_en: "Persuasive and Argumentative Swahili",
    intro_vi:
      "Học ngôn ngữ thuyết phục: trình bày luận điểm 4 phần (Kwanza → " +
      "Pili → Tatu → Kwa hivyo), phản bác tôn trọng (Ninaheshimu maoni " +
      "yako, lakini…), câu hỏi tu từ, và dẫn chứng bằng số liệu.",
    intro_en:
      "Learn persuasive language: 4-part argument structure (Kwanza → " +
      "Pili → Tatu → Kwa hivyo), respectful refutation (Ninaheshimu " +
      "maoni yako, lakini…), rhetorical questions, and evidence.",
    sentences: [
      {
        sw: "Kwanza, ningependa kusema kwamba elimu ni muhimu kwa maendeleo.",
        en: "First, I would like to say that education is important for development.",
        vi: "Trước hết, tôi xin nói rằng giáo dục quan trọng cho sự phát triển.",
        pronunciation_focus: [
          "KWAN-za = trước hết",
          "ni-nge-PEN-da = tôi xin (-nge- lịch sự)",
          "ma-en-de-LE-o = sự phát triển",
        ],
        pronunciation_focus_en: [
          "kwanza = first",
          "ningependa = I would like (-nge- polite)",
          "maendeleo = development",
        ],
      },
      {
        sw: "Kwa mfano, nchi zenye elimu bora zina uchumi imara.",
        en: "For example, countries with good education have strong economies.",
        vi: "Ví dụ, các nước có giáo dục tốt có nền kinh tế vững mạnh.",
        pronunciation_focus: [
          "Kwa MFa-no = ví dụ",
          "NCHI ze-nye = các nước có",
          "e-LI-mu BO-ra = giáo dục tốt",
          "u-CHU-mi i-MA-ra = kinh tế vững mạnh",
        ],
        pronunciation_focus_en: [
          "Kwa mfano = for example",
          "nchi zenye = countries with",
          "elimu bora = good education",
          "uchumi imara = strong economy",
        ],
      },
      {
        sw: "Ninaheshimu maoni yako, lakini nina maoni tofauti.",
        en: "I respect your opinion, but I have a different view.",
        vi: "Tôi tôn trọng ý kiến bạn, nhưng tôi có quan điểm khác.",
        pronunciation_focus: [
          "ni-na-HE-shi-mu = tôi tôn trọng",
          "ma-O-ni YA-ko = ý kiến của bạn",
          "ma-O-ni to-FA-u-ti = quan điểm khác",
        ],
        pronunciation_focus_en: [
          "ninaheshimu = I respect",
          "maoni yako = your opinion",
          "maoni tofauti = different view",
        ],
      },
      {
        sw: "Je, hii ni haki?",
        en: "Is this justice?",
        vi: "Đây có phải là công lý không?",
        pronunciation_focus: [
          "Je = liệu (mở đầu câu hỏi tu từ)",
          "HI-i = đây",
          "HA-ki = công lý",
        ],
        pronunciation_focus_en: [
          "Je = (rhetorical question marker)",
          "hii = this",
          "haki = justice",
        ],
      },
      {
        sw: "Kulingana na utafiti, asilimia themanini wanakubaliana.",
        en: "According to research, eighty percent agree.",
        vi: "Theo nghiên cứu, 80% mọi người đồng ý.",
        pronunciation_focus: [
          "ku-li-NGA-na na = theo như",
          "u-ta-FI-ti = nghiên cứu",
          "a-si-li-MI-a = phần trăm",
          "wa-na-ku-ba-li-A-na = họ đồng ý",
        ],
        pronunciation_focus_en: [
          "kulingana na = according to",
          "utafiti = research",
          "asilimia = percent",
          "wanakubaliana = they agree",
        ],
      },
      {
        sw: "Kwa kumalizia, wito wangu ni tushirikiane kujenga mustakabali bora.",
        en: "In closing, my call is let us cooperate to build a better future.",
        vi: "Kết luận, tôi kêu gọi chúng ta hợp tác xây tương lai tốt đẹp hơn.",
        pronunciation_focus: [
          "Kwa ku-ma-LI-zi-a = để kết luận",
          "WI-to WAN-gu = lời kêu gọi của tôi",
          "tu-shi-ri-KI-a-ne = ta hợp tác",
          "mu-sta-ka-BA-li = tương lai (từ Ả Rập)",
        ],
        pronunciation_focus_en: [
          "Kwa kumalizia = in closing",
          "wito wangu = my call",
          "tushirikiane = let us cooperate",
          "mustakabali = future (Arabic loan)",
        ],
      },
    ],
    vocabulary: [
      { cell_id: "a855dbee-0f07-4873-aeb8-e86137e51d19", word: "kwanza", en: "first / firstly", vi: "trước hết", pos: "adverb" },
      { cell_id: "391a8348-434c-4880-9da3-60fd02d64da8", word: "pili", en: "second / secondly", vi: "thứ hai", pos: "adverb" },
      { cell_id: "2d990556-e128-4768-ade2-e294b0a5f35d", word: "kwa mfano", en: "for example", vi: "ví dụ", pos: "phrase" },
      { cell_id: "735e6181-209b-491b-80ff-9cd46dab2390", word: "kulingana na", en: "according to", vi: "theo như", pos: "phrase" },
      { cell_id: "93ef899d-011c-4727-9354-7c9198997426", word: "kwa kumalizia", en: "in closing", vi: "để kết luận", pos: "phrase" },
      { cell_id: "d9118887-1f59-489e-be23-1869eb2a202c", word: "kwa hivyo", en: "therefore", vi: "vì vậy", pos: "conjunction" },
      { cell_id: "5ca4af84-6023-4ee4-88b2-795f5d8381bb", word: "hoja", en: "argument / point", vi: "luận điểm", pos: "noun", ngeli: "9/10" },
      { cell_id: "bd01c35f-2057-4fe6-9d32-d9c2ae182f3a", word: "ushahidi", en: "evidence", vi: "bằng chứng", pos: "noun", ngeli: "14" },
    ],
    cultural_notes_vi:
      "Tranh luận Swahili đề cao tôn trọng và gián tiếp. Không bao giờ " +
      "tấn công cá nhân — luôn phản bác ý kiến. Cụm 'Ninaheshimu maoni " +
      "yako, lakini…' là mẫu câu bắt buộc trước mọi lời phản bác. Cấu " +
      "trúc 4 phần (Kwanza → Pili → Tatu → Kwa hivyo) là chuẩn mực.",
    cultural_notes_en:
      "Swahili debate culture values respect and indirectness. Never " +
      "attack the person — always refute the idea. 'Ninaheshimu maoni " +
      "yako, lakini…' is mandatory before any refutation. The 4-part " +
      "structure (Kwanza → Pili → Tatu → Kwa hivyo) is the standard.",
    tip_advice_vi:
      "Chọn 1 chủ đề, tranh luận cả 2 phía, mỗi bên 2 phút với cấu trúc " +
      "4 phần. Rồi tự phản bác với 'Ninaheshimu hoja hiyo, lakini…'. " +
      "Luyện cả 2 phía giúp tư duy linh hoạt.",
    tip_advice_en:
      "Pick a topic, argue both sides 2 min each using the 4-part " +
      "structure. Then refute yourself with 'Ninaheshimu hoja hiyo, " +
      "lakini…'. Practicing both sides builds flexible thinking.",
  },

  // ══════════════════════════════════════════════════════════════════
  // C1-10 — Business
  // ══════════════════════════════════════════════════════════════════
  {
    id: "swahili_c1_business",
    level: "C1",
    category: "business",
    title_vi: "Tiếng Swahili chuyên nghiệp và thương mại",
    title_en: "Professional and Business Swahili",
    intro_vi:
      "Học tiếng Swahili cho nơi làm việc: từ vựng họp hành, quy ước " +
      "email (Ndugu… Wako mtiifu…), câu đàm phán, và nghệ thuật từ chối " +
      "gián tiếp lịch sự đặc trưng của văn hóa kinh doanh Đông Phi.",
    intro_en:
      "Learn Swahili for the workplace: meeting vocabulary, email " +
      "conventions (Ndugu… Wako mtiifu…), negotiation phrases, and the " +
      "polite indirectness characteristic of East African business culture.",
    sentences: [
      {
        sw: "Ajenda ya leo ni kujadili maendeleo ya mradi wetu.",
        en: "Today's agenda is to discuss the progress of our project.",
        vi: "Chương trình hôm nay là thảo luận tiến độ dự án.",
        pronunciation_focus: [
          "a-JEN-da = chương trình",
          "ku-ja-DI-li = thảo luận",
          "ma-en-de-LE-o = tiến độ",
          "m-RA-di = dự án",
        ],
        pronunciation_focus_en: [
          "ajenda = agenda",
          "kujadili = to discuss",
          "maendeleo = progress",
          "mradi = project",
        ],
      },
      {
        sw: "Ningependa kuchangia jambo moja.",
        en: "I would like to contribute one point.",
        vi: "Tôi xin đóng góp một ý.",
        pronunciation_focus: [
          "ni-nge-PEN-da = tôi xin (lịch sự)",
          "ku-CHAN-gi-a = đóng góp",
          "JAM-bo = vấn đề / điểm",
        ],
        pronunciation_focus_en: [
          "ningependa = I would like (polite)",
          "kuchangia = to contribute",
          "jambo = point / matter",
        ],
      },
      {
        sw: "Mkutano umeahirishwa hadi Ijumaa.",
        en: "The meeting has been postponed until Friday.",
        vi: "Cuộc họp đã được dời đến thứ Sáu.",
        pronunciation_focus: [
          "m-ku-TA-no = cuộc họp",
          "u-me-a-hi-RI-shwa = đã được hoãn (bị động)",
          "I-ju-MA-a = thứ Sáu",
        ],
        pronunciation_focus_en: [
          "mkutano = meeting",
          "umeahirishwa = has been postponed (passive)",
          "Ijumaa = Friday",
        ],
      },
      {
        sw: "Naomba punguzo kidogo, tafadhali.",
        en: "I request a small discount, please.",
        vi: "Tôi xin giảm giá một chút ạ.",
        pronunciation_focus: [
          "na-O-mba = tôi xin",
          "pu-NGU-zo = sự giảm giá",
          "ki-DO-go = một chút",
          "ta-fa-DHA-li = làm ơn",
        ],
        pronunciation_focus_en: [
          "naomba = I request",
          "punguzo = discount",
          "kidogo = a little",
          "tafadhali = please",
        ],
      },
      {
        sw: "Labda tuangalie njia nyingine.",
        en: "Perhaps let us look at another way. (Polite refusal)",
        vi: "Có lẽ ta xem xét cách khác. (Từ chối lịch sự)",
        pronunciation_focus: [
          "LA-bda = có lẽ (từ chối gián tiếp)",
          "tu-a-NGA-li-e = ta xem xét (giả định)",
          "NJI-a nyi-NGI-ne = cách khác",
        ],
        pronunciation_focus_en: [
          "Labda = perhaps (indirect refusal)",
          "tuangalie = let us look (subjunctive)",
          "njia nyingine = another way",
        ],
      },
      {
        sw: "Natumaini barua pepe hii inakujia katika hali njema.",
        en: "I hope this email finds you well.",
        vi: "Tôi hy vọng email này đến với quý vị trong tình trạng tốt đẹp.",
        pronunciation_focus: [
          "na-tu-ma-I-ni = tôi hy vọng",
          "BA-ru-a PE-pe = email",
          "HA-li NJE-ma = tình trạng tốt",
        ],
        pronunciation_focus_en: [
          "natumaini = I hope",
          "barua pepe = email",
          "hali njema = good condition",
        ],
      },
    ],
    vocabulary: [
      { cell_id: "af3d0ee9-fdf1-42c2-a044-3db458084c15", word: "ajenda", en: "agenda", vi: "chương trình", pos: "noun", ngeli: "9/10" },
      { cell_id: "cf2df4c0-d6a4-40d1-b6d9-cf96d65223a2", word: "mkutano", en: "meeting", vi: "cuộc họp", pos: "noun", ngeli: "3/4" },
      { cell_id: "a11f9e36-3a26-4a3b-a822-6714c5753f9c", word: "kuchangia", en: "to contribute", vi: "đóng góp", pos: "verb" },
      { cell_id: "9f31cfda-96dd-4853-953c-98e8564236ab", word: "kuahirisha", en: "to postpone", vi: "hoãn", pos: "verb" },
      { cell_id: "579272e0-7848-4ce5-ba44-377f62459417", word: "punguzo", en: "discount", vi: "giảm giá", pos: "noun", ngeli: "5/6" },
      { cell_id: "ed940d0f-24ac-4ce2-b7b4-9ec4d67e4981", word: "makubaliano", en: "agreement", vi: "thỏa thuận", pos: "noun", ngeli: "6" },
      { cell_id: "4f9587a8-9f91-4253-9daf-d412e15796cd", word: "barua pepe", en: "email", vi: "thư điện tử", pos: "noun", ngeli: "9/10" },
      { cell_id: "67ca0355-7061-429f-94fa-2aa1e08907e4", word: "mkataba", en: "contract", vi: "hợp đồng", pos: "noun", ngeli: "3/4" },
    ],
    cultural_notes_vi:
      "Văn hóa kinh doanh Đông Phi coi trọng quan hệ trước giao dịch. " +
      "Từ chối trực tiếp bị coi là thô lỗ — thay vào đó dùng 'Labda " +
      "tuangalie njia nyingine' hoặc 'Ningehitaji kufikiria zaidi'. " +
      "Email mở đầu 'Ndugu' và kết 'Wako mtiifu' (trân trọng) hoặc " +
      "'Salamu njema' (lời chào tốt đẹp).",
    cultural_notes_en:
      "East African business culture values relationship before " +
      "transaction. Direct refusal is considered harsh — instead use " +
      "'Labda tuangalie njia nyingine' or 'Ningehitaji kufikiria zaidi'. " +
      "Emails open with 'Ndugu' and close with 'Wako mtiifu' (yours " +
      "faithfully) or 'Salamu njema' (best regards).",
    tip_advice_vi:
      "Mỗi ngày trong tuần, mô phỏng 1 tình huống: họp (thứ Hai), email " +
      "(thứ Ba), đàm phán (thứ Tư), thuyết trình (thứ Năm), từ chối lịch " +
      "sự (thứ Sáu). 5 phút nói to mỗi tình huống.",
    tip_advice_en:
      "Each weekday, simulate one scenario: meeting (Mon), email (Tue), " +
      "negotiation (Wed), presentation (Thu), polite refusal (Fri). " +
      "5 minutes aloud per scenario.",
  },

  // ══════════════════════════════════════════════════════════════════
  // C1-11 — Literary
  // ══════════════════════════════════════════════════════════════════
  {
    id: "swahili_c1_literary",
    level: "C1",
    category: "literary",
    title_vi: "Tiếng Swahili văn chương và thi ca",
    title_en: "Literary and Poetic Swahili",
    intro_vi:
      "Khám phá vẻ đẹp văn chương Swahili: ẩn dụ (Maisha ni safari), " +
      "so sánh (kama simba), nhân cách hóa (Upepo ulinong'ona), phép " +
      "lặp, và thể thơ shairi (4 dòng, 8 âm tiết, vần nhất quán).",
    intro_en:
      "Discover literary Swahili: metaphor (Maisha ni safari), simile " +
      "(kama simba), personification (Upepo ulinong'ona), repetition, " +
      "and the shairi poetic form (4 lines, 8 syllables, consistent rhyme).",
    sentences: [
      {
        sw: "Mwenye hasira kama simba.",
        en: "Angry like a lion.",
        vi: "Giận dữ như sư tử.",
        pronunciation_focus: [
          "MWE-nye ha-SI-ra = người giận dữ",
          "KA-ma = như (so sánh)",
          "SIM-ba = sư tử",
        ],
        pronunciation_focus_en: [
          "mwenye hasira = angry person",
          "kama = like (simile)",
          "simba = lion",
        ],
      },
      {
        sw: "Maisha ni safari ndefu.",
        en: "Life is a long journey.",
        vi: "Cuộc đời là chuyến đi dài.",
        pronunciation_focus: [
          "ma-I-sha = cuộc đời (lớp 6)",
          "sa-FA-ri = chuyến đi",
          "NDE-fu = dài",
        ],
        pronunciation_focus_en: [
          "maisha = life (class 6)",
          "safari = journey",
          "ndefu = long",
        ],
      },
      {
        sw: "Upepo ulinong'ona masikioni mwangu.",
        en: "The wind whispered in my ears.",
        vi: "Gió thì thầm bên tai tôi.",
        pronunciation_focus: [
          "u-PE-po = gió (lớp 14)",
          "u-li-NO-ng'o-na = đã thì thầm (nhân cách hóa)",
          "ma-si-KI-o-ni = trong tai",
        ],
        pronunciation_focus_en: [
          "upepo = wind (class 14)",
          "ulinong'ona = it whispered (personification)",
          "masikioni = in the ears",
        ],
      },
      {
        sw: "Kifo kilibisha hodi usiku ule.",
        en: "Death knocked at the door that night.",
        vi: "Cái chết gõ cửa đêm hôm đó.",
        pronunciation_focus: [
          "KI-fo = cái chết (lớp 7)",
          "ki-li-BI-sha HO-di = đã gõ cửa (nhân cách hóa)",
          "u-SI-ku U-le = đêm hôm đó",
        ],
        pronunciation_focus_en: [
          "kifo = death (class 7)",
          "kilibisha hodi = it knocked (personification)",
          "usiku ule = that night",
        ],
      },
      {
        sw: "Moyo wangu unaimba, moyo wangu unalia, moyo wangu unapenda.",
        en: "My heart sings, my heart cries, my heart loves.",
        vi: "Tim tôi hát, tim tôi khóc, tim tôi yêu.",
        pronunciation_focus: [
          "MO-yo WAN-gu = tim tôi",
          "u-na-I-mba = nó hát (phép lặp đầu câu)",
          "u-na-LI-a = nó khóc",
          "u-na-PEN-da = nó yêu",
        ],
        pronunciation_focus_en: [
          "moyo wangu = my heart",
          "unaimba = it sings (anaphora)",
          "unalia = it cries",
          "unapenda = it loves",
        ],
      },
    ],
    vocabulary: [
      { cell_id: "7c3f1947-5c3a-4a87-8718-3a0dcf5a8225", word: "ushairi", en: "poetry", vi: "thơ ca", pos: "noun", ngeli: "14" },
      { cell_id: "9bf4b8b9-7f77-416f-a798-65536725d66c", word: "shairi", en: "poem (4-line stanza)", vi: "bài thơ", pos: "noun", ngeli: "5/6" },
      { cell_id: "31b12b1e-ee5f-49b7-9b0d-483951b09d78", word: "utendi", en: "classical epic poem", vi: "sử thi cổ điển", pos: "noun", ngeli: "14" },
      { cell_id: "13e37713-aaa6-4b0c-aa5c-fb4c283d969a", word: "kina", en: "rhyme (in poetry)", vi: "vần thơ", pos: "noun", ngeli: "7/8" },
      { cell_id: "21d92e71-baee-4237-b321-8b49aec0a970", word: "kama", en: "like / as (simile)", vi: "như, giống như", pos: "conjunction" },
      { cell_id: "0fee5be7-ee56-4a7d-a753-ed7ffe63cd42", word: "mwandishi", en: "writer / author", vi: "nhà văn", pos: "noun", ngeli: "1/2" },
      { cell_id: "eac0776e-ea01-4772-a7fa-13b8e7f95ee0", word: "mhusika", en: "character (in story)", vi: "nhân vật", pos: "noun", ngeli: "1/2" },
      { cell_id: "edf67954-8022-4cb4-aa4c-be0479fc0a65", word: "dhamira", en: "theme / intention", vi: "chủ đề", pos: "noun", ngeli: "9/10" },
    ],
    cultural_notes_vi:
      "Thơ Swahili có quy tắc nghiêm ngặt. Thể shairi: 4 dòng/khổ, 8 âm " +
      "tiết/dòng, vần cuối nhất quán (kina). Shaaban Robert (Tanzania), " +
      "Euphrase Kezilahabi, Said Ahmed Mohamed là những tên tuổi lớn. " +
      "Nhân cách hóa khái niệm trừu tượng (Cái chết gõ cửa, Gió thì thầm) " +
      "là đặc trưng văn chương Swahili.",
    cultural_notes_en:
      "Swahili poetry has strict rules. The shairi form: 4 lines/stanza, " +
      "8 syllables/line, consistent end rhyme (kina). Shaaban Robert " +
      "(Tanzania), Euphrase Kezilahabi, Said Ahmed Mohamed are major " +
      "figures. Personifying abstract concepts (Death knocking, Wind " +
      "whispering) is a Swahili literary hallmark.",
    tip_advice_vi:
      "Sáng tác 1 khổ shairi mỗi ngày: 4 dòng, mỗi dòng 8 âm tiết, vần " +
      "cuối nhất quán. Ví dụ: Nakupenda kwa moyo wangu / Siku zote uko " +
      "ndani yangu / Upendo wetu ni mwanga / Unaong'aa kama jua.",
    tip_advice_en:
      "Compose 1 shairi stanza daily: 4 lines, 8 syllables each, " +
      "consistent end rhyme. Example: Nakupenda kwa moyo wangu / Siku " +
      "zote uko ndani yangu / Upendo wetu ni mwanga / Unaong'aa kama jua.",
  },

  // ══════════════════════════════════════════════════════════════════
  // C1-12 — Conditional
  // ══════════════════════════════════════════════════════════════════
  {
    id: "swahili_c1_conditional",
    level: "C1",
    category: "conditional",
    title_vi: "Câu điều kiện và giả định",
    title_en: "Conditional and Hypothetical Speech",
    intro_vi:
      "Học ba cấp độ điều kiện: -ki- (thực tế/có khả năng), -nge- " +
      "(giả định), -ngali- (phản thực quá khứ — điều đáng lẽ ra). " +
      "Thêm cách diễn đạt ước muốn (Laiti…) và tiếc nuối (Inaniumiza…).",
    intro_en:
      "Learn three conditional tiers: -ki- (real/likely), -nge- " +
      "(hypothetical), -ngali- (past counterfactual — what would have " +
      "been). Plus expressing wishes (Laiti…) and regret (Inaniumiza…).",
    sentences: [
      {
        sw: "Ukienda sokoni, utanunua matunda.",
        en: "If you go to the market, you will buy fruit.",
        vi: "Nếu bạn đi chợ, bạn sẽ mua trái cây.",
        pronunciation_focus: [
          "u-KI-en-da = nếu bạn đi (-ki- điều kiện thực)",
          "so-KO-ni = ở chợ",
          "u-ta-NU-nu-a = bạn sẽ mua (tương lai)",
        ],
        pronunciation_focus_en: [
          "ukienda = if you go (-ki- real)",
          "sokoni = at the market",
          "utanunua = you will buy (future)",
        ],
      },
      {
        sw: "Ningekuwa na pesa, ningenunua nyumba.",
        en: "If I had money, I would buy a house.",
        vi: "Nếu tôi có tiền, tôi sẽ mua nhà.",
        pronunciation_focus: [
          "ni-nge-KU-wa na = nếu tôi có (-nge- giả định)",
          "PE-sa = tiền",
          "ni-nge-NU-nu-a = tôi sẽ mua",
          "NYU-mba = nhà (lớp 9)",
        ],
        pronunciation_focus_en: [
          "ningekuwa na = if I had (-nge- hypothetical)",
          "pesa = money",
          "ningenunua = I would buy",
          "nyumba = house (class 9)",
        ],
      },
      {
        sw: "Ningalijua, ningalikuja mapema.",
        en: "If I had known, I would have come early.",
        vi: "Nếu tôi đã biết, tôi đã đến sớm.",
        pronunciation_focus: [
          "ni-nga-LI-ju-a = nếu đã biết (-ngali- phản thực)",
          "ni-nga-LI-ku-ja = tôi đã đến",
          "ma-PE-ma = sớm",
        ],
        pronunciation_focus_en: [
          "ningalijua = if I had known (-ngali- counterfactual)",
          "ningalikuja = I would have come",
          "mapema = early",
        ],
      },
      {
        sw: "Laiti ningekuwa na muda zaidi, ningesafiri sana.",
        en: "If only I had more time, I would travel a lot.",
        vi: "Ước gì tôi có nhiều thời gian hơn, tôi sẽ đi du lịch nhiều.",
        pronunciation_focus: [
          "La-I-ti = ước gì / giá mà",
          "ni-nge-KU-wa na = nếu tôi có",
          "MU-da za-I-di = thêm thời gian",
          "ni-nge-SA-fi-ri = tôi sẽ đi du lịch",
        ],
        pronunciation_focus_en: [
          "Laiti = if only / I wish",
          "ningekuwa na = if I had",
          "muda zaidi = more time",
          "ningesafiri = I would travel",
        ],
      },
      {
        sw: "Inaniumiza kwamba sikuja.",
        en: "It hurts me that I did not come.",
        vi: "Tôi đau lòng vì đã không đến.",
        pronunciation_focus: [
          "i-na-ni-u-MI-za = nó làm tôi đau (tiếc nuối)",
          "KWA-mba = rằng",
          "SI-ku-ja = tôi đã không đến",
        ],
        pronunciation_focus_en: [
          "inaniumiza = it hurts me (regret)",
          "kwamba = that",
          "sikuja = I did not come",
        ],
      },
    ],
    vocabulary: [
      { cell_id: "d67a7639-b7e4-4bd2-8e49-ee0bff673265", word: "-ki-", en: "if (real condition)", vi: "nếu (điều kiện thực)", pos: "infix" },
      { cell_id: "43df8a03-1752-4271-9d37-4d2b0ab0904a", word: "-nge-", en: "if (hypothetical)", vi: "nếu (giả định)", pos: "infix" },
      { cell_id: "5ac4df2e-7e4f-4c54-8fd2-64501b310909", word: "-ngali-", en: "if (past counterfactual)", vi: "nếu (phản thực QK)", pos: "infix" },
      { cell_id: "d63ba5be-6fa0-46cc-b894-0dd3832cc300", word: "laiti", en: "if only / I wish", vi: "ước gì / giá mà", pos: "particle" },
      { cell_id: "9f47ed36-579d-4911-b5d0-adff261eeb6e", word: "labda", en: "maybe / perhaps", vi: "có lẽ", pos: "adverb" },
      { cell_id: "b349529f-2a64-43cd-ba7b-d5e294b62bb6", word: "huenda", en: "it may be / possibly", vi: "có thể là", pos: "adverb" },
      { cell_id: "8aedf936-e622-4dcf-9f57-f4a4f13d31c4", word: "inaniumiza", en: "it hurts me", vi: "tôi đau lòng", pos: "phrase" },
      { cell_id: "6473f45c-2f86-4a7d-bbed-792ba90ee40c", word: "kujuta", en: "to regret", vi: "hối tiếc", pos: "verb" },
    ],
    cultural_notes_vi:
      "Ba cấp độ điều kiện là kỹ năng C1 định hình. -ki- cho tình huống " +
      "thực; -nge- cho giả định (có thể nhưng không chắc); -ngali- cho " +
      "phản thực quá khứ — mang sắc thái tiếc nuối và suy ngẫm. 'Laiti' " +
      "thường xuất hiện trong thơ ca và lời tâm sự.",
    cultural_notes_en:
      "The three conditional tiers are defining C1 skills. -ki- for real " +
      "situations; -nge- for hypotheticals (possible but uncertain); " +
      "-ngali- for past counterfactuals — carrying regret and reflection. " +
      "'Laiti' is common in poetry and personal reflection.",
    tip_advice_vi:
      "Tạo chuỗi điều kiện: thực → giả định → phản thực. Ví dụ: (1) " +
      "Nikisoma, nitafaulu. (2) Ningesoma, ningefaulu. (3) Ningalisoma, " +
      "ningalifaulu. Làm với 3 động từ mỗi ngày.",
    tip_advice_en:
      "Build a conditional chain: real → hypothetical → counterfactual. " +
      "Example: (1) Nikisoma, nitafaulu. (2) Ningesoma, ningefaulu. " +
      "(3) Ningalisoma, ningalifaulu. Do with 3 verbs daily.",
  },

  // ══════════════════════════════════════════════════════════════════
  // C1-13 — Cultural Nuances
  // ══════════════════════════════════════════════════════════════════
  {
    id: "swahili_c1_cultural_nuances",
    level: "C1",
    category: "cultural_nuances",
    title_vi: "Sắc thái văn hóa trong giao tiếp",
    title_en: "Cultural Nuances in Swahili Communication",
    intro_vi:
      "Khám phá các lớp văn hóa sâu trong giao tiếp: nghệ thuật nói " +
      "'không' mà không nói 'không' (Labda baadaye, Tutaona…), nghi " +
      "thức chào hỏi, văn hóa hiếu khách, và quan hệ đùa cợt utani.",
    intro_en:
      "Explore deep cultural layers in communication: the art of saying " +
      "'no' without saying 'no' (Labda baadaye, Tutaona…), greeting " +
      "rituals, hospitality culture, and the utani joking relationship.",
    sentences: [
      {
        sw: "Labda baadaye.",
        en: "Maybe later. (Polite refusal — means 'no')",
        vi: "Có lẽ để sau. (Từ chối lịch sự — nghĩa là 'không')",
        pronunciation_focus: [
          "LA-bda = có lẽ (từ chối gián tiếp)",
          "ba-a-DA-ye = sau này",
        ],
        pronunciation_focus_en: [
          "Labda = maybe (indirect refusal)",
          "baadaye = later",
        ],
      },
      {
        sw: "Nitajaribu.",
        en: "I will try. (Polite refusal — means 'probably not')",
        vi: "Tôi sẽ cố. (Từ chối — nghĩa là 'chắc không')",
        pronunciation_focus: [
          "ni-ta-ja-RI-bu = tôi sẽ cố (thực ra: từ chối)",
        ],
        pronunciation_focus_en: [
          "nitajaribu = I will try (actually: refusal)",
        ],
      },
      {
        sw: "Tutaona.",
        en: "We will see. (Polite refusal — means 'unlikely')",
        vi: "Chúng ta sẽ xem. (Từ chối — 'khó đấy')",
        pronunciation_focus: [
          "tu-ta-O-na = chúng ta sẽ xem (từ chối gián tiếp)",
        ],
        pronunciation_focus_en: [
          "tutaona = we will see (indirect refusal)",
        ],
      },
      {
        sw: "Karibu! Tafadhali, usione aibu.",
        en: "Welcome! Please, don't feel shy.",
        vi: "Mời vào! Làm ơn đừng ngại.",
        pronunciation_focus: [
          "ka-RI-bu = chào mừng / mời vào",
          "ta-fa-DHA-li = làm ơn",
          "u-si-O-ne A-I-bu = đừng ngại",
        ],
        pronunciation_focus_en: [
          "Karibu = welcome / come in",
          "Tafadhali = please",
          "usione aibu = don't feel shy",
        ],
      },
      {
        sw: "Ahsante sana, umenitesa!",
        en: "Thank you very much, you have made me suffer! (complimenting hospitality)",
        vi: "Cảm ơn nhiều, bạn đã hành hạ tôi! (khen hiếu khách)",
        pronunciation_focus: [
          "ah-SAN-te SA-na = cảm ơn rất nhiều",
          "u-me-ni-TE-sa = bạn đã làm tôi khổ (khen hiếu khách)",
        ],
        pronunciation_focus_en: [
          "ahsante sana = thank you very much",
          "umenitesa = you made me suffer (hospitality compliment)",
        ],
      },
    ],
    vocabulary: [
      { cell_id: "a891021e-d2c3-4de3-80c7-2b6d1a063638", word: "labda", en: "maybe (indirect no)", vi: "có lẽ (từ chối)", pos: "adverb" },
      { cell_id: "133145e5-2bd4-47b0-bcbc-e5d868f43164", word: "tutaona", en: "we will see (indirect no)", vi: "để xem (từ chối)", pos: "phrase" },
      { cell_id: "a284801e-6013-4fe5-9677-9920c40bc5b6", word: "nitajaribu", en: "I will try (indirect no)", vi: "tôi sẽ cố (từ chối)", pos: "phrase" },
      { cell_id: "e23e1cf7-6b3f-4b4f-b016-1395fe1f8283", word: "bado", en: "not yet (indirect no)", vi: "chưa (từ chối)", pos: "adverb" },
      { cell_id: "82be1ef2-6359-4ddc-bf83-4a0858c812d3", word: "aibu", en: "shame / embarrassment", vi: "sự ngại ngùng", pos: "noun", ngeli: "9" },
      { cell_id: "29ac9b82-8dcd-41a0-9380-97ce7f236c1f", word: "heshima", en: "respect / honor", vi: "sự kính trọng", pos: "noun", ngeli: "9" },
      { cell_id: "bc70060a-b636-45f9-adf1-68b2da612ef9", word: "ukarimu", en: "hospitality / generosity", vi: "lòng hiếu khách", pos: "noun", ngeli: "14" },
      { cell_id: "d2d3439b-722f-494c-a706-a21913a04b2e", word: "utani", en: "joking relationship", vi: "quan hệ đùa cợt", pos: "noun", ngeli: "14" },
    ],
    cultural_notes_vi:
      "Từ chối trực tiếp bị coi là thô lỗ trong văn hóa Swahili. 'Labda " +
      "baadaye', 'Nitajaribu', 'Tutaona', 'Bado' — không câu nào nói " +
      "'không' nhưng đều được hiểu là từ chối. Văn hóa hiếu khách: chủ " +
      "nhà ép ('Tafadhali, usione aibu!'), khách từ chối vài lần trước " +
      "khi nhận. 'Ahsante, umenitesa!' là lời khen hiếu khách cao nhất.",
    cultural_notes_en:
      "Direct refusal is considered rude in Swahili culture. 'Labda " +
      "baadaye', 'Nitajaribu', 'Tutaona', 'Bado' — none says 'no' but " +
      "all mean refusal. Hospitality rituals: host insists ('Tafadhali, " +
      "usione aibu!'), guest politely refuses several times before " +
      "accepting. 'Ahsante, umenitesa!' is the highest hospitality " +
      "compliment.",
    tip_advice_vi:
      "Thực hành trọn vẹn 1 tình huống văn hóa mỗi ngày: ghé thăm nhà " +
      "người Swahili, từ gõ cửa ('Hodi!') đến chào tạm biệt ('Kwaheri, " +
      "tutaonana tena'). Tập toàn bộ chuỗi tương tác.",
    tip_advice_en:
      "Practice a complete cultural scenario daily: visiting a Swahili " +
      "home, from knocking ('Hodi!') to goodbye ('Kwaheri, tutaonana " +
      "tena'). Practice the entire interaction chain.",
  },

  // ══════════════════════════════════════════════════════════════════
  // C1-14 — Opinions
  // ══════════════════════════════════════════════════════════════════
  {
    id: "swahili_c1_opinions",
    level: "C1",
    category: "opinions",
    title_vi: "Diễn đạt quan điểm chính xác",
    title_en: "Expressing Opinions with Precision",
    intro_vi:
      "Học cách bày tỏ quan điểm rõ ràng, lịch sự, và có sắc thái. " +
      "Ở C1, ý kiến mạnh phải nghe cân bằng và chín chắn. Bao gồm: " +
      "đồng ý có bổ sung, không đồng ý lịch sự, thêm góc nhìn, diễn " +
      "đạt sự không chắc chắn, và ý kiến mạnh mẽ nhưng bình tĩnh.",
    intro_en:
      "Learn to express opinions clearly, politely, and with nuance. " +
      "At C1, strong ideas must sound balanced and thoughtful. Covers: " +
      "agreement with added detail, polite disagreement, adding " +
      "perspective, expressing uncertainty, and calm strong opinions.",
    sentences: [
      {
        sw: "Mimi naona tofauti kidogo.",
        en: "I see it a little differently.",
        vi: "Tôi thấy hơi khác một chút.",
        pronunciation_focus: [
          "MI-mi na-O-na = tôi thấy (ý kiến nhẹ nhàng)",
          "to-fa-U-ti = khác biệt",
          "ki-DO-go = một chút (làm mềm)",
        ],
        pronunciation_focus_en: [
          "mimi naona = I see (soft opinion)",
          "tofauti = different",
          "kidogo = a little (softener)",
        ],
      },
      {
        sw: "Nakubaliana na wewe, hasa kuhusu suala la elimu.",
        en: "I agree with you, especially regarding education.",
        vi: "Tôi đồng ý với bạn, đặc biệt về vấn đề giáo dục.",
        pronunciation_focus: [
          "na-ku-ba-li-A-na = tôi đồng ý",
          "HA-sa = đặc biệt",
          "ku-HU-su = về",
          "su-A-la = vấn đề",
        ],
        pronunciation_focus_en: [
          "nakubaliana = I agree",
          "hasa = especially",
          "kuhusu = regarding",
          "suala = issue",
        ],
      },
      {
        sw: "Ninaelewa unachosema, lakini nina mtazamo tofauti.",
        en: "I understand what you're saying, but I have a different perspective.",
        vi: "Tôi hiểu điều bạn nói, nhưng tôi có góc nhìn khác.",
        pronunciation_focus: [
          "ni-na-e-LE-wa = tôi hiểu",
          "u-NA-cho-SE-ma = điều bạn đang nói",
          "m-ta-ZA-mo = góc nhìn",
        ],
        pronunciation_focus_en: [
          "ninaelewa = I understand",
          "unachosema = what you're saying",
          "mtazamo = perspective",
        ],
      },
      {
        sw: "Kuna mtazamo mwingine ambao ni muhimu kuzingatia.",
        en: "There is another perspective which is important to consider.",
        vi: "Có góc nhìn khác cũng quan trọng cần xem xét.",
        pronunciation_focus: [
          "KU-na = có (tồn tại)",
          "m-ta-ZA-mo MWI-ngi-ne = góc nhìn khác",
          "ku-ZIN-ga-ti-a = xem xét / cân nhắc",
        ],
        pronunciation_focus_en: [
          "kuna = there is",
          "mtazamo mwingine = another perspective",
          "kuzingatia = to consider",
        ],
      },
      {
        sw: "Bado ninafikiria jambo hili. Sina uhakika kabisa.",
        en: "I am still thinking about this. I am not completely sure.",
        vi: "Tôi vẫn đang nghĩ về việc này. Tôi chưa hoàn toàn chắc chắn.",
        pronunciation_focus: [
          "BA-do = vẫn còn / chưa",
          "ni-na-fi-KI-ri-a = tôi đang nghĩ",
          "SI-na u-ha-KI-ka = tôi không chắc chắn",
          "ka-BI-sa = hoàn toàn",
        ],
        pronunciation_focus_en: [
          "bado = still / not yet",
          "ninafikiria = I am thinking",
          "sina uhakika = I am not sure",
          "kabisa = completely",
        ],
      },
      {
        sw: "Ninaamini kwa dhati kwamba hii ndiyo njia sahihi.",
        en: "I firmly believe that this is the right way.",
        vi: "Tôi tin tưởng vững chắc rằng đây là con đường đúng.",
        pronunciation_focus: [
          "ni-na-A-mi-ni = tôi tin",
          "kwa DHA-ti = vững chắc / chân thành",
          "NDI-yo = quả thật là (nhấn mạnh)",
          "NJI-a sa-HI-hi = con đường đúng",
        ],
        pronunciation_focus_en: [
          "ninaamini = I believe",
          "kwa dhati = firmly / sincerely",
          "ndiyo = indeed (emphasis)",
          "njia sahihi = the right way",
        ],
      },
    ],
    vocabulary: [
      { cell_id: "31782d3e-105f-4791-b9d0-89e068605ab5", word: "naona", en: "I see / in my view", vi: "tôi thấy", pos: "phrase" },
      { cell_id: "b519e357-5c4a-4b11-ac12-555c15dc64d7", word: "nakubaliana", en: "I agree", vi: "tôi đồng ý", pos: "verb" },
      { cell_id: "e481293b-ce6b-4c9d-b6c7-5bd3f98c7c16", word: "ninaelewa", en: "I understand", vi: "tôi hiểu", pos: "verb" },
      { cell_id: "489fd59f-c40b-4990-af8a-8d58e8fa60d8", word: "mtazamo", en: "perspective / viewpoint", vi: "góc nhìn", pos: "noun", ngeli: "3/4" },
      { cell_id: "e3d81c2b-e353-49ef-94f3-74e8e0b6b634", word: "kwa dhati", en: "firmly / sincerely", vi: "vững chắc / chân thành", pos: "adverb" },
      { cell_id: "9fd50a14-1df4-4dab-add6-f23824d59468", word: "uhakika", en: "certainty / sureness", vi: "sự chắc chắn", pos: "noun", ngeli: "14" },
      { cell_id: "2a95f2c2-69b3-44cb-a7fc-c2bb4eaf97dd", word: "kuzingatia", en: "to consider", vi: "xem xét", pos: "verb" },
      { cell_id: "9292dfdd-92e2-4f6b-8cb9-a3154a120c31", word: "suala", en: "issue / matter", vi: "vấn đề", pos: "noun", ngeli: "5/6" },
    ],
    cultural_notes_vi:
      "Trong giao tiếp Swahili, mọi ý kiến nên được làm mềm để nghe tôn " +
      "trọng — ngay cả ý kiến mạnh. Đồng ý nên thêm chi tiết (thể hiện " +
      "lắng nghe tích cực). Không đồng ý đòi hỏi công nhận quan điểm " +
      "người kia trước. Diễn đạt không chắc chắn ('Bado ninafikiria…') " +
      "được coi là khiêm tốn trí tuệ, không phải yếu đuối. Ý kiến mạnh " +
      "mẽ nhưng bình tĩnh có trọng lượng hơn ý kiến kích động.",
    cultural_notes_en:
      "In Swahili communication, all opinions should be softened to sound " +
      "respectful — even strong ones. Agreement should add detail (showing " +
      "active listening). Disagreement requires acknowledging the other's " +
      "view first. Expressing uncertainty ('Bado ninafikiria…') is seen as " +
      "intellectual humility, not weakness. A calm strong opinion carries " +
      "more weight than an agitated one.",
    tip_advice_vi:
      "Chọn 1 chủ đề, diễn đạt 5 kiểu ý kiến: (1) đồng ý có bổ sung, " +
      "(2) không đồng ý lịch sự, (3) thêm góc nhìn mới, (4) bày tỏ không " +
      "chắc chắn, (5) ý kiến mạnh nhưng bình tĩnh. Mỗi kiểu 30 giây.",
    tip_advice_en:
      "Pick a topic, express 5 types of opinion: (1) agreement with added " +
      "detail, (2) polite disagreement, (3) adding new perspective, " +
      "(4) expressing uncertainty, (5) calm strong opinion. 30 seconds each.",
  },
];

export default lessons;
