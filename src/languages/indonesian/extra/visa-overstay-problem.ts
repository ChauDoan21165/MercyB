// Visa overstay problem Indonesian (Vietnamese -> Indonesian study track).
//
// A2 Wave 22 file. Covers overstay, immigration fines, expired stay permits,
// passports, immigration offices, sponsors, and explanation letters.
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
    id: "indonesian_visa_overstay_problem",
    level: "B1",
    category: "travel",
    title_vi: "Xử lý vấn đề quá hạn visa",
    title_en: "Handling a visa overstay problem",
    sentences: [
      {
        en: "Izin tinggal saya sudah habis dua hari yang lalu.",
        vi: "Giấy phép lưu trú của tôi đã hết hạn hai ngày trước.",
        pronunciation_focus: [
          "I-zin TING-gal SA-ya SU-dah HA-bis DU-a HA-ri yang LA-lu - `izin tinggal` = giấy phép lưu trú; `sudah habis` = đã hết hạn.",
          "Lỗi người Việt: dùng `visa mati` vì dịch thẳng 'visa chết'. Nói lịch sự và rõ hơn: `izin tinggal sudah habis`.",
          "Luyện: `Izin tinggal saya sudah habis.`",
        ],
        pronunciation_focus_en: [
          "EE-zin TING-gal SA-ya SOO-dah HA-bis DOO-a HA-ree yang LA-loo - `izin tinggal` = stay permit; `sudah habis` = has expired.",
          "VN-speaker trap: saying `visa mati` from a literal 'dead visa' idea. More polite and clear: `izin tinggal sudah habis`.",
          "Drill: `Izin tinggal saya sudah habis.`",
        ],
      },
      {
        en: "Saya baru sadar ada overstay di paspor saya.",
        vi: "Tôi mới nhận ra có quá hạn lưu trú trong hộ chiếu của tôi.",
        pronunciation_focus: [
          "SA-ya BA-ru SA-dar A-da O-ver-stay di PAS-por SA-ya - `baru sadar` = mới nhận ra; `overstay` thường được dùng trong tiếng Indonesia hành chính du lịch.",
          "`di paspor saya` nghĩa là trong/ở hồ sơ hộ chiếu của tôi. Nếu nói về dấu nhập cảnh, có thể thêm `cap masuk`.",
          "Lỗi người Việt: nói `saya tahu baru`. Thứ tự tự nhiên là `saya baru sadar`.",
        ],
        pronunciation_focus_en: [
          "SA-ya BA-roo SA-dar A-da O-ver-stay dee PAS-por SA-ya - `baru sadar` = just realized; `overstay` is commonly used in Indonesian travel administration.",
          "`di paspor saya` means in/on my passport record. For an entry stamp, you can add `cap masuk`.",
          "VN-speaker trap: word order like `saya tahu baru`. Natural order: `saya baru sadar`.",
        ],
      },
      {
        en: "Saya ingin melapor ke kantor imigrasi secepatnya.",
        vi: "Tôi muốn trình báo với văn phòng xuất nhập cảnh càng sớm càng tốt.",
        pronunciation_focus: [
          "SA-ya I-ngin me-LA-por ke KAN-tor i-mi-GRA-si se-CE-pat-nya - `melapor` = trình báo; `kantor imigrasi` = văn phòng xuất nhập cảnh.",
          "`secepatnya` = càng sớm càng tốt. Trong tình huống nhạy cảm, từ này cho thấy bạn muốn xử lý nghiêm túc.",
          "Lỗi người Việt: nói `lapor kantor`. Cần giới từ `ke`: `melapor ke kantor imigrasi`.",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin me-LA-por keh KAN-tor ee-mee-GRA-see se-CHE-pat-nya - `melapor` = report; `kantor imigrasi` = immigration office.",
          "`secepatnya` = as soon as possible. In a sensitive situation, it signals that you want to handle it responsibly.",
          "VN-speaker trap: saying `lapor kantor`. Use `ke`: `melapor ke kantor imigrasi`.",
        ],
      },
      {
        en: "Berapa denda imigrasi untuk overstay satu hari?",
        vi: "Tiền phạt nhập cảnh cho quá hạn một ngày là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa DEN-da i-mi-GRA-si UN-tuk O-ver-stay SA-tu HA-ri - `denda imigrasi` = tiền phạt của cơ quan nhập cảnh.",
          "`untuk overstay satu hari` đặt vấn đề cụ thể: quá hạn một ngày. Đừng đoán số tiền nếu chưa hỏi petugas.",
          "Luyện: `Berapa dendanya?` = Tiền phạt bao nhiêu?",
        ],
        pronunciation_focus_en: [
          "be-RA-pa DEN-da ee-mee-GRA-see OON-took O-ver-stay SA-too HA-ree - `denda imigrasi` = immigration fine.",
          "`untuk overstay satu hari` makes the issue specific: one day of overstay. Do not guess the amount before asking the officer.",
          "Drill: `Berapa dendanya?` = How much is the fine?",
        ],
      },
      {
        en: "Apakah saya bisa membayar denda hari ini?",
        vi: "Tôi có thể nộp phạt hôm nay không?",
        pronunciation_focus: [
          "a-PA-kah SA-ya BI-sa mem-BA-yar DEN-da HA-ri I-ni - `membayar denda` = nộp tiền phạt.",
          "`hari ini` đặt ở cuối câu để hỏi khả năng xử lý ngay trong ngày.",
          "Lỗi người Việt: dịch 'đóng phạt' thành `menutup denda`. Tiếng Indonesia dùng `membayar denda`.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah SA-ya BEE-sa mem-BA-yar DEN-da HA-ree EE-nee - `membayar denda` = pay a fine.",
          "`hari ini` goes at the end to ask whether it can be handled today.",
          "VN-speaker trap: translating 'close/pay a fine' literally. Indonesian uses `membayar denda`.",
        ],
      },
      {
        en: "Paspor saya masih berlaku, tetapi cap izin tinggalnya sudah lewat.",
        vi: "Hộ chiếu của tôi vẫn còn hiệu lực, nhưng dấu/giấy phép lưu trú đã quá hạn.",
        pronunciation_focus: [
          "PAS-por SA-ya MA-sih ber-LA-ku te-TA-pi cap I-zin TING-gal-nya SU-dah LE-wat - `masih berlaku` = vẫn còn hiệu lực; `sudah lewat` = đã qua hạn.",
          "`cap` trong ngữ cảnh này là dấu trong hộ chiếu. `cap izin tinggalnya` giúp phân biệt hộ chiếu còn hạn nhưng quyền lưu trú đã hết.",
          "Lỗi người Việt: dùng một từ `hết hạn` cho cả hai giấy tờ. Hãy tách `paspor masih berlaku` và `izin tinggal sudah lewat`.",
        ],
        pronunciation_focus_en: [
          "PAS-por SA-ya MA-sih ber-LA-koo te-TA-pee chap EE-zin TING-gal-nya SOO-dah LE-wat - `masih berlaku` = still valid; `sudah lewat` = has passed the limit.",
          "`cap` here means a stamp in the passport. `cap izin tinggalnya` separates a valid passport from an expired stay permission.",
          "VN-speaker trap: using one 'expired' phrase for both documents. Separate `paspor masih berlaku` and `izin tinggal sudah lewat`.",
        ],
      },
      {
        en: "Saya perlu bertemu petugas untuk menjelaskan masalahnya.",
        vi: "Tôi cần gặp nhân viên để giải thích vấn đề.",
        pronunciation_focus: [
          "SA-ya PER-lu ber-TE-mu pe-TU-gas UN-tuk men-je-LAS-kan ma-SA-lah-nya - `petugas` = cán bộ/nhân viên; `menjelaskan` = giải thích.",
          "`masalahnya` = vấn đề đó, với hậu tố `-nya` chỉ tình huống đã biết.",
          "Lỗi người Việt: nói `ketemu dengan petugas` được trong nói thường, nhưng `bertemu petugas` gọn và lịch sự hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya PER-loo ber-TE-moo pe-TOO-gas OON-took men-je-LAS-kan ma-SA-lah-nya - `petugas` = officer/staff; `menjelaskan` = explain.",
          "`masalahnya` = the issue, with `-nya` pointing to the known situation.",
          "VN-speaker note: `ketemu dengan petugas` is understood casually, but `bertemu petugas` is neater and more polite.",
        ],
      },
      {
        en: "Sponsor saya bisa membantu menyiapkan surat penjelasan.",
        vi: "Người bảo lãnh của tôi có thể giúp chuẩn bị thư giải trình.",
        pronunciation_focus: [
          "SPON-sor SA-ya BI-sa mem-BAN-tu me-nyi-AP-kan SU-rat pen-je-LAS-an - `sponsor` = người bảo lãnh; `surat penjelasan` = thư giải trình.",
          "`menyiapkan` = chuẩn bị. Trong hồ sơ, nghe tự nhiên hơn `membuat` nếu thư còn cần dữ liệu/chứng cứ.",
          "Lỗi người Việt: dịch 'người bảo lãnh' thành `orang garansi`. Trong di trú Indonesia, dùng `sponsor`.",
        ],
        pronunciation_focus_en: [
          "SPON-sor SA-ya BEE-sa mem-BAN-too me-nyee-AP-kan SOO-rat pen-je-LAS-an - `sponsor` = sponsor/guarantor; `surat penjelasan` = explanation letter.",
          "`menyiapkan` = prepare. In paperwork, it sounds more natural than `membuat` if the letter needs supporting details.",
          "VN-speaker trap: translating guarantor as `orang garansi`. In Indonesian immigration, use `sponsor`.",
        ],
      },
      {
        en: "Saya membawa bukti tiket keluar dari Indonesia.",
        vi: "Tôi mang theo bằng chứng vé rời khỏi Indonesia.",
        pronunciation_focus: [
          "SA-ya mem-BA-wa BUK-ti TI-ket KE-lu-ar da-ri in-do-NE-sia - `bukti` = bằng chứng; `tiket keluar` = vé rời khỏi.",
          "`keluar dari Indonesia` nghĩa là rời khỏi Indonesia, không phải chỉ đi ra khỏi phòng.",
          "Lỗi người Việt: dùng `tiket pulang` khi không về nước mình. Nếu chỉ rời Indonesia, nói `tiket keluar dari Indonesia`.",
        ],
        pronunciation_focus_en: [
          "SA-ya mem-BA-wa BOOK-tee TEE-ket KE-loo-ar da-ree in-do-NE-sia - `bukti` = proof; `tiket keluar` = outbound ticket.",
          "`keluar dari Indonesia` means leaving Indonesia, not just walking out of a room.",
          "VN-speaker trap: using `tiket pulang` when you are not returning home. If only leaving Indonesia, say `tiket keluar dari Indonesia`.",
        ],
      },
      {
        en: "Apa saja dokumen yang harus saya siapkan?",
        vi: "Tôi phải chuẩn bị những giấy tờ nào?",
        pronunciation_focus: [
          "A-pa SA-ja do-ku-MEN yang HA-rus SA-ya si-AP-kan - `apa saja` = những gì; `dokumen` = giấy tờ.",
          "`harus saya siapkan` là cấu trúc lịch sự: những thứ phải được tôi chuẩn bị.",
          "Luyện: `Dokumen apa saja?` = Những giấy tờ nào?",
        ],
        pronunciation_focus_en: [
          "A-pa SA-ja do-koo-MEN yang HA-roos SA-ya see-AP-kan - `apa saja` = what things; `dokumen` = documents.",
          "`harus saya siapkan` is a polite structure: what must be prepared by me.",
          "Drill: `Dokumen apa saja?` = Which documents?",
        ],
      },
      {
        en: "Saya minta arahan supaya prosesnya sesuai aturan.",
        vi: "Tôi xin hướng dẫn để quy trình đúng theo quy định.",
        pronunciation_focus: [
          "SA-ya MIN-ta a-RA-han su-PA-ya PRO-ses-nya se-SU-ai a-TU-ran - `arahan` = hướng dẫn; `sesuai aturan` = đúng quy định.",
          "Câu này mềm và tôn trọng: bạn không tranh cãi, mà xin hướng xử lý đúng luật.",
          "Lỗi người Việt: nói quá trực tiếp `Saya tidak salah`. Trong văn phòng, bắt đầu bằng `minta arahan` an toàn hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya MIN-ta a-RA-han soo-PA-ya PRO-ses-nya se-SOO-ai a-TOO-ran - `arahan` = guidance; `sesuai aturan` = according to the rules.",
          "This sentence is soft and respectful: you are not arguing, you are asking for the rule-compliant path.",
          "VN-speaker trap: saying the direct `Saya tidak salah`. At an office, starting with `minta arahan` is safer.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, vấn đề `overstay` là chuyện hành chính nghiêm túc và nên xử lý trực tiếp với `kantor imigrasi` hoặc petugas có thẩm quyền. Cách nói nên bình tĩnh, cụ thể: hộ chiếu còn hạn hay không, `izin tinggal` hết từ ngày nào, bạn có sponsor không, và có vé rời Indonesia hay chưa. Đừng hứa hẹn hoặc đưa thông tin không chắc. Hãy hỏi `Apa saja dokumen yang harus saya siapkan?` và làm theo hướng dẫn chính thức.",
    cultural_notes_en:
      "In Indonesia, an overstay is a serious administrative issue and should be handled directly with the immigration office or an authorized officer. Speak calmly and specifically: whether the passport is valid, when the stay permit expired, whether you have a sponsor, and whether you have an outbound ticket. Do not promise or invent uncertain information. Ask `Apa saja dokumen yang harus saya siapkan?` and follow official instructions.",
    tip_advice_vi:
      "Mẫu an toàn: `Izin tinggal saya sudah habis. Saya ingin melapor ke kantor imigrasi dan minta arahan supaya prosesnya sesuai aturan.` Nếu có sponsor, thêm: `Sponsor saya bisa membantu menyiapkan surat penjelasan.`",
    tip_advice_en:
      "Safe template: `Izin tinggal saya sudah habis. Saya ingin melapor ke kantor imigrasi dan minta arahan supaya prosesnya sesuai aturan.` If you have a sponsor, add: `Sponsor saya bisa membantu menyiapkan surat penjelasan.`",
    vocabulary: [
      {
        word: "overstay",
        en: "overstay; staying past permitted time",
        vi: "quá hạn lưu trú",
        pos: "noun",
        pronunciation_vi: "O-ver-stay",
        pronunciation_en: "O-ver-stay",
      },
      {
        word: "izin tinggal",
        en: "stay permit",
        vi: "giấy phép lưu trú",
        pos: "noun",
        pronunciation_vi: "I-zin TING-gal",
        pronunciation_en: "EE-zin TING-gal",
      },
      {
        word: "denda imigrasi",
        en: "immigration fine",
        vi: "tiền phạt nhập cảnh",
        pos: "noun",
        pronunciation_vi: "DEN-da i-mi-GRA-si",
        pronunciation_en: "DEN-da ee-mee-GRA-see",
      },
      {
        word: "kantor imigrasi",
        en: "immigration office",
        vi: "văn phòng xuất nhập cảnh",
        pos: "noun",
        pronunciation_vi: "KAN-tor i-mi-GRA-si",
        pronunciation_en: "KAN-tor ee-mee-GRA-see",
      },
      {
        word: "paspor",
        en: "passport",
        vi: "hộ chiếu",
        pos: "noun",
        pronunciation_vi: "PAS-por",
        pronunciation_en: "PAS-por",
      },
      {
        word: "sponsor",
        en: "sponsor; guarantor",
        vi: "người bảo lãnh",
        pos: "noun",
        pronunciation_vi: "SPON-sor",
        pronunciation_en: "SPON-sor",
      },
      {
        word: "surat penjelasan",
        en: "explanation letter",
        vi: "thư giải trình",
        pos: "noun",
        pronunciation_vi: "SU-rat pen-je-LAS-an",
        pronunciation_en: "SOO-rat pen-je-LAS-an",
      },
      {
        word: "melapor",
        en: "to report",
        vi: "trình báo",
        pos: "verb",
        pronunciation_vi: "me-LA-por",
        pronunciation_en: "me-LA-por",
      },
      {
        word: "masih berlaku",
        en: "still valid",
        vi: "vẫn còn hiệu lực",
        pos: "phrase",
        pronunciation_vi: "MA-sih ber-LA-ku",
        pronunciation_en: "MA-sih ber-LA-koo",
      },
      {
        word: "sesuai aturan",
        en: "according to the rules",
        vi: "đúng theo quy định",
        pos: "phrase",
        pronunciation_vi: "se-SU-ai a-TU-ran",
        pronunciation_en: "se-SOO-ai a-TOO-ran",
      },
    ],
    dialogue: [
      {
        speaker: "Warga asing",
        text: "Selamat pagi, saya ingin melapor soal izin tinggal saya.",
        vi: "Chào buổi sáng, tôi muốn trình báo về giấy phép lưu trú của tôi.",
        en: "Good morning, I would like to report an issue with my stay permit.",
      },
      {
        speaker: "Petugas",
        text: "Izin tinggalnya habis kapan?",
        vi: "Giấy phép lưu trú hết hạn khi nào?",
        en: "When did the stay permit expire?",
      },
      {
        speaker: "Warga asing",
        text: "Dua hari yang lalu. Paspor saya masih berlaku.",
        vi: "Hai ngày trước. Hộ chiếu của tôi vẫn còn hiệu lực.",
        en: "Two days ago. My passport is still valid.",
      },
      {
        speaker: "Petugas",
        text: "Apakah Anda punya sponsor di Indonesia?",
        vi: "Bạn có người bảo lãnh ở Indonesia không?",
        en: "Do you have a sponsor in Indonesia?",
      },
      {
        speaker: "Warga asing",
        text: "Ada. Sponsor saya bisa membantu menyiapkan surat penjelasan.",
        vi: "Có. Người bảo lãnh của tôi có thể giúp chuẩn bị thư giải trình.",
        en: "Yes. My sponsor can help prepare an explanation letter.",
      },
      {
        speaker: "Petugas",
        text: "Baik, siapkan paspor, bukti tiket keluar, dan surat penjelasan.",
        vi: "Được, hãy chuẩn bị hộ chiếu, bằng chứng vé rời khỏi, và thư giải trình.",
        en: "All right, prepare your passport, proof of outbound ticket, and explanation letter.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Giấy phép lưu trú của tôi đã hết hạn.",
        prompt_en: "Translate into Indonesian: My stay permit has expired.",
        answer: "Izin tinggal saya sudah habis.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Berapa ___ imigrasi untuk overstay satu hari?",
        prompt_en: "Fill in the blank: Berapa ___ imigrasi untuk overstay satu hari?",
        answer: "denda",
      },
      {
        type: "choice",
        prompt_vi: "Cách nói nào tự nhiên hơn khi hỏi giấy tờ cần chuẩn bị?",
        prompt_en: "Which phrasing is more natural when asking what documents to prepare?",
        options: [
          "Apa saja dokumen yang harus saya siapkan?",
          "Apa dokumen-dokumen saya bikin?",
          "Saya mau dokumen apa?",
        ],
        answer: "Apa saja dokumen yang harus saya siapkan?",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm từ Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match each Indonesian phrase with its Vietnamese meaning.",
        pairs: [
          ["kantor imigrasi", "văn phòng xuất nhập cảnh"],
          ["surat penjelasan", "thư giải trình"],
          ["masih berlaku", "vẫn còn hiệu lực"],
        ],
      },
    ],
    content:
      "Use this lesson for careful, respectful immigration-office conversations. It teaches learners to state an overstay clearly, ask about fines and documents, mention a sponsor, and request official guidance without inventing legal certainty.",
  },
];
