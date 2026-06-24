// Punjabi C1 catalog samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred. This is not A11 integration.

import {
  c1BundleSamples,
  c1BundleSamplesScriptAwareness,
  type PunjabiC1BundleArea,
  type PunjabiC1BundleSample,
} from "./c1BundleSamples";

export type PunjabiC1CatalogArea = PunjabiC1BundleArea;

export type PunjabiC1CatalogMode =
  | "catalog"
  | "pre_a11_catalog"
  | "bundle"
  | "receipt"
  | "ledger"
  | "archive_copy"
  | "pre_integration"
  | "public_service";

export type PunjabiC1CatalogPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1CatalogSample = {
  id: string;
  level: "C1";
  area: PunjabiC1CatalogArea;
  mode: PunjabiC1CatalogMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  catalog_prompt_vi: string;
  catalog_prompt_en: string;
  sample: PunjabiC1CatalogPhrase;
  catalog_checks_vi: readonly string[];
  catalog_checks_en: readonly string[];
  pre_a11_catalog_checks_vi: readonly string[];
  pre_a11_catalog_checks_en: readonly string[];
  bundle_notes_vi: readonly string[];
  bundle_notes_en: readonly string[];
  receipt_notes_vi: readonly string[];
  receipt_notes_en: readonly string[];
  pre_integration_notes_vi: readonly string[];
  pre_integration_notes_en: readonly string[];
  canada_example: PunjabiC1CatalogPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

const modeByArea: Record<PunjabiC1CatalogArea, PunjabiC1CatalogMode> = {
  source_summary: "catalog",
  cautious_claim: "pre_a11_catalog",
  evidence_comparison: "ledger",
  formal_correspondence: "receipt",
  executive_summary: "bundle",
  register_calibration: "archive_copy",
  presentation_response: "pre_integration",
  public_professional_tone: "public_service",
};

function replaceTerms(items: readonly string[], replacements: Array<[RegExp, string]>): readonly string[] {
  return items.map((item) =>
    replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), item),
  );
}

export const c1CatalogSamplesScriptAwareness = {
  vi: `${c1BundleSamplesScriptAwareness.vi} Catalog chỉ ghi nhận Shahmukhi ở mức awareness, không mở thành course script.`,
  en: `${c1BundleSamplesScriptAwareness.en} The catalog keeps Shahmukhi at awareness level only, not as a script course.`,
} as const;

export const c1CatalogSamples: PunjabiC1CatalogSample[] = c1BundleSamples.map(
  (item: PunjabiC1BundleSample) => ({
    id: item.id.replace("bundle", "catalog"),
    level: "C1",
    area: item.area,
    mode: modeByArea[item.area],
    title_pa: `Catalog: ${item.title_pa.replace(/bundle/gi, "catalog")}`,
    title_rom: `catalog: ${item.title_rom.replace(/bundle/gi, "catalog")}`,
    title_vi: `Catalog: ${item.title_vi.replace(/bundle/gi, "catalog")}`,
    title_en: `Catalog: ${item.title_en.replace(/bundle/gi, "catalog")}`,
    catalog_prompt_vi: `${item.bundle_prompt_vi} Đưa vào pre-A11-catalog để chọn lọc sau, không chạy A11 integration.`,
    catalog_prompt_en: `${item.bundle_prompt_en} Place it in a pre-A11 catalog for later selection, without running A11 integration.`,
    sample: item.sample,
    catalog_checks_vi: [
      "Catalog entry có area C1 rõ.",
      "Gurmukhi là content chính.",
      "Vietnamese và English support đều có.",
      "Register formal được giữ ổn định.",
      ...replaceTerms(item.bundle_checks_vi.slice(0, 1), [[/Bundle/gi, "Catalog"]]),
    ],
    catalog_checks_en: [
      "Catalog entry has a clear C1 area.",
      "Gurmukhi is the main content.",
      "Vietnamese and English support are both present.",
      "Formal register stays stable.",
      ...replaceTerms(item.bundle_checks_en.slice(0, 1), [[/Bundle/gi, "Catalog"]]),
    ],
    pre_a11_catalog_checks_vi: [
      "Có thể gắn nhãn pre-A11-catalog.",
      "Không chạy A11 integration.",
      "Không có native-review claim.",
      "Có thể dùng để lọc bundle/receipt sau này.",
      ...replaceTerms(item.pre_a11_bundle_checks_vi.slice(0, 1), [[/bundle/gi, "catalog"]]),
    ],
    pre_a11_catalog_checks_en: [
      "Can be labeled pre-A11-catalog.",
      "Does not run A11 integration.",
      "No native-review claim.",
      "Can be used to filter later bundle or receipt work.",
      ...replaceTerms(item.pre_a11_bundle_checks_en.slice(0, 1), [[/bundle/gi, "catalog"]]),
    ],
    bundle_notes_vi: replaceTerms(item.bundle_checks_vi, [[/Bundle/gi, "Catalog bundle"]]),
    bundle_notes_en: replaceTerms(item.bundle_checks_en, [[/Bundle/gi, "Catalog bundle"]]),
    receipt_notes_vi: item.receipt_notes_vi,
    receipt_notes_en: item.receipt_notes_en,
    pre_integration_notes_vi: [
      ...item.pre_integration_notes_vi,
      "Catalog vẫn là static TypeScript data cho pre-integration.",
    ],
    pre_integration_notes_en: [
      ...item.pre_integration_notes_en,
      "The catalog remains static TypeScript data for pre-integration.",
    ],
    canada_example: item.canada_example,
    learner_traps_vi: [
      ...item.learner_traps_vi,
      "Đừng dùng catalog như claim rằng mục đã được native review.",
      "Đừng thêm language khác ngoài Punjabi support đã yêu cầu.",
    ],
    learner_traps_en: [
      ...item.learner_traps_en,
      "Do not use the catalog as a claim that the item has native review.",
      "Do not add another language beyond the requested Punjabi support.",
    ],
  }),
);

export const punjabiC1CatalogSamples = c1CatalogSamples;

export default punjabiC1CatalogSamples;
