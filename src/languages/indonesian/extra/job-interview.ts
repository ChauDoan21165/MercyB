// Job Interview Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (construction-worker.ts etc.), which in
// turn mirror the French `FrenchLesson` shape. When the shared Indonesian registry
// (src/languages/indonesian/lessons.ts) lands, swap the local types for a shared
// import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// Indonesian is written in Latin script and is largely phonetic. For Vietnamese
// speakers the big WINS are: no grammatical gender, no verb conjugation, no tones,
// no articles. The interview-specific traps are: the meN-/-an affix pairs that turn
// roots into verbs vs. nouns (`melamar` apply vs. `lamaran` application; `kerja`
// work vs. `pekerjaan` job vs. `bekerja` to work), the formal register (`Anda`,
// `Bapak/Ibu`, `saya` — never `kamu`/`gue` in an interview), and the passive `di-`
// in `dinegosiasi` (can be negotiated).

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
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
  /** Part of speech, e.g. "noun", "verb", "phrase". */
  pos: string;
  /** Vietnamese pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English pronunciation hint, stressed syllable in CAPS. */
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

// Loosely typed so per-type fields (translation, fill-blank, checklist) can vary.
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
    id: "indonesian_job_interview",
    level: "B1",
    category: "work",
    title_vi: "Tiếng Indonesia phỏng vấn xin việc",
    title_en: "Job interview Indonesian",
    sentences: [
      // ── Opening the interview ────────────────────────────────────────────
      {
        en: "Selamat pagi, terima kasih atas kesempatan ini.",
        vi: "Chào buổi sáng, cảm ơn vì cơ hội này.",
        pronunciation_focus: [
          "se-la-MAT PA-gi, te-RI-ma KA-sih A-tas ke-sem-PA-tan I-ni — `atas` = về/đối với (lời cảm ơn trang trọng); `kesempatan` = cơ hội.",
          "Lợi thế người Việt: mở đầu lịch sự ngắn gọn y như tiếng Việt — không cần chia thì.",
          "Lỗi người Việt: nói `terima kasih untuk` cho 'cảm ơn vì'. Trang trọng dùng `terima kasih atas …`.",
          "Luyện: `Terima kasih atas kesempatan ini.`",
        ],
        pronunciation_focus_en: [
          "se-la-MAT PA-gi, te-REE-ma KA-sih A-tas ke-sem-PA-tan EE-ni — `atas` = for (formal thanks); `kesempatan` = opportunity.",
          "VN-speaker win: a short polite opener maps 1:1 to Vietnamese — no tense to conjugate.",
          "VN-speaker trap: using `terima kasih untuk` for 'thank you for'. The formal pairing is `terima kasih atas …`.",
          "Drill: `Terima kasih atas kesempatan ini.`",
        ],
      },
      {
        en: "Perkenalkan, nama saya Linh.",
        vi: "Cho phép tôi giới thiệu, tên tôi là Linh.",
        pronunciation_focus: [
          "per-ke-NAL-kan, NA-ma SA-ya Linh — `perkenalkan` = (xin) giới thiệu (per-…-kan từ gốc `kenal` = quen biết).",
          "Lỗi người Việt: đặt sở hữu trước — `saya nama`. Đúng là `nama saya` (danh từ + người sở hữu).",
          "Luyện: `Perkenalkan, nama saya …`",
        ],
        pronunciation_focus_en: [
          "per-ke-NAL-kan, NA-ma SA-ya Linh — `perkenalkan` = 'let me introduce' (per-…-kan from root `kenal` = to know/be acquainted).",
          "VN-speaker trap: putting the possessor first — `saya nama`. Correct is `nama saya` (noun + owner).",
          "Drill: `Perkenalkan, nama saya …`",
        ],
      },
      {
        en: "Saya melamar untuk posisi ini.",
        vi: "Tôi ứng tuyển vào vị trí này.",
        pronunciation_focus: [
          "SA-ya me-LA-mar UN-tuk po-SI-si I-ni — `melamar` = nộp đơn/ứng tuyển (meN- + `lamar`); `posisi` = vị trí.",
          "Lỗi người Việt: dùng danh từ `lamaran` làm động từ. Hành động 'ứng tuyển' là `melamar` (có meN-).",
          "Luyện: `Saya melamar untuk posisi ini.`",
        ],
        pronunciation_focus_en: [
          "SA-ya me-LA-mar UN-tuk po-SEE-si EE-ni — `melamar` = to apply (meN- + `lamar`); `posisi` = position.",
          "VN-speaker trap: using the noun `lamaran` as a verb. The action 'to apply' is `melamar` (with meN-).",
          "Drill: `Saya melamar untuk posisi ini.`",
        ],
      },
      {
        en: "Ini CV dan surat lamaran saya.",
        vi: "Đây là CV và đơn xin việc của tôi.",
        pronunciation_focus: [
          "I-ni se-ve dan SU-rat la-MA-ran SA-ya — `CV` đọc kiểu Anh 'see-vee'; `surat lamaran` = đơn xin việc; `lamaran` (danh từ, đuôi -an).",
          "Lỗi người Việt: lẫn `melamar` (động từ) với `lamaran` (danh từ). `surat lamaran` = lá đơn, không phải hành động.",
          "Luyện: `Ini CV dan surat lamaran saya.`",
        ],
        pronunciation_focus_en: [
          "EE-ni see-vee dan SU-rat la-MA-ran SA-ya — `CV` is said English-style; `surat lamaran` = application letter; `lamaran` is the noun (suffix -an).",
          "VN-speaker trap: mixing `melamar` (verb) with `lamaran` (noun). `surat lamaran` is the letter, not the act.",
          "Drill: `Ini CV dan surat lamaran saya.`",
        ],
      },
      // ── Common interviewer questions ─────────────────────────────────────
      {
        en: "Ceritakan tentang diri Anda.",
        vi: "Hãy kể về bản thân anh/chị.",
        pronunciation_focus: [
          "ce-ri-TA-kan ten-TANG DI-ri AN-da — `ceritakan` = hãy kể (`cerita` + -kan); `diri Anda` = bản thân bạn.",
          "Lỗi người Việt: đọc `cerita` là 'ke-ri-ta'. `c` trong tiếng Indonesia = `ch`, nên là 'che-RI-ta'.",
          "Luyện: `Ceritakan tentang diri Anda.`",
        ],
        pronunciation_focus_en: [
          "che-ri-TA-kan ten-TANG DI-ri AN-da — `ceritakan` = 'tell/please tell' (`cerita` + -kan); `diri Anda` = yourself.",
          "VN-speaker trap: reading `cerita` as 'ke-ri-ta'. Indonesian `c` = 'ch', so it is 'che-RI-ta'.",
          "Drill: `Ceritakan tentang diri Anda.`",
        ],
      },
      {
        en: "Apa kelebihan dan kekurangan Anda?",
        vi: "Điểm mạnh và điểm yếu của anh/chị là gì?",
        pronunciation_focus: [
          "A-pa ke-le-BIH-an dan ke-ku-RA-ngan AN-da — `kelebihan` = điểm mạnh (ke-…-an từ `lebih`); `kekurangan` = điểm yếu (từ `kurang`).",
          "Lợi thế người Việt: cặp ke-…-an rất đều — `lebih` (hơn)→`kelebihan` (ưu điểm), `kurang` (thiếu)→`kekurangan` (nhược điểm).",
          "Luyện: `Apa kelebihan dan kekurangan Anda?`",
        ],
        pronunciation_focus_en: [
          "A-pa ke-le-BIH-an dan ke-ku-RA-ngan AN-da — `kelebihan` = strength (ke-…-an from `lebih`); `kekurangan` = weakness (from `kurang`).",
          "VN-speaker win: the ke-…-an pair is regular — `lebih` (more)→`kelebihan` (strength), `kurang` (lacking)→`kekurangan` (weakness).",
          "Drill: `Apa kelebihan dan kekurangan Anda?`",
        ],
      },
      {
        en: "Mengapa Anda ingin bekerja di sini?",
        vi: "Tại sao anh/chị muốn làm việc ở đây?",
        pronunciation_focus: [
          "me-NGA-pa AN-da I-ngin be-KER-ja di SI-ni — `mengapa` = tại sao (trang trọng hơn `kenapa`); `bekerja` = làm việc (ber- + `kerja`).",
          "Lỗi người Việt: dùng gốc trần `kerja` ở văn cảnh trang trọng. Trong phỏng vấn nói `bekerja` (có ber-).",
          "Luyện: `Mengapa Anda ingin bekerja di sini?`",
        ],
        pronunciation_focus_en: [
          "me-NGA-pa AN-da EE-ngin be-KER-ja di SEE-ni — `mengapa` = why (more formal than `kenapa`); `bekerja` = to work (ber- + `kerja`).",
          "VN-speaker trap: using the bare root `kerja` in a formal setting. In an interview say `bekerja` (with ber-).",
          "Drill: `Mengapa Anda ingin bekerja di sini?`",
        ],
      },
      // ── Selling yourself ─────────────────────────────────────────────────
      {
        en: "Saya punya pengalaman lima tahun di bidang ini.",
        vi: "Tôi có năm năm kinh nghiệm trong lĩnh vực này.",
        pronunciation_focus: [
          "SA-ya PU-nya pe-nga-LA-man LI-ma TA-hun di BI-dang I-ni — `pengalaman` = kinh nghiệm (peN-…-an từ `alam`); `bidang` = lĩnh vực.",
          "Lỗi người Việt: nói `lima tahun-tahun` để chỉ số nhiều. Tiếng Indonesia KHÔNG nhân đôi sau số đếm — `lima tahun` là đủ.",
          "Luyện: `Saya punya pengalaman lima tahun.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PU-nya pe-nga-LA-man LI-ma TA-hun di BI-dang EE-ni — `pengalaman` = experience (peN-…-an from `alam`); `bidang` = field.",
          "VN-speaker trap: reduplicating `tahun-tahun` for plural. Indonesian does NOT reduplicate after a number — `lima tahun` is enough.",
          "Drill: `Saya punya pengalaman lima tahun.`",
        ],
      },
      {
        en: "Saya bisa mulai bekerja bulan depan.",
        vi: "Tôi có thể bắt đầu làm việc vào tháng sau.",
        pronunciation_focus: [
          "SA-ya BI-sa MU-lai be-KER-ja BU-lan de-PAN — `mulai` = bắt đầu; `bulan depan` = tháng sau (`depan` = phía trước = sắp tới).",
          "Lợi thế người Việt: không chia thì tương lai — `bisa mulai … bulan depan` đủ nghĩa tương lai.",
          "Luyện: `Saya bisa mulai bekerja bulan depan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya BI-sa MU-lai be-KER-ja BU-lan de-PAN — `mulai` = to start; `bulan depan` = next month (`depan` = front = upcoming).",
          "VN-speaker win: no future tense to conjugate — `bisa mulai … bulan depan` already reads as future.",
          "Drill: `Saya bisa mulai bekerja bulan depan.`",
        ],
      },
      // ── Salary negotiation ───────────────────────────────────────────────
      {
        en: "Berapa gaji yang ditawarkan untuk posisi ini?",
        vi: "Mức lương đề nghị cho vị trí này là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa GA-ji yang di-ta-WAR-kan UN-tuk po-SI-si I-ni — `gaji` = lương; `ditawarkan` = được đề nghị (bị động `di-` + `tawar` + -kan).",
          "Lỗi người Việt: né câu bị động. Tiếng Indonesia dùng `di-` rất nhiều: `ditawarkan` = 'được chào/đề nghị'.",
          "Luyện: `Berapa gaji yang ditawarkan?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa GA-ji yang di-ta-WAR-kan UN-tuk po-SEE-si EE-ni — `gaji` = salary; `ditawarkan` = is offered (passive `di-` + `tawar` + -kan).",
          "VN-speaker trap: avoiding the passive. Indonesian uses `di-` heavily: `ditawarkan` = 'is being offered'.",
          "Drill: `Berapa gaji yang ditawarkan?`",
        ],
      },
      {
        en: "Apakah gajinya masih bisa dinegosiasi?",
        vi: "Lương có còn thương lượng được không?",
        pronunciation_focus: [
          "a-pa-KAH GA-ji-nya ma-SIH BI-sa di-ne-go-si-A-si — `gajinya` = lương đó (`gaji` + -nya); `dinegosiasi` = được thương lượng (bị động `di-`).",
          "Lỗi người Việt: nói `bisa negosiasi` (chủ động) khi chủ ngữ là 'lương'. Lương là vật bị thương lượng → `dinegosiasi`.",
          "Luyện: `Apakah gajinya masih bisa dinegosiasi?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH GA-ji-nya ma-SIH BI-sa di-ne-go-si-A-si — `gajinya` = the salary (`gaji` + -nya); `dinegosiasi` = can be negotiated (passive `di-`).",
          "VN-speaker trap: saying `bisa negosiasi` (active) when the subject is 'salary'. Salary is the thing negotiated → `dinegosiasi`.",
          "Drill: `Apakah gajinya masih bisa dinegosiasi?`",
        ],
      },
      {
        en: "Saya berharap gaji sekitar sepuluh juta rupiah.",
        vi: "Tôi mong mức lương khoảng mười triệu rupiah.",
        pronunciation_focus: [
          "SA-ya ber-HA-rap GA-ji se-KI-tar se-PU-luh JU-ta ru-PI-ah — `berharap` = mong (ber- + `harap`); `sekitar` = khoảng; `juta` = triệu.",
          "Lỗi người Việt: đọc `juta` là 'giu-ta'. `j` tiếng Indonesia như 'j' tiếng Anh trong 'jam' → 'JU-ta'.",
          "Luyện: `Saya berharap gaji sekitar … juta.`",
        ],
        pronunciation_focus_en: [
          "SA-ya ber-HA-rap GA-ji se-KEE-tar se-PU-luh JU-ta ru-PEE-ah — `berharap` = to hope (ber- + `harap`); `sekitar` = around; `juta` = million.",
          "VN-speaker trap: mispronouncing `juta`. Indonesian `j` is the English 'j' as in 'jam' → 'JU-ta'.",
          "Drill: `Saya berharap gaji sekitar … juta.`",
        ],
      },
      // ── Closing ──────────────────────────────────────────────────────────
      {
        en: "Apakah ada pertanyaan untuk saya?",
        vi: "Anh/chị có câu hỏi nào cho tôi không?",
        pronunciation_focus: [
          "a-pa-KAH A-da per-ta-NYA-an UN-tuk SA-ya — `pertanyaan` = câu hỏi (per-…-an từ `tanya`); `apakah` mở câu hỏi có/không trang trọng.",
          "Lỗi người Việt: bỏ `apakah` ở văn cảnh trang trọng. Câu hỏi có/không lịch sự nên mở bằng `apakah`.",
          "Luyện: `Apakah ada pertanyaan untuk saya?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH A-da per-ta-NYA-an UN-tuk SA-ya — `pertanyaan` = question (per-…-an from `tanya`); `apakah` opens a formal yes/no question.",
          "VN-speaker trap: dropping `apakah` in formal speech. A polite yes/no question should open with `apakah`.",
          "Drill: `Apakah ada pertanyaan untuk saya?`",
        ],
      },
      {
        en: "Kapan saya akan mendapat kabar dari Anda?",
        vi: "Khi nào tôi sẽ nhận được phản hồi từ anh/chị?",
        pronunciation_focus: [
          "KA-pan SA-ya A-kan men-DA-pat KA-bar da-ri AN-da — `kapan` = khi nào; `akan` = sẽ (dấu hiệu tương lai); `mendapat` = nhận được.",
          "Lợi thế người Việt: `akan` đặt trước động từ y như 'sẽ' trong tiếng Việt — không đổi đuôi động từ.",
          "Luyện: `Kapan saya akan mendapat kabar?`",
        ],
        pronunciation_focus_en: [
          "KA-pan SA-ya A-kan men-DA-pat KA-bar da-ri AN-da — `kapan` = when; `akan` = will (future marker); `mendapat` = to receive.",
          "VN-speaker win: `akan` sits before the verb exactly like Vietnamese 'sẽ' — the verb ending never changes.",
          "Drill: `Kapan saya akan mendapat kabar?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Phỏng vấn ở Indonesia coi trọng sự khiêm tốn và lịch sự. Luôn dùng `saya` (tôi) và `Anda` hoặc `Bapak/Ibu` (ông/bà) — TUYỆT ĐỐI không dùng `kamu`, `gue`, `lu` (suồng sã). Bắt tay nhẹ; nhiều người chạm tay rồi đặt lên ngực (cử chỉ `salam`). Bộ hồ sơ thường gồm `CV`/`riwayat hidup` (sơ yếu lý lịch), `surat lamaran` (đơn xin việc), và bản sao `KTP` (CMND). Lương ghi theo tháng, đơn vị `juta` (triệu) rupiah; ví dụ 'sepuluh juta' = 10 triệu/tháng. Hỏi lương nên tế nhị: dùng câu bị động `Apakah gajinya bisa dinegosiasi?` thay vì đòi thẳng. Nhiều công ty hỏi về `tunjangan` (phụ cấp: ăn, đi lại, BPJS bảo hiểm) — đây là phần quan trọng của tổng thu nhập. Đừng khoe khoang; nêu `kelebihan` (điểm mạnh) kèm ví dụ, và một `kekurangan` (điểm yếu) kèm cách bạn đang cải thiện.",
    cultural_notes_en:
      "Indonesian interviews prize humility and politeness. Always use `saya` (I) and `Anda` or `Bapak/Ibu` (sir/ma'am) — NEVER `kamu`, `gue`, or `lu` (too casual). Handshakes are soft; many people touch hands then bring the hand to the chest (the `salam` gesture). A typical application packet has a `CV`/`riwayat hidup` (résumé), a `surat lamaran` (cover letter), and a copy of the `KTP` (national ID). Salary is quoted per month in `juta` (millions) of rupiah; e.g. 'sepuluh juta' = 10 million/month. Raise pay tactfully with the passive `Apakah gajinya bisa dinegosiasi?` rather than a blunt demand. Many firms discuss `tunjangan` (allowances: meals, transport, BPJS insurance) — a real part of total pay. Avoid bragging; state a `kelebihan` (strength) with an example, and one `kekurangan` (weakness) with how you're improving it.",
    tip_advice_vi:
      "Học thuộc 'bộ khung phỏng vấn' bốn câu: (1) mở đầu — `Terima kasih atas kesempatan ini.`; (2) giới thiệu — `Perkenalkan, nama saya … Saya melamar untuk posisi …`; (3) bán bản thân — `Saya punya pengalaman … tahun di bidang …`; (4) lương — `Apakah gajinya bisa dinegosiasi?`. Nhớ ba cặp phụ tố hay nhầm: `melamar` (động từ, ứng tuyển) ≠ `lamaran` (danh từ, đơn); `kerja` (gốc) → `bekerja` (làm việc) → `pekerjaan` (công việc); và bị động `di-`: `dinegosiasi`, `ditawarkan`. Giữ giọng phẳng, không thanh điệu; `c` đọc 'ch', `j` đọc 'j' (như 'jam').",
    tip_advice_en:
      "Memorize the four-line interview frame: (1) open — `Terima kasih atas kesempatan ini.`; (2) introduce — `Perkenalkan, nama saya … Saya melamar untuk posisi …`; (3) sell yourself — `Saya punya pengalaman … tahun di bidang …`; (4) pay — `Apakah gajinya bisa dinegosiasi?`. Keep three affix pairs straight: `melamar` (verb, to apply) ≠ `lamaran` (noun, application); `kerja` (root) → `bekerja` (to work) → `pekerjaan` (a job); and the passive `di-`: `dinegosiasi`, `ditawarkan`. Keep your pitch flat (no tones); `c` is 'ch', `j` is the English 'j' as in 'jam'.",
    vocabulary: [
      // The process
      {
        cell_id: "39aae649-f817-4598-bb36-b2bd53522a61",
        word: "wawancara",
        en: "interview",
        vi: "cuộc phỏng vấn",
        pos: "noun",
        pronunciation_vi: "wa-wan-CA-ra — `c` đọc 'ch' → 'wa-wan-CHA-ra'",
        pronunciation_en: "wa-wan-CHA-ra — `c` is 'ch'",
      },
      {
        cell_id: "85135577-7e61-447b-874c-b50718ec65dd",
        word: "melamar",
        en: "to apply (for a job)",
        vi: "ứng tuyển / nộp đơn",
        pos: "verb",
        pronunciation_vi: "me-LA-mar — động từ (meN- + `lamar`); đừng dùng `lamaran` thay nó",
        pronunciation_en: "me-LA-mar — the verb (meN- + `lamar`); don't swap in `lamaran`",
      },
      {
        cell_id: "631d63ff-304b-4d8e-9ef8-98f44057ae81",
        word: "lamaran",
        en: "application (the document/act as a noun)",
        vi: "đơn xin việc",
        pos: "noun",
        pronunciation_vi: "la-MA-ran — danh từ (đuôi -an); `surat lamaran` = lá đơn",
        pronunciation_en: "la-MA-ran — the noun (suffix -an); `surat lamaran` = cover letter",
      },
      {
        cell_id: "e6d6a268-3ab8-4b04-8bc7-421fd10bae6b",
        word: "lowongan",
        en: "job vacancy / opening",
        vi: "vị trí tuyển dụng còn trống",
        pos: "noun",
        pronunciation_vi: "lo-WONG-an — `lowongan kerja` = tin tuyển dụng",
        pronunciation_en: "lo-WONG-an — `lowongan kerja` = job opening",
      },
      {
        cell_id: "25989d96-ad3a-4b25-81fc-58e96c74d939",
        word: "riwayat hidup",
        en: "résumé / CV",
        vi: "sơ yếu lý lịch",
        pos: "noun",
        pronunciation_vi: "ri-WA-yat HI-dup — nghĩa đen 'lịch sử + cuộc đời'; cũng gọi tắt `CV`",
        pronunciation_en: "ri-WA-yat HI-dup — literally 'history + life'; also just `CV`",
      },
      // On the job
      {
        cell_id: "572b3f8b-ca1b-4551-a6d2-82e92d9891cc",
        word: "posisi",
        en: "position / role",
        vi: "vị trí",
        pos: "noun",
        pronunciation_vi: "po-SI-si — mượn tiếng Anh; `jabatan` là từ thuần cho 'chức vụ'",
        pronunciation_en: "po-SEE-si — English loan; `jabatan` is the native word for 'post'",
      },
      {
        cell_id: "4bd712ac-76d5-466e-b56b-f96b52efe578",
        word: "pengalaman",
        en: "experience",
        vi: "kinh nghiệm",
        pos: "noun",
        pronunciation_vi: "pe-nga-LA-man — peN-…-an từ `alam`; KHÔNG nhân đôi sau số đếm",
        pronunciation_en: "pe-nga-LA-man — peN-…-an from `alam`; never reduplicate after a number",
      },
      {
        cell_id: "3aef10d1-c64a-4fc8-990e-49973325cbee",
        word: "keterampilan",
        en: "skills",
        vi: "kỹ năng",
        pos: "noun",
        pronunciation_vi: "ke-te-ram-PI-lan — ke-…-an từ `terampil` (khéo); `keahlian` ≈ chuyên môn",
        pronunciation_en: "ke-te-ram-PI-lan — ke-…-an from `terampil` (adept); `keahlian` ≈ expertise",
      },
      {
        cell_id: "2fe8c6c2-58ea-4644-afd1-fef3888e3b7e",
        word: "perusahaan",
        en: "company / firm",
        vi: "công ty",
        pos: "noun",
        pronunciation_vi: "pe-ru-sa-HA-an — peN-…-an từ `usaha` (nỗ lực/kinh doanh)",
        pronunciation_en: "pe-ru-sa-HA-an — peN-…-an from `usaha` (effort/business)",
      },
      {
        cell_id: "0d5cc205-ca62-4e07-9890-e95077504eb0",
        word: "atasan",
        en: "boss / superior",
        vi: "cấp trên / sếp",
        pos: "noun",
        pronunciation_vi: "a-TA-san — từ `atas` (trên) + -an; `bawahan` = cấp dưới",
        pronunciation_en: "a-TA-san — from `atas` (above) + -an; `bawahan` = subordinate",
      },
      // Pay & terms
      {
        cell_id: "c71df98a-2394-4835-b607-777cc498512c",
        word: "gaji",
        en: "salary",
        vi: "lương",
        pos: "noun",
        pronunciation_vi: "GA-ji — `j` đọc 'j' (như 'jam'); tính theo tháng",
        pronunciation_en: "GA-ji — `j` as in 'jam'; quoted per month",
      },
      {
        cell_id: "7b4d36e2-4852-44c0-8af7-44a66424104a",
        word: "tunjangan",
        en: "allowance / benefit",
        vi: "phụ cấp / trợ cấp",
        pos: "noun",
        pronunciation_vi: "tun-JA-ngan — ăn, đi lại, BPJS; phần của tổng thu nhập",
        pronunciation_en: "tun-JA-ngan — meals, transport, BPJS; part of total pay",
      },
      {
        cell_id: "08d62620-d0a8-4420-9753-8924908335d4",
        word: "negosiasi",
        en: "negotiation",
        vi: "thương lượng / đàm phán",
        pos: "noun",
        pronunciation_vi: "ne-go-si-A-si — bị động: `dinegosiasi` = được thương lượng",
        pronunciation_en: "ne-go-si-A-si — passive: `dinegosiasi` = can be negotiated",
      },
      {
        cell_id: "23c865b6-25c6-48f1-ab7a-915de618e88b",
        word: "kontrak",
        en: "contract",
        vi: "hợp đồng",
        pos: "noun",
        pronunciation_vi: "KON-trak — đọc rõ `k` cuối; `karyawan tetap` = nhân viên chính thức",
        pronunciation_en: "KON-trak — sound the final `k`; `karyawan tetap` = permanent staff",
      },
      {
        cell_id: "18834a60-6a58-4af1-adba-ff50e36e95f4",
        word: "kelebihan",
        en: "strength / advantage",
        vi: "điểm mạnh",
        pos: "noun",
        pronunciation_vi: "ke-le-BIH-an — ke-…-an từ `lebih` (hơn)",
        pronunciation_en: "ke-le-BIH-an — ke-…-an from `lebih` (more)",
      },
      {
        cell_id: "5a817493-2c2e-44af-9209-90fc47dd6caa",
        word: "kekurangan",
        en: "weakness / shortcoming",
        vi: "điểm yếu",
        pos: "noun",
        pronunciation_vi: "ke-ku-RA-ngan — ke-…-an từ `kurang` (thiếu)",
        pronunciation_en: "ke-ku-RA-ngan — ke-…-an from `kurang` (lacking)",
      },
    ],
    dialogue: [
      // Dialogue: a full short interview
      {
        cell_id: "e14d513b-f436-4597-aec1-3b0a6e9c90c5",
        speaker: "Pewawancara",
        text: "Selamat pagi. Silakan duduk. Ceritakan tentang diri Anda.",
        vi: "Chào buổi sáng. Mời ngồi. Hãy kể về bản thân anh/chị.",
        en: "Good morning. Please sit. Tell me about yourself.",
      },
      {
        cell_id: "01aa3f5f-d5fe-4b60-ab99-5a5324681378",
        speaker: "Pelamar",
        text: "Selamat pagi. Perkenalkan, nama saya Linh. Saya punya pengalaman lima tahun di bidang pemasaran.",
        vi: "Chào buổi sáng. Cho phép tôi giới thiệu, tôi tên Linh. Tôi có năm năm kinh nghiệm trong lĩnh vực marketing.",
        en: "Good morning. Let me introduce myself, my name is Linh. I have five years of experience in marketing.",
      },
      {
        cell_id: "85d1117e-2340-482e-b4ef-f15a04d742d6",
        speaker: "Pewawancara",
        text: "Mengapa Anda ingin bekerja di perusahaan kami?",
        vi: "Tại sao anh/chị muốn làm việc ở công ty chúng tôi?",
        en: "Why do you want to work at our company?",
      },
      {
        cell_id: "46fbb20d-2bf5-45c5-b295-ff12adc854d4",
        speaker: "Pelamar",
        text: "Karena perusahaan ini terkenal dan saya bisa belajar banyak di sini.",
        vi: "Vì công ty này nổi tiếng và tôi có thể học hỏi nhiều ở đây.",
        en: "Because this company is well known and I can learn a lot here.",
      },
      {
        cell_id: "e1d79cd0-e93d-4ab4-a0a9-8f288aed7057",
        speaker: "Pewawancara",
        text: "Berapa gaji yang Anda harapkan?",
        vi: "Mức lương anh/chị mong muốn là bao nhiêu?",
        en: "What salary do you expect?",
      },
      {
        cell_id: "e5171cfd-802f-43bf-9246-b01ca67a973d",
        speaker: "Pelamar",
        text: "Saya berharap sekitar sepuluh juta rupiah. Apakah gajinya masih bisa dinegosiasi?",
        vi: "Tôi mong khoảng mười triệu rupiah. Lương có còn thương lượng được không?",
        en: "I'm hoping for around ten million rupiah. Is the salary still negotiable?",
      },
      {
        cell_id: "1869ff64-3df5-48bb-9fb3-475d09e74327",
        speaker: "Pewawancara",
        text: "Bisa kita bicarakan nanti. Apakah ada pertanyaan dari Anda?",
        vi: "Chúng ta có thể bàn sau. Anh/chị có câu hỏi nào không?",
        en: "We can discuss that later. Do you have any questions?",
      },
      {
        cell_id: "c86c6065-794c-477a-b891-a742095720d4",
        speaker: "Pelamar",
        text: "Ya. Kapan saya akan mendapat kabar? Terima kasih atas kesempatan ini.",
        vi: "Có ạ. Khi nào tôi sẽ nhận được phản hồi? Cảm ơn vì cơ hội này.",
        en: "Yes. When will I hear back? Thank you for this opportunity.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi ứng tuyển vào vị trí này.", answer: "Saya melamar untuk posisi ini." },
          { prompt: "Tôi có năm năm kinh nghiệm.", answer: "Saya punya pengalaman lima tahun." },
          { prompt: "Đây là CV và đơn xin việc của tôi.", answer: "Ini CV dan surat lamaran saya." },
          { prompt: "Tôi có thể bắt đầu vào tháng sau.", answer: "Saya bisa mulai bekerja bulan depan." },
          { prompt: "Cảm ơn vì cơ hội này.", answer: "Terima kasih atas kesempatan ini." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thương lượng lương — dịch sang tiếng Indonesia:",
        instruction_en: "Salary-negotiation practice — translate into Indonesian:",
        items: [
          { prompt: "Lương có thương lượng được không?", answer: "Apakah gajinya bisa dinegosiasi?" },
          { prompt: "Tôi mong mức lương khoảng mười triệu.", answer: "Saya berharap gaji sekitar sepuluh juta." },
          { prompt: "Có phụ cấp ăn trưa không?", answer: "Apakah ada tunjangan makan?" },
          { prompt: "Khi nào tôi sẽ nhận được phản hồi?", answer: "Kapan saya akan mendapat kabar?" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn `melamar`, `lamaran`, `bekerja`, hay `pekerjaan` cho đúng (động từ vs danh từ):",
        instruction_en:
          "Choose `melamar`, `lamaran`, `bekerja`, or `pekerjaan` correctly (verb vs noun):",
        items: [
          { prompt: "Saya mau ___ untuk posisi ini.", answer: "melamar", hint: "động từ 'ứng tuyển' (meN-)" },
          { prompt: "Ini surat ___ saya.", answer: "lamaran", hint: "danh từ 'lá đơn' (-an)" },
          { prompt: "Saya ingin ___ di sini.", answer: "bekerja", hint: "động từ 'làm việc' (ber-)" },
          { prompt: "Ini ___ impian saya.", answer: "pekerjaan", hint: "danh từ 'công việc' (peN-…-an)" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung giới thiệu phỏng vấn — điền chỗ trống: `Perkenalkan, nama saya ___. Saya melamar untuk posisi ___. Saya punya pengalaman ___ tahun di bidang ___.`",
        instruction_en:
          "Interview self-intro frame — fill the blanks: `Perkenalkan, nama saya ___. Saya melamar untuk posisi ___. Saya punya pengalaman ___ tahun di bidang ___.`",
        example:
          "Perkenalkan, nama saya Linh. Saya melamar untuk posisi staf pemasaran. Saya punya pengalaman lima tahun di bidang pemasaran.",
        example_vi:
          "Cho phép tôi giới thiệu, tôi tên Linh. Tôi ứng tuyển vị trí nhân viên marketing. Tôi có năm năm kinh nghiệm trong lĩnh vực marketing.",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra phỏng vấn — bạn làm được chưa?",
        instruction_en: "Interview self-check — can you do each one?",
        items: [
          { vi: "Tôi có thể mở đầu và cảm ơn một cách trang trọng.", en: "I can open and thank the interviewer formally." },
          { vi: "Tôi có thể giới thiệu bản thân và nêu vị trí ứng tuyển.", en: "I can introduce myself and state the role I'm applying for." },
          { vi: "Tôi có thể nói về kinh nghiệm mà không nhân đôi sau số đếm.", en: "I can describe my experience without reduplicating after a number." },
          { vi: "Tôi phân biệt được `melamar` (động từ) và `lamaran` (danh từ).", en: "I can tell `melamar` (verb) from `lamaran` (noun)." },
          { vi: "Tôi có thể hỏi lương lịch sự bằng câu bị động `dinegosiasi`.", en: "I can ask about pay politely with the passive `dinegosiasi`." },
          { vi: "Tôi dùng `saya`/`Anda` chứ không `kamu`/`gue`.", en: "I use `saya`/`Anda`, never `kamu`/`gue`." },
        ],
      },
    ],
  },
];

export default lessons;
