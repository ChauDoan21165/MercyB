import { describe, expect, it } from "vitest";

import {
  buildAdaptiveMasteryPlan,
  buildDefaultMasteryCatalog,
  estimateSkillMastery,
  type LearnerInteraction,
  type MasteryCatalog,
} from "@/lib/mastery";

const now = new Date("2026-06-13T12:00:00Z");

function compactCatalog(): MasteryCatalog {
  const full = buildDefaultMasteryCatalog();
  const themes = full.themes.slice(0, 3);
  const themeIds = new Set(themes.map((theme) => theme.id));
  return {
    themes,
    skills: full.skills.filter((skill) => themeIds.has(skill.themeId)),
    items: full.items.filter((item) => themeIds.has(item.themeId)),
  };
}

describe("adaptive mastery engine", () => {
  it("keeps new learners on sensible default ordering", () => {
    const ranked = buildAdaptiveMasteryPlan({
      catalog: compactCatalog(),
      interactions: [],
      now,
      limit: 3,
    });

    expect(ranked.map((item) => item.reasonCode)).toEqual([
      "confidence_limited",
      "confidence_limited",
      "confidence_limited",
    ]);
    expect(ranked.map((item) => item.item.id)).toEqual([
      "food-vocabulary-practice-1",
      "food-grammar-practice-1",
      "food-listening-practice-1",
    ]);
  });

  it("prioritizes FSRS due reviews before default-path items", () => {
    const interactions: LearnerInteraction[] = [
      {
        itemId: "family-grammar-practice-1",
        outcome: "incorrect",
        occurredAt: "2026-06-10T12:00:00Z",
        fsrsRating: "again",
      },
      ...Array.from({ length: 4 }, (_, index) => ({
        itemId: "work-speaking-practice-1",
        outcome: "incorrect" as const,
        occurredAt: `2026-06-0${index + 1}T12:00:00Z`,
        fsrsRating: "easy" as const,
      })),
    ];

    const ranked = buildAdaptiveMasteryPlan({
      catalog: compactCatalog(),
      interactions,
      now,
      limit: 3,
    });

    expect(ranked[0]).toMatchObject({
      item: { id: "family-grammar-practice-1" },
      reasonCode: "review_due",
    });
    expect(ranked.map((item) => item.reasonCode)).toContain("weak_skill");
    expect(ranked[0].reviewState?.dueAt).toBeLessThanOrEqual(now.getTime());
    expect(ranked.some((item) => item.reasonCode === "confidence_limited")).toBe(true);
  });

  it("does not rank non-reviewable items as FSRS due work", () => {
    const catalog = compactCatalog();
    catalog.items = catalog.items.map((item) =>
      item.id === "family-grammar-practice-1" ? { ...item, reviewable: false } : item,
    );
    const interactions: LearnerInteraction[] = [
      {
        itemId: "family-grammar-practice-1",
        outcome: "incorrect",
        occurredAt: "2026-06-10T12:00:00Z",
        fsrsRating: "again",
      },
    ];

    const ranked = buildAdaptiveMasteryPlan({
      catalog,
      interactions,
      now,
      limit: 12,
    });
    const nonReviewable = ranked.find((item) => item.item.id === "family-grammar-practice-1");

    expect(nonReviewable?.reviewState?.dueAt).toBeLessThanOrEqual(now.getTime());
    expect(nonReviewable?.reasonCode).not.toBe("review_due");
  });

  it("ignores telemetry for out-of-catalog skills", () => {
    const catalog = compactCatalog();
    const states = estimateSkillMastery(catalog, [
      {
        itemId: "food-vocabulary-practice-1",
        skillId: "not-a-catalog-skill",
        outcome: "incorrect",
        occurredAt: "2026-06-10T12:00:00Z",
      },
    ]);

    expect(states.has("not-a-catalog-skill")).toBe(false);
    expect(states.get("food:vocabulary")).toMatchObject({
      evidenceCount: 0,
      probabilityKnown: 0.25,
    });
  });

  it("selects weakest confident skills when review pressure is absent", () => {
    const interactions: LearnerInteraction[] = [
      ...Array.from({ length: 4 }, (_, index) => ({
        itemId: "work-speaking-practice-1",
        outcome: "incorrect" as const,
        occurredAt: `2026-06-0${index + 1}T12:00:00Z`,
        fsrsRating: "easy" as const,
      })),
      ...Array.from({ length: 4 }, (_, index) => ({
        itemId: "food-vocabulary-practice-1",
        outcome: "correct" as const,
        occurredAt: `2026-06-0${index + 1}T13:00:00Z`,
        fsrsRating: "easy" as const,
      })),
    ];

    const ranked = buildAdaptiveMasteryPlan({
      catalog: compactCatalog(),
      interactions,
      now,
      limit: 5,
    });

    expect(ranked[0]).toMatchObject({
      item: { id: "work-speaking-practice-1" },
      reasonCode: "weak_skill",
    });
    expect(ranked[0].skillStates[0].confidence).toBeGreaterThanOrEqual(0.45);
  });

  it("limits aggressive swings when evidence conflicts", () => {
    const interactions: LearnerInteraction[] = [
      {
        itemId: "food-speaking-practice-1",
        outcome: "correct",
        occurredAt: "2026-06-11T12:00:00Z",
        fsrsRating: "easy",
      },
      {
        itemId: "food-speaking-practice-1",
        outcome: "incorrect",
        occurredAt: "2026-06-12T12:00:00Z",
        fsrsRating: "easy",
      },
    ];

    const ranked = buildAdaptiveMasteryPlan({
      catalog: compactCatalog(),
      interactions,
      now,
      limit: 12,
    });
    const conflicted = ranked.find((item) => item.item.id === "food-speaking-practice-1");

    expect(conflicted?.reasonCode).toBe("confidence_limited");
    expect(ranked[0].reasonCode).not.toBe("weak_skill");
  });

  it("uses the 22-theme default content structure", () => {
    const catalog = buildDefaultMasteryCatalog();

    expect(catalog.themes).toHaveLength(22);
    expect(catalog.skills).toHaveLength(88);
    expect(catalog.items.every((item) => item.reviewable)).toBe(true);
  });
});
