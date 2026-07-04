import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UiLanguageProvider } from "@/contexts/UiLanguageContext";
import {
  PORTUGUESE_CATEGORIES,
  PORTUGUESE_LESSONS_BY_LEVEL,
  PORTUGUESE_TOTAL_LESSONS,
  PORTUGUESE_VALIDATED_LEVELS,
} from "@/languages/portuguese";
import LanguagesIndexPage from "@/pages/languages/LanguagesIndexPage";
import PortugueseLessonsPage from "@/pages/languages/PortugueseLessonsPage";

vi.mock("@/hooks/useLessonData", () => ({
  fetchLessonsBatch: vi.fn(() => {
    throw new Error("Portuguese page must render from local lesson arrays");
  }),
}));

const here = path.dirname(fileURLToPath(import.meta.url));
const ROUTER_SRC = readFileSync(
  path.resolve(here, "../../../router/AppRouter.tsx"),
  "utf8",
);
const PAGE_SRC = readFileSync(path.resolve(here, "../PortugueseLessonsPage.tsx"), "utf8");

function renderWithProviders(ui: ReactNode) {
  return render(
    <MemoryRouter>
      <UiLanguageProvider>{ui}</UiLanguageProvider>
    </MemoryRouter>,
  );
}

describe("Portuguese lessons page", () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("renders validated local lessons without a Supabase loading or empty state", () => {
    const { container } = renderWithProviders(<PortugueseLessonsPage />);
    const text = container.textContent ?? "";

    expect(text).toContain("Tiếng Bồ Đào Nha Brazil cho người Việt");
    expect(text).toContain("30 bài · A1 → C2");
    expect(text).toContain("Chào hỏi cơ bản");
    expect(text).toContain("Chào hỏi");
    expect(text).not.toContain("Đang tải bài học");
    expect(text).not.toContain("Chưa có bài học");
    expect(screen.queryByRole("link", { name: /AI Tutor/ })).not.toBeInTheDocument();
  });

  it("keeps the page tied to the validated local Portuguese curriculum registry", () => {
    expect(PORTUGUESE_VALIDATED_LEVELS).toEqual(["A1", "A2", "B1", "B2", "C1", "C2"]);
    expect(PORTUGUESE_TOTAL_LESSONS).toBeGreaterThanOrEqual(PORTUGUESE_CATEGORIES.length);
    const firstA1Lesson = PORTUGUESE_LESSONS_BY_LEVEL.A1[0];
    expect(firstA1Lesson).toBeDefined();
    expect(firstA1Lesson?.sentences?.[0]?.en).toContain("Oi");
    expect(firstA1Lesson?.vocabulary?.[0]?.word).toBe("oi");
    expect(PAGE_SRC).toContain('from "@/languages/portuguese"');
    expect(PAGE_SRC).not.toMatch(/Promise\.resolve\s*\([^)]*(audio|ai|tutor|media)/i);
    expect(PAGE_SRC).not.toMatch(/fake(Audio|AI|Tutor)|mock(Audio|AI|Tutor)/i);
  });

  it("switches CEFR levels from local arrays", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<PortugueseLessonsPage />);

    await user.click(screen.getByRole("button", { name: "B2 · Trung cao" }));

    const text = container.textContent ?? "";
    expect(text).toContain("Tranh luận lịch sự");
    expect(text).toContain("Thức giả định");
    expect(text).not.toContain("Chưa có bài học");
  });

  it("renders English chrome from the same local curriculum", () => {
    window.localStorage.setItem("mercyblade.lessonUiLang", "en");

    const { container } = renderWithProviders(<PortugueseLessonsPage />);
    const text = container.textContent ?? "";

    expect(text).toContain("Brazilian Portuguese — real-life lessons");
    expect(text).toContain("30 lessons · A1 → C2");
    expect(text).toContain("Basic greetings");
    expect(text).toContain("Greetings");
    expect(screen.getByRole("navigation", { name: "Choose level" })).toBeInTheDocument();
    expect(text).not.toContain("Đang tải bài học");
    expect(screen.queryByRole("link", { name: /AI Tutor/ })).not.toBeInTheDocument();
  });
});

describe("Portuguese language wiring", () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("adds a Portuguese hub card", () => {
    renderWithProviders(<LanguagesIndexPage />);

    const link = screen.getByRole("link", { name: /Tiếng Bồ Đào Nha Brazil/i });
    expect(link).toHaveAttribute("href", "/languages/portuguese");
    expect(screen.getByText(/30 bài đã kiểm chứng/)).toBeInTheDocument();
  });

  it("registers the public Portuguese route", () => {
    expect(ROUTER_SRC).toMatch(/const\s+PortugueseLessonsPage\b/);
    expect(ROUTER_SRC).toMatch(/path=["']\/languages\/portuguese["']/);
    expect(ROUTER_SRC).toMatch(/<PortugueseLessonsPage\s*\/>/);
  });
});
