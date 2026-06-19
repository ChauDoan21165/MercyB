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
    if (lang === "hindi") {
      throw new Error("Hindi page must render from local lesson arrays");
    }
    return Promise.resolve([]);
  }),
  useLessonData: vi.fn((lang: string) => {
    if (lang === "hindi") {
      throw new Error("Hindi page must not use Supabase lesson loading");
    }
    return { lesson: null, loading: false, error: null };
  }),
}));

const here = path.dirname(fileURLToPath(import.meta.url));
const PAGE_SRC = path.resolve(here, "../HindiLessonsPage.tsx");
const ROUTER_SRC = readFileSync(
  path.resolve(here, "../../../router/AppRouter.tsx"),
  "utf8",
);
const HUB_SRC = readFileSync(
  path.resolve(here, "../LanguagesIndexPage.tsx"),
  "utf8",
);

async function loadHindiLessonsPage() {
  if (!existsSync(PAGE_SRC)) {
    throw new Error(
      "HindiLessonsPage.tsx is missing; W3 A2 Hindi page work must land before this test can pass.",
    );
  }
  try {
    return await import(/* @vite-ignore */ pathToFileURL(PAGE_SRC).href);
  } catch (err) {
    throw new Error(
      `HindiLessonsPage could not be imported; W3 A2 Hindi page work must land before this test can pass. Original error: ${String(err)}`,
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

describe("Hindi lessons page", () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders validated local Hindi lessons without Supabase loading", async () => {
    const user = userEvent.setup();
    const { default: HindiLessonsPage } = await loadHindiLessonsPage();

    const { container } = renderWithProviders(<HindiLessonsPage />);
    await user.click(screen.getByRole("button", { name: /Chữ Devanagari|Devanagari/i }));

    const text = container.textContent ?? "";

    expect(text).toMatch(/Hindi|हिंदी|Tiếng Hindi/i);
    expect(text).toContain("नमस्ते");
    expect(text).toContain("Chữ Devanagari");
    expect(text).not.toContain("Đang tải bài học");
    expect(text).not.toContain("Chưa có bài học");
    expect(text).not.toContain("No lessons available");
    expect(screen.queryByRole("link", { name: /AI Tutor/i })).not.toBeInTheDocument();
  });

  it("renders Devanagari plus romanization or learner support after expanding a lesson", async () => {
    const user = userEvent.setup();
    const { default: HindiLessonsPage } = await loadHindiLessonsPage();

    const { container } = renderWithProviders(<HindiLessonsPage />);
    await user.click(screen.getByRole("button", { name: /Chữ Devanagari|Devanagari/i }));

    const text = container.textContent ?? "";
    expect(text).toContain("नमस्ते");
    expect(text).toMatch(/namaste/i);
    expect(text).toMatch(/Romanization|romanization|trợ giúp|learner/i);
    expect(container.querySelector('[lang="hi"], [data-language="hi"]')).not.toBeNull();
  });

  it("switches CEFR levels from local Hindi arrays", async () => {
    const user = userEvent.setup();
    const { default: HindiLessonsPage } = await loadHindiLessonsPage();

    const { container } = renderWithProviders(<HindiLessonsPage />);
    await user.click(screen.getByRole("button", { name: /A2/ }));
    await user.click(screen.getByRole("button", { name: /Nhà ở và dịch vụ công|Housing/i }));

    const text = container.textContent ?? "";
    expect(text).toContain("Sinh hoạt hằng ngày");
    expect(text).toContain("मुझे यह दस्तावेज़ चाहिए");
    expect(text).not.toContain("Chưa có bài học");
  });
});

describe("Hindi language wiring", () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("adds a Hindi hub card linking to the public Hindi route", () => {
    renderWithProviders(<LanguagesIndexPage />);

    const link = screen.queryByRole("link", { name: /Hindi|Tiếng Hindi|हिंदी/i });
    expect(
      link,
      "LanguagesIndexPage must include a Hindi card linking to /languages/hindi",
    ).not.toBeNull();
    expect(link).toHaveAttribute("href", "/languages/hindi");
  });

  it("registers the public Hindi route", () => {
    expect(
      /const\s+HindiLessonsPage\b/.test(ROUTER_SRC),
      "AppRouter must lazy-load HindiLessonsPage",
    ).toBe(true);
    expect(
      /path=["']\/languages\/hindi["']/.test(ROUTER_SRC),
      "AppRouter must register /languages/hindi",
    ).toBe(true);
    expect(
      /<HindiLessonsPage\s*\/>/.test(ROUTER_SRC),
      "AppRouter must render HindiLessonsPage for /languages/hindi",
    ).toBe(true);
  });

  it("keeps Hindi page and wiring free of forbidden loaders, tutor target, and audio promises", () => {
    expect(
      existsSync(PAGE_SRC),
      "HindiLessonsPage.tsx is required before source guard checks can run",
    ).toBe(true);
    const pageSource = readFileSync(PAGE_SRC, "utf8");
    const combined = `${pageSource}\n${ROUTER_SRC}\n${HUB_SRC}`;

    expect(pageSource).not.toMatch(/fetchLessonsBatch\s*\(\s*["']hindi["']/);
    expect(pageSource).not.toMatch(/useLessonData\s*\(\s*["']hindi["']/);
    expect(combined).not.toMatch(/target=["']hi["']/);
    expect(combined).not.toMatch(/AITutorCtaBanner[^]*target=["']hi["']/);
    expect(pageSource).not.toMatch(/audioBase|lessonAudioBase|audioKinds/);
    expect(pageSource).not.toMatch(/\b(audio|listen|play)\b/i);
  });
});
