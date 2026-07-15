// Office Meeting & Email Indonesian (Vietnamese -> Indonesian study track).
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
    id: "indonesian_office_meeting_email",
    level: "B1",
    category: "workplace",
    title_vi: "Họp văn phòng và email công việc",
    title_en: "Office meetings and work email",
    sentences: [
      {
        en: "Rapat hari ini dimulai jam sepuluh.",
        vi: "Cuộc họp hôm nay bắt đầu lúc mười giờ.",
        pronunciation_focus: [
          "RA-pat HA-ri I-ni di-MU-lai jam se-PU-luh - `rapat` = cuộc họp; `dimulai` = được bắt đầu/bắt đầu.",
          "Lỗi người Việt: nói `meeting` trong câu trang trọng. Người Indonesia dùng cả `meeting`, nhưng `rapat` tự nhiên và chuẩn hơn trong công sở.",
          "Luyện: `Rapat dimulai jam sepuluh.`",
        ],
        pronunciation_focus_en: [
          "RA-pat HA-ri EE-ni di-MOO-lai jam se-POO-looh - `rapat` = meeting; `dimulai` = starts/is started.",
          "VN-speaker trap: relying on English `meeting` in formal sentences. Indonesians use it too, but `rapat` is more natural at work.",
          "Drill: `Rapat dimulai jam sepuluh.`",
        ],
      },
      {
        en: "Saya sudah kirim undangan email ke semua peserta.",
        vi: "Tôi đã gửi thư mời qua email cho tất cả người tham dự.",
        pronunciation_focus: [
          "SA-ya SU-dah KI-rim un-DA-ngan e-MAIL ke SE-mu-a pe-SER-ta - `undangan email` = thư mời email; `peserta` = người tham dự.",
          "Lỗi người Việt: dùng `orang ikut` cho người dự họp. Trong công sở nói `peserta rapat`.",
          "Luyện: `Saya kirim undangan email.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah KI-rim un-DA-ngan e-MAIL ke SE-moo-a pe-SER-ta - `undangan email` = email invitation; `peserta` = participant.",
          "VN-speaker trap: saying `orang ikut` for attendees. At work, use `peserta rapat`.",
          "Drill: `Saya kirim undangan email.`",
        ],
      },
      {
        en: "Jadwal rapatnya bentrok dengan presentasi saya.",
        vi: "Lịch họp bị trùng với bài thuyết trình của tôi.",
        pronunciation_focus: [
          "JAD-wal RA-pat-nya BEN-trok DE-ngan pre-sen-TA-si SA-ya - `jadwal` = lịch; `bentrok` = trùng lịch/xung đột.",
          "Lỗi người Việt: dịch `trùng lịch` thành `sama jadwal`. Cách tự nhiên là `jadwalnya bentrok`.",
          "Luyện: `Jadwalnya bentrok.`",
        ],
        pronunciation_focus_en: [
          "JAD-wal RA-pat-nya BEN-trok DE-ngan pre-sen-TA-see SA-ya - `jadwal` = schedule; `bentrok` = clashes/conflicts.",
          "VN-speaker trap: translating schedule clash as `sama jadwal`. Natural Indonesian: `jadwalnya bentrok`.",
          "Drill: `Jadwalnya bentrok.`",
        ],
      },
      {
        en: "Tolong catat poin penting di notulen.",
        vi: "Làm ơn ghi các điểm quan trọng vào biên bản họp.",
        pronunciation_focus: [
          "TO-long CA-tat poin PEN-ting di no-TU-len - `catat` = ghi lại; `notulen` = biên bản họp.",
          "Lỗi người Việt: đọc `catat` như 'ka-tat'. Chữ `c` tiếng Indonesia đọc như 'ch': `CA-tat`.",
          "Luyện: `Catat di notulen.`",
        ],
        pronunciation_focus_en: [
          "TO-long CHA-tat poin PEN-ting di no-TOO-len - `catat` = write down; `notulen` = meeting minutes.",
          "VN-speaker trap: reading `catat` with a `k` sound. Indonesian `c` is `ch`: `CHA-tat`.",
          "Drill: `Catat di notulen.`",
        ],
      },
      {
        en: "Deadline laporan ini hari Jumat sore.",
        vi: "Hạn chót của báo cáo này là chiều thứ Sáu.",
        pronunciation_focus: [
          "DED-lain la-PO-ran I-ni HA-ri JUM-at SO-re - `deadline` = hạn chót; `laporan` = báo cáo; `sore` = chiều.",
          "Lỗi người Việt: nói `batas waktu` quá cứng trong văn phòng hiện đại. `Deadline` là từ mượn rất phổ biến.",
          "Luyện: `Deadline laporan ini hari Jumat.`",
        ],
        pronunciation_focus_en: [
          "DED-line la-PO-ran EE-ni HA-ri JUM-at SO-re - `deadline` = deadline; `laporan` = report; `sore` = afternoon/evening.",
          "VN-speaker trap: over-formalizing to `batas waktu` in modern office talk. `Deadline` is very common.",
          "Drill: `Deadline laporan ini hari Jumat.`",
        ],
      },
      {
        en: "Mohon tindak lanjut setelah rapat selesai.",
        vi: "Mong anh/chị theo dõi xử lý sau khi cuộc họp kết thúc.",
        pronunciation_focus: [
          "MO-hon TIN-dak LAN-jut se-TE-lah RA-pat se-LE-sai - `tindak lanjut` = follow-up; `mohon` = kính mong/xin.",
          "Lỗi người Việt: dùng thẳng `follow up` trong email trang trọng. Có thể dùng, nhưng `tindak lanjut` trang trọng hơn.",
          "Luyện: `Mohon tindak lanjut.`",
        ],
        pronunciation_focus_en: [
          "MO-hon TIN-dak LAN-jut se-TE-lah RA-pat se-LE-sai - `tindak lanjut` = follow-up; `mohon` = kindly request.",
          "VN-speaker trap: using English `follow up` in formal email. It is understood, but `tindak lanjut` is more formal.",
          "Drill: `Mohon tindak lanjut.`",
        ],
      },
      {
        en: "Boleh saya izin meeting karena ada urusan mendadak?",
        vi: "Tôi xin phép vắng họp vì có việc đột xuất được không?",
        pronunciation_focus: [
          "BO-leh SA-ya I-zin MI-ting ka-RE-na A-da U-ru-san men-DA-dak - `izin meeting` = xin phép vắng/không tham gia meeting; `mendadak` = đột xuất.",
          "Lỗi người Việt: nói `saya tidak ikut meeting` nghe cộc. Xin phép lịch sự: `boleh saya izin meeting?`.",
          "Luyện: `Boleh saya izin meeting?`",
        ],
        pronunciation_focus_en: [
          "BO-leh SA-ya EE-zin MEE-ting ka-RE-na A-da OO-roo-san men-DA-dak - `izin meeting` = ask permission to miss a meeting; `mendadak` = sudden/urgent.",
          "VN-speaker trap: blunt `saya tidak ikut meeting`. Polite permission frame: `boleh saya izin meeting?`.",
          "Drill: `Boleh saya izin meeting?`",
        ],
      },
      {
        en: "Saya akan kirim materi presentasi sebelum rapat.",
        vi: "Tôi sẽ gửi tài liệu thuyết trình trước cuộc họp.",
        pronunciation_focus: [
          "SA-ya A-kan KI-rim ma-TE-ri pre-sen-TA-si se-BE-lum RA-pat - `materi presentasi` = tài liệu thuyết trình; `sebelum` = trước khi.",
          "Lỗi người Việt: nói `bahan presentasi` cũng được, nhưng trong văn phòng `materi presentasi` nghe chuyên nghiệp hơn.",
          "Luyện: `Saya kirim materi presentasi.`",
        ],
        pronunciation_focus_en: [
          "SA-ya A-kan KI-rim ma-TE-ri pre-sen-TA-see se-BE-lum RA-pat - `materi presentasi` = presentation materials; `sebelum` = before.",
          "VN-speaker trap: `bahan presentasi` is understandable, but `materi presentasi` sounds more professional at work.",
          "Drill: `Saya kirim materi presentasi.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong công sở Indonesia, `rapat` có thể diễn ra trực tiếp hoặc qua Zoom/Google Meet, nhưng email và WhatsApp vẫn thường dùng song song. Sau họp, người phụ trách có thể gửi `notulen`, `tindak lanjut`, và deadline qua email. Với cấp trên, dùng `Pak/Bu`, `mohon`, `izin`, và câu đầy đủ; với đồng nghiệp thân hơn có thể dùng `oke siap`, `nanti saya follow up`.",
    cultural_notes_en:
      "In Indonesian offices, a `rapat` can happen in person or through Zoom/Google Meet, while email and WhatsApp are often used side by side. After a meeting, the person in charge may send `notulen`, `tindak lanjut`, and deadlines by email. With superiors, use `Pak/Bu`, `mohon`, `izin`, and full sentences; with closer colleagues, phrases like `oke siap` and `nanti saya follow up` are common.",
    tip_advice_vi:
      "Mẹo cho người Việt: bộ câu công sở nên nhớ là `jadwal rapatnya kapan?`, `tolong catat di notulen`, `deadline-nya kapan?`, `mohon tindak lanjut`, và `boleh saya izin meeting?`. Khi viết email trang trọng, ưu tiên `mohon` hơn `tolong`, và `tindak lanjut` hơn `follow up`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: remember these office phrases: `jadwal rapatnya kapan?`, `tolong catat di notulen`, `deadline-nya kapan?`, `mohon tindak lanjut`, and `boleh saya izin meeting?`. In formal email, prefer `mohon` over `tolong`, and `tindak lanjut` over `follow up`.",
    vocabulary: [
      {
        cell_id: "f2442e33-636a-4946-a017-124c27eded34",
        word: "rapat",
        en: "meeting",
        vi: "cuộc họp",
        pos: "noun",
        pronunciation_vi: "RA-pat",
        pronunciation_en: "RA-pat",
      },
      {
        cell_id: "2b05a0ee-18ff-44d8-8d62-d34963f619d7",
        word: "notulen",
        en: "meeting minutes",
        vi: "biên bản họp",
        pos: "noun",
        pronunciation_vi: "no-TU-len",
        pronunciation_en: "no-TOO-len",
      },
      {
        cell_id: "fe816af3-3ffd-4ad6-b6d8-f9bb7399dd91",
        word: "jadwal",
        en: "schedule",
        vi: "lịch",
        pos: "noun",
        pronunciation_vi: "JAD-wal",
        pronunciation_en: "JAD-wal",
      },
      {
        cell_id: "ee5969d5-c44f-4d4b-b2f8-74289508f377",
        word: "undangan email",
        en: "email invitation",
        vi: "thư mời email",
        pos: "noun phrase",
        pronunciation_vi: "un-DA-ngan e-MAIL",
        pronunciation_en: "un-DA-ngan e-MAIL",
      },
      {
        cell_id: "de6bb66e-7dd8-486c-89aa-1f6eac7c2b8f",
        word: "deadline",
        en: "deadline",
        vi: "hạn chót",
        pos: "noun",
        pronunciation_vi: "DED-lain",
        pronunciation_en: "DED-line",
      },
      {
        cell_id: "c5de6f8d-6712-49d1-8185-d2222f57b475",
        word: "tindak lanjut",
        en: "follow-up",
        vi: "theo dõi xử lý / bước tiếp theo",
        pos: "noun phrase",
        pronunciation_vi: "TIN-dak LAN-jut",
        pronunciation_en: "TIN-dak LAN-jut",
      },
      {
        cell_id: "3b938af6-ff86-4c7b-9295-a8171cfd633a",
        word: "presentasi",
        en: "presentation",
        vi: "bài thuyết trình",
        pos: "noun",
        pronunciation_vi: "pre-sen-TA-si",
        pronunciation_en: "pre-sen-TA-see",
      },
      {
        cell_id: "08c25d1c-ef80-4d11-8af5-a7abab68f1df",
        word: "izin meeting",
        en: "ask permission to miss a meeting",
        vi: "xin phép vắng họp",
        pos: "verb phrase",
        pronunciation_vi: "I-zin MI-ting",
        pronunciation_en: "EE-zin MEE-ting",
      },
    ],
    dialogue: [
      {
        cell_id: "7375a4b5-1ed6-4e19-a661-d2f5472228c8",
        speaker: "Karyawan",
        text: "Pak, jadwal rapat hari ini jam berapa?",
        vi: "Anh ơi, lịch họp hôm nay lúc mấy giờ ạ?",
        en: "Sir, what time is today's meeting?",
      },
      {
        cell_id: "5c856446-41ca-4e2d-af74-73035449bde1",
        speaker: "Atasan",
        text: "Jam sepuluh. Saya sudah kirim undangan email.",
        vi: "Mười giờ. Tôi đã gửi thư mời qua email rồi.",
        en: "Ten o'clock. I already sent the email invitation.",
      },
      {
        cell_id: "8dc419d7-462c-41fe-9bba-9bcefc25f16a",
        speaker: "Karyawan",
        text: "Baik, Pak. Saya akan siapkan materi presentasi.",
        vi: "Vâng anh. Tôi sẽ chuẩn bị tài liệu thuyết trình.",
        en: "Okay, sir. I will prepare the presentation materials.",
      },
      {
        cell_id: "6e5af699-3736-4a34-87b6-a4c6b5e08604",
        speaker: "Atasan",
        text: "Tolong catat poin penting di notulen dan follow up setelah rapat.",
        vi: "Làm ơn ghi các điểm quan trọng vào biên bản và theo dõi xử lý sau họp.",
        en: "Please note the important points in the minutes and follow up after the meeting.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Tolong catat poin penting di ___.`",
        prompt_en: "Fill in the blank: `Tolong catat poin penting di ___.`",
        answer: "notulen",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi xin phép vắng họp được không?",
        prompt_en: "Translate into Indonesian: May I ask permission to miss the meeting?",
        answer: "Boleh saya izin meeting?",
      },
      {
        type: "matching",
        prompt_vi: "Nối nghĩa đúng.",
        prompt_en: "Match the meanings.",
        pairs: [
          ["rapat", "cuộc họp"],
          ["notulen", "biên bản họp"],
          ["jadwal", "lịch"],
          ["deadline", "hạn chót"],
          ["tindak lanjut", "theo dõi xử lý"],
        ],
      },
    ],
  },
];
