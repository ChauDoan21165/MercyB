// src/languages/punjabi/scriptDrills.ts
//
// Compact Gurmukhi script drills for Vietnamese-speaking and English-speaking
// Punjabi learners. Gurmukhi is primary; romanization is a reading aid.
// No audio, pronunciation scoring, or native-review claim.

export type PunjabiScriptDrillType =
  | "letter_recognition"
  | "vowel_sign"
  | "similar_letters"
  | "word_reading"
  | "sign_text_reading"
  | "romanization_warning"
  | "shahmukhi_awareness";

export type PunjabiScriptDrillLevel = "starter" | "easy" | "medium";

export type PunjabiScriptDrill = {
  id: string;
  type: PunjabiScriptDrillType;
  level: PunjabiScriptDrillLevel;
  gurmukhi: string;
  romanization?: string;
  prompt_vi: string;
  prompt_en: string;
  answer_vi: string;
  answer_en: string;
};

const letterDrills: ReadonlyArray<PunjabiScriptDrill> = [
  { id: "pa-letter-001", type: "letter_recognition", level: "starter", gurmukhi: "ਅ", romanization: "a", prompt_vi: "Nhận diện chữ Gurmukhi này.", prompt_en: "Recognize this Gurmukhi letter.", answer_vi: "ਅ là ký tự mang nguyên âm đầu, thường dùng cho âm a.", answer_en: "ਅ is an initial vowel carrier, often for an a sound." },
  { id: "pa-letter-002", type: "letter_recognition", level: "starter", gurmukhi: "ਆ", romanization: "aa", prompt_vi: "Chữ này gợi âm nào?", prompt_en: "What sound does this letter suggest?", answer_vi: "ਆ gợi âm aa dài như trong ਆਉਣਾ.", answer_en: "ਆ suggests a long aa sound as in ਆਉਣਾ." },
  { id: "pa-letter-003", type: "letter_recognition", level: "starter", gurmukhi: "ਇ", romanization: "i", prompt_vi: "Nhận diện nguyên âm đầu này.", prompt_en: "Identify this initial vowel.", answer_vi: "ਇ là ký tự nguyên âm i ngắn, như trong ਇਹ.", answer_en: "ਇ is a short i vowel carrier, as in ਇਹ." },
  { id: "pa-letter-004", type: "letter_recognition", level: "starter", gurmukhi: "ਉ", romanization: "u/o", prompt_vi: "Chữ này thường đứng ở đâu?", prompt_en: "Where does this letter often appear?", answer_vi: "ਉ là ký tự mang nguyên âm đầu, gặp trong ਉਹ.", answer_en: "ਉ is an initial vowel carrier, seen in ਉਹ." },
  { id: "pa-letter-005", type: "letter_recognition", level: "starter", gurmukhi: "ਸ", romanization: "s", prompt_vi: "Đọc phụ âm này.", prompt_en: "Read this consonant.", answer_vi: "ਸ đọc gần s, như ਸਾਲ nghĩa là năm.", answer_en: "ਸ reads close to s, as in ਸਾਲ meaning year." },
  { id: "pa-letter-006", type: "letter_recognition", level: "starter", gurmukhi: "ਹ", romanization: "h", prompt_vi: "Nhận diện phụ âm h.", prompt_en: "Recognize the h consonant.", answer_vi: "ਹ là h, như ਹਾਂ nghĩa là vâng/có.", answer_en: "ਹ is h, as in ਹਾਂ meaning yes." },
  { id: "pa-letter-007", type: "letter_recognition", level: "starter", gurmukhi: "ਕ", romanization: "k/ka", prompt_vi: "Chữ này là phụ âm nào?", prompt_en: "Which consonant is this?", answer_vi: "ਕ là k; khi đứng một mình thường có nguyên âm mặc định gần a.", answer_en: "ਕ is k; alone it usually carries an inherent a-like vowel." },
  { id: "pa-letter-008", type: "letter_recognition", level: "starter", gurmukhi: "ਖ", romanization: "kh", prompt_vi: "Nhận diện chữ bật hơi.", prompt_en: "Recognize the aspirated letter.", answer_vi: "ਖ là kh bật hơi, như ਖਾਣਾ.", answer_en: "ਖ is aspirated kh, as in ਖਾਣਾ." },
  { id: "pa-letter-009", type: "letter_recognition", level: "starter", gurmukhi: "ਗ", romanization: "g", prompt_vi: "Đọc phụ âm này.", prompt_en: "Read this consonant.", answer_vi: "ਗ là g, như ਗਰਮ nghĩa là nóng.", answer_en: "ਗ is g, as in ਗਰਮ meaning hot." },
  { id: "pa-letter-010", type: "letter_recognition", level: "starter", gurmukhi: "ਚ", romanization: "ch", prompt_vi: "Nhận diện chữ ch.", prompt_en: "Recognize the ch letter.", answer_vi: "ਚ là ch, như ਚਾਹ nghĩa là trà.", answer_en: "ਚ is ch, as in ਚਾਹ meaning tea." },
  { id: "pa-letter-011", type: "letter_recognition", level: "starter", gurmukhi: "ਜ", romanization: "j", prompt_vi: "Chữ này đọc gần âm nào?", prompt_en: "Which sound is this close to?", answer_vi: "ਜ đọc gần j, như ਜਾਣਾ nghĩa là đi.", answer_en: "ਜ reads close to j, as in ਜਾਣਾ meaning to go." },
  { id: "pa-letter-012", type: "letter_recognition", level: "starter", gurmukhi: "ਤ", romanization: "t", prompt_vi: "Nhận diện t răng.", prompt_en: "Recognize the dental t.", answer_vi: "ਤ là t răng, khác với ਟ quặt lưỡi.", answer_en: "ਤ is dental t, different from retroflex ਟ." },
  { id: "pa-letter-013", type: "letter_recognition", level: "starter", gurmukhi: "ਦ", romanization: "d", prompt_vi: "Nhận diện d răng.", prompt_en: "Recognize the dental d.", answer_vi: "ਦ là d răng, như ਦਿਨ nghĩa là ngày.", answer_en: "ਦ is dental d, as in ਦਿਨ meaning day." },
  { id: "pa-letter-014", type: "letter_recognition", level: "starter", gurmukhi: "ਪ", romanization: "p", prompt_vi: "Đọc phụ âm này.", prompt_en: "Read this consonant.", answer_vi: "ਪ là p, như ਪਾਣੀ nghĩa là nước.", answer_en: "ਪ is p, as in ਪਾਣੀ meaning water." },
  { id: "pa-letter-015", type: "letter_recognition", level: "starter", gurmukhi: "ਮ", romanization: "m", prompt_vi: "Nhận diện chữ m.", prompt_en: "Recognize the m letter.", answer_vi: "ਮ là m, như ਮਾਂ nghĩa là mẹ.", answer_en: "ਮ is m, as in ਮਾਂ meaning mother." },
  { id: "pa-letter-016", type: "letter_recognition", level: "starter", gurmukhi: "ਰ", romanization: "r", prompt_vi: "Đọc phụ âm này.", prompt_en: "Read this consonant.", answer_vi: "ਰ là r, như ਰਾਤ nghĩa là đêm.", answer_en: "ਰ is r, as in ਰਾਤ meaning night." },
];

