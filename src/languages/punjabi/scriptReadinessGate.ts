// src/languages/punjabi/scriptReadinessGate.ts
//
// Punjabi script readiness gate for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary; romanization is a support bridge only.
// No audio, pronunciation scoring, or native-review claim.

export type PunjabiReadinessArea =
  | "gurmukhi_letters"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "vocabulary_categories"
  | "high_frequency_verbs"
  | "romanization_bridge"
  | "shahmukhi_awareness"
  | "readiness_checkpoint";

export type PunjabiReadinessLevel = "entry" | "ready" | "route_to_review";

export type PunjabiReadinessItem = {
  id: string;
  area: PunjabiReadinessArea;
  level: PunjabiReadinessLevel;
  gurmukhi: string;
  romanization?: string;
  task_vi: string;
  task_en: string;
  ready_if_vi: string;
  ready_if_en: string;
  route_if_missed_vi: string;
  route_if_missed_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  checkpoint?: boolean;
};

export type PunjabiReadinessSection = {
  area: PunjabiReadinessArea;
  title_vi: string;
  title_en: string;
  readinessGoal_vi: string;
  readinessGoal_en: string;
  items: ReadonlyArray<PunjabiReadinessItem>;
};

export const PUNJABI_SCRIPT_READINESS_GATE_SCOPE = {
  vi: "Gate này kiểm tra mức sẵn sàng đọc Gurmukhi qua chữ cái, dấu nguyên âm, addak/tippi/bindi, biển hiệu, từ vựng, động từ, romanization và checkpoint tổng hợp. Shahmukhi chỉ là nhận biết, không phải khóa Shahmukhi đầy đủ. Native review được hoãn.",
  en: "This gate checks readiness to read Gurmukhi through letters, vowel signs, addak/tippi/bindi, signage, vocabulary, verbs, romanization, and integrated checkpoints. Shahmukhi is awareness only, not a full Shahmukhi course. Native review is deferred.",
  noAudioOrScoring: true,
} as const;

