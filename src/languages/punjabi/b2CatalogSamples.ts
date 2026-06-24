// Punjabi B2 catalog samples for stable upper-intermediate reasoning.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiB2BundleSamples,
  type PunjabiB2BundleReasoningLine,
  type PunjabiB2BundleSamplesFocus,
  type PunjabiB2BundleSamplesTopic,
} from "./b2BundleSamples";

export type PunjabiB2CatalogSamplesFocus = PunjabiB2BundleSamplesFocus;
export type PunjabiB2CatalogSamplesTopic = PunjabiB2BundleSamplesTopic;

export type PunjabiB2CatalogSection =
  | "opinion_catalog"
  | "evidence_catalog"
  | "counterpoint_catalog"
  | "tradeoff_catalog"
  | "recommendation_catalog"
  | "settlement_catalog";

export type PunjabiB2CatalogSample = {
  id: string;
  level: "B2";
  catalogFocus: PunjabiB2CatalogSamplesFocus;
  catalogSection: PunjabiB2CatalogSection;
  topic: PunjabiB2CatalogSamplesTopic;
  catalogTitle_gurmukhi: string;
  catalogTitle_romanization: string;
  catalogTitle_vi: string;
  catalogTitle_en: string;
  prompt_gurmukhi: string;
  prompt_romanization: string;
  prompt_vi: string;
  prompt_en: string;
  modelAnswer_gurmukhi: string;
  modelAnswer_romanization: string;
  modelAnswer_vi: string;
  modelAnswer_en: string;
  reasoningLines: PunjabiB2BundleReasoningLine[];
  preA11CatalogChecks_vi: string[];
  preA11CatalogChecks_en: string[];
  bundleChecks_vi: string[];
  bundleChecks_en: string[];
  receiptChecks_vi: string[];
  receiptChecks_en: string[];
  preIntegrationChecks_vi: string[];
  preIntegrationChecks_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview: "deferred";
};

const sectionByFocus: Record<PunjabiB2CatalogSamplesFocus, PunjabiB2CatalogSection> = {
  structured_opinion: "opinion_catalog",
  evidence: "evidence_catalog",
  counterpoint: "counterpoint_catalog",
  tradeoff: "tradeoff_catalog",
  recommendation: "recommendation_catalog",
  settlement: "settlement_catalog",
};

const titleByTopic: Record<
  PunjabiB2CatalogSamplesTopic,
  { g: string; r: string; vi: string; en: string }
> = {
  work: {
    g: "ਕੰਮ ਦੀ fairness catalog entry",
    r: "Kamm di fairness catalog entry",
    vi: "Catalog entry ve fairness trong công việc",
    en: "Work fairness catalog entry",
  },
  education: {
    g: "Education pathway catalog entry ਲਈ ਸਿੱਖਿਆ ਰਾਹ",
    r: "Education pathway catalog entry lai sikhiaa raah",
    vi: "Catalog entry ve education pathway",
    en: "Education pathway catalog entry",
  },
  healthcare: {
    g: "Healthcare wait-time catalog entry ਲਈ clinic wait",
    r: "Healthcare wait-time catalog entry lai clinic wait",
    vi: "Catalog entry ve healthcare wait-time",
    en: "Healthcare wait-time catalog entry",
  },
  housing: {
    g: "Housing tradeoff catalog entry ਲਈ rent choice",
    r: "Housing tradeoff catalog entry lai rent choice",
    vi: "Catalog entry ve housing tradeoff",
    en: "Housing tradeoff catalog entry",
  },
  transport: {
    g: "Transport evidence catalog entry ਲਈ bus lane data",
    r: "Transport evidence catalog entry lai bus lane data",
    vi: "Catalog entry ve transport evidence",
    en: "Transport evidence catalog entry",
  },
  public_service: {
    g: "Public-service settlement catalog entry ਲਈ form process",
    r: "Public-service settlement catalog entry lai form process",
    vi: "Catalog entry ve public-service settlement",
    en: "Public-service settlement catalog entry",
  },
};

const catalogCheckByFocus: Record<
  PunjabiB2CatalogSamplesFocus,
  { vi: string[]; en: string[]; receiptVi: string[]; receiptEn: string[]; preVi: string[]; preEn: string[] }
