// Police Report for Lost Items Indonesian (Vietnamese -> Indonesian study track).
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
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type IndonesianDialogueLine = {
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
    id: "indonesian_police_report_lost_item",
    level: "A2",
    category: "legal",
    title_vi: "Trình báo mất đồ ở đồn cảnh sát",
    title_en: "Filing a police report for a lost item",
    sentences: [
      {
        en: "Saya kehilangan dompet di sekitar stasiun.",
        vi: "Tôi bị mất ví ở khu vực quanh nhà ga.",
        pronunciation_focus: [
          "SA-ya ke-hi-LANG-an DOM-pet di se-KI-tar sta-si-UN — `kehilangan` = bị mất/mất mát; `sekitar` = khu vực quanh.",
          "Lỗi người Việt: nói `saya hilang dompet`. Người bị mất đồ dùng `saya kehilangan dompet`; đồ bị mất là `dompet saya hilang`.",
          "Luyện: `Saya kehilangan dompet.`",
        ],
        pronunciation_focus_en: [
          "SA-ya ke-hi-LANG-an DOM-pet di se-KI-tar sta-see-OON — `kehilangan` = to lose/suffer a loss; `sekitar` = around the area.",
          "VN-speaker trap: saying `saya hilang dompet`. The person says `saya kehilangan dompet`; the item says `dompet saya hilang`.",
          "Drill: `Saya kehilangan dompet.`",
        ],
      },
      {
        en: "Saya ingin membuat laporan polisi.",
        vi: "Tôi muốn làm trình báo với cảnh sát.",
        pronunciation_focus: [
          "SA-ya ING-in mem-BU-at la-PO-ran po-LI-si — `membuat laporan polisi` = làm báo cáo/trình báo với cảnh sát.",
          "Lỗi người Việt: dùng `lapor polisi` cho mọi ngữ cảnh. Ở quầy, câu đầy đủ lịch sự là `membuat laporan polisi`.",
          "Luyện: `Saya ingin membuat laporan polisi.`",
        ],
        pronunciation_focus_en: [
          "SA-ya ING-in mem-BOO-at la-PO-ran po-LEE-see — `membuat laporan polisi` = file a police report.",
          "VN-speaker trap: using `lapor polisi` for every context. At the desk, the polite full phrase is `membuat laporan polisi`.",
          "Drill: `Saya ingin membuat laporan polisi.`",
        ],
      },
      {
        en: "Di dalam dompet ada KTP, kartu bank, dan uang tunai.",
        vi: "Trong ví có KTP, thẻ ngân hàng và tiền mặt.",
        pronunciation_focus: [
          "di DA-lam DOM-pet A-da KA-TE-PE, KAR-tu bank, dan U-ang TU-nai — `di dalam` = ở bên trong; `uang tunai` = tiền mặt.",
          "Lỗi người Việt: đọc `KTP` như một từ. Người Indonesia đánh vần từng chữ: `ka-te-pe`.",
          "Luyện: `Di dalam dompet ada KTP dan kartu bank.`",
        ],
        pronunciation_focus_en: [
          "di DA-lam DOM-pet A-da KA-TE-PE, KAR-tu bank, dan OO-ang TOO-nai — `di dalam` = inside; `uang tunai` = cash.",
          "VN-speaker trap: reading `KTP` as one word. Indonesians spell it letter by letter: `ka-te-pe`.",
          "Drill: `Di dalam dompet ada KTP dan kartu bank.`",
        ],
      },
      {
        en: "Saya perlu surat kehilangan untuk mengurus dokumen baru.",
        vi: "Tôi cần giấy xác nhận mất đồ để làm lại giấy tờ mới.",
        pronunciation_focus: [
          "SA-ya per-LU SU-rat ke-hi-LANG-an UN-tuk me-NGU-rus do-ku-MEN BA-ru — `surat kehilangan` = giấy xác nhận mất; `mengurus` = xử lý/làm thủ tục.",
          "Lỗi người Việt: dịch `giấy mất đồ` từng chữ. Cụm hành chính đúng là `surat kehilangan`.",
          "Luyện: `Saya perlu surat kehilangan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LOO SOO-rat ke-hi-LANG-an UN-tuk me-NGOO-roos do-ku-MEN BA-roo — `surat kehilangan` = loss certificate; `mengurus` = handle paperwork.",
          "VN-speaker trap: translating 'lost-item paper' word for word. The administrative phrase is `surat kehilangan`.",
          "Drill: `Saya perlu surat kehilangan.`",
        ],
      },
      {
        en: "Kronologinya begini: saya turun dari ojek, lalu dompet sudah tidak ada.",
        vi: "Diễn biến là như thế này: tôi xuống khỏi xe ôm, rồi ví đã không còn nữa.",
        pronunciation_focus: [
          "kro-no-lo-GI-nya be-GI-ni — `kronologi` = diễn biến/sự việc theo thứ tự; `begini` = như thế này.",
          "Lỗi người Việt: kể nhảy thời gian. Khi cảnh sát hỏi, mở bằng `kronologinya begini` rồi kể từng bước.",
          "Luyện: `Kronologinya begini.`",
        ],
        pronunciation_focus_en: [
          "kro-no-lo-GEE-nya be-GEE-ni — `kronologi` = chronological account; `begini` = like this.",
          "VN-speaker trap: telling the story out of order. When police ask, start with `kronologinya begini` and give steps.",
          "Drill: `Kronologinya begini.`",
        ],
      },
      {
        en: "Kejadiannya tadi malam sekitar jam delapan.",
        vi: "Sự việc xảy ra tối qua khoảng tám giờ.",
        pronunciation_focus: [
          "ke-JA-di-an-nya TA-di MA-lam se-KI-tar jam de-la-PAN — `kejadian` = sự việc/vụ việc; `tadi malam` = tối qua/vừa tối hôm qua.",
          "Lỗi người Việt: dùng `kemarin malam` cho mọi 'tối qua'. Nếu vừa xảy ra tối qua, `tadi malam` rất tự nhiên.",
          "Luyện: `Kejadiannya tadi malam sekitar jam delapan.`",
        ],
        pronunciation_focus_en: [
          "ke-JA-di-an-nya TA-di MA-lam se-KI-tar jam de-la-PAN — `kejadian` = incident; `tadi malam` = last night/recently last night.",
          "VN-speaker trap: always using `kemarin malam` for 'last night'. For a recent last night, `tadi malam` is very natural.",
          "Drill: `Kejadiannya tadi malam sekitar jam delapan.`",
        ],
      },
      {
        en: "Apakah saya bisa mendapatkan nomor laporan?",
        vi: "Tôi có thể nhận số báo cáo/số trình báo không ạ?",
        pronunciation_focus: [
          "A-pa-kah SA-ya BI-sa men-da-PAT-kan NO-mor la-PO-ran — `nomor laporan` = số báo cáo/số hồ sơ; `mendapatkan` = nhận được.",
          "Lỗi người Việt: chỉ xin giấy mà quên số hồ sơ. Hỏi `nomor laporan` để theo dõi hoặc nộp cho ngân hàng/đại sứ quán.",
          "Luyện: `Apakah saya bisa mendapatkan nomor laporan?`",
        ],
        pronunciation_focus_en: [
          "A-pa-kah SA-ya BEE-sa men-da-PAT-kan NO-mor la-PO-ran — `nomor laporan` = report/reference number; `mendapatkan` = obtain.",
          "VN-speaker trap: asking only for the paper and forgetting the reference number. Ask for `nomor laporan` for follow-up or bank/embassy use.",
          "Drill: `Apakah saya bisa mendapatkan nomor laporan?`",
        ],
      },
      {
        en: "Tolong hubungi saya kalau barangnya ditemukan.",
        vi: "Làm ơn liên hệ tôi nếu đồ được tìm thấy.",
        pronunciation_focus: [
          "TO-long hu-BUNG-i SA-ya KA-lau BA-rang-nya di-te-MU-kan — `hubungi` = liên hệ; `ditemukan` = được tìm thấy.",
          "Lỗi người Việt: dùng chủ động `menemukan` khi chưa biết ai tìm. Với đồ được tìm thấy, dùng bị động `ditemukan`.",
          "Luyện: `Kalau barangnya ditemukan, tolong hubungi saya.`",
        ],
        pronunciation_focus_en: [
          "TO-long hoo-BOONG-i SA-ya KA-lau BA-rang-nya di-te-MOO-kan — `hubungi` = contact; `ditemukan` = found/be found.",
          "VN-speaker trap: using active `menemukan` when the finder is unknown. For an item being found, use passive `ditemukan`.",
          "Drill: `Kalau barangnya ditemukan, tolong hubungi saya.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, khi mất ví, KTP, hộ chiếu, thẻ ngân hàng hoặc giấy tờ quan trọng, bạn thường cần `surat kehilangan` từ `Polsek` hoặc `Polres` để làm lại giấy tờ, khóa/thay thẻ, hoặc trình cho cơ quan liên quan. Khi trình báo, cảnh sát thường hỏi danh tính, địa điểm, thời gian, đồ bị mất và `kronologi` theo thứ tự. Nên mang bản sao hộ chiếu/KITAS nếu không có KTP.",
    cultural_notes_en:
      "In Indonesia, when a wallet, KTP, passport, bank card, or important document is lost, you often need a `surat kehilangan` from the local `Polsek` or `Polres` to replace documents, block/replace cards, or show another office. Police usually ask for identity, place, time, lost items, and the `kronologi` in order. Bring passport/KITAS copies if you do not have a KTP.",
    tip_advice_vi:
      "Mẹo cho người Việt: nhớ cặp `hilang` và `kehilangan`. `Dompet saya hilang` = ví của tôi mất; `Saya kehilangan dompet` = tôi bị mất ví. Trong văn phòng/cảnh sát, dùng `saya`, `Pak/Bu`, `tolong`, và các cụm đầy đủ như `membuat laporan polisi`, `surat kehilangan`, `nomor laporan`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: remember the pair `hilang` and `kehilangan`. `Dompet saya hilang` = my wallet is lost; `Saya kehilangan dompet` = I lost my wallet. In police/office settings, use `saya`, `Pak/Bu`, `tolong`, and full phrases like `membuat laporan polisi`, `surat kehilangan`, `nomor laporan`.",
    vocabulary: [
      {
        word: "kehilangan barang",
        en: "lost item / losing an item",
        vi: "mất đồ",
        pos: "noun phrase",
        pronunciation_vi: "ke-hi-LANG-an BA-rang",
        pronunciation_en: "ke-hi-LANG-an BA-rang",
      },
      {
        word: "laporan polisi",
        en: "police report",
        vi: "trình báo/báo cáo cảnh sát",
        pos: "noun phrase",
        pronunciation_vi: "la-PO-ran po-LI-si",
        pronunciation_en: "la-PO-ran po-LEE-see",
      },
      {
        word: "KTP",
        en: "Indonesian ID card",
        vi: "thẻ căn cước Indonesia",
        pos: "noun",
        pronunciation_vi: "ka-te-pe",
        pronunciation_en: "ka-te-peh",
      },
      {
        word: "dompet",
        en: "wallet",
        vi: "ví",
        pos: "noun",
        pronunciation_vi: "DOM-pet",
        pronunciation_en: "DOM-pet",
      },
      {
        word: "surat kehilangan",
        en: "loss certificate / lost-item letter",
        vi: "giấy xác nhận mất đồ",
        pos: "noun phrase",
        pronunciation_vi: "SU-rat ke-hi-LANG-an",
        pronunciation_en: "SOO-rat ke-hi-LANG-an",
      },
      {
        word: "kronologi",
        en: "chronology / account of events",
        vi: "diễn biến sự việc",
        pos: "noun",
        pronunciation_vi: "kro-no-lo-GI",
        pronunciation_en: "kro-no-lo-GEE",
      },
      {
        word: "nomor laporan",
        en: "report number / reference number",
        vi: "số báo cáo / số hồ sơ",
        pos: "noun phrase",
        pronunciation_vi: "NO-mor la-PO-ran",
        pronunciation_en: "NO-mor la-PO-ran",
      },
      {
        word: "ditemukan",
        en: "found / be found",
        vi: "được tìm thấy",
        pos: "verb (passive)",
        pronunciation_vi: "di-te-MU-kan",
        pronunciation_en: "di-te-MOO-kan",
      },
    ],
    dialogue: [
      {
        speaker: "Pelapor",
        text: "Selamat pagi, Pak. Saya ingin membuat laporan kehilangan.",
        vi: "Chào buổi sáng anh. Tôi muốn làm trình báo mất đồ.",
        en: "Good morning, officer. I would like to file a lost-item report.",
      },
      {
        speaker: "Polisi",
        text: "Barang apa yang hilang?",
        vi: "Đồ gì bị mất?",
        en: "What item was lost?",
      },
      {
        speaker: "Pelapor",
        text: "Dompet saya hilang. Di dalamnya ada KTP dan kartu bank.",
        vi: "Ví của tôi bị mất. Bên trong có KTP và thẻ ngân hàng.",
        en: "My wallet is lost. Inside it are my KTP and bank card.",
      },
      {
        speaker: "Polisi",
        text: "Tolong jelaskan kronologinya pelan-pelan.",
        vi: "Làm ơn giải thích diễn biến từ từ.",
        en: "Please explain the chronology slowly.",
      },
      {
        speaker: "Pelapor",
        text: "Kejadiannya tadi malam sekitar jam delapan di dekat stasiun.",
        vi: "Sự việc xảy ra tối qua khoảng tám giờ gần nhà ga.",
        en: "It happened last night around eight near the station.",
      },
      {
        speaker: "Polisi",
        text: "Baik, nanti kami berikan surat kehilangan dan nomor laporan.",
        vi: "Được, lát nữa chúng tôi sẽ cấp giấy xác nhận mất đồ và số báo cáo.",
        en: "Okay, we will give you a loss certificate and report number later.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya ___ dompet di sekitar stasiun.`",
        prompt_en: "Fill in the blank: `Saya ___ dompet di sekitar stasiun.`",
        answer: "kehilangan",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi cần giấy xác nhận mất đồ.",
        prompt_en: "Translate into Indonesian: I need a loss certificate.",
        answer: "Saya perlu surat kehilangan.",
      },
      {
        type: "matching",
        prompt_vi: "Nối nghĩa đúng.",
        prompt_en: "Match the meanings.",
        pairs: [
          ["dompet", "ví"],
          ["KTP", "thẻ căn cước Indonesia"],
          ["surat kehilangan", "giấy xác nhận mất đồ"],
          ["kronologi", "diễn biến sự việc"],
          ["nomor laporan", "số báo cáo / số hồ sơ"],
        ],
      },
    ],
  },
];
