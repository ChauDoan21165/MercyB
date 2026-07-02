// Family & Relationships Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (construction-worker.ts, food-cooking.ts…),
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
// Topic: the extended family (`keluarge besar`), weddings (`pernikahan`), the
// arisan rotating-savings social gathering, social events, and Indonesia's layered
// respect/address language (`Pak`, `Bu`, `Mas`, `Mbak`, `Kakak`, `Adik`). For
// Vietnamese speakers the kinship-respect instinct transfers well — Indonesian,
// like Vietnamese, picks an address word by relative age and status, not just "you".

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
    id: "indonesian_family_relationships",
    level: "A2",
    category: "social",
    title_vi: "Gia đình và các mối quan hệ",
    title_en: "Family and relationships",
    sentences: [
      // ── Introducing family ──────────────────────────────────────────────
      {
        en: "Ini keluarga besar saya.",
        vi: "Đây là đại gia đình của tôi.",
        pronunciation_focus: [
          "I-ni ke-lu-AR-ga be-SAR SA-ya — `keluarga besar` = đại gia đình (lit. 'gia đình lớn'); `ini` = đây/này.",
          "Lợi thế người Việt: trật tự danh từ + tính từ giống tiếng Việt — `keluarga besar` (gia đình lớn), không đảo như tiếng Anh.",
          "Lỗi người Việt: nói `besar keluarga`. Tính từ đứng SAU danh từ: `keluarga besar`.",
          "Luyện: `Ini keluarga besar saya.`",
        ],
        pronunciation_focus_en: [
          "I-ni ke-lu-AR-ga be-SAR SA-ya — `keluarga besar` = extended family (lit. 'big family'); `ini` = this/here is.",
          "VN-speaker win: noun + adjective order matches Vietnamese — `keluarga besar` (family big), no inversion.",
          "VN-speaker trap: saying `besar keluarga`. The adjective comes AFTER the noun: `keluarga besar`.",
          "Drill: `Ini keluarga besar saya.`",
        ],
      },
      {
        en: "Saya anak sulung dari tiga bersaudara.",
        vi: "Tôi là con cả trong ba anh chị em.",
        pronunciation_focus: [
          "SA-ya A-nak su-LUNG da-ri TI-ga ber-sau-DA-ra — `anak sulung` = con cả; `anak bungsu` = con út; `bersaudara` = anh chị em.",
          "Lỗi người Việt: dịch 'con cả' thành `anak besar`. Đúng là `anak sulung` (cụm cố định).",
          "Mẹo: `ber-` + `saudara` (anh em) = 'có quan hệ anh em' → `tiga bersaudara` = ba anh chị em.",
          "Luyện: `Saya anak sulung dari tiga bersaudara.`",
        ],
        pronunciation_focus_en: [
          "SA-ya A-nak su-LUNG da-ri TI-ga ber-sau-DA-ra — `anak sulung` = eldest child; `anak bungsu` = youngest; `bersaudara` = siblings.",
          "VN-speaker trap: translating 'eldest' as `anak besar`. The fixed phrase is `anak sulung`.",
          "Tip: `ber-` + `saudara` (sibling) = 'having sibling ties' → `tiga bersaudara` = three siblings.",
          "Drill: `Saya anak sulung dari tiga bersaudara.`",
        ],
      },
      {
        en: "Mas, sudah lama tidak bertemu!",
        vi: "Anh ơi, lâu rồi không gặp!",
        pronunciation_focus: [
          "mas, SU-dah LA-ma TI-dak ber-te-MU — `Mas` = anh (gọi đàn ông hơn tuổi, gốc Java); `sudah lama` = đã lâu; `bertemu` = gặp nhau.",
          "Lợi thế người Việt: bản năng gọi theo tuổi giống hệt tiếng Việt — chọn `Mas`/`Mbak` thay vì 'bạn' chung chung.",
          "Lỗi người Việt: dùng `kamu` (mày/bạn) với người hơn tuổi — nghe thiếu lễ độ. Dùng `Mas`/`Mbak`/`Pak`/`Bu`.",
          "Luyện: `Mas, sudah lama tidak bertemu!`",
        ],
        pronunciation_focus_en: [
          "mas, SU-dah LA-ma TI-dak ber-te-MU — `Mas` = older brother / older man (Javanese); `sudah lama` = (it's been) a long time; `bertemu` = to meet.",
          "VN-speaker win: the age-based address instinct is identical to Vietnamese — pick `Mas`/`Mbak` over a generic 'you'.",
          "VN-speaker trap: using `kamu` (you, casual) with an older person — it reads as rude. Use `Mas`/`Mbak`/`Pak`/`Bu`.",
          "Drill: `Mas, sudah lama tidak bertemu!`",
        ],
      },
      {
        en: "Bolehkah saya memanggil Anda Bu?",
        vi: "Cháu gọi cô là 'Bu' được không ạ?",
        pronunciation_focus: [
          "bo-LEH-kah SA-ya me-mang-GIL AN-da bu — `bolehkah` = có được không (lịch sự); `memanggil` = gọi (xưng hô); `Bu` = cô/bà.",
          "Mẹo: hậu tố `-kah` biến câu thành câu hỏi lịch sự trang trọng — `bolehkah?` mềm hơn `boleh?`.",
          "Lỗi người Việt: bỏ kính ngữ và hỏi cộc lốc. Người Indonesia rất coi trọng việc hỏi cách xưng hô.",
          "Luyện: `Bolehkah saya memanggil Anda Bu?`",
        ],
        pronunciation_focus_en: [
          "bo-LEH-kah SA-ya me-mang-GIL AN-da bu — `bolehkah` = may I (polite); `memanggil` = to call/address; `Bu` = ma'am/auntie.",
          "Tip: the suffix `-kah` turns a statement into a polite, formal question — `bolehkah?` is softer than `boleh?`.",
          "VN-speaker trap: dropping the honorific and asking bluntly. Indonesians care a lot about confirming how to address someone.",
          "Drill: `Bolehkah saya memanggil Anda Bu?`",
        ],
      },
      // ── Weddings ────────────────────────────────────────────────────────
      {
        en: "Saya diundang ke pernikahan sepupu saya.",
        vi: "Tôi được mời đến đám cưới của anh/chị họ tôi.",
        pronunciation_focus: [
          "SA-ya di-UN-dang ke per-ni-KA-han se-PU-pu SA-ya — `diundang` = được mời (bị động `di-`); `pernikahan` = đám cưới; `sepupu` = anh/chị/em họ.",
          "Mẹo: `di-` + `undang` = được mời. Thể bị động `di-` cực phổ biến — học nhận ra nó sớm.",
          "Lỗi người Việt: nói `saya undang` (= tôi mời người khác). Để nói 'tôi ĐƯỢC mời' phải là `saya diundang`.",
          "Luyện: `Saya diundang ke pernikahan sepupu saya.`",
        ],
        pronunciation_focus_en: [
          "SA-ya di-UN-dang ke per-ni-KA-han se-PU-pu SA-ya — `diundang` = was invited (di- passive); `pernikahan` = wedding; `sepupu` = cousin.",
          "Tip: `di-` + `undang` = be invited. The di- passive is everywhere — learn to spot it early.",
          "VN-speaker trap: `saya undang` means 'I invite (someone)'. To say 'I WAS invited' you need `saya diundang`.",
          "Drill: `Saya diundang ke pernikahan sepupu saya.`",
        ],
      },
      {
        en: "Selamat menempuh hidup baru!",
        vi: "Chúc mừng hai bạn bắt đầu cuộc sống mới!",
        pronunciation_focus: [
          "se-LA-mat me-nem-PUH hi-DUP BA-ru — câu chúc đám cưới cố định, nghĩa đen 'chúc đi trên cuộc sống mới'.",
          "Mẹo: `Selamat …` = lời chúc vạn năng — `Selamat pagi` (chào buổi sáng), `Selamat ulang tahun` (chúc sinh nhật).",
          "Lỗi người Việt: dịch sát từng chữ. Đây là một thành ngữ chúc — học nguyên cụm.",
          "Luyện: `Selamat menempuh hidup baru!`",
        ],
        pronunciation_focus_en: [
          "se-LA-mat me-nem-PUH hi-DUP BA-ru — a set wedding blessing, lit. 'congratulations on embarking on a new life'.",
          "Tip: `Selamat …` is the all-purpose well-wish — `Selamat pagi` (good morning), `Selamat ulang tahun` (happy birthday).",
          "VN-speaker trap: translating word-for-word. This is a fixed congratulatory idiom — learn it whole.",
          "Drill: `Selamat menempuh hidup baru!`",
        ],
      },
      {
        en: "Kami memberi amplop sebagai hadiah.",
        vi: "Chúng tôi tặng phong bì làm quà.",
        pronunciation_focus: [
          "KA-mi mem-be-RI am-PLOP se-ba-GAI ha-DI-ah — `amplop` = phong bì (tiền mừng); `memberi` = tặng/cho; `hadiah` = quà.",
          "Mẹo: `kami` = chúng tôi (KHÔNG gồm người nghe) ≠ `kita` = chúng ta (gồm người nghe). Người Việt hay nhầm hai từ này.",
          "Lỗi người Việt: dùng `kita` khi nói với chính người được mời. Nếu họ không nằm trong nhóm 'chúng tôi', dùng `kami`.",
          "Luyện: `Kami memberi amplop sebagai hadiah.`",
        ],
        pronunciation_focus_en: [
          "KA-mi mem-be-RI am-PLOP se-ba-GAI ha-DI-ah — `amplop` = envelope (cash gift); `memberi` = to give; `hadiah` = gift.",
          "Tip: `kami` = we (EXCLUDING the listener) ≠ `kita` = we (INCLUDING the listener). VN speakers often mix these up.",
          "VN-speaker trap: using `kita` when speaking to the very person invited. If they aren't in your 'we', use `kami`.",
          "Drill: `Kami memberi amplop sebagai hadiah.`",
        ],
      },
      // ── Arisan & social events ──────────────────────────────────────────
      {
        en: "Hari Minggu ada arisan di rumah Bu Sari.",
        vi: "Chủ nhật có buổi arisan (hụi) ở nhà cô Sari.",
        pronunciation_focus: [
          "HA-ri MING-gu A-da a-RI-san di ru-MAH bu SA-ri — `arisan` = hội hụi xoay vòng (vừa tiết kiệm vừa gặp gỡ); `di rumah` = ở nhà.",
          "Mẹo: `di` (ở/tại) ≠ `ke` (đến). `di rumah` = ở nhà; `ke rumah` = về/đến nhà. Người Việt hay lẫn.",
          "Lỗi người Việt: nói `ke rumah Bu Sari` khi ý là 'ĐANG Ở đó'. Sự kiện diễn ra TẠI một nơi → `di`.",
          "Luyện: `Hari Minggu ada arisan di rumah Bu Sari.`",
        ],
        pronunciation_focus_en: [
          "HA-ri MING-gu A-da a-RI-san di ru-MAH bu SA-ri — `arisan` = a rotating savings-and-social club; `di rumah` = at the house.",
          "Tip: `di` (at/in) ≠ `ke` (to). `di rumah` = at home; `ke rumah` = to the house. VN speakers confuse these.",
          "VN-speaker trap: saying `ke rumah Bu Sari` when you mean 'AT' it. An event held AT a place takes `di`.",
          "Drill: `Hari Minggu ada arisan di rumah Bu Sari.`",
        ],
      },
      {
        en: "Bulan ini giliran saya yang menang arisan.",
        vi: "Tháng này đến lượt tôi trúng hụi.",
        pronunciation_focus: [
          "BU-lan I-ni gi-LI-ran SA-ya yang me-NANG a-RI-san — `giliran` = lượt; `menang arisan` = trúng/lĩnh hụi tháng đó.",
          "Mẹo: `yang` = từ nối/đại từ quan hệ ('cái mà/người mà'). `saya yang menang` = chính tôi là người thắng.",
          "Lỗi người Việt: bỏ `yang` khi nhấn mạnh. `Giliran saya yang menang` nghe tự nhiên hơn `giliran saya menang`.",
          "Luyện: `Bulan ini giliran saya yang menang arisan.`",
        ],
        pronunciation_focus_en: [
          "BU-lan I-ni gi-LI-ran SA-ya yang me-NANG a-RI-san — `giliran` = turn; `menang arisan` = to win/receive that month's pot.",
          "Tip: `yang` = the relative connector ('the one who/that'). `saya yang menang` = I'm the one who wins.",
          "VN-speaker trap: dropping `yang` for emphasis. `Giliran saya yang menang` sounds more natural than `giliran saya menang`.",
          "Drill: `Bulan ini giliran saya yang menang arisan.`",
        ],
      },
      {
        en: "Jangan lupa bawa oleh-oleh untuk tuan rumah.",
        vi: "Đừng quên mang quà (đặc sản) cho chủ nhà.",
        pronunciation_focus: [
          "JA-ngan LU-pa BA-wa o-leh-O-leh un-TUK tu-AN ru-MAH — `oleh-oleh` = quà mang về (đặc sản); `tuan rumah` = chủ nhà.",
          "Mẹo: từ lặp đôi `oleh-oleh` là số nhiều/khái niệm — kiểu tạo từ đặc trưng của tiếng Indonesia.",
          "Lỗi người Việt: dùng `tidak` cho mệnh lệnh cấm. Để nói 'đừng' phải dùng `jangan`, không phải `tidak`.",
          "Luyện: `Jangan lupa bawa oleh-oleh untuk tuan rumah.`",
        ],
        pronunciation_focus_en: [
          "JA-ngan LU-pa BA-wa o-leh-O-leh un-TUK tu-AN ru-MAH — `oleh-oleh` = a gift/souvenir of local food; `tuan rumah` = the host.",
          "Tip: the reduplication `oleh-oleh` signals a plural/concept — a hallmark Indonesian word-building pattern.",
          "VN-speaker trap: using `tidak` for a prohibition. To say 'don't', you must use `jangan`, never `tidak`.",
          "Drill: `Jangan lupa bawa oleh-oleh untuk tuan rumah.`",
        ],
      },
      // ── Respect & relationships ─────────────────────────────────────────
      {
        en: "Saya harus minta izin orang tua dulu.",
        vi: "Tôi phải xin phép cha mẹ trước đã.",
        pronunciation_focus: [
          "SA-ya HA-rus MIN-ta i-ZIN o-rang-TU-a DU-lu — `minta izin` = xin phép; `orang tua` = cha mẹ (lit. 'người già'); `dulu` = trước đã.",
          "Mẹo: `orang tua` ghép từ `orang` (người) + `tua` (già) = cha mẹ — đừng dịch sát thành 'người già'.",
          "Lỗi người Việt: bỏ `dulu`. Đặt cuối câu, `dulu` = 'trước đã/đã' (làm việc này trước).",
          "Luyện: `Saya harus minta izin orang tua dulu.`",
        ],
        pronunciation_focus_en: [
          "SA-ya HA-rus MIN-ta i-ZIN o-rang-TU-a DU-lu — `minta izin` = to ask permission; `orang tua` = parents (lit. 'old person'); `dulu` = first.",
          "Tip: `orang tua` = `orang` (person) + `tua` (old) = parents — don't read it literally as 'old people'.",
          "VN-speaker trap: dropping `dulu`. Placed at the end, `dulu` = 'first / beforehand' (do this first).",
          "Drill: `Saya harus minta izin orang tua dulu.`",
        ],
      },
      {
        en: "Mertua saya sangat baik kepada saya.",
        vi: "Cha mẹ chồng/vợ tôi rất tốt với tôi.",
        pronunciation_focus: [
          "mer-TU-a SA-ya SA-ngat BA-ik ke-PA-da SA-ya — `mertua` = cha mẹ chồng/vợ; `menantu` = con dâu/rể; `kepada` = đối với.",
          "Mẹo: `kepada` (đối với/tới ai đó) dùng với người; `ke` dùng với nơi chốn. `baik kepada saya` = tốt với tôi.",
          "Lỗi người Việt: dùng `ke saya` thay `kepada saya`. Với người, dùng `kepada`.",
          "Luyện: `Mertua saya sangat baik kepada saya.`",
        ],
        pronunciation_focus_en: [
          "mer-TU-a SA-ya SA-ngat BA-ik ke-PA-da SA-ya — `mertua` = parents-in-law; `menantu` = son/daughter-in-law; `kepada` = toward (a person).",
          "Tip: `kepada` (to/toward a person) is for people; `ke` is for places. `baik kepada saya` = kind to me.",
          "VN-speaker trap: using `ke saya` instead of `kepada saya`. For people, use `kepada`.",
          "Drill: `Mertua saya sangat baik kepada saya.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Gia đình ở Indonesia thường là `keluarga besar` (đại gia đình) gắn bó: ông bà, cô dì chú bác, anh chị em họ (`sepupu`) đều thân thiết. Cách xưng hô theo tuổi và vai vế rất quan trọng — gọi đàn ông lớn tuổi là `Pak/Bapak`, phụ nữ lớn tuổi là `Bu/Ibu`; người hơn tuổi nhưng còn trẻ là `Mas` (nam, gốc Java) và `Mbak` (nữ); em nhỏ hơn là `Adik` (`Dik`), anh/chị là `Kakak` (`Kak`). Gọi ai bằng `kamu` khi họ hơn tuổi bị xem là vô lễ. `Arisan` là hội phụ nữ (đôi khi cả nam) góp tiền xoay vòng mỗi tháng — vừa tiết kiệm, vừa là sự kiện giao tế quan trọng; mỗi kỳ một người 'trúng' nhận cả quỹ. Đám cưới (`pernikahan`) thường rất đông, khách mang `amplop` (phong bì tiền) thay vì quà gói. Khi đến nhà ai, mang theo `oleh-oleh` (quà đặc sản) là phép lịch sự cơ bản.",
    cultural_notes_en:
      "Indonesian families are typically a close-knit `keluarga besar` (extended family): grandparents, aunts/uncles, and cousins (`sepupu`) all stay close. Address by age and rank matters a great deal — call an older man `Pak/Bapak`, an older woman `Bu/Ibu`; a slightly older but still young man `Mas` (Javanese) and woman `Mbak`; a younger person `Adik` (`Dik`), an older sibling `Kakak` (`Kak`). Calling someone `kamu` when they're your senior reads as rude. `Arisan` is a women's (sometimes mixed) rotating-savings club that meets monthly — both a savings scheme and a key social event; each round one member 'wins' the whole pot. Weddings (`pernikahan`) are large; guests bring an `amplop` (cash envelope) instead of a wrapped gift. When visiting someone's home, bringing `oleh-oleh` (a local-food gift) is basic courtesy.",
    tip_advice_vi:
      "Ưu tiên học 'bộ xưng hô' trước mọi thứ khác: `Pak`/`Bu` (lớn tuổi, trang trọng), `Mas`/`Mbak` (hơn tuổi, trẻ), `Kakak`/`Adik` (anh-chị / em). Người Việt có lợi thế lớn vì bản năng chọn từ theo tuổi giống hệt tiếng Việt — chỉ cần đổi từ. Ba khác biệt cần nhớ: (1) `kami` (chúng tôi, không gồm người nghe) ≠ `kita` (chúng ta, gồm người nghe); (2) `di` (ở) ≠ `ke` (đến); (3) `jangan` (đừng — cho mệnh lệnh cấm) ≠ `tidak` (không — phủ định thường). Tin vui: không chia động từ, không có giống, không thanh điệu — câu của bạn ngắn gần như tiếng Việt.",
    tip_advice_en:
      "Learn the 'address kit' before anything else: `Pak`/`Bu` (older, formal), `Mas`/`Mbak` (older but young), `Kakak`/`Adik` (older / younger sibling). Vietnamese speakers have a big edge here — the age-based word choice mirrors Vietnamese, so you just swap the word. Keep three distinctions straight: (1) `kami` (we, excluding the listener) ≠ `kita` (we, including the listener); (2) `di` (at) ≠ `ke` (to); (3) `jangan` (don't — for prohibitions) ≠ `tidak` (not — ordinary negation). The good news: no conjugation, no gender, no tones — your sentences stay almost as short as Vietnamese.",
    vocabulary: [
      // ── Family members ──────────────────────────────────────────────
      {
        word: "keluarga",
        en: "family",
        vi: "gia đình",
        pos: "noun",
        pronunciation_vi: "ke-lu-AR-ga — `keluarga besar` = đại gia đình",
        pronunciation_en: "ke-lu-AR-ga — `keluarga besar` = extended family",
      },
      {
        word: "orang tua",
        en: "parents",
        vi: "cha mẹ",
        pos: "noun",
        pronunciation_vi: "o-rang-TU-a — lit. 'người già'; đừng dịch sát",
        pronunciation_en: "o-rang-TU-a — lit. 'old person'; not literal",
      },
      {
        word: "saudara",
        en: "sibling / relative",
        vi: "anh chị em / họ hàng",
        pos: "noun",
        pronunciation_vi: "sau-DA-ra — `bersaudara` = có quan hệ anh em",
        pronunciation_en: "sau-DA-ra — `bersaudara` = to be siblings",
      },
      {
        word: "kakak",
        en: "older sibling",
        vi: "anh / chị",
        pos: "noun",
        pronunciation_vi: "KA-kak — gọi tắt `Kak`; dùng cho cả nam lẫn nữ hơn tuổi",
        pronunciation_en: "KA-kak — short `Kak`; for an older person of either sex",
      },
      {
        word: "adik",
        en: "younger sibling",
        vi: "em",
        pos: "noun",
        pronunciation_vi: "A-dik — gọi tắt `Dik`; đọc rõ `k` cuối",
        pronunciation_en: "A-dik — short `Dik`; sound the final `k`",
      },
      {
        word: "sepupu",
        en: "cousin",
        vi: "anh/chị/em họ",
        pos: "noun",
        pronunciation_vi: "se-PU-pu — không phân biệt nội/ngoại như tiếng Việt",
        pronunciation_en: "se-PU-pu — no paternal/maternal split like Vietnamese",
      },
      {
        word: "mertua",
        en: "parents-in-law",
        vi: "cha mẹ chồng/vợ",
        pos: "noun",
        pronunciation_vi: "mer-TU-a — `menantu` = con dâu/rể",
        pronunciation_en: "mer-TU-a — `menantu` = son/daughter-in-law",
      },
      {
        word: "anak sulung",
        en: "eldest child",
        vi: "con cả",
        pos: "noun phrase",
        pronunciation_vi: "A-nak su-LUNG — `anak bungsu` = con út",
        pronunciation_en: "A-nak su-LUNG — `anak bungsu` = youngest child",
      },
      // ── Address & respect ───────────────────────────────────────────
      {
        word: "Bapak / Pak",
        en: "Mr. / sir / older man",
        vi: "ông / bác (nam, trang trọng)",
        pos: "title",
        pronunciation_vi: "BA-pak / pak — kính ngữ với đàn ông lớn tuổi",
        pronunciation_en: "BA-pak / pak — respectful for an older man",
      },
      {
        word: "Ibu / Bu",
        en: "Mrs./Ms. / ma'am / older woman",
        vi: "bà / cô (nữ, trang trọng)",
        pos: "title",
        pronunciation_vi: "I-bu / bu — kính ngữ với phụ nữ lớn tuổi",
        pronunciation_en: "I-bu / bu — respectful for an older woman",
      },
      {
        word: "Mas",
        en: "older brother / young man (Javanese)",
        vi: "anh (nam, trẻ hơn Pak)",
        pos: "title",
        pronunciation_vi: "mas — gọi đàn ông hơn tuổi nhưng còn trẻ",
        pronunciation_en: "mas — for an older-but-young man",
      },
      {
        word: "Mbak",
        en: "older sister / young woman (Javanese)",
        vi: "chị (nữ, trẻ hơn Bu)",
        pos: "title",
        pronunciation_vi: "mbak — `mb` ngậm môi rồi bật; chị trẻ",
        pronunciation_en: "mbak — hold the `mb` then release; young woman",
      },
      // ── Weddings & events ───────────────────────────────────────────
      {
        word: "pernikahan",
        en: "wedding",
        vi: "đám cưới",
        pos: "noun",
        pronunciation_vi: "per-ni-KA-han — `menikah` = kết hôn",
        pronunciation_en: "per-ni-KA-han — `menikah` = to marry",
      },
      {
        word: "undangan",
        en: "invitation",
        vi: "thiệp mời / lời mời",
        pos: "noun",
        pronunciation_vi: "un-DA-ngan — `diundang` = được mời (bị động)",
        pronunciation_en: "un-DA-ngan — `diundang` = be invited (passive)",
      },
      {
        word: "amplop",
        en: "envelope (cash gift)",
        vi: "phong bì (tiền mừng)",
        pos: "noun",
        pronunciation_vi: "am-PLOP — đọc rõ `p` cuối; quà cưới thông dụng",
        pronunciation_en: "am-PLOP — sound the final `p`; the usual wedding gift",
      },
      {
        word: "hadiah",
        en: "gift",
        vi: "quà",
        pos: "noun",
        pronunciation_vi: "ha-DI-ah — `kado` (khẩu ngữ) cũng = món quà",
        pronunciation_en: "ha-DI-ah — `kado` (casual) also = a present",
      },
      {
        word: "oleh-oleh",
        en: "souvenir / food gift",
        vi: "quà đặc sản mang về",
        pos: "noun",
        pronunciation_vi: "o-leh-O-leh — từ lặp đôi; mang khi đến thăm nhà",
        pronunciation_en: "o-leh-O-leh — reduplication; bring when visiting",
      },
      // ── Arisan & social life ────────────────────────────────────────
      {
        word: "arisan",
        en: "rotating savings club",
        vi: "hội hụi xoay vòng",
        pos: "noun",
        pronunciation_vi: "a-RI-san — vừa tiết kiệm vừa gặp gỡ hàng tháng",
        pronunciation_en: "a-RI-san — monthly savings-plus-social gathering",
      },
      {
        word: "tetangga",
        en: "neighbor",
        vi: "hàng xóm",
        pos: "noun",
        pronunciation_vi: "te-TANG-ga — `ngg` ngậm rồi bật",
        pronunciation_en: "te-TANG-ga — hold the `ngg` then release",
      },
      {
        word: "tuan rumah",
        en: "host / homeowner",
        vi: "chủ nhà",
        pos: "noun phrase",
        pronunciation_vi: "tu-AN ru-MAH — người tổ chức/đón khách",
        pronunciation_en: "tu-AN ru-MAH — the one hosting guests",
      },
      {
        word: "silaturahmi",
        en: "keeping up family/social ties",
        vi: "thăm viếng, gắn kết tình thân",
        pos: "noun",
        pronunciation_vi: "si-la-tu-RAH-mi — gốc Ả Rập; giá trị xã hội quan trọng",
        pronunciation_en: "si-la-tu-RAH-mi — Arabic root; a key social value",
      },
      {
        word: "gotong royong",
        en: "communal mutual help",
        vi: "tinh thần tương trợ cộng đồng",
        pos: "noun phrase",
        pronunciation_vi: "GO-tong RO-yong — cùng nhau lo việc chung",
        pronunciation_en: "GO-tong RO-yong — pitching in together",
      },
      // ── Useful verbs ────────────────────────────────────────────────
      {
        word: "bertemu",
        en: "to meet",
        vi: "gặp nhau",
        pos: "verb",
        pronunciation_vi: "ber-te-MU — `ber-` = qua lại; `sudah lama tidak bertemu` = lâu không gặp",
        pronunciation_en: "ber-te-MU — `ber-` = reciprocal; `sudah lama tidak bertemu` = long time no see",
      },
      {
        word: "memanggil",
        en: "to call / to address (as)",
        vi: "gọi (xưng hô)",
        pos: "verb",
        pronunciation_vi: "me-mang-GIL — `panggil` + `me-`; `panggil saya Pak` = gọi tôi là Pak",
        pronunciation_en: "me-mang-GIL — `panggil` + `me-`; `panggil saya Pak` = call me Pak",
      },
      {
        word: "minta izin",
        en: "to ask permission",
        vi: "xin phép",
        pos: "verb phrase",
        pronunciation_vi: "MIN-ta i-ZIN — phép lịch sự cơ bản với người lớn",
        pronunciation_en: "MIN-ta i-ZIN — basic courtesy toward elders",
      },
    ],
    dialogue: [
      // Dialogue: meeting relatives at an arisan, getting an invitation
      {
        speaker: "Bu Sari",
        text: "Eh, Mas Anto! Sudah lama tidak bertemu. Apa kabar keluarga?",
        vi: "Ơ, anh Anto! Lâu rồi không gặp. Gia đình anh khỏe không?",
        en: "Oh, Anto! Long time no see. How's the family?",
      },
      {
        speaker: "Anto",
        text: "Baik, Bu. Ini istri saya, dan ini anak bungsu kami.",
        vi: "Khỏe ạ, cô. Đây là vợ tôi, còn đây là con út nhà tôi.",
        en: "Good, ma'am. This is my wife, and this is our youngest child.",
      },
      {
        speaker: "Bu Sari",
        text: "Wah, manis sekali! Hari Minggu ada arisan di rumah saya, datang ya.",
        vi: "Chà, dễ thương quá! Chủ nhật có buổi arisan ở nhà tôi, đến nhé.",
        en: "Aw, so sweet! There's an arisan at my place on Sunday — do come.",
      },
      {
        speaker: "Anto",
        text: "Terima kasih undangannya, Bu. Kami pasti datang.",
        vi: "Cảm ơn lời mời, cô. Chúng tôi nhất định đến.",
        en: "Thank you for the invitation, ma'am. We'll definitely come.",
      },
      {
        speaker: "Istri Anto",
        text: "Kami bawa oleh-oleh dari kampung, Bu. Boleh, kan?",
        vi: "Chúng tôi mang chút quà quê đến, cô nhé. Được chứ ạ?",
        en: "We'll bring some food gift from our hometown, ma'am. Is that okay?",
      },
      {
        speaker: "Bu Sari",
        text: "Tentu boleh! Jangan sungkan. Oh ya, bulan depan sepupu saya menikah juga.",
        vi: "Tất nhiên được! Đừng ngại. À này, tháng sau anh/chị họ tôi cũng cưới đấy.",
        en: "Of course! Don't be shy. Oh, and my cousin gets married next month too.",
      },
      {
        speaker: "Anto",
        text: "Selamat! Sampaikan salam dan ucapan selamat menempuh hidup baru dari kami.",
        vi: "Chúc mừng! Cho chúng tôi gửi lời chào và lời chúc trăm năm hạnh phúc.",
        en: "Congratulations! Pass on our greetings and best wishes for the newlyweds.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Đây là đại gia đình của tôi.", answer: "Ini keluarga besar saya." },
          { prompt: "Tôi được mời đến đám cưới.", answer: "Saya diundang ke pernikahan." },
          { prompt: "Lâu rồi không gặp anh!", answer: "Sudah lama tidak bertemu, Mas!" },
          { prompt: "Tôi phải xin phép cha mẹ trước.", answer: "Saya harus minta izin orang tua dulu." },
          { prompt: "Đừng quên mang quà đặc sản.", answer: "Jangan lupa bawa oleh-oleh." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Indonesia:",
        instruction_en: "Extra practice — translate into Indonesian:",
        items: [
          { prompt: "Cháu gọi cô là 'Bu' được không ạ?", answer: "Bolehkah saya memanggil Anda Bu?" },
          { prompt: "Tháng này đến lượt tôi trúng hụi.", answer: "Bulan ini giliran saya yang menang arisan." },
          { prompt: "Chúng tôi tặng phong bì làm quà.", answer: "Kami memberi amplop sebagai hadiah." },
          { prompt: "Cha mẹ chồng tôi rất tốt với tôi.", answer: "Mertua saya sangat baik kepada saya." },
          { prompt: "Chúc mừng hai bạn bắt đầu cuộc sống mới!", answer: "Selamat menempuh hidup baru!" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn cách xưng hô đúng (`Pak`, `Bu`, `Mas`, `Mbak`, `Adik`):",
        instruction_en:
          "Choose the right form of address (`Pak`, `Bu`, `Mas`, `Mbak`, `Adik`):",
        items: [
          { prompt: "Gọi một người đàn ông lớn tuổi, trang trọng: ___", answer: "Pak", hint: "ông / bác (nam)" },
          { prompt: "Gọi một phụ nữ lớn tuổi, trang trọng: ___", answer: "Bu", hint: "bà / cô (nữ)" },
          { prompt: "Gọi một anh trẻ hơn Pak một chút: ___", answer: "Mas", hint: "anh (nam, trẻ)" },
          { prompt: "Gọi một em nhỏ tuổi hơn mình: ___", answer: "Adik", hint: "em (gọi tắt `Dik`)" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Điền `di` (ở) hoặc `ke` (đến), và `kami`/`kita`, `jangan`/`tidak` cho đúng:",
        instruction_en:
          "Fill in `di` (at) or `ke` (to), and the right `kami`/`kita`, `jangan`/`tidak`:",
        items: [
          { prompt: "Ada arisan ___ rumah Bu Sari.", answer: "di", hint: "sự kiện diễn ra TẠI một nơi = `di`" },
          { prompt: "Hari Minggu kami pergi ___ pesta.", answer: "ke", hint: "di chuyển ĐẾN = `ke`" },
          { prompt: "Ini hadiah dari ___ (chúng tôi, không gồm bạn).", answer: "kami", hint: "không gồm người nghe = `kami`" },
          { prompt: "___ lupa bawa undangan!", answer: "Jangan", hint: "mệnh lệnh cấm 'đừng' = `jangan`" },
        ],
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra — bạn làm được chưa?",
        instruction_en: "Quick self-check — can you do each one?",
        items: [
          { vi: "Tôi chọn được `Pak/Bu/Mas/Mbak` theo tuổi và giới.", en: "I can pick `Pak/Bu/Mas/Mbak` by age and gender." },
          { vi: "Tôi phân biệt được `kami` (không gồm bạn) và `kita` (gồm bạn).", en: "I can tell `kami` (excl. you) from `kita` (incl. you)." },
          { vi: "Tôi phân biệt được `di` (ở) và `ke` (đến).", en: "I can tell `di` (at) from `ke` (to)." },
          { vi: "Tôi nhận ra thể bị động `di-` (vd: `diundang`).", en: "I can recognize the di- passive (e.g. `diundang`)." },
          { vi: "Tôi biết hỏi cách xưng hô một cách lịch sự.", en: "I can politely ask how to address someone." },
          { vi: "Tôi biết mang `oleh-oleh` khi đến thăm nhà.", en: "I know to bring `oleh-oleh` when visiting a home." },
        ],
      },
    ],
  },
];

export default lessons;
