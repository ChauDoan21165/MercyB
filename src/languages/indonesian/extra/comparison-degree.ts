// src/languages/indonesian/extra/comparison-degree.ts
//
// Comparison & Degree pack for Vietnamese learners of Indonesian.
// How Indonesian expresses more/less/most/equal and gradual change:
//   - lebih ... daripada (more ... than)
//   - paling / ter- (the most / superlative)
//   - kurang (less / not enough)
//   - sama ... dengan / se- (the same as / equal)
//   - makin / semakin ... makin (the more ... the more)
//
// Vietnamese-first: this is a GRAMMAR pack, so each `pronunciation_focus` entry
// leans toward structure and the predictable Vietnamese-speaker mistake (L1
// note); `pronunciation_focus_en` is the English-speaker companion (same order).
// The `en` field on each sentence holds the Indonesian target line.
//
// Vietnamese comparison ("hơn", "nhất", "bằng", "càng...càng") maps almost
// one-to-one onto Indonesian, which makes this one of the easier grammar areas
// — the notes flag exactly where the two diverge (e.g. daripada vs dari).
//
// Self-contained inline types (mirrors the sibling extra packs); swap for a
// shared import when src/languages/indonesian/lessons.ts lands.

export type LessonSentence = {
  en: string; // Indonesian target line
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type VocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type DialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

export type Exercise = Record<string, unknown>;

export type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
  content?: string;
};

