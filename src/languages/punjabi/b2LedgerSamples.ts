// Punjabi B2 ledger samples for stable upper-intermediate reasoning.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiB2SealSamples,
  type PunjabiB2SealSample,
  type PunjabiB2SealSamplesFocus,
  type PunjabiB2SealSamplesTopic,
} from "./b2SealSamples";

export type PunjabiB2LedgerSamplesFocus = PunjabiB2SealSamplesFocus;
export type PunjabiB2LedgerSamplesTopic = PunjabiB2SealSamplesTopic;

export type PunjabiB2LedgerStyle =
  | "pre_a11_ledger"
  | "archive_copy"
  | "signoff"
  | "pre_merge"
  | "qa"
  | "pre_integration"
  | "readiness_check";

export type PunjabiB2LedgerSample = {
  id: string;
  level: "B2";
  ledgerFocus: PunjabiB2LedgerSamplesFocus;
  style: PunjabiB2LedgerStyle;
  topic: PunjabiB2LedgerSamplesTopic;
  ledgerPrompt_gurmukhi: string;
  ledgerPrompt_romanization: string;
  ledgerPrompt_vi: string;
  ledgerPrompt_en: string;
  ledgerAnswer_gurmukhi: string;
  ledgerAnswer_romanization: string;
  ledgerAnswer_vi: string;
  ledgerAnswer_en: string;
  preA11Ledger_vi: string[];
  preA11Ledger_en: string[];
  archiveChecks_vi: string[];
  archiveChecks_en: string[];
  signoffChecks_vi: string[];
  signoffChecks_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const styleByIndex: PunjabiB2LedgerStyle[] = [
  "pre_a11_ledger",
  "archive_copy",
  "signoff",
  "pre_merge",
  "qa",
  "pre_integration",
  "readiness_check",
];

const ledgerAnswerByFocus: Record<
  PunjabiB2LedgerSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "Ledger sample stable ਹੈ ਜਦੋਂ public-service opinion ਵਿੱਚ stance, evidence ਅਤੇ next step ledger ਤੋਂ ਬਾਅਦ ਵੀ ਇਕੋ ਰਹਿੰਦੇ ਹਨ।",
    r: "Ledger sample stable hai jadon public-service opinion vich stance, evidence ate next step ledger ton baad vii ikko rahinde han.",
    vi: "Sample ledger ổn định khi opinion dịch vụ công giữ stance, evidence và next step sau ledger.",
    en: "A ledger sample is stable when the public-service opinion keeps stance, evidence, and next step after the ledger.",
  },
  comparison: {
    g: "Ledger comparison rent, commute, utilities ਅਤੇ transit reliability ਨੂੰ ਇਕੱਠੇ ਰੱਖਦਾ ਹੈ, ਇਸ ਲਈ tradeoff ledger ਤੋਂ ਬਾਅਦ ਵੀ stable ਰਹਿੰਦਾ ਹੈ।",
    r: "Ledger comparison rent, commute, utilities ate transit reliability nu ikatthe rakhdaa hai, is lai tradeoff ledger ton baad vii stable rahindaa hai.",
    vi: "Ledger comparison giữ rent, commute, utilities và transit reliability cùng nhau, nên tradeoff vẫn ổn định sau ledger.",
    en: "The ledger comparison keeps rent, commute, utilities, and transit reliability together, so the tradeoff stays stable after the ledger.",
  },
  counterpoint: {
    g: "Ledger counterpoint queue rule ਨੂੰ ਮੰਨਦਾ ਹੈ, urgent symptom ਲਈ limited exception ਰੱਖਦਾ ਹੈ, ਅਤੇ safety reason ਨੂੰ preference ਨਹੀਂ ਬਣਾਉਂਦਾ।",
    r: "Ledger counterpoint queue rule nu manndaa hai, urgent symptom lai limited exception rakhdaa hai, ate safety reason nu preference nahi banaaundaa.",
    vi: "Ledger counterpoint công nhận queue rule, giữ ngoại lệ giới hạn cho triệu chứng khẩn, và không biến safety reason thành preference.",
    en: "The ledger counterpoint accepts the queue rule, keeps a limited exception for urgent symptoms, and does not turn the safety reason into preference.",
  },
  recommendation: {
    g: "Ledger recommendation part-time program ਨੂੰ conditional ਰੱਖਦਾ ਹੈ: fees, schedule ਅਤੇ support verify ਹੋਣ ਤੋਂ ਬਾਅਦ first advisor step ਆਉਂਦਾ ਹੈ।",
    r: "Ledger recommendation part-time program nu conditional rakhdaa hai: fees, schedule ate support verify hon ton baad first advisor step aaundaa hai.",
    vi: "Ledger recommendation giữ chương trình bán thời gian có điều kiện: sau khi verify fees, schedule và support thì có first advisor step.",
    en: "The ledger recommendation keeps the part-time program conditional: after fees, schedule, and support are verified, the first advisor step follows.",
  },
  workplace_fairness: {
    g: "Ledger workplace answer task board evidence, deadlines ਅਤੇ manager review meeting ਰੱਖਦਾ ਹੈ, ਇਸ ਲਈ fair adjustment request blame ਨਹੀਂ ਬਣਦੀ।",
    r: "Ledger workplace answer task board evidence, deadlines ate manager review meeting rakhdaa hai, is lai fair adjustment request blame nahi bandii.",
    vi: "Ledger workplace answer giữ task board evidence, deadlines và manager review meeting, nên request fair adjustment không thành blame.",
    en: "The ledger workplace answer keeps task-board evidence, deadlines, and the manager review meeting, so the fair-adjustment request does not become blame.",
  },
};

