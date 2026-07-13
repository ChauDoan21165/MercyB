// src/languages/punjabi/thematicVocabularyDeck.ts
//
// Punjabi thematic vocabulary deck for Vietnamese-speaking and
// English-speaking learners. Gurmukhi is primary; romanization is a reading
// and search bridge. No audio, pronunciation scoring, or native-review claim.

export type PunjabiThematicVocabularyTheme =
  | "home"
  | "family"
  | "food"
  | "work"
  | "school"
  | "health"
  | "public_services"
  | "transport"
  | "housing"
  | "money"
  | "emotions"
  | "common_verbs";

export type PunjabiThematicVocabularyEntry = {
  cell_id?: string;
  id: string;
  theme: PunjabiThematicVocabularyTheme;
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
  exampleGurmukhi?: string;
  exampleRomanization?: string;
  example_vi?: string;
  example_en?: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
};

export type PunjabiThematicVocabularySection = {
  cell_id?: string;
  theme: PunjabiThematicVocabularyTheme;
  title_vi: string;
  title_en: string;
  purpose_vi: string;
  purpose_en: string;
  entries: ReadonlyArray<PunjabiThematicVocabularyEntry>;
};

export const PUNJABI_THEMATIC_VOCABULARY_SCOPE = {
  vi: "Bộ thẻ dùng Gurmukhi làm chính. Romanization giúp đọc và tìm kiếm, không phải phát âm chấm điểm. Shahmukhi chỉ được nhắc để nhận biết rằng Punjabi còn có hệ chữ khác; đây không phải khóa Shahmukhi đầy đủ. Native review được hoãn.",
  en: "This deck uses Gurmukhi as primary. Romanization supports reading and search, not pronunciation scoring. Shahmukhi is mentioned only so learners know Punjabi has another script; this is not a full Shahmukhi course. Native review is deferred.",
} as const;