const vowelSignDrills: ReadonlyArray<PunjabiScriptDrill> = [
  { id: "pa-vowel-001", type: "vowel_sign", level: "easy", gurmukhi: "ਕਾ", romanization: "kaa", prompt_vi: "Dấu ਾ đổi ਕ thành gì?", prompt_en: "What does ਾ do to ਕ?", answer_vi: "ਕਾ đọc kaa; ਾ là kanna, tạo âm aa dài.", answer_en: "ਕਾ reads kaa; ਾ is kanna, making long aa." },
  { id: "pa-vowel-002", type: "vowel_sign", level: "easy", gurmukhi: "ਕਿ", romanization: "ki", prompt_vi: "Dấu ਿ viết trước nhưng đọc thế nào?", prompt_en: "How is ਿ read when written before?", answer_vi: "ਕਿ đọc ki; ਿ viết trước phụ âm nhưng đọc sau phụ âm.", answer_en: "ਕਿ reads ki; ਿ is written before but read after the consonant." },
  { id: "pa-vowel-003", type: "vowel_sign", level: "easy", gurmukhi: "ਕੀ", romanization: "ki", prompt_vi: "Dấu ੀ tạo âm gì?", prompt_en: "What sound does ੀ create?", answer_vi: "ਕੀ đọc ki/kii tùy romanization; ੀ là âm i dài.", answer_en: "ਕੀ reads ki/kii depending on romanization; ੀ is long i." },
  { id: "pa-vowel-004", type: "vowel_sign", level: "easy", gurmukhi: "ਕੁ", romanization: "ku", prompt_vi: "Dấu dưới này đọc ra sao?", prompt_en: "How is this lower sign read?", answer_vi: "ਕੁ đọc ku; ੁ là u ngắn đặt dưới phụ âm.", answer_en: "ਕੁ reads ku; ੁ is short u written below." },
  { id: "pa-vowel-005", type: "vowel_sign", level: "easy", gurmukhi: "ਕੂ", romanization: "kuu", prompt_vi: "So sánh ਕੁ và ਕੂ.", prompt_en: "Compare ਕੁ and ਕੂ.", answer_vi: "ਕੂ dùng ੂ cho âm u dài hơn so với ਕੁ.", answer_en: "ਕੂ uses ੂ for a longer u than ਕੁ." },
  { id: "pa-vowel-006", type: "vowel_sign", level: "easy", gurmukhi: "ਕੇ", romanization: "ke", prompt_vi: "Dấu ੇ tạo âm nào?", prompt_en: "Which vowel does ੇ create?", answer_vi: "ਕੇ đọc ke; ੇ thường gợi âm e.", answer_en: "ਕੇ reads ke; ੇ usually suggests e." },
  { id: "pa-vowel-007", type: "vowel_sign", level: "easy", gurmukhi: "ਕੈ", romanization: "kai", prompt_vi: "Dấu ੈ gợi âm nào?", prompt_en: "Which vowel does ੈ suggest?", answer_vi: "ਕੈ đọc kai/kae; đây là dấu ai/ae.", answer_en: "ਕੈ reads kai/kae; this is the ai/ae sign." },
  { id: "pa-vowel-008", type: "vowel_sign", level: "easy", gurmukhi: "ਕੋ", romanization: "ko", prompt_vi: "Dấu ੋ tạo âm gì?", prompt_en: "What sound does ੋ create?", answer_vi: "ਕੋ đọc ko; ੋ là dấu o.", answer_en: "ਕੋ reads ko; ੋ is the o sign." },
  { id: "pa-vowel-009", type: "vowel_sign", level: "easy", gurmukhi: "ਕੌ", romanization: "kau", prompt_vi: "Dấu ੌ tạo âm gì?", prompt_en: "What sound does ੌ create?", answer_vi: "ਕੌ đọc kau; ੌ là dấu au.", answer_en: "ਕੌ reads kau; ੌ is the au sign." },
  { id: "pa-vowel-010", type: "vowel_sign", level: "easy", gurmukhi: "ਮਾ", romanization: "maa", prompt_vi: "Đọc từ ngắn này.", prompt_en: "Read this short word.", answer_vi: "ਮਾ đọc maa, nghĩa là mẹ trong nhiều ngữ cảnh.", answer_en: "ਮਾ reads maa, meaning mother in many contexts." },
  { id: "pa-vowel-011", type: "vowel_sign", level: "easy", gurmukhi: "ਮੇਰਾ", romanization: "mera", prompt_vi: "Tìm dấu e trong từ này.", prompt_en: "Find the e sign in this word.", answer_vi: "ਮੇਰਾ có ੇ trên ਮ, đọc me trong mera.", answer_en: "ਮੇਰਾ has ੇ over ਮ, read me in mera." },
  { id: "pa-vowel-012", type: "vowel_sign", level: "easy", gurmukhi: "ਦੋ", romanization: "do", prompt_vi: "Dấu nào tạo âm o?", prompt_en: "Which sign creates o?", answer_vi: "ਦੋ dùng ੋ để tạo âm o.", answer_en: "ਦੋ uses ੋ to create the o sound." },
];

