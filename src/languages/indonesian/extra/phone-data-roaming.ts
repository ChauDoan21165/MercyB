// Phone Data & Roaming Indonesian (Vietnamese -> Indonesian study track).
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
    id: "indonesian_phone_data_roaming",
    level: "B1",
    category: "travel",
    title_vi: "Dữ liệu điện thoại và chuyển vùng",
    title_en: "Phone data and roaming",
    sentences: [
      {
        en: "Apakah paket roaming saya aktif di Indonesia?",
        vi: "Gói chuyển vùng của tôi có hoạt động ở Indonesia không?",
        pronunciation_focus: [
          "A-pa-kah PA-ket ROA-ming SA-ya AK-tif di In-do-NE-si-a -- `paket roaming` = gói chuyển vùng; `aktif` = đang hoạt động.",
          "Mẹo: `apakah` mở câu hỏi lịch sự hơn `apa` trong cửa hàng hoặc tổng đài.",
          "Luyện: `Apakah paket roaming saya aktif?`",
        ],
        pronunciation_focus_en: [
          "A-pa-kah PA-ket ROA-ming SA-ya AK-tif di In-do-NE-si-a -- `paket roaming` = roaming package; `aktif` = active.",
          "Tip: `apakah` opens a more polite question than plain `apa` at a shop or call center.",
          "Drill: `Apakah paket roaming saya aktif?`",
        ],
      },
      {
        en: "Saya mau beli kartu SIM lokal untuk paket data.",
        vi: "Tôi muốn mua thẻ SIM địa phương để dùng gói dữ liệu.",
        pronunciation_focus: [
          "SA-ya mau BE-li KAR-tu SIM lo-KAL UN-tuk PA-ket DA-ta -- `kartu SIM lokal` = SIM địa phương; `paket data` = gói dữ liệu.",
          "Lỗi người Việt: nói `internet card`. Ở Indonesia nói `kartu SIM` hoặc `paket data`.",
          "Luyện: `Saya mau beli kartu SIM lokal.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau BE-li KAR-tu SIM lo-KAL OON-tuk PA-ket DA-ta -- `kartu SIM lokal` = local SIM card; `paket data` = data package.",
          "VN-speaker trap: saying `internet card`. In Indonesian, use `kartu SIM` or `paket data`.",
          "Drill: `Saya mau beli kartu SIM lokal.`",
        ],
      },
      {
        en: "Kuota internet saya sudah habis, bisa isi ulang sekarang?",
        vi: "Dung lượng internet của tôi đã hết, có thể nạp thêm bây giờ không?",
        pronunciation_focus: [
          "KU-o-ta IN-ter-net SA-ya SU-dah HA-bis -- `kuota habis` = hết dung lượng; `isi ulang` = nạp lại.",
          "`sudah habis` nhấn mạnh trạng thái đã hết rồi, rất tự nhiên khi nói với nhân viên quầy.",
          "Luyện: `Kuota saya sudah habis.`",
        ],
        pronunciation_focus_en: [
          "KOO-o-ta IN-ter-net SA-ya SOO-dah HA-bis -- `kuota habis` = data quota is used up; `isi ulang` = top up.",
          "`Sudah habis` emphasizes that it is already used up, natural at a counter.",
          "Drill: `Kuota saya sudah habis.`",
        ],
      },
      {
        en: "Sinyal di kamar saya lemah, tapi di lobi lebih kuat.",
        vi: "Tín hiệu trong phòng tôi yếu, nhưng ở sảnh thì mạnh hơn.",
        pronunciation_focus: [
          "SI-nyal di KA-mar SA-ya LE-mah, TA-pi di LO-bi LE-bih KU-at -- `sinyal lemah` = sóng yếu; `lebih kuat` = mạnh hơn.",
          "Lỗi người Việt: dịch 'mạng yếu' thành `internet lemah` mọi lúc. Với vạch sóng, dùng `sinyal lemah`.",
          "Luyện: `Sinyal di sini lemah.`",
        ],
        pronunciation_focus_en: [
          "SI-nyal di KA-mar SA-ya LE-mah, TA-pi di LO-bi LE-bih KOO-at -- `sinyal lemah` = weak signal; `lebih kuat` = stronger.",
          "VN-speaker trap: translating 'weak network' as `internet lemah` every time. For bars/reception, use `sinyal lemah`.",
          "Drill: `Sinyal di sini lemah.`",
        ],
      },
      {
        en: "Boleh saya pakai hotspot sebentar untuk pesan taksi online?",
        vi: "Tôi có thể dùng hotspot một lát để đặt taxi công nghệ không?",
        pronunciation_focus: [
          "BO-leh SA-ya PA-kai HOT-spot se-ben-TAR UN-tuk PE-san TAK-si on-LINE -- `sebentar` = một lát; `pesan` = đặt/gọi dịch vụ.",
          "Mẹo: `boleh saya...` là cách xin phép mềm và lịch sự, hợp khi nhờ người lạ.",
          "Luyện: `Boleh saya pakai hotspot sebentar?`",
        ],
        pronunciation_focus_en: [
          "BO-leh SA-ya PA-kai HOT-spot se-ben-TAR OON-tuk PE-san TAK-si on-LINE -- `sebentar` = for a moment; `pesan` = order/book.",
          "Tip: `boleh saya...` is a soft, polite permission phrase, useful with strangers.",
          "Drill: `Boleh saya pakai hotspot sebentar?`",
        ],
      },
      {
        en: "Untuk registrasi nomor, apakah perlu paspor atau KTP?",
        vi: "Để đăng ký số điện thoại, có cần hộ chiếu hay KTP không?",
        pronunciation_focus: [
          "UN-tuk re-gis-TRA-si NO-mor, A-pa-kah per-LU PAS-por A-tau KTP -- `registrasi nomor` = đăng ký số; `perlu` = cần.",
          "Mẹo văn hóa: người nước ngoài thường hỏi về `paspor`; người Indonesia dùng `KTP` cho đăng ký danh tính.",
          "Luyện: `Apakah perlu paspor untuk registrasi nomor?`",
        ],
        pronunciation_focus_en: [
          "OON-tuk re-gis-TRA-si NO-mor, A-pa-kah per-LOO PAS-por A-tau KTP -- `registrasi nomor` = number registration; `perlu` = need.",
          "Culture tip: foreigners often ask about `paspor`; Indonesians use `KTP` for identity registration.",
          "Drill: `Apakah perlu paspor untuk registrasi nomor?`",
        ],
      },
      {
        en: "Saya belum bisa menerima SMS kode verifikasi.",
        vi: "Tôi vẫn chưa nhận được SMS mã xác minh.",
        pronunciation_focus: [
          "SA-ya be-LUM BI-sa me-ne-RI-ma SMS KO-de ve-ri-fi-KA-si -- `belum bisa` = vẫn chưa thể; `kode verifikasi` = mã xác minh.",
          "`belum` khác `tidak`: `belum` nghĩa là chưa, có thể sẽ được sau.",
          "Luyện: `Saya belum bisa menerima SMS.`",
        ],
        pronunciation_focus_en: [
          "SA-ya be-LOOM BEE-sa me-ne-REE-ma SMS KO-de ve-ri-fi-KA-si -- `belum bisa` = still cannot yet; `kode verifikasi` = verification code.",
          "`Belum` differs from `tidak`: it means not yet, possibly later.",
          "Drill: `Saya belum bisa menerima SMS.`",
        ],
      },
      {
        en: "Kalau pulsa saya habis, apakah ada pulsa darurat?",
        vi: "Nếu tiền điện thoại của tôi hết, có ứng tiền khẩn cấp không?",
        pronunciation_focus: [
          "KA-lau PUL-sa SA-ya HA-bis, A-pa-kah A-da PUL-sa da-RU-rat -- `pulsa` = tiền/tín dụng điện thoại; `pulsa darurat` = ứng tiền khẩn cấp.",
          "Lỗi người Việt: dùng `uang telepon` nghe lạ. Từ tự nhiên là `pulsa`.",
          "Luyện: `Apakah ada pulsa darurat?`",
        ],
        pronunciation_focus_en: [
          "KA-lau POOL-sa SA-ya HA-bis, A-pa-kah A-da POOL-sa da-ROO-rat -- `pulsa` = phone credit; `pulsa darurat` = emergency credit.",
          "VN-speaker trap: saying `uang telepon`, which sounds odd. The natural word is `pulsa`.",
          "Drill: `Apakah ada pulsa darurat?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, khách du lịch thường chọn giữa bật roaming từ nhà mạng cũ hoặc mua kartu SIM lokal. SIM địa phương có thể cần registrasi nomor bằng hộ chiếu hoặc KTP, tùy quầy và nhà mạng. Người bán thường hỏi bạn cần paket data bao nhiêu GB, thời hạn bao lâu, và có cần pulsa để gọi/SMS không. Ở vùng nông thôn, trong khách sạn, hoặc trên đảo nhỏ, `sinyal` có thể yếu dù paket data còn nhiều.",
    cultural_notes_en:
      "In Indonesia, visitors often choose between enabling roaming from their home carrier or buying a local SIM card. A local SIM may require number registration with a passport or KTP, depending on the counter and provider. Sellers usually ask how many GB of data you need, how long the package should last, and whether you also need phone credit for calls/SMS. In rural areas, hotels, or small islands, the signal may be weak even when you still have data quota.",
    tip_advice_vi:
      "Mẹo cho người Việt: tách ba ý `sinyal` (sóng), `kuota` (dung lượng), và `pulsa` (tiền điện thoại). Khi gặp lỗi, nói cụ thể: `sinyal lemah`, `kuota habis`, `tidak bisa menerima SMS`, hoặc `paket roaming belum aktif`. Dùng `boleh saya...` khi xin nhờ hotspot hoặc hỏi nhân viên hỗ trợ.",
    tip_advice_en:
      "Tip for Vietnamese speakers: separate three ideas: `sinyal` (signal), `kuota` (data allowance), and `pulsa` (phone credit). When something fails, be specific: `sinyal lemah`, `kuota habis`, `tidak bisa menerima SMS`, or `paket roaming belum aktif`. Use `boleh saya...` when asking to use a hotspot or requesting help from staff.",
    vocabulary: [
      {
        word: "roaming",
        en: "roaming",
        vi: "chuyển vùng",
        pos: "noun",
        pronunciation_vi: "ROA-ming",
        pronunciation_en: "ROA-ming",
      },
      {
        word: "kartu SIM lokal",
        en: "local SIM card",
        vi: "thẻ SIM địa phương",
        pos: "noun phrase",
        pronunciation_vi: "KAR-tu SIM lo-KAL",
        pronunciation_en: "KAR-too SIM lo-KAL",
      },
      {
        word: "paket data",
        en: "data package",
        vi: "gói dữ liệu",
        pos: "noun phrase",
        pronunciation_vi: "PA-ket DA-ta",
        pronunciation_en: "PA-ket DA-ta",
      },
      {
        word: "sinyal",
        en: "signal",
        vi: "tín hiệu / sóng điện thoại",
        pos: "noun",
        pronunciation_vi: "SI-nyal",
        pronunciation_en: "SI-nyal",
      },
      {
        word: "kuota habis",
        en: "data quota is used up",
        vi: "hết dung lượng",
        pos: "phrase",
        pronunciation_vi: "KU-o-ta HA-bis",
        pronunciation_en: "KOO-o-ta HA-bis",
      },
      {
        word: "hotspot",
        en: "hotspot",
        vi: "điểm phát mạng / chia sẻ mạng",
        pos: "noun",
        pronunciation_vi: "HOT-spot",
        pronunciation_en: "HOT-spot",
      },
      {
        word: "registrasi nomor",
        en: "number registration",
        vi: "đăng ký số điện thoại",
        pos: "noun phrase",
        pronunciation_vi: "re-gis-TRA-si NO-mor",
        pronunciation_en: "re-gis-TRA-si NO-mor",
      },
      {
        word: "pulsa darurat",
        en: "emergency phone credit",
        vi: "ứng tiền điện thoại khẩn cấp",
        pos: "noun phrase",
        pronunciation_vi: "PUL-sa da-RU-rat",
        pronunciation_en: "POOL-sa da-ROO-rat",
      },
    ],
    dialogue: [
      {
        speaker: "Pelanggan",
        text: "Permisi, saya mau beli kartu SIM lokal untuk satu minggu.",
        vi: "Xin phép, tôi muốn mua SIM địa phương dùng trong một tuần.",
        en: "Excuse me, I want to buy a local SIM card for one week.",
      },
      {
        speaker: "Petugas konter",
        text: "Baik. Mau paket data berapa GB?",
        vi: "Được. Anh/chị muốn gói dữ liệu bao nhiêu GB?",
        en: "Sure. How many GB of data would you like?",
      },
      {
        speaker: "Pelanggan",
        text: "Yang sinyalnya kuat di Bali dan bisa menerima SMS verifikasi.",
        vi: "Loại có sóng mạnh ở Bali và có thể nhận SMS xác minh.",
        en: "One with strong signal in Bali that can receive verification SMS.",
      },
      {
        speaker: "Petugas konter",
        text: "Untuk registrasi nomor, saya perlu paspor Anda.",
        vi: "Để đăng ký số, tôi cần hộ chiếu của anh/chị.",
        en: "For number registration, I need your passport.",
      },
      {
        speaker: "Pelanggan",
        text: "Kalau kuotanya habis, saya bisa isi ulang di sini?",
        vi: "Nếu hết dung lượng, tôi có thể nạp thêm ở đây không?",
        en: "If the data runs out, can I top it up here?",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: 'Dung lượng internet của tôi đã hết.'",
        prompt_en: "Translate into Indonesian: 'My internet data quota is used up.'",
        answer: "Kuota internet saya sudah habis.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya mau beli kartu SIM ____ untuk paket data.`",
        prompt_en: "Fill in the blank: `Saya mau beli kartu SIM ____ untuk paket data.`",
        answer: "lokal",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match the Indonesian phrase with the Vietnamese meaning.",
        pairs: [
          ["sinyal lemah", "sóng yếu"],
          ["kuota habis", "hết dung lượng"],
          ["pulsa darurat", "ứng tiền điện thoại khẩn cấp"],
        ],
      },
      {
        type: "roleplay",
        prompt_vi:
          "Bạn ở quầy SIM sân bay. Hỏi gói data một tuần, yêu cầu nhận SMS xác minh, và hỏi cách nạp lại nếu hết dung lượng.",
        prompt_en:
          "You are at an airport SIM counter. Ask for a one-week data package, request verification-SMS support, and ask how to top up if the quota runs out.",
      },
    ],
    content:
      "Use this lesson when a learner needs practical Indonesian for phone connectivity: roaming, buying a local SIM, checking data quota, asking about weak signal, borrowing a hotspot, registering a number, and handling emergency phone credit.",
  },
];
