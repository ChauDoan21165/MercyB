// src/languages/punjabi/scriptVocabularyMergeReadinessSamples.ts
//
// Punjabi script/vocabulary merge-readiness samples for later app integration.
// Native review is deferred.

export type PunjabiMergeReadinessFocus =
  | "gurmukhi_primary"
  | "romanization_bridge"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "service_vocabulary"
  | "high_frequency_verbs"
  | "collocations"
  | "shahmukhi_awareness"
  | "merge_readiness";

export type PunjabiMergeReadinessStage = "merge_readiness" | "final_regression" | "pre_integration" | "sanity";

export type PunjabiScriptVocabularyMergeReadinessSample = {
  cell_id?: string;
  id: string;
  focus: PunjabiMergeReadinessFocus;
  stage: PunjabiMergeReadinessStage;
  gurmukhi: string;
  romanization?: string;
  mergeUse_vi: string;
  mergeUse_en: string;
  expected_vi: string;
  expected_en: string;
  readinessCheck_vi: string;
  readinessCheck_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  finalRegression?: boolean;
  preIntegration?: boolean;
};

export type PunjabiScriptVocabularyMergeReadinessSection = {
  cell_id?: string;
  focus: PunjabiMergeReadinessFocus;
  title_vi: string;
  title_en: string;
  mergeGoal_vi: string;
  mergeGoal_en: string;
  samples: ReadonlyArray<PunjabiScriptVocabularyMergeReadinessSample>;
};

export const PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SCOPE = {
  vi: "Bộ merge-readiness này đóng gói Punjabi script/vocabulary để kiểm trước khi merge vào bước app sau: Gurmukhi là primary, romanization chỉ là bridge, vowel signs và addak/tippi/bindi được giữ, signage, service words, verbs, collocations và Shahmukhi awareness được giới hạn. Đây là TypeScript data app-consumable; native review được hoãn.",
  en: "This merge-readiness set packages Punjabi script/vocabulary checks before a later app merge: Gurmukhi is primary, romanization is only a bridge, vowel signs and addak/tippi/bindi are preserved, signage, service words, verbs, collocations, and Shahmukhi awareness stay scoped. This is app-consumable TypeScript data; native review is deferred.",
  mergeDataOnly: true,
} as const;

