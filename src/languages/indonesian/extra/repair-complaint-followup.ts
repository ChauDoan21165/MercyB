// Repair Complaint Follow-up Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for following up on repair complaints:
// delayed technicians, report numbers, rescheduling, polite complaints, and
// asking for certainty. Indonesian target text lives in `en`, Vietnamese
// glosses in `vi`, Vietnamese L1 notes in `pronunciation_focus`, and English
// companions in `pronunciation_focus_en`.

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
  cell_id?: string;
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
  cell_id?: string;
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

export const repairComplaintFollowupLessons: IndonesianLesson[] = [
  {
    id: "indonesian_repair_complaint_followup",
    level: "B1",
    category: "home_services",
    title_vi: "Follow up perbaikan: komplain sopan và minta kepastian",
    title_en: "Repair follow-up: polite complaints and asking for certainty",
    sentences: [
      {
        en: "Saya mau follow up perbaikan AC dengan nomor laporan ini.",
        vi: "Tôi muốn theo dõi tiếp việc sửa máy lạnh với số báo cáo này.",
        pronunciation_focus: [
          "FO-low ap per-BAI-kan - `follow up perbaikan` = theo dõi tiếp việc sửa chữa.",
          "`nomor laporan` = số báo cáo/số hồ sơ; khi hỏi số, dùng `berapa`.",
          "Lỗi người Việt: nói `ikut lagi perbaikan` nghe sai. Trong CS, `follow up` rất tự nhiên.",
          "Luyện: `Saya mau follow up perbaikan.`",
        ],
        pronunciation_focus_en: [
          "FO-low up per-BAI-kan - `follow up perbaikan` = follow up on the repair.",
          "`nomor laporan` = report/reference number; when asking for a number, use `berapa`.",
          "VN-speaker trap: `ikut lagi perbaikan` sounds wrong. In customer service, `follow up` is natural.",
          "Drill: `Saya mau follow up perbaikan.`",
        ],
      },
      {
        en: "Teknisi belum datang sesuai jadwal yang dijanjikan.",
        vi: "Kỹ thuật viên vẫn chưa đến theo lịch đã hẹn.",
        pronunciation_focus: [
          "tek-NI-si BE-lum DA-tang - `teknisi belum datang` = kỹ thuật viên chưa đến.",
          "`sesuai jadwal` = đúng/theo lịch; `yang dijanjikan` = đã được hứa/hẹn.",
          "Lỗi người Việt: nếu còn mong họ đến, dùng `belum`, không dùng `tidak datang` quá sớm.",
          "Luyện: `Teknisi belum datang sesuai jadwal.`",
        ],
        pronunciation_focus_en: [
          "tek-NEE-see BE-lum DA-tang - `teknisi belum datang` = the technician has not arrived yet.",
          "`sesuai jadwal` = according to schedule; `yang dijanjikan` = that was promised.",
          "VN-speaker trap: if you still expect arrival, use `belum`, not blunt `tidak datang` too early.",
          "Drill: `Teknisi belum datang sesuai jadwal.`",
        ],
      },
      {
        en: "Mohon dicek lagi status laporan saya.",
        vi: "Mong anh/chị kiểm tra lại trạng thái báo cáo của tôi.",
        pronunciation_focus: [
          "MO-hon di-CEK la-GI - `mohon` = xin/mong, lịch sự hơn `tolong` trong chat chính thức.",
          "`dicek` = được kiểm tra; dạng bị động từ từ mượn `cek`.",
          "`status laporan` = trạng thái hồ sơ/báo cáo; cụm CS thường gặp.",
          "Luyện: `Mohon dicek lagi status laporan saya.`",
        ],
        pronunciation_focus_en: [
          "MO-hon dee-CHEK la-GEE - `mohon` = kindly/request, more formal than `tolong` in official chat.",
          "`dicek` = checked; passive form from the loanword `cek`.",
          "`status laporan` = report/case status; common in customer service.",
          "Drill: `Mohon dicek lagi status laporan saya.`",
        ],
      },
      {
        en: "Saya sudah menunggu dari pagi, tetapi belum ada kabar.",
        vi: "Tôi đã chờ từ sáng, nhưng vẫn chưa có tin tức.",
        pronunciation_focus: [
          "me-NUNG-gu da-RI PA-gi - `menunggu dari pagi` = chờ từ sáng.",
          "`belum ada kabar` = chưa có tin/chưa được báo; rất tự nhiên trong follow-up.",
          "`tetapi` trang trọng hơn `tapi`, phù hợp khi viết komplain.",
          "Luyện: `Belum ada kabar sampai sekarang.`",
        ],
        pronunciation_focus_en: [
          "me-NOONG-goo da-REE PA-gee - `menunggu dari pagi` = waiting since morning.",
          "`belum ada kabar` = no news/update yet; very natural in follow-ups.",
          "`tetapi` is more formal than `tapi`, useful in written complaints.",
          "Drill: `Belum ada kabar sampai sekarang.`",
        ],
      },
      {
        en: "Apakah bisa dibuat janji ulang untuk besok pagi?",
        vi: "Có thể sắp xếp lại lịch hẹn vào sáng mai không?",
        pronunciation_focus: [
          "JAN-ji U-lang - `janji ulang` = lịch hẹn lại/cuộc hẹn mới.",
          "`dibuat` = được tạo/sắp xếp; bị động mềm hơn ra lệnh trực tiếp.",
          "Lỗi người Việt: dịch `hẹn lại` thành `janji lagi` được hiểu, nhưng `janji ulang` rõ hơn trong dịch vụ.",
          "Luyện: `Bisa dibuat janji ulang?`",
        ],
        pronunciation_focus_en: [
          "JAN-jee OO-lang - `janji ulang` = rescheduled appointment/new appointment.",
          "`dibuat` = made/arranged; passive wording sounds softer than a direct command.",
          "VN-speaker trap: `janji lagi` may be understood, but `janji ulang` is clearer in service contexts.",
          "Drill: `Bisa dibuat janji ulang?`",
        ],
      },
      {
        en: "Saya perlu kepastian jam kedatangan teknisi.",
        vi: "Tôi cần sự chắc chắn về giờ kỹ thuật viên đến.",
        pronunciation_focus: [
          "ke-PAS-ti-an - `kepastian` = sự chắc chắn/xác nhận rõ.",
          "`jam kedatangan` = giờ đến; danh từ từ `datang` là `kedatangan`.",
          "`perlu kepastian` nghe chắc nhưng vẫn lịch sự, tốt hơn nói `harus pasti sekarang`.",
          "Luyện: `Saya perlu kepastian jam kedatangan.`",
        ],
        pronunciation_focus_en: [
          "ke-PAS-ti-an - `kepastian` = certainty/clear confirmation.",
          "`jam kedatangan` = arrival time; noun from `datang` is `kedatangan`.",
          "`perlu kepastian` sounds firm but polite, better than `harus pasti sekarang`.",
          "Drill: `Saya perlu kepastian jam kedatangan.`",
        ],
      },
      {
        en: "Kalau teknisi tidak bisa datang hari ini, mohon beri tahu sejak awal.",
        vi: "Nếu kỹ thuật viên không thể đến hôm nay, mong anh/chị báo từ sớm.",
        pronunciation_focus: [
          "be-RI ta-HU se-JAK A-wal - `beri tahu sejak awal` = báo từ đầu/từ sớm.",
          "`kalau ... tidak bisa` = nếu ... không thể; cấu trúc điều kiện dễ dùng.",
          "Lỗi người Việt: `kasih tahu` thân mật; `beri tahu` lịch sự hơn trong komplain.",
          "Luyện: `Mohon beri tahu sejak awal.`",
        ],
        pronunciation_focus_en: [
          "be-REE ta-HOO se-JAK A-wal - `beri tahu sejak awal` = inform from the beginning/early.",
          "`kalau ... tidak bisa` = if ... cannot; an easy condition pattern.",
          "VN-speaker trap: `kasih tahu` is casual; `beri tahu` is more polite in complaints.",
          "Drill: `Mohon beri tahu sejak awal.`",
        ],
      },
      {
        en: "Saya mengerti ada kendala, tetapi saya juga butuh solusi yang jelas.",
        vi: "Tôi hiểu là có trở ngại, nhưng tôi cũng cần giải pháp rõ ràng.",
        pronunciation_focus: [
          "ken-DA-la - `kendala` = trở ngại/vướng mắc, từ lịch sự trong dịch vụ.",
          "`saya mengerti` làm mềm câu komplain trước khi nêu yêu cầu.",
          "`solusi yang jelas` = giải pháp rõ ràng; cụm rất hữu ích khi follow up.",
          "Luyện: `Saya butuh solusi yang jelas.`",
        ],
        pronunciation_focus_en: [
          "ken-DA-la - `kendala` = obstacle/constraint, polite service wording.",
          "`saya mengerti` softens the complaint before making a request.",
          "`solusi yang jelas` = clear solution; very useful when following up.",
          "Drill: `Saya butuh solusi yang jelas.`",
        ],
      },
      {
        en: "Tolong catat bahwa ini sudah komplain kedua saya.",
        vi: "Xin ghi nhận rằng đây đã là lần khiếu nại thứ hai của tôi.",
        pronunciation_focus: [
          "CA-tat - `catat` = ghi lại/ghi nhận.",
          "`komplain kedua` = khiếu nại lần thứ hai; số thứ tự đứng sau danh từ.",
          "`tolong catat bahwa...` rõ ràng nhưng vẫn đủ lịch sự trong cuộc gọi.",
          "Luyện: `Ini sudah komplain kedua saya.`",
        ],
        pronunciation_focus_en: [
          "CHA-tat - `catat` = record/note down.",
          "`komplain kedua` = second complaint; ordinal number follows the noun.",
          "`tolong catat bahwa...` is clear but still polite enough on a call.",
          "Drill: `Ini sudah komplain kedua saya.`",
        ],
      },
      {
        en: "Mohon kirim konfirmasi tertulis setelah jadwal baru dibuat.",
        vi: "Mong anh/chị gửi xác nhận bằng văn bản sau khi lịch mới được lập.",
        pronunciation_focus: [
          "kon-fir-MA-si ter-TU-lis - `konfirmasi tertulis` = xác nhận bằng văn bản.",
          "`jadwal baru dibuat` = lịch mới được lập; bị động không cần nêu người làm.",
          "Mẹo: trong chat dịch vụ, xin `konfirmasi tertulis` giúp tránh hiểu nhầm về giờ hẹn.",
          "Luyện: `Mohon kirim konfirmasi tertulis.`",
        ],
        pronunciation_focus_en: [
          "kon-fir-MA-si ter-TOO-lis - `konfirmasi tertulis` = written confirmation.",
          "`jadwal baru dibuat` = the new schedule is made; passive without naming the actor.",
          "Tip: in service chat, requesting `konfirmasi tertulis` helps avoid confusion about appointment times.",
          "Drill: `Mohon kirim konfirmasi tertulis.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi follow up perbaikan ở Indonesia, giọng lịch sự nhưng rõ ràng thường hiệu quả nhất: nêu `nomor laporan`, jelaskan bahwa `teknisi belum datang`, hỏi `status laporan`, lalu minta `kepastian` hoặc `janji ulang`. Trong chat CS, các từ mượn như `follow up`, `status`, và `komplain` rất thường gặp.",
    cultural_notes_en:
      "When following up on repairs in Indonesia, a polite but clear tone often works best: state the `nomor laporan`, explain that `teknisi belum datang`, ask for the `status laporan`, then request `kepastian` or a `janji ulang`. In customer-service chat, loanwords like `follow up`, `status`, and `komplain` are very common.",
    tip_advice_vi:
      "Khung câu an toàn: `Saya mau follow up...` -> `nomor laporan saya...` -> vấn đề (`teknisi belum datang`) -> yêu cầu (`mohon kepastian` / `janji ulang`). Nếu bực, tránh viết toàn chữ in hoa hoặc dọa nạt; dùng `mohon`, `tolong catat`, và `saya berharap ada solusi yang jelas` để vừa lịch sự vừa chắc.",
    tip_advice_en:
      "Safe frame: `Saya mau follow up...` -> `nomor laporan saya...` -> issue (`teknisi belum datang`) -> request (`mohon kepastian` / `janji ulang`). If frustrated, avoid all-caps or threats; use `mohon`, `tolong catat`, and `saya berharap ada solusi yang jelas` to stay polite but firm.",
    vocabulary: [
      {
        cell_id: "405692ea-3346-42d4-994a-0728ea38fdb6",
        word: "follow up perbaikan",
        en: "follow up on a repair",
        vi: "theo dõi tiếp việc sửa chữa",
        pos: "verb phrase",
        pronunciation_vi: "FO-low ap per-BAI-kan",
        pronunciation_en: "FO-low up per-BAI-kan",
      },
      {
        cell_id: "77116450-a694-4a2a-be8e-a4a6ec4ebea0",
        word: "teknisi belum datang",
        en: "the technician has not arrived yet",
        vi: "kỹ thuật viên chưa đến",
        pos: "sentence phrase",
        pronunciation_vi: "tek-NI-si BE-lum DA-tang",
        pronunciation_en: "tek-NEE-see BE-lum DA-tang",
      },
      {
        cell_id: "84461694-5d68-447b-9f9b-3ca330b3db9a",
        word: "nomor laporan",
        en: "report/reference number",
        vi: "số báo cáo/số hồ sơ",
        pos: "noun phrase",
        pronunciation_vi: "NO-mor la-PO-ran",
        pronunciation_en: "NO-mor la-PO-ran",
      },
      {
        cell_id: "a6e26ae8-84b2-40ca-94ee-d3fd31fe7308",
        word: "janji ulang",
        en: "rescheduled appointment",
        vi: "lịch hẹn lại",
        pos: "noun phrase",
        pronunciation_vi: "JAN-ji U-lang",
        pronunciation_en: "JAN-jee OO-lang",
      },
      {
        cell_id: "3b162d57-ee0c-49b2-9d6d-13a310543fb3",
        word: "komplain sopan",
        en: "polite complaint",
        vi: "khiếu nại lịch sự",
        pos: "noun phrase",
        pronunciation_vi: "kom-PLAIN SO-pan",
        pronunciation_en: "kom-PLAIN SO-pan",
      },
      {
        cell_id: "ebd84435-a2c4-4117-b5e9-654429f3962a",
        word: "minta kepastian",
        en: "ask for certainty/confirmation",
        vi: "xin sự chắc chắn/xác nhận rõ",
        pos: "verb phrase",
        pronunciation_vi: "MIN-ta ke-PAS-ti-an",
        pronunciation_en: "MIN-ta ke-PAS-tee-an",
      },
      {
        cell_id: "87324552-3c7d-4fea-8321-a4e74b53b12e",
        word: "status laporan",
        en: "case/report status",
        vi: "trạng thái hồ sơ/báo cáo",
        pos: "noun phrase",
        pronunciation_vi: "STA-tus la-PO-ran",
        pronunciation_en: "STA-tus la-PO-ran",
      },
      {
        cell_id: "282b91eb-b51d-49c8-862b-01d43a7eb345",
        word: "konfirmasi tertulis",
        en: "written confirmation",
        vi: "xác nhận bằng văn bản",
        pos: "noun phrase",
        pronunciation_vi: "kon-fir-MA-si ter-TU-lis",
        pronunciation_en: "kon-fir-MA-see ter-TOO-lis",
      },
      {
        cell_id: "266c1383-6329-4f78-b883-0b97a6895521",
        word: "kendala",
        en: "constraint/obstacle",
        vi: "trở ngại/vướng mắc",
        pos: "noun",
        pronunciation_vi: "ken-DA-la",
        pronunciation_en: "ken-DA-la",
      },
      {
        cell_id: "c9024f83-19aa-479b-b464-6f504654b114",
        word: "beri tahu sejak awal",
        en: "inform early/from the start",
        vi: "báo từ sớm/từ đầu",
        pos: "verb phrase",
        pronunciation_vi: "be-RI ta-HU se-JAK A-wal",
        pronunciation_en: "be-REE ta-HOO se-JAK A-wal",
      },
    ],
    dialogue: [
      {
        cell_id: "e6577a41-54cc-464f-9af4-6675308f8850",
        speaker: "Pelanggan",
        text: "Halo, saya mau follow up perbaikan AC. Nomor laporan saya 4572.",
        vi: "Alô, tôi muốn theo dõi tiếp việc sửa máy lạnh. Số báo cáo của tôi là 4572.",
        en: "Hello, I want to follow up on the AC repair. My report number is 4572.",
      },
      {
        cell_id: "3c1bb831-bce8-43d4-85ce-daf5230f6cb5",
        speaker: "Layanan pelanggan",
        text: "Baik, mohon tunggu sebentar. Saya cek status laporannya dulu.",
        vi: "Vâng, xin chờ một chút. Tôi kiểm tra trạng thái hồ sơ trước.",
        en: "Okay, please wait a moment. I will check the case status first.",
      },
      {
        cell_id: "b4d19bda-590a-42c5-8efe-6a8b8d02b42c",
        speaker: "Pelanggan",
        text: "Teknisi belum datang sesuai jadwal, dan saya belum menerima kabar.",
        vi: "Kỹ thuật viên chưa đến theo lịch, và tôi chưa nhận được tin báo.",
        en: "The technician has not arrived as scheduled, and I have not received an update.",
      },
      {
        cell_id: "bf544a3c-7904-4fab-9110-1770da1f41a7",
        speaker: "Layanan pelanggan",
        text: "Mohon maaf, ada kendala di jadwal teknisi.",
        vi: "Xin lỗi, có vướng mắc trong lịch của kỹ thuật viên.",
        en: "We apologize, there is an issue with the technician's schedule.",
      },
      {
        cell_id: "93b1262b-b4a6-4885-87ee-60197e616c18",
        speaker: "Pelanggan",
        text: "Saya mengerti, tetapi saya perlu kepastian. Bisa dibuat janji ulang untuk besok pagi?",
        vi: "Tôi hiểu, nhưng tôi cần xác nhận rõ. Có thể lập lịch hẹn lại cho sáng mai không?",
        en: "I understand, but I need certainty. Can a new appointment be made for tomorrow morning?",
      },
      {
        cell_id: "8236f124-9cce-458b-895d-34865dfa600d",
        speaker: "Layanan pelanggan",
        text: "Bisa. Kami akan kirim konfirmasi tertulis lewat WhatsApp.",
        vi: "Được. Chúng tôi sẽ gửi xác nhận bằng văn bản qua WhatsApp.",
        en: "Yes. We will send written confirmation via WhatsApp.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt: "Translate into Indonesian: Kỹ thuật viên vẫn chưa đến theo lịch.",
        answer: "Teknisi belum datang sesuai jadwal.",
      },
      {
        type: "translation",
        prompt: "Translate into Vietnamese: Saya perlu kepastian jam kedatangan teknisi.",
        answer: "Tôi cần sự chắc chắn về giờ kỹ thuật viên đến.",
      },
      {
        type: "fill_blank",
        prompt: "Saya mau follow up perbaikan dengan nomor ____ ini.",
        answer: "laporan",
      },
      {
        type: "fill_blank",
        prompt: "Apakah bisa dibuat ____ ulang untuk besok pagi?",
        answer: "janji",
      },
      {
        type: "matching",
        prompt: "Match the Indonesian phrase to the meaning.",
        pairs: [
          ["minta kepastian", "ask for clear confirmation / xin xác nhận rõ"],
          ["teknisi belum datang", "the technician has not arrived yet / kỹ thuật viên chưa đến"],
          ["nomor laporan", "report number / số báo cáo"],
          ["konfirmasi tertulis", "written confirmation / xác nhận bằng văn bản"],
        ],
      },
    ],
  },
];

export default repairComplaintFollowupLessons;
