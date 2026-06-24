import { describe, expect, it } from "vitest";

import punjabiA1ReadinessGate, {
  punjabiA1ReadinessGate as namedReadinessGate,
  readinessGateScriptAwareness,
  type PunjabiReadinessSkill,
  type PunjabiReadinessTaskType,
} from "@/languages/punjabi/readinessGateA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 readiness gate", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1ReadinessGate).toBe(namedReadinessGate);
    expect(Array.isArray(punjabiA1ReadinessGate)).toBe(true);
  });

  it("is compact and covers required readiness skills", () => {
    expect(punjabiA1ReadinessGate.length).toBeGreaterThanOrEqual(14);
    expect(punjabiA1ReadinessGate.length).toBeLessThanOrEqual(28);

    const requiredSkills: PunjabiReadinessSkill[] = [
      "greet",
      "introduce_self",
      "gurmukhi_recognition",
      "simple_needs",
      "prices",
      "directions",
      "canada_service_counter",
    ];
    const skills = new Set(punjabiA1ReadinessGate.map((item) => item.skill));

    for (const skill of requiredSkills) {
      expect(skills, `missing skill ${skill}`).toContain(skill);
    }
  });

  it("includes checkpoint and routing style task types", () => {
    const requiredTypes: PunjabiReadinessTaskType[] = [
      "checkpoint_choice",
      "produce_phrase",
      "recognition",
      "route_next",
      "mini_scenario",
    ];
    const taskTypes = new Set(punjabiA1ReadinessGate.map((item) => item.task_type));

    for (const taskType of requiredTypes) {
      expect(taskTypes, `missing task type ${taskType}`).toContain(taskType);
    }
  });

  it("uses Gurmukhi primary, romanization where useful, and bilingual can-do support", () => {
    for (const item of punjabiA1ReadinessGate) {
      expect(item.id).toMatch(/^pa_a1_ready_/);
      expect(JSON.stringify(item.expected_answer_pa)).toMatch(GURMUKHI_SCRIPT);
      expect(item.can_do_vi.trim().length).toBeGreaterThan(0);
      expect(item.can_do_en.trim().length).toBeGreaterThan(0);
      expect(item.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(item.prompt_en.trim().length).toBeGreaterThan(0);
      expect(item.expected_answer_vi.trim().length).toBeGreaterThan(0);
      expect(item.expected_answer_en.trim().length).toBeGreaterThan(0);
      expect(item.pass_criteria_vi.trim().length).toBeGreaterThan(0);
      expect(item.pass_criteria_en.trim().length).toBeGreaterThan(0);

      if (item.romanization) {
        expect(item.romanization).toMatch(LATIN);
      }
    }
  });

  it("provides options for choice, recognition, and route tasks", () => {
    for (const item of punjabiA1ReadinessGate) {
      if (["checkpoint_choice", "recognition", "route_next"].includes(item.task_type)) {
        expect(item.options?.length ?? 0, `${item.id} missing options`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("includes route-if-missed remediation and review ids", () => {
    for (const item of punjabiA1ReadinessGate) {
      expect(item.route_if_missed.vi.trim().length).toBeGreaterThan(0);
      expect(item.route_if_missed.en.trim().length).toBeGreaterThan(0);
      expect(item.route_if_missed.review_ids.length).toBeGreaterThanOrEqual(2);
      for (const reviewId of item.route_if_missed.review_ids) {
        expect(reviewId).toMatch(/^pa_a1_/);
      }
    }
  });

  it("includes learner traps and Canada-practical service readiness", () => {
    const traps = punjabiA1ReadinessGate.flatMap((item) => item.learner_trap ? [item.learner_trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaItems = punjabiA1ReadinessGate.filter((item) => item.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(7);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaItems.length).toBeGreaterThanOrEqual(7);
    expect(JSON.stringify(canadaItems)).toMatch(/ਫਾਰਮ|ਟਿਕਟ|ਡਾਲਰ|ਕਲਿਨਿਕ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ|ਬੱਸ/);
  });

  it("mentions Shahmukhi only as awareness and does not claim native review or A11 integration", () => {
    const allText = `${readinessGateScriptAwareness} ${JSON.stringify(punjabiA1ReadinessGate)}`;

    expect(readinessGateScriptAwareness).toContain("Shahmukhi");
    expect(readinessGateScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|A11 integration/i);
  });
});
