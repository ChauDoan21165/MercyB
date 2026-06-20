// Prefix & Suffix Master — Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (construction-worker.ts, job-interview.ts,
// housing-rental.ts, medical-vocabulary.ts, error-bank-vietnamese.ts etc.), which in
// turn mirror the French `FrenchLesson` shape. When the shared Indonesian registry
// (src/languages/indonesian/lessons.ts) lands, swap the local types for a shared
// import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: the model Indonesian sentence), and `vi` holds the Vietnamese gloss.
// `pronunciation_focus` carries Vietnamese-facing notes; for this lesson each one
// breaks down ONE affix (rule + the common Vietnamese-speaker mistake + a drill).
// `pronunciation_focus_en` is the English-speaker companion, same length + order.
//
// This is the core grammar engine of Indonesian: the affix system. Vietnamese is
// isolating (no affixes — meaning comes from word order and separate words), so the
// meN-/ber-/di-/ter-/peN-/per-/se- prefixes and -kan/-an/-i/ke-…-an suffixes are the
// single hardest thing for Vietnamese learners. Master these and most of Indonesian
// grammar falls into place.

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
export type IndonesianExercise = Record<string, any>;

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
    id: "indonesian_prefix_suffix_master",
    level: "B1",
    category: "grammar",
    title_vi: "Làm chủ tiền tố & hậu tố tiếng Indonesia",
    title_en: "Mastering Indonesian prefixes & suffixes",
    sentences: [
      // ── meN- : active transitive verb ────────────────────────────────────
      {
        en: "Saya membaca buku setiap malam.",
        vi: "Tôi đọc sách mỗi tối.",
        pronunciation_focus: [
          "SA-ya mem-BA-ca BU-ku se-TI-ap MA-lam — `membaca` = đọc (meN- + `baca`); meN- biến `me-` thành `mem-` trước `b`.",
          "Lỗi người Việt: bỏ tiền tố — ❌ `saya baca buku` ở câu chuẩn → ✓ `saya membaca buku`. meN- đánh dấu động từ chủ động có tân ngữ.",
          "Luyện: `Saya membaca buku setiap malam.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mem-BA-cha BU-ku se-TEE-ap MA-lam — `membaca` = to read (meN- + `baca`); meN- becomes `mem-` before `b`.",
          "VN-speaker trap: dropping the prefix — ❌ `saya baca buku` in standard speech → ✓ `saya membaca buku`. meN- marks an active transitive verb.",
          "Drill: `Saya membaca buku setiap malam.`",
        ],
      },
      {
        en: "Dia menulis dan mengetik laporan.",
        vi: "Anh ấy viết và gõ báo cáo.",
        pronunciation_focus: [
          "DI-a me-NU-lis dan me-nge-TIK la-PO-ran — `menulis` (t rụng→`men-`), `mengetik` (gốc 1 âm `tik`→`menge-`).",
          "Lỗi người Việt: không nhớ luật biến âm — ❌ `mentulis` → ✓ `menulis`; gốc t/p/s/k RỤNG phụ âm đầu (tulis→menulis, pakai→memakai, sapu→menyapu, kirim→mengirim).",
          "Luyện: `Dia menulis dan mengetik laporan.`",
        ],
        pronunciation_focus_en: [
          "DI-a me-NU-lis dan me-nge-TIK la-PO-ran — `menulis` (t drops→`men-`), `mengetik` (1-syllable root `tik`→`menge-`).",
          "VN-speaker trap: forgetting the sound rule — ❌ `mentulis` → ✓ `menulis`; roots in t/p/s/k DROP the initial consonant (tulis→menulis, pakai→memakai, sapu→menyapu, kirim→mengirim).",
          "Drill: `Dia menulis dan mengetik laporan.`",
        ],
      },
      // ── ber- : intransitive / have / do-with ─────────────────────────────
      {
        en: "Saya berbicara dengan teman dan bekerja keras.",
        vi: "Tôi nói chuyện với bạn và làm việc chăm chỉ.",
        pronunciation_focus: [
          "SA-ya ber-bi-CA-ra de-NGAN te-MAN dan be-KER-ja ke-RAS — `berbicara` = nói chuyện, `bekerja` = làm việc (ber- + gốc, không cần tân ngữ).",
          "Lỗi người Việt: lẫn ber- (nội động/tự thân) với meN- (ngoại động). `berbicara`/`bekerja` KHÔNG cần tân ngữ; `membaca` thì cần.",
          "Luyện: `Saya berbicara dengan teman dan bekerja keras.`",
        ],
        pronunciation_focus_en: [
          "SA-ya ber-bi-CHA-ra de-NGAN te-MAN dan be-KER-ja ke-RAS — `berbicara` = to talk, `bekerja` = to work (ber- + root, no object needed).",
          "VN-speaker trap: confusing ber- (intransitive) with meN- (transitive). `berbicara`/`bekerja` take NO object; `membaca` needs one.",
          "Drill: `Saya berbicara dengan teman dan bekerja keras.`",
        ],
      },
      // ── di- : passive ────────────────────────────────────────────────────
      {
        en: "Nasi sudah dimasak oleh ibu.",
        vi: "Cơm đã được mẹ nấu.",
        pronunciation_focus: [
          "NA-si SU-dah di-MA-sak O-leh I-bu — `dimasak` = được nấu (bị động `di-` + `masak`); `oleh` = bởi.",
          "Lỗi người Việt: tránh bị động hoặc tách `di-` — ❌ `di masak` → ✓ `dimasak`. `di-` bị động DÍNH; người làm đi sau `oleh`.",
          "Luyện: `Nasi sudah dimasak oleh ibu.`",
        ],
        pronunciation_focus_en: [
          "NA-si SU-dah di-MA-sak O-leh EE-bu — `dimasak` = is/was cooked (passive `di-` + `masak`); `oleh` = by.",
          "VN-speaker trap: avoiding the passive or splitting `di-` — ❌ `di masak` → ✓ `dimasak`. The passive `di-` JOINS; the agent follows `oleh`.",
          "Drill: `Nasi sudah dimasak oleh ibu.`",
        ],
      },
      // ── ter- : accidental / resultant state ──────────────────────────────
      {
        en: "Saya tertidur di bus dan pintunya terbuka.",
        vi: "Tôi ngủ thiếp đi trên xe buýt và cửa thì (đang) mở.",
        pronunciation_focus: [
          "SA-ya ter-TI-dur di bus dan PIN-tu-nya ter-BU-ka — `tertidur` = ngủ quên (ngoài ý muốn); `terbuka` = đang mở (trạng thái).",
          "Lỗi người Việt: dùng `di-` cho việc ngoài ý muốn — ❌ `saya ditidur` → ✓ `saya tertidur`. ter- = vô tình/trạng thái KHÔNG có người gây ra; `di-` = bị động CÓ chủ ý.",
          "Luyện: `Saya tertidur di bus dan pintunya terbuka.`",
        ],
        pronunciation_focus_en: [
          "SA-ya ter-TEE-dur di bus dan PIN-tu-nya ter-BU-ka — `tertidur` = fell asleep (unintended); `terbuka` = is open (resultant state).",
          "VN-speaker trap: using `di-` for accidental events — ❌ `saya ditidur` → ✓ `saya tertidur`. ter- = accidental/stative with NO agent; `di-` = deliberate passive.",
          "Drill: `Saya tertidur di bus dan pintunya terbuka.`",
        ],
      },
      {
        en: "Gunung itu adalah yang tertinggi di pulau ini.",
        vi: "Ngọn núi đó là cao nhất trên đảo này.",
        pronunciation_focus: [
          "GU-nung I-tu A-da-lah yang ter-TING-gi di PU-lau I-ni — `tertinggi` = cao nhất (ter- + tính từ = so sánh nhất).",
          "Lợi thế người Việt: ter- + tính từ làm dạng cực cấp gọn — `terbesar` (lớn nhất), `terbaik` (tốt nhất), `terbaru` (mới nhất).",
          "Luyện: `Gunung itu yang tertinggi di pulau ini.`",
        ],
        pronunciation_focus_en: [
          "GU-nung EE-tu A-da-lah yang ter-TING-gi di PU-lau EE-ni — `tertinggi` = highest (ter- + adjective = superlative).",
          "VN-speaker win: ter- + adjective is a tidy superlative — `terbesar` (biggest), `terbaik` (best), `terbaru` (newest).",
          "Drill: `Gunung itu yang tertinggi di pulau ini.`",
        ],
      },
      // ── peN- : agent / doer noun ─────────────────────────────────────────
      {
        en: "Dia seorang penulis dan pengajar yang hebat.",
        vi: "Anh ấy là một nhà văn và người dạy giỏi.",
        pronunciation_focus: [
          "DI-a se-O-rang pe-NU-lis dan pe-nga-JAR yang HE-bat — `penulis` = người viết (peN- + `tulis`); `pengajar` = người dạy (peN- + `ajar`).",
          "Lỗi người Việt: lẫn động từ meN- với danh từ peN-. `menulis` (viết, động từ) ↔ `penulis` (nhà văn, danh từ); cùng luật biến âm.",
          "Luyện: `Dia seorang penulis dan pengajar.`",
        ],
        pronunciation_focus_en: [
          "DI-a se-O-rang pe-NU-lis dan pe-nga-JAR yang HE-bat — `penulis` = writer (peN- + `tulis`); `pengajar` = teacher (peN- + `ajar`).",
          "VN-speaker trap: confusing the meN- verb with the peN- noun. `menulis` (to write, verb) ↔ `penulis` (writer, noun); same sound rules.",
          "Drill: `Dia seorang penulis dan pengajar.`",
        ],
      },
      // ── per- : causative verb prefix ─────────────────────────────────────
      {
        en: "Tolong perbaiki AC dan perpanjang kontraknya.",
        vi: "Nhờ sửa máy lạnh và gia hạn hợp đồng giúp.",
        pronunciation_focus: [
          "TO-long per-BA-i-ki a-se dan per-PAN-jang KON-trak-nya — `perbaiki` = sửa cho tốt (per- + `baik` + -i); `perpanjang` = làm dài/gia hạn (per- + `panjang`).",
          "Lỗi người Việt: lẫn per- (làm cho…) với peN- (người…). per-/perbaiki là HÀNH ĐỘNG khiến vật tốt/dài hơn; `pe-` tạo DANH TỪ người.",
          "Luyện: `Tolong perbaiki AC dan perpanjang kontraknya.`",
        ],
        pronunciation_focus_en: [
          "TO-long per-BA-i-ki a-se dan per-PAN-jang KON-trak-nya — `perbaiki` = to fix/make good (per- + `baik` + -i); `perpanjang` = to lengthen/extend (per- + `panjang`).",
          "VN-speaker trap: confusing per- (make…) with peN- (one who…). per-/perbaiki is the ACTION of making something better/longer; `pe-` makes an AGENT noun.",
          "Drill: `Tolong perbaiki AC dan perpanjang kontraknya.`",
        ],
      },
      // ── se- : one / same / as…as ─────────────────────────────────────────
      {
        en: "Kami serumah dan dia setinggi saya.",
        vi: "Chúng tôi ở chung một nhà và anh ấy cao bằng tôi.",
        pronunciation_focus: [
          "KA-mi se-RU-mah dan DI-a se-TING-gi SA-ya — `se-` = một/cùng/bằng: `serumah` (chung một nhà), `setinggi` (cao bằng).",
          "Lợi thế người Việt: `se-` + tính từ = 'bằng…' (như nhau): `sebesar` (to bằng), `sebanyak` (nhiều bằng); gọn hơn 'cao bằng' tiếng Việt.",
          "Luyện: `Dia setinggi saya.`",
        ],
        pronunciation_focus_en: [
          "KA-mi se-RU-mah dan DI-a se-TING-gi SA-ya — `se-` = one/same/as: `serumah` (in the same house), `setinggi` (as tall as).",
          "VN-speaker win: `se-` + adjective = 'as … as': `sebesar` (as big as), `sebanyak` (as many as); neater than the Vietnamese phrasing.",
          "Drill: `Dia setinggi saya.`",
        ],
      },
      // ── -kan : causative / benefactive ───────────────────────────────────
      {
        en: "Tolong bukakan pintu dan bersihkan meja.",
        vi: "Nhờ mở cửa giúp và lau bàn.",
        pronunciation_focus: [
          "TO-long bu-ka-KAN PIN-tu dan ber-sih-KAN ME-ja — `-kan` khiến hành động hướng tới vật/người khác: `bukakan` (mở giúp), `bersihkan` (làm cho sạch).",
          "Lỗi người Việt: bỏ `-kan` khi cần khiến/giúp — ❌ `tolong buka pintu` (chỉ 'mở') vs ✓ `bukakan` (mở GIÚP ai). `-kan` = làm cho / vì người khác.",
          "Luyện: `Tolong bukakan pintu dan bersihkan meja.`",
        ],
        pronunciation_focus_en: [
          "TO-long bu-ka-KAN PIN-tu dan ber-sih-KAN ME-ja — `-kan` makes the action target another thing/person: `bukakan` (open for someone), `bersihkan` (make clean).",
          "VN-speaker trap: dropping `-kan` when you mean cause/benefit — ❌ `tolong buka pintu` (just 'open') vs ✓ `bukakan` (open FOR someone). `-kan` = make / on behalf of.",
          "Drill: `Tolong bukakan pintu dan bersihkan meja.`",
        ],
      },
      // ── -an : noun from verb/adjective ───────────────────────────────────
      {
        en: "Makanan dan minuman di sini enak.",
        vi: "Đồ ăn và đồ uống ở đây ngon.",
        pronunciation_focus: [
          "ma-KA-nan dan mi-NU-man di SI-ni E-nak — `-an` biến động từ thành danh từ: `makan`→`makanan` (đồ ăn), `minum`→`minuman` (đồ uống).",
          "Lỗi người Việt: dùng động từ gốc làm danh từ — ❌ `makan ini enak` (ăn này ngon) → ✓ `makanan ini enak` (đồ ăn này ngon). `-an` = kết quả/vật của hành động.",
          "Luyện: `Makanan dan minuman di sini enak.`",
        ],
        pronunciation_focus_en: [
          "ma-KA-nan dan mi-NU-man di SEE-ni E-nak — `-an` turns a verb into a noun: `makan`→`makanan` (food), `minum`→`minuman` (drink).",
          "VN-speaker trap: using the bare verb as a noun — ❌ `makan ini enak` (this eat is tasty) → ✓ `makanan ini enak` (this food is tasty). `-an` = the result/thing of the action.",
          "Drill: `Makanan dan minuman di sini enak.`",
        ],
      },
      // ── -i : transitive, locative / repetitive ───────────────────────────
      {
        en: "Dia menemani saya dan mengulangi pertanyaan.",
        vi: "Anh ấy đi cùng tôi và lặp lại câu hỏi.",
        pronunciation_focus: [
          "DI-a me-ne-MA-ni SA-ya dan me-ngu-LA-ngi per-ta-NYA-an — `-i` gắn động từ với đối tượng/nơi: `menemani` (đi cùng ai), `mengulangi` (lặp lại cái gì).",
          "Lỗi người Việt: lẫn `-kan` với `-i`. Mẹo: `-i` thường có đối tượng đứng yên/nơi chốn (`menemani`, `mendekati` lại gần); `-kan` đưa vật đi/khiến (`memberikan`, `membukakan`).",
          "Luyện: `Dia menemani saya dan mengulangi pertanyaan.`",
        ],
        pronunciation_focus_en: [
          "DI-a me-ne-MA-ni SA-ya dan me-ngu-LA-ngi per-ta-NYA-an — `-i` binds the verb to an object/place: `menemani` (accompany someone), `mengulangi` (repeat something).",
          "VN-speaker trap: confusing `-kan` with `-i`. Rule of thumb: `-i` often has a stationary object/location (`menemani`, `mendekati` approach); `-kan` moves a thing/causes it (`memberikan`, `membukakan`).",
          "Drill: `Dia menemani saya dan mengulangi pertanyaan.`",
        ],
      },
      // ── ke-…-an : abstract noun / adversative stative ────────────────────
      {
        en: "Keamanan penting, tetapi tadi saya kehujanan di jalan.",
        vi: "An ninh thì quan trọng, nhưng vừa nãy tôi bị dính mưa trên đường.",
        pronunciation_focus: [
          "ke-a-MA-nan PEN-ting, te-TA-pi TA-di SA-ya ke-hu-JA-nan di JA-lan — ke-…-an tạo DANH TỪ trừu tượng (`keamanan` an ninh) HOẶC trạng thái bị động không mong muốn (`kehujanan` bị dính mưa).",
          "Lỗi người Việt: bỏ qua nghĩa 'bị/không mong muốn' của ke-…-an — `kedinginan` (bị lạnh), `kepanasan` (bị nóng), `ketinggalan` (bị bỏ lỡ). Đây là cách diễn 'bị' tự nhiên nhất.",
          "Luyện: `Tadi saya kehujanan di jalan.`",
        ],
        pronunciation_focus_en: [
          "ke-a-MA-nan PEN-ting, te-TA-pi TA-di SA-ya ke-hu-JA-nan di JA-lan — ke-…-an forms an ABSTRACT NOUN (`keamanan` security) OR an unwanted stative passive (`kehujanan` got rained on).",
          "VN-speaker trap: missing the 'suffered/unwanted' sense of ke-…-an — `kedinginan` (got cold), `kepanasan` (got too hot), `ketinggalan` (got left behind). It's the most natural way to express 'suffer X'.",
          "Drill: `Tadi saya kehujanan di jalan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Tiếng Indonesia xây nghĩa bằng PHỤ TỐ gắn vào một GỐC TỪ (`akar kata`). Tiếng Việt thì 'đơn lập' — không gắn phụ tố, nghĩa đến từ trật tự và từ riêng — nên đây là rào cản lớn nhất. Bản đồ nhanh: TIỀN TỐ động từ — `meN-` (chủ động, có tân ngữ: `membaca`), `ber-` (tự thân/có-mang: `bekerja`, `berbaju`), `di-` (bị động có chủ ý: `dibaca`), `ter-` (vô tình/trạng thái/cực cấp: `tertidur`, `terbuka`, `terbesar`); TIỀN TỐ danh từ/khác — `peN-` (người làm: `penulis`), `per-` (làm cho…: `perbaiki`), `se-` (một/cùng/bằng: `serumah`, `setinggi`). HẬU TỐ — `-kan` (khiến/vì người khác: `bersihkan`), `-an` (vật/kết quả: `makanan`), `-i` (gắn đối tượng/nơi: `menemani`); KHUNG `ke-…-an` (danh từ trừu tượng `keamanan` HOẶC bị động không mong muốn `kehujanan`). Một gốc sinh cả họ từ: `ajar` → `mengajar` (dạy), `belajar` (học), `pengajar` (người dạy), `pelajaran` (bài học), `pelajar` (học sinh), `pembelajaran` (sự học). Nhớ luật biến âm meN-/peN-: gốc t/p/s/k RỤNG phụ âm đầu.",
    cultural_notes_en:
      "Indonesian builds meaning by attaching AFFIXES to a ROOT (`akar kata`). Vietnamese is 'isolating' — no affixes; meaning comes from word order and separate words — so this is the steepest hurdle. Quick map: VERB PREFIXES — `meN-` (active, takes an object: `membaca`), `ber-` (intransitive/have-wear: `bekerja`, `berbaju`), `di-` (deliberate passive: `dibaca`), `ter-` (accidental/stative/superlative: `tertidur`, `terbuka`, `terbesar`); NOUN/OTHER PREFIXES — `peN-` (agent: `penulis`), `per-` (make…: `perbaiki`), `se-` (one/same/as-as: `serumah`, `setinggi`). SUFFIXES — `-kan` (cause/benefactive: `bersihkan`), `-an` (thing/result: `makanan`), `-i` (object/locative: `menemani`); the CIRCUMFIX `ke-…-an` (abstract noun `keamanan` OR unwanted passive `kehujanan`). One root spawns a whole family: `ajar` → `mengajar` (teach), `belajar` (study), `pengajar` (teacher), `pelajaran` (lesson), `pelajar` (student), `pembelajaran` (learning). Remember the meN-/peN- sound rule: roots in t/p/s/k DROP the initial consonant.",
    tip_advice_vi:
      "Cách luyện nhanh nhất: chọn MỘT gốc và 'chia họ' nó. Ví dụ gốc `masak` (nấu) → `memasak` (nấu, chủ động), `dimasak` (được nấu), `masakan` (món ăn), `memasakkan` (nấu giúp ai). Làm vậy với `ajar`, `tulis`, `baca`, `kerja`. Hai 'cặp dễ nhầm' phải nắm: (1) `ter-` (vô tình, không người làm: `tertidur`) vs `di-` (bị động có chủ ý: `ditidurkan`); (2) `-kan` (đưa vật đi/khiến) vs `-i` (gắn đối tượng đứng yên/nơi chốn). Và luật biến âm meN-/peN-: b→mem, d/c/j→men, g/h/nguyên-âm→meng, s→meny (s rụng), t/p/s/k RỤNG. Mỗi gốc mới, đọc to cả 'họ từ' ba lần.",
    tip_advice_en:
      "Fastest way to drill: pick ONE root and 'conjugate its family'. E.g. root `masak` (cook) → `memasak` (to cook, active), `dimasak` (be cooked), `masakan` (a dish), `memasakkan` (cook for someone). Do the same with `ajar`, `tulis`, `baca`, `kerja`. Two confusable pairs to lock in: (1) `ter-` (accidental, no agent: `tertidur`) vs `di-` (deliberate passive: `ditidurkan`); (2) `-kan` (move a thing/cause) vs `-i` (bind to a stationary object/location). And the meN-/peN- sound rule: b→mem, d/c/j→men, g/h/vowel→meng, s→meny (s drops), t/p/s/k DROP. For each new root, say the whole 'word family' aloud three times.",
    vocabulary: [
      // Prefixes
      {
        word: "meN-",
        en: "active transitive verb prefix",
        vi: "tiền tố động từ chủ động",
        pos: "prefix",
        pronunciation_vi: "me-/mem-/men-/meng-/meny- — biến theo phụ âm đầu; t/p/s/k rụng",
        pronunciation_en: "me-/mem-/men-/meng-/meny- — varies by initial; t/p/s/k drop",
      },
      {
        word: "ber-",
        en: "intransitive / have / wear prefix",
        vi: "tiền tố tự thân / có-mang",
        pos: "prefix",
        pronunciation_vi: "ber- — `bekerja` (làm việc), `berbaju` (mặc áo); không cần tân ngữ",
        pronunciation_en: "ber- — `bekerja` (work), `berbaju` (wear a shirt); no object needed",
      },
      {
        word: "di-",
        en: "deliberate passive prefix",
        vi: "tiền tố bị động (có chủ ý)",
        pos: "prefix",
        pronunciation_vi: "di- — DÍNH động từ: `dibaca` (được đọc); người làm sau `oleh`",
        pronunciation_en: "di- — JOINED to verb: `dibaca` (is read); agent after `oleh`",
      },
      {
        word: "ter-",
        en: "accidental / stative / superlative prefix",
        vi: "tiền tố vô tình / trạng thái / cực cấp",
        pos: "prefix",
        pronunciation_vi: "ter- — `tertidur` (ngủ quên), `terbuka` (đang mở), `terbaik` (tốt nhất)",
        pronunciation_en: "ter- — `tertidur` (fell asleep), `terbuka` (is open), `terbaik` (best)",
      },
      {
        word: "peN-",
        en: "agent / doer noun prefix",
        vi: "tiền tố danh từ chỉ người làm",
        pos: "prefix",
        pronunciation_vi: "pe-/pem-/pen-/peng-/peny- — `penulis` (nhà văn), `pekerja` (công nhân)",
        pronunciation_en: "pe-/pem-/pen-/peng-/peny- — `penulis` (writer), `pekerja` (worker)",
      },
      {
        word: "per-",
        en: "causative verb prefix (make…)",
        vi: "tiền tố khiến (làm cho…)",
        pos: "prefix",
        pronunciation_vi: "per- — `perbaiki` (sửa), `perpanjang` (gia hạn), `perbesar` (làm to)",
        pronunciation_en: "per- — `perbaiki` (fix), `perpanjang` (extend), `perbesar` (enlarge)",
      },
      {
        word: "se-",
        en: "one / same / as…as prefix",
        vi: "tiền tố một / cùng / bằng",
        pos: "prefix",
        pronunciation_vi: "se- — `serumah` (cùng nhà), `setinggi` (cao bằng), `sehari` (một ngày)",
        pronunciation_en: "se- — `serumah` (same house), `setinggi` (as tall as), `sehari` (one day)",
      },
      // Suffixes
      {
        word: "-kan",
        en: "causative / benefactive suffix",
        vi: "hậu tố khiến / vì người khác",
        pos: "suffix",
        pronunciation_vi: "-kan — `bersihkan` (làm sạch), `bukakan` (mở giúp), `memberikan` (đưa cho)",
        pronunciation_en: "-kan — `bersihkan` (make clean), `bukakan` (open for), `memberikan` (give to)",
      },
      {
        word: "-an",
        en: "noun-forming suffix (thing/result)",
        vi: "hậu tố tạo danh từ (vật/kết quả)",
        pos: "suffix",
        pronunciation_vi: "-an — `makanan` (đồ ăn), `tulisan` (bài viết), `bulanan` (hàng tháng)",
        pronunciation_en: "-an — `makanan` (food), `tulisan` (a writing), `bulanan` (monthly)",
      },
      {
        word: "-i",
        en: "transitive / locative / repetitive suffix",
        vi: "hậu tố gắn đối tượng / nơi chốn / lặp",
        pos: "suffix",
        pronunciation_vi: "-i — `menemani` (đi cùng), `mendekati` (lại gần), `mengulangi` (lặp lại)",
        pronunciation_en: "-i — `menemani` (accompany), `mendekati` (approach), `mengulangi` (repeat)",
      },
      {
        word: "ke-…-an",
        en: "abstract-noun / adversative circumfix",
        vi: "khung danh từ trừu tượng / bị động không mong muốn",
        pos: "circumfix",
        pronunciation_vi: "ke-…-an — `keamanan` (an ninh), `kehujanan` (bị mưa), `kedinginan` (bị lạnh)",
        pronunciation_en: "ke-…-an — `keamanan` (security), `kehujanan` (got rained on), `kedinginan` (got cold)",
      },
      // The root concept + a worked family
      {
        word: "akar kata",
        en: "root word",
        vi: "từ gốc",
        pos: "noun",
        pronunciation_vi: "A-kar KA-ta — gốc trần phụ tố gắn vào; vd `ajar`, `masak`, `tulis`",
        pronunciation_en: "A-kar KA-ta — the bare root affixes attach to; e.g. `ajar`, `masak`, `tulis`",
      },
      {
        word: "mengajar / belajar",
        en: "to teach / to study (same root `ajar`)",
        vi: "dạy / học (cùng gốc `ajar`)",
        pos: "verb",
        pronunciation_vi: "me-nga-JAR / be-la-JAR — meN- = dạy (chủ động), ber- = học (tự thân)",
        pronunciation_en: "me-nga-JAR / be-la-JAR — meN- = teach (active), ber- = study (intransitive)",
      },
      {
        word: "pelajar / pelajaran",
        en: "student / lesson (root `ajar`)",
        vi: "học sinh / bài học (gốc `ajar`)",
        pos: "noun",
        pronunciation_vi: "pe-la-JAR / pe-la-JA-ran — cùng gốc với `mengajar`/`belajar`",
        pronunciation_en: "pe-la-JAR / pe-la-JA-ran — same root as `mengajar`/`belajar`",
      },
    ],
    dialogue: [
      // Dialogue: a study session building a 'word family' from one root
      {
        speaker: "Guru",
        text: "Hari ini kita belajar akar kata `masak`. Apa artinya?",
        vi: "Hôm nay chúng ta học từ gốc `masak`. Nghĩa là gì?",
        en: "Today we study the root `masak`. What does it mean?",
      },
      {
        speaker: "Murid",
        text: "`Masak` artinya nấu. Jadi `memasak` adalah nấu, ya, Bu?",
        vi: "`Masak` nghĩa là nấu. Vậy `memasak` là nấu phải không cô?",
        en: "`Masak` means to cook. So `memasak` is 'to cook', right ma'am?",
      },
      {
        speaker: "Guru",
        text: "Betul! Dan kalau nasi yang nasinya dimasak orang lain?",
        vi: "Đúng! Còn nếu là cơm được người khác nấu thì sao?",
        en: "Correct! And if it's rice that someone else cooks?",
      },
      {
        speaker: "Murid",
        text: "Nasi itu dimasak — pakai `di-` untuk pasif. Lalu makanannya disebut `masakan`.",
        vi: "Cơm đó `dimasak` — dùng `di-` cho bị động. Rồi món ăn gọi là `masakan`.",
        en: "The rice is `dimasak` — `di-` for passive. Then the dish is called `masakan`.",
      },
      {
        speaker: "Guru",
        text: "Hebat! Kamu sudah mengerti satu keluarga kata. Ingat: t/p/s/k luluh setelah meN-.",
        vi: "Tuyệt! Em đã hiểu một họ từ. Nhớ: t/p/s/k rụng sau meN-.",
        en: "Excellent! You've grasped one word family. Remember: t/p/s/k drop after meN-.",
      },
      {
        speaker: "Murid",
        text: "Iya, jadi `tulis` jadi `menulis`, bukan `mentulis`. Terima kasih, Bu!",
        vi: "Vâng, nên `tulis` thành `menulis`, không phải `mentulis`. Cảm ơn cô!",
        en: "Yes, so `tulis` becomes `menulis`, not `mentulis`. Thank you, ma'am!",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi:
          "Thêm tiền tố động từ đúng (`meN-`, `ber-`, `di-`, `ter-`):",
        instruction_en:
          "Add the correct verb prefix (`meN-`, `ber-`, `di-`, `ter-`):",
        items: [
          { prompt: "Saya ___baca buku. (đọc, chủ động)", answer: "mem", hint: "meN- + baca → membaca" },
          { prompt: "Buku itu ___baca oleh saya. (được đọc)", answer: "di", hint: "bị động có chủ ý" },
          { prompt: "Saya ___kerja di kantor. (làm việc, tự thân)", answer: "be", hint: "ber- + kerja → bekerja" },
          { prompt: "Saya ___tidur di bus. (ngủ quên)", answer: "ter", hint: "vô tình, không chủ ý" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn hậu tố đúng (`-kan`, `-an`, `-i`) hoặc khung `ke-…-an`:",
        instruction_en:
          "Choose the right suffix (`-kan`, `-an`, `-i`) or the `ke-…-an` circumfix:",
        items: [
          { prompt: "Tolong bersih___ meja ini. (làm cho sạch)", answer: "kan", hint: "-kan = khiến" },
          { prompt: "Makan___ di sini enak. (đồ ăn = danh từ)", answer: "an", hint: "-an = vật/kết quả" },
          { prompt: "Dia menemani saya = dia teman + ___. (gắn đối tượng)", answer: "i", hint: "-i = đi cùng ai" },
          { prompt: "Tadi saya ke___hujan___ di jalan. (bị dính mưa)", answer: "ke-…-an", hint: "kehujanan = bị mưa" },
        ],
      },
      {
        type: "word_family",
        instruction_vi:
          "Chia 'họ từ' từ gốc — điền dạng đúng:",
        instruction_en:
          "Build the 'word family' from the root — fill the correct form:",
        root: "tulis (viết / to write)",
        items: [
          { prompt: "viết (động từ chủ động)", answer: "menulis" },
          { prompt: "được viết (bị động)", answer: "ditulis" },
          { prompt: "người viết / nhà văn", answer: "penulis" },
          { prompt: "bài viết / chữ viết (danh từ)", answer: "tulisan" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia (chú ý phụ tố):",
        instruction_en: "Translate into Indonesian (mind the affixes):",
        items: [
          { prompt: "Anh ấy là một nhà văn.", answer: "Dia seorang penulis." },
          { prompt: "Cơm đã được mẹ nấu.", answer: "Nasi sudah dimasak oleh ibu." },
          { prompt: "Nhờ sửa máy lạnh giúp.", answer: "Tolong perbaiki AC." },
          { prompt: "Vừa nãy tôi bị dính mưa.", answer: "Tadi saya kehujanan." },
        ],
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra phụ tố — bạn nắm được chưa?",
        instruction_en: "Affix self-check — have you got each one?",
        items: [
          { vi: "Tôi biết khi nào dùng `meN-` (chủ động) vs `ber-` (tự thân).", en: "I know when to use `meN-` (transitive) vs `ber-` (intransitive)." },
          { vi: "Tôi phân biệt `di-` (bị động có chủ ý) và `ter-` (vô tình/trạng thái).", en: "I distinguish `di-` (deliberate passive) from `ter-` (accidental/stative)." },
          { vi: "Tôi nhớ luật rụng phụ âm t/p/s/k sau meN-/peN-.", en: "I remember the t/p/s/k drop rule after meN-/peN-." },
          { vi: "Tôi phân biệt `-kan` (khiến) và `-i` (gắn đối tượng/nơi).", en: "I distinguish `-kan` (causative) from `-i` (object/locative)." },
          { vi: "Tôi hiểu ke-…-an vừa là danh từ trừu tượng vừa là 'bị' không mong muốn.", en: "I understand ke-…-an as both an abstract noun and an unwanted 'suffer' form." },
          { vi: "Tôi chia được cả họ từ từ một gốc (vd `ajar`, `masak`, `tulis`).", en: "I can build a whole word family from one root (e.g. `ajar`, `masak`, `tulis`)." },
        ],
      },
    ],
  },
];

export default lessons;
