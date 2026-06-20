// Home Internet & Wi-Fi Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It mirrors sibling Indonesian `extra/*`
// files: target-language text is stored in `en`, Vietnamese glosses in `vi`,
// Vietnamese-facing L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.
//
// Register note: home internet Indonesian mixes everyday service language with
// English tech loans: `pasang internet`, `Wi-Fi`, `router`, `gangguan jaringan`,
// `teknisi`, `tagihan`, `paket internet`, and `komplain layanan`.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length and order. */
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
    id: "indonesian_home_internet_wifi",
    level: "A2",
    category: "technology",
    title_vi: "Internet gia đình và Wi-Fi",
    title_en: "Home internet and Wi-Fi",
    sentences: [
      {
        en: "Saya mau pasang internet di rumah.",
        vi: "Tôi muốn lắp internet ở nhà.",
        pronunciation_focus: [
          "SA-ya mau PA-sang IN-ter-net di RU-mah - `pasang internet` = lắp internet; `di rumah` = ở nhà.",
          "Lỗi người Việt: dùng `ke rumah` cho vị trí tĩnh. Dịch 'ở nhà' là `di rumah`, không phải `ke rumah`.",
          "Luyện: `Saya mau pasang internet di rumah.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau PA-sang IN-ter-net dee ROO-mah - `pasang internet` = install internet; `di rumah` = at home.",
          "VN-speaker trap: using `ke rumah` for a static location. 'At home' is `di rumah`, not `ke rumah`.",
          "Drill: `Saya mau pasang internet di rumah.`",
        ],
      },
      {
        en: "Paket internet yang paling murah berapa?",
        vi: "Gói internet rẻ nhất bao nhiêu?",
        pronunciation_focus: [
          "PA-ket IN-ter-net yang PA-ling MU-rah be-RA-pa - `paket internet` = gói internet; `paling murah` = rẻ nhất.",
          "Lỗi người Việt: hỏi `apa harga`. Khi hỏi giá/số tiền, dùng `berapa`.",
          "Luyện: `Paket paling murah berapa?`",
        ],
        pronunciation_focus_en: [
          "PA-ket IN-ter-net yang PA-ling MOO-rah be-RA-pa - `paket internet` = internet package; `paling murah` = cheapest.",
          "VN-speaker trap: asking `apa harga`. For price/amount, use `berapa`.",
          "Drill: `Paket paling murah berapa?`",
        ],
      },
      {
        en: "Apakah biaya pemasangan sudah termasuk router?",
        vi: "Phí lắp đặt đã bao gồm router chưa?",
        pronunciation_focus: [
          "a-PA-kah BI-a-ya pe-ma-SA-ngan SU-dah ter-MA-suk RU-ter - `biaya pemasangan` = phí lắp đặt; `termasuk` = bao gồm.",
          "Lỗi người Việt: nói `harga pasang`. Cụm dịch vụ tự nhiên hơn là `biaya pemasangan`.",
          "Luyện: `Biaya pemasangan sudah termasuk router?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah BEE-a-ya pe-ma-SA-ngan SOO-dah ter-MA-sook ROO-ter - `biaya pemasangan` = installation fee; `termasuk` = included.",
          "VN-speaker trap: saying `harga pasang`. For a service fee, `biaya pemasangan` is more natural.",
          "Drill: `Biaya pemasangan sudah termasuk router?`",
        ],
      },
      {
        en: "Wi-Fi di kamar belakang sinyalnya lemah.",
        vi: "Wi-Fi trong phòng phía sau sóng yếu.",
        pronunciation_focus: [
          "WAI-fai di KA-mar be-LA-kang si-NYAL-nya LE-mah - `sinyal lemah` = sóng yếu; `kamar belakang` = phòng sau.",
          "Lỗi người Việt: đọc `ny` trong `sinyal` tách rời. `ny` là một âm như 'nh' trong tiếng Việt.",
          "Luyện: `Sinyalnya lemah.`",
        ],
        pronunciation_focus_en: [
          "WAI-fai dee KA-mar be-LA-kang see-NYAL-nya LEH-mah - `sinyal lemah` = weak signal; `kamar belakang` = back room.",
          "VN-speaker trap: splitting `ny` in `sinyal`. `ny` is one sound, like Vietnamese 'nh'.",
          "Drill: `Sinyalnya lemah.`",
        ],
      },
      {
        en: "Internetnya sering putus-putus.",
        vi: "Internet thường xuyên bị chập chờn/đứt quãng.",
        pronunciation_focus: [
          "IN-ter-net-nya SE-ring PU-tus-PU-tus - `putus-putus` = đứt quãng/chập chờn.",
          "Lỗi người Việt: nói `internet putus` chỉ một lần. Lặp `putus-putus` để nói bị lặp đi lặp lại.",
          "Luyện: `Internetnya putus-putus.`",
        ],
        pronunciation_focus_en: [
          "IN-ter-net-nya SEH-ring POO-toos-POO-toos - `putus-putus` = keeps cutting out.",
          "VN-speaker trap: `internet putus` sounds like one break. Reduplicate `putus-putus` for repeated cutting out.",
          "Drill: `Internetnya putus-putus.`",
        ],
      },
      {
        en: "Sepertinya ada gangguan jaringan.",
        vi: "Có vẻ như có sự cố mạng.",
        pronunciation_focus: [
          "se-PER-ti-nya A-da gang-GU-an ja-RI-ngan - `gangguan jaringan` = sự cố mạng; `sepertinya` = có vẻ như.",
          "Lỗi người Việt: dùng `masalah internet` được hiểu, nhưng khi báo nhà mạng nói `gangguan jaringan` rõ hơn.",
          "Luyện: `Ada gangguan jaringan.`",
        ],
        pronunciation_focus_en: [
          "se-PER-tee-nya A-da gang-GOO-an ja-REE-ngan - `gangguan jaringan` = network disruption; `sepertinya` = it seems.",
          "VN-speaker note: `masalah internet` is understood, but reporting to an ISP is clearer with `gangguan jaringan`.",
          "Drill: `Ada gangguan jaringan.`",
        ],
      },
      {
        en: "Tolong kirim teknisi ke alamat saya.",
        vi: "Làm ơn cử kỹ thuật viên đến địa chỉ của tôi.",
        pronunciation_focus: [
          "TO-long KI-rim TEK-ni-si ke a-LA-mat SA-ya - `teknisi` = kỹ thuật viên; `kirim` = gửi/cử.",
          "Lỗi người Việt: dùng `di alamat` sau động từ chuyển động. Cử người ĐẾN địa chỉ dùng `ke alamat`.",
          "Luyện: `Kirim teknisi ke alamat saya.`",
        ],
        pronunciation_focus_en: [
          "TO-long KEE-rim TEK-nee-see ke a-LA-mat SA-ya - `teknisi` = technician; `kirim` = send.",
          "VN-speaker trap: using `di alamat` after a movement verb. Send someone TO an address: `ke alamat`.",
          "Drill: `Kirim teknisi ke alamat saya.`",
        ],
      },
      {
        en: "Teknisi bisa datang hari ini atau besok?",
        vi: "Kỹ thuật viên có thể đến hôm nay hay ngày mai?",
        pronunciation_focus: [
          "TEK-ni-si BI-sa da-TANG HA-ri I-ni A-tau BE-sok - `hari ini` = hôm nay; `besok` = ngày mai.",
          "Lỗi người Việt: hỏi yes/no rồi thêm hai lựa chọn. Với lựa chọn A/B, dùng `atau`.",
          "Luyện: `Hari ini atau besok?`",
        ],
        pronunciation_focus_en: [
          "TEK-nee-see BEE-sa da-TANG HA-ree EE-nee A-tau BEH-sok - `hari ini` = today; `besok` = tomorrow.",
          "VN-speaker trap: asking a yes/no question then giving two options. For A/B choices, use `atau`.",
          "Drill: `Hari ini atau besok?`",
        ],
      },
      {
        en: "Tagihan bulan ini naik tanpa pemberitahuan.",
        vi: "Hóa đơn tháng này tăng mà không có thông báo.",
        pronunciation_focus: [
          "ta-GI-han BU-lan I-ni NAIK TAN-pa pem-be-ri-TA-hu-an - `tagihan` = hóa đơn; `pemberitahuan` = thông báo.",
          "Lỗi người Việt: dùng `bill` tiếng Anh trong câu trang trọng. Nhà mạng thường dùng `tagihan`.",
          "Luyện: `Tagihan bulan ini naik.`",
        ],
        pronunciation_focus_en: [
          "ta-GEE-han BOO-lan EE-nee NAIK TAN-pa pem-be-ree-TA-hoo-an - `tagihan` = bill; `pemberitahuan` = notice.",
          "VN-speaker trap: using English `bill` in a formal complaint. ISPs usually say `tagihan`.",
          "Drill: `Tagihan bulan ini naik.`",
        ],
      },
      {
        en: "Saya mau mengajukan komplain layanan.",
        vi: "Tôi muốn gửi khiếu nại về dịch vụ.",
        pronunciation_focus: [
          "SA-ya mau me-nga-JU-kan kom-PLAIN la-YA-nan - `mengajukan komplain` = gửi khiếu nại; `layanan` = dịch vụ.",
          "Lỗi người Việt: `saya komplain` dùng được trong chat nhanh; câu lịch sự là `mengajukan komplain`.",
          "Luyện: `Saya mau mengajukan komplain layanan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau me-nga-JOO-kan kom-PLAIN la-YA-nan - `mengajukan komplain` = submit a complaint; `layanan` = service.",
          "VN-speaker trap: `saya komplain` works in quick chat; polite service language uses `mengajukan komplain`.",
          "Drill: `Saya mau mengajukan komplain layanan.`",
        ],
      },
      {
        en: "Nomor pelanggan saya ada di tagihan.",
        vi: "Mã khách hàng của tôi có trên hóa đơn.",
        pronunciation_focus: [
          "NO-mor pe-LANG-gan SA-ya A-da di ta-GI-han - `nomor pelanggan` = mã/số khách hàng.",
          "Lỗi người Việt: hỏi `apa nomor pelanggan`. Khi hỏi số, dùng `berapa nomor pelanggan?`.",
          "Luyện: `Nomor pelanggan ada di tagihan.`",
        ],
        pronunciation_focus_en: [
          "NO-mor pe-LANG-gan SA-ya A-da dee ta-GEE-han - `nomor pelanggan` = customer number.",
          "VN-speaker trap: asking `apa nomor pelanggan`. For a number, ask `berapa nomor pelanggan?`.",
          "Drill: `Nomor pelanggan ada di tagihan.`",
        ],
      },
      {
        en: "Kalau gangguan belum selesai, apakah tagihan bisa dikurangi?",
        vi: "Nếu sự cố chưa giải quyết xong, hóa đơn có thể được giảm không?",
        pronunciation_focus: [
          "KA-lau gang-GU-an be-LUM se-LE-sai, a-PA-kah ta-GI-han BI-sa di-ku-RANG-i - `dikurangi` = được giảm.",
          "Lỗi người Việt: nói `bisa kurang tagihan` thiếu tự nhiên. Câu chuẩn hơn: `tagihan bisa dikurangi`.",
          "Luyện: `Tagihan bisa dikurangi?`",
        ],
        pronunciation_focus_en: [
          "KA-lau gang-GOO-an be-LOOM se-LEH-sai, a-PA-kah ta-GEE-han BEE-sa dee-koo-RANG-ee - `dikurangi` = reduced.",
          "VN-speaker trap: `bisa kurang tagihan` sounds off. Better: `tagihan bisa dikurangi`.",
          "Drill: `Tagihan bisa dikurangi?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, dịch vụ internet gia đình thường dùng từ `pasang internet`, `paket internet`, `tagihan`, `nomor pelanggan`, và `teknisi`. Khi có lỗi, nhà mạng có thể gọi là `gangguan jaringan`. Khi khiếu nại, chuẩn bị `nomor pelanggan`, địa chỉ đầy đủ, ảnh đèn router nếu cần, và thời điểm bắt đầu sự cố.",
    cultural_notes_en:
      "In Indonesia, home internet service commonly uses terms like `pasang internet`, `paket internet`, `tagihan`, `nomor pelanggan`, and `teknisi`. A service problem may be called `gangguan jaringan`. For complaints, prepare the `nomor pelanggan`, full address, router-light photos if needed, and the time the problem started.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `sinyal lemah` (sóng yếu), `putus-putus` (chập chờn), và `gangguan jaringan` (sự cố mạng). Khi gọi tổng đài, dùng khung: `Saya mau mengajukan komplain`, `Internetnya putus-putus`, `Tolong kirim teknisi`, `Nomor pelanggan saya...`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: distinguish `sinyal lemah` (weak signal), `putus-putus` (keeps cutting out), and `gangguan jaringan` (network disruption). When calling support, use frames like: `Saya mau mengajukan komplain`, `Internetnya putus-putus`, `Tolong kirim teknisi`, `Nomor pelanggan saya...`.",
    vocabulary: [
      {
        word: "pasang internet",
        en: "install home internet",
        vi: "lắp internet",
        pos: "verb phrase",
        pronunciation_vi: "PA-sang IN-ter-net",
        pronunciation_en: "PA-sang IN-ter-net",
      },
      {
        word: "Wi-Fi",
        en: "Wi-Fi",
        vi: "Wi-Fi",
        pos: "noun",
        pronunciation_vi: "WAI-fai",
        pronunciation_en: "WAI-fai",
      },
      {
        word: "router",
        en: "router",
        vi: "bộ phát router",
        pos: "noun",
        pronunciation_vi: "RU-ter",
        pronunciation_en: "ROO-ter",
      },
      {
        word: "gangguan jaringan",
        en: "network disruption",
        vi: "sự cố mạng",
        pos: "noun phrase",
        pronunciation_vi: "gang-GU-an ja-RI-ngan",
        pronunciation_en: "gang-GOO-an ja-REE-ngan",
      },
      {
        word: "teknisi",
        en: "technician",
        vi: "kỹ thuật viên",
        pos: "noun",
        pronunciation_vi: "TEK-ni-si",
        pronunciation_en: "TEK-nee-see",
      },
      {
        word: "tagihan",
        en: "bill",
        vi: "hóa đơn",
        pos: "noun",
        pronunciation_vi: "ta-GI-han",
        pronunciation_en: "ta-GEE-han",
      },
      {
        word: "paket internet",
        en: "internet package",
        vi: "gói internet",
        pos: "noun phrase",
        pronunciation_vi: "PA-ket IN-ter-net",
        pronunciation_en: "PA-ket IN-ter-net",
      },
      {
        word: "komplain layanan",
        en: "service complaint",
        vi: "khiếu nại dịch vụ",
        pos: "noun phrase",
        pronunciation_vi: "kom-PLAIN la-YA-nan",
        pronunciation_en: "kom-PLAIN la-YA-nan",
      },
      {
        word: "nomor pelanggan",
        en: "customer number",
        vi: "mã khách hàng",
        pos: "noun phrase",
        pronunciation_vi: "NO-mor pe-LANG-gan",
        pronunciation_en: "NO-mor pe-LANG-gan",
      },
      {
        word: "putus-putus",
        en: "keeps cutting out",
        vi: "chập chờn / đứt quãng",
        pos: "adjective",
        pronunciation_vi: "PU-tus-PU-tus",
        pronunciation_en: "POO-toos-POO-toos",
      },
      {
        word: "sinyal lemah",
        en: "weak signal",
        vi: "sóng yếu",
        pos: "noun phrase",
        pronunciation_vi: "si-NYAL LE-mah",
        pronunciation_en: "see-NYAL LEH-mah",
      },
      {
        word: "biaya pemasangan",
        en: "installation fee",
        vi: "phí lắp đặt",
        pos: "noun phrase",
        pronunciation_vi: "BI-a-ya pe-ma-SA-ngan",
        pronunciation_en: "BEE-a-ya pe-ma-SA-ngan",
      },
    ],
    dialogue: [
      {
        speaker: "Pelanggan",
        text: "Halo, saya mau mengajukan komplain layanan. Internet saya sering putus-putus.",
        vi: "A lô, tôi muốn gửi khiếu nại dịch vụ. Internet của tôi thường xuyên chập chờn.",
        en: "Hello, I want to submit a service complaint. My internet keeps cutting out.",
      },
      {
        speaker: "CS",
        text: "Baik, boleh minta nomor pelanggan dan alamat lengkapnya?",
        vi: "Vâng, cho tôi xin mã khách hàng và địa chỉ đầy đủ được không?",
        en: "Okay, may I have the customer number and full address?",
      },
      {
        speaker: "Pelanggan",
        text: "Nomor pelanggan ada di tagihan. Tolong kirim teknisi hari ini.",
        vi: "Mã khách hàng có trên hóa đơn. Làm ơn cử kỹ thuật viên hôm nay.",
        en: "The customer number is on the bill. Please send a technician today.",
      },
      {
        speaker: "CS",
        text: "Kami cek dulu. Sepertinya ada gangguan jaringan di area Bapak.",
        vi: "Chúng tôi kiểm tra trước. Có vẻ có sự cố mạng trong khu vực của anh.",
        en: "We will check first. It seems there is a network disruption in your area.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Internet thường xuyên bị chập chờn.",
        answer: "Internetnya sering putus-putus.",
      },
      {
        type: "fill_blank",
        prompt: "Tolong kirim ____ ke alamat saya.",
        answer: "teknisi",
        explanation_vi: "`teknisi` = kỹ thuật viên.",
        explanation_en: "`teknisi` = technician.",
      },
      {
        type: "multiple_choice",
        prompt: "Which phrase means 'network disruption'?",
        choices: ["gangguan jaringan", "nomor pelanggan", "biaya pemasangan", "paket internet"],
        answer: "gangguan jaringan",
      },
      {
        type: "matching",
        pairs: [
          ["tagihan", "hóa đơn"],
          ["router", "bộ phát router"],
          ["sinyal lemah", "sóng yếu"],
          ["pasang internet", "lắp internet"],
        ],
      },
    ],
  },
];

export default lessons;
