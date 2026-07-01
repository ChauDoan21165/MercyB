// Advanced Hypothetical Conditions Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// hypothetical/grammar notes with English companions in pronunciation_focus_en.

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
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
    id: "indonesian_advanced_hypothetical_conditions",
    level: "B2",
    category: "academic_communication",
    title_vi: "Điều kiện giả định nâng cao",
    title_en: "Advanced hypothetical conditions",
    sentences: [
      {
        en: "Seandainya anggarannya lebih besar, program ini bisa diperluas.",
        vi: "Giả sử ngân sách lớn hơn, chương trình này có thể được mở rộng.",
        pronunciation_focus: [
          "se-an-DAI-nya ang-GA-ran-nya LE-bih BE-sar, PRO-gram I-ni BI-sa di-per-LU-as - `seandainya` = giả sử/giá mà; `diperluas` = được mở rộng.",
          "Lỗi người Việt: dùng `jika` cho mọi giả định. `Seandainya` nghe giả định hơn, thường cho tình huống chưa chắc xảy ra.",
          "Luyện: `Seandainya anggarannya lebih besar...`",
        ],
        pronunciation_focus_en: [
          "se-an-DAI-nya ang-GA-ran-nya LE-bih BE-sar, PRO-gram I-ni BI-sa di-per-LOO-as - `seandainya` = if only/suppose; `diperluas` = expanded.",
          "VN-speaker trap: using `jika` for every condition. `Seandainya` sounds more hypothetical, often for uncertain situations.",
          "Drill: `Seandainya anggarannya lebih besar...`",
        ],
      },
      {
        en: "Kalau saja kita tahu lebih awal, keputusannya mungkin berbeda.",
        vi: "Giá như chúng ta biết sớm hơn, quyết định có lẽ đã khác.",
        pronunciation_focus: [
          "KA-lau SA-ja KI-ta TA-hu LE-bih A-wal, ke-pu-TUS-an-nya MUNG-kin ber-BE-da - `kalau saja` = giá như; `lebih awal` = sớm hơn.",
          "Lỗi người Việt: `kalau saja` thường mang sắc thái tiếc nuối, không chỉ là điều kiện trung lập.",
          "Luyện: `Kalau saja kita tahu lebih awal.`",
        ],
        pronunciation_focus_en: [
          "KA-lau SA-ja KI-ta TA-hoo LE-bih A-wal, ke-poo-TOOS-an-nya MOONG-kin ber-BE-da - `kalau saja` = if only; `lebih awal` = earlier.",
          "VN-speaker trap: `kalau saja` often carries regret, not only a neutral condition.",
          "Drill: `Kalau saja kita tahu lebih awal.`",
        ],
      },
      {
        en: "Andaikan jadwalnya berubah, kita perlu menyiapkan rencana cadangan.",
        vi: "Giả sử lịch thay đổi, chúng ta cần chuẩn bị kế hoạch dự phòng.",
        pronunciation_focus: [
          "an-DAI-kan JAD-wal-nya ber-U-bah, KI-ta per-LU me-nyi-AP-kan ren-CA-na ca-DANG-an - `andaikan` = giả sử; `rencana cadangan` = kế hoạch dự phòng.",
          "Lỗi người Việt: dịch `backup plan` bằng tiếng Anh mọi lúc. Cụm Indonesia tự nhiên là `rencana cadangan`.",
          "Luyện: `Kita perlu rencana cadangan.`",
        ],
        pronunciation_focus_en: [
          "an-DAI-kan JAD-wal-nya ber-OO-bah, KI-ta per-LOO me-nyi-AP-kan ren-CHA-na cha-DANG-an - `andaikan` = suppose; `rencana cadangan` = backup plan.",
          "VN-speaker trap: always using English `backup plan`. Natural Indonesian phrase: `rencana cadangan`.",
          "Drill: `Kita perlu rencana cadangan.`",
        ],
      },
      {
        en: "Jika memungkinkan, kita bisa memulai tahap uji coba minggu depan.",
        vi: "Nếu có thể, chúng ta có thể bắt đầu giai đoạn thử nghiệm tuần sau.",
        pronunciation_focus: [
          "JI-ka me-MUNG-kin-kan, KI-ta BI-sa me-MU-lai TA-hap U-ji CO-ba MING-gu de-PAN - `jika memungkinkan` = nếu có thể; `uji coba` = thử nghiệm.",
          "Lỗi người Việt: dùng `kalau bisa` trong văn trang trọng. `Jika memungkinkan` lịch sự và chuyên nghiệp hơn.",
          "Luyện: `Jika memungkinkan, minggu depan.`",
        ],
        pronunciation_focus_en: [
          "JI-ka me-MOONG-kin-kan, KI-ta BI-sa me-MOO-lai TA-hap OO-ji CHO-ba MING-goo de-PAN - `jika memungkinkan` = if possible; `uji coba` = trial/test.",
          "VN-speaker trap: using casual `kalau bisa` in formal speech. `Jika memungkinkan` is more polite and professional.",
          "Drill: `Jika memungkinkan, minggu depan.`",
        ],
      },
      {
        en: "Kemungkinan besar, hasilnya akan berubah jika datanya diperbarui.",
        vi: "Rất có khả năng kết quả sẽ thay đổi nếu dữ liệu được cập nhật.",
        pronunciation_focus: [
          "ke-mung-KIN-an be-SAR, HA-sil-nya A-kan ber-U-bah JI-ka DA-ta-nya di-per-BA-ru-i - `kemungkinan besar` = rất có khả năng; `diperbarui` = được cập nhật.",
          "Lỗi người Việt: `mungkin besar` không tự nhiên. Cụm đúng là `kemungkinan besar`.",
          "Luyện: `Kemungkinan besar hasilnya berubah.`",
        ],
        pronunciation_focus_en: [
          "ke-moong-KIN-an be-SAR, HA-sil-nya A-kan ber-OO-bah JI-ka DA-ta-nya di-per-BA-roo-i - `kemungkinan besar` = most likely; `diperbarui` = updated.",
          "VN-speaker trap: `mungkin besar` is not natural. Correct phrase: `kemungkinan besar`.",
          "Drill: `Kemungkinan besar hasilnya berubah.`",
        ],
      },
      {
        en: "Konsekuensinya harus dipikirkan sebelum kita mengambil keputusan.",
        vi: "Hệ quả của nó phải được suy nghĩ trước khi chúng ta đưa ra quyết định.",
        pronunciation_focus: [
          "kon-se-KU-en-si-nya HA-rus di-PI-kir-kan se-BE-lum KI-ta me-NGAM-bil ke-pu-TUS-an - `konsekuensi` = hệ quả; `mengambil keputusan` = đưa ra quyết định.",
          "Lỗi người Việt: dùng `akibat` cho mọi hệ quả. `Konsekuensi` hợp với quyết định, kế hoạch, và chính sách.",
          "Luyện: `Pikirkan konsekuensinya.`",
        ],
        pronunciation_focus_en: [
          "kon-se-KU-en-si-nya HA-roos di-PI-kir-kan se-BE-lum KI-ta me-NGAM-bil ke-poo-TOOS-an - `konsekuensi` = consequence; `mengambil keputusan` = make a decision.",
          "VN-speaker trap: using `akibat` for every consequence. `Konsekuensi` fits decisions, plans, and policies.",
          "Drill: `Pikirkan konsekuensinya.`",
        ],
      },
      {
        en: "Dengan asumsi semua pihak setuju, rapat bisa dijadwalkan ulang.",
        vi: "Với giả định rằng tất cả các bên đồng ý, cuộc họp có thể được xếp lịch lại.",
        pronunciation_focus: [
          "de-NGAN a-SUM-si se-MU-a PI-hak se-TU-ju, RA-pat BI-sa di-jad-WAL-kan U-lang - `dengan asumsi` = với giả định; `semua pihak` = tất cả các bên.",
          "Lỗi người Việt: `asumsi` dùng cho giả định phân tích, không phải ước đoán cảm tính.",
          "Luyện: `Dengan asumsi semua pihak setuju...`",
        ],
        pronunciation_focus_en: [
          "de-NGAN a-SOOM-si se-MOO-a PI-hak se-TOO-joo, RA-pat BI-sa di-jad-WAL-kan OO-lang - `dengan asumsi` = assuming that; `semua pihak` = all parties.",
          "VN-speaker trap: `asumsi` is for analytical assumptions, not just a feeling/guess.",
          "Drill: `Dengan asumsi semua pihak setuju...`",
        ],
      },
      {
        en: "Apabila target tidak tercapai, kita akan menjalankan rencana cadangan.",
        vi: "Nếu mục tiêu không đạt được, chúng ta sẽ thực hiện kế hoạch dự phòng.",
        pronunciation_focus: [
          "a-pa-BI-la TAR-get ti-DAK ter-CA-pai, KI-ta A-kan men-ja-LAN-kan ren-CA-na ca-DANG-an - `apabila` = nếu/trong trường hợp; `tercapai` = đạt được.",
          "Lỗi người Việt: trong văn chính thức, `apabila` nghe trang trọng hơn `kalau`.",
          "Luyện: `Apabila target tidak tercapai...`",
        ],
        pronunciation_focus_en: [
          "a-pa-BI-la TAR-get ti-DAK ter-CHA-pai, KI-ta A-kan men-ja-LAN-kan ren-CHA-na cha-DANG-an - `apabila` = if/in the event that; `tercapai` = achieved.",
          "VN-speaker trap: in formal writing, `apabila` sounds more formal than `kalau`.",
          "Drill: `Apabila target tidak tercapai...`",
        ],
      },
      {
        en: "Seandainya usulan itu ditolak, apa langkah berikutnya?",
        vi: "Giả sử đề xuất đó bị từ chối, bước tiếp theo là gì?",
        pronunciation_focus: [
          "se-an-DAI-nya u-SUL-an I-tu di-TO-lak, A-pa LANG-kah be-ri-KUT-nya - `usulan` = đề xuất; `langkah berikutnya` = bước tiếp theo.",
          "Lỗi người Việt: dùng `step` trong thảo luận công việc. `Langkah berikutnya` là cụm Indonesia tự nhiên.",
          "Luyện: `Apa langkah berikutnya?`",
        ],
        pronunciation_focus_en: [
          "se-an-DAI-nya oo-SOOL-an I-too di-TO-lak, A-pa LANG-kah be-ri-KOOT-nya - `usulan` = proposal; `langkah berikutnya` = next step.",
          "VN-speaker trap: using English `step` in work discussion. `Langkah berikutnya` is natural Indonesian.",
          "Drill: `Apa langkah berikutnya?`",
        ],
      },
      {
        en: "Kalau situasinya memburuk, konsekuensinya bisa lebih serius.",
        vi: "Nếu tình hình xấu đi, hệ quả có thể nghiêm trọng hơn.",
        pronunciation_focus: [
          "KA-lau si-tu-A-si-nya mem-BU-ruk, kon-se-KU-en-si-nya BI-sa LE-bih se-RI-us - `memburuk` = xấu đi; `lebih serius` = nghiêm trọng hơn.",
          "Lỗi người Việt: `memburuk` dùng cho tình hình/sức khỏe/kondisi, không phải tính cách con người.",
          "Luyện: `Situasinya memburuk.`",
        ],
        pronunciation_focus_en: [
          "KA-lau si-too-A-si-nya mem-BOO-rook, kon-se-KU-en-si-nya BI-sa LE-bih se-RI-us - `memburuk` = worsen; `lebih serius` = more serious.",
          "VN-speaker trap: `memburuk` applies to situations/health/conditions, not personality.",
          "Drill: `Situasinya memburuk.`",
        ],
      },
      {
        en: "Saya akan setuju, asalkan risikonya dijelaskan sejak awal.",
        vi: "Tôi sẽ đồng ý, miễn là rủi ro được giải thích ngay từ đầu.",
        pronunciation_focus: [
          "SA-ya A-kan se-TU-ju, a-SAL-kan RI-si-ko-nya di-JE-las-kan SE-jak A-wal - `asalkan` = miễn là; `sejak awal` = ngay từ đầu.",
          "Lỗi người Việt: `asalkan` nêu điều kiện bắt buộc, mạnh hơn `kalau` thông thường.",
          "Luyện: `Saya setuju, asalkan...`",
        ],
        pronunciation_focus_en: [
          "SA-ya A-kan se-TOO-joo, a-SAL-kan RI-si-ko-nya di-JE-las-kan SE-jak A-wal - `asalkan` = as long as/provided that; `sejak awal` = from the start.",
          "VN-speaker trap: `asalkan` gives a required condition, stronger than ordinary `kalau`.",
          "Drill: `Saya setuju, asalkan...`",
        ],
      },
      {
        en: "Bila perlu, kita bisa menunda peluncuran sampai masalahnya jelas.",
        vi: "Nếu cần, chúng ta có thể hoãn việc ra mắt cho đến khi vấn đề rõ ràng.",
        pronunciation_focus: [
          "BI-la per-LU, KI-ta BI-sa me-NUN-da pe-LUN-cur-an SAM-pai MA-sa-lah-nya JE-las - `bila perlu` = nếu cần; `menunda peluncuran` = hoãn ra mắt.",
          "Lỗi người Việt: `bila` hơi trang trọng; hợp với báo cáo, kế hoạch, và email công việc.",
          "Luyện: `Bila perlu, kita tunda.`",
        ],
        pronunciation_focus_en: [
          "BI-la per-LOO, KI-ta BI-sa me-NOON-da pe-LOON-choor-an SAM-pai MA-sa-lah-nya JE-las - `bila perlu` = if necessary; `menunda peluncuran` = delay the launch.",
          "VN-speaker trap: `bila` is somewhat formal; it fits reports, planning, and work email.",
          "Drill: `Bila perlu, kita tunda.`",
        ],
      },
      {
        en: "Tanpa rencana cadangan, kemungkinan kegagalan akan lebih tinggi.",
        vi: "Không có kế hoạch dự phòng, khả năng thất bại sẽ cao hơn.",
        pronunciation_focus: [
          "TAN-pa ren-CA-na ca-DANG-an, ke-mung-KIN-an ke-ga-GAL-an A-kan LE-bih TING-gi - `tanpa` = không có; `kemungkinan kegagalan` = khả năng thất bại.",
          "Lỗi người Việt: dịch `khả năng fail` bằng tiếng Anh. Cụm rõ hơn: `kemungkinan kegagalan`.",
          "Luyện: `Tanpa rencana cadangan...`",
        ],
        pronunciation_focus_en: [
          "TAN-pa ren-CHA-na cha-DANG-an, ke-moong-KIN-an ke-ga-GAL-an A-kan LE-bih TING-gi - `tanpa` = without; `kemungkinan kegagalan` = chance of failure.",
          "VN-speaker trap: mixing in English `fail`. Clearer phrase: `kemungkinan kegagalan`.",
          "Drill: `Tanpa rencana cadangan...`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong tiếng Indonesia, điều kiện giả định có nhiều mức sắc thái. `Jika/apabila/bila` trung tính hoặc trang trọng; `kalau` đời thường hơn; `seandainya`, `andaikan`, và `kalau saja` thường giả định mạnh hơn, đôi khi có cảm giác tiếc nuối. Trong công việc, người Indonesia hay làm mềm giả định bằng `jika memungkinkan`, `dengan asumsi...`, `bila perlu`, và luôn nêu `rencana cadangan` khi có rủi ro.",
    cultural_notes_en:
      "Indonesian hypothetical conditions have different shades. `Jika/apabila/bila` are neutral or formal; `kalau` is more everyday; `seandainya`, `andaikan`, and `kalau saja` are more hypothetical and sometimes carry regret. In work settings, Indonesians often soften hypotheticals with `jika memungkinkan`, `dengan asumsi...`, `bila perlu`, and mention a `rencana cadangan` when there is risk.",
    tip_advice_vi:
      "Mẹo cho người Việt: đừng dùng một từ `kalau` cho mọi tình huống. Dùng `jika memungkinkan` để xin phương án lịch sự, `seandainya/andaikan` để giả định, `kalau saja` khi có tiếc nuối, `asalkan` cho điều kiện bắt buộc, và `tanpa...` để cảnh báo hậu quả. Khi phân tích kế hoạch, nối đủ ba phần: giả định -> khả năng -> konsekuensi/rencana cadangan.",
    tip_advice_en:
      "Tip for Vietnamese speakers: do not use only `kalau` for every situation. Use `jika memungkinkan` for polite possibility, `seandainya/andaikan` for hypotheticals, `kalau saja` for regret, `asalkan` for required conditions, and `tanpa...` to warn about consequences. In planning analysis, connect all three parts: assumption -> possibility -> consequence/backup plan.",
    vocabulary: [
      { word: "seandainya", en: "suppose, if only", vi: "giả sử, giá mà", pos: "connector", pronunciation_vi: "se-an-DAI-nya", pronunciation_en: "se-an-DAI-nya" },
      { word: "kalau saja", en: "if only", vi: "giá như", pos: "connector", pronunciation_vi: "KA-lau SA-ja", pronunciation_en: "KA-lau SA-ja" },
      { word: "andaikan", en: "suppose, imagine if", vi: "giả sử", pos: "connector", pronunciation_vi: "an-DAI-kan", pronunciation_en: "an-DAI-kan" },
      { word: "jika memungkinkan", en: "if possible", vi: "nếu có thể", pos: "formal phrase", pronunciation_vi: "JI-ka me-MUNG-kin-kan", pronunciation_en: "JI-ka me-MOONG-kin-kan" },
      { word: "kemungkinan", en: "possibility, likelihood", vi: "khả năng", pos: "noun", pronunciation_vi: "ke-mung-KIN-an", pronunciation_en: "ke-moong-KIN-an" },
      { word: "konsekuensi", en: "consequence", vi: "hệ quả", pos: "noun", pronunciation_vi: "kon-se-KU-en-si", pronunciation_en: "kon-se-KU-en-si" },
      { word: "rencana cadangan", en: "backup plan", vi: "kế hoạch dự phòng", pos: "noun phrase", pronunciation_vi: "ren-CA-na ca-DANG-an", pronunciation_en: "ren-CHA-na cha-DANG-an" },
      { word: "asumsi", en: "assumption", vi: "giả định", pos: "noun", pronunciation_vi: "a-SUM-si", pronunciation_en: "a-SOOM-si" },
    ],
    dialogue: [
      {
        speaker: "Mira",
        text: "Seandainya klien meminta perubahan besar, apa rencana cadangan kita?",
        vi: "Giả sử khách hàng yêu cầu thay đổi lớn, kế hoạch dự phòng của chúng ta là gì?",
        en: "Suppose the client asks for a major change, what is our backup plan?",
      },
      {
        speaker: "Hadi",
        text: "Jika memungkinkan, kita minta tambahan waktu satu minggu.",
        vi: "Nếu có thể, chúng ta xin thêm một tuần.",
        en: "If possible, we ask for one extra week.",
      },
      {
        speaker: "Mira",
        text: "Kalau saja kita tahu lebih awal, konsekuensinya tidak sebesar ini.",
        vi: "Giá như chúng ta biết sớm hơn, hệ quả đã không lớn như thế này.",
        en: "If only we had known earlier, the consequences would not be this big.",
      },
      {
        speaker: "Hadi",
        text: "Benar. Dengan asumsi semua pihak setuju, jadwal bisa kita ubah hari ini.",
        vi: "Đúng. Với giả định rằng tất cả các bên đồng ý, lịch có thể được chúng ta đổi hôm nay.",
        en: "Right. Assuming all parties agree, we can change the schedule today.",
      },
      {
        speaker: "Mira",
        text: "Baik, asalkan risikonya dijelaskan sejak awal.",
        vi: "Được, miễn là rủi ro được giải thích ngay từ đầu.",
        en: "All right, as long as the risks are explained from the start.",
      },
    ],
    exercises: [
      {
        type: "connector_choice",
        instruction_vi: "Chọn cụm điều kiện giả định phù hợp.",
        instruction_en: "Choose the suitable hypothetical condition phrase.",
        items: [
          { prompt: "___ anggarannya lebih besar, program ini bisa diperluas.", answer: "Seandainya" },
          { prompt: "___, kita bisa memulai minggu depan.", answer: "Jika memungkinkan" },
          { prompt: "Saya setuju, ___ risikonya dijelaskan.", answer: "asalkan" },
          { prompt: "___ rencana cadangan, kemungkinan kegagalan lebih tinggi.", answer: "Tanpa" },
        ],
      },
      {
        type: "rewrite",
        instruction_vi: "Viết lại câu trực tiếp thành câu giả định tự nhiên hơn.",
        instruction_en: "Rewrite the direct sentence into more natural hypothetical Indonesian.",
        items: [
          {
            prompt: "Kalau bisa, mulai minggu depan.",
            answer: "Jika memungkinkan, kita bisa memulai minggu depan.",
          },
          {
            prompt: "Jika ditolak, apa next step?",
            answer: "Seandainya usulan itu ditolak, apa langkah berikutnya?",
          },
          {
            prompt: "Kita perlu backup plan.",
            answer: "Kita perlu menyiapkan rencana cadangan.",
          },
        ],
      },
    ],
  },
];

export default lessons;
