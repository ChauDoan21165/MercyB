// Punjabi B2 inventory-seal samples for stable upper-intermediate reasoning.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiB2CatalogSamples,
  type PunjabiB2CatalogSample,
  type PunjabiB2CatalogSamplesFocus,
  type PunjabiB2CatalogSamplesTopic,
} from "./b2CatalogSamples";

export type PunjabiB2InventorySealSamplesFocus = PunjabiB2CatalogSamplesFocus;
export type PunjabiB2InventorySealSamplesTopic = PunjabiB2CatalogSamplesTopic;

export type PunjabiB2InventorySealStage =
  | "inventory_seal"
  | "catalog_lock"
  | "bundle_lock"
  | "receipt_lock"
  | "pre_integration_hold";

export type PunjabiB2InventorySealSample = {
  id: string;
  level: "B2";
  inventorySealFocus: PunjabiB2InventorySealSamplesFocus;
  inventorySealStage: PunjabiB2InventorySealStage;
  topic: PunjabiB2InventorySealSamplesTopic;
  sealTitle_gurmukhi: string;
  sealTitle_romanization: string;
  sealTitle_vi: string;
  sealTitle_en: string;
  prompt_gurmukhi: string;
  prompt_romanization: string;
  prompt_vi: string;
  prompt_en: string;
  sealedAnswer_gurmukhi: string;
  sealedAnswer_romanization: string;
  sealedAnswer_vi: string;
  sealedAnswer_en: string;
  inventorySealChecks_vi: string[];
  inventorySealChecks_en: string[];
  catalogChecks_vi: string[];
  catalogChecks_en: string[];
  bundleChecks_vi: string[];
  bundleChecks_en: string[];
  preIntegrationChecks_vi: string[];
  preIntegrationChecks_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview: "deferred";
};

const stages: PunjabiB2InventorySealStage[] = [
  "inventory_seal",
  "catalog_lock",
  "bundle_lock",
  "receipt_lock",
  "pre_integration_hold",
];

const sealByFocus: Record<
  PunjabiB2InventorySealSamplesFocus,
  { g: string; r: string; vi: string; en: string; checksVi: string[]; checksEn: string[] }
> = {
  structured_opinion: {
    g: "Structured opinion inventory seal",
    r: "Structured opinion inventory seal",
    vi: "Inventory seal cho structured opinion",
    en: "Structured opinion inventory seal",
    checksVi: ["Seal giữ stance", "Seal giữ evidence", "Seal giữ recommendation"],
    checksEn: ["Seal keeps the stance", "Seal keeps evidence", "Seal keeps the recommendation"],
  },
  evidence: {
    g: "Evidence inventory seal",
    r: "Evidence inventory seal",
    vi: "Inventory seal cho evidence",
    en: "Evidence inventory seal",
    checksVi: ["Seal giữ data", "Seal giữ source-like detail", "Seal giữ measured claim"],
    checksEn: ["Seal keeps data", "Seal keeps source-like detail", "Seal keeps the measured claim"],
  },
  counterpoint: {
    g: "Counterpoint inventory seal",
    r: "Counterpoint inventory seal",
    vi: "Inventory seal cho counterpoint",
    en: "Counterpoint inventory seal",
    checksVi: ["Seal giữ acknowledgement", "Seal giữ respectful tone", "Seal giữ limited objection"],
    checksEn: ["Seal keeps acknowledgment", "Seal keeps respectful tone", "Seal keeps the limited objection"],
  },
  tradeoff: {
    g: "Tradeoff inventory seal",
    r: "Tradeoff inventory seal",
    vi: "Inventory seal cho tradeoff",
    en: "Tradeoff inventory seal",
    checksVi: ["Seal giữ option A", "Seal giữ option B", "Seal giữ cost-condition link"],
    checksEn: ["Seal keeps option A", "Seal keeps option B", "Seal keeps the cost-condition link"],
  },
  recommendation: {
    g: "Recommendation inventory seal",
    r: "Recommendation inventory seal",
    vi: "Inventory seal cho recommendation",
    en: "Recommendation inventory seal",
    checksVi: ["Seal giữ conditional advice", "Seal giữ first step", "Seal giữ no overpromise"],
    checksEn: ["Seal keeps conditional advice", "Seal keeps the first step", "Seal keeps no overpromise"],
  },
  settlement: {
    g: "Settlement inventory seal",
    r: "Settlement inventory seal",
    vi: "Inventory seal cho settlement",
    en: "Settlement inventory seal",
    checksVi: ["Seal giữ fair process", "Seal giữ deadline", "Seal giữ next step"],
    checksEn: ["Seal keeps fair process", "Seal keeps the deadline", "Seal keeps the next step"],
  },
};

