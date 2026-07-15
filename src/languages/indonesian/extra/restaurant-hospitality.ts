// Restaurant & Hospitality Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling Italian `extra/*` files (which in turn mirror the
// French `FrenchLesson` shape). When the shared Indonesian registry
// (src/languages/indonesian/lessons.ts) lands, swap the local types for a shared
// import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// Hospitality-specific Vietnamese WINS: no verb conjugation, no honorific verb
// endings (unlike Japanese/Korean) — politeness comes from `Pak`/`Bu`/`Mas`/`Mbak`
// address + `silakan`/`maaf`/`tolong`. Traps: `c` = "ch" (`cuci` = "chu-chi"),
// `e` is often a schwa ("ơ"), and the affix system (meN-, -kan).

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
    id: "indonesian_restaurant_hospitality",
    level: "A2",
    category: "work_hospitality",
    title_vi: "Tiếng Indonesia cho công việc nhà hàng và khách sạn",
    title_en: "Restaurant and hospitality Indonesian",
    sentences: [
      // ── Greeting & seating guests ──────────────────────────────────────
      {
        en: "Selamat datang. Untuk berapa orang?",
        vi: "Chào mừng quý khách. Cho mấy người ạ?",
        pronunciation_focus: [
          "se-la-MAT da-TANG — `selamat datang` = chào mừng; `berapa orang` = mấy người.",
          "Lỗi người Việt: nói `untuk berapa?` cụt lủn. Thêm `orang` (người) cho rõ và lịch sự.",
          "Luyện: `Selamat datang. Untuk berapa orang?`",
        ],
        pronunciation_focus_en: [
          "se-la-MAT da-TANG — `selamat datang` = welcome; `berapa orang` = how many people.",
          "VN-speaker trap: clipping to `untuk berapa?`. Add `orang` (people) to sound complete and polite.",
          "Drill: `Selamat datang. Untuk berapa orang?`",
        ],
      },
      {
        en: "Silakan duduk di sini.",
        vi: "Mời quý khách ngồi đây.",
        pronunciation_focus: [
          "si-LA-kan DU-duk di SI-ni — `silakan` = mời (lời mời lịch sự cốt lõi của ngành dịch vụ).",
          "Lỗi người Việt: viết/đọc `silahkan`. Chính tả chuẩn là `silakan` (không có `h`).",
          "Luyện: `Silakan duduk di sini.`",
        ],
        pronunciation_focus_en: [
          "si-LA-kan DU-duk di SI-ni — `silakan` = please/go ahead (the core service-industry invitation).",
          "VN-speaker trap: the common misspelling `silahkan`. The standard form is `silakan` (no `h`).",
          "Drill: `Silakan duduk di sini.`",
        ],
      },
      {
        en: "Apakah Bapak/Ibu sudah memesan?",
        vi: "Anh/chị đã gọi món chưa ạ?",
        pronunciation_focus: [
          "a-pa-KAH ... su-DAH me-me-SAN — `memesan` = gọi món (gốc `pesan` + tiền tố `meN-`).",
          "Lỗi người Việt: dùng `kamu`. Với khách phải dùng `Bapak` (ông/anh) hoặc `Ibu` (bà/chị), không bao giờ `kamu`.",
          "Luyện: `Apakah Bapak sudah memesan?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH ... su-DAH me-me-SAN — `memesan` = to order (root `pesan` + prefix `meN-`).",
          "VN-speaker trap: using `kamu` with a guest. Always `Bapak` (sir) or `Ibu` (ma'am), never `kamu`.",
          "Drill: `Apakah Bapak sudah memesan?`",
        ],
      },
      {
        en: "Mau pesan apa?",
        vi: "Quý khách muốn gọi món gì ạ?",
        pronunciation_focus: [
          "mau pe-SAN A-pa — `mau` = muốn; `pesan` = đặt/gọi món; câu khẩu ngữ ngắn gọn.",
          "Lợi thế người Việt: `mau` + động từ y như 'muốn' tiếng Việt — không chia gì cả.",
          "Luyện: `Mau pesan apa?`",
        ],
        pronunciation_focus_en: [
          "mau pe-SAN A-pa — `mau` = want; `pesan` = to order; the short colloquial form.",
          "VN-speaker win: `mau` + verb maps straight onto 'muốn' — nothing to conjugate.",
          "Drill: `Mau pesan apa?`",
        ],
      },
      // ── Taking the order ───────────────────────────────────────────────
      {
        en: "Mau minum apa?",
        vi: "Quý khách muốn uống gì ạ?",
        pronunciation_focus: [
          "mau MI-num A-pa — `minum` = uống; `makan` = ăn — đừng lẫn hai từ.",
          "Lỗi người Việt: nói `mau minuman?` (danh từ). Hỏi hành động thì dùng động từ `minum`.",
          "Luyện: `Mau minum apa?`",
        ],
        pronunciation_focus_en: [
          "mau MI-num A-pa — `minum` = to drink; `makan` = to eat — keep them apart.",
          "VN-speaker trap: `mau minuman?` (the noun). To ask the action, use the verb `minum`.",
          "Drill: `Mau minum apa?`",
        ],
      },
      {
        en: "Mau pedas atau tidak?",
        vi: "Quý khách ăn cay hay không cay ạ?",
        pronunciation_focus: [
          "mau pe-DAS A-tau TI-dak — `pedas` = cay; `atau` = hay/hoặc; câu hỏi lựa chọn quan trọng ở Indonesia.",
          "Lỗi người Việt: nói `atau no`. Phủ định trong câu hỏi lựa chọn là `atau tidak`.",
          "Luyện: `Mau pedas atau tidak?`",
        ],
        pronunciation_focus_en: [
          "mau pe-DAS A-tau TI-dak — `pedas` = spicy; `atau` = or; a must-ask choice in Indonesia.",
          "VN-speaker trap: saying `atau no`. The negative in a choice question is `atau tidak`.",
          "Drill: `Mau pedas atau tidak?`",
        ],
      },
      {
        en: "Maaf, menu ini sedang habis.",
        vi: "Xin lỗi, món này hiện đã hết.",
        pronunciation_focus: [
          "ma-AF ... se-DANG HA-bis — `habis` = hết; `sedang` = đang (đánh dấu tạm thời).",
          "Lỗi người Việt: nói `tidak ada` cho mọi trường hợp. Hết hàng tạm thời nói `sedang habis` mới tự nhiên.",
          "Luyện: `Maaf, menu ini sedang habis.`",
        ],
        pronunciation_focus_en: [
          "ma-AF ... se-DANG HA-bis — `habis` = sold out/finished; `sedang` = currently (temporary marker).",
          "VN-speaker trap: defaulting to `tidak ada`. For 'temporarily out', `sedang habis` is the natural phrase.",
          "Drill: `Maaf, menu ini sedang habis.`",
        ],
      },
      {
        en: "Saya ulangi pesanannya, ya.",
        vi: "Em xin nhắc lại đơn của quý khách nhé.",
        pronunciation_focus: [
          "SA-ya u-LA-ngi pe-sa-NAN-nya ya — `pesanan` = đơn đặt món (gốc `pesan` + `-an`); `-nya` = 'của khách'.",
          "Lỗi người Việt: nói `pesan` cho cả đơn hàng. Đồ đã gọi (danh từ) là `pesanan`.",
          "Luyện: `Saya ulangi pesanannya, ya.`",
        ],
        pronunciation_focus_en: [
          "SA-ya u-LA-ngi pe-sa-NAN-nya ya — `pesanan` = the order (root `pesan` + `-an`); `-nya` = 'your/the'.",
          "VN-speaker trap: using `pesan` for the whole order. The ordered items (noun) is `pesanan`.",
          "Drill: `Saya ulangi pesanannya, ya.`",
        ],
      },
      {
        en: "Mohon ditunggu sebentar, ya.",
        vi: "Xin quý khách chờ một chút ạ.",
        pronunciation_focus: [
          "MO-hon di-TUNG-gu se-ben-TAR — `mohon` = kính xin (lịch sự hơn `tolong`); `ditunggu` (bị động) = xin được chờ.",
          "Lỗi người Việt: nói `tunggu!` trống không (nghe như ra lệnh). Thêm `mohon` + thể bị động cho lễ phép.",
          "Luyện: `Mohon ditunggu sebentar, ya.`",
        ],
        pronunciation_focus_en: [
          "MO-hon di-TUNG-gu se-ben-TAR — `mohon` = kindly (politer than `tolong`); `ditunggu` (passive) = please wait.",
          "VN-speaker trap: bare `tunggu!` sounds like an order. Add `mohon` + the passive for courtesy.",
          "Drill: `Mohon ditunggu sebentar, ya.`",
        ],
      },
      // ── Serving & checking in ──────────────────────────────────────────
      {
        en: "Ini pesanannya. Selamat menikmati.",
        vi: "Đây là món của quý khách. Chúc ngon miệng.",
        pronunciation_focus: [
          "I-ni pe-sa-NAN-nya. se-la-MAT me-nik-MA-ti — `selamat menikmati` = chúc ngon miệng (câu phục vụ cố định).",
          "Lỗi người Việt: dịch thẳng 'ăn ngon'. Câu chuẩn ngành dịch vụ là `selamat menikmati`.",
          "Luyện: `Ini pesanannya. Selamat menikmati.`",
        ],
        pronunciation_focus_en: [
          "I-ni pe-sa-NAN-nya. se-la-MAT me-nik-MA-ti — `selamat menikmati` = enjoy your meal (the set service phrase).",
          "VN-speaker trap: a literal 'eat well'. The industry-standard phrase is `selamat menikmati`.",
          "Drill: `Ini pesanannya. Selamat menikmati.`",
        ],
      },
      {
        en: "Ada yang bisa saya bantu lagi?",
        vi: "Quý khách cần em giúp gì thêm không ạ?",
        pronunciation_focus: [
          "A-da yang BI-sa SA-ya BAN-tu LA-gi — `ada yang …?` = có gì …?; `bantu` = giúp; `lagi` = nữa.",
          "Lỗi người Việt: nói `saya bisa bantu?`. Mẫu lịch sự đầy đủ là `Ada yang bisa saya bantu?`",
          "Luyện: `Ada yang bisa saya bantu lagi?`",
        ],
        pronunciation_focus_en: [
          "A-da yang BI-sa SA-ya BAN-tu LA-gi — `ada yang …?` = is there anything …?; `bantu` = help; `lagi` = more.",
          "VN-speaker trap: `saya bisa bantu?`. The full polite frame is `Ada yang bisa saya bantu?`",
          "Drill: `Ada yang bisa saya bantu lagi?`",
        ],
      },
      {
        en: "Maaf atas kesalahannya.",
        vi: "Xin lỗi vì sai sót này ạ.",
        pronunciation_focus: [
          "ma-AF A-tas ke-sa-la-HAN-nya — `kesalahan` = lỗi/sai sót (gốc `salah` + khung `ke-...-an`).",
          "Lỗi người Việt: nói `maaf salah`. Danh từ 'sai sót' là `kesalahan`, không phải tính từ `salah`.",
          "Luyện: `Maaf atas kesalahannya.`",
        ],
        pronunciation_focus_en: [
          "ma-AF A-tas ke-sa-la-HAN-nya — `kesalahan` = mistake/error (root `salah` + `ke-...-an` frame).",
          "VN-speaker trap: `maaf salah`. The noun 'mistake' is `kesalahan`, not the adjective `salah`.",
          "Drill: `Maaf atas kesalahannya.`",
        ],
      },
      {
        en: "Saya ganti dengan yang baru.",
        vi: "Em sẽ đổi cái mới cho quý khách.",
        pronunciation_focus: [
          "SA-ya GAN-ti DE-ngan yang BA-ru — `ganti` = đổi/thay; `yang baru` = cái mới.",
          "Lỗi người Việt: bỏ `yang`. 'Cái mới' cần `yang baru`; chỉ `baru` nghĩa là 'vừa mới' (trạng từ).",
          "Luyện: `Saya ganti dengan yang baru.`",
        ],
        pronunciation_focus_en: [
          "SA-ya GAN-ti DE-ngan yang BA-ru — `ganti` = change/replace; `yang baru` = a new one.",
          "VN-speaker trap: dropping `yang`. 'A new one' needs `yang baru`; bare `baru` means 'just now' (adverb).",
          "Drill: `Saya ganti dengan yang baru.`",
        ],
      },
      // ── Payment & farewell ─────────────────────────────────────────────
      {
        en: "Mau bayar tunai atau kartu?",
        vi: "Quý khách thanh toán tiền mặt hay thẻ ạ?",
        pronunciation_focus: [
          "mau BA-yar TU-nai A-tau KAR-tu — `bayar` = trả; `tunai` = tiền mặt; `kartu` = thẻ.",
          "Lỗi người Việt: nói `cash atau card` (chêm tiếng Anh). Từ chuẩn là `tunai` và `kartu`.",
          "Luyện: `Mau bayar tunai atau kartu?`",
        ],
        pronunciation_focus_en: [
          "mau BA-yar TU-nai A-tau KAR-tu — `bayar` = pay; `tunai` = cash; `kartu` = card.",
          "VN-speaker trap: mixing in English `cash`/`card`. The standard words are `tunai` and `kartu`.",
          "Drill: `Mau bayar tunai atau kartu?`",
        ],
      },
      {
        en: "Ini kembaliannya. Terima kasih.",
        vi: "Đây là tiền thối ạ. Cảm ơn quý khách.",
        pronunciation_focus: [
          "I-ni kem-ba-li-AN-nya — `kembalian` = tiền thừa/thối (gốc `kembali` 'trở lại' + `-an`).",
          "Lỗi người Việt: nói `uang kembali` (ổn) nhưng `kembaliannya` mới là từ nhân viên hay dùng.",
          "Luyện: `Ini kembaliannya. Terima kasih.`",
        ],
        pronunciation_focus_en: [
          "I-ni kem-ba-li-AN-nya — `kembalian` = the change (root `kembali` 'to return' + `-an`).",
          "VN-speaker trap: `uang kembali` is okay, but staff usually say `kembaliannya`.",
          "Drill: `Ini kembaliannya. Terima kasih.`",
        ],
      },
      {
        en: "Terima kasih, silakan datang lagi.",
        vi: "Cảm ơn quý khách, hẹn gặp lại ạ.",
        pronunciation_focus: [
          "te-ri-MA KA-sih, si-LA-kan da-TANG LA-gi — câu tiễn khách chuẩn của ngành dịch vụ.",
          "Lỗi người Việt: chỉ nói `terima kasih`. Thêm `silakan datang lagi` để mời quay lại, rất được lòng khách.",
          "Luyện: `Terima kasih, silakan datang lagi.`",
        ],
        pronunciation_focus_en: [
          "te-ri-MA KA-sih, si-LA-kan da-TANG LA-gi — the standard service-industry farewell.",
          "VN-speaker trap: stopping at `terima kasih`. Adding `silakan datang lagi` invites a return and delights guests.",
          "Drill: `Terima kasih, silakan datang lagi.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong ngành dịch vụ Indonesia, cách xưng hô quyết định mức lịch sự — gọi khách là `Bapak`/`Pak` (đàn ông), `Ibu`/`Bu` (phụ nữ lớn tuổi/đã có gia đình), `Mas` (anh trẻ) hay `Mbak` (chị trẻ), TUYỆT ĐỐI không dùng `kamu` với khách. `Silakan` (mời) và `mohon`/`tolong` (xin) là ba từ vàng. Quán bình dân gọi là `warung`; quán cơm tự chọn kiểu Padang gọi là `rumah makan`; nhà hàng lớn là `restoran`. Tiền boa (`tip`) không bắt buộc; nhiều nơi đã tính sẵn `pajak dan layanan` (thuế và phí phục vụ, thường 10% + 11% PPN) trong hóa đơn. Hầu hết món ăn có thể hỏi `pedas atau tidak` (cay hay không) — đây là câu hỏi gần như bắt buộc. Người Indonesia phần lớn theo đạo Hồi, nên nhiều khách ăn `halal` và không uống rượu — đừng mặc nhiên mời đồ có cồn hay thịt heo (`babi`).",
    cultural_notes_en:
      "In Indonesian hospitality, address sets the politeness level — call guests `Bapak`/`Pak` (a man), `Ibu`/`Bu` (an older/married woman), `Mas` (a younger man) or `Mbak` (a younger woman), and NEVER use `kamu` with a guest. `Silakan` (please/go ahead) plus `mohon`/`tolong` (kindly/please) are the three golden words. A humble eatery is a `warung`; a Padang-style serve-yourself rice house is a `rumah makan`; a full restaurant is a `restoran`. Tipping (`tip`) isn't mandatory; many places already add `pajak dan layanan` (tax + service, often 10% service + 11% VAT) to the bill. Almost any dish can be asked about with `pedas atau tidak` (spicy or not) — a near-obligatory question. Most Indonesians are Muslim, so many guests eat `halal` and don't drink alcohol — don't assume they want alcohol or pork (`babi`).",
    tip_advice_vi:
      "Học thuộc vòng phục vụ: (1) đón + mời ngồi — `Selamat datang. Silakan duduk.`; (2) hỏi món + đồ uống — `Mau pesan/minum apa?`; (3) hỏi độ cay — `Pedas atau tidak?`; (4) nhắc đơn — `Saya ulangi pesanannya, ya.`; (5) bưng món — `Selamat menikmati.`; (6) thanh toán + tiễn khách — `Tunai atau kartu?` ... `Silakan datang lagi.` Luôn xưng hô `Pak/Bu/Mas/Mbak`, không bao giờ `kamu`. Nhớ phân biệt động từ/danh từ qua đuôi `-an`: `pesan` (gọi) → `pesanan` (đơn), `salah` (sai) → `kesalahan` (sai sót), `kembali` (trở lại) → `kembalian` (tiền thối).",
    tip_advice_en:
      "Memorize the service loop: (1) greet + seat — `Selamat datang. Silakan duduk.`; (2) take food + drink — `Mau pesan/minum apa?`; (3) ask spice level — `Pedas atau tidak?`; (4) read back — `Saya ulangi pesanannya, ya.`; (5) serve — `Selamat menikmati.`; (6) pay + send off — `Tunai atau kartu?` ... `Silakan datang lagi.` Always address guests as `Pak/Bu/Mas/Mbak`, never `kamu`. Watch the verb→noun `-an` shift: `pesan` (order, v) → `pesanan` (the order, n), `salah` (wrong) → `kesalahan` (mistake), `kembali` (return) → `kembalian` (the change).",
    vocabulary: [
      // Venue & roles
      {
        cell_id: "e48b8874-8cd1-41fc-8346-5444b85ee4b9",
        word: "warung",
        en: "small eatery / food stall",
        vi: "quán ăn nhỏ / quán bình dân",
        pos: "noun",
        pronunciation_vi: "WA-rung — quán bình dân; lớn hơn là `restoran`",
        pronunciation_en: "WA-rung — humble eatery; a bigger one is a `restoran`",
      },
      {
        cell_id: "1c5d4477-92ac-4c7f-b62c-f039161e109f",
        word: "pelayan",
        en: "waiter / server",
        vi: "nhân viên phục vụ",
        pos: "noun",
        pronunciation_vi: "pe-la-YAN — gốc `layan` (phục vụ) + `pe-...-an`",
        pronunciation_en: "pe-la-YAN — root `layan` (serve) + `pe-...-an`",
      },
      {
        cell_id: "2a97a794-bc7c-4976-820c-410f3bdbf9a6",
        word: "menu",
        en: "menu / dish",
        vi: "thực đơn / món",
        pos: "noun",
        pronunciation_vi: "ME-nu — vừa nghĩa 'thực đơn' vừa nghĩa 'món có trong đó'",
        pronunciation_en: "ME-nu — means both 'menu' and 'a dish on it'",
      },
      // Order & service actions
      {
        cell_id: "76b4b289-22cb-43cf-8252-2eff735b7464",
        word: "pesan",
        en: "to order",
        vi: "gọi món / đặt",
        pos: "verb",
        pronunciation_vi: "pe-SAN — danh từ là `pesanan` (đơn đã gọi)",
        pronunciation_en: "pe-SAN — the noun is `pesanan` (the placed order)",
      },
      {
        cell_id: "ace8cc07-b152-4dc2-985f-f4dc5ab81b65",
        word: "silakan",
        en: "please / go ahead",
        vi: "mời (mời ngồi, mời dùng)",
        pos: "phrase",
        pronunciation_vi: "si-LA-kan — KHÔNG có `h`; đừng viết `silahkan`",
        pronunciation_en: "si-LA-kan — NO `h`; don't write `silahkan`",
      },
      {
        cell_id: "194b3c4d-388c-4128-88a9-8ff6d71efe4a",
        word: "bayar",
        en: "to pay",
        vi: "trả tiền / thanh toán",
        pos: "verb",
        pronunciation_vi: "BA-yar — `membayar` là dạng trang trọng",
        pronunciation_en: "BA-yar — `membayar` is the formal form",
      },
      {
        cell_id: "1321c858-9cbe-4a81-8f72-82c991feb350",
        word: "tunai",
        en: "cash",
        vi: "tiền mặt",
        pos: "noun",
        pronunciation_vi: "TU-nai — đối lập với `kartu` (thẻ)",
        pronunciation_en: "TU-nai — opposite of `kartu` (card)",
      },
      {
        cell_id: "37319ba9-c53a-40d8-82bb-0e63f183fa18",
        word: "kembalian",
        en: "change (money returned)",
        vi: "tiền thừa / tiền thối",
        pos: "noun",
        pronunciation_vi: "kem-ba-li-AN — gốc `kembali` (trở lại) + `-an`",
        pronunciation_en: "kem-ba-li-AN — root `kembali` (return) + `-an`",
      },
      // Food & drink basics
      {
        cell_id: "bd063ded-af4e-44fb-bf65-01eeb568f0fa",
        word: "makan",
        en: "to eat",
        vi: "ăn",
        pos: "verb",
        pronunciation_vi: "MA-kan — `makanan` = món ăn (danh từ)",
        pronunciation_en: "MA-kan — `makanan` = food (noun)",
      },
      {
        cell_id: "f66270e4-ac1c-40a8-bf0c-934ce2688260",
        word: "minum",
        en: "to drink",
        vi: "uống",
        pos: "verb",
        pronunciation_vi: "MI-num — `minuman` = đồ uống (danh từ)",
        pronunciation_en: "MI-num — `minuman` = drink (noun)",
      },
      {
        cell_id: "15315048-39ca-42b5-a60e-cbf15ebde77c",
        word: "pedas",
        en: "spicy",
        vi: "cay",
        pos: "adjective",
        pronunciation_vi: "pe-DAS — câu hỏi vàng: `pedas atau tidak?`",
        pronunciation_en: "pe-DAS — the golden question: `pedas atau tidak?`",
      },
      {
        cell_id: "fac83e71-5c43-4072-9bf8-a8711d840533",
        word: "nasi goreng",
        en: "fried rice",
        vi: "cơm chiên",
        pos: "noun",
        pronunciation_vi: "NA-si GO-reng — món quốc dân; `nasi` = cơm, `goreng` = chiên",
        pronunciation_en: "NA-si GO-reng — the national dish; `nasi` = rice, `goreng` = fried",
      },
      {
        cell_id: "c14eb1f1-43f5-416d-bd60-47f01805f649",
        word: "es teh",
        en: "iced tea",
        vi: "trà đá",
        pos: "noun",
        pronunciation_vi: "es teh — `es` = đá; đồ uống phổ biến nhất",
        pronunciation_en: "es teh — `es` = ice; the most common drink",
      },
      {
        cell_id: "57da1928-5cc1-41cd-aa06-ea0a2019b659",
        word: "halal",
        en: "halal (permissible under Islam)",
        vi: "halal (hợp lệ theo đạo Hồi)",
        pos: "adjective",
        pronunciation_vi: "ha-LAL — phần lớn khách theo đạo Hồi; tránh `babi` (thịt heo) và rượu",
        pronunciation_en: "ha-LAL — most guests are Muslim; avoid `babi` (pork) and alcohol",
      },
      {
        cell_id: "ac77da91-2a92-4013-8781-80c682c7f503",
        word: "habis",
        en: "sold out / finished",
        vi: "hết (hàng)",
        pos: "adjective",
        pronunciation_vi: "HA-bis — `sedang habis` = đang hết tạm thời",
        pronunciation_en: "HA-bis — `sedang habis` = temporarily out",
      },
    ],
    dialogue: [
      // Dialogue: Seating, ordering, a small mistake, and payment
      {
        cell_id: "4417800b-d7c3-4850-94f4-9eab38b1f2bf",
        speaker: "Pelayan",
        text: "Selamat siang, Pak. Untuk berapa orang?",
        vi: "Chào buổi trưa, anh. Cho mấy người ạ?",
        en: "Good afternoon, sir. For how many people?",
      },
      {
        cell_id: "dcff3784-a981-48c2-adc4-4fcd517b228c",
        speaker: "Tamu",
        text: "Dua orang. Ada meja dekat jendela?",
        vi: "Hai người. Có bàn gần cửa sổ không?",
        en: "Two people. Is there a table near the window?",
      },
      {
        cell_id: "68e77bb3-8cfd-476a-933f-14eb54c7473b",
        speaker: "Pelayan",
        text: "Ada, silakan duduk di sini. Mau pesan apa?",
        vi: "Có ạ, mời anh ngồi đây. Anh muốn gọi món gì ạ?",
        en: "Yes, please sit here. What would you like to order?",
      },
      {
        cell_id: "369feb24-ca21-44d4-80bb-e481e62f37a5",
        speaker: "Tamu",
        text: "Dua nasi goreng dan dua es teh. Tidak pedas, ya.",
        vi: "Hai phần cơm chiên và hai trà đá. Không cay nhé.",
        en: "Two fried rice and two iced teas. Not spicy, please.",
      },
      {
        cell_id: "ded0bb09-b92a-4348-a2fd-da4aaffe2f55",
        speaker: "Pelayan",
        text: "Baik. Saya ulangi: dua nasi goreng tidak pedas, dua es teh. Mohon ditunggu, ya.",
        vi: "Vâng. Em nhắc lại: hai cơm chiên không cay, hai trà đá. Xin chờ một chút ạ.",
        en: "Okay. Let me read back: two not-spicy fried rice, two iced teas. Please wait a moment.",
      },
      {
        cell_id: "53800de5-0633-4317-a1b7-4f13a82823f4",
        speaker: "Pelayan",
        text: "Maaf, Pak, satu es teh sedang habis. Boleh saya ganti dengan es jeruk?",
        vi: "Xin lỗi anh, một trà đá đã hết. Em đổi sang nước cam đá được không ạ?",
        en: "Sorry, sir, one iced tea is sold out. May I replace it with iced orange?",
      },
      {
        cell_id: "e6fc0358-0c7c-4433-ad5f-a9435ba8142d",
        speaker: "Tamu",
        text: "Boleh. Nanti bayar pakai kartu, ya.",
        vi: "Được. Lát nữa thanh toán bằng thẻ nhé.",
        en: "Sure. We'll pay by card later.",
      },
      {
        cell_id: "90702258-aff2-4f51-82a2-662ddaf64868",
        speaker: "Pelayan",
        text: "Baik, Pak. Terima kasih, silakan datang lagi.",
        vi: "Vâng ạ. Cảm ơn anh, hẹn gặp lại ạ.",
        en: "Of course, sir. Thank you, please come again.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Mời quý khách ngồi đây.", answer: "Silakan duduk di sini." },
          { prompt: "Quý khách muốn gọi món gì?", answer: "Mau pesan apa?" },
          { prompt: "Ăn cay hay không cay?", answer: "Pedas atau tidak?" },
          { prompt: "Xin lỗi, món này đã hết.", answer: "Maaf, menu ini sedang habis." },
          { prompt: "Thanh toán tiền mặt hay thẻ?", answer: "Mau bayar tunai atau kartu?" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Indonesia:",
        instruction_en: "Extra practice — translate into Indonesian:",
        items: [
          { prompt: "Chào mừng quý khách. Cho mấy người?", answer: "Selamat datang. Untuk berapa orang?" },
          { prompt: "Chúc quý khách ngon miệng.", answer: "Selamat menikmati." },
          { prompt: "Em xin nhắc lại đơn nhé.", answer: "Saya ulangi pesanannya, ya." },
          { prompt: "Em sẽ đổi cái mới cho quý khách.", answer: "Saya ganti dengan yang baru." },
          { prompt: "Cảm ơn, hẹn gặp lại.", answer: "Terima kasih, silakan datang lagi." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn dạng danh từ đúng (đuôi `-an`): `pesan` → ___, `salah` → ___, `kembali` → ___, `makan` → ___, `minum` → ___.",
        instruction_en:
          "Give the correct noun form (`-an` suffix): `pesan` → ___, `salah` → ___, `kembali` → ___, `makan` → ___, `minum` → ___.",
        items: [
          { prompt: "pesan (gọi món) →", answer: "pesanan", hint: "đơn đã gọi" },
          { prompt: "salah (sai) →", answer: "kesalahan", hint: "khung `ke-...-an`" },
          { prompt: "kembali (trở lại) →", answer: "kembalian", hint: "tiền thối" },
          { prompt: "makan (ăn) →", answer: "makanan", hint: "món ăn" },
          { prompt: "minum (uống) →", answer: "minuman", hint: "đồ uống" },
        ],
      },
      {
        type: "address_drill",
        instruction_vi:
          "Chọn cách xưng hô đúng với khách (KHÔNG dùng `kamu`): đàn ông lớn tuổi = ___, phụ nữ lớn tuổi = ___, anh trẻ = ___, chị trẻ = ___.",
        instruction_en:
          "Pick the right address for a guest (NEVER `kamu`): older man = ___, older woman = ___, young man = ___, young woman = ___.",
        items: [
          { prompt: "đàn ông lớn tuổi", answer: "Bapak / Pak" },
          { prompt: "phụ nữ lớn tuổi", answer: "Ibu / Bu" },
          { prompt: "anh trẻ", answer: "Mas" },
          { prompt: "chị trẻ", answer: "Mbak" },
        ],
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra phục vụ — bạn làm được chưa?",
        instruction_en: "Quick service self-check — can you do each one?",
        items: [
          { vi: "Tôi có thể đón và mời khách ngồi.", en: "I can greet and seat a guest." },
          { vi: "Tôi có thể hỏi món, đồ uống và độ cay.", en: "I can ask for food, drink, and spice level." },
          { vi: "Tôi có thể nhắc lại đơn cho khách.", en: "I can read the order back to the guest." },
          { vi: "Tôi có thể xin lỗi khi hết món hoặc sai sót.", en: "I can apologize for a sold-out item or a mistake." },
          { vi: "Tôi có thể hỏi cách thanh toán và tiễn khách.", en: "I can ask how they'll pay and send them off." },
          { vi: "Tôi xưng hô `Pak/Bu/Mas/Mbak`, không dùng `kamu`.", en: "I address guests with `Pak/Bu/Mas/Mbak`, not `kamu`." },
        ],
      },
    ],
  },
];

export default lessons;
