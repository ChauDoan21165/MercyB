import { describe, expect, it } from "vitest";

import traceabilitySamples, {
  punjabiA1TraceabilitySamples as namedTraceabilitySamples,
  traceabilityScriptAwareness,
  type PunjabiA1TraceabilityDomain,
  type PunjabiA1TraceabilityStyle,
} from "@/languages/punjabi/a1TraceabilitySamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 traceability samples", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(traceabilitySamples).toBe(namedTraceabilitySamples);
    expect(Array.isArray(traceabilitySamples)).toBe(true);
  });

  it("is compact and covers the required traceability domains", () => {
    expect(traceabilitySamples.length).toBeGreaterThanOrEqual(12);
    expect(traceabilitySamples.length).toBeLessThanOrEqual(14);

    const requiredDomains: PunjabiA1TraceabilityDomain[] = [
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
    const domains = new Set(traceabilitySamples.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes traceability, evidence receipt, completion record, inventory seal, catalog, archive, pre-integration, and readiness styles", () => {
    const requiredStyles: PunjabiA1TraceabilityStyle[] = [
      "pre_a11_traceability",
      "evidence_receipt",
      "completion_record",
      "inventory_seal",
      "catalog",
      "archive_copy",
      "pre_integration",
      "readiness_check",
    ];
    const styles = new Set(traceabilitySamples.map((item) => item.style));

    for (const style of requiredStyles) {
      expect(styles, `missing style ${style}`).toContain(style);
    }
  });

  it("uses Gurmukhi primary with romanization, bilingual goals, and trace links", () => {
    for (const item of traceabilitySamples) {
      expect(item.id).toMatch(/^pa_a1_traceability_/);
      expect(item.cue_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.learner_goal_vi.trim().length).toBeGreaterThan(0);
      expect(item.learner_goal_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.trace_note_vi.trim().length).toBeGreaterThan(0);
      expect(item.trace_note_en.trim().length).toBeGreaterThan(0);
      expect(item.source_evidence_receipt_id).toMatch(/^pa_a1_evidence_receipt_/);
      expect(item.source_completion_record_id).toMatch(/^pa_a1_completion_record_/);
      expect(item.source_inventory_seal_id).toMatch(/^pa_a1_inventory_seal_/);
      expect(item.source_catalog_id).toMatch(/^pa_a1_catalog_/);
      expect(item.trace_artifacts.length).toBeGreaterThanOrEqual(12);
      expect(item.trace_artifacts).toContain(item.source_evidence_receipt_id);
      expect(item.trace_artifacts).toContain(item.source_completion_record_id);
      expect(item.trace_artifacts).toContain(item.source_inventory_seal_id);
      expect(item.trace_artifacts).toContain(item.source_catalog_id);

      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes traps, Canada-practical examples, and romanization bridge items", () => {
    const traps = traceabilitySamples.flatMap((item) => (item.learner_trap ? [item.learner_trap] : []));
    const canadaItems = traceabilitySamples.filter((item) => item.canada_practical);
    const romanizationBridge = traceabilitySamples.find((item) => item.domain === "romanization_bridge");

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    expect(JSON.stringify(canadaItems)).toMatch(/Canada|clinic|school|library|service|bus|cashier|counter/i);
    expect(romanizationBridge?.romanization).toMatch(LATIN);
    expect(JSON.stringify(romanizationBridge)).toMatch(/Gurmukhi|romanization|cầu nối/i);
  });

  it("verifies beginner readiness across the stable traceability samples", () => {
    const allText = JSON.stringify(traceabilitySamples);

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
    expect(allText).toMatch(/traceability|evidence receipt|completion record|pre_a11_traceability|pre-integration/i);
  });

  it("mentions Shahmukhi only as awareness and avoids disallowed claims and systems", () => {
    const allText = `${traceabilityScriptAwareness} ${JSON.stringify(traceabilitySamples)}`;

    expect(traceabilityScriptAwareness).toContain("Shahmukhi");
    expect(traceabilityScriptAwareness).toContain("awareness only");
    expect(traceabilityScriptAwareness).toContain("Native review is deferred");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration|\.local/i);
  });
});
