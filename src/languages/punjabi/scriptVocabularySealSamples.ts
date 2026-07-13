// src/languages/punjabi/scriptVocabularySealSamples.ts
//
// Punjabi script/vocabulary seal samples for later app integration.
// Native review is deferred.

export type PunjabiSealFocus =
  | "gurmukhi_primary"
  | "romanization_bridge"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "service_vocabulary"
  | "high_frequency_verbs"
  | "collocations"
  | "shahmukhi_awareness"
  | "seal_closure";

export type PunjabiSealStage = "pre_a11_seal" | "snapshot" | "closure_packet" | "pre_integration" | "regression";

export type PunjabiScriptVocabularySealSample = {
  cell_id?: string;
  id: string;
  focus: PunjabiSealFocus;
  stage: PunjabiSealStage;
  gurmukhi: string;
  romanization?: string;
  seal_vi: string;
  seal_en: string;
  expected_vi: string;
  expected_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  shipCandidate?: boolean;
};

export type PunjabiScriptVocabularySealSection = {
  cell_id?: string;
  focus: PunjabiSealFocus;
  title_vi: string;
  title_en: string;
  sealGoal_vi: string;
  sealGoal_en: string;
  samples: ReadonlyArray<PunjabiScriptVocabularySealSample>;
};

export const PUNJABI_SCRIPT_VOCABULARY_SEAL_SCOPE = {
  vi: "Bộ seal sample này khóa trạng thái Punjabi script/vocabulary trước bước A11 sau này: Gurmukhi là primary, romanization chỉ là bridge, dấu nguyên âm và addak/tippi/bindi được giữ, signage, service words, verbs, collocations và Shahmukhi awareness nằm đúng phạm vi. Đây là TypeScript data app-consumable; native review được hoãn.",
  en: "This seal sample set freezes Punjabi script/vocabulary status before a later A11 step: Gurmukhi is primary, romanization is only a bridge, vowel signs and addak/tippi/bindi are preserved, and signage, service words, verbs, collocations, and Shahmukhi awareness stay scoped. This is app-consumable TypeScript data; native review is deferred.",
  sealDataOnly: true,
} as const;

