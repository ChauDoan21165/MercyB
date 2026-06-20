// Advanced Email Writing Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It follows the established Indonesian extra
// lesson format: Indonesian target text lives in `en`, Vietnamese glosses live in
// `vi`, and each Vietnamese-facing learning note has an English companion.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus -- same length + order. */
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
    id: "indonesian_advanced_email_writing",
    level: "B2",
    category: "communication",
    title_vi: "Viết email trang trọng nâng cao",
    title_en: "Advanced formal email writing",
    sentences: [
      {
        en: "Yth. Bapak/Ibu, saya menulis email ini untuk menindaklanjuti permintaan sebelumnya.",
        vi: "Kính gửi quý Ông/Bà, tôi viết email này để tiếp nối yêu cầu trước đó.",
        pronunciation_focus: [
          "Yth. dibaca `yang ter-HOR-mat` -- `menindaklanjuti` = follow up/tiếp tục xử lý; `permintaan sebelumnya` = yêu cầu trước đó.",
          "Lỗi người Việt: mở thư bằng `Halo` cho việc trang trọng. Dùng `Yth. Bapak/Ibu` hoặc `Dengan hormat`.",
          "Luyện: `Saya menulis email ini untuk menindaklanjuti...`",
        ],
        pronunciation_focus_en: [
          "Yth. is read `yang ter-HOR-mat` -- `menindaklanjuti` = follow up; `permintaan sebelumnya` = previous request.",
          "VN-speaker trap: opening a formal email with `Halo`. Use `Yth. Bapak/Ibu` or `Dengan hormat`.",
          "Drill: `Saya menulis email ini untuk menindaklanjuti...`",
        ],
      },
      {
        en: "Bersama email ini, saya lampirkan dokumen pendukung yang diperlukan.",
        vi: "Kèm theo email này, tôi đính kèm các tài liệu hỗ trợ cần thiết.",
        pronunciation_focus: [
          "ber-SA-ma e-mail I-ni, SA-ya lam-PIR-kan -- `lampirkan` = đính kèm; `dokumen pendukung` = tài liệu hỗ trợ.",
          "`lampiran` là danh từ attachment; `melampirkan/lampirkan` là động từ đính kèm.",
          "Luyện: `Saya lampirkan dokumen pendukung.`",
        ],
        pronunciation_focus_en: [
          "ber-SA-ma e-mail I-ni, SA-ya lam-PIR-kan -- `lampirkan` = attach; `dokumen pendukung` = supporting documents.",
          "`Lampiran` is the noun attachment; `melampirkan/lampirkan` is the verb to attach.",
          "Drill: `Saya lampirkan dokumen pendukung.`",
        ],
      },
      {
        en: "Mohon maaf atas keterlambatan balasan dari pihak kami.",
        vi: "Chúng tôi xin lỗi vì phản hồi chậm từ phía chúng tôi.",
        pronunciation_focus: [
          "MO-hon ma-AF A-tas ke-ter-lam-BAT-an ba-LAS-an -- `mohon maaf` = kính xin lỗi; `keterlambatan` = sự chậm trễ.",
          "Lỗi người Việt: viết `maaf ya` trong email công việc. Trang trọng hơn: `Mohon maaf atas...`",
          "Luyện: `Mohon maaf atas keterlambatan balasan.`",
        ],
        pronunciation_focus_en: [
          "MO-hon ma-AF A-tas ke-ter-lam-BAT-an ba-LAS-an -- `mohon maaf` = we kindly apologize; `keterlambatan` = delay.",
          "VN-speaker trap: writing `maaf ya` in business email. More formal: `Mohon maaf atas...`",
          "Drill: `Mohon maaf atas keterlambatan balasan.`",
        ],
      },
      {
        en: "Mohon klarifikasi terkait jadwal rapat yang tercantum di lampiran.",
        vi: "Xin vui lòng làm rõ lịch họp được ghi trong tệp đính kèm.",
        pronunciation_focus: [
          "MO-hon kla-ri-fi-KA-si ter-KAIT JAD-wal RA-pat -- `klarifikasi` = làm rõ; `tercantum` = được ghi/được nêu.",
          "`terkait` trang trọng hơn `tentang` khi nối nội dung trong email công việc.",
          "Luyện: `Mohon klarifikasi terkait jadwal rapat.`",
        ],
        pronunciation_focus_en: [
          "MO-hon kla-ri-fi-KA-si ter-KAIT JAD-wal RA-pat -- `klarifikasi` = clarification; `tercantum` = listed/stated.",
          "`Terkait` is more formal than `tentang` when linking business-email content.",
          "Drill: `Mohon klarifikasi terkait jadwal rapat.`",
        ],
      },
      {
        en: "Sebagai tindak lanjut, kami akan mengirimkan revisi paling lambat hari Jumat.",
        vi: "Để tiếp tục xử lý, chúng tôi sẽ gửi bản chỉnh sửa muộn nhất vào thứ Sáu.",
        pronunciation_focus: [
          "se-BA-gai TIN-dak LAN-jut -- `tindak lanjut` = follow-up; `paling lambat` = muộn nhất/chậm nhất.",
          "Lỗi người Việt: dịch 'deadline' bằng tiếng Anh mọi lúc. `paling lambat hari Jumat` rất tự nhiên.",
          "Luyện: `Kami akan mengirimkan revisi paling lambat hari Jumat.`",
        ],
        pronunciation_focus_en: [
          "se-BA-gai TIN-dak LAN-jut -- `tindak lanjut` = follow-up; `paling lambat` = at the latest.",
          "VN-speaker trap: using English `deadline` every time. `paling lambat hari Jumat` is natural.",
          "Drill: `Kami akan mengirimkan revisi paling lambat hari Jumat.`",
        ],
      },
      {
        en: "Jika ada informasi yang kurang jelas, kami siap memberikan penjelasan tambahan.",
        vi: "Nếu có thông tin chưa rõ, chúng tôi sẵn sàng cung cấp giải thích bổ sung.",
        pronunciation_focus: [
          "JI-ka A-da in-for-MA-si yang KU-rang JE-las -- `kurang jelas` = chưa rõ; `penjelasan tambahan` = giải thích bổ sung.",
          "`jika` trang trọng hơn `kalau`; dùng tốt trong email formal.",
          "Luyện: `Jika ada informasi yang kurang jelas...`",
        ],
        pronunciation_focus_en: [
          "JI-ka A-da in-for-MA-si yang KOO-rang JE-las -- `kurang jelas` = unclear; `penjelasan tambahan` = additional explanation.",
          "`Jika` is more formal than `kalau`; it works well in formal email.",
          "Drill: `Jika ada informasi yang kurang jelas...`",
        ],
      },
      {
        en: "Kami menghargai kerja sama Bapak/Ibu dalam proses ini.",
        vi: "Chúng tôi trân trọng sự hợp tác của quý Ông/Bà trong quá trình này.",
        pronunciation_focus: [
          "KA-mi meng-har-GAI KER-ja SA-ma BA-pak/I-bu -- `menghargai` = trân trọng/đánh giá cao; `kerja sama` = hợp tác.",
          "Mẹo: `Bapak/Ibu` dùng khi chưa biết giới tính/chức danh cụ thể của người nhận.",
          "Luyện: `Kami menghargai kerja sama Bapak/Ibu.`",
        ],
        pronunciation_focus_en: [
          "KA-mi meng-har-GAI KER-ja SA-ma BA-pak/I-bu -- `menghargai` = appreciate; `kerja sama` = cooperation.",
          "Tip: `Bapak/Ibu` is used when you do not know the recipient's exact gender/title.",
          "Drill: `Kami menghargai kerja sama Bapak/Ibu.`",
        ],
      },
      {
        en: "Atas perhatian dan kerja sama Bapak/Ibu, kami ucapkan terima kasih.",
        vi: "Xin cảm ơn sự quan tâm và hợp tác của quý Ông/Bà.",
        pronunciation_focus: [
          "A-tas per-ha-TI-an dan KER-ja SA-ma -- câu kết thư trang trọng cố định.",
          "Lỗi người Việt: kết thư bằng `makasih`. Trong email formal, dùng câu đầy đủ này hoặc `Hormat kami`.",
          "Luyện: `Atas perhatian dan kerja sama Bapak/Ibu, kami ucapkan terima kasih.`",
        ],
        pronunciation_focus_en: [
          "A-tas per-ha-TI-an dan KER-ja SA-ma -- a fixed formal closing sentence.",
          "VN-speaker trap: closing with `makasih`. In formal email, use this full sentence or `Hormat kami`.",
          "Drill: `Atas perhatian dan kerja sama Bapak/Ibu, kami ucapkan terima kasih.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Email formal Indonesia ưu tiên giọng lịch sự, gián tiếp vừa đủ, và cụm cố định: `Yth.`, `Dengan hormat`, `Mohon`, `Terkait`, `Sebagai tindak lanjut`, `Terlampir`, `Atas perhatian...`. Không dùng `gue/lu`, `makasih ya`, hay viết tắt chat trong thư công việc. Nếu người nhận là tổ chức hoặc chưa rõ giới tính, `Bapak/Ibu` là lựa chọn an toàn.",
    cultural_notes_en:
      "Formal Indonesian email favors a polite, moderately indirect tone and fixed chunks: `Yth.`, `Dengan hormat`, `Mohon`, `Terkait`, `Sebagai tindak lanjut`, `Terlampir`, `Atas perhatian...`. Avoid `gue/lu`, `makasih ya`, and chat abbreviations in work email. If the recipient is an institution or their gender is unknown, `Bapak/Ibu` is the safe choice.",
    tip_advice_vi:
      "Mẹo cho người Việt: học theo khung email: salam pembuka -> tujuan email -> lampiran -> tindak lanjut -> klarifikasi/permintaan maaf nếu cần -> penutup sopan. Dùng `mohon` cho yêu cầu trang trọng, `jika` cho điều kiện trang trọng, và bị động `di-` như `dikirimkan`, `tercantum`, `dilampirkan`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn the email frame: opening greeting -> email purpose -> attachments -> follow-up -> clarification/apology if needed -> polite closing. Use `mohon` for formal requests, `jika` for formal conditions, and passives like `dikirimkan`, `tercantum`, `dilampirkan`.",
    vocabulary: [
      {
        word: "email formal",
        en: "formal email",
        vi: "email trang trọng",
        pos: "noun phrase",
        pronunciation_vi: "e-mail for-MAL",
        pronunciation_en: "e-mail for-MAL",
      },
      {
        word: "salam pembuka",
        en: "opening greeting",
        vi: "lời chào mở đầu",
        pos: "noun phrase",
        pronunciation_vi: "SA-lam pem-BU-ka",
        pronunciation_en: "SA-lam pem-BOO-ka",
      },
      {
        word: "lampiran",
        en: "attachment",
        vi: "tệp đính kèm",
        pos: "noun",
        pronunciation_vi: "lam-PIR-an",
        pronunciation_en: "lam-PIR-an",
      },
      {
        word: "tindak lanjut",
        en: "follow-up",
        vi: "việc tiếp tục xử lý",
        pos: "noun phrase",
        pronunciation_vi: "TIN-dak LAN-jut",
        pronunciation_en: "TIN-dak LAN-jut",
      },
      {
        word: "permintaan maaf",
        en: "apology",
        vi: "lời xin lỗi",
        pos: "noun phrase",
        pronunciation_vi: "per-min-TA-an ma-AF",
        pronunciation_en: "per-min-TA-an ma-AF",
      },
      {
        word: "klarifikasi",
        en: "clarification",
        vi: "sự làm rõ",
        pos: "noun",
        pronunciation_vi: "kla-ri-fi-KA-si",
        pronunciation_en: "kla-ri-fi-KA-see",
      },
      {
        word: "penutup sopan",
        en: "polite closing",
        vi: "lời kết lịch sự",
        pos: "noun phrase",
        pronunciation_vi: "pe-NU-tup SO-pan",
        pronunciation_en: "pe-NOO-tup SO-pan",
      },
      {
        word: "Yth.",
        en: "Honorable / Dear",
        vi: "Kính gửi",
        pos: "abbreviation",
        pronunciation_vi: "yang ter-HOR-mat",
        pronunciation_en: "yang ter-HOR-mat",
      },
      {
        word: "terlampir",
        en: "attached",
        vi: "được đính kèm",
        pos: "adjective / verb",
        pronunciation_vi: "ter-lam-PIR",
        pronunciation_en: "ter-lam-PIR",
      },
      {
        word: "Hormat kami",
        en: "Respectfully / sincerely",
        vi: "Trân trọng / kính thư",
        pos: "closing phrase",
        pronunciation_vi: "HOR-mat KA-mi",
        pronunciation_en: "HOR-mat KA-mi",
      },
    ],
    dialogue: [
      {
        speaker: "Staf",
        text: "Yth. Bapak/Ibu, saya ingin menindaklanjuti email sebelumnya.",
        vi: "Kính gửi quý Ông/Bà, tôi muốn tiếp nối email trước đó.",
        en: "Dear Sir/Madam, I would like to follow up on the previous email.",
      },
      {
        speaker: "Manajer",
        text: "Baik. Jangan lupa sebutkan lampiran dan batas waktunya.",
        vi: "Được. Đừng quên nêu tệp đính kèm và thời hạn.",
        en: "Good. Do not forget to mention the attachment and the deadline.",
      },
      {
        speaker: "Staf",
        text: "Saya tulis: bersama email ini, kami lampirkan dokumen pendukung.",
        vi: "Tôi viết: kèm theo email này, chúng tôi đính kèm tài liệu hỗ trợ.",
        en: "I write: with this email, we attach the supporting documents.",
      },
      {
        speaker: "Manajer",
        text: "Bagus. Tutup dengan penutup sopan dan ucapan terima kasih.",
        vi: "Tốt. Kết bằng lời kết lịch sự và lời cảm ơn.",
        en: "Good. Close with a polite closing and thanks.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Kèm theo email này, tôi đính kèm tài liệu hỗ trợ.",
        prompt_en: "Translate into Indonesian: With this email, I attach the supporting documents.",
        answer: "Bersama email ini, saya lampirkan dokumen pendukung.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Mohon ____ atas keterlambatan balasan.",
        prompt_en: "Fill in the blank: Mohon ____ atas keterlambatan balasan.",
        answer: "maaf",
      },
      {
        type: "matching",
        prompt_vi: "Ghép từ với nghĩa đúng.",
        prompt_en: "Match each word with the correct meaning.",
        pairs: [
          ["lampiran", "tệp đính kèm / attachment"],
          ["tindak lanjut", "follow-up / tiếp tục xử lý"],
          ["klarifikasi", "làm rõ / clarification"],
          ["Hormat kami", "trân trọng / respectfully"],
        ],
      },
    ],
    content:
      "Useful formal-email chunks: `Yth. Bapak/Ibu` (Dear Sir/Madam), `Bersama email ini, saya lampirkan...` (with this email, I attach...), `Sebagai tindak lanjut...` (as a follow-up...), `Mohon maaf atas...` (we apologize for...), `Mohon klarifikasi terkait...` (please clarify regarding...), and `Atas perhatian Bapak/Ibu, kami ucapkan terima kasih` (thank you for your attention).",
  },
];
