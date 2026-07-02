// Proverbs & Idioms Indonesian — peribahasa (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling Indonesian `extra/*` files (e.g. food-street.ts,
// banking-money.ts), which in turn mirror the French `FrenchLesson` shape. When the
// shared Indonesian registry (src/languages/indonesian/lessons.ts) lands, swap the
// local types for a shared import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: the Indonesian peribahasa), and `vi` holds the Vietnamese gloss/equivalent.
// `pronunciation_focus` is used to carry, in order: (1) pronunciation + the LITERAL
// meaning, (2) the FIGURATIVE meaning + `Tương đương VN:` (the closest Vietnamese
// proverb), (3) a usage note / `Lỗi người Việt:` trap (don't translate word-for-word;
// the nuance gap). `pronunciation_focus_en` is the English-speaker companion, same
// length + order.
//
// Why proverbs matter for Vietnamese learners: Vietnamese and Indonesian proverb
// culture rhyme closely — many map almost one-to-one (`Tong kosong nyaring bunyinya`
// ≈ "Thùng rỗng kêu to"). The WIN is that the imagery is often shared; the trap is
// the FALSE friend — a proverb that looks parallel but carries a different lesson —
// and translating the image literally instead of reaching for the Vietnamese
// equivalent.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) proverb. */
  en: string;
  /** Vietnamese gloss / equivalent. */
  vi: string;
  /** Vietnamese-facing notes: literal → figurative + VN equivalent → usage/L1 trap. */
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
    id: "indonesian_proverbs_idioms",
    level: "B1",
    category: "language",
    title_vi: "Tục ngữ và thành ngữ Indonesia (peribahasa)",
    title_en: "Indonesian proverbs and idioms (peribahasa)",
    sentences: [
      // ── 1 ──────────────────────────────────────────────────────────────
      {
        en: "Air tenang menghanyutkan.",
        vi: "Nước lặng (mà) cuốn trôi — người trầm tĩnh thường thâm sâu, khó lường.",
        pronunciation_focus: [
          "A-ir te-NANG meng-ha-nyut-KAN — nghĩa đen: nước phẳng lặng nhưng vẫn cuốn trôi mọi thứ.",
          "Nghĩa bóng: người ít nói, điềm đạm thường ẩn chứa chiều sâu/sức mạnh. Tương đương VN: 'Tẩm ngẩm tầm ngầm mà đấm chết voi'.",
          "Lỗi người Việt: nói thẳng 'nước im lặng' — đây là thành ngữ cố định `air tenang menghanyutkan`, đừng đổi từ.",
        ],
        pronunciation_focus_en: [
          "A-ir te-NANG meng-ha-nyut-KAN — literal: still water (yet) sweeps things away.",
          "Figurative: quiet, calm people often run deep/strong. VN equivalent: 'Tẩm ngẩm tầm ngầm mà đấm chết voi' (≈ 'still waters run deep').",
          "VN-speaker trap: paraphrasing 'silent water'. It's a fixed proverb `air tenang menghanyutkan` — keep the words.",
        ],
      },
      // ── 2 ──────────────────────────────────────────────────────────────
      {
        en: "Sedia payung sebelum hujan.",
        vi: "Chuẩn bị ô trước khi mưa — lo xa, phòng bị trước.",
        pronunciation_focus: [
          "se-DI-a PA-yung se-BE-lum HU-jan — nghĩa đen: sắm sẵn cái ô trước khi trời mưa.",
          "Nghĩa bóng: chuẩn bị/đề phòng trước khi sự cố xảy ra. Tương đương VN: 'Phòng cháy hơn chữa cháy' / 'Lo xa khỏi buồn gần'.",
          "Dùng khi: khuyên ai đó chuẩn bị, tiết kiệm, mua bảo hiểm — lời khuyên tích cực.",
        ],
        pronunciation_focus_en: [
          "se-DI-a PA-yung se-BE-lum HU-jan — literal: ready an umbrella before the rain.",
          "Figurative: prepare/guard before trouble strikes. VN equivalent: 'Phòng cháy hơn chữa cháy' (prevention beats cure).",
          "Use when: advising someone to prepare, save, or insure — positive advice.",
        ],
      },
      // ── 3 ──────────────────────────────────────────────────────────────
      {
        en: "Nasi sudah menjadi bubur.",
        vi: "Cơm đã thành cháo — việc đã rồi, không sửa được nữa.",
        pronunciation_focus: [
          "NA-si su-DAH men-JA-di BU-bur — nghĩa đen: gạo đã nấu thành cháo, không trở lại thành cơm được.",
          "Nghĩa bóng: sự đã rồi, hối tiếc cũng vô ích. Tương đương VN: 'Gạo đã nấu thành cơm' / 'Ván đã đóng thuyền'.",
          "Lỗi người Việt: VN nói 'gạo thành CƠM', Indonesia nói 'gạo thành CHÁO' (`bubur`). Hình ảnh khác, đừng dịch ngược thành `nasi`.",
        ],
        pronunciation_focus_en: [
          "NA-si su-DAH men-JA-di BU-bur — literal: the rice has already become porridge; no going back.",
          "Figurative: what's done is done; regret is useless. VN equivalent: 'Gạo đã nấu thành cơm' / 'Ván đã đóng thuyền'.",
          "VN-speaker trap: Vietnamese says rice→COOKED RICE; Indonesian says rice→PORRIDGE (`bubur`). Different image — don't swap in `nasi`.",
        ],
      },
      // ── 4 ──────────────────────────────────────────────────────────────
      {
        en: "Tak ada gading yang tak retak.",
        vi: "Không có ngà voi nào không nứt — không ai/không gì hoàn hảo.",
        pronunciation_focus: [
          "tak A-da GA-ding yang tak re-TAK — nghĩa đen: chẳng có chiếc ngà voi nào mà không có vết nứt.",
          "Nghĩa bóng: ai cũng có khuyết điểm, không gì toàn vẹn. Tương đương VN: 'Nhân vô thập toàn'.",
          "Dùng khi: thừa nhận sai sót một cách khiêm tốn, hoặc bao dung lỗi của người khác.",
        ],
        pronunciation_focus_en: [
          "tak A-da GA-ding yang tak re-TAK — literal: there is no ivory tusk without a crack.",
          "Figurative: nobody/nothing is perfect. VN equivalent: 'Nhân vô thập toàn' (no one is flawless).",
          "Use when: humbly admitting a flaw, or excusing someone else's mistake.",
        ],
      },
      // ── 5 ──────────────────────────────────────────────────────────────
      {
        en: "Bersakit-sakit dahulu, bersenang-senang kemudian.",
        vi: "Chịu khổ trước, hưởng sướng sau.",
        pronunciation_focus: [
          "ber-sa-kit-SA-kit da-HU-lu, ber-se-nang-SE-nang ke-MU-di-an — láy động từ với `ber-`: `bersakit-sakit` (cứ chịu khổ), `bersenang-senang` (cứ vui sướng).",
          "Nghĩa bóng: nỗ lực gian khổ hôm nay để hưởng thành quả mai sau. Tương đương VN: 'Có công mài sắt, có ngày nên kim'.",
          "Điểm ngữ pháp: TÁI LẶP (reduplication) với `ber-...-...` diễn tả hành động kéo dài/lặp lại — đặc trưng peribahasa.",
        ],
        pronunciation_focus_en: [
          "ber-sa-kit-SA-kit da-HU-lu, ber-se-nang-SE-nang ke-MU-di-an — `ber-` + reduplicated verb: `bersakit-sakit` (suffer on), `bersenang-senang` (enjoy on).",
          "Figurative: toil now to enjoy later. VN equivalent: 'Có công mài sắt, có ngày nên kim' (effort brings reward).",
          "Grammar point: REDUPLICATION with `ber-...-...` shows prolonged/repeated action — a peribahasa hallmark.",
        ],
      },
      // ── 6 ──────────────────────────────────────────────────────────────
      {
        en: "Sambil menyelam minum air.",
        vi: "Vừa lặn vừa uống nước — một công đôi việc.",
        pronunciation_focus: [
          "SAM-bil me-nye-LAM MI-num A-ir — nghĩa đen: trong lúc lặn thì tiện uống luôn nước; `sambil` = trong lúc/vừa…vừa.",
          "Nghĩa bóng: làm một việc mà được luôn việc khác. Tương đương VN: 'Một công đôi việc' / 'Nhất tiễn hạ song điêu'.",
          "Lỗi người Việt: nói `dua kerja sekali` kiểu trực dịch. Bản ngữ dùng đúng thành ngữ `sambil menyelam minum air`.",
        ],
        pronunciation_focus_en: [
          "SAM-bil me-nye-LAM MI-num A-ir — literal: while diving, drink water too; `sambil` = while/at the same time.",
          "Figurative: accomplish two things at once. VN equivalent: 'Một công đôi việc' (one effort, two jobs).",
          "VN-speaker trap: literal `dua kerja sekali`. Natives use the set idiom `sambil menyelam minum air`.",
        ],
      },
      // ── 7 ──────────────────────────────────────────────────────────────
      {
        en: "Ada udang di balik batu.",
        vi: "Có con tôm sau hòn đá — có ẩn ý/động cơ giấu kín.",
        pronunciation_focus: [
          "A-da U-dang di BA-lik BA-tu — nghĩa đen: có con tôm nấp sau tảng đá; `di balik` = phía sau/đằng sau.",
          "Nghĩa bóng: đằng sau hành động tử tế có toan tính riêng. Tương đương VN: 'Có thâm ý' / 'Lắm mưu nhiều kế' (không có câu khớp hoàn toàn).",
          "Dùng khi: cảnh giác ai đó tốt bất thường — 'sao tự dưng tốt thế, chắc `ada udang di balik batu`'.",
        ],
        pronunciation_focus_en: [
          "A-da U-dang di BA-lik BA-tu — literal: there's a shrimp behind the rock; `di balik` = behind.",
          "Figurative: a hidden motive behind a kind act. VN equivalent: 'Có thâm ý' / 'có ý đồ riêng' (no exact proverb match).",
          "Use when: wary of unusual kindness — 'why so nice all of a sudden? Must be `ada udang di balik batu`.'",
        ],
      },
      // ── 8 ──────────────────────────────────────────────────────────────
      {
        en: "Buah jatuh tak jauh dari pohonnya.",
        vi: "Quả rụng không xa gốc cây — con cái giống cha mẹ.",
        pronunciation_focus: [
          "BU-ah JA-tuh tak JA-uh da-ri po-HON-nya — nghĩa đen: trái rụng không rơi xa cội; `pohonnya` (`pohon` + `-nya`) = cái cây của nó.",
          "Nghĩa bóng: con cái thừa hưởng tính cách/tài năng của cha mẹ. Tương đương VN: 'Cha nào con nấy' / 'Con nhà tông không giống lông cũng giống cánh'.",
          "Dùng khi: nhận xét con giống cha mẹ — có thể khen hoặc chê tùy ngữ cảnh.",
        ],
        pronunciation_focus_en: [
          "BU-ah JA-tuh tak JA-uh da-ri po-HON-nya — literal: the fruit falls not far from its tree; `pohonnya` = its tree.",
          "Figurative: children take after their parents. VN equivalent: 'Cha nào con nấy' (like father, like son).",
          "Use when: noting a child resembles a parent — praise or critique by context.",
        ],
      },
      // ── 9 ──────────────────────────────────────────────────────────────
      {
        en: "Sedikit-sedikit, lama-lama menjadi bukit.",
        vi: "Ít một, lâu dần thành đồi — tích tiểu thành đại.",
        pronunciation_focus: [
          "se-di-kit-se-DI-kit, la-ma-LA-ma men-JA-di BU-kit — láy `sedikit-sedikit` (ít từng chút), `lama-lama` (dần dà); `bukit` = ngọn đồi.",
          "Nghĩa bóng: góp nhặt từng chút rồi cũng thành lớn. Tương đương VN: 'Kiến tha lâu cũng đầy tổ' / 'Góp gió thành bão'.",
          "Dùng khi: khuyến khích tiết kiệm, học đều đặn — hợp với tinh thần học mỗi ngày.",
        ],
        pronunciation_focus_en: [
          "se-di-kit-se-DI-kit, la-ma-LA-ma men-JA-di BU-kit — reduplicated `sedikit-sedikit` (bit by bit), `lama-lama` (over time); `bukit` = hill.",
          "Figurative: small bits accumulate into something big. VN equivalent: 'Kiến tha lâu cũng đầy tổ' (the ant fills its nest over time).",
          "Use when: encouraging saving or steady study — fits the learn-a-little-daily ethos.",
        ],
      },
      // ── 10 ─────────────────────────────────────────────────────────────
      {
        en: "Karena nila setitik, rusak susu sebelanga.",
        vi: "Vì một giọt chàm, hỏng cả nồi sữa — một lỗi nhỏ làm hỏng việc lớn.",
        pronunciation_focus: [
          "ka-RE-na NI-la se-TI-tik, RU-sak SU-su se-be-LA-nga — `nila` = chàm (màu xanh); `setitik` = một giọt; `sebelanga` = cả một nồi.",
          "Nghĩa bóng: một sai lầm/kẻ xấu nhỏ làm hỏng toàn bộ. Tương đương VN: 'Con sâu làm rầu nồi canh'.",
          "Dùng khi: tiếc vì một chi tiết nhỏ phá hỏng thành quả lớn — sắc thái cảnh báo.",
        ],
        pronunciation_focus_en: [
          "ka-RE-na NI-la se-TI-tik, RU-sak SU-su se-be-LA-nga — `nila` = indigo dye; `setitik` = a drop; `sebelanga` = a whole pot.",
          "Figurative: one small flaw/bad apple ruins the whole. VN equivalent: 'Con sâu làm rầu nồi canh' (one worm spoils the pot of soup).",
          "Use when: lamenting a small thing wrecking a big effort — a cautionary tone.",
        ],
      },
      // ── 11 ─────────────────────────────────────────────────────────────
      {
        en: "Besar pasak daripada tiang.",
        vi: "Cọc to hơn cột — chi tiêu nhiều hơn thu nhập, vung tay quá trán.",
        pronunciation_focus: [
          "be-SAR PA-sak da-ri-PA-da TI-ang — nghĩa đen: cái chốt/cọc to hơn cả cây cột; `daripada` = hơn (so sánh).",
          "Nghĩa bóng: tiêu vượt quá khả năng, nợ nần. Tương đương VN: 'Bóc ngắn cắn dài'.",
          "Điểm ngữ pháp: `daripada` dùng cho so sánh HƠN: `lebih besar daripada` — đừng nhầm với `dari` (từ/khỏi).",
        ],
        pronunciation_focus_en: [
          "be-SAR PA-sak da-ri-PA-da TI-ang — literal: the peg is bigger than the post; `daripada` = than (comparison).",
          "Figurative: spending beyond one's means, living in debt. VN equivalent: 'Bóc ngắn cắn dài' (peel short, bite long).",
          "Grammar point: `daripada` marks comparison ('bigger THAN') — don't confuse with `dari` (from).",
        ],
      },
      // ── 12 ─────────────────────────────────────────────────────────────
      {
        en: "Di mana bumi dipijak, di situ langit dijunjung.",
        vi: "Đặt chân lên đất nào thì đội trời nơi ấy — nhập gia tùy tục.",
        pronunciation_focus: [
          "di MA-na BU-mi di-PI-jak, di SI-tu LA-ngit di-jun-JUNG — bị động `di-`: `dipijak` (được giẫm lên), `dijunjung` (được tôn/đội).",
          "Nghĩa bóng: tới nơi nào thì tôn trọng phong tục nơi ấy. Tương đương VN: 'Nhập gia tùy tục' / 'Đi với bụt mặc áo cà sa…'.",
          "Lỗi người Việt: né thể bị động `di-`. Câu này dùng tới HAI lần `di-...` — hình mẫu kinh điển của thể bị động.",
        ],
        pronunciation_focus_en: [
          "di MA-na BU-mi di-PI-jak, di SI-tu LA-ngit di-jun-JUNG — passive `di-`: `dipijak` (is stepped on), `dijunjung` (is upheld).",
          "Figurative: respect the customs of wherever you are. VN equivalent: 'Nhập gia tùy tục' (when in Rome…).",
          "VN-speaker trap: avoiding the `di-` passive. This proverb uses `di-...` TWICE — a classic passive model.",
        ],
      },
      // ── 13 ─────────────────────────────────────────────────────────────
      {
        en: "Tong kosong nyaring bunyinya.",
        vi: "Thùng rỗng kêu to — kẻ nói nhiều, khoe khoang thường ít thực chất.",
        pronunciation_focus: [
          "tong KO-song NYA-ring BU-nyi-nya — nghĩa đen: cái thùng rỗng thì kêu vang; `nyaring` = vang/to; `bunyinya` = âm thanh của nó.",
          "Nghĩa bóng: người rỗng tuếch hay khua môi múa mép. Tương đương VN: 'Thùng rỗng kêu to' (gần như Y HỆT!).",
          "Mẹo: đây là cặp khớp gần hoàn hảo VN↔Indonesia — dễ nhớ nhất trong bài; cùng hình ảnh, cùng bài học.",
        ],
        pronunciation_focus_en: [
          "tong KO-song NYA-ring BU-nyi-nya — literal: an empty barrel rings loud; `nyaring` = loud/resonant; `bunyinya` = its sound.",
          "Figurative: hollow people boast the loudest. VN equivalent: 'Thùng rỗng kêu to' (almost IDENTICAL!).",
          "Tip: a near-perfect VN↔Indonesian match — the easiest to remember; same image, same lesson.",
        ],
      },
      // ── 14 ─────────────────────────────────────────────────────────────
      {
        en: "Berat sama dipikul, ringan sama dijinjing.",
        vi: "Nặng cùng gánh, nhẹ cùng xách — đồng cam cộng khổ.",
        pronunciation_focus: [
          "be-RAT SA-ma di-PI-kul, RI-ngan SA-ma di-jin-JING — `dipikul` (được gánh trên vai), `dijinjing` (được xách tay); `sama` = cùng nhau.",
          "Nghĩa bóng: chung vai chia sẻ mọi vui buồn, gánh nặng. Tương đương VN: 'Đồng cam cộng khổ' / 'Chia ngọt sẻ bùi'.",
          "Tinh thần: gắn với `gotong royong` (tương trợ cộng đồng) — giá trị cốt lõi của văn hóa Indonesia.",
        ],
        pronunciation_focus_en: [
          "be-RAT SA-ma di-PI-kul, RI-ngan SA-ma di-jin-JING — `dipikul` (carried on the shoulder), `dijinjing` (carried by hand); `sama` = together.",
          "Figurative: share burdens and joys side by side. VN equivalent: 'Đồng cam cộng khổ' (share sweet and bitter).",
          "Spirit: tied to `gotong royong` (mutual community aid) — a core Indonesian value.",
        ],
      },
    ],
    cultural_notes_vi:
      "`Peribahasa` (tục ngữ/thành ngữ) là phần hồn của tiếng Indonesia trang trọng — xuất hiện trong bài phát biểu, văn nghị luận học đường, lời khuyên của người lớn và cả sinh hoạt. Nhiều câu mang dấu ấn văn hóa Mã Lai–Hồi giáo và đời sống nông–ngư nghiệp (cây, nước, thuyền, ngà voi). Tin vui cho người Việt: kho tục ngữ hai nước cộng hưởng mạnh — `Tong kosong nyaring bunyinya` ≈ 'Thùng rỗng kêu to', `Karena nila setitik…` ≈ 'Con sâu làm rầu nồi canh'. Nhưng phải cảnh giác BẠN GIẢ: hình ảnh có thể đổi (gạo thành CHÁO `bubur` chứ không thành cơm), và vài câu không có tương đương khít (`ada udang di balik batu`). Về ngữ pháp, peribahasa là nơi tập trung dày đặc các hiện tượng cốt lõi: thể bị động `di-` (`dipijak`, `dijunjung`), tái lặp với `ber-` (`bersakit-sakit`), so sánh với `daripada`, và hậu tố `-kan`/`-nya`. Học thuộc nguyên câu (không chế biến) là cách dùng đúng và sang nhất.",
    cultural_notes_en:
      "`Peribahasa` (proverbs/idioms) are the soul of formal Indonesian — they surface in speeches, school essays, elders' advice, and daily life. Many carry Malay–Islamic heritage and farming/fishing imagery (trees, water, boats, ivory). Good news for Vietnamese speakers: the two proverb traditions resonate strongly — `Tong kosong nyaring bunyinya` ≈ 'Thùng rỗng kêu to', `Karena nila setitik…` ≈ 'Con sâu làm rầu nồi canh'. But beware FALSE friends: the image can shift (rice becomes PORRIDGE `bubur`, not cooked rice), and some have no neat equivalent (`ada udang di balik batu`). Grammatically, peribahasa pack the core phenomena densely: the `di-` passive (`dipijak`, `dijunjung`), `ber-` reduplication (`bersakit-sakit`), comparison with `daripada`, and the `-kan`/`-nya` suffixes. Memorize them whole (don't remix) — that's the correct and most elegant use.",
    tip_advice_vi:
      "Cách học peribahasa hiệu quả: (1) HỌC NGUYÊN CÂU như một khối — đừng đổi từ, vì chúng cố định; (2) gắn ngay với TƯƠNG ĐƯƠNG TIẾNG VIỆT để nhớ nghĩa bóng (mạng lưới Việt sẵn có của bạn là lợi thế lớn); (3) cảnh giác BẠN GIẢ — kiểm tra hình ảnh có thật sự khớp không (`bubur` = cháo, không phải cơm); (4) chú ý hiện tượng ngữ pháp: bị động `di-`, tái lặp `ber-...-...`, so sánh `daripada`; (5) dùng đúng ngữ cảnh: câu khuyên răn (`sedia payung sebelum hujan`) khác câu cảnh giác (`ada udang di balik batu`). Một câu vàng để mở lời khi trích tục ngữ: `Kata pepatah, …` (Tục ngữ có câu, …) hoặc `Seperti kata peribahasa, …`.",
    tip_advice_en:
      "How to learn peribahasa well: (1) MEMORIZE THE WHOLE LINE as a block — don't swap words; they're fixed; (2) immediately anchor each to its VIETNAMESE EQUIVALENT for the figurative sense (your existing Vietnamese network is a big advantage); (3) watch for FALSE friends — check the image truly matches (`bubur` = porridge, not cooked rice); (4) note the grammar inside: `di-` passive, `ber-...-...` reduplication, `daripada` comparison; (5) match the context: advice (`sedia payung sebelum hujan`) differs from warning (`ada udang di balik batu`). A golden opener when quoting one: `Kata pepatah, …` ('As the proverb says, …') or `Seperti kata peribahasa, …`.",
    vocabulary: [
      {
        word: "peribahasa",
        en: "proverb / idiom",
        vi: "tục ngữ, thành ngữ",
        pos: "noun",
        pronunciation_vi: "pe-ri-BA-ha-sa — đồng nghĩa `pepatah`",
        pronunciation_en: "pe-ree-BAH-hah-sah — synonym `pepatah`",
      },
      {
        word: "menghanyutkan",
        en: "to sweep away / carry off",
        vi: "cuốn trôi",
        pos: "verb (meN-...-kan)",
        pronunciation_vi: "meng-ha-nyut-KAN — gốc `hanyut` (trôi) + `meN-...-kan`",
        pronunciation_en: "meng-ha-nyoot-KAN — root `hanyut` (adrift) + `meN-...-kan`",
      },
      {
        word: "bubur",
        en: "rice porridge / congee",
        vi: "cháo",
        pos: "noun",
        pronunciation_vi: "BU-bur — `nasi jadi bubur`: gạo thành CHÁO (không phải cơm)",
        pronunciation_en: "BOO-boor — `nasi jadi bubur`: rice becomes PORRIDGE (not cooked rice)",
      },
      {
        word: "gading",
        en: "ivory / elephant tusk",
        vi: "ngà voi",
        pos: "noun",
        pronunciation_vi: "GA-ding — `tak ada gading yang tak retak`",
        pronunciation_en: "GAH-ding — `tak ada gading yang tak retak`",
      },
      {
        word: "daripada",
        en: "than (in comparisons)",
        vi: "hơn (so sánh)",
        pos: "comparative",
        pronunciation_vi: "da-ri-PA-da — KHÁC `dari` (từ/khỏi)",
        pronunciation_en: "dah-ree-PAH-dah — NOT `dari` (from)",
      },
      {
        word: "dipijak",
        en: "to be stepped on",
        vi: "bị/được giẫm lên",
        pos: "verb (di- passive)",
        pronunciation_vi: "di-PI-jak — gốc `pijak` (giẫm) + bị động `di-`",
        pronunciation_en: "dee-PEE-jak — root `pijak` (to tread) + passive `di-`",
      },
      {
        word: "nyaring",
        en: "loud / resonant",
        vi: "vang, kêu to",
        pos: "adj.",
        pronunciation_vi: "NYA-ring — `ny` = 'nh'; `tong kosong nyaring bunyinya`",
        pronunciation_en: "NYAH-ring — `ny` = 'ny'; `tong kosong nyaring bunyinya`",
      },
      {
        word: "kata pepatah",
        en: "as the proverb says",
        vi: "tục ngữ có câu",
        pos: "phrase",
        pronunciation_vi: "KA-ta pe-PA-tah — mở đầu khi trích tục ngữ",
        pronunciation_en: "KAH-tah pe-PAH-tah — opener when quoting a proverb",
      },
    ],
    dialogue: [
      {
        speaker: "Adik",
        text: "Aku gagal ujian, padahal sudah belajar. Menyesal banget.",
        vi: "Em thi trượt, dù đã học rồi. Tiếc ghê.",
        en: "I failed the exam even though I studied. I really regret it.",
      },
      {
        speaker: "Kakak",
        text: "Sudahlah, nasi sudah menjadi bubur. Sekarang fokus ke depan.",
        vi: "Thôi mà, gạo đã thành cháo rồi (việc đã rồi). Giờ tập trung phía trước.",
        en: "Let it go — what's done is done. Focus forward now.",
      },
      {
        speaker: "Adik",
        text: "Iya. Mulai sekarang aku belajar sedikit-sedikit tiap hari.",
        vi: "Vâng. Từ giờ em sẽ học từng chút mỗi ngày.",
        en: "Right. From now I'll study a little every day.",
      },
      {
        speaker: "Kakak",
        text: "Bagus. Sedikit-sedikit, lama-lama menjadi bukit. Sedia payung sebelum hujan, ya.",
        vi: "Tốt. Tích tiểu thành đại. Và nhớ lo xa phòng bị trước nhé.",
        en: "Good. Bit by bit becomes a hill. And prepare ahead — ready the umbrella before the rain.",
      },
    ],
    exercises: [
      {
        type: "proverb_match",
        instruction_vi: "Ghép tục ngữ Indonesia với nghĩa bóng:",
        instruction_en: "Match the Indonesian proverb to its figurative meaning:",
        items: [
          { prompt: "Nasi sudah menjadi bubur.", answer: "việc đã rồi, không sửa được (what's done is done)" },
          { prompt: "Tong kosong nyaring bunyinya.", answer: "kẻ rỗng tuếch hay khoe khoang (empty vessels make the most noise)" },
          { prompt: "Sedia payung sebelum hujan.", answer: "lo xa, phòng bị trước (prepare before trouble)" },
          { prompt: "Tak ada gading yang tak retak.", answer: "không ai hoàn hảo (nobody is perfect)" },
          { prompt: "Ada udang di balik batu.", answer: "có động cơ giấu kín (a hidden motive)" },
        ],
      },
      {
        type: "equivalent_match",
        instruction_vi: "Ghép tục ngữ Indonesia với câu TƯƠNG ĐƯƠNG tiếng Việt:",
        instruction_en: "Match the Indonesian proverb to its VIETNAMESE equivalent:",
        items: [
          { prompt: "Karena nila setitik, rusak susu sebelanga.", answer: "Con sâu làm rầu nồi canh" },
          { prompt: "Buah jatuh tak jauh dari pohonnya.", answer: "Cha nào con nấy" },
          { prompt: "Sedikit-sedikit, lama-lama menjadi bukit.", answer: "Kiến tha lâu cũng đầy tổ" },
          { prompt: "Di mana bumi dipijak, di situ langit dijunjung.", answer: "Nhập gia tùy tục" },
          { prompt: "Sambil menyelam minum air.", answer: "Một công đôi việc" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu trong tục ngữ:",
        instruction_en: "Fill in the missing word in each proverb:",
        items: [
          { prompt: "Nasi sudah menjadi ___. (cháo)", answer: "bubur" },
          { prompt: "Tong kosong ___ bunyinya. (kêu vang)", answer: "nyaring" },
          { prompt: "Besar pasak ___ tiang. (hơn — so sánh)", answer: "daripada" },
          { prompt: "Sedia ___ sebelum hujan. (cái ô)", answer: "payung" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dùng tục ngữ phù hợp — dịch ý sang tiếng Indonesia:",
        instruction_en: "Use the fitting proverb — render the idea in Indonesian:",
        items: [
          { prompt: "Việc đã rồi, đừng tiếc nữa.", answer: "Nasi sudah menjadi bubur." },
          { prompt: "Hãy lo xa, chuẩn bị trước khi có chuyện.", answer: "Sedia payung sebelum hujan." },
          { prompt: "Tích tiểu thành đại.", answer: "Sedikit-sedikit, lama-lama menjadi bukit." },
          { prompt: "Không ai hoàn hảo cả.", answer: "Tak ada gading yang tak retak." },
        ],
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra về tục ngữ — bạn làm được chưa?",
        instruction_en: "Quick proverb self-check — can you do each one?",
        items: [
          { vi: "Tôi thuộc nguyên câu, không tự đổi từ.", en: "I memorize the whole line without swapping words." },
          { vi: "Tôi gắn mỗi câu với tương đương tiếng Việt.", en: "I anchor each to its Vietnamese equivalent." },
          { vi: "Tôi nhận ra bạn giả (hình ảnh khác: `bubur` = cháo).", en: "I spot false friends (different image: `bubur` = porridge)." },
          { vi: "Tôi nhận diện thể bị động `di-` trong tục ngữ (`dipijak`, `dijunjung`).", en: "I recognize the `di-` passive in proverbs (`dipijak`, `dijunjung`)." },
          { vi: "Tôi mở lời bằng `Kata pepatah, …` khi trích dẫn.", en: "I open with `Kata pepatah, …` when quoting." },
          { vi: "Tôi dùng đúng ngữ cảnh: khuyên răn vs cảnh giác.", en: "I match context: advice vs warning." },
        ],
      },
    ],
  },
];

export default lessons;
