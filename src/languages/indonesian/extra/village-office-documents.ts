// Village Office Documents Indonesian (Vietnamese -> Indonesian study track).
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
    id: "indonesian_village_office_documents",
    level: "A2",
    category: "public_services",
    title_vi: "Giấy tờ ở kantor desa: domisili, RT/RW và stempel",
    title_en: "Village office documents: domicile letters, RT/RW and stamps",
    sentences: [
      {
        en: "Saya mau mengurus surat keterangan di kantor desa.",
        vi: "Tôi muốn làm giấy xác nhận ở văn phòng xã/thôn.",
        pronunciation_focus: [
          "SA-ya mau me-ngu-RUS SU-rat ke-te-RANG-an di KAN-tor DE-sa -- `mengurus` = làm/lo thủ tục; `surat keterangan` = giấy xác nhận.",
          "Lỗi người Việt: nói `membuat surat` được hiểu, nhưng văn cảnh hành chính tự nhiên hơn là `mengurus surat`.",
          "Luyện: `Saya mau mengurus surat keterangan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau me-ngu-RUS SOO-rat ke-te-RANG-an di KAN-tor DE-sa -- `mengurus` = handle/process paperwork; `surat keterangan` = certificate/statement letter.",
          "VN-speaker trap: `membuat surat` is understood, but in admin contexts `mengurus surat` sounds more natural.",
          "Drill: `Saya mau mengurus surat keterangan.`",
        ],
      },
      {
        en: "Saya perlu surat domisili untuk pendaftaran.",
        vi: "Tôi cần giấy xác nhận cư trú để đăng ký.",
        pronunciation_focus: [
          "SA-ya per-LU SU-rat do-mi-SI-li UN-tuk pen-daf-TA-ran -- `domisili` = nơi cư trú; `pendaftaran` = việc đăng ký.",
          "`perlu + danh từ` = cần cái gì; không cần động từ 'có' như tiếng Việt.",
          "Luyện: `Saya perlu surat domisili.`",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LOO SOO-rat do-mi-SEE-li OON-tuk pen-daf-TA-ran -- `domisili` = domicile/residence; `pendaftaran` = registration.",
          "`Perlu + noun` = need something; no extra 'have' verb is needed.",
          "Drill: `Saya perlu surat domisili.`",
        ],
      },
      {
        en: "Apakah harus minta tanda tangan RT dan RW dulu?",
        vi: "Có phải xin chữ ký RT và RW trước không?",
        pronunciation_focus: [
          "a-pa-KAH HA-rus MIN-ta TAN-da TA-ngan er-te dan er-we DU-lu -- `tanda tangan` = chữ ký/ký tên.",
          "Mẹo: `RT` và `RW` đọc theo chữ cái Indonesia: `er-te`, `er-we`, không đọc kiểu tiếng Anh.",
          "Luyện: `Harus minta tanda tangan RT dan RW dulu?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH HA-rus MIN-ta TAN-da TA-ngan er-te dan er-we DOO-loo -- `tanda tangan` = signature/to sign.",
          "Tip: `RT` and `RW` are read with Indonesian letter names: `er-te`, `er-we`, not English-style.",
          "Drill: `Harus minta tanda tangan RT dan RW dulu?`",
        ],
      },
      {
        en: "Pak Lurah sedang rapat, jadi saya harus menunggu.",
        vi: "Ông trưởng phường/xã đang họp, nên tôi phải chờ.",
        pronunciation_focus: [
          "Pak LU-rah se-DANG RA-pat, JA-di SA-ya HA-rus me-NUNG-gu -- `lurah` = trưởng đơn vị hành chính cấp kelurahan.",
          "`sedang + động từ` = đang làm gì: `sedang rapat`, `sedang keluar`, `sedang tanda tangan`.",
          "Luyện: `Pak Lurah sedang rapat.`",
        ],
        pronunciation_focus_en: [
          "Pak LOO-rah se-DANG RA-pat, JA-di SA-ya HA-rus me-NOONG-goo -- `lurah` = head of a kelurahan/local administrative office.",
          "`Sedang + verb` = currently doing something: `sedang rapat`, `sedang keluar`, `sedang tanda tangan`.",
          "Drill: `Pak Lurah sedang rapat.`",
        ],
      },
      {
        en: "Surat ini perlu stempel kantor desa.",
        vi: "Giấy này cần dấu của văn phòng xã/thôn.",
        pronunciation_focus: [
          "SU-rat I-ni per-LU STEM-pel KAN-tor DE-sa -- `stempel` = con dấu/dấu đóng; `kantor desa` = văn phòng xã/thôn.",
          "Lỗi người Việt: dùng `cap` theo tiếng Việt. Tiếng Indonesia văn phòng thường nói `stempel`.",
          "Luyện: `Surat ini perlu stempel.`",
        ],
        pronunciation_focus_en: [
          "SOO-rat EE-ni per-LOO STEM-pel KAN-tor DE-sa -- `stempel` = official stamp; `kantor desa` = village office.",
          "VN-speaker trap: borrowing Vietnamese `cap`. Indonesian office language commonly uses `stempel`.",
          "Drill: `Surat ini perlu stempel.`",
        ],
      },
      {
        en: "Tolong fotokopi KTP saya dua lembar.",
        vi: "Làm ơn photo căn cước KTP của tôi hai tờ.",
        pronunciation_focus: [
          "TO-long fo-to-KO-pi ka-te-pe SA-ya DU-a LEM-bar -- `fotokopi KTP` = bản photo KTP; `lembar` = tờ.",
          "Mẹo số lượng: giấy tờ dùng `lembar`: `satu lembar`, `dua lembar`, `tiga lembar`.",
          "Luyện: `Fotokopi KTP dua lembar.`",
        ],
        pronunciation_focus_en: [
          "TO-long fo-to-KO-pi ka-te-pe SA-ya DOO-a LEM-bar -- `fotokopi KTP` = photocopy of ID card; `lembar` = sheet/copy.",
          "Quantity tip: documents use `lembar`: `satu lembar`, `dua lembar`, `tiga lembar`.",
          "Drill: `Fotokopi KTP dua lembar.`",
        ],
      },
      {
        en: "Nama dan alamat saya sudah benar di surat ini.",
        vi: "Tên và địa chỉ của tôi đã đúng trên giấy này.",
        pronunciation_focus: [
          "NA-ma dan A-la-mat SA-ya SU-dah be-NAR di SU-rat I-ni -- `sudah benar` = đã đúng; `alamat` = địa chỉ.",
          "Trước khi ký, kiểm tra `nama`, `alamat`, `tanggal lahir`, và `nomor KTP`.",
          "Luyện: `Nama dan alamat saya sudah benar.`",
        ],
        pronunciation_focus_en: [
          "NA-ma dan A-la-mat SA-ya SOO-dah be-NAR di SOO-rat EE-ni -- `sudah benar` = already correct; `alamat` = address.",
          "Before signing, check `nama`, `alamat`, `tanggal lahir`, and `nomor KTP`.",
          "Drill: `Nama dan alamat saya sudah benar.`",
        ],
      },
      {
        en: "Kapan surat keterangan ini bisa diambil?",
        vi: "Khi nào có thể lấy giấy xác nhận này?",
        pronunciation_focus: [
          "KA-pan SU-rat ke-te-RANG-an I-ni BI-sa di-AM-bil -- `diambil` = được lấy/nhận lại.",
          "Trong dịch vụ hành chính, `ambil` thường nghĩa là quay lại lấy giấy đã xong.",
          "Luyện: `Kapan surat ini bisa diambil?`",
        ],
        pronunciation_focus_en: [
          "KA-pan SOO-rat ke-te-RANG-an EE-ni BEE-sa di-AM-bil -- `diambil` = picked up/collected.",
          "In administrative services, `ambil` often means returning to collect a finished document.",
          "Drill: `Kapan surat ini bisa diambil?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, nhiều giấy tờ địa phương bắt đầu từ cấp nhỏ: RT, RW, rồi `kantor desa` hoặc `kelurahan`. Người dân thường cần `surat pengantar` hoặc chữ ký RT/RW trước khi xin `surat keterangan` ở văn phòng. Giấy tờ chính thức thường cần `tanda tangan` của pejabat như `lurah` hoặc kepala desa và `stempel` cơ quan. Luôn mang KTP bản gốc, vài bản `fotokopi KTP`, và hỏi trước cần bao nhiêu `lembar`.",
    cultural_notes_en:
      "In Indonesia, many local documents start at the neighborhood level: RT, RW, then the village office or kelurahan. Residents may need an introduction letter or RT/RW signatures before requesting a certificate at the office. Official letters usually need a signature from an official such as the lurah or village head and an office stamp. Bring the original KTP, several photocopies, and ask how many copies are required.",
    tip_advice_vi:
      "Mẹo cho người Việt: nhóm từ hành chính quan trọng là `mengurus surat`, `surat keterangan`, `surat domisili`, `tanda tangan`, `stempel`, `fotokopi KTP`. Hỏi danh sách giấy tờ bằng `Dokumen apa saja yang harus saya bawa?` và hỏi thời gian bằng `Kapan bisa diambil?`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: key administrative chunks are `mengurus surat`, `surat keterangan`, `surat domisili`, `tanda tangan`, `stempel`, `fotokopi KTP`. Ask for the document list with `Dokumen apa saja yang harus saya bawa?` and timing with `Kapan bisa diambil?`.",
    vocabulary: [
      {
        word: "kantor desa",
        en: "village office",
        vi: "văn phòng xã/thôn",
        pos: "noun phrase",
        pronunciation_vi: "KAN-tor DE-sa",
        pronunciation_en: "KAN-tor DE-sa",
      },
      {
        word: "surat keterangan",
        en: "certificate / statement letter",
        vi: "giấy xác nhận",
        pos: "noun phrase",
        pronunciation_vi: "SU-rat ke-te-RANG-an",
        pronunciation_en: "SOO-rat ke-te-RANG-an",
      },
      {
        word: "domisili",
        en: "domicile / residence",
        vi: "nơi cư trú",
        pos: "noun",
        pronunciation_vi: "do-mi-SI-li",
        pronunciation_en: "do-mi-SEE-li",
      },
      {
        word: "RT/RW",
        en: "neighborhood/community units",
        vi: "đơn vị dân cư RT/RW",
        pos: "abbreviation",
        pronunciation_vi: "er-te / er-we",
        pronunciation_en: "er-te / er-we",
      },
      {
        word: "lurah",
        en: "local administrative head",
        vi: "trưởng phường/xã cấp kelurahan",
        pos: "noun",
        pronunciation_vi: "LU-rah",
        pronunciation_en: "LOO-rah",
      },
      {
        word: "tanda tangan",
        en: "signature / sign",
        vi: "chữ ký / ký tên",
        pos: "noun / verb phrase",
        pronunciation_vi: "TAN-da TA-ngan",
        pronunciation_en: "TAN-da TA-ngan",
      },
      {
        word: "stempel",
        en: "official stamp",
        vi: "con dấu",
        pos: "noun",
        pronunciation_vi: "STEM-pel",
        pronunciation_en: "STEM-pel",
      },
      {
        word: "fotokopi KTP",
        en: "photocopy of ID card",
        vi: "bản photo KTP",
        pos: "noun phrase",
        pronunciation_vi: "fo-to-KO-pi ka-te-pe",
        pronunciation_en: "fo-to-KO-pi ka-te-pe",
      },
      {
        word: "lembar",
        en: "sheet / copy",
        vi: "tờ / bản",
        pos: "classifier",
        pronunciation_vi: "LEM-bar",
        pronunciation_en: "LEM-bar",
      },
      {
        word: "diambil",
        en: "picked up / collected",
        vi: "được lấy / nhận lại",
        pos: "verb",
        pronunciation_vi: "di-AM-bil",
        pronunciation_en: "di-AM-bil",
      },
    ],
    dialogue: [
      {
        speaker: "Pemohon",
        text: "Permisi, Pak. Saya mau mengurus surat domisili.",
        vi: "Xin lỗi anh/chú. Tôi muốn làm giấy xác nhận cư trú.",
        en: "Excuse me, sir. I want to process a domicile letter.",
      },
      {
        speaker: "Petugas",
        text: "Sudah ada tanda tangan RT dan RW?",
        vi: "Đã có chữ ký RT và RW chưa?",
        en: "Do you already have the RT and RW signatures?",
      },
      {
        speaker: "Pemohon",
        text: "Sudah, Pak. Ini fotokopi KTP dua lembar.",
        vi: "Có rồi ạ. Đây là hai bản photo KTP.",
        en: "Yes, sir. Here are two photocopies of the KTP.",
      },
      {
        speaker: "Petugas",
        text: "Baik. Nanti suratnya perlu tanda tangan Pak Lurah dan stempel.",
        vi: "Được. Lát nữa giấy cần chữ ký ông lurah và con dấu.",
        en: "Okay. Later the letter needs the lurah's signature and stamp.",
      },
      {
        speaker: "Pemohon",
        text: "Kapan surat ini bisa diambil?",
        vi: "Khi nào có thể lấy giấy này?",
        en: "When can this letter be picked up?",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi cần giấy xác nhận cư trú để đăng ký.",
        prompt_en: "Translate into Indonesian: I need a domicile letter for registration.",
        answer: "Saya perlu surat domisili untuk pendaftaran.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Surat ini perlu ____ kantor desa.",
        prompt_en: "Fill in the blank: Surat ini perlu ____ kantor desa.",
        answer: "stempel",
      },
      {
        type: "matching",
        prompt_vi: "Ghép từ với nghĩa đúng.",
        prompt_en: "Match each word with the correct meaning.",
        pairs: [
          ["surat keterangan", "giấy xác nhận / certificate letter"],
          ["tanda tangan", "chữ ký / signature"],
          ["fotokopi KTP", "bản photo KTP / ID photocopy"],
          ["stempel", "con dấu / official stamp"],
        ],
      },
    ],
    content:
      "Useful village-office chunks: `Saya mau mengurus surat keterangan` (I want to process a certificate letter), `Saya perlu surat domisili` (I need a domicile letter), `Harus minta tanda tangan RT dan RW?` (must I get RT and RW signatures?), `Surat ini perlu stempel` (this letter needs a stamp), and `Kapan bisa diambil?` (when can it be picked up?).",
  },
];
