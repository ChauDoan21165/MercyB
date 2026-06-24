// src/languages/punjabi/scriptReviewScheduler.ts
//
// Punjabi script review scheduler for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary; romanization is reduced over time.
// Native review is deferred.

export type PunjabiReviewFocus =
  | "gurmukhi_letters"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "romanization_bridge_reduction"
  | "survival_signage"
  | "vocabulary_script_reinforcement"
  | "shahmukhi_awareness";

export type PunjabiReviewCadence = "same_day" | "next_day" | "three_day" | "weekly" | "readiness_gate";

export type PunjabiReviewScheduleItem = {
  id: string;
  focus: PunjabiReviewFocus;
  cadence: PunjabiReviewCadence;
  gurmukhi: string;
  romanization?: string;
  reviewTask_vi: string;
  reviewTask_en: string;
  remediation_vi: string;
  remediation_en: string;
  readinessSignal_vi: string;
  readinessSignal_en: string;
  navigationTarget: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  reduceRomanization?: boolean;
};

export type PunjabiReviewScheduleSection = {
  focus: PunjabiReviewFocus;
  title_vi: string;
  title_en: string;
  schedulerGoal_vi: string;
  schedulerGoal_en: string;
  items: ReadonlyArray<PunjabiReviewScheduleItem>;
};

export const PUNJABI_SCRIPT_REVIEW_SCHEDULER_SCOPE = {
  vi: "Scheduler này lên lịch ôn Gurmukhi, dấu nguyên âm, addak/tippi/bindi, giảm phụ thuộc romanization, ôn biển hiệu sinh tồn và vòng lặp củng cố từ vựng-chữ viết. Shahmukhi chỉ là nhận biết, không phải khóa Shahmukhi đầy đủ. Native review được hoãn.",
  en: "This scheduler plans review for Gurmukhi, vowel signs, addak/tippi/bindi, romanization reduction, survival signage, and vocabulary-script reinforcement loops. Shahmukhi is awareness only, not a full Shahmukhi course. Native review is deferred.",
  noAudioScoringOrIntegration: true,
} as const;

