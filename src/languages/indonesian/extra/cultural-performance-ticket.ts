// Cultural Performance Ticket Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for cultural performances: entrance tickets,
// event schedules, traditional dance, gamelan, seating, photo rules, and
// audience behavior. Indonesian target text lives in `en`, Vietnamese glosses
// in `vi`, Vietnamese L1 notes in `pronunciation_focus`, and English companions
// in `pronunciation_focus_en`.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  cell_id?: string;
  /** Indonesian word/phrase. */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech. */
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  cell_id?: string;
  speaker: string;
  /** Indonesian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

// Loosely typed so per-type fields (translation, fill_blank, matching) can vary.
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

export const culturalPerformanceTicketLessons: IndonesianLesson[] = [
  {
    id: "indonesian_cultural_performance_ticket",
    level: "A2",
    category: "culture_events",
    title_vi: "Tiket xem biểu diễn văn hóa",
    title_en: "Cultural performance ticket",
    sentences: [
      {
        en: "Saya mau beli tiket masuk untuk pertunjukan budaya ini.",
        vi: "Tôi muốn mua vé vào cửa cho buổi biểu diễn văn hóa này.",
        pronunciation_focus: [
          "ti-ket MA-suk - `tiket masuk` = vé vào cửa/vé vào xem.",
          "`pertunjukan budaya` = biểu diễn văn hóa; cụm rất thường gặp trong leaflet và website.",
          "Lỗi người Việt: nói `ticket masuk` lẫn Anh-Indo. Trong câu Indonesia tự nhiên, dùng `tiket masuk`.",
          "Luyện: `Saya mau beli tiket masuk.`",
        ],
        pronunciation_focus_en: [
          "TEE-ket MAH-sook - `tiket masuk` = entrance ticket/admission ticket.",
          "`pertunjukan budaya` = cultural performance; common on event pages and flyers.",
          "VN-speaker trap: mixing English `ticket masuk`. In natural Indonesian, use `tiket masuk`.",
          "Drill: `Saya mau beli tiket masuk.`",
        ],
      },
      {
        en: "Jadwal acara mulai jam tujuh malam.",
        vi: "Lịch chương trình bắt đầu lúc bảy giờ tối.",
        pronunciation_focus: [
          "jad-WAL A-ca-ra - `jadwal acara` = lịch chương trình/sự kiện.",
          "`mulai jam tujuh malam` = bắt đầu lúc 7 giờ tối; `mulai` = bắt đầu.",
          "Lỗi người Việt: nói `waktu acara` chung chung. Với event, `jadwal acara` rõ hơn.",
          "Luyện: `Jadwal acara mulai jam tujuh.`",
        ],
        pronunciation_focus_en: [
          "jahd-WAHL AH-cha-rah - `jadwal acara` = event schedule.",
          "`mulai jam tujuh malam` = starts at 7 p.m.; `mulai` = begin.",
          "VN-speaker trap: vague `waktu acara`. For events, `jadwal acara` is clearer.",
          "Drill: `Jadwal acara mulai jam tujuh.`",
        ],
      },
      {
        en: "Apakah tempat duduk saya masih tersedia?",
        vi: "Chỗ ngồi của tôi còn trống không?",
        pronunciation_focus: [
          "tem-pat DU-duk - `tempat duduk` = chỗ ngồi.",
          "`masih tersedia` = vẫn còn/đang có sẵn; rất tự nhiên khi hỏi về ghế hoặc seat number.",
          "Lỗi người Việt: hỏi `ada kursi saya?` nghe chưa đủ rõ. `Tempat duduk` là cụm chuẩn hơn.",
          "Luyện: `Tempat duduk saya masih tersedia?`",
        ],
        pronunciation_focus_en: [
          "tem-pat DOO-dook - `tempat duduk` = seat.",
          "`masih tersedia` = still available; natural for seat or reservation questions.",
          "VN-speaker trap: `ada kursi saya?` is not specific enough. `Tempat duduk` is the standard phrase.",
          "Drill: `Tempat duduk saya masih tersedia?`",
        ],
      },
      {
        en: "Kami mendapat baris depan, dekat panggung.",
        vi: "Chúng tôi được hàng ghế phía trước, gần sân khấu.",
        pronunciation_focus: [
          "ba-ris de-PAN - `baris depan` = hàng ghế phía trước.",
          "`panggung` = sân khấu; từ rất phổ biến trong acara seni.",
          "Lỗi người Việt: dùng `front row` lẫn tiếng Anh. Trong tiếng Indonesia, nói `baris depan` là tự nhiên nhất.",
          "Luyện: `Kami mendapat baris depan.`",
        ],
        pronunciation_focus_en: [
          "bah-ris deh-PAHN - `baris depan` = front row.",
          "`panggung` = stage; very common in arts events.",
          "VN-speaker trap: code-switching `front row`. In Indonesian, `baris depan` is most natural.",
          "Drill: `Kami mendapat baris depan.`",
        ],
      },
      {
        en: "Tolong tunjukkan barcode tiket saya.",
        vi: "Làm ơn chỉ mã vạch vé của tôi.",
        pronunciation_focus: [
          "bar-kod ti-ket - `barcode tiket` = mã vạch vé; từ mượn rất phổ biến.",
          "`tunjukkan` = hãy chỉ/cho xem; dạng yêu cầu lịch sự.",
          "Lỗi người Việt: nói `lihat barcode saya` nghe được, nhưng `tunjukkan tiket` dùng tốt hơn ở quầy check-in.",
          "Luyện: `Tolong tunjukkan tiket saya.`",
        ],
        pronunciation_focus_en: [
          "bar-koad TEE-ket - `barcode tiket` = ticket barcode; a very common loan phrase.",
          "`tunjukkan` = show/point out; a polite request form.",
          "VN-speaker trap: `lihat barcode saya` is understandable, but `tunjukkan tiket` is better at the counter.",
          "Drill: `Tolong tunjukkan tiket saya.`",
        ],
      },
      {
        en: "Saya menerima tiket lewat email setelah pembayaran berhasil.",
        vi: "Tôi nhận vé qua email sau khi thanh toán thành công.",
        pronunciation_focus: [
          "le-wat E-mail - `lewat email` = qua email.",
          "`setelah pembayaran berhasil` = sau khi thanh toán thành công; rất hữu ích cho vé online.",
          "Lỗi người Việt: nói `setelah bayar` là được, nhưng câu đầy đủ nghe rõ hơn trong hỗ trợ khách hàng.",
          "Luyện: `Saya menerima tiket lewat email.`",
        ],
        pronunciation_focus_en: [
          "leh-WAHT EE-mail - `lewat email` = via email.",
          "`setelah pembayaran berhasil` = after payment succeeded; very useful for online tickets.",
          "VN-speaker trap: `setelah bayar` is okay, but the full sentence sounds clearer in customer service.",
          "Drill: `Saya menerima tiket lewat email.`",
        ],
      },
      {
        en: "Aturan foto di dalam gedung sangat ketat.",
        vi: "Quy định chụp ảnh bên trong tòa nhà rất nghiêm.",
        pronunciation_focus: [
          "a-tu-RAN FO-to - `aturan foto` = quy định chụp ảnh.",
          "`di dalam gedung` = bên trong tòa nhà; `gedung` = tòa nhà.",
          "Lỗi người Việt: nói `aturan untuk foto` vẫn hiểu, nhưng `aturan foto` ngắn và tự nhiên hơn.",
          "Luyện: `Aturan foto sangat ketat.`",
        ],
        pronunciation_focus_en: [
          "ah-too-RAHN FOH-toh - `aturan foto` = photo rule.",
          "`di dalam gedung` = inside the building; `gedung` = building.",
          "VN-speaker trap: `aturan untuk foto` is understandable, but `aturan foto` is shorter and more natural.",
          "Drill: `Aturan foto sangat ketat.`",
        ],
      },
      {
        en: "Penonton diminta tidak mengambil foto dengan flash.",
        vi: "Khán giả được yêu cầu không chụp ảnh có đèn flash.",
        pronunciation_focus: [
          "pe-NON-ton di-min-TA - `penonton` = khán giả; `diminta` = được yêu cầu.",
          "`tidak mengambil foto` = không chụp ảnh; `dengan flash` = với đèn flash.",
          "Lỗi người Việt: dùng `jangan foto` được, nhưng thông báo trang trọng hơn thường dùng `diminta tidak...`.",
          "Luyện: `Penonton diminta tidak mengambil foto.`",
        ],
        pronunciation_focus_en: [
          "peh-NON-ton dee-MIN-tah - `penonton` = audience; `diminta` = asked/requested.",
          "`tidak mengambil foto` = not to take photos; `dengan flash` = with flash.",
          "VN-speaker trap: `jangan foto` works casually, but formal announcements often use `diminta tidak...`.",
          "Drill: `Penonton diminta tidak mengambil foto.`",
        ],
      },
      {
        en: "Gamelan dimainkan sebelum tari tradisional dimulai.",
        vi: "Dàn gamelan được chơi trước khi điệu múa truyền thống bắt đầu.",
        pronunciation_focus: [
          "ga-me-LAN - `gamelan` = dàn nhạc truyền thống, nhất là ở Jawa/Bali.",
          "`dimainkan` = được chơi/được trình diễn; bị động rất tự nhiên với nhạc cụ.",
          "`tari tradisional` = điệu múa truyền thống; `dimulai` = được bắt đầu.",
          "Luyện: `Gamelan dimainkan sebelum tari dimulai.`",
        ],
        pronunciation_focus_en: [
          "gah-me-LAHN - `gamelan` = traditional ensemble, especially in Java/Bali.",
          "`dimainkan` = played/performed; passive voice is natural with instruments.",
          "`tari tradisional` = traditional dance; `dimulai` = is started.",
          "Drill: `Gamelan dimainkan sebelum tari dimulai.`",
        ],
      },
      {
        en: "Kalau ingin pulang lebih awal, silakan beri tahu petugas.",
        vi: "Nếu muốn về sớm, vui lòng báo cho nhân viên phụ trách.",
        pronunciation_focus: [
          "si-la-KAN be-RI ta-HU - `silakan beri tahu` = xin hãy báo; câu nhờ vả lịch sự.",
          "`pulang lebih awal` = về sớm; `petugas` = nhân viên/người phụ trách.",
          "Lỗi người Việt: dùng `kasih tahu` trong ngữ cảnh lễ tân. `Beri tahu` lịch sự và chuẩn hơn.",
          "Luyện: `Silakan beri tahu petugas.`",
        ],
        pronunciation_focus_en: [
          "see-lah-KAN beh-REE tah-HOO - `silakan beri tahu` = please inform; polite request wording.",
          "`pulang lebih awal` = leave early; `petugas` = staff/officer in charge.",
          "VN-speaker trap: `kasih tahu` in a formal venue. `Beri tahu` is more polite and standard.",
          "Drill: `Silakan beri tahu petugas.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, thông báo về pertunjukan budaya thường rất ngắn gọn: `tiket masuk`, `jadwal acara`, `tempat duduk`, `aturan foto`, `penonton`. Khi đi xem tari tradisional hoặc gamelan, khán giả thường giữ giọng nhỏ, không che tầm nhìn, và tôn trọng aturan venue. Nhiều địa điểm còn yêu cầu không dùng flash vì ảnh hưởng đến performer và suasana pertunjukan.",
    cultural_notes_en:
      "In Indonesia, notices for cultural performances are usually concise: `tiket masuk`, `jadwal acara`, `tempat duduk`, `aturan foto`, `penonton`. When attending traditional dance or gamelan performances, audiences are expected to keep voices low, avoid blocking views, and respect venue rules. Many venues also prohibit flash photography because it affects performers and the atmosphere.",
    tip_advice_vi:
      "Mẫu hữu ích: `Saya mau beli tiket masuk`, `Tempat duduk saya masih tersedia?`, `Aturan foto sangat ketat`, `Penonton diminta tidak mengambil foto`. Nếu bạn không chắc, hỏi `petugas` hoặc `loket` trước khi vào. `Tolong tunjukkan` và `silakan beri tahu` đều là câu lịch sự rất dùng được.",
    tip_advice_en:
      "Useful patterns: `Saya mau beli tiket masuk`, `Tempat duduk saya masih tersedia?`, `Aturan foto sangat ketat`, `Penonton diminta tidak mengambil foto`. If unsure, ask the `petugas` or `loket` before entering. `Tolong tunjukkan` and `silakan beri tahu` are both very usable polite phrases.",
    vocabulary: [
      {
        cell_id: "476bffdb-f7ee-4da3-9089-8e0be31fc268",
        word: "tiket masuk",
        en: "admission ticket",
        vi: "vé vào cửa",
        pos: "noun phrase",
        pronunciation_vi: "ti-ket MA-suk",
        pronunciation_en: "TEE-ket MAH-sook",
      },
      {
        cell_id: "8d8f6a06-5c19-4a65-a805-49aabe5b3f72",
        word: "jadwal acara",
        en: "event schedule",
        vi: "lịch chương trình",
        pos: "noun phrase",
        pronunciation_vi: "jad-WAL A-ca-ra",
        pronunciation_en: "JAHD-waal AH-cha-rah",
      },
      {
        cell_id: "93f6a0e1-5d59-4986-a79f-2b116689e9e3",
        word: "tempat duduk",
        en: "seat",
        vi: "chỗ ngồi",
        pos: "noun phrase",
        pronunciation_vi: "tem-pat DU-duk",
        pronunciation_en: "tem-paht DOO-dook",
      },
      {
        cell_id: "83122748-c6b0-49f5-8efe-55617d042f35",
        word: "panggung",
        en: "stage",
        vi: "sân khấu",
        pos: "noun",
        pronunciation_vi: "PANG-gung",
        pronunciation_en: "PANG-goong",
      },
      {
        cell_id: "7ffb7ced-4859-4efe-97ee-d40b6a286ec7",
        word: "barcode tiket",
        en: "ticket barcode",
        vi: "mã vạch vé",
        pos: "noun phrase",
        pronunciation_vi: "bar-kod ti-ket",
        pronunciation_en: "bar-COAD TEE-ket",
      },
      {
        cell_id: "fa05ea7d-9e88-4eea-ae80-11ea7a89b511",
        word: "aturan foto",
        en: "photo rule",
        vi: "quy định chụp ảnh",
        pos: "noun phrase",
        pronunciation_vi: "a-tu-RAN FO-to",
        pronunciation_en: "a-too-RAHN FOH-toh",
      },
      {
        cell_id: "363768ff-b6d6-4461-a27d-971fc94105bc",
        word: "penonton",
        en: "audience",
        vi: "khán giả",
        pos: "noun",
        pronunciation_vi: "pe-NON-ton",
        pronunciation_en: "peh-NON-ton",
      },
      {
        cell_id: "b5da9939-0ca7-485d-b6b4-ccb369a88149",
        word: "gamelan",
        en: "gamelan ensemble",
        vi: "dàn gamelan",
        pos: "noun",
        pronunciation_vi: "ga-me-LAN",
        pronunciation_en: "gah-me-LAHN",
      },
      {
        cell_id: "c7d44785-ae03-42cd-b294-85ba1d34c4ad",
        word: "tari tradisional",
        en: "traditional dance",
        vi: "múa truyền thống",
        pos: "noun phrase",
        pronunciation_vi: "TA-ri tra-di-si-o-NAL",
        pronunciation_en: "TAH-ree tra-di-see-oh-NAHL",
      },
      {
        cell_id: "328071e5-9fcf-4ce7-ac97-7ec41acc6d54",
        word: "petugas",
        en: "staff / officer",
        vi: "nhân viên / người phụ trách",
        pos: "noun",
        pronunciation_vi: "pe-TU-gas",
        pronunciation_en: "peh-TOO-gahs",
      },
    ],
    dialogue: [
      {
        cell_id: "adecda7b-6ad3-4951-9597-c23c870e91fd",
        speaker: "Pengunjung",
        text: "Halo, saya mau beli tiket masuk untuk dua orang.",
        vi: "Xin chào, tôi muốn mua vé vào cửa cho hai người.",
        en: "Hello, I want to buy admission tickets for two people.",
      },
      {
        cell_id: "9acc19a4-86d1-47c3-b412-694dffbf2917",
        speaker: "Loket",
        text: "Baik, pertunjukannya mulai jam tujuh malam.",
        vi: "Vâng, buổi biểu diễn bắt đầu lúc bảy giờ tối.",
        en: "Okay, the performance starts at 7 p.m.",
      },
      {
        cell_id: "6be69c44-41fc-42e7-89a3-fddc706ef261",
        speaker: "Pengunjung",
        text: "Tempat duduk saya masih tersedia?",
        vi: "Chỗ ngồi của tôi còn trống không?",
        en: "Is my seat still available?",
      },
      {
        cell_id: "728ad2fb-de98-492b-864c-09a2a551ba2f",
        speaker: "Loket",
        text: "Masih. Baris depan sedang penuh, tetapi ada di tengah.",
        vi: "Vẫn còn. Hàng ghế trước đã đầy, nhưng còn chỗ ở giữa.",
        en: "Yes. The front row is full, but there are seats in the middle.",
      },
      {
        cell_id: "92bc1052-7e55-491a-8b1a-eff595a50e29",
        speaker: "Pengunjung",
        text: "Aturan foto di dalam gedung bagaimana?",
        vi: "Quy định chụp ảnh bên trong tòa nhà như thế nào?",
        en: "What are the photo rules inside the venue?",
      },
      {
        cell_id: "e1052705-92ee-4bb8-8da0-216ab12d8168",
        speaker: "Loket",
        text: "Penonton diminta tidak mengambil foto dengan flash.",
        vi: "Khán giả được yêu cầu không chụp ảnh có đèn flash.",
        en: "Audience members are asked not to take photos with flash.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt: "Translate into Indonesian: Tôi muốn mua vé vào cửa cho buổi biểu diễn văn hóa này.",
        answer: "Saya mau beli tiket masuk untuk pertunjukan budaya ini.",
      },
      {
        type: "translation",
        prompt: "Translate into Vietnamese: Penonton diminta tidak mengambil foto dengan flash.",
        answer: "Khán giả được yêu cầu không chụp ảnh có đèn flash.",
      },
      {
        type: "fill_blank",
        prompt: "Jadwal _____ mulai jam tujuh malam.",
        answer: "acara",
      },
      {
        type: "fill_blank",
        prompt: "_____ duduk saya masih tersedia?",
        answer: "Tempat",
      },
      {
        type: "matching",
        prompt: "Match the Indonesian phrase to the meaning.",
        pairs: [
          ["tiket masuk", "admission ticket / vé vào cửa"],
          ["jadwal acara", "event schedule / lịch chương trình"],
          ["aturan foto", "photo rule / quy định chụp ảnh"],
          ["penonton", "audience / khán giả"],
        ],
      },
    ],
  },
];

export default culturalPerformanceTicketLessons;
