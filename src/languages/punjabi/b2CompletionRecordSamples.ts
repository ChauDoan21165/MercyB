// Punjabi B2 completion-record samples for stable upper-intermediate reasoning.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiB2InventorySealSamples,
  type PunjabiB2InventorySealSample,
  type PunjabiB2InventorySealSamplesFocus,
  type PunjabiB2InventorySealSamplesTopic,
} from "./b2InventorySealSamples";

export type PunjabiB2CompletionRecordSamplesFocus = PunjabiB2InventorySealSamplesFocus;
export type PunjabiB2CompletionRecordSamplesTopic = PunjabiB2InventorySealSamplesTopic;

export type PunjabiB2CompletionRecordStatus =
  | "completion_record"
  | "inventory_seal_verified"
  | "catalog_verified"
  | "bundle_verified"
  | "pre_integration_ready";

export type PunjabiB2CompletionRecordSample = {
  id: string;
  level: "B2";
  completionFocus: PunjabiB2CompletionRecordSamplesFocus;
  completionStatus: PunjabiB2CompletionRecordStatus;
  topic: PunjabiB2CompletionRecordSamplesTopic;
  recordTitle_gurmukhi: string;
  recordTitle_romanization: string;
  recordTitle_vi: string;
  recordTitle_en: string;
  prompt_gurmukhi: string;
  prompt_romanization: string;
  prompt_vi: string;
  prompt_en: string;
  completionAnswer_gurmukhi: string;
  completionAnswer_romanization: string;
  completionAnswer_vi: string;
  completionAnswer_en: string;
  completionRecordChecks_vi: string[];
  completionRecordChecks_en: string[];
  inventorySealChecks_vi: string[];
  inventorySealChecks_en: string[];
  catalogChecks_vi: string[];
  catalogChecks_en: string[];
  preIntegrationChecks_vi: string[];
  preIntegrationChecks_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview: "deferred";
};

const statuses: PunjabiB2CompletionRecordStatus[] = [
  "completion_record",
  "inventory_seal_verified",
  "catalog_verified",
  "bundle_verified",
  "pre_integration_ready",
];

const completionByFocus: Record<
  PunjabiB2CompletionRecordSamplesFocus,
  { g: string; r: string; vi: string; en: string; checksVi: string[]; checksEn: string[] }
> = {
  structured_opinion: {
    g: "Structured opinion completion record",
    r: "Structured opinion completion record",
    vi: "Completion record cho structured opinion",
    en: "Structured opinion completion record",
    checksVi: ["Completion giữ opinion", "Completion giữ reason", "Completion giữ action step"],
    checksEn: ["Completion keeps the opinion", "Completion keeps the reason", "Completion keeps the action step"],
  },
  evidence: {
    g: "Evidence completion record",
    r: "Evidence completion record",
    vi: "Completion record cho evidence",
    en: "Evidence completion record",
    checksVi: ["Completion giữ data point", "Completion giữ measured wording", "Completion giữ source-like context"],
    checksEn: ["Completion keeps the data point", "Completion keeps measured wording", "Completion keeps source-like context"],
  },
  counterpoint: {
    g: "Counterpoint completion record",
    r: "Counterpoint completion record",
    vi: "Completion record cho counterpoint",
    en: "Counterpoint completion record",
    checksVi: ["Completion giữ acknowledgement", "Completion giữ objection limited", "Completion giữ respectful settlement"],
    checksEn: ["Completion keeps acknowledgment", "Completion keeps the objection limited", "Completion keeps respectful settlement"],
  },
  tradeoff: {
    g: "Tradeoff completion record",
    r: "Tradeoff completion record",
    vi: "Completion record cho tradeoff",
    en: "Tradeoff completion record",
    checksVi: ["Completion giữ two choices", "Completion giữ cost", "Completion giữ condition"],
    checksEn: ["Completion keeps two choices", "Completion keeps cost", "Completion keeps the condition"],
  },
  recommendation: {
    g: "Recommendation completion record",
    r: "Recommendation completion record",
    vi: "Completion record cho recommendation",
    en: "Recommendation completion record",
    checksVi: ["Completion giữ advice", "Completion giữ condition", "Completion giữ first check"],
    checksEn: ["Completion keeps advice", "Completion keeps the condition", "Completion keeps the first check"],
  },
  settlement: {
    g: "Settlement completion record",
    r: "Settlement completion record",
    vi: "Completion record cho settlement",
    en: "Settlement completion record",
    checksVi: ["Completion giữ fair process", "Completion giữ deadline", "Completion giữ next step"],
    checksEn: ["Completion keeps fair process", "Completion keeps the deadline", "Completion keeps the next step"],
  },
};

