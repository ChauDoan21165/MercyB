import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import type { ReactNode } from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UiLanguageProvider } from "@/contexts/UiLanguageContext";
import LanguagesIndexPage from "@/pages/languages/LanguagesIndexPage";

vi.mock("@/hooks/useLessonData", () => ({
  fetchLessonsBatch: vi.fn((lang: string) => {
    if (lang === "arabic") {
      throw new Error("Arabic page must render from local lesson arrays");
    }
    return Promise.resolve([]);
  }),
  useLessonData: vi.fn((lang: string) => {
    if (lang === "arabic") {
      throw new Error("Arabic page must not use Supabase lesson loading");
    }
    return { lesson: null, loading: false, error: null };
  }),
}));

const here = path.dirname(fileURLToPath(import.meta.url));
const PAGE_SRC = path.resolve(here, "../ArabicLessonsPage.tsx");
const ROUTER_SRC = readFileSync(
  path.resolve(here, "../../../router/AppRouter.tsx"),
  "utf8",
);
const HUB_SRC = readFileSync(
  path.resolve(here, "../LanguagesIndexPage.tsx"),
  "utf8",
);

async function loadArabicLessonsPage() {
  if (!existsSync(PAGE_SRC)) {
    throw new Error(
      "ArabicLessonsPage.tsx is missing; W3 A2 page work must land before this test can pass.",
    );
  }
  try {
    return await import(/* @vite-ignore */ pathToFileURL(PAGE_SRC).href);
  } catch (err) {
    throw new Error(
      `ArabicLessonsPage could not be imported; W3 A2 page work must land before this test can pass. Original error: ${String(err)}`,
    );
  }
}

function renderWithProviders(ui: ReactNode) {
  return render(
    <MemoryRouter>
      <UiLanguageProvider>{ui}</UiLanguageProvider>
    </MemoryRouter>,
  );
}

describe("Arabic lessons page", () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders validated local lessons without Supabase loading", async () => {
    const { default: ArabicLessonsPage } = await loadArabicLessonsPage();

    const { container } = renderWithProviders(<ArabicLessonsPage />);
    const text = container.textContent ?? "";

    expect(text).toMatch(/Arabic|Ả Rập|العربية/);
    expect(text).toContain("Huong doc va chu cai dau tien");
    expect(text).not.toContain("Đang tải bài học");
    expect(text).not.toContain("Chưa có bài học");
    expect(text).not.toContain("No lessons available");
    expect(screen.queryByRole("link", { name: /AI Tutor/i })).not.toBeInTheDocument();
  });

  it("renders Arabic script with RTL evidence after expanding a lesson", async () => {
    const user = userEvent.setup();
    const { default: ArabicLessonsPage } = await loadArabicLessonsPage();

    const { container } = renderWithProviders(<ArabicLessonsPage />);
    await user.click(screen.getByRole("button", { name: /Huong doc va chu cai dau tien/i }));

    expect(container.textContent ?? "").toContain("السلام");
    expect(container.querySelector('[dir="rtl"], [lang="ar"]')).not.toBeNull();
  });

  it("switches CEFR levels from local Arabic arrays", async () => {
    const user = userEvent.setup();
    const { default: ArabicLessonsPage } = await loadArabicLessonsPage();

    const { container } = renderWithProviders(<ArabicLessonsPage />);
    await user.click(screen.getByRole("button", { name: "A2 · Cơ bản" }));

    const text = container.textContent ?? "";
    expect(text).toContain("Sinh hoạt hằng ngày");
    expect(text).toContain("Mua sắm và hỏi giá");
    expect(text).not.toContain("Chưa có bài học");
  });
});

describe("Arabic language wiring", () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("adds an Arabic hub card linking to the public Arabic route", () => {
    renderWithProviders(<LanguagesIndexPage />);

    const link = screen.queryByRole("link", { name: /Ả Rập|Arabic/i });
    expect(
      link,
      "LanguagesIndexPage must include an Arabic card linking to /languages/arabic",
    ).not.toBeNull();
    expect(link).toHaveAttribute("href", "/languages/arabic");
  });

  it("registers the public Arabic route", () => {
    expect(
      /const\s+ArabicLessonsPage\b/.test(ROUTER_SRC),
      "AppRouter must lazy-load ArabicLessonsPage",
    ).toBe(true);
    expect(
      /path=["']\/languages\/arabic["']/.test(ROUTER_SRC),
      "AppRouter must register /languages/arabic",
    ).toBe(true);
    expect(
      /<ArabicLessonsPage\s*\/>/.test(ROUTER_SRC),
      "AppRouter must render ArabicLessonsPage for /languages/arabic",
    ).toBe(true);
  });

  it("keeps Arabic page and wiring free of forbidden loaders, tutor target, and audio promises", () => {
    expect(
      existsSync(PAGE_SRC),
      "ArabicLessonsPage.tsx is required before source guard checks can run",
    ).toBe(true);
    const pageSource = readFileSync(PAGE_SRC, "utf8");
    const combined = `${pageSource}\n${ROUTER_SRC}\n${HUB_SRC}`;

    expect(pageSource).not.toMatch(/fetchLessonsBatch\s*\(\s*["']arabic["']/);
    expect(pageSource).not.toMatch(/useLessonData\s*\(\s*["']arabic["']/);
    expect(combined).not.toMatch(/target=["']ar["']/);
    expect(combined).not.toMatch(/AITutorCtaBanner[^]*target=["']ar["']/);
    expect(pageSource).not.toMatch(/audioBase|lessonAudioBase|audioKinds/);
    expect(pageSource).not.toMatch(/\b(audio|listen|play)\b/i);
  });
});
