import { describe, expect, it } from "vitest";

import completionRecordSamples, {
  completionRecordScriptAwareness,
  punjabiA1CompletionRecordSamples as namedCompletionRecordSamples,
  type PunjabiA1CompletionRecordDomain,
  type PunjabiA1CompletionRecordStyle,
} from "@/languages/punjabi/a1CompletionRecordSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 completion record samples", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(completionRecordSamples).toBe(namedCompletionRecordSamples);
    expect(Array.isArray(completionRecordSamples)).toBe(true);
  });

  it("is compact and covers the required completion record domains", () => {
    expect(completionRecordSamples.length).toBeGreaterThanOrEqual(12);
    expect(completionRecordSamples.length).toBeLessThanOrEqual(14);

    const requiredDomains: PunjabiA1CompletionRecordDomain[] = [
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
    const domains = new Set(completionRecordSamples.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes completion record, inventory seal, catalog, bundle, receipt, archive, pre-integration, and readiness styles", () => {
    const requiredStyles: PunjabiA1CompletionRecordStyle[] = [
      "pre_a11_completion_record",
      "inventory_seal",
      "catalog",
      "bundle",
      "receipt",
      "archive_copy",
      "pre_integration",
      "readiness_check",
    ];
    const styles = new Set(completionRecordSamples.map((item) => item.style));

    for (const style of requiredStyles) {
      expect(styles, `missing style ${style}`).toContain(style);
    }
  });

  it("uses Gurmukhi primary with romanization and bilingual completion fields", () => {
    for (const item of completionRecordSamples) {
      expect(item.id).toMatch(/^pa_a1_completion_record_/);
      expect(item.cue_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.record_label_vi.trim().length).toBeGreaterThan(0);
      expect(item.record_label_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.completion_note_vi.trim().length).toBeGreaterThan(0);
      expect(item.completion_note_en.trim().length).toBeGreaterThan(0);
      expect(item.source_inventory_seal_id).toMatch(/^pa_a1_inventory_seal_/);
      expect(item.source_catalog_id).toMatch(/^pa_a1_catalog_/);
      expect(item.source_bundle_id).toMatch(/^pa_a1_bundle_/);
      expect(item.source_receipt_id).toMatch(/^pa_a1_receipt_/);
      expect(item.completed_artifacts.length).toBeGreaterThanOrEqual(8);
      expect(item.completed_artifacts).toContain(item.source_inventory_seal_id);
      expect(item.completed_artifacts).toContain(item.source_catalog_id);
      expect(item.completed_artifacts).toContain(item.source_bundle_id);
      expect(item.completed_artifacts).toContain(item.source_receipt_id);

      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes traps, Canada-practical examples, and romanization bridge items", () => {
    const traps = completionRecordSamples.flatMap((item) => (item.learner_trap ? [item.learner_trap] : []));
    const canadaItems = completionRecordSamples.filter((item) => item.canada_practical);
    const romanizationBridge = completionRecordSamples.find((item) => item.domain === "romanization_bridge");

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    expect(JSON.stringify(canadaItems)).toMatch(/Canada|clinic|school|library|service|bus|cashier|counter/i);
    expect(romanizationBridge?.romanization).toMatch(LATIN);
    expect(JSON.stringify(romanizationBridge)).toMatch(/Gurmukhi|romanization|cầu nối/i);
  });

  it("verifies beginner readiness across the stable completion record samples", () => {
    const allText = JSON.stringify(completionRecordSamples);

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
    expect(allText).toMatch(/completion record|inventory seal|catalog|pre_a11_completion_record|pre-integration/i);
  });

  it("mentions Shahmukhi only as awareness and avoids disallowed claims and systems", () => {
    const allText = `${completionRecordScriptAwareness} ${JSON.stringify(completionRecordSamples)}`;

    expect(completionRecordScriptAwareness).toContain("Shahmukhi");
    expect(completionRecordScriptAwareness).toContain("awareness only");
    expect(completionRecordScriptAwareness).toContain("Native review is deferred");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration|\.local/i);
  });
});
