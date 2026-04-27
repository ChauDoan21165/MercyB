import { describe, expect, it } from "vitest";
import { pickFirstLesson } from "../firstLesson";
import type {
  OnboardingGoal,
  OnboardingLevel,
  OnboardingProfession,
} from "../types";

const beginner: OnboardingLevel = "beginner";
const intermediate: OnboardingLevel = "intermediate";

describe("pickFirstLesson — career path", () => {
  it("routes career + restaurant to the restaurant pack", () => {
    const r = pickFirstLesson({
      goal: "career",
      profession: "restaurant",
      level: beginner,
    });
    expect(r.route).toBe("/professions/restaurant");
    expect(r.reason).toBe("profession_pack");
  });

  it("routes career + nail_tech to the nail technician pack", () => {
    const r = pickFirstLesson({
      goal: "career",
      profession: "nail_tech",
      level: intermediate,
    });
    expect(r.route).toBe("/professions/nail-technician");
    expect(r.reason).toBe("profession_pack");
  });

  it("routes career + each documented profession to its dedicated pack", () => {
    const matrix: Array<[OnboardingProfession, string]> = [
      ["restaurant", "/professions/restaurant"],
      ["nail_tech", "/professions/nail-technician"],
      ["customer_service", "/professions/customer-service"],
      ["healthcare", "/professions/healthcare"],
      ["tech", "/professions/tech"],
      ["driver", "/professions/drivers"],
      ["hospitality", "/professions/hospitality"],
    ];
    for (const [profession, route] of matrix) {
      const r = pickFirstLesson({ goal: "career", profession, level: beginner });
      expect(r.route).toBe(route);
      expect(r.reason).toBe("profession_pack");
    }
  });

  it("falls back to /rooms when career profession = 'other'", () => {
    const r = pickFirstLesson({ goal: "career", profession: "other", level: beginner });
    expect(r.route).toBe("/rooms");
    expect(r.reason).toBe("profession_pack");
  });

  it("routes career without profession to /rooms (browse generic work rooms)", () => {
    const r = pickFirstLesson({ goal: "career", profession: null, level: intermediate });
    expect(r.route).toBe("/rooms");
    expect(r.reason).toBe("career_no_profession");
  });
});

describe("pickFirstLesson — exam paths", () => {
  it("routes IELTS to the IELTS Speaking content pack", () => {
    const r = pickFirstLesson({ goal: "ielts", profession: null, level: intermediate });
    expect(r.route).toBe("/exam-prep/ielts/speaking");
    expect(r.reason).toBe("exam_landing");
  });

  it("routes VSTEP to the VSTEP Speaking landing", () => {
    const r = pickFirstLesson({ goal: "vstep", profession: null, level: beginner });
    expect(r.route).toBe("/exam/vstep/speaking");
    expect(r.reason).toBe("exam_landing");
  });

  it("routes TOEIC to the TOEIC practice pack", () => {
    const r = pickFirstLesson({ goal: "toeic", profession: null, level: beginner });
    expect(r.route).toBe("/exam-prep/toeic");
    expect(r.reason).toBe("exam_landing");
  });

  it("ignores profession field when goal is an exam track", () => {
    const r = pickFirstLesson({ goal: "ielts", profession: "tech", level: intermediate });
    expect(r.route).toBe("/exam-prep/ielts/speaking");
  });
});

describe("pickFirstLesson — travel + general + missing inputs", () => {
  it("routes travel to /rooms", () => {
    const r = pickFirstLesson({ goal: "travel", profession: null, level: beginner });
    expect(r.route).toBe("/rooms");
    expect(r.reason).toBe("travel_default");
  });

  it("routes general learning to / (Home)", () => {
    const r = pickFirstLesson({ goal: "general", profession: null, level: intermediate });
    expect(r.route).toBe("/");
    expect(r.reason).toBe("general_default");
  });

  it("routes the skip flow (all null) to / (Home)", () => {
    const r = pickFirstLesson({ goal: null, profession: null, level: null });
    expect(r.route).toBe("/");
    expect(r.reason).toBe("skip_or_unknown");
  });

  it("never returns null/undefined for any combination — always a real route", () => {
    const goals: Array<OnboardingGoal | null> = [
      "career", "travel", "ielts", "vstep", "toeic", "general", null,
    ];
    const professions: Array<OnboardingProfession | null> = [
      "restaurant", "nail_tech", "customer_service", "healthcare",
      "tech", "driver", "hospitality", "other", null,
    ];
    const levels: Array<OnboardingLevel | null> = [
      "beginner", "elementary", "intermediate", "advanced", null,
    ];
    for (const goal of goals) {
      for (const profession of professions) {
        for (const level of levels) {
          const r = pickFirstLesson({ goal, profession, level });
          expect(typeof r.route).toBe("string");
          expect(r.route.length).toBeGreaterThan(0);
          expect(r.route.startsWith("/")).toBe(true);
        }
      }
    }
  });
});
