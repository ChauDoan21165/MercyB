// Punjabi A1 bundle samples for Vietnamese-speaking and English-speaking
// learners.
// Gurmukhi is primary; romanization supports recognition. Shahmukhi is
// awareness only, not a full course.

import {
  punjabiA1ReceiptSamples,
  receiptScriptAwareness,
  type PunjabiA1ReceiptDomain,
} from "./a1ReceiptSamples";

export type PunjabiA1BundleDomain = PunjabiA1ReceiptDomain;

export type PunjabiA1BundleStyle =
  | "pre_a11_bundle"
  | "receipt"
  | "ledger_entry"
  | "archive_copy"
  | "pre_merge"
  | "pre_integration"
  | "qa"
  | "readiness_check";

export type PunjabiA1BundleSample = {
  id: string;
  domain: PunjabiA1BundleDomain;
  style: PunjabiA1BundleStyle;
  prompt_vi: string;
  prompt_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  bundle_check_vi: string;
  bundle_check_en: string;
  preservation_vi: string;
  preservation_en: string;
  trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: string;
  review_links: string[];
};

const styleByDomain: Record<PunjabiA1BundleDomain, PunjabiA1BundleStyle> = {
  greetings: "pre_a11_bundle",
  identity: "receipt",
  family: "archive_copy",
  numbers: "ledger_entry",
  prices: "qa",
  food: "pre_integration",
  directions: "pre_merge",
  help: "pre_a11_bundle",
  repetition: "pre_integration",
  politeness: "qa",
  gurmukhi_recognition: "readiness_check",
  romanization_bridge: "archive_copy",
  canada_service_counter: "pre_merge",
};

const replaceReceiptWithBundle = (value: string) =>
  value
    .replace(/receipt/gi, "bundle")
    .replace(/Receipt/gi, "Bundle")
    .replace(/archive the core greeting sample/i, "bundle the core greeting sample")
    .replace(/archive/i, "bundle");

const replaceReceiptLinks = (links: string[]) =>
  links.map((link) => link.replace("pa_a1_receipt_", "pa_a1_bundle_"));

export const punjabiA1BundleSamples: PunjabiA1BundleSample[] = punjabiA1ReceiptSamples.map(
  (item) => ({
    id: item.id.replace("pa_a1_receipt_", "pa_a1_bundle_"),
    domain: item.domain,
    style: styleByDomain[item.domain],
    prompt_vi: replaceReceiptWithBundle(item.prompt_vi),
    prompt_en: replaceReceiptWithBundle(item.prompt_en),
    cue_pa: item.cue_pa,
    romanization: item.romanization,
    meaning_vi: item.meaning_vi,
    meaning_en: item.meaning_en,
    bundle_check_vi: replaceReceiptWithBundle(item.receipt_check_vi),
    bundle_check_en: replaceReceiptWithBundle(item.receipt_check_en),
    preservation_vi: replaceReceiptWithBundle(item.preservation_vi),
    preservation_en: replaceReceiptWithBundle(item.preservation_en),
    trap: item.trap,
    canada_practical: item.canada_practical,
    review_links: replaceReceiptLinks(item.review_links),
  }),
);

export const bundleScriptAwareness = receiptScriptAwareness;

export default punjabiA1BundleSamples;

