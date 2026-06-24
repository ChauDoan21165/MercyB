// src/languages/punjabi/scriptVocabularyGoldenSamples.ts
//
// Punjabi script and vocabulary golden samples for Vietnamese-speaking and
// English-speaking learners. Gurmukhi is primary; romanization is a bridge.
// Native review is deferred.

export type PunjabiGoldenSampleArea =
  | "gurmukhi_recognition"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "service_words"
  | "thematic_vocabulary"
  | "verbs"
  | "collocations"
  | "romanization_bridge"
  | "shahmukhi_awareness";

export type PunjabiGoldenSampleUse = "golden_sample" | "final_qa" | "integration_readiness";

export type PunjabiGoldenSample = {
  id: string;
  area: PunjabiGoldenSampleArea;
  use: PunjabiGoldenSampleUse;
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
  finalQA?: boolean;
  integrationReady?: boolean;
};

export type PunjabiGoldenSampleSection = {
  area: PunjabiGoldenSampleArea;
  title_vi: string;
  title_en: string;
  sampleGoal_vi: string;
  sampleGoal_en: string;
  samples: ReadonlyArray<PunjabiGoldenSample>;
};

export const PUNJABI_SCRIPT_VOCABULARY_GOLDEN_SAMPLES_SCOPE = {
  vi: "Golden samples này cung cấp mẫu chuẩn để kiểm tra Gurmukhi, dấu nguyên âm, addak/tippi/bindi, biển hiệu, từ dịch vụ, từ vựng chủ đề, động từ, collocation và romanization bridge. Shahmukhi chỉ là nhận biết, không phải khóa Shahmukhi đầy đủ. Native review được hoãn.",
  en: "These golden samples provide reference examples for checking Gurmukhi, vowel signs, addak/tippi/bindi, signage, service words, thematic vocabulary, verbs, collocations, and the romanization bridge. Shahmukhi is awareness only, not a full Shahmukhi course. Native review is deferred.",
  noAudioScoringOrIntegration: true,
} as const;

