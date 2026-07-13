// src/languages/punjabi/scriptVocabularyFinalFreezeSamples.ts
//
// Punjabi script/vocabulary final-freeze samples for internal consistency.
// Native review is deferred.

export type PunjabiFinalFreezeFocus =
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

export type PunjabiFinalFreezeStage = "final_freeze" | "final_lock" | "owner_acceptance" | "pre_integration" | "sanity";

export type PunjabiScriptVocabularyFinalFreezeSample = {
  cell_id?: string;
  id: string;
  focus: PunjabiFinalFreezeFocus;
  stage: PunjabiFinalFreezeStage;
  gurmukhi: string;
  romanization?: string;
  finalFreeze_vi: string;
  finalFreeze_en: string;
  expected_vi: string;
  expected_en: string;
  freezeGuard_vi: string;
  freezeGuard_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  freezeCandidate?: boolean;
  preIntegration?: boolean;
};

export type PunjabiScriptVocabularyFinalFreezeSection = {
  cell_id?: string;
  focus: PunjabiFinalFreezeFocus;
  title_vi: string;
  title_en: string;
  freezeGoal_vi: string;
  freezeGoal_en: string;
  samples: ReadonlyArray<PunjabiScriptVocabularyFinalFreezeSample>;
};

export const PUNJABI_SCRIPT_VOCABULARY_FINAL_FREEZE_SCOPE = {
  vi: "Bộ final-freeze này khóa dữ liệu Punjabi script/vocabulary trước bước tích hợp sau: Gurmukhi là primary, romanization chỉ là bridge, vowel signs và addak/tippi/bindi được giữ, signage, service vocabulary, verbs, collocations và Shahmukhi awareness không vượt scope. Đây là TypeScript data app-consumable; native review được hoãn.",
  en: "This final-freeze set freezes Punjabi script/vocabulary data before a later integration step: Gurmukhi is primary, romanization is only a bridge, vowel signs and addak/tippi/bindi are preserved, and signage, service vocabulary, verbs, collocations, and Shahmukhi awareness stay in scope. This is app-consumable TypeScript data; native review is deferred.",
  finalFreezeDataOnly: true,
} as const;

