// Punjabi B2 evidence-receipt samples for stable upper-intermediate reasoning.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiB2CompletionRecordSamples,
  type PunjabiB2CompletionRecordSample,
  type PunjabiB2CompletionRecordSamplesFocus,
  type PunjabiB2CompletionRecordSamplesTopic,
} from "./b2CompletionRecordSamples";

export type PunjabiB2EvidenceReceiptSamplesFocus = PunjabiB2CompletionRecordSamplesFocus;
export type PunjabiB2EvidenceReceiptSamplesTopic = PunjabiB2CompletionRecordSamplesTopic;

export type PunjabiB2EvidenceReceiptStatus =
  | "evidence_receipt"
  | "completion_record_checked"
  | "inventory_seal_checked"
  | "catalog_chain_checked"
  | "pre_integration_hold";

export type PunjabiB2EvidenceReceiptSample = {
  id: string;
  level: "B2";
  evidenceReceiptFocus: PunjabiB2EvidenceReceiptSamplesFocus;
  evidenceReceiptStatus: PunjabiB2EvidenceReceiptStatus;
  topic: PunjabiB2EvidenceReceiptSamplesTopic;
  receiptTitle_gurmukhi: string;
  receiptTitle_romanization: string;
  receiptTitle_vi: string;
  receiptTitle_en: string;
  prompt_gurmukhi: string;
  prompt_romanization: string;
  prompt_vi: string;
  prompt_en: string;
  receiptAnswer_gurmukhi: string;
  receiptAnswer_romanization: string;
  receiptAnswer_vi: string;
  receiptAnswer_en: string;
  evidenceReceiptChecks_vi: string[];
  evidenceReceiptChecks_en: string[];
  completionRecordChecks_vi: string[];
  completionRecordChecks_en: string[];
  inventorySealChecks_vi: string[];
  inventorySealChecks_en: string[];
  preIntegrationChecks_vi: string[];
  preIntegrationChecks_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview: "deferred";
};

const statuses: PunjabiB2EvidenceReceiptStatus[] = [
  "evidence_receipt",
  "completion_record_checked",
  "inventory_seal_checked",
  "catalog_chain_checked",
  "pre_integration_hold",
];

const receiptByFocus: Record<
  PunjabiB2EvidenceReceiptSamplesFocus,
  { g: string; r: string; vi: string; en: string; checksVi: string[]; checksEn: string[] }
> = {
  structured_opinion: {
    g: "Structured opinion evidence receipt",
    r: "Structured opinion evidence receipt",
    vi: "Evidence receipt cho structured opinion",
    en: "Structured opinion evidence receipt",
    checksVi: ["Receipt giữ stance", "Receipt giữ reason evidence", "Receipt giữ action step"],
    checksEn: ["Receipt keeps the stance", "Receipt keeps reason evidence", "Receipt keeps the action step"],
  },
  evidence: {
    g: "Evidence detail receipt",
    r: "Evidence detail receipt",
    vi: "Evidence receipt cho detail",
    en: "Evidence detail receipt",
    checksVi: ["Receipt giữ data", "Receipt giữ measured claim", "Receipt giữ counterpoint evidence"],
    checksEn: ["Receipt keeps data", "Receipt keeps the measured claim", "Receipt keeps counterpoint evidence"],
  },
  counterpoint: {
    g: "Counterpoint evidence receipt",
    r: "Counterpoint evidence receipt",
    vi: "Evidence receipt cho counterpoint",
    en: "Counterpoint evidence receipt",
    checksVi: ["Receipt giữ acknowledgement", "Receipt giữ exception evidence", "Receipt giữ settlement reason"],
    checksEn: ["Receipt keeps acknowledgment", "Receipt keeps exception evidence", "Receipt keeps the settlement reason"],
  },
  tradeoff: {
    g: "Tradeoff evidence receipt",
    r: "Tradeoff evidence receipt",
    vi: "Evidence receipt cho tradeoff",
    en: "Tradeoff evidence receipt",
    checksVi: ["Receipt giữ option evidence", "Receipt giữ cost evidence", "Receipt giữ condition"],
    checksEn: ["Receipt keeps option evidence", "Receipt keeps cost evidence", "Receipt keeps the condition"],
  },
  recommendation: {
    g: "Recommendation evidence receipt",
    r: "Recommendation evidence receipt",
    vi: "Evidence receipt cho recommendation",
    en: "Recommendation evidence receipt",
    checksVi: ["Receipt giữ advice reason", "Receipt giữ condition evidence", "Receipt giữ first check"],
    checksEn: ["Receipt keeps advice reason", "Receipt keeps condition evidence", "Receipt keeps the first check"],
  },
  settlement: {
    g: "Settlement evidence receipt",
    r: "Settlement evidence receipt",
    vi: "Evidence receipt cho settlement",
    en: "Settlement evidence receipt",
    checksVi: ["Receipt giữ policy reason", "Receipt giữ deadline evidence", "Receipt giữ next step"],
    checksEn: ["Receipt keeps the policy reason", "Receipt keeps deadline evidence", "Receipt keeps the next step"],
  },
};

