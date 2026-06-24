// src/languages/punjabi/scriptVocabularyLearnerJourney.ts
//
// Punjabi script and vocabulary learner journey for Vietnamese-speaking and
// English-speaking learners. Gurmukhi is primary; romanization is a bridge.
// Native review is deferred.

export type PunjabiJourneyStage =
  | "gurmukhi_letters"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "thematic_vocabulary"
  | "verbs"
  | "collocations"
  | "romanization_bridge"
  | "shahmukhi_awareness";

export type PunjabiJourneyStatus = "start" | "practice" | "handoff" | "ready";

export type PunjabiJourneyStep = {
  id: string;
  stage: PunjabiJourneyStage;
  status: PunjabiJourneyStatus;
  gurmukhiAnchor: string;
  romanization?: string;
  learnerGoal_vi: string;
  learnerGoal_en: string;
  practice_vi: string;
  practice_en: string;
  handoff_vi: string;
  handoff_en: string;
  readinessCheck_vi: string;
  readinessCheck_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  journeyCheckpoint?: boolean;
  handoffReady?: boolean;
};

export type PunjabiJourneySection = {
  stage: PunjabiJourneyStage;
  title_vi: string;
  title_en: string;
  journeyPurpose_vi: string;
  journeyPurpose_en: string;
  steps: ReadonlyArray<PunjabiJourneyStep>;
};

export const PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY_SCOPE = {
  vi: "Learner journey này dẫn người học từ chữ Gurmukhi, dấu nguyên âm, addak/tippi/bindi đến biển hiệu, từ vựng theo chủ đề, động từ, collocation và romanization bridge. Shahmukhi chỉ là nhận biết, không phải khóa Shahmukhi đầy đủ. Native review được hoãn.",
  en: "This learner journey moves learners from Gurmukhi letters, vowel signs, addak/tippi/bindi into signage, thematic vocabulary, verbs, collocations, and the romanization bridge. Shahmukhi is awareness only, not a full Shahmukhi course. Native review is deferred.",
  noAudioScoringOrIntegration: true,
} as const;