const sections: ReadonlyArray<PunjabiScriptVocabularyMergeReadinessSection> = [
  {
    focus: "gurmukhi_primary",
    title_vi: "Gurmukhi primary merge checks",
    title_en: "Gurmukhi Primary Merge Checks",
    mergeGoal_vi: "Bảo đảm dữ liệu merge luôn hiển thị chữ Gurmukhi trước romanization hoặc English meaning.",
    mergeGoal_en: "Ensure merged data always shows Gurmukhi script before romanization or English meaning.",
    samples: [
      { id: "pa-merge-ready-gurmukhi-001", focus: "gurmukhi_primary", stage: "merge_readiness", gurmukhi: "ਪੰਜਾਬੀ", romanization: "panjabi/punjabi", mergeUse_vi: "Dùng làm guard tên ngôn ngữ để Punjabi/Panjabi không thay thế script.", mergeUse_en: "Use as a language-name guard so Punjabi/Panjabi does not replace script.", expected_vi: "ਪੰਜਾਬੀ xuất hiện trước các variant Latin trong app data.", expected_en: "ਪੰਜਾਬੀ appears before Latin variants in app data.", readinessCheck_vi: "Bắt mục chỉ còn Latin và mất tippi awareness.", readinessCheck_en: "Catches items that keep only Latin and lose tippi awareness.", learnerTrap: { vi: "Romanization không cho thấy dấu tippi trong ਪੰਜਾਬੀ.", en: "Romanization does not show the tippi mark in ਪੰਜਾਬੀ." }, preIntegration: true },
      { id: "pa-merge-ready-gurmukhi-002", focus: "gurmukhi_primary", stage: "sanity", gurmukhi: "ਪੜ੍ਹੋ", romanization: "parho", mergeUse_vi: "Dùng cho prompt đọc ngắn trước khi chuyển sang vocabulary thật.", mergeUse_en: "Use for a short reading prompt before moving into real vocabulary.", expected_vi: "Learner nhìn Gurmukhi trước, rồi mới nhận hint romanization.", expected_en: "Learner sees Gurmukhi first, then receives romanization support.", readinessCheck_vi: "Bắt prompt Latin-first trong dữ liệu chuẩn bị merge.", readinessCheck_en: "Catches Latin-first prompts in merge-ready data.", finalRegression: true },
    ],
  },
  {
    focus: "romanization_bridge",
    title_vi: "Romanization bridge merge checks",
    title_en: "Romanization Bridge Merge Checks",
    mergeGoal_vi: "Giữ romanization như cầu hỗ trợ, không biến thành khóa chính hoặc duplicate nghĩa.",
    mergeGoal_en: "Keep romanization as supporting bridge, not the primary key or duplicated meaning.",
    samples: [
      { id: "pa-merge-ready-roman-001", focus: "romanization_bridge", stage: "final_regression", gurmukhi: "ਫਲ", romanization: "phal/fal", mergeUse_vi: "Dùng để kiểm ph/f chỉ hỗ trợ đọc chữ ਫ.", mergeUse_en: "Use to check ph/f only supports reading the letter ਫ.", expected_vi: "Final prompt có thể bỏ romanization mà vẫn giữ ਫਲ.", expected_en: "The final prompt can remove romanization while retaining ਫਲ.", readinessCheck_vi: "Bắt sample yêu cầu phal/fal như đáp án chính.", readinessCheck_en: "Catches samples that require phal/fal as the main answer.", learnerTrap: { vi: "ਫ là anchor; ph/f không phải hai từ riêng.", en: "ਫ is the anchor; ph/f are not two separate words." }, finalRegression: true },
      { id: "pa-merge-ready-roman-002", focus: "romanization_bridge", stage: "merge_readiness", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", mergeUse_vi: "Dùng cho search hoặc glossary nhận nhiều spelling Latin.", mergeUse_en: "Use for search or glossary flows that accept multiple Latin spellings.", expected_vi: "vadda và wadda cùng trỏ về ਵੱਡਾ.", expected_en: "vadda and wadda both point back to ਵੱਡਾ.", readinessCheck_vi: "Bắt duplicate chỉ khác v/w trong dữ liệu merge.", readinessCheck_en: "Catches duplicates that differ only by v/w in merge data.", learnerTrap: { vi: "Hai spelling Latin không tự động là hai mục vocab.", en: "Two Latin spellings are not automatically two vocabulary items." }, preIntegration: true },
      { id: "pa-merge-ready-roman-003", focus: "romanization_bridge", stage: "sanity", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", mergeUse_vi: "Dùng để kiểm chữ ਸ਼ có dấu dưới không bị gộp với ਸ.", mergeUse_en: "Use to check that marked ਸ਼ is not merged with ਸ.", expected_vi: "Dữ liệu giữ Gurmukhi distinction trước variant Latin.", expected_en: "Data keeps the Gurmukhi distinction before Latin variants.", readinessCheck_vi: "Bắt romanization che mất lower-mark distinction.", readinessCheck_en: "Catches romanization hiding the lower-mark distinction.", learnerTrap: { vi: "ਸ਼ và ਸ không nên bị merge thành một chữ.", en: "ਸ਼ and ਸ should not be merged into one letter." }, finalRegression: true },
    ],
  },
  {
    focus: "vowel_signs",
    title_vi: "Vowel sign merge checks",
    title_en: "Vowel Sign Merge Checks",
    mergeGoal_vi: "Kiểm các dấu nguyên âm không bị mất khi data được gộp, lọc hoặc render.",
    mergeGoal_en: "Check that vowel signs are not lost when data is merged, filtered, or rendered.",
    samples: [
      { id: "pa-merge-ready-vowel-001", focus: "vowel_signs", stage: "merge_readiness", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", mergeUse_vi: "Dùng để giữ rule ਿ viết trước nhưng đọc sau phụ âm.", mergeUse_en: "Use to preserve the rule that ਿ is written before but read after the consonant.", expected_vi: "Cả short i và long ii được giữ bằng Gurmukhi.", expected_en: "Both short i and long ii are retained in Gurmukhi.", readinessCheck_vi: "Bắt render đọc ਕਿ theo thứ tự mắt nhìn.", readinessCheck_en: "Catches rendering that reads ਕਿ by visual order.", learnerTrap: { vi: "ਕਿ không đọc như ik dù dấu đứng bên trái.", en: "ਕਿ is not read as ik even though the sign sits left." }, finalRegression: true },
      { id: "pa-merge-ready-vowel-002", focus: "vowel_signs", stage: "pre_integration", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", mergeUse_vi: "Dùng để kiểm dấu dưới không biến mất trong compact card.", mergeUse_en: "Use to check under-letter signs do not disappear in compact cards.", expected_vi: "ੁ và ੂ vẫn phân biệt rõ trước khi dùng romanization.", expected_en: "ੁ and ੂ remain clearly separate before romanization support.", readinessCheck_vi: "Bắt sample chỉ còn ku/kuu và thiếu dấu Gurmukhi.", readinessCheck_en: "Catches samples reduced to ku/kuu without Gurmukhi signs.", learnerTrap: { vi: "Dấu dưới dễ bị bỏ qua khi font nhỏ.", en: "Under-letter signs are easy to miss in small text." }, preIntegration: true },
      { id: "pa-merge-ready-vowel-003", focus: "vowel_signs", stage: "final_regression", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", mergeUse_vi: "Dùng để kiểm e, ai/ae và au không bị swap.", mergeUse_en: "Use to check e, ai/ae, and au signs are not swapped.", expected_vi: "Ba dạng được giữ riêng khi dùng trong signage hoặc service.", expected_en: "The three forms stay separate in signage or service use.", readinessCheck_vi: "Bắt lỗi đổi ਕੈ thành ਕੇ hoặc ਕੌ.", readinessCheck_en: "Catches errors that change ਕੈ into ਕੇ or ਕੌ.", finalRegression: true },
    ],
  },
  {
    focus: "addak_tippi_bindi",
    title_vi: "Small mark merge checks",
    title_en: "Small Mark Merge Checks",
    mergeGoal_vi: "Bảo vệ addak, tippi và bindi trong những từ hay dùng ở transit, family và identity.",
    mergeGoal_en: "Protect addak, tippi, and bindi in common transit, family, and identity words.",
    samples: [
      { id: "pa-merge-ready-mark-001", focus: "addak_tippi_bindi", stage: "merge_readiness", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", mergeUse_vi: "Dùng cho Canada transit context như trạm xe buýt.", mergeUse_en: "Use for Canadian transit context such as a bus stop.", expected_vi: "ਬੱਸ và ਅੱਡਾ đều giữ addak trong dữ liệu.", expected_en: "ਬੱਸ and ਅੱਡਾ both keep addak in the data.", readinessCheck_vi: "Bắt normalization làm rơi ੱ khỏi cụm giao thông.", readinessCheck_en: "Catches normalization that drops ੱ from the transit chunk.", learnerTrap: { vi: "Addak nhỏ nhưng đổi cách đọc và không phải trang trí.", en: "Addak is small but changes reading and is not decoration." }, canadaPractical: true, finalRegression: true },
      { id: "pa-merge-ready-mark-002", focus: "addak_tippi_bindi", stage: "sanity", gurmukhi: "ਮਾਂ / ਪੰਜਾਬ", romanization: "maan / panjab", mergeUse_vi: "Dùng để giữ bindi và tippi trong family và Punjab identity.", mergeUse_en: "Use to keep bindi and tippi in family and Punjab identity words.", expected_vi: "Nêu rõ ਂ trong ਮਾਂ và ੰ trong ਪੰਜਾਬ.", expected_en: "Clearly names ਂ in ਮਾਂ and ੰ in ਪੰਜਾਬ.", readinessCheck_vi: "Bắt ghi chú nasal mark chung chung, thiếu vị trí.", readinessCheck_en: "Catches vague nasal-mark notes without placement.", learnerTrap: { vi: "Romanization không thể hiện vị trí dấu nasal rõ.", en: "Romanization cannot show nasal mark placement clearly." }, preIntegration: true },
    ],
  },
  {
    focus: "survival_signage",
    title_vi: "Survival signage merge checks",
    title_en: "Survival Signage Merge Checks",
    mergeGoal_vi: "Đảm bảo signage sinh tồn có Gurmukhi chính và hành động thực tế cho Canada.",
    mergeGoal_en: "Ensure survival signage has Gurmukhi primary text and practical Canada actions.",
    samples: [
      { id: "pa-merge-ready-sign-001", focus: "survival_signage", stage: "merge_readiness", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", mergeUse_vi: "Dùng cho biển lối ra trong tòa nhà, mall hoặc clinic.", mergeUse_en: "Use for exit signs in a building, mall, or clinic.", expected_vi: "Learner biết theo ਨਿਕਾਸ để tìm lối ra.", expected_en: "Learner knows to follow ਨਿਕਾਸ to find the exit.", readinessCheck_vi: "Bắt sample chỉ dịch exit mà thiếu hành động.", readinessCheck_en: "Catches samples that only translate exit without action.", canadaPractical: true, finalRegression: true },
      { id: "pa-merge-ready-sign-002", focus: "survival_signage", stage: "pre_integration", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", mergeUse_vi: "Dùng cho hospital hoặc clinic context ở Canada.", mergeUse_en: "Use for hospital or clinic context in Canada.", expected_vi: "ਐਮਰਜੈਂਸੀ đứng trước English emergency trong item.", expected_en: "ਐਮਰਜੈਂਸੀ appears before English emergency in the item.", readinessCheck_vi: "Bắt English loanword thay thế chữ Gurmukhi.", readinessCheck_en: "Catches an English loanword replacing Gurmukhi script.", canadaPractical: true, preIntegration: true },
      { id: "pa-merge-ready-sign-003", focus: "survival_signage", stage: "sanity", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", mergeUse_vi: "Dùng khi learner cần nhận ra nhà thuốc trên biển.", mergeUse_en: "Use when learners need to recognize a pharmacy sign.", expected_vi: "ਫਾਰਮੇਸੀ được đọc trước pharmacy/farmacy.", expected_en: "ਫਾਰਮੇਸੀ is read before pharmacy/farmacy.", readinessCheck_vi: "Bắt item dựa vào English spelling quen thuộc.", readinessCheck_en: "Catches items that rely on familiar English spelling.", learnerTrap: { vi: "Loanword quen dễ làm người học bỏ qua script.", en: "A familiar loanword can make learners skip script." }, canadaPractical: true },
    ],
  },
  {
    focus: "service_vocabulary",
    title_vi: "Service vocabulary merge checks",
    title_en: "Service Vocabulary Merge Checks",
    mergeGoal_vi: "Gộp từ dịch vụ theo ngữ cảnh Canada-practical, không thành danh sách rời.",
    mergeGoal_en: "Merge service vocabulary in Canada-practical context, not as isolated lists.",
    samples: [
      { id: "pa-merge-ready-service-001", focus: "service_vocabulary", stage: "merge_readiness", gurmukhi: "ਦਵਾਈ", romanization: "davai", mergeUse_vi: "Dùng cho pharmacy, clinic hoặc hướng dẫn thuốc.", mergeUse_en: "Use for pharmacy, clinic, or medicine instructions.", expected_vi: "ਦਵਾਈ giữ Gurmukhi primary với giải thích thuốc.", expected_en: "ਦਵਾਈ stays Gurmukhi-primary with medicine explanation.", readinessCheck_vi: "Bắt mục service chỉ còn English medicine.", readinessCheck_en: "Catches service items that only keep English medicine.", canadaPractical: true, preIntegration: true },
      { id: "pa-merge-ready-service-002", focus: "service_vocabulary", stage: "final_regression", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", mergeUse_vi: "Dùng trong housing form, rental notice hoặc payment context.", mergeUse_en: "Use in a housing form, rental notice, or payment context.", expected_vi: "ਕਿਰਾਇਆ có nghĩa tiền thuê và bối cảnh rõ.", expected_en: "ਕਿਰਾਇਆ means rent and has clear context.", readinessCheck_vi: "Bắt item chỉ dịch rent mà không có Gurmukhi.", readinessCheck_en: "Catches items that translate rent without Gurmukhi.", canadaPractical: true, finalRegression: true },
      { id: "pa-merge-ready-service-003", focus: "service_vocabulary", stage: "sanity", gurmukhi: "ਪਛਾਣ ਪੱਤਰ", romanization: "pachhan pattar", mergeUse_vi: "Dùng cho service desk hỏi giấy tờ ID ở Canada.", mergeUse_en: "Use for service desks asking for ID documents in Canada.", expected_vi: "Cụm giấy tờ được giữ như một service chunk.", expected_en: "The document phrase stays as one service chunk.", readinessCheck_vi: "Bắt dịch từng từ làm mất workflow thực tế.", readinessCheck_en: "Catches word-by-word translation that loses the real workflow.", learnerTrap: { vi: "ਪੱਤਰ trong cụm này là document/paper, không học rời.", en: "ਪੱਤਰ in this chunk is document/paper, not learned alone." }, canadaPractical: true },
    ],
  },
  {
    focus: "high_frequency_verbs",
    title_vi: "High-frequency verb merge checks",
    title_en: "High-Frequency Verb Merge Checks",
    mergeGoal_vi: "Động từ lõi phải xuất hiện trong cụm hành động có ích, không chỉ là lemma rời.",
    mergeGoal_en: "Core verbs must appear in useful action chunks, not only as isolated lemmas.",
    samples: [
      { id: "pa-merge-ready-verb-001", focus: "high_frequency_verbs", stage: "merge_readiness", gurmukhi: "ਕਰਨਾ", romanization: "karna", mergeUse_vi: "Dùng để nối verb deck với paperwork hoặc task action.", mergeUse_en: "Use to connect the verb deck with paperwork or task actions.", expected_vi: "ਕਰਨਾ được hiểu qua hành động cụ thể.", expected_en: "ਕਰਨਾ is understood through a concrete action.", readinessCheck_vi: "Bắt verb entry không có context ứng dụng.", readinessCheck_en: "Catches verb entries without application context.", preIntegration: true },
      { id: "pa-merge-ready-verb-002", focus: "high_frequency_verbs", stage: "final_regression", gurmukhi: "ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ", romanization: "appointment laina", mergeUse_vi: "Dùng cho clinic booking hoặc service appointment.", mergeUse_en: "Use for clinic booking or service appointment flows.", expected_vi: "ਲੈਣਾ được hiểu trong cụm đặt/lấy lịch.", expected_en: "ਲੈਣਾ is understood inside the book/take appointment chunk.", readinessCheck_vi: "Bắt dịch ਲੈਣਾ rời khỏi context appointment.", readinessCheck_en: "Catches translating ਲੈਣਾ outside appointment context.", canadaPractical: true, finalRegression: true },
      { id: "pa-merge-ready-verb-003", focus: "high_frequency_verbs", stage: "sanity", gurmukhi: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ", romanization: "mainu samajh nahi aai", mergeUse_vi: "Dùng như câu service khi learner chưa hiểu hướng dẫn.", mergeUse_en: "Use as a service sentence when learners did not understand instructions.", expected_vi: "Câu đầy đủ được giữ để dùng với nhân viên.", expected_en: "The full sentence is preserved for use with staff.", readinessCheck_vi: "Bắt dữ liệu rút gọn chỉ còn verb ਸਮਝਣਾ.", readinessCheck_en: "Catches data reduced to only the verb ਸਮਝਣਾ.", canadaPractical: true, finalRegression: true },
    ],
  },
  {
    focus: "collocations",
    title_vi: "Collocation merge checks",
    title_en: "Collocation Merge Checks",
    mergeGoal_vi: "Collocation cần được merge như đơn vị nghĩa trong workflow thực tế.",
    mergeGoal_en: "Collocations need to merge as meaning units in practical workflows.",
    samples: [
      { id: "pa-merge-ready-collocation-001", focus: "collocations", stage: "merge_readiness", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", mergeUse_vi: "Dùng khi hỏi nhân viên dịch vụ, trường học hoặc clinic.", mergeUse_en: "Use when asking service staff, school staff, or clinic staff.", expected_vi: "Câu đầy đủ giữ ý cần giúp đỡ, không chỉ từ ਮਦਦ.", expected_en: "The full sentence keeps the help-request meaning, not only ਮਦਦ.", readinessCheck_vi: "Bắt collocation bị cắt thành từ rời.", readinessCheck_en: "Catches collocations split into isolated words.", canadaPractical: true, finalRegression: true },
      { id: "pa-merge-ready-collocation-002", focus: "collocations", stage: "pre_integration", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", mergeUse_vi: "Dùng cho giấy tờ trường học, housing hoặc clinic.", mergeUse_en: "Use for school, housing, or clinic paperwork.", expected_vi: "Cụm được đọc như một hành động điền form.", expected_en: "The chunk is read as one fill-out-a-form action.", readinessCheck_vi: "Bắt workflow chỉ còn vocabulary rời.", readinessCheck_en: "Catches workflows reduced to isolated vocabulary.", canadaPractical: true, preIntegration: true },
      { id: "pa-merge-ready-collocation-003", focus: "collocations", stage: "sanity", gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", mergeUse_vi: "Dùng khi sửa lỗi trên form hoặc thông tin cá nhân.", mergeUse_en: "Use when correcting a form or personal information.", expected_vi: "ਠੀਕ giữ chữ ਠ và nghĩa correction trong cụm.", expected_en: "ਠੀਕ keeps ਠ and the correction meaning in the chunk.", readinessCheck_vi: "Bắt romanization theek che distinction của ਠ.", readinessCheck_en: "Catches romanization theek hiding the ਠ distinction.", learnerTrap: { vi: "ਠ không phải th tiếng Anh.", en: "ਠ is not English th." }, canadaPractical: true },
    ],
  },
  {
    focus: "shahmukhi_awareness",
    title_vi: "Shahmukhi awareness merge check",
    title_en: "Shahmukhi Awareness Merge Check",
    mergeGoal_vi: "Giữ Shahmukhi chỉ là awareness phạm vi; không mở thành course hoặc script track.",
    mergeGoal_en: "Keep Shahmukhi as scope awareness only; do not expand into a course or script track.",
    samples: [
      { id: "pa-merge-ready-shahmukhi-001", focus: "shahmukhi_awareness", stage: "merge_readiness", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", mergeUse_vi: "Dùng như note scope: Gurmukhi là primary; Shahmukhi chỉ là awareness.", mergeUse_en: "Use as a scope note: Gurmukhi is primary; Shahmukhi is awareness only.", expected_vi: "Không biến nội dung này thành khóa Shahmukhi đầy đủ.", expected_en: "Do not turn this content into a full Shahmukhi course.", readinessCheck_vi: "Bắt scope drift sang Shahmukhi lessons.", readinessCheck_en: "Catches scope drift into Shahmukhi lessons.", finalRegression: true },
    ],
  },
  {
    focus: "merge_readiness",
    title_vi: "Final merge readiness",
    title_en: "Final Merge Readiness",
    mergeGoal_vi: "Kiểm data cuối có đủ id, focus, script, VI/EN, flags và không mở rộng ngoài scope.",
    mergeGoal_en: "Check final data has ids, focus, script, VI/EN, flags, and no expansion beyond scope.",
    samples: [
      { id: "pa-merge-ready-final-001", focus: "merge_readiness", stage: "pre_integration", gurmukhi: "ਮਿਲਾਣ ਤੋਂ ਪਹਿਲਾਂ ਜਾਂਚ", romanization: "milaan ton pahilan jaanch", mergeUse_vi: "Dùng như checklist trước merge vào bước app riêng sau này.", mergeUse_en: "Use as a checklist before merging into a separate later app step.", expected_vi: "Dữ liệu vẫn là TypeScript consumable và không là notes rời.", expected_en: "Data remains consumable TypeScript and not loose notes.", readinessCheck_vi: "Bắt thiếu field hoặc thiếu Gurmukhi primary.", readinessCheck_en: "Catches missing fields or missing Gurmukhi primary.", preIntegration: true, finalRegression: true },
      { id: "pa-merge-ready-final-002", focus: "merge_readiness", stage: "final_regression", gurmukhi: "ਅੰਤਿਮ ਮਿਲਾਣ ਤਿਆਰੀ", romanization: "antim milaan tiari", mergeUse_vi: "Dùng để xác nhận native review không được claim trong data.", mergeUse_en: "Use to confirm native review is not claimed in the data.", expected_vi: "Native review được hoãn và scope chỉ là Punjabi script/vocabulary.", expected_en: "Native review is deferred and scope is only Punjabi script/vocabulary.", readinessCheck_vi: "Bắt claim reviewed hoặc mở rộng sang feature ngoài phạm vi.", readinessCheck_en: "Catches reviewed claims or expansion into out-of-scope features.", finalRegression: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SAMPLES = sections;

export const PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SAMPLE_ITEMS: ReadonlyArray<PunjabiScriptVocabularyMergeReadinessSample> =
  sections.flatMap((section) => section.samples);

export default PUNJABI_SCRIPT_VOCABULARY_MERGE_READINESS_SAMPLES;
