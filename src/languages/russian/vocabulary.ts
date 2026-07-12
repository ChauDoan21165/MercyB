// src/languages/russian/vocabulary.ts
//
// Curated Russian vocabulary for Vietnamese learners (R10 batch).
// Converted from the local Vietnamese-Russian study archive:
//   frequency-words-001.tsv, frequency-words-1001-2000.tsv, master-vocabulary.tsv,
//   top-1000-survival-phrases.md.
// Compact, app-ready data only — a curated high-value subset, not the full lists.
// Every entry carries both a Vietnamese (vi) and an English (en) gloss so a future
// `native_language = vi | en` toggle can switch explanation language without
// changing the Russian source word.

export type RussianVocabLevel = "A1" | "A2" | "B1";

export type RussianVocabTopic =
  | "core"
  | "people_family"
  | "food"
  | "time"
  | "travel_transport"
  | "body_health"
  | "home_city"
  | "work_school"
  | "nature"
  | "technology_media";

export type RussianVocabItem = {
  cell_id?: string;
  /** Russian headword (dictionary / nominative form). */
  ru: string;
  /** Latin transliteration. */
  translit: string;
  /** Vietnamese meaning. */
  vi: string;
  /** English meaning. */
  en: string;
  /** Part of speech. */
  pos: "noun" | "verb" | "adjective" | "pronoun" | "adverb" | "function" | "numeral";
  level: RussianVocabLevel;
  topic: RussianVocabTopic;
};