const sections: ReadonlyArray<PunjabiReviewScheduleSection> = [
  {
    focus: "gurmukhi_letters",
    title_vi: "Lịch ôn chữ Gurmukhi",
    title_en: "Gurmukhi Letter Review",
    schedulerGoal_vi: "Ôn cặp chữ dễ nhầm trước khi người học đọc từ mới.",
    schedulerGoal_en: "Review confusing letter pairs before learners read new words.",
    items: [
      { id: "pa-scheduler-letter-001", focus: "gurmukhi_letters", cadence: "same_day", gurmukhi: "ਕ / ਖ", romanization: "k / kh", reviewTask_vi: "Ôn nhanh cặp ਕ/ਖ ngay sau bài chữ bật hơi.", reviewTask_en: "Quickly review ਕ/ਖ after the aspirated-letter lesson.", remediation_vi: "Nếu chọn sai, quay lại drill nhận diện kh bằng Gurmukhi.", remediation_en: "If missed, return to the Gurmukhi kh recognition drill.", readinessSignal_vi: "Sẵn sàng nếu chọn ਖ mà không cần nhìn Latin.", readinessSignal_en: "Ready if ਖ is selected without looking at Latin.", navigationTarget: "scriptDrills.gurmukhiPairs", learnerTrap: { vi: "kh không phải hai chữ Gurmukhi riêng.", en: "kh is not two separate Gurmukhi letters." } },
      { id: "pa-scheduler-letter-002", focus: "gurmukhi_letters", cadence: "next_day", gurmukhi: "ਤ / ਟ", romanization: "t / tt", reviewTask_vi: "Ôn lại t răng và t quặt lưỡi vào ngày tiếp theo.", reviewTask_en: "Review dental and retroflex t the next day.", remediation_vi: "Nếu vẫn nhầm, đọc bảng phụ âm theo vị trí lưỡi.", remediation_en: "If still confused, review the consonant table by tongue position.", readinessSignal_vi: "Sẵn sàng nếu phân loại ਤ và ਟ đúng trong từ.", readinessSignal_en: "Ready if ਤ and ਟ are sorted correctly in words.", navigationTarget: "scriptErrorDeck.retroflexPairs", learnerTrap: { vi: "Một chữ Latin t không đủ để ôn.", en: "One Latin t is not enough for review." } },
      { id: "pa-scheduler-letter-003", focus: "gurmukhi_letters", cadence: "weekly", gurmukhi: "ਸ / ਸ਼", romanization: "s / sh", reviewTask_vi: "Ôn dấu dưới trong ਸ਼ mỗi tuần bằng từ ਸ਼ਹਿਰ.", reviewTask_en: "Review the lower mark in ਸ਼ weekly through ਸ਼ਹਿਰ.", remediation_vi: "Nếu bỏ dấu dưới, quay lại nhận diện ਸ਼ trước romanization.", remediation_en: "If the lower mark is skipped, return to ਸ਼ recognition before romanization.", readinessSignal_vi: "Sẵn sàng nếu không đọc ਸ਼ như ਸ.", readinessSignal_en: "Ready if ਸ਼ is not read as ਸ.", navigationTarget: "scriptVocabularyFinalReview.gurmukhiRecognition", learnerTrap: { vi: "Dấu dưới nhỏ nhưng đổi nhận diện chữ.", en: "The small lower mark changes letter recognition." } },
    ],
  },
  {
    focus: "vowel_signs",
    title_vi: "Lịch ôn dấu nguyên âm",
    title_en: "Vowel Sign Review",
    schedulerGoal_vi: "Lặp lại dấu nguyên âm theo khoảng cách ngắn rồi đưa vào từ thật.",
    schedulerGoal_en: "Repeat vowel signs on short intervals, then place them in real words.",
    items: [
      { id: "pa-scheduler-vowel-001", focus: "vowel_signs", cadence: "same_day", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", reviewTask_vi: "Ôn ਿ và ੀ trong cùng ngày học dấu i.", reviewTask_en: "Review ਿ and ੀ on the same day as the i lesson.", remediation_vi: "Nếu đảo thứ tự, ôn quy tắc ਿ viết trước đọc sau.", remediation_en: "If order is reversed, review that ਿ is written before but read after.", readinessSignal_vi: "Sẵn sàng nếu đọc ਕਿ và ਕੀ khác nhau.", readinessSignal_en: "Ready if ਕਿ and ਕੀ are read differently.", navigationTarget: "gurmukhiReadingLadder.vowelSigns", learnerTrap: { vi: "Vị trí viết của ਿ dễ gây sai.", en: "The written position of ਿ can cause errors." } },
      { id: "pa-scheduler-vowel-002", focus: "vowel_signs", cadence: "three_day", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", reviewTask_vi: "Ôn u ngắn và u dài sau ba ngày bằng âm tiết ngắn.", reviewTask_en: "Review short u and long uu after three days with short syllables.", remediation_vi: "Nếu nhầm, quay lại cặp dấu dưới phụ âm.", remediation_en: "If confused, return to the under-consonant sign pair.", readinessSignal_vi: "Sẵn sàng nếu chọn đúng ੁ và ੂ.", readinessSignal_en: "Ready if ੁ and ੂ are selected correctly.", navigationTarget: "gurmukhiReadingLadder.shortLongVowels" },
      { id: "pa-scheduler-vowel-003", focus: "vowel_signs", cadence: "weekly", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", reviewTask_vi: "Ôn ba dấu e, ai/ae và au trước bài biển hiệu.", reviewTask_en: "Review e, ai/ae, and au before signage practice.", remediation_vi: "Nếu nhầm, lặp ladder nguyên âm trước khi đọc biển.", remediation_en: "If missed, repeat the vowel ladder before reading signs.", readinessSignal_vi: "Sẵn sàng nếu đọc ba âm tiết không lẫn.", readinessSignal_en: "Ready if the three syllables are not mixed.", navigationTarget: "scriptReadinessGate.vowelSigns", learnerTrap: { vi: "Romanization ai/ae thay đổi theo nguồn.", en: "ai/ae romanization varies by source." } },
    ],
  },
  {
    focus: "addak_tippi_bindi",
    title_vi: "Lịch ôn addak, tippi, bindi",
    title_en: "Addak, Tippi, Bindi Review",
    schedulerGoal_vi: "Đưa dấu phụ nhỏ vào vòng ôn vì chúng dễ bị bỏ qua.",
    schedulerGoal_en: "Place small marks into review loops because they are easy to skip.",
    items: [
      { id: "pa-scheduler-mark-001", focus: "addak_tippi_bindi", cadence: "next_day", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", reviewTask_vi: "Ôn addak trong từ giao thông vào ngày tiếp theo.", reviewTask_en: "Review addak in transit words the next day.", remediation_vi: "Nếu bỏ ੱ, quay lại deck lỗi chữ trước bài giao thông.", remediation_en: "If ੱ is skipped, return to the script error deck before transport.", readinessSignal_vi: "Sẵn sàng nếu tìm được addak trong cả ਬੱਸ và ਅੱਡਾ.", readinessSignal_en: "Ready if addak is found in both ਬੱਸ and ਅੱਡਾ.", navigationTarget: "scriptErrorDeck.addak", learnerTrap: { vi: "ਬੱਸ và ਅੱਡਾ đều có addak.", en: "ਬੱਸ and ਅੱਡਾ both contain addak." }, canadaPractical: true },
      { id: "pa-scheduler-mark-002", focus: "addak_tippi_bindi", cadence: "three_day", gurmukhi: "ਮਾਂ / ਪੰਜਾਬ", romanization: "maan / panjab", reviewTask_vi: "Ôn bindi và tippi bằng từ gia đình và Punjabi.", reviewTask_en: "Review bindi and tippi through family and Punjabi words.", remediation_vi: "Nếu không thấy dấu trên, phóng to chữ và ôn từng dấu.", remediation_en: "If upper marks are missed, enlarge the script and review each mark.", readinessSignal_vi: "Sẵn sàng nếu phân biệt ਂ và ੰ.", readinessSignal_en: "Ready if ਂ and ੰ are distinguished.", navigationTarget: "scriptReadinessGate.addakTippiBindi", learnerTrap: { vi: "Latin maan/Punjab không hiện rõ dấu.", en: "Latin maan/Punjab does not show the marks clearly." }, canadaPractical: true },
    ],
  },
  {
    focus: "romanization_bridge_reduction",
    title_vi: "Giảm phụ thuộc romanization",
    title_en: "Romanization Reduction",
    schedulerGoal_vi: "Dùng romanization để tìm kiếm ban đầu rồi giảm dần khi Gurmukhi ổn định.",
    schedulerGoal_en: "Use romanization for initial search, then reduce it as Gurmukhi stabilizes.",
    items: [
      { id: "pa-scheduler-roman-001", focus: "romanization_bridge_reduction", cadence: "same_day", gurmukhi: "ਫਲ", romanization: "phal/fal", reviewTask_vi: "Hiển thị phal/fal trước, rồi yêu cầu chọn ਫਲ.", reviewTask_en: "Show phal/fal first, then require selecting ਫਲ.", remediation_vi: "Nếu chỉ nhớ Latin, quay lại chữ ਫ và bridge ph/f.", remediation_en: "If only Latin is remembered, return to ਫ and the ph/f bridge.", readinessSignal_vi: "Sẵn sàng nếu Gurmukhi được chọn làm đáp án cuối.", readinessSignal_en: "Ready if Gurmukhi is chosen as the final answer.", navigationTarget: "searchGlossary.romanizationBridge", learnerTrap: { vi: "Romanization là cầu nối, không phải chữ chính.", en: "Romanization is a bridge, not the primary script." }, reduceRomanization: true },
      { id: "pa-scheduler-roman-002", focus: "romanization_bridge_reduction", cadence: "three_day", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", reviewTask_vi: "Sau ba ngày, ẩn romanization rồi hỏi dạng Gurmukhi.", reviewTask_en: "After three days, hide romanization and ask for the Gurmukhi form.", remediation_vi: "Nếu tách vadda/wadda thành hai từ, ôn chữ ਵ.", remediation_en: "If vadda/wadda become two words, review ਵ.", readinessSignal_vi: "Sẵn sàng nếu cả hai Latin trỏ về ਵੱਡਾ.", readinessSignal_en: "Ready if both Latin forms point to ਵੱਡਾ.", navigationTarget: "scriptVocabularyCanDoStatements.romanizationBridge", learnerTrap: { vi: "v/w thay đổi theo nguồn và giọng.", en: "v/w varies by source and accent." }, reduceRomanization: true },
      { id: "pa-scheduler-roman-003", focus: "romanization_bridge_reduction", cadence: "weekly", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", reviewTask_vi: "Mỗi tuần, tìm bằng Latin rồi xác nhận bằng ਸ਼ਹਿਰ.", reviewTask_en: "Weekly, search with Latin and confirm with ਸ਼ਹਿਰ.", remediation_vi: "Nếu bỏ ਸ਼, ôn lại dấu dưới trước khi tìm kiếm.", remediation_en: "If ਸ਼ is skipped, review the lower mark before search.", readinessSignal_vi: "Sẵn sàng nếu không cần romanization để nhận ra ਸ਼ਹਿਰ.", readinessSignal_en: "Ready if ਸ਼ਹਿਰ is recognized without romanization.", navigationTarget: "scriptVocabularyScenarioBridge.romanizationBridge", learnerTrap: { vi: "Latin khác nhau không luôn đổi nghĩa.", en: "Different Latin spelling does not always change meaning." }, reduceRomanization: true },
    ],
  },
  {
    focus: "survival_signage",
    title_vi: "Lịch ôn biển hiệu sinh tồn",
    title_en: "Survival Signage Review",
    schedulerGoal_vi: "Ôn biển có hành động thực tế trong y tế, giao thông và dịch vụ.",
    schedulerGoal_en: "Review action-oriented signs in health, transport, and services.",
    items: [
      { id: "pa-scheduler-sign-001", focus: "survival_signage", cadence: "next_day", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", reviewTask_vi: "Ôn biển cấp cứu sau một ngày bằng tình huống bệnh viện.", reviewTask_en: "Review the emergency sign after one day using a hospital scenario.", remediation_vi: "Nếu chưa nhớ, quay lại survival signage y tế.", remediation_en: "If not remembered, return to health survival signage.", readinessSignal_vi: "Sẵn sàng nếu biết tìm trợ giúp khẩn cấp.", readinessSignal_en: "Ready if urgent help is the chosen action.", navigationTarget: "survivalSignageDeck.health", canadaPractical: true },
      { id: "pa-scheduler-sign-002", focus: "survival_signage", cadence: "three_day", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", reviewTask_vi: "Ôn lối ra bằng biển đơn rồi biển ghép.", reviewTask_en: "Review exit through a single sign, then a combined sign.", remediation_vi: "Nếu chỉ dịch từng chữ, ôn scenario transport.", remediation_en: "If translating word by word, review transport scenarios.", readinessSignal_vi: "Sẵn sàng nếu đi theo biển ra ngoài.", readinessSignal_en: "Ready if following the sign to exit.", navigationTarget: "scriptVocabularyScenarioBridge.transportWords", canadaPractical: true },
      { id: "pa-scheduler-sign-003", focus: "survival_signage", cadence: "weekly", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", reviewTask_vi: "Ôn nhà thuốc hằng tuần cùng từ ਦਵਾਈ.", reviewTask_en: "Review pharmacy weekly together with ਦਵਾਈ.", remediation_vi: "Nếu dựa vào English spelling, quay lại Gurmukhi ਫ.", remediation_en: "If relying on English spelling, return to Gurmukhi ਫ.", readinessSignal_vi: "Sẵn sàng nếu xác nhận bằng ਫਾਰਮੇਸੀ.", readinessSignal_en: "Ready if ਫਾਰਮੇਸੀ confirms the meaning.", navigationTarget: "thematicVocabularyDeck.health", learnerTrap: { vi: "pharmacy tiếng Anh không thay thế Gurmukhi.", en: "English pharmacy does not replace Gurmukhi." }, canadaPractical: true },
    ],
  },
  {
    focus: "vocabulary_script_reinforcement",
    title_vi: "Vòng lặp từ vựng-chữ viết",
    title_en: "Vocabulary-Script Reinforcement",
    schedulerGoal_vi: "Củng cố từ theo chủ đề cùng chữ viết để tránh học nghĩa rời khỏi Gurmukhi.",
    schedulerGoal_en: "Reinforce thematic words with script so meaning is not separated from Gurmukhi.",
    items: [
      { id: "pa-scheduler-vocab-001", focus: "vocabulary_script_reinforcement", cadence: "same_day", gurmukhi: "ਦਵਾਈ / ਫਾਰਮੇਸੀ", romanization: "davai / pharmacy", reviewTask_vi: "Ôn cặp sức khỏe thuốc và nhà thuốc trong cùng phiên.", reviewTask_en: "Review the health pair medicine and pharmacy in one session.", remediation_vi: "Nếu nhớ nghĩa nhưng không đọc chữ, quay lại thematic deck.", remediation_en: "If meaning is remembered but script is not, return to the thematic deck.", readinessSignal_vi: "Sẵn sàng nếu đọc cả ਦਵਾਈ và ਫਾਰਮੇਸੀ.", readinessSignal_en: "Ready if both ਦਵਾਈ and ਫਾਰਮੇਸੀ are read.", navigationTarget: "thematicVocabularyDeck.health", canadaPractical: true },
      { id: "pa-scheduler-vocab-002", focus: "vocabulary_script_reinforcement", cadence: "next_day", gurmukhi: "ਕਿਰਾਇਆ / ਫਾਰਮ ਭਰਨਾ", romanization: "kiraya / form bharna", reviewTask_vi: "Ôn nhà ở và mẫu đơn vào ngày sau bài dịch vụ.", reviewTask_en: "Review housing and form filling the day after service practice.", remediation_vi: "Nếu hiểu tình huống nhưng quên chữ, ôn reading ladder từ thật.", remediation_en: "If scenario is understood but script is forgotten, review real-word reading ladder.", readinessSignal_vi: "Sẵn sàng nếu nối tiền thuê với mẫu dịch vụ.", readinessSignal_en: "Ready if rent is connected with service forms.", navigationTarget: "scriptVocabularyLearnerJourney.thematicVocabulary", canadaPractical: true },
      { id: "pa-scheduler-vocab-003", focus: "vocabulary_script_reinforcement", cadence: "readiness_gate", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", reviewTask_vi: "Dùng câu cần giúp đỡ làm gate trước scenario công cộng.", reviewTask_en: "Use the need-help sentence as a gate before public scenarios.", remediation_vi: "Nếu chỉ nhớ ਮਦਦ, ôn collocation đầy đủ.", remediation_en: "If only ਮਦਦ is remembered, review the full collocation.", readinessSignal_vi: "Sẵn sàng nếu dùng cả câu trong y tế, dịch vụ hoặc giao thông.", readinessSignal_en: "Ready if the whole sentence is used in health, service, or transport.", navigationTarget: "collocationDeck.survival", canadaPractical: true },
    ],
  },
  {
    focus: "shahmukhi_awareness",
    title_vi: "Nhắc phạm vi Shahmukhi",
    title_en: "Shahmukhi Scope Reminder",
    schedulerGoal_vi: "Nhắc rằng lịch ôn này dùng Gurmukhi và chỉ nhận biết Shahmukhi.",
    schedulerGoal_en: "Remind learners that this schedule uses Gurmukhi and only notes Shahmukhi awareness.",
    items: [
      { id: "pa-scheduler-shahmukhi-001", focus: "shahmukhi_awareness", cadence: "weekly", gurmukhi: "ਗੁਰਮੁਖੀ ਵਿੱਚ ਪੜ੍ਹੋ", romanization: "gurmukhi vich parho", reviewTask_vi: "Mỗi tuần nhắc người học giữ Gurmukhi làm chữ chính.", reviewTask_en: "Weekly, remind learners to keep Gurmukhi as the primary script.", remediation_vi: "Nếu hỏi Shahmukhi, giải thích đây chỉ là nhận biết phạm vi.", remediation_en: "If Shahmukhi comes up, explain this is scope awareness only.", readinessSignal_vi: "Sẵn sàng nếu biết đây không phải khóa Shahmukhi đầy đủ.", readinessSignal_en: "Ready if this is not treated as a full Shahmukhi course.", navigationTarget: "scriptReadinessGate.shahmukhiAwareness" },
    ],
  },
];

export const PUNJABI_SCRIPT_REVIEW_SCHEDULER = sections;

export const PUNJABI_SCRIPT_REVIEW_SCHEDULER_ITEMS: ReadonlyArray<PunjabiReviewScheduleItem> =
  sections.flatMap((section) => section.items);

export default PUNJABI_SCRIPT_REVIEW_SCHEDULER;
