// Marketplace Live Selling Indonesian (Vietnamese -> Indonesian study track).
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

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
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
    id: "indonesian_marketplace_live_selling",
    level: "B1",
    category: "business",
    title_vi: "Bán hàng livestream trên marketplace",
    title_en: "Marketplace live selling",
    sentences: [
      {
        en: "Halo, teman-teman. Selamat datang di live kami.",
        vi: "Xin chào mọi người. Chào mừng đến với livestream của chúng tôi.",
        pronunciation_focus: [
          "`teman-teman` = mọi người; trong live selling rất tự nhiên và thân thiện.",
          "Lỗi người Việt: nói `selamat datang di live saya` khi đang làm team. Kalau host lebih dari satu, pakai `kami`.",
          "Luyện: `Selamat datang di live kami.`",
        ],
        pronunciation_focus_en: [
          "`teman-teman` = everyone; very natural and friendly in live selling.",
          "VN-speaker trap: saying `selamat datang di live saya` when speaking as a team. If there are multiple hosts, use `kami`.",
          "Drill: `Selamat datang di live kami.`",
        ],
      },
      {
        en: "Saya host-nya, dan hari ini kita ada promo spesial.",
        vi: "Tôi là host, và hôm nay chúng ta có khuyến mãi đặc biệt.",
        pronunciation_focus: [
          "`host-nya` = người dẫn live; sering dipakai langsung như tiếng Anh.",
          "`kita` di sini masuk cả người nói lẫn penonton, cocok untuk bikin suasana ramai.",
          "Luyện: `Hari ini kita ada promo spesial.`",
        ],
        pronunciation_focus_en: [
          "`host-nya` = the live host; the English word is used directly.",
          "`kita` here includes speaker and audience, good for creating a shared atmosphere.",
          "Drill: `Hari ini kita ada promo spesial.`",
        ],
      },
      {
        en: "Silakan cek keranjang kuning untuk produk yang sedang dibahas.",
        vi: "Mời xem giỏ màu vàng cho những sản phẩm đang được nhắc tới.",
        pronunciation_focus: [
          "`keranjang kuning` = giỏ vàng trên live shopping; istilah platform yang sangat populer.",
          "Lỗi người Việt: dịch literal `giỏ vàng` tanpa konteks. Di Indonesia, orang memang ngomong `keranjang kuning`.",
          "Luyện: `Cek keranjang kuning.`",
        ],
        pronunciation_focus_en: [
          "`keranjang kuning` = the yellow cart in live shopping; a very common platform term.",
          "VN-speaker trap: translating it literally as just `yellow basket` without context. Indonesians really say `keranjang kuning`.",
          "Drill: `Cek keranjang kuning.`",
        ],
      },
      {
        en: "Stoknya terbatas, jadi kalau mau, langsung checkout saja.",
        vi: "Số lượng có hạn, nên nếu muốn thì chốt đơn ngay.",
        pronunciation_focus: [
          "`stoknya terbatas` = số lượng có hạn; `terbatas` = giới hạn.",
          "`langsung checkout` sering dipakai dalam live selling, artinya chốt đơn ngay di aplikasi.",
          "Luyện: `Langsung checkout saja.`",
        ],
        pronunciation_focus_en: [
          "`stoknya terbatas` = stock is limited; `terbatas` = limited.",
          "`langsung checkout` is very common in live selling, meaning to check out immediately in the app.",
          "Drill: `Langsung checkout saja.`",
        ],
      },
      {
        en: "Kalau ada komentar penonton, saya akan jawab satu per satu.",
        vi: "Nếu có bình luận của khán giả, tôi sẽ trả lời từng cái một.",
        pronunciation_focus: [
          "`komentar penonton` = bình luận của người xem; `penonton` = khán giả/khách xem live.",
          "Mẹo: `satu per satu` rất tự nhiên khi host muốn giữ live tertib dan ramah.",
          "Luyện: `Saya akan jawab satu per satu.`",
        ],
        pronunciation_focus_en: [
          "`komentar penonton` = viewers' comments; `penonton` = audience/viewers.",
          "Tip: `satu per satu` is very natural when a host wants to keep the live organized and friendly.",
          "Drill: `Saya akan jawab satu per satu.`",
        ],
      },
      {
        en: "Produk ini bisa masuk gratis ongkir kalau checkout sekarang.",
        vi: "Sản phẩm này có thể được miễn phí ship nếu chốt đơn ngay bây giờ.",
        pronunciation_focus: [
          "`gratis ongkir` = miễn phí vận chuyển; cụm cực quen trong marketplace Indonesia.",
          "Lỗi người Việt: nói `free shipping` terus-menerus. Người Indonesia vẫn hiểu, nhưng `gratis ongkir` nghe tự nhiên hơn.",
          "Luyện: `Masuk gratis ongkir.`",
        ],
        pronunciation_focus_en: [
          "`gratis ongkir` = free shipping; a very familiar phrase in Indonesian marketplaces.",
          "VN-speaker trap: constantly using `free shipping`. Indonesians understand it, but `gratis ongkir` sounds more natural.",
          "Drill: `Masuk gratis ongkir.`",
        ],
      },
      {
        en: "Saya ulang, promo ini hanya berlaku hari ini.",
        vi: "Tôi nhắc lại, khuyến mãi này chỉ áp dụng hôm nay.",
        pronunciation_focus: [
          "`Saya ulang` = tôi nhắc lại; host live rất sering dùng để mengulangi info penting.",
          "`berlaku hari ini` = có hiệu lực hôm nay; cocok untuk promo limit waktu.",
          "Luyện: `Promo ini hanya berlaku hari ini.`",
        ],
        pronunciation_focus_en: [
          "`Saya ulang` = I repeat; live hosts use this often to repeat key info.",
          "`berlaku hari ini` = valid today; good for time-limited promotions.",
          "Drill: `Promo ini hanya berlaku hari ini.`",
        ],
      },
      {
        en: "Kalau ingin warna lain, tulis di komentar ya.",
        vi: "Nếu muốn màu khác, hãy viết ở phần bình luận nhé.",
        pronunciation_focus: [
          "`tulis di komentar` = viết ở bình luận; câu này rất live-selling style.",
          "`ya` ở cuối làm câu nghe mềm và thân thiện, không quá mệnh lệnh.",
          "Luyện: `Tulis di komentar ya.`",
        ],
        pronunciation_focus_en: [
          "`tulis di komentar` = write it in the comments; very live-selling style.",
          "`ya` at the end softens the sentence and makes it friendly, not bossy.",
          "Drill: `Tulis di komentar ya.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Live selling di Indonesia sering dilakukan di TikTok Shop, Shopee Live, atau marketplace lain yang punya fitur live. Host biasanya bicara cepat, ramah, dan berulang-ulang menyebut promo, stok terbatas, keranjang kuning, serta gratis ongkir. Penonton sering menulis komentar singkat seperti `size ada?`, `warna lain?`, atau `COD bisa?`. Dalam konteks ini, bahasa santai sangat wajar, tetapi tetap sopan supaya penonton merasa diajak bicara.",
    cultural_notes_en:
      "Live selling in Indonesia is often done on TikTok Shop, Shopee Live, or other marketplaces with live features. Hosts usually speak quickly, warmly, and repeatedly mention promotions, limited stock, the yellow cart, and free shipping. Viewers often write short comments like `size ada?`, `warna lain?`, or `COD bisa?`. In this context, casual language is normal, but it should still remain polite so viewers feel included.",
    tip_advice_vi:
      "Mẹo cho người Việt: trong live selling, hãy học các cụm nguyên khối như `keranjang kuning`, `stok terbatas`, `checkout sekarang`, `gratis ongkir`, `komentar penonton`, và `promo spesial`. Host nên dùng `kami` nếu là đội, còn `kita` khi muốn kéo người xem vào không khí chung. Câu ngắn, lặp lại, và có nhịp sẽ nghe tự nhiên hơn câu dài giải thích quá nhiều.",
    tip_advice_en:
      "Tip for Vietnamese speakers: in live selling, learn chunks like `keranjang kuning`, `stok terbatas`, `checkout sekarang`, `gratis ongkir`, `komentar penonton`, and `promo spesial`. The host should use `kami` if speaking for a team, and `kita` when inviting viewers into the shared atmosphere. Short, repeated, rhythmic sentences sound more natural than long explanations.",
    vocabulary: [
      {
        word: "host",
        en: "live host",
        vi: "người dẫn live",
        pos: "noun",
        pronunciation_vi: "host",
        pronunciation_en: "HOST",
      },
      {
        word: "promo",
        en: "promotion",
        vi: "khuyến mãi",
        pos: "noun",
        pronunciation_vi: "PRO-mo",
        pronunciation_en: "PRO-mo",
      },
      {
        word: "keranjang kuning",
        en: "yellow cart",
        vi: "giỏ vàng",
        pos: "noun phrase",
        pronunciation_vi: "ke-ran-JANG KU-ning",
        pronunciation_en: "keh-rahn-JAHNG KOO-ning",
      },
      {
        word: "stok terbatas",
        en: "limited stock",
        vi: "hàng có hạn",
        pos: "noun phrase",
        pronunciation_vi: "stok ter-BA-tas",
        pronunciation_en: "stok ter-BAH-tahs",
      },
      {
        word: "komentar penonton",
        en: "viewer comments",
        vi: "bình luận của khán giả",
        pos: "noun phrase",
        pronunciation_vi: "ko-men-TAR pe-NON-ton",
        pronunciation_en: "ko-men-TAR pe-NON-ton",
      },
      {
        word: "checkout",
        en: "checkout / place order",
        vi: "chốt đơn",
        pos: "verb / noun",
        pronunciation_vi: "CHEK-aut",
        pronunciation_en: "CHEK-out",
      },
      {
        word: "gratis ongkir",
        en: "free shipping",
        vi: "miễn phí ship",
        pos: "noun phrase",
        pronunciation_vi: "GRA-tis ONG-kir",
        pronunciation_en: "GRAH-tees ONG-keer",
      },
      {
        word: "penonton",
        en: "audience / viewers",
        vi: "khán giả / người xem",
        pos: "noun",
        pronunciation_vi: "pe-NON-ton",
        pronunciation_en: "pe-NON-ton",
      },
    ],
    dialogue: [
      {
        speaker: "Host",
        text: "Halo, teman-teman. Selamat datang di live kami.",
        vi: "Xin chào mọi người. Chào mừng đến với livestream của chúng tôi.",
        en: "Hello everyone. Welcome to our live.",
      },
      {
        speaker: "Penonton",
        text: "Kak, stok warna hitam masih ada?",
        vi: "Bạn ơi, còn hàng màu đen không?",
        en: "Is the black color still in stock?",
      },
      {
        speaker: "Host",
        text: "Masih ada, Kak. Silakan cek keranjang kuning untuk checkout.",
        vi: "Vẫn còn nha bạn. Mời xem giỏ vàng để chốt đơn.",
        en: "Yes, still available. Please check the yellow cart to checkout.",
      },
      {
        speaker: "Penonton",
        text: "Kalau checkout sekarang, dapat gratis ongkir tidak?",
        vi: "Nếu chốt đơn ngay bây giờ thì có được miễn phí ship không?",
        en: "If I check out now, do I get free shipping?",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Khuyến mãi này chỉ áp dụng hôm nay.",
        answer: "Promo ini hanya berlaku hari ini.",
      },
      {
        type: "fill_blank",
        prompt: "Silakan cek keranjang ____ untuk produk yang sedang dibahas.",
        answer: "kuning",
      },
      {
        type: "matching",
        prompt_vi: "Ghép từ với nghĩa đúng.",
        pairs: [
          ["host", "người dẫn live"],
          ["stok terbatas", "hàng có hạn"],
          ["gratis ongkir", "miễn phí ship"],
        ],
      },
      {
        type: "roleplay",
        prompt_vi:
          "Bạn là host live selling. Hãy chào người xem, nói có promo spesial, nhắc cek keranjang kuning, và nói rằng stok terbatas.",
        answer:
          "Halo, teman-teman. Selamat datang di live kami. Hari ini kita ada promo spesial. Silakan cek keranjang kuning. Stoknya terbatas, jadi langsung checkout saja.",
      },
    ],
    content:
      "Lesson on Indonesian marketplace live selling: welcoming viewers, using promo language, mentioning the yellow cart, limited stock, comments, checkout, and free shipping naturally.",
  },
];
