// Phone Calls Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (construction-worker, healthcare-emergency,
// restaurant-hospitality, school-education), which in turn mirror the French
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
// no articles. The traps in this topic are: `bisa` (can) for polite requests,
// `dengan` (with) after `bicara` (to speak), the meN- verbs `menelepon`/`menghubungi`,
// and clear word-final consonants (`telepon`, `pesan`, `sebentar`).

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
    id: "indonesian_phone_calls",
    level: "A2",
    category: "communication",
    title_vi: "Gọi điện thoại",
    title_en: "Phone calls",
    sentences: [
      // ── Opening a call ────────────────────────────────────────────────────
      {
        en: "Halo, selamat pagi. Bisa bicara dengan Pak Budi?",
        vi: "Alô, chào buổi sáng. Cho tôi nói chuyện với anh Budi được không?",
        pronunciation_focus: [
          "HA-lo, se-la-mat PA-gi. BI-sa bi-CA-ra DE-ngan pak BU-di — `bisa bicara dengan` = có thể nói chuyện với.",
          "Lợi thế người Việt: `halo` y hệt 'alô' tiếng Việt — gốc cùng từ tiếng Anh.",
          "Lỗi người Việt: bỏ `dengan` (với), nói `bicara Pak Budi`. Phải có `dengan`: `bicara dengan Pak Budi`.",
          "Luyện: `Bisa bicara dengan Pak Budi?`",
        ],
        pronunciation_focus_en: [
          "HA-lo, se-la-mat PA-gi. BI-sa bi-CA-ra DE-ngan pak BU-di — `bisa bicara dengan` = can speak with.",
          "VN-speaker win: `halo` is the same 'hello' you already know — a shared English loan.",
          "VN-speaker trap: dropping `dengan` (with) and saying `bicara Pak Budi`. You need it: `bicara dengan Pak Budi`.",
          "Drill: `Bisa bicara dengan Pak Budi?`",
        ],
      },
      {
        en: "Maaf, ini dengan siapa, ya?",
        vi: "Xin lỗi, cho hỏi đây là ai ạ?",
        pronunciation_focus: [
          "ma-AF, I-ni DE-ngan SI-a-pa, ya — `ini dengan siapa` = đầu dây bên kia là ai (cách lịch sự).",
          "Mẹo: trên điện thoại người Indonesia dùng `dengan siapa` thay vì `siapa kamu` — nhã hơn nhiều.",
          "Lỗi người Việt: hỏi thẳng `kamu siapa?` (cộc lốc). Trên điện thoại nên là `ini dengan siapa?`.",
          "Luyện: `Ini dengan siapa, ya?`",
        ],
        pronunciation_focus_en: [
          "ma-AF, I-ni DE-ngan SI-a-pa, ya — `ini dengan siapa` = who is this (the polite phone phrasing).",
          "Tip: on the phone Indonesians say `dengan siapa` instead of `siapa kamu` — far more courteous.",
          "VN-speaker trap: asking blunt `kamu siapa?`. On a call use `ini dengan siapa?`.",
          "Drill: `Ini dengan siapa, ya?`",
        ],
      },
      {
        en: "Mohon tunggu sebentar, saya sambungkan.",
        vi: "Xin chờ một lát, tôi nối máy cho.",
        pronunciation_focus: [
          "MO-hon TUNG-gu se-ben-TAR, SA-ya sam-BUNG-kan — `sambungkan` = nối máy/chuyển máy.",
          "Mẹo affix: gốc `sambung` (nối) + `-kan` → `menyambungkan/sambungkan` = nối CHO ai.",
          "Lỗi người Việt: đọc `ng` trong `sambungkan` rời ra. `ng` là một âm mũi, ngậm liền.",
          "Luyện: `Mohon tunggu sebentar.`",
        ],
        pronunciation_focus_en: [
          "MO-hon TUNG-gu se-ben-TAR, SA-ya sam-BUNG-kan — `sambungkan` = put through / connect.",
          "Affix tip: root `sambung` (to join) + `-kan` → `menyambungkan/sambungkan` = connect FOR someone.",
          "VN-speaker trap: splitting the `ng` in `sambungkan`. It's one nasal sound, held smoothly.",
          "Drill: `Mohon tunggu sebentar.`",
        ],
      },
      // ── When the person is unavailable ────────────────────────────────────
      {
        en: "Maaf, beliau sedang tidak ada di tempat.",
        vi: "Xin lỗi, ông ấy hiện không có ở đây.",
        pronunciation_focus: [
          "ma-AF, be-LI-au SE-dang TI-dak A-da di TEM-pat — `beliau` = ông/bà ấy (kính trọng); `sedang` = đang.",
          "Mẹo: `beliau` là 'ông/bà ấy' lịch sự, dùng cho người đáng kính — khác `dia` (anh/chị ấy, trung tính).",
          "Lỗi người Việt: dùng `dia` cho sếp/khách. Người trên nên dùng `beliau`.",
          "Luyện: `Beliau sedang tidak ada di tempat.`",
        ],
        pronunciation_focus_en: [
          "ma-AF, be-LI-au SE-dang TI-dak A-da di TEM-pat — `beliau` = he/she (respectful); `sedang` = currently.",
          "Tip: `beliau` is the polite 'he/she' for someone you respect — unlike neutral `dia`.",
          "VN-speaker trap: using `dia` for a boss/client. For a senior person use `beliau`.",
          "Drill: `Beliau sedang tidak ada di tempat.`",
        ],
      },
      {
        en: "Apakah saya bisa meninggalkan pesan?",
        vi: "Tôi có thể để lại lời nhắn được không?",
        pronunciation_focus: [
          "A-pa-kah SA-ya BI-sa me-ning-GAL-kan PE-san — `meninggalkan pesan` = để lại lời nhắn.",
          "Mẹo affix: gốc `tinggal` (ở lại) + `me-...-kan` → `meninggalkan` = để lại (vật/lời).",
          "Lỗi người Việt: nói `tinggal pesan`. Cần affix đầy đủ: `meninggalkan pesan`.",
          "Luyện: `Saya bisa meninggalkan pesan?`",
        ],
        pronunciation_focus_en: [
          "A-pa-kah SA-ya BI-sa me-ning-GAL-kan PE-san — `meninggalkan pesan` = to leave a message.",
          "Affix tip: root `tinggal` (to stay) + `me-...-kan` → `meninggalkan` = to leave (a thing/message).",
          "VN-speaker trap: saying `tinggal pesan`. Use the full affix: `meninggalkan pesan`.",
          "Drill: `Saya bisa meninggalkan pesan?`",
        ],
      },
      {
        en: "Tolong sampaikan, nanti saya telepon lagi.",
        vi: "Làm ơn nhắn lại giúp, lát nữa tôi gọi lại.",
        pronunciation_focus: [
          "TO-long sam-PAI-kan, NAN-ti SA-ya te-LE-pon LA-gi — `sampaikan` = chuyển lời; `telepon lagi` = gọi lại.",
          "Mẹo: `nanti` = lát nữa (trong hôm nay); khác `besok` (ngày mai). Hứa gọi lại trong ngày dùng `nanti`.",
          "Lỗi người Việt: đọc `telepon` thành 'te-le-phôn'. Tiếng Indonesia là 'te-LE-pon', `p` rõ.",
          "Luyện: `Nanti saya telepon lagi.`",
        ],
        pronunciation_focus_en: [
          "TO-long sam-PAI-kan, NAN-ti SA-ya te-LE-pon LA-gi — `sampaikan` = pass on (a message); `telepon lagi` = call again.",
          "Tip: `nanti` = later today; different from `besok` (tomorrow). Promising a same-day callback uses `nanti`.",
          "VN-speaker trap: saying 'te-le-phone'. In Indonesian it's 'te-LE-pon', a clean `p`.",
          "Drill: `Nanti saya telepon lagi.`",
        ],
      },
      // ── Line quality / signal trouble ─────────────────────────────────────
      {
        en: "Maaf, suaranya putus-putus. Bisa ulangi?",
        vi: "Xin lỗi, tiếng bị đứt quãng. Anh nói lại được không?",
        pronunciation_focus: [
          "ma-AF, su-A-ra-nya PU-tus-PU-tus. BI-sa u-LA-ngi — `putus-putus` = chập chờn/đứt quãng (từ láy).",
          "Mẹo từ láy: lặp `putus` → `putus-putus` = đứt liên tục, chập chờn. Lặp từ là điểm ngữ pháp Indonesia.",
          "Lỗi người Việt: nói `suara putus` (một lần). Để diễn tả 'cứ đứt mãi', lặp: `putus-putus`.",
          "Luyện: `Suaranya putus-putus, bisa ulangi?`",
        ],
        pronunciation_focus_en: [
          "ma-AF, su-A-ra-nya PU-tus-PU-tus. BI-sa u-LA-ngi — `putus-putus` = keeps cutting out (reduplication).",
          "Reduplication tip: doubling `putus` → `putus-putus` = repeatedly breaking up. Doubling is a core Indonesian feature.",
          "VN-speaker trap: saying `suara putus` (once). For 'keeps cutting out' double it: `putus-putus`.",
          "Drill: `Suaranya putus-putus, bisa ulangi?`",
        ],
      },
      {
        en: "Sinyalnya jelek, nanti saya hubungi lewat WhatsApp.",
        vi: "Sóng yếu quá, lát nữa tôi liên lạc qua WhatsApp.",
        pronunciation_focus: [
          "si-NYAL-nya JE-lek, NAN-ti SA-ya hu-BU-ngi LE-wat WA — `sinyal` = sóng; `hubungi` = liên lạc; `lewat` = qua.",
          "Mẹo affix: `hubungi` từ gốc `hubung` (kết nối) + `-i`; `menghubungi` = liên hệ với ai.",
          "Lỗi người Việt: đọc `ny` trong `sinyal` thành 'n-y' tách. `ny` là một âm như 'nh' tiếng Việt (nhà).",
          "Luyện: `Nanti saya hubungi lewat WhatsApp.`",
        ],
        pronunciation_focus_en: [
          "si-NYAL-nya JE-lek, NAN-ti SA-ya hu-BU-ngi LE-wat WA — `sinyal` = signal; `hubungi` = contact; `lewat` = via.",
          "Affix tip: `hubungi` from root `hubung` (to connect) + `-i`; `menghubungi` = to contact someone.",
          "VN-speaker trap: splitting `ny` in `sinyal`. `ny` is one sound, like Vietnamese 'nh' in 'nhà'.",
          "Drill: `Nanti saya hubungi lewat WhatsApp.`",
        ],
      },
      // ── Customer service / hotline ────────────────────────────────────────
      {
        en: "Saya mau komplain soal pulsa yang hilang.",
        vi: "Tôi muốn khiếu nại về tiền điện thoại bị mất.",
        pronunciation_focus: [
          "SA-ya MAU kom-PLAIN so-AL PUL-sa yang HI-lang — `komplain` = khiếu nại; `pulsa` = tiền/thẻ điện thoại.",
          "Mẹo: `pulsa` là tiền nạp để gọi/nhắn; `kuota` là dung lượng data — đừng lẫn hai từ.",
          "Lỗi người Việt: dùng `tiền telepon`. Người Indonesia luôn nói `pulsa`.",
          "Luyện: `Saya mau komplain soal pulsa.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU kom-PLAIN so-AL PUL-sa yang HI-lang — `komplain` = to complain; `pulsa` = phone credit.",
          "Tip: `pulsa` is prepaid credit for calls/texts; `kuota` is the data allowance — don't mix them.",
          "VN-speaker trap: saying `tiền telepon`. Indonesians always say `pulsa`.",
          "Drill: `Saya mau komplain soal pulsa.`",
        ],
      },
      {
        en: "Nomor pelanggan saya 0812-3456-7890.",
        vi: "Số khách hàng của tôi là 0812-3456-7890.",
        pronunciation_focus: [
          "NO-mor pe-LANG-gan SA-ya kosong DE-la-pan SA-tu DU-a... — `nomor pelanggan` = số khách hàng.",
          "Mẹo số: số 0 đọc là `kosong` (rỗng) khi đọc số điện thoại, không phải `nol`.",
          "Lỗi người Việt: đọc 0 là 'không/nol'. Khi đọc số điện thoại, người Indonesia nói `kosong`.",
          "Luyện: `kosong, delapan, satu, dua...`",
        ],
        pronunciation_focus_en: [
          "NO-mor pe-LANG-gan SA-ya kosong DE-la-pan SA-tu DU-a... — `nomor pelanggan` = customer number.",
          "Number tip: the digit 0 is read `kosong` (empty) when reading phone numbers, not `nol`.",
          "VN-speaker trap: reading 0 as 'nol'. For phone numbers Indonesians say `kosong`.",
          "Drill: `kosong, delapan, satu, dua...`",
        ],
      },
      {
        en: "Baik, masalahnya sudah dicatat. Terima kasih.",
        vi: "Vâng, vấn đề đã được ghi nhận. Cảm ơn.",
        pronunciation_focus: [
          "BA-ik, ma-sa-LAH-nya SU-dah di-CA-tat. te-RI-ma KA-sih — `dicatat` = được ghi lại; `sudah` = đã rồi.",
          "Mẹo: `c` trong `dicatat` đọc là 'ch' → 'di-CHA-tat'. Đây là bẫy phát âm kinh điển.",
          "Lỗi người Việt: đọc `c` thành 'k' hay 's'. Trong tiếng Indonesia `c` LUÔN là 'ch'.",
          "Luyện: `Masalahnya sudah dicatat.`",
        ],
        pronunciation_focus_en: [
          "BA-ik, ma-sa-LAH-nya SU-dah di-CA-tat. te-RI-ma KA-sih — `dicatat` = has been recorded; `sudah` = already.",
          "Tip: `c` in `dicatat` is 'ch' → 'di-CHA-tat'. A classic pronunciation trap.",
          "VN-speaker trap: reading `c` as 'k' or 's'. In Indonesian `c` is ALWAYS 'ch'.",
          "Drill: `Masalahnya sudah dicatat.`",
        ],
      },
      // ── Ending the call ───────────────────────────────────────────────────
      {
        en: "Terima kasih atas waktunya. Selamat siang.",
        vi: "Cảm ơn anh đã dành thời gian. Chào buổi trưa.",
        pronunciation_focus: [
          "te-RI-ma KA-sih A-tas WAK-tu-nya. se-la-mat SI-ang — `atas waktunya` = vì (đã dành) thời gian.",
          "Mẹo: kết thúc cuộc gọi lịch sự bằng `terima kasih atas waktunya` rồi một lời chào theo giờ.",
          "Lỗi người Việt: cúp máy mà không chào. Người Indonesia luôn chào `selamat siang/sore` trước khi tắt.",
          "Luyện: `Terima kasih atas waktunya.`",
        ],
        pronunciation_focus_en: [
          "te-RI-ma KA-sih A-tas WAK-tu-nya. se-la-mat SI-ang — `atas waktunya` = for your time.",
          "Tip: close a call politely with `terima kasih atas waktunya` then a time-of-day greeting.",
          "VN-speaker trap: hanging up with no sign-off. Indonesians always say `selamat siang/sore` first.",
          "Drill: `Terima kasih atas waktunya.`",
        ],
      },
    ],
    vocabulary: [
      // Core call actions
      {
        word: "telepon",
        en: "telephone / to call",
        vi: "điện thoại / gọi điện",
        pos: "noun/verb",
        pronunciation_vi: "te-LE-pon — đọc `p` rõ, không phải 'phôn'; khẩu ngữ `telpon`",
        pronunciation_en: "te-LE-pon — clear `p`, not 'phone'; casual spelling `telpon`",
      },
      {
        word: "menelepon",
        en: "to make a call",
        vi: "gọi điện (cho ai)",
        pos: "verb",
        pronunciation_vi: "me-ne-LE-pon — meN- + telepon; `menelepon teman` = gọi cho bạn",
        pronunciation_en: "me-ne-LE-pon — meN- + telepon; `menelepon teman` = to call a friend",
      },
      {
        word: "menghubungi",
        en: "to contact / reach",
        vi: "liên lạc / liên hệ",
        pos: "verb",
        pronunciation_vi: "meng-hu-BU-ngi — gốc `hubung` (kết nối)",
        pronunciation_en: "meng-hu-BU-ngi — root `hubung` (to connect)",
      },
      {
        word: "halo",
        en: "hello (on the phone)",
        vi: "alô",
        pos: "interjection",
        pronunciation_vi: "HA-lo — y hệt 'alô' tiếng Việt",
        pronunciation_en: "HA-lo — the same as English 'hello'",
      },
      {
        word: "pesan",
        en: "message",
        vi: "lời nhắn / tin nhắn",
        pos: "noun",
        pronunciation_vi: "PE-san — `meninggalkan pesan` = để lại lời nhắn; cũng nghĩa 'đặt/gọi món'",
        pronunciation_en: "PE-san — `meninggalkan pesan` = leave a message; also means 'to order'",
      },
      {
        word: "menyambungkan",
        en: "to put through / connect",
        vi: "nối máy / chuyển máy",
        pos: "verb",
        pronunciation_vi: "me-nyam-BUNG-kan — gốc `sambung` (nối)",
        pronunciation_en: "me-nyam-BUNG-kan — root `sambung` (to join)",
      },
      {
        word: "sebentar",
        en: "a moment / briefly",
        vi: "một lát",
        pos: "adverb",
        pronunciation_vi: "se-ben-TAR — `tunggu sebentar` = chờ một lát; khẩu ngữ `bentar`",
        pronunciation_en: "se-ben-TAR — `tunggu sebentar` = wait a moment; casual `bentar`",
      },
      {
        word: "beliau",
        en: "he/she (respectful)",
        vi: "ông/bà ấy (kính trọng)",
        pos: "pronoun",
        pronunciation_vi: "be-LI-au — dùng cho người đáng kính; trang trọng hơn `dia`",
        pronunciation_en: "be-LI-au — for someone respected; more formal than `dia`",
      },
      // Customer service & phone admin
      {
        word: "pelanggan",
        en: "customer / subscriber",
        vi: "khách hàng / thuê bao",
        pos: "noun",
        pronunciation_vi: "pe-LANG-gan — `nomor pelanggan` = số khách hàng",
        pronunciation_en: "pe-LANG-gan — `nomor pelanggan` = customer number",
      },
      {
        word: "layanan pelanggan",
        en: "customer service",
        vi: "dịch vụ khách hàng",
        pos: "noun",
        pronunciation_vi: "la-YA-nan pe-LANG-gan — gốc `layan` (phục vụ)",
        pronunciation_en: "la-YA-nan pe-LANG-gan — root `layan` (to serve)",
      },
      {
        word: "komplain / keluhan",
        en: "complaint",
        vi: "khiếu nại / phàn nàn",
        pos: "noun",
        pronunciation_vi: "kom-PLAIN / ke-LU-han — `komplain` khẩu ngữ, `keluhan` trang trọng",
        pronunciation_en: "kom-PLAIN / ke-LU-han — `komplain` is casual, `keluhan` formal",
      },
      {
        word: "pulsa",
        en: "phone credit / airtime",
        vi: "tiền/thẻ điện thoại",
        pos: "noun",
        pronunciation_vi: "PUL-sa — `beli pulsa` = nạp thẻ; khác `kuota` (data)",
        pronunciation_en: "PUL-sa — `beli pulsa` = top up; different from `kuota` (data)",
      },
      {
        word: "kuota",
        en: "data quota",
        vi: "dung lượng data",
        pos: "noun",
        pronunciation_vi: "ku-O-ta — dung lượng internet; `kuota habis` = hết data",
        pronunciation_en: "ku-O-ta — internet data; `kuota habis` = out of data",
      },
      {
        word: "sinyal",
        en: "signal / reception",
        vi: "sóng",
        pos: "noun",
        pronunciation_vi: "si-NYAL — `ny` như 'nh'; `sinyal jelek` = sóng yếu",
        pronunciation_en: "si-NYAL — `ny` like Vietnamese 'nh'; `sinyal jelek` = bad signal",
      },
      {
        word: "nomor",
        en: "number",
        vi: "số",
        pos: "noun",
        pronunciation_vi: "NO-mor — `salah nomor` = gọi nhầm số; khẩu ngữ `nomer`",
        pronunciation_en: "NO-mor — `salah nomor` = wrong number; casual `nomer`",
      },
      {
        word: "kosong",
        en: "zero (in phone numbers) / empty",
        vi: "số 0 / trống",
        pos: "number/adj.",
        pronunciation_vi: "ko-SONG — đọc số 0 trong số điện thoại; không dùng `nol`",
        pronunciation_en: "ko-SONG — the digit 0 in phone numbers; not `nol`",
      },
      // Providers & connection
      {
        word: "Telkomsel",
        en: "Telkomsel (largest mobile carrier)",
        vi: "Telkomsel (nhà mạng lớn nhất)",
        pos: "proper noun",
        pronunciation_vi: "TEL-kom-sel — nhà mạng phủ sóng rộng nhất Indonesia",
        pronunciation_en: "TEL-kom-sel — Indonesia's widest-coverage carrier",
      },
      {
        word: "operator / provider",
        en: "mobile network operator",
        vi: "nhà mạng",
        pos: "noun",
        pronunciation_vi: "o-pe-RA-tor — Telkomsel, Indosat, XL, Tri là các nhà mạng chính",
        pronunciation_en: "o-pe-RA-tor — Telkomsel, Indosat, XL, Tri are the main carriers",
      },
      {
        word: "salah sambung",
        en: "wrong number (mis-connected)",
        vi: "gọi nhầm máy",
        pos: "phrase",
        pronunciation_vi: "SA-lah SAM-bung — nói khi bấm nhầm số",
        pronunciation_en: "SA-lah SAM-bung — say it when you've dialed the wrong line",
      },
      {
        word: "putus",
        en: "cut off / disconnected",
        vi: "đứt / mất kết nối",
        pos: "verb/adj.",
        pronunciation_vi: "PU-tus — `teleponnya putus` = cuộc gọi bị rớt; láy `putus-putus` = chập chờn",
        pronunciation_en: "PU-tus — `teleponnya putus` = the call dropped; reduplicated `putus-putus` = choppy",
      },
    ],
    dialogue: [
      // Calling a company, the person is out, leaving a message
      {
        speaker: "Penerima",
        text: "Halo, PT Maju Jaya, selamat pagi. Ada yang bisa dibantu?",
        vi: "Alô, công ty Maju Jaya, chào buổi sáng. Tôi có thể giúp gì ạ?",
        en: "Hello, PT Maju Jaya, good morning. How can I help?",
      },
      {
        speaker: "Penelepon",
        text: "Selamat pagi. Bisa bicara dengan Ibu Sari?",
        vi: "Chào buổi sáng. Cho tôi nói chuyện với chị Sari được không?",
        en: "Good morning. May I speak with Ms. Sari?",
      },
      {
        speaker: "Penerima",
        text: "Maaf, ini dengan siapa, ya?",
        vi: "Xin lỗi, cho hỏi đây là ai ạ?",
        en: "Sorry, who's calling, please?",
      },
      {
        speaker: "Penelepon",
        text: "Saya Hùng dari Vietnam, rekan kerja Bu Sari.",
        vi: "Tôi là Hùng từ Việt Nam, đồng nghiệp của chị Sari.",
        en: "This is Hung from Vietnam, Ms. Sari's colleague.",
      },
      {
        speaker: "Penerima",
        text: "Mohon tunggu sebentar... Maaf, beliau sedang rapat.",
        vi: "Xin chờ một lát... Xin lỗi, chị ấy đang họp.",
        en: "One moment please... Sorry, she's in a meeting.",
      },
      {
        speaker: "Penelepon",
        text: "Apakah saya bisa meninggalkan pesan?",
        vi: "Tôi có thể để lại lời nhắn được không?",
        en: "May I leave a message?",
      },
      {
        speaker: "Penerima",
        text: "Tentu. Silakan, nanti saya sampaikan.",
        vi: "Tất nhiên. Anh nói đi, lát nữa tôi chuyển lời.",
        en: "Of course. Go ahead, I'll pass it on.",
      },
      {
        speaker: "Penelepon",
        text: "Tolong sampaikan, nanti saya telepon lagi jam dua. Terima kasih atas waktunya.",
        vi: "Làm ơn nhắn lại, hai giờ chiều tôi gọi lại. Cảm ơn anh đã dành thời gian.",
        en: "Please tell her I'll call again at two o'clock. Thank you for your time.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Cho tôi nói chuyện với anh Budi được không?", answer: "Bisa bicara dengan Pak Budi?" },
          { prompt: "Tôi có thể để lại lời nhắn không?", answer: "Apakah saya bisa meninggalkan pesan?" },
          { prompt: "Xin chờ một lát.", answer: "Mohon tunggu sebentar." },
          { prompt: "Lát nữa tôi gọi lại.", answer: "Nanti saya telepon lagi." },
          { prompt: "Xin lỗi, đây là ai ạ?", answer: "Maaf, ini dengan siapa, ya?" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Indonesia:",
        instruction_en: "Extra practice — translate into Indonesian:",
        items: [
          { prompt: "Tiếng bị đứt quãng.", answer: "Suaranya putus-putus." },
          { prompt: "Sóng yếu quá.", answer: "Sinyalnya jelek." },
          { prompt: "Tôi muốn khiếu nại về tiền điện thoại.", answer: "Saya mau komplain soal pulsa." },
          { prompt: "Anh ấy đang không có ở đây.", answer: "Beliau sedang tidak ada di tempat." },
          { prompt: "Cảm ơn anh đã dành thời gian.", answer: "Terima kasih atas waktunya." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Điền `dengan`, `bisa`, hay `sebentar` cho đúng:",
        instruction_en:
          "Fill in `dengan`, `bisa`, or `sebentar`:",
        items: [
          { prompt: "Bisa bicara ___ Pak Budi?", answer: "dengan", hint: "nói chuyện VỚI ai" },
          { prompt: "Apakah saya ___ meninggalkan pesan?", answer: "bisa", hint: "có THỂ làm gì" },
          { prompt: "Mohon tunggu ___, saya sambungkan.", answer: "sebentar", hint: "chờ một LÁT" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn từ đúng: `beliau` (kính trọng) hay `dia` (trung tính); `pulsa` (tiền gọi) hay `kuota` (data):",
        instruction_en:
          "Pick the right word: `beliau` (respectful) vs `dia` (neutral); `pulsa` (call credit) vs `kuota` (data):",
        items: [
          { prompt: "Maaf, ___ sedang rapat. (nói về sếp)", answer: "beliau", hint: "người đáng kính → beliau" },
          { prompt: "Saya mau komplain, ___ saya hilang. (tiền gọi)", answer: "pulsa", hint: "tiền nạp gọi/nhắn" },
          { prompt: "Internet lambat, ___ hampir habis. (data)", answer: "kuota", hint: "dung lượng data" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung để lại lời nhắn — điền chỗ trống: `Halo, saya ___ dari ___. Bisa bicara dengan ___? ... Kalau begitu, tolong sampaikan nanti saya telepon lagi jam ___.`",
        instruction_en:
          "Leave-a-message frame — fill the blanks: `Halo, saya ___ dari ___. Bisa bicara dengan ___? ... Kalau begitu, tolong sampaikan nanti saya telepon lagi jam ___.`",
        example:
          "Halo, saya Hùng dari Vietnam. Bisa bicara dengan Bu Sari? Kalau begitu, tolong sampaikan nanti saya telepon lagi jam dua.",
        example_vi:
          "Alô, tôi là Hùng từ Việt Nam. Cho tôi nói chuyện với chị Sari được không? Vậy thì làm ơn nhắn lại, hai giờ tôi gọi lại.",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra — bạn xử lý được cuộc gọi này chưa?",
        instruction_en: "Self-check — can you handle each part of a call?",
        items: [
          { vi: "Tôi có thể mở đầu lịch sự và xin gặp ai đó.", en: "I can open politely and ask for someone." },
          { vi: "Tôi có thể hỏi đầu dây bên kia là ai.", en: "I can ask who is calling." },
          { vi: "Tôi có thể xin để lại lời nhắn.", en: "I can ask to leave a message." },
          { vi: "Tôi có thể nói sóng yếu / tiếng đứt quãng.", en: "I can say the signal is bad / the line is choppy." },
          { vi: "Tôi phân biệt được `pulsa` và `kuota`.", en: "I can tell `pulsa` from `kuota`." },
          { vi: "Tôi đọc được số 0 là `kosong` trong số điện thoại.", en: "I can read 0 as `kosong` in a phone number." },
          { vi: "Tôi có thể kết thúc cuộc gọi lịch sự.", en: "I can end the call politely." },
        ],
      },
    ],
    cultural_notes_vi:
      "Người Indonesia mở đầu cuộc gọi bằng `Halo` rồi một lời chào theo giờ (`selamat pagi/siang/sore/malam`). Trên điện thoại, hỏi `ini dengan siapa?` (đây là ai ạ?) lịch sự hơn nhiều so với `kamu siapa?`. Với người đáng kính (sếp, khách, người lớn tuổi) dùng `beliau` thay cho `dia`. Một thực tế quan trọng: ngày nay phần lớn liên lạc ở Indonesia diễn ra qua WhatsApp (`WA`) — gọi thoại trực tiếp thường dành cho việc gấp hoặc trang trọng, nên câu `nanti saya hubungi lewat WhatsApp` cực kỳ thông dụng. Khi đọc số điện thoại, số 0 luôn đọc là `kosong`, không phải `nol`. Hotline nhà mạng Telkomsel là 188; cấp cứu chung là 112.",
    cultural_notes_en:
      "Indonesians open a call with `Halo` then a time-of-day greeting (`selamat pagi/siang/sore/malam`). On the phone, `ini dengan siapa?` ('who is this?') is far more polite than `kamu siapa?`. For someone you respect (boss, client, elder) use `beliau` instead of `dia`. One key reality: most communication in Indonesia now happens over WhatsApp (`WA`) — actual voice calls are reserved for urgent or formal matters, so `nanti saya hubungi lewat WhatsApp` is extremely common. When reading a phone number, 0 is always `kosong`, never `nol`. Telkomsel's hotline is 188; the general emergency line is 112.",
    tip_advice_vi:
      "Ba mảnh ghép cố định của một cuộc gọi lịch sự: (1) MỞ — `Halo, selamat [giờ]. Bisa bicara dengan ___?`; (2) khi người ta vắng — `Apakah saya bisa meninggalkan pesan?` hoặc `Nanti saya telepon lagi`; (3) ĐÓNG — `Terima kasih atas waktunya`. Nhớ cụm `bicara dengan` (luôn có `dengan`) và `telepon` đọc `p` rõ, không phải 'phôn'. Mẹo người Việt cuối: chữ `c` trong `dicatat`, `bicara` đọc là 'ch' — `bicara` = 'bi-CHA-ra'.",
    tip_advice_en:
      "Three fixed pieces of a polite call: (1) OPEN — `Halo, selamat [time]. Bisa bicara dengan ___?`; (2) if they're out — `Apakah saya bisa meninggalkan pesan?` or `Nanti saya telepon lagi`; (3) CLOSE — `Terima kasih atas waktunya`. Lock in `bicara dengan` (always keep `dengan`) and a clean `p` in `telepon`, not 'phone'. Final VN-speaker tip: the `c` in `dicatat`, `bicara` is 'ch' — `bicara` = 'bi-CHA-ra'.",
  },
];

export default lessons;
