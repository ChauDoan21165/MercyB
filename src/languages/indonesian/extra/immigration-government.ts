// Immigration & Government Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling Italian `extra/*` files (which in turn mirror the
// French `FrenchLesson` shape). When the shared Indonesian registry
// (src/languages/indonesian/lessons.ts) lands, swap the local types for a shared
// import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// Government Indonesian leans formal: full `saya`/`Anda`, the passive `di-` prefix
// ("dokumen sudah diperiksa"), and bureaucratic nouns built with `pe-...-an` /
// `ke-...-an`. For Vietnamese speakers the WIN is still no conjugation/gender/tone;
// the trap is the heavy affixation and a wall of acronyms (KITAS, KITAP, NIK).

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
    id: "indonesian_immigration_government",
    level: "B1",
    category: "life_admin",
    title_vi: "Tiếng Indonesia cho nhập cư và thủ tục hành chính",
    title_en: "Immigration and government Indonesian",
    sentences: [
      // ── At the immigration office ──────────────────────────────────────
      {
        en: "Saya mau memperpanjang KITAS saya.",
        vi: "Tôi muốn gia hạn thẻ tạm trú (KITAS) của tôi.",
        pronunciation_focus: [
          "SA-ya mau mem-per-pan-JANG — `memperpanjang` = gia hạn/kéo dài (khung `memper-...`, gốc `panjang` 'dài').",
          "Lỗi người Việt: nói `bikin panjang`. Động từ thủ tục chuẩn là `memperpanjang`.",
          "Luyện: `Saya mau memperpanjang KITAS saya.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau mem-per-pan-JANG — `memperpanjang` = to extend (the `memper-...` frame on `panjang` 'long').",
          "VN-speaker trap: saying `bikin panjang`. The proper bureaucratic verb is `memperpanjang`.",
          "Drill: `Saya mau memperpanjang KITAS saya.`",
        ],
      },
      {
        en: "Ini paspor dan dokumen saya.",
        vi: "Đây là hộ chiếu và giấy tờ của tôi.",
        pronunciation_focus: [
          "I-ni PAS-por dan do-ku-MEN — `paspor` = hộ chiếu; `dokumen` = giấy tờ/tài liệu.",
          "Lỗi người Việt: đọc `pát-pho`. Đọc rõ cả `s` và `r`: `PAS-por`.",
          "Luyện: `Ini paspor dan dokumen saya.`",
        ],
        pronunciation_focus_en: [
          "I-ni PAS-por dan do-ku-MEN — `paspor` = passport; `dokumen` = documents.",
          "VN-speaker trap: swallowing the consonants. Sound both `s` and `r`: `PAS-por`.",
          "Drill: `Ini paspor dan dokumen saya.`",
        ],
      },
      {
        en: "Dokumen apa saja yang diperlukan?",
        vi: "Cần những giấy tờ nào ạ?",
        pronunciation_focus: [
          "do-ku-MEN A-pa SA-ja yang di-per-lu-KAN — `apa saja` = những … nào; `diperlukan` (bị động) = được yêu cầu/cần.",
          "Lỗi người Việt: né thể bị động `di-`. Trong văn phòng, `yang diperlukan` (cái được cần) là cách nói chuẩn.",
          "Luyện: `Dokumen apa saja yang diperlukan?`",
        ],
        pronunciation_focus_en: [
          "do-ku-MEN A-pa SA-ja yang di-per-lu-KAN — `apa saja` = which ones; `diperlukan` (passive) = required.",
          "VN-speaker trap: avoiding the `di-` passive. In offices, `yang diperlukan` (what is required) is the standard phrasing.",
          "Drill: `Dokumen apa saja yang diperlukan?`",
        ],
      },
      {
        en: "Berapa lama prosesnya?",
        vi: "Quá trình xử lý mất bao lâu ạ?",
        pronunciation_focus: [
          "be-RA-pa LA-ma PRO-ses-nya — `berapa lama` = bao lâu; `proses` + `-nya` = quá trình (của việc này).",
          "Lỗi người Việt: nói `berapa waktu`. 'Bao lâu' (thời lượng) là `berapa lama`, không phải `berapa waktu`.",
          "Luyện: `Berapa lama prosesnya?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa LA-ma PRO-ses-nya — `berapa lama` = how long; `proses` + `-nya` = the process.",
          "VN-speaker trap: `berapa waktu`. 'How long' (duration) is `berapa lama`, not `berapa waktu`.",
          "Drill: `Berapa lama prosesnya?`",
        ],
      },
      {
        en: "Berapa biayanya?",
        vi: "Lệ phí là bao nhiêu ạ?",
        pronunciation_focus: [
          "be-RA-pa bi-a-YA-nya — `biaya` = chi phí/lệ phí; `-nya` = 'của nó'.",
          "Lỗi người Việt: nói `berapa uang`. Hỏi phí dịch vụ/lệ phí dùng `biaya`, không phải `uang` (tiền).",
          "Luyện: `Berapa biayanya?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa bi-a-YA-nya — `biaya` = cost/fee; `-nya` = 'its'.",
          "VN-speaker trap: `berapa uang`. For a fee, use `biaya`, not `uang` (money).",
          "Drill: `Berapa biayanya?`",
        ],
      },
      // ── Forms & status ─────────────────────────────────────────────────
      {
        en: "Saya harus mengisi formulir yang mana?",
        vi: "Tôi phải điền vào mẫu đơn nào ạ?",
        pronunciation_focus: [
          "SA-ya HA-rus me-NGI-si for-mu-LIR yang MA-na — `mengisi` = điền (gốc `isi` + `meN-`); `formulir` = mẫu đơn.",
          "Lỗi người Việt: nói `tulis formulir`. 'Điền đơn' là `mengisi formulir`, không phải `tulis`.",
          "Luyện: `Saya harus mengisi formulir yang mana?`",
        ],
        pronunciation_focus_en: [
          "SA-ya HA-rus me-NGI-si for-mu-LIR yang MA-na — `mengisi` = to fill in (root `isi` + `meN-`); `formulir` = form.",
          "VN-speaker trap: `tulis formulir`. 'Fill in a form' is `mengisi formulir`, not `tulis`.",
          "Drill: `Saya harus mengisi formulir yang mana?`",
        ],
      },
      {
        en: "Tolong tunjukkan di mana saya harus tanda tangan.",
        vi: "Làm ơn chỉ cho tôi phải ký ở đâu.",
        pronunciation_focus: [
          "TO-long tun-JUK-kan ... TAN-da TA-ngan — `tunjukkan` = hãy chỉ (gốc `tunjuk` + `-kan`); `tanda tangan` = chữ ký/ký.",
          "Lỗi người Việt: nói `sign di mana`. 'Ký tên' là `tanda tangan`; đừng chêm tiếng Anh.",
          "Luyện: `Tolong tunjukkan di mana saya harus tanda tangan.`",
        ],
        pronunciation_focus_en: [
          "TO-long tun-JUK-kan ... TAN-da TA-ngan — `tunjukkan` = please show (root `tunjuk` + `-kan`); `tanda tangan` = signature/to sign.",
          "VN-speaker trap: `sign di mana`. 'To sign' is `tanda tangan`; don't code-switch to English.",
          "Drill: `Tolong tunjukkan di mana saya harus tanda tangan.`",
        ],
      },
      {
        en: "Status visa saya akan habis bulan depan.",
        vi: "Visa của tôi sắp hết hạn vào tháng sau.",
        pronunciation_focus: [
          "STA-tus VI-sa SA-ya A-kan HA-bis BU-lan de-PAN — `akan` = sẽ (thì tương lai); `habis` = hết hạn; `bulan depan` = tháng sau.",
          "Lợi thế người Việt: `akan` = 'sẽ' y như tiếng Việt — không chia thì động từ.",
          "Luyện: `Status visa saya akan habis bulan depan.`",
        ],
        pronunciation_focus_en: [
          "STA-tus VI-sa SA-ya A-kan HA-bis BU-lan de-PAN — `akan` = will (future); `habis` = expires; `bulan depan` = next month.",
          "VN-speaker win: `akan` = 'will', maps straight onto Vietnamese 'sẽ' — no verb tense to change.",
          "Drill: `Status visa saya akan habis bulan depan.`",
        ],
      },
      {
        en: "Apakah saya perlu membuat janji temu dulu?",
        vi: "Tôi có cần đặt lịch hẹn trước không ạ?",
        pronunciation_focus: [
          "a-pa-KAH SA-ya PER-lu mem-BU-at JAN-ji TE-mu DU-lu — `membuat janji temu` = đặt lịch hẹn; `dulu` = trước (đã).",
          "Lỗi người Việt: nói `booking`. Đặt hẹn ở cơ quan là `membuat janji (temu)`.",
          "Luyện: `Apakah saya perlu membuat janji temu dulu?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH SA-ya PER-lu mem-BU-at JAN-ji TE-mu DU-lu — `membuat janji temu` = to make an appointment; `dulu` = first.",
          "VN-speaker trap: saying `booking`. An office appointment is `membuat janji (temu)`.",
          "Drill: `Apakah saya perlu membuat janji temu dulu?`",
        ],
      },
      // ── Problems & clarifying ──────────────────────────────────────────
      {
        en: "Maaf, saya tidak membawa fotokopi.",
        vi: "Xin lỗi, tôi không mang theo bản phô-tô.",
        pronunciation_focus: [
          "ma-AF, SA-ya TI-dak mem-BA-wa fo-to-KO-pi — `membawa` = mang theo (gốc `bawa` + `meN-`); `fotokopi` = bản sao chụp.",
          "Lỗi người Việt: nói `bawa` trống (khẩu ngữ). Ở cơ quan dùng dạng đầy đủ `membawa`.",
          "Luyện: `Maaf, saya tidak membawa fotokopi.`",
        ],
        pronunciation_focus_en: [
          "ma-AF, SA-ya TI-dak mem-BA-wa fo-to-KO-pi — `membawa` = to bring (root `bawa` + `meN-`); `fotokopi` = photocopy.",
          "VN-speaker trap: bare `bawa` (colloquial). In an office use the full `membawa`.",
          "Drill: `Maaf, saya tidak membawa fotokopi.`",
        ],
      },
      {
        en: "Bisakah saya melengkapinya besok?",
        vi: "Tôi bổ sung cho đủ vào ngày mai được không ạ?",
        pronunciation_focus: [
          "bi-sa-KAH SA-ya me-leng-KA-pi-nya be-SOK — `melengkapi` = bổ sung cho đầy đủ (gốc `lengkap` + `meN-...-i`); `-nya` = 'nó'.",
          "Lỗi người Việt: nói `tambah`. 'Bổ sung cho đủ hồ sơ' là `melengkapi`, sắc thái chính xác hơn `tambah`.",
          "Luyện: `Bisakah saya melengkapinya besok?`",
        ],
        pronunciation_focus_en: [
          "bi-sa-KAH SA-ya me-leng-KA-pi-nya be-SOK — `melengkapi` = to complete (root `lengkap` + `meN-...-i`); `-nya` = 'it'.",
          "VN-speaker trap: `tambah`. 'To complete the file' is `melengkapi`, more precise than `tambah` (add).",
          "Drill: `Bisakah saya melengkapinya besok?`",
        ],
      },
      {
        en: "Saya belum menerima suratnya.",
        vi: "Tôi vẫn chưa nhận được thư/giấy báo.",
        pronunciation_focus: [
          "SA-ya be-LUM me-ne-RI-ma SU-rat-nya — `belum` = chưa; `menerima` = nhận (gốc `terima` + `meN-`); `surat` = thư/công văn.",
          "Lỗi người Việt: nói `tidak terima`. 'Chưa nhận' dùng `belum` + dạng đầy đủ `menerima`.",
          "Luyện: `Saya belum menerima suratnya.`",
        ],
        pronunciation_focus_en: [
          "SA-ya be-LUM me-ne-RI-ma SU-rat-nya — `belum` = not yet; `menerima` = to receive (root `terima` + `meN-`); `surat` = letter.",
          "VN-speaker trap: `tidak terima`. 'Haven't received yet' uses `belum` + the full `menerima`.",
          "Drill: `Saya belum menerima suratnya.`",
        ],
      },
      {
        en: "Bisa dijelaskan sekali lagi, Pak/Bu?",
        vi: "Anh/chị giải thích lại một lần nữa được không ạ?",
        pronunciation_focus: [
          "BI-sa di-je-las-KAN se-KA-li LA-gi — `dijelaskan` (bị động) = được giải thích; `sekali lagi` = một lần nữa.",
          "Lỗi người Việt: dùng `kamu` với cán bộ. Luôn dùng `Pak`/`Bu` và thể lịch sự `bisa di...kan`.",
          "Luyện: `Bisa dijelaskan sekali lagi, Pak?`",
        ],
        pronunciation_focus_en: [
          "BI-sa di-je-las-KAN se-KA-li LA-gi — `dijelaskan` (passive) = be explained; `sekali lagi` = once more.",
          "VN-speaker trap: `kamu` with an official. Always `Pak`/`Bu` and the polite `bisa di...kan` frame.",
          "Drill: `Bisa dijelaskan sekali lagi, Pak?`",
        ],
      },
      {
        en: "Terima kasih atas bantuannya.",
        vi: "Cảm ơn anh/chị đã giúp đỡ.",
        pronunciation_focus: [
          "te-ri-MA KA-sih A-tas ban-tu-AN-nya — `atas bantuannya` = vì sự giúp đỡ; câu cảm ơn trang trọng chuẩn.",
          "Lỗi người Việt: chỉ nói `terima kasih`. Trong cơ quan, thêm `atas bantuannya` cho trọn vẹn, lịch sự.",
          "Luyện: `Terima kasih atas bantuannya.`",
        ],
        pronunciation_focus_en: [
          "te-ri-MA KA-sih A-tas ban-tu-AN-nya — `atas bantuannya` = for the assistance; the standard formal thank-you.",
          "VN-speaker trap: stopping at `terima kasih`. In an office, add `atas bantuannya` to sound complete and polite.",
          "Drill: `Terima kasih atas bantuannya.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Giấy tờ cư trú ở Indonesia là một chuỗi viết tắt: `KITAS` (Kartu Izin Tinggal Terbatas — thẻ tạm trú, thường 6–12 tháng, gắn với mục đích như làm việc/hôn nhân) và `KITAP` (Kartu Izin Tinggal Tetap — thẻ thường trú, sau nhiều năm giữ KITAS). Người bảo lãnh/người sử dụng lao động gọi là `sponsor` hoặc `penjamin`. Cơ quan quản lý là `Imigrasi` (Direktorat Jenderal Imigrasi); thủ tục nay phần lớn nộp online qua cổng `evisa.imigrasi.go.id`. Tại quầy, hãy gọi cán bộ là `Pak` (nam) hoặc `Bu` (nữ), nói thể trang trọng (`saya`, không `aku`), và chuẩn bị sẵn nhiều bản `fotokopi` — thiếu bản sao là lý do bị trả hồ sơ phổ biến nhất. Đừng đề nghị 'bồi dưỡng' để đi nhanh; hãy hỏi rõ `biaya resmi` (lệ phí chính thức) và xin biên lai (`kuitansi`).",
    cultural_notes_en:
      "Indonesian residency paperwork is a chain of acronyms: `KITAS` (Kartu Izin Tinggal Terbatas — limited-stay permit, usually 6–12 months, tied to a purpose like work or marriage) and `KITAP` (Kartu Izin Tinggal Tetap — permanent-stay card, after several years on KITAS). Your sponsor/employer is the `sponsor` or `penjamin`. The agency is `Imigrasi` (Directorate General of Immigration); most steps now go through the online portal `evisa.imigrasi.go.id`. At the counter, address the officer as `Pak` (man) or `Bu` (woman), use the formal register (`saya`, not `aku`), and bring plenty of `fotokopi` — missing copies are the single most common reason a file gets bounced. Don't offer anything to 'speed things up'; ask plainly for the `biaya resmi` (official fee) and request a receipt (`kuitansi`).",
    tip_advice_vi:
      "Học thuộc năm câu xương sống cho mọi cơ quan: (1) nêu việc cần — `Saya mau memperpanjang/membuat ___`; (2) hỏi giấy tờ — `Dokumen apa saja yang diperlukan?`; (3) hỏi thời gian + lệ phí — `Berapa lama prosesnya?` / `Berapa biayanya?`; (4) khi thiếu — `Maaf, saya belum membawa ___. Bisa saya lengkapi besok?`; (5) xin nhắc lại — `Bisa dijelaskan sekali lagi, Pak/Bu?`. Trong cơ quan, dùng dạng động từ ĐẦY ĐỦ (meN-): `membawa` không phải `bawa`, `mengisi` không phải `isi`, và làm quen thể bị động `di-` (`diperlukan`, `dijelaskan`) — đó là 'giọng văn phòng' của tiếng Indonesia.",
    tip_advice_en:
      "Memorize five backbone lines for any office: (1) state your business — `Saya mau memperpanjang/membuat ___`; (2) ask for documents — `Dokumen apa saja yang diperlukan?`; (3) ask time + fee — `Berapa lama prosesnya?` / `Berapa biayanya?`; (4) when short a document — `Maaf, saya belum membawa ___. Bisa saya lengkapi besok?`; (5) ask for a repeat — `Bisa dijelaskan sekali lagi, Pak/Bu?`. In an office use the FULL verb form (meN-): `membawa` not `bawa`, `mengisi` not `isi`, and get comfortable with the `di-` passive (`diperlukan`, `dijelaskan`) — that's the 'office register' of Indonesian.",
    vocabulary: [
      // Documents & permits
      {
        cell_id: "d17e9954-9cd2-48d4-9650-3a17e9c89c2e",
        word: "KITAS",
        en: "limited-stay permit card",
        vi: "thẻ tạm trú",
        pos: "noun (acronym)",
        pronunciation_vi: "KI-tas — Kartu Izin Tinggal Terbatas; thường 6–12 tháng",
        pronunciation_en: "KI-tas — Kartu Izin Tinggal Terbatas; usually 6–12 months",
      },
      {
        cell_id: "2785e169-dc62-4fc4-9bdc-2343e6104ba6",
        word: "KITAP",
        en: "permanent-stay permit card",
        vi: "thẻ thường trú",
        pos: "noun (acronym)",
        pronunciation_vi: "KI-tap — Kartu Izin Tinggal Tetap; cấp sau nhiều năm KITAS",
        pronunciation_en: "KI-tap — Kartu Izin Tinggal Tetap; granted after years on KITAS",
      },
      {
        cell_id: "5a2d93d6-1122-48c4-bb5c-8a848a6a0c30",
        word: "imigrasi",
        en: "immigration (office/authority)",
        vi: "cơ quan xuất nhập cảnh",
        pos: "noun",
        pronunciation_vi: "i-mi-GRA-si — `kantor imigrasi` = văn phòng xuất nhập cảnh",
        pronunciation_en: "i-mi-GRA-si — `kantor imigrasi` = immigration office",
      },
      {
        cell_id: "390bae24-ddc3-4a40-ac2e-424e1ed3a155",
        word: "paspor",
        en: "passport",
        vi: "hộ chiếu",
        pos: "noun",
        pronunciation_vi: "PAS-por — đọc rõ `s` và `r`",
        pronunciation_en: "PAS-por — sound both `s` and `r`",
      },
      {
        cell_id: "14c37049-f60f-4dbd-ad3a-cd6f4f4cb58a",
        word: "visa",
        en: "visa",
        vi: "thị thực / visa",
        pos: "noun",
        pronunciation_vi: "VI-sa — `visa habis` = visa hết hạn",
        pronunciation_en: "VI-sa — `visa habis` = visa expires",
      },
      {
        cell_id: "3fbb5df1-a30c-4d6f-828a-f625208c1981",
        word: "dokumen",
        en: "document(s)",
        vi: "giấy tờ / tài liệu",
        pos: "noun",
        pronunciation_vi: "do-ku-MEN — `dokumen lengkap` = đủ giấy tờ",
        pronunciation_en: "do-ku-MEN — `dokumen lengkap` = complete documents",
      },
      {
        cell_id: "f0f402eb-9bae-4052-953f-48084af10be3",
        word: "formulir",
        en: "form (to fill in)",
        vi: "mẫu đơn",
        pos: "noun",
        pronunciation_vi: "for-mu-LIR — `mengisi formulir` = điền đơn",
        pronunciation_en: "for-mu-LIR — `mengisi formulir` = fill in a form",
      },
      // Office actions (full meN- forms)
      {
        cell_id: "9124863f-0030-4d48-8caf-27cca26d5dc8",
        word: "memperpanjang",
        en: "to extend / renew",
        vi: "gia hạn",
        pos: "verb",
        pronunciation_vi: "mem-per-pan-JANG — khung `memper-` + `panjang` (dài)",
        pronunciation_en: "mem-per-pan-JANG — `memper-` frame on `panjang` (long)",
      },
      {
        cell_id: "839da151-9b71-4510-836a-9b64600055ab",
        word: "mengisi",
        en: "to fill in (a form)",
        vi: "điền (đơn)",
        pos: "verb",
        pronunciation_vi: "me-NGI-si — gốc `isi` + `meN-`; không phải `tulis`",
        pronunciation_en: "me-NGI-si — root `isi` + `meN-`; not `tulis`",
      },
      {
        cell_id: "b39b61cc-75dc-4364-80aa-f5c0831c1935",
        word: "menyerahkan",
        en: "to submit / hand in",
        vi: "nộp / nộp lại",
        pos: "verb",
        pronunciation_vi: "me-nye-rah-KAN — gốc `serah` + `meN-...-kan`",
        pronunciation_en: "me-nye-rah-KAN — root `serah` + `meN-...-kan`",
      },
      {
        cell_id: "2054a0c0-8a07-4bc5-8e58-a27380843428",
        word: "tanda tangan",
        en: "signature / to sign",
        vi: "chữ ký / ký tên",
        pos: "noun / verb",
        pronunciation_vi: "TAN-da TA-ngan — nghĩa đen 'dấu + tay'; đừng chêm 'sign'",
        pronunciation_en: "TAN-da TA-ngan — literally 'sign + hand'; don't say English 'sign'",
      },
      // Costs, time, status
      {
        cell_id: "03c820cf-9284-4d01-a822-26959235704a",
        word: "biaya",
        en: "cost / fee",
        vi: "chi phí / lệ phí",
        pos: "noun",
        pronunciation_vi: "bi-A-ya — `biaya resmi` = lệ phí chính thức; khác `uang` (tiền)",
        pronunciation_en: "bi-A-ya — `biaya resmi` = official fee; not `uang` (money)",
      },
      {
        cell_id: "450504be-9b69-4c20-a299-e3a9366207f5",
        word: "kuitansi",
        en: "receipt",
        vi: "biên lai",
        pos: "noun",
        pronunciation_vi: "kwi-TAN-si — luôn xin `kuitansi` sau khi đóng phí",
        pronunciation_en: "kwi-TAN-si — always ask for the `kuitansi` after paying",
      },
      {
        cell_id: "c65c0ce1-a03d-4e8e-b7ef-c0f7f79ca870",
        word: "penjamin",
        en: "sponsor / guarantor",
        vi: "người bảo lãnh",
        pos: "noun",
        pronunciation_vi: "pen-JA-min — gốc `jamin` (bảo đảm); cũng nói `sponsor`",
        pronunciation_en: "pen-JA-min — root `jamin` (guarantee); also `sponsor`",
      },
      {
        cell_id: "ceb5214f-683c-4be8-b851-23dbccf1c2c5",
        word: "berlaku",
        en: "valid / in effect",
        vi: "có hiệu lực / còn hạn",
        pos: "verb / adjective",
        pronunciation_vi: "ber-LA-ku — `masih berlaku` = vẫn còn hạn",
        pronunciation_en: "ber-LA-ku — `masih berlaku` = still valid",
      },
    ],
    dialogue: [
      // Dialogue: Extending a KITAS at the immigration office
      {
        cell_id: "e7134f40-9617-4dd9-a7f5-dd759d2d7004",
        speaker: "Petugas",
        text: "Selamat pagi. Ada yang bisa saya bantu?",
        vi: "Chào buổi sáng. Tôi có thể giúp gì ạ?",
        en: "Good morning. How can I help you?",
      },
      {
        cell_id: "053bd586-e0a3-4641-987e-9c4edd1259b8",
        speaker: "Pemohon",
        text: "Selamat pagi, Pak. Saya mau memperpanjang KITAS saya.",
        vi: "Chào buổi sáng, anh. Tôi muốn gia hạn thẻ tạm trú của tôi.",
        en: "Good morning, sir. I'd like to extend my KITAS.",
      },
      {
        cell_id: "7032c436-96c3-41ad-8441-a87c12d17126",
        speaker: "Petugas",
        text: "Baik. Boleh saya lihat paspor dan KITAS lama Anda?",
        vi: "Vâng. Cho tôi xem hộ chiếu và KITAS cũ của anh được không?",
        en: "Certainly. May I see your passport and old KITAS?",
      },
      {
        cell_id: "6737ad85-91f2-474a-9804-6d1d2071ad4f",
        speaker: "Pemohon",
        text: "Ini, Pak. Dokumen apa saja yang diperlukan?",
        vi: "Đây ạ. Cần thêm những giấy tờ nào ạ?",
        en: "Here you are, sir. Which documents are required?",
      },
      {
        cell_id: "1e51ea0d-8265-49fe-a56a-b1924bfa4135",
        speaker: "Petugas",
        text: "Surat dari penjamin, fotokopi paspor, dan formulir ini yang sudah diisi.",
        vi: "Thư của người bảo lãnh, bản phô-tô hộ chiếu, và mẫu đơn này đã điền xong.",
        en: "A letter from your sponsor, a passport photocopy, and this completed form.",
      },
      {
        cell_id: "a400745f-28f4-449e-931d-1a53598a7058",
        speaker: "Pemohon",
        text: "Maaf, saya belum membawa fotokopinya. Bisa saya lengkapi besok?",
        vi: "Xin lỗi, tôi chưa mang theo bản phô-tô. Mai tôi bổ sung được không ạ?",
        en: "Sorry, I haven't brought the photocopy. May I complete it tomorrow?",
      },
      {
        cell_id: "eae05240-5dce-44c9-a123-299983c936ce",
        speaker: "Petugas",
        text: "Bisa. Prosesnya sekitar lima hari kerja, biayanya tertera di brosur ini.",
        vi: "Được. Quá trình mất khoảng năm ngày làm việc, lệ phí ghi trong tờ rơi này.",
        en: "You may. The process takes about five working days; the fee is listed in this brochure.",
      },
      {
        cell_id: "b4160fe1-87c6-4a12-9d52-029fb59181f5",
        speaker: "Pemohon",
        text: "Baik. Terima kasih atas bantuannya, Pak.",
        vi: "Vâng. Cảm ơn anh đã giúp đỡ ạ.",
        en: "Alright. Thank you for your help, sir.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn gia hạn thẻ tạm trú.", answer: "Saya mau memperpanjang KITAS saya." },
          { prompt: "Cần những giấy tờ nào?", answer: "Dokumen apa saja yang diperlukan?" },
          { prompt: "Quá trình mất bao lâu?", answer: "Berapa lama prosesnya?" },
          { prompt: "Lệ phí là bao nhiêu?", answer: "Berapa biayanya?" },
          { prompt: "Tôi phải ký ở đâu?", answer: "Di mana saya harus tanda tangan?" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Indonesia:",
        instruction_en: "Extra practice — translate into Indonesian:",
        items: [
          { prompt: "Đây là hộ chiếu và giấy tờ của tôi.", answer: "Ini paspor dan dokumen saya." },
          { prompt: "Visa của tôi sắp hết hạn tháng sau.", answer: "Visa saya akan habis bulan depan." },
          { prompt: "Tôi có cần đặt lịch hẹn trước không?", answer: "Apakah saya perlu membuat janji temu dulu?" },
          { prompt: "Xin lỗi, tôi không mang theo bản phô-tô.", answer: "Maaf, saya tidak membawa fotokopi." },
          { prompt: "Anh giải thích lại một lần nữa được không?", answer: "Bisa dijelaskan sekali lagi, Pak?" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Đổi sang dạng động từ ĐẦY ĐỦ (meN-) dùng ở cơ quan: `bawa` → ___, `isi` → ___, `serah` → ___, `terima` → ___.",
        instruction_en:
          "Give the FULL office verb form (meN-): `bawa` → ___, `isi` → ___, `serah` → ___, `terima` → ___.",
        items: [
          { prompt: "bawa (mang) →", answer: "membawa" },
          { prompt: "isi (điền) →", answer: "mengisi" },
          { prompt: "serah (nộp) →", answer: "menyerahkan" },
          { prompt: "terima (nhận) →", answer: "menerima" },
        ],
      },
      {
        type: "acronym_match",
        instruction_vi: "Ghép viết tắt với nghĩa:",
        instruction_en: "Match the acronym to its meaning:",
        items: [
          { prompt: "KITAS", answer: "thẻ tạm trú (limited-stay permit)" },
          { prompt: "KITAP", answer: "thẻ thường trú (permanent-stay permit)" },
          { prompt: "Imigrasi", answer: "cơ quan xuất nhập cảnh (immigration office)" },
          { prompt: "penjamin", answer: "người bảo lãnh (sponsor/guarantor)" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung trình bày tại quầy — điền chỗ trống: `Selamat pagi, Pak/Bu. Saya mau ___. Ini paspor dan dokumen saya. Dokumen apa saja yang diperlukan? Berapa lama prosesnya?`",
        instruction_en:
          "Counter-request frame — fill the blanks: `Selamat pagi, Pak/Bu. Saya mau ___. Ini paspor dan dokumen saya. Dokumen apa saja yang diperlukan? Berapa lama prosesnya?`",
        example:
          "Selamat pagi, Bu. Saya mau memperpanjang KITAS. Ini paspor dan dokumen saya. Dokumen apa saja yang diperlukan? Berapa lama prosesnya?",
        example_vi:
          "Chào buổi sáng, chị. Tôi muốn gia hạn thẻ tạm trú. Đây là hộ chiếu và giấy tờ của tôi. Cần những giấy tờ nào? Quá trình mất bao lâu?",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra ở cơ quan — bạn làm được chưa?",
        instruction_en: "Quick office self-check — can you do each one?",
        items: [
          { vi: "Tôi có thể nêu việc cần làm bằng `Saya mau …`.", en: "I can state my business with `Saya mau …`." },
          { vi: "Tôi có thể hỏi giấy tờ, thời gian và lệ phí.", en: "I can ask for documents, time, and fee." },
          { vi: "Tôi có thể báo khi thiếu giấy tờ và xin bổ sung sau.", en: "I can report a missing document and ask to complete it later." },
          { vi: "Tôi dùng dạng động từ đầy đủ (membawa, mengisi).", en: "I use the full verb forms (membawa, mengisi)." },
          { vi: "Tôi hiểu thể bị động `di-` (diperlukan, dijelaskan).", en: "I understand the `di-` passive (diperlukan, dijelaskan)." },
          { vi: "Tôi xưng hô `Pak/Bu` với cán bộ, không dùng `kamu`.", en: "I address officials as `Pak/Bu`, never `kamu`." },
        ],
      },
    ],
  },
];

export default lessons;
