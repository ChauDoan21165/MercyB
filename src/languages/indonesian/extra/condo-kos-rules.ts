// Boarding-House (Kos) Rules Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (construction-worker, healthcare-emergency,
// restaurant-hospitality, school-education, phone-calls, public-services,
// apartment-neighbors, reduplication, javanese-influence), which in turn mirror the
// French `FrenchLesson` shape. When the shared Indonesian registry
// (src/languages/indonesian/lessons.ts) lands, swap the local types for a shared
// import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// TOPIC — kos (boarding-house) rules: a `kos`/`kosan`/`indekos` is a rented room,
// usually run by an `ibu kos`/`bapak kos`. The lesson covers asking about rules
// (`aturan`), curfew (`jam malam`), guests (`tamu`), the deposit (`deposit`/`uang
// jaminan`), paying rent (`bayar kos`), and moving out (`pindah kos`). Grammar traps
// for Vietnamese speakers: the soft-command frame `tolong`/`mohon`/`jangan`, the
// `boleh`/`tidak boleh` (may / may not = permission) vs `bisa`/`tidak bisa` (can /
// cannot = ability) distinction, and released word-final consonants (`kos`, `jemput`,
// `kontrak`).

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
    id: "indonesian_condo_kos_rules",
    level: "A2",
    category: "housing",
    title_vi: "Nội quy nhà trọ (kos)",
    title_en: "Boarding-house (kos) rules",
    sentences: [
      // ── Asking about the room & price ─────────────────────────────────────
      {
        en: "Permisi, Bu, kamar kosnya masih ada yang kosong?",
        vi: "Xin lỗi cô, phòng trọ còn phòng nào trống không ạ?",
        pronunciation_focus: [
          "per-MI-si, bu, KA-mar KOS-nya MA-sih A-da yang KO-song — `kamar kos` = phòng trọ; `kosong` = trống.",
          "Lợi thế người Việt: không mạo từ, không chia động từ — `kamar masih ada` ghép thẳng.",
          "Lỗi người Việt: nuốt `s` cuối `kos`. Bật rõ: 'kos', đừng thành 'ko'.",
          "Luyện: `Kamar kosnya masih ada yang kosong?`",
        ],
        pronunciation_focus_en: [
          "per-MI-si, bu, KA-mar KOS-nya MA-sih A-da yang KO-song — `kamar kos` = boarding room; `kosong` = empty/vacant.",
          "VN-speaker win: no articles, no conjugation — `kamar masih ada` stacks straight.",
          "VN-speaker trap: swallowing the final `s` in `kos`. Sound it: 'kos', not 'ko'.",
          "Drill: `Kamar kosnya masih ada yang kosong?`",
        ],
      },
      {
        en: "Sewa per bulan berapa, dan sudah termasuk listrik?",
        vi: "Thuê mỗi tháng bao nhiêu, và đã bao gồm tiền điện chưa ạ?",
        pronunciation_focus: [
          "SE-wa per BU-lan be-RA-pa, dan SU-dah ter-MA-suk LIS-trik — `sewa` = tiền thuê; `termasuk` = bao gồm.",
          "Mẹo: hỏi giá luôn dùng `berapa` (bao nhiêu), không phải `apa` (cái gì).",
          "Lỗi người Việt: hỏi `apa sewa` cho giá. Hỏi giá phải là `sewanya berapa`.",
          "Luyện: `Sewa per bulan berapa?`",
        ],
        pronunciation_focus_en: [
          "SE-wa per BU-lan be-RA-pa, dan SU-dah ter-MA-suk LIS-trik — `sewa` = rent; `termasuk` = included.",
          "Tip: always ask a price with `berapa` (how much), not `apa` (what).",
          "VN-speaker trap: asking `apa sewa` for a price. Use `sewanya berapa`.",
          "Drill: `Sewa per bulan berapa?`",
        ],
      },
      {
        en: "Apakah ada uang deposit atau uang jaminan?",
        vi: "Có tiền đặt cọc hay tiền bảo đảm không ạ?",
        pronunciation_focus: [
          "A-pa-kah A-da U-ang de-PO-sit A-tau U-ang ja-MI-nan — `deposit`/`uang jaminan` = tiền đặt cọc; `atau` = hay.",
          "Mẹo: `deposit` thường được trả lại khi dọn đi nếu phòng không hư hại — hỏi rõ điều kiện hoàn cọc.",
          "Lỗi người Việt: đọc `uang` thành 'oang' một âm. Hai âm: 'U-ang'.",
          "Luyện: `Ada uang deposit?`",
        ],
        pronunciation_focus_en: [
          "A-pa-kah A-da U-ang de-PO-sit A-tau U-ang ja-MI-nan — `deposit`/`uang jaminan` = security deposit; `atau` = or.",
          "Tip: the `deposit` is usually refunded on move-out if the room isn't damaged — ask the refund conditions.",
          "VN-speaker trap: saying `uang` as one syllable. It's two: 'U-ang'.",
          "Drill: `Ada uang deposit?`",
        ],
      },
      // ── House rules: curfew, guests, permission ───────────────────────────
      {
        en: "Aturan kosnya bagaimana, Bu? Ada jam malam?",
        vi: "Nội quy nhà trọ thế nào ạ cô? Có giờ giới nghiêm không?",
        pronunciation_focus: [
          "a-TU-ran KOS-nya ba-gai-MA-na, bu? A-da jam MA-lam — `aturan` = nội quy; `jam malam` = giờ giới nghiêm.",
          "Mẹo: `jam malam` (giờ giới nghiêm) là cổng khóa sau giờ nào đó (thường 22:00–23:00). Hỏi rõ ngay từ đầu.",
          "Lỗi người Việt: đọc `aturan` rời rạc. Đọc liền, nhấn TU: a-TU-ran.",
          "Luyện: `Aturan kosnya bagaimana?`",
        ],
        pronunciation_focus_en: [
          "a-TU-ran KOS-nya ba-gai-MA-na, bu? A-da jam MA-lam — `aturan` = rules; `jam malam` = curfew.",
          "Tip: `jam malam` (curfew) is when the gate locks after a set hour (often 10–11 pm). Ask up front.",
          "VN-speaker trap: chopping `aturan`. Say it smoothly, stress TU: a-TU-ran.",
          "Drill: `Aturan kosnya bagaimana?`",
        ],
      },
      {
        en: "Apakah saya boleh menerima tamu di kamar?",
        vi: "Tôi có được phép tiếp khách trong phòng không ạ?",
        pronunciation_focus: [
          "A-pa-kah SA-ya BO-leh me-ne-RI-ma TA-mu di KA-mar — `boleh` = được phép; `menerima tamu` = tiếp khách.",
          "Mẹo QUAN TRỌNG: `boleh` = ĐƯỢC PHÉP (xin phép), khác `bisa` = CÓ THỂ (khả năng). Hỏi luật lệ dùng `boleh`.",
          "Lỗi người Việt: hỏi `apakah saya bisa menerima tamu` (nghe như 'tôi có khả năng tiếp khách'). Xin phép phải dùng `boleh`.",
          "Luyện: `Apakah saya boleh menerima tamu?`",
        ],
        pronunciation_focus_en: [
          "A-pa-kah SA-ya BO-leh me-ne-RI-ma TA-mu di KA-mar — `boleh` = may/allowed; `menerima tamu` = to receive guests.",
          "KEY tip: `boleh` = MAY (permission), unlike `bisa` = CAN (ability). For rules, use `boleh`.",
          "VN-speaker trap: asking `apakah saya bisa menerima tamu` (sounds like 'am I able'). For permission use `boleh`.",
          "Drill: `Apakah saya boleh menerima tamu?`",
        ],
      },
      {
        en: "Maaf, tamu lawan jenis tidak boleh masuk kamar.",
        vi: "Xin lỗi, khách khác giới không được phép vào phòng.",
        pronunciation_focus: [
          "ma-AF, TA-mu LA-wan JE-nis TI-dak BO-leh MA-suk KA-mar — `tidak boleh` = không được phép; `lawan jenis` = khác giới.",
          "Mẹo: `tidak boleh` = CẤM (không được phép), khác `tidak bisa` (không thể). Luật cấm luôn dùng `tidak boleh`.",
          "Lỗi người Việt: nói `tidak bisa masuk` cho lệnh cấm. Cấm/không cho phép = `tidak boleh masuk`.",
          "Luyện: `Tamu lawan jenis tidak boleh masuk kamar.`",
        ],
        pronunciation_focus_en: [
          "ma-AF, TA-mu LA-wan JE-nis TI-dak BO-leh MA-suk KA-mar — `tidak boleh` = not allowed; `lawan jenis` = opposite sex.",
          "Tip: `tidak boleh` = FORBIDDEN (not allowed), unlike `tidak bisa` (cannot/unable). Bans use `tidak boleh`.",
          "VN-speaker trap: saying `tidak bisa masuk` for a ban. A ban = `tidak boleh masuk`.",
          "Drill: `Tamu lawan jenis tidak boleh masuk kamar.`",
        ],
      },
      {
        en: "Tolong jangan berisik setelah jam sepuluh malam.",
        vi: "Làm ơn đừng ồn ào sau mười giờ tối.",
        pronunciation_focus: [
          "TO-long JA-ngan be-RI-sik se-te-LAH jam se-PU-luh MA-lam — `tolong` = làm ơn; `jangan` = đừng; `berisik` = ồn.",
          "Mẹo: `jangan` (đừng) chỉ dùng cho MỆNH LỆNH phủ định, KHÁC `tidak` (không) phủ định sự việc.",
          "Lỗi người Việt: nói `tidak berisik` để bảo người khác im. Ngăn cấm phải dùng `jangan berisik`.",
          "Luyện: `Tolong jangan berisik malam-malam.`",
        ],
        pronunciation_focus_en: [
          "TO-long JA-ngan be-RI-sik se-te-LAH jam se-PU-luh MA-lam — `tolong` = please; `jangan` = don't; `berisik` = noisy.",
          "Tip: `jangan` (don't) is only for negative COMMANDS, unlike `tidak` (not) which negates facts.",
          "VN-speaker trap: saying `tidak berisik` to tell someone to be quiet. A prohibition uses `jangan berisik`.",
          "Drill: `Tolong jangan berisik malam-malam.`",
        ],
      },
      // ── Paying rent & facilities ──────────────────────────────────────────
      {
        en: "Bayar kos paling lambat tanggal berapa setiap bulan?",
        vi: "Trả tiền trọ chậm nhất là ngày mấy mỗi tháng ạ?",
        pronunciation_focus: [
          "BA-yar kos PA-ling LAM-bat TANG-gal be-RA-pa SE-ti-ap BU-lan — `bayar kos` = trả tiền trọ; `paling lambat` = chậm nhất.",
          "Mẹo: `tanggal berapa?` = ngày mấy (ngày trong tháng), khác `hari apa?` (thứ mấy). Hỏi hạn trả tiền dùng `tanggal`.",
          "Lỗi người Việt: hỏi `hari apa` cho ngày trong tháng. Ngày tháng dùng `tanggal berapa`.",
          "Luyện: `Bayar kos paling lambat tanggal berapa?`",
        ],
        pronunciation_focus_en: [
          "BA-yar kos PA-ling LAM-bat TANG-gal be-RA-pa SE-ti-ap BU-lan — `bayar kos` = pay rent; `paling lambat` = at the latest.",
          "Tip: `tanggal berapa?` = which date (of the month), unlike `hari apa?` (which day of the week). For a due date use `tanggal`.",
          "VN-speaker trap: asking `hari apa` for a calendar date. Dates use `tanggal berapa`.",
          "Drill: `Bayar kos paling lambat tanggal berapa?`",
        ],
      },
      {
        en: "Kamar mandinya di dalam atau di luar, ya?",
        vi: "Nhà tắm ở bên trong hay bên ngoài phòng vậy ạ?",
        pronunciation_focus: [
          "ka-mar MAN-di-nya di DA-lam A-tau di LU-ar, ya — `kamar mandi` = nhà tắm/nhà vệ sinh; `di dalam` ↔ `di luar`.",
          "Mẹo: `kamar mandi dalam` (trong phòng) đắt hơn `kamar mandi luar` (dùng chung). Hỏi rõ để so giá.",
          "Lỗi người Việt: lẫn `kamar` (phòng) với `kamar mandi` (nhà tắm). `kamar mandi` = phòng tắm.",
          "Luyện: `Kamar mandinya di dalam atau di luar?`",
        ],
        pronunciation_focus_en: [
          "ka-mar MAN-di-nya di DA-lam A-tau di LU-ar, ya — `kamar mandi` = bathroom; `di dalam` ↔ `di luar`.",
          "Tip: `kamar mandi dalam` (en-suite) costs more than `kamar mandi luar` (shared). Ask to compare prices.",
          "VN-speaker trap: confusing `kamar` (room) with `kamar mandi` (bathroom). `kamar mandi` = bathroom.",
          "Drill: `Kamar mandinya di dalam atau di luar?`",
        ],
      },
      // ── Moving out ────────────────────────────────────────────────────────
      {
        en: "Kalau mau pindah, harus lapor berapa hari sebelumnya?",
        vi: "Nếu muốn dọn đi, phải báo trước mấy ngày ạ?",
        pronunciation_focus: [
          "KA-lau MAU PIN-dah, HA-rus LA-por be-RA-pa HA-ri se-be-LUM-nya — `pindah` = dọn đi/chuyển; `lapor` = báo.",
          "Mẹo: `sebelumnya` = trước đó; nhiều kos yêu cầu báo trước 1 tháng (`sebulan sebelumnya`) để được hoàn cọc.",
          "Lỗi người Việt: nuốt `h` cuối `pindah`. Bật nhẹ: 'PIN-dah'.",
          "Luyện: `Kalau mau pindah, harus lapor berapa hari sebelumnya?`",
        ],
        pronunciation_focus_en: [
          "KA-lau MAU PIN-dah, HA-rus LA-por be-RA-pa HA-ri se-be-LUM-nya — `pindah` = to move out; `lapor` = to notify.",
          "Tip: `sebelumnya` = beforehand; many kos require one month's notice (`sebulan sebelumnya`) to get the deposit back.",
          "VN-speaker trap: dropping the final `h` in `pindah`. Lightly sound it: 'PIN-dah'.",
          "Drill: `Kalau mau pindah, harus lapor berapa hari sebelumnya?`",
        ],
      },
      {
        en: "Kalau kamarnya bersih, deposit dikembalikan penuh, kan?",
        vi: "Nếu phòng sạch sẽ thì tiền cọc được trả lại đầy đủ, phải không ạ?",
        pronunciation_focus: [
          "KA-lau ka-mar-nya ber-SIH, de-PO-sit di-kem-ba-LI-kan pe-NUH, kan — `dikembalikan` = được trả lại (bị động); `penuh` = đầy đủ.",
          "Mẹo: thể bị động `di-` rất phổ biến: `dikembalikan` (được trả lại). `kan?` cuối câu = 'phải không?' (xác nhận).",
          "Lỗi người Việt: né thể bị động `di-`. Trong giao tiếp đời thường nó rất hay gặp, nên làm quen.",
          "Luyện: `Deposit dikembalikan penuh, kan?`",
        ],
        pronunciation_focus_en: [
          "KA-lau ka-mar-nya ber-SIH, de-PO-sit di-kem-ba-LI-kan pe-NUH, kan — `dikembalikan` = is returned (passive); `penuh` = in full.",
          "Tip: the `di-` passive is common: `dikembalikan` (be returned). Sentence-final `kan?` = 'right?' (confirmation).",
          "VN-speaker trap: avoiding the `di-` passive. It's very common in everyday speech — get used to it.",
          "Drill: `Deposit dikembalikan penuh, kan?`",
        ],
      },
    ],
    vocabulary: [
      // The kos itself & the people
      {
        cell_id: "f3113a1a-9206-4562-953b-6994e253fcba",
        word: "kos / kosan / indekos",
        en: "boarding house / rented room",
        vi: "nhà trọ / phòng trọ",
        pos: "noun",
        pronunciation_vi: "kos / KOS-an / in-de-KOS — bật `s` cuối; `ngekos` = ở trọ (khẩu ngữ)",
        pronunciation_en: "kos / KOS-an / in-de-KOS — sound the final `s`; `ngekos` = to live in a kos (casual)",
      },
      {
        cell_id: "097588a7-f15b-4642-aa13-5d546e6fcbed",
        word: "ibu kos / bapak kos",
        en: "the (female/male) boarding-house owner",
        vi: "bà chủ / ông chủ nhà trọ",
        pos: "noun",
        pronunciation_vi: "I-bu kos / BA-pak kos — gọi tắt `bu kos`/`pak kos`; thường sống ngay tại nhà",
        pronunciation_en: "I-bu kos / BA-pak kos — short `bu kos`/`pak kos`; often lives on-site",
      },
      {
        cell_id: "3e5e254c-540a-4c23-a6fa-5a4048151300",
        word: "penghuni",
        en: "occupant / tenant",
        vi: "người ở trọ",
        pos: "noun",
        pronunciation_vi: "peng-HU-ni — `penghuni kos` = người thuê trọ; gốc `huni` (ở)",
        pronunciation_en: "peng-HU-ni — `penghuni kos` = a kos tenant; root `huni` (to dwell)",
      },
      {
        cell_id: "c7ad3dac-3f34-4a8a-94aa-d8c07a14907e",
        word: "kamar",
        en: "room",
        vi: "phòng",
        pos: "noun",
        pronunciation_vi: "KA-mar — `kamar kosong` = phòng trống; khác `kamar mandi` (nhà tắm)",
        pronunciation_en: "KA-mar — `kamar kosong` = a vacant room; distinct from `kamar mandi` (bathroom)",
      },
      // Money
      {
        cell_id: "937b0f8c-e36e-4bcb-9d21-0703220d0952",
        word: "sewa",
        en: "rent",
        vi: "tiền thuê",
        pos: "noun/verb",
        pronunciation_vi: "SE-wa — `sewa bulanan` = thuê theo tháng; `menyewa` = đi thuê",
        pronunciation_en: "SE-wa — `sewa bulanan` = monthly rent; `menyewa` = to rent",
      },
      {
        cell_id: "da8e9234-e3de-4f56-84e8-50fb927bb244",
        word: "deposit / uang jaminan",
        en: "security deposit",
        vi: "tiền đặt cọc / tiền bảo đảm",
        pos: "noun",
        pronunciation_vi: "de-PO-sit / U-ang ja-MI-nan — hoàn lại khi dọn đi nếu không hư hại",
        pronunciation_en: "de-PO-sit / U-ang ja-MI-nan — refunded on move-out if undamaged",
      },
      {
        cell_id: "cfe0a263-0e86-4301-aba6-20b775666d03",
        word: "uang muka / DP",
        en: "down payment / advance",
        vi: "tiền đặt trước",
        pos: "noun",
        pronunciation_vi: "U-ang MU-ka / de-pe — `DP` đọc 'de-pe'; trả trước để giữ phòng",
        pronunciation_en: "U-ang MU-ka / de-pe — `DP` spelled 'de-pe'; paid up front to hold the room",
      },
      {
        cell_id: "13e0336a-081c-4596-95ac-cccfb9ba7f16",
        word: "iuran listrik",
        en: "electricity charge",
        vi: "phí điện",
        pos: "noun",
        pronunciation_vi: "I-u-ran LIS-trik — hỏi `sudah termasuk?` (đã bao gồm chưa) khi xem phòng",
        pronunciation_en: "I-u-ran LIS-trik — ask `sudah termasuk?` (is it included) when viewing",
      },
      // Rules
      {
        cell_id: "96cd0d1c-28b0-4ef6-b5c7-5418bb653927",
        word: "aturan",
        en: "rules / regulations",
        vi: "nội quy",
        pos: "noun",
        pronunciation_vi: "a-TU-ran — `aturan kos` = nội quy nhà trọ; gốc `atur` (sắp xếp)",
        pronunciation_en: "a-TU-ran — `aturan kos` = boarding-house rules; root `atur` (to arrange)",
      },
      {
        cell_id: "cafa700a-bfe2-434e-be2e-7d50f6ad8e9b",
        word: "jam malam",
        en: "curfew",
        vi: "giờ giới nghiêm",
        pos: "noun",
        pronunciation_vi: "jam MA-lam — cổng khóa sau giờ này; thường 22:00–23:00",
        pronunciation_en: "jam MA-lam — gate locks after this hour; usually 10–11 pm",
      },
      {
        cell_id: "d75c4052-de72-434a-bbdc-57aae9b15fa1",
        word: "tamu",
        en: "guest / visitor",
        vi: "khách",
        pos: "noun",
        pronunciation_vi: "TA-mu — `tamu menginap` = khách ở qua đêm; `lawan jenis` = khác giới",
        pronunciation_en: "TA-mu — `tamu menginap` = an overnight guest; `lawan jenis` = opposite sex",
      },
      {
        cell_id: "d89c6dac-5513-4827-981c-c2c68d36f755",
        word: "boleh / tidak boleh",
        en: "may / may not (permission)",
        vi: "được phép / không được phép",
        pos: "modal",
        pronunciation_vi: "BO-leh / TI-dak BO-leh — XIN PHÉP, khác `bisa` (khả năng)",
        pronunciation_en: "BO-leh / TI-dak BO-leh — PERMISSION, unlike `bisa` (ability)",
      },
      {
        cell_id: "4365d700-d8c2-4ec8-af51-08c5b041a99e",
        word: "putri / putra / campur",
        en: "women's / men's / mixed (kos type)",
        vi: "nữ / nam / chung",
        pos: "adj.",
        pronunciation_vi: "PU-tri / PU-tra / CAM-pur — `kos putri` = trọ nữ; `c` đọc 'ch': 'CHAM-pur'",
        pronunciation_en: "PU-tri / PU-tra / CHAM-pur — `kos putri` = women-only kos; `c` is 'ch'",
      },
      // Facilities & actions
      {
        cell_id: "89d3a5dc-634e-4081-98a5-f45b904d4189",
        word: "kamar mandi",
        en: "bathroom",
        vi: "nhà tắm / nhà vệ sinh",
        pos: "noun",
        pronunciation_vi: "ka-mar MAN-di — `dalam` (trong phòng) ↔ `luar` (dùng chung)",
        pronunciation_en: "ka-mar MAN-di — `dalam` (en-suite) ↔ `luar` (shared)",
      },
      {
        cell_id: "cca0c9d3-1fbb-4b9a-ba53-55b0e0fa64f8",
        word: "dapur bersama",
        en: "shared kitchen",
        vi: "bếp chung",
        pos: "noun",
        pronunciation_vi: "DA-pur ber-SA-ma — `bersama` = chung; nhiều kos có bếp chung",
        pronunciation_en: "DA-pur ber-SA-ma — `bersama` = shared; many kos have a common kitchen",
      },
      {
        cell_id: "1d61ee8d-3b2c-43be-bb3d-20dd8310607f",
        word: "pindah kos",
        en: "to move out / change boarding house",
        vi: "chuyển trọ / dọn đi",
        pos: "verb phrase",
        pronunciation_vi: "PIN-dah kos — bật `h`; báo trước (`lapor sebelumnya`) để lấy lại cọc",
        pronunciation_en: "PIN-dah kos — sound the `h`; give notice (`lapor sebelumnya`) to reclaim the deposit",
      },
      {
        cell_id: "403fc775-bb98-4bbf-9e26-230c6391b69f",
        word: "lapor",
        en: "to report / give notice",
        vi: "báo / trình báo",
        pos: "verb",
        pronunciation_vi: "LA-por — `lapor ke ibu kos` = báo với bà chủ trọ",
        pronunciation_en: "LA-por — `lapor ke ibu kos` = notify the landlady",
      },
      {
        cell_id: "7732d6da-c83c-414a-b0d1-eebb93846d6e",
        word: "kontrak",
        en: "contract / lease term",
        vi: "hợp đồng",
        pos: "noun",
        pronunciation_vi: "KON-trak — bật `k` cuối; `kontrak tahunan` = hợp đồng theo năm",
        pronunciation_en: "KON-trak — release the final `k`; `kontrak tahunan` = a yearly lease",
      },
    ],
    dialogue: [
      // A Vietnamese newcomer views a kos and asks the ibu kos about the rules
      {
        cell_id: "4dc9958b-707b-45af-9e84-1e4aa961edfc",
        speaker: "Calon penghuni",
        text: "Permisi, Bu. Saya lihat kosnya ada kamar kosong, masih ada?",
        vi: "Xin lỗi cô. Em thấy nhà trọ còn phòng trống, vẫn còn không ạ?",
        en: "Excuse me, ma'am. I saw your kos has a vacant room — is it still available?",
      },
      {
        cell_id: "3a61f6d9-69c8-43fa-b132-249b677d2193",
        speaker: "Ibu kos",
        text: "Masih ada satu, Mbak. Sewanya satu juta sebulan, sudah termasuk listrik.",
        vi: "Vẫn còn một phòng đấy. Thuê một triệu một tháng, đã bao gồm tiền điện.",
        en: "There's one left. Rent is one million a month, electricity included.",
      },
      {
        cell_id: "a79be3a4-893b-4023-91e6-ef602815fbdf",
        speaker: "Calon penghuni",
        text: "Ada uang deposit, Bu? Lalu aturannya bagaimana?",
        vi: "Có tiền đặt cọc không cô? Rồi nội quy thế nào ạ?",
        en: "Is there a deposit, ma'am? And what are the rules?",
      },
      {
        cell_id: "1f7a4078-5ebd-406f-8816-ce3eee9edeb6",
        speaker: "Ibu kos",
        text: "Deposit satu bulan. Ada jam malam jam sebelas, gerbang dikunci.",
        vi: "Cọc một tháng. Có giờ giới nghiêm lúc mười một giờ, cổng sẽ khóa.",
        en: "A one-month deposit. There's an 11 o'clock curfew — the gate gets locked.",
      },
      {
        cell_id: "8d03cbf8-88d5-4feb-8763-9527fd86c66e",
        speaker: "Calon penghuni",
        text: "Saya boleh menerima tamu, Bu?",
        vi: "Em có được phép tiếp khách không cô?",
        en: "Am I allowed to have guests, ma'am?",
      },
      {
        cell_id: "bd2b659c-0368-4319-b5bd-d87e4f2df95a",
        speaker: "Ibu kos",
        text: "Boleh, tapi tamu lawan jenis tidak boleh masuk kamar, ya. Ini kos putri.",
        vi: "Được, nhưng khách khác giới không được vào phòng nhé. Đây là trọ nữ.",
        en: "Yes, but opposite-sex guests can't enter the room. This is a women's kos.",
      },
      {
        cell_id: "14b66b07-f1cc-4926-a778-e0e0a976a08c",
        speaker: "Calon penghuni",
        text: "Baik, mengerti. Bayar kos paling lambat tanggal berapa, Bu?",
        vi: "Vâng, em hiểu. Trả tiền trọ chậm nhất ngày mấy ạ cô?",
        en: "Alright, understood. By what date should I pay, ma'am?",
      },
      {
        cell_id: "e4e17825-63a1-4487-a8e7-cbb500dda78b",
        speaker: "Ibu kos",
        text: "Tanggal lima tiap bulan. Kalau mau pindah, lapor sebulan sebelumnya, ya.",
        vi: "Ngày năm mỗi tháng. Nếu muốn dọn đi, báo trước một tháng nhé.",
        en: "The fifth of each month. If you want to move out, give one month's notice.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Phòng trọ còn phòng nào trống không?", answer: "Kamar kosnya masih ada yang kosong?" },
          { prompt: "Thuê mỗi tháng bao nhiêu?", answer: "Sewa per bulan berapa?" },
          { prompt: "Tôi có được phép tiếp khách không?", answer: "Apakah saya boleh menerima tamu?" },
          { prompt: "Làm ơn đừng ồn ào sau mười giờ tối.", answer: "Tolong jangan berisik setelah jam sepuluh malam." },
          { prompt: "Trả tiền trọ chậm nhất ngày mấy?", answer: "Bayar kos paling lambat tanggal berapa?" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Indonesia:",
        instruction_en: "Extra practice — translate into Indonesian:",
        items: [
          { prompt: "Có tiền đặt cọc không?", answer: "Apakah ada uang deposit?" },
          { prompt: "Nội quy nhà trọ thế nào?", answer: "Aturan kosnya bagaimana?" },
          { prompt: "Khách khác giới không được vào phòng.", answer: "Tamu lawan jenis tidak boleh masuk kamar." },
          { prompt: "Nhà tắm ở trong hay ngoài?", answer: "Kamar mandinya di dalam atau di luar?" },
          { prompt: "Nếu muốn dọn đi, phải báo trước mấy ngày?", answer: "Kalau mau pindah, harus lapor berapa hari sebelumnya?" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn `boleh`/`tidak boleh` (được phép/cấm) hay `bisa`/`tidak bisa` (khả năng):",
        instruction_en:
          "Choose `boleh`/`tidak boleh` (permission) vs `bisa`/`tidak bisa` (ability):",
        items: [
          { prompt: "Apakah saya ___ menerima tamu? (xin phép)", answer: "boleh", hint: "XIN PHÉP → boleh" },
          { prompt: "Tamu lawan jenis ___ masuk kamar. (luật cấm)", answer: "tidak boleh", hint: "CẤM → tidak boleh" },
          { prompt: "Maaf, saya ___ bayar hari ini, ATM rusak. (không thể)", answer: "tidak bisa", hint: "KHÔNG CÓ KHẢ NĂNG → tidak bisa" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Điền `tolong`, `jangan`, hay `harus` cho đúng (làm ơn / đừng / phải):",
        instruction_en:
          "Fill in `tolong`, `jangan`, or `harus` (please / don't / must):",
        items: [
          { prompt: "___ jangan berisik malam hari. (nhờ làm)", answer: "Tolong", hint: "nhờ ai làm gì = tolong" },
          { prompt: "Tamu ___ masuk kamar setelah jam malam. (cấm)", answer: "jangan", hint: "ngăn cấm = jangan" },
          { prompt: "Kalau mau pindah, ___ lapor sebulan sebelumnya. (bắt buộc)", answer: "harus", hint: "bắt buộc = harus" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung hỏi nội quy khi xem phòng trọ — điền chỗ trống: `Permisi, Bu. Sewanya ___ per bulan? Ada uang deposit ___? Aturannya bagaimana, ada jam malam jam ___? Saya boleh menerima tamu ___?`",
        instruction_en:
          "A 'asking the rules when viewing a kos' frame — fill the blanks: `Permisi, Bu. Sewanya ___ per bulan? Ada uang deposit ___? Aturannya bagaimana, ada jam malam jam ___? Saya boleh menerima tamu ___?`",
        example:
          "Permisi, Bu. Sewanya satu juta per bulan? Ada uang deposit satu bulan? Aturannya bagaimana, ada jam malam jam sebelas? Saya boleh menerima tamu di kamar?",
        example_vi:
          "Xin lỗi cô. Thuê một triệu một tháng ạ? Có tiền cọc một tháng không? Nội quy thế nào, có giờ giới nghiêm lúc mười một giờ không? Em có được tiếp khách trong phòng không?",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra — bạn thuê được phòng trọ chưa?",
        instruction_en: "Self-check — can you rent a kos on your own?",
        items: [
          { vi: "Tôi có thể hỏi giá thuê và phí điện.", en: "I can ask the rent and the electricity charge." },
          { vi: "Tôi có thể hỏi về tiền cọc (`deposit`).", en: "I can ask about the deposit." },
          { vi: "Tôi có thể hỏi nội quy và giờ giới nghiêm.", en: "I can ask about the rules and curfew." },
          { vi: "Tôi phân biệt được `boleh` (được phép) và `bisa` (có thể).", en: "I can tell `boleh` (allowed) from `bisa` (able)." },
          { vi: "Tôi phân biệt được `jangan` (đừng) và `tidak` (không).", en: "I can tell `jangan` (don't) from `tidak` (not)." },
          { vi: "Tôi biết phải `lapor` trước khi `pindah` để lấy lại cọc.", en: "I know to give notice (`lapor`) before moving out to reclaim the deposit." },
        ],
      },
    ],
    cultural_notes_vi:
      "`Kos` (hay `kosan`, `indekos`) là kiểu thuê phổ biến nhất cho sinh viên và người đi làm trẻ ở Indonesia: thường là một phòng trong nhà của chủ, do `ibu kos`/`bapak kos` quản lý — họ hay sống ngay tại chỗ và để mắt tới nội quy. Kos chia loại `putri` (chỉ nữ), `putra` (chỉ nam) và `campur` (chung); kos `putri` thường có luật chặt về khách khác giới (`lawan jenis tidak boleh masuk kamar`) và `jam malam` (giờ giới nghiêm) — sau giờ đó cổng khóa. Giá tính theo tháng, có thể đã hoặc chưa gồm điện/nước/WiFi, nên luôn hỏi `sudah termasuk?`. Phần lớn yêu cầu `deposit` (thường một tháng), hoàn lại khi dọn đi nếu phòng không hư hại. Muốn `pindah` (dọn đi) thì phải `lapor` (báo trước), thường một tháng. Mẹo cho người Việt: quan hệ với `ibu kos` rất quan trọng — chào hỏi lễ phép, gọi `Bu`/`Pak`, tôn trọng giờ giấc, thì mọi việc (sửa chữa, gia hạn, hoàn cọc) đều dễ dàng hơn nhiều.",
    cultural_notes_en:
      "A `kos` (also `kosan`, `indekos`) is the most common rental for students and young workers in Indonesia: usually a room within an owner's house, managed by an `ibu kos`/`bapak kos` who often lives on-site and watches over the rules. Kos come as `putri` (women-only), `putra` (men-only), or `campur` (mixed); `putri` kos often have strict rules about opposite-sex guests (`lawan jenis tidak boleh masuk kamar`) and a `jam malam` (curfew) after which the gate is locked. Rent is monthly and may or may not include electricity/water/WiFi, so always ask `sudah termasuk?`. Most require a `deposit` (typically one month), refunded on move-out if the room is undamaged. To `pindah` (move out) you must `lapor` (give notice), usually a month ahead. Tip for Vietnamese speakers: your relationship with the `ibu kos` matters a lot — greet politely, address her `Bu`/`Pak`, respect the hours, and everything (repairs, renewals, deposit returns) goes far more smoothly.",
    tip_advice_vi:
      "Phân biệt cặp modal là chìa khóa của chủ đề này. (1) `boleh` (được phép) ↔ `bisa` (có khả năng): xin phép/hỏi luật dùng `boleh` — `Saya boleh menerima tamu?` (Tôi được tiếp khách không?), KHÔNG dùng `bisa`. Lệnh cấm dùng `tidak boleh` (không được phép), KHÔNG dùng `tidak bisa` (không thể). (2) Mệnh lệnh mềm: `tolong` (làm ơn, nhờ) ≠ `jangan` (đừng, cấm) ≠ `harus` (phải, bắt buộc). Thêm hai mẹo hỏi: `berapa` cho giá (`sewanya berapa`), và `tanggal berapa` cho ngày trong tháng (hạn đóng tiền) — đừng nhầm với `hari apa` (thứ mấy). Cuối cùng, làm quen thể bị động `di-` (`deposit dikembalikan` = cọc được trả lại) vì nó xuất hiện đầy trong các câu về nội quy.",
    tip_advice_en:
      "Telling the modal pairs apart is the key to this topic. (1) `boleh` (allowed) ↔ `bisa` (able): for permission/rules use `boleh` — `Saya boleh menerima tamu?` (May I have guests?), NOT `bisa`. For a ban use `tidak boleh` (not allowed), NOT `tidak bisa` (unable). (2) Soft commands: `tolong` (please, a favor) ≠ `jangan` (don't, forbid) ≠ `harus` (must, required). Two question tips: `berapa` for prices (`sewanya berapa`), and `tanggal berapa` for a calendar date (the due date) — don't mix it up with `hari apa` (which weekday). Finally, get comfortable with the `di-` passive (`deposit dikembalikan` = the deposit is returned), since it's all over rule-talk.",
  },
];

export default lessons;
