// Punjabi script/vocabulary stress tests for app consumption.
// Gurmukhi is primary; Shahmukhi is awareness only, not a full course.

export type PunjabiScriptVocabularyStressCategory =
  | "similar_letters"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "service_words"
  | "high_frequency_verbs"
  | "collocations"
  | "romanization_reduction";

export type PunjabiScriptVocabularyStressItem = {
  id: string;
  category: PunjabiScriptVocabularyStressCategory;
  riskLevel: "stress_test" | "final_risk" | "final_qa";
  prompt_pa: string;
  romanization?: string;
  answer_pa: string;
  meaning_vi: string;
  meaning_en: string;
  explanation_vi: string;
  explanation_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  learner_trap_vi: string;
  learner_trap_en: string;
};

export type PunjabiScriptVocabularyStressScope = {
  name: string;
  scriptPolicy: string;
  reviewStatus: string;
  usageNotes: string[];
};

export const PUNJABI_SCRIPT_VOCABULARY_STRESS_SCOPE: PunjabiScriptVocabularyStressScope = {
  name: "Punjabi Script Vocabulary Stress Tests",
  scriptPolicy:
    "Gurmukhi is primary. Romanization appears only where it helps reduce risk. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  usageNotes: [
    "Compact final-risk checks for script and survival vocabulary.",
    "Designed for practice screens, review queues, and QA fixtures, not loose notes.",
  ],
};