const deck: ReadonlyArray<PunjabiThematicVocabularySection> = [
  {
    theme: "home",
    title_vi: "Nhà cửa",
    title_en: "Home",
    purpose_vi: "Từ vựng để nói về đồ vật và không gian trong nhà.",
    purpose_en: "Vocabulary for objects and spaces at home.",
    entries: [
      { id: "pa-theme-home-001", theme: "home", gurmukhi: "ਘਰ", romanization: "ghar", vi: "nhà", en: "home / house", exampleGurmukhi: "ਮੇਰਾ ਘਰ ਨੇੜੇ ਹੈ", exampleRomanization: "mera ghar nere hai", example_vi: "Nhà tôi ở gần.", example_en: "My home is nearby." },
      { id: "pa-theme-home-002", theme: "home", gurmukhi: "ਕਮਰਾ", romanization: "kamra", vi: "phòng", en: "room" },
      { id: "pa-theme-home-003", theme: "home", gurmukhi: "ਰਸੋਈ", romanization: "rasoi", vi: "nhà bếp", en: "kitchen" },
      { id: "pa-theme-home-004", theme: "home", gurmukhi: "ਦਰਵਾਜ਼ਾ", romanization: "darvaza", vi: "cửa ra vào", en: "door" },
      { id: "pa-theme-home-005", theme: "home", gurmukhi: "ਖਿੜਕੀ", romanization: "khirki", vi: "cửa sổ", en: "window", learnerTrap: { vi: "ਖ là kh bật hơi; đừng đọc như k thường.", en: "ਖ is aspirated kh; do not read it like plain k." } },
      { id: "pa-theme-home-006", theme: "home", gurmukhi: "ਬਿਸਤਰਾ", romanization: "bistara", vi: "giường", en: "bed" },
    ],
  },
  {
    theme: "family",
    title_vi: "Gia đình",
    title_en: "Family",
    purpose_vi: "Từ thân tộc cơ bản cho hội thoại hằng ngày.",
    purpose_en: "Core kinship words for everyday conversation.",
    entries: [
      { id: "pa-theme-family-001", theme: "family", gurmukhi: "ਪਰਿਵਾਰ", romanization: "parivaar", vi: "gia đình", en: "family" },
      { id: "pa-theme-family-002", theme: "family", gurmukhi: "ਮਾਂ", romanization: "maan", vi: "mẹ", en: "mother", learnerTrap: { vi: "ਂ báo mũi hóa; romanization có thể ghi maan hoặc man.", en: "ਂ marks nasalization; romanization may show maan or man." } },
      { id: "pa-theme-family-003", theme: "family", gurmukhi: "ਪਿਤਾ", romanization: "pita", vi: "cha", en: "father" },
      { id: "pa-theme-family-004", theme: "family", gurmukhi: "ਭਰਾ", romanization: "bhra", vi: "anh/em trai", en: "brother" },
      { id: "pa-theme-family-005", theme: "family", gurmukhi: "ਭੈਣ", romanization: "bhain", vi: "chị/em gái", en: "sister" },
      { id: "pa-theme-family-006", theme: "family", gurmukhi: "ਬੱਚਾ", romanization: "bachcha", vi: "đứa trẻ", en: "child" },
    ],
  },
  {
    theme: "food",
    title_vi: "Đồ ăn",
    title_en: "Food",
    purpose_vi: "Từ để gọi món, đi chợ và nói nhu cầu ăn uống.",
    purpose_en: "Words for ordering, shopping, and food needs.",
    entries: [
      { id: "pa-theme-food-001", theme: "food", gurmukhi: "ਖਾਣਾ", romanization: "khana", vi: "thức ăn / ăn", en: "food / to eat" },
      { id: "pa-theme-food-002", theme: "food", gurmukhi: "ਪਾਣੀ", romanization: "pani", vi: "nước", en: "water", exampleGurmukhi: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ", exampleRomanization: "mainu pani chahida hai", example_vi: "Tôi cần nước.", example_en: "I need water.", canadaPractical: true },
      { id: "pa-theme-food-003", theme: "food", gurmukhi: "ਚਾਹ", romanization: "chaah", vi: "trà", en: "tea" },
      { id: "pa-theme-food-004", theme: "food", gurmukhi: "ਰੋਟੀ", romanization: "roti", vi: "bánh roti", en: "roti / flatbread" },
      { id: "pa-theme-food-005", theme: "food", gurmukhi: "ਦਾਲ", romanization: "daal", vi: "đậu lăng nấu", en: "lentils / dal" },
      { id: "pa-theme-food-006", theme: "food", gurmukhi: "ਮਿੱਠਾ", romanization: "mittha", vi: "ngọt / đồ ngọt", en: "sweet", learnerTrap: { vi: "ੱ báo phụ âm mạnh; đừng bỏ qua khi đọc.", en: "ੱ marks a strengthened consonant; do not skip it when reading." } },
    ],
  },
  {
    theme: "work",
    title_vi: "Công việc",
    title_en: "Work",
    purpose_vi: "Từ dùng ở nơi làm việc và khi nói về nghề nghiệp.",
    purpose_en: "Words for workplace and employment conversations.",
    entries: [
      { id: "pa-theme-work-001", theme: "work", gurmukhi: "ਕੰਮ", romanization: "kamm", vi: "công việc", en: "work / job", canadaPractical: true },
      { id: "pa-theme-work-002", theme: "work", gurmukhi: "ਦਫ਼ਤਰ", romanization: "daftar", vi: "văn phòng", en: "office" },
      { id: "pa-theme-work-003", theme: "work", gurmukhi: "ਮਾਲਕ", romanization: "maalak", vi: "chủ / quản lý", en: "owner / boss" },
      { id: "pa-theme-work-004", theme: "work", gurmukhi: "ਮੀਟਿੰਗ", romanization: "meeting", vi: "cuộc họp", en: "meeting" },
      { id: "pa-theme-work-005", theme: "work", gurmukhi: "ਤਨਖਾਹ", romanization: "tankhah", vi: "lương", en: "salary / wages", learnerTrap: { vi: "ਤ là t răng; không giống ਟ quặt lưỡi.", en: "ਤ is dental t; it is not the same as retroflex ਟ." } },
      { id: "pa-theme-work-006", theme: "work", gurmukhi: "ਛੁੱਟੀ", romanization: "chhutti", vi: "ngày nghỉ / nghỉ phép", en: "day off / leave" },
    ],
  },
  {
    theme: "school",
    title_vi: "Trường học",
    title_en: "School",
    purpose_vi: "Từ dành cho lớp học, trẻ em và học tập cộng đồng.",
    purpose_en: "Words for classrooms, children, and community learning.",
    entries: [
      { id: "pa-theme-school-001", theme: "school", gurmukhi: "ਸਕੂਲ", romanization: "school", vi: "trường học", en: "school", canadaPractical: true },
      { id: "pa-theme-school-002", theme: "school", gurmukhi: "ਅਧਿਆਪਕ", romanization: "adhiaapak", vi: "giáo viên", en: "teacher" },
      { id: "pa-theme-school-003", theme: "school", gurmukhi: "ਵਿਦਿਆਰਥੀ", romanization: "vidiarathi", vi: "học sinh / sinh viên", en: "student" },
      { id: "pa-theme-school-004", theme: "school", gurmukhi: "ਕਿਤਾਬ", romanization: "kitaab", vi: "sách", en: "book" },
      { id: "pa-theme-school-005", theme: "school", gurmukhi: "ਕਲਾਸ", romanization: "kalaas", vi: "lớp học", en: "class" },
      { id: "pa-theme-school-006", theme: "school", gurmukhi: "ਹੋਮਵਰਕ", romanization: "homework", vi: "bài tập về nhà", en: "homework" },
    ],
  },
  {
    theme: "health",
    title_vi: "Sức khỏe",
    title_en: "Health",
    purpose_vi: "Từ cần cho phòng khám, nhà thuốc và tình huống cần giúp đỡ.",
    purpose_en: "Words for clinics, pharmacies, and help-seeking situations.",
    entries: [
      { id: "pa-theme-health-001", theme: "health", gurmukhi: "ਡਾਕਟਰ", romanization: "daaktar", vi: "bác sĩ", en: "doctor", canadaPractical: true },
      { id: "pa-theme-health-002", theme: "health", gurmukhi: "ਹਸਪਤਾਲ", romanization: "haspataal", vi: "bệnh viện", en: "hospital", canadaPractical: true },
      { id: "pa-theme-health-003", theme: "health", gurmukhi: "ਦਵਾਈ", romanization: "davai", vi: "thuốc", en: "medicine" },
      { id: "pa-theme-health-004", theme: "health", gurmukhi: "ਦਰਦ", romanization: "darad", vi: "đau", en: "pain" },
      { id: "pa-theme-health-005", theme: "health", gurmukhi: "ਬਿਮਾਰ", romanization: "bimaar", vi: "ốm / bệnh", en: "sick" },
      { id: "pa-theme-health-006", theme: "health", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy", vi: "nhà thuốc", en: "pharmacy", canadaPractical: true, learnerTrap: { vi: "ਫ có thể được tìm bằng ph hoặc f.", en: "ਫ may be searched as ph or f." } },
    ],
  },
  {
    theme: "public_services",
    title_vi: "Dịch vụ công",
    title_en: "Public Services",
    purpose_vi: "Từ để đọc biển hiệu và hỏi đường trong dịch vụ công.",
    purpose_en: "Words for reading signs and asking about public services.",
    entries: [
      { id: "pa-theme-public-001", theme: "public_services", gurmukhi: "ਪੁਲਿਸ", romanization: "pulis", vi: "cảnh sát", en: "police", canadaPractical: true },
      { id: "pa-theme-public-002", theme: "public_services", gurmukhi: "ਲਾਇਬ੍ਰੇਰੀ", romanization: "library", vi: "thư viện", en: "library", canadaPractical: true },
      { id: "pa-theme-public-003", theme: "public_services", gurmukhi: "ਡਾਕ ਘਰ", romanization: "daak ghar", vi: "bưu điện", en: "post office", canadaPractical: true },
      { id: "pa-theme-public-004", theme: "public_services", gurmukhi: "ਸਰਕਾਰ", romanization: "sarkaar", vi: "chính phủ", en: "government" },
      { id: "pa-theme-public-005", theme: "public_services", gurmukhi: "ਫਾਰਮ", romanization: "form", vi: "mẫu đơn", en: "form", canadaPractical: true },
      { id: "pa-theme-public-006", theme: "public_services", gurmukhi: "ਮਦਦ", romanization: "madad", vi: "sự giúp đỡ", en: "help", exampleGurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", exampleRomanization: "mainu madad chahidi hai", example_vi: "Tôi cần giúp đỡ.", example_en: "I need help.", canadaPractical: true },
    ],
  },
  {
    theme: "transport",
    title_vi: "Giao thông",
    title_en: "Transport",
    purpose_vi: "Từ để đi xe buýt, tàu và hỏi điểm đến.",
    purpose_en: "Words for buses, trains, and destinations.",
    entries: [
      { id: "pa-theme-transport-001", theme: "transport", gurmukhi: "ਬੱਸ", romanization: "bus", vi: "xe buýt", en: "bus", canadaPractical: true },
      { id: "pa-theme-transport-002", theme: "transport", gurmukhi: "ਰੇਲ", romanization: "rail", vi: "tàu", en: "train" },
      { id: "pa-theme-transport-003", theme: "transport", gurmukhi: "ਸਟੇਸ਼ਨ", romanization: "station", vi: "nhà ga / trạm", en: "station", learnerTrap: { vi: "ਸ਼ thường được romanize là sh.", en: "ਸ਼ is often romanized as sh." } },
      { id: "pa-theme-transport-004", theme: "transport", gurmukhi: "ਟਿਕਟ", romanization: "tikat", vi: "vé", en: "ticket", canadaPractical: true },
      { id: "pa-theme-transport-005", theme: "transport", gurmukhi: "ਹਵਾਈ ਅੱਡਾ", romanization: "havaai adda", vi: "sân bay", en: "airport", canadaPractical: true },
      { id: "pa-theme-transport-006", theme: "transport", gurmukhi: "ਕਿੱਥੇ", romanization: "kitthe", vi: "ở đâu", en: "where", learnerTrap: { vi: "ਿ viết trước nhưng đọc sau phụ âm.", en: "ਿ is written before but read after the consonant." } },
    ],
  },
  {
    theme: "housing",
    title_vi: "Nhà ở",
    title_en: "Housing",
    purpose_vi: "Từ khi thuê nhà, báo sự cố hoặc nói về tiện ích.",
    purpose_en: "Words for renting, reporting issues, and utilities.",
    entries: [
      { id: "pa-theme-housing-001", theme: "housing", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", vi: "tiền thuê", en: "rent", canadaPractical: true },
      { id: "pa-theme-housing-002", theme: "housing", gurmukhi: "ਅਪਾਰਟਮੈਂਟ", romanization: "apartment", vi: "căn hộ", en: "apartment", canadaPractical: true },
      { id: "pa-theme-housing-003", theme: "housing", gurmukhi: "ਮਕਾਨ", romanization: "makaan", vi: "nhà / căn nhà", en: "house / dwelling" },
      { id: "pa-theme-housing-004", theme: "housing", gurmukhi: "ਬਿਜਲੀ", romanization: "bijli", vi: "điện", en: "electricity" },
      { id: "pa-theme-housing-005", theme: "housing", gurmukhi: "ਪਾਣੀ", romanization: "pani", vi: "nước", en: "water / utility" },
      { id: "pa-theme-housing-006", theme: "housing", gurmukhi: "ਮੁਰੰਮਤ", romanization: "murammat", vi: "sửa chữa", en: "repair / maintenance", canadaPractical: true },
    ],
  },
  {
    theme: "money",
    title_vi: "Tiền bạc",
    title_en: "Money",
    purpose_vi: "Từ cần khi mua sắm, ngân hàng và thanh toán.",
    purpose_en: "Words needed for shopping, banking, and payments.",
    entries: [
      { id: "pa-theme-money-001", theme: "money", gurmukhi: "ਪੈਸੇ", romanization: "paise", vi: "tiền", en: "money" },
      { id: "pa-theme-money-002", theme: "money", gurmukhi: "ਡਾਲਰ", romanization: "dollar", vi: "đô la", en: "dollar", canadaPractical: true },
      { id: "pa-theme-money-003", theme: "money", gurmukhi: "ਬੈਂਕ", romanization: "bank", vi: "ngân hàng", en: "bank", canadaPractical: true, learnerTrap: { vi: "ੈਂ không giống chính tả tiếng Việt; hãy nhận diện nguyên cụm Gurmukhi.", en: "ੈਂ does not map neatly to Vietnamese spelling; recognize the whole Gurmukhi chunk." } },
      { id: "pa-theme-money-004", theme: "money", gurmukhi: "ਕਾਰਡ", romanization: "card", vi: "thẻ", en: "card" },
      { id: "pa-theme-money-005", theme: "money", gurmukhi: "ਨਕਦ", romanization: "nakad", vi: "tiền mặt", en: "cash" },
      { id: "pa-theme-money-006", theme: "money", gurmukhi: "ਮਹਿੰਗਾ", romanization: "mahinga", vi: "đắt", en: "expensive" },
    ],
  },
  {
    theme: "emotions",
    title_vi: "Cảm xúc",
    title_en: "Emotions",
    purpose_vi: "Từ để nói cảm giác và phản ứng xã hội cơ bản.",
    purpose_en: "Words for feelings and basic social reactions.",
    entries: [
      { id: "pa-theme-emotion-001", theme: "emotions", gurmukhi: "ਖੁਸ਼", romanization: "khush", vi: "vui", en: "happy" },
      { id: "pa-theme-emotion-002", theme: "emotions", gurmukhi: "ਉਦਾਸ", romanization: "udaas", vi: "buồn", en: "sad" },
      { id: "pa-theme-emotion-003", theme: "emotions", gurmukhi: "ਗੁੱਸਾ", romanization: "gussa", vi: "giận", en: "anger" },
      { id: "pa-theme-emotion-004", theme: "emotions", gurmukhi: "ਡਰ", romanization: "dar", vi: "sợ", en: "fear" },
      { id: "pa-theme-emotion-005", theme: "emotions", gurmukhi: "ਥੱਕਿਆ", romanization: "thakkia", vi: "mệt", en: "tired" },
      { id: "pa-theme-emotion-006", theme: "emotions", gurmukhi: "ਚਿੰਤਾ", romanization: "chinta", vi: "lo lắng", en: "worry" },
    ],
  },
  {
    theme: "common_verbs",
    title_vi: "Động từ thông dụng",
    title_en: "Common Verbs",
    purpose_vi: "Động từ lõi để tự tạo câu ngắn.",
    purpose_en: "Core verbs for building short sentences.",
    entries: [
      { id: "pa-theme-verb-001", theme: "common_verbs", gurmukhi: "ਹੋਣਾ", romanization: "hona", vi: "là / tồn tại", en: "to be" },
      { id: "pa-theme-verb-002", theme: "common_verbs", gurmukhi: "ਕਰਨਾ", romanization: "karna", vi: "làm", en: "to do / make" },
      { id: "pa-theme-verb-003", theme: "common_verbs", gurmukhi: "ਜਾਣਾ", romanization: "jana", vi: "đi", en: "to go" },
      { id: "pa-theme-verb-004", theme: "common_verbs", gurmukhi: "ਆਉਣਾ", romanization: "auna", vi: "đến", en: "to come" },
      { id: "pa-theme-verb-005", theme: "common_verbs", gurmukhi: "ਬੋਲਣਾ", romanization: "bolna", vi: "nói", en: "to speak" },
      { id: "pa-theme-verb-006", theme: "common_verbs", gurmukhi: "ਸਮਝਣਾ", romanization: "samajhna", vi: "hiểu", en: "to understand", exampleGurmukhi: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ", exampleRomanization: "mainu samajh nahi aai", example_vi: "Tôi chưa hiểu.", example_en: "I did not understand.", canadaPractical: true },
    ],
  },
];

export const PUNJABI_THEMATIC_VOCABULARY_DECK = deck;

export const PUNJABI_THEMATIC_VOCABULARY_ENTRIES: ReadonlyArray<PunjabiThematicVocabularyEntry> =
  deck.flatMap((section) => section.entries);

export default PUNJABI_THEMATIC_VOCABULARY_DECK;
