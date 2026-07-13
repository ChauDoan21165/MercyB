// Startup & Small Business Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file following the established Indonesian extra
// format. The `en` field holds TARGET-LANGUAGE Indonesian, `vi` holds the
// Vietnamese gloss, and pronunciation_focus carries Vietnamese L1 notes with
// English companion explanations in the same order.

type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

type IndonesianVocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type IndonesianDialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type IndonesianExercise = Record<string, unknown>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
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
    id: "indonesian_startup_small_business",
    level: "B1",
    category: "business",
    title_vi: "Startup và kinh doanh nhỏ",
    title_en: "Startup and small business Indonesian",
    sentences: [
      {
        en: "Saya sedang membangun startup kecil.",
        vi: "Tôi đang xây dựng một startup nhỏ.",
        pronunciation_focus: [
          "SA-ya SE-dang mem-BA-ngun STAR-tap ke-CIL - `sedang` = đang; `membangun startup` = xây dựng startup.",
          "Lỗi người Việt: đọc `kecil` như `ke-kil`. Chữ `c` tiếng Indonesia đọc như `ch`: `ke-CIL`.",
          "Luyện: `Saya sedang membangun startup kecil.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SE-dang mem-BA-ngun STAR-tup ke-CHIL - `sedang` = currently; `membangun startup` = build a startup.",
          "VN-speaker trap: reading `kecil` as `ke-kil`. Indonesian `c` is `ch`: `ke-CHIL`.",
          "Drill: `Saya sedang membangun startup kecil.`",
        ],
      },
      {
        en: "Usaha kecil saya fokus pada pelanggan lokal.",
        vi: "Việc kinh doanh nhỏ của tôi tập trung vào khách hàng địa phương.",
        pronunciation_focus: [
          "u-SA-ha ke-CIL SA-ya FO-kus PA-da pe-LANG-gan LO-kal - `usaha kecil` = kinh doanh nhỏ; `pelanggan` = khách hàng.",
          "Lỗi người Việt: dùng `tamu` cho khách mua hàng. `Tamu` là khách đến chơi; khách hàng là `pelanggan`.",
          "Luyện: `Fokus pada pelanggan lokal.`",
        ],
        pronunciation_focus_en: [
          "u-SA-ha ke-CHIL SA-ya FO-kus PA-da pe-LANG-gan LO-kal - `usaha kecil` = small business; `pelanggan` = customers.",
          "VN-speaker trap: using `tamu` for paying customers. `Tamu` is a social guest; customer is `pelanggan`.",
          "Drill: `Fokus pada pelanggan lokal.`",
        ],
      },
      {
        en: "Kami memakai pemasaran online lewat Instagram dan TikTok.",
        vi: "Chúng tôi dùng tiếp thị online qua Instagram và TikTok.",
        pronunciation_focus: [
          "KA-mi me-MA-kai pe-ma-SA-ran ON-lain LE-wat Instagram dan TikTok - `pemasaran online` = tiếp thị online; `lewat` = qua kênh.",
          "Lỗi người Việt: nói `di Instagram` khi muốn nói kênh tiếp thị. Với kênh/phương tiện, `lewat Instagram` rõ hơn.",
          "Luyện: `Pemasaran online lewat Instagram.`",
        ],
        pronunciation_focus_en: [
          "KA-mi me-MA-kai pe-ma-SA-ran ON-line LE-wat Instagram dan TikTok - `pemasaran online` = online marketing; `lewat` = via.",
          "VN-speaker trap: saying `di Instagram` when you mean the marketing channel. `Lewat Instagram` is clearer.",
          "Drill: `Pemasaran online lewat Instagram.`",
        ],
      },
      {
        en: "Modal awal kami masih terbatas.",
        vi: "Vốn ban đầu của chúng tôi vẫn còn hạn chế.",
        pronunciation_focus: [
          "MO-dal A-wal KA-mi MA-sih ter-BA-tas - `modal awal` = vốn ban đầu; `terbatas` = hạn chế.",
          "Lỗi người Việt: nói `modal pertama`. Cụm kinh doanh tự nhiên là `modal awal`.",
          "Luyện: `Modal awal kami terbatas.`",
        ],
        pronunciation_focus_en: [
          "MO-dal A-wal KA-mi MA-sih ter-BA-tas - `modal awal` = initial capital; `terbatas` = limited.",
          "VN-speaker trap: saying `modal pertama`. The natural business phrase is `modal awal`.",
          "Drill: `Modal awal kami terbatas.`",
        ],
      },
      {
        en: "Omzet bulan ini naik dua puluh persen.",
        vi: "Doanh thu tháng này tăng hai mươi phần trăm.",
        pronunciation_focus: [
          "OM-zet BU-lan I-ni NAIK DU-a PU-luh per-SEN - `omzet` = doanh thu; `naik` = tăng.",
          "Lỗi người Việt: lẫn `omzet` với `untung`. `Omzet` là doanh thu, còn `untung` là lợi nhuận.",
          "Luyện: `Omzet naik dua puluh persen.`",
        ],
        pronunciation_focus_en: [
          "OM-zet BU-lan EE-ni NAIK DOO-a POO-looh per-SEN - `omzet` = revenue/turnover; `naik` = rises.",
          "VN-speaker trap: confusing `omzet` with `untung`. `Omzet` is revenue; `untung` is profit.",
          "Drill: `Omzet naik dua puluh persen.`",
        ],
      },
      {
        en: "Kami sedang mencari investor untuk tahap berikutnya.",
        vi: "Chúng tôi đang tìm nhà đầu tư cho giai đoạn tiếp theo.",
        pronunciation_focus: [
          "KA-mi SE-dang men-CA-ri in-VES-tor UN-tuk TA-hap be-ri-KUT-nya - `mencari investor` = tìm nhà đầu tư; `tahap berikutnya` = giai đoạn tiếp theo.",
          "Lỗi người Việt: đọc `cari` như `kari`. Chữ `c` = `ch`, nên `men-CA-ri`.",
          "Luyện: `Kami mencari investor.`",
        ],
        pronunciation_focus_en: [
          "KA-mi SE-dang men-CHA-ri in-VES-tor UN-tuk TA-hap be-ri-KOOT-nya - `mencari investor` = look for investors; `tahap berikutnya` = next stage.",
          "VN-speaker trap: reading `cari` as `kari`. Indonesian `c` = `ch`, so `men-CHA-ri`.",
          "Drill: `Kami mencari investor.`",
        ],
      },
      {
        en: "Rencana bisnis kami sudah lebih jelas.",
        vi: "Kế hoạch kinh doanh của chúng tôi đã rõ hơn.",
        pronunciation_focus: [
          "ren-CA-na BIS-nis KA-mi SU-dah LE-bih JE-las - `rencana bisnis` = kế hoạch kinh doanh; `lebih jelas` = rõ hơn.",
          "Lỗi người Việt: nói `plan bisnis` pha tiếng Anh. Trong văn bản/pitch, dùng `rencana bisnis`.",
          "Luyện: `Rencana bisnis sudah jelas.`",
        ],
        pronunciation_focus_en: [
          "ren-CHA-na BIS-nis KA-mi SOO-dah LE-bih JE-las - `rencana bisnis` = business plan; `lebih jelas` = clearer.",
          "VN-speaker trap: saying English-mix `plan bisnis`. In writing/pitches, use `rencana bisnis`.",
          "Drill: `Rencana bisnis sudah jelas.`",
        ],
      },
      {
        en: "Kami perlu validasi pasar sebelum menambah tim.",
        vi: "Chúng tôi cần kiểm chứng thị trường trước khi tăng thêm đội ngũ.",
        pronunciation_focus: [
          "KA-mi per-LU va-li-DA-si PA-sar se-BE-lum me-NAM-bah tim - `validasi pasar` = kiểm chứng thị trường; `menambah tim` = tăng thêm đội ngũ.",
          "Lỗi người Việt: dịch `market` thành `market` trong câu Indonesia. Thuật ngữ đúng là `pasar`.",
          "Luyện: `Kami perlu validasi pasar.`",
        ],
        pronunciation_focus_en: [
          "KA-mi per-LOO va-li-DA-see PA-sar se-BE-lum me-NAM-bah tim - `validasi pasar` = market validation; `menambah tim` = add to the team.",
          "VN-speaker trap: leaving English `market` in an Indonesian sentence. The Indonesian term is `pasar`.",
          "Drill: `Kami perlu validasi pasar.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `startup` thường gắn với công nghệ, app, fintech, marketplace hoặc dịch vụ online; còn `usaha kecil` có thể là kinh doanh gia đình, warung, bán hàng online hoặc dịch vụ địa phương. Khi nói với nhà đầu tư, người ta hay nhấn mạnh `pelanggan`, `omzet`, `modal awal`, `rencana bisnis`, và `validasi pasar`. Trong nói hằng ngày, nhiều từ mượn như startup, investor, pitch, dan online được dùng rất tự nhiên.",
    cultural_notes_en:
      "In Indonesia, `startup` often suggests tech, apps, fintech, marketplaces, or online services; `usaha kecil` can mean a family business, warung, online shop, or local service. When speaking with investors, people often emphasize `pelanggan`, `omzet`, `modal awal`, `rencana bisnis`, and `validasi pasar`. In daily speech, loanwords like startup, investor, pitch, and online are very natural.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `omzet` (doanh thu) và `untung` (lợi nhuận), `modal` (vốn) và `investor` (nhà đầu tư). Khi trình bày ý tưởng, dùng khung ngắn: `Kami membantu ...`, `Pelanggan kami ...`, `Omzet kami ...`, `Kami mencari investor ...`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: distinguish `omzet` (revenue) from `untung` (profit), and `modal` (capital) from `investor` (investor). For pitching, use short frames: `Kami membantu ...`, `Pelanggan kami ...`, `Omzet kami ...`, `Kami mencari investor ...`.",
    vocabulary: [
      {
        cell_id: "c44fe0d5-82e1-4d08-814c-fbf43ae0d48f",
        word: "startup",
        en: "startup",
        vi: "startup / công ty khởi nghiệp",
        pos: "noun",
        pronunciation_vi: "STAR-tap",
        pronunciation_en: "STAR-tup",
      },
      {
        cell_id: "0f998c49-be24-4554-8026-1293547e3c3a",
        word: "usaha kecil",
        en: "small business",
        vi: "kinh doanh nhỏ",
        pos: "noun phrase",
        pronunciation_vi: "u-SA-ha ke-CIL",
        pronunciation_en: "u-SA-ha ke-CHIL",
      },
      {
        cell_id: "45e202cf-af44-4f75-b59c-7d21dc17200e",
        word: "pelanggan",
        en: "customer",
        vi: "khách hàng",
        pos: "noun",
        pronunciation_vi: "pe-LANG-gan",
        pronunciation_en: "pe-LANG-gan",
      },
      {
        cell_id: "3369358f-355d-430d-ada4-500a7b9558de",
        word: "pemasaran online",
        en: "online marketing",
        vi: "tiếp thị online",
        pos: "noun phrase",
        pronunciation_vi: "pe-ma-SA-ran ON-lain",
        pronunciation_en: "pe-ma-SA-ran ON-line",
      },
      {
        cell_id: "f0693b66-96c3-47e8-8fe8-89c06d4583a6",
        word: "modal awal",
        en: "initial capital",
        vi: "vốn ban đầu",
        pos: "noun phrase",
        pronunciation_vi: "MO-dal A-wal",
        pronunciation_en: "MO-dal A-wal",
      },
      {
        cell_id: "4f397d72-6580-4dec-9376-ee6f2d1f879a",
        word: "omzet",
        en: "revenue / turnover",
        vi: "doanh thu",
        pos: "noun",
        pronunciation_vi: "OM-zet",
        pronunciation_en: "OM-zet",
      },
      {
        cell_id: "3ff126e5-a42a-419b-a66e-2b102e53c233",
        word: "investor",
        en: "investor",
        vi: "nhà đầu tư",
        pos: "noun",
        pronunciation_vi: "in-VES-tor",
        pronunciation_en: "in-VES-tor",
      },
      {
        cell_id: "4881030a-767d-4222-b6b3-5806cefec292",
        word: "rencana bisnis",
        en: "business plan",
        vi: "kế hoạch kinh doanh",
        pos: "noun phrase",
        pronunciation_vi: "ren-CA-na BIS-nis",
        pronunciation_en: "ren-CHA-na BIS-nis",
      },
      {
        cell_id: "14a736c3-337f-49e7-a9ee-94a6a83f6551",
        word: "validasi pasar",
        en: "market validation",
        vi: "kiểm chứng thị trường",
        pos: "noun phrase",
        pronunciation_vi: "va-li-DA-si PA-sar",
        pronunciation_en: "va-li-DA-see PA-sar",
      },
    ],
    dialogue: [
      {
        cell_id: "8c510f48-a0d9-483c-ac32-832e48349faa",
        speaker: "Pendiri",
        text: "Kami sedang membangun startup kecil untuk membantu warung lokal.",
        vi: "Chúng tôi đang xây dựng một startup nhỏ để giúp các warung địa phương.",
        en: "We are building a small startup to help local warung.",
      },
      {
        cell_id: "a5cf3a68-78a5-49d9-b8f1-0e1cf371ad7e",
        speaker: "Investor",
        text: "Siapa pelanggan utama kalian?",
        vi: "Khách hàng chính của các bạn là ai?",
        en: "Who are your main customers?",
      },
      {
        cell_id: "fd86a4a1-ed4c-4aca-b23e-d4dc8067f9c9",
        speaker: "Pendiri",
        text: "Pelanggan kami pemilik usaha kecil. Pemasaran online kami lewat Instagram dan TikTok.",
        vi: "Khách hàng của chúng tôi là chủ kinh doanh nhỏ. Tiếp thị online của chúng tôi qua Instagram và TikTok.",
        en: "Our customers are small-business owners. Our online marketing is through Instagram and TikTok.",
      },
      {
        cell_id: "2b1686b1-2091-4220-b9b0-55baac07beaa",
        speaker: "Investor",
        text: "Bagaimana omzet dan rencana bisnisnya?",
        vi: "Doanh thu và kế hoạch kinh doanh thế nào?",
        en: "How are the revenue and business plan?",
      },
      {
        cell_id: "7d0eecc9-df2e-4fc5-8647-744d006d02cc",
        speaker: "Pendiri",
        text: "Omzet bulan ini naik, dan kami sedang mencari investor untuk tahap berikutnya.",
        vi: "Doanh thu tháng này tăng, và chúng tôi đang tìm nhà đầu tư cho giai đoạn tiếp theo.",
        en: "Revenue is up this month, and we are looking for investors for the next stage.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `___ bulan ini naik dua puluh persen.`",
        prompt_en: "Fill in the blank: `___ bulan ini naik dua puluh persen.`",
        answer: "Omzet",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Chúng tôi đang tìm nhà đầu tư.",
        prompt_en: "Translate into Indonesian: We are looking for investors.",
        answer: "Kami sedang mencari investor.",
      },
      {
        type: "matching",
        prompt_vi: "Nối nghĩa đúng.",
        prompt_en: "Match the meanings.",
        pairs: [
          ["usaha kecil", "kinh doanh nhỏ"],
          ["pelanggan", "khách hàng"],
          ["modal awal", "vốn ban đầu"],
          ["omzet", "doanh thu"],
          ["rencana bisnis", "kế hoạch kinh doanh"],
        ],
      },
    ],
  },
];
