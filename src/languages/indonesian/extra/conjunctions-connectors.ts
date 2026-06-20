// src/languages/indonesian/extra/conjunctions-connectors.ts
//
// Indonesian conjunctions & connectors pack for Vietnamese learners.
// Covers: contrast (tetapi/tapi, namun, meskipun, walaupun), cause & effect
// (karena, sebab, sehingga, oleh karena itu, jadi), and purpose/condition/
// sequence (agar, supaya, kalau, jika, lalu, kemudian). Hand-crafted, no filler.
//
// Shape mirrors the named template src/languages/portuguese/lessons-a1.ts and the
// sibling extra packs so the page UI stays consistent across language verticals.
// The types are defined inline because the Indonesian pack has no sibling
// lessons.ts registry yet (A7 owns it) — this file is self-contained on purpose.
// Types are NOT exported and the lesson array uses a unique name so a future
// barrel `export *` cannot collide with the sibling extra packs.
//
// Field convention (inherited from the Portuguese pack): a sentence's `en` slot
// holds the TARGET-LANGUAGE text (here: Indonesian), `vi` holds the Vietnamese
// gloss. `pronunciation_focus` carries Vietnamese-facing pronunciation/grammar
// notes (incl. the common Vietnamese-speaker mistake = L1 note);
// `pronunciation_focus_en` is the English-speaker companion, same length + order.
//
// Indonesian uses the Latin alphabet — no special script rendering needed.

type LessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields (fill_blank, matching, translation) vary.
type Exercise = Record<string, any>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
};

