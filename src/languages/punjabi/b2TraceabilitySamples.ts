// Punjabi B2 traceability samples for stable upper-intermediate reasoning goals.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiB2EvidenceReceiptSamples,
  type PunjabiB2EvidenceReceiptSample,
  type PunjabiB2EvidenceReceiptSamplesFocus,
  type PunjabiB2EvidenceReceiptSamplesTopic,
} from "./b2EvidenceReceiptSamples";

export type PunjabiB2TraceabilitySamplesFocus = PunjabiB2EvidenceReceiptSamplesFocus;
export type PunjabiB2TraceabilitySamplesTopic = PunjabiB2EvidenceReceiptSamplesTopic;

export type PunjabiB2TraceabilityGoal =
  | "goal_opinion"
  | "goal_evidence"
  | "goal_counterpoint"
  | "goal_tradeoff"
  | "goal_recommendation"
  | "goal_settlement";

export type PunjabiB2TraceabilitySample = {
  id: string;
  level: "B2";
  traceabilityFocus: PunjabiB2TraceabilitySamplesFocus;
  traceabilityGoal: PunjabiB2TraceabilityGoal;
  topic: PunjabiB2TraceabilitySamplesTopic;
  traceTitle_gurmukhi: string;
  traceTitle_romanization: string;
  traceTitle_vi: string;
  traceTitle_en: string;
  prompt_gurmukhi: string;
  prompt_romanization: string;
  prompt_vi: string;
  prompt_en: string;
  traceAnswer_gurmukhi: string;
  traceAnswer_romanization: string;
  traceAnswer_vi: string;
  traceAnswer_en: string;
  goalLink_vi: string;
  goalLink_en: string;
  traceabilityChecks_vi: string[];
  traceabilityChecks_en: string[];
  evidenceReceiptChecks_vi: string[];
  evidenceReceiptChecks_en: string[];
  completionRecordChecks_vi: string[];
  completionRecordChecks_en: string[];
  preIntegrationChecks_vi: string[];
  preIntegrationChecks_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview: "deferred";
};

const goalByFocus: Record<PunjabiB2TraceabilitySamplesFocus, PunjabiB2TraceabilityGoal> = {
  structured_opinion: "goal_opinion",
  evidence: "goal_evidence",
  counterpoint: "goal_counterpoint",
  tradeoff: "goal_tradeoff",
  recommendation: "goal_recommendation",
  settlement: "goal_settlement",
};

const traceByGoal: Record<
  PunjabiB2TraceabilityGoal,
  { g: string; r: string; vi: string; en: string; checksVi: string[]; checksEn: string[] }
> = {
  goal_opinion: {
    g: "Structured opinion goal trace",
    r: "Structured opinion goal trace",
    vi: "Trace goal cho structured opinion",
    en: "Structured opinion goal trace",
    checksVi: ["Trace nối stance với goal", "Trace giữ evidence", "Trace giữ recommendation"],
    checksEn: ["Trace links stance to the goal", "Trace keeps evidence", "Trace keeps the recommendation"],
  },
  goal_evidence: {
    g: "Evidence goal trace",
    r: "Evidence goal trace",
    vi: "Trace goal cho evidence",
    en: "Evidence goal trace",
    checksVi: ["Trace nối data với claim", "Trace giữ measured detail", "Trace giữ counterpoint"],
    checksEn: ["Trace links data to the claim", "Trace keeps measured detail", "Trace keeps the counterpoint"],
  },
  goal_counterpoint: {
    g: "Counterpoint goal trace",
    r: "Counterpoint goal trace",
    vi: "Trace goal cho counterpoint",
    en: "Counterpoint goal trace",
    checksVi: ["Trace nối acknowledgement với settlement", "Trace giữ limited objection", "Trace giữ respectful tone"],
    checksEn: ["Trace links acknowledgment to settlement", "Trace keeps the limited objection", "Trace keeps respectful tone"],
  },
  goal_tradeoff: {
    g: "Tradeoff goal trace",
    r: "Tradeoff goal trace",
    vi: "Trace goal cho tradeoff",
    en: "Tradeoff goal trace",
    checksVi: ["Trace nối option A/B", "Trace giữ cost", "Trace giữ condition"],
    checksEn: ["Trace links option A/B", "Trace keeps cost", "Trace keeps the condition"],
  },
  goal_recommendation: {
    g: "Recommendation goal trace",
    r: "Recommendation goal trace",
    vi: "Trace goal cho recommendation",
    en: "Recommendation goal trace",
    checksVi: ["Trace nối advice với reason", "Trace giữ condition", "Trace giữ first step"],
    checksEn: ["Trace links advice to reason", "Trace keeps the condition", "Trace keeps the first step"],
  },
  goal_settlement: {
    g: "Settlement goal trace",
    r: "Settlement goal trace",
    vi: "Trace goal cho settlement",
    en: "Settlement goal trace",
    checksVi: ["Trace nối policy với fair process", "Trace giữ deadline", "Trace giữ next step"],
    checksEn: ["Trace links policy to fair process", "Trace keeps the deadline", "Trace keeps the next step"],
  },
};

