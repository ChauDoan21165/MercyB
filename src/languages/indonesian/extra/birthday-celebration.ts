// src/languages/indonesian/extra/birthday-celebration.ts
//
// Indonesian birthday celebration pack for Vietnamese learners.
// Covers: ulang tahun, kue, tiup lilin, surprise, kado, traktir, and potong
// tumpeng. Vietnamese-first with English companions, following the established
// Indonesian extra lesson shape.

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

export const birthdayCelebrationLessons: IndonesianLesson[] = [
  {
    id: "indonesian_birthday_basic_party",
    level: "A2",
    category: "celebrations",
    title_vi: "Sinh nhật — bánh, nến và quà",
    title_en: "Birthday — cake, candles and gifts",
    sentences: [
      {
        en: "Selamat ulang tahun! Semoga panjang umur dan sehat selalu.",
        vi: "Chúc mừng sinh nhật! Chúc bạn sống lâu và luôn khỏe mạnh.",
        pronunciation_focus: [
          "selamat ulang tahun → se-LA-mat U-lang TA-hun, lời chúc sinh nhật chuẩn",
          "semoga → se-MO-ga, 'mong rằng/chúc rằng'",
          "panjang umur → 'sống lâu'; sehat selalu = luôn khỏe",
        ],
        pronunciation_focus_en: [
          "selamat ulang tahun → 'se-LA-mat OO-lang TA-hoon' — standard birthday greeting",
          "semoga → 'se-MOH-ga' — may/hopefully",
          "panjang umur → 'long life'; sehat selalu = always healthy",
        ],
      },
      {
        en: "Kita beli kue ulang tahun dan lilin angka dua puluh.",
        vi: "Chúng ta mua bánh sinh nhật và nến số hai mươi.",
        pronunciation_focus: [
          "kue → KU-e, 'bánh'; đừng đọc như một âm 'kuê' quá nhanh",
          "lilin → LI-lin, 'nến'",
          "angka dua puluh → số 20; angka = chữ số/số",
        ],
        pronunciation_focus_en: [
          "kue → 'KOO-eh' — cake; keep two light vowel sounds",
          "lilin → 'LEE-lin' — candle",
          "angka dua puluh → number 20; angka = numeral/number",
        ],
      },
      {
        en: "Jangan lupa tiup lilin sebelum potong kue.",
        vi: "Đừng quên thổi nến trước khi cắt bánh.",
        pronunciation_focus: [
          "jangan lupa → 'đừng quên'",
          "tiup lilin → thổi nến; tiup = thổi",
          "sebelum potong kue → trước khi cắt bánh",
        ],
        pronunciation_focus_en: [
          "jangan lupa → 'don't forget'",
          "tiup lilin → blow out candles; tiup = blow",
          "sebelum potong kue → before cutting the cake",
        ],
      },
      {
        en: "Kami menyiapkan surprise kecil untuk Dina.",
        vi: "Chúng tôi chuẩn bị một bất ngờ nhỏ cho Dina.",
        pronunciation_focus: [
          "menyiapkan → me-NYI-ap-kan, 'chuẩn bị'; ny giống 'nh'",
          "surprise → se-PRAIS/sur-PRAIS, từ mượn rất phổ biến",
          "untuk Dina → cho Dina; untuk = cho/để",
        ],
        pronunciation_focus_en: [
          "menyiapkan → 'me-NYEE-ap-kan' — to prepare; ny like Spanish ñ",
          "surprise → 'se-PRISE/sur-PRISE', common loanword",
          "untuk Dina → for Dina; untuk = for/in order to",
        ],
      },
      {
        en: "Saya bawa kado, tapi belum sempat bungkus.",
        vi: "Tôi mang quà, nhưng chưa kịp gói.",
        pronunciation_focus: [
          "kado → KA-do, 'quà' sinh nhật/cưới",
          "belum sempat → 'chưa kịp'",
          "bungkus → BUNG-kus, 'gói/bọc'; cũng là 'mang về' khi mua đồ ăn",
        ],
        pronunciation_focus_en: [
          "kado → 'KA-do' — gift/present",
          "belum sempat → 'haven't had time yet'",
          "bungkus → 'BOONG-koos' — wrap; also takeaway for food",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, câu chúc phổ biến là 'Selamat ulang tahun' hoặc dạng hát 'Panjang umurnya'. Bánh sinh nhật ('kue ulang tahun'), thổi nến ('tiup lilin'), chụp ảnh, và tặng 'kado' rất quen thuộc ở thành phố. 'Surprise' cũng được dùng thẳng trong tiếng Indonesia, nhất là trong nhóm bạn trẻ. Khi gọi người lớn tuổi, thêm 'Pak/Bu/Kak' cho lịch sự; với bạn thân có thể dùng tên hoặc biệt danh.",
    cultural_notes_en:
      "In Indonesia, the common birthday greeting is 'Selamat ulang tahun', and people may sing 'Panjang umurnya'. Birthday cake ('kue ulang tahun'), blowing candles ('tiup lilin'), photos, and giving a 'kado' are common in cities. 'Surprise' is used directly in Indonesian, especially among younger friends. With older people, add 'Pak/Bu/Kak' politely; with close friends, a name or nickname is fine.",
    tip_advice_vi:
      "Mẹo cho người Việt: 'ulang tahun' nghĩa đen là 'lặp lại năm', nhưng dùng như 'sinh nhật'. 'Semoga + tính từ/cụm' là khung chúc rất mạnh: 'Semoga sehat selalu', 'Semoga sukses'. Phân biệt 'belum' = chưa và 'jangan' = đừng; cả hai thường gặp trong câu chuẩn bị tiệc.",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'ulang tahun' literally means 'repeat year', but it functions as 'birthday'. 'Semoga + phrase' is a strong wish pattern: 'Semoga sehat selalu', 'Semoga sukses'. Distinguish 'belum' = not yet from 'jangan' = don't; both appear often in party-prep sentences.",
    vocabulary: [
      {
        word: "ulang tahun",
        en: "birthday",
        vi: "sinh nhật",
        pos: "noun",
        pronunciation_vi: "U-lang TA-hun",
        pronunciation_en: "OO-lang TA-hoon",
      },
      {
        word: "kue",
        en: "cake",
        vi: "bánh",
        pos: "noun",
        pronunciation_vi: "KU-e",
        pronunciation_en: "KOO-eh",
      },
      {
        word: "lilin",
        en: "candle",
        vi: "nến",
        pos: "noun",
        pronunciation_vi: "LI-lin",
        pronunciation_en: "LEE-lin",
      },
      {
        word: "tiup",
        en: "to blow",
        vi: "thổi",
        pos: "verb",
        pronunciation_vi: "TI-up",
        pronunciation_en: "TEE-oop",
      },
      {
        word: "surprise",
        en: "surprise",
        vi: "bất ngờ",
        pos: "noun",
        pronunciation_vi: "se-PRAIS",
        pronunciation_en: "sur-PRISE",
      },
      {
        word: "kado",
        en: "gift / present",
        vi: "quà",
        pos: "noun",
        pronunciation_vi: "KA-do",
        pronunciation_en: "KA-do",
      },
      {
        word: "bungkus",
        en: "to wrap",
        vi: "gói / bọc",
        pos: "verb",
        pronunciation_vi: "BUNG-kus",
        pronunciation_en: "BOONG-koos",
      },
    ],
    dialogue: [
      {
        speaker: "Rina",
        text: "Besok ulang tahun Dina. Kita beli kue, ya?",
        vi: "Mai là sinh nhật Dina. Mình mua bánh nhé?",
        en: "Tomorrow is Dina's birthday. Let's buy a cake, okay?",
      },
      {
        speaker: "Budi",
        text: "Boleh. Jangan lupa lilin angka dua puluh.",
        vi: "Được. Đừng quên nến số hai mươi.",
        en: "Sure. Don't forget the number twenty candles.",
      },
      {
        speaker: "Rina",
        text: "Aku juga bawa kado kecil. Nanti kita bikin surprise.",
        vi: "Tớ cũng mang một món quà nhỏ. Lát nữa mình làm bất ngờ.",
        en: "I'll also bring a small gift. Later we'll make a surprise.",
      },
      {
        speaker: "Budi",
        text: "Setuju. Setelah tiup lilin, kita potong kue.",
        vi: "Đồng ý. Sau khi thổi nến, mình cắt bánh.",
        en: "Agreed. After blowing the candles, we'll cut the cake.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ sinh nhật còn thiếu:",
        instruction_en: "Fill in the missing birthday word:",
        items: [
          {
            prompt: "Selamat ___ tahun! (sinh nhật)",
            answer: "ulang",
            options: ["ulang", "uang", "undang"],
          },
          {
            prompt: "Jangan lupa tiup ___. (nến)",
            answer: "lilin",
            options: ["lilin", "lima", "listrik"],
          },
          {
            prompt: "Saya bawa ___ untuk Dina. (quà)",
            answer: "kado",
            options: ["kado", "kartu", "kabar"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "kue", answer: "bánh" },
          { prompt: "tiup", answer: "thổi" },
          { prompt: "surprise", answer: "bất ngờ" },
          { prompt: "bungkus", answer: "gói" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Chúc mừng sinh nhật!", answer: "Selamat ulang tahun!" },
          { prompt: "Đừng quên thổi nến.", answer: "Jangan lupa tiup lilin." },
          { prompt: "Tôi mang quà, nhưng chưa kịp gói.", answer: "Saya bawa kado, tapi belum sempat bungkus." },
        ],
      },
    ],
  },
  {
    id: "indonesian_birthday_traktir_tumpeng",
    level: "B1",
    category: "celebrations",
    title_vi: "Đãi sinh nhật — traktir và potong tumpeng",
    title_en: "Birthday treat — traktir and cutting tumpeng",
    sentences: [
      {
        en: "Hari ini siapa yang traktir makan siang?",
        vi: "Hôm nay ai đãi ăn trưa?",
        pronunciation_focus: [
          "siapa yang → 'ai là người...'",
          "traktir → TRAK-tir, 'đãi/khao' bạn bè",
          "makan siang → bữa trưa/ăn trưa",
        ],
        pronunciation_focus_en: [
          "siapa yang → 'who is the one who...'",
          "traktir → 'TRAK-teer' — treat/pay for friends",
          "makan siang → lunch/to eat lunch",
        ],
      },
      {
        en: "Biasanya yang ulang tahun traktir teman-teman dekat.",
        vi: "Thường thì người có sinh nhật đãi bạn thân.",
        pronunciation_focus: [
          "biasanya → bi-A-sa-nya, 'thường thì'",
          "yang ulang tahun → người có sinh nhật",
          "teman-teman dekat → các bạn thân; lặp từ = số nhiều",
        ],
        pronunciation_focus_en: [
          "biasanya → 'bee-A-sa-nya' — usually",
          "yang ulang tahun → the birthday person",
          "teman-teman dekat → close friends; reduplication marks plural",
        ],
      },
      {
        en: "Di kantor, kami patungan untuk beli kue dan kado.",
        vi: "Ở văn phòng, chúng tôi góp tiền mua bánh và quà.",
        pronunciation_focus: [
          "di kantor → ở văn phòng; di = ở",
          "patungan → pa-TUNG-an, 'góp tiền chung'",
          "untuk beli → để mua; nói thường rút gọn từ 'membeli'",
        ],
        pronunciation_focus_en: [
          "di kantor → at the office; di = at/in",
          "patungan → 'pa-TOONG-an' — chip in together",
          "untuk beli → to buy; casual shortening from 'membeli'",
        ],
      },
      {
        en: "Keluarga kami merayakan ulang tahun dengan potong tumpeng.",
        vi: "Gia đình chúng tôi mừng sinh nhật bằng lễ cắt tumpeng.",
        pronunciation_focus: [
          "merayakan → me-RA-ya-kan, 'tổ chức/mừng'",
          "dengan → DE-ngan, 'bằng/với'",
          "potong tumpeng → cắt tháp cơm vàng hình nón trong dịp lễ",
        ],
        pronunciation_focus_en: [
          "merayakan → 'me-RA-ya-kan' — celebrate",
          "dengan → 'DE-ngan' — with/by means of",
          "potong tumpeng → cutting a cone-shaped festive rice dish",
        ],
      },
      {
        en: "Potongan pertama diberikan kepada orang yang dihormati.",
        vi: "Miếng cắt đầu tiên được trao cho người được kính trọng.",
        pronunciation_focus: [
          "potongan pertama → miếng/phần cắt đầu tiên",
          "diberikan → 'được trao' (bị động di- từ beri)",
          "dihormati → 'được kính trọng' (di- + hormat + -i)",
        ],
        pronunciation_focus_en: [
          "potongan pertama → the first slice/portion",
          "diberikan → 'is given' (passive di- from beri)",
          "dihormati → 'respected/honored' (di- + hormat + -i)",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, sinh nhật có hai kiểu rất hay gặp. Với bạn bè, người có sinh nhật thường bị trêu là phải 'traktir' (đãi/khao) cà phê, cơm trưa, hoặc đồ ăn vặt. Ở văn phòng, đồng nghiệp có thể 'patungan' để mua bánh và quà. Trong gia đình hoặc dịp trang trọng, có thể có 'tumpeng' - cơm vàng hình nón với món ăn xung quanh. Nghi thức 'potong tumpeng' không chỉ dành cho sinh nhật mà còn cho khai trương, tạ ơn, và sự kiện quan trọng.",
    cultural_notes_en:
      "In Indonesia, birthdays often appear in two styles. Among friends, the birthday person is often teased into 'traktir' - treating others to coffee, lunch, or snacks. At the office, coworkers may 'patungan' to chip in for cake and a gift. In families or more formal events, there may be 'tumpeng' - cone-shaped yellow rice surrounded by side dishes. 'Potong tumpeng' is used not only for birthdays but also openings, thanksgiving events, and important milestones.",
    tip_advice_vi:
      "Mẹo cho người Việt: 'traktir' khác 'bayar'. 'Bayar' chỉ là trả tiền; 'traktir' là trả tiền để đãi/khao người khác. 'Patungan' rất hữu ích khi nói góp tiền chung. Trong câu bị động trang trọng, chú ý di-: 'diberikan' = được trao, 'dihormati' = được kính trọng.",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'traktir' is different from 'bayar'. 'Bayar' simply means pay; 'traktir' means pay as a treat for others. 'Patungan' is useful for chipping in together. In formal passive sentences, watch di-: 'diberikan' = is given, 'dihormati' = is respected.",
    vocabulary: [
      {
        word: "traktir",
        en: "to treat / pay for others",
        vi: "đãi / khao",
        pos: "verb",
        pronunciation_vi: "TRAK-tir",
        pronunciation_en: "TRAK-teer",
      },
      {
        word: "patungan",
        en: "to chip in together",
        vi: "góp tiền chung",
        pos: "verb / noun",
        pronunciation_vi: "pa-TUNG-an",
        pronunciation_en: "pa-TOONG-an",
      },
      {
        word: "merayakan",
        en: "to celebrate",
        vi: "mừng / tổ chức",
        pos: "verb",
        pronunciation_vi: "me-RA-ya-kan",
        pronunciation_en: "me-RA-ya-kan",
      },
      {
        word: "tumpeng",
        en: "cone-shaped ceremonial rice dish",
        vi: "cơm tumpeng hình nón",
        pos: "noun",
        pronunciation_vi: "TUM-peng",
        pronunciation_en: "TOOM-peng",
      },
      {
        word: "potong tumpeng",
        en: "to cut ceremonial tumpeng",
        vi: "cắt tumpeng trong nghi lễ",
        pos: "verb phrase",
        pronunciation_vi: "PO-tong TUM-peng",
        pronunciation_en: "POH-tong TOOM-peng",
      },
      {
        word: "potongan pertama",
        en: "first slice / first portion",
        vi: "miếng/phần đầu tiên",
        pos: "noun phrase",
        pronunciation_vi: "po-TONG-an per-TA-ma",
        pronunciation_en: "po-TONG-an per-TA-ma",
      },
      {
        word: "dihormati",
        en: "respected / honored",
        vi: "được kính trọng",
        pos: "passive verb",
        pronunciation_vi: "di-hor-MA-ti",
        pronunciation_en: "dee-hor-MA-tee",
      },
    ],
    dialogue: [
      {
        speaker: "Andi",
        text: "Selamat ulang tahun, Sari! Hari ini traktir, dong?",
        vi: "Chúc mừng sinh nhật, Sari! Hôm nay đãi đi chứ?",
        en: "Happy birthday, Sari! Treat us today, will you?",
      },
      {
        speaker: "Sari",
        text: "Boleh, nanti aku traktir makan siang sederhana.",
        vi: "Được, lát nữa tớ đãi bữa trưa đơn giản.",
        en: "Sure, later I'll treat everyone to a simple lunch.",
      },
      {
        speaker: "Andi",
        text: "Teman-teman kantor sudah patungan beli kue dan kado.",
        vi: "Các bạn ở văn phòng đã góp tiền mua bánh và quà.",
        en: "The office friends already chipped in for cake and a gift.",
      },
      {
        speaker: "Sari",
        text: "Wah, terima kasih! Malam ini keluarga juga potong tumpeng.",
        vi: "Ôi, cảm ơn! Tối nay gia đình tớ cũng cắt tumpeng.",
        en: "Wow, thank you! Tonight my family is also cutting tumpeng.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ văn hóa sinh nhật còn thiếu:",
        instruction_en: "Fill in the missing birthday-culture word:",
        items: [
          {
            prompt: "Hari ini siapa yang ___ makan siang? (đãi)",
            answer: "traktir",
            options: ["traktir", "tukar", "tinggal"],
          },
          {
            prompt: "Di kantor, kami ___ untuk beli kue. (góp tiền)",
            answer: "patungan",
            options: ["patungan", "pulang", "panggilan"],
          },
          {
            prompt: "Keluarga kami potong ___. (cơm lễ hình nón)",
            answer: "tumpeng",
            options: ["tumpeng", "tambah", "taman"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "traktir", answer: "đãi / khao" },
          { prompt: "patungan", answer: "góp tiền chung" },
          { prompt: "merayakan", answer: "mừng / tổ chức" },
          { prompt: "potongan pertama", answer: "phần đầu tiên" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Hôm nay ai đãi ăn trưa?", answer: "Hari ini siapa yang traktir makan siang?" },
          { prompt: "Chúng tôi góp tiền mua bánh và quà.", answer: "Kami patungan untuk beli kue dan kado." },
          { prompt: "Gia đình tôi mừng sinh nhật bằng cắt tumpeng.", answer: "Keluarga saya merayakan ulang tahun dengan potong tumpeng." },
        ],
      },
    ],
  },
];
