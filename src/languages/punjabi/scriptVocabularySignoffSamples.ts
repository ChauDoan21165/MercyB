// src/languages/punjabi/scriptVocabularySignoffSamples.ts
//
// Punjabi script/vocabulary signoff samples for later app integration.
// Native review is deferred.

export type PunjabiSignoffFocus =
  | "gurmukhi_primary"
  | "romanization_bridge"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "service_vocabulary"
  | "high_frequency_verbs"
  | "collocations"
  | "shahmukhi_awareness"
  | "signoff_closure";

export type PunjabiSignoffStage = "pre_a11_signoff" | "seal" | "snapshot" | "pre_integration" | "regression";

export type PunjabiScriptVocabularySignoffSample = {
  id: string;
  focus: PunjabiSignoffFocus;
  stage: PunjabiSignoffStage;
  gurmukhi: string;
  romanization?: string;
  signoff_vi: string;
  signoff_en: string;
  expected_vi: string;
  expected_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  signedOff?: boolean;
};

export type PunjabiScriptVocabularySignoffSection = {
  focus: PunjabiSignoffFocus;
  title_vi: string;
  title_en: string;
  signoffGoal_vi: string;
  signoffGoal_en: string;
  samples: ReadonlyArray<PunjabiScriptVocabularySignoffSample>;
};

export const PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_SCOPE = {
  vi: "Bộ signoff sample này xác nhận dữ liệu Punjabi script/vocabulary trước A11 sau này: Gurmukhi là primary, romanization chỉ hỗ trợ có giới hạn, dấu nguyên âm và addak/tippi/bindi được giữ, signage, service vocabulary, verbs, collocations và Shahmukhi awareness không vượt phạm vi. Đây là TypeScript data app-consumable; native review được hoãn.",
  en: "This signoff sample set confirms Punjabi script/vocabulary data before a later A11 step: Gurmukhi is primary, romanization is a limited support bridge, vowel signs and addak/tippi/bindi are preserved, and signage, service vocabulary, verbs, collocations, and Shahmukhi awareness stay in scope. This is app-consumable TypeScript data; native review is deferred.",
  signoffDataOnly: true,
} as const;

