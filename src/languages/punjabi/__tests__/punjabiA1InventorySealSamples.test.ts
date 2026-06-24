import { describe, expect, it } from "vitest";

import inventorySealSamples, {
  inventorySealScriptAwareness,
  punjabiA1InventorySealSamples as namedInventorySealSamples,
  type PunjabiA1InventorySealDomain,
  type PunjabiA1InventorySealStyle,
} from "@/languages/punjabi/a1InventorySealSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 inventory seal samples", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(inventorySealSamples).toBe(namedInventorySealSamples);
    expect(Array.isArray(inventorySealSamples)).toBe(true);
  });

  it("is compact and covers the required inventory seal domains", () => {
    expect(inventorySealSamples.length).toBeGreaterThanOrEqual(12);
    expect(inventorySealSamples.length).toBeLessThanOrEqual(14);

    const requiredDomains: PunjabiA1InventorySealDomain[] = [
      "greetings",
      "identity",
      "family",
      "numbers",
      "prices",
      "food",
      "directions",
      "help",
      "repetition",
      "politeness",
      "gurmukhi_recognition",
      "romanization_bridge",
      "canada_service_counter",
    ];
    const domains = new Set(inventorySealSamples.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes inventory seal, catalog, bundle, receipt, ledger, archive, pre-integration, and readiness styles", () => {
    const requiredStyles: PunjabiA1InventorySealStyle[] = [
      "pre_a11_inventory_seal",
      "catalog",
      "bundle",
      "receipt",
      "ledger_entry",
      "archive_copy",
      "pre_integration",
      "readiness_check",
    ];
    const styles = new Set(inventorySealSamples.map((item) => item.style));

    for (const style of requiredStyles) {
      expect(styles, `missing style ${style}`).toContain(style);
    }
  });

  it("uses Gurmukhi primary with romanization and bilingual seal fields", () => {
    for (const item of inventorySealSamples) {
      expect(item.id).toMatch(/^pa_a1_inventory_seal_/);
      expect(item.cue_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.inventory_label_vi.trim().length).toBeGreaterThan(0);
      expect(item.inventory_label_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.seal_check_vi.trim().length).toBeGreaterThan(0);
      expect(item.seal_check_en.trim().length).toBeGreaterThan(0);
      expect(item.source_catalog_id).toMatch(/^pa_a1_catalog_/);
      expect(item.source_bundle_id).toMatch(/^pa_a1_bundle_/);
      expect(item.source_receipt_id).toMatch(/^pa_a1_receipt_/);
      expect(item.sealed_artifacts.length).toBeGreaterThanOrEqual(6);
      expect(item.sealed_artifacts).toContain(item.source_catalog_id);
      expect(item.sealed_artifacts).toContain(item.source_bundle_id);
      expect(item.sealed_artifacts).toContain(item.source_receipt_id);

      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes traps, Canada-practical examples, and romanization bridge items", () => {
    const traps = inventorySealSamples.flatMap((item) => (item.learner_trap ? [item.learner_trap] : []));
    const canadaItems = inventorySealSamples.filter((item) => item.canada_practical);
    const romanizationBridge = inventorySealSamples.find((item) => item.domain === "romanization_bridge");

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    expect(JSON.stringify(canadaItems)).toMatch(/Canada|clinic|school|library|service|bus|cashier|counter/i);
    expect(romanizationBridge?.romanization).toMatch(LATIN);
    expect(JSON.stringify(romanizationBridge)).toMatch(/Gurmukhi|romanization|cầu nối/i);
  });

  it("verifies beginner readiness across the stable inventory seal samples", () => {
    const allText = JSON.stringify(inventorySealSamples);

    expect(allText).toMatch(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ/);
    expect(allText).toMatch(/ਮੇਰਾ ਨਾਮ|ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ/);
    expect(allText).toMatch(/ਪਿਤਾ ਜੀ|ਮੇਰੇ ਕੋਲ ਇੱਕ ਭੈਣ/);
    expect(allText).toMatch(/ਤਿੰਨ ਟਿਕਟਾਂ/);
    expect(allText).toMatch(/ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ/);
    expect(allText).toMatch(/ਮੈਨੂੰ ਚਾਹ ਚਾਹੀਦੀ ਹੈ/);
    expect(allText).toMatch(/ਬੱਸ ਸਟਾਪ ਕਿੱਥੇ ਹੈ/);
    expect(allText).toMatch(/ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ/);
    expect(allText).toMatch(/ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ/);
    expect(allText).toMatch(/ਧੰਨਵਾਦ ਜੀ/);
    expect(allText).toMatch(/ਗੁਰਮੁਖੀ ਲਿਪੀ/);
    expect(allText).toMatch(/ਫਲ/);
    expect(allText).toMatch(/ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ|ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ/);
    expect(allText).toMatch(/inventory seal|catalog|bundle|receipt|ledger|archive|pre_a11_inventory_seal|pre-integration/i);
  });

  it("mentions Shahmukhi only as awareness and avoids disallowed claims and systems", () => {
    const allText = `${inventorySealScriptAwareness} ${JSON.stringify(inventorySealSamples)}`;

    expect(inventorySealScriptAwareness).toContain("Shahmukhi");
    expect(inventorySealScriptAwareness).toContain("awareness only");
    expect(inventorySealScriptAwareness).toContain("Native review is deferred");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration|\.local/i);
  });
});
