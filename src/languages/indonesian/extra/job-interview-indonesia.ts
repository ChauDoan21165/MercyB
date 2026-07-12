// src/languages/indonesian/extra/job-interview-indonesia.ts
//
// Indonesian job interview pack for Vietnamese learners.
// Covers: wawancara kerja, CV, pengalaman kerja, gaji, kontrak, lembur,
// izin kerja, and panggilan HRD.
//
// Shape mirrors the sibling Indonesian extra files. This file is self-contained:
// it declares inline types and exports one uniquely named lesson array.
//
// Field convention: sentence `en` holds TARGET-LANGUAGE Indonesian; `vi` holds
// Vietnamese. `pronunciation_focus` carries Vietnamese-facing pronunciation and
// grammar notes, including L1 traps; `pronunciation_focus_en` is the English
// companion in the same order.

type LessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

type DialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type Exercise = Record<string, unknown>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
};

export const jobInterviewIndonesiaLessons: IndonesianLesson[] = [
  {
    id: "indonesian_hrd_call_and_cv",
    level: "A2",
    category: "work",
    title_vi: "Cuộc gọi HRD — CV và lịch phỏng vấn",
    title_en: "HRD call — CV and interview schedule",
    sentences: [
      {
        en: "Saya mendapat panggilan HRD untuk wawancara kerja.",
        vi: "Tôi nhận được cuộc gọi/lời mời từ HRD để phỏng vấn xin việc.",
        pronunciation_focus: [
          "panggilan HRD → lời gọi/lời mời từ nhân sự; HRD đọc ha-er-de.",
          "wawancara kerja → phỏng vấn xin việc; `wawancara` trang trọng hơn `interview`.",
          "Lỗi người Việt: nói `panggil HRD` như động từ. Danh từ 'cuộc gọi/lời mời' là `panggilan`.",
        ],
        pronunciation_focus_en: [
          "panggilan HRD → call/invitation from HR; HRD is read ha-er-de.",
          "wawancara kerja → job interview; `wawancara` is more formal than `interview`.",
          "VN-speaker trap: using `panggil HRD` as a noun. The noun 'call/invitation' is `panggilan`.",
        ],
      },
      {
        en: "Boleh saya konfirmasi jadwal wawancara?",
        vi: "Cho tôi xác nhận lịch phỏng vấn được không?",
        pronunciation_focus: [
          "boleh saya ...? → cho phép tôi ... được không; lịch sự trong điện thoại.",
          "konfirmasi → kon-fir-MA-si, từ mượn nghĩa là xác nhận.",
          "jadwal wawancara → lịch phỏng vấn; `jadwal` không phải `jam`.",
        ],
        pronunciation_focus_en: [
          "boleh saya ...? → may I ...? polite for phone calls.",
          "konfirmasi → kon-fir-MA-si, a loanword meaning confirmation.",
          "jadwal wawancara → interview schedule; `jadwal` is not the same as `jam`.",
        ],
      },
      {
        en: "Saya sudah mengirim CV lewat email kemarin.",
        vi: "Tôi đã gửi CV qua email hôm qua.",
        pronunciation_focus: [
          "mengirim CV → gửi CV; trong văn phong công việc dùng `mengirim`, không chỉ `kirim`.",
          "lewat email → qua email; `lewat` = thông qua kênh nào.",
          "kemarin → hôm qua; đặt cuối câu là tự nhiên.",
        ],
        pronunciation_focus_en: [
          "mengirim CV → send a CV; work register prefers `mengirim`, not only bare `kirim`.",
          "lewat email → via email; `lewat` marks the channel.",
          "kemarin → yesterday; placing it at the end is natural.",
        ],
      },
      {
        en: "Apakah saya perlu membawa dokumen asli?",
        vi: "Tôi có cần mang giấy tờ bản gốc không?",
        pronunciation_focus: [
          "apakah ...? → câu hỏi có/không trang trọng.",
          "perlu membawa → cần mang theo; `membawa` từ gốc `bawa`.",
          "dokumen asli → giấy tờ bản gốc; `asli` = thật/gốc.",
        ],
        pronunciation_focus_en: [
          "apakah ...? → formal yes/no question marker.",
          "perlu membawa → need to bring; `membawa` from root `bawa`.",
          "dokumen asli → original documents; `asli` = real/original.",
        ],
      },
      {
        en: "Saya siap hadir tepat waktu.",
        vi: "Tôi sẵn sàng có mặt đúng giờ.",
        pronunciation_focus: [
          "siap hadir → sẵn sàng có mặt; `hadir` trang trọng hơn `datang`.",
          "tepat waktu → đúng giờ; cụm rất quan trọng khi nói với HRD.",
          "Lỗi người Việt: dịch 'có mặt' thành `ada`. Trong lịch hẹn dùng `hadir`.",
        ],
        pronunciation_focus_en: [
          "siap hadir → ready to attend/be present; `hadir` is more formal than `datang`.",
          "tepat waktu → on time; a key phrase with HR.",
          "VN-speaker trap: translating 'be present' as `ada`. For appointments, use `hadir`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `HRD` là cách gọi rất phổ biến cho bộ phận nhân sự, nhất là trong tin nhắn tuyển dụng. Ứng viên thường nhận `panggilan HRD` qua WhatsApp, email hoặc điện thoại. Khi trả lời, dùng `saya`, `Bapak/Ibu`, `mohon`, `boleh saya konfirmasi`, và tránh giọng quá thân mật như `aku`, `kamu`, `gue`.",
    cultural_notes_en:
      "`HRD` is a very common term for the human-resources department in Indonesian hiring messages. Applicants often receive a `panggilan HRD` by WhatsApp, email, or phone. When replying, use `saya`, `Bapak/Ibu`, `mohon`, and `boleh saya konfirmasi`; avoid casual forms like `aku`, `kamu`, or `gue`.",
    tip_advice_vi:
      "Mẹo cho người Việt: trong bối cảnh tuyển dụng, `panggilan` không chỉ là cuộc gọi mà còn là lời mời/triệu tập. Khung lịch sự an toàn: `Boleh saya konfirmasi ...?` và `Apakah saya perlu ...?`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: in hiring, `panggilan` can mean a call, invitation, or summons. Safe polite frames are `Boleh saya konfirmasi ...?` and `Apakah saya perlu ...?`.",
    vocabulary: [
      {
        cell_id: "83536216-011d-4d35-a728-15db91e2bb7c",
        word: "panggilan HRD",
        en: "HR call / interview invitation",
        vi: "cuộc gọi/lời mời từ nhân sự",
        pos: "noun phrase",
        pronunciation_vi: "pang-GIL-an ha-er-de",
        pronunciation_en: "pang-GIL-an ha-er-deh",
      },
      {
        cell_id: "cdaeab9b-d323-4bc6-b7fb-4555f0b0a864",
        word: "wawancara kerja",
        en: "job interview",
        vi: "phỏng vấn xin việc",
        pos: "noun phrase",
        pronunciation_vi: "wa-wan-CHA-ra KER-ja",
        pronunciation_en: "wa-wan-CHA-ra KER-ja",
      },
      {
        cell_id: "662fa3cb-776d-49c4-a9c5-8e3f079fc7c0",
        word: "CV",
        en: "CV / resume",
        vi: "CV / sơ yếu lý lịch",
        pos: "noun",
        pronunciation_vi: "si-vi",
        pronunciation_en: "see-vee",
      },
      {
        cell_id: "44a17461-04bf-40ac-a536-689970787902",
        word: "jadwal",
        en: "schedule",
        vi: "lịch",
        pos: "noun",
        pronunciation_vi: "JAD-wal",
        pronunciation_en: "JAD-wal",
      },
      {
        cell_id: "68fb49b8-21f9-4010-a585-c8bacdcfe60e",
        word: "mengirim",
        en: "to send",
        vi: "gửi",
        pos: "verb",
        pronunciation_vi: "me-NGI-rim",
        pronunciation_en: "meh-NGEE-rim",
      },
      {
        cell_id: "97bfffdb-226a-49c9-8a1f-dc9a8c887cac",
        word: "dokumen asli",
        en: "original documents",
        vi: "giấy tờ bản gốc",
        pos: "noun phrase",
        pronunciation_vi: "do-KU-men AS-li",
        pronunciation_en: "do-KOO-men AS-lee",
      },
      {
        cell_id: "3eca3ddb-3517-4354-ac73-2aa9f2fa2dcf",
        word: "hadir",
        en: "to attend / be present",
        vi: "có mặt / tham dự",
        pos: "verb",
        pronunciation_vi: "HA-dir",
        pronunciation_en: "HA-deer",
      },
    ],
    dialogue: [
      {
        cell_id: "d44a3964-1c41-459b-938e-cba0be94fd96",
        speaker: "HRD",
        text: "Selamat pagi, apakah benar ini dengan Ibu Linh?",
        vi: "Chào buổi sáng, có đúng đây là chị Linh không ạ?",
        en: "Good morning, am I speaking with Ms. Linh?",
      },
      {
        cell_id: "73609963-7084-4984-ab57-43f29188d874",
        speaker: "Pelamar",
        text: "Benar, Ibu. Saya Linh.",
        vi: "Đúng ạ. Tôi là Linh.",
        en: "Yes, ma'am. This is Linh.",
      },
      {
        cell_id: "18b5a67d-57d3-4d03-9ba9-1d27adb8b9c8",
        speaker: "HRD",
        text: "Kami ingin mengundang Ibu untuk wawancara kerja besok.",
        vi: "Chúng tôi muốn mời chị phỏng vấn xin việc ngày mai.",
        en: "We would like to invite you for a job interview tomorrow.",
      },
      {
        cell_id: "2e41e2d5-729f-4d37-8ba2-cde4c03413ef",
        speaker: "Pelamar",
        text: "Terima kasih. Boleh saya konfirmasi jadwal dan alamatnya?",
        vi: "Cảm ơn ạ. Cho tôi xác nhận lịch và địa chỉ được không?",
        en: "Thank you. May I confirm the schedule and address?",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ liên quan đến HRD còn thiếu:",
        instruction_en: "Fill in the missing HR/interview word:",
        items: [
          {
            prompt: "Saya mendapat ___ HRD untuk wawancara kerja. (lời mời/cuộc gọi)",
            answer: "panggilan",
            options: ["panggilan", "pakaian", "pelanggan"],
          },
          {
            prompt: "Boleh saya konfirmasi ___ wawancara? (lịch)",
            answer: "jadwal",
            options: ["jadwal", "jalan", "jawaban"],
          },
          {
            prompt: "Apakah saya perlu membawa dokumen ___? (bản gốc)",
            answer: "asli",
            options: ["asli", "asing", "aktif"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "wawancara kerja", answer: "phỏng vấn xin việc" },
          { prompt: "CV", answer: "CV / sơ yếu lý lịch" },
          { prompt: "hadir", answer: "có mặt / tham dự" },
          { prompt: "mengirim", answer: "gửi" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi nhận được lời mời HRD để phỏng vấn xin việc.", answer: "Saya mendapat panggilan HRD untuk wawancara kerja." },
          { prompt: "Tôi đã gửi CV qua email hôm qua.", answer: "Saya sudah mengirim CV lewat email kemarin." },
          { prompt: "Tôi sẵn sàng có mặt đúng giờ.", answer: "Saya siap hadir tepat waktu." },
        ],
      },
    ],
  },
  {
    id: "indonesian_interview_experience_salary_contract",
    level: "B1",
    category: "work",
    title_vi: "Trong phỏng vấn — kinh nghiệm, lương và hợp đồng",
    title_en: "In the interview — experience, salary and contract",
    sentences: [
      {
        en: "Saya punya pengalaman kerja tiga tahun di bidang ini.",
        vi: "Tôi có ba năm kinh nghiệm làm việc trong lĩnh vực này.",
        pronunciation_focus: [
          "pengalaman kerja → kinh nghiệm làm việc; `pengalaman` từ gốc `alam`.",
          "tiga tahun → ba năm; sau số đếm không lặp danh từ.",
          "Lỗi người Việt: nói `tiga tahun-tahun`. Tiếng Indonesia nói gọn `tiga tahun`.",
        ],
        pronunciation_focus_en: [
          "pengalaman kerja → work experience; `pengalaman` comes from root `alam`.",
          "tiga tahun → three years; after a number, do not reduplicate the noun.",
          "VN-speaker trap: saying `tiga tahun-tahun`. Indonesian simply says `tiga tahun`.",
        ],
      },
      {
        en: "Di pekerjaan sebelumnya, saya menangani pelanggan setiap hari.",
        vi: "Ở công việc trước đây, tôi xử lý/phụ trách khách hàng mỗi ngày.",
        pronunciation_focus: [
          "pekerjaan sebelumnya → công việc trước đây; `sebelumnya` = trước đó.",
          "menangani pelanggan → xử lý/phụ trách khách hàng; trang trọng hơn `urus pelanggan`.",
          "setiap hari → mỗi ngày; đặt cuối câu là tự nhiên.",
        ],
        pronunciation_focus_en: [
          "pekerjaan sebelumnya → previous job; `sebelumnya` = before/previously.",
          "menangani pelanggan → handle customers; more formal than `urus pelanggan`.",
          "setiap hari → every day; naturally placed at the end.",
        ],
      },
      {
        en: "Berapa kisaran gaji untuk posisi ini?",
        vi: "Khoảng lương cho vị trí này là bao nhiêu?",
        pronunciation_focus: [
          "kisaran gaji → khoảng lương; rất hữu ích khi hỏi tế nhị.",
          "untuk posisi ini → cho vị trí này; `posisi` là từ mượn.",
          "Lỗi người Việt: hỏi thẳng `gaji berapa?` nghe hơi cụt. `kisaran gaji` mềm hơn.",
        ],
        pronunciation_focus_en: [
          "kisaran gaji → salary range; useful for asking tactfully.",
          "untuk posisi ini → for this position; `posisi` is a loanword.",
          "VN-speaker trap: blunt `gaji berapa?` can sound abrupt. `kisaran gaji` is softer.",
        ],
      },
      {
        en: "Apakah gaji pokok sudah termasuk tunjangan makan dan transport?",
        vi: "Lương cơ bản đã bao gồm phụ cấp ăn uống và đi lại chưa?",
        pronunciation_focus: [
          "gaji pokok → lương cơ bản; `pokok` = chính/cơ bản.",
          "sudah termasuk → đã bao gồm; câu hỏi dùng `apakah` ở đầu.",
          "tunjangan makan dan transport → phụ cấp ăn và đi lại.",
        ],
        pronunciation_focus_en: [
          "gaji pokok → base salary; `pokok` = main/basic.",
          "sudah termasuk → already includes; the question starts with `apakah`.",
          "tunjangan makan dan transport → meal and transport allowances.",
        ],
      },
      {
        en: "Saya ingin membaca kontrak kerja sebelum tanda tangan.",
        vi: "Tôi muốn đọc hợp đồng lao động trước khi ký.",
        pronunciation_focus: [
          "ingin membaca → muốn đọc; `ingin` trang trọng hơn `mau`.",
          "kontrak kerja → hợp đồng lao động.",
          "sebelum tanda tangan → trước khi ký; trong hội thoại có thể dùng `tanda tangan` như động từ.",
        ],
        pronunciation_focus_en: [
          "ingin membaca → wish/want to read; `ingin` is more formal than `mau`.",
          "kontrak kerja → employment contract.",
          "sebelum tanda tangan → before signing; conversationally `tanda tangan` can act as the verb.",
        ],
      },
      {
        en: "Apakah ada masa percobaan dalam kontrak ini?",
        vi: "Trong hợp đồng này có thời gian thử việc không?",
        pronunciation_focus: [
          "masa percobaan → thời gian thử việc; cũng nghe `probation` trong công ty.",
          "dalam kontrak ini → trong hợp đồng này; `dalam` = trong.",
          "Lỗi người Việt: dịch 'thử việc' thành `coba kerja`. Thuật ngữ đúng: `masa percobaan`.",
        ],
        pronunciation_focus_en: [
          "masa percobaan → probation period; companies may also say `probation`.",
          "dalam kontrak ini → in this contract; `dalam` = inside/in.",
          "VN-speaker trap: translating 'trial work' as `coba kerja`. The term is `masa percobaan`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong phỏng vấn ở Indonesia, hỏi lương là bình thường nhưng nên hỏi bằng cách mềm: `kisaran gaji`, `gaji pokok`, `tunjangan`, `benefit`, `masa percobaan`. Trước khi ký, ứng viên có thể xin đọc `kontrak kerja`. Với vị trí cho người nước ngoài, cần hỏi rõ `izin kerja` và giấy tờ liên quan, nhưng tránh biến câu hỏi thành tranh luận pháp lý ngay trong vòng đầu.",
    cultural_notes_en:
      "In Indonesian interviews, asking about salary is normal, but softer phrasing helps: `kisaran gaji`, `gaji pokok`, `tunjangan`, `benefit`, and `masa percobaan`. Before signing, an applicant may ask to read the `kontrak kerja`. For foreign workers, it is appropriate to clarify `izin kerja` and related paperwork, but avoid turning the first interview into a legal argument.",
    tip_advice_vi:
      "Mẹo cho người Việt: khi nói kinh nghiệm, dùng `pengalaman kerja + số + tahun`. Khi hỏi lương, dùng `kisaran gaji` thay vì câu cụt `gaji berapa?`. Khi nói hợp đồng, `kontrak kerja` tự nhiên hơn dịch từng chữ từ tiếng Việt.",
    tip_advice_en:
      "Tip for Vietnamese speakers: for experience, use `pengalaman kerja + number + tahun`. For salary, use `kisaran gaji` instead of blunt `gaji berapa?`. For employment contracts, `kontrak kerja` is the natural phrase.",
    vocabulary: [
      {
        cell_id: "8e143a0f-e2ba-4cbb-8087-291b8f5a14eb",
        word: "pengalaman kerja",
        en: "work experience",
        vi: "kinh nghiệm làm việc",
        pos: "noun phrase",
        pronunciation_vi: "pe-nga-LA-man KER-ja",
        pronunciation_en: "peh-nga-LA-man KER-ja",
      },
      {
        cell_id: "b849c27f-4bef-4057-a684-797a5bfda1d5",
        word: "gaji",
        en: "salary / wage",
        vi: "lương",
        pos: "noun",
        pronunciation_vi: "GA-ji",
        pronunciation_en: "GA-jee",
      },
      {
        cell_id: "2bb7ddcc-24f4-4ef0-b146-882fc2cdb472",
        word: "kisaran gaji",
        en: "salary range",
        vi: "khoảng lương",
        pos: "noun phrase",
        pronunciation_vi: "ki-SA-ran GA-ji",
        pronunciation_en: "kee-SA-ran GA-jee",
      },
      {
        cell_id: "3e0be096-4700-4f14-834b-825b2f136ddc",
        word: "gaji pokok",
        en: "base salary",
        vi: "lương cơ bản",
        pos: "noun phrase",
        pronunciation_vi: "GA-ji PO-kok",
        pronunciation_en: "GA-jee PO-kok",
      },
      {
        cell_id: "1bf10a2c-ddf0-4ed7-ad54-90b8e53b0614",
        word: "tunjangan",
        en: "allowance / benefit",
        vi: "phụ cấp",
        pos: "noun",
        pronunciation_vi: "tun-JANG-an",
        pronunciation_en: "toon-JANG-an",
      },
      {
        cell_id: "6f83f2bd-5a24-46fb-b306-240eaff37234",
        word: "kontrak kerja",
        en: "employment contract",
        vi: "hợp đồng lao động",
        pos: "noun phrase",
        pronunciation_vi: "KON-trak KER-ja",
        pronunciation_en: "KON-trak KER-ja",
      },
      {
        cell_id: "abc0e9bb-b336-42bc-b56a-927f4512fd2d",
        word: "masa percobaan",
        en: "probation period",
        vi: "thời gian thử việc",
        pos: "noun phrase",
        pronunciation_vi: "MA-sa per-cho-BA-an",
        pronunciation_en: "MA-sa per-cho-BA-an",
      },
    ],
    dialogue: [
      {
        cell_id: "9a451465-2015-4b5f-8719-0daccd9ceddd",
        speaker: "HRD",
        text: "Bisa ceritakan pengalaman kerja Anda?",
        vi: "Anh/chị có thể kể về kinh nghiệm làm việc của mình không?",
        en: "Can you describe your work experience?",
      },
      {
        cell_id: "84ad6a87-fef0-4d4c-ab2a-16721bbb8fb6",
        speaker: "Pelamar",
        text: "Saya punya pengalaman kerja tiga tahun di bidang layanan pelanggan.",
        vi: "Tôi có ba năm kinh nghiệm làm việc trong lĩnh vực chăm sóc khách hàng.",
        en: "I have three years of work experience in customer service.",
      },
      {
        cell_id: "c7665d38-2604-4773-be70-07bbe6f12bd2",
        speaker: "Pelamar",
        text: "Boleh saya bertanya kisaran gaji untuk posisi ini?",
        vi: "Cho tôi hỏi khoảng lương cho vị trí này được không?",
        en: "May I ask the salary range for this position?",
      },
      {
        cell_id: "b889805c-1c66-41c4-90d3-971c4f9b12b6",
        speaker: "HRD",
        text: "Nanti kami jelaskan gaji pokok, tunjangan, dan kontraknya.",
        vi: "Lát nữa chúng tôi sẽ giải thích lương cơ bản, phụ cấp và hợp đồng.",
        en: "Later we will explain the base salary, allowances, and contract.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ phỏng vấn còn thiếu:",
        instruction_en: "Fill in the missing interview word:",
        items: [
          {
            prompt: "Saya punya ___ kerja tiga tahun. (kinh nghiệm)",
            answer: "pengalaman",
            options: ["pengalaman", "pengeluaran", "panggilan"],
          },
          {
            prompt: "Berapa kisaran ___ untuk posisi ini? (lương)",
            answer: "gaji",
            options: ["gaji", "gaya", "ganti"],
          },
          {
            prompt: "Saya ingin membaca ___ kerja sebelum tanda tangan. (hợp đồng)",
            answer: "kontrak",
            options: ["kontrak", "kontak", "kantor"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "gaji pokok", answer: "lương cơ bản" },
          { prompt: "tunjangan", answer: "phụ cấp" },
          { prompt: "masa percobaan", answer: "thời gian thử việc" },
          { prompt: "pengalaman kerja", answer: "kinh nghiệm làm việc" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi có ba năm kinh nghiệm làm việc trong lĩnh vực này.", answer: "Saya punya pengalaman kerja tiga tahun di bidang ini." },
          { prompt: "Khoảng lương cho vị trí này là bao nhiêu?", answer: "Berapa kisaran gaji untuk posisi ini?" },
          { prompt: "Trong hợp đồng này có thời gian thử việc không?", answer: "Apakah ada masa percobaan dalam kontrak ini?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_work_permit_overtime_offer",
    level: "B1",
    category: "work",
    title_vi: "Điều kiện làm việc — giấy phép, tăng ca và offer",
    title_en: "Work conditions — permit, overtime and offer",
    sentences: [
      {
        en: "Untuk pekerja asing, apakah perusahaan membantu izin kerja?",
        vi: "Đối với lao động nước ngoài, công ty có hỗ trợ giấy phép lao động không?",
        pronunciation_focus: [
          "pekerja asing → lao động/người lao động nước ngoài.",
          "perusahaan membantu → công ty hỗ trợ; `membantu` trang trọng hơn `bantu`.",
          "izin kerja → giấy phép lao động; `izin` = phép/giấy phép.",
        ],
        pronunciation_focus_en: [
          "pekerja asing → foreign worker.",
          "perusahaan membantu → the company assists; `membantu` is more formal than `bantu`.",
          "izin kerja → work permit; `izin` = permission/permit.",
        ],
      },
      {
        en: "Apakah posisi ini sering lembur?",
        vi: "Vị trí này có thường phải tăng ca không?",
        pronunciation_focus: [
          "posisi ini → vị trí này.",
          "sering lembur → thường tăng ca; `lembur` là làm thêm giờ.",
          "Lỗi người Việt: dùng `kerja lebih` theo dịch chữ. Thuật ngữ tự nhiên là `lembur`.",
        ],
        pronunciation_focus_en: [
          "posisi ini → this position.",
          "sering lembur → often works overtime; `lembur` means overtime.",
          "VN-speaker trap: translating literally as `kerja lebih`. The natural term is `lembur`.",
        ],
      },
      {
        en: "Bagaimana sistem pembayaran lembur di perusahaan ini?",
        vi: "Hệ thống trả tiền tăng ca ở công ty này như thế nào?",
        pronunciation_focus: [
          "bagaimana sistem ...? → hệ thống/cách thức ... như thế nào?",
          "pembayaran lembur → việc trả tiền tăng ca; `pembayaran` từ gốc `bayar`.",
          "di perusahaan ini → ở công ty này; `perusahaan` = công ty.",
        ],
        pronunciation_focus_en: [
          "bagaimana sistem ...? → how does the system/process work?",
          "pembayaran lembur → overtime payment; `pembayaran` from root `bayar`.",
          "di perusahaan ini → at this company; `perusahaan` = company.",
        ],
      },
      {
        en: "Saya perlu waktu untuk mempertimbangkan tawaran ini.",
        vi: "Tôi cần thời gian để cân nhắc lời đề nghị này.",
        pronunciation_focus: [
          "perlu waktu → cần thời gian.",
          "mempertimbangkan → cân nhắc; từ dài nhưng rất hợp văn phong chuyên nghiệp.",
          "tawaran ini → lời đề nghị/offer này; khác `tawar` = mặc cả.",
        ],
        pronunciation_focus_en: [
          "perlu waktu → need time.",
          "mempertimbangkan → to consider; long but very appropriate professionally.",
          "tawaran ini → this offer; different from `tawar` = bargain.",
        ],
      },
      {
        en: "Kapan saya bisa mendapat kabar dari HRD?",
        vi: "Khi nào tôi có thể nhận tin từ HRD?",
        pronunciation_focus: [
          "kapan → khi nào; đặt đầu câu hỏi.",
          "mendapat kabar → nhận tin/cập nhật; cụm tự nhiên sau phỏng vấn.",
          "dari HRD → từ bộ phận nhân sự.",
        ],
        pronunciation_focus_en: [
          "kapan → when; placed at the start of the question.",
          "mendapat kabar → receive news/an update; natural after an interview.",
          "dari HRD → from HR.",
        ],
      },
      {
        en: "Terima kasih atas waktu dan penjelasannya.",
        vi: "Cảm ơn vì thời gian và phần giải thích của anh/chị.",
        pronunciation_focus: [
          "terima kasih atas ... → cảm ơn vì ...; trang trọng hơn `terima kasih untuk`.",
          "waktu dan penjelasannya → thời gian và lời giải thích đó; `-nya` làm cụm tự nhiên.",
          "Dùng câu này để kết thúc phỏng vấn lịch sự.",
        ],
        pronunciation_focus_en: [
          "terima kasih atas ... → thank you for ...; more formal than `terima kasih untuk`.",
          "waktu dan penjelasannya → the time and explanation; `-nya` makes the phrase natural.",
          "Use this sentence to close an interview politely.",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi hỏi về `lembur`, `izin kerja`, hoặc `kontrak`, giữ giọng trung lập và chuyên nghiệp. Người nước ngoài nên hỏi liệu công ty hỗ trợ `izin kerja` hay không, nhưng chi tiết pháp lý có thể cần xác nhận sau với HRD. Sau phỏng vấn, câu `Kapan saya bisa mendapat kabar dari HRD?` là cách lịch sự để hỏi timeline mà không gây áp lực.",
    cultural_notes_en:
      "When asking about `lembur`, `izin kerja`, or `kontrak`, keep the tone neutral and professional. Foreign applicants should ask whether the company assists with `izin kerja`, but legal details may need later confirmation with HR. After the interview, `Kapan saya bisa mendapat kabar dari HRD?` politely asks for the timeline without sounding pushy.",
    tip_advice_vi:
      "Mẹo cho người Việt: đừng hỏi điều kiện làm việc bằng câu quá thẳng như `lembur bayar?`. Dùng khung lịch sự: `Bagaimana sistem pembayaran lembur ...?`, `Apakah perusahaan membantu izin kerja?`, `Saya perlu waktu untuk mempertimbangkan tawaran ini.`",
    tip_advice_en:
      "Tip for Vietnamese speakers: avoid blunt condition questions like `lembur bayar?`. Use polite frames: `Bagaimana sistem pembayaran lembur ...?`, `Apakah perusahaan membantu izin kerja?`, and `Saya perlu waktu untuk mempertimbangkan tawaran ini.`",
    vocabulary: [
      {
        cell_id: "a3b0fe29-968e-412e-a880-d36e830a8467",
        word: "izin kerja",
        en: "work permit",
        vi: "giấy phép lao động",
        pos: "noun phrase",
        pronunciation_vi: "I-zin KER-ja",
        pronunciation_en: "EE-zin KER-ja",
      },
      {
        cell_id: "74924340-8dc2-421b-8086-e0cccb1b5832",
        word: "pekerja asing",
        en: "foreign worker",
        vi: "lao động nước ngoài",
        pos: "noun phrase",
        pronunciation_vi: "pe-KER-ja A-sing",
        pronunciation_en: "peh-KER-ja A-sing",
      },
      {
        cell_id: "baa7b6f7-0c93-4ebe-844f-98a145c71b43",
        word: "lembur",
        en: "overtime",
        vi: "tăng ca",
        pos: "noun / verb",
        pronunciation_vi: "LEM-bur",
        pronunciation_en: "LEM-boor",
      },
      {
        cell_id: "bedd608f-2b01-4a5e-a3e1-d491a99edb44",
        word: "pembayaran lembur",
        en: "overtime payment",
        vi: "tiền/trả tiền tăng ca",
        pos: "noun phrase",
        pronunciation_vi: "pem-ba-YA-ran LEM-bur",
        pronunciation_en: "pem-ba-YA-ran LEM-boor",
      },
      {
        cell_id: "30c92375-0a18-46db-90fa-c32cb6b21997",
        word: "tawaran",
        en: "offer",
        vi: "lời đề nghị / offer",
        pos: "noun",
        pronunciation_vi: "ta-WA-ran",
        pronunciation_en: "ta-WA-ran",
      },
      {
        cell_id: "cef4c01c-3bad-4908-bace-51c66ce09f9c",
        word: "mempertimbangkan",
        en: "to consider",
        vi: "cân nhắc",
        pos: "verb",
        pronunciation_vi: "mem-per-tim-BANG-kan",
        pronunciation_en: "mem-per-tim-BANG-kan",
      },
      {
        cell_id: "6485ca60-539f-4d36-9063-8cb589291891",
        word: "mendapat kabar",
        en: "to receive news / get an update",
        vi: "nhận tin / nhận cập nhật",
        pos: "verb phrase",
        pronunciation_vi: "men-DA-pat KA-bar",
        pronunciation_en: "men-DA-pat KA-bar",
      },
    ],
    dialogue: [
      {
        cell_id: "796d4d06-bb16-4be1-b304-f159ffd0b0a9",
        speaker: "Pelamar",
        text: "Untuk pekerja asing, apakah perusahaan membantu izin kerja?",
        vi: "Đối với lao động nước ngoài, công ty có hỗ trợ giấy phép lao động không?",
        en: "For foreign workers, does the company assist with work permits?",
      },
      {
        cell_id: "a9e7e32b-f553-4198-835b-7c2d65145fb1",
        speaker: "HRD",
        text: "Kami bisa jelaskan prosesnya setelah tahap wawancara berikutnya.",
        vi: "Chúng tôi có thể giải thích quy trình sau vòng phỏng vấn tiếp theo.",
        en: "We can explain the process after the next interview stage.",
      },
      {
        cell_id: "cddce8cf-d815-49f4-855a-6d8b7fdeb2d8",
        speaker: "Pelamar",
        text: "Baik. Apakah posisi ini sering lembur?",
        vi: "Vâng. Vị trí này có thường phải tăng ca không?",
        en: "Okay. Does this position often require overtime?",
      },
      {
        cell_id: "94d5e9e5-05d6-497e-a256-1e383b1e93fd",
        speaker: "HRD",
        text: "Kadang ada lembur, dan pembayarannya mengikuti aturan perusahaan.",
        vi: "Đôi khi có tăng ca, và việc trả tiền theo quy định công ty.",
        en: "Sometimes there is overtime, and payment follows company rules.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ điều kiện làm việc còn thiếu:",
        instruction_en: "Fill in the missing work-condition word:",
        items: [
          {
            prompt: "Apakah perusahaan membantu ___ kerja? (giấy phép)",
            answer: "izin",
            options: ["izin", "isi", "ikan"],
          },
          {
            prompt: "Apakah posisi ini sering ___? (tăng ca)",
            answer: "lembur",
            options: ["lembur", "libur", "lebar"],
          },
          {
            prompt: "Saya perlu waktu untuk mempertimbangkan ___ ini. (offer)",
            answer: "tawaran",
            options: ["tawaran", "taman", "tagihan"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "izin kerja", answer: "giấy phép lao động" },
          { prompt: "pekerja asing", answer: "lao động nước ngoài" },
          { prompt: "pembayaran lembur", answer: "trả tiền tăng ca" },
          { prompt: "mendapat kabar", answer: "nhận tin / nhận cập nhật" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Công ty có hỗ trợ giấy phép lao động không?", answer: "Apakah perusahaan membantu izin kerja?" },
          { prompt: "Hệ thống trả tiền tăng ca ở công ty này như thế nào?", answer: "Bagaimana sistem pembayaran lembur di perusahaan ini?" },
          { prompt: "Khi nào tôi có thể nhận tin từ HRD?", answer: "Kapan saya bisa mendapat kabar dari HRD?" },
        ],
      },
    ],
  },
];
