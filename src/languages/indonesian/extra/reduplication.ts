// Reduplication (kata ulang) Indonesian — grammar deep-dive for Vietnamese learners.
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (construction-worker, healthcare-emergency,
// restaurant-hospitality, school-education, phone-calls, public-services,
// apartment-neighbors), which in turn mirror the French `FrenchLesson` shape. When
// the shared Indonesian registry (src/languages/indonesian/lessons.ts) lands, swap
// the local types for a shared import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// TOPIC — reduplication / `kata ulang`: doubling a word. This is the ONE Indonesian
// feature that maps unusually well onto Vietnamese intuition (Vietnamese has its own
// rich từ láy), but the FUNCTIONS differ, so the lesson leans on that contrast.
// The four sub-types covered:
//   1. dwilingga    — full doubling: orang-orang (plural), pelan-pelan (intensified).
//   2. berubah bunyi — sound-changing: sayur-mayur, bolak-balik, warna-warni.
//   3. berimbuhan   — affixed doubling: mobil-mobilan (toy), kebarat-baratan (-ish).
//   4. dwipurwa     — partial/first-syllable: laki → lelaki, tamu → tetamu.
// CRITICAL RULE: a number kills the plural reduplication — `dua orang` (two people),
// NEVER `dua orang-orang`. This is the highest-yield correction for VN speakers.

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
    id: "indonesian_reduplication",
    level: "B1",
    category: "grammar",
    title_vi: "Từ láy (kata ulang): lặp từ trong tiếng Indonesia",
    title_en: "Reduplication (kata ulang): doubling words in Indonesian",
    sentences: [
      // ── 1. Full doubling = plural ─────────────────────────────────────────
      {
        en: "Orang-orang sudah berkumpul di lapangan.",
        vi: "Mọi người đã tụ tập ở sân rồi.",
        pronunciation_focus: [
          "O-rang-O-rang SU-dah ber-KUM-pul di la-PANG-an — `orang-orang` = nhiều người; lặp `orang` để chỉ số nhiều.",
          "Mẹo: tiếng Indonesia KHÔNG có 's' số nhiều như tiếng Anh; lặp danh từ là một cách báo số nhiều: `orang` (người) → `orang-orang` (mọi người).",
          "Lỗi người Việt: thêm `banyak` rồi vẫn lặp: `banyak orang-orang`. Đã có `banyak` (nhiều) thì KHÔNG lặp — chỉ `banyak orang`.",
          "Luyện: `Orang-orang sudah berkumpul.`",
        ],
        pronunciation_focus_en: [
          "O-rang-O-rang SU-dah ber-KUM-pul di la-PANG-an — `orang-orang` = people; doubling `orang` marks plural.",
          "Tip: Indonesian has no English-style plural 's'; doubling a noun is one way to mark plural: `orang` (person) → `orang-orang` (people).",
          "VN-speaker trap: adding `banyak` and still doubling: `banyak orang-orang`. With `banyak` (many) you do NOT double — just `banyak orang`.",
          "Drill: `Orang-orang sudah berkumpul.`",
        ],
      },
      {
        en: "Anak-anak sedang bermain di taman.",
        vi: "Bọn trẻ đang chơi ở công viên.",
        pronunciation_focus: [
          "A-nak-A-nak SE-dang ber-MA-in di TA-man — `anak-anak` = bọn trẻ; `sedang` = đang.",
          "Mẹo: `anak` (đứa trẻ) → `anak-anak` (trẻ con/bọn trẻ). Đọc rõ `k` cuối mỗi vế: A-nak-A-nak.",
          "Lỗi người Việt: nuốt `k` cuối → nghe thành 'a-na-a-na'. Phải bật `k`.",
          "Luyện: `Anak-anak sedang bermain.`",
        ],
        pronunciation_focus_en: [
          "A-nak-A-nak SE-dang ber-MA-in di TA-man — `anak-anak` = children; `sedang` = currently.",
          "Tip: `anak` (child) → `anak-anak` (children). Sound the final `k` of each half: A-nak-A-nak.",
          "VN-speaker trap: swallowing the final `k` → 'a-na-a-na'. Release the `k`.",
          "Drill: `Anak-anak sedang bermain.`",
        ],
      },
      // ── number kills the plural reduplication ─────────────────────────────
      {
        en: "Ada dua orang di depan, bukan orang-orang.",
        vi: "Có hai người ở phía trước, không phải 'đám người'.",
        pronunciation_focus: [
          "A-da DU-a O-rang di de-PAN, BU-kan O-rang-O-rang — quy tắc vàng: có số đếm thì KHÔNG lặp.",
          "Mẹo CỐT LÕI: `dua orang` (hai người) — số `dua` đã báo số nhiều, nên `orang` ở dạng đơn. `dua orang-orang` là SAI.",
          "Lỗi người Việt: lặp danh từ sau số đếm. Có số (`dua`, `tiga`, `banyak`) → danh từ KHÔNG lặp.",
          "Luyện: `dua orang` (đúng) ↔ `dua orang-orang` (sai).",
        ],
        pronunciation_focus_en: [
          "A-da DU-a O-rang di de-PAN, BU-kan O-rang-O-rang — the golden rule: with a number, do NOT double.",
          "CORE tip: `dua orang` (two people) — the number `dua` already marks plural, so `orang` stays singular. `dua orang-orang` is WRONG.",
          "VN-speaker trap: doubling the noun after a number. With a number (`dua`, `tiga`, `banyak`) the noun does NOT double.",
          "Drill: `dua orang` (correct) ↔ `dua orang-orang` (wrong).",
        ],
      },
      // ── 2. Intensified / softened adjective + adverb ──────────────────────
      {
        en: "Tolong jalan pelan-pelan, jalannya licin.",
        vi: "Làm ơn đi từ từ thôi, đường trơn.",
        pronunciation_focus: [
          "TO-long JA-lan pe-LAN-pe-LAN, JA-lan-nya LI-cin — `pelan-pelan` = từ từ; lặp tính từ làm dịu/nhấn.",
          "Mẹo: lặp tính từ/trạng từ KHÔNG báo số nhiều — nó làm 'nhẹ nhàng/đều đều': `pelan` (chậm) → `pelan-pelan` (từ từ, thong thả).",
          "Lỗi người Việt: tưởng `pelan-pelan` là 'nhiều chậm'. Không — nghĩa là 'cứ chậm rãi mà làm'.",
          "Luyện: `Jalan pelan-pelan saja.`",
        ],
        pronunciation_focus_en: [
          "TO-long JA-lan pe-LAN-pe-LAN, JA-lan-nya LI-cin — `pelan-pelan` = slowly; doubling an adjective softens/intensifies.",
          "Tip: doubling an adjective/adverb does NOT mark plural — it means 'gently / steadily': `pelan` (slow) → `pelan-pelan` (nice and slowly).",
          "VN-speaker trap: reading `pelan-pelan` as 'many slow'. No — it means 'just take it slow'.",
          "Drill: `Jalan pelan-pelan saja.`",
        ],
      },
      {
        en: "Hati-hati di jalan, ya!",
        vi: "Đi đường cẩn thận nhé!",
        pronunciation_focus: [
          "HA-ti-HA-ti di JA-lan, ya — `hati-hati` = cẩn thận; từ gốc `hati` (lòng/tim) nhưng lặp lại thành 'cẩn thận'.",
          "Mẹo: vài từ láy đã 'đông cứng' thành từ riêng — `hati-hati` không còn nghĩa 'nhiều tim', mà = 'cẩn thận'. Học cả cụm.",
          "Lỗi người Việt: tách nghĩa từng vế. `hati-hati` là một đơn vị cố định, nghĩa 'cẩn thận'.",
          "Luyện: `Hati-hati di jalan, ya!`",
        ],
        pronunciation_focus_en: [
          "HA-ti-HA-ti di JA-lan, ya — `hati-hati` = be careful; the root `hati` (heart) but doubled it means 'careful'.",
          "Tip: some reduplications have 'frozen' into their own words — `hati-hati` no longer means 'many hearts', it's 'careful'. Learn it whole.",
          "VN-speaker trap: decoding each half. `hati-hati` is one fixed unit meaning 'careful'.",
          "Drill: `Hati-hati di jalan, ya!`",
        ],
      },
      // ── 3. Sound-changing reduplication (berubah bunyi) ───────────────────
      {
        en: "Di pasar dijual sayur-mayur yang segar.",
        vi: "Ở chợ bán đủ loại rau tươi.",
        pronunciation_focus: [
          "di PA-sar di-JU-al SA-yur-MA-yur yang se-GAR — `sayur-mayur` = đủ thứ rau; vế hai đổi âm đầu (s→m).",
          "Mẹo: từ láy đổi âm (`berubah bunyi`) nghĩa 'đủ loại, nhiều thứ khác nhau': `sayur` (rau) → `sayur-mayur` (rau củ đủ loại).",
          "Lỗi người Việt: cố tìm nghĩa của 'mayur'. `mayur` không có nghĩa riêng — chỉ là vế láy đổi âm.",
          "Luyện: `sayur-mayur` (đủ loại rau).",
        ],
        pronunciation_focus_en: [
          "di PA-sar di-JU-al SA-yur-MA-yur yang se-GAR — `sayur-mayur` = all sorts of vegetables; the 2nd half changes its onset (s→m).",
          "Tip: sound-changing reduplication (`berubah bunyi`) means 'all kinds, a variety': `sayur` (vegetable) → `sayur-mayur` (assorted vegetables).",
          "VN-speaker trap: hunting for a meaning of 'mayur'. `mayur` has no standalone meaning — it's just the echo half.",
          "Drill: `sayur-mayur` (assorted vegetables).",
        ],
      },
      {
        en: "Dia bolak-balik dari rumah ke kantor setiap hari.",
        vi: "Anh ấy đi đi về về giữa nhà và văn phòng mỗi ngày.",
        pronunciation_focus: [
          "DI-a BO-lak-BA-lik da-ri RU-mah ke KAN-tor SE-ti-ap HA-ri — `bolak-balik` = đi đi về về, qua lại.",
          "Mẹo: `bolak-balik` (gốc `balik` = quay lại) đổi âm để chỉ chuyển động lặp đi lặp lại, tới lui.",
          "Lỗi người Việt: nói `balik-balik`. Dạng chuẩn đổi âm là `bolak-balik` — học nguyên cụm.",
          "Luyện: `bolak-balik` (đi đi về về).",
        ],
        pronunciation_focus_en: [
          "DI-a BO-lak-BA-lik da-ri RU-mah ke KAN-tor SE-ti-ap HA-ri — `bolak-balik` = back and forth, to and fro.",
          "Tip: `bolak-balik` (root `balik` = to return) changes sound to mean repeated, to-and-fro motion.",
          "VN-speaker trap: saying `balik-balik`. The standard sound-changed form is `bolak-balik` — learn it whole.",
          "Drill: `bolak-balik` (back and forth).",
        ],
      },
      {
        en: "Bajunya warna-warni, bagus sekali.",
        vi: "Áo của cô ấy nhiều màu sặc sỡ, đẹp lắm.",
        pronunciation_focus: [
          "BA-ju-nya WAR-na-WAR-ni, BA-gus se-KA-li — `warna-warni` = nhiều màu sắc; gốc `warna` (màu), vế hai đổi sang `-warni`.",
          "Mẹo: `warna-warni` = đủ màu/sặc sỡ, một từ láy đổi âm rất hay gặp khi tả màu sắc.",
          "Lỗi người Việt: nói `warna-warna` (chỉ 'các màu'). `warna-warni` mới đúng sắc thái 'rực rỡ nhiều màu'.",
          "Luyện: `Bajunya warna-warni.`",
        ],
        pronunciation_focus_en: [
          "BA-ju-nya WAR-na-WAR-ni, BA-gus se-KA-li — `warna-warni` = colorful/multicolored; root `warna` (color), 2nd half → `-warni`.",
          "Tip: `warna-warni` = multicolored/vivid, a very common sound-changed reduplication for describing colors.",
          "VN-speaker trap: saying `warna-warna` (just 'colors'). `warna-warni` carries the 'vivid, many-colored' nuance.",
          "Drill: `Bajunya warna-warni.`",
        ],
      },
      // ── 4. Affixed reduplication (berimbuhan) ─────────────────────────────
      {
        en: "Adik saya suka main mobil-mobilan.",
        vi: "Em tôi thích chơi xe hơi đồ chơi.",
        pronunciation_focus: [
          "A-dik SA-ya SU-ka MA-in mo-BIL-mo-bi-LAN — `mobil-mobilan` = xe đồ chơi; lặp + hậu tố `-an` = 'đồ giống như'.",
          "Mẹo: lặp + `-an` tạo nghĩa 'đồ chơi/mô phỏng': `mobil` (xe) → `mobil-mobilan` (xe đồ chơi); `kuda` → `kuda-kudaan` (ngựa giả/cưỡi ngựa nhựa).",
          "Lỗi người Việt: bỏ `-an`, nói `mobil-mobil` (= nhiều xe thật). Có `-an` mới thành 'đồ chơi'.",
          "Luyện: `main mobil-mobilan` (chơi xe đồ chơi).",
        ],
        pronunciation_focus_en: [
          "A-dik SA-ya SU-ka MA-in mo-BIL-mo-bi-LAN — `mobil-mobilan` = toy car; doubling + suffix `-an` = 'a thing resembling'.",
          "Tip: doubling + `-an` gives 'toy/imitation': `mobil` (car) → `mobil-mobilan` (toy car); `kuda` → `kuda-kudaan` (hobby-horse).",
          "VN-speaker trap: dropping `-an` and saying `mobil-mobil` (= many real cars). The `-an` is what makes it a 'toy'.",
          "Drill: `main mobil-mobilan` (play with a toy car).",
        ],
      },
      {
        en: "Gaya bicaranya kebarat-baratan.",
        vi: "Cách nói chuyện của anh ấy hơi 'Tây Tây'.",
        pronunciation_focus: [
          "GA-ya bi-ca-RA-nya ke-BA-rat-ba-RA-tan — `kebarat-baratan` = kiểu phương Tây, 'Tây hóa nhẹ'; khung `ke-...-an` + lặp.",
          "Mẹo: lặp + `ke-...-an` = '...-ish, hơi hướng': `barat` (phương Tây) → `kebarat-baratan` (hơi Tây); `kekanak-kanakan` (trẻ con, ấu trĩ).",
          "Lỗi người Việt: `c` trong `bicaranya` đọc 'ch' → 'bi-CHA-ra-nya'.",
          "Luyện: `Gayanya kebarat-baratan.`",
        ],
        pronunciation_focus_en: [
          "GA-ya bi-ca-RA-nya ke-BA-rat-ba-RA-tan — `kebarat-baratan` = Western-ish; the `ke-...-an` frame + doubling.",
          "Tip: doubling + `ke-...-an` = '-ish, leaning toward': `barat` (West) → `kebarat-baratan` (Westernized-ish); `kekanak-kanakan` (childish).",
          "VN-speaker trap: `c` in `bicaranya` is 'ch' → 'bi-CHA-ra-nya'.",
          "Drill: `Gayanya kebarat-baratan.`",
        ],
      },
      // ── 5. Frozen lexical reduplication (one word now) ────────────────────
      {
        en: "Mata-mata itu menyamar jadi turis biasa.",
        vi: "Gián điệp đó cải trang thành khách du lịch bình thường.",
        pronunciation_focus: [
          "MA-ta-MA-ta I-tu me-nya-MAR JA-di TU-ris BI-a-sa — `mata-mata` = gián điệp, KHÔNG phải 'nhiều con mắt'.",
          "Mẹo CẢNH BÁO: nhiều từ láy đổi NGHĨA, không chỉ số nhiều: `mata` (mắt) → `mata-mata` (gián điệp); `kupu` → `kupu-kupu` (bươm bướm); `laki` → `laki-laki` (đàn ông).",
          "Lỗi người Việt: dịch máy móc từng vế. Phải nhận diện từ láy 'đông cứng' và học như từ vựng mới.",
          "Luyện: `mata-mata` = gián điệp (≠ nhiều mắt).",
        ],
        pronunciation_focus_en: [
          "MA-ta-MA-ta I-tu me-nya-MAR JA-di TU-ris BI-a-sa — `mata-mata` = a spy, NOT 'many eyes'.",
          "WARNING tip: many reduplications change MEANING, not just number: `mata` (eye) → `mata-mata` (spy); `kupu` → `kupu-kupu` (butterfly); `laki` → `laki-laki` (man).",
          "VN-speaker trap: decoding each half. You must recognize 'frozen' reduplications and learn them as new vocabulary.",
          "Drill: `mata-mata` = spy (≠ many eyes).",
        ],
      },
      // ── 6. Reciprocal / repeated action verbs ─────────────────────────────
      {
        en: "Kami sering tolong-menolong kalau ada masalah.",
        vi: "Chúng tôi hay giúp đỡ qua lại lẫn nhau khi có vấn đề.",
        pronunciation_focus: [
          "KA-mi SE-ring TO-long-me-NO-long KA-lau A-da ma-SA-lah — `tolong-menolong` = giúp đỡ lẫn nhau; lặp + affix = hành động qua lại.",
          "Mẹo: lặp động từ (vế hai có meN-) chỉ hành động TƯƠNG HỖ: `tolong` → `tolong-menolong` (giúp nhau); `maaf` → `maaf-memaafkan` (tha thứ cho nhau).",
          "Lỗi người Việt: dùng `saling` rồi vẫn lặp đủ kiểu. `saling membantu` HOẶC `tolong-menolong` — đừng ghép `saling tolong-menolong` thừa.",
          "Luyện: `Kami sering tolong-menolong.`",
        ],
        pronunciation_focus_en: [
          "KA-mi SE-ring TO-long-me-NO-long KA-lau A-da ma-SA-lah — `tolong-menolong` = help one another; doubling + affix = reciprocal action.",
          "Tip: doubling a verb (2nd half takes meN-) marks a RECIPROCAL action: `tolong` → `tolong-menolong` (help each other); `maaf` → `maaf-memaafkan` (forgive each other).",
          "VN-speaker trap: using `saling` and still doubling. Use `saling membantu` OR `tolong-menolong` — don't pile up `saling tolong-menolong`.",
          "Drill: `Kami sering tolong-menolong.`",
        ],
      },
    ],
    vocabulary: [
      // Type 1 — plural / full doubling
      {
        cell_id: "09d1b63b-4b52-4c23-bccc-cc071e4dbb8c",
        word: "orang-orang",
        en: "people (plural)",
        vi: "mọi người",
        pos: "noun (reduplicated)",
        pronunciation_vi: "O-rang-O-rang — số nhiều của `orang`; KHÔNG dùng sau số đếm",
        pronunciation_en: "O-rang-O-rang — plural of `orang`; NOT used after a number",
      },
      {
        cell_id: "95f873e5-81b4-4548-930c-6bbbd13ac754",
        word: "anak-anak",
        en: "children",
        vi: "bọn trẻ",
        pos: "noun (reduplicated)",
        pronunciation_vi: "A-nak-A-nak — số nhiều của `anak`; bật `k` cuối",
        pronunciation_en: "A-nak-A-nak — plural of `anak`; release the final `k`",
      },
      {
        cell_id: "5d51b1f0-e371-4f49-83de-fbf1d00a5239",
        word: "buku-buku",
        en: "books (various)",
        vi: "(nhiều) sách",
        pos: "noun (reduplicated)",
        pronunciation_vi: "BU-ku-BU-ku — số nhiều của `buku`; `dua buku` thì KHÔNG lặp",
        pronunciation_en: "BU-ku-BU-ku — plural of `buku`; with `dua buku` do NOT double",
      },
      // Type 2 — intensified adj/adverb
      {
        cell_id: "cf190a3a-5fd4-4a0a-950c-0b740d34f443",
        word: "pelan-pelan",
        en: "slowly / gently",
        vi: "từ từ",
        pos: "adverb (reduplicated)",
        pronunciation_vi: "pe-LAN-pe-LAN — làm dịu, KHÔNG phải số nhiều",
        pronunciation_en: "pe-LAN-pe-LAN — softens/eases; not a plural",
      },
      {
        cell_id: "02ea036f-7db9-4f09-a774-ecc7667728d2",
        word: "hati-hati",
        en: "careful / be careful",
        vi: "cẩn thận",
        pos: "adj./interjection (frozen)",
        pronunciation_vi: "HA-ti-HA-ti — cụm cố định = 'cẩn thận', không phải 'nhiều tim'",
        pronunciation_en: "HA-ti-HA-ti — fixed phrase = 'careful', not 'many hearts'",
      },
      {
        cell_id: "6c2bcfb9-b6f8-4582-b6d7-4e513d5cf9b7",
        word: "diam-diam",
        en: "secretly / quietly",
        vi: "lén lút / âm thầm",
        pos: "adverb (reduplicated)",
        pronunciation_vi: "DI-am-DI-am — `diam` (im lặng) → `diam-diam` (lặng lẽ, lén)",
        pronunciation_en: "DI-am-DI-am — `diam` (silent) → `diam-diam` (quietly, secretly)",
      },
      // Type 3 — sound-changing
      {
        cell_id: "8f340213-f0e2-4d25-9a64-1775f1183b8d",
        word: "sayur-mayur",
        en: "assorted vegetables",
        vi: "rau củ đủ loại",
        pos: "noun (sound-changed)",
        pronunciation_vi: "SA-yur-MA-yur — vế hai đổi âm; nghĩa 'đủ loại rau'",
        pronunciation_en: "SA-yur-MA-yur — 2nd half changes sound; 'all kinds of vegetables'",
      },
      {
        cell_id: "4157068a-e9f0-4715-b1f9-18d5460dfa0d",
        word: "bolak-balik",
        en: "back and forth",
        vi: "đi đi về về",
        pos: "adverb (sound-changed)",
        pronunciation_vi: "BO-lak-BA-lik — gốc `balik` (quay lại); chuyển động tới lui",
        pronunciation_en: "BO-lak-BA-lik — root `balik` (return); to-and-fro motion",
      },
      {
        cell_id: "8eb1b380-409f-4a70-8497-ef27abd59405",
        word: "warna-warni",
        en: "multicolored / colorful",
        vi: "nhiều màu sặc sỡ",
        pos: "adj. (sound-changed)",
        pronunciation_vi: "WAR-na-WAR-ni — gốc `warna` (màu); rực rỡ nhiều màu",
        pronunciation_en: "WAR-na-WAR-ni — root `warna` (color); vivid, many-colored",
      },
      {
        cell_id: "17e889e7-78b5-4f46-a0b8-2d754543c382",
        word: "lauk-pauk",
        en: "assorted side dishes",
        vi: "thức ăn (món mặn) đủ loại",
        pos: "noun (sound-changed)",
        pronunciation_vi: "LA-uk-PA-uk — gốc `lauk` (món ăn kèm cơm); đủ món",
        pronunciation_en: "LA-uk-PA-uk — root `lauk` (dish eaten with rice); assorted dishes",
      },
      {
        cell_id: "c02db416-ea46-494c-a21a-826449884c8c",
        word: "gotong-royong",
        en: "communal mutual help",
        vi: "tương trợ cộng đồng",
        pos: "noun (sound-changed)",
        pronunciation_vi: "go-tong-RO-yong — từ láy đã thành khái niệm văn hóa cốt lõi",
        pronunciation_en: "go-tong-RO-yong — a reduplication frozen into a core cultural concept",
      },
      // Type 4 — affixed
      {
        cell_id: "16d2853a-7792-4734-8781-4e2fcf7cccd7",
        word: "mobil-mobilan",
        en: "toy car",
        vi: "xe hơi đồ chơi",
        pos: "noun (doubled + -an)",
        pronunciation_vi: "mo-BIL-mo-bi-LAN — lặp + `-an` = 'đồ giống như'; xe đồ chơi",
        pronunciation_en: "mo-BIL-mo-bi-LAN — doubling + `-an` = 'thing resembling'; a toy car",
      },
      {
        cell_id: "156662e5-f9a5-4a73-9d46-65688162745a",
        word: "kebarat-baratan",
        en: "Westernized / Western-ish",
        vi: "hơi hướng phương Tây",
        pos: "adj. (ke-...-an + doubling)",
        pronunciation_vi: "ke-BA-rat-ba-RA-tan — `barat` (Tây) + khung lặp `ke-...-an`",
        pronunciation_en: "ke-BA-rat-ba-RA-tan — `barat` (West) + the `ke-...-an` doubling frame",
      },
      // Type 5 — frozen / lexicalized (meaning-changing)
      {
        cell_id: "d26d31bb-ac85-4f00-b3f7-478ef64c3e91",
        word: "laki-laki",
        en: "man / male",
        vi: "đàn ông / nam",
        pos: "noun (frozen)",
        pronunciation_vi: "LA-ki-LA-ki — luôn ở dạng lặp; `laki` đơn nghĩa khác (chồng)",
        pronunciation_en: "LA-ki-LA-ki — always doubled; bare `laki` means something else (husband)",
      },
      {
        cell_id: "b759e25d-3d2a-4bc6-8d21-7e86802ece2e",
        word: "kupu-kupu",
        en: "butterfly",
        vi: "bươm bướm",
        pos: "noun (frozen)",
        pronunciation_vi: "KU-pu-KU-pu — chỉ tồn tại ở dạng lặp; không có `kupu` đơn",
        pronunciation_en: "KU-pu-KU-pu — exists only doubled; no standalone `kupu`",
      },
      {
        cell_id: "dabeec5b-cbf6-4d27-9e47-4b8c431bd4fa",
        word: "mata-mata",
        en: "spy / secret agent",
        vi: "gián điệp",
        pos: "noun (frozen)",
        pronunciation_vi: "MA-ta-MA-ta — nghĩa ĐỔI: gián điệp, không phải 'nhiều mắt'",
        pronunciation_en: "MA-ta-MA-ta — meaning SHIFTS: a spy, not 'many eyes'",
      },
      {
        cell_id: "73c0cee0-4c85-4a25-a8e2-b378fb82de6a",
        word: "tiba-tiba",
        en: "suddenly",
        vi: "đột nhiên",
        pos: "adverb (frozen)",
        pronunciation_vi: "TI-ba-TI-ba — cụm cố định = 'bỗng nhiên'",
        pronunciation_en: "TI-ba-TI-ba — fixed phrase = 'suddenly'",
      },
      {
        cell_id: "0b5e5137-1f2c-4a99-ac24-c752cd4a0905",
        word: "tiba-tiba / kira-kira",
        en: "suddenly / approximately",
        vi: "đột nhiên / khoảng chừng",
        pos: "adverb (frozen)",
        pronunciation_vi: "KI-ra-KI-ra — `kira` (đoán) → `kira-kira` (khoảng, áng chừng)",
        pronunciation_en: "KI-ra-KI-ra — `kira` (to guess) → `kira-kira` (about, roughly)",
      },
      // Type 6 — reciprocal verbs
      {
        cell_id: "d705132e-3d1b-4016-831f-03718f100fea",
        word: "tolong-menolong",
        en: "to help one another",
        vi: "giúp đỡ lẫn nhau",
        pos: "verb (reciprocal reduplication)",
        pronunciation_vi: "TO-long-me-NO-long — vế hai có meN-; hành động qua lại",
        pronunciation_en: "TO-long-me-NO-long — 2nd half takes meN-; a reciprocal action",
      },
      {
        cell_id: "78fc623c-c704-4edb-a46f-eb19a679e3e5",
        word: "kejar-kejaran",
        en: "to chase each other",
        vi: "rượt đuổi nhau",
        pos: "verb (reciprocal reduplication)",
        pronunciation_vi: "ke-JAR-ke-ja-RAN — gốc `kejar` (đuổi); lặp + `-an` qua lại",
        pronunciation_en: "ke-JAR-ke-ja-RAN — root `kejar` (chase); doubling + `-an`, reciprocal",
      },
    ],
    dialogue: [
      // Two friends at a market — reduplication used naturally
      {
        cell_id: "5d89b40f-f0ea-4ed5-b714-337cdb0031d3",
        speaker: "Mai",
        text: "Wah, pasarnya ramai sekali. Orang-orang banyak banget!",
        vi: "Ồ, chợ đông quá. Người đông ơi là đông!",
        en: "Wow, the market is so busy. There are tons of people!",
      },
      {
        cell_id: "74de5fc0-66c3-406b-a426-7f537f58505f",
        speaker: "Sari",
        text: "Iya, hati-hati ya, dompetmu jangan sampai hilang.",
        vi: "Ừ, cẩn thận nhé, đừng để mất ví đấy.",
        en: "Yeah, be careful, don't let your wallet go missing.",
      },
      {
        cell_id: "664cc668-9ab5-4b87-b9ef-6f5d02da5ea7",
        speaker: "Mai",
        text: "Aku mau beli sayur-mayur untuk masak nanti malam.",
        vi: "Mình muốn mua rau củ đủ loại để nấu tối nay.",
        en: "I want to buy assorted vegetables to cook tonight.",
      },
      {
        cell_id: "aa84825f-e6ca-4532-9a09-218fa60fef10",
        speaker: "Sari",
        text: "Beli dua ikat saja, jangan banyak-banyak nanti busuk.",
        vi: "Mua hai bó thôi, đừng nhiều quá kẻo hỏng.",
        en: "Just buy two bunches, not too much or it'll spoil.",
      },
      {
        cell_id: "6090e33e-5f23-4d55-a833-9bec20b873db",
        speaker: "Mai",
        text: "Hahaha betul. Eh, lihat baju itu, warna-warni bagus ya?",
        vi: "Haha đúng đó. Ê, nhìn cái áo kia kìa, nhiều màu đẹp nhỉ?",
        en: "Hahaha true. Hey, look at that shirt, colorful and nice, right?",
      },
      {
        cell_id: "f208ca8d-3b36-4253-a3c5-ff0c4c6dce73",
        speaker: "Sari",
        text: "Bagus! Tapi kita sudah bolak-balik dari tadi, capek. Pelan-pelan saja.",
        vi: "Đẹp đấy! Nhưng mình đi đi lại lại nãy giờ rồi, mệt. Cứ từ từ thôi.",
        en: "Nice! But we've been going back and forth for a while, I'm tired. Let's take it slow.",
      },
      {
        cell_id: "f4aca941-b3dd-4439-ae7c-368fe461a980",
        speaker: "Mai",
        text: "Oke. Untung ada kamu, kita memang harus tolong-menolong.",
        vi: "Được. May có cậu, đúng là tụi mình phải giúp đỡ lẫn nhau.",
        en: "Okay. Lucky to have you — we really do help each other out.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia (chú ý dùng từ láy đúng):",
        instruction_en: "Translate into Indonesian (use the right reduplication):",
        items: [
          { prompt: "Mọi người đã tụ tập rồi.", answer: "Orang-orang sudah berkumpul." },
          { prompt: "Đi đường cẩn thận nhé!", answer: "Hati-hati di jalan, ya!" },
          { prompt: "Làm ơn đi từ từ thôi.", answer: "Tolong jalan pelan-pelan." },
          { prompt: "Ở chợ bán đủ loại rau.", answer: "Di pasar dijual sayur-mayur." },
          { prompt: "Chúng tôi hay giúp đỡ lẫn nhau.", answer: "Kami sering tolong-menolong." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Indonesia:",
        instruction_en: "Extra practice — translate into Indonesian:",
        items: [
          { prompt: "Có hai người ở phía trước.", answer: "Ada dua orang di depan." },
          { prompt: "Bọn trẻ đang chơi ở công viên.", answer: "Anak-anak sedang bermain di taman." },
          { prompt: "Em tôi thích chơi xe đồ chơi.", answer: "Adik saya suka main mobil-mobilan." },
          { prompt: "Áo nhiều màu sặc sỡ đẹp lắm.", answer: "Bajunya warna-warni, bagus sekali." },
          { prompt: "Anh ấy đi đi về về mỗi ngày.", answer: "Dia bolak-balik setiap hari." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "QUY TẮC VÀNG — có số đếm thì KHÔNG lặp. Chọn dạng đúng:",
        instruction_en:
          "GOLDEN RULE — with a number, do NOT double. Pick the correct form:",
        items: [
          { prompt: "Ada banyak ___ di sini. (người)", answer: "orang", hint: "đã có `banyak` → KHÔNG lặp" },
          { prompt: "___ sudah pulang semua. (mọi người, không số đếm)", answer: "Orang-orang", hint: "không có số → lặp để báo số nhiều" },
          { prompt: "Saya punya tiga ___. (cuốn sách)", answer: "buku", hint: "có `tiga` → KHÔNG lặp" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn đúng kiểu từ láy theo nghĩa (số nhiều / làm dịu / đủ loại / đồ chơi):",
        instruction_en:
          "Choose the right reduplication by meaning (plural / softened / variety / toy):",
        items: [
          { prompt: "Jalan ___ saja, jangan terburu-buru. (từ từ)", answer: "pelan-pelan", hint: "lặp tính từ = làm dịu" },
          { prompt: "Di pasar ada ___ segar. (rau đủ loại)", answer: "sayur-mayur", hint: "đổi âm = đủ loại" },
          { prompt: "Adik main ___. (xe đồ chơi)", answer: "mobil-mobilan", hint: "lặp + -an = đồ chơi" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ láy 'đông cứng' với nghĩa thật (đừng dịch từng vế):",
        instruction_en: "Match the frozen reduplication with its real meaning (don't decode each half):",
        pairs: [
          ["mata-mata", "gián điệp (spy)"],
          ["kupu-kupu", "bươm bướm (butterfly)"],
          ["laki-laki", "đàn ông (man)"],
          ["tiba-tiba", "đột nhiên (suddenly)"],
          ["hati-hati", "cẩn thận (careful)"],
        ],
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra — bạn nắm từ láy chưa?",
        instruction_en: "Self-check — do you control reduplication?",
        items: [
          { vi: "Tôi biết lặp danh từ để báo số nhiều (`orang-orang`).", en: "I can double a noun for plural (`orang-orang`)." },
          { vi: "Tôi biết KHÔNG lặp sau số đếm/`banyak` (`dua orang`).", en: "I know NOT to double after a number/`banyak` (`dua orang`)." },
          { vi: "Tôi hiểu lặp tính từ là làm dịu, không phải số nhiều.", en: "I understand doubling an adjective softens, not pluralizes." },
          { vi: "Tôi nhận ra từ láy đổi âm = đủ loại (`sayur-mayur`).", en: "I recognize sound-changed reduplication = variety (`sayur-mayur`)." },
          { vi: "Tôi dùng lặp + `-an` cho đồ chơi (`mobil-mobilan`).", en: "I use doubling + `-an` for toys (`mobil-mobilan`)." },
          { vi: "Tôi học từ láy 'đông cứng' như từ vựng (`mata-mata` = gián điệp).", en: "I learn frozen reduplications as vocabulary (`mata-mata` = spy)." },
        ],
      },
    ],
    cultural_notes_vi:
      "Người Việt có lợi thế tâm lý lớn ở chủ đề này: tiếng Việt cũng đầy 'từ láy' (lấp lánh, xanh xao, đi đi lại lại), nên ý tưởng 'lặp để tạo sắc thái' không hề xa lạ. Nhưng CHỨC NĂNG khác nhau, nên đừng suy bụng ta ra bụng người. Khác biệt cốt lõi: trong tiếng Indonesia, lặp danh từ là một cách ngữ pháp để báo SỐ NHIỀU (`orang-orang` = mọi người) — điều tiếng Việt không làm (tiếng Việt báo số nhiều bằng 'những/các'). Và quy tắc quan trọng nhất: khi đã có số đếm hay `banyak`, danh từ KHÔNG lặp (`dua orang`, không phải `dua orang-orang`). Ngoài số nhiều, lặp còn để: làm dịu/nhấn (`pelan-pelan`), chỉ 'đủ loại' qua đổi âm (`sayur-mayur`), tạo 'đồ chơi' với `-an` (`mobil-mobilan`), và chỉ hành động qua lại (`tolong-menolong`). Cuối cùng, cảnh giác với từ láy 'đông cứng' đã đổi nghĩa hẳn — `mata-mata` (gián điệp), `kupu-kupu` (bươm bướm) — phải học như từ vựng mới.",
    cultural_notes_en:
      "Vietnamese speakers have a real head start here: Vietnamese is itself full of 'từ láy' (reduplicatives like lấp lánh, xanh xao, đi đi lại lại), so the idea of 'doubling to add nuance' feels natural. But the FUNCTIONS differ, so don't assume. The core difference: in Indonesian, doubling a noun is a grammatical way to mark PLURAL (`orang-orang` = people) — something Vietnamese doesn't do (Vietnamese uses 'những/các'). And the single most important rule: once there's a number or `banyak`, the noun does NOT double (`dua orang`, not `dua orang-orang`). Beyond plurals, doubling also: softens/intensifies (`pelan-pelan`), signals 'all kinds' via sound change (`sayur-mayur`), makes 'toys' with `-an` (`mobil-mobilan`), and marks reciprocal actions (`tolong-menolong`). Finally, watch for 'frozen' reduplications that have fully shifted meaning — `mata-mata` (spy), `kupu-kupu` (butterfly) — which must be learned as fresh vocabulary.",
    tip_advice_vi:
      "Học từ láy theo SÁU nhóm chức năng, đừng học lẻ tẻ: (1) lặp đầy đủ = số nhiều — `orang-orang` [nhưng KHÔNG lặp sau số: `dua orang`]; (2) lặp tính từ/trạng từ = làm dịu/đều — `pelan-pelan`, `diam-diam`; (3) đổi âm = đủ loại/qua lại — `sayur-mayur`, `bolak-balik`, `warna-warni`; (4) lặp + `-an` = đồ chơi/mô phỏng — `mobil-mobilan`; lặp + `ke-...-an` = 'hơi hướng' — `kebarat-baratan`; (5) 'đông cứng' đổi nghĩa — `mata-mata`, `laki-laki`, `kupu-kupu` (học như từ vựng); (6) lặp động từ + meN- = tương hỗ — `tolong-menolong`. NHỚ quy tắc vàng số một: SỐ ĐẾM giết phép lặp số nhiều. Mẹo phát âm: viết có dấu gạch nối, nhưng đọc liền hai vế, nhấn như hai từ riêng.",
    tip_advice_en:
      "Learn reduplication by its SIX functions, not word by word: (1) full doubling = plural — `orang-orang` [but NOT after a number: `dua orang`]; (2) doubled adjective/adverb = softened/steady — `pelan-pelan`, `diam-diam`; (3) sound-changing = variety/to-and-fro — `sayur-mayur`, `bolak-balik`, `warna-warni`; (4) doubling + `-an` = toy/imitation — `mobil-mobilan`; doubling + `ke-...-an` = '-ish' — `kebarat-baratan`; (5) frozen, meaning-shifted — `mata-mata`, `laki-laki`, `kupu-kupu` (learn as vocabulary); (6) doubled verb + meN- = reciprocal — `tolong-menolong`. Burn in the golden rule: a NUMBER kills the plural doubling. Pronunciation tip: it's written with a hyphen, but say both halves smoothly, stressing each like its own word.",
  },
];

export default lessons;
