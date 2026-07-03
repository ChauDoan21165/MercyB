import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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

function pageSource(fileName: string): string {
  return readFileSync(resolve(process.cwd(), "src/pages/professions", fileName), "utf8");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type ProfessionLesson = {
  title_vi: string;
  sentences: readonly {
    en: string;
    vi: string;
    pronunciation_focus: readonly string[];
  }[];
  cultural_notes_vi: string;
  tip_advice_vi: string;
};

type ProfessionPageCase = {
  name: string;
  Page: ComponentType;
  componentName: string;
  heading: RegExp;
  expectedLessons: number;
  route: string;
  sourceFile: string;
  categories: readonly { id: string; title_vi: string; title_en: string }[];
  getLessons: (id: string) => readonly ProfessionLesson[];
};

const lessonPageCases: ProfessionPageCase[] = [
  {
    name: "nail technician",
    Page: NailTechLessonsPage,
    componentName: "NailTechLessonsPage",
    heading: /Tiếng Anh cho thợ nail/i,
    expectedLessons: countLessons(NAIL_TECH_CATEGORIES, getNailTechLessonsByCategory),
    route: "/professions/nail-tech",
    sourceFile: "NailTechLessonsPage.tsx",
    categories: NAIL_TECH_CATEGORIES,
    getLessons: getNailTechLessonsByCategory as ProfessionPageCase["getLessons"],
  },
  {
    name: "restaurant",
    Page: RestaurantLessonsPage,
    componentName: "RestaurantLessonsPage",
    heading: /Tiếng Anh dành cho người làm nhà hàng/i,
    expectedLessons: countLessons(RESTAURANT_CATEGORIES, getRestaurantLessonsByCategory),
    route: "/professions/restaurant",
    sourceFile: "RestaurantLessonsPage.tsx",
    categories: RESTAURANT_CATEGORIES,
    getLessons: getRestaurantLessonsByCategory as ProfessionPageCase["getLessons"],
  },
  {
    name: "customer service",
    Page: CustomerServiceLessonsPage,
    componentName: "CustomerServiceLessonsPage",
    heading: /Tiếng Anh cho chăm sóc khách hàng/i,
    expectedLessons: countLessons(CUSTOMER_SERVICE_CATEGORIES, getCustomerServiceLessonsByCategory),
    route: "/professions/customer-service",
    sourceFile: "CustomerServiceLessonsPage.tsx",
    categories: CUSTOMER_SERVICE_CATEGORIES,
    getLessons: getCustomerServiceLessonsByCategory as ProfessionPageCase["getLessons"],
  },
  {
    name: "tech worker",
    Page: TechWorkerLessonsPage,
    componentName: "TechWorkerLessonsPage",
    heading: /Tiếng Anh cho người làm tech/i,
    expectedLessons: countLessons(TECH_WORKER_CATEGORIES, getTechWorkerLessonsByCategory),
    route: "/professions/tech-worker",
    sourceFile: "TechWorkerLessonsPage.tsx",
    categories: TECH_WORKER_CATEGORIES,
    getLessons: getTechWorkerLessonsByCategory as ProfessionPageCase["getLessons"],
  },
  {
    name: "healthcare",
    Page: HealthcareLessonsPage,
    componentName: "HealthcareLessonsPage",
    heading: /Tiếng Anh cho nhân viên y tế/i,
    expectedLessons: countLessons(HEALTHCARE_CATEGORIES, getHealthcareLessonsByCategory),
    route: "/professions/healthcare",
    sourceFile: "HealthcareLessonsPage.tsx",
    categories: HEALTHCARE_CATEGORIES,
    getLessons: getHealthcareLessonsByCategory as ProfessionPageCase["getLessons"],
  },
  {
    name: "drivers",
    Page: DriversLessonsPage,
    componentName: "DriversLessonsPage",
    heading: /Tiếng Anh cho tài xế/i,
    expectedLessons: countLessons(DRIVER_CATEGORIES, getDriverLessonsByCategory),
    route: "/professions/drivers",
    sourceFile: "DriversLessonsPage.tsx",
    categories: DRIVER_CATEGORIES,
    getLessons: getDriverLessonsByCategory as ProfessionPageCase["getLessons"],
  },
  {
    name: "hospitality",
    Page: HospitalityLessonsPage,
    componentName: "HospitalityLessonsPage",
    heading: /Tiếng Anh cho ngành khách sạn/i,
    expectedLessons: countLessons(HOSPITALITY_CATEGORIES, getHospitalityLessonsByCategory),
    route: "/professions/hospitality",
    sourceFile: "HospitalityLessonsPage.tsx",
    categories: HOSPITALITY_CATEGORIES,
    getLessons: getHospitalityLessonsByCategory as ProfessionPageCase["getLessons"],
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

    expect(hrefs).toEqual(expect.arrayContaining(lessonPageCases.map((testCase) => testCase.route)));
    expect(hrefs.filter((href) => lessonPageCases.some((testCase) => testCase.route === href))).toHaveLength(
      lessonPageCases.length,
    );
  });

  it.each(lessonPageCases)("renders the full local lesson set for $name", ({ Page, heading, expectedLessons }) => {
    renderWithRouter(<Page />);

    expect(screen.getByRole("heading", { name: heading })).toBeTruthy();
    expect(screen.getByRole("link", { name: /View other professions/i }).getAttribute("href")).toBe("/professions");
    expect(screen.getAllByRole("button")).toHaveLength(expectedLessons);
  });

  it.each(lessonPageCases)("keeps $name backed by local static page code", ({ sourceFile }) => {
    const source = pageSource(sourceFile);

    expect(source).not.toMatch(/useLessonData|fetchLessonsBatch|supabase\.from|createClient|from\(["']@\/integrations\/supabase/i);
    expect(source).not.toMatch(/\bfetch\s*\(/);
    expect(source).not.toMatch(/Promise\.resolve\s*\([^)]*(audio|ai|tutor|lesson)/i);
    expect(source).not.toMatch(/fake(Audio|AI|Tutor)|fake audio|fake ai|fake tutor/i);
  });

  it("keeps every active profession page registered in AppRouter", () => {
    const routerSource = readFileSync(resolve(process.cwd(), "src/router/AppRouter.tsx"), "utf8");

    for (const testCase of lessonPageCases) {
      expect(routerSource).toContain(`path="${testCase.route}"`);
      expect(routerSource).toContain(`<${testCase.componentName} />`);
    }
  });

  it.each(lessonPageCases)("renders every local category heading for $name", ({ Page, categories }) => {
    renderWithRouter(<Page />);

    for (const category of categories) {
      expect(screen.getByRole("heading", { name: category.title_vi })).toBeTruthy();
      expect(document.body.textContent).toContain(category.title_en);
    }
  });

  it.each(lessonPageCases)("expands real lesson detail for $name", async ({ Page, categories, getLessons }) => {
    const user = userEvent.setup();
    const firstLesson = getLessons(categories[0].id)[0];
    const firstSentence = firstLesson.sentences[0];

    renderWithRouter(<Page />);
    await user.click(screen.getByRole("button", { name: new RegExp(escapeRegExp(firstLesson.title_vi), "i") }));

    expect(screen.getByText(firstSentence.en)).toBeTruthy();
    expect(screen.getByText(firstSentence.vi)).toBeTruthy();
    expect(document.body.textContent).toContain(firstSentence.pronunciation_focus[0]);
    expect(document.body.textContent).toContain(firstLesson.cultural_notes_vi);
    expect(document.body.textContent).toContain(firstLesson.tip_advice_vi);
  });
});
