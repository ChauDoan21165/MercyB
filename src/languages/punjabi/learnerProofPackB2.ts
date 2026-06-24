// Punjabi B2 learner proof pack for end-of-lesson checks.
// Gurmukhi is primary; romanization helps Vietnamese- and English-speaking learners.

import {
  punjabiExitTicketsB2,
  type PunjabiExitTicketB2,
  type PunjabiExitTicketsB2Focus,
  type PunjabiExitTicketsB2Topic,
} from "./exitTicketsB2";

export type PunjabiLearnerProofPackB2Focus = PunjabiExitTicketsB2Focus;
export type PunjabiLearnerProofPackB2Topic = PunjabiExitTicketsB2Topic;

export type PunjabiLearnerProofPackB2Item = {
  id: string;
  level: "B2";
  proofFocus: PunjabiLearnerProofPackB2Focus;
  topic: PunjabiLearnerProofPackB2Topic;
  proofPrompt_gurmukhi: string;
  proofPrompt_romanization: string;
  proofPrompt_vi: string;
  proofPrompt_en: string;
  modelProof_gurmukhi: string;
  modelProof_romanization: string;
  modelProof_vi: string;
  modelProof_en: string;
  finalOwnerReview_vi: string[];
  finalOwnerReview_en: string[];
  finalQa_vi: string[];
  finalQa_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const proofByFocus: Record<
  PunjabiLearnerProofPackB2Focus,
  { vi: string; en: string }
> = {
  structured_opinion: {
    vi: "Dùng khi cần nêu stance, lý do và bước tiếp theo cho một câu hỏi B2.",
    en: "Use this when you need a stance, a reason, and a next step for a B2 question.",
  },
  comparison: {
    vi: "Dùng khi cần so sánh hai lựa chọn với tradeoff rõ ràng.",
    en: "Use this when comparing two choices with a clear tradeoff.",
  },
  counterpoint: {
    vi: "Dùng khi cần công nhận ý kiến trước rồi đưa ngoại lệ hợp lý.",
    en: "Use this when you need to acknowledge a view first and then add a reasonable exception.",
  },
  recommendation: {
    vi: "Dùng khi cần đề xuất một lựa chọn nhưng vẫn giữ điều kiện thực tế.",
    en: "Use this when recommending one option while keeping practical conditions in view.",
  },
  workplace_fairness: {
    vi: "Dùng khi cần giữ tone chuyên nghiệp và đề xuất cách chia việc công bằng.",
    en: "Use this when keeping a professional tone and suggesting a fair way to share work.",
  },
};

export const punjabiLearnerProofPackB2: PunjabiLearnerProofPackB2Item[] = punjabiExitTicketsB2.map(
  (ticket: PunjabiExitTicketB2) => {
    const proof = proofByFocus[ticket.exitFocus];

    return {
      id: ticket.id.replace("exit", "proof"),
      level: "B2",
      proofFocus: ticket.exitFocus,
      topic: ticket.topic,
      proofPrompt_gurmukhi: `${ticket.exitTicket_gurmukhi} ਆਪਣੇ ਜਵਾਬ ਨੂੰ ਇੱਕ final-owner-review ਵਾਕ ਨਾਲ ਸਾਫ਼ ਕਰੋ।`,
      proofPrompt_romanization: `${ticket.exitTicket_romanization} aapne javaab nu ikk final-owner-review vaak naal saaf karo.`,
      proofPrompt_vi: `${ticket.exitTicket_vi} Cuối câu trả lời, thêm một câu final-owner-review.`,
      proofPrompt_en: `${ticket.exitTicket_en} At the end of your answer, add one final-owner-review sentence.`,
      modelProof_gurmukhi: ticket.sampleExit_gurmukhi,
      modelProof_romanization: ticket.sampleExit_romanization,
      modelProof_vi: ticket.sampleExit_vi,
      modelProof_en: ticket.sampleExit_en,
      finalOwnerReview_vi: [
        "Lập luận có đủ stance không?",
        "Có một lý do cụ thể không?",
        "Có câu chốt cuối cùng không?",
      ],
      finalOwnerReview_en: [
        "Is the stance present?",
        "Is there one concrete reason?",
        "Is there a closing sentence?",
      ],
      finalQa_vi: ticket.finalProof_vi,
      finalQa_en: ticket.finalProof_en,
      learnerTrap_vi: `${ticket.learnerTrap_vi} ${proof.vi}`,
      learnerTrap_en: `${ticket.learnerTrap_en} ${proof.en}`,
      canadaPracticalExample_vi: ticket.canadaPracticalExample_vi,
      canadaPracticalExample_en: ticket.canadaPracticalExample_en,
      scriptAwareness_en: ticket.scriptAwareness_en,
      nativeReview: ticket.nativeReview,
    };
  },
);

export default punjabiLearnerProofPackB2;