const withGurmukhiSeal = (sample: PunjabiB2CatalogSample): string =>
  `Inventory seal: ${sample.modelAnswer_gurmukhi}`;

const withRomanSeal = (sample: PunjabiB2CatalogSample): string =>
  `Inventory seal: ${sample.modelAnswer_romanization}`;

export const punjabiB2InventorySealSamples: PunjabiB2InventorySealSample[] =
  punjabiB2CatalogSamples.map((sample, index) => {
    const seal = sealByFocus[sample.catalogFocus];

    return {
      id: sample.id.replace("_catalog_", "_inventory_seal_"),
      level: "B2",
      inventorySealFocus: sample.catalogFocus,
      inventorySealStage: stages[index % stages.length],
      topic: sample.topic,
      sealTitle_gurmukhi: `${seal.g} ਲਈ ${sample.catalogTitle_gurmukhi}`,
      sealTitle_romanization: `${seal.r} lai ${sample.catalogTitle_romanization}`,
      sealTitle_vi: `${seal.vi}: ${sample.catalogTitle_vi}`,
      sealTitle_en: `${seal.en}: ${sample.catalogTitle_en}`,
      prompt_gurmukhi: sample.prompt_gurmukhi,
      prompt_romanization: sample.prompt_romanization,
      prompt_vi: sample.prompt_vi,
      prompt_en: sample.prompt_en,
      sealedAnswer_gurmukhi: withGurmukhiSeal(sample),
      sealedAnswer_romanization: withRomanSeal(sample),
      sealedAnswer_vi: `Inventory seal giữ nguyên B2 reasoning: ${sample.modelAnswer_vi}`,
      sealedAnswer_en: `Inventory seal preserves the B2 reasoning: ${sample.modelAnswer_en}`,
      inventorySealChecks_vi: [
        "Pre-A11 inventory-seal giữ entry app-consumable.",
        ...seal.checksVi,
      ],
      inventorySealChecks_en: [
        "Pre-A11 inventory-seal keeps the entry app-consumable.",
        ...seal.checksEn,
      ],
      catalogChecks_vi: sample.preA11CatalogChecks_vi,
      catalogChecks_en: sample.preA11CatalogChecks_en,
      bundleChecks_vi: sample.bundleChecks_vi,
      bundleChecks_en: sample.bundleChecks_en,
      preIntegrationChecks_vi: sample.preIntegrationChecks_vi,
      preIntegrationChecks_en: sample.preIntegrationChecks_en,
      learnerTrap_vi: sample.learnerTrap_vi,
      learnerTrap_en: sample.learnerTrap_en,
      canadaPracticalExample_vi: sample.canadaPracticalExample_vi,
      canadaPracticalExample_en: sample.canadaPracticalExample_en,
      scriptAwareness_en:
        sample.scriptAwareness_en ??
        "Shahmukhi awareness only; this inventory seal keeps Gurmukhi as the app-primary script.",
      nativeReview: "deferred",
    };
  });

export const punjabiB2InventorySealSamplesAlias = punjabiB2InventorySealSamples;

export default punjabiB2InventorySealSamplesAlias;
