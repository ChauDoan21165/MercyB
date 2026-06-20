// Shopping & Bargaining Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (legal-police.ts, banking-money.ts,
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
// no articles. Shopping is the friendliest place to practice — VN speakers already
// know haggling culture from the chợ, so the pragmatics transfer 1:1. The traps
// are the meN-/-an + di- pairs (`menawar` to haggle vs. `tawaran` an offer vs.
// `ditawar` to be haggled over), money words (`ribu` thousand, `juta` million,
// the dropped final '-ribu' in market speech: 'goceng' = 5k, 'ceban' = 10k), and
// the `bisa kurang?` / `boleh nego?` haggling formulas that no phrasebook drills.

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
    id: "indonesian_shopping_bargaining",
    level: "A2",
    category: "shopping",
    title_vi: "Tiếng Indonesia khi mua sắm & mặc cả",
    title_en: "Shopping & bargaining Indonesian",
    sentences: [
      // ── Asking the price ────────────────────────────────────────────────
      {
        en: "Permisi, ini berapa harganya?",
        vi: "Xin lỗi, cái này giá bao nhiêu?",
        pronunciation_focus: [
          "per-MI-si, I-ni be-RA-pa HAR-ga-nya? — `permisi` = xin phép/làm ơn; `berapa` = bao nhiêu; `harganya` = giá của nó (harga + -nya).",
          "Lợi thế người Việt: hỏi giá ngắn gọn y như tiếng Việt, không cần chia thì.",
          "Lỗi người Việt: nói `berapa harga?` cụt lủn. Tự nhiên hơn là `berapa harganya?` (có -nya).",
          "Luyện: `Ini berapa harganya?`",
        ],
        pronunciation_focus_en: [
          "per-MEE-si, EE-ni be-RA-pa HAR-ga-nya? — `permisi` = excuse me; `berapa` = how much/many; `harganya` = its price (harga + -nya).",
          "VN-speaker win: asking a price is as short as in Vietnamese — no tense to conjugate.",
          "VN-speaker trap: a bare `berapa harga?`. More natural is `berapa harganya?` (with -nya).",
          "Drill: `Ini berapa harganya?`",
        ],
      },
      {
        en: "Wah, mahal sekali. Bisa kurang?",
        vi: "Ồ, đắt quá. Bớt được không?",
        pronunciation_focus: [
          "wah, MA-hal se-KA-li. BI-sa KU-rang? — `mahal` = đắt; `sekali` (đứng sau) = rất/lắm; `bisa kurang?` = bớt được không (câu mặc cả chuẩn).",
          "Lỗi người Việt: đặt `sekali` trước tính từ. Đúng là `mahal sekali` (tính từ + sekali), không `sekali mahal`.",
          "Mẹo: `bisa kurang?` là câu mở màn mặc cả vạn năng ở chợ.",
          "Luyện: `Mahal sekali. Bisa kurang?`",
        ],
        pronunciation_focus_en: [
          "wah, MA-hal se-KA-li. BEE-sa KOO-rang? — `mahal` = expensive; `sekali` (after the word) = very; `bisa kurang?` = can it be less? (the standard haggle).",
          "VN-speaker trap: placing `sekali` before the adjective. It's `mahal sekali` (adjective + sekali), never `sekali mahal`.",
          "Tip: `bisa kurang?` is the all-purpose opening haggle at a market.",
          "Drill: `Mahal sekali. Bisa kurang?`",
        ],
      },
      {
        en: "Boleh nego, Bu? Saya ambil dua kalau murah.",
        vi: "Thương lượng được không cô? Tôi lấy hai cái nếu rẻ.",
        pronunciation_focus: [
          "BO-leh NE-go, Bu? SA-ya AM-bil DU-a KA-lau MU-rah — `boleh nego` = được mặc cả không; `ambil` = lấy; `kalau` = nếu; `murah` = rẻ.",
          "Lợi thế người Việt: `kalau` = 'nếu' giống hệt cấu trúc điều kiện tiếng Việt, đặt đầu mệnh đề.",
          "Lỗi người Việt: lẫn `bisa` (có thể) và `boleh` (được phép). Xin phép mặc cả dùng `boleh nego?`.",
          "Luyện: `Boleh nego, Bu? Saya ambil dua kalau murah.`",
        ],
        pronunciation_focus_en: [
          "BO-leh NE-go, Bu? SA-ya AM-bil DOO-a KA-lau MOO-rah — `boleh nego` = may I negotiate?; `ambil` = to take; `kalau` = if; `murah` = cheap.",
          "VN-speaker win: `kalau` = 'if' works just like the Vietnamese conditional, at the front of the clause.",
          "VN-speaker trap: confusing `bisa` (be able to) with `boleh` (be allowed to). To ask permission to haggle, use `boleh nego?`.",
          "Drill: `Boleh nego, Bu? Saya ambil dua kalau murah.`",
        ],
      },
      // ── Counter-offering ────────────────────────────────────────────────
      {
        en: "Lima puluh ribu saja, ya? Itu pas buat saya.",
        vi: "Năm mươi nghìn thôi nhé? Vậy là vừa với tôi.",
        pronunciation_focus: [
          "LI-ma PU-luh RI-bu SA-ja, ya? I-tu pas BU-at SA-ya — `lima puluh ribu` = 50.000 (rupiah); `saja` = chỉ/thôi; `pas` = vừa/đúng; `buat` = cho/đối với.",
          "Lỗi người Việt: bỏ chữ `ribu` (nghìn). Người Việt quen nói trống số; ở Indonesia phải nói `lima puluh ribu`, không chỉ 'lima puluh'.",
          "Mẹo: `saja` cuối câu làm lời đề nghị mềm hơn ('thôi nhé').",
          "Luyện: `Lima puluh ribu saja, ya?`",
        ],
        pronunciation_focus_en: [
          "LEE-ma POO-luh REE-boo SA-ja, ya? EE-too pas BOO-at SA-ya — `lima puluh ribu` = 50,000 (rupiah); `saja` = just/only; `pas` = exact/right; `buat` = for.",
          "VN-speaker trap: dropping `ribu` (thousand). In Indonesian you must say `lima puluh ribu`, not just 'lima puluh'.",
          "Tip: a sentence-final `saja` softens the offer ('just this, okay?').",
          "Drill: `Lima puluh ribu saja, ya?`",
        ],
      },
      {
        en: "Kalau begitu, saya cari di toko lain saja.",
        vi: "Nếu vậy thì tôi tìm ở cửa hàng khác vậy.",
        pronunciation_focus: [
          "KA-lau be-GI-tu, SA-ya CA-ri di TO-ko LA-in SA-ja — `kalau begitu` = nếu vậy thì; `cari` = tìm; `toko` = cửa hàng; `lain` = khác.",
          "Lỗi người Việt: đọc `c` thành 'x'/'k'. `Cari` đọc 'CHA-ri' ('c' = 'ch').",
          "Mẹo: câu này là 'nước đi bỏ đi' — thường khiến người bán hạ giá ngay.",
          "Luyện: `Kalau begitu, saya cari di toko lain saja.`",
        ],
        pronunciation_focus_en: [
          "KA-lau be-GEE-too, SA-ya CHA-ri di TO-ko LA-in SA-ja — `kalau begitu` = in that case; `cari` = to look for; `toko` = shop; `lain` = other.",
          "VN-speaker trap: mispronouncing `c`. `Cari` is 'CHA-ri' (`c` = 'ch').",
          "Tip: this is the 'walk-away' move — it often makes the seller drop the price at once.",
          "Drill: `Kalau begitu, saya cari di toko lain saja.`",
        ],
      },
      {
        en: "Oke, deal. Saya beli yang ini.",
        vi: "Được, chốt. Tôi mua cái này.",
        pronunciation_focus: [
          "O-ke, deal. SA-ya be-LI yang I-ni — `oke`/`deal` = đồng ý (vay tiếng Anh, dùng đời thường); `beli` = mua; `yang ini` = cái này.",
          "Lỗi người Việt: lẫn `beli` (mua) với `jual` (bán). Người mua nói `saya beli`.",
          "Mẹo: `yang ini` = 'cái này (đây)'; `yang itu` = 'cái kia (đó)'.",
          "Luyện: `Oke, saya beli yang ini.`",
        ],
        pronunciation_focus_en: [
          "O-ke, deal. SA-ya be-LEE yang EE-ni — `oke`/`deal` = agreed (English loans, everyday use); `beli` = to buy; `yang ini` = this one.",
          "VN-speaker trap: confusing `beli` (to buy) with `jual` (to sell). The buyer says `saya beli`.",
          "Tip: `yang ini` = 'this one'; `yang itu` = 'that one'.",
          "Drill: `Oke, saya beli yang ini.`",
        ],
      },
      // ── Mall / formal retail ────────────────────────────────────────────
      {
        en: "Apakah ada diskon untuk barang ini?",
        vi: "Có giảm giá cho món hàng này không?",
        pronunciation_focus: [
          "a-pa-KAH A-da dis-KON UN-tuk BA-rang I-ni? — `apakah` = (câu hỏi có/không trang trọng); `diskon` = giảm giá; `barang` = hàng/đồ; `untuk` = cho.",
          "Lỗi người Việt: cố mặc cả ở mall. Trong mall giá cố định (`harga pas`); chỉ hỏi `diskon`/`promo`, không trả giá.",
          "Luyện: `Apakah ada diskon untuk barang ini?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH A-da dis-KON UN-tuk BA-rang EE-ni? — `apakah` = (formal yes/no marker); `diskon` = discount; `barang` = goods/item; `untuk` = for.",
          "VN-speaker trap: trying to haggle in a mall. Malls have fixed prices (`harga pas`); only ask about `diskon`/`promo`, don't bargain.",
          "Drill: `Apakah ada diskon untuk barang ini?`",
        ],
      },
      {
        en: "Bisa bayar dengan kartu? Ada cicilan tidak?",
        vi: "Trả bằng thẻ được không? Có trả góp không?",
        pronunciation_focus: [
          "BI-sa BA-yar DE-ngan KAR-tu? A-da ci-CIL-an TI-dak? — `bayar` = trả/thanh toán; `kartu` = thẻ; `cicilan` = trả góp (từ `cicil`); `tidak` cuối câu = câu hỏi có/không.",
          "Lỗi người Việt: đọc `cicilan` sai. `c` = 'ch' → 'chi-CHIL-an'.",
          "Mẹo: `... tidak?` cuối câu = cách hỏi có/không đời thường (như `... không?` của tiếng Việt).",
          "Luyện: `Bisa bayar dengan kartu? Ada cicilan tidak?`",
        ],
        pronunciation_focus_en: [
          "BEE-sa BA-yar DE-ngan KAR-too? A-da chi-CHIL-an TEE-dak? — `bayar` = to pay; `kartu` = card; `cicilan` = installments (from `cicil`); a final `tidak` = yes/no question.",
          "VN-speaker trap: mispronouncing `cicilan`. `c` = 'ch' → 'chi-CHIL-an'.",
          "Tip: a sentence-final `... tidak?` is the casual yes/no question (like Vietnamese `... không?`).",
          "Drill: `Bisa bayar dengan kartu? Ada cicilan tidak?`",
        ],
      },
      {
        en: "Kalau ukurannya tidak pas, boleh ditukar atau diretur?",
        vi: "Nếu cỡ không vừa, có đổi hoặc trả lại được không?",
        pronunciation_focus: [
          "KA-lau u-ku-RAN-nya TI-dak pas, BO-leh di-TU-kar A-tau di-re-TUR? — `ukuran` = kích cỡ; `ditukar` = được đổi (bị động `di-`); `diretur` = được trả lại; `atau` = hoặc.",
          "Lỗi người Việt: quên `di-` cho thể bị động. 'Có thể đổi' = `boleh ditukar` (di- + tukar).",
          "Mẹo: `tukar` = đổi (lấy cái khác); `retur` = trả lại hàng (vay tiếng Anh 'return').",
          "Luyện: `Boleh ditukar atau diretur?`",
        ],
        pronunciation_focus_en: [
          "KA-lau u-koo-RAN-nya TEE-dak pas, BO-leh di-TOO-kar A-tau di-re-TOOR? — `ukuran` = size; `ditukar` = can be exchanged (passive `di-`); `diretur` = can be returned; `atau` = or.",
          "VN-speaker trap: dropping the `di-` passive. 'Can be exchanged' = `boleh ditukar` (di- + tukar).",
          "Tip: `tukar` = exchange (for another); `retur` = return goods (English loan 'return').",
          "Drill: `Boleh ditukar atau diretur?`",
        ],
      },
      {
        en: "Tolong dibungkus, ya. Terima kasih.",
        vi: "Làm ơn gói lại giúp nhé. Cảm ơn.",
        pronunciation_focus: [
          "TO-long di-bung-KUS, ya. te-RI-ma KA-sih — `tolong` + `dibungkus` = làm ơn gói lại (di- + bungkus); `ya` cuối câu làm mềm yêu cầu.",
          "Lợi thế người Việt: `tolong + [động từ di-]` là cách nhờ lịch sự cố định, dễ nhớ.",
          "Mẹo: `dibungkus` = gói lại; ở quán ăn 'mang về' là `dibungkus` hoặc `bungkus`, ăn tại chỗ là `makan di sini`.",
          "Luyện: `Tolong dibungkus, ya.`",
        ],
        pronunciation_focus_en: [
          "TO-long di-boong-KOOS, ya. te-REE-ma KA-sih — `tolong` + `dibungkus` = please wrap it up (di- + bungkus); a final `ya` softens the request.",
          "VN-speaker win: `tolong + [di- verb]` is a fixed polite request pattern, easy to remember.",
          "Tip: `dibungkus` = wrapped/packed; at an eatery, 'to go' is `dibungkus`/`bungkus`, 'dine in' is `makan di sini`.",
          "Drill: `Tolong dibungkus, ya.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia có HAI thế giới mua sắm với hai luật chơi khác nhau, và biết phân biệt là chìa khóa: \n\n1) `PASAR` (chợ truyền thống) và các quầy hàng rong, cửa hàng nhỏ — Ở ĐÂY MẶC CẢ LÀ BÌNH THƯỜNG và được mong đợi. Người Việt có lợi thế lớn vì văn hóa chợ rất giống: hỏi giá (`berapa harganya?`), tỏ vẻ ngạc nhiên (`wah, mahal!`), trả giá (`bisa kurang?`), dọa bỏ đi (`saya cari di toko lain saja`), rồi chốt. Giữ thái độ vui vẻ, cười, không gắt gỏng — mặc cả ở Indonesia là một trò chơi xã giao thân thiện, không phải tranh cãi. Mức trả thường bắt đầu khoảng 50-70% giá hỏi, rồi gặp nhau ở giữa.\n\n2) `MALL`, siêu thị, cửa hàng thương hiệu — Ở ĐÂY GIÁ CỐ ĐỊNH (`harga pas`/`harga mati`). ĐỪNG mặc cả, sẽ bị xem là kỳ. Chỉ hỏi về `diskon` (giảm giá), `promo`, hay `cicilan` (trả góp 0%). Trả bằng `kartu` (thẻ), `QRIS` (quét mã), hay tiền mặt.\n\nXƯNG HÔ: gọi người bán là `Bu`/`Ibu` (nữ lớn tuổi), `Pak`/`Bapak` (nam lớn tuổi), `Mbak` (chị trẻ, gốc Java), `Mas` (anh trẻ), `Kak`/`Kakak` (anh/chị, trung lập). Xưng hô đúng làm cuộc mua bán ấm áp hơn nhiều.\n\nTIỀN: đồng `rupiah` có nhiều số 0. Trong đời thường, đơn vị `ribu` (nghìn) thường bị nuốt — người bán nói '50' nghĩa là 50.000. Tiếng lóng chợ: `goceng` = 5.000, `ceban` = 10.000, `gocap` = 50.000. Người Việt vốn quen 'nghìn ngầm hiểu', nên thích nghi nhanh — nhưng khi chưa chắc, hãy nói đầy đủ `lima puluh ribu`.\n\nĐỔI/TRẢ: ở mall thường cho `tukar` (đổi cỡ/màu) trong vài ngày nếu giữ `struk`/`nota` (hóa đơn) và nhãn còn nguyên; `retur` (trả lại lấy tiền) hiếm hơn. Ở chợ thì thường KHÔNG đổi trả — kiểm hàng kỹ trước khi trả tiền.",
    cultural_notes_en:
      "Indonesia has TWO shopping worlds with two different rule sets, and telling them apart is the key:\n\n1) `PASAR` (traditional markets), street stalls, and small shops — HERE HAGGLING IS NORMAL and expected. Vietnamese speakers have a big edge because the chợ culture is so similar: ask the price (`berapa harganya?`), act surprised (`wah, mahal!`), counter (`bisa kurang?`), threaten to walk (`saya cari di toko lain saja`), then close. Stay cheerful and smiling, never irritable — haggling in Indonesia is a friendly social game, not an argument. You usually open around 50–70% of the asking price and meet in the middle.\n\n2) `MALL`, supermarkets, brand stores — HERE PRICES ARE FIXED (`harga pas`/`harga mati`). DON'T haggle; it reads as odd. Only ask about a `diskon`, `promo`, or `cicilan` (0% installments). Pay by `kartu` (card), `QRIS` (QR scan), or cash.\n\nADDRESS TERMS: call the seller `Bu`/`Ibu` (older woman), `Pak`/`Bapak` (older man), `Mbak` (younger woman, Javanese), `Mas` (younger man), or the neutral `Kak`/`Kakak`. Correct address makes the exchange much warmer.\n\nMONEY: the `rupiah` has many zeros. In everyday speech the unit `ribu` (thousand) is often swallowed — a seller saying '50' means 50,000. Market slang: `goceng` = 5,000, `ceban` = 10,000, `gocap` = 50,000. Vietnamese speakers are used to 'implied thousands', so they adapt fast — but when unsure, say the full `lima puluh ribu`.\n\nRETURNS: malls usually allow a `tukar` (size/color exchange) within a few days if you keep the `struk`/`nota` (receipt) and tags; a cash `retur` (refund) is rarer. Markets generally have NO returns — inspect goods carefully before you pay.",
    tip_advice_vi:
      "Học 'bộ khung mặc cả' năm bước ở chợ: (1) hỏi giá — `Ini berapa harganya?`; (2) phản ứng — `Wah, mahal sekali. Bisa kurang?`; (3) trả giá — `[số] ribu saja, ya?`; (4) bỏ đi (nếu cần) — `Kalau begitu, saya cari di toko lain saja.`; (5) chốt — `Oke, saya beli yang ini.`. Ở mall đổi sang khung lịch sự: `Apakah ada diskon/promo?` + `Bisa bayar dengan kartu?` + `Boleh ditukar atau diretur?`.\n\nNhớ các cặp phụ tố hay nhầm: `menawar` (động từ, trả giá) ≠ `tawaran` (danh từ, lời chào giá) ≠ `ditawar` (bị động, được trả giá); `membeli`/`beli` (mua) vs `menjual`/`jual` (bán); thể bị động `di-` cho dịch vụ: `dibungkus` (gói lại), `ditukar` (đổi), `diretur` (trả lại). Phân biệt `bisa` (có thể/khả năng) và `boleh` (được phép). Số tiền PHẢI có `ribu`/`juta`: `lima puluh ribu` (50.000), `dua juta` (2.000.000). Đặt `sekali` SAU tính từ: `murah sekali` (rẻ lắm). Giữ giọng phẳng, không thanh điệu; `c` đọc 'ch', `j` đọc 'j' (như 'jam').",
    tip_advice_en:
      "Learn the five-step market haggle frame: (1) ask the price — `Ini berapa harganya?`; (2) react — `Wah, mahal sekali. Bisa kurang?`; (3) counter — `[number] ribu saja, ya?`; (4) walk away (if needed) — `Kalau begitu, saya cari di toko lain saja.`; (5) close — `Oke, saya beli yang ini.`. In a mall, switch to the polite frame: `Apakah ada diskon/promo?` + `Bisa bayar dengan kartu?` + `Boleh ditukar atau diretur?`.\n\nKeep these affix sets straight: `menawar` (verb, to haggle) ≠ `tawaran` (noun, an offer) ≠ `ditawar` (passive, to be bargained over); `membeli`/`beli` (to buy) vs `menjual`/`jual` (to sell); the `di-` passive for services: `dibungkus` (wrapped), `ditukar` (exchanged), `diretur` (returned). Distinguish `bisa` (be able to) from `boleh` (be allowed to). Amounts MUST carry `ribu`/`juta`: `lima puluh ribu` (50,000), `dua juta` (2,000,000). Put `sekali` AFTER the adjective: `murah sekali` (very cheap). Keep your pitch flat (no tones); `c` is 'ch', `j` is the English 'j' as in 'jam'.",
    vocabulary: [
      // Places
      {
        word: "pasar",
        en: "market (traditional)",
        vi: "chợ",
        pos: "noun",
        pronunciation_vi: "PA-sar — nơi mặc cả; `pasar tradisional` vs `pasar swalayan` (siêu thị)",
        pronunciation_en: "PA-sar — where you haggle; `pasar tradisional` vs `pasar swalayan` (supermarket)",
      },
      {
        word: "toko",
        en: "shop / store",
        vi: "cửa hàng",
        pos: "noun",
        pronunciation_vi: "TO-ko — `toko kelontong` = tạp hóa; `toko online` = cửa hàng online",
        pronunciation_en: "TO-ko — `toko kelontong` = corner shop; `toko online` = online store",
      },
      {
        word: "mall / pusat perbelanjaan",
        en: "mall / shopping center",
        vi: "trung tâm thương mại",
        pos: "noun",
        pronunciation_vi: "mol / PU-sat per-be-lan-JA-an — ở đây `harga pas`, đừng mặc cả",
        pronunciation_en: "mol / POO-sat per-be-lan-JA-an — fixed price here, don't haggle",
      },
      // Money & price
      {
        word: "harga",
        en: "price",
        vi: "giá",
        pos: "noun",
        pronunciation_vi: "HAR-ga — `harganya` = giá của nó; `harga pas` = giá cố định",
        pronunciation_en: "HAR-ga — `harganya` = its price; `harga pas` = fixed price",
      },
      {
        word: "mahal",
        en: "expensive",
        vi: "đắt",
        pos: "adjective",
        pronunciation_vi: "MA-hal — `mahal sekali` = đắt lắm (sekali ĐỨNG SAU)",
        pronunciation_en: "MA-hal — `mahal sekali` = very expensive (sekali AFTER)",
      },
      {
        word: "murah",
        en: "cheap",
        vi: "rẻ",
        pos: "adjective",
        pronunciation_vi: "MU-rah — `murah meriah` = rẻ mà tốt/vui (thành ngữ)",
        pronunciation_en: "MOO-rah — `murah meriah` = cheap and cheerful (set phrase)",
      },
      {
        word: "ribu",
        en: "thousand",
        vi: "nghìn",
        pos: "number",
        pronunciation_vi: "RI-bu — `lima ribu` = 5.000; lóng: `goceng` = 5k, `ceban` = 10k",
        pronunciation_en: "REE-boo — `lima ribu` = 5,000; slang: `goceng` = 5k, `ceban` = 10k",
      },
      {
        word: "diskon",
        en: "discount",
        vi: "giảm giá",
        pos: "noun",
        pronunciation_vi: "dis-KON — `diskon 50 persen`; cũng `promo`, `obral` (xả hàng)",
        pronunciation_en: "dis-KON — `diskon 50 persen`; also `promo`, `obral` (clearance sale)",
      },
      // Haggling verbs
      {
        word: "menawar",
        en: "to bargain / haggle",
        vi: "trả giá / mặc cả",
        pos: "verb",
        pronunciation_vi: "me-NA-war — động từ (meN- + `tawar`); `nawar` ở văn nói đời thường",
        pronunciation_en: "me-NA-war — the verb (meN- + `tawar`); `nawar` in casual speech",
      },
      {
        word: "tawaran",
        en: "offer / bid",
        vi: "lời chào giá / mức đề nghị",
        pos: "noun",
        pronunciation_vi: "ta-WA-ran — danh từ (-an); đừng dùng thay động từ `menawar`",
        pronunciation_en: "ta-WA-ran — the noun (-an); don't use it for the verb `menawar`",
      },
      {
        word: "kurang",
        en: "less / to reduce (price)",
        vi: "bớt / ít hơn",
        pos: "verb/adjective",
        pronunciation_vi: "KU-rang — `bisa kurang?` = bớt được không (câu mặc cả chính)",
        pronunciation_en: "KOO-rang — `bisa kurang?` = can it be less? (the core haggle line)",
      },
      // Paying & after-sale
      {
        word: "bayar",
        en: "to pay",
        vi: "trả tiền / thanh toán",
        pos: "verb",
        pronunciation_vi: "BA-yar — `bayar tunai` = trả tiền mặt; `bayar pakai kartu` = trả thẻ",
        pronunciation_en: "BA-yar — `bayar tunai` = pay cash; `bayar pakai kartu` = pay by card",
      },
      {
        word: "kembalian",
        en: "change (money back)",
        vi: "tiền thối lại",
        pos: "noun",
        pronunciation_vi: "kem-ba-LI-an — ke-…-an từ `kembali`; `kembaliannya berapa?` = thối bao nhiêu",
        pronunciation_en: "kem-ba-LEE-an — ke-…-an from `kembali`; `kembaliannya berapa?` = how much change",
      },
      {
        word: "cicilan",
        en: "installments",
        vi: "trả góp",
        pos: "noun",
        pronunciation_vi: "chi-CHIL-an — từ `cicil`; `cicilan 0 persen` = trả góp lãi 0%",
        pronunciation_en: "chi-CHIL-an — from `cicil`; `cicilan 0 persen` = 0% installments",
      },
      {
        word: "struk / nota",
        en: "receipt",
        vi: "hóa đơn / biên lai",
        pos: "noun",
        pronunciation_vi: "struk / NO-ta — giữ lại để `tukar`/`retur`",
        pronunciation_en: "strook / NO-ta — keep it for a `tukar`/`retur`",
      },
      {
        word: "retur / tukar",
        en: "return / exchange",
        vi: "trả lại / đổi hàng",
        pos: "verb",
        pronunciation_vi: "re-TUR / TU-kar — `diretur` (trả lấy tiền) vs `ditukar` (đổi cái khác)",
        pronunciation_en: "re-TOOR / TOO-kar — `diretur` (refund) vs `ditukar` (swap for another)",
      },
    ],
    dialogue: [
      // Dialogue A: haggling at the pasar
      {
        speaker: "Pembeli",
        text: "Permisi, Bu. Baju ini berapa harganya?",
        vi: "Xin lỗi cô. Cái áo này giá bao nhiêu ạ?",
        en: "Excuse me, ma'am. How much is this shirt?",
      },
      {
        speaker: "Penjual",
        text: "Yang itu seratus lima puluh ribu, Mbak. Bahannya bagus.",
        vi: "Cái đó một trăm năm mươi nghìn cô ơi. Vải tốt lắm.",
        en: "That one is a hundred fifty thousand, miss. The fabric is good.",
      },
      {
        speaker: "Pembeli",
        text: "Wah, mahal sekali. Bisa kurang, Bu? Seratus ribu, ya?",
        vi: "Ồ, đắt quá. Bớt được không cô? Một trăm nghìn nhé?",
        en: "Wow, that's very expensive. Can it be less, ma'am? A hundred thousand, okay?",
      },
      {
        speaker: "Penjual",
        text: "Aduh, belum dapat, Mbak. Seratus tiga puluh, deh. Sudah murah itu.",
        vi: "Ôi, chưa được đâu cô. Một trăm ba mươi vậy. Rẻ lắm rồi đó.",
        en: "Oh, that won't cover it, miss. A hundred thirty then. That's already cheap.",
      },
      {
        speaker: "Pembeli",
        text: "Seratus sepuluh, ya? Saya ambil dua kalau boleh segitu.",
        vi: "Một trăm mười nhé? Tôi lấy hai cái nếu được giá đó.",
        en: "A hundred ten, okay? I'll take two if you can do that.",
      },
      {
        speaker: "Penjual",
        text: "Ya sudah, buat Mbak. Dua baju dua ratus dua puluh ribu. Tolong dibungkus, ya?",
        vi: "Thôi được, vì cô đó. Hai cái áo hai trăm hai mươi nghìn. Gói lại giúp nhé?",
        en: "All right, for you, miss. Two shirts, two hundred twenty thousand. Shall I wrap them up?",
      },
      // Dialogue B: fixed-price mall counter
      {
        speaker: "Pembeli",
        text: "Mas, apakah ada diskon untuk sepatu ini?",
        vi: "Anh ơi, có giảm giá cho đôi giày này không?",
        en: "Sir, is there a discount on these shoes?",
      },
      {
        speaker: "Pramuniaga",
        text: "Ada promo, Kak. Diskon dua puluh persen kalau bayar pakai kartu tertentu.",
        vi: "Có khuyến mãi đó anh/chị. Giảm hai mươi phần trăm nếu trả bằng một số thẻ nhất định.",
        en: "There's a promo. Twenty percent off if you pay with certain cards.",
      },
      {
        speaker: "Pembeli",
        text: "Oke. Ada cicilan tidak? Dan kalau ukurannya tidak pas, boleh ditukar?",
        vi: "Được. Có trả góp không? Và nếu cỡ không vừa thì đổi được chứ?",
        en: "Okay. Are there installments? And if the size doesn't fit, can I exchange it?",
      },
      {
        speaker: "Pramuniaga",
        text: "Bisa cicilan tiga bulan. Tukar bisa dalam tujuh hari asal struk dan labelnya masih ada.",
        vi: "Trả góp ba tháng được. Đổi được trong bảy ngày miễn còn hóa đơn và nhãn.",
        en: "Three-month installments are fine. Exchange within seven days as long as you keep the receipt and tags.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Xin lỗi, cái này giá bao nhiêu?", answer: "Permisi, ini berapa harganya?" },
          { prompt: "Ồ, đắt quá. Bớt được không?", answer: "Wah, mahal sekali. Bisa kurang?" },
          { prompt: "Năm mươi nghìn thôi nhé?", answer: "Lima puluh ribu saja, ya?" },
          { prompt: "Nếu vậy thì tôi tìm cửa hàng khác vậy.", answer: "Kalau begitu, saya cari di toko lain saja." },
          { prompt: "Được, tôi mua cái này.", answer: "Oke, saya beli yang ini." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Mua ở mall (giá cố định) — dịch sang tiếng Indonesia:",
        instruction_en: "Mall shopping (fixed price) — translate into Indonesian:",
        items: [
          { prompt: "Có giảm giá cho món này không?", answer: "Apakah ada diskon untuk barang ini?" },
          { prompt: "Trả bằng thẻ được không?", answer: "Bisa bayar dengan kartu?" },
          { prompt: "Có trả góp không?", answer: "Ada cicilan tidak?" },
          { prompt: "Nếu cỡ không vừa, đổi hoặc trả lại được không?", answer: "Kalau ukurannya tidak pas, boleh ditukar atau diretur?" },
          { prompt: "Làm ơn gói lại giúp nhé.", answer: "Tolong dibungkus, ya." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn `menawar`, `tawaran`, `ditawar`, `beli`, hay `jual` cho đúng (động từ vs danh từ vs bị động):",
        instruction_en:
          "Choose `menawar`, `tawaran`, `ditawar`, `beli`, or `jual` correctly (verb vs noun vs passive):",
        items: [
          { prompt: "Saya mau ___ harga baju ini.", answer: "menawar", hint: "động từ 'trả giá' (meN-)" },
          { prompt: "___ saya seratus ribu, Bu.", answer: "Tawaran", hint: "danh từ 'mức đề nghị' (-an)" },
          { prompt: "Harga di pasar masih bisa ___.", answer: "ditawar", hint: "bị động 'được trả giá' (di-)" },
          { prompt: "Saya mau ___ yang ini.", answer: "beli", hint: "động từ 'mua' (người mua)" },
          { prompt: "Toko itu ___ sayur dan buah.", answer: "jual", hint: "động từ 'bán' (người bán)" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung mặc cả ở chợ — điền chỗ trống: `Ini berapa ___? Wah, ___ sekali. Bisa ___? ___ ribu saja, ya?`",
        instruction_en:
          "Market-haggle frame — fill the blanks: `Ini berapa ___? Wah, ___ sekali. Bisa ___? ___ ribu saja, ya?`",
        example:
          "Ini berapa harganya? Wah, mahal sekali. Bisa kurang? Lima puluh ribu saja, ya?",
        example_vi:
          "Cái này giá bao nhiêu? Ồ, đắt quá. Bớt được không? Năm mươi nghìn thôi nhé?",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra mua sắm & mặc cả — bạn làm được chưa?",
        instruction_en: "Shopping & bargaining self-check — can you do each one?",
        items: [
          { vi: "Tôi biết khi nào ĐƯỢC mặc cả (chợ) và khi nào KHÔNG (mall).", en: "I know when haggling is okay (market) and when it isn't (mall)." },
          { vi: "Tôi có thể hỏi giá và trả giá: `berapa harganya?` / `bisa kurang?`.", en: "I can ask and counter a price: `berapa harganya?` / `bisa kurang?`." },
          { vi: "Tôi nói số tiền đầy đủ với `ribu`/`juta`, không bỏ đơn vị.", en: "I state amounts fully with `ribu`/`juta`, never dropping the unit." },
          { vi: "Tôi đặt `sekali` sau tính từ: `mahal sekali`, không `sekali mahal`.", en: "I place `sekali` after the adjective: `mahal sekali`, not `sekali mahal`." },
          { vi: "Tôi phân biệt `menawar` (động từ), `tawaran` (danh từ), `ditawar` (bị động).", en: "I can tell `menawar` (verb), `tawaran` (noun), `ditawar` (passive) apart." },
          { vi: "Tôi dùng thể bị động `di-` cho dịch vụ: `dibungkus`, `ditukar`, `diretur`.", en: "I use the `di-` passive for services: `dibungkus`, `ditukar`, `diretur`." },
          { vi: "Tôi gọi người bán đúng: `Bu`/`Pak`/`Mbak`/`Mas`/`Kak`.", en: "I address the seller correctly: `Bu`/`Pak`/`Mbak`/`Mas`/`Kak`." },
        ],
      },
    ],
  },
];

export default lessons;