export const conjunctionsConnectorsLessons: IndonesianLesson[] = [
  {
    id: "indonesian_conj_contrast",
    level: "A1",
    category: "grammar-connectors",
    title_vi: "Liên từ tương phản — tapi, namun, meskipun",
    title_en: "Contrast connectors — tapi, namun, meskipun",
    sentences: [
      {
        en: "Saya lapar, tetapi tidak ada makanan.",
        vi: "Tôi đói, nhưng không có đồ ăn.",
        pronunciation_focus: [
          "tetapi → te-TA-pi, 'nhưng' (trang trọng; khẩu ngữ rút thành 'tapi')",
          "nối hai mệnh đề NGANG hàng, đặt GIỮA câu, sau dấu phẩy",
          "lapar → LA-par, 'đói'",
        ],
        pronunciation_focus_en: [
          "tetapi → 'te-TA-pee' — but (formal; colloquially shortened to 'tapi')",
          "links two equal clauses, placed mid-sentence after a comma",
          "lapar → 'LA-par' — hungry",
        ],
      },
      {
        en: "Dia kaya. Namun, dia tidak sombong.",
        vi: "Anh ấy giàu. Tuy nhiên, anh ấy không kiêu.",
        pronunciation_focus: [
          "namun → NA-mun, 'tuy nhiên' (trang trọng, mở ĐẦU câu mới)",
          "thường theo sau là dấu phẩy: 'Namun, …'",
          "sombong → SOM-bong, 'kiêu ngạo'",
        ],
        pronunciation_focus_en: [
          "namun → 'NA-moon' — however (formal, starts a NEW sentence)",
          "usually followed by a comma: 'Namun, …'",
          "sombong → 'SOM-bong' — arrogant",
        ],
      },
      {
        en: "Meskipun hujan, dia tetap pergi.",
        vi: "Mặc dù trời mưa, anh ấy vẫn đi.",
        pronunciation_focus: [
          "meskipun → mes-ki-PUN, 'mặc dù' (mở đầu mệnh đề nhượng bộ)",
          "đồng nghĩa 'walaupun', 'biarpun'; mệnh đề chính thường có 'tetap' (vẫn)",
          "hujan → HU-jan, 'mưa'",
        ],
        pronunciation_focus_en: [
          "meskipun → 'mes-kee-POON' — although (opens a concessive clause)",
          "synonyms 'walaupun', 'biarpun'; the main clause often has 'tetap' (still)",
          "hujan → 'HOO-jan' — rain",
        ],
      },
      {
        en: "Makanannya enak, tapi harganya mahal.",
        vi: "Đồ ăn ngon, nhưng giá đắt.",
        pronunciation_focus: [
          "tapi → TA-pi, dạng khẩu ngữ của 'tetapi' (rất hay dùng)",
          "harga → HAR-ga, 'giá'; harganya = giá của nó (+ -nya)",
          "mahal → MA-hal, 'đắt'; ngược murah = rẻ",
        ],
        pronunciation_focus_en: [
          "tapi → 'TA-pee' — the casual form of 'tetapi' (very common)",
          "harga → 'HAR-ga' — price; harganya = its price (+ '-nya')",
          "mahal → 'MA-hal' — expensive; opposite 'murah' = cheap",
        ],
      },
      {
        en: "Dia pintar, sedangkan adiknya malas.",
        vi: "Anh ấy thông minh, còn em anh ấy thì lười.",
        pronunciation_focus: [
          "sedangkan → se-DANG-kan, 'còn/trong khi đó' (đối chiếu hai vế)",
          "khác 'tetapi': sedangkan nhấn sự ĐỐI CHIẾU, không phải nghịch lý",
          "malas → MA-las, 'lười'; pintar = thông minh",
        ],
        pronunciation_focus_en: [
          "sedangkan → 'se-DANG-kan' — whereas / while (contrasts two sides)",
          "unlike 'tetapi': sedangkan marks a COMPARISON, not a contradiction",
          "malas → 'MA-las' — lazy; pintar = smart",
        ],
      },
    ],
    cultural_notes_vi:
      "Tiếng Indonesia có nhiều liên từ tương phản với SẮC THÁI và VỊ TRÍ khác nhau:\n• 'tetapi/tapi' (nhưng) — nối hai mệnh đề trong CÙNG câu, đặt giữa. 'tapi' là khẩu ngữ, 'tetapi' trang trọng.\n• 'namun' (tuy nhiên) — trang trọng, mở ĐẦU câu MỚI: 'Namun, …'. Hay gặp trong văn viết.\n• 'meskipun/walaupun/biarpun' (mặc dù) — mở đầu mệnh đề nhượng bộ; mệnh đề chính thường có 'tetap' (vẫn).\n• 'sedangkan' (còn/trong khi đó) — đối chiếu hai sự việc song song, không hẳn nghịch lý.\nQuy tắc vàng: KHÔNG dùng 'namun' giữa câu thay cho 'tetapi', và KHÔNG mở đầu câu bằng 'tetapi' trong văn trang trọng.",
    cultural_notes_en:
      "Indonesian has several contrast connectors that differ in NUANCE and POSITION:\n• 'tetapi/tapi' (but) — joins two clauses within the SAME sentence, placed mid-sentence. 'tapi' is casual, 'tetapi' formal.\n• 'namun' (however) — formal, starts a NEW sentence: 'Namun, …'. Common in writing.\n• 'meskipun/walaupun/biarpun' (although) — opens a concessive clause; the main clause often has 'tetap' (still).\n• 'sedangkan' (whereas/while) — contrasts two parallel facts, not necessarily a contradiction.\nGolden rule: do NOT use 'namun' mid-sentence in place of 'tetapi', and do NOT start a sentence with 'tetapi' in formal writing.",
    tip_advice_vi:
      "Mẹo cho người Việt: tiếng Việt dùng 'nhưng' cho gần như mọi trường hợp, nên người Việt hay lạm dụng 'tapi'. Hãy phân biệt: dùng 'tapi/tetapi' GIỮA câu, 'namun' ĐẦU câu mới. 'Meskipun' luôn đi với một mệnh đề khác (không đứng một mình) — và đừng dịch thừa: 'Mặc dù trời mưa NHƯNG anh vẫn đi' trong tiếng Việt có cả 'mặc dù' lẫn 'nhưng', NHƯNG tiếng Indonesia chỉ cần MỘT: 'Meskipun hujan, dia tetap pergi' (KHÔNG thêm 'tetapi'). Đây là lỗi rất phổ biến của người Việt. 'Sedangkan' để so sánh hai bên, dịch 'còn/trong khi đó'.",
    tip_advice_en:
      "Tip for Vietnamese speakers: Vietnamese uses 'nhưng' for almost everything, so learners over-use 'tapi'. Distinguish: 'tapi/tetapi' MID-sentence, 'namun' to START a new sentence. 'Meskipun' always pairs with another clause (never stands alone) — and don't double up: Vietnamese says 'Mặc dù… NHƯNG…' with both words, but Indonesian needs only ONE: 'Meskipun hujan, dia tetap pergi' (do NOT add 'tetapi'). This is a very common Vietnamese-speaker error. 'Sedangkan' contrasts two sides, glossed 'whereas/while'.",
    vocabulary: [
      { word: "tetapi / tapi", en: "but", vi: "nhưng", pos: "conj.", pronunciation_vi: "te-TA-pi / TA-pi", pronunciation_en: "te-TA-pee / TA-pee" },
      { word: "namun", en: "however", vi: "tuy nhiên", pos: "conj.", pronunciation_vi: "NA-mun", pronunciation_en: "NA-moon" },
      { word: "meskipun", en: "although", vi: "mặc dù", pos: "conj.", pronunciation_vi: "mes-ki-PUN", pronunciation_en: "mes-kee-POON" },
      { word: "walaupun", en: "even though", vi: "dẫu / dù rằng", pos: "conj.", pronunciation_vi: "wa-lau-PUN", pronunciation_en: "wa-lau-POON" },
      { word: "sedangkan", en: "whereas / while", vi: "còn / trong khi đó", pos: "conj.", pronunciation_vi: "se-DANG-kan", pronunciation_en: "se-DANG-kan" },
      { word: "tetap", en: "still / nonetheless", vi: "vẫn", pos: "adv.", pronunciation_vi: "te-TAP", pronunciation_en: "te-TAP" },
      { word: "mahal", en: "expensive", vi: "đắt", pos: "adj.", pronunciation_vi: "MA-hal", pronunciation_en: "MA-hal" },
      { word: "sombong", en: "arrogant", vi: "kiêu ngạo", pos: "adj.", pronunciation_vi: "SOM-bong", pronunciation_en: "SOM-bong" },
    ],
    dialogue: [
      { speaker: "Tina", text: "Aku mau beli baju itu, tapi harganya mahal sekali.", vi: "Tớ muốn mua cái áo đó, nhưng giá đắt quá.", en: "I want to buy that shirt, but it's very expensive." },
      { speaker: "Doni", text: "Meskipun mahal, kualitasnya bagus, lho.", vi: "Mặc dù đắt, nhưng chất lượng tốt đấy.", en: "Even though it's pricey, the quality is good." },
      { speaker: "Tina", text: "Iya sih. Namun, uangku belum cukup bulan ini.", vi: "Ừ thì. Tuy nhiên, tiền của tớ tháng này chưa đủ.", en: "True. However, I don't have enough money this month." },
      { speaker: "Doni", text: "Ya sudah, tunggu gajian. Aku tetap di sini, sedangkan kamu cari yang lain dulu.", vi: "Thôi vậy, chờ lương đi. Tớ vẫn ở đây, còn cậu tìm cái khác trước.", en: "Alright, wait for payday. I'll stay here, while you look at others first." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền liên từ tương phản còn thiếu:",
        instruction_en: "Fill in the missing contrast connector:",
        items: [
          { prompt: "Saya lapar, ___ tidak ada makanan. (nhưng, giữa câu)", answer: "tetapi", options: ["tetapi", "namun", "karena"] },
          { prompt: "___ hujan, dia tetap pergi. (mặc dù)", answer: "Meskipun", options: ["Meskipun", "Sehingga", "Supaya"] },
          { prompt: "Dia kaya. ___, dia tidak sombong. (tuy nhiên, đầu câu)", answer: "Namun", options: ["Namun", "Tapi", "Lalu"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối liên từ với nghĩa tiếng Việt:",
        instruction_en: "Match each connector with its Vietnamese meaning:",
        items: [
          { prompt: "tetapi", answer: "nhưng" },
          { prompt: "namun", answer: "tuy nhiên" },
          { prompt: "meskipun", answer: "mặc dù" },
          { prompt: "sedangkan", answer: "còn / trong khi đó" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Đồ ăn ngon, nhưng giá đắt.", answer: "Makanannya enak, tapi harganya mahal." },
          { prompt: "Mặc dù trời mưa, anh ấy vẫn đi.", answer: "Meskipun hujan, dia tetap pergi." },
          { prompt: "Anh ấy thông minh, còn em anh ấy thì lười.", answer: "Dia pintar, sedangkan adiknya malas." },
        ],
      },
    ],
  },
  {
    id: "indonesian_conj_cause_effect",
    level: "A2",
    category: "grammar-connectors",
    title_vi: "Liên từ nhân quả — karena, sehingga, jadi",
    title_en: "Cause-effect connectors — karena, sehingga, jadi",
    sentences: [
      {
        en: "Saya tidak datang karena sakit.",
        vi: "Tôi không đến vì bị ốm.",
        pronunciation_focus: [
          "karena → KA-re-na, 'vì/bởi vì' (nêu LÝ DO, đứng trước nguyên nhân)",
          "đồng nghĩa 'sebab'; có thể mở đầu câu: 'Karena sakit, saya tidak datang.'",
          "sakit → SA-kit, 'ốm/đau'",
        ],
        pronunciation_focus_en: [
          "karena → 'KA-re-na' — because (states the REASON, precedes the cause)",
          "synonym 'sebab'; can open a sentence: 'Karena sakit, saya tidak datang.'",
          "sakit → 'SA-keet' — sick / in pain",
        ],
      },
      {
        en: "Dia belajar keras sehingga lulus ujian.",
        vi: "Anh ấy học chăm nên đậu kỳ thi.",
        pronunciation_focus: [
          "sehingga → se-HING-ga, 'nên/dẫn đến' (nêu KẾT QUẢ, đứng trước hệ quả)",
          "khác karena: sehingga đứng trước KẾT QUẢ, karena trước NGUYÊN NHÂN",
          "lulus → LU-lus, 'đậu/qua (kỳ thi)'",
        ],
        pronunciation_focus_en: [
          "sehingga → 'se-HING-ga' — so that / resulting in (precedes the RESULT)",
          "unlike karena: sehingga precedes the RESULT, karena the CAUSE",
          "lulus → 'LOO-loos' — to pass (an exam)",
        ],
      },
      {
        en: "Hujan deras, jadi kami tidak jadi pergi.",
        vi: "Mưa to, nên bọn tôi không đi nữa.",
        pronunciation_focus: [
          "jadi → JA-di, 'nên/vì vậy' (khẩu ngữ, mở đầu mệnh đề kết quả)",
          "lưu ý: 'jadi' (nên) khác 'tidak jadi' (không … nữa/hủy)",
          "deras → DE-ras, 'xối xả/dữ dội' (mưa)",
        ],
        pronunciation_focus_en: [
          "jadi → 'JA-dee' — so / therefore (casual, opens a result clause)",
          "note: 'jadi' (so) differs from 'tidak jadi' (to call off / not happen)",
          "deras → 'DE-ras' — heavy / pouring (rain)",
        ],
      },
      {
        en: "Oleh karena itu, kita harus lebih berhati-hati.",
        vi: "Vì thế, chúng ta phải cẩn thận hơn.",
        pronunciation_focus: [
          "oleh karena itu → 'vì thế/do đó' (trang trọng, mở đầu câu kết luận)",
          "dạng ngắn hơn: 'karena itu', 'maka dari itu'",
          "berhati-hati → 'cẩn thận' (từ láy hati-hati + ber-)",
        ],
        pronunciation_focus_en: [
          "oleh karena itu → 'therefore / for that reason' (formal, opens a conclusion)",
          "shorter variants: 'karena itu', 'maka dari itu'",
          "berhati-hati → 'to be careful' (reduplicated hati-hati + ber-)",
        ],
      },
      {
        en: "Karena macet, dia terlambat ke kantor.",
        vi: "Vì kẹt xe, anh ấy đến văn phòng muộn.",
        pronunciation_focus: [
          "Karena + nguyên nhân ở ĐẦU câu, theo sau là dấu phẩy + kết quả",
          "macet → MA-chet, 'kẹt xe' ('c' đọc như 'ch')",
          "terlambat → ter-LAM-bat, 'trễ/muộn'",
        ],
        pronunciation_focus_en: [
          "Karena + cause at the START of the sentence, then a comma + the result",
          "macet → 'MA-chet' — traffic jam ('c' = 'ch')",
          "terlambat → 'ter-LAM-bat' — late",
        ],
      },
    ],
    cultural_notes_vi:
      "Bộ liên từ nhân quả trong tiếng Indonesia chia theo việc đứng trước NGUYÊN NHÂN hay KẾT QUẢ:\n• Trước NGUYÊN NHÂN: 'karena' / 'sebab' (vì, bởi vì). 'Saya tidak datang KARENA sakit' (vì ốm).\n• Trước KẾT QUẢ: 'sehingga' / 'maka' (nên, dẫn đến). 'Dia belajar keras SEHINGGA lulus' (nên đậu).\n• Mở đầu mệnh đề/câu kết quả (khẩu ngữ): 'jadi' (nên, vì vậy).\n• Mở đầu câu kết luận (trang trọng): 'oleh karena itu' / 'karena itu' / 'maka dari itu' (vì thế, do đó).\nCó thể đảo: 'Karena sakit, saya tidak datang' (nguyên nhân lên đầu, thêm dấu phẩy). Văn viết học thuật chuộng 'oleh karena itu' và 'sehingga'; trò chuyện đời thường dùng 'karena' và 'jadi'.",
    cultural_notes_en:
      "Indonesian cause-effect connectors split by whether they precede the CAUSE or the RESULT:\n• Before the CAUSE: 'karena' / 'sebab' (because). 'Saya tidak datang KARENA sakit'.\n• Before the RESULT: 'sehingga' / 'maka' (so that, resulting in). 'Dia belajar keras SEHINGGA lulus'.\n• Opening a result clause (casual): 'jadi' (so, therefore).\n• Opening a concluding sentence (formal): 'oleh karena itu' / 'karena itu' / 'maka dari itu' (therefore).\nYou can front the cause: 'Karena sakit, saya tidak datang' (cause first, add a comma). Academic writing favors 'oleh karena itu' and 'sehingga'; everyday talk uses 'karena' and 'jadi'.",
    tip_advice_vi:
      "Mẹo cho người Việt: tiếng Việt phân biệt 'vì' (nguyên nhân) và 'nên' (kết quả) — tiếng Indonesia cũng vậy: 'karena' = vì, 'sehingga/jadi' = nên. ĐỪNG dùng 'karena' cho cả hai. Lỗi hay gặp: dịch 'Vì… nên…' bằng cả 'karena' lẫn 'sehingga' trong cùng câu — thường CHỈ cần một: 'Karena sakit, saya tidak datang' (đủ rồi, không thêm 'jadi/sehingga'). Cẩn thận 'jadi': nghĩa 'nên/vì vậy' (liên từ) khác 'jadi' nghĩa 'trở thành' và 'tidak jadi' nghĩa 'hủy, không… nữa'. 'Oleh karena itu' rất trang trọng — dùng trong bài luận, thuyết trình, không trong tán gẫu.",
    tip_advice_en:
      "Tip for Vietnamese speakers: Vietnamese separates 'vì' (cause) and 'nên' (result) — Indonesian does too: 'karena' = because, 'sehingga/jadi' = so. Don't use 'karena' for both. Common error: rendering 'Vì… nên…' with both 'karena' and 'sehingga' in one sentence — usually you need only ONE: 'Karena sakit, saya tidak datang' (enough; don't add 'jadi/sehingga'). Watch 'jadi': as a connector it means 'so/therefore', but 'jadi' also means 'to become', and 'tidak jadi' means 'to call off / not happen'. 'Oleh karena itu' is very formal — use it in essays and presentations, not casual chat.",
    vocabulary: [
      { word: "karena", en: "because", vi: "vì / bởi vì", pos: "conj.", pronunciation_vi: "KA-re-na", pronunciation_en: "KA-re-na" },
      { word: "sebab", en: "because / the reason", vi: "vì / lý do", pos: "conj./noun", pronunciation_vi: "SE-bab", pronunciation_en: "SE-bab" },
      { word: "sehingga", en: "so that / resulting in", vi: "nên / dẫn đến", pos: "conj.", pronunciation_vi: "se-HING-ga", pronunciation_en: "se-HING-ga" },
      { word: "jadi", en: "so / therefore", vi: "nên / vì vậy", pos: "conj.", pronunciation_vi: "JA-di", pronunciation_en: "JA-dee" },
      { word: "maka", en: "then / thus", vi: "thì / cho nên", pos: "conj.", pronunciation_vi: "MA-ka", pronunciation_en: "MA-ka" },
      { word: "oleh karena itu", en: "therefore", vi: "vì thế / do đó", pos: "conj.", pronunciation_vi: "O-leh KA-re-na I-tu", pronunciation_en: "OH-leh KA-re-na EE-too" },
      { word: "lulus", en: "to pass (an exam)", vi: "đậu / qua", pos: "verb", pronunciation_vi: "LU-lus", pronunciation_en: "LOO-loos" },
      { word: "deras", en: "heavy / pouring (rain)", vi: "xối xả / to", pos: "adj.", pronunciation_vi: "DE-ras", pronunciation_en: "DE-ras" },
    ],
    dialogue: [
      { speaker: "Sari", text: "Kenapa kamu terlambat tadi pagi?", vi: "Sao sáng nay cậu đến muộn vậy?", en: "Why were you late this morning?" },
      { speaker: "Adi", text: "Karena macet parah. Hujan deras, jadi semua kendaraan pelan.", vi: "Vì kẹt xe nặng. Mưa to, nên mọi xe đều chậm.", en: "Because of bad traffic. It was pouring, so all the vehicles were slow." },
      { speaker: "Sari", text: "Oh pantas. Oleh karena itu, lain kali berangkat lebih awal, ya.", vi: "À thảo nào. Vì thế, lần sau đi sớm hơn nhé.", en: "Oh, no wonder. Therefore, next time leave earlier." },
      { speaker: "Adi", text: "Iya, aku akan bangun lebih pagi sehingga tidak telat lagi.", vi: "Ừ, tớ sẽ dậy sớm hơn để không trễ nữa.", en: "Yes, I'll wake up earlier so I won't be late again." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền liên từ nhân quả còn thiếu:",
        instruction_en: "Fill in the missing cause-effect connector:",
        items: [
          { prompt: "Saya tidak datang ___ sakit. (vì, trước nguyên nhân)", answer: "karena", options: ["karena", "sehingga", "namun"] },
          { prompt: "Dia belajar keras ___ lulus ujian. (nên, trước kết quả)", answer: "sehingga", options: ["sehingga", "karena", "meskipun"] },
          { prompt: "Hujan deras, ___ kami tidak jadi pergi. (nên, khẩu ngữ)", answer: "jadi", options: ["jadi", "tapi", "agar"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối liên từ với nghĩa tiếng Việt:",
        instruction_en: "Match each connector with its Vietnamese meaning:",
        items: [
          { prompt: "karena", answer: "vì / bởi vì" },
          { prompt: "sehingga", answer: "nên / dẫn đến" },
          { prompt: "jadi", answer: "nên / vì vậy" },
          { prompt: "oleh karena itu", answer: "vì thế / do đó" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi không đến vì bị ốm.", answer: "Saya tidak datang karena sakit." },
          { prompt: "Anh ấy học chăm nên đậu kỳ thi.", answer: "Dia belajar keras sehingga lulus ujian." },
          { prompt: "Vì kẹt xe, anh ấy đến văn phòng muộn.", answer: "Karena macet, dia terlambat ke kantor." },
        ],
      },
    ],
  },
  {
    id: "indonesian_conj_purpose_condition",
    level: "B1",
    category: "grammar-connectors",
    title_vi: "Liên từ mục đích, điều kiện và trình tự — agar, kalau, lalu",
    title_en: "Purpose, condition and sequence — agar, kalau, lalu",
    sentences: [
      {
        en: "Saya belajar keras agar lulus ujian.",
        vi: "Tôi học chăm để đậu kỳ thi.",
        pronunciation_focus: [
          "agar → A-gar, 'để/để mà' (nêu MỤC ĐÍCH)",
          "đồng nghĩa 'supaya'; trang trọng hơn một chút",
          "khác 'sehingga' (kết quả thực tế) — agar là mục đích MONG MUỐN",
        ],
        pronunciation_focus_en: [
          "agar → 'A-gar' — so that / in order to (states PURPOSE)",
          "synonym 'supaya'; slightly more formal",
          "differs from 'sehingga' (an actual result) — agar is an INTENDED purpose",
        ],
      },
      {
        en: "Tolong tutup pintu supaya tidak berisik.",
        vi: "Làm ơn đóng cửa để khỏi ồn.",
        pronunciation_focus: [
          "supaya → su-PA-ya, 'để (cho)' (mục đích, khẩu ngữ phổ biến)",
          "supaya tidak… = 'để không/khỏi…'",
          "berisik → be-RI-sik, 'ồn ào'",
        ],
        pronunciation_focus_en: [
          "supaya → 'soo-PA-ya' — so that (purpose, very common)",
          "supaya tidak… = 'so that … not / to avoid…'",
          "berisik → 'be-REE-seek' — noisy",
        ],
      },
      {
        en: "Kalau hujan, saya tidak akan keluar.",
        vi: "Nếu trời mưa, tôi sẽ không ra ngoài.",
        pronunciation_focus: [
          "kalau → KA-lau, 'nếu' (điều kiện, khẩu ngữ)",
          "đồng nghĩa 'jika' (trang trọng), 'bila' (trang trọng/văn viết)",
          "akan → A-kan, 'sẽ' (dấu hiệu tương lai)",
        ],
        pronunciation_focus_en: [
          "kalau → 'KA-lau' — if (condition, casual)",
          "synonyms 'jika' (formal), 'bila' (formal/written)",
          "akan → 'A-kan' — will (future marker)",
        ],
      },
      {
        en: "Dia mandi, lalu sarapan, kemudian berangkat kerja.",
        vi: "Anh ấy tắm, rồi ăn sáng, sau đó đi làm.",
        pronunciation_focus: [
          "lalu → LA-lu, 'rồi/sau đó' (nối trình tự)",
          "kemudian → ke-mu-DI-an, 'sau đó' (trang trọng hơn 'lalu')",
          "sarapan → sa-RA-pan, 'ăn sáng/bữa sáng'",
        ],
        pronunciation_focus_en: [
          "lalu → 'LA-loo' — then / after that (sequence)",
          "kemudian → 'ke-moo-DEE-an' — then / afterwards (more formal than 'lalu')",
          "sarapan → 'sa-RA-pan' — breakfast / to have breakfast",
        ],
      },
      {
        en: "Selain itu, dia juga rajin membantu orang tuanya.",
        vi: "Ngoài ra, anh ấy còn siêng giúp đỡ cha mẹ.",
        pronunciation_focus: [
          "selain itu → 'ngoài ra/bên cạnh đó' (thêm ý/bổ sung)",
          "juga → JU-ga, 'cũng'",
          "rajin → RA-jin, 'siêng năng/chăm chỉ'",
        ],
        pronunciation_focus_en: [
          "selain itu → 'besides / in addition' (adds a point)",
          "juga → 'JOO-ga' — also / too",
          "rajin → 'RA-jeen' — diligent / hardworking",
        ],
      },
    ],
    cultural_notes_vi:
      "Liên từ ở bậc B1 mở rộng sang MỤC ĐÍCH, ĐIỀU KIỆN, TRÌNH TỰ và BỔ SUNG:\n• MỤC ĐÍCH (để): 'agar' (trang trọng), 'supaya' (phổ biến), 'untuk' (+ động từ). 'agar/supaya' đi với mệnh đề; 'untuk' đi với động từ đơn.\n• ĐIỀU KIỆN (nếu): 'kalau' (khẩu ngữ), 'jika' (trang trọng), 'bila' (văn viết), 'apabila' (rất trang trọng/pháp lý), 'seandainya' (giả như/giả sử).\n• TRÌNH TỰ (rồi/sau đó): 'lalu', 'kemudian', 'setelah itu'.\n• BỔ SUNG (ngoài ra): 'selain itu', 'di samping itu'.\nPhân biệt quan trọng: 'agar/supaya' (mục đích — kết quả MONG MUỐN) ≠ 'sehingga' (kết quả ĐÃ XẢY RA). 'Belajar agar lulus' = học ĐỂ đậu (mong muốn); 'belajar sehingga lulus' = học NÊN đậu (đã đậu thật).",
    cultural_notes_en:
      "At B1, connectors expand into PURPOSE, CONDITION, SEQUENCE and ADDITION:\n• PURPOSE (so that): 'agar' (formal), 'supaya' (common), 'untuk' (+ verb). 'agar/supaya' take a clause; 'untuk' takes a bare verb.\n• CONDITION (if): 'kalau' (casual), 'jika' (formal), 'bila' (written), 'apabila' (very formal/legal), 'seandainya' (supposing).\n• SEQUENCE (then): 'lalu', 'kemudian', 'setelah itu'.\n• ADDITION (besides): 'selain itu', 'di samping itu'.\nKey distinction: 'agar/supaya' (purpose — an INTENDED result) ≠ 'sehingga' (a result that ACTUALLY happened). 'Belajar agar lulus' = study IN ORDER TO pass (intent); 'belajar sehingga lulus' = studied SO passed (actually passed).",
    tip_advice_vi:
      "Mẹo cho người Việt: 'untuk' + ĐỘNG TỪ ('untuk belajar' = để học), nhưng 'agar/supaya' + MỆNH ĐỀ có chủ ngữ ('agar saya lulus' = để tôi đậu). Lỗi hay gặp: dùng 'untuk' khi cần mệnh đề. Bậc trang trọng điều kiện: kalau (đời thường) < jika < bila < apabila (pháp lý). Trình tự: 'lalu' và 'kemudian' đều là 'rồi/sau đó' — 'kemudian' trang trọng hơn, hợp văn viết. 'Selain itu' mở đầu câu để THÊM ý, rất hữu ích khi viết luận. Nhớ: 'agar/supaya' = mục đích (chưa chắc đạt), 'sehingga' = kết quả thật (đã đạt) — đừng lẫn.",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'untuk' + a VERB ('untuk belajar' = to study), but 'agar/supaya' + a CLAUSE with a subject ('agar saya lulus' = so that I pass). Common error: using 'untuk' where a clause is needed. Conditional formality scale: kalau (casual) < jika < bila < apabila (legal). Sequence: 'lalu' and 'kemudian' both mean 'then' — 'kemudian' is more formal, fitting writing. 'Selain itu' opens a sentence to ADD a point, very useful in essays. Remember: 'agar/supaya' = purpose (not necessarily achieved), 'sehingga' = an actual result (achieved) — don't mix them.",
    vocabulary: [
      { word: "agar", en: "so that / in order to", vi: "để / để mà", pos: "conj.", pronunciation_vi: "A-gar", pronunciation_en: "A-gar" },
      { word: "supaya", en: "so that", vi: "để (cho)", pos: "conj.", pronunciation_vi: "su-PA-ya", pronunciation_en: "soo-PA-ya" },
      { word: "kalau", en: "if", vi: "nếu", pos: "conj.", pronunciation_vi: "KA-lau", pronunciation_en: "KA-lau" },
      { word: "jika", en: "if (formal)", vi: "nếu (trang trọng)", pos: "conj.", pronunciation_vi: "JI-ka", pronunciation_en: "JEE-ka" },
      { word: "lalu", en: "then / after that", vi: "rồi / sau đó", pos: "conj.", pronunciation_vi: "LA-lu", pronunciation_en: "LA-loo" },
      { word: "kemudian", en: "then / afterwards", vi: "sau đó", pos: "conj.", pronunciation_vi: "ke-mu-DI-an", pronunciation_en: "ke-moo-DEE-an" },
      { word: "selain itu", en: "besides / in addition", vi: "ngoài ra", pos: "conj.", pronunciation_vi: "se-LA-in I-tu", pronunciation_en: "se-LA-een EE-too" },
      { word: "rajin", en: "diligent / hardworking", vi: "siêng năng", pos: "adj.", pronunciation_vi: "RA-jin", pronunciation_en: "RA-jeen" },
      { word: "berisik", en: "noisy", vi: "ồn ào", pos: "adj.", pronunciation_vi: "be-RI-sik", pronunciation_en: "be-REE-seek" },
    ],
    dialogue: [
      { speaker: "Guru", text: "Kalau kamu ingin lulus, kamu harus belajar lebih rajin.", vi: "Nếu em muốn đậu, em phải học chăm hơn.", en: "If you want to pass, you have to study harder." },
      { speaker: "Murid", text: "Baik, Bu. Saya akan buat jadwal agar belajar lebih teratur.", vi: "Vâng ạ. Em sẽ lập thời khóa biểu để học có nề nếp hơn.", en: "Yes, ma'am. I'll make a schedule so I study more regularly." },
      { speaker: "Guru", text: "Bagus. Selain itu, jangan lupa istirahat supaya tidak kelelahan.", vi: "Tốt. Ngoài ra, đừng quên nghỉ ngơi để khỏi kiệt sức.", en: "Good. Besides, don't forget to rest so you don't get exhausted." },
      { speaker: "Murid", text: "Siap. Saya akan belajar dulu, lalu istirahat, kemudian mengulang lagi.", vi: "Rõ ạ. Em sẽ học trước, rồi nghỉ, sau đó ôn lại.", en: "Got it. I'll study first, then rest, then review again." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền liên từ mục đích/điều kiện/trình tự còn thiếu:",
        instruction_en: "Fill in the missing purpose/condition/sequence connector:",
        items: [
          { prompt: "Saya belajar keras ___ lulus ujian. (để, mục đích)", answer: "agar", options: ["agar", "karena", "tetapi"] },
          { prompt: "___ hujan, saya tidak akan keluar. (nếu)", answer: "Kalau", options: ["Kalau", "Lalu", "Namun"] },
          { prompt: "Dia mandi, ___ sarapan, kemudian berangkat. (rồi/sau đó)", answer: "lalu", options: ["lalu", "agar", "karena"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối liên từ với nghĩa tiếng Việt:",
        instruction_en: "Match each connector with its Vietnamese meaning:",
        items: [
          { prompt: "agar / supaya", answer: "để (cho)" },
          { prompt: "kalau", answer: "nếu" },
          { prompt: "kemudian", answer: "sau đó" },
          { prompt: "selain itu", answer: "ngoài ra" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Làm ơn đóng cửa để khỏi ồn.", answer: "Tolong tutup pintu supaya tidak berisik." },
          { prompt: "Nếu trời mưa, tôi sẽ không ra ngoài.", answer: "Kalau hujan, saya tidak akan keluar." },
          { prompt: "Ngoài ra, anh ấy còn siêng giúp đỡ cha mẹ.", answer: "Selain itu, dia juga rajin membantu orang tuanya." },
        ],
      },
    ],
  },
];

export default conjunctionsConnectorsLessons;
