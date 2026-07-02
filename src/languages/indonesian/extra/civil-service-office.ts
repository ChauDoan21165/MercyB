// Civil service office Indonesian (Vietnamese -> Indonesian study track).
//
// A2 Wave 23 file. Covers kantor dinas, pelayanan publik, formulir, loket,
// nomor antrean, persyaratan, tanda tangan, and verifikasi.
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
    id: "indonesian_civil_service_office",
    level: "A2",
    category: "life_admin",
    title_vi: "Làm việc ở văn phòng dịch vụ công",
    title_en: "At a civil service office",
    sentences: [
      {
        en: "Saya mau mengurus dokumen di kantor dinas.",
        vi: "Tôi muốn làm thủ tục giấy tờ ở văn phòng sở/cơ quan.",
        pronunciation_focus: [
          "SA-ya mau me-NGU-rus do-ku-MEN di KAN-tor DI-nas - `mengurus dokumen` = lo/làm thủ tục giấy tờ; `kantor dinas` = văn phòng cơ quan/sở.",
          "`dinas` thường là cơ quan chính quyền địa phương theo lĩnh vực, như dinas kependudukan hoặc dinas sosial.",
          "Lỗi người Việt: dịch `office` thành `ofis`. Trong hành chính, dùng `kantor`.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau me-NGOO-rus do-koo-MEN dee KAN-tor DEE-nas - `mengurus dokumen` = handle paperwork; `kantor dinas` = government agency office.",
          "`dinas` is often a local government agency by sector, such as population/civil records or social services.",
          "VN-speaker trap: translating office as `ofis`. In administration, use `kantor`.",
        ],
      },
      {
        en: "Pelayanan publik buka dari jam delapan pagi.",
        vi: "Dịch vụ công mở cửa từ tám giờ sáng.",
        pronunciation_focus: [
          "pe-la-YA-nan PUB-lik BU-ka da-ri jam de-LA-pan PA-gi - `pelayanan publik` = dịch vụ công; `buka` = mở cửa.",
          "`dari jam delapan pagi` = từ 8 giờ sáng. Khi hỏi giờ làm việc, có thể hỏi `Buka jam berapa?`.",
          "Lỗi người Việt: nói `servis publik` nghe lai tiếng Anh. Cụm tự nhiên là `pelayanan publik`.",
        ],
        pronunciation_focus_en: [
          "pe-la-YA-nan POOB-lik BOO-ka da-ree jam de-LA-pan PA-gee - `pelayanan publik` = public service; `buka` = opens.",
          "`dari jam delapan pagi` = from 8 a.m. To ask office hours, say `Buka jam berapa?`.",
          "VN-speaker trap: saying English-like `servis publik`. Natural Indonesian is `pelayanan publik`.",
        ],
      },
      {
        en: "Saya harus mengambil nomor antrean dulu.",
        vi: "Tôi phải lấy số thứ tự xếp hàng trước.",
        pronunciation_focus: [
          "SA-ya HA-rus me-NGAM-bil NO-mor an-TRE-an DU-lu - `nomor antrean` = số thứ tự xếp hàng; `dulu` = trước.",
          "`antrean` cũng có thể viết/nghe là `antrian` trong nói thường, nhưng `antrean` là dạng chuẩn hơn.",
          "Lỗi người Việt: bỏ `nomor` và chỉ nói `ambil antrean`. Người nghe hiểu, nhưng `ambil nomor antrean` rõ hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya HA-roos meh-NGAM-bil NO-mor an-TRE-an DOO-loo - `nomor antrean` = queue number; `dulu` = first.",
          "`antrean` may also appear as `antrian` in casual use, but `antrean` is the more standard form.",
          "VN-speaker trap: dropping `nomor` and saying only `ambil antrean`. Understood, but `ambil nomor antrean` is clearer.",
        ],
      },
      {
        en: "Loket verifikasi ada di sebelah kanan.",
        vi: "Quầy xác minh ở bên phải.",
        pronunciation_focus: [
          "LO-ket ve-ri-fi-KA-si A-da di se-BE-lah KA-nan - `loket` = quầy; `verifikasi` = xác minh/kiểm tra hồ sơ.",
          "`di sebelah kanan` = ở bên phải. Cụm này hữu ích khi hỏi đường trong cơ quan.",
          "Lỗi người Việt: đọc `verifikasi` theo tiếng Anh. Nhấn tự nhiên gần cuối: ve-ri-fi-KA-si.",
        ],
        pronunciation_focus_en: [
          "LO-ket veh-ree-fee-KA-see A-da dee se-BE-lah KA-nan - `loket` = counter/window; `verifikasi` = verification.",
          "`di sebelah kanan` = on the right side. Useful for directions inside offices.",
          "VN-speaker trap: reading `verifikasi` like English. Natural stress is near the end: veh-ree-fee-KA-see.",
        ],
      },
      {
        en: "Formulir ini harus diisi dengan huruf kapital.",
        vi: "Mẫu này phải được điền bằng chữ in hoa.",
        pronunciation_focus: [
          "for-mu-LIR I-ni HA-rus di-I-si DE-ngan HU-ruf ka-pi-TAL - `formulir` = biểu mẫu; `diisi` = được điền; `huruf kapital` = chữ in hoa.",
          "`diisi` là bị động từ `isi`. Trong hướng dẫn giấy tờ, dạng bị động rất phổ biến.",
          "Lỗi người Việt: dùng `tulis formulir`. Nói tự nhiên hơn: `mengisi formulir` hoặc `formulir diisi`.",
        ],
        pronunciation_focus_en: [
          "for-moo-LEER EE-nee HA-roos dee-EE-see DE-ngan HOO-roof ka-pee-TAL - `formulir` = form; `diisi` = filled in; `huruf kapital` = capital letters.",
          "`diisi` is the passive form of `isi`. Passive instructions are common in paperwork.",
          "VN-speaker trap: saying `tulis formulir`. More natural: `mengisi formulir` or `formulir diisi`.",
        ],
      },
      {
        en: "Apa saja persyaratan untuk pengajuan ini?",
        vi: "Các yêu cầu/hồ sơ cần thiết cho đơn này gồm những gì?",
        pronunciation_focus: [
          "A-pa SA-ja per-sya-RA-tan UN-tuk pe-nga-JU-an I-ni - `persyaratan` = yêu cầu/điều kiện/hồ sơ cần có; `pengajuan` = việc nộp đơn/đề nghị.",
          "`apa saja` hỏi danh sách nhiều mục. Câu này an toàn ở mọi quầy dịch vụ công.",
          "Lỗi người Việt: hỏi `syarat apa?` được, nhưng `Apa saja persyaratan...` lịch sự và đầy đủ hơn.",
        ],
        pronunciation_focus_en: [
          "A-pa SA-ja per-sya-RA-tan OON-took pe-nga-JOO-an EE-nee - `persyaratan` = requirements; `pengajuan` = application/submission.",
          "`apa saja` asks for a list of items. This is safe at almost any public-service counter.",
          "VN-speaker note: `syarat apa?` works, but `Apa saja persyaratan...` is more polite and complete.",
        ],
      },
      {
        en: "Fotokopi KTP dan paspor perlu dilampirkan.",
        vi: "Bản sao KTP và hộ chiếu cần được đính kèm.",
        pronunciation_focus: [
          "FO-to-ko-pi KA-TE-PE dan PAS-por PER-lu di-lam-PIR-kan - `fotokopi` = bản sao; `dilampirkan` = được đính kèm.",
          "`KTP` đọc từng chữ: ka-te-pe. Người nước ngoài có thể cần hộ chiếu hoặc giấy izin tinggal tùy hồ sơ.",
          "Lỗi người Việt: nói English `copy`. Ở văn phòng Indonesia, `fotokopi` rất phổ biến.",
        ],
        pronunciation_focus_en: [
          "FO-to-ko-pee KA-TE-PE dan PAS-por PER-loo dee-lam-PEER-kan - `fotokopi` = photocopy; `dilampirkan` = attached.",
          "`KTP` is spelled out ka-te-pe. Foreigners may need a passport or stay permit depending on the application.",
          "VN-speaker trap: saying English `copy`. In Indonesian offices, `fotokopi` is very common.",
        ],
      },
      {
        en: "Tolong tanda tangan di bagian bawah formulir.",
        vi: "Vui lòng ký tên ở phần dưới của mẫu.",
        pronunciation_focus: [
          "TO-long TAN-da TA-ngan di BA-gi-an BA-wah for-mu-LIR - `tanda tangan` = chữ ký/ký tên; `bagian bawah` = phần dưới.",
          "`tanda tangan` vừa là danh từ 'chữ ký', vừa dùng như động từ trong nói thường: `tanda tangan di sini`.",
          "Lỗi người Việt: dịch 'ký' thành `menulis nama`. Ký tên là `tanda tangan`.",
        ],
        pronunciation_focus_en: [
          "TO-long TAN-da TA-ngan dee BA-gee-an BA-wah for-moo-LEER - `tanda tangan` = signature/sign; `bagian bawah` = lower section.",
          "`tanda tangan` is both a noun 'signature' and a common verb-like phrase: `tanda tangan di sini`.",
          "VN-speaker trap: translating 'sign' as `menulis nama`. Signing is `tanda tangan`.",
        ],
      },
      {
        en: "Petugas akan memverifikasi data saya.",
        vi: "Nhân viên sẽ xác minh dữ liệu của tôi.",
        pronunciation_focus: [
          "pe-TU-gas A-kan mem-ve-ri-fi-KA-si DA-ta SA-ya - `petugas` = nhân viên/cán bộ; `memverifikasi` = xác minh.",
          "`data` trong tiếng Indonesia thường đọc DA-ta, không phải `dei-ta` như tiếng Anh.",
          "Lỗi người Việt: nói `cek data` được trong nói thường, nhưng `memverifikasi data` hợp với ngữ cảnh hành chính hơn.",
        ],
        pronunciation_focus_en: [
          "pe-TOO-gas A-kan mem-veh-ree-fee-KA-see DA-ta SA-ya - `petugas` = officer/staff; `memverifikasi` = verify.",
          "`data` in Indonesian is commonly DA-ta, not English `day-ta`.",
          "VN-speaker note: `cek data` is fine casually, but `memverifikasi data` fits administrative contexts better.",
        ],
      },
      {
        en: "Kalau dokumen belum lengkap, saya bisa kembali besok.",
        vi: "Nếu giấy tờ chưa đầy đủ, tôi có thể quay lại ngày mai.",
        pronunciation_focus: [
          "KA-lau do-ku-MEN be-LUM LENG-kap, SA-ya BI-sa kem-BA-li BE-sok - `belum lengkap` = chưa đầy đủ; `kembali besok` = quay lại ngày mai.",
          "`kalau` = nếu/khi. Đây là cách nói mềm khi hồ sơ còn thiếu.",
          "Lỗi người Việt: đặt `belum` ở cuối như tiếng Việt 'chưa'. Tiếng Indonesia đặt trước tính từ/động từ: `belum lengkap`.",
        ],
        pronunciation_focus_en: [
          "KA-lau do-koo-MEN be-LOOM LENG-kap, SA-ya BEE-sa kem-BA-lee BE-sok - `belum lengkap` = not complete yet; `kembali besok` = return tomorrow.",
          "`kalau` = if/when. This is a soft way to handle incomplete paperwork.",
          "VN-speaker trap: placing `belum` at the end like Vietnamese 'chưa'. Indonesian puts it before the adjective/verb: `belum lengkap`.",
        ],
      },
      {
        en: "Apakah saya akan mendapat tanda terima?",
        vi: "Tôi sẽ nhận được biên nhận không?",
        pronunciation_focus: [
          "a-PA-kah SA-ya A-kan men-DA-pat TAN-da te-RI-ma - `tanda terima` = biên nhận/phiếu nhận hồ sơ.",
          "`mendapat` = nhận được. Hỏi câu này giúp bạn có bằng chứng đã nộp hồ sơ.",
          "Lỗi người Việt: dịch `receipt` thành `resi` trong mọi ngữ cảnh. Với hồ sơ ở cơ quan, `tanda terima` thường rõ hơn.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah SA-ya A-kan men-DA-pat TAN-da te-REE-ma - `tanda terima` = receipt/acknowledgment slip.",
          "`mendapat` = receive/get. This question helps you get proof that your application was submitted.",
          "VN-speaker trap: translating receipt as `resi` everywhere. For office paperwork, `tanda terima` is often clearer.",
        ],
      },
      {
        en: "Kapan hasil verifikasi bisa saya ambil?",
        vi: "Khi nào tôi có thể lấy kết quả xác minh?",
        pronunciation_focus: [
          "KA-pan HA-sil ve-ri-fi-KA-si BI-sa SA-ya AM-bil - `hasil verifikasi` = kết quả xác minh; `ambil` = lấy.",
          "`bisa saya ambil` là dạng lịch sự: có thể được tôi lấy. Hợp với hỏi kết quả giấy tờ.",
          "Lỗi người Việt: hỏi `kapan ada?` quá ngắn. `Kapan hasil verifikasi bisa saya ambil?` rõ hơn.",
        ],
        pronunciation_focus_en: [
          "KA-pan HA-sil veh-ree-fee-KA-see BEE-sa SA-ya AM-bil - `hasil verifikasi` = verification result; `ambil` = pick up.",
          "`bisa saya ambil` is a polite structure: can be picked up by me. It fits paperwork-result questions.",
          "VN-speaker trap: asking the too-short `kapan ada?`. `Kapan hasil verifikasi bisa saya ambil?` is clearer.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở văn phòng dịch vụ công Indonesia, quy trình thường bắt đầu bằng lấy `nomor antrean`, hỏi `loket` đúng, điền `formulir`, nộp `persyaratan`, ký `tanda tangan`, rồi chờ `verifikasi`. Cách nói nên lịch sự, ngắn gọn, và cụ thể. Nếu chưa rõ yêu cầu, câu an toàn nhất là `Apa saja persyaratan untuk pengajuan ini?` và xin `tanda terima` sau khi nộp hồ sơ.",
    cultural_notes_en:
      "At Indonesian public-service offices, the process often starts with taking a queue number, finding the correct counter, filling in a form, submitting requirements, signing, and waiting for verification. Keep your language polite, concise, and specific. If requirements are unclear, the safest question is `Apa saja persyaratan untuk pengajuan ini?` and ask for a receipt after submission.",
    tip_advice_vi:
      "Mẫu câu an toàn ở quầy: `Selamat pagi, saya mau mengurus dokumen ini. Apa saja persyaratannya, dan loket verifikasi ada di mana?` Nếu hồ sơ thiếu: `Kalau dokumen belum lengkap, saya bisa kembali besok.`",
    tip_advice_en:
      "Safe counter template: `Selamat pagi, saya mau mengurus dokumen ini. Apa saja persyaratannya, dan loket verifikasi ada di mana?` If documents are incomplete: `Kalau dokumen belum lengkap, saya bisa kembali besok.`",
    vocabulary: [
      {
        word: "kantor dinas",
        en: "government agency office",
        vi: "văn phòng cơ quan/sở",
        pos: "noun",
        pronunciation_vi: "KAN-tor DI-nas",
        pronunciation_en: "KAN-tor DEE-nas",
      },
      {
        word: "pelayanan publik",
        en: "public service",
        vi: "dịch vụ công",
        pos: "noun",
        pronunciation_vi: "pe-la-YA-nan PUB-lik",
        pronunciation_en: "pe-la-YA-nan POOB-lik",
      },
      {
        word: "formulir",
        en: "form",
        vi: "biểu mẫu",
        pos: "noun",
        pronunciation_vi: "for-mu-LIR",
        pronunciation_en: "for-moo-LEER",
      },
      {
        word: "loket",
        en: "service counter",
        vi: "quầy dịch vụ",
        pos: "noun",
        pronunciation_vi: "LO-ket",
        pronunciation_en: "LO-ket",
      },
      {
        word: "nomor antrean",
        en: "queue number",
        vi: "số thứ tự xếp hàng",
        pos: "noun",
        pronunciation_vi: "NO-mor an-TRE-an",
        pronunciation_en: "NO-mor an-TRE-an",
      },
      {
        word: "persyaratan",
        en: "requirements",
        vi: "yêu cầu/hồ sơ cần có",
        pos: "noun",
        pronunciation_vi: "per-sya-RA-tan",
        pronunciation_en: "per-sya-RA-tan",
      },
      {
        word: "tanda tangan",
        en: "signature; to sign",
        vi: "chữ ký; ký tên",
        pos: "noun/verb phrase",
        pronunciation_vi: "TAN-da TA-ngan",
        pronunciation_en: "TAN-da TA-ngan",
      },
      {
        word: "verifikasi",
        en: "verification",
        vi: "xác minh",
        pos: "noun",
        pronunciation_vi: "ve-ri-fi-KA-si",
        pronunciation_en: "veh-ree-fee-KA-see",
      },
      {
        word: "tanda terima",
        en: "receipt; acknowledgment slip",
        vi: "biên nhận/phiếu nhận hồ sơ",
        pos: "noun",
        pronunciation_vi: "TAN-da te-RI-ma",
        pronunciation_en: "TAN-da te-REE-ma",
      },
      {
        word: "belum lengkap",
        en: "not complete yet",
        vi: "chưa đầy đủ",
        pos: "phrase",
        pronunciation_vi: "be-LUM LENG-kap",
        pronunciation_en: "be-LOOM LENG-kap",
      },
    ],
    dialogue: [
      {
        speaker: "Pemohon",
        text: "Selamat pagi, saya mau mengurus dokumen di kantor dinas ini.",
        vi: "Chào buổi sáng, tôi muốn làm thủ tục giấy tờ ở cơ quan này.",
        en: "Good morning, I would like to handle paperwork at this office.",
      },
      {
        speaker: "Petugas",
        text: "Silakan ambil nomor antrean dulu, lalu ke loket verifikasi.",
        vi: "Vui lòng lấy số thứ tự trước, rồi đến quầy xác minh.",
        en: "Please take a queue number first, then go to the verification counter.",
      },
      {
        speaker: "Pemohon",
        text: "Apa saja persyaratan untuk pengajuan ini?",
        vi: "Các yêu cầu/hồ sơ cần thiết cho đơn này gồm những gì?",
        en: "What are the requirements for this application?",
      },
      {
        speaker: "Petugas",
        text: "Isi formulir, lampirkan fotokopi KTP atau paspor, lalu tanda tangan di bawah.",
        vi: "Điền mẫu, đính kèm bản sao KTP hoặc hộ chiếu, rồi ký ở bên dưới.",
        en: "Fill in the form, attach a photocopy of your ID card or passport, then sign at the bottom.",
      },
      {
        speaker: "Pemohon",
        text: "Kalau dokumen belum lengkap, apakah saya bisa kembali besok?",
        vi: "Nếu giấy tờ chưa đầy đủ, tôi có thể quay lại ngày mai không?",
        en: "If the documents are not complete yet, can I return tomorrow?",
      },
      {
        speaker: "Petugas",
        text: "Bisa. Setelah lengkap, kami akan memverifikasi data Anda.",
        vi: "Được. Sau khi đầy đủ, chúng tôi sẽ xác minh dữ liệu của bạn.",
        en: "Yes. Once complete, we will verify your data.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi phải lấy số thứ tự trước.",
        prompt_en: "Translate into Indonesian: I have to take a queue number first.",
        answer: "Saya harus mengambil nomor antrean dulu.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Formulir ini harus ___ dengan huruf kapital.",
        prompt_en: "Fill in the blank: Formulir ini harus ___ dengan huruf kapital.",
        answer: "diisi",
      },
      {
        type: "choice",
        prompt_vi: "Câu nào tự nhiên nhất khi hỏi danh sách yêu cầu hồ sơ?",
        prompt_en: "Which sentence is most natural for asking the list of document requirements?",
        options: [
          "Apa saja persyaratan untuk pengajuan ini?",
          "Syarat apa saja saya mau?",
          "Dokumen bikin apa?",
        ],
        answer: "Apa saja persyaratan untuk pengajuan ini?",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm từ Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match each Indonesian phrase with its Vietnamese meaning.",
        pairs: [
          ["loket", "quầy dịch vụ"],
          ["tanda tangan", "chữ ký/ký tên"],
          ["tanda terima", "biên nhận"],
        ],
      },
    ],
    content:
      "Use this lesson for practical public-service office visits in Indonesia: taking a queue number, finding the right counter, filling in forms, asking about requirements, signing, attaching documents, and asking when verification results can be collected.",
  },
];
