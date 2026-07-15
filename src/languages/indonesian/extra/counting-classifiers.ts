// Counting & Classifiers Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files. When the shared Indonesian registry
// (src/languages/indonesian/lessons.ts) lands, swap the local types for a shared
// import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// This is a GRAMMAR pack on `kata bantu bilangan` (numeral classifiers / measure
// words). Vietnamese speakers have a HUGE head start: Vietnamese is itself a
// classifier language (con/cái/cây/tờ/quả...), so the CONCEPT transfers directly.
// The work is re-mapping each Vietnamese classifier to its Indonesian equivalent
// (con→ekor, cái→buah, cây→batang, tờ→lembar, sợi→helai, người→orang) and learning
// the WORD ORDER, which is the opposite of Vietnamese: Indonesian = NUMBER +
// CLASSIFIER + NOUN (`dua ekor kucing`), where Vietnamese = NUMBER + CLASSIFIER +
// NOUN too BUT the classifier is obligatory differently. Big relief: in casual
// Indonesian the classifier is often DROPPED (`dua kucing` is understood), unlike
// Vietnamese where it's stickier.

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
  /** Part of speech, e.g. "classifier", "noun". */
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

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
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
    id: "indonesian_counting_classifiers",
    level: "A2",
    category: "grammar",
    title_vi: "Lượng từ và cách đếm trong tiếng Indonesia",
    title_en: "Counting and classifiers in Indonesian",
    sentences: [
      // ── orang (people) — con người → orang ─────────────────────────────
      {
        en: "Ada tiga orang di ruangan ini.",
        vi: "Có ba người trong phòng này.",
        pronunciation_focus: [
          "A-da TI-ga O-rang — `orang` = lượng từ cho NGƯỜI; trật tự SỐ + LƯỢNG TỪ + (danh từ).",
          "Lợi thế người Việt: y như 'ba người' — tiếng Việt cũng đếm bằng lượng từ, khái niệm chuyển thẳng.",
          "Lỗi người Việt: nói `tiga manusia`. Đếm người dùng `orang`, không `manusia` (loài người, trừu tượng).",
          "Luyện: `Ada tiga orang di ruangan ini.`",
        ],
        pronunciation_focus_en: [
          "A-da TI-ga O-rang — `orang` = the classifier for PEOPLE; order is NUMBER + CLASSIFIER + (noun).",
          "VN-speaker win: just like 'ba người' — Vietnamese counts with classifiers too, so the concept transfers.",
          "VN-speaker trap: `tiga manusia`. Count people with `orang`, not `manusia` (humankind, abstract).",
          "Drill: `Ada tiga orang di ruangan ini.`",
        ],
      },
      {
        en: "Saya punya dua orang anak.",
        vi: "Tôi có hai người con / hai đứa con.",
        pronunciation_focus: [
          "SA-ya PU-nya DU-a O-rang A-nak — `dua orang anak` = hai người con; lượng từ `orang` đứng giữa SỐ và DANH TỪ.",
          "Lỗi người Việt: nói `dua anak orang` (sai trật tự). Đúng là SỐ + `orang` + DANH TỪ: `dua orang anak`.",
          "Luyện: `Saya punya dua orang anak.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PU-nya DU-a O-rang A-nak — `dua orang anak` = two children; the classifier `orang` sits between NUMBER and NOUN.",
          "VN-speaker trap: `dua anak orang` (wrong order). It's NUMBER + `orang` + NOUN: `dua orang anak`.",
          "Drill: `Saya punya dua orang anak.`",
        ],
      },
      // ── ekor (animals) — con → ekor ────────────────────────────────────
      {
        en: "Di rumah ada dua ekor kucing.",
        vi: "Ở nhà có hai con mèo.",
        pronunciation_focus: [
          "DU-a E-kor KU-ching — `ekor` (nghĩa đen 'cái đuôi') = lượng từ cho ĐỘNG VẬT; tương đương `con` của tiếng Việt.",
          "Lỗi người Việt: dùng `orang` cho thú hoặc bỏ qua. Động vật là `ekor`, đúng như `con` trong tiếng Việt.",
          "Luyện: `Di rumah ada dua ekor kucing.`",
        ],
        pronunciation_focus_en: [
          "DU-a E-kor KU-ching — `ekor` (literally 'tail') = the classifier for ANIMALS; the equivalent of Vietnamese `con`.",
          "VN-speaker trap: using `orang` for animals. Animals take `ekor`, exactly like Vietnamese `con`.",
          "Drill: `Di rumah ada dua ekor kucing.`",
        ],
      },
      {
        en: "Dia membeli lima ekor ayam di pasar.",
        vi: "Anh ấy mua năm con gà ở chợ.",
        pronunciation_focus: [
          "LI-ma E-kor A-yam — `ekor` dùng cho mọi con vật: gà, cá, chó, bò...; `c`='ch' nên `kucing`='ku-ching'.",
          "Lưu ý: trong khẩu ngữ có thể bỏ lượng từ (`lima ayam` vẫn hiểu), nhưng đếm trang trọng nên giữ `ekor`.",
          "Luyện: `Dia membeli lima ekor ayam di pasar.`",
        ],
        pronunciation_focus_en: [
          "LI-ma E-kor A-yam — `ekor` covers all animals: chicken, fish, dog, cow...; `c`='ch' so `kucing`='ku-ching'.",
          "VN-speaker note: casually the classifier can drop (`lima ayam` is understood), but keep `ekor` for careful counting.",
          "Drill: `Dia membeli lima ekor ayam di pasar.`",
        ],
      },
      // ── buah (the all-purpose object classifier) — cái/quả → buah ──────
      {
        en: "Saya mau beli tiga buah apel.",
        vi: "Tôi muốn mua ba quả táo.",
        pronunciation_focus: [
          "TI-ga BU-ah A-pel — `buah` (nghĩa đen 'trái cây') = lượng từ VẠN NĂNG cho vật/đồ; gần `cái`/`quả` của tiếng Việt.",
          "Lỗi người Việt: tìm lượng từ riêng cho mọi thứ. Khi bí, `buah` dùng được cho hầu hết đồ vật vô tri.",
          "Luyện: `Saya mau beli tiga buah apel.`",
        ],
        pronunciation_focus_en: [
          "TI-ga BU-ah A-pel — `buah` (literally 'fruit') = the ALL-PURPOSE classifier for objects; close to Vietnamese `cái`/`quả`.",
          "VN-speaker trap: hunting for a unique classifier for everything. When stuck, `buah` works for most inanimate objects.",
          "Drill: `Saya mau beli tiga buah apel.`",
        ],
      },
      {
        en: "Ada dua buah rumah di ujung jalan.",
        vi: "Có hai căn nhà ở cuối đường.",
        pronunciation_focus: [
          "DU-a BU-ah RU-mah — `buah` dùng được cho cả vật lớn (nhà, xe, hòn đảo, ý tưởng): `dua buah rumah`.",
          "Lưu ý người Việt: tiếng Việt phải đổi lượng từ (căn/chiếc/hòn), tiếng Indonesia `buah` bao phần lớn — DỄ HƠN.",
          "Luyện: `Ada dua buah rumah di ujung jalan.`",
        ],
        pronunciation_focus_en: [
          "DU-a BU-ah RU-mah — `buah` even covers large things (houses, cars, islands, ideas): `dua buah rumah`.",
          "VN-speaker note: Vietnamese switches classifiers (căn/chiếc/hòn); Indonesian `buah` blankets most of them — EASIER.",
          "Drill: `Ada dua buah rumah di ujung jalan.`",
        ],
      },
      // ── batang (long, rigid things) — cây/điếu → batang ────────────────
      {
        en: "Tolong ambil dua batang pensil.",
        vi: "Làm ơn lấy hai cây bút chì.",
        pronunciation_focus: [
          "DU-a BA-tang PEN-sil — `batang` (nghĩa đen 'thân cây') = lượng từ cho vật DÀI, CỨNG: bút, thuốc lá, cây...; như `cây`/`điếu`.",
          "Lỗi người Việt: dùng `buah` cho bút chì. Vật dài cứng nên dùng `batang` cho tự nhiên.",
          "Luyện: `Tolong ambil dua batang pensil.`",
        ],
        pronunciation_focus_en: [
          "DU-a BA-tang PEN-sil — `batang` (literally 'stem/trunk') = the classifier for LONG, RIGID things: pens, cigarettes, trees; like Vietnamese `cây`/`điếu`.",
          "VN-speaker trap: using `buah` for a pencil. Long rigid items sound natural with `batang`.",
          "Drill: `Tolong ambil dua batang pensil.`",
        ],
      },
      {
        en: "Dia menanam sepuluh batang pohon.",
        vi: "Ông ấy trồng mười cây.",
        pronunciation_focus: [
          "se-PU-luh BA-tang PO-hon — `sepuluh` = mười (`se-` + `puluh`); `batang pohon` = cây (thân cây).",
          "Lưu ý: `se-` = 'một' khi gắn lượng từ: `sebatang` (một cây), `seekor` (một con), `sebuah` (một cái), `seorang` (một người).",
          "Luyện: `Dia menanam sepuluh batang pohon.`",
        ],
        pronunciation_focus_en: [
          "se-PU-luh BA-tang PO-hon — `sepuluh` = ten (`se-` + `puluh`); `batang pohon` = tree (trunk).",
          "VN-speaker note: `se-` = 'one' fused to a classifier: `sebatang` (one stick), `seekor` (one animal), `sebuah` (one object), `seorang` (one person).",
          "Drill: `Dia menanam sepuluh batang pohon.`",
        ],
      },
      // ── lembar (flat/sheet things) — tờ → lembar ───────────────────────
      {
        en: "Saya butuh tiga lembar kertas.",
        vi: "Tôi cần ba tờ giấy.",
        pronunciation_focus: [
          "TI-ga LEM-bar KER-tas — `lembar` = lượng từ cho vật MỎNG, PHẲNG: giấy, vải, tiền giấy; như `tờ` của tiếng Việt.",
          "Lỗi người Việt: dùng `buah` cho giấy. Vật phẳng mỏng dùng `lembar`, đúng như `tờ`.",
          "Luyện: `Saya butuh tiga lembar kertas.`",
        ],
        pronunciation_focus_en: [
          "TI-ga LEM-bar KER-tas — `lembar` = the classifier for THIN, FLAT things: paper, cloth, banknotes; like Vietnamese `tờ`.",
          "VN-speaker trap: using `buah` for paper. Flat thin things take `lembar`, exactly like `tờ`.",
          "Drill: `Saya butuh tiga lembar kertas.`",
        ],
      },
      {
        en: "Tukar dua lembar uang lima puluh ribu, ya.",
        vi: "Đổi giúp hai tờ năm mươi nghìn nhé.",
        pronunciation_focus: [
          "DU-a LEM-bar U-ang ... — `lembar` cũng đếm tiền GIẤY (`uang kertas`); 'hai tờ' = `dua lembar`.",
          "Lưu ý: tiền XU (`koin`) thì đếm bằng `keping`, không `lembar` — phẳng vs tròn dẹt.",
          "Luyện: `Tukar dua lembar uang lima puluh ribu, ya.`",
        ],
        pronunciation_focus_en: [
          "DU-a LEM-bar U-ang ... — `lembar` also counts BANKNOTES (`uang kertas`); 'two notes' = `dua lembar`.",
          "VN-speaker note: COINS (`koin`) use `keping`, not `lembar` — flat-sheet vs flat-disc.",
          "Drill: `Tukar dua lembar uang lima puluh ribu, ya.`",
        ],
      },
      // ── helai (strands/threads/leaves) — sợi/lá → helai ────────────────
      {
        en: "Ada sehelai rambut di meja.",
        vi: "Có một sợi tóc trên bàn.",
        pronunciation_focus: [
          "se-HE-lai RAM-but — `helai` = lượng từ cho vật MẢNH, MỎNG NHƯ SỢI: tóc, lá, chỉ; `sehelai` = một sợi.",
          "Lỗi người Việt: dùng `batang` cho tóc. Tóc/lá/chỉ mềm mảnh dùng `helai`, gần `sợi`/`lá`.",
          "Luyện: `Ada sehelai rambut di meja.`",
        ],
        pronunciation_focus_en: [
          "se-HE-lai RAM-but — `helai` = the classifier for FINE, THREAD-LIKE things: hair, leaves, thread; `sehelai` = one strand.",
          "VN-speaker trap: using `batang` for a hair. Soft thin strands take `helai`, close to Vietnamese `sợi`/`lá`.",
          "Drill: `Ada sehelai rambut di meja.`",
        ],
      },
      {
        en: "Pohon itu kehilangan banyak helai daun.",
        vi: "Cái cây đó rụng nhiều lá.",
        pronunciation_focus: [
          "... ba-NYAK HE-lai DA-un — `helai daun` = lá (cây); `banyak` = nhiều (đứng trước lượng từ).",
          "Lưu ý: `lembar` (tờ, phẳng cứng hơn) vs `helai` (sợi/lá, mềm mảnh hơn) — đừng lẫn hai cái.",
          "Luyện: `Pohon itu kehilangan banyak helai daun.`",
        ],
        pronunciation_focus_en: [
          "... ba-NYAK HE-lai DA-un — `helai daun` = leaves; `banyak` = many (before the classifier).",
          "VN-speaker note: `lembar` (sheet, flatter/stiffer) vs `helai` (strand/leaf, softer/finer) — keep them apart.",
          "Drill: `Pohon itu kehilangan banyak helai daun.`",
        ],
      },
      // ── dropping the classifier + asking 'how many' ────────────────────
      {
        en: "Berapa ekor ikan yang kamu beli?",
        vi: "Bạn mua mấy con cá?",
        pronunciation_focus: [
          "be-RA-pa E-kor I-kan — `berapa` = mấy/bao nhiêu; trong câu hỏi vẫn giữ trật tự `berapa` + LƯỢNG TỪ + DANH TỪ.",
          "Lỗi người Việt: nói `berapa ikan ekor`. Đúng là `berapa ekor ikan` (số-hỏi + lượng từ + danh từ).",
          "Luyện: `Berapa ekor ikan yang kamu beli?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa E-kor I-kan — `berapa` = how many; the question keeps the order `berapa` + CLASSIFIER + NOUN.",
          "VN-speaker trap: `berapa ikan ekor`. Correct is `berapa ekor ikan` (question-number + classifier + noun).",
          "Drill: `Berapa ekor ikan yang kamu beli?`",
        ],
      },
      {
        en: "Beli dua kilo mangga dan tiga botol air.",
        vi: "Mua hai ký xoài và ba chai nước.",
        pronunciation_focus: [
          "DU-a KI-lo MANG-ga ... TI-ga BO-tol A-ir — `kilo` (đơn vị cân) và `botol` (chai) cũng hoạt động như lượng từ.",
          "Lưu ý người Việt: đơn vị đo/vật chứa (`kilo`, `botol`, `gelas`, `piring`, `bungkus`) đứng đúng chỗ lượng từ.",
          "Luyện: `Beli dua kilo mangga dan tiga botol air.`",
        ],
        pronunciation_focus_en: [
          "DU-a KI-lo MANG-ga ... TI-ga BO-tol A-ir — `kilo` (a weight unit) and `botol` (bottle) also act as classifiers.",
          "VN-speaker note: measure/container words (`kilo`, `botol`, `gelas`, `piring`, `bungkus`) slot into the classifier position.",
          "Drill: `Beli dua kilo mangga dan tiga botol air.`",
        ],
      },
      {
        en: "Kalau di percakapan santai, satu kucing juga sudah jelas.",
        vi: "Còn trong nói chuyện thoải mái, 'một mèo' cũng đã rõ rồi.",
        pronunciation_focus: [
          "... SA-tu KU-ching JU-ga SU-dah JE-las — khẩu ngữ thường BỎ lượng từ: `satu kucing` thay `seekor kucing`.",
          "Lợi thế người Việt: tiếng Indonesia dễ tính hơn — lượng từ KHÔNG bắt buộc như tiếng Việt; khi bí cứ nói SỐ + DANH TỪ.",
          "Luyện: `Kalau di percakapan santai, satu kucing juga sudah jelas.`",
        ],
        pronunciation_focus_en: [
          "... SA-tu KU-ching JU-ga SU-dah JE-las — casual speech often DROPS the classifier: `satu kucing` for `seekor kucing`.",
          "VN-speaker win: Indonesian is more forgiving — the classifier is NOT obligatory like in Vietnamese; when stuck, just say NUMBER + NOUN.",
          "Drill: `Kalau di percakapan santai, satu kucing juga sudah jelas.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Tiếng Indonesia dùng `kata bantu bilangan` (lượng từ / từ chỉ loại) giống tiếng Việt — đây là điểm người Việt CỰC kỳ có lợi, vì khái niệm 'số + lượng từ + danh từ' đã quen thuộc (ba CON mèo, hai CÁI bàn). Việc chính chỉ là ĐỔI BẢN ĐỒ từ lượng từ Việt sang Indonesia: `con` → `ekor` (động vật), `cái/quả` → `buah` (đồ vật vạn năng), `cây/điếu` → `batang` (vật dài cứng), `tờ` → `lembar` (vật phẳng mỏng), `sợi/lá` → `helai` (sợi mảnh), `người` → `orang` (con người). Một nét hay: số 'một' nhập vào lượng từ thành tiền tố `se-`: `seorang` (một người), `seekor` (một con), `sebuah` (một cái), `sebatang` (một cây), `selembar` (một tờ), `sehelai` (một sợi). KHÁC BIỆT LỚN & DỄ THỞ: trong tiếng Indonesia, lượng từ KHÔNG bắt buộc ngặt như tiếng Việt — khẩu ngữ thường bỏ luôn (`dua kucing` = 'hai mèo' vẫn hiểu), còn `buah` thì 'cứu hộ' được cho hầu hết đồ vật khi bạn quên lượng từ đúng. Cũng lưu ý các đơn vị đo/vật chứa (`kilo`, `botol`, `gelas`, `piring`, `bungkus`, `keping`) đứng đúng vị trí lượng từ.",
    cultural_notes_en:
      "Indonesian uses `kata bantu bilangan` (numeral classifiers / measure words) just like Vietnamese — a HUGE advantage for Vietnamese speakers, since 'number + classifier + noun' is already second nature (ba CON mèo, hai CÁI bàn). The real job is RE-MAPPING from Vietnamese classifiers to Indonesian: `con` → `ekor` (animals), `cái/quả` → `buah` (all-purpose objects), `cây/điếu` → `batang` (long rigid things), `tờ` → `lembar` (flat thin things), `sợi/lá` → `helai` (fine strands), `người` → `orang` (people). A neat feature: 'one' fuses into the classifier as the prefix `se-`: `seorang` (one person), `seekor` (one animal), `sebuah` (one object), `sebatang` (one stick), `selembar` (one sheet), `sehelai` (one strand). The BIG, RELIEVING difference: in Indonesian the classifier is NOT as obligatory as in Vietnamese — casual speech often drops it (`dua kucing` = 'two cats' is understood), and `buah` is a 'rescue' classifier for most objects when you forget the exact one. Also note measure/container words (`kilo`, `botol`, `gelas`, `piring`, `bungkus`, `keping`) occupy the classifier slot.",
    tip_advice_vi:
      "Học bằng BẢN ĐỒ Việt→Indonesia, không học rời rạc: `con`→`ekor`, `cái/quả`→`buah`, `cây/điếu`→`batang`, `tờ`→`lembar`, `sợi/lá`→`helai`, `người`→`orang`. Nhớ trật tự cố định: SỐ + LƯỢNG TỪ + DANH TỪ (`dua ekor kucing`) — và câu hỏi giữ nguyên: `berapa ekor kucing?`. Nắm tiền tố `se-` = 'một' (`seorang`, `seekor`, `sebuah`, `sebatang`, `selembar`, `sehelai`). Hai 'phao cứu sinh' khi bí: (1) dùng `buah` cho gần như mọi đồ vật vô tri; (2) bỏ luôn lượng từ trong khẩu ngữ (`dua kucing`) — tiếng Indonesia chấp nhận, không như tiếng Việt. Mẹo phát âm: `c`='ch' nên `kucing`='ku-ching'. Đừng dùng `orang` cho con vật (đó là `ekor`) hay `manusia` để đếm người (đó là `orang`).",
    tip_advice_en:
      "Learn by a Vietnamese→Indonesian MAP, not as isolated words: `con`→`ekor`, `cái/quả`→`buah`, `cây/điếu`→`batang`, `tờ`→`lembar`, `sợi/lá`→`helai`, `người`→`orang`. Fix the order: NUMBER + CLASSIFIER + NOUN (`dua ekor kucing`) — and questions keep it: `berapa ekor kucing?`. Master the prefix `se-` = 'one' (`seorang`, `seekor`, `sebuah`, `sebatang`, `selembar`, `sehelai`). Two 'lifelines' when stuck: (1) use `buah` for almost any inanimate object; (2) drop the classifier altogether in casual speech (`dua kucing`) — Indonesian allows it, unlike Vietnamese. Pronunciation tip: `c`='ch', so `kucing`='ku-ching'. Don't use `orang` for animals (that's `ekor`) or `manusia` to count people (that's `orang`).",
    vocabulary: [
      // The six core classifiers (mapped to Vietnamese)
      {
        cell_id: "6a4e8894-1b68-48a9-a236-458641fe110d",
        word: "orang",
        en: "classifier for people",
        vi: "lượng từ cho người (= người)",
        pos: "classifier",
        pronunciation_vi: "O-rang — `tiga orang` ba người; KHÔNG dùng cho thú",
        pronunciation_en: "O-rang — `tiga orang` three people; NOT for animals",
      },
      {
        cell_id: "4ea76043-5711-4a74-b9ee-952609a53c2f",
        word: "ekor",
        en: "classifier for animals (lit. 'tail')",
        vi: "lượng từ cho động vật (= con)",
        pos: "classifier",
        pronunciation_vi: "E-kor — `dua ekor kucing` hai con mèo; tương đương `con`",
        pronunciation_en: "E-kor — `dua ekor kucing` two cats; the Vietnamese `con`",
      },
      {
        cell_id: "16c4090d-053a-4301-a0b6-316d89718242",
        word: "buah",
        en: "all-purpose object classifier (lit. 'fruit')",
        vi: "lượng từ vạn năng cho đồ vật (= cái/quả)",
        pos: "classifier",
        pronunciation_vi: "BU-ah — 'phao cứu sinh' khi bí; `tiga buah apel`",
        pronunciation_en: "BU-ah — the 'rescue' classifier; `tiga buah apel`",
      },
      {
        cell_id: "5bd3a4a2-fd36-4d90-b660-e20edeff34ea",
        word: "batang",
        en: "classifier for long, rigid things (lit. 'stem')",
        vi: "lượng từ cho vật dài cứng (= cây/điếu)",
        pos: "classifier",
        pronunciation_vi: "BA-tang — bút, thuốc lá, cây; `dua batang pensil`",
        pronunciation_en: "BA-tang — pens, cigarettes, trees; `dua batang pensil`",
      },
      {
        cell_id: "ebca6049-9741-48b1-87a9-eaa395bcea2f",
        word: "lembar",
        en: "classifier for flat, thin things",
        vi: "lượng từ cho vật phẳng mỏng (= tờ)",
        pos: "classifier",
        pronunciation_vi: "LEM-bar — giấy, vải, tiền giấy; `tiga lembar kertas`",
        pronunciation_en: "LEM-bar — paper, cloth, banknotes; `tiga lembar kertas`",
      },
      {
        cell_id: "c3d61656-3ad2-4395-8f57-361867381d9c",
        word: "helai",
        en: "classifier for fine strands (hair, leaf, thread)",
        vi: "lượng từ cho vật sợi mảnh (= sợi/lá)",
        pos: "classifier",
        pronunciation_vi: "HE-lai — tóc, lá, chỉ; `sehelai rambut`",
        pronunciation_en: "HE-lai — hair, leaves, thread; `sehelai rambut`",
      },
      // se- prefix and number words
      {
        cell_id: "51544b29-0c40-41cf-bfad-bdea63b22d7c",
        word: "se-",
        en: "prefix 'one' fused to a classifier",
        vi: "tiền tố 'một' gắn vào lượng từ",
        pos: "prefix",
        pronunciation_vi: "se- — `seorang`, `seekor`, `sebuah`, `sebatang`, `selembar`, `sehelai`",
        pronunciation_en: "se- — `seorang`, `seekor`, `sebuah`, `sebatang`, `selembar`, `sehelai`",
      },
      {
        cell_id: "7d83e119-db1f-47b3-ab1e-53df0572301b",
        word: "berapa",
        en: "how many / how much",
        vi: "mấy / bao nhiêu",
        pos: "question word",
        pronunciation_vi: "be-RA-pa — `berapa ekor?` mấy con?; giữ trật tự lượng từ",
        pronunciation_en: "be-RA-pa — `berapa ekor?` how many (animals)?; keeps classifier order",
      },
      // Measure / container words that fill the same slot
      {
        cell_id: "485608a0-1547-4cb5-a42f-8ba9caa371f0",
        word: "kilo",
        en: "kilogram (measure word)",
        vi: "ký / cân (đơn vị)",
        pos: "measure word",
        pronunciation_vi: "KI-lo — `dua kilo mangga` hai ký xoài",
        pronunciation_en: "KI-lo — `dua kilo mangga` two kilos of mango",
      },
      {
        cell_id: "2ad27667-7ebd-4f37-8192-4b52a87aa316",
        word: "botol",
        en: "bottle (container classifier)",
        vi: "chai (vật chứa)",
        pos: "measure word",
        pronunciation_vi: "BO-tol — `tiga botol air` ba chai nước",
        pronunciation_en: "BO-tol — `tiga botol air` three bottles of water",
      },
      {
        cell_id: "bf65f582-1b25-4da5-a8c2-a1f26928c4f1",
        word: "bungkus",
        en: "pack / packet (container classifier)",
        vi: "gói (vật chứa)",
        pos: "measure word",
        pronunciation_vi: "BUNG-kus — `dua bungkus nasi` hai gói cơm",
        pronunciation_en: "BUNG-kus — `dua bungkus nasi` two packs of rice",
      },
      {
        cell_id: "8cafb369-7835-4e21-a2b7-8f1fbd712143",
        word: "keping",
        en: "classifier for coins / flat discs",
        vi: "lượng từ cho đồng xu / vật tròn dẹt",
        pos: "classifier",
        pronunciation_vi: "KE-ping — `koin` đếm bằng `keping`, không `lembar`",
        pronunciation_en: "KE-ping — coins use `keping`, not `lembar`",
      },
      // Common counted nouns (so the classifier has something to attach to)
      {
        cell_id: "2f634aef-5b32-4573-88eb-816123921609",
        word: "kucing",
        en: "cat",
        vi: "con mèo",
        pos: "noun",
        pronunciation_vi: "KU-ching — `c`='ch'; đếm `seekor kucing`",
        pronunciation_en: "KU-ching — `c`='ch'; counted `seekor kucing`",
      },
      {
        cell_id: "b4693f0a-f8a4-4fa6-b8ce-40dab84b80da",
        word: "kertas",
        en: "paper",
        vi: "giấy",
        pos: "noun",
        pronunciation_vi: "KER-tas — đếm `selembar kertas` một tờ giấy",
        pronunciation_en: "KER-tas — counted `selembar kertas` one sheet of paper",
      },
      {
        cell_id: "458c4010-ecfb-44ae-98b0-1f7bf8e27846",
        word: "rambut",
        en: "hair",
        vi: "tóc",
        pos: "noun",
        pronunciation_vi: "RAM-but — đếm `sehelai rambut` một sợi tóc",
        pronunciation_en: "RAM-but — counted `sehelai rambut` one strand of hair",
      },
    ],
    dialogue: [
      // Dialogue: at the market, classifiers in natural use
      {
        cell_id: "feb8c6a5-bca2-4fff-b65c-3760f693f27a",
        speaker: "Pembeli",
        text: "Bu, saya mau beli tiga ekor ikan dan dua kilo mangga.",
        vi: "Cô ơi, con muốn mua ba con cá và hai ký xoài.",
        en: "Ma'am, I'd like three fish and two kilos of mango.",
      },
      {
        cell_id: "925d1fb6-4741-47ba-a89d-3a9151726e7d",
        speaker: "Penjual",
        text: "Baik. Ikannya yang mana? Yang besar atau yang kecil?",
        vi: "Được. Cá loại nào? Loại to hay loại nhỏ?",
        en: "Alright. Which fish? The big or the small ones?",
      },
      {
        cell_id: "f257a061-57ef-42d5-8f80-98a143973863",
        speaker: "Pembeli",
        text: "Yang besar dua ekor, yang kecil satu ekor saja.",
        vi: "Loại to hai con, loại nhỏ một con thôi.",
        en: "Two big ones, just one small one.",
      },
      {
        cell_id: "652c5ce5-7bee-47f6-a8bf-03f86e39830c",
        speaker: "Penjual",
        text: "Siap. Mau tambah telur? Sepuluh butir lagi promo, lho.",
        vi: "Vâng. Có lấy thêm trứng không? Mười quả đang khuyến mãi đấy.",
        en: "Got it. Want to add eggs? Ten of them are on promo.",
      },
      {
        cell_id: "e4eff72a-a5d7-4327-8cc2-a942133d584d",
        speaker: "Pembeli",
        text: "Boleh, sepuluh butir telur. Oh, ada kantong plastik? Satu lembar saja.",
        vi: "Được, mười quả trứng. À, có túi nilon không? Một cái thôi.",
        en: "Sure, ten eggs. Oh, do you have a plastic bag? Just one.",
      },
      {
        cell_id: "dd619f99-c155-4fa3-a539-f6da11814481",
        speaker: "Penjual",
        text: "Ini. Jadi tiga ekor ikan, dua kilo mangga, sepuluh butir telur. Totalnya tujuh puluh ribu.",
        vi: "Đây ạ. Vậy là ba con cá, hai ký xoài, mười quả trứng. Tổng bảy mươi nghìn.",
        en: "Here. So three fish, two kilos of mango, ten eggs. Total seventy thousand.",
      },
      {
        cell_id: "5bc88103-0a36-43f3-aa1e-f2ed3c99deb3",
        speaker: "Pembeli",
        text: "Saya bayar pakai dua lembar lima puluh ribu, ya.",
        vi: "Con trả bằng hai tờ năm mươi nghìn nhé.",
        en: "I'll pay with two fifty-thousand notes.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi:
          "Ghép lượng từ Việt với lượng từ Indonesia tương đương:",
        instruction_en:
          "Match the Vietnamese classifier to its Indonesian equivalent:",
        items: [
          { prompt: "con (động vật)", answer: "ekor" },
          { prompt: "cái/quả (đồ vật)", answer: "buah" },
          { prompt: "cây/điếu (vật dài cứng)", answer: "batang" },
          { prompt: "tờ (vật phẳng mỏng)", answer: "lembar" },
          { prompt: "sợi/lá (sợi mảnh)", answer: "helai" },
          { prompt: "người (con người)", answer: "orang" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia (giữ trật tự SỐ + LƯỢNG TỪ + DANH TỪ):",
        instruction_en: "Translate into Indonesian (keep NUMBER + CLASSIFIER + NOUN order):",
        items: [
          { prompt: "Có ba người trong phòng này.", answer: "Ada tiga orang di ruangan ini." },
          { prompt: "Ở nhà có hai con mèo.", answer: "Di rumah ada dua ekor kucing." },
          { prompt: "Tôi muốn mua ba quả táo.", answer: "Saya mau beli tiga buah apel." },
          { prompt: "Làm ơn lấy hai cây bút chì.", answer: "Tolong ambil dua batang pensil." },
          { prompt: "Tôi cần ba tờ giấy.", answer: "Saya butuh tiga lembar kertas." },
          { prompt: "Có một sợi tóc trên bàn.", answer: "Ada sehelai rambut di meja." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Điền lượng từ đúng (`orang` · `ekor` · `buah` · `batang` · `lembar` · `helai`):",
        instruction_en:
          "Fill in the right classifier (`orang` · `ekor` · `buah` · `batang` · `lembar` · `helai`):",
        items: [
          { prompt: "Saya melihat lima ___ burung di pohon.", answer: "ekor", hint: "động vật" },
          { prompt: "Tolong beli dua ___ rokok.", answer: "batang", hint: "vật dài cứng" },
          { prompt: "Ada empat ___ tamu di depan.", answer: "orang", hint: "con người" },
          { prompt: "Berikan saya satu ___ tisu.", answer: "lembar", hint: "vật phẳng mỏng" },
          { prompt: "Ada tiga ___ benang di lantai.", answer: "helai", hint: "sợi mảnh" },
          { prompt: "Dia membeli sebuah ___ (mobil).", answer: "buah", hint: "đồ vật vạn năng — chú ý `se-` đã = một" },
        ],
      },
      {
        type: "se_prefix_drill",
        instruction_vi:
          "Ghép `se-` (= một) với lượng từ: một người = ___, một con = ___, một cái = ___, một cây = ___, một tờ = ___, một sợi = ___.",
        instruction_en:
          "Fuse `se-` (= one) with the classifier: one person = ___, one animal = ___, one object = ___, one stick = ___, one sheet = ___, one strand = ___.",
        items: [
          { prompt: "một người", answer: "seorang" },
          { prompt: "một con", answer: "seekor" },
          { prompt: "một cái", answer: "sebuah" },
          { prompt: "một cây", answer: "sebatang" },
          { prompt: "một tờ", answer: "selembar" },
          { prompt: "một sợi", answer: "sehelai" },
        ],
      },
      {
        type: "word_order",
        instruction_vi:
          "Sắp lại đúng trật tự (SỐ + LƯỢNG TỪ + DANH TỪ). Sửa câu sai:",
        instruction_en:
          "Reorder correctly (NUMBER + CLASSIFIER + NOUN). Fix the wrong sentence:",
        items: [
          { prompt: "dua anak orang (SAI)", answer: "dua orang anak" },
          { prompt: "berapa ikan ekor? (SAI)", answer: "berapa ekor ikan?" },
          { prompt: "kucing dua ekor (SAI)", answer: "dua ekor kucing" },
        ],
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra lượng từ — bạn làm được chưa?",
        instruction_en: "Quick classifier self-check — can you do each one?",
        items: [
          { vi: "Tôi ánh xạ được lượng từ Việt sang Indonesia (con→ekor...).", en: "I can map Vietnamese classifiers to Indonesian (con→ekor...)." },
          { vi: "Tôi giữ đúng trật tự SỐ + LƯỢNG TỪ + DANH TỪ.", en: "I keep NUMBER + CLASSIFIER + NOUN order." },
          { vi: "Tôi dùng được tiền tố `se-` cho 'một'.", en: "I can use the `se-` prefix for 'one'." },
          { vi: "Tôi biết `buah` là 'phao cứu sinh' cho đồ vật.", en: "I know `buah` is the 'rescue' classifier for objects." },
          { vi: "Tôi biết khẩu ngữ có thể bỏ lượng từ.", en: "I know casual speech can drop the classifier." },
          { vi: "Tôi không dùng `orang` cho thú hay `manusia` để đếm người.", en: "I don't use `orang` for animals or `manusia` to count people." },
        ],
      },
    ],
  },
];

export default lessons;
