// Clinic pharmacy prescription Indonesian (Vietnamese -> Indonesian study track).
//
// A2 Wave 29 file. Covers resep dokter, tebus obat, apotek, dosis, aturan
// minum, obat generik, efek samping, and stok kosong.
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
    id: "indonesian_clinic_pharmacy_prescription",
    level: "A2",
    category: "health",
    title_vi: "Đổi đơn thuốc ở nhà thuốc",
    title_en: "Filling a doctor's prescription at the pharmacy",
    sentences: [
      {
        en: "Saya mau tebus resep dokter dari klinik.",
        vi: "Tôi muốn đổi/lấy thuốc theo đơn bác sĩ từ phòng khám.",
        pronunciation_focus: [
          "SA-ya mau TE-bus RE-sep DOK-ter da-ri KLI-nik - `tebus resep` = lấy thuốc theo đơn; `resep dokter` = đơn thuốc bác sĩ.",
          "`tebus obat/resep` rất tự nhiên ở apotek: nghĩa là đưa đơn và nhận thuốc, thường có thanh toán.",
          "Lỗi người Việt: nhầm `resep` với công thức nấu ăn. Ở apotek, `resep` = đơn thuốc.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau TEH-boos REH-sep DOK-ter da-ree KLEE-nik - `tebus resep` = fill a prescription; `resep dokter` = doctor's prescription.",
          "`Tebus obat/resep` is natural at pharmacies: hand in a prescription and receive the medicine, usually with payment.",
          "VN-speaker trap: confusing `resep` with a cooking recipe. At a pharmacy, `resep` = prescription.",
        ],
      },
      {
        en: "Apotek ini menerima resep digital?",
        vi: "Nhà thuốc này có nhận đơn thuốc điện tử không?",
        pronunciation_focus: [
          "a-PO-tek I-ni me-ne-RI-ma RE-sep di-gi-TAL - `apotek` = nhà thuốc; `resep digital` = đơn thuốc điện tử.",
          "`menerima` = nhận/chấp nhận. Trong nói nhanh cũng có thể hỏi `bisa resep digital?`.",
          "Lỗi người Việt: nói `apotik`; cách viết phổ biến trên biển hiệu là `apotek`.",
        ],
        pronunciation_focus_en: [
          "a-PO-tek EE-nee meh-neh-REE-ma REH-sep dee-gee-TAL - `apotek` = pharmacy; `resep digital` = digital prescription.",
          "`Menerima` = receive/accept. Casually you may also ask `bisa resep digital?`.",
          "VN-speaker trap: saying `apotik`; the common sign spelling is `apotek`.",
        ],
      },
      {
        en: "Obat yang diresepkan dokter masih tersedia?",
        vi: "Thuốc mà bác sĩ kê đơn vẫn còn có sẵn không?",
        pronunciation_focus: [
          "O-bat yang di-RE-sep-kan DOK-ter MA-sih ter-se-DI-a - `diresepkan` = được kê đơn; `tersedia` = có sẵn.",
          "`masih tersedia?` lịch sự hơn hỏi `ada atau tidak?` khi ở quầy thuốc.",
          "Lỗi người Việt: dùng `dokter tulis obat` được hiểu, nhưng thuật ngữ đúng là `obat diresepkan dokter`.",
        ],
        pronunciation_focus_en: [
          "O-bat yang dee-REH-sep-kan DOK-ter MA-sih ter-seh-DEE-a - `diresepkan` = prescribed; `tersedia` = available.",
          "`Masih tersedia?` is more polite than `ada atau tidak?` at a pharmacy counter.",
          "VN-speaker note: `dokter tulis obat` may be understood, but the medical phrase is `obat diresepkan dokter`.",
        ],
      },
      {
        en: "Berapa dosis obat ini untuk orang dewasa?",
        vi: "Liều thuốc này cho người lớn là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa DO-sis O-bat I-ni UN-tuk O-rang de-WA-sa - `dosis` = liều; `orang dewasa` = người lớn.",
          "`berapa dosis` hoặc `dosisnya berapa` đều tự nhiên khi hỏi dược sĩ.",
          "Lỗi người Việt: hỏi `berapa kali obat` thiếu rõ. Hỏi liều bằng `dosis`.",
        ],
        pronunciation_focus_en: [
          "be-RA-pa DO-sis O-bat EE-nee OON-took O-rang deh-WA-sa - `dosis` = dose; `orang dewasa` = adult.",
          "`Berapa dosis` or `dosisnya berapa` are both natural when asking a pharmacist.",
          "VN-speaker trap: saying `berapa kali obat`, which is unclear. Ask dosage with `dosis`.",
        ],
      },
      {
        en: "Aturan minumnya satu tablet dua kali sehari setelah makan.",
        vi: "Cách uống là một viên, ngày hai lần sau khi ăn.",
        pronunciation_focus: [
          "a-TU-ran MI-num-nya SA-tu TAB-let DU-a KA-li se-HA-ri se-TE-lah MA-kan - `aturan minum` = cách uống thuốc; `setelah makan` = sau khi ăn.",
          "`aturan minum` không chỉ là quy tắc; ở thuốc nghĩa là hướng dẫn uống.",
          "Lỗi người Việt: đặt `makan setelah`. Tiếng Indonesia dùng `setelah makan`.",
        ],
        pronunciation_focus_en: [
          "a-TOO-ran MEE-noom-nya SA-too TAB-let DOO-a KA-lee seh-HA-ree seh-TEH-lah MA-kan - `aturan minum` = dosage instructions; `setelah makan` = after eating.",
          "`Aturan minum` is not just a rule; for medicine it means how to take it.",
          "VN-speaker trap: reversing it as `makan setelah`. Indonesian says `setelah makan`.",
        ],
      },
      {
        en: "Obat ini diminum sebelum makan atau sesudah makan?",
        vi: "Thuốc này uống trước khi ăn hay sau khi ăn?",
        pronunciation_focus: [
          "O-bat I-ni di-MI-num se-BE-lum MA-kan A-tau se-SU-dah MA-kan - `sebelum` = trước khi; `sesudah` = sau khi.",
          "`diminum` là bị động tự nhiên cho thuốc: thuốc này được uống lúc nào.",
          "Lỗi người Việt: hỏi `minum sebelum atau setelah makan?` được, nhưng thêm `obat ini diminum...` rõ hơn.",
        ],
        pronunciation_focus_en: [
          "O-bat EE-nee dee-MEE-noom seh-BE-loom MA-kan A-tau seh-SOO-dah MA-kan - `sebelum` = before; `sesudah` = after.",
          "`Diminum` is a natural passive for medicine: when is this medicine taken?",
          "VN-speaker note: `minum sebelum atau setelah makan?` works, but `obat ini diminum...` is clearer.",
        ],
      },
      {
        en: "Apakah ada obat generik yang lebih murah?",
        vi: "Có thuốc generic/rẻ hơn không?",
        pronunciation_focus: [
          "a-PA-kah A-da O-bat ge-NE-rik yang le-BIH MU-rah - `obat generik` = thuốc generic; `lebih murah` = rẻ hơn.",
          "`obat generik` là lựa chọn thường hỏi ở apotek nếu muốn giá thấp hơn.",
          "Lỗi người Việt: nói `obat umum` để dịch generic. Thuật ngữ đúng là `obat generik`.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah A-da O-bat geh-NEH-rik yang leh-BIH MOO-rah - `obat generik` = generic medicine; `lebih murah` = cheaper.",
          "`Obat generik` is a common option to ask about at pharmacies when seeking a lower price.",
          "VN-speaker trap: translating generic as `obat umum`. The term is `obat generik`.",
        ],
      },
      {
        en: "Apa efek samping yang perlu saya perhatikan?",
        vi: "Tôi cần chú ý những tác dụng phụ nào?",
        pronunciation_focus: [
          "A-pa E-fek SAM-ping yang PER-lu SA-ya per-HA-ti-kan - `efek samping` = tác dụng phụ; `perhatikan` = chú ý.",
          "`yang perlu saya perhatikan` là cách hỏi lịch sự về dấu hiệu cần theo dõi.",
          "Lỗi người Việt: dịch từng chữ 'phụ dụng'. Cứ dùng cụm cố định `efek samping`.",
        ],
        pronunciation_focus_en: [
          "A-pa E-fek SAM-ping yang PER-loo SA-ya per-HA-tee-kan - `efek samping` = side effects; `perhatikan` = pay attention to.",
          "`Yang perlu saya perhatikan` is a polite way to ask what signs to monitor.",
          "VN-speaker trap: translating side effect word by word. Use the fixed phrase `efek samping`.",
        ],
      },
      {
        en: "Kalau saya pusing setelah minum obat, harus bagaimana?",
        vi: "Nếu tôi chóng mặt sau khi uống thuốc thì phải làm sao?",
        pronunciation_focus: [
          "KA-lau SA-ya PU-sing se-TE-lah MI-num O-bat, HA-rus ba-GAI-ma-na - `pusing` = chóng mặt/đau đầu nhẹ tùy ngữ cảnh; `harus bagaimana` = phải làm sao.",
          "Câu này không tự chẩn đoán; nó hỏi dược sĩ/bác sĩ cách xử lý nếu có phản ứng.",
          "Lỗi người Việt: nói `kepala putar` để dịch chóng mặt nghe không tự nhiên. Dùng `pusing`.",
        ],
        pronunciation_focus_en: [
          "KA-lau SA-ya POO-sing seh-TEH-lah MEE-noom O-bat, HA-roos ba-GAI-ma-na - `pusing` = dizzy/headachy depending on context; `harus bagaimana` = what should I do.",
          "This sentence does not self-diagnose; it asks the pharmacist/doctor how to respond if a reaction occurs.",
          "VN-speaker trap: saying `kepala putar` for dizziness sounds unnatural. Use `pusing`.",
        ],
      },
      {
        en: "Stok obat ini kosong, apakah ada pengganti?",
        vi: "Thuốc này hết hàng, có thuốc thay thế không?",
        pronunciation_focus: [
          "stok O-bat I-ni KO-song, a-PA-kah A-da peng-GAN-ti - `stok kosong` = hết hàng; `pengganti` = thuốc thay thế.",
          "`kosong` ở apotek nghĩa là không có hàng, không phải cái hộp rỗng.",
          "Lỗi người Việt: nói `tidak ada stok` được, nhưng nhân viên thường nói `stok kosong`.",
        ],
        pronunciation_focus_en: [
          "stok O-bat EE-nee KO-song, a-PA-kah A-da peng-GAN-tee - `stok kosong` = out of stock; `pengganti` = substitute/replacement.",
          "`Kosong` at a pharmacy means not available/out of stock, not just an empty box.",
          "VN-speaker note: `tidak ada stok` works, but staff often say `stok kosong`.",
        ],
      },
      {
        en: "Tolong tuliskan aturan minumnya di kemasan.",
        vi: "Làm ơn viết cách uống lên bao bì.",
        pronunciation_focus: [
          "TO-long TU-lis-kan a-TU-ran MI-num-nya di ke-MA-san - `tuliskan` = viết ra/ghi lên; `kemasan` = bao bì.",
          "`di kemasan` hữu ích khi có nhiều thuốc và bạn dễ quên cách dùng.",
          "Lỗi người Việt: nói `tulis di obat` nghe kỳ vì viết lên viên thuốc. Nói `di kemasan`.",
        ],
        pronunciation_focus_en: [
          "TO-long TOO-lis-kan a-TOO-ran MEE-noom-nya dee keh-MA-san - `tuliskan` = write down; `kemasan` = packaging.",
          "`Di kemasan` is useful when you have several medicines and may forget the directions.",
          "VN-speaker trap: saying `tulis di obat` sounds odd because it means writing on the pill. Say `di kemasan`.",
        ],
      },
      {
        en: "Saya perlu kembali ke klinik kalau obatnya tidak cocok?",
        vi: "Tôi có cần quay lại phòng khám nếu thuốc không hợp không?",
        pronunciation_focus: [
          "SA-ya PER-lu kem-BA-li ke KLI-nik KA-lau O-bat-nya ti-DAK CO-cok - `tidak cocok` = không hợp; `kembali ke klinik` = quay lại phòng khám.",
          "`obatnya tidak cocok` là cách nói phổ biến khi thuốc gây phản ứng hoặc không phù hợp.",
          "Lỗi người Việt: dùng `tidak sesuai badan saya` dài và không tự nhiên. Nói `obatnya tidak cocok`.",
        ],
        pronunciation_focus_en: [
          "SA-ya PER-loo kem-BA-lee keh KLEE-nik KA-lau O-bat-nya tee-DAK CHO-chok - `tidak cocok` = not suitable; `kembali ke klinik` = return to the clinic.",
          "`Obatnya tidak cocok` is a common way to say the medicine causes a reaction or is not suitable.",
          "VN-speaker note: `tidak sesuai badan saya` is long and unnatural. Say `obatnya tidak cocok`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, sau khi khám ở klinik, bạn có thể `tebus resep` tại apotek của phòng khám hoặc apotek bên ngoài. Dược sĩ thường giải thích `aturan minum`, liều (`dosis`), thời điểm uống trước/sau ăn, và có thể đề xuất `obat generik` nếu phù hợp. Nếu `stok kosong`, hãy hỏi `apakah ada pengganti?` nhưng đừng tự đổi thuốc kê đơn nếu chưa được dược sĩ hoặc bác sĩ xác nhận.",
    cultural_notes_en:
      "In Indonesia, after a clinic visit, you may fill a prescription at the clinic pharmacy or an outside pharmacy. Pharmacists often explain the directions, dose, timing before/after meals, and may suggest a generic medicine when appropriate. If an item is out of stock, ask `apakah ada pengganti?`, but do not substitute prescribed medicine without confirmation from a pharmacist or doctor.",
    tip_advice_vi:
      "Mẫu an toàn: `Saya mau tebus resep dokter. Apakah obatnya tersedia? Tolong jelaskan dosis, aturan minum, efek samping, dan apakah ada obat generik yang lebih murah.`",
    tip_advice_en:
      "Safe template: `Saya mau tebus resep dokter. Apakah obatnya tersedia? Tolong jelaskan dosis, aturan minum, efek samping, dan apakah ada obat generik yang lebih murah.`",
    vocabulary: [
      {
        word: "resep dokter",
        en: "doctor's prescription",
        vi: "đơn thuốc bác sĩ",
        pos: "noun",
        pronunciation_vi: "RE-sep DOK-ter",
        pronunciation_en: "REH-sep DOK-ter",
      },
      {
        word: "tebus obat",
        en: "fill/redeem medicine from a prescription",
        vi: "lấy thuốc theo đơn",
        pos: "verb phrase",
        pronunciation_vi: "TE-bus O-bat",
        pronunciation_en: "TEH-boos O-bat",
      },
      {
        word: "apotek",
        en: "pharmacy",
        vi: "nhà thuốc",
        pos: "noun",
        pronunciation_vi: "a-PO-tek",
        pronunciation_en: "a-PO-tek",
      },
      {
        word: "dosis",
        en: "dose",
        vi: "liều",
        pos: "noun",
        pronunciation_vi: "DO-sis",
        pronunciation_en: "DO-sis",
      },
      {
        word: "aturan minum",
        en: "medicine-taking directions",
        vi: "cách uống thuốc",
        pos: "noun",
        pronunciation_vi: "a-TU-ran MI-num",
        pronunciation_en: "a-TOO-ran MEE-noom",
      },
      {
        word: "obat generik",
        en: "generic medicine",
        vi: "thuốc generic",
        pos: "noun",
        pronunciation_vi: "O-bat ge-NE-rik",
        pronunciation_en: "O-bat geh-NEH-rik",
      },
      {
        word: "efek samping",
        en: "side effect",
        vi: "tác dụng phụ",
        pos: "noun",
        pronunciation_vi: "E-fek SAM-ping",
        pronunciation_en: "E-fek SAM-ping",
      },
      {
        word: "stok kosong",
        en: "out of stock",
        vi: "hết hàng",
        pos: "phrase",
        pronunciation_vi: "stok KO-song",
        pronunciation_en: "stok KO-song",
      },
      {
        word: "pengganti",
        en: "substitute; replacement",
        vi: "thuốc/thứ thay thế",
        pos: "noun",
        pronunciation_vi: "peng-GAN-ti",
        pronunciation_en: "peng-GAN-tee",
      },
      {
        word: "tidak cocok",
        en: "not suitable; does not agree with someone",
        vi: "không hợp",
        pos: "phrase",
        pronunciation_vi: "ti-DAK CO-cok",
        pronunciation_en: "tee-DAK CHO-chok",
      },
    ],
    dialogue: [
      {
        speaker: "Pasien",
        text: "Selamat siang, saya mau tebus resep dokter dari klinik.",
        vi: "Chào buổi trưa, tôi muốn lấy thuốc theo đơn bác sĩ từ phòng khám.",
        en: "Good afternoon, I would like to fill a doctor's prescription from the clinic.",
      },
      {
        speaker: "Apoteker",
        text: "Boleh saya lihat resepnya?",
        vi: "Tôi xem đơn thuốc được không?",
        en: "May I see the prescription?",
      },
      {
        speaker: "Pasien",
        text: "Ini resep digitalnya. Apakah semua obat masih tersedia?",
        vi: "Đây là đơn thuốc điện tử. Tất cả thuốc vẫn còn có sẵn không?",
        en: "Here is the digital prescription. Are all the medicines still available?",
      },
      {
        speaker: "Apoteker",
        text: "Satu obat stoknya kosong, tapi ada obat generik pengganti.",
        vi: "Một thuốc hết hàng, nhưng có thuốc generic thay thế.",
        en: "One medicine is out of stock, but there is a generic substitute.",
      },
      {
        speaker: "Pasien",
        text: "Tolong jelaskan dosis, aturan minum, dan efek sampingnya.",
        vi: "Làm ơn giải thích liều, cách uống, và tác dụng phụ.",
        en: "Please explain the dose, directions, and side effects.",
      },
      {
        speaker: "Apoteker",
        text: "Baik, saya tuliskan aturan minumnya di kemasan.",
        vi: "Được, tôi sẽ viết cách uống lên bao bì.",
        en: "All right, I will write the directions on the packaging.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi muốn lấy thuốc theo đơn bác sĩ.",
        prompt_en: "Translate into Indonesian: I want to fill a doctor's prescription.",
        answer: "Saya mau tebus resep dokter.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Apa efek ___ yang perlu saya perhatikan?",
        prompt_en: "Fill in the blank: Apa efek ___ yang perlu saya perhatikan?",
        answer: "samping",
      },
      {
        type: "choice",
        prompt_vi: "Câu nào tự nhiên nhất khi thuốc hết hàng?",
        prompt_en: "Which sentence is most natural when medicine is out of stock?",
        options: [
          "Stok obat ini kosong, apakah ada pengganti?",
          "Obat ini rumah kosong, ada ganti?",
          "Tidak ada obat, saya mau resep makan.",
        ],
        answer: "Stok obat ini kosong, apakah ada pengganti?",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm từ Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match each Indonesian phrase with its Vietnamese meaning.",
        pairs: [
          ["aturan minum", "cách uống thuốc"],
          ["obat generik", "thuốc generic"],
          ["stok kosong", "hết hàng"],
        ],
      },
    ],
    content:
      "Use this lesson for practical clinic-pharmacy conversations: filling prescriptions, asking whether medicines are available, checking dose and directions, asking about generic substitutes, monitoring side effects, and handling out-of-stock medicine politely.",
  },
];
