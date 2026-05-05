// src/languages/german/lessons.ts
//
// 20 German lessons for Vietnamese learners (5 intro + 15 topic-based).
// Each lesson: vocabulary, example sentences, dialogue, exercises, and
// pronunciation focus written for Vietnamese speakers.
//
// Shape mirrors the profession-pack content.ts pattern so the page UI
// stays consistent across verticals.
//
// Hand-crafted; no AI-generated filler.

export type GermanCategoryId =
  | "greetings"
  | "numbers"
  | "common_phrases"
  | "cases_intro"
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

export type GermanCategoryMeta = {
  id: GermanCategoryId;
  title_vi: string;
  title_en: string;
  expected_count: number;
};

export const GERMAN_CATEGORIES: ReadonlyArray<GermanCategoryMeta> = [
  { id: "greetings", title_vi: "Chào hỏi và giới thiệu", title_en: "Greetings and introductions", expected_count: 1 },
  { id: "numbers", title_vi: "Số đếm", title_en: "Numbers", expected_count: 1 },
  { id: "common_phrases", title_vi: "Câu giao tiếp thông dụng", title_en: "Common phrases", expected_count: 1 },
  { id: "cases_intro", title_vi: "Giới thiệu về cách (cách 1 và cách 4)", title_en: "Cases introduction (nominative and accusative)", expected_count: 1 },
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
  { id: "fluency", title_vi: "Nói trôi chảy", title_en: "Fluency", expected_count: 5 },
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

export type GermanCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type GermanLesson = {
  id: string;
  category: GermanCategoryId;
  level: GermanCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  tip_advice_vi: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
  // B2 calibration fields — optional passthrough; consumed by normalizer + renderer
  dialogue_long?: DialogueLine[];
  roleplay_prompts?: string[];
  register_notes?: string;
  idiom_glosses?: { idiom: string; literal: string; meaning: string; example: string }[];
};

// ── 1. Greetings ────────────────────────────────────────────────────────

const GREETINGS: GermanLesson[] = [
  {
    id: "german_greetings_intro",
    level: "A1",
    category: "greetings",
    title_vi: "Chào hỏi cơ bản",
    title_en: "Basic greetings",
    sentences: [
      { en: "Guten Morgen! Ich heiße Anna.", vi: "Chào buổi sáng! Tôi tên là Anna.", pronunciation_focus: ["g → g cứng", "ei → ai", "ß → ss", "ch-Laut nhẹ"] },
      { en: "Freut mich, Sie kennenzulernen.", vi: "Rất vui được gặp bạn (lịch sự).", pronunciation_focus: ["eu → oi", "ch-Laut nhẹ", "ie → i dài", "zu → tsu"] },
      { en: "Wie geht es Ihnen heute?", vi: "Hôm nay bạn khỏe không (lịch sự)?", pronunciation_focus: ["ie → i dài", "eh → ê", "Ih viết hoa = lịch sự"] },
      { en: "Mir geht es gut, danke. Und Ihnen?", vi: "Tôi khỏe, cảm ơn. Còn bạn?", pronunciation_focus: ["g → g cứng", "u → u dài", "danke → đang-kờ"] },
      { en: "Auf Wiedersehen! Schönen Tag noch!", vi: "Tạm biệt! Chúc một ngày tốt lành!", pronunciation_focus: ["au → ao", "ie → i dài", "ö → ơ tròn môi", "ch → ch nhẹ"] },
    ],
    cultural_notes_vi: "Người Đức phân biệt rất rõ giữa 'du' (thân mật) và 'Sie' (lịch sự). Dùng 'Sie' với người lạ, người lớn tuổi, đồng nghiệp cho đến khi được mời chuyển sang 'du'. 'Guten Tag' dùng cả ngày; 'Guten Morgen' trước 10h sáng; 'Guten Abend' sau 6h tối.",
    tip_advice_vi: "Người Đức đánh giá cao sự chính xác. Khi tự giới thiệu, nói rõ họ và tên. 'Ich heiße...' chuẩn hơn 'Mein Name ist...'. Học phân biệt 'ch' trong 'ich' (nhẹ) và 'ch' trong 'noch' (nặng hơn).",
  },
];

// ── 2. Numbers ──────────────────────────────────────────────────────────

const NUMBERS: GermanLesson[] = [
  {
    id: "german_numbers_1_20",
    level: "A1",
    category: "numbers",
    title_vi: "Số đếm 1 đến 20",
    title_en: "Numbers 1 to 20",
    sentences: [
      { en: "Eins, zwei, drei — drei Bier, bitte.", vi: "Một, hai, ba — ba ly bia, làm ơn.", pronunciation_focus: ["ei → ai", "z → ts", "dr → đ-r", "ie → i dài"] },
      { en: "Vier, fünf, sechs Brezeln.", vi: "Bốn, năm, sáu cái bánh pretzel.", pronunciation_focus: ["v → f", "ü → uy", "s → z", "chs → x"] },
      { en: "Sieben, acht, neun Euro.", vi: "Bảy, tám, chín euro.", pronunciation_focus: ["s → z", "ie → i dài", "cht → cht", "eu → oi"] },
      { en: "Zehn, elf, zwölf Personen.", vi: "Mười, mười một, mười hai người.", pronunciation_focus: ["z → ts", "ö → ơ tròn môi", "w → v", "final-f"] },
      { en: "Dreizehn, vierzehn, fünfzehn — alles zusammen?", vi: "Mười ba, mười bốn, mười lăm — gộp chung hết ạ?", pronunciation_focus: ["zehn → tsên", "v → f", "ü → uy", "zusammen → tsu-zam-men"] },
    ],
    cultural_notes_vi: "Số Đức nói đơn vị trước chục: 21 = einundzwanzig (một-và-hai-mươi). Đây là điểm khó nhất cho người mới học. Số điện thoại đọc từng chữ số một. Khi trả tiền mặt, người Đức thích đếm chính xác đến từng cent.",
    tip_advice_vi: "Học phản xạ với số 1-20 và các mốc chục (20 zwanzig, 30 dreißig, 40 vierzig...). Âm 'z' luôn là 'ts' — sai âm này là lộ ngay.",
  },
];

// ── 3. Common Phrases ───────────────────────────────────────────────────

const COMMON_PHRASES: GermanLesson[] = [
  {
    id: "german_common_travel",
    level: "A1",
    category: "common_phrases",
    title_vi: "Câu du lịch thiết yếu",
    title_en: "Essential travel phrases",
    sentences: [
      { en: "Wo ist die Toilette, bitte?", vi: "Nhà vệ sinh ở đâu ạ?", pronunciation_focus: ["w → v", "ie → i dài", "Toilette → toa-lét-tờ"] },
      { en: "Wie viel kostet das?", vi: "Cái này giá bao nhiêu?", pronunciation_focus: ["v → f", "ie → i dài", "st → sht"] },
      { en: "Ich möchte ein Ticket nach Berlin.", vi: "Tôi muốn một vé đi Berlin.", pronunciation_focus: ["ch-Laut nhẹ", "ö → ơ tròn môi", "ck → k"] },
      { en: "Sprechen Sie Englisch?", vi: "Bạn nói tiếng Anh không?", pronunciation_focus: ["sch → s nặng", "sp → shp", "ie → i dài"] },
      { en: "Ich verstehe nicht. Können Sie das wiederholen?", vi: "Tôi không hiểu. Bạn nói lại được không?", pronunciation_focus: ["v → f", "st → sht", "ö → ơ tròn môi", "ie → i dài"] },
    ],
    cultural_notes_vi: "Người Đức nói tiếng Anh rất tốt ở thành phố lớn. Nhưng 'Sprechen Sie Englisch?' trước khi chuyển sang tiếng Anh là phép lịch sự cơ bản. Ở nông thôn, tiếng Anh ít phổ biến hơn.",
    tip_advice_vi: "Học thuộc: 'Guten Tag', 'bitte', 'danke', 'wo ist die Toilette', 'die Rechnung bitte'. Người Đức thích sự trực tiếp — đừng vòng vo.",
  },
];

// ── 4. Cases Intro ──────────────────────────────────────────────────────

const CASES_INTRO: GermanLesson[] = [
  {
    id: "german_cases_nom_acc",
    level: "A1",
    category: "cases_intro",
    title_vi: "Cách 1 (chủ ngữ) và cách 4 (tân ngữ trực tiếp)",
    title_en: "Nominative and accusative case",
    sentences: [
      { en: "Der Hund ist braun. (Nominative — chủ ngữ)", vi: "Con chó màu nâu. (Cách 1: 'der' = chủ ngữ giống đực)", pronunciation_focus: ["der → đe-a", "u → u ngắn", "au → ao"] },
      { en: "Ich sehe den Hund. (Accusative — tân ngữ)", vi: "Tôi nhìn thấy con chó. (Cách 4: 'den' = tân ngữ giống đực)", pronunciation_focus: ["den → đên", "ich ch-Laut", "eh → ê"] },
      { en: "Die Katze ist klein. → Ich sehe die Katze.", vi: "Con mèo nhỏ. → Tôi thấy con mèo. (Giống cái không đổi)", pronunciation_focus: ["die → đi", "a → a ngắn", "z → ts", "ei → ai"] },
      { en: "Das Kind spielt. → Ich sehe das Kind.", vi: "Đứa trẻ chơi. → Tôi thấy đứa trẻ. (Giống trung không đổi)", pronunciation_focus: ["das → đát", "i → i ngắn", "sp → shp", "ie → i dài"] },
      { en: "Der Mann gibt dem Hund den Ball.", vi: "Người đàn ông đưa quả bóng cho con chó.", pronunciation_focus: ["a → a ngắn", "gibt → ghipt", "dem → đêm", "Ball → ban"] },
    ],
    cultural_notes_vi: "Tiếng Đức có 4 cách. Chỉ có giống đực (der → den) thay đổi giữa cách 1 và cách 4; giống cái (die) và giống trung (das) giữ nguyên. Học 2 cách đầu tiên làm nền tảng cho 2 cách còn lại (Dativ và Genitiv).",
    tip_advice_vi: "Đừng cố học cả 4 cách một lúc. Học cách 1 và cách 4 trước, dùng ít nhất 2 tuần. Mẹo: 'der' = chủ ngữ, 'den' = tân ngữ.",
  },
];

// ── 5. Food ─────────────────────────────────────────────────────────────

const FOOD_LEGACY: GermanLesson[] = [
  {
    id: "german_food_ordering",
    level: "A1",
    category: "food",
    title_vi: "Gọi món ăn",
    title_en: "Ordering food",
    sentences: [
      { en: "Ich möchte eine Bratwurst mit Sauerkraut, bitte.", vi: "Cho tôi một cái xúc xích nướng với dưa cải ạ.", pronunciation_focus: ["ö → ơ tròn môi", "au → ao", "w → v"] },
      { en: "Und ein großes Bier, bitte.", vi: "Và một ly bia lớn ạ.", pronunciation_focus: ["ß → ss", "ie → i dài", "groß → grôs"] },
      { en: "Was können Sie empfehlen?", vi: "Bạn gợi ý món gì?", pronunciation_focus: ["w → v", "ö → ơ tròn môi", "ie → i dài"] },
      { en: "Die Rechnung, bitte. Zusammen oder getrennt?", vi: "Cho xin hóa đơn. Gộp chung hay tách riêng?", pronunciation_focus: ["ch → ch nhẹ", "z → ts"] },
      { en: "Das war sehr lecker! Danke schön.", vi: "Ngon quá! Cảm ơn nhiều.", pronunciation_focus: ["w → v", "a → a dài", "ö → ơ tròn môi"] },
    ],
    cultural_notes_vi: "Ở Đức, tiền tip (Trinkgeld) thường 5-10%. Đưa tip trực tiếp: nói 'Stimmt so' (giữ lại tiền thừa). Bia Đức uống kèm đồ ăn là văn hóa. Nước máy (Leitungswasser) sạch và miễn phí nhưng ít nhà hàng tự động mang ra.",
    tip_advice_vi: "Gọi món: 'Ich möchte...' + tên món + 'bitte'. 'Lecker' (ngon) và 'sehr gut' (rất tốt) làm người Đức hài lòng. Học 'zusammen' (gộp chung) và 'getrennt' (tách riêng).",
  },
];

// ── 6. Family ───────────────────────────────────────────────────────────

const FAMILY: GermanLesson[] = [
  {
    id: "german_family_intro",
    level: "A1",
    category: "family",
    title_vi: "Giới thiệu gia đình",
    title_en: "Introducing family",
    sentences: [
      { en: "Das ist meine Mutter, mein Vater und meine Schwester.", vi: "Đây là mẹ, bố và em gái tôi.", pronunciation_focus: ["das → đát", "Mutter → mút-tờ", "Vater → pha-tờ", "Schwester → svét-xtờ"] },
      { en: "Ich habe zwei Brüder und eine Schwester.", vi: "Tôi có hai anh em trai và một chị em gái.", pronunciation_focus: ["habe → ha-bờ", "Brüder → bruy-đờ", "ü → uy"] },
      { en: "Meine Großeltern wohnen auf dem Land.", vi: "Ông bà tôi sống ở nông thôn.", pronunciation_focus: ["Großeltern → grôs-en-tờn", "wohnen → vô-nần", "Land → lănt"] },
      { en: "Mein Onkel ist Arzt, meine Tante ist Lehrerin.", vi: "Chú tôi là bác sĩ, cô tôi là giáo viên.", pronunciation_focus: ["Onkel → óng-ken", "Arzt → ác-t", "Tante → tăn-tờ", "Lehrerin → lê-rờ-rin"] },
      { en: "Wir sind eine große Familie mit sechs Personen.", vi: "Chúng tôi là gia đình lớn sáu người.", pronunciation_focus: ["große → grô-xờ", "Familie → pha-mi-li-ờ", "sechs → déc-x"] },
    ],
    cultural_notes_vi: "Gia đình Đức thường nhỏ (1-2 con). Ông bà thường sống riêng. Ngày Chủ Nhật là ngày gia đình — nhiều cửa hàng đóng cửa hoàn toàn. Người Đức gọi bố mẹ bằng 'Mama' và 'Papa' trong gia đình, 'Mutter' và 'Vater' khi nói với người ngoài.",
    tip_advice_vi: "Khi giới thiệu gia đình bằng tiếng Đức, dùng 'das ist...' (đây là). Nhớ 'mein' cho giống đực/trung và 'meine' cho giống cái/số nhiều.",
    vocabulary: [
      { word: "die Mutter", en: "mother", vi: "mẹ", pos: "noun (f)", pronunciation_vi: "đi MÚT-tờ — 'u' ngắn" },
      { word: "der Vater", en: "father", vi: "bố", pos: "noun (m)", pronunciation_vi: "đe-a PHA-tờ — 'a' dài" },
      { word: "der Bruder", en: "brother", vi: "anh/em trai", pos: "noun (m)", pronunciation_vi: "đe-a BRU-đờ — 'u' dài" },
      { word: "die Schwester", en: "sister", vi: "chị/em gái", pos: "noun (f)", pronunciation_vi: "đi SVÉT-xtờ — 'sch' đọc 's' nặng" },
      { word: "der Sohn", en: "son", vi: "con trai", pos: "noun (m)", pronunciation_vi: "đe-a DÔN — 'o' dài" },
      { word: "die Tochter", en: "daughter", vi: "con gái", pos: "noun (f)", pronunciation_vi: "đi TÓCH-tờ — 'ch' nhẹ" },
      { word: "der Ehemann", en: "husband", vi: "chồng", pos: "noun (m)", pronunciation_vi: "đe-a Ê-mằn — 'eh' đọc 'ê' dài" },
      { word: "die Ehefrau", en: "wife", vi: "vợ", pos: "noun (f)", pronunciation_vi: "đi Ê-phrao — 'au' đọc 'ao'" },
      { word: "die Großeltern", en: "grandparents", vi: "ông bà", pos: "noun (pl)", pronunciation_vi: "đi GRÔS-en-tờn — 'ß' đọc 's'" },
      { word: "das Kind", en: "child", vi: "đứa trẻ", pos: "noun (n)", pronunciation_vi: "đát KINT — 'i' ngắn" },
    ],
    dialogue: [
      { speaker: "A", text: "Hast du Geschwister?", vi: "Bạn có anh chị em không?" },
      { speaker: "B", text: "Ja, eine große Schwester und einen kleinen Bruder.", vi: "Có, một chị gái và một em trai." },
      { speaker: "A", text: "Wo wohnen sie?", vi: "Họ sống ở đâu?" },
      { speaker: "B", text: "Meine Schwester wohnt in Berlin, mein Bruder noch bei meinen Eltern.", vi: "Chị tôi ở Berlin, em trai tôi vẫn ở với bố mẹ." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ chỉ gia đình:",
        pronunciation_focus: ["Familie"],
        items: [
          { prompt: "Meine ___ heißt Maria. (mẹ)", answer: "Mutter" },
          { prompt: "Mein ___ arbeitet in München. (bố)", answer: "Vater" },
          { prompt: "Ich habe einen ___. (anh/em trai)", answer: "Bruder" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ tiếng Đức với nghĩa tiếng Việt:",
        pronunciation_focus: ["Verwandte"],
        items: [
          { prompt: "der Ehemann", answer: "chồng" },
          { prompt: "die Ehefrau", answer: "vợ" },
          { prompt: "das Kind", answer: "đứa trẻ" },
          { prompt: "die Großeltern", answer: "ông bà" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: ["Possessivpronomen"],
        items: [
          { prompt: "Mẹ tôi là giáo viên.", answer: "Meine Mutter ist Lehrerin." },
          { prompt: "Tôi có hai anh trai.", answer: "Ich habe zwei Brüder." },
          { prompt: "Ông bà tôi sống ở Hà Nội.", answer: "Meine Großeltern wohnen in Hanoi." },
        ],
      },
    ],
  },
];

// ── 7. Daily Routine ────────────────────────────────────────────────────

const DAILY_ROUTINE: GermanLesson[] = [
  {
    id: "german_daily_routine",
    level: "A1",
    category: "daily_routine",
    title_vi: "Sinh hoạt hàng ngày",
    title_en: "Daily routine",
    sentences: [
      { en: "Ich stehe um sechs Uhr auf.", vi: "Tôi thức dậy lúc sáu giờ.", pronunciation_focus: ["stehe → s-tê-ờ", "sechs → déc-x", "Uhr → ua", "auf → aop"] },
      { en: "Ich frühstücke um sieben Uhr.", vi: "Tôi ăn sáng lúc bảy giờ.", pronunciation_focus: ["frühstücke → fruy-s-tuy-kờ", "ü → uy", "sieben → dí-bần"] },
      { en: "Ich putze mir die Zähne nach dem Essen.", vi: "Tôi đánh răng sau bữa ăn.", pronunciation_focus: ["putze → pút-xờ", "Zähne → xê-nờ", "ä → e mở"] },
      { en: "Ich gehe um acht Uhr zur Arbeit.", vi: "Tôi đi làm lúc tám giờ.", pronunciation_focus: ["gehe → ghê-ờ", "acht → ácht", "Arbeit → á-bait"] },
      { en: "Ich gehe um elf Uhr ins Bett.", vi: "Tôi đi ngủ lúc mười một giờ.", pronunciation_focus: ["elf → é-l-ph", "Bett → bét", "ins → ín-x"] },
    ],
    cultural_notes_vi: "Người Đức dậy sớm — ngày làm việc thường bắt đầu lúc 8h và kết thúc lúc 16-17h. Bữa sáng (Frühstück) quan trọng: bánh mì (Brötchen), phô mai, thịt nguội, cà phê. Bữa trưa (Mittagessen) là bữa chính nóng. Bữa tối (Abendbrot) thường là bánh mì nguội.",
    tip_advice_vi: "Học các động từ tách (trennbare Verben): aufstehen (auf + stehen), anziehen (an + ziehen), ausziehen (aus + ziehen). Tiền tố tách ra và đặt cuối câu: 'Ich stehe um 7 Uhr AUF.'",
    vocabulary: [
      { word: "aufstehen", en: "to get up", vi: "thức dậy", pos: "verb", pronunciation_vi: "AOP-s-tê-ần — tách: stehen... auf" },
      { word: "frühstücken", en: "to have breakfast", vi: "ăn sáng", pos: "verb", pronunciation_vi: "FRUY-s-tuy-kần — 'ü' đọc 'uy'" },
      { word: "duschen", en: "to shower", vi: "tắm vòi sen", pos: "verb", pronunciation_vi: "ĐU-sần — 'sch' đọc 's' nặng" },
      { word: "anziehen", en: "to get dressed", vi: "mặc quần áo", pos: "verb", pronunciation_vi: "AN-xi-ần — tách: ziehen... an" },
      { word: "das Frühstück", en: "breakfast", vi: "bữa sáng", pos: "noun (n)", pronunciation_vi: "đát FRUY-s-tuyk" },
      { word: "das Mittagessen", en: "lunch", vi: "bữa trưa", pos: "noun (n)", pronunciation_vi: "đát MÍT-tác-ét-xần" },
      { word: "das Abendessen", en: "dinner", vi: "bữa tối", pos: "noun (n)", pronunciation_vi: "đát A-bần-ét-xần" },
      { word: "ins Bett gehen", en: "to go to bed", vi: "đi ngủ", pos: "phrase", pronunciation_vi: "ín-x BÉT ghê-ần" },
      { word: "arbeiten", en: "to work", vi: "làm việc", pos: "verb", pronunciation_vi: "Á-bai-tần — 'r' đọc nhẹ" },
      { word: "sich waschen", en: "to wash oneself", vi: "rửa mặt", pos: "verb", pronunciation_vi: "dích VA-sần — 'sch' đọc 's' nặng" },
    ],
    dialogue: [
      { speaker: "A", text: "Um wie viel Uhr stehst du auf?", vi: "Bạn dậy lúc mấy giờ?" },
      { speaker: "B", text: "Ich stehe um halb sieben auf.", vi: "Tôi dậy lúc sáu rưỡi." },
      { speaker: "A", text: "Und wann frühstückst du?", vi: "Bạn ăn sáng lúc nào?" },
      { speaker: "B", text: "Um sieben. Dann fahre ich zur Arbeit.", vi: "Lúc bảy giờ. Rồi tôi đi làm." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền động từ tách (trennbare Verben):",
        pronunciation_focus: ["trennbare Verben"],
        items: [
          { prompt: "Ich ___ um 6 Uhr ___. (aufstehen)", answer: "stehe ... auf" },
          { prompt: "Er ___ sich ___. (anziehen)", answer: "zieht ... an" },
          { prompt: "Wir ___ um 7 Uhr ___. (frühstücken)", answer: "frühstücken" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối hoạt động với thời gian:",
        pronunciation_focus: ["Tagesablauf"],
        items: [
          { prompt: "aufstehen", answer: "6:00" },
          { prompt: "frühstücken", answer: "7:00" },
          { prompt: "zur Arbeit gehen", answer: "8:00" },
          { prompt: "ins Bett gehen", answer: "23:00" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: ["Tagesablauf"],
        items: [
          { prompt: "Tôi thức dậy lúc 6 giờ.", answer: "Ich stehe um sechs Uhr auf." },
          { prompt: "Cô ấy đi ngủ lúc 10 giờ tối.", answer: "Sie geht um zehn Uhr ins Bett." },
          { prompt: "Chúng tôi ăn trưa lúc 12 giờ.", answer: "Wir essen um zwölf Uhr zu Mittag." },
        ],
      },
    ],
  },
];

// ── 8. Weather ──────────────────────────────────────────────────────────

const WEATHER: GermanLesson[] = [
  {
    id: "german_weather",
    level: "A1",
    category: "weather",
    title_vi: "Thời tiết và các mùa",
    title_en: "Weather and seasons",
    sentences: [
      { en: "Wie ist das Wetter heute?", vi: "Thời tiết hôm nay thế nào?", pronunciation_focus: ["Wetter → vét-tờ", "heute → hoi-tờ", "w → v"] },
      { en: "Heute scheint die Sonne und es ist warm.", vi: "Hôm nay có nắng và trời ấm.", pronunciation_focus: ["scheint → sain-t", "Sonne → dón-nờ", "warm → vá-m"] },
      { en: "Im Herbst regnet es viel.", vi: "Mùa thu mưa nhiều.", pronunciation_focus: ["Herbst → hé-p-s-t", "regnet → ré-g-nệt", "viel → phin"] },
      { en: "Im Sommer ist es sehr heiß, manchmal 35 Grad.", vi: "Mùa hè rất nóng, có khi 35 độ.", pronunciation_focus: ["Sommer → dóm-mờ", "heiß → hais", "Grad → grá-t"] },
      { en: "Im Winter schneit es in den Bergen.", vi: "Mùa đông, có tuyết ở trên núi.", pronunciation_focus: ["Winter → vín-tờ", "schneit → s-nai-t", "Bergen → bé-gần"] },
    ],
    cultural_notes_vi: "Người Đức nói về thời tiết rất nhiều — đây là chủ đề 'small talk' an toàn nhất. Mùa đông ở Đức lạnh và tối (mặt trời lặn khoảng 16h). Nhiều nhà không có điều hòa, chỉ có máy sưởi. Mùa hè có thể nóng 35°C+ nhưng ngắn.",
    tip_advice_vi: "Học các cấu trúc: 'Es ist + tính từ' (warm, kalt, windig), 'Es + động từ' (regnet, schneit), 'Die Sonne scheint'. 'Es gibt' KHÔNG dùng cho thời tiết — đó là lỗi phổ biến của người mới học.",
    vocabulary: [
      { word: "die Sonne", en: "sun", vi: "mặt trời / nắng", pos: "noun (f)", pronunciation_vi: "đi DÓN-nờ — 'S' đọc 'd'" },
      { word: "der Regen", en: "rain", vi: "mưa", pos: "noun (m)", pronunciation_vi: "đe-a RÊ-gần — 'g' cứng" },
      { word: "der Wind", en: "wind", vi: "gió", pos: "noun (m)", pronunciation_vi: "đe-a VINT — 'W' đọc 'v'" },
      { word: "der Schnee", en: "snow", vi: "tuyết", pos: "noun (m)", pronunciation_vi: "đe-a S-NÊ — 'sch' đọc 's' nặng" },
      { word: "die Wolke", en: "cloud", vi: "mây", pos: "noun (f)", pronunciation_vi: "đi VÔN-kờ — 'W' đọc 'v'" },
      { word: "warm", en: "warm", vi: "ấm", pos: "adjective", pronunciation_vi: "VA-M — 'a' dài" },
      { word: "kalt", en: "cold", vi: "lạnh", pos: "adjective", pronunciation_vi: "KAN-T — 'al' đọc 'an'" },
      { word: "der Frühling", en: "spring", vi: "mùa xuân", pos: "noun (m)", pronunciation_vi: "đe-a FRUY-lìng — 'üh' đọc 'uy'" },
      { word: "der Sommer", en: "summer", vi: "mùa hè", pos: "noun (m)", pronunciation_vi: "đe-a DÓM-mờ — 'S' đọc 'd'" },
      { word: "der Winter", en: "winter", vi: "mùa đông", pos: "noun (m)", pronunciation_vi: "đe-a VÍN-tờ — 'W' đọc 'v'" },
    ],
    dialogue: [
      { speaker: "A", text: "Wie ist das Wetter bei dir?", vi: "Thời tiết chỗ bạn thế nào?" },
      { speaker: "B", text: "Es regnet seit heute Morgen. Und bei dir?", vi: "Mưa từ sáng. Còn chỗ bạn?" },
      { speaker: "A", text: "Hier scheint die Sonne, es ist richtig warm!", vi: "Ở đây nắng, ấm thật sự!" },
      { speaker: "B", text: "Du hast Glück! Ich habe den Regen satt.", vi: "Bạn may mắn đấy! Tôi chán mưa rồi." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về thời tiết:",
        pronunciation_focus: ["Wetter"],
        items: [
          { prompt: "Heute ___ die Sonne. (nắng - scheinen)", answer: "scheint" },
          { prompt: "Es ___ den ganzen Tag. (mưa)", answer: "regnet" },
          { prompt: "Im Winter ___ es. (tuyết rơi)", answer: "schneit" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối mùa với thời tiết:",
        pronunciation_focus: ["Jahreszeiten"],
        items: [
          { prompt: "der Frühling", answer: "mild, regnet manchmal" },
          { prompt: "der Sommer", answer: "heiß, sonnig" },
          { prompt: "der Herbst", answer: "windig, Regen" },
          { prompt: "der Winter", answer: "kalt, Schnee" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: ["wie ist das Wetter"],
        items: [
          { prompt: "Hôm nay trời lạnh.", answer: "Heute ist es kalt." },
          { prompt: "Trời đang mưa.", answer: "Es regnet." },
          { prompt: "Mùa hè có nắng.", answer: "Im Sommer scheint die Sonne." },
        ],
      },
    ],
  },
];

// ── 9. Time ─────────────────────────────────────────────────────────────

const TIME: GermanLesson[] = [
  {
    id: "german_time",
    level: "A1",
    category: "time",
    title_vi: "Nói giờ và ngày tháng",
    title_en: "Telling time and dates",
    sentences: [
      { en: "Wie spät ist es? Es ist Viertel nach drei.", vi: "Mấy giờ rồi? Ba giờ mười lăm.", pronunciation_focus: ["spät → s-pét", "ä → e mở", "Viertel → phia-tờn", "drei → đrai"] },
      { en: "Der Termin ist um halb elf.", vi: "Cuộc hẹn lúc mười giờ rưỡi.", pronunciation_focus: ["Termin → te-mìn", "halb → hăn-p", "elf → é-l-ph"] },
      { en: "Welcher Tag ist heute? Heute ist Montag.", vi: "Hôm nay là thứ mấy? Hôm nay thứ Hai.", pronunciation_focus: ["welcher → vén-chờ", "Tag → tác", "Montag → môn-tác"] },
      { en: "Mein Geburtstag ist am fünfzehnten März.", vi: "Sinh nhật tôi là ngày 15 tháng Ba.", pronunciation_focus: ["Geburtstag → ghờ-bu-a-ts-tác", "fünfzehnten → fuyn-ph-xên-tần", "März → mét-x"] },
      { en: "Der Laden öffnet um neun Uhr morgens.", vi: "Cửa hàng mở cửa lúc chín giờ sáng.", pronunciation_focus: ["Laden → la-đần", "öffnet → ợph-nệt", "neun → noin"] },
    ],
    cultural_notes_vi: "Người Đức nói giờ theo cách 'halb + giờ tiếp theo': 'halb drei' = 2:30 (nửa đường đến 3h). 'Viertel vor/nach' = kém/hơn 15 phút. Ngày viết là DD.MM.YYYY. Thứ Hai là ngày đầu tuần. Người Đức cực kỳ coi trọng đúng giờ — muộn 5 phút là đã bị coi là trễ.",
    tip_advice_vi: "Cấu trúc thời gian Đức cần chú ý: 'um' + giờ (vào lúc...), 'am' + ngày (vào ngày...), 'im' + tháng/mùa (vào tháng...). 'Halb vier' là 3:30, KHÔNG phải 4:30.",
    vocabulary: [
      { word: "die Uhr", en: "clock / hour", vi: "đồng hồ / giờ", pos: "noun (f)", pronunciation_vi: "đi UA — 'U' đọc 'u' dài" },
      { word: "die Minute", en: "minute", vi: "phút", pos: "noun (f)", pronunciation_vi: "đi mi-NU-tờ — 'u' dài" },
      { word: "die Stunde", en: "hour (duration)", vi: "tiếng đồng hồ", pos: "noun (f)", pronunciation_vi: "đi S-TÚN-đờ — 'st' đọc 's-t'" },
      { word: "Montag", en: "Monday", vi: "thứ Hai", pos: "noun (m)", pronunciation_vi: "MÔN-tác — 'a' dài" },
      { word: "Dienstag", en: "Tuesday", vi: "thứ Ba", pos: "noun (m)", pronunciation_vi: "ĐIN-x-tác — 'ie' đọc 'i' dài" },
      { word: "Mittwoch", en: "Wednesday", vi: "thứ Tư", pos: "noun (m)", pronunciation_vi: "MÍT-vôch — 'ch' nhẹ" },
      { word: "Januar", en: "January", vi: "tháng Một", pos: "noun (m)", pronunciation_vi: "YA-nu-a — 'J' đọc 'y'" },
      { word: "heute", en: "today", vi: "hôm nay", pos: "adverb", pronunciation_vi: "HOI-tờ — 'eu' đọc 'oi'" },
      { word: "morgen", en: "tomorrow", vi: "ngày mai", pos: "adverb", pronunciation_vi: "MÓ-ghần — 'g' cứng" },
      { word: "gestern", en: "yesterday", vi: "hôm qua", pos: "adverb", pronunciation_vi: "GHÉT-xtờn — 'g' cứng" },
    ],
    dialogue: [
      { speaker: "A", text: "Wie spät ist es?", vi: "Mấy giờ rồi?" },
      { speaker: "B", text: "Es ist fünf vor zwölf.", vi: "Mười hai giờ kém năm." },
      { speaker: "A", text: "Schon so spät?! Ich habe einen Termin um Viertel nach zwölf.", vi: "Muộn thế rồi á?! Tôi có hẹn lúc 12h15." },
      { speaker: "B", text: "Dann beeil dich!", vi: "Vậy thì nhanh lên đi!" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền giờ đúng:",
        pronunciation_focus: ["Uhrzeit"],
        items: [
          { prompt: "Es ist ___ Uhr. (8h)", answer: "acht" },
          { prompt: "Es ist Viertel ___ drei. (3h15)", answer: "nach" },
          { prompt: "Es ist ___ zehn. (9h30)", answer: "halb" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối ngày tiếng Đức với tiếng Việt:",
        pronunciation_focus: ["Wochentage"],
        items: [
          { prompt: "Montag", answer: "thứ Hai" },
          { prompt: "Freitag", answer: "thứ Sáu" },
          { prompt: "Sonntag", answer: "Chủ Nhật" },
          { prompt: "Samstag", answer: "thứ Bảy" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: ["wie spät"],
        items: [
          { prompt: "Hôm nay là thứ mấy?", answer: "Welcher Tag ist heute?" },
          { prompt: "Sinh nhật tôi là ngày 5 tháng 7.", answer: "Mein Geburtstag ist am fünften Juli." },
          { prompt: "Bây giờ là 9 giờ sáng.", answer: "Es ist neun Uhr morgens." },
        ],
      },
    ],
  },
];

// ── 10. Colors ───────────────────────────────────────────────────────────

const COLORS: GermanLesson[] = [
  {
    id: "german_colors",
    level: "A1",
    category: "colors",
    title_vi: "Màu sắc cơ bản",
    title_en: "Basic colors",
    sentences: [
      { en: "Welche Farbe hat dein Auto?", vi: "Xe của bạn màu gì?", pronunciation_focus: ["welche → vén-chờ", "Farbe → phá-bờ", "Auto → ao-tô"] },
      { en: "Mein Auto ist rot. Und deins?", vi: "Xe tôi màu đỏ. Của bạn thì sao?", pronunciation_focus: ["rot → rôt", "deins → đain-x"] },
      { en: "Ich liebe Hellblau, besonders im Sommer.", vi: "Tôi rất thích xanh nhạt, nhất là mùa hè.", pronunciation_focus: ["liebe → li-bờ", "Hellblau → hén-blao", "besonders → bờ-dón-đờx"] },
      { en: "Magst du Grün oder Gelb lieber?", vi: "Bạn thích xanh lá hay vàng hơn?", pronunciation_focus: ["Grün → gruyn", "ü → uy", "Gelb → ghén-p"] },
      { en: "Schwarz und Weiß sind klassisch.", vi: "Đen và trắng lúc nào cũng hợp.", pronunciation_focus: ["Schwarz → svác-x", "Weiß → vais", "klassisch → clá-xít-s"] },
    ],
    cultural_notes_vi: "Tính từ màu sắc tiếng Đức đứng TRƯỚC danh từ khi ở vị trí tính ngữ và phải chia đuôi theo cách: 'ein rotES Auto' (cách 1) nhưng 'Ich sehe ein rotES Auto' (cách 4). Khi đứng sau động từ 'sein', tính từ không chia: 'Das Auto ist rot.'",
    tip_advice_vi: "Học 6 màu cơ bản trước (rot, blau, grün, gelb, schwarz, weiß). Sau đó học các biến thể: hell- (nhạt), dunkel- (đậm). 'Bunt' = nhiều màu sắc. 'Die Ampel' (đèn giao thông) có 3 màu: rot, gelb, grün.",
    vocabulary: [
      { word: "rot", en: "red", vi: "đỏ", pos: "adjective", pronunciation_vi: "RÔT — 'o' dài" },
      { word: "blau", en: "blue", vi: "xanh dương", pos: "adjective", pronunciation_vi: "BLAO — 'au' đọc 'ao'" },
      { word: "grün", en: "green", vi: "xanh lá", pos: "adjective", pronunciation_vi: "GRUYN — 'ü' đọc 'uy'" },
      { word: "gelb", en: "yellow", vi: "vàng", pos: "adjective", pronunciation_vi: "GHÉN-P — 'g' cứng, 'b' đọc 'p'" },
      { word: "schwarz", en: "black", vi: "đen", pos: "adjective", pronunciation_vi: "SVÁC-X — 'sch' đọc 's' nặng, 'w' đọc 'v'" },
      { word: "weiß", en: "white", vi: "trắng", pos: "adjective", pronunciation_vi: "VAIS — 'W' đọc 'v', 'ß' đọc 'ss'" },
      { word: "rosa", en: "pink", vi: "hồng", pos: "adjective", pronunciation_vi: "RÔ-da — 'o' dài, không chia đuôi" },
      { word: "grau", en: "grey", vi: "xám", pos: "adjective", pronunciation_vi: "GRAO — 'au' đọc 'ao'" },
      { word: "braun", en: "brown", vi: "nâu", pos: "adjective", pronunciation_vi: "B-RAO-N — 'au' đọc 'ao'" },
      { word: "lila", en: "purple", vi: "tím", pos: "adjective", pronunciation_vi: "LI-la — không chia đuôi" },
    ],
    dialogue: [
      { speaker: "A", text: "Gefällt dir mein neues Kleid?", vi: "Bạn thích váy mới của tôi không?" },
      { speaker: "B", text: "Ja, es ist sehr schön! Welche Farbe ist das, Dunkelblau?", vi: "Có, đẹp lắm! Màu gì thế, xanh đậm à?" },
      { speaker: "A", text: "Nein, es ist Lila.", vi: "Không, là màu tím." },
      { speaker: "B", text: "Das steht dir wirklich gut.", vi: "Hợp với bạn thật đấy." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền màu sắc đúng:",
        pronunciation_focus: ["Farben"],
        items: [
          { prompt: "Der Himmel ist ___. (xanh)", answer: "blau" },
          { prompt: "Die Tomate ist ___. (đỏ)", answer: "rot" },
          { prompt: "Der Schnee ist ___. (trắng)", answer: "weiß" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối màu tiếng Đức với nghĩa:",
        pronunciation_focus: ["Farben"],
        items: [
          { prompt: "gelb", answer: "vàng" },
          { prompt: "schwarz", answer: "đen" },
          { prompt: "rosa", answer: "hồng" },
          { prompt: "grau", answer: "xám" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: ["welche Farbe"],
        items: [
          { prompt: "Cái áo này màu gì?", answer: "Welche Farbe hat dieses Hemd?" },
          { prompt: "Tôi thích màu xanh lá.", answer: "Ich mag Grün." },
          { prompt: "Con mèo đen đang ngủ.", answer: "Die schwarze Katze schläft." },
        ],
      },
    ],
  },
];

// ── 11. Clothes ──────────────────────────────────────────────────────────

const CLOTHES: GermanLesson[] = [
  {
    id: "german_clothes",
    level: "A1",
    category: "clothes",
    title_vi: "Quần áo và mua sắm",
    title_en: "Clothes and shopping",
    sentences: [
      { en: "Ich suche ein weißes Hemd, Größe M.", vi: "Tôi đang tìm áo sơ mi trắng, cỡ M.", pronunciation_focus: ["suche → du-chờ", "weißes → vai-xớt", "Hemd → hém-t", "Größe → grơ-xờ"] },
      { en: "Wo sind die Umkleidekabinen?", vi: "Phòng thử đồ ở đâu ạ?", pronunciation_focus: ["Umkleidekabinen → úm-clai-đờ-ca-bi-nần", "w → v"] },
      { en: "Diese Hose ist zu eng. Haben Sie eine größere Größe?", vi: "Quần này chật quá. Có cỡ to hơn không ạ?", pronunciation_focus: ["Hose → hô-dờ", "eng → éng", "größere → grơ-xờ-rờ"] },
      { en: "Wie viel kostet dieses Kleid?", vi: "Cái váy này giá bao nhiêu?", pronunciation_focus: ["kostet → cót-tệt", "Kleid → clai-t"] },
      { en: "Ich nehme den grauen Pullover und den Schal.", vi: "Tôi lấy áo len xám và cái khăn.", pronunciation_focus: ["nehme → nê-mờ", "grauen → grao-ần", "Pullover → pu-lô-vờ"] },
    ],
    cultural_notes_vi: "Ở Đức, nhân viên bán hàng thường để bạn tự do xem nhưng sẵn sàng giúp khi bạn hỏi. Cỡ quần áo Đức dùng số châu Âu (34-48 cho nữ, 44-58 cho nam). Các đợt giảm giá lớn: Winterschlussverkauf (tháng 1) và Sommerschlussverkauf (tháng 7). Nhiều cửa hàng đóng cửa Chủ Nhật.",
    tip_advice_vi: "Câu quan trọng: 'Ich suche...' (tôi đang tìm...), 'Kann ich das anprobieren?' (tôi thử được không?), 'Das ist zu eng/weit' (chật/rộng quá), 'Ich nehme es' (tôi lấy). Nhớ chia đuôi tính từ: 'ein weißES Hemd' nhưng 'das weißE Hemd'.",
    vocabulary: [
      { word: "das Hemd", en: "shirt", vi: "áo sơ mi", pos: "noun (n)", pronunciation_vi: "đát HÉM-T — 'e' đọc 'ê'" },
      { word: "die Hose", en: "pants", vi: "quần dài", pos: "noun (f)", pronunciation_vi: "đi HÔ-dờ — 'o' dài" },
      { word: "das Kleid", en: "dress", vi: "váy đầm", pos: "noun (n)", pronunciation_vi: "đát CLAI-T — 'ei' đọc 'ai'" },
      { word: "der Mantel", en: "coat", vi: "áo khoác", pos: "noun (m)", pronunciation_vi: "đe-a MĂN-tờn — 'a' ngắn" },
      { word: "die Schuhe", en: "shoes", vi: "giày", pos: "noun (pl)", pronunciation_vi: "đi SU-ờ — 'sch' đọc 's' nặng" },
      { word: "der Pullover", en: "sweater", vi: "áo len", pos: "noun (m)", pronunciation_vi: "đe-a pu-LÔ-vờ" },
      { word: "der Schal", en: "scarf", vi: "khăn quàng", pos: "noun (m)", pronunciation_vi: "đe-a SAN — 'sch' đọc 's' nặng" },
      { word: "der Hut", en: "hat", vi: "mũ", pos: "noun (m)", pronunciation_vi: "đe-a HÚT — 'u' dài" },
      { word: "der Rock", en: "skirt", vi: "chân váy", pos: "noun (m)", pronunciation_vi: "đe-a RÓC — 'o' ngắn" },
      { word: "anprobieren", en: "to try on", vi: "thử đồ", pos: "verb", pronunciation_vi: "ÁN-prô-bi-rần" },
    ],
    dialogue: [
      { speaker: "A", text: "Guten Tag, kann ich Ihnen helfen?", vi: "Chào chị, tôi giúp gì được ạ?" },
      { speaker: "B", text: "Ja, ich suche eine Jacke für den Herbst.", vi: "Vâng, tôi đang tìm áo khoác cho mùa thu." },
      { speaker: "A", text: "Welche Größe haben Sie?", vi: "Chị mặc cỡ nào ạ?" },
      { speaker: "B", text: "Größe 38, glaube ich. Haben Sie Schwarz?", vi: "Cỡ 38 tôi nghĩ. Có màu đen không ạ?" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ chỉ quần áo:",
        pronunciation_focus: ["Kleidung"],
        items: [
          { prompt: "Ich trage eine ___ (quần dài) und ein ___ (áo sơ mi).", answer: "Hose ... Hemd" },
          { prompt: "Wo sind meine ___ (giày)?", answer: "Schuhe" },
          { prompt: "Sie trägt ein schönes ___ (váy).", answer: "Kleid" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối đồ vật với bộ phận cơ thể:",
        pronunciation_focus: ["Accessoires"],
        items: [
          { prompt: "der Hut", answer: "Kopf (đầu)" },
          { prompt: "der Schal", answer: "Hals (cổ)" },
          { prompt: "die Schuhe", answer: "Füße (chân)" },
          { prompt: "die Handschuhe", answer: "Hände (tay)" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: ["einkaufen"],
        items: [
          { prompt: "Bao nhiêu tiền cái áo này?", answer: "Wie viel kostet dieses Hemd?" },
          { prompt: "Tôi muốn thử cái váy này.", answer: "Ich möchte dieses Kleid anprobieren." },
          { prompt: "Có cỡ to hơn không?", answer: "Haben Sie eine größere Größe?" },
        ],
      },
    ],
  },
];

// ── 12. Transportation ───────────────────────────────────────────────────

const TRANSPORTATION: GermanLesson[] = [
  {
    id: "german_transportation",
    level: "A1",
    category: "transportation",
    title_vi: "Giao thông và đi lại",
    title_en: "Transportation and getting around",
    sentences: [
      { en: "Wo ist die nächste U-Bahn-Station?", vi: "Ga tàu điện ngầm gần nhất ở đâu?", pronunciation_focus: ["nächste → néch-xtờ", "U-Bahn → u-ban", "Station → s-ta-xi-ôn"] },
      { en: "Ich möchte ein Ticket nach Berlin, hin und zurück.", vi: "Tôi muốn vé khứ hồi đi Berlin.", pronunciation_focus: ["Ticket → tí-két", "hin → hin", "zurück → tsu-ruyk"] },
      { en: "Der Bus Linie 42 hält hier.", vi: "Xe buýt số 42 dừng ở đây.", pronunciation_focus: ["Bus → bút", "Linie → li-ni-ờ", "hält → hén-t"] },
      { en: "Um wie viel Uhr fährt der nächste Zug?", vi: "Chuyến tàu tiếp theo chạy lúc mấy giờ?", pronunciation_focus: ["fährt → phé-t", "ä → e mở", "Zug → súc"] },
      { en: "Ist dieses Taxi frei?", vi: "Taxi này có trống không ạ?", pronunciation_focus: ["Taxi → tăc-xi", "frei → phrai"] },
    ],
    cultural_notes_vi: "Giao thông công cộng Đức (ÖPNV) nổi tiếng đúng giờ và hiệu quả. Vé tàu phải mua và kích hoạt (entwerten) TRƯỚC khi lên. Kiểm soát vé bất ngờ (Schwarzfahrer = đi lậu, phạt 60€). Xe đạp rất phổ biến — có làn đường riêng. Autobahn (cao tốc) nhiều đoạn không giới hạn tốc độ.",
    tip_advice_vi: "Các câu quan trọng: 'Ein Ticket nach..., bitte' (một vé đi...), 'Fährt dieser Zug direkt?' (tàu này có đi thẳng không?), 'Wo muss ich umsteigen?' (tôi phải chuyển tàu ở đâu?). Học cách nói số tuyến bằng tiếng Đức.",
    vocabulary: [
      { word: "die U-Bahn", en: "subway", vi: "tàu điện ngầm", pos: "noun (f)", pronunciation_vi: "đi U-ban — 'U' đọc 'u'" },
      { word: "der Bus", en: "bus", vi: "xe buýt", pos: "noun (m)", pronunciation_vi: "đe-a BÚT — 'u' ngắn" },
      { word: "der Zug", en: "train", vi: "tàu hỏa", pos: "noun (m)", pronunciation_vi: "đe-a SÚC — 'Z' đọc 'ts'" },
      { word: "der Bahnhof", en: "train station", vi: "ga tàu", pos: "noun (m)", pronunciation_vi: "đe-a BAN-hốp — 'ah' dài" },
      { word: "das Ticket", en: "ticket", vi: "vé", pos: "noun (n)", pronunciation_vi: "đát TÍ-két" },
      { word: "das Auto", en: "car", vi: "xe hơi", pos: "noun (n)", pronunciation_vi: "đát AO-tô" },
      { word: "das Flugzeug", en: "airplane", vi: "máy bay", pos: "noun (n)", pronunciation_vi: "đát FLÚC-xoic — 'eu' đọc 'oi'" },
      { word: "das Fahrrad", en: "bicycle", vi: "xe đạp", pos: "noun (n)", pronunciation_vi: "đát PHA-rát — 'ah' dài" },
      { word: "zu Fuß", en: "on foot", vi: "đi bộ", pos: "phrase", pronunciation_vi: "tsu PHÚT — 'ß' đọc 'ss'" },
      { word: "die Haltestelle", en: "stop (bus/tram)", vi: "trạm dừng", pos: "noun (f)", pronunciation_vi: "đi HĂN-tờ-s-tề-lờ" },
    ],
    dialogue: [
      { speaker: "A", text: "Entschuldigung, wie komme ich zum Brandenburger Tor?", vi: "Xin lỗi, đi Cổng Brandenburg thế nào ạ?" },
      { speaker: "B", text: "Nehmen Sie die U-Bahn Linie 2 Richtung Pankow.", vi: "Bạn đi U-Bahn tuyến 2 hướng Pankow." },
      { speaker: "A", text: "An welcher Station muss ich aussteigen?", vi: "Tôi phải xuống ga nào ạ?" },
      { speaker: "B", text: "Brandenburger Tor. Das ist direkt, ungefähr zehn Minuten.", vi: "Brandenburger Tor. Đi thẳng, khoảng 10 phút." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ chỉ phương tiện:",
        pronunciation_focus: ["Verkehrsmittel"],
        items: [
          { prompt: "Ich nehme die ___ zur Arbeit. (tàu điện ngầm)", answer: "U-Bahn" },
          { prompt: "Das ___ fliegt um 14 Uhr ab. (máy bay)", answer: "Flugzeug" },
          { prompt: "Ich fahre mit dem ___ (xe đạp).", answer: "Fahrrad" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối phương tiện với địa điểm:",
        pronunciation_focus: ["wo"],
        items: [
          { prompt: "der Zug", answer: "der Bahnhof" },
          { prompt: "das Flugzeug", answer: "der Flughafen" },
          { prompt: "der Bus", answer: "die Haltestelle" },
          { prompt: "die U-Bahn", answer: "die Station" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: ["Verkehr"],
        items: [
          { prompt: "Ga tàu gần nhất ở đâu?", answer: "Wo ist der nächste Bahnhof?" },
          { prompt: "Tôi muốn một vé đi Berlin.", answer: "Ich möchte ein Ticket nach Berlin." },
          { prompt: "Xe buýt số mấy đi trung tâm?", answer: "Welcher Bus fährt ins Zentrum?" },
        ],
      },
    ],
  },
];

// ── 13. House ────────────────────────────────────────────────────────────

const HOUSE: GermanLesson[] = [
  {
    id: "german_house",
    level: "A1",
    category: "house",
    title_vi: "Nhà cửa và phòng ốc",
    title_en: "House and rooms",
    sentences: [
      { en: "Ich wohne in einer Wohnung im dritten Stock.", vi: "Tôi sống trong một căn hộ ở tầng ba.", pronunciation_focus: ["wohne → vô-nờ", "Wohnung → vô-nùng", "dritten → đrí-tần", "Stock → s-tóc"] },
      { en: "Die Küche ist links, das Badezimmer rechts.", vi: "Bếp ở bên trái, phòng tắm ở bên phải.", pronunciation_focus: ["Küche → kuy-chờ", "ü → uy", "links → lính-x", "rechts → réch-ts"] },
      { en: "Es gibt ein großes Fenster im Wohnzimmer.", vi: "Có một cửa sổ lớn trong phòng khách.", pronunciation_focus: ["großes → grô-xớt", "Fenster → phén-xtờ", "Wohnzimmer → vôn-tsi-mờ"] },
      { en: "Das Schlafzimmer geht zum Garten hinaus.", vi: "Phòng ngủ nhìn ra vườn.", pronunciation_focus: ["Schlafzimmer → s-láp-tsi-mờ", "Garten → gá-tần", "hinaus → hi-náos"] },
      { en: "Die Miete kostet 800 Euro im Monat.", vi: "Tiền thuê nhà 800 euro một tháng.", pronunciation_focus: ["Miete → mi-tờ", "kostet → cót-tệt", "Monat → mô-nát"] },
    ],
    cultural_notes_vi: "Người Đức thích ở nhà riêng (Einfamilienhaus) hơn căn hộ, nhưng ở thành phố lớn thì căn hộ (Wohnung) phổ biến. Tầng trệt gọi là 'Erdgeschoss', tầng 1 là 'erster Stock' (tương tự tầng 2 ở Mỹ). Nhà vệ sinh và phòng tắm thường tách riêng. Người Đức rất thích ban công (Balkon).",
    tip_advice_vi: "Mô tả nhà: 'Ich wohne in...' + loại nhà. Các phòng: 'Es gibt...' + phòng. Chú ý 'das Zimmer' = phòng nói chung, ghép với từ khác: Schlafzimmer, Wohnzimmer, Badezimmer, Kinderzimmer.",
    vocabulary: [
      { word: "das Haus", en: "house", vi: "nhà", pos: "noun (n)", pronunciation_vi: "đát HAOS — 'au' đọc 'ao'" },
      { word: "die Wohnung", en: "apartment", vi: "căn hộ", pos: "noun (f)", pronunciation_vi: "đi VÔ-nùng — 'W' đọc 'v'" },
      { word: "das Schlafzimmer", en: "bedroom", vi: "phòng ngủ", pos: "noun (n)", pronunciation_vi: "đát S-LÁP-tsi-mờ" },
      { word: "die Küche", en: "kitchen", vi: "nhà bếp", pos: "noun (f)", pronunciation_vi: "đi KUY-chờ — 'ü' đọc 'uy'" },
      { word: "das Wohnzimmer", en: "living room", vi: "phòng khách", pos: "noun (n)", pronunciation_vi: "đát VÔN-tsi-mờ" },
      { word: "das Badezimmer", en: "bathroom", vi: "phòng tắm", pos: "noun (n)", pronunciation_vi: "đát BA-đờ-tsi-mờ" },
      { word: "das Fenster", en: "window", vi: "cửa sổ", pos: "noun (n)", pronunciation_vi: "đát PHÉN-xtờ" },
      { word: "die Tür", en: "door", vi: "cửa", pos: "noun (f)", pronunciation_vi: "đi TUY-A — 'ü' đọc 'uy'" },
      { word: "der Garten", en: "garden", vi: "vườn", pos: "noun (m)", pronunciation_vi: "đe-a GÁ-tần — 'g' cứng" },
      { word: "der Stock", en: "floor / storey", vi: "tầng", pos: "noun (m)", pronunciation_vi: "đe-a S-TÓC" },
    ],
    dialogue: [
      { speaker: "A", text: "In was für einer Wohnung wohnst du?", vi: "Bạn sống ở loại nhà nào?" },
      { speaker: "B", text: "In einer Wohnung mit zwei Zimmern, im zweiten Stock.", vi: "Căn hộ hai phòng, tầng hai." },
      { speaker: "A", text: "Gibt es einen Balkon?", vi: "Có ban công không?" },
      { speaker: "B", text: "Ja, einen kleinen Balkon zur Straße.", vi: "Có, một ban công nhỏ nhìn ra phố." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền tên phòng:",
        pronunciation_focus: ["Zimmer"],
        items: [
          { prompt: "Ich schlafe im ___.", answer: "Schlafzimmer" },
          { prompt: "Wir essen in der ___.", answer: "Küche" },
          { prompt: "Ich dusche im ___.", answer: "Badezimmer" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối phòng với đồ đạc:",
        pronunciation_focus: ["Möbel"],
        items: [
          { prompt: "das Schlafzimmer", answer: "ein Bett (giường)" },
          { prompt: "die Küche", answer: "ein Herd (bếp)" },
          { prompt: "das Wohnzimmer", answer: "ein Sofa (ghế sofa)" },
          { prompt: "das Badezimmer", answer: "eine Dusche (vòi sen)" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: ["Wohnung"],
        items: [
          { prompt: "Tôi sống trong một căn hộ nhỏ.", answer: "Ich wohne in einer kleinen Wohnung." },
          { prompt: "Có một cửa sổ lớn trong phòng khách.", answer: "Es gibt ein großes Fenster im Wohnzimmer." },
          { prompt: "Phòng ngủ của tôi ở tầng hai.", answer: "Mein Schlafzimmer ist im zweiten Stock." },
        ],
      },
    ],
  },
];

// ── 14. Hobbies ──────────────────────────────────────────────────────────

const HOBBIES: GermanLesson[] = [
  {
    id: "german_hobbies",
    level: "A1",
    category: "hobbies",
    title_vi: "Sở thích và hoạt động",
    title_en: "Hobbies and activities",
    sentences: [
      { en: "Was machst du gern in deiner Freizeit?", vi: "Bạn thích làm gì lúc rảnh?", pronunciation_focus: ["machst → mách-xt", "gern → ghén", "Freizeit → phrai-tsait"] },
      { en: "Ich lese gern Romane und höre Musik.", vi: "Tôi rất thích đọc tiểu thuyết và nghe nhạc.", pronunciation_focus: ["lese → lê-dờ", "Romane → rô-ma-nờ", "höre → hơ-rờ"] },
      { en: "Ich spiele jeden Samstag Fußball mit Freunden.", vi: "Tôi chơi bóng đá thứ Bảy hàng tuần với bạn.", pronunciation_focus: ["spiele → s-pi-lờ", "Samstag → dám-xtác", "Fußball → phút-ban"] },
      { en: "Sie malt und fotografiert gern.", vi: "Cô ấy thích vẽ tranh và chụp ảnh.", pronunciation_focus: ["malt → man-t", "fotografiert → phô-tô-gra-phiat"] },
      { en: "Wir reisen gern und entdecken neue Orte.", vi: "Chúng tôi thích du lịch và khám phá nơi mới.", pronunciation_focus: ["reisen → rai-dần", "entdecken → en-t-đéc-kần", "Orte → ó-tờ"] },
    ],
    cultural_notes_vi: "Người Đức rất coi trọng sở thích cá nhân (Hobbys). Các câu lạc bộ (Verein) rất phổ biến — từ bóng đá, bơi lội đến hợp xướng. Đi bộ đường dài (Wandern) là sở thích quốc dân. Đọc sách, làm vườn, nấu ăn cũng phổ biến. Người Đức thường tách biệt công việc và sở thích rất rõ ràng.",
    tip_advice_vi: "Cấu trúc: 'Ich + động từ + gern' (tôi thích làm gì). 'Spielen' dùng cho thể thao và nhạc cụ: 'Ich spiele Fußball / Klavier'. 'Gern' đứng sau động từ, không dịch riêng ra mà là một phần của cấu trúc 'thích làm gì'.",
    vocabulary: [
      { word: "lesen", en: "to read", vi: "đọc", pos: "verb", pronunciation_vi: "LÊ-dần — 's' đọc 'd'" },
      { word: "die Musik", en: "music", vi: "âm nhạc", pos: "noun (f)", pronunciation_vi: "đi mu-DÍC" },
      { word: "der Sport", en: "sport", vi: "thể thao", pos: "noun (m)", pronunciation_vi: "đe-a S-PÓT — 'o' dài" },
      { word: "das Kino", en: "cinema / movies", vi: "rạp phim", pos: "noun (n)", pronunciation_vi: "đát KI-nô" },
      { word: "die Reise", en: "travel / trip", vi: "chuyến du lịch", pos: "noun (f)", pronunciation_vi: "đi RAI-dờ — 'ei' đọc 'ai'" },
      { word: "kochen", en: "to cook", vi: "nấu ăn", pos: "verb", pronunciation_vi: "CÓ-chần — 'ch' nhẹ" },
      { word: "malen", en: "to paint", vi: "vẽ tranh", pos: "verb", pronunciation_vi: "MA-lần — 'a' dài" },
      { word: "tanzen", en: "to dance", vi: "nhảy múa", pos: "verb", pronunciation_vi: "TĂN-tsần — 'z' đọc 'ts'" },
      { word: "wandern", en: "to hike", vi: "đi bộ đường dài", pos: "verb", pronunciation_vi: "VĂN-đờn — 'W' đọc 'v'" },
      { word: "spielen", en: "to play", vi: "chơi", pos: "verb", pronunciation_vi: "S-PI-lần — 'ie' đọc 'i' dài" },
    ],
    dialogue: [
      { speaker: "A", text: "Was machst du am Wochenende?", vi: "Cuối tuần bạn làm gì?" },
      { speaker: "B", text: "Oft fahre ich Rad oder lese ein gutes Buch.", vi: "Thường thì tôi đạp xe hoặc đọc sách." },
      { speaker: "A", text: "Ich spiele samstags Tennis.", vi: "Tôi thì chơi tennis thứ Bảy." },
      { speaker: "B", text: "Wir könnten mal zusammen spielen!", vi: "Có hôm nào chơi cùng đi!" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền động từ đúng:",
        pronunciation_focus: ["Hobbys"],
        items: [
          { prompt: "Ich ___ gern. (đọc sách)", answer: "lese" },
          { prompt: "Er ___ am Wochenende Fußball. (chơi)", answer: "spielt" },
          { prompt: "Wir ___ gern im Sommer. (đi bộ đường dài)", answer: "wandern" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối động từ với sở thích:",
        pronunciation_focus: ["Freizeit"],
        items: [
          { prompt: "lesen", answer: "einen Roman" },
          { prompt: "sehen", answer: "einen Film" },
          { prompt: "hören", answer: "Musik" },
          { prompt: "machen", answer: "Sport" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: ["gern"],
        items: [
          { prompt: "Tôi thích đọc sách và nghe nhạc.", answer: "Ich lese gern und höre gern Musik." },
          { prompt: "Bạn có chơi thể thao không?", answer: "Machst du Sport?" },
          { prompt: "Cuối tuần tôi thường đi bộ đường dài.", answer: "Am Wochenende wandere ich oft." },
        ],
      },
    ],
  },
];

// ── 15. Health ───────────────────────────────────────────────────────────

const HEALTH: GermanLesson[] = [
  {
    id: "german_health",
    level: "A1",
    category: "health",
    title_vi: "Sức khỏe và cơ thể",
    title_en: "Health and the body",
    sentences: [
      { en: "Ich fühle mich nicht gut. Ich habe Kopfschmerzen.", vi: "Tôi thấy không khỏe. Tôi bị đau đầu.", pronunciation_focus: ["fühle → phuy-lờ", "Kopfschmerzen → cóp-ph-s-mé-tsần", "ü → uy"] },
      { en: "Wo haben Sie Schmerzen? Ich habe Bauchschmerzen.", vi: "Bạn đau ở đâu? Tôi đau bụng.", pronunciation_focus: ["Schmerzen → s-mé-tsần", "Bauchschmerzen → baoch-s-mé-tsần"] },
      { en: "Ich muss einen Termin beim Arzt machen.", vi: "Tôi cần đặt lịch hẹn bác sĩ.", pronunciation_focus: ["Termin → te-mìn", "Arzt → ác-t", "machen → má-chần"] },
      { en: "Man soll viel Wasser trinken, wenn es heiß ist.", vi: "Cần uống nhiều nước khi trời nóng.", pronunciation_focus: ["soll → dón", "trinken → tríng-kần", "heiß → hais"] },
      { en: "Ich bin müde, ich habe nicht gut geschlafen.", vi: "Tôi mệt, tôi ngủ không ngon.", pronunciation_focus: ["müde → muy-đờ", "geschlafen → ghờ-s-la-phần"] },
    ],
    cultural_notes_vi: "Hệ thống y tế Đức thuộc loại tốt nhất thế giới. Mọi người phải có bảo hiểm y tế (Krankenversicherung) — công (gesetzlich) hoặc tư (privat). Khi ốm, bạn gọi bác sĩ gia đình (Hausarzt) trước, họ sẽ giới thiệu chuyên khoa nếu cần. Nhà thuốc (Apotheke) có chữ 'A' màu đỏ, mở cửa luân phiên ngoài giờ.",
    tip_advice_vi: "Từ 'Schmerzen' (đau) ghép với bộ phận cơ thể: Kopfschmerzen, Bauchschmerzen, Rückenschmerzen. Cấu trúc: 'Ich habe + bộ phận + schmerzen'. Cũng có thể nói 'Mir tut der Kopf weh' (đầu tôi đau) — dùng Dativ (mir).",
    vocabulary: [
      { word: "der Kopf", en: "head", vi: "đầu", pos: "noun (m)", pronunciation_vi: "đe-a CÓP-PH" },
      { word: "der Bauch", en: "stomach", vi: "bụng", pos: "noun (m)", pronunciation_vi: "đe-a BAOCH — 'au' đọc 'ao'" },
      { word: "der Rücken", en: "back", vi: "lưng", pos: "noun (m)", pronunciation_vi: "đe-a RUY-kần — 'ü' đọc 'uy'" },
      { word: "der Arm", en: "arm", vi: "cánh tay", pos: "noun (m)", pronunciation_vi: "đe-a Á-M — 'a' dài" },
      { word: "das Bein", en: "leg", vi: "chân", pos: "noun (n)", pronunciation_vi: "đát BAIN — 'ei' đọc 'ai'" },
      { word: "der Arzt", en: "doctor", vi: "bác sĩ", pos: "noun (m)", pronunciation_vi: "đe-a ÁC-T — 'a' dài" },
      { word: "die Apotheke", en: "pharmacy", vi: "nhà thuốc", pos: "noun (f)", pronunciation_vi: "đi a-pô-TÊ-kờ" },
      { word: "das Medikament", en: "medicine", vi: "thuốc", pos: "noun (n)", pronunciation_vi: "đát mê-đi-ca-MÉNT" },
      { word: "krank", en: "sick", vi: "ốm / bệnh", pos: "adjective", pronunciation_vi: "KRĂNG-K — 'a' ngắn" },
      { word: "das Fieber", en: "fever", vi: "sốt", pos: "noun (n)", pronunciation_vi: "đát PHI-bờ — 'ie' đọc 'i' dài" },
    ],
    dialogue: [
      { speaker: "A", text: "Guten Tag, Herr Doktor. Ich fühle mich nicht gut.", vi: "Chào bác sĩ, tôi thấy không khỏe." },
      { speaker: "B", text: "Was fehlt Ihnen denn?", vi: "Bị sao thế?" },
      { speaker: "A", text: "Ich habe Halsschmerzen und Fieber.", vi: "Tôi đau họng và bị sốt." },
      { speaker: "B", text: "Machen Sie den Mund auf, ich schaue mal.", vi: "Há miệng ra, tôi xem nào." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền bộ phận cơ thể:",
        pronunciation_focus: ["Körperteile"],
        items: [
          { prompt: "Ich habe ___schmerzen. (đau đầu)", answer: "Kopf" },
          { prompt: "Er hat ___schmerzen. (đau bụng)", answer: "Bauch" },
          { prompt: "Sie hat ___schmerzen. (đau lưng)", answer: "Rücken" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối triệu chứng với lời khuyên:",
        pronunciation_focus: ["Gesundheit"],
        items: [
          { prompt: "Ich habe Kopfschmerzen.", answer: "Nehmen Sie eine Tablette." },
          { prompt: "Ich habe Fieber.", answer: "Ruhen Sie sich aus." },
          { prompt: "Ich habe Zahnschmerzen.", answer: "Gehen Sie zum Zahnarzt." },
          { prompt: "Ich bin müde.", answer: "Schlafen Sie mehr." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: ["Schmerzen"],
        items: [
          { prompt: "Tôi bị đau bụng.", answer: "Ich habe Bauchschmerzen." },
          { prompt: "Bạn có bị sốt không?", answer: "Haben Sie Fieber?" },
          { prompt: "Tôi cần đi khám bác sĩ.", answer: "Ich muss zum Arzt gehen." },
        ],
      },
    ],
  },
];

// ── 16. Work ─────────────────────────────────────────────────────────────

const WORK: GermanLesson[] = [
  {
    id: "german_work",
    level: "A1",
    category: "work",
    title_vi: "Công việc và nghề nghiệp",
    title_en: "Work and professions",
    sentences: [
      { en: "Was sind Sie von Beruf?", vi: "Bạn làm nghề gì?", pronunciation_focus: ["sind → dint", "Beruf → bờ-rúp"] },
      { en: "Ich bin Ingenieur bei einer Firma in Berlin.", vi: "Tôi là kỹ sư ở một công ty tại Berlin.", pronunciation_focus: ["Ingenieur → in-dê-ni-ơa", "Firma → phía-ma"] },
      { en: "Ich arbeite Vollzeit, von Montag bis Freitag.", vi: "Tôi làm toàn thời gian, từ thứ Hai đến thứ Sáu.", pronunciation_focus: ["arbeite → á-bai-tờ", "Vollzeit → phôn-tsait", "Montag → môn-tác"] },
      { en: "Meine Arbeit ist interessant, aber manchmal stressig.", vi: "Công việc của tôi thú vị nhưng đôi khi căng thẳng.", pronunciation_focus: ["Arbeit → á-bait", "interessant → in-tờ-rét-xănt", "stressig → s-tré-xích"] },
      { en: "Ich suche einen Job im Marketing.", vi: "Tôi đang tìm việc trong ngành marketing.", pronunciation_focus: ["suche → du-chờ", "Job → dóp", "Marketing → má-kờ-ting"] },
    ],
    cultural_notes_vi: "Tuần làm việc ở Đức thường 35-40 giờ. Nghỉ phép có lương tối thiểu 20 ngày/năm (thường 30 ngày). Người Đức tách biệt công việc và cuộc sống riêng rất rõ — không trả lời email công việc ngoài giờ. Phỏng vấn xin việc ở Đức thường yêu cầu đầy đủ giấy tờ (Zeugnisse) và ảnh trong CV.",
    tip_advice_vi: "Giới thiệu nghề: 'Ich bin + nghề (von Beruf)'. Lưu ý: không có mạo từ trước nghề nghiệp. 'Ich bin Arzt' (KHÔNG nói 'Ich bin ein Arzt'). Nghề nữ thường thêm '-in': 'Ich bin Lehrerin' (nữ giáo viên).",
    vocabulary: [
      { word: "die Arbeit", en: "work / job", vi: "công việc", pos: "noun (f)", pronunciation_vi: "đi Á-bait" },
      { word: "der Beruf", en: "profession", vi: "nghề", pos: "noun (m)", pronunciation_vi: "đe-a bờ-RÚP" },
      { word: "die Firma", en: "company", vi: "công ty", pos: "noun (f)", pronunciation_vi: "đi PHÍA-ma" },
      { word: "das Büro", en: "office", vi: "văn phòng", pos: "noun (n)", pronunciation_vi: "đát buy-RÔ — 'ü' đọc 'uy'" },
      { word: "der Kollege", en: "colleague", vi: "đồng nghiệp", pos: "noun (m)", pronunciation_vi: "đe-a co-LÊ-ghờ" },
      { word: "das Gehalt", en: "salary", vi: "lương", pos: "noun (n)", pronunciation_vi: "đát ghờ-HĂN-T" },
      { word: "das Vorstellungsgespräch", en: "interview", vi: "phỏng vấn", pos: "noun (n)", pronunciation_vi: "đát pho-s-té-lùng-x-ghờ-s-préch" },
      { word: "der Lebenslauf", en: "resume / CV", vi: "sơ yếu lý lịch", pos: "noun (m)", pronunciation_vi: "đe-a LÊ-bần-x-laop" },
      { word: "Vollzeit", en: "full-time", vi: "toàn thời gian", pos: "adverb", pronunciation_vi: "PHÔN-tsait" },
      { word: "einstellen", en: "to hire", vi: "tuyển dụng", pos: "verb", pronunciation_vi: "AIN-s-tề-lần — tách: stellen... ein" },
    ],
    dialogue: [
      { speaker: "A", text: "Also, was machst du beruflich?", vi: "Thế, bạn làm nghề gì?" },
      { speaker: "B", text: "Ich bin Buchhalter in einer Firma in Hamburg.", vi: "Tôi là kế toán ở một công ty ở Hamburg." },
      { speaker: "A", text: "Gefällt es dir?", vi: "Bạn thích không?" },
      { speaker: "B", text: "Ja, das Team ist nett und die Arbeit ist abwechslungsreich.", vi: "Có, đồng nghiệp vui vẻ và công việc đa dạng." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền nghề nghiệp:",
        pronunciation_focus: ["Berufe"],
        items: [
          { prompt: "Sie ist ___ (nữ giáo viên).", answer: "Lehrerin" },
          { prompt: "Er ist ___ (kỹ sư).", answer: "Ingenieur" },
          { prompt: "Ich bin ___ (bác sĩ).", answer: "Arzt" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối nghề với nơi làm việc:",
        pronunciation_focus: ["Arbeitsplatz"],
        items: [
          { prompt: "der Arzt", answer: "das Krankenhaus" },
          { prompt: "der Lehrer", answer: "die Schule" },
          { prompt: "der Koch", answer: "das Restaurant" },
          { prompt: "der Ingenieur", answer: "das Büro" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: ["Beruf"],
        items: [
          { prompt: "Bạn làm nghề gì?", answer: "Was sind Sie von Beruf?" },
          { prompt: "Tôi làm toàn thời gian.", answer: "Ich arbeite Vollzeit." },
          { prompt: "Tôi đang tìm việc.", answer: "Ich suche einen Job." },
        ],
      },
    ],
  },
];

// ── 17. Travel ───────────────────────────────────────────────────────────

const TRAVEL: GermanLesson[] = [
  {
    id: "german_travel",
    level: "A1",
    category: "travel",
    title_vi: "Du lịch và khách sạn",
    title_en: "Travel and hotels",
    sentences: [
      { en: "Ich möchte ein Zimmer für zwei Nächte reservieren.", vi: "Tôi muốn đặt phòng cho hai đêm.", pronunciation_focus: ["möchte → mớch-tờ", "Zimmer → tsi-mờ", "Nächte → néch-tờ"] },
      { en: "Haben Sie ein Zimmer mit Meerblick?", vi: "Có phòng nhìn ra biển không ạ?", pronunciation_focus: ["Meerblick → mê-a-blíc", "ck → k"] },
      { en: "Wo ist der Flughafen? Ist das weit von hier?", vi: "Sân bay ở đâu? Có xa đây không?", pronunciation_focus: ["Flughafen → flúc-ha-phần", "weit → vait"] },
      { en: "Ich möchte ein Auto für eine Woche mieten.", vi: "Tôi muốn thuê xe một tuần.", pronunciation_focus: ["Auto → ao-tô", "Woche → vo-chờ", "mieten → mi-tần"] },
      { en: "Können Sie mir ein gutes Restaurant empfehlen?", vi: "Bạn giới thiệu cho tôi nhà hàng ngon được không?", pronunciation_focus: ["Restaurant → ré-xtô-răng", "empfehlen → em-phê-lần"] },
    ],
    cultural_notes_vi: "Đức có ngành du lịch phát triển mạnh. Khách sạn phân hạng sao (Sterne). Frühstück (bữa sáng) thường được phục vụ theo kiểu buffet với bánh mì, thịt nguội, phô mai, trứng. Khi vào nhà hàng, đợi được chỉ bàn. Tiền tip (Trinkgeld) 5-10%, đưa trực tiếp khi thanh toán.",
    tip_advice_vi: "Học cách đặt phòng: 'Ich möchte ein Zimmer reservieren'. Các câu hỏi quan trọng: 'Ist das Frühstück inklusive?' (có gồm bữa sáng không?), 'Mit Dusche oder Bad?' (có vòi sen hay bồn tắm?). 'Einzelzimmer' (phòng đơn), 'Doppelzimmer' (phòng đôi).",
    vocabulary: [
      { word: "das Hotel", en: "hotel", vi: "khách sạn", pos: "noun (n)", pronunciation_vi: "đát hô-TEN" },
      { word: "das Zimmer", en: "room", vi: "phòng", pos: "noun (n)", pronunciation_vi: "đát TSÍ-mờ — 'Z' đọc 'ts'" },
      { word: "die Reservierung", en: "reservation", vi: "đặt chỗ", pos: "noun (f)", pronunciation_vi: "đi rê-de-vi-rùng" },
      { word: "der Flughafen", en: "airport", vi: "sân bay", pos: "noun (m)", pronunciation_vi: "đe-a FLÚC-ha-phần" },
      { word: "der Reisepass", en: "passport", vi: "hộ chiếu", pos: "noun (m)", pronunciation_vi: "đe-a RAI-dờ-pát" },
      { word: "der Koffer", en: "suitcase", vi: "va li", pos: "noun (m)", pronunciation_vi: "đe-a CÓP-phờ" },
      { word: "der Stadtplan", en: "map", vi: "bản đồ", pos: "noun (m)", pronunciation_vi: "đe-a S-TÁT-plăn" },
      { word: "der Strand", en: "beach", vi: "bãi biển", pos: "noun (m)", pronunciation_vi: "đe-a S-TRĂN-T" },
      { word: "das Museum", en: "museum", vi: "bảo tàng", pos: "noun (n)", pronunciation_vi: "đát mu-DÊ-um" },
      { word: "besichtigen", en: "to visit (sightsee)", vi: "tham quan", pos: "verb", pronunciation_vi: "bờ-DÍCH-ti-ghần" },
    ],
    dialogue: [
      { speaker: "A", text: "Guten Tag, haben Sie noch ein Zimmer frei?", vi: "Chào anh, còn phòng trống không ạ?" },
      { speaker: "B", text: "Ja, für wie viele Nächte?", vi: "Có, cho mấy đêm ạ?" },
      { speaker: "A", text: "Zwei Nächte, mit Frühstück bitte.", vi: "Hai đêm, có bữa sáng ạ." },
      { speaker: "B", text: "Gut, ich gebe Ihnen ein Zimmer mit Blick auf den Park.", vi: "Tốt, tôi sắp phòng nhìn ra công viên cho anh." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ du lịch:",
        pronunciation_focus: ["Reise"],
        items: [
          { prompt: "Ich möchte ein Zimmer ___. (đặt phòng)", answer: "reservieren" },
          { prompt: "Wo ist der ___? (sân bay)", answer: "Flughafen" },
          { prompt: "Haben Sie einen ___? (bản đồ)", answer: "Stadtplan" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối địa điểm với hoạt động:",
        pronunciation_focus: ["Tourismus"],
        items: [
          { prompt: "das Museum", answer: "Bilder ansehen" },
          { prompt: "der Strand", answer: "schwimmen" },
          { prompt: "das Restaurant", answer: "essen" },
          { prompt: "der Bahnhof", answer: "Zug nehmen" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: ["Hotel"],
        items: [
          { prompt: "Tôi muốn đặt phòng khách sạn.", answer: "Ich möchte ein Hotelzimmer reservieren." },
          { prompt: "Bao nhiêu tiền một đêm?", answer: "Wie viel kostet es pro Nacht?" },
          { prompt: "Sân bay ở đâu?", answer: "Wo ist der Flughafen?" },
        ],
      },
    ],
  },
];

// ── 18. Emotions ─────────────────────────────────────────────────────────

const EMOTIONS: GermanLesson[] = [
  {
    id: "german_emotions",
    level: "A1",
    category: "emotions",
    title_vi: "Cảm xúc và tâm trạng",
    title_en: "Emotions and feelings",
    sentences: [
      { en: "Wie fühlst du dich heute?", vi: "Hôm nay bạn cảm thấy thế nào?", pronunciation_focus: ["fühlst → phuyl-xt", "dich → đích", "heute → hoi-tờ"] },
      { en: "Ich bin sehr froh, weil die Sonne scheint.", vi: "Tôi rất vui vì trời có nắng.", pronunciation_focus: ["froh → phrô", "weil → vai-l", "scheint → sain-t"] },
      { en: "Sie ist traurig wegen des schlechten Wetters.", vi: "Cô ấy buồn vì thời tiết xấu.", pronunciation_focus: ["traurig → trao-rích", "schlechten → s-léch-tần", "Wetters → vét-tờx"] },
      { en: "Ich bin nervös vor meiner Prüfung.", vi: "Tôi căng thẳng trước kỳ thi.", pronunciation_focus: ["nervös → ne-vớs", "Prüfung → pruy-phùng", "ü → uy"] },
      { en: "Keine Sorge, alles wird gut.", vi: "Đừng lo, mọi chuyện sẽ ổn thôi.", pronunciation_focus: ["Sorge → dó-ghờ", "wird → viat", "gut → gút"] },
    ],
    cultural_notes_vi: "Người Đức có thể khá giữ kín cảm xúc với người lạ nhưng rất thẳng thắn khi đã quen. Họ không ngại nói thẳng 'Das gefällt mir nicht' (tôi không thích cái đó). Cảm xúc tiêu cực thường được bày tỏ trực tiếp. Người Đức coi trọng sự chân thành hơn là lịch sự giả tạo.",
    tip_advice_vi: "Học cặp đối lập: froh/traurig (vui/buồn), ruhig/wütend (bình tĩnh/tức giận), entspannt/nervös (thư giãn/căng thẳng). Cấu trúc: 'Ich bin + tính từ'. Phân biệt 'froh' (vui vẻ, nhất thời) và 'glücklich' (hạnh phúc, lâu dài).",
    vocabulary: [
      { word: "froh", en: "happy / glad", vi: "vui", pos: "adjective", pronunciation_vi: "PHRÔ — 'o' dài" },
      { word: "traurig", en: "sad", vi: "buồn", pos: "adjective", pronunciation_vi: "TRAO-rích — 'au' đọc 'ao'" },
      { word: "wütend", en: "angry", vi: "tức giận", pos: "adjective", pronunciation_vi: "VUY-tầnt — 'ü' đọc 'uy'" },
      { word: "müde", en: "tired", vi: "mệt", pos: "adjective", pronunciation_vi: "MUY-đờ — 'ü' đọc 'uy'" },
      { word: "nervös", en: "nervous", vi: "căng thẳng", pos: "adjective", pronunciation_vi: "ne-VỚS — 'ö' đọc 'ơ' tròn môi" },
      { word: "besorgt", en: "worried", vi: "lo lắng", pos: "adjective", pronunciation_vi: "bờ-DÓC-T" },
      { word: "überrascht", en: "surprised", vi: "ngạc nhiên", pos: "adjective", pronunciation_vi: "uy-bờ-RÁ-S-T" },
      { word: "enttäuscht", en: "disappointed", vi: "thất vọng", pos: "adjective", pronunciation_vi: "en-TOI-S-T — 'äu' đọc 'oi'" },
      { word: "ruhig", en: "calm", vi: "bình tĩnh", pos: "adjective", pronunciation_vi: "RU-ích — 'u' dài" },
      { word: "verliebt", en: "in love", vi: "đang yêu", pos: "adjective", pronunciation_vi: "phe-LÍP-T — 'v' đọc 'ph'" },
    ],
    dialogue: [
      { speaker: "A", text: "Du siehst müde aus, alles okay?", vi: "Trông bạn mệt thế, ổn không?" },
      { speaker: "B", text: "Ja, ich habe schlecht geschlafen. Bin ein bisschen gestresst von der Arbeit.", vi: "Ừ, tôi ngủ không ngon. Hơi căng thẳng vì công việc." },
      { speaker: "A", text: "Verstehe. Wenn du reden willst, ich bin da.", vi: "Tôi hiểu. Nếu muốn nói chuyện, tôi ở đây." },
      { speaker: "B", text: "Danke, das ist lieb. Wird schon wieder.", vi: "Cảm ơn, tốt bụng quá. Sẽ ổn thôi." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cảm xúc phù hợp:",
        pronunciation_focus: ["Gefühle"],
        items: [
          { prompt: "Er hat gewonnen, er ist sehr ___. (vui)", answer: "froh" },
          { prompt: "Sie hat ihre Katze verloren, sie ist ___. (buồn)", answer: "traurig" },
          { prompt: "Ich habe nicht geschlafen, ich bin ___. (mệt)", answer: "müde" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối cảm xúc với tình huống:",
        pronunciation_focus: ["Emotionen"],
        items: [
          { prompt: "froh", answer: "ein Geschenk bekommen" },
          { prompt: "wütend", answer: "jemand kommt zu spät" },
          { prompt: "überrascht", answer: "eine unerwartete Party" },
          { prompt: "besorgt", answer: "eine Prüfung morgen" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: ["sein + Adjektiv"],
        items: [
          { prompt: "Hôm nay tôi rất vui.", answer: "Heute bin ich sehr froh." },
          { prompt: "Cô ấy đang lo lắng.", answer: "Sie ist besorgt." },
          { prompt: "Đừng giận, không sao đâu.", answer: "Sei nicht wütend, das macht nichts." },
        ],
      },
    ],
  },
];

// ── 19. Past Tense ──────────────────────────────────────────────────────

const PAST_TENSE: GermanLesson[] = [
  {
    id: "german_past_tense",
    level: "A1",
    category: "past_tense",
    title_vi: "Thì quá khứ (Perfekt)",
    title_en: "Past tense (Perfekt)",
    sentences: [
      { en: "Gestern habe ich im Restaurant gegessen.", vi: "Hôm qua tôi đã ăn ở nhà hàng.", pronunciation_focus: ["gestern → ghé-xtờn", "habe → ha-bờ", "gegessen → ghờ-ghét-xần"] },
      { en: "Was hast du am letzten Wochenende gemacht?", vi: "Cuối tuần trước bạn đã làm gì?", pronunciation_focus: ["hast → hát", "letzten → lé-ts-tần", "gemacht → ghờ-MÁCH-T"] },
      { en: "Wir sind ins Kino gegangen und haben einen guten Film gesehen.", vi: "Chúng tôi đã đi xem phim và xem bộ phim hay.", pronunciation_focus: ["gegangen → ghờ-GĂNG-ần", "gesehen → ghờ-DÊ-ần"] },
      { en: "Sie ist 1995 in Berlin geboren.", vi: "Cô ấy sinh năm 1995 ở Berlin.", pronunciation_focus: ["geboren → ghờ-BÔ-rần", "ist → ít"] },
      { en: "Ich habe schon Paris besucht, aber Lyon noch nicht gesehen.", vi: "Tôi đã thăm Paris rồi nhưng chưa thấy Lyon.", pronunciation_focus: ["besucht → bờ-DÚCH-T", "gesehen → ghờ-DÊ-ần"] },
    ],
    cultural_notes_vi: "Trong tiếng Đức nói, Perfekt là thì quá khứ được dùng nhiều nhất trong hội thoại hàng ngày. Präteritum (thì quá khứ đơn) chủ yếu dùng trong văn viết và với các động từ 'sein', 'haben', và động từ khiếm khuyết. Công thức Perfekt: haben/sein (hiện tại) + Partizip II (quá khứ phân từ).",
    tip_advice_vi: "Hầu hết động từ dùng 'haben' làm trợ động từ. Dùng 'sein' với động từ chỉ sự di chuyển hoặc thay đổi trạng thái: gehen, fahren, kommen, aufstehen, einschlafen. Quá khứ phân từ thường có 'ge-' ở đầu: machen → ge-MACH-t, spielen → ge-SPIEL-t. Nhưng động từ kết thúc bằng '-ieren' KHÔNG có 'ge-': studieren → studiert.",
    vocabulary: [
      { word: "gestern", en: "yesterday", vi: "hôm qua", pos: "adverb", pronunciation_vi: "GHÉT-xtờn — 'g' cứng" },
      { word: "vorgestern", en: "day before yesterday", vi: "hôm kia", pos: "adverb", pronunciation_vi: "pho-GHÉT-xtờn" },
      { word: "letzte Woche", en: "last week", vi: "tuần trước", pos: "phrase", pronunciation_vi: "LÉT-ts-tờ VO-chờ" },
      { word: "schon", en: "already", vi: "đã... rồi", pos: "adverb", pronunciation_vi: "SÔN — 'sch' đọc 's' nặng" },
      { word: "nie", en: "never", vi: "chưa bao giờ", pos: "adverb", pronunciation_vi: "NI — 'ie' đọc 'i' dài" },
      { word: "gegangen", en: "went (pp)", vi: "đã đi", pos: "verb (pp)", pronunciation_vi: "ghờ-GĂNG-ần" },
      { word: "gemacht", en: "did / made (pp)", vi: "đã làm", pos: "verb (pp)", pronunciation_vi: "ghờ-MÁCH-T" },
      { word: "gesehen", en: "saw (pp)", vi: "đã thấy", pos: "verb (pp)", pronunciation_vi: "ghờ-DÊ-ần — 's' đọc 'd'" },
      { word: "genommen", en: "took (pp)", vi: "đã lấy", pos: "verb (pp)", pronunciation_vi: "ghờ-NÓM-mần" },
      { word: "geboren", en: "born (pp)", vi: "đã sinh ra", pos: "verb (pp)", pronunciation_vi: "ghờ-BÔ-rần" },
    ],
    dialogue: [
      { speaker: "A", text: "Hattest du ein schönes Wochenende?", vi: "Cuối tuần bạn vui không?" },
      { speaker: "B", text: "Ja, super! Ich bin ans Meer mit meiner Familie gefahren.", vi: "Có, tuyệt lắm! Tôi đã đi biển với gia đình." },
      { speaker: "A", text: "Seid ihr geschwommen?", vi: "Các bạn có bơi không?" },
      { speaker: "B", text: "Ja, wir sind geschwommen und haben Meeresfrüchte gegessen.", vi: "Có, tụi tôi đã bơi và ăn hải sản." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền trợ động từ đúng (haben / sein):",
        pronunciation_focus: ["Perfekt"],
        items: [
          { prompt: "Ich ___ eine Pizza gegessen. (haben)", answer: "habe" },
          { prompt: "Sie ___ ins Kino gegangen. (sein)", answer: "ist" },
          { prompt: "Wir ___ den Zug genommen. (haben)", answer: "haben" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối nguyên mẫu với quá khứ phân từ:",
        pronunciation_focus: ["Partizip II"],
        items: [
          { prompt: "essen", answer: "gegessen" },
          { prompt: "gehen", answer: "gegangen" },
          { prompt: "sehen", answer: "gesehen" },
          { prompt: "nehmen", answer: "genommen" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức (dùng Perfekt):",
        pronunciation_focus: ["Perfekt"],
        items: [
          { prompt: "Hôm qua tôi đã đi Berlin.", answer: "Gestern bin ich nach Berlin gefahren." },
          { prompt: "Cô ấy đã ăn một cái bánh mì.", answer: "Sie hat ein Brot gegessen." },
          { prompt: "Chúng tôi đã xem bộ phim đó.", answer: "Wir haben den Film gesehen." },
        ],
      },
    ],
  },
];

// ── 20. Future Plans ────────────────────────────────────────────────────

const FUTURE_PLANS: GermanLesson[] = [
  {
    id: "german_future_plans",
    level: "A1",
    category: "future_plans",
    title_vi: "Kế hoạch tương lai",
    title_en: "Future plans",
    sentences: [
      { en: "Was wirst du heute Abend machen?", vi: "Tối nay bạn sẽ làm gì?", pronunciation_focus: ["wirst → vi-xt", "heute → hoi-tờ", "Abend → a-bần", "machen → má-chần"] },
      { en: "Ich werde einen Film ansehen und mich ausruhen.", vi: "Tôi sẽ xem phim và nghỉ ngơi.", pronunciation_focus: ["werde → vê-đờ", "ansehen → án-dê-ần", "ausruhen → áos-ru-ần"] },
      { en: "Nächstes Jahr werden wir nach Hamburg umziehen.", vi: "Năm tới chúng tôi sẽ chuyển nhà tới Hamburg.", pronunciation_focus: ["nächstes → néch-xtớt", "werden → vê-đần", "umziehen → úm-xi-ần"] },
      { en: "Ich werde ernsthafter Deutsch lernen.", vi: "Tôi sẽ học tiếng Đức nghiêm túc hơn.", pronunciation_focus: ["werde → vê-đờ", "ernsthafter → én-xt-háp-tờ", "lernen → lé-nần"] },
      { en: "Wann wirst du in den Urlaub fahren?", vi: "Bạn sẽ đi nghỉ mát khi nào?", pronunciation_focus: ["wirst → vi-xt", "Urlaub → ua-laop", "fahren → pha-rần"] },
    ],
    cultural_notes_vi: "Người Đức nói về tương lai thường dùng thì hiện tại + trạng từ thời gian (morgen, nächste Woche) thay vì Futur I (werden + nguyên mẫu). 'Ich fahre morgen nach Berlin' (tôi đi Berlin ngày mai) nghe tự nhiên hơn 'Ich werde morgen nach Berlin fahren'. Futur I dùng nhiều hơn cho dự đoán hoặc lời hứa.",
    tip_advice_vi: "Công thức tương lai đơn giản: thì hiện tại + từ chỉ thời gian tương lai. Đây là cách người Đức nói hàng ngày! Ví dụ: 'Morgen gehe ich einkaufen' (ngày mai tôi đi mua sắm). Futur I (werden + nguyên mẫu) dùng khi bạn muốn nhấn mạnh ý định hoặc dự đoán.",
    vocabulary: [
      { word: "heute Abend", en: "tonight", vi: "tối nay", pos: "adverb", pronunciation_vi: "HOI-tờ A-bần" },
      { word: "morgen", en: "tomorrow", vi: "ngày mai", pos: "adverb", pronunciation_vi: "MÓ-ghần — 'g' cứng" },
      { word: "nächste Woche", en: "next week", vi: "tuần tới", pos: "phrase", pronunciation_vi: "NÉCH-xtờ VO-chờ" },
      { word: "nächstes Jahr", en: "next year", vi: "năm tới", pos: "phrase", pronunciation_vi: "NÉCH-xtớt YA — 'J' đọc 'y'" },
      { word: "bald", en: "soon", vi: "sớm", pos: "adverb", pronunciation_vi: "BĂN-T — 'al' đọc 'ăn'" },
      { word: "später", en: "later", vi: "sau / lát nữa", pos: "adverb", pronunciation_vi: "S-PÉ-tờ — 'ä' đọc 'ê' mở" },
      { word: "umziehen", en: "to move (house)", vi: "chuyển nhà", pos: "verb", pronunciation_vi: "ÚM-xi-ần — tách: ziehen... um" },
      { word: "studieren", en: "to study (university)", vi: "học đại học", pos: "verb", pronunciation_vi: "s-tu-ĐI-rần" },
      { word: "lernen", en: "to learn", vi: "học", pos: "verb", pronunciation_vi: "LÉ-nần" },
      { word: "sparen", en: "to save (money)", vi: "tiết kiệm", pos: "verb", pronunciation_vi: "S-PA-rần — 'a' dài" },
    ],
    dialogue: [
      { speaker: "A", text: "Hast du Pläne für den Urlaub?", vi: "Bạn có kế hoạch gì cho kỳ nghỉ không?" },
      { speaker: "B", text: "Ja, ich fahre nach Vietnam!", vi: "Có, tôi sẽ đi Việt Nam!" },
      { speaker: "A", text: "Super! Wie lange bleibst du?", vi: "Tuyệt! Bạn sẽ ở bao lâu?" },
      { speaker: "B", text: "Drei Wochen, ich freue mich schon so!", vi: "Ba tuần, nóng lòng quá!" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền dạng đúng của 'werden' hoặc dùng hiện tại:",
        pronunciation_focus: ["Zukunft"],
        items: [
          { prompt: "Morgen ___ ich nach Berlin. (fahren - hiện tại)", answer: "fahre" },
          { prompt: "Nächstes Jahr ___ wir ein Haus kaufen. (werden)", answer: "werden" },
          { prompt: "Was ___ du heute Abend? (machen - hiện tại)", answer: "machst" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối câu hỏi với câu trả lời:",
        pronunciation_focus: ["Pläne"],
        items: [
          { prompt: "Was machst du heute Abend?", answer: "Ich ruhe mich aus." },
          { prompt: "Wohin fahrt ihr in den Urlaub?", answer: "Wir fahren ans Meer." },
          { prompt: "Was wird sie studieren?", answer: "Sie wird Medizin studieren." },
          { prompt: "Wann ziehst du um?", answer: "Ich ziehe nächstes Jahr um." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: ["Zukunft / Präsens"],
        items: [
          { prompt: "Tối nay tôi sẽ xem phim.", answer: "Heute Abend sehe ich einen Film." },
          { prompt: "Năm tới họ sẽ đi Pháp.", answer: "Nächstes Jahr fahren sie nach Frankreich." },
          { prompt: "Bạn sẽ học tiếng Đức chứ?", answer: "Wirst du Deutsch lernen?" },
        ],
      },
    ],
  },
];

// ── 21–25. Workplace ────────────────────────────────────────────────────

const WORKPLACE: GermanLesson[] = [
  {
    id: "german_office_basics",
    level: "A2",
    category: "workplace",
    title_vi: "Văn phòng cơ bản",
    title_en: "Office basics",
    sentences: [
      {
        en: "Ich arbeite in einem Büro im Stadtzentrum.",
        vi: "Tôi làm việc ở văn phòng trung tâm thành phố.",
        pronunciation_focus: ["Büro → BUY-rô — 'ü' tròn môi", "Stadt → SHTÁT", "ch → khờ nhẹ"],
      },
      {
        en: "Mein Schreibtisch ist neben dem Fenster.",
        vi: "Bàn làm việc của tôi cạnh cửa sổ.",
        pronunciation_focus: ["Schreibtisch → SHRAI-bờ-tish", "ei → ai", "Fenster → PHEN-stờ"],
      },
      {
        en: "Ich beginne um neun Uhr und gehe um siebzehn Uhr nach Hause.",
        vi: "Tôi bắt đầu lúc 9 giờ và về nhà lúc 17 giờ.",
        pronunciation_focus: ["beginne → bờ-GHIN-nờ", "neun → nóin", "siebzehn → ZÍP-tsên"],
      },
      {
        en: "Wir haben jeden Montag eine Besprechung.",
        vi: "Chúng tôi có cuộc họp vào mỗi thứ Hai.",
        pronunciation_focus: ["jeden → IÊ-đần", "Montag → MÔN-tác", "Besprechung → bờ-SHPRÊ-khung"],
      },
      {
        en: "Mein Kollege hilft mir oft mit dem Computer.",
        vi: "Đồng nghiệp giúp tôi nhiều với máy tính.",
        pronunciation_focus: ["Kollege → cô-LÊ-gờ", "hilft → HIN-phờ", "Computer → côm-PIU-tờ"],
      },
    ],
    cultural_notes_vi:
      "Văn phòng Đức coi trọng đúng giờ tuyệt đối. Đến trễ 5 phút đã bị coi là thiếu chuyên nghiệp. Người Đức gõ cửa trước khi vào phòng đồng nghiệp, kể cả khi cửa mở. Xưng hô: dùng 'Sie' (ngài/bà) với đồng nghiệp mới và sếp cho đến khi được mời chuyển sang 'du'.",
    tip_advice_vi:
      "Học giống danh từ cùng với từ vựng — der/die/das luôn đi kèm. 'der Chef' (sếp nam) vs 'die Chefin' (sếp nữ) — tiếng Đức phân giới tính nghề nghiệp rõ ràng. Khi không chắc giới tính, dùng dạng nam như mặc định.",
    vocabulary: [
      { word: "das Büro", en: "office", vi: "văn phòng", pos: "noun (n)", pronunciation_vi: "đát BUY-rô — 'ü' tròn môi" },
      { word: "der Schreibtisch", en: "desk", vi: "bàn làm việc", pos: "noun (m)", pronunciation_vi: "đe-a SHRAI-bờ-tish" },
      { word: "der Computer", en: "computer", vi: "máy tính", pos: "noun (m)", pronunciation_vi: "đe-a côm-PIU-tờ" },
      { word: "der Kollege", en: "colleague (m)", vi: "đồng nghiệp nam", pos: "noun (m)", pronunciation_vi: "đe-a cô-LÊ-gờ" },
      { word: "die Kollegin", en: "colleague (f)", vi: "đồng nghiệp nữ", pos: "noun (f)", pronunciation_vi: "đi cô-LÊ-ghin" },
      { word: "die Besprechung", en: "meeting", vi: "cuộc họp", pos: "noun (f)", pronunciation_vi: "đi bờ-SHPRÊ-khung" },
      { word: "der Chef", en: "boss (m)", vi: "sếp nam", pos: "noun (m)", pronunciation_vi: "đe-a SHEPH" },
      { word: "die Chefin", en: "boss (f)", vi: "sếp nữ", pos: "noun (f)", pronunciation_vi: "đi SHE-phin" },
      { word: "arbeiten", en: "to work", vi: "làm việc", pos: "verb", pronunciation_vi: "A-bai-tần" },
      { word: "anfangen", en: "to start", vi: "bắt đầu", pos: "verb (separable)", pronunciation_vi: "AN-phan-gần" },
    ],
    dialogue: [
      { speaker: "A", text: "Wo arbeitest du?", vi: "Bạn làm việc ở đâu?" },
      { speaker: "B", text: "Ich arbeite in einem kleinen Büro in Berlin.", vi: "Tôi làm việc ở một văn phòng nhỏ ở Berlin." },
      { speaker: "A", text: "Wann beginnst du?", vi: "Bạn bắt đầu lúc mấy giờ?" },
      { speaker: "B", text: "Um neun Uhr. Wir haben jeden Tag eine kurze Besprechung.", vi: "Lúc 9 giờ. Chúng tôi họp ngắn mỗi ngày." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về văn phòng:",
        pronunciation_focus: ["chú ý giống danh từ"],
        items: [
          { prompt: "Mein _____ ist groß und hell. (văn phòng)", answer: "Büro" },
          { prompt: "Der _____ ist sehr nett. (sếp nam)", answer: "Chef" },
          { prompt: "Wir haben eine _____. (cuộc họp)", answer: "Besprechung" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ tiếng Đức với nghĩa tiếng Việt:",
        pronunciation_focus: [],
        items: [
          { prompt: "der Schreibtisch", answer: "bàn làm việc" },
          { prompt: "die Kollegin", answer: "đồng nghiệp nữ" },
          { prompt: "arbeiten", answer: "làm việc" },
          { prompt: "anfangen", answer: "bắt đầu" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Tôi làm việc trong văn phòng.", answer: "Ich arbeite im Büro." },
          { prompt: "Sếp của tôi rất tốt.", answer: "Mein Chef ist sehr nett." },
          { prompt: "Chúng tôi có cuộc họp.", answer: "Wir haben eine Besprechung." },
        ],
      },
    ],
  },
  {
    id: "german_email_phone",
    level: "A2",
    category: "workplace",
    title_vi: "Email và điện thoại",
    title_en: "Email and phone",
    sentences: [
      {
        en: "Ich schreibe Ihnen wegen unseres Termins.",
        vi: "Tôi viết cho bạn về cuộc hẹn của chúng ta.",
        pronunciation_focus: ["schreibe → SHRAI-bờ", "Ihnen → I-nần — 'Sie' lịch sự", "Termins → TE-mins"],
      },
      {
        en: "Mit freundlichen Grüßen, Anna Müller.",
        vi: "Trân trọng, Anna Müller.",
        pronunciation_focus: ["freundlichen → PHROIN-lị-khần", "Grüßen → GRUY-sần — 'ß' = ss", "ü → uy tròn"],
      },
      {
        en: "Können Sie mich bitte zurückrufen?",
        vi: "Bạn có thể gọi lại cho tôi được không?",
        pronunciation_focus: ["Können → KƠN-nần — 'ö' tròn", "zurückrufen → tsu-RUYC-ru-phần", "ü → uy"],
      },
      {
        en: "Ich rufe später noch einmal an.",
        vi: "Tôi sẽ gọi lại lần nữa sau.",
        pronunciation_focus: ["rufe → RU-phờ", "später → SHPÊ-tờ", "anrufen tách ra: rufe ... an"],
      },
      {
        en: "Bitte senden Sie mir die Datei per Email.",
        vi: "Xin gửi file cho tôi qua email.",
        pronunciation_focus: ["senden → ZEN-đần", "Datei → đa-TAI", "Email → Ê-mây — đọc gần như tiếng Anh"],
      },
    ],
    cultural_notes_vi:
      "Email công việc Đức rất trang trọng. Mở đầu bằng 'Sehr geehrte/r' (kính gửi) cho người chưa quen, 'Liebe/r' (thân mến) cho đồng nghiệp. Kết thúc luôn dùng 'Mit freundlichen Grüßen' (trân trọng) — cụm này gần như bắt buộc. Người Đức trả lời email trong giờ làm việc, hiếm khi cuối tuần.",
    tip_advice_vi:
      "Động từ tách (separable verbs) như 'anrufen', 'zurückrufen' khi chia: 'Ich rufe an', 'Sie ruft zurück' — phần 'an'/'zurück' nhảy ra cuối câu. Đây là đặc điểm độc đáo của tiếng Đức, cần luyện nhiều.",
    vocabulary: [
      { word: "die Email", en: "email", vi: "email", pos: "noun (f)", pronunciation_vi: "đi Ê-mây" },
      { word: "das Telefon", en: "telephone", vi: "điện thoại", pos: "noun (n)", pronunciation_vi: "đát tê-lê-PHÔN" },
      { word: "der Termin", en: "appointment", vi: "cuộc hẹn", pos: "noun (m)", pronunciation_vi: "đe-a TE-min" },
      { word: "die Datei", en: "file", vi: "file/tệp", pos: "noun (f)", pronunciation_vi: "đi đa-TAI" },
      { word: "die Nachricht", en: "message", vi: "tin nhắn", pos: "noun (f)", pronunciation_vi: "đi NÁC-rịt" },
      { word: "schreiben", en: "to write", vi: "viết", pos: "verb", pronunciation_vi: "SHRAI-bần" },
      { word: "anrufen", en: "to call", vi: "gọi điện", pos: "verb (separable)", pronunciation_vi: "AN-ru-phần" },
      { word: "zurückrufen", en: "to call back", vi: "gọi lại", pos: "verb (separable)", pronunciation_vi: "tsu-RUYC-ru-phần" },
      { word: "senden", en: "to send", vi: "gửi", pos: "verb", pronunciation_vi: "ZEN-đần" },
      { word: "antworten", en: "to reply", vi: "trả lời", pos: "verb", pronunciation_vi: "ANT-vo-tần" },
    ],
    dialogue: [
      { speaker: "A", text: "Guten Tag, hier ist Anna Schmidt. Kann ich bitte mit Herrn Müller sprechen?", vi: "Xin chào, đây là Anna Schmidt. Tôi có thể nói chuyện với ông Müller được không?" },
      { speaker: "B", text: "Einen Moment bitte. Er ist gerade nicht da.", vi: "Xin chờ một lát. Ông ấy không có ở đây ngay bây giờ." },
      { speaker: "A", text: "Können Sie ihm bitte sagen, dass ich angerufen habe?", vi: "Xin nói với ông ấy là tôi đã gọi được không?" },
      { speaker: "B", text: "Natürlich. Ich gebe ihm Ihre Nachricht.", vi: "Tất nhiên. Tôi sẽ chuyển tin nhắn của bạn." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền động từ phù hợp:",
        pronunciation_focus: ["động từ tách (separable verbs)"],
        items: [
          { prompt: "Ich _____ Ihnen eine Email. (gửi)", answer: "sende" },
          { prompt: "Können Sie mich _____? (gọi lại)", answer: "zurückrufen" },
          { prompt: "Ich _____ später noch einmal _____. (gọi điện)", answer: "rufe ... an" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ tiếng Đức với nghĩa tiếng Việt:",
        pronunciation_focus: [],
        items: [
          { prompt: "die Datei", answer: "file/tệp" },
          { prompt: "der Termin", answer: "cuộc hẹn" },
          { prompt: "antworten", answer: "trả lời" },
          { prompt: "Mit freundlichen Grüßen", answer: "trân trọng" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Tôi viết email cho bạn.", answer: "Ich schreibe Ihnen eine Email." },
          { prompt: "Xin gọi lại cho tôi.", answer: "Bitte rufen Sie mich zurück." },
          { prompt: "Ông ấy không có ở đây.", answer: "Er ist nicht da." },
        ],
      },
    ],
  },
  {
    id: "german_meetings",
    level: "A2",
    category: "workplace",
    title_vi: "Họp hành",
    title_en: "Meetings",
    sentences: [
      {
        en: "Die Besprechung beginnt um zehn Uhr.",
        vi: "Cuộc họp bắt đầu lúc 10 giờ.",
        pronunciation_focus: ["Besprechung → bờ-SHPRÊ-khung", "beginnt → bờ-GHINT", "zehn → tsên"],
      },
      {
        en: "Ich möchte einen Punkt hinzufügen.",
        vi: "Tôi muốn thêm một điểm.",
        pronunciation_focus: ["möchte → MƠỊC-tờ — 'ö' tròn ngắn", "Punkt → PUNG-kt", "hinzufügen → HIN-tsu-phuy-gần"],
      },
      {
        en: "Sind alle einverstanden?",
        vi: "Tất cả có đồng ý không?",
        pronunciation_focus: ["alle → A-lờ", "einverstanden → AIN-phờ-shtan-đần", "ei → ai"],
      },
      {
        en: "Wir müssen eine Entscheidung treffen.",
        vi: "Chúng ta cần đưa ra quyết định.",
        pronunciation_focus: ["müssen → MUYS-sần — 'ü' tròn", "Entscheidung → ent-SHAI-đung", "treffen → TRE-phần"],
      },
      {
        en: "Die Sitzung ist beendet. Vielen Dank.",
        vi: "Cuộc họp kết thúc. Cám ơn rất nhiều.",
        pronunciation_focus: ["Sitzung → ZÍT-tsung", "beendet → bờ-ÊN-đết", "Vielen Dank → PHÍ-lần đank"],
      },
    ],
    cultural_notes_vi:
      "Họp hành ở Đức luôn có chương trình (Tagesordnung) gửi trước. Mọi người chuẩn bị kỹ và phát biểu thẳng vào vấn đề — không vòng vo. Bất đồng ý kiến được coi là bình thường và lành mạnh, không phải xung đột cá nhân. Ghi biên bản (Protokoll) là chuẩn mực.",
    tip_advice_vi:
      "'Ich bin einverstanden' (tôi đồng ý) lịch sự hơn 'Ja'. Trong họp công việc, dùng cách diễn đạt formal: 'Ich möchte vorschlagen' (tôi muốn đề xuất) thay vì 'Ich will' (tôi muốn). Tránh 'will' trong văn cảnh formal — nghe ra mệnh lệnh.",
    vocabulary: [
      { word: "die Sitzung", en: "session/meeting", vi: "phiên họp", pos: "noun (f)", pronunciation_vi: "đi ZÍT-tsung" },
      { word: "die Tagesordnung", en: "agenda", vi: "chương trình họp", pos: "noun (f)", pronunciation_vi: "đi TÁ-gờs-ót-nung" },
      { word: "der Vorschlag", en: "suggestion", vi: "đề xuất", pos: "noun (m)", pronunciation_vi: "đe-a PHÔ-shlác" },
      { word: "die Entscheidung", en: "decision", vi: "quyết định", pos: "noun (f)", pronunciation_vi: "đi ent-SHAI-đung" },
      { word: "die Frage", en: "question", vi: "câu hỏi", pos: "noun (f)", pronunciation_vi: "đi PHRA-gờ" },
      { word: "diskutieren", en: "to discuss", vi: "thảo luận", pos: "verb", pronunciation_vi: "đi-scu-TI-rần" },
      { word: "vorschlagen", en: "to suggest", vi: "đề xuất", pos: "verb (separable)", pronunciation_vi: "PHÔ-shla-gần" },
      { word: "zustimmen", en: "to agree", vi: "đồng ý", pos: "verb (separable)", pronunciation_vi: "TSU-shtim-mần" },
      { word: "ablehnen", en: "to reject", vi: "từ chối", pos: "verb (separable)", pronunciation_vi: "AP-lê-nần" },
      { word: "einverstanden", en: "agreed", vi: "đồng ý", pos: "adjective", pronunciation_vi: "AIN-phờ-shtan-đần" },
    ],
    dialogue: [
      { speaker: "A", text: "Ich schlage vor, dass wir das Projekt im Mai starten.", vi: "Tôi đề xuất bắt đầu dự án vào tháng 5." },
      { speaker: "B", text: "Das ist zu früh. Können wir bis Juni warten?", vi: "Sớm quá. Chúng ta có thể đợi đến tháng 6 không?" },
      { speaker: "A", text: "Gut, dann beginnen wir am ersten Juni.", vi: "Được, vậy chúng ta bắt đầu ngày 1 tháng 6." },
      { speaker: "B", text: "Einverstanden. Ich notiere das.", vi: "Đồng ý. Tôi sẽ ghi lại." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ vựng họp hành:",
        pronunciation_focus: [],
        items: [
          { prompt: "Wir müssen eine _____ treffen. (quyết định)", answer: "Entscheidung" },
          { prompt: "Ich habe einen _____. (đề xuất)", answer: "Vorschlag" },
          { prompt: "Sind alle _____? (đồng ý)", answer: "einverstanden" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối động từ với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "diskutieren", answer: "thảo luận" },
          { prompt: "zustimmen", answer: "đồng ý" },
          { prompt: "ablehnen", answer: "từ chối" },
          { prompt: "vorschlagen", answer: "đề xuất" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Cuộc họp bắt đầu lúc 10 giờ.", answer: "Die Besprechung beginnt um zehn Uhr." },
          { prompt: "Tôi đồng ý.", answer: "Ich bin einverstanden." },
          { prompt: "Cám ơn rất nhiều.", answer: "Vielen Dank." },
        ],
      },
    ],
  },
  {
    id: "german_job_interview",
    level: "A2",
    category: "workplace",
    title_vi: "Phỏng vấn xin việc",
    title_en: "Job interview",
    sentences: [
      {
        en: "Ich interessiere mich für die Stelle als Ingenieur.",
        vi: "Tôi quan tâm đến vị trí kỹ sư.",
        pronunciation_focus: ["interessiere → in-tê-RES-si-rờ", "Stelle → SHTE-lờ", "Ingenieur → in-djê-NIƠA"],
      },
      {
        en: "Ich habe fünf Jahre Berufserfahrung.",
        vi: "Tôi có 5 năm kinh nghiệm làm việc.",
        pronunciation_focus: ["fünf → PHUYNF — 'ü' tròn", "Jahre → IÁ-rờ", "Berufserfahrung → bờ-RUPHS-ê-pha-rung"],
      },
      {
        en: "Meine Stärken sind Teamarbeit und Pünktlichkeit.",
        vi: "Điểm mạnh của tôi là làm việc nhóm và đúng giờ.",
        pronunciation_focus: ["Stärken → SHTE-kần — 'ä' = e", "Teamarbeit → TIM-a-bait", "Pünktlichkeit → PUYNG-lị-khait"],
      },
      {
        en: "Wann kann ich anfangen?",
        vi: "Khi nào tôi có thể bắt đầu?",
        pronunciation_focus: ["Wann → vAN", "anfangen → AN-phan-gần", "động từ tách"],
      },
      {
        en: "Vielen Dank für das Gespräch.",
        vi: "Cám ơn vì cuộc trò chuyện.",
        pronunciation_focus: ["Vielen → PHÍ-lần", "Gespräch → gơ-SHPREỊC — 'ä' = e", "Dank → đank"],
      },
    ],
    cultural_notes_vi:
      "Người Đức trong phỏng vấn coi trọng sự thật trên hết. Đừng phóng đại kinh nghiệm hay kỹ năng — họ sẽ kiểm tra. Câu hỏi 'Stärken und Schwächen' (điểm mạnh, điểm yếu) gần như chắc chắn xuất hiện. Trả lời điểm yếu phải thật, kèm cách bạn đang khắc phục.",
    tip_advice_vi:
      "Tiếng Đức formal trong phỏng vấn: dùng 'Sie' (ngài/bà), không bao giờ 'du'. Bắt tay khi vào và ra. Đến trước 5-10 phút (không sớm hơn). 'Ich freue mich auf Ihre Rückmeldung' (tôi mong nhận được phản hồi) là câu kết thúc lịch sự.",
    vocabulary: [
      { word: "die Stelle", en: "position/job", vi: "vị trí công việc", pos: "noun (f)", pronunciation_vi: "đi SHTE-lờ" },
      { word: "der Beruf", en: "profession", vi: "nghề nghiệp", pos: "noun (m)", pronunciation_vi: "đe-a bờ-RUPH" },
      { word: "die Erfahrung", en: "experience", vi: "kinh nghiệm", pos: "noun (f)", pronunciation_vi: "đi ê-PHA-rung" },
      { word: "die Stärke", en: "strength", vi: "điểm mạnh", pos: "noun (f)", pronunciation_vi: "đi SHTE-cờ" },
      { word: "die Schwäche", en: "weakness", vi: "điểm yếu", pos: "noun (f)", pronunciation_vi: "đi SHVE-khờ" },
      { word: "der Lebenslauf", en: "CV/resume", vi: "sơ yếu lý lịch", pos: "noun (m)", pronunciation_vi: "đe-a LÊ-bần-lao-phờ" },
      { word: "die Bewerbung", en: "application", vi: "đơn xin việc", pos: "noun (f)", pronunciation_vi: "đi bờ-VEA-bung" },
      { word: "das Gespräch", en: "conversation/interview", vi: "buổi trò chuyện/phỏng vấn", pos: "noun (n)", pronunciation_vi: "đát gơ-SHPREỊC" },
      { word: "sich bewerben", en: "to apply", vi: "ứng tuyển", pos: "reflexive verb", pronunciation_vi: "zịc bờ-VEA-bần" },
      { word: "anfangen", en: "to start", vi: "bắt đầu", pos: "verb (separable)", pronunciation_vi: "AN-phan-gần" },
    ],
    dialogue: [
      { speaker: "A", text: "Erzählen Sie mir bitte etwas über sich.", vi: "Xin kể cho tôi đôi điều về bạn." },
      { speaker: "B", text: "Ich heiße Linh und komme aus Vietnam. Ich bin Software-Entwicklerin.", vi: "Tôi tên Linh, đến từ Việt Nam. Tôi là lập trình viên phần mềm." },
      { speaker: "A", text: "Warum wollen Sie bei uns arbeiten?", vi: "Tại sao bạn muốn làm việc với chúng tôi?" },
      { speaker: "B", text: "Ihr Unternehmen ist innovativ und ich möchte mich weiterentwickeln.", vi: "Công ty của bạn rất sáng tạo và tôi muốn phát triển bản thân thêm." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về phỏng vấn:",
        pronunciation_focus: [],
        items: [
          { prompt: "Ich habe drei Jahre _____. (kinh nghiệm)", answer: "Erfahrung" },
          { prompt: "Meine _____ ist Pünktlichkeit. (điểm mạnh)", answer: "Stärke" },
          { prompt: "Ich interessiere mich für die _____. (vị trí)", answer: "Stelle" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "der Lebenslauf", answer: "sơ yếu lý lịch" },
          { prompt: "die Bewerbung", answer: "đơn xin việc" },
          { prompt: "der Beruf", answer: "nghề nghiệp" },
          { prompt: "sich bewerben", answer: "ứng tuyển" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Tôi có 5 năm kinh nghiệm.", answer: "Ich habe fünf Jahre Erfahrung." },
          { prompt: "Khi nào tôi có thể bắt đầu?", answer: "Wann kann ich anfangen?" },
          { prompt: "Cám ơn vì cuộc phỏng vấn.", answer: "Vielen Dank für das Gespräch." },
        ],
      },
    ],
  },
  {
    id: "german_workplace_problems",
    level: "A2",
    category: "workplace",
    title_vi: "Vấn đề công sở",
    title_en: "Workplace problems",
    sentences: [
      {
        en: "Ich habe heute viel zu tun.",
        vi: "Hôm nay tôi có nhiều việc phải làm.",
        pronunciation_focus: ["heute → HÔI-tờ", "viel → PHÍN", "zu tun → tsu TUN"],
      },
      {
        en: "Der Drucker funktioniert nicht.",
        vi: "Máy in không hoạt động.",
        pronunciation_focus: ["Drucker → ĐRUC-cờ", "funktioniert → phung-tsi-Ô-nịt", "nicht → nịt"],
      },
      {
        en: "Ich kann den Termin leider nicht halten.",
        vi: "Tiếc là tôi không thể giữ cuộc hẹn.",
        pronunciation_focus: ["leider → LAI-đờ", "Termin → TE-min", "halten → HAN-tần"],
      },
      {
        en: "Können Sie mir mit diesem Problem helfen?",
        vi: "Bạn có thể giúp tôi với vấn đề này không?",
        pronunciation_focus: ["Können → KƠN-nần", "Problem → prô-BLÊM", "helfen → HEN-phần"],
      },
      {
        en: "Tut mir leid, ich habe einen Fehler gemacht.",
        vi: "Xin lỗi, tôi đã mắc lỗi.",
        pronunciation_focus: ["Tut mir leid → TÚT mia LAI", "Fehler → PHÊ-lờ", "gemacht → gơ-MÁCT"],
      },
    ],
    cultural_notes_vi:
      "Người Đức công sở nói thẳng vấn đề — không vòng vo. Mắc lỗi, hãy thừa nhận sớm và đề xuất cách khắc phục: 'Ich habe einen Fehler gemacht. Wie kann ich es korrigieren?' (Tôi đã mắc lỗi. Tôi có thể sửa thế nào?). Che giấu lỗi bị coi là tệ hơn lỗi gốc.",
    tip_advice_vi:
      "'Tut mir leid' (xin lỗi) cho lỗi nhỏ hàng ngày. 'Es tut mir sehr leid' (rất xin lỗi) cho lỗi nghiêm trọng. Với cấp trên hoặc tình huống formal, dùng 'Ich entschuldige mich' (tôi xin lỗi). Đừng dùng 'Sorry' — người Đức coi đó là không nghiêm túc.",
    vocabulary: [
      { word: "das Problem", en: "problem", vi: "vấn đề", pos: "noun (n)", pronunciation_vi: "đát prô-BLÊM" },
      { word: "der Fehler", en: "mistake", vi: "lỗi", pos: "noun (m)", pronunciation_vi: "đe-a PHÊ-lờ" },
      { word: "der Stress", en: "stress", vi: "căng thẳng", pos: "noun (m)", pronunciation_vi: "đe-a SHTRES" },
      { word: "die Verspätung", en: "delay", vi: "trễ giờ", pos: "noun (f)", pronunciation_vi: "đi phê-SHPÊ-tung" },
      { word: "die Frist", en: "deadline", vi: "hạn chót", pos: "noun (f)", pronunciation_vi: "đi PHRIST" },
      { word: "helfen", en: "to help", vi: "giúp đỡ", pos: "verb", pronunciation_vi: "HEN-phần" },
      { word: "funktionieren", en: "to function", vi: "hoạt động", pos: "verb", pronunciation_vi: "phung-tsi-Ô-ni-rần" },
      { word: "reparieren", en: "to repair", vi: "sửa chữa", pos: "verb", pronunciation_vi: "rê-pa-RI-rần" },
      { word: "krank", en: "sick", vi: "ốm", pos: "adjective", pronunciation_vi: "krank" },
      { word: "müde", en: "tired", vi: "mệt", pos: "adjective", pronunciation_vi: "MUY-đờ — 'ü' tròn" },
    ],
    dialogue: [
      { speaker: "A", text: "Was ist los? Du siehst müde aus.", vi: "Có chuyện gì? Bạn trông mệt mỏi." },
      { speaker: "B", text: "Ich habe heute zu viel zu tun und der Drucker funktioniert nicht.", vi: "Hôm nay tôi có quá nhiều việc và máy in không hoạt động." },
      { speaker: "A", text: "Soll ich dir helfen?", vi: "Tôi giúp bạn nhé?" },
      { speaker: "B", text: "Ja bitte, das wäre toll.", vi: "Vâng, được vậy thì tuyệt." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về vấn đề:",
        pronunciation_focus: [],
        items: [
          { prompt: "Ich habe einen _____ gemacht. (lỗi)", answer: "Fehler" },
          { prompt: "Der Drucker _____ nicht. (hoạt động)", answer: "funktioniert" },
          { prompt: "Tut mir _____. (xin lỗi)", answer: "leid" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "die Frist", answer: "hạn chót" },
          { prompt: "krank", answer: "ốm" },
          { prompt: "müde", answer: "mệt" },
          { prompt: "helfen", answer: "giúp đỡ" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Tôi có quá nhiều việc.", answer: "Ich habe zu viel zu tun." },
          { prompt: "Bạn có thể giúp tôi không?", answer: "Können Sie mir helfen?" },
          { prompt: "Tôi đã mắc lỗi.", answer: "Ich habe einen Fehler gemacht." },
        ],
      },
    ],
  },
];

// ── 26–30. Life admin ───────────────────────────────────────────────────

const LIFE_ADMIN: GermanLesson[] = [
  {
    id: "german_bank",
    level: "A2",
    category: "life_admin",
    title_vi: "Ngân hàng",
    title_en: "Bank",
    sentences: [
      {
        en: "Ich möchte ein Konto eröffnen.",
        vi: "Tôi muốn mở tài khoản.",
        pronunciation_focus: ["möchte → MƠỊC-tờ", "Konto → CÔN-tô", "eröffnen → ê-RƠPH-nần — 'ö' tròn"],
      },
      {
        en: "Wo ist der nächste Geldautomat?",
        vi: "Máy ATM gần nhất ở đâu?",
        pronunciation_focus: ["nächste → NEỊC-stờ", "Geldautomat → GHEN-au-tô-mát", "ä → e"],
      },
      {
        en: "Ich brauche einen Termin mit dem Berater.",
        vi: "Tôi cần hẹn với nhân viên tư vấn.",
        pronunciation_focus: ["brauche → BRAO-khờ", "Termin → TE-min", "Berater → bờ-RA-tờ"],
      },
      {
        en: "Können Sie mir bitte fünfzig Euro wechseln?",
        vi: "Xin đổi giúp tôi 50 euro?",
        pronunciation_focus: ["fünfzig → PHUYNF-tsịc — 'ü' tròn", "wechseln → VEK-zần", "ch → khờ nhẹ"],
      },
      {
        en: "Mein Geld ist auf dem Sparkonto.",
        vi: "Tiền của tôi ở tài khoản tiết kiệm.",
        pronunciation_focus: ["Geld → GHEN-t", "Sparkonto → SHPÁ-côn-tô", "auf dem → ao-phờ đêm"],
      },
    ],
    cultural_notes_vi:
      "Đức vẫn dùng nhiều tiền mặt hơn các nước phát triển khác — nhiều quán cafe, tiệm bánh chỉ nhận tiền mặt (Bargeld). Mở tài khoản ngân hàng cần Ausweis (giấy tờ tuỳ thân) và Anmeldung (đăng ký cư trú). EC-Karte (thẻ ghi nợ) phổ biến hơn thẻ tín dụng.",
    tip_advice_vi:
      "Số tiền lớn nói theo cấu trúc Đức: 'fünfzig Euro' (50 euro), 'hundert Euro' (100 euro). Số 21 trở lên đảo: 'einundzwanzig' (1 và 20 = 21). Quen với cách đảo này khi đọc số tiền sẽ giúp bạn tự tin hơn.",
    vocabulary: [
      { word: "die Bank", en: "bank", vi: "ngân hàng", pos: "noun (f)", pronunciation_vi: "đi BANK" },
      { word: "das Konto", en: "account", vi: "tài khoản", pos: "noun (n)", pronunciation_vi: "đát CÔN-tô" },
      { word: "das Geld", en: "money", vi: "tiền", pos: "noun (n)", pronunciation_vi: "đát GHEN-t" },
      { word: "der Geldautomat", en: "ATM", vi: "máy ATM", pos: "noun (m)", pronunciation_vi: "đe-a GHEN-au-tô-mát" },
      { word: "die Karte", en: "card", vi: "thẻ", pos: "noun (f)", pronunciation_vi: "đi CÁ-tờ" },
      { word: "die Überweisung", en: "transfer", vi: "chuyển khoản", pos: "noun (f)", pronunciation_vi: "đi UY-bờ-vai-zung" },
      { word: "der Berater", en: "advisor", vi: "nhân viên tư vấn", pos: "noun (m)", pronunciation_vi: "đe-a bờ-RA-tờ" },
      { word: "eröffnen", en: "to open", vi: "mở", pos: "verb (separable)", pronunciation_vi: "ê-RƠPH-nần" },
      { word: "wechseln", en: "to exchange", vi: "đổi", pos: "verb", pronunciation_vi: "VEK-zần" },
      { word: "abheben", en: "to withdraw", vi: "rút (tiền)", pos: "verb (separable)", pronunciation_vi: "AP-hê-bần" },
    ],
    dialogue: [
      { speaker: "A", text: "Guten Tag, ich möchte ein Konto eröffnen.", vi: "Xin chào, tôi muốn mở tài khoản." },
      { speaker: "B", text: "Gerne. Haben Sie Ihren Ausweis dabei?", vi: "Vâng. Bạn có mang giấy tờ tuỳ thân không?" },
      { speaker: "A", text: "Ja, hier ist mein Reisepass.", vi: "Có, đây là hộ chiếu của tôi." },
      { speaker: "B", text: "Danke. Bitte füllen Sie dieses Formular aus.", vi: "Cám ơn. Xin điền vào mẫu này." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ ngân hàng:",
        pronunciation_focus: [],
        items: [
          { prompt: "Ich möchte ein _____ eröffnen. (tài khoản)", answer: "Konto" },
          { prompt: "Wo ist der _____? (máy ATM)", answer: "Geldautomat" },
          { prompt: "Ich brauche einen _____. (cuộc hẹn)", answer: "Termin" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "die Karte", answer: "thẻ" },
          { prompt: "die Überweisung", answer: "chuyển khoản" },
          { prompt: "abheben", answer: "rút tiền" },
          { prompt: "wechseln", answer: "đổi" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Tôi muốn rút 100 euro.", answer: "Ich möchte hundert Euro abheben." },
          { prompt: "Đây là thẻ của tôi.", answer: "Hier ist meine Karte." },
          { prompt: "Tôi cần đổi tiền.", answer: "Ich muss Geld wechseln." },
        ],
      },
    ],
  },
  {
    id: "german_post_office",
    level: "A2",
    category: "life_admin",
    title_vi: "Bưu điện",
    title_en: "Post office",
    sentences: [
      {
        en: "Ich möchte dieses Paket nach Vietnam schicken.",
        vi: "Tôi muốn gửi gói này đi Việt Nam.",
        pronunciation_focus: ["Paket → pa-KÊT", "Vietnam → VI-ết-nam", "schicken → SHIK-kần"],
      },
      {
        en: "Wie viel kostet es?",
        vi: "Cái này giá bao nhiêu?",
        pronunciation_focus: ["Wie → VI", "kostet → CÔS-tết", "es → es"],
      },
      {
        en: "Ich brauche fünf Briefmarken.",
        vi: "Tôi cần 5 con tem.",
        pronunciation_focus: ["fünf → PHUYNF", "Briefmarken → BRÍPH-mác-cần", "ie → i dài"],
      },
      {
        en: "Wann kommt das Paket an?",
        vi: "Khi nào gói hàng đến nơi?",
        pronunciation_focus: ["Wann → vAN", "ankommen tách: kommt ... an", "Paket → pa-KÊT"],
      },
      {
        en: "Per Luftpost dauert es eine Woche.",
        vi: "Gửi máy bay mất 1 tuần.",
        pronunciation_focus: ["Luftpost → LUPHT-pôst", "dauert → ĐAO-ợt", "Woche → VÔ-khờ"],
      },
    ],
    cultural_notes_vi:
      "Deutsche Post (DHL) là dịch vụ bưu chính chính ở Đức. Gửi quốc tế cần khai báo hải quan (Zollerklärung) cho gói hàng. Bưu điện Đức đóng cửa Chủ nhật và đóng sớm thứ Bảy. Nhiều bưu điện nhỏ nằm trong hiệu sách hoặc cửa hàng tạp hóa.",
    tip_advice_vi:
      "'Per Luftpost' (đường máy bay) nhanh nhưng đắt. 'Standard' rẻ hơn nhưng chậm 2-4 tuần đi châu Á. Khi điền địa chỉ Đức: tên đường + số nhà cùng dòng, mã bưu điện 5 số đứng trước tên thành phố ('10115 Berlin').",
    vocabulary: [
      { word: "die Post", en: "post office/mail", vi: "bưu điện/thư từ", pos: "noun (f)", pronunciation_vi: "đi PÔST" },
      { word: "das Paket", en: "package", vi: "gói hàng", pos: "noun (n)", pronunciation_vi: "đát pa-KÊT" },
      { word: "der Brief", en: "letter", vi: "thư", pos: "noun (m)", pronunciation_vi: "đe-a BRÍPH" },
      { word: "die Briefmarke", en: "stamp", vi: "tem", pos: "noun (f)", pronunciation_vi: "đi BRÍPH-mác-cờ" },
      { word: "die Adresse", en: "address", vi: "địa chỉ", pos: "noun (f)", pronunciation_vi: "đi a-ĐRES-sờ" },
      { word: "der Absender", en: "sender", vi: "người gửi", pos: "noun (m)", pronunciation_vi: "đe-a AP-zen-đờ" },
      { word: "der Empfänger", en: "recipient", vi: "người nhận", pos: "noun (m)", pronunciation_vi: "đe-a em-PHEN-gờ" },
      { word: "schicken", en: "to send", vi: "gửi", pos: "verb", pronunciation_vi: "SHIK-kần" },
      { word: "ankommen", en: "to arrive", vi: "đến nơi", pos: "verb (separable)", pronunciation_vi: "AN-côm-mần" },
      { word: "wiegen", en: "to weigh", vi: "cân", pos: "verb", pronunciation_vi: "VI-gần" },
    ],
    dialogue: [
      { speaker: "A", text: "Ich möchte diesen Brief nach Vietnam schicken.", vi: "Tôi muốn gửi thư này đi Việt Nam." },
      { speaker: "B", text: "Per Luftpost oder Standard?", vi: "Gửi máy bay hay tiêu chuẩn?" },
      { speaker: "A", text: "Per Luftpost bitte. Wie lange dauert das?", vi: "Máy bay nhé. Mất bao lâu?" },
      { speaker: "B", text: "Etwa eine Woche. Das macht drei Euro fünfzig.", vi: "Khoảng 1 tuần. Tổng cộng 3 euro 50." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ bưu điện:",
        pronunciation_focus: [],
        items: [
          { prompt: "Ich brauche eine _____. (con tem)", answer: "Briefmarke" },
          { prompt: "Wann kommt das _____ an? (gói hàng)", answer: "Paket" },
          { prompt: "Wie ist die _____? (địa chỉ)", answer: "Adresse" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "der Brief", answer: "thư" },
          { prompt: "der Absender", answer: "người gửi" },
          { prompt: "der Empfänger", answer: "người nhận" },
          { prompt: "schicken", answer: "gửi" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Cái này giá bao nhiêu?", answer: "Wie viel kostet es?" },
          { prompt: "Tôi cần 5 con tem.", answer: "Ich brauche fünf Briefmarken." },
          { prompt: "Mất khoảng 1 tuần.", answer: "Es dauert etwa eine Woche." },
        ],
      },
    ],
  },
  {
    id: "german_doctor_visit",
    level: "A2",
    category: "life_admin",
    title_vi: "Đi khám bác sĩ",
    title_en: "Doctor visit",
    sentences: [
      {
        en: "Ich habe einen Termin um zehn Uhr.",
        vi: "Tôi có cuộc hẹn lúc 10 giờ.",
        pronunciation_focus: ["Termin → TE-min", "zehn → tsên", "Uhr → UA"],
      },
      {
        en: "Mein Hals tut weh.",
        vi: "Cổ họng tôi đau.",
        pronunciation_focus: ["Hals → HALS", "tut → TÚT", "weh → VÊ"],
      },
      {
        en: "Ich habe seit drei Tagen Fieber.",
        vi: "Tôi sốt 3 ngày rồi.",
        pronunciation_focus: ["seit → ZAIT", "drei → ĐRAI", "Fieber → PHÍ-bờ"],
      },
      {
        en: "Können Sie mir ein Rezept geben?",
        vi: "Bạn có thể cho tôi đơn thuốc không?",
        pronunciation_focus: ["Können → KƠN-nần", "Rezept → rê-TSEPT", "geben → GHÊ-bần"],
      },
      {
        en: "Ich brauche eine Krankmeldung.",
        vi: "Tôi cần giấy nghỉ ốm.",
        pronunciation_focus: ["Krankmeldung → CRANG-men-đung", "brauche → BRAO-khờ", "ng → cuối lưỡi"],
      },
    ],
    cultural_notes_vi:
      "Đi khám ở Đức cần Versichertenkarte (thẻ bảo hiểm y tế) — luôn mang theo. Đặt Termin (hẹn) trước, đến đợi không hẹn (Sprechstunde) chỉ khi khẩn cấp. Krankmeldung (giấy nghỉ ốm) bắt buộc nếu ốm hơn 3 ngày — chủ lao động yêu cầu. Hausarzt (bác sĩ gia đình) là người đầu tiên bạn liên hệ, họ sẽ giới thiệu chuyên khoa nếu cần.",
    tip_advice_vi:
      "'Tut weh' (đau) đi với phần cơ thể: 'Mein Kopf tut weh' (đầu đau), 'Mein Bauch tut weh' (bụng đau). 'Schmerzen' (cơn đau) đi với danh từ ghép: 'Halsschmerzen' (đau họng), 'Kopfschmerzen' (đau đầu). Cả hai cấu trúc đều dùng được.",
    vocabulary: [
      { word: "der Arzt", en: "doctor (m)", vi: "bác sĩ nam", pos: "noun (m)", pronunciation_vi: "đe-a A-tst" },
      { word: "die Ärztin", en: "doctor (f)", vi: "bác sĩ nữ", pos: "noun (f)", pronunciation_vi: "đi E-tstin — 'ä' = e" },
      { word: "die Praxis", en: "doctor's office", vi: "phòng khám", pos: "noun (f)", pronunciation_vi: "đi PRA-xis" },
      { word: "das Rezept", en: "prescription", vi: "đơn thuốc", pos: "noun (n)", pronunciation_vi: "đát rê-TSEPT" },
      { word: "die Schmerzen", en: "pain", vi: "cơn đau", pos: "noun (pl)", pronunciation_vi: "đi SHMEA-tsần" },
      { word: "das Fieber", en: "fever", vi: "sốt", pos: "noun (n)", pronunciation_vi: "đát PHÍ-bờ" },
      { word: "die Krankmeldung", en: "sick note", vi: "giấy nghỉ ốm", pos: "noun (f)", pronunciation_vi: "đi CRANG-men-đung" },
      { word: "untersuchen", en: "to examine", vi: "khám", pos: "verb", pronunciation_vi: "un-tờ-ZU-khần" },
      { word: "wehtun", en: "to hurt", vi: "đau", pos: "verb (separable)", pronunciation_vi: "VÊ-tun" },
      { word: "krank", en: "sick", vi: "ốm", pos: "adjective", pronunciation_vi: "CRANK" },
    ],
    dialogue: [
      { speaker: "A", text: "Was kann ich für Sie tun?", vi: "Tôi có thể giúp gì cho bạn?" },
      { speaker: "B", text: "Ich habe seit zwei Tagen Halsschmerzen und Fieber.", vi: "Tôi đau họng và sốt 2 ngày rồi." },
      { speaker: "A", text: "Lassen Sie mich Sie untersuchen. Öffnen Sie bitte den Mund.", vi: "Để tôi khám. Xin há miệng ra." },
      { speaker: "B", text: "Brauche ich Antibiotika?", vi: "Tôi có cần thuốc kháng sinh không?" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về sức khoẻ:",
        pronunciation_focus: [],
        items: [
          { prompt: "Ich habe _____. (sốt)", answer: "Fieber" },
          { prompt: "Mein Kopf tut _____. (đau)", answer: "weh" },
          { prompt: "Ich brauche ein _____. (đơn thuốc)", answer: "Rezept" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "der Arzt", answer: "bác sĩ nam" },
          { prompt: "die Praxis", answer: "phòng khám" },
          { prompt: "krank", answer: "ốm" },
          { prompt: "die Krankmeldung", answer: "giấy nghỉ ốm" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Tôi có cuộc hẹn lúc 10 giờ.", answer: "Ich habe einen Termin um zehn Uhr." },
          { prompt: "Cổ họng tôi đau.", answer: "Mein Hals tut weh." },
          { prompt: "Tôi cần giấy nghỉ ốm.", answer: "Ich brauche eine Krankmeldung." },
        ],
      },
    ],
  },
  {
    id: "german_pharmacy",
    level: "A2",
    category: "life_admin",
    title_vi: "Hiệu thuốc",
    title_en: "Pharmacy",
    sentences: [
      {
        en: "Haben Sie etwas gegen Kopfschmerzen?",
        vi: "Bạn có thuốc gì cho đau đầu không?",
        pronunciation_focus: ["gegen → GHÊ-gần", "Kopfschmerzen → CỐP-shmea-tsần", "ch → khờ"],
      },
      {
        en: "Diese Tabletten nehmen Sie dreimal täglich.",
        vi: "Uống thuốc viên này 3 lần mỗi ngày.",
        pronunciation_focus: ["Tabletten → ta-BLET-tần", "dreimal → ĐRAI-mal", "täglich → TEỊC-lị — 'ä' = e"],
      },
      {
        en: "Ist das Medikament rezeptpflichtig?",
        vi: "Thuốc này có cần đơn không?",
        pronunciation_focus: ["Medikament → mê-đi-ka-MENT", "rezeptpflichtig → rê-TSEPT-phlị-tịc", "pf → kết hợp p+ph"],
      },
      {
        en: "Ich brauche etwas für Husten.",
        vi: "Tôi cần thuốc trị ho.",
        pronunciation_focus: ["brauche → BRAO-khờ", "etwas → ET-vas", "Husten → HÚS-tần"],
      },
      {
        en: "Bitte lesen Sie die Packungsbeilage.",
        vi: "Xin đọc hướng dẫn sử dụng.",
        pronunciation_focus: ["lesen → LÊ-zần", "Packungsbeilage → PA-cungs-bai-la-gờ", "ei → ai"],
      },
    ],
    cultural_notes_vi:
      "Apotheke (hiệu thuốc) ở Đức tách biệt với drogerie (cửa hàng đồ vệ sinh cá nhân như dm, Rossmann). Thuốc kê đơn và nhiều thuốc thông thường (kể cả paracetamol, ibuprofen) chỉ bán ở Apotheke. Apotheke đóng cửa Chủ nhật, nhưng luôn có 'Notdienst' (hiệu thuốc trực) — danh sách dán ngoài cửa hoặc tra trên app.",
    tip_advice_vi:
      "Người Đức thường hỏi dược sĩ tư vấn trước khi mua thuốc — họ là chuyên gia và sẽ giới thiệu thuốc phù hợp. 'Haben Sie etwas gegen ___?' (Bạn có thuốc gì cho ___?) là câu mở đầu chuẩn. Đừng ngại hỏi liều lượng và tác dụng phụ.",
    vocabulary: [
      { word: "die Apotheke", en: "pharmacy", vi: "hiệu thuốc", pos: "noun (f)", pronunciation_vi: "đi a-pô-TÊ-cờ" },
      { word: "das Medikament", en: "medicine", vi: "thuốc", pos: "noun (n)", pronunciation_vi: "đát mê-đi-ka-MENT" },
      { word: "die Tablette", en: "tablet/pill", vi: "thuốc viên", pos: "noun (f)", pronunciation_vi: "đi ta-BLET-tờ" },
      { word: "der Hustensaft", en: "cough syrup", vi: "siro ho", pos: "noun (m)", pronunciation_vi: "đe-a HÚS-tần-zaph-tờ" },
      { word: "die Salbe", en: "ointment", vi: "thuốc mỡ", pos: "noun (f)", pronunciation_vi: "đi ZAN-bờ" },
      { word: "die Kopfschmerzen", en: "headache", vi: "đau đầu", pos: "noun (pl)", pronunciation_vi: "đi CỐP-shmea-tsần" },
      { word: "der Husten", en: "cough", vi: "ho", pos: "noun (m)", pronunciation_vi: "đe-a HÚS-tần" },
      { word: "die Erkältung", en: "cold", vi: "cảm lạnh", pos: "noun (f)", pronunciation_vi: "đi ê-CEL-tung" },
      { word: "nehmen", en: "to take", vi: "uống/dùng", pos: "verb", pronunciation_vi: "NÊ-mần" },
      { word: "rezeptpflichtig", en: "prescription required", vi: "cần đơn", pos: "adjective", pronunciation_vi: "rê-TSEPT-phlị-tịc" },
    ],
    dialogue: [
      { speaker: "A", text: "Guten Tag, was kann ich für Sie tun?", vi: "Xin chào, tôi giúp gì được cho bạn?" },
      { speaker: "B", text: "Ich habe Kopfschmerzen. Haben Sie etwas dagegen?", vi: "Tôi đau đầu. Có thuốc gì cho không?" },
      { speaker: "A", text: "Diese Tabletten helfen gut. Nehmen Sie eine Tablette alle vier Stunden.", vi: "Thuốc viên này tốt lắm. Uống 1 viên mỗi 4 tiếng." },
      { speaker: "B", text: "Danke. Wie viel kostet das?", vi: "Cám ơn. Giá bao nhiêu?" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về thuốc:",
        pronunciation_focus: [],
        items: [
          { prompt: "Ich habe _____. (đau đầu)", answer: "Kopfschmerzen" },
          { prompt: "Diese _____ nehmen Sie zweimal täglich. (thuốc viên)", answer: "Tabletten" },
          { prompt: "Ist das _____? (cần đơn)", answer: "rezeptpflichtig" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "die Apotheke", answer: "hiệu thuốc" },
          { prompt: "der Hustensaft", answer: "siro ho" },
          { prompt: "die Erkältung", answer: "cảm lạnh" },
          { prompt: "die Salbe", answer: "thuốc mỡ" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Tôi cần thuốc trị ho.", answer: "Ich brauche etwas für Husten." },
          { prompt: "Uống 3 lần mỗi ngày.", answer: "Nehmen Sie es dreimal täglich." },
          { prompt: "Tôi bị cảm lạnh.", answer: "Ich habe eine Erkältung." },
        ],
      },
    ],
  },
  {
    id: "german_appointments",
    level: "A2",
    category: "life_admin",
    title_vi: "Đặt lịch hẹn",
    title_en: "Making appointments",
    sentences: [
      {
        en: "Ich möchte einen Termin vereinbaren.",
        vi: "Tôi muốn đặt cuộc hẹn.",
        pronunciation_focus: ["Termin → TE-min", "vereinbaren → phờ-AIN-ba-rần", "ei → ai"],
      },
      {
        en: "Haben Sie nächste Woche Zeit?",
        vi: "Tuần sau bạn có thời gian không?",
        pronunciation_focus: ["nächste → NEỊC-stờ — 'ä' = e", "Woche → VÔ-khờ", "Zeit → TSAIT"],
      },
      {
        en: "Geht es am Mittwoch um vierzehn Uhr?",
        vi: "Thứ Tư lúc 14 giờ được không?",
        pronunciation_focus: ["Mittwoch → MÍT-vô-khờ", "vierzehn → PHÍA-tsên", "Uhr → UA"],
      },
      {
        en: "Leider muss ich den Termin verschieben.",
        vi: "Tiếc là tôi phải dời cuộc hẹn.",
        pronunciation_focus: ["Leider → LAI-đờ", "muss → mUS", "verschieben → phờ-SHÍ-bần"],
      },
      {
        en: "Bitte bestätigen Sie den Termin per Email.",
        vi: "Xin xác nhận cuộc hẹn qua email.",
        pronunciation_focus: ["bestätigen → bờ-SHTEỊ-ti-gần — 'ä' = e", "Email → Ê-mây", "per → pe-a"],
      },
    ],
    cultural_notes_vi:
      "Người Đức đặt hẹn cho mọi thứ — bác sĩ, ngân hàng, gặp bạn bè, thậm chí thăm nhà. Đến trễ dù chỉ 5 phút bị coi là thiếu tôn trọng. Nếu cần huỷ, hãy báo càng sớm càng tốt — tối thiểu 24h trước. Một số phòng khám tính phí 'Ausfallhonorar' nếu huỷ trễ.",
    tip_advice_vi:
      "Hỏi về thời gian: 'Geht es am ___?' (Có được không vào ___?) lịch sự hơn 'Können wir am ___?'. Trả lời 'Das passt' (phù hợp) hoặc 'Das passt mir nicht' (không phù hợp với tôi). Thứ trong tuần: Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag, Sonntag.",
    vocabulary: [
      { word: "der Termin", en: "appointment", vi: "cuộc hẹn", pos: "noun (m)", pronunciation_vi: "đe-a TE-min" },
      { word: "die Uhrzeit", en: "time of day", vi: "giờ", pos: "noun (f)", pronunciation_vi: "đi UA-tsait" },
      { word: "das Datum", en: "date", vi: "ngày", pos: "noun (n)", pronunciation_vi: "đát ĐA-tum" },
      { word: "die Woche", en: "week", vi: "tuần", pos: "noun (f)", pronunciation_vi: "đi VÔ-khờ" },
      { word: "vereinbaren", en: "to arrange", vi: "đặt/sắp xếp", pos: "verb", pronunciation_vi: "phờ-AIN-ba-rần" },
      { word: "verschieben", en: "to postpone", vi: "dời lại", pos: "verb", pronunciation_vi: "phờ-SHÍ-bần" },
      { word: "absagen", en: "to cancel", vi: "huỷ", pos: "verb (separable)", pronunciation_vi: "AP-za-gần" },
      { word: "bestätigen", en: "to confirm", vi: "xác nhận", pos: "verb", pronunciation_vi: "bờ-SHTEỊ-ti-gần" },
      { word: "passen", en: "to fit/suit", vi: "phù hợp", pos: "verb", pronunciation_vi: "PA-sần" },
      { word: "frei", en: "free/available", vi: "rảnh", pos: "adjective", pronunciation_vi: "PHRAI" },
    ],
    dialogue: [
      { speaker: "A", text: "Guten Tag, ich möchte einen Termin vereinbaren.", vi: "Xin chào, tôi muốn đặt cuộc hẹn." },
      { speaker: "B", text: "Wann passt es Ihnen?", vi: "Khi nào tiện cho bạn?" },
      { speaker: "A", text: "Geht es am Donnerstag um fünfzehn Uhr?", vi: "Thứ Năm lúc 15 giờ được không?" },
      { speaker: "B", text: "Ja, das passt. Ich bestätige den Termin per Email.", vi: "Vâng, được. Tôi sẽ xác nhận qua email." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về cuộc hẹn:",
        pronunciation_focus: [],
        items: [
          { prompt: "Ich möchte einen _____ vereinbaren. (cuộc hẹn)", answer: "Termin" },
          { prompt: "Haben Sie nächste _____ Zeit? (tuần)", answer: "Woche" },
          { prompt: "Ich muss den Termin _____. (dời lại)", answer: "verschieben" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "vereinbaren", answer: "đặt/sắp xếp" },
          { prompt: "absagen", answer: "huỷ" },
          { prompt: "bestätigen", answer: "xác nhận" },
          { prompt: "frei", answer: "rảnh" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Tuần sau bạn có thời gian không?", answer: "Haben Sie nächste Woche Zeit?" },
          { prompt: "Tôi phải huỷ cuộc hẹn.", answer: "Ich muss den Termin absagen." },
          { prompt: "Thứ Tư lúc 14 giờ được không?", answer: "Geht es am Mittwoch um vierzehn Uhr?" },
        ],
      },
    ],
  },
];

// ── 31–35. Society ──────────────────────────────────────────────────────

const SOCIETY: GermanLesson[] = [
  {
    id: "german_shopping",
    level: "B1",
    category: "society",
    title_vi: "Mua sắm",
    title_en: "Shopping",
    sentences: [
      {
        en: "Wo finde ich die Milch?",
        vi: "Sữa ở đâu vậy?",
        pronunciation_focus: ["finde → PHIN-đờ", "Milch → MỊN-khờ — 'ch' nhẹ", "wo → vô"],
      },
      {
        en: "Was kostet ein Kilo Tomaten?",
        vi: "Một cân cà chua giá bao nhiêu?",
        pronunciation_focus: ["kostet → CÔS-tết", "Kilo → KI-lô", "Tomaten → tô-MA-tần"],
      },
      {
        en: "Ich nehme zwei Stück, bitte.",
        vi: "Cho tôi 2 cái.",
        pronunciation_focus: ["nehme → NÊ-mờ", "zwei → tsvai", "Stück → SHTUYC — 'ü' tròn"],
      },
      {
        en: "Haben Sie das in einer anderen Größe?",
        vi: "Bạn có cái này cỡ khác không?",
        pronunciation_focus: ["anderen → AN-đe-rần", "Größe → GRƠY-sờ — 'ö' tròn, 'ß' = ss", "ei → ai"],
      },
      {
        en: "Ich zahle mit Karte.",
        vi: "Tôi trả bằng thẻ.",
        pronunciation_focus: ["zahle → TSA-lờ", "mit → MÍT", "Karte → CÁ-tờ"],
      },
    ],
    cultural_notes_vi:
      "Siêu thị Đức (Aldi, Lidl, Edeka, Rewe) đóng cửa Chủ nhật theo luật. Người mua tự đóng gói hàng vào túi mang theo — túi nilon mất phí và bị xã hội phản đối. Pfand (đặt cọc) trên chai nước, bia: trả lại chai để lấy lại tiền cọc. Nhân viên thu ngân quét hàng nhanh — hãy chuẩn bị túi sẵn.",
    tip_advice_vi:
      "'Was kostet ___?' (giá bao nhiêu) là câu chuẩn. 'Wie viel kostet ___?' cũng dùng được, hơi formal hơn. Số lượng đi với đơn vị: 'ein Kilo Äpfel' (1 cân táo), 'eine Flasche Wasser' (1 chai nước), 'ein Stück Brot' (1 miếng bánh mì) — không có 's' số nhiều như tiếng Anh.",
    vocabulary: [
      { word: "der Supermarkt", en: "supermarket", vi: "siêu thị", pos: "noun (m)", pronunciation_vi: "đe-a ZÚ-pờ-mác-kt" },
      { word: "der Markt", en: "market", vi: "chợ", pos: "noun (m)", pronunciation_vi: "đe-a MÁC-kt" },
      { word: "die Kasse", en: "checkout", vi: "quầy thu ngân", pos: "noun (f)", pronunciation_vi: "đi CA-sờ" },
      { word: "die Tüte", en: "bag", vi: "túi", pos: "noun (f)", pronunciation_vi: "đi TUY-tờ — 'ü' tròn" },
      { word: "das Angebot", en: "offer/sale", vi: "khuyến mãi", pos: "noun (n)", pronunciation_vi: "đát AN-gờ-bốt" },
      { word: "der Rabatt", en: "discount", vi: "giảm giá", pos: "noun (m)", pronunciation_vi: "đe-a ra-BÁT" },
      { word: "die Größe", en: "size", vi: "cỡ", pos: "noun (f)", pronunciation_vi: "đi GRƠY-sờ" },
      { word: "kaufen", en: "to buy", vi: "mua", pos: "verb", pronunciation_vi: "CAO-phần" },
      { word: "zahlen", en: "to pay", vi: "trả tiền", pos: "verb", pronunciation_vi: "TSA-lần" },
      { word: "billig", en: "cheap", vi: "rẻ", pos: "adjective", pronunciation_vi: "BÍ-lị-khờ" },
    ],
    dialogue: [
      { speaker: "A", text: "Entschuldigung, wo finde ich Brot?", vi: "Xin lỗi, bánh mì ở đâu?" },
      { speaker: "B", text: "Im Gang drei, neben dem Käse.", vi: "Lối đi số 3, cạnh phô mai." },
      { speaker: "A", text: "Vielen Dank. Was kostet das Brot?", vi: "Cám ơn. Bánh mì giá bao nhiêu?" },
      { speaker: "B", text: "Zwei Euro fünfzig. Im Angebot heute.", vi: "2 euro 50. Hôm nay khuyến mãi." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về mua sắm:",
        pronunciation_focus: [],
        items: [
          { prompt: "Was _____ das? (giá bao nhiêu)", answer: "kostet" },
          { prompt: "Ich _____ mit Karte. (trả tiền)", answer: "zahle" },
          { prompt: "Haben Sie das in einer anderen _____? (cỡ)", answer: "Größe" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "der Supermarkt", answer: "siêu thị" },
          { prompt: "die Kasse", answer: "quầy thu ngân" },
          { prompt: "der Rabatt", answer: "giảm giá" },
          { prompt: "billig", answer: "rẻ" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Một cân cà chua giá bao nhiêu?", answer: "Was kostet ein Kilo Tomaten?" },
          { prompt: "Tôi trả bằng thẻ.", answer: "Ich zahle mit Karte." },
          { prompt: "Hôm nay có khuyến mãi không?", answer: "Gibt es heute ein Angebot?" },
        ],
      },
    ],
  },
  {
    id: "german_directions",
    level: "B1",
    category: "society",
    title_vi: "Hỏi đường",
    title_en: "Asking directions",
    sentences: [
      {
        en: "Entschuldigung, wo ist der Bahnhof?",
        vi: "Xin lỗi, ga tàu ở đâu?",
        pronunciation_focus: ["Entschuldigung → ent-SHUN-đi-gung", "Bahnhof → BA-nờ-hôph", "wo → vô"],
      },
      {
        en: "Gehen Sie geradeaus und dann links.",
        vi: "Đi thẳng rồi rẽ trái.",
        pronunciation_focus: ["geradeaus → gờ-RA-đờ-ao-s", "dann → đan", "links → LINGKS"],
      },
      {
        en: "Es ist etwa fünf Minuten zu Fuß.",
        vi: "Khoảng 5 phút đi bộ.",
        pronunciation_focus: ["etwa → ET-va", "fünf → PHUYNF", "zu Fuß → tsu PHUYS — 'ß' = ss"],
      },
      {
        en: "Ist das weit von hier?",
        vi: "Có xa đây không?",
        pronunciation_focus: ["weit → vAIT", "hier → HÍA", "ist → ÍST"],
      },
      {
        en: "Gibt es hier eine U-Bahn-Station?",
        vi: "Có ga tàu điện ngầm gần đây không?",
        pronunciation_focus: ["Gibt es → GHÍPT-es", "U-Bahn → U-ba-nờ", "Station → SHTA-tsi-ôn"],
      },
    ],
    cultural_notes_vi:
      "Người Đức thường rất sẵn lòng chỉ đường và giải thích kỹ. Đừng ngạc nhiên nếu họ rút điện thoại tra Google Maps cùng bạn. Ở các thành phố lớn (Berlin, München, Hamburg), tiếng Anh được dùng nhiều — nhưng cố gắng mở đầu bằng 'Entschuldigung, sprechen Sie Englisch?' (Xin lỗi, bạn có nói tiếng Anh không?) là phép lịch sự.",
    tip_advice_vi:
      "'Wie komme ich zu/zum/zur ___?' (Đến ___ đường nào?) — giới từ 'zu' kết hợp giống danh từ: 'zum' (zu+dem) cho der/das, 'zur' (zu+der) cho die. Ví dụ: 'zum Bahnhof' (der), 'zur Bank' (die), 'zum Hotel' (das). Học cấu trúc này một lần là dùng được mãi.",
    vocabulary: [
      { word: "der Bahnhof", en: "train station", vi: "ga tàu", pos: "noun (m)", pronunciation_vi: "đe-a BA-nờ-hôph" },
      { word: "die U-Bahn", en: "subway", vi: "tàu điện ngầm", pos: "noun (f)", pronunciation_vi: "đi U-ba-nờ" },
      { word: "die Bushaltestelle", en: "bus stop", vi: "trạm xe buýt", pos: "noun (f)", pronunciation_vi: "đi BÚS-han-tờ-shte-lờ" },
      { word: "die Straße", en: "street", vi: "đường", pos: "noun (f)", pronunciation_vi: "đi SHTRA-sờ — 'ß' = ss" },
      { word: "die Kreuzung", en: "intersection", vi: "ngã tư", pos: "noun (f)", pronunciation_vi: "đi CROI-tsung" },
      { word: "die Ampel", en: "traffic light", vi: "đèn giao thông", pos: "noun (f)", pronunciation_vi: "đi AM-pần" },
      { word: "geradeaus", en: "straight ahead", vi: "đi thẳng", pos: "adverb", pronunciation_vi: "gờ-RA-đờ-ao-s" },
      { word: "links", en: "left", vi: "trái", pos: "adverb", pronunciation_vi: "LINGKS" },
      { word: "rechts", en: "right", vi: "phải", pos: "adverb", pronunciation_vi: "RẾC-tờs" },
      { word: "weit", en: "far", vi: "xa", pos: "adjective", pronunciation_vi: "vAIT" },
    ],
    dialogue: [
      { speaker: "A", text: "Entschuldigung, wie komme ich zum Museum?", vi: "Xin lỗi, đến bảo tàng đường nào?" },
      { speaker: "B", text: "Gehen Sie geradeaus bis zur Ampel, dann rechts.", vi: "Đi thẳng đến đèn giao thông, rồi rẽ phải." },
      { speaker: "A", text: "Ist es weit?", vi: "Có xa không?" },
      { speaker: "B", text: "Nein, nur zehn Minuten zu Fuß.", vi: "Không, chỉ 10 phút đi bộ." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về phương hướng:",
        pronunciation_focus: [],
        items: [
          { prompt: "Gehen Sie _____. (đi thẳng)", answer: "geradeaus" },
          { prompt: "Dann nach _____. (trái)", answer: "links" },
          { prompt: "Wo ist der _____? (ga tàu)", answer: "Bahnhof" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "die Kreuzung", answer: "ngã tư" },
          { prompt: "die Ampel", answer: "đèn giao thông" },
          { prompt: "die U-Bahn", answer: "tàu điện ngầm" },
          { prompt: "weit", answer: "xa" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Có xa đây không?", answer: "Ist das weit von hier?" },
          { prompt: "Khoảng 5 phút đi bộ.", answer: "Etwa fünf Minuten zu Fuß." },
          { prompt: "Đi thẳng rồi rẽ phải.", answer: "Gehen Sie geradeaus und dann rechts." },
        ],
      },
    ],
  },
  {
    id: "german_restaurant",
    level: "B1",
    category: "society",
    title_vi: "Nhà hàng",
    title_en: "Restaurant",
    sentences: [
      {
        en: "Ich hätte gern die Speisekarte, bitte.",
        vi: "Cho tôi xem thực đơn.",
        pronunciation_focus: ["hätte → HE-tờ — 'ä' = e", "gern → GHEAN", "Speisekarte → SHPAI-zờ-cá-tờ"],
      },
      {
        en: "Was können Sie empfehlen?",
        vi: "Bạn có thể giới thiệu món gì không?",
        pronunciation_focus: ["können → KƠN-nần — 'ö' tròn", "empfehlen → em-PHÊ-lần", "pf → kết hợp"],
      },
      {
        en: "Ich nehme das Schnitzel mit Pommes.",
        vi: "Cho tôi món schnitzel với khoai tây chiên.",
        pronunciation_focus: ["nehme → NÊ-mờ", "Schnitzel → SHNÍT-tsần", "Pommes → PÔM-mes"],
      },
      {
        en: "Die Rechnung, bitte.",
        vi: "Cho tôi xin hóa đơn.",
        pronunciation_focus: ["Rechnung → RẾC-nung", "ch → khờ", "bitte → BÍ-tờ"],
      },
      {
        en: "Stimmt so. Vielen Dank.",
        vi: "Khỏi thối lại. Cám ơn.",
        pronunciation_focus: ["Stimmt so → SHTÍMT zô", "Vielen → PHÍ-lần", "Dank → ĐANK"],
      },
    ],
    cultural_notes_vi:
      "Tiền boa ở Đức không bắt buộc nhưng phổ biến — khoảng 5-10% là chuẩn. Nói số tiền tổng cộng thay vì để boa trên bàn: 'Stimmt so' (khỏi thối lại) hoặc nói 'Macht 25 Euro' nếu hóa đơn 22.50 — phục vụ giữ phần chênh. Người Đức chia hóa đơn thường xuyên: 'Getrennt zahlen' (trả riêng) là cụm nên biết.",
    tip_advice_vi:
      "'Ich hätte gern' (cho tôi) lịch sự hơn 'Ich will' (tôi muốn). Trong nhà hàng formal, dùng 'hätte gern' luôn. 'Ich nehme' (tôi gọi/lấy) cũng tự nhiên cho việc gọi món. Tránh 'Ich möchte essen' (tôi muốn ăn) — quá cứng.",
    vocabulary: [
      { word: "das Restaurant", en: "restaurant", vi: "nhà hàng", pos: "noun (n)", pronunciation_vi: "đát rếs-tô-RANG" },
      { word: "die Speisekarte", en: "menu", vi: "thực đơn", pos: "noun (f)", pronunciation_vi: "đi SHPAI-zờ-cá-tờ" },
      { word: "die Vorspeise", en: "appetizer", vi: "khai vị", pos: "noun (f)", pronunciation_vi: "đi PHÔ-shpai-zờ" },
      { word: "das Hauptgericht", en: "main course", vi: "món chính", pos: "noun (n)", pronunciation_vi: "đát HAOPT-gờ-rịt" },
      { word: "der Nachtisch", en: "dessert", vi: "tráng miệng", pos: "noun (m)", pronunciation_vi: "đe-a NÁC-tish" },
      { word: "die Rechnung", en: "bill", vi: "hóa đơn", pos: "noun (f)", pronunciation_vi: "đi RẾC-nung" },
      { word: "das Trinkgeld", en: "tip", vi: "tiền boa", pos: "noun (n)", pronunciation_vi: "đát TRINK-ghen-t" },
      { word: "bestellen", en: "to order", vi: "gọi món", pos: "verb", pronunciation_vi: "bờ-SHTE-lần" },
      { word: "empfehlen", en: "to recommend", vi: "giới thiệu", pos: "verb", pronunciation_vi: "em-PHÊ-lần" },
      { word: "lecker", en: "delicious", vi: "ngon", pos: "adjective", pronunciation_vi: "LẾC-cờ" },
    ],
    dialogue: [
      { speaker: "A", text: "Guten Abend. Haben Sie reserviert?", vi: "Chào buổi tối. Bạn có đặt bàn không?" },
      { speaker: "B", text: "Ja, auf den Namen Müller, für zwei Personen.", vi: "Có, tên Müller, 2 người." },
      { speaker: "A", text: "Folgen Sie mir bitte. Hier ist Ihr Tisch.", vi: "Mời theo tôi. Đây là bàn của bạn." },
      { speaker: "B", text: "Danke. Können wir die Speisekarte sehen?", vi: "Cám ơn. Cho chúng tôi xem thực đơn được không?" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về nhà hàng:",
        pronunciation_focus: [],
        items: [
          { prompt: "Die _____, bitte. (hóa đơn)", answer: "Rechnung" },
          { prompt: "Ich _____ das Schnitzel. (gọi món - dùng 'nehme')", answer: "nehme" },
          { prompt: "Was können Sie _____? (giới thiệu)", answer: "empfehlen" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "die Vorspeise", answer: "khai vị" },
          { prompt: "der Nachtisch", answer: "tráng miệng" },
          { prompt: "das Trinkgeld", answer: "tiền boa" },
          { prompt: "lecker", answer: "ngon" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Cho tôi xem thực đơn.", answer: "Die Speisekarte, bitte." },
          { prompt: "Bạn có thể giới thiệu món gì không?", answer: "Was können Sie empfehlen?" },
          { prompt: "Cho tôi xin hóa đơn.", answer: "Die Rechnung, bitte." },
        ],
      },
    ],
  },
  {
    id: "german_holidays",
    level: "B1",
    category: "society",
    title_vi: "Lễ hội và ngày lễ",
    title_en: "Holidays and festivals",
    sentences: [
      {
        en: "Frohe Weihnachten und ein gutes neues Jahr!",
        vi: "Giáng sinh vui vẻ và năm mới tốt lành!",
        pronunciation_focus: ["Frohe → PHRÔ-ờ", "Weihnachten → vAI-nắc-tần", "neues → NÔI-ợs"],
      },
      {
        en: "Wir feiern Silvester mit Freunden.",
        vi: "Chúng tôi đón giao thừa với bạn bè.",
        pronunciation_focus: ["feiern → PHAI-ợn", "Silvester → zin-VES-tờ", "Freunden → PHROIN-đần"],
      },
      {
        en: "Ostern ist im Frühling.",
        vi: "Lễ Phục sinh vào mùa xuân.",
        pronunciation_focus: ["Ostern → ÔS-tần", "Frühling → PHRUY-ling — 'ü' tròn", "ng → cuối lưỡi"],
      },
      {
        en: "Heute ist mein Geburtstag.",
        vi: "Hôm nay là sinh nhật tôi.",
        pronunciation_focus: ["Heute → HÔI-tờ", "Geburtstag → gờ-BÚA-stác", "mein → main"],
      },
      {
        en: "Herzlichen Glückwunsch!",
        vi: "Chúc mừng!",
        pronunciation_focus: ["Herzlichen → HẾT-tslị-khần", "Glückwunsch → GLUYC-vunsh — 'ü' tròn", "ch → khờ"],
      },
    ],
    cultural_notes_vi:
      "Weihnachten (Giáng sinh) ở Đức là ngày 24/12 — lễ chính vào tối Heiligabend, không phải 25/12 như Mỹ. Cả gia đình tụ họp, ăn ngỗng quay hoặc cá chép. 1/5 (Tag der Arbeit) và 3/10 (Tag der Deutschen Einheit - ngày thống nhất) là ngày lễ quốc gia bắt buộc. Sinh nhật: KHÔNG chúc trước ngày — người Đức coi đó là xui xẻo.",
    tip_advice_vi:
      "'Frohe ___' (vui vẻ) cho lễ hội: Frohe Weihnachten, Frohe Ostern. 'Herzlichen Glückwunsch' (chúc mừng) cho sinh nhật, kết hôn, thành công. 'Alles Gute' (mọi điều tốt) là cách chúc đa năng. Đừng dịch literal 'Happy Birthday' thành 'Glücklichen Geburtstag' — không tự nhiên.",
    vocabulary: [
      { word: "Weihnachten", en: "Christmas", vi: "Giáng sinh", pos: "noun (n)", pronunciation_vi: "vAI-nắc-tần" },
      { word: "Silvester", en: "New Year's Eve", vi: "đêm giao thừa", pos: "noun (m)", pronunciation_vi: "zin-VES-tờ" },
      { word: "Ostern", en: "Easter", vi: "Phục sinh", pos: "noun (n)", pronunciation_vi: "ÔS-tần" },
      { word: "der Geburtstag", en: "birthday", vi: "sinh nhật", pos: "noun (m)", pronunciation_vi: "đe-a gờ-BÚA-stác" },
      { word: "die Hochzeit", en: "wedding", vi: "đám cưới", pos: "noun (f)", pronunciation_vi: "đi HÔC-tsait" },
      { word: "der Feiertag", en: "holiday", vi: "ngày lễ", pos: "noun (m)", pronunciation_vi: "đe-a PHAI-ợ-tác" },
      { word: "das Geschenk", en: "gift", vi: "quà", pos: "noun (n)", pronunciation_vi: "đát gờ-SHENG-k" },
      { word: "feiern", en: "to celebrate", vi: "ăn mừng", pos: "verb", pronunciation_vi: "PHAI-ợn" },
      { word: "schenken", en: "to give (a gift)", vi: "tặng", pos: "verb", pronunciation_vi: "SHENG-kần" },
      { word: "gratulieren", en: "to congratulate", vi: "chúc mừng", pos: "verb", pronunciation_vi: "gra-tu-LI-rần" },
    ],
    dialogue: [
      { speaker: "A", text: "Was machst du an Weihnachten?", vi: "Giáng sinh bạn làm gì?" },
      { speaker: "B", text: "Ich besuche meine Familie. Wir essen zusammen.", vi: "Tôi về thăm gia đình. Chúng tôi ăn cùng nhau." },
      { speaker: "A", text: "Schön! Bekommst du viele Geschenke?", vi: "Hay quá! Bạn nhận được nhiều quà không?" },
      { speaker: "B", text: "Ja, und ich schenke auch viel.", vi: "Có, và tôi cũng tặng nhiều." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về ngày lễ:",
        pronunciation_focus: [],
        items: [
          { prompt: "Frohe _____! (Giáng sinh)", answer: "Weihnachten" },
          { prompt: "Heute ist mein _____. (sinh nhật)", answer: "Geburtstag" },
          { prompt: "Wir _____ zusammen. (ăn mừng)", answer: "feiern" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "Silvester", answer: "đêm giao thừa" },
          { prompt: "die Hochzeit", answer: "đám cưới" },
          { prompt: "das Geschenk", answer: "quà" },
          { prompt: "schenken", answer: "tặng" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Chúc mừng!", answer: "Herzlichen Glückwunsch!" },
          { prompt: "Hôm nay là sinh nhật tôi.", answer: "Heute ist mein Geburtstag." },
          { prompt: "Lễ Phục sinh vào mùa xuân.", answer: "Ostern ist im Frühling." },
        ],
      },
    ],
  },
  {
    id: "german_environment",
    level: "B1",
    category: "society",
    title_vi: "Môi trường",
    title_en: "Environment",
    sentences: [
      {
        en: "Wir müssen die Umwelt schützen.",
        vi: "Chúng ta phải bảo vệ môi trường.",
        pronunciation_focus: ["müssen → MUYS-sần — 'ü' tròn", "Umwelt → UM-vẹn-t", "schützen → SHUYT-tsần"],
      },
      {
        en: "Ich fahre mit dem Fahrrad zur Arbeit.",
        vi: "Tôi đạp xe đi làm.",
        pronunciation_focus: ["fahre → PHA-rờ", "Fahrrad → PHA-rát", "Arbeit → A-bait"],
      },
      {
        en: "Plastik ist schlecht für die Natur.",
        vi: "Nhựa có hại cho thiên nhiên.",
        pronunciation_focus: ["Plastik → PLA-stic", "schlecht → SHLẾT", "Natur → na-TÚA"],
      },
      {
        en: "Wir trennen den Müll zu Hause.",
        vi: "Chúng tôi phân loại rác ở nhà.",
        pronunciation_focus: ["trennen → TRE-nần", "Müll → MUYN — 'ü' tròn", "Hause → HAO-zờ"],
      },
      {
        en: "Klimawandel ist ein großes Problem.",
        vi: "Biến đổi khí hậu là vấn đề lớn.",
        pronunciation_focus: ["Klimawandel → KLI-ma-van-đần", "großes → GRÔ-sờs — 'ß' = ss", "Problem → prô-BLÊM"],
      },
    ],
    cultural_notes_vi:
      "Đức là một trong những nước nghiêm túc nhất về phân loại rác. Có nhiều thùng rác: gelb (vàng — nhựa, kim loại), blau (xanh dương — giấy), grün/braun (xanh lá/nâu — rác hữu cơ), schwarz/grau (đen/xám — rác còn lại). Sai loại có thể bị phạt. Pfand (tiền cọc chai) trên chai nhựa, lon, chai thủy tinh — trả về siêu thị để lấy tiền lại.",
    tip_advice_vi:
      "Đề tài môi trường (Umwelt) và biến đổi khí hậu (Klimawandel) rất phổ biến trong hội thoại tiếng Đức hàng ngày. Nắm 5-10 từ chủ đề này giúp bạn tham gia các cuộc trò chuyện ở café, công sở. Người Đức trẻ (đặc biệt trên 30 tuổi) coi đây là vấn đề thời sự.",
    vocabulary: [
      { word: "die Umwelt", en: "environment", vi: "môi trường", pos: "noun (f)", pronunciation_vi: "đi UM-vẹn-t" },
      { word: "die Natur", en: "nature", vi: "thiên nhiên", pos: "noun (f)", pronunciation_vi: "đi na-TÚA" },
      { word: "der Müll", en: "garbage", vi: "rác", pos: "noun (m)", pronunciation_vi: "đe-a MUYN" },
      { word: "das Plastik", en: "plastic", vi: "nhựa", pos: "noun (n)", pronunciation_vi: "đát PLA-stic" },
      { word: "der Klimawandel", en: "climate change", vi: "biến đổi khí hậu", pos: "noun (m)", pronunciation_vi: "đe-a KLI-ma-van-đần" },
      { word: "das Recycling", en: "recycling", vi: "tái chế", pos: "noun (n)", pronunciation_vi: "đát rê-XAI-cling" },
      { word: "die Energie", en: "energy", vi: "năng lượng", pos: "noun (f)", pronunciation_vi: "đi ê-nê-GHI" },
      { word: "schützen", en: "to protect", vi: "bảo vệ", pos: "verb", pronunciation_vi: "SHUYT-tsần" },
      { word: "trennen", en: "to separate", vi: "phân loại", pos: "verb", pronunciation_vi: "TRE-nần" },
      { word: "umweltfreundlich", en: "eco-friendly", vi: "thân thiện môi trường", pos: "adjective", pronunciation_vi: "UM-vẹn-t-phroin-lị" },
    ],
    dialogue: [
      { speaker: "A", text: "Fährst du oft mit dem Auto?", vi: "Bạn có hay lái xe ô tô không?" },
      { speaker: "B", text: "Nein, ich nehme meistens das Fahrrad oder die Bahn.", vi: "Không, tôi thường đạp xe hoặc đi tàu." },
      { speaker: "A", text: "Das ist gut für die Umwelt.", vi: "Vậy tốt cho môi trường." },
      { speaker: "B", text: "Ja, und auch billiger als Benzin.", vi: "Vâng, và rẻ hơn xăng nữa." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về môi trường:",
        pronunciation_focus: [],
        items: [
          { prompt: "Wir müssen die _____ schützen. (môi trường)", answer: "Umwelt" },
          { prompt: "Wir _____ den Müll. (phân loại)", answer: "trennen" },
          { prompt: "_____ ist ein großes Problem. (biến đổi khí hậu)", answer: "Klimawandel" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "die Natur", answer: "thiên nhiên" },
          { prompt: "das Recycling", answer: "tái chế" },
          { prompt: "die Energie", answer: "năng lượng" },
          { prompt: "umweltfreundlich", answer: "thân thiện môi trường" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Tôi đạp xe đi làm.", answer: "Ich fahre mit dem Fahrrad zur Arbeit." },
          { prompt: "Nhựa có hại cho thiên nhiên.", answer: "Plastik ist schlecht für die Natur." },
          { prompt: "Chúng ta phải bảo vệ môi trường.", answer: "Wir müssen die Umwelt schützen." },
        ],
      },
    ],
  },
];

// ── 36–40. Expressions ──────────────────────────────────────────────────

const EXPRESSIONS: GermanLesson[] = [
  {
    id: "german_polite_phrases",
    level: "B1",
    category: "expressions",
    title_vi: "Câu lịch sự",
    title_en: "Polite phrases",
    sentences: [
      {
        en: "Könnten Sie mir bitte helfen?",
        vi: "Bạn có thể giúp tôi được không?",
        pronunciation_focus: ["Könnten → KƠN-tần — 'ö' tròn, dạng lịch sự (Konjunktiv II)", "helfen → HEN-phần", "bitte → BÍ-tờ"],
      },
      {
        en: "Würden Sie mir das erklären?",
        vi: "Bạn giải thích cho tôi được không?",
        pronunciation_focus: ["Würden → VUYR-đần — 'ü' tròn, dạng lịch sự", "erklären → e-KLEỊ-rần — 'ä' = e", "ei → ai"],
      },
      {
        en: "Entschuldigen Sie die Störung.",
        vi: "Xin lỗi đã làm phiền.",
        pronunciation_focus: ["Entschuldigen → ent-SHUN-đi-gần", "Störung → SHTƠ-rung — 'ö' tròn", "ng → cuối lưỡi"],
      },
      {
        en: "Vielen Dank für Ihre Hilfe.",
        vi: "Cám ơn rất nhiều vì sự giúp đỡ.",
        pronunciation_focus: ["Vielen → PHÍ-lần", "Ihre → I-rờ — 'Sie' lịch sự", "Hilfe → HIN-phờ"],
      },
      {
        en: "Es wäre nett, wenn Sie...",
        vi: "Sẽ tốt nếu bạn...",
        pronunciation_focus: ["wäre → VEỊ-rờ — 'ä' = e, Konjunktiv II", "nett → NẾT", "wenn → vEN"],
      },
    ],
    cultural_notes_vi:
      "Tiếng Đức có thang lịch sự rõ ràng. Mức 1: 'Ich will' (tôi muốn — thẳng thắn, dùng với bạn bè). Mức 2: 'Ich möchte' (tôi muốn — lịch sự, an toàn). Mức 3: 'Ich hätte gern' (tôi muốn có — formal, lịch sự). Mức 4: 'Könnten/Würden Sie...' (Konjunktiv II — rất lịch sự). Trong tình huống chính thức (cửa hàng, văn phòng), dùng mức 3-4.",
    tip_advice_vi:
      "Konjunktiv II (dạng giả định) tạo bằng 'könnte' (có thể), 'würde' (sẽ), 'hätte' (có), 'wäre' (là). Cấu trúc 'Könnten/Würden Sie + động từ?' cực lịch sự. Trộn 'bitte' (xin) vào câu càng tốt: 'Könnten Sie bitte ___?'",
    vocabulary: [
      { word: "bitte", en: "please", vi: "xin/làm ơn", pos: "particle", pronunciation_vi: "BÍ-tờ" },
      { word: "danke", en: "thanks", vi: "cám ơn", pos: "particle", pronunciation_vi: "ĐANG-kờ" },
      { word: "Entschuldigung", en: "excuse me/sorry", vi: "xin lỗi", pos: "noun (f)", pronunciation_vi: "ent-SHUN-đi-gung" },
      { word: "Verzeihung", en: "pardon", vi: "xin tha lỗi", pos: "noun (f)", pronunciation_vi: "phờ-TSAI-ung" },
      { word: "die Störung", en: "disturbance", vi: "sự làm phiền", pos: "noun (f)", pronunciation_vi: "đi SHTƠ-rung" },
      { word: "die Hilfe", en: "help", vi: "sự giúp đỡ", pos: "noun (f)", pronunciation_vi: "đi HIN-phờ" },
      { word: "der Gefallen", en: "favor", vi: "ân huệ", pos: "noun (m)", pronunciation_vi: "đe-a gờ-PHA-lần" },
      { word: "höflich", en: "polite", vi: "lịch sự", pos: "adjective", pronunciation_vi: "HƠPH-lị" },
      { word: "freundlich", en: "kind/friendly", vi: "thân thiện", pos: "adjective", pronunciation_vi: "PHROIN-lị" },
      { word: "nett", en: "nice", vi: "tốt/dễ thương", pos: "adjective", pronunciation_vi: "NẾT" },
    ],
    dialogue: [
      { speaker: "A", text: "Entschuldigen Sie, könnten Sie mir helfen?", vi: "Xin lỗi, bạn giúp tôi được không?" },
      { speaker: "B", text: "Natürlich. Was kann ich für Sie tun?", vi: "Tất nhiên. Tôi giúp gì cho bạn?" },
      { speaker: "A", text: "Ich suche die Post. Würden Sie mir den Weg zeigen?", vi: "Tôi tìm bưu điện. Bạn chỉ đường giúp được không?" },
      { speaker: "B", text: "Gerne. Gehen Sie geradeaus, dann links.", vi: "Vui lòng. Đi thẳng, rồi rẽ trái." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ lịch sự:",
        pronunciation_focus: [],
        items: [
          { prompt: "_____ Sie mir helfen? (Bạn có thể... lịch sự)", answer: "Könnten" },
          { prompt: "Vielen _____ für Ihre Hilfe. (cám ơn)", answer: "Dank" },
          { prompt: "_____ Sie die Störung. (xin lỗi)", answer: "Entschuldigen" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "Entschuldigung", answer: "xin lỗi" },
          { prompt: "die Hilfe", answer: "sự giúp đỡ" },
          { prompt: "höflich", answer: "lịch sự" },
          { prompt: "freundlich", answer: "thân thiện" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Bạn có thể giúp tôi được không?", answer: "Könnten Sie mir bitte helfen?" },
          { prompt: "Cám ơn rất nhiều.", answer: "Vielen Dank." },
          { prompt: "Xin lỗi đã làm phiền.", answer: "Entschuldigen Sie die Störung." },
        ],
      },
    ],
  },
  {
    id: "german_agreeing_disagreeing",
    level: "B1",
    category: "expressions",
    title_vi: "Đồng ý và phản đối",
    title_en: "Agreeing and disagreeing",
    sentences: [
      {
        en: "Da bin ich ganz Ihrer Meinung.",
        vi: "Tôi hoàn toàn đồng ý với bạn.",
        pronunciation_focus: ["ganz → GAN-ts", "Ihrer → I-rờ — 'Sie' lịch sự", "Meinung → MAI-nung"],
      },
      {
        en: "Das sehe ich anders.",
        vi: "Tôi nhìn vấn đề khác.",
        pronunciation_focus: ["sehe → ZÊ-ờ", "anders → AN-đợs", "ich → ịt"],
      },
      {
        en: "Ich stimme dir zu.",
        vi: "Tôi đồng ý với bạn.",
        pronunciation_focus: ["stimme → SHTÍM-mờ", "zu → tsu — động từ tách 'zustimmen'", "dir → đia"],
      },
      {
        en: "Tut mir leid, ich bin nicht einverstanden.",
        vi: "Tiếc là tôi không đồng ý.",
        pronunciation_focus: ["leid → LAI-t", "nicht → NỊT", "einverstanden → AIN-phờ-shtan-đần"],
      },
      {
        en: "Das stimmt. / Das stimmt nicht.",
        vi: "Đúng vậy. / Không đúng.",
        pronunciation_focus: ["stimmt → SHTÍMT", "nicht → NỊT", "Das → đás"],
      },
    ],
    cultural_notes_vi:
      "Người Đức quý sự thẳng thắn — không đồng ý không phải là thô lỗ, mà là tôn trọng người đối diện đủ để nói thật. 'Das sehe ich anders' (tôi nhìn khác) là cách phản đối lịch sự nhưng rõ ràng. Tránh né tránh hoặc lấp lửng — người Đức coi đó là không trung thực hơn là lịch sự.",
    tip_advice_vi:
      "Đồng ý mạnh: 'Genau!' (Đúng!), 'Auf jeden Fall!' (Chắc chắn!), 'Da hast du recht' (Bạn nói đúng). Đồng ý nhẹ: 'Mag sein' (Có thể), 'Ja, vielleicht' (Vâng, có thể). Phản đối nhẹ: 'Ich bin mir nicht sicher' (Tôi không chắc). Phản đối mạnh: 'Das stimmt nicht' (Không đúng).",
    vocabulary: [
      { word: "die Meinung", en: "opinion", vi: "ý kiến", pos: "noun (f)", pronunciation_vi: "đi MAI-nung" },
      { word: "der Unterschied", en: "difference", vi: "sự khác biệt", pos: "noun (m)", pronunciation_vi: "đe-a UN-tờ-shi-t" },
      { word: "die Wahrheit", en: "truth", vi: "sự thật", pos: "noun (f)", pronunciation_vi: "đi VA-hait" },
      { word: "zustimmen", en: "to agree", vi: "đồng ý", pos: "verb (separable)", pronunciation_vi: "TSU-shtim-mần" },
      { word: "ablehnen", en: "to reject", vi: "từ chối", pos: "verb (separable)", pronunciation_vi: "AP-lê-nần" },
      { word: "widersprechen", en: "to contradict", vi: "phản đối", pos: "verb", pronunciation_vi: "vi-đờ-SHPRÊ-khần" },
      { word: "richtig", en: "correct", vi: "đúng", pos: "adjective", pronunciation_vi: "RỊT-tị" },
      { word: "falsch", en: "wrong", vi: "sai", pos: "adjective", pronunciation_vi: "PHALSH" },
      { word: "vielleicht", en: "perhaps", vi: "có thể", pos: "adverb", pronunciation_vi: "phi-LAIT" },
      { word: "natürlich", en: "of course", vi: "tất nhiên", pos: "adverb", pronunciation_vi: "na-TUYR-lị" },
    ],
    dialogue: [
      { speaker: "A", text: "Ich finde, Berlin ist die schönste Stadt in Deutschland.", vi: "Tôi thấy Berlin là thành phố đẹp nhất Đức." },
      { speaker: "B", text: "Da bin ich anderer Meinung. München ist schöner.", vi: "Tôi nghĩ khác. München đẹp hơn." },
      { speaker: "A", text: "Wirklich? Warum?", vi: "Thật à? Tại sao?" },
      { speaker: "B", text: "Wegen der Berge und der Natur.", vi: "Vì có núi và thiên nhiên." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ phù hợp:",
        pronunciation_focus: [],
        items: [
          { prompt: "Ich _____ dir _____. (đồng ý)", answer: "stimme ... zu" },
          { prompt: "Das ist _____. (đúng)", answer: "richtig" },
          { prompt: "Ich bin nicht _____. (đồng ý)", answer: "einverstanden" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "die Meinung", answer: "ý kiến" },
          { prompt: "vielleicht", answer: "có thể" },
          { prompt: "natürlich", answer: "tất nhiên" },
          { prompt: "widersprechen", answer: "phản đối" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Tôi hoàn toàn đồng ý.", answer: "Da bin ich ganz Ihrer Meinung." },
          { prompt: "Tôi nhìn vấn đề khác.", answer: "Das sehe ich anders." },
          { prompt: "Đúng vậy.", answer: "Das stimmt." },
        ],
      },
    ],
  },
  {
    id: "german_emotions_expressions",
    level: "B1",
    category: "expressions",
    title_vi: "Diễn đạt cảm xúc",
    title_en: "Expressing emotions",
    sentences: [
      {
        en: "Ich freue mich auf das Wochenende.",
        vi: "Tôi mong chờ cuối tuần.",
        pronunciation_focus: ["freue mich → PHROI-ờ mịt", "auf → ao-phờ", "Wochenende → VÔ-khần-ên-đờ"],
      },
      {
        en: "Das macht mir Spaß.",
        vi: "Cái này tôi thích.",
        pronunciation_focus: ["macht → MÁCT", "mir → mia", "Spaß → SHPAS — 'ß' = ss"],
      },
      {
        en: "Ich bin enttäuscht.",
        vi: "Tôi thất vọng.",
        pronunciation_focus: ["enttäuscht → ent-TÔISHT — 'äu' = oi", "bin → bin", "ent → ent"],
      },
      {
        en: "Es tut mir wirklich leid.",
        vi: "Tôi thực sự rất tiếc.",
        pronunciation_focus: ["wirklich → VIA-lị-khờ", "leid → LAI-t", "es → ês"],
      },
      {
        en: "Ich habe Angst vor der Prüfung.",
        vi: "Tôi sợ kỳ thi.",
        pronunciation_focus: ["Angst → ANGST", "vor → phô", "Prüfung → PRUY-phung — 'ü' tròn"],
      },
    ],
    cultural_notes_vi:
      "Người Đức không phô trương cảm xúc trong giao tiếp công cộng như người Mỹ. 'Wie geht's?' (Khoẻ không?) câu hỏi xã giao thường được trả lời bằng 'Gut, danke' (Tốt, cám ơn) ngay cả khi không thực sự tốt. Chia sẻ cảm xúc sâu hơn với bạn thân hoặc gia đình. 'Es tut mir leid' (xin lỗi/tiếc) khi nghe tin xấu — nói thẳng, không vòng vo.",
    tip_advice_vi:
      "Động từ phản thân (reflexive verbs) như 'sich freuen', 'sich ärgern' luôn đi với 'mich/dich/sich'. 'Ich freue MICH' (tôi vui), 'Du ärgerst DICH' (bạn bực). Đây là đặc điểm khác tiếng Anh — học cùng từ vựng, đừng quên 'mich/dich'.",
    vocabulary: [
      { word: "die Freude", en: "joy", vi: "niềm vui", pos: "noun (f)", pronunciation_vi: "đi PHROI-đờ" },
      { word: "die Angst", en: "fear", vi: "nỗi sợ", pos: "noun (f)", pronunciation_vi: "đi ANGST" },
      { word: "die Liebe", en: "love", vi: "tình yêu", pos: "noun (f)", pronunciation_vi: "đi LI-bờ" },
      { word: "die Sorge", en: "worry", vi: "lo lắng", pos: "noun (f)", pronunciation_vi: "đi ZÔ-gờ" },
      { word: "der Spaß", en: "fun", vi: "niềm vui/sự thích", pos: "noun (m)", pronunciation_vi: "đe-a SHPAS" },
      { word: "sich freuen", en: "to be happy", vi: "vui mừng", pos: "reflexive verb", pronunciation_vi: "zịc PHROI-ần" },
      { word: "sich ärgern", en: "to be annoyed", vi: "bực mình", pos: "reflexive verb", pronunciation_vi: "zịc Ế-gần — 'ä' = e" },
      { word: "weinen", en: "to cry", vi: "khóc", pos: "verb", pronunciation_vi: "VAI-nần" },
      { word: "lachen", en: "to laugh", vi: "cười", pos: "verb", pronunciation_vi: "LA-khần" },
      { word: "enttäuscht", en: "disappointed", vi: "thất vọng", pos: "adjective", pronunciation_vi: "ent-TÔISHT" },
    ],
    dialogue: [
      { speaker: "A", text: "Wie geht es dir? Du siehst traurig aus.", vi: "Bạn sao rồi? Trông buồn quá." },
      { speaker: "B", text: "Ich habe meine Prüfung nicht bestanden.", vi: "Tôi không qua kỳ thi." },
      { speaker: "A", text: "Das tut mir leid. Aber du kannst es nochmal versuchen.", vi: "Tôi rất tiếc. Nhưng bạn có thể thử lại." },
      { speaker: "B", text: "Du hast recht. Ich gebe nicht auf.", vi: "Bạn nói đúng. Tôi sẽ không bỏ cuộc." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ cảm xúc:",
        pronunciation_focus: [],
        items: [
          { prompt: "Das macht mir _____. (niềm vui/sự thích)", answer: "Spaß" },
          { prompt: "Ich habe _____ vor der Prüfung. (nỗi sợ)", answer: "Angst" },
          { prompt: "Ich bin _____. (thất vọng)", answer: "enttäuscht" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "die Liebe", answer: "tình yêu" },
          { prompt: "die Sorge", answer: "lo lắng" },
          { prompt: "weinen", answer: "khóc" },
          { prompt: "lachen", answer: "cười" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Tôi mong chờ cuối tuần.", answer: "Ich freue mich auf das Wochenende." },
          { prompt: "Tôi thực sự rất tiếc.", answer: "Es tut mir wirklich leid." },
          { prompt: "Cái này tôi thích.", answer: "Das macht mir Spaß." },
        ],
      },
    ],
  },
  {
    id: "german_phone_calls",
    level: "B1",
    category: "expressions",
    title_vi: "Gọi điện thoại",
    title_en: "Phone calls",
    sentences: [
      {
        en: "Hallo, hier ist Anna Schmidt.",
        vi: "Alô, đây là Anna Schmidt.",
        pronunciation_focus: ["Hallo → HA-lô", "hier → HÍA", "ist → ÍST"],
      },
      {
        en: "Kann ich bitte mit Herrn Müller sprechen?",
        vi: "Tôi có thể nói chuyện với ông Müller được không?",
        pronunciation_focus: ["Herrn → HE-an", "Müller → MUYL-lờ — 'ü' tròn", "sprechen → SHPRÊ-khần"],
      },
      {
        en: "Einen Moment bitte, ich verbinde Sie.",
        vi: "Xin chờ một lát, tôi nối máy.",
        pronunciation_focus: ["Einen → AI-nần", "Moment → mô-MENT", "verbinde → phờ-BÍN-đờ"],
      },
      {
        en: "Er ist gerade nicht da. Soll er zurückrufen?",
        vi: "Ông ấy đang không có. Có cần gọi lại không?",
        pronunciation_focus: ["gerade → gờ-RA-đờ", "Soll → ZÔN", "zurückrufen → tsu-RUYC-ru-phần"],
      },
      {
        en: "Auf Wiederhören.",
        vi: "Tạm biệt (qua điện thoại).",
        pronunciation_focus: ["Auf → ao-phờ", "Wieder → VÍ-đợ", "hören → HƠ-rần — 'ö' tròn"],
      },
    ],
    cultural_notes_vi:
      "Người Đức trả lời điện thoại khác phương Tây khác — họ tự xưng tên ngay: 'Schmidt' hoặc 'Hier ist Schmidt'. Không nói 'Hallo' đơn giản như Mỹ. Khi gọi đến công ty: nói tên mình + lý do gọi trong câu mở đầu. 'Auf Wiederhören' (tạm biệt qua điện thoại) khác 'Auf Wiedersehen' (tạm biệt mặt đối mặt) — đừng nhầm.",
    tip_advice_vi:
      "Số điện thoại Đức đọc theo cặp: 030 12345678 → 'null-drei-null, eins-zwei, drei-vier, fünf-sechs, sieben-acht'. Hoặc đọc cặp: 'zwölf, vierunddreißig, sechsundfünfzig, achtundsiebzig'. Khi không nghe rõ: 'Können Sie das wiederholen?' (bạn lặp lại được không?) hoặc 'Buchstabieren Sie das, bitte' (xin đánh vần).",
    vocabulary: [
      { word: "das Telefon", en: "telephone", vi: "điện thoại", pos: "noun (n)", pronunciation_vi: "đát tê-lê-PHÔN" },
      { word: "das Handy", en: "mobile phone", vi: "điện thoại di động", pos: "noun (n)", pronunciation_vi: "đát HEN-đi" },
      { word: "der Anruf", en: "phone call", vi: "cuộc gọi", pos: "noun (m)", pronunciation_vi: "đe-a AN-ruph" },
      { word: "die Nummer", en: "number", vi: "số", pos: "noun (f)", pronunciation_vi: "đi NÚM-mờ" },
      { word: "die Mailbox", en: "voicemail", vi: "hộp thư thoại", pos: "noun (f)", pronunciation_vi: "đi MÊN-bốc-x" },
      { word: "anrufen", en: "to call", vi: "gọi điện", pos: "verb (separable)", pronunciation_vi: "AN-ru-phần" },
      { word: "verbinden", en: "to connect", vi: "nối máy", pos: "verb", pronunciation_vi: "phờ-BÍN-đần" },
      { word: "auflegen", en: "to hang up", vi: "gác máy", pos: "verb (separable)", pronunciation_vi: "AOPH-lê-gần" },
      { word: "klingeln", en: "to ring", vi: "đổ chuông", pos: "verb", pronunciation_vi: "CLING-ần" },
      { word: "besetzt", en: "busy", vi: "đang bận", pos: "adjective", pronunciation_vi: "bờ-ZẾT-st" },
    ],
    dialogue: [
      { speaker: "A", text: "Guten Tag, Praxis Dr. Weber. Wie kann ich Ihnen helfen?", vi: "Xin chào, phòng khám bác sĩ Weber. Tôi giúp gì cho bạn?" },
      { speaker: "B", text: "Hallo, ich möchte einen Termin vereinbaren.", vi: "Alô, tôi muốn đặt cuộc hẹn." },
      { speaker: "A", text: "Geht es nächste Woche Donnerstag um zehn Uhr?", vi: "Thứ Năm tuần sau lúc 10 giờ được không?" },
      { speaker: "B", text: "Ja, das passt. Vielen Dank. Auf Wiederhören.", vi: "Vâng, được. Cám ơn. Tạm biệt." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về điện thoại:",
        pronunciation_focus: [],
        items: [
          { prompt: "Hallo, _____ ist Anna. (đây)", answer: "hier" },
          { prompt: "Einen Moment, ich _____ Sie. (nối máy)", answer: "verbinde" },
          { prompt: "Auf _____. (tạm biệt qua điện thoại)", answer: "Wiederhören" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "der Anruf", answer: "cuộc gọi" },
          { prompt: "die Mailbox", answer: "hộp thư thoại" },
          { prompt: "auflegen", answer: "gác máy" },
          { prompt: "besetzt", answer: "đang bận" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Tôi có thể nói chuyện với ông Müller không?", answer: "Kann ich mit Herrn Müller sprechen?" },
          { prompt: "Ông ấy đang không có.", answer: "Er ist gerade nicht da." },
          { prompt: "Tạm biệt (qua điện thoại).", answer: "Auf Wiederhören." },
        ],
      },
    ],
  },
  {
    id: "german_small_talk",
    level: "B1",
    category: "expressions",
    title_vi: "Trò chuyện xã giao",
    title_en: "Small talk",
    sentences: [
      {
        en: "Schönes Wetter heute, nicht wahr?",
        vi: "Hôm nay thời tiết đẹp nhỉ?",
        pronunciation_focus: ["Schönes → SHƠ-nợs — 'ö' tròn", "Wetter → VẾT-tờ", "wahr → vA"],
      },
      {
        en: "Wie war Ihr Wochenende?",
        vi: "Cuối tuần của bạn thế nào?",
        pronunciation_focus: ["war → vA", "Ihr → ÍA — 'Sie' lịch sự", "Wochenende → VÔ-khần-ên-đờ"],
      },
      {
        en: "Ich war im Urlaub in Spanien.",
        vi: "Tôi đi nghỉ ở Tây Ban Nha.",
        pronunciation_focus: ["Urlaub → ÚA-lao-phờ", "Spanien → SHPA-ni-ần", "war → vA"],
      },
      {
        en: "Was machen Sie beruflich?",
        vi: "Bạn làm nghề gì?",
        pronunciation_focus: ["machen → MA-khần", "beruflich → bờ-RUPH-lị-khờ", "Sie → ZI"],
      },
      {
        en: "Es war schön, Sie kennenzulernen.",
        vi: "Rất vui được gặp bạn.",
        pronunciation_focus: ["schön → SHƠN — 'ö' tròn", "kennenzulernen → KE-nần-tsu-le-nần", "động từ tách"],
      },
    ],
    cultural_notes_vi:
      "Small talk Đức không sâu rộng như Mỹ. Chủ đề an toàn: thời tiết, ngày lễ vừa qua, kế hoạch cuối tuần, nghề nghiệp. TRÁNH: lương, chính trị (ngoại trừ với bạn thân), tôn giáo, tuổi (đặc biệt với phụ nữ). Người Đức không cần lấp khoảng lặng bằng nói chuyện — im lặng là bình thường.",
    tip_advice_vi:
      "'Nicht wahr?' (phải không?) cuối câu là cách mời hồi đáp lịch sự. Hỏi nghề: 'Was machen Sie beruflich?' formal hơn 'Was sind Sie von Beruf?'. Thì quá khứ small talk dùng Perfekt: 'Ich habe ___ gemacht/gesehen/gegessen' — đây là hình thức đơn giản nhất cho tiếng nói hàng ngày.",
    vocabulary: [
      { word: "das Wetter", en: "weather", vi: "thời tiết", pos: "noun (n)", pronunciation_vi: "đát VẾT-tờ" },
      { word: "das Wochenende", en: "weekend", vi: "cuối tuần", pos: "noun (n)", pronunciation_vi: "đát VÔ-khần-ên-đờ" },
      { word: "der Urlaub", en: "vacation", vi: "kỳ nghỉ", pos: "noun (m)", pronunciation_vi: "đe-a ÚA-lao-phờ" },
      { word: "das Hobby", en: "hobby", vi: "sở thích", pos: "noun (n)", pronunciation_vi: "đát HÔ-bi" },
      { word: "die Familie", en: "family", vi: "gia đình", pos: "noun (f)", pronunciation_vi: "đi pha-MI-li-ờ" },
      { word: "kennenlernen", en: "to get to know", vi: "làm quen", pos: "verb (separable)", pronunciation_vi: "KE-nần-le-nần" },
      { word: "erzählen", en: "to tell", vi: "kể", pos: "verb", pronunciation_vi: "ê-TSEỊ-lần — 'ä' = e" },
      { word: "fragen", en: "to ask", vi: "hỏi", pos: "verb", pronunciation_vi: "PHRA-gần" },
      { word: "interessant", en: "interesting", vi: "thú vị", pos: "adjective", pronunciation_vi: "in-tê-rê-SANT" },
      { word: "langweilig", en: "boring", vi: "chán", pos: "adjective", pronunciation_vi: "LANG-vai-lị" },
    ],
    dialogue: [
      { speaker: "A", text: "Schönes Wetter heute!", vi: "Hôm nay thời tiết đẹp!" },
      { speaker: "B", text: "Ja, endlich Sonne. Was haben Sie am Wochenende gemacht?", vi: "Vâng, cuối cùng cũng có nắng. Cuối tuần bạn làm gì?" },
      { speaker: "A", text: "Ich war wandern. Und Sie?", vi: "Tôi đi leo núi. Còn bạn?" },
      { speaker: "B", text: "Ich war zu Hause und habe ein Buch gelesen.", vi: "Tôi ở nhà và đọc sách." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ trò chuyện:",
        pronunciation_focus: [],
        items: [
          { prompt: "Schönes _____ heute. (thời tiết)", answer: "Wetter" },
          { prompt: "Wie war Ihr _____? (cuối tuần)", answer: "Wochenende" },
          { prompt: "Was machen Sie _____? (nghề nghiệp)", answer: "beruflich" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "der Urlaub", answer: "kỳ nghỉ" },
          { prompt: "das Hobby", answer: "sở thích" },
          { prompt: "interessant", answer: "thú vị" },
          { prompt: "kennenlernen", answer: "làm quen" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Hôm nay thời tiết đẹp.", answer: "Schönes Wetter heute." },
          { prompt: "Tôi đi nghỉ ở Tây Ban Nha.", answer: "Ich war im Urlaub in Spanien." },
          { prompt: "Rất vui được gặp bạn.", answer: "Es war schön, Sie kennenzulernen." },
        ],
      },
    ],
  },
];

// ── 41–45. Advanced grammar ─────────────────────────────────────────────

const ADVANCED_GRAMMAR: GermanLesson[] = [
  {
    id: "german_separable_verbs",
    level: "B1",
    category: "advanced_grammar",
    title_vi: "Động từ tách (Trennbare Verben)",
    title_en: "Separable verbs",
    sentences: [
      {
        en: "Ich stehe um sieben Uhr auf.",
        vi: "Tôi dậy lúc 7 giờ.",
        pronunciation_focus: ["stehe → SHTÊ-ờ", "auf → ao-phờ — phần tách nhảy ra cuối", "động từ aufstehen"],
      },
      {
        en: "Wann fängt der Film an?",
        vi: "Khi nào phim bắt đầu?",
        pronunciation_focus: ["fängt → PHENG-t — 'ä' = e", "an → an — phần tách", "động từ anfangen"],
      },
      {
        en: "Ich rufe dich morgen an.",
        vi: "Tôi sẽ gọi bạn ngày mai.",
        pronunciation_focus: ["rufe → RU-phờ", "an → an — phần tách cuối câu", "morgen → MO-gần"],
      },
      {
        en: "Sie zieht ihren Mantel aus.",
        vi: "Cô ấy cởi áo khoác ra.",
        pronunciation_focus: ["zieht → TSÍT", "aus → ao-s — phần tách", "Mantel → MAN-tần"],
      },
      {
        en: "Wir kommen am Sonntag zurück.",
        vi: "Chúng tôi quay về Chủ nhật.",
        pronunciation_focus: ["kommen → CÔM-mần", "zurück → tsu-RUYC — phần tách", "Sonntag → ZÔN-tác"],
      },
    ],
    cultural_notes_vi:
      "Động từ tách là đặc trưng tiếng Đức không có tương đương trong nhiều ngôn ngữ khác. Ví dụ: 'aufstehen' (thức dậy) gồm 'auf' + 'stehen'. Khi chia ở thì hiện tại, phần 'auf' nhảy ra cuối câu: 'Ich stehe ... auf'. Nhấn trọng âm rơi vào phần tách: AUF-stehen, AN-rufen, MIT-kommen.",
    tip_advice_vi:
      "Cách học: nhớ động từ kèm phần tách như một đơn vị. Khi viết câu, đặt động từ chính ở vị trí thứ 2 và 'đẩy' phần tách ra cuối: 'Ich [STELLE]² den Wecker [AN]ᶜᵘᵒ̂ⁱ' (Tôi đặt báo thức). Trong câu phụ (với 'weil', 'dass'), động từ ghép lại nguyên: 'weil ich aufstehe' (vì tôi thức dậy).",
    vocabulary: [
      { word: "aufstehen", en: "to get up", vi: "thức dậy", pos: "verb (separable: auf-)", pronunciation_vi: "AO-phờ-shtê-ần" },
      { word: "anfangen", en: "to start", vi: "bắt đầu", pos: "verb (separable: an-)", pronunciation_vi: "AN-phan-gần" },
      { word: "anrufen", en: "to call", vi: "gọi điện", pos: "verb (separable: an-)", pronunciation_vi: "AN-ru-phần" },
      { word: "ausziehen", en: "to take off", vi: "cởi ra", pos: "verb (separable: aus-)", pronunciation_vi: "AO-s-tsi-hần" },
      { word: "anziehen", en: "to put on", vi: "mặc vào", pos: "verb (separable: an-)", pronunciation_vi: "AN-tsi-hần" },
      { word: "zurückkommen", en: "to come back", vi: "quay về", pos: "verb (separable: zurück-)", pronunciation_vi: "tsu-RUYC-côm-mần" },
      { word: "einkaufen", en: "to shop", vi: "đi mua sắm", pos: "verb (separable: ein-)", pronunciation_vi: "AIN-cao-phần" },
      { word: "mitkommen", en: "to come along", vi: "đi cùng", pos: "verb (separable: mit-)", pronunciation_vi: "MÍT-côm-mần" },
      { word: "vorbereiten", en: "to prepare", vi: "chuẩn bị", pos: "verb (separable: vor-)", pronunciation_vi: "PHÔ-bờ-rai-tần" },
      { word: "aufhören", en: "to stop", vi: "dừng lại", pos: "verb (separable: auf-)", pronunciation_vi: "AO-phờ-hơ-rần" },
    ],
    dialogue: [
      { speaker: "A", text: "Wann stehst du normalerweise auf?", vi: "Bạn thường thức dậy lúc nào?" },
      { speaker: "B", text: "Ich stehe um sechs Uhr auf. Und du?", vi: "Tôi dậy lúc 6 giờ. Còn bạn?" },
      { speaker: "A", text: "Ich kaufe dann ein und fange um neun mit der Arbeit an.", vi: "Tôi đi mua sắm rồi bắt đầu làm việc lúc 9 giờ." },
      { speaker: "B", text: "Rufst du mich später an?", vi: "Bạn gọi tôi sau nhé?" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chia động từ tách (phần tách nhảy ra cuối):",
        pronunciation_focus: ["động từ tách"],
        items: [
          { prompt: "Ich _____ um sieben Uhr _____. (aufstehen — thức dậy)", answer: "stehe ... auf" },
          { prompt: "Sie _____ ihn morgen _____. (anrufen — gọi)", answer: "ruft ... an" },
          { prompt: "Wir _____ um acht _____. (anfangen — bắt đầu)", answer: "fangen ... an" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối động từ tách với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "aufstehen", answer: "thức dậy" },
          { prompt: "einkaufen", answer: "đi mua sắm" },
          { prompt: "mitkommen", answer: "đi cùng" },
          { prompt: "aufhören", answer: "dừng lại" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức (chú ý động từ tách):",
        pronunciation_focus: [],
        items: [
          { prompt: "Tôi dậy lúc 7 giờ.", answer: "Ich stehe um sieben Uhr auf." },
          { prompt: "Khi nào phim bắt đầu?", answer: "Wann fängt der Film an?" },
          { prompt: "Tôi sẽ gọi bạn ngày mai.", answer: "Ich rufe dich morgen an." },
        ],
      },
    ],
  },
  {
    id: "german_perfekt_tense",
    level: "B1",
    category: "advanced_grammar",
    title_vi: "Thì hoàn thành (Perfekt)",
    title_en: "Perfekt tense",
    sentences: [
      {
        en: "Ich habe gestern Pizza gegessen.",
        vi: "Hôm qua tôi đã ăn pizza.",
        pronunciation_focus: ["habe → HA-bờ", "gegessen → gờ-GHÊ-sần", "cấu trúc: haben + Partizip II"],
      },
      {
        en: "Sie ist nach Berlin gefahren.",
        vi: "Cô ấy đã đi Berlin.",
        pronunciation_focus: ["ist → ÍST — động từ chuyển động dùng 'sein'", "gefahren → gờ-PHA-rần", "ist + Partizip II"],
      },
      {
        en: "Wir haben den Film schon gesehen.",
        vi: "Chúng tôi đã xem phim đó rồi.",
        pronunciation_focus: ["haben → HA-bần", "gesehen → gờ-ZÊ-ần", "schon → SHÔN"],
      },
      {
        en: "Hast du gut geschlafen?",
        vi: "Bạn ngủ ngon không?",
        pronunciation_focus: ["Hast → HASTỜ", "geschlafen → gờ-SHLA-phần", "câu hỏi: động từ ở đầu"],
      },
      {
        en: "Er ist um zehn Uhr angekommen.",
        vi: "Anh ấy đến lúc 10 giờ.",
        pronunciation_focus: ["ist → ÍST", "angekommen → AN-gờ-côm-mần — Partizip II của ankommen", "động từ tách + Perfekt"],
      },
    ],
    cultural_notes_vi:
      "Người Đức nói chuyện hàng ngày dùng Perfekt cho thì quá khứ, không phải Präteritum (trừ động từ 'sein', 'haben', 'wissen' và động từ khuyết thiếu). 'Ich habe gegessen' tự nhiên hơn 'Ich aß' trong nói chuyện. Präteritum chủ yếu dùng trong văn viết, sách báo, kể chuyện. Học Perfekt là ưu tiên cho giao tiếp.",
    tip_advice_vi:
      "Quy tắc trợ động từ: dùng 'sein' (là) cho động từ chuyển động (gehen, fahren, kommen, fliegen) và động từ thay đổi trạng thái (sterben - chết, einschlafen - ngủ thiếp). Dùng 'haben' (có) cho phần lớn còn lại. Khi không chắc, dùng 'haben' — sai 90% trường hợp ít hơn 'sein'.",
    vocabulary: [
      { word: "haben", en: "to have (auxiliary)", vi: "có (trợ động từ)", pos: "verb (auxiliary)", pronunciation_vi: "HA-bần" },
      { word: "sein", en: "to be (auxiliary)", vi: "là (trợ động từ)", pos: "verb (auxiliary)", pronunciation_vi: "ZAIN" },
      { word: "gegessen", en: "eaten", vi: "đã ăn (P2)", pos: "Partizip II", pronunciation_vi: "gờ-GHÊ-sần" },
      { word: "getrunken", en: "drunk", vi: "đã uống (P2)", pos: "Partizip II", pronunciation_vi: "gờ-TRUNG-kần" },
      { word: "gegangen", en: "went", vi: "đã đi (P2)", pos: "Partizip II", pronunciation_vi: "gờ-GANG-ần" },
      { word: "gefahren", en: "drove/went", vi: "đã đi (xe)", pos: "Partizip II", pronunciation_vi: "gờ-PHA-rần" },
      { word: "gesehen", en: "seen", vi: "đã thấy (P2)", pos: "Partizip II", pronunciation_vi: "gờ-ZÊ-ần" },
      { word: "geschlafen", en: "slept", vi: "đã ngủ (P2)", pos: "Partizip II", pronunciation_vi: "gờ-SHLA-phần" },
      { word: "gekommen", en: "came", vi: "đã đến (P2)", pos: "Partizip II", pronunciation_vi: "gờ-CÔM-mần" },
      { word: "gemacht", en: "did/made", vi: "đã làm (P2)", pos: "Partizip II", pronunciation_vi: "gờ-MÁCT" },
    ],
    dialogue: [
      { speaker: "A", text: "Was hast du am Wochenende gemacht?", vi: "Cuối tuần bạn đã làm gì?" },
      { speaker: "B", text: "Ich bin nach München gefahren und habe Freunde besucht.", vi: "Tôi đi München và thăm bạn bè." },
      { speaker: "A", text: "Schön! Habt ihr etwas Besonderes gemacht?", vi: "Hay quá! Các bạn có làm gì đặc biệt không?" },
      { speaker: "B", text: "Wir haben ein Konzert besucht und sehr gut gegessen.", vi: "Chúng tôi đi xem hoà nhạc và ăn rất ngon." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền trợ động từ haben hoặc sein:",
        pronunciation_focus: ["sein cho động từ chuyển động/thay đổi trạng thái, haben cho phần lớn còn lại"],
        items: [
          { prompt: "Ich _____ Pizza gegessen. (haben/sein)", answer: "habe" },
          { prompt: "Sie _____ nach Berlin gefahren. (haben/sein)", answer: "ist" },
          { prompt: "Wir _____ den Film gesehen. (haben/sein)", answer: "haben" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối Partizip II với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "gegessen", answer: "đã ăn" },
          { prompt: "getrunken", answer: "đã uống" },
          { prompt: "gefahren", answer: "đã đi (xe)" },
          { prompt: "geschlafen", answer: "đã ngủ" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức (dùng Perfekt):",
        pronunciation_focus: [],
        items: [
          { prompt: "Hôm qua tôi đã ăn pizza.", answer: "Ich habe gestern Pizza gegessen." },
          { prompt: "Cô ấy đã đi Berlin.", answer: "Sie ist nach Berlin gefahren." },
          { prompt: "Bạn ngủ ngon không?", answer: "Hast du gut geschlafen?" },
        ],
      },
    ],
  },
  {
    id: "german_modal_verbs",
    level: "B1",
    category: "advanced_grammar",
    title_vi: "Động từ khuyết thiếu",
    title_en: "Modal verbs",
    sentences: [
      {
        en: "Ich kann Deutsch sprechen.",
        vi: "Tôi có thể nói tiếng Đức.",
        pronunciation_focus: ["kann → can", "Deutsch → ĐÔIT-shờ", "sprechen → SHPRÊ-khần"],
      },
      {
        en: "Du musst die Hausaufgaben machen.",
        vi: "Bạn phải làm bài tập về nhà.",
        pronunciation_focus: ["musst → mUST", "Hausaufgaben → HAO-s-ao-phờ-ga-bần", "machen → MA-khần"],
      },
      {
        en: "Wir wollen ins Kino gehen.",
        vi: "Chúng tôi muốn đi xem phim.",
        pronunciation_focus: ["wollen → VÔ-lần", "Kino → KI-nô", "gehen → GHÊ-ần"],
      },
      {
        en: "Sie soll heute kommen.",
        vi: "Cô ấy được kỳ vọng đến hôm nay.",
        pronunciation_focus: ["soll → ZÔN", "heute → HÔI-tờ", "kommen → CÔM-mần"],
      },
      {
        en: "Darf ich hier rauchen?",
        vi: "Tôi được phép hút thuốc ở đây không?",
        pronunciation_focus: ["Darf → ĐÁPH-ờ", "hier → HÍA", "rauchen → RAO-khần"],
      },
    ],
    cultural_notes_vi:
      "Phân biệt 'müssen' (phải - bắt buộc) vs 'sollen' (nên - được kỳ vọng): 'Ich muss arbeiten' (tôi phải đi làm - bắt buộc); 'Ich soll arbeiten' (tôi nên đi làm - ai đó nói tôi nên). 'Dürfen' (được phép) khác 'können' (có thể): 'Kann ich hier parken?' (Tôi có thể đỗ xe ở đây không? - kỹ thuật) vs 'Darf ich hier parken?' (Tôi được phép đỗ xe ở đây không? - về luật).",
    tip_advice_vi:
      "Cấu trúc: Modal + động từ chính ở dạng nguyên (Infinitiv) ở cuối câu. 'Ich [KANN]² gut Deutsch [SPRECHEN]ᶜᵘᵒ̂ⁱ' (Tôi nói tiếng Đức tốt). Động từ chính KHÔNG chia, chỉ modal chia. Đây là quy tắc ổn định cho mọi modal.",
    vocabulary: [
      { word: "können", en: "can/be able to", vi: "có thể", pos: "modal verb", pronunciation_vi: "KƠN-nần — 'ö' tròn" },
      { word: "müssen", en: "must/have to", vi: "phải", pos: "modal verb", pronunciation_vi: "MUYS-sần — 'ü' tròn" },
      { word: "wollen", en: "want to", vi: "muốn", pos: "modal verb", pronunciation_vi: "VÔ-lần" },
      { word: "sollen", en: "should/be supposed to", vi: "nên/được kỳ vọng", pos: "modal verb", pronunciation_vi: "ZÔ-lần" },
      { word: "dürfen", en: "may/be allowed", vi: "được phép", pos: "modal verb", pronunciation_vi: "ĐUYR-phần — 'ü' tròn" },
      { word: "möchten", en: "would like to", vi: "muốn (lịch sự)", pos: "modal verb (Konj II)", pronunciation_vi: "MƠỊC-tần — 'ö' tròn" },
      { word: "die Hausaufgabe", en: "homework", vi: "bài tập về nhà", pos: "noun (f)", pronunciation_vi: "đi HAO-s-ao-phờ-ga-bờ" },
      { word: "rauchen", en: "to smoke", vi: "hút thuốc", pos: "verb", pronunciation_vi: "RAO-khần" },
      { word: "die Erlaubnis", en: "permission", vi: "sự cho phép", pos: "noun (f)", pronunciation_vi: "đi ê-LAO-pnis" },
      { word: "die Pflicht", en: "duty", vi: "nghĩa vụ", pos: "noun (f)", pronunciation_vi: "đi PHLỊT-ờ" },
    ],
    dialogue: [
      { speaker: "A", text: "Kannst du mir helfen?", vi: "Bạn giúp tôi được không?" },
      { speaker: "B", text: "Ja, aber ich muss zuerst meine Arbeit fertig machen.", vi: "Vâng, nhưng tôi phải làm xong việc trước đã." },
      { speaker: "A", text: "Wann darf ich dich anrufen?", vi: "Khi nào tôi có thể gọi bạn?" },
      { speaker: "B", text: "Ab fünf Uhr. Dann will ich gerne mit dir reden.", vi: "Từ 5 giờ. Lúc đó tôi sẽ vui vẻ nói chuyện với bạn." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chia động từ khuyết thiếu:",
        pronunciation_focus: ["chú ý: ngôi 'ich' và 'er/sie' không có đuôi -e/-t cho modals"],
        items: [
          { prompt: "Ich _____ Deutsch sprechen. (können — có thể)", answer: "kann" },
          { prompt: "Du _____ die Hausaufgaben machen. (müssen — phải)", answer: "musst" },
          { prompt: "Wir _____ ins Kino gehen. (wollen — muốn)", answer: "wollen" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối modal với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "können", answer: "có thể" },
          { prompt: "müssen", answer: "phải" },
          { prompt: "dürfen", answer: "được phép" },
          { prompt: "möchten", answer: "muốn (lịch sự)" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Tôi có thể nói tiếng Đức.", answer: "Ich kann Deutsch sprechen." },
          { prompt: "Bạn phải làm bài tập về nhà.", answer: "Du musst die Hausaufgaben machen." },
          { prompt: "Tôi được phép hút thuốc ở đây không?", answer: "Darf ich hier rauchen?" },
        ],
      },
    ],
  },
  {
    id: "german_subordinate_clauses",
    level: "B1",
    category: "advanced_grammar",
    title_vi: "Câu phụ (Nebensätze)",
    title_en: "Subordinate clauses",
    sentences: [
      {
        en: "Ich weiß, dass du Recht hast.",
        vi: "Tôi biết bạn nói đúng.",
        pronunciation_focus: ["weiß → vAIS — 'ß' = ss", "dass → đás — liên từ", "động từ ở cuối câu phụ"],
      },
      {
        en: "Ich gehe nicht, weil ich krank bin.",
        vi: "Tôi không đi vì tôi ốm.",
        pronunciation_focus: ["weil → vAIN", "krank → CRANK", "bin → bin — động từ ở cuối"],
      },
      {
        en: "Wenn es regnet, bleibe ich zu Hause.",
        vi: "Nếu trời mưa, tôi ở nhà.",
        pronunciation_focus: ["Wenn → vEN", "regnet → RÊK-nết", "bleibe → BLAI-bờ"],
      },
      {
        en: "Sie fragt, ob ich kommen kann.",
        vi: "Cô ấy hỏi liệu tôi có thể đến không.",
        pronunciation_focus: ["fragt → PHRÁCT", "ob → ốp — liệu/có không", "kann → can — modal ở cuối"],
      },
      {
        en: "Obwohl es kalt ist, gehe ich spazieren.",
        vi: "Mặc dù trời lạnh, tôi vẫn đi dạo.",
        pronunciation_focus: ["Obwohl → ốp-VÔN", "kalt → CANT", "spazieren → shpa-TSI-rần"],
      },
    ],
    cultural_notes_vi:
      "Câu phụ (Nebensätze) là điểm khó nhưng quan trọng nhất tiếng Đức ở mức B1. Quy tắc bất di bất dịch: trong câu phụ, ĐỘNG TỪ ĐỨNG CUỐI. 'Ich denke, dass er kommt' (Tôi nghĩ rằng anh ấy đến) — 'kommt' ở cuối, không phải 'dass kommt er'. Khi câu phụ đứng trước, động từ chính của câu chính nhảy lên ngay sau dấu phẩy: 'Wenn es regnet, [BLEIBE] ich' (Nếu mưa, tôi ở lại).",
    tip_advice_vi:
      "Cách nhớ: 'weil' (bởi vì) đẩy động từ ra cuối, 'denn' (bởi vì - liên từ đẳng lập) KHÔNG đẩy. So sánh: 'Ich gehe nicht, weil ich krank BIN' (động từ cuối) vs 'Ich gehe nicht, denn ich BIN krank' (động từ vị trí 2). Cả hai cùng nghĩa, nhưng cấu trúc khác. Học 'weil' trước, 'denn' sau.",
    vocabulary: [
      { word: "dass", en: "that (conjunction)", vi: "rằng", pos: "conjunction", pronunciation_vi: "đás" },
      { word: "weil", en: "because", vi: "bởi vì", pos: "conjunction", pronunciation_vi: "vAIN" },
      { word: "wenn", en: "when/if", vi: "khi/nếu", pos: "conjunction", pronunciation_vi: "vEN" },
      { word: "ob", en: "whether/if", vi: "liệu/có không", pos: "conjunction", pronunciation_vi: "ốp" },
      { word: "obwohl", en: "although", vi: "mặc dù", pos: "conjunction", pronunciation_vi: "ốp-VÔN" },
      { word: "damit", en: "so that", vi: "để mà", pos: "conjunction", pronunciation_vi: "đa-MÍT" },
      { word: "während", en: "while", vi: "trong khi", pos: "conjunction", pronunciation_vi: "VEỊ-rần — 'ä' = e" },
      { word: "bevor", en: "before", vi: "trước khi", pos: "conjunction", pronunciation_vi: "bờ-PHÔ" },
      { word: "nachdem", en: "after", vi: "sau khi", pos: "conjunction", pronunciation_vi: "nắc-ĐÊM" },
      { word: "der Grund", en: "reason", vi: "lý do", pos: "noun (m)", pronunciation_vi: "đe-a GRUN-t" },
    ],
    dialogue: [
      { speaker: "A", text: "Warum kommst du nicht zur Party?", vi: "Tại sao bạn không đến tiệc?" },
      { speaker: "B", text: "Weil ich morgen früh arbeiten muss.", vi: "Vì tôi phải đi làm sớm sáng mai." },
      { speaker: "A", text: "Schade. Wenn du Zeit hast, ruf mich später an.", vi: "Tiếc quá. Nếu bạn có thời gian, gọi tôi sau nhé." },
      { speaker: "B", text: "Mache ich. Obwohl es spät wird, melde ich mich.", vi: "Tôi sẽ gọi. Mặc dù sẽ muộn, tôi sẽ liên lạc." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền liên từ phụ thuộc (động từ nhảy ra cuối):",
        pronunciation_focus: ["động từ luôn ở cuối câu phụ"],
        items: [
          { prompt: "Ich gehe nicht, _____ ich krank bin. (vì)", answer: "weil" },
          { prompt: "Ich weiß, _____ du Recht hast. (rằng)", answer: "dass" },
          { prompt: "_____ es regnet, bleibe ich zu Hause. (nếu)", answer: "Wenn" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối liên từ với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "obwohl", answer: "mặc dù" },
          { prompt: "damit", answer: "để mà" },
          { prompt: "während", answer: "trong khi" },
          { prompt: "bevor", answer: "trước khi" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức (chú ý vị trí động từ):",
        pronunciation_focus: [],
        items: [
          { prompt: "Tôi biết bạn nói đúng.", answer: "Ich weiß, dass du Recht hast." },
          { prompt: "Tôi không đi vì tôi ốm.", answer: "Ich gehe nicht, weil ich krank bin." },
          { prompt: "Nếu trời mưa, tôi ở nhà.", answer: "Wenn es regnet, bleibe ich zu Hause." },
        ],
      },
    ],
  },
  {
    id: "german_passive_voice",
    level: "B1",
    category: "advanced_grammar",
    title_vi: "Câu bị động (Passiv)",
    title_en: "Passive voice",
    sentences: [
      {
        en: "Das Haus wird gebaut.",
        vi: "Ngôi nhà đang được xây.",
        pronunciation_focus: ["wird → vIA-t", "gebaut → gờ-BAO-t — Partizip II", "cấu trúc: werden + P2"],
      },
      {
        en: "Hier wird Deutsch gesprochen.",
        vi: "Ở đây nói tiếng Đức.",
        pronunciation_focus: ["wird → vIA-t", "gesprochen → gờ-SHPRÔ-khần", "Hier → HÍA"],
      },
      {
        en: "Das Buch wurde 1990 geschrieben.",
        vi: "Quyển sách được viết năm 1990.",
        pronunciation_focus: ["wurde → VÚA-đờ — Präteritum của werden", "geschrieben → gờ-SHRI-bần", "Passiv quá khứ"],
      },
      {
        en: "Der Brief muss heute geschickt werden.",
        vi: "Lá thư phải được gửi hôm nay.",
        pronunciation_focus: ["muss → mUS — modal", "geschickt → gờ-SHÍCT", "werden → VEA-đần — vị trí cuối"],
      },
      {
        en: "Die Tür wird vom Wind geöffnet.",
        vi: "Cửa được gió mở.",
        pronunciation_focus: ["wird → vIA-t", "vom → phôm — von dem", "geöffnet → gờ-ƠPH-nết"],
      },
    ],
    cultural_notes_vi:
      "Câu bị động (Passiv) trong tiếng Đức rất phổ biến trong văn viết, hợp đồng, hướng dẫn, tin tức. Trong nói chuyện hàng ngày, người Đức cũng dùng Passiv khi tác nhân không quan trọng: 'Das Auto wird repariert' (Xe đang được sửa) — không quan trọng ai sửa. Cấu trúc 'man + động từ chủ động' đôi khi thay được Passiv: 'Man spricht hier Deutsch' = 'Hier wird Deutsch gesprochen'.",
    tip_advice_vi:
      "Cấu trúc Passiv hiện tại: werden (chia) + Partizip II (cuối). Quá khứ: wurde + P2. Tương lai: wird + P2 + werden (vị trí cuối). Không nên dùng Passiv quá nhiều trong nói chuyện — nghe quá formal/máy móc. Trong giao tiếp, dùng câu chủ động hoặc 'man'.",
    vocabulary: [
      { word: "werden", en: "to become / passive auxiliary", vi: "trở thành / trợ động từ bị động", pos: "verb", pronunciation_vi: "VEA-đần" },
      { word: "wurde", en: "became (Präteritum)", vi: "đã (Präteritum của werden)", pos: "verb form", pronunciation_vi: "VÚA-đờ" },
      { word: "von", en: "by (passive agent)", vi: "bởi (chỉ tác nhân)", pos: "preposition", pronunciation_vi: "phôn" },
      { word: "gebaut", en: "built", vi: "đã xây (P2)", pos: "Partizip II", pronunciation_vi: "gờ-BAO-t" },
      { word: "geschrieben", en: "written", vi: "đã viết (P2)", pos: "Partizip II", pronunciation_vi: "gờ-SHRI-bần" },
      { word: "geschickt", en: "sent", vi: "đã gửi (P2)", pos: "Partizip II", pronunciation_vi: "gờ-SHÍCT" },
      { word: "geöffnet", en: "opened", vi: "đã mở (P2)", pos: "Partizip II", pronunciation_vi: "gờ-ƠPH-nết" },
      { word: "gesprochen", en: "spoken", vi: "đã nói (P2)", pos: "Partizip II", pronunciation_vi: "gờ-SHPRÔ-khần" },
      { word: "die Sprache", en: "language", vi: "ngôn ngữ", pos: "noun (f)", pronunciation_vi: "đi SHPRA-khờ" },
      { word: "der Wind", en: "wind", vi: "gió", pos: "noun (m)", pronunciation_vi: "đe-a vIN-t" },
    ],
    dialogue: [
      { speaker: "A", text: "Wann wird das Projekt fertig?", vi: "Khi nào dự án xong?" },
      { speaker: "B", text: "Es wird nächste Woche abgeschlossen.", vi: "Sẽ được hoàn thành tuần sau." },
      { speaker: "A", text: "Und wer macht die Präsentation?", vi: "Và ai làm bài thuyết trình?" },
      { speaker: "B", text: "Die Präsentation wird von Anna gemacht.", vi: "Bài thuyết trình sẽ được Anna làm." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền dạng bị động (werden + Partizip II):",
        pronunciation_focus: ["cấu trúc: werden chia + Partizip II ở cuối"],
        items: [
          { prompt: "Das Haus _____ gebaut. (đang được xây)", answer: "wird" },
          { prompt: "Hier _____ Deutsch gesprochen. (được nói)", answer: "wird" },
          { prompt: "Das Buch _____ 1990 geschrieben. (đã được viết - Präteritum)", answer: "wurde" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối Partizip II với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "gebaut", answer: "đã xây" },
          { prompt: "geschrieben", answer: "đã viết" },
          { prompt: "gesprochen", answer: "đã nói" },
          { prompt: "geöffnet", answer: "đã mở" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức (dùng câu bị động):",
        pronunciation_focus: [],
        items: [
          { prompt: "Ngôi nhà đang được xây.", answer: "Das Haus wird gebaut." },
          { prompt: "Ở đây nói tiếng Đức.", answer: "Hier wird Deutsch gesprochen." },
          { prompt: "Lá thư phải được gửi hôm nay.", answer: "Der Brief muss heute geschickt werden." },
        ],
      },
    ],
  },
];

// ── 46–50. Fluency ──────────────────────────────────────────────────────

const FLUENCY: GermanLesson[] = [
  {
    id: "german_filler_words",
    level: "B2",
    category: "fluency",
    title_vi: "Từ đệm tự nhiên",
    title_en: "Modal particles and fillers",
    sentences: [
      {
        en: "Komm doch mal mit!",
        vi: "Đi cùng tôi đi mà!",
        pronunciation_focus: ["doch → đốc — particle nhấn mạnh", "mal → man — particle nhẹ", "mit → mít"],
      },
      {
        en: "Das ist ja interessant!",
        vi: "Cái này thú vị thật!",
        pronunciation_focus: ["ja → IÁ — particle thể hiện ngạc nhiên", "interessant → in-tê-rê-SANT", "trọng âm trên 'ja'"],
      },
      {
        en: "Was machst du denn da?",
        vi: "Cậu đang làm gì vậy?",
        pronunciation_focus: ["denn → đEN — particle thể hiện tò mò", "machst → MÁCST", "denn không phải 'thì'"],
      },
      {
        en: "Das war eben so.",
        vi: "Chỉ là như vậy thôi.",
        pronunciation_focus: ["eben → Ê-bần — particle resignation", "so → zô", "trọng âm trên 'eben'"],
      },
      {
        en: "Wo sind denn meine Schlüssel?",
        vi: "Chìa khóa của tôi đâu rồi nhỉ?",
        pronunciation_focus: ["denn → đEN — particle ngạc nhiên/tò mò", "Schlüssel → SHLUYS-sần — 'ü' tròn", "câu hỏi"],
      },
    ],
    cultural_notes_vi:
      "Particles (Modalpartikeln) là yếu tố làm tiếng Đức nói nghe tự nhiên hay máy móc. Sách giáo khoa hiếm khi dạy chúng vì khó định nghĩa. Một câu không có particle nghe đúng nhưng cứng. Người Đức dùng particles như gia vị: 'doch', 'mal', 'ja', 'denn' xuất hiện liên tục trong giao tiếp hàng ngày. Học chúng = nâng từ A2 cứng lên B1 tự nhiên.",
    tip_advice_vi:
      "Cách học: lắng nghe người Đức nói (podcast, phim) và để ý particles. Bắt đầu bắt chước với 3 cái dễ nhất: 'mal' (làm nhẹ), 'denn' (tò mò trong câu hỏi), 'doch' (khẩn thiết). Đừng ép dùng tất cả cùng lúc — sai chỗ sẽ nghe lạ. Một particle đúng chỗ tốt hơn ba particles sai.",
    vocabulary: [
      { word: "doch", en: "but/yet/do (modal particle)", vi: "mà/đi (particle)", pos: "modal particle", pronunciation_vi: "đốc" },
      { word: "mal", en: "just (softener)", vi: "thử/đi (particle nhẹ)", pos: "modal particle", pronunciation_vi: "man" },
      { word: "ja", en: "yes/of course (emphasis)", vi: "thật/nhỉ (nhấn mạnh)", pos: "modal particle", pronunciation_vi: "IÁ" },
      { word: "denn", en: "then/so (curiosity)", vi: "vậy/nhỉ (tò mò)", pos: "modal particle", pronunciation_vi: "đEN" },
      { word: "eben", en: "just/exactly (resignation)", vi: "chỉ/thôi (chấp nhận)", pos: "modal particle", pronunciation_vi: "Ê-bần" },
      { word: "halt", en: "just (resignation, casual)", vi: "thì cứ (chấp nhận, casual)", pos: "modal particle", pronunciation_vi: "HALT" },
      { word: "wohl", en: "probably/well (uncertainty)", vi: "có lẽ (không chắc)", pos: "modal particle", pronunciation_vi: "VÔN" },
      { word: "schon", en: "already (emphasis)", vi: "rồi/cũng (nhấn)", pos: "modal particle", pronunciation_vi: "SHÔN" },
      { word: "etwa", en: "perhaps/about", vi: "khoảng/có lẽ", pos: "modal particle", pronunciation_vi: "ET-va" },
      { word: "ruhig", en: "calmly/feel free to", vi: "cứ yên tâm", pos: "adverb", pronunciation_vi: "RU-ị" },
    ],
    dialogue: [
      { speaker: "A", text: "Hast du den Film gesehen?", vi: "Bạn xem phim đó chưa?" },
      { speaker: "B", text: "Den hab ich doch schon gesehen, weißt du nicht mehr?", vi: "Tôi xem rồi mà, bạn không nhớ à?" },
      { speaker: "A", text: "Ach ja, stimmt. War der denn gut?", vi: "À đúng rồi. Vậy phim hay không?" },
      { speaker: "B", text: "Ja, ganz gut. Schau ihn dir mal an!", vi: "Có, khá hay. Bạn cứ thử xem đi!" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền particle phù hợp (doch/mal/ja/denn/eben):",
        pronunciation_focus: ["particles không có nghĩa từ điển - thêm sắc thái cảm xúc"],
        items: [
          { prompt: "Komm _____ mit! (rủ rê - khẩn thiết)", answer: "doch" },
          { prompt: "Das ist _____ interessant! (ngạc nhiên)", answer: "ja" },
          { prompt: "Was machst du _____ da? (tò mò)", answer: "denn" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối particle với chức năng:",
        pronunciation_focus: [],
        items: [
          { prompt: "doch", answer: "nhấn mạnh/khẩn thiết" },
          { prompt: "mal", answer: "làm nhẹ câu/đề nghị" },
          { prompt: "denn", answer: "tò mò trong câu hỏi" },
          { prompt: "eben", answer: "chấp nhận/là vậy" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức (dùng particle phù hợp):",
        pronunciation_focus: [],
        items: [
          { prompt: "Đi cùng tôi đi mà!", answer: "Komm doch mal mit!" },
          { prompt: "Cái này thú vị thật!", answer: "Das ist ja interessant!" },
          { prompt: "Cậu đang làm gì vậy?", answer: "Was machst du denn da?" },
        ],
      },
    ],
  },
  {
    id: "german_connectors",
    level: "B2",
    category: "fluency",
    title_vi: "Từ nối câu",
    title_en: "Sentence connectors",
    sentences: [
      {
        en: "Erstens, ich habe keine Zeit. Zweitens, ich bin müde.",
        vi: "Thứ nhất, tôi không có thời gian. Thứ hai, tôi mệt.",
        pronunciation_focus: ["Erstens → ÊA-stần", "Zweitens → TSVAI-tần", "müde → MUY-đờ — 'ü' tròn"],
      },
      {
        en: "Trotzdem komme ich mit.",
        vi: "Tuy vậy tôi vẫn đi cùng.",
        pronunciation_focus: ["Trotzdem → TRÔTS-đêm", "komme → CÔM-mờ", "mit → mít — động từ tách"],
      },
      {
        en: "Außerdem ist es zu teuer.",
        vi: "Ngoài ra còn quá đắt.",
        pronunciation_focus: ["Außerdem → AO-sờ-đêm — 'ß' = ss", "teuer → TÔI-ợ", "ist → ÍST"],
      },
      {
        en: "Einerseits ja, andererseits nein.",
        vi: "Một mặt thì có, mặt khác thì không.",
        pronunciation_focus: ["Einerseits → AI-nợ-zait-s", "andererseits → AN-đe-rợ-zait-s", "ja/nein → IÁ/NAIN"],
      },
      {
        en: "Schließlich haben wir uns geeinigt.",
        vi: "Cuối cùng chúng tôi đã thống nhất.",
        pronunciation_focus: ["Schließlich → SHLÍS-lị-khờ", "geeinigt → gờ-AI-nịt", "uns → uns"],
      },
    ],
    cultural_notes_vi:
      "Từ nối (Konnektoren) là dấu hiệu rõ nhất của tiếng Đức trôi chảy. Người mới học nói rời rạc: 'Ich gehe. Ich bin müde.' (Tôi đi. Tôi mệt.). Người trôi chảy nói: 'Ich gehe, obwohl ich müde bin' (Tôi đi mặc dù mệt). Trong văn viết và bài thuyết trình, dùng erstens/zweitens/schließlich để cấu trúc rõ — người Đức rất quý sự logic này.",
    tip_advice_vi:
      "Sau từ nối như 'trotzdem', 'außerdem', 'deshalb' (đứng đầu câu chính, KHÔNG phải Nebensätze), động từ ở vị trí 2: 'Trotzdem [KOMME] ich mit'. Khác với 'obwohl' (Nebensatz, động từ cuối): 'Obwohl ich müde [BIN], komme ich'. Phân biệt 2 loại này quan trọng cho B1.",
    vocabulary: [
      { word: "erstens", en: "firstly", vi: "thứ nhất", pos: "adverb", pronunciation_vi: "ÊA-stần" },
      { word: "zweitens", en: "secondly", vi: "thứ hai", pos: "adverb", pronunciation_vi: "TSVAI-tần" },
      { word: "außerdem", en: "moreover", vi: "ngoài ra", pos: "adverb", pronunciation_vi: "AO-sờ-đêm" },
      { word: "trotzdem", en: "nevertheless", vi: "tuy vậy", pos: "adverb", pronunciation_vi: "TRÔTS-đêm" },
      { word: "deshalb", en: "therefore", vi: "do đó", pos: "adverb", pronunciation_vi: "ĐES-hanp" },
      { word: "einerseits", en: "on one hand", vi: "một mặt", pos: "adverb", pronunciation_vi: "AI-nợ-zait-s" },
      { word: "andererseits", en: "on the other hand", vi: "mặt khác", pos: "adverb", pronunciation_vi: "AN-đe-rợ-zait-s" },
      { word: "schließlich", en: "finally", vi: "cuối cùng", pos: "adverb", pronunciation_vi: "SHLÍS-lị" },
      { word: "zum Beispiel", en: "for example", vi: "ví dụ", pos: "phrase", pronunciation_vi: "tsum BAI-shpi-án" },
      { word: "nämlich", en: "namely", vi: "tức là/vì", pos: "adverb", pronunciation_vi: "NEỊM-lị — 'ä' = e" },
    ],
    dialogue: [
      { speaker: "A", text: "Sollen wir morgen wandern gehen?", vi: "Mai chúng ta đi leo núi nhé?" },
      { speaker: "B", text: "Einerseits gerne, andererseits soll es regnen.", vi: "Một mặt thì rất muốn, mặt khác có vẻ trời sẽ mưa." },
      { speaker: "A", text: "Trotzdem könnten wir es versuchen.", vi: "Tuy vậy chúng ta có thể thử." },
      { speaker: "B", text: "Gut, schließlich brauchen wir frische Luft.", vi: "Được, cuối cùng chúng ta cũng cần không khí trong lành." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ nối phù hợp:",
        pronunciation_focus: [],
        items: [
          { prompt: "_____ ja, _____ nein. (một mặt... mặt khác)", answer: "Einerseits ... andererseits" },
          { prompt: "_____ haben wir uns geeinigt. (cuối cùng)", answer: "Schließlich" },
          { prompt: "_____ ist es zu teuer. (ngoài ra)", answer: "Außerdem" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ nối với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "trotzdem", answer: "tuy vậy" },
          { prompt: "deshalb", answer: "do đó" },
          { prompt: "zum Beispiel", answer: "ví dụ" },
          { prompt: "nämlich", answer: "tức là/vì" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Tuy vậy tôi vẫn đi cùng.", answer: "Trotzdem komme ich mit." },
          { prompt: "Cuối cùng chúng tôi đã thống nhất.", answer: "Schließlich haben wir uns geeinigt." },
          { prompt: "Một mặt thì có, mặt khác thì không.", answer: "Einerseits ja, andererseits nein." },
        ],
      },
    ],
  },
  {
    id: "german_register_formal",
    level: "B2",
    category: "fluency",
    title_vi: "Lịch sự và thân mật",
    title_en: "Formal and informal register",
    sentences: [
      {
        en: "Sehr geehrter Herr Schmidt, vielen Dank für Ihre Email.",
        vi: "Kính gửi ông Schmidt, cám ơn email của ông.",
        pronunciation_focus: ["Sehr geehrter → ZÊA gờ-Ê-tờ", "vielen → PHÍ-lần", "Email → Ê-mây"],
      },
      {
        en: "Hallo Anna, danke für die Mail!",
        vi: "Chào Anna, cám ơn email!",
        pronunciation_focus: ["Hallo → HA-lô — informal", "danke → ĐANG-kờ", "Mail → mêu"],
      },
      {
        en: "Mit freundlichen Grüßen, Klaus Müller.",
        vi: "Trân trọng, Klaus Müller.",
        pronunciation_focus: ["freundlichen → PHROIN-lị-khần", "Grüßen → GRUY-sần", "ß → ss"],
      },
      {
        en: "Liebe Grüße, Klaus.",
        vi: "Thân mến, Klaus.",
        pronunciation_focus: ["Liebe → LI-bờ", "Grüße → GRUY-sờ — 'ü' tròn", "informal"],
      },
      {
        en: "Ich würde mich freuen, von Ihnen zu hören.",
        vi: "Tôi sẽ rất vui được nghe phản hồi từ ông/bà.",
        pronunciation_focus: ["würde → VUYR-đờ — Konjunktiv II lịch sự", "freuen → PHROI-ần", "Ihnen → I-nần"],
      },
    ],
    cultural_notes_vi:
      "Tiếng Đức có hai mức xưng hô: 'Sie' (lịch sự, không quen) và 'du' (thân, gia đình/bạn bè). Người mới quen luôn dùng 'Sie' cho đến khi được mời 'duzen' (chuyển sang du). Đề nghị duzen thường đến từ người lớn tuổi, cấp trên, phụ nữ trong tình huống xã hội. Ở công sở Đức truyền thống dùng 'Sie' lâu, nhưng startup/công nghệ duzen ngay từ đầu. Trong nhà thờ, phòng tập, một số sport club: tự động duzen.",
    tip_advice_vi:
      "Email công việc bắt đầu 'Sehr geehrter Herr/Sehr geehrte Frau' và kết 'Mit freundlichen Grüßen' — gần như bất di bất dịch. Email thân: 'Hallo' / 'Hi' đầu, 'Liebe Grüße' / 'Viele Grüße' / 'LG' kết. Khi không chắc, dùng formal — không bao giờ phản tác dụng.",
    vocabulary: [
      { word: "Sehr geehrter Herr", en: "Dear Mr (formal)", vi: "Kính gửi ông", pos: "phrase (formal)", pronunciation_vi: "ZÊA gờ-Ê-tờ HE" },
      { word: "Sehr geehrte Frau", en: "Dear Ms (formal)", vi: "Kính gửi bà", pos: "phrase (formal)", pronunciation_vi: "ZÊA gờ-Ê-tờ PHRAO" },
      { word: "Liebe/Lieber", en: "Dear (warm)", vi: "Thân mến", pos: "phrase (warm)", pronunciation_vi: "LI-bờ" },
      { word: "Mit freundlichen Grüßen", en: "Best regards (formal)", vi: "Trân trọng", pos: "phrase (formal)", pronunciation_vi: "MÍT PHROIN-lị-khần GRUY-sần" },
      { word: "Liebe Grüße", en: "Warm regards (informal)", vi: "Thân mến", pos: "phrase (informal)", pronunciation_vi: "LI-bờ GRUY-sờ" },
      { word: "Sie", en: "you (formal)", vi: "ngài/bà (lịch sự)", pos: "pronoun (formal)", pronunciation_vi: "ZI" },
      { word: "du", en: "you (informal)", vi: "bạn (thân)", pos: "pronoun (informal)", pronunciation_vi: "đu" },
      { word: "ihr", en: "you (plural informal)", vi: "các bạn", pos: "pronoun", pronunciation_vi: "ÍA" },
      { word: "duzen", en: "to address as 'du'", vi: "xưng 'du'", pos: "verb", pronunciation_vi: "ĐÚ-tsần" },
      { word: "siezen", en: "to address as 'Sie'", vi: "xưng 'Sie'", pos: "verb", pronunciation_vi: "ZI-tsần" },
    ],
    dialogue: [
      { speaker: "A", text: "Sollen wir uns duzen?", vi: "Chúng ta xưng 'du' với nhau nhé?" },
      { speaker: "B", text: "Gerne! Ich bin Klaus.", vi: "Vui lòng! Tôi là Klaus." },
      { speaker: "A", text: "Schön, Klaus. Ich bin Anna.", vi: "Hay quá, Klaus. Tôi là Anna." },
      { speaker: "B", text: "Freut mich, Anna!", vi: "Rất vui được gặp, Anna!" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn từ formal hay informal:",
        pronunciation_focus: [],
        items: [
          { prompt: "Email công ty: '_____ Herr Schmidt' (lịch sự)", answer: "Sehr geehrter" },
          { prompt: "Email bạn bè: '_____ Anna' (thân mật)", answer: "Liebe" },
          { prompt: "Kết thúc formal: 'Mit _____ Grüßen' (lịch sự)", answer: "freundlichen" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối cách xưng hô với mức độ:",
        pronunciation_focus: [],
        items: [
          { prompt: "Sie", answer: "lịch sự (ngài/bà)" },
          { prompt: "du", answer: "thân mật (bạn)" },
          { prompt: "Sehr geehrter", answer: "rất lịch sự (kính gửi)" },
          { prompt: "Liebe Grüße", answer: "thân mật (thân mến)" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức:",
        pronunciation_focus: [],
        items: [
          { prompt: "Kính gửi ông Schmidt.", answer: "Sehr geehrter Herr Schmidt." },
          { prompt: "Trân trọng, Klaus.", answer: "Mit freundlichen Grüßen, Klaus." },
          { prompt: "Chúng ta xưng 'du' nhé?", answer: "Sollen wir uns duzen?" },
        ],
      },
    ],
  },
  {
    id: "german_idioms",
    level: "B2",
    category: "fluency",
    title_vi: "Thành ngữ thông dụng",
    title_en: "Common idioms",
    sentences: [
      {
        en: "Daumen drücken!",
        vi: "Chúc may mắn! (nắm ngón cái)",
        pronunciation_focus: ["Daumen → ĐAO-mần", "drücken → ĐRUYC-kần — 'ü' tròn", "thành ngữ"],
      },
      {
        en: "Das ist nicht mein Bier.",
        vi: "Đó không phải việc của tôi. (lit: không phải bia của tôi)",
        pronunciation_focus: ["nicht → NỊT", "Bier → BÍA", "thành ngữ"],
      },
      {
        en: "Tomaten auf den Augen haben.",
        vi: "Không thấy điều rõ ràng. (lit: có cà chua trên mắt)",
        pronunciation_focus: ["Tomaten → tô-MA-tần", "Augen → AO-gần", "trên mắt → mù tịt"],
      },
      {
        en: "Da liegt der Hund begraben.",
        vi: "Đó là cốt lõi vấn đề. (lit: con chó được chôn ở đó)",
        pronunciation_focus: ["liegt → LIK-t", "Hund → HUNT", "begraben → bờ-GRA-bần"],
      },
      {
        en: "Ich verstehe nur Bahnhof.",
        vi: "Tôi không hiểu gì cả. (lit: tôi chỉ hiểu nhà ga)",
        pronunciation_focus: ["verstehe → phờ-SHTÊ-ờ", "nur → NÚA", "Bahnhof → BA-nờ-hôph"],
      },
    ],
    cultural_notes_vi:
      "Thành ngữ Đức (Redewendungen) có lịch sử dài, nhiều cái rất hình ảnh. 'Schwein haben' (có heo - may mắn) đến từ thời trung cổ khi tặng heo là tặng may mắn. 'Tomaten auf den Augen' (cà chua trên mắt) là cách hài hước nói ai đó không thấy điều rõ ràng. Học thành ngữ là chìa khóa hòa nhập văn hóa — nhưng dùng ít, đúng chỗ. Dùng quá nhiều nghe lố.",
    tip_advice_vi:
      "Bắt đầu với 5-10 thành ngữ phổ biến nhất: 'Daumen drücken', 'Schwein haben', 'auf der Nase liegen' (nằm dài/bệnh), 'die Nase voll haben' (chán ngấy). Đừng dịch literal sang tiếng Việt khi nói tiếng Đức — sẽ rất buồn cười. Học cụm cố định, dùng nguyên cụm.",
    vocabulary: [
      { word: "der Daumen", en: "thumb", vi: "ngón cái", pos: "noun (m)", pronunciation_vi: "đe-a ĐAO-mần" },
      { word: "drücken", en: "to press", vi: "ấn/nắm", pos: "verb", pronunciation_vi: "ĐRUYC-kần" },
      { word: "das Glück", en: "luck", vi: "may mắn", pos: "noun (n)", pronunciation_vi: "đát GLUYC — 'ü' tròn" },
      { word: "der Hund", en: "dog", vi: "con chó", pos: "noun (m)", pronunciation_vi: "đe-a HUNT" },
      { word: "begraben", en: "buried", vi: "chôn", pos: "verb (P2)", pronunciation_vi: "bờ-GRA-bần" },
      { word: "Bahnhof verstehen", en: "to not understand", vi: "không hiểu gì", pos: "idiom", pronunciation_vi: "BA-nờ-hôph phờ-SHTÊ-ần" },
      { word: "Schwein haben", en: "to be lucky", vi: "may mắn", pos: "idiom", pronunciation_vi: "SHvain HA-bần" },
      { word: "der Knoten", en: "knot", vi: "nút thắt", pos: "noun (m)", pronunciation_vi: "đe-a KNÔ-tần" },
      { word: "platzen", en: "to burst", vi: "vỡ ra", pos: "verb", pronunciation_vi: "PLA-tsần" },
      { word: "die Nase", en: "nose", vi: "mũi", pos: "noun (f)", pronunciation_vi: "đi NA-zờ" },
    ],
    dialogue: [
      { speaker: "A", text: "Morgen habe ich eine wichtige Prüfung.", vi: "Mai tôi có kỳ thi quan trọng." },
      { speaker: "B", text: "Ich drücke dir die Daumen!", vi: "Tôi chúc bạn may mắn!" },
      { speaker: "A", text: "Danke. Ich verstehe das Thema noch nicht ganz.", vi: "Cám ơn. Tôi chưa hiểu hoàn toàn đề bài." },
      { speaker: "B", text: "Keine Sorge, du wirst Schwein haben!", vi: "Không lo, bạn sẽ may mắn thôi!" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền thành ngữ:",
        pronunciation_focus: [],
        items: [
          { prompt: "Ich drücke dir die _____! (chúc may mắn - ngón cái)", answer: "Daumen" },
          { prompt: "Das ist nicht mein _____. (không phải việc của tôi)", answer: "Bier" },
          { prompt: "Ich verstehe nur _____. (không hiểu gì - nhà ga)", answer: "Bahnhof" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối thành ngữ với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "Daumen drücken", answer: "chúc may mắn" },
          { prompt: "Schwein haben", answer: "may mắn (bất ngờ)" },
          { prompt: "Tomaten auf den Augen", answer: "không thấy điều rõ" },
          { prompt: "Bahnhof verstehen", answer: "không hiểu gì" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức (dùng thành ngữ):",
        pronunciation_focus: [],
        items: [
          { prompt: "Chúc may mắn!", answer: "Daumen drücken!" },
          { prompt: "Tôi không hiểu gì cả.", answer: "Ich verstehe nur Bahnhof." },
          { prompt: "Đó không phải việc của tôi.", answer: "Das ist nicht mein Bier." },
        ],
      },
    ],
  },
  {
    id: "german_natural_speech",
    level: "B2",
    category: "fluency",
    title_vi: "Nói tự nhiên",
    title_en: "Natural everyday speech",
    sentences: [
      {
        en: "Ach so! Jetzt verstehe ich.",
        vi: "À ra vậy! Giờ tôi hiểu rồi.",
        pronunciation_focus: ["Ach so → ÁC zô — phản ứng hiểu ra", "jetzt → IẾT-st", "verstehe → phờ-SHTÊ-ờ"],
      },
      {
        en: "Naja, das ist halt so.",
        vi: "Thì... cứ vậy thôi.",
        pronunciation_focus: ["Naja → NA-ia — chần chừ", "halt → HALT — particle resignation", "so → zô"],
      },
      {
        en: "Mensch, das ist wirklich super!",
        vi: "Trời, cái này thật tuyệt!",
        pronunciation_focus: ["Mensch → MENSH — exclamation", "wirklich → VIA-lị", "super → ZÚ-pờ"],
      },
      {
        en: "Echt? Das wusste ich nicht.",
        vi: "Thật à? Tôi không biết.",
        pronunciation_focus: ["Echt → ẾT — informal cho 'wirklich'", "wusste → VÚS-tờ", "nicht → NỊT"],
      },
      {
        en: "Egal, machen wir's einfach.",
        vi: "Kệ, làm cứ làm thôi.",
        pronunciation_focus: ["Egal → ê-GAN", "machen wir's → MA-khần vias — viết tắt 'wir es'", "einfach → AIN-pháct"],
      },
    ],
    cultural_notes_vi:
      "Sự khác biệt giữa người học tiếng Đức và người Đức bản xứ thường nằm ở những từ nhỏ này: 'Ach so', 'Naja', 'Mensch', 'Echt', 'Genau'. Người Đức dùng 'Genau' (chính xác) liên tục để xác nhận đối phương — một cuộc đối thoại Đức 5 phút có thể có 10 'Genau'. 'Mensch' (literally 'người') là exclamation trung tính, không tục. 'Ach so!' là phản ứng khi vừa hiểu ra điều gì đó — dùng đúng chỗ rất tự nhiên.",
    tip_advice_vi:
      "Cách luyện: xem phim Đức (Tatort, Dark trên Netflix), podcast (Slow German cho người mới), YouTube (Easy German). Để ý từ nhỏ và bắt chước. Đừng dịch tiếng Việt sang tiếng Đức — học cụm 'Ach so', 'Mensch', 'Genau' như đơn vị, dùng đúng tình huống. Dần dần, tiếng Đức sẽ nghe tự nhiên hơn rất nhiều.",
    vocabulary: [
      { word: "Ach so!", en: "Oh I see!", vi: "À ra vậy!", pos: "exclamation", pronunciation_vi: "ÁC zô" },
      { word: "Naja", en: "well...", vi: "thì...", pos: "filler", pronunciation_vi: "NA-ia" },
      { word: "Mensch!", en: "Man! / Wow!", vi: "Trời!", pos: "exclamation", pronunciation_vi: "MENSH" },
      { word: "Echt?", en: "Really?", vi: "Thật à?", pos: "exclamation (informal)", pronunciation_vi: "ẾT" },
      { word: "Egal", en: "doesn't matter", vi: "kệ/không sao", pos: "adjective/adverb", pronunciation_vi: "ê-GAN" },
      { word: "klar", en: "clear/of course", vi: "rõ rồi/tất nhiên", pos: "adjective", pronunciation_vi: "KLA" },
      { word: "okay", en: "okay", vi: "được/ok", pos: "adverb", pronunciation_vi: "ô-KÊ" },
      { word: "genau", en: "exactly", vi: "chính xác", pos: "adverb", pronunciation_vi: "gờ-NAO" },
      { word: "stimmt", en: "right/true", vi: "đúng vậy", pos: "verb form", pronunciation_vi: "SHTÍMT" },
      { word: "wirklich", en: "really", vi: "thật sự", pos: "adverb", pronunciation_vi: "VIA-lị" },
    ],
    dialogue: [
      { speaker: "A", text: "Hast du gehört? Anna heiratet nächsten Monat.", vi: "Bạn nghe chưa? Anna kết hôn tháng sau." },
      { speaker: "B", text: "Echt? Mensch, das ist ja toll!", vi: "Thật à? Trời, hay quá!" },
      { speaker: "A", text: "Genau. Sie ist total glücklich.", vi: "Chính xác. Cô ấy hạnh phúc lắm." },
      { speaker: "B", text: "Ach so! Ich dachte, sie wollte noch warten.", vi: "À ra vậy! Tôi tưởng cô ấy muốn đợi." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ tự nhiên:",
        pronunciation_focus: [],
        items: [
          { prompt: "_____ ! Jetzt verstehe ich. (À ra vậy)", answer: "Ach so" },
          { prompt: "_____ ? Das wusste ich nicht. (Thật à - informal)", answer: "Echt" },
          { prompt: "_____ , machen wir's einfach. (Kệ)", answer: "Egal" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: [],
        items: [
          { prompt: "klar", answer: "rõ rồi/tất nhiên" },
          { prompt: "genau", answer: "chính xác" },
          { prompt: "stimmt", answer: "đúng vậy" },
          { prompt: "Mensch!", answer: "Trời!" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức (giọng tự nhiên):",
        pronunciation_focus: [],
        items: [
          { prompt: "À ra vậy! Giờ tôi hiểu.", answer: "Ach so! Jetzt verstehe ich." },
          { prompt: "Thật à? Tôi không biết.", answer: "Echt? Das wusste ich nicht." },
          { prompt: "Trời, cái này thật tuyệt!", answer: "Mensch, das ist wirklich super!" },
        ],
      },
    ],
  },
  {
    id: "german_workplace_conflict_chef",
    level: "B2",
    category: "fluency",
    title_vi: "Konfliktgespräch mit Chef — nói chuyện khó với sếp",
    title_en: "Workplace conflict conversation with boss",
    sentences: [
      { en: "Frau Becker, ich hätte gern einen kurzen Termin mit Ihnen.", vi: "Chị Becker, tôi muốn xin một cuộc gặp ngắn với chị.", pronunciation_focus: ["hätte → HÉT-tờ — Konjunktiv II lịch sự", "Termin → TE-MIN", "Ihnen → I-nần — viết hoa = formal"] },
      { en: "Ich habe in den letzten drei Monaten 60 Überstunden gemacht.", vi: "Trong ba tháng qua tôi đã làm 60 giờ làm thêm.", pronunciation_focus: ["Überstunden → UY-bờ-shtun-đần", "ü → uy tròn môi", "gemacht → gờ-MÁCH-t"] },
      { en: "Die aktuelle Arbeitsbelastung ist auf Dauer nicht tragbar.", vi: "Khối lượng công việc hiện tại không thể chịu được lâu dài.", pronunciation_focus: ["Arbeitsbelastung → A-baits-bờ-LAS-tung", "Dauer → ĐAO-ờ", "tragbar → TRÁK-ba"] },
      { en: "Ich möchte Klartext reden, bevor es eskaliert.", vi: "Tôi muốn nói thẳng trước khi vấn đề leo thang.", pronunciation_focus: ["möchte → MƠCH-tờ — 'ö' tròn môi", "Klartext → KLA-tếc-t", "eskaliert → es-ka-LÍA-t"] },
      { en: "Können wir die Prioritäten gemeinsam neu festlegen?", vi: "Chúng ta có thể cùng nhau sắp xếp lại thứ tự ưu tiên không?", pronunciation_focus: ["Prioritäten → pri-o-ri-TÊ-tần", "gemeinsam → gờ-MAIN-zam", "festlegen → PHEST-lê-gần"] },
    ],
    cultural_notes_vi: "Văn hóa công sở Đức cực kỳ trực tiếp — 'Klartext' (nói thẳng) là giá trị, không phải thiếu lịch sự. Khác hẳn Việt Nam: người Đức kỳ vọng nhân viên tự nói ra vấn đề CHỦ ĐỘNG, không 'đợi sếp tự nhận thấy'. Im lặng = đồng ý. Nếu bạn quá tải mà không nói, sếp Đức sẽ cho rằng bạn đang ổn. Khi xin gặp sếp về vấn đề khó: (1) đặt lịch trước qua email/Outlook — không đột nhập phòng; (2) chuẩn bị số liệu cụ thể (giờ overtime, deadline); (3) đề xuất giải pháp, không chỉ phàn nàn; (4) giữ giọng bình tĩnh, factual, không cảm xúc.",
    tip_advice_vi: "Cấu trúc cuộc nói chuyện: (1) Vào đề lịch sự với Konjunktiv II: 'Ich hätte gern einen kurzen Termin'. (2) Nêu sự kiện trước, cảm xúc sau: '60 Überstunden in 3 Monaten' chứ không 'Tôi mệt quá'. (3) Dùng 'Ich-Botschaften': 'Ich brauche...', 'Mir ist wichtig...' — không trách 'Sie geben zu viel'. (4) Đề xuất giải pháp cụ thể: pausieren, delegieren, neu priorisieren. (5) Câu chốt: 'Ich möchte Klartext reden' — báo hiệu sắp nói thật, người Đức tôn trọng. Tránh 'Es tut mir leid, aber...' — yếu thế quá. Người Đức không cần xin lỗi vì nói sự thật.",
    vocabulary: [
      { word: "die Arbeitsbelastung", en: "workload", vi: "khối lượng công việc", pos: "noun (f)", pronunciation_vi: "đi A-baits-bờ-LAS-tung" },
      { word: "die Überstunde", en: "overtime hour", vi: "giờ làm thêm", pos: "noun (f)", pronunciation_vi: "đi UY-bờ-shtun-đờ — 'ü' tròn" },
      { word: "tragbar", en: "bearable", vi: "chịu được, bền vững", pos: "adjective", pronunciation_vi: "TRÁK-ba" },
      { word: "ansprechen", en: "to bring up", vi: "nói ra, đề cập", pos: "verb (sep)", pronunciation_vi: "AN-shprê-khần" },
      { word: "die Priorität", en: "priority", vi: "ưu tiên", pos: "noun (f)", pronunciation_vi: "đi pri-o-ri-TÊT" },
      { word: "pausieren", en: "to pause", vi: "tạm dừng", pos: "verb", pronunciation_vi: "pao-ZÍA-ần" },
      { word: "delegieren", en: "to delegate", vi: "ủy quyền, giao phó", pos: "verb", pronunciation_vi: "đê-lê-GÍA-ần" },
      { word: "der Termin", en: "appointment", vi: "cuộc hẹn", pos: "noun (m)", pronunciation_vi: "đe-a TE-MIN" },
      { word: "die Erschöpfung", en: "exhaustion", vi: "kiệt sức", pos: "noun (f)", pronunciation_vi: "đi e-SHƠP-phung — 'ö' tròn" },
      { word: "sich abgrenzen", en: "to set boundaries", vi: "đặt ranh giới", pos: "verb (refl)", pronunciation_vi: "zịch ÁP-grên-tsần" },
    ],
    dialogue: [
      { speaker: "Linh", text: "Frau Becker, könnten wir kurz sprechen? Es geht um meine Arbeitsbelastung.", vi: "Chị Becker, chúng ta nói chuyện một chút được không? Là về khối lượng công việc của tôi." },
      { speaker: "Becker", text: "Ja, gerne. Was gibt's?", vi: "Vâng, mời. Có chuyện gì?" },
      { speaker: "Linh", text: "Ich möchte Klartext reden: drei Projekte parallel sind nicht tragbar.", vi: "Tôi muốn nói thẳng: ba dự án song song không thể chịu được." },
      { speaker: "Becker", text: "Verstanden. Was schlagen Sie vor?", vi: "Tôi hiểu. Chị đề xuất gì?" },
    ],
    dialogue_long: [
      { speaker: "Linh", text: "Frau Becker, könnten wir kurz sprechen? Es geht um meine Arbeitsbelastung.", vi: "Chị Becker, chúng ta có thể nói chuyện một chút không? Là về khối lượng công việc của tôi." },
      { speaker: "Becker", text: "Ja, gerne. Setzen Sie sich. Was gibt's?", vi: "Vâng, mời ngồi. Có chuyện gì?" },
      { speaker: "Linh", text: "Ich möchte Klartext reden: in den letzten drei Monaten habe ich 60 Überstunden gemacht.", vi: "Tôi muốn nói thẳng: ba tháng qua tôi đã làm 60 giờ làm thêm." },
      { speaker: "Becker", text: "Das war mir nicht bewusst. Haben Sie konkrete Zahlen?", vi: "Tôi không biết điều đó. Chị có số liệu cụ thể không?" },
      { speaker: "Linh", text: "Ja, ich habe alles vorbereitet. Hier ist die Übersicht.", vi: "Vâng, tôi đã chuẩn bị sẵn. Đây là bản tổng hợp." },
      { speaker: "Becker", text: "Verstehe. Was schlagen Sie vor?", vi: "Tôi hiểu. Chị đề xuất gì?" },
      { speaker: "Linh", text: "Drei Projekte parallel sind nicht tragbar. Ich brauche eine klare Priorisierung.", vi: "Ba dự án song song không thể chịu được. Tôi cần ưu tiên rõ ràng." },
      { speaker: "Becker", text: "Welche Projekte meinen Sie konkret?", vi: "Cụ thể là dự án nào?" },
      { speaker: "Linh", text: "Das Müller-Projekt, die Marketing-Kampagne und die Datenbank-Migration.", vi: "Dự án Müller, chiến dịch marketing và migration cơ sở dữ liệu." },
      { speaker: "Becker", text: "Die Migration hat oberste Priorität. Können wir das Müller-Projekt pausieren?", vi: "Migration là ưu tiên cao nhất. Chúng ta có thể tạm dừng dự án Müller không?" },
      { speaker: "Linh", text: "Pausieren ja — aber Herr Müller erwartet Ergebnisse bis Monatsende.", vi: "Dừng được, nhưng anh Müller chờ kết quả đến cuối tháng." },
      { speaker: "Becker", text: "Mit Herrn Müller spreche ich heute Nachmittag. Das übernehme ich.", vi: "Tôi sẽ nói chuyện với anh Müller chiều nay. Để tôi xử lý." },
      { speaker: "Linh", text: "Danke. Und die Marketing-Kampagne?", vi: "Cảm ơn chị. Còn chiến dịch marketing?" },
      { speaker: "Becker", text: "Teile davon delegieren wir an Tom. Sind Sie damit einverstanden?", vi: "Một phần chúng ta giao cho Tom. Chị có đồng ý không?" },
      { speaker: "Linh", text: "Ja, das wäre sehr hilfreich. Eine letzte Sache: ich nehme nächste Woche zwei Tage Urlaub.", vi: "Vâng, sẽ rất hữu ích. Một việc cuối: tuần sau tôi nghỉ phép hai ngày." },
      { speaker: "Becker", text: "Selbstverständlich. Ihre Gesundheit geht vor. Tragen Sie es im Kalender ein.", vi: "Tất nhiên. Sức khỏe của chị quan trọng nhất. Chị hãy đánh dấu trong lịch." },
      { speaker: "Linh", text: "Vielen Dank für das offene Gespräch, Frau Becker.", vi: "Cảm ơn chị đã trò chuyện cởi mở, chị Becker." },
      { speaker: "Becker", text: "Danke, dass Sie das angesprochen haben. Beim nächsten Mal — bitte früher.", vi: "Cảm ơn chị đã nói ra. Lần sau — xin nói sớm hơn." },
    ],
    roleplay_prompts: [
      "Bạn đã làm 50 giờ làm thêm trong 2 tháng và bị từ chối nghỉ phép. Hãy đặt lịch họp với sếp (dùng Sie), nêu sự kiện cụ thể, và đề xuất 2 giải pháp. Giữ giọng bình tĩnh, factual.",
      "Sếp giao thêm dự án thứ tư trong khi bạn đang quá tải với 3 cái đang dở. Hãy từ chối lịch sự bằng tiếng Đức công sở — dùng Konjunktiv II ('ich könnte', 'ich würde') và đề xuất ai trong team có thể nhận thay.",
      "Đồng nghiệp Đức (đã 'du') hỏi sao bạn trông kiệt sức. Hãy dùng thành ngữ 'die Nase voll haben' để than vãn ngắn — sau đó hỏi ý kiến: nên nói chuyện với sếp như thế nào.",
    ],
    register_notes: "Toàn bộ cuộc nói chuyện này dùng 'Sie' (lịch sự), không 'du'. Lý do: (1) đây là buổi nói chuyện chính thức về xung đột — không phải lúc duzen; (2) công ty truyền thống Đức (luật, ngân hàng, bảo hiểm, công ty gia đình) mặc định 'Sie' với cấp trên kể cả khi đã làm chung nhiều năm; (3) trong tình huống căng thẳng, 'Sie' giúp giữ khoảng cách lý trí, tránh cảm xúc lan vào.\n\nKhác Pháp: 'vous' Pháp có thể lỏng — đồng nghiệp Pháp nhanh chóng 'tu' sau vài tháng. Đức nghiêm hơn nhiều. Startup, agency, IT trẻ thường 'du' từ ngày đầu, nhưng phần lớn ngành khác giữ 'Sie' lâu. Quy tắc vàng cho người Việt: theo dõi sếp dùng gì với bạn — nếu sếp 'Sie', bạn 'Sie'. Đề nghị chuyển 'du' luôn đến từ người cao hơn (cấp trên, lớn tuổi) — bạn KHÔNG được đề nghị trước với cấp trên.\n\nTín hiệu cần chú ý: nếu bạn và sếp đã 'du' từ lâu, nhưng trong cuộc họp về vấn đề nghiêm trọng sếp đột ngột chuyển lại 'Sie' — đây là báo hiệu 'đây là chuyện công việc, không phải bạn bè'. Hiểu được tín hiệu này tránh hiểu lầm. Ngược lại, nếu cuộc họp căng thẳng và sếp vẫn 'du', tức là sếp coi bạn như đồng minh, không phải đối thủ.",
    idiom_glosses: [
      { idiom: "die Nase voll haben", literal: "có cái mũi đầy", meaning: "chán ngấy, hết chịu nổi", example: "Ich habe die Nase voll von diesen ständigen Überstunden." },
      { idiom: "Klartext reden", literal: "nói chữ rõ ràng", meaning: "nói thẳng, không vòng vo", example: "Ich möchte Klartext reden: das geht so nicht weiter." },
      { idiom: "kein Blatt vor den Mund nehmen", literal: "không cầm chiếc lá trước miệng", meaning: "nói thẳng, không che giấu", example: "Frau Becker nimmt kein Blatt vor den Mund — das schätze ich." },
      { idiom: "das Maß ist voll", literal: "cái đong đã đầy", meaning: "đã đến giới hạn, giọt nước tràn ly", example: "Nach diesem Vorfall ist das Maß voll. Es muss sich etwas ändern." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ phù hợp cho cuộc nói chuyện công sở:",
        pronunciation_focus: ["Konjunktiv II", "Sie-Form"],
        items: [
          { prompt: "Ich _____ gern einen Termin mit Ihnen. (Konjunktiv II của 'haben')", answer: "hätte" },
          { prompt: "Die Arbeitsbelastung ist nicht _____. (chịu được lâu dài)", answer: "tragbar" },
          { prompt: "Ich möchte das offen _____. (nói ra)", answer: "ansprechen" },
          { prompt: "Können wir die _____ neu festlegen? (ưu tiên)", answer: "Prioritäten" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối câu Đức với chức năng giao tiếp:",
        pronunciation_focus: [],
        items: [
          { prompt: "Ich möchte Klartext reden.", answer: "Báo hiệu sắp nói thật" },
          { prompt: "Was schlagen Sie vor?", answer: "Mời đề xuất giải pháp" },
          { prompt: "Das übernehme ich.", answer: "Sếp nhận trách nhiệm" },
          { prompt: "Ihre Gesundheit geht vor.", answer: "Ưu tiên sức khỏe nhân viên" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức công sở (giữ formal Sie-Form):",
        pronunciation_focus: ["Sie-Form", "Konjunktiv II"],
        items: [
          { prompt: "Tôi muốn nói thẳng về khối lượng công việc.", answer: "Ich möchte Klartext über die Arbeitsbelastung reden." },
          { prompt: "Chúng ta có thể sắp xếp lại thứ tự ưu tiên không?", answer: "Können wir die Prioritäten neu festlegen?" },
          { prompt: "Tôi đề xuất tạm dừng dự án Müller.", answer: "Ich schlage vor, das Müller-Projekt zu pausieren." },
          { prompt: "Cảm ơn chị đã trò chuyện cởi mở.", answer: "Vielen Dank für das offene Gespräch." },
        ],
      },
    ],
  },
  {
    id: "german_b2_job_interview_german_company",
    level: "B2",
    category: "fluency",
    title_vi: "Phỏng vấn xin việc ở công ty Đức",
    title_en: "Job interview at a German company",
    sentences: [
      { en: "Vielen Dank für die Einladung zum Vorstellungsgespräch.", vi: "Cảm ơn anh/chị đã mời tôi đến phỏng vấn.", pronunciation_focus: ["Vorstellungsgespräch → FOA-shtê-lung-s-gờ-shprếch", "ä → e mở", "Einladung → AIN-la-đung"] },
      { en: "Ich habe drei Jahre Erfahrung in der Qualitätssicherung bei Bosch in Hồ-Chí-Minh-Stadt gesammelt.", vi: "Tôi đã tích luỹ ba năm kinh nghiệm về đảm bảo chất lượng tại Bosch ở TP Hồ Chí Minh.", pronunciation_focus: ["Qualitätssicherung → KVA-li-té-ts-zi-khê-rung", "gesammelt → gờ-ZAM-mêlt", "Erfahrung → e-FA-rung"] },
      { en: "Was mich besonders an Ihrem Unternehmen reizt, ist die internationale Ausrichtung.", vi: "Điều thu hút tôi đặc biệt ở công ty của anh/chị là định hướng quốc tế.", pronunciation_focus: ["reizt → RAITS-t", "Ausrichtung → AOS-ri-khtung", "Unternehmen → un-tờ-NÊ-mần"] },
      { en: "Könnten Sie mir mehr über die Entwicklungsmöglichkeiten in dieser Position erzählen?", vi: "Anh/chị có thể nói thêm về cơ hội phát triển ở vị trí này không?", pronunciation_focus: ["Könnten → KƠN-tần — Konjunktiv II", "Entwicklungsmöglichkeiten → ent-VÍ-klung-s-mơ-glích-kai-tần", "ö → ơ tròn môi"] },
      { en: "Bezüglich des Gehalts orientiere ich mich an einem Bruttojahresgehalt von etwa fünfzig bis sechzig Tausend Euro.", vi: "Về mức lương, tôi định hướng ở khoảng 50 đến 60 nghìn euro tổng năm.", pronunciation_focus: ["Bezüglich → bê-TSUY-glích", "Bruttojahresgehalt → BRU-tô-IA-rès-gờ-halt", "ü → uy tròn môi"] },
    ],
    cultural_notes_vi: "Phỏng vấn ở công ty Đức khác Việt Nam ở năm điểm. (1) Đúng giờ: đến SỚM 5-10 phút, không sớm hơn (đến 30 phút trước = bị coi là gây áp lực). Trễ 5 phút trở lên thường = mất cơ hội. (2) Bắt tay chắc, nhìn thẳng mắt — yếu là dấu hiệu thiếu tự tin. (3) Trả lời câu hỏi 'điểm yếu' KHÔNG được đùa hay chuyển hướng. Phải nêu điểm yếu THẬT + cách bạn đang cải thiện. (4) Đàm phán lương trong vòng cuối là CHUẨN — không phải vô lễ; nhưng phải có dữ liệu thị trường (Glassdoor, Stepstone) làm cơ sở. (5) Sau phỏng vấn, gửi email cảm ơn ngắn gọn TRONG 24 GIỜ — không quá dài (3-4 dòng), không xin xỏ.\n\nCông ty Đức ở Việt Nam (Bosch, Siemens, BASF, Continental) tìm người Việt có thể giao tiếp tự tin với cả hai phía. Đặc biệt giá trị: ai có thể giải thích quy trình Đức cho team Việt và ngược lại — đó là 'Brückenfunktion' (chức năng cầu nối) mà không người Đức thuần nào hay người Việt thuần nào làm được.\n\nKhác biệt cơ bản nhất với phỏng vấn ở công ty Việt Nam: ở VN, mối quan hệ và chemistry quan trọng bằng năng lực; ở công ty Đức, năng lực được đo bằng dữ liệu cụ thể, mối quan hệ phát triển SAU khi vào việc.",
    tip_advice_vi: "Chuẩn bị: (1) Nghiên cứu kỹ công ty 4-6 giờ trước phỏng vấn — đọc Geschäftsbericht, tin tức gần nhất, đối thủ cạnh tranh. (2) Chuẩn bị 3 dự án cụ thể có số liệu (ví dụ: 'giảm chi phí 15%') để kể chi tiết. (3) In 2 bản CV mang theo. (4) Chuẩn bị 5 câu hỏi cho người phỏng vấn.\n\nTrong phỏng vấn: (1) Mở đầu bằng cái bắt tay chắc + mắt nhìn thẳng + 'Guten Tag, Frau/Herr X'. (2) Khi không hiểu câu hỏi, hỏi lại lịch sự: 'Könnten Sie die Frage anders formulieren?'. (3) Câu trả lời theo cấu trúc STAR (Situation-Task-Action-Result). (4) Khi hỏi về điểm yếu, dùng cấu trúc: thừa nhận → cách khắc phục → kết quả. (5) Khi đàm phán lương, đưa range (50-60K) chứ không số đơn lẻ.\n\nSau phỏng vấn: gửi email cảm ơn trong 24h, ngắn gọn 3-4 dòng. Sau 14 ngày không có phản hồi, có thể follow-up 1 lần lịch sự.",
    vocabulary: [
      { word: "das Vorstellungsgespräch", en: "job interview", vi: "buổi phỏng vấn xin việc", pos: "noun (n)", pronunciation_vi: "đát FOA-shtê-lung-s-gờ-shprếch" },
      { word: "die Qualitätssicherung", en: "quality assurance", vi: "đảm bảo chất lượng", pos: "noun (f)", pronunciation_vi: "đi KVA-li-té-ts-zi-khê-rung" },
      { word: "die Erfahrung sammeln", en: "to gain experience", vi: "tích luỹ kinh nghiệm", pos: "verb phrase", pronunciation_vi: "ZAM-mêln" },
      { word: "die Ausrichtung", en: "orientation, direction", vi: "định hướng", pos: "noun (f)", pronunciation_vi: "AOS-ri-khtung" },
      { word: "die Entwicklungsmöglichkeit", en: "development opportunity", vi: "cơ hội phát triển", pos: "noun (f)", pronunciation_vi: "ent-VÍ-klung-s-mơ-glích-kai" },
      { word: "die Stärken und Schwächen", en: "strengths and weaknesses", vi: "điểm mạnh và điểm yếu", pos: "noun phrase", pronunciation_vi: "SHTE-kần und SHVÉ-khần" },
      { word: "das Bruttojahresgehalt", en: "gross annual salary", vi: "lương tổng cả năm", pos: "noun (n)", pronunciation_vi: "BRU-tô-IA-rès-gờ-halt" },
      { word: "die Probezeit", en: "probation period", vi: "thời gian thử việc", pos: "noun (f)", pronunciation_vi: "PRÔ-bê-tsait" },
      { word: "der/die Vorgesetzte", en: "superior, manager", vi: "cấp trên", pos: "noun (m/f)", pronunciation_vi: "FOA-gờ-zét-tê" },
      { word: "in einem Unternehmen tätig sein", en: "to work at a company", vi: "làm việc tại công ty", pos: "verb phrase", pronunciation_vi: "TÊ-tích zain" },
    ],
    dialogue: [
      { speaker: "Frau Schmidt", text: "Bitte erzählen Sie uns kurz, warum Sie sich bei uns beworben haben.", vi: "Mời anh kể ngắn gọn vì sao anh ứng tuyển ở chỗ chúng tôi." },
      { speaker: "Linh", text: "Ihr Unternehmen verbindet deutsche Ingenieurskunst mit internationaler Ausrichtung — das passt zu meinem Werdegang.", vi: "Công ty của chị kết hợp kỹ thuật Đức với định hướng quốc tế — phù hợp với quá trình phát triển của tôi." },
      { speaker: "Frau Schmidt", text: "Was sind Ihrer Meinung nach Ihre größten Schwächen?", vi: "Theo anh, điểm yếu lớn nhất của anh là gì?" },
      { speaker: "Linh", text: "Ich neige dazu, zu detailorientiert zu sein. Daran arbeite ich mit klaren Zeitlimits.", vi: "Tôi có xu hướng quá chú trọng tiểu tiết. Tôi đang khắc phục bằng cách đặt giới hạn thời gian rõ ràng." },
    ],
    dialogue_long: [
      { speaker: "Frau Schmidt", text: "Guten Tag, Herr Linh. Schön, dass Sie persönlich nach München kommen konnten. Setzen Sie sich bitte.", vi: "Chào anh Linh. Rất vui anh có thể đến Munich gặp trực tiếp. Mời anh ngồi." },
      { speaker: "Linh", text: "Vielen Dank für die Einladung, Frau Schmidt. Es ist mir eine Ehre.", vi: "Cảm ơn chị đã mời, chị Schmidt. Đây là vinh dự của tôi." },
      { speaker: "Frau Schmidt", text: "Bitte erzählen Sie uns kurz, warum Sie sich bei uns beworben haben.", vi: "Mời anh kể ngắn gọn vì sao anh ứng tuyển ở chỗ chúng tôi." },
      { speaker: "Linh", text: "Ihr Unternehmen verbindet deutsche Ingenieurskunst mit internationaler Ausrichtung. Nach drei Jahren bei Bosch in Hồ-Chí-Minh-Stadt möchte ich diese Erfahrung in einem deutschen Headquarter vertiefen.", vi: "Công ty của chị kết hợp kỹ thuật Đức với định hướng quốc tế. Sau ba năm ở Bosch TP HCM, tôi muốn đào sâu kinh nghiệm này tại trụ sở chính ở Đức." },
      { speaker: "Frau Schmidt", text: "Sie haben drei Jahre Erfahrung in der Qualitätssicherung. Welche konkreten Projekte haben Sie geleitet?", vi: "Anh có ba năm kinh nghiệm đảm bảo chất lượng. Anh đã dẫn dắt những dự án cụ thể nào?" },
      { speaker: "Linh", text: "Zuletzt habe ich ein Lieferantenaudit-Programm aufgebaut, das die Reklamationsquote um fünfzehn Prozent gesenkt hat. Die Zahlen kann ich Ihnen gerne im Detail zeigen.", vi: "Gần đây nhất tôi xây dựng chương trình kiểm toán nhà cung cấp, đã giảm tỉ lệ khiếu nại 15%. Tôi có thể trình bày chi tiết số liệu nếu chị muốn." },
      { speaker: "Frau Schmidt", text: "Sehr beeindruckend. Was sind Ihrer Meinung nach Ihre größten Schwächen?", vi: "Rất ấn tượng. Theo anh, điểm yếu lớn nhất của anh là gì?" },
      { speaker: "Linh", text: "Ich neige dazu, zu detailorientiert zu sein. Daran arbeite ich mit klaren Zeitlimits und der bewussten Frage 'ist das gut genug?'", vi: "Tôi có xu hướng quá chú trọng tiểu tiết. Tôi khắc phục bằng giới hạn thời gian và câu hỏi 'như vậy đã đủ tốt chưa?'" },
      { speaker: "Frau Schmidt", text: "Ehrliche Antwort. Wie sieht Ihre Sprachsituation aus? Wie wohl fühlen Sie sich auf Deutsch in fachlichen Diskussionen?", vi: "Câu trả lời chân thật. Tình hình ngôn ngữ của anh thế nào? Anh cảm thấy thoải mái đến đâu khi thảo luận chuyên môn bằng tiếng Đức?" },
      { speaker: "Linh", text: "Goethe-Zertifikat C1, und ich arbeite bereits seit zwei Jahren auf Deutsch mit Kollegen aus Stuttgart. Tacheles reden ist für mich kein Problem.", vi: "Tôi có chứng chỉ Goethe C1 và đã làm việc bằng tiếng Đức với đồng nghiệp Stuttgart hai năm nay. Nói thẳng vấn đề không khó với tôi." },
      { speaker: "Frau Schmidt", text: "Was reizt Sie konkret an dieser Position — und nicht an einer ähnlichen bei einem anderen Hersteller?", vi: "Điều gì cụ thể thu hút anh ở vị trí này — chứ không phải ở một vị trí tương tự ở hãng khác?" },
      { speaker: "Linh", text: "Ihre Zusammenarbeit mit dem Werk in Đồng Nai. Ich kenne beide Seiten und kann eine Brückenfunktion übernehmen.", vi: "Sự hợp tác giữa công ty và nhà máy ở Đồng Nai. Tôi hiểu cả hai phía và có thể đảm nhận vai trò cầu nối." },
      { speaker: "Frau Schmidt", text: "Das wäre tatsächlich ein großer Mehrwert. Bezüglich des Gehalts — welche Vorstellung haben Sie?", vi: "Đó thực sự là giá trị gia tăng lớn. Về mức lương — anh có hình dung thế nào?" },
      { speaker: "Linh", text: "Bezüglich des Gehalts orientiere ich mich an einem Bruttojahresgehalt von etwa fünfzig bis sechzig Tausend Euro, abhängig vom Gesamtpaket.", vi: "Về lương tôi định hướng khoảng 50 đến 60 nghìn euro tổng năm, tuỳ vào gói tổng." },
      { speaker: "Frau Schmidt", text: "Das liegt in unserem Rahmen. Haben Sie Fragen an uns?", vi: "Mức đó nằm trong khung của chúng tôi. Anh có câu hỏi gì cho chúng tôi không?" },
      { speaker: "Linh", text: "Könnten Sie mir mehr über die Entwicklungsmöglichkeiten in dieser Position erzählen? Und wann mit einer Entscheidung zu rechnen ist?", vi: "Chị có thể nói thêm về cơ hội phát triển ở vị trí này không? Và khi nào tôi có thể nhận được quyết định?" },
      { speaker: "Frau Schmidt", text: "Eine Antwort bekommen Sie spätestens in vierzehn Tagen. Wir melden uns aktiv. Vielen Dank für Ihre Zeit.", vi: "Anh sẽ nhận được phản hồi muộn nhất trong 14 ngày. Chúng tôi sẽ chủ động liên lạc. Cảm ơn anh đã dành thời gian." },
      { speaker: "Linh", text: "Vielen Dank für das Gespräch, Frau Schmidt. Ich freue mich auf Ihre Rückmeldung.", vi: "Cảm ơn chị về buổi nói chuyện, chị Schmidt. Tôi mong chờ phản hồi của chị." },
    ],
    roleplay_prompts: [
      "Bạn vừa được mời phỏng vấn vòng cuối tại Siemens. Sếp tương lai hỏi 'Warum sollten wir Sie einstellen und nicht einen deutschen Bewerber?' Hãy trả lời lịch sự nhưng tự tin — KHÔNG xin lỗi vì là người nước ngoài, dùng lợi thế song ngữ và cầu nối văn hoá làm điểm mạnh chính.",
      "Người phỏng vấn đề nghị mức lương thấp hơn kỳ vọng 8.000€/năm. Hãy thương lượng dùng Konjunktiv II ('ich hätte gehofft', 'wäre es möglich'), đề xuất các lựa chọn ngoài lương cơ bản (Bonus, Weiterbildungsbudget, Homeoffice).",
      "Cuối phỏng vấn, người phỏng vấn hỏi 'Haben Sie noch Fragen?'. Hãy hỏi 3 câu thông minh thể hiện anh đã nghiên cứu công ty — không hỏi về lương/nghỉ phép ở giai đoạn này.",
    ],
    register_notes: "Trong môi trường phỏng vấn truyền thống Đức (công ty kỹ thuật, ngân hàng, công ty gia đình lớn), 'Sie' là chuẩn từ đầu đến cuối — kể cả khi không khí thân thiện. KHÔNG bao giờ chuyển sang 'du' trừ khi người phỏng vấn chủ động đề nghị (rất hiếm trong vòng đầu). Kết câu bằng 'Konjunktiv II' để biểu hiện lịch sự: 'Ich würde sagen...', 'Es wäre mir wichtig...', 'Könnten Sie...?' — tránh 'ich will', 'ich brauche'.\n\nNgoại lệ: startup ở Berlin/Hamburg, công ty IT hiện đại, agency sáng tạo thường 'du' từ ngày đầu — kể cả với CEO. Dấu hiệu: nếu trang web công ty xưng 'du' với khách thăm trang, nếu bài đăng tuyển dụng có 'duzen' trong văn hoá công ty, hoặc nếu người phỏng vấn mở đầu bằng tên (không Frau/Herr) — bạn được phép 'du'. Nhưng quy tắc vàng: chờ người phỏng vấn dùng 'du' với bạn TRƯỚC; đừng tự ý chuyển.\n\nNgười Việt hay mắc lỗi tự khiêm thái quá ('Em chưa có nhiều kinh nghiệm') — bị đọc là thiếu tự tin, không bán được giá trị bản thân. Văn hoá Đức expect bạn nói thẳng đóng góp được gì, kèm bằng chứng cụ thể.",
    idiom_glosses: [
      { idiom: "Tacheles reden", literal: "Nói thẳng (Tacheles từ tiếng Yiddish)", meaning: "Nói thẳng vào vấn đề, không vòng vo. Trong phỏng vấn, dùng để báo hiệu bạn sẵn sàng cho phản hồi trực tiếp về điểm yếu hoặc lương.", example: "Ich kann auf Deutsch Tacheles reden — auch in schwierigen Verhandlungen." },
      { idiom: "Nägel mit Köpfen machen", literal: "Đóng đinh có đầu", meaning: "Làm việc gì đến nơi đến chốn, dứt khoát — thay vì để dở dang. Dùng khi muốn báo hiệu bạn không phải kiểu nửa vời.", example: "Bei jedem Projekt mache ich Nägel mit Köpfen — angefangenes wird beendet." },
      { idiom: "Über den Tellerrand schauen", literal: "Nhìn qua mép đĩa", meaning: "Nhìn xa hơn phạm vi nhỏ hẹp của mình, có cái nhìn tổng thể. Dùng để mô tả tầm nhìn liên ngành, bilingual, cross-cultural.", example: "Mit meiner internationalen Erfahrung kann ich gut über den Tellerrand schauen." },
      { idiom: "Ein Eisen im Feuer haben", literal: "Có một thanh sắt trong lửa", meaning: "Có một phương án/cơ hội đang chờ. Số nhiều ('mehrere Eisen im Feuer') = có nhiều phương án dự phòng.", example: "Ich habe noch ein anderes Eisen im Feuer, aber Ihre Stelle ist meine Priorität." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm phù hợp cho buổi phỏng vấn:",
        pronunciation_focus: ["Konjunktiv II", "Sie-Form"],
        items: [
          { prompt: "_____ Sie mir mehr über die Position erzählen? (Konjunktiv II — lịch sự)", answer: "Könnten" },
          { prompt: "Vielen Dank für die _____ zum Vorstellungsgespräch.", answer: "Einladung" },
          { prompt: "Ich habe drei Jahre Erfahrung in der Qualitäts_____.", answer: "sicherung" },
          { prompt: "Bezüglich des _____ orientiere ich mich an 55.000 Euro brutto. (lương)", answer: "Gehalts" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối câu Đức với chức năng giao tiếp trong phỏng vấn:",
        pronunciation_focus: [],
        items: [
          { prompt: "Was reizt Sie an dieser Position?", answer: "Hỏi động cơ ứng tuyển" },
          { prompt: "Welche Vorstellung haben Sie?", answer: "Mời đề xuất số (lương)" },
          { prompt: "Daran arbeite ich aktiv.", answer: "Thừa nhận điểm yếu + cách khắc phục" },
          { prompt: "Wann ist mit einer Entscheidung zu rechnen?", answer: "Hỏi timeline phản hồi" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức công sở (giữ formal Sie-Form, dùng Konjunktiv II khi yêu cầu):",
        pronunciation_focus: ["Sie-Form", "Konjunktiv II"],
        items: [
          { prompt: "Cảm ơn anh/chị đã mời tôi đến phỏng vấn.", answer: "Vielen Dank für die Einladung zum Vorstellungsgespräch." },
          { prompt: "Anh/chị có thể nói thêm về cơ hội phát triển không?", answer: "Könnten Sie mir mehr über die Entwicklungsmöglichkeiten erzählen?" },
          { prompt: "Tôi đã tích luỹ ba năm kinh nghiệm tại Bosch.", answer: "Ich habe drei Jahre Erfahrung bei Bosch gesammelt." },
          { prompt: "Khi nào tôi có thể nhận được quyết định?", answer: "Wann ist mit einer Entscheidung zu rechnen?" },
        ],
      },
    ],
  },
  {
    id: "german_b2_daad_scholarship_interview",
    level: "B2",
    category: "fluency",
    title_vi: "Phỏng vấn học bổng DAAD",
    title_en: "DAAD scholarship interview",
    sentences: [
      { en: "Mein Forschungsvorhaben befasst sich mit nachhaltiger Wasserwirtschaft im Mekong-Delta.", vi: "Đề tài nghiên cứu của tôi tập trung vào quản lý nước bền vững ở đồng bằng sông Mekong.", pronunciation_focus: ["Forschungsvorhaben → FOR-shungs-foa-ha-bần", "nachhaltiger → NÁCH-hal-ti-gờ", "Wasserwirtschaft → VÁ-sờ-vít-shaft"] },
      { en: "Die TU München bietet die ideale Forschungsumgebung für mein Promotionsthema.", vi: "TU München cung cấp môi trường nghiên cứu lý tưởng cho đề tài tiến sĩ của tôi.", pronunciation_focus: ["Promotionsthema → prô-MÔ-tsi-ônss-tê-ma", "Forschungsumgebung → FOR-shungs-um-gê-bung", "ideale → i-đê-A-lê"] },
      { en: "Nach Abschluss meiner Promotion möchte ich an der Vietnam National University forschen und lehren.", vi: "Sau khi hoàn thành tiến sĩ, tôi muốn nghiên cứu và giảng dạy tại Đại học Quốc gia Việt Nam.", pronunciation_focus: ["Abschluss → ÁB-shlus", "Promotion → prô-MÔ-tsi-ôn", "lehren → LÊ-rần"] },
      { en: "Ich bin zutiefst dankbar für die Möglichkeit, mich vorzustellen.", vi: "Tôi vô cùng biết ơn vì cơ hội được giới thiệu bản thân.", pronunciation_focus: ["zutiefst → TSU-tíf-st", "dankbar → ĐANK-ba", "vorzustellen → FOA-tsu-shtê-lần — verb tách"] },
      { en: "Wo ein Wille ist, ist auch ein Weg — diesen Spruch nehme ich mir zum Leitmotiv.", vi: "'Có chí thì nên' — câu này tôi xem là phương châm.", pronunciation_focus: ["Wille → VÍ-lê", "Weg → VÊK", "Leitmotiv → LAIT-mô-típ"] },
    ],
    cultural_notes_vi: "Phỏng vấn DAAD khác phỏng vấn học bổng Mỹ/Anh ở ba điểm cốt lõi. (1) Trọng tâm vào RÜCKKEHR (về nước): Mỹ/Anh không quan tâm bạn ở lại hay về; DAAD đặt mục tiêu phát triển nước bạn lên đầu — và sẽ test bạn có thật sự định về hay không. Kế hoạch về nước phải cụ thể: cơ quan nào, vai trò gì, đóng góp ra sao. Mơ hồ = trượt. (2) Trọng tâm vào ĐỀ CƯƠNG NGHIÊN CỨU (Forschungsvorhaben): không phải personal essay kiểu Mỹ; phải là bản đề cương khoa học có câu hỏi nghiên cứu rõ, phương pháp, lý do chọn Đức. (3) Trọng tâm vào LIÊN KẾT VỚI GIÁO SƯ ĐỨC: bạn phải đã liên hệ và có thư xác nhận từ giáo sư Đức trước khi phỏng vấn — DAAD không tài trợ ai chưa có người hướng dẫn.\n\nNhiều cựu DAAD ở Việt Nam giờ đang làm leader trong Bosch, Siemens — networking sau khi tốt nghiệp rất giá trị.\n\nKhác biệt văn hoá lớn nhất với VN: ở Việt Nam, học bổng được coi là phần thưởng cho học sinh giỏi; ở Đức, học bổng là KHOẢN ĐẦU TƯ vào dự án nghiên cứu cụ thể.",
    tip_advice_vi: "Trước phỏng vấn (3 tháng trước): (1) Liên hệ giáo sư Đức tiềm năng qua email — kèm CV và đề cương 1 trang. Chờ phản hồi 4-6 tuần. (2) Có thư cam kết hướng dẫn từ giáo sư trước khi nộp đơn DAAD. (3) Viết đề cương 5-10 trang theo format DAAD — câu hỏi nghiên cứu, phương pháp, kế hoạch thời gian, đóng góp. (4) Có C1 hoặc lộ trình rõ ràng đến C1 trước khi nhập học.\n\nTrong phỏng vấn: (1) Bắt đầu bằng chào tên + chức danh đầy đủ ('Herr Dr. Wagner', 'Frau Professor Schmidt'). (2) Khi nói về đề tài, dùng cấu trúc: bối cảnh → câu hỏi → phương pháp → đóng góp. (3) Khi được hỏi về kế hoạch về nước, có 3 yếu tố cụ thể: cơ quan tiếp nhận, vai trò, thời gian biểu. (4) Nếu không biết câu trả lời, nói thẳng 'Diese Frage muss ich mir überlegen' — không bịa.\n\nSau phỏng vấn: gửi email cảm ơn ngắn (3-4 dòng) trong 24h. Sau 2-3 tháng nhận quyết định.",
    vocabulary: [
      { word: "das Forschungsvorhaben", en: "research project/proposal", vi: "đề tài nghiên cứu", pos: "noun (n)", pronunciation_vi: "đát FOR-shungs-foa-ha-bần" },
      { word: "die Promotion", en: "doctoral studies / PhD", vi: "tiến sĩ", pos: "noun (f)", pronunciation_vi: "đi prô-MÔ-tsi-ôn" },
      { word: "die Forschungsumgebung", en: "research environment", vi: "môi trường nghiên cứu", pos: "noun (f)", pronunciation_vi: "đi FOR-shungs-um-gê-bung" },
      { word: "der/die Stipendiat:in", en: "scholarship holder", vi: "người được học bổng", pos: "noun (m/f)", pronunciation_vi: "shti-pen-đi-ÁT" },
      { word: "die Rückkehrverpflichtung", en: "obligation to return home", vi: "cam kết về nước", pos: "noun (f)", pronunciation_vi: "RÚCK-ke-fê-flích-tung" },
      { word: "sich befassen mit", en: "to deal with, focus on", vi: "tập trung vào, nghiên cứu về", pos: "verb (refl)", pronunciation_vi: "zịch bê-FA-sần mít" },
      { word: "der akademische Werdegang", en: "academic background", vi: "quá trình học thuật", pos: "noun (m)", pronunciation_vi: "a-ka-ĐÊ-mi-shê VE-đê-gang" },
      { word: "nachhaltig", en: "sustainable", vi: "bền vững", pos: "adjective", pronunciation_vi: "NÁCH-hal-tích" },
      { word: "die Wirkung erzielen", en: "to achieve impact", vi: "tạo ra tác động", pos: "verb phrase", pronunciation_vi: "VÍA-kung e-TSÍ-lần" },
      { word: "der Beitrag leisten", en: "to make a contribution", vi: "đóng góp", pos: "verb phrase", pronunciation_vi: "BAI-trag LAI-stần" },
    ],
    dialogue: [
      { speaker: "Herr Dr. Wagner", text: "Frau Linh, warum gerade Deutschland für Ihre Promotion?", vi: "Cô Linh, vì sao lại chọn Đức cho việc làm tiến sĩ?" },
      { speaker: "Linh", text: "Die deutsche Forschung im Bereich Wassertechnik ist weltweit führend, und die TU München hat genau die Methodik, die ich brauche.", vi: "Nghiên cứu Đức về công nghệ nước dẫn đầu thế giới, và TU München có đúng phương pháp tôi cần." },
      { speaker: "Herr Dr. Wagner", text: "Was werden Sie nach der Promotion machen? Bleiben Sie in Deutschland?", vi: "Sau tiến sĩ cô làm gì? Có ở lại Đức không?" },
      { speaker: "Linh", text: "Nein, ich kehre nach Vietnam zurück. Mein Wissen soll dem Mekong-Delta zugutekommen.", vi: "Không, tôi sẽ về Việt Nam. Kiến thức của tôi cần phục vụ đồng bằng sông Mekong." },
    ],
    dialogue_long: [
      { speaker: "Herr Dr. Wagner", text: "Guten Tag, Frau Linh. Ich bin Dr. Wagner vom DAAD-Auswahlausschuss. Bitte stellen Sie sich kurz vor.", vi: "Chào cô Linh. Tôi là Tiến sĩ Wagner thuộc hội đồng tuyển chọn DAAD. Mời cô tự giới thiệu ngắn gọn." },
      { speaker: "Linh", text: "Vielen Dank, Herr Dr. Wagner. Mein Name ist Linh, ich bin Master-Absolventin der HCMUT in Umweltingenieurwesen.", vi: "Cảm ơn Tiến sĩ Wagner. Tôi tên Linh, vừa tốt nghiệp Thạc sĩ ngành Kỹ thuật môi trường tại Đại học Bách khoa TP HCM." },
      { speaker: "Herr Dr. Wagner", text: "Erzählen Sie mir von Ihrem Forschungsvorhaben.", vi: "Cô kể tôi nghe về đề tài nghiên cứu của cô." },
      { speaker: "Linh", text: "Mein Forschungsvorhaben befasst sich mit nachhaltiger Wasserwirtschaft im Mekong-Delta. Konkret untersuche ich, wie Salzwasser-Intrusion durch dezentrale Filtersysteme begegnet werden kann.", vi: "Đề tài tập trung vào quản lý nước bền vững ở đồng bằng sông Mekong. Cụ thể, tôi nghiên cứu cách hệ thống lọc phân tán có thể đối phó xâm nhập mặn." },
      { speaker: "Herr Dr. Wagner", text: "Warum gerade Deutschland und nicht etwa Australien oder die USA für dieses Thema?", vi: "Vì sao lại Đức chứ không phải Úc hay Mỹ cho chủ đề này?" },
      { speaker: "Linh", text: "Die TU München bietet die ideale Forschungsumgebung. Professor Müller publiziert seit zehn Jahren genau in meinem Bereich, und das Helmholtz-Zentrum bietet die nötige Infrastruktur.", vi: "TU München cung cấp môi trường nghiên cứu lý tưởng. Giáo sư Müller đã công bố trong đúng lĩnh vực của tôi suốt 10 năm, và Trung tâm Helmholtz có hạ tầng cần thiết." },
      { speaker: "Herr Dr. Wagner", text: "Haben Sie schon Kontakt mit Professor Müller aufgenommen?", vi: "Cô đã liên hệ với Giáo sư Müller chưa?" },
      { speaker: "Linh", text: "Ja, wir haben bereits zweimal per Videokonferenz gesprochen. Er hat sein Interesse an meiner Betreuung schriftlich bestätigt — die E-Mail liegt in meinen Unterlagen.", vi: "Vâng, chúng tôi đã trao đổi hai lần qua video. Thầy đã xác nhận bằng văn bản sự quan tâm hướng dẫn tôi — email có trong hồ sơ." },
      { speaker: "Herr Dr. Wagner", text: "Ausgezeichnet. Wie sieht Ihr Sprachstand auf Deutsch aus?", vi: "Xuất sắc. Trình độ tiếng Đức của cô thế nào?" },
      { speaker: "Linh", text: "Goethe-Zertifikat C1 mit der Note 'sehr gut'. Im Goethe-Institut Hồ-Chí-Minh-Stadt habe ich vier Jahre lang intensiv gelernt.", vi: "Goethe C1 với điểm 'rất tốt'. Tôi đã học tại Viện Goethe TP HCM bốn năm liên tục." },
      { speaker: "Herr Dr. Wagner", text: "Was werden Sie nach der Promotion machen? Bleiben Sie in Deutschland?", vi: "Sau tiến sĩ cô làm gì? Cô có ở lại Đức không?" },
      { speaker: "Linh", text: "Nein, ich kehre nach Vietnam zurück. Die DAAD-Rückkehrverpflichtung deckt sich mit meinem persönlichen Plan: an der Vietnam National University forschen und lehren.", vi: "Không, tôi về Việt Nam. Cam kết về nước của DAAD trùng với kế hoạch cá nhân: nghiên cứu và giảng dạy tại Đại học Quốc gia Việt Nam." },
      { speaker: "Herr Dr. Wagner", text: "Wie finanzieren Sie sich, wenn Sie die DAAD-Förderung nicht erhalten?", vi: "Cô tự lo tài chính thế nào nếu không nhận được học bổng DAAD?" },
      { speaker: "Linh", text: "Ich habe noch zwei Eisen im Feuer — die VEF-Förderung und die TUM Graduate School. Aber DAAD ist meine erste Wahl wegen des Netzwerks und der Rückkehrunterstützung.", vi: "Tôi còn hai phương án dự phòng — học bổng VEF và TUM Graduate School. Nhưng DAAD là lựa chọn đầu tiên vì mạng lưới và hỗ trợ về nước." },
      { speaker: "Herr Dr. Wagner", text: "Gut. Welchen Beitrag wollen Sie nach Ihrer Rückkehr in Vietnam leisten?", vi: "Tốt. Sau khi về Việt Nam cô muốn đóng góp gì?" },
      { speaker: "Linh", text: "Eine Forschungsgruppe für dezentrale Wassertechnik aufbauen, deutsch-vietnamesische Doktorandenaustausche initiieren, und konkrete Pilotprojekte mit dem Umweltministerium umsetzen.", vi: "Xây dựng nhóm nghiên cứu công nghệ nước phân tán, khởi xướng trao đổi nghiên cứu sinh Đức-Việt, và triển khai các dự án thí điểm cụ thể với Bộ Môi trường." },
      { speaker: "Herr Dr. Wagner", text: "Eine sehr klare Vision. Haben Sie noch Fragen an uns?", vi: "Tầm nhìn rất rõ ràng. Cô còn câu hỏi gì cho chúng tôi không?" },
      { speaker: "Linh", text: "Wann kann ich mit einer Entscheidung rechnen, und gibt es eine Möglichkeit, vor Stipendiumsbeginn einen Sprachkurs in Deutschland zu belegen?", vi: "Khi nào tôi có thể nhận được quyết định, và có khả năng tham dự khoá tiếng Đức tại Đức trước khi bắt đầu học bổng không?" },
    ],
    roleplay_prompts: [
      "Hội đồng DAAD hỏi: 'Was unterscheidet Ihren Antrag von den hundert anderen aus Vietnam?'. Hãy trả lời tự tin trong 90 giây — KHÔNG hạ thấp người Việt khác, mà nâng cao điểm khác biệt cụ thể của bạn (đề tài, phương pháp, kết nối với GS Đức, kế hoạch sau tiến sĩ).",
      "Bạn được hỏi 'Warum sollten wir gerade Sie fördern, wenn Sie kein Deutsch B2 vorweisen können?'. Hãy thừa nhận thực tế nhưng đưa ra kế hoạch học cụ thể (Goethe-Institut, Studienkolleg, deadline có chứng chỉ trước khi nhập học) — không xin xỏ, không lảng tránh.",
      "Người phỏng vấn nghi ngờ kế hoạch về nước của bạn: 'Viele DAAD-Stipendiaten bleiben am Ende doch in Deutschland.'. Hãy thuyết phục bằng cách nêu liên kết cụ thể với cơ quan/đại học VN đã ký cam kết (MOU, lời mời làm việc), và chỉ rõ vì sao về nước có lợi cho cá nhân bạn.",
    ],
    register_notes: "Phỏng vấn DAAD dùng 'Sie' tuyệt đối — không có ngoại lệ, kể cả khi không khí thân thiện. Người phỏng vấn thường là giáo sư hoặc cán bộ DAAD cao cấp; tone là 'akademisch und respektvoll'. Cấu trúc kính ngữ học thuật quan trọng: 'Mein Forschungsvorhaben befasst sich mit...' chứ không 'Ich erforsche...' (quá thẳng thừng); 'Ich bin überzeugt, dass...' chứ không 'Ich glaube...' (quá yếu).\n\nKonjunktiv II là chuẩn cho mọi yêu cầu/giả định: 'Es wäre mir eine Ehre...', 'Ich würde gerne...', 'Könnten Sie...?'. Sử dụng Konjunktiv I cho gián tiếp khi trích dẫn người khác: 'Professor Müller schrieb, er sei interessiert...'. Đừng dùng plain form cho academic content.\n\nChú ý titles: gọi 'Herr Dr. Wagner' chứ không 'Herr Wagner' (giáo sư có học hàm phải gọi đầy đủ); 'Frau Professor Schmidt' không 'Frau Schmidt'. Bỏ qua title = thiếu tôn trọng học thuật.\n\nNgười Việt thường mắc hai lỗi: (1) khiêm tốn Á Đông quá mức ('Em chỉ là sinh viên thường') — bị đọc là không tự tin; (2) đề cao đất nước/gia đình hơn cá nhân — DAAD chọn CÁ NHÂN, không chọn gia đình.",
    idiom_glosses: [
      { idiom: "Wo ein Wille ist, ist auch ein Weg", literal: "Nơi có ý chí, ở đó cũng có đường", meaning: "Có chí thì nên — ý chí mạnh sẽ tìm ra cách. Câu thành ngữ phổ biến để biểu hiện quyết tâm vượt khó.", example: "Wo ein Wille ist, ist auch ein Weg — deshalb habe ich neben dem Studium vier Jahre lang Deutsch gelernt." },
      { idiom: "Aller Anfang ist schwer", literal: "Mọi khởi đầu đều khó", meaning: "Vạn sự khởi đầu nan. Dùng để biểu hiện sự kiên trì khi bắt đầu — học tiếng, hội nhập, làm quen môi trường mới.", example: "Aller Anfang ist schwer, aber ich habe mich schnell in die deutsche Hochschulkultur eingefunden." },
      { idiom: "Sich ins Zeug legen", literal: "Đặt mình vào xe ngựa kéo", meaning: "Nỗ lực hết mình, dồn sức. Dùng để mô tả quá trình chuẩn bị khắt khe (luyện tiếng, viết đề cương).", example: "Für die DAAD-Bewerbung habe ich mich enorm ins Zeug gelegt — sechs Monate intensive Vorbereitung." },
      { idiom: "Glück im Unglück haben", literal: "Có may mắn trong bất hạnh", meaning: "Trong cái rủi có cái may. Phù hợp khi kể về một bước ngoặt: Covid khiến phải hoãn đi học một năm → có thêm thời gian học tiếng và nâng cao đề tài.", example: "Durch Covid musste ich ein Jahr warten — Glück im Unglück, denn so konnte ich mein Forschungsdesign verbessern." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm phù hợp cho phỏng vấn học bổng:",
        pronunciation_focus: ["Konjunktiv II", "academic register"],
        items: [
          { prompt: "Mein Forschungs_____ befasst sich mit nachhaltiger Wasserwirtschaft.", answer: "vorhaben" },
          { prompt: "Die TU München bietet die ideale Forschungs_____. (môi trường)", answer: "umgebung" },
          { prompt: "Ich kehre nach Vietnam _____. (về)", answer: "zurück" },
          { prompt: "Wo ein Wille ist, ist auch ein _____. (idiom)", answer: "Weg" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối câu Đức với chức năng phỏng vấn học bổng:",
        pronunciation_focus: [],
        items: [
          { prompt: "Mein Forschungsvorhaben befasst sich mit...", answer: "Mở đầu trình bày đề tài" },
          { prompt: "Welchen Beitrag wollen Sie leisten?", answer: "Hỏi đóng góp sau khi về nước" },
          { prompt: "Ich habe noch Eisen im Feuer.", answer: "Có phương án dự phòng" },
          { prompt: "Es wäre mir eine Ehre.", answer: "Cảm ơn cơ hội (Konjunktiv II)" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức học thuật (giữ formal Sie + Konjunktiv II):",
        pronunciation_focus: ["academic German"],
        items: [
          { prompt: "Đề tài của tôi tập trung vào quản lý nước bền vững.", answer: "Mein Forschungsvorhaben befasst sich mit nachhaltiger Wasserwirtschaft." },
          { prompt: "Sau tiến sĩ tôi muốn về Việt Nam giảng dạy.", answer: "Nach der Promotion möchte ich nach Vietnam zurückkehren und lehren." },
          { prompt: "Tôi đã liên hệ với Giáo sư Müller.", answer: "Ich habe bereits Kontakt mit Professor Müller aufgenommen." },
          { prompt: "Khi nào tôi có thể nhận được quyết định?", answer: "Wann kann ich mit einer Entscheidung rechnen?" },
        ],
      },
    ],
  },
  {
    id: "german_b2_thesis_topic_professor",
    level: "B2",
    category: "fluency",
    title_vi: "Xin GS hướng dẫn đề tài luận văn",
    title_en: "Asking professor for thesis supervision",
    sentences: [
      { en: "Sehr geehrter Herr Professor Müller, ich darf mich kurz vorstellen.", vi: "Kính gửi Giáo sư Müller, em xin phép giới thiệu ngắn gọn.", pronunciation_focus: ["Sehr geehrter → ZÊR gờ-Ê-tê", "Professor → prô-FE-zoa", "vorstellen → FOA-shtê-lần"] },
      { en: "Ich studiere im sechsten Master-Semester Maschinenbau an der RWTH Aachen.", vi: "Em đang học kỳ 6 Thạc sĩ ngành Cơ khí tại RWTH Aachen.", pronunciation_focus: ["sechsten → DZÉC-stân", "Maschinenbau → ma-SHÍ-nần-bao", "RWTH → ER-VÊ-TÊ-HA"] },
      { en: "Ihre Veröffentlichung über additive Fertigung hat mich sehr beeindruckt.", vi: "Bài công bố của thầy về sản xuất bồi đắp đã gây ấn tượng mạnh với em.", pronunciation_focus: ["Veröffentlichung → fe-ƠF-ent-lích-ung", "additive → A-đi-ti-ve", "beeindruckt → bê-AIN-đruckt"] },
      { en: "Ich würde gerne meine Masterarbeit unter Ihrer Betreuung schreiben.", vi: "Em mong được viết luận văn Thạc sĩ dưới sự hướng dẫn của thầy.", pronunciation_focus: ["würde → VUY-đê — Konjunktiv II", "Betreuung → bê-TROI-ung", "Masterarbeit → MAS-tờ-ar-bait"] },
      { en: "Hätten Sie zwischen den Vorlesungen kurz Zeit für ein Gespräch?", vi: "Thầy có thời gian giữa các tiết giảng để trò chuyện ngắn không?", pronunciation_focus: ["Hätten → HÉ-tần — Konjunktiv II", "Vorlesungen → FOA-lê-zung-ần", "Gespräch → gờ-SHPRẾCH"] },
    ],
    cultural_notes_vi: "Quan hệ sinh viên - giáo sư ở Đức có tính HIERARCHICAL hơn ở Mỹ/Canada nhưng VẪN TÔN TRỌNG SINH VIÊN HƠN ở Việt Nam. Năm điểm khác biệt với VN: (1) Sprechstunde (giờ tiếp sinh viên) là quyền của bạn — đăng ký qua email, đến đúng giờ. KHÔNG đột nhập phòng giáo sư hoặc tìm họ ngoài giờ. (2) Giáo sư Đức expect bạn ĐÃ ĐỌC bài báo của họ trước khi xin gặp — không đọc = thiếu tôn trọng. (3) Giáo sư KHÔNG quyết định đề tài cho bạn — họ chỉ approve đề tài bạn ĐỀ XUẤT. Đến gặp với 'em không biết đề tài gì, thầy gợi ý ạ' = bị từ chối ngay. (4) Co-Betreuer (đồng hướng dẫn) thường là Doktorand hoặc Postdoc của giáo sư — họ là người thực sự work với bạn hàng tuần. (5) Trong luận văn, bạn được EXPECT là independent — giáo sư không sửa từng câu, chỉ feedback methodology và logic.\n\nKhác Việt Nam: VN giáo sư thường giúp đỡ rất nhiều, được coi là sự quan tâm; Đức không như vậy — giáo sư mong đợi bạn drives the project.\n\nVăn hoá email với giáo sư Đức: phản hồi trong 1-2 tuần là chuẩn (không phải 1-2 ngày như business). Đừng follow-up quá sớm. Sau 3 tuần không phản hồi, có thể gửi nhắc lại lịch sự một lần.",
    tip_advice_vi: "Trước khi liên hệ GS: (1) Đọc 2-3 bài báo gần nhất của họ. (2) Đọc trang web Lehrstuhl (bộ môn) để hiểu hướng nghiên cứu hiện tại. (3) Chuẩn bị đề cương 1 trang ngắn gọn: câu hỏi nghiên cứu + phương pháp + tại sao GS này phù hợp.\n\nEmail đầu tiên: (1) Subject: 'Anfrage Masterarbeit-Betreuung — [tên đề tài ngắn]'. (2) Mở 'Sehr geehrter Herr Professor Müller'. (3) Đoạn 1: giới thiệu (2 câu — bạn là ai, học gì, ở đâu). (4) Đoạn 2: lý do gặp (3-4 câu — tại sao GS này, tại sao đề tài này, đã đọc bài nào). (5) Đoạn 3: yêu cầu cụ thể (xin Sprechstunde 30 phút, đính kèm CV + đề cương). (6) Kết 'Mit freundlichen Grüßen, Linh'. Đính kèm: CV (1 trang), đề cương (1 trang), bảng điểm.\n\nTrong Sprechstunde: (1) Đến SỚM 5 phút. (2) Mang bản in của đề cương + CV + transcript. (3) Mở đầu cảm ơn + giới thiệu 30 giây. (4) Trình bày đề tài 5 phút (max). (5) Lắng nghe pushback NGHIÊM TÚC. (6) Kết bằng next step rõ ràng (viết đề cương 5 trang, gửi trong 2 tuần).\n\nSau Sprechstunde: gửi email cảm ơn ngắn (3 dòng) trong 24h.",
    vocabulary: [
      { word: "die Masterarbeit", en: "master's thesis", vi: "luận văn Thạc sĩ", pos: "noun (f)", pronunciation_vi: "đi MAS-tờ-ar-bait" },
      { word: "die Betreuung", en: "supervision", vi: "sự hướng dẫn", pos: "noun (f)", pronunciation_vi: "đi bê-TROI-ung" },
      { word: "der/die Doktorvater/-mutter", en: "doctoral supervisor (informal)", vi: "thầy/cô hướng dẫn tiến sĩ", pos: "noun", pronunciation_vi: "đe DỐC-tô-fa-tờ" },
      { word: "die Veröffentlichung", en: "publication", vi: "bài công bố/bài báo", pos: "noun (f)", pronunciation_vi: "đi fe-ƠF-ent-lích-ung" },
      { word: "das Forschungsfeld", en: "research field", vi: "lĩnh vực nghiên cứu", pos: "noun (n)", pronunciation_vi: "đát FOR-shungs-felt" },
      { word: "die Sprechstunde", en: "office hours", vi: "giờ tiếp sinh viên", pos: "noun (f)", pronunciation_vi: "đi SHPRẾCH-shtun-đê" },
      { word: "das Exposé", en: "thesis proposal/abstract", vi: "đề cương luận văn", pos: "noun (n)", pronunciation_vi: "đát ec-spô-ZÊ" },
      { word: "die Fragestellung", en: "research question", vi: "câu hỏi nghiên cứu", pos: "noun (f)", pronunciation_vi: "đi FRA-gê-shtê-lung" },
      { word: "anknüpfen an", en: "to build on, connect to", vi: "kết nối/dựa trên", pos: "verb (sep)", pronunciation_vi: "AN-knuy-pfần an" },
      { word: "der/die Lehrstuhlinhaber:in", en: "chair holder, full professor", vi: "chủ nhiệm bộ môn", pos: "noun", pronunciation_vi: "LÊ-shtul-in-ha-bờ" },
    ],
    dialogue: [
      { speaker: "Linh", text: "Sehr geehrter Herr Professor Müller, ich danke Ihnen, dass Sie sich Zeit genommen haben.", vi: "Kính gửi GS Müller, em cảm ơn thầy đã dành thời gian." },
      { speaker: "Prof. Müller", text: "Gerne, Herr Linh. Sie haben in Ihrer E-Mail erwähnt, dass Sie an additiver Fertigung interessiert sind.", vi: "Hân hạnh, anh Linh. Trong email anh có nhắc đến quan tâm về sản xuất bồi đắp." },
      { speaker: "Linh", text: "Genau. Konkret würde ich gerne Titanlegierungen für Implantate untersuchen.", vi: "Đúng vậy. Cụ thể em muốn nghiên cứu hợp kim titan cho cấy ghép y khoa." },
      { speaker: "Prof. Müller", text: "Spannendes Thema. Bringen Sie mir bis nächste Woche ein Exposé von zwei Seiten?", vi: "Chủ đề thú vị. Anh mang cho tôi đề cương 2 trang vào tuần sau được không?" },
    ],
    dialogue_long: [
      { speaker: "Linh", text: "Sehr geehrter Herr Professor Müller, vielen Dank, dass Sie sich Zeit für mich genommen haben.", vi: "Kính gửi Giáo sư Müller, em rất cảm ơn thầy đã dành thời gian cho em." },
      { speaker: "Prof. Müller", text: "Gerne, Herr Linh. Setzen Sie sich. Sie haben in Ihrer E-Mail erwähnt, dass Sie an additiver Fertigung interessiert sind.", vi: "Hân hạnh, anh Linh. Mời ngồi. Trong email anh có nhắc đến quan tâm về sản xuất bồi đắp." },
      { speaker: "Linh", text: "Ja, Ihre Veröffentlichung von 2024 über LPBF-Prozesse für Titanlegierungen hat mich sehr beeindruckt. Ich würde an Ihre Forschung anknüpfen wollen.", vi: "Vâng, bài báo 2024 của thầy về quy trình LPBF cho hợp kim titan rất ấn tượng với em. Em muốn kết nối với nghiên cứu của thầy." },
      { speaker: "Prof. Müller", text: "Was genau interessiert Sie an dem Thema?", vi: "Cụ thể anh quan tâm điều gì ở chủ đề này?" },
      { speaker: "Linh", text: "In Vietnam wächst der Bedarf an Implantaten, aber die Importpreise sind sehr hoch. Ich möchte untersuchen, ob lokale 3D-Druck-Lösungen Implantate kostengünstiger machen können.", vi: "Ở Việt Nam nhu cầu cấy ghép tăng nhưng giá nhập rất cao. Em muốn nghiên cứu xem liệu giải pháp in 3D nội địa có thể làm cấy ghép rẻ hơn không." },
      { speaker: "Prof. Müller", text: "Das ist eine sehr konkrete Fragestellung. Haben Sie schon mit klinischen Partnern gesprochen?", vi: "Đó là câu hỏi nghiên cứu rất cụ thể. Anh đã nói chuyện với đối tác lâm sàng nào chưa?" },
      { speaker: "Linh", text: "Mit Cho-Ray-Krankenhaus in Hồ-Chí-Minh-Stadt — die Orthopädie-Abteilung wäre an einem Pilotversuch interessiert.", vi: "Với bệnh viện Chợ Rẫy ở TP HCM — khoa Chấn thương chỉnh hình quan tâm đến thử nghiệm thí điểm." },
      { speaker: "Prof. Müller", text: "Ausgezeichnet. Welche methodische Vorerfahrung bringen Sie mit?", vi: "Xuất sắc. Anh có kinh nghiệm phương pháp luận nào trước đây?" },
      { speaker: "Linh", text: "In meiner Bachelorarbeit habe ich FEM-Simulationen für Knochenstrukturen durchgeführt. Mit ANSYS und MATLAB kann ich gut umgehen.", vi: "Trong luận văn Cử nhân em đã làm mô phỏng FEM cho cấu trúc xương. Em thành thạo ANSYS và MATLAB." },
      { speaker: "Prof. Müller", text: "Das passt sehr gut. Wie lange haben Sie für die Masterarbeit eingeplant?", vi: "Phù hợp lắm. Anh dự kiến thời gian bao lâu cho luận văn Thạc sĩ?" },
      { speaker: "Linh", text: "Sechs Monate Vollzeit, beginnend im April. Wenn Sie zustimmen, würde ich gerne den Stier bei den Hörnern packen.", vi: "Sáu tháng full-time, bắt đầu tháng Tư. Nếu thầy đồng ý, em muốn bắt tay vào việc ngay." },
      { speaker: "Prof. Müller", text: "Spannendes Thema und gute Vorbereitung. Welche Erwartungen haben Sie an die Betreuung?", vi: "Chủ đề thú vị và chuẩn bị tốt. Anh kỳ vọng gì về sự hướng dẫn?" },
      { speaker: "Linh", text: "Alle zwei Wochen ein einstündiges Treffen, schriftliches Feedback zu Zwischenberichten. Ich arbeite selbstständig, brauche aber methodische Korrekturen.", vi: "Mỗi hai tuần một cuộc gặp 1 giờ, phản hồi văn bản cho báo cáo trung gian. Em làm việc tự lập nhưng cần chỉnh sửa phương pháp." },
      { speaker: "Prof. Müller", text: "Das lässt sich machen. Mein Doktorand Klaus könnte als Co-Betreuer fungieren — er hat das nötige Werkstoff-Know-how.", vi: "Có thể sắp xếp được. Nghiên cứu sinh Klaus của tôi có thể đồng hướng dẫn — anh ấy có chuyên môn về vật liệu cần thiết." },
      { speaker: "Linh", text: "Das wäre wunderbar. Soll ich ein Exposé von fünf Seiten ausarbeiten und Ihnen bis Ende des Monats schicken?", vi: "Tuyệt vời. Em soạn đề cương 5 trang và gửi thầy cuối tháng được không?" },
      { speaker: "Prof. Müller", text: "Ja, gerne. Mit Forschungsfrage, Methodik, Zeitplan und Literaturüberblick. Wir schauen es uns dann gemeinsam an.", vi: "Vâng, được. Có câu hỏi nghiên cứu, phương pháp, lịch trình và tổng quan tài liệu. Chúng ta sẽ cùng xem xét." },
      { speaker: "Linh", text: "Vielen Dank für Ihre Zeit und Ihr Vertrauen, Herr Professor. Ich melde mich Ende des Monats.", vi: "Em rất cảm ơn thầy đã dành thời gian và tin tưởng. Em sẽ liên hệ vào cuối tháng." },
      { speaker: "Prof. Müller", text: "Daumen drücke ich Ihnen für ein gutes Exposé. Bis bald.", vi: "Chúc anh viết đề cương tốt. Hẹn sớm gặp lại." },
    ],
    roleplay_prompts: [
      "Bạn vừa nhận email từ GS Müller: 'Mein Lehrstuhl ist überlastet, ich kann keine weiteren Masterarbeiten betreuen'. Hãy viết phản hồi 4-5 dòng — không bỏ cuộc, đề xuất phương án (đồng hướng dẫn, đề tài nhỏ hơn, lùi 1 học kỳ), và xin gợi ý GS khác.",
      "Trong giờ Sprechstunde đầu tiên, GS hỏi 'Warum gerade mein Lehrstuhl?'. Hãy trả lời cụ thể: trích dẫn 1 bài báo gần đây, kết nối với đề tài của bạn, và nêu lý do đề tài quan trọng cho VN — KHÔNG nói chung chung kiểu 'thầy nổi tiếng'.",
      "GS đồng ý hướng dẫn nhưng đề xuất đề tài khác với cái bạn muốn — gắn với dự án industrial của bộ môn, không phải về cấy ghép y tế cho VN. Hãy đàm phán: cảm ơn lời đề nghị, giải thích vì sao đề tài cũ của bạn quan trọng, và đề xuất compromise.",
    ],
    register_notes: "Liên lạc với giáo sư Đức tuyệt đối formal — luôn 'Sie', luôn dùng đầy đủ chức danh ('Herr Professor Müller', không 'Herr Müller'; 'Frau Professor Doktor Schmidt' với giáo sư có hai học hàm). Email mở đầu bằng 'Sehr geehrter Herr Professor Müller', kết bằng 'Mit freundlichen Grüßen'. KHÔNG dùng 'Hallo' hay 'Liebe Grüße' với giáo sư trừ khi đã trao đổi nhiều lần.\n\nKonjunktiv II là chuẩn cho mọi yêu cầu: 'Ich würde mich freuen, wenn...', 'Hätten Sie Zeit...?', 'Wäre es möglich...?'. Plain form ('Können Sie?') nghe quá thẳng. Trong email/cuộc gặp đầu tiên, đặc biệt phải dùng Konjunktiv II — biểu hiện bạn hiểu cấp bậc học thuật.\n\nNgoại lệ: một số giáo sư trẻ ở các bộ môn IT, Computer Science, hoặc các trường tư mới thường ít formal hơn. Quy tắc: theo dõi giáo sư mở đầu email với bạn thế nào — nếu họ dùng 'Lieber Herr Linh', bạn có thể đáp 'Lieber Herr Professor Müller' nhưng vẫn giữ Sie. KHÔNG bao giờ chuyển sang 'du' với giáo sư trừ khi họ EXPLICITLY đề nghị.\n\nNgười Việt hay mắc lỗi: (1) email quá ngắn — bị coi là không nghiêm túc; (2) email quá dài (3 trang giới thiệu cuộc đời) — không có ai đọc; (3) gọi sai chức danh — bị coi là thiếu tôn trọng học hàm.",
    idiom_glosses: [
      { idiom: "Den Stier bei den Hörnern packen", literal: "Túm sừng con bò mộng", meaning: "Bắt tay vào làm ngay, không trì hoãn — đặc biệt với việc khó. Dùng để báo hiệu bạn không phải kiểu sinh viên lề mề, sẵn sàng nhảy vào đề tài khó.", example: "Wenn Sie zustimmen, würde ich gerne den Stier bei den Hörnern packen und im April beginnen." },
      { idiom: "Auf eigenen Beinen stehen", literal: "Đứng trên chính đôi chân mình", meaning: "Tự lập, độc lập. Trong context luận văn, biểu hiện bạn làm việc tự chủ, không cần hand-holding — điều giáo sư Đức đánh giá rất cao.", example: "Bei der Masterarbeit kann ich auf eigenen Beinen stehen — ich brauche nur methodische Korrekturen." },
      { idiom: "Nicht auf den Mund gefallen sein", literal: "Không bị ngã trên miệng", meaning: "Có khả năng diễn đạt, không thiếu ngôn từ. Dùng để nói về khả năng thuyết trình, bảo vệ luận văn, đặt câu hỏi trong seminar.", example: "Ich bin nicht auf den Mund gefallen — ich kann mein Forschungsthema klar präsentieren." },
      { idiom: "Daumen drücken", literal: "Bấm ngón cái xuống", meaning: "Chúc may mắn (tương đương cross fingers). Giáo sư có thể nói câu này khi tiễn bạn ra khỏi giờ Sprechstunde — đây là dấu hiệu thân thiện, ủng hộ.", example: "Ich drücke Ihnen die Daumen für Ihr Exposé." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm phù hợp khi xin GS hướng dẫn:",
        pronunciation_focus: ["Konjunktiv II", "academic email"],
        items: [
          { prompt: "_____ geehrter Herr Professor Müller. (mở đầu email)", answer: "Sehr" },
          { prompt: "Ich _____ gerne meine Masterarbeit unter Ihrer Betreuung schreiben. (Konjunktiv II)", answer: "würde" },
          { prompt: "_____ Sie zwischen den Vorlesungen kurz Zeit? (Konjunktiv II)", answer: "Hätten" },
          { prompt: "Ich möchte an Ihre Forschung _____. (kết nối/dựa trên)", answer: "anknüpfen" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối câu Đức với chức năng giao tiếp học thuật:",
        pronunciation_focus: [],
        items: [
          { prompt: "Ihre Veröffentlichung hat mich beeindruckt.", answer: "Báo hiệu đã đọc bài của GS" },
          { prompt: "Ich kann auf eigenen Beinen stehen.", answer: "Tự lập trong làm việc" },
          { prompt: "Welche Erwartungen haben Sie an die Betreuung?", answer: "GS hỏi kỳ vọng SV" },
          { prompt: "Ich drücke Ihnen die Daumen.", answer: "Chúc may mắn (kết Sprechstunde)" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức học thuật formal:",
        pronunciation_focus: ["Sie + Konjunktiv II"],
        items: [
          { prompt: "Em xin phép giới thiệu ngắn gọn.", answer: "Ich darf mich kurz vorstellen." },
          { prompt: "Em mong được viết luận văn dưới sự hướng dẫn của thầy.", answer: "Ich würde gerne meine Masterarbeit unter Ihrer Betreuung schreiben." },
          { prompt: "Bài công bố của thầy đã gây ấn tượng mạnh với em.", answer: "Ihre Veröffentlichung hat mich sehr beeindruckt." },
          { prompt: "Em sẽ gửi đề cương 5 trang trong 2 tuần.", answer: "Ich werde Ihnen ein fünfseitiges Exposé in zwei Wochen schicken." },
        ],
      },
    ],
  },
  {
    id: "german_b2_internship_negotiation",
    level: "B2",
    category: "fluency",
    title_vi: "Đàm phán điều khoản Praktikum",
    title_en: "Internship terms negotiation",
    sentences: [
      { en: "Ich bewerbe mich um das sechsmonatige Pflichtpraktikum in Ihrer Entwicklungsabteilung.", vi: "Em ứng tuyển kỳ thực tập bắt buộc 6 tháng tại bộ phận R&D của công ty.", pronunciation_focus: ["Pflichtpraktikum → FLÍCHT-prak-ti-kum", "Entwicklungsabteilung → ent-VÍ-klung-s-áp-tai-lung", "sechsmonatig → DZÉC-s-mô-na-tích"] },
      { en: "Mein Studienplan sieht ein Vollzeit-Praktikum von April bis September vor.", vi: "Kế hoạch học của em yêu cầu thực tập full-time từ tháng Tư đến tháng Chín.", pronunciation_focus: ["Studienplan → SHTÚ-đi-ần-plan", "Vollzeit → FOL-tsait", "vorsehen → FOA-zê-ần"] },
      { en: "Bezüglich der Vergütung würde ich gerne den Tarif des öffentlichen Dienstes als Orientierung nehmen.", vi: "Về mức trợ cấp, em xin lấy mức tarif của khu vực công làm cơ sở tham khảo.", pronunciation_focus: ["Vergütung → fe-GUY-tung", "Tarif → ta-RÍF", "öffentlichen → ƠF-ent-lích-ần"] },
      { en: "Wäre eine Übernahme nach erfolgreichem Abschluss grundsätzlich möglich?", vi: "Sau khi hoàn thành tốt, có khả năng được nhận chính thức không?", pronunciation_focus: ["Übernahme → UY-bờ-na-mê", "erfolgreich → e-FOLK-rai-ích", "grundsätzlich → GRUNT-zét-slích"] },
      { en: "Ich freue mich darauf, ins kalte Wasser zu springen und schnell Verantwortung zu übernehmen.", vi: "Em mong được nhảy vào việc khó và nhận trách nhiệm sớm.", pronunciation_focus: ["kalte Wasser → KÁL-tê VÁ-sờ", "Verantwortung → fe-ÁNT-vơt-ung", "übernehmen → uy-bờ-NÊ-mần"] },
    ],
    cultural_notes_vi: "Praktikum (thực tập) ở Đức KHÁC HẲN ở Mỹ và Việt Nam ở năm điểm cốt lõi. (1) PHÂN LOẠI BẮT BUỘC: Đức phân biệt rõ Pflichtpraktikum (bắt buộc bởi chương trình học, < 3 tháng có thể không lương; > 3 tháng phải Mindestlohn ~12.41€/giờ) và freiwilliges Praktikum (tự nguyện, luôn phải Mindestlohn). (2) BẢO VỆ PHÁP LÝ: Praktikant Đức có quyền giống nhân viên (giờ làm, nghỉ phép tỉ lệ). KHÔNG phải 'cà phê & photocopy' như VN. (3) TÍNH ACADEMIC: trường ĐH có Praktikumsbeauftragte (cố vấn thực tập) — họ kiểm tra nội dung công việc có phù hợp chương trình học không. (4) ÜBERNAHME (nhận chính thức): nhiều công ty xem Praktikum như 'thử việc dài' — nếu bạn làm tốt, cơ hội cao được offer. Hỏi sớm 'Wäre eine Übernahme möglich?' để biết hướng. (5) ZEUGNIS: cuối Praktikum bạn nhận thư đánh giá (Arbeitszeugnis) — phải tự đảm bảo có và đọc cẩn thận. Tiếng Đức trong Zeugnis có 'mật mã' (ví dụ 'zur vollen Zufriedenheit' = chỉ ổn, 'zur vollsten Zufriedenheit' = xuất sắc).\n\nKhác Việt Nam: ở VN, Praktikum thường không lương hoặc lương rất thấp; ở Đức, có khung pháp lý rõ và bạn được expect đàm phán. KHÔNG đàm phán = bị coi là chưa hiểu hệ thống.\n\nỞ công ty Đức tại Việt Nam (Bosch, Siemens, BASF), Praktikum thường theo chuẩn Đức nhưng adapted cho mức lương VN.",
    tip_advice_vi: "Trước cuộc đàm phán: (1) Tra cứu TVöD-Tarif cho khu vực + cấp bậc tương ứng. (2) Tham khảo Stepstone, Glassdoor, Praktikum.info để biết mức thị trường thực tế. (3) Tính chi phí sinh hoạt thành phố (Munich ~1.200€ chỉ riêng nhà + ăn). (4) Chuẩn bị 3 con số: mức bạn muốn, mức tối thiểu chấp nhận, mức cực kỳ tốt.\n\nTrong cuộc đàm phán: (1) Đưa con số cụ thể, không 'cao hơn' hay 'tốt hơn'. (2) Gắn số với DỮ LIỆU: 'Ich orientiere mich am TVöD-Tarif von 1.500€'. (3) Khi bị pushback, im lặng 3-5 giây trước khi phản hồi. (4) Đưa ra alternative ngoài lương: Wohnungszuschuss, Bahncard 100, Sprachkurs-Budget. (5) Nếu công ty không thể tăng lương, hỏi về Übernahme với mức rõ ràng sau Praktikum.\n\nSau cuộc đàm phán: (1) Yêu cầu hợp đồng bằng văn bản trong 48-72h. (2) ĐỌC KỸ trước khi ký — đặc biệt: số giờ/tuần, ngày bắt đầu/kết thúc, Vergütung (gross vs net), nghỉ phép, học phí (nếu có), điều khoản Übernahme. (3) Không hiểu chỗ nào, hỏi rõ TRƯỚC khi ký. (4) Tham vấn Praktikumsbeauftragte ở trường nếu cần.",
    vocabulary: [
      { word: "das Pflichtpraktikum", en: "mandatory internship", vi: "thực tập bắt buộc", pos: "noun (n)", pronunciation_vi: "đát FLÍCHT-prak-ti-kum" },
      { word: "die Vergütung", en: "compensation, stipend", vi: "trợ cấp, lương thực tập", pos: "noun (f)", pronunciation_vi: "đi fe-GUY-tung" },
      { word: "die Übernahme", en: "permanent hire after internship", vi: "việc nhận chính thức sau thực tập", pos: "noun (f)", pronunciation_vi: "đi UY-bờ-na-mê" },
      { word: "der Tarif des öffentlichen Dienstes (TVöD)", en: "public sector pay scale", vi: "thang lương công chức", pos: "noun phrase", pronunciation_vi: "ta-RÍF" },
      { word: "die Lernziele", en: "learning objectives", vi: "mục tiêu học tập", pos: "noun (pl)", pronunciation_vi: "đi LE-tsí-lê" },
      { word: "die Werkstudententätigkeit", en: "working student position", vi: "vị trí sinh viên làm thêm", pos: "noun (f)", pronunciation_vi: "VEK-shtu-ден-tản-tê-tích-kait" },
      { word: "in Vollzeit/Teilzeit", en: "full-time/part-time", vi: "toàn thời gian/bán thời gian", pos: "adverb phrase", pronunciation_vi: "fol-tsait / tail-tsait" },
      { word: "der Tätigkeitsnachweis", en: "proof of activity, internship report", vi: "xác nhận hoạt động", pos: "noun (m)", pronunciation_vi: "TÊ-tích-kaits-nach-vais" },
      { word: "die Probearbeit", en: "trial work", vi: "thử việc", pos: "noun (f)", pronunciation_vi: "đi PRÔ-bê-ar-bait" },
      { word: "das Lehrgeld zahlen", en: "to learn the hard way (idiom)", vi: "trả học phí kinh nghiệm", pos: "verb phrase", pronunciation_vi: "đát LÊ-gelt TSÁ-lần" },
    ],
    dialogue: [
      { speaker: "HR-Manager", text: "Frau Linh, wir bieten 1.200 Euro brutto pro Monat an. Wäre das in Ordnung?", vi: "Cô Linh, chúng tôi đề xuất 1.200 euro tổng/tháng. Cô thấy ổn không?" },
      { speaker: "Linh", text: "Ich hatte mir 1.500 Euro vorgestellt, orientiert am TVöD-Niveau für Pflichtpraktika.", vi: "Em hình dung mức 1.500 euro, dựa trên thang TVöD cho thực tập bắt buộc." },
      { speaker: "HR-Manager", text: "1.350 Euro plus Mitarbeiterrabatt im Werksrestaurant könnten wir machen.", vi: "1.350 euro cộng với giảm giá nhà hàng nhân viên thì chúng tôi có thể duyệt." },
      { speaker: "Linh", text: "Das ist ein faires Angebot. Ich nehme an. Eine Hand reicht der anderen.", vi: "Đó là đề xuất công bằng. Em đồng ý. Có đi có lại." },
    ],
    dialogue_long: [
      { speaker: "HR-Manager", text: "Guten Tag, Frau Linh. Wir möchten Ihnen ein Praktikumsangebot machen. Setzen Sie sich.", vi: "Chào cô Linh. Chúng tôi muốn đề xuất vị trí thực tập. Mời cô ngồi." },
      { speaker: "Linh", text: "Vielen Dank, dass Sie an mich gedacht haben. Ich freue mich sehr.", vi: "Cảm ơn anh đã nghĩ đến em. Em rất vui." },
      { speaker: "HR-Manager", text: "Wir bieten Ihnen ein sechsmonatiges Praktikum in der Entwicklungsabteilung an, von April bis September.", vi: "Chúng tôi đề xuất kỳ thực tập 6 tháng tại bộ phận R&D, từ tháng Tư đến tháng Chín." },
      { speaker: "Linh", text: "Das passt perfekt zu meinem Studienplan. Welche konkreten Lernziele wären damit verbunden?", vi: "Phù hợp hoàn hảo với kế hoạch học của em. Những mục tiêu học tập cụ thể là gì?" },
      { speaker: "HR-Manager", text: "Sie würden im Team von Herrn Klein an Sensorik-Prototypen arbeiten — von der CAD-Konstruktion bis zur Prüfung im Labor.", vi: "Cô sẽ làm việc trong team của anh Klein về nguyên mẫu sensor — từ thiết kế CAD đến kiểm thử phòng lab." },
      { speaker: "Linh", text: "Klingt sehr spannend. Bezüglich der Vergütung — welche Größenordnung haben Sie vorgesehen?", vi: "Nghe rất thú vị. Về trợ cấp — anh dự kiến mức nào?" },
      { speaker: "HR-Manager", text: "Wir bieten 1.200 Euro brutto pro Monat an. Wäre das in Ordnung?", vi: "Chúng tôi đề xuất 1.200 euro tổng/tháng. Cô thấy ổn không?" },
      { speaker: "Linh", text: "Ich hatte mir 1.500 Euro vorgestellt, orientiert am TVöD-Niveau für Pflichtpraktika in der Region. München ist ja sehr teuer.", vi: "Em hình dung mức 1.500 euro, dựa trên thang TVöD cho thực tập bắt buộc trong vùng. Munich rất đắt đỏ." },
      { speaker: "HR-Manager", text: "Das verstehe ich. Lassen Sie mich kurz mit dem Abteilungsleiter Rücksprache halten.", vi: "Tôi hiểu. Để tôi trao đổi nhanh với trưởng bộ phận." },
      { speaker: "Linh", text: "Selbstverständlich. Ich warte gerne.", vi: "Tất nhiên. Em sẵn sàng đợi." },
      { speaker: "HR-Manager", text: "1.350 Euro plus Mitarbeiterrabatt im Werksrestaurant könnten wir machen. Außerdem volles ÖPNV-Ticket für München.", vi: "1.350 euro cộng giảm giá nhà hàng nhân viên + vé giao thông công cộng Munich. Đó là mức chúng tôi có thể duyệt." },
      { speaker: "Linh", text: "Das ist ein faires Angebot. Wäre eine Übernahme nach erfolgreichem Abschluss grundsätzlich möglich?", vi: "Đó là đề xuất công bằng. Sau khi hoàn thành tốt, có khả năng được nhận chính thức không?" },
      { speaker: "HR-Manager", text: "Grundsätzlich ja, wenn es eine offene Stelle gibt und Ihre Leistung überzeugt. Garantieren kann ich das aber nicht.", vi: "Về nguyên tắc có, nếu có vị trí trống và cô làm tốt. Nhưng tôi không thể đảm bảo." },
      { speaker: "Linh", text: "Verstanden — ich erwarte keine Garantie. Aber ich werde mich ins Zeug legen, um eine Übernahme realistisch zu machen.", vi: "Em hiểu — không đòi đảm bảo. Nhưng em sẽ nỗ lực hết sức để việc nhận chính thức trở nên hiện thực." },
      { speaker: "HR-Manager", text: "Genau die richtige Einstellung. Wann könnten Sie anfangen?", vi: "Đúng là thái độ cần có. Cô có thể bắt đầu khi nào?" },
      { speaker: "Linh", text: "Mein Semester endet am 31. März. Ab 1. April wäre ich verfügbar.", vi: "Học kỳ của em kết thúc 31/3. Từ 1/4 em có thể bắt đầu." },
      { speaker: "HR-Manager", text: "Perfekt. Ich schicke Ihnen den Vertrag bis Ende der Woche zu. Eine Hand wäscht die andere.", vi: "Tuyệt vời. Tôi sẽ gửi hợp đồng cho cô cuối tuần này. Có đi có lại." },
      { speaker: "Linh", text: "Vielen Dank für das angenehme Gespräch und die faire Verhandlung. Ich freue mich auf die Zusammenarbeit.", vi: "Cảm ơn anh về buổi nói chuyện dễ chịu và sự thương lượng công bằng. Em mong chờ được hợp tác." },
    ],
    roleplay_prompts: [
      "HR đề xuất 1.000€/tháng — thấp dưới mức tối thiểu sinh hoạt ở Munich. Hãy đàm phán bằng cách trích dẫn TVöD-Tarif và dữ liệu thị trường (Stepstone, Praktikum.info), KHÔNG nói 'em không đủ sống'. Đề xuất alternative: ngoài lương, có thể là Wohnungszuschuss, Bahncard, Weiterbildung budget.",
      "HR muốn bạn ký Praktikumsvertrag NGAY trong cuộc phỏng vấn 'để tránh người khác lấy cơ hội'. Hãy lịch sự từ chối — yêu cầu 48h để đọc kỹ hợp đồng, kiểm tra với cố vấn ở trường (Praktikumsbeauftragte). Dùng cụm 'Ich möchte den Vertrag erst gründlich durchgehen'.",
      "Sau 3 tháng thực tập tốt, bạn được offer ở lại làm Werkstudent (sinh viên làm thêm) song song học. Hãy thương lượng số giờ/tuần (max 20h trong kỳ học), lương theo giờ, và thoả thuận rằng kỳ thi sẽ ưu tiên hơn công việc.",
    ],
    register_notes: "Cuộc đàm phán Praktikum dùng 'Sie' formal — kể cả khi HR Manager còn trẻ và không khí thân thiện. Đặc biệt với cuộc gặp đầu tiên hoặc qua điện thoại. Sau khi ký hợp đồng và bắt đầu làm, đa số công ty Đức (đặc biệt startup, IT, agency) sẽ chuyển sang 'du' với đồng nghiệp; với sếp trực tiếp có thể tuỳ. Trong các bộ phận truyền thống (R&D, Engineering, Finanzen, Recht ở các công ty lớn như Bosch, Siemens, BMW, BASF), 'Sie' giữ lâu hơn — kể cả nội bộ.\n\nCấu trúc đàm phán: dùng Konjunktiv II liên tục — 'Ich hatte mir vorgestellt', 'Wäre es möglich', 'Könnten wir'. Plain form ('Ich will 1.500') cực kỳ thẳng và bất lịch sự. 'Ich brauche' (em cần) cũng yếu thế. Tone đúng: 'Bezüglich der Vergütung würde ich gerne den TVöD-Tarif als Orientierung nehmen' — formal, có dữ liệu, để cánh cửa mở.\n\nKhi đối tác pushback, KHÔNG cãi lý — dùng 'Das verstehe ich' (em hiểu) trước, sau đó đề xuất alternative.\n\nKhác Việt Nam: ở VN, đàm phán lương thực tập gần như không có; ở Đức, có khung pháp lý (Mindestlohn cho Pflichtpraktikum > 3 tháng) và TVöD-Tarif như benchmark — bạn HOÀN TOÀN có quyền đàm phán.",
    idiom_glosses: [
      { idiom: "Die Hand reichen", literal: "Đưa tay (cho người khác)", meaning: "Đề nghị hợp tác, hoà giải, hoặc giúp đỡ. Trong context đàm phán, dùng để báo hiệu đôi bên đã đến thoả thuận.", example: "Wenn Sie mir entgegenkommen, reiche ich Ihnen gerne die Hand." },
      { idiom: "Lehrgeld zahlen", literal: "Trả học phí", meaning: "Học từ sai lầm — trả giá để có kinh nghiệm. Praktikum chính là quá trình 'Lehrgeld zahlen'. Cụm tích cực, không tiêu cực.", example: "Im ersten Praktikum musste ich viel Lehrgeld zahlen — aber dadurch habe ich enorm gelernt." },
      { idiom: "Ein offenes Ohr haben", literal: "Có một tai mở", meaning: "Sẵn sàng lắng nghe — về vấn đề cá nhân hoặc nghề nghiệp. Khi sếp/HR Đức nói 'Bei Fragen habe ich immer ein offenes Ohr', đó là invitation thật.", example: "Bei Problemen habe ich für Sie immer ein offenes Ohr." },
      { idiom: "Unter vier Augen reden", literal: "Nói dưới bốn con mắt", meaning: "Nói chuyện riêng tư, chỉ giữa hai người — không có ai khác. Phù hợp khi cần đàm phán nhạy cảm (lương, conflict).", example: "Diese Frage zur Vergütung sollten wir unter vier Augen besprechen." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm phù hợp khi đàm phán Praktikum:",
        pronunciation_focus: ["Konjunktiv II", "negotiation"],
        items: [
          { prompt: "Bezüglich der _____ würde ich gerne den TVöD nehmen. (trợ cấp)", answer: "Vergütung" },
          { prompt: "_____ eine Übernahme grundsätzlich möglich? (Konjunktiv II — có thể không?)", answer: "Wäre" },
          { prompt: "Ich werde mich ins _____ legen. (nỗ lực hết mình)", answer: "Zeug" },
          { prompt: "Können wir das unter vier _____ besprechen? (riêng tư)", answer: "Augen" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối câu Đức với chức năng đàm phán:",
        pronunciation_focus: [],
        items: [
          { prompt: "Ich hatte mir 1.500€ vorgestellt.", answer: "Đề xuất con số có dữ liệu" },
          { prompt: "Lassen Sie mich Rücksprache halten.", answer: "HR cần consult cấp trên" },
          { prompt: "Wäre eine Übernahme möglich?", answer: "Hỏi cơ hội nhận chính thức" },
          { prompt: "Eine Hand wäscht die andere.", answer: "Có đi có lại — kết thúc thoả thuận" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức công sở:",
        pronunciation_focus: ["Konjunktiv II", "Sie-Form"],
        items: [
          { prompt: "Em ứng tuyển kỳ thực tập 6 tháng tại bộ phận R&D.", answer: "Ich bewerbe mich um das sechsmonatige Praktikum in der Entwicklungsabteilung." },
          { prompt: "Sau hoàn thành tốt, có khả năng được nhận chính thức không?", answer: "Wäre eine Übernahme nach erfolgreichem Abschluss grundsätzlich möglich?" },
          { prompt: "Em mong được nhận trách nhiệm sớm.", answer: "Ich freue mich darauf, schnell Verantwortung zu übernehmen." },
          { prompt: "Cảm ơn anh về buổi thương lượng công bằng.", answer: "Vielen Dank für die faire Verhandlung." },
        ],
      },
    ],
  },
  {
    id: "german_b2_visa_email_studienkolleg",
    level: "B2",
    category: "fluency",
    title_vi: "Email xin visa đến Studienkolleg",
    title_en: "Visa email to Studienkolleg administration",
    sentences: [
      { en: "Sehr geehrte Damen und Herren, ich wende mich an Sie bezüglich meiner Visumsbeantragung.", vi: "Kính gửi quý anh chị, em viết email này về việc xin visa.", pronunciation_focus: ["Damen und Herren → ĐA-mần und HE-rần", "Visumsbeantragung → VÍ-zums-bê-an-tra-gung", "wende → VEN-đê"] },
      { en: "Für die Beantragung des Studentenvisums benötige ich dringend die Zulassungsbestätigung.", vi: "Để nộp đơn xin visa du học, em cần gấp giấy xác nhận tiếp nhận.", pronunciation_focus: ["Studentenvisum → shtu-ĐEN-tản-vi-zum", "benötige → bê-NƠ-ti-gờ", "Zulassungsbestätigung → TSU-la-sungs-bê-shtê-ti-gung"] },
      { en: "Mein Visumstermin bei der Deutschen Botschaft in Hanoi ist am 15. März.", vi: "Lịch hẹn visa của em tại Đại sứ quán Đức Hà Nội là ngày 15 tháng Ba.", pronunciation_focus: ["Visumstermin → VÍ-zums-te-min", "Botschaft → BÔT-shaft", "Hanoi → ha-NÔI"] },
      { en: "Wäre es möglich, die Bestätigung bis spätestens 1. März zu versenden?", vi: "Anh chị có thể gửi giấy xác nhận muộn nhất ngày 1 tháng Ba được không?", pronunciation_focus: ["Wäre → VÊ-rê — Konjunktiv II", "Bestätigung → bê-shtê-TI-gung", "spätestens → SHPÊ-tệs-tận"] },
      { en: "Ich verbleibe mit freundlichen Grüßen und stehe für Rückfragen jederzeit zur Verfügung.", vi: "Em xin chào với lời thân ái và sẵn sàng trả lời câu hỏi bất cứ lúc nào.", pronunciation_focus: ["verbleibe → fe-BLAI-bê", "freundlichen → FROIND-lích-ần", "Verfügung → fe-FUY-gung"] },
    ],
    cultural_notes_vi: "Liên lạc với cơ quan hành chính Đức (Studienkolleg, Hochschule, Auslandsamt, Botschaft) khác Việt Nam ở năm điểm. (1) FORMAL TUYỆT ĐỐI: email phải có cấu trúc đầy đủ — không có 'Hi anh', không có emoji, không có ngôn ngữ thân mật. Sai cấu trúc = bị coi là không nghiêm túc, hồi âm chậm hơn. (2) CHẬM VÀ BUREAUCRATIC: phản hồi 5-10 ngày làm việc là chuẩn; có thể đến 3-4 tuần cho việc phức tạp. KHÔNG follow-up trong 7 ngày đầu. (3) CHUỖI XỬ LÝ DÀI: email đầu tiên thường vào 'Sekretariat' chung, sau đó được forward đến 'Sachbearbeiter:in'. (4) VĂN BẢN PAPER vẫn quan trọng: nhiều giấy tờ chính thức Đức yêu cầu BẢN GỐC qua bưu điện. Tính trước thời gian giao nhận DHL/Express (5-7 ngày VN-DE qua express). (5) CHÍNH XÁC HƠN TỐC ĐỘ: nhân viên Đức thà chậm và đúng hơn nhanh và sai. Thay vào đó đưa ra DEADLINE rõ ràng + LÝ DO cụ thể (lịch hẹn visa, kỳ học bắt đầu).\n\nKhác Việt Nam: ở VN, có thể nhắn Zalo hoặc gọi điện trực tiếp cho cán bộ; ở Đức, KHÔNG được làm vậy với cơ quan — phải qua email/thư chính thức.\n\nVới các giấy tờ visa cụ thể: APS-Bescheinigung, Sperrkonto, Krankenversicherung, Wohnnachweis — chuẩn bị TRƯỚC khi đặt lịch visa, không trong khi chờ.",
    tip_advice_vi: "Cấu trúc email formal: (1) Subject rõ ràng + chứa từ khoá: 'Anfrage Zulassungsbestätigung für Visumstermin am 15.03.2025 — Matrikelnr. 2024-VN-1037'. (2) Mở 'Sehr geehrte Frau Weber' (biết tên) hoặc 'Sehr geehrte Damen und Herren' (không biết). (3) Đoạn 1 (mở): 'ich wende mich an Sie bezüglich [chủ đề]'. (4) Đoạn 2 (vấn đề): mô tả vấn đề + ngày + số liệu cụ thể. (5) Đoạn 3 (yêu cầu): 'Wäre es möglich, [yêu cầu cụ thể] bis [deadline] zu [động từ]?'. (6) Đoạn 4 (lý do): 'Eine Verschiebung würde [hậu quả cụ thể] gefährden'. (7) Kết: 'Für Rückfragen stehe ich jederzeit zur Verfügung. Mit freundlichen Grüßen, [Tên + Mã SV]'.\n\nFile attachments: PDF only. Đặt tên file rõ ràng: 'Linh_Nguyen_2024-VN-1037_Sperrkonto.pdf'. Mention attachment trong email: 'Anbei finden Sie...'.\n\nFollow-up: nếu không phản hồi trong 7 ngày, đợi đến 10-14 ngày rồi follow-up MỘT LẦN. Email follow-up: ngắn (3 dòng), tham chiếu email gốc bằng ngày, hỏi status. Sau 21 ngày không phản hồi, follow-up lần 2 cộng với CC sếp (Studiengangskoordinator).\n\nĐiện thoại: chỉ gọi khi khẩn cấp (deadline trong 48h). Mở đầu: 'Guten Tag, mein Name ist Linh Nguyễn, Matrikelnr. 2024-VN-1037'.",
    vocabulary: [
      { word: "die Visumsbeantragung", en: "visa application", vi: "việc nộp đơn xin visa", pos: "noun (f)", pronunciation_vi: "đi VÍ-zums-bê-an-tra-gung" },
      { word: "die Zulassungsbestätigung", en: "letter of admission", vi: "giấy xác nhận tiếp nhận", pos: "noun (f)", pronunciation_vi: "đi TSU-la-sungs-bê-shtê-ti-gung" },
      { word: "das Studentenvisum", en: "student visa", vi: "visa du học sinh", pos: "noun (n)", pronunciation_vi: "đát shtu-ĐEN-tản-vi-zum" },
      { word: "der Visumstermin", en: "visa appointment", vi: "lịch hẹn visa", pos: "noun (m)", pronunciation_vi: "đe VÍ-zums-te-min" },
      { word: "die Deutsche Botschaft", en: "German Embassy", vi: "Đại sứ quán Đức", pos: "noun (f)", pronunciation_vi: "đi ĐOI-chê BÔT-shaft" },
      { word: "die Sperrkonto-Bestätigung", en: "blocked account confirmation", vi: "xác nhận tài khoản phong toả", pos: "noun (f)", pronunciation_vi: "SHPE-kôn-tô-bê-shtê-ti-gung" },
      { word: "das Studienkolleg", en: "preparatory college (foundation year)", vi: "khoá dự bị đại học", pos: "noun (n)", pronunciation_vi: "đát SHTÚ-đi-ần-kô-lếch" },
      { word: "die Aufenthaltserlaubnis", en: "residence permit", vi: "giấy phép cư trú", pos: "noun (f)", pronunciation_vi: "đi AOF-ent-halts-e-laob-nis" },
      { word: "das Anschreiben", en: "cover letter, formal letter", vi: "thư trình bày", pos: "noun (n)", pronunciation_vi: "đát AN-shrai-bần" },
      { word: "auf der lange Bank schieben", en: "to put off, procrastinate (idiom)", vi: "trì hoãn, kéo dài", pos: "verb phrase", pronunciation_vi: "AOF đe LANG-ê BANK SHÍ-bần" },
    ],
    dialogue: [
      { speaker: "Linh (email)", text: "Sehr geehrte Damen und Herren, ich benötige dringend die Zulassungsbestätigung für meinen Visumstermin am 15. März.", vi: "Kính gửi quý anh chị, em cần gấp giấy xác nhận tiếp nhận cho lịch hẹn visa ngày 15/3." },
      { speaker: "Studienkolleg-Sekretariat", text: "Ihre Anfrage wurde an die zuständige Sachbearbeiterin Frau Weber weitergeleitet. Bitte um Geduld.", vi: "Yêu cầu của em đã được chuyển đến nhân viên phụ trách, chị Weber. Mong em kiên nhẫn." },
      { speaker: "Linh (email)", text: "Vielen Dank für die schnelle Rückmeldung. Wann kann ich mit der Bestätigung rechnen?", vi: "Cảm ơn phản hồi nhanh. Em có thể nhận giấy xác nhận khi nào?" },
      { speaker: "Frau Weber", text: "Das Dokument wird heute postalisch versandt und ist in 5-7 Werktagen bei Ihnen.", vi: "Tài liệu sẽ được gửi qua bưu điện hôm nay, đến nơi trong 5-7 ngày làm việc." },
    ],
    dialogue_long: [
      { speaker: "Linh (email)", text: "Sehr geehrte Damen und Herren, ich wende mich heute an Sie in einer dringenden Angelegenheit bezüglich meiner Visumsbeantragung.", vi: "Kính gửi quý anh chị, em viết email hôm nay về một việc khẩn liên quan đến đơn xin visa của em." },
      { speaker: "Linh (email)", text: "Für die Beantragung meines Studentenvisums an der Deutschen Botschaft in Hanoi am 15. März benötige ich dringend die Zulassungsbestätigung des Studienkollegs München.", vi: "Để xin visa du học sinh tại Đại sứ quán Đức Hà Nội ngày 15/3, em cần gấp giấy xác nhận tiếp nhận của Studienkolleg München." },
      { speaker: "Linh (email)", text: "Wäre es möglich, mir die Bestätigung bis spätestens 1. März per E-Mail in Kopie zukommen zu lassen, damit ich den Termin nicht verschieben muss?", vi: "Anh chị có thể gửi bản sao giấy xác nhận qua email muộn nhất ngày 1/3 để em không phải dời lịch hẹn không?" },
      { speaker: "Linh (email)", text: "Eine Verschiebung des Visumstermins würde meinen geplanten Studienbeginn im Wintersemester ernsthaft gefährden.", vi: "Việc dời lịch hẹn visa sẽ đe doạ nghiêm trọng kế hoạch nhập học kỳ Mùa đông của em." },
      { speaker: "Linh (email)", text: "Für Rückfragen stehe ich Ihnen jederzeit telefonisch unter +84 90 123 4567 zur Verfügung. Mit freundlichen Grüßen, Linh Nguyễn, Matrikelnummer 2024-VN-1037", vi: "Em sẵn sàng trả lời câu hỏi qua điện thoại +84 90 123 4567 bất cứ lúc nào. Trân trọng, Linh Nguyễn, Mã sinh viên 2024-VN-1037" },
      { speaker: "Sekretariat", text: "Sehr geehrte Frau Nguyễn, vielen Dank für Ihre E-Mail. Ihre Anfrage wurde an die zuständige Sachbearbeiterin, Frau Weber, weitergeleitet. Sie wird sich in den nächsten 2-3 Werktagen bei Ihnen melden.", vi: "Kính gửi cô Nguyễn, cảm ơn email của cô. Yêu cầu đã được chuyển đến nhân viên phụ trách, chị Weber. Chị ấy sẽ liên hệ trong 2-3 ngày làm việc tới." },
      { speaker: "Frau Weber", text: "Sehr geehrte Frau Nguyễn, ich habe Ihren Vorgang einsehen können. Die Zulassungsbestätigung ist bereits erstellt und unterschrieben.", vi: "Kính gửi cô Nguyễn, tôi đã xem hồ sơ của cô. Giấy xác nhận tiếp nhận đã được lập và ký." },
      { speaker: "Frau Weber", text: "Aus rechtlichen Gründen können wir die Originalbestätigung leider nur per Post versenden. Ich kann Ihnen aber heute eine eingescannte Kopie als PDF zuschicken.", vi: "Vì lý do pháp lý, chúng tôi chỉ có thể gửi bản gốc qua bưu điện. Nhưng tôi có thể gửi bản scan PDF cho cô hôm nay." },
      { speaker: "Linh (email)", text: "Sehr geehrte Frau Weber, vielen Dank für Ihre rasche Antwort. Eine PDF-Kopie wäre für die Botschaft erst einmal ausreichend.", vi: "Kính gửi chị Weber, cảm ơn phản hồi nhanh. Bản PDF tạm đủ cho Đại sứ quán." },
      { speaker: "Linh (email)", text: "Können Sie das Original parallel per DHL Express versenden? Ich übernehme gerne die Versandkosten.", vi: "Chị có thể gửi bản gốc qua DHL Express song song không? Em sẽ trả phí vận chuyển." },
      { speaker: "Frau Weber", text: "DHL Express nach Vietnam ist möglich, kostet allerdings rund 80 Euro. Sind Sie damit einverstanden?", vi: "DHL Express sang Việt Nam được, nhưng chi phí khoảng 80 euro. Cô có đồng ý không?" },
      { speaker: "Linh (email)", text: "Ja, das ist akzeptabel. Wie kann ich die Kosten überweisen — Vorkasse oder Rechnung?", vi: "Vâng, chấp nhận được. Em có thể chuyển khoản thế nào — trả trước hay hoá đơn?" },
      { speaker: "Frau Weber", text: "Ich sende Ihnen heute Nachmittag die Rechnung per E-Mail. Nach Zahlungseingang versende ich das Original noch am selben Tag.", vi: "Tôi sẽ gửi hoá đơn qua email chiều nay. Sau khi nhận được thanh toán, tôi gửi bản gốc cùng ngày." },
      { speaker: "Linh (email)", text: "Vielen Dank, Frau Weber. Ich werde die Überweisung sofort tätigen und schicke Ihnen anschließend den Zahlungsbeleg.", vi: "Cảm ơn chị Weber. Em sẽ chuyển khoản ngay và gửi biên nhận sau đó." },
      { speaker: "Frau Weber", text: "Perfekt. Falls Sie weitere Dokumente für die Botschaft benötigen — Stundenplan, Curriculum, Sprachstandsnachweis — sagen Sie Bescheid.", vi: "Hoàn hảo. Nếu cô cần thêm tài liệu cho Đại sứ quán — lịch học, chương trình, xác nhận trình độ ngôn ngữ — cứ báo tôi." },
      { speaker: "Linh (email)", text: "Eine letzte Frage: ist die Sperrkonto-Bestätigung der Deutschen Bank ausreichend, oder bevorzugen Sie eine andere Bank?", vi: "Một câu hỏi cuối: xác nhận tài khoản phong toả của Deutsche Bank có đủ không, hay anh chị muốn ngân hàng khác?" },
      { speaker: "Frau Weber", text: "Deutsche Bank, Fintiba, Expatrio — alle gängigen Anbieter sind anerkannt. Hauptsache, der Mindestbetrag von 11.208 Euro ist nachgewiesen.", vi: "Deutsche Bank, Fintiba, Expatrio — tất cả nhà cung cấp phổ biến đều được công nhận. Chính yếu là chứng minh được số tiền tối thiểu 11.208 euro." },
      { speaker: "Linh (email)", text: "Vielen Dank für Ihre Geduld und Hilfsbereitschaft, Frau Weber. Sie haben mir wirklich aus der Patsche geholfen. Mit freundlichen Grüßen, Linh Nguyễn", vi: "Cảm ơn chị Weber về sự kiên nhẫn và sẵn lòng giúp đỡ. Chị thực sự đã giúp em thoát khỏi tình thế khó. Trân trọng, Linh Nguyễn" },
    ],
    roleplay_prompts: [
      "Bạn nhận email từ Studienkolleg: 'Aufgrund interner Verzögerungen können wir die Zulassungsbestätigung erst Mitte April versenden' — sau lịch hẹn visa của bạn 1 tháng. Hãy viết email phản hồi: nêu hậu quả cụ thể (mất kỳ học, lỡ Sperrkonto), đề xuất 3 phương án (PDF interim, gửi Express, gửi qua DHL).",
      "Sau visa được cấp, bạn muốn xin Studienkolleg cho phép trễ 2 tuần vì gia đình có việc. Hãy viết email formal — không xin lỗi quá mức, đưa lý do cụ thể, đề xuất kế hoạch bù học.",
      "Email từ Studienkolleg yêu cầu thêm tài liệu (APS-Bescheinigung) mà bạn KHÔNG có. Hãy phản hồi giải thích bạn đã nộp đơn xin APS từ 2 tháng trước, hiện chưa nhận được, và xin gia hạn deadline submission.",
    ],
    register_notes: "Email chính thức tiếng Đức tuân thủ cấu trúc cứng nhắc — sai cấu trúc = thiếu chuyên nghiệp ngay lập tức. (1) MỞ ĐẦU: 'Sehr geehrte Damen und Herren' (không biết tên), 'Sehr geehrte Frau Weber' / 'Sehr geehrter Herr Müller' (biết tên). KHÔNG dùng 'Hallo' hoặc 'Hi' với cơ quan công, đại học, công ty truyền thống. Sau dấu phẩy XUỐNG DÒNG và viết thường chữ đầu của câu tiếp ('ich' không 'Ich'). (2) THÂN BÀI: chia thành các đoạn ngắn (3-4 câu mỗi đoạn). (3) KẾT: 'Mit freundlichen Grüßen' (hoặc viết tắt 'MfG' chỉ với người đã quen).\n\nNgôn ngữ: dùng kính ngữ tuyệt đối — Konjunktiv II cho mọi yêu cầu ('Wäre es möglich', 'Könnten Sie', 'Ich würde mich freuen, wenn'); động từ formal ('benötigen' thay vì 'brauchen', 'erbitten' thay vì 'wollen', 'mitteilen' thay vì 'sagen', 'übermitteln' thay vì 'schicken').\n\nĐộng từ tách formal-only: 'Anbei sende ich Ihnen...' (Đính kèm em gửi anh chị), 'Ich verbleibe mit freundlichen Grüßen' (formal extreme).\n\nNgười Việt thường mắc lỗi: (1) email dùng 'kindly' kiểu Anh — không có equivalent trong Đức formal; (2) thêm nhiều exclamation mark/emoji — bị coi là không nghiêm túc; (3) xin lỗi quá mức.",
    idiom_glosses: [
      { idiom: "Geduld ist eine Tugend", literal: "Kiên nhẫn là đức tính", meaning: "Phải kiên nhẫn — câu thành ngữ phổ biến để nhắc nhở bản thân hoặc người khác đừng vội vàng. Khi xử lý giấy tờ Đức, câu này áp dụng thường xuyên — bộ máy hành chính chậm.", example: "Bei der Visumsbeantragung gilt: Geduld ist eine Tugend." },
      { idiom: "Etwas auf die lange Bank schieben", literal: "Đẩy việc gì lên ghế dài", meaning: "Trì hoãn, để lại làm sau. Phù hợp khi nói về việc cơ quan trì hoãn xử lý giấy tờ.", example: "Bitte schieben Sie meinen Antrag nicht auf die lange Bank — der Termin ist dringend." },
      { idiom: "Das letzte Wort haben", literal: "Có lời cuối cùng", meaning: "Có quyền quyết định cuối — không thể thay đổi sau quyết định của họ. Trong context Đại sứ quán/Visa: 'Die Botschaft hat das letzte Wort'.", example: "Bei der Visumsentscheidung hat die Botschaft das letzte Wort." },
      { idiom: "Steine in den Weg legen", literal: "Đặt đá lên đường", meaning: "Cản trở, gây khó khăn — cố ý hoặc do bureaucracy. Dùng để phàn nàn về cơ quan tạo trở ngại không cần thiết.", example: "Die Verzögerung der Bestätigung legt mir Steine in den Weg." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm formal phù hợp cho email visa:",
        pronunciation_focus: ["formal email register"],
        items: [
          { prompt: "Sehr _____ Damen und Herren, (mở đầu chuẩn)", answer: "geehrte" },
          { prompt: "Ich _____ mich an Sie bezüglich meiner Visumsbeantragung. (chuyển động: hướng đến)", answer: "wende" },
          { prompt: "_____ es möglich, die Bestätigung bis 1. März zu versenden? (Konjunktiv II)", answer: "Wäre" },
          { prompt: "Mit freundlichen _____, (kết email chuẩn)", answer: "Grüßen" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối câu Đức với chức năng email formal:",
        pronunciation_focus: [],
        items: [
          { prompt: "Ich wende mich an Sie bezüglich...", answer: "Mở đầu nêu chủ đề" },
          { prompt: "Eine Verschiebung würde meinen Studienbeginn gefährden.", answer: "Nêu hậu quả nếu không xử lý" },
          { prompt: "Für Rückfragen stehe ich jederzeit zur Verfügung.", answer: "Kết — mời tiếp xúc thêm" },
          { prompt: "Geduld ist eine Tugend.", answer: "Tự nhắc kiên nhẫn (idiom)" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức formal cho email cơ quan:",
        pronunciation_focus: ["formal email"],
        items: [
          { prompt: "Em cần gấp giấy xác nhận tiếp nhận.", answer: "Ich benötige dringend die Zulassungsbestätigung." },
          { prompt: "Lịch hẹn visa của em là ngày 15 tháng Ba.", answer: "Mein Visumstermin ist am 15. März." },
          { prompt: "Em có thể nhận giấy xác nhận khi nào?", answer: "Wann kann ich mit der Bestätigung rechnen?" },
          { prompt: "Em sẵn sàng trả lời câu hỏi bất cứ lúc nào.", answer: "Für Rückfragen stehe ich jederzeit zur Verfügung." },
        ],
      },
    ],
  },
  {
    id: "german_b2_phone_interview_overseas",
    level: "B2",
    category: "fluency",
    title_vi: "Phỏng vấn qua điện thoại từ VN",
    title_en: "Phone interview from Vietnam to German company",
    sentences: [
      { en: "Hören Sie mich gut? Die Verbindung ist heute leider nicht optimal.", vi: "Anh/chị nghe em rõ không? Đường truyền hôm nay không tốt lắm.", pronunciation_focus: ["Verbindung → fe-BÍN-đung", "leider → LAI-đờ", "optimal → ô-pti-MAL"] },
      { en: "Entschuldigung, könnten Sie die Frage bitte wiederholen?", vi: "Xin lỗi, anh/chị có thể nhắc lại câu hỏi được không?", pronunciation_focus: ["Entschuldigung → ent-SHUL-đi-gung", "wiederholen → vi-đờ-HÔ-lần", "Frage → FRA-gờ"] },
      { en: "Ich rufe aus Hồ-Chí-Minh-Stadt an — die Zeitverschiebung beträgt fünf Stunden.", vi: "Em gọi từ TP HCM — chênh lệch giờ 5 tiếng.", pronunciation_focus: ["rufe an → RU-fê AN — verb tách", "Zeitverschiebung → TSAIT-fe-shi-bung", "beträgt → bê-TRẾ-gt"] },
      { en: "Lassen Sie mich kurz nachdenken, bevor ich antworte.", vi: "Cho phép em suy nghĩ một chút trước khi trả lời.", pronunciation_focus: ["nachdenken → NÁCH-đen-kần", "bevor → bê-FOA", "antworte → ANT-vot-tê"] },
      { en: "Ich möchte das auf den Punkt bringen: Mein Mehrwert für Ihr Team ist meine Brückenkompetenz.", vi: "Em muốn nói thẳng: giá trị em mang lại cho team là năng lực cầu nối.", pronunciation_focus: ["auf den Punkt bringen → AOF đần PUNKT BRÍNG-ần (idiom)", "Mehrwert → MÊ-vet", "Brückenkompetenz → BRUY-kần-kôm-pê-tens"] },
    ],
    cultural_notes_vi: "Phỏng vấn điện thoại với công ty Đức từ Việt Nam có 5 thách thức đặc thù khác in-person. (1) TIMEZONE: Đức 5h sau VN (mùa đông) hoặc 4h (mùa hè). Đa số phỏng vấn tổ chức 14-17h Đức = 19-22h VN. Bạn phải sẵn sàng phỏng vấn lúc tối khuya — kèm năng lượng cao. (2) ĐƯỜNG TRUYỀN: WiFi VN không phải lúc nào cũng ổn, đặc biệt mùa mưa. CHUẨN BỊ: backup 4G/5G, gọi từ phòng yên tĩnh, đóng các app khác trên máy tính. (3) NGÔN NGỮ: không có visual cues làm dễ misunderstand. Nói chậm hơn 20%, phát âm rõ, dùng câu ngắn. Nếu accent VN dày, có thể đề xuất video call từ đầu. (4) THIẾU BODY LANGUAGE: bạn không biết người phỏng vấn đang gật đầu hay frown. Bù bằng cách hỏi xác nhận. (5) CULTURAL ASSUMPTIONS: nhà tuyển dụng có thể có định kiến về 'người làm việc từ xa Á châu'. Bạn cần chủ động giải quyết các định kiến này.\n\nKhác Việt Nam: ở VN, phỏng vấn điện thoại thường là sàng lọc nhanh, ít câu hỏi sâu; ở Đức, phỏng vấn điện thoại có thể là VÒNG ĐẦU TIÊN với trọng số cao, kéo dài 45-60 phút.\n\nMột chi tiết quan trọng: KHI KẾT THÚC, hỏi rõ NEXT STEP và TIMELINE. 'Wann darf ich mit einer Rückmeldung rechnen?'. Sau cuộc gọi 24h, gửi email cảm ơn ngắn (3-4 dòng) tham chiếu đến điểm cụ thể trong cuộc nói chuyện.\n\nVisa context: nếu công ty hỏi 'Wann können Sie anfangen?', đừng nói 'sofort' nếu chưa có Arbeitsvisum. Nói thực tế: 'Nach erfolgreicher Visumsbeantragung — voraussichtlich 6-8 Wochen'.",
    tip_advice_vi: "Trước cuộc gọi (1 ngày trước): (1) Test thiết bị: tai nghe + mic + WiFi backup. (2) Chuẩn bị không gian yên tĩnh, ánh sáng tốt nếu video. (3) In CV + JD công ty, đặt trên bàn. (4) Chuẩn bị 5 câu hỏi cho người phỏng vấn. (5) Có chai nước trên bàn. (6) Mặc smart casual.\n\nMở đầu cuộc gọi: (1) Bắt máy đúng tên: 'Linh Nguyễn am Apparat'. (2) Chào formal: 'Guten Tag/Abend, Frau Becker'. (3) Cảm ơn cơ hội: 'Vielen Dank, dass Sie sich Zeit nehmen'. (4) Báo time zone nếu phù hợp: 'Bei mir ist es 19 Uhr'. (5) Confirm âm thanh: 'Hören Sie mich gut?'.\n\nTrong cuộc gọi: (1) Nói chậm hơn 20% so với bình thường. (2) Phát âm rõ âm cuối — đặc biệt 'r', 'ch', 'sch'. (3) Khi cần suy nghĩ, BÁO HIỆU: 'Lassen Sie mich kurz nachdenken'. (4) Khi không nghe rõ, ADMIT NGAY: 'Entschuldigung, könnten Sie wiederholen?'. (5) Khi đường truyền tệ, đề xuất alternative. (6) Trả lời câu hỏi theo cấu trúc STAR.\n\nKết cuộc gọi: (1) Tóm tắt 1 câu về điểm phù hợp. (2) Hỏi NEXT STEP: 'Wie geht es jetzt weiter?'. (3) Hỏi TIMELINE. (4) Cảm ơn formal.\n\nSau cuộc gọi: (1) Trong 24h, gửi email cảm ơn ngắn (3-4 dòng), tham chiếu điểm cụ thể.",
    vocabulary: [
      { word: "die Verbindung", en: "connection (phone/internet)", vi: "đường truyền/kết nối", pos: "noun (f)", pronunciation_vi: "đi fe-BÍN-đung" },
      { word: "die Zeitverschiebung", en: "time difference", vi: "chênh lệch giờ", pos: "noun (f)", pronunciation_vi: "đi TSAIT-fe-shi-bung" },
      { word: "das Telefoninterview", en: "phone interview", vi: "phỏng vấn điện thoại", pos: "noun (n)", pronunciation_vi: "đát tê-lê-FÔN-ин-tờ-vyu" },
      { word: "wiederholen", en: "to repeat", vi: "nhắc lại", pos: "verb", pronunciation_vi: "vi-đờ-HÔ-lần" },
      { word: "der Mehrwert", en: "added value", vi: "giá trị gia tăng", pos: "noun (m)", pronunciation_vi: "đe MÊ-vet" },
      { word: "die Brückenkompetenz", en: "bridging competence", vi: "năng lực cầu nối", pos: "noun (f)", pronunciation_vi: "đi BRUY-kần-kôm-pê-tens" },
      { word: "die Stille", en: "silence", vi: "khoảng im lặng", pos: "noun (f)", pronunciation_vi: "đi SHTÍ-lê" },
      { word: "umziehen nach", en: "to relocate to", vi: "chuyển đến (ở)", pos: "verb (sep)", pronunciation_vi: "UM-tsi-ần nách" },
      { word: "die Bereitschaft", en: "willingness, readiness", vi: "sự sẵn sàng", pos: "noun (f)", pronunciation_vi: "đi BÊ-rait-shaft" },
      { word: "das Gespräch wieder aufnehmen", en: "to resume the conversation", vi: "tiếp tục cuộc trò chuyện", pos: "verb phrase", pronunciation_vi: "AOF-nê-mần" },
    ],
    dialogue: [
      { speaker: "Frau Becker", text: "Hallo, Frau Linh, hören Sie mich? Die Verbindung scheint etwas instabil.", vi: "Alo, cô Linh, cô nghe tôi không? Đường truyền có vẻ không ổn." },
      { speaker: "Linh", text: "Ja, ich höre Sie gut. Es regnet hier in Hồ-Chí-Minh-Stadt — manchmal stockt das Internet.", vi: "Vâng, em nghe rõ. Bên này TP HCM đang mưa — đôi khi mạng bị ngắt." },
      { speaker: "Frau Becker", text: "Verstanden. Lassen Sie uns dann gleich loslegen — sind Sie bereit?", vi: "Tôi hiểu. Vậy mình bắt đầu luôn nhé — cô sẵn sàng chưa?" },
      { speaker: "Linh", text: "Ich bin bereit. Vielen Dank für Ihre Geduld trotz der technischen Hürden.", vi: "Em sẵn sàng. Cảm ơn chị về sự kiên nhẫn dù có rào cản kỹ thuật." },
    ],
    dialogue_long: [
      { speaker: "Frau Becker", text: "Guten Tag, hier spricht Becker von der Personalabteilung. Spreche ich mit Frau Linh Nguyễn?", vi: "Chào, đây là Becker từ phòng Nhân sự. Tôi đang nói chuyện với cô Linh Nguyễn phải không?" },
      { speaker: "Linh", text: "Ja, am Apparat. Guten Abend, Frau Becker — bei mir in Vietnam ist es bereits 19 Uhr.", vi: "Vâng, em đây. Chào tối chị Becker — bên em Việt Nam đã 7 giờ tối." },
      { speaker: "Frau Becker", text: "Oh, vielen Dank, dass Sie sich noch so spät Zeit nehmen. Passt der Termin gut für Sie?", vi: "Ồ, cảm ơn cô đã dành thời gian dù muộn thế. Lịch có hợp với cô không?" },
      { speaker: "Linh", text: "Absolut, kein Problem. Ich freue mich auf das Gespräch.", vi: "Hoàn toàn được, không vấn đề gì. Em mong chờ buổi nói chuyện." },
      { speaker: "Frau Becker", text: "Hören Sie mich gut? Die Verbindung scheint etwas instabil.", vi: "Cô nghe tôi rõ không? Đường truyền có vẻ không ổn." },
      { speaker: "Linh", text: "Ja, ich höre Sie gut. Es regnet hier in Hồ-Chí-Minh-Stadt — sollte sich aber gleich legen.", vi: "Vâng, em nghe rõ. Bên này TP HCM đang mưa — sắp tạnh rồi." },
      { speaker: "Frau Becker", text: "Gut, dann fangen wir an. Bitte erzählen Sie mir kurz, warum Sie sich für die Stelle in Stuttgart bewerben.", vi: "Tốt, vậy mình bắt đầu. Mời cô kể ngắn gọn vì sao ứng tuyển vị trí ở Stuttgart." },
      { speaker: "Linh", text: "Drei Hauptgründe: erstens passt mein Profil als Wirtschaftsingenieurin perfekt; zweitens habe ich bereits drei Jahre für ein deutsches Tochterunternehmen in Vietnam gearbeitet; drittens — ich bin überzeugt, dass meine Brückenkompetenz Ihrem Team einen klaren Mehrwert bringt.", vi: "Ba lý do chính: thứ nhất, hồ sơ Kỹ sư Quản trị Kinh doanh phù hợp; thứ hai, em đã làm 3 năm cho công ty con Đức tại VN; thứ ba — em chắc chắn năng lực cầu nối của em sẽ mang giá trị rõ ràng cho team." },
      { speaker: "Frau Becker", text: "Sie sprechen sehr gutes Deutsch. Wäre eine Umsiedlung nach Stuttgart innerhalb der nächsten drei Monate für Sie machbar?", vi: "Cô nói tiếng Đức rất tốt. Việc chuyển đến Stuttgart trong 3 tháng tới có khả thi không?" },
      { speaker: "Linh", text: "Entschuldigung, könnten Sie die Frage bitte wiederholen? Die Verbindung war gerade kurz schlecht.", vi: "Xin lỗi, chị có thể nhắc lại câu hỏi không? Đường truyền vừa kém một chút." },
      { speaker: "Frau Becker", text: "Natürlich. Wäre eine Umsiedlung nach Stuttgart innerhalb der nächsten drei Monate für Sie machbar?", vi: "Tất nhiên. Việc chuyển đến Stuttgart trong 3 tháng tới có khả thi không?" },
      { speaker: "Linh", text: "Lassen Sie mich kurz nachdenken... Ja, drei Monate sind realistisch. Mein Visum-Prozess läuft bereits, mein Mietvertrag in Vietnam ist kündbar mit zwei Monaten Frist.", vi: "Cho em suy nghĩ một chút... Vâng, ba tháng là thực tế. Quy trình visa đang chạy, hợp đồng thuê nhà ở VN có thể chấm dứt với 2 tháng báo trước." },
      { speaker: "Frau Becker", text: "Das klingt sehr durchdacht. Was ist Ihre größte Sorge bei diesem Schritt?", vi: "Nghe có chuẩn bị kỹ. Mối lo lớn nhất của cô khi làm bước này là gì?" },
      { speaker: "Linh", text: "Ehrlich gesagt — die Wohnungssuche in Stuttgart. Bietet Ihr Unternehmen Unterstützung dabei, etwa Relocation-Service oder eine Übergangswohnung?", vi: "Thật lòng — tìm nhà ở Stuttgart. Công ty có hỗ trợ kiểu Relocation Service hoặc nhà tạm trú không?" },
      { speaker: "Frau Becker", text: "Sehr gute Frage. Wir bieten ein Relocation-Paket an: Übergangswohnung für drei Monate, Bahncard 100, und Unterstützung bei Behördengängen. Details bekommen Sie schriftlich.", vi: "Câu hỏi rất hay. Chúng tôi có gói Relocation: nhà tạm 3 tháng, Bahncard 100, hỗ trợ thủ tục hành chính. Chi tiết em sẽ nhận bằng văn bản." },
      { speaker: "Linh", text: "Das beruhigt mich sehr. Ich möchte das auf den Punkt bringen: Mein Interesse ist konkret und meine Verfügbarkeit klar. Wann ist mit einer Entscheidung zu rechnen?", vi: "Em yên tâm hơn nhiều. Em muốn nói thẳng: quan tâm của em cụ thể, sẵn sàng làm rõ ràng. Khi nào có thể nhận quyết định?" },
      { speaker: "Frau Becker", text: "Spätestens in zwei Wochen. Falls die Entscheidung positiv ausfällt, würden wir Sie für ein zweites Gespräch nach Stuttgart einladen — natürlich mit Reisekostenübernahme.", vi: "Muộn nhất trong 2 tuần. Nếu quyết định tích cực, chúng tôi mời cô sang Stuttgart phỏng vấn vòng 2 — tất nhiên có chi trả chi phí đi lại." },
      { speaker: "Linh", text: "Ich danke Ihnen herzlich für das angenehme Gespräch und Ihre Geduld trotz der Verbindungsprobleme. Ich freue mich auf Ihre Rückmeldung.", vi: "Em chân thành cảm ơn chị về buổi nói chuyện dễ chịu và sự kiên nhẫn dù có vấn đề đường truyền. Em mong chờ phản hồi." },
    ],
    roleplay_prompts: [
      "Giữa cuộc phỏng vấn, đường truyền BỊ NGẮT 30 giây. Khi kết nối lại, bạn không nghe được câu hỏi cuối. Hãy lịch sự xin nhắc lại — KHÔNG giả vờ nghe được rồi đoán; đoán sai = mất điểm. Dùng 'Entschuldigung, die Verbindung war gerade unterbrochen — könnten Sie das letzte bitte wiederholen?'",
      "Người phỏng vấn hỏi 'Sind Sie bereit, jeden zweiten Sonntag eine Videokonferenz mit Asien zu machen?' — vì vai trò bridging Á-Âu. Hãy trả lời thực tế (đồng ý/từ chối/đề xuất alternative) mà không 'over-promise' chỉ để được nhận việc.",
      "Người phỏng vấn nói 'Wir hatten gehofft, jemanden aus dem deutschsprachigen Raum zu finden — Ihr Akzent macht es manchmal etwas schwierig'. Hãy phản hồi tự tin và không tự ái — nêu giải pháp (luyện thêm, dùng video để có lip-reading), nhấn mạnh khả năng cải thiện.",
    ],
    register_notes: "Phỏng vấn qua điện thoại có quy tắc riêng khác phỏng vấn trực tiếp. (1) MỞ ĐẦU CỨNG: 'Guten Tag/Abend, hier spricht [Tên] von [Công ty]. Spreche ich mit [Tên ứng viên]?'. Trả lời: 'Ja, am Apparat' (vâng, đây ạ) — formal hơn 'Ja, das bin ich'. (2) FORMAL TUYỆT ĐỐI: 'Sie' ngay từ đầu, không ngoại lệ. Khác phỏng vấn trực tiếp ở Berlin/Hamburg startup, qua điện thoại CHƯA bao giờ chuyển 'du'. (3) IM LẶNG là RỦI RO: trên điện thoại, im lặng > 3 giây bị hiểu là kết nối hỏng. Khi cần suy nghĩ, BÁO HIỆU: 'Lassen Sie mich kurz nachdenken' hoặc 'Einen Moment, bitte'. (4) KHI KHÔNG NGHE RÕ, NÓI NGAY: 'Entschuldigung, könnten Sie das wiederholen?' — không đoán mò. (5) TỐC ĐỘ NÓI CHẬM HƠN: do không có visual feedback, nói chậm hơn 20% so với in-person.\n\nVấn đề kết nối: nếu mạng kém kéo dài, đề xuất chủ động 'Wäre es möglich, in 5 Minuten erneut zu telefonieren?'. Đừng kéo dài cuộc gọi tệ — chuyển sang Plan B sớm.\n\nVăn hoá Đức ưa accent rõ và phát âm đúng hơn fluency với accent dày. Nếu accent của bạn dày, NÓI CHẬM HƠN. Tránh đặt câu phức tạp khi qua điện thoại.\n\nKhác Việt Nam: ở VN, phỏng vấn điện thoại thường ít formal; ở Đức, phỏng vấn điện thoại NGHIÊM TÚC như in-person — bạn nên ngồi thẳng, mặc smart casual (kể cả không thấy hình), và có CV trên bàn.",
    idiom_glosses: [
      { idiom: "Über den Berg sein", literal: "Đã qua khỏi ngọn núi", meaning: "Đã vượt qua phần khó nhất — vẫn còn việc nhưng đã qua đoạn nguy hiểm. Trong context phỏng vấn: 'Nach dem ersten Gespräch sind wir über den Berg' = sau vòng 1 đã vượt được giai đoạn khó nhất.", example: "Mit dem Sprachzeugnis sind wir über den Berg." },
      { idiom: "Sich bemerkbar machen", literal: "Tự làm cho mình được chú ý", meaning: "Tạo ấn tượng, để người khác nhận ra bạn. Trong context phỏng vấn từ xa: cần chủ động hơn, nói nhiều hơn để 'sich bemerkbar machen' qua điện thoại — không có body language hỗ trợ.", example: "Bei einem Telefoninterview muss man sich aktiv bemerkbar machen." },
      { idiom: "Den Faden verlieren", literal: "Mất sợi chỉ", meaning: "Quên mất mình đang nói gì, mất mạch suy nghĩ. Phổ biến khi căng thẳng phỏng vấn. Có thể admit lịch sự: 'Entschuldigung, ich habe den Faden verloren'.", example: "Vor Aufregung habe ich kurz den Faden verloren." },
      { idiom: "Etwas auf den Punkt bringen", literal: "Đưa cái gì đến điểm", meaning: "Nói thẳng vào trọng tâm, không vòng vo. Báo hiệu bạn sắp tóm tắt. Rất hữu ích khi cuộc gọi kéo dài và bạn cần kết.", example: "Lassen Sie mich das auf den Punkt bringen: ich bin sehr interessiert." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm phù hợp cho phỏng vấn điện thoại:",
        pronunciation_focus: ["phone register"],
        items: [
          { prompt: "_____ Sie mich gut? (kiểm tra âm thanh)", answer: "Hören" },
          { prompt: "Entschuldigung, könnten Sie die Frage _____? (nhắc lại)", answer: "wiederholen" },
          { prompt: "Lassen Sie mich kurz _____. (suy nghĩ)", answer: "nachdenken" },
          { prompt: "Ich möchte das auf den _____ bringen. (idiom: nói thẳng)", answer: "Punkt" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối câu Đức với chức năng giao tiếp điện thoại:",
        pronunciation_focus: [],
        items: [
          { prompt: "Hier spricht Becker.", answer: "Tự giới thiệu khi gọi" },
          { prompt: "Am Apparat.", answer: "Xác nhận 'tôi đây' formal" },
          { prompt: "Die Verbindung war kurz schlecht.", answer: "Báo cáo vấn đề kết nối" },
          { prompt: "Wann darf ich mit Rückmeldung rechnen?", answer: "Hỏi timeline phản hồi" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức công sở qua điện thoại:",
        pronunciation_focus: ["phone formal"],
        items: [
          { prompt: "Em gọi từ TP HCM — chênh lệch giờ 5 tiếng.", answer: "Ich rufe aus Hồ-Chí-Minh-Stadt an — die Zeitverschiebung beträgt fünf Stunden." },
          { prompt: "Anh/chị có thể nhắc lại câu hỏi không?", answer: "Könnten Sie die Frage bitte wiederholen?" },
          { prompt: "Cho phép em suy nghĩ một chút trước khi trả lời.", answer: "Lassen Sie mich kurz nachdenken, bevor ich antworte." },
          { prompt: "Cảm ơn về sự kiên nhẫn dù có rào cản kỹ thuật.", answer: "Vielen Dank für Ihre Geduld trotz der technischen Hürden." },
        ],
      },
    ],
  },
  {
    id: "german_b2_networking_event_messe",
    level: "B2",
    category: "fluency",
    title_vi: "Networking tại hội chợ thương mại",
    title_en: "Networking at trade fair",
    sentences: [
      { en: "Darf ich mich kurz vorstellen? Linh Nguyễn von ABC Electronics in Hồ-Chí-Minh-Stadt.", vi: "Em có thể tự giới thiệu ngắn không? Linh Nguyễn từ ABC Electronics tại TP HCM.", pronunciation_focus: ["Darf → ĐAF", "vorstellen → FOA-shtê-lần", "Electronics → ê-lệc-TRÔ-nícs"] },
      { en: "Ich bin auf der Suche nach Kooperationspartnern im Bereich Sensorik.", vi: "Em đang tìm đối tác hợp tác trong lĩnh vực sensor.", pronunciation_focus: ["Suche → ZÚ-khê", "Kooperationspartner → kô-ô-pê-ra-tsi-ônss-pat-nờ", "Sensorik → zen-ZÔ-ric"] },
      { en: "Ihr Stand auf der Hannover Messe ist beeindruckend — könnten Sie mir kurz zeigen, was es Neues gibt?", vi: "Gian hàng của anh/chị ở Hannover Messe rất ấn tượng — có thể cho em xem những gì mới không?", pronunciation_focus: ["Hannover Messe → ha-NÔ-vờ MESS-ê", "beeindruckend → bê-AIN-đruc-ent", "Neues → NOI-ès"] },
      { en: "Hätten Sie Interesse an einem ausführlicheren Gespräch — vielleicht bei einem Kaffee?", vi: "Anh/chị có muốn trò chuyện sâu hơn — có thể bên tách cà phê không?", pronunciation_focus: ["Hätten → HÉ-tần — Konjunktiv II", "ausführlicheren → AOS-fuy-lích-ê-rần", "Kaffee → KA-phê"] },
      { en: "Hier ist meine Visitenkarte — ich melde mich nächste Woche per E-Mail.", vi: "Đây là danh thiếp của em — em sẽ liên hệ qua email tuần sau.", pronunciation_focus: ["Visitenkarte → vi-zi-TÊN-kat-tê", "melde → MEN-đê", "E-Mail → Ê-MEN"] },
    ],
    cultural_notes_vi: "Hội chợ thương mại Đức (Hannover Messe, CeBIT, drupa, IFA Berlin) là 'mecca' của doanh nghiệp Đức — không chỉ là sự kiện sales mà là HỆ SINH THÁI nơi quyết định lớn được đưa ra. Sáu điểm khác Việt Nam. (1) QUY MÔ: Hannover Messe có 6.000+ exhibitors, 200.000+ visitors, kéo dài 5 ngày. Bạn KHÔNG thể đi hết — phải lập kế hoạch trước. (2) ĐĂNG KÝ TRƯỚC: hầu hết cuộc gặp quan trọng được book trước qua hệ thống của Messe. Đến không hẹn = chỉ được tiếp 5-10 phút; có hẹn = 30-60 phút. (3) GIAN HÀNG = TỔ CHỨC: mỗi gian hàng có nhân viên cho mỗi cấp (sales rep, technical, manager). Bạn nên xác định gặp ai trước. (4) DRESS CODE FORMAL: business attire (suit cho nam, blazer cho nữ). Casual = signal bạn không nghiêm túc. Giày thoải mái — bạn sẽ đi 8-10km/ngày. (5) NHỊP ĐỘ NHANH: cuộc gặp 15-20 phút là chuẩn cho first contact. Vào thẳng vấn đề. Brochures phải có sẵn (in cả Đức + Anh). (6) AFTER-WORK NETWORKING: After-Party tối là 'second meeting'. Nhiều deal lớn được khởi xướng ở quầy bar, không phải gian hàng.\n\nKhác Việt Nam: ở VN, hội chợ thường có không khí 'gặp gỡ vui vẻ', nhiều hoạt động giao lưu giải trí; ở Đức, hội chợ là CÔNG VIỆC.\n\nVisa context: nếu bạn là doanh nghiệp VN sang Đức tham dự Messe, dùng visa Schengen với invitation từ Messe organizer hoặc từ đối tác Đức.\n\nFollow-up sau Messe: 7-10 ngày sau là thời điểm vàng. Email follow-up phải tham chiếu cuộc nói chuyện cụ thể ('Bezugnehmend auf unser Gespräch am Stand 14.B.42 am Donnerstag').",
    tip_advice_vi: "Trước Messe (4 tuần): (1) Đăng ký Match-Making system của Messe nếu có. (2) Liệt kê 20-30 booths target dựa trên catalog online. (3) Gửi email trước cho 5-10 ưu tiên cao xin lịch hẹn. (4) In 200+ Visitenkarten chất lượng tốt (cả Đức + Anh). (5) Chuẩn bị 1-page brochure + USB drive với company profile. (6) Lập 30-second elevator pitch luyện thuộc.\n\nTại Messe (mỗi ngày): (1) Đến SỚM (8h, trước khi đông). (2) Mặc business formal + giày thoải mái. (3) Mang theo: Visitenkarten, brochures, notebook + bút, chai nước. (4) Note ngắn sau MỖI cuộc gặp: tên + công ty + chủ đề + next step. (5) Đừng cố đi hết — chất lượng > số lượng. (6) Tham dự After-Party.\n\nVăn hoá Visitenkarte: nhận bằng hai tay, đọc rồi mới cất. Khi cho ai danh thiếp, đưa mặt chữ hướng về họ. KHÔNG ghi chú lên danh thiếp người khác trước mặt họ. Sau Messe, cất riêng các danh thiếp gọi sẽ follow-up trong tuần.\n\nFollow-up sau Messe (7-10 ngày): (1) Email cá nhân hoá — tham chiếu cuộc nói chuyện cụ thể. (2) Đính kèm tài liệu liên quan. (3) Đề xuất next step cụ thể. (4) Subject line rõ. (5) Nếu không phản hồi sau 10 ngày, follow-up MỘT LẦN nữa.",
    vocabulary: [
      { word: "die Messe", en: "trade fair", vi: "hội chợ thương mại", pos: "noun (f)", pronunciation_vi: "đi MESS-ê" },
      { word: "der Stand", en: "exhibition booth", vi: "gian hàng", pos: "noun (m)", pronunciation_vi: "đe SHTÁNT" },
      { word: "die Visitenkarte", en: "business card", vi: "danh thiếp", pos: "noun (f)", pronunciation_vi: "đi vi-zi-TÊN-kat-tê" },
      { word: "der/die Kooperationspartner:in", en: "cooperation partner", vi: "đối tác hợp tác", pos: "noun", pronunciation_vi: "đe kô-ô-pê-ra-tsi-ônss-pat-nờ" },
      { word: "der/die Aussteller:in", en: "exhibitor", vi: "đơn vị triển lãm", pos: "noun", pronunciation_vi: "đe AOS-shtê-lờ" },
      { word: "der/die Besucher:in", en: "visitor", vi: "khách thăm", pos: "noun", pronunciation_vi: "đe bê-ZÚ-khờ" },
      { word: "den ersten Eindruck machen", en: "to make the first impression", vi: "tạo ấn tượng đầu tiên", pos: "verb phrase", pronunciation_vi: "AIN-đruc MA-khần" },
      { word: "Kontakte knüpfen", en: "to make contacts", vi: "thiết lập liên hệ", pos: "verb phrase", pronunciation_vi: "KÔN-tac-tê KNUY-pfần" },
      { word: "die Nachfassmail", en: "follow-up email", vi: "email tiếp nối", pos: "noun (f)", pronunciation_vi: "đi NÁCH-fass-mail" },
      { word: "der Smalltalk", en: "small talk", vi: "trò chuyện xã giao", pos: "noun (m)", pronunciation_vi: "đe SMOL-tok" },
    ],
    dialogue: [
      { speaker: "Linh", text: "Entschuldigung, dürfte ich Sie kurz ansprechen? Ihr Stand hat mich neugierig gemacht.", vi: "Xin lỗi, em có thể bắt chuyện với anh/chị một chút không? Gian hàng đã làm em tò mò." },
      { speaker: "Herr Klein", text: "Selbstverständlich. Worum geht es konkret?", vi: "Tất nhiên. Cụ thể về vấn đề gì?" },
      { speaker: "Linh", text: "Ich vertrete ABC Electronics aus Vietnam und suche europäische Sensorik-Lieferanten.", vi: "Em đại diện ABC Electronics từ Việt Nam và đang tìm nhà cung cấp sensor châu Âu." },
      { speaker: "Herr Klein", text: "Ah, interessant. Lassen Sie uns das Eis brechen — kommen Sie kurz an unseren Tisch.", vi: "À, thú vị. Mình phá vỡ băng đi — mời em qua bàn của chúng tôi." },
    ],
    dialogue_long: [
      { speaker: "Linh", text: "Entschuldigung, dürfte ich Sie kurz ansprechen? Ihr Stand hat mich neugierig gemacht — besonders die Demo mit den drahtlosen Sensoren.", vi: "Xin lỗi, em có thể bắt chuyện với anh không? Gian hàng đã làm em tò mò — đặc biệt là demo sensor không dây." },
      { speaker: "Herr Klein", text: "Selbstverständlich, kein Problem. Klein, von Sensortechnik Klein. Worum geht es konkret?", vi: "Tất nhiên, không vấn đề gì. Klein, từ Sensortechnik Klein. Cụ thể về vấn đề gì?" },
      { speaker: "Linh", text: "Linh Nguyễn von ABC Electronics in Hồ-Chí-Minh-Stadt. Wir produzieren Industriemaschinen und suchen deutsche Sensorik-Lieferanten für unsere nächste Generation.", vi: "Linh Nguyễn từ ABC Electronics ở TP HCM. Chúng em sản xuất máy công nghiệp và đang tìm nhà cung cấp sensor Đức cho thế hệ máy mới." },
      { speaker: "Herr Klein", text: "Aus Vietnam — spannend! Wir haben bisher kaum südostasiatische Kunden. Welches Produktspektrum interessiert Sie?", vi: "Từ Việt Nam — thú vị! Chúng tôi gần như chưa có khách Đông Nam Á. Cô quan tâm đến dòng sản phẩm nào?" },
      { speaker: "Linh", text: "Konkret die LIDAR-Sensoren für Industrieautomation. Ich sah Ihre neue X7-Serie auf der Webseite — beeindruckende Reichweite.", vi: "Cụ thể là sensor LIDAR cho tự động hoá công nghiệp. Em đã xem dòng X7 mới trên web — tầm hoạt động ấn tượng." },
      { speaker: "Herr Klein", text: "Die X7 ist tatsächlich unser Vorzeigeprodukt. Lassen Sie mich Sie schnell unserem Vertriebsleiter, Herrn Bauer, vorstellen — er kennt die Asien-Strategie.", vi: "X7 đúng là sản phẩm chủ lực. Để tôi giới thiệu nhanh với trưởng phòng Bán hàng, anh Bauer — anh ấy phụ trách chiến lược Á châu." },
      { speaker: "Herr Bauer", text: "Frau Linh, freut mich. Klein hat mir gerade Ihren Hintergrund erläutert. Wie ist Ihr Bedarfsvolumen?", vi: "Cô Linh, hân hạnh. Klein vừa nói qua về cô. Khối lượng nhu cầu của cô thế nào?" },
      { speaker: "Linh", text: "Im ersten Jahr planen wir 200-300 Einheiten der X7-Serie. Bei guter Erfahrung könnten wir auf 500-800 pro Jahr ausbauen.", vi: "Năm đầu chúng em dự kiến 200-300 đơn vị dòng X7. Nếu trải nghiệm tốt, có thể tăng lên 500-800/năm." },
      { speaker: "Herr Bauer", text: "Das ist eine relevante Größenordnung für uns. Welche Liefer- und Zahlungsbedingungen schweben Ihnen vor?", vi: "Đó là quy mô có ý nghĩa với chúng tôi. Cô hình dung điều khoản giao hàng/thanh toán thế nào?" },
      { speaker: "Linh", text: "FOB Hamburg, Zahlung 30 Tage netto nach Lieferung. Aber bei dieser ersten Begegnung möchte ich keine Verhandlung beginnen — eher die Tür für ein ausführlicheres Gespräch öffnen.", vi: "FOB Hamburg, thanh toán 30 ngày sau giao hàng. Nhưng cuộc gặp đầu này em chưa muốn vào đàm phán — hơn là mở cửa cho cuộc trò chuyện sâu hơn." },
      { speaker: "Herr Bauer", text: "Sehr klug. Hätten Sie morgen Vormittag Zeit für einen ausführlicheren Termin? Wir können einen Konferenzraum am Stand reservieren.", vi: "Khôn lắm. Sáng mai cô có thời gian gặp dài hơn không? Chúng tôi có thể đặt phòng họp ngay tại gian hàng." },
      { speaker: "Linh", text: "Sehr gerne. Wann passt es Ihnen — zwischen 9 und 11 Uhr?", vi: "Rất sẵn lòng. Anh tiện khi nào — giữa 9 và 11 giờ?" },
      { speaker: "Herr Bauer", text: "Sagen wir 10 Uhr? Dann könnten wir auch unseren Technical Director, Frau Wagner, einbeziehen.", vi: "10 giờ nhé? Như vậy chúng ta có thể có thêm Giám đốc Kỹ thuật, chị Wagner, tham gia." },
      { speaker: "Linh", text: "Hervorragend. Hier ist meine Visitenkarte — ich melde mich bis Donnerstag mit der Agenda per E-Mail.", vi: "Tuyệt vời. Đây là danh thiếp của em — em sẽ liên hệ trước thứ Năm với chương trình họp qua email." },
      { speaker: "Herr Klein", text: "Wir freuen uns auf morgen. Übrigens — gehen Sie heute Abend zur Aussteller-After-Party?", vi: "Chúng tôi mong đến sáng mai. À tiện đây — tối nay cô có đi After-Party không?" },
      { speaker: "Linh", text: "Ja, bin schon angemeldet. Vielleicht sehen wir uns dort zum lockereren Smalltalk.", vi: "Vâng, em đã đăng ký rồi. Có lẽ mình gặp nhau ở đó để smalltalk thoải mái hơn." },
      { speaker: "Herr Bauer", text: "Wunderbar — bis morgen dann. Eine Hand wäscht die andere im Geschäftsleben.", vi: "Tuyệt vời — vậy hẹn sáng mai. Trong kinh doanh, có đi có lại." },
      { speaker: "Linh", text: "Vielen Dank für die offene Aufnahme, Herr Klein, Herr Bauer. Bis morgen.", vi: "Cảm ơn anh Klein, anh Bauer đã tiếp đón cởi mở. Hẹn sáng mai." },
    ],
    roleplay_prompts: [
      "Bạn đứng cạnh stand một công ty Đức tiềm năng nhưng nhân viên đang bận tiếp khách. Hãy 'wait politely' — sau đó vào câu mở đầu thông minh trong < 30 giây để bắt sự chú ý ngay (KHÔNG quá dài, người Đức ở Messe rất tiết kiệm thời gian). Mục tiêu: đổi danh thiếp + có lịch follow-up.",
      "Một CEO Đức (60+ tuổi) đến gian hàng của bạn, hỏi 'Was ist Ihre USP gegenüber den Chinesen?'. Hãy trả lời mạnh và cụ thể trong < 60 giây — KHÔNG hạ thấp đối thủ Trung Quốc, mà nâng cao điểm khác biệt rõ của Việt Nam (chất lượng, ngôn ngữ Đức, gần Đức về văn hoá kinh doanh).",
      "Sau Messe 1 tuần, bạn gửi follow-up email cho Herr Bauer nhưng không nhận được phản hồi sau 10 ngày. Hãy viết email follow-up lần 2 — lịch sự, không trách móc, đính kèm thêm tài liệu (case study) làm 'reason to reply'. CC trợ lý của Bauer nếu biết.",
    ],
    register_notes: "Tại Messe (hội chợ thương mại như Hannover Messe, CeBIT, drupa), văn hoá giao tiếp khác phỏng vấn formal. (1) MỞ ĐẦU NHANH: 'Darf ich Sie kurz ansprechen?' — câu mở chuẩn. Sau đó tự giới thiệu trong < 30 giây: tên + công ty + ngành + mục đích. Lan man = mất khách. (2) 'SIE' VẪN LÀ CHUẨN: tại Messe vẫn 'Sie' từ đầu, kể cả không khí năng động. Chuyển 'du' chỉ khi đối tác chủ động đề nghị HOẶC tại After-Party. (3) NGÔN NGỮ HỖN HỢP: Anh + Đức là chuẩn. Nếu đối tác bắt đầu Đức → tiếp Đức; bắt đầu Anh → tiếp Anh. (4) DANH THIẾP (VISITENKARTE) là NGHI LỄ: nhận bằng hai tay, đọc trước khi cất. KHÔNG bỏ vào túi quần (thiếu tôn trọng); cất vào ví danh thiếp riêng. (5) AFTER-PARTY là EXTENSION: networking thật sự xảy ra ở After-Party tối hôm đó. Đây là nơi 'das Eis brechen' (phá băng), chuyển từ formal sang relationship.\n\nKhác Việt Nam: ở VN Vietfair/VIMEXPO, có thể chào hỏi rất xã giao; ở Đức Messe, time = money — vào thẳng vấn đề trong 30 giây. Nhưng đồng thời, không quá pushy.\n\nVăn hoá Smalltalk Đức ở Messe: an toàn = thời tiết, chuyến bay/đi lại, gian hàng. KHÔNG nói chính trị, gia đình, lương. Câu mở chuẩn: 'Wie war Ihre Anreise?', 'Sind Sie zum ersten Mal auf der Hannover Messe?'.",
    idiom_glosses: [
      { idiom: "Die Werbetrommel rühren", literal: "Đánh trống quảng cáo", meaning: "Quảng bá mạnh, marketing tích cực. Phù hợp khi nói về hoạt động marketing của công ty: 'Wir rühren die Werbetrommel für unser neues Produkt'.", example: "Auf der Messe muss man kräftig die Werbetrommel rühren." },
      { idiom: "Das Eis brechen", literal: "Phá băng", meaning: "Khởi đầu cuộc trò chuyện, vượt qua ngại ngùng ban đầu. Tại Messe và networking, đây là kỹ năng then chốt — câu chuyện vui, câu hỏi nhẹ về thời tiết hay chuyến đi.", example: "Eine gute Frage zu seinem Stand bricht das Eis sofort." },
      { idiom: "Schmieden, solange das Eisen heiß ist", literal: "Rèn khi sắt còn nóng", meaning: "Hành động ngay khi cơ hội còn — đừng đợi. Phù hợp khi nói về việc gặp khách hàng tại Messe phải follow-up nhanh sau đó.", example: "Nach dem Messekontakt schmiede ich das Eisen, solange es heiß ist." },
      { idiom: "Eine Hand wäscht die andere", literal: "Một tay rửa cho tay kia", meaning: "Có đi có lại — nguyên tắc tương trợ trong kinh doanh. Đức không có ý xấu (như VN có thể có ý 'lobby'); chỉ là biểu hiện của reciprocity bình thường.", example: "Im Geschäftsleben gilt: eine Hand wäscht die andere." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm phù hợp khi networking tại Messe:",
        pronunciation_focus: ["Konjunktiv II", "messe register"],
        items: [
          { prompt: "Darf ich mich kurz _____? (giới thiệu)", answer: "vorstellen" },
          { prompt: "Hier ist meine _____. (danh thiếp)", answer: "Visitenkarte" },
          { prompt: "Ich bin auf der _____ nach Kooperationspartnern. (đang tìm)", answer: "Suche" },
          { prompt: "Lassen Sie uns das _____ brechen. (idiom: phá băng)", answer: "Eis" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối câu Đức với chức năng giao tiếp tại Messe:",
        pronunciation_focus: [],
        items: [
          { prompt: "Darf ich Sie kurz ansprechen?", answer: "Mở câu chuyện lịch sự" },
          { prompt: "Worum geht es konkret?", answer: "Đối tác hỏi vấn đề chính" },
          { prompt: "Hätten Sie Interesse an einem Termin?", answer: "Đề nghị cuộc gặp tiếp theo" },
          { prompt: "Wir rühren die Werbetrommel.", answer: "Quảng bá mạnh (idiom)" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức công sở Messe:",
        pronunciation_focus: ["Sie + Konjunktiv II"],
        items: [
          { prompt: "Em đang tìm đối tác hợp tác trong lĩnh vực sensor.", answer: "Ich bin auf der Suche nach Kooperationspartnern im Bereich Sensorik." },
          { prompt: "Anh có muốn trò chuyện sâu hơn bên tách cà phê không?", answer: "Hätten Sie Interesse an einem ausführlicheren Gespräch bei einem Kaffee?" },
          { prompt: "Em sẽ liên hệ qua email tuần sau.", answer: "Ich melde mich nächste Woche per E-Mail." },
          { prompt: "Trong kinh doanh, có đi có lại.", answer: "Im Geschäftsleben gilt: eine Hand wäscht die andere." },
        ],
      },
    ],
  },
  {
    id: "german_b2_followup_rejected_application",
    level: "B2",
    category: "fluency",
    title_vi: "Email tiếp nối sau khi bị từ chối",
    title_en: "Follow-up email after rejection",
    sentences: [
      { en: "Vielen Dank für Ihre Absage und die offene Rückmeldung.", vi: "Cảm ơn anh/chị về thư từ chối và phản hồi cởi mở.", pronunciation_focus: ["Absage → ÁP-za-gờ", "Rückmeldung → RÚCK-men-dung", "offene → ÔF-ê-nê"] },
      { en: "Auch wenn ich enttäuscht bin, möchte ich Ihre Entscheidung respektieren.", vi: "Dù em thất vọng, em muốn tôn trọng quyết định của anh/chị.", pronunciation_focus: ["enttäuscht → ent-TOI-sht", "respektieren → res-pếch-TÍA-ần", "Entscheidung → ent-SHAI-đung"] },
      { en: "Würden Sie mir bitte konkretes Feedback geben, woran ich noch arbeiten kann?", vi: "Anh/chị có thể cho em phản hồi cụ thể về điểm em cần cải thiện không?", pronunciation_focus: ["Würden → VUY-đần — Konjunktiv II", "konkretes → kôn-KRÊ-tès", "arbeiten → AR-bai-tần"] },
      { en: "Sollte sich künftig eine passende Stelle ergeben, würde ich mich erneut bewerben.", vi: "Nếu sau này có vị trí phù hợp, em xin được ứng tuyển lại.", pronunciation_focus: ["künftig → KUYN-ftích", "ergeben → e-GÊ-bần", "erneut → e-NOI-t"] },
      { en: "Aus Schaden wird man klug — ich nehme die Erfahrung als Lernchance mit.", vi: "Trong cái rủi có cái khôn — em xem trải nghiệm này là cơ hội học hỏi.", pronunciation_focus: ["Schaden → SHA-đần", "klug → KLÚK", "Erfahrung → e-FA-rung"] },
    ],
    cultural_notes_vi: "Văn hoá thư từ chối ở Đức khác Việt Nam ở năm điểm. (1) ABSAGE LÀ CHUẨN: công ty Đức gửi thư từ chối CHÍNH THỨC cho hầu hết ứng viên (kể cả vòng 1) — không 'silent rejection' như nhiều công ty Mỹ. Đây là dấu hiệu chuyên nghiệp; bạn nên cảm ơn vì điều này. (2) FEEDBACK CÓ THỂ XIN: ngược với Mỹ (sợ kiện) hoặc Anh (formal phong cách), recruiter Đức THƯỜNG cho feedback nếu được hỏi lịch sự. Đây là cơ hội học hỏi quý giá — đừng bỏ qua. (3) TALENT-POOL THỰC: nhiều công ty Đức (đặc biệt Bosch, Siemens, BMW) có Talent-Pool thực sự — họ liên hệ lại candidate cũ khi vị trí mới mở. (4) ÁCQUYỀN VỚI BƯỚC TRƯỚC: Đức coi cuộc tuyển dụng là CHUỖI dài. Bị từ chối không phải kết thúc; có thể là vòng đầu của mối quan hệ 5-10 năm với công ty. (5) KHÔNG QUÁ NHIỀU FOLLOW-UP: 1-2 emails sau rejection là OK; 5+ = quấy rối.\n\nKhác Việt Nam: ở VN, từ chối thường im lặng hoặc verbal qua điện thoại; ở Đức, formal qua email. Bạn có 'paper trail' để follow-up — tận dụng nó.\n\nỞ công ty Đức tại VN (Bosch HCMC, Siemens Hanoi), văn hoá Đức được áp dụng — họ gửi Absage email và sẵn sàng feedback. Nếu bạn bị từ chối ở Bosch HCMC, follow-up chuyên nghiệp có thể dẫn đến Bosch Munich hoặc Bosch Stuttgart sau này — họ cùng hệ thống Talent-Pool.\n\nMẹo cuối: trong email follow-up, KHÔNG nói chuyện cá nhân ('Tôi đang khó khăn tài chính', 'Gia đình đặt nhiều kỳ vọng') — recruiter không quan tâm và bị coi là không chuyên nghiệp.",
    tip_advice_vi: "Cấu trúc email follow-up sau rejection (5-7 dòng tổng): (1) Subject: 'Ihre Absage vom [ngày] — Bewerbung [Tên vị trí]'. (2) Mở: 'Sehr geehrte Frau X'. (3) Đoạn 1 (1 câu): cảm ơn về thư từ chối + phản hồi cởi mở. (4) Đoạn 2 (1 câu): tôn trọng quyết định, không tranh luận. (5) Đoạn 3 (2 câu): xin feedback cụ thể về điểm cần cải thiện. (6) Đoạn 4 (1 câu): mở cửa cho tương lai. (7) Kết: 'Mit freundlichen Grüßen, [Tên]'.\n\nNội dung email cần TRÁNH: (1) Xin lỗi vì đã làm phiền. (2) Tranh luận về quyết định. (3) Yêu cầu cuộc gặp explain. (4) Câu chuyện cá nhân/cảm xúc. (5) Multiple emails dồn dập.\n\nThời điểm: gửi 24-48h sau khi nhận Absage. Nếu không có phản hồi sau 7-10 ngày, KHÔNG follow-up tiếp; recruiter có thể đang bận hoặc không có policy cho feedback.\n\nNếu có phản hồi feedback: (1) Cảm ơn ngắn (3 dòng). (2) Hỏi 1 câu chiến lược: có Talent-Pool không, có vị trí khác phù hợp hơn không, khi nào có thể ứng tuyển lại. (3) Đề xuất kết nối LinkedIn.\n\n6 tháng sau: nếu thấy công ty mở vị trí mới phù hợp, viết email TÁI KÊT NỐI — tham chiếu cuộc trao đổi cũ, update progress, xin ứng tuyển.",
    vocabulary: [
      { word: "die Absage", en: "rejection (letter/decision)", vi: "thư từ chối", pos: "noun (f)", pronunciation_vi: "đi ÁP-za-gờ" },
      { word: "die Rückmeldung", en: "feedback, response", vi: "phản hồi", pos: "noun (f)", pronunciation_vi: "đi RÚCK-men-dung" },
      { word: "enttäuscht sein", en: "to be disappointed", vi: "thất vọng", pos: "verb phrase", pronunciation_vi: "ent-TOI-sht zain" },
      { word: "respektieren", en: "to respect", vi: "tôn trọng", pos: "verb", pronunciation_vi: "res-pếch-TÍA-ần" },
      { word: "konkretes Feedback", en: "concrete feedback", vi: "phản hồi cụ thể", pos: "noun phrase", pronunciation_vi: "kôn-KRÊ-tès FÍT-bếc" },
      { word: "an etwas arbeiten", en: "to work on something", vi: "cải thiện điều gì", pos: "verb phrase", pronunciation_vi: "AR-bai-tần" },
      { word: "sich erneut bewerben", en: "to apply again", vi: "ứng tuyển lại", pos: "verb (refl)", pronunciation_vi: "zịch e-NOI-t bê-VEA-bần" },
      { word: "die Lernchance", en: "learning opportunity", vi: "cơ hội học hỏi", pos: "noun (f)", pronunciation_vi: "đi LE-shăn-sê" },
      { word: "der Eindruck nachhaltig sein", en: "to leave a lasting impression", vi: "tạo ấn tượng bền lâu", pos: "verb phrase", pronunciation_vi: "AIN-đruc NÁCH-hal-tích" },
      { word: "den Kopf hängen lassen", en: "to lose heart, hang one's head", vi: "nản chí (idiom)", pos: "verb phrase", pronunciation_vi: "đần KÔP HENG-ần LA-sần" },
    ],
    dialogue: [
      { speaker: "Linh (email)", text: "Sehr geehrte Frau Bauer, vielen Dank für Ihre Absage. Würden Sie mir bitte kurz erläutern, woran meine Bewerbung gescheitert ist?", vi: "Kính gửi chị Bauer, cảm ơn về thư từ chối. Chị có thể nói qua vì sao đơn của em không thành công không?" },
      { speaker: "Frau Bauer", text: "Ihre Qualifikation war exzellent, aber wir haben uns für einen Bewerber mit drei Jahren mehr Branchenerfahrung entschieden.", vi: "Trình độ của em xuất sắc, nhưng chúng tôi chọn ứng viên có thêm 3 năm kinh nghiệm ngành." },
      { speaker: "Linh (email)", text: "Vielen Dank für die ehrliche Antwort. Sollte sich künftig eine andere Stelle ergeben, würde ich mich freuen, erneut Kontakt aufzunehmen.", vi: "Cảm ơn câu trả lời thành thật. Nếu sau này có vị trí khác, em rất vui được liên hệ lại." },
      { speaker: "Frau Bauer", text: "Bleiben Sie gerne in unserem Talent-Pool — ich vermerke das in Ihrem Profil.", vi: "Em cứ ở trong Talent-Pool của chúng tôi — tôi ghi chú vào hồ sơ của em." },
    ],
    dialogue_long: [
      { speaker: "Linh (email)", text: "Sehr geehrte Frau Bauer, vielen Dank für Ihre E-Mail vom 15. März und die Mitteilung Ihrer Entscheidung.", vi: "Kính gửi chị Bauer, cảm ơn email ngày 15/3 và thông báo quyết định của chị." },
      { speaker: "Linh (email)", text: "Auch wenn ich enttäuscht bin, möchte ich Ihre Entscheidung respektieren und mich für den professionellen Bewerbungsprozess bedanken.", vi: "Dù em thất vọng, em muốn tôn trọng quyết định và cảm ơn về quy trình tuyển dụng chuyên nghiệp." },
      { speaker: "Linh (email)", text: "Würden Sie mir bitte konkretes Feedback geben, woran ich für künftige Bewerbungen noch arbeiten kann?", vi: "Chị có thể cho em phản hồi cụ thể về điểm em cần cải thiện cho các đơn ứng tuyển tương lai không?" },
      { speaker: "Linh (email)", text: "Sollte sich künftig eine passende Stelle in Ihrem Hause ergeben, würde ich mich sehr freuen, mich erneut bewerben zu dürfen. Mit freundlichen Grüßen, Linh Nguyễn", vi: "Nếu sau này có vị trí phù hợp tại quý công ty, em rất vui được phép ứng tuyển lại. Trân trọng, Linh Nguyễn" },
      { speaker: "Frau Bauer", text: "Sehr geehrte Frau Linh, vielen Dank für Ihre nachträgliche Anfrage und Ihre konstruktive Reaktion auf unsere Absage.", vi: "Kính gửi cô Linh, cảm ơn câu hỏi sau và phản hồi xây dựng của cô về thư từ chối." },
      { speaker: "Frau Bauer", text: "Ihre Qualifikation war fachlich exzellent — Sie standen auf der Shortlist mit zwei anderen Kandidaten.", vi: "Trình độ chuyên môn của cô xuất sắc — cô đã vào shortlist cùng 2 ứng viên khác." },
      { speaker: "Frau Bauer", text: "Letztlich haben wir uns für einen Bewerber entschieden, der bereits drei Jahre Erfahrung in der spezifischen Branche (Pharmazie) mitbringt.", vi: "Cuối cùng chúng tôi chọn ứng viên đã có 3 năm kinh nghiệm trong ngành cụ thể (dược phẩm)." },
      { speaker: "Frau Bauer", text: "Mein Tipp für künftige Bewerbungen: Heben Sie Branchenerfahrung — auch in Praktika oder Werkstudententätigkeiten — deutlicher hervor.", vi: "Lời khuyên cho ứng tuyển tương lai: nhấn mạnh kinh nghiệm ngành — kể cả trong thực tập hay vị trí Werkstudent — rõ ràng hơn." },
      { speaker: "Linh (email)", text: "Vielen Dank, Frau Bauer, für die ausführliche Rückmeldung. Das hilft mir wirklich weiter.", vi: "Cảm ơn chị Bauer về phản hồi chi tiết. Điều này thực sự giúp em tiến bộ." },
      { speaker: "Linh (email)", text: "Darf ich fragen — gibt es bei Ihnen Praktika oder Werkstudentenstellen, die mir genau diese Branchenerfahrung verschaffen könnten?", vi: "Em có thể hỏi — bên anh có vị trí thực tập hay Werkstudent nào có thể cho em đúng kinh nghiệm ngành đó không?" },
      { speaker: "Frau Bauer", text: "Eine sehr kluge Frage. Aktuell suchen wir keinen Praktikanten, aber im Herbst wird voraussichtlich eine Werkstudentenstelle frei.", vi: "Câu hỏi rất khôn. Hiện chúng tôi không tìm thực tập sinh, nhưng mùa thu sẽ có vị trí Werkstudent trống." },
      { speaker: "Frau Bauer", text: "Ich vermerke Sie in unserem Talent-Pool und melde mich aktiv, sobald die Stelle ausgeschrieben wird.", vi: "Tôi ghi chú cô vào Talent-Pool và sẽ chủ động liên hệ ngay khi vị trí được mở." },
      { speaker: "Linh (email)", text: "Das wäre wunderbar. Vielen Dank für diese Chance — ich werde sie mit Sicherheit nutzen.", vi: "Điều đó tuyệt vời. Cảm ơn cơ hội này — em chắc chắn sẽ tận dụng." },
      { speaker: "Linh (email)", text: "Darf ich Sie zudem auf LinkedIn vernetzen, um auf dem Laufenden zu bleiben?", vi: "Em có thể kết nối LinkedIn với chị để cập nhật không?" },
      { speaker: "Frau Bauer", text: "Sehr gerne. Mein Profil finden Sie unter Susanne Bauer / Pharma-Recruiter.", vi: "Rất sẵn lòng. Hồ sơ của tôi: Susanne Bauer / Pharma-Recruiter." },
      { speaker: "Linh (email)", text: "Perfekt. Aus Schaden wird man klug — ich nehme diese Erfahrung als wertvolle Lernchance mit. Vielen Dank für Ihre Zeit und Ehrlichkeit.", vi: "Hoàn hảo. Trong cái rủi có cái khôn — em xem trải nghiệm này là cơ hội học hỏi quý giá. Cảm ơn chị về thời gian và sự thẳng thắn." },
      { speaker: "Frau Bauer", text: "Lassen Sie sich nicht entmutigen — Bewerber wie Sie, die professionell mit Absagen umgehen, fallen uns positiv auf. Bis bald, hoffentlich.", vi: "Đừng nản chí — ứng viên như cô, xử lý thư từ chối chuyên nghiệp, gây ấn tượng tốt. Hẹn sớm gặp lại." },
      { speaker: "Linh (email)", text: "Mit den besten Grüßen, Linh Nguyễn", vi: "Trân trọng, Linh Nguyễn" },
    ],
    roleplay_prompts: [
      "Bạn nhận thư từ chối chỉ với 2 dòng generic ('Wir haben uns für einen anderen Kandidaten entschieden'). Hãy viết email phản hồi hỏi feedback cụ thể — KHÔNG van xin, KHÔNG trách móc, mà thể hiện sự chuyên nghiệp giúp họ THÍCH bạn ngay cả sau khi từ chối. Mục tiêu: được vào Talent-Pool cho lần sau.",
      "Recruiter trả lời feedback request của bạn rất thật: 'Ihr Deutsch war für die Position nicht ausreichend'. Hãy phản hồi: cảm ơn sự thẳng thắn, đề xuất kế hoạch cải thiện cụ thể (Sprachzertifikat trong 6 tháng), xin được ứng tuyển lại sau khi đạt mục tiêu.",
      "6 tháng sau bị từ chối, bạn thấy công ty đó mở vị trí mới phù hợp hơn. Hãy viết email tới recruiter cũ — tham chiếu cuộc trao đổi trước, cập nhật những gì bạn đã cải thiện trong 6 tháng, và xin ứng tuyển lại. Tone: quan hệ đã có, không phải cold outreach.",
    ],
    register_notes: "Email follow-up sau rejection có quy tắc tế nhị riêng — sai tone = không bao giờ được call back. (1) FORMAL TUYỆT ĐỐI: 'Sehr geehrte Frau Bauer' luôn, kể cả khi đã có cuộc nói chuyện thân thiện trong phỏng vấn. Sau rejection, formality LẠI tăng — không phải giảm. (2) KHÔNG XIN LỖI VÌ HỎI: 'Es tut mir leid, dass ich Sie störe' bị coi là yếu thế. Tone đúng: câu hỏi thẳng thắn, lịch sự, không van xin. (3) KHÔNG TRÁCH MÓC: 'Ich verstehe nicht, warum...' bị coi là attack. Thay bằng 'Würden Sie mir konkretes Feedback geben?'. (4) KONJUNKTIV II 100%: 'Würden Sie...?', 'Sollte sich ergeben...', 'Es wäre mir wichtig...'. (5) KẾT BẰNG MỞ CỬA: 'Ich würde mich freuen, in Zukunft erneut von Ihnen zu hören' — báo hiệu bạn xem rejection này là tạm thời.\n\nKhác Việt Nam: ở VN, sau khi bị từ chối, ít người follow-up; ở Đức, follow-up CHUYÊN NGHIỆP là expected — recruiter Đức sẽ note ai làm điều này và prioritize cho lần sau.\n\nNgười Việt thường mắc lỗi: (1) SILENT — không phản hồi gì sau rejection; (2) email quá dài — recruiter chỉ skim; (3) yêu cầu 'cuộc gặp giải thích' — recruiter không có thời gian.",
    idiom_glosses: [
      { idiom: "Aus Schaden wird man klug", literal: "Từ tổn thất ta trở nên khôn", meaning: "Trong cái rủi có cái khôn — học từ thất bại. Câu thành ngữ phổ biến để biểu hiện thái độ tích cực sau rejection.", example: "Aus Schaden wird man klug — ich nehme diese Absage als Lernchance." },
      { idiom: "Den Kopf hängen lassen", literal: "Để đầu rủ xuống", meaning: "Nản chí, mất tinh thần. Phù hợp cho recruiter để khích lệ. Bạn KHÔNG nên dùng câu này về bản thân — bị coi là yếu thế.", example: "Lassen Sie nicht den Kopf hängen — bei Ihrem Profil kommt die nächste Chance schnell." },
      { idiom: "Tür und Tor öffnen", literal: "Mở cửa và cổng", meaning: "Mở rộng cơ hội — tạo điều kiện thuận lợi cho điều gì xảy ra. Phù hợp khi muốn mô tả việc rejection chuyên nghiệp 'mở cửa' cho cơ hội tương lai.", example: "Eine konstruktive Antwort auf eine Absage öffnet Tür und Tor für künftige Chancen." },
      { idiom: "Es nochmal versuchen", literal: "Thử lại lần nữa", meaning: "Quay lại thử thêm — không bỏ cuộc. Sử dụng khi xin được ứng tuyển lại sau improvement.", example: "Nach sechs Monaten Verbesserung möchte ich es nochmal bei Ihnen versuchen." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm phù hợp cho email follow-up rejection:",
        pronunciation_focus: ["Konjunktiv II", "formal email"],
        items: [
          { prompt: "Vielen Dank für Ihre _____ und die offene Rückmeldung. (thư từ chối)", answer: "Absage" },
          { prompt: "_____ Sie mir bitte konkretes Feedback geben? (Konjunktiv II)", answer: "Würden" },
          { prompt: "_____ sich künftig eine Stelle ergeben, würde ich mich erneut bewerben. (Konjunktiv II — nếu)", answer: "Sollte" },
          { prompt: "Aus Schaden wird man _____. (idiom: khôn)", answer: "klug" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối câu Đức với chức năng email follow-up:",
        pronunciation_focus: [],
        items: [
          { prompt: "Ich respektiere Ihre Entscheidung.", answer: "Tôn trọng quyết định, không tranh luận" },
          { prompt: "Würden Sie mir konkretes Feedback geben?", answer: "Xin feedback lịch sự" },
          { prompt: "Ich würde mich freuen, erneut von Ihnen zu hören.", answer: "Mở cửa cho tương lai" },
          { prompt: "Lassen Sie nicht den Kopf hängen.", answer: "Recruiter khích lệ (idiom)" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức formal:",
        pronunciation_focus: ["Konjunktiv II"],
        items: [
          { prompt: "Cảm ơn về thư từ chối và phản hồi cởi mở.", answer: "Vielen Dank für Ihre Absage und die offene Rückmeldung." },
          { prompt: "Em xem trải nghiệm này là cơ hội học hỏi.", answer: "Ich nehme diese Erfahrung als Lernchance mit." },
          { prompt: "Nếu sau này có vị trí phù hợp, em xin ứng tuyển lại.", answer: "Sollte sich künftig eine passende Stelle ergeben, würde ich mich erneut bewerben." },
          { prompt: "Em có thể kết nối LinkedIn với chị không?", answer: "Darf ich Sie auf LinkedIn vernetzen?" },
        ],
      },
    ],
  },
  {
    id: "german_b2_letter_of_recommendation",
    level: "B2",
    category: "fluency",
    title_vi: "Xin GS viết thư giới thiệu",
    title_en: "Asking professor for letter of recommendation",
    sentences: [
      { en: "Sehr geehrter Herr Professor Müller, ich wende mich mit einer persönlichen Bitte an Sie.", vi: "Kính gửi Giáo sư Müller, em viết với một yêu cầu cá nhân.", pronunciation_focus: ["wende mich → VEN-đê mích", "persönlichen → pe-ZƠN-lích-ần", "Bitte → BÍT-tê"] },
      { en: "Ich bewerbe mich um ein Master-Stipendium an der ETH Zürich.", vi: "Em đang ứng tuyển học bổng Thạc sĩ tại ETH Zürich.", pronunciation_focus: ["bewerbe → bê-VEA-bê", "Stipendium → shti-PEN-đi-um", "Zürich → TSUY-rích"] },
      { en: "Würden Sie mir freundlicherweise ein Empfehlungsschreiben ausstellen?", vi: "Thầy có thể vui lòng viết cho em một thư giới thiệu không?", pronunciation_focus: ["freundlicherweise → FROIND-lích-ờ-vai-zê", "Empfehlungsschreiben → ent-FÊ-lungs-shrai-bần", "ausstellen → AOS-shtê-lần"] },
      { en: "Ich stelle Ihnen gerne meinen Lebenslauf, das Motivationsschreiben und die Bewerbungsfristen zur Verfügung.", vi: "Em xin gửi cho thầy CV, thư động lực và deadline ứng tuyển.", pronunciation_focus: ["Lebenslauf → LÊ-bệns-laof", "Motivationsschreiben → mô-ti-va-tsi-ônss-shrai-bần", "Bewerbungsfristen → bê-VEA-bungs-frís-tần"] },
      { en: "Ein gutes Wort von Ihnen würde meine Chancen erheblich verbessern.", vi: "Một lời tốt từ thầy sẽ cải thiện đáng kể cơ hội của em.", pronunciation_focus: ["gutes Wort → GÚ-tès VOT", "Chancen → SHĂN-sần", "erheblich → e-HÊP-lích"] },
    ],
    cultural_notes_vi: "Empfehlungsschreiben (thư giới thiệu) ở Đức KHÁC HẲN ở Mỹ và VN ở năm điểm cốt lõi. (1) GS LÀ AUTHOR, KHÔNG PHẢI SIGNER: ở Mỹ, học sinh thường draft thư rồi xin GS sửa và ký; ở Đức TUYỆT ĐỐI KHÔNG — GS tự viết toàn bộ. Đề xuất 'em viết draft thầy chỉnh' = sai phạm học thuật, GS có thể từ chối. (2) MỐI QUAN HỆ THỰC: GS chỉ viết thư cho sinh viên họ ĐÃ LÀM VIỆC trực tiếp (Seminar, Hausarbeit, Praktikum, Abschlussarbeit). Xin từ GS chỉ giảng course đại trà = thư rất generic, có thể hại hơn lợi. (3) HỆ THỐNG ĐÁNH GIÁ MẬT: GS Đức có 'mật mã' trong thư recommendation — 'sehr gut' = trung bình, 'außergewöhnlich' = thực sự xuất sắc, 'überdurchschnittlich' = trên TB. Bạn không bao giờ thấy thư (academic confidentiality), nên phụ thuộc hoàn toàn vào quan hệ. (4) LEAD TIME 4-6 TUẦN: GS Đức expect 4-6 tuần lead time. Xin trong 1-2 tuần = bị coi là không tôn trọng thời gian. (5) CONFIDENTIAL: Empfehlungsschreiben gửi TRỰC TIẾP từ GS đến đại học/học bổng (qua email hoặc post). Bạn KHÔNG đọc thư.\n\nKhác VN: ở VN, có thể xin thư trong vài ngày, GS có thể nhờ assistant viết hộ, sinh viên đôi khi tự draft; ở Đức, mỗi yếu tố này là sai phạm. Plan-ahead culture là then chốt.\n\nỞ công ty Đức tại VN, Empfehlungsschreiben (Arbeitszeugnis từ Praktikum/Werkstudent) cũng theo chuẩn Đức — formal, có 'mật mã' đánh giá, không thể negotiate nội dung.\n\nMột chi tiết quan trọng: nếu GS từ chối với lý do 'Ich kenne Sie nicht gut genug', đó là DẤU HIỆU TÔN TRỌNG — họ thà từ chối hơn viết thư yếu. CHẤP NHẬN, cảm ơn, và xin GS khác — đừng tranh luận.",
    tip_advice_vi: "Trước khi xin (3-6 tháng): (1) Build mối quan hệ với 2-3 GS — qua Sprechstunde regular, Seminararbeit chất lượng cao, Hilfskraft (trợ lý), đề tài Bachelor/Masterarbeit. (2) Lập danh sách 5-7 GS có thể xin (rank theo độ thân thiện). (3) Update CV + Motivationsschreiben luôn sẵn sàng để gửi.\n\nKhi xin (4-6 tuần trước deadline): (1) Email chính thức HOẶC Sprechstunde — ưu tiên Sprechstunde nếu GS dễ tiếp cận. (2) Mở 'Sehr geehrter Herr Professor Müller, ich wende mich mit einer persönlichen Bitte'. (3) Giải thích context: chương trình gì, vì sao phù hợp với bạn, vì sao chọn GS này. (4) Yêu cầu cụ thể: loại thư (academic vs professional), deadline, ngôn ngữ (Đức vs Anh), submission method. (5) Đề xuất giúp GS: 'Ich stelle Ihnen Lebenslauf, Motivationsschreiben, Notenübersicht und ein kurzes Memo zur Verfügung'.\n\nMemo cho GS (3-5 gạch đầu dòng, 1 trang max): (1) Project/seminar bạn đã làm với GS. (2) 2-3 thành tích cụ thể. (3) Soft skills GS có thể xác nhận. (4) Vì sao chương trình mới này phù hợp. (5) Deadline + submission method.\n\nFollow-up: (1) Nếu GS đồng ý, gửi tài liệu trong 3-5 ngày. (2) 1 tuần trước deadline GS hứa, polite reminder qua email. (3) Sau khi GS gửi thư, gửi email cảm ơn ngắn (3-4 dòng).\n\nNếu GS từ chối: (1) CHẤP NHẬN không tranh luận. (2) Cảm ơn về sự thẳng thắn. (3) Xin gợi ý GS khác hoặc cách build relationship lần sau. (4) GIỮ KÊT NỐI cho future opportunities.",
    vocabulary: [
      { word: "das Empfehlungsschreiben", en: "letter of recommendation", vi: "thư giới thiệu", pos: "noun (n)", pronunciation_vi: "đát ent-FÊ-lungs-shrai-bần" },
      { word: "der/die Gutachter:in", en: "evaluator, referee", vi: "người đánh giá/giới thiệu", pos: "noun", pronunciation_vi: "đe GÚT-ách-tờ" },
      { word: "das Motivationsschreiben", en: "letter of motivation", vi: "thư động lực", pos: "noun (n)", pronunciation_vi: "đát mô-ti-va-tsi-ônss-shrai-bần" },
      { word: "der Lebenslauf", en: "CV, résumé", vi: "sơ yếu lý lịch", pos: "noun (m)", pronunciation_vi: "đe LÊ-bệns-laof" },
      { word: "die Bewerbungsfrist", en: "application deadline", vi: "hạn nộp đơn", pos: "noun (f)", pronunciation_vi: "đi bê-VEA-bungs-frís-t" },
      { word: "ausstellen (ein Schreiben)", en: "to issue (a letter)", vi: "viết/cấp (thư)", pos: "verb (sep)", pronunciation_vi: "AOS-shtê-lần" },
      { word: "die Frist einhalten", en: "to meet a deadline", vi: "giữ đúng hạn", pos: "verb phrase", pronunciation_vi: "FRÍS-t AIN-hal-tần" },
      { word: "freundlicherweise", en: "kindly, please (formal)", vi: "vui lòng (formal)", pos: "adverb", pronunciation_vi: "FROIND-lích-ờ-vai-zê" },
      { word: "die Chancen erheblich verbessern", en: "to significantly improve chances", vi: "cải thiện đáng kể cơ hội", pos: "verb phrase", pronunciation_vi: "SHĂN-sần fe-BÉ-sần" },
      { word: "die Vorlaufzeit", en: "lead time, advance notice", vi: "thời gian báo trước", pos: "noun (f)", pronunciation_vi: "đi FOA-laof-tsait" },
    ],
    dialogue: [
      { speaker: "Linh", text: "Sehr geehrter Herr Professor, hätten Sie kurz Zeit für mich? Es geht um eine persönliche Bitte.", vi: "Kính gửi Giáo sư, thầy có chút thời gian cho em không? Là một yêu cầu cá nhân." },
      { speaker: "Prof. Müller", text: "Selbstverständlich, Frau Linh. Worum geht es?", vi: "Tất nhiên, em Linh. Về vấn đề gì?" },
      { speaker: "Linh", text: "Ich bewerbe mich um ein Stipendium an der ETH Zürich und würde Sie gerne als Gutachter angeben.", vi: "Em đang ứng tuyển học bổng tại ETH Zürich và muốn xin thầy làm người giới thiệu." },
      { speaker: "Prof. Müller", text: "Sehr gerne. Schicken Sie mir Ihren Lebenslauf und die Frist — dann lege ich gerne ein gutes Wort für Sie ein.", vi: "Rất sẵn lòng. Gửi tôi CV và deadline — tôi sẽ vui lòng viết lời tốt cho em." },
    ],
    dialogue_long: [
      { speaker: "Linh", text: "Sehr geehrter Herr Professor Müller, vielen Dank, dass Sie sich Zeit nehmen.", vi: "Kính gửi Giáo sư Müller, cảm ơn thầy đã dành thời gian." },
      { speaker: "Prof. Müller", text: "Gerne, Frau Linh. Setzen Sie sich. Worum geht es?", vi: "Hân hạnh, em Linh. Mời ngồi. Về vấn đề gì?" },
      { speaker: "Linh", text: "Ich wende mich heute mit einer persönlichen Bitte an Sie. Ich bewerbe mich um ein Master-Stipendium an der ETH Zürich.", vi: "Em viết hôm nay với một yêu cầu cá nhân. Em đang ứng tuyển học bổng Thạc sĩ tại ETH Zürich." },
      { speaker: "Prof. Müller", text: "Glückwunsch zu der Initiative — die ETH ist erstklassig. Wofür brauchen Sie meine Unterstützung?", vi: "Chúc mừng sáng kiến — ETH là hàng đầu. Em cần thầy hỗ trợ gì?" },
      { speaker: "Linh", text: "Würden Sie mir freundlicherweise ein Empfehlungsschreiben ausstellen? Ihre Stimme als Lehrstuhlinhaber im Bereich Maschinenbau hätte besonderes Gewicht.", vi: "Thầy có thể vui lòng viết cho em một thư giới thiệu không? Tiếng nói của thầy với tư cách chủ nhiệm bộ môn Cơ khí sẽ có trọng lượng đặc biệt." },
      { speaker: "Prof. Müller", text: "Sehr gerne. Wann ist die Frist?", vi: "Rất sẵn lòng. Hạn nộp khi nào?" },
      { speaker: "Linh", text: "Die Bewerbungsfrist endet am 15. Mai. Eine Vorlaufzeit von vier Wochen wäre ideal — also möglichst bis Ende April.", vi: "Hạn nộp ngày 15/5. Thời gian báo trước 4 tuần sẽ lý tưởng — nghĩa là muộn nhất cuối tháng Tư." },
      { speaker: "Prof. Müller", text: "Ende April ist machbar. Was sollte das Schreiben konkret hervorheben?", vi: "Cuối tháng Tư khả thi. Thư cần nhấn mạnh điều gì cụ thể?" },
      { speaker: "Linh", text: "Drei Punkte: meine Forschung zu additiver Fertigung, meine Eigeninitiative bei der Konferenzteilnahme in Aachen, und meine Eignung für die internationale Forschungsumgebung der ETH.", vi: "Ba điểm: nghiên cứu sản xuất bồi đắp, sáng kiến của em khi tham dự hội nghị ở Aachen, và sự phù hợp với môi trường nghiên cứu quốc tế của ETH." },
      { speaker: "Prof. Müller", text: "Ich werde Sie in den höchsten Tönen loben — Sie haben es verdient. Ich bin auf einer Forschungsreise vom 20.-25. April; geht das auch?", vi: "Tôi sẽ khen em hết lời — em xứng đáng. Tôi có chuyến công tác 20-25/4; như vậy được không?" },
      { speaker: "Linh", text: "Absolut. Ich kann Ihnen alle Unterlagen — Lebenslauf, Motivationsschreiben, Notenübersicht und das ETH-Formular — bis spätestens 5. April per E-Mail zukommen lassen.", vi: "Hoàn toàn. Em có thể gửi tất cả hồ sơ — CV, thư động lực, bảng điểm và mẫu của ETH — qua email muộn nhất ngày 5/4." },
      { speaker: "Prof. Müller", text: "Perfekt. Bitte fügen Sie auch ein kurzes Memo bei: drei bis fünf Stichpunkte zu meinen Beobachtungen aus Ihrem Projekt — als Gedächtnisstütze.", vi: "Hoàn hảo. Em cũng nhớ đính kèm một memo ngắn: 3-5 gạch đầu dòng về quan sát của tôi từ dự án em — như nhắc nhở trí nhớ." },
      { speaker: "Linh", text: "Selbstverständlich. Soll ich das Memo in Deutsch oder Englisch schreiben?", vi: "Tất nhiên. Em viết memo bằng tiếng Đức hay tiếng Anh?" },
      { speaker: "Prof. Müller", text: "Englisch wäre praktischer, da das Schreiben sowieso auf Englisch sein wird — die ETH bevorzugt Englisch für internationale Bewerbungen.", vi: "Tiếng Anh tiện hơn, vì thư cũng sẽ bằng tiếng Anh — ETH ưu tiên tiếng Anh cho ứng tuyển quốc tế." },
      { speaker: "Linh", text: "Verstanden. Vielen Dank, Herr Professor — Sie helfen mir wirklich weiter. Auf Augenhöhe wie immer.", vi: "Em hiểu rồi. Cảm ơn thầy — thầy thực sự giúp em tiến bộ. Đối xử ngang hàng như mọi khi." },
      { speaker: "Prof. Müller", text: "Aber gerne. Sie können sich auf mich verlassen — ich melde mich, falls ich Rückfragen habe.", vi: "Nhưng hân hạnh. Em có thể tin tưởng tôi — tôi sẽ liên hệ nếu có câu hỏi." },
      { speaker: "Linh", text: "Ich melde mich Anfang April mit allen Unterlagen. Vielen Dank für Ihre Unterstützung und Ihr Vertrauen.", vi: "Em sẽ liên hệ đầu tháng Tư với tất cả hồ sơ. Cảm ơn thầy về sự hỗ trợ và tin tưởng." },
      { speaker: "Prof. Müller", text: "Daumen drücke ich Ihnen für die ETH-Bewerbung. Bis bald.", vi: "Chúc em ứng tuyển ETH thành công. Hẹn sớm gặp lại." },
    ],
    roleplay_prompts: [
      "Bạn cần xin Empfehlungsschreiben TRONG 1 TUẦN (không có 4 tuần lead time tiêu chuẩn) vì học bổng có deadline gần. Hãy viết email cho GS — thừa nhận time crunch, đưa ra lý do chính đáng (deadline mới được công bố), đề xuất giải pháp giúp GS dễ nhất (memo đầy đủ, mẫu draft sẵn). KHÔNG xin lỗi quá mức nhưng cũng không demand.",
      "GS đồng ý nhưng sau 3 tuần CHƯA viết. Deadline còn 5 ngày. Hãy viết email follow-up lịch sự — không trách móc, đưa ra reminder, có thể đề xuất 'chỉ vài câu cũng đủ' nếu thầy bận, hoặc xin được 'điền sẵn template để thầy review'.",
      "GS từ chối: 'Ich kenne Sie nicht gut genug, um ein gutes Schreiben zu verfassen'. Hãy phản hồi tế nhị — không tranh luận, đề xuất alternative (gặp 30 phút để thầy hiểu thêm về dự án của em, gửi memo chi tiết), hoặc cảm ơn và chuyển sang xin GS khác.",
    ],
    register_notes: "Xin Empfehlungsschreiben có quy tắc cứng nhắc — vi phạm = GS từ chối hoặc viết thư yếu. (1) FORMAL TUYỆT ĐỐI: 'Sehr geehrter Herr Professor' luôn, kể cả khi GS đã 'du' với bạn. Việc xin thư là FORMAL act, không casual. (2) KONJUNKTIV II BẮT BUỘC: 'Würden Sie freundlicherweise...?', 'Wäre es möglich, dass Sie...?', 'Ich würde mich freuen, wenn...'. (3) TIMING LÀ NGHI LỄ: phải xin 4 TUẦN trước deadline tối thiểu, lý tưởng là 6 tuần. (4) CUNG CẤP TÀI LIỆU ĐẦY ĐỦ: GS Đức expect bạn cung cấp 'Bewerberpaket' — CV, Motivationsschreiben, Notenübersicht, danh sách deadlines, MEMO 3-5 gạch đầu dòng. (5) CHỈ XIN GS BIẾT BẠN TỐT: Empfehlungsschreiben từ GS chỉ dạy 1 môn = thư yếu. Phải là GS đã làm việc với bạn (Seminararbeit, Praktikum, Forschungsprojekt, Bachelorarbeit, Masterarbeit).\n\nKhi nói chuyện trực tiếp (Sprechstunde): mở đầu lịch sự ('Es geht um eine persönliche Bitte'), giải thích context, nêu yêu cầu cụ thể, đề xuất giúp GS dễ nhất. KẾT bằng cảm ơn và CONFIRM next steps.\n\nKhác Việt Nam: ở VN, có thể xin thư trong vài ngày, đôi khi nhờ assistant viết hộ; ở Đức, GS TỰ viết toàn bộ, thường mất 2-4 giờ làm việc — đó là lý do cần lead time. KHÔNG bao giờ submit Empfehlungsschreiben do bạn tự draft và xin GS ký — coi là 'akademisches Fehlverhalten'.\n\nNgười Việt thường mắc lỗi: (1) xin GS không quen biết — thư yếu; (2) xin quá gần deadline — bị từ chối; (3) không cung cấp memo — GS không nhớ chi tiết về bạn, viết generic; (4) follow-up quá nhiều — quấy rối GS; (5) không cảm ơn sau khi nhận thư — phá quan hệ cho lần sau.",
    idiom_glosses: [
      { idiom: "Ein gutes Wort einlegen", literal: "Đặt một lời tốt vào", meaning: "Nói lời tốt cho ai — vouch for someone. Đây là cụm CHÍNH XÁC để mô tả việc xin recommendation: 'Würden Sie ein gutes Wort für mich einlegen?'.", example: "Würden Sie freundlicherweise ein gutes Wort für mich einlegen?" },
      { idiom: "Auf Augenhöhe", literal: "Ở tầm mắt (cùng độ cao)", meaning: "Ngang hàng — đối xử như equals. Mô tả mối quan hệ tôn trọng giữa GS và sinh viên giỏi.", example: "Professor Müller behandelt seine Doktoranden immer auf Augenhöhe." },
      { idiom: "In den höchsten Tönen loben", literal: "Khen với những âm cao nhất", meaning: "Khen ngợi cực kỳ — đây là cụm CHÍNH XÁC mô tả thư giới thiệu mạnh nhất. Khi GS nói 'Ich werde Sie in den höchsten Tönen loben', họ cam kết viết thư xuất sắc.", example: "Ich werde Sie in den höchsten Tönen loben — Sie haben es verdient." },
      { idiom: "Sich auf jemanden verlassen können", literal: "Có thể dựa vào ai", meaning: "Có thể tin tưởng — biết ai sẽ làm điều đã hứa. Cả hai chiều trong context recommendation.", example: "Sie können sich auf mich verlassen — das Schreiben ist in 4 Wochen fertig." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm formal khi xin thư giới thiệu:",
        pronunciation_focus: ["Konjunktiv II", "academic formal"],
        items: [
          { prompt: "Sehr _____ Herr Professor Müller. (mở đầu)", answer: "geehrter" },
          { prompt: "Ich _____ mich mit einer persönlichen Bitte an Sie. (chuyển động)", answer: "wende" },
          { prompt: "_____ Sie mir freundlicherweise ein Empfehlungsschreiben ausstellen? (Konjunktiv II)", answer: "Würden" },
          { prompt: "Ein gutes _____ von Ihnen würde meine Chancen verbessern. (idiom: lời)", answer: "Wort" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối câu Đức với chức năng giao tiếp:",
        pronunciation_focus: [],
        items: [
          { prompt: "Würden Sie ein gutes Wort einlegen?", answer: "Xin lời tốt (idiom)" },
          { prompt: "Ich werde Sie in den höchsten Tönen loben.", answer: "Cam kết khen mạnh (idiom)" },
          { prompt: "Sie können sich auf mich verlassen.", answer: "Cam kết tin tưởng (idiom)" },
          { prompt: "Auf Augenhöhe wie immer.", answer: "Đối xử ngang hàng (idiom)" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức học thuật formal:",
        pronunciation_focus: ["academic Sie + Konjunktiv II"],
        items: [
          { prompt: "Em viết với một yêu cầu cá nhân.", answer: "Ich wende mich mit einer persönlichen Bitte an Sie." },
          { prompt: "Em đang ứng tuyển học bổng tại ETH Zürich.", answer: "Ich bewerbe mich um ein Stipendium an der ETH Zürich." },
          { prompt: "Thầy có thể vui lòng viết thư giới thiệu không?", answer: "Würden Sie freundlicherweise ein Empfehlungsschreiben ausstellen?" },
          { prompt: "Một lời tốt từ thầy sẽ cải thiện đáng kể cơ hội của em.", answer: "Ein gutes Wort von Ihnen würde meine Chancen erheblich verbessern." },
        ],
      },
    ],
  },
  {
    id: "german_b2_research_interests_academic",
    level: "B2",
    category: "fluency",
    title_vi: "Trao đổi định hướng nghiên cứu với GS tiềm năng",
    title_en: "Discussing research interests with potential supervisor",
    sentences: [
      { en: "Mein Forschungsinteresse liegt an der Schnittstelle zwischen Maschinellem Lernen und Klimamodellierung.", vi: "Lĩnh vực nghiên cứu của em nằm ở giao điểm giữa Machine Learning và mô hình hoá khí hậu.", pronunciation_focus: ["Schnittstelle → SHNÍT-shtê-lê", "Maschinellem → ma-SHÍ-nê-lêm", "Klimamodellierung → KLÍ-ma-mô-đê-li-rung"] },
      { en: "Ich brenne für interdisziplinäre Fragestellungen, die echten gesellschaftlichen Mehrwert schaffen.", vi: "Em say mê các câu hỏi liên ngành tạo ra giá trị xã hội thực sự.", pronunciation_focus: ["brenne → BRÊ-nê", "interdisziplinäre → in-tờ-điss-tsi-pli-NÊ-rê", "Mehrwert → MÊ-vet"] },
      { en: "Ihre Veröffentlichung von 2024 hat einen entscheidenden Einfluss auf mein Forschungsdesign gehabt.", vi: "Bài công bố năm 2024 của thầy/cô đã ảnh hưởng quyết định đến thiết kế nghiên cứu của em.", pronunciation_focus: ["Veröffentlichung → fe-ƠF-ent-lích-ung", "entscheidenden → ent-SHAI-đần-đần", "Forschungsdesign → FOR-shungs-đi-zain"] },
      { en: "Ich würde gerne den Horizont über die reine Theorie hinaus erweitern und auch empirisch arbeiten.", vi: "Em muốn mở rộng tầm nhìn ngoài lý thuyết thuần, làm thêm cả thực nghiệm.", pronunciation_focus: ["Horizont → ho-ri-TSÔNT", "erweitern → e-VAI-tờn", "empirisch → em-PÍA-rish"] },
      { en: "Welche methodischen Ansätze würden Sie für ein solches Projekt empfehlen?", vi: "Thầy/cô khuyên dùng phương pháp tiếp cận nào cho dự án như vậy?", pronunciation_focus: ["methodischen → mê-TÔ-đi-shần", "Ansätze → AN-zé-tsê", "empfehlen → em-FÊ-lần"] },
    ],
    cultural_notes_vi: "Cuộc gặp với potential supervisor (Doktorvater/-mutter) ở Đức KHÁC HẲN ở Mỹ và VN ở năm điểm cốt lõi. (1) GS LÀ ĐỒNG NGHIỆP, KHÔNG PHẢI THẦY: ngay từ cuộc gặp đầu, bạn được EXPECTED hành xử như 'Nachwuchskolleg:in' (đồng nghiệp sơ khởi) — có chính kiến, defend ý tưởng, đặt câu hỏi sâu. Khúm núm = bị coi là không sẵn sàng cho PhD. (2) FORSCHUNGSDESIGN PHẢI CỤ THỂ: GS expect bạn đã nghĩ qua câu hỏi nghiên cứu, hypothesis, methodology, dataset TRƯỚC khi đến gặp. 'Em chưa biết, mong thầy gợi ý' = trượt ngay. Có nháp ý tưởng 5-10 trang trước khi xin Sprechstunde. (3) CRITIQUE LÀ TÔN TRỌNG: nếu GS chỉ ra điểm yếu trong đề tài, đó là DẤU HIỆU TÔN TRỌNG — họ engage với bạn như equal. Nếu GS chỉ politely listen mà không critique, có thể họ không serious về bạn. (4) FIT QUAN TRỌNG HƠN PRESTIGE: hơn là đến với GS nổi tiếng nhất, hãy đến với GS có overlap thực sự với chủ đề bạn. (5) FUNDING-FIRST: GS Đức thường KHÔNG có tự fund cho PhD students — bạn phải tự lo (DAAD, VEF, công ty, etc.). Trong cuộc gặp đầu, GS sẽ hỏi 'Wie finanzieren Sie sich?'.\n\nKhác Mỹ: ở Mỹ, PhD student thường có RA-ship/TA-ship từ professor; ở Đức, hệ thống Stipendium độc lập với GS — bạn apply scholarship riêng, GS chỉ approve bạn vào nhóm.\n\nKhác VN: ở VN, GS là 'thầy' với mối quan hệ hierarchical; ở Đức, mối quan hệ là 'partnership' — GS đầu tư thời gian vào bạn, expect bạn tự drive project. Plus, ở Đức bạn được phép DISAGREE với GS trong meetings — đó không phải 'cãi thầy' mà là 'wissenschaftliche Auseinandersetzung'.\n\nMột chi tiết quan trọng: GS Đức thường không phản hồi email nhanh (1-2 tuần là chuẩn). Nếu cuộc gặp đầu tốt, follow-up trong 24h với 'Vielen Dank-email' + 1-pager đề cương sửa theo feedback.",
    tip_advice_vi: "Trước cuộc gặp (4-6 tuần): (1) Đọc 5-10 bài báo gần nhất của GS — không skim, đọc methodology section kỹ. (2) Lập danh sách 3 questions sâu về methodology của họ. (3) Viết Forschungsskizze 3-5 trang: question, hypothesis, methodology, expected contribution. (4) Email xin Sprechstunde, đính kèm Skizze + CV. (5) Chuẩn bị phương án funding (DAAD, VEF, company sponsorship).\n\nTrong cuộc gặp (60-90 phút): (1) Mở đầu cảm ơn + giới thiệu 30 giây. (2) Trình bày Forschungsinteresse 5 phút (max), sau đó mở cho discussion. (3) Khi GS ask câu hỏi, ANSWER trực tiếp — không lan man. (4) Khi GS critique, ADMIT điểm họ đúng + counter với evidence: 'Sie haben recht... Allerdings...'. (5) Khi GS đề xuất hướng khác, CONSIDER seriously trước khi nói no. (6) Hỏi 3 câu cụ thể về Lehrstuhl: cluster access, conference budget, frequency của Doktorandenkolloquium.\n\nNgôn ngữ học thuật: (1) Dùng Nominal-style: 'die Anwendung dieser Methode' chứ không 'wenn ich diese Methode anwende'. (2) Konjunktiv II cho yêu cầu. (3) Konjunktiv I cho gián tiếp. (4) Tránh từ Anh-styled: 'Insights' → 'Erkenntnisse'; 'Approach' → 'Ansatz'; 'Framework' → 'Rahmen'.\n\nKết cuộc gặp: (1) Tóm tắt 1 câu về điều bạn học được. (2) Hỏi NEXT STEP cụ thể: 'Soll ich ein detailliertes Exposé von 10 Seiten ausarbeiten?'. (3) Confirm timeline. (4) Cảm ơn formal.\n\nSau cuộc gặp (24h): (1) Email cảm ơn ngắn (4-5 dòng) tham chiếu 1-2 điểm cụ thể. (2) Trong 2 tuần, gửi đề cương đã sửa theo feedback. (3) Sau 4-6 tuần, follow-up status.",
    vocabulary: [
      { word: "das Forschungsinteresse", en: "research interest", vi: "định hướng nghiên cứu", pos: "noun (n)", pronunciation_vi: "đát FOR-shungs-in-tờ-rê-sê" },
      { word: "die Schnittstelle", en: "interface, intersection", vi: "giao điểm, giao thoa", pos: "noun (f)", pronunciation_vi: "đi SHNÍT-shtê-lê" },
      { word: "interdisziplinär", en: "interdisciplinary", vi: "liên ngành", pos: "adjective", pronunciation_vi: "in-tờ-điss-tsi-pli-NÊR" },
      { word: "die Fragestellung", en: "research question", vi: "câu hỏi nghiên cứu", pos: "noun (f)", pronunciation_vi: "đi FRA-gê-shtê-lung" },
      { word: "der methodische Ansatz", en: "methodological approach", vi: "phương pháp tiếp cận", pos: "noun (m)", pronunciation_vi: "đe mê-TÔ-đi-shê AN-zats" },
      { word: "die Hypothese", en: "hypothesis", vi: "giả thuyết", pos: "noun (f)", pronunciation_vi: "đi huy-pô-TÊ-zê" },
      { word: "empirisch arbeiten", en: "to work empirically", vi: "làm việc thực nghiệm", pos: "verb phrase", pronunciation_vi: "em-PÍA-rish AR-bai-tần" },
      { word: "der Forschungsstand", en: "state of the art (research)", vi: "tình trạng nghiên cứu hiện tại", pos: "noun (m)", pronunciation_vi: "đe FOR-shungs-shtánt" },
      { word: "die Veröffentlichung", en: "publication, paper", vi: "bài công bố", pos: "noun (f)", pronunciation_vi: "đi fe-ƠF-ent-lích-ung" },
      { word: "den Horizont erweitern", en: "to broaden one's horizons (idiom)", vi: "mở rộng tầm nhìn", pos: "verb phrase", pronunciation_vi: "đần ho-ri-TSÔNT e-VAI-tờn" },
    ],
    dialogue: [
      { speaker: "Linh", text: "Frau Professor Wagner, mein Forschungsinteresse liegt an der Schnittstelle Maschinelles Lernen und Klimamodellierung.", vi: "Cô Wagner, lĩnh vực nghiên cứu của em nằm ở giao điểm Machine Learning và mô hình hoá khí hậu." },
      { speaker: "Prof. Wagner", text: "Spannende Schnittstelle. Welche konkrete Fragestellung verfolgen Sie?", vi: "Giao thoa thú vị. Câu hỏi cụ thể em theo đuổi là gì?" },
      { speaker: "Linh", text: "Wie kann man Klimavorhersagen für das Mekong-Delta mit ML deutlich verbessern?", vi: "Làm thế nào dùng ML để cải thiện đáng kể dự báo khí hậu cho đồng bằng sông Mekong?" },
      { speaker: "Prof. Wagner", text: "Das brennt mir auch unter den Nägeln. Lassen Sie mich Ihnen auf den Zahn fühlen — was ist Ihre Hypothese?", vi: "Tôi cũng quan tâm điều này. Để tôi thử kiểm tra em — giả thuyết của em là gì?" },
    ],
    dialogue_long: [
      { speaker: "Prof. Wagner", text: "Frau Linh, schön dass Sie da sind. Sie haben in Ihrer E-Mail eine sehr klare Forschungsskizze geschickt.", vi: "Cô Linh, mừng vì cô có mặt. Trong email cô đã gửi một bản phác thảo nghiên cứu rất rõ ràng." },
      { speaker: "Linh", text: "Vielen Dank, Frau Professor. Ich freue mich auf den Austausch.", vi: "Cảm ơn cô. Em mong chờ buổi trao đổi." },
      { speaker: "Prof. Wagner", text: "Erzählen Sie mir mehr — wo genau liegt Ihr Forschungsinteresse?", vi: "Cô kể tôi nghe thêm — định hướng nghiên cứu của cô cụ thể nằm ở đâu?" },
      { speaker: "Linh", text: "An der Schnittstelle zwischen Maschinellem Lernen und Klimamodellierung. Konkret: Wie können neuronale Netze Klimavorhersagen für tropische Deltas verbessern?", vi: "Ở giao điểm giữa Machine Learning và mô hình hoá khí hậu. Cụ thể: làm thế nào mạng nơ-ron có thể cải thiện dự báo khí hậu cho các đồng bằng nhiệt đới?" },
      { speaker: "Prof. Wagner", text: "Sehr aktuelles Thema. Was hat Sie auf diese Fragestellung geführt?", vi: "Chủ đề rất thời sự. Điều gì đưa cô đến câu hỏi này?" },
      { speaker: "Linh", text: "Ihre Veröffentlichung von 2024 über Transformer-Modelle für Niederschlagsvorhersagen hat einen entscheidenden Einfluss gehabt. Aber im Anwendungsbeispiel fehlt der Süd-Süd-Kontext — den möchte ich beitragen.", vi: "Bài công bố 2024 của cô về mô hình Transformer cho dự báo mưa đã ảnh hưởng quyết định. Nhưng trong ví dụ ứng dụng thiếu bối cảnh Nam-Nam — em muốn đóng góp điều đó." },
      { speaker: "Prof. Wagner", text: "Eine berechtigte Kritik — meine Daten sind tatsächlich sehr Europa-zentriert. Wie würden Sie das methodisch angehen?", vi: "Phê bình hợp lý — dữ liệu của tôi thực sự rất Âu-trung tâm. Cô sẽ tiếp cận về phương pháp thế nào?" },
      { speaker: "Linh", text: "Drei Schritte: erstens lokale Mekong-Daten von der Mekong River Commission akquirieren; zweitens Ihr Modell auf diese Daten transfer-learning anwenden; drittens systematische Vergleiche mit traditionellen statistischen Modellen ziehen.", vi: "Ba bước: thứ nhất, thu thập dữ liệu Mekong từ Uỷ hội sông Mekong; thứ hai, áp dụng transfer learning mô hình của cô lên dữ liệu này; thứ ba, so sánh hệ thống với các mô hình thống kê truyền thống." },
      { speaker: "Prof. Wagner", text: "Lassen Sie mich Ihnen auf den Zahn fühlen — wie groß ist Ihr Datensatz, und reicht er für Transfer Learning?", vi: "Để tôi kiểm tra cô — bộ dữ liệu lớn đến đâu, và có đủ cho transfer learning không?" },
      { speaker: "Linh", text: "Ich habe Zugriff auf 30 Jahre täglicher Niederschlagsdaten von 47 Stationen. Das sollte für Fine-Tuning ausreichen, allerdings müssen wir mit Data-Sparsity-Problemen rechnen.", vi: "Em có quyền truy cập 30 năm dữ liệu mưa hàng ngày từ 47 trạm. Đủ cho fine-tuning, nhưng phải tính đến vấn đề data sparsity." },
      { speaker: "Prof. Wagner", text: "Solide Grundlage. Welche methodischen Ansätze würden Sie für die Sparsity-Problematik wählen?", vi: "Cơ sở vững. Cô chọn phương pháp tiếp cận nào cho vấn đề sparsity?" },
      { speaker: "Linh", text: "Data Augmentation durch satellitenbasierte Fernerkundung, plus regularisierte Loss Functions. Aber genau hier brenne ich für Ihre Expertise — Ihr Lehrstuhl hat Pioneer-Arbeit in dem Bereich geleistet.", vi: "Data augmentation qua viễn thám vệ tinh, cộng với regularized loss functions. Nhưng đây là điểm em say mê được học từ cô — bộ môn của cô đã có công trình tiên phong." },
      { speaker: "Prof. Wagner", text: "Sie haben Ihre Hausaufgaben gemacht. Eine Lanze für interdisziplinäre Forschung möchte ich übrigens immer brechen — was ist Ihre Vision für nach der Promotion?", vi: "Cô đã làm bài tập về nhà tốt. Tôi luôn ủng hộ nghiên cứu liên ngành — tầm nhìn của cô sau tiến sĩ là gì?" },
      { speaker: "Linh", text: "Eine Forschungsgruppe für Klima-AI an der Vietnam National University aufbauen. Mit den dort vorhandenen Daten und Ihrem methodischen Erbe wäre das ein einzigartiger Beitrag.", vi: "Xây dựng nhóm nghiên cứu Khí hậu-AI tại Đại học Quốc gia Việt Nam. Với dữ liệu có sẵn ở đó và di sản phương pháp của cô, đó sẽ là đóng góp độc đáo." },
      { speaker: "Prof. Wagner", text: "Eine ambitionierte aber realistische Vision. Was bräuchten Sie konkret von mir als Betreuerin?", vi: "Tầm nhìn tham vọng nhưng thực tế. Cụ thể cô cần gì từ tôi với tư cách người hướng dẫn?" },
      { speaker: "Linh", text: "Methodische Korrekturen alle 4-6 Wochen, Zugang zu Ihrem Cluster für Trainingsläufe, und die Möglichkeit, einmal pro Jahr an einer großen Konferenz teilzunehmen.", vi: "Chỉnh sửa phương pháp mỗi 4-6 tuần, quyền truy cập cluster để chạy training, và khả năng tham dự một hội nghị lớn mỗi năm." },
      { speaker: "Prof. Wagner", text: "Das lässt sich machen. Ich nehme Sie als Doktorandin auf, vorbehaltlich erfolgreicher Stipendiumszusage. Schicken Sie mir bis Ende des Monats ein 10-Seiten-Exposé.", vi: "Có thể sắp xếp. Tôi nhận cô làm nghiên cứu sinh, với điều kiện học bổng được duyệt. Gửi tôi đề cương 10 trang trước cuối tháng." },
      { speaker: "Linh", text: "Vielen Dank für Ihr Vertrauen, Frau Professor. Sie haben meinen Horizont in einer Stunde erheblich erweitert. Ich melde mich Ende des Monats.", vi: "Cảm ơn cô về sự tin tưởng. Cô đã mở rộng tầm nhìn của em rất nhiều trong một giờ. Em sẽ liên hệ cuối tháng." },
    ],
    roleplay_prompts: [
      "GS hỏi 'Worin unterscheidet sich Ihr Ansatz von dem meiner aktuellen Doktorandin Frau Schmidt?'. Hãy trả lời tế nhị — KHÔNG hạ thấp Frau Schmidt, mà nâng cao điểm khác biệt cụ thể của bạn (vùng địa lý, dataset, methodology variant). Mục tiêu: chứng minh bạn là addition, không phải duplication.",
      "GS pushback mạnh: 'Ich glaube nicht, dass ML allein die Klimavorhersage revolutionieren kann — Sie überschätzen die Methode'. Hãy phản hồi không nhượng bộ vô lý nhưng không cãi cứng — thừa nhận có hạn chế, đề xuất hybrid approach (ML + physical models), nêu evidence từ literature gần đây.",
      "Sau cuộc gặp tốt, GS đề xuất bạn TỪ BỎ đề tài Mekong và làm về dữ liệu Đức để 'dễ publish hơn'. Hãy đàm phán: cảm ơn lời khuyên, giải thích vì sao Mekong quan trọng cho cá nhân/quê hương, đề xuất compromise (phương pháp dùng cho cả 2 vùng, comparative study Đức-VN).",
    ],
    register_notes: "Trao đổi nghiên cứu với GS Đức tuyệt đối formal — 'Sie' luôn, kể cả với GS trẻ hoặc trong môi trường postdoc thân mật. Tone là 'akademisch und respektvoll' nhưng KHÔNG khúm núm. Sự khác biệt tế nhị: bạn là 'Nachwuchsforscher:in' (nhà nghiên cứu trẻ), không phải 'Schüler:in' (học sinh) — bạn đến trao đổi như nhà nghiên cứu sơ khởi với chuyên gia.\n\nNgôn ngữ học thuật: dùng nominalization (danh từ hoá) — 'Mein Forschungsinteresse liegt...' chứ không 'Ich interessiere mich für...'; 'die Anwendung der Methode' chứ không 'wenn man die Methode anwendet'. Đây là Wissenschaftssprache (ngôn ngữ khoa học) Đức — sinh viên VN học từ tiếng Anh thường viết Verbal-style; phải chuyển sang Nominal-style.\n\nKonjunktiv I cho gián tiếp: 'Frau Wagner schrieb in ihrer Veröffentlichung, ML könne eine Revolution darstellen' — dùng để trích dẫn lý thuyết của người khác mà không cam kết bạn đồng ý. Konjunktiv II cho yêu cầu/giả định.\n\nKHI PUSHBACK TỪ GS: KHÔNG nhượng bộ ngay nếu bạn có lý lẽ vững. Người Đức đánh giá cao 'wissenschaftliche Auseinandersetzung' (tranh luận học thuật) — admit điểm GS đúng, sau đó counter với evidence: 'Sie haben recht, dass... Allerdings zeigt die Studie von X aus 2023, dass...'. Đồng ý mọi điều = bị coi là không có chính kiến.\n\nKHÁC VN: ở VN, sinh viên thường nhận lời GS không tranh luận; ở Đức, GS EXPECT bạn defend ý kiến — đó là dấu hiệu intellectual maturity.",
    idiom_glosses: [
      { idiom: "Den Horizont erweitern", literal: "Mở rộng đường chân trời", meaning: "Mở rộng tầm nhìn, tiếp cận perspectives mới — qua đọc, nghiên cứu, đối thoại với chuyên gia. Trong context academic: cảm ơn GS đã giúp bạn nhìn xa hơn — không phải xã giao mà thực sự công nhận growth.", example: "Sie haben meinen Horizont in dieser Stunde erheblich erweitert." },
      { idiom: "Brennen für etwas", literal: "Cháy vì cái gì", meaning: "Say mê, đam mê thực sự — không chỉ 'thích' mà là động lực đẩy bạn forward. Trong academic context, đây là cách thể hiện passion mà không melodramatic — chuẩn formal nhưng emotional.", example: "Ich brenne für interdisziplinäre Forschung." },
      { idiom: "Auf den Zahn fühlen", literal: "Sờ vào răng (kiểm tra răng ngựa khi mua)", meaning: "Kiểm tra, test ai một cách kỹ lưỡng — bằng câu hỏi khó để xem họ thực sự biết gì. GS Đức thường 'auf den Zahn fühlen' candidate trong cuộc gặp đầu — không phải để tra tấn mà để đánh giá depth.", example: "Lassen Sie mich Ihnen kurz auf den Zahn fühlen — was ist Ihre Hypothese?" },
      { idiom: "Eine Lanze brechen für", literal: "Bẻ một cây thương cho", meaning: "Bảo vệ, đứng ra ủng hộ điều gì — đặc biệt khi không phải mainstream. Phù hợp khi GS bảo vệ một hướng nghiên cứu interdisciplinary hoặc chủ đề ít được công nhận.", example: "Eine Lanze für interdisziplinäre Forschung möchte ich immer brechen." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm phù hợp khi trao đổi nghiên cứu với GS:",
        pronunciation_focus: ["academic Sie + Konjunktiv II"],
        items: [
          { prompt: "Mein Forschungs_____ liegt an der Schnittstelle von ML und Klimaforschung. (định hướng)", answer: "interesse" },
          { prompt: "Ich _____ für interdisziplinäre Fragestellungen. (idiom: say mê)", answer: "brenne" },
          { prompt: "Welche methodischen _____ würden Sie empfehlen? (phương pháp tiếp cận)", answer: "Ansätze" },
          { prompt: "Sie haben meinen _____ erweitert. (idiom: tầm nhìn)", answer: "Horizont" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối câu Đức với chức năng giao tiếp học thuật:",
        pronunciation_focus: [],
        items: [
          { prompt: "Was ist Ihre Hypothese?", answer: "GS test depth của candidate" },
          { prompt: "Ich brenne für dieses Thema.", answer: "Thể hiện đam mê (idiom)" },
          { prompt: "Lassen Sie mich Ihnen auf den Zahn fühlen.", answer: "GS sắp test bạn (idiom)" },
          { prompt: "Eine Lanze brechen für interdisziplinäre Forschung.", answer: "Bảo vệ hướng nghiên cứu (idiom)" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Đức học thuật formal:",
        pronunciation_focus: ["academic Wissenschaftssprache"],
        items: [
          { prompt: "Lĩnh vực của em ở giao điểm Machine Learning và mô hình hoá khí hậu.", answer: "Mein Forschungsinteresse liegt an der Schnittstelle zwischen Maschinellem Lernen und Klimamodellierung." },
          { prompt: "Bài công bố 2024 của thầy/cô đã ảnh hưởng quyết định đến em.", answer: "Ihre Veröffentlichung von 2024 hat einen entscheidenden Einfluss auf mich gehabt." },
          { prompt: "Em muốn mở rộng tầm nhìn ngoài lý thuyết thuần.", answer: "Ich würde gerne den Horizont über die reine Theorie hinaus erweitern." },
          { prompt: "Cảm ơn cô về sự tin tưởng — em sẽ liên hệ cuối tháng.", answer: "Vielen Dank für Ihr Vertrauen — ich melde mich Ende des Monats." },
        ],
      },
    ],
  },
];

// ── Aggregate export ────────────────────────────────────────────────────

export const GERMAN_LESSONS: ReadonlyArray<GermanLesson> = [
  ...GREETINGS,
  ...NUMBERS,
  ...COMMON_PHRASES,
  ...CASES_INTRO,
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
  category: GermanCategoryId,
): GermanLesson[] {
  return GERMAN_LESSONS.filter((l) => l.category === category);
}

export function getLessonById(id: string): GermanLesson | undefined {
  return GERMAN_LESSONS.find((l) => l.id === id);
}

export const lessons = GERMAN_LESSONS;
export default GERMAN_LESSONS;