> = {
  structured_opinion: {
    vi: ["Pre-A11 catalog giữ stance", "Catalog giữ evidence", "Catalog giữ recommendation"],
    en: ["Pre-A11 catalog keeps the stance", "Catalog keeps evidence", "Catalog keeps the recommendation"],
    receiptVi: ["Receipt giữ workplace context", "Receipt giữ fairness", "Receipt giữ service coverage"],
    receiptEn: ["Receipt keeps workplace context", "Receipt keeps fairness", "Receipt keeps service coverage"],
    preVi: ["Không đổi stance", "Không bỏ evidence", "Không thêm claim ngoài catalog"],
    preEn: ["Do not change the stance", "Do not drop evidence", "Do not add a claim outside the catalog"],
  },
  evidence: {
    vi: ["Pre-A11 catalog giữ data", "Catalog giữ public comment", "Catalog giữ counterpoint"],
    en: ["Pre-A11 catalog keeps data", "Catalog keeps the public comment", "Catalog keeps the counterpoint"],
    receiptVi: ["Receipt giữ peak-time data", "Receipt giữ business concern", "Receipt giữ loading window"],
    receiptEn: ["Receipt keeps peak-time data", "Receipt keeps business concern", "Receipt keeps the loading window"],
    preVi: ["Không đưa opinion trước data", "Không bỏ counterpoint", "Không đổi settlement"],
    preEn: ["Do not place opinion before data", "Do not drop the counterpoint", "Do not change the settlement"],
  },
  counterpoint: {
    vi: ["Pre-A11 catalog giữ acknowledgement", "Catalog giữ complaint", "Catalog giữ settlement"],
    en: ["Pre-A11 catalog keeps acknowledgment", "Catalog keeps the complaint", "Catalog keeps the settlement"],
    receiptVi: ["Receipt giữ urgent priority", "Receipt giữ wait-time update", "Receipt giữ callback option"],
    receiptEn: ["Receipt keeps urgent priority", "Receipt keeps wait-time update", "Receipt keeps callback option"],
    preVi: ["Không dùng always/never", "Không trách móc", "Không bỏ respectful tone"],
    preEn: ["Do not use always/never", "Do not blame", "Do not drop respectful tone"],
  },
  tradeoff: {
    vi: ["Pre-A11 catalog giữ two options", "Catalog giữ cost", "Catalog giữ quality-of-life detail"],
    en: ["Pre-A11 catalog keeps two options", "Catalog keeps cost", "Catalog keeps quality-of-life detail"],
    receiptVi: ["Receipt giữ rent", "Receipt giữ utilities", "Receipt giữ transit access"],
    receiptEn: ["Receipt keeps rent", "Receipt keeps utilities", "Receipt keeps transit access"],
    preVi: ["Không chỉ nói option rẻ hơn", "Không bỏ lease clarity", "Không đổi recommendation"],
    preEn: ["Do not only mention the cheaper option", "Do not drop lease clarity", "Do not change the recommendation"],
  },
  recommendation: {
    vi: ["Pre-A11 catalog giữ conditional advice", "Catalog giữ fees", "Catalog giữ practicum"],
    en: ["Pre-A11 catalog keeps conditional advice", "Catalog keeps fees", "Catalog keeps practicum"],
    receiptVi: ["Receipt giữ advisor step", "Receipt giữ schedule", "Receipt giữ license goal"],
    receiptEn: ["Receipt keeps advisor step", "Receipt keeps schedule", "Receipt keeps the license goal"],
    preVi: ["Không hứa kết quả", "Không dùng best tuyệt đối", "Không bỏ condition"],
    preEn: ["Do not promise an outcome", "Do not use absolute best", "Do not drop the condition"],
  },
  settlement: {
    vi: ["Pre-A11 catalog giữ policy counterpoint", "Catalog giữ checklist", "Catalog giữ deadline"],
    en: ["Pre-A11 catalog keeps the policy counterpoint", "Catalog keeps the checklist", "Catalog keeps the deadline"],
    receiptVi: ["Receipt giữ missing document", "Receipt giữ fair chance", "Receipt giữ clear next step"],
    receiptEn: ["Receipt keeps the missing document", "Receipt keeps fair chance", "Receipt keeps a clear next step"],
    preVi: ["Không biến thành legal claim", "Không bỏ deadline", "Không bỏ respectful wording"],
    preEn: ["Do not turn it into a legal claim", "Do not drop the deadline", "Do not drop respectful wording"],
  },
};

export const punjabiB2CatalogSamples: PunjabiB2CatalogSample[] = punjabiB2BundleSamples.map(
  (sample) => {
    const checks = catalogCheckByFocus[sample.bundleFocus];
    const title = titleByTopic[sample.topic];

    return {
      id: sample.id.replace("_bundle_", "_catalog_"),
      level: "B2",
      catalogFocus: sample.bundleFocus,
      catalogSection: sectionByFocus[sample.bundleFocus],
      topic: sample.topic,
      catalogTitle_gurmukhi: title.g,
      catalogTitle_romanization: title.r,
      catalogTitle_vi: title.vi,
      catalogTitle_en: title.en,
      prompt_gurmukhi: sample.prompt_gurmukhi,
      prompt_romanization: sample.prompt_romanization,
      prompt_vi: sample.prompt_vi,
      prompt_en: sample.prompt_en,
      modelAnswer_gurmukhi: sample.modelAnswer_gurmukhi,
      modelAnswer_romanization: sample.modelAnswer_romanization,
      modelAnswer_vi: sample.modelAnswer_vi,
      modelAnswer_en: sample.modelAnswer_en,
      reasoningLines: sample.reasoningLines,
      preA11CatalogChecks_vi: checks.vi,
      preA11CatalogChecks_en: checks.en,
      bundleChecks_vi: sample.bundleChecks_vi,
      bundleChecks_en: sample.bundleChecks_en,
      receiptChecks_vi: checks.receiptVi,
      receiptChecks_en: checks.receiptEn,
      preIntegrationChecks_vi: checks.preVi,
      preIntegrationChecks_en: checks.preEn,
      learnerTrap_vi: sample.learnerTrap_vi,
      learnerTrap_en: sample.learnerTrap_en,
      canadaPracticalExample_vi: sample.canadaPracticalExample_vi,
      canadaPracticalExample_en: sample.canadaPracticalExample_en,
      scriptAwareness_en: sample.scriptAwareness_en,
      nativeReview: "deferred",
    };
  },
);

export const punjabiB2CatalogSamplesAlias = punjabiB2CatalogSamples;

export default punjabiB2CatalogSamplesAlias;
