// Punjabi B2 argument stress tests for pressure-handling checks.
// Gurmukhi is primary; romanization is kept for Vietnamese- and English-speaking learners.

import {
  punjabiLearnerProofPackB2,
  type PunjabiLearnerProofPackB2Focus,
  type PunjabiLearnerProofPackB2Item,
  type PunjabiLearnerProofPackB2Topic,
} from "./learnerProofPackB2";

export type PunjabiArgumentStressTestsB2Focus = PunjabiLearnerProofPackB2Focus;
export type PunjabiArgumentStressTestsB2Topic = PunjabiLearnerProofPackB2Topic;

export type PunjabiArgumentStressTestB2 = {
  id: string;
  level: "B2";
  stressFocus: PunjabiArgumentStressTestsB2Focus;
  topic: PunjabiArgumentStressTestsB2Topic;
  stressPrompt_gurmukhi: string;
  stressPrompt_romanization: string;
  stressPrompt_vi: string;
  stressPrompt_en: string;
  weakEvidence_gurmukhi: string;
  weakEvidence_romanization: string;
  weakEvidence_vi: string;
  weakEvidence_en: string;
  stressResponse_gurmukhi: string;
  stressResponse_romanization: string;
  stressResponse_vi: string;
  stressResponse_en: string;
  finalRisk_vi: string[];
  finalRisk_en: string[];
  finalQa_vi: string[];
  finalQa_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const stressPromptByFocus: Record<
  PunjabiArgumentStressTestsB2Focus,
  { vi: string; en: string }
> = {
  structured_opinion: {
    vi: "Bị ép nêu stance rõ trong khi evidence còn mơ hồ.",
    en: "Forced to give a clear stance even when the evidence is still vague.",
  },
  comparison: {
    vi: "Bị yêu cầu so sánh khi hai lựa chọn đều có điểm mạnh và yếu.",
    en: "Asked to compare when both options have strengths and weaknesses.",
  },
  counterpoint: {
    vi: "Bị thúc đẩy phản hồi khi người nói dùng câu tuyệt đối như always/never.",
    en: "Pressed to respond when the speaker uses absolute claims like always/never.",
  },
  recommendation: {
    vi: "Bị yêu cầu bảo vệ một đề xuất trước câu hỏi phản biện.",
    en: "Required to defend a recommendation against a challenging follow-up question.",
  },
  workplace_fairness: {
    vi: "Bị hỏi cách nói công bằng mà vẫn giữ tone chuyên nghiệp.",
    en: "Asked how to stay fair while keeping a professional tone.",
  },
};

const riskByFocus: Record<
  PunjabiArgumentStressTestsB2Focus,
  { vi: string[]; en: string[] }
> = {
  structured_opinion: {
    vi: ["Thiếu evidence cụ thể", "Không có câu chốt"],
    en: ["Lacks concrete evidence", "No closing sentence"],
  },
  comparison: {
    vi: ["Bỏ quên tradeoff", "Nói quá tuyệt đối"],
    en: ["Misses the tradeoff", "Becomes too absolute"],
  },
  counterpoint: {
    vi: ["Phản bác quá mạnh", "Không công nhận điểm đúng của người khác"],
    en: ["Too harsh a rebuttal", "Does not acknowledge the other side"],
  },
  recommendation: {
    vi: ["Đề xuất không có điều kiện", "Hứa quá mức"],
    en: ["Recommendation lacks conditions", "Overpromises"],
  },
  workplace_fairness: {
    vi: ["Đổ lỗi cá nhân", "Thiếu process"],
    en: ["Blames individuals", "Lacks process"],
  },
};

const evidenceLineByFocus: Record<
  PunjabiArgumentStressTestsB2Focus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "ਅੰਦਾਜ਼ੇ ਨਾਲੋਂ ਸਪਸ਼ਟ ਕਦਮ ਅਤੇ ਮਿਤੀ ਜ਼ਿਆਦਾ ਲਾਭਦਾਇਕ ਹਨ।",
    r: "andaaze nalon spasht kadam ate mitii zyaadaa laabhdaayak han.",
    vi: "Bước và ngày rõ ràng hữu ích hơn suy đoán.",
    en: "Clear steps and dates are more useful than guesses.",
  },
  comparison: {
    g: "ਇੱਕ ਚੋਣ ਸਸਤੀ ਹੈ, ਦੂਜੀ ਭਰੋਸੇਯੋਗ; ਫੈਸਲਾ ਹਾਲਾਤ ਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ।",
    r: "ikk chon sasti hai, duujii bharoseyog; faislaa haalaat te nirbhar kardaa hai.",
    vi: "Một lựa chọn rẻ, lựa chọn kia đáng tin; quyết định tùy hoàn cảnh.",
    en: "One choice is cheaper, the other more reliable; the decision depends on circumstances.",
  },
  counterpoint: {
    g: "ਆਮ ਨਿਯਮ ਚੰਗਾ ਹੈ, ਪਰ urgent case ਲਈ exception ਚਾਹੀਦਾ ਹੈ।",
    r: "aam niyam changaa hai, par urgent case lai exception chaahiidaa hai.",
    vi: "Quy tắc chung tốt, nhưng cần ngoại lệ cho ca khẩn.",
    en: "The general rule is good, but an exception is needed for urgent cases.",
  },
  recommendation: {
    g: "ਜੇ ਗੱਡੀ ਨਹੀਂ, ਤਾਂ transit ਦੇ ਨੇੜੇ ਰਹਿਣਾ ਵਧੀਆ ਹੋ ਸਕਦਾ ਹੈ।",
    r: "je gaddi nahi, taan transit de nere rahinaa vadhiyaa ho sakdaa hai.",
    vi: "Nếu không có xe, ở gần transit có thể tốt hơn.",
    en: "If there is no car, living near transit can be better.",
  },
  workplace_fairness: {
    g: "ਵੰਡ ਦੀ ਸੂਚੀ ਨਾਲ ਕੰਮ ਪਾਰਦਰਸ਼ੀ ਰਹਿੰਦਾ ਹੈ।",
    r: "vand di suuchii naal kamm paaradarshii rahindaa hai.",
    vi: "Danh sách phân chia giúp công việc minh bạch.",
    en: "A distribution list keeps work transparent.",
  },
};

