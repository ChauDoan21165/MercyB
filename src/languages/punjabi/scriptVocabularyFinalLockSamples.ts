// src/languages/punjabi/scriptVocabularyFinalLockSamples.ts
//
// Punjabi script/vocabulary final-lock samples for internal consistency.
// Native review is deferred.

export type PunjabiFinalLockFocus =
  | "gurmukhi_forms"
  | "romanization_bridge"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "service_vocabulary"
  | "high_frequency_verbs"
  | "collocations"
  | "shahmukhi_awareness"
  | "pre_integration_verification";

export type PunjabiFinalLockStage = "final_lock" | "owner_acceptance" | "final_acceptance" | "pre_integration" | "sanity";

export type PunjabiScriptVocabularyFinalLockSample = {
  cell_id?: string;
  id: string;
  focus: PunjabiFinalLockFocus;
  stage: PunjabiFinalLockStage;
  gurmukhi: string;
  romanization?: string;
  finalLock_vi: string;
  finalLock_en: string;
  expected_vi: string;
  expected_en: string;
  lockGuard_vi: string;
  lockGuard_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  freezeCandidate?: boolean;
  preIntegration?: boolean;
};

export type PunjabiScriptVocabularyFinalLockSection = {
  cell_id?: string;
  focus: PunjabiFinalLockFocus;
  title_vi: string;
  title_en: string;
  lockGoal_vi: string;
  lockGoal_en: string;
  samples: ReadonlyArray<PunjabiScriptVocabularyFinalLockSample>;
};

export const PUNJABI_SCRIPT_VOCABULARY_FINAL_LOCK_SCOPE = {
  vi: "Bộ final-lock này khóa dữ liệu Punjabi script/vocabulary trước bước tích hợp sau: Gurmukhi là primary, romanization chỉ là bridge, vowel signs và addak/tippi/bindi được giữ, signage, service vocabulary, verbs, collocations và Shahmukhi awareness không vượt scope. Đây là TypeScript data app-consumable; native review được hoãn.",
  en: "This final-lock set freezes Punjabi script/vocabulary data before a later integration step: Gurmukhi is primary, romanization is only a bridge, vowel signs and addak/tippi/bindi are preserved, and signage, service vocabulary, verbs, collocations, and Shahmukhi awareness stay in scope. This is app-consumable TypeScript data; native review is deferred.",
  finalLockDataOnly: true,
} as const;

