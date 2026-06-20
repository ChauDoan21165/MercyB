// Rental deposit dispute Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It mirrors sibling Indonesian `extra/*`
// files: target-language text is stored in `en`, Vietnamese glosses in `vi`,
// Vietnamese-facing L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.
//
// Register note: deposit disputes should stay calm, documented, and specific:
// `deposit sewa`, `kerusakan kamar`, `pengembalian uang`, `pemilik kos`,
// `bukti foto`, `perjanjian`, and `mediasi`.

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
    id: "indonesian_rental_deposit_dispute",
    level: "B1",
    category: "housing",
    title_vi: "Tranh chấp tiền cọc thuê phòng",
    title_en: "Rental deposit disputes",
    sentences: [
      {
        en: "Saya ingin menanyakan pengembalian deposit sewa.",
        vi: "Tôi muốn hỏi về việc hoàn lại tiền cọc thuê.",
        pronunciation_focus: [
          "SA-ya I-ngin me-na-NYA-kan pe-ngem-BA-li-an de-PO-sit SE-wa - `pengembalian` = việc hoàn lại; `deposit sewa` = tiền cọc thuê.",
          "Lỗi người Việt: chỉ nói `minta deposit` có thể nghe gắt. Mở bằng `menanyakan pengembalian deposit` mềm và rõ hơn.",
          "Luyện: `Pengembalian deposit sewa.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin meh-na-NYA-kan peh-ngem-BA-lee-an deh-PO-sit SEH-wa - `pengembalian` = return/refund; `deposit sewa` = rental deposit.",
          "VN-speaker trap: saying only `minta deposit` can sound abrupt. `Menanyakan pengembalian deposit` is softer and clearer.",
          "Drill: `Pengembalian deposit sewa.`",
        ],
      },
      {
        en: "Deposit saya belum dikembalikan sejak saya pindah keluar.",
        vi: "Tiền cọc của tôi chưa được trả lại từ khi tôi dọn ra.",
        pronunciation_focus: [
          "de-PO-sit SA-ya be-LUM di-kem-BA-li-kan se-JAK SA-ya PIN-dah KE-lu-ar - `dikembalikan` = được trả lại; `pindah keluar` = dọn ra.",
          "Lỗi người Việt: bỏ bị động `di-`. Khi tiền được trả lại, dùng `dikembalikan`, không phải `kembali deposit`.",
          "Luyện: `Deposit belum dikembalikan.`",
        ],
        pronunciation_focus_en: [
          "deh-PO-sit SA-ya be-LOOM dee-kem-BA-lee-kan seh-JAK SA-ya PIN-dah KEH-loo-ar - `dikembalikan` = returned; `pindah keluar` = move out.",
          "VN-speaker trap: dropping passive `di-`. For money being returned, use `dikembalikan`, not `kembali deposit`.",
          "Drill: `Deposit belum dikembalikan.`",
        ],
      },
      {
        en: "Pemilik kos mengatakan ada kerusakan kamar.",
        vi: "Chủ nhà trọ nói rằng có hư hại trong phòng.",
        pronunciation_focus: [
          "pe-MI-lik KOS me-nga-TA-kan A-da ke-ru-SA-kan KA-mar - `pemilik kos` = chủ nhà trọ; `kerusakan kamar` = hư hại phòng.",
          "Lỗi người Việt: dùng `rusak kamar`. Danh từ đúng cho thiệt hại là `kerusakan kamar`.",
          "Luyện: `Ada kerusakan kamar.`",
        ],
        pronunciation_focus_en: [
          "peh-MEE-lik KOS meh-nga-TA-kan A-da keh-roo-SA-kan KA-mar - `pemilik kos` = boarding-house owner; `kerusakan kamar` = room damage.",
          "VN-speaker trap: saying `rusak kamar`. The noun for damage is `kerusakan kamar`.",
          "Drill: `Ada kerusakan kamar.`",
        ],
      },
      {
        en: "Saya punya bukti foto sebelum dan sesudah menempati kamar.",
        vi: "Tôi có bằng chứng ảnh trước và sau khi ở trong phòng.",
        pronunciation_focus: [
          "SA-ya PU-nya BUK-ti FO-to se-BE-lum dan se-SU-dah me-nem-PA-ti KA-mar - `bukti foto` = bằng chứng ảnh; `menempati` = ở/sử dụng chỗ ở.",
          "Lỗi người Việt: nói `foto bukti` vẫn hiểu, nhưng cụm tự nhiên hơn là `bukti foto`.",
          "Luyện: `Saya punya bukti foto.`",
        ],
        pronunciation_focus_en: [
          "SA-ya POO-nya BOOK-tee FO-to seh-BEH-loom dan seh-SOO-dah meh-nem-PA-tee KA-mar - `bukti foto` = photo evidence; `menempati` = occupy.",
          "VN-speaker note: `foto bukti` may be understood, but `bukti foto` sounds more natural.",
          "Drill: `Saya punya bukti foto.`",
        ],
      },
      {
        en: "Di perjanjian tertulis, deposit dikembalikan setelah kamar dicek.",
        vi: "Trong thỏa thuận bằng văn bản, tiền cọc được trả lại sau khi phòng được kiểm tra.",
        pronunciation_focus: [
          "di per-JAN-ji-an ter-TU-lis, de-PO-sit di-kem-BA-li-kan se-TE-lah KA-mar di-CEK - `perjanjian tertulis` = thỏa thuận bằng văn bản.",
          "Lỗi người Việt: nói miệng dễ tranh cãi. Khi có giấy/tin nhắn, dùng `perjanjian tertulis`.",
          "Luyện: `Di perjanjian tertulis.`",
        ],
        pronunciation_focus_en: [
          "dee per-JAN-jee-an ter-TOO-lis, deh-PO-sit dee-kem-BA-lee-kan seh-TEH-lah KA-mar dee-CHEK - `perjanjian tertulis` = written agreement.",
          "VN-speaker note: verbal agreements are easy to dispute. If there is a document/message, say `perjanjian tertulis`.",
          "Drill: `Di perjanjian tertulis.`",
        ],
      },
      {
        en: "Bisa dijelaskan bagian mana yang dianggap rusak?",
        vi: "Có thể giải thích phần nào bị xem là hư hại không?",
        pronunciation_focus: [
          "BI-sa di-JE-las-kan BA-gi-an MA-na yang di-ANG-gap RU-sak - `dianggap rusak` = bị xem là hư hại.",
          "Lỗi người Việt: phản ứng `tidak rusak!` ngay có thể căng. Hỏi `bagian mana` để yêu cầu chi tiết.",
          "Luyện: `Bagian mana yang rusak?`",
        ],
        pronunciation_focus_en: [
          "BEE-sa dee-JEH-las-kan BA-gee-an MA-na yang dee-ANG-gap ROO-sak - `dianggap rusak` = considered damaged.",
          "VN-speaker trap: replying `tidak rusak!` immediately can escalate. Ask `bagian mana` to request specifics.",
          "Drill: `Bagian mana yang rusak?`",
        ],
      },
      {
        en: "Saya tidak setuju kalau seluruh deposit dipotong.",
        vi: "Tôi không đồng ý nếu toàn bộ tiền cọc bị trừ.",
        pronunciation_focus: [
          "SA-ya ti-DAK se-TU-ju KA-lau se-LU-ruh de-PO-sit di-PO-tong - `seluruh` = toàn bộ; `dipotong` = bị trừ.",
          "Lỗi người Việt: dùng `dipotong` không chỉ cho cắt vật lý; tiền bị trừ cũng là `dipotong`.",
          "Luyện: `Deposit dipotong.`",
        ],
        pronunciation_focus_en: [
          "SA-ya tee-DAK seh-TOO-joo KA-lau seh-LOO-rooh deh-PO-sit dee-PO-tong - `seluruh` = entire; `dipotong` = deducted.",
          "VN-speaker note: `dipotong` is not only physical cutting; money can be deducted with `dipotong`.",
          "Drill: `Deposit dipotong.`",
        ],
      },
      {
        en: "Mohon kirim rincian biaya perbaikan secara tertulis.",
        vi: "Xin gửi chi tiết chi phí sửa chữa bằng văn bản.",
        pronunciation_focus: [
          "MO-hon KI-rim rin-CI-an BI-a-ya per-BAI-kan se-CA-ra ter-TU-lis - `rincian biaya` = chi tiết chi phí; `perbaikan` = sửa chữa.",
          "Lỗi người Việt: chỉ hỏi `berapa?` chưa đủ. Trong tranh chấp, hỏi `rincian biaya` để có từng khoản.",
          "Luyện: `Kirim rincian biaya.`",
        ],
        pronunciation_focus_en: [
          "MO-hon KEE-rim rin-CHEE-an BEE-a-ya per-BAI-kan seh-CHA-ra ter-TOO-lis - `rincian biaya` = cost breakdown; `perbaikan` = repair.",
          "VN-speaker note: asking only `berapa?` is not enough. In disputes, ask for `rincian biaya` item by item.",
          "Drill: `Kirim rincian biaya.`",
        ],
      },
      {
        en: "Kapan pengembalian uang bisa diproses?",
        vi: "Khi nào việc hoàn tiền có thể được xử lý?",
        pronunciation_focus: [
          "KA-pan pe-ngem-BA-li-an U-ang BI-sa di-PRO-ses - `pengembalian uang` = hoàn tiền; `diproses` = được xử lý.",
          "Lỗi người Việt: `uang kembali` không phải cụm tốt cho refund. Dùng `pengembalian uang`.",
          "Luyện: `Pengembalian uang diproses.`",
        ],
        pronunciation_focus_en: [
          "KA-pan peh-ngem-BA-lee-an OO-ang BEE-sa dee-PRO-ses - `pengembalian uang` = money refund; `diproses` = processed.",
          "VN-speaker trap: `uang kembali` is not a good refund phrase. Use `pengembalian uang`.",
          "Drill: `Pengembalian uang diproses.`",
        ],
      },
      {
        en: "Kalau tidak ada kesepakatan, kita bisa minta mediasi.",
        vi: "Nếu không có thỏa thuận, chúng ta có thể nhờ hòa giải.",
        pronunciation_focus: [
          "KA-lau ti-DAK A-da ke-se-PA-kat-an, KI-ta BI-sa MIN-ta me-di-A-si - `kesepakatan` = thỏa thuận; `mediasi` = hòa giải.",
          "Lỗi người Việt: đe dọa quá sớm dễ làm căng. `Minta mediasi` là cách nói trung lập hơn để tìm giải pháp.",
          "Luyện: `Kita bisa minta mediasi.`",
        ],
        pronunciation_focus_en: [
          "KA-lau tee-DAK A-da keh-seh-PA-kat-an, KEE-ta BEE-sa MIN-ta meh-dee-A-see - `kesepakatan` = agreement; `mediasi` = mediation.",
          "VN-speaker note: threatening too early escalates. `Minta mediasi` is a neutral way to seek a solution.",
          "Drill: `Kita bisa minta mediasi.`",
        ],
      },
      {
        en: "Saya ingin menyelesaikan masalah ini baik-baik.",
        vi: "Tôi muốn giải quyết vấn đề này một cách êm đẹp.",
        pronunciation_focus: [
          "SA-ya I-ngin me-nye-le-SAI-kan ma-sa-LAH I-ni baik-BAIK - `menyelesaikan` = giải quyết; `baik-baik` = êm đẹp/tử tế.",
          "Lỗi người Việt: dùng câu quá trực diện như `Anda salah`. Câu `baik-baik` giữ giọng bình tĩnh.",
          "Luyện: `Menyelesaikan masalah baik-baik.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin meh-nyeh-leh-SAI-kan ma-sa-LAH EE-nee baik-BAIK - `menyelesaikan` = resolve; `baik-baik` = calmly/properly.",
          "VN-speaker trap: using blunt lines like `Anda salah`. `Baik-baik` keeps the tone calm.",
          "Drill: `Menyelesaikan masalah baik-baik.`",
        ],
      },
      {
        en: "Tolong konfirmasi jumlah deposit yang akan dikembalikan.",
        vi: "Vui lòng xác nhận số tiền cọc sẽ được trả lại.",
        pronunciation_focus: [
          "TO-long kon-fir-MA-si JUM-lah de-PO-sit yang A-kan di-kem-BA-li-kan - `jumlah deposit` = số tiền cọc.",
          "Lỗi người Việt: dùng `nomor deposit` cho số tiền. `Nomor` là mã/số định danh; số tiền là `jumlah`.",
          "Luyện: `Jumlah deposit yang dikembalikan.`",
        ],
        pronunciation_focus_en: [
          "TO-long kon-feer-MA-see JOOM-lah deh-PO-sit yang A-kan dee-kem-BA-lee-kan - `jumlah deposit` = deposit amount.",
          "VN-speaker trap: using `nomor deposit` for an amount. `Nomor` is an ID number; an amount is `jumlah`.",
          "Drill: `Jumlah deposit yang dikembalikan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong kos hoặc nhà thuê ở Indonesia, deposit/uang jaminan thường được giữ để bảo đảm tiền thuê và tình trạng phòng. Khi có tranh chấp, cách nói hiệu quả là bình tĩnh, hỏi căn cứ, yêu cầu rincian tertulis, dùng bukti foto, và nếu cần thì nhờ mediasi từ pihak kos, RT/RW, hoặc bên liên quan. Bài này dạy ngôn ngữ thực tế, không phải tư vấn pháp lý.",
    cultural_notes_en:
      "In Indonesian boarding houses or rentals, a deposit/uang jaminan is often held to cover rent obligations and room condition. In disputes, effective language stays calm, asks for the basis, requests written details, uses photo evidence, and if needed seeks mediation from the boarding-house side, RT/RW, or relevant parties. This lesson teaches practical language, not legal advice.",
    tip_advice_vi:
      "Khi tranh chấp tiền cọc, tránh câu buộc tội ngay. Dùng mẫu câu: `Bisa dijelaskan...?`, `Mohon kirim rincian...`, `Saya punya bukti foto...`, và `Saya ingin menyelesaikan masalah ini baik-baik`.",
    tip_advice_en:
      "In deposit disputes, avoid starting with accusations. Use frames like: `Bisa dijelaskan...?`, `Mohon kirim rincian...`, `Saya punya bukti foto...`, and `Saya ingin menyelesaikan masalah ini baik-baik`.",
    vocabulary: [
      {
        word: "deposit sewa",
        en: "rental deposit",
        vi: "tiền cọc thuê",
        pos: "noun phrase",
        pronunciation_vi: "de-PO-sit SE-wa",
        pronunciation_en: "deh-PO-sit SEH-wa",
      },
      {
        word: "kerusakan kamar",
        en: "room damage",
        vi: "hư hại phòng",
        pos: "noun phrase",
        pronunciation_vi: "ke-ru-SA-kan KA-mar",
        pronunciation_en: "keh-roo-SA-kan KA-mar",
      },
      {
        word: "pengembalian uang",
        en: "money refund",
        vi: "hoàn tiền",
        pos: "noun phrase",
        pronunciation_vi: "pe-ngem-BA-li-an U-ang",
        pronunciation_en: "peh-ngem-BA-lee-an OO-ang",
      },
      {
        word: "pemilik kos",
        en: "boarding-house owner",
        vi: "chủ nhà trọ",
        pos: "noun phrase",
        pronunciation_vi: "pe-MI-lik KOS",
        pronunciation_en: "peh-MEE-lik KOS",
      },
      {
        word: "bukti foto",
        en: "photo evidence",
        vi: "bằng chứng ảnh",
        pos: "noun phrase",
        pronunciation_vi: "BUK-ti FO-to",
        pronunciation_en: "BOOK-tee FO-to",
      },
      {
        word: "perjanjian",
        en: "agreement",
        vi: "thỏa thuận/hợp đồng",
        pos: "noun",
        pronunciation_vi: "per-JAN-ji-an",
        pronunciation_en: "per-JAN-jee-an",
      },
      {
        word: "mediasi",
        en: "mediation",
        vi: "hòa giải",
        pos: "noun",
        pronunciation_vi: "me-di-A-si",
        pronunciation_en: "meh-dee-A-see",
      },
      {
        word: "rincian biaya",
        en: "cost breakdown",
        vi: "chi tiết chi phí",
        pos: "noun phrase",
        pronunciation_vi: "rin-CI-an BI-a-ya",
        pronunciation_en: "rin-CHEE-an BEE-a-ya",
      },
      {
        word: "dipotong",
        en: "deducted",
        vi: "bị trừ",
        pos: "verb",
        pronunciation_vi: "di-PO-tong",
        pronunciation_en: "dee-PO-tong",
      },
      {
        word: "kesepakatan",
        en: "agreement; settlement",
        vi: "thỏa thuận",
        pos: "noun",
        pronunciation_vi: "ke-se-PA-kat-an",
        pronunciation_en: "keh-seh-PA-kat-an",
      },
    ],
    dialogue: [
      {
        speaker: "Penyewa",
        text: "Permisi, Bu. Saya ingin menanyakan pengembalian deposit sewa.",
        vi: "Xin lỗi cô. Tôi muốn hỏi về việc hoàn lại tiền cọc thuê.",
        en: "Excuse me, Ma'am. I would like to ask about the return of the rental deposit.",
      },
      {
        speaker: "Pemilik Kos",
        text: "Deposit belum bisa dikembalikan penuh karena ada kerusakan kamar.",
        vi: "Tiền cọc chưa thể trả đủ vì có hư hại trong phòng.",
        en: "The deposit cannot be returned in full yet because there is room damage.",
      },
      {
        speaker: "Penyewa",
        text: "Bisa dijelaskan bagian mana yang rusak? Saya punya bukti foto sebelum pindah keluar.",
        vi: "Có thể giải thích phần nào hư không? Tôi có bằng chứng ảnh trước khi dọn ra.",
        en: "Could you explain which part is damaged? I have photo evidence before moving out.",
      },
      {
        speaker: "Pemilik Kos",
        text: "Baik, nanti saya kirim rincian biaya perbaikan secara tertulis.",
        vi: "Được, lát nữa tôi sẽ gửi chi tiết chi phí sửa chữa bằng văn bản.",
        en: "All right, I will send the repair cost breakdown in writing later.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: “Tôi có bằng chứng ảnh.”",
        prompt_en: "Translate into Indonesian: “I have photo evidence.”",
        answer: "Saya punya bukti foto.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ còn thiếu: Mohon kirim ____ biaya perbaikan secara tertulis.",
        prompt_en: "Fill in the blank: Mohon kirim ____ biaya perbaikan secara tertulis.",
        answer: "rincian",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cụm nào nghĩa là “tiền cọc thuê”?",
        prompt_en: "Which phrase means “rental deposit”?",
        choices: ["deposit sewa", "jadwal sewa", "nomor sewa"],
        answer: "deposit sewa",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `mediasi` = ?",
        prompt_en: "Match the meaning: `mediasi` = ?",
        answer: "mediation",
      },
    ],
  },
];

export default lessons;
