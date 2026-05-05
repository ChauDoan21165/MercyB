// src/languages/french/lessons.ts
//
// 20 French lessons for Vietnamese learners (5 intro + 15 topic-based).
// Each lesson: vocabulary, example sentences, dialogue, exercises, and
// pronunciation focus written for Vietnamese speakers.
//
// Shape mirrors the profession-pack content.ts pattern so the page UI
// stays consistent across verticals.
//
// Hand-crafted; no AI-generated filler.

export type FrenchCategoryId =
  | "greetings"
  | "numbers"
  | "common_phrases"
  | "basic_grammar"
  | "food"
  | "family"
  | "daily_routine"
  | "weather"
  | "time"
  | "colors"
  | "clothes"
  | "transportation"
  | "house"
  | "hobbies"
  | "health"
  | "work"
  | "travel"
  | "emotions"
  | "past_tense"
  | "future_plans"
  | "workplace"
  | "life_admin"
  | "society"
  | "expressions"
  | "advanced_grammar"
  | "fluency";

export type FrenchCategoryMeta = {
  id: FrenchCategoryId;
  title_vi: string;
  title_en: string;
  expected_count: number;
};

export const FRENCH_CATEGORIES: ReadonlyArray<FrenchCategoryMeta> = [
  { id: "greetings", title_vi: "Chào hỏi và giới thiệu", title_en: "Greetings and introductions", expected_count: 1 },
  { id: "numbers", title_vi: "Số đếm", title_en: "Numbers", expected_count: 1 },
  { id: "common_phrases", title_vi: "Câu giao tiếp thông dụng", title_en: "Common phrases", expected_count: 1 },
  { id: "basic_grammar", title_vi: "Ngữ pháp cơ bản", title_en: "Basic grammar", expected_count: 1 },
  { id: "food", title_vi: "Ẩm thực và gọi món", title_en: "Food and ordering", expected_count: 1 },
  { id: "family", title_vi: "Gia đình", title_en: "Family", expected_count: 1 },
  { id: "daily_routine", title_vi: "Sinh hoạt hàng ngày", title_en: "Daily routine", expected_count: 1 },
  { id: "weather", title_vi: "Thời tiết", title_en: "Weather", expected_count: 1 },
  { id: "time", title_vi: "Thời gian", title_en: "Time", expected_count: 1 },
  { id: "colors", title_vi: "Màu sắc", title_en: "Colors", expected_count: 1 },
  { id: "clothes", title_vi: "Quần áo", title_en: "Clothes", expected_count: 1 },
  { id: "transportation", title_vi: "Giao thông", title_en: "Transportation", expected_count: 1 },
  { id: "house", title_vi: "Nhà cửa", title_en: "House", expected_count: 1 },
  { id: "hobbies", title_vi: "Sở thích", title_en: "Hobbies", expected_count: 1 },
  { id: "health", title_vi: "Sức khỏe", title_en: "Health", expected_count: 1 },
  { id: "work", title_vi: "Công việc", title_en: "Work", expected_count: 1 },
  { id: "travel", title_vi: "Du lịch", title_en: "Travel", expected_count: 1 },
  { id: "emotions", title_vi: "Cảm xúc", title_en: "Emotions", expected_count: 1 },
  { id: "past_tense", title_vi: "Thì quá khứ", title_en: "Past tense", expected_count: 1 },
  { id: "future_plans", title_vi: "Kế hoạch tương lai", title_en: "Future plans", expected_count: 1 },
  { id: "workplace", title_vi: "Công sở", title_en: "Workplace", expected_count: 5 },
  { id: "life_admin", title_vi: "Thủ tục hành chính", title_en: "Administrative tasks", expected_count: 5 },
  { id: "society", title_vi: "Xã hội", title_en: "Society", expected_count: 5 },
  { id: "expressions", title_vi: "Biểu đạt", title_en: "Expressions", expected_count: 5 },
  { id: "advanced_grammar", title_vi: "Ngữ pháp nâng cao", title_en: "Advanced grammar", expected_count: 5 },
  { id: "fluency", title_vi: "Lưu loát", title_en: "Fluency", expected_count: 5 },
];

export type LessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
};

export type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
};

export type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

export type Exercise = Record<string, any>;

export type FrenchCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type FrenchLesson = {
  id: string;
  category: FrenchCategoryId;
  level: FrenchCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  tip_advice_vi: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
  content?: string;
  // B2 calibration fields — optional passthrough; consumed by normalizer + renderer
  dialogue_long?: DialogueLine[];
  roleplay_prompts?: string[];
  register_notes?: string;
  idiom_glosses?: { idiom: string; literal: string; meaning: string; example: string }[];
};

// ── 1. Greetings ────────────────────────────────────────────────────────

const GREETINGS: FrenchLesson[] = [
  {
    id: "french_greetings_intro",
    level: "A1",
    category: "greetings",
    title_vi: "Chào hỏi cơ bản",
    title_en: "Basic greetings",
    sentences: [
      { en: "Bonjour, je m'appelle Marie.", vi: "Xin chào, tôi tên là Marie.", pronunciation_focus: ["nasal on", "nasal in", "silent -e", "elle → èl"] },
      { en: "Enchanté de faire votre connaissance.", vi: "Rất vui được làm quen với bạn.", pronunciation_focus: ["nasal en", "nasal an", "é → ê", "silent -re"] },
      { en: "Comment allez-vous aujourd'hui ?", vi: "Hôm nay bạn khỏe không?", pronunciation_focus: ["nasal ent", "ez → ê", "u → uy", "hui → u-i"] },
      { en: "Je vais bien, merci. Et vous ?", vi: "Tôi khỏe, cảm ơn. Còn bạn?", pronunciation_focus: ["nasal en", "silent -s", "er → ê"] },
      { en: "Au revoir et bonne journée !", vi: "Tạm biệt và chúc một ngày tốt lành!", pronunciation_focus: ["au → ô", "oi → oa", "ou → u", "ée → ê"] },
    ],
    cultural_notes_vi: "Người Pháp chào bằng 'bonjour' suốt cả ngày đến tầm 6 giờ tối mới chuyển sang 'bonsoir'. Dùng 'salut' với bạn bè thân, không dùng với người lớn tuổi hay lần đầu gặp. 'Enchanté' (nam) / 'Enchantée' (nữ) là câu lịch sự chuẩn khi gặp lần đầu.",
    tip_advice_vi: "Khi gặp người Pháp, luôn nói 'bonjour' TRƯỚC khi hỏi bất cứ điều gì — kể cả hỏi đường. Vào tiệm bánh mà không chào 'bonjour' là bị coi là bất lịch sự. Tập phát âm âm mũi (bonjour, enchanté, bien) — đó là điểm yếu nhất của người Việt học tiếng Pháp.",
  },
];

// ── 2. Numbers ──────────────────────────────────────────────────────────

const NUMBERS: FrenchLesson[] = [
  {
    id: "french_numbers_1_20",
    level: "A1",
    category: "numbers",
    title_vi: "Số đếm 1 đến 20",
    title_en: "Numbers 1 to 20",
    sentences: [
      { en: "Un, deux, trois — un café, s'il vous plaît.", vi: "Một, hai, ba — một ly cà phê, làm ơn.", pronunciation_focus: ["nasal un", "eu → ơ", "oi → oa", "silent -s"] },
      { en: "Quatre, cinq, six croissants.", vi: "Bốn, năm, sáu cái bánh croissant.", pronunciation_focus: ["quatre → kat", "nasal in", "x → s", "silent -nts"] },
      { en: "Sept, huit, neuf euros.", vi: "Bảy, tám, chín euro.", pronunciation_focus: ["sept → set", "h muet", "eu → ơ", "f final"] },
      { en: "Dix, onze, douze personnes.", vi: "Mười, mười một, mười hai người.", pronunciation_focus: ["dix → dis", "nasal on", "ou → u", "silent -s"] },
      { en: "Treize, quatorze, quinze, seize.", vi: "Mười ba, mười bốn, mười năm, mười sáu.", pronunciation_focus: ["ei → e", "ze → d", "in → ang nasal"] },
    ],
    cultural_notes_vi: "Số Pháp 70-99 nổi tiếng phức tạp: 70 = soixante-dix (60+10), 80 = quatre-vingts (4x20), 90 = quatre-vingt-dix (4x20+10). Người Bỉ và Thụy Sĩ dùng 'septante', 'huitante', 'nonante' đơn giản hơn — nhưng người Pháp thì không.",
    tip_advice_vi: "Khi trả tiền ở Pháp, đừng chỉ giơ thẻ — hãy nói số tiền bằng tiếng Pháp. Người Pháp đánh giá cao nỗ lực nói tiếng Pháp, dù chỉ là đọc số.",
  },
];

// ── 3. Common Phrases ───────────────────────────────────────────────────

const COMMON_PHRASES: FrenchLesson[] = [
  {
    id: "french_common_travel",
    level: "A1",
    category: "common_phrases",
    title_vi: "Câu du lịch thiết yếu",
    title_en: "Essential travel phrases",
    sentences: [
      { en: "Où sont les toilettes, s'il vous plaît ?", vi: "Nhà vệ sinh ở đâu ạ?", pronunciation_focus: ["où → u", "nasal on", "oi → oa", "silent -es"] },
      { en: "Combien ça coûte ?", vi: "Cái này giá bao nhiêu?", pronunciation_focus: ["nasal en", "ou → u", "û → u", "silent -e"] },
      { en: "Je voudrais un billet pour Paris.", vi: "Tôi muốn mua một vé đi Paris.", pronunciation_focus: ["ou → u", "ai → e", "silent -t", "r uvulaire"] },
      { en: "Parlez-vous anglais ?", vi: "Bạn có nói tiếng Anh không?", pronunciation_focus: ["ez → ê", "ou → u", "nasal an", "silent -s"] },
      { en: "Je ne comprends pas. Pouvez-vous répéter ?", vi: "Tôi không hiểu. Bạn nói lại được không?", pronunciation_focus: ["nasal en", "nasal on", "ez → ê", "é → ê"] },
    ],
    cultural_notes_vi: "Ở Pháp, hỏi 'Parlez-vous anglais?' TRƯỚC khi nói tiếng Anh là phép lịch sự tối thiểu. Nếu bạn nhảy thẳng vào tiếng Anh, nhiều người Pháp sẽ giả vờ không hiểu. 'Je voudrais' lịch sự hơn 'Je veux' (nghe như ra lệnh).",
    tip_advice_vi: "Học thuộc 5 câu này trước khi đi Pháp. Người Pháp sẽ nói tiếng Anh với bạn nếu bạn thể hiện đã cố gắng nói tiếng Pháp trước.",
  },
];

// ── 4. Basic Grammar ────────────────────────────────────────────────────

const BASIC_GRAMMAR: FrenchLesson[] = [
  {
    id: "french_grammar_gender",
    level: "A1",
    category: "basic_grammar",
    title_vi: "Giống đực và giống cái",
    title_en: "Masculine and feminine gender",
    sentences: [
      { en: "Le garçon est petit. La fille est petite.", vi: "Cậu bé thì nhỏ. Cô bé thì nhỏ.", pronunciation_focus: ["le → lơ", "la → la", "nasal on", "silent -t", "e muet"] },
      { en: "Un bon café. Une bonne baguette.", vi: "Một ly cà phê ngon. Một ổ bánh mì ngon.", pronunciation_focus: ["nasal un", "nasal on", "bon → bon nasal", "bonne → bon"] },
      { en: "Le chat noir. La voiture rouge.", vi: "Con mèo đen. Chiếc xe hơi đỏ.", pronunciation_focus: ["le / la distinction", "oi → oa", "ou → u", "r uvulaire"] },
      { en: "Mon ami, mon amie — same sound!", vi: "Bạn trai tôi, bạn gái tôi — nghe giống nhau!", pronunciation_focus: ["nasal on", "mon → mon nasal", "amie → a-mi", "liaison mon‿ami"] },
      { en: "Les enfants sont gentils.", vi: "Lũ trẻ thì ngoan.", pronunciation_focus: ["les → lê", "nasal en", "nasal on", "gentils → jan-ti"] },
    ],
    cultural_notes_vi: "Tiếng Pháp chia mọi danh từ thành giống đực (le/un) hoặc giống cái (la/une). Không có quy tắc tuyệt đối — phải học thuộc từng từ. Mẹo: từ kết thúc bằng -tion, -sion, -té thường là giống cái. Từ kết thúc bằng -age, -ment thường là giống đực.",
    tip_advice_vi: "Đừng sợ sai giống đực/cái — người Pháp vẫn hiểu bạn. Tập thói quen học mỗi danh từ KÈM mạo từ: không học 'pain' mà học 'LE pain'.",
  },
];

// ── 5. Food ─────────────────────────────────────────────────────────────

const FOOD_LEGACY: FrenchLesson[] = [
  {
    id: "french_food_ordering",
    level: "A1",
    category: "food",
    title_vi: "Gọi món ăn",
    title_en: "Ordering food",
    sentences: [
      { en: "Je voudrais un croque-monsieur, s'il vous plaît.", vi: "Cho tôi một cái croque-monsieur ạ.", pronunciation_focus: ["ou → u", "ai → e", "nasal un", "silent -t"] },
      { en: "Et une baguette, pas trop cuite.", vi: "Và một ổ bánh mì, đừng nướng quá kỹ.", pronunciation_focus: ["u → u pur", "baguette → ba-get", "ui → u-i", "silent -e"] },
      { en: "Qu'est-ce que vous recommandez ?", vi: "Bạn gợi ý món gì?", pronunciation_focus: ["qu'est → k", "e muet", "ez → ê", "silent -z"] },
      { en: "L'addition, s'il vous plaît.", vi: "Cho xin hóa đơn ạ.", pronunciation_focus: ["l'addition → la-di-sion", "silent -n", "ai → e"] },
      { en: "C'était délicieux ! Merci beaucoup.", vi: "Ngon tuyệt! Cảm ơn nhiều.", pronunciation_focus: ["é → ê", "eu → ơ", "ou → u", "silent -p"] },
    ],
    cultural_notes_vi: "Ở nhà hàng Pháp, đừng gọi 'garçon' để gọi bồi bàn — ngày nay bị coi là thô lỗ. Tiền tip đã bao gồm trong giá ('service compris'). Đừng gọi hóa đơn khi chưa ăn xong — người Pháp coi bữa ăn là thời gian thư giãn.",
    tip_advice_vi: "Khi vào tiệm bánh, chào 'bonjour' rồi chỉ tay vào bánh và nói 'je voudrais ça'. Từ 'délicieux' làm người Pháp cười — dùng nó nhiều vào.",
  },
];

// ── 6. Family ───────────────────────────────────────────────────────────

const FAMILY: FrenchLesson[] = [
  {
    id: "french_family_intro",
    level: "A1",
    category: "family",
    title_vi: "Giới thiệu gia đình",
    title_en: "Introducing family",
    sentences: [
      { en: "Voici ma mère, mon père et ma sœur.", vi: "Đây là mẹ, bố và em gái tôi.", pronunciation_focus: ["mère → me-r", "père → pe-r", "sœur → sơr", "r uvulaire"] },
      { en: "J'ai deux frères et une sœur.", vi: "Tôi có hai anh em trai và một chị em gái.", pronunciation_focus: ["j'ai → dê", "deux → đơ", "frères → phre-r", "sœur → sơr"] },
      { en: "Mes grands-parents habitent à la campagne.", vi: "Ông bà tôi sống ở nông thôn.", pronunciation_focus: ["grands-parents → grăn-pa-răn", "habitent → a-bít", "nasal an"] },
      { en: "Mon oncle est médecin, ma tante est professeure.", vi: "Chú tôi là bác sĩ, cô tôi là giáo viên.", pronunciation_focus: ["oncle → ong-klơ", "tante → tăngt", "médecin → mét-xăng"] },
      { en: "Nous sommes une grande famille de six personnes.", vi: "Chúng tôi là một gia đình lớn sáu người.", pronunciation_focus: ["nous → nu", "sommes → xom", "grande → grăngđ", "famille → pha-miy"] },
    ],
    cultural_notes_vi: "Gia đình Pháp thường nhỏ (1-3 con). Ông bà thường sống riêng, không ở chung 3 thế hệ như Việt Nam. Ngày Chủ Nhật là 'jour de famille' — cả nhà ăn trưa cùng nhau, có thể kéo dài 3-4 tiếng.",
    tip_advice_vi: "Khi giới thiệu gia đình với người Pháp, nói 'voici' (đây là) thay vì 'c'est'. Đừng dịch 'anh/chị/em' sang tiếng Pháp — dùng 'frère' hoặc 'sœur' và thêm 'grand/petit' cho hơn/kém tuổi.",
    vocabulary: [
      { word: "la mère", en: "mother", vi: "mẹ", pos: "noun (f)", pronunciation_vi: "la ME-rờ — 'è' đọc 'e' mở" },
      { word: "le père", en: "father", vi: "bố", pos: "noun (m)", pronunciation_vi: "lơ PE-rờ — 'è' đọc 'e' mở" },
      { word: "le frère", en: "brother", vi: "anh/em trai", pos: "noun (m)", pronunciation_vi: "lơ PHRE-rờ — 'fr' đọc 'phr'" },
      { word: "la sœur", en: "sister", vi: "chị/em gái", pos: "noun (f)", pronunciation_vi: "la XƠR — 'œu' đọc 'ơ'" },
      { word: "le fils", en: "son", vi: "con trai", pos: "noun (m)", pronunciation_vi: "lơ PHÍT — 'l' đọc nhẹ, 's' cuối KHÔNG đọc" },
      { word: "la fille", en: "daughter", vi: "con gái", pos: "noun (f)", pronunciation_vi: "la PHIY — 'ill' đọc 'iy'" },
      { word: "le mari", en: "husband", vi: "chồng", pos: "noun (m)", pronunciation_vi: "lơ ma-RI — 'a' ngắn, nhấn cuối" },
      { word: "la femme", en: "wife", vi: "vợ", pos: "noun (f)", pronunciation_vi: "la PHAM — 'e' đọc 'a', 'm' mím môi" },
      { word: "les grands-parents", en: "grandparents", vi: "ông bà", pos: "noun (m pl)", pronunciation_vi: "lê grăn pa-RĂN — 'an' âm mũi, 's' cuối KHÔNG đọc" },
      { word: "l'enfant", en: "child", vi: "đứa trẻ", pos: "noun (m/f)", pronunciation_vi: "loong-PHĂN — 'en' âm mũi, 't' KHÔNG đọc" },
    ],
    dialogue: [
      { speaker: "A", text: "Tu as des frères et sœurs ?", vi: "Bạn có anh chị em không?" },
      { speaker: "B", text: "Oui, j'ai une grande sœur et un petit frère.", vi: "Có, tôi có một chị gái và một em trai." },
      { speaker: "A", text: "Ils habitent où ?", vi: "Họ sống ở đâu?" },
      { speaker: "B", text: "Ma sœur est à Lyon, mon frère habite encore avec mes parents.", vi: "Chị tôi ở Lyon, em trai tôi vẫn ở với bố mẹ." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng vào chỗ trống (mère / père / frère / sœur):",
        pronunciation_focus: ["è → e mở", "r uvulaire"],
        items: [
          { prompt: "Ma ___ s'appelle Marie.", answer: "mère", options: ["mère", "père", "frère", "sœur"] },
          { prompt: "Mon ___ travaille à Paris.", answer: "père", options: ["mère", "père", "sœur", "fils"] },
          { prompt: "J'ai un ___ qui s'appelle Paul.", answer: "frère", options: ["mère", "fille", "frère", "sœur"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ tiếng Pháp với nghĩa tiếng Việt:",
        pronunciation_focus: ["famille → pha-miy"],
        items: [
          { prompt: "le mari", answer: "chồng" },
          { prompt: "la femme", answer: "vợ" },
          { prompt: "l'enfant", answer: "đứa trẻ" },
          { prompt: "les grands-parents", answer: "ông bà" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Pháp:",
        pronunciation_focus: ["possessifs mon/ma/mes"],
        items: [
          { prompt: "Mẹ tôi là giáo viên.", answer: "Ma mère est professeure." },
          { prompt: "Tôi có hai anh trai.", answer: "J'ai deux frères." },
          { prompt: "Ông bà tôi sống ở Hà Nội.", answer: "Mes grands-parents habitent à Hanoï." },
        ],
      },
    ],
  },
];

// ── 7. Daily Routine ────────────────────────────────────────────────────

const DAILY_ROUTINE: FrenchLesson[] = [
  {
    id: "french_daily_routine",
    level: "A1",
    category: "daily_routine",
    title_vi: "Sinh hoạt hàng ngày",
    title_en: "Daily routine",
    sentences: [
      { en: "Je me réveille à six heures du matin.", vi: "Tôi thức dậy lúc sáu giờ sáng.", pronunciation_focus: ["je → dơ", "réveille → rê-vay", "six → xít", "heures → ơr"] },
      { en: "Je prends mon petit-déjeuner à sept heures.", vi: "Tôi ăn sáng lúc bảy giờ.", pronunciation_focus: ["prends → prăn", "petit → pơ-ti", "déjeuner → đê-dơ-nê"] },
      { en: "Je me brosse les dents après le repas.", vi: "Tôi đánh răng sau bữa ăn.", pronunciation_focus: ["brosse → brot", "dents → đăn", "après → a-pre"] },
      { en: "Je vais au travail à huit heures.", vi: "Tôi đi làm lúc tám giờ.", pronunciation_focus: ["vais → ve", "au → ô", "travail → tra-vay", "huit → u-ít"] },
      { en: "Je me couche vers onze heures du soir.", vi: "Tôi đi ngủ khoảng mười một giờ tối.", pronunciation_focus: ["couche → cút-s", "vers → ve-r", "onze → ongz", "soir → xoa"] },
    ],
    cultural_notes_vi: "Người Pháp thường ăn sáng nhẹ: bánh mì bơ hoặc croissant + cà phê. Bữa trưa (déjeuner) là bữa chính, thường kéo dài 1-2 tiếng từ 12h-14h. Bữa tối (dîner) ăn muộn, sau 19h30. Các cửa hàng thường đóng cửa 12h-14h để nghỉ trưa.",
    tip_advice_vi: "Học nhanh các động từ phản thân (se réveiller, se laver, se coucher) là chìa khóa để nói về sinh hoạt hàng ngày. Tập nói trước gương một ngày mẫu: 'Je me réveille... je me lave... je prends...'",
    vocabulary: [
      { word: "se réveiller", en: "to wake up", vi: "thức dậy", pos: "verb", pronunciation_vi: "xơ rê-vê-YÊ — 'ill' đọc 'y'" },
      { word: "se lever", en: "to get up", vi: "ra khỏi giường", pos: "verb", pronunciation_vi: "xơ lơ-VÊ — 'er' đọc 'ê'" },
      { word: "se laver", en: "to wash oneself", vi: "rửa mặt / tắm", pos: "verb", pronunciation_vi: "xơ la-VÊ — 'a' ngắn" },
      { word: "s'habiller", en: "to get dressed", vi: "mặc quần áo", pos: "verb", pronunciation_vi: "xa-bi-YÊ — 'h' KHÔNG đọc, 'ill' đọc 'y'" },
      { word: "prendre", en: "to take", vi: "lấy / ăn / uống", pos: "verb", pronunciation_vi: "PRĂN-đrơ — 'en' âm mũi" },
      { word: "le petit-déjeuner", en: "breakfast", vi: "bữa sáng", pos: "noun (m)", pronunciation_vi: "pơ-ti đê-dơ-NÊ" },
      { word: "le déjeuner", en: "lunch", vi: "bữa trưa", pos: "noun (m)", pronunciation_vi: "đê-dơ-NÊ — nhấn cuối" },
      { word: "le dîner", en: "dinner", vi: "bữa tối", pos: "noun (m)", pronunciation_vi: "đi-NÊ — 'î' đọc 'i' dài" },
      { word: "se coucher", en: "to go to bed", vi: "đi ngủ", pos: "verb", pronunciation_vi: "xơ cu-SÊ — 'ou' đọc 'u'" },
      { word: "travailler", en: "to work", vi: "làm việc", pos: "verb", pronunciation_vi: "tra-va-YÊ — 'ill' đọc 'y'" },
    ],
    dialogue: [
      { speaker: "A", text: "À quelle heure tu te lèves le matin ?", vi: "Sáng bạn dậy lúc mấy giờ?" },
      { speaker: "B", text: "Je me lève à six heures et demie.", vi: "Tôi dậy lúc sáu rưỡi." },
      { speaker: "A", text: "Et tu prends le petit-déjeuner ?", vi: "Bạn có ăn sáng không?" },
      { speaker: "B", text: "Oui, un café et une tartine, puis je pars au travail.", vi: "Có, cà phê và bánh mì bơ, rồi tôi đi làm." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền động từ phản thân đúng:",
        pronunciation_focus: ["se réveiller", "se lever"],
        items: [
          { prompt: "Je ___ ___ à sept heures. (thức dậy)", answer: "me réveille" },
          { prompt: "Elle ___ ___ après le repas. (đi ngủ)", answer: "se couche" },
          { prompt: "Nous ___ ___ avant de partir. (mặc quần áo)", answer: "nous habillons" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối hoạt động với thời gian:",
        pronunciation_focus: ["heures → ơr"],
        items: [
          { prompt: "se réveiller", answer: "6h00" },
          { prompt: "prendre le petit-déjeuner", answer: "7h00" },
          { prompt: "aller au travail", answer: "8h00" },
          { prompt: "se coucher", answer: "23h00" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Pháp:",
        pronunciation_focus: ["verbes pronominaux"],
        items: [
          { prompt: "Tôi thức dậy lúc 6 giờ.", answer: "Je me réveille à six heures." },
          { prompt: "Cô ấy đi ngủ lúc 10 giờ tối.", answer: "Elle se couche à dix heures du soir." },
          { prompt: "Chúng tôi ăn trưa lúc 12 giờ.", answer: "Nous déjeunons à midi." },
        ],
      },
    ],
  },
];

// ── 8. Weather ──────────────────────────────────────────────────────────

const WEATHER: FrenchLesson[] = [
  {
    id: "french_weather",
    level: "A1",
    category: "weather",
    title_vi: "Thời tiết và các mùa",
    title_en: "Weather and seasons",
    sentences: [
      { en: "Quel temps fait-il aujourd'hui ?", vi: "Thời tiết hôm nay thế nào?", pronunciation_focus: ["quel → ken", "temps → tăm", "il → in", "hui → u-i"] },
      { en: "Il fait beau et il y a du soleil.", vi: "Trời đẹp và có nắng.", pronunciation_focus: ["beau → bô", "soleil → xô-lay", "il y a → in-li-a"] },
      { en: "Il pleut beaucoup en automne.", vi: "Mùa thu mưa nhiều.", pronunciation_focus: ["pleut → plơ", "beaucoup → bô-cu", "automne → ô-tôn"] },
      { en: "En été, il fait très chaud, parfois 35 degrés.", vi: "Mùa hè, trời rất nóng, có khi 35 độ.", pronunciation_focus: ["été → ê-tê", "très → tre", "chaud → sô", "degrés → đơ-grê"] },
      { en: "En hiver, il neige dans les montagnes.", vi: "Mùa đông, có tuyết ở trên núi.", pronunciation_focus: ["hiver → i-ve-r", "neige → ne-d", "montagnes → mon-tan-nhơ"] },
    ],
    cultural_notes_vi: "Người Pháp thường mở đầu câu chuyện bằng thời tiết — câu 'Quel temps!' (Thời tiết gì thế này!) là câu cửa miệng. Mùa hè ở Paris có thể rất nóng (35-40°C), và nhiều nhà không có điều hòa. Mùa đông ở miền Bắc nước Pháp lạnh và ẩm.",
    tip_advice_vi: "Học cấu trúc 'Il fait + tính từ' (trời...): Il fait beau / chaud / froid / gris (xám xịt) / doux (dễ chịu). Và 'Il y a + du/de la/des': du soleil (nắng), du vent (gió), des nuages (mây).",
    vocabulary: [
      { word: "le soleil", en: "sun", vi: "mặt trời / nắng", pos: "noun (m)", pronunciation_vi: "lơ xô-LAY — 'ei' đọc 'ê'" },
      { word: "la pluie", en: "rain", vi: "mưa", pos: "noun (f)", pronunciation_vi: "la PLUY — 'ui' đọc 'uy', 'e' cuối KHÔNG đọc" },
      { word: "le vent", en: "wind", vi: "gió", pos: "noun (m)", pronunciation_vi: "lơ VĂN — 'en' âm mũi, 't' KHÔNG đọc" },
      { word: "la neige", en: "snow", vi: "tuyết", pos: "noun (f)", pronunciation_vi: "la NE-D — 'ei' đọc 'ê', 'ge' đọc 'd' mềm" },
      { word: "le nuage", en: "cloud", vi: "mây", pos: "noun (m)", pronunciation_vi: "lơ NU-A-D — 'u' đọc 'uy'" },
      { word: "chaud", en: "hot", vi: "nóng", pos: "adjective", pronunciation_vi: "SÔ — 'au' đọc 'ô', 'd' KHÔNG đọc" },
      { word: "froid", en: "cold", vi: "lạnh", pos: "adjective", pronunciation_vi: "PHROA — 'oi' đọc 'oa', 'd' KHÔNG đọc" },
      { word: "le printemps", en: "spring", vi: "mùa xuân", pos: "noun (m)", pronunciation_vi: "lơ PRANG-TĂM — 'in' âm mũi, 's' KHÔNG đọc" },
      { word: "l'été", en: "summer", vi: "mùa hè", pos: "noun (m)", pronunciation_vi: "lê-TÊ — 'é' đọc 'ê' dài" },
      { word: "l'hiver", en: "winter", vi: "mùa đông", pos: "noun (m)", pronunciation_vi: "li-VE-R — 'h' KHÔNG đọc" },
    ],
    dialogue: [
      { speaker: "A", text: "Il fait quel temps chez toi ?", vi: "Thời tiết chỗ bạn thế nào?" },
      { speaker: "B", text: "Il pleut depuis ce matin. Et toi ?", vi: "Mưa từ sáng. Còn bạn?" },
      { speaker: "A", text: "Ici, il fait beau, grand soleil !", vi: "Ở đây trời đẹp, nắng to!" },
      { speaker: "B", text: "Tu as de la chance ! Moi, j'en ai marre de la pluie.", vi: "Bạn may mắn thật! Tôi chán mưa lắm rồi." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về thời tiết:",
        pronunciation_focus: ["il fait", "il y a"],
        items: [
          { prompt: "Il ___ beau aujourd'hui.", answer: "fait" },
          { prompt: "Il y a du ___ (nắng).", answer: "soleil" },
          { prompt: "En hiver, il ___ (tuyết rơi).", answer: "neige" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối mùa với thời tiết:",
        pronunciation_focus: ["saisons"],
        items: [
          { prompt: "le printemps", answer: "doux, il pleut parfois" },
          { prompt: "l'été", answer: "chaud, soleil" },
          { prompt: "l'automne", answer: "vent, pluie" },
          { prompt: "l'hiver", answer: "froid, neige" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Pháp:",
        pronunciation_focus: ["quel temps", "il fait"],
        items: [
          { prompt: "Hôm nay trời lạnh.", answer: "Il fait froid aujourd'hui." },
          { prompt: "Trời đang mưa.", answer: "Il pleut." },
          { prompt: "Mùa hè có nắng.", answer: "En été, il y a du soleil." },
        ],
      },
    ],
  },
];

// ── 9. Time ─────────────────────────────────────────────────────────────

const TIME: FrenchLesson[] = [
  {
    id: "french_time",
    level: "A1",
    category: "time",
    title_vi: "Nói giờ và ngày tháng",
    title_en: "Telling time and dates",
    sentences: [
      { en: "Quelle heure est-il ? Il est trois heures et quart.", vi: "Mấy giờ rồi? Ba giờ mười lăm.", pronunciation_focus: ["quelle → ken", "heure → ơr", "trois → thoa", "quart → ka-r"] },
      { en: "Le rendez-vous est à dix heures et demie.", vi: "Cuộc hẹn lúc mười giờ rưỡi.", pronunciation_focus: ["rendez-vous → răn-đê-vu", "dix → đít", "demie → đơ-mi"] },
      { en: "On est quel jour aujourd'hui ? On est lundi.", vi: "Hôm nay là thứ mấy? Hôm nay thứ Hai.", pronunciation_focus: ["quel → ken", "jour → dua", "lundi → lăng-đi"] },
      { en: "Mon anniversaire est le quinze mars.", vi: "Sinh nhật tôi là ngày 15 tháng Ba.", pronunciation_focus: ["anniversaire → a-ni-ve-xe-r", "quinze → kăngz", "mars → ma-r"] },
      { en: "Le magasin ouvre à neuf heures du matin.", vi: "Cửa hàng mở cửa lúc chín giờ sáng.", pronunciation_focus: ["magasin → ma-ga-zăng", "ouvre → u-vrơ", "neuf → nớph", "matin → ma-tăng"] },
    ],
    cultural_notes_vi: "Người Pháp dùng đồng hồ 24h trong lịch trình chính thức: '14h' thay vì '2h chiều'. Ngày viết là ngày/tháng/năm (DD/MM). Thứ Hai là ngày đầu tuần. Hầu hết cửa hàng đóng cửa Chủ Nhật, trừ siêu thị buổi sáng và tiệm bánh.",
    tip_advice_vi: "Học cách nói giờ dạng 12h trước: 'Il est ... heures'. Sau đó tập dạng 24h. Cụm 'et quart' (15 phút), 'et demie' (30 phút), 'moins le quart' (kém 15) là ba cụm phổ biến nhất khi nói giờ.",
    vocabulary: [
      { word: "l'heure", en: "hour / time", vi: "giờ", pos: "noun (f)", pronunciation_vi: "LƠR — 'h' KHÔNG đọc, 'eu' đọc 'ơ'" },
      { word: "la minute", en: "minute", vi: "phút", pos: "noun (f)", pronunciation_vi: "la mi-NUYT — 'u' đọc 'uy'" },
      { word: "la seconde", en: "second", vi: "giây", pos: "noun (f)", pronunciation_vi: "la xơ-GÔNGĐ — 'on' âm mũi" },
      { word: "lundi", en: "Monday", vi: "thứ Hai", pos: "noun (m)", pronunciation_vi: "lăng-ĐI — 'un' âm mũi" },
      { word: "mardi", en: "Tuesday", vi: "thứ Ba", pos: "noun (m)", pronunciation_vi: "ma-ĐI" },
      { word: "mercredi", en: "Wednesday", vi: "thứ Tư", pos: "noun (m)", pronunciation_vi: "me-crơ-ĐI — 'er' đọc 'e'" },
      { word: "janvier", en: "January", vi: "tháng Một", pos: "noun (m)", pronunciation_vi: "dăng-VIÊ — 'an' âm mũi" },
      { word: "aujourd'hui", en: "today", vi: "hôm nay", pos: "adverb", pronunciation_vi: "ô-dua-ĐUY — nhấn 'duy'" },
      { word: "demain", en: "tomorrow", vi: "ngày mai", pos: "adverb", pronunciation_vi: "đơ-MANG — 'ain' âm mũi" },
      { word: "hier", en: "yesterday", vi: "hôm qua", pos: "adverb", pronunciation_vi: "Y-E — 'h' KHÔNG đọc, 'ier' đọc 'iê'" },
    ],
    dialogue: [
      { speaker: "A", text: "Quelle heure est-il ?", vi: "Mấy giờ rồi?" },
      { speaker: "B", text: "Il est midi moins cinq.", vi: "Mười hai giờ kém năm." },
      { speaker: "A", text: "Déjà ?! J'ai un rendez-vous à midi et quart.", vi: "Rồi á?! Tôi có hẹn lúc 12h15." },
      { speaker: "B", text: "Dépêche-toi alors !", vi: "Vậy thì nhanh lên đi!" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền giờ đúng:",
        pronunciation_focus: ["heures"],
        items: [
          { prompt: "Il est ___ heures. (8h00)", answer: "huit" },
          { prompt: "Il est midi ___ quart. (12h15)", answer: "et" },
          { prompt: "Il est dix heures ___ (10h30).", answer: "et demie" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối ngày tiếng Pháp với tiếng Việt:",
        pronunciation_focus: ["jours de la semaine"],
        items: [
          { prompt: "lundi", answer: "thứ Hai" },
          { prompt: "vendredi", answer: "thứ Sáu" },
          { prompt: "dimanche", answer: "Chủ Nhật" },
          { prompt: "samedi", answer: "thứ Bảy" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Pháp:",
        pronunciation_focus: ["quelle heure"],
        items: [
          { prompt: "Hôm nay là thứ mấy?", answer: "Quel jour sommes-nous aujourd'hui ?" },
          { prompt: "Sinh nhật tôi là ngày 5 tháng 7.", answer: "Mon anniversaire est le cinq juillet." },
          { prompt: "Bây giờ là 9 giờ sáng.", answer: "Il est neuf heures du matin." },
        ],
      },
    ],
  },
];

// ── 10. Colors ──────────────────────────────────────────────────────────

const COLORS: FrenchLesson[] = [
  {
    id: "french_colors",
    level: "A1",
    category: "colors",
    title_vi: "Màu sắc cơ bản",
    title_en: "Basic colors",
    sentences: [
      { en: "De quelle couleur est ta voiture ?", vi: "Xe của bạn màu gì?", pronunciation_focus: ["quelle → ken", "couleur → cu-lơr", "voiture → voa-tuy-r"] },
      { en: "Ma voiture est rouge. La tienne ?", vi: "Xe tôi màu đỏ. Của bạn thì sao?", pronunciation_focus: ["rouge → ru-d", "tienne → ti-en", "silent -e"] },
      { en: "J'adore le bleu clair, surtout en été.", vi: "Tôi rất thích xanh nhạt, nhất là mùa hè.", pronunciation_focus: ["j'adore → da-đo-r", "bleu → blơ", "clair → cle-r"] },
      { en: "Tu préfères le vert ou le jaune ?", vi: "Bạn thích xanh lá hay vàng hơn?", pronunciation_focus: ["préfères → prê-fe-r", "vert → ve-r", "jaune → dôn"] },
      { en: "Le noir et le blanc, c'est classique.", vi: "Đen và trắng, lúc nào cũng hợp.", pronunciation_focus: ["noir → noa", "blanc → blăng", "classique → cla-xíc"] },
    ],
    cultural_notes_vi: "Trong tiếng Pháp, tính từ màu sắc đứng SAU danh từ và phải hợp giống/số: 'une robe blanche' (một cái váy trắng) khác 'un mur blanc' (một bức tường trắng). Màu sắc kết hợp (bleu marine, vert pomme) không đổi giống.",
    tip_advice_vi: "Học 6 màu cơ bản trước (rouge, bleu, vert, jaune, noir, blanc). Sau đó học quy tắc: thêm -e cho giống cái, thêm -s cho số nhiều. 'Marron' (nâu) và 'orange' (cam) không đổi — là ngoại lệ quan trọng.",
    vocabulary: [
      { word: "rouge", en: "red", vi: "đỏ", pos: "adjective", pronunciation_vi: "RU-D — 'ou' đọc 'u', 'ge' đọc 'd' mềm" },
      { word: "bleu", en: "blue", vi: "xanh dương", pos: "adjective", pronunciation_vi: "BLƠ — 'eu' đọc 'ơ', giống 'bleh' nhưng tròn môi" },
      { word: "vert", en: "green", vi: "xanh lá", pos: "adjective", pronunciation_vi: "VE-R — 'e' đọc 'e' mở, 't' KHÔNG đọc" },
      { word: "jaune", en: "yellow", vi: "vàng", pos: "adjective", pronunciation_vi: "DÔN — 'au' đọc 'ô', 'ne' cuối KHÔNG đọc rõ" },
      { word: "noir", en: "black", vi: "đen", pos: "adjective", pronunciation_vi: "NOA — 'oi' đọc 'oa', 'r' cuối nhẹ" },
      { word: "blanc", en: "white", vi: "trắng", pos: "adjective", pronunciation_vi: "BLĂNG — 'an' âm mũi, 'c' KHÔNG đọc" },
      { word: "rose", en: "pink", vi: "hồng", pos: "adjective", pronunciation_vi: "RÔ-D — 'o' đọc 'ô', 'se' đọc 'd' nhẹ" },
      { word: "gris", en: "grey", vi: "xám", pos: "adjective", pronunciation_vi: "GRI — 'i' đọc 'i', 's' KHÔNG đọc" },
      { word: "marron", en: "brown", vi: "nâu", pos: "adjective", pronunciation_vi: "ma-RÔNG — 'on' âm mũi, KHÔNG đổi giống" },
      { word: "violet", en: "purple", vi: "tím", pos: "adjective", pronunciation_vi: "vi-ô-LE — 't' KHÔNG đọc" },
    ],
    dialogue: [
      { speaker: "A", text: "Tu aimes ma nouvelle robe ?", vi: "Bạn thích váy mới của tôi không?" },
      { speaker: "B", text: "Oui, elle est très jolie ! Elle est de quelle couleur, bleu marine ?", vi: "Có, đẹp lắm! Màu gì thế, xanh navy à?" },
      { speaker: "A", text: "Non, c'est du violet foncé.", vi: "Không, là tím đậm." },
      { speaker: "B", text: "Ça te va très bien.", vi: "Hợp với bạn lắm." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền màu sắc đúng (hợp giống nếu cần):",
        pronunciation_focus: ["accord des couleurs"],
        items: [
          { prompt: "La voiture est ___. (đỏ)", answer: "rouge" },
          { prompt: "Le ciel est ___. (xanh)", answer: "bleu" },
          { prompt: "La neige est ___. (trắng - giống cái)", answer: "blanche" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối màu tiếng Pháp với nghĩa:",
        pronunciation_focus: ["couleurs"],
        items: [
          { prompt: "jaune", answer: "vàng" },
          { prompt: "noir", answer: "đen" },
          { prompt: "rose", answer: "hồng" },
          { prompt: "gris", answer: "xám" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Pháp:",
        pronunciation_focus: ["de quelle couleur"],
        items: [
          { prompt: "Cái áo này màu gì?", answer: "De quelle couleur est cette chemise ?" },
          { prompt: "Tôi thích màu xanh lá.", answer: "J'aime le vert." },
          { prompt: "Con mèo đen đang ngủ.", answer: "Le chat noir dort." },
        ],
      },
    ],
  },
];

// ── 11. Clothes ─────────────────────────────────────────────────────────

const CLOTHES: FrenchLesson[] = [
  {
    id: "french_clothes",
    level: "A1",
    category: "clothes",
    title_vi: "Quần áo và mua sắm",
    title_en: "Clothes and shopping",
    sentences: [
      { en: "Je cherche une chemise blanche, taille M.", vi: "Tôi đang tìm áo sơ mi trắng, cỡ M.", pronunciation_focus: ["cherche → se-r-s", "chemise → sơ-miz", "taille → tay"] },
      { en: "Où sont les cabines d'essayage ?", vi: "Phòng thử đồ ở đâu ạ?", pronunciation_focus: ["où → u", "cabines → ca-bín", "essayage → ê-xê-ya-d"] },
      { en: "Ce pantalon est trop serré. Avez-vous une taille plus grande ?", vi: "Quần này chật quá. Có cỡ to hơn không ạ?", pronunciation_focus: ["pantalon → păng-ta-lông", "serré → xê-rê", "grande → grăngđ"] },
      { en: "Combien coûte cette robe ?", vi: "Cái váy này giá bao nhiêu?", pronunciation_focus: ["combien → coong-bi-ăng", "coûte → cút", "robe → róp"] },
      { en: "Je prends le pull gris et l'écharpe.", vi: "Tôi lấy áo len xám và cái khăn.", pronunciation_focus: ["prends → prăn", "pull → puyn", "écharpe → ê-sác-p"] },
    ],
    cultural_notes_vi: "Ở Pháp, nhân viên bán hàng thường không theo bạn trong cửa hàng — họ để bạn tự do xem. Nếu cần giúp, bạn phải chủ động hỏi. Các đợt giảm giá lớn (les soldes) diễn ra tháng 1 và tháng 7, kéo dài 4-6 tuần. Cỡ quần áo Pháp nhỏ hơn Mỹ khoảng 1-2 size.",
    tip_advice_vi: "Luôn học từ 'taille' (cỡ/size). Các cụm quan trọng: 'trop grand/petit' (quá to/nhỏ), 'ça me va' (vừa với tôi), 'je peux essayer ?' (tôi thử được không?). Khi vào tiệm, chào 'bonjour' với nhân viên rồi mới xem hàng.",
    vocabulary: [
      { word: "la chemise", en: "shirt", vi: "áo sơ mi", pos: "noun (f)", pronunciation_vi: "la sơ-MIZ — 'e' cuối KHÔNG đọc" },
      { word: "le pantalon", en: "pants", vi: "quần dài", pos: "noun (m)", pronunciation_vi: "lơ păng-ta-LÔNG — 'an' âm mũi" },
      { word: "la robe", en: "dress", vi: "váy đầm", pos: "noun (f)", pronunciation_vi: "la RÓP — 'o' đọc 'ô' ngắn" },
      { word: "le manteau", en: "coat", vi: "áo khoác", pos: "noun (m)", pronunciation_vi: "lơ măng-TÔ — 'eau' đọc 'ô'" },
      { word: "les chaussures", en: "shoes", vi: "giày", pos: "noun (f pl)", pronunciation_vi: "lê sô-SUYR — 'au' đọc 'ô'" },
      { word: "le pull", en: "sweater", vi: "áo len", pos: "noun (m)", pronunciation_vi: "lơ PUYL — 'u' đọc 'uy'" },
      { word: "l'écharpe", en: "scarf", vi: "khăn quàng", pos: "noun (f)", pronunciation_vi: "lê-SÁC-P — 'é' đọc 'ê'" },
      { word: "le chapeau", en: "hat", vi: "mũ", pos: "noun (m)", pronunciation_vi: "lơ sa-PÔ — 'eau' đọc 'ô'" },
      { word: "la jupe", en: "skirt", vi: "chân váy", pos: "noun (f)", pronunciation_vi: "la DUYP — 'j' đọc 'd' mềm, 'u' đọc 'uy'" },
      { word: "essayer", en: "to try on", vi: "thử đồ", pos: "verb", pronunciation_vi: "ê-xê-YÊ — 'ay' đọc 'ê', 'er' đọc 'ê'" },
    ],
    dialogue: [
      { speaker: "A", text: "Bonjour, je peux vous aider ?", vi: "Chào chị, tôi giúp gì được ạ?" },
      { speaker: "B", text: "Oui, je cherche une veste pour l'automne.", vi: "Vâng, tôi đang tìm áo khoác cho mùa thu." },
      { speaker: "A", text: "Quelle taille faites-vous ?", vi: "Chị mặc cỡ nào ạ?" },
      { speaker: "B", text: "Du 38, je pense. Vous avez du noir ?", vi: "Cỡ 38 tôi nghĩ. Có màu đen không ạ?" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ chỉ quần áo:",
        pronunciation_focus: ["vêtements"],
        items: [
          { prompt: "Je porte un ___ (quần dài) noir.", answer: "pantalon" },
          { prompt: "Elle met une ___ (váy) rouge.", answer: "robe" },
          { prompt: "Où sont mes ___ (giày)?", answer: "chaussures" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối đồ vật với bộ phận cơ thể:",
        pronunciation_focus: ["accessoires"],
        items: [
          { prompt: "le chapeau", answer: "đầu" },
          { prompt: "l'écharpe", answer: "cổ" },
          { prompt: "les chaussures", answer: "chân" },
          { prompt: "les gants", answer: "tay" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Pháp:",
        pronunciation_focus: ["je cherche"],
        items: [
          { prompt: "Bao nhiêu tiền cái áo này?", answer: "Combien coûte cette chemise ?" },
          { prompt: "Tôi muốn thử cái váy này.", answer: "Je voudrais essayer cette robe." },
          { prompt: "Có cỡ to hơn không?", answer: "Avez-vous une taille plus grande ?" },
        ],
      },
    ],
  },
];

// ── 12. Transportation ──────────────────────────────────────────────────

const TRANSPORTATION: FrenchLesson[] = [
  {
    id: "french_transportation",
    level: "A1",
    category: "transportation",
    title_vi: "Giao thông và đi lại",
    title_en: "Transportation and getting around",
    sentences: [
      { en: "Où est la station de métro la plus proche ?", vi: "Ga tàu điện ngầm gần nhất ở đâu?", pronunciation_focus: ["station → xta-xi-ông", "métro → mê-trô", "proche → prót-s"] },
      { en: "Je voudrais un ticket aller-retour pour Lyon.", vi: "Tôi muốn mua vé khứ hồi đi Lyon.", pronunciation_focus: ["ticket → ti-ke", "aller-retour → a-lê-rơ-tua", "Lyon → li-ông"] },
      { en: "Le bus numéro 42 s'arrête ici.", vi: "Xe buýt số 42 dừng ở đây.", pronunciation_focus: ["bus → buyt", "numéro → nuy-mê-rô", "arrête → a-rét"] },
      { en: "À quelle heure part le prochain train ?", vi: "Chuyến tàu tiếp theo chạy lúc mấy giờ?", pronunciation_focus: ["quelle → ken", "part → pa-r", "prochain → prô-săng"] },
      { en: "Est-ce que ce taxi est libre ?", vi: "Taxi này có trống không ạ?", pronunciation_focus: ["est-ce que → ét-xkơ", "taxi → tăc-xi", "libre → líp-rờ"] },
    ],
    cultural_notes_vi: "Tàu điện ngầm Paris (métro) có 16 tuyến, rất dày đặc. Mua vé 'carnet' 10 vé rẻ hơn mua lẻ. Xe buýt cần bấm nút 'arrêt demandé' để xuống. TGV (tàu cao tốc) nối các thành phố lớn, nên đặt vé trước trên sncf-connect.com. Taxi ở Paris đắt và khó bắt ngoài đường.",
    tip_advice_vi: "Các câu quan trọng: 'un ticket, s'il vous plaît' (một vé), 'c'est direct ?' (có đi thẳng không?), 'je descends à la prochaine' (tôi xuống trạm tới). Học số tuyến metro/bus bằng tiếng Pháp — tài xế Pháp nói số rất nhanh.",
    vocabulary: [
      { word: "le métro", en: "subway", vi: "tàu điện ngầm", pos: "noun (m)", pronunciation_vi: "lơ mê-TRÔ — 'é' đọc 'ê'" },
      { word: "le bus", en: "bus", vi: "xe buýt", pos: "noun (m)", pronunciation_vi: "lơ BUYT — 'u' đọc 'uy', 's' KHÔNG đọc" },
      { word: "le train", en: "train", vi: "tàu hỏa", pos: "noun (m)", pronunciation_vi: "lơ TRANG — 'ain' âm mũi" },
      { word: "la gare", en: "train station", vi: "ga tàu", pos: "noun (f)", pronunciation_vi: "la GA — 'e' cuối KHÔNG đọc" },
      { word: "le billet", en: "ticket", vi: "vé", pos: "noun (m)", pronunciation_vi: "lơ bi-YÊ — 'ill' đọc 'y'" },
      { word: "la voiture", en: "car", vi: "xe hơi", pos: "noun (f)", pronunciation_vi: "la voa-TUYR — 'oi' đọc 'oa'" },
      { word: "l'avion", en: "airplane", vi: "máy bay", pos: "noun (m)", pronunciation_vi: "la-VI-ÔNG — 'a' ngắn, 'on' âm mũi" },
      { word: "le vélo", en: "bicycle", vi: "xe đạp", pos: "noun (m)", pronunciation_vi: "lơ vê-LÔ — 'é' đọc 'ê'" },
      { word: "à pied", en: "on foot", vi: "đi bộ", pos: "phrase", pronunciation_vi: "a PIÊ — 'd' KHÔNG đọc" },
      { word: "l'arrêt", en: "stop (bus/tram)", vi: "trạm dừng", pos: "noun (m)", pronunciation_vi: "la-RÊ — 'ê' dài" },
    ],
    dialogue: [
      { speaker: "A", text: "Excusez-moi, pour aller à la Tour Eiffel ?", vi: "Xin lỗi, đi Tháp Eiffel thế nào ạ?" },
      { speaker: "B", text: "Prenez le métro ligne 6, direction Charles de Gaulle-Étoile.", vi: "Bạn đi metro tuyến 6, hướng Charles de Gaulle-Étoile." },
      { speaker: "A", text: "Je descends à quelle station ?", vi: "Tôi xuống ga nào ạ?" },
      { speaker: "B", text: "Bir-Hakeim. C'est direct, environ quinze minutes.", vi: "Bir-Hakeim. Đi thẳng, khoảng 15 phút." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ chỉ phương tiện:",
        pronunciation_focus: ["transports"],
        items: [
          { prompt: "Je prends le ___ pour aller au travail. (tàu điện ngầm)", answer: "métro" },
          { prompt: "L'___ décolle à 14h. (máy bay)", answer: "avion" },
          { prompt: "Je vais au travail ___ (đi bộ).", answer: "à pied" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối phương tiện với địa điểm:",
        pronunciation_focus: ["où"],
        items: [
          { prompt: "le train", answer: "la gare" },
          { prompt: "l'avion", answer: "l'aéroport" },
          { prompt: "le bus", answer: "l'arrêt de bus" },
          { prompt: "le métro", answer: "la station" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Pháp:",
        pronunciation_focus: ["transports"],
        items: [
          { prompt: "Ga tàu gần nhất ở đâu?", answer: "Où est la gare la plus proche ?" },
          { prompt: "Tôi muốn một vé đi Paris.", answer: "Je voudrais un billet pour Paris." },
          { prompt: "Xe buýt số mấy đi trung tâm?", answer: "Quel bus va au centre-ville ?" },
        ],
      },
    ],
  },
];

// ── 13. House ───────────────────────────────────────────────────────────

const HOUSE: FrenchLesson[] = [
  {
    id: "french_house",
    level: "A1",
    category: "house",
    title_vi: "Nhà cửa và phòng ốc",
    title_en: "House and rooms",
    sentences: [
      { en: "J'habite dans un appartement au troisième étage.", vi: "Tôi sống trong một căn hộ ở tầng ba.", pronunciation_focus: ["j'habite → da-bít", "appartement → a-pa-rtơ-măn", "troisième → troa-di-em"] },
      { en: "La cuisine est à gauche, la salle de bain à droite.", vi: "Bếp ở bên trái, phòng tắm ở bên phải.", pronunciation_focus: ["cuisine → quy-din", "gauche → gô-s", "salle → san", "droite → đoát"] },
      { en: "Il y a une grande fenêtre dans le salon.", vi: "Có một cửa sổ lớn trong phòng khách.", pronunciation_focus: ["grande → grăngđ", "fenêtre → phơ-né-trơ", "salon → xa-lông"] },
      { en: "La chambre donne sur le jardin.", vi: "Phòng ngủ nhìn ra vườn.", pronunciation_focus: ["chambre → săm-brơ", "donne → đon", "jardin → da-đăng"] },
      { en: "Le loyer coûte 800 euros par mois.", vi: "Tiền thuê nhà 800 euro một tháng.", pronunciation_focus: ["loyer → loa-yê", "coûte → cút", "euros → ơ-rô", "mois → moa"] },
    ],
    cultural_notes_vi: "Người Pháp thích sống trong căn hộ hơn nhà riêng, đặc biệt ở thành phố. 'Appartement' thường được mô tả bằng số phòng: 'un trois-pièces' = căn hộ 3 phòng (không tính bếp và tắm). Tầng trệt gọi là 'rez-de-chaussée', tầng 1 là lên 1 cầu thang. Nhà vệ sinh và phòng tắm thường tách riêng ở Pháp.",
    tip_advice_vi: "Khi mô tả nhà, dùng 'il y a' (có) + danh từ. Khác biệt quan trọng: 'la salle de bain' (phòng tắm có bồn tắm) ≠ 'la salle d'eau' (phòng tắm chỉ có vòi sen). 'Les toilettes' luôn là danh từ số nhiều giống cái.",
    vocabulary: [
      { word: "la maison", en: "house", vi: "nhà", pos: "noun (f)", pronunciation_vi: "la me-DÔNG — 'ai' đọc 'ê', 'on' âm mũi" },
      { word: "l'appartement", en: "apartment", vi: "căn hộ", pos: "noun (m)", pronunciation_vi: "la-pa-rơ-tơ-MĂN — 'en' âm mũi" },
      { word: "la chambre", en: "bedroom", vi: "phòng ngủ", pos: "noun (f)", pronunciation_vi: "la SĂM-brơ — 'am' âm mũi" },
      { word: "la cuisine", en: "kitchen", vi: "nhà bếp", pos: "noun (f)", pronunciation_vi: "la quy-DIN — 'ui' đọc 'uy'" },
      { word: "le salon", en: "living room", vi: "phòng khách", pos: "noun (m)", pronunciation_vi: "lơ xa-LÔNG — 'on' âm mũi" },
      { word: "la salle de bain", en: "bathroom", vi: "phòng tắm", pos: "noun (f)", pronunciation_vi: "la san-đơ-BANG — 'ain' âm mũi" },
      { word: "la fenêtre", en: "window", vi: "cửa sổ", pos: "noun (f)", pronunciation_vi: "la phơ-NÉ-trơ — 'ê' dài" },
      { word: "la porte", en: "door", vi: "cửa", pos: "noun (f)", pronunciation_vi: "la PO-R-T — 'r' nhẹ, 'te' KHÔNG đọc rõ" },
      { word: "le jardin", en: "garden", vi: "vườn", pos: "noun (m)", pronunciation_vi: "lơ da-ĐANG — 'in' âm mũi" },
      { word: "l'étage", en: "floor / storey", vi: "tầng", pos: "noun (m)", pronunciation_vi: "lê-TA-D — 'é' đọc 'ê', 'ge' đọc 'd' mềm" },
    ],
    dialogue: [
      { speaker: "A", text: "Tu habites dans quel type de logement ?", vi: "Bạn sống ở loại nhà nào?" },
      { speaker: "B", text: "Un appartement avec deux chambres, au deuxième étage.", vi: "Căn hộ hai phòng ngủ, tầng hai." },
      { speaker: "A", text: "Il y a un balcon ?", vi: "Có ban công không?" },
      { speaker: "B", text: "Oui, un petit balcon qui donne sur la rue.", vi: "Có, một ban công nhỏ nhìn ra phố." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền tên phòng:",
        pronunciation_focus: ["pièces de la maison"],
        items: [
          { prompt: "Je dors dans la ___.", answer: "chambre" },
          { prompt: "On mange dans la ___.", answer: "cuisine" },
          { prompt: "Je prends une douche dans la ___.", answer: "salle de bain" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối phòng với đồ đạc:",
        pronunciation_focus: ["meubles"],
        items: [
          { prompt: "la chambre", answer: "un lit (giường)" },
          { prompt: "la cuisine", answer: "un four (lò nướng)" },
          { prompt: "le salon", answer: "un canapé (ghế sofa)" },
          { prompt: "la salle de bain", answer: "une douche (vòi sen)" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Pháp:",
        pronunciation_focus: ["logement"],
        items: [
          { prompt: "Tôi sống trong một căn hộ nhỏ.", answer: "J'habite dans un petit appartement." },
          { prompt: "Có một cửa sổ lớn trong phòng khách.", answer: "Il y a une grande fenêtre dans le salon." },
          { prompt: "Phòng ngủ của tôi ở tầng hai.", answer: "Ma chambre est au deuxième étage." },
        ],
      },
    ],
  },
];

// ── 14. Hobbies ─────────────────────────────────────────────────────────

const HOBBIES: FrenchLesson[] = [
  {
    id: "french_hobbies",
    level: "A1",
    category: "hobbies",
    title_vi: "Sở thích và hoạt động",
    title_en: "Hobbies and activities",
    sentences: [
      { en: "Qu'est-ce que tu aimes faire pendant ton temps libre ?", vi: "Bạn thích làm gì lúc rảnh?", pronunciation_focus: ["qu'est-ce que → két-xkơ", "aimes → em", "temps → tăm", "libre → líp-r"] },
      { en: "J'adore lire des romans et écouter de la musique.", vi: "Tôi rất thích đọc tiểu thuyết và nghe nhạc.", pronunciation_focus: ["j'adore → da-đo-r", "lire → li-r", "musique → muy-díc"] },
      { en: "Je joue au foot tous les samedis avec mes amis.", vi: "Tôi chơi bóng đá thứ Bảy hàng tuần với bạn.", pronunciation_focus: ["joue → du", "foot → phút", "samedis → xam-đi"] },
      { en: "Elle fait de la peinture et de la photo.", vi: "Cô ấy vẽ tranh và chụp ảnh.", pronunciation_focus: ["peinture → pang-tuy-r", "photo → phô-tô"] },
      { en: "Nous aimons voyager et découvrir de nouveaux endroits.", vi: "Chúng tôi thích du lịch và khám phá nơi mới.", pronunciation_focus: ["voyager → voa-ya-dê", "découvrir → đê-cu-vri-r", "nouveaux → nu-vô"] },
    ],
    cultural_notes_vi: "Người Pháp rất coi trọng thời gian rảnh (loisirs). Các sở thích phổ biến: đọc sách, xem phim, đi bảo tàng, nấu ăn, chơi thể thao. 'Faire du sport' là cụm chung cho chơi thể thao. 'Jouer à + môn thể thao' (bóng đá, tennis) và 'faire de + hoạt động' (bơi, trượt tuyết, yoga).",
    tip_advice_vi: "Phân biệt 'jouer à' (chơi môn thể thao/trò chơi) và 'jouer de' (chơi nhạc cụ): 'je joue au tennis' nhưng 'je joue du piano'. Học 5-6 động từ sở thích (aimer, adorer, détester, préférer) để mô tả gu của mình.",
    vocabulary: [
      { word: "lire", en: "to read", vi: "đọc", pos: "verb", pronunciation_vi: "LI-R — 'i' dài, 're' đọc nhẹ" },
      { word: "la musique", en: "music", vi: "âm nhạc", pos: "noun (f)", pronunciation_vi: "la muy-DÍC — 'u' đọc 'uy'" },
      { word: "le sport", en: "sport", vi: "thể thao", pos: "noun (m)", pronunciation_vi: "lơ XPO-R — 'r' nhẹ, 't' KHÔNG đọc" },
      { word: "le cinéma", en: "cinema / movies", vi: "rạp chiếu phim", pos: "noun (m)", pronunciation_vi: "lơ xi-nê-MA — 'é' đọc 'ê'" },
      { word: "le voyage", en: "travel / trip", vi: "chuyến du lịch", pos: "noun (m)", pronunciation_vi: "lơ voa-YA-D — 'ge' đọc 'd' mềm" },
      { word: "la cuisine (activité)", en: "cooking", vi: "nấu ăn", pos: "noun (f)", pronunciation_vi: "la quy-DIN" },
      { word: "la peinture", en: "painting", vi: "vẽ tranh", pos: "noun (f)", pronunciation_vi: "la pang-TUY-R — 'ein' âm mũi" },
      { word: "la danse", en: "dancing", vi: "nhảy múa", pos: "noun (f)", pronunciation_vi: "la ĐĂNG-X — 'an' âm mũi" },
      { word: "la randonnée", en: "hiking", vi: "đi bộ đường dài", pos: "noun (f)", pronunciation_vi: "la răn-đô-NÊ — 'an' âm mũi, 'nn' đọc kép" },
      { word: "jouer", en: "to play", vi: "chơi", pos: "verb", pronunciation_vi: "DU-Ê — 'j' đọc 'd' mềm, 'er' đọc 'ê'" },
    ],
    dialogue: [
      { speaker: "A", text: "Tu fais quoi le week-end ?", vi: "Cuối tuần bạn làm gì?" },
      { speaker: "B", text: "Souvent je fais du vélo ou je lis un bon livre.", vi: "Thường thì tôi đạp xe hoặc đọc sách." },
      { speaker: "A", text: "Moi, je joue au tennis le samedi matin.", vi: "Tôi thì chơi tennis sáng thứ Bảy." },
      { speaker: "B", text: "On pourrait jouer ensemble un jour !", vi: "Có hôm nào chơi cùng đi!" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền giới từ đúng (à / de):",
        pronunciation_focus: ["jouer à / de"],
        items: [
          { prompt: "Je joue ___ foot.", answer: "au", options: ["au", "du"] },
          { prompt: "Elle joue ___ piano.", answer: "du", options: ["au", "du"] },
          { prompt: "Nous jouons ___ tennis.", answer: "au", options: ["au", "du"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối động từ với sở thích:",
        pronunciation_focus: ["loisirs"],
        items: [
          { prompt: "lire", answer: "un roman" },
          { prompt: "regarder", answer: "un film" },
          { prompt: "écouter", answer: "de la musique" },
          { prompt: "faire", answer: "du sport" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Pháp:",
        pronunciation_focus: ["loisirs"],
        items: [
          { prompt: "Tôi thích đọc sách và nghe nhạc.", answer: "J'aime lire et écouter de la musique." },
          { prompt: "Bạn có chơi thể thao không?", answer: "Tu fais du sport ?" },
          { prompt: "Cuối tuần tôi thường đi bộ đường dài.", answer: "Le week-end, je fais souvent de la randonnée." },
        ],
      },
    ],
  },
];

// ── 15. Health ──────────────────────────────────────────────────────────

const HEALTH: FrenchLesson[] = [
  {
    id: "french_health",
    level: "A1",
    category: "health",
    title_vi: "Sức khỏe và cơ thể",
    title_en: "Health and the body",
    sentences: [
      { en: "Je ne me sens pas bien. J'ai mal à la tête.", vi: "Tôi thấy không khỏe. Tôi bị đau đầu.", pronunciation_focus: ["sens → săn", "mal → man", "tête → tét"] },
      { en: "Où avez-vous mal ? J'ai mal au ventre.", vi: "Bạn đau ở đâu? Tôi đau bụng.", pronunciation_focus: ["où → u", "avez → a-vê", "ventre → văng-trơ"] },
      { en: "Je dois prendre un rendez-vous chez le médecin.", vi: "Tôi cần đặt lịch hẹn bác sĩ.", pronunciation_focus: ["dois → đoa", "rendez-vous → răn-đê-vu", "médecin → mét-xăng"] },
      { en: "Il faut boire beaucoup d'eau quand il fait chaud.", vi: "Cần uống nhiều nước khi trời nóng.", pronunciation_focus: ["il faut → in phô", "boire → boa-r", "beaucoup → bô-cu"] },
      { en: "Je suis fatigué, je n'ai pas bien dormi.", vi: "Tôi mệt, tôi ngủ không ngon.", pronunciation_focus: ["fatigué → fa-ti-ghê", "dormi → đoa-mi", "bien → bi-ăng"] },
    ],
    cultural_notes_vi: "Hệ thống y tế Pháp được đánh giá tốt nhất thế giới. Mọi người có 'carte vitale' (thẻ bảo hiểm y tế). Khi đi khám, bạn trả tiền trước rồi được hoàn lại sau. Nhà thuốc (pharmacie) có đèn chữ thập xanh bên ngoài, mở cửa cả Chủ Nhật theo lịch luân phiên.",
    tip_advice_vi: "Cấu trúc quan trọng: 'avoir mal à + bộ phận cơ thể' (bị đau...). 'J'ai mal à la tête / au ventre / au dos / aux dents'. Đừng dịch 'I have a headache' thành 'J'ai un mal de tête' — nói 'J'ai mal à la tête' tự nhiên hơn.",
    vocabulary: [
      { word: "la tête", en: "head", vi: "đầu", pos: "noun (f)", pronunciation_vi: "la TÉT — 'ê' dài, 'e' cuối KHÔNG đọc" },
      { word: "le ventre", en: "stomach", vi: "bụng", pos: "noun (m)", pronunciation_vi: "lơ VĂNG-trờ — 'en' âm mũi" },
      { word: "le dos", en: "back", vi: "lưng", pos: "noun (m)", pronunciation_vi: "lơ ĐÔ — 's' KHÔNG đọc" },
      { word: "le bras", en: "arm", vi: "cánh tay", pos: "noun (m)", pronunciation_vi: "lơ BRA — 's' KHÔNG đọc" },
      { word: "la jambe", en: "leg", vi: "chân", pos: "noun (f)", pronunciation_vi: "la DĂNG-B — 'am' âm mũi" },
      { word: "le médecin", en: "doctor", vi: "bác sĩ", pos: "noun (m)", pronunciation_vi: "lơ MÉT-XĂNG — 'é' đọc 'ê', 'in' âm mũi" },
      { word: "la pharmacie", en: "pharmacy", vi: "nhà thuốc", pos: "noun (f)", pronunciation_vi: "la pha-ma-XI — 'ph' đọc 'ph'" },
      { word: "le médicament", en: "medicine", vi: "thuốc", pos: "noun (m)", pronunciation_vi: "lơ mê-đi-ca-MĂN — 'en' âm mũi" },
      { word: "malade", en: "sick", vi: "ốm / bệnh", pos: "adjective", pronunciation_vi: "ma-LÁT — 'a' ngắn, 'de' KHÔNG đọc rõ" },
      { word: "la fièvre", en: "fever", vi: "sốt", pos: "noun (f)", pronunciation_vi: "la PHI-E-V-RỜ — 'è' đọc 'e' mở" },
    ],
    dialogue: [
      { speaker: "A", text: "Bonjour docteur, je ne me sens pas bien.", vi: "Chào bác sĩ, tôi thấy không khỏe." },
      { speaker: "B", text: "Qu'est-ce qui ne va pas ?", vi: "Bị sao thế?" },
      { speaker: "A", text: "J'ai mal à la gorge et j'ai de la fièvre.", vi: "Tôi đau họng và bị sốt." },
      { speaker: "B", text: "Ouvrez la bouche, je vais regarder.", vi: "Há miệng ra, tôi xem nào." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền bộ phận cơ thể:",
        pronunciation_focus: ["avoir mal à"],
        items: [
          { prompt: "J'ai mal à la ___. (đầu)", answer: "tête" },
          { prompt: "Il a mal au ___. (bụng)", answer: "ventre" },
          { prompt: "Elle a mal au ___. (lưng)", answer: "dos" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối triệu chứng với lời khuyên:",
        pronunciation_focus: ["santé"],
        items: [
          { prompt: "J'ai mal à la tête.", answer: "Prenez un cachet." },
          { prompt: "J'ai de la fièvre.", answer: "Reposez-vous." },
          { prompt: "J'ai mal aux dents.", answer: "Allez chez le dentiste." },
          { prompt: "Je suis fatigué.", answer: "Dormez plus." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Pháp:",
        pronunciation_focus: ["avoir mal"],
        items: [
          { prompt: "Tôi bị đau bụng.", answer: "J'ai mal au ventre." },
          { prompt: "Bạn có bị sốt không?", answer: "Vous avez de la fièvre ?" },
          { prompt: "Tôi cần đi khám bác sĩ.", answer: "Je dois voir un médecin." },
        ],
      },
    ],
  },
];

// ── 16. Work ────────────────────────────────────────────────────────────

const WORK: FrenchLesson[] = [
  {
    id: "french_work",
    level: "A1",
    category: "work",
    title_vi: "Công việc và nghề nghiệp",
    title_en: "Work and professions",
    sentences: [
      { en: "Qu'est-ce que vous faites dans la vie ?", vi: "Bạn làm nghề gì?", pronunciation_focus: ["qu'est-ce que → két-xkơ", "faites → phét", "vie → vi"] },
      { en: "Je suis ingénieur dans une entreprise à Paris.", vi: "Tôi là kỹ sư trong một công ty ở Paris.", pronunciation_focus: ["ingénieur → anh-dê-ni-ơr", "entreprise → ăng-trờ-priz"] },
      { en: "Je travaille à plein temps, du lundi au vendredi.", vi: "Tôi làm toàn thời gian, từ thứ Hai đến thứ Sáu.", pronunciation_focus: ["travaille → tra-vay", "plein → plang", "temps → tăm"] },
      { en: "Mon travail est intéressant mais parfois stressant.", vi: "Công việc của tôi thú vị nhưng đôi khi căng thẳng.", pronunciation_focus: ["intéressant → anh-tê-rê-xăng", "stressant → xtrê-xăng"] },
      { en: "Je cherche un emploi dans le marketing.", vi: "Tôi đang tìm việc trong ngành marketing.", pronunciation_focus: ["cherche → se-r-s", "emploi → ăng-ploa", "marketing → ma-r-kờ-ting"] },
    ],
    cultural_notes_vi: "Tuần làm việc ở Pháp là 35 giờ theo luật. Nghỉ phép có lương tối thiểu 5 tuần/năm. Người Pháp không nói về lương khi mới gặp — đó là chủ đề riêng tư. Phỏng vấn xin việc ở Pháp thường có 'lettre de motivation' (thư xin việc) bắt buộc kèm CV.",
    tip_advice_vi: "Phân biệt 'un métier' (nghề) và 'un travail' (công việc cụ thể). Khi giới thiệu nghề, nói 'Je suis + nghề' (không có mạo từ): 'Je suis médecin'. Nếu là nữ, một số nghề thêm -e: 'Je suis avocate' (nữ luật sư).",
    vocabulary: [
      { word: "le travail", en: "work / job", vi: "công việc", pos: "noun (m)", pronunciation_vi: "lơ tra-VAY — 'ail' đọc 'ay'" },
      { word: "le métier", en: "profession / trade", vi: "nghề", pos: "noun (m)", pronunciation_vi: "lơ mê-TIÊ — 'é' đọc 'ê'" },
      { word: "l'entreprise", en: "company", vi: "công ty", pos: "noun (f)", pronunciation_vi: "lăng-trờ-PRIZ — 'en' âm mũi" },
      { word: "le bureau", en: "office", vi: "văn phòng", pos: "noun (m)", pronunciation_vi: "lơ buy-RÔ — 'u' đọc 'uy'" },
      { word: "le collègue", en: "colleague", vi: "đồng nghiệp", pos: "noun (m/f)", pronunciation_vi: "lơ co-LÉG — 'è' đọc 'e' mở" },
      { word: "le salaire", en: "salary", vi: "lương", pos: "noun (m)", pronunciation_vi: "lơ xa-LE-R — 'ai' đọc 'ê'" },
      { word: "l'entretien", en: "interview", vi: "phỏng vấn", pos: "noun (m)", pronunciation_vi: "lăng-trờ-TI-ĂNG — 'ien' âm mũi" },
      { word: "le CV", en: "resume / CV", vi: "sơ yếu lý lịch", pos: "noun (m)", pronunciation_vi: "lơ xê-VÊ — đọc như tiếng Anh" },
      { word: "à plein temps", en: "full-time", vi: "toàn thời gian", pos: "adverb", pronunciation_vi: "a plang TĂM" },
      { word: "embaucher", en: "to hire", vi: "tuyển dụng", pos: "verb", pronunciation_vi: "ăm-bô-SÊ — 'au' đọc 'ô'" },
    ],
    dialogue: [
      { speaker: "A", text: "Alors, tu fais quoi comme travail ?", vi: "Thế, bạn làm công việc gì?" },
      { speaker: "B", text: "Je suis comptable dans une boîte à Lyon.", vi: "Tôi là kế toán ở một công ty ở Lyon." },
      { speaker: "A", text: "Ça te plaît ?", vi: "Bạn thích không?" },
      { speaker: "B", text: "Oui, l'équipe est sympa et le boulot est varié.", vi: "Có, đồng nghiệp vui vẻ và công việc đa dạng." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền nghề nghiệp:",
        pronunciation_focus: ["métiers"],
        items: [
          { prompt: "Elle est ___ (giáo viên - nữ).", answer: "professeure" },
          { prompt: "Il est ___ (kỹ sư).", answer: "ingénieur" },
          { prompt: "Je suis ___ (bác sĩ).", answer: "médecin" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối nghề với nơi làm việc:",
        pronunciation_focus: ["professions"],
        items: [
          { prompt: "le médecin", answer: "l'hôpital" },
          { prompt: "le professeur", answer: "l'école" },
          { prompt: "le cuisinier", answer: "le restaurant" },
          { prompt: "l'ingénieur", answer: "le bureau" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Pháp:",
        pronunciation_focus: ["travail"],
        items: [
          { prompt: "Bạn làm nghề gì?", answer: "Qu'est-ce que vous faites dans la vie ?" },
          { prompt: "Tôi làm toàn thời gian.", answer: "Je travaille à plein temps." },
          { prompt: "Tôi đang tìm việc.", answer: "Je cherche un emploi." },
        ],
      },
    ],
  },
];

// ── 17. Travel ──────────────────────────────────────────────────────────

const TRAVEL: FrenchLesson[] = [
  {
    id: "french_travel",
    level: "A1",
    category: "travel",
    title_vi: "Du lịch và khách sạn",
    title_en: "Travel and hotels",
    sentences: [
      { en: "Je voudrais réserver une chambre pour deux nuits.", vi: "Tôi muốn đặt một phòng cho hai đêm.", pronunciation_focus: ["réserver → rê-de-r-vê", "chambre → săm-brơ", "nuits → nuy"] },
      { en: "Avez-vous une chambre avec vue sur la mer ?", vi: "Có phòng nhìn ra biển không ạ?", pronunciation_focus: ["avez → a-vê", "vue → vuy", "mer → me-r"] },
      { en: "Où est l'aéroport ? C'est loin d'ici ?", vi: "Sân bay ở đâu? Có xa đây không?", pronunciation_focus: ["aéroport → a-ê-rô-po-r", "loin → loang", "ici → i-xi"] },
      { en: "Je voudrais louer une voiture pour une semaine.", vi: "Tôi muốn thuê xe hơi một tuần.", pronunciation_focus: ["louer → lu-ê", "voiture → voa-tuy-r", "semaine → sờ-men"] },
      { en: "Pouvez-vous me recommander un bon restaurant ?", vi: "Bạn giới thiệu cho tôi nhà hàng ngon được không?", pronunciation_focus: ["recommander → rơ-co-măng-đê", "restaurant → ré-xtô-răng"] },
    ],
    cultural_notes_vi: "Pháp là nước đón nhiều khách du lịch nhất thế giới (>80 triệu/năm). Khách sạn Pháp phân hạng sao (1-5 étoiles), nhưng nhà nghỉ B&B (chambres d'hôtes) cũng rất phổ biến. Khi vào nhà hàng, đợi được chỉ bàn — không tự ý ngồi. Ở nhiều nơi, bạn phải yêu cầu hóa đơn, nhà hàng sẽ không tự động mang ra.",
    tip_advice_vi: "Học cách đặt phòng qua điện thoại: nói rõ ngày đến (arrivée), ngày đi (départ), số người, loại giường (un grand lit = giường đôi, deux lits simples = hai giường đơn). Hỏi giá 'petit-déjeuner inclus ?' (có gồm bữa sáng không?) vì nhiều khách sạn tính riêng.",
    vocabulary: [
      { word: "l'hôtel", en: "hotel", vi: "khách sạn", pos: "noun (m)", pronunciation_vi: "lô-TEN — 'ô' dài, 'l' cuối đọc nhẹ" },
      { word: "la chambre", en: "room", vi: "phòng", pos: "noun (f)", pronunciation_vi: "la SĂM-brơ — 'am' âm mũi" },
      { word: "la réservation", en: "reservation", vi: "đặt chỗ", pos: "noun (f)", pronunciation_vi: "la rê-de-r-va-XI-ÔNG" },
      { word: "l'aéroport", en: "airport", vi: "sân bay", pos: "noun (m)", pronunciation_vi: "la-ê-rô-PO-R — 'r' cuối nhẹ" },
      { word: "le passeport", en: "passport", vi: "hộ chiếu", pos: "noun (m)", pronunciation_vi: "lơ pát-xơ-PO-R" },
      { word: "la valise", en: "suitcase", vi: "va li", pos: "noun (f)", pronunciation_vi: "la va-LIZ — 'i' đọc 'i', 'se' đọc 'z'" },
      { word: "le plan", en: "map", vi: "bản đồ", pos: "noun (m)", pronunciation_vi: "lơ PLĂN — 'an' âm mũi" },
      { word: "la plage", en: "beach", vi: "bãi biển", pos: "noun (f)", pronunciation_vi: "la PLA-D — 'ge' đọc 'd' mềm" },
      { word: "le musée", en: "museum", vi: "bảo tàng", pos: "noun (m)", pronunciation_vi: "lơ muy-DÊ — 'u' đọc 'uy', 'é' đọc 'ê'" },
      { word: "visiter", en: "to visit", vi: "tham quan", pos: "verb", pronunciation_vi: "vi-di-TÊ — 'er' đọc 'ê'" },
    ],
    dialogue: [
      { speaker: "A", text: "Bonjour, vous avez une chambre de libre ?", vi: "Chào anh, có phòng trống không ạ?" },
      { speaker: "B", text: "Oui, pour combien de nuits ?", vi: "Có, cho mấy đêm ạ?" },
      { speaker: "A", text: "Deux nuits, avec petit-déjeuner si possible.", vi: "Hai đêm, có bữa sáng nếu được." },
      { speaker: "B", text: "Très bien, je vous fais une chambre avec vue sur le parc.", vi: "Rất tốt, tôi sắp phòng nhìn ra công viên cho anh." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ du lịch:",
        pronunciation_focus: ["voyage"],
        items: [
          { prompt: "Je voudrais ___ une chambre. (đặt)", answer: "réserver" },
          { prompt: "Où est l'___ ? (sân bay)", answer: "aéroport" },
          { prompt: "Avez-vous un ___ de la ville ? (bản đồ)", answer: "plan" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối địa điểm với hoạt động:",
        pronunciation_focus: ["tourisme"],
        items: [
          { prompt: "le musée", answer: "regarder des tableaux" },
          { prompt: "la plage", answer: "nager" },
          { prompt: "le restaurant", answer: "manger" },
          { prompt: "la gare", answer: "prendre le train" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Pháp:",
        pronunciation_focus: ["hôtel"],
        items: [
          { prompt: "Tôi muốn đặt phòng khách sạn.", answer: "Je voudrais réserver une chambre d'hôtel." },
          { prompt: "Bao nhiêu tiền một đêm?", answer: "C'est combien par nuit ?" },
          { prompt: "Sân bay ở đâu?", answer: "Où est l'aéroport ?" },
        ],
      },
    ],
  },
];

// ── 18. Emotions ────────────────────────────────────────────────────────

const EMOTIONS: FrenchLesson[] = [
  {
    id: "french_emotions",
    level: "A1",
    category: "emotions",
    title_vi: "Cảm xúc và tâm trạng",
    title_en: "Emotions and feelings",
    sentences: [
      { en: "Comment tu te sens aujourd'hui ?", vi: "Hôm nay bạn cảm thấy thế nào?", pronunciation_focus: ["comment → co-măng", "sens → săn", "aujourd'hui → ô-dua-đuy"] },
      { en: "Je suis très content parce qu'il fait beau.", vi: "Tôi rất vui vì trời đẹp.", pronunciation_focus: ["content → công-tăng", "parce que → pa-rx-kơ", "beau → bô"] },
      { en: "Elle est triste à cause du mauvais temps.", vi: "Cô ấy buồn vì thời tiết xấu.", pronunciation_focus: ["triste → trí-xt", "cause → cô-d", "mauvais → mô-ve"] },
      { en: "Je suis stressé avant mon examen.", vi: "Tôi căng thẳng trước kỳ thi.", pronunciation_focus: ["stressé → xtrê-xê", "avant → a-văng", "examen → ég-da-măng"] },
      { en: "Ne t'inquiète pas, tout va bien se passer.", vi: "Đừng lo, mọi chuyện sẽ ổn thôi.", pronunciation_focus: ["inquiète → anh-ki-ét", "tout → tu", "passer → pa-xê"] },
    ],
    cultural_notes_vi: "Người Pháp thể hiện cảm xúc khá trực tiếp — họ không ngại nói 'je suis triste' hay 'je suis en colère'. Hôn má (la bise) là cách chào hỏi hàng ngày, kể cả giữa nam giới. Người Pháp hay phàn nàn (râler) — đó gần như là môn thể thao quốc gia, không nhất thiết nghĩa là họ thực sự khó chịu.",
    tip_advice_vi: "Phân biệt 'être + tính từ' (trạng thái tạm thời: 'je suis fatigué') với 'être + danh từ' (bản chất: 'je suis une personne calme'). Học cặp cảm xúc đối lập: content/triste (vui/buồn), calme/énervé (bình tĩnh/bực), enthousiaste/déçu (hào hứng/thất vọng).",
    vocabulary: [
      { word: "content(e)", en: "happy / glad", vi: "vui", pos: "adjective", pronunciation_vi: "công-TĂNG(T) — 'en' âm mũi, thêm 't' cho nữ" },
      { word: "triste", en: "sad", vi: "buồn", pos: "adjective", pronunciation_vi: "TRÍT-XT — 'i' ngắn, 'e' cuối KHÔNG đọc" },
      { word: "en colère", en: "angry", vi: "tức giận", pos: "adjective", pronunciation_vi: "ăng co-LE-R — 'è' đọc 'e' mở" },
      { word: "fatigué(e)", en: "tired", vi: "mệt", pos: "adjective", pronunciation_vi: "pha-ti-GHÊ — 'é' đọc 'ê'" },
      { word: "stressé(e)", en: "stressed", vi: "căng thẳng", pos: "adjective", pronunciation_vi: "xtrê-XÊ" },
      { word: "inquiet / inquiète", en: "worried", vi: "lo lắng", pos: "adjective", pronunciation_vi: "anh-KIÊ / anh-KI-ÉT" },
      { word: "surpris(e)", en: "surprised", vi: "ngạc nhiên", pos: "adjective", pronunciation_vi: "xuy-rơ-PRI(Z) — 'u' đọc 'uy'" },
      { word: "déçu(e)", en: "disappointed", vi: "thất vọng", pos: "adjective", pronunciation_vi: "đê-SUY — 'é' đọc 'ê', 'ç' đọc 'x'" },
      { word: "calme", en: "calm", vi: "bình tĩnh", pos: "adjective", pronunciation_vi: "CAN-M — 'al' đọc 'an', 'e' KHÔNG đọc" },
      { word: "amoureux / amoureuse", en: "in love", vi: "đang yêu", pos: "adjective", pronunciation_vi: "a-mu-RƠ / a-mu-RƠ-Z — 'ou' đọc 'u'" },
    ],
    dialogue: [
      { speaker: "A", text: "Tu as l'air fatigué, ça va ?", vi: "Trông bạn mệt thế, ổn không?" },
      { speaker: "B", text: "Oui, j'ai mal dormi. Je suis un peu stressé par le boulot.", vi: "Ừ, tôi ngủ không ngon. Hơi căng thẳng vì công việc." },
      { speaker: "A", text: "Je comprends. Si tu veux en parler, je suis là.", vi: "Tôi hiểu. Nếu muốn nói chuyện, tôi ở đây." },
      { speaker: "B", text: "Merci, c'est gentil. Ça va aller.", vi: "Cảm ơn, tốt bụng quá. Sẽ ổn thôi." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cảm xúc phù hợp:",
        pronunciation_focus: ["émotions"],
        items: [
          { prompt: "Il a gagné, il est très ___. (vui)", answer: "content" },
          { prompt: "Elle a perdu son chat, elle est ___. (buồn)", answer: "triste" },
          { prompt: "Je n'ai pas dormi, je suis ___. (mệt)", answer: "fatigué" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối cảm xúc với tình huống:",
        pronunciation_focus: ["sentiments"],
        items: [
          { prompt: "content", answer: "recevoir un cadeau" },
          { prompt: "en colère", answer: "quelqu'un est en retard" },
          { prompt: "surpris", answer: "une fête inattendue" },
          { prompt: "inquiet", answer: "un examen demain" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Pháp:",
        pronunciation_focus: ["être + adjectif"],
        items: [
          { prompt: "Hôm nay tôi rất vui.", answer: "Aujourd'hui, je suis très content(e)." },
          { prompt: "Cô ấy đang lo lắng.", answer: "Elle est inquiète." },
          { prompt: "Đừng giận, không sao đâu.", answer: "Ne sois pas en colère, ce n'est rien." },
        ],
      },
    ],
  },
];

// ── 19. Past Tense ─────────────────────────────────────────────────────

const PAST_TENSE: FrenchLesson[] = [
  {
    id: "french_past_tense",
    level: "A1",
    category: "past_tense",
    title_vi: "Thì quá khứ (passé composé)",
    title_en: "Past tense (passé composé)",
    sentences: [
      { en: "Hier, j'ai mangé au restaurant avec des amis.", vi: "Hôm qua tôi đã ăn ở nhà hàng với bạn.", pronunciation_focus: ["hier → y-e", "mangé → măng-dê", "au → ô"] },
      { en: "Qu'est-ce que tu as fait le week-end dernier ?", vi: "Cuối tuần trước bạn đã làm gì?", pronunciation_focus: ["qu'est-ce que → két-xkơ", "fait → phe", "dernier → đe-r-niê"] },
      { en: "Nous sommes allés au cinéma et nous avons vu un bon film.", vi: "Chúng tôi đã đi xem phim và xem một bộ phim hay.", pronunciation_focus: ["allés → a-lê", "cinéma → xi-nê-ma", "vu → vuy"] },
      { en: "Elle est née en 1995 à Marseille.", vi: "Cô ấy sinh năm 1995 ở Marseille.", pronunciation_focus: ["née → nê", "Marseille → ma-xây"] },
      { en: "J'ai déjà visité Paris, mais je n'ai pas encore vu Lyon.", vi: "Tôi đã từng thăm Paris nhưng chưa thấy Lyon.", pronunciation_focus: ["déjà → đê-da", "visité → vi-di-tê", "encore → ăng-co-r"] },
    ],
    cultural_notes_vi: "Tiếng Pháp có hai thì quá khứ chính: 'passé composé' (hành động đã hoàn thành) và 'imparfait' (mô tả / thói quen trong quá khứ). Trong hội thoại hàng ngày, 'passé composé' được dùng nhiều nhất. Hầu hết động từ dùng 'avoir' làm trợ động từ; khoảng 17 động từ dùng 'être' (đi, đến, sinh, chết, ở lại, lên, xuống...).",
    tip_advice_vi: "Công thức passé composé: (avoir/être hiện tại) + (quá khứ phân từ). Mẹo nhớ động từ 'être': DR MRS VANDERTRAMP (Devenir, Revenir, Monter, Rester, Sortir, Venir, Aller, Naître, Descendre, Entrer, Rentrer, Tomber, Retourner, Arriver, Mourir, Partir). Với 'être', quá khứ phân từ phải hợp giống số với chủ ngữ: 'elle est allée' (thêm -e cho nữ).",
    vocabulary: [
      { word: "hier", en: "yesterday", vi: "hôm qua", pos: "adverb", pronunciation_vi: "Y-E — 'h' KHÔNG đọc, 'ier' đọc 'iê'" },
      { word: "avant-hier", en: "the day before yesterday", vi: "hôm kia", pos: "adverb", pronunciation_vi: "a-văng-ti-E — 'h' KHÔNG đọc" },
      { word: "la semaine dernière", en: "last week", vi: "tuần trước", pos: "phrase", pronunciation_vi: "la sờ-men đe-r-NI-E-R" },
      { word: "déjà", en: "already", vi: "đã... rồi", pos: "adverb", pronunciation_vi: "đê-DA — 'é' đọc 'ê'" },
      { word: "jamais", en: "never", vi: "chưa bao giờ", pos: "adverb", pronunciation_vi: "da-ME — 'ai' đọc 'ê', 's' KHÔNG đọc" },
      { word: "allé(e)", en: "went (past participle)", vi: "đã đi", pos: "verb (pp)", pronunciation_vi: "a-LÊ — nhấn cuối" },
      { word: "fait", en: "did / made (pp)", vi: "đã làm", pos: "verb (pp)", pronunciation_vi: "PHE — 'ai' đọc 'ê', 't' KHÔNG đọc" },
      { word: "vu(e)", en: "saw (pp)", vi: "đã thấy", pos: "verb (pp)", pronunciation_vi: "VUY — 'u' đọc 'uy'" },
      { word: "pris(e)", en: "took (pp)", vi: "đã lấy", pos: "verb (pp)", pronunciation_vi: "PRI(Z) — thêm 'z' cho giống cái" },
      { word: "né(e)", en: "born (pp)", vi: "đã sinh ra", pos: "verb (pp)", pronunciation_vi: "NÊ — 'é' đọc 'ê'" },
    ],
    dialogue: [
      { speaker: "A", text: "Tu as passé un bon week-end ?", vi: "Cuối tuần bạn vui không?" },
      { speaker: "B", text: "Oui, super ! Je suis allé à la mer avec ma famille.", vi: "Có, tuyệt lắm! Tôi đã đi biển với gia đình." },
      { speaker: "A", text: "Vous avez nagé ?", vi: "Các bạn có bơi không?" },
      { speaker: "B", text: "Oui, on a nagé et on a mangé des fruits de mer.", vi: "Có, tụi tôi đã bơi và ăn hải sản." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền trợ động từ đúng (avoir / être):",
        pronunciation_focus: ["passé composé"],
        items: [
          { prompt: "J'___ mangé une pizza. (avoir)", answer: "ai" },
          { prompt: "Elle ___ allée au marché. (être)", answer: "est" },
          { prompt: "Nous ___ pris le train. (avoir)", answer: "avons" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối nguyên mẫu với quá khứ phân từ:",
        pronunciation_focus: ["participes passés"],
        items: [
          { prompt: "manger", answer: "mangé" },
          { prompt: "aller", answer: "allé" },
          { prompt: "voir", answer: "vu" },
          { prompt: "prendre", answer: "pris" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Pháp (dùng passé composé):",
        pronunciation_focus: ["passé composé"],
        items: [
          { prompt: "Hôm qua tôi đã đi Paris.", answer: "Hier, je suis allé(e) à Paris." },
          { prompt: "Cô ấy đã ăn bánh mì.", answer: "Elle a mangé une baguette." },
          { prompt: "Chúng tôi đã xem bộ phim đó.", answer: "Nous avons vu ce film." },
        ],
      },
    ],
  },
];

// ── 20. Future Plans ────────────────────────────────────────────────────

const FUTURE_PLANS: FrenchLesson[] = [
  {
    id: "french_future_plans",
    level: "A1",
    category: "future_plans",
    title_vi: "Kế hoạch tương lai (futur proche)",
    title_en: "Future plans (near future)",
    sentences: [
      { en: "Qu'est-ce que tu vas faire ce soir ?", vi: "Tối nay bạn sẽ làm gì?", pronunciation_focus: ["qu'est-ce que → két-xkơ", "vas → va", "faire → phe-r", "soir → xoa"] },
      { en: "Je vais regarder un film et me reposer.", vi: "Tôi sẽ xem phim và nghỉ ngơi.", pronunciation_focus: ["vais → ve", "regarder → rơ-ga-đê", "reposer → rơ-pô-dê"] },
      { en: "L'année prochaine, nous allons déménager à Lyon.", vi: "Năm tới, chúng tôi sẽ chuyển nhà tới Lyon.", pronunciation_focus: ["prochaine → prô-sen", "déménager → đê-mê-na-dê"] },
      { en: "Je vais étudier le français plus sérieusement.", vi: "Tôi sẽ học tiếng Pháp nghiêm túc hơn.", pronunciation_focus: ["étudier → ê-tuy-đi-ê", "sérieusement → xê-ri-ơ-do-măng"] },
      { en: "Tu vas partir en vacances quand ?", vi: "Bạn sẽ đi nghỉ mát khi nào?", pronunciation_focus: ["partir → pa-ti-r", "vacances → va-căng-x", "quand → kăng"] },
    ],
    cultural_notes_vi: "Người Pháp thường dùng 'futur proche' (aller + nguyên mẫu) thay vì 'futur simple' trong hội thoại hàng ngày. Đó là cấu trúc dễ học nhất để nói về tương lai gần. 'Futur simple' (je parlerai, tu finiras...) dùng trong văn viết và kế hoạch xa hơn. Người Pháp lên kế hoạch nghỉ hè (grandes vacances) từ rất sớm — thường đặt từ tháng 1-2 cho tháng 7-8.",
    tip_advice_vi: "Công thức futur proche cực đơn giản: 'aller' (chia theo chủ ngữ) + động từ nguyên mẫu. Je vais + manger = tôi sẽ ăn. Không cần học cách chia mới cho động từ chính! Dùng cho mọi kế hoạch ngắn hạn: 'je vais...', 'tu vas...', 'on va...'",
    vocabulary: [
      { word: "ce soir", en: "tonight", vi: "tối nay", pos: "adverb", pronunciation_vi: "xơ XOA — 'oi' đọc 'oa'" },
      { word: "demain", en: "tomorrow", vi: "ngày mai", pos: "adverb", pronunciation_vi: "đơ-MANG — 'ain' âm mũi" },
      { word: "la semaine prochaine", en: "next week", vi: "tuần tới", pos: "phrase", pronunciation_vi: "la sờ-men prô-SEN" },
      { word: "l'année prochaine", en: "next year", vi: "năm tới", pos: "phrase", pronunciation_vi: "la-nê prô-SEN" },
      { word: "bientôt", en: "soon", vi: "sớm", pos: "adverb", pronunciation_vi: "bi-ăng-TÔ — 'ien' âm mũi" },
      { word: "plus tard", en: "later", vi: "sau / lát nữa", pos: "adverb", pronunciation_vi: "pluy TA-R — 's' KHÔNG đọc" },
      { word: "déménager", en: "to move (house)", vi: "chuyển nhà", pos: "verb", pronunciation_vi: "đê-mê-na-DÊ — 'é' đọc 'ê'" },
      { word: "étudier", en: "to study", vi: "học", pos: "verb", pronunciation_vi: "ê-tuy-ĐI-Ê — 'u' đọc 'uy'" },
      { word: "apprendre", en: "to learn", vi: "học / học được", pos: "verb", pronunciation_vi: "a-PRĂNG-đrơ — 'en' âm mũi" },
      { word: "économiser", en: "to save (money)", vi: "tiết kiệm", pos: "verb", pronunciation_vi: "ê-cô-nô-mi-DÊ" },
    ],
    dialogue: [
      { speaker: "A", text: "Tu as des projets pour les vacances ?", vi: "Bạn có kế hoạch gì cho kỳ nghỉ không?" },
      { speaker: "B", text: "Oui, je vais partir au Vietnam !", vi: "Có, tôi sẽ đi Việt Nam!" },
      { speaker: "A", text: "Super ! Tu vas rester combien de temps ?", vi: "Tuyệt! Bạn sẽ ở bao lâu?" },
      { speaker: "B", text: "Je vais y passer trois semaines, je suis trop impatient !", vi: "Tôi sẽ ở đó ba tuần, nóng lòng quá!" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền dạng đúng của 'aller':",
        pronunciation_focus: ["futur proche"],
        items: [
          { prompt: "Je ___ manger une pizza. (sẽ ăn)", answer: "vais" },
          { prompt: "Tu ___ étudier ce soir ? (sẽ học)", answer: "vas" },
          { prompt: "Nous ___ partir demain. (sẽ đi)", answer: "allons" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối câu hỏi với câu trả lời:",
        pronunciation_focus: ["projets"],
        items: [
          { prompt: "Tu vas faire quoi ce soir ?", answer: "Je vais me reposer." },
          { prompt: "Vous allez où en vacances ?", answer: "Nous allons à la mer." },
          { prompt: "Elle va étudier quoi ?", answer: "Elle va étudier la médecine." },
          { prompt: "Quand est-ce que tu vas déménager ?", answer: "Je vais déménager l'année prochaine." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Pháp (dùng futur proche):",
        pronunciation_focus: ["aller + infinitif"],
        items: [
          { prompt: "Tối nay tôi sẽ xem phim.", answer: "Ce soir, je vais regarder un film." },
          { prompt: "Năm tới họ sẽ đi Pháp.", answer: "L'année prochaine, ils vont partir en France." },
          { prompt: "Bạn sẽ học tiếng Pháp chứ?", answer: "Tu vas apprendre le français ?" },
        ],
      },
    ],
  },
];

// ── Aggregate export ────────────────────────────────────────────────────

// 10 French B1 lessons for mercyB format - WORKPLACE + LIFE_ADMIN
const WORKPLACE: FrenchLesson[] = [
  {
    id: "french_workplace_phone", level: "A2", category: "workplace", title_vi: "Gọi điện thoại công việc", title_en: "Business phone calls",
    sentences: [
      { en: "Allô, bonjour, pourrais-je parler à M. Dupont ?", vi: "A lô, xin chào, tôi có thể nói chuyện với ông Dupont không?", pronunciation_focus: ["allô → a-lô", "nasal on", "silent -s"] },
      { en: "Ne quittez pas, je vous le passe.", vi: "Xin giữ máy, tôi chuyển cho anh/chị.", pronunciation_focus: ["eu → ơ", "ou → u", "silent -s"] },
      { en: "Pourriez-vous rappeler dans dix minutes ?", vi: "Gọi lại sau 10 phút được không?", pronunciation_focus: ["ou → u", "ez → ê", "nasal in"] },
      { en: "La ligne est occupée, veuillez patienter.", vi: "Đường dây bận, xin vui lòng chờ.", pronunciation_focus: ["nasal in", "ée → ê", "ez → ê"] },
      { en: "Merci de votre appel, bonne journée !", vi: "Cảm ơn cuộc gọi, chúc ngày tốt lành!", pronunciation_focus: ["er → ê", "ou → u", "ée → ê"] },
    ],
    cultural_notes_vi: "Ở Pháp, gọi công việc luôn bắt đầu 'Allô, bonjour' + tên. Không gọi thẳng vấn đề. Kết thúc 'Merci, au revoir'. Tránh 12h-14h.",
    tip_advice_vi: "Tập 'Pourriez-vous répéter ?' — người Pháp nói nhanh. Nếu không nghe rõ: 'Pouvez-vous parler plus lentement ?'.",
    vocabulary: [
      { word: "décrocher", en: "to pick up", vi: "nhấc máy", pos: "v.", pronunciation_vi: "đê-crô-sê" },
      { word: "raccrocher", en: "to hang up", vi: "gác máy", pos: "v.", pronunciation_vi: "ra-crô-sê" },
      { word: "le combiné", en: "handset", vi: "ống nghe", pos: "n.m.", pronunciation_vi: "côm-bi-nê" },
      { word: "composer", en: "to dial", vi: "bấm số", pos: "v.", pronunciation_vi: "côm-pô-zê" },
      { word: "le répondeur", en: "answering machine", vi: "máy trả lời", pos: "n.m.", pronunciation_vi: "rê-pôn-đơ" },
      { word: "la messagerie", en: "voicemail", vi: "hộp thư thoại", pos: "n.f.", pronunciation_vi: "mê-sa-giơ-ri" },
      { word: "patienter", en: "to wait/hold", vi: "chờ máy", pos: "v.", pronunciation_vi: "pa-xiăng-tê" },
      { word: "le standard", en: "switchboard", vi: "tổng đài", pos: "n.m.", pronunciation_vi: "xtăng-đa" },
      { word: "transférer", en: "to transfer", vi: "chuyển máy", pos: "v.", pronunciation_vi: "trăng-xfê-rê" },
      { word: "joindre", en: "to reach", vi: "liên lạc được", pos: "v.", pronunciation_vi: "joanh-đrơ" },
    ],
    dialogue: [
      { speaker: "A", text: "Allô, Société Martin, je voudrais parler à Mme Lefèvre.", en: "Hello, Martin Company, I'd like to speak to Mrs. Lefèvre." },
      { speaker: "B", text: "Ne quittez pas, je vous la passe.", en: "Hold on, I'll transfer you." },
      { speaker: "A", text: "Merci beaucoup.", en: "Thank you very much." },
      { speaker: "B", text: "Désolé, elle est en réunion. Voulez-vous laisser un message ?", en: "Sorry, she's in a meeting. Leave a message?" },
    ],
    exercises: [
      { type: "fill-blank", question: "Je voudrais parler ___ directeur.", answer: "au" },
      { type: "matching", pairs: [["décrocher", "nhấc máy"], ["raccrocher", "gác máy"], ["le répondeur", "máy trả lời"]], instruction: "Nối từ Pháp với nghĩa Việt" },
      { type: "translation", vietnamese: "Xin lỗi, tôi không nghe rõ, nói chậm lại được không?", french: "Désolé, je n'entends pas bien, pouvez-vous parler plus lentement ?" },
    ],
  },
  {
    id: "french_workplace_email", level: "A2", category: "workplace", title_vi: "Viết email công việc", title_en: "Writing work emails",
    sentences: [
      { en: "Je vous écris pour confirmer notre rendez-vous.", vi: "Tôi viết email để xác nhận cuộc hẹn.", pronunciation_focus: ["écris → ê-cri", "ez → ê", "nasal on"] },
      { en: "Veuillez trouver ci-joint le document demandé.", vi: "Xin xem tài liệu đính kèm.", pronunciation_focus: ["eu → ơ", "ez → ê", "é → ê"] },
      { en: "N'hésitez pas à me contacter pour plus d'informations.", vi: "Đừng ngại liên lạc với tôi.", pronunciation_focus: ["n'hésitez → nê-zi-tê", "ez → ê", "nasal in"] },
      { en: "Je vous remercie par avance de votre réponse.", vi: "Cảm ơn trước câu trả lời.", pronunciation_focus: ["remercie → rơ-me-xi", "nasal an", "silent -e"] },
      { en: "Dans l'attente de votre retour, cordialement.", vi: "Chờ phản hồi, trân trọng.", pronunciation_focus: ["nasal an", "ou → u", "r uvulaire"] },
    ],
    cultural_notes_vi: "Email Pháp: chào → nội dung → kết. Dùng 'Bonjour' + tên. Kết 'Cordialement'. Không viết tắt.",
    tip_advice_vi: "Luôn dùng 'vous'. Đọc lại 2 lần trước gửi. Tiêu đề phải rõ ràng.",
    vocabulary: [
      { word: "l'objet", en: "subject", vi: "tiêu đề", pos: "n.m.", pronunciation_vi: "ôb-giê" },
      { word: "le destinataire", en: "recipient", vi: "người nhận", pos: "n.m.", pronunciation_vi: "đe-sti-na-te" },
      { word: "ci-joint", en: "attached", vi: "đính kèm", pos: "adj.", pronunciation_vi: "xi-joanh" },
      { word: "la pièce jointe", en: "attachment", vi: "tập tin đính kèm", pos: "n.f.", pronunciation_vi: "pi-è-xe joanh-tơ" },
      { word: "envoyer", en: "to send", vi: "gửi", pos: "v.", pronunciation_vi: "ăng-voa-iê" },
      { word: "recevoir", en: "to receive", vi: "nhận", pos: "v.", pronunciation_vi: "rơ-xơ-voa" },
      { word: "répondre", en: "to reply", vi: "trả lời", pos: "v.", pronunciation_vi: "rê-pôn-đrơ" },
      { word: "transférer", en: "to forward", vi: "chuyển tiếp", pos: "v.", pronunciation_vi: "trăng-xfê-rê" },
      { word: "la signature", en: "signature", vi: "chữ ký", pos: "n.f.", pronunciation_vi: "xi-nha-tuya" },
      { word: "cordialement", en: "best regards", vi: "trân trọng", pos: "adv.", pronunciation_vi: "co-đi-a-lơ-măng" },
    ],
    dialogue: [
      { speaker: "A", text: "Bonjour Marie, je t'envoie le rapport pour la réunion.", en: "Hi Marie, sending the report for the meeting." },
      { speaker: "B", text: "Merci Paul, je l'ai bien reçu. Tu as les chiffres ?", en: "Thanks Paul, received. Got the numbers?" },
      { speaker: "A", text: "Oui, je les ajoute en pièce jointe.", en: "Yes, adding as attachment." },
      { speaker: "B", text: "Parfait, à demain !", en: "Perfect, see you tomorrow!" },
    ],
    exercises: [
      { type: "fill-blank", question: "Veuillez trouver ci-___ le document.", answer: "joint" },
      { type: "matching", pairs: [["l'objet", "tiêu đề"], ["envoyer", "gửi"], ["cordialement", "trân trọng"]], instruction: "Nối từ với nghĩa" },
      { type: "translation", vietnamese: "Tôi viết email này để xác nhận cuộc họp ngày mai.", french: "Je vous écris pour confirmer la réunion de demain." },
    ],
  },
  {
    id: "french_workplace_meeting", level: "A2", category: "workplace", title_vi: "Họp hành công sở", title_en: "Office meetings",
    sentences: [
      { en: "La réunion commence à dix heures précises.", vi: "Cuộc họp lúc đúng 10 giờ.", pronunciation_focus: ["réunion → rê-u-ni-on", "nasal en", "eu → ơ"] },
      { en: "Quel est l'ordre du jour ?", vi: "Chương trình nghị sự là gì?", pronunciation_focus: ["ordre → o-đrơ", "ou → u", "jour → giua"] },
      { en: "Pouvez-vous prendre des notes ?", vi: "Anh/chị ghi chép được không?", pronunciation_focus: ["ou → u", "ez → ê", "nasal en"] },
      { en: "Je propose de passer au point suivant.", vi: "Tôi đề nghị chuyển mục tiếp.", pronunciation_focus: ["propose → prô-pô-z", "nasal an", "suivant → xu-i-văng"] },
      { en: "On se retrouve la semaine prochaine ?", vi: "Tuần sau gặp lại nhé?", pronunciation_focus: ["eu → ơ", "ai → e", "prochaine → prô-chen"] },
    ],
    cultural_notes_vi: "Người Pháp họp muộn 5-10 phút. Luôn có 'ordre du jour' và 'compte rendu'. Bắt tay tất cả. 'Non' là khởi đầu tranh luận.",
    tip_advice_vi: "Chuẩn bị vài câu đóng góp. Dùng 'À mon avis...' để phát biểu.",
    vocabulary: [
      { word: "la réunion", en: "meeting", vi: "cuộc họp", pos: "n.f.", pronunciation_vi: "rê-u-ni-on" },
      { word: "l'ordre du jour", en: "agenda", vi: "chương trình", pos: "n.m.", pronunciation_vi: "lo-đrơ đu giua" },
      { word: "le compte rendu", en: "minutes", vi: "biên bản", pos: "n.m.", pronunciation_vi: "côm-tơ răng-đu" },
      { word: "le participant", en: "participant", vi: "người tham dự", pos: "n.m.", pronunciation_vi: "pa-ti-xi-păng" },
      { word: "l'objectif", en: "objective", vi: "mục tiêu", pos: "n.m.", pronunciation_vi: "lôb-giéc-tif" },
      { word: "le budget", en: "budget", vi: "ngân sách", pos: "n.m.", pronunciation_vi: "bu-giê" },
      { word: "le délai", en: "deadline", vi: "thời hạn", pos: "n.m.", pronunciation_vi: "đê-le" },
      { word: "reporter", en: "to postpone", vi: "hoãn lại", pos: "v.", pronunciation_vi: "rơ-po-tê" },
      { word: "valider", en: "to approve", vi: "phê duyệt", pos: "v.", pronunciation_vi: "va-li-đê" },
      { word: "prendre des notes", en: "to take notes", vi: "ghi chép", pos: "v.", pronunciation_vi: "prăng-đrơ đê nôt" },
    ],
    dialogue: [
      { speaker: "A", text: "Bonjour à tous. Commençons par le budget marketing.", en: "Hello everyone. Let's start with marketing budget." },
      { speaker: "B", text: "J'ai préparé les chiffres. Le budget a augmenté de 15%.", en: "I've prepared figures. Budget up 15%." },
      { speaker: "A", text: "Merci. Y a-t-il des questions ?", en: "Thank you. Any questions?" },
      { speaker: "B", text: "Oui, je propose de revoir la répartition des régions.", en: "Yes, let's review regional distribution." },
    ],
    exercises: [
      { type: "fill-blank", question: "La réunion commence ___ neuf heures.", answer: "à" },
      { type: "matching", pairs: [["le compte rendu", "biên bản"], ["reporter", "hoãn"], ["valider", "phê duyệt"]], instruction: "Nối từ với nghĩa" },
      { type: "translation", vietnamese: "Tôi đề nghị chuyển sang mục tiếp theo.", french: "Je propose de passer au point suivant." },
    ],
  },
  {
    id: "french_workplace_present", level: "A2", category: "workplace", title_vi: "Thuyết trình", title_en: "Giving presentations",
    sentences: [
      { en: "Je vais vous présenter les résultats du trimestre.", vi: "Tôi sẽ trình bày kết quả quý.", pronunciation_focus: ["vais → ve", "ez → ê", "nasal en"] },
      { en: "Ce graphique montre l'évolution des ventes.", vi: "Biểu đồ cho thấy phát triển doanh số.", pronunciation_focus: ["graphique → gra-fíc", "nasal on", "é → ê"] },
      { en: "N'hésitez pas à m'interrompre pour des questions.", vi: "Đừng ngại ngắt lời nếu có câu hỏi.", pronunciation_focus: ["n'hésitez → nê-zi-tê", "ez → ê", "nasal on"] },
      { en: "Passons maintenant à la partie suivante.", vi: "Bây giờ chuyển sang phần sau.", pronunciation_focus: ["passons → pa-xon", "nasal an", "suivante → xu-i-văng-tơ"] },
      { en: "Pour conclure, les perspectives sont bonnes.", vi: "Kết luận, triển vọng tốt.", pronunciation_focus: ["conclure → côn-cluya", "ai → e", "silent -s"] },
    ],
    cultural_notes_vi: "Slide ít chữ, nhiều hình. Người Pháp thích số liệu. Bắt đầu 'Bonjour à tous', kết 'Merci de votre attention'.",
    tip_advice_vi: "Luyện phát âm số và phần trăm thật kỹ. Dùng tay chỉ slide.",
    vocabulary: [
      { word: "présenter", en: "to present", vi: "trình bày", pos: "v.", pronunciation_vi: "prê-dăng-tê" },
      { word: "le diaporama", en: "slideshow", vi: "bài trình chiếu", pos: "n.m.", pronunciation_vi: "đi-a-pô-ra-ma" },
      { word: "la diapositive", en: "slide", vi: "trang chiếu", pos: "n.f.", pronunciation_vi: "đi-a-pô-di-tiv" },
      { word: "le graphique", en: "chart", vi: "biểu đồ", pos: "n.m.", pronunciation_vi: "gra-fíc" },
      { word: "les données", en: "data", vi: "dữ liệu", pos: "n.f.pl.", pronunciation_vi: "đô-nê" },
      { word: "la conclusion", en: "conclusion", vi: "kết luận", pos: "n.f.", pronunciation_vi: "côn-clu-di-on" },
      { word: "l'auditoire", en: "audience", vi: "khán giả", pos: "n.m.", pronunciation_vi: "lô-đi-toa" },
      { word: "le pourcentage", en: "percentage", vi: "phần trăm", pos: "n.m.", pronunciation_vi: "pu-xăng-ta-giơ" },
      { word: "l'évolution", en: "trend", vi: "phát triển", pos: "n.f.", pronunciation_vi: "lê-vô-lu-xi-on" },
      { word: "convaincre", en: "to convince", vi: "thuyết phục", pos: "v.", pronunciation_vi: "côn-vanh-crơ" },
    ],
    dialogue: [
      { speaker: "A", text: "Bonjour à tous. Aujourd'hui je présente notre nouveau projet.", en: "Hello everyone. Today I present our new project." },
      { speaker: "B", text: "Quel est l'objectif principal ?", en: "What's the main objective?" },
      { speaker: "A", text: "Augmenter notre part de marché de 10% en six mois.", en: "Increase market share 10% in six months." },
      { speaker: "B", text: "Très intéressant. Avez-vous un calendrier ?", en: "Very interesting. Do you have a timeline?" },
    ],
    exercises: [
      { type: "fill-blank", question: "Je vais vous ___ les résultats.", answer: "présenter" },
      { type: "matching", pairs: [["le diaporama", "bài trình chiếu"], ["convaincre", "thuyết phục"], ["l'auditoire", "khán giả"]], instruction: "Nối từ với nghĩa" },
      { type: "translation", vietnamese: "Cảm ơn sự chú ý. Có câu hỏi nào không?", french: "Merci de votre attention. Avez-vous des questions ?" },
    ],
  },
  {
    id: "french_workplace_negotiate", level: "A2", category: "workplace", title_vi: "Đàm phán kinh doanh", title_en: "Business negotiating",
    sentences: [
      { en: "Nous devons trouver un compromis acceptable.", vi: "Chúng ta phải tìm thỏa hiệp.", pronunciation_focus: ["devons → đơ-von", "nasal on", "com→côm"] },
      { en: "Si vous augmentez la commande, nous baisserons le prix.", vi: "Nếu tăng đơn hàng, chúng tôi giảm giá.", pronunciation_focus: ["augmentez → ô-gơ-măng-tê", "baisserons → be-xơ-ron"] },
      { en: "C'est une proposition intéressante, je réfléchis.", vi: "Đề xuất thú vị, để tôi suy nghĩ.", pronunciation_focus: ["proposition → prô-pô-xi-on", "ai → e", "é → ê"] },
      { en: "Nous sommes d'accord sur le principe, pas sur le prix.", vi: "Đồng ý nguyên tắc, chưa đồng ý giá.", pronunciation_focus: ["d'accord → đa-co", "nasal in", "prix → pri"] },
      { en: "D'accord, marché conclu.", vi: "Đồng ý, chốt.", pronunciation_focus: ["d'accord → đa-co", "conclu → côn-clu"] },
    ],
    cultural_notes_vi: "Đàm phán Pháp: không chấp nhận đề nghị đầu. Bữa trưa quan trọng. 'Non' = 'chưa đồng ý điều kiện này'.",
    tip_advice_vi: "Chuẩn bị 3 mức giá. Dùng 'Si... alors...' cho đề nghị có điều kiện.",
    vocabulary: [
      { word: "négocier", en: "to negotiate", vi: "đàm phán", pos: "v.", pronunciation_vi: "nê-gô-xi-ê" },
      { word: "le compromis", en: "compromise", vi: "thỏa hiệp", pos: "n.m.", pronunciation_vi: "côm-prô-mi" },
      { word: "la concession", en: "concession", vi: "nhượng bộ", pos: "n.f.", pronunciation_vi: "côn-xe-xi-on" },
      { word: "convaincre", en: "to convince", vi: "thuyết phục", pos: "v.", pronunciation_vi: "côn-vanh-crơ" },
      { word: "l'argument", en: "argument", vi: "lý lẽ", pos: "n.m.", pronunciation_vi: "la-ghu-măng" },
      { word: "la marge", en: "margin", vi: "biên lợi nhuận", pos: "n.f.", pronunciation_vi: "ma-giơ" },
      { word: "réduire", en: "to reduce", vi: "giảm", pos: "v.", pronunciation_vi: "rê-đuiya" },
      { word: "accepter", en: "to accept", vi: "chấp nhận", pos: "v.", pronunciation_vi: "ác-xép-tê" },
      { word: "refuser", en: "to refuse", vi: "từ chối", pos: "v.", pronunciation_vi: "rơ-phu-dê" },
      { word: "la remise", en: "discount", vi: "chiết khấu", pos: "n.f.", pronunciation_vi: "rơ-mi-dơ" },
    ],
    dialogue: [
      { speaker: "A", text: "Votre prix est trop élevé. Pouvez-vous faire un geste ?", en: "Your price is too high. Can you make a gesture?" },
      { speaker: "B", text: "Si vous commandez 1000 unités, je peux offrir 10%.", en: "If you order 1000 units, I can offer 10%." },
      { speaker: "A", text: "Et si on disait 800 unités pour 8% ?", en: "What about 800 units for 8%?" },
      { speaker: "B", text: "D'accord, marché conclu.", en: "Agreed, deal." },
    ],
    exercises: [
      { type: "fill-blank", question: "Si vous ___ la commande, nous baisserons le prix.", answer: "augmentez" },
      { type: "matching", pairs: [["le compromis", "thỏa hiệp"], ["réduire", "giảm"], ["refuser", "từ chối"]], instruction: "Nối từ với nghĩa" },
      { type: "translation", vietnamese: "Chúng tôi giảm 5% nếu đặt trước thứ Sáu.", french: "Nous pouvons réduire de 5% si vous commandez avant vendredi." },
    ],
  },
];

// ── LIFE_ADMIN ──
const LIFE_ADMIN: FrenchLesson[] = [
  {
    id: "french_life_bank", level: "A2", category: "life_admin", title_vi: "Giao dịch ngân hàng", title_en: "At the bank",
    sentences: [
      { en: "Je voudrais ouvrir un compte bancaire.", vi: "Tôi muốn mở tài khoản ngân hàng.", pronunciation_focus: ["voudrais → vu-đre", "ouvrir → u-vrir", "compte → côm-tơ"] },
      { en: "Quels documents dois-je fournir ?", vi: "Cần giấy tờ gì?", pronunciation_focus: ["documents → đô-cu-măng", "ou → u", "je → giơ"] },
      { en: "Je souhaite faire un virement de 500 euros.", vi: "Tôi muốn chuyển khoản 500 euro.", pronunciation_focus: ["souhaite → xu-ét", "virement → vi-rơ-măng", "eu → ơ"] },
      { en: "Pouvez-vous me donner un relevé de compte ?", vi: "Cho tôi bản sao kê?", pronunciation_focus: ["ou → u", "ez → ê", "relevé → rơ-lơ-vê"] },
      { en: "Quel est le taux d'intérêt actuel ?", vi: "Lãi suất hiện tại bao nhiêu?", pronunciation_focus: ["taux → tô", "d'intérêt → danh-tê-rê", "actuel → ắc-tu-en"] },
    ],
    cultural_notes_vi: "Ngân hàng Pháp đóng 12h-14h và thứ Hai. Cần 'justificatif de domicile' và 'pièce d'identité'. 'RIB' là giấy quan trọng nhất.",
    tip_advice_vi: "Học thuộc: 'RIB', 'virement', 'prélèvement'. Đặt lịch hẹn trước.",
    vocabulary: [
      { word: "le compte", en: "account", vi: "tài khoản", pos: "n.m.", pronunciation_vi: "côm-tơ" },
      { word: "le virement", en: "transfer", vi: "chuyển khoản", pos: "n.m.", pronunciation_vi: "vi-rơ-măng" },
      { word: "le relevé", en: "statement", vi: "sao kê", pos: "n.m.", pronunciation_vi: "rơ-lơ-vê" },
      { word: "le guichet", en: "counter", vi: "quầy", pos: "n.m.", pronunciation_vi: "ghi-chê" },
      { word: "le RIB", en: "bank details", vi: "thông tin NH", pos: "n.m.", pronunciation_vi: "rìb" },
      { word: "le découvert", en: "overdraft", vi: "thấu chi", pos: "n.m.", pronunciation_vi: "đê-cu-ve" },
      { word: "le prélèvement", en: "direct debit", vi: "ghi nợ tự động", pos: "n.m.", pronunciation_vi: "prê-le-vơ-măng" },
      { word: "déposer", en: "to deposit", vi: "gửi tiền", pos: "v.", pronunciation_vi: "đê-pô-dê" },
      { word: "retirer", en: "to withdraw", vi: "rút tiền", pos: "v.", pronunciation_vi: "rơ-ti-rê" },
      { word: "le taux", en: "rate", vi: "lãi suất", pos: "n.m.", pronunciation_vi: "tô" },
    ],
    dialogue: [
      { speaker: "A", text: "Bonjour, je voudrais ouvrir un compte courant.", en: "Hello, I'd like to open a current account." },
      { speaker: "B", text: "Bien sûr. Avez-vous une pièce d'identité ?", en: "Of course. Do you have an ID?" },
      { speaker: "A", text: "Oui, voici mon passeport et ma facture.", en: "Yes, here is my passport and bill." },
      { speaker: "B", text: "Parfait. Vous recevrez votre carte sous huit jours.", en: "Perfect. Card within a week." },
    ],
    exercises: [
      { type: "fill-blank", question: "Je voudrais ouvrir un ___ bancaire.", answer: "compte" },
      { type: "matching", pairs: [["le virement", "chuyển khoản"], ["retirer", "rút tiền"], ["le guichet", "quầy"]], instruction: "Nối từ với nghĩa" },
      { type: "translation", vietnamese: "Tôi muốn chuyển 200 euro vào tài khoản này.", french: "Je voudrais virer 200 euros sur ce compte." },
    ],
  },
  {
    id: "french_life_post", level: "A2", category: "life_admin", title_vi: "Bưu điện", title_en: "At the post office",
    sentences: [
      { en: "Je voudrais envoyer ce colis au Vietnam.", vi: "Tôi muốn gửi bưu kiện đến Việt Nam.", pronunciation_focus: ["envoyer → ăng-voa-iê", "colis → cô-li", "nasal an"] },
      { en: "Quel est le tarif pour un envoi prioritaire ?", vi: "Cước gửi ưu tiên bao nhiêu?", pronunciation_focus: ["tarif → ta-rif", "envoi → ăng-voa", "prioritaire → pri-o-ri-te"] },
      { en: "Je voudrais un timbre pour une lettre internationale.", vi: "Tôi muốn mua tem cho thư quốc tế.", pronunciation_focus: ["timbre → tanh-brơ", "nasal an", "internationale → anh-te-na-xi-ô-nal"] },
      { en: "Où se trouve la boîte aux lettres ?", vi: "Hòm thư ở đâu?", pronunciation_focus: ["trouve → tru-vơ", "boîte → boát"] },
      { en: "Combien de temps prendra la livraison ?", vi: "Giao hàng mất bao lâu?", pronunciation_focus: ["temps → tăm", "livraison → li-vre-don", "nasal on"] },
    ],
    cultural_notes_vi: "Bưu điện Pháp (La Poste) cũng là ngân hàng. Tem mua ở quán cà phê-tabac. 'Chronopost' là chuyển phát nhanh.",
    tip_advice_vi: "Chọn 'Colissimo' để có tracking. Khai hải quan nếu trên 45€.",
    vocabulary: [
      { word: "le timbre", en: "stamp", vi: "tem", pos: "n.m.", pronunciation_vi: "tanh-brơ" },
      { word: "le colis", en: "parcel", vi: "bưu kiện", pos: "n.m.", pronunciation_vi: "cô-li" },
      { word: "la lettre", en: "letter", vi: "thư", pos: "n.f.", pronunciation_vi: "lét-trơ" },
      { word: "l'enveloppe", en: "envelope", vi: "phong bì", pos: "n.f.", pronunciation_vi: "lăng-vơ-lốp" },
      { word: "envoyer", en: "to send", vi: "gửi", pos: "v.", pronunciation_vi: "ăng-voa-iê" },
      { word: "le recommandé", en: "registered mail", vi: "thư bảo đảm", pos: "n.m.", pronunciation_vi: "rơ-cô-măng-đê" },
      { word: "la livraison", en: "delivery", vi: "giao hàng", pos: "n.f.", pronunciation_vi: "li-vre-don" },
      { word: "le facteur", en: "mail carrier", vi: "người đưa thư", pos: "n.m.", pronunciation_vi: "fắc-tơ" },
      { word: "le code postal", en: "postal code", vi: "mã bưu chính", pos: "n.m.", pronunciation_vi: "cô-đơ pô-xtan" },
      { word: "la boîte aux lettres", en: "mailbox", vi: "hòm thư", pos: "n.f.", pronunciation_vi: "boát ô lét-trơ" },
    ],
    dialogue: [
      { speaker: "A", text: "Bonjour, je voudrais envoyer ce colis au Vietnam.", en: "Hello, I'd like to send this parcel to Vietnam." },
      { speaker: "B", text: "Bien sûr. Quel type d'envoi ?", en: "Of course. What type of shipping?" },
      { speaker: "A", text: "Quelle est l'option la plus économique ?", en: "What's the cheapest option?" },
      { speaker: "B", text: "Colissimo international, 26 euros pour moins de 2 kg.", en: "International Colissimo, 26 euros under 2 kg." },
    ],
    exercises: [
      { type: "fill-blank", question: "Je voudrais un ___ pour une lettre.", answer: "timbre" },
      { type: "matching", pairs: [["le colis", "bưu kiện"], ["envoyer", "gửi"], ["le facteur", "người đưa thư"]], instruction: "Nối từ với nghĩa" },
      { type: "translation", vietnamese: "Gói hàng này đến Việt Nam mất bao lâu?", french: "Combien de temps ce colis mettra-t-il pour arriver au Vietnam ?" },
    ],
  },
  {
    id: "french_life_apartment", level: "A2", category: "life_admin", title_vi: "Thuê nhà ở Pháp", title_en: "Renting in France",
    sentences: [
      { en: "Je cherche un appartement à louer.", vi: "Tôi tìm căn hộ cho thuê.", pronunciation_focus: ["cherche → se-sơ", "appartement → a-pa-tơ-măng", "louer → lu-ê"] },
      { en: "Quel est le montant du loyer ?", vi: "Tiền thuê bao nhiêu?", pronunciation_focus: ["montant → mon-tăng", "loyer → loa-iê"] },
      { en: "Le loyer inclut-il les charges ?", vi: "Tiền thuê gồm phí chưa?", pronunciation_focus: ["inclut → anh-clu", "charges → sa-giơ"] },
      { en: "Puis-je visiter l'appartement demain ?", vi: "Tôi xem căn hộ ngày mai được không?", pronunciation_focus: ["puis → puy", "visiter → vi-zi-tê"] },
      { en: "Quels sont les justificatifs nécessaires ?", vi: "Cần giấy tờ gì?", pronunciation_focus: ["justificatifs → giu-sti-fi-ca-tif", "nécessaires → nê-xe-se"] },
    ],
    cultural_notes_vi: "Thuê nhà Pháp rất khó. Cần 3 tháng lương, CDI, garant. 'Caution' 1-2 tháng. Phân biệt 'CC' (gồm phí) và 'HC' (chưa gồm).",
    tip_advice_vi: "Tìm nhà qua Leboncoin, SeLoger. Chuẩn bị sẵn 'dossier de location'.",
    vocabulary: [
      { word: "louer", en: "to rent", vi: "thuê", pos: "v.", pronunciation_vi: "lu-ê" },
      { word: "le loyer", en: "rent", vi: "tiền thuê", pos: "n.m.", pronunciation_vi: "loa-iê" },
      { word: "la caution", en: "deposit", vi: "cọc", pos: "n.f.", pronunciation_vi: "cô-xi-on" },
      { word: "le propriétaire", en: "landlord", vi: "chủ nhà", pos: "n.m.", pronunciation_vi: "prô-pri-ê-te" },
      { word: "le locataire", en: "tenant", vi: "người thuê", pos: "n.m.", pronunciation_vi: "lô-ca-te" },
      { word: "le bail", en: "lease", vi: "hợp đồng", pos: "n.m.", pronunciation_vi: "bai" },
      { word: "les charges", en: "utilities", vi: "phí dịch vụ", pos: "n.f.pl.", pronunciation_vi: "sa-giơ" },
      { word: "meublé", en: "furnished", vi: "có nội thất", pos: "adj.", pronunciation_vi: "mơ-blê" },
      { word: "la superficie", en: "area", vi: "diện tích", pos: "n.f.", pronunciation_vi: "xu-pe-fi-xi" },
      { word: "l'état des lieux", en: "inventory", vi: "biên bản hiện trạng", pos: "n.m.", pronunciation_vi: "lê-ta đê liơ" },
    ],
    dialogue: [
      { speaker: "A", text: "Bonjour, je vous appelle au sujet de l'annonce pour l'appartement.", en: "Hello, calling about the apartment listing." },
      { speaker: "B", text: "Oui, il est toujours disponible. Voulez-vous le visiter ?", en: "Yes, still available. Want to visit?" },
      { speaker: "A", text: "Avec plaisir. Le loyer inclut-il les charges ?", en: "With pleasure. Does rent include utilities?" },
      { speaker: "B", text: "Oui, l'eau et le chauffage sont compris.", en: "Yes, water and heating included." },
    ],
    exercises: [
      { type: "fill-blank", question: "Je cherche un appartement ___ louer.", answer: "à" },
      { type: "matching", pairs: [["le loyer", "tiền thuê"], ["la caution", "cọc"], ["meublé", "có nội thất"]], instruction: "Nối từ với nghĩa" },
      { type: "translation", vietnamese: "Tiền thuê đã bao gồm điện nước chưa?", french: "Est-ce que le loyer inclut les charges ?" },
    ],
  },
  {
    id: "french_life_complaints", level: "A2", category: "life_admin", title_vi: "Khiếu nại và đổi trả", title_en: "Complaints and returns",
    sentences: [
      { en: "Je voudrais faire une réclamation.", vi: "Tôi muốn khiếu nại.", pronunciation_focus: ["réclamation → rê-cla-ma-xi-on", "ai → e"] },
      { en: "Ce produit est défectueux, je le retourne.", vi: "Sản phẩm lỗi, tôi muốn trả.", pronunciation_focus: ["défectueux → đê-féc-tu-ơ", "eu → ơ", "er → ê"] },
      { en: "Avez-vous le ticket de caisse ?", vi: "Có hóa đơn không?", pronunciation_focus: ["ticket → ti-kê", "caisse → két-xơ"] },
      { en: "Je demande un remboursement ou un échange.", vi: "Tôi yêu cầu hoàn tiền hoặc đổi.", pronunciation_focus: ["remboursement → răm-bu-xơ-măng", "échange → ê-săng-giơ"] },
      { en: "Quel est le délai de rétractation ?", vi: "Thời hạn đổi trả bao lâu?", pronunciation_focus: ["délai → đê-le", "rétractation → rê-trắc-ta-xi-on"] },
    ],
    cultural_notes_vi: "Pháp bảo vệ người tiêu dùng mạnh. Online: đổi 14 ngày. Sản phẩm lỗi: bảo hành 2 năm. Luôn giữ 'ticket de caisse'.",
    tip_advice_vi: "Dùng giọng lịch sự nhưng rõ ràng. Câu thần chú: 'Qu'est-ce que vous pouvez faire pour moi ?'",
    vocabulary: [
      { word: "la réclamation", en: "complaint", vi: "khiếu nại", pos: "n.f.", pronunciation_vi: "rê-cla-ma-xi-on" },
      { word: "défectueux", en: "defective", vi: "bị lỗi", pos: "adj.", pronunciation_vi: "đê-féc-tu-ơ" },
      { word: "rembourser", en: "to refund", vi: "hoàn tiền", pos: "v.", pronunciation_vi: "răm-bu-xê" },
      { word: "échanger", en: "to exchange", vi: "đổi", pos: "v.", pronunciation_vi: "ê-săng-giê" },
      { word: "le ticket de caisse", en: "receipt", vi: "hóa đơn", pos: "n.m.", pronunciation_vi: "ti-kê đơ két-xơ" },
      { word: "la facture", en: "invoice", vi: "hóa đơn", pos: "n.f.", pronunciation_vi: "fắc-tuya" },
      { word: "la garantie", en: "warranty", vi: "bảo hành", pos: "n.f.", pronunciation_vi: "ga-răng-ti" },
      { word: "annuler", en: "to cancel", vi: "hủy", pos: "v.", pronunciation_vi: "a-nu-lê" },
      { word: "le service client", en: "customer service", vi: "dịch vụ KH", pos: "n.m.", pronunciation_vi: "se-vi-xơ cli-ăng" },
      { word: "le remboursement", en: "refund", vi: "hoàn tiền", pos: "n.m.", pronunciation_vi: "răm-bu-xơ-măng" },
    ],
    dialogue: [
      { speaker: "A", text: "Bonjour, ce téléphone acheté la semaine dernière ne marche plus.", en: "Hello, this phone bought last week doesn't work." },
      { speaker: "B", text: "Avez-vous le ticket de caisse ?", en: "Do you have the receipt?" },
      { speaker: "A", text: "Oui, voici la facture et la garantie.", en: "Yes, here's invoice and warranty." },
      { speaker: "B", text: "Très bien, on peut vous le rembourser ou l'échanger.", en: "Very well, we can refund or exchange it." },
    ],
    exercises: [
      { type: "fill-blank", question: "Ce produit est défectueux, je voudrais le ___.", answer: "retourner" },
      { type: "matching", pairs: [["rembourser", "hoàn tiền"], ["échanger", "đổi"], ["la garantie", "bảo hành"]], instruction: "Nối từ với nghĩa" },
      { type: "translation", vietnamese: "Tôi muốn hoàn tiền. Đây là hóa đơn.", french: "Je voudrais être remboursé. Voici ma facture." },
    ],
  },
  {
    id: "french_life_directions", level: "A2", category: "life_admin", title_vi: "Hỏi và chỉ đường", title_en: "Asking for directions",
    sentences: [
      { en: "Excusez-moi, comment aller à la gare ?", vi: "Xin lỗi, đến ga thế nào?", pronunciation_focus: ["excusez → éc-xcu-dê", "ez → ê", "gare → ga"] },
      { en: "Continuez tout droit jusqu'au feu rouge.", vi: "Đi thẳng đến đèn đỏ.", pronunciation_focus: ["continuez → côn-ti-nu-ê", "droit → đroa", "feu → fơ"] },
      { en: "Tournez à gauche au prochain carrefour.", vi: "Rẽ trái ở ngã tư tới.", pronunciation_focus: ["tournez → tua-nê", "gauche → gô-sơ", "carrefour → ca-rơ-fua"] },
      { en: "C'est à environ dix minutes à pied.", vi: "Khoảng 10 phút đi bộ.", pronunciation_focus: ["environ → ăng-vi-ron", "pied → pi-ê"] },
      { en: "La pharmacie est en face de la boulangerie.", vi: "Hiệu thuốc đối diện tiệm bánh.", pronunciation_focus: ["pharmacie → fa-ma-xi", "face → fát-xơ", "boulangerie → bu-lăng-giơ-ri"] },
    ],
    cultural_notes_vi: "Người Pháp dùng điểm mốc: 'à côté de la boulangerie'. Dùng thời gian làm khoảng cách. Paris: câu trả lời cộc lốc là bình thường.",
    tip_advice_vi: "Học thuộc: 'à droite', 'à gauche', 'tout droit', 'en face'. Luôn bắt đầu 'Excusez-moi'.",
    vocabulary: [
      { word: "tout droit", en: "straight", vi: "đi thẳng", pos: "adv.", pronunciation_vi: "tu đroa" },
      { word: "à gauche", en: "left", vi: "trái", pos: "adv.", pronunciation_vi: "a gô-sơ" },
      { word: "à droite", en: "right", vi: "phải", pos: "adv.", pronunciation_vi: "a đroát" },
      { word: "le carrefour", en: "intersection", vi: "ngã tư", pos: "n.m.", pronunciation_vi: "ca-rơ-fua" },
      { word: "le feu", en: "traffic light", vi: "đèn giao thông", pos: "n.m.", pronunciation_vi: "fơ" },
      { word: "traverser", en: "to cross", vi: "băng qua", pos: "v.", pronunciation_vi: "tra-ve-xê" },
      { word: "le trottoir", en: "sidewalk", vi: "vỉa hè", pos: "n.m.", pronunciation_vi: "trô-toa" },
      { word: "le plan", en: "map", vi: "bản đồ", pos: "n.m.", pronunciation_vi: "plăng" },
      { word: "proche", en: "near", vi: "gần", pos: "adj.", pronunciation_vi: "prô-sơ" },
      { word: "loin", en: "far", vi: "xa", pos: "adv.", pronunciation_vi: "loanh" },
    ],
    dialogue: [
      { speaker: "A", text: "Pardon, pour aller au Musée d'Orsay ?", en: "Excuse me, how to get to Musée d'Orsay?" },
      { speaker: "B", text: "Continuez tout droit, puis tournez à gauche après le pont.", en: "Go straight, then left after the bridge." },
      { speaker: "A", text: "C'est loin d'ici ?", en: "Is it far?" },
      { speaker: "B", text: "Non, c'est à quinze minutes à pied.", en: "No, about fifteen minutes on foot." },
    ],
    exercises: [
      { type: "fill-blank", question: "Tournez ___ gauche au prochain carrefour.", answer: "à" },
      { type: "matching", pairs: [["tout droit", "thẳng"], ["à gauche", "trái"], ["traverser", "băng qua"]], instruction: "Nối từ với nghĩa" },
      { type: "translation", vietnamese: "Xin lỗi, nhà ga ở đâu ạ?", french: "Excusez-moi, où se trouve la gare ?" },
    ],
  },
];

const SOCIETY: FrenchLesson[] = [
  {id:"french_society_news",level:"B1",category:"society",title_vi:"Thảo luận tin tức",title_en:"Discussing current events",
    sentences:[{en:"As-tu lu l'article sur la politique ?",vi:"Bạn đọc bài báo về chính trị chưa?",pronunciation_focus:["article→a-tíc","nasal in"]},{en:"Que penses-tu de cette nouvelle loi ?",vi:"Bạn nghĩ gì về luật mới?",pronunciation_focus:["penses→păng","nouvelle→nu-ven"]},{en:"Il faut vérifier les sources avant de partager.",vi:"Phải kiểm tra nguồn trước khi chia sẻ.",pronunciation_focus:["vérifier→vê-ri-fi-ê","sources→xua"]},{en:"Je lis Le Monde tous les matins.",vi:"Tôi đọc Le Monde mỗi sáng.",pronunciation_focus:["lis→li","matins→ma-tanh"]},{en:"Les informations disent que la situation s'améliore.",vi:"Tin tức nói tình hình đang cải thiện.",pronunciation_focus:["informations→anh-fo-ma-xi-on","s'améliore→xa-mê-li-o"]}],
    cultural_notes_vi:"Người Pháp đọc báo nhiều. Le Monde (trung lập), Le Figaro (hữu), Libération (tả). Tranh luận chính trị là môn thể thao quốc dân.",
    tip_advice_vi:"Dùng 'À mon avis…', 'Je pense que…', 'Il me semble que…'. Tránh nói 'c'est nul'.",
    vocabulary:[{word:"l'actualité",en:"current events",vi:"thời sự",pos:"n.f.",pronunciation_vi:"lắc-tu-a-li-tê"},{word:"le journal",en:"newspaper",vi:"báo",pos:"n.m.",pronunciation_vi:"giua-nan"},{word:"l'article",en:"article",vi:"bài báo",pos:"n.m.",pronunciation_vi:"la-tíc"},{word:"partager",en:"to share",vi:"chia sẻ",pos:"v.",pronunciation_vi:"pa-ta-giê"},{word:"débattre",en:"to debate",vi:"tranh luận",pos:"v.",pronunciation_vi:"đê-bát"},{word:"la source",en:"source",vi:"nguồn",pos:"n.f.",pronunciation_vi:"xua-xơ"},{word:"vérifier",en:"to verify",vi:"kiểm tra",pos:"v.",pronunciation_vi:"vê-ri-fi-ê"},{word:"l'opinion",en:"opinion",vi:"ý kiến",pos:"n.f.",pronunciation_vi:"lô-pi-ni-on"},{word:"la Une",en:"front page",vi:"trang nhất",pos:"n.f.",pronunciation_vi:"la Un"},{word:"fiable",en:"reliable",vi:"đáng tin",pos:"adj.",pronunciation_vi:"fi-a-blơ"}],
    dialogue:[{speaker:"A",text:"Tu as vu les infos ce matin ?",en:"Did you see the news this morning?"},{speaker:"B",text:"Oui, il y a une manifestation à Paris.",en:"Yes, there's a protest in Paris."},{speaker:"A",text:"C'est à propos de la réforme des retraites ?",en:"Is it about the pension reform?"},{speaker:"B",text:"Exactement. Qu'est-ce que tu en penses ?",en:"Exactly. What do you think?"}],
    exercises:[{type:"fill-blank",question:"As-tu lu l'___ sur les élections ?",answer:"article"},{type:"matching",pairs:[["l'actualité","thời sự"],["partager","chia sẻ"],["fiable","đáng tin"]],instruction:"Nối từ Pháp với nghĩa Việt"},{type:"translation",vietnamese:"Theo tôi, tình hình sẽ cải thiện năm tới.",french:"À mon avis, la situation s'améliorera l'année prochaine."}]},
  {id:"french_society_culture",level:"B1",category:"society",title_vi:"Khác biệt văn hóa Pháp-Việt",title_en:"French-Vietnamese cultural differences",
    sentences:[{en:"En France, on fait la bise pour se saluer.",vi:"Ở Pháp, hôn má để chào.",pronunciation_focus:["bise→bi-dơ","saluer→xa-lu-ê"]},{en:"Les Français sont plus directs dans la conversation.",vi:"Người Pháp nói chuyện trực tiếp hơn.",pronunciation_focus:["Français→frăng-xe","directs→đi-réc"]},{en:"Au Vietnam, éviter le conflit est important.",vi:"Ở VN, tránh xung đột quan trọng.",pronunciation_focus:["Vietnam→Vi-ét-nam","conflit→côn-fli"]},{en:"Il faut comprendre les différences pour bien communiquer.",vi:"Cần hiểu khác biệt để giao tiếp.",pronunciation_focus:["comprendre→côm-prăng","différences→đi-fê-răng"]},{en:"On doit s'adapter aux coutumes locales.",vi:"Phải thích nghi với phong tục địa phương.",pronunciation_focus:["s'adapter→xa-đáp-tê","coutumes→cu-tuym"]}],
    cultural_notes_vi:"Bise thay đổi theo vùng: Paris 2, miền Nam 3, có nơi 4 lần. Bắt tay công việc mỗi sáng. Người Pháp nói 'non' trực tiếp — đừng hiểu là bất lịch sự. Giờ ăn trưa thiêng liêng.",
    tip_advice_vi:"Khi được mời ăn tối, mang rượu hoặc hoa (tránh cúc). Đến đúng giờ hoặc trễ 15 phút. Khen món ăn là bắt buộc.",
    vocabulary:[{word:"la bise",en:"cheek kiss",vi:"hôn má",pos:"n.f.",pronunciation_vi:"bi-dơ"},{word:"serrer la main",en:"to shake hands",vi:"bắt tay",pos:"v.",pronunciation_vi:"xe-rê la manh"},{word:"le tutoiement",en:"using tu",vi:"xưng hô thân mật",pos:"n.m.",pronunciation_vi:"tu-toa-măng"},{word:"le vouvoiement",en:"using vous",vi:"xưng hô lịch sự",pos:"n.m.",pronunciation_vi:"vu-voa-măng"},{word:"direct",en:"direct",vi:"trực tiếp",pos:"adj.",pronunciation_vi:"đi-réc"},{word:"le compromis",en:"compromise",vi:"thỏa hiệp",pos:"n.m.",pronunciation_vi:"côm-prô-mi"},{word:"l'étiquette",en:"etiquette",vi:"phép tắc",pos:"n.f.",pronunciation_vi:"lê-ti-két"},{word:"s'adapter",en:"to adapt",vi:"thích nghi",pos:"v.",pronunciation_vi:"xa-đáp-tê"},{word:"le décalage",en:"gap",vi:"khác biệt",pos:"n.m.",pronunciation_vi:"đê-ca-la-giơ"},{word:"la coutume",en:"custom",vi:"phong tục",pos:"n.f.",pronunciation_vi:"cu-tuym"}],
    dialogue:[{speaker:"A",text:"Pourquoi mon collègue dit toujours non directement ?",en:"Why does my colleague always say no directly?"},{speaker:"B",text:"Ce n'est pas impoli, c'est leur façon de communiquer.",en:"It's not rude, it's their way of communicating."},{speaker:"A",text:"Au Vietnam, on dirait 'peut-être' pour être poli.",en:"In Vietnam, we'd say 'maybe' to be polite."},{speaker:"B",text:"Oui, c'est une grande différence culturelle !",en:"Yes, that's a big cultural difference!"}],
    exercises:[{type:"fill-blank",question:"En France, on fait la ___ pour se saluer.",answer:"bise"},{type:"matching",pairs:[["le tutoiement","xưng hô thân mật"],["s'adapter","thích nghi"],["la coutume","phong tục"]],instruction:"Nối từ với nghĩa"},{type:"translation",vietnamese:"Cần hiểu khác biệt văn hóa để giao tiếp tốt hơn.",french:"Il faut comprendre les différences culturelles pour mieux communiquer."}]},
  {id:"french_society_social",level:"B1",category:"society",title_vi:"Mạng xã hội",title_en:"Social media",
    sentences:[{en:"Je passe trop de temps sur les réseaux sociaux.",vi:"Tôi dành quá nhiều thời gian trên MXH.",pronunciation_focus:["passe→pát","réseaux→rê-dô","sociaux→xô-xi-ô"]},{en:"As-tu vu ma dernière publication ?",vi:"Bạn xem bài đăng mới của tôi chưa?",pronunciation_focus:["publication→pu-bli-ca-xi-on","dernière→đe-ni-e"]},{en:"Je partage beaucoup de photos de mes voyages.",vi:"Tôi chia sẻ nhiều ảnh du lịch.",pronunciation_focus:["partage→pa-ta-giơ","voyages→voa-ia-giơ"]},{en:"Attention aux fausses informations sur internet.",vi:"Coi chừng tin giả trên mạng.",pronunciation_focus:["attention→a-tăng-xi-on","fausses→phô"]},{en:"Les influenceurs ont beaucoup d'abonnés.",vi:"Người ảnh hưởng có nhiều người theo dõi.",pronunciation_focus:["influenceurs→anh-flu-ăng-xơ","abonnés→a-bô-nê"]}],
    cultural_notes_vi:"Người Pháp dùng Facebook, Instagram, LinkedIn, Twitter/X. WhatsApp phổ biến hơn Messenger. GDPR bảo vệ dữ liệu nghiêm ngặt.",
    tip_advice_vi:"Học động từ: publier (đăng), partager (chia sẻ), commenter (bình luận), aimer (thích), s'abonner (theo dõi).",
    vocabulary:[{word:"les réseaux sociaux",en:"social media",vi:"mạng xã hội",pos:"n.m.pl.",pronunciation_vi:"rê-dô xô-xi-ô"},{word:"publier",en:"to post",vi:"đăng",pos:"v.",pronunciation_vi:"pu-bli-ê"},{word:"partager",en:"to share",vi:"chia sẻ",pos:"v.",pronunciation_vi:"pa-ta-giê"},{word:"le commentaire",en:"comment",vi:"bình luận",pos:"n.m.",pronunciation_vi:"cô-măng-te"},{word:"s'abonner",en:"to subscribe",vi:"theo dõi",pos:"v.",pronunciation_vi:"xa-bô-nê"},{word:"l'abonné",en:"follower",vi:"người theo dõi",pos:"n.m.",pronunciation_vi:"la-bô-nê"},{word:"le like",en:"like",vi:"lượt thích",pos:"n.m.",pronunciation_vi:"la-íc"},{word:"le mot-clé",en:"hashtag",vi:"thẻ",pos:"n.m.",pronunciation_vi:"mô-clê"},{word:"la story",en:"story",vi:"tin",pos:"n.f.",pronunciation_vi:"xtô-ri"},{word:"l'influenceur",en:"influencer",vi:"người ảnh hưởng",pos:"n.m.",pronunciation_vi:"lanh-flu-ăng-xơ"}],
    dialogue:[{speaker:"A",text:"Tu as combien d'abonnés sur Instagram ?",en:"How many followers on Instagram?"},{speaker:"B",text:"Environ 2000. Et toi ?",en:"About 2000. You?"},{speaker:"A",text:"Seulement 500, mais je préfère la qualité !",en:"Only 500, but I prefer quality!"},{speaker:"B",text:"Bien dit ! As-tu vu ma nouvelle publication ?",en:"Well said! Did you see my new post?"}],
    exercises:[{type:"fill-blank",question:"Je passe trop de temps sur les ___ sociaux.",answer:"réseaux"},{type:"matching",pairs:[["publier","đăng"],["s'abonner","theo dõi"],["le commentaire","bình luận"]],instruction:"Nối từ với nghĩa"},{type:"translation",vietnamese:"Đừng chia sẻ thông tin cá nhân trên mạng xã hội.",french:"Ne partagez pas d'informations personnelles sur les réseaux sociaux."}]},
  {id:"french_society_environment",level:"B1",category:"society",title_vi:"Môi trường và sinh thái",title_en:"Environment and ecology",
    sentences:[{en:"Il faut protéger la planète.",vi:"Cần bảo vệ hành tinh.",pronunciation_focus:["protéger→prô-tê-giê","planète→pla-nét"]},{en:"Le recyclage est très important en France.",vi:"Tái chế rất quan trọng ở Pháp.",pronunciation_focus:["recyclage→rơ-xi-cla-giơ","important→anh-po-tăng"]},{en:"Je trie mes déchets tous les jours.",vi:"Tôi phân loại rác mỗi ngày.",pronunciation_focus:["trie→tri","déchets→đê-chê"]},{en:"Nous devons réduire notre consommation d'énergie.",vi:"Chúng ta phải giảm tiêu thụ năng lượng.",pronunciation_focus:["réduire→rê-đuiya","consommation→côn-xô-ma-xi-on"]},{en:"Le changement climatique est un problème urgent.",vi:"Biến đổi khí hậu cấp bách.",pronunciation_focus:["changement→săng-giơ-măng","climatique→cli-ma-tíc"]}],
    cultural_notes_vi:"Pháp đi đầu bảo vệ môi trường. Phân loại rác: vàng (bao bì), xanh (thủy tinh), trắng (giấy), nâu (hữu cơ). Cấm túi nhựa một lần.",
    tip_advice_vi:"Dùng 'Il faut' + động từ: Il faut recycler, Il faut économiser l'eau. Đây là chủ đề yêu thích của người Pháp.",
    vocabulary:[{word:"l'environnement",en:"environment",vi:"môi trường",pos:"n.m.",pronunciation_vi:"lăng-vi-rôn-măng"},{word:"recycler",en:"to recycle",vi:"tái chế",pos:"v.",pronunciation_vi:"rơ-xi-clê"},{word:"le déchet",en:"waste",vi:"rác",pos:"n.m.",pronunciation_vi:"đê-chê"},{word:"le réchauffement",en:"global warming",vi:"nóng lên toàn cầu",pos:"n.m.",pronunciation_vi:"rê-chô-phơ-măng"},{word:"la pollution",en:"pollution",vi:"ô nhiễm",pos:"n.f.",pronunciation_vi:"pô-lu-xi-on"},{word:"protéger",en:"to protect",vi:"bảo vệ",pos:"v.",pronunciation_vi:"prô-tê-giê"},{word:"l'énergie",en:"energy",vi:"năng lượng",pos:"n.f.",pronunciation_vi:"lê-ne-gi"},{word:"renouvelable",en:"renewable",vi:"tái tạo",pos:"adj.",pronunciation_vi:"rơ-nu-vơ-la-blơ"},{word:"économiser",en:"to save",vi:"tiết kiệm",pos:"v.",pronunciation_vi:"ê-cô-nô-mi-dê"},{word:"le climat",en:"climate",vi:"khí hậu",pos:"n.m.",pronunciation_vi:"cli-ma"}],
    dialogue:[{speaker:"A",text:"Est-ce que tu tries tes déchets chez toi ?",en:"Do you sort your waste at home?"},{speaker:"B",text:"Oui, bien sûr. J'ai trois poubelles différentes.",en:"Yes, of course. I have three different bins."},{speaker:"A",text:"C'est bien. Moi aussi, j'essaie de réduire le plastique.",en:"Good. I try to reduce plastic too."},{speaker:"B",text:"Chaque petit geste compte pour la planète !",en:"Every small gesture counts for the planet!"}],
    exercises:[{type:"fill-blank",question:"Il faut ___ la planète.",answer:"protéger"},{type:"matching",pairs:[["recycler","tái chế"],["économiser","tiết kiệm"],["la pollution","ô nhiễm"]],instruction:"Nối từ với nghĩa"},{type:"translation",vietnamese:"Biến đổi khí hậu là vấn đề nghiêm trọng nhất.",french:"Le changement climatique est le problème le plus grave."}]},
  {id:"french_society_interview",level:"B1",category:"society",title_vi:"Phỏng vấn xin việc",title_en:"Job interviews",
    sentences:[{en:"Pouvez-vous vous présenter brièvement ?",vi:"Hãy tự giới thiệu ngắn gọn.",pronunciation_focus:["présenter→prê-dăng-tê","brièvement→bri-è-vơ-măng"]},{en:"Quelles sont vos motivations ?",vi:"Động lực của bạn là gì?",pronunciation_focus:["motivations→mô-ti-va-xi-on","nasal on"]},{en:"J'ai cinq ans d'expérience dans ce domaine.",vi:"Tôi có 5 năm kinh nghiệm.",pronunciation_focus:["expérience→éc-xpê-ri-ăng","domaine→đô-men"]},{en:"Quel est votre niveau de français ?",vi:"Trình độ tiếng Pháp thế nào?",pronunciation_focus:["niveau→ni-vô","français→frăng-xe"]},{en:"Pourquoi voulez-vous travailler chez nous ?",vi:"Tại sao muốn làm ở công ty tôi?",pronunciation_focus:["pourquoi→pua-qua","travailler→tra-va-iê"]}],
    cultural_notes_vi:"CV Pháp có ảnh. Thư xin việc viết tay được đánh giá cao. Hỏi lương bình thường ở vòng 2. Nhà tuyển dụng chú trọng bằng cấp và trường học.",
    tip_advice_vi:"Chuẩn bị 3 câu: 'Parlez-moi de vous', 'Vos qualités et défauts', 'Où vous voyez-vous dans 5 ans ?'. Kết thúc 'Je vous remercie pour cet entretien'.",
    vocabulary:[{word:"l'entretien",en:"interview",vi:"phỏng vấn",pos:"n.m.",pronunciation_vi:"lăng-trơ-tianh"},{word:"le CV",en:"resume",vi:"sơ yếu lý lịch",pos:"n.m.",pronunciation_vi:"xê-vê"},{word:"la candidature",en:"application",vi:"hồ sơ ứng tuyển",pos:"n.f.",pronunciation_vi:"căng-đi-đa-tuya"},{word:"l'expérience",en:"experience",vi:"kinh nghiệm",pos:"n.f.",pronunciation_vi:"léc-xpê-ri-ăng"},{word:"la compétence",en:"skill",vi:"kỹ năng",pos:"n.f.",pronunciation_vi:"côm-pê-tăng"},{word:"postuler",en:"to apply",vi:"ứng tuyển",pos:"v.",pronunciation_vi:"pô-xtu-lê"},{word:"le recruteur",en:"recruiter",vi:"nhà tuyển dụng",pos:"n.m.",pronunciation_vi:"rơ-cru-tơ"},{word:"la formation",en:"training",vi:"đào tạo",pos:"n.f.",pronunciation_vi:"fo-ma-xi-on"},{word:"le salaire",en:"salary",vi:"lương",pos:"n.m.",pronunciation_vi:"xa-le"},{word:"le stage",en:"internship",vi:"thực tập",pos:"n.m.",pronunciation_vi:"xta-giơ"}],
    dialogue:[{speaker:"A",text:"Bonjour, merci de me recevoir.",en:"Hello, thank you for receiving me."},{speaker:"B",text:"Parlez-moi de votre parcours.",en:"Tell me about your background."},{speaker:"A",text:"J'ai travaillé cinq ans en marketing digital.",en:"I worked five years in digital marketing."},{speaker:"B",text:"Pourquoi notre entreprise vous intéresse ?",en:"Why are you interested in our company?"}],
    exercises:[{type:"fill-blank",question:"J'ai trois ans d'___ dans ce domaine.",answer:"expérience"},{type:"matching",pairs:[["l'entretien","phỏng vấn"],["postuler","ứng tuyển"],["le recruteur","nhà tuyển dụng"]],instruction:"Nối từ với nghĩa"},{type:"translation",vietnamese:"Tôi muốn làm ở công ty này vì tôi ngưỡng mộ giá trị của nó.",french:"Je veux travailler ici parce que j'admire ses valeurs."}]},
];

const EXPRESSIONS: FrenchLesson[] = [
  {id:"french_expr_opinions",level:"B1",category:"expressions",title_vi:"Bày tỏ ý kiến",title_en:"Expressing opinions",
    sentences:[{en:"À mon avis, ce projet a du potentiel.",vi:"Theo tôi, dự án có tiềm năng.",pronunciation_focus:["avis→a-vi","projet→prô-giê","potentiel→pô-tăng-xi-en"]},{en:"Je pense que c'est une excellente idée.",vi:"Tôi nghĩ đó là ý tưởng xuất sắc.",pronunciation_focus:["pense→păng","excellente→éc-xe-lăng"]},{en:"Personnellement, je ne suis pas convaincu.",vi:"Cá nhân tôi chưa bị thuyết phục.",pronunciation_focus:["personnellement→pe-xô-nen-măng","convaincu→côn-vanh-cu"]},{en:"Il me semble que nous devrions attendre.",vi:"Tôi thấy chúng ta nên chờ.",pronunciation_focus:["semble→xăm","devrions→đơ-vri-on"]},{en:"D'un côté je comprends, de l'autre…",vi:"Một mặt tôi hiểu, mặt khác…",pronunciation_focus:["côté→cô-tê","comprends→côm-prăng"]}],
    cultural_notes_vi:"Người Pháp thích tranh luận. Cách lịch sự: 'À mon avis', 'Je pense que', 'Il me semble que'. Phản biện: 'Je ne suis pas d'accord'. Tránh 'Tu as tort'.",
    tip_advice_vi:"Khi ngắt lời lịch sự: 'Excusez-moi de vous interrompre'. Quay lại chủ đề: 'Pour en revenir à notre sujet…'",
    vocabulary:[{word:"l'avis",en:"opinion",vi:"ý kiến",pos:"n.m.",pronunciation_vi:"la-vi"},{word:"selon",en:"according to",vi:"theo",pos:"prép.",pronunciation_vi:"xơ-lon"},{word:"convaincre",en:"to convince",vi:"thuyết phục",pos:"v.",pronunciation_vi:"côn-vanh-crơ"},{word:"douter",en:"to doubt",vi:"nghi ngờ",pos:"v.",pronunciation_vi:"đu-tê"},{word:"approuver",en:"to approve",vi:"tán thành",pos:"v.",pronunciation_vi:"a-pru-vê"},{word:"contester",en:"to contest",vi:"phản đối",pos:"v.",pronunciation_vi:"côn-tét-tê"},{word:"l'argument",en:"argument",vi:"lập luận",pos:"n.m.",pronunciation_vi:"la-ghu-măng"},{word:"nuancer",en:"to qualify",vi:"nói giảm nhẹ",pos:"v.",pronunciation_vi:"nu-ăng-xê"},{word:"franchement",en:"frankly",vi:"thẳng thắn",pos:"adv.",pronunciation_vi:"frăng-sơ-măng"},{word:"partager",en:"to share",vi:"chia sẻ",pos:"v.",pronunciation_vi:"pa-ta-giê"}],
    dialogue:[{speaker:"A",text:"Que penses-tu du nouveau logo ?",en:"What do you think of the new logo?"},{speaker:"B",text:"Franchement, je ne suis pas convaincu.",en:"Frankly, I'm not convinced."},{speaker:"A",text:"Je comprends, mais je le trouve plus moderne.",en:"I understand, but I find it more modern."},{speaker:"B",text:"C'est vrai, mais il manque d'identité.",en:"True, but it lacks identity."}],
    exercises:[{type:"fill-blank",question:"___ mon avis, c'est une bonne idée.",answer:"À"},{type:"matching",pairs:[["l'avis","ý kiến"],["approuver","tán thành"],["franchement","thẳng thắn"]],instruction:"Nối từ với nghĩa"},{type:"translation",vietnamese:"Theo tôi, nên chờ thêm thông tin.",french:"À mon avis, nous devrions attendre plus d'informations."}]},
  {id:"french_expr_suggestions",level:"B1",category:"expressions",title_vi:"Đề xuất và gợi ý",title_en:"Making suggestions",
    sentences:[{en:"Et si on allait au restaurant ce soir ?",vi:"Hay tối nay đi nhà hàng?",pronunciation_focus:["allait→a-le","restaurant→rét-x-tô-răng"]},{en:"Je te propose de commencer par le plus simple.",vi:"Tôi đề nghị bắt đầu từ đơn giản nhất.",pronunciation_focus:["propose→prô-pô-dơ","commencer→cô-măng-xê"]},{en:"Pourquoi ne pas essayer une autre méthode ?",vi:"Sao không thử cách khác?",pronunciation_focus:["pourquoi→pua-qua","essayer→ê-xe-iê"]},{en:"Nous pourrions reporter la réunion.",vi:"Chúng ta có thể hoãn cuộc họp.",pronunciation_focus:["pourrions→pu-ri-on","reporter→rơ-po-tê"]},{en:"Ça te dirait de partir en week-end ?",vi:"Bạn muốn đi chơi cuối tuần không?",pronunciation_focus:["dirait→đi-re","partir→pa-tia"]}],
    cultural_notes_vi:"Người Pháp dùng nhiều cách đề xuất: câu hỏi (Et si on…?), điều kiện (On pourrait…), gợi ý nhẹ (Je te propose…). 'Pourquoi ne pas…' là cách rất Pháp.",
    tip_advice_vi:"Công việc: 'Je suggère que…'. Đồng ý: 'Bonne idée !'. Từ chối nhẹ: 'C'est une bonne idée, mais…'",
    vocabulary:[{word:"proposer",en:"to suggest",vi:"đề xuất",pos:"v.",pronunciation_vi:"prô-pô-dê"},{word:"suggérer",en:"to suggest",vi:"gợi ý",pos:"v.",pronunciation_vi:"xu-giê-rê"},{word:"si on…",en:"what if we…",vi:"nếu chúng ta…",pos:"expr.",pronunciation_vi:"xi on"},{word:"pourquoi pas",en:"why not",vi:"tại sao không",pos:"expr.",pronunciation_vi:"pua-qua pa"},{word:"ça te dit",en:"are you up for",vi:"bạn muốn",pos:"expr.",pronunciation_vi:"xa tơ đi"},{word:"l'alternative",en:"alternative",vi:"lựa chọn khác",pos:"n.f.",pronunciation_vi:"lan-te-na-tiv"},{word:"la solution",en:"solution",vi:"giải pháp",pos:"n.f.",pronunciation_vi:"xô-lu-xi-on"},{word:"envisager",en:"to consider",vi:"dự tính",pos:"v.",pronunciation_vi:"ăng-vi-da-giê"},{word:"tenter",en:"to try",vi:"thử",pos:"v.",pronunciation_vi:"tăng-tê"},{word:"recommander",en:"to recommend",vi:"khuyến nghị",pos:"v.",pronunciation_vi:"rơ-cô-măng-đê"}],
    dialogue:[{speaker:"A",text:"Je ne sais pas quoi faire ce week-end.",en:"I don't know what to do this weekend."},{speaker:"B",text:"Et si on visitait le Louvre ? C'est gratuit dimanche.",en:"What if we visited the Louvre? It's free Sunday."},{speaker:"A",text:"Bonne idée ! Ça fait longtemps.",en:"Good idea! It's been a while."},{speaker:"B",text:"Super, on se retrouve à 10h ?",en:"Great, meet at 10am?"}],
    exercises:[{type:"fill-blank",question:"Et ___ on allait au cinéma ?",answer:"si"},{type:"matching",pairs:[["proposer","đề xuất"],["envisager","dự tính"],["tenter","thử"]],instruction:"Nối từ với nghĩa"},{type:"translation",vietnamese:"Tôi đề nghị bắt đầu họp sớm 15 phút.",french:"Je propose de commencer la réunion 15 minutes plus tôt."}]},
  {id:"french_expr_apologies",level:"B1",category:"expressions",title_vi:"Xin lỗi và biện hộ",title_en:"Apologizing and giving excuses",
    sentences:[{en:"Je suis vraiment désolé pour le retard.",vi:"Tôi rất xin lỗi vì đến muộn.",pronunciation_focus:["désolé→đê-dô-lê","retard→rơ-ta"]},{en:"Excusez-moi, je ne l'ai pas fait exprès.",vi:"Xin lỗi, tôi không cố ý.",pronunciation_focus:["excusez→éc-xcu-dê","exprès→éc-xprê"]},{en:"C'est de ma faute, je prends la responsabilité.",vi:"Lỗi tôi, tôi chịu trách nhiệm.",pronunciation_focus:["faute→phô-tơ","responsabilité→rét-xpon-xa-bi-li-tê"]},{en:"Je te prie de m'excuser.",vi:"Tôi xin bạn thứ lỗi.",pronunciation_focus:["prie→pri","m'excuser→méc-xcu-dê"]},{en:"Malheureusement, je ne pourrai pas venir.",vi:"Tiếc quá, tôi không đến được.",pronunciation_focus:["malheureusement→ma-lơ-rơ-dơ-măng","pourrai→pu-re"]}],
    cultural_notes_vi:"Lời xin lỗi nhiều cấp: Pardon (nhẹ), Désolé (trung bình), Excusez-moi (lịch sự), Je vous prie de m'excuser (trang trọng). Tránh 'C'est pas grave' khi nhận lời xin lỗi.",
    tip_advice_vi:"Đi muộn: gọi điện báo. Không đến được: báo 24h trước. 'Je suis navré' mạnh hơn 'désolé'.",
    vocabulary:[{word:"désolé",en:"sorry",vi:"xin lỗi",pos:"adj.",pronunciation_vi:"đê-dô-lê"},{word:"s'excuser",en:"to apologize",vi:"xin lỗi",pos:"v.",pronunciation_vi:"xéc-xcu-dê"},{word:"le regret",en:"regret",vi:"hối tiếc",pos:"n.m.",pronunciation_vi:"rơ-gre"},{word:"la faute",en:"fault",vi:"lỗi",pos:"n.f.",pronunciation_vi:"phô-tơ"},{word:"pardonner",en:"to forgive",vi:"tha thứ",pos:"v.",pronunciation_vi:"pa-đô-nê"},{word:"navré",en:"very sorry",vi:"rất tiếc",pos:"adj.",pronunciation_vi:"na-vrê"},{word:"le malentendu",en:"misunderstanding",vi:"hiểu lầm",pos:"n.m.",pronunciation_vi:"ma-lăng-tăng-đu"},{word:"rattraper",en:"to make up for",vi:"bù đắp",pos:"v.",pronunciation_vi:"ra-tra-pê"},{word:"involontairement",en:"unintentionally",vi:"vô ý",pos:"adv.",pronunciation_vi:"anh-vô-lon-te-măng"},{word:"regrettable",en:"regrettable",vi:"đáng tiếc",pos:"adj.",pronunciation_vi:"rơ-gre-ta-blơ"}],
    dialogue:[{speaker:"A",text:"Désolé d'être en retard, le métro était bloqué.",en:"Sorry I'm late, metro was blocked."},{speaker:"B",text:"Ce n'est pas grave, ça arrive.",en:"It's okay, it happens."},{speaker:"A",text:"Je te dois un café pour me faire pardonner !",en:"I owe you a coffee to make up!"},{speaker:"B",text:"Avec plaisir, mais envoie un message la prochaine fois !",en:"With pleasure, but send a message next time!"}],
    exercises:[{type:"fill-blank",question:"Je suis ___ pour le retard.",answer:"désolé"},{type:"matching",pairs:[["s'excuser","xin lỗi"],["la faute","lỗi"],["pardonner","tha thứ"]],instruction:"Nối từ với nghĩa"},{type:"translation",vietnamese:"Xin lỗi, tôi không cố ý làm phiền.",french:"Excusez-moi, je n'ai pas fait exprès de vous déranger."}]},
  {id:"french_expr_advice",level:"B1",category:"expressions",title_vi:"Cho lời khuyên",title_en:"Giving advice",
    sentences:[{en:"Si j'étais toi, je commencerais par l'urgent.",vi:"Nếu tôi là bạn, tôi bắt đầu việc gấp.",pronunciation_focus:["étais→ê-te","commencerais→cô-măng-xơ-re"]},{en:"À ta place, je ne dirais rien.",vi:"Ở vị trí bạn, tôi sẽ không nói gì.",pronunciation_focus:["place→plát","dirais→đi-re"]},{en:"Mon conseil serait d'en parler directement.",vi:"Lời khuyên là nói chuyện trực tiếp.",pronunciation_focus:["conseil→côn-xây","directement→đi-réc-tơ-măng"]},{en:"Tu devrais prendre des vacances.",vi:"Bạn nên đi nghỉ đi.",pronunciation_focus:["devrais→đơ-vre","vacances→va-căng"]},{en:"Le mieux serait de consulter un spécialiste.",vi:"Tốt nhất là tham khảo chuyên gia.",pronunciation_focus:["mieux→mi-ơ","consulter→côn-xun-tê"]}],
    cultural_notes_vi:"Khuyên tế nhị: 'Si j'étais toi…' (nhẹ nhất), 'Tu devrais…' (mạnh hơn). Tránh mệnh lệnh. Không khuyên chủ đề nhạy cảm trừ khi được hỏi.",
    tip_advice_vi:"Công việc: 'Je vous recommande de…'. Cá nhân: 'À ta place…' thân mật hơn.",
    vocabulary:[{word:"le conseil",en:"advice",vi:"lời khuyên",pos:"n.m.",pronunciation_vi:"côn-xây"},{word:"conseiller",en:"to advise",vi:"khuyên",pos:"v.",pronunciation_vi:"côn-xê-iê"},{word:"recommander",en:"to recommend",vi:"khuyến nghị",pos:"v.",pronunciation_vi:"rơ-cô-măng-đê"},{word:"si j'étais toi",en:"if I were you",vi:"nếu là bạn",pos:"expr.",pronunciation_vi:"xi giê-tê toa"},{word:"à ta place",en:"in your shoes",vi:"ở vị trí bạn",pos:"expr.",pronunciation_vi:"a ta plát"},{word:"tu devrais",en:"you should",vi:"bạn nên",pos:"expr.",pronunciation_vi:"tu đơ-vre"},{word:"la suggestion",en:"suggestion",vi:"gợi ý",pos:"n.f.",pronunciation_vi:"xu-giét-xi-on"},{word:"prévenir",en:"to warn",vi:"cảnh báo",pos:"v.",pronunciation_vi:"prê-vơ-nia"},{word:"aider",en:"to help",vi:"giúp đỡ",pos:"v.",pronunciation_vi:"ê-đê"},{word:"soutenir",en:"to support",vi:"ủng hộ",pos:"v.",pronunciation_vi:"xu-tơ-nia"}],
    dialogue:[{speaker:"A",text:"Je ne sais pas si je dois accepter ce poste.",en:"I don't know if I should accept this job."},{speaker:"B",text:"Si j'étais toi, je prendrais le temps de réfléchir.",en:"If I were you, I'd take time to think."},{speaker:"A",text:"Mais j'ai peur qu'ils choisissent quelqu'un d'autre.",en:"But I'm afraid they'll pick someone else."},{speaker:"B",text:"Si c'est le bon poste, ils attendront.",en:"If it's right, they'll wait."}],
    exercises:[{type:"fill-blank",question:"___ j'étais toi, j'accepterais.",answer:"Si"},{type:"matching",pairs:[["le conseil","lời khuyên"],["recommander","khuyến nghị"],["soutenir","ủng hộ"]],instruction:"Nối từ với nghĩa"},{type:"translation",vietnamese:"Tôi khuyên bạn học 30 phút mỗi ngày.",french:"Je te conseille d'étudier 30 minutes par jour."}]},
  {id:"french_expr_experiences",level:"B1",category:"expressions",title_vi:"Kể về trải nghiệm",title_en:"Describing experiences",
    sentences:[{en:"J'ai passé un an à l'étranger, c'était incroyable.",vi:"Tôi sống 1 năm ở nước ngoài, tuyệt vời.",pronunciation_focus:["passé→pa-xê","étranger→ê-trăng-giê","incroyable→anh-croa-ia-blơ"]},{en:"C'est la meilleure expérience de ma vie.",vi:"Trải nghiệm tuyệt nhất đời tôi.",pronunciation_focus:["meilleure→mê-iơ","expérience→éc-xpê-ri-ăng"]},{en:"Je n'oublierai jamais ce voyage au Vietnam.",vi:"Tôi không quên chuyến đi VN.",pronunciation_focus:["oublierai→u-bli-ơ-re","voyage→voa-ia-giơ"]},{en:"Quand j'étais petit, j'habitais à la campagne.",vi:"Hồi nhỏ tôi sống ở nông thôn.",pronunciation_focus:["étais→ê-te","habitais→a-bi-te","campagne→căm-pa-nhơ"]},{en:"Cette rencontre a changé ma vision des choses.",vi:"Cuộc gặp này thay đổi cách nhìn của tôi.",pronunciation_focus:["rencontre→răng-côn-trơ","changé→săng-giê"]}],
    cultural_notes_vi:"Người Pháp thích kể chuyện. Dùng passé composé cho sự kiện, imparfait cho bối cảnh. Thêm cảm xúc: 'C'était magnifique !', 'Quelle surprise !'",
    tip_advice_vi:"Mở đầu: 'Laisse-moi te raconter…'. Dùng cử chỉ tay khi kể — người Pháp diễn tả rất nhiều.",
    vocabulary:[{word:"raconter",en:"to tell",vi:"kể",pos:"v.",pronunciation_vi:"ra-côn-tê"},{word:"l'expérience",en:"experience",vi:"trải nghiệm",pos:"n.f.",pronunciation_vi:"léc-xpê-ri-ăng"},{word:"le souvenir",en:"memory",vi:"kỷ niệm",pos:"n.m.",pronunciation_vi:"xu-vơ-nia"},{word:"inoubliable",en:"unforgettable",vi:"khó quên",pos:"adj.",pronunciation_vi:"i-nu-bli-a-blơ"},{word:"voyager",en:"to travel",vi:"du lịch",pos:"v.",pronunciation_vi:"voa-ia-giê"},{word:"découvrir",en:"to discover",vi:"khám phá",pos:"v.",pronunciation_vi:"đê-cu-vria"},{word:"l'aventure",en:"adventure",vi:"phiêu lưu",pos:"n.f.",pronunciation_vi:"la-văng-tuya"},{word:"l'émotion",en:"emotion",vi:"cảm xúc",pos:"n.f.",pronunciation_vi:"lê-mô-xi-on"},{word:"marquant",en:"memorable",vi:"đáng nhớ",pos:"adj.",pronunciation_vi:"ma-căng"},{word:"partager",en:"to share",vi:"chia sẻ",pos:"v.",pronunciation_vi:"pa-ta-giê"}],
    dialogue:[{speaker:"A",text:"Raconte-moi ton voyage au Vietnam !",en:"Tell me about your Vietnam trip!"},{speaker:"B",text:"C'était incroyable ! Hanoï, Hoi An, HCM-Ville.",en:"Incredible! Hanoi, Hoi An, HCMC."},{speaker:"A",text:"Qu'est-ce qui t'a le plus marqué ?",en:"What impressed you most?"},{speaker:"B",text:"La nourriture ! Le phở est inoubliable.",en:"The food! Pho is unforgettable."}],
    exercises:[{type:"fill-blank",question:"J'ai passé un mois ___ Vietnam.",answer:"au"},{type:"matching",pairs:[["raconter","kể"],["inoubliable","khó quên"],["découvrir","khám phá"]],instruction:"Nối từ với nghĩa"},{type:"translation",vietnamese:"Tôi không quên lần đầu đến Paris.",french:"Je n'oublierai jamais la première fois à Paris."}]},
];
// ── ADVANCED_GRAMMAR ──
const ADVANCED_GRAMMAR: FrenchLesson[] = [
  {id:"french_grammar_compare",level:"B1",category:"advanced_grammar",title_vi:"So sánh trong tiếng Pháp",title_en:"Comparisons in French",
    sentences:[{en:"Paris est plus grand que Lyon.",vi:"Paris lớn hơn Lyon.",pronunciation_focus:["plus→plu","grand→grăng"]},{en:"Ce restaurant est moins cher.",vi:"Nhà hàng này rẻ hơn.",pronunciation_focus:["moins→moanh","cher→se"]},{en:"Marie est aussi intelligente que Paul.",vi:"Marie thông minh ngang Paul.",pronunciation_focus:["aussi→ô-xi","intelligente→anh-te-li-giăng"]},{en:"C'est le meilleur film que j'aie vu.",vi:"Đây là phim hay nhất tôi xem.",pronunciation_focus:["meilleur→mê-iơ","film→fìlm"]},{en:"Cette solution est la pire.",vi:"Giải pháp này tệ nhất.",pronunciation_focus:["pire→pia","solution→xô-lu-xi-on"]}],
    cultural_notes_vi:"So sánh: plus... que (hơn), moins... que (kém), aussi... que (bằng). Bất quy tắc: bon→meilleur, bien→mieux, mauvais→pire.",
    tip_advice_vi:"'Meilleur' là tính từ, 'mieux' là trạng từ. Lỗi phổ biến nhất: 'Ce gâteau est meilleur' vs 'Elle chante mieux'.",
    vocabulary:[{word:"plus...que",en:"more...than",vi:"hơn",pos:"expr.",pronunciation_vi:"plu…cơ"},{word:"moins...que",en:"less...than",vi:"kém hơn",pos:"expr.",pronunciation_vi:"moanh…cơ"},{word:"aussi...que",en:"as...as",vi:"bằng",pos:"expr.",pronunciation_vi:"ô-xi…cơ"},{word:"meilleur",en:"better",vi:"tốt hơn",pos:"adj.",pronunciation_vi:"mê-iơ"},{word:"pire",en:"worse",vi:"tệ hơn",pos:"adj.",pronunciation_vi:"pia"},{word:"mieux",en:"better (adv)",vi:"tốt hơn",pos:"adv.",pronunciation_vi:"mi-ơ"},{word:"le meilleur",en:"the best",vi:"tốt nhất",pos:"adj.",pronunciation_vi:"mê-iơ"},{word:"le pire",en:"the worst",vi:"tệ nhất",pos:"adj.",pronunciation_vi:"pia"},{word:"comparer",en:"to compare",vi:"so sánh",pos:"v.",pronunciation_vi:"côn-pa-rê"},{word:"égal",en:"equal",vi:"bằng nhau",pos:"adj.",pronunciation_vi:"ê-gan"}],
    dialogue:[{speaker:"A",text:"Lyon ou Marseille, tu préfères ?",en:"Lyon or Marseille, which do you prefer?"},{speaker:"B",text:"Lyon est plus élégante, Marseille plus vivante.",en:"Lyon is more elegant, Marseille livelier."},{speaker:"A",text:"Et pour la nourriture ?",en:"And for food?"},{speaker:"B",text:"Lyon est la meilleure pour la gastronomie !",en:"Lyon is best for gastronomy!"}],
    exercises:[{type:"fill-blank",question:"Paris est ___ grand que Marseille.",answer:"plus"},{type:"matching",pairs:[["plus...que","hơn"],["meilleur","tốt hơn"],["le pire","tệ nhất"]],instruction:"Nối từ với nghĩa"},{type:"translation",vietnamese:"Phim này hay hơn phim tuần trước.",french:"Ce film est meilleur que celui de la semaine dernière."}]},
  {id:"french_grammar_hypothetical",level:"B1",category:"advanced_grammar",title_vi:"Tình huống giả định",title_en:"Hypothetical situations",
    sentences:[{en:"Si j'avais plus d'argent, je voyagerais.",vi:"Nếu có tiền, tôi sẽ du lịch.",pronunciation_focus:["avais→a-ve","voyagerais→voa-ia-giơ-re"]},{en:"Si tu étudiais plus, tu réussirais.",vi:"Nếu học nhiều hơn, bạn sẽ đỗ.",pronunciation_focus:["étudiais→ê-tu-đi-e","réussirais→rê-u-xi-re"]},{en:"J'aimerais habiter à la montagne.",vi:"Tôi muốn sống trên núi.",pronunciation_focus:["aimerais→ê-mơ-re","montagne→môn-ta-nhơ"]},{en:"Il faudrait qu'on se voie plus souvent.",vi:"Chúng ta nên gặp thường xuyên hơn.",pronunciation_focus:["faudrait→phô-đre","souvent→xu-văng"]},{en:"À ta place, je n'accepterais pas.",vi:"Ở vị trí bạn, tôi không nhận.",pronunciation_focus:["accepterais→ác-xép-tơ-re"]}],
    cultural_notes_vi:"Si + imparfait → conditionnel présent (giả định). Conditionnel dùng: đề nghị lịch sự (Je voudrais), ước muốn (J'aimerais), lời khuyên (Tu devrais).",
    tip_advice_vi:"Phân biệt: 'Si j'avais' (giả định) vs 'Quand j'avais' (thực tế). Conditionnel đuôi -ais, -ais, -ait, -ions, -iez, -aient.",
    vocabulary:[{word:"si",en:"if",vi:"nếu",pos:"conj.",pronunciation_vi:"xi"},{word:"le conditionnel",en:"conditional",vi:"thể điều kiện",pos:"n.m.",pronunciation_vi:"côn-đi-xi-ô-nen"},{word:"j'aimerais",en:"I would like",vi:"tôi muốn",pos:"expr.",pronunciation_vi:"giê-mơ-re"},{word:"je voudrais",en:"I would like",vi:"tôi muốn",pos:"expr.",pronunciation_vi:"giơ vu-đre"},{word:"je devrais",en:"I should",vi:"tôi nên",pos:"expr.",pronunciation_vi:"giơ đơ-vre"},{word:"imaginer",en:"to imagine",vi:"tưởng tượng",pos:"v.",pronunciation_vi:"i-ma-gi-nê"},{word:"l'hypothèse",en:"hypothesis",vi:"giả thuyết",pos:"n.f.",pronunciation_vi:"li-pô-te-dơ"},{word:"irréel",en:"unreal",vi:"không thật",pos:"adj.",pronunciation_vi:"i-rê-en"},{word:"le rêve",en:"dream",vi:"giấc mơ",pos:"n.m.",pronunciation_vi:"rê-vơ"},{word:"supposer",en:"to suppose",vi:"giả sử",pos:"v.",pronunciation_vi:"xu-pô-dê"}],
    dialogue:[{speaker:"A",text:"Si tu gagnais au loto, tu ferais quoi ?",en:"If you won the lotto, what would you do?"},{speaker:"B",text:"Je voyagerais partout, j'achèterais une maison.",en:"I'd travel everywhere, buy a house."},{speaker:"A",text:"Tu ne travaillerais plus ?",en:"You wouldn't work anymore?"},{speaker:"B",text:"Je travaillerais moins, j'ouvrirais un café.",en:"I'd work less, open a café."}],
    exercises:[{type:"fill-blank",question:"Si j'___ riche, j'achèterais une maison.",answer:"étais"},{type:"matching",pairs:[["j'aimerais","tôi muốn"],["le conditionnel","thể điều kiện"],["le rêve","giấc mơ"]],instruction:"Nối từ với nghĩa"},{type:"translation",vietnamese:"Nếu có thời gian, tôi học thêm ngôn ngữ.",french:"Si j'avais le temps, j'apprendrais une autre langue."}]},
  {id:"french_grammar_reported",level:"B1",category:"advanced_grammar",title_vi:"Câu tường thuật",title_en:"Reported speech",
    sentences:[{en:"Il a dit qu'il viendrait demain.",vi:"Anh ấy nói sẽ đến mai.",pronunciation_focus:["dit→đi","viendrait→vi-anh-đre"]},{en:"Elle m'a demandé si je parlais français.",vi:"Cô ấy hỏi tôi có nói tiếng Pháp không.",pronunciation_focus:["demandé→đơ-măng-đê","parlais→pa-lê"]},{en:"Il a expliqué que la Terre est ronde.",vi:"Anh ấy giải thích Trái Đất tròn.",pronunciation_focus:["expliqué→éc-xpli-kê","Terre→te"]},{en:"Il voulait savoir où j'habitais.",vi:"Anh ấy muốn biết tôi ở đâu.",pronunciation_focus:["voulait→vu-le","j'habitais→gia-bi-te"]},{en:"Elle m'a dit de ne pas m'inquiéter.",vi:"Cô ấy bảo đừng lo.",pronunciation_focus:["dit→đi","m'inquiéter→manh-ki-ê-tê"]}],
    cultural_notes_vi:"Lùi thì: Présent→Imparfait, Futur→Conditionnel. Câu hỏi Yes/No dùng 'si'. Mệnh lệnh→de+infinitif. Sự thật hiển nhiên không lùi thì.",
    tip_advice_vi:"3 động từ chính: dire que, demander si, vouloir savoir. 'Il m'a dit que', 'Il lui a dit que', 'Il a dit à Marie que'.",
    vocabulary:[{word:"dire",en:"to say",vi:"nói",pos:"v.",pronunciation_vi:"đia"},{word:"demander",en:"to ask",vi:"hỏi",pos:"v.",pronunciation_vi:"đơ-măng-đê"},{word:"répondre",en:"to answer",vi:"trả lời",pos:"v.",pronunciation_vi:"rê-pôn-đrơ"},{word:"expliquer",en:"to explain",vi:"giải thích",pos:"v.",pronunciation_vi:"éc-xpli-kê"},{word:"raconter",en:"to tell",vi:"kể",pos:"v.",pronunciation_vi:"ra-côn-tê"},{word:"affirmer",en:"to state",vi:"khẳng định",pos:"v.",pronunciation_vi:"a-fia-mê"},{word:"le discours",en:"speech",vi:"lời nói",pos:"n.m.",pronunciation_vi:"đi-xcua"},{word:"rapporter",en:"to report",vi:"thuật lại",pos:"v.",pronunciation_vi:"ra-po-tê"},{word:"prétendre",en:"to claim",vi:"cho rằng",pos:"v.",pronunciation_vi:"prê-tăng-đrơ"},{word:"la concordance",en:"agreement",vi:"phù hợp thì",pos:"n.f.",pronunciation_vi:"côn-co-đăng-xơ"}],
    dialogue:[{speaker:"A",text:"Qu'a dit le directeur ?",en:"What did the director say?"},{speaker:"B",text:"Il a annoncé qu'on ouvrirait un bureau à Lyon.",en:"He announced we'd open an office in Lyon."},{speaker:"A",text:"Il a dit quand ?",en:"Did he say when?"},{speaker:"B",text:"Il a expliqué que ce serait en septembre.",en:"He explained it would be in September."}],
    exercises:[{type:"fill-blank",question:"Il a dit qu'il ___ demain.",answer:"viendrait"},{type:"matching",pairs:[["dire","nói"],["rapporter","thuật lại"],["affirmer","khẳng định"]],instruction:"Nối từ với nghĩa"},{type:"translation",vietnamese:"Cô ấy nói sẽ gọi lại mai.",french:"Elle a dit qu'elle rappellerait demain."}]},
  {id:"french_grammar_passive",level:"B1",category:"advanced_grammar",title_vi:"Thể bị động",title_en:"Passive voice",
    sentences:[{en:"Ce bâtiment a été construit en 1920.",vi:"Tòa nhà xây năm 1920.",pronunciation_focus:["bâtiment→ba-ti-măng","construit→côn-xtruy"]},{en:"Le français est parlé dans 30 pays.",vi:"Tiếng Pháp được nói ở 30 nước.",pronunciation_focus:["parlé→pa-lê","pays→pê-i"]},{en:"La décision sera annoncée demain.",vi:"Quyết định được thông báo mai.",pronunciation_focus:["décision→đê-xi-zi-on","annoncée→a-non-xê"]},{en:"Les lettres sont distribuées le matin.",vi:"Thư được phát buổi sáng.",pronunciation_focus:["distribuées→đi-xtri-bu-ê","matin→ma-tanh"]},{en:"Ce vin est produit à Bordeaux.",vi:"Rượu này sản xuất ở Bordeaux.",pronunciation_focus:["produit→prô-đuy","Bordeaux→Bo-đô"]}],
    cultural_notes_vi:"Bị động: être + participe passé. Participle hợp giống số. Người Pháp tránh bị động bằng 'on': 'On parle français'.",
    tip_advice_vi:"Dùng bị động khi chủ thể không rõ/quan trọng. 'Par' cho tác nhân cụ thể, 'de' cho trạng thái.",
    vocabulary:[{word:"être + participe",en:"to be + pp",vi:"được/bị",pos:"expr.",pronunciation_vi:"ê-trơ"},{word:"construit",en:"built",vi:"được xây",pos:"adj.",pronunciation_vi:"côn-xtruy"},{word:"écrit",en:"written",vi:"được viết",pos:"adj.",pronunciation_vi:"ê-cri"},{word:"par",en:"by (agent)",vi:"bởi",pos:"prép.",pronunciation_vi:"pa"},{word:"la voix passive",en:"passive voice",vi:"thể bị động",pos:"n.f.",pronunciation_vi:"voa pa-xiv"},{word:"actif",en:"active",vi:"chủ động",pos:"adj.",pronunciation_vi:"ắc-tif"},{word:"subir",en:"to undergo",vi:"chịu đựng",pos:"v.",pronunciation_vi:"xu-bia"},{word:"provoquer",en:"to cause",vi:"gây ra",pos:"v.",pronunciation_vi:"prô-vô-kê"},{word:"transformer",en:"to transform",vi:"biến đổi",pos:"v.",pronunciation_vi:"trăng-xfo-mê"},{word:"le résultat",en:"result",vi:"kết quả",pos:"n.m.",pronunciation_vi:"rê-dun-ta"}],
    dialogue:[{speaker:"A",text:"Quand la Tour Eiffel a été construite ?",en:"When was the Eiffel Tower built?"},{speaker:"B",text:"Elle a été construite en 1889.",en:"It was built in 1889."},{speaker:"A",text:"Combien de visiteurs par an ?",en:"How many visitors per year?"},{speaker:"B",text:"Environ 7 millions. C'est le plus visité au monde !",en:"About 7 million. Most visited in the world!"}],
    exercises:[{type:"fill-blank",question:"La Tour Eiffel a ___ construite en 1889.",answer:"été"},{type:"matching",pairs:[["construit","được xây"],["subir","chịu đựng"],["la voix passive","thể bị động"]],instruction:"Nối từ với nghĩa"},{type:"translation",vietnamese:"Quyết định được ban giám đốc đưa ra.",french:"La décision a été prise par la direction."}]},
  {id:"french_grammar_relative",level:"B1",category:"advanced_grammar",title_vi:"Mệnh đề quan hệ",title_en:"Relative clauses",
    sentences:[{en:"La personne qui parle est ma prof.",vi:"Người đang nói là cô giáo tôi.",pronunciation_focus:["personne→pe-xôn","parle→pa-lơ"]},{en:"Le livre que je lis est passionnant.",vi:"Cuốn sách tôi đọc rất hay.",pronunciation_focus:["livre→li-vrơ","lis→li"]},{en:"La ville où je suis né est belle.",vi:"Thành phố tôi sinh ra đẹp.",pronunciation_focus:["ville→vil","né→nê"]},{en:"C'est la raison pour laquelle je suis parti.",vi:"Đó là lý do tôi rời đi.",pronunciation_focus:["raison→re-don","laquelle→la-kén"]},{en:"Le film dont je t'ai parlé sort demain.",vi:"Phim tôi nói với bạn ra mắt mai.",pronunciation_focus:["dont→đon","sort→xo"]}],
    cultural_notes_vi:"QUI (chủ ngữ), QUE (tân ngữ), OÙ (nơi/thời gian), DONT (bổ ngữ 'de'). Lequel/laquelle sau giới từ.",
    tip_advice_vi:"QUI+động từ, QUE+chủ ngữ+động từ. DONT thay cho 'de+qqch': 'le livre dont j'ai besoin'.",
    vocabulary:[{word:"qui",en:"who (subject)",vi:"mà-chủ ngữ",pos:"pron.",pronunciation_vi:"ki"},{word:"que",en:"whom (object)",vi:"mà-tân ngữ",pos:"pron.",pronunciation_vi:"cơ"},{word:"où",en:"where/when",vi:"nơi/khi",pos:"pron.",pronunciation_vi:"u"},{word:"dont",en:"of which",vi:"mà-của",pos:"pron.",pronunciation_vi:"đon"},{word:"lequel",en:"which (prep)",vi:"cái mà",pos:"pron.",pronunciation_vi:"lơ-kén"},{word:"la proposition",en:"clause",vi:"mệnh đề",pos:"n.f.",pronunciation_vi:"prô-pô-zi-xi-on"},{word:"relative",en:"relative",vi:"quan hệ",pos:"adj.",pronunciation_vi:"rơ-la-tiv"},{word:"l'antécédent",en:"antecedent",vi:"tiền tố",pos:"n.m.",pronunciation_vi:"lăng-tê-xê-đăng"},{word:"remplacer",en:"to replace",vi:"thay thế",pos:"v.",pronunciation_vi:"răm-pla-xê"},{word:"préciser",en:"to specify",vi:"làm rõ",pos:"v.",pronunciation_vi:"prê-xi-dê"}],
    dialogue:[{speaker:"A",text:"Tu te souviens du resto dont j'ai parlé ?",en:"Remember the restaurant I mentioned?"},{speaker:"B",text:"Celui qui fait les meilleures crêpes ?",en:"The one that makes the best crêpes?"},{speaker:"A",text:"Oui ! J'y vais ce soir.",en:"Yes! I'm going tonight."},{speaker:"B",text:"Super ! Dis-moi ce que tu en penses.",en:"Great! Tell me what you think."}],
    exercises:[{type:"fill-blank",question:"Le film ___ je t'ai parlé sort demain.",answer:"dont"},{type:"matching",pairs:[["qui","mà-chủ ngữ"],["dont","mà-của"],["où","nơi/khi"]],instruction:"Nối từ với nghĩa"},{type:"translation",vietnamese:"Người phụ nữ bạn gặp hôm qua là sếp tôi.",french:"La femme que tu as rencontrée hier est ma patronne."}]},
];

// ── FLUENCY ──
const FLUENCY: FrenchLesson[] = [
  {id:"french_fluency_conditional",level:"B2",category:"fluency",title_vi:"Câu điều kiện nâng cao",title_en:"Advanced conditionals",
    sentences:[{en:"Si tu étais venu, tu aurais rencontré ma famille.",vi:"Nếu bạn đến, bạn đã gặp gia đình tôi.",pronunciation_focus:["venu→vơ-nu","aurais→ô-re"]},{en:"Si j'avais su, je ne serais pas venu.",vi:"Nếu biết, tôi đã không đến.",pronunciation_focus:["avais→a-ve","serais→xơ-re"]},{en:"Au cas où tu aurais besoin d'aide, appelle-moi.",vi:"Phòng khi cần giúp, gọi tôi.",pronunciation_focus:["cas→ca","aurais→ô-re"]},{en:"Même si tu demandais, je refuserais.",vi:"Ngay cả khi bạn yêu cầu, tôi từ chối.",pronunciation_focus:["même→mê-mơ","refuserais→rơ-phu-dơ-re"]},{en:"Pourvu qu'il fasse beau demain !",vi:"Miễn là mai trời đẹp!",pronunciation_focus:["pourvu→pua-vu","fasse→phát"]}],
    cultural_notes_vi:"3 loại: (1) Si+présent→futur (2) Si+imparfait→conditionnel (3) Si+plus-que-parfait→conditionnel passé. 'Au cas où'+conditionnel, 'même si'+indicatif.",
    tip_advice_vi:"Subjonctif: 'pour que', 'avant que', 'bien que', 'à condition que'. 'Pourvu que' = miễn là.",
    vocabulary:[{word:"au cas où",en:"in case",vi:"phòng khi",pos:"expr.",pronunciation_vi:"ô ca u"},{word:"même si",en:"even if",vi:"ngay cả khi",pos:"expr.",pronunciation_vi:"mê-mơ xi"},{word:"pourvu que",en:"provided that",vi:"miễn là",pos:"conj.",pronunciation_vi:"pua-vu cơ"},{word:"à condition que",en:"on condition that",vi:"với điều kiện",pos:"conj.",pronunciation_vi:"a côn-đi-xi-on cơ"},{word:"le subjonctif",en:"subjunctive",vi:"thể giả định",pos:"n.m.",pronunciation_vi:"xup-giônc-tif"},{word:"l'irréel",en:"unreal",vi:"phi thực",pos:"n.m.",pronunciation_vi:"li-rê-en"},{word:"la conséquence",en:"consequence",vi:"hậu quả",pos:"n.f.",pronunciation_vi:"côn-xê-căng"},{word:"entraîner",en:"to entail",vi:"dẫn đến",pos:"v.",pronunciation_vi:"ăng-tre-nê"},{word:"supposer",en:"to suppose",vi:"giả sử",pos:"v.",pronunciation_vi:"xu-pô-dê"},{word:"à moins que",en:"unless",vi:"trừ khi",pos:"conj.",pronunciation_vi:"a moanh cơ"}],
    dialogue:[{speaker:"A",text:"Si tu avais su pour la grève, tu aurais fait quoi ?",en:"If you'd known about the strike, what would you have done?"},{speaker:"B",text:"J'aurais pris la voiture ou reporté le voyage.",en:"I'd have taken the car or postponed."},{speaker:"A",text:"C'est dur de changer ses plans à la dernière minute.",en:"It's hard to change plans last minute."},{speaker:"B",text:"Oui. Au cas où, préviens-moi et je t'aiderai.",en:"Yes. In case, let me know and I'll help."}],
    exercises:[{type:"fill-blank",question:"Si j'avais su, je ___ venu plus tôt.",answer:"serais"},{type:"matching",pairs:[["au cas où","phòng khi"],["à moins que","trừ khi"],["pourvu que","miễn là"]],instruction:"Nối từ với nghĩa"},{type:"translation",vietnamese:"Nếu biết trước, tôi đã chuẩn bị tốt hơn.",french:"Si j'avais su à l'avance, je me serais mieux préparé."}]},
  {id:"french_fluency_idioms",level:"B2",category:"fluency",title_vi:"Thành ngữ thông dụng",title_en:"Common French idioms",
    sentences:[{en:"Ça coûte les yeux de la tête !",vi:"Nó đắt cắt cổ!",pronunciation_focus:["coûte→cút","yeux→di-ơ"]},{en:"J'ai un coup de foudre pour elle.",vi:"Tôi yêu từ cái nhìn đầu tiên.",pronunciation_focus:["coup→cu","foudre→fu-đrơ"]},{en:"Il pleut des cordes aujourd'hui.",vi:"Hôm nay mưa như trút.",pronunciation_focus:["pleut→plơ","cordes→co-đơ"]},{en:"Ce n'est pas la mer à boire !",vi:"Có khó gì đâu!",pronunciation_focus:["mer→me","boire→boa"]},{en:"Quand les poules auront des dents !",vi:"Khi nào gà có răng!",pronunciation_focus:["poules→pun","dents→đăng"]}],
    cultural_notes_vi:"Thành ngữ Pháp dùng hàng ngày. 'Poser un lapin' (cho leo cây), 'Avoir le cafard' (buồn), 'Être dans la lune' (mơ màng).",
    tip_advice_vi:"Học 2-3 thành ngữ mỗi tuần. Đừng dịch từng từ. 'Appeler un chat un chat' = nói thẳng.",
    vocabulary:[{word:"l'expression",en:"expression",vi:"thành ngữ",pos:"n.f.",pronunciation_vi:"léc-xpre-xi-on"},{word:"le proverbe",en:"proverb",vi:"tục ngữ",pos:"n.m.",pronunciation_vi:"prô-ve-bơ"},{word:"coûter les yeux de la tête",en:"cost a fortune",vi:"đắt cắt cổ",pos:"expr.",pronunciation_vi:"cu-tê lê-di-ơ đơ la tét"},{word:"avoir le cafard",en:"feel down",vi:"buồn chán",pos:"expr.",pronunciation_vi:"a-voa lơ ca-pha"},{word:"poser un lapin",en:"stand up",vi:"cho leo cây",pos:"expr.",pronunciation_vi:"pô-dê ưnh la-panh"},{word:"donner sa langue au chat",en:"give up guessing",vi:"chịu thua",pos:"expr.",pronunciation_vi:"đô-nê xa lăng-gơ ô sa"},{word:"appeler un chat un chat",en:"call a spade a spade",vi:"nói thẳng",pos:"expr.",pronunciation_vi:"a-pơ-lê ưnh sa"},{word:"métaphorique",en:"metaphorical",vi:"nghĩa bóng",pos:"adj.",pronunciation_vi:"mê-ta-phô-ríc"},{word:"le sens figuré",en:"figurative meaning",vi:"nghĩa bóng",pos:"n.m.",pronunciation_vi:"săng fi-gu-rê"},{word:"courant",en:"common",vi:"thông dụng",pos:"adj.",pronunciation_vi:"cu-răng"}],
    dialogue:[{speaker:"A",text:"Alors, ton rendez-vous hier soir ?",en:"So, your date last night?"},{speaker:"B",text:"Elle m'a posé un lapin ! J'ai attendu une heure.",en:"She stood me up! I waited an hour."},{speaker:"A",text:"Oh non. Tu as le cafard ?",en:"Oh no. Are you feeling down?"},{speaker:"B",text:"Un peu, mais ce n'est pas la mer à boire !",en:"A bit, but it's not the end of the world!"}],
    exercises:[{type:"fill-blank",question:"Ce sac coûte les ___ de la tête !",answer:"yeux"},{type:"matching",pairs:[["poser un lapin","cho leo cây"],["avoir le cafard","buồn chán"],["appeler un chat un chat","nói thẳng"]],instruction:"Nối thành ngữ với nghĩa"},{type:"translation",vietnamese:"Đừng lo, có khó gì đâu!",french:"Ne t'inquiète pas, ce n'est pas la mer à boire !"}]},
  {id:"french_fluency_slang",level:"B2",category:"fluency",title_vi:"Tiếng lóng hàng ngày",title_en:"Everyday French slang",
    sentences:[{en:"C'est ouf ce qu'il a dit ! (ouf=fou)",vi:"Thật điên những gì anh ấy nói!",pronunciation_focus:["ouf→úf","dit→đi"]},{en:"Je suis crevé après cette journée.",vi:"Tôi kiệt sức sau ngày hôm nay.",pronunciation_focus:["crevé→crơ-vê","journée→giua-nê"]},{en:"On se fait un ciné ce soir ?",vi:"Tối đi xem phim không?",pronunciation_focus:["ciné→xi-nê","soir→xoa"]},{en:"C'est relou, cette situation.",vi:"Tình huống này phiền quá.",pronunciation_focus:["relou→rơ-lu","situation→xi-tu-a-xi-on"]},{en:"Laisse tomber, c'est pas grave !",vi:"Bỏ đi, không sao!",pronunciation_focus:["laisse→lét","tomber→tôn-bê"]}],
    cultural_notes_vi:"Verlan (nói ngược) phổ biến: femme→meuf, fou→ouf, lourd→relou. Từ rút gọn: appart, resto, ordi, sympa.",
    tip_advice_vi:"Học để hiểu nhưng cẩn thận khi dùng. Với sếp dùng tiếng chuẩn. 'Mec' vs 'homme', 'bouquin' vs 'livre'.",
    vocabulary:[{word:"le verlan",en:"backward slang",vi:"tiếng lóng ngược",pos:"n.m.",pronunciation_vi:"ve-lăng"},{word:"ouf",en:"crazy",vi:"điên",pos:"adj.",pronunciation_vi:"úf"},{word:"meuf",en:"woman (verlan)",vi:"phụ nữ",pos:"n.f.",pronunciation_vi:"mơf"},{word:"crevé",en:"exhausted",vi:"kiệt sức",pos:"adj.",pronunciation_vi:"crơ-vê"},{word:"le boulot",en:"job",vi:"công việc",pos:"n.m.",pronunciation_vi:"bu-lô"},{word:"le fric",en:"cash",vi:"tiền",pos:"n.m.",pronunciation_vi:"fríc"},{word:"la bouffe",en:"food",vi:"đồ ăn",pos:"n.f.",pronunciation_vi:"buf"},{word:"sympa",en:"nice",vi:"dễ thương",pos:"adj.",pronunciation_vi:"xanh-pa"},{word:"laisse tomber",en:"forget it",vi:"bỏ đi",pos:"expr.",pronunciation_vi:"lét tôn-bê"},{word:"le truc",en:"thing",vi:"cái/thứ",pos:"n.m.",pronunciation_vi:"truc"}],
    dialogue:[{speaker:"A",text:"T'as vu ce film ? Il est ouf !",en:"Did you see that movie? It's crazy!"},{speaker:"B",text:"Non, j'ai trop de boulot. Je suis crevé.",en:"No, too much work. I'm exhausted."},{speaker:"A",text:"Laisse tomber le boulot, on va au ciné !",en:"Forget work, let's go to the movies!"},{speaker:"B",text:"OK, t'as raison. Rendez-vous à 20h.",en:"OK, you're right. Meet at 8pm."}],
    exercises:[{type:"fill-blank",question:"Je suis ___ après cette semaine.",answer:"crevé"},{type:"matching",pairs:[["le boulot","công việc"],["la bouffe","đồ ăn"],["sympa","dễ thương"]],instruction:"Nối tiếng lóng với nghĩa"},{type:"translation",vietnamese:"Bộ phim đó điên rồ, bạn phải xem!",french:"Ce film est ouf, tu dois le voir !"}]},
  {id:"french_fluency_debate",level:"B2",category:"fluency",title_vi:"Kỹ năng tranh luận",title_en:"Debating skills",
    sentences:[{en:"Je suis d'accord avec toi sur ce point.",vi:"Tôi đồng ý điểm này.",pronunciation_focus:["d'accord→đa-co","point→poanh"]},{en:"Je ne partage pas votre avis.",vi:"Tôi không chia sẻ ý kiến bạn.",pronunciation_focus:["partage→pa-ta-giơ","avis→a-vi"]},{en:"Pourriez-vous préciser votre argument ?",vi:"Làm rõ lập luận được không?",pronunciation_focus:["préciser→prê-xi-dê","argument→a-ghu-măng"]},{en:"Ce que vous dites est intéressant, cependant…",vi:"Điều bạn nói thú vị, tuy nhiên…",pronunciation_focus:["intéressant→anh-tê-rê-xăng","cependant→xơ-păng-đăng"]},{en:"Revenons au cœur du débat.",vi:"Quay lại trọng tâm tranh luận.",pronunciation_focus:["revenons→rơ-vơ-non","cœur→cơ"]}],
    cultural_notes_vi:"Tranh luận Pháp là nghệ thuật: thèse→antithèse→synthèse. 'Certes… mais…' vừa công nhận vừa phản biện. Không công kích cá nhân.",
    tip_advice_vi:"Cụm hữu ích: 'Je vois ce que vous voulez dire, mais…', 'Permettez-moi de nuancer', 'Pour résumer', 'En conclusion'.",
    vocabulary:[{word:"débattre",en:"to debate",vi:"tranh luận",pos:"v.",pronunciation_vi:"đê-bát-trơ"},{word:"l'argument",en:"argument",vi:"lập luận",pos:"n.m.",pronunciation_vi:"la-ghu-măng"},{word:"le contre-argument",en:"counter-argument",vi:"phản luận",pos:"n.m.",pronunciation_vi:"côn-trơ-a-ghu-măng"},{word:"cependant",en:"however",vi:"tuy nhiên",pos:"adv.",pronunciation_vi:"xơ-păng-đăng"},{word:"néanmoins",en:"nevertheless",vi:"dù sao",pos:"adv.",pronunciation_vi:"nê-anh-moanh"},{word:"certes…mais",en:"admittedly…but",vi:"đúng là…nhưng",pos:"expr.",pronunciation_vi:"xéc-tơ…me"},{word:"la thèse",en:"thesis",vi:"luận điểm",pos:"n.f.",pronunciation_vi:"té-dơ"},{word:"l'antithèse",en:"counter-thesis",vi:"phản đề",pos:"n.f.",pronunciation_vi:"lăng-ti-té-dơ"},{word:"la synthèse",en:"synthesis",vi:"tổng hợp",pos:"n.f.",pronunciation_vi:"xanh-té-dơ"},{word:"nuancer",en:"to qualify",vi:"nói giảm nhẹ",pos:"v.",pronunciation_vi:"nu-ăng-xê"}],
    dialogue:[{speaker:"A",text:"Les réseaux sociaux sont mauvais pour la société.",en:"Social media is bad for society."},{speaker:"B",text:"Certes, mais ils permettent aussi de connecter les gens.",en:"Admittedly, but they also connect people."},{speaker:"A",text:"Je vois, cependant la désinformation est un problème.",en:"I see, however misinformation is a problem."},{speaker:"B",text:"La solution serait de mieux éduquer les utilisateurs.",en:"The solution would be to better educate users."}],
    exercises:[{type:"fill-blank",question:"Je suis ___ avec vous sur ce point.",answer:"d'accord"},{type:"matching",pairs:[["cependant","tuy nhiên"],["la thèse","luận điểm"],["débattre","tranh luận"]],instruction:"Nối từ với nghĩa"},{type:"translation",vietnamese:"Tôi hiểu quan điểm bạn, nhưng có cách nhìn khác.",french:"Je comprends votre point de vue, mais il y a une autre perspective."}]},
  {id:"french_fluency_review",level:"B2",category:"fluency",title_vi:"Ôn tập tổng hợp B2",title_en:"B2 Comprehensive review",
    sentences:[{en:"Après 50 leçons, je peux parler avec confiance !",vi:"Sau 50 bài, tôi có thể nói tự tin!",pronunciation_focus:["leçons→lơ-xon","confiance→côn-fi-ăng"]},{en:"Il faut pratiquer tous les jours.",vi:"Cần luyện tập mỗi ngày.",pronunciation_focus:["pratiquer→pra-ti-kê","tous→tu"]},{en:"Je comprends maintenant les nuances.",vi:"Giờ tôi hiểu các sắc thái.",pronunciation_focus:["comprends→côm-prăng","nuances→nu-ăng"]},{en:"N'hésitez pas à faire des erreurs !",vi:"Đừng ngại mắc lỗi!",pronunciation_focus:["hésitez→ê-zi-tê","erreurs→ê-rơ"]},{en:"Le voyage linguistique ne fait que commencer !",vi:"Hành trình ngôn ngữ chỉ mới bắt đầu!",pronunciation_focus:["voyage→voa-ia-giơ","linguistique→lanh-ghuy-xtíc"]}],
    cultural_notes_vi:"Bạn đã học: chào hỏi, số, ngữ pháp, chủ đề hàng ngày, công sở, văn hóa, ngữ pháp nâng cao, thành ngữ, tiếng lóng, tranh luận. Con đường tiếp: podcast, phim, báo, người bản xứ.",
    tip_advice_vi:"(1) 30 phút mỗi ngày. (2) Đừng sợ sai. (3) Tìm 'correspondant' để thực hành. Bon courage !",
    vocabulary:[{word:"la confiance",en:"confidence",vi:"tự tin",pos:"n.f.",pronunciation_vi:"côn-fi-ăng"},{word:"progresser",en:"to progress",vi:"tiến bộ",pos:"v.",pronunciation_vi:"prô-gre-xê"},{word:"la nuance",en:"nuance",vi:"sắc thái",pos:"n.f.",pronunciation_vi:"nu-ăng"},{word:"l'erreur",en:"mistake",vi:"lỗi",pos:"n.f.",pronunciation_vi:"lê-rơ"},{word:"s'améliorer",en:"to improve",vi:"cải thiện",pos:"v.",pronunciation_vi:"xa-mê-li-ô-rê"},{word:"la pratique",en:"practice",vi:"luyện tập",pos:"n.f.",pronunciation_vi:"pra-tíc"},{word:"le parcours",en:"journey",vi:"hành trình",pos:"n.m.",pronunciation_vi:"pa-cua"},{word:"l'immersion",en:"immersion",vi:"đắm mình",pos:"n.f.",pronunciation_vi:"li-me-xi-on"},{word:"le correspondant",en:"language partner",vi:"bạn trao đổi",pos:"n.m.",pronunciation_vi:"cô-rét-pon-đăng"},{word:"la réussite",en:"success",vi:"thành công",pos:"n.f.",pronunciation_vi:"rê-u-xít"}],
    dialogue:[{speaker:"A",text:"Après toutes ces leçons, comment tu te sens en français ?",en:"After all these lessons, how do you feel in French?"},{speaker:"B",text:"Beaucoup plus à l'aise ! Je peux tenir une conversation.",en:"Much more comfortable! I can hold a conversation."},{speaker:"A",text:"Quel conseil aux débutants ?",en:"What advice for beginners?"},{speaker:"B",text:"N'ayez pas peur des erreurs. Pratiquez chaque jour.",en:"Don't fear mistakes. Practice every day."}],
    exercises:[{type:"fill-blank",question:"Il faut ___ tous les jours.",answer:"pratiquer"},{type:"matching",pairs:[["la confiance","tự tin"],["s'améliorer","cải thiện"],["la réussite","thành công"]],instruction:"Nối từ với nghĩa"},{type:"translation",vietnamese:"Tôi học 6 tháng và giao tiếp cơ bản được.",french:"J'étudie depuis six mois et je peux communiquer de façon basique."}]},
  {id:"french_b2_salary_negotiation",level:"B2",category:"fluency",title_vi:"Đàm phán lương",title_en:"Salary negotiation",
    sentences:[{en:"Je vous remercie de m'accorder cet entretien annuel.",vi:"Cảm ơn anh/chị đã dành thời gian cho buổi đánh giá hàng năm này.",pronunciation_focus:["nasal en (entretien)","liaison vous‿accorder → vu-z-a-kor-dê","silent -t (cet)","r uvulaire (remercie)"]},{en:"Au cours des trois dernières années, j'ai pris en charge plusieurs projets stratégiques.",vi:"Trong ba năm qua, tôi đã đảm nhận nhiều dự án chiến lược.",pronunciation_focus:["au → ô","trois → trwa","ai → ê (j'ai)","stratégiques → stra-té-jik"]},{en:"Compte tenu de mes responsabilités actuelles, je souhaiterais aborder la question de ma rémunération.",vi:"Xét đến trách nhiệm hiện tại của mình, tôi muốn đề cập đến vấn đề lương.",pronunciation_focus:["nasal om (compte)","souhaiterais → swè-tré","rémunération → ré-mu-né-ra-sion","aborder r uvulaire"]},{en:"J'entends parfaitement les contraintes budgétaires, mais pourrions-nous envisager un calendrier ?",vi:"Tôi hoàn toàn hiểu hạn chế ngân sách, nhưng chúng ta có thể tính đến một lộ trình không?",pronunciation_focus:["j'entends → j-ăn-tăn nasal","contraintes → kon-trant","envisager → ăn-vi-za-jê","calendrier → ka-lăn-dri-é"]},{en:"Pourrions-nous formaliser cet engagement par écrit ?",vi:"Chúng ta có thể chính thức hóa cam kết này bằng văn bản được không?",pronunciation_focus:["pourrions → pu-rion nasal","formaliser → for-ma-li-zê","engagement → ăn-ga-jơ-măn nasal","liaison par‿écrit → pa-ré-kri"]}],
    cultural_notes_vi:"Văn hóa đàm phán lương ở Pháp khác Việt Nam ở ba điểm. (1) Trực tiếp nhưng có cấu trúc: người Pháp expect bạn nói thẳng số tiền và lý do bằng dữ liệu — không vòng vo. (2) Sự đối lập là chuyện thường: sếp Pháp gần như chắc chắn sẽ pushback, kể cả khi đồng ý trong đầu — đó là một bước trong quy trình, không phải dấu hiệu từ chối. (3) Khung pháp lý nặng: nhiều quyết định bị ràng buộc bởi « convention collective » (thỏa ước tập thể của ngành), mà sếp không có quyền tự quyết — đừng nhầm hạn chế đó với việc không được coi trọng.\n\nỞ Việt Nam, tăng lương thường được xem như đặc ân do cấp trên ban; ở Pháp, đó là một cuộc thương lượng giữa hai người trưởng thành ngang hàng về mặt nghề nghiệp, dù cấp bậc khác nhau. Hiểu điều này sẽ giúp bạn không cảm thấy bị xúc phạm khi sếp pushback, và không khúm núm khi đưa ra mức lương mong muốn.",
    tip_advice_vi:"Trước buổi họp: viết ra ba con số (mức lương hiện tại, mức bạn muốn, mức tối thiểu bạn chấp nhận) và ba bằng chứng cụ thể (dự án, kết quả đo được, trách nhiệm mới). Trong buổi họp: nói số tiền cụ thể bằng tiếng Pháp, đừng dùng « around » hay « plus or less » — sự mơ hồ bị đọc là thiếu chuẩn bị. Khi gặp pushback, đừng phản pháo ngay; dùng cụm « j'entends cette contrainte, mais… » để công nhận hạn chế của sếp rồi đưa ra hướng đi khác (lộ trình, đào tạo, thưởng). Sau buổi họp: luôn xin xác nhận bằng văn bản — không phải vì không tin sếp, mà vì phòng Nhân sự cần giấy tờ để xử lý.",
    vocabulary:[{word:"une augmentation",en:"a (pay) raise",vi:"sự tăng lương",pos:"n.f.",pronunciation_vi:"ô-găn-tă-sion (nasal)"},{word:"l'entretien annuel",en:"annual review",vi:"buổi đánh giá hàng năm",pos:"n.m.",pronunciation_vi:"ăn-trơ-tiang a-nu-el"},{word:"la rémunération",en:"compensation, pay package",vi:"thu nhập, lương thưởng",pos:"n.f.",pronunciation_vi:"ré-mu-né-ra-sion"},{word:"les contraintes budgétaires",en:"budget constraints",vi:"hạn chế ngân sách",pos:"n.f. pl.",pronunciation_vi:"kon-trant bu-jé-ter"},{word:"une contre-proposition",en:"counter-offer",vi:"đề nghị ngược lại",pos:"n.f.",pronunciation_vi:"kontr-pro-po-zi-sion"},{word:"valoriser",en:"to recognize the value of",vi:"ghi nhận, đánh giá cao",pos:"v.",pronunciation_vi:"va-lo-ri-zê"},{word:"envisager",en:"to consider, contemplate",vi:"cân nhắc, tính đến",pos:"v.",pronunciation_vi:"ăn-vi-za-jê"},{word:"la marge de manœuvre",en:"room to maneuver",vi:"khoảng linh hoạt, dư địa",pos:"n.f.",pronunciation_vi:"marj-dơ-ma-nơ-vrơ"},{word:"revaloriser",en:"to raise (a salary), revalue",vi:"nâng (lương), điều chỉnh tăng",pos:"v.",pronunciation_vi:"rơ-va-lo-ri-zê"},{word:"un engagement (formel)",en:"a (formal) commitment",vi:"cam kết (chính thức)",pos:"n.m.",pronunciation_vi:"ăn-ga-jơ-măn (nasal)"}],
    dialogue:[{speaker:"Linh",text:"Madame Laurent, pourrions-nous parler de mon évolution salariale ?",vi:"Bà Laurent ơi, mình có thể nói về lộ trình lương của em được không?"},{speaker:"Mme Laurent",text:"Bien sûr, Linh. Qu'est-ce qui vous amène à le demander maintenant ?",vi:"Tất nhiên rồi, Linh. Điều gì khiến em đặt vấn đề lúc này?"},{speaker:"Linh",text:"Mes responsabilités ont sensiblement évolué cette année.",vi:"Trách nhiệm của em đã thay đổi đáng kể trong năm nay."},{speaker:"Mme Laurent",text:"C'est un point juste. Posons les chiffres ensemble.",vi:"Đó là một điểm hợp lý. Mình cùng đưa ra các con số nhé."}],
    dialogue_long:[{speaker:"Linh",text:"Madame Laurent, merci de me recevoir pour cet entretien annuel.",vi:"Bà Laurent, em cảm ơn bà đã sắp xếp buổi đánh giá hôm nay."},{speaker:"Mme Laurent",text:"Je vous en prie, Linh. Asseyez-vous. Comment se passe votre année ?",vi:"Không có gì, Linh. Em ngồi đi. Năm nay của em thế nào?"},{speaker:"Linh",text:"Très bien dans l'ensemble. C'est justement ce dont j'aimerais discuter — mes responsabilités et ma rémunération.",vi:"Nhìn chung là rất ổn. Đó cũng chính là điều em muốn trao đổi — trách nhiệm và lương của em."},{speaker:"Mme Laurent",text:"D'accord, je vous écoute.",vi:"Được, bà nghe đây."},{speaker:"Linh",text:"Cela fait trois ans que je suis dans l'équipe. Depuis dix-huit mois, j'ai pris la responsabilité du projet Atlas, et je supervise désormais deux développeurs juniors.",vi:"Em đã ở trong nhóm được ba năm. Mười tám tháng nay em phụ trách dự án Atlas, và hiện đang giám sát hai bạn dev junior."},{speaker:"Mme Laurent",text:"C'est exact, et votre travail sur Atlas a été très apprécié par le client.",vi:"Đúng vậy, và công việc của em trên Atlas được khách hàng đánh giá rất cao."},{speaker:"Linh",text:"Merci. Compte tenu de cette évolution, je souhaiterais aborder une augmentation. Sur la base du marché parisien, je pense qu'une revalorisation de huit pour cent serait justifiée.",vi:"Cảm ơn bà. Xét đến sự thay đổi đó, em muốn đề cập tới việc tăng lương. So với thị trường Paris, em nghĩ mức tăng tám phần trăm là hợp lý."},{speaker:"Mme Laurent",text:"Je comprends votre démarche, et votre contribution est reconnue. Cela dit, l'enveloppe des augmentations a déjà été arbitrée pour cette année — elle est très serrée.",vi:"Bà hiểu cách em đặt vấn đề, và đóng góp của em được ghi nhận. Tuy vậy, ngân sách tăng lương năm nay đã được duyệt — và rất eo hẹp."},{speaker:"Linh",text:"J'entends cette contrainte. Pourrions-nous envisager un calendrier — par exemple, une première augmentation maintenant et un point de revoyure dans six mois ?",vi:"Em hiểu hạn chế đó. Mình có thể tính đến một lộ trình không — ví dụ tăng một phần ngay bây giờ và xem lại sau sáu tháng?"},{speaker:"Mme Laurent",text:"C'est une piste intéressante. Je peux probablement défendre trois pour cent dès ce mois-ci, avec un engagement formel de réexaminer en juillet.",vi:"Đó là một hướng đáng cân nhắc. Bà có thể đấu tranh để duyệt ba phần trăm ngay tháng này, kèm cam kết xem lại vào tháng Bảy."},{speaker:"Linh",text:"Si la marge sur le salaire reste limitée, est-ce qu'on pourrait compléter par un budget formation, ou par quelques jours de congés supplémentaires ?",vi:"Nếu phần lương tăng còn hạn chế, mình có thể bù bằng ngân sách đào tạo, hoặc thêm vài ngày nghỉ phép được không?"},{speaker:"Mme Laurent",text:"Pour la formation, oui — j'ai une enveloppe que je peux mobiliser. Pour les congés, c'est plus compliqué, c'est cadré par la convention collective.",vi:"Về đào tạo thì được — bà có một khoản có thể huy động. Còn nghỉ phép thì khó hơn, vì bị ràng buộc bởi thỏa ước tập thể."},{speaker:"Linh",text:"Très bien. Donc si je résume : trois pour cent d'augmentation immédiate, deux mille euros de budget formation, et un nouvel échange en juillet pour évaluer la suite.",vi:"Vậy được. Em tóm tắt nhé: tăng ba phần trăm ngay, hai nghìn euro ngân sách đào tạo, và một buổi trao đổi mới vào tháng Bảy để đánh giá tiếp."},{speaker:"Mme Laurent",text:"C'est exactement ça. Je vais formaliser cela par écrit dans la semaine.",vi:"Đúng như vậy. Bà sẽ chính thức hóa bằng văn bản trong tuần này."},{speaker:"Linh",text:"Je vous en remercie. Pourrais-je avoir une copie une fois validée par les RH ?",vi:"Em cảm ơn bà. Em có thể nhận một bản sao sau khi phòng Nhân sự duyệt được không?"},{speaker:"Mme Laurent",text:"Bien entendu. Et merci à vous, Linh — c'est une discussion menée avec beaucoup de professionnalisme.",vi:"Tất nhiên rồi. Và cảm ơn em, Linh — đây là một cuộc trao đổi rất chuyên nghiệp."},{speaker:"Linh",text:"Merci, Madame Laurent. Bonne fin de journée.",vi:"Cảm ơn bà Laurent. Chúc bà cuối ngày tốt lành."}],
    roleplay_prompts:["Bạn là nhân viên đã ba năm chưa được tăng lương. Hãy mở đầu cuộc trò chuyện với sếp người Pháp một cách lịch sự nhưng rõ ràng — không xin lỗi, không vòng vo.","Sếp nói: « Le budget des augmentations est gelé cette année » (ngân sách tăng lương năm nay bị đóng băng). Bạn phản hồi thế nào để vừa giữ thể diện cho sếp, vừa không bỏ cuộc?","Sếp đề nghị tăng số ngày nghỉ phép thay vì tăng lương. Hãy quyết định có nhận hay không, rồi nói lại bằng tiếng Pháp — kèm lý do và một đề xuất ngược lại nếu bạn từ chối."],
    register_notes:"Trong môi trường doanh nghiệp Pháp, đàm phán lương luôn dùng « vous » — kể cả khi sếp đã nói « tu » với bạn trong các bối cảnh thân mật khác. « Vouvoiement » trong cuộc nói chuyện về tiền không phải là khoảng cách lạnh lùng, mà là cách cả hai bên ký hiệu rằng « đây là chuyện công việc, không phải chuyện cá nhân ». Sau khi kết thúc đàm phán có thể quay lại « tu » nếu trước đó các bạn dùng « tu ».\n\nNgười Việt hay mắc hai lỗi đối lập: (1) khiêm tốn quá mức kiểu Á Đông — xin lỗi, vòng vo, hạ giá trị bản thân — bị người Pháp đọc là thiếu tự tin và làm sếp khó bênh vực bạn trước Nhân sự; (2) hoặc copy nguyên xi giọng Mỹ « I deserve this raise » — nghe như đòi hỏi, mất điểm. Giọng đúng là trung tính, dựa trên dữ liệu cụ thể (dự án, trách nhiệm mới, mức lương thị trường), và để mở cánh cửa thương lượng bằng cụm như « pourrions-nous envisager… » thay vì « je veux… ».",
    idiom_glosses:[{idiom:"Mettre les pieds dans le plat",literal:"Đặt chân vào đĩa thức ăn",meaning:"Nói thẳng vào một chủ đề tế nhị, không né tránh.",example:"J'ai mis les pieds dans le plat en demandant directement combien gagnent mes collègues au même poste."},{idiom:"Avoir le bras long",literal:"Có cánh tay dài",meaning:"Có ảnh hưởng, có quan hệ rộng — có thể tác động đến quyết định.",example:"Mon directeur a le bras long ; s'il défend mon dossier auprès des RH, ça passera."},{idiom:"Mettre cartes sur table",literal:"Đặt bài lên bàn",meaning:"Nói thẳng, minh bạch — không giấu thông tin.",example:"Mettons cartes sur table : voici le salaire que je vise et voici pourquoi."},{idiom:"Battre le fer pendant qu'il est chaud",literal:"Đập sắt khi còn nóng",meaning:"Chớp lấy thời cơ — hành động ngay khi điều kiện thuận lợi.",example:"Après la livraison réussie du projet Atlas, il faut battre le fer pendant qu'il est chaud et négocier maintenant."}],
    exercises:[{type:"fill-blank",instruction_vi:"Điền cụm còn thiếu vào câu đàm phán.",items:[{prompt:"Compte ___ de mes responsabilités actuelles, je souhaiterais aborder une augmentation.",answer:"tenu"},{prompt:"J'entends parfaitement les ___ budgétaires.",answer:"contraintes"},{prompt:"Pourrions-nous ___ un calendrier de revoyure ?",answer:"envisager"},{prompt:"Pouvons-nous ___ cet engagement par écrit ?",answer:"formaliser"}]},{type:"matching",instruction_vi:"Nối thành ngữ Pháp với nghĩa tiếng Việt phù hợp khi đàm phán.",items:[{prompt:"Mettre cartes sur table",answer:"Nói thẳng, minh bạch các con số"},{prompt:"Avoir le bras long",answer:"Có quan hệ, có ảnh hưởng nội bộ"},{prompt:"Battre le fer pendant qu'il est chaud",answer:"Chớp thời cơ — đàm phán ngay sau thành tích"},{prompt:"Mettre les pieds dans le plat",answer:"Nói thẳng vào chủ đề tế nhị"}]},{type:"translation",instruction_vi:"Dịch sang tiếng Pháp lịch sự (B2) — không dùng « je veux ».",items:[{prompt:"Tôi muốn nói về lương của mình.",answer:"Je souhaiterais aborder la question de ma rémunération."},{prompt:"Mình có thể tính đến một lộ trình không?",answer:"Pourrions-nous envisager un calendrier ?"},{prompt:"Em hiểu hạn chế ngân sách, nhưng…",answer:"J'entends cette contrainte budgétaire, mais…"}]}]},
  {id:"french_b2_job_interview_french_company",level:"B2",category:"fluency",title_vi:"Phỏng vấn việc làm tại công ty Pháp",title_en:"Job interview at a French company",
    sentences:[{en:"Bonjour, je vous remercie de m'accorder cet entretien.",vi:"Chào anh/chị, em cảm ơn vì đã dành cho em buổi phỏng vấn này.",pronunciation_focus:["liaison vous‿accorder → vu-z-a-kor-dê","nasal en (entretien)","r uvulaire (remercie)"]},{en:"Mon parcours mêle des études en gestion à Hanoï et un stage à Paris.",vi:"Hành trình của em kết hợp việc học quản trị tại Hà Nội và một kỳ thực tập ở Paris.",pronunciation_focus:["mêle → mèl","gestion → jes-tion","stage → staj","liaison à‿Hanoï"]},{en:"Ce qui m'attire chez vous, c'est votre culture de la responsabilisation.",vi:"Điều thu hút em ở công ty là văn hóa trao quyền và tự chịu trách nhiệm.",pronunciation_focus:["m'attire → ma-tir","responsabilisation → res-pon-sa-bi-li-za-sion","r uvulaire"]},{en:"Je suis à l'aise dans des environnements multiculturels et exigeants.",vi:"Em thoải mái trong môi trường đa văn hóa và đòi hỏi cao.",pronunciation_focus:["à l'aise → a-lèz","environnements → ăn-vi-ron-mã","exigeants → eg-zi-jăn"]},{en:"Sur la rémunération, mes attentes se situent dans la fourchette annoncée.",vi:"Về thu nhập, kỳ vọng của em nằm trong khoảng đã được công bố.",pronunciation_focus:["rémunération → ré-mu-né-ra-sion","attentes → a-tăn-tơ","fourchette → fur-shet"]}],
    cultural_notes_vi:"Phỏng vấn ở công ty Pháp đặt giá trị cao vào việc ứng viên thể hiện « problématique propre » — tức là đã suy nghĩ rõ ràng về vai trò cụ thể, không phải chỉ « em mong được học hỏi ». Câu hỏi « Pourquoi nous ? » (Vì sao chọn chúng tôi?) gần như chắc chắn sẽ xuất hiện — phải có câu trả lời cụ thể, dựa trên dữ liệu (sản phẩm cụ thể của công ty, một bài blog của họ, một người bạn đã trao đổi), không phải nhận xét chung chung kiểu « tôi thích văn hóa công ty ». Khác với văn hóa Việt Nam — nơi sự khiêm tốn và « em xin các anh chỉ dạy » được coi trọng — ở Pháp giọng đó bị đọc là thiếu trưởng thành nghề nghiệp. « Esprit critique » — sẵn lòng phản biện sếp một cách tôn trọng — được xem là dấu hiệu của ứng viên chín chắn, không phải sự bất kính.",
    tip_advice_vi:"Chuẩn bị 3 câu chuyện ngắn (mỗi câu 90 giây) theo cấu trúc STAR — Situation, Tâche, Action, Résultat — minh họa các kỹ năng cốt lõi. Tập kể tự nhiên, không đọc thuộc lòng. Khi được hỏi điểm yếu, trả lời thật kèm hành động khắc phục cụ thể. Nói số tiền lương rõ ràng — không « around 40k » mà « 42 000 euros bruts annuels ». Cuối phỏng vấn, hỏi 2-3 câu thực sự về vai trò và đội nhóm; tránh câu mà website đã trả lời.",
    vocabulary:[{word:"un entretien d'embauche",en:"a job interview",vi:"buổi phỏng vấn việc làm",pos:"n.m.",pronunciation_vi:"ăn-trơ-tiang dăm-bôsh"},{word:"le parcours",en:"career path",vi:"hành trình nghề nghiệp",pos:"n.m.",pronunciation_vi:"par-kur"},{word:"mes attentes",en:"my expectations",vi:"kỳ vọng của tôi",pos:"n.f. pl.",pronunciation_vi:"mê-z-a-tăn-tơ"},{word:"la fourchette salariale",en:"salary range",vi:"khoảng lương",pos:"n.f.",pronunciation_vi:"fur-shét sa-la-ri-al"},{word:"se situer dans",en:"to fall within",vi:"nằm trong",pos:"v.",pronunciation_vi:"sơ si-tu-ê dăn"},{word:"la responsabilisation",en:"empowerment culture",vi:"văn hóa trao quyền",pos:"n.f.",pronunciation_vi:"res-pon-sa-bi-li-za-sion"},{word:"l'esprit critique",en:"critical thinking",vi:"tư duy phản biện",pos:"n.m.",pronunciation_vi:"les-pri kri-tik"},{word:"être à l'aise dans",en:"to be comfortable in",vi:"thoải mái trong",pos:"expr.",pronunciation_vi:"é-trơ a-lèz dăn"},{word:"un environnement exigeant",en:"a demanding environment",vi:"môi trường đòi hỏi cao",pos:"n.m.",pronunciation_vi:"ăn-vi-ron-mã eg-zi-jăn"},{word:"argumenter",en:"to build a case",vi:"lập luận có dẫn chứng",pos:"v.",pronunciation_vi:"ar-gu-mãn-tê"}],
    dialogue:[{speaker:"M. Dupont",text:"Bonjour. Pourquoi avoir candidaté chez nous précisément ?",vi:"Chào em. Vì sao em ứng tuyển chính xác là ở chỗ chúng tôi?"},{speaker:"Linh",text:"Votre approche du conseil sur l'Asie du Sud-Est correspond exactement à ce que je veux développer.",vi:"Cách tiếp cận của công ty về tư vấn Đông Nam Á chính là điều em muốn phát triển."},{speaker:"M. Dupont",text:"Précisez. Qu'est-ce qui vous distingue d'un autre candidat parisien ?",vi:"Cụ thể đi. Điều gì khiến em khác với một ứng viên Paris?"},{speaker:"Linh",text:"Mon double regard franco-vietnamien et trois ans de terrain à Hanoï.",vi:"Cái nhìn song song Pháp-Việt và ba năm thực địa ở Hà Nội."}],
    dialogue_long:[{speaker:"M. Dupont",text:"Bonjour Madame Trần, asseyez-vous. Je vous remercie d'être venue jusqu'ici.",vi:"Chào chị Trần, chị ngồi đi. Cảm ơn chị đã đến tận đây."},{speaker:"Linh",text:"Merci, Monsieur Dupont. C'est un plaisir d'échanger avec vous aujourd'hui.",vi:"Cảm ơn anh Dupont. Em rất vui được trao đổi với anh hôm nay."},{speaker:"M. Dupont",text:"Présentez-vous en cinq minutes — formation, expériences clés, et pourquoi vous postulez chez nous.",vi:"Chị giới thiệu bản thân trong năm phút — học vấn, kinh nghiệm chính, và lý do ứng tuyển ở chỗ chúng tôi."},{speaker:"Linh",text:"Très bien. J'ai un master en gestion à HEC Hanoï, suivi d'un stage de six mois chez Bolloré Logistics à Paris. Mon projet : devenir consultante junior sur le marché vietnamien, où vous ouvrez un bureau l'an prochain.",vi:"Vâng. Em có bằng thạc sĩ quản trị tại HEC Hà Nội, sau đó là sáu tháng thực tập tại Bolloré Logistics Paris. Dự án của em: trở thành tư vấn junior cho thị trường Việt Nam, nơi công ty đang mở văn phòng năm tới."},{speaker:"M. Dupont",text:"Vous avez bien fait vos devoirs. Mais soyons francs : qu'est-ce qui vous différencie d'un consultant français bilingue qu'on pourrait envoyer là-bas ?",vi:"Chị đã làm bài tập về nhà rất kỹ. Nhưng nói thẳng: điều gì khiến chị khác biệt với một tư vấn người Pháp song ngữ mà công ty có thể cử đi?"},{speaker:"Linh",text:"Trois choses concrètes : un réseau professionnel actif à Hanoï, une compréhension des codes implicites des PME vietnamiennes, et la capacité de sortir d'une réunion en français pour entrer dans une autre en vietnamien sans changer de registre.",vi:"Ba điều cụ thể: một mạng lưới chuyên môn đang hoạt động ở Hà Nội, sự hiểu biết về luật ngầm của doanh nghiệp vừa và nhỏ Việt Nam, và khả năng rời cuộc họp tiếng Pháp để bước vào cuộc họp tiếng Việt mà không đổi giọng điệu."},{speaker:"M. Dupont",text:"C'est un argument fort. Parlons d'une faiblesse réelle de votre profil.",vi:"Đó là lập luận mạnh. Bây giờ ta nói về một điểm yếu thực sự trong hồ sơ của chị."},{speaker:"Linh",text:"Mon expérience en conseil pur est limitée — six mois en stage. Pour combler cela, je suis en train de passer la certification BCG Online et je me forme aux frameworks classiques avec un mentor à Paris.",vi:"Kinh nghiệm tư vấn thuần túy của em còn hạn chế — sáu tháng thực tập. Để bù điều đó, em đang thi chứng chỉ BCG Online và học các framework cổ điển với một mentor ở Paris."},{speaker:"M. Dupont",text:"Honnête, et bien anticipé. Sur la rémunération, qu'attendez-vous ?",vi:"Trung thực và biết trước. Về lương, chị kỳ vọng gì?"},{speaker:"Linh",text:"La fourchette annoncée de 42 à 48 mille euros bruts annuels me convient. Je viserais 46 mille compte tenu de mon double profil franco-vietnamien.",vi:"Khoảng lương đã công bố từ 42 đến 48 nghìn euro gross/năm phù hợp với em. Em nhắm 46 nghìn xét đến hồ sơ song ngữ Pháp-Việt."},{speaker:"M. Dupont",text:"C'est cohérent. On a deux autres candidats à voir cette semaine. Je vous reviens d'ici dix jours, positif ou négatif.",vi:"Hợp lý. Còn hai ứng viên khác phải gặp tuần này. Tôi sẽ phản hồi chị trong vòng mười ngày, có hay không."},{speaker:"Linh",text:"Je vous remercie pour cette franchise. Bonne fin de journée, Monsieur Dupont.",vi:"Em cảm ơn anh vì sự thẳng thắn. Chúc anh cuối ngày tốt lành, anh Dupont."}],
    roleplay_prompts:["Bạn ứng tuyển vị trí consultant junior tại Paris với 6 tháng kinh nghiệm. Trả lời câu « Pourquoi nous et pas un autre cabinet ? » trong 90 giây — cụ thể, có dẫn chứng, không sáo rỗng.","Nhà tuyển dụng nói: « Votre niveau de français à l'oral nous inquiète » (Trình độ tiếng Pháp nói của bạn khiến chúng tôi lo). Phản hồi vừa giữ được tự tin, vừa thừa nhận điểm cần cải thiện, kèm kế hoạch cụ thể.","Cuối phỏng vấn, người tuyển hỏi « Vous avez des questions ? ». Đặt 3 câu hỏi thông minh — không hỏi điều mà website đã trả lời (lương, ngày nghỉ, văn hóa)."],
    register_notes:"Phỏng vấn việc làm ở Pháp luôn dùng « vous » — kể cả khi LinkedIn hoặc email trước đó dùng « tu ». « Vouvoiement » không lạnh; nó là tín hiệu « ta đang ở chế độ chuyên nghiệp ». Tránh hai cực: (1) khúm núm kiểu « em mong các anh tạo điều kiện » — bị đọc là thiếu chín chắn; (2) sao chép giọng Mỹ « I'm passionate about your mission » — nghe sáo. Giọng đúng: trung tính, dữ liệu, có cấu trúc. Khi không hiểu câu hỏi, hỏi lại lịch sự: « Pourriez-vous reformuler ? » thay vì gật đầu giả vờ hiểu.",
    idiom_glosses:[{idiom:"Faire ses preuves",literal:"Đưa ra các bằng chứng của mình",meaning:"Chứng minh năng lực qua kết quả cụ thể.",example:"Pendant ce stage, j'ai eu l'occasion de faire mes preuves sur le projet Asia."},{idiom:"Avoir le pied à l'étrier",literal:"Có chân vào bàn đạp ngựa",meaning:"Bước đầu vào nghề; có cơ hội khởi đầu.",example:"Ce poste me permettrait d'avoir le pied à l'étrier dans le conseil."},{idiom:"Mettre toutes les chances de son côté",literal:"Đặt mọi cơ hội về phía mình",meaning:"Chuẩn bị kỹ lưỡng để tối đa hóa khả năng thành công.",example:"J'ai préparé trois études de cas pour mettre toutes les chances de mon côté."},{idiom:"Tirer son épingle du jeu",literal:"Rút cây ghim khỏi trò chơi",meaning:"Xoay xở khéo léo, vượt qua khó khăn.",example:"Dans un marché tendu, mon double profil m'aide à tirer mon épingle du jeu."}],
    exercises:[{type:"fill-blank",instruction_vi:"Điền cụm còn thiếu vào câu phỏng vấn lịch sự.",items:[{prompt:"Je vous ___ de m'accorder cet entretien.",answer:"remercie"},{prompt:"Mes attentes se ___ dans la fourchette annoncée.",answer:"situent"},{prompt:"Ce qui m'___ chez vous, c'est votre culture.",answer:"attire"},{prompt:"Je suis à l'___ dans des environnements exigeants.",answer:"aise"}]},{type:"matching",instruction_vi:"Nối thành ngữ Pháp với nghĩa tiếng Việt khi phỏng vấn.",items:[{prompt:"Faire ses preuves",answer:"Chứng minh năng lực qua kết quả"},{prompt:"Avoir le pied à l'étrier",answer:"Bước đầu vào nghề"},{prompt:"Mettre toutes les chances de son côté",answer:"Chuẩn bị kỹ lưỡng tối đa"},{prompt:"Tirer son épingle du jeu",answer:"Xoay xở khéo léo trong khó khăn"}]},{type:"translation",instruction_vi:"Dịch sang tiếng Pháp B2 — không dùng « je veux ».",items:[{prompt:"Em muốn nói rõ điều khiến em khác biệt.",answer:"Je souhaiterais préciser ce qui me distingue."},{prompt:"Em đã chuẩn bị ba câu chuyện theo cấu trúc STAR.",answer:"J'ai préparé trois histoires selon la structure STAR."},{prompt:"Anh có thể nói lại câu hỏi được không ạ?",answer:"Pourriez-vous reformuler la question ?"}]}]},
  {id:"french_b2_scholarship_interview",level:"B2",category:"fluency",title_vi:"Phỏng vấn học bổng Eiffel/Campus France",title_en:"Scholarship interview (Eiffel/Campus France)",
    sentences:[{en:"Mon projet d'études s'inscrit dans la continuité de mon mémoire de licence.",vi:"Dự án học của em nối tiếp luận văn cử nhân.",pronunciation_focus:["s'inscrit → san-skri","continuité → kon-ti-nu-i-té","mémoire → mé-mwar"]},{en:"Le master que je vise complète ma formation par un volet recherche solide.",vi:"Master em nhắm tới bổ sung phần nghiên cứu vững chắc cho việc học của em.",pronunciation_focus:["vise → viz","complète → kom-plèt","volet → vo-lè"]},{en:"À l'issue du diplôme, je compte revenir au Vietnam pour enseigner et co-encadrer des projets.",vi:"Sau khi tốt nghiệp, em dự định quay lại Việt Nam để giảng dạy và đồng hướng dẫn dự án.",pronunciation_focus:["à l'issue → a-li-syu","compte → kont","co-encadrer → ko-an-ka-dré"]},{en:"La bourse Eiffel m'offrirait la stabilité matérielle pour me concentrer pleinement sur la recherche.",vi:"Học bổng Eiffel sẽ cho em sự ổn định vật chất để tập trung hoàn toàn vào nghiên cứu.",pronunciation_focus:["bourse → burs","offrirait → o-fri-ré","matérielle → ma-té-riel","pleinement → plè-nơ-mã"]},{en:"Je m'engage, en retour, à participer activement à la vie scientifique du laboratoire d'accueil.",vi:"Đáp lại, em cam kết tham gia tích cực vào đời sống khoa học của phòng lab tiếp nhận.",pronunciation_focus:["m'engage → mã-gaj","retour → rơ-tur","scientifique → sian-ti-fik","accueil → a-kơy"]}],
    cultural_notes_vi:"Phỏng vấn học bổng Pháp (Eiffel, Campus France, IDEX) đánh giá trên ba trục: chất lượng học thuật, dự án nghề nghiệp rõ ràng, và « projet de retour » — kế hoạch sau khi tốt nghiệp đóng góp lại cho nước nhà. Điểm thứ ba đặc biệt quan trọng với Eiffel: học bổng này nằm trong chính sách ngoại giao mềm của Pháp — họ muốn xây dựng một mạng lưới cựu sinh viên ưu tú quay về vị trí có ảnh hưởng tại nước mình. Trả lời « em sẽ ở lại Pháp làm việc » không phải lựa chọn khôn — sẽ làm hỏng hồ sơ. Khác văn hóa Việt Nam (nơi đôi khi việc « ở lại nước ngoài » được nhìn như thành công), với học bổng nhà nước Pháp thì « về nước có dự án cụ thể » mới là câu trả lời được mong đợi. Phải nêu được: nơi sẽ làm, vai trò, cách kiến thức học ở Pháp tạo giá trị tại Việt Nam.",
    tip_advice_vi:"Chuẩn bị một « projet de retour » cụ thể trên một trang A4: nơi làm việc dự kiến (trường đại học, viện nghiên cứu, công ty), vai trò, các cộng tác Pháp-Việt bạn sẽ duy trì. Trả lời câu « Pourquoi la France ? » bằng tên cụ thể (giáo sư, lab, sách, hội nghị bạn đã tham dự) — không phải « tôi yêu văn hóa Pháp ». Khi nói tiền, hãy nói rằng học bổng cho phép tập trung vào học thuật, không phải « em thiếu tiền ». Trong phỏng vấn nhóm Campus France, đến trước 15 phút và mặc trang phục business smart — không quá trang trọng nhưng không jeans-tshirt.",
    vocabulary:[{word:"une bourse d'études",en:"a study scholarship",vi:"học bổng học tập",pos:"n.f.",pronunciation_vi:"burs dé-tyud"},{word:"le projet de retour",en:"return project (post-degree plan)",vi:"dự án trở về sau tốt nghiệp",pos:"n.m.",pronunciation_vi:"pro-jé dơ rơ-tur"},{word:"un volet (de recherche)",en:"a (research) component",vi:"phần (nghiên cứu)",pos:"n.m.",pronunciation_vi:"vo-lè"},{word:"co-encadrer",en:"to co-supervise",vi:"đồng hướng dẫn",pos:"v.",pronunciation_vi:"ko-an-ka-dré"},{word:"la stabilité matérielle",en:"financial stability",vi:"sự ổn định vật chất",pos:"n.f.",pronunciation_vi:"sta-bi-li-té ma-té-riel"},{word:"un laboratoire d'accueil",en:"host laboratory",vi:"phòng lab tiếp nhận",pos:"n.m.",pronunciation_vi:"la-bo-ra-twar da-kơy"},{word:"s'engager à",en:"to commit to",vi:"cam kết",pos:"v.",pronunciation_vi:"sãn-ga-jé a"},{word:"un dossier de candidature",en:"an application file",vi:"hồ sơ ứng tuyển",pos:"n.m.",pronunciation_vi:"do-sié dơ kan-di-da-tur"},{word:"être éligible à",en:"to be eligible for",vi:"đủ điều kiện cho",pos:"expr.",pronunciation_vi:"é-trơ é-li-jib a"},{word:"valoriser ses acquis",en:"to highlight one's achievements",vi:"làm nổi bật thành tựu",pos:"expr.",pronunciation_vi:"va-lo-ri-zé sé-z-a-ki"}],
    dialogue:[{speaker:"Mme Roy",text:"Bonjour. Pourquoi la France et pas un autre pays ?",vi:"Chào em. Vì sao là Pháp mà không phải nước khác?"},{speaker:"Mai",text:"Le programme du Pr Lefèvre à Paris-Saclay est unique en Europe sur l'IA explicable.",vi:"Chương trình của giáo sư Lefèvre ở Paris-Saclay là độc đáo ở châu Âu về AI có thể giải thích."},{speaker:"Mme Roy",text:"Et après le master, qu'envisagez-vous concrètement ?",vi:"Và sau master, em cụ thể tính làm gì?"},{speaker:"Mai",text:"Rentrer à Hanoï pour rejoindre le laboratoire d'IA de l'USTH, où mon ancienne directrice m'attend.",vi:"Trở về Hà Nội tham gia phòng AI của USTH, nơi nguyên giáo sư hướng dẫn của em đang chờ."}],
    dialogue_long:[{speaker:"Mme Roy",text:"Bonjour, Mademoiselle Phạm. Asseyez-vous. Vous avez quinze minutes pour défendre votre dossier devant ce jury.",vi:"Chào em Phạm. Em ngồi đi. Em có mười lăm phút để bảo vệ hồ sơ trước hội đồng này."},{speaker:"Mai",text:"Bonjour Madame, bonjour à toute l'équipe. Je vais structurer ma présentation en trois temps : pourquoi ce master, pourquoi maintenant, et pourquoi un retour au Vietnam.",vi:"Chào bà, chào toàn hội đồng. Em sẽ chia phần trình bày thành ba đoạn: vì sao master này, vì sao bây giờ, và vì sao trở về Việt Nam."},{speaker:"Mme Roy",text:"Très bien. Allez-y.",vi:"Tốt. Em bắt đầu đi."},{speaker:"Mai",text:"Premièrement, le master « IA et Société » à Paris-Saclay est l'un des rares à articuler informatique avancée et éthique. Mon mémoire de licence à Hanoï portait déjà sur les biais algorithmiques en santé publique — j'ai donc une question de recherche que je veux approfondir, pas une vocation à découvrir.",vi:"Thứ nhất, master « AI và Xã hội » ở Paris-Saclay là một trong số ít kết hợp tin học nâng cao và đạo đức. Luận văn cử nhân của em ở Hà Nội đã tập trung vào thiên kiến thuật toán trong y tế công cộng — em có sẵn một câu hỏi nghiên cứu muốn đào sâu, không phải tìm đam mê mới."},{speaker:"M. Bertrand",text:"Pourquoi maintenant et pas dans deux ans, après une expérience professionnelle ?",vi:"Vì sao bây giờ mà không phải hai năm nữa sau khi đi làm?"},{speaker:"Mai",text:"Parce que les outils méthodologiques évoluent vite. Si j'attends, je devrai me reformer en parallèle de mon travail. Faire le master maintenant, c'est sécuriser une base scientifique solide avant d'entrer en milieu professionnel.",vi:"Vì các công cụ phương pháp thay đổi rất nhanh. Nếu em đợi, em sẽ phải tự đào tạo lại trong khi đi làm. Học master ngay là cách giữ một nền tảng khoa học vững trước khi vào môi trường chuyên nghiệp."},{speaker:"Mme Roy",text:"Parlons du projet de retour. Soyez précise.",vi:"Ta nói về dự án trở về. Em cụ thể đi."},{speaker:"Mai",text:"À l'issue du master, je rejoins le laboratoire d'IA de l'USTH à Hanoï comme assistante de recherche. Ma directrice de licence m'a confirmé une lettre d'intention. À moyen terme, je souhaite co-encadrer une thèse en cotutelle avec Paris-Saclay — c'est mon engagement concret de pont franco-vietnamien.",vi:"Sau master, em sẽ vào phòng lab AI của USTH ở Hà Nội với tư cách trợ lý nghiên cứu. Giáo sư hướng dẫn cử nhân đã xác nhận một thư ý định. Trung hạn, em muốn đồng hướng dẫn một luận án cotutelle với Paris-Saclay — đó là cam kết cụ thể của em về cây cầu Pháp-Việt."},{speaker:"M. Bertrand",text:"Si la bourse Eiffel ne vous est pas accordée, votre projet tient-il toujours ?",vi:"Nếu không được học bổng Eiffel, dự án của em còn tiến hành được không?"},{speaker:"Mai",text:"Honnêtement, ce serait beaucoup plus difficile. J'ai un dossier en parallèle pour la bourse de l'AUF, mais l'Eiffel offre un encadrement administratif et un réseau d'anciens auxquels je tiens beaucoup. Sans elle, je devrais probablement reporter d'un an pour économiser.",vi:"Thật lòng, sẽ khó hơn rất nhiều. Em có hồ sơ song song cho học bổng AUF, nhưng Eiffel có hệ thống hỗ trợ hành chính và mạng cựu sinh viên mà em rất quý. Không có nó, em có thể phải hoãn một năm để tiết kiệm tiền."},{speaker:"Mme Roy",text:"Merci pour cette franchise. Une dernière question : qu'apporterez-vous à la communauté Eiffel pendant vos études ?",vi:"Cảm ơn em vì sự thẳng thắn. Câu hỏi cuối: em sẽ đóng góp gì cho cộng đồng Eiffel trong thời gian học?"},{speaker:"Mai",text:"Je propose d'animer un atelier mensuel pour les boursiers d'Asie du Sud-Est sur la transition culturelle, et de servir d'interface avec les anciens vietnamiens d'Eiffel — je connais déjà personnellement trois d'entre eux à Hanoï.",vi:"Em đề xuất tổ chức một workshop hàng tháng cho học bổng sinh Đông Nam Á về chuyển tiếp văn hóa, và làm cầu nối với cựu sinh viên Eiffel Việt Nam — em đã quen ba người trong số họ ở Hà Nội."},{speaker:"Mme Roy",text:"Très bien. Le jury vous remercie. Réponse par écrit dans six semaines.",vi:"Tốt. Hội đồng cảm ơn em. Phản hồi bằng văn bản trong sáu tuần."}],
    roleplay_prompts:["Bạn phỏng vấn học bổng Eiffel. Hội đồng hỏi « Pourquoi la France ? ». Trả lời 60 giây với 3 dẫn chứng cụ thể (giáo sư, sách, hội nghị) — tránh sáo rỗng kiểu « j'aime la culture française ».","Hội đồng hỏi: « Si vous obtenez la bourse, accepteriez-vous de rester travailler en France après le diplôme ? ». Hãy trả lời thật mà vẫn giữ được sức mạnh hồ sơ — nhớ rằng Eiffel ưu tiên « projet de retour ».","Cuối phỏng vấn, hội đồng cho 60 giây cuối để bạn nói thêm bất cứ điều gì. Đừng cảm ơn vu vơ — hãy gói lại hồ sơ bằng một câu chốt mạnh, có hình ảnh hoặc con số."],
    register_notes:"Phỏng vấn học bổng nhà nước Pháp luôn dùng « vous » đa chiều — bạn dùng « vous » với hội đồng, hội đồng cũng dùng « vous » với bạn (không vì bạn trẻ mà họ tutoyer). Tránh kể chuyện cá nhân quá đậm (cha mẹ hy sinh, gia đình khó khăn) — người Pháp đánh giá cao việc tách riêng chuyện riêng và chuyện học thuật. Nếu hoàn cảnh khó khăn của bạn liên quan trực tiếp đến chủ đề nghiên cứu, có thể nhắc một câu ngắn, không nhấn mạnh. Khi bí câu trả lời, không gật đầu giả vờ — hãy nói « C'est une excellente question, je vais y réfléchir un instant » để câu giờ một cách lịch thiệp.",
    idiom_glosses:[{idiom:"Mettre toutes les chances de son côté",literal:"Đặt mọi cơ hội về phía mình",meaning:"Chuẩn bị kỹ để tối đa hóa khả năng được chọn.",example:"J'ai postulé à trois bourses pour mettre toutes les chances de mon côté."},{idiom:"Faire ses gammes",literal:"Tập âm giai (như học piano)",meaning:"Học bài bản, tích lũy kinh nghiệm cơ bản trước khi đi xa.",example:"Le master me permettra de faire mes gammes en méthodologie avant la thèse."},{idiom:"Avoir le vent en poupe",literal:"Có gió thuận sau lưng (như cánh buồm)",meaning:"Đang ở giai đoạn thuận lợi, đà tiến tốt.",example:"L'IA explicable a le vent en poupe dans la recherche européenne — c'est le bon moment pour s'y former."},{idiom:"Jeter des ponts",literal:"Bắc các cây cầu",meaning:"Tạo cầu nối giữa hai nhóm/cộng đồng/quốc gia.",example:"Mon projet de retour vise à jeter des ponts entre la recherche française et l'écosystème vietnamien."}],
    exercises:[{type:"fill-blank",instruction_vi:"Điền cụm còn thiếu vào câu phỏng vấn học bổng.",items:[{prompt:"Mon projet ___ dans la continuité de mon mémoire.",answer:"s'inscrit"},{prompt:"À l'___ du diplôme, je compte rentrer au Vietnam.",answer:"issue"},{prompt:"Je m'___ à participer à la vie du laboratoire.",answer:"engage"},{prompt:"La bourse m'offrirait la ___ matérielle pour me concentrer.",answer:"stabilité"}]},{type:"matching",instruction_vi:"Nối thành ngữ với nghĩa khi nói về học bổng.",items:[{prompt:"Mettre toutes les chances de son côté",answer:"Chuẩn bị kỹ tối đa"},{prompt:"Faire ses gammes",answer:"Học bài bản từ cơ bản"},{prompt:"Avoir le vent en poupe",answer:"Đang ở đà thuận lợi"},{prompt:"Jeter des ponts",answer:"Tạo cầu nối giữa hai bên"}]},{type:"translation",instruction_vi:"Dịch sang tiếng Pháp B2.",items:[{prompt:"Em muốn quay lại Việt Nam để đồng hướng dẫn các dự án.",answer:"Je souhaite rentrer au Vietnam pour co-encadrer des projets."},{prompt:"Đó là một câu hỏi tuyệt vời, em xin suy nghĩ một chút.",answer:"C'est une excellente question, je vais y réfléchir un instant."},{prompt:"Học bổng cho phép em tập trung hoàn toàn vào nghiên cứu.",answer:"La bourse me permet de me concentrer pleinement sur la recherche."}]}]},
  {id:"french_b2_thesis_topic_with_professor",level:"B2",category:"fluency",title_vi:"Trao đổi đề tài luận văn với giáo sư",title_en:"Discussing thesis topic with a professor",
    sentences:[{en:"Je voudrais affiner ma problématique avant de la soumettre formellement.",vi:"Em muốn tinh chỉnh câu hỏi nghiên cứu trước khi nộp chính thức.",pronunciation_focus:["voudrais → vu-dré","affiner → a-fi-né","problématique → pro-blé-ma-tik","soumettre → su-mè-trơ"]},{en:"Mon angle d'attaque : comparer les politiques de migration de travail Vietnam-France.",vi:"Hướng tiếp cận của em: so sánh chính sách di cư lao động Việt-Pháp.",pronunciation_focus:["angle → ãgl","attaque → a-tak","politiques → po-li-tik","migration → mi-gra-sion"]},{en:"Je m'appuie principalement sur les travaux de Sayad et de Wihtol de Wenden.",vi:"Em chủ yếu dựa trên công trình của Sayad và Wihtol de Wenden.",pronunciation_focus:["m'appuie → ma-pyu-i","principalement → pran-si-pal-mã","travaux → tra-vo"]},{en:"Le terrain comporterait une vingtaine d'entretiens semi-directifs.",vi:"Phần thực địa sẽ gồm khoảng hai mươi cuộc phỏng vấn bán cấu trúc.",pronunciation_focus:["terrain → tè-ran","comporterait → kom-por-tơ-ré","entretiens → ãn-trơ-tian","semi-directifs → sơ-mi-di-rek-tif"]},{en:"J'ai besoin de votre regard sur la faisabilité du calendrier.",vi:"Em cần ý kiến của thầy/cô về tính khả thi của tiến độ.",pronunciation_focus:["regard → rơ-gar","faisabilité → fơ-za-bi-li-té","calendrier → ka-lăn-dri-é"]}],
    cultural_notes_vi:"Buổi gặp giáo sư hướng dẫn ở Pháp khác hẳn cuộc gặp ở Việt Nam. Ở Việt Nam, sinh viên thường đến để « xin thầy cho đề tài » — một thái độ tôn kính và phụ thuộc. Ở Pháp, giáo sư mong sinh viên đến với một « problématique propre » đã được suy nghĩ kỹ — vai trò của giáo sư là phản biện, tinh chỉnh, mở rộng, không phải « giao đề ». Đến tay không và nói « em chưa biết làm gì, xin thầy gợi ý » sẽ làm giáo sư mất kiên nhẫn và hồ sơ luận văn của bạn coi như có vấn đề ngay từ đầu. Hãy đến với một bản hai trang: câu hỏi nghiên cứu, lý do quan trọng, ba tác giả nền tảng, phương pháp dự kiến, lịch trình. Giáo sư có thể bác bỏ tất cả — đó là chuyện thường, không phải sỉ nhục. Sự « sécheresse » (khô khan) của góp ý Pháp khiến nhiều sinh viên Việt khóc trên đường về — hãy xem đó là tôn trọng trí tuệ của bạn, không phải công kích cá nhân.",
    tip_advice_vi:"Mang theo một bản giấy hai trang in ra, kể cả khi đã gửi PDF — giáo sư Pháp thích viết lên giấy. Mở đầu bằng câu hỏi cụ thể bạn cần thầy/cô trả lời (« J'ai trois doutes : 1, 2, 3 »), không phải kể lể về bối cảnh. Khi giáo sư đề xuất tài liệu, ghi ngay tên tác giả và năm — đừng tin trí nhớ. Cuối buổi, tóm tắt ba điểm hành động trong ba câu, và hỏi giáo sư có chỉnh không. Sau buổi họp, gửi email cảm ơn kèm ba điểm hành động đó trong vòng 24 giờ — không phải vì lễ phép, mà để có vết bằng văn bản về cam kết hai bên.",
    vocabulary:[{word:"affiner",en:"to refine",vi:"tinh chỉnh",pos:"v.",pronunciation_vi:"a-fi-né"},{word:"une problématique",en:"a research question",vi:"câu hỏi nghiên cứu",pos:"n.f.",pronunciation_vi:"pro-blé-ma-tik"},{word:"l'angle d'attaque",en:"angle of approach",vi:"hướng tiếp cận",pos:"n.m.",pronunciation_vi:"ãgl da-tak"},{word:"s'appuyer sur",en:"to rely / build upon",vi:"dựa trên",pos:"v.",pronunciation_vi:"sa-pyu-i-é syur"},{word:"un entretien semi-directif",en:"semi-structured interview",vi:"phỏng vấn bán cấu trúc",pos:"n.m.",pronunciation_vi:"ãn-trơ-tian sơ-mi-di-rek-tif"},{word:"la faisabilité",en:"feasibility",vi:"tính khả thi",pos:"n.f.",pronunciation_vi:"fơ-za-bi-li-té"},{word:"un calendrier prévisionnel",en:"projected timeline",vi:"lịch trình dự kiến",pos:"n.m.",pronunciation_vi:"ka-lăn-dri-é pré-vi-zio-nèl"},{word:"un cadre théorique",en:"theoretical framework",vi:"khung lý thuyết",pos:"n.m.",pronunciation_vi:"kadr té-o-rik"},{word:"la revue de littérature",en:"literature review",vi:"tổng quan tài liệu",pos:"n.f.",pronunciation_vi:"rơ-vyu dơ li-té-ra-tur"},{word:"un livrable intermédiaire",en:"interim deliverable",vi:"sản phẩm trung gian",pos:"n.m.",pronunciation_vi:"liv-rabl an-tèr-mé-dièr"}],
    dialogue:[{speaker:"Pr Lefèvre",text:"Bonjour. Vous m'apportez quoi aujourd'hui ?",vi:"Chào em. Hôm nay em mang gì đến?"},{speaker:"Tâm",text:"Une note de deux pages avec ma problématique et trois doutes méthodologiques.",vi:"Một bản hai trang với câu hỏi nghiên cứu và ba điểm còn nghi ngờ về phương pháp."},{speaker:"Pr Lefèvre",text:"Bien. Lisez-moi votre problématique en une phrase.",vi:"Tốt. Đọc cho tôi câu hỏi nghiên cứu trong một câu."},{speaker:"Tâm",text:"Comment les politiques migratoires françaises et vietnamiennes structurent-elles différemment les parcours des travailleurs qualifiés ?",vi:"Chính sách di cư Pháp và Việt cấu trúc khác nhau như thế nào hành trình của người lao động có trình độ?"}],
    dialogue_long:[{speaker:"Pr Lefèvre",text:"Bonjour, asseyez-vous. Vous avez vingt minutes — soyez précise.",vi:"Chào em, ngồi đi. Em có hai mươi phút — hãy chính xác."},{speaker:"Tâm",text:"Merci. Voici ma note. Ma problématique provisoire : comment les politiques migratoires françaises et vietnamiennes structurent-elles différemment les parcours des travailleurs qualifiés ?",vi:"Cảm ơn cô. Đây là bản tóm tắt của em. Câu hỏi nghiên cứu tạm thời: chính sách di cư Pháp và Việt cấu trúc khác nhau ra sao hành trình người lao động có trình độ?"},{speaker:"Pr Lefèvre",text:"La question est trop large. « Travailleurs qualifiés » couvre dix professions très différentes. Il vous faut restreindre.",vi:"Câu hỏi quá rộng. « Lao động có trình độ » bao trùm mười nghề rất khác nhau. Em phải thu hẹp."},{speaker:"Tâm",text:"Vous avez raison. Je peux restreindre aux infirmières et aux ingénieurs informatiques — deux profils où la mobilité Vietnam-France est documentée.",vi:"Cô đúng. Em có thể thu hẹp về y tá và kỹ sư tin học — hai nhóm mà di động Việt-Pháp đã được ghi nhận."},{speaker:"Pr Lefèvre",text:"Encore trop. Choisissez l'un des deux. Pour un mémoire de M2, deux populations comparées font déjà beaucoup de terrain.",vi:"Vẫn nhiều. Chọn một trong hai. Với luận văn M2, so sánh hai nhóm dân cư đã là rất nhiều thực địa."},{speaker:"Tâm",text:"Je penche pour les infirmières — il y a un accord bilatéral récent qui encadre leur recrutement, et c'est un terrain documenté à la DGOS.",vi:"Em nghiêng về y tá — có một hiệp định song phương gần đây quy định việc tuyển dụng, và đó là thực địa đã được lưu trữ tại DGOS."},{speaker:"Pr Lefèvre",text:"Bien. Maintenant les sources. Sayad, oui — incontournable. Wihtol de Wenden, oui. Mais ajoutez Beaud sur l'enquête de terrain et Connell sur les soignantes migrantes.",vi:"Tốt. Giờ về nguồn. Sayad, đúng — không thể thiếu. Wihtol de Wenden, đúng. Nhưng thêm Beaud về phương pháp thực địa và Connell về y tá di cư."},{speaker:"Tâm",text:"Je note. Connell est une référence anglo-saxonne — j'imagine que vous me suggérez de l'inclure pour le cadre comparatif ?",vi:"Em ghi. Connell là tham chiếu Anh ngữ — em đoán cô gợi ý đưa vào để có khung so sánh?"},{speaker:"Pr Lefèvre",text:"Exactement. Et un mémoire qui ne cite que des Français se voit, et pas en bien. Sur la méthode : vingt entretiens, c'est ambitieux pour un M2. Visez quinze, mieux travaillés.",vi:"Chính xác. Và một luận văn chỉ dẫn nguồn Pháp dễ nhận ra, và không tích cực. Về phương pháp: hai mươi phỏng vấn là tham vọng cho M2. Nhắm mười lăm, làm kỹ hơn."},{speaker:"Tâm",text:"D'accord. Donc quinze entretiens semi-directifs avec des infirmières vietnamiennes en France. Calendrier : avril-juin pour le terrain, juillet-août pour la rédaction.",vi:"Vâng. Vậy mười lăm phỏng vấn bán cấu trúc với y tá Việt Nam tại Pháp. Tiến độ: tháng 4-6 thực địa, tháng 7-8 viết."},{speaker:"Pr Lefèvre",text:"Le terrain en avril-juin est trop tendu. Vous aurez vos accès via quel canal — l'AVF ? Une association locale ? Sans porte d'entrée, vous n'aurez pas dix entretiens.",vi:"Thực địa tháng 4-6 quá gấp. Em có quyền tiếp cận qua kênh nào — AVF? Một hiệp hội địa phương? Không có cửa vào, em không kiếm nổi mười phỏng vấn."},{speaker:"Tâm",text:"J'ai déjà un contact à l'Union Générale des Vietnamiens de France qui m'ouvre trois personnes. Pour les autres, je passerai par effet boule de neige.",vi:"Em đã có một liên hệ ở Hội Người Việt Nam tại Pháp cho em ba người. Còn lại em sẽ đi theo hiệu ứng quả bóng tuyết."},{speaker:"Pr Lefèvre",text:"Bien anticipé. Dernière chose : me rendre un livrable intermédiaire fin mai — vos cinq premiers entretiens, transcrits et codés. Si on attend juillet, c'est trop tard pour ajuster.",vi:"Lường trước tốt. Điều cuối: nộp một sản phẩm trung gian cuối tháng 5 — năm phỏng vấn đầu, đã chuyển ngữ và mã hóa. Nếu đợi đến tháng 7, quá muộn để điều chỉnh."},{speaker:"Tâm",text:"Noté. Je vous envoie une version révisée de la note d'ici une semaine, et on caler un point fin mai.",vi:"Em ghi. Em sẽ gửi bản chỉnh sửa trong một tuần, và mình hẹn một buổi cuối tháng 5."},{speaker:"Pr Lefèvre",text:"Parfait. Bon courage.",vi:"Hoàn hảo. Cố lên."}],
    roleplay_prompts:["Bạn gặp giáo sư hướng dẫn lần đầu cho luận văn M2. Trình bày problématique trong 90 giây — phải đủ rộng để nghiên cứu được nhưng đủ hẹp để khả thi trong 6 tháng.","Giáo sư bác bỏ phương pháp của bạn (« vingt entretiens, c'est trop »). Thương lượng phiên bản giảm xuống 15 phỏng vấn nhưng giữ được câu hỏi nghiên cứu — không xuôi tay đầu hàng.","Giáo sư im lặng 10 giây sau khi bạn trình bày, rồi nói: « Je ne suis pas convaincu. ». Đáp lại không hoảng loạn — yêu cầu cô/thầy nói rõ điều gì khiến không thuyết phục, rồi điều chỉnh."],
    register_notes:"Với giáo sư hướng dẫn, vouvoiement bắt buộc kể cả sau nhiều năm — chuyển sang « tu » chỉ khi giáo sư chủ động đề nghị, mà điều đó hiếm khi xảy ra trong M2. Tránh các cụm hời hợt « j'aimerais explorer », « je voudrais ouvrir une réflexion » — chúng nghe mơ hồ. Thay bằng động từ hành động: « je propose de comparer », « je vais tester l'hypothèse que ». Khi giáo sư phản biện, không xin lỗi (« désolée, je ne savais pas… ») — phản hồi bằng nội dung: « Vous avez raison, dans ce cas je modifie X ». Sự khô khan của góp ý không phải bất kính — đó là chuẩn của giảng dạy đại học Pháp.",
    idiom_glosses:[{idiom:"Aller droit au but",literal:"Đi thẳng đến đích",meaning:"Vào thẳng vấn đề, không vòng vo.",example:"Allons droit au but : votre problématique est trop large."},{idiom:"Tenir la route",literal:"Giữ được đường",meaning:"Vững vàng, chịu được sự xét nét.",example:"Votre cadre théorique tient la route, mais le terrain doit être resserré."},{idiom:"Ne pas tourner autour du pot",literal:"Không xoay quanh cái nồi",meaning:"Nói thẳng, không né tránh.",example:"Je ne vais pas tourner autour du pot : votre échantillon est trop petit."},{idiom:"Mettre le pied à l'étrier",literal:"Đặt chân vào bàn đạp",meaning:"Khởi đầu chính thức một dự án.",example:"Le livrable de fin mai vous mettra le pied à l'étrier pour la rédaction."}],
    exercises:[{type:"fill-blank",instruction_vi:"Điền cụm còn thiếu khi trao đổi với giáo sư.",items:[{prompt:"Je voudrais ___ ma problématique avant de la soumettre.",answer:"affiner"},{prompt:"Je m'___ principalement sur les travaux de Sayad.",answer:"appuie"},{prompt:"Le terrain ___ une vingtaine d'entretiens.",answer:"comporterait"},{prompt:"J'ai besoin de votre ___ sur la faisabilité.",answer:"regard"}]},{type:"matching",instruction_vi:"Nối thuật ngữ với định nghĩa.",items:[{prompt:"une problématique",answer:"câu hỏi trung tâm của luận văn"},{prompt:"un entretien semi-directif",answer:"phỏng vấn có khung nhưng linh hoạt"},{prompt:"un cadre théorique",answer:"khung lý thuyết của nghiên cứu"},{prompt:"un livrable intermédiaire",answer:"sản phẩm trung gian giữa kỳ"}]},{type:"translation",instruction_vi:"Dịch sang tiếng Pháp B2 trong giọng học thuật.",items:[{prompt:"Cô đúng, em sẽ thu hẹp về y tá Việt Nam tại Pháp.",answer:"Vous avez raison, je restreins aux infirmières vietnamiennes en France."},{prompt:"Em đề xuất so sánh, không phải khám phá.",answer:"Je propose de comparer, pas d'explorer."},{prompt:"Em có thể nộp sản phẩm trung gian cuối tháng năm.",answer:"Je peux rendre un livrable intermédiaire fin mai."}]}]},
  {id:"french_b2_internship_terms",level:"B2",category:"fluency",title_vi:"Thỏa thuận điều khoản thực tập",title_en:"Negotiating internship terms",
    sentences:[{en:"Je vous remercie pour votre proposition de stage.",vi:"Em cảm ơn anh/chị về đề nghị thực tập.",pronunciation_focus:["remercie → rơ-mer-si","proposition → pro-po-zi-sion","stage → staj"]},{en:"J'aimerais clarifier quelques points avant de signer la convention.",vi:"Em muốn làm rõ vài điểm trước khi ký thỏa thuận.",pronunciation_focus:["clarifier → kla-ri-fié","quelques → kèl-kơ","convention → kon-vãn-sion"]},{en:"La gratification minimale légale pour 35 heures s'élève à environ 600 euros.",vi:"Mức trợ cấp tối thiểu theo luật cho 35 giờ là khoảng 600 euro.",pronunciation_focus:["gratification → gra-ti-fi-ka-sion","légale → lé-gal","s'élève → sé-lèv","environ → ãn-vi-rõ"]},{en:"Le télétravail partiel m'aiderait à rester soutenable financièrement.",vi:"Làm việc từ xa một phần sẽ giúp em duy trì được về mặt tài chính.",pronunciation_focus:["télétravail → té-lé-tra-vay","partiel → par-siel","soutenable → su-tơ-nabl"]},{en:"Pourrions-nous formaliser ces points par avenant à la convention ?",vi:"Mình có thể chính thức hóa các điểm này bằng phụ lục vào thỏa thuận được không?",pronunciation_focus:["pourrions → pu-rion","formaliser → for-ma-li-zé","avenant → av-nã"]}],
    cultural_notes_vi:"Stage (thực tập) ở Pháp được luật điều chỉnh chặt: trên 308 giờ phải có « gratification » (trợ cấp) tối thiểu 4,35 €/giờ năm 2026, có « convention de stage » (thỏa thuận ba bên: trường-công ty-sinh viên), và phải có « tuteur » trong công ty cùng « référent pédagogique » trong trường. Đừng nhầm lẫn với Việt Nam — nơi thực tập thường không lương và hợp đồng lỏng. Sinh viên Việt khi sang Pháp hay sai ở chỗ « ngại đòi hỏi » và chấp nhận điều kiện thấp hơn luật quy định — đó không phải khiêm tốn, đó là tự đánh giá thấp bản thân và làm khó cả người ký sau bạn. Khi công ty đề nghị mức 500 €/tháng cho stage 35h/tuần, bạn nên lịch sự nói rằng đó dưới mức luật và đề nghị 620-700 €. Người Pháp tôn trọng ứng viên biết quyền của mình.",
    tip_advice_vi:"Trước khi ký, đọc kỹ ba điểm: (1) horaires — số giờ/tuần và linh hoạt; (2) gratification — phải bằng hoặc trên mức tối thiểu, ghi rõ tính theo tháng hay theo giờ; (3) télétravail — bao nhiêu ngày, có ghi văn bản không. Đừng đàm phán bằng tiếng Anh nếu công ty Pháp — họ đánh giá việc bạn dùng tiếng Pháp đúng chỗ. Khi không chắc một điều khoản, nói « Pourriez-vous m'expliquer la clause sur X ? » thay vì gật đầu giả vờ hiểu. Sau khi đồng ý miệng, gửi email tóm tắt các điểm để có vết bằng văn bản trước khi convention được soạn chính thức.",
    vocabulary:[{word:"une convention de stage",en:"internship agreement",vi:"thỏa thuận thực tập",pos:"n.f.",pronunciation_vi:"kon-vãn-sion dơ staj"},{word:"la gratification",en:"internship stipend",vi:"trợ cấp thực tập",pos:"n.f.",pronunciation_vi:"gra-ti-fi-ka-sion"},{word:"un avenant",en:"amendment / addendum",vi:"phụ lục sửa đổi",pos:"n.m.",pronunciation_vi:"av-nã"},{word:"le télétravail",en:"remote work",vi:"làm việc từ xa",pos:"n.m.",pronunciation_vi:"té-lé-tra-vay"},{word:"un tuteur",en:"company supervisor",vi:"người hướng dẫn tại công ty",pos:"n.m.",pronunciation_vi:"tu-tơr"},{word:"un référent pédagogique",en:"academic advisor",vi:"người phụ trách phía trường",pos:"n.m.",pronunciation_vi:"ré-fé-rã pé-da-go-jik"},{word:"les horaires de travail",en:"working hours",vi:"giờ làm việc",pos:"n.m. pl.",pronunciation_vi:"o-rer dơ tra-vay"},{word:"prendre acte de",en:"to take note of (formally)",vi:"ghi nhận chính thức",pos:"v.",pronunciation_vi:"prãndr akt dơ"},{word:"être soutenable financièrement",en:"to be financially sustainable",vi:"duy trì được về tài chính",pos:"expr.",pronunciation_vi:"é-trơ su-tơ-nabl fi-nãn-sièr-mã"},{word:"signer en l'état",en:"to sign as-is",vi:"ký nguyên trạng",pos:"expr.",pronunciation_vi:"si-nié ãn lé-tà"}],
    dialogue:[{speaker:"Mme Petit",text:"Bonjour Hà, voici la convention. Vous pouvez la signer aujourd'hui ?",vi:"Chào Hà, đây là thỏa thuận. Em có thể ký hôm nay không?"},{speaker:"Hà",text:"Bonjour. Avant de signer, j'aimerais clarifier deux points.",vi:"Chào chị. Trước khi ký, em muốn làm rõ hai điểm."},{speaker:"Mme Petit",text:"Allez-y.",vi:"Em nói đi."},{speaker:"Hà",text:"Le montant de la gratification et la possibilité de deux jours de télétravail par semaine.",vi:"Mức trợ cấp và khả năng có hai ngày làm việc từ xa mỗi tuần."}],
    dialogue_long:[{speaker:"Mme Petit",text:"Bonjour Hà. J'ai votre convention prête à signer. Six mois, à plein temps, dans l'équipe marketing.",vi:"Chào Hà. Chị đã chuẩn bị thỏa thuận sẵn để ký. Sáu tháng, toàn thời gian, trong đội marketing."},{speaker:"Hà",text:"Merci, Madame Petit. Avant de signer, j'aimerais clarifier trois points si vous avez quinze minutes.",vi:"Cảm ơn chị Petit. Trước khi ký, em muốn làm rõ ba điểm nếu chị có mười lăm phút."},{speaker:"Mme Petit",text:"Bien sûr, allez-y.",vi:"Tất nhiên, em nói đi."},{speaker:"Hà",text:"D'abord, la gratification. Le document indique 530 euros par mois pour 35 heures hebdomadaires. Sauf erreur, le minimum légal pour cette durée s'élève à environ 620 euros.",vi:"Đầu tiên, trợ cấp. Tài liệu ghi 530 euro/tháng cho 35 giờ/tuần. Nếu em không nhầm, mức tối thiểu theo luật cho thời lượng này là khoảng 620 euro."},{speaker:"Mme Petit",text:"Ah. Vous avez raison, je vais vérifier avec les RH — il s'agit probablement d'un calcul fait sur 30 heures et mal recopié.",vi:"À. Em đúng, chị sẽ kiểm tra với phòng Nhân sự — có lẽ là tính theo 30 giờ và chép sai."},{speaker:"Hà",text:"Merci. Deuxième point : le télétravail. Le document n'en mentionne pas, mais lors de l'entretien on m'a parlé de deux jours par semaine. Pourriez-vous l'inscrire dans la convention ?",vi:"Cảm ơn chị. Điểm hai: làm việc từ xa. Tài liệu không nhắc đến, nhưng trong phỏng vấn em được nói hai ngày/tuần. Chị có thể ghi vào thỏa thuận được không?"},{speaker:"Mme Petit",text:"Le télétravail dépend de l'équipe et du manager. Pour vous, ce sera Antoine. Je peux ajouter une clause générique « jusqu'à deux jours selon accord du tuteur », mais pas de garantie ferme.",vi:"Làm việc từ xa tùy đội và quản lý. Với em là anh Antoine. Chị có thể thêm điều khoản chung « tối đa hai ngày theo sự đồng ý của người hướng dẫn », nhưng không phải cam kết cứng."},{speaker:"Hà",text:"Cette formulation me convient — j'aurai une base écrite pour en discuter avec Antoine. Troisième point : les horaires. La convention dit « 9h-17h30 ». Je dois rendre mon mémoire en juin et je suivrai un séminaire le mardi matin pendant six semaines. Y a-t-il une flexibilité ?",vi:"Cách diễn đạt đó phù hợp với em — em sẽ có cơ sở văn bản để thảo luận với anh Antoine. Điểm ba: giờ làm. Thỏa thuận ghi « 9h-17h30 ». Em phải nộp luận văn tháng sáu và sẽ theo một hội thảo sáng thứ ba trong sáu tuần. Có linh hoạt không?"},{speaker:"Mme Petit",text:"Pour le séminaire, oui — vous pouvez décaler vos heures le mardi, à condition de prévenir Antoine la semaine d'avant et de récupérer les heures sur la semaine.",vi:"Về hội thảo thì có — em có thể dời giờ thứ ba, với điều kiện báo anh Antoine tuần trước và bù giờ trong tuần."},{speaker:"Hà",text:"C'est tout à fait acceptable. Si je résume les ajustements : gratification recalculée à 620 euros, clause télétravail jusqu'à deux jours, et flexibilité du mardi matin pendant les six semaines de séminaire.",vi:"Hoàn toàn chấp nhận được. Em tóm tắt các điều chỉnh: trợ cấp tính lại 620 euro, điều khoản làm việc từ xa tối đa hai ngày, và linh hoạt sáng thứ ba trong sáu tuần hội thảo."},{speaker:"Mme Petit",text:"C'est ça. Je fais corriger la convention par les RH cet après-midi et je vous l'envoie demain matin pour signature électronique.",vi:"Đúng vậy. Chị sẽ cho phòng Nhân sự sửa thỏa thuận chiều nay và gửi em sáng mai để ký điện tử."},{speaker:"Hà",text:"Parfait. Je vous remercie d'avoir pris le temps. Bonne fin de journée, Madame Petit.",vi:"Hoàn hảo. Em cảm ơn chị đã dành thời gian. Chúc chị cuối ngày tốt lành, chị Petit."},{speaker:"Mme Petit",text:"Bonne fin de journée à vous aussi, Hà. À demain.",vi:"Chúc em cuối ngày tốt lành, Hà. Hẹn mai gặp."}],
    roleplay_prompts:["Công ty đề nghị stage 6 tháng, 35h/tuần, 500 €/tháng. Lịch sự chỉ ra rằng mức này dưới mức luật và đề nghị tăng — không xin lỗi vì « đòi hỏi », không xuống thang quá nhanh.","Trong convention không ghi télétravail, dù phỏng vấn đã nói có. Đề nghị thêm điều khoản — chấp nhận một công thức linh hoạt « jusqu'à X jours selon accord du tuteur » nếu công ty không cam kết cứng.","Sếp tương lai (tuteur) đến giữa cuộc đàm phán và nói: « Les stagiaires chez nous, ils ne demandent pas autant. ». Phản hồi giữ được tự tin nhưng không leo thang — nhắc đến luật, không nhắc đến « các bạn cũ »."],
    register_notes:"Đàm phán điều khoản stage dùng « vous » với cả phòng Nhân sự lẫn người tuteur — kể cả khi tuyển dụng đã « tu » với bạn trong phỏng vấn. « Vouvoiement » trong văn bản hợp đồng là chuẩn không thương lượng. Tránh hai cực: (1) khúm núm « pourriez-vous éventuellement, si possible, peut-être considérer… » — quá nhiều lớp lịch sự thành sự thiếu tự tin; (2) trực diện kiểu Anh-Mỹ « I want X » — mất điểm. Giọng đúng: « Je souhaiterais clarifier X » (tôi muốn làm rõ X) hoặc « Pourrions-nous envisager Y ? » (mình có thể tính đến Y không?). Khi nhắc đến luật, dùng cụm « Sauf erreur de ma part, le minimum légal s'élève à… » — câu này vừa khẳng định bạn đã kiểm tra, vừa để mở khả năng phòng Nhân sự đã tính đúng.",
    idiom_glosses:[{idiom:"Mettre les choses au clair",literal:"Đặt mọi việc cho rõ",meaning:"Làm rõ điều khoản, không để mơ hồ.",example:"Avant de signer, mettons les choses au clair sur le télétravail."},{idiom:"Donner sa parole",literal:"Cho lời của mình",meaning:"Cam kết bằng lời nói (danh dự).",example:"Le tuteur m'a donné sa parole sur les deux jours, mais je préfère l'écrit."},{idiom:"En bonne et due forme",literal:"Theo đúng và hình thức tốt",meaning:"Đúng quy cách pháp lý / hình thức.",example:"Je veux un avenant en bonne et due forme, signé par les RH."},{idiom:"Joindre les deux bouts",literal:"Nối hai đầu (dây)",meaning:"Đủ tiền sống — kết thúc tháng không thiếu hụt.",example:"Avec 530 euros à Paris, c'est très difficile de joindre les deux bouts."}],
    exercises:[{type:"fill-blank",instruction_vi:"Điền cụm vào câu đàm phán stage.",items:[{prompt:"J'aimerais ___ quelques points avant de signer.",answer:"clarifier"},{prompt:"La gratification minimale ___ à environ 620 euros.",answer:"s'élève"},{prompt:"Pourrions-nous formaliser ces points par ___ à la convention ?",answer:"avenant"},{prompt:"Le télétravail m'aiderait à rester ___ financièrement.",answer:"soutenable"}]},{type:"matching",instruction_vi:"Nối thuật ngữ stage với định nghĩa.",items:[{prompt:"un avenant",answer:"phụ lục sửa đổi convention"},{prompt:"un tuteur",answer:"người hướng dẫn tại công ty"},{prompt:"un référent pédagogique",answer:"người phụ trách phía trường"},{prompt:"la gratification",answer:"trợ cấp tối thiểu theo luật"}]},{type:"translation",instruction_vi:"Dịch sang tiếng Pháp lịch sự B2.",items:[{prompt:"Em xin lỗi nếu nhầm, nhưng mức tối thiểu là 620 euro.",answer:"Sauf erreur de ma part, le minimum légal s'élève à 620 euros."},{prompt:"Mình có thể chính thức hóa bằng phụ lục được không?",answer:"Pourrions-nous formaliser cela par avenant ?"},{prompt:"Em chấp nhận công thức này với điều kiện ghi văn bản.",answer:"J'accepte cette formulation à condition qu'elle soit écrite."}]}]},
  {id:"french_b2_visa_email_study_abroad",level:"B2",category:"fluency",title_vi:"Email gửi lãnh sự xin lịch hẹn visa du học",title_en:"Email to consulate requesting study visa appointment",
    sentences:[{en:"Objet : demande de rendez-vous pour visa étudiant — rentrée septembre 2026.",vi:"Tiêu đề: xin lịch hẹn visa du học — kỳ nhập học tháng 9 năm 2026.",pronunciation_focus:["objet → ob-jè","rendez-vous → rãn-dé-vu","étudiant → é-tu-diãn","rentrée → rãn-tré"]},{en:"Madame, Monsieur, je me permets de vous solliciter au sujet de mon dossier.",vi:"Kính gửi quý vị, em xin phép liên hệ về hồ sơ của em.",pronunciation_focus:["solliciter → so-li-si-té","au sujet → o sy-jè","dossier → do-sié"]},{en:"Mon attestation Campus France a été validée le 15 mars dernier.",vi:"Giấy chứng nhận Campus France của em đã được duyệt ngày 15 tháng 3 vừa qua.",pronunciation_focus:["attestation → a-tes-ta-sion","validée → va-li-dé","mars → mars"]},{en:"Faute de créneau disponible en ligne, je n'ai pu prendre rendez-vous.",vi:"Vì không có khung giờ trống trên trang đặt lịch, em chưa đặt được lịch hẹn.",pronunciation_focus:["faute → fôt","créneau → kré-no","disponible → dis-po-nibl","en ligne → ãn lin-iơ"]},{en:"Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",vi:"Trân trọng kính chào quý vị.",pronunciation_focus:["agréer → a-gré-é","salutations → sa-lu-ta-sion","distinguées → dis-tan-gé"]}],
    cultural_notes_vi:"Email hành chính Pháp khác hẳn email ở Việt Nam: phải có « objet » (tiêu đề ngắn, súc tích), một câu mở « Madame, Monsieur, » (không « Dear Sir/Madam », không « Bonjour »), thân email trong 4-6 câu, và một câu kết chuẩn « Je vous prie d'agréer… ». Sai một bước trong cấu trúc này sẽ làm email của bạn bị xếp xuống cuối hàng — lãnh sự xử lý hàng trăm email/ngày, họ cần nhận diện format quen thuộc trong 5 giây. Đừng nhầm với email công ty Pháp (cũng formal nhưng linh hoạt hơn) hay email cá nhân (tự do). Lãnh sự, prefecture, CAF, Sécurité sociale — tất cả dùng register này. Đặc biệt với visa: nhân viên lãnh sự là gatekeeper của giấc mơ du học, nên đầu tư 20 phút để viết một email đúng chuẩn còn quan trọng hơn nội dung.",
    tip_advice_vi:"Cấu trúc bắt buộc: (1) Objet rõ ràng — bao gồm loại visa và năm học. (2) Salutation « Madame, Monsieur, » với dấu phẩy. (3) Thân email — viết theo nguyên tắc một câu một ý: tự giới thiệu, lý do email, tình trạng hiện tại, đề xuất giải pháp. (4) Câu chốt « Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées. ». (5) Chữ ký họ tên đầy đủ, mã số dossier Études en France nếu có. Tránh : emoji, dấu chấm than, viết tắt, đoạn dài quá 4 dòng. Đính kèm chỉ những gì cần — đừng spam đính kèm. Gửi từ một địa chỉ email professionnelle (họ.tên@) chứ không phải tieucongchua99@.",
    vocabulary:[{word:"un dossier de visa",en:"a visa file",vi:"hồ sơ visa",pos:"n.m.",pronunciation_vi:"do-sié dơ vi-za"},{word:"une attestation Campus France",en:"Campus France attestation",vi:"giấy chứng nhận Campus France",pos:"n.f.",pronunciation_vi:"a-tes-ta-sion kãm-pyus frãns"},{word:"un créneau (de rendez-vous)",en:"appointment slot",vi:"khung giờ hẹn",pos:"n.m.",pronunciation_vi:"kré-no"},{word:"se permettre de",en:"to take the liberty of",vi:"xin phép",pos:"v.",pronunciation_vi:"sơ pèr-mè-trơ dơ"},{word:"solliciter",en:"to formally request",vi:"liên hệ chính thức",pos:"v.",pronunciation_vi:"so-li-si-té"},{word:"une plateforme de prise de rendez-vous",en:"appointment booking platform",vi:"trang đặt lịch hẹn",pos:"n.f.",pronunciation_vi:"pla-tform dơ priz dơ rãn-dé-vu"},{word:"la rentrée universitaire",en:"academic start (September)",vi:"kỳ nhập học",pos:"n.f.",pronunciation_vi:"rãn-tré u-ni-ver-si-ter"},{word:"sous huitaine",en:"within a week",vi:"trong vòng tám ngày",pos:"expr.",pronunciation_vi:"su uy-tèn"},{word:"agréer",en:"to accept (formal)",vi:"chấp nhận (lịch thiệp)",pos:"v.",pronunciation_vi:"a-gré-é"},{word:"l'expression de mes salutations distinguées",en:"my distinguished salutations (closing)",vi:"lời chào trân trọng",pos:"expr.",pronunciation_vi:"lex-prè-sion dơ mé sa-lu-ta-sion dis-tan-gé"}],
    dialogue:[{speaker:"Em (gọi điện hotline)",text:"Bonjour, j'ai envoyé un email il y a dix jours sans réponse.",vi:"Chào, em đã gửi email mười ngày trước không có phản hồi."},{speaker:"Agent",text:"Quel est l'objet précis et la date d'envoi ?",vi:"Tiêu đề chính xác và ngày gửi?"},{speaker:"Em",text:"« Demande de rendez-vous visa étudiant rentrée 2026 », envoyé le 5 mai.",vi:"« Xin lịch hẹn visa du học kỳ 2026 », gửi ngày 5 tháng 5."},{speaker:"Agent",text:"Je vois votre dossier. Un créneau s'est libéré pour le 22 mai à 9h30.",vi:"Tôi thấy hồ sơ rồi. Có một khung giờ trống ngày 22/5 lúc 9h30."}],
    dialogue_long:[{speaker:"Em (rédigeant l'email)",text:"Premier essai. Objet : « Demande de rendez-vous pour visa étudiant — rentrée septembre 2026 ».",vi:"Lần thử đầu. Objet: « Xin lịch hẹn visa du học — kỳ nhập học tháng 9 năm 2026 »."},{speaker:"Em",text:"Madame, Monsieur,",vi:"Kính gửi quý vị,"},{speaker:"Em",text:"Je me permets de vous solliciter au sujet de mon dossier de visa long séjour pour études.",vi:"Em xin phép liên hệ về hồ sơ visa du học dài hạn của em."},{speaker:"Em",text:"Je suis Madame Trần Mai, de nationalité vietnamienne, admise en master « IA et Société » à l'Université Paris-Saclay pour la rentrée universitaire 2026.",vi:"Em là chị Trần Mai, quốc tịch Việt Nam, đã trúng tuyển master « AI và Xã hội » tại Đại học Paris-Saclay cho kỳ 2026."},{speaker:"Em",text:"Mon attestation Campus France a été validée le 15 mars 2026 (numéro de dossier EEF-2026-VN-04781).",vi:"Giấy chứng nhận Campus France của em đã được duyệt ngày 15/3/2026 (số dossier EEF-2026-VN-04781)."},{speaker:"Em",text:"Faute de créneau disponible sur la plateforme de prise de rendez-vous depuis trois semaines, je n'ai pu prendre rendez-vous pour le dépôt physique de mon dossier au consulat.",vi:"Vì không có khung giờ trống trên trang đặt lịch trong ba tuần qua, em chưa đặt được lịch nộp trực tiếp tại lãnh sự."},{speaker:"Em",text:"La date de début des cours étant fixée au 1er septembre, je vous serais très reconnaissante de bien vouloir m'indiquer une solution — soit en m'attribuant un créneau exceptionnel, soit en me précisant la date d'ouverture de nouveaux créneaux.",vi:"Ngày khai giảng là 1/9, em rất biết ơn nếu quý vị có thể chỉ cho em một giải pháp — hoặc cấp một khung giờ ngoại lệ, hoặc cho em biết ngày mở khung mới."},{speaker:"Em",text:"Je reste à votre disposition pour tout complément d'information.",vi:"Em luôn sẵn sàng nếu quý vị cần thêm thông tin."},{speaker:"Em",text:"Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",vi:"Trân trọng kính chào quý vị."},{speaker:"Em",text:"Trần Thị Mai — Numéro de dossier Études en France : EEF-2026-VN-04781 — Téléphone : +84 ...",vi:"Trần Thị Mai — Số dossier Études en France: EEF-2026-VN-04781 — Số điện thoại: +84 ..."},{speaker:"(Réponse 5 jours plus tard)",text:"Madame, Suite à votre demande, un créneau exceptionnel vous est attribué le 22 mai à 9h30. Merci de vous présenter au consulat avec votre dossier complet (liste jointe). Cordialement, Service des visas.",vi:"(Phản hồi 5 ngày sau) Kính chị, theo yêu cầu của chị, một khung giờ ngoại lệ đã được cấp cho ngày 22/5 lúc 9h30. Đề nghị chị có mặt tại lãnh sự với hồ sơ đầy đủ (danh sách đính kèm). Cordialement, Phòng visa."},{speaker:"Em (répond)",text:"Madame, Monsieur, je vous remercie vivement pour ce créneau. Je confirme ma présence le 22 mai à 9h30 avec l'ensemble des pièces requises. Cordialement, Trần Thị Mai.",vi:"Em (trả lời) Kính gửi quý vị, em chân thành cảm ơn về khung giờ này. Em xác nhận có mặt ngày 22/5 lúc 9h30 với đầy đủ giấy tờ yêu cầu. Cordialement, Trần Thị Mai."}],
    roleplay_prompts:["Bạn cần viết email đến lãnh sự Pháp xin lịch hẹn visa khẩn — đã nộp hồ sơ Campus France xong, ngày khai giảng 1/9 đang đến gần. Viết email 6 dòng theo cấu trúc chuẩn.","Lãnh sự trả lời rằng tất cả các khung giờ tháng 7 đã hết, sớm nhất là tháng 9 (sau khai giảng). Trả lời email với một đề xuất cụ thể (nộp hồ sơ qua bưu điện đăng ký, hoặc xin thư tạm cho trường hoãn ngày khai giảng).","Viết email cảm ơn sau khi visa được cấp — ngắn gọn, đúng register hành chính, không nịnh hót."],
    register_notes:"Email hành chính Pháp với cơ quan công quyền (lãnh sự, préfecture, CAF, sécurité sociale, université): luôn « Madame, Monsieur, » với dấu phẩy ở đầu — không « Bonjour », không « Cher Monsieur ». Câu kết « Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées. » là chuẩn cho lần đầu hoặc khi đề nghị quan trọng. Với email tiếp theo trong cùng chuỗi có thể dùng « Cordialement » ngắn hơn. Tránh: « salut », « hi », emoji, « lol », ba dấu chấm than, viết hoa toàn câu (LIKE THIS — bị xem là hét). Đừng dùng « tu » với cơ quan công quyền dù bạn nói chuyện với một nhân viên trẻ qua hotline — họ không phản đối nhưng đó là tín hiệu thiếu trang trọng.",
    idiom_glosses:[{idiom:"Faute de mieux",literal:"Thiếu cái tốt hơn",meaning:"Vì không có lựa chọn nào khác.",example:"Faute de mieux, j'ai envoyé l'email au standard générique."},{idiom:"Sous huitaine",literal:"Trong tám ngày",meaning:"Trong vòng một tuần (cụm hành chính).",example:"L'administration s'engage à répondre sous huitaine."},{idiom:"Prendre langue avec",literal:"Cầm lưỡi với",meaning:"Liên hệ chính thức để bắt đầu thảo luận.",example:"J'ai pris langue avec le consulat la semaine dernière."},{idiom:"Faire le tour de la question",literal:"Đi quanh câu hỏi",meaning:"Xử lý hết các khía cạnh của vấn đề.",example:"Faisons d'abord le tour de la question avant d'envoyer l'email."}],
    exercises:[{type:"fill-blank",instruction_vi:"Điền cụm vào email hành chính.",items:[{prompt:"Je me ___ de vous solliciter au sujet de mon dossier.",answer:"permets"},{prompt:"___ de créneau disponible, je n'ai pu prendre rendez-vous.",answer:"Faute"},{prompt:"Je vous prie d'___, Madame, Monsieur, l'expression de mes salutations distinguées.",answer:"agréer"},{prompt:"Mon attestation Campus France a été ___ le 15 mars.",answer:"validée"}]},{type:"matching",instruction_vi:"Nối cụm với register phù hợp.",items:[{prompt:"Je vous prie d'agréer mes salutations distinguées",answer:"très formel — première fois / autorité"},{prompt:"Cordialement",answer:"formel neutre — emails suivants"},{prompt:"Bien à vous",answer:"formel chaleureux — collègue connu"},{prompt:"Salut",answer:"informel — proche / ami (interdit avec autorité)"}]},{type:"translation",instruction_vi:"Dịch sang tiếng Pháp hành chính chuẩn.",items:[{prompt:"Em xin phép liên hệ về hồ sơ visa của em.",answer:"Je me permets de vous solliciter au sujet de mon dossier de visa."},{prompt:"Vì không có khung giờ trống, em chưa đặt được lịch.",answer:"Faute de créneau disponible, je n'ai pu prendre rendez-vous."},{prompt:"Em xin chân thành cảm ơn vì khung giờ ngoại lệ này.",answer:"Je vous remercie vivement pour ce créneau exceptionnel."}]}]},
  {id:"french_b2_phone_interview_overseas",level:"B2",category:"fluency",title_vi:"Phỏng vấn qua điện thoại từ Việt Nam sang Pháp",title_en:"Phone interview from Vietnam to France",
    sentences:[{en:"Bonjour, m'entendez-vous correctement ?",vi:"Alo, anh/chị nghe em rõ không?",pronunciation_focus:["bonjour → bõ-jur","entendez → ãn-tãn-dé","correctement → kor-rek-tơ-mã"]},{en:"Le décalage horaire entre Hanoï et Paris est de cinq heures à cette saison.",vi:"Chênh lệch múi giờ giữa Hà Nội và Paris là 5 tiếng vào mùa này.",pronunciation_focus:["décalage → dé-ka-laj","horaire → o-rer","saison → sé-zon"]},{en:"Si la liaison se coupe, je vous rappelle dans les deux minutes.",vi:"Nếu kết nối bị ngắt, em sẽ gọi lại trong vòng 2 phút.",pronunciation_focus:["liaison → li-è-zon","coupe → kup","rappelle → ra-pèl"]},{en:"Pourriez-vous répéter la question ? Le son a été haché.",vi:"Anh/chị có thể nhắc lại câu hỏi không? Âm thanh bị ngắt quãng.",pronunciation_focus:["pourriez → pu-rié","répéter → ré-pé-té","haché → a-shé"]},{en:"Je vous remercie pour votre patience malgré la qualité de la connexion.",vi:"Em cảm ơn vì sự kiên nhẫn của anh/chị dù kết nối có vấn đề.",pronunciation_focus:["remercie → rơ-mer-si","patience → pa-siãns","connexion → ko-nèk-sion"]}],
    cultural_notes_vi:"Phỏng vấn qua điện thoại/video từ Việt Nam sang Pháp khó hơn phỏng vấn trực tiếp ba lý do: (1) chênh lệch múi giờ — tốt nhất họp 14h-16h Việt Nam (8h-10h Pháp); (2) độ trễ kết nối — đừng cắt lời, chờ thêm 1 giây sau khi nhà tuyển dụng nói xong; (3) thiếu ngôn ngữ cơ thể — cần phát âm rõ hơn, nói chậm hơn 10%. Người Pháp khi nghe ứng viên nói qua điện thoại sẽ chú ý đặc biệt đến giọng — nếu giọng rụt rè hoặc nói nhỏ, họ ngầm đánh giá là thiếu tự tin. Hãy ngồi thẳng (giọng phát ra mạnh hơn), mỉm cười (nghe được qua giọng), tránh nền có tiếng người. Khi mất kết nối, người Pháp expect bạn chủ động gọi lại trong 2 phút — không phải chờ họ. Khác với Việt Nam (nơi cấp dưới chờ cấp trên gọi lại), đây là tín hiệu chuyên nghiệp.",
    tip_advice_vi:"Trước cuộc gọi: kiểm tra mạng (tải tốc độ ≥ 50 Mbps), tai nghe có mic, chọn phòng yên tĩnh có ánh sáng phía trước (nếu video). Tắt thông báo điện thoại + máy tính. Đặt một cốc nước. Đầu cuộc gọi 30 giây đầu là « audio test » — nói rõ và đợi xác nhận « je vous entends bien ». Trong cuộc gọi: chú ý không nói chồng (« diaphone ») — đợi thêm nửa giây sau khi nhà tuyển dụng dứt câu. Nếu mất kết nối, gọi lại bằng số đã thống nhất, kèm tin nhắn ngắn « Désolée pour la coupure, je vous rappelle ». Sau cuộc gọi: gửi email cảm ơn trong 24 giờ kèm 2-3 điểm chính đã trao đổi.",
    vocabulary:[{word:"le décalage horaire",en:"time zone difference",vi:"chênh lệch múi giờ",pos:"n.m.",pronunciation_vi:"dé-ka-laj o-rer"},{word:"la liaison",en:"connection (audio/video)",vi:"kết nối",pos:"n.f.",pronunciation_vi:"li-è-zon"},{word:"se couper",en:"to cut out / drop",vi:"bị ngắt",pos:"v.",pronunciation_vi:"sơ ku-pé"},{word:"haché",en:"choppy (audio)",vi:"ngắt quãng",pos:"adj.",pronunciation_vi:"a-shé"},{word:"rappeler",en:"to call back",vi:"gọi lại",pos:"v.",pronunciation_vi:"ra-pơ-lé"},{word:"un casque audio",en:"headset",vi:"tai nghe có mic",pos:"n.m.",pronunciation_vi:"kask o-dio"},{word:"un fond sonore",en:"background noise",vi:"tiếng nền",pos:"n.m.",pronunciation_vi:"fõ so-nor"},{word:"être en visio",en:"to be on video call",vi:"đang gọi video",pos:"expr.",pronunciation_vi:"é-trơ ãn vi-zio"},{word:"figer",en:"to freeze (screen)",vi:"đứng hình",pos:"v.",pronunciation_vi:"fi-jé"},{word:"le débit",en:"bandwidth / speed",vi:"tốc độ mạng",pos:"n.m.",pronunciation_vi:"dé-bi"}],
    dialogue:[{speaker:"Mme Roux",text:"Bonjour, vous m'entendez ?",vi:"Chào em, em nghe rõ chứ?"},{speaker:"Linh",text:"Oui parfaitement, et vous ?",vi:"Vâng rất rõ, còn chị thì sao?"},{speaker:"Mme Roux",text:"Très bien. Le son hache un peu, mais ça va.",vi:"Rất tốt. Âm hơi ngắt quãng, nhưng ổn."},{speaker:"Linh",text:"Si jamais ça se coupe, je vous rappelle dans les deux minutes.",vi:"Nếu mất kết nối, em sẽ gọi lại trong 2 phút."}],
    dialogue_long:[{speaker:"Mme Roux",text:"Bonjour Madame Trần. Vous m'entendez bien ?",vi:"Chào chị Trần. Chị nghe rõ tôi chứ?"},{speaker:"Linh",text:"Oui, parfaitement, Madame Roux. Et vous ? La qualité audio est correcte de votre côté ?",vi:"Vâng, rất rõ, chị Roux. Còn chị thì sao? Chất lượng âm thanh phía chị có ổn không?"},{speaker:"Mme Roux",text:"Très correcte. Avant de commencer, est-ce qu'on est bien sur quarante-cinq minutes comme prévu ?",vi:"Rất ổn. Trước khi bắt đầu, mình thống nhất 45 phút như đã hẹn nhé?"},{speaker:"Linh",text:"Oui, c'est noté. Si jamais la liaison se coupe, je vous rappelle dans les deux minutes au numéro fixe que vous m'avez communiqué.",vi:"Vâng, em đã note. Nếu kết nối bị ngắt, em sẽ gọi lại trong 2 phút vào số bàn chị đã cho em."},{speaker:"Mme Roux",text:"Parfait. Première question : présentez-vous en cinq minutes.",vi:"Hoàn hảo. Câu đầu: chị giới thiệu bản thân trong 5 phút."},{speaker:"Linh",text:"Bien sûr. Je m'appelle Trần Linh. Je suis...",vi:"Vâng. Em là Trần Linh. Em..."},{speaker:"Mme Roux",text:"Pardon, le son vient de se hacher. Pourriez-vous reprendre depuis le début ?",vi:"Xin lỗi, âm vừa ngắt quãng. Chị có thể bắt đầu lại từ đầu được không?"},{speaker:"Linh",text:"Aucun problème. Je vais aussi parler un peu plus lentement. Donc je m'appelle Trần Linh, j'ai vingt-six ans, je suis basée à Hanoï où j'ai obtenu un master en management à l'Université Économique de Hanoï.",vi:"Không vấn đề. Em sẽ nói chậm hơn một chút. Vậy em là Trần Linh, 26 tuổi, em hiện sống ở Hà Nội nơi em đã lấy bằng thạc sĩ quản trị tại Đại học Kinh tế Hà Nội."},{speaker:"Mme Roux",text:"Très bien. Je vous entends parfaitement maintenant.",vi:"Rất tốt. Giờ tôi nghe chị rất rõ."},{speaker:"Linh",text:"Depuis trois ans je travaille comme cheffe de projet chez Vietcombank, où je gère une équipe de cinq personnes sur les financements verts pour PME.",vi:"Ba năm nay em làm trưởng dự án tại Vietcombank, quản lý đội năm người về tài chính xanh cho doanh nghiệp vừa và nhỏ."},{speaker:"Mme Roux",text:"Et qu'est-ce qui vous amène à vouloir quitter Vietcombank pour rejoindre notre cabinet à Paris ?",vi:"Và điều gì khiến chị muốn rời Vietcombank để tham gia công ty tư vấn của chúng tôi ở Paris?"},{speaker:"Linh",text:"Trois raisons. La première : votre cabinet conseille les PME asiatiques sur l'accès au financement européen — c'est exactement le pont que je veux faire. La deuxième : le poste me permet de garder un lien avec le terrain vietnamien tout en montant en compétence sur les standards européens. La troisième : votre équipe est petite et internationale, ce qui correspond à mon style de travail.",vi:"Ba lý do. Thứ nhất: công ty của chị tư vấn cho doanh nghiệp châu Á về tiếp cận tài chính châu Âu — đúng là cây cầu em muốn xây. Thứ hai: vị trí cho em giữ liên kết với thực địa Việt Nam đồng thời nâng năng lực theo chuẩn châu Âu. Thứ ba: đội của chị nhỏ và quốc tế, phù hợp phong cách làm việc của em."},{speaker:"Mme Roux",text:"Bien argumenté. Avec le décalage horaire, comment imaginez-vous travailler avec l'équipe parisienne ?",vi:"Lập luận tốt. Với chênh lệch múi giờ, chị tưởng tượng làm việc với đội Paris ra sao?"},{speaker:"Linh",text:"Si je suis basée à Hanoï temporairement, je propose des plages communes 14h-17h Vietnam, soit 8h-11h Paris. Pour les sujets asynchrones, je documente dans Notion en français pour faciliter la transmission. À terme, je m'installe à Paris pour les six premiers mois pour bâtir les liens internes.",vi:"Nếu em tạm ở Hà Nội, em đề xuất khung chung 14h-17h Việt Nam, tức 8h-11h Paris. Cho việc bất đồng bộ, em document trên Notion bằng tiếng Pháp để dễ chuyển giao. Về lâu dài, em sang Paris 6 tháng đầu để xây liên kết nội bộ."},{speaker:"Mme Roux",text:"Très concret. On a encore quinze minutes — je vais vous poser un cas pratique...",vi:"Rất cụ thể. Còn 15 phút — tôi sẽ cho chị một case thực hành..."}],
    roleplay_prompts:["Cuộc gọi bị ngắt giữa câu trả lời quan trọng. Gọi lại ngay và mở đầu — không xin lỗi quá đà, không trách mạng, vào thẳng nội dung tiếp tục từ điểm vừa cắt.","Nhà tuyển dụng nói: « Je vous entends mal, vous pouvez parler plus fort ? ». Phản hồi đúng cách: kiểm tra mic, chuyển sang tai nghe có mic nếu chưa dùng, không la lên, không hoảng loạn.","Cuối phỏng vấn nhà tuyển dụng hỏi: « Vous avez des contraintes liées au visa ? ». Trả lời thẳng và chuyên nghiệp về timeline visa du học → visa làm việc, đề xuất plan B nếu visa chậm."],
    register_notes:"Phỏng vấn qua điện thoại/video dùng « vous » luôn — kể cả khi mạng ngắt và bạn lúng túng. Tránh hai cực: (1) « excusez-moi, excusez-moi, excusez-moi » — quá nhiều xin lỗi cho lỗi kỹ thuật làm mất phong độ; (2) im lặng hoặc cười trừ — nhà tuyển dụng nghĩ bạn không chuyên nghiệp. Giọng đúng khi có vấn đề kỹ thuật: thẳng thắn, ngắn gọn, đề xuất giải pháp. « Le son hache un peu, je passe sur l'autre micro » thay vì « Oh non, je suis désolée, je ne sais pas ce qui se passe ». Khi mất kết nối, đừng gửi tin nhắn « SOS » hay emoji — gửi SMS chuẩn « Désolée pour la coupure, je vous rappelle dans 1 minute ».",
    idiom_glosses:[{idiom:"Tenir le coup",literal:"Cầm cự được cú đánh",meaning:"Chịu được áp lực, không gục.",example:"Avec le décalage horaire, j'ai dû tenir le coup pendant un entretien à 22h."},{idiom:"Garder son sang-froid",literal:"Giữ máu lạnh",meaning:"Bình tĩnh trong tình huống khó.",example:"Quand la connexion s'est coupée, j'ai gardé mon sang-froid et rappelé."},{idiom:"Couper la poire en deux",literal:"Cắt quả lê làm đôi",meaning:"Thỏa hiệp, mỗi bên nhường một nửa.",example:"Pour les horaires, on coupe la poire en deux : 14h-17h Vietnam."},{idiom:"Tirer son épingle du jeu",literal:"Rút cây ghim khỏi trò chơi",meaning:"Xoay xở thành công trong tình huống khó.",example:"Malgré la mauvaise liaison, elle a tiré son épingle du jeu."}],
    exercises:[{type:"fill-blank",instruction_vi:"Điền cụm vào câu phỏng vấn từ xa.",items:[{prompt:"Le ___ horaire entre Hanoï et Paris est de cinq heures.",answer:"décalage"},{prompt:"Si la liaison se ___, je vous rappelle.",answer:"coupe"},{prompt:"Pourriez-vous ___ la question ? Le son a été haché.",answer:"répéter"},{prompt:"Je vous remercie pour votre ___ malgré la qualité de la connexion.",answer:"patience"}]},{type:"matching",instruction_vi:"Nối thành ngữ với nghĩa phù hợp khi phỏng vấn từ xa.",items:[{prompt:"Tenir le coup",answer:"chịu được áp lực dài"},{prompt:"Garder son sang-froid",answer:"giữ bình tĩnh trong tình huống khó"},{prompt:"Couper la poire en deux",answer:"thỏa hiệp mỗi bên nhường nửa"},{prompt:"Tirer son épingle du jeu",answer:"xoay xở thành công"}]},{type:"translation",instruction_vi:"Dịch sang tiếng Pháp lịch sự B2.",items:[{prompt:"Nếu mất kết nối, em sẽ gọi lại trong 2 phút.",answer:"Si la liaison se coupe, je vous rappelle dans les deux minutes."},{prompt:"Anh/chị có thể nhắc lại câu hỏi được không?",answer:"Pourriez-vous répéter la question ?"},{prompt:"Em đề xuất khung chung 14h-17h giờ Việt Nam.",answer:"Je propose des plages communes 14h-17h heure du Vietnam."}]}]},
  {id:"french_b2_networking_event",level:"B2",category:"fluency",title_vi:"Networking tại sự kiện chuyên ngành",title_en:"Networking at a professional event",
    sentences:[{en:"Bonsoir, je crois que nous ne nous connaissons pas — Trần Mai.",vi:"Chào tối, em nghĩ mình chưa quen nhau — em là Trần Mai.",pronunciation_focus:["bonsoir → bõ-swar","crois → krwa","connaissons → ko-nè-sõn"]},{en:"Je travaille dans la transition énergétique côté Asie du Sud-Est.",vi:"Em làm về chuyển đổi năng lượng phía Đông Nam Á.",pronunciation_focus:["transition → trãn-zi-sion","énergétique → é-ner-jé-tik","côté → kô-té","sud-est → syud-èst"]},{en:"Qu'est-ce qui vous a amené à cette conférence ?",vi:"Điều gì đưa anh/chị đến hội nghị này?",pronunciation_focus:["amené → a-mơ-né","cette → sèt","conférence → kõn-fé-rãns"]},{en:"Auriez-vous une carte ? J'aimerais reprendre contact la semaine prochaine.",vi:"Anh/chị có name card không? Em muốn liên lạc lại tuần sau.",pronunciation_focus:["auriez → o-rié","carte → kart","reprendre → rơ-prãn-drơ"]},{en:"Je vous laisse profiter de la soirée. Très enchantée de vous avoir rencontré.",vi:"Em xin nhường để anh/chị tận hưởng buổi tối. Rất vui được gặp anh/chị.",pronunciation_focus:["laisse → lès","profiter → pro-fi-té","enchantée → ãn-shãn-té"]}],
    cultural_notes_vi:"Networking ở Pháp khác hẳn ở Mỹ và Việt Nam. Khác Mỹ: người Pháp ghét cách « pitch » trực diện 30 giây — nó bị xem là thô và thương mại. Khác Việt Nam: người Pháp không thích trao name card ngay từ phút đầu — name card được trao sau khi đã có 5-10 phút trò chuyện thực sự. Quy tắc bất thành văn: bắt đầu bằng câu hỏi (« Qu'est-ce qui vous amène ? »), không bằng pitch về bản thân. Đợi câu hỏi ngược của họ trước khi giới thiệu mình. Trao name card chỉ khi đã thấy có lý do gặp lại — ép trao card khi chưa có nội dung sẽ bị quên ngay. Người Pháp đặc biệt quý « la conversation » — họ thích trò chuyện thông minh hơn là giao dịch. Một cuộc trò chuyện 15 phút có chiều sâu giá hơn 10 cái card thu được. Email follow-up trong 48 giờ là chuẩn — không nhanh quá (chưa kịp rời sự kiện), không chậm quá (sau 1 tuần họ đã quên mặt).",
    tip_advice_vi:"Trước sự kiện: nghiên cứu danh sách diễn giả và 3 người bạn muốn gặp — không phải để stalker mà để có chủ đề mở thoại. Trang phục business smart, không quá trang trọng (suit + tie cho hội nghị tech là sai chỗ). Trong sự kiện: cầm cốc nước/rượu bằng tay trái (để tay phải bắt). Mở thoại bằng câu hỏi mở về sự kiện. Lắng nghe gấp đôi nói. Ghi note nhanh sau mỗi cuộc gặp (2 từ khóa giúp nhớ). Sau sự kiện 24-48 giờ: gửi email LinkedIn cá nhân hóa — nhắc cụ thể chủ đề đã trao đổi, không phải mẫu copy-paste. Đề xuất một bước tiếp theo cụ thể (cà phê 30 phút, tài liệu chia sẻ, giới thiệu người thứ ba).",
    vocabulary:[{word:"le réseautage",en:"networking",vi:"kết nối nghề nghiệp",pos:"n.m.",pronunciation_vi:"ré-zô-taj"},{word:"une conférence",en:"a conference",vi:"hội nghị",pos:"n.f.",pronunciation_vi:"kõn-fé-rãns"},{word:"un intervenant",en:"a speaker (panelist)",vi:"diễn giả",pos:"n.m.",pronunciation_vi:"an-tèr-vơ-nãn"},{word:"une carte de visite",en:"business card",vi:"name card",pos:"n.f.",pronunciation_vi:"kart dơ vi-zit"},{word:"reprendre contact",en:"to reconnect",vi:"liên lạc lại",pos:"expr.",pronunciation_vi:"rơ-prãn-drơ kon-takt"},{word:"un cocktail dînatoire",en:"standing dinner reception",vi:"tiệc đứng",pos:"n.m.",pronunciation_vi:"kok-tel di-na-twar"},{word:"un sponsor",en:"sponsor",vi:"nhà tài trợ",pos:"n.m.",pronunciation_vi:"spõn-sor"},{word:"l'écosystème",en:"ecosystem",vi:"hệ sinh thái",pos:"n.m.",pronunciation_vi:"é-ko-sis-tèm"},{word:"se présenter",en:"to introduce oneself",vi:"giới thiệu bản thân",pos:"v.",pronunciation_vi:"sơ pré-zãn-té"},{word:"trouver un terrain d'entente",en:"to find common ground",vi:"tìm điểm chung",pos:"expr.",pronunciation_vi:"tru-vé an tè-rãn dãn-tãnt"}],
    dialogue:[{speaker:"Mai",text:"Bonsoir, je vois que vous étiez à la table ronde sur l'hydrogène vert.",vi:"Chào tối, em thấy anh/chị có mặt ở bàn tròn về hydrogen xanh."},{speaker:"M. Garnier",text:"Oui, intervenant. Vous travaillez dans le secteur ?",vi:"Vâng, tôi là diễn giả. Cô làm trong lĩnh vực này à?"},{speaker:"Mai",text:"Côté Asie du Sud-Est, sur l'accompagnement des PME vietnamiennes.",vi:"Phía Đông Nam Á, hỗ trợ doanh nghiệp vừa và nhỏ Việt Nam."},{speaker:"M. Garnier",text:"Intéressant, on devrait reprendre contact — vous avez une carte ?",vi:"Thú vị, mình nên liên lạc lại — em có name card không?"}],
    dialogue_long:[{speaker:"Mai",text:"Bonsoir. Je crois que nous ne nous connaissons pas — Trần Mai.",vi:"Chào tối. Em nghĩ mình chưa quen nhau — em là Trần Mai."},{speaker:"M. Garnier",text:"Bonsoir. Pierre Garnier, ravi. Vous étiez à quelle session aujourd'hui ?",vi:"Chào tối. Pierre Garnier, hân hạnh. Em đã dự buổi nào hôm nay?"},{speaker:"Mai",text:"À votre table ronde sur l'hydrogène vert, justement. Votre point sur le coût caché du transport m'a interpellée.",vi:"Đúng là bàn tròn về hydrogen xanh của anh. Điểm anh nêu về chi phí ẩn của vận chuyển khiến em suy nghĩ."},{speaker:"M. Garnier",text:"Ah, vous avez relevé ce point. La plupart se concentrent sur le coût de production. Vous travaillez dans le secteur ?",vi:"À, em chú ý điểm đó. Đa số chỉ tập trung vào chi phí sản xuất. Em làm trong ngành này à?"},{speaker:"Mai",text:"Sur l'accompagnement des PME vietnamiennes dans la transition énergétique. Beaucoup d'usines textiles veulent diversifier vers l'hydrogène mais buttent sur la logistique portuaire.",vi:"Em hỗ trợ doanh nghiệp vừa và nhỏ Việt Nam chuyển đổi năng lượng. Nhiều nhà máy dệt muốn đa dạng sang hydrogen nhưng vướng logistics cảng."},{speaker:"M. Garnier",text:"Le port de Hai Phong, c'est ça ? Un de mes anciens collègues y travaille pour ENGIE.",vi:"Cảng Hải Phòng đúng không? Một đồng nghiệp cũ của tôi làm ở đó cho ENGIE."},{speaker:"Mai",text:"Exactement. Le sujet est à la fois technique et politique — le projet ENGIE est en pause depuis novembre, en attente d'arbitrage du ministère.",vi:"Chính xác. Vấn đề vừa kỹ thuật vừa chính trị — dự án ENGIE đang tạm dừng từ tháng 11, chờ Bộ phán quyết."},{speaker:"M. Garnier",text:"Je n'avais pas cette information. Comment vous l'obtenez ?",vi:"Tôi không có thông tin này. Em lấy ở đâu?"},{speaker:"Mai",text:"Par mon réseau directs sur place — j'étais sur le terrain trois fois cette année. C'est aussi pour ça que je suis venue à cette conférence : croiser les angles européens.",vi:"Qua mạng lưới trực tiếp tại chỗ — em đã ra thực địa ba lần năm nay. Cũng vì thế em đến hội nghị này: đối chiếu các góc nhìn châu Âu."},{speaker:"M. Garnier",text:"On devrait vraiment reprendre contact. J'ai un projet d'étude comparée Asie/Europe qui pourrait vous intéresser. Vous avez une carte ?",vi:"Mình nên thực sự liên lạc lại. Tôi có một dự án nghiên cứu so sánh Á/Âu có thể em quan tâm. Em có name card không?"},{speaker:"Mai",text:"Oui, voici. Je vous envoie un mail demain avec une note de deux pages sur la situation Hai Phong, ça vous donnera de la matière concrète.",vi:"Vâng, đây ạ. Em sẽ gửi email mai kèm note 2 trang về tình hình Hải Phòng, để anh có dữ liệu cụ thể."},{speaker:"M. Garnier",text:"Parfait. Voici ma carte aussi. Une dernière chose — vous connaissez Sophie Martin du CNRS ? Elle pilote un projet ANR sur exactement ce sujet.",vi:"Hoàn hảo. Đây là name card của tôi. Một điều cuối — em có biết Sophie Martin ở CNRS không? Cô ấy điều phối một dự án ANR đúng chủ đề này."},{speaker:"Mai",text:"Non, pas encore. Si vous pouviez me la présenter par mail, ce serait précieux.",vi:"Chưa biết. Nếu anh có thể giới thiệu em qua email, sẽ rất quý."},{speaker:"M. Garnier",text:"Avec plaisir. Je le ferai dans la semaine. Bon courage pour la suite de la soirée.",vi:"Với niềm vui. Tôi sẽ làm trong tuần này. Chúc em buổi tối còn lại tốt lành."},{speaker:"Mai",text:"Merci beaucoup, Pierre. À très bientôt.",vi:"Cảm ơn anh nhiều, Pierre. Hẹn sớm gặp lại."}],
    roleplay_prompts:["Bạn đến networking lần đầu, không quen ai. Tiếp cận một nhóm 3 người đang nói chuyện — không cắt lời, không hỏi « Excusez-moi, je peux me joindre ? » (kỳ cục). Tìm thời điểm đúng để mở thoại tự nhiên.","Một CEO Pháp lớn tuổi nói trong 5 phút về thành tựu của ông ấy mà không hỏi bạn câu nào. Khéo léo chuyển hướng cuộc trò chuyện về phía bạn mà không tỏ ra ngắt lời.","Bạn vừa trao đổi tốt 10 phút với một quan chức nhà nước. Đề nghị trao đổi name card một cách đúng đắn — không xin trước khi họ chủ động, nhưng cũng không bỏ qua cơ hội."],
    register_notes:"Networking ở Pháp nửa formal nửa decontracté — vouvoiement vẫn chuẩn nhưng giọng có thể nhẹ nhàng hơn. Sai phổ biến của người Việt: (1) gọi « Sir/Madam » bằng tiếng Anh khi quên tên — đúng là phải dùng « Monsieur/Madame » + họ nếu nhớ; (2) name card đưa bằng hai tay kèm cúi đầu kiểu Á — ở Pháp một tay là đủ, không cần cúi; (3) gọi « Pierre » ngay sau khi vừa giới thiệu (« Pierre Garnier ») — phải đợi anh ấy đề nghị « Appelez-moi Pierre » trước. Khi không nhớ tên, đừng gồng — nói thẳng « Pardonnez-moi, je n'ai pas votre prénom en tête » — người Pháp coi đó là honest, không thiếu lịch sự.",
    idiom_glosses:[{idiom:"Briser la glace",literal:"Bẻ gãy lớp băng",meaning:"Phá vỡ sự ngại ngùng ban đầu.",example:"Pour briser la glace, j'ai commenté la table ronde du matin."},{idiom:"Avoir l'oreille de quelqu'un",literal:"Có cái tai của ai đó",meaning:"Được ai đó lắng nghe / có ảnh hưởng.",example:"Sophie Martin a l'oreille du ministre — c'est pour ça que son projet avance."},{idiom:"Faire jouer son réseau",literal:"Cho mạng lưới của mình hoạt động",meaning:"Tận dụng quan hệ để giúp ai đó.",example:"Pierre va faire jouer son réseau pour me présenter Sophie."},{idiom:"Tisser des liens",literal:"Dệt các liên kết",meaning:"Xây dựng quan hệ chậm rãi, có chiều sâu.",example:"Une conférence ne suffit pas — il faut tisser des liens sur plusieurs mois."}],
    exercises:[{type:"fill-blank",instruction_vi:"Điền cụm vào câu networking.",items:[{prompt:"Qu'est-ce qui vous a ___ à cette conférence ?",answer:"amené"},{prompt:"J'aimerais ___ contact la semaine prochaine.",answer:"reprendre"},{prompt:"Auriez-vous une ___ ?",answer:"carte"},{prompt:"Très ___ de vous avoir rencontré.",answer:"enchantée"}]},{type:"matching",instruction_vi:"Nối thành ngữ với nghĩa networking.",items:[{prompt:"Briser la glace",answer:"phá vỡ ngại ngùng đầu cuộc gặp"},{prompt:"Avoir l'oreille de quelqu'un",answer:"được lắng nghe / có ảnh hưởng"},{prompt:"Faire jouer son réseau",answer:"tận dụng quan hệ giúp người khác"},{prompt:"Tisser des liens",answer:"xây quan hệ chiều sâu lâu dài"}]},{type:"translation",instruction_vi:"Dịch sang tiếng Pháp lịch sự B2.",items:[{prompt:"Em sẽ gửi email mai kèm note 2 trang.",answer:"Je vous envoie un mail demain avec une note de deux pages."},{prompt:"Nếu anh có thể giới thiệu em với cô ấy, sẽ rất quý.",answer:"Si vous pouviez me la présenter, ce serait précieux."},{prompt:"Em rất vui được gặp anh hôm nay.",answer:"Très enchantée de vous avoir rencontré aujourd'hui."}]}]},
  {id:"french_b2_followup_rejected_application",level:"B2",category:"fluency",title_vi:"Email follow-up sau khi bị từ chối ứng tuyển",title_en:"Follow-up email after a rejected application",
    sentences:[{en:"Je vous remercie pour votre retour, même s'il est négatif.",vi:"Em cảm ơn anh/chị đã phản hồi, dù là tin không mong đợi.",pronunciation_focus:["remercie → rơ-mer-si","retour → rơ-tur","négatif → né-ga-tif"]},{en:"Auriez-vous quelques minutes pour m'indiquer les points d'amélioration ?",vi:"Anh/chị có thể dành vài phút chỉ ra các điểm em cần cải thiện không?",pronunciation_focus:["auriez → o-rié","indiquer → an-di-ké","amélioration → a-mé-lio-ra-sion"]},{en:"Je reste très intéressée par votre cabinet et par d'éventuelles opportunités futures.",vi:"Em vẫn rất quan tâm đến công ty và các cơ hội tiềm năng trong tương lai.",pronunciation_focus:["intéressée → an-té-rè-sé","cabinet → ka-bi-nè","éventuelles → é-vãn-tu-èl"]},{en:"Si un poste similaire s'ouvrait, je serais ravie d'être considérée à nouveau.",vi:"Nếu có vị trí tương tự mở ra, em rất vui được xét duyệt lại.",pronunciation_focus:["similaire → si-mi-lèr","s'ouvrait → su-vrè","considérée → kon-si-dé-ré"]},{en:"Je vous souhaite plein succès dans votre choix final.",vi:"Em chúc anh/chị nhiều thành công với lựa chọn cuối cùng.",pronunciation_focus:["souhaite → swèt","plein → plã","succès → syuk-sè","choix → shwa"]}],
    cultural_notes_vi:"Email follow-up sau khi bị từ chối là kỹ năng B2 mà rất ít người Việt làm tốt — vì văn hóa Việt Nam không quen với việc « chấp nhận từ chối một cách chuyên nghiệp ». Ở Pháp, gửi một email lịch sự sau khi bị từ chối là dấu hiệu của ứng viên trưởng thành — nhà tuyển dụng nhớ bạn cho lần tuyển sau. Một câu chuyện thường gặp: người Pháp tuyển 3 lần trong 18 tháng cho cùng một vị trí (do nghỉ việc, mở rộng đội), và ứng viên thứ tư của lần đầu được tuyển ở lần thứ ba. Email follow-up giúp bạn nằm trong vòng đầu của « pipeline ngầm ». Ngược lại, không phản hồi gì sau khi bị từ chối là tín hiệu non nớt — nhà tuyển dụng nghĩ « cô/cậu này không tha thiết thật ». Đừng nhầm: follow-up không phải van xin xem lại quyết định — đó là giữ cánh cửa mở. Đặc biệt với vị trí ở công ty Pháp tại Việt Nam: thị trường nhỏ, tin đồn lan nhanh, một email lịch sự sẽ được nhớ trong nhiều năm.",
    tip_advice_vi:"Cấu trúc email 4 dòng ngắn: (1) Cảm ơn — không cay đắng, không van xin; (2) Đề nghị feedback — một câu hỏi mở; (3) Khẳng định quan tâm dài hạn — gợi ý cơ hội tương lai; (4) Câu chốt lịch sự. Tránh: nói lý do từ chối là « unfair », so sánh với người được chọn, ám chỉ họ « bỏ lỡ talent », emoji, dấu chấm than. Gửi email trong 24-48 giờ sau khi nhận tin từ chối — không quá lâu (họ quên), không quá nhanh (cảm xúc còn nóng). Nếu họ trả lời với feedback — cảm ơn ngay, ghi nhận, không tranh luận. Nếu không trả lời — không gửi tiếp; chấp nhận im lặng là câu trả lời. Lưu trữ contact và follow-up một lần nữa sau 6 tháng nếu thấy có cơ hội tương tự xuất hiện.",
    vocabulary:[{word:"un retour (négatif)",en:"a (negative) reply",vi:"phản hồi (không mong đợi)",pos:"n.m.",pronunciation_vi:"rơ-tur né-ga-tif"},{word:"des points d'amélioration",en:"areas for improvement",vi:"điểm cần cải thiện",pos:"n.m. pl.",pronunciation_vi:"pwã da-mé-lio-ra-sion"},{word:"une candidature",en:"an application",vi:"hồ sơ ứng tuyển",pos:"n.f.",pronunciation_vi:"kãn-di-da-tur"},{word:"un poste similaire",en:"a similar position",vi:"vị trí tương tự",pos:"n.m.",pronunciation_vi:"post si-mi-lèr"},{word:"être considérée à nouveau",en:"to be reconsidered",vi:"được xét duyệt lại",pos:"expr.",pronunciation_vi:"é-trơ kon-si-dé-ré a nu-vô"},{word:"garder la porte ouverte",en:"to keep the door open",vi:"giữ cửa mở (cho cơ hội sau)",pos:"expr.",pronunciation_vi:"gar-dé la port u-vert"},{word:"un retour constructif",en:"constructive feedback",vi:"phản hồi xây dựng",pos:"n.m.",pronunciation_vi:"rơ-tur kon-stryuk-tif"},{word:"sans rancune",en:"no hard feelings",vi:"không thù hằn",pos:"expr.",pronunciation_vi:"sãn rãn-kyun"},{word:"rebondir",en:"to bounce back",vi:"vực dậy",pos:"v.",pronunciation_vi:"rơ-bõn-dir"},{word:"l'humilité professionnelle",en:"professional humility",vi:"sự khiêm tốn chuyên nghiệp",pos:"n.f.",pronunciation_vi:"u-mi-li-té pro-fè-sio-nèl"}],
    dialogue:[{speaker:"Linh (email envoyé)",text:"Madame Roy, je vous remercie pour votre retour, même s'il n'a pas été en ma faveur.",vi:"Chị Roy, em cảm ơn về phản hồi, dù không theo hướng có lợi cho em."},{speaker:"Mme Roy (réponse)",text:"Bonjour Linh, votre démarche est appréciée. Avez-vous quinze minutes mardi pour un debrief ?",vi:"Chào Linh, cách em làm rất đáng quý. Em có 15 phút thứ ba để debrief không?"},{speaker:"Linh",text:"Avec grand plaisir. Mardi 15h heure de Paris ?",vi:"Rất sẵn lòng. Thứ ba 15h giờ Paris được không?"},{speaker:"Mme Roy",text:"C'est noté. Je vous envoie l'invitation.",vi:"Đã note. Tôi sẽ gửi lời mời."}],
    dialogue_long:[{speaker:"Linh (email J+1)",text:"Objet : Suite à votre réponse — Linh Trần (consultant junior, mars 2026)",vi:"Tiêu đề: Tiếp theo phản hồi của chị — Linh Trần (consultant junior, tháng 3/2026)"},{speaker:"Linh",text:"Bonjour Madame Roy,",vi:"Chào chị Roy,"},{speaker:"Linh",text:"Je vous remercie pour votre retour reçu hier, même s'il n'a pas été en ma faveur. Je comprends que le choix s'est porté sur un profil avec davantage d'expérience en conseil pur, et c'est un critère parfaitement légitime.",vi:"Em cảm ơn về phản hồi nhận hôm qua, dù không theo hướng có lợi cho em. Em hiểu lựa chọn nghiêng về hồ sơ có nhiều kinh nghiệm tư vấn thuần túy hơn, và đó là tiêu chí hoàn toàn hợp lý."},{speaker:"Linh",text:"Si vous disposez de quelques minutes dans les prochaines semaines, j'apprécierais grandement un retour plus précis sur les points sur lesquels je peux progresser. Cela me serait utile pour mes prochaines candidatures.",vi:"Nếu chị có vài phút trong những tuần tới, em sẽ rất cảm kích nếu được nghe phản hồi cụ thể về các điểm em có thể cải thiện. Điều đó sẽ giúp em cho các đợt ứng tuyển tới."},{speaker:"Linh",text:"Par ailleurs, je reste très intéressée par votre cabinet, et notamment par votre activité Asie du Sud-Est. Si un poste similaire s'ouvrait dans les douze prochains mois, je serais ravie d'être considérée à nouveau.",vi:"Bên cạnh đó, em vẫn rất quan tâm đến công ty, đặc biệt mảng Đông Nam Á. Nếu có vị trí tương tự mở ra trong 12 tháng tới, em rất vui được xét duyệt lại."},{speaker:"Linh",text:"Je vous souhaite plein succès dans la prise de poste de la candidate retenue.",vi:"Em chúc chị nhiều thành công với việc tiếp nhận ứng viên được chọn."},{speaker:"Linh",text:"Cordialement, Trần Linh",vi:"Cordialement, Trần Linh"},{speaker:"(Mme Roy répond le lendemain)",text:"Bonjour Linh, je tiens à vous remercier pour ce message, qui dénote une vraie maturité professionnelle. Très peu de candidats prennent le temps de revenir vers nous après un refus.",vi:"(Chị Roy trả lời hôm sau) Chào Linh, tôi muốn cảm ơn em về tin nhắn này, thể hiện sự trưởng thành nghề nghiệp thực sự. Rất ít ứng viên dành thời gian quay lại sau khi bị từ chối."},{speaker:"Mme Roy",text:"Pour répondre franchement, votre dossier était très solide ; ce qui a fait la différence, c'est qu'au cas pratique l'autre candidate a quantifié l'impact en euros, là où vous êtes restée en pourcentages. C'est un détail, mais ça a pesé.",vi:"Trả lời thẳng, hồ sơ của em rất vững; điều tạo khác biệt là trong case thực hành, ứng viên kia đã đo tác động bằng euro, trong khi em dùng phần trăm. Là chi tiết nhỏ, nhưng có tác động."},{speaker:"Mme Roy",text:"Pour le reste : votre profil franco-vietnamien est rare et précieux. Nous avons un projet de bureau à Hanoï prévu pour fin 2026 — j'ai noté votre nom dans nos contacts prioritaires. Je vous recontacterai dès que ce sera concret.",vi:"Còn lại: hồ sơ Pháp-Việt của em hiếm và quý. Chúng tôi có kế hoạch mở văn phòng Hà Nội cuối 2026 — tôi đã ghi tên em vào danh sách ưu tiên. Tôi sẽ liên lạc lại khi cụ thể."},{speaker:"Mme Roy",text:"Cordialement, Élise Roy",vi:"Cordialement, Élise Roy"},{speaker:"Linh (réponse même jour)",text:"Madame Roy, ce retour est extrêmement précieux — chiffrer en euros plutôt qu'en pourcentages est un point que je vais immédiatement intégrer. Je note avec attention l'ouverture de votre bureau à Hanoï. Bien à vous, Linh.",vi:"Chị Roy, phản hồi này quý vô cùng — định lượng bằng euro thay vì phần trăm là điểm em sẽ ghi nhận ngay. Em chú ý theo dõi việc mở văn phòng Hà Nội. Bien à vous, Linh."}],
    roleplay_prompts:["Bạn vừa nhận email từ chối từ một công ty bạn rất muốn vào. Viết email follow-up trong vòng 24 giờ — 4 dòng, chuyên nghiệp, không van xin xem lại.","Nhà tuyển dụng phản hồi với feedback cụ thể (« votre français à l'écrit est encore perfectible »). Cảm ơn và đề xuất một hành động cụ thể (khóa học, chứng chỉ, plan tự cải thiện).","Sáu tháng sau, bạn thấy công ty đó tuyển vị trí tương tự lần nữa. Viết email tái ứng tuyển — nhắc khéo lần trước, không nhắc cay đắng, đưa ra điều mới mà bạn đã cải thiện."],
    register_notes:"Email follow-up sau từ chối phải nhẹ nhàng và ngắn — dài quá nghe như van xin. Vouvoiement bắt buộc. Tránh: « je suis très déçue », « je ne comprends pas », « je pense que vous vous trompez ». Thay bằng giọng acceptance + curiosity: « j'apprécierais un retour », « je reste très intéressée ». Một sai lầm phổ biến của người Việt: dùng giọng quá khiêm tốn (« em chắc chưa đủ khả năng ») — người Pháp thấy đó là tự hạ thấp và làm họ cảm thấy gượng. Giọng đúng: bình thản, ghi nhận quyết định, mở cửa cho tương lai. Cụm chốt « Je vous souhaite plein succès dans votre choix final » là vàng — nó cho thấy bạn không cay đắng, không ghen tị với người được chọn.",
    idiom_glosses:[{idiom:"Garder la porte ouverte",literal:"Giữ cửa mở",meaning:"Để khả năng quay lại trong tương lai.",example:"Mon email a permis de garder la porte ouverte pour 2027."},{idiom:"Tirer les leçons",literal:"Rút các bài học",meaning:"Học từ thất bại để cải thiện.",example:"J'ai tiré les leçons de ce refus — je quantifie en euros maintenant."},{idiom:"Sans rancune",literal:"Không thù hằn",meaning:"Không giữ ác cảm sau khi bị từ chối.",example:"Sans rancune — je vous souhaite plein succès."},{idiom:"Rebondir",literal:"Nảy lại",meaning:"Vực dậy sau cú ngã / thất bại.",example:"Ce refus m'a appris à rebondir plus vite."}],
    exercises:[{type:"fill-blank",instruction_vi:"Điền cụm vào email follow-up.",items:[{prompt:"Je vous ___ pour votre retour, même s'il est négatif.",answer:"remercie"},{prompt:"Auriez-vous quelques minutes pour m'indiquer les points d'___ ?",answer:"amélioration"},{prompt:"Je serais ravie d'être ___ à nouveau.",answer:"considérée"},{prompt:"Je vous souhaite plein ___ dans votre choix final.",answer:"succès"}]},{type:"matching",instruction_vi:"Nối thành ngữ với nghĩa khi đối mặt với thất bại.",items:[{prompt:"Garder la porte ouverte",answer:"giữ khả năng quay lại tương lai"},{prompt:"Tirer les leçons",answer:"học từ thất bại"},{prompt:"Sans rancune",answer:"không giữ ác cảm"},{prompt:"Rebondir",answer:"vực dậy sau thất bại"}]},{type:"translation",instruction_vi:"Dịch sang tiếng Pháp lịch sự B2.",items:[{prompt:"Em vẫn rất quan tâm đến công ty cho các cơ hội tương lai.",answer:"Je reste très intéressée par votre cabinet pour d'éventuelles opportunités futures."},{prompt:"Em chúc chị nhiều thành công với lựa chọn cuối.",answer:"Je vous souhaite plein succès dans votre choix final."},{prompt:"Phản hồi này quý vô cùng, em sẽ ghi nhận ngay.",answer:"Ce retour est extrêmement précieux, je vais l'intégrer immédiatement."}]}]},
  {id:"french_b2_letter_of_recommendation",level:"B2",category:"fluency",title_vi:"Xin thư giới thiệu từ giáo sư",title_en:"Asking for a letter of recommendation",
    sentences:[{en:"Cher Professeur, je me permets de vous solliciter pour une lettre de recommandation.",vi:"Kính thưa Giáo sư, em xin phép liên hệ về việc nhờ thầy/cô viết thư giới thiệu.",pronunciation_focus:["cher → shèr","solliciter → so-li-si-té","recommandation → rơ-ko-mãn-da-sion"]},{en:"Je candidate à un master à ETH Zürich avec une deadline au 30 mai.",vi:"Em đang ứng tuyển master tại ETH Zürich với hạn nộp 30 tháng 5.",pronunciation_focus:["candidate → kãn-di-dat","master → mas-ter","deadline → dèd-lain (anglicisme accepté)"]},{en:"Je vous joins mon CV, mon relevé de notes, et un résumé d'une page de mon projet.",vi:"Em đính kèm CV, bảng điểm, và bản tóm tắt một trang về dự án.",pronunciation_focus:["joins → jwã","relevé → rơ-lơ-vé","résumé → ré-zu-mé"]},{en:"Si vous acceptez, pourrais-je avoir confirmation d'ici une semaine ?",vi:"Nếu thầy/cô đồng ý, em có thể nhận xác nhận trong vòng một tuần được không?",pronunciation_focus:["acceptez → ak-sèp-té","confirmation → kõn-fir-ma-sion","d'ici → di-si"]},{en:"Je comprends parfaitement si vos disponibilités ne permettent pas.",vi:"Em hoàn toàn hiểu nếu lịch của thầy/cô không cho phép.",pronunciation_focus:["comprends → kõm-prãn","disponibilités → dis-po-ni-bi-li-té","permettent → pèr-mèt"]}],
    cultural_notes_vi:"Xin thư giới thiệu (« lettre de recommandation ») ở Pháp là một nghi thức được giáo sư và sinh viên ứng xử rất nghiêm túc. Khác với hệ Mỹ — nơi lettre of recommendation đôi khi được giao cho trợ giảng viết — ở Pháp, nếu giáo sư đã đồng ý ký tên, ông/cô ấy sẽ tự viết. Vì vậy giáo sư rất chọn lọc — họ chỉ đồng ý cho sinh viên mà họ thực sự nhớ và đánh giá cao. Hỏi xin một giáo sư mà bạn không gặp 2 năm là hợp lý nhưng phải có lý do (trao đổi với họ kỹ trong khóa học, làm bài tốt nghiệp tốt). Cấu trúc email phải có: (1) lời chào trang trọng « Cher Professeur »; (2) ngữ cảnh ngắn để giáo sư nhớ ra bạn; (3) yêu cầu cụ thể với deadline; (4) các tài liệu đính kèm; (5) lời cho phép từ chối lịch sự. Khác văn hóa Việt Nam — nơi giáo sư đôi khi đồng ý vì nể — ở Pháp giáo sư từ chối thẳng nếu không cảm thấy đủ vốn để viết một lá thư mạnh. Đó là sự tôn trọng bạn và sự tôn trọng quy trình tuyển sinh.",
    tip_advice_vi:"Gửi yêu cầu sớm 4-6 tuần trước deadline — gửi 5 ngày trước là thiếu tôn trọng. Trong email, đính kèm 4 thứ: CV cập nhật, relevé de notes, résumé một trang về projet, và 2-3 câu nhắc nhở giáo sư về điểm nổi bật của bạn trong khóa học (« mon mémoire sur X qui a obtenu Y »). Ghi rõ deadline và format submission (jury, email trực tiếp, link platform). Nếu giáo sư đồng ý, gửi lời cảm ơn và một file đính kèm tóm tắt 1 trang để giáo sư « cá nhân hóa » thư. Sau khi gửi nộp, gửi email báo cáo thư đã được sử dụng và cảm ơn lần nữa. Nếu kết quả tích cực 2 tháng sau, gửi email báo tin — giáo sư sẽ nhớ bạn cho lần tiếp theo.",
    vocabulary:[{word:"une lettre de recommandation",en:"letter of recommendation",vi:"thư giới thiệu",pos:"n.f.",pronunciation_vi:"lè-trơ dơ rơ-ko-mãn-da-sion"},{word:"un référent",en:"a referrer",vi:"người giới thiệu",pos:"n.m.",pronunciation_vi:"ré-fé-rãn"},{word:"un relevé de notes",en:"transcript",vi:"bảng điểm",pos:"n.m.",pronunciation_vi:"rơ-lơ-vé dơ not"},{word:"une candidature spontanée",en:"unsolicited application",vi:"ứng tuyển tự phát",pos:"n.f.",pronunciation_vi:"kãn-di-da-tur spõn-ta-né"},{word:"une deadline",en:"deadline (anglicism)",vi:"hạn nộp",pos:"n.f.",pronunciation_vi:"dèd-lain"},{word:"un délai serré",en:"a tight deadline",vi:"hạn gấp",pos:"n.m.",pronunciation_vi:"dé-lè sè-ré"},{word:"personnaliser",en:"to personalize",vi:"cá nhân hóa",pos:"v.",pronunciation_vi:"pèr-so-na-li-zé"},{word:"être en mesure de",en:"to be in a position to",vi:"ở vị trí có thể",pos:"expr.",pronunciation_vi:"é-trơ ãn mơ-zur dơ"},{word:"appuyer une candidature",en:"to support an application",vi:"ủng hộ một hồ sơ",pos:"v.",pronunciation_vi:"a-pyu-ié yun kãn-di-da-tur"},{word:"un jury de sélection",en:"selection jury",vi:"hội đồng xét tuyển",pos:"n.m.",pronunciation_vi:"jyu-ri dơ sé-lèk-sion"}],
    dialogue:[{speaker:"Étudiant",text:"Cher Professeur, je me permets de vous solliciter pour une lettre.",vi:"Kính thưa thầy, em xin phép liên hệ nhờ thầy viết thư giới thiệu."},{speaker:"Pr Martin",text:"Bonjour, oui je me souviens de vous. Pour quelle candidature ?",vi:"Chào em, có nhớ em chứ. Cho hồ sơ nào?"},{speaker:"Étudiant",text:"Master à ETH Zürich, deadline le 30 mai.",vi:"Master ở ETH Zürich, hạn 30 tháng 5."},{speaker:"Pr Martin",text:"D'accord. Envoyez-moi vos pièces et un résumé d'une page.",vi:"Được. Gửi cho thầy tài liệu và bản tóm tắt một trang."}],
    dialogue_long:[{speaker:"Étudiant (email)",text:"Objet : Demande de lettre de recommandation — candidature ETH Zürich (deadline 30 mai)",vi:"Tiêu đề: Xin thư giới thiệu — ứng tuyển ETH Zürich (hạn 30/5)"},{speaker:"Étudiant",text:"Cher Professeur Martin,",vi:"Kính thưa Giáo sư Martin,"},{speaker:"Étudiant",text:"Je me permets de vous écrire au sujet d'une candidature à un master en Computer Science à l'ETH Zürich, dont la deadline est fixée au 30 mai.",vi:"Em xin phép viết thư về việc ứng tuyển master Computer Science tại ETH Zürich, hạn nộp 30/5."},{speaker:"Étudiant",text:"Vous avez encadré mon mémoire de M1 sur les modèles bayésiens appliqués à la santé publique en 2024-2025 (note finale 17/20). Vous êtes la personne dont la lettre aurait le plus de poids pour défendre ma candidature.",vi:"Thầy đã hướng dẫn luận văn M1 của em về mô hình Bayes ứng dụng vào y tế công cộng năm 2024-2025 (điểm cuối 17/20). Thầy là người mà thư giới thiệu sẽ có sức nặng nhất để bảo vệ hồ sơ em."},{speaker:"Étudiant",text:"Je joins à ce message mon CV, mon relevé de notes M1, et un résumé d'une page présentant mon projet professionnel et la cohérence avec ETH. Le jury attend la lettre par soumission directe via leur plateforme — je vous transmettrai le lien dès votre accord.",vi:"Em đính kèm CV, bảng điểm M1, và bản tóm tắt một trang về dự án nghề nghiệp và sự phù hợp với ETH. Hội đồng yêu cầu thư nộp trực tiếp qua nền tảng của họ — em sẽ chuyển link ngay khi thầy đồng ý."},{speaker:"Étudiant",text:"Si vos disponibilités ne le permettent pas, je comprends parfaitement et je solliciterai un autre référent.",vi:"Nếu thời gian của thầy không cho phép, em hoàn toàn hiểu và sẽ tìm một người giới thiệu khác."},{speaker:"Étudiant",text:"Je vous remercie par avance pour votre attention. Cordialement, Trần Quang",vi:"Em xin cảm ơn thầy trước. Cordialement, Trần Quang"},{speaker:"Pr Martin (réponse)",text:"Bonjour Trần, je me souviens parfaitement de votre mémoire — un travail solide. J'accepte volontiers d'écrire cette lettre.",vi:"(Pr Martin trả lời) Chào Trần, thầy nhớ rõ luận văn của em — một công trình vững. Thầy sẵn sàng viết thư này."},{speaker:"Pr Martin",text:"Envoyez-moi le lien de soumission, ainsi qu'une note de quelques lignes sur ce que vous considérez être votre meilleure contribution dans mon cours. Cela m'aide à personnaliser la lettre — les lettres génériques se reconnaissent à dix mètres.",vi:"Gửi cho thầy link nộp và vài dòng về điều em cho là đóng góp tốt nhất trong khóa của thầy. Điều đó giúp thầy cá nhân hóa thư — thư chung chung dễ nhận ra từ xa."},{speaker:"Pr Martin",text:"Délai : je m'engage à soumettre d'ici le 25 mai. Je vous confirme par mail dès que c'est fait.",vi:"Thời hạn: thầy cam kết nộp trước 25/5. Sẽ xác nhận qua mail khi xong."},{speaker:"Étudiant (réponse)",text:"Cher Professeur, merci infiniment pour votre accord et votre franchise. Je vous transmets le lien et la note ci-jointe.",vi:"(Em trả lời) Kính thưa thầy, em vô cùng cảm ơn thầy về sự đồng ý và thẳng thắn. Em chuyển link và bản note đính kèm."},{speaker:"Étudiant",text:"Pour la note : ma meilleure contribution était mon exposé final sur l'éthique des algorithmes prédictifs en santé, où vous m'aviez fait des retours très constructifs. Si cet angle vous semble pertinent, n'hésitez pas à le mobiliser.",vi:"Về note: đóng góp tốt nhất của em là bài thuyết trình cuối kỳ về đạo đức thuật toán dự đoán trong y tế, mà thầy đã cho em phản hồi rất xây dựng. Nếu góc đó phù hợp, xin thầy cứ dùng."},{speaker:"Pr Martin",text:"Note bien reçue, je m'en sers. Bonne continuation, Trần.",vi:"Đã nhận note, thầy sẽ dùng. Chúc em mọi điều tốt đẹp, Trần."},{speaker:"Étudiant (J+25, après dépôt)",text:"Cher Professeur, je vous écris pour vous remercier — la lettre a bien été soumise, et le jury m'a accusé réception du dossier complet le 28 mai.",vi:"(Em sau J+25, sau khi nộp) Kính thưa thầy, em viết để cảm ơn — thư đã được nộp, và hội đồng đã xác nhận nhận hồ sơ đầy đủ ngày 28/5."},{speaker:"Étudiant",text:"Je vous tiens informé du résultat début juillet. Cordialement, Trần Quang",vi:"Em sẽ báo kết quả đầu tháng 7. Cordialement, Trần Quang"}],
    roleplay_prompts:["Bạn cần thư giới thiệu từ một giáo sư bạn không gặp 18 tháng. Viết email mở đầu — nhắc cụ thể về khóa học và một bài làm cụ thể để giáo sư nhớ ra bạn, không nói chung chung.","Giáo sư đồng ý nhưng bảo cần 3 tuần để viết. Deadline của bạn còn 12 ngày. Thương lượng — đề xuất phương án (nộp version 1 cho deadline rồi update sau? đề xuất hoãn ứng tuyển 1 năm? tìm thêm người giới thiệu phụ?).","Giáo sư từ chối vì « không đủ familiar với công việc gần đây của bạn ». Trả lời lịch sự, hỏi xin gợi ý người khác, kết thúc cuộc trò chuyện không gượng — vì có thể cần xin năm sau."],
    register_notes:"Email xin lettre de recommandation luôn dùng « Cher Professeur » + họ — không « Bonjour », không « Cher Monsieur ». Nếu giáo sư là nữ « Chère Professeure ». Vouvoiement bắt buộc, kể cả khi giáo sư đã « tu » với bạn trong các bối cảnh thân mật — văn bản chính thức luôn « vous ». Tránh: « j'ai vraiment besoin », « s'il vous plaît » lặp lại, « je suis désolé de vous déranger » — nghe như van xin. Giọng đúng: trang trọng, thông tin đầy đủ, mở khả năng từ chối. Khi giáo sư đồng ý, không cảm ơn quá đậm (« merci infiniment merci merci ») — một « merci infiniment » là đủ. Sau khi nộp xong, gửi email cập nhật ngắn — đây là dấu hiệu chuyên nghiệp Pháp đặc biệt quý. Khi có kết quả, báo lại — kể cả nếu kết quả tiêu cực, vì giáo sư đã đầu tư thời gian cho bạn.",
    idiom_glosses:[{idiom:"Se reconnaître à dix mètres",literal:"Nhận ra từ 10 mét",meaning:"Quá rõ ràng, dễ thấy.",example:"Les lettres génériques se reconnaissent à dix mètres."},{idiom:"Avoir le bras long",literal:"Có cánh tay dài",meaning:"Có ảnh hưởng / quan hệ rộng.",example:"Pr Martin a le bras long dans le réseau ETH ; sa lettre pèse lourd."},{idiom:"Ne pas y aller par quatre chemins",literal:"Không đi bằng bốn con đường",meaning:"Vào thẳng vấn đề.",example:"Le professeur n'y est pas allé par quatre chemins : il m'a demandé mon CV tout de suite."},{idiom:"Mettre un pied dans la porte",literal:"Đặt chân vào cánh cửa",meaning:"Tạo bước khởi đầu cho mối quan hệ / cơ hội.",example:"Cette lettre me met un pied dans la porte d'ETH."}],
    exercises:[{type:"fill-blank",instruction_vi:"Điền cụm vào email xin thư giới thiệu.",items:[{prompt:"Je me ___ de vous solliciter pour une lettre.",answer:"permets"},{prompt:"Je ___ à un master à ETH Zürich.",answer:"candidate"},{prompt:"Si vous ___, pourrais-je avoir confirmation ?",answer:"acceptez"},{prompt:"Je comprends parfaitement si vos ___ ne permettent pas.",answer:"disponibilités"}]},{type:"matching",instruction_vi:"Nối thuật ngữ với nghĩa.",items:[{prompt:"un référent",answer:"người viết thư giới thiệu"},{prompt:"un relevé de notes",answer:"bảng điểm chính thức"},{prompt:"un délai serré",answer:"hạn rất gấp"},{prompt:"un jury de sélection",answer:"hội đồng xét tuyển"}]},{type:"translation",instruction_vi:"Dịch sang tiếng Pháp trang trọng B2.",items:[{prompt:"Em hiểu thầy bận, nên đã chuẩn bị tài liệu để giúp thầy tiết kiệm thời gian.",answer:"Je comprends que vous êtes très occupé, donc j'ai préparé à l'avance les documents nécessaires pour vous faire gagner du temps."},{prompt:"Em đính kèm CV, bảng điểm, và tóm tắt một trang.",answer:"Je joins mon CV, mon relevé de notes, et un résumé d'une page."},{prompt:"Em vô cùng cảm ơn thầy về sự đồng ý.",answer:"Je vous remercie infiniment pour votre accord."}]}]},
  {id:"french_b2_research_interests",level:"B2",category:"fluency",title_vi:"Trình bày hướng nghiên cứu xin học bổng tiến sĩ",title_en:"Presenting research interests for a doctoral scholarship",
    sentences:[{en:"Mes travaux s'inscrivent dans la continuité de mon mémoire de master.",vi:"Công trình của em nối tiếp luận văn thạc sĩ.",pronunciation_focus:["s'inscrivent → san-skriv","continuité → kõn-ti-nu-i-té","mémoire → mé-mwar"]},{en:"Ce qui m'intéresse, c'est l'intersection entre modélisation et éthique des données de santé.",vi:"Điều thu hút em là vùng giao giữa mô hình hóa và đạo đức dữ liệu y tế.",pronunciation_focus:["intéresse → an-té-rès","intersection → an-tèr-sèk-sion","modélisation → mo-dé-li-za-sion"]},{en:"Je vise une thèse en cotutelle France-Vietnam de trois ans.",vi:"Em nhắm tới luận án cotutelle Pháp-Việt 3 năm.",pronunciation_focus:["vise → viz","thèse → tèz","cotutelle → ko-tu-tèl"]},{en:"Votre laboratoire combine expertise clinique et compétences avancées en IA explicable.",vi:"Phòng lab của thầy/cô kết hợp chuyên môn lâm sàng và năng lực AI có thể giải thích.",pronunciation_focus:["combine → kom-bin","clinique → kli-nik","explicable → èk-spli-kabl"]},{en:"À terme, je vise un poste mixte recherche-clinique en hôpital universitaire vietnamien.",vi:"Về lâu dài, em nhắm vị trí kết hợp nghiên cứu-lâm sàng tại bệnh viện đại học Việt Nam.",pronunciation_focus:["terme → tèrm","mixte → mikst","recherche → rơ-shèr-shơ","universitaire → u-ni-ver-si-tèr"]}],
    cultural_notes_vi:"Người Pháp đánh giá rất cao việc ứng viên tiến sĩ thể hiện được « problématique propre » — câu hỏi nghiên cứu được suy nghĩ kỹ, không phải « em xin theo phòng lab của thầy/cô ». Khác văn hóa Việt Nam (nơi sự khiêm tốn « em mong được chỉ dạy » được coi trọng), ở Pháp giọng đó bị xem là thiếu trưởng thành học thuật. Phải nói rõ: bạn đã đọc gì, nghĩ gì, lab của họ phù hợp ở đâu, bạn muốn đóng góp gì. Cotutelle (đồng hướng dẫn Pháp-Việt) được khuyến khích bởi cả hai nước — giữ chân tài năng tại Việt Nam đồng thời duy trì kết nối với mạng lưới Pháp. Khi viết « lettre de motivation » cho tiến sĩ, đừng kể lại CV (giáo sư đã có CV). Dành 70% cho câu hỏi nghiên cứu và lý do chọn lab này. Tránh sáo rỗng « j'ai toujours été passionné par… » — ưu tiên cụ thể: tên một bài báo của họ bạn đã đọc, một phương pháp bạn muốn học, một dữ liệu Việt Nam mà bạn có quyền tiếp cận và họ không có.",
    tip_advice_vi:"Email lần đầu cho giáo sư phụ trách lab phải dưới 350 từ. Cấu trúc: (1) ngữ cảnh ngắn (em là ai, tốt nghiệp gì); (2) câu hỏi nghiên cứu của bạn trong 1-2 câu; (3) lý do chọn lab họ với 1-2 dẫn chứng cụ thể (bài báo họ đã viết, phương pháp họ phát triển); (4) đề xuất gặp 30 phút online; (5) đính kèm CV + 1 trang research statement. Đến cuộc gặp với (a) câu hỏi nghiên cứu hẹp đến mức được, (b) câu hỏi cho giáo sư về trial họ, (c) tên 3-4 bài báo nền tảng bạn đã đọc. Khi giáo sư phản biện rằng dự án « bao gồm hai luận án », chọn ngay tại chỗ — không câu giờ. Sau gặp, gửi email cảm ơn trong 24 giờ tóm tắt 3 điểm hành động.",
    vocabulary:[{word:"s'inscrire dans la continuité de",en:"to follow on from",vi:"nối tiếp",pos:"v.",pronunciation_vi:"san-skrir dãn la kõn-ti-nu-i-té dơ"},{word:"l'intersection (entre)",en:"intersection between",vi:"vùng giao thoa",pos:"n.f.",pronunciation_vi:"an-tèr-sèk-sion ãn-trơ"},{word:"une thèse en cotutelle",en:"jointly-supervised PhD",vi:"luận án đồng hướng dẫn",pos:"n.f.",pronunciation_vi:"tèz ãn ko-tu-tèl"},{word:"l'IA explicable",en:"explainable AI",vi:"AI có thể giải thích",pos:"n.f.",pronunciation_vi:"i-a èk-spli-kabl"},{word:"à terme",en:"ultimately",vi:"về lâu dài",pos:"expr.",pronunciation_vi:"a tèrm"},{word:"un poste mixte",en:"hybrid position",vi:"vị trí kết hợp",pos:"n.m.",pronunciation_vi:"post mikst"},{word:"une problématique",en:"research question",vi:"câu hỏi nghiên cứu",pos:"n.f.",pronunciation_vi:"pro-blé-ma-tik"},{word:"la faisabilité",en:"feasibility",vi:"tính khả thi",pos:"n.f.",pronunciation_vi:"fơ-za-bi-li-té"},{word:"un appel à candidatures",en:"call for applications",vi:"thông báo tuyển ứng viên",pos:"n.m.",pronunciation_vi:"a-pèl a kãn-di-da-tur"},{word:"un financement doctoral",en:"doctoral funding",vi:"kinh phí tiến sĩ",pos:"n.m.",pronunciation_vi:"fi-nãns-mã dok-to-ral"}],
    dialogue:[{speaker:"Candidat",text:"Bonjour Professeur, merci de m'accorder ce premier entretien.",vi:"Chào cô, em cảm ơn cô đã dành cho em buổi đầu này."},{speaker:"Pr Lefèvre",text:"Présentez-moi en cinq minutes votre projet et pourquoi mon labo.",vi:"Em trình bày trong 5 phút dự án và lý do chọn lab của tôi."},{speaker:"Candidat",text:"Mon projet porte sur l'IA explicable appliquée aux dossiers patients vietnamiens.",vi:"Dự án của em về AI có thể giải thích áp dụng cho hồ sơ bệnh nhân Việt Nam."},{speaker:"Pr Lefèvre",text:"Quelle est votre problématique précise ?",vi:"Câu hỏi nghiên cứu cụ thể là gì?"}],
    dialogue_long:[{speaker:"Candidat",text:"Bonjour Professeur Lefèvre, je vous remercie sincèrement pour le temps que vous m'accordez aujourd'hui.",vi:"Chào Giáo sư Lefèvre, em chân thành cảm ơn cô đã dành thời gian cho em hôm nay."},{speaker:"Pr Lefèvre",text:"Bonjour Monsieur Trần. J'ai parcouru votre dossier hier soir. Votre mémoire de M2 sur la détection précoce des arythmies par réseaux récurrents m'a intéressée.",vi:"Chào em Trần. Tôi đã xem hồ sơ tối qua. Luận văn M2 của em về phát hiện sớm rối loạn nhịp tim bằng mạng hồi quy thu hút sự quan tâm của tôi."},{speaker:"Candidat",text:"Mon mémoire montrait que les modèles atteignaient 92 pour cent de sensibilité, mais qu'ils étaient inutilisables en clinique car les médecins ne pouvaient pas justifier leurs alertes.",vi:"Luận văn của em cho thấy các mô hình đạt 92 phần trăm độ nhạy, nhưng không dùng được trên lâm sàng vì bác sĩ không biện minh được cảnh báo."},{speaker:"Candidat",text:"Je voudrais consacrer ma thèse à combler ce fossé : développer une couche d'explication contrefactuelle adaptée à des dossiers patients hétérogènes, en particulier dans des contextes à faibles ressources comme les hôpitaux provinciaux vietnamiens.",vi:"Em muốn dành luận án để lấp khoảng trống đó: phát triển một lớp giải thích phản thực tế phù hợp với hồ sơ bệnh nhân không đồng nhất, đặc biệt trong bối cảnh ít tài nguyên như bệnh viện tỉnh Việt Nam."},{speaker:"Pr Lefèvre",text:"C'est une vraie problématique. Mais soyons francs : votre projet recouvre potentiellement deux thèses. Soit on creuse la méthode XAI, soit l'adaptation contextuelle vietnamienne. Lequel vous tient le plus à cœur ?",vi:"Đây là câu hỏi nghiên cứu thực sự. Nhưng nói thẳng: dự án của em có khả năng bao gồm hai luận án. Hoặc đào sâu phương pháp XAI, hoặc thích ứng bối cảnh Việt Nam. Cái nào quan trọng với em hơn?"},{speaker:"Candidat",text:"Si je dois trancher, je pencherais pour la méthode XAI, en utilisant les données vietnamiennes comme cas d'application validant.",vi:"Nếu phải chọn, em nghiêng về phương pháp XAI, dùng dữ liệu Việt Nam như case ứng dụng kiểm chứng."},{speaker:"Pr Lefèvre",text:"Bonne lucidité — un raisonnement de doctorant, pas d'étudiant. Parlons financement : avez-vous identifié des bourses ?",vi:"Sáng suốt — lập luận của nghiên cứu sinh, không phải sinh viên. Nói về tài chính: em đã xác định học bổng nào chưa?"},{speaker:"Candidat",text:"Trois pistes en parallèle : la bourse Eiffel en cours, une cotutelle avec l'Université de Médecine de Hanoï pour un cofinancement vietnamien, et le contrat doctoral classique en dernier recours.",vi:"Ba hướng song song: học bổng Eiffel đang nộp, một cotutelle với Đại học Y Hà Nội cho đồng tài trợ Việt Nam, và hợp đồng tiến sĩ thông thường là phương án cuối."},{speaker:"Pr Lefèvre",text:"Très bien préparé. Je vais être directe : votre profil m'intéresse, le sujet aussi, et la dimension cotutelle est un atout pour notre labo qui cherche à renforcer son axe Asie du Sud-Est.",vi:"Chuẩn bị tốt. Tôi nói thẳng: hồ sơ của em khiến tôi quan tâm, đề tài cũng vậy, và cotutelle là lợi thế cho lab của chúng tôi vốn đang muốn củng cố trục Đông Nam Á."},{speaker:"Pr Lefèvre",text:"Je ne peux pas m'engager aujourd'hui — j'ai trois autres entretiens cette semaine — mais je vous donnerai une réponse argumentée d'ici dix jours. Si c'est positif, on enchaîne sur la rédaction conjointe du projet pour l'Eiffel.",vi:"Tôi không thể cam kết hôm nay — còn ba phỏng vấn khác tuần này — nhưng tôi sẽ cho em câu trả lời có lý lẽ trong 10 ngày. Nếu tích cực, ta chuyển sang giai đoạn cùng soạn dự án cho Eiffel."},{speaker:"Candidat",text:"Je vous remercie infiniment pour cette franchise et ce calendrier clair. J'attendrai votre retour sans relancer avant les dix jours.",vi:"Em chân thành cảm ơn vì sự thẳng thắn và lịch trình rõ ràng. Em sẽ chờ phản hồi mà không nhắc lại trước thời hạn 10 ngày."},{speaker:"Candidat",text:"Si entre-temps des questions techniques sur mon mémoire vous viennent, je peux vous envoyer le code et les résultats détaillés — tout est versionné sur un dépôt privé que je peux ouvrir à votre équipe.",vi:"Nếu trong thời gian đó cô có câu hỏi kỹ thuật về luận văn, em có thể gửi mã nguồn và kết quả chi tiết — mọi thứ đều quản lý phiên bản trên một kho riêng em có thể mở cho nhóm cô."},{speaker:"Pr Lefèvre",text:"C'est noté, et c'est apprécié. Bonne continuation, Monsieur Trần.",vi:"Đã ghi nhận, và rất quý. Chúc em mọi điều tốt đẹp, em Trần."}],
    roleplay_prompts:["Bạn trình bày dự án luận án trong 5 phút cho một giáo sư bạn gặp lần đầu. Cấu trúc: (1) problématique, (2) gì còn thiếu trong tài liệu, (3) vì sao lab của họ, (4) kế hoạch và tài chính.","Giáo sư nói dự án « bao gồm hai luận án » và yêu cầu bạn chọn. Quyết định ngay tại chỗ, biện minh trong hai câu, và chấp nhận hậu quả (mất một mảng) mà không tỏ ra do dự.","Giáo sư từ chối lịch sự vì lab đã đầy cho 2026 nhưng gợi ý một đồng nghiệp ở Lyon. Cảm ơn, hỏi xem giáo sư có chấp nhận gửi một dòng giới thiệu, và giữ quan hệ cho hợp tác tương lai."],
    register_notes:"Phỏng vấn pre-application tiến sĩ — vouvoiement bắt buộc đến khi giáo sư đề nghị tu, mà điều đó hiếm xảy ra ở lần gặp đầu. Ứng viên phải có khả năng (1) lập luận có nhượng bộ (« vous touchez exactement le point… »), (2) công khai lựa chọn giữa các phương án (« si je dois trancher, je pencherais pour… »), (3) nói tiền thoải mái (người Pháp nói chuyện tài chính tiến sĩ rất cởi mở). Tránh các so sánh rỗng (« je suis extrêmement passionné »). Ưu tiên các marker chính xác: « concrètement », « en pratique », « si je dois être direct ». Khi không hiểu câu hỏi, không gật đầu — hỏi lại « Pourriez-vous reformuler ? » thay vì giả vờ.",
    idiom_glosses:[{idiom:"Trancher dans le vif",literal:"Cắt vào thịt sống",meaning:"Quyết định khó, dứt khoát.",example:"Si je dois trancher dans le vif, je garde le volet méthodologique."},{idiom:"En dernier recours",literal:"Trong phương án cuối",meaning:"Như giải pháp cuối cùng.",example:"Le contrat doctoral classique reste une option en dernier recours."},{idiom:"Tenir la route",literal:"Giữ được đường",meaning:"Vững chắc, chịu được xét nét.",example:"Votre problématique tient la route, mais l'articulation avec le terrain reste à préciser."},{idiom:"Mettre les pieds dans le plat",literal:"Đặt chân vào đĩa thức ăn",meaning:"Nói thẳng vào chủ đề tế nhị.",example:"Je vais mettre les pieds dans le plat : votre projet recouvre deux thèses."}],
    exercises:[{type:"fill-blank",instruction_vi:"Điền cụm vào câu trình bày tiến sĩ.",items:[{prompt:"Mes travaux ___ dans la continuité de mon mémoire.",answer:"s'inscrivent"},{prompt:"Je ___ une thèse en cotutelle de trois ans.",answer:"vise"},{prompt:"À ___, je vise un poste mixte recherche-clinique.",answer:"terme"},{prompt:"Si je dois ___, je pencherais pour la méthode XAI.",answer:"trancher"}]},{type:"matching",instruction_vi:"Nối thuật ngữ với định nghĩa.",items:[{prompt:"une cotutelle",answer:"đồng hướng dẫn tiến sĩ giữa hai nước"},{prompt:"une problématique",answer:"câu hỏi nghiên cứu trung tâm"},{prompt:"un appel à candidatures",answer:"thông báo tuyển ứng viên mở"},{prompt:"un financement doctoral",answer:"gói tài chính hỗ trợ tiến sĩ"}]},{type:"translation",instruction_vi:"Dịch sang tiếng Pháp B2 học thuật.",items:[{prompt:"Em chưa thể cam kết hôm nay, nhưng em sẽ trả lời thầy có lý lẽ trong vòng mười ngày.",answer:"Je ne peux pas m'engager aujourd'hui, mais je vous donnerai une réponse argumentée d'ici dix jours."},{prompt:"Nếu phải chọn, em nghiêng về phương pháp XAI.",answer:"Si je dois trancher, je pencherais pour la méthode XAI."},{prompt:"Em vô cùng cảm ơn về sự thẳng thắn và lịch trình rõ.",answer:"Je vous remercie infiniment pour cette franchise et ce calendrier clair."}]}]},
];

export const FRENCH_LESSONS: ReadonlyArray<FrenchLesson> = [
  ...GREETINGS,
  ...NUMBERS,
  ...COMMON_PHRASES,
  ...BASIC_GRAMMAR,
  ...FOOD_LEGACY,
  ...FAMILY,
  ...DAILY_ROUTINE,
  ...WEATHER,
  ...TIME,
  ...COLORS,
  ...CLOTHES,
  ...TRANSPORTATION,
  ...HOUSE,
  ...HOBBIES,
  ...HEALTH,
  ...WORK,
  ...TRAVEL,
  ...EMOTIONS,
  ...PAST_TENSE,
  ...FUTURE_PLANS,
  ...WORKPLACE,
  ...LIFE_ADMIN,
  ...SOCIETY,
  ...EXPRESSIONS,
  ...ADVANCED_GRAMMAR,
  ...FLUENCY,
];

export function getLessonsByCategory(
  category: FrenchCategoryId,
): FrenchLesson[] {
  return FRENCH_LESSONS.filter((l) => l.category === category);
}

export function getLessonById(id: string): FrenchLesson | undefined {
  return FRENCH_LESSONS.find((l) => l.id === id);
}

export const lessons = FRENCH_LESSONS;
export default FRENCH_LESSONS;

