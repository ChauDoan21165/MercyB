// Punjabi C1 inventory seal samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred. This is not A11 integration.

import {
  c1CatalogSamples,
  c1CatalogSamplesScriptAwareness,
  type PunjabiC1CatalogArea,
  type PunjabiC1CatalogSample,
} from "./c1CatalogSamples";

export type PunjabiC1InventorySealArea = PunjabiC1CatalogArea;

export type PunjabiC1InventorySealMode =
  | "inventory_seal"
  | "pre_a11_inventory_seal"
  | "catalog"
  | "bundle"
  | "receipt"
  | "ledger"
  | "pre_integration"
  | "public_service";

export type PunjabiC1InventorySealPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1InventorySealSample = {
  id: string;
  level: "C1";
  area: PunjabiC1InventorySealArea;
  mode: PunjabiC1InventorySealMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  inventory_seal_prompt_vi: string;
  inventory_seal_prompt_en: string;
  sample: PunjabiC1InventorySealPhrase;
  inventory_seal_checks_vi: readonly string[];
  inventory_seal_checks_en: readonly string[];
  pre_a11_inventory_seal_checks_vi: readonly string[];
  pre_a11_inventory_seal_checks_en: readonly string[];
  catalog_notes_vi: readonly string[];
  catalog_notes_en: readonly string[];
  bundle_notes_vi: readonly string[];
  bundle_notes_en: readonly string[];
  pre_integration_notes_vi: readonly string[];
  pre_integration_notes_en: readonly string[];
  canada_example: PunjabiC1InventorySealPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

const modeByArea: Record<PunjabiC1InventorySealArea, PunjabiC1InventorySealMode> = {
  source_summary: "inventory_seal",
  cautious_claim: "pre_a11_inventory_seal",
  evidence_comparison: "ledger",
  formal_correspondence: "receipt",
  executive_summary: "bundle",
  register_calibration: "catalog",
  presentation_response: "pre_integration",
  public_professional_tone: "public_service",
};

function replaceTerms(items: readonly string[], replacements: Array<[RegExp, string]>): readonly string[] {
  return items.map((item) =>
    replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), item),
  );
}

export const c1InventorySealSamplesScriptAwareness = {
  vi: `${c1CatalogSamplesScriptAwareness.vi} Inventory seal chỉ xác nhận dữ liệu tĩnh; native review được để sau.`,
  en: `${c1CatalogSamplesScriptAwareness.en} The inventory seal only confirms static data; native review is deferred.`,
} as const;

export const c1InventorySealSamples: PunjabiC1InventorySealSample[] = c1CatalogSamples.map(
  (item: PunjabiC1CatalogSample) => ({
    id: item.id.replace("catalog", "inventory_seal"),
    level: "C1",
    area: item.area,
    mode: modeByArea[item.area],
    title_pa: `Inventory seal: ${item.title_pa.replace(/catalog/gi, "inventory seal")}`,
    title_rom: `inventory seal: ${item.title_rom.replace(/catalog/gi, "inventory seal")}`,
    title_vi: `Inventory seal: ${item.title_vi.replace(/catalog/gi, "inventory seal")}`,
    title_en: `Inventory seal: ${item.title_en.replace(/catalog/gi, "inventory seal")}`,
    inventory_seal_prompt_vi: `${item.catalog_prompt_vi} Chốt như pre-A11-inventory-seal để readiness checker có thể xác nhận inventory mà không tích hợp A11.`,
    inventory_seal_prompt_en: `${item.catalog_prompt_en} Seal it as pre-A11-inventory-seal so the readiness checker can confirm inventory without A11 integration.`,
    sample: item.sample,
    inventory_seal_checks_vi: [
      "Inventory seal có id ổn định.",
      "Area C1 được giữ nguyên.",
      "Gurmukhi là primary sample.",
      "Vietnamese và English explanation đều có.",
      "Canada example còn nguyên.",
      ...replaceTerms(item.catalog_checks_vi.slice(0, 1), [[/Catalog/gi, "Inventory seal"]]),
    ],
    inventory_seal_checks_en: [
      "Inventory seal has a stable id.",
      "C1 area is preserved.",
      "Gurmukhi is the primary sample.",
      "Vietnamese and English explanations are both present.",
      "Canada example is preserved.",
      ...replaceTerms(item.catalog_checks_en.slice(0, 1), [[/Catalog/gi, "Inventory seal"]]),
    ],
    pre_a11_inventory_seal_checks_vi: [
      "Có thể gắn nhãn pre-A11-inventory-seal.",
      "Không chạy A11 integration.",
      "Không có native-review claim.",
      "Không thêm audio hoặc pronunciation scoring.",
      "Không chạm auth, billing, RLS, Supabase, Azure, CI config.",
      ...replaceTerms(item.pre_a11_catalog_checks_vi.slice(0, 1), [[/catalog/gi, "inventory seal"]]),
    ],
    pre_a11_inventory_seal_checks_en: [
      "Can be labeled pre-A11-inventory-seal.",
      "Does not run A11 integration.",
      "No native-review claim.",
      "Does not add audio or pronunciation scoring.",
      "Does not touch auth, billing, RLS, Supabase, Azure, or CI config.",
      ...replaceTerms(item.pre_a11_catalog_checks_en.slice(0, 1), [[/catalog/gi, "inventory seal"]]),
    ],
    catalog_notes_vi: replaceTerms(item.catalog_checks_vi, [[/Catalog/gi, "Inventory catalog"]]),
    catalog_notes_en: replaceTerms(item.catalog_checks_en, [[/Catalog/gi, "Inventory catalog"]]),
    bundle_notes_vi: item.bundle_notes_vi,
    bundle_notes_en: item.bundle_notes_en,
    pre_integration_notes_vi: [
      ...item.pre_integration_notes_vi,
      "Inventory seal vẫn là app-consumable TypeScript data.",
    ],
    pre_integration_notes_en: [
      ...item.pre_integration_notes_en,
      "The inventory seal remains app-consumable TypeScript data.",
    ],
    canada_example: item.canada_example,
    learner_traps_vi: [
      ...item.learner_traps_vi,
      "Đừng hiểu inventory seal là A11 integration đã chạy.",
      "Đừng hiểu inventory seal là native review đã hoàn tất.",
    ],
    learner_traps_en: [
      ...item.learner_traps_en,
      "Do not treat the inventory seal as completed A11 integration.",
      "Do not treat the inventory seal as completed native review.",
    ],
  }),
);

export const punjabiC1InventorySealSamples = c1InventorySealSamples;

export default punjabiC1InventorySealSamples;
