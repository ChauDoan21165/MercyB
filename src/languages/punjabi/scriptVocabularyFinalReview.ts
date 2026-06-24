// src/languages/punjabi/scriptVocabularyFinalReview.ts
//
// Punjabi script and vocabulary final review for Vietnamese-speaking and
// English-speaking learners. Gurmukhi is primary; romanization is a bridge.
// Native review is deferred.

export type PunjabiFinalReviewArea =
  | "gurmukhi_recognition"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "thematic_vocabulary"
  | "high_frequency_verbs"
  | "collocations"
  | "romanization_bridge"
  | "shahmukhi_awareness";

export type PunjabiFinalReviewMode = "identify" | "explain" | "apply" | "qa_checkpoint";

export type PunjabiFinalReviewItem = {
  id: string;
  area: PunjabiFinalReviewArea;
  mode: PunjabiFinalReviewMode;
  gurmukhi: string;
  romanization?: string;
  question_vi: string;
  question_en: string;
  answer_vi: string;
  answer_en: string;
  reviewNote_vi: string;
  reviewNote_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  checkpoint?: boolean;
  finalReview?: boolean;
};

export type PunjabiFinalReviewSection = {
  area: PunjabiFinalReviewArea;
  title_vi: string;
  title_en: string;
  reviewGoal_vi: string;
  reviewGoal_en: string;
  items: ReadonlyArray<PunjabiFinalReviewItem>;
};

export const PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW_SCOPE = {
  vi: "Bộ final review này kiểm tra Gurmukhi, dấu nguyên âm, addak/tippi/bindi, biển hiệu sinh tồn, từ vựng theo chủ đề, động từ tần suất cao, collocation và romanization. Shahmukhi chỉ là nhận biết, không phải khóa Shahmukhi đầy đủ. Native review được hoãn.",
  en: "This final review checks Gurmukhi, vowel signs, addak/tippi/bindi, survival signage, thematic vocabulary, high-frequency verbs, collocations, and romanization. Shahmukhi is awareness only, not a full Shahmukhi course. Native review is deferred.",
  noAudioScoringOrIntegration: true,
} as const;

