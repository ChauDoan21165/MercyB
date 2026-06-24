import { describe, expect, it } from "vitest";

import receiptSamples, {
  punjabiA1ReceiptSamples as namedReceiptSamples,
  receiptScriptAwareness,
  type PunjabiA1ReceiptDomain,
  type PunjabiA1ReceiptStyle,
} from "@/languages/punjabi/a1ReceiptSamples";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 receipt samples", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(receiptSamples).toBe(namedReceiptSamples);
    expect(Array.isArray(receiptSamples)).toBe(true);
  });

  it("is compact and covers the required receipt domains", () => {
    expect(receiptSamples.length).toBeGreaterThanOrEqual(12);
    expect(receiptSamples.length).toBeLessThanOrEqual(14);

    const requiredDomains: PunjabiA1ReceiptDomain[] = [
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
    const domains = new Set(receiptSamples.map((item) => item.domain));

    for (const domain of requiredDomains) {
      expect(domains, `missing domain ${domain}`).toContain(domain);
    }
  });

  it("includes receipt, ledger, archive, pre-merge, pre-integration, qa, and readiness styles", () => {
    const requiredStyles: PunjabiA1ReceiptStyle[] = [
      "pre_a11_receipt",
      "ledger_entry",
      "archive_copy",
      "pre_merge",
      "pre_integration",
      "qa",
      "readiness_check",
    ];
    const styles = new Set(receiptSamples.map((item) => item.style));

    for (const style of requiredStyles) {
      expect(styles, `missing style ${style}`).toContain(style);
    }
  });

  it("uses Gurmukhi primary with bilingual support and review links", () => {
    for (const item of receiptSamples) {
      expect(item.id).toMatch(/^pa_a1_receipt_/);
      expect(item.cue_pa).toMatch(GURMUKHI_SCRIPT);
      expect(item.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(item.meaning_en.trim().length).toBeGreaterThan(0);
      expect(item.receipt_check_vi.trim().length).toBeGreaterThan(0);
      expect(item.receipt_check_en.trim().length).toBeGreaterThan(0);
      expect(item.preservation_vi.trim().length).toBeGreaterThan(0);
      expect(item.preservation_en.trim().length).toBeGreaterThan(0);
      expect(item.review_links.length).toBeGreaterThanOrEqual(2);

      for (const reviewId of item.review_links) {
        expect(reviewId).toMatch(/^pa_a1_receipt_/);
      }

      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes traps, Canada-practical examples, and romanization bridge items", () => {
    const traps = receiptSamples.flatMap((item) => (item.trap ? [item.trap] : []));
    const canadaItems = receiptSamples.filter((item) => item.canada_practical);
    const romanizationBridge = receiptSamples.find((item) => item.domain === "romanization_bridge");

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    expect(JSON.stringify(canadaItems)).toMatch(/Canada|clinic|school|library|service|bus|cashier|counter/i);
    expect(romanizationBridge?.romanization).toMatch(LATIN);
    expect(JSON.stringify(romanizationBridge)).toMatch(/Gurmukhi|Romanization|romanization/);
  });

  it("verifies beginner readiness across the stable receipt samples", () => {
    const allText = JSON.stringify(receiptSamples);

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
    expect(allText).toMatch(/receipt|ledger|archive|pre_a11_receipt|pre_merge|pre-integration|Ready|Sẵn sàng/i);
  });

  it("mentions Shahmukhi only as awareness and avoids disallowed claims and systems", () => {
    const allText = `${receiptScriptAwareness} ${JSON.stringify(receiptSamples)}`;

    expect(receiptScriptAwareness).toContain("Shahmukhi");
    expect(receiptScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
