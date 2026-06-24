import { describe, expect, it } from "vitest";
import {
  punjabiB1IntegratedRoleplaySet,
  type PunjabiB1IntegratedRoleplayFocus,
  type PunjabiIntegratedRoleplayLine,
} from "../integratedRoleplaySetB1";

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;
const LATIN_RE = /[a-z]/i;

const REQUIRED_FOCUSES: PunjabiB1IntegratedRoleplayFocus[] = [
  "situation_clarification",
  "polite_complaint_service",
  "workplace_update",
  "housing_school_issue",
  "retell_and_repair",
  "community_service_call",
  "health_service_language",
  "register_routing_review",
];

function expectLine(line: PunjabiIntegratedRoleplayLine) {
  expect(GURMUKHI_RE.test(line.pa)).toBe(true);
  expect(LATIN_RE.test(line.romanization)).toBe(true);
  expect(line.en.trim().length).toBeGreaterThan(0);
  expect(line.vi.trim().length).toBeGreaterThan(0);
}

describe("Punjabi B1 integrated roleplay set - batch", () => {
  it("has a compact useful integrated roleplay set", () => {
    expect(punjabiB1IntegratedRoleplaySet.length).toBeGreaterThanOrEqual(8);
    expect(punjabiB1IntegratedRoleplaySet.length).toBeLessThanOrEqual(12);
  });

  it("has unique ids and marks every roleplay B1", () => {
    const ids = punjabiB1IntegratedRoleplaySet.map((roleplay) => roleplay.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const roleplay of punjabiB1IntegratedRoleplaySet) {
      expect(roleplay.level).toBe("B1");
    }
  });

  it("covers required integrated focus areas", () => {
    const seen = new Set(punjabiB1IntegratedRoleplaySet.map((roleplay) => roleplay.focus));

    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus)).toBe(true);
    }
  });
});

describe("Punjabi B1 integrated roleplay set - learner content", () => {
  for (const roleplay of punjabiB1IntegratedRoleplaySet) {
    describe(roleplay.id, () => {
      it("has bilingual scenario framing and Canada-practical context", () => {
        expect(roleplay.title_en.trim().length).toBeGreaterThan(0);
        expect(roleplay.title_vi.trim().length).toBeGreaterThan(0);
        expect(roleplay.scenario_en.trim().length).toBeGreaterThan(0);
        expect(roleplay.scenario_vi.trim().length).toBeGreaterThan(0);
        expect(roleplay.canadaContext.trim().length).toBeGreaterThan(0);
      });

      it("has integrated skill goals in English and Vietnamese", () => {
        expect(roleplay.integratedSkills_en.length).toBeGreaterThanOrEqual(3);
        expect(roleplay.integratedSkills_vi.length).toBe(roleplay.integratedSkills_en.length);
      });

      it("has roleplay turns and model answer with Gurmukhi support", () => {
        expect(roleplay.roleplayTurns.length).toBeGreaterThanOrEqual(3);

        for (const turn of roleplay.roleplayTurns) {
          expect(["learner", "staff", "supervisor", "teacher", "friend"]).toContain(turn.speaker);
          expectLine(turn.line);
        }

        expect(roleplay.checkpointPrompt_en.trim().length).toBeGreaterThan(0);
        expect(roleplay.checkpointPrompt_vi.trim().length).toBeGreaterThan(0);
        expectLine(roleplay.learnerModelAnswer);
      });

      it("includes learner traps and integration-readiness routing", () => {
        expect(roleplay.commonTraps.length).toBeGreaterThanOrEqual(1);

        for (const trap of roleplay.commonTraps) {
          expect(trap.trap_en.trim().length).toBeGreaterThan(0);
          expect(trap.trap_vi.trim().length).toBeGreaterThan(0);
          expectLine(trap.better);
        }

        expect(roleplay.readinessRoute_en.trim().length).toBeGreaterThan(0);
        expect(roleplay.readinessRoute_vi.trim().length).toBeGreaterThan(0);
      });

      it("keeps health/service safety notes as language support only", () => {
        if (roleplay.focus !== "health_service_language") return;

        expect(`${roleplay.scenario_en} ${roleplay.canadaContext}`).toMatch(
          /language support only|language practice only/i,
        );
        expect(`${roleplay.scenario_vi} ${roleplay.canadaContext}`).toMatch(
          /Chỉ hỗ trợ ngôn ngữ|chỉ.*luyện ngôn ngữ/i,
        );
      });
    });
  }
});

describe("Punjabi B1 integrated roleplay set - scope guardrails", () => {
  it("mentions Shahmukhi only as awareness and defers native review", () => {
    const serialized = JSON.stringify(punjabiB1IntegratedRoleplaySet);

    expect(serialized).toMatch(/Shahmukhi/);
    expect(serialized).toMatch(/awareness/);
    expect(serialized).toMatch(/Native review is deferred/i);
  });
});