const canadaExampleByTopic: Record<
  PunjabiB2LedgerSamplesTopic,
  { vi: string; en: string }
> = {
  settlement: {
    vi: "Canada example: a newcomer settlement worker checks forms, IDs, and the next contact step before leaving.",
    en: "Canada example: a newcomer settlement worker checks forms, IDs, and the next contact step before leaving.",
  },
  education: {
    vi: "Canada example: a college student in Toronto compares part-time schedules before registration closes.",
    en: "Canada example: a college student in Toronto compares part-time schedules before registration closes.",
  },
  healthcare_access: {
    vi: "Canada example: a family on a waitlist asks a walk-in clinic about urgent access and follow-up steps.",
    en: "Canada example: a family on a waitlist asks a walk-in clinic about urgent access and follow-up steps.",
  },
  housing: {
    vi: "Canada example: a tenant in Vancouver reviews a rent increase and the notice date before replying.",
    en: "Canada example: a tenant in Vancouver reviews a rent increase and the notice date before replying.",
  },
  transport: {
    vi: "Canada example: a commuter in Calgary compares bus timing, transfer risk, and monthly pass cost.",
    en: "Canada example: a commuter in Calgary compares bus timing, transfer risk, and monthly pass cost.",
  },
  public_service: {
    vi: "Canada example: a Service Canada or CRA call checks deadlines, documents, and the next contact step.",
    en: "Canada example: a Service Canada or CRA call checks deadlines, documents, and the next contact step.",
  },
  work: {
    vi: "Canada example: a shift worker in Edmonton asks for a schedule adjustment using task-board evidence.",
    en: "Canada example: a shift worker in Edmonton asks for a schedule adjustment using task-board evidence.",
  },
};

export const punjabiB2LedgerSamples: PunjabiB2LedgerSample[] =
  punjabiB2SealSamples.map((item: PunjabiB2SealSample, index: number) => {
    const answer = ledgerAnswerByFocus[item.sealFocus];
    const canada =
      item.canadaPracticalExample_vi && item.canadaPracticalExample_en
        ? { vi: item.canadaPracticalExample_vi, en: item.canadaPracticalExample_en }
        : canadaExampleByTopic[item.topic];
    const style = styleByIndex[index % styleByIndex.length];

    return {
      id: item.id.replace("seal", "ledger"),
      level: "B2",
      ledgerFocus: item.sealFocus,
      style,
      topic: item.topic,
      ledgerPrompt_gurmukhi: `${item.sealPrompt_gurmukhi} pre-A11-ledger ਲਈ stable reasoning lock ਕਰੋ।`,
      ledgerPrompt_romanization: `${item.sealPrompt_romanization} pre-A11-ledger lai stable reasoning lock karo.`,
      ledgerPrompt_vi: `${item.sealPrompt_vi} Hãy lock stable reasoning cho pre-A11-ledger.`,
      ledgerPrompt_en: `${item.sealPrompt_en} Lock stable reasoning for the pre-A11 ledger.`,
      ledgerAnswer_gurmukhi: answer.g,
      ledgerAnswer_romanization: answer.r,
      ledgerAnswer_vi: answer.vi,
      ledgerAnswer_en: answer.en,
      preA11Ledger_vi: item.preA11Seal_vi.map((s) => s.replace("Seal", "Ledger")),
      preA11Ledger_en: item.preA11Seal_en.map((s) => s.replace("Seal", "Ledger")),
      archiveChecks_vi: item.snapshotChecks_vi.map((s) => s.replace("Snapshot", "Archive")),
      archiveChecks_en: item.snapshotChecks_en.map((s) => s.replace("Snapshot", "Archive")),
      signoffChecks_vi: item.closurePacketChecks_vi.map((s) => s.replace("Closure-packet", "Signoff")),
      signoffChecks_en: item.closurePacketChecks_en.map((s) => s.replace("Closure packet", "Signoff")),
      preIntegration_vi: item.preIntegration_vi,
      preIntegration_en: item.preIntegration_en,
      learnerTrap_vi: `${item.learnerTrap_vi} Ledger trap: ਨਹੀਂ call this an integration step; only lock stable reasoning for later A11.`,
      learnerTrap_en: `${item.learnerTrap_en} Ledger trap: do not call this an integration step; only lock stable reasoning for later A11.`,
      canadaPracticalExample_vi: canada.vi,
      canadaPracticalExample_en: canada.en,
      scriptAwareness_en:
        index === 0
          ? "Gurmukhi is primary; Shahmukhi is awareness only."
          : "Gurmukhi is primary; script awareness is awareness only.",
      nativeReview: item.nativeReview,
    };
  });

export const punjabiB2LedgerSamplesAlias = punjabiB2LedgerSamples;

export default punjabiB2LedgerSamplesAlias;
