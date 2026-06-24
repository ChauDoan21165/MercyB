// Punjabi B2 receipt samples for stable upper-intermediate reasoning.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiB2LedgerSamples,
  type PunjabiB2LedgerSamplesFocus,
  type PunjabiB2LedgerSamplesTopic,
} from "./b2LedgerSamples";

export type PunjabiB2ReceiptSamplesFocus = PunjabiB2LedgerSamplesFocus;
export type PunjabiB2ReceiptSamplesTopic = PunjabiB2LedgerSamplesTopic;

export type PunjabiB2ReceiptStyle =
  | "pre_a11_receipt"
  | "archive_copy"
  | "signoff"
  | "pre_merge"
  | "qa"
  | "pre_integration"
  | "readiness_check";

export type PunjabiB2ReceiptSample = {
  id: string;
  level: "B2";
  receiptFocus: PunjabiB2ReceiptSamplesFocus;
  style: PunjabiB2ReceiptStyle;
  topic: PunjabiB2ReceiptSamplesTopic;
  receiptPrompt_gurmukhi: string;
  receiptPrompt_romanization: string;
  receiptPrompt_vi: string;
  receiptPrompt_en: string;
  receiptAnswer_gurmukhi: string;
  receiptAnswer_romanization: string;
  receiptAnswer_vi: string;
  receiptAnswer_en: string;
  preA11Receipt_vi: string[];
  preA11Receipt_en: string[];
  ledgerChecks_vi: string[];
  ledgerChecks_en: string[];
  archiveChecks_vi: string[];
  archiveChecks_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const styleByIndex: PunjabiB2ReceiptStyle[] = [
  "pre_a11_receipt",
  "archive_copy",
  "signoff",
  "pre_merge",
  "qa",
  "pre_integration",
  "readiness_check",
];

const replaceLedgerWithReceipt = (value: string) =>
  value.replace(/ledger/gi, "receipt").replace(/Ledger/g, "Receipt");

export const punjabiB2ReceiptSamples: PunjabiB2ReceiptSample[] = punjabiB2LedgerSamples.map(
  (item, index) => ({
    id: item.id.replace("ledger", "receipt"),
    level: "B2",
    receiptFocus: item.ledgerFocus,
    style: styleByIndex[index % styleByIndex.length],
    topic: item.topic,
    receiptPrompt_gurmukhi: replaceLedgerWithReceipt(item.ledgerPrompt_gurmukhi),
    receiptPrompt_romanization: replaceLedgerWithReceipt(item.ledgerPrompt_romanization),
    receiptPrompt_vi: replaceLedgerWithReceipt(item.ledgerPrompt_vi),
    receiptPrompt_en: replaceLedgerWithReceipt(item.ledgerPrompt_en),
    receiptAnswer_gurmukhi: replaceLedgerWithReceipt(item.ledgerAnswer_gurmukhi),
    receiptAnswer_romanization: replaceLedgerWithReceipt(item.ledgerAnswer_romanization),
    receiptAnswer_vi: replaceLedgerWithReceipt(item.ledgerAnswer_vi),
    receiptAnswer_en: replaceLedgerWithReceipt(item.ledgerAnswer_en),
    preA11Receipt_vi: item.preA11Ledger_vi.map(replaceLedgerWithReceipt),
    preA11Receipt_en: item.preA11Ledger_en.map(replaceLedgerWithReceipt),
    ledgerChecks_vi: item.preA11Ledger_vi,
    ledgerChecks_en: item.preA11Ledger_en,
    archiveChecks_vi: item.archiveChecks_vi,
    archiveChecks_en: item.archiveChecks_en,
    preIntegration_vi: item.preIntegration_vi,
    preIntegration_en: item.preIntegration_en,
    learnerTrap_vi: replaceLedgerWithReceipt(item.learnerTrap_vi),
    learnerTrap_en: replaceLedgerWithReceipt(item.learnerTrap_en),
    canadaPracticalExample_vi: item.canadaPracticalExample_vi,
    canadaPracticalExample_en: item.canadaPracticalExample_en,
    scriptAwareness_en: item.scriptAwareness_en,
    nativeReview: item.nativeReview,
  }),
);

export const punjabiB2ReceiptSamplesAlias = punjabiB2ReceiptSamples;

export default punjabiB2ReceiptSamplesAlias;

