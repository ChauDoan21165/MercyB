// Water damage and leak report Indonesian (Vietnamese -> Indonesian study track).
//
// A2 Wave 27 file. Covers bocor, plafon rusak, pipa pecah, lapor pengelola,
// foto bukti, tukang ledeng, perbaikan, and ganti rugi.
// Self-contained so no registry or sibling agent files are touched.
//
// Field convention: sentence `en` holds the target Indonesian line, `vi` holds
// the Vietnamese gloss. `pronunciation_focus` carries Vietnamese-facing notes
// and common L1 traps; `pronunciation_focus_en` mirrors the same order for
// English-speaking companions.

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

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
export type IndonesianExercise = Record<string, unknown>;

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
    id: "indonesian_water_damage_leak_report",
    level: "B1",
    category: "housing",
    title_vi: "Báo rò nước và hư hại do nước",
    title_en: "Reporting leaks and water damage",
    sentences: [
      {
        en: "Ada kebocoran air dari plafon kamar saya.",
        vi: "Có rò nước từ trần phòng của tôi.",
        pronunciation_focus: [
          "A-da ke-bo-CO-ran A-ir da-ri pla-FON KA-mar SA-ya - `kebocoran air` = sự rò nước; `plafon` = trần nhà.",
          "`bocor` là tính từ/động từ gốc; `kebocoran` là danh từ chỉ sự cố rò rỉ.",
          "Lỗi người Việt: dùng `air keluar` quá chung. Với sự cố nhà ở, nói `kebocoran air` rõ hơn.",
        ],
        pronunciation_focus_en: [
          "A-da keh-bo-CHO-ran A-eer da-ree pla-FON KA-mar SA-ya - `kebocoran air` = water leak; `plafon` = ceiling.",
          "`bocor` is the root adjective/verb; `kebocoran` is the noun for a leak incident.",
          "VN-speaker trap: saying only `air keluar`, which is too general. For housing issues, `kebocoran air` is clearer.",
        ],
      },
      {
        en: "Plafon rusak dan catnya mulai mengelupas.",
        vi: "Trần nhà bị hỏng và sơn bắt đầu bong ra.",
        pronunciation_focus: [
          "pla-FON RU-sak dan CAT-nya MU-lai me-nge-LU-pas - `plafon rusak` = trần hỏng; `mengelupas` = bong/tróc.",
          "`catnya` = lớp sơn đó. `-nya` chỉ phần sơn trên trần đang nói tới.",
          "Lỗi người Việt: nói `warna jatuh` để mô tả sơn bong nghe không tự nhiên. Dùng `cat mengelupas`.",
        ],
        pronunciation_focus_en: [
          "pla-FON ROO-sak dan CHAT-nya MOO-lai meh-ngeh-LOO-pas - `plafon rusak` = damaged ceiling; `mengelupas` = peeling.",
          "`catnya` = the paint. `-nya` points to the paint on the ceiling being discussed.",
          "VN-speaker trap: saying `warna jatuh` for peeling paint sounds unnatural. Use `cat mengelupas`.",
        ],
      },
      {
        en: "Sepertinya pipa di lantai atas pecah.",
        vi: "Có vẻ như ống nước ở tầng trên bị vỡ.",
        pronunciation_focus: [
          "se-PER-ti-nya PI-pa di LAN-tai A-tas PE-cah - `sepertinya` = có vẻ như; `pipa pecah` = ống bị vỡ.",
          "`lantai atas` = tầng trên. Nếu bạn chưa chắc, mở bằng `sepertinya` để tránh kết luận quá mạnh.",
          "Lỗi người Việt: dùng `pipa rusak` cho mọi vấn đề. Nếu nước phun/ống vỡ, nói `pipa pecah`.",
        ],
        pronunciation_focus_en: [
          "seh-PER-tee-nya PEE-pa dee LAN-tai A-tas PEH-chah - `sepertinya` = it seems; `pipa pecah` = burst pipe.",
          "`lantai atas` = upstairs/floor above. If you are not sure, start with `sepertinya` to avoid overclaiming.",
          "VN-speaker trap: using `pipa rusak` for every issue. If water is bursting or the pipe is broken open, say `pipa pecah`.",
        ],
      },
      {
        en: "Saya perlu lapor pengelola apartemen sekarang.",
        vi: "Tôi cần báo cho ban quản lý căn hộ ngay bây giờ.",
        pronunciation_focus: [
          "SA-ya PER-lu LA-por pe-nge-LO-la a-par-te-MEN se-KA-rang - `lapor pengelola` = báo cho ban quản lý; `sekarang` = ngay bây giờ.",
          "`pengelola apartemen` là ban quản lý/tổ vận hành tòa nhà, lịch sự hơn `orang apartemen`.",
          "Lỗi người Việt: nói `lapor ke pengelola` cũng được; trong nói nhanh thường nghe `lapor pengelola`.",
        ],
        pronunciation_focus_en: [
          "SA-ya PER-loo LA-por peh-ngeh-LO-la a-par-teh-MEN seh-KA-rang - `lapor pengelola` = report to management; `sekarang` = now.",
          "`pengelola apartemen` is apartment/building management, more official than `orang apartemen`.",
          "VN-speaker note: `lapor ke pengelola` is also correct; in quick speech, `lapor pengelola` is common.",
        ],
      },
      {
        en: "Saya sudah kirim foto bukti lewat WhatsApp.",
        vi: "Tôi đã gửi ảnh bằng chứng qua WhatsApp.",
        pronunciation_focus: [
          "SA-ya SU-dah KI-rim FO-to BUK-ti LE-wat WhatsApp - `foto bukti` = ảnh bằng chứng; cũng tự nhiên: `bukti foto`.",
          "`lewat WhatsApp` = qua WhatsApp. Dùng khi đã gửi hình cho chủ nhà/pengelola.",
          "Lỗi người Việt: chỉ nói `saya kirim foto` mà không nói mục đích. Thêm `bukti` để rõ đây là bằng chứng.",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah KEE-rim FO-to BOOK-tee LEH-wat WhatsApp - `foto bukti` = evidence photo; `bukti foto` is also natural.",
          "`lewat WhatsApp` = via WhatsApp. Use it after sending photos to a landlord or management.",
          "VN-speaker note: saying only `saya kirim foto` misses the purpose. Add `bukti` to show these are evidence photos.",
        ],
      },
      {
        en: "Air menetes terus dan lantainya jadi licin.",
        vi: "Nước cứ nhỏ giọt liên tục và sàn trở nên trơn.",
        pronunciation_focus: [
          "A-ir me-NE-tes te-RUS dan LAN-tai-nya JA-di LI-cin - `menetes terus` = nhỏ giọt liên tục; `licin` = trơn.",
          "`jadi licin` = trở nên trơn. Câu này báo rủi ro an toàn, không chỉ thiệt hại vật chất.",
          "Lỗi người Việt: đọc `licin` với âm k. Chữ `c` Indonesia đọc 'ch': LI-chin.",
        ],
        pronunciation_focus_en: [
          "A-eer meh-NEH-tes teh-ROOS dan LAN-tai-nya JA-dee LEE-chin - `menetes terus` = keeps dripping; `licin` = slippery.",
          "`jadi licin` = becomes slippery. This reports a safety risk, not just property damage.",
          "VN-speaker trap: reading `licin` with a k sound. Indonesian `c` is 'ch': LEE-chin.",
        ],
      },
      {
        en: "Tolong kirim tukang ledeng secepatnya.",
        vi: "Làm ơn gửi thợ ống nước đến càng sớm càng tốt.",
        pronunciation_focus: [
          "TO-long KI-rim TU-kang LE-deng se-CE-pat-nya - `tukang ledeng` = thợ ống nước; `secepatnya` = càng sớm càng tốt.",
          "`ledeng` liên quan đến hệ thống nước/ống nước. Ở nhiều nơi cũng nghe `tukang pipa`.",
          "Lỗi người Việt: dùng `tukang air` nghe không tự nhiên. Từ phổ biến hơn là `tukang ledeng` hoặc `tukang pipa`.",
        ],
        pronunciation_focus_en: [
          "TO-long KEE-rim TOO-kang LEH-deng seh-CHEH-pat-nya - `tukang ledeng` = plumber; `secepatnya` = as soon as possible.",
          "`ledeng` relates to water/plumbing. In many places, you may also hear `tukang pipa`.",
          "VN-speaker trap: saying `tukang air` sounds unnatural. Use `tukang ledeng` or `tukang pipa`.",
        ],
      },
      {
        en: "Apakah perbaikannya bisa dilakukan hari ini?",
        vi: "Việc sửa chữa có thể được làm hôm nay không?",
        pronunciation_focus: [
          "a-PA-kah per-BAI-kan-nya BI-sa di-LA-ku-kan HA-ri I-ni - `perbaikannya` = việc sửa chữa đó; `dilakukan` = được thực hiện.",
          "`bisa dilakukan` là cách lịch sự để hỏi khả năng xử lý.",
          "Lỗi người Việt: nói `bisa perbaiki hari ini?` hiểu được, nhưng `perbaikannya bisa dilakukan hari ini?` chuẩn và mềm hơn.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah per-BAI-kan-nya BEE-sa dee-LA-koo-kan HA-ree EE-nee - `perbaikannya` = the repair; `dilakukan` = carried out/done.",
          "`bisa dilakukan` is a polite way to ask whether it can be handled.",
          "VN-speaker note: `bisa perbaiki hari ini?` is understandable, but `perbaikannya bisa dilakukan hari ini?` is neater and softer.",
        ],
      },
      {
        en: "Barang saya basah karena air bocor dari plafon.",
        vi: "Đồ của tôi bị ướt vì nước rò từ trần nhà.",
        pronunciation_focus: [
          "BA-rang SA-ya BA-sah KA-re-na A-ir BO-cor da-ri pla-FON - `barang saya basah` = đồ của tôi bị ướt; `karena` = vì.",
          "`air bocor` tự nhiên trong nói thường; nếu viết báo cáo, `kebocoran air` trang trọng hơn.",
          "Lỗi người Việt: dùng `basah air` theo tiếng Việt. Nói `barang saya basah karena air...`.",
        ],
        pronunciation_focus_en: [
          "BA-rang SA-ya BA-sah KA-reh-na A-eer BO-chor da-ree pla-FON - `barang saya basah` = my belongings are wet; `karena` = because.",
          "`air bocor` is natural in everyday speech; for reports, `kebocoran air` is more formal.",
          "VN-speaker trap: using Vietnamese-like `basah air`. Say `barang saya basah karena air...`.",
        ],
      },
      {
        en: "Saya ingin membahas ganti rugi untuk barang yang rusak.",
        vi: "Tôi muốn trao đổi về bồi thường cho đồ bị hỏng.",
        pronunciation_focus: [
          "SA-ya I-ngin mem-BA-has GAN-ti RU-gi UN-tuk BA-rang yang RU-sak - `ganti rugi` = bồi thường; `membahas` = bàn/trao đổi.",
          "`membahas ganti rugi` mềm hơn nói thẳng `minta uang`. Dùng khi có thiệt hại thật và bằng chứng.",
          "Lỗi người Việt: dịch bồi thường thành `bayar kembali` quá chung. Từ pháp lý/thực tế là `ganti rugi`.",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin mem-BA-has GAN-tee ROO-gee OON-took BA-rang yang ROO-sak - `ganti rugi` = compensation; `membahas` = discuss.",
          "`membahas ganti rugi` is softer than bluntly saying `minta uang`. Use it when there is real damage and evidence.",
          "VN-speaker trap: translating compensation as generic `bayar kembali`. The practical/legal phrase is `ganti rugi`.",
        ],
      },
      {
        en: "Mohon konfirmasi siapa yang bertanggung jawab atas biaya perbaikan.",
        vi: "Xin xác nhận ai chịu trách nhiệm về chi phí sửa chữa.",
        pronunciation_focus: [
          "MO-hon kon-fir-MA-si SI-a-pa yang ber-tang-GUNG JA-wab A-tas BI-a-ya per-BAI-kan - `bertanggung jawab` = chịu trách nhiệm; `biaya perbaikan` = chi phí sửa chữa.",
          "`mohon konfirmasi` lịch sự và hợp với tin nhắn chính thức cho pengelola/pemilik.",
          "Lỗi người Việt: hỏi `siapa bayar?` quá cộc. Dùng `siapa yang bertanggung jawab atas biaya...`.",
        ],
        pronunciation_focus_en: [
          "MO-hon kon-feer-MA-see SEE-a-pa yang ber-tang-GOONG JA-wab A-tas BEE-a-ya per-BAI-kan - `bertanggung jawab` = responsible; `biaya perbaikan` = repair cost.",
          "`mohon konfirmasi` is polite and fits official messages to management or a landlord.",
          "VN-speaker trap: asking bluntly `siapa bayar?`. Use `siapa yang bertanggung jawab atas biaya...`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi có rò nước hoặc hư hại do nước ở nhà thuê/căn hộ tại Indonesia, hãy báo nhanh cho `pengelola`, `pemilik rumah`, hoặc security tòa nhà. Tin nhắn nên có vị trí rò nước, thời điểm bắt đầu, rủi ro an toàn như lantai licin, và `foto bukti`. Nếu có đồ bị hỏng, dùng ngôn ngữ mềm: `Saya ingin membahas ganti rugi` thay vì đòi tiền ngay. Với sự cố nước, `tukang ledeng` hoặc `tukang pipa` là người cần gọi.",
    cultural_notes_en:
      "When there is a leak or water damage in a rented home or apartment in Indonesia, report it quickly to management, the landlord, or building security. A useful message includes the leak location, when it started, safety risks such as a slippery floor, and evidence photos. If belongings are damaged, use softer language like `Saya ingin membahas ganti rugi` instead of immediately demanding money. For water issues, a `tukang ledeng` or `tukang pipa` is the person to call.",
    tip_advice_vi:
      "Mẫu tin nhắn an toàn: `Selamat pagi, ada kebocoran air dari plafon kamar saya. Air menetes terus dan lantainya jadi licin. Saya sudah kirim foto bukti. Tolong kirim tukang ledeng secepatnya dan konfirmasi siapa yang bertanggung jawab atas biaya perbaikan.`",
    tip_advice_en:
      "Safe message template: `Selamat pagi, ada kebocoran air dari plafon kamar saya. Air menetes terus dan lantainya jadi licin. Saya sudah kirim foto bukti. Tolong kirim tukang ledeng secepatnya dan konfirmasi siapa yang bertanggung jawab atas biaya perbaikan.`",
    vocabulary: [
      {
        word: "bocor",
        en: "leaking; leak",
        vi: "rò/rò rỉ",
        pos: "adjective/verb",
        pronunciation_vi: "BO-cor",
        pronunciation_en: "BO-chor",
      },
      {
        word: "kebocoran air",
        en: "water leak",
        vi: "sự rò nước",
        pos: "noun",
        pronunciation_vi: "ke-bo-CO-ran A-ir",
        pronunciation_en: "keh-bo-CHO-ran A-eer",
      },
      {
        word: "plafon rusak",
        en: "damaged ceiling",
        vi: "trần nhà bị hỏng",
        pos: "phrase",
        pronunciation_vi: "pla-FON RU-sak",
        pronunciation_en: "pla-FON ROO-sak",
      },
      {
        word: "pipa pecah",
        en: "burst pipe",
        vi: "ống nước bị vỡ",
        pos: "noun phrase",
        pronunciation_vi: "PI-pa PE-cah",
        pronunciation_en: "PEE-pa PEH-chah",
      },
      {
        word: "lapor pengelola",
        en: "report to management",
        vi: "báo cho ban quản lý",
        pos: "verb phrase",
        pronunciation_vi: "LA-por pe-nge-LO-la",
        pronunciation_en: "LA-por peh-ngeh-LO-la",
      },
      {
        word: "foto bukti",
        en: "evidence photo",
        vi: "ảnh bằng chứng",
        pos: "noun",
        pronunciation_vi: "FO-to BUK-ti",
        pronunciation_en: "FO-to BOOK-tee",
      },
      {
        word: "tukang ledeng",
        en: "plumber",
        vi: "thợ ống nước",
        pos: "noun",
        pronunciation_vi: "TU-kang LE-deng",
        pronunciation_en: "TOO-kang LEH-deng",
      },
      {
        word: "perbaikan",
        en: "repair",
        vi: "sửa chữa",
        pos: "noun",
        pronunciation_vi: "per-BAI-kan",
        pronunciation_en: "per-BAI-kan",
      },
      {
        word: "ganti rugi",
        en: "compensation",
        vi: "bồi thường",
        pos: "noun",
        pronunciation_vi: "GAN-ti RU-gi",
        pronunciation_en: "GAN-tee ROO-gee",
      },
      {
        word: "biaya perbaikan",
        en: "repair cost",
        vi: "chi phí sửa chữa",
        pos: "noun",
        pronunciation_vi: "BI-a-ya per-BAI-kan",
        pronunciation_en: "BEE-a-ya per-BAI-kan",
      },
    ],
    dialogue: [
      {
        speaker: "Penyewa",
        text: "Selamat pagi, saya mau lapor ada kebocoran air dari plafon kamar.",
        vi: "Chào buổi sáng, tôi muốn báo có rò nước từ trần phòng.",
        en: "Good morning, I would like to report a water leak from the room ceiling.",
      },
      {
        speaker: "Pengelola",
        text: "Sejak kapan airnya menetes?",
        vi: "Nước bắt đầu nhỏ giọt từ khi nào?",
        en: "Since when has the water been dripping?",
      },
      {
        speaker: "Penyewa",
        text: "Sejak tadi malam. Plafon rusak dan lantainya jadi licin.",
        vi: "Từ tối qua. Trần bị hỏng và sàn trở nên trơn.",
        en: "Since last night. The ceiling is damaged and the floor has become slippery.",
      },
      {
        speaker: "Pengelola",
        text: "Tolong kirim foto bukti lewat WhatsApp.",
        vi: "Vui lòng gửi ảnh bằng chứng qua WhatsApp.",
        en: "Please send evidence photos via WhatsApp.",
      },
      {
        speaker: "Penyewa",
        text: "Sudah saya kirim. Tolong kirim tukang ledeng secepatnya.",
        vi: "Tôi đã gửi rồi. Làm ơn gửi thợ ống nước đến càng sớm càng tốt.",
        en: "I have sent them. Please send a plumber as soon as possible.",
      },
      {
        speaker: "Pengelola",
        text: "Baik, kami cek dulu dan konfirmasi jadwal perbaikan.",
        vi: "Được, chúng tôi kiểm tra trước và xác nhận lịch sửa chữa.",
        en: "All right, we will check first and confirm the repair schedule.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Có rò nước từ trần phòng của tôi.",
        prompt_en: "Translate into Indonesian: There is a water leak from my room ceiling.",
        answer: "Ada kebocoran air dari plafon kamar saya.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Tolong kirim tukang ___ secepatnya.",
        prompt_en: "Fill in the blank: Tolong kirim tukang ___ secepatnya.",
        answer: "ledeng",
      },
      {
        type: "choice",
        prompt_vi: "Câu nào lịch sự nhất khi hỏi trách nhiệm chi phí sửa chữa?",
        prompt_en: "Which sentence is most polite for asking responsibility for repair costs?",
        options: [
          "Mohon konfirmasi siapa yang bertanggung jawab atas biaya perbaikan.",
          "Siapa bayar ini?",
          "Saya tidak mau bayar.",
        ],
        answer: "Mohon konfirmasi siapa yang bertanggung jawab atas biaya perbaikan.",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm từ Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match each Indonesian phrase with its Vietnamese meaning.",
        pairs: [
          ["pipa pecah", "ống nước bị vỡ"],
          ["foto bukti", "ảnh bằng chứng"],
          ["ganti rugi", "bồi thường"],
        ],
      },
    ],
    content:
      "Use this lesson for practical water-damage reporting: describing leaks, damaged ceilings, burst pipes, dripping water, safety risks, evidence photos, calling a plumber, scheduling repairs, and discussing compensation or repair-cost responsibility politely.",
  },
];
