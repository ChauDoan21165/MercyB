// Punjabi script vocabulary proof pack for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary; romanization is a bridge only. Shahmukhi is awareness
// only, not a full course. Native review is deferred. No pronunciation scoring,
// audio, or integration claims.

export type PunjabiScriptVocabularyProofArea =
  | "gurmukhi_recognition"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "service_words"
  | "thematic_vocabulary"
  | "high_frequency_verbs"
  | "collocations"
  | "romanization_bridge_reduction"
  | "shahmukhi_awareness";

export type PunjabiScriptVocabularyProofUse = "proof_pack" | "final_owner_review" | "final_qa";

export type PunjabiScriptVocabularyProofItem = {
  id: string;
  area: PunjabiScriptVocabularyProofArea;
  use: PunjabiScriptVocabularyProofUse;
  gurmukhi: string;
  romanization?: string;
  prompt_vi: string;
  prompt_en: string;
  answer_vi: string;
  answer_en: string;
  proof_vi: string;
  proof_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  finalOwnerReview?: boolean;
  finalQA?: boolean;
  proofPack?: boolean;
};

export type PunjabiScriptVocabularyProofPackScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundaries: string[];
};

export const PUNJABI_SCRIPT_VOCABULARY_PROOF_PACK_SCOPE: PunjabiScriptVocabularyProofPackScope = {
  name: "Punjabi Script Vocabulary Proof Pack",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundaries: [
    "Language support only for script and vocabulary proof situations.",
    "No pronunciation scoring, audio, medical, legal, financial, or CI/integration claims.",
  ],
};

