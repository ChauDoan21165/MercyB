// Emergency Room Hospital Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file following the established Indonesian extra
// format. The `en` field holds TARGET-LANGUAGE Indonesian, `vi` holds the
// Vietnamese gloss, and pronunciation_focus carries Vietnamese L1 notes with
// English companion explanations in the same order.

type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar/culture notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

type IndonesianVocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type IndonesianDialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type IndonesianExercise = Record<string, unknown>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
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

export const emergencyRoomHospitalLessons: IndonesianLesson[] = [
  {
    id: "indonesian_emergency_room_hospital",
    level: "B1",
    category: "health",
    title_vi: "Vào IGD ở bệnh viện: cấp cứu, đăng ký và gia đình bệnh nhân",
    title_en: "At the hospital ER: emergency care, registration and patient family",
    sentences: [
      {
        en: "Ini keadaan darurat, kami harus ke IGD sekarang.",
        vi: "Đây là tình trạng khẩn cấp, chúng tôi phải đến khoa cấp cứu ngay.",
        pronunciation_focus: [
          "`keadaan darurat` = tình trạng khẩn cấp; dùng khi cần nhấn mạnh mức độ nghiêm trọng.",
          "`IGD` đọc i-ge-de, viết tắt của `Instalasi Gawat Darurat` = khoa/phòng cấp cứu.",
          "Lỗi người Việt: nói `emergency room` bằng tiếng Anh. Ở bệnh viện Indonesia, từ rất thường gặp là `IGD`.",
        ],
        pronunciation_focus_en: [
          "`keadaan darurat` means emergency situation; use it to stress seriousness.",
          "`IGD` is pronounced i-ge-de, short for `Instalasi Gawat Darurat`, the emergency department.",
          "VN-speaker trap: using English `emergency room`. In Indonesian hospitals, `IGD` is the common term.",
        ],
      },
      {
        en: "Pasien mengalami nyeri dada dan sesak napas.",
        vi: "Bệnh nhân bị đau ngực và khó thở.",
        pronunciation_focus: [
          "`pasien mengalami ...` = bệnh nhân gặp/bị triệu chứng ...; nghe trang trọng và rõ trong bệnh viện.",
          "`nyeri dada` = đau ngực; `sesak napas` = khó thở, hụt hơi.",
          "Lỗi người Việt: dùng `sakit dada` vẫn hiểu, nhưng báo với perawat/dokter nên dùng `nyeri dada` cho chính xác hơn.",
        ],
        pronunciation_focus_en: [
          "`pasien mengalami ...` means the patient is experiencing a symptom; it sounds clear and formal in hospitals.",
          "`nyeri dada` means chest pain; `sesak napas` means shortness of breath.",
          "VN-speaker trap: `sakit dada` is understood, but with nurses/doctors `nyeri dada` is more precise.",
        ],
      },
      {
        en: "Perawat akan memeriksa tekanan darah dan suhu tubuh dulu.",
        vi: "Y tá sẽ kiểm tra huyết áp và nhiệt độ cơ thể trước.",
        pronunciation_focus: [
          "`perawat` = y tá/điều dưỡng; khác với `dokter` là bác sĩ.",
          "`tekanan darah` = huyết áp; `suhu tubuh` = nhiệt độ cơ thể.",
          "Lỗi người Việt: dịch huyết áp thành cụm tự chế. Cụm chuẩn là `tekanan darah`.",
        ],
        pronunciation_focus_en: [
          "`perawat` means nurse; different from `dokter`, doctor.",
          "`tekanan darah` means blood pressure; `suhu tubuh` means body temperature.",
          "VN-speaker trap: inventing a literal phrase for blood pressure. The standard term is `tekanan darah`.",
        ],
      },
      {
        en: "Tolong daftar di loket pendaftaran IGD dengan KTP pasien.",
        vi: "Vui lòng đăng ký ở quầy đăng ký cấp cứu bằng KTP của bệnh nhân.",
        pronunciation_focus: [
          "`loket pendaftaran IGD` = quầy đăng ký khoa cấp cứu; `loket` là quầy.",
          "`dengan KTP pasien` = bằng/ với KTP của bệnh nhân; KTP đọc ka-te-pe.",
          "Lỗi người Việt: lẫn `daftar` và `pendaftaran`. `Daftar` là động từ đăng ký, `pendaftaran` là quầy/quy trình đăng ký.",
        ],
        pronunciation_focus_en: [
          "`loket pendaftaran IGD` means ER registration counter; `loket` is a counter/window.",
          "`dengan KTP pasien` means with the patient's KTP; KTP is pronounced ka-te-pe.",
          "VN-speaker trap: mixing `daftar` and `pendaftaran`. `Daftar` is the verb to register; `pendaftaran` is registration or the counter.",
        ],
      },
      {
        en: "Dokter jaga sedang menangani pasien lain.",
        vi: "Bác sĩ trực đang xử lý bệnh nhân khác.",
        pronunciation_focus: [
          "`dokter jaga` = bác sĩ trực; rất hay dùng ở IGD, klinik, rumah sakit.",
          "`menangani pasien` = xử lý/chăm sóc bệnh nhân; tự nhiên hơn dịch từng chữ `memegang pasien`.",
          "Lỗi người Việt: dịch 'on duty' thành `dokter tugas`. Cụm tự nhiên là `dokter jaga`.",
        ],
        pronunciation_focus_en: [
          "`dokter jaga` means doctor on duty; common in ERs, clinics, and hospitals.",
          "`menangani pasien` means handling/treating a patient; more natural than literal `memegang pasien`.",
          "VN-speaker trap: translating 'on duty doctor' as `dokter tugas`. The natural phrase is `dokter jaga`.",
        ],
      },
      {
        en: "Keluarga pasien diminta menunggu di ruang tunggu.",
        vi: "Gia đình bệnh nhân được yêu cầu chờ ở phòng chờ.",
        pronunciation_focus: [
          "`keluarga pasien` = gia đình/người nhà bệnh nhân; cụm cố định trong bệnh viện.",
          "`diminta menunggu` = được yêu cầu chờ; bị động `di-` nghe lịch sự và hành chính.",
          "Lỗi người Việt: dùng `rumah tunggu`. Phòng chờ là `ruang tunggu`.",
        ],
        pronunciation_focus_en: [
          "`keluarga pasien` means the patient's family or relatives; a fixed hospital phrase.",
          "`diminta menunggu` means are asked to wait; passive `di-` sounds polite and administrative.",
          "VN-speaker trap: saying `rumah tunggu`. Waiting room is `ruang tunggu`.",
        ],
      },
      {
        en: "Apakah tindakan medis ini perlu persetujuan keluarga?",
        vi: "Thủ thuật/xử lý y tế này có cần sự đồng ý của gia đình không?",
        pronunciation_focus: [
          "`tindakan medis` = can thiệp/xử lý y tế; không tự động nghĩa là phẫu thuật.",
          "`persetujuan keluarga` = sự đồng ý của gia đình; hay dùng khi cần tanda tangan hoặc izin.",
          "Lỗi người Việt: dịch `medical action` quá sát thành `aksi medis`. Cụm Indonesia chuẩn là `tindakan medis`.",
        ],
        pronunciation_focus_en: [
          "`tindakan medis` means medical procedure/action; it does not automatically mean surgery.",
          "`persetujuan keluarga` means family consent, often when a signature or permission is needed.",
          "VN-speaker trap: translating `medical action` literally as `aksi medis`. Standard Indonesian is `tindakan medis`.",
        ],
      },
      {
        en: "Berapa biaya awal yang harus dibayar sebelum tindakan?",
        vi: "Chi phí ban đầu phải trả trước khi xử lý là bao nhiêu?",
        pronunciation_focus: [
          "`biaya awal` = chi phí ban đầu; có thể là deposit/uang muka tergantung rumah sakit.",
          "`sebelum tindakan` = trước khi thủ thuật/xử lý y tế; câu hỏi tài chính, không phải lời khuyên y khoa.",
          "Lỗi người Việt: hỏi `apa biaya` khi muốn biết số tiền. Hỏi tiền dùng `berapa biaya`.",
        ],
        pronunciation_focus_en: [
          "`biaya awal` means initial cost; it may be a deposit/down payment depending on the hospital.",
          "`sebelum tindakan` means before the medical procedure/action; this is a payment question, not medical advice.",
          "VN-speaker trap: asking `apa biaya` when you want an amount. For money, use `berapa biaya`.",
        ],
      },
      {
        en: "Mohon jelaskan dulu prosedurnya dengan bahasa yang sederhana.",
        vi: "Xin giải thích quy trình trước bằng ngôn ngữ đơn giản.",
        pronunciation_focus: [
          "`mohon jelaskan dulu` = xin giải thích trước; `mohon` lịch sự hơn `tolong` trong bệnh viện.",
          "`bahasa yang sederhana` = ngôn ngữ đơn giản, dễ hiểu; dùng khi không hiểu thuật ngữ y tế.",
          "Lỗi người Việt: chỉ nói `saya tidak mengerti`. Thêm yêu cầu cụ thể: `jelaskan dengan bahasa yang sederhana`.",
        ],
        pronunciation_focus_en: [
          "`mohon jelaskan dulu` means please explain first; `mohon` is more formal than `tolong` in hospital settings.",
          "`bahasa yang sederhana` means simple, easy-to-understand language; use it when medical terms are unclear.",
          "VN-speaker trap: only saying `saya tidak mengerti`. Add a concrete request: `jelaskan dengan bahasa yang sederhana`.",
        ],
      },
      {
        en: "Jika kondisinya memburuk, segera panggil perawat.",
        vi: "Nếu tình trạng xấu đi, hãy gọi y tá ngay.",
        pronunciation_focus: [
          "`kondisinya memburuk` = tình trạng xấu đi; dùng `memburuk` cho sức khỏe giảm.",
          "`segera panggil perawat` = gọi y tá ngay; `segera` trang trọng hơn `cepat`.",
          "Lỗi người Việt: nói `kondisi menjadi jelek`. Trong y tế, `kondisi memburuk` tự nhiên và chính xác hơn.",
        ],
        pronunciation_focus_en: [
          "`kondisinya memburuk` means the condition worsens; use `memburuk` for health decline.",
          "`segera panggil perawat` means call the nurse immediately; `segera` is more formal than `cepat`.",
          "VN-speaker trap: saying `kondisi menjadi jelek`. In medical contexts, `kondisi memburuk` is more natural and precise.",
        ],
      },
    ],
    cultural_notes_vi:
      "IGD là khu cấp cứu của bệnh viện Indonesia. Trong tình huống cấp cứu, bệnh nhân thường được perawat kiểm tra ban đầu, lalu dokter jaga menilai kondisi pasien. Gia đình bệnh nhân có thể phải làm pendaftaran, đưa KTP/kartu asuransi, ký persetujuan untuk tindakan medis, hoặc hỏi biaya awal. Quy trình mỗi bệnh viện có thể khác nhau; bài này chỉ giúp giao tiếp bằng tiếng Indonesia, không thay thế hướng dẫn y tế của nhân viên bệnh viện.",
    cultural_notes_en:
      "IGD is the emergency department in Indonesian hospitals. In an emergency, nurses usually do initial checks, then the doctor on duty assesses the patient's condition. The patient's family may need to handle registration, provide KTP/insurance cards, sign consent for medical procedures, or ask about initial costs. Procedures differ by hospital; this lesson is for Indonesian communication, not a substitute for medical guidance from hospital staff.",
    tip_advice_vi:
      "Mẹo cho người Việt: trong IGD, nói ngắn, rõ, theo khung: `Ini keadaan darurat`, `Pasien mengalami...`, `Saya keluarga pasien`, `Mohon jelaskan...`, `Berapa biaya awal...?`. Với nhân viên y tế, dùng `mohon`, `pasien`, `perawat`, `dokter jaga`, và các dạng bị động như `diminta`, `ditangani`, `dibayar`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: in the ER, speak briefly and clearly with frames like: `Ini keadaan darurat`, `Pasien mengalami...`, `Saya keluarga pasien`, `Mohon jelaskan...`, `Berapa biaya awal...?`. With hospital staff, use `mohon`, `pasien`, `perawat`, `dokter jaga`, and passive forms such as `diminta`, `ditangani`, `dibayar`.",
    vocabulary: [
      {
        word: "IGD",
        en: "emergency department",
        vi: "khoa cấp cứu",
        pos: "noun abbreviation",
        pronunciation_vi: "i-ge-DE",
        pronunciation_en: "ee-geh-DEH",
      },
      {
        word: "keadaan darurat",
        en: "emergency situation",
        vi: "tình trạng khẩn cấp",
        pos: "noun phrase",
        pronunciation_vi: "ke-a-DA-an da-RU-rat",
        pronunciation_en: "keh-ah-DA-an da-ROO-rat",
      },
      {
        word: "pendaftaran",
        en: "registration",
        vi: "đăng ký",
        pos: "noun",
        pronunciation_vi: "pen-DAF-ta-ran",
        pronunciation_en: "pen-DAF-ta-ran",
      },
      {
        word: "perawat",
        en: "nurse",
        vi: "y tá / điều dưỡng",
        pos: "noun",
        pronunciation_vi: "pe-RA-wat",
        pronunciation_en: "peh-RA-wat",
      },
      {
        word: "dokter jaga",
        en: "doctor on duty",
        vi: "bác sĩ trực",
        pos: "noun phrase",
        pronunciation_vi: "DOK-ter JA-ga",
        pronunciation_en: "DOK-ter JA-ga",
      },
      {
        word: "keluarga pasien",
        en: "patient's family",
        vi: "người nhà bệnh nhân",
        pos: "noun phrase",
        pronunciation_vi: "ke-LU-ar-ga PA-sien",
        pronunciation_en: "keh-LOO-ar-ga PA-syen",
      },
      {
        word: "tindakan medis",
        en: "medical procedure/action",
        vi: "thủ thuật / xử lý y tế",
        pos: "noun phrase",
        pronunciation_vi: "TIN-da-kan ME-dis",
        pronunciation_en: "TIN-da-kan MEH-dis",
      },
      {
        word: "biaya awal",
        en: "initial cost",
        vi: "chi phí ban đầu",
        pos: "noun phrase",
        pronunciation_vi: "bi-A-ya A-wal",
        pronunciation_en: "bee-A-ya A-wal",
      },
    ],
    dialogue: [
      {
        speaker: "Keluarga Pasien",
        text: "Tolong, ini keadaan darurat. Pasien sesak napas.",
        vi: "Làm ơn giúp, đây là tình trạng khẩn cấp. Bệnh nhân khó thở.",
        en: "Please help, this is an emergency. The patient has shortness of breath.",
      },
      {
        speaker: "Perawat",
        text: "Baik, segera bawa ke ruang IGD. Saya cek tekanan darah dulu.",
        vi: "Vâng, đưa vào phòng cấp cứu ngay. Tôi kiểm tra huyết áp trước.",
        en: "Okay, bring them to the ER room immediately. I will check blood pressure first.",
      },
      {
        speaker: "Petugas Pendaftaran",
        text: "Keluarga pasien bisa daftar di loket ini dengan KTP pasien.",
        vi: "Người nhà bệnh nhân có thể đăng ký ở quầy này bằng KTP của bệnh nhân.",
        en: "The patient's family can register at this counter with the patient's KTP.",
      },
      {
        speaker: "Keluarga Pasien",
        text: "Apakah tindakan medis ini perlu persetujuan keluarga?",
        vi: "Thủ thuật/xử lý y tế này có cần sự đồng ý của gia đình không?",
        en: "Does this medical procedure require family consent?",
      },
      {
        speaker: "Dokter Jaga",
        text: "Ya, kami akan jelaskan prosedurnya dulu dengan bahasa yang sederhana.",
        vi: "Có, chúng tôi sẽ giải thích quy trình trước bằng ngôn ngữ đơn giản.",
        en: "Yes, we will explain the procedure first in simple language.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Đây là tình trạng khẩn cấp.",
        prompt_en: "Translate into Indonesian: This is an emergency situation.",
        answer: "Ini keadaan darurat.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Dokter ___ sedang menangani pasien lain.",
        prompt_en: "Fill in the blank: Dokter ___ sedang menangani pasien lain.",
        answer: "jaga",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Gia đình bệnh nhân chờ ở phòng chờ.",
        prompt_en: "Translate into Indonesian: The patient's family waits in the waiting room.",
        answer: "Keluarga pasien menunggu di ruang tunggu.",
      },
      {
        type: "roleplay",
        prompt_vi: "Bạn là người nhà bệnh nhân ở IGD. Hỏi chi phí ban đầu phải trả là bao nhiêu.",
        prompt_en: "You are a patient's family member in the ER. Ask how much initial cost must be paid.",
        answer: "Berapa biaya awal yang harus dibayar?",
      },
    ],
  },
];
