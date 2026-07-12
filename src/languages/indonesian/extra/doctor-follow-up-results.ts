// Doctor Follow-up & Results Indonesian (Vietnamese -> Indonesian study track).
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
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

type IndonesianVocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type IndonesianDialogueLine = {
  cell_id?: string;
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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_doctor_follow_up_results",
    level: "A2",
    category: "health",
    title_vi: "Tái khám bác sĩ và nhận kết quả xét nghiệm",
    title_en: "Doctor follow-up and test results",
    sentences: [
      {
        en: "Saya datang untuk kontrol dokter.",
        vi: "Tôi đến để tái khám bác sĩ.",
        pronunciation_focus: [
          "SA-ya DA-tang UN-tuk kon-TROL DOK-ter - `kontrol dokter` = tái khám/khám lại với bác sĩ.",
          "Lỗi người Việt: dịch `tái khám` thành `periksa lagi` trong quầy bệnh viện. Nói tự nhiên: `kontrol dokter`.",
          "Luyện: `Saya datang untuk kontrol dokter.`",
        ],
        pronunciation_focus_en: [
          "SA-ya DA-tang UN-tuk kon-TROL DOK-ter - `kontrol dokter` = follow-up visit with the doctor.",
          "VN-speaker trap: translating follow-up as `periksa lagi` at the hospital counter. Natural phrasing: `kontrol dokter`.",
          "Drill: `Saya datang untuk kontrol dokter.`",
        ],
      },
      {
        en: "Saya mau mengambil hasil lab.",
        vi: "Tôi muốn lấy kết quả xét nghiệm.",
        pronunciation_focus: [
          "SA-ya MAU me-NGAM-bil HA-sil lab - `mengambil` = lấy; `hasil lab` = kết quả xét nghiệm.",
          "Lỗi người Việt: nói `hasil darah` cho mọi loại xét nghiệm. Cụm rộng và tự nhiên là `hasil lab`.",
          "Luyện: `Saya mau mengambil hasil lab.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU me-NGAM-bil HA-sil lab - `mengambil` = pick up/collect; `hasil lab` = lab results.",
          "VN-speaker trap: saying `hasil darah` for every test. The broad, natural phrase is `hasil lab`.",
          "Drill: `Saya mau mengambil hasil lab.`",
        ],
      },
      {
        en: "Tekanan darah saya masih tinggi.",
        vi: "Huyết áp của tôi vẫn còn cao.",
        pronunciation_focus: [
          "te-KA-nan DA-rah SA-ya MA-sih TING-gi - `tekanan darah` = huyết áp; `masih` = vẫn còn.",
          "Lỗi người Việt: dịch `áp huyết` từng chữ. Tiếng Indonesia chuẩn là `tekanan darah`.",
          "Luyện: `Tekanan darah saya masih tinggi.`",
        ],
        pronunciation_focus_en: [
          "te-KA-nan DA-rah SA-ya MA-sih TING-gi - `tekanan darah` = blood pressure; `masih` = still.",
          "VN-speaker trap: word-for-word `blood pressure` guesses. Standard Indonesian is `tekanan darah`.",
          "Drill: `Tekanan darah saya masih tinggi.`",
        ],
      },
      {
        en: "Keluhan saya sudah membaik.",
        vi: "Triệu chứng/phàn nàn của tôi đã đỡ hơn.",
        pronunciation_focus: [
          "ke-LU-han SA-ya SU-dah mem-BA-ik - `keluhan` = triệu chứng/phàn nàn sức khỏe; `membaik` = cải thiện/đỡ hơn.",
          "Lỗi người Việt: nói `sudah baik` nghe như 'đã tốt'. Với bệnh đỡ hơn, dùng `sudah membaik`.",
          "Luyện: `Keluhan saya sudah membaik.`",
        ],
        pronunciation_focus_en: [
          "ke-LOO-han SA-ya SOO-dah mem-BA-ik - `keluhan` = complaint/symptom; `membaik` = improve.",
          "VN-speaker trap: saying `sudah baik`, which sounds like 'already good'. For symptoms improving, use `sudah membaik`.",
          "Drill: `Keluhan saya sudah membaik.`",
        ],
      },
      {
        en: "Obat ini membuat saya mengantuk.",
        vi: "Thuốc này làm tôi buồn ngủ.",
        pronunciation_focus: [
          "O-bat I-ni mem-BU-at SA-ya me-NGAN-tuk - `obat` = thuốc; `mengantuk` = buồn ngủ.",
          "Lỗi người Việt: nói `saya tidur` cho tác dụng phụ. `Mengantuk` là buồn ngủ, chưa chắc đã ngủ.",
          "Luyện: `Obat ini membuat saya mengantuk.`",
        ],
        pronunciation_focus_en: [
          "O-bat EE-ni mem-BOO-at SA-ya me-NGAN-tuk - `obat` = medicine; `mengantuk` = sleepy/drowsy.",
          "VN-speaker trap: saying `saya tidur` for a side effect. `Mengantuk` means drowsy, not necessarily asleep.",
          "Drill: `Obat ini membuat saya mengantuk.`",
        ],
      },
      {
        en: "Apakah resepnya bisa diulang?",
        vi: "Đơn thuốc này có thể kê lại được không?",
        pronunciation_focus: [
          "A-pa-kah RE-sep-nya BI-sa di-U-lang - `resep` = đơn thuốc; `diulang` = được lặp lại/kê lại.",
          "Lỗi người Việt: lẫn `resep` với `obat`. `Resep` là đơn thuốc, `obat` là thuốc.",
          "Luyện: `Resepnya bisa diulang?`",
        ],
        pronunciation_focus_en: [
          "A-pa-kah RE-sep-nya BEE-sa di-OO-lang - `resep` = prescription; `diulang` = repeated/refilled.",
          "VN-speaker trap: mixing up `resep` and `obat`. `Resep` is the prescription; `obat` is the medicine.",
          "Drill: `Resepnya bisa diulang?`",
        ],
      },
      {
        en: "Saya perlu rujukan ke dokter spesialis.",
        vi: "Tôi cần giấy chuyển tuyến đến bác sĩ chuyên khoa.",
        pronunciation_focus: [
          "SA-ya per-LU ru-JU-kan ke DOK-ter spe-si-a-LIS - `rujukan` = giấy chuyển tuyến/giới thiệu; `dokter spesialis` = bác sĩ chuyên khoa.",
          "Lỗi người Việt: dùng `surat pindah dokter`. Từ y tế đúng là `rujukan`.",
          "Luyện: `Saya perlu rujukan ke dokter spesialis.`",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LOO roo-JOO-kan ke DOK-ter spe-see-a-LIS - `rujukan` = referral; `dokter spesialis` = specialist doctor.",
          "VN-speaker trap: saying `surat pindah dokter`. The medical term is `rujukan`.",
          "Drill: `Saya perlu rujukan ke dokter spesialis.`",
        ],
      },
      {
        en: "Kapan saya harus kontrol lagi?",
        vi: "Khi nào tôi phải tái khám lại?",
        pronunciation_focus: [
          "KA-pan SA-ya HA-rus kon-TROL la-GI - `kapan` = khi nào; `kontrol lagi` = tái khám lại.",
          "Lỗi người Việt: hỏi `jam berapa` khi cần ngày/lịch. Hỏi lịch tái khám rộng hơn dùng `kapan`.",
          "Luyện: `Kapan saya harus kontrol lagi?`",
        ],
        pronunciation_focus_en: [
          "KA-pan SA-ya HA-rus kon-TROL la-GEE - `kapan` = when; `kontrol lagi` = follow up again.",
          "VN-speaker trap: asking `jam berapa` when you need a date/schedule. For follow-up timing, use broader `kapan`.",
          "Drill: `Kapan saya harus kontrol lagi?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `kontrol dokter` nghĩa là tái khám sau lần khám đầu, đặc biệt khi bác sĩ cần xem `hasil lab`, theo dõi `tekanan darah`, điều chỉnh thuốc, hoặc viết `rujukan`. Nếu dùng BPJS, rujukan thường rất quan trọng để gặp `dokter spesialis`. Khi thuốc gây khó chịu, nói rõ `efek obat` như mengantuk, mual, pusing, hoặc alergi.",
    cultural_notes_en:
      "In Indonesia, `kontrol dokter` means a follow-up visit after the first consultation, especially when the doctor needs to review `hasil lab`, monitor `tekanan darah`, adjust medicine, or write a `rujukan`. If using BPJS, referrals are often important for seeing a `dokter spesialis`. When medication bothers you, clearly describe the `efek obat`, such as drowsiness, nausea, dizziness, or allergy.",
    tip_advice_vi:
      "Mẹo cho người Việt: nhớ ba cặp quan trọng: `obat` = thuốc, `resep` = đơn thuốc; `hasil lab` = kết quả xét nghiệm, `keluhan` = triệu chứng/phàn nàn; `kontrol` = tái khám, `rujukan` = giấy chuyển tuyến. Khi triệu chứng đỡ, nói `sudah membaik`, không chỉ `sudah baik`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: remember three important pairs: `obat` = medicine, `resep` = prescription; `hasil lab` = lab results, `keluhan` = symptoms/complaint; `kontrol` = follow-up, `rujukan` = referral. When symptoms improve, say `sudah membaik`, not just `sudah baik`.",
    vocabulary: [
      {
        cell_id: "5f240d8b-5012-4123-bf3e-aea6c6577857",
        word: "kontrol dokter",
        en: "doctor follow-up",
        vi: "tái khám bác sĩ",
        pos: "noun / verb phrase",
        pronunciation_vi: "kon-TROL DOK-ter",
        pronunciation_en: "kon-TROL DOK-ter",
      },
      {
        cell_id: "1a797696-f435-4486-8a77-232767290dea",
        word: "hasil lab",
        en: "lab results",
        vi: "kết quả xét nghiệm",
        pos: "noun phrase",
        pronunciation_vi: "HA-sil lab",
        pronunciation_en: "HA-sil lab",
      },
      {
        cell_id: "2cdacf22-56cf-4bec-9207-0234dcecda87",
        word: "tekanan darah",
        en: "blood pressure",
        vi: "huyết áp",
        pos: "noun phrase",
        pronunciation_vi: "te-KA-nan DA-rah",
        pronunciation_en: "te-KA-nan DA-rah",
      },
      {
        cell_id: "cbfadcdc-84f5-4e37-a98c-8435956f337a",
        word: "resep ulang",
        en: "prescription refill",
        vi: "kê lại đơn thuốc",
        pos: "noun phrase",
        pronunciation_vi: "RE-sep U-lang",
        pronunciation_en: "RE-sep OO-lang",
      },
      {
        cell_id: "bae71076-6452-46d2-8848-7fc0f04d7ce2",
        word: "rujukan",
        en: "referral",
        vi: "giấy chuyển tuyến",
        pos: "noun",
        pronunciation_vi: "ru-JU-kan",
        pronunciation_en: "roo-JOO-kan",
      },
      {
        cell_id: "18956e88-d0f2-4d3d-861e-40b663e7345f",
        word: "keluhan membaik",
        en: "symptoms improving",
        vi: "triệu chứng đỡ hơn",
        pos: "phrase",
        pronunciation_vi: "ke-LU-han mem-BA-ik",
        pronunciation_en: "ke-LOO-han mem-BA-ik",
      },
      {
        cell_id: "bfe6ab58-e5b1-42ba-99d7-953ee2bdbf88",
        word: "efek obat",
        en: "medicine effect / side effect",
        vi: "tác dụng của thuốc / tác dụng phụ",
        pos: "noun phrase",
        pronunciation_vi: "E-fek O-bat",
        pronunciation_en: "E-fek O-bat",
      },
    ],
    dialogue: [
      {
        cell_id: "a51e778b-cd9f-4daa-b0c0-05038f9a43fc",
        speaker: "Pasien",
        text: "Dok, saya datang untuk kontrol dan mengambil hasil lab.",
        vi: "Bác sĩ, tôi đến tái khám và lấy kết quả xét nghiệm.",
        en: "Doctor, I came for a follow-up and to collect lab results.",
      },
      {
        cell_id: "b3051beb-f048-4445-868b-39c01bf8adf8",
        speaker: "Dokter",
        text: "Baik. Keluhannya sekarang bagaimana?",
        vi: "Được. Bây giờ triệu chứng thế nào?",
        en: "Okay. How are the symptoms now?",
      },
      {
        cell_id: "09d9af81-d08e-46d7-96d9-8998bdb71e40",
        speaker: "Pasien",
        text: "Keluhan saya sudah membaik, tapi obatnya membuat saya mengantuk.",
        vi: "Triệu chứng đã đỡ hơn, nhưng thuốc làm tôi buồn ngủ.",
        en: "My symptoms have improved, but the medicine makes me drowsy.",
      },
      {
        cell_id: "ad85b17f-6a5d-4b9f-a7ac-f1141be2e30e",
        speaker: "Dokter",
        text: "Tekanan darah masih tinggi. Saya beri resep ulang dan rujukan ke spesialis.",
        vi: "Huyết áp vẫn cao. Tôi sẽ kê lại đơn và cho giấy chuyển tuyến đến chuyên khoa.",
        en: "The blood pressure is still high. I will give a prescription refill and a referral to a specialist.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya mau mengambil ___ lab.`",
        prompt_en: "Fill in the blank: `Saya mau mengambil ___ lab.`",
        answer: "hasil",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Triệu chứng của tôi đã đỡ hơn.",
        prompt_en: "Translate into Indonesian: My symptoms have improved.",
        answer: "Keluhan saya sudah membaik.",
      },
      {
        type: "matching",
        prompt_vi: "Nối nghĩa đúng.",
        prompt_en: "Match the meanings.",
        pairs: [
          ["kontrol dokter", "tái khám bác sĩ"],
          ["hasil lab", "kết quả xét nghiệm"],
          ["tekanan darah", "huyết áp"],
          ["rujukan", "giấy chuyển tuyến"],
          ["efek obat", "tác dụng của thuốc"],
        ],
      },
    ],
  },
];