const similarLetterDrills: ReadonlyArray<PunjabiScriptDrill> = [
  { id: "pa-similar-001", type: "similar_letters", level: "medium", gurmukhi: "ਕ / ਖ", romanization: "k / kh", prompt_vi: "Cặp này khác nhau ở điểm nào?", prompt_en: "How does this pair differ?", answer_vi: "ਖ là dạng bật hơi của k; romanization thêm h để cảnh báo người đọc.", answer_en: "ਖ is aspirated k; romanization adds h as a reading warning." },
  { id: "pa-similar-002", type: "similar_letters", level: "medium", gurmukhi: "ਗ / ਘ", romanization: "g / gh", prompt_vi: "Nhìn cặp g/gh này.", prompt_en: "Look at this g/gh pair.", answer_vi: "ਘ có bật hơi và trong Punjabi cũng liên quan đến ý thức thanh điệu ở một số từ.", answer_en: "ਘ is aspirated and also tied to Punjabi tone awareness in some words." },
  { id: "pa-similar-003", type: "similar_letters", level: "medium", gurmukhi: "ਚ / ਛ", romanization: "ch / chh", prompt_vi: "Cặp này cảnh báo điều gì?", prompt_en: "What does this pair warn you about?", answer_vi: "ਛ có bật hơi mạnh hơn ਚ; romanization thường dùng chh.", answer_en: "ਛ is more aspirated than ਚ; romanization often uses chh." },
  { id: "pa-similar-004", type: "similar_letters", level: "medium", gurmukhi: "ਟ / ਤ", romanization: "t / t", prompt_vi: "Hai chữ đều romanize là t, nhưng có giống nhau không?", prompt_en: "Both may romanize as t, but are they the same?", answer_vi: "Không. ਟ là t quặt lưỡi, còn ਤ là t răng.", answer_en: "No. ਟ is retroflex t, while ਤ is dental t." },
  { id: "pa-similar-005", type: "similar_letters", level: "medium", gurmukhi: "ਡ / ਦ", romanization: "d / d", prompt_vi: "Phân biệt hai chữ d.", prompt_en: "Distinguish the two d letters.", answer_vi: "ਡ là d quặt lưỡi; ਦ là d răng.", answer_en: "ਡ is retroflex d; ਦ is dental d." },
  { id: "pa-similar-006", type: "similar_letters", level: "medium", gurmukhi: "ਪ / ਫ", romanization: "p / ph-f", prompt_vi: "Cặp này dễ nhầm ở romanization nào?", prompt_en: "Where can romanization confuse this pair?", answer_vi: "ਫ có thể được viết ph hoặc f tùy từ và hệ romanization.", answer_en: "ਫ may be written ph or f depending on word and romanization system." },
  { id: "pa-similar-007", type: "similar_letters", level: "medium", gurmukhi: "ਬ / ਭ", romanization: "b / bh", prompt_vi: "Nhận diện chữ bật hơi.", prompt_en: "Identify the aspirated letter.", answer_vi: "ਭ là bh bật hơi; ਬ là b không bật hơi.", answer_en: "ਭ is aspirated bh; ਬ is unaspirated b." },
  { id: "pa-similar-008", type: "similar_letters", level: "medium", gurmukhi: "ਨ / ਣ", romanization: "n / n", prompt_vi: "Hai chữ n này khác nhau thế nào?", prompt_en: "How do these two n letters differ?", answer_vi: "ਣ là n quặt lưỡi; ਨ là n thường/dental.", answer_en: "ਣ is retroflex n; ਨ is the regular/dental n." },
  { id: "pa-similar-009", type: "similar_letters", level: "medium", gurmukhi: "ਰ / ੜ", romanization: "r / rh", prompt_vi: "Cặp r này cần chú ý gì?", prompt_en: "What needs attention in this r pair?", answer_vi: "ੜ là âm vỗ/quặt lưỡi riêng; romanization có thể ghi rh hoặc r.", answer_en: "ੜ is a separate flap/retroflex sound; romanization may show rh or r." },
  { id: "pa-similar-010", type: "similar_letters", level: "medium", gurmukhi: "ਵ / ਬ", romanization: "v-w / b", prompt_vi: "Đừng nhầm hai chữ này.", prompt_en: "Do not confuse these letters.", answer_vi: "ਵ thường là v/w theo giọng; ਬ là b.", answer_en: "ਵ is often v/w by accent; ਬ is b." },
];