const sections: ReadonlyArray<PunjabiFinalReviewSection> = [
  {
    area: "gurmukhi_recognition",
    title_vi: "Final review chữ Gurmukhi",
    title_en: "Gurmukhi Letter Final Review",
    reviewGoal_vi: "Kiểm tra nhanh chữ cái và cặp dễ nhầm trước khi học tiếp.",
    reviewGoal_en: "Quickly check letters and confusing pairs before moving on.",
    items: [
      { id: "pa-final-gurmukhi-001", area: "gurmukhi_recognition", mode: "identify", gurmukhi: "ਕ / ਖ", romanization: "k / kh", question_vi: "Chữ nào trong cặp này là bật hơi?", question_en: "Which letter in this pair is aspirated?", answer_vi: "ਖ là chữ bật hơi; ਕ là không bật hơi.", answer_en: "ਖ is aspirated; ਕ is unaspirated.", reviewNote_vi: "Nếu nhầm, ôn lại cách nhận diện kh trong Gurmukhi.", reviewNote_en: "If missed, review how kh is represented in Gurmukhi.", learnerTrap: { vi: "Romanization kh không phải hai chữ rời trong Gurmukhi.", en: "Romanized kh is not two separate Gurmukhi letters." }, finalReview: true },
      { id: "pa-final-gurmukhi-002", area: "gurmukhi_recognition", mode: "explain", gurmukhi: "ਤ / ਟ", romanization: "t / tt", question_vi: "Vì sao hai chữ này không nên học chỉ bằng Latin t?", question_en: "Why should these not be learned only as Latin t?", answer_vi: "ਤ là t răng, còn ਟ là t quặt lưỡi.", answer_en: "ਤ is dental t, while ਟ is retroflex t.", reviewNote_vi: "Final review yêu cầu nhìn chữ Gurmukhi, không đoán từ Latin.", reviewNote_en: "The final review requires looking at Gurmukhi, not guessing from Latin.", learnerTrap: { vi: "Latin t che mất khác biệt giữa hai chữ.", en: "Latin t hides the difference between the two letters." } },
      { id: "pa-final-gurmukhi-003", area: "gurmukhi_recognition", mode: "apply", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", question_vi: "Dấu dưới trong ਸ਼ giúp bạn tránh lỗi nào?", question_en: "What error does the lower mark in ਸ਼ help you avoid?", answer_vi: "Nó giúp không đọc ਸ਼ như ਸ khi gặp từ ਸ਼ਹਿਰ.", answer_en: "It helps avoid reading ਸ਼ as ਸ in ਸ਼ਹਿਰ.", reviewNote_vi: "Dùng Gurmukhi để xác nhận dù romanization thay đổi.", reviewNote_en: "Use Gurmukhi to confirm even when romanization varies.", learnerTrap: { vi: "Bỏ dấu dưới làm sai nhận diện chữ.", en: "Dropping the lower mark breaks letter recognition." }, checkpoint: true },
    ],
  },
  {
    area: "vowel_signs",
    title_vi: "Final review dấu nguyên âm",
    title_en: "Vowel Sign Final Review",
    reviewGoal_vi: "Kiểm tra dấu nguyên âm thường gặp trong từ và biển ngắn.",
    reviewGoal_en: "Check common vowel signs in words and short signs.",
    items: [
      { id: "pa-final-vowel-001", area: "vowel_signs", mode: "identify", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", question_vi: "Dấu nào viết trước nhưng đọc sau phụ âm?", question_en: "Which sign is written before but read after the consonant?", answer_vi: "Dấu ਿ trong ਕਿ viết trước nhưng đọc sau ਕ.", answer_en: "The ਿ sign in ਕਿ is written before but read after ਕ.", reviewNote_vi: "Đây là lỗi cuối kỳ phổ biến của người mới học.", reviewNote_en: "This is a common final-review issue for beginners.", learnerTrap: { vi: "Đừng đọc theo vị trí viết từ trái sang phải.", en: "Do not read only by left-to-right written position." }, finalReview: true },
      { id: "pa-final-vowel-002", area: "vowel_signs", mode: "explain", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", question_vi: "Bạn giải thích khác biệt giữa hai âm tiết này thế nào?", question_en: "How do you explain the difference between these syllables?", answer_vi: "ਕੁ dùng ੁ ngắn; ਕੂ dùng ੂ dài.", answer_en: "ਕੁ uses short ੁ; ਕੂ uses long ੂ.", reviewNote_vi: "Nhận diện độ dài giúp đọc từ vựng chính xác hơn.", reviewNote_en: "Recognizing length supports more accurate vocabulary reading." },
      { id: "pa-final-vowel-003", area: "vowel_signs", mode: "qa_checkpoint", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", question_vi: "Bạn có thể đọc ba dấu e, ai/ae và au không?", question_en: "Can you read the three signs e, ai/ae, and au?", answer_vi: "ਕੇ là ke, ਕੈ là kai/kae, và ਕੌ là kau.", answer_en: "ਕੇ is ke, ਕੈ is kai/kae, and ਕੌ is kau.", reviewNote_vi: "Nếu còn nhầm, quay lại ladder nguyên âm trước biển hiệu.", reviewNote_en: "If still confused, return to the vowel ladder before signage.", learnerTrap: { vi: "ai/ae trong romanization thay đổi theo nguồn.", en: "ai/ae romanization changes by source." }, checkpoint: true },
    ],
  },
  {
    area: "addak_tippi_bindi",
    title_vi: "Final review addak, tippi, bindi",
    title_en: "Addak, Tippi, Bindi Final Review",
    reviewGoal_vi: "Kiểm tra dấu phụ hay bị bỏ qua trong từ quen thuộc.",
    reviewGoal_en: "Check commonly skipped marks in familiar words.",
    items: [
      { id: "pa-final-mark-001", area: "addak_tippi_bindi", mode: "identify", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", question_vi: "Bạn thấy addak ở đâu trong cụm này?", question_en: "Where do you see addak in this phrase?", answer_vi: "Addak ੱ xuất hiện trong ਬੱਸ và ਅੱਡਾ.", answer_en: "Addak ੱ appears in ਬੱਸ and ਅੱਡਾ.", reviewNote_vi: "Cụm này hữu ích khi đọc biển giao thông ở Canada.", reviewNote_en: "This phrase is useful when reading transit signs in Canada.", learnerTrap: { vi: "Bỏ addak làm cụm nhìn quen nhưng đọc thiếu.", en: "Skipping addak makes the phrase look familiar but incomplete." }, canadaPractical: true, checkpoint: true },
      { id: "pa-final-mark-002", area: "addak_tippi_bindi", mode: "explain", gurmukhi: "ਮਾਂ", romanization: "maan", question_vi: "Dấu bindi giúp bạn nhận ra điều gì?", question_en: "What does bindi help you recognize?", answer_vi: "Bindi ਂ ở trên báo dấu mũi hóa trong từ ਮਾਂ.", answer_en: "Bindi ਂ above marks nasalization in ਮਾਂ.", reviewNote_vi: "Final review chỉ yêu cầu nhận diện dấu, không đánh giá giọng.", reviewNote_en: "This final review asks for mark recognition, not accent judgment.", learnerTrap: { vi: "Đừng bỏ qua dấu nhỏ phía trên chữ.", en: "Do not ignore the small mark above the letter." } },
      { id: "pa-final-mark-003", area: "addak_tippi_bindi", mode: "apply", gurmukhi: "ਪੰਜਾਬ", romanization: "panjab/punjab", question_vi: "Tippi trong ਪੰਜਾਬ có thể bị romanization che thế nào?", question_en: "How can romanization hide tippi in ਪੰਜਾਬ?", answer_vi: "Latin Punjab không cho thấy rõ dấu ੰ trong Gurmukhi.", answer_en: "Latin Punjab does not clearly show the ੰ mark in Gurmukhi.", reviewNote_vi: "Luôn kiểm tra dạng Gurmukhi khi học tên ngôn ngữ/vùng.", reviewNote_en: "Always check the Gurmukhi form when learning the language/region name.", learnerTrap: { vi: "Panjab/Punjab là cầu nối, không phải chữ chính.", en: "Panjab/Punjab is a bridge, not the primary script." } },
    ],
  },
  {
    area: "survival_signage",
    title_vi: "Final review biển hiệu sinh tồn",
    title_en: "Survival Signage Final Review",
    reviewGoal_vi: "Kiểm tra biển y tế, giao thông và dịch vụ có tính hành động.",
    reviewGoal_en: "Check action-oriented health, transit, and service signs.",
    items: [
      { id: "pa-final-sign-001", area: "survival_signage", mode: "apply", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", question_vi: "Bạn làm gì khi thấy biển này ở bệnh viện?", question_en: "What do you do when you see this sign in a hospital?", answer_vi: "Hiểu đây là cấp cứu và tìm trợ giúp khẩn cấp.", answer_en: "Understand it as emergency and seek urgent help.", reviewNote_vi: "Đây là ví dụ Canada-practical cho người học sinh tồn.", reviewNote_en: "This is a Canada-practical example for survival learners.", canadaPractical: true, checkpoint: true, finalReview: true },
      { id: "pa-final-sign-002", area: "survival_signage", mode: "apply", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", question_vi: "Biển ਨਿਕਾਸ yêu cầu hành động nào?", question_en: "What action does ਨਿਕਾਸ suggest?", answer_vi: "Đi theo biển để tìm lối ra khỏi nơi đó.", answer_en: "Follow the sign to find the exit from that place.", reviewNote_vi: "Kết nối biển đơn với biển ghép như ga tàu.", reviewNote_en: "Connect the simple sign with combined station signs.", canadaPractical: true, checkpoint: true },
      { id: "pa-final-sign-003", area: "survival_signage", mode: "qa_checkpoint", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", question_vi: "Bạn xác nhận từ nhà thuốc bằng chữ nào?", question_en: "Which letter confirms the pharmacy word?", answer_vi: "Chữ ਫ xác nhận ਫਾਰਮੇਸੀ dù tìm bằng ph hoặc f.", answer_en: "The letter ਫ confirms ਫਾਰਮੇਸੀ even when searching ph or f.", reviewNote_vi: "Romanization giúp tìm kiếm, Gurmukhi quyết định nhận diện.", reviewNote_en: "Romanization supports search; Gurmukhi decides recognition.", learnerTrap: { vi: "Đừng để spelling English thay thế chữ Gurmukhi.", en: "Do not let English spelling replace Gurmukhi." }, canadaPractical: true },
    ],
  },
  {
    area: "thematic_vocabulary",
    title_vi: "Final review từ vựng theo chủ đề",
    title_en: "Thematic Vocabulary Final Review",
    reviewGoal_vi: "Kiểm tra khả năng xếp từ vào nhóm nhà, sức khỏe, tiền và trường học.",
    reviewGoal_en: "Check sorting words into home, health, money, and school themes.",
    items: [
      { id: "pa-final-theme-001", area: "thematic_vocabulary", mode: "identify", gurmukhi: "ਪਰਿਵਾਰ", romanization: "parivaar", question_vi: "Từ này thuộc chủ đề nào?", question_en: "Which theme does this word belong to?", answer_vi: "ਪਰਿਵਾਰ thuộc chủ đề gia đình và quan hệ.", answer_en: "ਪਰਿਵਾਰ belongs to family and relationships.", reviewNote_vi: "Dùng nhóm chủ đề để nhớ từ nhanh hơn.", reviewNote_en: "Use themes to remember vocabulary faster." },
      { id: "pa-final-theme-002", area: "thematic_vocabulary", mode: "apply", gurmukhi: "ਦਵਾਈ", romanization: "davai", question_vi: "Từ này hữu ích ở tình huống Canada nào?", question_en: "Which Canadian situation is this word useful in?", answer_vi: "ਦਵਾਈ hữu ích ở phòng khám hoặc nhà thuốc.", answer_en: "ਦਵਾਈ is useful at a clinic or pharmacy.", reviewNote_vi: "Kết hợp với ਫਾਰਮੇਸੀ để đọc tình huống sức khỏe.", reviewNote_en: "Combine it with ਫਾਰਮੇਸੀ for health situations.", canadaPractical: true },
      { id: "pa-final-theme-003", area: "thematic_vocabulary", mode: "apply", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", question_vi: "Bạn xếp ਕਿਰਾਇਆ vào nhóm nào?", question_en: "Where do you sort ਕਿਰਾਇਆ?", answer_vi: "Xếp vào nhà ở và tiền vì nghĩa là tiền thuê.", answer_en: "Sort it under housing and money because it means rent.", reviewNote_vi: "Từ này giúp đọc tin thuê nhà và mẫu đơn.", reviewNote_en: "This word helps with rental notices and forms.", canadaPractical: true, finalReview: true },
    ],
  },
  {
    area: "high_frequency_verbs",
    title_vi: "Final review động từ tần suất cao",
    title_en: "High-Frequency Verb Final Review",
    reviewGoal_vi: "Kiểm tra động từ lõi trong cụm dịch vụ và câu ngắn.",
    reviewGoal_en: "Check core verbs in service phrases and short sentences.",
    items: [
      { id: "pa-final-verb-001", area: "high_frequency_verbs", mode: "explain", gurmukhi: "ਕਰਨਾ", romanization: "karna", question_vi: "ਕਰਨਾ giúp tạo loại cụm nào?", question_en: "What kind of phrase does ਕਰਨਾ help form?", answer_vi: "ਕਰਨਾ nghĩa là làm và thường ghép với danh từ.", answer_en: "ਕਰਨਾ means do/make and often combines with nouns.", reviewNote_vi: "Ôn cụm như ਅਨੁਵਾਦ ਕਰਨਾ và ਗਲਤੀ ਠੀਕ ਕਰਨਾ.", reviewNote_en: "Review phrases like ਅਨੁਵਾਦ ਕਰਨਾ and ਗਲਤੀ ਠੀਕ ਕਰਨਾ." },
      { id: "pa-final-verb-002", area: "high_frequency_verbs", mode: "apply", gurmukhi: "ਲੈਣਾ", romanization: "laina", question_vi: "Trong ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ, ਲੈਣਾ nghĩa thực dụng là gì?", question_en: "In ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ, what practical meaning does ਲੈਣਾ have?", answer_vi: "Nó giúp tạo nghĩa đặt hoặc lấy lịch hẹn.", answer_en: "It helps form the meaning book or take an appointment.", reviewNote_vi: "Cụm này hữu ích ở phòng khám tại Canada.", reviewNote_en: "This phrase is useful at clinics in Canada.", canadaPractical: true, checkpoint: true },
      { id: "pa-final-verb-003", area: "high_frequency_verbs", mode: "qa_checkpoint", gurmukhi: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ", romanization: "mainu samajh nahi aai", question_vi: "Câu này giải quyết vấn đề giao tiếp nào?", question_en: "What communication problem does this sentence solve?", answer_vi: "Nó báo rằng tôi chưa hiểu và cần hỗ trợ thêm.", answer_en: "It says I did not understand and need more support.", reviewNote_vi: "Dùng cùng yêu cầu nói chậm hoặc lặp lại.", reviewNote_en: "Use it with requests to speak slowly or repeat.", canadaPractical: true, checkpoint: true },
    ],
  },
  {
    area: "collocations",
    title_vi: "Final review collocation",
    title_en: "Collocation Final Review",
    reviewGoal_vi: "Kiểm tra cụm tự nhiên dùng trong dịch vụ, lỗi và trợ giúp.",
    reviewGoal_en: "Check natural chunks used in services, mistakes, and help.",
    items: [
      { id: "pa-final-collocation-001", area: "collocations", mode: "apply", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", question_vi: "Bạn dùng câu này khi nào?", question_en: "When do you use this sentence?", answer_vi: "Dùng khi cần giúp đỡ ở dịch vụ, y tế hoặc nơi công cộng.", answer_en: "Use it when help is needed in service, health, or public settings.", reviewNote_vi: "Đây là checkpoint sinh tồn quan trọng.", reviewNote_en: "This is an important survival checkpoint.", canadaPractical: true, checkpoint: true, finalReview: true },
      { id: "pa-final-collocation-002", area: "collocations", mode: "identify", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", question_vi: "Cụm này thường xuất hiện trong việc gì?", question_en: "Where does this phrase commonly appear?", answer_vi: "Nó xuất hiện khi cần điền mẫu đơn.", answer_en: "It appears when a form needs to be filled out.", reviewNote_vi: "Hữu ích ở trường học, phòng khám và dịch vụ công.", reviewNote_en: "Useful at school, clinics, and public services.", canadaPractical: true },
      { id: "pa-final-collocation-003", area: "collocations", mode: "explain", gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", question_vi: "Bẫy chữ nào có trong cụm này?", question_en: "Which letter trap appears in this phrase?", answer_vi: "ਠ trong ਠੀਕ romanize là th nhưng không phải th tiếng Anh.", answer_en: "ਠ in ਠੀਕ romanizes as th but is not English th.", reviewNote_vi: "Đọc theo Gurmukhi trước khi dùng romanization.", reviewNote_en: "Read from Gurmukhi before using romanization.", learnerTrap: { vi: "th dễ làm người học đọc theo tiếng Anh.", en: "th can make learners read in an English style." } },
    ],
  },
  {
    area: "romanization_bridge",
    title_vi: "Final review cầu nối romanization",
    title_en: "Romanization Bridge Final Review",
    reviewGoal_vi: "Kiểm tra khả năng dùng Latin để tìm kiếm nhưng xác nhận bằng Gurmukhi.",
    reviewGoal_en: "Check using Latin search while confirming with Gurmukhi.",
    items: [
      { id: "pa-final-roman-001", area: "romanization_bridge", mode: "qa_checkpoint", gurmukhi: "ਫਲ", romanization: "phal/fal", question_vi: "Nếu phal không tìm được, bạn thử gì?", question_en: "If phal does not work, what do you try?", answer_vi: "Thử fal, rồi xác nhận từ bằng Gurmukhi ਫਲ.", answer_en: "Try fal, then confirm the word with Gurmukhi ਫਲ.", reviewNote_vi: "ਫ có thể được romanize bằng ph hoặc f.", reviewNote_en: "ਫ may be romanized with ph or f.", learnerTrap: { vi: "Đừng tạo hai từ khác nhau từ hai spelling Latin.", en: "Do not create two different words from two Latin spellings." }, checkpoint: true },
      { id: "pa-final-roman-002", area: "romanization_bridge", mode: "explain", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", question_vi: "vadda và wadda có phải hai từ Gurmukhi không?", question_en: "Are vadda and wadda two Gurmukhi words?", answer_vi: "Không; cả hai là biến thể romanization cho ਵੱਡਾ.", answer_en: "No; both are romanization variants for ਵੱਡਾ.", reviewNote_vi: "ਵ có thể được ghi gần v hoặc w tùy nguồn.", reviewNote_en: "ਵ may be written near v or w depending on source.", learnerTrap: { vi: "Chữ Latin thay đổi không nhất thiết đổi nghĩa.", en: "Changing Latin spelling does not necessarily change meaning." } },
      { id: "pa-final-roman-003", area: "romanization_bridge", mode: "apply", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", question_vi: "Bạn xác nhận kết quả tìm kiếm bằng dạng nào?", question_en: "Which form confirms the search result?", answer_vi: "Xác nhận bằng Gurmukhi ਸ਼ਹਿਰ sau khi thử shahir hoặc shehar.", answer_en: "Confirm with Gurmukhi ਸ਼ਹਿਰ after trying shahir or shehar.", reviewNote_vi: "Cách này giữ Gurmukhi là chữ chính.", reviewNote_en: "This keeps Gurmukhi as the primary script.", learnerTrap: { vi: "Romanization là cầu nối, không phải đáp án cuối.", en: "Romanization is a bridge, not the final answer." }, finalReview: true },
    ],
  },
  {
    area: "shahmukhi_awareness",
    title_vi: "Final review nhận biết Shahmukhi",
    title_en: "Shahmukhi Awareness Final Review",
    reviewGoal_vi: "Xác nhận phạm vi: Gurmukhi là chính, Shahmukhi chỉ để nhận biết.",
    reviewGoal_en: "Confirm scope: Gurmukhi is primary, Shahmukhi is awareness only.",
    items: [
      { id: "pa-final-shahmukhi-001", area: "shahmukhi_awareness", mode: "qa_checkpoint", gurmukhi: "ਗੁਰਮੁਖੀ ਵਿੱਚ ਪੜ੍ਹੋ", romanization: "gurmukhi vich parho", question_vi: "Final review này có dạy Shahmukhi đầy đủ không?", question_en: "Does this final review teach full Shahmukhi?", answer_vi: "Không. Gurmukhi là chính; Shahmukhi chỉ là nhận biết.", answer_en: "No. Gurmukhi is primary; Shahmukhi is awareness only.", reviewNote_vi: "Native review được hoãn; nội dung vẫn chờ kiểm tra sau.", reviewNote_en: "Native review is deferred; content still awaits later checking.", checkpoint: true, finalReview: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW = sections;

export const PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW_ITEMS: ReadonlyArray<PunjabiFinalReviewItem> =
  sections.flatMap((section) => section.items);

export default PUNJABI_SCRIPT_VOCABULARY_FINAL_REVIEW;
