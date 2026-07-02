// Error Bank for Vietnamese Speakers — Indonesian (Vietnamese → Indonesian track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (construction-worker.ts, job-interview.ts,
// housing-rental.ts, medical-vocabulary.ts etc.), which in turn mirror the French
// `FrenchLesson` shape. When the shared Indonesian registry
// (src/languages/indonesian/lessons.ts) lands, swap the local types for a shared
// import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: the CORRECT Indonesian sentence), and `vi` holds the Vietnamese gloss.
// `pronunciation_focus` carries Vietnamese-facing notes; for this lesson each one
// names the typical Vietnamese-speaker error with ❌ (wrong) → ✓ (right) and a drill.
// `pronunciation_focus_en` is the English-speaker companion, same length + order.
//
// This is a corrective "error bank": every sentence is a model of correct Indonesian
// that targets ONE recurring Vietnamese-speaker mistake — false cognates, prefix
// confusion (meN- dropping, di vs di-), the negation system (tidak/bukan/belum/
// jangan), kita vs kami, boleh vs bisa, possession order, and reduplication.

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
    id: "indonesian_error_bank_vietnamese",
    level: "B1",
    category: "grammar",
    title_vi: "Ngân hàng lỗi: người Việt học tiếng Indonesia",
    title_en: "Error bank: common Vietnamese-speaker mistakes",
    sentences: [
      // ── meN- prefix dropping ─────────────────────────────────────────────
      {
        en: "Saya membeli makanan di pasar.",
        vi: "Tôi mua thức ăn ở chợ.",
        pronunciation_focus: [
          "SA-ya mem-BE-li ma-KA-nan di PA-sar — `membeli` = mua (meN- + `beli`).",
          "Lỗi người Việt: bỏ tiền tố meN- ở văn viết/trang trọng — ❌ `saya beli makanan` → ✓ `saya membeli makanan`. Khẩu ngữ `beli` được, nhưng câu chuẩn cần `membeli`.",
          "Luyện: `Saya membeli makanan di pasar.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mem-BE-li ma-KA-nan di PA-sar — `membeli` = to buy (meN- + `beli`).",
          "VN-speaker trap: dropping the meN- prefix in writing/formal speech — ❌ `saya beli makanan` → ✓ `saya membeli makanan`. The bare `beli` is fine casually, but standard sentences need `membeli`.",
          "Drill: `Saya membeli makanan di pasar.`",
        ],
      },
      {
        en: "Dia menulis surat untuk ibunya.",
        vi: "Anh ấy viết thư cho mẹ.",
        pronunciation_focus: [
          "DI-a me-NU-lis SU-rat UN-tuk i-BU-nya — `menulis` = viết (meN- + `tulis`; `t` rụng, thành `men-`).",
          "Lỗi người Việt: giữ nguyên `t` — ❌ `mentulis` → ✓ `menulis`. Quy tắc meN-: gốc bắt đầu bằng t/p/s/k thì phụ âm đó RỤNG.",
          "Luyện: `Dia menulis surat untuk ibunya.`",
        ],
        pronunciation_focus_en: [
          "DI-a me-NU-lis SU-rat UN-tuk i-BU-nya — `menulis` = to write (meN- + `tulis`; the `t` drops, giving `men-`).",
          "VN-speaker trap: keeping the `t` — ❌ `mentulis` → ✓ `menulis`. The meN- rule: roots starting with t/p/s/k DROP that consonant.",
          "Drill: `Dia menulis surat untuk ibunya.`",
        ],
      },
      // ── di (preposition) vs di- (passive prefix) ─────────────────────────
      {
        en: "Saya tinggal di Jakarta.",
        vi: "Tôi sống ở Jakarta.",
        pronunciation_focus: [
          "SA-ya TING-gal di ja-KAR-ta — `di` (giới từ 'ở') viết RỜI, có dấu cách: `di Jakarta`.",
          "Lỗi người Việt: viết dính — ❌ `diJakarta` → ✓ `di Jakarta`. `di` chỉ nơi chốn thì TÁCH khỏi danh từ.",
          "Luyện: `Saya tinggal di Jakarta.`",
        ],
        pronunciation_focus_en: [
          "SA-ya TING-gal di ja-KAR-ta — `di` (preposition 'at/in') is written SEPARATELY, with a space: `di Jakarta`.",
          "VN-speaker trap: joining it — ❌ `diJakarta` → ✓ `di Jakarta`. The locational `di` is SPLIT from the noun.",
          "Drill: `Saya tinggal di Jakarta.`",
        ],
      },
      {
        en: "Surat itu ditulis oleh dia.",
        vi: "Lá thư đó được anh ấy viết.",
        pronunciation_focus: [
          "SU-rat I-tu di-TU-lis O-leh DI-a — `ditulis` = được viết (tiền tố bị động `di-` viết DÍNH, không cách).",
          "Lỗi người Việt: tách ra — ❌ `di tulis` → ✓ `ditulis`. `di-` bị động DÍNH vào động từ; `di` nơi chốn thì TÁCH.",
          "Luyện: `Surat itu ditulis oleh dia.`",
        ],
        pronunciation_focus_en: [
          "SU-rat EE-tu di-TU-lis O-leh DI-a — `ditulis` = is written (the passive prefix `di-` is written JOINED, no space).",
          "VN-speaker trap: splitting it — ❌ `di tulis` → ✓ `ditulis`. The passive `di-` JOINS the verb; the locational `di` is split.",
          "Drill: `Surat itu ditulis oleh dia.`",
        ],
      },
      // ── Negation: tidak / bukan / belum / jangan ─────────────────────────
      {
        en: "Ini bukan rumah saya.",
        vi: "Đây không phải nhà tôi.",
        pronunciation_focus: [
          "I-ni BU-kan RU-mah SA-ya — `bukan` phủ định DANH TỪ ('không phải').",
          "Lỗi người Việt: dùng `tidak` cho danh từ — ❌ `ini tidak rumah saya` → ✓ `ini bukan rumah saya`. `bukan` + danh từ; `tidak` + động từ/tính từ.",
          "Luyện: `Ini bukan rumah saya.`",
        ],
        pronunciation_focus_en: [
          "EE-ni BU-kan RU-mah SA-ya — `bukan` negates a NOUN ('not / is not').",
          "VN-speaker trap: using `tidak` with a noun — ❌ `ini tidak rumah saya` → ✓ `ini bukan rumah saya`. `bukan` + noun; `tidak` + verb/adjective.",
          "Drill: `Ini bukan rumah saya.`",
        ],
      },
      {
        en: "Saya belum makan siang.",
        vi: "Tôi chưa ăn trưa.",
        pronunciation_focus: [
          "SA-ya be-LUM MA-kan SI-ang — `belum` = CHƯA (việc có thể còn xảy ra).",
          "Lỗi người Việt: dùng `tidak` cho 'chưa' — ❌ `saya tidak makan siang` (= không ăn, dứt khoát) → ✓ `saya belum makan` (chưa, có thể sẽ ăn).",
          "Luyện: `Saya belum makan siang.`",
        ],
        pronunciation_focus_en: [
          "SA-ya be-LUM MA-kan SEE-ang — `belum` = NOT YET (it may still happen).",
          "VN-speaker trap: using `tidak` for 'not yet' — ❌ `saya tidak makan siang` (= I'm not eating, final) → ✓ `saya belum makan` (not yet, may still eat).",
          "Drill: `Saya belum makan siang.`",
        ],
      },
      {
        en: "Jangan buang sampah di sini.",
        vi: "Đừng vứt rác ở đây.",
        pronunciation_focus: [
          "JA-ngan BU-ang SAM-pah di SI-ni — `jangan` = ĐỪNG (mệnh lệnh phủ định).",
          "Lỗi người Việt: dùng `tidak` để ngăn cản — ❌ `tidak buang sampah` → ✓ `jangan buang sampah`. Cấm/đừng phải dùng `jangan`.",
          "Luyện: `Jangan buang sampah di sini.`",
        ],
        pronunciation_focus_en: [
          "JA-ngan BU-ang SAM-pah di SEE-ni — `jangan` = DON'T (negative command).",
          "VN-speaker trap: using `tidak` to forbid — ❌ `tidak buang sampah` → ✓ `jangan buang sampah`. Prohibitions take `jangan`.",
          "Drill: `Jangan buang sampah di sini.`",
        ],
      },
      // ── kita vs kami ─────────────────────────────────────────────────────
      {
        en: "Kami dari Vietnam, dan kita semua teman.",
        vi: "Chúng tôi đến từ Việt Nam, và tất cả chúng ta là bạn.",
        pronunciation_focus: [
          "KA-mi da-ri vi-et-NAM, dan KI-ta se-MU-a te-MAN — `kami` = chúng tôi (KHÔNG gồm người nghe); `kita` = chúng ta (GỒM người nghe).",
          "Lỗi người Việt: tiếng Việt chỉ có 'chúng tôi/chúng ta' lẫn lộn — ❌ dùng `kita` khi không tính người nghe → ✓ `kami` (loại trừ) vs `kita` (bao gồm).",
          "Luyện: `Kami dari Vietnam, dan kita semua teman.`",
        ],
        pronunciation_focus_en: [
          "KA-mi da-ri vee-et-NAM, dan KEE-ta se-MOO-a te-MAN — `kami` = we (EXCLUDING the listener); `kita` = we (INCLUDING the listener).",
          "VN-speaker trap: Vietnamese blurs the two — ❌ using `kita` when the listener isn't included → ✓ `kami` (exclusive) vs `kita` (inclusive).",
          "Drill: `Kami dari Vietnam, dan kita semua teman.`",
        ],
      },
      // ── boleh vs bisa ────────────────────────────────────────────────────
      {
        en: "Boleh saya bertanya? Saya bisa berbahasa Indonesia sedikit.",
        vi: "Tôi hỏi được không? Tôi nói được một chút tiếng Indonesia.",
        pronunciation_focus: [
          "BO-leh SA-ya ber-TA-nya? SA-ya BI-sa ber-ba-HA-sa in-do-NE-sia se-DI-kit — `boleh` = được phép (xin phép); `bisa` = có khả năng.",
          "Lỗi người Việt: 'có thể' tiếng Việt gộp cả hai — ❌ `bisa saya bertanya?` (kém lịch sự) → ✓ `boleh saya bertanya?` để XIN PHÉP; `bisa` chỉ KHẢ NĂNG.",
          "Luyện: `Boleh saya bertanya?`",
        ],
        pronunciation_focus_en: [
          "BO-leh SA-ya ber-TA-nya? SA-ya BI-sa ber-ba-HA-sa in-doh-NE-sia se-DEE-kit — `boleh` = may/be allowed (asking permission); `bisa` = be able to.",
          "VN-speaker trap: Vietnamese 'có thể' covers both — ❌ `bisa saya bertanya?` (off-register) → ✓ `boleh saya bertanya?` for PERMISSION; `bisa` is ABILITY.",
          "Drill: `Boleh saya bertanya?`",
        ],
      },
      // ── Possession order ─────────────────────────────────────────────────
      {
        en: "Ini buku saya, dan itu nama teman saya.",
        vi: "Đây là sách của tôi, và kia là tên bạn tôi.",
        pronunciation_focus: [
          "I-ni BU-ku SA-ya, dan I-tu NA-ma te-MAN SA-ya — sở hữu đặt SAU danh từ: `buku saya` (sách của tôi).",
          "Lỗi người Việt: đặt người sở hữu trước theo kiểu tiếng Anh 'my book' — ❌ `saya buku` → ✓ `buku saya`. Tiếng Indonesia: danh từ + người sở hữu.",
          "Luyện: `Ini buku saya.`",
        ],
        pronunciation_focus_en: [
          "EE-ni BU-ku SA-ya, dan EE-tu NA-ma te-MAN SA-ya — the possessor follows the noun: `buku saya` (my book).",
          "VN-speaker trap: fronting the possessor English-style 'my book' — ❌ `saya buku` → ✓ `buku saya`. Indonesian is noun + possessor.",
          "Drill: `Ini buku saya.`",
        ],
      },
      // ── Reduplication after a number ─────────────────────────────────────
      {
        en: "Saya punya tiga buku dan banyak teman.",
        vi: "Tôi có ba quyển sách và nhiều bạn.",
        pronunciation_focus: [
          "SA-ya PU-nya TI-ga BU-ku dan BA-nyak te-MAN — số nhiều bằng số đếm/`banyak`, KHÔNG nhân đôi.",
          "Lỗi người Việt: nhân đôi để chỉ số nhiều sau số đếm — ❌ `tiga buku-buku` → ✓ `tiga buku`. Đã có số (`tiga`) hoặc `banyak` thì KHÔNG lặp lại danh từ.",
          "Luyện: `Saya punya tiga buku.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PU-nya TEE-ga BU-ku dan BA-nyak te-MAN — plural comes from the number/`banyak`, NOT reduplication.",
          "VN-speaker trap: reduplicating for plural after a number — ❌ `tiga buku-buku` → ✓ `tiga buku`. With a number (`tiga`) or `banyak`, do NOT repeat the noun.",
          "Drill: `Saya punya tiga buku.`",
        ],
      },
      // ── False-friend homonyms ────────────────────────────────────────────
      {
        en: "Saya tahu jawabannya.",
        vi: "Tôi biết câu trả lời.",
        pronunciation_focus: [
          "SA-ya TA-hu ja-WA-ban-nya — `tahu` (biết) ở đây là động từ; trùng mặt chữ với `tahu` (đậu phụ)!",
          "Lỗi người Việt: lẫn hai `tahu` — ❌ hiểu thành 'tôi đậu phụ câu trả lời'. Phân biệt qua ngữ cảnh: `tahu` = biết (động từ) vs `tahu` = đậu phụ (món ăn).",
          "Luyện: `Saya tahu jawabannya.`",
        ],
        pronunciation_focus_en: [
          "SA-ya TA-hu ja-WA-ban-nya — here `tahu` = to know (a verb); spelled the same as `tahu` (tofu)!",
          "VN-speaker trap: mixing the two `tahu` — ❌ parsing it as 'I tofu the answer'. Tell them apart by context: `tahu` = know (verb) vs `tahu` = tofu (food).",
          "Drill: `Saya tahu jawabannya.`",
        ],
      },
      // ── c pronounced 'ch' ────────────────────────────────────────────────
      {
        en: "Cuaca hari ini cerah dan cantik.",
        vi: "Thời tiết hôm nay nắng đẹp.",
        pronunciation_focus: [
          "CU-a-ca HA-ri I-ni CE-rah dan CAN-tik — mọi `c` đọc 'ch': 'CHU-a-cha', 'CHE-rah', 'CHAN-tik'.",
          "Lỗi người Việt: đọc `c` thành 'k' hay 'x' — ❌ 'KU-a-ka' → ✓ 'CHU-a-cha'. Tiếng Indonesia: `c` LUÔN = 'ch'.",
          "Luyện: `Cuaca hari ini cerah.`",
        ],
        pronunciation_focus_en: [
          "CHU-a-cha HA-ri EE-ni CHE-rah dan CHAN-tik — every `c` is 'ch': 'CHU-a-cha', 'CHE-rah', 'CHAN-tik'.",
          "VN-speaker trap: reading `c` as 'k' or 's' — ❌ 'KU-a-ka' → ✓ 'CHU-a-cha'. In Indonesian `c` is ALWAYS 'ch'.",
          "Drill: `Cuaca hari ini cerah.`",
        ],
      },
      // ── ke vs di vs dari ─────────────────────────────────────────────────
      {
        en: "Saya pergi ke pasar, lalu pulang dari pasar.",
        vi: "Tôi đi đến chợ, rồi về từ chợ.",
        pronunciation_focus: [
          "SA-ya per-GI ke PA-sar, LA-lu PU-lang da-ri PA-sar — `ke` = đến (hướng tới); `di` = ở (đứng yên); `dari` = từ (rời khỏi).",
          "Lỗi người Việt: dùng `di` cho chuyển động — ❌ `pergi di pasar` → ✓ `pergi ke pasar`. Đi tới = `ke`, ở tại = `di`, đi khỏi = `dari`.",
          "Luyện: `Saya pergi ke pasar.`",
        ],
        pronunciation_focus_en: [
          "SA-ya per-GEE ke PA-sar, LA-lu PU-lang da-ri PA-sar — `ke` = to (toward); `di` = at (static); `dari` = from (away).",
          "VN-speaker trap: using `di` for movement — ❌ `pergi di pasar` → ✓ `pergi ke pasar`. Going to = `ke`, being at = `di`, leaving from = `dari`.",
          "Drill: `Saya pergi ke pasar.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Đây là bản đồ lỗi gốc tiếng Việt khi học tiếng Indonesia — gom theo nhóm để bạn tự rà soát. Bốn 'thủ phạm' lớn nhất: (1) BỎ TIỀN TỐ meN- ở văn trang trọng (`beli`→`membeli`, `tulis`→`menulis`; nhớ luật rụng phụ âm t/p/s/k); (2) NHẦM `di` rời (giới từ nơi chốn, có dấu cách) với `di-` dính (tiền tố bị động); (3) HỆ PHỦ ĐỊNH bốn từ — `tidak` (động từ/tính từ), `bukan` (danh từ), `belum` (chưa), `jangan` (đừng) — tiếng Việt gộp gần hết vào 'không/chưa/đừng' nên rất dễ sai; (4) `kita` (gồm người nghe) vs `kami` (không gồm) và `boleh` (xin phép) vs `bisa` (khả năng) — tiếng Việt không phân biệt. Ngoài ra: sở hữu đặt SAU danh từ (`buku saya`), KHÔNG nhân đôi danh từ sau số đếm (`tiga buku`), và `c` luôn đọc 'ch'. Tin vui giữ nguyên: tiếng Indonesia không thanh điệu, không chia động từ, không giống đực/cái — phần lớn câu vẫn ngắn như tiếng Việt.",
    cultural_notes_en:
      "This is a map of native-Vietnamese errors in Indonesian, grouped so you can self-audit. The four biggest culprits: (1) DROPPING the meN- prefix in formal text (`beli`→`membeli`, `tulis`→`menulis`; remember t/p/s/k consonants drop); (2) CONFUSING separate `di` (locational preposition, with a space) with joined `di-` (passive prefix); (3) the FOUR-WAY NEGATION system — `tidak` (verb/adjective), `bukan` (noun), `belum` (not yet), `jangan` (don't) — Vietnamese lumps most of these together, so errors are easy; (4) `kita` (includes the listener) vs `kami` (excludes) and `boleh` (permission) vs `bisa` (ability) — distinctions Vietnamese doesn't make. Also: the possessor follows the noun (`buku saya`), do NOT reduplicate a noun after a number (`tiga buku`), and `c` is always 'ch'. The good news stands: Indonesian has no tones, no conjugation, and no gender — most sentences stay as short as Vietnamese.",
    tip_advice_vi:
      "Cách dùng ngân hàng lỗi này: trước khi nói/viết, chạy 'checklist 4 câu hỏi': (1) Động từ của tôi đã có meN- chưa (nếu trang trọng)? (2) `di` này là nơi chốn (tách) hay bị động (dính)? (3) Phủ định đúng từ chưa — danh từ→`bukan`, chưa→`belum`, đừng→`jangan`, còn lại→`tidak`? (4) 'Chúng ta/tôi' này có gồm người nghe không (`kita`/`kami`)? Ba mẹo phát âm kèm theo: `c`='ch', đọc rõ phụ âm cuối (`batuk`, `perut`), và GIỮ GIỌNG PHẲNG — không thêm thanh điệu tiếng Việt. Mỗi lần sai, quay lại câu mẫu ✓ tương ứng và đọc to ba lần.",
    tip_advice_en:
      "How to use this error bank: before you speak or write, run a 'four-question checklist': (1) Does my verb have meN- (if formal)? (2) Is this `di` locational (split) or passive (joined)? (3) Right negator — noun→`bukan`, not-yet→`belum`, don't→`jangan`, otherwise→`tidak`? (4) Does this 'we' include the listener (`kita`) or not (`kami`)? Three pronunciation reminders: `c`='ch', sound final consonants (`batuk`, `perut`), and KEEP YOUR PITCH FLAT — don't add Vietnamese tones. Each time you slip, return to the matching ✓ model sentence and say it aloud three times.",
    vocabulary: [
      // Prefix / affix building blocks
      {
        word: "meN-",
        en: "active verb prefix (me-, mem-, men-, meng-, meny-)",
        vi: "tiền tố động từ chủ động",
        pos: "prefix",
        pronunciation_vi: "men — biến dạng theo phụ âm đầu; t/p/s/k RỤNG: `tulis`→`menulis`",
        pronunciation_en: "men — shape-shifts by initial consonant; t/p/s/k DROP: `tulis`→`menulis`",
      },
      {
        word: "di- (passive)",
        en: "passive verb prefix (joined)",
        vi: "tiền tố bị động (viết dính)",
        pos: "prefix",
        pronunciation_vi: "di — DÍNH động từ: `ditulis` (được viết); khác `di` nơi chốn",
        pronunciation_en: "di — JOINED to the verb: `ditulis` (is written); not locational `di`",
      },
      {
        word: "di (preposition)",
        en: "at / in / on (separate)",
        vi: "ở (giới từ, viết rời)",
        pos: "preposition",
        pronunciation_vi: "di — TÁCH, có dấu cách: `di rumah` (ở nhà)",
        pronunciation_en: "di — SPLIT, with a space: `di rumah` (at home)",
      },
      // Negation set
      {
        word: "tidak",
        en: "not (verbs/adjectives)",
        vi: "không (động từ/tính từ)",
        pos: "negator",
        pronunciation_vi: "TI-dak — khẩu ngữ `nggak`/`enggak`; KHÔNG dùng cho danh từ",
        pronunciation_en: "TEE-dak — colloquial `nggak`/`enggak`; NOT for nouns",
      },
      {
        word: "bukan",
        en: "not (nouns)",
        vi: "không phải (danh từ)",
        pos: "negator",
        pronunciation_vi: "BU-kan — `bukan guru` (không phải giáo viên)",
        pronunciation_en: "BU-kan — `bukan guru` (not a teacher)",
      },
      {
        word: "belum",
        en: "not yet",
        vi: "chưa",
        pos: "negator",
        pronunciation_vi: "be-LUM — việc có thể còn xảy ra; trả lời tế nhị thay `tidak`",
        pronunciation_en: "be-LUM — it may still happen; a tactful answer instead of `tidak`",
      },
      {
        word: "jangan",
        en: "don't (negative command)",
        vi: "đừng",
        pos: "negator",
        pronunciation_vi: "JA-ngan — mệnh lệnh cấm: `jangan pergi` (đừng đi)",
        pronunciation_en: "JA-ngan — prohibitive command: `jangan pergi` (don't go)",
      },
      // Pronoun & modal contrasts
      {
        word: "kita",
        en: "we (inclusive — includes you)",
        vi: "chúng ta (gồm người nghe)",
        pos: "pronoun",
        pronunciation_vi: "KI-ta — bao gồm người đang nghe",
        pronunciation_en: "KEE-ta — includes the listener",
      },
      {
        word: "kami",
        en: "we (exclusive — not you)",
        vi: "chúng tôi (không gồm người nghe)",
        pos: "pronoun",
        pronunciation_vi: "KA-mi — loại trừ người đang nghe",
        pronunciation_en: "KA-mi — excludes the listener",
      },
      {
        word: "boleh",
        en: "may / be allowed",
        vi: "được phép",
        pos: "modal",
        pronunciation_vi: "BO-leh — xin phép: `boleh saya …?`; khác `bisa` (khả năng)",
        pronunciation_en: "BO-leh — permission: `boleh saya …?`; not `bisa` (ability)",
      },
      {
        word: "bisa",
        en: "can / be able to",
        vi: "có thể (khả năng)",
        pos: "modal",
        pronunciation_vi: "BI-sa — năng lực; cũng là danh từ 'nọc độc' (homonym hiếm gặp)",
        pronunciation_en: "BI-sa — ability; also a noun 'venom' (a rare homonym)",
      },
      // Classic false-friend homonyms
      {
        word: "tahu",
        en: "to know / tofu (homonyms)",
        vi: "biết / đậu phụ (trùng mặt chữ)",
        pos: "verb / noun",
        pronunciation_vi: "TA-hu — phân biệt qua ngữ cảnh; `tahu` biết vs `tahu` đậu phụ",
        pronunciation_en: "TA-hu — tell apart by context; `tahu` know vs `tahu` tofu",
      },
      {
        word: "bulan",
        en: "month / moon (homonyms)",
        vi: "tháng / mặt trăng",
        pos: "noun",
        pronunciation_vi: "BU-lan — `bulan depan` tháng sau vs `bulan purnama` trăng rằm",
        pronunciation_en: "BU-lan — `bulan depan` next month vs `bulan purnama` full moon",
      },
      {
        word: "punya",
        en: "to have / own",
        vi: "có (sở hữu)",
        pos: "verb",
        pronunciation_vi: "PU-nya — sở hữu đặt sau: `buku saya`, KHÔNG `saya buku`",
        pronunciation_en: "PU-nya — possessor follows: `buku saya`, NOT `saya buku`",
      },
      {
        word: "c (huruf)",
        en: "the letter c — always 'ch'",
        vi: "chữ c — luôn đọc 'ch'",
        pos: "letter",
        pronunciation_vi: "che — `cuaca`='CHU-a-cha'; KHÔNG đọc 'k' hay 'x'",
        pronunciation_en: "che — `cuaca`='CHU-a-cha'; never 'k' or 's'",
      },
    ],
    dialogue: [
      // Dialogue: a teacher correcting a Vietnamese learner's mistakes
      {
        speaker: "Murid",
        text: "Bu, saya beli buku kemarin. Ini saya buku.",
        vi: "Cô ơi, hôm qua em mua sách. Đây là sách của em. (hai lỗi: thiếu meN-, sai trật tự sở hữu)",
        en: "Ma'am, I bought a book yesterday. This is my book. (two errors: missing meN-, wrong possession order)",
      },
      {
        speaker: "Guru",
        text: "Bagus, tapi dua koreksi: `saya membeli buku`, dan `ini buku saya`.",
        vi: "Tốt, nhưng có hai chỗ sửa: `saya membeli buku`, và `ini buku saya`.",
        en: "Good, but two corrections: `saya membeli buku`, and `ini buku saya`.",
      },
      {
        speaker: "Murid",
        text: "Oh, benar. Saya belum mengerti prefiks meN-. Boleh saya tanya lagi?",
        vi: "À đúng rồi. Em chưa hiểu tiền tố meN-. Em hỏi thêm được không ạ?",
        en: "Oh, right. I don't understand the meN- prefix yet. May I ask again?",
      },
      {
        speaker: "Guru",
        text: "Tentu. Bagus kamu pakai `belum` dan `boleh` dengan benar!",
        vi: "Tất nhiên. Em dùng `belum` và `boleh` đúng rồi đấy, giỏi lắm!",
        en: "Of course. Well done using `belum` and `boleh` correctly!",
      },
      {
        speaker: "Murid",
        text: "Terima kasih. Ini bukan susah, tapi saya harus banyak latihan.",
        vi: "Cảm ơn cô. Cái này không khó, nhưng em phải luyện tập nhiều.",
        en: "Thank you. This isn't hard, but I have to practice a lot.",
      },
      {
        speaker: "Guru",
        text: "Betul. Ingat: `c` dibaca 'ch', jadi `susah` bukan `cusah`. Semangat!",
        vi: "Đúng vậy. Nhớ: `c` đọc 'ch', nên là `susah` chứ không phải `cusah`. Cố lên!",
        en: "Right. Remember: `c` is read 'ch', so it's `susah`, not `cusah`. Keep it up!",
      },
    ],
    exercises: [
      {
        type: "fix_the_error",
        instruction_vi: "Sửa lỗi người Việt thường mắc — viết lại cho đúng:",
        instruction_en: "Fix the typical Vietnamese-speaker error — rewrite correctly:",
        items: [
          { prompt: "Saya beli makanan di pasar.", answer: "Saya membeli makanan di pasar.", hint: "thiếu tiền tố meN-" },
          { prompt: "Ini saya buku.", answer: "Ini buku saya.", hint: "sở hữu đặt sau danh từ" },
          { prompt: "Ini tidak rumah saya.", answer: "Ini bukan rumah saya.", hint: "phủ định danh từ = bukan" },
          { prompt: "Saya punya tiga buku-buku.", answer: "Saya punya tiga buku.", hint: "không nhân đôi sau số đếm" },
          { prompt: "Saya pergi di pasar.", answer: "Saya pergi ke pasar.", hint: "chuyển động dùng ke" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn `tidak`, `bukan`, `belum`, hay `jangan` cho đúng:",
        instruction_en:
          "Choose `tidak`, `bukan`, `belum`, or `jangan` correctly:",
        items: [
          { prompt: "Dia ___ guru, dia dokter.", answer: "bukan", hint: "phủ định danh từ" },
          { prompt: "Saya ___ lapar sekarang.", answer: "tidak", hint: "phủ định tính từ" },
          { prompt: "Kami ___ selesai, masih kerja.", answer: "belum", hint: "chưa xong" },
          { prompt: "___ merokok di sini!", answer: "Jangan", hint: "mệnh lệnh cấm" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn `kita`/`kami` và `boleh`/`bisa` cho đúng:",
        instruction_en:
          "Choose `kita`/`kami` and `boleh`/`bisa` correctly:",
        items: [
          { prompt: "(nói với người lạ, không tính họ) ___ dari Vietnam.", answer: "Kami", hint: "loại trừ người nghe" },
          { prompt: "(rủ bạn cùng đi) Ayo, ___ pergi bersama!", answer: "kita", hint: "gồm người nghe" },
          { prompt: "___ saya pinjam pulpen Anda? (xin phép)", answer: "Boleh", hint: "xin phép" },
          { prompt: "Saya ___ berenang. (khả năng)", answer: "bisa", hint: "năng lực" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia ĐÚNG (tránh lỗi gốc Việt):",
        instruction_en: "Translate into CORRECT Indonesian (avoid the L1 trap):",
        items: [
          { prompt: "Tôi chưa ăn trưa.", answer: "Saya belum makan siang." },
          { prompt: "Đây không phải nhà tôi.", answer: "Ini bukan rumah saya." },
          { prompt: "Tôi hỏi được không? (xin phép)", answer: "Boleh saya bertanya?" },
          { prompt: "Lá thư đó được anh ấy viết.", answer: "Surat itu ditulis oleh dia." },
        ],
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra lỗi gốc Việt — bạn tránh được chưa?",
        instruction_en: "L1-error self-check — can you avoid each one?",
        items: [
          { vi: "Tôi thêm meN- cho động từ ở câu trang trọng.", en: "I add meN- to verbs in formal sentences." },
          { vi: "Tôi phân biệt `di` rời (nơi chốn) và `di-` dính (bị động).", en: "I distinguish separate `di` (location) from joined `di-` (passive)." },
          { vi: "Tôi chọn đúng `tidak`/`bukan`/`belum`/`jangan`.", en: "I pick the right `tidak`/`bukan`/`belum`/`jangan`." },
          { vi: "Tôi dùng đúng `kita` (gồm) vs `kami` (không gồm).", en: "I use `kita` (inclusive) vs `kami` (exclusive) correctly." },
          { vi: "Tôi dùng `boleh` để xin phép, `bisa` cho khả năng.", en: "I use `boleh` for permission, `bisa` for ability." },
          { vi: "Tôi đặt sở hữu sau danh từ và không nhân đôi sau số đếm.", en: "I put the possessor after the noun and don't reduplicate after a number." },
          { vi: "Tôi đọc `c` thành 'ch' và giữ giọng phẳng, không thanh điệu.", en: "I read `c` as 'ch' and keep my pitch flat — no tones." },
        ],
      },
    ],
  },
];

export default lessons;
