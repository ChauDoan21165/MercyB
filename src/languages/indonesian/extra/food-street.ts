// Street Food & Warung Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling Indonesian `extra/*` files (e.g. immigration-government.ts,
// banking-money.ts), which in turn mirror the French `FrenchLesson` shape. When the
// shared Indonesian registry (src/languages/indonesian/lessons.ts) lands, swap the
// local types for a shared import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// Street-food Indonesian is warm and informal — the register at a `warung` or a
// `kaki lima` cart leans casual (`mas`/`mbak`, `bang`, `bu`), drops `meN-` in
// speech (`mau pesan`, `tambah`), and runs on a handful of golden frames: `Mau
// pesan ___`, `Pakai ___`, `Jangan pakai ___`, `Berapa semuanya?`, `Bungkus`. For
// Vietnamese speakers the WIN is no conjugation/gender/tone and food culture that
// rhymes with Vietnam's; the trap is the spice question (`pedas/tidak pedas`),
// the `-in` colloquial suffix (`bungkusin`, `pedasin`), and the `ribu` price scale.

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
    id: "indonesian_food_street",
    level: "A2",
    category: "food",
    title_vi: "Tiếng Indonesia cho quán ăn vỉa hè và warung",
    title_en: "Street food and warung Indonesian",
    sentences: [
      // ── Getting the seller's attention & ordering ──────────────────────
      {
        en: "Mas, mau pesan bakso satu, ya.",
        vi: "Anh ơi, cho tôi đặt một tô bakso (canh thịt viên) nhé.",
        pronunciation_focus: [
          "mas, mau PE-san BAK-so SA-tu — `mas` = gọi anh trẻ (nam); `mau pesan` = muốn gọi món; `bakso` = canh thịt viên.",
          "Lỗi người Việt: gọi `anh` bằng `kakak`. Ở quán vỉa hè dùng `mas` (nam) / `mbak` (nữ).",
          "Luyện: `Mas, mau pesan bakso satu, ya.`",
        ],
        pronunciation_focus_en: [
          "mas, mau PE-san BAK-so SA-tu — `mas` = young man (address); `mau pesan` = want to order; `bakso` = meatball soup.",
          "VN-speaker trap: using `kakak` for the server. At a cart use `mas` (man) / `mbak` (woman).",
          "Drill: `Mas, mau pesan bakso satu, ya.`",
        ],
      },
      {
        en: "Saya mau sate ayam sepuluh tusuk.",
        vi: "Tôi muốn mười xiên sa-tế gà.",
        pronunciation_focus: [
          "SA-ya mau SA-te A-yam se-PU-luh TU-suk — `sate ayam` = thịt gà xiên nướng; `tusuk` = cái xiên (đơn vị đếm sate).",
          "Lỗi người Việt: quên lượng từ. Sate đếm bằng `tusuk`: `sepuluh tusuk` = mười xiên.",
          "Luyện: `Saya mau sate ayam sepuluh tusuk.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau SA-te A-yam se-PU-luh TU-suk — `sate ayam` = grilled chicken skewers; `tusuk` = skewer (the counter for sate).",
          "VN-speaker trap: dropping the counter. Sate is counted in `tusuk`: `sepuluh tusuk` = ten skewers.",
          "Drill: `Saya mau sate ayam sepuluh tusuk.`",
        ],
      },
      {
        en: "Nasi gorengnya satu porsi, jangan pakai sayur.",
        vi: "Cho một phần cơm chiên, đừng cho rau.",
        pronunciation_focus: [
          "NA-si GO-reng-nya SA-tu POR-si, JA-ngan PA-kai SA-yur — `porsi` = phần; `jangan pakai` = đừng cho/đừng bỏ.",
          "Lỗi người Việt: nói `tidak sayur`. Để bỏ thành phần dùng `jangan pakai ___` (đừng cho ___).",
          "Luyện: `Nasi gorengnya satu porsi, jangan pakai sayur.`",
        ],
        pronunciation_focus_en: [
          "NA-si GO-reng-nya SA-tu POR-si, JA-ngan PA-kai SA-yur — `porsi` = portion; `jangan pakai` = don't add.",
          "VN-speaker trap: `tidak sayur`. To leave something out, use `jangan pakai ___` (don't add ___).",
          "Drill: `Nasi gorengnya satu porsi, jangan pakai sayur.`",
        ],
      },
      // ── The spice question (the heart of Indonesian ordering) ──────────
      {
        en: "Tolong jangan terlalu pedas, ya.",
        vi: "Làm ơn đừng cay quá nhé.",
        pronunciation_focus: [
          "TO-long JA-ngan ter-LA-lu pe-DAS — `pedas` = cay; `terlalu` = quá; `jangan terlalu pedas` = đừng cay quá.",
          "Lỗi người Việt: nói `tidak cay`. Tiếng Indonesia: `pedas` (cay); 'không cay' = `tidak pedas`, 'ít cay' = `sedikit pedas`.",
          "Luyện: `Tolong jangan terlalu pedas, ya.`",
        ],
        pronunciation_focus_en: [
          "TO-long JA-ngan ter-LA-lu pe-DAS — `pedas` = spicy; `terlalu` = too; `jangan terlalu pedas` = not too spicy.",
          "VN-speaker trap: `tidak cay`. In Indonesian: `pedas` (spicy); 'not spicy' = `tidak pedas`, 'a little spicy' = `sedikit pedas`.",
          "Drill: `Tolong jangan terlalu pedas, ya.`",
        ],
      },
      {
        en: "Pakai sambal sedikit saja.",
        vi: "Cho tương ớt một chút thôi.",
        pronunciation_focus: [
          "PA-kai SAM-bal se-DI-kit SA-ja — `sambal` = tương ớt; `sedikit` = một chút; `saja` = thôi.",
          "Lỗi người Việt: nghĩ `sambal` là 'tương' chung chung. `sambal` là tương ỚT cay; `kecap manis` mới là xì dầu ngọt.",
          "Luyện: `Pakai sambal sedikit saja.`",
        ],
        pronunciation_focus_en: [
          "PA-kai SAM-bal se-DI-kit SA-ja — `sambal` = chili paste; `sedikit` = a little; `saja` = only.",
          "VN-speaker trap: thinking `sambal` is generic sauce. `sambal` is the spicy CHILI paste; `kecap manis` is the sweet soy sauce.",
          "Drill: `Pakai sambal sedikit saja.`",
        ],
      },
      // ── Drinks ─────────────────────────────────────────────────────────
      {
        en: "Minumnya es teh manis satu.",
        vi: "Đồ uống cho một ly trà đá ngọt.",
        pronunciation_focus: [
          "MI-num-nya es teh MA-nis SA-tu — `es teh manis` = trà đá ngọt; `es` = đá; `manis` = ngọt.",
          "Lỗi người Việt: quên `manis`/`tawar`. `es teh manis` (ngọt) khác `es teh tawar` (không đường).",
          "Luyện: `Minumnya es teh manis satu.`",
        ],
        pronunciation_focus_en: [
          "MI-num-nya es teh MA-nis SA-tu — `es teh manis` = sweet iced tea; `es` = ice; `manis` = sweet.",
          "VN-speaker trap: omitting `manis`/`tawar`. `es teh manis` (sweet) differs from `es teh tawar` (unsweetened).",
          "Drill: `Minumnya es teh manis satu.`",
        ],
      },
      {
        en: "Es jeruknya jangan terlalu manis.",
        vi: "Nước cam đá đừng ngọt quá.",
        pronunciation_focus: [
          "es je-RUK-nya JA-ngan ter-LA-lu MA-nis — `es jeruk` = nước cam đá; cùng khung `jangan terlalu ___`.",
          "Lỗi người Việt: đọc `jeruk` thành 'giê-rúc'. `j` Indonesia kêu như 'gi' giọng Nam: `je-RUK`.",
          "Luyện: `Es jeruknya jangan terlalu manis.`",
        ],
        pronunciation_focus_en: [
          "es je-RUK-nya JA-ngan ter-LA-lu MA-nis — `es jeruk` = iced orange juice; same `jangan terlalu ___` frame.",
          "VN-speaker trap: hardening `j`. Indonesian `j` is a voiced 'j' as in 'jam': `je-ROOK`.",
          "Drill: `Es jeruknya jangan terlalu manis.`",
        ],
      },
      // ── Gorengan & snacks ──────────────────────────────────────────────
      {
        en: "Gorengannya yang ini berapa satu?",
        vi: "Món chiên này bao nhiêu một cái?",
        pronunciation_focus: [
          "go-RE-ngan-nya yang I-ni be-RA-pa SA-tu — `gorengan` = đồ chiên (gốc `goreng` + `-an`); `berapa satu` = bao nhiêu một cái.",
          "Lỗi người Việt: hỏi `berapa harga` cứng. Ở xe đẩy hỏi gọn `berapa satu?` (bao nhiêu một cái) là tự nhiên hơn.",
          "Luyện: `Gorengannya yang ini berapa satu?`",
        ],
        pronunciation_focus_en: [
          "go-RE-ngan-nya yang I-ni be-RA-pa SA-tu — `gorengan` = fried snacks (root `goreng` + `-an`); `berapa satu` = how much for one.",
          "VN-speaker trap: the stiff `berapa harga`. At a cart, the snappy `berapa satu?` is more natural.",
          "Drill: `Gorengannya yang ini berapa satu?`",
        ],
      },
      {
        en: "Saya ambil tahu isi tiga, ya.",
        vi: "Tôi lấy ba cái đậu hũ nhồi nhé.",
        pronunciation_focus: [
          "SA-ya AM-bil TA-hu I-si TI-ga — `ambil` = lấy; `tahu isi` = đậu hũ nhồi rau; `tiga` = ba.",
          "Lỗi người Việt: `tahu` đọc lẫn với `tahu` ('biết'). Cùng chữ, ngữ cảnh quyết định — ở đây là đậu phụ.",
          "Luyện: `Saya ambil tahu isi tiga, ya.`",
        ],
        pronunciation_focus_en: [
          "SA-ya AM-bil TA-hu I-si TI-ga — `ambil` = take; `tahu isi` = stuffed tofu; `tiga` = three.",
          "VN-speaker trap: `tahu` (tofu) is spelled like `tahu` (to know). Same word, context decides — here it's tofu.",
          "Drill: `Saya ambil tahu isi tiga, ya.`",
        ],
      },
      // ── Haggling (light, at markets/carts) ─────────────────────────────
      {
        en: "Bang, boleh kurang sedikit nggak?",
        vi: "Anh ơi, bớt một chút được không?",
        pronunciation_focus: [
          "bang, BO-leh KU-rang se-DI-kit ng-GAK — `bang` (từ `abang`) = gọi anh; `boleh kurang?` = bớt được không; `nggak` = không (khẩu ngữ).",
          "Lỗi người Việt: trả giá ở quán giá cố định. Mặc cả chỉ hợp ở `pasar`/xe đẩy, không ở warung niêm yết giá.",
          "Luyện: `Bang, boleh kurang sedikit nggak?`",
        ],
        pronunciation_focus_en: [
          "bang, BO-leh KU-rang se-DI-kit ng-GAK — `bang` (from `abang`) = bro/sir; `boleh kurang?` = can you lower it; `nggak` = no (colloquial).",
          "VN-speaker trap: haggling where prices are fixed. Bargain only at a `pasar`/cart, not a priced warung.",
          "Drill: `Bang, boleh kurang sedikit nggak?`",
        ],
      },
      {
        en: "Kalau beli banyak, dapat harga teman, dong.",
        vi: "Mua nhiều thì cho giá hữu nghị đi mà.",
        pronunciation_focus: [
          "ka-LAU be-LI BA-nyak, DA-pat HAR-ga te-MAN, dong — `harga teman` = giá 'bạn bè' (giá mềm); `dong` = nài nỉ thân mật.",
          "Lỗi người Việt: bỏ tiểu từ. `dong` làm câu mềm, dễ thương — rất đặc trưng khi mặc cả vui.",
          "Luyện: `Kalau beli banyak, dapat harga teman, dong.`",
        ],
        pronunciation_focus_en: [
          "ka-LAU be-LI BA-nyak, DA-pat HAR-ga te-MAN, dong — `harga teman` = 'friend price' (a soft deal); `dong` = a coaxing softener.",
          "VN-speaker trap: dropping particles. `dong` makes the line playful and warm — very natural when bargaining.",
          "Drill: `Kalau beli banyak, dapat harga teman, dong.`",
        ],
      },
      // ── Paying & takeaway ──────────────────────────────────────────────
      {
        en: "Berapa semuanya, Mbak?",
        vi: "Tất cả bao nhiêu vậy chị?",
        pronunciation_focus: [
          "be-RA-pa se-MU-a-nya, mbak — `berapa semuanya?` = tất cả bao nhiêu; `mbak` = gọi chị trẻ (nữ).",
          "Lỗi người Việt: phát âm `mbak` bỏ 'm'. Bật nhẹ 'm' rồi 'bak': `mbak` — âm 'mb' đầu từ rất Indonesia.",
          "Luyện: `Berapa semuanya, Mbak?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa se-MU-a-nya, mbak — `berapa semuanya?` = how much is it all; `mbak` = young woman (address).",
          "VN-speaker trap: dropping the 'm' in `mbak`. Hum a light 'm' then 'bak': `mbak` — word-initial 'mb' is very Indonesian.",
          "Drill: `Berapa semuanya, Mbak?`",
        ],
      },
      {
        en: "Bungkus saja, ya, buat dibawa pulang.",
        vi: "Gói mang về thôi nhé.",
        pronunciation_focus: [
          "BUNG-kus SA-ja, ya, BU-at di-BA-wa PU-lang — `bungkus` = gói lại; `dibawa pulang` (bị động `di-`) = (để) mang về.",
          "Lỗi người Việt: nói `take away` tiếng Anh. Một từ duy nhất `bungkus` = gói mang đi; ăn tại chỗ = `makan di sini`.",
          "Luyện: `Bungkus saja, ya.`",
        ],
        pronunciation_focus_en: [
          "BUNG-kus SA-ja, ya, BU-at di-BA-wa PU-lang — `bungkus` = wrap it up; `dibawa pulang` (passive `di-`) = to be taken home.",
          "VN-speaker trap: saying English 'take away'. The single word `bungkus` = to go; eat-in = `makan di sini`.",
          "Drill: `Bungkus saja, ya.`",
        ],
      },
      {
        en: "Bayarnya pakai QRIS bisa, Mas?",
        vi: "Trả bằng QRIS được không anh?",
        pronunciation_focus: [
          "BA-yar-nya PA-kai KU-ris BI-sa, mas — `bayar pakai QRIS` = trả bằng mã QR; `QRIS` đọc 'ku-ris'.",
          "Lỗi người Việt: tưởng xe đẩy chỉ nhận tiền mặt. Nhiều `kaki lima` nay dán `QRIS`; vẫn nên thủ sẵn `uang tunai`.",
          "Luyện: `Bayarnya pakai QRIS bisa, Mas?`",
        ],
        pronunciation_focus_en: [
          "BA-yar-nya PA-kai KU-ris BI-sa, mas — `bayar pakai QRIS` = pay by QR code; `QRIS` is said 'KOO-ris'.",
          "VN-speaker trap: assuming carts are cash-only. Many `kaki lima` now post a `QRIS`; still keep `uang tunai` handy.",
          "Drill: `Bayarnya pakai QRIS bisa, Mas?`",
        ],
      },
      {
        en: "Enak banget, makasih ya, Mbak!",
        vi: "Ngon cực kỳ, cảm ơn chị nhé!",
        pronunciation_focus: [
          "e-NAK BA-nget, ma-KA-sih ya, mbak — `enak` = ngon; `banget` = cực kỳ (khẩu ngữ); `makasih` = cảm ơn (rút gọn).",
          "Lỗi người Việt: chỉ nói `terima kasih` trang trọng. Ở vỉa hè `makasih` + `banget` nghe thân thiện, đúng tông.",
          "Luyện: `Enak banget, makasih ya, Mbak!`",
        ],
        pronunciation_focus_en: [
          "e-NAK BA-nget, ma-KA-sih ya, mbak — `enak` = tasty; `banget` = really (colloquial); `makasih` = thanks (shortened).",
          "VN-speaker trap: only the formal `terima kasih`. On the street, `makasih` + `banget` sounds friendly and on-tone.",
          "Drill: `Enak banget, makasih ya, Mbak!`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ăn vỉa hè là linh hồn ẩm thực Indonesia. `Warung` là quán nhỏ cố định (warung makan, warteg = warung Tegal bán cơm bình dân); `kaki lima` (nghĩa đen 'năm chân') là xe đẩy/gánh hàng rong; `angkringan` là quầy tối ở Yogya/Solo. Món tiêu biểu: `bakso` (canh thịt viên), `sate` (xiên nướng chấm sốt đậu phộng), `nasi goreng`, `mie ayam`, `gado-gado`, `gorengan` (đồ chiên: tahu, tempe, bakwan, pisang goreng). Đồ uống mặc định là `es teh manis`. Cách gọi người bán: `mas` (anh trẻ), `mbak` (chị trẻ), `bang/abang` (anh), `bu/ibu` (cô lớn tuổi), `pak/bapak` (chú). Câu hỏi sống còn là độ cay: `pedas` hay `tidak pedas`; `sambal` là tương ớt cay, `kecap manis` là xì dầu ngọt — đừng nhầm. Giá tính bằng `ribu` (nghìn). Mặc cả chỉ hợp ở `pasar`/xe đẩy, không ở warung niêm yết. Nhiều quầy nay nhận `QRIS`, nhưng luôn thủ sẵn tiền mặt lẻ. Người Hồi giáo ăn `halal` — nhiều quán treo biển `halal`, và tránh chào mời đồ có `babi` (thịt heo) ở quán chung.",
    cultural_notes_en:
      "Street food is the soul of Indonesian eating. A `warung` is a small fixed stall (warung makan; warteg = a cheap Tegal-style rice eatery); `kaki lima` (literally 'five legs') are pushcart/roving vendors; `angkringan` are night stalls in Yogya/Solo. Staples: `bakso` (meatball soup), `sate` (skewers with peanut sauce), `nasi goreng`, `mie ayam`, `gado-gado`, and `gorengan` (fritters: tahu, tempe, bakwan, fried banana). The default drink is `es teh manis`. Address vendors as `mas` (young man), `mbak` (young woman), `bang/abang` (bro), `bu/ibu` (ma'am), `pak/bapak` (sir). The make-or-break question is spice: `pedas` or `tidak pedas`; `sambal` is the spicy chili paste, `kecap manis` is sweet soy sauce — don't mix them up. Prices are in `ribu` (thousands). Bargaining suits a `pasar`/cart, not a priced warung. Many stalls now take `QRIS`, but keep small cash. Muslims eat `halal` — many stalls post a `halal` sign; avoid pushing `babi` (pork) dishes at shared eateries.",
    tip_advice_vi:
      "Sáu khung vàng để gọi món vỉa hè: (1) gọi người bán + đặt món — `Mas/Mbak, mau pesan ___`; (2) chọn thành phần — `Pakai ___` / `Jangan pakai ___`; (3) độ cay — `Jangan terlalu pedas` / `Tidak pedas` / `Pedasnya sedikit`; (4) đồ uống — `Minumnya ___ satu` (nhớ `manis`/`tawar`); (5) trả tiền — `Berapa semuanya?` / `Bayar pakai QRIS bisa?`; (6) mang về — `Bungkus` (gói đi) vs `makan di sini` (ăn tại chỗ). Khẩu ngữ vỉa hè cho phép BỎ `meN-` (`mau pesan`, `mau tambah`) và thêm hậu tố thân mật `-in` (`bungkusin` = gói giúp, `pedasin` = làm cay lên). Đếm món có lượng từ: sate đếm `tusuk`, cơm/phần đếm `porsi`. Luôn nói số tiền có bậc `ribu`.",
    tip_advice_en:
      "Six golden frames for ordering street food: (1) hail the vendor + order — `Mas/Mbak, mau pesan ___`; (2) pick ingredients — `Pakai ___` / `Jangan pakai ___`; (3) spice — `Jangan terlalu pedas` / `Tidak pedas` / `Pedasnya sedikit`; (4) drinks — `Minumnya ___ satu` (say `manis`/`tawar`); (5) pay — `Berapa semuanya?` / `Bayar pakai QRIS bisa?`; (6) takeaway — `Bungkus` (to go) vs `makan di sini` (eat in). Street speech DROPS `meN-` (`mau pesan`, `mau tambah`) and adds the friendly `-in` suffix (`bungkusin` = wrap it for me, `pedasin` = make it spicier). Use counters: sate is counted in `tusuk`, rice/meals in `porsi`. Always say amounts with the `ribu` scale.",
    vocabulary: [
      {
        cell_id: "9e0ccdc3-0eae-41a7-a702-1013574cb0a9",
        word: "warung",
        en: "small food stall / eatery",
        vi: "quán ăn nhỏ",
        pos: "noun",
        pronunciation_vi: "WA-rung — `warung makan`; `warteg` = quán cơm bình dân",
        pronunciation_en: "WAH-roong — `warung makan`; `warteg` = cheap rice eatery",
      },
      {
        cell_id: "211bc230-3aa4-4b4e-90b9-999881a73f5f",
        word: "kaki lima",
        en: "street vendor / pushcart",
        vi: "hàng rong, xe đẩy vỉa hè",
        pos: "noun phrase",
        pronunciation_vi: "KA-ki LI-ma — nghĩa đen 'năm chân'",
        pronunciation_en: "KAH-kee LEE-mah — literally 'five legs'",
      },
      {
        cell_id: "c2d0a02b-a462-4c2a-9209-dba7dbe837d2",
        word: "bakso",
        en: "meatball soup",
        vi: "canh/súp thịt viên",
        pos: "noun",
        pronunciation_vi: "BAK-so — món vỉa hè quốc dân",
        pronunciation_en: "BAHK-soh — the national street snack",
      },
      {
        cell_id: "2cadbecb-1fcf-4246-a372-c7d30d9c28fd",
        word: "sate",
        en: "satay / grilled skewers",
        vi: "thịt xiên nướng (sa-tế)",
        pos: "noun",
        pronunciation_vi: "SA-te — đếm bằng `tusuk` (xiên), chấm sốt đậu phộng",
        pronunciation_en: "SAH-teh — counted in `tusuk` (skewers), with peanut sauce",
      },
      {
        cell_id: "8dee5c95-5cb8-4935-aff6-0b9a9f734bac",
        word: "gorengan",
        en: "fried snacks / fritters",
        vi: "đồ chiên",
        pos: "noun (-an)",
        pronunciation_vi: "go-RE-ngan — gốc `goreng` (chiên) + `-an`",
        pronunciation_en: "go-RENG-ahn — root `goreng` (to fry) + `-an`",
      },
      {
        cell_id: "1b150642-b1ec-495b-aebe-26b5d5003cc7",
        word: "sambal",
        en: "chili paste",
        vi: "tương ớt cay",
        pos: "noun",
        pronunciation_vi: "SAM-bal — KHÁC `kecap manis` (xì dầu ngọt)",
        pronunciation_en: "SAHM-bal — NOT `kecap manis` (sweet soy sauce)",
      },
      {
        cell_id: "13070b3d-24f8-423c-af86-d886e655d257",
        word: "pedas",
        en: "spicy",
        vi: "cay",
        pos: "adj.",
        pronunciation_vi: "pe-DAS — `tidak pedas` = không cay; `sedikit pedas` = ít cay",
        pronunciation_en: "puh-DAS — `tidak pedas` = not spicy; `sedikit pedas` = a little spicy",
      },
      {
        cell_id: "6cf060fa-bf2d-4b4a-bbe0-5cf114b2bb4c",
        word: "es teh manis",
        en: "sweet iced tea",
        vi: "trà đá ngọt",
        pos: "noun phrase",
        pronunciation_vi: "es teh MA-nis — `tawar` = không đường",
        pronunciation_en: "es teh MAH-nis — `tawar` = unsweetened",
      },
      {
        cell_id: "d7697ea9-2e7f-4687-808c-91e58ef81cfe",
        word: "porsi",
        en: "portion / serving",
        vi: "phần (suất)",
        pos: "noun (counter)",
        pronunciation_vi: "POR-si — `satu porsi` = một phần",
        pronunciation_en: "POR-see — `satu porsi` = one portion",
      },
      {
        cell_id: "1f5bdb8c-aea0-4a8e-a1b9-ea65ecb6275f",
        word: "bungkus",
        en: "to wrap / takeaway",
        vi: "gói (mang đi)",
        pos: "verb",
        pronunciation_vi: "BUNG-kus — ăn tại chỗ = `makan di sini`",
        pronunciation_en: "BOONG-koos — eat-in = `makan di sini`",
      },
      {
        cell_id: "b95bad47-5089-4871-8615-e524f6dd3108",
        word: "mas / mbak",
        en: "young man / young woman (address)",
        vi: "anh / chị (gọi người trẻ)",
        pos: "address term",
        pronunciation_vi: "mas / mbak — bật nhẹ 'm' trước 'bak'",
        pronunciation_en: "mahs / mbahk — hum a light 'm' before 'bak'",
      },
      {
        cell_id: "c5638f1e-830a-4ab1-8530-b96dbf16b7a8",
        word: "tambah",
        en: "to add / one more",
        vi: "thêm",
        pos: "verb",
        pronunciation_vi: "TAM-bah — `tambah nasi` = thêm cơm",
        pronunciation_en: "TAHM-bah — `tambah nasi` = more rice",
      },
      {
        cell_id: "eed1d0a8-573e-4ee3-8440-2a86744f227e",
        word: "enak",
        en: "tasty / delicious",
        vi: "ngon",
        pos: "adj.",
        pronunciation_vi: "e-NAK — `enak banget` = ngon cực kỳ",
        pronunciation_en: "uh-NAHK — `enak banget` = really tasty",
      },
    ],
    dialogue: [
      {
        cell_id: "cdc96462-c4d2-418d-b09d-f235d0bd4863",
        speaker: "Pembeli",
        text: "Mas, mau pesan bakso satu sama es teh manis, ya.",
        vi: "Anh ơi, cho tôi một tô bakso và một ly trà đá ngọt nhé.",
        en: "Hey, one bakso and a sweet iced tea, please.",
      },
      {
        cell_id: "ad1a026d-7f49-4a86-9392-4052758d6666",
        speaker: "Penjual",
        text: "Baik. Pakai sambal, Mas? Pedas atau tidak?",
        vi: "Vâng. Cho tương ớt không anh? Cay hay không cay?",
        en: "Sure. Sambal? Spicy or not?",
      },
      {
        cell_id: "3da1d623-55f1-45ff-8047-42b7acdcd960",
        speaker: "Pembeli",
        text: "Sambalnya sedikit saja, jangan terlalu pedas.",
        vi: "Tương ớt một chút thôi, đừng cay quá.",
        en: "Just a little sambal, not too spicy.",
      },
      {
        cell_id: "73b51ced-63a6-4891-80f7-e58ea326a7fa",
        speaker: "Penjual",
        text: "Siap. Ada lagi? Sate ayamnya enak, lho.",
        vi: "Sẵn sàng. Còn gì nữa không? Sate gà ngon lắm đấy.",
        en: "Got it. Anything else? The chicken sate is great.",
      },
      {
        cell_id: "61b67ebd-0c76-4cd9-b4f3-8f665163eef7",
        speaker: "Pembeli",
        text: "Boleh, sate ayam lima tusuk. Berapa semuanya?",
        vi: "Được, năm xiên sate gà. Tất cả bao nhiêu?",
        en: "Sure, five chicken sate. How much is it all?",
      },
      {
        cell_id: "b5047e68-0988-431b-b8bd-8801e86574bf",
        speaker: "Penjual",
        text: "Semuanya tiga puluh lima ribu. Bisa tunai atau QRIS.",
        vi: "Tất cả ba lăm nghìn. Tiền mặt hay QRIS đều được.",
        en: "Thirty-five thousand total. Cash or QRIS.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Anh ơi, cho tôi đặt một tô bakso nhé.", answer: "Mas, mau pesan bakso satu, ya." },
          { prompt: "Làm ơn đừng cay quá.", answer: "Tolong jangan terlalu pedas, ya." },
          { prompt: "Cho một ly trà đá ngọt.", answer: "Es teh manis satu." },
          { prompt: "Tất cả bao nhiêu vậy chị?", answer: "Berapa semuanya, Mbak?" },
          { prompt: "Gói mang về thôi nhé.", answer: "Bungkus saja, ya." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — chọn món và độ cay:",
        instruction_en: "Extra practice — choosing dishes and spice level:",
        items: [
          { prompt: "Tôi muốn mười xiên sa-tế gà.", answer: "Saya mau sate ayam sepuluh tusuk." },
          { prompt: "Cho một phần cơm chiên, đừng cho rau.", answer: "Nasi gorengnya satu porsi, jangan pakai sayur." },
          { prompt: "Cho tương ớt một chút thôi.", answer: "Pakai sambal sedikit saja." },
          { prompt: "Trả bằng QRIS được không anh?", answer: "Bayarnya pakai QRIS bisa, Mas?" },
          { prompt: "Ngon cực kỳ, cảm ơn chị nhé!", answer: "Enak banget, makasih ya, Mbak!" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Điền độ cay/vị đúng: 'không cay' → `tidak ___`, 'ít cay' → `sedikit ___`, 'trà ngọt' → `es teh ___`, 'trà không đường' → `es teh ___`.",
        instruction_en:
          "Fill in the right spice/taste word: 'not spicy' → `tidak ___`, 'a little spicy' → `sedikit ___`, 'sweet tea' → `es teh ___`, 'unsweetened tea' → `es teh ___`.",
        items: [
          { prompt: "tidak ___ (không cay)", answer: "pedas" },
          { prompt: "sedikit ___ (ít cay)", answer: "pedas" },
          { prompt: "es teh ___ (ngọt)", answer: "manis" },
          { prompt: "es teh ___ (không đường)", answer: "tawar" },
        ],
      },
      {
        type: "term_match",
        instruction_vi: "Ghép món/từ với nghĩa:",
        instruction_en: "Match the food/word to its meaning:",
        items: [
          { prompt: "warung", answer: "quán ăn nhỏ cố định (small fixed eatery)" },
          { prompt: "kaki lima", answer: "hàng rong/xe đẩy vỉa hè (street pushcart)" },
          { prompt: "sambal", answer: "tương ớt cay (spicy chili paste)" },
          { prompt: "kecap manis", answer: "xì dầu ngọt (sweet soy sauce)" },
          { prompt: "bungkus", answer: "gói mang đi (to wrap / takeaway)" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung gọi món vỉa hè — điền chỗ trống: `Mas/Mbak, mau pesan ___. Jangan terlalu pedas. Minumnya ___. Berapa semuanya?`",
        instruction_en:
          "Street-order frame — fill the blanks: `Mas/Mbak, mau pesan ___. Jangan terlalu pedas. Minumnya ___. Berapa semuanya?`",
        example:
          "Mas, mau pesan nasi goreng satu porsi. Jangan terlalu pedas. Minumnya es teh manis satu. Berapa semuanya?",
        example_vi:
          "Anh ơi, cho một phần cơm chiên. Đừng cay quá. Đồ uống một ly trà đá ngọt. Tất cả bao nhiêu?",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra ở quán vỉa hè — bạn làm được chưa?",
        instruction_en: "Quick street-food self-check — can you do each one?",
        items: [
          { vi: "Tôi gọi người bán đúng: `mas`/`mbak`/`bang`/`bu`.", en: "I address vendors correctly: `mas`/`mbak`/`bang`/`bu`." },
          { vi: "Tôi đặt món bằng `mau pesan ___` và đếm đúng lượng từ (`tusuk`, `porsi`).", en: "I order with `mau pesan ___` and use the right counters (`tusuk`, `porsi`)." },
          { vi: "Tôi điều chỉnh độ cay: `tidak pedas` / `sedikit pedas` / `jangan terlalu pedas`.", en: "I adjust spice: `tidak pedas` / `sedikit pedas` / `jangan terlalu pedas`." },
          { vi: "Tôi phân biệt `sambal` (ớt) và `kecap manis` (xì dầu ngọt).", en: "I distinguish `sambal` (chili) from `kecap manis` (sweet soy)." },
          { vi: "Tôi hỏi `Berapa semuanya?` và hỏi `QRIS bisa?`.", en: "I ask `Berapa semuanya?` and `QRIS bisa?`." },
          { vi: "Tôi biết `bungkus` (mang đi) khác `makan di sini` (ăn tại chỗ).", en: "I know `bungkus` (to go) vs `makan di sini` (eat in)." },
        ],
      },
    ],
  },
];

export default lessons;
