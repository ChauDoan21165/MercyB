// src/languages/punjabi/scriptVocabularyCapstone.ts
//
// Punjabi script and vocabulary capstone for Vietnamese-speaking and
// English-speaking learners. Gurmukhi is primary; romanization is a bridge.
// No audio, pronunciation scoring, or native-review claim.

export type PunjabiCapstoneSkill =
  | "gurmukhi_recognition"
  | "vowel_signs"
  | "common_words"
  | "survival_signage"
  | "thematic_vocabulary"
  | "high_frequency_verbs"
  | "collocations"
  | "romanization_bridge"
  | "checkpoint"
  | "shahmukhi_awareness";

export type PunjabiCapstoneLevel = "A1" | "A2" | "B1" | "B2";

export type PunjabiCapstoneItem = {
  id: string;
  skill: PunjabiCapstoneSkill;
  level: PunjabiCapstoneLevel;
  gurmukhi: string;
  romanization?: string;
  prompt_vi: string;
  prompt_en: string;
  expected_vi: string;
  expected_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  checkpoint?: boolean;
};

export type PunjabiCapstoneSection = {
  skill: PunjabiCapstoneSkill;
  title_vi: string;
  title_en: string;
  goal_vi: string;
  goal_en: string;
  items: ReadonlyArray<PunjabiCapstoneItem>;
};

export const PUNJABI_SCRIPT_VOCABULARY_CAPSTONE_SCOPE = {
  vi: "Capstone này ôn Gurmukhi, từ vựng, biển hiệu, động từ và cụm thường gặp. Romanization giúp đọc và tìm kiếm, không phải phát âm chấm điểm. Shahmukhi chỉ được nhắc để nhận biết Punjabi có hệ chữ khác; đây không phải khóa Shahmukhi đầy đủ. Native review được hoãn.",
  en: "This capstone reviews Gurmukhi, vocabulary, signage, verbs, and common phrases. Romanization supports reading and search, not pronunciation scoring. Shahmukhi is mentioned only so learners know Punjabi has another script; this is not a full Shahmukhi course. Native review is deferred.",
} as const;

