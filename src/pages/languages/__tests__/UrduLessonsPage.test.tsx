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
    if (lang === "urdu") {
      throw new Error("Urdu page must render from local lesson arrays");
    }
    return Promise.resolve([]);
  }),
  useLessonData: vi.fn((lang: string) => {
    if (lang === "urdu") {
      throw new Error("Urdu page must not use Supabase lesson loading");
    }
    return { lesson: null, loading: false, error: null };
  }),
}));

const here = path.dirname(fileURLToPath(import.meta.url));
const PAGE_SRC = path.resolve(here, "../UrduLessonsPage.tsx");
const ROUTER_SRC = readFileSync(
  path.resolve(here, "../../../router/AppRouter.tsx"),
  "utf8",
);
const HUB_SRC = readFileSync(
  path.resolve(here, "../LanguagesIndexPage.tsx"),
  "utf8",
);

async function loadUrduLessonsPage() {
  if (!existsSync(PAGE_SRC)) {
    throw new Error(
      "UrduLessonsPage.tsx is missing; W3 A3 page work must land before this test can pass.",
    );
  }
  try {
    return await import(/* @vite-ignore */ pathToFileURL(PAGE_SRC).href);
  } catch (err) {
    const detail =
      err instanceof Error
        ? err.message
        : typeof err === "object" && err !== null
          ? JSON.stringify(err)
          : String(err);
    throw new Error(
      `UrduLessonsPage could not be imported; W3 A3 page work must land before this test can pass. Original error: ${detail}`,
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

describe("Urdu lessons page", () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders validated local lessons without Supabase loading", async () => {
    const { default: UrduLessonsPage } = await loadUrduLessonsPage();

    const { container } = renderWithProviders(<UrduLessonsPage />);
    const text = container.textContent ?? "";

    expect(text).toMatch(/Urdu|Tiếng Urdu|اردو/);
    expect(text).toContain("Hướng đọc và chữ Urdu đầu tiên");
    expect(text).not.toContain("Đang tải bài học");
    expect(text).not.toContain("Chưa có bài học");
    expect(text).not.toContain("No lessons available");
    expect(screen.queryByRole("link", { name: /AI Tutor/i })).not.toBeInTheDocument();
  });

  it("renders Urdu script with RTL evidence after expanding a lesson", async () => {
    const user = userEvent.setup();
    const { default: UrduLessonsPage } = await loadUrduLessonsPage();

    const { container } = renderWithProviders(<UrduLessonsPage />);
    await user.click(screen.getByRole("button", { name: /Hướng đọc và chữ Urdu đầu tiên|Reading direction/i }));

    expect(container.textContent ?? "").toContain("سلام");
    expect(container.querySelector('[dir="rtl"][lang="ur"]')).not.toBeNull();
  });

  it("renders romanization and learner support when lesson data provides it", async () => {
    const user = userEvent.setup();
    const { default: UrduLessonsPage } = await loadUrduLessonsPage();

    const { container } = renderWithProviders(<UrduLessonsPage />);
    await user.click(screen.getByRole("button", { name: /Hướng đọc và chữ Urdu đầu tiên|Reading direction/i }));

    const text = container.textContent ?? "";
    expect(text).toMatch(/salaam|mera naam|Urdu viết từ phải sang trái|Urdu is written from right to left/i);
  });

  it("switches CEFR levels from local Urdu arrays", async () => {
    const user = userEvent.setup();
    const { default: UrduLessonsPage } = await loadUrduLessonsPage();

    const { container } = renderWithProviders(<UrduLessonsPage />);
    await user.click(screen.getByRole("button", { name: "A2 · Cơ bản" }));

    const text = container.textContent ?? "";
    expect(text).toContain("Sinh hoạt hằng ngày");
    expect(text).toContain("Đồ ăn, mua sắm và hỏi giá");
    expect(text).not.toContain("Chưa có bài học");
  });
});

describe("Urdu language wiring", () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("adds an Urdu hub card linking to the public Urdu route", () => {
    renderWithProviders(<LanguagesIndexPage />);

    const link = screen.queryByRole("link", { name: /Urdu|اردو/i });
    expect(
      link,
      "LanguagesIndexPage must include an Urdu card linking to /languages/urdu",
    ).not.toBeNull();
    expect(link).toHaveAttribute("href", "/languages/urdu");
  });

  it("registers the public Urdu route", () => {
    expect(
      /const\s+UrduLessonsPage\b/.test(ROUTER_SRC),
      "AppRouter must lazy-load UrduLessonsPage",
    ).toBe(true);
    expect(
      /path=["']\/languages\/urdu["']/.test(ROUTER_SRC),
      "AppRouter must register /languages/urdu",
    ).toBe(true);
    expect(
      /<UrduLessonsPage\s*\/>/.test(ROUTER_SRC),
      "AppRouter must render UrduLessonsPage for /languages/urdu",
    ).toBe(true);
  });

  it("keeps Urdu page and wiring free of forbidden loaders, tutor target, and audio promises", () => {
    expect(
      existsSync(PAGE_SRC),
      "UrduLessonsPage.tsx is required before source guard checks can run",
    ).toBe(true);
    const pageSource = readFileSync(PAGE_SRC, "utf8");
    const combined = `${pageSource}\n${ROUTER_SRC}\n${HUB_SRC}`;

    expect(pageSource).not.toMatch(/fetchLessonsBatch\s*\(\s*["']urdu["']/);
    expect(pageSource).not.toMatch(/useLessonData\s*\(\s*["']urdu["']/);
    expect(combined).not.toMatch(/target=["']ur["']/);
    expect(combined).not.toMatch(/AITutorCtaBanner[^]*target=["']ur["']/);
    expect(pageSource).not.toMatch(/audioBase|lessonAudioBase|audioKinds/);
    expect(pageSource).not.toMatch(/\b(audio|listen|play)\b/i);
  });
});
