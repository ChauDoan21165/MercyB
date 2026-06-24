// Punjabi B2 audit-trail samples for stable upper-intermediate reasoning goals.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiB2TraceabilitySamples,
  type PunjabiB2TraceabilitySample,
  type PunjabiB2TraceabilitySamplesFocus,
  type PunjabiB2TraceabilitySamplesTopic,
} from "./b2TraceabilitySamples";

export type PunjabiB2AuditTrailSamplesFocus = PunjabiB2TraceabilitySamplesFocus;
export type PunjabiB2AuditTrailSamplesTopic = PunjabiB2TraceabilitySamplesTopic;

export type PunjabiB2AuditTrailStage =
  | "audit_trail"
  | "traceability_checked"
  | "evidence_receipt_checked"
  | "completion_record_checked"
  | "pre_integration_hold";

export type PunjabiB2AuditTrailSample = {
  id: string;
  level: "B2";
  auditTrailFocus: PunjabiB2AuditTrailSamplesFocus;
  auditTrailStage: PunjabiB2AuditTrailStage;
  topic: PunjabiB2AuditTrailSamplesTopic;
  auditTitle_gurmukhi: string;
  auditTitle_romanization: string;
  auditTitle_vi: string;
  auditTitle_en: string;
  prompt_gurmukhi: string;
  prompt_romanization: string;
  prompt_vi: string;
  prompt_en: string;
  auditAnswer_gurmukhi: string;
  auditAnswer_romanization: string;
  auditAnswer_vi: string;
  auditAnswer_en: string;
  goalLink_vi: string;
  goalLink_en: string;
  auditTrailChecks_vi: string[];
  auditTrailChecks_en: string[];
  traceabilityChecks_vi: string[];
  traceabilityChecks_en: string[];
  evidenceReceiptChecks_vi: string[];
  evidenceReceiptChecks_en: string[];
  preIntegrationChecks_vi: string[];
  preIntegrationChecks_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview: "deferred";
};

const stages: PunjabiB2AuditTrailStage[] = [
  "audit_trail",
  "traceability_checked",
  "evidence_receipt_checked",
  "completion_record_checked",
  "pre_integration_hold",
];

const auditByFocus: Record<
  PunjabiB2AuditTrailSamplesFocus,
  { g: string; r: string; vi: string; en: string; checksVi: string[]; checksEn: string[] }
> = {
  structured_opinion: {
    g: "Structured opinion audit trail",
    r: "Structured opinion audit trail",
    vi: "Audit trail cho structured opinion",
    en: "Structured opinion audit trail",
    checksVi: ["Audit giữ stance", "Audit giữ evidence link", "Audit giữ recommendation"],
    checksEn: ["Audit keeps the stance", "Audit keeps the evidence link", "Audit keeps the recommendation"],
  },
  evidence: {
    g: "Evidence audit trail",
    r: "Evidence audit trail",
    vi: "Audit trail cho evidence",
    en: "Evidence audit trail",
    checksVi: ["Audit giữ data", "Audit giữ claim link", "Audit giữ counterpoint"],
    checksEn: ["Audit keeps data", "Audit keeps the claim link", "Audit keeps the counterpoint"],
  },
  counterpoint: {
    g: "Counterpoint audit trail",
    r: "Counterpoint audit trail",
    vi: "Audit trail cho counterpoint",
    en: "Counterpoint audit trail",
    checksVi: ["Audit giữ acknowledgement", "Audit giữ limited objection", "Audit giữ settlement reason"],
    checksEn: ["Audit keeps acknowledgment", "Audit keeps the limited objection", "Audit keeps the settlement reason"],
  },
  tradeoff: {
    g: "Tradeoff audit trail",
    r: "Tradeoff audit trail",
    vi: "Audit trail cho tradeoff",
    en: "Tradeoff audit trail",
    checksVi: ["Audit giữ two options", "Audit giữ cost", "Audit giữ condition"],
    checksEn: ["Audit keeps two options", "Audit keeps cost", "Audit keeps the condition"],
  },
  recommendation: {
    g: "Recommendation audit trail",
    r: "Recommendation audit trail",
    vi: "Audit trail cho recommendation",
    en: "Recommendation audit trail",
    checksVi: ["Audit giữ advice", "Audit giữ condition", "Audit giữ first step"],
    checksEn: ["Audit keeps advice", "Audit keeps the condition", "Audit keeps the first step"],
  },
  settlement: {
    g: "Settlement audit trail",
    r: "Settlement audit trail",
    vi: "Audit trail cho settlement",
    en: "Settlement audit trail",
    checksVi: ["Audit giữ policy reason", "Audit giữ fair process", "Audit giữ next step"],
    checksEn: ["Audit keeps the policy reason", "Audit keeps fair process", "Audit keeps the next step"],
  },
};