const sections: ReadonlyArray<PunjabiCapstoneSection> = [
  {
    skill: "gurmukhi_recognition",
    title_vi: "Nhận diện Gurmukhi",
    title_en: "Gurmukhi Recognition",
    goal_vi: "Nhận ra chữ cái và cặp chữ dễ nhầm trước khi đọc từ.",
    goal_en: "Recognize letters and confusing pairs before reading words.",
    items: [
      { id: "pa-capstone-script-001", skill: "gurmukhi_recognition", level: "A1", gurmukhi: "ਕ / ਖ", romanization: "k / kh", prompt_vi: "Chỉ ra chữ bật hơi trong cặp này.", prompt_en: "Identify the aspirated letter in this pair.", expected_vi: "ਖ là kh bật hơi; ਕ là k không bật hơi.", expected_en: "ਖ is aspirated kh; ਕ is unaspirated k.", learnerTrap: { vi: "kh trong romanization không phải hai chữ Latin riêng.", en: "kh in romanization is not two separate Latin letters." } },
      { id: "pa-capstone-script-002", skill: "gurmukhi_recognition", level: "A1", gurmukhi: "ਤ / ਟ", romanization: "t / t", prompt_vi: "Cặp này khác nhau thế nào?", prompt_en: "How does this pair differ?", expected_vi: "ਤ là t răng; ਟ là t quặt lưỡi.", expected_en: "ਤ is dental t; ਟ is retroflex t.", learnerTrap: { vi: "Latin t không đủ để phân biệt hai chữ.", en: "Latin t is not enough to distinguish the two letters." } },
      { id: "pa-capstone-script-003", skill: "gurmukhi_recognition", level: "A2", gurmukhi: "ਸ / ਸ਼", romanization: "s / sh", prompt_vi: "Dấu dưới trong ਸ਼ báo điều gì?", prompt_en: "What does the lower mark in ਸ਼ signal?", expected_vi: "ਸ਼ thường đọc/gợi sh, còn ਸ là s.", expected_en: "ਸ਼ usually cues sh, while ਸ is s.", learnerTrap: { vi: "Đừng bỏ qua dấu dưới khi đọc biển.", en: "Do not ignore the lower mark when reading signs." } },
      { id: "pa-capstone-script-004", skill: "gurmukhi_recognition", level: "A2", gurmukhi: "ਬ / ਵ", romanization: "b / v-w", prompt_vi: "Phân biệt hai chữ trong từ mượn.", prompt_en: "Distinguish these letters in loanwords.", expected_vi: "ਬ là b; ਵ có thể gần v/w theo giọng.", expected_en: "ਬ is b; ਵ can be close to v/w by accent." },
    ],
  },
  {
    skill: "vowel_signs",
    title_vi: "Dấu nguyên âm",
    title_en: "Vowel Signs",
    goal_vi: "Đọc dấu nguyên âm theo giá trị âm, không chỉ theo vị trí viết.",
    goal_en: "Read vowel signs by sound value, not only written position.",
    items: [
      { id: "pa-capstone-vowel-001", skill: "vowel_signs", level: "A1", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / ki-kii", prompt_vi: "So sánh hai âm tiết này.", prompt_en: "Compare these two syllables.", expected_vi: "ਕਿ có ਿ i ngắn; ਕੀ có ੀ i dài.", expected_en: "ਕਿ has short ਿ; ਕੀ has long ੀ.", learnerTrap: { vi: "ਿ viết trước nhưng đọc sau phụ âm.", en: "ਿ is written before but read after the consonant." } },
      { id: "pa-capstone-vowel-002", skill: "vowel_signs", level: "A1", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", prompt_vi: "Dấu nào dài hơn?", prompt_en: "Which sign is longer?", expected_vi: "ਕੂ dùng ੂ cho âm u dài; ਕੁ dùng ੁ ngắn.", expected_en: "ਕੂ uses ੂ for long u; ਕੁ uses short ੁ." },
      { id: "pa-capstone-vowel-003", skill: "vowel_signs", level: "A2", gurmukhi: "ਕੇ / ਕੈ", romanization: "ke / kai", prompt_vi: "Đọc cặp e và ai/ae.", prompt_en: "Read the e and ai/ae pair.", expected_vi: "ਕੇ là ke; ਕੈ là kai/kae.", expected_en: "ਕੇ is ke; ਕੈ is kai/kae." },
      { id: "pa-capstone-vowel-004", skill: "vowel_signs", level: "A2", gurmukhi: "ਨੌਂ", romanization: "naun", prompt_vi: "Tìm dấu au và dấu mũi hóa.", prompt_en: "Find the au sign and nasal mark.", expected_vi: "ੌ tạo au; ਂ báo mũi hóa.", expected_en: "ੌ creates au; ਂ marks nasalization.", learnerTrap: { vi: "Romanization có thể không ghi rõ mọi dấu.", en: "Romanization may not show every mark clearly." } },
    ],
  },
  {
    skill: "common_words",
    title_vi: "Từ thông dụng",
    title_en: "Common Words",
    goal_vi: "Đọc các từ cốt lõi bằng Gurmukhi và hiểu nghĩa nhanh.",
    goal_en: "Read core words in Gurmukhi and understand them quickly.",
    items: [
      { id: "pa-capstone-word-001", skill: "common_words", level: "A1", gurmukhi: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", romanization: "sat sri akaal", prompt_vi: "Nhận diện lời chào này.", prompt_en: "Identify this greeting.", expected_vi: "Đây là lời chào Punjabi/Sikh phổ biến.", expected_en: "This is a common Punjabi/Sikh greeting." },
      { id: "pa-capstone-word-002", skill: "common_words", level: "A1", gurmukhi: "ਪਾਣੀ", romanization: "pani", prompt_vi: "Từ này nghĩa là gì?", prompt_en: "What does this word mean?", expected_vi: "ਪਾਣੀ nghĩa là nước uống.", expected_en: "ਪਾਣੀ means drinking water.", canadaPractical: true },
      { id: "pa-capstone-word-003", skill: "common_words", level: "A1", gurmukhi: "ਘਰ", romanization: "ghar", prompt_vi: "Đọc từ nơi chốn này.", prompt_en: "Read this place word.", expected_vi: "ਘਰ nghĩa là nhà hoặc chỗ ở.", expected_en: "ਘਰ means home or house.", },
      { id: "pa-capstone-word-004", skill: "common_words", level: "A2", gurmukhi: "ਕਿੱਥੇ", romanization: "kitthe", prompt_vi: "Từ hỏi này dùng khi nào?", prompt_en: "When is this question word used?", expected_vi: "ਕਿੱਥੇ nghĩa là ở đâu.", expected_en: "ਕਿੱਥੇ means where or at what place.", learnerTrap: { vi: "ਿ viết trước nhưng vẫn đọc ki.", en: "ਿ is written before but still read as ki." } },
    ],
  },
  {
    skill: "survival_signage",
    title_vi: "Biển hiệu sinh tồn",
    title_en: "Survival Signage",
    goal_vi: "Đọc biển thực tế ở Canada trong y tế, giao thông và dịch vụ.",
    goal_en: "Read practical Canadian signs in health, transit, and services.",
    items: [
      { id: "pa-capstone-sign-001", skill: "survival_signage", level: "A1", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", prompt_vi: "Bạn thấy biển này ở bệnh viện.", prompt_en: "You see this sign at a hospital.", expected_vi: "Đây là cấp cứu; dùng khi cần trợ giúp khẩn cấp.", expected_en: "This is emergency; use it for urgent help.", canadaPractical: true },
      { id: "pa-capstone-sign-002", skill: "survival_signage", level: "A1", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", prompt_vi: "Biển này chỉ gì?", prompt_en: "What does this sign indicate?", expected_vi: "ਨਿਕਾਸ là lối ra khỏi nơi đó.", expected_en: "ਨਿਕਾਸ means an exit from the place.", canadaPractical: true },
      { id: "pa-capstone-sign-003", skill: "survival_signage", level: "A2", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", prompt_vi: "Tìm bẫy romanization trong biển này.", prompt_en: "Find the romanization trap in this sign.", expected_vi: "ਫ có thể tìm bằng ph hoặc f; nghĩa là nhà thuốc.", expected_en: "ਫ may be searched as ph or f; it means pharmacy.", learnerTrap: { vi: "Ưu tiên nhận diện ਫ trong Gurmukhi.", en: "Prioritize recognizing ਫ in Gurmukhi." }, canadaPractical: true },
      { id: "pa-capstone-sign-004", skill: "survival_signage", level: "A2", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", prompt_vi: "Bạn cần làm gì khi thấy biển này?", prompt_en: "What should you do when you see this sign?", expected_vi: "Đây là bến xe buýt; đến đây để chờ xe.", expected_en: "This is a bus stand/stop; go here to wait for the bus.", learnerTrap: { vi: "ਅੱਡਾ có addak; đừng bỏ qua.", en: "ਅੱਡਾ has addak; do not skip it." }, canadaPractical: true },
    ],
  },
  {
    skill: "thematic_vocabulary",
    title_vi: "Từ vựng theo chủ đề",
    title_en: "Thematic Vocabulary",
    goal_vi: "Kết nối từ với tình huống nhà, gia đình, sức khỏe, tiền và trường học.",
    goal_en: "Connect words to home, family, health, money, and school situations.",
    items: [
      { id: "pa-capstone-theme-001", skill: "thematic_vocabulary", level: "A1", gurmukhi: "ਪਰਿਵਾਰ", romanization: "parivaar", prompt_vi: "Xếp từ này vào chủ đề nào?", prompt_en: "Which theme does this word fit?", expected_vi: "ਪਰਿਵਾਰ thuộc chủ đề gia đình.", expected_en: "ਪਰਿਵਾਰ belongs to the family theme." },
      { id: "pa-capstone-theme-002", skill: "thematic_vocabulary", level: "A1", gurmukhi: "ਦਵਾਈ", romanization: "davai", prompt_vi: "Từ này hữu ích ở đâu?", prompt_en: "Where is this word useful?", expected_vi: "ਦਵਾਈ nghĩa là thuốc; hữu ích ở phòng khám/nhà thuốc.", expected_en: "ਦਵਾਈ means medicine; useful at clinics/pharmacies.", canadaPractical: true },
      { id: "pa-capstone-theme-003", skill: "thematic_vocabulary", level: "A2", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", prompt_vi: "Từ này thuộc tình huống nào?", prompt_en: "Which situation does this word belong to?", expected_vi: "ਕਿਰਾਇਆ là tiền thuê, dùng trong nhà ở.", expected_en: "ਕਿਰਾਇਆ means rent, used in housing.", canadaPractical: true },
      { id: "pa-capstone-theme-004", skill: "thematic_vocabulary", level: "A2", gurmukhi: "ਬੈਂਕ", romanization: "bank", prompt_vi: "Từ này nghĩa là gì?", prompt_en: "What does this word mean?", expected_vi: "ਬੈਂਕ nghĩa là ngân hàng.", expected_en: "ਬੈਂਕ means a bank branch.", learnerTrap: { vi: "ੈਂ không khớp hoàn toàn với chữ Latin.", en: "ੈਂ does not map perfectly to Latin spelling." }, canadaPractical: true },
    ],
  },
  {
    skill: "high_frequency_verbs",
    title_vi: "Động từ tần suất cao",
    title_en: "High-Frequency Verbs",
    goal_vi: "Nhận diện động từ lõi và dùng trong câu ngắn.",
    goal_en: "Recognize core verbs and use them in short sentences.",
    items: [
      { id: "pa-capstone-verb-001", skill: "high_frequency_verbs", level: "A1", gurmukhi: "ਕਰਨਾ", romanization: "karna", prompt_vi: "Động từ này thường kết hợp thế nào?", prompt_en: "How does this verb often combine?", expected_vi: "ਕਰਨਾ nghĩa là làm và thường đi với danh từ.", expected_en: "ਕਰਨਾ means to do and often combines with nouns." },
      { id: "pa-capstone-verb-002", skill: "high_frequency_verbs", level: "A1", gurmukhi: "ਲੈਣਾ", romanization: "laina", prompt_vi: "Trong dịch vụ, động từ này có thể nghĩa là gì?", prompt_en: "In services, what can this verb mean?", expected_vi: "ਲੈਣਾ có thể là lấy/nhận/mua.", expected_en: "ਲੈਣਾ can mean take/receive/buy.", canadaPractical: true },
      { id: "pa-capstone-verb-003", skill: "high_frequency_verbs", level: "A2", gurmukhi: "ਸਮਝਣਾ", romanization: "samajhna", prompt_vi: "Tạo câu sinh tồn với động từ này.", prompt_en: "Make a survival sentence with this verb.", expected_vi: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ nghĩa là tôi chưa hiểu.", expected_en: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ means I did not understand.", canadaPractical: true },
      { id: "pa-capstone-verb-004", skill: "high_frequency_verbs", level: "B1", gurmukhi: "ਅਨੁਵਾਦ ਕਰਨਾ", romanization: "anuvaad karna", prompt_vi: "Động từ này dùng ở đâu?", prompt_en: "Where is this verb useful?", expected_vi: "Nghĩa là dịch; hữu ích ở dịch vụ công hoặc trường học.", expected_en: "It means translate; useful at public services or school.", canadaPractical: true },
    ],
  },
  {
    skill: "collocations",
    title_vi: "Collocation",
    title_en: "Collocations",
    goal_vi: "Đọc cụm tự nhiên thay vì dịch từng từ rời rạc.",
    goal_en: "Read natural chunks instead of translating isolated words.",
    items: [
      { id: "pa-capstone-collocation-001", skill: "collocations", level: "A1", gurmukhi: "ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "madad chahidi hai", prompt_vi: "Cụm này dùng khi nào?", prompt_en: "When is this phrase used?", expected_vi: "Dùng khi cần giúp đỡ.", expected_en: "Use it when you need help.", canadaPractical: true },
      { id: "pa-capstone-collocation-002", skill: "collocations", level: "A2", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", prompt_vi: "Cụm này nghĩa là gì?", prompt_en: "What does this phrase mean?", expected_vi: "Nghĩa là điền mẫu đơn.", expected_en: "It means to fill out a form.", canadaPractical: true },
      { id: "pa-capstone-collocation-003", skill: "collocations", level: "B1", gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", prompt_vi: "Bẫy chữ nào trong cụm này?", prompt_en: "Which letter trap appears in this phrase?", expected_vi: "ਠ romanize là th nhưng không phải th tiếng Anh.", expected_en: "ਠ romanizes as th but is not English th.", learnerTrap: { vi: "Đọc theo Gurmukhi thay vì English th.", en: "Read from Gurmukhi instead of English th." } },
      { id: "pa-capstone-collocation-004", skill: "collocations", level: "B2", gurmukhi: "ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ", romanization: "appointment laina", prompt_vi: "Cụm này hữu ích ở đâu?", prompt_en: "Where is this phrase useful?", expected_vi: "Dùng khi đặt lịch hẹn, nhất là phòng khám.", expected_en: "Use it for booking appointments, especially clinics.", canadaPractical: true },
    ],
  },
  {
    skill: "romanization_bridge",
    title_vi: "Cầu nối romanization",
    title_en: "Romanization Bridge",
    goal_vi: "Dùng Latin để tìm kiếm nhưng xác nhận bằng Gurmukhi.",
    goal_en: "Use Latin for search but confirm with Gurmukhi.",
    items: [
      { id: "pa-capstone-roman-001", skill: "romanization_bridge", level: "A1", gurmukhi: "ਫਲ", romanization: "phal/fal", prompt_vi: "Nếu không tìm thấy phal, thử gì?", prompt_en: "If phal does not work, what should you try?", expected_vi: "Thử fal, rồi xác nhận bằng Gurmukhi ਫਲ.", expected_en: "Try fal, then confirm with Gurmukhi ਫਲ.", learnerTrap: { vi: "ਫ có thể ghi ph hoặc f.", en: "ਫ may be written ph or f." } },
      { id: "pa-capstone-roman-002", skill: "romanization_bridge", level: "A2", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", prompt_vi: "Hai cách Latin này có phải hai từ Gurmukhi không?", prompt_en: "Are these two Latin forms two Gurmukhi words?", expected_vi: "Không, đó là biến thể romanization cho ਵੱਡਾ.", expected_en: "No, they are romanization variants for ਵੱਡਾ.", learnerTrap: { vi: "ਵ có thể gần v/w theo giọng.", en: "ਵ can be close to v/w by accent." } },
      { id: "pa-capstone-roman-003", skill: "romanization_bridge", level: "B1", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", prompt_vi: "Cách tìm nào nên thử?", prompt_en: "Which searches should you try?", expected_vi: "Thử shahir và shehar, rồi xác nhận bằng ਸ਼ਹਿਰ.", expected_en: "Try shahir and shehar, then confirm with ਸ਼ਹਿਰ." },
      { id: "pa-capstone-roman-004", skill: "romanization_bridge", level: "B2", gurmukhi: "ਕੱਲ੍ਹ", romanization: "kallh/kal", prompt_vi: "Vì sao cần ngữ cảnh?", prompt_en: "Why is context needed?", expected_vi: "ਕੱਲ੍ਹ có thể là hôm qua hoặc ngày mai theo ngữ cảnh.", expected_en: "ਕੱਲ੍ਹ can mean yesterday or tomorrow by context.", learnerTrap: { vi: "Không dịch từ này một mình nếu thiếu câu.", en: "Do not translate this word alone without a sentence." } },
    ],
  },
  {
    skill: "checkpoint",
    title_vi: "Checkpoint tổng hợp",
    title_en: "Integrated Checkpoints",
    goal_vi: "Kết hợp chữ, từ, cụm và biển hiệu trong một nhiệm vụ.",
    goal_en: "Combine script, words, phrases, and signage in one task.",
    items: [
      { id: "pa-capstone-checkpoint-001", skill: "checkpoint", level: "A2", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", prompt_vi: "Checkpoint: đọc và nêu tình huống dùng.", prompt_en: "Checkpoint: read and name the use case.", expected_vi: "Nghĩa là tôi cần giúp đỡ; dùng ở dịch vụ, y tế, công cộng.", expected_en: "It means I need help; use in service, health, and public settings.", canadaPractical: true, checkpoint: true },
      { id: "pa-capstone-checkpoint-002", skill: "checkpoint", level: "B1", gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ", romanization: "kirpa karke hauli bolo", prompt_vi: "Checkpoint: xác định chức năng giao tiếp.", prompt_en: "Checkpoint: identify the communication function.", expected_vi: "Đây là yêu cầu lịch sự: vui lòng nói chậm.", expected_en: "This is a polite request: please speak slowly.", canadaPractical: true, checkpoint: true },
      { id: "pa-capstone-checkpoint-003", skill: "checkpoint", level: "B1", gurmukhi: "ਡਾਕਟਰ ਦੀ ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ", romanization: "daaktar di appointment laina", prompt_vi: "Checkpoint: xác định chủ đề và hành động.", prompt_en: "Checkpoint: identify topic and action.", expected_vi: "Chủ đề sức khỏe; hành động là đặt lịch hẹn bác sĩ.", expected_en: "Health topic; action is booking a doctor's appointment.", canadaPractical: true, checkpoint: true },
      { id: "pa-capstone-checkpoint-004", skill: "checkpoint", level: "B2", gurmukhi: "ਰੇਲਵੇ ਸਟੇਸ਼ਨ ਨਿਕਾਸ", romanization: "railway station nikaas", prompt_vi: "Checkpoint: đọc biển ghép.", prompt_en: "Checkpoint: read the combined sign.", expected_vi: "Nghĩa là lối ra ga tàu; đi theo biển để ra ngoài.", expected_en: "It means railway station exit; follow it to leave.", canadaPractical: true, checkpoint: true },
    ],
  },
  {
    skill: "shahmukhi_awareness",
    title_vi: "Nhận biết Shahmukhi",
    title_en: "Shahmukhi Awareness",
    goal_vi: "Biết có hệ chữ khác nhưng capstone này vẫn dùng Gurmukhi.",
    goal_en: "Know another script exists while this capstone stays with Gurmukhi.",
    items: [
      { id: "pa-capstone-shahmukhi-001", skill: "shahmukhi_awareness", level: "A1", gurmukhi: "ਗੁਰਮੁਖੀ ਵਿੱਚ ਪੜ੍ਹੋ", romanization: "gurmukhi vich parho", prompt_vi: "Capstone này dùng hệ chữ nào làm chính?", prompt_en: "Which script is primary in this capstone?", expected_vi: "Gurmukhi là chính. Shahmukhi chỉ là nhận biết, không phải khóa Shahmukhi đầy đủ.", expected_en: "Gurmukhi is primary. Shahmukhi is awareness only, not a full Shahmukhi course.", checkpoint: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_CAPSTONE = sections;

export const PUNJABI_SCRIPT_VOCABULARY_CAPSTONE_ITEMS: ReadonlyArray<PunjabiCapstoneItem> =
  sections.flatMap((section) => section.items);

export default PUNJABI_SCRIPT_VOCABULARY_CAPSTONE;
