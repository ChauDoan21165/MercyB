// Email & Messaging Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (construction-worker.ts, family-relationships.ts…),
// which in turn mirror the French `FrenchLesson` shape. When the shared Indonesian
// registry (src/languages/indonesian/lessons.ts) lands, swap the local types for a
// shared import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// Topic: written communication — formal vs informal email, WhatsApp (`WA`) etiquette,
// business writing, and the formal letter (`surat resmi`). The big idea for Vietnamese
// learners is REGISTER: the gap between formal Bahasa baku (`Dengan hormat`, `mohon`,
// `Bapak/Ibu`) and chat slang (`gpp`, `oke siap`, `makasih ya`) is huge, and using the
// wrong one is a real social mistake. Vietnamese speakers already split formal/casual by
// pronoun, so the instinct transfers — only the words change.

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

// Loosely typed so per-type fields (translation, fill_blank, checklist) can vary.
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
    id: "indonesian_email_messaging",
    level: "B1",
    category: "communication",
    title_vi: "Email và nhắn tin",
    title_en: "Email and messaging",
    sentences: [
      // ── Formal email: opening ───────────────────────────────────────────
      {
        en: "Dengan hormat, perkenalkan nama saya Linh.",
        vi: "Kính thưa, tôi xin tự giới thiệu, tôi tên là Linh.",
        pronunciation_focus: [
          "DE-ngan HOR-mat, per-ke-NAL-kan NA-ma SA-ya Linh — `Dengan hormat` = câu mở thư trang trọng cố định (lit. 'với sự tôn trọng'); `perkenalkan` = xin giới thiệu.",
          "Mẹo: thư công việc LUÔN mở bằng `Dengan hormat,` rồi xuống dòng — như 'Kính gửi' của tiếng Việt.",
          "Lỗi người Việt: mở email công việc bằng `Hai` hay `Halo`. Quá thân mật — dùng `Dengan hormat`.",
          "Luyện: `Dengan hormat, perkenalkan nama saya Linh.`",
        ],
        pronunciation_focus_en: [
          "DE-ngan HOR-mat, per-ke-NAL-kan NA-ma SA-ya Linh — `Dengan hormat` = the fixed formal letter opener (lit. 'with respect'); `perkenalkan` = allow me to introduce.",
          "Tip: business emails ALWAYS open with `Dengan hormat,` then a line break — like 'Dear Sir/Madam'.",
          "VN-speaker trap: opening a work email with `Hai` or `Halo`. Too casual — use `Dengan hormat`.",
          "Drill: `Dengan hormat, perkenalkan nama saya Linh.`",
        ],
      },
      {
        en: "Saya menulis email ini sehubungan dengan lowongan pekerjaan.",
        vi: "Tôi viết email này liên quan đến vị trí tuyển dụng.",
        pronunciation_focus: [
          "SA-ya me-NU-lis e-MAIL I-ni se-hu-BU-ngan DE-ngan lo-WO-ngan pe-ker-JA-an — `sehubungan dengan` = liên quan đến; `lowongan pekerjaan` = vị trí tuyển dụng.",
          "Mẹo: `sehubungan dengan` là cụm trang trọng để nêu lý do viết — học nguyên cụm.",
          "Lỗi người Việt: dùng `tentang` (về) cho thư trang trọng. `Sehubungan dengan` trang trọng hơn nhiều.",
          "Luyện: `Saya menulis email ini sehubungan dengan lowongan pekerjaan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya me-NU-lis e-MAIL I-ni se-hu-BU-ngan DE-ngan lo-WO-ngan pe-ker-JA-an — `sehubungan dengan` = with regard to; `lowongan pekerjaan` = job vacancy.",
          "Tip: `sehubungan dengan` is the formal phrase that states why you're writing — learn it whole.",
          "VN-speaker trap: using `tentang` (about) in a formal letter. `Sehubungan dengan` is far more formal.",
          "Drill: `Saya menulis email ini sehubungan dengan lowongan pekerjaan.`",
        ],
      },
      {
        en: "Bersama email ini, saya lampirkan CV dan portofolio saya.",
        vi: "Kèm theo email này, tôi đính kèm CV và hồ sơ năng lực của tôi.",
        pronunciation_focus: [
          "ber-SA-ma e-MAIL I-ni, SA-ya lam-PIR-kan CV dan por-to-FO-li-o SA-ya — `bersama email ini` = kèm theo email này; `lampirkan` = đính kèm; `lampiran` = tệp đính kèm.",
          "Mẹo: `lampirkan` (đính kèm) ↔ `terlampir` (được đính kèm). Cùng gốc `lampir`, khác phụ tố.",
          "Lỗi người Việt: nói `saya kirim file`. Trang trọng dùng `saya lampirkan` (đính kèm).",
          "Luyện: `Bersama email ini, saya lampirkan CV dan portofolio saya.`",
        ],
        pronunciation_focus_en: [
          "ber-SA-ma e-MAIL I-ni, SA-ya lam-PIR-kan CV dan por-to-FO-li-o SA-ya — `bersama email ini` = with this email; `lampirkan` = to attach; `lampiran` = attachment.",
          "Tip: `lampirkan` (to attach) ↔ `terlampir` (attached). Same root `lampir`, different affix.",
          "VN-speaker trap: saying `saya kirim file`. Formally, use `saya lampirkan` (I attach).",
          "Drill: `Bersama email ini, saya lampirkan CV dan portofolio saya.`",
        ],
      },
      {
        en: "Mohon informasinya dapat segera dikirimkan.",
        vi: "Kính mong thông tin được gửi sớm.",
        pronunciation_focus: [
          "MO-hon in-for-MA-si-nya DA-pat se-GE-ra di-KI-rim-kan — `mohon` = kính mong (trang trọng nhất); `dikirimkan` = được gửi (bị động `di-`).",
          "Mẹo: thang lịch sự của 'làm ơn': `mohon` (rất trang trọng) > `tolong` (bình thường) > `tolong … dong` (nài, thân).",
          "Lỗi người Việt: dùng `tolong` trong email trang trọng. `Mohon` mới đúng tông trang trọng.",
          "Luyện: `Mohon informasinya dapat segera dikirimkan.`",
        ],
        pronunciation_focus_en: [
          "MO-hon in-for-MA-si-nya DA-pat se-GE-ra di-KI-rim-kan — `mohon` = kindly request (most formal); `dikirimkan` = be sent (di- passive).",
          "Tip: the 'please' politeness ladder: `mohon` (very formal) > `tolong` (neutral) > `tolong … dong` (pleading, casual).",
          "VN-speaker trap: using `tolong` in a formal email. `Mohon` is the right formal register.",
          "Drill: `Mohon informasinya dapat segera dikirimkan.`",
        ],
      },
      {
        en: "Atas perhatian Bapak/Ibu, saya ucapkan terima kasih.",
        vi: "Cảm ơn sự quan tâm của quý ông/quý bà.",
        pronunciation_focus: [
          "A-tas per-ha-TI-an BA-pak/I-bu, SA-ya u-CAP-kan te-ri-ma KA-sih — câu chốt thư cố định; `atas perhatian` = về sự quan tâm; `ucapkan terima kasih` = xin cảm ơn.",
          "Mẹo: viết `Bapak/Ibu` khi chưa biết người nhận là nam hay nữ — tương đương 'Quý ông/Quý bà'.",
          "Lỗi người Việt: kết thư bằng `makasih ya`. Quá suồng sã — dùng cả câu trang trọng này.",
          "Luyện: `Atas perhatian Bapak/Ibu, saya ucapkan terima kasih.`",
        ],
        pronunciation_focus_en: [
          "A-tas per-ha-TI-an BA-pak/I-bu, SA-ya u-CAP-kan te-ri-ma KA-sih — the fixed sign-off; `atas perhatian` = for your attention; `ucapkan terima kasih` = I express thanks.",
          "Tip: write `Bapak/Ibu` when you don't know the recipient's gender — like 'Sir/Madam'.",
          "VN-speaker trap: closing with `makasih ya`. Far too casual — use this full formal line.",
          "Drill: `Atas perhatian Bapak/Ibu, saya ucapkan terima kasih.`",
        ],
      },
      {
        en: "Hormat saya, Linh.",
        vi: "Kính thư, Linh.",
        pronunciation_focus: [
          "HOR-mat SA-ya, Linh — chữ ký trang trọng cuối thư (lit. 'sự kính trọng của tôi'); + tên người gửi.",
          "Mẹo: `Hormat saya,` (Kính thư) cho thư rất trang trọng; `Salam,` (Trân trọng) cho công việc thông thường; `Terima kasih,` cho email nửa thân mật.",
          "Lỗi người Việt: ký `Best regards` lẫn vào thư tiếng Indonesia. Dùng `Hormat saya,` hoặc `Salam,`.",
          "Luyện: `Hormat saya, Linh.`",
        ],
        pronunciation_focus_en: [
          "HOR-mat SA-ya, Linh — the formal closing signature (lit. 'my respect'); + the sender's name.",
          "Tip: `Hormat saya,` (Respectfully) for very formal; `Salam,` (Regards) for ordinary business; `Terima kasih,` for semi-casual email.",
          "VN-speaker trap: signing off with English `Best regards` in an Indonesian letter. Use `Hormat saya,` or `Salam,`.",
          "Drill: `Hormat saya, Linh.`",
        ],
      },
      // ── WhatsApp / informal ─────────────────────────────────────────────
      {
        en: "Halo Kak, maaf mengganggu. Boleh tanya sebentar?",
        vi: "Chào anh/chị, xin lỗi làm phiền. Hỏi chút được không ạ?",
        pronunciation_focus: [
          "HA-lo kak, ma-AF meng-GANG-gu. BO-leh TA-nya se-ben-TAR — `maaf mengganggu` = xin lỗi làm phiền (mở chat lịch sự); `Kak` = anh/chị.",
          "Mẹo: dù là chat, người Indonesia vẫn mở bằng `maaf mengganggu` cho lịch sự — đừng vào thẳng câu hỏi.",
          "Lỗi người Việt: nhắn cụt lủn 'mày ở đâu'. Mở bằng lời chào + `maaf mengganggu` mới hợp văn hóa.",
          "Luyện: `Halo Kak, maaf mengganggu. Boleh tanya sebentar?`",
        ],
        pronunciation_focus_en: [
          "HA-lo kak, ma-AF meng-GANG-gu. BO-leh TA-nya se-ben-TAR — `maaf mengganggu` = sorry to bother you (polite chat opener); `Kak` = older sibling/you.",
          "Tip: even in chat, Indonesians open with `maaf mengganggu` for politeness — don't dive straight into the question.",
          "VN-speaker trap: a blunt 'where are you'. A greeting + `maaf mengganggu` fits the culture.",
          "Drill: `Halo Kak, maaf mengganggu. Boleh tanya sebentar?`",
        ],
      },
      {
        en: "Oke siap, nanti aku kabari ya.",
        vi: "Ok được, lát tôi báo lại nhé.",
        pronunciation_focus: [
          "O-ke SI-ap, NAN-ti A-ku ka-BA-ri ya — `oke siap` = ok, sẵn sàng (khẩu ngữ chat); `kabari` = báo tin; `aku` = tôi (thân mật).",
          "Mẹo: chat dùng `aku/kamu` (tôi/bạn, thân) thay `saya/Anda` (trang trọng). Đuôi `ya` làm câu mềm, thân thiện.",
          "Lỗi người Việt: dùng `saya` với bạn thân — nghe xa cách. Bạn bè dùng `aku` (hay `gue` ở Jakarta).",
          "Luyện: `Oke siap, nanti aku kabari ya.`",
        ],
        pronunciation_focus_en: [
          "O-ke SI-ap, NAN-ti A-ku ka-BA-ri ya — `oke siap` = okay, will do (chat idiom); `kabari` = to let (someone) know; `aku` = I (casual).",
          "Tip: chat uses `aku/kamu` (casual I/you) instead of `saya/Anda` (formal). The tag `ya` softens it, makes it friendly.",
          "VN-speaker trap: using `saya` with a close friend — sounds distant. Friends use `aku` (or `gue` in Jakarta).",
          "Drill: `Oke siap, nanti aku kabari ya.`",
        ],
      },
      {
        en: "Maaf, baru bales. Tadi lagi sibuk banget.",
        vi: "Xin lỗi, giờ mới rep. Nãy bận quá.",
        pronunciation_focus: [
          "ma-AF, BA-ru BA-les. TA-di LA-gi si-BUK BA-nget — `bales` = trả lời (khẩu ngữ của `balas`); `lagi` = đang; `banget` = cực kỳ (slang).",
          "Mẹo: chat rút gọn nhiều: `balas`→`bales`, `sedang`→`lagi`, `sangat`→`banget`. Đây là baku ≠ gaul.",
          "Lỗi người Việt: học mỗi từ baku rồi không hiểu chat. Cần biết cả `bales`, `banget`, `gpp` để đọc tin nhắn thật.",
          "Luyện: `Maaf, baru bales. Tadi lagi sibuk banget.`",
        ],
        pronunciation_focus_en: [
          "ma-AF, BA-ru BA-les. TA-di LA-gi si-BUK BA-nget — `bales` = to reply (casual for `balas`); `lagi` = currently; `banget` = very (slang).",
          "Tip: chat clips a lot: `balas`→`bales`, `sedang`→`lagi`, `sangat`→`banget`. This is baku vs gaul.",
          "VN-speaker trap: learning only baku and then not understanding chat. You need `bales`, `banget`, `gpp` to read real texts.",
          "Drill: `Maaf, baru bales. Tadi lagi sibuk banget.`",
        ],
      },
      {
        en: "Gpp Kak, santai aja. Makasih ya infonya.",
        vi: "Không sao anh, cứ thoải mái. Cảm ơn thông tin nhé.",
        pronunciation_focus: [
          "ge-pe-PE kak, san-TAI A-ja. ma-KA-sih ya in-FO-nya — `gpp` = `gak apa-apa` (không sao); `santai aja` = cứ thoải mái; `makasih` = cảm ơn (rút gọn).",
          "Mẹo: viết tắt chat phổ biến — `gpp` (không sao), `gw/gue` (tôi), `yg` (cái mà), `dgn` (với), `udh` (đã rồi).",
          "Lỗi người Việt: bê `gpp`, `makasih`, `aja` vào email công việc. Những từ này CHỈ dùng chat thân mật.",
          "Luyện: `Gpp Kak, santai aja. Makasih ya infonya.`",
        ],
        pronunciation_focus_en: [
          "ge-pe-PE kak, san-TAI A-ja. ma-KA-sih ya in-FO-nya — `gpp` = `gak apa-apa` (no problem); `santai aja` = just relax; `makasih` = thanks (clipped).",
          "Tip: common chat abbreviations — `gpp` (no problem), `gw/gue` (I), `yg` (which/that), `dgn` (with), `udh` (already).",
          "VN-speaker trap: carrying `gpp`, `makasih`, `aja` into a work email. These are chat-only, casual words.",
          "Drill: `Gpp Kak, santai aja. Makasih ya infonya.`",
        ],
      },
      // ── Semi-formal business chat ───────────────────────────────────────
      {
        en: "Selamat pagi, Pak. Mohon konfirmasi jadwal rapat besok.",
        vi: "Chào buổi sáng, anh. Xin xác nhận lịch họp ngày mai ạ.",
        pronunciation_focus: [
          "se-LA-mat PA-gi, pak. MO-hon kon-fir-MA-si JAD-wal RA-pat be-SOK — `mohon konfirmasi` = xin xác nhận; `jadwal rapat` = lịch họp; `besok` = ngày mai.",
          "Mẹo: chat công việc (WA với sếp) là tông NỬA trang trọng — vẫn `Pak/Bu` + `mohon`, nhưng ngắn gọn hơn thư.",
          "Lỗi người Việt: lẫn lộn hai tông. Với sếp qua WA: lịch sự nhưng gọn; với bạn: thoải mái dùng slang.",
          "Luyện: `Selamat pagi, Pak. Mohon konfirmasi jadwal rapat besok.`",
        ],
        pronunciation_focus_en: [
          "se-LA-mat PA-gi, pak. MO-hon kon-fir-MA-si JAD-wal RA-pat be-SOK — `mohon konfirmasi` = please confirm; `jadwal rapat` = meeting schedule; `besok` = tomorrow.",
          "Tip: work chat (WA with your boss) is SEMI-formal — still `Pak/Bu` + `mohon`, but shorter than a letter.",
          "VN-speaker trap: blurring the two registers. With a boss on WA: polite but brief; with friends: slang is fine.",
          "Drill: `Selamat pagi, Pak. Mohon konfirmasi jadwal rapat besok.`",
        ],
      },
      {
        en: "Baik, Pak. Saya tunggu balasannya. Terima kasih.",
        vi: "Vâng ạ. Em chờ phản hồi. Cảm ơn anh.",
        pronunciation_focus: [
          "BA-ik, pak. SA-ya TUNG-gu ba-LA-san-nya. te-ri-ma KA-sih — `balasan` = phản hồi/thư trả lời; `saya tunggu` = tôi chờ.",
          "Mẹo: `balasan` (danh từ: lời hồi đáp) từ gốc `balas` + `-an`. Phụ tố `-an` biến động từ thành danh từ.",
          "Lỗi người Việt: kết thúc WA công việc cụt ngủn 'ok'. Câu `Terima kasih` đầy đủ vẫn nên có.",
          "Luyện: `Baik, Pak. Saya tunggu balasannya. Terima kasih.`",
        ],
        pronunciation_focus_en: [
          "BA-ik, pak. SA-ya TUNG-gu ba-LA-san-nya. te-ri-ma KA-sih — `balasan` = a reply/response; `saya tunggu` = I'll wait.",
          "Tip: `balasan` (noun: a reply) from root `balas` + `-an`. The `-an` suffix turns a verb into a noun.",
          "VN-speaker trap: ending a work WA with a curt 'ok'. A full `Terima kasih` is still expected.",
          "Drill: `Baik, Pak. Saya tunggu balasannya. Terima kasih.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Giao tiếp viết ở Indonesia chia ba tầng rõ rệt. (1) Thư/email trang trọng (`surat resmi`): mở `Dengan hormat,`, dùng `Bapak/Ibu`, `mohon`, đầy thể bị động `di-`, chốt bằng `Atas perhatiannya, terima kasih` + `Hormat saya,`. Không viết tắt, không slang. (2) Chat công việc (thường qua `WhatsApp`/`WA`): nửa trang trọng — vẫn `Pak/Bu` và `mohon`, nhưng ngắn, thường mở bằng `Selamat pagi/siang`. (3) Chat bạn bè: cực thoải mái — `aku/kamu` (hoặc `gue/lu` ở Jakarta), viết tắt `gpp`, `udh`, `yg`, slang `banget`, và emoji/`wkwk` (cười). WhatsApp gần như thay thế email cho việc cá nhân và cả nhiều việc kinh doanh nhỏ; gọi điện thì ít được ưa hơn nhắn tin. Lưu ý: bắt đầu chat bằng lời chào và `maaf mengganggu` (xin lỗi làm phiền) là phép lịch sự cơ bản — vào thẳng vấn đề bị xem là hơi cộc.",
    cultural_notes_en:
      "Written communication in Indonesia splits into three clear tiers. (1) Formal letter/email (`surat resmi`): open with `Dengan hormat,`, use `Bapak/Ibu`, `mohon`, plenty of di- passive, close with `Atas perhatiannya, terima kasih` + `Hormat saya,`. No abbreviations, no slang. (2) Work chat (usually over `WhatsApp`/`WA`): semi-formal — still `Pak/Bu` and `mohon`, but short, often opening with `Selamat pagi/siang`. (3) Friend chat: very relaxed — `aku/kamu` (or `gue/lu` in Jakarta), abbreviations `gpp`, `udh`, `yg`, slang `banget`, and emoji/`wkwk` (laughing). WhatsApp has largely replaced email for personal and even much small-business matters; phone calls are less favored than texting. Note: opening a chat with a greeting and `maaf mengganggu` (sorry to bother you) is basic courtesy — diving straight in reads as a bit blunt.",
    tip_advice_vi:
      "Trước khi gõ, hãy tự hỏi: 'Đây là tầng nào?' rồi chọn bộ từ. Trang trọng → `Dengan hormat` / `Bapak/Ibu` / `mohon` / `Hormat saya`. Công việc qua WA → `Selamat pagi, Pak` / `mohon` / `Terima kasih`. Bạn bè → `Halo` / `aku` / `makasih ya` / `gpp`. Người Việt có lợi thế: bạn ĐÃ có bản năng tách lịch sự theo đại từ (tôi/em/mày), nên chỉ cần đổi sang `saya↔aku`, `Anda↔kamu`. Ba điều cấm kỵ: (1) đừng đưa slang (`gpp`, `banget`) vào email công việc; (2) đừng viết tắt (`yg`, `dgn`) trong thư trang trọng; (3) đừng dùng `kamu`/`gue` với người lớn tuổi hay cấp trên. Và nhớ: thư trang trọng đầy bị động `di-` (`dikirimkan`, `dilampirkan`) — nhận ra nó là chìa khóa đọc hiểu.",
    tip_advice_en:
      "Before you type, ask: 'Which tier is this?' then pick the word set. Formal → `Dengan hormat` / `Bapak/Ibu` / `mohon` / `Hormat saya`. Work via WA → `Selamat pagi, Pak` / `mohon` / `Terima kasih`. Friends → `Halo` / `aku` / `makasih ya` / `gpp`. Vietnamese speakers have an edge: you ALREADY split politeness by pronoun (tôi/em/mày), so just map `saya↔aku`, `Anda↔kamu`. Three taboos: (1) don't drop slang (`gpp`, `banget`) into a work email; (2) don't abbreviate (`yg`, `dgn`) in a formal letter; (3) don't use `kamu`/`gue` with elders or superiors. And remember: formal letters are full of the di- passive (`dikirimkan`, `dilampirkan`) — recognizing it is the key to reading them.",
    vocabulary: [
      // ── Formal email frame ──────────────────────────────────────────
      {
        word: "dengan hormat",
        en: "respectfully (formal opener)",
        vi: "kính thưa / trân trọng",
        pos: "phrase",
        pronunciation_vi: "DE-ngan HOR-mat — mở mọi thư trang trọng",
        pronunciation_en: "DE-ngan HOR-mat — opens every formal letter",
      },
      {
        word: "surat resmi",
        en: "formal/official letter",
        vi: "thư/văn bản chính thức",
        pos: "noun phrase",
        pronunciation_vi: "SU-rat RES-mi — `resmi` = chính thức",
        pronunciation_en: "SU-rat RES-mi — `resmi` = official",
      },
      {
        word: "perihal",
        en: "subject / re:",
        vi: "về việc / chủ đề",
        pos: "noun",
        pronunciation_vi: "pe-ri-HAL — dòng 'Subject' trong thư",
        pronunciation_en: "pe-ri-HAL — the 'Subject' line of a letter",
      },
      {
        word: "sehubungan dengan",
        en: "with regard to",
        vi: "liên quan đến",
        pos: "phrase",
        pronunciation_vi: "se-hu-BU-ngan DE-ngan — nêu lý do viết",
        pronunciation_en: "se-hu-BU-ngan DE-ngan — states the reason for writing",
      },
      {
        word: "mohon",
        en: "kindly request (most formal)",
        vi: "kính mong / xin",
        pos: "verb",
        pronunciation_vi: "MO-hon — trang trọng hơn `tolong`",
        pronunciation_en: "MO-hon — more formal than `tolong`",
      },
      {
        word: "melampirkan",
        en: "to attach (a file)",
        vi: "đính kèm",
        pos: "verb",
        pronunciation_vi: "me-lam-PIR-kan — `lampiran` = tệp đính kèm; `terlampir` = được đính kèm",
        pronunciation_en: "me-lam-PIR-kan — `lampiran` = attachment; `terlampir` = attached",
      },
      {
        word: "balasan",
        en: "reply / response",
        vi: "phản hồi / thư trả lời",
        pos: "noun",
        pronunciation_vi: "ba-LA-san — gốc `balas` + `-an`; `membalas` = trả lời",
        pronunciation_en: "ba-LA-san — root `balas` + `-an`; `membalas` = to reply",
      },
      {
        word: "hormat saya",
        en: "respectfully yours (sign-off)",
        vi: "kính thư",
        pos: "phrase",
        pronunciation_vi: "HOR-mat SA-ya — chữ ký trang trọng; `Salam,` cho mức nhẹ hơn",
        pronunciation_en: "HOR-mat SA-ya — formal sign-off; `Salam,` for a lighter level",
      },
      // ── Work / business ─────────────────────────────────────────────
      {
        word: "konfirmasi",
        en: "to confirm / confirmation",
        vi: "xác nhận",
        pos: "verb/noun",
        pronunciation_vi: "kon-fir-MA-si — `mohon konfirmasi` = xin xác nhận",
        pronunciation_en: "kon-fir-MA-si — `mohon konfirmasi` = please confirm",
      },
      {
        word: "jadwal",
        en: "schedule",
        vi: "lịch / thời gian biểu",
        pos: "noun",
        pronunciation_vi: "JAD-wal — `jadwal rapat` = lịch họp",
        pronunciation_en: "JAD-wal — `jadwal rapat` = meeting schedule",
      },
      {
        word: "tindak lanjut",
        en: "follow-up",
        vi: "theo dõi / xử lý tiếp",
        pos: "noun phrase",
        pronunciation_vi: "TIN-dak LAN-jut — `menindaklanjuti` = theo dõi tiếp",
        pronunciation_en: "TIN-dak LAN-jut — `menindaklanjuti` = to follow up on",
      },
      {
        word: "lowongan pekerjaan",
        en: "job vacancy",
        vi: "vị trí tuyển dụng",
        pos: "noun phrase",
        pronunciation_vi: "lo-WO-ngan pe-ker-JA-an — `lowongan` = chỗ trống",
        pronunciation_en: "lo-WO-ngan pe-ker-JA-an — `lowongan` = an opening",
      },
      // ── Chat / WhatsApp ─────────────────────────────────────────────
      {
        word: "maaf mengganggu",
        en: "sorry to bother you",
        vi: "xin lỗi làm phiền",
        pos: "phrase",
        pronunciation_vi: "ma-AF meng-GANG-gu — mở chat lịch sự",
        pronunciation_en: "ma-AF meng-GANG-gu — polite chat opener",
      },
      {
        word: "membalas / bales",
        en: "to reply (formal / casual)",
        vi: "trả lời tin nhắn",
        pos: "verb",
        pronunciation_vi: "mem-ba-LAS / BA-les — `bales` chỉ dùng chat",
        pronunciation_en: "mem-ba-LAS / BA-les — `bales` is chat-only",
      },
      {
        word: "gpp (gak apa-apa)",
        en: "no problem / it's fine",
        vi: "không sao",
        pos: "phrase (slang)",
        pronunciation_vi: "ge-pe-PE — viết tắt chat; baku: `tidak apa-apa`",
        pronunciation_en: "ge-pe-PE — chat abbreviation; baku: `tidak apa-apa`",
      },
      {
        word: "makasih (ya)",
        en: "thanks (casual)",
        vi: "cảm ơn (thân mật)",
        pos: "phrase (slang)",
        pronunciation_vi: "ma-KA-sih — rút từ `terima kasih`; đuôi `ya` cho thân",
        pronunciation_en: "ma-KA-sih — clipped from `terima kasih`; tag `ya` softens it",
      },
      {
        word: "aja (saja)",
        en: "just / only (casual)",
        vi: "thôi / chỉ (khẩu ngữ)",
        pos: "particle (slang)",
        pronunciation_vi: "A-ja — `santai aja` = cứ thoải mái; baku: `saja`",
        pronunciation_en: "A-ja — `santai aja` = just relax; baku: `saja`",
      },
      {
        word: "japri",
        en: "to DM / private message",
        vi: "nhắn riêng",
        pos: "verb (slang)",
        pronunciation_vi: "JAP-ri — `jaringan pribadi`; 'nhắn riêng đi'",
        pronunciation_en: "JAP-ri — from `jaringan pribadi`; 'DM me'",
      },
      {
        word: "chat / WA",
        en: "to text / WhatsApp",
        vi: "nhắn tin / WhatsApp",
        pos: "verb/noun",
        pronunciation_vi: "chet / we-A — `WA` đọc 'we-A'; 'WA aku ya' = nhắn WA cho tôi nhé",
        pronunciation_en: "chet / way-AH — `WA` said 'way-AH'; 'WA aku ya' = WhatsApp me",
      },
      // ── Register signposts ──────────────────────────────────────────
      {
        word: "Bapak/Ibu",
        en: "Sir/Madam (unknown recipient)",
        vi: "quý ông/quý bà",
        pos: "title",
        pronunciation_vi: "BA-pak/I-bu — dùng khi chưa biết nam hay nữ",
        pronunciation_en: "BA-pak/I-bu — use when recipient's gender is unknown",
      },
      {
        word: "saya / aku",
        en: "I (formal / casual)",
        vi: "tôi (trang trọng / thân)",
        pos: "pronoun",
        pronunciation_vi: "SA-ya / A-ku — `saya` cho thư; `aku` cho bạn",
        pronunciation_en: "SA-ya / A-ku — `saya` for letters; `aku` for friends",
      },
      {
        word: "Anda / kamu",
        en: "you (formal / casual)",
        vi: "ông-bà / bạn",
        pos: "pronoun",
        pronunciation_vi: "AN-da / KA-mu — `Anda` trang trọng; `kamu` thân",
        pronunciation_en: "AN-da / KA-mu — `Anda` formal; `kamu` casual",
      },
      {
        word: "wkwk / wkwkwk",
        en: "lol / haha (typed laugh)",
        vi: "haha (cười khi chat)",
        pos: "interjection (slang)",
        pronunciation_vi: "we-ka-we-ka — chỉ dùng chat thân mật",
        pronunciation_en: "wek-wek — chat-only, very casual",
      },
    ],
    dialogue: [
      // Dialogue A: a formal job-application email, read aloud
      {
        speaker: "Pelamar (email)",
        text: "Dengan hormat, sehubungan dengan lowongan pekerjaan, saya lampirkan CV saya. Mohon dapat dipertimbangkan. Hormat saya, Linh.",
        vi: "Kính thưa, liên quan đến vị trí tuyển dụng, tôi xin đính kèm CV. Kính mong được xem xét. Kính thư, Linh.",
        en: "Respectfully, regarding the job vacancy, I attach my CV. Please kindly consider it. Respectfully yours, Linh.",
      },
      {
        speaker: "HRD (email)",
        text: "Terima kasih atas lamarannya. Kami akan menindaklanjuti dalam satu minggu. Salam, Tim HRD.",
        vi: "Cảm ơn đơn ứng tuyển. Chúng tôi sẽ phản hồi trong một tuần. Trân trọng, Phòng Nhân sự.",
        en: "Thank you for your application. We'll follow up within a week. Regards, HR Team.",
      },
      // Dialogue B: the SAME person, now on WhatsApp with a friend
      {
        speaker: "Linh (WA)",
        text: "Halo, maaf mengganggu. Aku barusan kirim lamaran, deg-degan banget.",
        vi: "Chào, xin lỗi làm phiền. Tớ vừa gửi đơn ứng tuyển xong, hồi hộp quá.",
        en: "Hi, sorry to bother you. I just sent my application, so nervous.",
      },
      {
        speaker: "Teman (WA)",
        text: "Wkwk santai aja. Pasti dibales kok. Semangat ya!",
        vi: "Haha cứ thoải mái. Chắc chắn họ sẽ rep mà. Cố lên nhé!",
        en: "Haha relax. They'll definitely reply. Good luck!",
      },
      {
        speaker: "Linh (WA)",
        text: "Makasih ya. Eh nanti japri aku kalau ada lowongan lain dong.",
        vi: "Cảm ơn nhé. À lát có chỗ tuyển nào khác thì nhắn riêng tớ nha.",
        en: "Thanks. Oh, DM me later if there's another opening, okay?",
      },
      {
        speaker: "Teman (WA)",
        text: "Siap! Gpp, nanti aku kabari. 👍",
        vi: "Ok luôn! Không sao, lát tớ báo. 👍",
        en: "Got it! No worries, I'll let you know. 👍",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia (tông TRANG TRỌNG):",
        instruction_en: "Translate into Indonesian (FORMAL register):",
        items: [
          { prompt: "Kính thưa, tôi tên là Linh.", answer: "Dengan hormat, nama saya Linh." },
          { prompt: "Tôi đính kèm CV của tôi.", answer: "Saya lampirkan CV saya." },
          { prompt: "Kính mong thông tin được gửi sớm.", answer: "Mohon informasinya dapat segera dikirimkan." },
          { prompt: "Cảm ơn sự quan tâm của quý ông/quý bà.", answer: "Atas perhatian Bapak/Ibu, saya ucapkan terima kasih." },
          { prompt: "Kính thư, Linh.", answer: "Hormat saya, Linh." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia (tông CHAT THÂN MẬT):",
        instruction_en: "Translate into Indonesian (CASUAL chat register):",
        items: [
          { prompt: "Chào, xin lỗi làm phiền nhé.", answer: "Halo, maaf mengganggu ya." },
          { prompt: "Ok được, lát tớ báo lại.", answer: "Oke siap, nanti aku kabari." },
          { prompt: "Xin lỗi giờ mới rep, nãy bận quá.", answer: "Maaf baru bales, tadi sibuk banget." },
          { prompt: "Không sao, cứ thoải mái.", answer: "Gpp, santai aja." },
          { prompt: "Cảm ơn thông tin nhé.", answer: "Makasih ya infonya." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn từ đúng theo TÔNG: trang trọng dùng `mohon`/`saya`/`Anda`, thân mật dùng `tolong dong`/`aku`/`kamu`:",
        instruction_en:
          "Pick by REGISTER: formal uses `mohon`/`saya`/`Anda`, casual uses `tolong dong`/`aku`/`kamu`:",
        items: [
          { prompt: "(Email công việc) ___ konfirmasi jadwalnya, Pak.", answer: "Mohon", hint: "trang trọng = `mohon`" },
          { prompt: "(Chat bạn) Eh ___ kirim fotonya dong.", answer: "tolong", hint: "thân mật, có `dong`" },
          { prompt: "(Email) ___ menulis untuk melamar posisi ini.", answer: "saya", hint: "trang trọng = `saya`" },
          { prompt: "(Chat bạn) Nanti ___ kabari ya.", answer: "aku", hint: "thân mật = `aku`" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Khớp viết tắt/slang chat với dạng baku (chuẩn): `gpp`, `udh`, `yg`, `banget`:",
        instruction_en:
          "Match chat slang to its baku (standard) form: `gpp`, `udh`, `yg`, `banget`:",
        items: [
          { prompt: "`tidak apa-apa` → ___", answer: "gpp", hint: "không sao" },
          { prompt: "`sudah` → ___", answer: "udh", hint: "đã rồi" },
          { prompt: "`yang` → ___", answer: "yg", hint: "cái mà / người mà" },
          { prompt: "`sangat` → ___", answer: "banget", hint: "rất / cực kỳ" },
        ],
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra — bạn làm được chưa?",
        instruction_en: "Quick self-check — can you do each one?",
        items: [
          { vi: "Tôi mở được một email trang trọng bằng `Dengan hormat,`.", en: "I can open a formal email with `Dengan hormat,`." },
          { vi: "Tôi chốt được thư bằng `Atas perhatiannya…` + `Hormat saya,`.", en: "I can close a letter with `Atas perhatiannya…` + `Hormat saya,`." },
          { vi: "Tôi phân biệt `mohon` (trang trọng) và `tolong` (thường).", en: "I can tell `mohon` (formal) from `tolong` (neutral)." },
          { vi: "Tôi mở chat lịch sự bằng `maaf mengganggu`.", en: "I can open a chat politely with `maaf mengganggu`." },
          { vi: "Tôi đọc hiểu slang chat: `gpp`, `bales`, `banget`, `wkwk`.", en: "I can read chat slang: `gpp`, `bales`, `banget`, `wkwk`." },
          { vi: "Tôi KHÔNG nhầm slang chat vào email công việc.", en: "I do NOT mix chat slang into a work email." },
        ],
      },
    ],
  },
];

export default lessons;
