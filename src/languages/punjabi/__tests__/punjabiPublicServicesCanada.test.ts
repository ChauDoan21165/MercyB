// Punjabi Canada public services pack guards. These validate app-consumable
// structure and scope, not certification, official placement, or native review.

import { describe, expect, it } from "vitest";

import publicServicesCanada, {
  PUNJABI_PUBLIC_SERVICES_CANADA,
  PUNJABI_PUBLIC_SERVICES_CANADA_SCOPE,
  type PunjabiPublicServicesCanadaDomain,
} from "@/languages/punjabi/publicServicesCanada";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_DOMAINS: PunjabiPublicServicesCanadaDomain[] = [
  "clinic",
  "pharmacy",
  "school_office",
  "bank",
  "government_office",
  "library_community_center",
  "emergency_help",
  "workplace_safety",
  "housing_repair",
  "transport_customer_service",
];

describe("Punjabi Canada public services pack", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(publicServicesCanada).toBe(PUNJABI_PUBLIC_SERVICES_CANADA);
    expect(Array.isArray(publicServicesCanada)).toBe(true);
    expect(PUNJABI_PUBLIC_SERVICES_CANADA_SCOPE.name).toContain("Public Services Pack");
  });

  it("covers the required Canada public-service domains compactly", () => {
    expect(publicServicesCanada.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(publicServicesCanada.length).toBeLessThanOrEqual(14);

    const present = new Set(publicServicesCanada.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("uses stable ids and the requested service styles", () => {
    const ids = publicServicesCanada.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(publicServicesCanada.some((item) => item.use === "service_support")).toBe(true);
    expect(publicServicesCanada.some((item) => item.use === "public_service_recovery")).toBe(true);
    expect(publicServicesCanada.some((item) => item.use === "practical_followup")).toBe(false);
    expect(publicServicesCanada.some((item) => item.use === "review")).toBe(true);
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const item of publicServicesCanada) {
      expect(item.phrase_pa).toMatch(GURMUKHI_BLOCK);
      expect(item.support_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.support_pa) {
        expect(line).toMatch(GURMUKHI_BLOCK);
      }

      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.situation_vi.length).toBeGreaterThan(20);
      expect(item.situation_en.length).toBeGreaterThan(20);
      expect(item.goal_vi.length).toBeGreaterThan(10);
      expect(item.goal_en.length).toBeGreaterThan(10);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.public_service_check_vi.length).toBeGreaterThan(20);
      expect(item.public_service_check_en.length).toBeGreaterThan(20);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng/u);
      expect(item.canada_example_en).toMatch(/Canada|Use|In Canada|At a Canadian/u);
    }
  });

  it("includes learner traps and Canada-practical public service coverage", () => {
    const traps = publicServicesCanada.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(8);

    const allContent = JSON.stringify(publicServicesCanada);
    expect(allContent).toMatch(/clinic|pharmacy|school|bank|government|library|community|emergency|workplace|housing|transport/i);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_PUBLIC_SERVICES_CANADA_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_PUBLIC_SERVICES_CANADA_SCOPE.reviewStatus).toBe("Native review is deferred.");

    const allContent = JSON.stringify({
      scope: PUNJABI_PUBLIC_SERVICES_CANADA_SCOPE,
      publicServicesCanada,
    });
    expect(allContent).not.toMatch(/native reviewed|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allContent = JSON.stringify(publicServicesCanada);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
