// Travel & Tourism Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (construction-worker.ts, email-messaging.ts…),
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
// Topic: traveling in Indonesia — booking a hotel/guesthouse (`hotel`, `penginapan`),
// flights and tickets (`tiket pesawat`), visa on arrival, sightseeing (`wisata`),
// the beach (`pantai`) and the mountains (`gunung`). For Vietnamese speakers the big
// wins are familiar: no verb conjugation, no tones, noun-before-adjective like
// Vietnamese (`tiket murah` = vé rẻ). The traps: `c` reads "ch", `di` (at) ≠ `ke` (to),
// and time-words `kemarin`/`besok` carry the tense instead of the verb.

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
    id: "indonesian_travel_tourism",
    level: "A2",
    category: "travel",
    title_vi: "Du lịch và tham quan",
    title_en: "Travel and tourism",
    sentences: [
      // ── Booking a room ──────────────────────────────────────────────────
      {
        en: "Saya mau pesan kamar untuk dua malam.",
        vi: "Tôi muốn đặt phòng cho hai đêm.",
        pronunciation_focus: [
          "SA-ya mau pe-SAN KA-mar un-TUK du-A MA-lam — `pesan` = đặt/gọi; `kamar` = phòng; `malam` = đêm (đếm theo đêm, không theo ngày).",
          "Lợi thế người Việt: không chia động từ — `saya mau pesan` ngắn y như 'tôi muốn đặt'.",
          "Lỗi người Việt: nói `dua hari` (hai ngày) khi đặt phòng. Khách sạn đếm theo `malam` (đêm).",
          "Luyện: `Saya mau pesan kamar untuk dua malam.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau pe-SAN KA-mar un-TUK du-A MA-lam — `pesan` = to book/order; `kamar` = room; `malam` = night (rooms are counted by night).",
          "VN-speaker win: no conjugation — `saya mau pesan` is as short as 'I want to book'.",
          "VN-speaker trap: saying `dua hari` (two days). Hotels count in `malam` (nights).",
          "Drill: `Saya mau pesan kamar untuk dua malam.`",
        ],
      },
      {
        en: "Apakah masih ada kamar kosong?",
        vi: "Còn phòng trống không ạ?",
        pronunciation_focus: [
          "a-pa-KAH ma-SIH A-da KA-mar ko-SONG — `apakah` = (câu hỏi có/không, lịch sự); `masih ada` = vẫn còn; `kamar kosong` = phòng trống.",
          "Mẹo: `apakah` mở câu hỏi yes/no trang trọng; khẩu ngữ chỉ cần lên giọng cuối câu.",
          "Lỗi người Việt: đặt tính từ trước danh từ — `kosong kamar`. Đúng là `kamar kosong` (như tiếng Việt: phòng trống).",
          "Luyện: `Apakah masih ada kamar kosong?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH ma-SIH A-da KA-mar ko-SONG — `apakah` = (polite yes/no question word); `masih ada` = still have; `kamar kosong` = vacant room.",
          "Tip: `apakah` opens a formal yes/no question; casually, just raise your intonation at the end.",
          "VN-speaker trap: adjective before noun — `kosong kamar`. It's `kamar kosong` (room vacant), like Vietnamese.",
          "Drill: `Apakah masih ada kamar kosong?`",
        ],
      },
      {
        en: "Berapa harga per malam, sudah termasuk sarapan?",
        vi: "Giá mỗi đêm bao nhiêu, đã bao gồm bữa sáng chưa?",
        pronunciation_focus: [
          "be-RA-pa HAR-ga per MA-lam, SU-dah ter-MA-suk sa-RA-pan — `berapa harga` = giá bao nhiêu; `termasuk` = bao gồm; `sarapan` = bữa sáng.",
          "Mẹo: `sudah …?` = 'đã … chưa?' — hỏi `sudah termasuk?` để biết đã bao gồm chưa.",
          "Lỗi người Việt: hỏi `harga berapa` (giá bao nhiêu) ngược thứ tự. Chuẩn là `berapa harga` (`berapa` đứng trước).",
          "Luyện: `Berapa harga per malam, sudah termasuk sarapan?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa HAR-ga per MA-lam, SU-dah ter-MA-suk sa-RA-pan — `berapa harga` = how much is the price; `termasuk` = included; `sarapan` = breakfast.",
          "Tip: `sudah …?` = 'has it already …?' — ask `sudah termasuk?` to check what's included.",
          "VN-speaker trap: word order `harga berapa`. The standard is `berapa harga` (`berapa` first).",
          "Drill: `Berapa harga per malam, sudah termasuk sarapan?`",
        ],
      },
      {
        en: "Tolong, jam berapa waktu check-out?",
        vi: "Cho hỏi, mấy giờ trả phòng ạ?",
        pronunciation_focus: [
          "TO-long, jam be-RA-pa WAK-tu check-out — `tolong` = làm ơn/cho hỏi; `jam berapa` = mấy giờ; nhiều khách sạn dùng thẳng `check-out`/`check-in`.",
          "Mẹo: `jam berapa?` = mấy giờ?; `jam dua` = hai giờ. `jam` vừa là 'giờ' vừa là 'đồng hồ'.",
          "Lỗi người Việt: bỏ `tolong` khi nhờ vả. Mở bằng `tolong` nghe lịch sự hơn nhiều.",
          "Luyện: `Tolong, jam berapa waktu check-out?`",
        ],
        pronunciation_focus_en: [
          "TO-long, jam be-RA-pa WAK-tu check-out — `tolong` = please/excuse me; `jam berapa` = what time; many hotels use `check-out`/`check-in` directly.",
          "Tip: `jam berapa?` = what time?; `jam dua` = two o'clock. `jam` means both 'hour' and 'clock'.",
          "VN-speaker trap: dropping `tolong` when asking a favor. Opening with `tolong` sounds much politer.",
          "Drill: `Tolong, jam berapa waktu check-out?`",
        ],
      },
      // ── Flights, tickets, visa ──────────────────────────────────────────
      {
        en: "Saya sudah pesan tiket pesawat ke Bali.",
        vi: "Tôi đã đặt vé máy bay đi Bali rồi.",
        pronunciation_focus: [
          "SA-ya SU-dah pe-SAN TI-ket pe-SA-wat ke BA-li — `sudah` = đã (đánh dấu hoàn thành); `tiket pesawat` = vé máy bay; `ke Bali` = đi Bali.",
          "Mẹo: tiếng Indonesia không chia thì — `sudah` mang nghĩa quá khứ/hoàn thành. Bỏ `sudah` thì câu trung tính.",
          "Lỗi người Việt: dùng `di Bali` khi ý là 'ĐI Bali'. Di chuyển ĐẾN nơi nào dùng `ke`, ở TẠI nơi nào dùng `di`.",
          "Luyện: `Saya sudah pesan tiket pesawat ke Bali.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SU-dah pe-SAN TI-ket pe-SA-wat ke BA-li — `sudah` = already (completion marker); `tiket pesawat` = plane ticket; `ke Bali` = to Bali.",
          "Tip: Indonesian has no tense — `sudah` carries past/perfective meaning. Drop `sudah` and it's neutral.",
          "VN-speaker trap: using `di Bali` when you mean 'TO Bali'. Movement toward a place uses `ke`; being AT a place uses `di`.",
          "Drill: `Saya sudah pesan tiket pesawat ke Bali.`",
        ],
      },
      {
        en: "Apakah saya perlu visa, atau bisa visa on arrival?",
        vi: "Tôi có cần visa không, hay có thể làm visa tại sân bay?",
        pronunciation_focus: [
          "a-pa-KAH SA-ya per-LU VI-sa, A-tau BI-sa visa on arrival — `perlu` = cần; `atau` = hay/hoặc; `bisa` = có thể.",
          "Mẹo: `visa on arrival` (VOA) dùng nguyên tiếng Anh; người Indonesia hiểu ngay.",
          "Lỗi người Việt: lẫn `bisa` (có thể) với `boleh` (được phép). `bisa` = khả năng; `boleh` = được phép.",
          "Luyện: `Apakah saya perlu visa, atau bisa visa on arrival?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH SA-ya per-LU VI-sa, A-tau BI-sa visa on arrival — `perlu` = need; `atau` = or; `bisa` = can/able.",
          "Tip: `visa on arrival` (VOA) stays in English; Indonesians understand it instantly.",
          "VN-speaker trap: mixing `bisa` (able to) with `boleh` (allowed to). `bisa` = ability; `boleh` = permission.",
          "Drill: `Apakah saya perlu visa, atau bisa visa on arrival?`",
        ],
      },
      {
        en: "Penerbangan saya ditunda dua jam.",
        vi: "Chuyến bay của tôi bị hoãn hai tiếng.",
        pronunciation_focus: [
          "pe-ner-BA-ngan SA-ya di-TUN-da du-A jam — `penerbangan` = chuyến bay; `ditunda` = bị hoãn (bị động `di-`); `dua jam` = hai tiếng.",
          "Mẹo: `di-` + `tunda` = bị hoãn. Thông báo sân bay đầy thể bị động: `dibatalkan` (bị hủy), `ditunda` (bị hoãn).",
          "Lỗi người Việt: nói `saya tunda` (= tôi hoãn việc gì). Để nói 'chuyến bay BỊ hoãn' phải là `ditunda`.",
          "Luyện: `Penerbangan saya ditunda dua jam.`",
        ],
        pronunciation_focus_en: [
          "pe-ner-BA-ngan SA-ya di-TUN-da du-A jam — `penerbangan` = flight; `ditunda` = delayed (di- passive); `dua jam` = two hours.",
          "Tip: `di-` + `tunda` = be postponed. Airport announcements are full of passives: `dibatalkan` (cancelled), `ditunda` (delayed).",
          "VN-speaker trap: `saya tunda` means 'I postpone (something)'. For 'the flight WAS delayed' you need `ditunda`.",
          "Drill: `Penerbangan saya ditunda dua jam.`",
        ],
      },
      // ── Sightseeing, directions ─────────────────────────────────────────
      {
        en: "Tempat wisata apa yang bagus di dekat sini?",
        vi: "Có địa điểm tham quan nào đẹp gần đây không?",
        pronunciation_focus: [
          "tem-PAT WI-sa-ta A-pa yang BA-gus di de-KAT SI-ni — `tempat wisata` = địa điểm du lịch; `bagus` = đẹp/hay; `di dekat sini` = gần đây.",
          "Mẹo: `yang` = từ nối ('cái mà'): `wisata yang bagus` = điểm tham quan (mà) đẹp.",
          "Lỗi người Việt: dùng `ke dekat sini`. Hỏi cái gì Ở gần dùng `di`, không `ke`.",
          "Luyện: `Tempat wisata apa yang bagus di dekat sini?`",
        ],
        pronunciation_focus_en: [
          "tem-PAT WI-sa-ta A-pa yang BA-gus di de-KAT SI-ni — `tempat wisata` = tourist spot; `bagus` = nice/good; `di dekat sini` = near here.",
          "Tip: `yang` = the connector ('the one that'): `wisata yang bagus` = a tourist spot that's nice.",
          "VN-speaker trap: using `ke dekat sini`. Asking what's NEAR uses `di`, not `ke`.",
          "Drill: `Tempat wisata apa yang bagus di dekat sini?`",
        ],
      },
      {
        en: "Saya mau ke pantai, naik apa ya?",
        vi: "Tôi muốn ra biển, đi bằng gì nhỉ?",
        pronunciation_focus: [
          "SA-ya mau ke PAN-tai, na-IK A-pa ya — `pantai` = bãi biển; `naik` = đi bằng (phương tiện); `naik apa?` = đi bằng gì?",
          "Mẹo: `naik` dùng cho mọi phương tiện: `naik bus`, `naik ojek`, `naik pesawat` — không như tiếng Việt đổi từ.",
          "Lỗi người Việt: dùng `dengan` (với) cho phương tiện: `dengan bus`. Tự nhiên hơn là `naik bus`.",
          "Luyện: `Saya mau ke pantai, naik apa ya?`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau ke PAN-tai, na-IK A-pa ya — `pantai` = beach; `naik` = to go by (transport); `naik apa?` = by what?",
          "Tip: `naik` works for all transport: `naik bus`, `naik ojek`, `naik pesawat` — one word, unlike Vietnamese.",
          "VN-speaker trap: using `dengan` (with) for transport: `dengan bus`. More natural is `naik bus`.",
          "Drill: `Saya mau ke pantai, naik apa ya?`",
        ],
      },
      {
        en: "Pemandangan dari gunung ini indah sekali.",
        vi: "Cảnh nhìn từ ngọn núi này đẹp tuyệt.",
        pronunciation_focus: [
          "pe-man-DA-ngan da-ri GU-nung I-ni IN-dah se-KA-li — `pemandangan` = phong cảnh; `gunung` = núi; `indah sekali` = đẹp tuyệt.",
          "Mẹo: `sekali` đặt SAU tính từ = 'rất/tuyệt': `indah sekali` = đẹp tuyệt. Đừng nhầm với `sekali` = 'một lần'.",
          "Lỗi người Việt: nói `sangat indah sekali` (thừa). Chọn MỘT: `sangat indah` HOẶC `indah sekali`.",
          "Luyện: `Pemandangan dari gunung ini indah sekali.`",
        ],
        pronunciation_focus_en: [
          "pe-man-DA-ngan da-ri GU-nung I-ni IN-dah se-KA-li — `pemandangan` = scenery/view; `gunung` = mountain; `indah sekali` = very beautiful.",
          "Tip: `sekali` placed AFTER an adjective = 'very': `indah sekali` = very beautiful. Don't confuse with `sekali` = 'once'.",
          "VN-speaker trap: saying `sangat indah sekali` (doubled). Pick ONE: `sangat indah` OR `indah sekali`.",
          "Drill: `Pemandangan dari gunung ini indah sekali.`",
        ],
      },
      // ── Problems & practical ────────────────────────────────────────────
      {
        en: "AC di kamar saya tidak dingin, tolong diperbaiki.",
        vi: "Máy lạnh phòng tôi không mát, làm ơn sửa giúp.",
        pronunciation_focus: [
          "A-se di KA-mar SA-ya TI-dak DI-ngin, TO-long di-per-BA-i-ki — `AC` đọc 'a-se'; `tidak dingin` = không lạnh; `diperbaiki` = được sửa.",
          "Mẹo: `tidak` phủ định tính từ/động từ thường ('không'). Nhớ `tidak` ≠ `jangan` (đừng) ≠ `belum` (chưa).",
          "Lỗi người Việt: dùng `bukan` cho tính từ: `bukan dingin`. `bukan` chỉ phủ định danh từ; với tính từ dùng `tidak`.",
          "Luyện: `AC di kamar saya tidak dingin, tolong diperbaiki.`",
        ],
        pronunciation_focus_en: [
          "A-se di KA-mar SA-ya TI-dak DI-ngin, TO-long di-per-BA-i-ki — `AC` said 'ah-say'; `tidak dingin` = not cold; `diperbaiki` = be repaired.",
          "Tip: `tidak` negates adjectives/ordinary verbs ('not'). Keep `tidak` ≠ `jangan` (don't) ≠ `belum` (not yet) straight.",
          "VN-speaker trap: using `bukan` for an adjective: `bukan dingin`. `bukan` only negates nouns; for adjectives use `tidak`.",
          "Drill: `AC di kamar saya tidak dingin, tolong diperbaiki.`",
        ],
      },
      {
        en: "Maaf, saya tersesat. Bisa tunjukkan jalan ke hotel?",
        vi: "Xin lỗi, tôi bị lạc. Chỉ giúp đường về khách sạn được không?",
        pronunciation_focus: [
          "ma-AF, SA-ya ter-se-SAT. BI-sa tun-JUK-kan JA-lan ke ho-TEL — `tersesat` = bị lạc (tiền tố `ter-` = bị/vô tình); `tunjukkan jalan` = chỉ đường.",
          "Mẹo: `ter-` = trạng thái không chủ ý: `tersesat` (lạc), `terlambat` (trễ), `tertinggal` (bỏ quên).",
          "Lỗi người Việt: nói `saya sesat` thiếu `ter-`. Đúng là `tersesat` (bị lạc ngoài ý muốn).",
          "Luyện: `Maaf, saya tersesat. Bisa tunjukkan jalan ke hotel?`",
        ],
        pronunciation_focus_en: [
          "ma-AF, SA-ya ter-se-SAT. BI-sa tun-JUK-kan JA-lan ke ho-TEL — `tersesat` = lost (prefix `ter-` = accidentally); `tunjukkan jalan` = to show the way.",
          "Tip: `ter-` = an unintended state: `tersesat` (got lost), `terlambat` (late), `tertinggal` (left behind).",
          "VN-speaker trap: `saya sesat` without `ter-`. The correct form is `tersesat` (got lost unintentionally).",
          "Drill: `Maaf, saya tersesat. Bisa tunjukkan jalan ke hotel?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia là quần đảo khổng lồ — đi giữa các đảo (Java, Bali, Lombok, Sumatra…) hầu như phải bay (`naik pesawat`) hoặc đi phà (`kapal feri`). Chỗ ở chia nhiều mức: `hotel` (khách sạn), `penginapan`/`losmen` (nhà nghỉ bình dân), `homestay`, và `vila` (cho nhóm/gia đình, phổ biến ở Bali). Khách nhiều nước được `visa on arrival` (VOA) tại sân bay lớn — kiểm tra trước theo quốc tịch. Khi đi `wisata`, người Indonesia rất thân thiện và hay bắt chuyện với khách (`Dari mana?` = Bạn từ đâu tới?); trả lời niềm nở được quý. Ở chợ và điểm du lịch, mặc cả (`tawar-menawar`) là bình thường, nhưng trong khách sạn/nhà hàng có niêm yết giá thì không. Đền chùa và nơi tôn giáo yêu cầu ăn mặc kín đáo; ở Bali thường có khăn `sarung`/`selendang` cho khách mượn. Giờ giấc kiểu `jam karet` (giờ dây thun) khá phổ biến — chuyến xe/tour có thể trễ, cứ thư giãn.",
    cultural_notes_en:
      "Indonesia is a vast archipelago — moving between islands (Java, Bali, Lombok, Sumatra…) almost always means flying (`naik pesawat`) or taking a ferry (`kapal feri`). Lodging spans tiers: `hotel`, `penginapan`/`losmen` (budget guesthouse), `homestay`, and `vila` (for groups/families, common in Bali). Many nationalities get `visa on arrival` (VOA) at major airports — check by passport beforehand. While on `wisata`, Indonesians are very friendly and often chat with travelers (`Dari mana?` = Where are you from?); a warm reply is appreciated. At markets and tourist spots, bargaining (`tawar-menawar`) is normal, but not at hotels/restaurants with listed prices. Temples and religious sites require modest dress; in Bali a `sarung`/`selendang` sash is usually lent to visitors. The `jam karet` ('rubber time') attitude is common — buses/tours may run late, so relax.",
    tip_advice_vi:
      "Nắm bốn 'việc sống còn' khi đi du lịch: (1) đặt chỗ — `Saya mau pesan kamar/tiket …`; (2) hỏi giá & điều kiện — `Berapa harga …? Sudah termasuk …?`; (3) hỏi đường/phương tiện — `… di mana?` và `naik apa?`; (4) báo sự cố — `… tidak …, tolong diperbaiki` hoặc `Saya tersesat`. Nhớ ba khác biệt cốt lõi với người Việt: `di` (ở) ≠ `ke` (đến); `bisa` (có thể) ≠ `boleh` (được phép); và `tidak`/`belum`/`jangan` (không/chưa/đừng). Đếm phòng theo `malam` (đêm), không theo `hari` (ngày). Thông báo sân bay đầy bị động `di-` (`ditunda`, `dibatalkan`) — nhận ra nó để không lỡ chuyến. Tin vui: không chia động từ, không thanh điệu, danh từ đứng trước tính từ y như tiếng Việt.",
    tip_advice_en:
      "Master four 'survival' jobs for travel: (1) book — `Saya mau pesan kamar/tiket …`; (2) ask price & terms — `Berapa harga …? Sudah termasuk …?`; (3) ask directions/transport — `… di mana?` and `naik apa?`; (4) report a problem — `… tidak …, tolong diperbaiki` or `Saya tersesat`. Keep three core distinctions straight: `di` (at) ≠ `ke` (to); `bisa` (able) ≠ `boleh` (allowed); and `tidak`/`belum`/`jangan` (not / not yet / don't). Count rooms by `malam` (nights), not `hari` (days). Airport announcements are full of the di- passive (`ditunda`, `dibatalkan`) — recognize it so you don't miss a flight. Good news: no conjugation, no tones, and noun-before-adjective just like Vietnamese.",
    vocabulary: [
      // ── Lodging ─────────────────────────────────────────────────────
      {
        cell_id: "92ef9614-35fd-44bd-9b2a-3132a0fbcc5f",
        word: "hotel",
        en: "hotel",
        vi: "khách sạn",
        pos: "noun",
        pronunciation_vi: "ho-TEL — đọc rõ `l` cuối; mượn tiếng Anh",
        pronunciation_en: "ho-TEL — sound the final `l`; English loanword",
      },
      {
        cell_id: "fb5d2787-3e6c-4813-9254-ddcd3bf16ae3",
        word: "penginapan",
        en: "guesthouse / lodging",
        vi: "nhà nghỉ / chỗ trọ",
        pos: "noun",
        pronunciation_vi: "pe-ngi-NA-pan — gốc `inap` (ở qua đêm) + `peN-…-an`",
        pronunciation_en: "pe-ngi-NA-pan — root `inap` (stay overnight) + `peN-…-an`",
      },
      {
        cell_id: "c6f49a75-8f25-4e3e-813b-c542a3ca9eeb",
        word: "kamar",
        en: "room",
        vi: "phòng",
        pos: "noun",
        pronunciation_vi: "KA-mar — `kamar mandi` = phòng tắm; `kamar kosong` = phòng trống",
        pronunciation_en: "KA-mar — `kamar mandi` = bathroom; `kamar kosong` = vacant room",
      },
      {
        cell_id: "e20f3eef-ed4d-4bb7-b467-d5acee9fa5d8",
        word: "memesan / pesan",
        en: "to book / order",
        vi: "đặt (phòng/vé)",
        pos: "verb",
        pronunciation_vi: "me-me-SAN / pe-SAN — `pesan kamar`, `pesan tiket`",
        pronunciation_en: "me-me-SAN / pe-SAN — `pesan kamar`, `pesan tiket`",
      },
      {
        cell_id: "4b947067-7627-44db-aa06-d04bb9c22258",
        word: "sarapan",
        en: "breakfast",
        vi: "bữa sáng",
        pos: "noun",
        pronunciation_vi: "sa-RA-pan — `sudah termasuk sarapan?` = đã gồm bữa sáng chưa?",
        pronunciation_en: "sa-RA-pan — `sudah termasuk sarapan?` = is breakfast included?",
      },
      {
        cell_id: "5c04769c-19f0-45dd-821d-943d12785e59",
        word: "termasuk",
        en: "included",
        vi: "bao gồm",
        pos: "verb",
        pronunciation_vi: "ter-MA-suk — `belum termasuk` = chưa bao gồm",
        pronunciation_en: "ter-MA-suk — `belum termasuk` = not yet included",
      },
      // ── Flights & tickets ───────────────────────────────────────────
      {
        cell_id: "9d6a0c5c-ebd1-494d-9467-42f66812fd42",
        word: "tiket pesawat",
        en: "plane ticket",
        vi: "vé máy bay",
        pos: "noun phrase",
        pronunciation_vi: "TI-ket pe-SA-wat — `pesawat` = máy bay",
        pronunciation_en: "TI-ket pe-SA-wat — `pesawat` = airplane",
      },
      {
        cell_id: "8d94a7ad-d479-4ffb-8fd5-255b39a11915",
        word: "penerbangan",
        en: "flight",
        vi: "chuyến bay",
        pos: "noun",
        pronunciation_vi: "pe-ner-BA-ngan — gốc `terbang` (bay)",
        pronunciation_en: "pe-ner-BA-ngan — root `terbang` (to fly)",
      },
      {
        cell_id: "6cd137f2-ea9a-44ca-a680-24b64c086feb",
        word: "bandara",
        en: "airport",
        vi: "sân bay",
        pos: "noun",
        pronunciation_vi: "ban-DA-ra — rút từ `bandar udara`",
        pronunciation_en: "ban-DA-ra — short for `bandar udara`",
      },
      {
        cell_id: "ed94593b-8a7f-4bc5-997c-be67f5dd32da",
        word: "visa on arrival",
        en: "visa on arrival (VOA)",
        vi: "visa cấp tại sân bay",
        pos: "noun phrase",
        pronunciation_vi: "VI-sa on a-RAI-val — giữ nguyên tiếng Anh; viết tắt `VOA`",
        pronunciation_en: "VEE-sa on arrival — kept in English; abbreviated `VOA`",
      },
      {
        cell_id: "0783570a-5c48-4ead-ba58-1214df0eeda6",
        word: "ditunda",
        en: "delayed (passive)",
        vi: "bị hoãn",
        pos: "verb (passive)",
        pronunciation_vi: "di-TUN-da — `dibatalkan` = bị hủy",
        pronunciation_en: "di-TUN-da — `dibatalkan` = cancelled",
      },
      // ── Sightseeing ─────────────────────────────────────────────────
      {
        cell_id: "baf6fb85-31fa-4843-867b-53072791b0d2",
        word: "wisata",
        en: "tourism / sightseeing",
        vi: "du lịch / tham quan",
        pos: "noun",
        pronunciation_vi: "WI-sa-ta — `tempat wisata` = điểm tham quan; `wisatawan` = du khách",
        pronunciation_en: "WI-sa-ta — `tempat wisata` = tourist spot; `wisatawan` = tourist",
      },
      {
        cell_id: "c74d104d-41fa-41e9-85f6-782321408d3c",
        word: "pantai",
        en: "beach",
        vi: "bãi biển",
        pos: "noun",
        pronunciation_vi: "PAN-tai — `tai` đọc như 'tai'; `ke pantai` = ra biển",
        pronunciation_en: "PAN-tai — `tai` as in 'tie'; `ke pantai` = to the beach",
      },
      {
        cell_id: "252576cf-43c9-482d-84ca-51928b86469f",
        word: "gunung",
        en: "mountain",
        vi: "núi",
        pos: "noun",
        pronunciation_vi: "GU-nung — `gunung berapi` = núi lửa; `naik gunung` = leo núi",
        pronunciation_en: "GU-nung — `gunung berapi` = volcano; `naik gunung` = to hike",
      },
      {
        cell_id: "5cf9a4d0-80e5-4c90-ae1e-01f6378a5967",
        word: "pemandangan",
        en: "scenery / view",
        vi: "phong cảnh",
        pos: "noun",
        pronunciation_vi: "pe-man-DA-ngan — gốc `pandang` (nhìn)",
        pronunciation_en: "pe-man-DA-ngan — root `pandang` (to look)",
      },
      {
        cell_id: "43ec2b18-7e7b-4f7e-b7f0-a01cfe8aec70",
        word: "oleh-oleh",
        en: "souvenir (esp. local food)",
        vi: "quà đặc sản",
        pos: "noun",
        pronunciation_vi: "o-leh-O-leh — từ lặp đôi; mua về tặng người nhà",
        pronunciation_en: "o-leh-O-leh — reduplication; bought to bring home",
      },
      // ── Getting around & problems ───────────────────────────────────
      {
        cell_id: "e225223a-255c-4d53-bf50-92133d1ea912",
        word: "naik",
        en: "to go by / board (transport)",
        vi: "đi bằng / lên (xe)",
        pos: "verb",
        pronunciation_vi: "na-IK — `naik bus`, `naik ojek`, `naik pesawat`",
        pronunciation_en: "na-IK — `naik bus`, `naik ojek`, `naik pesawat`",
      },
      {
        cell_id: "0af80f22-4d05-4352-8ba1-538631b6cc60",
        word: "tersesat",
        en: "to be lost",
        vi: "bị lạc",
        pos: "verb (ter-)",
        pronunciation_vi: "ter-se-SAT — `ter-` = vô ý; `Saya tersesat` = tôi bị lạc",
        pronunciation_en: "ter-se-SAT — `ter-` = accidental; `Saya tersesat` = I'm lost",
      },
      {
        cell_id: "7865d5e0-1475-4ae8-949a-bc656e23885a",
        word: "peta",
        en: "map",
        vi: "bản đồ",
        pos: "noun",
        pronunciation_vi: "PE-ta — `lihat peta` = xem bản đồ",
        pronunciation_en: "PE-ta — `lihat peta` = look at the map",
      },
      {
        cell_id: "138bd547-0950-4a46-ade0-1fa523b3adea",
        word: "tunjukkan jalan",
        en: "to show the way",
        vi: "chỉ đường",
        pos: "verb phrase",
        pronunciation_vi: "tun-JUK-kan JA-lan — `jalan` = đường/đi bộ",
        pronunciation_en: "tun-JUK-kan JA-lan — `jalan` = road / to walk",
      },
      {
        cell_id: "52b6080f-8202-41ea-99a2-8c79cc39778f",
        word: "memperbaiki / diperbaiki",
        en: "to repair / be repaired",
        vi: "sửa / được sửa",
        pos: "verb",
        pronunciation_vi: "mem-per-BA-i-ki — `tolong diperbaiki` = làm ơn sửa giúp",
        pronunciation_en: "mem-per-BA-i-ki — `tolong diperbaiki` = please fix it",
      },
    ],
    dialogue: [
      // Dialogue: checking in at a guesthouse, then asking about the beach
      {
        cell_id: "af287805-eee0-41ae-8a58-ee4b7ca1ea1d",
        speaker: "Tamu",
        text: "Selamat sore. Apakah masih ada kamar kosong untuk dua malam?",
        vi: "Chào buổi chiều. Còn phòng trống cho hai đêm không ạ?",
        en: "Good afternoon. Do you still have a vacant room for two nights?",
      },
      {
        cell_id: "d9929a94-8124-4110-9f68-b12cce798c67",
        speaker: "Resepsionis",
        text: "Ada, Pak. Berapa orang? Kamar standar atau yang ada pemandangan pantai?",
        vi: "Còn ạ. Mấy người ạ? Phòng tiêu chuẩn hay phòng có view biển?",
        en: "Yes, sir. How many people? A standard room or one with a beach view?",
      },
      {
        cell_id: "87729b9b-7f93-4dbb-a28e-e3e24aa0897e",
        speaker: "Tamu",
        text: "Dua orang. Yang ada pemandangan, berapa harga per malam? Sudah termasuk sarapan?",
        vi: "Hai người. Phòng có view, giá mỗi đêm bao nhiêu? Đã gồm bữa sáng chưa?",
        en: "Two people. The one with a view — how much per night? Is breakfast included?",
      },
      {
        cell_id: "18c20f6e-aeef-4678-a874-17f78e3c2f53",
        speaker: "Resepsionis",
        text: "Lima ratus ribu per malam, sudah termasuk sarapan. Check-out jam dua belas siang.",
        vi: "Năm trăm nghìn mỗi đêm, đã gồm bữa sáng. Trả phòng lúc mười hai giờ trưa.",
        en: "Five hundred thousand per night, breakfast included. Check-out is at twelve noon.",
      },
      {
        cell_id: "fb271ec4-2819-43ba-a9b2-451c4cf9a210",
        speaker: "Tamu",
        text: "Baik, saya pesan. Oh ya, saya mau ke pantai, naik apa ya?",
        vi: "Được, tôi đặt phòng. À, tôi muốn ra biển, đi bằng gì nhỉ?",
        en: "Okay, I'll book it. Oh, I want to go to the beach — how do I get there?",
      },
      {
        cell_id: "30ce545d-45b1-4783-a00a-2da75ff70a01",
        speaker: "Resepsionis",
        text: "Dekat kok, naik ojek lima menit. Nanti saya tunjukkan jalannya di peta.",
        vi: "Gần mà, đi ojek năm phút. Lát tôi chỉ đường trên bản đồ cho.",
        en: "It's close — a five-minute ojek ride. I'll show you the way on the map.",
      },
      {
        cell_id: "37a546ed-0281-489a-9a5b-e59a9a494ac4",
        speaker: "Tamu",
        text: "Terima kasih banyak. Pemandangan di sini indah sekali!",
        vi: "Cảm ơn rất nhiều. Phong cảnh ở đây đẹp tuyệt!",
        en: "Thank you so much. The scenery here is so beautiful!",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn đặt phòng cho hai đêm.", answer: "Saya mau pesan kamar untuk dua malam." },
          { prompt: "Còn phòng trống không ạ?", answer: "Apakah masih ada kamar kosong?" },
          { prompt: "Giá mỗi đêm bao nhiêu?", answer: "Berapa harga per malam?" },
          { prompt: "Tôi đã đặt vé máy bay đi Bali.", answer: "Saya sudah pesan tiket pesawat ke Bali." },
          { prompt: "Tôi bị lạc.", answer: "Saya tersesat." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Indonesia:",
        instruction_en: "Extra practice — translate into Indonesian:",
        items: [
          { prompt: "Đã bao gồm bữa sáng chưa?", answer: "Sudah termasuk sarapan?" },
          { prompt: "Tôi muốn ra biển, đi bằng gì?", answer: "Saya mau ke pantai, naik apa?" },
          { prompt: "Chuyến bay của tôi bị hoãn.", answer: "Penerbangan saya ditunda." },
          { prompt: "Máy lạnh không mát, làm ơn sửa giúp.", answer: "AC tidak dingin, tolong diperbaiki." },
          { prompt: "Cảnh ở đây đẹp tuyệt.", answer: "Pemandangan di sini indah sekali." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền `di` (ở) hoặc `ke` (đến) cho đúng:",
        instruction_en: "Fill in `di` (at) or `ke` (to):",
        items: [
          { prompt: "Saya mau pergi ___ pantai.", answer: "ke", hint: "di chuyển ĐẾN = `ke`" },
          { prompt: "Kamar saya ada ___ lantai dua.", answer: "di", hint: "ở TẠI một nơi = `di`" },
          { prompt: "Tempat wisata yang bagus ___ dekat sini.", answer: "di", hint: "vị trí Ở gần = `di`" },
          { prompt: "Besok kami terbang ___ Lombok.", answer: "ke", hint: "bay ĐẾN = `ke`" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn `bisa` (có thể) / `boleh` (được phép) / `tidak` (không) cho đúng:",
        instruction_en:
          "Choose `bisa` (able) / `boleh` (allowed) / `tidak` (not):",
        items: [
          { prompt: "___ saya foto di sini? (xin phép)", answer: "Boleh", hint: "xin phép = `boleh`" },
          { prompt: "Saya ___ berbahasa Indonesia sedikit. (khả năng)", answer: "bisa", hint: "khả năng = `bisa`" },
          { prompt: "AC ini ___ dingin. (phủ định)", answer: "tidak", hint: "phủ định tính từ = `tidak`" },
        ],
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra — bạn làm được chưa?",
        instruction_en: "Quick self-check — can you do each one?",
        items: [
          { vi: "Tôi đặt được phòng và hỏi giá (`pesan kamar`, `berapa harga`).", en: "I can book a room and ask the price (`pesan kamar`, `berapa harga`)." },
          { vi: "Tôi phân biệt được `di` (ở) và `ke` (đến).", en: "I can tell `di` (at) from `ke` (to)." },
          { vi: "Tôi phân biệt được `bisa` (có thể) và `boleh` (được phép).", en: "I can tell `bisa` (able) from `boleh` (allowed)." },
          { vi: "Tôi hỏi được phương tiện bằng `naik apa?`.", en: "I can ask about transport with `naik apa?`." },
          { vi: "Tôi nhận ra bị động `di-` trong thông báo (`ditunda`).", en: "I can recognize the di- passive in announcements (`ditunda`)." },
          { vi: "Tôi báo được sự cố và xin giúp (`tolong diperbaiki`, `Saya tersesat`).", en: "I can report a problem and ask for help (`tolong diperbaiki`, `Saya tersesat`)." },
        ],
      },
    ],
  },
];

export default lessons;