export const punjabiArgumentStressTestsB2: PunjabiArgumentStressTestB2[] =
  punjabiLearnerProofPackB2.map((item: PunjabiLearnerProofPackB2Item) => {
    const prompt = stressPromptByFocus[item.proofFocus];
    const risk = riskByFocus[item.proofFocus];
    const evidence = evidenceLineByFocus[item.proofFocus];

    return {
      id: item.id.replace("proof", "stress"),
      level: "B2",
      stressFocus: item.proofFocus,
      topic: item.topic,
      stressPrompt_gurmukhi: `${item.proofPrompt_gurmukhi} ਆਪਣੇ ਜਵਾਬ ਨੂੰ weak evidence ਦੇ ਦਬਾਅ ਹੇਠ defend ਕਰੋ।`,
      stressPrompt_romanization: `${item.proofPrompt_romanization} aapne javaab nu weak evidence de dabaav heth defend karo.`,
      stressPrompt_vi: `${item.proofPrompt_vi} Hãy bảo vệ câu trả lời của bạn khi evidence còn yếu.`,
      stressPrompt_en: `${item.proofPrompt_en} Defend your answer when the evidence is weak.`,
      weakEvidence_gurmukhi: evidence.g,
      weakEvidence_romanization: evidence.r,
      weakEvidence_vi: evidence.vi,
      weakEvidence_en: evidence.en,
      stressResponse_gurmukhi: item.modelProof_gurmukhi,
      stressResponse_romanization: item.modelProof_romanization,
      stressResponse_vi: item.modelProof_vi,
      stressResponse_en: item.modelProof_en,
      finalRisk_vi: risk.vi,
      finalRisk_en: risk.en,
      finalQa_vi: [
        "Có giữ stance dưới áp lực?",
        "Có trả lời tradeoff/risk?",
        "Có câu chốt cuối?",
      ],
      finalQa_en: [
        "Does it keep the stance under pressure?",
        "Does it answer the tradeoff/risk?",
        "Is there a closing sentence?",
      ],
      learnerTrap_vi: `${item.learnerTrap_vi} ${prompt.vi}`,
      learnerTrap_en: `${item.learnerTrap_en} ${prompt.en}`,
      canadaPracticalExample_vi: item.canadaPracticalExample_vi,
      canadaPracticalExample_en: item.canadaPracticalExample_en,
      scriptAwareness_en: item.scriptAwareness_en,
      nativeReview: item.nativeReview,
    };
  });

export default punjabiArgumentStressTestsB2;
