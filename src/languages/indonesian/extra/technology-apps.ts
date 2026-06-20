// Technology & Apps Indonesian (Vietnamese → Indonesian study track).
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
// App Indonesian is everyday/colloquial: lots of English loanwords already
// "Indonesianized" (`aplikasi`, `transfer`, `top up`), the `meN-` verb prefix
// often dropped in chat (`pesan` not `memesan`), and brand verbs (`di-Gojek-in`).
// Vietnamese WIN: no conjugation/gender/tone, so the sentences stay short. Trap:
// `c` = "ch" (`cari` = "cha-ri"), `e` schwa, and `di-` doubling as both the
// passive prefix AND the preposition "at/in" — context, not spelling, decides.

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
    id: "indonesian_technology_apps",
    level: "A2",
    category: "daily_life",
    title_vi: "Tiếng Indonesia cho công nghệ và ứng dụng",
    title_en: "Technology and apps Indonesian",
    sentences: [
      // ── Ride-hailing & delivery (Gojek / Grab) ─────────────────────────
      {
        en: "Saya mau pesan Gojek ke bandara.",
        vi: "Tôi muốn đặt Gojek ra sân bay.",
        pronunciation_focus: [
          "SA-ya mau PE-san GO-jek ke ban-DA-ra — `pesan` = đặt; `ke` = đến; `bandara` = sân bay.",
          "Lợi thế người Việt: `mau pesan` = 'muốn đặt' y như tiếng Việt — không chia động từ.",
          "Lỗi người Việt: nói `pesan ke Gojek`. Đặt xe là `pesan Gojek`; `ke` dành cho ĐIỂM ĐẾN.",
          "Luyện: `Saya mau pesan Gojek ke bandara.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau PE-san GO-jek ke ban-DA-ra — `pesan` = order/book; `ke` = to; `bandara` = airport.",
          "VN-speaker win: `mau pesan` = 'want to book' maps straight onto Vietnamese — no conjugation.",
          "VN-speaker trap: `pesan ke Gojek`. You book the ride with `pesan Gojek`; `ke` marks the DESTINATION.",
          "Drill: `Saya mau pesan Gojek ke bandara.`",
        ],
      },
      {
        en: "Drivernya sudah dekat?",
        vi: "Tài xế đã tới gần chưa?",
        pronunciation_focus: [
          "DRAI-ver-nya SU-dah DE-kat — `driver` (mượn tiếng Anh) + `-nya` = 'tài xế đó'; `dekat` = gần.",
          "Lỗi người Việt: nói `sopir` (đúng nhưng trong app người ta nói `driver`). Trong ngữ cảnh app dùng `driver`.",
          "Luyện: `Drivernya sudah dekat?`",
        ],
        pronunciation_focus_en: [
          "DRAI-ver-nya SU-dah DE-kat — `driver` (loanword) + `-nya` = 'the driver'; `dekat` = near.",
          "VN-speaker trap: `sopir` is correct, but in-app people say `driver`. Use `driver` in app context.",
          "Drill: `Drivernya sudah dekat?`",
        ],
      },
      {
        en: "Tolong jemput saya di depan minimarket.",
        vi: "Làm ơn đón tôi ở trước cửa hàng tiện lợi.",
        pronunciation_focus: [
          "TO-long JEM-put ... di de-PAN — `jemput` = đón (người); `di depan` = ở phía trước; `di` = ở.",
          "Lỗi người Việt: lẫn `di depan` (ở trước) với `ke depan` (ra phía trước). Điểm đón đứng yên → `di depan`.",
          "Luyện: `Tolong jemput saya di depan minimarket.`",
        ],
        pronunciation_focus_en: [
          "TO-long JEM-put ... di de-PAN — `jemput` = pick up (a person); `di depan` = in front of; `di` = at.",
          "VN-speaker trap: mixing `di depan` (in front of) with `ke depan` (toward the front). A fixed pickup spot is `di depan`.",
          "Drill: `Tolong jemput saya di depan minimarket.`",
        ],
      },
      {
        en: "Pesanannya sudah sampai belum?",
        vi: "Đơn hàng đã tới chưa?",
        pronunciation_focus: [
          "pe-sa-NAN-nya SU-dah SAM-pai be-LUM — `sampai` = tới nơi; `sudah … belum?` = đã … chưa?",
          "Lỗi người Việt: nói `sudah sampai tidak?`. Câu hỏi 'đã … chưa' luôn kết bằng `belum`, không phải `tidak`.",
          "Luyện: `Pesanannya sudah sampai belum?`",
        ],
        pronunciation_focus_en: [
          "pe-sa-NAN-nya SU-dah SAM-pai be-LUM — `sampai` = to arrive; `sudah … belum?` = has it … yet?",
          "VN-speaker trap: `sudah sampai tidak?`. A 'has it … yet' question always ends in `belum`, not `tidak`.",
          "Drill: `Pesanannya sudah sampai belum?`",
        ],
      },
      // ── E-wallets & payment (OVO / DANA / GoPay) ───────────────────────
      {
        en: "Saya bayar pakai GoPay saja.",
        vi: "Tôi trả bằng GoPay thôi.",
        pronunciation_focus: [
          "SA-ya BA-yar PA-kai go-PAI SA-ja — `pakai` = dùng/bằng; `saja` = thôi/chỉ (đặt CUỐI câu).",
          "Lỗi người Việt: đặt `saja` sai chỗ. `saja` luôn đứng sau cái nó nhấn: `pakai GoPay saja`.",
          "Luyện: `Saya bayar pakai GoPay saja.`",
        ],
        pronunciation_focus_en: [
          "SA-ya BA-yar PA-kai go-PAI SA-ja — `pakai` = use/with; `saja` = just/only (sits at the END).",
          "VN-speaker trap: misplacing `saja`. It follows what it emphasizes: `pakai GoPay saja`.",
          "Drill: `Saya bayar pakai GoPay saja.`",
        ],
      },
      {
        en: "Saldo OVO saya kurang.",
        vi: "Số dư OVO của tôi không đủ.",
        pronunciation_focus: [
          "SAL-do O-vo SA-ya KU-rang — `saldo` = số dư (mượn tiếng Ý/Hà Lan); `kurang` = thiếu/không đủ.",
          "Lỗi người Việt: nói `tidak cukup uang`. Trong app, 'số dư thiếu' gọn là `saldonya kurang`.",
          "Luyện: `Saldo OVO saya kurang.`",
        ],
        pronunciation_focus_en: [
          "SAL-do O-vo SA-ya KU-rang — `saldo` = balance; `kurang` = lacking/insufficient.",
          "VN-speaker trap: `tidak cukup uang`. In-app, 'low balance' is simply `saldonya kurang`.",
          "Drill: `Saldo OVO saya kurang.`",
        ],
      },
      {
        en: "Saya mau top up DANA dulu.",
        vi: "Tôi muốn nạp tiền vào DANA trước đã.",
        pronunciation_focus: [
          "SA-ya mau top-AP DA-na DU-lu — `top up` = nạp tiền (mượn tiếng Anh, dùng như động từ); `dulu` = trước đã.",
          "Lỗi người Việt: nói `isi uang`. Nạp ví điện tử quen dùng `top up` (hoặc `isi saldo`).",
          "Luyện: `Saya mau top up DANA dulu.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau top-AP DA-na DU-lu — `top up` = to load funds (loaned verb); `dulu` = first.",
          "VN-speaker trap: `isi uang`. Loading an e-wallet is usually `top up` (or `isi saldo`).",
          "Drill: `Saya mau top up DANA dulu.`",
        ],
      },
      {
        en: "Scan QR-nya di sini, ya.",
        vi: "Quét mã QR ở đây nhé.",
        pronunciation_focus: [
          "skan ku-er-nya di SI-ni ya — `scan` = quét; `QR` đọc từng chữ kiểu Anh; `di sini` = ở đây.",
          "Lỗi người Việt: dịch 'quét' thành `sapu` (= quét nhà). Quét mã là `scan`, không phải `sapu`.",
          "Luyện: `Scan QR-nya di sini, ya.`",
        ],
        pronunciation_focus_en: [
          "skan ku-er-nya di SI-ni ya — `scan` = scan; `QR` is spelled out; `di sini` = here.",
          "VN-speaker trap: translating 'scan' as `sapu` (= sweep the floor). Scanning a code is `scan`, not `sapu`.",
          "Drill: `Scan QR-nya di sini, ya.`",
        ],
      },
      // ── Online shopping (Tokopedia / Shopee) ───────────────────────────
      {
        en: "Saya beli ini di Shopee kemarin.",
        vi: "Tôi mua cái này trên Shopee hôm qua.",
        pronunciation_focus: [
          "SA-ya BE-li I-ni di sho-PI ke-MA-rin — `beli` = mua; `di Shopee` = trên Shopee (`di` = ở/trên app); `kemarin` = hôm qua.",
          "Lợi thế người Việt: `kemarin` = quá khứ — KHÔNG cần chia thì, chỉ cần thêm trạng từ thời gian.",
          "Luyện: `Saya beli ini di Shopee kemarin.`",
        ],
        pronunciation_focus_en: [
          "SA-ya BE-li I-ni di sho-PI ke-MA-rin — `beli` = buy; `di Shopee` = on Shopee (`di` = on the app); `kemarin` = yesterday.",
          "VN-speaker win: `kemarin` marks the past — NO tense change, just add the time word.",
          "Drill: `Saya beli ini di Shopee kemarin.`",
        ],
      },
      {
        en: "Ada gratis ongkir tidak?",
        vi: "Có miễn phí ship không?",
        pronunciation_focus: [
          "A-da GRA-tis ONG-kir TI-dak — `gratis` = miễn phí; `ongkir` = phí ship (viết tắt `ongkos kirim`).",
          "Lỗi người Việt: nói `free ship`. Tiếng Indonesia có từ riêng: `gratis ongkir`.",
          "Luyện: `Ada gratis ongkir tidak?`",
        ],
        pronunciation_focus_en: [
          "A-da GRA-tis ONG-kir TI-dak — `gratis` = free; `ongkir` = shipping fee (short for `ongkos kirim`).",
          "VN-speaker trap: saying `free ship`. Indonesian has its own term: `gratis ongkir`.",
          "Drill: `Ada gratis ongkir tidak?`",
        ],
      },
      {
        en: "Tolong cek ongkirnya ke Vietnam.",
        vi: "Làm ơn kiểm tra phí ship về Việt Nam.",
        pronunciation_focus: [
          "TO-long chek ONG-kir-nya ke vi-et-NAM — `cek` = kiểm tra (đọc `chek` vì `c`='ch'); `ke Vietnam` = về Việt Nam.",
          "Lỗi người Việt: đọc `cek` thành 'kek'. Nhớ `c` trong tiếng Indonesia = 'ch', nên `cek` = 'chek'.",
          "Luyện: `Tolong cek ongkirnya ke Vietnam.`",
        ],
        pronunciation_focus_en: [
          "TO-long chek ONG-kir-nya ke vi-et-NAM — `cek` = check (read 'chek' since `c`='ch'); `ke Vietnam` = to Vietnam.",
          "VN-speaker trap: reading `cek` as 'kek'. Indonesian `c` is 'ch', so `cek` = 'chek'.",
          "Drill: `Tolong cek ongkirnya ke Vietnam.`",
        ],
      },
      {
        en: "Barangnya belum dikirim.",
        vi: "Hàng vẫn chưa được gửi đi.",
        pronunciation_focus: [
          "ba-RANG-nya be-LUM di-KI-rim — `barang` = hàng/món đồ; `dikirim` (bị động) = được gửi đi; `belum` = chưa.",
          "Lỗi người Việt: né thể bị động. 'Hàng chưa được gửi' chuẩn là `belum dikirim` (`di-` = bị động ở đây).",
          "Luyện: `Barangnya belum dikirim.`",
        ],
        pronunciation_focus_en: [
          "ba-RANG-nya be-LUM di-KI-rim — `barang` = item/goods; `dikirim` (passive) = has been sent; `belum` = not yet.",
          "VN-speaker trap: avoiding the passive. 'Not yet shipped' is `belum dikirim` (`di-` = passive prefix here).",
          "Drill: `Barangnya belum dikirim.`",
        ],
      },
      {
        en: "Saya mau kasih bintang lima.",
        vi: "Tôi muốn đánh giá năm sao.",
        pronunciation_focus: [
          "SA-ya mau KA-sih BIN-tang LI-ma — `kasih` = cho/đưa (khẩu ngữ của `memberi`); `bintang` = sao; `lima` = năm.",
          "Lỗi người Việt: nói `lima bintang`. Tiếng Indonesia đặt SỐ trước danh từ: `bintang lima` (sao + năm) — nhưng số đếm `lima bintang` cũng nghe được; review app quen nói `bintang lima`.",
          "Luyện: `Saya mau kasih bintang lima.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau KA-sih BIN-tang LI-ma — `kasih` = give (colloquial `memberi`); `bintang` = star; `lima` = five.",
          "VN-speaker trap: word order. The fixed app phrase is `bintang lima` ('five-star rating').",
          "Drill: `Saya mau kasih bintang lima.`",
        ],
      },
      // ── Account & connectivity trouble ─────────────────────────────────
      {
        en: "Aplikasinya error, tidak bisa dibuka.",
        vi: "Ứng dụng bị lỗi, không mở được.",
        pronunciation_focus: [
          "ap-li-KA-si-nya E-ror, TI-dak BI-sa di-BU-ka — `aplikasi` = ứng dụng; `error` (mượn); `dibuka` (bị động) = được mở.",
          "Lỗi người Việt: nói `app rusak`. App bị lỗi dùng `error`; `rusak` hợp cho đồ vật/máy móc.",
          "Luyện: `Aplikasinya error, tidak bisa dibuka.`",
        ],
        pronunciation_focus_en: [
          "ap-li-KA-si-nya E-ror, TI-dak BI-sa di-BU-ka — `aplikasi` = app; `error` (loan); `dibuka` (passive) = be opened.",
          "VN-speaker trap: `app rusak`. A glitchy app is `error`; `rusak` fits physical/hardware breakage.",
          "Drill: `Aplikasinya error, tidak bisa dibuka.`",
        ],
      },
      {
        en: "Sinyalnya jelek, tolong sabar ya.",
        vi: "Sóng yếu, mong anh/chị kiên nhẫn nhé.",
        pronunciation_focus: [
          "si-NYAL-nya JE-lek, TO-long SA-bar ya — `sinyal` = sóng/tín hiệu; `jelek` = kém/tệ; `sabar` = kiên nhẫn.",
          "Lỗi người Việt: nói `sinyal lemah` (đúng) nhưng người Indonesia hay nói `sinyalnya jelek`.",
          "Luyện: `Sinyalnya jelek, tolong sabar ya.`",
        ],
        pronunciation_focus_en: [
          "si-NYAL-nya JE-lek, TO-long SA-bar ya — `sinyal` = signal; `jelek` = bad/poor; `sabar` = patient.",
          "VN-speaker trap: `sinyal lemah` is fine, but Indonesians usually say `sinyalnya jelek`.",
          "Drill: `Sinyalnya jelek, tolong sabar ya.`",
        ],
      },
      {
        en: "Saya lupa kata sandi akun saya.",
        vi: "Tôi quên mật khẩu tài khoản của tôi.",
        pronunciation_focus: [
          "SA-ya LU-pa KA-ta SAN-di a-KUN — `kata sandi` = mật khẩu (cũng nói `password`); `akun` = tài khoản.",
          "Lỗi người Việt: nói `kunci` (= chìa khóa) cho mật khẩu. Mật khẩu là `kata sandi` hoặc `password`.",
          "Luyện: `Saya lupa kata sandi akun saya.`",
        ],
        pronunciation_focus_en: [
          "SA-ya LU-pa KA-ta SAN-di a-KUN — `kata sandi` = password (also `password`); `akun` = account.",
          "VN-speaker trap: using `kunci` (= a key) for a password. A password is `kata sandi` or `password`.",
          "Drill: `Saya lupa kata sandi akun saya.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia là một xã hội 'super-app': hầu như mọi việc hằng ngày đi qua điện thoại. `Gojek` và `Grab` không chỉ gọi xe ôm (`ojek online` / `ojol`) mà còn giao đồ ăn (`GoFood`/`GrabFood`), giao hàng và thanh toán. Ví điện tử (`e-wallet`) phổ biến nhất là `GoPay`, `OVO`, `DANA` và `ShopeePay`; nhiều quán nhỏ chỉ cần `scan QR` chuẩn `QRIS` (đọc 'kris') là trả được, khỏi tiền mặt. Mua sắm online thống trị bởi `Tokopedia`, `Shopee` và `TikTok Shop`; người Indonesia rất để ý `gratis ongkir` (miễn phí ship) và `flash sale` ngày đôi (9.9, 11.11, 12.12). Khi nhắn tin với `driver` hay người bán, giọng điệu thân thiện + emoji là bình thường; mở đầu bằng `Pak`/`Bu`/`Kak` (anh/chị) và một câu `Tolong …` sẽ được phục vụ vui vẻ. Gửi tiền về Việt Nam thì dùng dịch vụ `remitansi`/`transfer` riêng (Wise, ngân hàng), KHÔNG qua ví nội địa.",
    cultural_notes_en:
      "Indonesia is a 'super-app' society — almost everything daily runs through the phone. `Gojek` and `Grab` aren't just motorbike taxis (`ojek online` / `ojol`); they also do food delivery (`GoFood`/`GrabFood`), parcels, and payments. The biggest e-wallets are `GoPay`, `OVO`, `DANA`, and `ShopeePay`; many small stalls just need a `QRIS` (say 'kris') `QR` scan, no cash. Online shopping is dominated by `Tokopedia`, `Shopee`, and `TikTok Shop`; shoppers chase `gratis ongkir` (free shipping) and double-date `flash sale` days (9.9, 11.11, 12.12). When chatting with a `driver` or seller, a warm tone plus emoji is normal; opening with `Pak`/`Bu`/`Kak` (sir/ma'am/older sibling) and a `Tolong …` gets cheerful service. To send money home to Vietnam, use a dedicated `remitansi`/`transfer` service (Wise, banks), NOT a local e-wallet.",
    tip_advice_vi:
      "Học theo 4 cụm app cốt lõi: (1) gọi xe/giao hàng — `Saya mau pesan Gojek/GoFood ke ___`; (2) thanh toán ví — `Bayar pakai GoPay/OVO saja`, `Saldonya kurang`, `Mau top up dulu`; (3) mua sắm — `Beli di Shopee`, `Ada gratis ongkir tidak?`, `Barangnya belum dikirim`; (4) sự cố — `Aplikasinya error`, `Sinyalnya jelek`, `Lupa kata sandi`. Hai mẹo phát âm sống còn: `c` = 'ch' nên `cek`='chek', `cari`='cha-ri'; và `di` vừa là tiền tố BỊ ĐỘNG (`dikirim` = được gửi) vừa là giới từ 'ở/trên' (`di Shopee`) — nhìn ngữ cảnh, đừng nhìn chính tả. Tin vui: tiếng Indonesia không chia thì, chỉ cần thêm `kemarin`/`sudah`/`belum` là xong.",
    tip_advice_en:
      "Drill 4 core app clusters: (1) ride/delivery — `Saya mau pesan Gojek/GoFood ke ___`; (2) wallet pay — `Bayar pakai GoPay/OVO saja`, `Saldonya kurang`, `Mau top up dulu`; (3) shopping — `Beli di Shopee`, `Ada gratis ongkir tidak?`, `Barangnya belum dikirim`; (4) trouble — `Aplikasinya error`, `Sinyalnya jelek`, `Lupa kata sandi`. Two survival pronunciation tips: `c` = 'ch', so `cek`='chek', `cari`='cha-ri'; and `di` is both the PASSIVE prefix (`dikirim` = is sent) and the preposition 'at/on' (`di Shopee`) — read context, not spelling. Good news: Indonesian has no tense — just add `kemarin`/`sudah`/`belum`.",
    vocabulary: [
      // Apps & platforms
      {
        word: "aplikasi",
        en: "app / application",
        vi: "ứng dụng",
        pos: "noun",
        pronunciation_vi: "ap-li-KA-si — thường gọi tắt `apl` / `app`",
        pronunciation_en: "ap-li-KA-si — often clipped to `apl` / `app`",
      },
      {
        word: "ojek online",
        en: "app motorbike taxi (ojol)",
        vi: "xe ôm công nghệ",
        pos: "noun",
        pronunciation_vi: "O-jek ON-lain — viết tắt `ojol`; Gojek/Grab",
        pronunciation_en: "O-jek ON-line — short `ojol`; Gojek/Grab",
      },
      {
        word: "driver",
        en: "driver (rider)",
        vi: "tài xế / người chạy xe",
        pos: "noun",
        pronunciation_vi: "DRAI-ver — trong app dùng `driver`, không phải `sopir`",
        pronunciation_en: "DRAI-ver — in-app it's `driver`, not `sopir`",
      },
      // E-wallet & money
      {
        word: "saldo",
        en: "balance (in a wallet)",
        vi: "số dư",
        pos: "noun",
        pronunciation_vi: "SAL-do — `saldonya kurang` = số dư không đủ",
        pronunciation_en: "SAL-do — `saldonya kurang` = balance is low",
      },
      {
        word: "top up",
        en: "to top up / load funds",
        vi: "nạp tiền",
        pos: "verb",
        pronunciation_vi: "top-AP — cũng nói `isi saldo`",
        pronunciation_en: "top-AP — also `isi saldo`",
      },
      {
        word: "transfer",
        en: "to transfer (money)",
        vi: "chuyển khoản",
        pos: "verb",
        pronunciation_vi: "TRANS-fer — `transfer ke bank` = chuyển vào ngân hàng",
        pronunciation_en: "TRANS-fer — `transfer ke bank` = transfer to a bank",
      },
      {
        word: "QRIS",
        en: "national QR payment standard",
        vi: "chuẩn thanh toán QR quốc gia",
        pos: "noun (acronym)",
        pronunciation_vi: "kris — quét một mã trả được mọi ví",
        pronunciation_en: "kris — one code pays from any wallet",
      },
      // Shopping
      {
        word: "ongkir",
        en: "shipping fee",
        vi: "phí vận chuyển",
        pos: "noun",
        pronunciation_vi: "ONG-kir — viết tắt `ongkos kirim`; `gratis ongkir` = free ship",
        pronunciation_en: "ONG-kir — short for `ongkos kirim`; `gratis ongkir` = free shipping",
      },
      {
        word: "barang",
        en: "item / goods",
        vi: "hàng / món đồ",
        pos: "noun",
        pronunciation_vi: "BA-rang — `barangnya` = món hàng đó",
        pronunciation_en: "BA-rang — `barangnya` = the item",
      },
      {
        word: "kirim",
        en: "to send / ship",
        vi: "gửi / giao",
        pos: "verb",
        pronunciation_vi: "KI-rim — bị động `dikirim` = được gửi",
        pronunciation_en: "KI-rim — passive `dikirim` = is sent",
      },
      {
        word: "keranjang",
        en: "(shopping) cart",
        vi: "giỏ hàng",
        pos: "noun",
        pronunciation_vi: "ke-RAN-jang — `masuk keranjang` = thêm vào giỏ",
        pronunciation_en: "ke-RAN-jang — `masuk keranjang` = add to cart",
      },
      {
        word: "diskon",
        en: "discount",
        vi: "giảm giá",
        pos: "noun",
        pronunciation_vi: "DIS-kon — `flash sale` ngày đôi 11.11, 12.12",
        pronunciation_en: "DIS-kon — `flash sale` on double dates 11.11, 12.12",
      },
      // Account & connectivity
      {
        word: "akun",
        en: "account",
        vi: "tài khoản",
        pos: "noun",
        pronunciation_vi: "a-KUN — `daftar akun` = đăng ký tài khoản",
        pronunciation_en: "a-KUN — `daftar akun` = register an account",
      },
      {
        word: "kata sandi",
        en: "password",
        vi: "mật khẩu",
        pos: "noun",
        pronunciation_vi: "KA-ta SAN-di — cũng nói `password`; KHÔNG phải `kunci`",
        pronunciation_en: "KA-ta SAN-di — also `password`; NOT `kunci`",
      },
      {
        word: "sinyal",
        en: "signal / reception",
        vi: "sóng / tín hiệu",
        pos: "noun",
        pronunciation_vi: "si-NYAL — `sinyalnya jelek` = sóng yếu",
        pronunciation_en: "si-NYAL — `sinyalnya jelek` = poor signal",
      },
      {
        word: "unduh",
        en: "to download",
        vi: "tải xuống",
        pos: "verb",
        pronunciation_vi: "UN-duh — cũng nói `download`; tải lên = `unggah`/`upload`",
        pronunciation_en: "UN-duh — also `download`; upload = `unggah`/`upload`",
      },
    ],
    dialogue: [
      // Dialogue: chatting with a Gojek/GoFood driver, then a payment hiccup
      {
        speaker: "Pelanggan",
        text: "Halo, Kak. Pesanannya sudah dijemput dari restoran?",
        vi: "Chào anh. Đơn đã lấy từ nhà hàng chưa ạ?",
        en: "Hi. Has the order been picked up from the restaurant?",
      },
      {
        speaker: "Driver",
        text: "Sudah, Kak. Saya OTW ke alamatnya sekarang.",
        vi: "Rồi ạ. Em đang trên đường tới địa chỉ đây.",
        en: "Yes. I'm on the way to your address now.",
      },
      {
        speaker: "Pelanggan",
        text: "Oke. Tolong jemput saya di depan minimarket, ya. Sinyal di sini agak jelek.",
        vi: "Được. Anh đón em ở trước cửa hàng tiện lợi nhé. Sóng ở đây hơi yếu.",
        en: "Okay. Please come to the front of the minimarket. The signal here is a bit poor.",
      },
      {
        speaker: "Driver",
        text: "Siap, Kak. Bayarnya tunai atau GoPay?",
        vi: "Vâng ạ. Anh/chị trả tiền mặt hay GoPay?",
        en: "Got it. Will you pay cash or GoPay?",
      },
      {
        speaker: "Pelanggan",
        text: "GoPay saja. Eh, saldonya kurang. Saya top up dulu, ya.",
        vi: "GoPay thôi. Ơ, số dư không đủ. Để em nạp tiền đã nhé.",
        en: "GoPay, please. Oh, the balance is low. Let me top up first.",
      },
      {
        speaker: "Driver",
        text: "Tidak apa-apa, Kak. Saya tunggu di depan.",
        vi: "Không sao đâu ạ. Em chờ ở phía trước.",
        en: "No problem. I'll wait out front.",
      },
      {
        speaker: "Pelanggan",
        text: "Sudah, Kak. Scan QR-nya bisa? Terima kasih, nanti saya kasih bintang lima.",
        vi: "Xong rồi ạ. Quét mã QR được chưa? Cảm ơn anh, lát em đánh giá năm sao.",
        en: "Done. Can you scan the QR? Thanks, I'll give you five stars.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn đặt Gojek ra sân bay.", answer: "Saya mau pesan Gojek ke bandara." },
          { prompt: "Tôi trả bằng GoPay thôi.", answer: "Saya bayar pakai GoPay saja." },
          { prompt: "Số dư OVO của tôi không đủ.", answer: "Saldo OVO saya kurang." },
          { prompt: "Có miễn phí ship không?", answer: "Ada gratis ongkir tidak?" },
          { prompt: "Hàng vẫn chưa được gửi đi.", answer: "Barangnya belum dikirim." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Indonesia:",
        instruction_en: "Extra practice — translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn nạp tiền vào DANA trước đã.", answer: "Saya mau top up DANA dulu." },
          { prompt: "Đơn hàng đã tới chưa?", answer: "Pesanannya sudah sampai belum?" },
          { prompt: "Ứng dụng bị lỗi, không mở được.", answer: "Aplikasinya error, tidak bisa dibuka." },
          { prompt: "Tôi quên mật khẩu tài khoản.", answer: "Saya lupa kata sandi akun saya." },
          { prompt: "Quét mã QR ở đây nhé.", answer: "Scan QR-nya di sini, ya." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Điền `di`, `ke`, hay `belum` cho đúng (ở/trên · đến · chưa):",
        instruction_en:
          "Fill in `di`, `ke`, or `belum` (at/on · to · not yet):",
        items: [
          { prompt: "Saya beli ini ___ Shopee.", answer: "di", hint: "ở/trên app" },
          { prompt: "Saya mau pesan Gojek ___ bandara.", answer: "ke", hint: "điểm đến" },
          { prompt: "Barangnya ___ dikirim.", answer: "belum", hint: "chưa được gửi" },
        ],
      },
      {
        type: "pronunciation_drill",
        instruction_vi:
          "Đọc đúng `c` = 'ch'. Phiên âm các từ app sau:",
        instruction_en:
          "Read `c` as 'ch'. Give the reading of these app words:",
        items: [
          { prompt: "cek (kiểm tra)", answer: "chek" },
          { prompt: "cari (tìm kiếm)", answer: "cha-ri" },
          { prompt: "voucher", answer: "vau-cher" },
          { prompt: "pencarian (việc tìm kiếm)", answer: "pen-cha-ri-an" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung nhắn tin với người bán/driver — điền chỗ trống: `Halo, Kak. ___ sudah ___ belum? Tolong ___ di ___. Bayarnya pakai ___ saja.`",
        instruction_en:
          "Seller/driver chat frame — fill the blanks: `Halo, Kak. ___ sudah ___ belum? Tolong ___ di ___. Bayarnya pakai ___ saja.`",
        example:
          "Halo, Kak. Pesanannya sudah dikirim belum? Tolong jemput saya di depan minimarket. Bayarnya pakai GoPay saja.",
        example_vi:
          "Chào anh. Đơn đã gửi chưa ạ? Anh đón em ở trước cửa hàng tiện lợi nhé. Trả bằng GoPay thôi.",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra dùng app — bạn làm được chưa?",
        instruction_en: "Quick app self-check — can you do each one?",
        items: [
          { vi: "Tôi có thể đặt xe/đồ ăn và nêu điểm đón.", en: "I can book a ride/food and state the pickup spot." },
          { vi: "Tôi có thể trả bằng ví và báo số dư thiếu.", en: "I can pay by wallet and report a low balance." },
          { vi: "Tôi có thể hỏi phí ship và miễn phí ship.", en: "I can ask about shipping fee and free shipping." },
          { vi: "Tôi có thể báo lỗi app, sóng yếu, quên mật khẩu.", en: "I can report an app error, weak signal, forgotten password." },
          { vi: "Tôi đọc `c` thành 'ch' (cek = chek).", en: "I read `c` as 'ch' (cek = chek)." },
          { vi: "Tôi phân biệt `di` (ở/bị động) và `ke` (đến).", en: "I tell `di` (at/passive) from `ke` (to)." },
        ],
      },
    ],
  },
];

export default lessons;
