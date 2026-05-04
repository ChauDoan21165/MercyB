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
  | "future_plans";

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

export type GermanLesson = {
  id: string;
  category: GermanCategoryId;
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

const GREETINGS: GermanLesson[] = [
  {
    id: "german_greetings_intro",
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

