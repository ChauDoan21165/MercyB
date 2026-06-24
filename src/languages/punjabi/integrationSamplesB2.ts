// Punjabi B2 integration samples for later app wiring.
// These reshape committed B2 golden samples into compact integration fixtures.

import {
  punjabiGoldenSamplesB2,
  type PunjabiGoldenSampleB2,
  type PunjabiGoldenSampleB2Skill,
} from "./goldenSamplesB2";

export type PunjabiIntegrationSamplesB2Focus =
  | "structured_opinion"
  | "comparison"
  | "counterpoint"
  | "recommendation"
  | "workplace_fairness";

export type PunjabiIntegrationSamplesB2Topic =
  | "settlement"
  | "education"
  | "healthcare_access"
  | "housing"
  | "transport"
  | "public_service"
  | "work";

export type PunjabiIntegrationSampleB2 = {
  id: string;
  level: "B2";
  integrationFocus: PunjabiIntegrationSamplesB2Focus;
  topic: PunjabiIntegrationSamplesB2Topic;
  prompt_gurmukhi: string;
  prompt_romanization: string;
  prompt_vi: string;
  prompt_en: string;
  sampleResponse_gurmukhi: string;
  sampleResponse_romanization: string;
  sampleResponse_vi: string;
  sampleResponse_en: string;
  integrationSample_vi: string;
  integrationSample_en: string;
  finalEvidence_vi: string[];
  finalEvidence_en: string[];
  finalQa_vi: string[];
  finalQa_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const focusBySkill: Record<PunjabiGoldenSampleB2Skill, PunjabiIntegrationSamplesB2Focus> = {
  structured_opinion: "structured_opinion",
  comparison: "comparison",
  counterpoint: "counterpoint",
  recommendation: "recommendation",
  workplace_fairness: "workplace_fairness",
};

const topicForIntegration = (
  sample: PunjabiGoldenSampleB2,
): PunjabiIntegrationSamplesB2Topic =>
  sample.topic === "healthcare" ? "healthcare_access" : sample.topic;

const integrationUseByFocus: Record<
  PunjabiIntegrationSamplesB2Focus,
  { vi: string; en: string }
> = {
  structured_opinion: {
    vi: "Dùng để kiểm tra stance, lý do, counterpoint nhẹ và recommendation cuối.",
    en: "Use to check stance, reason, light counterpoint, and a final recommendation.",
  },
  comparison: {
    vi: "Dùng để kiểm tra two-side comparison với cost, time hoặc goal.",
    en: "Use to check two-sided comparison with cost, time, or goal.",
  },
  counterpoint: {
    vi: "Dùng để kiểm tra khả năng acknowledge rồi đưa exception hợp lý.",
    en: "Use to check the ability to acknowledge and then give a reasonable exception.",
  },
  recommendation: {
    vi: "Dùng để kiểm tra recommendation có điều kiện và không hứa quá mức.",
    en: "Use to check a conditional recommendation that does not overpromise.",
  },
  workplace_fairness: {
    vi: "Dùng để kiểm tra tone chuyên nghiệp, process rõ và fairness.",
    en: "Use to check professional tone, clear process, and fairness.",
  },
};

export const punjabiIntegrationSamplesB2: PunjabiIntegrationSampleB2[] =
  punjabiGoldenSamplesB2.map((sample) => {
    const integrationFocus = focusBySkill[sample.skill];
    const integrationUse = integrationUseByFocus[integrationFocus];

    return {
      id: sample.id.replace("golden", "integration"),
      level: "B2",
      integrationFocus,
      topic: topicForIntegration(sample),
      prompt_gurmukhi: sample.prompt_gurmukhi,
      prompt_romanization: sample.prompt_romanization,
      prompt_vi: sample.prompt_vi,
      prompt_en: sample.prompt_en,
      sampleResponse_gurmukhi: sample.goldenAnswer_gurmukhi,
      sampleResponse_romanization: sample.goldenAnswer_romanization,
      sampleResponse_vi: sample.goldenAnswer_vi,
      sampleResponse_en: sample.goldenAnswer_en,
      integrationSample_vi: integrationUse.vi,
      integrationSample_en: integrationUse.en,
      finalEvidence_vi: sample.finalQa_vi,
      finalEvidence_en: sample.finalQa_en,
      finalQa_vi: [
        "Có thể dùng trong later wiring?",
        "Giữ đúng B2 function?",
        "Có đủ evidence cuối?",
      ],
      finalQa_en: [
        "Usable in later wiring?",
        "Keeps the B2 function?",
        "Enough final evidence?",
      ],
      learnerTrap_vi: sample.learnerTraps_vi.join(" "),
      learnerTrap_en: sample.learnerTraps_en.join(" "),
      canadaPracticalExample_vi: sample.canadaPracticalExample_vi,
      canadaPracticalExample_en: sample.canadaPracticalExample_en,
      scriptAwareness_en: sample.scriptAwareness_en,
      nativeReview: sample.nativeReview,
    };
  });

export default punjabiIntegrationSamplesB2;
