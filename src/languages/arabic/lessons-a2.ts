// src/languages/arabic/lessons-a2.ts
//
// Arabic A2 lessons for Vietnamese-speaking and English-speaking learners.
//
// Scope: Modern Standard Arabic first, with tiny dialect-awareness notes only
// where they prevent surprise. The canonical learner target is Arabic script in
// `ar`; `romanization` is a beginner support, not an answer key. This file is
// lesson data only; integration wiring belongs to separate W2/W3 briefs.

import type { ArabicLesson } from "./lessons";

export const lessons: ArabicLesson[] = [
  {
    id: "arabic_a2_daily_routine",
    level: "A2",
    category: "daily_routine",
    title_vi: "Sinh hoạt hằng ngày",
    title_en: "Daily routine",
    intro_vi:
      "Bài A2 này giúp bạn nói lịch sinh hoạt bằng câu ngắn trong tiếng Ả Rập chuẩn hiện đại. Trọng tâm là thì hiện tại ngôi thứ nhất và cụm thời gian; khác tiếng Việt, động từ Ả Rập bắt đầu cho biết người làm hành động.",
    intro_en:
      "This A2 lesson lets you describe a daily schedule in short Modern Standard Arabic sentences. The focus is first-person present verbs and time phrases; unlike English, Arabic marks the person inside the verb form.",
    vocabulary: [
      { cell_id: "5aa018cf-9529-4ca7-a628-5498bde9aac9", ar: "أستيقظ", romanization: "astayqiz", vi: "tôi thức dậy", en: "I wake up", pos: "verb" },
      { cell_id: "408a65ca-63cc-4160-b01b-f9ef56139f85", ar: "أدرس", romanization: "adrus", vi: "tôi học", en: "I study", pos: "verb" },
      { cell_id: "9a5ec25e-c2db-4e35-9a3e-6bbb8fda89c1", ar: "أعمل", romanization: "a'mal", vi: "tôi làm việc", en: "I work", pos: "verb" },
      { cell_id: "8a46d737-1dfe-4c45-ab4f-ca1ff5181c02", ar: "أذهب", romanization: "adhhab", vi: "tôi đi", en: "I go", pos: "verb" },
      { cell_id: "c3dae8c0-3761-49a6-9f6c-e8144e7b36ae", ar: "في الصباح", romanization: "fi as-sabaah", vi: "vào buổi sáng", en: "in the morning", pos: "phrase" },
      { cell_id: "8865293e-8914-4170-87fe-b58db2d027cf", ar: "ثم", romanization: "thumma", vi: "sau đó", en: "then", pos: "connector" },
    ],
    sentences: [
      {
        ar: "أستيقظ في الساعة السابعة.",
        romanization: "astayqiz fii as-saa'a as-saabi'a",
        vi: "Tôi thức dậy lúc bảy giờ.",
        en: "I wake up at seven o'clock.",
        pronunciation_focus: [
          "أ ở đầu từ là hamza: bắt đầu rõ, không nuốt âm.",
          "الساعة có chữ ع; đây là phụ âm cổ họng, không phải nguyên âm a bình thường.",
        ],
        pronunciation_focus_en: [
          "Initial أ is a hamza: start the word cleanly, like a light glottal onset.",
          "الساعة contains ع, a throat consonant; do not treat it as a plain vowel.",
        ],
      },
      {
        ar: "أدرس العربية في الصباح.",
        romanization: "adrus al-'arabiyya fii as-sabaah",
        vi: "Tôi học tiếng Ả Rập vào buổi sáng.",
        en: "I study Arabic in the morning.",
        pronunciation_focus: [
          "العربية bắt đầu bằng ع; người Việt dễ bỏ qua âm này.",
          "الصباح có ص, âm nhấn/emphatic làm nguyên âm gần đó nghe tối hơn.",
        ],
        pronunciation_focus_en: [
          "العربية starts with ع; keep it as a consonant, not just a vowel.",
          "الصباح has emphatic ص, which colors the nearby vowel darker than plain s.",
        ],
      },
      {
        ar: "أعمل من التاسعة إلى الخامسة.",
        romanization: "a'mal min at-taasi'a ilaa al-khaamisa",
        vi: "Tôi làm việc từ chín giờ đến năm giờ.",
        en: "I work from nine to five.",
      },
      {
        ar: "أذهب إلى البيت ثم أطبخ.",
        romanization: "adhhab ilaa al-bayt thumma atbukh",
        vi: "Tôi về nhà rồi nấu ăn.",
        en: "I go home and then cook.",
        note_vi:
          "Trong giao tiếp nói, nhiều vùng dùng từ khác cho 'đi' hoặc rút gọn phát âm, nhưng câu này giữ chuẩn MSA.",
        note_en:
          "Many spoken varieties use different everyday forms for 'go' or reduce pronunciation, but this sentence stays in MSA.",
      },
    ],
    dialogue: [
      {
        cell_id: "cb8635e2-bfba-4451-b14f-654a7d36745b",
        speaker: "ليلى",
        ar: "متى تستيقظ يا سامي؟",
        romanization: "mataa tastayqiz yaa Saami?",
        vi: "Sami, bạn thức dậy khi nào?",
        en: "When do you wake up, Sami?",
      },
      {
        cell_id: "411ce770-dcc7-443d-bb50-6ae11698441a",
        speaker: "سامي",
        ar: "أستيقظ في الساعة السابعة، ثم أدرس العربية.",
        romanization: "astayqiz fii as-saa'a as-saabi'a, thumma adrus al-'arabiyya",
        vi: "Tôi thức dậy lúc bảy giờ, rồi học tiếng Ả Rập.",
        en: "I wake up at seven, then I study Arabic.",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "أدرس العربية ___ الصباح.",
        answer: "في",
        hint_vi: "Dùng giới từ chỉ thời gian/địa điểm.",
        hint_en: "Use the preposition for time/place.",
      },
      {
        type: "translation",
        vi: "Tôi đi đến nhà.",
        en: "I go to the house.",
        ar: "أذهب إلى البيت.",
        romanization: "adhhab ilaa al-bayt",
      },
    ],
    cultural_notes_vi:
      "Cách nói giờ trong MSA dùng `في الساعة...`. Đây là cách an toàn trong lớp học, văn bản và tình huống trang trọng. Ngoài đời, từng nước có cách nói giờ thân mật khác nhau.",
    cultural_notes_en:
      "MSA uses `في الساعة...` for clock time. It is safe in classrooms, writing, and formal settings. Everyday spoken time expressions vary by country.",
    tip_advice_vi:
      "Học động từ A2 theo cụm có chủ ngữ: `أنا أدرس`, `أنا أعمل`, `أنا أذهب`. Khi quen rồi mới rút đại từ `أنا`.",
    tip_advice_en:
      "Learn A2 verbs first as chunks with the pronoun: `أنا أدرس`, `أنا أعمل`, `أنا أذهب`. Drop `أنا` only after the verb pattern feels stable.",
  },
  {
    id: "arabic_a2_shopping_prices",
    level: "A2",
    category: "shopping",
    title_vi: "Mua sắm và hỏi giá",
    title_en: "Shopping and prices",
    intro_vi:
      "Bài này luyện cách hỏi giá, kích cỡ và màu sắc bằng MSA thực dụng. Người học Việt cần chú ý tính từ đứng sau danh từ và thường phải hòa hợp giống.",
    intro_en:
      "This lesson practices asking prices, sizes, and colors in practical MSA. English speakers should watch that adjectives follow nouns and usually agree in gender.",
    vocabulary: [
      { cell_id: "30380acf-e5f7-440a-91af-7a7c35cf6dec", ar: "السعر", romanization: "as-si'r", vi: "giá", en: "price", pos: "noun" },
      { cell_id: "f8416dd2-9445-4b02-b61e-e1388da2d7cc", ar: "كم؟", romanization: "kam?", vi: "bao nhiêu?", en: "how much? / how many?", pos: "question" },
      { cell_id: "e1f3f120-924d-411c-8300-7f72f4719bc7", ar: "غالي", romanization: "ghaalii", vi: "đắt", en: "expensive", pos: "adjective" },
      { cell_id: "93e7fc56-7baf-444a-95bd-f251337eeb91", ar: "رخيص", romanization: "rakhiis", vi: "rẻ", en: "cheap", pos: "adjective" },
      { cell_id: "9b32b381-c39a-4072-9d9d-3367aec4cac4", ar: "أريد", romanization: "uriid", vi: "tôi muốn", en: "I want", pos: "verb" },
      { cell_id: "750342b1-0a2d-4e1a-af11-ae1368bea82c", ar: "المقاس", romanization: "al-maqaas", vi: "kích cỡ", en: "size", pos: "noun" },
    ],
    sentences: [
      {
        ar: "كم السعر؟",
        romanization: "kam as-si'r?",
        vi: "Giá bao nhiêu?",
        en: "How much is the price?",
        pronunciation_focus: [
          "السعر phát âm gần `as-si'r` vì س là chữ mặt trời.",
          "ع trong سعر là âm cổ họng nhẹ; đừng đọc thành nguyên âm rời.",
        ],
        pronunciation_focus_en: [
          "السعر sounds like `as-si'r` because س is a sun letter.",
          "ع in سعر is a light throat consonant; do not turn it into a plain vowel.",
        ],
      },
      {
        ar: "أريد قميصا أزرق.",
        romanization: "uriid qamiisan azraq",
        vi: "Tôi muốn một chiếc áo sơ mi màu xanh.",
        en: "I want a blue shirt.",
      },
      {
        ar: "هل عندك مقاس أصغر؟",
        romanization: "hal 'indaka maqaas asghar?",
        vi: "Bạn có cỡ nhỏ hơn không?",
        en: "Do you have a smaller size?",
        note_vi:
          "`عندك` ở đây là 'bạn có'. Với nữ có thể viết/đọc trang trọng là `عندكِ`, nhưng chữ không dấu thường giống nhau.",
        note_en:
          "`عندك` means 'you have' here. Formal vowelled Arabic distinguishes masculine/feminine, but unvowelled writing often looks the same.",
      },
      {
        ar: "هذا غالي جدا.",
        romanization: "haadhaa ghaalii jiddan",
        vi: "Cái này rất đắt.",
        en: "This is very expensive.",
      },
    ],
    dialogue: [
      {
        cell_id: "f26dd1b3-d0fa-428d-a505-14648bb138a0",
        speaker: "الزبون",
        ar: "من فضلك، كم سعر هذا القميص؟",
        romanization: "min fadlik, kam si'r haadhaa al-qamiis?",
        vi: "Làm ơn, áo sơ mi này giá bao nhiêu?",
        en: "Please, how much is this shirt?",
      },
      {
        cell_id: "2a9da094-14b6-40ec-9774-fa6380cd2270",
        speaker: "البائع",
        ar: "السعر خمسة وعشرون دينارا.",
        romanization: "as-si'r khamsa wa-'ishruun diinaaran",
        vi: "Giá là hai mươi lăm dinar.",
        en: "The price is twenty-five dinars.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm mua sắm với nghĩa tiếng Việt.",
        instruction_en: "Match each shopping phrase with its English meaning.",
        pairs: [
          { ar: "كم السعر؟", meaning_vi: "Giá bao nhiêu?", meaning_en: "How much is the price?" },
          { ar: "مقاس أصغر", meaning_vi: "cỡ nhỏ hơn", meaning_en: "a smaller size" },
          { ar: "هذا غالي جدا", meaning_vi: "cái này rất đắt", meaning_en: "this is very expensive" },
        ],
      },
      {
        type: "fill-blank",
        question: "هل عندك مقاس ___؟",
        answer: "أصغر",
        hint_vi: "Dùng tính từ so sánh: nhỏ hơn.",
        hint_en: "Use the comparative adjective: smaller.",
      },
    ],
    cultural_notes_vi:
      "Mặc cả phụ thuộc quốc gia và bối cảnh. Trong cửa hàng hiện đại hoặc siêu thị, hỏi giá lịch sự là đủ; ở chợ truyền thống có thể có mặc cả, nhưng bài này giữ MSA trung tính.",
    cultural_notes_en:
      "Bargaining depends on country and setting. In modern shops or supermarkets, a polite price question is enough; traditional markets may involve bargaining, but this lesson keeps neutral MSA.",
    tip_advice_vi:
      "Đừng đặt tính từ trước danh từ theo kiểu tiếng Anh. Hãy học theo cặp: `قميص أزرق`, `مقاس أصغر`, `سعر رخيص`.",
    tip_advice_en:
      "Do not put adjectives before nouns as in English. Memorize noun-adjective pairs: `قميص أزرق`, `مقاس أصغر`, `سعر رخيص`.",
  },
  {
    id: "arabic_a2_transport_directions",
    level: "A2",
    category: "transport",
    title_vi: "Giao thông và hỏi đường",
    title_en: "Transport and directions",
    intro_vi:
      "Bài này giúp bạn hỏi đường, nói phương tiện và hiểu câu chỉ hướng ngắn. Trọng tâm là giới từ `إلى`, `من`, `قريب من`, `بعيد عن`.",
    intro_en:
      "This lesson helps you ask for directions, name transport options, and understand short route instructions. The focus is `إلى`, `من`, `قريب من`, and `بعيد عن`.",
    vocabulary: [
      { cell_id: "355b893b-fa06-4969-a4f7-962c9b5ee67e", ar: "الحافلة", romanization: "al-haafila", vi: "xe buýt", en: "bus", pos: "noun" },
      { cell_id: "4997bb82-76cd-4c21-8d3c-487d5d2335a9", ar: "القطار", romanization: "al-qitaar", vi: "tàu hỏa", en: "train", pos: "noun" },
      { cell_id: "14342c1a-418a-4d4d-8977-49b25b799e01", ar: "سيارة أجرة", romanization: "sayyaarat ujra", vi: "taxi", en: "taxi", pos: "noun phrase" },
      { cell_id: "069a73e6-16ab-45f8-ac9a-201f76b39fae", ar: "المحطة", romanization: "al-mahatta", vi: "nhà ga / trạm", en: "station", pos: "noun" },
      { cell_id: "5c07ea29-6083-451e-bc9b-f25068de32c7", ar: "قريب من", romanization: "qariib min", vi: "gần", en: "near", pos: "phrase" },
      { cell_id: "3daf7bac-6a0e-4527-b574-633f31a0a315", ar: "بعيد عن", romanization: "ba'iid 'an", vi: "xa", en: "far from", pos: "phrase" },
    ],
    sentences: [
      {
        ar: "أين محطة الحافلة؟",
        romanization: "ayna mahattat al-haafila?",
        vi: "Trạm xe buýt ở đâu?",
        en: "Where is the bus station?",
        pronunciation_focus: [
          "ح trong الحافلة là âm hơi cổ họng, không phải h nhẹ như ه.",
          "محطة có ط emphatic; đừng đọc như ت thường.",
        ],
        pronunciation_focus_en: [
          "ح in الحافلة is a breathy throat consonant, not plain English h.",
          "محطة has emphatic ط; do not pronounce it like plain t.",
        ],
      },
      {
        ar: "المحطة قريبة من الفندق.",
        romanization: "al-mahatta qariiba min al-funduq",
        vi: "Nhà ga gần khách sạn.",
        en: "The station is near the hotel.",
      },
      {
        ar: "أذهب إلى الجامعة بالحافلة.",
        romanization: "adhhab ilaa al-jaami'a bil-haafila",
        vi: "Tôi đi đến trường đại học bằng xe buýt.",
        en: "I go to the university by bus.",
      },
      {
        ar: "هل القطار بعيد عن هنا؟",
        romanization: "hal al-qitaar ba'iid 'an hunaa?",
        vi: "Tàu hỏa có xa chỗ này không?",
        en: "Is the train far from here?",
        note_vi:
          "Trong nói hằng ngày, người địa phương có thể dùng tên phương tiện khác nhau theo nước; MSA vẫn hiểu được trong bối cảnh trang trọng.",
        note_en:
          "Everyday transport words vary by country; MSA terms remain useful in formal or cross-regional contexts.",
      },
    ],
    dialogue: [
      {
        cell_id: "a2e50561-369e-4cb0-885c-8ef486a4ef9f",
        speaker: "المسافر",
        ar: "عفوا، أين محطة القطار؟",
        romanization: "'afwan, ayna mahattat al-qitaar?",
        vi: "Xin lỗi, ga tàu ở đâu?",
        en: "Excuse me, where is the train station?",
      },
      {
        cell_id: "3919f74d-7e11-4818-aaf9-45eac46be636",
        speaker: "الموظف",
        ar: "هي قريبة من الفندق. اذهب يمينا ثم يسارا.",
        romanization: "hiya qariiba min al-funduq. idhhab yamiinan thumma yasaaran",
        vi: "Nó gần khách sạn. Đi bên phải rồi bên trái.",
        en: "It is near the hotel. Go right and then left.",
      },
    ],
    exercises: [
      {
        type: "translation",
        vi: "Nhà ga gần khách sạn.",
        en: "The station is near the hotel.",
        ar: "المحطة قريبة من الفندق.",
        romanization: "al-mahatta qariiba min al-funduq",
      },
      {
        type: "fill-blank",
        question: "أذهب إلى الجامعة ___ الحافلة.",
        answer: "ب",
        accepted_answers: ["بالحافلة"],
        hint_vi: "Tiền tố ب có nghĩa 'bằng / với' phương tiện.",
        hint_en: "The prefix ب means 'by / with' for transport.",
      },
    ],
    cultural_notes_vi:
      "Khi hỏi đường trong MSA, câu sẽ khá trang trọng nhưng vẫn lịch sự và dễ hiểu. Hãy bắt đầu bằng `عفوا` hoặc `من فضلك` để giảm độ trực tiếp.",
    cultural_notes_en:
      "Direction questions in MSA sound somewhat formal but are polite and understandable. Start with `عفوا` or `من فضلك` to soften the request.",
    tip_advice_vi:
      "Học giới từ theo cặp cố định: `إلى` = đến, `من` = từ, `قريب من` = gần, `بعيد عن` = xa.",
    tip_advice_en:
      "Learn the prepositions as fixed pairs: `إلى` = to, `من` = from, `قريب من` = near, `بعيد عن` = far from.",
  },
  {
    id: "arabic_a2_appointments_time",
    level: "A2",
    category: "appointments",
    title_vi: "Đặt lịch hẹn",
    title_en: "Making appointments",
    intro_vi:
      "Bài này luyện đặt và đổi lịch hẹn với ngôn ngữ lịch sự. Người học Việt cần chú ý cụm `عندي موعد` nghĩa là 'tôi có lịch hẹn', không dịch từng chữ.",
    intro_en:
      "This lesson practices making and changing appointments politely. English speakers should treat `عندي موعد` as the practical equivalent of 'I have an appointment', not a literal possession phrase.",
    vocabulary: [
      { cell_id: "784642e5-9c45-44ee-8e27-717f3fb645a5", ar: "موعد", romanization: "maw'id", vi: "lịch hẹn", en: "appointment", pos: "noun" },
      { cell_id: "2edf90b8-b707-4aee-bf93-a44f2296a4fd", ar: "اليوم", romanization: "al-yawm", vi: "hôm nay", en: "today", pos: "adverb" },
      { cell_id: "6825614b-e70d-413d-881d-94e1d351c995", ar: "غدا", romanization: "ghadan", vi: "ngày mai", en: "tomorrow", pos: "adverb" },
      { cell_id: "7bf26cbd-a5b4-4727-a96f-a39cde04c74e", ar: "الأسبوع القادم", romanization: "al-usbuu' al-qaadim", vi: "tuần tới", en: "next week", pos: "phrase" },
      { cell_id: "1ffcaa12-49f0-44c6-be6b-54262e5d8e3b", ar: "أؤجل", romanization: "u'ajjil", vi: "tôi hoãn", en: "I postpone", pos: "verb" },
      { cell_id: "9773e721-aabe-4f08-b4f5-0b744976f9d1", ar: "مناسب", romanization: "munaasib", vi: "phù hợp / tiện", en: "suitable", pos: "adjective" },
    ],
    sentences: [
      {
        ar: "عندي موعد غدا.",
        romanization: "'indii maw'id ghadan",
        vi: "Tôi có lịch hẹn vào ngày mai.",
        en: "I have an appointment tomorrow.",
        pronunciation_focus: [
          "عندي bắt đầu bằng ع; giữ âm cổ họng nhẹ.",
          "غدا có غ, âm xát cổ họng mềm hơn خ.",
        ],
        pronunciation_focus_en: [
          "عندي begins with ع; keep the light throat consonant.",
          "غدا has غ, a voiced throat/velar fricative softer than خ.",
        ],
      },
      {
        ar: "هل الساعة العاشرة مناسبة؟",
        romanization: "hal as-saa'a al-'aashira munaasiba?",
        vi: "Mười giờ có phù hợp không?",
        en: "Is ten o'clock suitable?",
      },
      {
        ar: "أريد أن أؤجل الموعد.",
        romanization: "uriid an u'ajjil al-maw'id",
        vi: "Tôi muốn hoãn lịch hẹn.",
        en: "I want to postpone the appointment.",
      },
      {
        ar: "هل يمكن يوم الخميس؟",
        romanization: "hal yumkin yawm al-khamiis?",
        vi: "Thứ Năm có được không?",
        en: "Would Thursday be possible?",
        note_vi:
          "Câu `هل يمكن...؟` là cách lịch sự, an toàn trong MSA. Trong nói thân mật, cách hỏi có thể ngắn hơn tùy vùng.",
        note_en:
          "`هل يمكن...؟` is a polite, safe MSA frame. Casual spoken Arabic may ask this more briefly depending on region.",
      },
    ],
    dialogue: [
      {
        cell_id: "b052e424-d08a-4cee-8a67-b89d8e1e4ee6",
        speaker: "المريض",
        ar: "عندي موعد اليوم، ولكن أريد أن أؤجله.",
        romanization: "'indii maw'id al-yawm, walaakin uriid an u'ajjilahu",
        vi: "Tôi có lịch hẹn hôm nay, nhưng tôi muốn hoãn nó.",
        en: "I have an appointment today, but I want to postpone it.",
      },
      {
        cell_id: "59edcb37-f3e4-4326-8fb2-242e31d6c8fe",
        speaker: "الموظفة",
        ar: "هل يوم الخميس في الساعة العاشرة مناسب؟",
        romanization: "hal yawm al-khamiis fii as-saa'a al-'aashira munaasib?",
        vi: "Thứ Năm lúc mười giờ có phù hợp không?",
        en: "Is Thursday at ten o'clock suitable?",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "عندي ___ غدا.",
        answer: "موعد",
        hint_vi: "Danh từ nghĩa là lịch hẹn.",
        hint_en: "Use the noun meaning appointment.",
      },
      {
        type: "matching",
        instruction_vi: "Nối cụm đặt lịch với nghĩa.",
        instruction_en: "Match each appointment phrase with its meaning.",
        pairs: [
          { ar: "عندي موعد", meaning_vi: "tôi có lịch hẹn", meaning_en: "I have an appointment" },
          { ar: "أؤجل الموعد", meaning_vi: "tôi hoãn lịch hẹn", meaning_en: "I postpone the appointment" },
          { ar: "الساعة العاشرة", meaning_vi: "mười giờ", meaning_en: "ten o'clock" },
        ],
      },
    ],
    cultural_notes_vi:
      "Trong email hoặc quầy dịch vụ, MSA lịch sự rất hữu ích. Dùng `من فضلك` và `هل يمكن` giúp câu mềm hơn mà không cần chọn đại từ xưng hô phức tạp như tiếng Việt.",
    cultural_notes_en:
      "In emails or service desks, polite MSA is useful. `من فضلك` and `هل يمكن` soften requests without needing a complex English-style modal stack.",
    tip_advice_vi:
      "Học cả cụm `عندي موعد` thay vì phân tích từng từ. Đây là cách nói thực dụng cho 'tôi có lịch hẹn'.",
    tip_advice_en:
      "Learn `عندي موعد` as one practical chunk for 'I have an appointment' before analyzing the possession structure.",
  },
  {
    id: "arabic_a2_housing_public_services",
    level: "A2",
    category: "housing_public_services",
    title_vi: "Nhà ở và dịch vụ công",
    title_en: "Housing and public services",
    intro_vi:
      "Bài này giúp bạn nói về căn hộ, tiền thuê, khu phố và một yêu cầu giấy tờ đơn giản ở quầy dịch vụ. Trọng tâm là idafa đơn giản như `باب البيت` và câu lịch sự `أحتاج إلى...`.",
    intro_en:
      "This lesson helps you discuss an apartment, rent, neighborhood, and a simple document request at a service counter. The focus is simple idafa phrases such as `باب البيت` and the polite frame `أحتاج إلى...`.",
    vocabulary: [
      { cell_id: "e46d2659-070e-4605-b829-e3f0dc3faf01", ar: "شقة", romanization: "shaqqa", vi: "căn hộ", en: "apartment", pos: "noun" },
      { cell_id: "bf15426c-459f-47a0-b20f-863060c969a3", ar: "غرفة", romanization: "ghurfa", vi: "phòng", en: "room", pos: "noun" },
      { cell_id: "e1c425f9-65cf-4d92-a76e-11ac4d6b1548", ar: "الإيجار", romanization: "al-iijaar", vi: "tiền thuê", en: "rent", pos: "noun" },
      { cell_id: "699e9486-6d34-458a-a631-ac9226f5071e", ar: "الحي", romanization: "al-hayy", vi: "khu phố", en: "neighborhood", pos: "noun" },
      { cell_id: "7cd0140b-b268-4afd-8953-da27aab0844e", ar: "استمارة", romanization: "istimaara", vi: "mẫu đơn", en: "form", pos: "noun" },
      { cell_id: "8a346740-0b28-4075-87db-9d9e5c6b2c8c", ar: "وثيقة", romanization: "wathiiqa", vi: "giấy tờ / tài liệu", en: "document", pos: "noun" },
      { cell_id: "c4a785bc-da8d-43bc-bd3b-00a33e332d62", ar: "نظيف", romanization: "naziif", vi: "sạch", en: "clean", pos: "adjective" },
      { cell_id: "866aff03-e474-458a-aa61-ecb914e4b874", ar: "هادئ", romanization: "haadi'", vi: "yên tĩnh", en: "quiet", pos: "adjective" },
    ],
    sentences: [
      {
        ar: "أبحث عن شقة صغيرة.",
        romanization: "abhath 'an shaqqa saghiira",
        vi: "Tôi đang tìm một căn hộ nhỏ.",
        en: "I am looking for a small apartment.",
        pronunciation_focus: [
          "أبحث có ح; giữ hơi cổ họng rõ hơn h tiếng Anh.",
          "صغيرة có ص emphatic; đừng đọc giống س.",
        ],
        pronunciation_focus_en: [
          "أبحث has ح; keep it breathier and deeper than English h.",
          "صغيرة has emphatic ص; do not pronounce it like plain س.",
        ],
      },
      {
        ar: "الإيجار مناسب.",
        romanization: "al-iijaar munaasib",
        vi: "Tiền thuê phù hợp.",
        en: "The rent is suitable.",
      },
      {
        ar: "الحي قريب من السوق.",
        romanization: "al-hayy qariib min as-suuq",
        vi: "Khu phố gần chợ.",
        en: "The neighborhood is near the market.",
      },
      {
        ar: "أحتاج إلى استمارة.",
        romanization: "ahtaaj ilaa istimaara",
        vi: "Tôi cần một mẫu đơn.",
        en: "I need a form.",
        note_vi:
          "`أحتاج إلى...` là khung lịch sự, an toàn ở quầy dịch vụ. Đây là nội dung ngôn ngữ, không phải hướng dẫn pháp lý.",
        note_en:
          "`أحتاج إلى...` is a polite, safe service-counter frame. This is language-learning content, not legal guidance.",
      },
    ],
    dialogue: [
      {
        cell_id: "fe9000f5-e66a-4268-94af-0598461664be",
        speaker: "المستأجر",
        ar: "أبحث عن شقة قريبة من العمل.",
        romanization: "abhath 'an shaqqa qariiba min al-'amal",
        vi: "Tôi đang tìm căn hộ gần chỗ làm.",
        en: "I am looking for an apartment near work.",
      },
      {
        cell_id: "0c69ffce-0cb2-430b-ad6c-c7c3490f824b",
        speaker: "الموظف",
        ar: "خذ هذه الاستمارة واكتب العنوان.",
        romanization: "khudh haadhihi al-istimaara waktub al-'unwaan",
        vi: "Hãy lấy mẫu đơn này và viết địa chỉ.",
        en: "Take this form and write the address.",
      },
    ],
    exercises: [
      {
        type: "translation",
        vi: "Khu phố gần chợ.",
        en: "The neighborhood is near the market.",
        ar: "الحي قريب من السوق.",
        romanization: "al-hayy qariib min as-suuq",
      },
      {
        type: "fill-blank",
        question: "أحتاج إلى ___.",
        answer: "استمارة",
        hint_vi: "Danh từ nghĩa là mẫu đơn.",
        hint_en: "Use the noun meaning form.",
      },
    ],
    cultural_notes_vi:
      "Khi hỏi thuê nhà hoặc làm việc với quầy dịch vụ, MSA giúp đọc tin đăng, biển báo, mẫu đơn và gửi tin nhắn lịch sự. Nói chuyện đời thường có thể chuyển sang phương ngữ địa phương.",
    cultural_notes_en:
      "Housing and service-counter MSA helps with listings, signs, forms, and polite messages. Casual conversation may shift into the local spoken variety.",
    tip_advice_vi:
      "Học hai khung: `أبحث عن...` để tìm nhà và `أحتاج إلى...` để xin giấy tờ hoặc mẫu đơn.",
    tip_advice_en:
      "Learn two frames: `أبحث عن...` for looking for housing and `أحتاج إلى...` for requesting a document or form.",
  },
];

export default lessons;