export const PUNJABI_SCRIPT_VOCABULARY_PROOF_PACK: PunjabiScriptVocabularyProofItem[] = [
  {
    id: "pa-proof-gurmukhi-001",
    area: "gurmukhi_recognition",
    use: "proof_pack",
    gurmukhi: "ਕ / ਖ",
    romanization: "k / kh",
    prompt_vi: "Chữ nào bật hơi trong cặp này?",
    prompt_en: "Which letter in this pair is aspirated?",
    answer_vi: "ਖ là kh bật hơi; ਕ là k không bật hơi.",
    answer_en: "ਖ is aspirated kh; ਕ is unaspirated k.",
    proof_vi: "Proof là nhận ra hình chữ, không tách kh thành hai chữ Latin.",
    proof_en: "The proof is script recognition, not splitting kh into two Latin letters.",
    learnerTrap: {
      vi: "kh trong romanization không phải hai chữ riêng.",
      en: "kh in romanization is not two separate letters.",
    },
  },
  {
    id: "pa-proof-vowel-002",
    area: "vowel_signs",
    use: "final_qa",
    gurmukhi: "ਕਿ / ਕੀ / ਕੌ",
    romanization: "ki / kii / kau",
    prompt_vi: "Ba dấu này đọc thế nào?",
    prompt_en: "How are these three signs read?",
    answer_vi: "ਕਿ là ki, ਕੀ là kii, và ਕੌ là kau.",
    answer_en: "ਕਿ is ki, ਕੀ is kii, and ਕੌ is kau.",
    proof_vi: "Final QA là không đảo thứ tự dấu và không lẫn ba nguyên âm.",
    proof_en: "Final QA means not reversing the sign order and not mixing the three vowels.",
    learnerTrap: {
      vi: "Dấu ਿ viết trước nhưng đọc sau phụ âm.",
      en: "The ਿ sign is written before but read after the consonant.",
    },
    finalQA: true,
    canadaPractical: true,
  },
  {
    id: "pa-proof-mark-003",
    area: "addak_tippi_bindi",
    use: "final_owner_review",
    gurmukhi: "ਬੱਸ ਅੱਡਾ / ਮਾਂ",
    romanization: "bus adda / maan",
    prompt_vi: "Dấu nào cần nhận ra trong hai từ này?",
    prompt_en: "Which marks should be recognized in these two words?",
    answer_vi: "Addak ੱ trong ਬੱਸ, ਅੱਡਾ và bindi ਂ trong ਮਾਂ.",
    answer_en: "The addak ੱ in ਬੱਸ, ਅੱਡਾ and the bindi ਂ in ਮਾਂ.",
    proof_vi: "Owner review chốt khi người học nhìn thấy dấu nhỏ trước khi đoán nghĩa.",
    proof_en: "Owner review closes when the learner sees the small marks before guessing meaning.",
    learnerTrap: {
      vi: "Bỏ addak làm từ nhìn quen nhưng đọc thiếu.",
      en: "Skipping addak makes the word look familiar but incomplete.",
    },
    canadaPractical: true,
    finalOwnerReview: true,
  },
  {
    id: "pa-proof-signage-004",
    area: "survival_signage",
    use: "proof_pack",
    gurmukhi: "ਨਿਕਾਸ / ਐਮਰਜੈਂਸੀ",
    romanization: "nikaas / emergency",
    prompt_vi: "Hai biển này chỉ gì?",
    prompt_en: "What do these two signs indicate?",
    answer_vi: "ਨਿਕਾਸ là lối ra; ਐਮਰਜੈਂਸੀ là khẩn cấp.",
    answer_en: "ਨਿਕਾਸ means exit; ਐਮਰਜੈਂਸੀ means emergency.",
    proof_vi: "Proof ở đây là đọc biển ở Canada và chọn hành động đúng.",
    proof_en: "The proof here is reading the Canadian sign and choosing the right action.",
    learnerTrap: {
      vi: "Đừng chỉ nhớ English sign mà bỏ Gurmukhi.",
      en: "Do not remember only the English sign and skip Gurmukhi.",
    },
    canadaPractical: true,
  },
  {
    id: "pa-proof-service-005",
    area: "service_words",
    use: "final_owner_review",
    gurmukhi: "ਫਾਰਮੇਸੀ / ਫਾਰਮ",
    romanization: "pharmacy / form",
    prompt_vi: "Hai từ dịch vụ này dùng khi nào?",
    prompt_en: "When are these service words used?",
    answer_vi: "ਫਾਰਮੇਸੀ là nhà thuốc; ਫਾਰਮ là mẫu đơn.",
    answer_en: "ਫਾਰਮੇਸੀ means pharmacy; ਫਾਰਮ means form.",
    proof_vi: "Owner review chốt khi người học đọc được từ quầy và hiểu ngữ cảnh.",
    proof_en: "Owner review closes when the learner can read the counter word and understand the context.",
    canadaPractical: true,
    finalOwnerReview: true,
  },
  {
    id: "pa-proof-theme-006",
    area: "thematic_vocabulary",
    use: "proof_pack",
    gurmukhi: "ਦਵਾਈ / ਕਿਰਾਇਆ / ਦਸਤਾਵੇਜ਼",
    romanization: "davai / kiraya / dastavez",
    prompt_vi: "Ba từ chủ đề này thuộc nhóm nào?",
    prompt_en: "What theme do these three words belong to?",
    answer_vi: "Chúng thuộc nhóm thuốc, tiền thuê nhà, và giấy tờ.",
    answer_en: "They belong to medicine, rent, and documents.",
    proof_vi: "Proof là kéo được từ vựng về nhóm nghĩa chứ không học rời rạc.",
    proof_en: "The proof is grouping the vocabulary by meaning, not learning words in isolation.",
    learnerTrap: {
      vi: "Đừng nhầm ਦਸਤਾਵੇਜ਼ với một từ dịch vụ chung chung.",
      en: "Do not confuse ਦਸਤਾਵੇਜ਼ with a generic service word.",
    },
    canadaPractical: true,
  },
  {
    id: "pa-proof-verb-007",
    area: "high_frequency_verbs",
    use: "final_qa",
    gurmukhi: "ਕਰਨਾ / ਲੈਣਾ",
    romanization: "karna / laina",
    prompt_vi: "Hai động từ này thường dùng để làm gì?",
    prompt_en: "What are these two verbs usually used for?",
    answer_vi: "ਕਰਨਾ là làm; ਲੈਣਾ là lấy/nhận.",
    answer_en: "ਕਰਨਾ means do; ਲੈਣਾ means take/get.",
    proof_vi: "Final QA là dùng động từ trong câu thật thay vì chỉ học từ điển.",
    proof_en: "Final QA means using the verbs in real sentences rather than only dictionary forms.",
    learnerTrap: {
      vi: "Đừng học chỉ nghĩa danh sách; phải đặt vào câu.",
      en: "Do not learn only a list meaning; put them into a sentence.",
    },
    finalQA: true,
    canadaPractical: true,
  },
  {
    id: "pa-proof-collocation-008",
    area: "collocations",
    use: "proof_pack",
    gurmukhi: "ਮਦਦ ਚਾਹੀਦੀ ਹੈ / ਹੌਲੀ ਹੌਲੀ",
    romanization: "madad chahidi hai / hauli hauli",
    prompt_vi: "Hai cụm này hợp với tình huống nào?",
    prompt_en: "What situations fit these two phrases?",
    answer_vi: "Cụm đầu dùng khi cần giúp; cụm sau dùng khi xin nói chậm.",
    answer_en: "The first is for needing help; the second is for asking for slow speech.",
    proof_vi: "Proof là nhận ra cụm cố định thay vì ghép từng từ một cách máy móc.",
    proof_en: "The proof is recognizing fixed phrases instead of mechanically joining words.",
    learnerTrap: {
      vi: "Dịch từng từ sẽ làm cụm nghe gượng.",
      en: "Word-for-word translation makes the phrase sound forced.",
    },
    canadaPractical: true,
  },
  {
    id: "pa-proof-romanization-009",
    area: "romanization_bridge_reduction",
    use: "final_qa",
    gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    romanization: "mainu madad chahidi hai.",
    prompt_vi: "Khi nào romanization chỉ còn là cầu đọc?",
    prompt_en: "When is romanization only a reading bridge?",
    answer_vi: "Khi người học đọc Gurmukhi trước và chỉ dùng romanization để kiểm lại.",
    answer_en: "When the learner reads Gurmukhi first and only uses romanization as a check.",
    proof_vi: "Final QA là giảm dần lệ thuộc romanization và vẫn đọc được Gurmukhi.",
    proof_en: "Final QA means reducing reliance on romanization while still reading Gurmukhi.",
    learnerTrap: {
      vi: "Đừng bắt đầu từ romanization rồi mới nhìn Gurmukhi.",
      en: "Do not start from romanization and only then look at Gurmukhi.",
    },
    finalQA: true,
  },
  {
    id: "pa-proof-shahmukhi-010",
    area: "shahmukhi_awareness",
    use: "final_owner_review",
    gurmukhi: "ਸ਼ਾਹਮੁਖੀ",
    romanization: "shahmukhi",
    prompt_vi: "Từ này nhắc điều gì?",
    prompt_en: "What does this word remind the learner about?",
    answer_vi: "Nó chỉ nhắc rằng Shahmukhi là nhận biết hệ chữ, không phải khóa đầy đủ.",
    answer_en: "It only reminds the learner that Shahmukhi is script awareness, not a full course.",
    proof_vi: "Owner review chốt khi Shahmukhi không mở rộng thành một chương trình riêng.",
    proof_en: "Owner review closes when Shahmukhi does not expand into a separate program.",
    learnerTrap: {
      vi: "Đừng biến phần nhận biết thành cả khóa học mới.",
      en: "Do not turn awareness into a whole new course.",
    },
    finalOwnerReview: true,
  },
];

export const punjabiScriptVocabularyProofPackByArea = (
  area: PunjabiScriptVocabularyProofArea,
) => PUNJABI_SCRIPT_VOCABULARY_PROOF_PACK.filter((item) => item.area === area);

export const punjabiScriptVocabularyProofPackByUse = (
  use: PunjabiScriptVocabularyProofUse,
) => PUNJABI_SCRIPT_VOCABULARY_PROOF_PACK.filter((item) => item.use === use);

export default PUNJABI_SCRIPT_VOCABULARY_PROOF_PACK;
