import { describe, expect, it } from "vitest";

import punjabiA1LearnerJourney, {
  learnerJourneyScriptAwareness,
  punjabiA1LearnerJourney as namedLearnerJourney,
  type PunjabiLearnerJourneyActivity,
  type PunjabiLearnerJourneyStage,
} from "@/languages/punjabi/learnerJourneyA1";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 learner journey", () => {
  it("exports app-consumable named and default arrays", () => {
    expect(punjabiA1LearnerJourney).toBe(namedLearnerJourney);
    expect(Array.isArray(punjabiA1LearnerJourney)).toBe(true);
  });

  it("is compact, ordered, and covers the required learner journey stages", () => {
    expect(punjabiA1LearnerJourney.length).toBeGreaterThanOrEqual(10);
    expect(punjabiA1LearnerJourney.length).toBeLessThanOrEqual(18);

    const orders = punjabiA1LearnerJourney.map((step) => step.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));

    const requiredStages: PunjabiLearnerJourneyStage[] = [
      "gurmukhi_first_contact",
      "greetings",
      "identity",
      "family",
      "numbers",
      "food",
      "directions",
      "help",
      "polite_requests",
      "canada_services",
      "a1_handoff",
    ];
    const stages = new Set(punjabiA1LearnerJourney.map((step) => step.stage));

    for (const stage of requiredStages) {
      expect(stages, `missing stage ${stage}`).toContain(stage);
    }
  });

  it("includes learner-journey, handoff, and readiness activity styles", () => {
    const requiredActivities: PunjabiLearnerJourneyActivity[] = [
      "exposure",
      "guided_practice",
      "recall",
      "mini_roleplay",
      "readiness_check",
      "handoff",
    ];
    const activities = new Set(punjabiA1LearnerJourney.map((step) => step.activity));

    for (const activity of requiredActivities) {
      expect(activities, `missing activity ${activity}`).toContain(activity);
    }
  });

  it("uses Gurmukhi primary, romanization where useful, and bilingual explanations", () => {
    for (const step of punjabiA1LearnerJourney) {
      expect(step.id).toMatch(/^pa_a1_journey_/);
      expect(step.sample_pa).toMatch(GURMUKHI_SCRIPT);
      expect(step.title_vi.trim().length).toBeGreaterThan(0);
      expect(step.title_en.trim().length).toBeGreaterThan(0);
      expect(step.learner_goal_vi.trim().length).toBeGreaterThan(0);
      expect(step.learner_goal_en.trim().length).toBeGreaterThan(0);
      expect(step.sample_vi.trim().length).toBeGreaterThan(0);
      expect(step.sample_en.trim().length).toBeGreaterThan(0);
      expect(step.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(step.explanation_en.trim().length).toBeGreaterThan(0);
      expect(step.readiness_signal_vi.trim().length).toBeGreaterThan(0);
      expect(step.readiness_signal_en.trim().length).toBeGreaterThan(0);
      expect(step.handoff_next_vi.trim().length).toBeGreaterThan(0);
      expect(step.handoff_next_en.trim().length).toBeGreaterThan(0);
      expect(step.review_links.length).toBeGreaterThanOrEqual(2);

      if (step.romanization) {
        expect(step.romanization).toMatch(LATIN);
      }
    }
  });

  it("includes learner traps and Canada-practical journey steps", () => {
    const traps = punjabiA1LearnerJourney.flatMap((step) => step.learner_trap ? [step.learner_trap] : []);
    const trapAudiences = new Set(traps.map((trap) => trap.audience));
    const canadaSteps = punjabiA1LearnerJourney.filter((step) => step.canada_practical);

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(trapAudiences.has("vi") || trapAudiences.has("both")).toBe(true);
    expect(trapAudiences.has("en") || trapAudiences.has("both")).toBe(true);
    expect(canadaSteps.length).toBeGreaterThanOrEqual(7);
    expect(JSON.stringify(canadaSteps)).toMatch(/ਫਾਰਮ|ਟਿਕਟ|ਡਾਲਰ|ਕਲਿਨਿਕ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ|ਬੱਸ|ਮਦਦ/);
  });

  it("moves from first Gurmukhi exposure to basic service phrases", () => {
    const allText = JSON.stringify(punjabiA1LearnerJourney);

    expect(punjabiA1LearnerJourney[0].stage).toBe("gurmukhi_first_contact");
    expect(punjabiA1LearnerJourney.at(-1)?.stage).toBe("a1_handoff");
    expect(allText).toMatch(/ਪਾਣੀ|ਮਦਦ|ਬੱਸ/);
    expect(allText).toMatch(/ਸਤ ਸ੍ਰੀ ਅਕਾਲ|ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ/);
    expect(allText).toMatch(/ਮੇਰਾ ਨਾਮ|ਤੁਹਾਡਾ ਨਾਮ/);
    expect(allText).toMatch(/ਮੇਰੀ ਮਾਂ|ਮੇਰੇ ਕੋਲ ਇੱਕ ਭੈਣ/);
    expect(allText).toMatch(/ਦੋ ਟਿਕਟਾਂ|ਪੰਜ ਡਾਲਰ/);
    expect(allText).toMatch(/ਸ਼ਾਕਾਹਾਰੀ|ਚਾਹੀਦਾ ਹੈ/);
    expect(allText).toMatch(/ਕਿੱਥੇ|ਸੱਜੇ|ਖੱਬੇ/);
    expect(allText).toMatch(/ਮਦਦ ਕਰੋ|ਸਮਝ ਨਹੀਂ/);
    expect(allText).toMatch(/ਮਾਫ਼ ਕਰਨਾ|ਧੰਨਵਾਦ|ਕਿਰਪਾ ਕਰਕੇ/);
    expect(allText).toMatch(/ਫਾਰਮ|ਅਪਾਇੰਟਮੈਂਟ|ਪਛਾਣ/);
  });

  it("mentions Shahmukhi only as awareness and does not claim native review or unrelated systems", () => {
    const allText = `${learnerJourneyScriptAwareness} ${JSON.stringify(punjabiA1LearnerJourney)}`;

    expect(learnerJourneyScriptAwareness).toContain("Shahmukhi");
    expect(learnerJourneyScriptAwareness).toContain("awareness only");
    expect(allText).not.toMatch(/native[- ]speaker review|native reviewed/i);
    expect(allText).not.toMatch(/audioUrl|pronunciationScore|Azure|auth|billing|RLS|Supabase|CI config|A11 integration/i);
  });
});