const wordReadingDrills: ReadonlyArray<PunjabiScriptDrill> = [
  { id: "pa-word-001", type: "word_reading", level: "easy", gurmukhi: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", romanization: "sat sri akaal", prompt_vi: "Đọc lời chào này.", prompt_en: "Read this greeting.", answer_vi: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ là lời chào Sikh/Punjabi phổ biến.", answer_en: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ is a common Sikh/Punjabi greeting." },
  { id: "pa-word-002", type: "word_reading", level: "easy", gurmukhi: "ਧੰਨਵਾਦ", romanization: "dhannvaad", prompt_vi: "Đọc từ cảm ơn.", prompt_en: "Read the thank-you word.", answer_vi: "ਧੰਨਵਾਦ nghĩa là cảm ơn.", answer_en: "ਧੰਨਵਾਦ means thank you." },
  { id: "pa-word-003", type: "word_reading", level: "easy", gurmukhi: "ਪਾਣੀ", romanization: "pani", prompt_vi: "Đọc từ đồ uống cơ bản.", prompt_en: "Read this basic drink word.", answer_vi: "ਪਾਣੀ nghĩa là nước.", answer_en: "ਪਾਣੀ means water." },
  { id: "pa-word-004", type: "word_reading", level: "easy", gurmukhi: "ਚਾਹ", romanization: "chaah", prompt_vi: "Đọc từ này.", prompt_en: "Read this word.", answer_vi: "ਚਾਹ nghĩa là trà.", answer_en: "ਚਾਹ means tea, a common drink word." },
  { id: "pa-word-005", type: "word_reading", level: "easy", gurmukhi: "ਘਰ", romanization: "ghar", prompt_vi: "Đọc từ nơi chốn.", prompt_en: "Read this place word.", answer_vi: "ਘਰ nghĩa là nhà; gh cũng nhắc người học về bật hơi/thanh điệu.", answer_en: "ਘਰ means home; gh also cues aspiration/tone awareness." },
  { id: "pa-word-006", type: "word_reading", level: "easy", gurmukhi: "ਸਕੂਲ", romanization: "school", prompt_vi: "Đọc từ mượn này.", prompt_en: "Read this loanword.", answer_vi: "ਸਕੂਲ nghĩa là trường học; romanization giống tiếng Anh.", answer_en: "ਸਕੂਲ means school; romanization resembles English." },
  { id: "pa-word-007", type: "word_reading", level: "easy", gurmukhi: "ਪਰਿਵਾਰ", romanization: "parivaar", prompt_vi: "Đọc từ gia đình.", prompt_en: "Read the family word.", answer_vi: "ਪਰਿਵਾਰ nghĩa là gia đình.", answer_en: "ਪਰਿਵਾਰ means family." },
  { id: "pa-word-008", type: "word_reading", level: "easy", gurmukhi: "ਮਾਂ", romanization: "maan", prompt_vi: "Dấu nào báo mũi hóa?", prompt_en: "Which mark signals nasalization?", answer_vi: "ਂ trên ਮਾਂ báo âm mũi; từ này nghĩa là mẹ.", answer_en: "ਂ in ਮਾਂ signals nasalization; the word means mother." },
  { id: "pa-word-009", type: "word_reading", level: "easy", gurmukhi: "ਦਿਨ", romanization: "din", prompt_vi: "Đọc từ thời gian.", prompt_en: "Read this time word.", answer_vi: "ਦਿਨ nghĩa là ngày.", answer_en: "ਦਿਨ means day, a basic time word." },
  { id: "pa-word-010", type: "word_reading", level: "easy", gurmukhi: "ਰਾਤ", romanization: "raat", prompt_vi: "Đọc từ đối lập với ngày.", prompt_en: "Read the word opposite of day.", answer_vi: "ਰਾਤ nghĩa là đêm.", answer_en: "ਰਾਤ means night." },
  { id: "pa-word-011", type: "word_reading", level: "easy", gurmukhi: "ਕਿੱਥੇ", romanization: "kitthe", prompt_vi: "Đọc từ hỏi nơi chốn.", prompt_en: "Read this place question word.", answer_vi: "ਕਿੱਥੇ nghĩa là ở đâu.", answer_en: "ਕਿੱਥੇ means where." },
  { id: "pa-word-012", type: "word_reading", level: "easy", gurmukhi: "ਕਿਵੇਂ", romanization: "kiven", prompt_vi: "Đọc từ hỏi cách thức.", prompt_en: "Read this manner question word.", answer_vi: "ਕਿਵੇਂ nghĩa là như thế nào/how.", answer_en: "ਕਿਵੇਂ means how." },
  { id: "pa-word-013", type: "word_reading", level: "easy", gurmukhi: "ਖਾਣਾ", romanization: "khana", prompt_vi: "Đọc từ về ăn uống.", prompt_en: "Read this food/eating word.", answer_vi: "ਖਾਣਾ nghĩa là thức ăn hoặc ăn.", answer_en: "ਖਾਣਾ means food or to eat." },
  { id: "pa-word-014", type: "word_reading", level: "easy", gurmukhi: "ਦੋਸਤ", romanization: "dost", prompt_vi: "Đọc từ quan hệ xã hội.", prompt_en: "Read this social relation word.", answer_vi: "ਦੋਸਤ nghĩa là bạn bè.", answer_en: "ਦੋਸਤ means friend." },
  { id: "pa-word-015", type: "word_reading", level: "easy", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir", prompt_vi: "Đọc từ nơi chốn này.", prompt_en: "Read this place word.", answer_vi: "ਸ਼ਹਿਰ nghĩa là thành phố.", answer_en: "ਸ਼ਹਿਰ means city." },
  { id: "pa-word-016", type: "word_reading", level: "easy", gurmukhi: "ਬਾਜ਼ਾਰ", romanization: "bazaar", prompt_vi: "Đọc từ mua bán.", prompt_en: "Read this market word.", answer_vi: "ਬਾਜ਼ਾਰ nghĩa là chợ/khu mua bán.", answer_en: "ਬਾਜ਼ਾਰ means market." },
];

const signTextDrills: ReadonlyArray<PunjabiScriptDrill> = [
  { id: "pa-sign-001", type: "sign_text_reading", level: "medium", gurmukhi: "ਦੁਕਾਨ", romanization: "dukaan", prompt_vi: "Bạn thấy chữ này trên biển hiệu.", prompt_en: "You see this on a sign.", answer_vi: "ਦੁਕਾਨ nghĩa là cửa hàng/shop.", answer_en: "ਦੁਕਾਨ means shop/store." },
  { id: "pa-sign-002", type: "sign_text_reading", level: "medium", gurmukhi: "ਹਸਪਤਾਲ", romanization: "haspataal", prompt_vi: "Đọc biển chỉ nơi y tế.", prompt_en: "Read this healthcare place sign.", answer_vi: "ਹਸਪਤਾਲ nghĩa là bệnh viện.", answer_en: "ਹਸਪਤਾਲ means hospital." },
  { id: "pa-sign-003", type: "sign_text_reading", level: "medium", gurmukhi: "ਰੇਲਵੇ ਸਟੇਸ਼ਨ", romanization: "railway station", prompt_vi: "Đọc biển giao thông.", prompt_en: "Read this transport sign.", answer_vi: "ਰੇਲਵੇ ਸਟੇਸ਼ਨ nghĩa là ga tàu.", answer_en: "ਰੇਲਵੇ ਸਟੇਸ਼ਨ means railway station." },
  { id: "pa-sign-004", type: "sign_text_reading", level: "medium", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", prompt_vi: "Đọc biển bến xe.", prompt_en: "Read this bus-place sign.", answer_vi: "ਬੱਸ ਅੱਡਾ là bến xe buýt/bus stand.", answer_en: "ਬੱਸ ਅੱਡਾ is a bus stand." },
  { id: "pa-sign-005", type: "sign_text_reading", level: "medium", gurmukhi: "ਦਾਖਲਾ", romanization: "daakhla", prompt_vi: "Đọc chữ thường thấy ở lối vào.", prompt_en: "Read a word often seen near entry.", answer_vi: "ਦਾਖਲਾ nghĩa là lối vào/nhập học tùy ngữ cảnh.", answer_en: "ਦਾਖਲਾ means entry/admission depending on context." },
  { id: "pa-sign-006", type: "sign_text_reading", level: "medium", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", prompt_vi: "Đọc chữ trên biển thoát ra.", prompt_en: "Read this exit sign word.", answer_vi: "ਨਿਕਾਸ nghĩa là lối ra/exit.", answer_en: "ਨਿਕਾਸ means exit." },
  { id: "pa-sign-007", type: "sign_text_reading", level: "medium", gurmukhi: "ਮਰਦ", romanization: "marad", prompt_vi: "Đọc chữ phân khu vệ sinh.", prompt_en: "Read this restroom-area word.", answer_vi: "ਮਰਦ nghĩa là nam/men.", answer_en: "ਮਰਦ means men/male." },
  { id: "pa-sign-008", type: "sign_text_reading", level: "medium", gurmukhi: "ਔਰਤਾਂ", romanization: "auratan", prompt_vi: "Đọc chữ phân khu vệ sinh.", prompt_en: "Read this restroom-area word.", answer_vi: "ਔਰਤਾਂ nghĩa là phụ nữ/women.", answer_en: "ਔਰਤਾਂ means women." },
];

const romanizationWarningDrills: ReadonlyArray<PunjabiScriptDrill> = [
  { id: "pa-roman-001", type: "romanization_warning", level: "medium", gurmukhi: "ਕੀ", romanization: "ki / kii", prompt_vi: "Vì sao romanization có thể khác?", prompt_en: "Why can romanization differ?", answer_vi: "Một số hệ ghi ੀ là ii, nhưng nhiều tài liệu học dùng ki cho đơn giản.", answer_en: "Some systems write ੀ as ii, while many learning materials simplify it as ki." },
  { id: "pa-roman-002", type: "romanization_warning", level: "medium", gurmukhi: "ਫਲ", romanization: "phal / fal", prompt_vi: "Hai cách Latin hóa này nói gì?", prompt_en: "What do these two Latin spellings show?", answer_vi: "ਫ có thể xuất hiện là ph hoặc f; hãy ưu tiên nhận diện chữ Gurmukhi.", answer_en: "ਫ may appear as ph or f; prioritize recognizing the Gurmukhi letter." },
  { id: "pa-roman-003", type: "romanization_warning", level: "medium", gurmukhi: "ਵੱਡਾ", romanization: "vadda / wada", prompt_vi: "Vì sao v/w thay đổi?", prompt_en: "Why can v/w vary?", answer_vi: "ਵ có thể gần v hoặc w tùy giọng; romanization không phải phát âm chấm điểm.", answer_en: "ਵ can sound closer to v or w by accent; romanization is not scored pronunciation." },
  { id: "pa-roman-004", type: "romanization_warning", level: "medium", gurmukhi: "ਕੱਲ੍ਹ", romanization: "kallh / kal", prompt_vi: "Romanization có luôn ghi hết dấu không?", prompt_en: "Does romanization always show every mark?", answer_vi: "Không. Một số hệ lược bớt h hoặc dấu phụ; Gurmukhi là nguồn chính.", answer_en: "No. Some systems omit h or diacritics; Gurmukhi is the primary source." },
  { id: "pa-roman-005", type: "romanization_warning", level: "medium", gurmukhi: "ਟ / ਤ", romanization: "t / t", prompt_vi: "Một chữ Latin t có đủ không?", prompt_en: "Is one Latin t enough?", answer_vi: "Không đủ để phân biệt quặt lưỡi và răng; cần nhìn chữ Gurmukhi.", answer_en: "Not enough to distinguish retroflex and dental; look at the Gurmukhi letters." },
  { id: "pa-roman-006", type: "romanization_warning", level: "medium", gurmukhi: "ਡ / ਦ", romanization: "d / d", prompt_vi: "Cảnh báo khi tìm kiếm bằng Latin.", prompt_en: "Warning when searching in Latin letters.", answer_vi: "Cả hai có thể viết d, nên tìm bằng Gurmukhi sẽ chính xác hơn.", answer_en: "Both can be written d, so searching in Gurmukhi is more precise." },
  { id: "pa-roman-007", type: "romanization_warning", level: "medium", gurmukhi: "ਂ / ੰ", romanization: "bindi / tippi", prompt_vi: "Dấu mũi hóa có dễ mất khi Latin hóa không?", prompt_en: "Can nasal marks disappear in romanization?", answer_vi: "Có. Romanization có thể dùng n, m, ng hoặc bỏ dấu; hãy kiểm tra chữ gốc.", answer_en: "Yes. Romanization may use n, m, ng, or omit the mark; check the original script." },
  { id: "pa-roman-008", type: "romanization_warning", level: "medium", gurmukhi: "ਸ਼ / ਸ", romanization: "sh / s", prompt_vi: "Dấu chấm dưới thay đổi điều gì?", prompt_en: "What does the lower dot change?", answer_vi: "ਸ਼ là dạng mở rộng thường đọc sh; ਸ là s.", answer_en: "ਸ਼ is an extended form often read sh; ਸ is s." },
];

const awarenessDrills: ReadonlyArray<PunjabiScriptDrill> = [
  { id: "pa-awareness-001", type: "shahmukhi_awareness", level: "starter", gurmukhi: "ਪੰਜਾਬੀ", romanization: "punjabi", prompt_vi: "Khóa này dùng hệ chữ nào là chính?", prompt_en: "Which script is primary in this course?", answer_vi: "Gurmukhi là chính. Shahmukhi chỉ được nhắc để biết Punjabi cũng có hệ chữ khác.", answer_en: "Gurmukhi is primary. Shahmukhi is mentioned only so learners know Punjabi also has another script." },
  { id: "pa-awareness-002", type: "shahmukhi_awareness", level: "starter", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", prompt_vi: "Có học Shahmukhi đầy đủ ở đây không?", prompt_en: "Is this a full Shahmukhi course?", answer_vi: "Không. Đây không phải khóa Shahmukhi đầy đủ; chỉ là nhận biết.", answer_en: "No. This is not a full Shahmukhi course; it is awareness only." },
];

export const PUNJABI_SCRIPT_DRILLS: ReadonlyArray<PunjabiScriptDrill> = [
  ...letterDrills,
  ...vowelSignDrills,
  ...similarLetterDrills,
  ...wordReadingDrills,
  ...signTextDrills,
  ...romanizationWarningDrills,
  ...awarenessDrills,
];

export default PUNJABI_SCRIPT_DRILLS;