export const lessons: IndonesianLesson[] = [
  // ──────────────────────────────────────────────────────────────────────
  // 1. lebih ... daripada — comparative "more ... than"
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_comp_lebih_daripada",
    level: "A2",
    category: "grammar",
    title_vi: "lebih ... daripada — so sánh hơn (hơn)",
    title_en: "lebih ... daripada — the comparative (more ... than)",
    sentences: [
      {
        en: "Jakarta lebih besar daripada Bandung.",
        vi: "Jakarta lớn hơn Bandung.",
        pronunciation_focus: [
          "CẤU TRÚC: lebih + [tính từ] + daripada + [đối tượng]",
          "lebih → LE-bih = hơn (đặt TRƯỚC tính từ, khác tiếng Việt đặt sau)",
          "daripada → da-ri-PA-da = hơn so với (giới thiệu đối tượng so sánh)",
          "LỖI người Việt: nói 'besar lebih' — sai; phải là 'lebih besar'",
        ],
        pronunciation_focus_en: [
          "PATTERN: lebih + [adjective] + daripada + [thing compared]",
          "lebih → 'LUH-bee' = more (goes BEFORE the adjective)",
          "daripada → 'dah-ree-PAH-dah' = than",
          "Vietnamese error: 'besar lebih' is wrong; it must be 'lebih besar'",
        ],
      },
      {
        en: "Naik kereta lebih cepat daripada naik bus.",
        vi: "Đi tàu nhanh hơn đi xe buýt.",
        pronunciation_focus: [
          "lebih cepat → LE-bih CE-pat = nhanh hơn; 'c' = 'ch' → 'che-pat'",
          "daripada → giới thiệu vế thứ hai",
          "naik → NA-ik = đi bằng (phương tiện)",
          "có thể rút gọn 'daripada' → 'dari' trong văn nói (nhưng 'daripada' chuẩn hơn)",
        ],
        pronunciation_focus_en: [
          "lebih cepat → 'LUH-bee CHEH-pat' = faster; 'c' = 'ch'",
          "daripada → introduces the second item",
          "naik → 'NAH-ik' = to go by (transport)",
          "'daripada' can shorten to 'dari' colloquially, but 'daripada' is more correct",
        ],
      },
      {
        en: "Hari ini lebih panas daripada kemarin.",
        vi: "Hôm nay nóng hơn hôm qua.",
        pronunciation_focus: [
          "lebih panas → nóng hơn",
          "kemarin → ke-MA-rin = hôm qua",
          "so sánh hai mốc thời gian: hari ini vs kemarin",
          "tính từ KHÔNG biến đổi khi so sánh (khác tiếng Anh thêm -er)",
        ],
        pronunciation_focus_en: [
          "lebih panas → hotter",
          "kemarin → 'kuh-MAH-rin' = yesterday",
          "comparing two time points: today vs yesterday",
          "the adjective does NOT change form (unlike English '-er')",
        ],
      },
    ],
    cultural_notes_vi:
      "So sánh hơn trong tiếng Indonesia rất giống tiếng Việt về Ý NGHĨA nhưng khác về TRẬT TỰ TỪ. Tiếng Việt: 'lớn HƠN' (hơn đặt SAU tính từ). Tiếng Indonesia: 'LEBIH besar' (lebih đặt TRƯỚC tính từ) — đây là lỗi số một của người Việt. Công thức: [A] + lebih + [tính từ] + daripada + [B]. Tin vui: tính từ KHÔNG biến đổi (không như tiếng Anh thêm -er/more) — chỉ cần gắn 'lebih' vào trước. 'Daripada' (hơn so với) có thể rút gọn thành 'dari' trong văn nói đời thường, nhưng trong văn viết và thi cử nên dùng đầy đủ 'daripada'. Để nói 'kém hơn', dùng 'kurang' (kurang besar = kém to hơn) hoặc đảo vế.",
    cultural_notes_en:
      "Indonesian comparatives match Vietnamese in MEANING but differ in WORD ORDER. Vietnamese puts 'hơn' (more) AFTER the adjective ('lớn hơn'); Indonesian puts 'lebih' BEFORE it ('lebih besar') — the top Vietnamese error. Formula: [A] + lebih + [adjective] + daripada + [B]. Good news: the adjective does NOT inflect (no English '-er/more') — just prepend 'lebih'. 'Daripada' (than) can shorten to 'dari' in casual speech, but use the full 'daripada' in writing and exams. For 'less', use 'kurang' (kurang besar) or flip the two items.",
    tip_advice_vi:
      "Khẩu quyết: 'lebih' đứng TRƯỚC tính từ (lebih besar = to hơn), ngược với tiếng Việt. Công thức đầy đủ: A lebih [tính từ] daripada B. 'c' = 'ch' lại xuất hiện: cepat. Tránh lỗi 'besar lebih'. Trong thi cử dùng 'daripada', đời thường có thể 'dari'.",
    tip_advice_en:
      "Mantra: 'lebih' goes BEFORE the adjective (lebih besar = bigger), opposite to Vietnamese order. Full formula: A lebih [adjective] daripada B. 'c' = 'ch' again: cepat. Avoid 'besar lebih'. Use 'daripada' in exams, 'dari' in casual speech.",
    vocabulary: [
      { cell_id: "55dcf07e-64d2-401e-8019-8cd522615484", word: "lebih", en: "more", vi: "hơn", pos: "adverb", pronunciation_vi: "LE-bih", pronunciation_en: "LUH-bee" },
      { cell_id: "52ca408b-1c90-44e8-9563-53c664cfa72b", word: "daripada", en: "than", vi: "hơn so với", pos: "conjunction", pronunciation_vi: "da-ri-PA-da", pronunciation_en: "dah-ree-PAH-dah" },
      { cell_id: "8093f582-8f02-4b5d-a410-c7d8025541bd", word: "besar", en: "big", vi: "to, lớn", pos: "adjective", pronunciation_vi: "be-SAR", pronunciation_en: "buh-SAR" },
      { cell_id: "29571533-3f39-41e1-9369-449983de37d4", word: "cepat", en: "fast", vi: "nhanh", pos: "adjective", pronunciation_vi: "ce-PAT", pronunciation_en: "cheh-PAT" },
      { cell_id: "0687e83b-32fd-4c9a-b2c2-74cac020b518", word: "kecil", en: "small", vi: "nhỏ", pos: "adjective", pronunciation_vi: "ke-CIL", pronunciation_en: "kuh-CHEEL" },
      { cell_id: "e5f126ad-00b5-41b4-aa6c-e2fc60dbbf8b", word: "mahal", en: "expensive", vi: "đắt", pos: "adjective", pronunciation_vi: "MA-hal", pronunciation_en: "MAH-hal" },
    ],
    dialogue: [
      { cell_id: "63e72e86-ee11-488d-a390-786f43baa6a1", speaker: "Budi", text: "Menurutmu, mana yang lebih enak, bakso atau sate?", vi: "Theo cậu, món nào ngon hơn, bakso hay sate?", en: "Which do you think is tastier, bakso or sate?" },
      { cell_id: "efc3f1f5-3bf3-4c30-98a1-3335cee90c84", speaker: "Wati", text: "Bagiku sate lebih enak daripada bakso.", vi: "Với tớ sate ngon hơn bakso.", en: "For me sate is tastier than bakso." },
      { cell_id: "93727146-36aa-47e4-9687-11037da50d76", speaker: "Budi", text: "Tapi bakso lebih murah, kan?", vi: "Nhưng bakso rẻ hơn mà, đúng không?", en: "But bakso is cheaper, right?" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Sắp xếp đúng trật tự so sánh:",
        instruction_en: "Put the comparison in the right order:",
        items: [
          { prompt: "Jakarta ___ besar daripada Bandung. (hơn)", answer: "lebih", options: ["lebih", "paling", "kurang"] },
          { prompt: "Kereta lebih cepat ___ bus. (so với)", answer: "daripada", options: ["daripada", "dengan", "untuk"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Hôm nay nóng hơn hôm qua.", answer: "Hari ini lebih panas daripada kemarin." },
          { prompt: "Cái này đắt hơn cái kia.", answer: "Ini lebih mahal daripada itu." },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 2. paling / ter- — the superlative "the most"
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_comp_paling_ter",
    level: "B1",
    category: "grammar",
    title_vi: "paling / ter- — so sánh nhất (nhất)",
    title_en: "paling / ter- — the superlative (the most)",
    sentences: [
      {
        en: "Gunung Everest adalah gunung yang paling tinggi di dunia.",
        vi: "Núi Everest là ngọn núi cao nhất thế giới.",
        pronunciation_focus: [
          "paling → PA-ling = nhất (đặt TRƯỚC tính từ); 'ng' cuối",
          "paling tinggi → cao nhất",
          "yang → YANG = cái mà (nối tính từ với danh từ)",
          "CẤU TRÚC: paling + [tính từ] = nhất",
        ],
        pronunciation_focus_en: [
          "paling → 'PAH-ling' = most (goes BEFORE the adjective); final 'ng'",
          "paling tinggi → tallest",
          "yang → 'YANG' = which/that (links adjective to noun)",
          "PATTERN: paling + [adjective] = the most",
        ],
      },
      {
        en: "Dia siswa terpandai di kelas kami.",
        vi: "Cậu ấy là học sinh giỏi nhất lớp chúng tôi.",
        pronunciation_focus: [
          "terpandai → ter-pan-DAI = giỏi nhất (ter- + pandai)",
          "ter- là tiền tố so sánh nhất, tương đương 'paling'",
          "terpandai = paling pandai (hai cách nói cùng nghĩa)",
          "ter- thường gắn với tính từ ngắn, trang trọng hơn",
        ],
        pronunciation_focus_en: [
          "terpandai → 'ter-pan-DAI' = smartest (ter- + pandai)",
          "ter- is the superlative prefix, equal to 'paling'",
          "terpandai = paling pandai (two ways to say the same thing)",
          "ter- pairs with short adjectives, slightly more formal",
        ],
      },
      {
        en: "Ini restoran terbaik dan termurah di kota.",
        vi: "Đây là nhà hàng tốt nhất và rẻ nhất thành phố.",
        pronunciation_focus: [
          "terbaik → ter-BA-ik = tốt nhất (ter- + baik)",
          "termurah → ter-MU-rah = rẻ nhất (ter- + murah)",
          "ter- gắn liền, không cách: terbaik, termurah, terbesar",
          "không nói 'paling baik' khi đã có dạng 'terbaik' quen dùng",
        ],
        pronunciation_focus_en: [
          "terbaik → 'ter-BAH-ik' = best (ter- + baik)",
          "termurah → 'ter-MOO-rah' = cheapest (ter- + murah)",
          "ter- attaches directly, no space: terbaik, termurah, terbesar",
          "prefer 'terbaik' over 'paling baik' where the ter- form is idiomatic",
        ],
      },
    ],
    cultural_notes_vi:
      "Tiếng Indonesia có HAI cách nói so sánh nhất, đều đặt TRƯỚC tính từ (giống 'lebih', ngược tiếng Việt đặt 'nhất' sau): (1) 'paling' + tính từ (paling tinggi = cao nhất) — dùng được với mọi tính từ, đời thường; (2) tiền tố 'ter-' gắn liền (tertinggi = cao nhất) — trang trọng hơn, hay dùng với tính từ ngắn. Cả hai cùng nghĩa: 'paling baik' = 'terbaik'. Một số dạng 'ter-' đã thành từ quen thuộc (terbaik, terbesar, termurah, terakhir) nên ưu tiên dùng. Tiếng Việt nói 'cao NHẤT' (nhất đặt sau); người Việt hay nhầm đặt 'paling' sau — nhớ đặt TRƯỚC. Lưu ý 'ter-' còn có nghĩa khác (bị động/ngẫu nhiên: tertidur = ngủ quên) — ngữ cảnh phân biệt.",
    cultural_notes_en:
      "Indonesian has TWO superlatives, both placed BEFORE the adjective (like 'lebih', opposite to Vietnamese 'nhất' after): (1) 'paling' + adjective (paling tinggi = tallest) — works with any adjective, casual; (2) the prefix 'ter-' attached (tertinggi = tallest) — more formal, common with short adjectives. Both mean the same: 'paling baik' = 'terbaik'. Several 'ter-' forms are idiomatic (terbaik, terbesar, termurah, terakhir) — prefer them. Vietnamese puts 'nhất' AFTER; learners often misplace 'paling' after — remember it goes BEFORE. Note 'ter-' also has another sense (passive/accidental: tertidur = fell asleep) — context disambiguates.",
    tip_advice_vi:
      "Hai cách: 'paling' + tính từ (đời thường) HOẶC 'ter-' + tính từ (trang trọng). Cả hai đặt TRƯỚC tính từ. Dạng quen: terbaik, terbesar, termurah, terakhir, tertinggi. 'yang paling' nhấn mạnh hơn (cái nhất). Đừng đặt 'paling' sau tính từ.",
    tip_advice_en:
      "Two options: 'paling' + adjective (casual) OR 'ter-' + adjective (formal). Both go BEFORE the adjective. Idiomatic forms: terbaik, terbesar, termurah, terakhir, tertinggi. 'yang paling' adds emphasis. Never put 'paling' after the adjective.",
    vocabulary: [
      { cell_id: "09bbb6e0-9444-4eff-ba14-22d58fb47167", word: "paling", en: "most (superlative)", vi: "nhất", pos: "adverb", pronunciation_vi: "PA-ling", pronunciation_en: "PAH-ling" },
      { cell_id: "b43c05d3-f383-4e7b-a06c-a6acf8069b9c", word: "terbaik", en: "best", vi: "tốt nhất", pos: "adjective", pronunciation_vi: "ter-BA-ik", pronunciation_en: "ter-BAH-ik" },
      { cell_id: "3fdd6736-3947-404e-acf5-9435006a7b92", word: "tertinggi", en: "tallest, highest", vi: "cao nhất", pos: "adjective", pronunciation_vi: "ter-TING-gi", pronunciation_en: "ter-TING-gee" },
      { cell_id: "4b053d10-44e9-4c82-996e-e2299240d7ae", word: "termurah", en: "cheapest", vi: "rẻ nhất", pos: "adjective", pronunciation_vi: "ter-MU-rah", pronunciation_en: "ter-MOO-rah" },
      { cell_id: "59964d42-b1cc-4a47-b136-efde3fa99c41", word: "terbesar", en: "biggest", vi: "to nhất", pos: "adjective", pronunciation_vi: "ter-be-SAR", pronunciation_en: "ter-buh-SAR" },
      { cell_id: "09f52aaf-5fa8-4ff8-a6e4-c469f9e91d64", word: "pandai", en: "smart, clever", vi: "giỏi, thông minh", pos: "adjective", pronunciation_vi: "pan-DAI", pronunciation_en: "pan-DAI" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối dạng 'ter-' với dạng 'paling':",
        instruction_en: "Match the 'ter-' form to its 'paling' form:",
        items: [
          { prompt: "terbaik", answer: "paling baik" },
          { prompt: "termurah", answer: "paling murah" },
          { prompt: "tertinggi", answer: "paling tinggi" },
          { prompt: "terbesar", answer: "paling besar" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền dạng so sánh nhất:",
        instruction_en: "Fill the superlative form:",
        items: [
          { prompt: "Everest gunung ___ tinggi di dunia. (nhất)", answer: "paling", options: ["paling", "lebih", "kurang"] },
          { prompt: "Ini restoran ___ di kota. (tốt nhất)", answer: "terbaik", options: ["terbaik", "lebih baik", "baik"] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 3. kurang — "less / not enough"
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_comp_kurang",
    level: "B1",
    category: "grammar",
    title_vi: "kurang — kém hơn / chưa đủ",
    title_en: "kurang — less / not enough",
    sentences: [
      {
        en: "Kopi ini kurang manis, tolong tambah gula.",
        vi: "Cà phê này chưa đủ ngọt, làm ơn thêm đường.",
        pronunciation_focus: [
          "kurang → KU-rang = kém, thiếu, chưa đủ; 'ng' cuối",
          "kurang manis → chưa đủ ngọt (kém ngọt)",
          "kurang + tính từ = thiếu/chưa đủ phẩm chất đó",
          "tolong → TO-long = làm ơn",
        ],
        pronunciation_focus_en: [
          "kurang → 'KOO-rang' = less/lacking/not enough; final 'ng'",
          "kurang manis → not sweet enough",
          "kurang + adjective = lacking that quality",
          "tolong → 'TOH-long' = please",
        ],
      },
      {
        en: "Dia kurang rajin daripada adiknya.",
        vi: "Cậu ấy kém chăm chỉ hơn em mình.",
        pronunciation_focus: [
          "kurang rajin → kém chăm hơn (đối lập với 'lebih rajin')",
          "kurang ... daripada = kém ... hơn so với",
          "rajin → RA-jin = chăm chỉ",
          "adiknya → a-DIK-nya = em của cậu ấy (adik + -nya)",
        ],
        pronunciation_focus_en: [
          "kurang rajin → less diligent (opposite of 'lebih rajin')",
          "kurang ... daripada = less ... than",
          "rajin → 'RAH-jin' = diligent",
          "adiknya → 'ah-DIK-nyah' = his/her younger sibling (adik + -nya)",
        ],
      },
      {
        en: "Uang saya kurang, jadi tidak bisa beli yang mahal.",
        vi: "Tiền của tôi không đủ, nên không mua được cái đắt.",
        pronunciation_focus: [
          "kurang (đứng một mình) = thiếu, không đủ",
          "uang → U-ang = tiền (hai âm: u-ang)",
          "jadi → JA-di = nên, vì vậy",
          "tidak bisa → không thể",
        ],
        pronunciation_focus_en: [
          "kurang (standalone) = lacking, not enough",
          "uang → 'OO-ang' = money (two syllables)",
          "jadi → 'JAH-dee' = so/therefore",
          "tidak bisa → cannot",
        ],
      },
    ],
    cultural_notes_vi:
      "'Kurang' là từ đa năng, đối lập với 'lebih'. Ba cách dùng chính: (1) kurang + tính từ = chưa đủ/kém phẩm chất đó (kurang manis = chưa đủ ngọt, kurang besar = hơi nhỏ); (2) kurang + tính từ + daripada = kém ... hơn (so sánh hơn theo chiều giảm); (3) kurang đứng một mình = thiếu, không đủ (uangnya kurang = tiền thiếu). Trong văn hóa Indonesia, dùng 'kurang' để chê nhẹ nhàng, lịch sự — thay vì nói thẳng 'không ngon' (tidak enak), người ta nói 'kurang enak' (chưa được ngon lắm) cho đỡ phũ. Đây là cách giữ thể diện ('menjaga muka'). Người Việt cũng có thói quen nói giảm tương tự ('hơi nhạt' thay vì 'dở'). 'Kurang lebih' (ít nhiều, khoảng chừng) là cụm cố định nghĩa 'xấp xỉ'.",
    cultural_notes_en:
      "'Kurang' is a versatile word, the opposite of 'lebih'. Three main uses: (1) kurang + adjective = not enough of that quality (kurang manis = not sweet enough, kurang besar = a bit small); (2) kurang + adjective + daripada = less ... than (downward comparison); (3) standalone kurang = lacking, insufficient (uangnya kurang = the money is short). Culturally, 'kurang' softens criticism politely — instead of 'tidak enak' (not tasty), people say 'kurang enak' (not quite tasty) to be less blunt. This preserves face ('menjaga muka'). Vietnamese has the same softening habit ('hơi nhạt' instead of 'dở'). 'Kurang lebih' (more or less) is a fixed phrase meaning 'approximately'.",
    tip_advice_vi:
      "'kurang' = đối lập 'lebih'. kurang + tính từ = chưa đủ (kurang manis). Mẹo lịch sự: chê nhẹ bằng 'kurang enak' (chưa ngon lắm) thay vì 'tidak enak' (không ngon). Cụm cố định: 'kurang lebih' = khoảng chừng, xấp xỉ. 'ng' cuối trong 'kurang' đọc rõ.",
    tip_advice_en:
      "'kurang' = the opposite of 'lebih'. kurang + adjective = not enough (kurang manis). Politeness tip: soften criticism with 'kurang enak' (not quite tasty) rather than blunt 'tidak enak'. Fixed phrase: 'kurang lebih' = approximately. Pronounce the final 'ng' in 'kurang' clearly.",
    vocabulary: [
      { cell_id: "420f12da-2c92-4087-a554-ca8f06207537", word: "kurang", en: "less, not enough, lacking", vi: "kém, thiếu, chưa đủ", pos: "adverb", pronunciation_vi: "KU-rang", pronunciation_en: "KOO-rang" },
      { cell_id: "d487ab93-d6bb-4124-a42e-00a5d9f72047", word: "manis", en: "sweet", vi: "ngọt", pos: "adjective", pronunciation_vi: "MA-nis", pronunciation_en: "MAH-nis" },
      { cell_id: "e1b7ae33-e76a-42cc-81d5-eec2b6b22e11", word: "rajin", en: "diligent, hardworking", vi: "chăm chỉ", pos: "adjective", pronunciation_vi: "RA-jin", pronunciation_en: "RAH-jin" },
      { cell_id: "39cc3a71-4752-4b38-9016-e3540cb6de36", word: "kurang lebih", en: "approximately, more or less", vi: "khoảng chừng, xấp xỉ", pos: "phrase", pronunciation_vi: "KU-rang LE-bih", pronunciation_en: "KOO-rang LUH-bee" },
      { cell_id: "aa803bac-ed98-4245-8ddc-75d9511a5eef", word: "cukup", en: "enough, sufficient", vi: "đủ", pos: "adjective", pronunciation_vi: "CU-kup", pronunciation_en: "CHOO-koop" },
      { cell_id: "e7d3f0b9-58c5-4d01-9a61-f613ec93d4d0", word: "tambah", en: "to add", vi: "thêm", pos: "verb", pronunciation_vi: "TAM-bah", pronunciation_en: "TAM-bah" },
    ],
    dialogue: [
      { cell_id: "d55e47d3-69d9-4914-8ce4-ccd72498be32", speaker: "Pembeli", text: "Maaf, tehnya kurang manis. Bisa tambah gula?", vi: "Xin lỗi, trà chưa đủ ngọt. Thêm đường được không?", en: "Sorry, the tea isn't sweet enough. Can you add sugar?" },
      { cell_id: "42720353-b024-4d43-9265-7e5b3e4adcd6", speaker: "Penjual", text: "Tentu. Kurang manis berapa sendok lagi?", vi: "Tất nhiên. Thiếu ngọt thì thêm mấy thìa nữa?", en: "Sure. How many more spoons should I add?" },
      { cell_id: "b2769a4b-2959-48c0-a89b-3472cb1a2f72", speaker: "Pembeli", text: "Satu sendok cukup. Terima kasih.", vi: "Một thìa là đủ. Cảm ơn.", en: "One spoon is enough. Thanks." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền 'kurang', 'lebih' hoặc 'cukup':",
        instruction_en: "Fill in 'kurang', 'lebih', or 'cukup':",
        items: [
          { prompt: "Kopi ini ___ manis, tambah gula ya. (chưa đủ)", answer: "kurang", options: ["kurang", "lebih", "cukup"] },
          { prompt: "Uangku ___, jadi bisa beli dua. (đủ)", answer: "cukup", options: ["cukup", "kurang", "paling"] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 4. sama ... dengan / se- — equality "the same as"
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_comp_sama_se",
    level: "B1",
    category: "grammar",
    title_vi: "sama ... dengan / se- — so sánh bằng (bằng / như)",
    title_en: "sama ... dengan / se- — equality (the same as)",
    sentences: [
      {
        en: "Tinggi badanku sama dengan tinggi badanmu.",
        vi: "Chiều cao của tôi bằng chiều cao của bạn.",
        pronunciation_focus: [
          "CẤU TRÚC: sama + dengan = giống với, bằng với",
          "sama → SA-ma = giống, bằng",
          "dengan → de-NGAN = với; 'ng' giữa từ",
          "LỖI: quên 'dengan'; phải đủ 'sama dengan' (giống với)",
        ],
        pronunciation_focus_en: [
          "PATTERN: sama + dengan = the same as / equal to",
          "sama → 'SAH-mah' = same/equal",
          "dengan → 'duh-NGAN' = with; medial 'ng'",
          "error: dropping 'dengan'; you need full 'sama dengan'",
        ],
      },
      {
        en: "Anak itu setinggi ayahnya sekarang.",
        vi: "Đứa trẻ đó cao bằng bố nó bây giờ.",
        pronunciation_focus: [
          "setinggi → se-TING-gi = cao bằng (se- + tinggi)",
          "tiền tố 'se-' + tính từ = bằng nhau về phẩm chất đó",
          "setinggi = sama tinggi dengan (hai cách cùng nghĩa)",
          "ayahnya → A-yah-nya = bố của nó; 'ny' = 'nh'",
        ],
        pronunciation_focus_en: [
          "setinggi → 'suh-TING-gee' = as tall as (se- + tinggi)",
          "the prefix 'se-' + adjective = equal in that quality",
          "setinggi = sama tinggi dengan (two ways, same meaning)",
          "ayahnya → 'AH-yah-nyah' = his/her father; 'ny' = ñ",
        ],
      },
      {
        en: "Harga di sini secepat-cepatnya sama saja dengan di pasar.",
        vi: "Giá ở đây dù sao cũng bằng với ở chợ thôi.",
        pronunciation_focus: [
          "sama saja → SA-ma SA-ja = cũng vậy thôi, như nhau cả",
          "'se- ... -nya' = mức tối đa của phẩm chất (secepat-cepatnya = nhanh nhất có thể)",
          "harga → HAR-ga = giá; 'g' cứng",
          "pasar → PA-sar = chợ",
        ],
        pronunciation_focus_en: [
          "sama saja → 'SAH-mah SAH-jah' = all the same, makes no difference",
          "'se- ... -nya' = the utmost of a quality (secepat-cepatnya = as fast as possible)",
          "harga → 'HAR-gah' = price; hard 'g'",
          "pasar → 'PAH-sar' = market",
        ],
      },
    ],
    cultural_notes_vi:
      "So sánh bằng (ngang nhau) có hai cách: (1) 'sama + [tính từ] + dengan' = giống/bằng với (Tinggiku sama dengan tinggimu = chiều cao tôi bằng bạn); (2) tiền tố 'se-' + tính từ = bằng nhau về phẩm chất (setinggi = cao bằng, secepat = nhanh bằng, sebesar = to bằng). Hai cách tương đương: 'setinggi ayahnya' = 'sama tinggi dengan ayahnya'. Tiền tố 'se-' rất đa năng trong tiếng Indonesia (còn nghĩa 'một' và 'cả/toàn bộ') — ở đây nó nghĩa 'bằng, ngang'. Người Việt nói 'cao BẰNG' / 'cao NHƯ' — khái niệm giống hệt, chỉ khác 'se-' gắn liền vào tính từ. Cụm 'sama saja' (như nhau cả, cũng vậy thôi) rất hữu ích khi muốn nói 'không khác gì'.",
    cultural_notes_en:
      "Equality comparison has two forms: (1) 'sama + [adjective] + dengan' = the same/equal as (Tinggiku sama dengan tinggimu = my height equals yours); (2) the prefix 'se-' + adjective = equal in that quality (setinggi = as tall as, secepat = as fast as, sebesar = as big as). The two are equivalent: 'setinggi ayahnya' = 'sama tinggi dengan ayahnya'. The 'se-' prefix is very versatile in Indonesian (also meaning 'one' and 'whole/all') — here it means 'as ... as'. Vietnamese says 'cao bằng' / 'cao như' — the same idea, except 'se-' attaches to the adjective. The phrase 'sama saja' (all the same) is handy for 'makes no difference'.",
    tip_advice_vi:
      "Hai cách bằng: 'sama [tính từ] dengan' HOẶC 'se-' + tính từ (setinggi, secepat, sebesar). Đừng quên 'dengan' trong cách 1. Cụm tiện: 'sama saja' (như nhau cả). 'se-' gắn liền, không cách. Lưu ý 'se-' có nhiều nghĩa — ở đây là 'bằng/ngang'.",
    tip_advice_en:
      "Two equality forms: 'sama [adjective] dengan' OR 'se-' + adjective (setinggi, secepat, sebesar). Don't drop 'dengan' in form 1. Handy phrase: 'sama saja' (all the same). 'se-' attaches directly, no space. Note 'se-' has several meanings — here it's 'as ... as'.",
    vocabulary: [
      { cell_id: "520407ab-ad80-4896-a935-2ca373960786", word: "sama", en: "same, equal", vi: "giống, bằng", pos: "adjective", pronunciation_vi: "SA-ma", pronunciation_en: "SAH-mah" },
      { cell_id: "16a1b532-3685-4371-a531-16cc3863064d", word: "dengan", en: "with", vi: "với", pos: "preposition", pronunciation_vi: "de-NGAN", pronunciation_en: "duh-NGAN" },
      { cell_id: "c865807e-ddb8-46a2-ba43-33432bb10529", word: "setinggi", en: "as tall as", vi: "cao bằng", pos: "adjective", pronunciation_vi: "se-TING-gi", pronunciation_en: "suh-TING-gee" },
      { cell_id: "f04302f1-ad31-4afc-9ad8-4b072d5e08c9", word: "sebesar", en: "as big as", vi: "to bằng", pos: "adjective", pronunciation_vi: "se-be-SAR", pronunciation_en: "suh-buh-SAR" },
      { cell_id: "fb1eaacc-4684-409f-ac73-7f8df9d642cf", word: "sama saja", en: "all the same, no difference", vi: "như nhau cả", pos: "phrase", pronunciation_vi: "SA-ma SA-ja", pronunciation_en: "SAH-mah SAH-jah" },
      { cell_id: "ef80cd32-de9a-4b10-a287-e3bdbfe9657f", word: "mirip", en: "similar, alike", vi: "giống, na ná", pos: "adjective", pronunciation_vi: "MI-rip", pronunciation_en: "MEE-rip" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia (dùng se- hoặc sama dengan):",
        instruction_en: "Translate (use se- or sama dengan):",
        items: [
          { prompt: "Đứa trẻ cao bằng bố nó.", answer: "Anak itu setinggi ayahnya." },
          { prompt: "Chiều cao tôi bằng chiều cao bạn.", answer: "Tinggiku sama dengan tinggimu." },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 5. makin / semakin — gradual change "the more ... the more"
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_comp_makin_semakin",
    level: "B2",
    category: "grammar",
    title_vi: "makin / semakin — càng ... càng",
    title_en: "makin / semakin — the more ... the more",
    sentences: [
      {
        en: "Cuaca semakin panas setiap tahun.",
        vi: "Thời tiết ngày càng nóng theo từng năm.",
        pronunciation_focus: [
          "semakin → se-MA-kin = ngày càng (đặt TRƯỚC tính từ)",
          "semakin panas → ngày càng nóng",
          "'semakin' = dạng đầy đủ; 'makin' = dạng rút gọn (cùng nghĩa)",
          "diễn tả thay đổi tăng dần theo thời gian",
        ],
        pronunciation_focus_en: [
          "semakin → 'suh-MAH-kin' = increasingly (goes BEFORE the adjective)",
          "semakin panas → hotter and hotter",
          "'semakin' = full form; 'makin' = short form (same meaning)",
          "expresses a gradual increase over time",
        ],
      },
      {
        en: "Makin lama makin mahal harga rumah di kota.",
        vi: "Càng lâu càng đắt, giá nhà ở thành phố.",
        pronunciation_focus: [
          "CẤU TRÚC: makin + [A] makin + [B] = càng A càng B",
          "makin lama makin mahal → càng lâu càng đắt",
          "đây là tương ứng HOÀN HẢO với 'càng ... càng' tiếng Việt",
          "lama → LA-ma = lâu; mahal → MA-hal = đắt",
        ],
        pronunciation_focus_en: [
          "PATTERN: makin + [A] makin + [B] = the more A, the more B",
          "makin lama makin mahal → the longer it goes, the more expensive",
          "this maps PERFECTLY onto Vietnamese 'càng ... càng'",
          "lama → 'LAH-mah' = long (time); mahal → 'MAH-hal' = expensive",
        ],
      },
      {
        en: "Semakin banyak belajar, semakin pintar kita.",
        vi: "Càng học nhiều, chúng ta càng thông minh.",
        pronunciation_focus: [
          "semakin ... semakin ... = càng ... càng ... (dạng trang trọng)",
          "banyak → BA-nyak = nhiều; 'ny' = 'nh'",
          "pintar → pin-TAR = thông minh",
          "dùng 'semakin' trong văn viết, 'makin' trong văn nói",
        ],
        pronunciation_focus_en: [
          "semakin ... semakin ... = the more ... the more (formal form)",
          "banyak → 'BAH-nyak' = many; 'ny' = ñ",
          "pintar → 'pin-TAR' = smart",
          "use 'semakin' in writing, 'makin' in speech",
        ],
      },
    ],
    cultural_notes_vi:
      "Đây là cấu trúc người Việt SẼ YÊU vì nó tương ứng HOÀN HẢO với 'càng ... càng'. Tiếng Indonesia: 'makin ... makin ...' hoặc 'semakin ... semakin ...' = 'càng ... càng ...'. Ví dụ: 'makin lama makin mahal' = 'càng lâu càng đắt'. 'Semakin' là dạng đầy đủ (trang trọng, văn viết); 'makin' là dạng rút gọn (đời thường, văn nói) — chọn theo ngữ cảnh. Dùng đơn lẻ: 'semakin panas' = 'ngày càng nóng' (chỉ một chiều tăng dần). Có thể kết hợp với 'lebih': 'semakin lama semakin baik' (càng lâu càng tốt). Đây là một trong những điểm ngữ pháp DỄ NHẤT cho người Việt vì khái niệm và logic giống y hệt — chỉ cần học từ 'makin/semakin' và đặt nó TRƯỚC tính từ.",
    cultural_notes_en:
      "Vietnamese learners will LOVE this — it maps PERFECTLY onto 'càng ... càng'. Indonesian: 'makin ... makin ...' or 'semakin ... semakin ...' = 'the more ... the more'. Example: 'makin lama makin mahal' = 'the longer, the more expensive'. 'Semakin' is the full form (formal, writing); 'makin' is the short form (casual, speech) — choose by context. Used singly: 'semakin panas' = 'increasingly hot' (one-directional increase). It can combine: 'semakin lama semakin baik' (the longer the better). This is one of the EASIEST grammar points for Vietnamese speakers because the concept and logic are identical — just learn 'makin/semakin' and place it BEFORE the adjective.",
    tip_advice_vi:
      "Tương ứng hoàn hảo: makin/semakin ... makin/semakin = càng ... càng. 'semakin' (trang trọng, viết) vs 'makin' (đời thường, nói). Đặt TRƯỚC tính từ. Đơn lẻ: 'semakin panas' = ngày càng nóng. Đây là điểm ngữ pháp dễ nhất — logic giống tiếng Việt 100%.",
    tip_advice_en:
      "Perfect match: makin/semakin ... makin/semakin = the more ... the more. 'semakin' (formal, writing) vs 'makin' (casual, speech). Place it BEFORE the adjective. Standalone: 'semakin panas' = increasingly hot. This is the easiest grammar point — logic is 100% like Vietnamese.",
    vocabulary: [
      { cell_id: "e2bc9db7-694f-4498-a68c-5e23db529a7d", word: "semakin", en: "increasingly, the more", vi: "ngày càng, càng", pos: "adverb", pronunciation_vi: "se-MA-kin", pronunciation_en: "suh-MAH-kin" },
      { cell_id: "3afd4d63-4e7c-4b6c-8748-15111309378d", word: "makin", en: "the more (short form)", vi: "càng (rút gọn)", pos: "adverb", pronunciation_vi: "MA-kin", pronunciation_en: "MAH-kin" },
      { cell_id: "2415cdc4-c231-4528-977a-00387106463d", word: "lama", en: "long (in time)", vi: "lâu", pos: "adjective", pronunciation_vi: "LA-ma", pronunciation_en: "LAH-mah" },
      { cell_id: "448e957b-848e-4cb1-9f4e-00870b3c89f4", word: "pintar", en: "smart, clever", vi: "thông minh", pos: "adjective", pronunciation_vi: "pin-TAR", pronunciation_en: "pin-TAR" },
      { cell_id: "aa759104-e61c-42aa-b4bf-eccaaa4cb15e", word: "banyak", en: "many, much", vi: "nhiều", pos: "adjective", pronunciation_vi: "BA-nyak", pronunciation_en: "BAH-nyak" },
      { cell_id: "e15d273b-a4d0-4fd4-9c3f-c2691c632851", word: "harga", en: "price", vi: "giá", pos: "noun", pronunciation_vi: "HAR-ga", pronunciation_en: "HAR-gah" },
    ],
    dialogue: [
      { cell_id: "9e4b9b12-e529-4b39-9cbb-ad22c749fa99", speaker: "Eko", text: "Harga rumah makin lama makin mahal ya.", vi: "Giá nhà càng lâu càng đắt nhỉ.", en: "House prices get more expensive over time, don't they." },
      { cell_id: "ee1910eb-ce21-4ca5-ad8e-acfedd82d9aa", speaker: "Sri", text: "Iya, semakin sulit beli rumah di Jakarta.", vi: "Ừ, càng ngày càng khó mua nhà ở Jakarta.", en: "Yeah, it's increasingly hard to buy a house in Jakarta." },
      { cell_id: "9278736d-621a-4e08-a410-9f4d755f1c90", speaker: "Eko", text: "Makanya, makin cepat menabung makin baik.", vi: "Vậy nên, càng sớm tiết kiệm càng tốt.", en: "That's why, the sooner you save the better." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền 'makin/semakin' tạo cấu trúc 'càng...càng':",
        instruction_en: "Fill 'makin/semakin' to build 'the more ... the more':",
        items: [
          { prompt: "___ lama ___ mahal. (càng lâu càng đắt)", answer: "Makin / makin", options: ["Makin / makin", "Lebih / lebih", "Paling / paling"] },
          { prompt: "Cuaca ___ panas tiap tahun. (ngày càng)", answer: "semakin", options: ["semakin", "paling", "kurang"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Càng học nhiều càng thông minh.", answer: "Semakin banyak belajar, semakin pintar." },
          { prompt: "Thời tiết ngày càng nóng.", answer: "Cuaca semakin panas." },
        ],
      },
    ],
  },
];

export default lessons;
