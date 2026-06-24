// src/languages/punjabi/gurmukhiReadingLadder.ts
//
// Gurmukhi reading ladder for Vietnamese-speaking and English-speaking
// Punjabi learners. Gurmukhi is primary; romanization is a bridge only.
// No audio, pronunciation scoring, or native-review claim.

export type PunjabiReadingLadderStage =
  | "letters"
  | "vowel_signs"
  | "syllables"
  | "addak"
  | "nasal_marks"
  | "word_reading"
  | "short_phrases"
  | "canada_survival"
  | "romanization_bridge"
  | "shahmukhi_awareness";

export type PunjabiReadingLadderEntry = {
  id: string;
  stage: PunjabiReadingLadderStage;
  gurmukhi: string;
  romanization?: string;
  vi: string;
  en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
};

export type PunjabiReadingLadderSection = {
  stage: PunjabiReadingLadderStage;
  title_vi: string;
  title_en: string;
  goal_vi: string;
  goal_en: string;
  entries: ReadonlyArray<PunjabiReadingLadderEntry>;
};

const sections: ReadonlyArray<PunjabiReadingLadderSection> = [
  {
    stage: "letters",
    title_vi: "Bậc 1: Nhận diện chữ cái",
    title_en: "Step 1: Letter recognition",
    goal_vi: "Nhìn chữ Gurmukhi trước, dùng romanization chỉ để kiểm tra.",
    goal_en: "Look at the Gurmukhi first and use romanization only to check.",
    entries: [
      { id: "pa-ladder-letter-001", stage: "letters", gurmukhi: "ਅ", romanization: "a", vi: "ký tự mang nguyên âm đầu; gặp trong ਅੱਜ", en: "initial vowel carrier; seen in ਅੱਜ" },
      { id: "pa-ladder-letter-002", stage: "letters", gurmukhi: "ਆ", romanization: "aa", vi: "âm aa dài; gặp trong ਆਉਣਾ", en: "long aa sound; seen in ਆਉਣਾ" },
      { id: "pa-ladder-letter-003", stage: "letters", gurmukhi: "ਇ", romanization: "i", vi: "nguyên âm i đầu; gặp trong ਇਹ", en: "initial i vowel; seen in ਇਹ" },
      { id: "pa-ladder-letter-004", stage: "letters", gurmukhi: "ਉ", romanization: "u/o", vi: "ký tự nguyên âm đầu; gặp trong ਉਹ", en: "initial vowel carrier; seen in ਉਹ" },
      { id: "pa-ladder-letter-005", stage: "letters", gurmukhi: "ਕ", romanization: "ka", vi: "phụ âm k với nguyên âm mặc định gần a", en: "k consonant with an inherent a-like vowel" },
      { id: "pa-ladder-letter-006", stage: "letters", gurmukhi: "ਖ", romanization: "kha", vi: "k bật hơi; đọc khác ਕ", en: "aspirated k; read differently from ਕ", learnerTrap: { vi: "Đừng xem kh là hai chữ Latin k+h trong Punjabi.", en: "Do not treat kh as ordinary Latin k+h in Punjabi." } },
      { id: "pa-ladder-letter-007", stage: "letters", gurmukhi: "ਗ", romanization: "ga", vi: "phụ âm g; gặp trong ਗਰਮ", en: "g consonant; seen in ਗਰਮ" },
      { id: "pa-ladder-letter-008", stage: "letters", gurmukhi: "ਚ", romanization: "cha", vi: "phụ âm ch; gặp trong ਚਾਹ", en: "ch consonant; seen in ਚਾਹ" },
      { id: "pa-ladder-letter-009", stage: "letters", gurmukhi: "ਜ", romanization: "ja", vi: "phụ âm j; gặp trong ਜਾਣਾ", en: "j consonant; seen in ਜਾਣਾ" },
      { id: "pa-ladder-letter-010", stage: "letters", gurmukhi: "ਤ", romanization: "ta", vi: "t răng; khác ਟ quặt lưỡi", en: "dental t; different from retroflex ਟ", learnerTrap: { vi: "Romanization t không đủ để phân biệt ਤ và ਟ.", en: "Romanized t is not enough to distinguish ਤ and ਟ." } },
      { id: "pa-ladder-letter-011", stage: "letters", gurmukhi: "ਦ", romanization: "da", vi: "d răng; gặp trong ਦਿਨ", en: "dental d; seen in ਦਿਨ" },
      { id: "pa-ladder-letter-012", stage: "letters", gurmukhi: "ਪ", romanization: "pa", vi: "phụ âm p; gặp trong ਪਾਣੀ", en: "p consonant; seen in ਪਾਣੀ" },
      { id: "pa-ladder-letter-013", stage: "letters", gurmukhi: "ਫ", romanization: "pha/fa", vi: "có thể romanize ph hoặc f tùy từ", en: "may be romanized ph or f depending on word", learnerTrap: { vi: "Tìm kiếm nên thử cả ph và f nếu chưa có Gurmukhi.", en: "Try both ph and f in search when you do not have Gurmukhi." } },
      { id: "pa-ladder-letter-014", stage: "letters", gurmukhi: "ਮ", romanization: "ma", vi: "phụ âm m; gặp trong ਮਾਂ", en: "m consonant; seen in ਮਾਂ" },
      { id: "pa-ladder-letter-015", stage: "letters", gurmukhi: "ਰ", romanization: "ra", vi: "phụ âm r; gặp trong ਰਾਤ", en: "r consonant; seen in ਰਾਤ" },
      { id: "pa-ladder-letter-016", stage: "letters", gurmukhi: "ਵ", romanization: "va/wa", vi: "gần v hoặc w tùy giọng", en: "close to v or w depending on accent", learnerTrap: { vi: "Romanization v/w không phải bài chấm phát âm.", en: "v/w romanization is not pronunciation scoring." } },
    ],
  },
  {
    stage: "vowel_signs",
    title_vi: "Bậc 2: Dấu nguyên âm",
    title_en: "Step 2: Vowel signs",
    goal_vi: "Ghép phụ âm với dấu nguyên âm để đọc âm tiết ngắn.",
    goal_en: "Combine consonants with vowel signs to read short syllables.",
    entries: [
      { id: "pa-ladder-vowel-001", stage: "vowel_signs", gurmukhi: "ਕਾ", romanization: "kaa", vi: "ਕ + ਾ thành kaa", en: "ਕ + ਾ becomes kaa" },
      { id: "pa-ladder-vowel-002", stage: "vowel_signs", gurmukhi: "ਕਿ", romanization: "ki", vi: "ਿ viết trước nhưng đọc sau phụ âm", en: "ਿ is written before but read after the consonant", learnerTrap: { vi: "Người học hay đọc theo vị trí viết; hãy đọc ਕਿ là ki.", en: "Learners often follow written position; read ਕਿ as ki." } },
      { id: "pa-ladder-vowel-003", stage: "vowel_signs", gurmukhi: "ਕੀ", romanization: "ki/kii", vi: "ੀ là i dài; romanization có thể ghi ii", en: "ੀ is long i; romanization may show ii" },
      { id: "pa-ladder-vowel-004", stage: "vowel_signs", gurmukhi: "ਕੁ", romanization: "ku", vi: "ੁ là u ngắn dưới phụ âm", en: "ੁ is short u below the consonant" },
      { id: "pa-ladder-vowel-005", stage: "vowel_signs", gurmukhi: "ਕੂ", romanization: "kuu", vi: "ੂ là u dài dưới phụ âm", en: "ੂ is long u below the consonant" },
      { id: "pa-ladder-vowel-006", stage: "vowel_signs", gurmukhi: "ਕੇ", romanization: "ke", vi: "ੇ tạo âm e trong âm tiết", en: "ੇ creates an e sound" },
      { id: "pa-ladder-vowel-007", stage: "vowel_signs", gurmukhi: "ਕੈ", romanization: "kai", vi: "ੈ tạo âm ai/ae", en: "ੈ creates an ai/ae sound" },
      { id: "pa-ladder-vowel-008", stage: "vowel_signs", gurmukhi: "ਕੋ", romanization: "ko", vi: "ੋ tạo âm o trong âm tiết", en: "ੋ creates an o sound" },
      { id: "pa-ladder-vowel-009", stage: "vowel_signs", gurmukhi: "ਕੌ", romanization: "kau", vi: "ੌ tạo âm au", en: "ੌ creates an au sound" },
    ],
  },
  {
    stage: "syllables",
    title_vi: "Bậc 3: Âm tiết",
    title_en: "Step 3: Syllables",
    goal_vi: "Luyện đọc từng khối trước khi đọc cả từ.",
    goal_en: "Practice reading chunks before full words.",
    entries: [
      { id: "pa-ladder-syllable-001", stage: "syllables", gurmukhi: "ਮਾ", romanization: "maa", vi: "m + aa; khối quen thuộc trong ਮਾਂ", en: "m + aa; familiar chunk in ਮਾਂ" },
      { id: "pa-ladder-syllable-002", stage: "syllables", gurmukhi: "ਪਾ", romanization: "paa", vi: "p + aa; dùng để nhận diện ਪਾਣੀ", en: "p + aa; useful for recognizing ਪਾਣੀ" },
      { id: "pa-ladder-syllable-003", stage: "syllables", gurmukhi: "ਨੀ", romanization: "ni/nii", vi: "n + i dài; cuối từ ਪਾਣੀ", en: "n + long i; ending of ਪਾਣੀ" },
      { id: "pa-ladder-syllable-004", stage: "syllables", gurmukhi: "ਘਰ", romanization: "ghar", vi: "đọc như một khối từ nhà", en: "read as the word chunk for home" },
      { id: "pa-ladder-syllable-005", stage: "syllables", gurmukhi: "ਦੁ", romanization: "du", vi: "d + u; mở đầu ਦੁਕਾਨ", en: "d + u; starts ਦੁਕਾਨ" },
      { id: "pa-ladder-syllable-006", stage: "syllables", gurmukhi: "ਕਾ", romanization: "kaa", vi: "k + aa; khối trong ਦੁਕਾਨ", en: "k + aa; chunk in ਦੁਕਾਨ" },
      { id: "pa-ladder-syllable-007", stage: "syllables", gurmukhi: "ਸਕੂ", romanization: "sku/skoo", vi: "khối đầu của ਸਕੂਲ", en: "opening chunk of ਸਕੂਲ" },
      { id: "pa-ladder-syllable-008", stage: "syllables", gurmukhi: "ਟੇ", romanization: "te", vi: "t + e; hữu ích khi đọc ਸਟੇਸ਼ਨ", en: "t + e; useful in ਸਟੇਸ਼ਨ" },
    ],
  },
  {
    stage: "addak",
    title_vi: "Bậc 4: Addak",
    title_en: "Step 4: Addak",
    goal_vi: "Nhận diện ੱ như dấu báo phụ âm được nhấn/nhân đôi trong đọc chữ.",
    goal_en: "Recognize ੱ as a mark that signals a strengthened/doubled consonant in reading.",
    entries: [
      { id: "pa-ladder-addak-001", stage: "addak", gurmukhi: "ਇੱਕ", romanization: "ikk", vi: "ੱ giúp đọc kk; nghĩa là một", en: "ੱ helps read kk; means one" },
      { id: "pa-ladder-addak-002", stage: "addak", gurmukhi: "ਅੱਜ", romanization: "ajj", vi: "ੱ giúp đọc jj; nghĩa là hôm nay", en: "ੱ helps read jj; means today" },
      { id: "pa-ladder-addak-003", stage: "addak", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", vi: "ੱ báo dd; nghĩa là lớn", en: "ੱ marks dd; means big", learnerTrap: { vi: "Đừng bỏ qua ੱ khi đọc nhanh.", en: "Do not skip ੱ when reading quickly." } },
      { id: "pa-ladder-addak-004", stage: "addak", gurmukhi: "ਬੱਚਾ", romanization: "bachcha", vi: "ੱ báo chch; nghĩa là đứa trẻ", en: "ੱ marks chch; means child" },
      { id: "pa-ladder-addak-005", stage: "addak", gurmukhi: "ਮਿੱਠਾ", romanization: "mittha", vi: "ੱ báo tth; nghĩa là ngọt", en: "ੱ marks tth; means sweet" },
    ],
  },
  {
    stage: "nasal_marks",
    title_vi: "Bậc 5: Tippi và bindi",
    title_en: "Step 5: Tippi and bindi",
    goal_vi: "Nhận biết dấu mũi hóa trong chữ, không biến nó thành bài chấm phát âm.",
    goal_en: "Recognize nasal marks in writing without turning them into pronunciation scoring.",
    entries: [
      { id: "pa-ladder-nasal-001", stage: "nasal_marks", gurmukhi: "ਮਾਂ", romanization: "maan", vi: "ਂ báo mũi hóa; nghĩa là mẹ", en: "ਂ marks nasalization; means mother" },
      { id: "pa-ladder-nasal-002", stage: "nasal_marks", gurmukhi: "ਹਾਂ", romanization: "haan", vi: "ਂ xuất hiện trong từ vâng/có", en: "ਂ appears in the word for yes" },
      { id: "pa-ladder-nasal-003", stage: "nasal_marks", gurmukhi: "ਪੰਜਾਬੀ", romanization: "punjabi", vi: "ੰ trong ਪੁੰਜਾਬੀ/Punjabi báo âm mũi", en: "ੰ in Punjabi signals a nasal sound" },
      { id: "pa-ladder-nasal-004", stage: "nasal_marks", gurmukhi: "ਕਿੰਨਾ", romanization: "kinna", vi: "ੰ + addak tạo khối cần đọc chậm", en: "ੰ + addak creates a chunk to read slowly", learnerTrap: { vi: "Romanization có thể không ghi rõ mọi dấu mũi.", en: "Romanization may not show every nasal mark clearly." } },
      { id: "pa-ladder-nasal-005", stage: "nasal_marks", gurmukhi: "ਭੈਣ", romanization: "bhain", vi: "ਣ là n quặt lưỡi; từ nghĩa là chị/em gái", en: "ਣ is retroflex n; the word means sister" },
    ],
  },
  {
    stage: "word_reading",
    title_vi: "Bậc 6: Đọc từ",
    title_en: "Step 6: Word reading",
    goal_vi: "Chuyển từ âm tiết sang từ sinh hoạt hằng ngày.",
    goal_en: "Move from syllables into everyday words.",
    entries: [
      { id: "pa-ladder-word-001", stage: "word_reading", gurmukhi: "ਪਾਣੀ", romanization: "pani", vi: "nước; từ sống còn trong giao tiếp", en: "water; essential survival word" },
      { id: "pa-ladder-word-002", stage: "word_reading", gurmukhi: "ਚਾਹ", romanization: "chaah", vi: "trà; từ thường gặp trong gia đình và quán ăn", en: "tea; common at home and restaurants" },
      { id: "pa-ladder-word-003", stage: "word_reading", gurmukhi: "ਦੁਕਾਨ", romanization: "dukaan", vi: "cửa hàng; hữu ích khi đọc biển hiệu", en: "shop; useful for reading signs" },
      { id: "pa-ladder-word-004", stage: "word_reading", gurmukhi: "ਹਸਪਤਾਲ", romanization: "haspataal", vi: "bệnh viện; từ quan trọng khi cần giúp đỡ", en: "hospital; important when seeking help" },
      { id: "pa-ladder-word-005", stage: "word_reading", gurmukhi: "ਸਕੂਲ", romanization: "school", vi: "trường học; từ mượn dễ nhận ra", en: "school; recognizable loanword" },
      { id: "pa-ladder-word-006", stage: "word_reading", gurmukhi: "ਕੰਮ", romanization: "kamm", vi: "công việc; có tippi và phụ âm mạnh", en: "work; has tippi and a strengthened consonant" },
      { id: "pa-ladder-word-007", stage: "word_reading", gurmukhi: "ਬਾਜ਼ਾਰ", romanization: "bazaar", vi: "chợ/khu mua bán", en: "market or shopping area" },
      { id: "pa-ladder-word-008", stage: "word_reading", gurmukhi: "ਗੁਰਦੁਆਰਾ", romanization: "gurdwara", vi: "gurdwara/đền Sikh; từ văn hóa quan trọng", en: "gurdwara/Sikh place of worship; important cultural word" },
    ],
  },
  {
    stage: "short_phrases",
    title_vi: "Bậc 7: Cụm ngắn",
    title_en: "Step 7: Short phrases",
    goal_vi: "Đọc cụm ngắn trước khi đọc câu dài.",
    goal_en: "Read short phrases before full sentences.",
    entries: [
      { id: "pa-ladder-phrase-001", stage: "short_phrases", gurmukhi: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", romanization: "sat sri akaal", vi: "lời chào Punjabi/Sikh phổ biến", en: "common Punjabi/Sikh greeting" },
      { id: "pa-ladder-phrase-002", stage: "short_phrases", gurmukhi: "ਕੀ ਹਾਲ ਹੈ", romanization: "ki haal hai", vi: "bạn khỏe không / tình hình thế nào", en: "how are you / how are things" },
      { id: "pa-ladder-phrase-003", stage: "short_phrases", gurmukhi: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ", romanization: "mainu pani chahida hai", vi: "tôi cần nước", en: "I need water" },
      { id: "pa-ladder-phrase-004", stage: "short_phrases", gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ", romanization: "kirpa karke hauli bolo", vi: "làm ơn nói chậm", en: "please speak slowly" },
      { id: "pa-ladder-phrase-005", stage: "short_phrases", gurmukhi: "ਮੈਂ ਪੰਜਾਬੀ ਸਿੱਖ ਰਿਹਾ ਹਾਂ", romanization: "main punjabi sikh riha haan", vi: "tôi đang học Punjabi", en: "I am learning Punjabi" },
      { id: "pa-ladder-phrase-006", stage: "short_phrases", gurmukhi: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ", romanization: "mainu samajh nahi aai", vi: "tôi chưa hiểu", en: "I did not understand" },
    ],
  },
  {
    stage: "canada_survival",
    title_vi: "Bậc 8: Từ sinh tồn ở Canada",
    title_en: "Step 8: Canada survival words",
    goal_vi: "Đọc các từ có ích trong cộng đồng Punjabi ở Canada.",
    goal_en: "Read words useful in Punjabi communities in Canada.",
    entries: [
      { id: "pa-ladder-canada-001", stage: "canada_survival", gurmukhi: "ਕੈਨੇਡਾ", romanization: "canada/kaineda", vi: "Canada; thường gặp trong văn bản cộng đồng", en: "Canada; common in community text", canadaPractical: true },
      { id: "pa-ladder-canada-002", stage: "canada_survival", gurmukhi: "ਟੋਰਾਂਟੋ", romanization: "toronto", vi: "Toronto; tên nơi chốn", en: "Toronto; place name", canadaPractical: true },
      { id: "pa-ladder-canada-003", stage: "canada_survival", gurmukhi: "ਵੈਨਕੂਵਰ", romanization: "vancouver", vi: "Vancouver; tên nơi chốn", en: "Vancouver; place name", canadaPractical: true },
      { id: "pa-ladder-canada-004", stage: "canada_survival", gurmukhi: "ਬ੍ਰੈਂਪਟਨ", romanization: "brampton", vi: "Brampton; nơi có cộng đồng Punjabi lớn", en: "Brampton; a major Punjabi-community city", canadaPractical: true },
      { id: "pa-ladder-canada-005", stage: "canada_survival", gurmukhi: "ਡਾਕਟਰ", romanization: "daaktar", vi: "bác sĩ; hữu ích khi đi khám", en: "doctor; useful for clinic visits", canadaPractical: true },
      { id: "pa-ladder-canada-006", stage: "canada_survival", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy", vi: "nhà thuốc; từ mượn hay gặp", en: "pharmacy; common loanword", canadaPractical: true },
      { id: "pa-ladder-canada-007", stage: "canada_survival", gurmukhi: "ਬੱਸ", romanization: "bus", vi: "xe buýt; đọc biển giao thông", en: "bus; useful for transit signs", canadaPractical: true },
      { id: "pa-ladder-canada-008", stage: "canada_survival", gurmukhi: "ਪੁਲਿਸ", romanization: "pulis", vi: "cảnh sát; từ khẩn cấp cơ bản", en: "police; basic emergency word", canadaPractical: true },
      { id: "pa-ladder-canada-009", stage: "canada_survival", gurmukhi: "ਲਾਇਬ੍ਰੇਰੀ", romanization: "library", vi: "thư viện; hữu ích cho người mới đến", en: "library; useful for newcomers", canadaPractical: true },
    ],
  },
  {
    stage: "romanization_bridge",
    title_vi: "Bậc 9: Cầu nối romanization",
    title_en: "Step 9: Romanization bridge",
    goal_vi: "Dùng chữ Latin để tìm kiếm, nhưng quay lại Gurmukhi để đọc chính xác hơn.",
    goal_en: "Use Latin letters for search, but return to Gurmukhi for more precise reading.",
    entries: [
      { id: "pa-ladder-roman-001", stage: "romanization_bridge", gurmukhi: "ਫਲ", romanization: "phal/fal", vi: "thử cả phal và fal khi tìm kiếm", en: "try both phal and fal when searching", learnerTrap: { vi: "Một hệ Latin hóa không bao phủ mọi biến thể.", en: "One romanization system does not cover every variant." } },
      { id: "pa-ladder-roman-002", stage: "romanization_bridge", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", vi: "v và w có thể thay đổi theo giọng", en: "v and w may vary by accent" },
      { id: "pa-ladder-roman-003", stage: "romanization_bridge", gurmukhi: "ਕੀ", romanization: "ki/kii", vi: "i dài có thể được ghi ii", en: "long i may be written as ii" },
      { id: "pa-ladder-roman-004", stage: "romanization_bridge", gurmukhi: "ਟ / ਤ", romanization: "t / t", vi: "Latin t không phân biệt quặt lưỡi và răng", en: "Latin t does not distinguish retroflex and dental t" },
      { id: "pa-ladder-roman-005", stage: "romanization_bridge", gurmukhi: "ਮਾਂ", romanization: "maan/man", vi: "dấu mũi hóa có thể bị lược trong tìm kiếm Latin", en: "nasalization may be simplified in Latin search" },
      { id: "pa-ladder-roman-006", stage: "romanization_bridge", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", vi: "sh có thể được ghi khác nhau", en: "sh may be written in different ways" },
    ],
  },
  {
    stage: "shahmukhi_awareness",
    title_vi: "Bậc 10: Nhận biết Shahmukhi",
    title_en: "Step 10: Shahmukhi awareness",
    goal_vi: "Biết Punjabi cũng có hệ chữ khác, nhưng khóa này giữ Gurmukhi làm chính.",
    goal_en: "Know Punjabi also has another script, while this course keeps Gurmukhi primary.",
    entries: [
      { id: "pa-ladder-shahmukhi-001", stage: "shahmukhi_awareness", gurmukhi: "ਪੰਜਾਬੀ", romanization: "punjabi", vi: "Punjabi có thể được viết bằng Shahmukhi trong một số cộng đồng Pakistan; đây chỉ là nhận biết, không phải khóa Shahmukhi đầy đủ.", en: "Punjabi can be written in Shahmukhi in some Pakistani communities; this is awareness only, not a full Shahmukhi course." },
    ],
  },
];

export const PUNJABI_GURMUKHI_READING_LADDER = sections;

export const PUNJABI_GURMUKHI_READING_LADDER_ENTRIES: ReadonlyArray<PunjabiReadingLadderEntry> =
  sections.flatMap((section) => section.entries);

export const PUNJABI_GURMUKHI_READING_LADDER_SCOPE = {
  vi: "Gurmukhi là chữ chính. Romanization giúp tìm kiếm và tự kiểm tra, không phải phát âm chấm điểm. Native review được hoãn.",
  en: "Gurmukhi is primary. Romanization helps with search and self-checking, not pronunciation scoring. Native review is deferred.",
} as const;

export default PUNJABI_GURMUKHI_READING_LADDER;