const sections: ReadonlyArray<PunjabiGoldenSampleSection> = [
  {
    area: "gurmukhi_recognition",
    title_vi: "Golden samples nhận diện Gurmukhi",
    title_en: "Gurmukhi Recognition Golden Samples",
    sampleGoal_vi: "Dùng mẫu chuẩn để kiểm tra chữ cái và cặp dễ nhầm.",
    sampleGoal_en: "Use reference samples to check letters and confusing pairs.",
    samples: [
      { id: "pa-golden-gurmukhi-001", area: "gurmukhi_recognition", use: "golden_sample", gurmukhi: "ਕ / ਖ", romanization: "k / kh", sample_vi: "Mẫu chuẩn: ਖ là chữ bật hơi trong cặp ਕ/ਖ.", sample_en: "Reference: ਖ is the aspirated letter in ਕ/ਖ.", expected_vi: "Người học chọn ਖ và không tách kh thành hai chữ.", expected_en: "The learner selects ਖ and does not split kh into two letters.", qaPrompt_vi: "Chữ nào là kh bật hơi?", qaPrompt_en: "Which letter is aspirated kh?", learnerTrap: { vi: "kh trong Latin không phải hai chữ Gurmukhi.", en: "Latin kh is not two Gurmukhi letters." }, finalQA: true },
      { id: "pa-golden-gurmukhi-002", area: "gurmukhi_recognition", use: "final_qa", gurmukhi: "ਤ / ਟ", romanization: "t / tt", sample_vi: "Mẫu chuẩn: ਤ là t răng, ਟ là t quặt lưỡi.", sample_en: "Reference: ਤ is dental t, ਟ is retroflex t.", expected_vi: "Người học phân biệt bằng hình chữ Gurmukhi.", expected_en: "The learner distinguishes them by Gurmukhi shape.", qaPrompt_vi: "Vì sao một chữ t Latin chưa đủ?", qaPrompt_en: "Why is one Latin t not enough?", learnerTrap: { vi: "Romanization t che mất khác biệt.", en: "Romanization t hides the distinction." } },
      { id: "pa-golden-gurmukhi-003", area: "gurmukhi_recognition", use: "integration_readiness", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", sample_vi: "Mẫu chuẩn: ਸ਼ có dấu dưới và không phải ਸ.", sample_en: "Reference: ਸ਼ has a lower mark and is not ਸ.", expected_vi: "Người học xác nhận từ bằng Gurmukhi ਸ਼ਹਿਰ.", expected_en: "The learner confirms the word through Gurmukhi ਸ਼ਹਿਰ.", qaPrompt_vi: "Dấu dưới giúp tránh lỗi nào?", qaPrompt_en: "What error does the lower mark prevent?", learnerTrap: { vi: "Bỏ dấu dưới làm sai nhận diện.", en: "Skipping the lower mark breaks recognition." }, integrationReady: true },
    ],
  },
  {
    area: "vowel_signs",
    title_vi: "Golden samples dấu nguyên âm",
    title_en: "Vowel Sign Golden Samples",
    sampleGoal_vi: "Chuẩn hóa cách đọc dấu nguyên âm trước khi vào từ thật.",
    sampleGoal_en: "Standardize vowel-sign reading before real-word practice.",
    samples: [
      { id: "pa-golden-vowel-001", area: "vowel_signs", use: "golden_sample", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", sample_vi: "Mẫu chuẩn: ਕਿ là i ngắn, ਕੀ là i dài.", sample_en: "Reference: ਕਿ is short i, ਕੀ is long ii.", expected_vi: "Người học nhớ ਿ viết trước nhưng đọc sau.", expected_en: "The learner remembers ਿ is written before but read after.", qaPrompt_vi: "Dấu nào dễ gây đảo thứ tự đọc?", qaPrompt_en: "Which sign can reverse reading order?", learnerTrap: { vi: "ਿ viết trước phụ âm nhưng đọc sau.", en: "ਿ is written before the consonant but read after." }, finalQA: true },
      { id: "pa-golden-vowel-002", area: "vowel_signs", use: "final_qa", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", sample_vi: "Mẫu chuẩn: ਕੁ dùng ੁ, ਕੂ dùng ੂ.", sample_en: "Reference: ਕੁ uses ੁ, ਕੂ uses ੂ.", expected_vi: "Người học phân biệt u ngắn và u dài.", expected_en: "The learner distinguishes short u and long uu.", qaPrompt_vi: "Dấu nào là u dài?", qaPrompt_en: "Which sign is long uu?" },
      { id: "pa-golden-vowel-003", area: "vowel_signs", use: "integration_readiness", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", sample_vi: "Mẫu chuẩn: ਕੇ, ਕੈ, ਕੌ là ba dấu khác nhau.", sample_en: "Reference: ਕੇ, ਕੈ, ਕੌ are three different signs.", expected_vi: "Người học không nhầm e, ai/ae và au.", expected_en: "The learner does not confuse e, ai/ae, and au.", qaPrompt_vi: "Bạn đọc ba âm tiết này thế nào?", qaPrompt_en: "How do you read these three syllables?", learnerTrap: { vi: "ai/ae thay đổi theo nguồn romanization.", en: "ai/ae varies by romanization source." }, integrationReady: true },
    ],
  },
  {
    area: "addak_tippi_bindi",
    title_vi: "Golden samples dấu phụ",
    title_en: "Mark Awareness Golden Samples",
    sampleGoal_vi: "Dùng mẫu chuẩn để không bỏ qua addak, tippi và bindi.",
    sampleGoal_en: "Use reference samples so addak, tippi, and bindi are not skipped.",
    samples: [
      { id: "pa-golden-mark-001", area: "addak_tippi_bindi", use: "golden_sample", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", sample_vi: "Mẫu chuẩn: ਬੱਸ và ਅੱਡਾ đều có addak ੱ.", sample_en: "Reference: ਬੱਸ and ਅੱਡਾ both have addak ੱ.", expected_vi: "Người học chỉ ra addak trong cả hai từ.", expected_en: "The learner points to addak in both words.", qaPrompt_vi: "Addak nằm ở đâu trong cụm này?", qaPrompt_en: "Where is addak in this phrase?", learnerTrap: { vi: "Addak nhỏ nhưng cần thấy khi đọc nhanh.", en: "Addak is small but must be seen during fast reading." }, canadaPractical: true, finalQA: true },
      { id: "pa-golden-mark-002", area: "addak_tippi_bindi", use: "final_qa", gurmukhi: "ਮਾਂ", romanization: "maan", sample_vi: "Mẫu chuẩn: ਮਾਂ có bindi ở phía trên.", sample_en: "Reference: ਮਾਂ has bindi above.", expected_vi: "Người học nhận ra dấu trên trong từ gia đình.", expected_en: "The learner notices the upper mark in the family word.", qaPrompt_vi: "Dấu nào báo mũi hóa trong từ này?", qaPrompt_en: "Which mark signals nasalization here?" },
      { id: "pa-golden-mark-003", area: "addak_tippi_bindi", use: "integration_readiness", gurmukhi: "ਪੰਜਾਬ", romanization: "panjab/punjab", sample_vi: "Mẫu chuẩn: ਪੰਜਾਬ có tippi ੰ mà Latin không hiện rõ.", sample_en: "Reference: ਪੰਜਾਬ has tippi ੰ that Latin does not show clearly.", expected_vi: "Người học xác nhận bằng chữ Gurmukhi, không chỉ Punjab.", expected_en: "The learner confirms through Gurmukhi, not only Punjab.", qaPrompt_vi: "Romanization che dấu nào ở đây?", qaPrompt_en: "Which mark does romanization hide here?", learnerTrap: { vi: "Panjab/Punjab là cầu nối, không phải chữ chính.", en: "Panjab/Punjab is a bridge, not the primary script." } },
    ],
  },
  {
    area: "survival_signage",
    title_vi: "Golden samples biển hiệu sinh tồn",
    title_en: "Survival Signage Golden Samples",
    sampleGoal_vi: "Cung cấp mẫu chuẩn cho biển cần hành động trong đời sống Canada.",
    sampleGoal_en: "Provide reference samples for action-oriented Canadian signs.",
    samples: [
      { id: "pa-golden-sign-001", area: "survival_signage", use: "integration_readiness", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", sample_vi: "Mẫu chuẩn: ਐਮਰਜੈਂਸੀ là cấp cứu/khẩn cấp.", sample_en: "Reference: ਐਮਰਜੈਂਸੀ means emergency/urgent care.", expected_vi: "Người học biết tìm trợ giúp khẩn cấp.", expected_en: "The learner knows to seek urgent help.", qaPrompt_vi: "Bạn làm gì khi thấy biển này ở bệnh viện?", qaPrompt_en: "What do you do when seeing this at a hospital?", canadaPractical: true, finalQA: true, integrationReady: true },
      { id: "pa-golden-sign-002", area: "survival_signage", use: "golden_sample", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", sample_vi: "Mẫu chuẩn: ਨਿਕਾਸ nghĩa là lối ra.", sample_en: "Reference: ਨਿਕਾਸ means exit.", expected_vi: "Người học đi theo biển để ra ngoài.", expected_en: "The learner follows the sign to leave.", qaPrompt_vi: "Biển này dẫn bạn đi đâu?", qaPrompt_en: "Where does this sign lead you?", canadaPractical: true },
      { id: "pa-golden-sign-003", area: "survival_signage", use: "final_qa", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", sample_vi: "Mẫu chuẩn: ਫਾਰਮੇਸੀ nghĩa là nhà thuốc.", sample_en: "Reference: ਫਾਰਮੇਸੀ means pharmacy.", expected_vi: "Người học xác nhận bằng ਫ dù romanization là ph/f.", expected_en: "The learner confirms with ਫ even when romanization is ph/f.", qaPrompt_vi: "Chữ nào giúp xác nhận nhà thuốc?", qaPrompt_en: "Which letter confirms pharmacy?", learnerTrap: { vi: "English pharmacy không thay thế Gurmukhi.", en: "English pharmacy does not replace Gurmukhi." }, canadaPractical: true },
    ],
  },
  {
    area: "service_words",
    title_vi: "Golden samples từ dịch vụ",
    title_en: "Service Word Golden Samples",
    sampleGoal_vi: "Kiểm tra từ dùng ở quầy dịch vụ, phòng khám, trường học và giấy tờ.",
    sampleGoal_en: "Check words used at counters, clinics, schools, and forms.",
    samples: [
      { id: "pa-golden-service-001", area: "service_words", use: "golden_sample", gurmukhi: "ਫਾਰਮ", romanization: "form", sample_vi: "Mẫu chuẩn: ਫਾਰਮ là mẫu đơn hoặc giấy cần điền.", sample_en: "Reference: ਫਾਰਮ is a form or paper to complete.", expected_vi: "Người học nối từ này với quầy dịch vụ.", expected_en: "The learner connects this word with service counters.", qaPrompt_vi: "Từ này xuất hiện ở tình huống nào?", qaPrompt_en: "Where does this word appear?", canadaPractical: true },
      { id: "pa-golden-service-002", area: "service_words", use: "final_qa", gurmukhi: "ਐਪਾਇੰਟਮੈਂਟ", romanization: "appointment", sample_vi: "Mẫu chuẩn: ਐਪਾਇੰਟਮੈਂਟ là lịch hẹn.", sample_en: "Reference: ਐਪਾਇੰਟਮੈਂਟ is an appointment.", expected_vi: "Người học nhận ra từ này trong phòng khám.", expected_en: "The learner recognizes this word in clinic settings.", qaPrompt_vi: "Bạn cần từ này khi làm gì?", qaPrompt_en: "When do you need this word?", canadaPractical: true, integrationReady: true },
      { id: "pa-golden-service-003", area: "service_words", use: "integration_readiness", gurmukhi: "ਸਕੂਲ", romanization: "school/skul", sample_vi: "Mẫu chuẩn: ਸਕੂਲ là trường học dù là từ mượn.", sample_en: "Reference: ਸਕੂਲ is school even though it is a loanword.", expected_vi: "Người học đọc bằng Gurmukhi trước English.", expected_en: "The learner reads through Gurmukhi before English.", qaPrompt_vi: "Từ mượn này vẫn cần đọc bằng gì?", qaPrompt_en: "What script should this loanword still be read through?", learnerTrap: { vi: "Từ mượn vẫn cần Gurmukhi.", en: "Loanwords still need Gurmukhi." }, canadaPractical: true },
    ],
  },
  {
    area: "thematic_vocabulary",
    title_vi: "Golden samples từ vựng chủ đề",
    title_en: "Thematic Vocabulary Golden Samples",
    sampleGoal_vi: "Cung cấp mẫu từ theo gia đình, sức khỏe, nhà ở và tiền.",
    sampleGoal_en: "Provide reference words for family, health, housing, and money.",
    samples: [
      { id: "pa-golden-theme-001", area: "thematic_vocabulary", use: "golden_sample", gurmukhi: "ਪਰਿਵਾਰ", romanization: "parivaar", sample_vi: "Mẫu chuẩn: ਪਰਿਵਾਰ thuộc chủ đề gia đình.", sample_en: "Reference: ਪਰਿਵਾਰ belongs to the family theme.", expected_vi: "Người học xếp từ vào nhóm gia đình.", expected_en: "The learner sorts the word into the family group.", qaPrompt_vi: "Từ này thuộc chủ đề nào?", qaPrompt_en: "Which theme does this word belong to?" },
      { id: "pa-golden-theme-002", area: "thematic_vocabulary", use: "final_qa", gurmukhi: "ਦਵਾਈ", romanization: "davai", sample_vi: "Mẫu chuẩn: ਦਵਾਈ nghĩa là thuốc.", sample_en: "Reference: ਦਵਾਈ means medicine.", expected_vi: "Người học nối từ này với phòng khám/nhà thuốc.", expected_en: "The learner links this word with clinics/pharmacies.", qaPrompt_vi: "Từ này hữu ích ở đâu?", qaPrompt_en: "Where is this word useful?", canadaPractical: true },
      { id: "pa-golden-theme-003", area: "thematic_vocabulary", use: "integration_readiness", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", sample_vi: "Mẫu chuẩn: ਕਿਰਾਇਆ nghĩa là tiền thuê.", sample_en: "Reference: ਕਿਰਾਇਆ means rent.", expected_vi: "Người học nối từ này với nhà ở và mẫu đơn.", expected_en: "The learner links this word with housing and forms.", qaPrompt_vi: "Từ này thuộc nhà ở hay y tế?", qaPrompt_en: "Does this belong to housing or health?", canadaPractical: true, integrationReady: true },
    ],
  },
  {
    area: "verbs",
    title_vi: "Golden samples động từ",
    title_en: "Verb Golden Samples",
    sampleGoal_vi: "Kiểm tra động từ lõi trong cụm hành động và câu hỗ trợ.",
    sampleGoal_en: "Check core verbs inside action chunks and support sentences.",
    samples: [
      { id: "pa-golden-verb-001", area: "verbs", use: "golden_sample", gurmukhi: "ਕਰਨਾ", romanization: "karna", sample_vi: "Mẫu chuẩn: ਕਰਨਾ nghĩa là làm và ghép với danh từ.", sample_en: "Reference: ਕਰਨਾ means do/make and combines with nouns.", expected_vi: "Người học nhận ra mẫu danh từ + ਕਰਨਾ.", expected_en: "The learner recognizes noun + ਕਰਨਾ patterns.", qaPrompt_vi: "Động từ này giúp tạo loại cụm nào?", qaPrompt_en: "What kind of chunk does this verb form?" },
      { id: "pa-golden-verb-002", area: "verbs", use: "final_qa", gurmukhi: "ਲੈਣਾ", romanization: "laina", sample_vi: "Mẫu chuẩn: ਲੈਣਾ đổi nghĩa theo ngữ cảnh dịch vụ.", sample_en: "Reference: ਲੈਣਾ shifts meaning by service context.", expected_vi: "Người học hiểu ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ là đặt lịch.", expected_en: "The learner understands ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ as booking an appointment.", qaPrompt_vi: "Trong phòng khám, ਲੈਣਾ có thể tạo nghĩa gì?", qaPrompt_en: "In a clinic, what meaning can ਲੈਣਾ help form?", canadaPractical: true, finalQA: true },
      { id: "pa-golden-verb-003", area: "verbs", use: "integration_readiness", gurmukhi: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ", romanization: "mainu samajh nahi aai", sample_vi: "Mẫu chuẩn: câu này báo tôi chưa hiểu.", sample_en: "Reference: this sentence says I did not understand.", expected_vi: "Người học dùng câu này để xin hỗ trợ thêm.", expected_en: "The learner uses this sentence to ask for more support.", qaPrompt_vi: "Câu này giải quyết vấn đề giao tiếp nào?", qaPrompt_en: "What communication problem does this solve?", canadaPractical: true, integrationReady: true },
    ],
  },
  {
    area: "collocations",
    title_vi: "Golden samples collocation",
    title_en: "Collocation Golden Samples",
    sampleGoal_vi: "Kiểm tra cụm tự nhiên cần dùng nhanh ở nơi công cộng.",
    sampleGoal_en: "Check natural chunks needed quickly in public settings.",
    samples: [
      { id: "pa-golden-collocation-001", area: "collocations", use: "integration_readiness", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", sample_vi: "Mẫu chuẩn: câu này nghĩa là tôi cần giúp đỡ.", sample_en: "Reference: this sentence means I need help.", expected_vi: "Người học dùng cả câu, không chỉ từ ਮਦਦ.", expected_en: "The learner uses the whole sentence, not only ਮਦਦ.", qaPrompt_vi: "Bạn dùng câu này ở đâu tại Canada?", qaPrompt_en: "Where in Canada might you use this?", canadaPractical: true, finalQA: true, integrationReady: true },
      { id: "pa-golden-collocation-002", area: "collocations", use: "golden_sample", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", sample_vi: "Mẫu chuẩn: ਫਾਰਮ ਭਰਨਾ nghĩa là điền mẫu đơn.", sample_en: "Reference: ਫਾਰਮ ਭਰਨਾ means to fill out a form.", expected_vi: "Người học hiểu cụm này như một hành động.", expected_en: "The learner understands this chunk as one action.", qaPrompt_vi: "Cụm này yêu cầu bạn làm gì?", qaPrompt_en: "What does this chunk ask you to do?", canadaPractical: true },
      { id: "pa-golden-collocation-003", area: "collocations", use: "final_qa", gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", sample_vi: "Mẫu chuẩn: cụm này nghĩa là sửa lỗi.", sample_en: "Reference: this chunk means correct a mistake.", expected_vi: "Người học chú ý ਠ trong ਠੀਕ.", expected_en: "The learner notices ਠ in ਠੀਕ.", qaPrompt_vi: "Bẫy chữ nào có trong cụm này?", qaPrompt_en: "Which letter trap appears in this chunk?", learnerTrap: { vi: "ਠ không phải th tiếng Anh.", en: "ਠ is not English th." }, canadaPractical: true },
    ],
  },
  {
    area: "romanization_bridge",
    title_vi: "Golden samples romanization bridge",
    title_en: "Romanization Bridge Golden Samples",
    sampleGoal_vi: "Chuẩn hóa cách dùng Latin để tìm kiếm nhưng xác nhận bằng Gurmukhi.",
    sampleGoal_en: "Standardize using Latin for search while confirming with Gurmukhi.",
    samples: [
      { id: "pa-golden-roman-001", area: "romanization_bridge", use: "golden_sample", gurmukhi: "ਫਲ", romanization: "phal/fal", sample_vi: "Mẫu chuẩn: phal và fal đều có thể trỏ về ਫਲ.", sample_en: "Reference: phal and fal can both point to ਫਲ.", expected_vi: "Người học xác nhận bằng Gurmukhi ਫਲ.", expected_en: "The learner confirms with Gurmukhi ਫਲ.", qaPrompt_vi: "Nếu phal không ra, bạn thử gì?", qaPrompt_en: "If phal fails, what do you try?", learnerTrap: { vi: "ਫ có thể ghi ph hoặc f.", en: "ਫ may be written ph or f." } },
      { id: "pa-golden-roman-002", area: "romanization_bridge", use: "final_qa", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", sample_vi: "Mẫu chuẩn: vadda/wadda là biến thể cho ਵੱਡਾ.", sample_en: "Reference: vadda/wadda are variants for ਵੱਡਾ.", expected_vi: "Người học không tạo hai từ khác nhau.", expected_en: "The learner does not create two different words.", qaPrompt_vi: "Hai spelling Latin này trỏ về chữ nào?", qaPrompt_en: "Which Gurmukhi form do these spellings point to?", learnerTrap: { vi: "v/w thay đổi theo nguồn và giọng.", en: "v/w varies by source and accent." }, finalQA: true },
      { id: "pa-golden-roman-003", area: "romanization_bridge", use: "integration_readiness", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", sample_vi: "Mẫu chuẩn: shahir/shehar cần xác nhận bằng ਸ਼ਹਿਰ.", sample_en: "Reference: shahir/shehar should be confirmed with ਸ਼ਹਿਰ.", expected_vi: "Người học dùng Gurmukhi làm đáp án cuối.", expected_en: "The learner uses Gurmukhi as the final answer.", qaPrompt_vi: "Bạn xác nhận kết quả tìm kiếm bằng gì?", qaPrompt_en: "How do you confirm the search result?", learnerTrap: { vi: "Romanization khác nhau không luôn đổi nghĩa.", en: "Different romanization does not always change meaning." }, integrationReady: true },
    ],
  },
  {
    area: "shahmukhi_awareness",
    title_vi: "Golden sample nhận biết Shahmukhi",
    title_en: "Shahmukhi Awareness Golden Sample",
    sampleGoal_vi: "Giữ phạm vi rõ: Gurmukhi là chính, Shahmukhi chỉ để nhận biết.",
    sampleGoal_en: "Keep scope clear: Gurmukhi is primary, Shahmukhi is awareness only.",
    samples: [
      { id: "pa-golden-shahmukhi-001", area: "shahmukhi_awareness", use: "final_qa", gurmukhi: "ਗੁਰਮੁਖੀ ਵਿੱਚ ਪੜ੍ਹੋ", romanization: "gurmukhi vich parho", sample_vi: "Mẫu chuẩn: bộ này tiếp tục đọc bằng Gurmukhi.", sample_en: "Reference: this set continues reading through Gurmukhi.", expected_vi: "Người học biết Shahmukhi chỉ là nhận biết.", expected_en: "The learner knows Shahmukhi is awareness only.", qaPrompt_vi: "Đây có phải khóa Shahmukhi đầy đủ không?", qaPrompt_en: "Is this a full Shahmukhi course?", finalQA: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_GOLDEN_SAMPLES = sections;

export const PUNJABI_SCRIPT_VOCABULARY_GOLDEN_SAMPLE_ITEMS: ReadonlyArray<PunjabiGoldenSample> =
  sections.flatMap((section) => section.samples);

export default PUNJABI_SCRIPT_VOCABULARY_GOLDEN_SAMPLES;
