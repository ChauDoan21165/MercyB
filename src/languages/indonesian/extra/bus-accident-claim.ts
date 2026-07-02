// Bus accident and insurance claim Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It mirrors sibling Indonesian `extra/*`
// files: target-language text is stored in `en`, Vietnamese glosses in `vi`,
// Vietnamese-facing L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.
//
// Register note: bus accident Indonesian should be factual and evidence-focused:
// `kecelakaan bus`, `luka ringan`, `sopir`, `penumpang`, `klaim asuransi`,
// `laporan polisi`, `rumah sakit`, and `saksi`.

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
    id: "indonesian_bus_accident_claim",
    level: "B1",
    category: "transport",
    title_vi: "Tai nạn xe buýt và yêu cầu bảo hiểm",
    title_en: "Bus accidents and insurance claims",
    sentences: [
      {
        en: "Saya mengalami kecelakaan bus di jalan tol.",
        vi: "Tôi gặp tai nạn xe buýt trên đường cao tốc.",
        pronunciation_focus: [
          "SA-ya me-nga-LA-mi ke-ce-la-KA-an bus di JA-lan tol - `mengalami kecelakaan` = gặp/trải qua tai nạn; `bus` = xe buýt/xe khách.",
          "Lỗi người Việt: nói `kena kecelakaan` nghe khẩu ngữ. Với báo cáo/bảo hiểm, dùng `mengalami kecelakaan`.",
          "Luyện: `Saya mengalami kecelakaan bus.`",
        ],
        pronunciation_focus_en: [
          "SA-ya meh-nga-LA-mee keh-cheh-la-KA-an bus dee JA-lan tol - `mengalami kecelakaan` = experience an accident; `bus` = bus/coach.",
          "VN-speaker trap: `kena kecelakaan` sounds casual. For reports/insurance, use `mengalami kecelakaan`.",
          "Drill: `Saya mengalami kecelakaan bus.`",
        ],
      },
      {
        en: "Saya hanya luka ringan, tetapi kepala saya pusing.",
        vi: "Tôi chỉ bị thương nhẹ, nhưng đầu tôi chóng mặt.",
        pronunciation_focus: [
          "SA-ya HA-nya LU-ka RI-ngan, te-TA-pi ke-PA-la SA-ya PU-sing - `luka ringan` = vết thương nhẹ; `pusing` = chóng mặt.",
          "Lỗi người Việt: dùng `sakit kecil` cho thương nhẹ. Cụm y tế tự nhiên là `luka ringan`.",
          "Luyện: `Saya hanya luka ringan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya HA-nya LOO-ka REE-ngan, teh-TA-pee keh-PA-la SA-ya POO-sing - `luka ringan` = minor injury; `pusing` = dizzy.",
          "VN-speaker trap: saying `sakit kecil` for minor injury. Natural medical phrasing is `luka ringan`.",
          "Drill: `Saya hanya luka ringan.`",
        ],
      },
      {
        en: "Sopir bus sudah menghubungi polisi.",
        vi: "Tài xế xe buýt đã liên hệ với cảnh sát.",
        pronunciation_focus: [
          "SO-pir bus SU-dah meng-hu-BUNG-i po-LI-si - `sopir` = tài xế; `menghubungi polisi` = liên hệ cảnh sát.",
          "Lỗi người Việt: lẫn `sopir` với `driver`. Tiếng Indonesia hằng ngày dùng `sopir`.",
          "Luyện: `Sopir menghubungi polisi.`",
        ],
        pronunciation_focus_en: [
          "SO-peer bus SOO-dah meng-hoo-BOONG-ee po-LEE-see - `sopir` = driver; `menghubungi polisi` = contact the police.",
          "VN-speaker trap: inserting English `driver`. Everyday Indonesian uses `sopir`.",
          "Drill: `Sopir menghubungi polisi.`",
        ],
      },
      {
        en: "Ada beberapa penumpang yang perlu dibawa ke rumah sakit.",
        vi: "Có vài hành khách cần được đưa đến bệnh viện.",
        pronunciation_focus: [
          "A-da be-be-RA-pa pe-NUM-pang yang PER-lu di-BA-wa ke RU-mah SA-kit - `penumpang` = hành khách; `dibawa ke rumah sakit` = được đưa đến bệnh viện.",
          "Lỗi người Việt: vị trí tĩnh là `di rumah sakit`, nhưng chuyển động đến bệnh viện là `ke rumah sakit`.",
          "Luyện: `Dibawa ke rumah sakit.`",
        ],
        pronunciation_focus_en: [
          "A-da beh-beh-RA-pa peh-NOOM-pang yang PER-loo dee-BA-wa keh ROO-mah SA-kit - `penumpang` = passenger; `dibawa ke rumah sakit` = taken to hospital.",
          "VN-speaker trap: static location is `di rumah sakit`, but movement to hospital is `ke rumah sakit`.",
          "Drill: `Dibawa ke rumah sakit.`",
        ],
      },
      {
        en: "Saya perlu laporan polisi untuk klaim asuransi.",
        vi: "Tôi cần báo cáo của cảnh sát để làm yêu cầu bảo hiểm.",
        pronunciation_focus: [
          "SA-ya PER-lu la-PO-ran po-LI-si UN-tuk klaim a-su-RAN-si - `laporan polisi` = báo cáo/biên bản cảnh sát; `klaim asuransi` = yêu cầu bảo hiểm.",
          "Lỗi người Việt: `melapor polisi` là hành động trình báo; giấy tờ là `laporan polisi`.",
          "Luyện: `Perlu laporan polisi untuk klaim.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PER-loo la-PO-ran po-LEE-see OON-took claim a-soo-RAN-see - `laporan polisi` = police report; `klaim asuransi` = insurance claim.",
          "VN-speaker trap: `melapor polisi` is the act of reporting; the document is `laporan polisi`.",
          "Drill: `Perlu laporan polisi untuk klaim.`",
        ],
      },
      {
        en: "Bagaimana cara mengajukan klaim asuransi penumpang?",
        vi: "Cách nộp yêu cầu bảo hiểm hành khách như thế nào?",
        pronunciation_focus: [
          "ba-gai-MA-na CA-ra me-nga-JU-kan klaim a-su-RAN-si pe-NUM-pang - `mengajukan klaim` = nộp yêu cầu bồi thường.",
          "Lỗi người Việt: nói `minta asuransi` thiếu chính thức. Trong hồ sơ dùng `mengajukan klaim`.",
          "Luyện: `Mengajukan klaim asuransi.`",
        ],
        pronunciation_focus_en: [
          "ba-gai-MA-na CHA-ra meh-nga-JOO-kan claim a-soo-RAN-see peh-NOOM-pang - `mengajukan klaim` = file a claim.",
          "VN-speaker trap: `minta asuransi` sounds unofficial. Paperwork uses `mengajukan klaim`.",
          "Drill: `Mengajukan klaim asuransi.`",
        ],
      },
      {
        en: "Apakah ada saksi yang melihat kecelakaan itu?",
        vi: "Có nhân chứng nào nhìn thấy tai nạn đó không?",
        pronunciation_focus: [
          "a-PA-kah A-da SAK-si yang me-LI-hat ke-ce-la-KA-an I-tu - `saksi` = nhân chứng; `melihat` = nhìn thấy.",
          "Lỗi người Việt: dùng `orang lihat` trong báo cáo. Từ chính xác là `saksi`.",
          "Luyện: `Ada saksi?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah A-da SAK-see yang meh-LEE-hat keh-cheh-la-KA-an EE-too - `saksi` = witness; `melihat` = saw.",
          "VN-speaker trap: saying `orang lihat` in reports. The precise word is `saksi`.",
          "Drill: `Ada saksi?`",
        ],
      },
      {
        en: "Saya mencatat nomor bus dan nama perusahaan bus.",
        vi: "Tôi ghi lại số xe buýt và tên công ty xe.",
        pronunciation_focus: [
          "SA-ya men-CA-tat NO-mor bus dan NA-ma per-u-sa-HA-an bus - `mencatat` = ghi lại; `perusahaan bus` = công ty xe buýt/xe khách.",
          "Lỗi người Việt: dùng `menulis` chung chung. Khi ghi thông tin để làm bằng chứng, `mencatat` tự nhiên hơn.",
          "Luyện: `Mencatat nomor bus.`",
        ],
        pronunciation_focus_en: [
          "SA-ya men-CHA-tat NO-mor bus dan NA-ma per-oo-sa-HA-an bus - `mencatat` = record/write down; `perusahaan bus` = bus company.",
          "VN-speaker note: `menulis` is broad. For recording evidence details, `mencatat` is more natural.",
          "Drill: `Mencatat nomor bus.`",
        ],
      },
      {
        en: "Tolong simpan bukti biaya rumah sakit.",
        vi: "Vui lòng giữ bằng chứng chi phí bệnh viện.",
        pronunciation_focus: [
          "TO-long SIM-pan BUK-ti BI-a-ya RU-mah SA-kit - `bukti biaya` = bằng chứng chi phí; `simpan` = giữ/lưu.",
          "Lỗi người Việt: chỉ nói `foto uang`. Với hồ sơ, nói rõ `bukti biaya` hoặc `kuitansi`.",
          "Luyện: `Simpan bukti biaya.`",
        ],
        pronunciation_focus_en: [
          "TO-long SIM-pan BOOK-tee BEE-a-ya ROO-mah SA-kit - `bukti biaya` = proof of costs; `simpan` = keep/save.",
          "VN-speaker trap: saying only `foto uang`. For paperwork, use `bukti biaya` or `kuitansi`.",
          "Drill: `Simpan bukti biaya.`",
        ],
      },
      {
        en: "Kronologi kecelakaan harus ditulis dengan jelas.",
        vi: "Diễn biến tai nạn phải được viết rõ ràng.",
        pronunciation_focus: [
          "kro-no-lo-GI ke-ce-la-KA-an HA-rus di-TU-lis de-NGAN JE-las - `kronologi` = trình tự diễn biến; `ditulis` = được viết.",
          "Lỗi người Việt: kể lộn xộn làm hồ sơ khó xử lý. Với `kronologi`, kể theo thứ tự waktu.",
          "Luyện: `Kronologi ditulis dengan jelas.`",
        ],
        pronunciation_focus_en: [
          "kro-no-lo-GEE keh-cheh-la-KA-an HA-roos dee-TOO-lis deh-NGAN JEH-las - `kronologi` = chronology; `ditulis` = written.",
          "VN-speaker note: a scattered story makes claims harder. For `kronologi`, tell events in time order.",
          "Drill: `Kronologi ditulis dengan jelas.`",
        ],
      },
      {
        en: "Saya belum mau menandatangani dokumen sebelum membaca isinya.",
        vi: "Tôi chưa muốn ký giấy tờ trước khi đọc nội dung.",
        pronunciation_focus: [
          "SA-ya be-LUM MAU me-nan-da-ta-NGA-ni do-ku-MEN se-BE-lum mem-BA-ca I-si-nya - `menandatangani` = ký; `isinya` = nội dung của nó.",
          "Lỗi người Việt: nói `tulis nama` cho ký tên. Văn bản pháp lý dùng `menandatangani`.",
          "Luyện: `Belum mau menandatangani dokumen.`",
        ],
        pronunciation_focus_en: [
          "SA-ya beh-LOOM MAU meh-nan-da-ta-NGA-nee do-koo-MEN seh-BEH-loom mem-BA-cha EE-see-nya - `menandatangani` = sign; `isinya` = its contents.",
          "VN-speaker trap: saying `tulis nama` for signing. Legal paperwork uses `menandatangani`.",
          "Drill: `Belum mau menandatangani dokumen.`",
        ],
      },
      {
        en: "Kalau kondisi saya memburuk, saya akan kembali ke rumah sakit.",
        vi: "Nếu tình trạng của tôi xấu đi, tôi sẽ quay lại bệnh viện.",
        pronunciation_focus: [
          "KA-lau kon-DI-si SA-ya mem-BU-ruk, SA-ya A-kan kem-BA-li ke RU-mah SA-kit - `kondisi memburuk` = tình trạng xấu đi.",
          "Lỗi người Việt: nói `sakit naik` không tự nhiên. Dùng `kondisi memburuk` hoặc `gejala memburuk`.",
          "Luyện: `Kondisi saya memburuk.`",
        ],
        pronunciation_focus_en: [
          "KA-lau kon-DEE-see SA-ya mem-BOO-rook, SA-ya A-kan kem-BA-lee keh ROO-mah SA-kit - `kondisi memburuk` = condition worsens.",
          "VN-speaker trap: `sakit naik` is not natural. Use `kondisi memburuk` or `gejala memburuk`.",
          "Drill: `Kondisi saya memburuk.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Sau tai nạn xe buýt ở Indonesia, nên ưu tiên an toàn và khám y tế trước, sau đó ghi lại nomor bus, nama perusahaan bus, kronologi, saksi, foto lokasi nếu an toàn, laporan polisi, và bukti biaya rumah sakit. Khi làm klaim asuransi, hãy dùng ngôn ngữ trung lập và dựa trên bằng chứng; bài này dạy ngôn ngữ, không phải tư vấn pháp lý hoặc bảo hiểm.",
    cultural_notes_en:
      "After a bus accident in Indonesia, prioritize safety and medical care first, then record the bus number, bus company name, chronology, witnesses, location photos if safe, police report, and hospital cost proof. When filing an insurance claim, use neutral evidence-based language; this lesson teaches language, not legal or insurance advice.",
    tip_advice_vi:
      "Mẹo cho người Việt: dùng `mengalami kecelakaan` cho báo cáo chính thức, `luka ringan` cho thương nhẹ, `mengajukan klaim` cho nộp yêu cầu bảo hiểm, và `laporan polisi` cho giấy/báo cáo từ cảnh sát.",
    tip_advice_en:
      "Tip for Vietnamese speakers: use `mengalami kecelakaan` for formal accident reports, `luka ringan` for minor injury, `mengajukan klaim` for filing a claim, and `laporan polisi` for the police report document.",
    vocabulary: [
      {
        word: "kecelakaan bus",
        en: "bus accident",
        vi: "tai nạn xe buýt/xe khách",
        pos: "noun phrase",
        pronunciation_vi: "ke-ce-la-KA-an bus",
        pronunciation_en: "keh-cheh-la-KA-an bus",
      },
      {
        word: "luka ringan",
        en: "minor injury",
        vi: "vết thương nhẹ",
        pos: "noun phrase",
        pronunciation_vi: "LU-ka RI-ngan",
        pronunciation_en: "LOO-ka REE-ngan",
      },
      {
        word: "sopir",
        en: "driver",
        vi: "tài xế",
        pos: "noun",
        pronunciation_vi: "SO-pir",
        pronunciation_en: "SO-peer",
      },
      {
        word: "penumpang",
        en: "passenger",
        vi: "hành khách",
        pos: "noun",
        pronunciation_vi: "pe-NUM-pang",
        pronunciation_en: "peh-NOOM-pang",
      },
      {
        word: "klaim asuransi",
        en: "insurance claim",
        vi: "yêu cầu bảo hiểm",
        pos: "noun phrase",
        pronunciation_vi: "klaim a-su-RAN-si",
        pronunciation_en: "claim a-soo-RAN-see",
      },
      {
        word: "laporan polisi",
        en: "police report",
        vi: "báo cáo/biên bản cảnh sát",
        pos: "noun phrase",
        pronunciation_vi: "la-PO-ran po-LI-si",
        pronunciation_en: "la-PO-ran po-LEE-see",
      },
      {
        word: "rumah sakit",
        en: "hospital",
        vi: "bệnh viện",
        pos: "noun",
        pronunciation_vi: "RU-mah SA-kit",
        pronunciation_en: "ROO-mah SA-kit",
      },
      {
        word: "saksi",
        en: "witness",
        vi: "nhân chứng",
        pos: "noun",
        pronunciation_vi: "SAK-si",
        pronunciation_en: "SAK-see",
      },
      {
        word: "kronologi",
        en: "chronology",
        vi: "diễn biến theo trình tự",
        pos: "noun",
        pronunciation_vi: "kro-no-lo-GI",
        pronunciation_en: "kro-no-lo-GEE",
      },
      {
        word: "bukti biaya",
        en: "proof of costs",
        vi: "bằng chứng chi phí",
        pos: "noun phrase",
        pronunciation_vi: "BUK-ti BI-a-ya",
        pronunciation_en: "BOOK-tee BEE-a-ya",
      },
    ],
    dialogue: [
      {
        speaker: "Penumpang",
        text: "Saya mengalami kecelakaan bus. Saya luka ringan, tetapi kepala saya pusing.",
        vi: "Tôi gặp tai nạn xe buýt. Tôi bị thương nhẹ, nhưng đầu tôi chóng mặt.",
        en: "I was in a bus accident. I have a minor injury, but my head is dizzy.",
      },
      {
        speaker: "Petugas",
        text: "Baik, Bapak perlu diperiksa di rumah sakit. Apakah ada saksi?",
        vi: "Được, anh cần được kiểm tra ở bệnh viện. Có nhân chứng không?",
        en: "All right, sir, you need to be checked at the hospital. Are there any witnesses?",
      },
      {
        speaker: "Penumpang",
        text: "Ada. Saya juga mencatat nomor bus dan nama perusahaan bus.",
        vi: "Có. Tôi cũng đã ghi lại số xe và tên công ty xe.",
        en: "Yes. I also recorded the bus number and the bus company name.",
      },
      {
        speaker: "Petugas",
        text: "Simpan bukti biaya rumah sakit dan minta laporan polisi untuk klaim asuransi.",
        vi: "Hãy giữ bằng chứng chi phí bệnh viện và xin báo cáo cảnh sát để làm yêu cầu bảo hiểm.",
        en: "Keep proof of hospital costs and request a police report for the insurance claim.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: “Tôi gặp tai nạn xe buýt.”",
        prompt_en: "Translate into Indonesian: “I was in a bus accident.”",
        answer: "Saya mengalami kecelakaan bus.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ còn thiếu: Saya perlu laporan polisi untuk klaim ____.",
        prompt_en: "Fill in the blank: Saya perlu laporan polisi untuk klaim ____.",
        answer: "asuransi",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cụm nào nghĩa là “thương nhẹ”?",
        prompt_en: "Which phrase means “minor injury”?",
        choices: ["luka ringan", "saksi ringan", "bus ringan"],
        answer: "luka ringan",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `saksi` = ?",
        prompt_en: "Match the meaning: `saksi` = ?",
        answer: "witness",
      },
    ],
  },
];

export default lessons;
