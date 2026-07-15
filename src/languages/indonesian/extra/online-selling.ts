// Online Selling Indonesian (Vietnamese → Indonesian study track).
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
// This pack is the SELLER side of marketplace Indonesian (Shopee/Tokopedia), the
// counterpart to the buyer-focused technology-apps pack. It is heavy on e-commerce
// jargon (`resi`, `COD`, `retur`, courier abbreviations) and chat-register
// politeness (`Kak`, `ya`, `ditunggu`). Vietnamese WIN: no conjugation/gender/tone.
// Traps: `c` = "ch" (`cek resi` = "chek resi"), the passive `di-` on fulfilment
// verbs (`sudah dikirim`, `akan diproses`), and seller acronyms (COD/JNE/J&T).

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
    id: "indonesian_online_selling",
    level: "B1",
    category: "work",
    title_vi: "Tiếng Indonesia cho bán hàng online",
    title_en: "Online selling Indonesian",
    sentences: [
      // ── Greeting buyers & confirming stock ─────────────────────────────
      {
        en: "Halo, Kak. Terima kasih sudah order di toko kami.",
        vi: "Chào bạn. Cảm ơn bạn đã đặt hàng ở shop của tụi mình.",
        pronunciation_focus: [
          "HA-lo, kak. te-ri-MA KA-sih SU-dah OR-der — `Kak` = cách gọi khách thân thiện (anh/chị); `order` mượn tiếng Anh.",
          "Lỗi người Việt: gọi khách bằng `kamu`. Trong bán hàng dùng `Kak` (trung tính, lịch sự), không `kamu`.",
          "Luyện: `Halo, Kak. Terima kasih sudah order di toko kami.`",
        ],
        pronunciation_focus_en: [
          "HA-lo, kak. te-ri-MA KA-sih SU-dah OR-der — `Kak` = friendly customer address (older sibling); `order` is a loanword.",
          "VN-speaker trap: addressing a buyer as `kamu`. In selling use `Kak` (neutral, polite), never `kamu`.",
          "Drill: `Halo, Kak. Terima kasih sudah order di toko kami.`",
        ],
      },
      {
        en: "Barang ready, Kak. Stok masih ada.",
        vi: "Hàng có sẵn nha bạn. Còn hàng.",
        pronunciation_focus: [
          "BA-rang RE-di, kak. stok MA-sih A-da — `ready` = có sẵn (lóng bán hàng); `masih ada` = vẫn còn.",
          "Lỗi người Việt: nói `barang ada saja`. Người bán quen nói `ready` / `stok ada`.",
          "Luyện: `Barang ready, Kak. Stok masih ada.`",
        ],
        pronunciation_focus_en: [
          "BA-rang RE-di, kak. stok MA-sih A-da — `ready` = in stock (seller slang); `masih ada` = still available.",
          "VN-speaker trap: `barang ada saja`. Sellers say `ready` / `stok ada`.",
          "Drill: `Barang ready, Kak. Stok masih ada.`",
        ],
      },
      {
        en: "Warnanya mau yang mana, Kak?",
        vi: "Bạn muốn màu nào ạ?",
        pronunciation_focus: [
          "WAR-na-nya mau yang MA-na, kak — `warnanya` = màu (của nó); `yang mana` = cái nào.",
          "Lỗi người Việt: nói `warna apa`. Chọn TRONG các lựa chọn có sẵn dùng `yang mana`, không `apa`.",
          "Luyện: `Warnanya mau yang mana, Kak?`",
        ],
        pronunciation_focus_en: [
          "WAR-na-nya mau yang MA-na, kak — `warnanya` = the color; `yang mana` = which one.",
          "VN-speaker trap: `warna apa`. Choosing FROM given options uses `yang mana`, not `apa`.",
          "Drill: `Warnanya mau yang mana, Kak?`",
        ],
      },
      // ── Payment, COD, processing ───────────────────────────────────────
      {
        en: "Pembayarannya sudah masuk, ya, Kak.",
        vi: "Khoản thanh toán đã vào rồi nha bạn.",
        pronunciation_focus: [
          "pem-ba-YA-ran-nya SU-dah MA-suk — `pembayaran` = việc thanh toán (gốc `bayar` + `pe-...-an`); `masuk` = vào/đã nhận.",
          "Lỗi người Việt: nói `uang sudah datang`. Tiền vào tài khoản nói `pembayaran sudah masuk`.",
          "Luyện: `Pembayarannya sudah masuk, ya, Kak.`",
        ],
        pronunciation_focus_en: [
          "pem-ba-YA-ran-nya SU-dah MA-suk — `pembayaran` = payment (root `bayar` + `pe-...-an`); `masuk` = come in/received.",
          "VN-speaker trap: `uang sudah datang`. A received payment is `pembayaran sudah masuk`.",
          "Drill: `Pembayarannya sudah masuk, ya, Kak.`",
        ],
      },
      {
        en: "Untuk COD, bayar tunai ke kurir saat barang sampai.",
        vi: "Với COD, trả tiền mặt cho shipper khi hàng tới.",
        pronunciation_focus: [
          "UN-tuk si-o-di, BA-yar TU-nai ke KU-rir — `COD` đọc từng chữ 'si-o-di'; `kurir` = người giao hàng; `saat` = khi/lúc.",
          "Lỗi người Việt: dịch COD = 'trả khi nhận' dài dòng. Cứ dùng `COD` (cash on delivery) như người Indonesia.",
          "Luyện: `Untuk COD, bayar tunai ke kurir saat barang sampai.`",
        ],
        pronunciation_focus_en: [
          "UN-tuk si-o-di, BA-yar TU-nai ke KU-rir — `COD` spelled out 'see-oh-dee'; `kurir` = courier; `saat` = when/at the moment.",
          "VN-speaker trap: spelling out 'pay on receipt'. Just say `COD` (cash on delivery) like Indonesians do.",
          "Drill: `Untuk COD, bayar tunai ke kurir saat barang sampai.`",
        ],
      },
      {
        en: "Pesanannya akan kami proses hari ini.",
        vi: "Đơn của bạn sẽ được tụi mình xử lý hôm nay.",
        pronunciation_focus: [
          "pe-sa-NAN-nya A-kan KA-mi PRO-ses HA-ri I-ni — `akan` = sẽ; `proses` = xử lý; `kami` = chúng tôi (loại trừ người nghe).",
          "Lỗi người Việt: dùng `kita` (gồm cả khách). Shop nói `kami` (chúng tôi, không gồm khách), không `kita`.",
          "Luyện: `Pesanannya akan kami proses hari ini.`",
        ],
        pronunciation_focus_en: [
          "pe-sa-NAN-nya A-kan KA-mi PRO-ses HA-ri I-ni — `akan` = will; `proses` = process; `kami` = we (excluding the listener).",
          "VN-speaker trap: using `kita` (includes the buyer). A shop says `kami` (we, not you), not `kita`.",
          "Drill: `Pesanannya akan kami proses hari ini.`",
        ],
      },
      // ── Shipping, resi, couriers ───────────────────────────────────────
      {
        en: "Barangnya sudah kami kirim lewat J&T.",
        vi: "Hàng đã được tụi mình gửi qua J&T.",
        pronunciation_focus: [
          "ba-RANG-nya SU-dah KA-mi KI-rim LE-wat je-en-ti — `sudah dikirim` / `sudah kami kirim` = đã gửi; `lewat` = qua (hãng); `J&T` đọc 'je-en-ti'.",
          "Lỗi người Việt: nói `di J&T`. Gửi QUA hãng nào dùng `lewat`/`pakai`, không `di`.",
          "Luyện: `Barangnya sudah kami kirim lewat J&T.`",
        ],
        pronunciation_focus_en: [
          "ba-RANG-nya SU-dah KA-mi KI-rim LE-wat je-en-ti — `sudah dikirim` / `sudah kami kirim` = has been sent; `lewat` = via (courier); `J&T` is 'jay-en-tee'.",
          "VN-speaker trap: `di J&T`. Shipping VIA a courier uses `lewat`/`pakai`, not `di`.",
          "Drill: `Barangnya sudah kami kirim lewat J&T.`",
        ],
      },
      {
        en: "Ini nomor resinya, bisa dilacak di aplikasi.",
        vi: "Đây là mã vận đơn, có thể tra trên ứng dụng.",
        pronunciation_focus: [
          "I-ni NO-mor RE-si-nya, BI-sa di-LA-chak — `resi` = mã vận đơn/biên nhận; `dilacak` (bị động) = được theo dõi; `lacak`='la-chak'.",
          "Lỗi người Việt: nói `tracking number` (chêm tiếng Anh). Mã vận đơn là `nomor resi`.",
          "Luyện: `Ini nomor resinya, bisa dilacak di aplikasi.`",
        ],
        pronunciation_focus_en: [
          "I-ni NO-mor RE-si-nya, BI-sa di-LA-chak — `resi` = tracking/receipt number; `dilacak` (passive) = can be tracked; `lacak`='la-chak'.",
          "VN-speaker trap: code-switching to `tracking number`. The waybill number is `nomor resi`.",
          "Drill: `Ini nomor resinya, bisa dilacak di aplikasi.`",
        ],
      },
      {
        en: "Estimasi sampai dua sampai tiga hari, ya, Kak.",
        vi: "Dự kiến tới trong hai đến ba ngày nha bạn.",
        pronunciation_focus: [
          "es-ti-MA-si SAM-pai DU-a SAM-pai TI-ga HA-ri — `estimasi` = ước tính; `dua sampai tiga` = hai đến ba; `sampai` ở đây vừa 'tới' vừa 'đến (khoảng)'.",
          "Lỗi người Việt: nói `dua ke tiga hari`. Khoảng số dùng `dua sampai tiga`, không `ke`.",
          "Luyện: `Estimasi sampai dua sampai tiga hari, ya, Kak.`",
        ],
        pronunciation_focus_en: [
          "es-ti-MA-si SAM-pai DU-a SAM-pai TI-ga HA-ri — `estimasi` = estimate; `dua sampai tiga` = two to three; `sampai` = both 'arrive' and 'up to (a range)'.",
          "VN-speaker trap: `dua ke tiga hari`. A numeric range uses `dua sampai tiga`, not `ke`.",
          "Drill: `Estimasi sampai dua sampai tiga hari, ya, Kak.`",
        ],
      },
      {
        en: "Mohon ditunggu, ya, Kak. Lagi proses pengiriman.",
        vi: "Xin bạn chờ chút nha. Đang trong quá trình giao.",
        pronunciation_focus: [
          "MO-hon di-TUNG-gu ... LA-gi PRO-ses pe-ngi-RI-man — `mohon ditunggu` = xin được chờ (lịch sự); `lagi` (khẩu ngữ) = đang; `pengiriman` = việc giao hàng.",
          "Lỗi người Việt: nói `tunggu!` cụt. Thêm `mohon` + thể bị động `ditunggu` cho lễ phép.",
          "Luyện: `Mohon ditunggu, ya, Kak. Lagi proses pengiriman.`",
        ],
        pronunciation_focus_en: [
          "MO-hon di-TUNG-gu ... LA-gi PRO-ses pe-ngi-RI-man — `mohon ditunggu` = please wait (polite); `lagi` (colloquial) = currently; `pengiriman` = shipping/delivery.",
          "VN-speaker trap: blunt `tunggu!`. Add `mohon` + the passive `ditunggu` for courtesy.",
          "Drill: `Mohon ditunggu, ya, Kak. Lagi proses pengiriman.`",
        ],
      },
      // ── Complaints, returns, ratings ───────────────────────────────────
      {
        en: "Mohon maaf atas ketidaknyamanannya, Kak.",
        vi: "Thành thật xin lỗi vì sự bất tiện này ạ.",
        pronunciation_focus: [
          "MO-hon ma-AF A-tas ke-ti-dak-nya-MA-nan-nya — `ketidaknyamanan` = sự bất tiện (khung `ke-...-an` chồng phủ định `tidak`); câu xin lỗi chuẩn CSKH.",
          "Lưu ý người Việt: từ dài đáng sợ nhưng cấu trúc rõ: `ke-` + `tidak` + `nyaman` (thoải mái) + `-an`. Học cả cụm.",
          "Luyện: `Mohon maaf atas ketidaknyamanannya, Kak.`",
        ],
        pronunciation_focus_en: [
          "MO-hon ma-AF A-tas ke-ti-dak-nya-MA-nan-nya — `ketidaknyamanan` = inconvenience (the `ke-...-an` frame over negated `tidak`); the standard CS apology.",
          "VN-speaker note: a scary-long word but transparent: `ke-` + `tidak` + `nyaman` (comfortable) + `-an`. Memorize the chunk.",
          "Drill: `Mohon maaf atas ketidaknyamanannya, Kak.`",
        ],
      },
      {
        en: "Kalau barang rusak, bisa kami retur atau ganti baru.",
        vi: "Nếu hàng bị hỏng, tụi mình có thể đổi trả hoặc đổi cái mới.",
        pronunciation_focus: [
          "KA-lau BA-rang RU-sak, BI-sa KA-mi RE-tur A-tau GAN-ti BA-ru — `retur` = trả lại hàng; `ganti baru` = đổi cái mới; `kalau` = nếu.",
          "Lỗi người Việt: nói `return` kiểu Anh. Tiếng Indonesia viết/đọc `retur`.",
          "Luyện: `Kalau barang rusak, bisa kami retur atau ganti baru.`",
        ],
        pronunciation_focus_en: [
          "KA-lau BA-rang RU-sak, BI-sa KA-mi RE-tur A-tau GAN-ti BA-ru — `retur` = return the item; `ganti baru` = exchange for new; `kalau` = if.",
          "VN-speaker trap: English `return`. Indonesian is `retur`.",
          "Drill: `Kalau barang rusak, bisa kami retur atau ganti baru.`",
        ],
      },
      {
        en: "Tolong kirim foto barangnya sebagai bukti, ya.",
        vi: "Làm ơn gửi ảnh món hàng làm bằng chứng nhé.",
        pronunciation_focus: [
          "TO-long KI-rim FO-to BA-rang-nya se-BA-gai BUK-ti — `sebagai` = làm/với tư cách; `bukti` = bằng chứng.",
          "Lỗi người Việt: nói `untuk bukti`. 'Làm bằng chứng' dùng `sebagai bukti`.",
          "Luyện: `Tolong kirim foto barangnya sebagai bukti, ya.`",
        ],
        pronunciation_focus_en: [
          "TO-long KI-rim FO-to BA-rang-nya se-BA-gai BUK-ti — `sebagai` = as; `bukti` = proof/evidence.",
          "VN-speaker trap: `untuk bukti`. 'As proof' is `sebagai bukti`.",
          "Drill: `Tolong kirim foto barangnya sebagai bukti, ya.`",
        ],
      },
      {
        en: "Kalau berkenan, tolong kasih rating bintang lima, ya, Kak.",
        vi: "Nếu được, bạn cho tụi mình đánh giá năm sao nhé.",
        pronunciation_focus: [
          "KA-lau ber-ke-NAN, TO-long KA-sih RE-ting BIN-tang LI-ma — `berkenan` = nếu vui lòng (trang trọng); `kasih rating` = cho đánh giá.",
          "Lỗi người Việt: ép khách bằng `harus`. Nhờ rating lịch sự dùng `kalau berkenan`.",
          "Luyện: `Kalau berkenan, tolong kasih rating bintang lima, ya, Kak.`",
        ],
        pronunciation_focus_en: [
          "KA-lau ber-ke-NAN, TO-long KA-sih RE-ting BIN-tang LI-ma — `berkenan` = if you're willing (polite); `kasih rating` = give a rating.",
          "VN-speaker trap: pressuring with `harus`. A polite rating request uses `kalau berkenan`.",
          "Drill: `Kalau berkenan, tolong kasih rating bintang lima, ya, Kak.`",
        ],
      },
      {
        en: "Terima kasih sudah belanja. Ditunggu order berikutnya, ya.",
        vi: "Cảm ơn bạn đã mua sắm. Hẹn đơn lần sau nhé.",
        pronunciation_focus: [
          "te-ri-MA KA-sih SU-dah be-LAN-ja. di-TUNG-gu OR-der be-ri-KUT-nya — `belanja` = mua sắm; `ditunggu order berikutnya` = chờ đơn tiếp theo (câu tiễn khách).",
          "Lỗi người Việt: chỉ nói `terima kasih`. Câu chốt mời quay lại là `ditunggu order berikutnya`.",
          "Luyện: `Terima kasih sudah belanja. Ditunggu order berikutnya, ya.`",
        ],
        pronunciation_focus_en: [
          "te-ri-MA KA-sih SU-dah be-LAN-ja. di-TUNG-gu OR-der be-ri-KUT-nya — `belanja` = to shop; `ditunggu order berikutnya` = looking forward to your next order (the sign-off).",
          "VN-speaker trap: stopping at `terima kasih`. The return-inviting sign-off is `ditunggu order berikutnya`.",
          "Drill: `Terima kasih sudah belanja. Ditunggu order berikutnya, ya.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Bán hàng online ở Indonesia chủ yếu trên `Shopee`, `Tokopedia`, `Lazada` và `TikTok Shop`. Người bán (`penjual`/`seller`) chat với khách bằng giọng thân thiện: gọi khách là `Kak` (trung tính), chèn `ya`/`nih`/`dong` cho mềm, và emoji là bình thường. Quy trình chuẩn: khách `checkout` → `pembayaran masuk` → seller `proses` đơn → đóng gói (`packing`) → giao cho `kurir` → nhập `nomor resi` để khách `lacak`. Các hãng chuyển phát phổ biến: `JNE`, `J&T`, `SiCepat`, `AnterAja`, `Ninja`, và `Shopee Express` (`SPX`). `COD` (trả tiền mặt khi nhận) rất phổ biến ở vùng ngoài đô thị, nhưng rủi ro khách từ chối nhận — nhiều seller hạn chế COD cho đơn lớn. Khi có khiếu nại (`komplain`), luôn xin lỗi trước (`mohon maaf`), yêu cầu ảnh `sebagai bukti`, rồi đề xuất `retur`/`ganti`/`refund`. Đánh giá (`rating`/`ulasan`) quyết định độ hiển thị của shop, nên seller hay nhờ `bintang lima` một cách lịch sự (`kalau berkenan`), KHÔNG ép. Lưu ý dùng `kami` (chúng tôi, không gồm khách) khi nói thay shop, không phải `kita`.",
    cultural_notes_en:
      "Online selling in Indonesia runs mostly on `Shopee`, `Tokopedia`, `Lazada`, and `TikTok Shop`. Sellers (`penjual`/`seller`) chat warmly: they call buyers `Kak` (neutral), soften with `ya`/`nih`/`dong`, and emoji are normal. The standard flow: buyer `checkout` → `pembayaran masuk` → seller `proses` the order → `packing` → hand to a `kurir` → enter the `nomor resi` so the buyer can `lacak` (track). Common couriers: `JNE`, `J&T`, `SiCepat`, `AnterAja`, `Ninja`, and `Shopee Express` (`SPX`). `COD` (cash on delivery) is very popular outside the cities but risks refused parcels — many sellers limit COD on big orders. For a complaint (`komplain`), always apologize first (`mohon maaf`), ask for a photo `sebagai bukti`, then offer `retur`/`ganti`/`refund`. Ratings/reviews (`rating`/`ulasan`) drive a store's visibility, so sellers politely ask for `bintang lima` (`kalau berkenan`), never pressuring. Note: use `kami` (we, excluding the buyer) when speaking for the shop, not `kita`.",
    tip_advice_vi:
      "Học theo vòng đời đơn hàng, mỗi chặng một câu: (1) chào + xác nhận — `Halo, Kak. Barang ready, stok masih ada.`; (2) thanh toán — `Pembayarannya sudah masuk, ya.`; (3) xử lý — `Pesanannya akan kami proses hari ini.`; (4) gửi + mã vận đơn — `Sudah kami kirim lewat J&T. Ini nomor resinya.`; (5) trấn an — `Mohon ditunggu, estimasi dua sampai tiga hari.`; (6) khiếu nại — `Mohon maaf, tolong kirim foto sebagai bukti, bisa kami retur/ganti.`; (7) chốt — `Terima kasih, kalau berkenan kasih bintang lima, ya.` Ba điểm ngữ pháp cốt lõi cho người Việt: dùng `kami` (không gồm khách) ≠ `kita`; làm quen thể bị động `di-` (`dikirim`, `diproses`, `dilacak`) — 'giọng vận hành' của e-commerce; và `c`='ch' nên `cek resi`='chek resi', `lacak`='la-chak'. Đừng dịch acronym: cứ dùng `COD`, `JNE`, `J&T`, `resi`.",
    tip_advice_en:
      "Learn it by order lifecycle, one line per stage: (1) greet + confirm — `Halo, Kak. Barang ready, stok masih ada.`; (2) payment — `Pembayarannya sudah masuk, ya.`; (3) processing — `Pesanannya akan kami proses hari ini.`; (4) ship + waybill — `Sudah kami kirim lewat J&T. Ini nomor resinya.`; (5) reassure — `Mohon ditunggu, estimasi dua sampai tiga hari.`; (6) complaint — `Mohon maaf, tolong kirim foto sebagai bukti, bisa kami retur/ganti.`; (7) close — `Terima kasih, kalau berkenan kasih bintang lima, ya.` Three core grammar points for VN speakers: use `kami` (excludes the buyer) ≠ `kita`; get comfortable with the `di-` passive (`dikirim`, `diproses`, `dilacak`) — the 'operations voice' of e-commerce; and `c`='ch', so `cek resi`='chek resi', `lacak`='la-chak'. Don't translate acronyms: keep `COD`, `JNE`, `J&T`, `resi`.",
    vocabulary: [
      // Platform & people
      {
        cell_id: "4e0d6fda-7498-47b0-8f92-d702ca9d230b",
        word: "penjual",
        en: "seller",
        vi: "người bán",
        pos: "noun",
        pronunciation_vi: "pen-JU-al — gốc `jual` + `peN-`; khách là `pembeli`",
        pronunciation_en: "pen-JU-al — root `jual` + `peN-`; the buyer is `pembeli`",
      },
      {
        cell_id: "f46f1d66-8b57-49d2-97f6-6decf1bf0a87",
        word: "toko",
        en: "shop / store",
        vi: "cửa hàng / shop",
        pos: "noun",
        pronunciation_vi: "TO-ko — `toko online` = shop online",
        pronunciation_en: "TO-ko — `toko online` = online store",
      },
      {
        cell_id: "7b772796-e11b-4a5e-ac6a-82fab5ad43fa",
        word: "pesanan",
        en: "order",
        vi: "đơn hàng",
        pos: "noun",
        pronunciation_vi: "pe-sa-NAN — gốc `pesan` + `-an`; `proses pesanan`",
        pronunciation_en: "pe-sa-NAN — root `pesan` + `-an`; `proses pesanan`",
      },
      // Payment & fulfilment
      {
        cell_id: "e2a1c711-4b16-44b3-9518-86dd920e1735",
        word: "pembayaran",
        en: "payment",
        vi: "việc thanh toán",
        pos: "noun",
        pronunciation_vi: "pem-ba-YA-ran — `pembayaran masuk` = tiền đã vào",
        pronunciation_en: "pem-ba-YA-ran — `pembayaran masuk` = payment received",
      },
      {
        cell_id: "46daaac3-cebc-4378-82af-d656a5d51c80",
        word: "COD",
        en: "cash on delivery",
        vi: "trả tiền khi nhận hàng",
        pos: "noun (acronym)",
        pronunciation_vi: "si-o-di — trả tiền mặt cho `kurir` lúc nhận",
        pronunciation_en: "see-oh-dee — pay the `kurir` cash on arrival",
      },
      {
        cell_id: "2383eeea-78cb-401f-8ce4-fe7201a2ba11",
        word: "proses",
        en: "to process (an order)",
        vi: "xử lý (đơn)",
        pos: "verb",
        pronunciation_vi: "PRO-ses — bị động `diproses` = được xử lý",
        pronunciation_en: "PRO-ses — passive `diproses` = is processed",
      },
      {
        cell_id: "1c1e03d5-bf6d-4fd0-b83b-4aef6f5cf7cc",
        word: "pengiriman",
        en: "shipping / delivery",
        vi: "việc giao hàng",
        pos: "noun",
        pronunciation_vi: "pe-ngi-RI-man — gốc `kirim` + `pe-...-an`",
        pronunciation_en: "pe-ngi-RI-man — root `kirim` + `pe-...-an`",
      },
      {
        cell_id: "30b310d5-1ff1-408d-bdc7-e5c19922650b",
        word: "kurir",
        en: "courier",
        vi: "người giao hàng / shipper",
        pos: "noun",
        pronunciation_vi: "KU-rir — JNE/J&T/SiCepat... là các `ekspedisi`",
        pronunciation_en: "KU-rir — JNE/J&T/SiCepat... are the `ekspedisi`",
      },
      {
        cell_id: "09a80c2b-c64a-48f7-93e0-fc20831d3230",
        word: "resi",
        en: "tracking / receipt number",
        vi: "mã vận đơn",
        pos: "noun",
        pronunciation_vi: "RE-si — `nomor resi`; khách `lacak` bằng nó",
        pronunciation_en: "RE-si — `nomor resi`; buyers `lacak` (track) with it",
      },
      {
        cell_id: "fd361451-cc93-4bba-9c61-6188859517c4",
        word: "lacak",
        en: "to track",
        vi: "tra cứu / theo dõi (đơn)",
        pos: "verb",
        pronunciation_vi: "LA-chak — `c`='ch'; bị động `dilacak`",
        pronunciation_en: "LA-chak — `c`='ch'; passive `dilacak`",
      },
      {
        cell_id: "8915c81d-bab8-4629-a028-6eb7f58a914e",
        word: "J&T / JNE",
        en: "courier companies",
        vi: "các hãng chuyển phát",
        pos: "noun (brand)",
        pronunciation_vi: "je-en-ti / je-en-e — đọc từng chữ; đừng dịch",
        pronunciation_en: "jay-en-tee / jay-en-ee — spell out; don't translate",
      },
      // Complaints & ratings
      {
        cell_id: "fbf85548-e1b2-45cc-9dc3-11e82d280e7b",
        word: "komplain",
        en: "complaint / to complain",
        vi: "khiếu nại",
        pos: "noun / verb",
        pronunciation_vi: "kom-PLAIN — xử lý: `mohon maaf` + `sebagai bukti`",
        pronunciation_en: "kom-PLAIN — handle with `mohon maaf` + `sebagai bukti`",
      },
      {
        cell_id: "1a615f60-7a2d-4eb2-af7d-aa922baf0c7c",
        word: "retur",
        en: "return (of goods)",
        vi: "trả hàng / hoàn hàng",
        pos: "noun / verb",
        pronunciation_vi: "RE-tur — không phải English `return`",
        pronunciation_en: "RE-tur — not English `return`",
      },
      {
        cell_id: "22d5067b-cdc7-46ed-a3e4-83cf036d1d89",
        word: "rating / ulasan",
        en: "rating / review",
        vi: "đánh giá / nhận xét",
        pos: "noun",
        pronunciation_vi: "RE-ting / u-LA-san — `bintang lima` = năm sao",
        pronunciation_en: "RE-ting / u-LA-san — `bintang lima` = five stars",
      },
      {
        cell_id: "fea3a323-492c-4e55-8b6d-618cc8de35e2",
        word: "garansi",
        en: "warranty / guarantee",
        vi: "bảo hành",
        pos: "noun",
        pronunciation_vi: "ga-ran-SI — `garansi tukar baru` = bảo hành đổi mới",
        pronunciation_en: "ga-ran-SI — `garansi tukar baru` = new-replacement warranty",
      },
    ],
    dialogue: [
      // Dialogue: a buyer asks stock, pays, ships, then a small complaint
      {
        cell_id: "0ff2f02a-2665-405b-ad82-319d15a7cefc",
        speaker: "Pembeli",
        text: "Kak, yang warna hitam masih ready? Mau order satu.",
        vi: "Shop ơi, màu đen còn hàng không? Mình muốn đặt một cái.",
        en: "Hi, is the black one still in stock? I'd like to order one.",
      },
      {
        cell_id: "7354dd64-cc8a-4a3b-a0a8-daca7afb44bf",
        speaker: "Penjual",
        text: "Ready, Kak. Stok masih ada. Silakan checkout, nanti kami proses.",
        vi: "Còn nha bạn. Vẫn còn hàng. Bạn cứ đặt, tụi mình sẽ xử lý.",
        en: "In stock. Please check out and we'll process it.",
      },
      {
        cell_id: "56f5349b-40bb-491f-9aa9-cb98f6f31c42",
        speaker: "Pembeli",
        text: "Sudah saya bayar pakai ShopeePay. Kira-kira sampai berapa hari?",
        vi: "Mình trả bằng ShopeePay rồi. Khoảng mấy ngày thì tới?",
        en: "I've paid with ShopeePay. Roughly how many days to arrive?",
      },
      {
        cell_id: "b1f7c7b3-1618-4417-b458-a87534d02bd1",
        speaker: "Penjual",
        text: "Pembayarannya sudah masuk, ya. Estimasi dua sampai tiga hari, kami kirim lewat J&T.",
        vi: "Thanh toán đã vào rồi nha. Dự kiến hai đến ba ngày, tụi mình gửi qua J&T.",
        en: "Payment received. Estimate two to three days, we'll ship via J&T.",
      },
      {
        cell_id: "b6f97d8d-cef8-477b-8dcf-2d2dedf750d9",
        speaker: "Penjual",
        text: "Ini nomor resinya: JT123456789. Bisa dilacak di aplikasi, ya, Kak.",
        vi: "Đây mã vận đơn: JT123456789. Bạn tra trên app được nha.",
        en: "Here's the tracking number: JT123456789. You can track it in the app.",
      },
      {
        cell_id: "90d096d3-de45-4904-a433-ec45505ad21d",
        speaker: "Pembeli",
        text: "Kak, barangnya sudah sampai tapi ada sedikit lecet di sisi.",
        vi: "Shop ơi, hàng tới rồi nhưng có một chút trầy ở cạnh.",
        en: "Hi, the item arrived but there's a small scuff on the side.",
      },
      {
        cell_id: "677cd7b2-7c31-47cd-b268-b986ebb373a6",
        speaker: "Penjual",
        text: "Mohon maaf atas ketidaknyamanannya. Tolong kirim foto sebagai bukti, nanti bisa kami retur atau ganti baru.",
        vi: "Thành thật xin lỗi vì sự bất tiện. Bạn gửi ảnh làm bằng chứng nhé, tụi mình sẽ đổi trả hoặc đổi cái mới.",
        en: "So sorry for the inconvenience. Please send a photo as proof, then we can return or replace it.",
      },
      {
        cell_id: "544f67ea-82a0-4c67-bf7b-26a46498d6a7",
        speaker: "Pembeli",
        text: "Oke, sudah saya kirim fotonya. Makasih responnya cepat.",
        vi: "Ok, mình gửi ảnh rồi. Cảm ơn shop phản hồi nhanh.",
        en: "Okay, I've sent the photo. Thanks for the quick response.",
      },
      {
        cell_id: "b28559aa-240e-487e-8d2f-d702c50d2c11",
        speaker: "Penjual",
        text: "Sama-sama, Kak. Kalau berkenan, kasih bintang lima, ya. Ditunggu order berikutnya!",
        vi: "Không có gì bạn ơi. Nếu được, cho năm sao nhé. Hẹn đơn lần sau!",
        en: "You're welcome. If you're willing, please give five stars. Looking forward to your next order!",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Hàng có sẵn nha bạn. Còn hàng.", answer: "Barang ready, Kak. Stok masih ada." },
          { prompt: "Khoản thanh toán đã vào rồi nha bạn.", answer: "Pembayarannya sudah masuk, ya, Kak." },
          { prompt: "Đơn của bạn sẽ được tụi mình xử lý hôm nay.", answer: "Pesanannya akan kami proses hari ini." },
          { prompt: "Đây là mã vận đơn, có thể tra trên app.", answer: "Ini nomor resinya, bisa dilacak di aplikasi." },
          { prompt: "Thành thật xin lỗi vì sự bất tiện này.", answer: "Mohon maaf atas ketidaknyamanannya." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Indonesia:",
        instruction_en: "Extra practice — translate into Indonesian:",
        items: [
          { prompt: "Hàng đã được tụi mình gửi qua J&T.", answer: "Barangnya sudah kami kirim lewat J&T." },
          { prompt: "Dự kiến tới trong hai đến ba ngày.", answer: "Estimasi sampai dua sampai tiga hari." },
          { prompt: "Làm ơn gửi ảnh món hàng làm bằng chứng.", answer: "Tolong kirim foto barangnya sebagai bukti." },
          { prompt: "Nếu hàng hỏng, có thể đổi trả hoặc đổi mới.", answer: "Kalau barang rusak, bisa kami retur atau ganti baru." },
          { prompt: "Nếu được, cho tụi mình năm sao nhé.", answer: "Kalau berkenan, kasih rating bintang lima, ya." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Điền `kami` hay `kita` cho đúng (chúng tôi, không gồm khách / chúng ta, gồm cả khách):",
        instruction_en:
          "Fill in `kami` or `kita` (we-excluding-listener / we-including-listener):",
        items: [
          { prompt: "Pesanannya akan ___ proses hari ini. (shop nói với khách)", answer: "kami", hint: "không gồm khách" },
          { prompt: "Barangnya sudah ___ kirim lewat J&T. (shop nói với khách)", answer: "kami", hint: "không gồm khách" },
          { prompt: "Ayo ___ sama-sama jaga rating toko ini. (nói với đồng nghiệp cùng shop)", answer: "kita", hint: "gồm cả người nghe" },
        ],
      },
      {
        type: "passive_drill",
        instruction_vi:
          "Đổi sang thể bị động `di-` (giọng vận hành e-commerce): `kirim` → ___, `proses` → ___, `lacak` → ___, `tunggu` → ___.",
        instruction_en:
          "Make the `di-` passive (e-commerce operations voice): `kirim` → ___, `proses` → ___, `lacak` → ___, `tunggu` → ___.",
        items: [
          { prompt: "kirim (gửi) →", answer: "dikirim" },
          { prompt: "proses (xử lý) →", answer: "diproses" },
          { prompt: "lacak (tra cứu) →", answer: "dilacak" },
          { prompt: "tunggu (chờ) →", answer: "ditunggu" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung tin nhắn cập nhật đơn — điền chỗ trống: `Halo, Kak. Pembayarannya sudah ___. Pesanannya akan kami ___ hari ini. Sudah kami kirim lewat ___, ini nomor ___-nya. Estimasi ___ hari, mohon ___, ya.`",
        instruction_en:
          "Order-update message frame — fill the blanks: `Halo, Kak. Pembayarannya sudah ___. Pesanannya akan kami ___ hari ini. Sudah kami kirim lewat ___, ini nomor ___-nya. Estimasi ___ hari, mohon ___, ya.`",
        example:
          "Halo, Kak. Pembayarannya sudah masuk. Pesanannya akan kami proses hari ini. Sudah kami kirim lewat J&T, ini nomor resinya. Estimasi dua sampai tiga hari, mohon ditunggu, ya.",
        example_vi:
          "Chào bạn. Thanh toán đã vào. Đơn sẽ được tụi mình xử lý hôm nay. Đã gửi qua J&T, đây mã vận đơn. Dự kiến hai đến ba ngày, mong bạn chờ nhé.",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra bán hàng online — bạn làm được chưa?",
        instruction_en: "Quick online-selling self-check — can you do each one?",
        items: [
          { vi: "Tôi có thể chào khách bằng `Kak` và xác nhận còn hàng.", en: "I can greet with `Kak` and confirm stock." },
          { vi: "Tôi có thể báo thanh toán đã vào và sẽ xử lý đơn.", en: "I can confirm payment received and that I'll process the order." },
          { vi: "Tôi có thể báo đã gửi + cung cấp mã vận đơn (resi).", en: "I can report shipment and give the tracking (resi) number." },
          { vi: "Tôi có thể xử lý khiếu nại: xin lỗi, xin ảnh, đề xuất retur/ganti.", en: "I can handle a complaint: apologize, request a photo, offer retur/ganti." },
          { vi: "Tôi dùng `kami` (không gồm khách), không `kita`.", en: "I use `kami` (excluding the buyer), not `kita`." },
          { vi: "Tôi dùng thể bị động `di-` (dikirim, diproses, dilacak).", en: "I use the `di-` passive (dikirim, diproses, dilacak)." },
        ],
      },
    ],
  },
];

export default lessons;
