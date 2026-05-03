// src/languages/german/lessons.ts
//
// 5 introductory German lessons for Vietnamese learners.
// Each lesson is a short, contextual conversation snippet designed
// for the Mercy character Speak tab — bilingual title, 4-6 sentences
// with Vietnamese gloss and pronunciation focus keys for the phonemes
// Vietnamese learners commonly miss in German ('ch' ich-Laut vs ach-Laut,
// 'ü' / 'ö' umlauts, 'z' pronounced /ts/, 'st' / 'sp' word-initial,
// final devoicing, 'r' guttural).
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
  | "food";

export type GermanCategoryMeta = {
  id: GermanCategoryId;
  title_vi: string;
  title_en: string;
  expected_count: number;
};

export const GERMAN_CATEGORIES: ReadonlyArray<GermanCategoryMeta> = [
  {
    id: "greetings",
    title_vi: "Chào hỏi và giới thiệu",
    title_en: "Greetings and introductions",
    expected_count: 1,
  },
  {
    id: "numbers",
    title_vi: "Số đếm",
    title_en: "Numbers",
    expected_count: 1,
  },
  {
    id: "common_phrases",
    title_vi: "Câu giao tiếp thông dụng",
    title_en: "Common phrases",
    expected_count: 1,
  },
  {
    id: "cases_intro",
    title_vi: "Giới thiệu về cách (cách 1 và cách 4)",
    title_en: "Cases introduction (nominative and accusative)",
    expected_count: 1,
  },
  {
    id: "food",
    title_vi: "Ẩm thực và gọi món",
    title_en: "Food and ordering",
    expected_count: 1,
  },
];

export type LessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
};

export type GermanLesson = {
  id: string;
  category: GermanCategoryId;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  tip_advice_vi: string;
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
    cultural_notes_vi:
      "Người Đức phân biệt rất rõ giữa 'du' (thân mật) và 'Sie' (lịch sự). Dùng 'Sie' với người lạ, người lớn tuổi, đồng nghiệp cho đến khi được mời chuyển sang 'du'. Bắt tay khi gặp lần đầu là chuẩn mực — nắm chắc, nhìn thẳng mắt. 'Guten Tag' dùng cả ngày; 'Guten Morgen' trước 10h sáng; 'Guten Abend' sau 6h tối. 'Hallo' dùng được với mọi lứa tuổi, an toàn hơn các lựa chọn thân mật khác.",
    tip_advice_vi:
      "Người Đức đánh giá cao sự chính xác. Khi tự giới thiệu, nói rõ họ và tên — không chỉ tên không như Mỹ. 'Ich heiße...' (tôi tên là) chuẩn hơn 'Mein Name ist...' (nghe giống dịch từ tiếng Anh). Học phân biệt 'ch' trong 'ich' (nhẹ, giống 'h' tiếng Việt nhưng bật hơi) và 'ch' trong 'noch' (nặng hơn) — đây là điểm yếu nhất của người Việt.",
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
    cultural_notes_vi:
      "Số Đức nói đơn vị trước chục: 21 = einundzwanzig (một-và-hai-mươi). Đây là một trong những điểm khó nhất cho người mới học. Số điện thoại đọc từng chữ số một — không nhóm như tiếng Việt. Khi trả tiền mặt, người Đức thích đếm tiền chính xác đến từng cent — không làm tròn như Việt Nam.",
    tip_advice_vi:
      "Khi mua hàng ở Đức, nhân viên sẽ nói giá rất nhanh. Học phản xạ với số 1-20 và các mốc chục (20 zwanzig, 30 dreißig, 40 vierzig...). Đừng cố đếm 21-99 ngay — tập 1-20 cho nhuần nhuyễn trước. Âm 'z' luôn là 'ts' (như 'x' tiếng Việt nhưng có âm 't' phía trước) — sai âm này là lộ ngay.",
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
      { en: "Wie viel kostet das?", vi: "Cái này giá bao nhiêu?", pronunciation_focus: ["v → f", "ie → i dài", "st → sht", "a → a dài"] },
      { en: "Ich möchte ein Ticket nach Berlin.", vi: "Tôi muốn một vé đi Berlin.", pronunciation_focus: ["ch-Laut nhẹ", "ö → ơ tròn môi", "ck → k", "nach → nách"] },
      { en: "Sprechen Sie Englisch?", vi: "Bạn nói tiếng Anh không?", pronunciation_focus: ["sch → s nặng", "sp → shp", "ie → i dài", "Englisch → éng-lít-s"] },
      { en: "Ich verstehe nicht. Können Sie das wiederholen?", vi: "Tôi không hiểu. Bạn nói lại được không?", pronunciation_focus: ["v → f", "st → sht", "ö → ơ tròn môi", "ie → i dài"] },
    ],
    cultural_notes_vi:
      "Người Đức nói tiếng Anh rất tốt, đặc biệt là người trẻ và ở thành phố lớn. Nhưng 'Sprechen Sie Englisch?' trước khi chuyển sang tiếng Anh là phép lịch sự cơ bản. Ở vùng nông thôn hoặc với người lớn tuổi, nhiều người không nói tiếng Anh — mấy câu tiếng Đức cơ bản là cứu cánh thật sự.",
    tip_advice_vi:
      "Học thuộc 5 câu này cho chuyến đi Đức: 'Guten Tag', 'bitte' (làm ơn/không có gì), 'danke', 'wo ist die Toilette', 'die Rechnung bitte' (hóa đơn). Người Đức thích sự trực tiếp — đừng vòng vo như Mỹ. 'Ich möchte' (tôi muốn) là câu an toàn cho mọi tình huống mua hàng, gọi món, đặt vé.",
  },
];

