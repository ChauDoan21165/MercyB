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
  | "future_plans";

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
  vi: string;
};

export type ExerciseItem = {
  prompt: string;
  answer: string;
  options?: string[];
};

export type Exercise = {
  type: "fill_blank" | "matching" | "translation";
  instruction_vi: string;
  pronunciation_focus: string[];
  items: ExerciseItem[];
};

export type FrenchLesson = {
  id: string;
  category: FrenchCategoryId;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  tip_advice_vi: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
};

// ── 1. Greetings ────────────────────────────────────────────────────────

const GREETINGS: FrenchLesson[] = [
  {
    id: "french_greetings_intro",
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
];

export function getLessonsByCategory(
  category: FrenchCategoryId,
): FrenchLesson[] {
  return FRENCH_LESSONS.filter((l) => l.category === category);
}

export function getLessonById(id: string): FrenchLesson | undefined {
  return FRENCH_LESSONS.find((l) => l.id === id);
}

export default FRENCH_LESSONS;