const sections: ReadonlyArray<PunjabiScriptVocabularySignoffSection> = [
  {
    focus: "gurmukhi_primary",
    title_vi: "Signoff Gurmukhi primary",
    title_en: "Gurmukhi Primary Signoff",
    signoffGoal_vi: "Xác nhận thứ tự hiển thị luôn đặt Gurmukhi làm anchor trước Latin.",
    signoffGoal_en: "Confirm display order keeps Gurmukhi as the anchor before Latin text.",
    samples: [
      { id: "pa-signoff-gurmukhi-001", focus: "gurmukhi_primary", stage: "pre_a11_signoff", gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", romanization: "sat sri akaal", signoff_vi: "Signoff lời chào phổ biến bằng Gurmukhi trước để tránh thẻ Latin-first.", signoff_en: "Sign off the common greeting in Gurmukhi first to avoid Latin-first cards.", expected_vi: "Người học nhận cụm Gurmukhi là dữ liệu chính.", expected_en: "Learner treats the Gurmukhi phrase as the primary data.", signedOff: true },
      { id: "pa-signoff-gurmukhi-002", focus: "gurmukhi_primary", stage: "seal", gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਪੜ੍ਹੋ", romanization: "kirpa karke parho", signoff_vi: "Seal/signoff kiểm instruction vẫn đọc được khi bỏ romanization.", signoff_en: "Seal/signoff checks the instruction remains readable when romanization is removed.", expected_vi: "Gurmukhi không phụ thuộc vào Latin để có nghĩa.", expected_en: "Gurmukhi does not depend on Latin to carry meaning.", signedOff: true },
    ],
  },
  {
    focus: "romanization_bridge",
    title_vi: "Signoff romanization bridge",
    title_en: "Romanization Bridge Signoff",
    signoffGoal_vi: "Xác nhận romanization dùng để bridge nhận diện, không thay thế script.",
    signoffGoal_en: "Confirm romanization bridges recognition without replacing the script.",
    samples: [
      { id: "pa-signoff-roman-001", focus: "romanization_bridge", stage: "snapshot", gurmukhi: "ਘਰ", romanization: "ghar", signoff_vi: "Snapshot cho phép ghar nhưng dữ liệu chính vẫn là ਘਰ.", signoff_en: "Snapshot allows ghar while the core data remains ਘਰ.", expected_vi: "Search Latin quay về một mục Gurmukhi.", expected_en: "Latin search returns one Gurmukhi item.", learnerTrap: { vi: "gh là một cue Latin, không phải cách tách chữ Gurmukhi.", en: "gh is a Latin cue, not a Gurmukhi split." } },
      { id: "pa-signoff-roman-002", focus: "romanization_bridge", stage: "regression", gurmukhi: "ਪਾਣੀ", romanization: "paani/pani", signoff_vi: "Regression nhận variant aa/a nhưng không đổi chữ Gurmukhi.", signoff_en: "Regression accepts aa/a variants without changing the Gurmukhi word.", expected_vi: "Hai spelling Latin không tạo hai cards.", expected_en: "Two Latin spellings do not create two cards.", learnerTrap: { vi: "Romanization có thể thiếu độ dài nguyên âm.", en: "Romanization can hide vowel length." } },
    ],
  },
  {
    focus: "vowel_signs",
    title_vi: "Signoff dấu nguyên âm",
    title_en: "Vowel Sign Signoff",
    signoffGoal_vi: "Xác nhận dấu nguyên âm được giữ trong các cặp dễ nhầm.",
    signoffGoal_en: "Confirm vowel signs are retained in easily confused pairs.",
    samples: [
      { id: "pa-signoff-vowel-001", focus: "vowel_signs", stage: "pre_integration", gurmukhi: "ਸਿ / ਸੀ", romanization: "si / sii", signoff_vi: "Pre-integration giữ khác biệt giữa ਿ và ੀ trong cặp ngắn.", signoff_en: "Pre-integration keeps the difference between ਿ and ੀ in a short pair.", expected_vi: "Không normalize hai dạng thành một âm Latin.", expected_en: "Does not normalize both forms into one Latin sound.", learnerTrap: { vi: "Dấu ਿ đứng trước về hình nhưng đọc với phụ âm.", en: "The ਿ mark appears before but reads with the consonant." } },
      { id: "pa-signoff-vowel-002", focus: "vowel_signs", stage: "seal", gurmukhi: "ਮੋੜ / ਮੌੜ", romanization: "mor / maur", signoff_vi: "Seal xác nhận ੋ và ੌ không bị rơi trong đóng gói.", signoff_en: "Seal confirms ੋ and ੌ are not dropped during packaging.", expected_vi: "Hai mẫu vẫn tách biệt trong UI sau này.", expected_en: "Both patterns remain separate in a later UI." },
    ],
  },
  {
    focus: "addak_tippi_bindi",
    title_vi: "Signoff addak tippi bindi",
    title_en: "Addak Tippi Bindi Signoff",
    signoffGoal_vi: "Xác nhận dấu nhỏ là dữ liệu ngôn ngữ, không phải trang trí.",
    signoffGoal_en: "Confirm small marks are language data, not decoration.",
    samples: [
      { id: "pa-signoff-smallmark-001", focus: "addak_tippi_bindi", stage: "snapshot", gurmukhi: "ਚਿੱਠੀ", romanization: "chitthi", signoff_vi: "Snapshot giữ tippi và addak trong từ thư/letter.", signoff_en: "Snapshot keeps tippi and addak in the letter/mail word.", expected_vi: "Dấu nhỏ vẫn có mặt khi xuất dữ liệu.", expected_en: "Small marks remain present when data is exported.", learnerTrap: { vi: "Nhìn nhanh dễ bỏ qua hai dấu liên tiếp.", en: "A quick scan can miss the paired marks." } },
      { id: "pa-signoff-smallmark-002", focus: "addak_tippi_bindi", stage: "regression", gurmukhi: "ਸਕੂਲਾਂ ਵਿੱਚ", romanization: "schoolan vich", signoff_vi: "Regression giữ bindi trong cụm ở các trường học.", signoff_en: "Regression keeps bindi in the in-schools phrase.", expected_vi: "ਵਿੱਚ không bị viết thành dạng thiếu dấu.", expected_en: "ਵਿੱਚ is not written as a markless form.", canadaPractical: true },
    ],
  },
  {
    focus: "survival_signage",
    title_vi: "Signoff survival signage",
    title_en: "Survival Signage Signoff",
    signoffGoal_vi: "Xác nhận biển sinh tồn phù hợp tình huống Canada thực tế.",
    signoffGoal_en: "Confirm survival signs fit practical Canada situations.",
    samples: [
      { id: "pa-signoff-sign-001", focus: "survival_signage", stage: "pre_a11_signoff", gurmukhi: "ਧੱਕੋ", romanization: "dhakko", signoff_vi: "Signoff biển push trên cửa dịch vụ công cộng.", signoff_en: "Sign off a push sign on a public service door.", expected_vi: "Người học hiểu hành động đẩy cửa.", expected_en: "Learner understands the door-push action.", canadaPractical: true, signedOff: true },
      { id: "pa-signoff-sign-002", focus: "survival_signage", stage: "seal", gurmukhi: "ਖਿੱਚੋ", romanization: "khichcho", signoff_vi: "Seal biển pull như cặp đối chiếu với ਧੱਕੋ.", signoff_en: "Seal the pull sign as the contrast pair for ਧੱਕੋ.", expected_vi: "Hai biển không bị dịch chung thành open.", expected_en: "The two signs are not both translated as open.", canadaPractical: true },
    ],
  },
  {
    focus: "service_vocabulary",
    title_vi: "Signoff service vocabulary",
    title_en: "Service Vocabulary Signoff",
    signoffGoal_vi: "Xác nhận cụm dịch vụ dùng được cho clinic, transit, housing và giấy tờ.",
    signoffGoal_en: "Confirm service chunks work for clinic, transit, housing, and paperwork.",
    samples: [
      { id: "pa-signoff-service-001", focus: "service_vocabulary", stage: "pre_integration", gurmukhi: "ਸਿਹਤ ਕਾਰਡ", romanization: "sehat card", signoff_vi: "Pre-integration giữ cụm health card cho dịch vụ Canada.", signoff_en: "Pre-integration keeps the health-card chunk for Canada services.", expected_vi: "Không tách ਸਿਹਤ khỏi ngữ cảnh giấy tờ.", expected_en: "Does not detach ਸਿਹਤ from the paperwork context.", canadaPractical: true, signedOff: true },
      { id: "pa-signoff-service-002", focus: "service_vocabulary", stage: "snapshot", gurmukhi: "ਬੱਸ ਪਾਸ", romanization: "bus pass", signoff_vi: "Snapshot cụm transit pass dưới dạng Gurmukhi-primary.", signoff_en: "Snapshot the transit-pass chunk as Gurmukhi-primary.", expected_vi: "Cụm dùng được cho quầy dịch vụ transit.", expected_en: "The chunk is usable at a transit service counter.", learnerTrap: { vi: "Loanword quen thuộc vẫn cần đọc Gurmukhi.", en: "A familiar loanword still needs Gurmukhi reading." }, canadaPractical: true },
    ],
  },
  {
    focus: "high_frequency_verbs",
    title_vi: "Signoff high-frequency verbs",
    title_en: "High-Frequency Verb Signoff",
    signoffGoal_vi: "Xác nhận động từ tần suất cao nằm trong câu ngắn có ngữ cảnh.",
    signoffGoal_en: "Confirm high-frequency verbs appear inside short contextual sentences.",
    samples: [
      { id: "pa-signoff-verb-001", focus: "high_frequency_verbs", stage: "pre_a11_signoff", gurmukhi: "ਮੈਂ ਸਮਝਦਾ ਹਾਂ", romanization: "main samajhda haan", signoff_vi: "Signoff câu tôi hiểu với động từ ਸਮਝਣਾ.", signoff_en: "Sign off the I-understand sentence with the verb ਸਮਝਣਾ.", expected_vi: "Câu đầy đủ vẫn được lưu bằng Gurmukhi.", expected_en: "The full sentence remains stored in Gurmukhi.", signedOff: true },
      { id: "pa-signoff-verb-002", focus: "high_frequency_verbs", stage: "regression", gurmukhi: "ਮੈਨੂੰ ਪੁੱਛਣਾ ਹੈ", romanization: "mainu puchhna hai", signoff_vi: "Regression giữ ask/question verb trong tình huống service.", signoff_en: "Regression keeps the ask/question verb in a service situation.", expected_vi: "ਪੁੱਛਣਾ không bị rút thành noun question.", expected_en: "ਪੁੱਛਣਾ is not reduced to the noun question.", canadaPractical: true },
    ],
  },
  {
    focus: "collocations",
    title_vi: "Signoff collocations",
    title_en: "Collocation Signoff",
    signoffGoal_vi: "Xác nhận collocation được lưu như chunk để tránh dịch từng chữ.",
    signoffGoal_en: "Confirm collocations are stored as chunks to avoid word-by-word translation.",
    samples: [
      { id: "pa-signoff-collocation-001", focus: "collocations", stage: "seal", gurmukhi: "ਫੋਨ ਕਰਨਾ", romanization: "phone karna", signoff_vi: "Seal cụm gọi điện cho đặt lịch hoặc hỏi thông tin.", signoff_en: "Seal the make-a-phone-call chunk for booking or asking information.", expected_vi: "ਕਰਨਾ được hiểu theo cụm hành động.", expected_en: "ਕਰਨਾ is understood through the action chunk.", canadaPractical: true },
      { id: "pa-signoff-collocation-002", focus: "collocations", stage: "snapshot", gurmukhi: "ਲਾਈਨ ਵਿੱਚ ਖੜ੍ਹਨਾ", romanization: "line vich kharhna", signoff_vi: "Snapshot cụm đứng xếp hàng ở văn phòng dịch vụ.", signoff_en: "Snapshot the stand-in-line chunk at a service office.", expected_vi: "Cụm không bị dịch máy thành từng từ rời.", expected_en: "The chunk is not machine-translated into loose words.", learnerTrap: { vi: "ਵਿੱਚ là phần của cụm, không bỏ được.", en: "ਵਿੱਚ is part of the chunk and should not be dropped." }, canadaPractical: true },
    ],
  },
  {
    focus: "shahmukhi_awareness",
    title_vi: "Signoff Shahmukhi awareness",
    title_en: "Shahmukhi Awareness Signoff",
    signoffGoal_vi: "Xác nhận Shahmukhi chỉ là awareness trong phạm vi này.",
    signoffGoal_en: "Confirm Shahmukhi is awareness only in this scope.",
    samples: [
      { id: "pa-signoff-shahmukhi-001", focus: "shahmukhi_awareness", stage: "pre_integration", gurmukhi: "ਲਿਪੀ awareness", romanization: "lipi awareness", signoff_vi: "Pre-integration note: Gurmukhi primary; Shahmukhi chỉ là awareness.", signoff_en: "Pre-integration note: Gurmukhi is primary; Shahmukhi is awareness only.", expected_vi: "Không tạo bài học Shahmukhi đầy đủ.", expected_en: "Does not create a full Shahmukhi lesson." },
    ],
  },
  {
    focus: "signoff_closure",
    title_vi: "Signoff closure",
    title_en: "Signoff Closure",
    signoffGoal_vi: "Xác nhận signoff là data-only trước A11, không claim native review.",
    signoffGoal_en: "Confirm signoff is data-only before A11, with no native review claim.",
    samples: [
      { id: "pa-signoff-closure-001", focus: "signoff_closure", stage: "pre_a11_signoff", gurmukhi: "ਦਸਤਖ਼ਤ ਜਾਂਚ", romanization: "dastkhat jaanch", signoff_vi: "Pre-A11 signoff kiểm id, focus, Gurmukhi và mô tả VI/EN.", signoff_en: "Pre-A11 signoff checks ids, focus, Gurmukhi, and VI/EN descriptions.", expected_vi: "Dữ liệu sẵn cho bước sau nhưng chưa tích hợp.", expected_en: "Data is ready for a later step but not integrated.", signedOff: true },
      { id: "pa-signoff-closure-002", focus: "signoff_closure", stage: "regression", gurmukhi: "ਅੰਤਿਮ ਮਨਜ਼ੂਰੀ", romanization: "antim manzuri", signoff_vi: "Regression bắt scope drift, Latin-first, và claim review sai.", signoff_en: "Regression catches scope drift, Latin-first ordering, and false review claims.", expected_vi: "Native review được hoãn rõ ràng.", expected_en: "Native review is explicitly deferred.", signedOff: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_SAMPLES = sections;

export const PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_ITEMS: ReadonlyArray<PunjabiScriptVocabularySignoffSample> =
  sections.flatMap((section) => section.samples);

export default PUNJABI_SCRIPT_VOCABULARY_SIGNOFF_SAMPLES;
