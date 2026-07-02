// Baby birth registration Indonesian (Vietnamese -> Indonesian study track).
//
// A6 Wave 20 file. Covers akta kelahiran, nama bayi, rumah sakit, surat lahir,
// kartu keluarga, catatan sipil, NIK, and dokumen orang tua.
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
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
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
  /** Part of speech, e.g. "noun", "verb", "phrase". */
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
    id: "indonesian_baby_birth_registration",
    level: "A2",
    category: "life_admin",
    title_vi: "Đăng ký khai sinh cho em bé",
    title_en: "Registering a baby's birth",
    sentences: [
      {
        en: "Kami mau mengurus akta kelahiran bayi.",
        vi: "Chúng tôi muốn làm giấy khai sinh cho em bé.",
        pronunciation_focus: [
          "KA-mi mau me-NGU-rus AK-ta ke-la-HIR-an BA-yi - `mengurus` = lo/làm thủ tục; `akta kelahiran` = giấy khai sinh.",
          "`akta` là giấy chứng nhận hộ tịch. Đừng dịch thành `surat lahir` khi nói giấy khai sinh chính thức.",
          "Lỗi người Việt: dùng `buat` cho mọi thủ tục. `Buat akta` hiểu được, nhưng ở cơ quan `mengurus akta` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "KA-mi mau me-NGOO-rus AK-ta ke-la-HEER-an BA-yi - `mengurus` = handle/process paperwork; `akta kelahiran` = birth certificate.",
          "`akta` is a civil certificate. Do not use `surat lahir` for the official birth certificate.",
          "VN-speaker trap: using `buat` for every application. `Buat akta` is understood, but at an office `mengurus akta` is more natural.",
        ],
      },
      {
        en: "Bayi kami lahir di rumah sakit minggu lalu.",
        vi: "Em bé của chúng tôi sinh ở bệnh viện tuần trước.",
        pronunciation_focus: [
          "BA-yi KA-mi LA-hir di RU-mah SA-kit MING-gu LA-lu - `lahir` = sinh/ra đời; `rumah sakit` = bệnh viện.",
          "`kami` = chúng tôi không gồm người nghe. Khi nói với nhân viên, `bayi kami` là con của hai vợ chồng, không gồm người nghe.",
          "Lỗi người Việt: nói `sinh di rumah sakit` theo động từ tiếng Việt. Với em bé là chủ ngữ, dùng `bayi lahir`.",
        ],
        pronunciation_focus_en: [
          "BA-yi KA-mi LA-hir di ROO-mah SA-kit MING-goo LA-loo - `lahir` = be born; `rumah sakit` = hospital.",
          "`kami` = we excluding the listener. With an officer, `bayi kami` means our baby, not including the officer.",
          "VN-speaker trap: using the Vietnamese-style verb 'give birth' with the baby as subject. In Indonesian, the baby `lahir`.",
        ],
      },
      {
        en: "Ini surat lahir dari rumah sakit.",
        vi: "Đây là giấy chứng sinh từ bệnh viện.",
        pronunciation_focus: [
          "I-ni SU-rat LA-hir da-ri RU-mah SA-kit - `surat lahir` = giấy chứng sinh/giấy xác nhận sinh từ bệnh viện.",
          "`dari rumah sakit` = từ bệnh viện. Cụm này phân biệt giấy bệnh viện với `akta kelahiran` từ cơ quan hộ tịch.",
          "Lỗi người Việt: gọi cả hai là giấy khai sinh. `Surat lahir` là giấy từ bệnh viện; `akta kelahiran` là giấy khai sinh chính thức.",
        ],
        pronunciation_focus_en: [
          "EE-nee SOO-rat LA-hir da-ree ROO-mah SA-kit - `surat lahir` = hospital birth letter/certificate of birth.",
          "`dari rumah sakit` = from the hospital. This separates hospital paperwork from the official `akta kelahiran`.",
          "VN-speaker trap: calling both documents birth certificate. `Surat lahir` is from the hospital; `akta kelahiran` is the official civil certificate.",
        ],
      },
      {
        en: "Nama bayi sudah kami tulis sesuai kartu keluarga.",
        vi: "Tên em bé chúng tôi đã viết theo thẻ gia đình.",
        pronunciation_focus: [
          "NA-ma BA-yi SU-dah KA-mi TU-lis se-SU-ai KAR-tu ke-LU-ar-ga - `sesuai` = đúng theo/phù hợp với; `kartu keluarga` = thẻ hộ gia đình.",
          "`sudah kami tulis` là cấu trúc bị động trang trọng: đã được chúng tôi viết.",
          "Lỗi người Việt: đặt `sudah` ở cuối như 'rồi'. Tiếng Indonesia thường đặt trước động từ: `sudah kami tulis`.",
        ],
        pronunciation_focus_en: [
          "NA-ma BA-yi SOO-dah KA-mi TOO-lis se-SOO-ai KAR-too ke-LOO-ar-ga - `sesuai` = according to/matching; `kartu keluarga` = family card.",
          "`sudah kami tulis` is a formal passive-like structure: has been written by us.",
          "VN-speaker trap: putting `sudah` at the end like Vietnamese 'rồi'. Indonesian usually puts it before the verb: `sudah kami tulis`.",
        ],
      },
      {
        en: "Apakah nama bayi masih bisa diperbaiki?",
        vi: "Tên em bé còn có thể sửa được không?",
        pronunciation_focus: [
          "a-pa-KAH NA-ma BA-yi MA-sih BI-sa di-per-BA-i-ki - `diperbaiki` = được sửa/chỉnh lại.",
          "`masih bisa` = vẫn còn có thể. Câu này hữu ích nếu phát hiện lỗi chính tả trước khi hồ sơ xong.",
          "Lỗi người Việt: nói `bisa perbaiki` khi tên là thứ được sửa. Dạng tự nhiên là bị động `bisa diperbaiki`.",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH NA-ma BA-yi MA-sih BEE-sa di-per-BA-ee-kee - `diperbaiki` = be corrected/fixed.",
          "`masih bisa` = still can. This is useful if you find a spelling error before the application is finished.",
          "VN-speaker trap: saying `bisa perbaiki` when the name is being corrected. Natural form: passive `bisa diperbaiki`.",
        ],
      },
      {
        en: "Kami perlu menambahkan bayi ke kartu keluarga.",
        vi: "Chúng tôi cần thêm em bé vào thẻ gia đình.",
        pronunciation_focus: [
          "KA-mi PER-lu me-nam-BAH-kan BA-yi ke KAR-tu ke-LU-ar-ga - `menambahkan` = thêm vào; `ke kartu keluarga` = vào thẻ gia đình.",
          "`KK` là viết tắt của `kartu keluarga`, thường được đọc từng chữ: ka-ka.",
          "Lỗi người Việt: dịch 'hộ khẩu' trực tiếp. Ở Indonesia, giấy chính là `kartu keluarga` hoặc `KK`.",
        ],
        pronunciation_focus_en: [
          "KA-mi PER-loo me-nam-BAH-kan BA-yi ke KAR-too ke-LOO-ar-ga - `menambahkan` = add; `ke kartu keluarga` = onto the family card.",
          "`KK` abbreviates `kartu keluarga`, usually spelled out as ka-ka.",
          "VN-speaker trap: translating Vietnamese household registration directly. In Indonesia, the document is `kartu keluarga` or `KK`.",
        ],
      },
      {
        en: "Dokumen orang tua sudah lengkap.",
        vi: "Giấy tờ của cha mẹ đã đầy đủ.",
        pronunciation_focus: [
          "do-ku-MEN O-rang TU-a SU-dah LENG-kap - `dokumen orang tua` = giấy tờ của cha mẹ; `lengkap` = đầy đủ.",
          "`orang tua` trong ngữ cảnh này là cha mẹ, không phải người già.",
          "Lỗi người Việt: hiểu `orang tua` là người lớn tuổi. Trong hồ sơ trẻ em, `orang tua` thường là bố mẹ.",
        ],
        pronunciation_focus_en: [
          "do-koo-MEN O-rang TOO-a SOO-dah LENG-kap - `dokumen orang tua` = parents' documents; `lengkap` = complete.",
          "`orang tua` in this context means parents, not elderly people.",
          "VN-speaker trap: reading `orang tua` as old people. In child paperwork, `orang tua` usually means parents.",
        ],
      },
      {
        en: "Petugas catatan sipil meminta fotokopi KTP orang tua.",
        vi: "Nhân viên hộ tịch yêu cầu bản sao căn cước của cha mẹ.",
        pronunciation_focus: [
          "pe-TU-gas ca-TA-tan SI-pil me-MIN-ta FO-to-ko-pi KA-TE-PE O-rang TU-a - `petugas` = nhân viên; `catatan sipil` = hộ tịch.",
          "`KTP` đọc từng chữ ka-te-pe. Người nước ngoài có thể cần hộ chiếu/KITAS tùy tình huống.",
          "Lỗi người Việt: nói `copy` kiểu tiếng Anh. Ở văn phòng Indonesia, `fotokopi` rất phổ biến.",
        ],
        pronunciation_focus_en: [
          "pe-TOO-gas cha-TA-tan SEE-pil me-MIN-ta FO-to-ko-pee KA-TE-PE O-rang TOO-a - `petugas` = officer; `catatan sipil` = civil registry.",
          "`KTP` is spelled ka-te-pe. Foreigners may need a passport/KITAS depending on the situation.",
          "VN-speaker trap: saying English-style `copy`. In Indonesian offices, `fotokopi` is very common.",
        ],
      },
      {
        en: "Kapan NIK bayi akan keluar?",
        vi: "Khi nào NIK của em bé sẽ được cấp?",
        pronunciation_focus: [
          "KA-pan EN-I-KA BA-yi A-kan KE-lu-ar - `NIK` = số định danh dân cư; `keluar` = được cấp/ra kết quả.",
          "`akan keluar` trong hành chính nghĩa là sẽ có kết quả/sẽ được phát hành, không phải đi ra ngoài.",
          "Lỗi người Việt: dịch `keluar` chỉ là 'đi ra'. Trong giấy tờ, `akta keluar` hoặc `NIK keluar` nghĩa là giấy/số đã có.",
        ],
        pronunciation_focus_en: [
          "KA-pan EN-EE-KA BA-yi A-kan KE-loo-ar - `NIK` = population identity number; `keluar` = be issued/come out.",
          "`akan keluar` in administration means the result/document will be issued, not physically go outside.",
          "VN-speaker trap: translating `keluar` only as 'go out'. In paperwork, `akta keluar` or `NIK keluar` means the document/number is issued.",
        ],
      },
      {
        en: "Tolong kabari kami kalau akta kelahiran sudah jadi.",
        vi: "Làm ơn báo cho chúng tôi nếu giấy khai sinh đã xong.",
        pronunciation_focus: [
          "TO-long ka-BA-ri KA-mi KA-lau AK-ta ke-la-HIR-an SU-dah JA-di - `sudah jadi` = đã xong/đã làm xong; `kabari` = báo tin cho.",
          "`kalau` = nếu/khi; trong câu này nghe tự nhiên và thân thiện hơn `apabila`.",
          "Lỗi người Việt: dịch 'báo chúng tôi' thành `lapor kami`. Với cập nhật hồ sơ, nói `kabari kami` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "TO-long ka-BA-ree KA-mi KA-lau AK-ta ke-la-HEER-an SOO-dah JA-dee - `sudah jadi` = ready/finished; `kabari` = let someone know.",
          "`kalau` = if/when; here it sounds more natural and friendly than `apabila`.",
          "VN-speaker trap: translating 'report to us' as `lapor kami`. For application updates, `kabari kami` is more natural.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, giấy chứng sinh từ bệnh viện hoặc nơi sinh thường là một phần hồ sơ để làm `akta kelahiran`. Hồ sơ có thể liên quan đến `catatan sipil`/Dukcapil, `kartu keluarga`, giấy tờ cha mẹ, và thông tin tên em bé. `NIK` là số định danh dân cư; trẻ có thể được thêm vào `kartu keluarga` sau khi hồ sơ được xử lý. Yêu cầu chi tiết có thể khác theo địa phương và tình trạng quốc tịch, nên câu an toàn nhất ở quầy là `Apa saja syarat dokumennya?`",
    cultural_notes_en:
      "In Indonesia, the hospital or birth-place letter is commonly part of the file for an `akta kelahiran`. The application may involve `catatan sipil`/Dukcapil, the `kartu keluarga`, parents' documents, and the baby's name details. `NIK` is the population identity number; a child may be added to the `kartu keluarga` after processing. Exact requirements can vary by locality and citizenship status, so the safest counter question is `Apa saja syarat dokumennya?`",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `surat lahir` = giấy chứng sinh từ bệnh viện và `akta kelahiran` = giấy khai sinh chính thức. `Orang tua` trong hồ sơ trẻ em là cha mẹ. Khi hỏi tiến độ, dùng `sudah jadi?`, `kapan keluar?`, và `tolong kabari kami`. Khi nói tên trên giấy tờ, dùng `sesuai` để nhấn mạnh đúng theo hồ sơ.",
    tip_advice_en:
      "Tip for Vietnamese speakers: separate `surat lahir` = hospital birth letter from `akta kelahiran` = official birth certificate. `Orang tua` in child paperwork means parents. To ask progress, use `sudah jadi?`, `kapan keluar?`, and `tolong kabari kami`. For names on documents, use `sesuai` to stress that it matches the paperwork.",
    vocabulary: [
      { word: "akta kelahiran", en: "birth certificate", vi: "giấy khai sinh", pos: "noun phrase", pronunciation_vi: "AK-ta ke-la-HIR-an", pronunciation_en: "AK-ta ke-la-HEER-an" },
      { word: "surat lahir", en: "birth letter / hospital birth certificate", vi: "giấy chứng sinh", pos: "noun phrase", pronunciation_vi: "SU-rat LA-hir", pronunciation_en: "SOO-rat LA-hir" },
      { word: "nama bayi", en: "baby's name", vi: "tên em bé", pos: "noun phrase", pronunciation_vi: "NA-ma BA-yi", pronunciation_en: "NA-ma BA-yi" },
      { word: "rumah sakit", en: "hospital", vi: "bệnh viện", pos: "noun phrase", pronunciation_vi: "RU-mah SA-kit", pronunciation_en: "ROO-mah SA-kit" },
      { word: "kartu keluarga", en: "family card", vi: "thẻ hộ gia đình", pos: "noun phrase", pronunciation_vi: "KAR-tu ke-LU-ar-ga", pronunciation_en: "KAR-too ke-LOO-ar-ga" },
      { word: "catatan sipil", en: "civil registry", vi: "cơ quan hộ tịch", pos: "noun phrase", pronunciation_vi: "ca-TA-tan SI-pil", pronunciation_en: "cha-TA-tan SEE-pil" },
      { word: "NIK", en: "population identity number", vi: "số định danh dân cư", pos: "noun", pronunciation_vi: "EN-I-KA", pronunciation_en: "EN-EE-KA" },
      { word: "dokumen orang tua", en: "parents' documents", vi: "giấy tờ của cha mẹ", pos: "noun phrase", pronunciation_vi: "do-ku-MEN O-rang TU-a", pronunciation_en: "do-koo-MEN O-rang TOO-a" },
      { word: "sudah jadi", en: "ready / finished", vi: "đã xong", pos: "phrase", pronunciation_vi: "SU-dah JA-di", pronunciation_en: "SOO-dah JA-dee" },
      { word: "fotokopi", en: "photocopy", vi: "bản sao photocopy", pos: "noun", pronunciation_vi: "FO-to-ko-pi", pronunciation_en: "FO-to-ko-pee" },
    ],
    dialogue: [
      {
        speaker: "Ayah",
        text: "Selamat pagi, kami mau mengurus akta kelahiran bayi.",
        vi: "Chào buổi sáng, chúng tôi muốn làm giấy khai sinh cho em bé.",
        en: "Good morning, we want to process the baby's birth certificate.",
      },
      {
        speaker: "Petugas",
        text: "Apakah sudah membawa surat lahir dari rumah sakit?",
        vi: "Anh/chị đã mang giấy chứng sinh từ bệnh viện chưa?",
        en: "Have you brought the birth letter from the hospital?",
      },
      {
        speaker: "Ibu",
        text: "Sudah. Ini surat lahir, kartu keluarga, dan dokumen orang tua.",
        vi: "Rồi. Đây là giấy chứng sinh, thẻ gia đình và giấy tờ của cha mẹ.",
        en: "Yes. Here are the birth letter, family card, and parents' documents.",
      },
      {
        speaker: "Petugas",
        text: "Baik, nanti NIK bayi akan keluar setelah data diproses.",
        vi: "Được, lát nữa NIK của em bé sẽ được cấp sau khi dữ liệu được xử lý.",
        en: "Okay, the baby's NIK will be issued after the data is processed.",
      },
      {
        speaker: "Ayah",
        text: "Tolong kabari kami kalau akta kelahiran sudah jadi.",
        vi: "Làm ơn báo cho chúng tôi nếu giấy khai sinh đã xong.",
        en: "Please let us know when the birth certificate is ready.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "akta kelahiran", answer: "giấy khai sinh" },
          { prompt: "surat lahir", answer: "giấy chứng sinh" },
          { prompt: "kartu keluarga", answer: "thẻ hộ gia đình" },
          { prompt: "dokumen orang tua", answer: "giấy tờ của cha mẹ" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Chúng tôi muốn làm giấy khai sinh cho em bé.", answer: "Kami mau mengurus akta kelahiran bayi." },
          { prompt: "Đây là giấy chứng sinh từ bệnh viện.", answer: "Ini surat lahir dari rumah sakit." },
          { prompt: "Khi nào NIK của em bé sẽ được cấp?", answer: "Kapan NIK bayi akan keluar?" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu.",
        instruction_en: "Fill in the missing word.",
        items: [
          { prompt: "Nama bayi sudah kami tulis ___ kartu keluarga.", answer: "sesuai" },
          { prompt: "Dokumen orang tua sudah ___.", answer: "lengkap" },
          { prompt: "Tolong ___ kami kalau aktanya sudah jadi.", answer: "kabari" },
        ],
      },
    ],
  },
];
