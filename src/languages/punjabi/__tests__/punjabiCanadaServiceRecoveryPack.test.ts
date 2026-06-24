import { describe, expect, it } from "vitest";

import recoveryPack, {
  PUNJABI_CANADA_SERVICE_RECOVERY_PACK,
  PUNJABI_CANADA_SERVICE_RECOVERY_PACK_SCOPE,
  type PunjabiCanadaServiceRecoveryDomain,
} from "@/languages/punjabi/canadaServiceRecoveryPack";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_DOMAINS: PunjabiCanadaServiceRecoveryDomain[] = [
  "clinic",
  "pharmacy",
  "school_childcare",
  "bank",
  "housing",
  "transport",
  "public_office",
  "service_desk",
  "interpreter_request",
  "emergency_boundary",
  "workplace_safety",
];

describe("Punjabi Canada service recovery pack", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(recoveryPack).toBe(PUNJABI_CANADA_SERVICE_RECOVERY_PACK);
    expect(Array.isArray(recoveryPack)).toBe(true);
    expect(PUNJABI_CANADA_SERVICE_RECOVERY_PACK_SCOPE.name).toContain("Service Recovery");
  });

  it("covers the required Canada service recovery domains compactly", () => {
    expect(recoveryPack.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(recoveryPack.length).toBeLessThanOrEqual(18);

    const present = new Set(recoveryPack.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("uses stable ids and the requested recovery styles", () => {
    const ids = recoveryPack.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(recoveryPack.some((item) => item.use === "service_recovery")).toBe(true);
    expect(recoveryPack.some((item) => item.use === "final_hardening")).toBe(true);
    expect(recoveryPack.some((item) => item.use === "export_readiness")).toBe(true);
    expect(recoveryPack.some((item) => item.use === "review")).toBe(true);
    expect(recoveryPack.some((item) => item.use === "regression")).toBe(true);
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const item of recoveryPack) {
      expect(item.recovery_pa).toMatch(GURMUKHI_BLOCK);
      expect(item.recovery_steps_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.recovery_steps_pa) {
        expect(line).toMatch(GURMUKHI_BLOCK);
      }

      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.failure_vi.length).toBeGreaterThan(20);
      expect(item.failure_en.length).toBeGreaterThan(20);
      expect(item.recovery_goal_vi.length).toBeGreaterThan(20);
      expect(item.recovery_goal_en.length).toBeGreaterThan(20);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.hardening_note_vi.length).toBeGreaterThan(20);
      expect(item.hardening_note_en.length).toBeGreaterThan(20);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng|Câu này|Đây là/u);
      expect(item.canada_example_en).toMatch(/Canada|Use|This|In Canada|At a Canadian/u);
    }
  });

  it("includes learner traps and hardening notes for recovery", () => {
    const traps = recoveryPack.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    const hardening = recoveryPack.filter((item) => item.use === "final_hardening" || item.use === "export_readiness");

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(hardening.length).toBeGreaterThanOrEqual(3);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_CANADA_SERVICE_RECOVERY_PACK_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_CANADA_SERVICE_RECOVERY_PACK_SCOPE.reviewStatus).toBe("Native review is deferred.");

    const allContent = JSON.stringify({
      scope: PUNJABI_CANADA_SERVICE_RECOVERY_PACK_SCOPE,
      recoveryPack,
    });
    expect(allContent).not.toMatch(/native reviewed|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allContent = JSON.stringify(recoveryPack);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