const sections: ReadonlyArray<PunjabiReadinessSection> = [
  {
    area: "gurmukhi_letters",
    title_vi: "Gate chữ cái Gurmukhi",
    title_en: "Gurmukhi Letter Gate",
    readinessGoal_vi: "Nhận diện chữ cơ bản và cặp dễ nhầm trước khi đọc từ thật.",
    readinessGoal_en: "Recognize core letters and confusing pairs before reading real words.",
    items: [
      { id: "pa-readiness-letter-001", area: "gurmukhi_letters", level: "ready", gurmukhi: "ਕ ਖ ਗ ਘ", romanization: "k kh g gh", task_vi: "Chỉ ra hai chữ bật hơi trong nhóm này.", task_en: "Identify the two aspirated letters in this set.", ready_if_vi: "Sẵn sàng nếu chọn ਖ và ਘ, rồi đọc theo Gurmukhi.", ready_if_en: "Ready if the learner selects ਖ and ਘ, then reads from Gurmukhi.", route_if_missed_vi: "Quay lại drill cặp ਕ/ਖ và ਗ/ਘ.", route_if_missed_en: "Route back to ਕ/ਖ and ਗ/ਘ pair drills.", learnerTrap: { vi: "kh/gh không phải hai âm Latin tách rời.", en: "kh/gh are not two separate Latin sounds." } },
      { id: "pa-readiness-letter-002", area: "gurmukhi_letters", level: "route_to_review", gurmukhi: "ਤ ਟ ਦ ਡ", romanization: "t tt d dd", task_vi: "Phân nhóm răng và quặt lưỡi.", task_en: "Sort dental and retroflex letters.", ready_if_vi: "Sẵn sàng nếu tách ਤ/ਦ khỏi ਟ/ਡ.", ready_if_en: "Ready if ਤ/ਦ are separated from ਟ/ਡ.", route_if_missed_vi: "Ôn bảng phụ âm theo vị trí lưỡi.", route_if_missed_en: "Review the consonant table by tongue position.", learnerTrap: { vi: "Romanization t/d không đủ để phân biệt.", en: "Romanization t/d is not enough to distinguish them." } },
      { id: "pa-readiness-letter-003", area: "gurmukhi_letters", level: "ready", gurmukhi: "ਸ ਸ਼", romanization: "s sh", task_vi: "Nêu chữ nào có dấu dưới và thường gợi sh.", task_en: "Name which letter has the lower mark and often cues sh.", ready_if_vi: "Sẵn sàng nếu nhận ra ਸ਼ khác ਸ.", ready_if_en: "Ready if ਸ਼ is recognized as different from ਸ.", route_if_missed_vi: "Ôn chữ có dấu dưới trong từ mượn và biển hiệu.", route_if_missed_en: "Review lower-mark letters in loanwords and signs.", learnerTrap: { vi: "Đừng bỏ dấu dưới khi đọc nhanh.", en: "Do not drop the lower mark when reading quickly." } },
    ],
  },
  {
    area: "vowel_signs",
    title_vi: "Gate dấu nguyên âm",
    title_en: "Vowel Sign Gate",
    readinessGoal_vi: "Đọc dấu nguyên âm theo âm trị, kể cả khi vị trí viết gây nhiễu.",
    readinessGoal_en: "Read vowel signs by sound value, even when written position distracts.",
    items: [
      { id: "pa-readiness-vowel-001", area: "vowel_signs", level: "ready", gurmukhi: "ਕਿ ਕੀ", romanization: "ki kii", task_vi: "So sánh i ngắn và i dài.", task_en: "Compare short i and long ii.", ready_if_vi: "Sẵn sàng nếu đọc ਕਿ ngắn và ਕੀ dài.", ready_if_en: "Ready if ਕਿ is short and ਕੀ is long.", route_if_missed_vi: "Ôn dấu ਿ viết trước nhưng đọc sau phụ âm.", route_if_missed_en: "Review that ਿ is written before but read after the consonant.", learnerTrap: { vi: "Vị trí viết của ਿ dễ làm người học đảo thứ tự.", en: "The written position of ਿ can make learners reverse order." } },
      { id: "pa-readiness-vowel-002", area: "vowel_signs", level: "ready", gurmukhi: "ਕੁ ਕੂ", romanization: "ku kuu", task_vi: "Chọn âm u ngắn và u dài.", task_en: "Choose short u and long uu.", ready_if_vi: "Sẵn sàng nếu phân biệt ੁ và ੂ.", ready_if_en: "Ready if ੁ and ੂ are distinguished.", route_if_missed_vi: "Ôn cặp dấu u dưới phụ âm.", route_if_missed_en: "Review the u signs under consonants." },
      { id: "pa-readiness-vowel-003", area: "vowel_signs", level: "route_to_review", gurmukhi: "ਕੇ ਕੈ ਕੌ", romanization: "ke kai kau", task_vi: "Đọc e, ai/ae và au trong ba âm tiết.", task_en: "Read e, ai/ae, and au in the three syllables.", ready_if_vi: "Sẵn sàng nếu không nhầm ੇ, ੈ, ੌ.", ready_if_en: "Ready if ੇ, ੈ, and ੌ are not confused.", route_if_missed_vi: "Quay lại ladder nguyên âm trước khi đọc biển.", route_if_missed_en: "Return to the vowel ladder before sign reading.", learnerTrap: { vi: "Romanization có nhiều biến thể cho ai/ae.", en: "Romanization has multiple variants for ai/ae." } },
    ],
  },
  {
    area: "addak_tippi_bindi",
    title_vi: "Gate addak, tippi, bindi",
    title_en: "Addak, Tippi, Bindi Gate",
    readinessGoal_vi: "Nhận ra dấu phụ làm thay đổi cách đọc và nghĩa trong từ quen thuộc.",
    readinessGoal_en: "Recognize marks that change reading and meaning in familiar words.",
    items: [
      { id: "pa-readiness-mark-001", area: "addak_tippi_bindi", level: "ready", gurmukhi: "ਬੱਸ", romanization: "bass/bus", task_vi: "Tìm addak trong từ biển giao thông này.", task_en: "Find the addak in this transit sign word.", ready_if_vi: "Sẵn sàng nếu chỉ ra ੱ và hiểu là bến/xe buýt theo ngữ cảnh.", ready_if_en: "Ready if ੱ is identified and bus context is understood.", route_if_missed_vi: "Ôn addak trước các từ biển hiệu Canada.", route_if_missed_en: "Review addak before Canadian signage words.", learnerTrap: { vi: "Bỏ addak làm từ nhìn giống dạng khác.", en: "Skipping addak makes the word look like another form." }, canadaPractical: true },
      { id: "pa-readiness-mark-002", area: "addak_tippi_bindi", level: "ready", gurmukhi: "ਮਾਂ", romanization: "maan", task_vi: "Dấu nào báo mũi hóa ở từ này?", task_en: "Which mark signals nasalization in this word?", ready_if_vi: "Sẵn sàng nếu nhận ra bindi ਂ ở trên.", ready_if_en: "Ready if the bindi ਂ above is recognized.", route_if_missed_vi: "Ôn bindi và tippi bằng từ gia đình.", route_if_missed_en: "Review bindi and tippi with family words.", learnerTrap: { vi: "Không cần khóa phát âm; chỉ cần nhận diện dấu.", en: "No spoken test is needed; recognize the mark." } },
      { id: "pa-readiness-mark-003", area: "addak_tippi_bindi", level: "route_to_review", gurmukhi: "ਪੰਜਾਬ", romanization: "panjab/punjab", task_vi: "Nhận diện tippi trong tên ngôn ngữ/vùng.", task_en: "Recognize tippi in the language/region name.", ready_if_vi: "Sẵn sàng nếu thấy ੰ trong ਪੁੰਜਾਬ/ਪੰਜਾਬ dạng đúng là ਪੰਜਾਬ.", ready_if_en: "Ready if ੰ is noticed in the correct form ਪੰਜਾਬ.", route_if_missed_vi: "Ôn tippi trong từ Punjabi cốt lõi.", route_if_missed_en: "Review tippi in core Punjabi words.", learnerTrap: { vi: "Romanization Punjab không cho thấy rõ dấu ੰ.", en: "The romanization Punjab does not show ੰ clearly." } },
    ],
  },
  {
    area: "survival_signage",
    title_vi: "Gate biển hiệu sinh tồn",
    title_en: "Survival Signage Gate",
    readinessGoal_vi: "Đọc biển Gurmukhi thực dụng trong y tế, giao thông và dịch vụ.",
    readinessGoal_en: "Read practical Gurmukhi signs in health, transit, and services.",
    items: [
      { id: "pa-readiness-sign-001", area: "survival_signage", level: "ready", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", task_vi: "Nêu tình huống cần dùng biển này.", task_en: "Name when this sign matters.", ready_if_vi: "Sẵn sàng nếu hiểu là cấp cứu/khẩn cấp.", ready_if_en: "Ready if it is understood as emergency/urgent care.", route_if_missed_vi: "Ôn bộ biển y tế trước checkpoint.", route_if_missed_en: "Review health signage before the checkpoint.", canadaPractical: true, checkpoint: true },
      { id: "pa-readiness-sign-002", area: "survival_signage", level: "ready", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", task_vi: "Bạn đi theo biển này để làm gì?", task_en: "Why would you follow this sign?", ready_if_vi: "Sẵn sàng nếu hiểu đây là lối ra.", ready_if_en: "Ready if this is understood as exit.", route_if_missed_vi: "Ôn biển lối ra và hướng đi.", route_if_missed_en: "Review exit and direction signs.", canadaPractical: true },
      { id: "pa-readiness-sign-003", area: "survival_signage", level: "route_to_review", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", task_vi: "Tìm bẫy ph/f khi tra cứu.", task_en: "Find the ph/f search trap.", ready_if_vi: "Sẵn sàng nếu tìm bằng ph hoặc f nhưng xác nhận ਫ.", ready_if_en: "Ready if ph or f search is used but ਫ confirms the word.", route_if_missed_vi: "Ôn bridge romanization cho ਫ.", route_if_missed_en: "Review the romanization bridge for ਫ.", learnerTrap: { vi: "Không để chữ Latin thay thế nhận diện Gurmukhi.", en: "Do not let Latin spelling replace Gurmukhi recognition." }, canadaPractical: true },
    ],
  },
  {
    area: "vocabulary_categories",
    title_vi: "Gate nhóm từ vựng",
    title_en: "Vocabulary Category Gate",
    readinessGoal_vi: "Xếp từ vào nhóm để đọc nhanh trong ngữ cảnh đời sống.",
    readinessGoal_en: "Sort words into categories for faster real-life reading.",
    items: [
      { id: "pa-readiness-vocab-001", area: "vocabulary_categories", level: "ready", gurmukhi: "ਦਵਾਈ", romanization: "davai", task_vi: "Xếp từ này vào nhóm nào?", task_en: "Which category does this word belong to?", ready_if_vi: "Sẵn sàng nếu xếp vào sức khỏe/nhà thuốc.", ready_if_en: "Ready if sorted under health/pharmacy.", route_if_missed_vi: "Ôn từ vựng chủ đề sức khỏe.", route_if_missed_en: "Review health vocabulary.", canadaPractical: true },
      { id: "pa-readiness-vocab-002", area: "vocabulary_categories", level: "ready", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", task_vi: "Từ này thuộc tình huống nhà ở nào?", task_en: "Which housing situation uses this word?", ready_if_vi: "Sẵn sàng nếu hiểu là tiền thuê.", ready_if_en: "Ready if understood as rent.", route_if_missed_vi: "Ôn nhóm nhà ở và tiền bạc.", route_if_missed_en: "Review housing and money categories.", canadaPractical: true },
      { id: "pa-readiness-vocab-003", area: "vocabulary_categories", level: "route_to_review", gurmukhi: "ਸਕੂਲ", romanization: "school/skul", task_vi: "Nối từ này với chủ đề phù hợp.", task_en: "Match this word to the correct theme.", ready_if_vi: "Sẵn sàng nếu xếp vào trường học/giáo dục.", ready_if_en: "Ready if sorted under school/education.", route_if_missed_vi: "Ôn từ mượn trong Gurmukhi.", route_if_missed_en: "Review loanwords in Gurmukhi.", learnerTrap: { vi: "Từ mượn vẫn phải đọc bằng chữ Gurmukhi.", en: "Loanwords still need Gurmukhi reading." }, canadaPractical: true },
    ],
  },
  {
    area: "high_frequency_verbs",
    title_vi: "Gate động từ tần suất cao",
    title_en: "High-Frequency Verb Gate",
    readinessGoal_vi: "Nhận diện động từ lõi trong cụm sinh tồn và dịch vụ.",
    readinessGoal_en: "Recognize core verbs in survival and service phrases.",
    items: [
      { id: "pa-readiness-verb-001", area: "high_frequency_verbs", level: "ready", gurmukhi: "ਕਰਨਾ", romanization: "karna", task_vi: "Động từ này thường giúp tạo cụm gì?", task_en: "What kind of phrases does this verb help form?", ready_if_vi: "Sẵn sàng nếu hiểu ਕਰਨਾ là làm và ghép với danh từ.", ready_if_en: "Ready if ਕਰਨਾ is understood as do/make with nouns.", route_if_missed_vi: "Ôn collocation với ਕਰਨਾ.", route_if_missed_en: "Review collocations with ਕਰਨਾ." },
      { id: "pa-readiness-verb-002", area: "high_frequency_verbs", level: "ready", gurmukhi: "ਲੈਣਾ", romanization: "laina", task_vi: "Trong dịch vụ, động từ này báo hành động gì?", task_en: "In services, what action can this verb signal?", ready_if_vi: "Sẵn sàng nếu hiểu là lấy/nhận/đặt trong ngữ cảnh.", ready_if_en: "Ready if understood as take/receive/book by context.", route_if_missed_vi: "Ôn cụm ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ.", route_if_missed_en: "Review the phrase ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ.", canadaPractical: true },
      { id: "pa-readiness-verb-003", area: "high_frequency_verbs", level: "route_to_review", gurmukhi: "ਸਮਝਣਾ", romanization: "samajhna", task_vi: "Tạo câu báo chưa hiểu.", task_en: "Make a sentence saying you did not understand.", ready_if_vi: "Sẵn sàng nếu dùng ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ.", ready_if_en: "Ready if ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ is used.", route_if_missed_vi: "Ôn cụm hỗ trợ giao tiếp chậm/lặp lại.", route_if_missed_en: "Review support phrases for slow/repeated speech.", canadaPractical: true, checkpoint: true },
    ],
  },
  {
    area: "romanization_bridge",
    title_vi: "Gate romanization",
    title_en: "Romanization Gate",
    readinessGoal_vi: "Dùng chữ Latin để tìm kiếm nhưng quyết định bằng Gurmukhi.",
    readinessGoal_en: "Use Latin search support but decide from Gurmukhi.",
    items: [
      { id: "pa-readiness-roman-001", area: "romanization_bridge", level: "ready", gurmukhi: "ਫਲ", romanization: "phal/fal", task_vi: "Nếu phal không ra kết quả, thử gì?", task_en: "If phal does not return results, what should you try?", ready_if_vi: "Sẵn sàng nếu thử fal và xác nhận ਫਲ.", ready_if_en: "Ready if fal is tried and ਫਲ confirms the word.", route_if_missed_vi: "Ôn biến thể ph/f cho ਫ.", route_if_missed_en: "Review ph/f variants for ਫ.", learnerTrap: { vi: "Romanization là cầu nối, không phải chữ chính.", en: "Romanization is a bridge, not the primary script." } },
      { id: "pa-readiness-roman-002", area: "romanization_bridge", level: "ready", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", task_vi: "Hai dạng Latin này có phải hai từ khác không?", task_en: "Are these two Latin forms different words?", ready_if_vi: "Sẵn sàng nếu biết cả hai trỏ về ਵੱਡਾ.", ready_if_en: "Ready if both forms are tied back to ਵੱਡਾ.", route_if_missed_vi: "Ôn biến thể v/w cho ਵ.", route_if_missed_en: "Review v/w variants for ਵ.", learnerTrap: { vi: "Không tạo hai mục từ chỉ vì Latin khác nhau.", en: "Do not create two entries just because Latin differs." } },
      { id: "pa-readiness-roman-003", area: "romanization_bridge", level: "route_to_review", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", task_vi: "Bạn nên xác nhận dạng nào sau khi tìm kiếm?", task_en: "Which form should confirm the search?", ready_if_vi: "Sẵn sàng nếu dùng Gurmukhi ਸ਼ਹਿਰ làm chuẩn.", ready_if_en: "Ready if Gurmukhi ਸ਼ਹਿਰ is treated as the standard.", route_if_missed_vi: "Ôn sh/s và biến thể e/a trong romanization.", route_if_missed_en: "Review sh/s and e/a romanization variants.", learnerTrap: { vi: "Search Latin có thể đúng dù spelling khác.", en: "Latin search can be valid even when spelling differs." } },
    ],
  },
  {
    area: "shahmukhi_awareness",
    title_vi: "Gate nhận biết Shahmukhi",
    title_en: "Shahmukhi Awareness Gate",
    readinessGoal_vi: "Biết Punjabi có hệ chữ khác mà không chuyển mục tiêu khỏi Gurmukhi.",
    readinessGoal_en: "Know Punjabi has another script without shifting away from Gurmukhi.",
    items: [
      { id: "pa-readiness-shahmukhi-001", area: "shahmukhi_awareness", level: "ready", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", task_vi: "Gate này dùng hệ chữ nào làm chính?", task_en: "Which script is primary in this gate?", ready_if_vi: "Sẵn sàng nếu trả lời Gurmukhi là chính.", ready_if_en: "Ready if the answer is that Gurmukhi is primary.", route_if_missed_vi: "Nhắc lại: Shahmukhi chỉ là nhận biết, không phải khóa đầy đủ.", route_if_missed_en: "Restate: Shahmukhi is awareness only, not a full course.", checkpoint: true },
    ],
  },
  {
    area: "readiness_checkpoint",
    title_vi: "Gate checkpoint tổng hợp",
    title_en: "Integrated Readiness Checkpoint",
    readinessGoal_vi: "Quyết định học tiếp hay quay lại ôn dựa trên nhiệm vụ tổng hợp.",
    readinessGoal_en: "Decide whether to continue or review from integrated tasks.",
    items: [
      { id: "pa-readiness-checkpoint-001", area: "readiness_checkpoint", level: "ready", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", task_vi: "Đọc câu và nêu nơi dùng ở Canada.", task_en: "Read the sentence and name a Canadian use case.", ready_if_vi: "Sẵn sàng nếu hiểu là tôi cần giúp đỡ ở dịch vụ/y tế/công cộng.", ready_if_en: "Ready if understood as I need help in service, health, or public settings.", route_if_missed_vi: "Ôn collocation ਮਦਦ ਚਾਹੀਦੀ ਹੈ và từ sinh tồn.", route_if_missed_en: "Review ਮਦਦ ਚਾਹੀਦੀ ਹੈ and survival words.", canadaPractical: true, checkpoint: true },
      { id: "pa-readiness-checkpoint-002", area: "readiness_checkpoint", level: "ready", gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ", romanization: "kirpa karke hauli bolo", task_vi: "Nêu chức năng giao tiếp của câu này.", task_en: "Name the communication function of this sentence.", ready_if_vi: "Sẵn sàng nếu hiểu đây là yêu cầu nói chậm lịch sự.", ready_if_en: "Ready if understood as a polite request to speak slowly.", route_if_missed_vi: "Ôn cụm lịch sự và hỗ trợ hội thoại.", route_if_missed_en: "Review polite and conversation-support phrases.", canadaPractical: true, checkpoint: true },
      { id: "pa-readiness-checkpoint-003", area: "readiness_checkpoint", level: "route_to_review", gurmukhi: "ਰੇਲਵੇ ਸਟੇਸ਼ਨ ਨਿਕਾਸ", romanization: "railway station nikaas", task_vi: "Đọc biển ghép và chọn hướng hành động.", task_en: "Read the combined sign and choose the action.", ready_if_vi: "Sẵn sàng nếu hiểu là lối ra ga tàu và đi theo biển.", ready_if_en: "Ready if understood as railway station exit and followed accordingly.", route_if_missed_vi: "Ôn biển hiệu ghép trước khi qua gate.", route_if_missed_en: "Review combined signs before passing the gate.", canadaPractical: true, checkpoint: true },
    ],
  },
];

export const PUNJABI_SCRIPT_READINESS_GATE = sections;

export const PUNJABI_SCRIPT_READINESS_GATE_ITEMS: ReadonlyArray<PunjabiReadinessItem> =
  sections.flatMap((section) => section.items);

export default PUNJABI_SCRIPT_READINESS_GATE;