// ── 4. Cases Introduction ───────────────────────────────────────────────

const CASES_INTRO: GermanLesson[] = [
  {
    id: "german_cases_nom_acc",
    category: "cases_intro",
    title_vi: "Cách 1 (chủ ngữ) và cách 4 (tân ngữ trực tiếp)",
    title_en: "Nominative and accusative case",
    sentences: [
      { en: "Der Hund ist braun. (Nominative — chủ ngữ)", vi: "Con chó màu nâu. (Cách 1: 'der' = chủ ngữ giống đực)", pronunciation_focus: ["der → đe-a", "u → u ngắn", "au → ao", "st → sht"] },
      { en: "Ich sehe den Hund. (Accusative — tân ngữ)", vi: "Tôi nhìn thấy con chó. (Cách 4: 'den' = tân ngữ giống đực)", pronunciation_focus: ["den → đên", "ich ch-Laut", "eh → ê", "sehe → zê-ê"] },
      { en: "Die Katze ist klein. → Ich sehe die Katze.", vi: "Con mèo nhỏ. → Tôi thấy con mèo. (Giống cái không đổi)", pronunciation_focus: ["die → đi", "a → a ngắn", "z → ts", "ei → ai"] },
      { en: "Das Kind spielt. → Ich sehe das Kind.", vi: "Đứa trẻ chơi. → Tôi thấy đứa trẻ. (Giống trung không đổi)", pronunciation_focus: ["das → đát", "i → i ngắn", "sp → shp", "ie → i dài"] },
      { en: "Der Mann gibt dem Hund den Ball.", vi: "Người đàn ông đưa quả bóng cho con chó. (Cách 1-3-4)", pronunciation_focus: ["a → a ngắn", "gibt → ghipt", "dem → đêm", "Ball → ban"] },
    ],
    cultural_notes_vi:
      "Tiếng Đức có 4 cách (Fälle): Nominativ (chủ ngữ), Akkusativ (tân ngữ trực tiếp), Dativ (tân ngữ gián tiếp), Genitiv (sở hữu). Đây là điểm khó NHẤT cho người Việt học tiếng Đức — tiếng Việt không có khái niệm này. Chỉ có giống đực (der → den) thay đổi giữa cách 1 và cách 4; giống cái (die) và giống trung (das) giữ nguyên. Học 2 cách đầu tiên làm nền tảng cho 2 cách còn lại.",
    tip_advice_vi:
      "Đừng cố học cả 4 cách một lúc — sẽ rối. Học cách 1 và cách 4 trước (Nominativ và Akkusativ), dùng ít nhất 2 tuần cho quen. Mẹo: 'der' = chủ ngữ, 'den' = tân ngữ. Sau mỗi động từ thường, danh từ giống đực đổi thành 'den'. Người Đức vẫn hiểu bạn nếu bạn sai cách — nhưng đúng cách thể hiện bạn nghiêm túc học tiếng Đức.",
  },
];

