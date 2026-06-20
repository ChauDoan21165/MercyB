// Restaurant Kitchen Staff Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It follows the established Indonesian extra
// lesson format: Indonesian target text lives in `en`, Vietnamese glosses live in
// `vi`, and each Vietnamese-facing learning note has an English companion.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus -- same length + order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  /** Indonesian word/phrase. */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech, e.g. "noun", "verb", "phrase". */
  pos: string;
  /** Vietnamese pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  speaker: string;
  /** Indonesian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

// Loosely typed so per-type fields (translation, fill_blank, matching) can vary.
export type IndonesianExercise = Record<string, any>;

export type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: IndonesianLessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: IndonesianVocabEntry[];
  dialogue?: IndonesianDialogueLine[];
  exercises?: IndonesianExercise[];
  content?: string;
};

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_restaurant_kitchen_staff",
    level: "B1",
    category: "work_hospitality",
    title_vi: "Tiếng Indonesia cho nhân viên bếp nhà hàng",
    title_en: "Restaurant kitchen staff Indonesian",
    sentences: [
      {
        en: "Saya kerja di dapur restoran ini.",
        vi: "Tôi làm việc trong bếp nhà hàng này.",
        pronunciation_focus: [
          "kerja = làm việc; câu ngắn, tự nhiên hơn `bekerja di` trong giao tiếp hằng ngày.",
          "dapur restoran = bếp nhà hàng; `dapur` là bếp nấu, không phải `kitchen` dùng lẫn lộn.",
          "Luyện: `Saya kerja di dapur restoran ini.`",
        ],
        pronunciation_focus_en: [
          "kerja = to work; the short colloquial form sounds more natural than `bekerja di` in everyday speech.",
          "dapur restoran = restaurant kitchen; `dapur` is the cooking area, not a general kitchen label mixed loosely.",
          "Drill: `Saya kerja di dapur restoran ini.`",
        ],
      },
      {
        en: "Koki sudah datang, jadi kita mulai prep bahan.",
        vi: "Đầu bếp đã đến rồi, nên chúng ta bắt đầu sơ chế nguyên liệu.",
        pronunciation_focus: [
          "koki = đầu bếp; từ này rất tự nhiên trong nhà hàng.",
          "prep bahan = sơ chế nguyên liệu; `prep` là mượn từ tiếng Anh, nghe rất phổ biến trong bếp.",
          "Lỗi người Việt: nói dài `siapkan bahan-bahan`. Người trong bếp thường nói ngắn `prep bahan`.",
        ],
        pronunciation_focus_en: [
          "koki = cook/chef; very natural in restaurant work.",
          "prep bahan = prep ingredients; `prep` is an English loanword and very common in kitchens.",
          "VN-speaker trap: the longer `siapkan bahan-bahan`. Kitchen staff often shorten it to `prep bahan`.",
        ],
      },
      {
        en: "Pesanan masuk banyak sekali malam ini.",
        vi: "Đơn vào rất nhiều tối nay.",
        pronunciation_focus: [
          "pesanan masuk = đơn vào; cách nói rất quen trong bếp và kasir.",
          "banyak sekali = rất nhiều; nhấn mạnh áp lực kerja lúc đông khách.",
          "Luyện: `Pesanan masuk banyak sekali.`",
        ],
        pronunciation_focus_en: [
          "pesanan masuk = orders come in; a very common kitchen and cashier phrase.",
          "banyak sekali = very many; useful for emphasizing rush hour pressure.",
          "Drill: `Pesanan masuk banyak sekali.`",
        ],
      },
      {
        en: "Tolong cek stok bahan sebelum jam makan malam.",
        vi: "Làm ơn kiểm tra tồn nguyên liệu trước giờ ăn tối.",
        pronunciation_focus: [
          "tolong cek = làm ơn kiểm tra; ngắn, langsung, dan natural di tempat kerja.",
          "stok bahan = tồn nguyên liệu; `bahan` di sini bukan vật liệu, mà là nguyên liệu nấu ăn.",
          "Luyện: `Cek stok bahan.`",
        ],
        pronunciation_focus_en: [
          "tolong cek = please check; short, direct, and natural at work.",
          "stok bahan = ingredient stock; `bahan` here means cooking ingredients, not general material.",
          "Drill: `Cek stok bahan.`",
        ],
      },
      {
        en: "Area kerja harus tetap bersih dan rapi.",
        vi: "Khu vực làm việc phải luôn sạch và gọn.",
        pronunciation_focus: [
          "area kerja = khu vực làm việc; dùng rộng cho meja, counter, dan lantai.",
          "bersih dan rapi = sạch và ngăn nắp; cặp từ rất phổ biến trong instruksi kerja.",
          "Lỗi người Việt: chỉ nói `bersih` saja. Trong bếp, `rapi` cũng penting.",
        ],
        pronunciation_focus_en: [
          "area kerja = work area; it can include tables, counters, and floors.",
          "bersih dan rapi = clean and tidy; a very common workplace pair.",
          "VN-speaker trap: only saying `bersih`. In a kitchen, `rapi` also matters.",
        ],
      },
      {
        en: "Shift malam saya mulai jam delapan.",
        vi: "Ca đêm của tôi bắt đầu lúc tám giờ.",
        pronunciation_focus: [
          "shift malam = ca đêm; từ mượn rất umum di restoran.",
          "mulai jam delapan = bắt đầu lúc tám giờ; không cần thêm `pukul` kalau ngữ cảnh sudah jelas.",
          "Luyện: `Shift malam saya mulai jam delapan.`",
        ],
        pronunciation_focus_en: [
          "shift malam = night shift; a very common loanword in restaurants.",
          "mulai jam delapan = starts at eight o'clock; no need to add `pukul` if context is clear.",
          "Drill: `Shift malam saya mulai jam delapan.`",
        ],
      },
      {
        en: "Maaf, pelanggan komplain karena makanannya terlalu asin.",
        vi: "Xin lỗi, khách hàng phàn nàn vì món ăn quá mặn.",
        pronunciation_focus: [
          "pelanggan komplain = khách hàng phàn nàn; `komplain` sering dipakai langsung.",
          "terlalu asin = quá mặn; penting untuk laporan dapur dan kontrol rasa.",
          "Lỗi người Việt: dịch `asin` thành `mặn` đúng, tapi jangan quên ungkapan `terlalu asin`.",
        ],
        pronunciation_focus_en: [
          "pelanggan komplain = the customer complains; `komplain` is often used directly.",
          "terlalu asin = too salty; important for kitchen reports and taste control.",
          "VN-speaker trap: translating `asin` correctly as salty, but do not forget the phrase `terlalu asin`.",
        ],
      },
      {
        en: "Kalau stok habis, kasih tahu supervisor secepatnya.",
        vi: "Nếu hết nguyên liệu, hãy báo cho quản lý ngay lập tức.",
        pronunciation_focus: [
          "stok habis = hết hàng/hết nguyên liệu; ucapan sangat umum di dapur.",
          "kasih tahu = báo cho, nói cho biết; lebih santai daripada `memberi tahu`.",
          "Luyện: `Kalau stok habis, kasih tahu supervisor.`",
        ],
        pronunciation_focus_en: [
          "stok habis = out of stock / ingredients run out; very common kitchen speech.",
          "kasih tahu = tell/inform; more casual than `memberi tahu`.",
          "Drill: `Kalau stok habis, kasih tahu supervisor.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Di dapur restoran Indonesia, orang sering bicara singkat dan langsung: `prep bahan`, `pesanan masuk`, `stok habis`, `cepat`, `bersih`, `rapi`. Koki dan kru dapur biasanya memakai register kerja yang praktis, bukan kalimat panjang. Kalau ada komplain pelanggan, staf dapur biasanya fokus pada solusi cepat dan koordinasi dengan supervisor atau server, karena keterlambatan sedikit saja bisa memengaruhi pelayanan.",
    cultural_notes_en:
      "In Indonesian restaurant kitchens, people often speak in short and direct phrases: `prep bahan`, `pesanan masuk`, `stok habis`, `cepat`, `bersih`, `rapi`. Cooks and kitchen crews usually use a practical workplace register, not long sentences. If a customer complains, kitchen staff usually focus on quick solutions and coordination with the supervisor or server, because even small delays can affect service.",
    tip_advice_vi:
      "Mẹo cho người Việt: ở bếp, học theo cụm cố định chứ đừng ghép từng từ. Ví dụ: `pesanan masuk`, `stok bahan`, `prep bahan`, `shift malam`, `komplain pelanggan`. Dùng câu ngắn khi nói với tim: `cek dulu`, `kasih tahu supervisor`, `bantu plating`, `bersihkan area kerja`. Nghe gọn là đúng style bếp.",
    tip_advice_en:
      "Tip for Vietnamese speakers: in the kitchen, learn fixed chunks instead of word-by-word translation. For example: `pesanan masuk`, `stok bahan`, `prep bahan`, `shift malam`, `komplain pelanggan`. Use short sentences with the team: `cek dulu`, `kasih tahu supervisor`, `bantu plating`, `bersihkan area kerja`. Short and efficient is the kitchen style.",
    vocabulary: [
      {
        word: "dapur restoran",
        en: "restaurant kitchen",
        vi: "bếp nhà hàng",
        pos: "noun phrase",
        pronunciation_vi: "DA-pur res-to-RAN",
        pronunciation_en: "DAH-poor res-to-RAHN",
      },
      {
        word: "koki",
        en: "chef / cook",
        vi: "đầu bếp",
        pos: "noun",
        pronunciation_vi: "KO-ki",
        pronunciation_en: "KO-kee",
      },
      {
        word: "prep bahan",
        en: "prep ingredients",
        vi: "sơ chế nguyên liệu",
        pos: "phrase",
        pronunciation_vi: "prep BA-han",
        pronunciation_en: "prep BAH-hahn",
      },
      {
        word: "pesanan masuk",
        en: "incoming orders",
        vi: "đơn vào",
        pos: "noun phrase",
        pronunciation_vi: "pe-sa-NAN MA-suk",
        pronunciation_en: "pe-sah-NAHN MAH-sook",
      },
      {
        word: "stok bahan",
        en: "ingredient stock",
        vi: "tồn nguyên liệu",
        pos: "noun phrase",
        pronunciation_vi: "stok BA-han",
        pronunciation_en: "stok BAH-hahn",
      },
      {
        word: "shift malam",
        en: "night shift",
        vi: "ca đêm",
        pos: "noun phrase",
        pronunciation_vi: "SHIFT MA-lam",
        pronunciation_en: "SHIFT MAH-lahm",
      },
      {
        word: "komplain pelanggan",
        en: "customer complaint",
        vi: "phàn nàn của khách",
        pos: "noun phrase",
        pronunciation_vi: "kom-PLAIN pe-LANG-gan",
        pronunciation_en: "kom-PLINE pe-LAHNG-gahn",
      },
      {
        word: "bersih dan rapi",
        en: "clean and tidy",
        vi: "sạch và gọn gàng",
        pos: "phrase",
        pronunciation_vi: "BER-sih dan RA-pi",
        pronunciation_en: "BEHR-seeh dahn RAH-pee",
      },
    ],
    dialogue: [
      {
        speaker: "Supervisor",
        text: "Pesanan masuk banyak. Tolong cek stok bahan dulu.",
        vi: "Đơn vào nhiều lắm. Làm ơn kiểm tra tồn nguyên liệu trước.",
        en: "A lot of orders are coming in. Please check the ingredient stock first.",
      },
      {
        speaker: "Koki",
        text: "Siap. Saya juga mulai prep bahan untuk menu malam.",
        vi: "Rõ. Tôi cũng bắt đầu sơ chế nguyên liệu cho menu tối.",
        en: "Ready. I will also start prepping ingredients for the evening menu.",
      },
      {
        speaker: "Server",
        text: "Ada komplain pelanggan karena makanannya terlalu asin.",
        vi: "Có khách phàn nàn vì món ăn quá mặn.",
        en: "A customer complained because the food is too salty.",
      },
      {
        speaker: "Supervisor",
        text: "Baik, kasih tahu koki dan jangan lupa bersihkan area kerja.",
        vi: "Được, báo cho đầu bếp và đừng quên dọn sạch khu vực làm việc.",
        en: "Okay, tell the cook and do not forget to clean the work area.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Đơn vào rất nhiều tối nay.",
        answer: "Pesanan masuk banyak sekali malam ini.",
      },
      {
        type: "fill_blank",
        prompt: "Kalau stok habis, kasih tahu supervisor secepat____.",
        answer: "nya",
      },
      {
        type: "matching",
        prompt_vi: "Ghép từ với nghĩa đúng.",
        pairs: [
          ["prep bahan", "sơ chế nguyên liệu"],
          ["shift malam", "ca đêm"],
          ["komplain pelanggan", "phàn nàn của khách"],
        ],
      },
      {
        type: "roleplay",
        prompt_vi:
          "Bạn là supervisor bếp. Hãy nói rằng pesanan masuk banyak, minta cek stok bahan, và nhắc area kerja harus bersih dan rapi.",
        answer:
          "Pesanan masuk banyak sekali. Tolong cek stok bahan dulu. Area kerja harus tetap bersih dan rapi.",
      },
    ],
    content:
      "Lesson on Indonesian restaurant kitchen staff language: prep ingredients, incoming orders, cleanliness, night shifts, customer complaints, and stock checks in a practical workplace style.",
  },
];