export const PUNJABI_SCRIPT_VOCABULARY_STRESS_TESTS: PunjabiScriptVocabularyStressItem[] = [
  {
    id: "pa-script-stress-similar-letters-001",
    category: "similar_letters",
    riskLevel: "stress_test",
    prompt_pa: "ਘਰ / ਕਰ",
    romanization: "ghar / kar",
    answer_pa: "ਘਰ",
    meaning_vi: "ਘਰ nghĩa là nhà; ਕਰ liên quan đến làm.",
    meaning_en: "ਘਰ means home; ਕਰ relates to doing.",
    explanation_vi: "So sánh ਘ và ਕ trước khi đoán từ quen thuộc.",
    explanation_en: "Compare ਘ and ਕ before guessing from a familiar word shape.",
    canada_example_vi: "Đọc địa chỉ nhà thuê hoặc mẫu trường ở Canada cần phân biệt đúng.",
    canada_example_en: "Reading a rental address or school form in Canada needs the distinction.",
    learner_trap_vi: "Đừng bỏ qua nét thêm trong ਘ.",
    learner_trap_en: "Do not ignore the extra shape in ਘ.",
  },
  {
    id: "pa-script-stress-vowel-signs-002",
    category: "vowel_signs",
    riskLevel: "final_risk",
    prompt_pa: "ਬਿਲ / ਬਾਲ / ਬੋਲ",
    romanization: "bil / bal / bol",
    answer_pa: "ਬਿਲ",
    meaning_vi: "ਬਿਲ là hóa đơn.",
    meaning_en: "ਬਿਲ means bill.",
    explanation_vi: "Dấu nguyên âm đổi nghĩa nhanh, nhất là trong từ dịch vụ.",
    explanation_en: "Vowel signs can quickly change meaning, especially in service words.",
    canada_example_vi: "Ở ngân hàng hoặc điện thoại Canada, ਬਿਲ có thể xuất hiện trong câu hỏi về hóa đơn.",
    canada_example_en: "At a Canadian bank or phone provider, ਬਿਲ may appear in account questions.",
    learner_trap_vi: "Đừng đọc mọi từ có ਬ như nhau.",
    learner_trap_en: "Do not read every ਬ word the same way.",
  },
  {
    id: "pa-script-stress-addak-003",
    category: "addak_tippi_bindi",
    riskLevel: "stress_test",
    prompt_pa: "ਅੱਜ / ਅਜ",
    romanization: "ajj / aj",
    answer_pa: "ਅੱਜ",
    meaning_vi: "ਅੱਜ nghĩa là hôm nay.",
    meaning_en: "ਅੱਜ means today.",
    explanation_vi: "ਅੱਧਕ cho biết phụ âm được nhấn/gấp đôi trong chữ Gurmukhi.",
    explanation_en: "Addak marks a strengthened or doubled consonant in Gurmukhi.",
    canada_example_vi: "Khi đặt lịch ở Canada, ਅੱਜ giúp phân biệt hôm nay với thời điểm khác.",
    canada_example_en: "When booking in Canada, ਅੱਜ distinguishes today from another time.",
    learner_trap_vi: "Đừng bỏ qua dấu nhỏ phía trên chữ.",
    learner_trap_en: "Do not skip the small mark above the letter.",
  },
  {
    id: "pa-script-stress-tippi-bindi-004",
    category: "addak_tippi_bindi",
    riskLevel: "final_qa",
    prompt_pa: "ਮੈਂ / ਮੇ",
    romanization: "main / me",
    answer_pa: "ਮੈਂ",
    meaning_vi: "ਮੈਂ nghĩa là tôi.",
    meaning_en: "ਮੈਂ means I.",
    explanation_vi: "Tippi/bindi awareness giúp nhận ra âm mũi và đại từ cơ bản.",
    explanation_en: "Tippi and bindi awareness helps identify nasalization and basic pronouns.",
    canada_example_vi: "Dùng trong câu ở quầy dịch vụ Canada: ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ.",
    canada_example_en: "Use in a Canadian service line: ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ.",
    learner_trap_vi: "Đừng xóa dấu mũi vì nó có thể đổi cách đọc.",
    learner_trap_en: "Do not drop nasal marks because they can change the reading.",
  },
  {
    id: "pa-script-stress-signage-005",
    category: "survival_signage",
    riskLevel: "stress_test",
    prompt_pa: "ਦਾਖਲਾ",
    romanization: "dakhla",
    answer_pa: "ਦਾਖਲਾ",
    meaning_vi: "lối vào / nhập học tùy ngữ cảnh.",
    meaning_en: "entry / admission depending on context.",
    explanation_vi: "Cùng một từ có thể xuất hiện trên biển chỉ dẫn hoặc giấy tờ trường.",
    explanation_en: "The same word can appear on signage or school paperwork.",
    canada_example_vi: "Ở thư viện, trường, hoặc trung tâm cộng đồng Canada, hãy nhìn ngữ cảnh xung quanh.",
    canada_example_en: "At a Canadian library, school, or community centre, use the surrounding context.",
    learner_trap_vi: "Đừng dịch máy một nghĩa duy nhất trong mọi bối cảnh.",
    learner_trap_en: "Do not force one translated meaning in every context.",
  },
  {
    id: "pa-script-stress-service-006",
    category: "service_words",
    riskLevel: "final_risk",
    prompt_pa: "ਫਾਰਮ ਭਰੋ",
    romanization: "form bharo",
    answer_pa: "ਫਾਰਮ ਭਰੋ",
    meaning_vi: "điền mẫu đơn.",
    meaning_en: "fill out the form.",
    explanation_vi: "ਭਰੋ là mệnh lệnh lịch sự/ngắn trong bối cảnh giấy tờ.",
    explanation_en: "ਭਰੋ is a short instruction in paperwork contexts.",
    canada_example_vi: "Ở cơ quan chính phủ Canada, bạn có thể thấy yêu cầu điền form trước khi lấy số.",
    canada_example_en: "At a Canadian government office, you may see a form instruction before taking a number.",
    learner_trap_vi: "Đừng nhầm ਫਾਰਮ với tên riêng; đây là từ dịch vụ rất thường gặp.",
    learner_trap_en: "Do not treat ਫਾਰਮ as a name; it is a common service word.",
  },
  {
    id: "pa-script-stress-verb-007",
    category: "high_frequency_verbs",
    riskLevel: "stress_test",
    prompt_pa: "ਲੈਣਾ / ਦੇਣਾ / ਜਾਣਾ",
    romanization: "laina / dena / jana",
    answer_pa: "ਲੈਣਾ",
    meaning_vi: "ਲੈਣਾ nghĩa là lấy/nhận.",
    meaning_en: "ਲੈਣਾ means to take or receive.",
    explanation_vi: "Các động từ tần suất cao xuất hiện trong câu dịch vụ rất ngắn.",
    explanation_en: "High-frequency verbs appear in very short service lines.",
    canada_example_vi: "Ở nhà thuốc Canada: ਦਵਾਈ ਲੈਣੀ hai có ý lấy thuốc.",
    canada_example_en: "At a Canadian pharmacy, ਦਵਾਈ ਲੈਣੀ points to picking up medicine.",
    learner_trap_vi: "Đừng học động từ rời khỏi cụm danh từ đi kèm.",
    learner_trap_en: "Do not learn the verb away from the noun it commonly pairs with.",
  },
  {
    id: "pa-script-stress-collocation-008",
    category: "collocations",
    riskLevel: "final_qa",
    prompt_pa: "ਅਪਾਇੰਟਮੈਂਟ ਬਣਾਉਣੀ",
    romanization: "appointment banauni",
    answer_pa: "ਅਪਾਇੰਟਮੈਂਟ ਬਣਾਉਣੀ",
    meaning_vi: "đặt/tạo lịch hẹn.",
    meaning_en: "make or book an appointment.",
    explanation_vi: "Collocation này quan trọng hơn dịch từng chữ của ਬਣਾਉਣੀ.",
    explanation_en: "This collocation matters more than translating ਬਣਾਉਣੀ word by word.",
    canada_example_vi: "Dùng khi gọi clinic Canada để đặt lịch không khẩn cấp.",
    canada_example_en: "Use when calling a Canadian clinic for a non-urgent appointment.",
    learner_trap_vi: "Đừng dịch thành 'xây' lịch hẹn theo nghĩa đen.",
    learner_trap_en: "Do not translate it literally as building an appointment.",
  },
  {
    id: "pa-script-stress-romanization-009",
    category: "romanization_reduction",
    riskLevel: "final_risk",
    prompt_pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।",
    answer_pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।",
    meaning_vi: "Làm ơn nói chậm.",
    meaning_en: "Please speak slowly.",
    explanation_vi: "Không có romanization ở mục này để kiểm tra đọc Gurmukhi trực tiếp.",
    explanation_en: "This item omits romanization to test direct Gurmukhi reading.",
    canada_example_vi: "Dùng ở quầy ngân hàng, trường, hoặc phòng khám Canada khi người khác nói nhanh.",
    canada_example_en: "Use at a Canadian bank, school, or clinic desk when someone speaks quickly.",
    learner_trap_vi: "Đừng phụ thuộc vào romanization khi câu Gurmukhi đã quen.",
    learner_trap_en: "Do not depend on romanization when the Gurmukhi sentence is familiar.",
  },
];

export const punjabiScriptVocabularyStressTestsByCategory = (
  category: PunjabiScriptVocabularyStressCategory,
) => PUNJABI_SCRIPT_VOCABULARY_STRESS_TESTS.filter((item) => item.category === category);

export default PUNJABI_SCRIPT_VOCABULARY_STRESS_TESTS;
