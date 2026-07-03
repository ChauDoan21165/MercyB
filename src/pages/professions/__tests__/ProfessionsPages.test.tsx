import { render, screen } from "@testing-library/react";
import type { ComponentType, ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import CustomerServiceLessonsPage from "../CustomerServiceLessonsPage";
import DriversLessonsPage from "../DriversLessonsPage";
import HealthcareLessonsPage from "../HealthcareLessonsPage";
import HospitalityLessonsPage from "../HospitalityLessonsPage";
import NailTechLessonsPage from "../NailTechLessonsPage";
import ProfessionsIndexPage from "../ProfessionsIndexPage";
import RestaurantLessonsPage from "../RestaurantLessonsPage";
import TechWorkerLessonsPage from "../TechWorkerLessonsPage";
import {
  CUSTOMER_SERVICE_CATEGORIES,
  getLessonsByCategory as getCustomerServiceLessonsByCategory,
} from "@/data/profession-packs/customer-service/content";
import {
  DRIVER_CATEGORIES,
  getLessonsByCategory as getDriverLessonsByCategory,
} from "@/data/profession-packs/drivers/content";
import {
  NAIL_TECH_CATEGORIES,
  getLessonsByCategory as getNailTechLessonsByCategory,
} from "@/data/profession-packs/nail-technician/content";
import {
  RESTAURANT_CATEGORIES,
  getRestaurantLessonsByCategory,
} from "@/data/profession-packs/restaurant/content";
import {
  HEALTHCARE_CATEGORIES,
  getHealthcareLessonsByCategory,
} from "@/data/profession-packs/healthcare/content";
import {
  HOSPITALITY_CATEGORIES,
  getHospitalityLessonsByCategory,
} from "@/data/profession-packs/hospitality/content";
import {
  TECH_WORKER_CATEGORIES,
  getLessonsByCategory as getTechWorkerLessonsByCategory,
} from "@/data/profession-packs/tech-worker/content";

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
    expectedLessons: countLessons(NAIL_TECH_CATEGORIES, getNailTechLessonsByCategory),
  },
  {
    name: "restaurant",
    Page: RestaurantLessonsPage,
    heading: /Tiếng Anh dành cho người làm nhà hàng/i,
    expectedLessons: countLessons(RESTAURANT_CATEGORIES, getRestaurantLessonsByCategory),
  },
  {
    name: "customer service",
    Page: CustomerServiceLessonsPage,
    heading: /Tiếng Anh cho chăm sóc khách hàng/i,
    expectedLessons: countLessons(CUSTOMER_SERVICE_CATEGORIES, getCustomerServiceLessonsByCategory),
  },
  {
    name: "tech worker",
    Page: TechWorkerLessonsPage,
    heading: /Tiếng Anh cho người làm tech/i,
    expectedLessons: countLessons(TECH_WORKER_CATEGORIES, getTechWorkerLessonsByCategory),
  },
  {
    name: "healthcare",
    Page: HealthcareLessonsPage,
    heading: /Tiếng Anh cho nhân viên y tế/i,
    expectedLessons: countLessons(HEALTHCARE_CATEGORIES, getHealthcareLessonsByCategory),
  },
  {
    name: "drivers",
    Page: DriversLessonsPage,
    heading: /Tiếng Anh cho tài xế/i,
    expectedLessons: countLessons(DRIVER_CATEGORIES, getDriverLessonsByCategory),
  },
  {
    name: "hospitality",
    Page: HospitalityLessonsPage,
    heading: /Tiếng Anh cho ngành khách sạn/i,
    expectedLessons: countLessons(HOSPITALITY_CATEGORIES, getHospitalityLessonsByCategory),
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
