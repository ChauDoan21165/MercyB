// Visa & Work Permit Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (construction-worker.ts, job-interview.ts,
// housing-rental.ts, medical-vocabulary.ts etc.), which in turn mirror the French
// `FrenchLesson` shape. When the shared Indonesian registry
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
// no articles. The immigration-specific traps are: the document acronyms read
// letter-by-letter (`KITAS` is said as a word "KEE-tas", but `IMTA` letter-by-letter
// "i-em-te-a"), the formal passive `di-` everywhere on official forms (`diperpanjang`
// extended, `ditolak` rejected, `dideportasi` deported), and `perpanjang` (to extend)
// vs. `perpanjangan` (an extension, the noun).

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

// Loosely typed so per-type fields (translation, fill-blank, checklist) can vary.
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
    id: "indonesian_visa_work_permit",
    level: "B1",
    category: "bureaucracy",
    title_vi: "Tiếng Indonesia về visa & giấy phép lao động",
    title_en: "Visa & work permit Indonesian",
    sentences: [
      // ── Stating your purpose ─────────────────────────────────────────────
      {
        en: "Saya mau mengurus KITAS untuk bekerja.",
        vi: "Tôi muốn làm thủ tục KITAS để đi làm.",
        pronunciation_focus: [
          "SA-ya MAU me-ngu-RUS KEE-tas UN-tuk be-KER-ja — `mengurus` = lo/làm thủ tục (meN- + `urus`); `KITAS` đọc như một từ 'KEE-tas'.",
          "Lỗi người Việt: dùng gốc trần `urus` ở văn cảnh trang trọng — ❌ `saya urus KITAS` → ✓ `saya mengurus KITAS`.",
          "Luyện: `Saya mau mengurus KITAS untuk bekerja.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU me-ngu-RUS KEE-tas UN-tuk be-KER-ja — `mengurus` = to handle/process (meN- + `urus`); `KITAS` is said as one word 'KEE-tas'.",
          "VN-speaker trap: using the bare root `urus` in a formal setting — ❌ `saya urus KITAS` → ✓ `saya mengurus KITAS`.",
          "Drill: `Saya mau mengurus KITAS untuk bekerja.`",
        ],
      },
      {
        en: "Perusahaan saya menjadi sponsor saya.",
        vi: "Công ty của tôi là người bảo lãnh cho tôi.",
        pronunciation_focus: [
          "pe-ru-sa-HA-an SA-ya men-JA-di SPON-sor SA-ya — `menjadi` = trở thành/đóng vai (meN- + `jadi`); `sponsor` = người/đơn vị bảo lãnh.",
          "Lỗi người Việt: dịch máy `sponsor` thành 'nhà tài trợ'. Trong nhập cư, `sponsor` = bên BẢO LÃNH (thường là công ty thuê bạn).",
          "Luyện: `Perusahaan saya menjadi sponsor saya.`",
        ],
        pronunciation_focus_en: [
          "pe-ru-sa-HA-an SA-ya men-JA-di SPON-sor SA-ya — `menjadi` = to become/act as (meN- + `jadi`); `sponsor` = the sponsoring party.",
          "VN-speaker trap: literally rendering `sponsor` as a 'donor'. In immigration, `sponsor` = the SPONSOR (usually the company that hires you).",
          "Drill: `Perusahaan saya menjadi sponsor saya.`",
        ],
      },
      // ── Required documents ───────────────────────────────────────────────
      {
        en: "Apa saja dokumen yang diperlukan?",
        vi: "Cần những giấy tờ gì ạ?",
        pronunciation_focus: [
          "A-pa SA-ja do-ku-MEN yang di-per-LU-kan — `apa saja` = những gì (hỏi danh sách); `diperlukan` = được cần đến (bị động `di-` + per- + `perlu` + -kan).",
          "Lỗi người Việt: né câu bị động dài. Trên giấy tờ hành chính, `diperlukan`/`dibutuhkan` = 'được yêu cầu' rất phổ biến.",
          "Luyện: `Apa saja dokumen yang diperlukan?`",
        ],
        pronunciation_focus_en: [
          "A-pa SA-ja do-ku-MEN yang di-per-LU-kan — `apa saja` = what (asking for a list); `diperlukan` = is needed (passive `di-` + per- + `perlu` + -kan).",
          "VN-speaker trap: shying from long passives. On official paperwork `diperlukan`/`dibutuhkan` = 'is required' is very common.",
          "Drill: `Apa saja dokumen yang diperlukan?`",
        ],
      },
      {
        en: "Paspor saya masih berlaku satu tahun lagi.",
        vi: "Hộ chiếu của tôi còn hạn thêm một năm nữa.",
        pronunciation_focus: [
          "PAS-por SA-ya ma-SIH ber-LA-ku SA-tu TA-hun LA-gi — `berlaku` = có hiệu lực/còn hạn (ber- + `laku`); `masih … lagi` = còn … nữa.",
          "Lỗi người Việt: nói `paspor masih bagus` cho 'còn hạn'. Đúng thuật ngữ là `masih berlaku` (còn hiệu lực).",
          "Luyện: `Paspor saya masih berlaku satu tahun lagi.`",
        ],
        pronunciation_focus_en: [
          "PAS-por SA-ya ma-SIH ber-LA-ku SA-tu TA-hun LA-gi — `berlaku` = valid/in effect (ber- + `laku`); `masih … lagi` = still … more.",
          "VN-speaker trap: saying `paspor masih bagus` for 'still valid'. The right term is `masih berlaku` (still in effect).",
          "Drill: `Paspor saya masih berlaku satu tahun lagi.`",
        ],
      },
      // ── Extending / renewing ─────────────────────────────────────────────
      {
        en: "Saya ingin memperpanjang izin tinggal saya.",
        vi: "Tôi muốn gia hạn giấy phép cư trú.",
        pronunciation_focus: [
          "SA-ya I-ngin mem-per-PAN-jang I-zin TING-gal SA-ya — `memperpanjang` = gia hạn (meN- + per- + `panjang`); `izin tinggal` = giấy phép cư trú.",
          "Lỗi người Việt: lẫn động từ `memperpanjang` (gia hạn) với danh từ `perpanjangan` (sự gia hạn). Bạn LÀM thì dùng `memperpanjang`.",
          "Luyện: `Saya ingin memperpanjang izin tinggal saya.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin mem-per-PAN-jang EE-zin TING-gal SA-ya — `memperpanjang` = to extend (meN- + per- + `panjang`); `izin tinggal` = stay permit.",
          "VN-speaker trap: confusing the verb `memperpanjang` (to extend) with the noun `perpanjangan` (an extension). The ACTION is `memperpanjang`.",
          "Drill: `Saya ingin memperpanjang izin tinggal saya.`",
        ],
      },
      {
        en: "Berapa lama proses perpanjangannya?",
        vi: "Quá trình gia hạn mất bao lâu ạ?",
        pronunciation_focus: [
          "be-RA-pa LA-ma PRO-ses per-pan-JA-ngan-nya — `proses` = quá trình; `perpanjangan` = sự gia hạn (DANH TỪ, per-…-an); `-nya` = của nó.",
          "Lỗi người Việt: dùng động từ `memperpanjang` ở chỗ cần danh từ — ❌ `proses memperpanjang` → ✓ `proses perpanjangan`.",
          "Luyện: `Berapa lama proses perpanjangannya?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa LA-ma PRO-ses per-pan-JA-ngan-nya — `proses` = process; `perpanjangan` = an extension (the NOUN, per-…-an); `-nya` = its.",
          "VN-speaker trap: using the verb `memperpanjang` where a noun is needed — ❌ `proses memperpanjang` → ✓ `proses perpanjangan`.",
          "Drill: `Berapa lama proses perpanjangannya?`",
        ],
      },
      {
        en: "Setelah lima tahun, saya bisa mengajukan KITAP.",
        vi: "Sau năm năm, tôi có thể xin KITAP.",
        pronunciation_focus: [
          "se-te-LAH LI-ma TA-hun, SA-ya BI-sa me-nga-JU-kan KEE-tap — `mengajukan` = đệ trình/nộp đơn xin (meN- + `aju` + -kan); `KITAP` = thẻ cư trú dài hạn.",
          "Lỗi người Việt: lẫn `KITAS` (tạm trú) với `KITAP` (định cư/lâu dài). `-S` = Sementara (tạm), `-P` = Permanen-tetap (lâu dài).",
          "Luyện: `Saya bisa mengajukan KITAP.`",
        ],
        pronunciation_focus_en: [
          "se-te-LAH LI-ma TA-hun, SA-ya BI-sa me-nga-JU-kan KEE-tap — `mengajukan` = to submit/apply for (meN- + `aju` + -kan); `KITAP` = the long-stay permit.",
          "VN-speaker trap: confusing `KITAS` (temporary) with `KITAP` (permanent). `-S` = Sementara (temporary), `-P` = Permanen (permanent).",
          "Drill: `Saya bisa mengajukan KITAP.`",
        ],
      },
      // ── Using an agent ───────────────────────────────────────────────────
      {
        en: "Saya memakai jasa agen untuk mengurus visa.",
        vi: "Tôi dùng dịch vụ của đại lý để lo visa.",
        pronunciation_focus: [
          "SA-ya me-MA-kai JA-sa A-gen UN-tuk me-ngu-RUS VI-sa — `memakai jasa` = dùng dịch vụ; `agen` = đại lý/môi giới (đọc 'A-gen', `g` cứng).",
          "Lỗi người Việt: đọc `agen` như tiếng Anh 'ay-jent'. Tiếng Indonesia đọc 'A-gen', `g` cứng (như 'gà').",
          "Luyện: `Saya memakai jasa agen untuk mengurus visa.`",
        ],
        pronunciation_focus_en: [
          "SA-ya me-MA-kai JA-sa A-gen UN-tuk me-ngu-RUS VEE-sa — `memakai jasa` = to use the services of; `agen` = agent/broker (said 'A-gen', hard `g`).",
          "VN-speaker trap: pronouncing `agen` the English way 'ay-jent'. Indonesian says 'A-gen', hard `g` as in 'go'.",
          "Drill: `Saya memakai jasa agen untuk mengurus visa.`",
        ],
      },
      {
        en: "Berapa biaya untuk mengurus IMTA?",
        vi: "Phí làm IMTA là bao nhiêu ạ?",
        pronunciation_focus: [
          "be-RA-pa BI-a-ya UN-tuk me-ngu-RUS i-em-te-A — `biaya` = chi phí; `IMTA` đọc TỪNG CHỮ 'i-em-te-a' (giấy phép sử dụng lao động nước ngoài).",
          "Lỗi người Việt: đọc `IMTA` như một từ 'im-ta'. Viết tắt này đánh vần: 'i-em-te-a'.",
          "Luyện: `Berapa biaya untuk mengurus IMTA?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa BI-a-ya UN-tuk me-ngu-RUS i-em-te-A — `biaya` = cost/fee; spell `IMTA` LETTER-BY-LETTER 'i-em-te-a' (the foreign-worker employment permit).",
          "VN-speaker trap: reading `IMTA` as one word 'im-ta'. This acronym is spelled out: 'i-em-te-a'.",
          "Drill: `Berapa biaya untuk mengurus IMTA?`",
        ],
      },
      // ── Problems: overstay, rejection, deportation ───────────────────────
      {
        en: "Saya tidak mau overstay dan kena denda.",
        vi: "Tôi không muốn quá hạn lưu trú và bị phạt.",
        pronunciation_focus: [
          "SA-ya TI-dak MAU O-ver-stay dan KE-na DEN-da — `overstay` (mượn tiếng Anh) = ở quá hạn; `kena denda` = bị phạt tiền.",
          "Lỗi người Việt: nói `bayar denda` cho 'bị phạt'. `kena denda` = bị dính phạt (ngoài ý muốn); `bayar denda` = trả tiền phạt.",
          "Luyện: `Saya tidak mau overstay dan kena denda.`",
        ],
        pronunciation_focus_en: [
          "SA-ya TI-dak MAU O-ver-stay dan KE-na DEN-da — `overstay` (English loan) = staying past the limit; `kena denda` = to get fined.",
          "VN-speaker trap: saying `bayar denda` for 'get fined'. `kena denda` = to be hit with a fine; `bayar denda` = to pay the fine.",
          "Drill: `Saya tidak mau overstay dan kena denda.`",
        ],
      },
      {
        en: "Permohonan visa saya ditolak bulan lalu.",
        vi: "Đơn xin visa của tôi bị từ chối tháng trước.",
        pronunciation_focus: [
          "per-mo-HO-nan VI-sa SA-ya di-TO-lak BU-lan LA-lu — `permohonan` = đơn xin (per-…-an từ `mohon`); `ditolak` = bị từ chối (bị động `di-`).",
          "Lỗi người Việt: dùng `tidak` cho 'bị từ chối' — ❌ `visa tidak terima` → ✓ `visa ditolak` (bị từ chối) / `disetujui` (được duyệt).",
          "Luyện: `Permohonan visa saya ditolak bulan lalu.`",
        ],
        pronunciation_focus_en: [
          "per-mo-HO-nan VEE-sa SA-ya di-TO-lak BU-lan LA-lu — `permohonan` = application (per-…-an from `mohon`); `ditolak` = was rejected (passive `di-`).",
          "VN-speaker trap: using `tidak` for 'was rejected' — ❌ `visa tidak terima` → ✓ `visa ditolak` (rejected) / `disetujui` (approved).",
          "Drill: `Permohonan visa saya ditolak bulan lalu.`",
        ],
      },
      {
        en: "Kalau overstay terlalu lama, bisa dideportasi.",
        vi: "Nếu quá hạn quá lâu, có thể bị trục xuất.",
        pronunciation_focus: [
          "ka-LAU O-ver-stay ter-LA-lu LA-ma, BI-sa di-de-por-TA-si — `kalau` = nếu; `terlalu` = quá; `dideportasi` = bị trục xuất (bị động `di-`).",
          "Lỗi người Việt: né câu điều kiện + bị động. Cấu trúc `Kalau …, bisa di-…` rất hay gặp trên cảnh báo hành chính.",
          "Luyện: `Kalau overstay terlalu lama, bisa dideportasi.`",
        ],
        pronunciation_focus_en: [
          "ka-LAU O-ver-stay ter-LA-lu LA-ma, BI-sa di-de-por-TA-si — `kalau` = if; `terlalu` = too (excessive); `dideportasi` = to be deported (passive `di-`).",
          "VN-speaker trap: avoiding the conditional + passive. The pattern `Kalau …, bisa di-…` is common on official warnings.",
          "Drill: `Kalau overstay terlalu lama, bisa dideportasi.`",
        ],
      },
      // ── At the immigration office ────────────────────────────────────────
      {
        en: "Permisi, di mana loket imigrasi?",
        vi: "Xin lỗi, quầy xuất nhập cảnh ở đâu ạ?",
        pronunciation_focus: [
          "per-MI-si, di MA-na LO-ket i-mi-GRA-si — `loket` = quầy/ô cửa giao dịch; `imigrasi` = (cục) xuất nhập cảnh.",
          "Lỗi người Việt: dùng `meja` (bàn) cho 'quầy giao dịch'. Quầy ở văn phòng hành chính là `loket`.",
          "Luyện: `Permisi, di mana loket imigrasi?`",
        ],
        pronunciation_focus_en: [
          "per-MEE-si, di MA-na LO-ket i-mi-GRA-si — `loket` = service counter/window; `imigrasi` = immigration (office).",
          "VN-speaker trap: using `meja` (table) for a 'service counter'. The counter at a government office is `loket`.",
          "Drill: `Permisi, di mana loket imigrasi?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Giấy tờ nhập cư Indonesia (cơ quan quản lý là `Imigrasi`, dưới `Kemenkumham`): `KITAS` (Kartu Izin Tinggal Terbatas — thẻ tạm trú có thời hạn, đọc như một từ 'KEE-tas') là thứ người nước ngoài đi làm cần đầu tiên, thường gắn với một `sponsor` (công ty bảo lãnh). Người lao động nước ngoài còn cần `IMTA`/`RPTKA` (giấy phép sử dụng lao động — đọc từng chữ 'i-em-te-a'). Sau khi giữ `KITAS` đủ lâu (thường ~5 năm liên tục) có thể `mengajukan` (nộp xin) `KITAP` (Kartu Izin Tinggal Tetap — thẻ định cư lâu dài). Nhiều người thuê `agen` (đại lý) lo thủ tục cho nhanh. Cảnh báo lớn: `overstay` (ở quá hạn) bị `denda` (phạt tiền) theo NGÀY, và nếu quá lâu có thể bị `deportasi` (trục xuất) kèm cấm nhập cảnh. Luôn kiểm tra `paspor masih berlaku` (hộ chiếu còn hạn) và gia hạn (`perpanjangan`) TRƯỚC khi hết hạn. Tại văn phòng, xếp hàng theo `loket` (quầy) và lấy số; mang đủ bản gốc + bản photo. Xưng hô lịch sự `Pak`/`Bu` với cán bộ.",
    cultural_notes_en:
      "Indonesian immigration papers (the agency is `Imigrasi`, under `Kemenkumham`): `KITAS` (Kartu Izin Tinggal Terbatas — a limited-stay permit card, said as one word 'KEE-tas') is what a foreign worker needs first, normally tied to a `sponsor` (the sponsoring company). Foreign workers also need an `IMTA`/`RPTKA` (work permit — spelled 'i-em-te-a'). After holding a `KITAS` long enough (typically ~5 continuous years) you can `mengajukan` (submit for) a `KITAP` (Kartu Izin Tinggal Tetap — the permanent-stay card). Many people hire an `agen` (agent) to speed up the paperwork. Big warning: an `overstay` incurs a `denda` (fine) per DAY, and if it drags on you can be `deportasi` (deported) with a re-entry ban. Always check `paspor masih berlaku` (passport still valid) and do the `perpanjangan` (renewal) BEFORE it expires. At the office, queue by `loket` (counter) and take a number; bring originals plus photocopies. Address officers politely as `Pak`/`Bu`.",
    tip_advice_vi:
      "Học thuộc 'bộ khung nhập cư' bốn câu: (1) mục đích — `Saya mau mengurus KITAS untuk bekerja.`; (2) hỏi giấy tờ — `Apa saja dokumen yang diperlukan?`; (3) gia hạn — `Saya ingin memperpanjang izin tinggal.`; (4) chi phí/thời gian — `Berapa biaya/lama prosesnya?`. Nhớ ba điểm hay sai với người Việt: phân biệt `KITAS` (tạm) ≠ `KITAP` (lâu dài) và đọc `IMTA` từng chữ; tách `memperpanjang` (động từ, gia hạn) khỏi `perpanjangan` (danh từ, sự gia hạn); và làm chủ câu bị động `di-` đầy trên giấy tờ (`diperlukan`, `ditolak`, `disetujui`, `dideportasi`). Giữ giọng phẳng, không thanh điệu; `c` đọc 'ch', `g` cứng (`agen`).",
    tip_advice_en:
      "Memorize the four-line immigration frame: (1) purpose — `Saya mau mengurus KITAS untuk bekerja.`; (2) ask for documents — `Apa saja dokumen yang diperlukan?`; (3) renew — `Saya ingin memperpanjang izin tinggal.`; (4) cost/time — `Berapa biaya/lama prosesnya?`. Keep three VN-speaker pitfalls straight: tell `KITAS` (temporary) from `KITAP` (permanent) and spell `IMTA` letter-by-letter; separate `memperpanjang` (verb, to extend) from `perpanjangan` (noun, an extension); and master the passive `di-` that fills official forms (`diperlukan`, `ditolak`, `disetujui`, `dideportasi`). Keep your pitch flat — no tones; `c` is 'ch', `g` is hard (`agen`).",
    vocabulary: [
      // Core documents
      {
        word: "KITAS",
        en: "limited-stay permit card",
        vi: "thẻ tạm trú có thời hạn",
        pos: "noun (acronym)",
        pronunciation_vi: "KEE-tas — đọc như một từ; `-S` = Sementara (tạm)",
        pronunciation_en: "KEE-tas — said as a word; `-S` = Sementara (temporary)",
      },
      {
        word: "KITAP",
        en: "permanent-stay permit card",
        vi: "thẻ định cư lâu dài",
        pos: "noun (acronym)",
        pronunciation_vi: "KEE-tap — đọc như một từ; `-P` = Permanen (lâu dài); xin sau ~5 năm",
        pronunciation_en: "KEE-tap — said as a word; `-P` = Permanen; apply after ~5 years",
      },
      {
        word: "IMTA",
        en: "foreign-worker employment permit",
        vi: "giấy phép sử dụng lao động nước ngoài",
        pos: "noun (acronym)",
        pronunciation_vi: "i-em-te-A — đọc từng chữ; đi kèm `RPTKA`",
        pronunciation_en: "i-em-te-A — spell each letter; paired with `RPTKA`",
      },
      {
        word: "paspor",
        en: "passport",
        vi: "hộ chiếu",
        pos: "noun",
        pronunciation_vi: "PAS-por — `masih berlaku` = còn hạn; `habis masa berlaku` = hết hạn",
        pronunciation_en: "PAS-por — `masih berlaku` = still valid; `habis masa berlaku` = expired",
      },
      {
        word: "izin tinggal",
        en: "stay permit",
        vi: "giấy phép cư trú",
        pos: "noun",
        pronunciation_vi: "I-zin TING-gal — `izin` = phép, `tinggal` = ở/cư trú",
        pronunciation_en: "EE-zin TING-gal — `izin` = permit, `tinggal` = to reside",
      },
      // People & process
      {
        word: "sponsor",
        en: "sponsor (the sponsoring party)",
        vi: "bên bảo lãnh",
        pos: "noun",
        pronunciation_vi: "SPON-sor — thường là công ty thuê bạn; KHÁC 'nhà tài trợ'",
        pronunciation_en: "SPON-sor — usually the company that hires you; not a 'donor'",
      },
      {
        word: "agen",
        en: "agent / broker",
        vi: "đại lý / môi giới",
        pos: "noun",
        pronunciation_vi: "A-gen — `g` cứng; `jasa agen` = dịch vụ đại lý",
        pronunciation_en: "A-gen — hard `g`; `jasa agen` = agent services",
      },
      {
        word: "mengurus",
        en: "to handle / process (paperwork)",
        vi: "lo / làm thủ tục",
        pos: "verb",
        pronunciation_vi: "me-ngu-RUS — meN- + `urus`; `mengurus visa` = lo visa",
        pronunciation_en: "me-ngu-RUS — meN- + `urus`; `mengurus visa` = to process a visa",
      },
      {
        word: "memperpanjang",
        en: "to extend / renew (verb)",
        vi: "gia hạn (động từ)",
        pos: "verb",
        pronunciation_vi: "mem-per-PAN-jang — động từ; khác danh từ `perpanjangan`",
        pronunciation_en: "mem-per-PAN-jang — the verb; not the noun `perpanjangan`",
      },
      {
        word: "perpanjangan",
        en: "extension / renewal (noun)",
        vi: "sự gia hạn (danh từ)",
        pos: "noun",
        pronunciation_vi: "per-pan-JA-ngan — per-…-an; `proses perpanjangan` = quá trình gia hạn",
        pronunciation_en: "per-pan-JA-ngan — per-…-an; `proses perpanjangan` = renewal process",
      },
      // Problems
      {
        word: "overstay",
        en: "overstay (past the permit limit)",
        vi: "ở quá hạn lưu trú",
        pos: "noun / verb",
        pronunciation_vi: "O-ver-stay — mượn tiếng Anh; bị `denda` theo ngày",
        pronunciation_en: "O-ver-stay — English loan; fined (`denda`) per day",
      },
      {
        word: "denda",
        en: "fine / penalty",
        vi: "tiền phạt",
        pos: "noun",
        pronunciation_vi: "DEN-da — `kena denda` = bị phạt; `bayar denda` = trả tiền phạt",
        pronunciation_en: "DEN-da — `kena denda` = to get fined; `bayar denda` = to pay the fine",
      },
      {
        word: "ditolak",
        en: "rejected (passive)",
        vi: "bị từ chối",
        pos: "verb",
        pronunciation_vi: "di-TO-lak — bị động `di-`; trái nghĩa `disetujui` (được duyệt)",
        pronunciation_en: "di-TO-lak — passive `di-`; opposite `disetujui` (approved)",
      },
      {
        word: "deportasi",
        en: "deportation",
        vi: "trục xuất",
        pos: "noun",
        pronunciation_vi: "de-por-TA-si — động từ bị động `dideportasi` = bị trục xuất",
        pronunciation_en: "de-por-TA-si — passive verb `dideportasi` = to be deported",
      },
      {
        word: "imigrasi",
        en: "immigration (office/authority)",
        vi: "(cục) xuất nhập cảnh",
        pos: "noun",
        pronunciation_vi: "i-mi-GRA-si — đến `loket imigrasi` (quầy giao dịch)",
        pronunciation_en: "i-mi-GRA-si — go to the `loket imigrasi` (service counter)",
      },
    ],
    dialogue: [
      // Dialogue: at the immigration counter
      {
        speaker: "Petugas",
        text: "Selamat pagi. Ada yang bisa saya bantu?",
        vi: "Chào buổi sáng. Tôi có thể giúp gì ạ?",
        en: "Good morning. How can I help you?",
      },
      {
        speaker: "Pemohon",
        text: "Selamat pagi, Pak. Saya mau mengurus perpanjangan KITAS saya.",
        vi: "Chào buổi sáng. Tôi muốn làm thủ tục gia hạn KITAS.",
        en: "Good morning, sir. I'd like to process the renewal of my KITAS.",
      },
      {
        speaker: "Petugas",
        text: "Baik. Apakah paspor Anda masih berlaku? Siapa sponsor Anda?",
        vi: "Được. Hộ chiếu của anh còn hạn không? Ai là người bảo lãnh?",
        en: "Okay. Is your passport still valid? Who is your sponsor?",
      },
      {
        speaker: "Pemohon",
        text: "Masih berlaku dua tahun lagi. Perusahaan saya menjadi sponsor saya.",
        vi: "Còn hạn hai năm nữa. Công ty tôi là người bảo lãnh.",
        en: "It's valid for two more years. My company is my sponsor.",
      },
      {
        speaker: "Petugas",
        text: "Bagus. Ini dokumen yang diperlukan. Prosesnya sekitar dua minggu.",
        vi: "Tốt. Đây là giấy tờ cần nộp. Quá trình mất khoảng hai tuần.",
        en: "Good. Here are the required documents. The process takes about two weeks.",
      },
      {
        speaker: "Pemohon",
        text: "Terima kasih. Saya tidak mau overstay dan kena denda.",
        vi: "Cảm ơn. Tôi không muốn quá hạn rồi bị phạt.",
        en: "Thank you. I don't want to overstay and get fined.",
      },
      {
        speaker: "Petugas",
        text: "Tepat. Urus sebelum habis masa berlaku, ya. Semoga lancar.",
        vi: "Chính xác. Hãy lo trước khi hết hạn nhé. Chúc thuận lợi.",
        en: "Exactly. Sort it out before it expires. Good luck.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn làm thủ tục KITAS để đi làm.", answer: "Saya mau mengurus KITAS untuk bekerja." },
          { prompt: "Cần những giấy tờ gì ạ?", answer: "Apa saja dokumen yang diperlukan?" },
          { prompt: "Tôi muốn gia hạn giấy phép cư trú.", answer: "Saya ingin memperpanjang izin tinggal saya." },
          { prompt: "Hộ chiếu của tôi còn hạn một năm nữa.", answer: "Paspor saya masih berlaku satu tahun lagi." },
          { prompt: "Công ty tôi là người bảo lãnh.", answer: "Perusahaan saya menjadi sponsor saya." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành tình huống rắc rối — dịch sang tiếng Indonesia:",
        instruction_en: "Problem-scenario practice — translate into Indonesian:",
        items: [
          { prompt: "Tôi không muốn quá hạn và bị phạt.", answer: "Saya tidak mau overstay dan kena denda." },
          { prompt: "Đơn xin visa của tôi bị từ chối tháng trước.", answer: "Permohonan visa saya ditolak bulan lalu." },
          { prompt: "Nếu quá hạn quá lâu, có thể bị trục xuất.", answer: "Kalau overstay terlalu lama, bisa dideportasi." },
          { prompt: "Phí làm IMTA là bao nhiêu?", answer: "Berapa biaya untuk mengurus IMTA?" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn `KITAS`, `KITAP`, `memperpanjang`, hay `perpanjangan` cho đúng:",
        instruction_en:
          "Choose `KITAS`, `KITAP`, `memperpanjang`, or `perpanjangan` correctly:",
        items: [
          { prompt: "Pekerja asing baru butuh ___ dulu.", answer: "KITAS", hint: "thẻ tạm trú (Sementara)" },
          { prompt: "Setelah lima tahun, bisa ajukan ___.", answer: "KITAP", hint: "thẻ định cư (Permanen)" },
          { prompt: "Saya mau ___ izin tinggal. (động từ)", answer: "memperpanjang", hint: "hành động gia hạn" },
          { prompt: "Proses ___ butuh dua minggu. (danh từ)", answer: "perpanjangan", hint: "sự gia hạn" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung trình bày ở quầy imigrasi — điền chỗ trống: `Saya mau mengurus ___. Paspor saya masih ___. Sponsor saya adalah ___. Apa saja dokumen yang ___?`",
        instruction_en:
          "Immigration-counter frame — fill the blanks: `Saya mau mengurus ___. Paspor saya masih ___. Sponsor saya adalah ___. Apa saja dokumen yang ___?`",
        example:
          "Saya mau mengurus perpanjangan KITAS. Paspor saya masih berlaku. Sponsor saya adalah perusahaan saya. Apa saja dokumen yang diperlukan?",
        example_vi:
          "Tôi muốn làm thủ tục gia hạn KITAS. Hộ chiếu tôi còn hạn. Người bảo lãnh là công ty của tôi. Cần những giấy tờ gì?",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra thủ tục nhập cư — bạn làm được chưa?",
        instruction_en: "Immigration self-check — can you do each one?",
        items: [
          { vi: "Tôi phân biệt được KITAS (tạm) và KITAP (lâu dài).", en: "I can tell KITAS (temporary) from KITAP (permanent)." },
          { vi: "Tôi đọc IMTA từng chữ ('i-em-te-a') và KITAS như một từ.", en: "I spell IMTA ('i-em-te-a') and say KITAS as a word." },
          { vi: "Tôi phân biệt `memperpanjang` (động từ) và `perpanjangan` (danh từ).", en: "I distinguish `memperpanjang` (verb) from `perpanjangan` (noun)." },
          { vi: "Tôi hiểu câu bị động `di-` trên giấy tờ (ditolak, diperlukan, dideportasi).", en: "I understand the passive `di-` on forms (ditolak, diperlukan, dideportasi)." },
          { vi: "Tôi biết hỏi chi phí và thời gian xử lý.", en: "I can ask about the cost and processing time." },
          { vi: "Tôi biết kiểm tra hộ chiếu `masih berlaku` và gia hạn trước hạn.", en: "I know to check the passport is `masih berlaku` and renew before expiry." },
        ],
      },
    ],
  },
];

export default lessons;
