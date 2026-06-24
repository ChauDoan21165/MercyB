import { describe, expect, it } from "vitest";

import auditTrailSamples, {
  auditTrailScriptAwareness,
  punjabiA1AuditTrailSamples as namedAuditTrailSamples,
  type PunjabiA1AuditTrailDomain,
  type PunjabiA1AuditTrailStyle,
} from "@/languages/punjabi/a1AuditTrailSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 audit trail samples", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(auditTrailSamples).toBe(namedAuditTrailSamples);
    expect(Array.isArray(auditTrailSamples)).toBe(true);
  });

  it("is compact and covers the required audit trail domains", () => {
    expect(auditTrailSamples.length).toBeGreaterThanOrEqual(12);
    expect(auditTrailSamples.length).toBeLessThanOrEqual(14);

    const requiredDomains: PunjabiA1AuditTrailDomain[] = [
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
    const domains = new Set(auditTrailSamples.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes audit trail, traceability, evidence receipt, completion record, inventory seal, catalog, pre-integration, and readiness styles", () => {
    const requiredStyles: PunjabiA1AuditTrailStyle[] = [
      "pre_a11_audit_trail",
      "traceability",
      "evidence_receipt",
      "completion_record",
      "inventory_seal",
      "catalog",
      "pre_integration",
      "readiness_check",
    ];
    const styles = new Set(auditTrailSamples.map((item) => item.style));

    for (const style of requiredStyles) {
      expect(styles, `missing style ${style}`).toContain(style);
    }
  });

  it("uses Gurmukhi primary with romanization, bilingual goals, and audit links", () => {
    for (const item of auditTrailSamples) {
      expect(item.id).toMatch(/^pa_a1_audit_trail_/);
      expect(item.cue_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.audit_goal_vi.trim().length).toBeGreaterThan(0);
      expect(item.audit_goal_en.trim().length).toBeGreaterThan(0);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.audit_note_vi.trim().length).toBeGreaterThan(0);
      expect(item.audit_note_en.trim().length).toBeGreaterThan(0);
      expect(item.source_traceability_id).toMatch(/^pa_a1_traceability_/);
      expect(item.source_evidence_receipt_id).toMatch(/^pa_a1_evidence_receipt_/);
      expect(item.source_completion_record_id).toMatch(/^pa_a1_completion_record_/);
      expect(item.source_inventory_seal_id).toMatch(/^pa_a1_inventory_seal_/);
      expect(item.source_catalog_id).toMatch(/^pa_a1_catalog_/);
      expect(item.audit_artifacts.length).toBeGreaterThanOrEqual(14);
      expect(item.audit_artifacts).toContain(item.source_traceability_id);
      expect(item.audit_artifacts).toContain(item.source_evidence_receipt_id);
      expect(item.audit_artifacts).toContain(item.source_completion_record_id);
      expect(item.audit_artifacts).toContain(item.source_inventory_seal_id);
      expect(item.audit_artifacts).toContain(item.source_catalog_id);

      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes traps, Canada-practical examples, and romanization bridge items", () => {
    const traps = auditTrailSamples.flatMap((item) => (item.learner_trap ? [item.learner_trap] : []));
    const canadaItems = auditTrailSamples.filter((item) => item.canada_practical);
    const romanizationBridge = auditTrailSamples.find((item) => item.domain === "romanization_bridge");

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    expect(JSON.stringify(canadaItems)).toMatch(/Canada|clinic|school|library|service|bus|cashier|counter/i);
    expect(romanizationBridge?.romanization).toMatch(LATIN);
    expect(JSON.stringify(romanizationBridge)).toMatch(/Gurmukhi|romanization|cầu nối/i);
  });

  it("verifies beginner readiness across the stable audit trail samples", () => {
    const allText = JSON.stringify(auditTrailSamples);

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
    expect(allText).toMatch(/audit trail|traceability|evidence receipt|pre_a11_audit_trail|pre-integration/i);
  });

  it("mentions Shahmukhi only as awareness and avoids disallowed claims and systems", () => {
    const allText = `${auditTrailScriptAwareness} ${JSON.stringify(auditTrailSamples)}`;

    expect(auditTrailScriptAwareness).toContain("Shahmukhi");
    expect(auditTrailScriptAwareness).toContain("awareness only");
    expect(auditTrailScriptAwareness).toContain("Native review is deferred");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration|\.local/i);
  });
});