const sections: ReadonlyArray<PunjabiJourneySection> = [
  {
    stage: "gurmukhi_letters",
    title_vi: "Chặng chữ cái Gurmukhi",
    title_en: "Gurmukhi Letter Stage",
    journeyPurpose_vi: "Bắt đầu bằng nhận diện chữ và cặp dễ nhầm trước khi đọc từ.",
    journeyPurpose_en: "Start with letters and confusing pairs before reading words.",
    steps: [
      { id: "pa-journey-letter-001", stage: "gurmukhi_letters", status: "start", gurmukhiAnchor: "ਕ / ਖ", romanization: "k / kh", learnerGoal_vi: "Tôi nhận ra chữ bật hơi trong cặp cơ bản.", learnerGoal_en: "I recognize the aspirated letter in a basic pair.", practice_vi: "So sánh ਕ và ਖ trong từ ngắn.", practice_en: "Compare ਕ and ਖ in short words.", handoff_vi: "Chuyển sang đọc cặp ਗ/ਘ khi không còn đoán bằng Latin.", handoff_en: "Move to ਗ/ਘ when not guessing from Latin.", readinessCheck_vi: "Sẵn sàng nếu chọn ਖ là kh bật hơi.", readinessCheck_en: "Ready if ਖ is selected as aspirated kh.", learnerTrap: { vi: "kh trong romanization không phải hai chữ Gurmukhi.", en: "kh in romanization is not two Gurmukhi letters." }, journeyCheckpoint: true },
      { id: "pa-journey-letter-002", stage: "gurmukhi_letters", status: "practice", gurmukhiAnchor: "ਤ / ਟ", romanization: "t / tt", learnerGoal_vi: "Tôi phân biệt t răng và t quặt lưỡi.", learnerGoal_en: "I distinguish dental t and retroflex t.", practice_vi: "Tách ਤ khỏi ਟ trong bảng phụ âm.", practice_en: "Separate ਤ from ਟ in a consonant table.", handoff_vi: "Chuyển sang đọc từ thật khi nhìn ra hình chữ.", handoff_en: "Move to real words when the letter shapes are clear.", readinessCheck_vi: "Sẵn sàng nếu không gọi cả hai là cùng một t.", readinessCheck_en: "Ready if both are not treated as one t.", learnerTrap: { vi: "Latin t che mất khác biệt chữ.", en: "Latin t hides the letter difference." } },
      { id: "pa-journey-letter-003", stage: "gurmukhi_letters", status: "handoff", gurmukhiAnchor: "ਸ / ਸ਼", romanization: "s / sh", learnerGoal_vi: "Tôi chú ý dấu dưới khi đọc nhanh.", learnerGoal_en: "I notice the lower mark during quick reading.", practice_vi: "Đọc ਸ਼ਹਿਰ và so sánh với ਸ.", practice_en: "Read ਸ਼ਹਿਰ and compare it with ਸ.", handoff_vi: "Handoff sang romanization bridge cho shahir/shehar.", handoff_en: "Handoff to the romanization bridge for shahir/shehar.", readinessCheck_vi: "Sẵn sàng nếu nhận ra ਸ਼ không phải ਸ.", readinessCheck_en: "Ready if ਸ਼ is recognized as not ਸ.", learnerTrap: { vi: "Bỏ dấu dưới làm sai chữ.", en: "Dropping the lower mark changes recognition." }, handoffReady: true },
    ],
  },
  {
    stage: "vowel_signs",
    title_vi: "Chặng dấu nguyên âm",
    title_en: "Vowel Sign Stage",
    journeyPurpose_vi: "Đọc dấu nguyên âm theo âm trị trước khi vào biển hiệu và câu ngắn.",
    journeyPurpose_en: "Read vowel signs by sound value before signs and short sentences.",
    steps: [
      { id: "pa-journey-vowel-001", stage: "vowel_signs", status: "start", gurmukhiAnchor: "ਕਿ / ਕੀ", romanization: "ki / kii", learnerGoal_vi: "Tôi đọc được i ngắn và i dài.", learnerGoal_en: "I can read short i and long ii.", practice_vi: "Nói vì sao ਿ viết trước nhưng đọc sau.", practice_en: "Explain why ਿ is written before but read after.", handoff_vi: "Chuyển sang từ thật khi không đảo thứ tự đọc.", handoff_en: "Move to real words when reading order is stable.", readinessCheck_vi: "Sẵn sàng nếu phân biệt ਕਿ và ਕੀ.", readinessCheck_en: "Ready if ਕਿ and ਕੀ are distinguished.", learnerTrap: { vi: "Vị trí viết của ਿ dễ gây nhầm.", en: "The written position of ਿ can mislead learners." }, journeyCheckpoint: true },
      { id: "pa-journey-vowel-002", stage: "vowel_signs", status: "practice", gurmukhiAnchor: "ਕੁ / ਕੂ", romanization: "ku / kuu", learnerGoal_vi: "Tôi phân biệt u ngắn và u dài.", learnerGoal_en: "I distinguish short u and long uu.", practice_vi: "Chỉ ra ੁ trong ਕੁ và ੂ trong ਕੂ.", practice_en: "Point to ੁ in ਕੁ and ੂ in ਕੂ.", handoff_vi: "Chuyển sang đọc từ dịch vụ có dấu u.", handoff_en: "Move to service words with u signs.", readinessCheck_vi: "Sẵn sàng nếu đọc đúng dấu ngắn và dài.", readinessCheck_en: "Ready if the short and long signs are read correctly." },
      { id: "pa-journey-vowel-003", stage: "vowel_signs", status: "handoff", gurmukhiAnchor: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", learnerGoal_vi: "Tôi đọc e, ai/ae và au trong âm tiết.", learnerGoal_en: "I read e, ai/ae, and au in syllables.", practice_vi: "So sánh ba dấu trước khi đọc biển.", practice_en: "Compare the three signs before reading signs.", handoff_vi: "Handoff sang survival signage khi không nhầm ba dấu.", handoff_en: "Handoff to survival signage when the three signs are stable.", readinessCheck_vi: "Sẵn sàng nếu đọc ਕੇ, ਕੈ, ਕੌ khác nhau.", readinessCheck_en: "Ready if ਕੇ, ਕੈ, ਕੌ are read differently.", learnerTrap: { vi: "ai/ae thay đổi theo romanization.", en: "ai/ae changes across romanization systems." }, handoffReady: true },
    ],
  },
  {
    stage: "addak_tippi_bindi",
    title_vi: "Chặng addak, tippi, bindi",
    title_en: "Addak, Tippi, Bindi Stage",
    journeyPurpose_vi: "Nhận ra dấu phụ nhỏ trước khi đọc từ giao thông, gia đình và Punjabi.",
    journeyPurpose_en: "Recognize small marks before transit, family, and Punjabi words.",
    steps: [
      { id: "pa-journey-mark-001", stage: "addak_tippi_bindi", status: "practice", gurmukhiAnchor: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", learnerGoal_vi: "Tôi nhận ra addak trong từ giao thông.", learnerGoal_en: "I recognize addak in transport words.", practice_vi: "Tìm ੱ trong ਬੱਸ và ਅੱਡਾ.", practice_en: "Find ੱ in ਬੱਸ and ਅੱਡਾ.", handoff_vi: "Chuyển sang transport words khi không bỏ dấu ੱ.", handoff_en: "Move to transport words when ੱ is not skipped.", readinessCheck_vi: "Sẵn sàng nếu thấy cả hai addak.", readinessCheck_en: "Ready if both addak marks are noticed.", learnerTrap: { vi: "Addak nhỏ nhưng ảnh hưởng nhận diện từ.", en: "Addak is small but affects word recognition." }, canadaPractical: true, journeyCheckpoint: true },
      { id: "pa-journey-mark-002", stage: "addak_tippi_bindi", status: "practice", gurmukhiAnchor: "ਮਾਂ", romanization: "maan", learnerGoal_vi: "Tôi nhận diện bindi trong từ gia đình.", learnerGoal_en: "I recognize bindi in a family word.", practice_vi: "Chỉ ra ਂ ở trên trong ਮਾਂ.", practice_en: "Point to ਂ above in ਮਾਂ.", handoff_vi: "Chuyển sang thematic vocabulary về gia đình.", handoff_en: "Move to family thematic vocabulary.", readinessCheck_vi: "Sẵn sàng nếu không bỏ dấu trên.", readinessCheck_en: "Ready if the upper mark is not skipped." },
      { id: "pa-journey-mark-003", stage: "addak_tippi_bindi", status: "handoff", gurmukhiAnchor: "ਪੰਜਾਬ", romanization: "panjab/punjab", learnerGoal_vi: "Tôi nhận ra tippi trong tên Punjabi.", learnerGoal_en: "I recognize tippi in the name Punjabi.", practice_vi: "Tìm ੰ trong ਪੰਜਾਬ rồi so sánh với Latin Punjab.", practice_en: "Find ੰ in ਪੰਜਾਬ and compare with Latin Punjab.", handoff_vi: "Handoff sang romanization bridge vì Latin che dấu ੰ.", handoff_en: "Handoff to romanization bridge because Latin hides ੰ.", readinessCheck_vi: "Sẵn sàng nếu xem Gurmukhi là chuẩn.", readinessCheck_en: "Ready if Gurmukhi is treated as the standard.", learnerTrap: { vi: "Panjab/Punjab không hiện rõ tippi.", en: "Panjab/Punjab does not show tippi clearly." }, handoffReady: true },
    ],
  },
  {
    stage: "survival_signage",
    title_vi: "Chặng biển hiệu sinh tồn",
    title_en: "Survival Signage Stage",
    journeyPurpose_vi: "Chuyển kỹ năng đọc chữ sang hành động ở nơi công cộng tại Canada.",
    journeyPurpose_en: "Move script reading into public actions in Canada.",
    steps: [
      { id: "pa-journey-sign-001", stage: "survival_signage", status: "ready", gurmukhiAnchor: "ਨਿਕਾਸ", romanization: "nikaas", learnerGoal_vi: "Tôi đi theo biển lối ra khi thấy ਨਿਕਾਸ.", learnerGoal_en: "I follow an exit sign when I see ਨਿਕਾਸ.", practice_vi: "Đọc biển đơn và chọn hành động đi ra.", practice_en: "Read the sign and choose the exit action.", handoff_vi: "Chuyển sang biển ghép như ga tàu.", handoff_en: "Move to combined station signs.", readinessCheck_vi: "Sẵn sàng nếu hiểu nghĩa lối ra.", readinessCheck_en: "Ready if exit meaning is understood.", canadaPractical: true, journeyCheckpoint: true },
      { id: "pa-journey-sign-002", stage: "survival_signage", status: "ready", gurmukhiAnchor: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", learnerGoal_vi: "Tôi nhận ra biển cấp cứu trong bệnh viện.", learnerGoal_en: "I recognize an emergency sign in a hospital.", practice_vi: "Nối từ này với tình huống cần trợ giúp khẩn cấp.", practice_en: "Connect this word with urgent help.", handoff_vi: "Handoff sang clinic words như ਦਵਾਈ và ਡਾਕਟਰ.", handoff_en: "Handoff to clinic words like ਦਵਾਈ and ਡਾਕਟਰ.", readinessCheck_vi: "Sẵn sàng nếu biết đây là cấp cứu.", readinessCheck_en: "Ready if this is understood as emergency.", canadaPractical: true, handoffReady: true },
      { id: "pa-journey-sign-003", stage: "survival_signage", status: "practice", gurmukhiAnchor: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", learnerGoal_vi: "Tôi nhận ra nhà thuốc dù ph/f thay đổi.", learnerGoal_en: "I recognize pharmacy even when ph/f changes.", practice_vi: "Xác nhận từ bằng chữ ਫ.", practice_en: "Confirm the word with ਫ.", handoff_vi: "Chuyển sang chủ đề sức khỏe và từ ਦਵਾਈ.", handoff_en: "Move to the health theme and ਦਵਾਈ.", readinessCheck_vi: "Sẵn sàng nếu không chỉ dựa vào English spelling.", readinessCheck_en: "Ready if not relying only on English spelling.", learnerTrap: { vi: "ਫ có thể ghi ph hoặc f.", en: "ਫ may be written ph or f." }, canadaPractical: true },
    ],
  },
  {
    stage: "thematic_vocabulary",
    title_vi: "Chặng từ vựng theo chủ đề",
    title_en: "Thematic Vocabulary Stage",
    journeyPurpose_vi: "Gom từ theo gia đình, sức khỏe, nhà ở, tiền và trường học.",
    journeyPurpose_en: "Group words by family, health, housing, money, and school.",
    steps: [
      { id: "pa-journey-theme-001", stage: "thematic_vocabulary", status: "practice", gurmukhiAnchor: "ਪਰਿਵਾਰ", romanization: "parivaar", learnerGoal_vi: "Tôi xếp ਪਰਿਵਾਰ vào chủ đề gia đình.", learnerGoal_en: "I sort ਪਰਿਵਾਰ into the family theme.", practice_vi: "Nối từ này với nhà, mẹ, cha và quan hệ.", practice_en: "Connect this word with home, mother, father, and relationships.", handoff_vi: "Chuyển sang school notes khi đọc ghi chú gia đình.", handoff_en: "Move to school notes when reading family notices.", readinessCheck_vi: "Sẵn sàng nếu nhớ nhóm gia đình.", readinessCheck_en: "Ready if the family theme is remembered." },
      { id: "pa-journey-theme-002", stage: "thematic_vocabulary", status: "ready", gurmukhiAnchor: "ਦਵਾਈ", romanization: "davai", learnerGoal_vi: "Tôi nhận ra ਦਵਾਈ trong tình huống sức khỏe.", learnerGoal_en: "I recognize ਦਵਾਈ in health situations.", practice_vi: "Kết hợp ਦਵਾਈ với ਫਾਰਮੇਸੀ.", practice_en: "Combine ਦਵਾਈ with ਫਾਰਮੇਸੀ.", handoff_vi: "Handoff sang clinic words và đặt lịch.", handoff_en: "Handoff to clinic words and appointments.", readinessCheck_vi: "Sẵn sàng nếu hiểu nghĩa thuốc.", readinessCheck_en: "Ready if medicine meaning is understood.", canadaPractical: true, handoffReady: true },
      { id: "pa-journey-theme-003", stage: "thematic_vocabulary", status: "ready", gurmukhiAnchor: "ਕਿਰਾਇਆ", romanization: "kiraya", learnerGoal_vi: "Tôi nhận ra ਕਿਰਾਇਆ trong nhà ở và tiền.", learnerGoal_en: "I recognize ਕਿਰਾਇਆ in housing and money.", practice_vi: "Đọc từ này trong mẫu thuê nhà hoặc tin nhắn.", practice_en: "Read this word in rental forms or messages.", handoff_vi: "Chuyển sang service counters nếu cần điền thông tin.", handoff_en: "Move to service counters if forms are needed.", readinessCheck_vi: "Sẵn sàng nếu biết nghĩa tiền thuê.", readinessCheck_en: "Ready if rent meaning is understood.", canadaPractical: true },
    ],
  },
  {
    stage: "verbs",
    title_vi: "Chặng động từ lõi",
    title_en: "Core Verb Stage",
    journeyPurpose_vi: "Dùng động từ tần suất cao để hiểu hành động trong cụm thực tế.",
    journeyPurpose_en: "Use high-frequency verbs to understand actions in practical chunks.",
    steps: [
      { id: "pa-journey-verb-001", stage: "verbs", status: "practice", gurmukhiAnchor: "ਕਰਨਾ", romanization: "karna", learnerGoal_vi: "Tôi hiểu ਕਰਨਾ tạo cụm hành động với danh từ.", learnerGoal_en: "I understand ਕਰਨਾ forming action chunks with nouns.", practice_vi: "Đọc ਅਨੁਵਾਦ ਕਰਨਾ và ਗਲਤੀ ਠੀਕ ਕਰਨਾ.", practice_en: "Read ਅਨੁਵਾਦ ਕਰਨਾ and ਗਲਤੀ ਠੀਕ ਕਰਨਾ.", handoff_vi: "Chuyển sang collocation khi nhận ra mẫu danh từ + ਕਰਨਾ.", handoff_en: "Move to collocations when noun + ਕਰਨਾ is clear.", readinessCheck_vi: "Sẵn sàng nếu giải thích được nghĩa làm/dịch/sửa.", readinessCheck_en: "Ready if do/translate/fix meanings are explained.", journeyCheckpoint: true },
      { id: "pa-journey-verb-002", stage: "verbs", status: "ready", gurmukhiAnchor: "ਲੈਣਾ", romanization: "laina", learnerGoal_vi: "Tôi hiểu ਲੈਣਾ theo ngữ cảnh lấy, nhận hoặc đặt.", learnerGoal_en: "I understand ਲੈਣਾ by context as take, receive, or book.", practice_vi: "Đọc ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ ở phòng khám.", practice_en: "Read ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ at a clinic.", handoff_vi: "Handoff sang scenario clinic khi đặt lịch.", handoff_en: "Handoff to clinic scenarios for booking.", readinessCheck_vi: "Sẵn sàng nếu hiểu đặt lịch hẹn.", readinessCheck_en: "Ready if booking an appointment is understood.", canadaPractical: true, handoffReady: true },
      { id: "pa-journey-verb-003", stage: "verbs", status: "ready", gurmukhiAnchor: "ਸਮਝਣਾ", romanization: "samajhna", learnerGoal_vi: "Tôi dùng cụm có ਸਮਝ khi chưa hiểu.", learnerGoal_en: "I use a ਸਮਝ phrase when I do not understand.", practice_vi: "Đọc ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ.", practice_en: "Read ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ.", handoff_vi: "Chuyển sang collocation hỗ trợ giao tiếp.", handoff_en: "Move to communication-support collocations.", readinessCheck_vi: "Sẵn sàng nếu dùng câu để xin hỗ trợ.", readinessCheck_en: "Ready if the sentence is used to ask for support.", canadaPractical: true },
    ],
  },
  {
    stage: "collocations",
    title_vi: "Chặng collocation",
    title_en: "Collocation Stage",
    journeyPurpose_vi: "Đọc cụm tự nhiên thay vì dịch từng từ khi cần phản ứng nhanh.",
    journeyPurpose_en: "Read natural chunks instead of word-by-word translation for quick response.",
    steps: [
      { id: "pa-journey-collocation-001", stage: "collocations", status: "ready", gurmukhiAnchor: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", learnerGoal_vi: "Tôi dùng câu này khi cần giúp đỡ.", learnerGoal_en: "I use this sentence when I need help.", practice_vi: "Nói tình huống dùng ở dịch vụ, y tế hoặc giao thông.", practice_en: "Name service, health, or transport use cases.", handoff_vi: "Handoff sang scenario bridge cho nơi công cộng.", handoff_en: "Handoff to scenario bridge for public places.", readinessCheck_vi: "Sẵn sàng nếu hiểu cả câu, không chỉ từ ਮਦਦ.", readinessCheck_en: "Ready if the whole sentence is understood, not only ਮਦਦ.", canadaPractical: true, journeyCheckpoint: true, handoffReady: true },
      { id: "pa-journey-collocation-002", stage: "collocations", status: "practice", gurmukhiAnchor: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", learnerGoal_vi: "Tôi hiểu cụm điền mẫu đơn ở quầy dịch vụ.", learnerGoal_en: "I understand the fill-out-a-form chunk at counters.", practice_vi: "Kết nối cụm với tên, địa chỉ và số điện thoại.", practice_en: "Connect the chunk with name, address, and phone number.", handoff_vi: "Chuyển sang service counter scenario.", handoff_en: "Move to service counter scenarios.", readinessCheck_vi: "Sẵn sàng nếu hiểu hành động điền thông tin.", readinessCheck_en: "Ready if entering information is understood.", canadaPractical: true },
      { id: "pa-journey-collocation-003", stage: "collocations", status: "practice", gurmukhiAnchor: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", learnerGoal_vi: "Tôi đọc cụm sửa lỗi và chú ý chữ ਠ.", learnerGoal_en: "I read the fix-a-mistake chunk and notice ਠ.", practice_vi: "Giải thích vì sao ਠ không phải th tiếng Anh.", practice_en: "Explain why ਠ is not English th.", handoff_vi: "Nếu còn nhầm, quay lại script error deck.", handoff_en: "If still confused, return to the script error deck.", readinessCheck_vi: "Sẵn sàng nếu đọc theo Gurmukhi trước Latin.", readinessCheck_en: "Ready if Gurmukhi is read before Latin.", learnerTrap: { vi: "th trong romanization dễ kéo sang tiếng Anh.", en: "th in romanization can pull learners toward English." }, canadaPractical: true },
    ],
  },
  {
    stage: "romanization_bridge",
    title_vi: "Chặng romanization bridge",
    title_en: "Romanization Bridge Stage",
    journeyPurpose_vi: "Dùng chữ Latin để tìm kiếm nhưng luôn xác nhận bằng Gurmukhi.",
    journeyPurpose_en: "Use Latin letters for search while confirming with Gurmukhi.",
    steps: [
      { id: "pa-journey-roman-001", stage: "romanization_bridge", status: "practice", gurmukhiAnchor: "ਫਲ", romanization: "phal/fal", learnerGoal_vi: "Tôi thử phal hoặc fal rồi xác nhận ਫਲ.", learnerGoal_en: "I try phal or fal and then confirm ਫਲ.", practice_vi: "So sánh ph/f cho chữ ਫ.", practice_en: "Compare ph/f for the letter ਫ.", handoff_vi: "Chuyển sang tìm kiếm từ mới bằng nhiều spelling.", handoff_en: "Move to searching new words with multiple spellings.", readinessCheck_vi: "Sẵn sàng nếu Gurmukhi là đáp án cuối.", readinessCheck_en: "Ready if Gurmukhi is the final answer.", learnerTrap: { vi: "Romanization là cầu nối, không phải chữ chính.", en: "Romanization is a bridge, not the primary script." }, journeyCheckpoint: true },
      { id: "pa-journey-roman-002", stage: "romanization_bridge", status: "practice", gurmukhiAnchor: "ਵੱਡਾ", romanization: "vadda/wadda", learnerGoal_vi: "Tôi biết vadda và wadda cùng trỏ về ਵੱਡਾ.", learnerGoal_en: "I know vadda and wadda both point to ਵੱਡਾ.", practice_vi: "Giữ ਵੱਡਾ làm dạng học chính.", practice_en: "Keep ਵੱਡਾ as the main study form.", handoff_vi: "Chuyển sang đọc từ có ਵ trong ngữ cảnh.", handoff_en: "Move to reading words with ਵ in context.", readinessCheck_vi: "Sẵn sàng nếu không tách thành hai từ.", readinessCheck_en: "Ready if they are not split into two words.", learnerTrap: { vi: "v/w thay đổi theo nguồn và giọng.", en: "v/w varies by source and accent." } },
      { id: "pa-journey-roman-003", stage: "romanization_bridge", status: "ready", gurmukhiAnchor: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", learnerGoal_vi: "Tôi tìm bằng shahir/shehar và xác nhận ਸ਼ਹਿਰ.", learnerGoal_en: "I search shahir/shehar and confirm ਸ਼ਹਿਰ.", practice_vi: "Nối biến thể Latin với chữ ਸ਼.", practice_en: "Connect Latin variants with the letter ਸ਼.", handoff_vi: "Handoff sang scenario bridge khi tìm địa danh.", handoff_en: "Handoff to scenario bridge when searching places.", readinessCheck_vi: "Sẵn sàng nếu không bỏ dấu dưới trong ਸ਼.", readinessCheck_en: "Ready if the lower mark in ਸ਼ is not skipped.", learnerTrap: { vi: "Latin khác nhau không luôn đổi nghĩa.", en: "Different Latin spellings do not always change meaning." }, handoffReady: true },
    ],
  },
  {
    stage: "shahmukhi_awareness",
    title_vi: "Chặng nhận biết Shahmukhi",
    title_en: "Shahmukhi Awareness Stage",
    journeyPurpose_vi: "Giữ phạm vi rõ ràng: học bằng Gurmukhi, chỉ nhận biết Shahmukhi.",
    journeyPurpose_en: "Keep scope clear: learn through Gurmukhi, only recognize Shahmukhi awareness.",
    steps: [
      { id: "pa-journey-shahmukhi-001", stage: "shahmukhi_awareness", status: "ready", gurmukhiAnchor: "ਗੁਰਮੁਖੀ ਵਿੱਚ ਪੜ੍ਹੋ", romanization: "gurmukhi vich parho", learnerGoal_vi: "Tôi biết hành trình này dùng Gurmukhi làm chính.", learnerGoal_en: "I know this journey uses Gurmukhi as primary.", practice_vi: "Giải thích Shahmukhi chỉ là nhận biết.", practice_en: "Explain that Shahmukhi is awareness only.", handoff_vi: "Tiếp tục lộ trình bằng Gurmukhi và chờ native review sau.", handoff_en: "Continue the journey in Gurmukhi and defer native review.", readinessCheck_vi: "Sẵn sàng nếu không coi đây là khóa Shahmukhi đầy đủ.", readinessCheck_en: "Ready if this is not treated as a full Shahmukhi course.", journeyCheckpoint: true, handoffReady: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY = sections;

export const PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY_STEPS: ReadonlyArray<PunjabiJourneyStep> =
  sections.flatMap((section) => section.steps);

export default PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY;