const sections: ReadonlyArray<PunjabiScriptVocabularySealSection> = [
  {
    focus: "gurmukhi_primary",
    title_vi: "Seal Gurmukhi primary",
    title_en: "Gurmukhi Primary Seal",
    sealGoal_vi: "Chốt rằng mẫu luôn đọc Gurmukhi trước khi dùng Latin hỗ trợ.",
    sealGoal_en: "Seal that samples read Gurmukhi before any supporting Latin text.",
    samples: [
      { id: "pa-seal-gurmukhi-001", focus: "gurmukhi_primary", stage: "pre_a11_seal", gurmukhi: "ਪੰਜਾਬੀ", romanization: "panjabi/punjabi", seal_vi: "Seal tên ngôn ngữ bằng Gurmukhi trước mọi variant Latin.", seal_en: "Seal the language name in Gurmukhi before any Latin variant.", expected_vi: "Người học nhận ਪੰਜਾਬੀ là anchor chính.", expected_en: "Learner treats ਪੰਜਾਬੀ as the main anchor.", learnerTrap: { vi: "Latin familiar có thể làm bỏ qua tippi.", en: "Familiar Latin can hide the tippi." }, shipCandidate: true },
      { id: "pa-seal-gurmukhi-002", focus: "gurmukhi_primary", stage: "snapshot", gurmukhi: "ਗੁਰਮੁਖੀ ਪੜ੍ਹੋ", romanization: "gurmukhi parho", seal_vi: "Snapshot yêu cầu đọc bằng Gurmukhi trước.", seal_en: "Snapshot requires reading through Gurmukhi first.", expected_vi: "Không đảo thứ tự thành romanization-first.", expected_en: "Does not flip the order to romanization-first.", shipCandidate: true },
    ],
  },
  {
    focus: "romanization_bridge",
    title_vi: "Seal romanization bridge",
    title_en: "Romanization Bridge Seal",
    sealGoal_vi: "Giữ romanization là cầu tạm thời cho nhận diện và search, không phải dữ liệu chính.",
    sealGoal_en: "Keep romanization as a temporary bridge for recognition and search, not the primary data.",
    samples: [
      { id: "pa-seal-roman-001", focus: "romanization_bridge", stage: "closure_packet", gurmukhi: "ਫਲ", romanization: "phal/fal", seal_vi: "Closure packet chấp nhận ph/f nhưng neo vào ਫਲ.", seal_en: "Closure packet accepts ph/f while anchoring to ਫਲ.", expected_vi: "Lượt cuối có thể bỏ romanization mà vẫn đọc được.", expected_en: "The final pass can remove romanization and remain readable.", learnerTrap: { vi: "ph không phải hai chữ Gurmukhi.", en: "ph is not two Gurmukhi letters." } },
      { id: "pa-seal-roman-002", focus: "romanization_bridge", stage: "regression", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", seal_vi: "Regression giữ v/w là variant search cùng một từ.", seal_en: "Regression keeps v/w as search variants for the same word.", expected_vi: "Cả hai Latin variant quay lại ਵੱਡਾ.", expected_en: "Both Latin variants return to ਵੱਡਾ.", learnerTrap: { vi: "Hai spelling Latin không tạo hai nghĩa.", en: "Two Latin spellings do not create two meanings." } },
    ],
  },
  {
    focus: "vowel_signs",
    title_vi: "Seal dấu nguyên âm",
    title_en: "Vowel Sign Seal",
    sealGoal_vi: "Chốt các dấu nguyên âm thường gây nhầm để nội dung không rơi dấu khi đóng gói.",
    sealGoal_en: "Seal common confusing vowel signs so packaged content does not drop marks.",
    samples: [
      { id: "pa-seal-vowel-001", focus: "vowel_signs", stage: "pre_integration", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", seal_vi: "Pre-integration kiểm ਿ viết trước nhưng đọc sau phụ âm.", seal_en: "Pre-integration checks that ਿ is written before but read after the consonant.", expected_vi: "ਕਿ và ਕੀ không bị xem là cùng một mẫu.", expected_en: "ਕਿ and ਕੀ are not treated as the same pattern.", learnerTrap: { vi: "Vị trí nhìn thấy của ਿ dễ gây đọc ngược.", en: "The visible position of ਿ can cause reversed reading." } },
      { id: "pa-seal-vowel-002", focus: "vowel_signs", stage: "snapshot", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", seal_vi: "Snapshot giữ ba dấu e, ai/ae và au tách biệt.", seal_en: "Snapshot keeps e, ai/ae, and au signs separate.", expected_vi: "Không gộp ba dạng thành một romanization mơ hồ.", expected_en: "Does not merge the three forms into vague romanization." },
    ],
  },
  {
    focus: "addak_tippi_bindi",
    title_vi: "Seal addak tippi bindi",
    title_en: "Addak Tippi Bindi Seal",
    sealGoal_vi: "Chốt các dấu nhỏ để app sau không coi chúng là trang trí.",
    sealGoal_en: "Seal small marks so later app surfaces do not treat them as decoration.",
    samples: [
      { id: "pa-seal-smallmark-001", focus: "addak_tippi_bindi", stage: "closure_packet", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", seal_vi: "Closure packet giữ addak trong cụm trạm xe buýt.", seal_en: "Closure packet preserves addak in the bus-stop chunk.", expected_vi: "Cả ਬੱਸ và ਅੱਡਾ giữ dấu ੱ trong Gurmukhi.", expected_en: "Both ਬੱਸ and ਅੱਡਾ keep ੱ in Gurmukhi.", learnerTrap: { vi: "Dấu nhỏ vẫn đổi cách nhận diện từ.", en: "A small mark still changes word recognition." }, canadaPractical: true },
      { id: "pa-seal-smallmark-002", focus: "addak_tippi_bindi", stage: "regression", gurmukhi: "ਮਾਂ / ਪੰਜਾਬ", romanization: "maan / panjab", seal_vi: "Regression kiểm bindi trong ਮਾਂ và tippi trong ਪੰਜਾਬ.", seal_en: "Regression checks bindi in ਮਾਂ and tippi in ਪੰਜਾਬ.", expected_vi: "Hai dấu không bị thay bằng cùng một ký hiệu Latin.", expected_en: "The two marks are not replaced by one Latin cue.", learnerTrap: { vi: "Romanization không cho thấy vị trí dấu đủ rõ.", en: "Romanization does not show mark placement clearly." } },
    ],
  },
  {
    focus: "survival_signage",
    title_vi: "Seal survival signage",
    title_en: "Survival Signage Seal",
    sealGoal_vi: "Chốt biển sinh tồn dùng được trong tình huống Canada thực tế.",
    sealGoal_en: "Seal survival signs that work in practical Canada contexts.",
    samples: [
      { id: "pa-seal-sign-001", focus: "survival_signage", stage: "pre_a11_seal", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", seal_vi: "Seal biển lối ra để hành động đi theo lối thoát rõ.", seal_en: "Seal the exit sign so the action of following an exit is clear.", expected_vi: "Người học hiểu đây là biển lối ra.", expected_en: "Learner understands this as an exit sign.", canadaPractical: true, shipCandidate: true },
      { id: "pa-seal-sign-002", focus: "survival_signage", stage: "snapshot", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", seal_vi: "Snapshot emergency nhưng Gurmukhi vẫn đứng trước English.", seal_en: "Snapshot emergency while Gurmukhi still appears before English.", expected_vi: "Không biến thành thẻ English-only.", expected_en: "Does not become an English-only card.", canadaPractical: true },
    ],
  },
  {
    focus: "service_vocabulary",
    title_vi: "Seal service vocabulary",
    title_en: "Service Vocabulary Seal",
    sealGoal_vi: "Chốt từ và cụm dịch vụ cần cho clinic, trường học, housing và giấy tờ.",
    sealGoal_en: "Seal service words and chunks needed for clinic, school, housing, and paperwork.",
    samples: [
      { id: "pa-seal-service-001", focus: "service_vocabulary", stage: "pre_integration", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", seal_vi: "Pre-integration giữ cụm điền form như một hành động.", seal_en: "Pre-integration keeps filling out a form as one action chunk.", expected_vi: "ਭਰਨਾ được hiểu trong workflow giấy tờ.", expected_en: "ਭਰਨਾ is understood inside a paperwork workflow.", canadaPractical: true, shipCandidate: true },
      { id: "pa-seal-service-002", focus: "service_vocabulary", stage: "closure_packet", gurmukhi: "ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ", romanization: "appointment laina", seal_vi: "Closure packet chốt cụm đặt lịch cho dịch vụ.", seal_en: "Closure packet seals the appointment-booking service chunk.", expected_vi: "ਲੈਣਾ không bị tách khỏi nghĩa đặt/lấy lịch.", expected_en: "ਲੈਣਾ is not separated from the booking meaning.", canadaPractical: true },
    ],
  },
  {
    focus: "high_frequency_verbs",
    title_vi: "Seal high-frequency verbs",
    title_en: "High-Frequency Verb Seal",
    sealGoal_vi: "Chốt động từ tần suất cao trong cụm ngắn để người học dùng được ngay.",
    sealGoal_en: "Seal high-frequency verbs inside short chunks learners can use immediately.",
    samples: [
      { id: "pa-seal-verb-001", focus: "high_frequency_verbs", stage: "pre_a11_seal", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", seal_vi: "Seal câu cần giúp đỡ với ਚਾਹੀਦੀ ਹੈ trong ngữ cảnh service.", seal_en: "Seal the help-needed sentence with ਚਾਹੀਦੀ ਹੈ in service context.", expected_vi: "Câu không bị rút còn một danh từ ਮਦਦ.", expected_en: "The sentence is not reduced to the noun ਮਦਦ.", canadaPractical: true, shipCandidate: true },
      { id: "pa-seal-verb-002", focus: "high_frequency_verbs", stage: "regression", gurmukhi: "ਮੈਂ ਜਾਂਦਾ ਹਾਂ", romanization: "main jaanda haan", seal_vi: "Regression kiểm động từ ਜਾਣਾ ở câu ngắn.", seal_en: "Regression checks the verb ਜਾਣਾ in a short sentence.", expected_vi: "Gurmukhi câu đầy đủ được giữ trước romanization.", expected_en: "The full Gurmukhi sentence is kept before romanization." },
    ],
  },
  {
    focus: "collocations",
    title_vi: "Seal collocations",
    title_en: "Collocation Seal",
    sealGoal_vi: "Chốt collocation để không dịch từng chữ làm sai cụm.",
    sealGoal_en: "Seal collocations so word-by-word translation does not distort the chunk.",
    samples: [
      { id: "pa-seal-collocation-001", focus: "collocations", stage: "snapshot", gurmukhi: "ਦਵਾਈ ਲੈਣਾ", romanization: "davai laina", seal_vi: "Snapshot cụm lấy/uống thuốc cho clinic hoặc pharmacy.", seal_en: "Snapshot the take-medicine chunk for clinic or pharmacy contexts.", expected_vi: "ਲੈਣਾ được hiểu theo cụm, không chỉ là lấy vật.", expected_en: "ਲੈਣਾ is understood through the chunk, not only as taking an object.", learnerTrap: { vi: "Dịch từng chữ có thể làm cụm mất tự nhiên.", en: "Word-by-word translation can make the chunk unnatural." }, canadaPractical: true },
      { id: "pa-seal-collocation-002", focus: "collocations", stage: "closure_packet", gurmukhi: "ਕਿਰਾਇਆ ਦੇਣਾ", romanization: "kiraya dena", seal_vi: "Closure packet giữ cụm trả tiền thuê cho housing.", seal_en: "Closure packet keeps the pay-rent chunk for housing.", expected_vi: "ਦੇਣਾ được giữ trong collocation trả tiền thuê.", expected_en: "ਦੇਣਾ stays inside the pay-rent collocation.", canadaPractical: true },
    ],
  },
  {
    focus: "shahmukhi_awareness",
    title_vi: "Seal Shahmukhi awareness",
    title_en: "Shahmukhi Awareness Seal",
    sealGoal_vi: "Chốt Shahmukhi là awareness phạm vi, không mở thành khóa riêng.",
    sealGoal_en: "Seal Shahmukhi as scope awareness, not a separate course.",
    samples: [
      { id: "pa-seal-shahmukhi-001", focus: "shahmukhi_awareness", stage: "pre_integration", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", seal_vi: "Pre-integration note: Gurmukhi là primary; Shahmukhi chỉ là awareness.", seal_en: "Pre-integration note: Gurmukhi is primary; Shahmukhi is awareness only.", expected_vi: "Không biến thành khóa Shahmukhi đầy đủ.", expected_en: "Does not become a full Shahmukhi course." },
    ],
  },
  {
    focus: "seal_closure",
    title_vi: "Seal closure packet",
    title_en: "Seal Closure Packet",
    sealGoal_vi: "Chốt gói đóng seal là dữ liệu TypeScript, chưa tích hợp A11 và chưa review native.",
    sealGoal_en: "Seal the closure packet as TypeScript data, with no A11 integration and no native review claim.",
    samples: [
      { id: "pa-seal-closure-001", focus: "seal_closure", stage: "closure_packet", gurmukhi: "ਮੁਹਰ ਲਗਾਉਣਾ", romanization: "muhar lagauna", seal_vi: "Closure packet kiểm id, focus, Gurmukhi, VI/EN và cờ ship-candidate.", seal_en: "Closure packet checks id, focus, Gurmukhi, VI/EN, and ship-candidate flags.", expected_vi: "Dữ liệu dùng được cho app sau nhưng không chạy integration.", expected_en: "Data is usable by a later app step but does not run integration.", shipCandidate: true },
      { id: "pa-seal-closure-002", focus: "seal_closure", stage: "regression", gurmukhi: "ਅੰਤਿਮ ਜਾਂਚ", romanization: "antim jaanch", seal_vi: "Regression bắt Latin-first, thiếu dấu nhỏ, hoặc scope drift.", seal_en: "Regression catches Latin-first ordering, missing small marks, or scope drift.", expected_vi: "Native review được hoãn và không có claim đã review.", expected_en: "Native review is deferred with no reviewed claim.", shipCandidate: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_SEAL_SAMPLES = sections;

export const PUNJABI_SCRIPT_VOCABULARY_SEAL_ITEMS: ReadonlyArray<PunjabiScriptVocabularySealSample> =
  sections.flatMap((section) => section.samples);

export default PUNJABI_SCRIPT_VOCABULARY_SEAL_SAMPLES;
