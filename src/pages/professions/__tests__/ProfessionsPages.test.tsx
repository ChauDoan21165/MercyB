import { render, screen } from "@testing-library/react";
import type { ComponentType, ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import HealthcareLessonsPage from "../HealthcareLessonsPage";
import NailTechLessonsPage from "../NailTechLessonsPage";
import ProfessionsIndexPage from "../ProfessionsIndexPage";
import RestaurantLessonsPage from "../RestaurantLessonsPage";
import {
  NAIL_TECH_CATEGORIES,
  getLessonsByCategory,
} from "@/data/profession-packs/nail-technician/content";
import {
  RESTAURANT_CATEGORIES,
  getRestaurantLessonsByCategory,
} from "@/data/profession-packs/restaurant/content";
import {
  HEALTHCARE_CATEGORIES,
  getHealthcareLessonsByCategory,
} from "@/data/profession-packs/healthcare/content";

function renderWithRouter(element: ReactElement) {
  return render(<MemoryRouter>{element}</MemoryRouter>);
}

function countLessons<CategoryId extends string>(
  categories: readonly { id: CategoryId }[],
  getLessons: (id: CategoryId) => readonly unknown[],
): number {
  return categories.reduce((total, category) => total + getLessons(category.id).length, 0);
}

const lessonPageCases: {
  name: string;
  Page: ComponentType;
  heading: RegExp;
  expectedLessons: number;
}[] = [
  {
    name: "nail technician",
    Page: NailTechLessonsPage,
    heading: /Tiếng Anh cho thợ nail/i,
    expectedLessons: countLessons(NAIL_TECH_CATEGORIES, getLessonsByCategory),
  },
  {
    name: "restaurant",
    Page: RestaurantLessonsPage,
    heading: /Tiếng Anh dành cho người làm nhà hàng/i,
    expectedLessons: countLessons(RESTAURANT_CATEGORIES, getRestaurantLessonsByCategory),
  },
  {
    name: "healthcare",
    Page: HealthcareLessonsPage,
    heading: /Tiếng Anh cho nhân viên y tế/i,
    expectedLessons: countLessons(HEALTHCARE_CATEGORIES, getHealthcareLessonsByCategory),
  },
];

describe("profession pages", () => {
  it("renders public cards for every active profession route", () => {
    renderWithRouter(<ProfessionsIndexPage />);

    expect(screen.getByRole("heading", { name: /Tiếng Anh nghề nghiệp cho người Việt/i })).toBeTruthy();

    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"))
      .filter(Boolean);

    expect(hrefs).toEqual(
      expect.arrayContaining([
        "/professions/nail-tech",
        "/professions/restaurant",
        "/professions/customer-service",
        "/professions/tech-worker",
        "/professions/healthcare",
        "/professions/drivers",
        "/professions/hospitality",
      ]),
    );
  });

  it.each(lessonPageCases)("renders the full local lesson set for $name", ({ Page, heading, expectedLessons }) => {
    renderWithRouter(<Page />);

    expect(screen.getByRole("heading", { name: heading })).toBeTruthy();
    expect(screen.getByRole("link", { name: /View other professions/i }).getAttribute("href")).toBe("/professions");
    expect(screen.getAllByRole("button")).toHaveLength(expectedLessons);
  });
});
