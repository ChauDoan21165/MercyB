// Long-distance train and KAI Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It mirrors sibling Indonesian `extra/*`
// files: target-language text is stored in `en`, Vietnamese glosses in `vi`,
// Vietnamese-facing L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.
//
// Register note: train Indonesian is practical and schedule-focused:
// `kereta api`, `KAI`, `tiket`, `nomor kursi`, `stasiun`, `jadwal berangkat`,
// `refund`, and `bagasi`.

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
    id: "indonesian_long_distance_train_kai",
    level: "B1",
    category: "travel",
    title_vi: "Tàu đường dài KAI",
    title_en: "Long-distance train travel with KAI",
    sentences: [
      {
        en: "Saya mau membeli tiket kereta api ke Yogyakarta.",
        vi: "Tôi muốn mua vé tàu hỏa đi Yogyakarta.",
        pronunciation_focus: [
          "SA-ya mau mem-BE-li TI-ket ke-RE-ta A-pi ke Yo-gya-KAR-ta - `kereta api` = tàu hỏa; `tiket` = vé.",
          "Lỗi người Việt: nói `train` trong câu Indonesia. Từ tự nhiên là `kereta api`, nói ngắn là `kereta`.",
          "Luyện: `Tiket kereta api ke Yogyakarta.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau mem-BEH-lee TEE-ket keh-REH-ta A-pee keh Yog-ya-KAR-ta - `kereta api` = train; `tiket` = ticket.",
          "VN-speaker trap: saying English `train` inside Indonesian. Natural Indonesian is `kereta api`, shortened to `kereta`.",
          "Drill: `Tiket kereta api ke Yogyakarta.`",
        ],
      },
      {
        en: "Apakah tiket KAI masih tersedia untuk malam ini?",
        vi: "Vé KAI cho tối nay còn không?",
        pronunciation_focus: [
          "a-PA-kah TI-ket KA-I MA-sih ter-se-DI-a UN-tuk MA-lam I-ni - `tersedia` = còn/sẵn có.",
          "Lỗi người Việt: hỏi `ada tiket?` được, nhưng `masih tersedia` lịch sự và rõ hơn khi hỏi chỗ còn trống.",
          "Luyện: `Tiket masih tersedia?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah TEE-ket KA-I MA-see ter-seh-DEE-a OON-took MA-lam EE-nee - `tersedia` = available.",
          "VN-speaker note: `ada tiket?` works, but `masih tersedia` is more polite and precise for availability.",
          "Drill: `Tiket masih tersedia?`",
        ],
      },
      {
        en: "Nomor kursi saya ada di tiket elektronik.",
        vi: "Số ghế của tôi có trên vé điện tử.",
        pronunciation_focus: [
          "NO-mor KUR-si SA-ya A-da di TI-ket e-lek-TRO-nik - `nomor kursi` = số ghế; `tiket elektronik` = vé điện tử.",
          "Lỗi người Việt: dùng `angka kursi`. Với mã/số định danh, dùng `nomor`.",
          "Luyện: `Nomor kursi ada di tiket.`",
        ],
        pronunciation_focus_en: [
          "NO-mor KOOR-see SA-ya A-da dee TEE-ket eh-lek-TRO-nik - `nomor kursi` = seat number; `tiket elektronik` = e-ticket.",
          "VN-speaker trap: using `angka kursi`. For identifiers, use `nomor`.",
          "Drill: `Nomor kursi ada di tiket.`",
        ],
      },
      {
        en: "Kereta berangkat dari stasiun mana?",
        vi: "Tàu khởi hành từ ga nào?",
        pronunciation_focus: [
          "ke-RE-ta be-RANG-kat da-RI sta-SI-un MA-na - `berangkat` = khởi hành; `stasiun` = ga.",
          "Lỗi người Việt: hỏi địa điểm xuất phát bằng `di mana` cũng hiểu, nhưng `dari stasiun mana` rõ hơn.",
          "Luyện: `Dari stasiun mana?`",
        ],
        pronunciation_focus_en: [
          "keh-REH-ta beh-RANG-kat da-REE sta-SEE-oon MA-na - `berangkat` = depart; `stasiun` = station.",
          "VN-speaker note: `di mana` is understood, but `dari stasiun mana` clearly asks the departure station.",
          "Drill: `Dari stasiun mana?`",
        ],
      },
      {
        en: "Jadwal berangkat berubah menjadi jam delapan malam.",
        vi: "Lịch khởi hành đổi thành tám giờ tối.",
        pronunciation_focus: [
          "JAD-wal be-RANG-kat be-RU-bah men-JA-di jam de-LA-pan MA-lam - `jadwal berangkat` = lịch khởi hành; `berubah` = thay đổi.",
          "Lỗi người Việt: nói `jam pergi` nghe quá đời thường. Với phương tiện công cộng, dùng `jadwal berangkat`.",
          "Luyện: `Jadwal berangkat berubah.`",
        ],
        pronunciation_focus_en: [
          "JAD-wal beh-RANG-kat beh-ROO-bah men-JA-dee jam deh-LA-pan MA-lam - `jadwal berangkat` = departure schedule; `berubah` = changed.",
          "VN-speaker trap: saying `jam pergi` sounds too casual. For public transport, use `jadwal berangkat`.",
          "Drill: `Jadwal berangkat berubah.`",
        ],
      },
      {
        en: "Saya harus check-in berapa menit sebelum kereta berangkat?",
        vi: "Tôi phải check-in bao nhiêu phút trước khi tàu khởi hành?",
        pronunciation_focus: [
          "SA-ya HA-rus CEK-in be-RA-pa me-NIT se-BE-lum ke-RE-ta be-RANG-kat - `berapa menit sebelum` = bao nhiêu phút trước.",
          "Lỗi người Việt: hỏi `kapan check-in` được, nhưng nếu cần quy định thời gian, hỏi `berapa menit sebelum`.",
          "Luyện: `Berapa menit sebelum berangkat?`",
        ],
        pronunciation_focus_en: [
          "SA-ya HA-roos CHEK-in beh-RA-pa meh-NEET seh-BEH-loom keh-REH-ta beh-RANG-kat - `berapa menit sebelum` = how many minutes before.",
          "VN-speaker note: `kapan check-in` works, but rules are clearer with `berapa menit sebelum`.",
          "Drill: `Berapa menit sebelum berangkat?`",
        ],
      },
      {
        en: "Bagasi besar harus diletakkan di rak atas.",
        vi: "Hành lý lớn phải đặt ở giá phía trên.",
        pronunciation_focus: [
          "ba-GA-si be-SAR HA-rus di-le-TAK-kan di rak A-tas - `bagasi besar` = hành lý lớn; `rak atas` = giá phía trên.",
          "Lỗi người Việt: `bagasi` không chỉ dùng ở sân bay; đi tàu cũng dùng cho hành lý.",
          "Luyện: `Diletakkan di rak atas.`",
        ],
        pronunciation_focus_en: [
          "ba-GA-see beh-SAR HA-roos dee-leh-TAK-kan dee rak A-tas - `bagasi besar` = large luggage; `rak atas` = overhead rack.",
          "VN-speaker note: `bagasi` is not only for airports; it is also used for train luggage.",
          "Drill: `Diletakkan di rak atas.`",
        ],
      },
      {
        en: "Apakah ada batas berat bagasi untuk penumpang?",
        vi: "Có giới hạn trọng lượng hành lý cho hành khách không?",
        pronunciation_focus: [
          "a-PA-kah A-da BA-tas BE-rat ba-GA-si UN-tuk pe-NUM-pang - `batas berat` = giới hạn cân nặng; `penumpang` = hành khách.",
          "Lỗi người Việt: dùng `berat maksimal` cũng được, nhưng cụm bảng/quy định hay dùng `batas berat`.",
          "Luyện: `Batas berat bagasi.`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah A-da BA-tas BEH-rat ba-GA-see OON-took peh-NOOM-pang - `batas berat` = weight limit; `penumpang` = passenger.",
          "VN-speaker note: `berat maksimal` works, but posted rules often use `batas berat`.",
          "Drill: `Batas berat bagasi.`",
        ],
      },
      {
        en: "Saya ingin mengubah jadwal tiket ini.",
        vi: "Tôi muốn đổi lịch vé này.",
        pronunciation_focus: [
          "SA-ya I-ngin me-NGU-bah JAD-wal TI-ket I-ni - `mengubah jadwal` = đổi lịch; `ingin` = muốn.",
          "Lỗi người Việt: nói `ganti tiket` có thể bị hiểu là đổi vé mới. Nếu đổi giờ/ngày, nói `mengubah jadwal`.",
          "Luyện: `Mengubah jadwal tiket.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin meh-NGOO-bah JAD-wal TEE-ket EE-nee - `mengubah jadwal` = change the schedule.",
          "VN-speaker trap: `ganti tiket` may sound like replacing the ticket. For date/time changes, say `mengubah jadwal`.",
          "Drill: `Mengubah jadwal tiket.`",
        ],
      },
      {
        en: "Bagaimana cara mengajukan refund tiket?",
        vi: "Cách yêu cầu hoàn tiền vé như thế nào?",
        pronunciation_focus: [
          "ba-gai-MA-na CA-ra me-nga-JU-kan RI-fand TI-ket - `mengajukan refund` = nộp/yêu cầu hoàn tiền.",
          "Lỗi người Việt: chỉ nói `minta uang kembali` nghe quá chung. Trong dịch vụ vé, dùng `refund` hoặc `pengembalian dana`.",
          "Luyện: `Mengajukan refund tiket.`",
        ],
        pronunciation_focus_en: [
          "ba-gai-MA-na CHA-ra meh-nga-JOO-kan REE-fund TEE-ket - `mengajukan refund` = submit a refund request.",
          "VN-speaker note: `minta uang kembali` is broad. Ticket services commonly use `refund` or `pengembalian dana`.",
          "Drill: `Mengajukan refund tiket.`",
        ],
      },
      {
        en: "Nama di tiket harus sesuai dengan KTP atau paspor.",
        vi: "Tên trên vé phải khớp với KTP hoặc hộ chiếu.",
        pronunciation_focus: [
          "NA-ma di TI-ket HA-rus se-SU-ai de-NGAN KA-te-PE a-TAU PAS-por - `sesuai dengan` = khớp với/đúng theo.",
          "Lỗi người Việt: bỏ `dengan` sau `sesuai`. Cụm đầy đủ trong hồ sơ là `sesuai dengan KTP`.",
          "Luyện: `Sesuai dengan KTP.`",
        ],
        pronunciation_focus_en: [
          "NA-ma dee TEE-ket HA-roos seh-SOO-ai deh-NGAN KA-teh-PEH a-TAU PAS-por - `sesuai dengan` = matching/according to.",
          "VN-speaker trap: dropping `dengan` after `sesuai`. In documents, the full phrase is `sesuai dengan KTP`.",
          "Drill: `Sesuai dengan KTP.`",
        ],
      },
      {
        en: "Gerbong saya nomor tiga, kursinya dekat jendela.",
        vi: "Toa của tôi số ba, ghế gần cửa sổ.",
        pronunciation_focus: [
          "GER-bong SA-ya NO-mor TI-ga, KUR-si-nya de-KAT jen-DE-la - `gerbong` = toa tàu; `dekat jendela` = gần cửa sổ.",
          "Lỗi người Việt: `gerbong` là toa; `kursi` là ghế. Đừng dùng một từ cho cả hai.",
          "Luyện: `Gerbong nomor tiga.`",
        ],
        pronunciation_focus_en: [
          "GER-bong SA-ya NO-mor TEE-ga, KOOR-see-nya deh-KAT jen-DEH-la - `gerbong` = train car; `dekat jendela` = by the window.",
          "VN-speaker trap: `gerbong` is the car; `kursi` is the seat. Do not use one word for both.",
          "Drill: `Gerbong nomor tiga.`",
        ],
      },
    ],
    cultural_notes_vi:
      "KAI là công ty đường sắt quốc gia Indonesia. Với tàu đường dài, hành khách thường cần vé điện tử, giấy tờ tùy thân khớp tên, thông tin gerbong/kursi, và đến stasiun trước giờ berangkat. Quy định đổi lịch, refund và bagasi có thể thay đổi theo loại vé/dịch vụ, nên bài này chỉ dạy ngôn ngữ thực dụng.",
    cultural_notes_en:
      "KAI is Indonesia's national railway company. For long-distance trains, passengers usually need an e-ticket, matching ID, train-car/seat information, and enough time at the station before departure. Schedule-change, refund, and baggage rules can vary by ticket or service type, so this lesson teaches practical language only.",
    tip_advice_vi:
      "Khi hỏi nhân viên ga, hãy nói rõ mã vé, stasiun, jadwal berangkat, gerbong và nomor kursi. Nếu cần đổi/hủy vé, dùng `mengubah jadwal` cho đổi lịch và `mengajukan refund` cho hoàn tiền.",
    tip_advice_en:
      "When asking station staff, state your booking code, station, departure schedule, car, and seat number clearly. For changes or cancellation, use `mengubah jadwal` for rescheduling and `mengajukan refund` for refunds.",
    vocabulary: [
      {
        word: "kereta api",
        en: "train",
        vi: "tàu hỏa",
        pos: "noun",
        pronunciation_vi: "ke-RE-ta A-pi",
        pronunciation_en: "keh-REH-ta A-pee",
      },
      {
        word: "KAI",
        en: "Indonesian railway company",
        vi: "công ty đường sắt Indonesia",
        pos: "proper noun",
        pronunciation_vi: "KA-I",
        pronunciation_en: "KA-I",
      },
      {
        word: "tiket",
        en: "ticket",
        vi: "vé",
        pos: "noun",
        pronunciation_vi: "TI-ket",
        pronunciation_en: "TEE-ket",
      },
      {
        word: "nomor kursi",
        en: "seat number",
        vi: "số ghế",
        pos: "noun phrase",
        pronunciation_vi: "NO-mor KUR-si",
        pronunciation_en: "NO-mor KOOR-see",
      },
      {
        word: "stasiun",
        en: "station",
        vi: "ga",
        pos: "noun",
        pronunciation_vi: "sta-SI-un",
        pronunciation_en: "sta-SEE-oon",
      },
      {
        word: "jadwal berangkat",
        en: "departure schedule",
        vi: "lịch khởi hành",
        pos: "noun phrase",
        pronunciation_vi: "JAD-wal be-RANG-kat",
        pronunciation_en: "JAD-wal beh-RANG-kat",
      },
      {
        word: "refund",
        en: "refund",
        vi: "hoàn tiền",
        pos: "noun",
        pronunciation_vi: "RI-fand",
        pronunciation_en: "REE-fund",
      },
      {
        word: "bagasi",
        en: "baggage",
        vi: "hành lý",
        pos: "noun",
        pronunciation_vi: "ba-GA-si",
        pronunciation_en: "ba-GA-see",
      },
      {
        word: "gerbong",
        en: "train car",
        vi: "toa tàu",
        pos: "noun",
        pronunciation_vi: "GER-bong",
        pronunciation_en: "GER-bong",
      },
      {
        word: "mengubah jadwal",
        en: "change the schedule",
        vi: "đổi lịch",
        pos: "verb phrase",
        pronunciation_vi: "me-NGU-bah JAD-wal",
        pronunciation_en: "meh-NGOO-bah JAD-wal",
      },
    ],
    dialogue: [
      {
        speaker: "Penumpang",
        text: "Permisi, kereta saya berangkat dari stasiun mana?",
        vi: "Xin lỗi, tàu của tôi khởi hành từ ga nào?",
        en: "Excuse me, which station does my train depart from?",
      },
      {
        speaker: "Petugas KAI",
        text: "Tiketnya dari Stasiun Gambir. Nomor gerbong dan kursi ada di tiket elektronik.",
        vi: "Vé là từ ga Gambir. Số toa và ghế có trên vé điện tử.",
        en: "The ticket is from Gambir Station. The car and seat numbers are on the e-ticket.",
      },
      {
        speaker: "Penumpang",
        text: "Kalau jadwal berubah, bagaimana cara mengajukan refund?",
        vi: "Nếu lịch thay đổi, cách yêu cầu hoàn tiền như thế nào?",
        en: "If the schedule changes, how do I request a refund?",
      },
      {
        speaker: "Petugas KAI",
        text: "Bisa lewat aplikasi atau loket, tergantung jenis tiketnya.",
        vi: "Có thể qua ứng dụng hoặc quầy, tùy loại vé.",
        en: "You can do it through the app or the counter, depending on the ticket type.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: “Số ghế của tôi có trên vé điện tử.”",
        prompt_en: "Translate into Indonesian: “My seat number is on the e-ticket.”",
        answer: "Nomor kursi saya ada di tiket elektronik.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ còn thiếu: Kereta berangkat dari ____ mana?",
        prompt_en: "Fill in the blank: Kereta berangkat dari ____ mana?",
        answer: "stasiun",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cụm nào nghĩa là “đổi lịch vé”?",
        prompt_en: "Which phrase means “change the ticket schedule”?",
        choices: ["mengubah jadwal tiket", "membawa bagasi", "mencetak nomor kursi"],
        answer: "mengubah jadwal tiket",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `gerbong` = ?",
        prompt_en: "Match the meaning: `gerbong` = ?",
        answer: "train car",
      },
    ],
  },
];

export default lessons;