const traceAnswerGurmukhi = (sample: PunjabiB2EvidenceReceiptSample): string =>
  `Traceability: ${sample.receiptAnswer_gurmukhi}`;

const traceAnswerRomanization = (sample: PunjabiB2EvidenceReceiptSample): string =>
  `Traceability: ${sample.receiptAnswer_romanization}`;

export const punjabiB2TraceabilitySamples: PunjabiB2TraceabilitySample[] =
  punjabiB2EvidenceReceiptSamples.map((sample) => {
    const goal = goalByFocus[sample.evidenceReceiptFocus];
    const trace = traceByGoal[goal];

    return {
      id: sample.id.replace("_evidence_receipt_", "_traceability_"),
      level: "B2",
      traceabilityFocus: sample.evidenceReceiptFocus,
      traceabilityGoal: goal,
      topic: sample.topic,
      traceTitle_gurmukhi: `${trace.g} ਲਈ ${sample.receiptTitle_gurmukhi}`,
      traceTitle_romanization: `${trace.r} lai ${sample.receiptTitle_romanization}`,
      traceTitle_vi: `${trace.vi}: ${sample.receiptTitle_vi}`,
      traceTitle_en: `${trace.en}: ${sample.receiptTitle_en}`,
      prompt_gurmukhi: sample.prompt_gurmukhi,
      prompt_romanization: sample.prompt_romanization,
      prompt_vi: sample.prompt_vi,
      prompt_en: sample.prompt_en,
      traceAnswer_gurmukhi: traceAnswerGurmukhi(sample),
      traceAnswer_romanization: traceAnswerRomanization(sample),
      traceAnswer_vi: `Traceability nối B2 reasoning với goal: ${sample.receiptAnswer_vi}`,
      traceAnswer_en: `Traceability links B2 reasoning to the goal: ${sample.receiptAnswer_en}`,
      goalLink_vi: `Goal ${goal} được nối với topic ${sample.topic} và focus ${sample.evidenceReceiptFocus}.`,
      goalLink_en: `Goal ${goal} links to topic ${sample.topic} and focus ${sample.evidenceReceiptFocus}.`,
      traceabilityChecks_vi: [
        "Pre-A11 traceability giữ entry app-consumable.",
        ...trace.checksVi,
      ],
      traceabilityChecks_en: [
        "Pre-A11 traceability keeps the entry app-consumable.",
        ...trace.checksEn,
      ],
      evidenceReceiptChecks_vi: sample.evidenceReceiptChecks_vi,
      evidenceReceiptChecks_en: sample.evidenceReceiptChecks_en,
      completionRecordChecks_vi: sample.completionRecordChecks_vi,
      completionRecordChecks_en: sample.completionRecordChecks_en,
      preIntegrationChecks_vi: sample.preIntegrationChecks_vi,
      preIntegrationChecks_en: sample.preIntegrationChecks_en,
      learnerTrap_vi: `${sample.learnerTrap_vi} Traceability trap: không đổi goal sau khi evidence receipt đã cố định.`,
      learnerTrap_en: `${sample.learnerTrap_en} Traceability trap: do not change the goal after the evidence receipt is fixed.`,
      canadaPracticalExample_vi: sample.canadaPracticalExample_vi,
      canadaPracticalExample_en: sample.canadaPracticalExample_en,
      scriptAwareness_en:
        sample.scriptAwareness_en ??
        "Shahmukhi awareness only; traceability keeps Gurmukhi as the app-primary script.",
      nativeReview: "deferred",
    };
  });

export const punjabiB2TraceabilitySamplesAlias = punjabiB2TraceabilitySamples;

export default punjabiB2TraceabilitySamplesAlias;
