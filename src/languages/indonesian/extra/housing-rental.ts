// Housing & Rental Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (construction-worker.ts, job-interview.ts
// etc.), which in turn mirror the French `FrenchLesson` shape. When the shared
// Indonesian registry (src/languages/indonesian/lessons.ts) lands, swap the local
// types for a shared import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// Indonesian is written in Latin script and is largely phonetic. For Vietnamese
// speakers the big WINS are: no grammatical gender, no verb conjugation, no tones,
// no articles. The rental-specific traps are: `sewa` (rent) vs. `menyewa` (to rent
// from) vs. `menyewakan` (to rent out), the utility acronyms read letter-by-letter
// (`PLN` = "pe-el-en", `PDAM` = "pe-de-a-em"), and `bayar` (pay) vs. `pembayaran`
// (payment, the peN-…-an noun).

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
    id: "indonesian_housing_rental",
    level: "A2",
    category: "daily-life",
    title_vi: "Tiếng Indonesia thuê nhà / thuê phòng",
    title_en: "Housing & rental Indonesian",
    sentences: [
      // ── Looking for a place ──────────────────────────────────────────────
      {
        en: "Saya mencari kos dekat kampus.",
        vi: "Tôi đang tìm phòng trọ gần trường.",
        pronunciation_focus: [
          "SA-ya men-CA-ri kos de-KAT KAM-pus — `mencari` = tìm (meN- + `cari`); `kos` = phòng trọ; `dekat` = gần.",
          "Lỗi người Việt: đọc `mencari` là 'men-ka-ri'. `c` trong tiếng Indonesia = `ch` → 'men-CHA-ri'.",
          "Luyện: `Saya mencari kos dekat kampus.`",
        ],
        pronunciation_focus_en: [
          "SA-ya men-CHA-ri kos de-KAT KAM-pus — `mencari` = to look for (meN- + `cari`); `kos` = a rented room; `dekat` = near.",
          "VN-speaker trap: reading `mencari` as 'men-ka-ri'. Indonesian `c` = 'ch' → 'men-CHA-ri'.",
          "Drill: `Saya mencari kos dekat kampus.`",
        ],
      },
      {
        en: "Apakah masih ada kamar kosong?",
        vi: "Còn phòng trống không ạ?",
        pronunciation_focus: [
          "a-pa-KAH ma-SIH A-da KA-mar ko-SONG — `apakah` mở câu hỏi có/không; `kamar` = phòng; `kosong` = trống/rỗng.",
          "Lợi thế người Việt: không cần 'do/does' như tiếng Anh — chỉ thêm `apakah` đầu câu.",
          "Luyện: `Apakah masih ada kamar kosong?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH ma-SIH A-da KA-mar ko-SONG — `apakah` opens a yes/no question; `kamar` = room; `kosong` = empty/vacant.",
          "VN-speaker win: no 'do/does' like English — just add `apakah` at the front.",
          "Drill: `Apakah masih ada kamar kosong?`",
        ],
      },
      {
        en: "Saya mau menyewa kamar ini.",
        vi: "Tôi muốn thuê phòng này.",
        pronunciation_focus: [
          "SA-ya MAU me-NYE-wa KA-mar I-ni — `menyewa` = thuê (người thuê, meN- + `sewa`); KHÁC `menyewakan` = cho thuê.",
          "Lỗi người Việt: lẫn `menyewa` (đi thuê) với `menyewakan` (cho thuê). Bạn là người thuê → `menyewa`.",
          "Luyện: `Saya mau menyewa kamar ini.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU me-NYE-wa KA-mar EE-ni — `menyewa` = to rent (the tenant, meN- + `sewa`); NOT `menyewakan` = to rent out.",
          "VN-speaker trap: confusing `menyewa` (to rent from) with `menyewakan` (to rent out). As the tenant you `menyewa`.",
          "Drill: `Saya mau menyewa kamar ini.`",
        ],
      },
      // ── Price & deposit ──────────────────────────────────────────────────
      {
        en: "Berapa sewa per bulan?",
        vi: "Tiền thuê mỗi tháng bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa SE-wa per BU-lan — `sewa` (danh từ) = tiền thuê; `per bulan` = mỗi tháng.",
          "Lỗi người Việt: nói `sewa satu bulan` cho 'mỗi tháng'. Dùng `per bulan` mới đúng nghĩa định kỳ.",
          "Luyện: `Berapa sewa per bulan?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa SE-wa per BU-lan — `sewa` (noun) = the rent; `per bulan` = per month.",
          "VN-speaker trap: saying `sewa satu bulan` for 'per month'. `per bulan` is the recurring sense.",
          "Drill: `Berapa sewa per bulan?`",
        ],
      },
      {
        en: "Apakah ada uang deposit?",
        vi: "Có tiền đặt cọc không?",
        pronunciation_focus: [
          "a-pa-KAH A-da U-ang de-PO-sit — `uang` = tiền; `deposit` (mượn tiếng Anh) = đặt cọc; cũng gọi `uang jaminan`.",
          "Lỗi người Việt: đọc `uang` thành 'oang' một âm. Đọc hai âm rõ: 'U-ang'.",
          "Luyện: `Apakah ada uang deposit?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH A-da U-ang de-PO-sit — `uang` = money; `deposit` (English loan) = deposit; also `uang jaminan`.",
          "VN-speaker trap: crushing `uang` into one syllable. Say two clear vowels: 'OO-ang'.",
          "Drill: `Apakah ada uang deposit?`",
        ],
      },
      {
        en: "Apakah harganya bisa kurang sedikit?",
        vi: "Giá có bớt được một chút không ạ?",
        pronunciation_focus: [
          "a-pa-KAH HAR-ga-nya BI-sa KU-rang se-DI-kit — `harganya` = giá đó (`harga` + -nya); `kurang` = bớt/thiếu; `sedikit` = một chút.",
          "Lợi thế người Việt: mặc cả lịch sự — `bisa kurang sedikit?` rất tự nhiên, giống 'bớt chút được không'.",
          "Luyện: `Apakah harganya bisa kurang sedikit?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH HAR-ga-nya BI-sa KU-rang se-DEE-kit — `harganya` = the price (`harga` + -nya); `kurang` = less; `sedikit` = a little.",
          "VN-speaker win: polite haggling — `bisa kurang sedikit?` is natural, like 'can it come down a bit'.",
          "Drill: `Apakah harganya bisa kurang sedikit?`",
        ],
      },
      // ── Utilities ────────────────────────────────────────────────────────
      {
        en: "Apakah listrik dan air sudah termasuk?",
        vi: "Điện và nước đã bao gồm chưa?",
        pronunciation_focus: [
          "a-pa-KAH LIS-trik dan A-ir SU-dah ter-MA-suk — `listrik` = điện (PLN); `air` = nước (PDAM); `termasuk` = bao gồm.",
          "Lỗi người Việt: đọc `air` một âm 'a'. Đọc hai âm: 'A-ir' (nước).",
          "Luyện: `Apakah listrik dan air sudah termasuk?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH LIS-trik dan A-ir SU-dah ter-MA-suk — `listrik` = electricity (PLN); `air` = water (PDAM); `termasuk` = included.",
          "VN-speaker trap: saying `air` as one 'a'. Two vowels: 'AH-ir' (water).",
          "Drill: `Apakah listrik dan air sudah termasuk?`",
        ],
      },
      {
        en: "Saya mau bayar token listrik PLN.",
        vi: "Tôi muốn nạp tiền điện PLN.",
        pronunciation_focus: [
          "SA-ya MAU BA-yar TO-ken LIS-trik pe-el-EN — `bayar` = trả/nạp; `PLN` đọc từng chữ 'pe-el-en'; `token` = mã điện trả trước.",
          "Lỗi người Việt: đọc `PLN` như một từ 'plen'. Phải đánh vần từng chữ: 'pe-el-en'.",
          "Luyện: `Saya mau bayar token listrik PLN.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU BA-yar TO-ken LIS-trik pe-el-EN — `bayar` = to pay; spell `PLN` letter-by-letter 'pe-el-en'; `token` = prepaid electricity code.",
          "VN-speaker trap: reading `PLN` as one word 'plen'. Spell each letter: 'pe-el-en'.",
          "Drill: `Saya mau bayar token listrik PLN.`",
        ],
      },
      {
        en: "WiFi di sini cepat atau lambat?",
        vi: "WiFi ở đây nhanh hay chậm?",
        pronunciation_focus: [
          "WI-fi di SI-ni CE-pat A-tau LAM-bat — `cepat` = nhanh; `lambat` = chậm; `atau` = hay/hoặc.",
          "Lỗi người Việt: đọc `cepat` là 'ke-pat'. `c` = `ch` → 'CHE-pat'.",
          "Luyện: `WiFi di sini cepat atau lambat?`",
        ],
        pronunciation_focus_en: [
          "WI-fi di SEE-ni CHE-pat A-tau LAM-bat — `cepat` = fast; `lambat` = slow; `atau` = or.",
          "VN-speaker trap: reading `cepat` as 'ke-pat'. `c` = 'ch' → 'CHE-pat'.",
          "Drill: `WiFi di sini cepat atau lambat?`",
        ],
      },
      // ── Dealing with the landlord & problems ─────────────────────────────
      {
        en: "Pak, kamar mandi bocor.",
        vi: "Bác ơi, nhà tắm bị dột/rò nước.",
        pronunciation_focus: [
          "Pak, KA-mar MAN-di BO-cor — `kamar mandi` = nhà tắm/nhà vệ sinh; `bocor` = rò/dột; `Pak` gọi chủ nhà nam lịch sự.",
          "Lỗi người Việt: đọc `bocor` là 'bo-kor'. `c` = `ch` → 'BO-chor'.",
          "Luyện: `Pak, kamar mandi bocor.`",
        ],
        pronunciation_focus_en: [
          "Pak, KA-mar MAN-di BO-chor — `kamar mandi` = bathroom; `bocor` = leaking; `Pak` politely addresses a male landlord.",
          "VN-speaker trap: reading `bocor` as 'bo-kor'. `c` = 'ch' → 'BO-chor'.",
          "Drill: `Pak, kamar mandi bocor.`",
        ],
      },
      {
        en: "Tolong perbaiki AC-nya, ya.",
        vi: "Nhờ sửa giúp cái máy lạnh nhé.",
        pronunciation_focus: [
          "TO-long per-BA-i-ki a-se-nya, ya — `tolong` mở lời nhờ; `perbaiki` = sửa (per-…-i từ `baik`); `AC` đọc 'a-se'.",
          "Lỗi người Việt: đọc `AC` kiểu Anh 'ey-si'. Người Indonesia đọc 'a-se'.",
          "Luyện: `Tolong perbaiki AC-nya, ya.`",
        ],
        pronunciation_focus_en: [
          "TO-long per-BA-i-ki a-se-nya, ya — `tolong` opens a request; `perbaiki` = to repair (per-…-i from `baik`); `AC` is said 'a-se'.",
          "VN-speaker trap: saying `AC` the English way 'ay-see'. Indonesians say 'a-se'.",
          "Drill: `Tolong perbaiki AC-nya, ya.`",
        ],
      },
      {
        en: "Kapan saya harus bayar sewa setiap bulan?",
        vi: "Mỗi tháng tôi phải trả tiền thuê khi nào?",
        pronunciation_focus: [
          "KA-pan SA-ya HA-rus BA-yar SE-wa se-TI-ap BU-lan — `kapan` = khi nào; `harus` = phải; `setiap bulan` = mỗi tháng.",
          "Lợi thế người Việt: không chia động từ — `harus bayar` giữ nguyên cho mọi ngôi/thì.",
          "Luyện: `Kapan saya harus bayar sewa setiap bulan?`",
        ],
        pronunciation_focus_en: [
          "KA-pan SA-ya HA-rus BA-yar SE-wa se-TEE-ap BU-lan — `kapan` = when; `harus` = must; `setiap bulan` = every month.",
          "VN-speaker win: no conjugation — `harus bayar` stays identical for every person/tense.",
          "Drill: `Kapan saya harus bayar sewa setiap bulan?`",
        ],
      },
      {
        en: "Saya mau perpanjang kontrak satu tahun lagi.",
        vi: "Tôi muốn gia hạn hợp đồng thêm một năm.",
        pronunciation_focus: [
          "SA-ya MAU per-PAN-jang KON-trak SA-tu TA-hun LA-gi — `perpanjang` = gia hạn (per- + `panjang` dài); `lagi` = nữa/thêm.",
          "Lỗi người Việt: nói `tambah satu tahun`. Gia hạn hợp đồng dùng `perpanjang`.",
          "Luyện: `Saya mau perpanjang kontrak satu tahun lagi.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU per-PAN-jang KON-trak SA-tu TA-hun LA-gi — `perpanjang` = to extend (per- + `panjang` long); `lagi` = more/again.",
          "VN-speaker trap: saying `tambah satu tahun`. To extend a contract use `perpanjang`.",
          "Drill: `Saya mau perpanjang kontrak satu tahun lagi.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia có hai kiểu thuê chính: `kos` (`kos-kosan`) là phòng đơn trong dãy trọ, thường trả theo THÁNG và phổ biến với sinh viên/người độc thân — nhiều `kos` chia `kos putra` (nam), `kos putri` (nữ), hoặc `kos campur`; nhiều nơi có giờ giới nghiêm và quy định khách. `Kontrakan` là nhà nguyên căn thuê theo NĂM, hợp với gia đình. `Apartemen` (chung cư) ở thành phố lớn. Hai dịch vụ tiện ích cốt lõi: `PLN` (điện, đọc 'pe-el-en') — nhiều `kos` dùng điện trả trước qua `token`; `PDAM` (nước, đọc 'pe-de-a-em'). Hỏi rõ `listrik dan air sudah termasuk?` (điện nước đã gồm chưa) vì có nơi tính riêng. Đặt cọc gọi là `uang deposit`/`uang jaminan`, thường 1 tháng tiền thuê, hoàn lại khi trả phòng nếu không hư hỏng. Gọi chủ nhà bằng `Pak` (nam) / `Bu` (nữ) cho lịch sự. Mặc cả nhẹ được, nhất là khi thuê dài hạn: `bisa kurang sedikit?`.",
    cultural_notes_en:
      "Indonesia has two main rental types: `kos` (`kos-kosan`) is a single room in a boarding house, usually paid MONTHLY and popular with students and singles — many are split into `kos putra` (men), `kos putri` (women), or `kos campur` (mixed), often with a curfew and guest rules. `Kontrakan` is a whole house rented YEARLY, better for families. `Apartemen` (condos) exist in big cities. Two core utilities: `PLN` (electricity, spelled 'pe-el-en') — many kos use prepaid power via a `token`; `PDAM` (water, spelled 'pe-de-a-em'). Always ask `listrik dan air sudah termasuk?` (are electricity and water included?) since some places bill them separately. The deposit is `uang deposit`/`uang jaminan`, usually one month's rent, refundable on move-out if there's no damage. Address the landlord as `Pak` (man) / `Bu` (woman). Light haggling is fine, especially on long leases: `bisa kurang sedikit?`.",
    tip_advice_vi:
      "Học thuộc 'bộ khung thuê nhà' bốn câu: (1) tìm — `Saya mencari kos dekat …`; (2) hỏi trống & giá — `Apakah masih ada kamar kosong? Berapa sewa per bulan?`; (3) tiện ích — `Apakah listrik dan air sudah termasuk?`; (4) chốt — `Saya mau menyewa kamar ini.`. Nhớ ba điểm hay sai với người Việt: `menyewa` (đi thuê) ≠ `menyewakan` (cho thuê); các từ viết tắt tiện ích đọc TỪNG CHỮ ('pe-el-en', 'pe-de-a-em'); và `c` luôn đọc 'ch' (`mencari`, `cepat`, `bocor`). Giữ giọng phẳng, không thanh điệu.",
    tip_advice_en:
      "Memorize the four-line rental frame: (1) search — `Saya mencari kos dekat …`; (2) vacancy & price — `Apakah masih ada kamar kosong? Berapa sewa per bulan?`; (3) utilities — `Apakah listrik dan air sudah termasuk?`; (4) close — `Saya mau menyewa kamar ini.`. Keep three VN-speaker pitfalls straight: `menyewa` (to rent from) ≠ `menyewakan` (to rent out); utility acronyms are spelled LETTER-BY-LETTER ('pe-el-en', 'pe-de-a-em'); and `c` is always 'ch' (`mencari`, `cepat`, `bocor`). Keep your pitch flat — no tones.",
    vocabulary: [
      // Types of housing
      {
        cell_id: "399524a8-ca3a-471e-9a4b-f10dc2c9d6f2",
        word: "kos",
        en: "rented room / boarding house room",
        vi: "phòng trọ",
        pos: "noun",
        pronunciation_vi: "kos — cũng `kos-kosan`; trả theo tháng; `kos putri` (nữ), `kos putra` (nam)",
        pronunciation_en: "kos — also `kos-kosan`; paid monthly; `kos putri` (women), `kos putra` (men)",
      },
      {
        cell_id: "558977e6-d20b-474b-87dd-80d558ab7b95",
        word: "kontrakan",
        en: "rented house (yearly)",
        vi: "nhà thuê nguyên căn",
        pos: "noun",
        pronunciation_vi: "kon-tra-KAN — từ `kontrak` + -an; thường thuê theo năm",
        pronunciation_en: "kon-tra-KAN — from `kontrak` + -an; usually rented yearly",
      },
      {
        cell_id: "0f6deb88-62ef-49d1-a4cd-4e832257c582",
        word: "apartemen",
        en: "apartment / condo",
        vi: "căn hộ chung cư",
        pos: "noun",
        pronunciation_vi: "a-par-te-MEN — mượn tiếng Anh; phổ biến ở thành phố lớn",
        pronunciation_en: "a-par-te-MEN — English loan; common in big cities",
      },
      {
        cell_id: "f345f986-7188-4cc8-b761-a11f34c66718",
        word: "kamar",
        en: "room",
        vi: "phòng",
        pos: "noun",
        pronunciation_vi: "KA-mar — `kamar mandi` = nhà tắm; `kamar kosong` = phòng trống",
        pronunciation_en: "KA-mar — `kamar mandi` = bathroom; `kamar kosong` = empty room",
      },
      // The deal
      {
        cell_id: "9761ef30-e642-4fd7-b2e3-e04da1d92ca4",
        word: "sewa",
        en: "rent (noun); to rent (root)",
        vi: "tiền thuê",
        pos: "noun / verb",
        pronunciation_vi: "SE-wa — `menyewa` đi thuê ≠ `menyewakan` cho thuê",
        pronunciation_en: "SE-wa — `menyewa` to rent from ≠ `menyewakan` to rent out",
      },
      {
        cell_id: "3495227e-d5c6-4a70-8e2c-2f6730dc0f45",
        word: "menyewa",
        en: "to rent (as tenant)",
        vi: "thuê (mình đi thuê)",
        pos: "verb",
        pronunciation_vi: "me-NYE-wa — meN- + `sewa`; bạn là người thuê",
        pronunciation_en: "me-NYE-wa — meN- + `sewa`; you're the tenant",
      },
      {
        cell_id: "fe5468f1-6d56-4fd3-9ea8-a66f85ad5ccf",
        word: "deposit",
        en: "deposit",
        vi: "tiền đặt cọc",
        pos: "noun",
        pronunciation_vi: "de-PO-sit — cũng `uang jaminan`; thường 1 tháng tiền thuê",
        pronunciation_en: "de-PO-sit — also `uang jaminan`; usually one month's rent",
      },
      {
        cell_id: "07aca522-407e-49bc-a1cf-7e068eb32561",
        word: "pemilik kos",
        en: "landlord (kos owner)",
        vi: "chủ nhà trọ",
        pos: "noun",
        pronunciation_vi: "pe-MI-lik kos — `pemilik` chủ (peN- + `milik`); gọi `Pak`/`Bu` cho lịch sự",
        pronunciation_en: "pe-MI-lik kos — `pemilik` owner (peN- + `milik`); address as `Pak`/`Bu`",
      },
      {
        cell_id: "0599cc75-1ca8-4561-a845-eb8b0c27ff05",
        word: "kontrak",
        en: "contract / lease",
        vi: "hợp đồng",
        pos: "noun",
        pronunciation_vi: "KON-trak — đọc rõ `k` cuối; `perpanjang kontrak` = gia hạn",
        pronunciation_en: "KON-trak — sound the final `k`; `perpanjang kontrak` = to extend",
      },
      // Utilities
      {
        cell_id: "0333f4aa-93a9-4fe2-a50e-4bc8bc31cb82",
        word: "listrik",
        en: "electricity",
        vi: "điện",
        pos: "noun",
        pronunciation_vi: "LIS-trik — nhà cung cấp `PLN` (đọc 'pe-el-en'); trả trước qua `token`",
        pronunciation_en: "LIS-trik — provider `PLN` (spell 'pe-el-en'); prepaid via `token`",
      },
      {
        cell_id: "fa7d90a6-957c-48e5-85f6-5e3df712ffe0",
        word: "PLN",
        en: "the state electricity company",
        vi: "công ty điện lực quốc gia",
        pos: "noun (acronym)",
        pronunciation_vi: "pe-el-EN — đọc từng chữ, KHÔNG đọc 'plen'",
        pronunciation_en: "pe-el-EN — spell each letter, NOT 'plen'",
      },
      {
        cell_id: "62d2b73e-c286-4195-ab31-dd529ad98421",
        word: "PDAM",
        en: "the regional water utility",
        vi: "công ty cấp nước",
        pos: "noun (acronym)",
        pronunciation_vi: "pe-de-a-EM — đọc từng chữ; cung cấp `air` (nước)",
        pronunciation_en: "pe-de-a-EM — spell each letter; supplies `air` (water)",
      },
      {
        cell_id: "90b36017-00a7-47cd-8ebe-95320f3892e9",
        word: "air",
        en: "water",
        vi: "nước",
        pos: "noun",
        pronunciation_vi: "A-ir — đọc HAI âm rõ, không phải 'a' một âm",
        pronunciation_en: "AH-ir — TWO clear vowels, not a single 'a'",
      },
      {
        cell_id: "00172623-e2d1-4d10-b070-225e40a91ab7",
        word: "WiFi",
        en: "WiFi / internet",
        vi: "WiFi / mạng",
        pos: "noun",
        pronunciation_vi: "WI-fi — hỏi `cepat atau lambat?` (nhanh hay chậm)",
        pronunciation_en: "WI-fi — ask `cepat atau lambat?` (fast or slow)",
      },
      // Problems
      {
        cell_id: "d3f53736-36a8-4b9d-baab-dce692732f61",
        word: "bocor",
        en: "leaking",
        vi: "rò / dột nước",
        pos: "adjective",
        pronunciation_vi: "BO-cor — `c` = 'ch' → 'BO-chor'",
        pronunciation_en: "BO-chor — `c` = 'ch'",
      },
      {
        cell_id: "aa88e846-4c57-4583-95df-ba5dc5a35336",
        word: "rusak",
        en: "broken / out of order",
        vi: "hỏng / hư",
        pos: "adjective",
        pronunciation_vi: "RU-sak — `AC-nya rusak` = máy lạnh hỏng; nhờ `tolong perbaiki`",
        pronunciation_en: "RU-sak — `AC-nya rusak` = the AC is broken; ask `tolong perbaiki`",
      },
    ],
    dialogue: [
      // Dialogue: viewing and renting a kos
      {
        cell_id: "1f9a2ff0-9ab9-4e68-80d7-b1e4faf4938a",
        speaker: "Penyewa",
        text: "Permisi, Bu. Saya mencari kos dekat kampus. Apakah masih ada kamar kosong?",
        vi: "Xin lỗi cô. Cháu đang tìm phòng trọ gần trường. Còn phòng trống không ạ?",
        en: "Excuse me, ma'am. I'm looking for a kos near campus. Are there any rooms available?",
      },
      {
        cell_id: "09718129-425f-41b2-a401-259c2279811e",
        speaker: "Pemilik",
        text: "Masih ada satu kamar di lantai dua. Mari saya tunjukkan.",
        vi: "Còn một phòng ở tầng hai. Để cô dẫn đi xem.",
        en: "There's still one room on the second floor. Let me show you.",
      },
      {
        cell_id: "1ea067d3-8821-45fa-818f-99344bb549b6",
        speaker: "Penyewa",
        text: "Berapa sewa per bulan? Apakah listrik dan air sudah termasuk?",
        vi: "Tiền thuê mỗi tháng bao nhiêu ạ? Điện nước đã bao gồm chưa?",
        en: "How much is the rent per month? Are electricity and water included?",
      },
      {
        cell_id: "f52c8358-7289-4102-b8f8-32279423cfca",
        speaker: "Pemilik",
        text: "Satu juta lima ratus ribu. Air termasuk, tapi listrik pakai token PLN sendiri.",
        vi: "Một triệu năm trăm nghìn. Nước thì bao gồm, nhưng điện tự nạp token PLN.",
        en: "One million five hundred thousand. Water is included, but electricity is your own PLN token.",
      },
      {
        cell_id: "9790b671-8998-4297-9bd9-38f91dd37378",
        speaker: "Penyewa",
        text: "Apakah ada uang deposit? Dan harganya bisa kurang sedikit?",
        vi: "Có tiền đặt cọc không ạ? Và giá có bớt được một chút không?",
        en: "Is there a deposit? And can the price come down a little?",
      },
      {
        cell_id: "fd32e349-f95a-446a-8cb4-e84a17374fc7",
        speaker: "Pemilik",
        text: "Deposit satu bulan. Kalau bayar setahun, saya kurangi sedikit.",
        vi: "Đặt cọc một tháng. Nếu trả cả năm, cô bớt cho một ít.",
        en: "A one-month deposit. If you pay for a year, I'll knock a bit off.",
      },
      {
        cell_id: "1348a7ff-167c-4c54-9efc-c9bf9a06f3d2",
        speaker: "Penyewa",
        text: "Baik, saya mau menyewa kamar ini. Terima kasih, Bu.",
        vi: "Vâng, cháu muốn thuê phòng này. Cảm ơn cô ạ.",
        en: "Okay, I'd like to rent this room. Thank you, ma'am.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi đang tìm phòng trọ gần trường.", answer: "Saya mencari kos dekat kampus." },
          { prompt: "Còn phòng trống không ạ?", answer: "Apakah masih ada kamar kosong?" },
          { prompt: "Tiền thuê mỗi tháng bao nhiêu?", answer: "Berapa sewa per bulan?" },
          { prompt: "Điện và nước đã bao gồm chưa?", answer: "Apakah listrik dan air sudah termasuk?" },
          { prompt: "Tôi muốn thuê phòng này.", answer: "Saya mau menyewa kamar ini." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành báo sự cố & chốt hợp đồng — dịch sang tiếng Indonesia:",
        instruction_en: "Problems & lease practice — translate into Indonesian:",
        items: [
          { prompt: "Bác ơi, nhà tắm bị dột.", answer: "Pak, kamar mandi bocor." },
          { prompt: "Nhờ sửa giúp cái máy lạnh nhé.", answer: "Tolong perbaiki AC-nya, ya." },
          { prompt: "Có tiền đặt cọc không?", answer: "Apakah ada uang deposit?" },
          { prompt: "Tôi muốn gia hạn hợp đồng thêm một năm.", answer: "Saya mau perpanjang kontrak satu tahun lagi." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn `menyewa` hay `menyewakan` cho đúng (đi thuê / cho thuê):",
        instruction_en:
          "Choose `menyewa` or `menyewakan` correctly (rent from / rent out):",
        items: [
          { prompt: "Saya mahasiswa, saya mau ___ kamar.", answer: "menyewa", hint: "bạn là người thuê" },
          { prompt: "Ibu itu ___ kamar kepada mahasiswa.", answer: "menyewakan", hint: "chủ nhà cho thuê" },
          { prompt: "Kami ___ rumah ini selama satu tahun.", answer: "menyewa", hint: "người thuê = đi thuê" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung hỏi thuê phòng — điền chỗ trống: `Saya mencari ___ dekat ___. Berapa sewa per ___? Apakah ___ dan ___ sudah termasuk?`",
        instruction_en:
          "Room-hunting frame — fill the blanks: `Saya mencari ___ dekat ___. Berapa sewa per ___? Apakah ___ dan ___ sudah termasuk?`",
        example:
          "Saya mencari kos dekat kampus. Berapa sewa per bulan? Apakah listrik dan air sudah termasuk?",
        example_vi:
          "Tôi tìm phòng trọ gần trường. Tiền thuê mỗi tháng bao nhiêu? Điện và nước đã bao gồm chưa?",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra thuê nhà — bạn làm được chưa?",
        instruction_en: "Rental self-check — can you do each one?",
        items: [
          { vi: "Tôi có thể hỏi phòng trống và giá thuê theo tháng.", en: "I can ask about vacancies and monthly rent." },
          { vi: "Tôi có thể hỏi điện, nước, WiFi đã bao gồm chưa.", en: "I can ask whether electricity, water, and WiFi are included." },
          { vi: "Tôi phân biệt được `menyewa` (đi thuê) và `menyewakan` (cho thuê).", en: "I can tell `menyewa` (to rent from) from `menyewakan` (to rent out)." },
          { vi: "Tôi đọc đúng PLN ('pe-el-en') và PDAM ('pe-de-a-em').", en: "I spell PLN ('pe-el-en') and PDAM ('pe-de-a-em') correctly." },
          { vi: "Tôi có thể báo hỏng hóc và nhờ sửa một cách lịch sự.", en: "I can report a problem and politely ask for a repair." },
          { vi: "Tôi đọc `c` thành 'ch' (`mencari`, `cepat`, `bocor`).", en: "I read `c` as 'ch' (`mencari`, `cepat`, `bocor`)." },
        ],
      },
    ],
  },
];

export default lessons;