const sections: ReadonlyArray<PunjabiScriptVocabularyFinalLockSection> = [
  {
    focus: "gurmukhi_forms",
    title_vi: "Final-lock Gurmukhi forms",
    title_en: "Final-Lock Gurmukhi Forms",
    lockGoal_vi: "Khóa các form Gurmukhi làm anchor chính để Latin không thay thế ở bước sau.",
    lockGoal_en: "Lock Gurmukhi forms as the main anchors so Latin text cannot replace them later.",
    samples: [
      { id: "pa-final-lock-gurmukhi-001", focus: "gurmukhi_forms", stage: "final_lock", gurmukhi: "ਪੰਜਾਬੀ", romanization: "panjabi/punjabi", finalLock_vi: "Khóa tên ngôn ngữ bằng Gurmukhi trước mọi variant Latin.", finalLock_en: "Lock the language name in Gurmukhi before any Latin variant.", expected_vi: "ਪੰਜਾਬੀ là form hiển thị chính trong acceptance sample.", expected_en: "ਪੰਜਾਬੀ is the primary display form in the acceptance sample.", lockGuard_vi: "Bắt nội dung chỉ còn Punjabi/Panjabi.", lockGuard_en: "Catches content reduced to Punjabi/Panjabi only.", learnerTrap: { vi: "Latin không cho thấy tippi trong ਪੰਜਾਬੀ.", en: "Latin does not show tippi in ਪੰਜਾਬੀ." }, freezeCandidate: true },
      { id: "pa-final-lock-gurmukhi-002", focus: "gurmukhi_forms", stage: "owner_acceptance", gurmukhi: "ਪੜ੍ਹੋ", romanization: "parho", finalLock_vi: "Khóa prompt đọc để bắt đầu từ chữ Gurmukhi.", finalLock_en: "Lock the reading prompt so it begins from Gurmukhi script.", expected_vi: "Learner đọc ਪੜ੍ਹੋ trước khi nhìn romanization.", expected_en: "The learner reads ਪੜ੍ਹੋ before looking at romanization.", lockGuard_vi: "Bắt prompt Latin-first trong final handoff.", lockGuard_en: "Catches Latin-first prompts in final handoff.", preIntegration: true },
    ],
  },
  {
    focus: "romanization_bridge",
    title_vi: "Final-lock romanization bridge",
    title_en: "Final-Lock Romanization Bridge",
    lockGoal_vi: "Khóa romanization như bridge phụ, không phải nguồn dữ liệu chính.",
    lockGoal_en: "Lock romanization as a supporting bridge, not the main data source.",
    samples: [
      { id: "pa-final-lock-roman-001", focus: "romanization_bridge", stage: "final_lock", gurmukhi: "ਫਲ", romanization: "phal/fal", finalLock_vi: "Khóa ph/f như variant trỏ về cùng chữ ਫਲ.", finalLock_en: "Lock ph/f as variants pointing to the same ਫਲ form.", expected_vi: "Không tạo hai entry chỉ vì spelling Latin khác.", expected_en: "Does not create two entries only because Latin spelling differs.", lockGuard_vi: "Bắt duplicate romanization-only.", lockGuard_en: "Catches romanization-only duplicates.", learnerTrap: { vi: "ਫ mới là anchor, ph/f là cầu phụ.", en: "ਫ is the anchor; ph/f are helper bridges." }, freezeCandidate: true },
      { id: "pa-final-lock-roman-002", focus: "romanization_bridge", stage: "sanity", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", finalLock_vi: "Khóa v/w như bridge cho một form Gurmukhi.", finalLock_en: "Lock v/w as bridges for one Gurmukhi form.", expected_vi: "ਵੱਡਾ giữ addak và không bị tách thành hai từ Latin.", expected_en: "ਵੱਡਾ keeps addak and is not split into two Latin words.", lockGuard_vi: "Bắt romanization làm rơi addak.", lockGuard_en: "Catches romanization causing addak loss.", learnerTrap: { vi: "v/w không quyết định nghĩa riêng.", en: "v/w does not decide a separate meaning." } },
      { id: "pa-final-lock-roman-003", focus: "romanization_bridge", stage: "pre_integration", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", finalLock_vi: "Khóa ਸ਼ có dấu dưới để không trộn với ਸ.", finalLock_en: "Lock marked ਸ਼ so it is not merged with ਸ.", expected_vi: "Form Gurmukhi có dấu dưới vẫn được giữ trong dữ liệu.", expected_en: "The Gurmukhi form with the lower mark remains in the data.", lockGuard_vi: "Bắt normalization sai của ਸ਼.", lockGuard_en: "Catches incorrect normalization of ਸ਼.", learnerTrap: { vi: "ਸ਼ và ਸ không giống nhau.", en: "ਸ਼ and ਸ are not the same." }, preIntegration: true },
    ],
  },
  {
    focus: "vowel_signs",
    title_vi: "Final-lock vowel signs",
    title_en: "Final-Lock Vowel Signs",
    lockGoal_vi: "Khóa dấu nguyên âm để list view và card nhỏ không làm mất đối lập.",
    lockGoal_en: "Lock vowel signs so list views and compact cards do not lose contrasts.",
    samples: [
      { id: "pa-final-lock-vowel-001", focus: "vowel_signs", stage: "final_acceptance", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", finalLock_vi: "Khóa i ngắn/dài và rule ਿ viết trước đọc sau.", finalLock_en: "Lock short/long i and the rule that ਿ is written before but read after.", expected_vi: "ਕਿ và ਕੀ khác bằng dấu, không chỉ bằng Latin.", expected_en: "ਕਿ and ਕੀ differ by signs, not only Latin spelling.", lockGuard_vi: "Bắt đọc visual-order của ਕਿ.", lockGuard_en: "Catches visual-order reading of ਕਿ.", learnerTrap: { vi: "ਕਿ không đọc là ik.", en: "ਕਿ is not read as ik." }, freezeCandidate: true },
      { id: "pa-final-lock-vowel-002", focus: "vowel_signs", stage: "pre_integration", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", finalLock_vi: "Khóa dấu dưới trong UI compact.", finalLock_en: "Lock under-letter signs in compact UI.", expected_vi: "ੁ và ੂ vẫn phân biệt khi render nhỏ.", expected_en: "ੁ and ੂ remain distinct when rendered small.", lockGuard_vi: "Bắt fallback chỉ còn ku/kuu.", lockGuard_en: "Catches fallback reduced to ku/kuu.", learnerTrap: { vi: "Dấu dưới rất dễ bị bỏ qua.", en: "Under-letter signs are easy to miss." }, preIntegration: true },
      { id: "pa-final-lock-vowel-003", focus: "vowel_signs", stage: "sanity", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", finalLock_vi: "Khóa ba dấu e, ai và au trong sample signage.", finalLock_en: "Lock e, ai, and au signs in signage samples.", expected_vi: "Không đổi ਕੈ thành ਕੇ hoặc ਕੌ.", expected_en: "Does not swap ਕੈ into ਕੇ or ਕੌ.", lockGuard_vi: "Bắt swap vowel sign trước freeze.", lockGuard_en: "Catches vowel-sign swaps before freeze.", freezeCandidate: true },
    ],
  },
  {
    focus: "addak_tippi_bindi",
    title_vi: "Final-lock small marks",
    title_en: "Final-Lock Small Marks",
    lockGoal_vi: "Khóa addak, tippi và bindi trong vocabulary có rủi ro mất dấu.",
    lockGoal_en: "Lock addak, tippi, and bindi in vocabulary where small marks are easy to lose.",
    samples: [
      { id: "pa-final-lock-mark-001", focus: "addak_tippi_bindi", stage: "final_lock", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", finalLock_vi: "Khóa cụm bus stop Canada với addak ở cả hai từ.", finalLock_en: "Lock the Canadian bus-stop chunk with addak in both words.", expected_vi: "ਬੱਸ và ਅੱਡਾ đều giữ ੱ trong cụm transit.", expected_en: "ਬੱਸ and ਅੱਡਾ both keep ੱ in the transit chunk.", lockGuard_vi: "Bắt normalization làm rơi addak.", lockGuard_en: "Catches normalization that drops addak.", learnerTrap: { vi: "Addak không phải dấu trang trí.", en: "Addak is not decorative." }, canadaPractical: true, freezeCandidate: true },
      { id: "pa-final-lock-mark-002", focus: "addak_tippi_bindi", stage: "owner_acceptance", gurmukhi: "ਮਾਂ / ਪੰਜਾਬ", romanization: "maan / panjab", finalLock_vi: "Khóa bindi và tippi với giải thích vị trí dấu.", finalLock_en: "Lock bindi and tippi with mark-placement explanations.", expected_vi: "Nêu rõ ਂ trong ਮਾਂ và ੰ trong ਪੰਜਾਬ.", expected_en: "Names ਂ in ਮਾਂ and ੰ in ਪੰਜਾਬ.", lockGuard_vi: "Bắt note nasal mark quá chung chung.", lockGuard_en: "Catches overly generic nasal-mark notes.", learnerTrap: { vi: "Romanization không cho thấy vị trí dấu.", en: "Romanization does not show mark placement." }, preIntegration: true },
    ],
  },
  {
    focus: "survival_signage",
    title_vi: "Final-lock survival signage",
    title_en: "Final-Lock Survival Signage",
    lockGoal_vi: "Khóa biển sinh tồn bằng chữ Gurmukhi và hành động Canada-practical.",
    lockGoal_en: "Lock survival signs with Gurmukhi text and Canada-practical actions.",
    samples: [
      { id: "pa-final-lock-sign-001", focus: "survival_signage", stage: "final_acceptance", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", finalLock_vi: "Khóa exit sign với hành động tìm lối ra.", finalLock_en: "Lock the exit sign with the action of finding an exit.", expected_vi: "Learner theo ਨਿਕਾਸ trong mall, clinic hoặc building.", expected_en: "Learner follows ਨਿਕਾਸ in a mall, clinic, or building.", lockGuard_vi: "Bắt sample chỉ dịch exit mà thiếu action.", lockGuard_en: "Catches samples that translate exit without action.", canadaPractical: true, freezeCandidate: true },
      { id: "pa-final-lock-sign-002", focus: "survival_signage", stage: "pre_integration", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", finalLock_vi: "Khóa emergency với context hospital hoặc clinic.", finalLock_en: "Lock emergency with hospital or clinic context.", expected_vi: "Gurmukhi đứng trước English loanword.", expected_en: "Gurmukhi appears before the English loanword.", lockGuard_vi: "Bắt English thay thế Gurmukhi.", lockGuard_en: "Catches English replacing Gurmukhi.", canadaPractical: true, preIntegration: true },
      { id: "pa-final-lock-sign-003", focus: "survival_signage", stage: "sanity", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", finalLock_vi: "Khóa pharmacy loanword để learner vẫn đọc script.", finalLock_en: "Lock the pharmacy loanword so the learner still reads script.", expected_vi: "ਫਾਰਮੇਸੀ đọc trước pharmacy/farmacy.", expected_en: "ਫਾਰਮੇਸੀ is read before pharmacy/farmacy.", lockGuard_vi: "Bắt loanword làm người học bỏ qua script.", lockGuard_en: "Catches loanwords causing script skipping.", learnerTrap: { vi: "Loanword quen không thay thế Gurmukhi.", en: "A familiar loanword does not replace Gurmukhi." }, canadaPractical: true },
    ],
  },
  {
    focus: "service_vocabulary",
    title_vi: "Final-lock service vocabulary",
    title_en: "Final-Lock Service Vocabulary",
    lockGoal_vi: "Khóa từ dịch vụ với workflow thực tế để không chỉ còn glossary rời.",
    lockGoal_en: "Lock service words with practical workflows so they are not isolated glossary items.",
    samples: [
      { id: "pa-final-lock-service-001", focus: "service_vocabulary", stage: "final_lock", gurmukhi: "ਦਵਾਈ", romanization: "davai", finalLock_vi: "Khóa medicine với pharmacy hoặc clinic context.", finalLock_en: "Lock medicine with pharmacy or clinic context.", expected_vi: "ਦਵਾਈ có script, romanization phụ và nghĩa thuốc.", expected_en: "ਦਵਾਈ has script, helper romanization, and medicine meaning.", lockGuard_vi: "Bắt item chỉ còn English medicine.", lockGuard_en: "Catches items that keep only English medicine.", canadaPractical: true, preIntegration: true },
      { id: "pa-final-lock-service-002", focus: "service_vocabulary", stage: "final_acceptance", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", finalLock_vi: "Khóa rent với housing notice hoặc form.", finalLock_en: "Lock rent with a housing notice or form.", expected_vi: "ਕਿਰਾਇਆ giữ nghĩa tiền thuê trong context.", expected_en: "ਕਿਰਾਇਆ keeps the rent meaning in context.", lockGuard_vi: "Bắt bản dịch rent thiếu Gurmukhi.", lockGuard_en: "Catches rent translations missing Gurmukhi.", canadaPractical: true, freezeCandidate: true },
      { id: "pa-final-lock-service-003", focus: "service_vocabulary", stage: "sanity", gurmukhi: "ਪਛਾਣ ਪੱਤਰ", romanization: "pachhan pattar", finalLock_vi: "Khóa ID document như service chunk.", finalLock_en: "Lock ID document as a service chunk.", expected_vi: "Cụm giữ nguyên khi dùng ở service desk.", expected_en: "The phrase stays intact at a service desk.", lockGuard_vi: "Bắt dịch từng từ làm mất workflow.", lockGuard_en: "Catches word-by-word translation that loses workflow.", learnerTrap: { vi: "ਪੱਤਰ ở đây là document/paper.", en: "ਪੱਤਰ here means document/paper." }, canadaPractical: true },
    ],
  },
  {
    focus: "high_frequency_verbs",
    title_vi: "Final-lock high-frequency verbs",
    title_en: "Final-Lock High-Frequency Verbs",
    lockGoal_vi: "Khóa động từ lõi trong action chunks để learner không học rời.",
    lockGoal_en: "Lock core verbs in action chunks so learners do not study them in isolation.",
    samples: [
      { id: "pa-final-lock-verb-001", focus: "high_frequency_verbs", stage: "owner_acceptance", gurmukhi: "ਕਰਨਾ", romanization: "karna", finalLock_vi: "Khóa ਕਰਨਾ cùng action như form hoặc correction.", finalLock_en: "Lock ਕਰਨਾ with actions such as forms or corrections.", expected_vi: "Verb được hiểu qua hành động cụ thể.", expected_en: "The verb is understood through a concrete action.", lockGuard_vi: "Bắt verb card không có context.", lockGuard_en: "Catches verb cards without context.", preIntegration: true },
      { id: "pa-final-lock-verb-002", focus: "high_frequency_verbs", stage: "final_lock", gurmukhi: "ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ", romanization: "appointment laina", finalLock_vi: "Khóa ਲੈਣਾ trong clinic booking.", finalLock_en: "Lock ਲੈਣਾ in clinic booking.", expected_vi: "Cụm nghĩa là đặt/lấy lịch, không dịch ਲੈਣਾ rời.", expected_en: "The chunk means book/take an appointment, not isolated ਲੈਣਾ.", lockGuard_vi: "Bắt tách verb khỏi appointment context.", lockGuard_en: "Catches separating the verb from appointment context.", canadaPractical: true, freezeCandidate: true },
      { id: "pa-final-lock-verb-003", focus: "high_frequency_verbs", stage: "sanity", gurmukhi: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ", romanization: "mainu samajh nahi aai", finalLock_vi: "Khóa câu chưa hiểu với service support.", finalLock_en: "Lock the did-not-understand sentence with service support.", expected_vi: "Câu đầy đủ dùng được với nhân viên.", expected_en: "The full sentence can be used with staff.", lockGuard_vi: "Bắt sample rút còn verb ਸਮਝਣਾ.", lockGuard_en: "Catches samples reduced to ਸਮਝਣਾ.", canadaPractical: true },
    ],
  },
  {
    focus: "collocations",
    title_vi: "Final-lock collocations",
    title_en: "Final-Lock Collocations",
    lockGoal_vi: "Khóa collocation như một đơn vị nghĩa trong workflow.",
    lockGoal_en: "Lock collocations as meaning units inside workflows.",
    samples: [
      { id: "pa-final-lock-collocation-001", focus: "collocations", stage: "final_acceptance", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", finalLock_vi: "Khóa câu cần giúp đỡ tại service counter.", finalLock_en: "Lock the help request at a service counter.", expected_vi: "Giữ cả câu, không rút còn ਮਦਦ.", expected_en: "Keeps the whole sentence, not reduced to ਮਦਦ.", lockGuard_vi: "Bắt cắt collocation thành từ rời.", lockGuard_en: "Catches splitting collocations into isolated words.", canadaPractical: true, freezeCandidate: true },
      { id: "pa-final-lock-collocation-002", focus: "collocations", stage: "pre_integration", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", finalLock_vi: "Khóa fill-out-a-form cho school, housing hoặc clinic paperwork.", finalLock_en: "Lock fill-out-a-form for school, housing, or clinic paperwork.", expected_vi: "Cụm là một hành động đầy đủ.", expected_en: "The chunk is one complete action.", lockGuard_vi: "Bắt workflow chỉ còn vocabulary rời.", lockGuard_en: "Catches workflows reduced to isolated vocabulary.", canadaPractical: true, preIntegration: true },
      { id: "pa-final-lock-collocation-003", focus: "collocations", stage: "sanity", gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", finalLock_vi: "Khóa correction chunk với chữ ਠ trong ਠੀਕ.", finalLock_en: "Lock the correction chunk with ਠ in ਠੀਕ.", expected_vi: "ਠ được giữ và không đọc như English th.", expected_en: "ਠ is preserved and not read like English th.", lockGuard_vi: "Bắt romanization che mất distinction của ਠ.", lockGuard_en: "Catches romanization hiding the ਠ distinction.", learnerTrap: { vi: "ਠ không phải th tiếng Anh.", en: "ਠ is not English th." }, canadaPractical: true },
    ],
  },
  {
    focus: "shahmukhi_awareness",
    title_vi: "Final-lock Shahmukhi awareness",
    title_en: "Final-Lock Shahmukhi Awareness",
    lockGoal_vi: "Khóa scope để Shahmukhi chỉ là awareness và Gurmukhi vẫn primary.",
    lockGoal_en: "Lock scope so Shahmukhi remains awareness only and Gurmukhi stays primary.",
    samples: [
      { id: "pa-final-lock-shahmukhi-001", focus: "shahmukhi_awareness", stage: "final_lock", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", finalLock_vi: "Khóa scope: Gurmukhi primary; Shahmukhi chỉ là awareness.", finalLock_en: "Lock scope: Gurmukhi primary; Shahmukhi is awareness only.", expected_vi: "Không biến thành khóa Shahmukhi đầy đủ.", expected_en: "Does not become a full Shahmukhi course.", lockGuard_vi: "Bắt nội dung Shahmukhi vượt phạm vi.", lockGuard_en: "Catches Shahmukhi content that exceeds scope.", freezeCandidate: true },
    ],
  },
  {
    focus: "pre_integration_verification",
    title_vi: "Final-lock pre-integration verification",
    title_en: "Final-Lock Pre-Integration Verification",
    lockGoal_vi: "Khóa kiểm tra cuối về field, scope và wording trước bước sau.",
    lockGoal_en: "Lock final checks for fields, scope, and wording before a later step.",
    samples: [
      { id: "pa-final-lock-final-001", focus: "pre_integration_verification", stage: "pre_integration", gurmukhi: "ਅੰਤਿਮ ਤਾਲਾ", romanization: "antim tala", finalLock_vi: "Khóa id, focus, stage, Gurmukhi và VI/EN.", finalLock_en: "Lock id, focus, stage, Gurmukhi, and VI/EN.", expected_vi: "Dữ liệu là TypeScript consumable, không phải notes rời.", expected_en: "Data is consumable TypeScript, not loose notes.", lockGuard_vi: "Bắt thiếu field hoặc thiếu Gurmukhi primary.", lockGuard_en: "Catches missing fields or missing Gurmukhi primary.", preIntegration: true, freezeCandidate: true },
      { id: "pa-final-lock-final-002", focus: "pre_integration_verification", stage: "sanity", gurmukhi: "ਮੁੜ ਜਾਂਚ", romanization: "mur jaanch", finalLock_vi: "Khóa wording native-review và scope Punjabi script/vocabulary.", finalLock_en: "Lock native-review wording and Punjabi script/vocabulary scope.", expected_vi: "Native review được hoãn; không claim đã review.", expected_en: "Native review is deferred; no reviewed claim is made.", lockGuard_vi: "Bắt scope drift ngoài Punjabi script/vocabulary.", lockGuard_en: "Catches scope drift beyond Punjabi script/vocabulary.", preIntegration: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_FINAL_LOCK_SAMPLES = sections;

export const PUNJABI_SCRIPT_VOCABULARY_FINAL_LOCK_SAMPLE_ITEMS: ReadonlyArray<PunjabiScriptVocabularyFinalLockSample> =
  sections.flatMap((section) => section.samples);

export default PUNJABI_SCRIPT_VOCABULARY_FINAL_LOCK_SAMPLES;
