// src/languages/punjabi/scriptErrorDeck.ts
//
// Gurmukhi script error deck for Vietnamese-speaking and English-speaking
// Punjabi learners. Gurmukhi is primary; romanization is only a repair bridge.
// No audio, pronunciation scoring, or native-review claim.

export type PunjabiScriptErrorCategory =
  | "look_alike_letters"
  | "vowel_signs"
  | "addak"
  | "tippi_bindi"
  | "romanization_traps"
  | "word_boundary"
  | "reading_repair"
  | "shahmukhi_awareness";

export type PunjabiScriptErrorEntry = {
  id: string;
  category: PunjabiScriptErrorCategory;
  gurmukhi: string;
  romanization?: string;
  errorPattern_vi: string;
  errorPattern_en: string;
  repair_vi: string;
  repair_en: string;
  drillPrompt_vi: string;
  drillPrompt_en: string;
  canadaPractical?: boolean;
};

export type PunjabiScriptErrorSection = {
  category: PunjabiScriptErrorCategory;
  title_vi: string;
  title_en: string;
  focus_vi: string;
  focus_en: string;
  entries: ReadonlyArray<PunjabiScriptErrorEntry>;
};

export const PUNJABI_SCRIPT_ERROR_SCOPE = {
  vi: "Bộ lỗi này luyện sửa khi đọc Gurmukhi. Romanization chỉ là cầu nối để tìm lỗi, không phải phát âm chấm điểm. Shahmukhi chỉ được nhắc để nhận biết Punjabi có hệ chữ khác; đây không phải khóa Shahmukhi đầy đủ. Native review được hoãn.",
  en: "This error deck trains Gurmukhi reading repair. Romanization is only a bridge for spotting errors, not pronunciation scoring. Shahmukhi is mentioned only so learners know Punjabi has another script; this is not a full Shahmukhi course. Native review is deferred.",
} as const;

