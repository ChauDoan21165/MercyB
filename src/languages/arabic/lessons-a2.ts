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
      { ar: "أستيقظ", romanization: "astayqiz", vi: "tôi thức dậy", en: "I wake up", pos: "verb" },
      { ar: "أدرس", romanization: "adrus", vi: "tôi học", en: "I study", pos: "verb" },
      { ar: "أعمل", romanization: "a'mal", vi: "tôi làm việc", en: "I work", pos: "verb" },
      { ar: "أذهب", romanization: "adhhab", vi: "tôi đi", en: "I go", pos: "verb" },
      { ar: "في الصباح", romanization: "fi as-sabaah", vi: "vào buổi sáng", en: "in the morning", pos: "phrase" },
      { ar: "ثم", romanization: "thumma", vi: "sau đó", en: "then", pos: "connector" },
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
        speaker: "ليلى",
        ar: "متى تستيقظ يا سامي؟",
        romanization: "mataa tastayqiz yaa Saami?",
        vi: "Sami, bạn thức dậy khi nào?",
        en: "When do you wake up, Sami?",
      },
      {
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
      { ar: "السعر", romanization: "as-si'r", vi: "giá", en: "price", pos: "noun" },
      { ar: "كم؟", romanization: "kam?", vi: "bao nhiêu?", en: "how much? / how many?", pos: "question" },
      { ar: "غالي", romanization: "ghaalii", vi: "đắt", en: "expensive", pos: "adjective" },
      { ar: "رخيص", romanization: "rakhiis", vi: "rẻ", en: "cheap", pos: "adjective" },
      { ar: "أريد", romanization: "uriid", vi: "tôi muốn", en: "I want", pos: "verb" },
      { ar: "المقاس", romanization: "al-maqaas", vi: "kích cỡ", en: "size", pos: "noun" },
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
        speaker: "الزبون",
        ar: "من فضلك، كم سعر هذا القميص؟",
        romanization: "min fadlik, kam si'r haadhaa al-qamiis?",
        vi: "Làm ơn, áo sơ mi này giá bao nhiêu?",
        en: "Please, how much is this shirt?",
      },
      {
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
      { ar: "الحافلة", romanization: "al-haafila", vi: "xe buýt", en: "bus", pos: "noun" },
      { ar: "القطار", romanization: "al-qitaar", vi: "tàu hỏa", en: "train", pos: "noun" },
      { ar: "سيارة أجرة", romanization: "sayyaarat ujra", vi: "taxi", en: "taxi", pos: "noun phrase" },
      { ar: "المحطة", romanization: "al-mahatta", vi: "nhà ga / trạm", en: "station", pos: "noun" },
      { ar: "قريب من", romanization: "qariib min", vi: "gần", en: "near", pos: "phrase" },
      { ar: "بعيد عن", romanization: "ba'iid 'an", vi: "xa", en: "far from", pos: "phrase" },
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
        speaker: "المسافر",
        ar: "عفوا، أين محطة القطار؟",
        romanization: "'afwan, ayna mahattat al-qitaar?",
        vi: "Xin lỗi, ga tàu ở đâu?",
        en: "Excuse me, where is the train station?",
      },
      {
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
      { ar: "موعد", romanization: "maw'id", vi: "lịch hẹn", en: "appointment", pos: "noun" },
      { ar: "اليوم", romanization: "al-yawm", vi: "hôm nay", en: "today", pos: "adverb" },
      { ar: "غدا", romanization: "ghadan", vi: "ngày mai", en: "tomorrow", pos: "adverb" },
      { ar: "الأسبوع القادم", romanization: "al-usbuu' al-qaadim", vi: "tuần tới", en: "next week", pos: "phrase" },
      { ar: "أؤجل", romanization: "u'ajjil", vi: "tôi hoãn", en: "I postpone", pos: "verb" },
      { ar: "مناسب", romanization: "munaasib", vi: "phù hợp / tiện", en: "suitable", pos: "adjective" },
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
        speaker: "المريض",
        ar: "عندي موعد اليوم، ولكن أريد أن أؤجله.",
        romanization: "'indii maw'id al-yawm, walaakin uriid an u'ajjilahu",
        vi: "Tôi có lịch hẹn hôm nay, nhưng tôi muốn hoãn nó.",
        en: "I have an appointment today, but I want to postpone it.",
      },
      {
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
      { ar: "شقة", romanization: "shaqqa", vi: "căn hộ", en: "apartment", pos: "noun" },
      { ar: "غرفة", romanization: "ghurfa", vi: "phòng", en: "room", pos: "noun" },
      { ar: "الإيجار", romanization: "al-iijaar", vi: "tiền thuê", en: "rent", pos: "noun" },
      { ar: "الحي", romanization: "al-hayy", vi: "khu phố", en: "neighborhood", pos: "noun" },
      { ar: "استمارة", romanization: "istimaara", vi: "mẫu đơn", en: "form", pos: "noun" },
      { ar: "وثيقة", romanization: "wathiiqa", vi: "giấy tờ / tài liệu", en: "document", pos: "noun" },
      { ar: "نظيف", romanization: "naziif", vi: "sạch", en: "clean", pos: "adjective" },
      { ar: "هادئ", romanization: "haadi'", vi: "yên tĩnh", en: "quiet", pos: "adjective" },
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
        speaker: "المستأجر",
        ar: "أبحث عن شقة قريبة من العمل.",
        romanization: "abhath 'an shaqqa qariiba min al-'amal",
        vi: "Tôi đang tìm căn hộ gần chỗ làm.",
        en: "I am looking for an apartment near work.",
      },
      {
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
