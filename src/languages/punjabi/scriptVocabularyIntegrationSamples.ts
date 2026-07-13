// Punjabi script and vocabulary integration samples for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner bridge only. Shahmukhi is
// awareness only, not a full course. Native review is deferred.

export type PunjabiScriptVocabularyIntegrationArea =
  | "gurmukhi_recognition"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "service_words"
  | "thematic_vocabulary"
  | "high_frequency_verbs"
  | "collocations"
  | "romanization_bridge"
  | "shahmukhi_awareness";

export type PunjabiScriptVocabularyIntegrationUse =
  | "integration_sample"
  | "final_evidence"
  | "final_qa";

export type PunjabiScriptVocabularyIntegrationSample = {
  cell_id?: string;
  id: string;
  area: PunjabiScriptVocabularyIntegrationArea;
  use: PunjabiScriptVocabularyIntegrationUse;
  gurmukhi: string;
  romanization?: string;
  sample_vi: string;
  sample_en: string;
  expected_vi: string;
  expected_en: string;
  qaPrompt_vi: string;
  qaPrompt_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  finalEvidence?: boolean;
  finalQA?: boolean;
  integrationReady?: boolean;
};

export type PunjabiScriptVocabularyIntegrationSection = {
  cell_id?: string;
  area: PunjabiScriptVocabularyIntegrationArea;
  title_vi: string;
  title_en: string;
  sampleGoal_vi: string;
  sampleGoal_en: string;
  samples: ReadonlyArray<PunjabiScriptVocabularyIntegrationSample>;
};

export const PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLES_SCOPE = {
  vi: "Bộ integration samples này kiểm tra nhận diện Gurmukhi, dấu nguyên âm, addak/tippi/bindi, biển hiệu sinh tồn, từ dịch vụ, từ vựng theo chủ đề, động từ tần suất cao, collocation và cầu nối romanization. Shahmukhi chỉ là nhận biết, không phải khóa Shahmukhi đầy đủ. Native review được hoãn.",
  en: "These integration samples check Gurmukhi recognition, vowel signs, addak/tippi/bindi, survival signage, service words, thematic vocabulary, high-frequency verbs, collocations, and the romanization bridge. Shahmukhi is awareness only, not a full Shahmukhi course. Native review is deferred.",
  noAudioScoringOrIntegration: true,
} as const;

