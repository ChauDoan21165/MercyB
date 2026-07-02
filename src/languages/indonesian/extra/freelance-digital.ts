// Freelance & Digital Work Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files. When the shared Indonesian registry
// (src/languages/indonesian/lessons.ts) lands, swap the local types for a shared
// import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// Freelance/digital Indonesian blends English loanwords (`freelancer`, `invoice`,
// `deadline`, `revisi`) with chat-register politeness (`Kak`, `ya`, `mohon`).
// Vietnamese WIN: no conjugation/gender/tone — quotes and updates stay short.
// Traps: `c` = "ch" (`cair` = "cha-ir" → funds clearing), the `meN-/di-` pair on
// work verbs (`mengerjakan`/`dikerjakan`), and money nouns built on `pe-...-an`
// / `pem-...-an` (`pembayaran`, `pekerjaan`).

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
    id: "indonesian_freelance_digital",
    level: "B1",
    category: "work",
    title_vi: "Tiếng Indonesia cho freelance và làm việc số",
    title_en: "Freelance and digital work Indonesian",
    sentences: [
      // ── Pitching & scoping a project ───────────────────────────────────
      {
        en: "Halo, Kak. Saya freelancer desain grafis.",
        vi: "Chào bạn. Mình là freelancer thiết kế đồ họa.",
        pronunciation_focus: [
          "HA-lo, kak. SA-ya free-LAN-cer de-SAIN GRA-fis — `Kak` = cách gọi đối tác thân thiện; `desain grafis` = thiết kế đồ họa.",
          "Lỗi người Việt: gọi khách/đối tác bằng `kamu`. Trong làm ăn dùng `Kak` hoặc `Pak/Bu`, không `kamu`.",
          "Luyện: `Halo, Kak. Saya freelancer desain grafis.`",
        ],
        pronunciation_focus_en: [
          "HA-lo, kak. SA-ya free-LAN-cer de-SAIN GRA-fis — `Kak` = friendly address for a contact; `desain grafis` = graphic design.",
          "VN-speaker trap: calling a client `kamu`. In business use `Kak` or `Pak/Bu`, not `kamu`.",
          "Drill: `Halo, Kak. Saya freelancer desain grafis.`",
        ],
      },
      {
        en: "Boleh saya tahu detail proyeknya?",
        vi: "Mình có thể biết chi tiết dự án không ạ?",
        pronunciation_focus: [
          "BO-leh SA-ya TA-hu DE-tail pro-YEK-nya — `boleh saya tahu …?` = mẫu lịch sự xin thông tin; `proyek` = dự án.",
          "Lỗi người Việt: hỏi cộc `apa proyeknya?`. Mở bằng `boleh saya tahu …?` cho lịch sự, chuyên nghiệp.",
          "Luyện: `Boleh saya tahu detail proyeknya?`",
        ],
        pronunciation_focus_en: [
          "BO-leh SA-ya TA-hu DE-tail pro-YEK-nya — `boleh saya tahu …?` = polite info-request frame; `proyek` = project.",
          "VN-speaker trap: blunt `apa proyeknya?`. Open with `boleh saya tahu …?` to sound polite and professional.",
          "Drill: `Boleh saya tahu detail proyeknya?`",
        ],
      },
      {
        en: "Berapa anggaran dan tenggat waktunya?",
        vi: "Ngân sách và hạn chót là bao nhiêu/khi nào ạ?",
        pronunciation_focus: [
          "be-RA-pa ANG-ga-ran dan TENG-gat WAK-tu-nya — `anggaran` = ngân sách; `tenggat waktu` = hạn chót (cũng nói `deadline`).",
          "Lỗi người Việt: nói `budget` và `deadline` (chêm Anh). Từ chuẩn: `anggaran`, `tenggat waktu`.",
          "Luyện: `Berapa anggaran dan tenggat waktunya?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa ANG-ga-ran dan TENG-gat WAK-tu-nya — `anggaran` = budget; `tenggat waktu` = deadline (also `deadline`).",
          "VN-speaker trap: code-switching to `budget`/`deadline`. The standard words: `anggaran`, `tenggat waktu`.",
          "Drill: `Berapa anggaran dan tenggat waktunya?`",
        ],
      },
      // ── Quoting, scope, terms ──────────────────────────────────────────
      {
        en: "Tarif saya lima ratus ribu per desain.",
        vi: "Phí của mình năm trăm nghìn mỗi thiết kế.",
        pronunciation_focus: [
          "TA-rif SA-ya LI-ma RA-tus RI-bu per de-SAIN — `tarif` = mức phí/biểu giá; `per desain` = mỗi thiết kế.",
          "Lỗi người Việt: nói `harga jasa` cho phí giờ/đơn vị. `tarif` chính xác hơn cho 'mức phí'.",
          "Luyện: `Tarif saya lima ratus ribu per desain.`",
        ],
        pronunciation_focus_en: [
          "TA-rif SA-ya LI-ma RA-tus RI-bu per de-SAIN — `tarif` = rate/fee; `per desain` = per design.",
          "VN-speaker trap: `harga jasa` for a per-unit rate. `tarif` is the precise word for 'rate'.",
          "Drill: `Tarif saya lima ratus ribu per desain.`",
        ],
      },
      {
        en: "Harga itu sudah termasuk dua kali revisi.",
        vi: "Giá đó đã bao gồm hai lần chỉnh sửa.",
        pronunciation_focus: [
          "HAR-ga I-tu SU-dah ter-MA-suk DU-a KA-li re-VI-si — `termasuk` = bao gồm; `revisi` = chỉnh sửa; `dua kali` = hai lần.",
          "Lỗi người Việt: bỏ phần giới hạn revisi. Luôn nói rõ số lần để tránh sửa vô hạn — `sudah termasuk … revisi`.",
          "Luyện: `Harga itu sudah termasuk dua kali revisi.`",
        ],
        pronunciation_focus_en: [
          "HAR-ga I-tu SU-dah ter-MA-suk DU-a KA-li re-VI-si — `termasuk` = included; `revisi` = revision; `dua kali` = twice.",
          "VN-speaker trap: leaving the revision limit out. Always state the count to avoid endless edits — `sudah termasuk … revisi`.",
          "Drill: `Harga itu sudah termasuk dua kali revisi.`",
        ],
      },
      {
        en: "Saya minta DP lima puluh persen di awal.",
        vi: "Mình xin đặt cọc năm mươi phần trăm trước.",
        pronunciation_focus: [
          "SA-ya MIN-ta de-pe LI-ma PU-luh per-SEN di A-wal — `DP` (đọc 'de-pe') = tiền cọc/tạm ứng; `di awal` = lúc đầu.",
          "Lỗi người Việt: nói `uang muka` (đúng nhưng dài). Trong freelance quen dùng `DP` (down payment).",
          "Luyện: `Saya minta DP lima puluh persen di awal.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MIN-ta de-pe LI-ma PU-luh per-SEN di A-wal — `DP` (say 'day-pay') = deposit/down payment; `di awal` = upfront.",
          "VN-speaker trap: `uang muka` is right but long. Freelancers commonly say `DP` (down payment).",
          "Drill: `Saya minta DP lima puluh persen di awal.`",
        ],
      },
      // ── Doing the work & updates ───────────────────────────────────────
      {
        en: "Proyeknya sedang saya kerjakan.",
        vi: "Dự án mình đang làm.",
        pronunciation_focus: [
          "pro-YEK-nya se-DANG SA-ya ker-JA-kan — `sedang` = đang; `kerjakan` (gốc `kerja` + `-kan`) = làm/thực hiện (việc đó).",
          "Lỗi người Việt: nói `saya kerja proyek`. Tân ngữ là việc cụ thể → dùng `mengerjakan`/`saya kerjakan`.",
          "Luyện: `Proyeknya sedang saya kerjakan.`",
        ],
        pronunciation_focus_en: [
          "pro-YEK-nya se-DANG SA-ya ker-JA-kan — `sedang` = currently; `kerjakan` (root `kerja` + `-kan`) = to work on (it).",
          "VN-speaker trap: `saya kerja proyek`. With a specific object use `mengerjakan`/`saya kerjakan`.",
          "Drill: `Proyeknya sedang saya kerjakan.`",
        ],
      },
      {
        en: "Draf pertama akan saya kirim besok.",
        vi: "Bản nháp đầu tiên mình sẽ gửi vào ngày mai.",
        pronunciation_focus: [
          "draf per-TA-ma A-kan SA-ya KI-rim be-SOK — `draf` = bản nháp; `akan` = sẽ; `besok` = ngày mai.",
          "Lợi thế người Việt: `akan` = 'sẽ', `besok` = 'ngày mai' — không chia thì, chỉ thêm trạng từ thời gian.",
          "Luyện: `Draf pertama akan saya kirim besok.`",
        ],
        pronunciation_focus_en: [
          "draf per-TA-ma A-kan SA-ya KI-rim be-SOK — `draf` = draft; `akan` = will; `besok` = tomorrow.",
          "VN-speaker win: `akan` = 'will', `besok` = 'tomorrow' — no tense, just a time word.",
          "Drill: `Draf pertama akan saya kirim besok.`",
        ],
      },
      {
        en: "Mohon maaf, ada sedikit keterlambatan.",
        vi: "Thành thật xin lỗi, có một chút chậm trễ.",
        pronunciation_focus: [
          "MO-hon ma-AF, A-da se-DI-kit ke-ter-lam-BA-tan — `keterlambatan` = sự chậm trễ (khung `ke-...-an` trên `terlambat`).",
          "Lỗi người Việt: nói `saya telat`. Báo chuyên nghiệp dùng danh từ `keterlambatan` + `mohon maaf`.",
          "Luyện: `Mohon maaf, ada sedikit keterlambatan.`",
        ],
        pronunciation_focus_en: [
          "MO-hon ma-AF, A-da se-DI-kit ke-ter-lam-BA-tan — `keterlambatan` = a delay (the `ke-...-an` frame on `terlambat`).",
          "VN-speaker trap: casual `saya telat`. A professional notice uses the noun `keterlambatan` + `mohon maaf`.",
          "Drill: `Mohon maaf, ada sedikit keterlambatan.`",
        ],
      },
      {
        en: "Kita meeting online lewat Zoom, ya?",
        vi: "Mình họp online qua Zoom nhé?",
        pronunciation_focus: [
          "KI-ta MI-ting ON-lain LE-wat zoom — `kita` ở đây ĐÚNG (gồm cả người nghe — cùng họp); `lewat` = qua.",
          "Lưu ý người Việt: với đối tác cùng làm, `kita` (gồm cả họ) đúng; chỉ khi nói THAY công ty với khách mới dùng `kami`.",
          "Luyện: `Kita meeting online lewat Zoom, ya?`",
        ],
        pronunciation_focus_en: [
          "KI-ta MI-ting ON-line LE-wat zoom — `kita` here is CORRECT (includes the listener — meeting together); `lewat` = via.",
          "VN-speaker note: with a collaborating partner, `kita` (incl. them) is right; only `kami` when speaking FOR your company to a client.",
          "Drill: `Kita meeting online lewat Zoom, ya?`",
        ],
      },
      // ── Delivery, invoice, payment ─────────────────────────────────────
      {
        en: "Hasil akhirnya sudah saya kirim ke email Kakak.",
        vi: "Kết quả cuối cùng mình đã gửi vào email của bạn.",
        pronunciation_focus: [
          "HA-sil a-KHIR-nya SU-dah SA-ya KI-rim ke e-mail ka-KAK — `hasil akhir` = kết quả cuối; `ke email` = vào email.",
          "Lỗi người Việt: nói `di email`. Gửi TỚI/VÀO email dùng `ke`, không `di`.",
          "Luyện: `Hasil akhirnya sudah saya kirim ke email Kakak.`",
        ],
        pronunciation_focus_en: [
          "HA-sil a-KHIR-nya SU-dah SA-ya KI-rim ke e-mail ka-KAK — `hasil akhir` = final result; `ke email` = to the email.",
          "VN-speaker trap: `di email`. Sending TO an email uses `ke`, not `di`.",
          "Drill: `Hasil akhirnya sudah saya kirim ke email Kakak.`",
        ],
      },
      {
        en: "Ini invoice-nya, mohon segera dilunasi.",
        vi: "Đây là hóa đơn, mong thanh toán đầy đủ sớm ạ.",
        pronunciation_focus: [
          "I-ni in-VOIS-nya, MO-hon se-GE-ra di-lu-NA-si — `invoice` = hóa đơn; `dilunasi` (bị động) = được thanh toán hết; `segera` = sớm/ngay.",
          "Lỗi người Việt: nói `bayar semua`. Trả hết/tất toán chuyên nghiệp là `dilunasi` (gốc `lunas`).",
          "Luyện: `Ini invoice-nya, mohon segera dilunasi.`",
        ],
        pronunciation_focus_en: [
          "I-ni in-VOIS-nya, MO-hon se-GE-ra di-lu-NA-si — `invoice` = invoice; `dilunasi` (passive) = be paid in full; `segera` = soon/promptly.",
          "VN-speaker trap: `bayar semua`. 'Paid in full' professionally is `dilunasi` (root `lunas`).",
          "Drill: `Ini invoice-nya, mohon segera dilunasi.`",
        ],
      },
      {
        en: "Pembayaran bisa transfer ke rekening ini.",
        vi: "Thanh toán có thể chuyển khoản vào tài khoản này.",
        pronunciation_focus: [
          "pem-ba-YA-ran BI-sa TRANS-fer ke re-ke-NING I-ni — `pembayaran` = việc thanh toán; `rekening` = tài khoản ngân hàng.",
          "Lỗi người Việt: nói `akun bank` cho tài khoản nhận tiền. Tài khoản ngân hàng để chuyển khoản là `rekening`.",
          "Luyện: `Pembayaran bisa transfer ke rekening ini.`",
        ],
        pronunciation_focus_en: [
          "pem-ba-YA-ran BI-sa TRANS-fer ke re-ke-NING I-ni — `pembayaran` = payment; `rekening` = bank account.",
          "VN-speaker trap: `akun bank` for the receiving account. A bank account for transfers is `rekening`.",
          "Drill: `Pembayaran bisa transfer ke rekening ini.`",
        ],
      },
      {
        en: "Terima kasih, dananya sudah cair.",
        vi: "Cảm ơn bạn, tiền đã về (đã giải ngân).",
        pronunciation_focus: [
          "te-ri-MA KA-sih, DA-na-nya SU-dah CHA-ir — `dana` = quỹ/tiền; `cair` = (tiền) về/giải ngân, đọc 'cha-ir' vì `c`='ch'.",
          "Lỗi người Việt: đọc `cair` thành 'kai'. `cair` (lỏng → tiền về tài khoản) đọc 'cha-ir'.",
          "Luyện: `Terima kasih, dananya sudah cair.`",
        ],
        pronunciation_focus_en: [
          "te-ri-MA KA-sih, DA-na-nya SU-dah CHA-ir — `dana` = funds; `cair` = (funds) cleared/disbursed, read 'cha-ir' since `c`='ch'.",
          "VN-speaker trap: reading `cair` as 'kai'. `cair` (liquid → funds landing) is 'cha-ir'.",
          "Drill: `Terima kasih, dananya sudah cair.`",
        ],
      },
      {
        en: "Senang bekerja sama, semoga ada proyek lain lagi.",
        vi: "Rất vui được hợp tác, hy vọng có dự án khác nữa.",
        pronunciation_focus: [
          "se-NANG be-ker-ja-SA-ma, se-MO-ga A-da pro-YEK LA-in LA-gi — `bekerja sama` = hợp tác; `semoga` = mong/hy vọng; câu chốt mở đường tái hợp tác.",
          "Lỗi người Việt: chỉ nói `terima kasih`. Câu chốt chuyên nghiệp là `senang bekerja sama, semoga …`.",
          "Luyện: `Senang bekerja sama, semoga ada proyek lain lagi.`",
        ],
        pronunciation_focus_en: [
          "se-NANG be-ker-ja-SA-ma, se-MO-ga A-da pro-YEK LA-in LA-gi — `bekerja sama` = to collaborate; `semoga` = hopefully; the sign-off that invites repeat work.",
          "VN-speaker trap: stopping at `terima kasih`. The professional close is `senang bekerja sama, semoga …`.",
          "Drill: `Senang bekerja sama, semoga ada proyek lain lagi.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Thị trường freelance/làm việc số ở Indonesia đang bùng nổ: nhiều người làm từ xa (`kerja remote`) cho khách trong nước lẫn nước ngoài qua `Upwork`, `Fiverr`, `Sribulancer`, `Projects.co.id`, hoặc nhận việc trực tiếp qua Instagram/WhatsApp. Văn hóa chốt deal khá thân mật: gọi đối tác là `Kak`, chèn `ya`/`nih`, nhưng phần TIỀN phải rõ ràng — luôn nêu `tarif`, giới hạn `revisi` (số lần sửa), và xin `DP` (đặt cọc, thường 30–50%) trước khi bắt đầu để tránh khách 'biến mất'. Hóa đơn (`invoice`) và biên nhận giúp chuyên nghiệp hóa; thuế thu nhập freelancer khai qua `SPT`/`NPWP` nếu đã đăng ký. Không gian làm việc chung (`coworking space`) phổ biến ở Jakarta, Bandung, Bali (Canggu là 'thủ phủ digital nomad'). Lưu ý xưng `kami` (chúng tôi, không gồm khách) khi nói thay mình/agency với KHÁCH, nhưng `kita` (gồm cả họ) khi rủ đối tác cùng họp/cùng làm — đây là lỗi cực phổ biến của người Việt.",
    cultural_notes_en:
      "Indonesia's freelance/digital-work market is booming: many work remotely (`kerja remote`) for local and overseas clients via `Upwork`, `Fiverr`, `Sribulancer`, `Projects.co.id`, or land gigs directly through Instagram/WhatsApp. Deal-closing culture is fairly informal: call the contact `Kak`, soften with `ya`/`nih`, but the MONEY part must be crisp — always state your `tarif`, cap the `revisi` (revision count), and ask for a `DP` (deposit, usually 30–50%) upfront so clients don't vanish. Invoices (`invoice`) and receipts professionalize the relationship; freelancer income is declared via `SPT`/`NPWP` once registered. Coworking spaces (`coworking space`) are common in Jakarta, Bandung, and Bali (Canggu is the 'digital-nomad capital'). Note: use `kami` (we, excluding the client) when speaking for yourself/your agency TO a client, but `kita` (including them) when inviting a partner to meet/work together — a very common Vietnamese-speaker mistake.",
    tip_advice_vi:
      "Học theo dòng chảy một hợp đồng freelance: (1) chào + chuyên môn — `Saya freelancer ___`; (2) hỏi phạm vi — `Boleh saya tahu detail proyeknya? Berapa anggaran dan tenggat waktunya?`; (3) báo giá + điều kiện — `Tarif saya ___, sudah termasuk ___ revisi, minta DP ___% di awal`; (4) cập nhật — `Proyeknya sedang saya kerjakan. Draf akan saya kirim ___.`; (5) xin lỗi nếu trễ — `Mohon maaf, ada sedikit keterlambatan.`; (6) giao + hóa đơn — `Hasil akhirnya sudah saya kirim. Ini invoice-nya, mohon segera dilunasi.`; (7) chốt — `Terima kasih, dananya sudah cair. Senang bekerja sama.` Ba điểm cốt lõi cho người Việt: phân biệt `kami` (không gồm khách) vs `kita` (gồm cả người nghe); dùng `mengerjakan`/`saya kerjakan` cho việc cụ thể (không phải `kerja` trống); và `c`='ch' nên `cair`='cha-ir', `revisi` đọc 're-vi-si'. Đừng chêm tiếng Anh khi đã có từ chuẩn: `anggaran` (budget), `tenggat waktu` (deadline), `tarif` (rate).",
    tip_advice_en:
      "Follow the freelance-deal flow: (1) greet + specialty — `Saya freelancer ___`; (2) scope it — `Boleh saya tahu detail proyeknya? Berapa anggaran dan tenggat waktunya?`; (3) quote + terms — `Tarif saya ___, sudah termasuk ___ revisi, minta DP ___% di awal`; (4) update — `Proyeknya sedang saya kerjakan. Draf akan saya kirim ___.`; (5) apologize if late — `Mohon maaf, ada sedikit keterlambatan.`; (6) deliver + invoice — `Hasil akhirnya sudah saya kirim. Ini invoice-nya, mohon segera dilunasi.`; (7) close — `Terima kasih, dananya sudah cair. Senang bekerja sama.` Three core points for VN speakers: tell `kami` (excludes the client) from `kita` (includes the listener); use `mengerjakan`/`saya kerjakan` for a specific task (not bare `kerja`); and `c`='ch', so `cair`='cha-ir', `revisi`='re-vi-si'. Don't code-switch when a standard word exists: `anggaran` (budget), `tenggat waktu` (deadline), `tarif` (rate).",
    vocabulary: [
      // Roles & setup
      {
        word: "freelancer",
        en: "freelancer",
        vi: "người làm tự do",
        pos: "noun",
        pronunciation_vi: "free-LAN-cer — cũng nói `pekerja lepas`",
        pronunciation_en: "free-LAN-cer — also `pekerja lepas`",
      },
      {
        word: "klien",
        en: "client",
        vi: "khách hàng (dự án)",
        pos: "noun",
        pronunciation_vi: "kli-EN — gọi trực tiếp là `Kak`/`Pak`/`Bu`",
        pronunciation_en: "kli-EN — address them directly as `Kak`/`Pak`/`Bu`",
      },
      {
        word: "proyek",
        en: "project",
        vi: "dự án",
        pos: "noun",
        pronunciation_vi: "pro-YEK — `detail proyeknya` = chi tiết dự án",
        pronunciation_en: "pro-YEK — `detail proyeknya` = project details",
      },
      {
        word: "kerja remote",
        en: "remote work",
        vi: "làm việc từ xa",
        pos: "noun",
        pronunciation_vi: "KER-ja RE-mot — `coworking space` = không gian làm chung",
        pronunciation_en: "KER-ja RE-mote — `coworking space` = shared workspace",
      },
      // Money & terms
      {
        word: "tarif",
        en: "rate / fee",
        vi: "mức phí / biểu giá",
        pos: "noun",
        pronunciation_vi: "TA-rif — `tarif per jam` = phí mỗi giờ",
        pronunciation_en: "TA-rif — `tarif per jam` = hourly rate",
      },
      {
        word: "anggaran",
        en: "budget",
        vi: "ngân sách",
        pos: "noun",
        pronunciation_vi: "ANG-ga-ran — đừng chêm `budget`",
        pronunciation_en: "ANG-ga-ran — don't code-switch to `budget`",
      },
      {
        word: "tenggat waktu",
        en: "deadline",
        vi: "hạn chót",
        pos: "noun",
        pronunciation_vi: "TENG-gat WAK-tu — cũng nói `deadline`",
        pronunciation_en: "TENG-gat WAK-tu — also `deadline`",
      },
      {
        word: "DP (uang muka)",
        en: "deposit / down payment",
        vi: "tiền cọc / tạm ứng",
        pos: "noun",
        pronunciation_vi: "de-pe — `minta DP 50% di awal`",
        pronunciation_en: "day-pay — `minta DP 50% di awal`",
      },
      {
        word: "revisi",
        en: "revision / edit",
        vi: "chỉnh sửa",
        pos: "noun",
        pronunciation_vi: "re-VI-si — luôn giới hạn số lần: `dua kali revisi`",
        pronunciation_en: "re-VI-si — always cap the count: `dua kali revisi`",
      },
      // Delivery & payment
      {
        word: "invoice",
        en: "invoice",
        vi: "hóa đơn",
        pos: "noun",
        pronunciation_vi: "in-VOIS — `mohon segera dilunasi`",
        pronunciation_en: "in-VOICE — `mohon segera dilunasi`",
      },
      {
        word: "rekening",
        en: "bank account",
        vi: "tài khoản ngân hàng",
        pos: "noun",
        pronunciation_vi: "re-ke-NING — KHÁC `akun` (tài khoản app); `transfer ke rekening`",
        pronunciation_en: "re-ke-NING — NOT `akun` (an app account); `transfer ke rekening`",
      },
      {
        word: "cair",
        en: "(funds) cleared / disbursed",
        vi: "(tiền) về / giải ngân",
        pos: "verb / adjective",
        pronunciation_vi: "CHA-ir — `c`='ch'; `dananya sudah cair`",
        pronunciation_en: "CHA-ir — `c`='ch'; `dananya sudah cair`",
      },
      {
        word: "mengerjakan",
        en: "to work on / do (a task)",
        vi: "thực hiện / làm (việc cụ thể)",
        pos: "verb",
        pronunciation_vi: "me-nger-JA-kan — gốc `kerja` + `meN-...-kan`; bị động `dikerjakan`",
        pronunciation_en: "me-nger-JA-kan — root `kerja` + `meN-...-kan`; passive `dikerjakan`",
      },
      {
        word: "keterlambatan",
        en: "delay",
        vi: "sự chậm trễ",
        pos: "noun",
        pronunciation_vi: "ke-ter-lam-BA-tan — khung `ke-...-an` trên `terlambat`",
        pronunciation_en: "ke-ter-lam-BA-tan — `ke-...-an` frame on `terlambat`",
      },
      {
        word: "bekerja sama",
        en: "to collaborate / work together",
        vi: "hợp tác",
        pos: "verb",
        pronunciation_vi: "be-KER-ja SA-ma — `senang bekerja sama` câu chốt",
        pronunciation_en: "be-KER-ja SA-ma — `senang bekerja sama` as a sign-off",
      },
    ],
    dialogue: [
      // Dialogue: scoping, quoting, delivering a freelance design job
      {
        speaker: "Klien",
        text: "Halo, Kak. Saya butuh desain logo untuk kafe baru saya.",
        vi: "Chào bạn. Mình cần thiết kế logo cho quán cà phê mới.",
        en: "Hi. I need a logo design for my new café.",
      },
      {
        speaker: "Freelancer",
        text: "Halo, Kak. Boleh saya tahu konsep dan tenggat waktunya?",
        vi: "Chào bạn. Mình có thể biết concept và hạn chót không ạ?",
        en: "Hi. May I know the concept and the deadline?",
      },
      {
        speaker: "Klien",
        text: "Konsepnya minimalis, warna cokelat. Anggaran sekitar satu juta. Butuh dalam dua minggu.",
        vi: "Concept tối giản, màu nâu. Ngân sách khoảng một triệu. Cần trong hai tuần.",
        en: "Minimalist concept, brown tones. Budget around one million. Needed in two weeks.",
      },
      {
        speaker: "Freelancer",
        text: "Baik. Tarif saya satu juta, sudah termasuk tiga kali revisi. Saya minta DP lima puluh persen di awal.",
        vi: "Được. Phí của mình một triệu, đã gồm ba lần chỉnh sửa. Mình xin cọc năm mươi phần trăm trước.",
        en: "Alright. My rate is one million, including three revisions. I'll need a fifty percent deposit upfront.",
      },
      {
        speaker: "Klien",
        text: "Setuju. DP-nya saya transfer hari ini. Kita meeting online dulu, ya?",
        vi: "Đồng ý. Cọc mình chuyển hôm nay. Mình họp online trước nhé?",
        en: "Agreed. I'll transfer the deposit today. Shall we have an online meeting first?",
      },
      {
        speaker: "Freelancer",
        text: "Boleh, lewat Zoom besok jam dua. Draf pertama akan saya kirim minggu depan.",
        vi: "Được, qua Zoom mai hai giờ. Bản nháp đầu mình sẽ gửi tuần sau.",
        en: "Sure, via Zoom tomorrow at two. I'll send the first draft next week.",
      },
      {
        speaker: "Freelancer",
        text: "Hasil akhirnya sudah saya kirim ke email Kakak. Ini invoice-nya, mohon segera dilunasi, ya.",
        vi: "Kết quả cuối mình đã gửi vào email bạn. Đây hóa đơn, mong thanh toán nốt sớm nhé.",
        en: "The final result is in your email. Here's the invoice, please settle it soon.",
      },
      {
        speaker: "Klien",
        text: "Sudah saya lunasi. Hasilnya bagus! Senang bekerja sama, Kak.",
        vi: "Mình thanh toán hết rồi. Kết quả đẹp lắm! Rất vui được hợp tác.",
        en: "I've paid in full. Great result! Glad to work with you.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Mình có thể biết chi tiết dự án không?", answer: "Boleh saya tahu detail proyeknya?" },
          { prompt: "Phí của mình năm trăm nghìn mỗi thiết kế.", answer: "Tarif saya lima ratus ribu per desain." },
          { prompt: "Giá đó đã bao gồm hai lần chỉnh sửa.", answer: "Harga itu sudah termasuk dua kali revisi." },
          { prompt: "Mình xin đặt cọc năm mươi phần trăm trước.", answer: "Saya minta DP lima puluh persen di awal." },
          { prompt: "Đây là hóa đơn, mong thanh toán đầy đủ sớm.", answer: "Ini invoice-nya, mohon segera dilunasi." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Indonesia:",
        instruction_en: "Extra practice — translate into Indonesian:",
        items: [
          { prompt: "Dự án mình đang làm.", answer: "Proyeknya sedang saya kerjakan." },
          { prompt: "Bản nháp đầu tiên mình sẽ gửi vào ngày mai.", answer: "Draf pertama akan saya kirim besok." },
          { prompt: "Thành thật xin lỗi, có một chút chậm trễ.", answer: "Mohon maaf, ada sedikit keterlambatan." },
          { prompt: "Thanh toán có thể chuyển khoản vào tài khoản này.", answer: "Pembayaran bisa transfer ke rekening ini." },
          { prompt: "Cảm ơn bạn, tiền đã về.", answer: "Terima kasih, dananya sudah cair." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Điền `kami` hay `kita` cho đúng (chúng tôi, không gồm khách / chúng ta, gồm cả người nghe):",
        instruction_en:
          "Fill in `kami` or `kita` (we-excluding-client / we-including-listener):",
        items: [
          { prompt: "___ meeting online lewat Zoom besok, ya? (rủ đối tác cùng họp)", answer: "Kita", hint: "gồm cả người nghe" },
          { prompt: "Tim ___ akan kerjakan logonya. (agency nói với khách)", answer: "kami", hint: "không gồm khách" },
          { prompt: "Ayo ___ selesaikan proyek ini bareng. (nói với cộng sự cùng làm)", answer: "kita", hint: "gồm cả người nghe" },
        ],
      },
      {
        type: "word_choice",
        instruction_vi:
          "Chọn từ chuẩn tiếng Indonesia thay cho từ chêm tiếng Anh:",
        instruction_en:
          "Pick the standard Indonesian word instead of the English code-switch:",
        items: [
          { prompt: "budget →", answer: "anggaran" },
          { prompt: "deadline →", answer: "tenggat waktu" },
          { prompt: "rate (mức phí) →", answer: "tarif" },
          { prompt: "down payment →", answer: "DP / uang muka" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung báo giá freelance — điền chỗ trống: `Tarif saya ___ per ___, sudah termasuk ___ kali revisi. Saya minta DP ___% di awal. Tenggat waktunya ___. Pembayaran transfer ke rekening ___.`",
        instruction_en:
          "Freelance quote frame — fill the blanks: `Tarif saya ___ per ___, sudah termasuk ___ kali revisi. Saya minta DP ___% di awal. Tenggat waktunya ___. Pembayaran transfer ke rekening ___.`",
        example:
          "Tarif saya lima ratus ribu per desain, sudah termasuk dua kali revisi. Saya minta DP lima puluh persen di awal. Tenggat waktunya dua minggu. Pembayaran transfer ke rekening BCA.",
        example_vi:
          "Phí của mình năm trăm nghìn mỗi thiết kế, đã gồm hai lần chỉnh sửa. Mình xin cọc năm mươi phần trăm trước. Hạn chót hai tuần. Thanh toán chuyển vào tài khoản BCA.",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra freelance — bạn làm được chưa?",
        instruction_en: "Quick freelance self-check — can you do each one?",
        items: [
          { vi: "Tôi có thể hỏi phạm vi: ngân sách + hạn chót.", en: "I can scope it: budget + deadline." },
          { vi: "Tôi có thể báo giá kèm giới hạn revisi và xin DP.", en: "I can quote with a revision cap and ask for a deposit." },
          { vi: "Tôi có thể cập nhật tiến độ và xin lỗi nếu trễ.", en: "I can give progress updates and apologize if late." },
          { vi: "Tôi có thể giao kết quả và gửi hóa đơn.", en: "I can deliver the result and send an invoice." },
          { vi: "Tôi phân biệt `kami` (không gồm khách) và `kita` (gồm cả người nghe).", en: "I tell `kami` (excl. client) from `kita` (incl. listener)." },
          { vi: "Tôi đọc `c` thành 'ch' (cair = cha-ir).", en: "I read `c` as 'ch' (cair = cha-ir)." },
        ],
      },
    ],
  },
];

export default lessons;