// ── 5. Food & Ordering ──────────────────────────────────────────────────

const FOOD: GermanLesson[] = [
  {
    id: "german_food_ordering",
    category: "food",
    title_vi: "Gọi món ăn",
    title_en: "Ordering food",
    sentences: [
      { en: "Ich möchte eine Bratwurst mit Sauerkraut, bitte.", vi: "Cho tôi một cái xúc xích nướng với dưa cải ạ.", pronunciation_focus: ["ö → ơ tròn môi", "au → ao", "w → v", "au → ao"] },
      { en: "Und ein großes Bier, bitte.", vi: "Và một ly bia lớn ạ.", pronunciation_focus: ["ß → ss", "ie → i dài", "groß → grôs", "Bier → bi-a"] },
      { en: "Was können Sie empfehlen?", vi: "Bạn gợi ý món gì?", pronunciation_focus: ["w → v", "ö → ơ tròn môi", "ie → i dài", "empfehlen → emp-fê-lần"] },
      { en: "Die Rechnung, bitte. Zusammen oder getrennt?", vi: "Cho xin hóa đơn. Gộp chung hay tách riêng?", pronunciation_focus: ["ch → ch nhẹ", "z → ts", "getrennt → ghờ-trént"] },
      { en: "Das war sehr lecker! Danke schön.", vi: "Ngon quá! Cảm ơn nhiều.", pronunciation_focus: ["w → v", "a → a dài", "schön → sơn", "ö → ơ tròn môi"] },
    ],
    cultural_notes_vi:
      "Ở Đức, tiền tip (Trinkgeld) thường 5-10% — không cao như Mỹ. Đưa tip trực tiếp khi trả tiền: nói 'Stimmt so' (giữ lại tiền thừa) hoặc 'Machen Sie X Euro' (làm tròn lên X euro). Không để tiền tip trên bàn rồi đi — đưa trực tiếp cho bồi bàn. Bia Đức uống kèm đồ ăn là văn hóa, không uống riêng như nhậu Việt. Nước máy (Leitungswasser) ở Đức sạch và miễn phí — nhưng ít nhà hàng tự động mang ra, phải xin.",
    tip_advice_vi:
      "Khi gọi món: 'Ich möchte...' + tên món + 'bitte' là đủ. Không cần 'Can I have...' như tiếng Anh — người Đức thích trực tiếp. 'Lecker' (ngon) và 'sehr gut' (rất tốt) là hai từ làm người Đức hài lòng nhất. Học từ 'zusammen' (gộp chung) và 'getrennt' (tách riêng) — người Đức luôn hỏi khi thanh toán nhóm.",
  },
];

// ── Aggregate export ────────────────────────────────────────────────────

export const GERMAN_LESSONS: ReadonlyArray<GermanLesson> = [
  ...GREETINGS,
  ...NUMBERS,
  ...COMMON_PHRASES,
  ...CASES_INTRO,
  ...FOOD,
];

export function getLessonsByCategory(
  category: GermanCategoryId,
): GermanLesson[] {
  return GERMAN_LESSONS.filter((l) => l.category === category);
}

export function getLessonById(id: string): GermanLesson | undefined {
  return GERMAN_LESSONS.find((l) => l.id === id);
}

export default GERMAN_LESSONS;
