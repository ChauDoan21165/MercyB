// src/languages/indonesian/extra/religion-traditions.ts
//
// Indonesian religion & traditions pack for Vietnamese learners.
// Covers: the six recognized religions and tolerance vocabulary, the Muslim
// fasting month (Ramadan) and Lebaran/Idul Fitri, and the other major national
// religious holidays (Natal, Imlek, Nyepi, Waisak). Hand-crafted, no filler.
//
// Shape mirrors the named template src/languages/portuguese/lessons-a1.ts so the
// page UI stays consistent across language verticals. The types are defined
// inline because the Indonesian pack has no sibling lessons.ts registry yet
// (A7 owns it) — this file is self-contained on purpose. Types are NOT exported
// and the lesson array uses a unique name so a future barrel `export *` cannot
// collide with the sibling extra packs.
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
type Exercise = Record<string, unknown>;

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

export const religionTraditionsLessons: IndonesianLesson[] = [
  {
    id: "indonesian_six_religions_tolerance",
    level: "A2",
    category: "religion_traditions",
    title_vi: "Sáu tôn giáo và từ vựng về sự khoan dung",
    title_en: "The six religions and tolerance vocabulary",
    sentences: [
      {
        en: "Di Indonesia ada enam agama yang resmi diakui.",
        vi: "Ở Indonesia có sáu tôn giáo được công nhận chính thức.",
        pronunciation_focus: [
          "agama → a-GA-ma, 'tôn giáo'",
          "enam → eu-NAM, 'sáu'",
          "diakui → 'được công nhận' — tiền tố di- (bị động) + gốc aku",
        ],
        pronunciation_focus_en: [
          "agama → 'a-GA-ma' — religion",
          "enam → 'e-NAM' — six",
          "diakui → 'recognized' — passive 'di-' + root 'aku'",
        ],
      },
      {
        en: "Saya beragama Buddha, dan teman saya beragama Islam.",
        vi: "Tôi theo đạo Phật, còn bạn tôi theo đạo Hồi.",
        pronunciation_focus: [
          "beragama → 'theo đạo' — tiền tố ber- + gốc agama (có tôn giáo)",
          "Buddha → BU-da, 'đạo Phật'",
          "Islam → IS-lam, 'đạo Hồi'; không chia động từ dù chủ ngữ khác",
        ],
        pronunciation_focus_en: [
          "beragama → 'to have a religion / follow' — prefix 'ber-' + root 'agama'",
          "Buddha → 'BOO-da' — Buddhism",
          "Islam → 'IS-lam'; the verb does not change for a different subject",
        ],
      },
      {
        en: "Kita harus saling menghormati keyakinan orang lain.",
        vi: "Chúng ta phải tôn trọng lẫn nhau niềm tin của người khác.",
        pronunciation_focus: [
          "saling → SA-ling, 'lẫn nhau/qua lại'",
          "menghormati → 'tôn trọng' — gốc hormat",
          "keyakinan → 'niềm tin/đức tin' (gốc yakin + ke-…-an)",
        ],
        pronunciation_focus_en: [
          "saling → 'SA-ling' — each other / mutually",
          "menghormati → 'to respect' — root 'hormat'",
          "keyakinan → 'belief / faith' (root 'yakin' + circumfix 'ke-…-an')",
        ],
      },
      {
        en: "Toleransi antar umat beragama sangat penting.",
        vi: "Sự khoan dung giữa các tín đồ tôn giáo rất quan trọng.",
        pronunciation_focus: [
          "toleransi → tô-le-RAN-si, 'sự khoan dung'",
          "antar umat → 'giữa các cộng đồng (tín đồ)'",
          "penting → PEN-ting, 'quan trọng'",
        ],
        pronunciation_focus_en: [
          "toleransi → 'toh-le-RAN-see' — tolerance",
          "antar umat → 'between communities (of believers)'",
          "penting → 'PEN-ting' — important",
        ],
      },
      {
        en: "Maaf, saya tidak makan daging babi.",
        vi: "Xin lỗi, tôi không ăn thịt heo.",
        pronunciation_focus: [
          "maaf → ma-AF, 'xin lỗi' — hai âm a tách rời",
          "daging babi → 'thịt heo' (daging = thịt, babi = heo)",
          "lưu ý: nhiều người Hồi giáo kiêng thịt heo (haram)",
        ],
        pronunciation_focus_en: [
          "maaf → 'ma-AF' — sorry/excuse me; two separate 'a' vowels",
          "daging babi → 'pork' (daging = meat, babi = pig)",
          "note: many Muslims avoid pork (it is haram)",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia công nhận chính thức sáu tôn giáo: Islam (đạo Hồi, đa số), Kristen Protestan (Tin Lành), Katolik (Công giáo), Hindu, Buddha (Phật giáo) và Konghucu (Khổng giáo). Nguyên tắc lập quốc Pancasila đặt 'Ketuhanan' (niềm tin vào Thượng đế) làm điều thứ nhất. Hỏi 'Agama apa?' (theo đạo gì?) là bình thường, không nhạy cảm như ở phương Tây. Tôn trọng việc kiêng thịt heo (Hồi giáo) và thịt bò (một số Hindu) khi mời ăn.",
    cultural_notes_en:
      "Indonesia officially recognizes six religions: Islam (the majority), Protestant Christianity (Kristen), Catholicism (Katolik), Hinduism, Buddhism, and Confucianism (Konghucu). The national philosophy Pancasila places 'Ketuhanan' (belief in God) as its first principle. Asking 'Agama apa?' (what's your religion?) is normal small talk, not as sensitive as in the West. Respect dietary rules — no pork for Muslims, no beef for some Hindus — when hosting a meal.",
    tip_advice_vi:
      "Mẹo cho người Việt: tiền tố 'ber-' nghĩa là 'có/mang' — beragama (có tôn giáo = theo đạo), berkeluarga (có gia đình). 'Saling' đặt trước động từ = 'lẫn nhau': saling menghormati (tôn trọng nhau), saling membantu (giúp nhau). Câu vàng để lịch sự khi ăn uống: 'Maaf, saya tidak makan…' (Xin lỗi, tôi không ăn…).",
    tip_advice_en:
      "Tip for Vietnamese speakers: the prefix 'ber-' means 'to have/bear' — beragama (to have a religion = follow a faith), berkeluarga (to have a family). 'Saling' before a verb = 'each other': saling menghormati (respect one another), saling membantu (help one another). The golden polite line at meals: 'Maaf, saya tidak makan…' (Sorry, I don't eat…).",
    vocabulary: [
      {
        word: "agama",
        en: "religion",
        vi: "tôn giáo",
        pos: "noun",
        pronunciation_vi: "a-GA-ma",
        pronunciation_en: "a-GA-ma",
      },
      {
        word: "Islam",
        en: "Islam",
        vi: "đạo Hồi",
        pos: "noun (proper)",
        pronunciation_vi: "IS-lam",
        pronunciation_en: "IS-lam",
      },
      {
        word: "Kristen",
        en: "(Protestant) Christianity",
        vi: "đạo Tin Lành",
        pos: "noun (proper)",
        pronunciation_vi: "KRIS-ten",
        pronunciation_en: "KRIS-ten",
      },
      {
        word: "Katolik",
        en: "Catholicism",
        vi: "đạo Công giáo",
        pos: "noun (proper)",
        pronunciation_vi: "ka-TÔ-lik",
        pronunciation_en: "ka-TOH-lik",
      },
      {
        word: "Hindu",
        en: "Hinduism",
        vi: "đạo Hindu",
        pos: "noun (proper)",
        pronunciation_vi: "HIN-du",
        pronunciation_en: "HIN-doo",
      },
      {
        word: "Buddha",
        en: "Buddhism",
        vi: "đạo Phật",
        pos: "noun (proper)",
        pronunciation_vi: "BU-da",
        pronunciation_en: "BOO-da",
      },
      {
        word: "toleransi",
        en: "tolerance",
        vi: "sự khoan dung",
        pos: "noun",
        pronunciation_vi: "tô-le-RAN-si",
        pronunciation_en: "toh-le-RAN-see",
      },
      {
        word: "menghormati",
        en: "to respect",
        vi: "tôn trọng",
        pos: "verb",
        pronunciation_vi: "meng-hor-MA-ti",
        pronunciation_en: "meng-hor-MA-tee",
      },
      {
        word: "keyakinan",
        en: "belief / faith",
        vi: "niềm tin / đức tin",
        pos: "noun",
        pronunciation_vi: "keu-ya-KI-nan",
        pronunciation_en: "ke-ya-KEE-nan",
      },
    ],
    dialogue: [
      {
        speaker: "Andi",
        text: "Boleh tanya, kamu beragama apa?",
        vi: "Cho hỏi, bạn theo đạo gì?",
        en: "May I ask, what is your religion?",
      },
      {
        speaker: "Mai",
        text: "Saya beragama Buddha. Kalau kamu?",
        vi: "Tôi theo đạo Phật. Còn bạn?",
        en: "I'm Buddhist. And you?",
      },
      {
        speaker: "Andi",
        text: "Saya Islam. Di sini kita saling menghormati, kok.",
        vi: "Tôi đạo Hồi. Ở đây chúng ta tôn trọng lẫn nhau mà.",
        en: "I'm Muslim. Here we respect each other, you know.",
      },
      {
        speaker: "Mai",
        text: "Bagus sekali. Toleransi memang penting.",
        vi: "Tuyệt vời. Khoan dung quả thật rất quan trọng.",
        en: "That's wonderful. Tolerance really is important.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về tôn giáo còn thiếu:",
        instruction_en: "Fill in the missing religion word:",
        items: [
          {
            prompt: "Di Indonesia ada enam ___ yang resmi. (tôn giáo)",
            answer: "agama",
            options: ["agama", "angka", "acara"],
          },
          {
            prompt: "Kita harus saling ___ keyakinan orang lain. (tôn trọng)",
            answer: "menghormati",
            options: ["menghormati", "menghitung", "menghindari"],
          },
          {
            prompt: "___ antar umat beragama sangat penting. (sự khoan dung)",
            answer: "Toleransi",
            options: ["Toleransi", "Transportasi", "Tradisi"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối tôn giáo với nghĩa tiếng Việt:",
        instruction_en: "Match each religion with its Vietnamese meaning:",
        items: [
          { prompt: "Islam", answer: "đạo Hồi" },
          { prompt: "Buddha", answer: "đạo Phật" },
          { prompt: "Katolik", answer: "đạo Công giáo" },
          { prompt: "Kristen", answer: "đạo Tin Lành" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi theo đạo Phật.", answer: "Saya beragama Buddha." },
          { prompt: "Chúng ta phải tôn trọng lẫn nhau.", answer: "Kita harus saling menghormati." },
          { prompt: "Xin lỗi, tôi không ăn thịt heo.", answer: "Maaf, saya tidak makan daging babi." },
        ],
      },
    ],
  },
  {
    id: "indonesian_ramadan_lebaran",
    level: "A2",
    category: "religion_traditions",
    title_vi: "Ramadan và Lebaran (Idul Fitri)",
    title_en: "Ramadan and Lebaran (Idul Fitri)",
    sentences: [
      {
        en: "Selama bulan Ramadan, umat Islam berpuasa dari subuh sampai magrib.",
        vi: "Trong tháng Ramadan, người Hồi giáo nhịn ăn từ sáng sớm đến lúc mặt trời lặn.",
        pronunciation_focus: [
          "Ramadan → ra-ma-DAN, tháng ăn chay của đạo Hồi",
          "berpuasa → 'nhịn ăn/ăn chay' (gốc puasa + ber-)",
          "subuh … magrib → 'rạng sáng … chập tối' (mốc giờ cầu nguyện)",
        ],
        pronunciation_focus_en: [
          "Ramadan → 'ra-ma-DAN' — the Muslim fasting month",
          "berpuasa → 'to fast' (root 'puasa' + 'ber-')",
          "subuh … magrib → 'dawn … dusk' (the prayer-time markers)",
        ],
      },
      {
        en: "Mereka berbuka puasa dengan kurma dan air.",
        vi: "Họ kết thúc nhịn ăn bằng chà là và nước.",
        pronunciation_focus: [
          "mereka → meu-RE-ka, 'họ' (số nhiều)",
          "berbuka puasa → 'xả chay/kết thúc nhịn ăn' (buka = mở)",
          "kurma → KUR-ma, 'quả chà là'",
        ],
        pronunciation_focus_en: [
          "mereka → 'me-REH-ka' — they",
          "berbuka puasa → 'to break the fast' (buka = open)",
          "kurma → 'KOOR-ma' — dates (the fruit)",
        ],
      },
      {
        en: "Selamat Idul Fitri, mohon maaf lahir dan batin.",
        vi: "Chúc mừng Idul Fitri, xin lượng thứ mọi lỗi lầm trong lời nói và tâm ý.",
        pronunciation_focus: [
          "Idul Fitri → I-dul FI-tri, đại lễ kết thúc tháng chay",
          "mohon maaf → 'xin lỗi/xin thứ lỗi' trang trọng",
          "lahir dan batin → 'bên ngoài và bên trong (tâm)' — câu chúc cố định",
        ],
        pronunciation_focus_en: [
          "Idul Fitri → 'EE-dool FEE-tree' — the festival ending the fasting month",
          "mohon maaf → 'I beg forgiveness' (formal apology)",
          "lahir dan batin → 'outward and inward' — a fixed festive blessing",
        ],
      },
      {
        en: "Banyak orang mudik ke kampung halaman saat Lebaran.",
        vi: "Nhiều người về quê dịp Lebaran.",
        pronunciation_focus: [
          "mudik → MU-dik, 'về quê (dịp lễ)' — từ đặc trưng Indonesia",
          "kampung halaman → 'quê nhà'",
          "Lebaran → leu-BA-ran, tên dân dã của Idul Fitri",
        ],
        pronunciation_focus_en: [
          "mudik → 'MOO-dik' — the mass homecoming trip for the holiday (a quintessential Indonesian word)",
          "kampung halaman → 'hometown / native village'",
          "Lebaran → 'le-BA-ran' — the everyday name for Idul Fitri",
        ],
      },
      {
        en: "Anak-anak menerima uang dari orang tua dan kerabat.",
        vi: "Trẻ em nhận tiền từ cha mẹ và họ hàng.",
        pronunciation_focus: [
          "anak-anak → 'trẻ con' — lặp từ để chỉ số nhiều (giống tiếng Việt nhân đôi)",
          "menerima → 'nhận' (gốc terima)",
          "kerabat → keu-RA-bat, 'họ hàng'",
        ],
        pronunciation_focus_en: [
          "anak-anak → 'children' — reduplication marks the plural",
          "menerima → 'to receive' (root 'terima')",
          "kerabat → 'ke-RA-bat' — relatives",
        ],
      },
    ],
    cultural_notes_vi:
      "Ramadan là tháng ăn chay thiêng liêng nhất của đạo Hồi: nhịn ăn uống ban ngày (từ 'subuh' đến 'magrib'), ăn 'sahur' (bữa trước rạng sáng) và 'buka puasa' (xả chay lúc chập tối). Kết thúc là đại lễ Idul Fitri/Lebaran. 'Mudik' — cuộc di cư về quê khổng lồ — là hiện tượng đặc trưng Indonesia. Lời chúc cố định: 'Mohon maaf lahir dan batin' (xin thứ lỗi mọi điều). Phong tục lì xì gọi là 'THR' (tiền thưởng lễ) hoặc 'uang Lebaran'.",
    cultural_notes_en:
      "Ramadan is Islam's holiest month: fasting in daylight (from 'subuh' dawn to 'magrib' dusk), with 'sahur' (pre-dawn meal) and 'buka puasa' (breaking the fast at dusk). It ends with the grand festival Idul Fitri/Lebaran. 'Mudik' — the enormous homeward migration — is a quintessentially Indonesian phenomenon. The fixed greeting is 'Mohon maaf lahir dan batin' (I beg forgiveness for all wrongs). The gift money is called 'THR' (holiday bonus) or 'uang Lebaran'.",
    tip_advice_vi:
      "Mẹo cho người Việt: tiếng Indonesia tạo số nhiều bằng cách LẶP từ — anak-anak (trẻ con), orang-orang (mọi người). Quen thuộc với người Việt vì ta cũng có lối nhân đôi. Cặp từ thời lễ: berpuasa (nhịn ăn) ↔ berbuka (xả chay). Học nguyên câu chúc 'Selamat Idul Fitri, mohon maaf lahir dan batin' — dùng nguyên khối, ai nghe cũng quý.",
    tip_advice_en:
      "Tip for Vietnamese speakers: Indonesian makes plurals by REDUPLICATING the noun — anak-anak (children), orang-orang (people). This feels natural to Vietnamese speakers, who also double words. Festive pair: berpuasa (to fast) ↔ berbuka (to break the fast). Learn the whole greeting 'Selamat Idul Fitri, mohon maaf lahir dan batin' as one chunk — it always lands warmly.",
    vocabulary: [
      {
        word: "Ramadan",
        en: "Ramadan (fasting month)",
        vi: "tháng Ramadan",
        pos: "noun (proper)",
        pronunciation_vi: "ra-ma-DAN",
        pronunciation_en: "ra-ma-DAN",
      },
      {
        word: "puasa",
        en: "fasting",
        vi: "sự nhịn ăn / ăn chay",
        pos: "noun / verb",
        pronunciation_vi: "pu-A-sa",
        pronunciation_en: "poo-A-sa",
      },
      {
        word: "berbuka puasa",
        en: "to break the fast",
        vi: "xả chay",
        pos: "verb",
        pronunciation_vi: "ber-BU-ka pu-A-sa",
        pronunciation_en: "ber-BOO-ka poo-A-sa",
      },
      {
        word: "sahur",
        en: "pre-dawn meal",
        vi: "bữa ăn trước rạng sáng",
        pos: "noun",
        pronunciation_vi: "sa-HUR",
        pronunciation_en: "sa-HOOR",
      },
      {
        word: "Lebaran / Idul Fitri",
        en: "the festival ending Ramadan",
        vi: "đại lễ kết thúc tháng chay",
        pos: "noun (proper)",
        pronunciation_vi: "leu-BA-ran / I-dul FI-tri",
        pronunciation_en: "le-BA-ran / EE-dool FEE-tree",
      },
      {
        word: "mudik",
        en: "holiday homecoming trip",
        vi: "về quê dịp lễ",
        pos: "verb / noun",
        pronunciation_vi: "MU-dik",
        pronunciation_en: "MOO-dik",
      },
      {
        word: "kampung halaman",
        en: "hometown / native village",
        vi: "quê nhà",
        pos: "noun",
        pronunciation_vi: "KAM-pung ha-LA-man",
        pronunciation_en: "KAM-poong ha-LA-man",
      },
      {
        word: "kurma",
        en: "dates (fruit)",
        vi: "quả chà là",
        pos: "noun",
        pronunciation_vi: "KUR-ma",
        pronunciation_en: "KOOR-ma",
      },
      {
        word: "kerabat",
        en: "relatives",
        vi: "họ hàng",
        pos: "noun",
        pronunciation_vi: "keu-RA-bat",
        pronunciation_en: "ke-RA-bat",
      },
    ],
    dialogue: [
      {
        speaker: "Budi",
        text: "Besok mulai puasa. Kamu ikut sahur?",
        vi: "Mai bắt đầu nhịn ăn. Bạn có ăn sahur không?",
        en: "Tomorrow the fast begins. Will you join the pre-dawn meal?",
      },
      {
        speaker: "Sinta",
        text: "Iya, jam tiga pagi. Nanti buka puasa di masjid, yuk.",
        vi: "Ừ, ba giờ sáng. Lát nữa xả chay ở thánh đường nhé.",
        en: "Yes, at 3 a.m. Let's break the fast at the mosque later.",
      },
      {
        speaker: "Budi",
        text: "Boleh. Lebaran nanti kamu mudik ke mana?",
        vi: "Được. Lebaran tới bạn về quê ở đâu?",
        en: "Sure. Where will you travel home for Lebaran?",
      },
      {
        speaker: "Sinta",
        text: "Ke kampung halaman di Solo. Selamat Idul Fitri, ya!",
        vi: "Về quê ở Solo. Chúc mừng Idul Fitri nhé!",
        en: "To my hometown in Solo. Happy Idul Fitri!",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về Ramadan/Lebaran còn thiếu:",
        instruction_en: "Fill in the missing Ramadan/Lebaran word:",
        items: [
          {
            prompt: "Umat Islam ___ dari subuh sampai magrib. (nhịn ăn)",
            answer: "berpuasa",
            options: ["berpuasa", "berbelanja", "berbicara"],
          },
          {
            prompt: "Banyak orang ___ ke kampung halaman saat Lebaran. (về quê)",
            answer: "mudik",
            options: ["mudik", "masuk", "mandi"],
          },
          {
            prompt: "Mereka ___ puasa dengan kurma. (xả chay / mở)",
            answer: "berbuka",
            options: ["berbuka", "bertemu", "berhenti"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "puasa", answer: "ăn chay / nhịn ăn" },
          { prompt: "sahur", answer: "bữa trước rạng sáng" },
          { prompt: "kampung halaman", answer: "quê nhà" },
          { prompt: "kurma", answer: "quả chà là" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Họ xả chay bằng chà là và nước.", answer: "Mereka berbuka puasa dengan kurma dan air." },
          { prompt: "Nhiều người về quê dịp Lebaran.", answer: "Banyak orang mudik ke kampung halaman saat Lebaran." },
          { prompt: "Chúc mừng Idul Fitri!", answer: "Selamat Idul Fitri!" },
        ],
      },
    ],
  },
  {
    id: "indonesian_national_religious_holidays",
    level: "B1",
    category: "religion_traditions",
    title_vi: "Các ngày lễ tôn giáo quốc gia — Natal, Imlek, Nyepi, Waisak",
    title_en: "National religious holidays — Natal, Imlek, Nyepi, Waisak",
    sentences: [
      {
        en: "Natal dirayakan oleh umat Kristen dan Katolik setiap bulan Desember.",
        vi: "Lễ Giáng sinh được tổ chức bởi tín đồ Tin Lành và Công giáo vào mỗi tháng Mười Hai.",
        pronunciation_focus: [
          "Natal → NA-tal, 'lễ Giáng sinh'",
          "dirayakan → 'được tổ chức/ăn mừng' — di- bị động + gốc raya + -kan",
          "oleh → Ô-léh, 'bởi' — chỉ tác nhân trong câu bị động",
        ],
        pronunciation_focus_en: [
          "Natal → 'NA-tal' — Christmas",
          "dirayakan → 'is celebrated' — passive 'di-' + root 'raya' + '-kan'",
          "oleh → 'OH-leh' — 'by' (marks the agent in a passive sentence)",
        ],
      },
      {
        en: "Tahun Baru Imlek dirayakan oleh masyarakat Tionghoa.",
        vi: "Tết Nguyên đán được cộng đồng người Hoa tổ chức.",
        pronunciation_focus: [
          "Imlek → IM-lék, 'Tết âm lịch (người Hoa)'",
          "Tahun Baru → 'năm mới' (tahun = năm, baru = mới)",
          "Tionghoa → ti-ong-HÔ-a, 'người gốc Hoa'",
        ],
        pronunciation_focus_en: [
          "Imlek → 'IM-lek' — Chinese Lunar New Year",
          "Tahun Baru → 'New Year' (tahun = year, baru = new)",
          "Tionghoa → 'tee-ong-HOH-a' — ethnic Chinese (Indonesian)",
        ],
      },
      {
        en: "Saat Nyepi, seluruh Bali sunyi senyap selama satu hari.",
        vi: "Vào dịp Nyepi, cả đảo Bali im lặng tuyệt đối suốt một ngày.",
        pronunciation_focus: [
          "Nyepi → NYE-pi, 'Ngày Tĩnh lặng' của đạo Hindu Bali",
          "sunyi senyap → 'tĩnh mịch hoàn toàn' (cặp từ nhấn mạnh)",
          "seluruh → seu-LU-ruh, 'toàn bộ/cả'",
        ],
        pronunciation_focus_en: [
          "Nyepi → 'NYE-pee' — the Balinese Hindu Day of Silence",
          "sunyi senyap → 'utterly silent' (an intensifying word pair)",
          "seluruh → 'se-LOO-rooh' — the whole / entire",
        ],
      },
      {
        en: "Waisak adalah hari suci umat Buddha untuk memperingati kelahiran Buddha.",
        vi: "Waisak là ngày thiêng của Phật tử để tưởng niệm sự ra đời của Đức Phật.",
        pronunciation_focus: [
          "Waisak → WAI-sak, 'lễ Phật Đản' (Vesak)",
          "hari suci → 'ngày thiêng/thánh'",
          "memperingati → 'tưởng niệm/kỷ niệm' (tiền tố memper- + ingat)",
        ],
        pronunciation_focus_en: [
          "Waisak → 'WHY-sak' — Vesak, the Buddhist holy day",
          "hari suci → 'holy/sacred day'",
          "memperingati → 'to commemorate' (prefix 'memper-' + 'ingat')",
        ],
      },
      {
        en: "Semua hari raya keagamaan ini adalah hari libur nasional.",
        vi: "Tất cả những ngày lễ tôn giáo này đều là ngày nghỉ lễ toàn quốc.",
        pronunciation_focus: [
          "hari raya → 'ngày đại lễ' (raya = lớn)",
          "keagamaan → 'thuộc tôn giáo' (agama + ke-…-an)",
          "hari libur nasional → 'ngày nghỉ lễ quốc gia'",
        ],
        pronunciation_focus_en: [
          "hari raya → 'great festival day' (raya = grand)",
          "keagamaan → 'religious (adj.)' (agama + 'ke-…-an')",
          "hari libur nasional → 'national public holiday'",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia là nước thế tục đa tôn giáo: tất cả các đại lễ của sáu tôn giáo đều là ngày nghỉ quốc gia — Natal (Giáng sinh), Tahun Baru Imlek (Tết người Hoa), Nyepi (Ngày Tĩnh lặng của Hindu Bali — sân bay đóng, đèn tắt, cả đảo im lặng), Waisak (Phật Đản, tổ chức lớn ở đền Borobudur), cùng Idul Fitri và Idul Adha của đạo Hồi. Đây là biểu hiện cụ thể của 'Bhinneka Tunggal Ika' (Thống nhất trong đa dạng) — khẩu hiệu quốc gia.",
    cultural_notes_en:
      "Indonesia is a secular, multi-religious state: every major festival of the six religions is a national holiday — Natal (Christmas), Tahun Baru Imlek (Chinese New Year), Nyepi (the Balinese Hindu Day of Silence — the airport closes, lights go off, the whole island falls quiet), Waisak (Vesak, celebrated grandly at Borobudur temple), plus Islam's Idul Fitri and Idul Adha. This is the concrete expression of 'Bhinneka Tunggal Ika' (Unity in Diversity) — the national motto.",
    tip_advice_vi:
      "Mẹo cho người Việt: câu bị động dùng 'di- + động từ … oleh + tác nhân' — 'Natal dirayakan oleh umat Kristen' (Giáng sinh được tổ chức bởi tín đồ Tin Lành). 'oleh' = 'bởi'. Tiếng Indonesia rất hay dùng câu bị động, nhiều hơn tiếng Việt — làm quen sớm. Cặp từ láy nhấn mạnh: sunyi senyap (im lặng hoàn toàn) — giống lối từ láy tiếng Việt.",
    tip_advice_en:
      "Tip for Vietnamese speakers: the passive uses 'di- + verb … oleh + agent' — 'Natal dirayakan oleh umat Kristen' (Christmas is celebrated by Christians). 'oleh' = 'by'. Indonesian leans on the passive far more than Vietnamese does — get comfortable with it early. Intensifying reduplicated pairs like 'sunyi senyap' (dead silent) echo Vietnamese 'từ láy'.",
    vocabulary: [
      {
        word: "Natal",
        en: "Christmas",
        vi: "lễ Giáng sinh",
        pos: "noun (proper)",
        pronunciation_vi: "NA-tal",
        pronunciation_en: "NA-tal",
      },
      {
        word: "Tahun Baru Imlek",
        en: "Chinese Lunar New Year",
        vi: "Tết Nguyên đán (người Hoa)",
        pos: "noun (proper)",
        pronunciation_vi: "TA-hun BA-ru IM-lék",
        pronunciation_en: "TA-hoon BA-roo IM-lek",
      },
      {
        word: "Nyepi",
        en: "Balinese Hindu Day of Silence",
        vi: "Ngày Tĩnh lặng (Hindu Bali)",
        pos: "noun (proper)",
        pronunciation_vi: "NYE-pi",
        pronunciation_en: "NYE-pee",
      },
      {
        word: "Waisak",
        en: "Vesak (Buddhist holy day)",
        vi: "lễ Phật Đản",
        pos: "noun (proper)",
        pronunciation_vi: "WAI-sak",
        pronunciation_en: "WHY-sak",
      },
      {
        word: "hari raya",
        en: "festival / feast day",
        vi: "ngày đại lễ",
        pos: "noun",
        pronunciation_vi: "HA-ri RA-ya",
        pronunciation_en: "HA-ree RA-ya",
      },
      {
        word: "hari libur",
        en: "holiday / day off",
        vi: "ngày nghỉ lễ",
        pos: "noun",
        pronunciation_vi: "HA-ri LI-bur",
        pronunciation_en: "HA-ree LEE-boor",
      },
      {
        word: "merayakan",
        en: "to celebrate",
        vi: "tổ chức / ăn mừng",
        pos: "verb",
        pronunciation_vi: "meu-ra-YA-kan",
        pronunciation_en: "me-ra-YA-kan",
      },
      {
        word: "memperingati",
        en: "to commemorate",
        vi: "tưởng niệm / kỷ niệm",
        pos: "verb",
        pronunciation_vi: "mem-peu-ring-A-ti",
        pronunciation_en: "mem-pe-ring-A-tee",
      },
      {
        word: "oleh",
        en: "by (passive agent)",
        vi: "bởi",
        pos: "preposition",
        pronunciation_vi: "Ô-léh",
        pronunciation_en: "OH-leh",
      },
    ],
    dialogue: [
      {
        speaker: "Turis",
        text: "Kenapa bandara Bali tutup hari ini?",
        vi: "Tại sao sân bay Bali đóng cửa hôm nay?",
        en: "Why is Bali's airport closed today?",
      },
      {
        speaker: "Pemandu",
        text: "Hari ini Nyepi, Hari Raya Hindu Bali. Seluruh pulau harus sunyi.",
        vi: "Hôm nay là Nyepi, đại lễ của Hindu Bali. Cả đảo phải im lặng.",
        en: "Today is Nyepi, the Balinese Hindu festival. The whole island must stay silent.",
      },
      {
        speaker: "Turis",
        text: "Menarik. Jadi semua agama punya hari libur nasional?",
        vi: "Thú vị. Vậy mọi tôn giáo đều có ngày nghỉ quốc gia?",
        en: "Fascinating. So every religion has a national holiday?",
      },
      {
        speaker: "Pemandu",
        text: "Betul. Natal, Imlek, Waisak — semuanya dirayakan bersama.",
        vi: "Đúng vậy. Giáng sinh, Tết người Hoa, Phật Đản — tất cả đều được mừng chung.",
        en: "Exactly. Christmas, Chinese New Year, Vesak — all celebrated together.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền tên ngày lễ / từ còn thiếu:",
        instruction_en: "Fill in the missing holiday word:",
        items: [
          {
            prompt: "___ dirayakan oleh umat Kristen di bulan Desember. (Giáng sinh)",
            answer: "Natal",
            options: ["Natal", "Nyepi", "Nasi"],
          },
          {
            prompt: "Saat ___, seluruh Bali sunyi senyap. (Ngày Tĩnh lặng)",
            answer: "Nyepi",
            options: ["Nyepi", "Natal", "Imlek"],
          },
          {
            prompt: "Semua hari raya ini adalah hari ___ nasional. (nghỉ lễ)",
            answer: "libur",
            options: ["libur", "lupa", "lewat"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối ngày lễ với tôn giáo / nghĩa tiếng Việt:",
        instruction_en: "Match each holiday with its religion / meaning:",
        items: [
          { prompt: "Imlek", answer: "Tết người Hoa" },
          { prompt: "Waisak", answer: "lễ Phật Đản" },
          { prompt: "Nyepi", answer: "Ngày Tĩnh lặng (Hindu Bali)" },
          { prompt: "Natal", answer: "lễ Giáng sinh" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Lễ Giáng sinh được tín đồ Công giáo tổ chức.", answer: "Natal dirayakan oleh umat Katolik." },
          { prompt: "Cả đảo Bali im lặng suốt một ngày.", answer: "Seluruh Bali sunyi senyap selama satu hari." },
          { prompt: "Tất cả những ngày lễ này là ngày nghỉ quốc gia.", answer: "Semua hari raya ini adalah hari libur nasional." },
        ],
      },
    ],
  },
];

export default religionTraditionsLessons;