export const RUSSIAN_VOCABULARY: ReadonlyArray<RussianVocabItem> = [
  // ── core: function words, pronouns, high-frequency glue ──────────────────
  { ru: "и", translit: "i", vi: "và", en: "and", pos: "function", level: "A1", topic: "core" },
  { ru: "не", translit: "ne", vi: "không", en: "not", pos: "function", level: "A1", topic: "core" },
  { ru: "в", translit: "v", vi: "ở / vào", en: "in / into", pos: "function", level: "A1", topic: "core" },
  { ru: "на", translit: "na", vi: "trên / ở", en: "on / at", pos: "function", level: "A1", topic: "core" },
  { ru: "с", translit: "s", vi: "với / cùng", en: "with", pos: "function", level: "A1", topic: "core" },
  { ru: "у", translit: "u", vi: "ở chỗ / của", en: "at / by (someone has)", pos: "function", level: "A1", topic: "core" },
  { ru: "к", translit: "k", vi: "đến / tới", en: "to / toward", pos: "function", level: "A1", topic: "core" },
  { ru: "из", translit: "iz", vi: "từ / ra khỏi", en: "from / out of", pos: "function", level: "A1", topic: "core" },
  { ru: "для", translit: "dlya", vi: "cho / để", en: "for", pos: "function", level: "A1", topic: "core" },
  { ru: "о", translit: "o", vi: "về", en: "about", pos: "function", level: "A1", topic: "core" },
  { ru: "но", translit: "no", vi: "nhưng", en: "but", pos: "function", level: "A1", topic: "core" },
  { ru: "или", translit: "ili", vi: "hoặc", en: "or", pos: "function", level: "A1", topic: "core" },
  { ru: "если", translit: "yesli", vi: "nếu", en: "if", pos: "function", level: "A1", topic: "core" },
  { ru: "что", translit: "chto", vi: "cái gì / rằng", en: "what / that", pos: "function", level: "A1", topic: "core" },
  { ru: "как", translit: "kak", vi: "như thế nào", en: "how", pos: "function", level: "A1", topic: "core" },
  { ru: "когда", translit: "kogda", vi: "khi nào", en: "when", pos: "function", level: "A1", topic: "core" },
  { ru: "где", translit: "gde", vi: "ở đâu", en: "where", pos: "function", level: "A1", topic: "core" },
  { ru: "почему", translit: "pochemu", vi: "tại sao", en: "why", pos: "function", level: "A1", topic: "core" },
  { ru: "это", translit: "eto", vi: "đây / cái này", en: "this / it is", pos: "pronoun", level: "A1", topic: "core" },
  { ru: "я", translit: "ya", vi: "tôi", en: "I", pos: "pronoun", level: "A1", topic: "core" },
  { ru: "ты", translit: "ty", vi: "bạn (thân mật)", en: "you (informal)", pos: "pronoun", level: "A1", topic: "core" },
  { ru: "вы", translit: "vy", vi: "ngài / các bạn", en: "you (formal/plural)", pos: "pronoun", level: "A1", topic: "core" },
  { ru: "он", translit: "on", vi: "anh ấy", en: "he", pos: "pronoun", level: "A1", topic: "core" },
  { ru: "она", translit: "ona", vi: "cô ấy", en: "she", pos: "pronoun", level: "A1", topic: "core" },
  { ru: "оно", translit: "ono", vi: "nó (trung)", en: "it (neuter)", pos: "pronoun", level: "A1", topic: "core" },
  { ru: "мы", translit: "my", vi: "chúng tôi", en: "we", pos: "pronoun", level: "A1", topic: "core" },
  { ru: "они", translit: "oni", vi: "họ", en: "they", pos: "pronoun", level: "A1", topic: "core" },
  { ru: "мой", translit: "moy", vi: "của tôi", en: "my", pos: "pronoun", level: "A1", topic: "core" },
  { ru: "весь", translit: "ves", vi: "toàn bộ", en: "all / whole", pos: "pronoun", level: "A2", topic: "core" },
  { ru: "который", translit: "kotoryy", vi: "mà / cái mà", en: "which / who", pos: "pronoun", level: "A2", topic: "core" },
  { ru: "быть", translit: "byt", vi: "là / ở / có", en: "to be", pos: "verb", level: "A1", topic: "core" },
  { ru: "очень", translit: "ochen", vi: "rất", en: "very", pos: "adverb", level: "A1", topic: "core" },
  { ru: "тоже", translit: "tozhe", vi: "cũng", en: "also / too", pos: "adverb", level: "A1", topic: "core" },
  { ru: "уже", translit: "uzhe", vi: "đã / rồi", en: "already", pos: "adverb", level: "A1", topic: "core" },
  { ru: "ещё", translit: "yeshchyo", vi: "còn / nữa", en: "still / more", pos: "adverb", level: "A1", topic: "core" },
  { ru: "только", translit: "tolko", vi: "chỉ", en: "only", pos: "adverb", level: "A1", topic: "core" },
  { ru: "сейчас", translit: "seychas", vi: "bây giờ", en: "now", pos: "adverb", level: "A1", topic: "core" },
  { ru: "здесь", translit: "zdes", vi: "ở đây", en: "here", pos: "adverb", level: "A1", topic: "core" },
  { ru: "там", translit: "tam", vi: "ở kia", en: "there", pos: "adverb", level: "A1", topic: "core" },
  { ru: "хорошо", translit: "khorosho", vi: "tốt / được", en: "well / good / okay", pos: "adverb", level: "A1", topic: "core" },
  { ru: "ноль", translit: "nol", vi: "số không", en: "zero", pos: "numeral", level: "A1", topic: "core" },
  { ru: "один", translit: "odin", vi: "một", en: "one", pos: "numeral", level: "A1", topic: "core" },
  { ru: "два", translit: "dva", vi: "hai", en: "two", pos: "numeral", level: "A1", topic: "core" },
  { ru: "три", translit: "tri", vi: "ba", en: "three", pos: "numeral", level: "A1", topic: "core" },
  { ru: "четыре", translit: "chetyre", vi: "bốn", en: "four", pos: "numeral", level: "A1", topic: "core" },
  { ru: "пять", translit: "pyat", vi: "năm", en: "five", pos: "numeral", level: "A1", topic: "core" },
  { ru: "семь", translit: "sem", vi: "bảy", en: "seven", pos: "numeral", level: "A2", topic: "core" },
  { ru: "восемь", translit: "vosem", vi: "tám", en: "eight", pos: "numeral", level: "A2", topic: "core" },
  { ru: "десять", translit: "desyat", vi: "mười", en: "ten", pos: "numeral", level: "A2", topic: "core" },
  { ru: "сто", translit: "sto", vi: "một trăm", en: "hundred", pos: "numeral", level: "A2", topic: "core" },

  // ── people_family ────────────────────────────────────────────────────────
  { ru: "человек", translit: "chelovek", vi: "người", en: "person", pos: "noun", level: "A1", topic: "people_family" },
  { ru: "люди", translit: "lyudi", vi: "mọi người", en: "people", pos: "noun", level: "A1", topic: "people_family" },
  { ru: "мужчина", translit: "muzhchina", vi: "đàn ông", en: "man", pos: "noun", level: "A1", topic: "people_family" },
  { ru: "женщина", translit: "zhenshchina", vi: "phụ nữ", en: "woman", pos: "noun", level: "A1", topic: "people_family" },
  { ru: "ребёнок", translit: "rebyonok", vi: "trẻ em", en: "child", pos: "noun", level: "A1", topic: "people_family" },
  { ru: "семья", translit: "semya", vi: "gia đình", en: "family", pos: "noun", level: "A1", topic: "people_family" },
  { ru: "мать", translit: "mat", vi: "mẹ", en: "mother", pos: "noun", level: "A1", topic: "people_family" },
  { ru: "отец", translit: "otets", vi: "cha", en: "father", pos: "noun", level: "A1", topic: "people_family" },
  { ru: "сын", translit: "syn", vi: "con trai", en: "son", pos: "noun", level: "A1", topic: "people_family" },
  { ru: "дочь", translit: "doch", vi: "con gái", en: "daughter", pos: "noun", level: "A1", topic: "people_family" },
  { ru: "брат", translit: "brat", vi: "anh / em trai", en: "brother", pos: "noun", level: "A1", topic: "people_family" },
  { ru: "сестра", translit: "sestra", vi: "chị / em gái", en: "sister", pos: "noun", level: "A1", topic: "people_family" },
  { ru: "муж", translit: "muzh", vi: "chồng", en: "husband", pos: "noun", level: "A1", topic: "people_family" },
  { ru: "жена", translit: "zhena", vi: "vợ", en: "wife", pos: "noun", level: "A1", topic: "people_family" },
  { ru: "друг", translit: "drug", vi: "bạn (nam)", en: "friend", pos: "noun", level: "A1", topic: "people_family" },
  { ru: "сосед", translit: "sosed", vi: "hàng xóm", en: "neighbour", pos: "noun", level: "A2", topic: "people_family" },
  { ru: "коллега", translit: "kollega", vi: "đồng nghiệp", en: "colleague", pos: "noun", level: "A2", topic: "people_family" },
  { ru: "начальник", translit: "nachalnik", vi: "sếp", en: "boss", pos: "noun", level: "A2", topic: "people_family" },
  { ru: "учитель", translit: "uchitel", vi: "giáo viên", en: "teacher", pos: "noun", level: "A1", topic: "people_family" },
  { ru: "студент", translit: "student", vi: "sinh viên", en: "student", pos: "noun", level: "A1", topic: "people_family" },
  { ru: "врач", translit: "vrach", vi: "bác sĩ", en: "doctor", pos: "noun", level: "A1", topic: "people_family" },
  { ru: "водитель", translit: "voditel", vi: "tài xế", en: "driver", pos: "noun", level: "A2", topic: "people_family" },
  { ru: "клиент", translit: "kliyent", vi: "khách hàng", en: "client", pos: "noun", level: "B1", topic: "people_family" },

  // ── food ───────────────────────────────────────────────────────────────
  { ru: "еда", translit: "yeda", vi: "đồ ăn", en: "food", pos: "noun", level: "A1", topic: "food" },
  { ru: "вода", translit: "voda", vi: "nước", en: "water", pos: "noun", level: "A1", topic: "food" },
  { ru: "чай", translit: "chay", vi: "trà", en: "tea", pos: "noun", level: "A1", topic: "food" },
  { ru: "кофе", translit: "kofe", vi: "cà phê", en: "coffee", pos: "noun", level: "A1", topic: "food" },
  { ru: "молоко", translit: "moloko", vi: "sữa", en: "milk", pos: "noun", level: "A1", topic: "food" },
  { ru: "хлеб", translit: "khleb", vi: "bánh mì", en: "bread", pos: "noun", level: "A1", topic: "food" },
  { ru: "сыр", translit: "syr", vi: "phô mai", en: "cheese", pos: "noun", level: "A1", topic: "food" },
  { ru: "яйцо", translit: "yaytso", vi: "trứng", en: "egg", pos: "noun", level: "A1", topic: "food" },
  { ru: "мясо", translit: "myaso", vi: "thịt", en: "meat", pos: "noun", level: "A1", topic: "food" },
  { ru: "рыба", translit: "ryba", vi: "cá", en: "fish", pos: "noun", level: "A1", topic: "food" },
  { ru: "суп", translit: "sup", vi: "súp", en: "soup", pos: "noun", level: "A1", topic: "food" },
  { ru: "рис", translit: "ris", vi: "cơm / gạo", en: "rice", pos: "noun", level: "A1", topic: "food" },
  { ru: "фрукт", translit: "frukt", vi: "trái cây", en: "fruit", pos: "noun", level: "A1", topic: "food" },
  { ru: "яблоко", translit: "yabloko", vi: "táo", en: "apple", pos: "noun", level: "A1", topic: "food" },
  { ru: "овощ", translit: "ovoshch", vi: "rau củ", en: "vegetable", pos: "noun", level: "A2", topic: "food" },
  { ru: "соль", translit: "sol", vi: "muối", en: "salt", pos: "noun", level: "A1", topic: "food" },
  { ru: "сахар", translit: "sakhar", vi: "đường", en: "sugar", pos: "noun", level: "A1", topic: "food" },
  { ru: "завтрак", translit: "zavtrak", vi: "bữa sáng", en: "breakfast", pos: "noun", level: "A1", topic: "food" },
  { ru: "обед", translit: "obed", vi: "bữa trưa", en: "lunch", pos: "noun", level: "A1", topic: "food" },
  { ru: "ужин", translit: "uzhin", vi: "bữa tối", en: "dinner", pos: "noun", level: "A1", topic: "food" },
  { ru: "меню", translit: "menyu", vi: "thực đơn", en: "menu", pos: "noun", level: "A2", topic: "food" },
  { ru: "счёт", translit: "schyot", vi: "hóa đơn", en: "bill / check", pos: "noun", level: "A2", topic: "food" },
  { ru: "тарелка", translit: "tarelka", vi: "đĩa", en: "plate", pos: "noun", level: "A2", topic: "food" },
  { ru: "ложка", translit: "lozhka", vi: "muỗng", en: "spoon", pos: "noun", level: "A2", topic: "food" },

  // ── time ─────────────────────────────────────────────────────────────────
  { ru: "время", translit: "vremya", vi: "thời gian", en: "time", pos: "noun", level: "A1", topic: "time" },
  { ru: "день", translit: "den", vi: "ngày", en: "day", pos: "noun", level: "A1", topic: "time" },
  { ru: "ночь", translit: "noch", vi: "đêm", en: "night", pos: "noun", level: "A1", topic: "time" },
  { ru: "утро", translit: "utro", vi: "buổi sáng", en: "morning", pos: "noun", level: "A1", topic: "time" },
  { ru: "вечер", translit: "vecher", vi: "buổi tối", en: "evening", pos: "noun", level: "A1", topic: "time" },
  { ru: "час", translit: "chas", vi: "giờ", en: "hour", pos: "noun", level: "A1", topic: "time" },
  { ru: "минута", translit: "minuta", vi: "phút", en: "minute", pos: "noun", level: "A1", topic: "time" },
  { ru: "неделя", translit: "nedelya", vi: "tuần", en: "week", pos: "noun", level: "A1", topic: "time" },
  { ru: "месяц", translit: "mesyats", vi: "tháng", en: "month", pos: "noun", level: "A1", topic: "time" },
  { ru: "год", translit: "god", vi: "năm", en: "year", pos: "noun", level: "A1", topic: "time" },
  { ru: "сегодня", translit: "segodnya", vi: "hôm nay", en: "today", pos: "adverb", level: "A1", topic: "time" },
  { ru: "завтра", translit: "zavtra", vi: "ngày mai", en: "tomorrow", pos: "adverb", level: "A1", topic: "time" },
  { ru: "вчера", translit: "vchera", vi: "hôm qua", en: "yesterday", pos: "adverb", level: "A1", topic: "time" },
  { ru: "рано", translit: "rano", vi: "sớm", en: "early", pos: "adverb", level: "A2", topic: "time" },
  { ru: "поздно", translit: "pozdno", vi: "muộn", en: "late", pos: "adverb", level: "A2", topic: "time" },
  { ru: "понедельник", translit: "ponedelnik", vi: "thứ hai", en: "Monday", pos: "noun", level: "A2", topic: "time" },
  { ru: "суббота", translit: "subbota", vi: "thứ bảy", en: "Saturday", pos: "noun", level: "A2", topic: "time" },
  { ru: "воскресенье", translit: "voskresenye", vi: "chủ nhật", en: "Sunday", pos: "noun", level: "A2", topic: "time" },

  // ── travel_transport ──────────────────────────────────────────────────────
  { ru: "машина", translit: "mashina", vi: "xe hơi", en: "car", pos: "noun", level: "A1", topic: "travel_transport" },
  { ru: "автобус", translit: "avtobus", vi: "xe buýt", en: "bus", pos: "noun", level: "A1", topic: "travel_transport" },
  { ru: "поезд", translit: "poyezd", vi: "tàu hỏa", en: "train", pos: "noun", level: "A1", topic: "travel_transport" },
  { ru: "самолёт", translit: "samolyot", vi: "máy bay", en: "airplane", pos: "noun", level: "A1", topic: "travel_transport" },
  { ru: "такси", translit: "taksi", vi: "taxi", en: "taxi", pos: "noun", level: "A1", topic: "travel_transport" },
  { ru: "билет", translit: "bilet", vi: "vé", en: "ticket", pos: "noun", level: "A1", topic: "travel_transport" },
  { ru: "паспорт", translit: "pasport", vi: "hộ chiếu", en: "passport", pos: "noun", level: "A1", topic: "travel_transport" },
  { ru: "виза", translit: "viza", vi: "thị thực", en: "visa", pos: "noun", level: "A2", topic: "travel_transport" },
  { ru: "багаж", translit: "bagazh", vi: "hành lý", en: "luggage", pos: "noun", level: "A2", topic: "travel_transport" },
  { ru: "карта", translit: "karta", vi: "bản đồ / thẻ", en: "map / card", pos: "noun", level: "A1", topic: "travel_transport" },
  { ru: "дорога", translit: "doroga", vi: "con đường", en: "road", pos: "noun", level: "A1", topic: "travel_transport" },
  { ru: "поездка", translit: "poyezdka", vi: "chuyến đi", en: "trip", pos: "noun", level: "A2", topic: "travel_transport" },
  { ru: "граница", translit: "granitsa", vi: "biên giới", en: "border", pos: "noun", level: "B1", topic: "travel_transport" },
  { ru: "налево", translit: "nalevo", vi: "sang trái", en: "to the left", pos: "adverb", level: "A1", topic: "travel_transport" },
  { ru: "направо", translit: "napravo", vi: "sang phải", en: "to the right", pos: "adverb", level: "A1", topic: "travel_transport" },
  { ru: "прямо", translit: "pryamo", vi: "đi thẳng", en: "straight ahead", pos: "adverb", level: "A1", topic: "travel_transport" },
  { ru: "близко", translit: "blizko", vi: "gần", en: "near", pos: "adverb", level: "A1", topic: "travel_transport" },
  { ru: "далеко", translit: "daleko", vi: "xa", en: "far", pos: "adverb", level: "A1", topic: "travel_transport" },

  // ── body_health ──────────────────────────────────────────────────────────
  { ru: "голова", translit: "golova", vi: "đầu", en: "head", pos: "noun", level: "A1", topic: "body_health" },
  { ru: "глаз", translit: "glaz", vi: "mắt", en: "eye", pos: "noun", level: "A1", topic: "body_health" },
  { ru: "рука", translit: "ruka", vi: "tay / cánh tay", en: "hand / arm", pos: "noun", level: "A1", topic: "body_health" },
  { ru: "нога", translit: "noga", vi: "chân", en: "leg / foot", pos: "noun", level: "A1", topic: "body_health" },
  { ru: "сердце", translit: "serdtse", vi: "tim", en: "heart", pos: "noun", level: "A2", topic: "body_health" },
  { ru: "здоровье", translit: "zdorovye", vi: "sức khỏe", en: "health", pos: "noun", level: "A2", topic: "body_health" },
  { ru: "болезнь", translit: "bolezn", vi: "bệnh", en: "illness", pos: "noun", level: "B1", topic: "body_health" },
  { ru: "боль", translit: "bol", vi: "đau", en: "pain", pos: "noun", level: "A2", topic: "body_health" },
  { ru: "лекарство", translit: "lekarstvo", vi: "thuốc", en: "medicine", pos: "noun", level: "A2", topic: "body_health" },
  { ru: "температура", translit: "temperatura", vi: "nhiệt độ / sốt", en: "temperature / fever", pos: "noun", level: "A2", topic: "body_health" },
  { ru: "помощь", translit: "pomoshch", vi: "sự giúp đỡ", en: "help", pos: "noun", level: "A1", topic: "body_health" },
  { ru: "опасность", translit: "opasnost", vi: "nguy hiểm", en: "danger", pos: "noun", level: "B1", topic: "body_health" },
  { ru: "жизнь", translit: "zhizn", vi: "cuộc sống", en: "life", pos: "noun", level: "A2", topic: "body_health" },

  // ── home_city ────────────────────────────────────────────────────────────
  { ru: "дом", translit: "dom", vi: "nhà", en: "house / home", pos: "noun", level: "A1", topic: "home_city" },
  { ru: "квартира", translit: "kvartira", vi: "căn hộ", en: "apartment", pos: "noun", level: "A1", topic: "home_city" },
  { ru: "комната", translit: "komnata", vi: "phòng", en: "room", pos: "noun", level: "A1", topic: "home_city" },
  { ru: "дверь", translit: "dver", vi: "cửa", en: "door", pos: "noun", level: "A1", topic: "home_city" },
  { ru: "окно", translit: "okno", vi: "cửa sổ", en: "window", pos: "noun", level: "A1", topic: "home_city" },
  { ru: "стол", translit: "stol", vi: "bàn", en: "table", pos: "noun", level: "A1", topic: "home_city" },
  { ru: "стул", translit: "stul", vi: "ghế", en: "chair", pos: "noun", level: "A1", topic: "home_city" },
  { ru: "ключ", translit: "klyuch", vi: "chìa khóa", en: "key", pos: "noun", level: "A1", topic: "home_city" },
  { ru: "адрес", translit: "adres", vi: "địa chỉ", en: "address", pos: "noun", level: "A1", topic: "home_city" },
  { ru: "город", translit: "gorod", vi: "thành phố", en: "city", pos: "noun", level: "A1", topic: "home_city" },
  { ru: "улица", translit: "ulitsa", vi: "đường phố", en: "street", pos: "noun", level: "A1", topic: "home_city" },
  { ru: "магазин", translit: "magazin", vi: "cửa hàng", en: "shop", pos: "noun", level: "A1", topic: "home_city" },
  { ru: "рынок", translit: "rynok", vi: "chợ", en: "market", pos: "noun", level: "A2", topic: "home_city" },
  { ru: "банк", translit: "bank", vi: "ngân hàng", en: "bank", pos: "noun", level: "A1", topic: "home_city" },
  { ru: "школа", translit: "shkola", vi: "trường học", en: "school", pos: "noun", level: "A1", topic: "home_city" },
  { ru: "больница", translit: "bolnitsa", vi: "bệnh viện", en: "hospital", pos: "noun", level: "A1", topic: "home_city" },
  { ru: "аптека", translit: "apteka", vi: "nhà thuốc", en: "pharmacy", pos: "noun", level: "A2", topic: "home_city" },
  { ru: "ресторан", translit: "restoran", vi: "nhà hàng", en: "restaurant", pos: "noun", level: "A1", topic: "home_city" },
  { ru: "гостиница", translit: "gostinitsa", vi: "khách sạn", en: "hotel", pos: "noun", level: "A2", topic: "home_city" },
  { ru: "станция", translit: "stantsiya", vi: "trạm / ga", en: "station", pos: "noun", level: "A2", topic: "home_city" },
  { ru: "аэропорт", translit: "aeroport", vi: "sân bay", en: "airport", pos: "noun", level: "A2", topic: "home_city" },
  { ru: "метро", translit: "metro", vi: "tàu điện ngầm", en: "metro", pos: "noun", level: "A2", topic: "home_city" },
  { ru: "место", translit: "mesto", vi: "nơi / chỗ", en: "place / seat", pos: "noun", level: "A1", topic: "home_city" },
  { ru: "страна", translit: "strana", vi: "đất nước", en: "country", pos: "noun", level: "A1", topic: "home_city" },

  // ── work_school ──────────────────────────────────────────────────────────
  { ru: "работа", translit: "rabota", vi: "công việc", en: "work / job", pos: "noun", level: "A1", topic: "work_school" },
  { ru: "дело", translit: "delo", vi: "việc / chuyện", en: "matter / business", pos: "noun", level: "A1", topic: "work_school" },
  { ru: "офис", translit: "ofis", vi: "văn phòng", en: "office", pos: "noun", level: "A2", topic: "work_school" },
  { ru: "компания", translit: "kompaniya", vi: "công ty", en: "company", pos: "noun", level: "A2", topic: "work_school" },
  { ru: "план", translit: "plan", vi: "kế hoạch", en: "plan", pos: "noun", level: "A2", topic: "work_school" },
  { ru: "цель", translit: "tsel", vi: "mục tiêu", en: "goal", pos: "noun", level: "B1", topic: "work_school" },
  { ru: "проблема", translit: "problema", vi: "vấn đề", en: "problem", pos: "noun", level: "A1", topic: "work_school" },
  { ru: "вопрос", translit: "vopros", vi: "câu hỏi", en: "question", pos: "noun", level: "A1", topic: "work_school" },
  { ru: "ответ", translit: "otvet", vi: "câu trả lời", en: "answer", pos: "noun", level: "A1", topic: "work_school" },
  { ru: "встреча", translit: "vstrecha", vi: "cuộc gặp / họp", en: "meeting", pos: "noun", level: "A2", topic: "work_school" },
  { ru: "документ", translit: "dokument", vi: "tài liệu", en: "document", pos: "noun", level: "A2", topic: "work_school" },
  { ru: "письмо", translit: "pismo", vi: "lá thư", en: "letter", pos: "noun", level: "A1", topic: "work_school" },
  { ru: "деньги", translit: "dengi", vi: "tiền", en: "money", pos: "noun", level: "A1", topic: "work_school" },
  { ru: "цена", translit: "tsena", vi: "giá", en: "price", pos: "noun", level: "A1", topic: "work_school" },
  { ru: "договор", translit: "dogovor", vi: "hợp đồng", en: "contract", pos: "noun", level: "B1", topic: "work_school" },
  { ru: "ошибка", translit: "oshibka", vi: "lỗi", en: "mistake", pos: "noun", level: "A2", topic: "work_school" },
  { ru: "урок", translit: "urok", vi: "bài học", en: "lesson", pos: "noun", level: "A1", topic: "work_school" },
  { ru: "книга", translit: "kniga", vi: "sách", en: "book", pos: "noun", level: "A1", topic: "work_school" },
  { ru: "язык", translit: "yazyk", vi: "ngôn ngữ / lưỡi", en: "language / tongue", pos: "noun", level: "A1", topic: "work_school" },
  { ru: "слово", translit: "slovo", vi: "từ", en: "word", pos: "noun", level: "A1", topic: "work_school" },
  { ru: "пример", translit: "primer", vi: "ví dụ", en: "example", pos: "noun", level: "A2", topic: "work_school" },
  { ru: "экзамен", translit: "ekzamen", vi: "kỳ thi", en: "exam", pos: "noun", level: "A2", topic: "work_school" },

  // ── nature ───────────────────────────────────────────────────────────────
  { ru: "земля", translit: "zemlya", vi: "đất / Trái Đất", en: "earth / land", pos: "noun", level: "A1", topic: "nature" },
  { ru: "небо", translit: "nebo", vi: "bầu trời", en: "sky", pos: "noun", level: "A1", topic: "nature" },
  { ru: "солнце", translit: "solntse", vi: "mặt trời", en: "sun", pos: "noun", level: "A1", topic: "nature" },
  { ru: "дождь", translit: "dozhd", vi: "mưa", en: "rain", pos: "noun", level: "A1", topic: "nature" },
  { ru: "снег", translit: "sneg", vi: "tuyết", en: "snow", pos: "noun", level: "A1", topic: "nature" },
  { ru: "ветер", translit: "veter", vi: "gió", en: "wind", pos: "noun", level: "A2", topic: "nature" },
  { ru: "погода", translit: "pogoda", vi: "thời tiết", en: "weather", pos: "noun", level: "A1", topic: "nature" },
  { ru: "дерево", translit: "derevo", vi: "cây", en: "tree", pos: "noun", level: "A1", topic: "nature" },
  { ru: "цветок", translit: "tsvetok", vi: "hoa", en: "flower", pos: "noun", level: "A2", topic: "nature" },
  { ru: "собака", translit: "sobaka", vi: "chó", en: "dog", pos: "noun", level: "A1", topic: "nature" },
  { ru: "кошка", translit: "koshka", vi: "mèo", en: "cat", pos: "noun", level: "A1", topic: "nature" },
  { ru: "птица", translit: "ptitsa", vi: "chim", en: "bird", pos: "noun", level: "A2", topic: "nature" },
  { ru: "море", translit: "more", vi: "biển", en: "sea", pos: "noun", level: "A1", topic: "nature" },
  { ru: "река", translit: "reka", vi: "sông", en: "river", pos: "noun", level: "A2", topic: "nature" },
  { ru: "лес", translit: "les", vi: "rừng", en: "forest", pos: "noun", level: "A2", topic: "nature" },

  // ── technology_media ──────────────────────────────────────────────────────
  { ru: "телефон", translit: "telefon", vi: "điện thoại", en: "phone", pos: "noun", level: "A1", topic: "technology_media" },
  { ru: "компьютер", translit: "kompyuter", vi: "máy tính", en: "computer", pos: "noun", level: "A1", topic: "technology_media" },
  { ru: "экран", translit: "ekran", vi: "màn hình", en: "screen", pos: "noun", level: "A2", topic: "technology_media" },
  { ru: "интернет", translit: "internet", vi: "internet", en: "internet", pos: "noun", level: "A1", topic: "technology_media" },
  { ru: "сайт", translit: "sayt", vi: "trang web", en: "website", pos: "noun", level: "A2", topic: "technology_media" },
  { ru: "пароль", translit: "parol", vi: "mật khẩu", en: "password", pos: "noun", level: "A2", topic: "technology_media" },
  { ru: "файл", translit: "fayl", vi: "tệp", en: "file", pos: "noun", level: "A2", topic: "technology_media" },
  { ru: "программа", translit: "programma", vi: "chương trình", en: "program", pos: "noun", level: "A2", topic: "technology_media" },
  { ru: "приложение", translit: "prilozheniye", vi: "ứng dụng", en: "application", pos: "noun", level: "B1", topic: "technology_media" },
  { ru: "новость", translit: "novost", vi: "tin tức", en: "news", pos: "noun", level: "A2", topic: "technology_media" },
  { ru: "газета", translit: "gazeta", vi: "báo", en: "newspaper", pos: "noun", level: "A2", topic: "technology_media" },
  { ru: "фильм", translit: "film", vi: "phim", en: "film / movie", pos: "noun", level: "A1", topic: "technology_media" },
  { ru: "музыка", translit: "muzyka", vi: "âm nhạc", en: "music", pos: "noun", level: "A1", topic: "technology_media" },
  { ru: "песня", translit: "pesnya", vi: "bài hát", en: "song", pos: "noun", level: "A2", topic: "technology_media" },
  { ru: "игра", translit: "igra", vi: "trò chơi", en: "game", pos: "noun", level: "A1", topic: "technology_media" },

  // ── core verbs (high frequency) ──────────────────────────────────────────
  { ru: "делать", translit: "delat", vi: "làm", en: "to do / make", pos: "verb", level: "A1", topic: "core" },
  { ru: "говорить", translit: "govorit", vi: "nói", en: "to speak / say", pos: "verb", level: "A1", topic: "core" },
  { ru: "знать", translit: "znat", vi: "biết", en: "to know", pos: "verb", level: "A1", topic: "core" },
  { ru: "думать", translit: "dumat", vi: "nghĩ", en: "to think", pos: "verb", level: "A1", topic: "core" },
  { ru: "понимать", translit: "ponimat", vi: "hiểu", en: "to understand", pos: "verb", level: "A1", topic: "core" },
  { ru: "видеть", translit: "videt", vi: "thấy", en: "to see", pos: "verb", level: "A1", topic: "core" },
  { ru: "смотреть", translit: "smotret", vi: "xem / nhìn", en: "to watch / look", pos: "verb", level: "A1", topic: "core" },
  { ru: "слушать", translit: "slushat", vi: "nghe", en: "to listen", pos: "verb", level: "A1", topic: "core" },
  { ru: "читать", translit: "chitat", vi: "đọc", en: "to read", pos: "verb", level: "A1", topic: "core" },
  { ru: "писать", translit: "pisat", vi: "viết", en: "to write", pos: "verb", level: "A1", topic: "core" },
  { ru: "идти", translit: "idti", vi: "đi bộ (một hướng)", en: "to go on foot (one direction)", pos: "verb", level: "A1", topic: "core" },
  { ru: "ходить", translit: "khodit", vi: "đi bộ (thường xuyên)", en: "to go on foot (repeatedly)", pos: "verb", level: "A1", topic: "core" },
  { ru: "ехать", translit: "yekhat", vi: "đi bằng xe (một hướng)", en: "to go by vehicle (one direction)", pos: "verb", level: "A1", topic: "core" },
  { ru: "жить", translit: "zhit", vi: "sống", en: "to live", pos: "verb", level: "A1", topic: "core" },
  { ru: "работать", translit: "rabotat", vi: "làm việc", en: "to work", pos: "verb", level: "A1", topic: "core" },
  { ru: "учиться", translit: "uchitsya", vi: "học", en: "to study", pos: "verb", level: "A1", topic: "core" },
  { ru: "любить", translit: "lyubit", vi: "yêu / thích", en: "to love / like", pos: "verb", level: "A1", topic: "core" },
  { ru: "хотеть", translit: "khotet", vi: "muốn", en: "to want", pos: "verb", level: "A1", topic: "core" },
  { ru: "мочь", translit: "moch", vi: "có thể", en: "to be able to", pos: "verb", level: "A1", topic: "core" },
  { ru: "есть", translit: "yest", vi: "ăn", en: "to eat", pos: "verb", level: "A1", topic: "core" },
  { ru: "пить", translit: "pit", vi: "uống", en: "to drink", pos: "verb", level: "A1", topic: "core" },
  { ru: "спать", translit: "spat", vi: "ngủ", en: "to sleep", pos: "verb", level: "A1", topic: "core" },
  { ru: "покупать", translit: "pokupat", vi: "mua", en: "to buy", pos: "verb", level: "A1", topic: "core" },
  { ru: "платить", translit: "platit", vi: "trả tiền", en: "to pay", pos: "verb", level: "A2", topic: "core" },
  { ru: "открывать", translit: "otkryvat", vi: "mở", en: "to open", pos: "verb", level: "A1", topic: "core" },
  { ru: "закрывать", translit: "zakryvat", vi: "đóng", en: "to close", pos: "verb", level: "A1", topic: "core" },
  { ru: "начинать", translit: "nachinat", vi: "bắt đầu", en: "to begin", pos: "verb", level: "A2", topic: "core" },
  { ru: "ждать", translit: "zhdat", vi: "chờ", en: "to wait", pos: "verb", level: "A1", topic: "core" },
  { ru: "искать", translit: "iskat", vi: "tìm", en: "to look for", pos: "verb", level: "A2", topic: "core" },
  { ru: "давать", translit: "davat", vi: "đưa / cho", en: "to give", pos: "verb", level: "A1", topic: "core" },
  { ru: "помогать", translit: "pomogat", vi: "giúp đỡ", en: "to help", pos: "verb", level: "A1", topic: "core" },
  { ru: "звонить", translit: "zvonit", vi: "gọi điện", en: "to call (phone)", pos: "verb", level: "A2", topic: "core" },

  // ── core adjectives (base masculine form) ────────────────────────────────
  { ru: "хороший", translit: "khoroshiy", vi: "tốt", en: "good", pos: "adjective", level: "A1", topic: "core" },
  { ru: "плохой", translit: "plokhoy", vi: "xấu / tệ", en: "bad", pos: "adjective", level: "A1", topic: "core" },
  { ru: "большой", translit: "bolshoy", vi: "to / lớn", en: "big", pos: "adjective", level: "A1", topic: "core" },
  { ru: "маленький", translit: "malenkiy", vi: "nhỏ", en: "small", pos: "adjective", level: "A1", topic: "core" },
  { ru: "новый", translit: "novyy", vi: "mới", en: "new", pos: "adjective", level: "A1", topic: "core" },
  { ru: "старый", translit: "staryy", vi: "cũ / già", en: "old", pos: "adjective", level: "A1", topic: "core" },
  { ru: "молодой", translit: "molodoy", vi: "trẻ", en: "young", pos: "adjective", level: "A1", topic: "core" },
  { ru: "красивый", translit: "krasivyy", vi: "đẹp", en: "beautiful", pos: "adjective", level: "A1", topic: "core" },
  { ru: "быстрый", translit: "bystryy", vi: "nhanh", en: "fast", pos: "adjective", level: "A1", topic: "core" },
  { ru: "медленный", translit: "medlennyy", vi: "chậm", en: "slow", pos: "adjective", level: "A1", topic: "core" },
  { ru: "дорогой", translit: "dorogoy", vi: "đắt / thân yêu", en: "expensive / dear", pos: "adjective", level: "A1", topic: "core" },
  { ru: "дешёвый", translit: "deshyovyy", vi: "rẻ", en: "cheap", pos: "adjective", level: "A2", topic: "core" },
  { ru: "лёгкий", translit: "lyogkiy", vi: "dễ / nhẹ", en: "easy / light", pos: "adjective", level: "A2", topic: "core" },
  { ru: "трудный", translit: "trudnyy", vi: "khó", en: "difficult", pos: "adjective", level: "A2", topic: "core" },
  { ru: "важный", translit: "vazhnyy", vi: "quan trọng", en: "important", pos: "adjective", level: "A2", topic: "core" },
  { ru: "простой", translit: "prostoy", vi: "đơn giản", en: "simple", pos: "adjective", level: "A2", topic: "core" },
];

/** Total curated entries. */
export const RUSSIAN_VOCABULARY_COUNT = RUSSIAN_VOCABULARY.length;

/** Distinct topics covered by the batch. */
export const RUSSIAN_VOCABULARY_TOPICS: ReadonlyArray<RussianVocabTopic> = [
  "core",
  "people_family",
  "food",
  "time",
  "travel_transport",
  "body_health",
  "home_city",
  "work_school",
  "nature",
  "technology_media",
];

export function getRussianVocabularyByTopic(
  topic: RussianVocabTopic,
): RussianVocabItem[] {
  return RUSSIAN_VOCABULARY.filter((item) => item.topic === topic);
}

export function getRussianVocabularyByLevel(
  level: RussianVocabLevel,
): RussianVocabItem[] {
  return RUSSIAN_VOCABULARY.filter((item) => item.level === level);
}