const receiptGurmukhi = (sample: PunjabiB2CompletionRecordSample): string =>
  `Evidence receipt: ${sample.completionAnswer_gurmukhi}`;

const receiptRomanization = (sample: PunjabiB2CompletionRecordSample): string =>
  `Evidence receipt: ${sample.completionAnswer_romanization}`;

export const punjabiB2EvidenceReceiptSamples: PunjabiB2EvidenceReceiptSample[] =
  punjabiB2CompletionRecordSamples.map((sample, index) => {
    const receipt = receiptByFocus[sample.completionFocus];

    return {
      id: sample.id.replace("_completion_record_", "_evidence_receipt_"),
      level: "B2",
      evidenceReceiptFocus: sample.completionFocus,
      evidenceReceiptStatus: statuses[index % statuses.length],
      topic: sample.topic,
      receiptTitle_gurmukhi: `${receipt.g} ਲਈ ${sample.recordTitle_gurmukhi}`,
      receiptTitle_romanization: `${receipt.r} lai ${sample.recordTitle_romanization}`,
      receiptTitle_vi: `${receipt.vi}: ${sample.recordTitle_vi}`,
      receiptTitle_en: `${receipt.en}: ${sample.recordTitle_en}`,
      prompt_gurmukhi: sample.prompt_gurmukhi,
      prompt_romanization: sample.prompt_romanization,
      prompt_vi: sample.prompt_vi,
      prompt_en: sample.prompt_en,
      receiptAnswer_gurmukhi: receiptGurmukhi(sample),
      receiptAnswer_romanization: receiptRomanization(sample),
      receiptAnswer_vi: `Evidence receipt xác nhận B2 evidence đã ổn định: ${sample.completionAnswer_vi}`,
      receiptAnswer_en: `Evidence receipt confirms stable B2 evidence: ${sample.completionAnswer_en}`,
      evidenceReceiptChecks_vi: [
        "Pre-A11 evidence-receipt giữ entry app-consumable.",
        ...receipt.checksVi,
      ],
      evidenceReceiptChecks_en: [
        "Pre-A11 evidence-receipt keeps the entry app-consumable.",
        ...receipt.checksEn,
      ],
      completionRecordChecks_vi: sample.completionRecordChecks_vi,
      completionRecordChecks_en: sample.completionRecordChecks_en,
      inventorySealChecks_vi: sample.inventorySealChecks_vi,
      inventorySealChecks_en: sample.inventorySealChecks_en,
      preIntegrationChecks_vi: sample.preIntegrationChecks_vi,
      preIntegrationChecks_en: sample.preIntegrationChecks_en,
      learnerTrap_vi: `${sample.learnerTrap_vi} Evidence receipt trap: không thêm claim mới sau khi receipt đã lock evidence.`,
      learnerTrap_en: `${sample.learnerTrap_en} Evidence receipt trap: do not add a new claim after the receipt has locked evidence.`,
      canadaPracticalExample_vi: sample.canadaPracticalExample_vi,
      canadaPracticalExample_en: sample.canadaPracticalExample_en,
      scriptAwareness_en:
        sample.scriptAwareness_en ??
        "Shahmukhi awareness only; evidence receipts keep Gurmukhi as the app-primary script.",
      nativeReview: "deferred",
    };
  });

export const punjabiB2EvidenceReceiptSamplesAlias = punjabiB2EvidenceReceiptSamples;

export default punjabiB2EvidenceReceiptSamplesAlias;