const auditAnswerGurmukhi = (sample: PunjabiB2TraceabilitySample): string =>
  `Audit trail: ${sample.traceAnswer_gurmukhi}`;

const auditAnswerRomanization = (sample: PunjabiB2TraceabilitySample): string =>
  `Audit trail: ${sample.traceAnswer_romanization}`;

export const punjabiB2AuditTrailSamples: PunjabiB2AuditTrailSample[] =
  punjabiB2TraceabilitySamples.map((sample: PunjabiB2TraceabilitySample, index: number) => {
    const audit = auditByFocus[sample.traceabilityFocus];

    return {
      id: sample.id.replace("_traceability_", "_audit_trail_"),
      level: "B2",
      auditTrailFocus: sample.traceabilityFocus,
      auditTrailStage: stages[index % stages.length],
      topic: sample.topic,
      auditTitle_gurmukhi: `${audit.g} ਲਈ ${sample.traceTitle_gurmukhi}`,
      auditTitle_romanization: `${audit.r} lai ${sample.traceTitle_romanization}`,
      auditTitle_vi: `${audit.vi}: ${sample.traceTitle_vi}`,
      auditTitle_en: `${audit.en}: ${sample.traceTitle_en}`,
      prompt_gurmukhi: sample.prompt_gurmukhi,
      prompt_romanization: sample.prompt_romanization,
      prompt_vi: sample.prompt_vi,
      prompt_en: sample.prompt_en,
      auditAnswer_gurmukhi: auditAnswerGurmukhi(sample),
      auditAnswer_romanization: auditAnswerRomanization(sample),
      auditAnswer_vi: `Audit trail xác nhận B2 reasoning nối đúng goal: ${sample.traceAnswer_vi}`,
      auditAnswer_en: `Audit trail confirms the B2 reasoning links to the correct goal: ${sample.traceAnswer_en}`,
      goalLink_vi: sample.goalLink_vi,
      goalLink_en: sample.goalLink_en,
      auditTrailChecks_vi: [
        "Pre-A11 audit-trail giữ entry app-consumable.",
        ...audit.checksVi,
      ],
      auditTrailChecks_en: [
        "Pre-A11 audit-trail keeps the entry app-consumable.",
        ...audit.checksEn,
      ],
      traceabilityChecks_vi: sample.traceabilityChecks_vi,
      traceabilityChecks_en: sample.traceabilityChecks_en,
      evidenceReceiptChecks_vi: sample.evidenceReceiptChecks_vi,
      evidenceReceiptChecks_en: sample.evidenceReceiptChecks_en,
      preIntegrationChecks_vi: sample.preIntegrationChecks_vi,
      preIntegrationChecks_en: sample.preIntegrationChecks_en,
      learnerTrap_vi: `${sample.learnerTrap_vi} Audit trail trap: không đổi audit goal sau khi traceability đã fixed.`,
      learnerTrap_en: `${sample.learnerTrap_en} Audit trail trap: do not change the audit goal after traceability is fixed.`,
      canadaPracticalExample_vi: sample.canadaPracticalExample_vi,
      canadaPracticalExample_en: sample.canadaPracticalExample_en,
      scriptAwareness_en:
        sample.scriptAwareness_en ??
        "Shahmukhi awareness only; audit trail keeps Gurmukhi as the app-primary script.",
      nativeReview: "deferred",
    };
  });

export const punjabiB2AuditTrailSamplesAlias = punjabiB2AuditTrailSamples;

export default punjabiB2AuditTrailSamplesAlias;
