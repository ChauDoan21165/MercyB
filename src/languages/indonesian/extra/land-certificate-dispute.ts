// Land Certificate Dispute Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for land ownership disputes: land
// certificates, boundary lines, witnesses, notaries, the land office, proof of
// ownership, and mediation. Indonesian target text lives in `en`, Vietnamese
// glosses in `vi`, Vietnamese L1 notes in `pronunciation_focus`, and English
// companions in `pronunciation_focus_en`.

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

export const landCertificateDisputeLessons: IndonesianLesson[] = [
  {
    id: "indonesian_land_certificate_dispute",
    level: "B1",
    category: "legal_property",
    title_vi: "Tranh chấp sertifikat tanah và ranh giới đất",
    title_en: "Land certificate and boundary dispute",
    sentences: [
      {
        en: "Saya ingin memeriksa sertifikat tanah ini dulu.",
        vi: "Tôi muốn kiểm tra giấy chứng nhận đất này trước.",
        pronunciation_focus: [
          "ser-ti-fi-kat TA-nah - `sertifikat tanah` = giấy chứng nhận quyền sử dụng đất/giấy tờ đất.",
          "`memeriksa` = kiểm tra/xem xét; trang trọng hơn `cek` trong bối cảnh pháp lý.",
          "Lỗi người Việt: nói `surat tanah` chung chung. Trong tranh chấp, `sertifikat tanah` là cụm chính xác hơn.",
          "Luyện: `Saya ingin memeriksa sertifikat tanah.`",
        ],
        pronunciation_focus_en: [
          "ser-tee-fi-KAHT TAH-nah - `sertifikat tanah` = land certificate.",
          "`memeriksa` = inspect/check; more formal than casual `cek` in legal contexts.",
          "VN-speaker trap: saying vague `surat tanah`. In disputes, `sertifikat tanah` is the precise term.",
          "Drill: `Saya ingin memeriksa sertifikat tanah.`",
        ],
      },
      {
        en: "Batas tanah kami sepertinya berubah.",
        vi: "Ranh giới đất của chúng tôi có vẻ đã thay đổi.",
        pronunciation_focus: [
          "BA-tas TA-nah - `batas tanah` = ranh giới đất.",
          "`sepertinya` = có vẻ như; cách nói mềm khi chưa mau kết luận.",
          "Lỗi người Việt: dịch `batas` là `limit` theo tiếng Anh. Trong ngữ cảnh đất đai, `batas` = ranh giới.",
          "Luyện: `Batas tanah kami berubah.`",
        ],
        pronunciation_focus_en: [
          "BAH-tahs TAH-nah - `batas tanah` = land boundary.",
          "`sepertinya` = apparently / it seems; softer when you are not yet concluding.",
          "VN-speaker trap: translating `batas` as English `limit`. In land context, it means boundary.",
          "Drill: `Batas tanah kami berubah.`",
        ],
      },
      {
        en: "Tetangga saya berkata bahwa pagar itu masuk ke tanah kami.",
        vi: "Hàng xóm của tôi nói rằng hàng rào đó lấn vào đất của chúng tôi.",
        pronunciation_focus: [
          "te-TANG-ga - `tetangga` = hàng xóm.",
          "`masuk ke tanah kami` = lấn vào đất của chúng tôi; rất tự nhiên trong tranh chấp ranh giới.",
          "Lỗi người Việt: dùng `masuk tanah` thiếu giới từ. Khi nói lấn vào khu đất, dùng `masuk ke tanah`.",
          "Luyện: `Pagar itu masuk ke tanah kami.`",
        ],
        pronunciation_focus_en: [
          "teh-TANG-gah - `tetangga` = neighbor.",
          "`masuk ke tanah kami` = entered/encroached into our land; very natural in boundary disputes.",
          "VN-speaker trap: dropping the preposition and saying `masuk tanah`. To say encroach on land, use `masuk ke tanah`.",
          "Drill: `Pagar itu masuk ke tanah kami.`",
        ],
      },
      {
        en: "Kami punya saksi yang melihat batas lama.",
        vi: "Chúng tôi có nhân chứng đã nhìn thấy ranh giới cũ.",
        pronunciation_focus: [
          "SAK-si - `saksi` = nhân chứng.",
          "`batas lama` = ranh giới cũ; `lama` = cũ/đã lâu.",
          "Lỗi người Việt: dùng `orang yang lihat` quá dài. Trong hồ sơ, `saksi` là từ chuẩn và ngắn gọn.",
          "Luyện: `Kami punya saksi.`",
        ],
        pronunciation_focus_en: [
          "SAK-see - `saksi` = witness.",
          "`batas lama` = old boundary; `lama` = old / long-standing.",
          "VN-speaker trap: overlong `orang yang lihat`. In case files, `saksi` is the standard and concise word.",
          "Drill: `Kami punya saksi.`",
        ],
      },
      {
        en: "Notaris sudah menyimpan salinan dokumen itu.",
        vi: "Công chứng viên đã lưu bản sao của tài liệu đó.",
        pronunciation_focus: [
          "no-TA-ris - `notaris` = công chứng viên.",
          "`menyimpan salinan` = lưu bản sao; `salinan` = bản copy/bản sao.",
          "Lỗi người Việt: nghĩ `notaris` chỉ dùng cho mua bán nhà. Trong giấy tờ tanah, notaris juga sering terlibat.",
          "Luyện: `Notaris menyimpan salinan dokumen.`",
        ],
        pronunciation_focus_en: [
          "no-TA-ris - `notaris` = notary.",
          "`menyimpan salinan` = keep/store a copy; `salinan` = copy.",
          "VN-speaker trap: thinking `notaris` only appears in home sales. In land paperwork, notaries are often involved too.",
          "Drill: `Notaris menyimpan salinan dokumen.`",
        ],
      },
      {
        en: "Kami perlu datang ke kantor pertanahan besok pagi.",
        vi: "Chúng tôi cần đến văn phòng địa chính sáng mai.",
        pronunciation_focus: [
          "kan-tor per-ta-NA-han - `kantor pertanahan` = văn phòng địa chính/cơ quan đất đai.",
          "`datang ke` = đến; động từ hướng đi rất quan trọng ở đây.",
          "Lỗi người Việt: nói `kantor tanah` nghe lạ. Thuật ngữ hành chính là `kantor pertanahan`.",
          "Luyện: `Kami perlu datang ke kantor pertanahan.`",
        ],
        pronunciation_focus_en: [
          "kan-TOR per-tah-NAH-hahn - `kantor pertanahan` = land office.",
          "`datang ke` = go to / come to; an important direction verb here.",
          "VN-speaker trap: `kantor tanah` sounds odd. The administrative term is `kantor pertanahan`.",
          "Drill: `Kami perlu datang ke kantor pertanahan.`",
        ],
      },
      {
        en: "Apakah ada bukti kepemilikan lain?",
        vi: "Có bằng chứng sở hữu nào khác không?",
        pronunciation_focus: [
          "buk-ti ke-pe-mi-LI-kan - `bukti kepemilikan` = bằng chứng sở hữu.",
          "`lain` = khác; trong câu hỏi pháp lý, hỏi thêm bukti rất hợp lý.",
          "Lỗi người Việt: dịch `proof` thành `bukti` đúng, nhưng phải ghép với `kepemilikan` để rõ nghĩa sở hữu.",
          "Luyện: `Apakah ada bukti lain?`",
        ],
        pronunciation_focus_en: [
          "BOOK-tee ke-pe-mee-LEE-kan - `bukti kepemilikan` = proof of ownership.",
          "`lain` = other/another; asking for more evidence is natural in legal questions.",
          "VN-speaker trap: translating `proof` as just `bukti`. Pair it with `kepemilikan` to show ownership clearly.",
          "Drill: `Apakah ada bukti lain?`",
        ],
      },
      {
        en: "Kami ingin mediasi dulu sebelum lanjut ke proses hukum.",
        vi: "Chúng tôi muốn hòa giải trước khi tiếp tục sang quá trình pháp lý.",
        pronunciation_focus: [
          "me-di-A-si - `mediasi` = hòa giải.",
          "`proses hukum` = quá trình pháp lý; `lanjut ke` = tiếp tục sang.",
          "Lỗi người Việt: nói `damai` quá chung chung. Trong tranh chấp chính thức, `mediasi` là từ đúng và trung tính hơn.",
          "Luyện: `Kami ingin mediasi dulu.`",
        ],
        pronunciation_focus_en: [
          "meh-dee-AH-see - `mediasi` = mediation.",
          "`proses hukum` = legal process; `lanjut ke` = continue to.",
          "VN-speaker trap: using vague `damai`. In formal disputes, `mediasi` is the correct neutral term.",
          "Drill: `Kami ingin mediasi dulu.`",
        ],
      },
      {
        en: "Mohon tunjukkan surat yang menjelaskan batas tanah.",
        vi: "Xin hãy chỉ cho tôi văn bản giải thích ranh giới đất.",
        pronunciation_focus: [
          "su-rat yang men-je-LAS-kan - `surat` = văn bản/giấy tờ; `menjelaskan` = giải thích.",
          "`batas tanah` = ranh giới đất; câu này phù hợp khi meminta dokumen.",
          "Lỗi người Việt: nói `kertas` cho mọi giấy tờ. Trong thủ tục đất, `surat` nghe trang trọng và đúng hơn.",
          "Luyện: `Tunjukkan surat batas tanah.`",
        ],
        pronunciation_focus_en: [
          "SOO-rat yang men-jeh-LAS-kan - `surat` = document/paper; `menjelaskan` = explain.",
          "`batas tanah` = land boundary; useful when requesting documents.",
          "VN-speaker trap: using `kertas` for all paperwork. In land procedures, `surat` sounds formal and correct.",
          "Drill: `Tunjukkan surat batas tanah.`",
        ],
      },
      {
        en: "Kami akan menunggu giliran di kantor pertanahan.",
        vi: "Chúng tôi sẽ đợi đến lượt ở văn phòng địa chính.",
        pronunciation_focus: [
          "gi-LIR-an - `giliran` = lượt/chỗ xếp hàng đến lượt.",
          "`menunggu giliran` = chờ đến lượt; rất tự nhiên ở kantor pelayanan.",
          "Lỗi người Việt: nói `antre saja` đủ hiểu, nhưng `menunggu giliran` rõ ràng và lịch sự hơn.",
          "Luyện: `Kami menunggu giliran.`",
        ],
        pronunciation_focus_en: [
          "gee-LEE-ran - `giliran` = turn / queue order.",
          "`menunggu giliran` = wait your turn; very natural in service offices.",
          "VN-speaker trap: `antre saja` is understandable, but `menunggu giliran` is clearer and more polite.",
          "Drill: `Kami menunggu giliran.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong tranh chấp tanah ở Indonesia, người ta thường giữ giọng رسمی và tránh lời lẽ quá cứng. Các từ như `sertifikat tanah`, `batas tanah`, `saksi`, `notaris`, `kantor pertanahan`, `bukti kepemilikan`, và `mediasi` là trung tâm của giao tiếp. Nhiều hồ sơ cần fotokopi dokumen, saksi, bản đồ atau surat pengukuran, và seringkali proses bắt đầu bằng mediasi trước khi masuk jalur hukum.",
    cultural_notes_en:
      "In Indonesian land disputes, people usually keep a formal tone and avoid overly harsh wording. Words like `sertifikat tanah`, `batas tanah`, `saksi`, `notaris`, `kantor pertanahan`, `bukti kepemilikan`, and `mediasi` are central to the conversation. Many cases need photocopies of documents, witnesses, maps or survey letters, and the process often starts with mediation before moving to legal steps.",
    tip_advice_vi:
      "Mẫu câu hữu ích: `Saya ingin memeriksa sertifikat tanah`, `Kami punya saksi`, `Mohon tunjukkan surat`, `Kami ingin mediasi dulu`. Khi nói về đất, dùng `batas` cho ranh giới và `kepemilikan` cho quyền sở hữu. Nếu chưa chắc, hãy hỏi dokumen, jangan langsung menuduh.",
    tip_advice_en:
      "Useful lines: `Saya ingin memeriksa sertifikat tanah`, `Kami punya saksi`, `Mohon tunjukkan surat`, `Kami ingin mediasi dulu`. When talking about land, use `batas` for boundary and `kepemilikan` for ownership. If unsure, ask for documents instead of accusing immediately.",
    vocabulary: [
      {
        word: "sertifikat tanah",
        en: "land certificate",
        vi: "giấy chứng nhận quyền sử dụng đất",
        pos: "noun phrase",
        pronunciation_vi: "ser-ti-fi-kat TA-nah",
        pronunciation_en: "ser-tee-fi-KAHT TAH-nah",
      },
      {
        word: "batas tanah",
        en: "land boundary",
        vi: "ranh giới đất",
        pos: "noun phrase",
        pronunciation_vi: "BA-tas TA-nah",
        pronunciation_en: "BAH-tahs TAH-nah",
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
        word: "notaris",
        en: "notary",
        vi: "công chứng viên",
        pos: "noun",
        pronunciation_vi: "no-TA-ris",
        pronunciation_en: "no-TA-ris",
      },
      {
        word: "kantor pertanahan",
        en: "land office",
        vi: "văn phòng địa chính",
        pos: "noun phrase",
        pronunciation_vi: "kan-TOR per-ta-NA-han",
        pronunciation_en: "kan-TOR per-tah-NAH-hahn",
      },
      {
        word: "bukti kepemilikan",
        en: "proof of ownership",
        vi: "bằng chứng sở hữu",
        pos: "noun phrase",
        pronunciation_vi: "BUK-ti ke-pe-mi-LI-kan",
        pronunciation_en: "BOOK-tee ke-pe-mee-LEE-kan",
      },
      {
        word: "mediasi",
        en: "mediation",
        vi: "hòa giải",
        pos: "noun",
        pronunciation_vi: "me-di-A-si",
        pronunciation_en: "meh-dee-AH-see",
      },
      {
        word: "giliran",
        en: "turn / queue turn",
        vi: "lượt, đến lượt",
        pos: "noun",
        pronunciation_vi: "gi-LIR-an",
        pronunciation_en: "gee-LEE-ran",
      },
      {
        word: "surat",
        en: "document / letter",
        vi: "văn bản / giấy tờ",
        pos: "noun",
        pronunciation_vi: "SU-rat",
        pronunciation_en: "SOO-rat",
      },
      {
        word: "menunggu giliran",
        en: "wait your turn",
        vi: "đợi đến lượt",
        pos: "verb phrase",
        pronunciation_vi: "me-NUNG-gu gi-LIR-an",
        pronunciation_en: "meh-NOONG-goo gee-LEE-ran",
      },
    ],
    dialogue: [
      {
        speaker: "Pemilik tanah",
        text: "Saya ingin memeriksa sertifikat tanah ini dulu.",
        vi: "Tôi muốn kiểm tra giấy chứng nhận đất này trước.",
        en: "I want to check this land certificate first.",
      },
      {
        speaker: "Petugas",
        text: "Baik, mohon tunggu giliran dan siapkan dokumen pendukung.",
        vi: "Vâng, xin chờ đến lượt và chuẩn bị giấy tờ hỗ trợ.",
        en: "Okay, please wait your turn and prepare supporting documents.",
      },
      {
        speaker: "Pemilik tanah",
        text: "Batas tanah kami sepertinya berubah.",
        vi: "Ranh giới đất của chúng tôi có vẻ đã thay đổi.",
        en: "Our land boundary seems to have changed.",
      },
      {
        speaker: "Petugas",
        text: "Kalau begitu, kami bisa lihat bukti kepemilikan dan saksi yang ada.",
        vi: "Nếu vậy, chúng tôi có thể xem bằng chứng sở hữu và các nhân chứng hiện có.",
        en: "In that case, we can review the proof of ownership and the witnesses available.",
      },
      {
        speaker: "Pemilik tanah",
        text: "Kami ingin mediasi dulu sebelum lanjut ke proses hukum.",
        vi: "Chúng tôi muốn hòa giải trước khi tiếp tục sang quá trình pháp lý.",
        en: "We want mediation first before continuing to legal proceedings.",
      },
      {
        speaker: "Petugas",
        text: "Silakan. Notaris juga bisa membantu menyiapkan salinan dokumen.",
        vi: "Xin mời. Công chứng viên cũng có thể giúp chuẩn bị bản sao tài liệu.",
        en: "Certainly. A notary can also help prepare document copies.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt: "Translate into Indonesian: Chúng tôi muốn hòa giải trước khi tiếp tục sang quá trình pháp lý.",
        answer: "Kami ingin mediasi dulu sebelum lanjut ke proses hukum.",
      },
      {
        type: "translation",
        prompt: "Translate into Vietnamese: Kami perlu datang ke kantor pertanahan besok pagi.",
        answer: "Chúng tôi cần đến văn phòng địa chính sáng mai.",
      },
      {
        type: "fill_blank",
        prompt: "Batas ____ kami sepertinya berubah.",
        answer: "tanah",
      },
      {
        type: "fill_blank",
        prompt: "Kami punya ____ yang melihat batas lama.",
        answer: "saksi",
      },
      {
        type: "matching",
        prompt: "Match the Indonesian phrase to the meaning.",
        pairs: [
          ["sertifikat tanah", "land certificate / giấy chứng nhận đất"],
          ["bukti kepemilikan", "proof of ownership / bằng chứng sở hữu"],
          ["kantor pertanahan", "land office / văn phòng địa chính"],
          ["mediasi", "mediation / hòa giải"],
        ],
      },
    ],
  },
];

export default landCertificateDisputeLessons;
