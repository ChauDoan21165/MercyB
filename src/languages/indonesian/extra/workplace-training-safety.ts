// Workplace Training Safety Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for workplace training: SOPs, safety rules,
// supervisor instructions, hands-on practice, certificates, evaluations, and
// common mistakes. Indonesian target text lives in `en`, Vietnamese glosses in
// `vi`, Vietnamese L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.

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

export const workplaceTrainingSafetyLessons: IndonesianLesson[] = [
  {
    id: "indonesian_workplace_training_safety",
    level: "B1",
    category: "workplace_safety",
    title_vi: "Pelatihan kerja và keselamatan: hiểu SOP và làm đúng",
    title_en: "Workplace training and safety: understanding SOPs and working correctly",
    sentences: [
      {
        en: "Karyawan baru wajib mengikuti pelatihan kerja sebelum mulai bekerja sendiri.",
        vi: "Nhân viên mới bắt buộc phải tham gia đào tạo công việc trước khi bắt đầu làm một mình.",
        pronunciation_focus: [
          "pe-LA-tih-an KER-ja - `pelatihan kerja` = đào tạo công việc tại nơi làm.",
          "`wajib mengikuti` = bắt buộc tham gia; thường dùng trong quy định công ty.",
          "`bekerja sendiri` = làm một mình/không có người kèm; `sendiri` đứng sau động từ/cụm động từ.",
          "Luyện: `Karyawan baru wajib mengikuti pelatihan kerja.`",
        ],
        pronunciation_focus_en: [
          "pe-LA-tih-an KER-ja - `pelatihan kerja` = workplace/job training.",
          "`wajib mengikuti` = required to attend; common in company rules.",
          "`bekerja sendiri` = work independently/alone; `sendiri` follows the verb phrase.",
          "Drill: `Karyawan baru wajib mengikuti pelatihan kerja.`",
        ],
      },
      {
        en: "Supervisor menjelaskan SOP sebelum kami mencoba alat itu.",
        vi: "Giám sát giải thích SOP trước khi chúng tôi thử thiết bị đó.",
        pronunciation_focus: [
          "su-per-VAI-sor men-je-LAS-kan ES-o-PE - `menjelaskan SOP` = giải thích quy trình chuẩn.",
          "`SOP` thường đọc từng chữ hoặc theo tiếng Anh trong công sở Indonesia.",
          "`sebelum kami mencoba` = trước khi chúng tôi thử; `mencoba` là động từ trang trọng hơn `coba`.",
          "Luyện: `Supervisor menjelaskan SOP.`",
        ],
        pronunciation_focus_en: [
          "su-per-VAI-sor men-je-LAS-kan ES-o-PE - `menjelaskan SOP` = explain the standard procedure.",
          "`SOP` is often read letter by letter or with English-style pronunciation in Indonesian workplaces.",
          "`sebelum kami mencoba` = before we try; `mencoba` is more formal than bare `coba`.",
          "Drill: `Supervisor menjelaskan SOP.`",
        ],
      },
      {
        en: "Instruksi supervisor harus diikuti langkah demi langkah.",
        vi: "Chỉ dẫn của giám sát phải được làm theo từng bước một.",
        pronunciation_focus: [
          "in-STRUK-si su-per-VAI-sor - `instruksi supervisor` = chỉ dẫn của giám sát.",
          "`harus diikuti` = phải được làm theo; bị động `di-` rất tự nhiên trong quy định.",
          "`langkah demi langkah` = từng bước một; cụm nhấn mạnh quy trình.",
          "Luyện: `Ikuti instruksi langkah demi langkah.`",
        ],
        pronunciation_focus_en: [
          "in-STRUK-si su-per-VAI-sor - `instruksi supervisor` = supervisor's instructions.",
          "`harus diikuti` = must be followed; passive `di-` is natural in rules.",
          "`langkah demi langkah` = step by step; a phrase that emphasizes process.",
          "Drill: `Ikuti instruksi langkah demi langkah.`",
        ],
      },
      {
        en: "Jangan menyalakan mesin sebelum memastikan area kerja aman.",
        vi: "Đừng bật máy trước khi bảo đảm khu vực làm việc an toàn.",
        pronunciation_focus: [
          "me-nya-LA-kan me-SIN - `menyalakan mesin` = bật/khởi động máy.",
          "`memastikan area kerja aman` = bảo đảm khu vực làm việc an toàn; `aman` là tính từ.",
          "Lỗi người Việt: nói `buka mesin` theo thói quen. Với máy móc, dùng `menyalakan` hoặc `menghidupkan`.",
          "Luyện: `Jangan menyalakan mesin dulu.`",
        ],
        pronunciation_focus_en: [
          "me-nya-LA-kan me-SIN - `menyalakan mesin` = turn on/start a machine.",
          "`memastikan area kerja aman` = make sure the work area is safe; `aman` is the adjective.",
          "VN-speaker trap: saying `buka mesin` from Vietnamese/English habit. For machines, use `menyalakan` or `menghidupkan`.",
          "Drill: `Jangan menyalakan mesin dulu.`",
        ],
      },
      {
        en: "Setelah teori, peserta melakukan praktik langsung dengan pendamping.",
        vi: "Sau phần lý thuyết, học viên thực hành trực tiếp với người kèm.",
        pronunciation_focus: [
          "PRAK-tik LANG-sung - `praktik langsung` = thực hành trực tiếp.",
          "`peserta` = người tham gia/học viên; phù hợp với lớp đào tạo.",
          "`dengan pendamping` = với người kèm/hướng dẫn; không nhất thiết là giáo viên chính.",
          "Luyện: `Peserta melakukan praktik langsung.`",
        ],
        pronunciation_focus_en: [
          "PRAK-tik LANG-soong - `praktik langsung` = hands-on practice.",
          "`peserta` = participant/trainee; suitable for training classes.",
          "`dengan pendamping` = with a mentor/assistant; not necessarily the main teacher.",
          "Drill: `Peserta melakukan praktik langsung.`",
        ],
      },
      {
        en: "Kalau ragu, lebih baik bertanya daripada menebak prosedur.",
        vi: "Nếu không chắc, tốt hơn là hỏi thay vì đoán quy trình.",
        pronunciation_focus: [
          "RA-gu - `ragu` = do dự/không chắc.",
          "`lebih baik bertanya daripada...` = tốt hơn là hỏi thay vì...; cấu trúc so sánh rất hữu ích.",
          "`menebak prosedur` = đoán quy trình; trong an toàn lao động đây là hành vi rủi ro.",
          "Luyện: `Lebih baik bertanya daripada menebak.`",
        ],
        pronunciation_focus_en: [
          "RA-goo - `ragu` = unsure/in doubt.",
          "`lebih baik bertanya daripada...` = it is better to ask than to...; a useful comparison pattern.",
          "`menebak prosedur` = guess the procedure; risky in safety contexts.",
          "Drill: `Lebih baik bertanya daripada menebak.`",
        ],
      },
      {
        en: "Kesalahan umum terjadi ketika pekerja melewati pemeriksaan awal.",
        vi: "Lỗi thường gặp xảy ra khi người lao động bỏ qua bước kiểm tra ban đầu.",
        pronunciation_focus: [
          "ke-SA-lah-an U-mum - `kesalahan umum` = lỗi phổ biến/thường gặp.",
          "`melewati pemeriksaan awal` = bỏ qua kiểm tra ban đầu; nghĩa là không làm bước đó.",
          "`terjadi ketika` = xảy ra khi; dùng tốt trong báo cáo đào tạo.",
          "Luyện: `Ini kesalahan umum.`",
        ],
        pronunciation_focus_en: [
          "ke-SA-lah-an OO-moom - `kesalahan umum` = common mistake.",
          "`melewati pemeriksaan awal` = skip the initial check; it means the step was not done.",
          "`terjadi ketika` = happens when; useful in training reports.",
          "Drill: `Ini kesalahan umum.`",
        ],
      },
      {
        en: "Evaluasi dilakukan setelah praktik untuk melihat pemahaman peserta.",
        vi: "Đánh giá được thực hiện sau phần thực hành để xem mức hiểu của học viên.",
        pronunciation_focus: [
          "e-va-lu-A-si - `evaluasi` = đánh giá; từ mượn quốc tế trong công sở.",
          "`dilakukan setelah praktik` = được thực hiện sau thực hành; bị động trang trọng.",
          "`pemahaman peserta` = sự hiểu biết của học viên; gốc `paham` = hiểu.",
          "Luyện: `Evaluasi dilakukan setelah praktik.`",
        ],
        pronunciation_focus_en: [
          "e-va-lu-A-si - `evaluasi` = evaluation; an international loanword used at work.",
          "`dilakukan setelah praktik` = conducted after practice; formal passive wording.",
          "`pemahaman peserta` = participants' understanding; root `paham` = understand.",
          "Drill: `Evaluasi dilakukan setelah praktik.`",
        ],
      },
      {
        en: "Peserta yang lulus evaluasi akan mendapat sertifikat pelatihan.",
        vi: "Học viên vượt qua đánh giá sẽ nhận chứng chỉ đào tạo.",
        pronunciation_focus: [
          "SER-ti-fi-kat pe-LA-tih-an - `sertifikat pelatihan` = chứng chỉ đào tạo.",
          "`lulus evaluasi` = vượt qua bài đánh giá; không chỉ dùng cho trường học.",
          "`akan mendapat` = sẽ nhận; `mendapat` trang trọng hơn `dapat` trong thông báo.",
          "Luyện: `Saya mendapat sertifikat pelatihan.`",
        ],
        pronunciation_focus_en: [
          "SER-ti-fi-kat pe-LA-tih-an - `sertifikat pelatihan` = training certificate.",
          "`lulus evaluasi` = pass the evaluation; not only for school exams.",
          "`akan mendapat` = will receive; `mendapat` is more formal than `dapat` in announcements.",
          "Drill: `Saya mendapat sertifikat pelatihan.`",
        ],
      },
      {
        en: "Jika ada kecelakaan kecil saat latihan, segera hentikan kegiatan dan lapor.",
        vi: "Nếu có tai nạn nhỏ trong lúc luyện tập, hãy dừng hoạt động ngay và báo cáo.",
        pronunciation_focus: [
          "ke-ce-la-KA-an KE-cil - `kecelakaan kecil` = tai nạn nhỏ/sự cố nhẹ.",
          "`segera hentikan kegiatan` = dừng hoạt động ngay; dùng mệnh lệnh an toàn.",
          "`dan lapor` = và báo cáo; trong văn nói công sở, `lapor` ngắn gọn và tự nhiên.",
          "Luyện: `Segera hentikan kegiatan dan lapor.`",
        ],
        pronunciation_focus_en: [
          "ke-che-la-KA-an KE-chil - `kecelakaan kecil` = minor accident/incident.",
          "`segera hentikan kegiatan` = stop the activity immediately; safety command wording.",
          "`dan lapor` = and report it; in workplace speech, short `lapor` is natural.",
          "Drill: `Segera hentikan kegiatan dan lapor.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở nhiều nơi làm việc tại Indonesia, SOP, pelatihan K3, daftar hadir, praktik langsung, dan evaluasi là phần bình thường trước khi nhân viên mới được làm độc lập. Khi chưa hiểu, cách nói an toàn và lịch sự là hỏi supervisor hoặc pendamping, không tự đoán quy trình.",
    cultural_notes_en:
      "In many Indonesian workplaces, SOPs, K3 safety training, attendance lists, hands-on practice, and evaluations are normal before a new worker can work independently. If you are unsure, the safe and polite move is to ask the supervisor or mentor instead of guessing the procedure.",
    tip_advice_vi:
      "Mẫu câu hữu ích: `Saya belum paham bagian ini` (tôi chưa hiểu phần này), `Boleh saya ulangi langkahnya?` (tôi có thể lặp lại các bước không?), và `Apakah ini sudah sesuai SOP?` (việc này đã đúng SOP chưa?). Tránh nói quá tự tin nếu bạn chưa chắc.",
    tip_advice_en:
      "Useful lines: `Saya belum paham bagian ini` (I do not understand this part yet), `Boleh saya ulangi langkahnya?` (May I repeat the steps?), and `Apakah ini sudah sesuai SOP?` (Is this according to the SOP?). Avoid sounding overly confident when you are not sure.",
    vocabulary: [
      {
        word: "pelatihan kerja",
        en: "workplace/job training",
        vi: "đào tạo công việc",
        pos: "noun phrase",
        pronunciation_vi: "pe-LA-tih-an KER-ja",
        pronunciation_en: "pe-LA-tih-an KER-ja",
      },
      {
        word: "SOP",
        en: "standard operating procedure",
        vi: "quy trình thao tác chuẩn",
        pos: "abbreviation",
        pronunciation_vi: "ES-o-PE",
        pronunciation_en: "ess-oh-PEE",
      },
      {
        word: "keselamatan",
        en: "safety",
        vi: "sự an toàn/an toàn lao động",
        pos: "noun",
        pronunciation_vi: "ke-se-la-MAT-an",
        pronunciation_en: "ke-se-la-MAT-an",
      },
      {
        word: "instruksi supervisor",
        en: "supervisor's instruction",
        vi: "chỉ dẫn của giám sát",
        pos: "noun phrase",
        pronunciation_vi: "in-STRUK-si su-per-VAI-sor",
        pronunciation_en: "in-STRUK-si su-per-VAI-sor",
      },
      {
        word: "praktik langsung",
        en: "hands-on practice",
        vi: "thực hành trực tiếp",
        pos: "noun phrase",
        pronunciation_vi: "PRAK-tik LANG-sung",
        pronunciation_en: "PRAK-tik LANG-soong",
      },
      {
        word: "sertifikat pelatihan",
        en: "training certificate",
        vi: "chứng chỉ đào tạo",
        pos: "noun phrase",
        pronunciation_vi: "SER-ti-fi-kat pe-LA-tih-an",
        pronunciation_en: "SER-ti-fi-kat pe-LA-tih-an",
      },
      {
        word: "evaluasi",
        en: "evaluation",
        vi: "đánh giá",
        pos: "noun",
        pronunciation_vi: "e-va-lu-A-si",
        pronunciation_en: "e-va-lu-A-si",
      },
      {
        word: "kesalahan umum",
        en: "common mistake",
        vi: "lỗi thường gặp",
        pos: "noun phrase",
        pronunciation_vi: "ke-SA-lah-an U-mum",
        pronunciation_en: "ke-SA-lah-an OO-moom",
      },
      {
        word: "pemeriksaan awal",
        en: "initial check",
        vi: "kiểm tra ban đầu",
        pos: "noun phrase",
        pronunciation_vi: "pe-me-RIK-sa-an A-wal",
        pronunciation_en: "pe-me-RIK-sa-an A-wal",
      },
      {
        word: "menebak prosedur",
        en: "guess the procedure",
        vi: "đoán quy trình",
        pos: "verb phrase",
        pronunciation_vi: "me-NE-bak pro-se-DUR",
        pronunciation_en: "me-NE-bak pro-se-DOOR",
      },
    ],
    dialogue: [
      {
        speaker: "Peserta",
        text: "Pak, saya belum paham langkah kedua dalam SOP ini.",
        vi: "Anh/chú ơi, tôi chưa hiểu bước thứ hai trong SOP này.",
        en: "Sir, I do not understand the second step in this SOP yet.",
      },
      {
        speaker: "Supervisor",
        text: "Tidak apa-apa. Kita ulangi pelan-pelan sebelum praktik langsung.",
        vi: "Không sao. Chúng ta lặp lại từ từ trước khi thực hành trực tiếp.",
        en: "That is okay. We will repeat it slowly before hands-on practice.",
      },
      {
        speaker: "Peserta",
        text: "Apakah saya boleh mencoba dengan pendamping dulu?",
        vi: "Tôi có thể thử với người kèm trước không?",
        en: "May I try with a mentor first?",
      },
      {
        speaker: "Supervisor",
        text: "Boleh. Ikuti instruksi saya dan jangan menyalakan mesin sebelum saya beri tanda.",
        vi: "Được. Hãy làm theo chỉ dẫn của tôi và đừng bật máy trước khi tôi ra hiệu.",
        en: "Yes. Follow my instructions and do not turn on the machine before I give the signal.",
      },
      {
        speaker: "Peserta",
        text: "Baik, kalau saya ragu, saya akan bertanya dulu.",
        vi: "Vâng, nếu tôi không chắc, tôi sẽ hỏi trước.",
        en: "Okay, if I am unsure, I will ask first.",
      },
      {
        speaker: "Supervisor",
        text: "Bagus. Lebih baik bertanya daripada menebak prosedur.",
        vi: "Tốt. Hỏi thì tốt hơn là đoán quy trình.",
        en: "Good. It is better to ask than to guess the procedure.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt: "Translate into Indonesian: Nhân viên mới bắt buộc phải tham gia đào tạo công việc.",
        answer: "Karyawan baru wajib mengikuti pelatihan kerja.",
      },
      {
        type: "translation",
        prompt: "Translate into Vietnamese: Instruksi supervisor harus diikuti langkah demi langkah.",
        answer: "Chỉ dẫn của giám sát phải được làm theo từng bước một.",
      },
      {
        type: "fill_blank",
        prompt: "Kalau ragu, lebih baik ____ daripada menebak prosedur.",
        answer: "bertanya",
      },
      {
        type: "fill_blank",
        prompt: "Peserta yang lulus evaluasi akan mendapat ____ pelatihan.",
        answer: "sertifikat",
      },
      {
        type: "matching",
        prompt: "Match the Indonesian phrase to the meaning.",
        pairs: [
          ["praktik langsung", "hands-on practice / thực hành trực tiếp"],
          ["kesalahan umum", "common mistake / lỗi thường gặp"],
          ["pemeriksaan awal", "initial check / kiểm tra ban đầu"],
          ["sertifikat pelatihan", "training certificate / chứng chỉ đào tạo"],
        ],
      },
    ],
  },
];

export default workplaceTrainingSafetyLessons;