const completedGurmukhi = (sample: PunjabiB2InventorySealSample): string =>
  `Completion record: ${sample.sealedAnswer_gurmukhi}`;

const completedRomanization = (sample: PunjabiB2InventorySealSample): string =>
  `Completion record: ${sample.sealedAnswer_romanization}`;

export const punjabiB2CompletionRecordSamples: PunjabiB2CompletionRecordSample[] =
  punjabiB2InventorySealSamples.map((sample, index) => {
    const completion = completionByFocus[sample.inventorySealFocus];

    return {
      id: sample.id.replace("_inventory_seal_", "_completion_record_"),
      level: "B2",
      completionFocus: sample.inventorySealFocus,
      completionStatus: statuses[index % statuses.length],
      topic: sample.topic,
      recordTitle_gurmukhi: `${completion.g} ਲਈ ${sample.sealTitle_gurmukhi}`,
      recordTitle_romanization: `${completion.r} lai ${sample.sealTitle_romanization}`,
      recordTitle_vi: `${completion.vi}: ${sample.sealTitle_vi}`,
      recordTitle_en: `${completion.en}: ${sample.sealTitle_en}`,
      prompt_gurmukhi: sample.prompt_gurmukhi,
      prompt_romanization: sample.prompt_romanization,
      prompt_vi: sample.prompt_vi,
      prompt_en: sample.prompt_en,
      completionAnswer_gurmukhi: completedGurmukhi(sample),
      completionAnswer_romanization: completedRomanization(sample),
      completionAnswer_vi: `Completion record xác nhận B2 reasoning đã ổn định: ${sample.sealedAnswer_vi}`,
      completionAnswer_en: `Completion record confirms stable B2 reasoning: ${sample.sealedAnswer_en}`,
      completionRecordChecks_vi: [
        "Pre-A11 completion-record giữ entry app-consumable.",
        ...completion.checksVi,
      ],
      completionRecordChecks_en: [
        "Pre-A11 completion-record keeps the entry app-consumable.",
        ...completion.checksEn,
      ],
      inventorySealChecks_vi: sample.inventorySealChecks_vi,
      inventorySealChecks_en: sample.inventorySealChecks_en,
      catalogChecks_vi: sample.catalogChecks_vi,
      catalogChecks_en: sample.catalogChecks_en,
      preIntegrationChecks_vi: sample.preIntegrationChecks_vi,
      preIntegrationChecks_en: sample.preIntegrationChecks_en,
      learnerTrap_vi: `${sample.learnerTrap_vi} Completion trap: không gọi đây là integration stage; chỉ record content đã stable.`,
      learnerTrap_en: `${sample.learnerTrap_en} Completion trap: do not call this an integration stage; only record stable content.`,
      canadaPracticalExample_vi: sample.canadaPracticalExample_vi,
      canadaPracticalExample_en: sample.canadaPracticalExample_en,
      scriptAwareness_en:
        sample.scriptAwareness_en ??
        "Shahmukhi awareness only; completion records keep Gurmukhi as the app-primary script.",
      nativeReview: "deferred",
    };
  });

export const punjabiB2CompletionRecordSamplesAlias = punjabiB2CompletionRecordSamples;

export default punjabiB2CompletionRecordSamplesAlias;