const sections: ReadonlyArray<PunjabiScriptErrorSection> = [
  {
    category: "look_alike_letters",
    title_vi: "Chữ dễ nhìn nhầm",
    title_en: "Look-alike letters",
    focus_vi: "So sánh hình chữ trước khi dựa vào romanization.",
    focus_en: "Compare letter shapes before relying on romanization.",
    entries: [
      { id: "pa-error-look-001", category: "look_alike_letters", gurmukhi: "ਤ / ਟ", romanization: "t / t", errorPattern_vi: "Nhầm t răng ਤ với t quặt lưỡi ਟ vì romanization đều là t.", errorPattern_en: "Confusing dental ਤ with retroflex ਟ because both may romanize as t.", repair_vi: "Nhìn hình chữ trước: ਤ dùng trong ਤੁਸੀਂ, ਟ dùng trong ਟਿਕਟ.", repair_en: "Check the letter shape first: ਤ in ਤੁਸੀਂ, ਟ in ਟਿਕਟ.", drillPrompt_vi: "Chọn chữ trong ਟਿਕਟ và giải thích vì sao không phải ਤ.", drillPrompt_en: "Pick the letter in ਟਿਕਟ and explain why it is not ਤ.", canadaPractical: true },
      { id: "pa-error-look-002", category: "look_alike_letters", gurmukhi: "ਦ / ਡ", romanization: "d / d", errorPattern_vi: "Nhầm d răng ਦ với d quặt lưỡi ਡ.", errorPattern_en: "Confusing dental ਦ with retroflex ਡ.", repair_vi: "Đọc chậm theo từ mẫu: ਦਿਨ dùng ਦ, ਡਾਕਟਰ dùng ਡ.", repair_en: "Read through model words: ਦਿਨ uses ਦ, ਡਾਕਟਰ uses ਡ.", drillPrompt_vi: "Gạch chân chữ d trong ਡਾਕਟਰ.", drillPrompt_en: "Underline the d letter in ਡਾਕਟਰ.", canadaPractical: true },
      { id: "pa-error-look-003", category: "look_alike_letters", gurmukhi: "ਨ / ਣ", romanization: "n / n", errorPattern_vi: "Bỏ qua khác biệt giữa n thường ਨ và n quặt lưỡi ਣ.", errorPattern_en: "Missing the contrast between regular ਨ and retroflex ਣ.", repair_vi: "Ghi nhớ ਭੈਣ dùng ਣ, còn ਨਹੀਂ dùng ਨ.", repair_en: "Remember ਭੈਣ uses ਣ, while ਨਹੀਂ uses ਨ.", drillPrompt_vi: "Tìm chữ ਣ trong ਭੈਣ.", drillPrompt_en: "Find ਣ in ਭੈਣ." },
      { id: "pa-error-look-004", category: "look_alike_letters", gurmukhi: "ਪ / ਫ", romanization: "p / ph-f", errorPattern_vi: "Đọc ਫ như ਪ hoặc chỉ tìm bằng một kiểu ph/f.", errorPattern_en: "Reading ਫ as ਪ or searching with only one ph/f spelling.", repair_vi: "ਫ có thể hiện là ph hoặc f trong Latin; Gurmukhi là nguồn chính.", repair_en: "ਫ may appear as ph or f in Latin; Gurmukhi is the source.", drillPrompt_vi: "Tìm chữ ਫ trong ਫਾਰਮੇਸੀ.", drillPrompt_en: "Find ਫ in ਫਾਰਮੇਸੀ.", canadaPractical: true },
      { id: "pa-error-look-005", category: "look_alike_letters", gurmukhi: "ਬ / ਵ", romanization: "b / v-w", errorPattern_vi: "Nhầm ਬ với ਵ trong từ mượn và tên nơi chốn.", errorPattern_en: "Confusing ਬ and ਵ in loanwords and place names.", repair_vi: "ਬ là b; ਵ có thể gần v/w theo giọng.", repair_en: "ਬ is b; ਵ may be close to v/w by accent.", drillPrompt_vi: "So sánh ਬੱਸ và ਵੈਨਕੂਵਰ.", drillPrompt_en: "Compare ਬੱਸ and ਵੈਨਕੂਵਰ.", canadaPractical: true },
      { id: "pa-error-look-006", category: "look_alike_letters", gurmukhi: "ਸ / ਸ਼", romanization: "s / sh", errorPattern_vi: "Bỏ qua dấu dưới của ਸ਼ và đọc như ਸ.", errorPattern_en: "Ignoring the lower dot in ਸ਼ and reading it like ਸ.", repair_vi: "ਸ਼ thường gợi sh; ਸ là s.", repair_en: "ਸ਼ often cues sh; ਸ is s.", drillPrompt_vi: "Tìm ਸ਼ trong ਸਟੇਸ਼ਨ.", drillPrompt_en: "Find ਸ਼ in ਸਟੇਸ਼ਨ.", canadaPractical: true },
    ],
  },
  {
    category: "vowel_signs",
    title_vi: "Lỗi dấu nguyên âm",
    title_en: "Vowel sign errors",
    focus_vi: "Sửa lỗi đọc theo vị trí viết thay vì giá trị âm.",
    focus_en: "Repair reading by vowel value, not only written position.",
    entries: [
      { id: "pa-error-vowel-001", category: "vowel_signs", gurmukhi: "ਕਿ", romanization: "ki", errorPattern_vi: "Đọc ਿ trước phụ âm vì dấu viết bên trái.", errorPattern_en: "Reading ਿ before the consonant because it is written on the left.", repair_vi: "Dù viết trước, ਕਿ vẫn đọc ki.", repair_en: "Even though it is written before, ਕਿ reads ki.", drillPrompt_vi: "Đọc ਕਿ rồi so sánh với ਕੀ.", drillPrompt_en: "Read ਕਿ and compare it with ਕੀ." },
      { id: "pa-error-vowel-002", category: "vowel_signs", gurmukhi: "ਕੀ", romanization: "ki/kii", errorPattern_vi: "Không nhận ra ੀ là i dài vì romanization đôi khi vẫn ghi ki.", errorPattern_en: "Missing long ੀ because romanization may still show ki.", repair_vi: "Ưu tiên dấu Gurmukhi; ੀ là i dài.", repair_en: "Trust the Gurmukhi sign; ੀ is long i.", drillPrompt_vi: "Tìm ੀ trong ਕੀ.", drillPrompt_en: "Find ੀ in ਕੀ." },
      { id: "pa-error-vowel-003", category: "vowel_signs", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", errorPattern_vi: "Nhầm ੁ và ੂ vì cả hai nằm dưới phụ âm.", errorPattern_en: "Confusing ੁ and ੂ because both sit below the consonant.", repair_vi: "ੁ ngắn hơn, ੂ dài hơn; nhìn độ dài dấu.", repair_en: "ੁ is shorter, ੂ is longer; look at the sign shape.", drillPrompt_vi: "Chỉ ra dấu khác nhau trong ਕੁ và ਕੂ.", drillPrompt_en: "Point out the different sign in ਕੁ and ਕੂ." },
      { id: "pa-error-vowel-004", category: "vowel_signs", gurmukhi: "ਕੇ / ਕੈ", romanization: "ke / kai", errorPattern_vi: "Nhầm ੇ với ੈ khi đọc nhanh.", errorPattern_en: "Confusing ੇ with ੈ during fast reading.", repair_vi: "ਕੇ có e; ਕੈ có ai/ae.", repair_en: "ਕੇ has e; ਕੈ has ai/ae.", drillPrompt_vi: "Đọc ਮੇਰਾ và ਭੈਣ, chú ý ੇ/ੈ.", drillPrompt_en: "Read ਮੇਰਾ and ਭੈਣ, watching ੇ/ੈ." },
      { id: "pa-error-vowel-005", category: "vowel_signs", gurmukhi: "ਕੋ / ਕੌ", romanization: "ko / kau", errorPattern_vi: "Nhầm ੋ với ੌ vì hình gần giống nhau.", errorPattern_en: "Confusing ੋ and ੌ because their shapes are close.", repair_vi: "ਕੋ đọc ko, ਕੌ đọc kau.", repair_en: "ਕੋ reads ko, ਕੌ reads kau.", drillPrompt_vi: "Tìm ੌ trong ਨੌਂ.", drillPrompt_en: "Find ੌ in ਨੌਂ." },
      { id: "pa-error-vowel-006", category: "vowel_signs", gurmukhi: "ਬੈਂਕ", romanization: "bank", errorPattern_vi: "Đọc từ mượn theo tiếng Anh mà bỏ qua dấu Gurmukhi.", errorPattern_en: "Reading a loanword by English spelling while ignoring Gurmukhi signs.", repair_vi: "Nhận diện ਬ + ੈ + nasal mark trong ਬੈਂਕ.", repair_en: "Recognize ਬ + ੈ + nasal mark in ਬੈਂਕ.", drillPrompt_vi: "Tách các phần trong ਬੈਂਕ.", drillPrompt_en: "Break apart ਬੈਂਕ.", canadaPractical: true },
    ],
  },
  {
    category: "addak",
    title_vi: "Lỗi addak",
    title_en: "Addak errors",
    focus_vi: "Không bỏ qua ੱ khi đọc từ ngắn.",
    focus_en: "Do not skip ੱ in short words.",
    entries: [
      { id: "pa-error-addak-001", category: "addak", gurmukhi: "ਇੱਕ", romanization: "ikk", errorPattern_vi: "Đọc như ik và bỏ phụ âm mạnh.", errorPattern_en: "Reading it like ik and dropping the strengthened consonant.", repair_vi: "ੱ báo kk; từ này nghĩa là một.", repair_en: "ੱ marks kk; this word means one.", drillPrompt_vi: "Chỉ ra ੱ trong ਇੱਕ.", drillPrompt_en: "Point to ੱ in ਇੱਕ." },
      { id: "pa-error-addak-002", category: "addak", gurmukhi: "ਅੱਜ", romanization: "ajj", errorPattern_vi: "Bỏ qua ੱ và đọc quá nhẹ.", errorPattern_en: "Skipping ੱ and reading too lightly.", repair_vi: "ਅੱਜ có jj; nghĩa là hôm nay.", repair_en: "ਅੱਜ has jj; it means today.", drillPrompt_vi: "Đọc ਅੱਜ rồi tìm chữ được nhân mạnh.", drillPrompt_en: "Read ਅੱਜ and find the strengthened letter." },
      { id: "pa-error-addak-003", category: "addak", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", errorPattern_vi: "Nhầm ਵ v/w và bỏ addak trong cùng một từ.", errorPattern_en: "Confusing ਵ v/w and also dropping addak in one word.", repair_vi: "Sửa theo hai bước: ਵ là v/w, ੱ báo dd.", repair_en: "Repair in two steps: ਵ is v/w, ੱ marks dd.", drillPrompt_vi: "Tách ਵੱਡਾ thành chữ đầu, addak, và dd.", drillPrompt_en: "Split ਵੱਡਾ into first letter, addak, and dd." },
      { id: "pa-error-addak-004", category: "addak", gurmukhi: "ਬੱਚਾ", romanization: "bachcha", errorPattern_vi: "Đọc như bacha và mất chch.", errorPattern_en: "Reading like bacha and losing chch.", repair_vi: "ੱ báo phụ âm mạnh trong ਬੱਚਾ.", repair_en: "ੱ marks a strengthened consonant in ਬੱਚਾ.", drillPrompt_vi: "Tìm addak trong ਬੱਚਾ.", drillPrompt_en: "Find addak in ਬੱਚਾ." },
      { id: "pa-error-addak-005", category: "addak", gurmukhi: "ਛੁੱਟੀ", romanization: "chhutti", errorPattern_vi: "Bỏ addak trong từ nghỉ phép/ngày nghỉ.", errorPattern_en: "Dropping addak in the word for leave/day off.", repair_vi: "ਛੁੱਟੀ có ੱ trước ਟੀ, nên đọc kỹ.", repair_en: "ਛੁੱਟੀ has ੱ before ਟੀ.", drillPrompt_vi: "Đọc ਛੁੱਟੀ trên lịch làm việc.", drillPrompt_en: "Read ਛੁੱਟੀ on a work schedule.", canadaPractical: true },
    ],
  },
  {
    category: "tippi_bindi",
    title_vi: "Lỗi tippi/bindi",
    title_en: "Tippi/bindi errors",
    focus_vi: "Nhìn dấu mũi hóa trong chữ thay vì đoán bằng Latin.",
    focus_en: "Notice nasal marks in the script instead of guessing from Latin.",
    entries: [
      { id: "pa-error-nasal-001", category: "tippi_bindi", gurmukhi: "ਮਾਂ", romanization: "maan", errorPattern_vi: "Tìm bằng man rồi không nhận ra ਮਾਂ.", errorPattern_en: "Searching man and not recognizing ਮਾਂ.", repair_vi: "ਂ báo mũi hóa; thử maan/man khi tìm kiếm.", repair_en: "ਂ marks nasalization; try maan/man when searching.", drillPrompt_vi: "Tìm bindi trong ਮਾਂ.", drillPrompt_en: "Find bindi in ਮਾਂ." },
      { id: "pa-error-nasal-002", category: "tippi_bindi", gurmukhi: "ਹਾਂ", romanization: "haan", errorPattern_vi: "Bỏ dấu mũi trong từ vâng/có.", errorPattern_en: "Dropping the nasal mark in the word for yes.", repair_vi: "ਹਾਂ có ਂ phía trên chữ, cần giữ khi đọc.", repair_en: "ਹਾਂ has ਂ above the letter, so keep it in reading.", drillPrompt_vi: "So sánh ਹਾਂ và ਹਾ.", drillPrompt_en: "Compare ਹਾਂ and ਹਾ." },
      { id: "pa-error-nasal-003", category: "tippi_bindi", gurmukhi: "ਪੰਜਾਬੀ", romanization: "punjabi", errorPattern_vi: "Không thấy ੰ trong tên ngôn ngữ.", errorPattern_en: "Missing ੰ in the language name.", repair_vi: "ਪੰਜਾਬੀ có ੰ sau ਪੁ trong tên ngôn ngữ.", repair_en: "ਪੰਜਾਬੀ has ੰ after ਪੁ.", drillPrompt_vi: "Tìm ੰ trong ਪੰਜਾਬੀ.", drillPrompt_en: "Find ੰ in ਪੰਜਾਬੀ." },
      { id: "pa-error-nasal-004", category: "tippi_bindi", gurmukhi: "ਕੰਮ", romanization: "kamm", errorPattern_vi: "Nhầm tippi với addak hoặc bỏ một trong hai.", errorPattern_en: "Confusing tippi with addak or dropping one of them.", repair_vi: "ਕੰਮ có ੰ và phụ âm mạnh; đọc theo chữ.", repair_en: "ਕੰਮ has ੰ and a strengthened consonant; read from the script.", drillPrompt_vi: "Tách ਕੰਮ thành k + nasal + mm.", drillPrompt_en: "Split ਕੰਮ into k + nasal + mm.", canadaPractical: true },
      { id: "pa-error-nasal-005", category: "tippi_bindi", gurmukhi: "ਕਿੰਨਾ", romanization: "kinna", errorPattern_vi: "Không xử lý được cả ਿ, ੰ và ੱ trong một từ.", errorPattern_en: "Struggling with ਿ, ੰ, and ੱ in one word.", repair_vi: "Đọc chậm: ਕਿ + nasal + nna.", repair_en: "Read slowly: ki + nasal + nna.", drillPrompt_vi: "Đánh dấu ba chi tiết trong ਕਿੰਨਾ.", drillPrompt_en: "Mark the three details in ਕਿੰਨਾ." },
    ],
  },
  {
    category: "romanization_traps",
    title_vi: "Bẫy romanization",
    title_en: "Romanization traps",
    focus_vi: "Dùng Latin để sửa lỗi, nhưng quay lại Gurmukhi để xác nhận.",
    focus_en: "Use Latin to repair, but return to Gurmukhi to confirm.",
    entries: [
      { id: "pa-error-roman-001", category: "romanization_traps", gurmukhi: "ਫਲ", romanization: "phal/fal", errorPattern_vi: "Chỉ tìm phal nên bỏ lỡ tài liệu ghi fal.", errorPattern_en: "Searching only phal and missing materials that write fal.", repair_vi: "Thử cả ph/f, sau đó xác nhận bằng ਫ.", repair_en: "Try both ph/f, then confirm with ਫ.", drillPrompt_vi: "Viết hai cách tìm Latin cho ਫਲ.", drillPrompt_en: "Write two Latin searches for ਫਲ." },
      { id: "pa-error-roman-002", category: "romanization_traps", gurmukhi: "ਵੈਨਕੂਵਰ", romanization: "vancouver/wancouver", errorPattern_vi: "Không nhận ra ਵ có thể gần v hoặc w.", errorPattern_en: "Not recognizing that ਵ may be close to v or w.", repair_vi: "Tìm bằng v trước, nhưng nhớ chữ gốc là ਵ.", repair_en: "Search with v first, but remember the original letter is ਵ.", drillPrompt_vi: "Tìm ਵ trong ਵੈਨਕੂਵਰ.", drillPrompt_en: "Find ਵ in ਵੈਨਕੂਵਰ.", canadaPractical: true },
      { id: "pa-error-roman-003", category: "romanization_traps", gurmukhi: "ਕੀ", romanization: "ki/kii", errorPattern_vi: "Nghĩ ki và kii là hai từ khác nhau.", errorPattern_en: "Thinking ki and kii are necessarily different words.", repair_vi: "Kiểm tra Gurmukhi: ਕੀ có ੀ.", repair_en: "Check Gurmukhi: ਕੀ has ੀ.", drillPrompt_vi: "Tìm dấu ੀ trong ਕੀ.", drillPrompt_en: "Find ੀ in ਕੀ." },
      { id: "pa-error-roman-004", category: "romanization_traps", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", errorPattern_vi: "Chỉ nhận một cách viết shahir/shehar.", errorPattern_en: "Recognizing only one spelling, shahir or shehar.", repair_vi: "Gurmukhi ਸ਼ਹਿਰ là điểm neo chính.", repair_en: "Gurmukhi ਸ਼ਹਿਰ is the main anchor.", drillPrompt_vi: "Tìm ਸ਼ trong ਸ਼ਹਿਰ.", drillPrompt_en: "Find ਸ਼ in ਸ਼ਹਿਰ." },
      { id: "pa-error-roman-005", category: "romanization_traps", gurmukhi: "ਟੋਰਾਂਟੋ", romanization: "toronto", errorPattern_vi: "Đọc tên Canada theo tiếng Anh và bỏ dấu Gurmukhi.", errorPattern_en: "Reading a Canadian place name by English spelling and ignoring Gurmukhi marks.", repair_vi: "Nhận diện ਟ, ਾਂ, ਅਤੇ ਟੋ trong ਟੋਰਾਂਟੋ.", repair_en: "Recognize ਟ, ਾਂ, and ਟੋ in ਟੋਰਾਂਟੋ.", drillPrompt_vi: "Tách ਟੋਰਾਂਟੋ thành các khối đọc.", drillPrompt_en: "Break ਟੋਰਾਂਟੋ into reading chunks.", canadaPractical: true },
    ],
  },
  {
    category: "word_boundary",
    title_vi: "Lỗi ranh giới từ",
    title_en: "Word-boundary errors",
    focus_vi: "Không ghép hoặc tách sai các cụm thực tế.",
    focus_en: "Avoid wrongly joining or splitting practical phrases.",
    entries: [
      { id: "pa-error-boundary-001", category: "word_boundary", gurmukhi: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", romanization: "sat sri akaal", errorPattern_vi: "Cố đọc lời chào như một từ liền.", errorPattern_en: "Trying to read the greeting as one merged word.", repair_vi: "Đọc theo ba khối: ਸਤਿ / ਸ੍ਰੀ / ਅਕਾਲ.", repair_en: "Read in three chunks: ਸਤਿ / ਸ੍ਰੀ / ਅਕਾਲ.", drillPrompt_vi: "Đánh dấu ba khoảng trắng trong ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ.", drillPrompt_en: "Mark the three chunks in ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ." },
      { id: "pa-error-boundary-002", category: "word_boundary", gurmukhi: "ਰੇਲਵੇ ਸਟੇਸ਼ਨ", romanization: "railway station", errorPattern_vi: "Tách sai từ mượn trên biển nhà ga.", errorPattern_en: "Splitting a loan phrase incorrectly on station signs.", repair_vi: "Giữ hai khối: ਰੇਲਵੇ + ਸਟੇਸ਼ਨ.", repair_en: "Keep two chunks: ਰੇਲਵੇ + ਸਟੇਸ਼ਨ.", drillPrompt_vi: "Đọc biển ਰੇਲਵੇ ਸਟੇਸ਼ਨ.", drillPrompt_en: "Read the sign ਰੇਲਵੇ ਸਟੇਸ਼ਨ.", canadaPractical: true },
      { id: "pa-error-boundary-003", category: "word_boundary", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", errorPattern_vi: "Ghép thành một từ và bỏ addak trong ਅੱਡਾ.", errorPattern_en: "Merging into one word and dropping addak in ਅੱਡਾ.", repair_vi: "Đọc hai từ; ਅੱਡਾ có ੱ.", repair_en: "Read two words; ਅੱਡਾ has ੱ.", drillPrompt_vi: "Tìm khoảng trắng và addak trong ਬੱਸ ਅੱਡਾ.", drillPrompt_en: "Find the space and addak in ਬੱਸ ਅੱਡਾ.", canadaPractical: true },
      { id: "pa-error-boundary-004", category: "word_boundary", gurmukhi: "ਡਾਕ ਘਰ", romanization: "daak ghar", errorPattern_vi: "Không nhận ra cụm nghĩa là bưu điện.", errorPattern_en: "Not recognizing the phrase as post office.", repair_vi: "Đọc từng từ: ਡਾਕ là thư/bưu chính, ਘਰ là nhà.", repair_en: "Read each word: ਡਾਕ is mail/post, ਘਰ is house.", drillPrompt_vi: "Đọc ਡਾਕ ਘਰ trên biển dịch vụ công.", drillPrompt_en: "Read ਡਾਕ ਘਰ on a public-service sign.", canadaPractical: true },
      { id: "pa-error-boundary-005", category: "word_boundary", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", errorPattern_vi: "Mất ranh giới trong câu cần giúp đỡ.", errorPattern_en: "Losing word boundaries in a help-seeking sentence.", repair_vi: "Đọc bốn khối: ਮੈਨੂੰ / ਮਦਦ / ਚਾਹੀਦੀ / ਹੈ.", repair_en: "Read four chunks: ਮੈਨੂੰ / ਮਦਦ / ਚਾਹੀਦੀ / ਹੈ.", drillPrompt_vi: "Gạch các khoảng trắng trong câu này.", drillPrompt_en: "Mark the spaces in this sentence.", canadaPractical: true },
    ],
  },
  {
    category: "reading_repair",
    title_vi: "Drill sửa lỗi đọc thực tế",
    title_en: "Practical reading repair drills",
    focus_vi: "Áp dụng nhiều dấu hiệu cùng lúc trong từ/cụm Canada thực dụng.",
    focus_en: "Apply multiple cues at once in practical Canada-use words and phrases.",
    entries: [
      { id: "pa-error-repair-001", category: "reading_repair", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy", errorPattern_vi: "Đọc theo tiếng Anh và không thấy ਫ.", errorPattern_en: "Reading by English spelling and not noticing ਫ.", repair_vi: "Xác nhận chữ đầu ਫ và đọc như từ mượn Gurmukhi.", repair_en: "Confirm initial ਫ and read it as a Gurmukhi loanword.", drillPrompt_vi: "Khoanh ਫ trong ਫਾਰਮੇਸੀ.", drillPrompt_en: "Circle ਫ in ਫਾਰਮੇਸੀ.", canadaPractical: true },
      { id: "pa-error-repair-002", category: "reading_repair", gurmukhi: "ਲਾਇਬ੍ਰੇਰੀ", romanization: "library", errorPattern_vi: "Nhìn từ dài rồi đoán hoàn toàn theo tiếng Anh.", errorPattern_en: "Seeing a long word and guessing entirely from English.", repair_vi: "Tách thành ਲਾਇ + ਬ੍ਰੇ + ਰੀ.", repair_en: "Split into ਲਾਇ + ਬ੍ਰੇ + ਰੀ.", drillPrompt_vi: "Tách ਲਾਇਬ੍ਰੇਰੀ thành ba khối.", drillPrompt_en: "Split ਲਾਇਬ੍ਰੇਰੀ into three chunks.", canadaPractical: true },
      { id: "pa-error-repair-003", category: "reading_repair", gurmukhi: "ਹਸਪਤਾਲ", romanization: "haspataal", errorPattern_vi: "Đọc thiếu âm tiết giữa trong từ bệnh viện.", errorPattern_en: "Dropping the middle chunk in the word hospital.", repair_vi: "Đọc chậm theo khối ਹਸ + ਪ + ਤਾਲ.", repair_en: "Read slowly as chunks: ਹਸ + ਪ + ਤਾਲ.", drillPrompt_vi: "Tách ਹਸਪਤਾਲ thành các khối.", drillPrompt_en: "Break ਹਸਪਤਾਲ into chunks.", canadaPractical: true },
      { id: "pa-error-repair-004", category: "reading_repair", gurmukhi: "ਪੁਲਿਸ ਥਾਣਾ", romanization: "pulis thana", errorPattern_vi: "Nhầm cụm đồn cảnh sát vì không đọc từng từ.", errorPattern_en: "Misreading police station because the phrase is not chunked.", repair_vi: "Đọc ਪੁਲਿਸ rồi ਥਾਣਾ; đây là cụm hai từ.", repair_en: "Read ਪੁਲਿਸ then ਥਾਣਾ; this is a two-word phrase.", drillPrompt_vi: "Tìm ranh giới từ trong ਪੁਲਿਸ ਥਾਣਾ.", drillPrompt_en: "Find the word boundary in ਪੁਲਿਸ ਥਾਣਾ.", canadaPractical: true },
      { id: "pa-error-repair-005", category: "reading_repair", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", errorPattern_vi: "Đọc nhầm khi gặp giấy thuê nhà.", errorPattern_en: "Misreading the word on rental paperwork.", repair_vi: "Nhớ ਕਿ đọc ki dù ਿ viết trước; từ nghĩa là tiền thuê.", repair_en: "Remember ਕਿ reads ki although ਿ is written before; the word means rent.", drillPrompt_vi: "Tìm ਿ trong ਕਿਰਾਇਆ.", drillPrompt_en: "Find ਿ in ਕਿਰਾਇਆ.", canadaPractical: true },
      { id: "pa-error-repair-006", category: "reading_repair", gurmukhi: "ਡਾਲਰ", romanization: "dollar", errorPattern_vi: "Đọc như tiếng Anh và bỏ qua ਡ quặt lưỡi.", errorPattern_en: "Reading like English and ignoring retroflex ਡ.", repair_vi: "Xác nhận chữ đầu ਡ khi đọc từ đô la.", repair_en: "Confirm initial ਡ when reading the word dollar.", drillPrompt_vi: "Chỉ ra ਡ trong ਡਾਲਰ.", drillPrompt_en: "Point out ਡ in ਡਾਲਰ.", canadaPractical: true },
    ],
  },
  {
    category: "shahmukhi_awareness",
    title_vi: "Nhận biết Shahmukhi",
    title_en: "Shahmukhi awareness",
    focus_vi: "Giữ trọng tâm Gurmukhi và chỉ nhận biết hệ chữ khác.",
    focus_en: "Keep Gurmukhi primary and only recognize that another script exists.",
    entries: [
      { id: "pa-error-shahmukhi-001", category: "shahmukhi_awareness", gurmukhi: "ਪੰਜਾਬੀ", romanization: "punjabi", errorPattern_vi: "Nghĩ mọi chữ Punjabi đều là Gurmukhi hoặc cần học Shahmukhi đầy đủ ở đây.", errorPattern_en: "Assuming all Punjabi writing is Gurmukhi or that this deck teaches full Shahmukhi.", repair_vi: "Khóa này dùng Gurmukhi chính. Shahmukhi chỉ là nhận biết, không phải khóa Shahmukhi đầy đủ.", repair_en: "This course uses Gurmukhi as primary. Shahmukhi is awareness only, not a full Shahmukhi course.", drillPrompt_vi: "Ghi nhớ: sửa lỗi trong bộ này luôn dựa trên Gurmukhi.", drillPrompt_en: "Remember: repair in this deck is based on Gurmukhi." },
    ],
  },
];

export const PUNJABI_SCRIPT_ERROR_DECK = sections;

export const PUNJABI_SCRIPT_ERROR_ENTRIES: ReadonlyArray<PunjabiScriptErrorEntry> =
  sections.flatMap((section) => section.entries);

export default PUNJABI_SCRIPT_ERROR_DECK;
