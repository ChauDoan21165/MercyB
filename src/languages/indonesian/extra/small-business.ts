// Small Business Indonesian (Vietnamese → Indonesian study track).
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
// Small-business Indonesian mixes everyday speech with money/admin nouns built on
// the `ke-...-an`, `pe-...-an`, `-an` frames (`keuntungan`, `penjualan`, `jualan`).
// Vietnamese WIN: no conjugation/gender/tone — numbers + nouns stay short. Traps:
// `c` = "ch" (`cuan` = "chu-an"), the `untung`/`rugi`/`modal` money triad, and
// `usaha` meaning both "business" and "effort".

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
    id: "indonesian_small_business",
    level: "B1",
    category: "work",
    title_vi: "Tiếng Indonesia cho kinh doanh nhỏ",
    title_en: "Small business Indonesian",
    sentences: [
      // ── Starting & describing the business ─────────────────────────────
      {
        en: "Saya mau buka usaha kecil.",
        vi: "Tôi muốn mở một việc kinh doanh nhỏ.",
        pronunciation_focus: [
          "SA-ya mau BU-ka u-SA-ha ke-CHIL — `buka usaha` = mở kinh doanh; `kecil` đọc 'ke-CHIL' vì `c`='ch'.",
          "Lỗi người Việt: đọc `kecil` thành 'ke-kil'. Nhớ `c` trong tiếng Indonesia = 'ch'.",
          "Lưu ý: `usaha` vừa nghĩa 'việc kinh doanh' vừa nghĩa 'sự nỗ lực' — xem ngữ cảnh.",
          "Luyện: `Saya mau buka usaha kecil.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau BU-ka u-SA-ha ke-CHIL — `buka usaha` = start a business; `kecil` is 'ke-CHIL' since `c`='ch'.",
          "VN-speaker trap: reading `kecil` as 'ke-kil'. Indonesian `c` = 'ch'.",
          "Note: `usaha` means both 'business' and 'effort' — context decides.",
          "Drill: `Saya mau buka usaha kecil.`",
        ],
      },
      {
        en: "Usaha saya jualan makanan rumahan.",
        vi: "Việc kinh doanh của tôi là bán đồ ăn nhà làm.",
        pronunciation_focus: [
          "u-SA-ha SA-ya ju-A-lan ma-KA-nan ru-MA-han — `jualan` = việc bán/buôn bán (gốc `jual` + `-an`); `rumahan` = (đồ) nhà làm.",
          "Lỗi người Việt: nói `jual` (động từ). 'Việc buôn bán' (danh từ/hoạt động) là `jualan`.",
          "Luyện: `Usaha saya jualan makanan rumahan.`",
        ],
        pronunciation_focus_en: [
          "u-SA-ha SA-ya ju-A-lan ma-KA-nan ru-MA-han — `jualan` = selling/the trade (root `jual` + `-an`); `rumahan` = home-made.",
          "VN-speaker trap: `jual` (the verb). 'The selling/trade' (noun/activity) is `jualan`.",
          "Drill: `Usaha saya jualan makanan rumahan.`",
        ],
      },
      {
        en: "Saya jualan online lewat WhatsApp dan Shopee.",
        vi: "Tôi bán online qua WhatsApp và Shopee.",
        pronunciation_focus: [
          "ju-A-lan ON-lain LE-wat — `lewat` = qua/thông qua; `online` mượn tiếng Anh.",
          "Lỗi người Việt: nói `di WhatsApp` cho phương tiện. 'Qua/bằng kênh nào' dùng `lewat`.",
          "Luyện: `Saya jualan online lewat WhatsApp dan Shopee.`",
        ],
        pronunciation_focus_en: [
          "ju-A-lan ON-line LE-wat — `lewat` = via/through; `online` is a loanword.",
          "VN-speaker trap: `di WhatsApp` for the channel. 'Via which channel' uses `lewat`.",
          "Drill: `Saya jualan online lewat WhatsApp dan Shopee.`",
        ],
      },
      // ── Capital, price, margin ─────────────────────────────────────────
      {
        en: "Modal awal saya kecil saja.",
        vi: "Vốn ban đầu của tôi chỉ nhỏ thôi.",
        pronunciation_focus: [
          "MO-dal A-wal SA-ya ke-CHIL SA-ja — `modal` = vốn; `awal` = ban đầu; `saja` = thôi (đứng CUỐI).",
          "Lỗi người Việt: nói `modal kecil saja saya`. Trật tự: sở hữu `saya` đứng sau danh từ, `saja` chốt câu.",
          "Luyện: `Modal awal saya kecil saja.`",
        ],
        pronunciation_focus_en: [
          "MO-dal A-wal SA-ya ke-CHIL SA-ja — `modal` = capital; `awal` = initial; `saja` = just (sits at the END).",
          "VN-speaker trap: `modal kecil saja saya`. Order: possessive `saya` follows the noun, `saja` ends the clause.",
          "Drill: `Modal awal saya kecil saja.`",
        ],
      },
      {
        en: "Harga modalnya sepuluh ribu, saya jual lima belas ribu.",
        vi: "Giá vốn mười nghìn, tôi bán mười lăm nghìn.",
        pronunciation_focus: [
          "HAR-ga MO-dal-nya se-PU-luh RI-bu, ... LI-ma be-LAS RI-bu — `ribu` = nghìn; số đứng TRƯỚC `ribu`.",
          "Lỗi người Việt: lẫn `lima belas` (15) với `lima puluh` (50). `belas` = mười-mấy, `puluh` = mấy-mươi.",
          "Luyện: `Harga modalnya sepuluh ribu, saya jual lima belas ribu.`",
        ],
        pronunciation_focus_en: [
          "HAR-ga MO-dal-nya se-PU-luh RI-bu, ... LI-ma be-LAS RI-bu — `ribu` = thousand; the number precedes `ribu`.",
          "VN-speaker trap: confusing `lima belas` (15) with `lima puluh` (50). `belas` = teens, `puluh` = tens.",
          "Drill: `Harga modalnya sepuluh ribu, saya jual lima belas ribu.`",
        ],
      },
      {
        en: "Jadi untungnya lima ribu per porsi.",
        vi: "Vậy lãi là năm nghìn mỗi phần.",
        pronunciation_focus: [
          "JA-di UN-tung-nya LI-ma RI-bu per POR-si — `untung` = lãi/lời; `untungnya` = phần lãi đó; `per porsi` = mỗi phần.",
          "Lỗi người Việt: nói `lời` (tiếng Việt). 'Lãi' là `untung`; danh từ 'khoản lãi' là `keuntungan`/`untungnya`.",
          "Luyện: `Jadi untungnya lima ribu per porsi.`",
        ],
        pronunciation_focus_en: [
          "JA-di UN-tung-nya LI-ma RI-bu per POR-si — `untung` = profit; `untungnya` = the profit; `per porsi` = per portion.",
          "VN-speaker trap: code-switching. 'Profit' is `untung`; the noun 'the profit' is `keuntungan`/`untungnya`.",
          "Drill: `Jadi untungnya lima ribu per porsi.`",
        ],
      },
      {
        en: "Bulan ini saya malah rugi sedikit.",
        vi: "Tháng này tôi lại còn lỗ một chút.",
        pronunciation_focus: [
          "BU-lan I-ni SA-ya MA-lah RU-gi se-DI-kit — `rugi` = lỗ (đối lập `untung`); `malah` = lại còn (ngược kỳ vọng).",
          "Lỗi người Việt: bỏ `malah`. `malah` thêm sắc thái 'trái với mong đợi', rất tự nhiên khi than lỗ.",
          "Luyện: `Bulan ini saya malah rugi sedikit.`",
        ],
        pronunciation_focus_en: [
          "BU-lan I-ni SA-ya MA-lah RU-gi se-DI-kit — `rugi` = loss (opposite of `untung`); `malah` = actually/even (against expectation).",
          "VN-speaker trap: dropping `malah`. It adds 'contrary to expectation', natural when reporting a loss.",
          "Drill: `Bulan ini saya malah rugi sedikit.`",
        ],
      },
      // ── Customers, orders, stock ───────────────────────────────────────
      {
        en: "Pelanggannya makin banyak.",
        vi: "Khách hàng ngày càng đông.",
        pronunciation_focus: [
          "pe-lang-GAN-nya MA-kin BA-nyak — `pelanggan` = khách quen/khách hàng; `makin … ` = ngày càng …",
          "Lỗi người Việt: nói `tamu` (= khách đến chơi). Khách mua hàng là `pelanggan`.",
          "Luyện: `Pelanggannya makin banyak.`",
        ],
        pronunciation_focus_en: [
          "pe-lang-GAN-nya MA-kin BA-nyak — `pelanggan` = customer; `makin …` = increasingly …",
          "VN-speaker trap: `tamu` means a social guest. A paying customer is `pelanggan`.",
          "Drill: `Pelanggannya makin banyak.`",
        ],
      },
      {
        en: "Ada yang mau pesan dalam jumlah banyak.",
        vi: "Có người muốn đặt số lượng lớn.",
        pronunciation_focus: [
          "A-da yang mau PE-san DA-lam JUM-lah BA-nyak — `dalam jumlah banyak` = với số lượng lớn (đặt sỉ).",
          "Lỗi người Việt: nói `pesan banyak banyak`. Diễn đạt chuẩn là `dalam jumlah banyak`.",
          "Luyện: `Ada yang mau pesan dalam jumlah banyak.`",
        ],
        pronunciation_focus_en: [
          "A-da yang mau PE-san DA-lam JUM-lah BA-nyak — `dalam jumlah banyak` = in large quantity (bulk order).",
          "VN-speaker trap: `pesan banyak banyak`. The standard phrasing is `dalam jumlah banyak`.",
          "Drill: `Ada yang mau pesan dalam jumlah banyak.`",
        ],
      },
      {
        en: "Maaf, stoknya habis hari ini.",
        vi: "Xin lỗi, hôm nay hết hàng rồi.",
        pronunciation_focus: [
          "ma-AF, STOK-nya HA-bis HA-ri I-ni — `stok` = hàng tồn/hàng có sẵn; `habis` = hết.",
          "Lỗi người Việt: nói `tidak ada barang` cho mọi trường hợp. Hết hàng gọn là `stoknya habis`.",
          "Luyện: `Maaf, stoknya habis hari ini.`",
        ],
        pronunciation_focus_en: [
          "ma-AF, STOK-nya HA-bis HA-ri I-ni — `stok` = stock; `habis` = sold out/finished.",
          "VN-speaker trap: defaulting to `tidak ada barang`. 'Out of stock' is simply `stoknya habis`.",
          "Drill: `Maaf, stoknya habis hari ini.`",
        ],
      },
      {
        en: "Boleh, tapi harganya bisa kurang sedikit?",
        vi: "Được, nhưng giá bớt một chút được không?",
        pronunciation_focus: [
          "BO-leh, TA-pi HAR-ga-nya BI-sa KU-rang se-DI-kit — `kurang` ở đây = giảm/bớt; thương lượng giá nhẹ nhàng.",
          "Lỗi người Việt: nói `turun harga`. Khi mặc cả lịch sự dùng `bisa kurang sedikit?`",
          "Luyện: `Boleh, tapi harganya bisa kurang sedikit?`",
        ],
        pronunciation_focus_en: [
          "BO-leh, TA-pi HAR-ga-nya BI-sa KU-rang se-DI-kit — `kurang` here = reduce/come down; soft price haggling.",
          "VN-speaker trap: `turun harga`. Politely bargaining is `bisa kurang sedikit?`",
          "Drill: `Boleh, tapi harganya bisa kurang sedikit?`",
        ],
      },
      // ── Money, bookkeeping, growth ─────────────────────────────────────
      {
        en: "Saya catat semua pemasukan dan pengeluaran.",
        vi: "Tôi ghi lại tất cả khoản thu và khoản chi.",
        pronunciation_focus: [
          "SA-ya CHA-tat SE-mua pe-ma-SU-kan dan pe-nge-lu-A-ran — `pemasukan` = khoản thu; `pengeluaran` = khoản chi; `catat`='cha-tat'.",
          "Lỗi người Việt: lẫn cặp đối: `masuk`(vào)→`pemasukan`(thu); `keluar`(ra)→`pengeluaran`(chi).",
          "Luyện: `Saya catat semua pemasukan dan pengeluaran.`",
        ],
        pronunciation_focus_en: [
          "SA-ya CHA-tat SE-mua pe-ma-SU-kan dan pe-nge-lu-A-ran — `pemasukan` = income; `pengeluaran` = expenses; `catat`='cha-tat'.",
          "VN-speaker trap: mixing the pair: `masuk`(in)→`pemasukan`(income); `keluar`(out)→`pengeluaran`(expenses).",
          "Drill: `Saya catat semua pemasukan dan pengeluaran.`",
        ],
      },
      {
        en: "Saya mau ajukan pinjaman modal ke bank.",
        vi: "Tôi muốn nộp đơn vay vốn ở ngân hàng.",
        pronunciation_focus: [
          "SA-ya mau a-JU-kan pin-JA-man MO-dal ke bank — `ajukan` = đề xuất/nộp (gốc `aju` + `-kan`); `pinjaman` = khoản vay.",
          "Lỗi người Việt: nói `pinjam modal` (động từ 'vay'). Đơn vay là DANH TỪ `pinjaman`.",
          "Luyện: `Saya mau ajukan pinjaman modal ke bank.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau a-JU-kan pin-JA-man MO-dal ke bank — `ajukan` = to submit (root `aju` + `-kan`); `pinjaman` = loan.",
          "VN-speaker trap: `pinjam modal` (the verb 'borrow'). A loan is the NOUN `pinjaman`.",
          "Drill: `Saya mau ajukan pinjaman modal ke bank.`",
        ],
      },
      {
        en: "Usaha saya sudah terdaftar sebagai UMKM.",
        vi: "Việc kinh doanh của tôi đã đăng ký là doanh nghiệp siêu nhỏ.",
        pronunciation_focus: [
          "u-SA-ha SA-ya SU-dah ter-DAF-tar se-BA-gai u-em-ka-em — `terdaftar` (bị động) = đã được đăng ký; `UMKM` đọc từng chữ.",
          "Lỗi người Việt: né bị động `ter-`. 'Đã được đăng ký' là `terdaftar`, không phải `mendaftar` (chủ động).",
          "Luyện: `Usaha saya sudah terdaftar sebagai UMKM.`",
        ],
        pronunciation_focus_en: [
          "u-SA-ha SA-ya SU-dah ter-DAF-tar se-BA-gai u-em-ka-em — `terdaftar` (passive) = is registered; `UMKM` is spelled out.",
          "VN-speaker trap: avoiding the `ter-` passive. 'Is registered' is `terdaftar`, not active `mendaftar`.",
          "Drill: `Usaha saya sudah terdaftar sebagai UMKM.`",
        ],
      },
      {
        en: "Pelan-pelan, yang penting usahanya jalan terus.",
        vi: "Từ từ thôi, quan trọng là việc kinh doanh chạy đều.",
        pronunciation_focus: [
          "pe-LAN-pe-LAN, yang PEN-ting u-SA-ha-nya JA-lan TE-rus — `pelan-pelan` (lặp) = từ từ; `jalan terus` = chạy/tiếp tục đều.",
          "Lưu ý người Việt: tiếng Indonesia lặp từ để nhấn ('từ từ', 'dần dần') — `pelan-pelan` rất thường gặp.",
          "Luyện: `Pelan-pelan, yang penting usahanya jalan terus.`",
        ],
        pronunciation_focus_en: [
          "pe-LAN-pe-LAN, yang PEN-ting u-SA-ha-nya JA-lan TE-rus — `pelan-pelan` (reduplication) = slowly; `jalan terus` = keep running.",
          "VN-speaker note: Indonesian reduplicates for emphasis ('slowly', 'gradually') — `pelan-pelan` is very common.",
          "Drill: `Pelan-pelan, yang penting usahanya jalan terus.`",
        ],
      },
    ],
    cultural_notes_vi:
      "`UMKM` (Usaha Mikro, Kecil, dan Menengah — doanh nghiệp siêu nhỏ, nhỏ và vừa) là xương sống kinh tế Indonesia: từ `warung` (quán tạp hóa/ăn uống nhỏ), `pedagang kaki lima` (hàng rong vỉa hè), tới `jualan online`. Đăng ký pháp lý cơ bản là `NIB` (Nomor Induk Berusaha) qua hệ thống `OSS`; nhiều chủ nhỏ cũng xin `sertifikat halal` và giấy `PIRT` cho thực phẩm. Vốn (`modal`) thường khởi đầu rất nhỏ, gọi vui là `modal nekat` (vốn liều). Tiền lãi trong tiếng lóng kinh doanh hiện đại là `cuan` (đọc 'chu-an'). Mặc cả (`tawar-menawar`) là chuyện thường ở chợ và hàng rong, nhưng KHÔNG mặc cả ở minimarket/siêu thị có niêm yết giá. Quan hệ cá nhân và chữ tín (`kepercayaan`) quan trọng hơn hợp đồng giấy ở quy mô nhỏ — khách quen (`pelanggan tetap`) và truyền miệng (`dari mulut ke mulut`) là kênh marketing mạnh nhất.",
    cultural_notes_en:
      "`UMKM` (Usaha Mikro, Kecil, dan Menengah — micro, small, and medium enterprises) is the backbone of Indonesia's economy: from `warung` (small shops/eateries) and `pedagang kaki lima` (street vendors) to `jualan online`. The basic legal registration is the `NIB` (Nomor Induk Berusaha) via the `OSS` system; many small owners also get a `sertifikat halal` and a `PIRT` food permit. Capital (`modal`) often starts tiny — jokingly `modal nekat` (guts as capital). In modern business slang, profit is `cuan` (say 'chu-an'). Haggling (`tawar-menawar`) is normal at markets and street stalls, but NOT at minimarkets/supermarkets with fixed prices. At small scale, personal relationships and trust (`kepercayaan`) matter more than paper contracts — regulars (`pelanggan tetap`) and word of mouth (`dari mulut ke mulut`) are the strongest marketing.",
    tip_advice_vi:
      "Nắm bộ ba tiền cốt lõi: `modal` (vốn) → `untung` (lãi) / `rugi` (lỗ); và cặp sổ sách `pemasukan` (thu) / `pengeluaran` (chi). Phân biệt động từ và danh từ qua phụ tố: `jual` (bán) → `jualan` (việc buôn bán) → `penjualan` (doanh số); `pinjam` (vay) → `pinjaman` (khoản vay); `untung` → `keuntungan`. Hai mẹo phát âm: `c` = 'ch' (`kecil`='ke-chil', `cuan`='chu-an', `catat`='cha-tat'); và lặp từ `pelan-pelan` để nhấn. Khi bán hàng, ba câu sống còn: báo hết hàng — `Stoknya habis`; chốt lãi mỗi đơn vị — `Untungnya ___ per porsi`; thương lượng — `Harganya bisa kurang sedikit?`. Tin vui: không chia thì, chỉ cần thêm `sudah`/`bulan ini`/`makin`.",
    tip_advice_en:
      "Lock the money triad: `modal` (capital) → `untung` (profit) / `rugi` (loss); plus the ledger pair `pemasukan` (income) / `pengeluaran` (expenses). Tell verb from noun by the affix: `jual` (sell) → `jualan` (the trade) → `penjualan` (sales); `pinjam` (borrow) → `pinjaman` (loan); `untung` → `keuntungan`. Two pronunciation tips: `c` = 'ch' (`kecil`='ke-chil', `cuan`='chu-an', `catat`='cha-tat'); and reduplication `pelan-pelan` for emphasis. Selling, three survival lines: report sold-out — `Stoknya habis`; state per-unit profit — `Untungnya ___ per porsi`; bargain — `Harganya bisa kurang sedikit?`. Good news: no tense — just add `sudah`/`bulan ini`/`makin`.",
    vocabulary: [
      // Business & ownership
      {
        word: "usaha",
        en: "business / enterprise (also: effort)",
        vi: "việc kinh doanh (cũng: sự nỗ lực)",
        pos: "noun",
        pronunciation_vi: "u-SA-ha — `buka usaha` = mở kinh doanh; nghĩa kép",
        pronunciation_en: "u-SA-ha — `buka usaha` = start a business; double meaning",
      },
      {
        word: "UMKM",
        en: "micro, small & medium enterprise",
        vi: "doanh nghiệp siêu nhỏ/nhỏ/vừa",
        pos: "noun (acronym)",
        pronunciation_vi: "u-em-ka-em — Usaha Mikro, Kecil, dan Menengah",
        pronunciation_en: "u-em-ka-em — Usaha Mikro, Kecil, dan Menengah",
      },
      {
        word: "jualan",
        en: "selling / one's trade",
        vi: "việc buôn bán",
        pos: "noun",
        pronunciation_vi: "ju-A-lan — gốc `jual` + `-an`; `jualan online` = bán online",
        pronunciation_en: "ju-A-lan — root `jual` + `-an`; `jualan online` = sell online",
      },
      {
        word: "pelanggan",
        en: "customer / regular",
        vi: "khách hàng / khách quen",
        pos: "noun",
        pronunciation_vi: "pe-LANG-gan — KHÁC `tamu` (khách đến chơi)",
        pronunciation_en: "pe-LANG-gan — NOT `tamu` (a social guest)",
      },
      // Money triad
      {
        word: "modal",
        en: "capital",
        vi: "vốn",
        pos: "noun",
        pronunciation_vi: "MO-dal — `modal awal` = vốn ban đầu; `modal nekat` = vốn liều",
        pronunciation_en: "MO-dal — `modal awal` = startup capital; `modal nekat` = guts as capital",
      },
      {
        word: "untung",
        en: "profit",
        vi: "lãi / lời",
        pos: "noun / adjective",
        pronunciation_vi: "UN-tung — danh từ `keuntungan`; lóng = `cuan`",
        pronunciation_en: "UN-tung — noun `keuntungan`; slang = `cuan`",
      },
      {
        word: "rugi",
        en: "loss",
        vi: "lỗ",
        pos: "noun / adjective",
        pronunciation_vi: "RU-gi — đối lập `untung`; `rugi besar` = lỗ nặng",
        pronunciation_en: "RU-gi — opposite of `untung`; `rugi besar` = big loss",
      },
      {
        word: "cuan",
        en: "profit / money (slang)",
        vi: "tiền lãi (lóng)",
        pos: "noun (slang)",
        pronunciation_vi: "chu-AN — `c`='ch'; tiếng lóng kinh doanh thời nay",
        pronunciation_en: "chu-AN — `c`='ch'; modern business slang",
      },
      // Bookkeeping
      {
        word: "pemasukan",
        en: "income / revenue",
        vi: "khoản thu",
        pos: "noun",
        pronunciation_vi: "pe-ma-SU-kan — gốc `masuk` (vào) + `pe-...-an`",
        pronunciation_en: "pe-ma-SU-kan — root `masuk` (in) + `pe-...-an`",
      },
      {
        word: "pengeluaran",
        en: "expenses / spending",
        vi: "khoản chi",
        pos: "noun",
        pronunciation_vi: "pe-nge-lu-A-ran — gốc `keluar` (ra) + `pe-...-an`",
        pronunciation_en: "pe-nge-lu-A-ran — root `keluar` (out) + `pe-...-an`",
      },
      {
        word: "modal nekat",
        en: "starting with guts, little money",
        vi: "vốn liều (liều mà làm)",
        pos: "phrase",
        pronunciation_vi: "MO-dal NE-kat — câu cửa miệng của chủ nhỏ",
        pronunciation_en: "MO-dal NE-kat — a small-owner catchphrase",
      },
      // Operations & growth
      {
        word: "stok",
        en: "stock / inventory",
        vi: "hàng tồn / hàng có sẵn",
        pos: "noun",
        pronunciation_vi: "stok — `stoknya habis` = hết hàng",
        pronunciation_en: "stok — `stoknya habis` = out of stock",
      },
      {
        word: "pinjaman",
        en: "loan",
        vi: "khoản vay",
        pos: "noun",
        pronunciation_vi: "pin-JA-man — DANH TỪ; động từ là `pinjam` (vay)",
        pronunciation_en: "pin-JA-man — the NOUN; the verb is `pinjam` (borrow)",
      },
      {
        word: "tawar-menawar",
        en: "haggling / bargaining",
        vi: "mặc cả / trả giá",
        pos: "noun",
        pronunciation_vi: "TA-war-me-NA-war — bình thường ở chợ, KHÔNG ở minimarket",
        pronunciation_en: "TA-war-me-NA-war — normal at markets, NOT at minimarkets",
      },
      {
        word: "terdaftar",
        en: "registered",
        vi: "đã được đăng ký",
        pos: "verb (passive)",
        pronunciation_vi: "ter-DAF-tar — bị động `ter-`; `terdaftar sebagai UMKM`",
        pronunciation_en: "ter-DAF-tar — `ter-` passive; `terdaftar sebagai UMKM`",
      },
    ],
    dialogue: [
      // Dialogue: a bulk order, a margin question, and a bit of haggling
      {
        speaker: "Pembeli",
        text: "Mbak, ini makanan rumahan, ya? Kelihatannya enak.",
        vi: "Chị ơi, đây là đồ ăn nhà làm à? Trông ngon ghê.",
        en: "Miss, is this home-made food? It looks delicious.",
      },
      {
        speaker: "Penjual",
        text: "Iya, Pak. Saya jualan online, tapi bisa juga ambil di rumah.",
        vi: "Vâng anh. Em bán online, nhưng cũng có thể lấy tại nhà.",
        en: "Yes, sir. I sell online, but you can also pick up at my place.",
      },
      {
        speaker: "Pembeli",
        text: "Saya mau pesan dalam jumlah banyak untuk acara kantor. Lima puluh porsi.",
        vi: "Tôi muốn đặt số lượng lớn cho sự kiện công ty. Năm mươi phần.",
        en: "I'd like to order in bulk for an office event. Fifty portions.",
      },
      {
        speaker: "Penjual",
        text: "Bisa, Pak. Harga satuannya lima belas ribu. Untuk lima puluh porsi, tujuh ratus lima puluh ribu.",
        vi: "Được ạ. Giá mỗi phần mười lăm nghìn. Năm mươi phần là bảy trăm năm mươi nghìn.",
        en: "Sure, sir. The unit price is fifteen thousand. For fifty portions, seven hundred fifty thousand.",
      },
      {
        speaker: "Pembeli",
        text: "Boleh, tapi harganya bisa kurang sedikit kalau pesan banyak?",
        vi: "Được, nhưng đặt nhiều thì giá bớt một chút được không?",
        en: "Okay, but can the price come down a little for a big order?",
      },
      {
        speaker: "Penjual",
        text: "Saya kasih tiga belas ribu per porsi, ya. Untungnya tipis, tapi tidak apa-apa demi pelanggan baru.",
        vi: "Em để mười ba nghìn mỗi phần nhé. Lãi mỏng, nhưng không sao vì khách mới.",
        en: "I'll do thirteen thousand per portion. The margin is thin, but that's fine for a new customer.",
      },
      {
        speaker: "Pembeli",
        text: "Setuju. Nanti saya transfer DP-nya lewat bank.",
        vi: "Đồng ý. Lát em chuyển tiền cọc qua ngân hàng.",
        en: "Agreed. I'll transfer the deposit by bank later.",
      },
      {
        speaker: "Penjual",
        text: "Terima kasih, Pak. Pelan-pelan usahanya berkembang berkat pelanggan seperti Bapak.",
        vi: "Cảm ơn anh. Từ từ việc làm ăn phát triển nhờ những khách như anh.",
        en: "Thank you, sir. Slowly the business grows thanks to customers like you.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn mở một việc kinh doanh nhỏ.", answer: "Saya mau buka usaha kecil." },
          { prompt: "Vốn ban đầu của tôi chỉ nhỏ thôi.", answer: "Modal awal saya kecil saja." },
          { prompt: "Vậy lãi là năm nghìn mỗi phần.", answer: "Jadi untungnya lima ribu per porsi." },
          { prompt: "Xin lỗi, hôm nay hết hàng rồi.", answer: "Maaf, stoknya habis hari ini." },
          { prompt: "Tôi muốn nộp đơn vay vốn ở ngân hàng.", answer: "Saya mau ajukan pinjaman modal ke bank." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Indonesia:",
        instruction_en: "Extra practice — translate into Indonesian:",
        items: [
          { prompt: "Tôi bán online qua WhatsApp và Shopee.", answer: "Saya jualan online lewat WhatsApp dan Shopee." },
          { prompt: "Tháng này tôi lại còn lỗ một chút.", answer: "Bulan ini saya malah rugi sedikit." },
          { prompt: "Khách hàng ngày càng đông.", answer: "Pelanggannya makin banyak." },
          { prompt: "Tôi ghi lại tất cả khoản thu và khoản chi.", answer: "Saya catat semua pemasukan dan pengeluaran." },
          { prompt: "Việc kinh doanh của tôi đã đăng ký là UMKM.", answer: "Usaha saya sudah terdaftar sebagai UMKM." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Điền danh từ đúng theo phụ tố: `jual` → ___ (việc buôn bán), `masuk` → ___ (khoản thu), `keluar` → ___ (khoản chi), `pinjam` → ___ (khoản vay), `untung` → ___ (khoản lãi).",
        instruction_en:
          "Fill the right derived noun: `jual` → ___ (the trade), `masuk` → ___ (income), `keluar` → ___ (expenses), `pinjam` → ___ (loan), `untung` → ___ (the profit).",
        items: [
          { prompt: "jual →", answer: "jualan", hint: "gốc + `-an`" },
          { prompt: "masuk →", answer: "pemasukan", hint: "`pe-...-an`" },
          { prompt: "keluar →", answer: "pengeluaran", hint: "`pe-...-an`" },
          { prompt: "pinjam →", answer: "pinjaman", hint: "gốc + `-an`" },
          { prompt: "untung →", answer: "keuntungan", hint: "`ke-...-an`" },
        ],
      },
      {
        type: "number_drill",
        instruction_vi:
          "Phân biệt `belas` (mười-mấy) và `puluh` (mấy-mươi) và `ribu` (nghìn). Viết bằng chữ tiếng Indonesia:",
        instruction_en:
          "Tell `belas` (teens) from `puluh` (tens) and `ribu` (thousand). Write in Indonesian words:",
        items: [
          { prompt: "15", answer: "lima belas" },
          { prompt: "50", answer: "lima puluh" },
          { prompt: "15.000", answer: "lima belas ribu" },
          { prompt: "50.000", answer: "lima puluh ribu" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung báo cáo lời/lỗ một đơn vị — điền chỗ trống: `Harga modalnya ___ ribu, saya jual ___ ribu. Jadi untungnya ___ ribu per ___. Bulan ini saya ___ (untung/rugi).`",
        instruction_en:
          "Per-unit P&L frame — fill the blanks: `Harga modalnya ___ ribu, saya jual ___ ribu. Jadi untungnya ___ ribu per ___. Bulan ini saya ___ (untung/rugi).`",
        example:
          "Harga modalnya sepuluh ribu, saya jual lima belas ribu. Jadi untungnya lima ribu per porsi. Bulan ini saya untung.",
        example_vi:
          "Giá vốn mười nghìn, tôi bán mười lăm nghìn. Vậy lãi năm nghìn mỗi phần. Tháng này tôi có lãi.",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra kinh doanh — bạn làm được chưa?",
        instruction_en: "Quick business self-check — can you do each one?",
        items: [
          { vi: "Tôi có thể giới thiệu việc kinh doanh và kênh bán.", en: "I can describe my business and sales channel." },
          { vi: "Tôi phân biệt được `modal`, `untung`, `rugi`.", en: "I can tell `modal`, `untung`, `rugi` apart." },
          { vi: "Tôi có thể nói lãi mỗi đơn vị và báo hết hàng.", en: "I can state per-unit profit and report out-of-stock." },
          { vi: "Tôi có thể thương lượng giá lịch sự.", en: "I can bargain a price politely." },
          { vi: "Tôi ghi được thu/chi (pemasukan/pengeluaran).", en: "I can record income/expenses (pemasukan/pengeluaran)." },
          { vi: "Tôi đọc `c` thành 'ch' (kecil = ke-chil, cuan = chu-an).", en: "I read `c` as 'ch' (kecil = ke-chil, cuan = chu-an)." },
        ],
      },
    ],
  },
];

export default lessons;
