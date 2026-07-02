// Question Words in Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (shopping-bargaining.ts, formal-informal.ts,
// passive-active.ts, etc.), which in turn mirror the French `FrenchLesson` shape.
// When the shared Indonesian registry (src/languages/indonesian/lessons.ts) lands,
// swap the local types for a shared import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// Indonesian is written in Latin script and is largely phonetic. For Vietnamese
// speakers the big WINS are: no grammatical gender, no verb conjugation, no tones,
// no articles — and, crucially for THIS lesson, NO subject-verb inversion in
// questions. Indonesian keeps statement word order and just inserts the question
// word, exactly like Vietnamese ("Anh đi đâu?" → "Kamu pergi ke mana?"). The traps
// are: choosing the right WH-word (`apa` vs `apa yang`, `mengapa` vs `kenapa`,
// `bagaimana` vs `seperti apa`), placement (front OR in-situ, like Vietnamese),
// and the `berapa` family for numbers/prices/age.

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
    id: "indonesian_question_words",
    level: "A2",
    category: "grammar",
    title_vi: "Từ để hỏi trong tiếng Indonesia",
    title_en: "Question words in Indonesian",
    sentences: [
      // ── apa (what / yes-no marker) ──────────────────────────────────────
      {
        en: "Ini apa? — Apa yang kamu cari?",
        vi: "Cái này là gì? — Bạn đang tìm cái gì?",
        pronunciation_focus: [
          "I-ni A-pa? / A-pa yang KA-mu CA-ri? — `apa` = gì/cái gì; `apa yang …` = cái mà … (khi 'gì' là tân ngữ của động từ); `cari` đọc 'CHA-ri'.",
          "Lợi thế người Việt: đặt `apa` cuối câu kiểu 'là gì' giống hệt tiếng Việt — `Ini apa?` = 'Cái này (là) gì?'.",
          "Lỗi người Việt: bỏ `yang`. Khi hỏi vật làm tân ngữ: `Apa yang kamu cari?` (không `Apa kamu cari?`).",
          "Luyện: `Ini apa? Apa yang kamu cari?`",
        ],
        pronunciation_focus_en: [
          "EE-ni A-pa? / A-pa yang KA-moo CHA-ri? — `apa` = what; `apa yang …` = the thing that … (when 'what' is the object of a verb); `cari` is 'CHA-ri'.",
          "VN-speaker win: putting `apa` at the end maps 1:1 to Vietnamese — `Ini apa?` = 'This (is) what?'.",
          "VN-speaker trap: dropping `yang`. For 'what' as an object: `Apa yang kamu cari?` (not `Apa kamu cari?`).",
          "Drill: `Ini apa? Apa yang kamu cari?`",
        ],
      },
      {
        en: "Apa kamu sudah makan?",
        vi: "Bạn ăn chưa? (câu hỏi có/không)",
        pronunciation_focus: [
          "A-pa KA-mu SU-dah MA-kan? — `apa` đầu câu (= `apakah`) biến câu thành câu hỏi có/không; `sudah` = đã/rồi.",
          "Lỗi người Việt: thêm 'không/chưa' kiểu Việt. Câu hỏi có/không dùng `apa(kah)` đầu câu, HOẶC chỉ lên giọng cuối.",
          "Mẹo: trang trọng dùng `apakah`; đời thường dùng `apa` hoặc bỏ luôn, chỉ ngữ điệu.",
          "Luyện: `Apa kamu sudah makan?` / `Apakah Anda sudah makan?`",
        ],
        pronunciation_focus_en: [
          "A-pa KA-moo SU-dah MA-kan? — sentence-initial `apa` (= `apakah`) turns it into a yes/no question; `sudah` = already.",
          "VN-speaker trap: adding a Vietnamese-style 'or not'. A yes/no question uses `apa(kah)` up front, OR just rising intonation.",
          "Tip: formal = `apakah`; casual = `apa` or nothing at all, just intonation.",
          "Drill: `Apa kamu sudah makan?` / `Apakah Anda sudah makan?`",
        ],
      },
      // ── siapa (who) ─────────────────────────────────────────────────────
      {
        en: "Siapa nama kamu? — Kamu tinggal dengan siapa?",
        vi: "Bạn tên là gì? — Bạn sống với ai?",
        pronunciation_focus: [
          "si-A-pa NA-ma KA-mu? / KA-mu TING-gal DE-ngan si-A-pa? — `siapa` = ai; CHÚ Ý: hỏi TÊN dùng `siapa` (không `apa`): `Siapa nama kamu?`.",
          "Lỗi người Việt LỚN: dịch 'tên là gì' thành `Apa nama kamu?`. SAI — tên người hỏi bằng `siapa` (ai): `Siapa namamu?`.",
          "Lợi thế người Việt: `dengan siapa` (với ai) đặt cuối câu y như tiếng Việt.",
          "Luyện: `Siapa nama kamu?` (KHÔNG `Apa nama kamu?`)",
        ],
        pronunciation_focus_en: [
          "si-A-pa NA-ma KA-moo? / KA-moo TING-gal DE-ngan si-A-pa? — `siapa` = who; NOTE: ask a NAME with `siapa` (not `apa`): `Siapa nama kamu?`.",
          "BIG VN-speaker trap: rendering 'what is your name' as `Apa nama kamu?`. WRONG — a person's name is asked with `siapa` (who): `Siapa namamu?`.",
          "VN-speaker win: `dengan siapa` (with whom) goes at the end, just like Vietnamese.",
          "Drill: `Siapa nama kamu?` (NOT `Apa nama kamu?`)",
        ],
      },
      // ── di mana / ke mana / dari mana (where) ───────────────────────────
      {
        en: "Kamu tinggal di mana? Mau ke mana? Dari mana?",
        vi: "Bạn sống ở đâu? Muốn đi đâu? Từ đâu (đến)?",
        pronunciation_focus: [
          "KA-mu TING-gal di MA-na? MA-u ke MA-na? DA-ri MA-na? — `di mana` = ở đâu (vị trí); `ke mana` = đi đâu (hướng đến); `dari mana` = từ đâu (nguồn gốc).",
          "Lỗi người Việt: dùng `di mana` cho mọi nghĩa. Phải đổi giới từ: `di` (ở), `ke` (đến), `dari` (từ) + `mana`.",
          "Lợi thế người Việt: ba cặp này khớp đúng 'ở đâu / đi đâu / từ đâu' của tiếng Việt.",
          "Luyện: `Tinggal di mana? Mau ke mana? Dari mana?`",
        ],
        pronunciation_focus_en: [
          "KA-moo TING-gal di MA-na? MA-oo ke MA-na? DA-ri MA-na? — `di mana` = where (location); `ke mana` = where to (direction); `dari mana` = from where (origin).",
          "VN-speaker trap: using `di mana` for everything. Swap the preposition: `di` (at), `ke` (to), `dari` (from) + `mana`.",
          "VN-speaker win: these three map exactly onto Vietnamese 'ở đâu / đi đâu / từ đâu'.",
          "Drill: `Tinggal di mana? Mau ke mana? Dari mana?`",
        ],
      },
      // ── kapan (when) ────────────────────────────────────────────────────
      {
        en: "Kapan kamu datang? Jam berapa sampai?",
        vi: "Khi nào bạn đến? Mấy giờ tới?",
        pronunciation_focus: [
          "KA-pan KA-mu DA-tang? jam be-RA-pa SAM-pai? — `kapan` = khi nào (ngày/dịp); `jam berapa` = mấy giờ (giờ cụ thể); `sampai` = tới/đến nơi.",
          "Lỗi người Việt: dùng `kapan` để hỏi giờ. Giờ cụ thể hỏi `jam berapa`, không `kapan`.",
          "Mẹo: `kapan` không cần thì — câu giữ nguyên dạng, chỉ thêm `sudah`/`akan` nếu muốn rõ quá khứ/tương lai.",
          "Luyện: `Kapan kamu datang? Jam berapa sampai?`",
        ],
        pronunciation_focus_en: [
          "KA-pan KA-moo DA-tang? jam be-RA-pa SAM-pai? — `kapan` = when (day/occasion); `jam berapa` = what time (clock time); `sampai` = to arrive.",
          "VN-speaker trap: using `kapan` to ask the clock time. A specific time uses `jam berapa`, not `kapan`.",
          "Tip: `kapan` needs no tense — the sentence stays as is; add `sudah`/`akan` only to mark past/future explicitly.",
          "Drill: `Kapan kamu datang? Jam berapa sampai?`",
        ],
      },
      // ── mengapa / kenapa (why) ──────────────────────────────────────────
      {
        en: "Mengapa kamu terlambat? — Kenapa belum tidur?",
        vi: "Tại sao bạn đến muộn? — Sao chưa ngủ?",
        pronunciation_focus: [
          "me-NGA-pa KA-mu ter-LAM-bat? / ke-NA-pa be-LUM TI-dur? — `mengapa` = tại sao (trang trọng); `kenapa` = sao (đời thường, cùng nghĩa); `terlambat` = trễ.",
          "Lỗi người Việt: nghĩ hai từ khác nghĩa. `Mengapa` và `kenapa` ĐỒNG nghĩa; chỉ khác sắc thái trang trọng.",
          "Mẹo: trả lời bằng `karena …` (bởi vì …): `Karena macet.` (Vì kẹt xe).",
          "Luyện: `Mengapa kamu terlambat? Kenapa belum tidur?`",
        ],
        pronunciation_focus_en: [
          "me-NGA-pa KA-moo ter-LAM-bat? / ke-NA-pa be-LOOM TEE-door? — `mengapa` = why (formal); `kenapa` = why (casual, same meaning); `terlambat` = late.",
          "VN-speaker trap: thinking they differ in meaning. `Mengapa` and `kenapa` are SYNONYMS; only the formality differs.",
          "Tip: answer with `karena …` (because …): `Karena macet.` (Because of traffic).",
          "Drill: `Mengapa kamu terlambat? Kenapa belum tidur?`",
        ],
      },
      // ── berapa (how much/many) ──────────────────────────────────────────
      {
        en: "Berapa harganya? Umur kamu berapa? Berapa orang?",
        vi: "Giá bao nhiêu? Bạn bao nhiêu tuổi? Bao nhiêu người?",
        pronunciation_focus: [
          "be-RA-pa HAR-ga-nya? U-mur KA-mu be-RA-pa? be-RA-pa O-rang? — `berapa` = bao nhiêu (số/giá/tuổi/lượng); `umur` = tuổi; `orang` = người (lượng từ).",
          "Lỗi người Việt: dùng `berapa` không kèm lượng từ khi đếm. Đếm người: `berapa orang`; đếm con vật: `berapa ekor`.",
          "Mẹo: `berapa` đứng linh hoạt — trước danh từ (`berapa orang`) hoặc cuối câu (`umurnya berapa`).",
          "Luyện: `Berapa harganya? Umur kamu berapa?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa HAR-ga-nya? OO-moor KA-moo be-RA-pa? be-RA-pa O-rang? — `berapa` = how much/many (number/price/age/quantity); `umur` = age; `orang` = person (classifier).",
          "VN-speaker trap: using `berapa` without a classifier when counting. People: `berapa orang`; animals: `berapa ekor`.",
          "Tip: `berapa` is flexible — before the noun (`berapa orang`) or at the end (`umurnya berapa`).",
          "Drill: `Berapa harganya? Umur kamu berapa?`",
        ],
      },
      // ── bagaimana (how) ─────────────────────────────────────────────────
      {
        en: "Bagaimana kabar kamu? Bagaimana cara ke sana?",
        vi: "Bạn khỏe không (tình hình thế nào)? Làm sao để đến đó?",
        pronunciation_focus: [
          "ba-gai-MA-na KA-bar KA-mu? ba-gai-MA-na CA-ra ke SA-na? — `bagaimana` = thế nào/làm sao; `kabar` = tin tức/tình hình; `cara` = cách.",
          "Lỗi người Việt: dùng `bagaimana` để hỏi 'trông như thế nào'. Hình thức/vẻ ngoài hỏi `seperti apa`; cách thức/tình hình hỏi `bagaimana`.",
          "Mẹo: đời thường rút gọn `bagaimana` → `gimana` (`Gimana kabarnya?`).",
          "Luyện: `Bagaimana kabar kamu? Bagaimana cara ke sana?`",
        ],
        pronunciation_focus_en: [
          "ba-gai-MA-na KA-bar KA-moo? ba-gai-MA-na CHA-ra ke SA-na? — `bagaimana` = how; `kabar` = news/state; `cara` = way/method.",
          "VN-speaker trap: using `bagaimana` to ask 'what does it look like'. Appearance = `seperti apa`; manner/state = `bagaimana`.",
          "Tip: casually, `bagaimana` shortens to `gimana` (`Gimana kabarnya?`).",
          "Drill: `Bagaimana kabar kamu? Bagaimana cara ke sana?`",
        ],
      },
      // ── yang mana (which one) ───────────────────────────────────────────
      {
        en: "Yang mana punya kamu? Kamu mau yang mana?",
        vi: "Cái nào là của bạn? Bạn muốn cái nào?",
        pronunciation_focus: [
          "yang MA-na PU-nya KA-mu? KA-mu MA-u yang MA-na? — `yang mana` = cái nào (chọn trong nhóm); `punya` = của/sở hữu.",
          "Lỗi người Việt: dùng `apa` cho 'cái nào'. Chọn lựa giữa các vật dùng `yang mana`, không `apa`.",
          "Mẹo: phân biệt `mana` (đâu, vị trí) với `yang mana` (cái nào, lựa chọn).",
          "Luyện: `Yang mana punya kamu? Kamu mau yang mana?`",
        ],
        pronunciation_focus_en: [
          "yang MA-na POO-nya KA-moo? KA-moo MA-oo yang MA-na? — `yang mana` = which one (choosing from a set); `punya` = to own/belong to.",
          "VN-speaker trap: using `apa` for 'which one'. Choosing among items uses `yang mana`, not `apa`.",
          "Tip: distinguish `mana` (where, location) from `yang mana` (which one, selection).",
          "Drill: `Yang mana punya kamu? Kamu mau yang mana?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Tin vui lớn nhất cho người Việt học từ để hỏi tiếng Indonesia: KHÔNG CÓ ĐẢO NGỮ. Khác hẳn tiếng Anh (phải đảo 'do/does/is' lên đầu), tiếng Indonesia giữ NGUYÊN trật tự câu kể và chỉ chèn từ để hỏi vào — y hệt tiếng Việt. So sánh:\n- Việt: 'Bạn đi đâu?' → Indo: 'Kamu pergi ke mana?' (cùng trật tự, cùng vị trí từ hỏi cuối câu).\n- Việt: 'Cái này là gì?' → Indo: 'Ini apa?'.\nVì vậy bản năng đặt câu hỏi của bạn gần như chuyển thẳng sang tiếng Indonesia.\n\nMƯỜI TỪ HỎI CỐT LÕI: `apa` (gì), `siapa` (ai), `(di/ke/dari) mana` (ở/đến/từ đâu), `kapan` (khi nào), `mengapa`/`kenapa` (tại sao), `berapa` (bao nhiêu), `bagaimana` (thế nào), `yang mana` (cái nào). Học chắc 10 từ này là xử lý được hầu hết tình huống hỏi đáp.\n\nVỊ TRÍ TỪ HỎI linh hoạt: có thể đặt ĐẦU câu (nhấn mạnh, trang trọng hơn) hoặc TẠI CHỖ/CUỐI câu (đời thường). `Di mana kamu tinggal?` = `Kamu tinggal di mana?` — cả hai đúng. Người Việt thấy quen vì tiếng Việt cũng cho cả hai.\n\nTRANG TRỌNG vs ĐỜI THƯỜNG: cặp `mengapa` (trang trọng) / `kenapa` (đời thường) cùng nghĩa. `Bagaimana` rút thành `gimana` khi nói chuyện. Câu hỏi có/không: trang trọng thêm `apakah` đầu câu (`Apakah Anda setuju?`), đời thường chỉ cần lên giọng (`Kamu setuju?`).\n\nHAI CÁI BẪY HÀNG ĐẦU của người Việt:\n1) Hỏi TÊN bằng `siapa` (ai), KHÔNG `apa`: `Siapa nama kamu?` — vì tên gắn với con người. Dùng `Apa nama kamu?` là lỗi kinh điển.\n2) Đổi giới từ cho `mana`: `di` (ở) / `ke` (đến) / `dari` (từ). Đừng dùng `di mana` cho mọi hướng.",
    cultural_notes_en:
      "The best news for Vietnamese learners of Indonesian question words: THERE IS NO INVERSION. Unlike English (which fronts 'do/does/is'), Indonesian keeps the STATEMENT word order and just inserts the question word — exactly like Vietnamese. Compare:\n- VN: 'Bạn đi đâu?' → Indo: 'Kamu pergi ke mana?' (same order, question word at the end).\n- VN: 'Cái này là gì?' → Indo: 'Ini apa?'.\nSo your Vietnamese question instinct transfers almost directly into Indonesian.\n\nTHE TEN CORE WH-WORDS: `apa` (what), `siapa` (who), `(di/ke/dari) mana` (where at/to/from), `kapan` (when), `mengapa`/`kenapa` (why), `berapa` (how much/many), `bagaimana` (how), `yang mana` (which). Master these ten and you cover almost every question situation.\n\nWORD POSITION is flexible: front the WH-word (more emphatic/formal) or keep it in-situ/at the end (casual). `Di mana kamu tinggal?` = `Kamu tinggal di mana?` — both correct. Vietnamese speakers find this familiar since Vietnamese also allows both.\n\nFORMAL vs CASUAL: the pair `mengapa` (formal) / `kenapa` (casual) mean the same. `Bagaimana` shortens to `gimana` in speech. Yes/no questions: formal adds `apakah` up front (`Apakah Anda setuju?`); casual just uses rising intonation (`Kamu setuju?`).\n\nTHE TWO TOP TRAPS for Vietnamese speakers:\n1) Ask a NAME with `siapa` (who), NOT `apa`: `Siapa nama kamu?` — because a name belongs to a person. `Apa nama kamu?` is the classic error.\n2) Swap the preposition for `mana`: `di` (at) / `ke` (to) / `dari` (from). Don't use `di mana` for every direction.",
    tip_advice_vi:
      "Học bảng 10 từ hỏi như một 'bộ công cụ' và ghép vào trật tự câu kể (KHÔNG đảo ngữ):\n\n| Từ hỏi | Nghĩa | Ví dụ |\n| `apa` | gì | `Ini apa?` / `Apa yang kamu mau?` |\n| `siapa` | ai (cả TÊN) | `Siapa namamu?` / `Dengan siapa?` |\n| `di/ke/dari mana` | ở/đến/từ đâu | `Tinggal di mana? Mau ke mana? Dari mana?` |\n| `kapan` | khi nào | `Kapan ulang tahunmu?` |\n| `jam berapa` | mấy giờ | `Jam berapa sekarang?` |\n| `mengapa`/`kenapa` | tại sao | `Kenapa sedih?` → trả lời `Karena …` |\n| `berapa` | bao nhiêu | `Berapa harganya? Berapa orang?` |\n| `bagaimana`/`gimana` | thế nào | `Bagaimana kabarmu?` |\n| `yang mana` | cái nào | `Kamu pilih yang mana?` |\n\nBA QUY TẮC VÀNG:\n1) Hỏi TÊN = `siapa`, không `apa` (`Siapa namamu?`).\n2) `mana` phải đi với giới từ đúng hướng: `di`/`ke`/`dari`.\n3) Khi 'gì/ai/cái nào' là TÂN NGỮ của động từ, thêm `yang`: `Apa yang kamu beli?`, `Siapa yang datang?`, `Yang mana yang kamu suka?`.\n\nNÂNG CẤP TRANG TRỌNG: thêm `apakah` cho câu có/không (`Apakah Anda sudah makan?`), dùng `mengapa` thay `kenapa`, `bagaimana` thay `gimana`. Giữ giọng phẳng; `c` đọc 'ch', `j` đọc 'j' (như 'jam').",
    tip_advice_en:
      "Treat the 10 WH-words as a toolkit and slot them into statement order (NO inversion):\n\n| WH-word | Meaning | Example |\n| `apa` | what | `Ini apa?` / `Apa yang kamu mau?` |\n| `siapa` | who (incl. a NAME) | `Siapa namamu?` / `Dengan siapa?` |\n| `di/ke/dari mana` | where at/to/from | `Tinggal di mana? Mau ke mana? Dari mana?` |\n| `kapan` | when | `Kapan ulang tahunmu?` |\n| `jam berapa` | what time | `Jam berapa sekarang?` |\n| `mengapa`/`kenapa` | why | `Kenapa sedih?` → answer `Karena …` |\n| `berapa` | how much/many | `Berapa harganya? Berapa orang?` |\n| `bagaimana`/`gimana` | how | `Bagaimana kabarmu?` |\n| `yang mana` | which one | `Kamu pilih yang mana?` |\n\nTHREE GOLDEN RULES:\n1) Ask a NAME with `siapa`, not `apa` (`Siapa namamu?`).\n2) `mana` must take the direction-correct preposition: `di`/`ke`/`dari`.\n3) When 'what/who/which' is the OBJECT of a verb, add `yang`: `Apa yang kamu beli?`, `Siapa yang datang?`, `Yang mana yang kamu suka?`.\n\nFORMALITY UPGRADE: add `apakah` for yes/no questions (`Apakah Anda sudah makan?`), use `mengapa` over `kenapa`, `bagaimana` over `gimana`. Keep your pitch flat; `c` is 'ch', `j` is the English 'j' as in 'jam'.",
    vocabulary: [
      {
        word: "apa",
        en: "what (also a yes/no marker)",
        vi: "gì / cái gì",
        pos: "question word",
        pronunciation_vi: "A-pa — `apa yang …` khi 'gì' là tân ngữ; đầu câu = hỏi có/không",
        pronunciation_en: "A-pa — `apa yang …` when 'what' is an object; sentence-initial = yes/no marker",
      },
      {
        word: "siapa",
        en: "who (and for asking names)",
        vi: "ai (cả khi hỏi tên)",
        pos: "question word",
        pronunciation_vi: "si-A-pa — hỏi tên: `Siapa namamu?` (KHÔNG `apa`)",
        pronunciation_en: "si-A-pa — ask a name: `Siapa namamu?` (NOT `apa`)",
      },
      {
        word: "mana",
        en: "where (with di/ke/dari)",
        vi: "đâu (đi với di/ke/dari)",
        pos: "question word",
        pronunciation_vi: "MA-na — `di mana` (ở), `ke mana` (đến), `dari mana` (từ)",
        pronunciation_en: "MA-na — `di mana` (at), `ke mana` (to), `dari mana` (from)",
      },
      {
        word: "kapan",
        en: "when (day/occasion)",
        vi: "khi nào",
        pos: "question word",
        pronunciation_vi: "KA-pan — giờ cụ thể dùng `jam berapa`, không `kapan`",
        pronunciation_en: "KA-pan — for clock time use `jam berapa`, not `kapan`",
      },
      {
        word: "mengapa",
        en: "why (formal)",
        vi: "tại sao (trang trọng)",
        pos: "question word",
        pronunciation_vi: "me-NGA-pa — đồng nghĩa `kenapa`; trả lời `karena …`",
        pronunciation_en: "me-NGA-pa — synonym of `kenapa`; answer with `karena …`",
      },
      {
        word: "kenapa",
        en: "why (casual)",
        vi: "sao (đời thường)",
        pos: "question word",
        pronunciation_vi: "ke-NA-pa — cùng nghĩa `mengapa`, dùng khi thân mật",
        pronunciation_en: "ke-NA-pa — same meaning as `mengapa`, used casually",
      },
      {
        word: "berapa",
        en: "how much / how many",
        vi: "bao nhiêu",
        pos: "question word",
        pronunciation_vi: "be-RA-pa — số/giá/tuổi/lượng; kèm lượng từ khi đếm (`berapa orang`)",
        pronunciation_en: "be-RA-pa — number/price/age/quantity; add a classifier when counting (`berapa orang`)",
      },
      {
        word: "bagaimana",
        en: "how (manner / state)",
        vi: "thế nào / làm sao",
        pos: "question word",
        pronunciation_vi: "ba-gai-MA-na — đời thường `gimana`; vẻ ngoài dùng `seperti apa`",
        pronunciation_en: "ba-gai-MA-na — casual `gimana`; appearance uses `seperti apa`",
      },
      {
        word: "yang mana",
        en: "which one (selection)",
        vi: "cái nào",
        pos: "question word",
        pronunciation_vi: "yang MA-na — chọn trong nhóm; khác `mana` (vị trí)",
        pronunciation_en: "yang MA-na — choosing from a set; differs from `mana` (location)",
      },
      {
        word: "yang",
        en: "that / which (relativizer)",
        vi: "(cái) mà",
        pos: "particle",
        pronunciation_vi: "yang — thêm khi từ hỏi là tân ngữ: `Apa yang…`, `Siapa yang…`",
        pronunciation_en: "yang — add it when the WH-word is an object: `Apa yang…`, `Siapa yang…`",
      },
      {
        word: "apakah",
        en: "(formal yes/no question marker)",
        vi: "(dấu hỏi có/không trang trọng)",
        pos: "particle",
        pronunciation_vi: "a-pa-KAH — `Apakah Anda setuju?`; đời thường bỏ, chỉ lên giọng",
        pronunciation_en: "a-pa-KAH — `Apakah Anda setuju?`; casual drops it, just intonation",
      },
      {
        word: "jam berapa",
        en: "what time",
        vi: "mấy giờ",
        pos: "phrase",
        pronunciation_vi: "jam be-RA-pa — giờ đồng hồ; `kapan` chỉ ngày/dịp",
        pronunciation_en: "jam be-RA-pa — clock time; `kapan` is for the day/occasion",
      },
    ],
    dialogue: [
      // Dialogue A: first-meeting small talk, running through the WH-words
      {
        speaker: "Budi",
        text: "Hai! Siapa nama kamu?",
        vi: "Chào! Bạn tên gì?",
        en: "Hi! What's your name?",
      },
      {
        speaker: "Linh",
        text: "Nama saya Linh. Kamu siapa?",
        vi: "Tôi tên Linh. Còn bạn?",
        en: "My name is Linh. And you?",
      },
      {
        speaker: "Budi",
        text: "Saya Budi. Kamu dari mana? Tinggal di mana sekarang?",
        vi: "Tôi là Budi. Bạn từ đâu đến? Giờ sống ở đâu?",
        en: "I'm Budi. Where are you from? Where do you live now?",
      },
      {
        speaker: "Linh",
        text: "Saya dari Vietnam. Sekarang tinggal di Jakarta. Kamu kerja apa?",
        vi: "Tôi từ Việt Nam. Giờ sống ở Jakarta. Bạn làm nghề gì?",
        en: "I'm from Vietnam. Now I live in Jakarta. What work do you do?",
      },
      {
        speaker: "Budi",
        text: "Saya guru. Kapan kamu datang ke Indonesia? Dan kenapa pilih Jakarta?",
        vi: "Tôi là giáo viên. Bạn đến Indonesia khi nào? Và sao lại chọn Jakarta?",
        en: "I'm a teacher. When did you come to Indonesia? And why did you choose Jakarta?",
      },
      {
        speaker: "Linh",
        text: "Saya datang tahun lalu, karena ada pekerjaan di sini. Bagaimana cara ke kantor pos dari sini?",
        vi: "Tôi đến năm ngoái, vì có việc làm ở đây. Làm sao để đi tới bưu điện từ đây?",
        en: "I came last year, because there's a job here. How do I get to the post office from here?",
      },
      {
        speaker: "Budi",
        text: "Naik bus nomor lima. Oh ya, ini ada dua peta — kamu mau yang mana?",
        vi: "Đi xe buýt số năm. À, đây có hai tấm bản đồ — bạn muốn cái nào?",
        en: "Take bus number five. Oh, I have two maps here — which one do you want?",
      },
      // Dialogue B: shopping, the berapa / yang mana cluster
      {
        speaker: "Linh",
        text: "Permisi, tas ini berapa harganya? Dan yang merah yang mana?",
        vi: "Xin lỗi, cái túi này giá bao nhiêu? Và cái màu đỏ là cái nào?",
        en: "Excuse me, how much is this bag? And which one is the red one?",
      },
      {
        speaker: "Penjual",
        text: "Yang ini dua ratus ribu. Yang merah ada di sebelah kiri. Mau berapa, Mbak?",
        vi: "Cái này hai trăm nghìn. Cái đỏ ở bên trái. Chị lấy mấy cái?",
        en: "This one is two hundred thousand. The red one is on the left. How many would you like, miss?",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia (chú ý KHÔNG đảo ngữ):",
        instruction_en: "Translate into Indonesian (note: NO inversion):",
        items: [
          { prompt: "Bạn tên gì?", answer: "Siapa nama kamu?" },
          { prompt: "Bạn sống ở đâu?", answer: "Kamu tinggal di mana?" },
          { prompt: "Khi nào bạn đến?", answer: "Kapan kamu datang?" },
          { prompt: "Tại sao bạn đến muộn?", answer: "Kenapa kamu terlambat?" },
          { prompt: "Cái này giá bao nhiêu?", answer: "Ini berapa harganya?" },
          { prompt: "Bạn muốn cái nào?", answer: "Kamu mau yang mana?" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Câu hỏi có TÂN NGỮ — nhớ thêm `yang`:",
        instruction_en: "Object questions — remember to add `yang`:",
        items: [
          { prompt: "Bạn đang tìm cái gì?", answer: "Apa yang kamu cari?" },
          { prompt: "Ai đến vậy?", answer: "Siapa yang datang?" },
          { prompt: "Bạn thích cái nào?", answer: "Yang mana yang kamu suka?" },
          { prompt: "Bạn mua cái gì?", answer: "Apa yang kamu beli?" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn từ hỏi đúng (`apa`, `siapa`, `di mana`, `ke mana`, `kapan`, `berapa`, `bagaimana`, `yang mana`):",
        instruction_en:
          "Choose the right WH-word (`apa`, `siapa`, `di mana`, `ke mana`, `kapan`, `berapa`, `bagaimana`, `yang mana`):",
        items: [
          { prompt: "___ nama kamu? — Nama saya Linh.", answer: "Siapa", hint: "hỏi TÊN = siapa, không apa" },
          { prompt: "Kamu mau pergi ___? — Ke pasar.", answer: "ke mana", hint: "hướng ĐẾN → ke + mana" },
          { prompt: "Buku itu ___? — Lima puluh ribu.", answer: "berapa", hint: "hỏi giá/số → berapa" },
          { prompt: "___ kamu datang? — Besok pagi.", answer: "Kapan", hint: "hỏi ngày/dịp → kapan" },
          { prompt: "___ kabarmu? — Baik, terima kasih.", answer: "Bagaimana", hint: "hỏi tình hình → bagaimana" },
          { prompt: "Dari dua baju ini, kamu suka ___? — Yang biru.", answer: "yang mana", hint: "chọn trong nhóm → yang mana" },
        ],
      },
      {
        type: "error_correction",
        instruction_vi: "Sửa lỗi (mỗi câu sai một chỗ về từ hỏi):",
        instruction_en: "Fix the error (each sentence has one WH-word mistake):",
        items: [
          { prompt: "Apa nama kamu?", answer: "Siapa nama kamu?", explanation_vi: "Hỏi tên người dùng `siapa`, không `apa`." },
          { prompt: "Kamu tinggal ke mana?", answer: "Kamu tinggal di mana?", explanation_vi: "Vị trí (sống ở đâu) dùng `di mana`, không `ke mana`." },
          { prompt: "Kapan jam sekarang?", answer: "Jam berapa sekarang?", explanation_vi: "Giờ cụ thể hỏi `jam berapa`, không `kapan`." },
          { prompt: "Apa yang kamu suka, kucing ini atau itu?", answer: "Yang mana yang kamu suka, kucing ini atau itu?", explanation_vi: "Chọn giữa các vật dùng `yang mana`, không `apa`." },
        ],
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra từ để hỏi — bạn làm được chưa?",
        instruction_en: "Question-word self-check — can you do each one?",
        items: [
          { vi: "Tôi đặt câu hỏi không đảo ngữ, giữ trật tự câu kể như tiếng Việt.", en: "I form questions without inversion, keeping statement order like Vietnamese." },
          { vi: "Tôi hỏi TÊN bằng `siapa`, không `apa`.", en: "I ask a NAME with `siapa`, not `apa`." },
          { vi: "Tôi đổi đúng giới từ cho `mana`: `di`/`ke`/`dari`.", en: "I use the right preposition with `mana`: `di`/`ke`/`dari`." },
          { vi: "Tôi thêm `yang` khi từ hỏi là tân ngữ (`Apa yang…`, `Siapa yang…`).", en: "I add `yang` when the WH-word is an object (`Apa yang…`, `Siapa yang…`)." },
          { vi: "Tôi dùng `jam berapa` cho giờ và `kapan` cho ngày/dịp.", en: "I use `jam berapa` for clock time and `kapan` for the day/occasion." },
          { vi: "Tôi biết `mengapa`=`kenapa` và `bagaimana`=`gimana` (trang trọng vs đời thường).", en: "I know `mengapa`=`kenapa` and `bagaimana`=`gimana` (formal vs casual)." },
          { vi: "Tôi thêm `apakah` cho câu hỏi có/không trang trọng.", en: "I add `apakah` for a formal yes/no question." },
        ],
      },
    ],
  },
];

export default lessons;
