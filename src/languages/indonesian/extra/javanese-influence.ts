// Javanese Influence on Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (construction-worker, healthcare-emergency,
// restaurant-hospitality, school-education, phone-calls, public-services,
// apartment-neighbors, reduplication), which in turn mirror the French `FrenchLesson`
// shape. When the shared Indonesian registry (src/languages/indonesian/lessons.ts)
// lands, swap the local types for a shared import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian, often with an everyday Javanese loanword), and `vi` holds the
// Vietnamese gloss. `pronunciation_focus` carries Vietnamese-facing pronunciation +
// culture notes (incl. the common Vietnamese-speaker mistake = L1 note + a correction
// drill); `pronunciation_focus_en` is the English-speaker companion, same length + order.
//
// TOPIC — Javanese influence + kromo/ngoko awareness. Javanese (basa Jawa) is the
// largest regional language (~80M speakers), so Javanese words have soaked into
// everyday standard Indonesian (`monggo`, `matur nuwun`, `nggih`, `mbak`, `mas`).
// Javanese itself has speech LEVELS — `ngoko` (casual/intimate) and `kromo`
// (refined/respectful) — and that politeness instinct colors how Central/East
// Javanese people use Indonesian too. For Vietnamese speakers (whose own culture is
// strongly hierarchy-and-respect oriented) this maps onto familiar intuitions, but
// the SPECIFIC words and the regional-sensitivity rules must be learned.
// CULTURAL-SENSITIVITY NOTE: this lesson teaches recognition + warmth, not fluent
// Javanese. The core advice is to be gracious, never to fake a register you can't
// sustain or to assume every Indonesian is Javanese.

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
  /** Indonesian/Javanese word/phrase. */
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
  /** Indonesian/Javanese line. */
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
    id: "indonesian_javanese_influence",
    level: "B1",
    category: "culture_language",
    title_vi: "Ảnh hưởng tiếng Java và ý thức kromo–ngoko",
    title_en: "Javanese influence and kromo–ngoko awareness",
    sentences: [
      // ── Everyday Javanese loanwords in standard Indonesian ────────────────
      {
        en: "Monggo, silakan masuk dan duduk.",
        vi: "Mời anh/chị, cứ vào và ngồi đi ạ.",
        pronunciation_focus: [
          "MONG-go, si-LA-kan MA-suk dan DU-duk — `monggo` (tiếng Java) = mời/xin mời, dùng kèm `silakan` cho ấm áp.",
          "Mẹo văn hóa: `monggo` nghe khắp Trung & Đông Java; là lời mời lịch sự, cũng để 'xin phép đi qua/cáo từ'.",
          "Lỗi người Việt: tách `ngg` trong `monggo`. `ngg` là một âm mũi ngậm rồi bật: MONG-go.",
          "Luyện: `Monggo, silakan masuk.`",
        ],
        pronunciation_focus_en: [
          "MONG-go, si-LA-kan MA-suk dan DU-duk — `monggo` (Javanese) = please/come in, paired with `silakan` for warmth.",
          "Culture tip: `monggo` is heard all over Central & East Java; a polite invite, also used to 'excuse oneself' passing or leaving.",
          "VN-speaker trap: splitting the `ngg` in `monggo`. It's one held-then-released nasal: MONG-go.",
          "Drill: `Monggo, silakan masuk.`",
        ],
      },
      {
        en: "Matur nuwun, ya. Makanannya enak sekali.",
        vi: "Cảm ơn nhiều nhé. Đồ ăn ngon lắm.",
        pronunciation_focus: [
          "MA-tur NU-wun, ya. ma-KA-nan-nya E-nak se-KA-li — `matur nuwun` (tiếng Java) = cảm ơn (lịch sự).",
          "Mẹo: `matur nuwun` là 'cảm ơn' kiểu kromo (trang nhã); bản ngoko ngắn gọn là `nuwun`/`suwun`.",
          "Lỗi người Việt: trộn lung tung. Nếu chưa chắc, cứ dùng `terima kasih` (chuẩn Indonesia) — luôn an toàn, lịch sự.",
          "Luyện: `Matur nuwun, ya.`",
        ],
        pronunciation_focus_en: [
          "MA-tur NU-wun, ya. ma-KA-nan-nya E-nak se-KA-li — `matur nuwun` (Javanese) = thank you (polite).",
          "Tip: `matur nuwun` is 'thank you' in refined kromo; the short ngoko form is `nuwun`/`suwun`.",
          "VN-speaker trap: mixing levels randomly. When unsure, just use `terima kasih` (standard Indonesian) — always safe and polite.",
          "Drill: `Matur nuwun, ya.`",
        ],
      },
      {
        en: "Mbak, pesan teh hangat satu, nggih.",
        vi: "Chị ơi, cho em một ly trà nóng nhé.",
        pronunciation_focus: [
          "mbak, PE-san teh HA-ngat SA-tu, nggih — `mbak` = chị (gọi phụ nữ trẻ); `nggih` (tiếng Java) = vâng/dạ.",
          "Mẹo: `mbak` (chị) và `mas` (anh) gốc Java nhưng nay dùng khắp Indonesia để gọi người phục vụ, người trẻ — rất thông dụng & thân thiện.",
          "Lỗi người Việt: âm đầu `mb` trong `mbak` khó — ngậm môi 'm' rồi bật 'bak' liền, không thêm nguyên âm.",
          "Luyện: `Mbak, pesan teh satu.`",
        ],
        pronunciation_focus_en: [
          "mbak, PE-san teh HA-ngat SA-tu, nggih — `mbak` = miss/older sister (young woman); `nggih` (Javanese) = yes/okay (polite).",
          "Tip: `mbak` (miss) and `mas` (mister) are Javanese in origin but now used nationwide for servers and young people — very common & friendly.",
          "VN-speaker trap: the initial `mb` in `mbak` is hard — hum 'm' then release 'bak' with no inserted vowel.",
          "Drill: `Mbak, pesan teh satu.`",
        ],
      },
      {
        en: "Mas, tolong antar paket ini ke alamat ini, ya.",
        vi: "Anh ơi, làm ơn giao gói hàng này tới địa chỉ này nhé.",
        pronunciation_focus: [
          "mas, TO-long AN-tar PA-ket I-ni ke a-LA-mat I-ni, ya — `mas` = anh (gọi nam giới trẻ, lịch sự thân thiện).",
          "Mẹo: gọi `Mas`/`Mbak` ấm hơn gọi trống không; gọi tài xế ojek, người bán, người lạ trẻ tuổi đều hợp.",
          "Lỗi người Việt: đọc `mas` thành 'mát'. Nguyên âm `a` mở, `s` cuối rõ: 'mas'.",
          "Luyện: `Mas, tolong antar paket ini.`",
        ],
        pronunciation_focus_en: [
          "mas, TO-long AN-tar PA-ket I-ni ke a-LA-mat I-ni, ya — `mas` = mister/older brother (young man, friendly-polite).",
          "Tip: `Mas`/`Mbak` is warmer than addressing no one; works for ojek drivers, vendors, young strangers.",
          "VN-speaker trap: saying `mas` like 'mat'. Open `a`, clear final `s`: 'mas'.",
          "Drill: `Mas, tolong antar paket ini.`",
        ],
      },
      // ── kromo vs ngoko awareness ──────────────────────────────────────────
      {
        en: "Di Jawa, bahasa berubah tergantung lawan bicara.",
        vi: "Ở đảo Java, ngôn ngữ thay đổi tùy theo người đối thoại.",
        pronunciation_focus: [
          "di JA-wa, ba-HA-sa be-RU-bah ter-GAN-tung LA-wan bi-CA-ra — `tergantung` = tùy thuộc; `lawan bicara` = người đối thoại.",
          "Mẹo văn hóa: tiếng Java có 'tầng' lịch sự — `ngoko` (thân/suồng sã) và `kromo` (trang nhã, với người trên). Chọn tầng sai bị xem là bất lịch sự.",
          "Lỗi người Việt: `c` trong `bicara` đọc 'ch' → 'bi-CHA-ra'.",
          "Luyện: `Bahasa berubah tergantung lawan bicara.`",
        ],
        pronunciation_focus_en: [
          "di JA-wa, ba-HA-sa be-RU-bah ter-GAN-tung LA-wan bi-CA-ra — `tergantung` = depends on; `lawan bicara` = the person you talk to.",
          "Culture tip: Javanese has politeness 'levels' — `ngoko` (casual/intimate) and `kromo` (refined, for elders/superiors). Choosing wrong reads as rude.",
          "VN-speaker trap: `c` in `bicara` is 'ch' → 'bi-CHA-ra'.",
          "Drill: `Bahasa berubah tergantung lawan bicara.`",
        ],
      },
      {
        en: "Kepada orang yang lebih tua, orang Jawa pakai bahasa kromo.",
        vi: "Với người lớn tuổi hơn, người Java dùng tiếng kromo (trang nhã).",
        pronunciation_focus: [
          "ke-PA-da O-rang yang LE-bih TU-a, O-rang JA-wa PA-kai ba-HA-sa KRO-mo — `kromo` = tầng lịch sự cao; `pakai` = dùng.",
          "Mẹo: ý thức `kromo` rất giống bản năng tiếng Việt: chọn từ xưng hô theo tuổi/vị thế. Người Việt nắm điều này rất nhanh.",
          "Lỗi người Việt: tưởng `kromo` chỉ là 'từ lịch sự'. Nó là cả MỘT BỘ từ vựng khác cho cùng nghĩa (vd 'ăn': ngoko `mangan` ↔ kromo `dhahar`).",
          "Luyện: `Pakai bahasa kromo kepada orang tua.`",
        ],
        pronunciation_focus_en: [
          "ke-PA-da O-rang yang LE-bih TU-a, O-rang JA-wa PA-kai ba-HA-sa KRO-mo — `kromo` = the high politeness level; `pakai` = to use.",
          "Tip: the `kromo` instinct closely mirrors Vietnamese: pick address terms by age/status. Vietnamese speakers grasp this fast.",
          "VN-speaker trap: thinking `kromo` is just 'polite words'. It's a whole SEPARATE vocabulary for the same meanings (e.g. 'eat': ngoko `mangan` ↔ kromo `dhahar`).",
          "Drill: `Pakai bahasa kromo kepada orang tua.`",
        ],
      },
      {
        en: "Saya orang Vietnam, jadi saya pakai bahasa Indonesia saja.",
        vi: "Tôi là người Việt Nam, nên tôi chỉ dùng tiếng Indonesia thôi.",
        pronunciation_focus: [
          "SA-ya O-rang vi-et-NAM, JA-di SA-ya PA-kai ba-HA-sa in-do-NE-sia SA-ja — `saja` = chỉ/thôi.",
          "Mẹo VÀNG: bạn KHÔNG cần nói tiếng Java. Dùng tiếng Indonesia chuẩn + lịch sự là hoàn toàn ổn và được tôn trọng.",
          "Lỗi người Việt: gắng chêm tiếng Java cho 'hòa nhập' rồi dùng sai tầng → phản tác dụng. Thành thật về xuất thân lại được quý.",
          "Luyện: `Saya pakai bahasa Indonesia saja.`",
        ],
        pronunciation_focus_en: [
          "SA-ya O-rang vi-et-NAM, JA-di SA-ya PA-kai ba-HA-sa in-do-NE-sia SA-ja — `saja` = only/just.",
          "GOLDEN tip: you do NOT need to speak Javanese. Standard, polite Indonesian is completely fine and respected.",
          "VN-speaker trap: forcing Javanese to 'fit in' and getting the level wrong → backfires. Being honest about where you're from is appreciated.",
          "Drill: `Saya pakai bahasa Indonesia saja.`",
        ],
      },
      {
        en: "Maaf, saya belum bisa bahasa Jawa, tapi sedang belajar.",
        vi: "Xin lỗi, tôi chưa biết tiếng Java, nhưng đang học.",
        pronunciation_focus: [
          "ma-AF, SA-ya be-LUM BI-sa ba-HA-sa JA-wa, TA-pi SE-dang be-LA-jar — `belum bisa` = chưa biết/chưa thể.",
          "Mẹo: `belum` (chưa) lịch hơn `tidak` (không) — ngụ ý 'sẽ học'. Câu này luôn được đón nhận nồng hậu.",
          "Lỗi người Việt: nói `tidak bisa bahasa Jawa` (nghe như từ chối học). Dùng `belum bisa ... sedang belajar`.",
          "Luyện: `Saya belum bisa bahasa Jawa, tapi sedang belajar.`",
        ],
        pronunciation_focus_en: [
          "ma-AF, SA-ya be-LUM BI-sa ba-HA-sa JA-wa, TA-pi SE-dang be-LA-jar — `belum bisa` = can't yet / don't know yet.",
          "Tip: `belum` (not yet) is gentler than `tidak` (not) — it implies 'I'll learn'. This line always lands warmly.",
          "VN-speaker trap: saying `tidak bisa bahasa Jawa` (sounds like refusing to learn). Use `belum bisa ... sedang belajar`.",
          "Drill: `Saya belum bisa bahasa Jawa, tapi sedang belajar.`",
        ],
      },
      // ── Sensitivity: not everyone is Javanese ─────────────────────────────
      {
        en: "Indonesia punya banyak suku, bukan hanya orang Jawa.",
        vi: "Indonesia có rất nhiều dân tộc, không chỉ riêng người Java.",
        pronunciation_focus: [
          "in-do-NE-sia PU-nya BA-nyak SU-ku, BU-kan HA-nya O-rang JA-wa — `suku` = dân tộc/tộc người; `bukan hanya` = không chỉ.",
          "Mẹo nhạy cảm: ngoài Java còn Sunda, Batak, Minang, Bugis... Đừng mặc định ai cũng là người Java hay nói tiếng Java.",
          "Lỗi người Việt: dùng `bukan` (phủ định danh từ) thay `tidak`. Ở đây phủ định 'người Java' = danh từ → `bukan`.",
          "Luyện: `Bukan hanya orang Jawa.`",
        ],
        pronunciation_focus_en: [
          "in-do-NE-sia PU-nya BA-nyak SU-ku, BU-kan HA-nya O-rang JA-wa — `suku` = ethnic group; `bukan hanya` = not only.",
          "Sensitivity tip: beyond Javanese there are Sundanese, Batak, Minang, Bugis... Don't assume everyone is Javanese or speaks Javanese.",
          "VN-speaker trap: using `bukan` (negates nouns) vs `tidak`. Here we negate 'Javanese people' = a noun → `bukan`.",
          "Drill: `Bukan hanya orang Jawa.`",
        ],
      },
      {
        en: "Boleh saya tahu, Mas asli mana?",
        vi: "Cho em hỏi, anh quê gốc ở đâu ạ?",
        pronunciation_focus: [
          "BO-leh SA-ya TA-hu, mas AS-li MA-na — `asli mana` = quê gốc ở đâu; câu hỏi làm quen thân thiện.",
          "Mẹo: hỏi `asli mana?` (gốc ở đâu) là cách lịch sự, tò mò thiện chí — mở ra chuyện về quê hương, dân tộc.",
          "Lỗi người Việt: đọc `boleh` thành 'bô-le'. Đúng là 'BO-leh', `h` cuối nhẹ.",
          "Luyện: `Mas asli mana?`",
        ],
        pronunciation_focus_en: [
          "BO-leh SA-ya TA-hu, mas AS-li MA-na — `asli mana` = originally from where; a friendly get-to-know-you question.",
          "Tip: asking `asli mana?` (where are you originally from) is polite, warm curiosity — opens up talk of hometown and ethnicity.",
          "VN-speaker trap: saying `boleh` as 'bo-le'. It's 'BO-leh', a light final `h`.",
          "Drill: `Mas asli mana?`",
        ],
      },
      // ── Warm closing ──────────────────────────────────────────────────────
      {
        en: "Nggih, matur nuwun sanget. Sampun, ya, Mbak.",
        vi: "Dạ vâng, cảm ơn rất nhiều. Vậy nhé, chị.",
        pronunciation_focus: [
          "nggih, MA-tur NU-wun SA-nget. SAM-pun, ya, mbak — `sanget` = rất; `sampun` (tiếng Java) = đã/xong/thôi (chào tạm biệt nhẹ).",
          "Mẹo: vài câu Java ngắn dùng đúng lúc tạo thiện cảm lớn — nhưng dùng có chừng mực, chân thành, không gồng.",
          "Lỗi người Việt: lạm dụng câu Java để gây ấn tượng. Một hai câu ấm áp là đủ; còn lại cứ tiếng Indonesia.",
          "Luyện: `Nggih, matur nuwun sanget.`",
        ],
        pronunciation_focus_en: [
          "nggih, MA-tur NU-wun SA-nget. SAM-pun, ya, mbak — `sanget` = very; `sampun` (Javanese) = already/that's all (a soft sign-off).",
          "Tip: a few well-placed Javanese phrases earn real goodwill — but use them sparingly and sincerely, don't overdo it.",
          "VN-speaker trap: spamming Javanese to impress. One or two warm phrases is plenty; keep the rest in Indonesian.",
          "Drill: `Nggih, matur nuwun sanget.`",
        ],
      },
    ],
    vocabulary: [
      // Everyday Javanese loanwords now standard nationwide
      {
        word: "mas",
        en: "mister / older brother (address)",
        vi: "anh (gọi nam giới)",
        pos: "noun (address term)",
        pronunciation_vi: "mas — gốc Java, dùng khắp Indonesia; gọi nam trẻ lịch sự",
        pronunciation_en: "mas — Javanese-origin, used nationwide; polite address for a young man",
      },
      {
        word: "mbak",
        en: "miss / older sister (address)",
        vi: "chị (gọi nữ giới)",
        pos: "noun (address term)",
        pronunciation_vi: "mbak — âm đầu `mb` ngậm môi; gọi nữ trẻ, người phục vụ",
        pronunciation_en: "mbak — initial `mb` (hum the lips); for a young woman or a server",
      },
      {
        word: "monggo",
        en: "please / go ahead / after you",
        vi: "mời / xin mời",
        pos: "interjection (Javanese)",
        pronunciation_vi: "MONG-go — lời mời ấm áp; cũng để cáo từ/xin đi qua",
        pronunciation_en: "MONG-go — a warm invitation; also to excuse oneself/pass",
      },
      {
        word: "matur nuwun",
        en: "thank you (polite)",
        vi: "cảm ơn (lịch sự)",
        pos: "phrase (Javanese kromo)",
        pronunciation_vi: "MA-tur NU-wun — kromo; bản ngắn ngoko `nuwun`/`suwun`",
        pronunciation_en: "MA-tur NU-wun — kromo; short ngoko form `nuwun`/`suwun`",
      },
      {
        word: "nggih",
        en: "yes / okay (polite)",
        vi: "vâng / dạ",
        pos: "particle (Javanese)",
        pronunciation_vi: "nggih — `ng` đầu một âm mũi; bản chuẩn Indonesia là `iya`/`ya`",
        pronunciation_en: "nggih — initial `ng` nasal; standard Indonesian is `iya`/`ya`",
      },
      {
        word: "sampun",
        en: "already / that's all (sign-off)",
        vi: "đã / xong / thôi (chào nhẹ)",
        pos: "adverb (Javanese kromo)",
        pronunciation_vi: "SAM-pun — kromo của `sudah`; chào tạm biệt nhẹ nhàng",
        pronunciation_en: "SAM-pun — kromo of `sudah`; a gentle sign-off",
      },
      {
        word: "sanget",
        en: "very (intensifier)",
        vi: "rất",
        pos: "adverb (Javanese)",
        pronunciation_vi: "SA-nget — kromo của `sangat`/`banget`",
        pronunciation_en: "SA-nget — kromo of `sangat`/`banget`",
      },
      {
        word: "pripun / piye",
        en: "how? / how's it going?",
        vi: "thế nào? / sao rồi?",
        pos: "question word (Javanese)",
        pronunciation_vi: "PRI-pun (kromo) / PI-ye (ngoko) — chuẩn Indonesia: `bagaimana`",
        pronunciation_en: "PRI-pun (kromo) / PI-ye (ngoko) — standard Indonesian: `bagaimana`",
      },
      // Levels & concepts
      {
        word: "bahasa Jawa",
        en: "the Javanese language",
        vi: "tiếng Java",
        pos: "noun",
        pronunciation_vi: "ba-HA-sa JA-wa — ngôn ngữ vùng lớn nhất Indonesia (~80 triệu)",
        pronunciation_en: "ba-HA-sa JA-wa — Indonesia's largest regional language (~80M)",
      },
      {
        word: "ngoko",
        en: "casual/intimate Javanese speech level",
        vi: "tầng tiếng Java thân mật",
        pos: "noun",
        pronunciation_vi: "NGO-ko — dùng với bạn bè, người ngang/dưới; `ng` đầu một âm",
        pronunciation_en: "NGO-ko — for friends, peers/juniors; initial `ng` is one sound",
      },
      {
        word: "kromo (krama)",
        en: "refined/respectful Javanese speech level",
        vi: "tầng tiếng Java trang nhã",
        pos: "noun",
        pronunciation_vi: "KRO-mo — dùng với người lớn tuổi/cấp trên; cả bộ từ vựng riêng",
        pronunciation_en: "KRO-mo — for elders/superiors; a whole separate vocabulary",
      },
      {
        word: "suku",
        en: "ethnic group",
        vi: "dân tộc / tộc người",
        pos: "noun",
        pronunciation_vi: "SU-ku — Jawa, Sunda, Batak, Minang...; `suku bangsa` = tộc người",
        pronunciation_en: "SU-ku — Javanese, Sundanese, Batak, Minang...; `suku bangsa` = ethnic group",
      },
      {
        word: "asli",
        en: "original / native (from)",
        vi: "gốc / quê gốc",
        pos: "adj.",
        pronunciation_vi: "AS-li — `asli mana?` = quê gốc ở đâu?; câu làm quen",
        pronunciation_en: "AS-li — `asli mana?` = where are you originally from?; an icebreaker",
      },
      {
        word: "logat / medok",
        en: "accent / a thick (Javanese) accent",
        vi: "giọng / giọng Java đặc",
        pos: "noun/adj.",
        pronunciation_vi: "LO-gat / ME-dok — `medok` = giọng Java nặng (thân thương, không xấu)",
        pronunciation_en: "LO-gat / ME-dok — `medok` = a thick Javanese accent (endearing, not negative)",
      },
      // Other big regional groups (sensitivity)
      {
        word: "orang Sunda",
        en: "Sundanese person (West Java)",
        vi: "người Sunda (Tây Java)",
        pos: "noun",
        pronunciation_vi: "O-rang SUN-da — tiếng Sunda khác hẳn tiếng Java; `hatur nuhun` = cảm ơn",
        pronunciation_en: "O-rang SUN-da — Sundanese is distinct from Javanese; `hatur nuhun` = thank you",
      },
      {
        word: "orang Batak",
        en: "Batak person (North Sumatra)",
        vi: "người Batak (Bắc Sumatra)",
        pos: "noun",
        pronunciation_vi: "O-rang BA-tak — phong cách nói thẳng thắn hơn; `horas!` = lời chào",
        pronunciation_en: "O-rang BA-tak — known for a more direct style; `horas!` = a greeting",
      },
      {
        word: "Jawa vs Jawa Barat",
        en: "Javanese (ethnic) vs West Java (province)",
        vi: "người Java (tộc) ≠ tỉnh Tây Java",
        pos: "noun (distinction)",
        pronunciation_vi: "JA-wa / JA-wa BA-rat — Tây Java phần lớn là người SUNDA, không phải Java",
        pronunciation_en: "JA-wa / JA-wa BA-rat — West Java is mostly SUNDANESE, not Javanese",
      },
    ],
    dialogue: [
      // A Vietnamese newcomer is welcomed by a Javanese vendor; learns to be gracious
      {
        speaker: "Pedagang",
        text: "Monggo, Mbak, silakan duduk. Mau pesan apa?",
        vi: "Mời chị, mời ngồi. Chị muốn gọi gì ạ?",
        en: "Please, miss, have a seat. What would you like to order?",
      },
      {
        speaker: "Linh",
        text: "Teh hangat satu, ya, Mas. Eh, maaf, tadi 'monggo' artinya apa?",
        vi: "Cho em một trà nóng nhé anh. À, xin lỗi, 'monggo' nghĩa là gì vậy ạ?",
        en: "One hot tea, please. Oh, sorry — what does 'monggo' mean?",
      },
      {
        speaker: "Pedagang",
        text: "Itu bahasa Jawa, artinya 'silakan'. Mbak bukan orang sini, ya?",
        vi: "Đó là tiếng Java, nghĩa là 'mời'. Chị không phải người ở đây à?",
        en: "That's Javanese, it means 'please'. You're not from around here, are you?",
      },
      {
        speaker: "Linh",
        text: "Betul, saya orang Vietnam. Saya belum bisa bahasa Jawa, tapi sedang belajar.",
        vi: "Đúng ạ, em là người Việt Nam. Em chưa biết tiếng Java, nhưng đang học.",
        en: "Right, I'm Vietnamese. I can't speak Javanese yet, but I'm learning.",
      },
      {
        speaker: "Pedagang",
        text: "Wah, hebat! Pakai bahasa Indonesia saja sudah bagus kok.",
        vi: "Ồ, giỏi quá! Cứ dùng tiếng Indonesia thôi là tốt rồi mà.",
        en: "Wow, great! Just using Indonesian is already good, you know.",
      },
      {
        speaker: "Linh",
        text: "Matur nuwun, ya, Mas. Saya dengar tidak semua orang di sini orang Jawa?",
        vi: "Cảm ơn anh nhé. Em nghe nói không phải ai ở đây cũng là người Java?",
        en: "Thank you. I heard not everyone here is Javanese?",
      },
      {
        speaker: "Pedagang",
        text: "Betul. Banyak suku: Jawa, Sunda, Batak. Teman saya itu asli Sunda.",
        vi: "Đúng vậy. Nhiều dân tộc lắm: Java, Sunda, Batak. Bạn em kia gốc Sunda đấy.",
        en: "True. Many ethnic groups: Javanese, Sundanese, Batak. My friend there is Sundanese.",
      },
      {
        speaker: "Linh",
        text: "Oh begitu, menarik sekali. Nggih, matur nuwun sanget!",
        vi: "Ồ vậy à, thú vị thật. Dạ, cảm ơn anh rất nhiều!",
        en: "Oh I see, fascinating. Yes, thank you so much!",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia (giữ từ Java khi thích hợp):",
        instruction_en: "Translate into Indonesian (keep the Javanese word where fitting):",
        items: [
          { prompt: "Mời anh/chị, cứ vào và ngồi đi.", answer: "Monggo, silakan masuk dan duduk." },
          { prompt: "Chị ơi, cho em một trà nóng nhé.", answer: "Mbak, pesan teh hangat satu, ya." },
          { prompt: "Tôi chưa biết tiếng Java, nhưng đang học.", answer: "Saya belum bisa bahasa Jawa, tapi sedang belajar." },
          { prompt: "Indonesia có nhiều dân tộc, không chỉ người Java.", answer: "Indonesia punya banyak suku, bukan hanya orang Jawa." },
          { prompt: "Tôi chỉ dùng tiếng Indonesia thôi.", answer: "Saya pakai bahasa Indonesia saja." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Indonesia:",
        instruction_en: "Extra practice — translate into Indonesian:",
        items: [
          { prompt: "Anh ơi, làm ơn giao gói hàng này nhé.", answer: "Mas, tolong antar paket ini, ya." },
          { prompt: "Cảm ơn nhiều nhé, đồ ăn ngon lắm.", answer: "Matur nuwun, ya. Makanannya enak sekali." },
          { prompt: "Với người lớn tuổi, người Java dùng tiếng kromo.", answer: "Kepada orang yang lebih tua, orang Jawa pakai bahasa kromo." },
          { prompt: "Cho em hỏi, anh quê gốc ở đâu?", answer: "Boleh saya tahu, Mas asli mana?" },
          { prompt: "Dạ vâng, cảm ơn rất nhiều.", answer: "Nggih, matur nuwun sanget." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn cách gọi đúng: `Mas` (nam) hay `Mbak` (nữ); và `bukan` (phủ định danh từ) hay `tidak` (phủ định việc):",
        instruction_en:
          "Pick the right address: `Mas` (man) vs `Mbak` (woman); and `bukan` (negates nouns) vs `tidak` (negates verbs/adjectives):",
        items: [
          { prompt: "Gọi chị bán hàng nữ: '___, pesan satu.'", answer: "Mbak", hint: "nữ → Mbak" },
          { prompt: "Gọi anh tài xế nam: '___, tolong antar.'", answer: "Mas", hint: "nam → Mas" },
          { prompt: "Dia ___ orang Jawa, dia orang Sunda.", answer: "bukan", hint: "phủ định DANH TỪ 'người Java' → bukan" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ Java thường gặp với nghĩa chuẩn Indonesia / tiếng Việt:",
        instruction_en: "Match the common Javanese word with its standard Indonesian / Vietnamese meaning:",
        pairs: [
          ["monggo", "silakan — mời"],
          ["matur nuwun", "terima kasih — cảm ơn"],
          ["nggih", "iya/ya — vâng"],
          ["sampun", "sudah — đã/xong"],
          ["pripun / piye", "bagaimana — thế nào"],
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung 'lịch sự + thành thật về xuất thân' — điền chỗ trống: `Maaf, saya orang ___. Saya belum bisa bahasa Jawa, tapi sedang belajar. Saya pakai bahasa Indonesia saja, ___ (nggih/ya).`",
        instruction_en:
          "A 'polite + honest about origin' frame — fill the blanks: `Maaf, saya orang ___. Saya belum bisa bahasa Jawa, tapi sedang belajar. Saya pakai bahasa Indonesia saja, ___ (nggih/ya).`",
        example:
          "Maaf, saya orang Vietnam. Saya belum bisa bahasa Jawa, tapi sedang belajar. Saya pakai bahasa Indonesia saja, nggih.",
        example_vi:
          "Xin lỗi, tôi là người Việt Nam. Tôi chưa biết tiếng Java, nhưng đang học. Tôi chỉ dùng tiếng Indonesia thôi, vâng ạ.",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra — bạn ứng xử khéo với văn hóa Java chưa?",
        instruction_en: "Self-check — can you navigate Javanese cultural context gracefully?",
        items: [
          { vi: "Tôi nhận ra và đáp lại `monggo`, `matur nuwun`, `nggih`.", en: "I recognize and respond to `monggo`, `matur nuwun`, `nggih`." },
          { vi: "Tôi gọi `Mas` (nam) / `Mbak` (nữ) đúng.", en: "I use `Mas` (man) / `Mbak` (woman) correctly." },
          { vi: "Tôi hiểu khác biệt `ngoko` (thân) và `kromo` (trang nhã).", en: "I understand `ngoko` (casual) vs `kromo` (refined)." },
          { vi: "Tôi biết KHÔNG cần nói tiếng Java — tiếng Indonesia lịch sự là đủ.", en: "I know I don't need Javanese — polite Indonesian is enough." },
          { vi: "Tôi không mặc định ai cũng là người Java (`bukan hanya orang Jawa`).", en: "I don't assume everyone is Javanese (`bukan hanya orang Jawa`)." },
          { vi: "Tôi dùng vài câu Java có chừng mực và chân thành.", en: "I use a few Javanese phrases sparingly and sincerely." },
        ],
      },
    ],
    cultural_notes_vi:
      "Tiếng Java (basa Jawa) là ngôn ngữ vùng lớn nhất Indonesia (~80 triệu người), nên rất nhiều từ Java đã thấm vào tiếng Indonesia chuẩn hằng ngày: `mas`/`mbak` (anh/chị), `monggo` (mời), `matur nuwun` (cảm ơn), `nggih` (vâng). Điểm văn hóa quan trọng nhất là tiếng Java có 'tầng lịch sự': `ngoko` dùng với bạn bè/người ngang–dưới, còn `kromo` dùng với người lớn tuổi/cấp trên — không chỉ đổi vài chữ mà gần như là một bộ từ vựng khác cho cùng một nghĩa (ví dụ 'ăn': ngoko `mangan` ↔ kromo `dhahar`). Với người Việt, bản năng 'chọn lời theo tuổi/vị thế' này rất quen thuộc, nên bạn nắm khái niệm nhanh. BA điểm nhạy cảm cần nhớ: (1) Bạn KHÔNG cần nói tiếng Java — tiếng Indonesia lịch sự là đủ và được trân trọng; thành thật 'saya belum bisa bahasa Jawa, sedang belajar' luôn được quý. (2) Đừng mặc định ai cũng là người Java: Indonesia có Sunda, Batak, Minang, Bugis... và 'tỉnh Tây Java' phần lớn là người SUNDA chứ không phải Java. (3) Giọng Java đặc (`medok`) là điều thân thương, không nên chế giễu. Dùng vài câu Java đúng lúc tạo thiện cảm lớn, nhưng phải chân thành và có chừng mực.",
    cultural_notes_en:
      "Javanese (basa Jawa) is Indonesia's largest regional language (~80M speakers), so many Javanese words have seeped into everyday standard Indonesian: `mas`/`mbak` (brother/sister address), `monggo` (please), `matur nuwun` (thank you), `nggih` (yes). The key cultural point is that Javanese has politeness 'levels': `ngoko` for friends/peers/juniors, and `kromo` for elders/superiors — not just a few swapped words but almost a separate vocabulary for the same meanings (e.g. 'eat': ngoko `mangan` ↔ kromo `dhahar`). For Vietnamese speakers, that 'choose your words by age/status' instinct is very familiar, so the concept lands fast. THREE sensitivity points: (1) You do NOT need to speak Javanese — polite Indonesian is enough and respected; being honest with 'saya belum bisa bahasa Jawa, sedang belajar' always lands well. (2) Don't assume everyone is Javanese: Indonesia has Sundanese, Batak, Minang, Bugis... and 'West Java province' is mostly SUNDANESE, not Javanese. (3) A thick Javanese accent (`medok`) is endearing, not something to mock. A few well-placed Javanese phrases earn real goodwill — but keep them sincere and sparing.",
    tip_advice_vi:
      "Chiến lược an toàn nhất: NHẬN DIỆN tiếng Java, nhưng NÓI tiếng Indonesia. Học thuộc một nhúm từ Java nghe hằng ngày để hiểu và đáp lại ấm áp — `mas`/`mbak`, `monggo`, `matur nuwun`, `nggih`, `sampun` — rồi trả lời bằng tiếng Indonesia chuẩn. Khi được khen hay được mời, một câu `matur nuwun` đúng lúc ghi điểm lớn. Hai mẹo ngữ pháp đi kèm: (1) `belum bisa` (chưa biết) lịch hơn `tidak bisa` (không biết) — luôn dùng `belum ... sedang belajar`. (2) Phủ định danh tộc/người dùng `bukan`, không phải `tidak`: `dia bukan orang Jawa` (anh ấy không phải người Java). Và quy tắc vàng về sự tinh tế: đừng gồng nói tiếng Java rồi sai tầng `kromo`/`ngoko` — thành thật về gốc Việt của bạn còn đáng quý hơn.",
    tip_advice_en:
      "The safest strategy: RECOGNIZE Javanese, but SPEAK Indonesian. Memorize a small set of everyday Javanese words so you can understand and respond warmly — `mas`/`mbak`, `monggo`, `matur nuwun`, `nggih`, `sampun` — then reply in standard Indonesian. When complimented or invited, a well-timed `matur nuwun` scores big. Two grammar tips ride along: (1) `belum bisa` (don't know yet) is more gracious than `tidak bisa` (can't) — always go `belum ... sedang belajar`. (2) Negate ethnicity/people with `bukan`, not `tidak`: `dia bukan orang Jawa` (he isn't Javanese). And the golden subtlety rule: don't force Javanese and botch the `kromo`/`ngoko` level — being honest about your Vietnamese background is worth more.",
  },
];

export default lessons;