const sections: ReadonlyArray<PunjabiScriptVocabularyFinalFreezeSection> = [
  {
    focus: "gurmukhi_forms",
    title_vi: "Final-freeze Gurmukhi forms",
    title_en: "Final-Freeze Gurmukhi Forms",
    freezeGoal_vi: "Khóa các form Gurmukhi làm anchor chính để Latin không thay thế ở bước sau.",
    freezeGoal_en: "Freeze Gurmukhi forms as the main anchors so Latin text cannot replace them later.",
    samples: [
      { id: "pa-final-freeze-gurmukhi-001", focus: "gurmukhi_forms", stage: "final_freeze", gurmukhi: "ਪੰਜਾਬੀ", romanization: "panjabi/punjabi", finalFreeze_vi: "Khóa tên ngôn ngữ bằng Gurmukhi trước mọi variant Latin.", finalFreeze_en: "Freeze the language name in Gurmukhi before any Latin variant.", expected_vi: "ਪੰਜਾਬੀ là form hiển thị chính trong acceptance sample.", expected_en: "ਪੰਜਾਬੀ is the primary display form in the acceptance sample.", freezeGuard_vi: "Bắt nội dung chỉ còn Punjabi/Panjabi.", freezeGuard_en: "Catches content reduced to Punjabi/Panjabi only.", learnerTrap: { vi: "Latin không cho thấy tippi trong ਪੰਜਾਬੀ.", en: "Latin does not show tippi in ਪੰਜਾਬੀ." }, freezeCandidate: true },
      { id: "pa-final-freeze-gurmukhi-002", focus: "gurmukhi_forms", stage: "owner_acceptance", gurmukhi: "ਪੜ੍ਹੋ", romanization: "parho", finalFreeze_vi: "Khóa prompt đọc để bắt đầu từ chữ Gurmukhi.", finalFreeze_en: "Freeze the reading prompt so it begins from Gurmukhi script.", expected_vi: "Learner đọc ਪੜ੍ਹੋ trước khi nhìn romanization.", expected_en: "The learner reads ਪੜ੍ਹੋ before looking at romanization.", freezeGuard_vi: "Bắt prompt Latin-first trong final handoff.", freezeGuard_en: "Catches Latin-first prompts in final handoff.", preIntegration: true },
    ],
  },
  {
    focus: "romanization_bridge",
    title_vi: "Final-freeze romanization bridge",
    title_en: "Final-Freeze Romanization Bridge",
    freezeGoal_vi: "Khóa romanization như bridge phụ, không phải nguồn dữ liệu chính.",
    freezeGoal_en: "Freeze romanization as a supporting bridge, not the main data source.",
    samples: [
      { id: "pa-final-freeze-roman-001", focus: "romanization_bridge", stage: "final_freeze", gurmukhi: "ਫਲ", romanization: "phal/fal", finalFreeze_vi: "Khóa ph/f như variant trỏ về cùng chữ ਫਲ.", finalFreeze_en: "Freeze ph/f as variants pointing to the same ਫਲ form.", expected_vi: "Không tạo hai entry chỉ vì spelling Latin khác.", expected_en: "Does not create two entries only because Latin spelling differs.", freezeGuard_vi: "Bắt duplicate romanization-only.", freezeGuard_en: "Catches romanization-only duplicates.", learnerTrap: { vi: "ਫ mới là anchor, ph/f là cầu phụ.", en: "ਫ is the anchor; ph/f are helper bridges." }, freezeCandidate: true },
      { id: "pa-final-freeze-roman-002", focus: "romanization_bridge", stage: "sanity", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", finalFreeze_vi: "Khóa v/w như bridge cho một form Gurmukhi.", finalFreeze_en: "Freeze v/w as bridges for one Gurmukhi form.", expected_vi: "ਵੱਡਾ giữ addak và không bị tách thành hai từ Latin.", expected_en: "ਵੱਡਾ keeps addak and is not split into two Latin words.", freezeGuard_vi: "Bắt romanization làm rơi addak.", freezeGuard_en: "Catches romanization causing addak loss.", learnerTrap: { vi: "v/w không quyết định nghĩa riêng.", en: "v/w does not decide a separate meaning." } },
      { id: "pa-final-freeze-roman-003", focus: "romanization_bridge", stage: "pre_integration", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", finalFreeze_vi: "Khóa ਸ਼ có dấu dưới để không trộn với ਸ.", finalFreeze_en: "Freeze marked ਸ਼ so it is not merged with ਸ.", expected_vi: "Form Gurmukhi có dấu dưới vẫn được giữ trong dữ liệu.", expected_en: "The Gurmukhi form with the lower mark remains in the data.", freezeGuard_vi: "Bắt normalization sai của ਸ਼.", freezeGuard_en: "Catches incorrect normalization of ਸ਼.", learnerTrap: { vi: "ਸ਼ và ਸ không giống nhau.", en: "ਸ਼ and ਸ are not the same." }, preIntegration: true },
    ],
  },
  {
    focus: "vowel_signs",
    title_vi: "Final-freeze vowel signs",
    title_en: "Final-Freeze Vowel Signs",
    freezeGoal_vi: "Khóa dấu nguyên âm để list view và card nhỏ không làm mất đối lập.",
    freezeGoal_en: "Freeze vowel signs so list views and compact cards do not lose contrasts.",
    samples: [
      { id: "pa-final-freeze-vowel-001", focus: "vowel_signs", stage: "final_lock", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", finalFreeze_vi: "Khóa i ngắn/dài và rule ਿ viết trước đọc sau.", finalFreeze_en: "Freeze short/long i and the rule that ਿ is written before but read after.", expected_vi: "ਕਿ và ਕੀ khác bằng dấu, không chỉ bằng Latin.", expected_en: "ਕਿ and ਕੀ differ by signs, not only Latin spelling.", freezeGuard_vi: "Bắt đọc visual-order của ਕਿ.", freezeGuard_en: "Catches visual-order reading of ਕਿ.", learnerTrap: { vi: "ਕਿ không đọc là ik.", en: "ਕਿ is not read as ik." }, freezeCandidate: true },
      { id: "pa-final-freeze-vowel-002", focus: "vowel_signs", stage: "pre_integration", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", finalFreeze_vi: "Khóa dấu dưới trong UI compact.", finalFreeze_en: "Freeze under-letter signs in compact UI.", expected_vi: "ੁ và ੂ vẫn phân biệt khi render nhỏ.", expected_en: "ੁ and ੂ remain distinct when rendered small.", freezeGuard_vi: "Bắt fallback chỉ còn ku/kuu.", freezeGuard_en: "Catches fallback reduced to ku/kuu.", learnerTrap: { vi: "Dấu dưới rất dễ bị bỏ qua.", en: "Under-letter signs are easy to miss." }, preIntegration: true },
      { id: "pa-final-freeze-vowel-003", focus: "vowel_signs", stage: "sanity", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", finalFreeze_vi: "Khóa ba dấu e, ai và au trong sample signage.", finalFreeze_en: "Freeze e, ai, and au signs in signage samples.", expected_vi: "Không đổi ਕੈ thành ਕੇ hoặc ਕੌ.", expected_en: "Does not swap ਕੈ into ਕੇ or ਕੌ.", freezeGuard_vi: "Bắt swap vowel sign trước freeze.", freezeGuard_en: "Catches vowel-sign swaps before freeze.", freezeCandidate: true },
    ],
  },
  {
    focus: "addak_tippi_bindi",
    title_vi: "Final-freeze small marks",
    title_en: "Final-Freeze Small Marks",
    freezeGoal_vi: "Khóa addak, tippi và bindi trong vocabulary có rủi ro mất dấu.",
    freezeGoal_en: "Freeze addak, tippi, and bindi in vocabulary where small marks are easy to lose.",
    samples: [
      { id: "pa-final-freeze-mark-001", focus: "addak_tippi_bindi", stage: "final_freeze", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", finalFreeze_vi: "Khóa cụm bus stop Canada với addak ở cả hai từ.", finalFreeze_en: "Freeze the Canadian bus-stop chunk with addak in both words.", expected_vi: "ਬੱਸ và ਅੱਡਾ đều giữ ੱ trong cụm transit.", expected_en: "ਬੱਸ and ਅੱਡਾ both keep ੱ in the transit chunk.", freezeGuard_vi: "Bắt normalization làm rơi addak.", freezeGuard_en: "Catches normalization that drops addak.", learnerTrap: { vi: "Addak không phải dấu trang trí.", en: "Addak is not decorative." }, canadaPractical: true, freezeCandidate: true },
      { id: "pa-final-freeze-mark-002", focus: "addak_tippi_bindi", stage: "owner_acceptance", gurmukhi: "ਮਾਂ / ਪੰਜਾਬ", romanization: "maan / panjab", finalFreeze_vi: "Khóa bindi và tippi với giải thích vị trí dấu.", finalFreeze_en: "Freeze bindi and tippi with mark-placement explanations.", expected_vi: "Nêu rõ ਂ trong ਮਾਂ và ੰ trong ਪੰਜਾਬ.", expected_en: "Names ਂ in ਮਾਂ and ੰ in ਪੰਜਾਬ.", freezeGuard_vi: "Bắt note nasal mark quá chung chung.", freezeGuard_en: "Catches overly generic nasal-mark notes.", learnerTrap: { vi: "Romanization không cho thấy vị trí dấu.", en: "Romanization does not show mark placement." }, preIntegration: true },
    ],
  },
  {
    focus: "survival_signage",
    title_vi: "Final-freeze survival signage",
    title_en: "Final-Freeze Survival Signage",
    freezeGoal_vi: "Khóa biển sinh tồn bằng chữ Gurmukhi và hành động Canada-practical.",
    freezeGoal_en: "Freeze survival signs with Gurmukhi text and Canada-practical actions.",
    samples: [
      { id: "pa-final-freeze-sign-001", focus: "survival_signage", stage: "final_lock", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", finalFreeze_vi: "Khóa exit sign với hành động tìm lối ra.", finalFreeze_en: "Freeze the exit sign with the action of finding an exit.", expected_vi: "Learner theo ਨਿਕਾਸ trong mall, clinic hoặc building.", expected_en: "Learner follows ਨਿਕਾਸ in a mall, clinic, or building.", freezeGuard_vi: "Bắt sample chỉ dịch exit mà thiếu action.", freezeGuard_en: "Catches samples that translate exit without action.", canadaPractical: true, freezeCandidate: true },
      { id: "pa-final-freeze-sign-002", focus: "survival_signage", stage: "pre_integration", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", finalFreeze_vi: "Khóa emergency với context hospital hoặc clinic.", finalFreeze_en: "Freeze emergency with hospital or clinic context.", expected_vi: "Gurmukhi đứng trước English loanword.", expected_en: "Gurmukhi appears before the English loanword.", freezeGuard_vi: "Bắt English thay thế Gurmukhi.", freezeGuard_en: "Catches English replacing Gurmukhi.", canadaPractical: true, preIntegration: true },
      { id: "pa-final-freeze-sign-003", focus: "survival_signage", stage: "sanity", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", finalFreeze_vi: "Khóa pharmacy loanword để learner vẫn đọc script.", finalFreeze_en: "Freeze the pharmacy loanword so the learner still reads script.", expected_vi: "ਫਾਰਮੇਸੀ đọc trước pharmacy/farmacy.", expected_en: "ਫਾਰਮੇਸੀ is read before pharmacy/farmacy.", freezeGuard_vi: "Bắt loanword làm người học bỏ qua script.", freezeGuard_en: "Catches loanwords causing script skipping.", learnerTrap: { vi: "Loanword quen không thay thế Gurmukhi.", en: "A familiar loanword does not replace Gurmukhi." }, canadaPractical: true },
    ],
  },
  {
    focus: "service_vocabulary",
    title_vi: "Final-freeze service vocabulary",
    title_en: "Final-Freeze Service Vocabulary",
    freezeGoal_vi: "Khóa từ dịch vụ với workflow thực tế để không chỉ còn glossary rời.",
    freezeGoal_en: "Freeze service words with practical workflows so they are not isolated glossary items.",
    samples: [
      { id: "pa-final-freeze-service-001", focus: "service_vocabulary", stage: "final_freeze", gurmukhi: "ਦਵਾਈ", romanization: "davai", finalFreeze_vi: "Khóa medicine với pharmacy hoặc clinic context.", finalFreeze_en: "Freeze medicine with pharmacy or clinic context.", expected_vi: "ਦਵਾਈ có script, romanization phụ và nghĩa thuốc.", expected_en: "ਦਵਾਈ has script, helper romanization, and medicine meaning.", freezeGuard_vi: "Bắt item chỉ còn English medicine.", freezeGuard_en: "Catches items that keep only English medicine.", canadaPractical: true, preIntegration: true },
      { id: "pa-final-freeze-service-002", focus: "service_vocabulary", stage: "final_lock", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", finalFreeze_vi: "Khóa rent với housing notice hoặc form.", finalFreeze_en: "Freeze rent with a housing notice or form.", expected_vi: "ਕਿਰਾਇਆ giữ nghĩa tiền thuê trong context.", expected_en: "ਕਿਰਾਇਆ keeps the rent meaning in context.", freezeGuard_vi: "Bắt bản dịch rent thiếu Gurmukhi.", freezeGuard_en: "Catches rent translations missing Gurmukhi.", canadaPractical: true, freezeCandidate: true },
      { id: "pa-final-freeze-service-003", focus: "service_vocabulary", stage: "sanity", gurmukhi: "ਪਛਾਣ ਪੱਤਰ", romanization: "pachhan pattar", finalFreeze_vi: "Khóa ID document như service chunk.", finalFreeze_en: "Freeze ID document as a service chunk.", expected_vi: "Cụm giữ nguyên khi dùng ở service desk.", expected_en: "The phrase stays intact at a service desk.", freezeGuard_vi: "Bắt dịch từng từ làm mất workflow.", freezeGuard_en: "Catches word-by-word translation that loses workflow.", learnerTrap: { vi: "ਪੱਤਰ ở đây là document/paper.", en: "ਪੱਤਰ here means document/paper." }, canadaPractical: true },
    ],
  },
  {
    focus: "high_frequency_verbs",
    title_vi: "Final-freeze high-frequency verbs",
    title_en: "Final-Freeze High-Frequency Verbs",
    freezeGoal_vi: "Khóa động từ lõi trong action chunks để learner không học rời.",
    freezeGoal_en: "Freeze core verbs in action chunks so learners do not study them in isolation.",
    samples: [
      { id: "pa-final-freeze-verb-001", focus: "high_frequency_verbs", stage: "owner_acceptance", gurmukhi: "ਕਰਨਾ", romanization: "karna", finalFreeze_vi: "Khóa ਕਰਨਾ cùng action như form hoặc correction.", finalFreeze_en: "Freeze ਕਰਨਾ with actions such as forms or corrections.", expected_vi: "Verb được hiểu qua hành động cụ thể.", expected_en: "The verb is understood through a concrete action.", freezeGuard_vi: "Bắt verb card không có context.", freezeGuard_en: "Catches verb cards without context.", preIntegration: true },
      { id: "pa-final-freeze-verb-002", focus: "high_frequency_verbs", stage: "final_freeze", gurmukhi: "ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ", romanization: "appointment laina", finalFreeze_vi: "Khóa ਲੈਣਾ trong clinic booking.", finalFreeze_en: "Freeze ਲੈਣਾ in clinic booking.", expected_vi: "Cụm nghĩa là đặt/lấy lịch, không dịch ਲੈਣਾ rời.", expected_en: "The chunk means book/take an appointment, not isolated ਲੈਣਾ.", freezeGuard_vi: "Bắt tách verb khỏi appointment context.", freezeGuard_en: "Catches separating the verb from appointment context.", canadaPractical: true, freezeCandidate: true },
      { id: "pa-final-freeze-verb-003", focus: "high_frequency_verbs", stage: "sanity", gurmukhi: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ", romanization: "mainu samajh nahi aai", finalFreeze_vi: "Khóa câu chưa hiểu với service support.", finalFreeze_en: "Freeze the did-not-understand sentence with service support.", expected_vi: "Câu đầy đủ dùng được với nhân viên.", expected_en: "The full sentence can be used with staff.", freezeGuard_vi: "Bắt sample rút còn verb ਸਮਝਣਾ.", freezeGuard_en: "Catches samples reduced to ਸਮਝਣਾ.", canadaPractical: true },
    ],
  },
  {
    focus: "collocations",
    title_vi: "Final-freeze collocations",
    title_en: "Final-Freeze Collocations",
    freezeGoal_vi: "Khóa collocation như một đơn vị nghĩa trong workflow.",
    freezeGoal_en: "Freeze collocations as meaning units inside workflows.",
    samples: [
      { id: "pa-final-freeze-collocation-001", focus: "collocations", stage: "final_lock", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", finalFreeze_vi: "Khóa câu cần giúp đỡ tại service counter.", finalFreeze_en: "Freeze the help request at a service counter.", expected_vi: "Giữ cả câu, không rút còn ਮਦਦ.", expected_en: "Keeps the whole sentence, not reduced to ਮਦਦ.", freezeGuard_vi: "Bắt cắt collocation thành từ rời.", freezeGuard_en: "Catches splitting collocations into isolated words.", canadaPractical: true, freezeCandidate: true },
      { id: "pa-final-freeze-collocation-002", focus: "collocations", stage: "pre_integration", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", finalFreeze_vi: "Khóa fill-out-a-form cho school, housing hoặc clinic paperwork.", finalFreeze_en: "Freeze fill-out-a-form for school, housing, or clinic paperwork.", expected_vi: "Cụm là một hành động đầy đủ.", expected_en: "The chunk is one complete action.", freezeGuard_vi: "Bắt workflow chỉ còn vocabulary rời.", freezeGuard_en: "Catches workflows reduced to isolated vocabulary.", canadaPractical: true, preIntegration: true },
      { id: "pa-final-freeze-collocation-003", focus: "collocations", stage: "sanity", gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", finalFreeze_vi: "Khóa correction chunk với chữ ਠ trong ਠੀਕ.", finalFreeze_en: "Freeze the correction chunk with ਠ in ਠੀਕ.", expected_vi: "ਠ được giữ và không đọc như English th.", expected_en: "ਠ is preserved and not read like English th.", freezeGuard_vi: "Bắt romanization che mất distinction của ਠ.", freezeGuard_en: "Catches romanization hiding the ਠ distinction.", learnerTrap: { vi: "ਠ không phải th tiếng Anh.", en: "ਠ is not English th." }, canadaPractical: true },
    ],
  },
  {
    focus: "shahmukhi_awareness",
    title_vi: "Final-freeze Shahmukhi awareness",
    title_en: "Final-Freeze Shahmukhi Awareness",
    freezeGoal_vi: "Khóa scope để Shahmukhi chỉ là awareness và Gurmukhi vẫn primary.",
    freezeGoal_en: "Freeze scope so Shahmukhi remains awareness only and Gurmukhi stays primary.",
    samples: [
      { id: "pa-final-freeze-shahmukhi-001", focus: "shahmukhi_awareness", stage: "final_freeze", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", finalFreeze_vi: "Khóa scope: Gurmukhi primary; Shahmukhi chỉ là awareness.", finalFreeze_en: "Freeze scope: Gurmukhi primary; Shahmukhi is awareness only.", expected_vi: "Không biến thành khóa Shahmukhi đầy đủ.", expected_en: "Does not become a full Shahmukhi course.", freezeGuard_vi: "Bắt nội dung Shahmukhi vượt phạm vi.", freezeGuard_en: "Catches Shahmukhi content that exceeds scope.", freezeCandidate: true },
    ],
  },
  {
    focus: "pre_integration_verification",
    title_vi: "Final-freeze pre-integration verification",
    title_en: "Final-Freeze Pre-Integration Verification",
    freezeGoal_vi: "Khóa kiểm tra cuối về field, scope và wording trước bước sau.",
    freezeGoal_en: "Freeze final checks for fields, scope, and wording before a later step.",
    samples: [
      { id: "pa-final-freeze-final-001", focus: "pre_integration_verification", stage: "pre_integration", gurmukhi: "ਅੰਤਿਮ ਤਾਲਾ", romanization: "antim tala", finalFreeze_vi: "Khóa id, focus, stage, Gurmukhi và VI/EN.", finalFreeze_en: "Freeze id, focus, stage, Gurmukhi, and VI/EN.", expected_vi: "Dữ liệu là TypeScript consumable, không phải notes rời.", expected_en: "Data is consumable TypeScript, not loose notes.", freezeGuard_vi: "Bắt thiếu field hoặc thiếu Gurmukhi primary.", freezeGuard_en: "Catches missing fields or missing Gurmukhi primary.", preIntegration: true, freezeCandidate: true },
      { id: "pa-final-freeze-final-002", focus: "pre_integration_verification", stage: "sanity", gurmukhi: "ਮੁੜ ਜਾਂਚ", romanization: "mur jaanch", finalFreeze_vi: "Khóa wording native-review và scope Punjabi script/vocabulary.", finalFreeze_en: "Freeze native-review wording and Punjabi script/vocabulary scope.", expected_vi: "Native review được hoãn; không claim đã review.", expected_en: "Native review is deferred; no reviewed claim is made.", freezeGuard_vi: "Bắt scope drift ngoài Punjabi script/vocabulary.", freezeGuard_en: "Catches scope drift beyond Punjabi script/vocabulary.", preIntegration: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_FINAL_FREEZE_SAMPLES = sections;

export const PUNJABI_SCRIPT_VOCABULARY_FINAL_FREEZE_SAMPLE_ITEMS: ReadonlyArray<PunjabiScriptVocabularyFinalFreezeSample> =
  sections.flatMap((section) => section.samples);

export default PUNJABI_SCRIPT_VOCABULARY_FINAL_FREEZE_SAMPLES;