const sections: ReadonlyArray<PunjabiScriptVocabularyIntegrationSection> = [
  {
    area: "gurmukhi_recognition",
    title_vi: "Integration samples nhận diện Gurmukhi",
    title_en: "Gurmukhi Recognition Integration Samples",
    sampleGoal_vi: "Chốt cách nhận diện chữ cái và cặp dễ nhầm trong dòng thực tế.",
    sampleGoal_en: "Lock in recognition of letters and confusing pairs in practical lines.",
    samples: [
      { id: "pa-int-gurmukhi-001", area: "gurmukhi_recognition", use: "integration_sample", gurmukhi: "ਕ / ਖ", romanization: "k / kh", sample_vi: "Mẫu tích hợp: cặp này kiểm tra bật hơi trong chữ kh.", sample_en: "Integration sample: this pair checks aspiration in kh.", expected_vi: "Người học nhận ra ਖ là bật hơi.", expected_en: "The learner recognizes ਖ as aspirated.", qaPrompt_vi: "Chữ nào là kh bật hơi?", qaPrompt_en: "Which letter is aspirated kh?", learnerTrap: { vi: "kh Latin không phải hai chữ Gurmukhi.", en: "Latin kh is not two Gurmukhi letters." }, integrationReady: true },
      { id: "pa-int-gurmukhi-002", area: "gurmukhi_recognition", use: "final_evidence", gurmukhi: "ਤ / ਟ", romanization: "t / tt", sample_vi: "Mẫu tích hợp: so sánh t răng với t quặt lưỡi.", sample_en: "Integration sample: compare dental t with retroflex t.", expected_vi: "Người học giải thích được sự khác nhau bằng hình chữ.", expected_en: "The learner can explain the difference by letter shape.", qaPrompt_vi: "Romanization t che mất gì?", qaPrompt_en: "What does romanization t hide?", learnerTrap: { vi: "Latin t làm mất khác biệt chữ.", en: "Latin t hides the letter distinction." }, finalEvidence: true },
      { id: "pa-int-gurmukhi-003", area: "gurmukhi_recognition", use: "final_qa", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", sample_vi: "Mẫu tích hợp: ਸ਼ cần được nhận ra là một chữ riêng.", sample_en: "Integration sample: ਸ਼ must be recognized as its own letter.", expected_vi: "Người học xác nhận từ bằng Gurmukhi, không chỉ Latin.", expected_en: "The learner confirms the word through Gurmukhi, not only Latin.", qaPrompt_vi: "Dấu dưới giúp bạn tránh lỗi nào?", qaPrompt_en: "What error does the lower mark prevent?", finalQA: true },
    ],
  },
  {
    area: "vowel_signs",
    title_vi: "Integration samples dấu nguyên âm",
    title_en: "Vowel Sign Integration Samples",
    sampleGoal_vi: "Khóa cách đọc dấu nguyên âm khi nhìn từ thực tế và biển ngắn.",
    sampleGoal_en: "Lock in reading vowel signs when seeing real words and short signs.",
    samples: [
      { id: "pa-int-vowel-001", area: "vowel_signs", use: "integration_sample", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", sample_vi: "Mẫu tích hợp: dấu ਿ viết trước nhưng đọc sau phụ âm.", sample_en: "Integration sample: the ਿ sign is written before but read after the consonant.", expected_vi: "Người học đọc đúng ki và kii.", expected_en: "The learner reads ki and kii correctly.", qaPrompt_vi: "Dấu nào dễ làm người học đảo thứ tự?", qaPrompt_en: "Which sign can make learners reverse the order?", learnerTrap: { vi: "Đừng đọc theo vị trí viết trên dòng.", en: "Do not read only by written position." } },
      { id: "pa-int-vowel-002", area: "vowel_signs", use: "final_evidence", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", sample_vi: "Mẫu tích hợp: phân biệt âm ngắn và dài trong cùng cặp.", sample_en: "Integration sample: distinguish short and long vowels in one pair.", expected_vi: "Người học tách được ਕੁ và ਕੂ.", expected_en: "The learner separates ਕੁ and ਕੂ.", qaPrompt_vi: "Bạn đọc âm dài là gì?", qaPrompt_en: "How do you read the long vowel?", finalEvidence: true },
      { id: "pa-int-vowel-003", area: "vowel_signs", use: "final_qa", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", sample_vi: "Mẫu tích hợp: ba dấu này giúp kiểm tra đọc nối âm.", sample_en: "Integration sample: these three signs test vowel reading in sequence.", expected_vi: "Người học không nhầm e, ai/ae và au.", expected_en: "The learner does not confuse e, ai/ae, and au.", qaPrompt_vi: "Ba âm tiết này đọc thế nào?", qaPrompt_en: "How are these three syllables read?", finalQA: true },
    ],
  },
  {
    area: "addak_tippi_bindi",
    title_vi: "Integration samples addak, tippi, bindi",
    title_en: "Addak, Tippi, Bindi Integration Samples",
    sampleGoal_vi: "Kiểm tra dấu phụ hay bị bỏ qua trong từ hữu ích hằng ngày.",
    sampleGoal_en: "Check commonly skipped marks in everyday useful words.",
    samples: [
      { id: "pa-int-mark-001", area: "addak_tippi_bindi", use: "integration_sample", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", sample_vi: "Mẫu tích hợp: addak là dấu quan trọng trong từ đi lại.", sample_en: "Integration sample: addak is important in a transit word.", expected_vi: "Người học chỉ ra dấu ੱ ở giữa từ.", expected_en: "The learner points to ੱ in the middle of the word.", qaPrompt_vi: "Addak nằm ở đâu?", qaPrompt_en: "Where is the addak?", canadaPractical: true },
      { id: "pa-int-mark-002", area: "addak_tippi_bindi", use: "final_evidence", gurmukhi: "ਮਾਂ", romanization: "maan", sample_vi: "Mẫu tích hợp: bindi trên chữ báo mũi hóa.", sample_en: "Integration sample: the bindi above the letter marks nasalization.", expected_vi: "Người học nhận ra dấu trên đầu chữ.", expected_en: "The learner recognizes the mark above the letter.", qaPrompt_vi: "Dấu trên đầu báo điều gì?", qaPrompt_en: "What does the top mark signal?", finalEvidence: true },
      { id: "pa-int-mark-003", area: "addak_tippi_bindi", use: "final_qa", gurmukhi: "ਪੰਜਾਬ", romanization: "panjab/punjab", sample_vi: "Mẫu tích hợp: tippi trong ਪੰਜਾਬ không nên bị mất khi dùng romanization.", sample_en: "Integration sample: the tippi in ਪੰਜਾਬ should not be lost in romanization.", expected_vi: "Người học xác nhận từ bằng Gurmukhi, không chỉ Latin.", expected_en: "The learner confirms the word with Gurmukhi, not just Latin.", qaPrompt_vi: "Romanization che dấu nào?", qaPrompt_en: "Which mark does romanization hide?", learnerTrap: { vi: "Panjab/Punjab không thay thế chữ Gurmukhi.", en: "Panjab/Punjab does not replace Gurmukhi." }, finalQA: true },
    ],
  },
  {
    area: "survival_signage",
    title_vi: "Integration samples biển hiệu sinh tồn",
    title_en: "Survival Signage Integration Samples",
    sampleGoal_vi: "Dùng mẫu tích hợp cho biển cần phản ứng ngay ở Canada.",
    sampleGoal_en: "Use integration samples for signs that require immediate action in Canada.",
    samples: [
      { id: "pa-int-sign-001", area: "survival_signage", use: "integration_sample", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", sample_vi: "Mẫu tích hợp: biển này gợi ý cần trợ giúp khẩn cấp.", sample_en: "Integration sample: this sign suggests urgent help is needed.", expected_vi: "Người học biết tìm hỗ trợ ngay.", expected_en: "The learner knows to seek help right away.", qaPrompt_vi: "Bạn làm gì khi thấy biển này ở bệnh viện?", qaPrompt_en: "What do you do when seeing this sign in a hospital?", canadaPractical: true, finalQA: true },
      { id: "pa-int-sign-002", area: "survival_signage", use: "final_evidence", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", sample_vi: "Mẫu tích hợp: biển này chỉ lối ra.", sample_en: "Integration sample: this sign indicates the exit.", expected_vi: "Người học đi theo biển để ra ngoài.", expected_en: "The learner follows the sign to leave.", qaPrompt_vi: "Biển này dẫn bạn tới đâu?", qaPrompt_en: "Where does this sign lead?", canadaPractical: true, finalEvidence: true },
      { id: "pa-int-sign-003", area: "survival_signage", use: "final_qa", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", sample_vi: "Mẫu tích hợp: chữ ਫ xác nhận nhà thuốc.", sample_en: "Integration sample: the letter ਫ confirms pharmacy.", expected_vi: "Người học dùng Gurmukhi để xác nhận từ.", expected_en: "The learner uses Gurmukhi to confirm the word.", qaPrompt_vi: "Chữ nào giúp xác nhận nhà thuốc?", qaPrompt_en: "Which letter confirms pharmacy?", learnerTrap: { vi: "English spelling không thay thế Gurmukhi.", en: "English spelling does not replace Gurmukhi." }, canadaPractical: true, finalQA: true },
    ],
  },
  {
    area: "service_words",
    title_vi: "Integration samples từ dịch vụ",
    title_en: "Service Word Integration Samples",
    sampleGoal_vi: "Kiểm tra từ thường gặp ở quầy dịch vụ, phòng khám, trường và form.",
    sampleGoal_en: "Check words commonly seen at service counters, clinics, schools, and forms.",
    samples: [
      { id: "pa-int-service-001", area: "service_words", use: "integration_sample", gurmukhi: "ਫਾਰਮ", romanization: "form", sample_vi: "Mẫu tích hợp: từ này xuất hiện trên giấy tờ ở Canada.", sample_en: "Integration sample: this word appears on paperwork in Canada.", expected_vi: "Người học hiểu đây là biểu mẫu cần điền.", expected_en: "The learner understands this is a form to complete.", qaPrompt_vi: "Từ này xuất hiện trong bối cảnh nào?", qaPrompt_en: "In what context does this word appear?", learnerTrap: { vi: "Đừng bỏ qua chữ Gurmukhi chỉ vì từ này quen trong tiếng Anh.", en: "Do not skip the Gurmukhi letters just because the word looks familiar in English." }, canadaPractical: true },
      { id: "pa-int-service-002", area: "service_words", use: "final_evidence", gurmukhi: "ਐਪਾਇੰਟਮੈਂਟ", romanization: "appointment", sample_vi: "Mẫu tích hợp: từ này báo lịch hẹn ở Canada.", sample_en: "Integration sample: this word indicates an appointment in Canada.", expected_vi: "Người học nhận ra nó ở phòng khám hoặc dịch vụ công.", expected_en: "The learner recognizes it at a clinic or public service desk.", qaPrompt_vi: "Bạn cần từ này khi làm gì?", qaPrompt_en: "When do you need this word?", canadaPractical: true, finalEvidence: true },
      { id: "pa-int-service-003", area: "service_words", use: "final_qa", gurmukhi: "ਸਕੂਲ", romanization: "school/skul", sample_vi: "Mẫu tích hợp: ਸਕੂਲ là từ mượn nhưng vẫn đọc bằng Gurmukhi.", sample_en: "Integration sample: ਸਕੂਲ is a loanword but still read through Gurmukhi.", expected_vi: "Người học không bỏ qua chữ cái Punjabi.", expected_en: "The learner does not skip the Punjabi letters.", qaPrompt_vi: "Từ mượn này vẫn cần đọc bằng gì?", qaPrompt_en: "What script should this loanword still be read through?", learnerTrap: { vi: "Từ mượn không có nghĩa là bỏ chữ Gurmukhi.", en: "A loanword does not mean skipping Gurmukhi." }, canadaPractical: true, finalQA: true },
    ],
  },
  {
    area: "thematic_vocabulary",
    title_vi: "Integration samples từ vựng theo chủ đề",
    title_en: "Thematic Vocabulary Integration Samples",
    sampleGoal_vi: "Khóa cách xếp từ vào nhóm gia đình, sức khỏe, nhà ở và tiền.",
    sampleGoal_en: "Lock in sorting words into family, health, housing, and money groups.",
    samples: [
      { id: "pa-int-theme-001", area: "thematic_vocabulary", use: "integration_sample", gurmukhi: "ਪਰਿਵਾਰ", romanization: "parivaar", sample_vi: "Mẫu tích hợp: từ này thuộc chủ đề gia đình.", sample_en: "Integration sample: this word belongs to the family theme.", expected_vi: "Người học xếp từ vào nhóm gia đình.", expected_en: "The learner sorts the word into the family group.", qaPrompt_vi: "Từ này thuộc chủ đề nào?", qaPrompt_en: "Which theme does this word belong to?", learnerTrap: { vi: "Đừng đoán theo nghĩa tiếng Việt mà bỏ qua chữ chính.", en: "Do not guess from the Vietnamese meaning and ignore the Punjabi script." } },
      { id: "pa-int-theme-002", area: "thematic_vocabulary", use: "final_evidence", gurmukhi: "ਦਵਾਈ", romanization: "davai", sample_vi: "Mẫu tích hợp: từ này hữu ích ở phòng khám hoặc nhà thuốc.", sample_en: "Integration sample: this word is useful at a clinic or pharmacy.", expected_vi: "Người học nối từ với ngữ cảnh y tế.", expected_en: "The learner links the word to health contexts.", qaPrompt_vi: "Từ này hữu ích ở đâu?", qaPrompt_en: "Where is this word useful?", canadaPractical: true, finalEvidence: true },
      { id: "pa-int-theme-003", area: "thematic_vocabulary", use: "final_qa", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", sample_vi: "Mẫu tích hợp: từ này thuộc nhà ở và tiền thuê.", sample_en: "Integration sample: this word belongs to housing and rent.", expected_vi: "Người học nhận ra nó trong bài nhà thuê ở Canada.", expected_en: "The learner recognizes it in Canadian rental situations.", qaPrompt_vi: "Bạn xếp từ này vào nhóm nào?", qaPrompt_en: "Which group do you sort this word into?", canadaPractical: true, finalQA: true },
    ],
  },
  {
    area: "high_frequency_verbs",
    title_vi: "Integration samples động từ tần suất cao",
    title_en: "High-Frequency Verb Integration Samples",
    sampleGoal_vi: "Kiểm tra động từ lõi trong cụm và câu hỗ trợ ngắn.",
    sampleGoal_en: "Check core verbs inside chunks and short support sentences.",
    samples: [
      { id: "pa-int-verb-001", area: "high_frequency_verbs", use: "integration_sample", gurmukhi: "ਕਰਨਾ", romanization: "karna", sample_vi: "Mẫu tích hợp: ਕਰਨਾ thường ghép với danh từ để thành cụm hành động.", sample_en: "Integration sample: ਕਰਨਾ often combines with nouns to form action chunks.", expected_vi: "Người học nhận ra mẫu danh từ + ਕਰਨਾ.", expected_en: "The learner recognizes the noun + ਕਰਨਾ pattern.", qaPrompt_vi: "Động từ này giúp tạo loại cụm nào?", qaPrompt_en: "What kind of chunk does this verb form?", learnerTrap: { vi: "Đừng chỉ nhìn động từ mà quên cụm danh từ đi kèm.", en: "Do not look only at the verb and miss the noun chunk around it." } },
      { id: "pa-int-verb-002", area: "high_frequency_verbs", use: "final_evidence", gurmukhi: "ਲੈਣਾ", romanization: "laina", sample_vi: "Mẫu tích hợp: trong ngữ cảnh dịch vụ, ਲੈਣਾ có thể nối với lịch hẹn.", sample_en: "Integration sample: in service contexts, ਲੈਣਾ can link to an appointment.", expected_vi: "Người học hiểu cụm đặt lịch hẹn.", expected_en: "The learner understands the appointment-booking chunk.", qaPrompt_vi: "Trong phòng khám, ਲੈਣਾ có thể tạo nghĩa gì?", qaPrompt_en: "In a clinic, what meaning can ਲੈਣਾ help form?", canadaPractical: true, finalEvidence: true },
      { id: "pa-int-verb-003", area: "high_frequency_verbs", use: "final_qa", gurmukhi: "ਸਮਝ ਨਹੀਂ ਆਈ", romanization: "samajh nahin aai", sample_vi: "Mẫu tích hợp: câu này báo rằng tôi chưa hiểu.", sample_en: "Integration sample: this sentence says I did not understand.", expected_vi: "Người học dùng nó để xin lặp lại hoặc nói chậm.", expected_en: "The learner uses it to ask for repetition or slower speech.", qaPrompt_vi: "Câu này giải quyết vấn đề gì?", qaPrompt_en: "What problem does this sentence solve?", canadaPractical: true, finalQA: true },
    ],
  },
  {
    area: "collocations",
    title_vi: "Integration samples collocation",
    title_en: "Collocation Integration Samples",
    sampleGoal_vi: "Kiểm tra cụm tự nhiên dùng nhanh ở nơi công cộng.",
    sampleGoal_en: "Check natural chunks used quickly in public settings.",
    samples: [
      { id: "pa-int-coll-001", area: "collocations", use: "integration_sample", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", sample_vi: "Mẫu tích hợp: câu này là chunk sinh tồn hoàn chỉnh.", sample_en: "Integration sample: this sentence is a complete survival chunk.", expected_vi: "Người học nói cả câu thay vì chỉ một từ.", expected_en: "The learner says the full sentence instead of one word.", qaPrompt_vi: "Bạn dùng câu này ở đâu tại Canada?", qaPrompt_en: "Where in Canada might you use this?" , canadaPractical: true, finalQA: true, integrationReady: true },
      { id: "pa-int-coll-002", area: "collocations", use: "final_evidence", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", sample_vi: "Mẫu tích hợp: đây là một cụm hành động tự nhiên.", sample_en: "Integration sample: this is a natural action chunk.", expected_vi: "Người học hiểu đây là điền form.", expected_en: "The learner understands this means fill out a form.", qaPrompt_vi: "Cụm này yêu cầu bạn làm gì?", qaPrompt_en: "What does this chunk ask you to do?", canadaPractical: true, finalEvidence: true, integrationReady: true },
      { id: "pa-int-coll-003", area: "collocations", use: "final_qa", gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", sample_vi: "Mẫu tích hợp: cụm này hữu ích khi bạn cần sửa lỗi.", sample_en: "Integration sample: this chunk is useful when you need to correct a mistake.", expected_vi: "Người học chú ý chữ ਠ trong ਠੀਕ.", expected_en: "The learner notices ਠ in ਠੀਕ.", qaPrompt_vi: "Bẫy chữ nào có trong cụm này?", qaPrompt_en: "Which letter trap appears in this chunk?", learnerTrap: { vi: "ਠ không phải th tiếng Anh.", en: "ਠ is not English th." }, canadaPractical: true, finalQA: true },
    ],
  },
  {
    area: "romanization_bridge",
    title_vi: "Integration samples cầu nối romanization",
    title_en: "Romanization Bridge Integration Samples",
    sampleGoal_vi: "Dùng Latin để tìm kiếm nhưng luôn xác nhận bằng Gurmukhi.",
    sampleGoal_en: "Use Latin for search but always confirm with Gurmukhi.",
    samples: [
      { id: "pa-int-roman-001", area: "romanization_bridge", use: "integration_sample", gurmukhi: "ਫਲ", romanization: "phal/fal", sample_vi: "Mẫu tích hợp: phal và fal có thể dẫn về cùng chữ Gurmukhi.", sample_en: "Integration sample: phal and fal can point to the same Gurmukhi word.", expected_vi: "Người học xác nhận bằng ਫਲ.", expected_en: "The learner confirms with ਫਲ.", qaPrompt_vi: "Nếu phal không ra, bạn thử gì?", qaPrompt_en: "If phal does not work, what do you try?", integrationReady: true },
      { id: "pa-int-roman-002", area: "romanization_bridge", use: "final_evidence", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", sample_vi: "Mẫu tích hợp: spelling Latin khác nhau vẫn có thể là cùng một từ.", sample_en: "Integration sample: different Latin spellings can still map to one word.", expected_vi: "Người học không tách thành hai từ mới.", expected_en: "The learner does not split them into two new words.", qaPrompt_vi: "Hai spelling Latin này trỏ về gì?", qaPrompt_en: "What do these two Latin spellings point to?", learnerTrap: { vi: "Romanization thay đổi theo nguồn và giọng.", en: "Romanization varies by source and accent." }, finalEvidence: true },
      { id: "pa-int-roman-003", area: "romanization_bridge", use: "final_qa", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", sample_vi: "Mẫu tích hợp: bạn tìm bằng Latin rồi kiểm tra lại bằng Gurmukhi.", sample_en: "Integration sample: you search with Latin and then confirm with Gurmukhi.", expected_vi: "Người học dùng Gurmukhi làm đáp án cuối.", expected_en: "The learner uses Gurmukhi as the final answer.", qaPrompt_vi: "Bạn xác nhận kết quả tìm kiếm bằng gì?", qaPrompt_en: "How do you confirm the search result?", finalQA: true },
    ],
  },
  {
    area: "shahmukhi_awareness",
    title_vi: "Nhận biết Shahmukhi",
    title_en: "Shahmukhi Awareness",
    sampleGoal_vi: "Giữ phạm vi rõ: Gurmukhi là chính, Shahmukhi chỉ để nhận biết.",
    sampleGoal_en: "Keep scope clear: Gurmukhi is primary, Shahmukhi is awareness only.",
    samples: [
      { id: "pa-int-shah-001", area: "shahmukhi_awareness", use: "final_qa", gurmukhi: "ਗੁਰਮੁਖੀ ਵਿੱਚ ਪੜ੍ਹੋ", romanization: "gurmukhi vich parho", sample_vi: "Mẫu tích hợp: bộ này tiếp tục đọc bằng Gurmukhi.", sample_en: "Integration sample: this set continues reading through Gurmukhi.", expected_vi: "Người học biết Shahmukhi chỉ là nhận biết.", expected_en: "The learner knows Shahmukhi is awareness only.", qaPrompt_vi: "Đây có phải khóa Shahmukhi đầy đủ không?", qaPrompt_en: "Is this a full Shahmukhi course?", finalQA: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLES = sections;

export const PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLE_ITEMS: ReadonlyArray<PunjabiScriptVocabularyIntegrationSample> =
  sections.flatMap((section) => section.samples);

export default PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_SAMPLES;
