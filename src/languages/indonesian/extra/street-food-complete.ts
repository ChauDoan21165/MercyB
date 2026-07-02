// Street Food Indonesian — the complete ordering guide (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (shopping-bargaining.ts, food-cooking.ts,
// restaurant-hospitality.ts, etc.), which in turn mirror the French `FrenchLesson`
// shape. When the shared Indonesian registry (src/languages/indonesian/lessons.ts)
// lands, swap the local types for a shared import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// Indonesian is written in Latin script and is largely phonetic. For Vietnamese
// speakers the big WINS are: no grammatical gender, no verb conjugation, no tones,
// no articles — and a deep love of street food that maps onto the Vietnamese
// quán vỉa hè culture instantly. The traps here are food-stall pragmatics: the
// `pakai`/`tanpa` (with/without) ordering frame, the spice dial (`pedas`/`tidak
// pedas`/`level berapa?`), `bungkus` (to-go) vs `makan di sini` (dine-in), and
// the di- passive in `dibungkus`, `dipisah` (kept separate), `digoreng` (fried).

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
    id: "indonesian_street_food_complete",
    level: "A2",
    category: "food",
    title_vi: "Tiếng Indonesia với đồ ăn đường phố (đầy đủ)",
    title_en: "Street food Indonesian — the complete guide",
    sentences: [
      // ── Getting the seller's attention & ordering ───────────────────────
      {
        en: "Bang, pesan nasi goreng satu, ya.",
        vi: "Anh ơi, cho một dĩa cơm rang nhé.",
        pronunciation_focus: [
          "bang, pe-SAN NA-si GO-reng SA-tu, ya — `Bang` = anh (gọi người bán nam trẻ, gốc Betawi/Jakarta); `pesan` = gọi món/đặt; `nasi goreng` = cơm rang.",
          "Lợi thế người Việt: `pesan + món + số lượng` cực giống 'cho + món + số' của tiếng Việt, không chia thì.",
          "Lỗi người Việt: gọi người bán trống không. Thêm `Bang`/`Mas` (anh), `Mbak` (chị), `Bu`/`Pak` cho lịch sự.",
          "Luyện: `Bang, pesan nasi goreng satu, ya.`",
        ],
        pronunciation_focus_en: [
          "bang, pe-SAN NA-si GO-reng SA-too, ya — `Bang` = bro (a young male vendor, Betawi/Jakarta); `pesan` = to order; `nasi goreng` = fried rice.",
          "VN-speaker win: `pesan + dish + quantity` maps closely to Vietnamese 'cho + dish + number' — no tense.",
          "VN-speaker trap: hailing a vendor with no title. Add `Bang`/`Mas` (m), `Mbak` (f), `Bu`/`Pak` to be polite.",
          "Drill: `Bang, pesan nasi goreng satu, ya.`",
        ],
      },
      {
        en: "Saya mau sate ayam sepuluh tusuk.",
        vi: "Tôi muốn mười xiên gà nướng (sa tế).",
        pronunciation_focus: [
          "SA-ya MA-u SA-te A-yam se-PU-luh TU-suk — `mau` = muốn; `sate ayam` = thịt gà xiên nướng; `tusuk` = (lượng từ) xiên/que.",
          "Lỗi người Việt: quên lượng từ. Sate đếm bằng `tusuk` (xiên): `sepuluh tusuk` = mười xiên.",
          "Mẹo: `sate` đọc 'SA-te', không phải 'sa-tế'; thường ăn kèm `lontong` (bánh gạo) hoặc `nasi`.",
          "Luyện: `Saya mau sate ayam sepuluh tusuk.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MA-oo SA-te A-yam se-POO-luh TOO-sook — `mau` = to want; `sate ayam` = chicken skewers; `tusuk` = (classifier) skewer/stick.",
          "VN-speaker trap: dropping the classifier. Satay is counted in `tusuk` (skewers): `sepuluh tusuk` = ten skewers.",
          "Tip: `sate` is 'SA-te'; often eaten with `lontong` (rice cake) or `nasi`.",
          "Drill: `Saya mau sate ayam sepuluh tusuk.`",
        ],
      },
      // ── The with/without frame ──────────────────────────────────────────
      {
        en: "Pakai sambal, tapi tanpa bawang, ya.",
        vi: "Cho thêm tương ớt, nhưng không hành nhé.",
        pronunciation_focus: [
          "PA-kai SAM-bal, TA-pi TAN-pa BA-wang, ya — `pakai` = dùng/cho thêm (cùng); `sambal` = tương ớt; `tanpa` = không có/thiếu; `bawang` = hành.",
          "Lỗi người Việt: dùng `tidak` cho 'không có (thành phần)'. Đúng là `tanpa` (= without): `tanpa bawang`.",
          "Mẹo: cặp `pakai … tanpa …` là khung tùy chỉnh món vạn năng.",
          "Luyện: `Pakai sambal, tanpa bawang.`",
        ],
        pronunciation_focus_en: [
          "PA-kai SAM-bal, TA-pi TAN-pa BA-wang, ya — `pakai` = with/using; `sambal` = chili paste; `tanpa` = without; `bawang` = onion.",
          "VN-speaker trap: using `tidak` for 'without (an ingredient)'. The right word is `tanpa`: `tanpa bawang`.",
          "Tip: the `pakai … tanpa …` pair is the all-purpose customization frame.",
          "Drill: `Pakai sambal, tanpa bawang.`",
        ],
      },
      {
        en: "Jangan terlalu pedas, ya. Saya tidak kuat pedas.",
        vi: "Đừng cay quá nhé. Tôi ăn cay không giỏi.",
        pronunciation_focus: [
          "JA-ngan ter-LA-lu pe-DAS, ya. SA-ya TI-dak KU-at pe-DAS — `jangan` = đừng; `terlalu` = quá; `pedas` = cay; `tidak kuat pedas` = ăn cay không nổi.",
          "Lỗi người Việt: dùng `tidak` để cấm. Cấm/'đừng' dùng `jangan`, không `tidak`.",
          "Mẹo: nhiều quán hỏi `level berapa?` (cấp độ mấy?) — `level satu` nhẹ nhất.",
          "Luyện: `Jangan terlalu pedas, saya tidak kuat pedas.`",
        ],
        pronunciation_focus_en: [
          "JA-ngan ter-LA-loo pe-DAS, ya. SA-ya TEE-dak KOO-at pe-DAS — `jangan` = don't; `terlalu` = too (much); `pedas` = spicy; `tidak kuat pedas` = can't handle spice.",
          "VN-speaker trap: using `tidak` to forbid. For 'don't', use `jangan`, not `tidak`.",
          "Tip: many stalls ask `level berapa?` (which level?) — `level satu` is the mildest.",
          "Drill: `Jangan terlalu pedas, saya tidak kuat pedas.`",
        ],
      },
      // ── Dine-in vs take-away ────────────────────────────────────────────
      {
        en: "Buat di sini atau dibungkus, Mbak?",
        vi: "Ăn ở đây hay gói mang về vậy chị?",
        pronunciation_focus: [
          "BU-at di SI-ni A-tau di-bung-KUS, Mbak? — `buat`/`makan di sini` = ăn tại chỗ; `atau` = hoặc; `dibungkus` = (được) gói mang về (di- + bungkus).",
          "Lỗi người Việt: quên `di-`. 'Gói lại (giúp)' là `dibungkus` (bị động di-), không `bungkus` trần khi nói trang trọng.",
          "Mẹo: đây là câu người bán hay hỏi BẠN — học để nghe hiểu và trả lời nhanh.",
          "Luyện: `Makan di sini atau dibungkus?`",
        ],
        pronunciation_focus_en: [
          "BU-at di SEE-ni A-tau di-boong-KOOS, Mbak? — `buat`/`makan di sini` = eat here; `atau` = or; `dibungkus` = packed to go (di- + bungkus).",
          "VN-speaker trap: dropping the `di-`. 'Wrap it up' is `dibungkus` (di- passive), not a bare `bungkus` in polite speech.",
          "Tip: this is what the vendor asks YOU — learn it to understand and answer fast.",
          "Drill: `Makan di sini atau dibungkus?`",
        ],
      },
      {
        en: "Dibungkus saja, ya. Sambalnya dipisah.",
        vi: "Gói mang về thôi nhé. Tương ớt để riêng.",
        pronunciation_focus: [
          "di-bung-KUS SA-ja, ya. SAM-bal-nya di-PI-sah — `dibungkus saja` = gói mang về thôi; `dipisah` = (để) tách riêng (di- + pisah); `sambalnya` = phần tương ớt (+ -nya).",
          "Lỗi người Việt: dùng `pisah` trần. Yêu cầu để riêng dùng bị động `dipisah` cho lịch sự, tự nhiên.",
          "Mẹo: `-nya` gắn vào danh từ = 'phần/cái đó của nó' (`sambalnya` = phần tương ớt).",
          "Luyện: `Dibungkus saja, sambalnya dipisah.`",
        ],
        pronunciation_focus_en: [
          "di-boong-KOOS SA-ja, ya. SAM-bal-nya di-PEE-sah — `dibungkus saja` = just pack it to go; `dipisah` = kept separate (di- + pisah); `sambalnya` = the chili (+ -nya).",
          "VN-speaker trap: a bare `pisah`. To ask for it kept separate, the passive `dipisah` is more natural and polite.",
          "Tip: `-nya` on a noun = 'the … of it' (`sambalnya` = the chili part).",
          "Drill: `Dibungkus saja, sambalnya dipisah.`",
        ],
      },
      // ── Drinks ──────────────────────────────────────────────────────────
      {
        en: "Minumnya es teh manis satu, tapi jangan terlalu manis.",
        vi: "Đồ uống cho một ly trà đá ngọt, nhưng đừng ngọt quá.",
        pronunciation_focus: [
          "mi-NUM-nya es TEH MA-nis SA-tu, TA-pi JA-ngan ter-LA-lu MA-nis — `minum` = uống; `es teh manis` = trà đá ngọt; `manis` = ngọt; `es` = đá/lạnh.",
          "Lỗi người Việt: nói `tra da` kiểu Việt. Trà đá ngọt là `es teh manis`; trà nóng không đường là `teh tawar (panas)`.",
          "Mẹo: `es jeruk` = nước cam đá; `jeruk` đọc 'JE-ruk'.",
          "Luyện: `Es teh manis satu, jangan terlalu manis.`",
        ],
        pronunciation_focus_en: [
          "mi-NUM-nya es TEH MA-nis SA-too, TA-pi JA-ngan ter-LA-loo MA-nis — `minum` = to drink; `es teh manis` = sweet iced tea; `manis` = sweet; `es` = ice/cold.",
          "VN-speaker trap: saying it the Vietnamese way. Sweet iced tea is `es teh manis`; hot unsweetened tea is `teh tawar (panas)`.",
          "Tip: `es jeruk` = iced orange juice; `jeruk` is 'JE-rook'.",
          "Drill: `Es teh manis satu, jangan terlalu manis.`",
        ],
      },
      // ── Paying ──────────────────────────────────────────────────────────
      {
        en: "Semuanya berapa, Bang? Bisa pakai QRIS?",
        vi: "Tất cả bao nhiêu anh ơi? Quét QRIS được không?",
        pronunciation_focus: [
          "se-MU-a-nya be-RA-pa, Bang? BI-sa PA-kai ka-RIS? — `semuanya` = tất cả (semua + -nya); `berapa` = bao nhiêu; `QRIS` (đọc 'kris'/'ku-ris') = quét mã thanh toán.",
          "Lỗi người Việt: nói `semua berapa`. Tự nhiên hơn là `semuanya berapa?` (có -nya).",
          "Mẹo: quán nhỏ giờ nhiều nơi nhận `QRIS`; nếu không thì `bayar tunai` (tiền mặt).",
          "Luyện: `Semuanya berapa, Bang?`",
        ],
        pronunciation_focus_en: [
          "se-MU-a-nya be-RA-pa, Bang? BEE-sa PA-kai ka-RIS? — `semuanya` = all of it (semua + -nya); `berapa` = how much; `QRIS` (say 'kris') = QR payment scan.",
          "VN-speaker trap: saying `semua berapa`. More natural is `semuanya berapa?` (with -nya).",
          "Tip: many small stalls now take `QRIS`; otherwise `bayar tunai` (pay cash).",
          "Drill: `Semuanya berapa, Bang?`",
        ],
      },
      {
        en: "Enak banget! Nanti saya ke sini lagi.",
        vi: "Ngon cực! Lần sau tôi sẽ lại đến đây.",
        pronunciation_focus: [
          "e-NAK BANG-et! NAN-ti SA-ya ke SI-ni LA-gi — `enak` = ngon; `banget` = cực/lắm (đời thường, đứng sau); `nanti` = lát/lần sau; `lagi` = nữa/lại.",
          "Lỗi người Việt: dùng `banget` trong văn trang trọng. `Banget` là khẩu ngữ (gaul nhẹ); trang trọng dùng `sekali` (`enak sekali`).",
          "Mẹo: khen `enak` làm người bán rất vui — văn hóa quán xá rất quý lời khen chân thành.",
          "Luyện: `Enak banget! Nanti saya ke sini lagi.`",
        ],
        pronunciation_focus_en: [
          "e-NAK BANG-et! NAN-ti SA-ya ke SEE-ni LA-gi — `enak` = delicious; `banget` = really/very (casual, after the word); `nanti` = later; `lagi` = again.",
          "VN-speaker trap: using `banget` in formal speech. `Banget` is casual; the formal version is `sekali` (`enak sekali`).",
          "Tip: an `enak` compliment delights the vendor — stall culture treasures sincere praise.",
          "Drill: `Enak banget! Nanti saya ke sini lagi.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Đồ ăn đường phố (`jajanan kaki lima`) là trái tim ẩm thực Indonesia, và người Việt sẽ thấy như ở nhà — văn hóa quán vỉa hè, ăn nhanh, giá bình dân rất giống nhau. Vài nét then chốt:\n\nNƠI ĂN: `kaki lima` = quầy/xe đẩy ven đường (nghĩa đen 'năm chân'); `warung` = quán nhỏ cố định; `angkringan` = quầy đêm kiểu Java (Yogyakarta/Solo) bán `nasi kucing` (cơm phần nhỏ) và đồ nướng; `gerobak` = xe đẩy. Nhiều hàng rong rao bằng tiếng gõ đặc trưng: tiếng leng keng = `bakso` (bò viên), gõ 'tok-tok' = `mie ayam`/`bakmi`.\n\nMÓN PHẢI BIẾT: `nasi goreng` (cơm rang), `mie goreng/rebus` (mì xào/nước), `sate` (xiên nướng), `bakso` (bò/heo viên nước), `mie ayam` (mì gà), `gado-gado`/`pecel` (rau trộn sốt đậu phộng), `martabak` (manis=bánh ngọt dày, telur=mặn trứng), `nasi padang` (cơm Padang nhiều món, tính theo món bạn lấy), `pecel lele` (cá trê chiên + sambal), `gorengan` (đồ chiên: tempe, tahu, bakwan, pisang), `es campur`/`es cendol` (chè đá). Hầu hết đi kèm `sambal` (tương ớt) và `kerupuk` (bánh phồng).\n\nGIÁ & THANH TOÁN: rẻ, thường 10.000-35.000 rupiah/phần; giá KHÔNG mặc cả như ở chợ quần áo — đồ ăn đường phố là `harga pas`. Trả `tunai` (tiền mặt) hoặc ngày càng nhiều nơi nhận `QRIS` (quét mã). Với `nasi padang`, bạn lấy món nào tính món đó; món chưa đụng tới được trả lại.\n\nĐỘ CAY: Indonesia ăn rất cay. `pedas` = cay; nói rõ `tidak pedas` (không cay), `sedikit pedas` (cay nhẹ), hay đáp `level berapa?` (cấp mấy). `sambal` để riêng (`dipisah`) là chiến lược an toàn cho người mới.\n\nLỊCH SỰ: gọi người bán `Bang`/`Mas` (anh), `Mbak` (chị), `Bu`/`Pak` (cô/chú). Khen `enak!` rất được quý. Ăn xong nói `terima kasih`. Nhiều nơi tự phục vụ và tự dọn.",
    cultural_notes_en:
      "Street food (`jajanan kaki lima`) is the heart of Indonesian cuisine, and Vietnamese speakers will feel right at home — the curbside-stall, fast, cheap-eats culture is very similar. Key points:\n\nWHERE: `kaki lima` = roadside cart/stall (literally 'five legs'); `warung` = a small fixed eatery; `angkringan` = a Javanese night stall (Yogyakarta/Solo) selling `nasi kucing` (tiny rice portions) and grilled bites; `gerobak` = a pushcart. Many hawkers announce themselves by a signature sound: a bell = `bakso` (meatballs), a 'tok-tok' knock = `mie ayam`/`bakmi`.\n\nMUST-KNOW DISHES: `nasi goreng` (fried rice), `mie goreng/rebus` (fried/soup noodles), `sate` (grilled skewers), `bakso` (meatball soup), `mie ayam` (chicken noodles), `gado-gado`/`pecel` (veg in peanut sauce), `martabak` (manis = thick sweet pancake, telur = savory egg-stuffed), `nasi padang` (Padang rice, charged per dish taken), `pecel lele` (fried catfish + sambal), `gorengan` (fritters: tempe, tahu, bakwan, banana), `es campur`/`es cendol` (iced sweet desserts). Most come with `sambal` (chili paste) and `kerupuk` (crackers).\n\nPRICE & PAYMENT: cheap, usually 10,000–35,000 rupiah per portion; prices are NOT haggled like clothes at a market — street food is `harga pas`. Pay `tunai` (cash) or, increasingly, by `QRIS` (QR scan). With `nasi padang`, you're charged for whatever you take; untouched dishes go back.\n\nSPICE: Indonesia eats very spicy. `pedas` = spicy; specify `tidak pedas` (not spicy), `sedikit pedas` (mild), or answer `level berapa?` (which level). Asking for the `sambal` on the side (`dipisah`) is a safe newcomer strategy.\n\nPOLITENESS: address the vendor `Bang`/`Mas` (m), `Mbak` (f), `Bu`/`Pak`. An `enak!` compliment is treasured. Say `terima kasih` when done. Many stalls are self-serve and self-clear.",
    tip_advice_vi:
      "Học 'bộ khung gọi món' bốn bước ở quầy: (1) gọi + đặt món — `Bang, pesan [món] [số], ya.`; (2) tùy chỉnh — `Pakai [X], tanpa [Y].` + `Jangan terlalu pedas.`; (3) ăn ở đây/mang về — `Makan di sini` / `Dibungkus saja, sambalnya dipisah.`; (4) trả tiền — `Semuanya berapa? Bisa pakai QRIS?`. Đừng quên đồ uống: `Es teh manis satu, ya.`.\n\nNhớ các cặp/khung dễ nhầm: `tanpa` (không có thành phần) vs `jangan` (đừng làm) vs `tidak` (không/phủ định chung) — ba từ 'không' khác nhau; `pakai` (cùng/cho thêm) là cặp của `tanpa`; thể bị động `di-` cho dịch vụ món ăn: `dibungkus` (gói mang về), `dipisah` (để riêng), `digoreng` (chiên), `direbus` (luộc/nấu nước). Lượng từ: `sate` đếm `tusuk` (xiên); cơm/phần đếm `porsi`/`bungkus`. Khẩu ngữ `banget` (= lắm) chỉ dùng thân mật; trang trọng dùng `sekali` đặt SAU tính từ (`enak sekali`). Gọi người bán đúng: `Bang`/`Mas`/`Mbak`/`Bu`/`Pak`. Giữ giọng phẳng; `c` đọc 'ch', `j` đọc 'j' (như 'jam').",
    tip_advice_en:
      "Learn the four-step ordering frame at a stall: (1) hail + order — `Bang, pesan [dish] [number], ya.`; (2) customize — `Pakai [X], tanpa [Y].` + `Jangan terlalu pedas.`; (3) dine-in or to-go — `Makan di sini` / `Dibungkus saja, sambalnya dipisah.`; (4) pay — `Semuanya berapa? Bisa pakai QRIS?`. Don't forget a drink: `Es teh manis satu, ya.`.\n\nKeep these tricky words straight: `tanpa` (without an ingredient) vs `jangan` (don't do) vs `tidak` (general negation) — three different 'no/not' words; `pakai` (with/add) is the partner of `tanpa`; the `di-` passive for food service: `dibungkus` (packed to go), `dipisah` (kept separate), `digoreng` (fried), `direbus` (boiled). Classifiers: `sate` is counted in `tusuk` (skewers); rice/portions in `porsi`/`bungkus`. Casual `banget` (= very) is intimate only; the formal version is `sekali` placed AFTER the adjective (`enak sekali`). Address the vendor correctly: `Bang`/`Mas`/`Mbak`/`Bu`/`Pak`. Keep your pitch flat; `c` is 'ch', `j` is the English 'j' as in 'jam'.",
    vocabulary: [
      // Places & people
      {
        word: "kaki lima",
        en: "street-food stall / curbside vendor",
        vi: "hàng rong / quầy vỉa hè",
        pos: "noun",
        pronunciation_vi: "KA-ki LI-ma — nghĩa đen 'năm chân'; `pedagang kaki lima` (PKL) = người bán rong",
        pronunciation_en: "KA-ki LEE-ma — literally 'five legs'; `pedagang kaki lima` (PKL) = a street vendor",
      },
      {
        word: "warung",
        en: "small eatery / food shop",
        vi: "quán nhỏ",
        pos: "noun",
        pronunciation_vi: "WA-rung — `warung makan` = quán cơm; `warteg` = quán cơm bình dân (warung Tegal)",
        pronunciation_en: "WA-rung — `warung makan` = food stall; `warteg` = cheap rice eatery (warung Tegal)",
      },
      {
        word: "angkringan",
        en: "Javanese night food stall",
        vi: "quầy ăn đêm kiểu Java",
        pos: "noun",
        pronunciation_vi: "ang-KRING-an — Yogya/Solo; bán `nasi kucing` (phần cơm nhỏ) + đồ nướng",
        pronunciation_en: "ang-KRING-an — Yogya/Solo; sells `nasi kucing` (tiny rice) + grilled bites",
      },
      // Star dishes
      {
        word: "nasi goreng",
        en: "fried rice",
        vi: "cơm rang/chiên",
        pos: "noun",
        pronunciation_vi: "NA-si GO-reng — `goreng` = chiên; món quốc dân, ăn sáng tới khuya",
        pronunciation_en: "NA-si GO-reng — `goreng` = fried; the national staple, eaten dawn to midnight",
      },
      {
        word: "sate",
        en: "satay (grilled skewers)",
        vi: "thịt xiên nướng (sa tế)",
        pos: "noun",
        pronunciation_vi: "SA-te — đếm bằng `tusuk`; `sate ayam` (gà), `sate kambing` (dê)",
        pronunciation_en: "SA-te — counted in `tusuk`; `sate ayam` (chicken), `sate kambing` (goat)",
      },
      {
        word: "bakso",
        en: "meatball soup",
        vi: "bún/mì bò viên",
        pos: "noun",
        pronunciation_vi: "BAK-so — xe `bakso` rao bằng tiếng leng keng; ăn với mì/bún + nước dùng",
        pronunciation_en: "BAK-so — the `bakso` cart announces itself with a bell; served with noodles + broth",
      },
      {
        word: "martabak",
        en: "stuffed pancake (sweet or savory)",
        vi: "bánh martabak (ngọt hoặc mặn)",
        pos: "noun",
        pronunciation_vi: "mar-TA-bak — `manis` = ngọt dày; `telur` = mặn nhân trứng+thịt",
        pronunciation_en: "mar-TA-bak — `manis` = thick & sweet; `telur` = savory egg & meat",
      },
      {
        word: "nasi padang",
        en: "Padang rice (many side dishes)",
        vi: "cơm Padang",
        pos: "noun",
        pronunciation_vi: "NA-si PA-dang — tính theo món bạn lấy; `rendang` là món trứ danh",
        pronunciation_en: "NA-si PA-dang — charged per dish taken; `rendang` is the famous one",
      },
      {
        word: "pecel lele",
        en: "fried catfish with sambal & rice",
        vi: "cá trê chiên + tương ớt",
        pos: "noun",
        pronunciation_vi: "pe-CEL LE-le — `c` = 'ch' → 'pe-CHEL'; quán tối phổ biến",
        pronunciation_en: "pe-CHEL LE-le — `c` = 'ch' → 'pe-CHEL'; a common evening stall",
      },
      {
        word: "gorengan",
        en: "assorted fritters",
        vi: "đồ chiên (các loại)",
        pos: "noun",
        pronunciation_vi: "go-RENG-an — tempe, tahu, bakwan, pisang; ăn vặt rẻ nhất",
        pronunciation_en: "go-RENG-an — tempe, tahu, bakwan, banana; the cheapest snack",
      },
      {
        word: "es campur",
        en: "mixed iced dessert",
        vi: "chè đá thập cẩm",
        pos: "noun",
        pronunciation_vi: "es CAM-pur — `c` = 'ch'; `es cendol`/`es teler` cùng họ",
        pronunciation_en: "es CHAM-poor — `c` = 'ch'; `es cendol`/`es teler` are cousins",
      },
      // Ordering & customizing
      {
        word: "pesan",
        en: "to order",
        vi: "gọi món / đặt",
        pos: "verb",
        pronunciation_vi: "pe-SAN — `pesan + món + số`; cũng nghĩa 'tin nhắn' tùy ngữ cảnh",
        pronunciation_en: "pe-SAN — `pesan + dish + number`; also means 'message' by context",
      },
      {
        word: "pakai",
        en: "with / using",
        vi: "có/cho thêm (cùng)",
        pos: "verb/prep",
        pronunciation_vi: "PA-kai — `pakai sambal` = cho thêm tương ớt; cặp với `tanpa`",
        pronunciation_en: "PA-kai — `pakai sambal` = with chili; partner of `tanpa`",
      },
      {
        word: "tanpa",
        en: "without",
        vi: "không có (thành phần)",
        pos: "prep",
        pronunciation_vi: "TAN-pa — `tanpa bawang` = không hành; KHÁC `tidak`/`jangan`",
        pronunciation_en: "TAN-pa — `tanpa bawang` = without onion; differs from `tidak`/`jangan`",
      },
      {
        word: "pedas",
        en: "spicy",
        vi: "cay",
        pos: "adjective",
        pronunciation_vi: "pe-DAS — `tidak pedas`/`sedikit pedas`/`level berapa?`",
        pronunciation_en: "pe-DAS — `tidak pedas`/`sedikit pedas`/`level berapa?`",
      },
      {
        word: "dibungkus",
        en: "packed to go / wrapped",
        vi: "gói mang về",
        pos: "verb (passive)",
        pronunciation_vi: "di-bung-KUS — bị động di- + `bungkus`; đối lập `makan di sini`",
        pronunciation_en: "di-boong-KOOS — passive di- + `bungkus`; opposite of `makan di sini`",
      },
      {
        word: "dipisah",
        en: "kept separate",
        vi: "để riêng",
        pos: "verb (passive)",
        pronunciation_vi: "di-PI-sah — `sambalnya dipisah` = để tương ớt riêng",
        pronunciation_en: "di-PEE-sah — `sambalnya dipisah` = keep the chili on the side",
      },
      {
        word: "es teh manis",
        en: "sweet iced tea",
        vi: "trà đá ngọt",
        pos: "noun",
        pronunciation_vi: "es TEH MA-nis — `tawar` = không đường; `es jeruk` = nước cam đá",
        pronunciation_en: "es TEH MA-nis — `tawar` = unsweetened; `es jeruk` = iced orange",
      },
      {
        word: "enak",
        en: "delicious / tasty",
        vi: "ngon",
        pos: "adjective",
        pronunciation_vi: "e-NAK — khen: `enak sekali` (trang trọng) / `enak banget` (đời thường)",
        pronunciation_en: "e-NAK — praise: `enak sekali` (formal) / `enak banget` (casual)",
      },
    ],
    dialogue: [
      // Dialogue A: ordering nasi goreng + drink at a kaki lima
      {
        speaker: "Pembeli",
        text: "Bang, pesan nasi goreng satu, ya. Pakai telur, tapi tanpa bawang.",
        vi: "Anh ơi, cho một dĩa cơm rang nhé. Cho thêm trứng, nhưng không hành.",
        en: "Bro, one fried rice, please. With egg, but without onion.",
      },
      {
        speaker: "Penjual",
        text: "Siap. Pedasnya gimana? Level berapa?",
        vi: "Được ngay. Cay sao? Cấp độ mấy?",
        en: "Got it. How spicy? Which level?",
      },
      {
        speaker: "Pembeli",
        text: "Jangan terlalu pedas, ya. Saya tidak kuat pedas. Level satu saja.",
        vi: "Đừng cay quá nhé. Tôi ăn cay không giỏi. Cấp một thôi.",
        en: "Not too spicy, please. I can't handle spice. Just level one.",
      },
      {
        speaker: "Penjual",
        text: "Oke. Minumnya apa? Buat di sini atau dibungkus?",
        vi: "Được. Uống gì? Ăn ở đây hay gói mang về?",
        en: "Okay. Anything to drink? Dine in or take away?",
      },
      {
        speaker: "Pembeli",
        text: "Es teh manis satu. Dibungkus saja, ya, sambalnya dipisah.",
        vi: "Một trà đá ngọt. Gói mang về thôi nhé, tương ớt để riêng.",
        en: "One sweet iced tea. Pack it to go, please, with the chili separate.",
      },
      {
        speaker: "Penjual",
        text: "Beres. Semuanya dua puluh lima ribu.",
        vi: "Xong. Tất cả hai mươi lăm nghìn.",
        en: "Done. That's twenty-five thousand all together.",
      },
      {
        speaker: "Pembeli",
        text: "Bisa pakai QRIS, Bang? ... Enak banget tadi, nanti saya ke sini lagi.",
        vi: "Quét QRIS được không anh? ... Lúc nãy ngon cực, lần sau tôi lại đến.",
        en: "Can I use QRIS, bro? ... That was so good, I'll come back again.",
      },
      // Dialogue B: nasi padang, pay per dish
      {
        speaker: "Pelayan",
        text: "Mau makan apa, Mbak? Ini ada rendang, ayam pop, sama gulai.",
        vi: "Chị muốn ăn gì? Đây có rendang, gà pop, và cà ri gulai.",
        en: "What would you like, miss? We have rendang, ayam pop, and gulai.",
      },
      {
        speaker: "Pembeli",
        text: "Nasi putih satu, pakai rendang. Sayurnya yang ini, tapi gulainya jangan dulu.",
        vi: "Một cơm trắng, cho rendang. Rau lấy cái này, nhưng gulai khoan đã.",
        en: "One white rice with rendang. This vegetable, but hold the gulai for now.",
      },
      {
        speaker: "Pelayan",
        text: "Baik. Yang tidak diambil tidak dihitung, ya. Minum es jeruk?",
        vi: "Vâng. Món không lấy thì không tính nhé. Uống cam đá không ạ?",
        en: "Sure. Whatever you don't take isn't charged. Iced orange to drink?",
      },
      {
        speaker: "Pembeli",
        text: "Boleh, es jeruk satu. Terima kasih, ya, Mbak.",
        vi: "Được, một cam đá. Cảm ơn chị nhé.",
        en: "Yes, one iced orange. Thank you, miss.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Anh ơi, cho một dĩa cơm rang nhé.", answer: "Bang, pesan nasi goreng satu, ya." },
          { prompt: "Tôi muốn mười xiên gà nướng.", answer: "Saya mau sate ayam sepuluh tusuk." },
          { prompt: "Cho thêm tương ớt, nhưng không hành.", answer: "Pakai sambal, tapi tanpa bawang." },
          { prompt: "Đừng cay quá nhé.", answer: "Jangan terlalu pedas, ya." },
          { prompt: "Gói mang về thôi nhé, tương ớt để riêng.", answer: "Dibungkus saja, ya, sambalnya dipisah." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Đồ uống & thanh toán — dịch sang tiếng Indonesia:",
        instruction_en: "Drinks & paying — translate into Indonesian:",
        items: [
          { prompt: "Một trà đá ngọt, đừng ngọt quá.", answer: "Es teh manis satu, jangan terlalu manis." },
          { prompt: "Tất cả bao nhiêu anh ơi?", answer: "Semuanya berapa, Bang?" },
          { prompt: "Quét QRIS được không?", answer: "Bisa pakai QRIS?" },
          { prompt: "Ăn ở đây hay gói mang về?", answer: "Makan di sini atau dibungkus?" },
          { prompt: "Ngon cực, lần sau tôi lại đến đây.", answer: "Enak banget, nanti saya ke sini lagi." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn `tanpa`, `jangan`, `tidak`, hay `pakai` cho đúng (ba kiểu 'không' + 'có/cho thêm'):",
        instruction_en:
          "Choose `tanpa`, `jangan`, `tidak`, or `pakai` correctly (three 'no/not' words + 'with'):",
        items: [
          { prompt: "Saya mau bakso ___ sambal, biar tidak pedas.", answer: "tanpa", hint: "'không có (thành phần)' → tanpa" },
          { prompt: "___ terlalu manis, ya.", answer: "Jangan", hint: "mệnh lệnh 'đừng' → jangan" },
          { prompt: "Saya ___ kuat pedas.", answer: "tidak", hint: "phủ định chung 'không' → tidak" },
          { prompt: "Nasi gorengnya ___ telur, ya.", answer: "pakai", hint: "'có/cho thêm (cùng)' → pakai" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung gọi món ở quầy — điền chỗ trống: `Bang, pesan ___ satu, ya. Pakai ___, tanpa ___. Jangan terlalu ___. ___ saja, sambalnya dipisah.`",
        instruction_en:
          "Stall-ordering frame — fill the blanks: `Bang, pesan ___ satu, ya. Pakai ___, tanpa ___. Jangan terlalu ___. ___ saja, sambalnya dipisah.`",
        example:
          "Bang, pesan nasi goreng satu, ya. Pakai telur, tanpa bawang. Jangan terlalu pedas. Dibungkus saja, sambalnya dipisah.",
        example_vi:
          "Anh ơi, cho một dĩa cơm rang nhé. Cho thêm trứng, không hành. Đừng cay quá. Gói mang về thôi, tương ớt để riêng.",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra ăn đường phố — bạn làm được chưa?",
        instruction_en: "Street-food self-check — can you do each one?",
        items: [
          { vi: "Tôi có thể gọi người bán đúng (`Bang`/`Mas`/`Mbak`/`Bu`) và đặt món + số lượng.", en: "I can hail the vendor correctly (`Bang`/`Mas`/`Mbak`/`Bu`) and order a dish + quantity." },
          { vi: "Tôi dùng đúng `pakai` (cho thêm) và `tanpa` (không có thành phần).", en: "I use `pakai` (with) and `tanpa` (without an ingredient) correctly." },
          { vi: "Tôi phân biệt ba từ 'không': `tanpa`, `jangan`, `tidak`.", en: "I can tell the three 'no/not' words apart: `tanpa`, `jangan`, `tidak`." },
          { vi: "Tôi điều chỉnh được độ cay: `tidak pedas`/`level satu`.", en: "I can dial the spice: `tidak pedas`/`level satu`." },
          { vi: "Tôi dùng thể bị động `di-`: `dibungkus`, `dipisah`.", en: "I use the `di-` passive: `dibungkus`, `dipisah`." },
          { vi: "Tôi biết đồ ăn đường phố là `harga pas` (không mặc cả) và hỏi `semuanya berapa?`.", en: "I know street food is `harga pas` (no haggling) and can ask `semuanya berapa?`." },
          { vi: "Tôi khen `enak!` và cảm ơn khi ăn xong.", en: "I compliment with `enak!` and thank the vendor when done." },
        ],
      },
    ],
  },
];

export default lessons;
