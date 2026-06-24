// Punjabi B2 exit tickets for end-of-task checks.
// Gurmukhi is primary; romanization bridges Vietnamese- and English-speaking learners.

import {
  punjabiSmokeDeckB2,
  type PunjabiSmokeDeckB2Card,
  type PunjabiSmokeDeckB2Focus,
  type PunjabiSmokeDeckB2Topic,
} from "./smokeDeckB2";

export type PunjabiExitTicketsB2Focus =
  | "structured_opinion"
  | "comparison"
  | "counterpoint"
  | "recommendation"
  | "workplace_fairness";

export type PunjabiExitTicketsB2Topic = PunjabiSmokeDeckB2Topic;

export type PunjabiExitTicketB2 = {
  id: string;
  level: "B2";
  exitFocus: PunjabiExitTicketsB2Focus;
  topic: PunjabiExitTicketsB2Topic;
  exitTicket_gurmukhi: string;
  exitTicket_romanization: string;
  exitTicket_vi: string;
  exitTicket_en: string;
  sampleExit_gurmukhi: string;
  sampleExit_romanization: string;
  sampleExit_vi: string;
  sampleExit_en: string;
  finalProof_vi: string[];
  finalProof_en: string[];
  finalQa_vi: string[];
  finalQa_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const exitFocusBySmokeFocus: Record<PunjabiSmokeDeckB2Focus, PunjabiExitTicketsB2Focus> = {
  opinion: "structured_opinion",
  comparison: "comparison",
  counterpoint: "counterpoint",
  recommendation: "recommendation",
  workplace_fairness: "workplace_fairness",
};

const proofQaByFocus: Record<
  PunjabiExitTicketsB2Focus,
  { vi: string[]; en: string[] }
> = {
  structured_opinion: {
    vi: ["Stance rõ?", "Lý do đủ cụ thể?", "Có consequence hoặc recommendation?"],
    en: ["Clear stance?", "Specific enough reason?", "Consequence or recommendation included?"],
  },
  comparison: {
    vi: ["So sánh hai option?", "Có tradeoff?", "Có condition?"],
    en: ["Compares two options?", "Tradeoff included?", "Condition included?"],
  },
  counterpoint: {
    vi: ["Acknowledge trước?", "Counterpoint hợp lý?", "Tránh always/never?"],
    en: ["Acknowledges first?", "Reasonable counterpoint?", "Avoids always/never?"],
  },
  recommendation: {
    vi: ["Recommendation rõ?", "Có điều kiện?", "Không hứa quá mức?"],
    en: ["Clear recommendation?", "Condition included?", "Does not overpromise?"],
  },
  workplace_fairness: {
    vi: ["Tone professional?", "Process cụ thể?", "Không blame cá nhân?"],
    en: ["Professional tone?", "Concrete process?", "No personal blame?"],
  },
};

const exitInstruction = (
  card: PunjabiSmokeDeckB2Card,
): Pick<
  PunjabiExitTicketB2,
  "exitTicket_gurmukhi" | "exitTicket_romanization" | "exitTicket_vi" | "exitTicket_en"
> => ({
  exitTicket_gurmukhi: `${card.task_gurmukhi} ਅੰਤ ਵਿੱਚ ਇੱਕ ਸਬੂਤ ਵਾਲਾ ਵਾਕ ਜੋੜੋ।`,
  exitTicket_romanization: `${card.task_romanization} ant vich ikk sabuut vaalaa vaak jorro.`,
  exitTicket_vi: `${card.task_vi} Cuối câu trả lời, thêm một câu chứng minh bạn đã đạt B2 function.`,
  exitTicket_en: `${card.task_en} At the end, add one sentence proving you met the B2 function.`,
});

export const punjabiExitTicketsB2: PunjabiExitTicketB2[] = punjabiSmokeDeckB2.map((card) => {
  const exitFocus = exitFocusBySmokeFocus[card.focus];
  const finalQa = proofQaByFocus[exitFocus];

  return {
    id: card.id.replace("smoke", "exit"),
    level: "B2",
    exitFocus,
    topic: card.topic,
    ...exitInstruction(card),
    sampleExit_gurmukhi: card.modelMove_gurmukhi,
    sampleExit_romanization: card.modelMove_romanization,
    sampleExit_vi: card.modelMove_vi,
    sampleExit_en: card.modelMove_en,
    finalProof_vi: card.smokeCheck_vi,
    finalProof_en: card.smokeCheck_en,
    finalQa_vi: finalQa.vi,
    finalQa_en: finalQa.en,
    learnerTrap_vi: card.learnerTrap_vi,
    learnerTrap_en: card.learnerTrap_en,
    canadaPracticalExample_vi: card.canadaPracticalExample_vi,
    canadaPracticalExample_en: card.canadaPracticalExample_en,
    scriptAwareness_en: card.scriptAwareness_en,
    nativeReview: card.nativeReview,
  };
});

export default punjabiExitTicketsB2;
