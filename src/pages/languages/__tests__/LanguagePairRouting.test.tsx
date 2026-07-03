import { fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ReactElement } from "react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";

import LanguagesIndexPage from "../LanguagesIndexPage";
import LanguagePairSelectorPage from "../LanguagePairSelectorPage";
import LearnPairRedirectPage from "../LearnPairRedirectPage";
import UnsupportedPairPage from "../UnsupportedPairPage";
import { UiLanguageProvider } from "@/contexts/UiLanguageContext";

type LanguageRouteCase = {
  name: string;
  route: string;
  componentName: string;
};

const publicLanguageLinks = [
  { label: "Swahili", route: "/languages/swahili" },
  { label: "Italian", route: "/languages/italian" },
  { label: "Tiếng Pháp", route: "/languages/french" },
  { label: "Tiếng Đức", route: "/languages/german" },
  { label: "Tiếng Trung", route: "/languages/chinese" },
  { label: "Tiếng Nhật", route: "/languages/japanese" },
  { label: "Tiếng Hàn", route: "/languages/korean" },
  { label: "Tiếng Thái", route: "/languages/thai-english" },
  { label: "Vietnamese for Foreigners", route: "/languages/vietnamese" },
  { label: "Spanish for English Speakers", route: "/languages/spanish" },
  { label: "Tiếng Bồ Đào Nha Brazil", route: "/languages/portuguese" },
  { label: "Tiếng Indonesia", route: "/languages/indonesian" },
  { label: "Tiếng Thổ Nhĩ Kỳ", route: "/languages/turkish" },
  { label: "Tiếng Ả Rập", route: "/languages/arabic" },
  { label: "Tiếng Hindi", route: "/languages/hindi" },
  { label: "Tiếng Russian", route: "/languages/russian" },
  { label: "Tiếng Punjabi", route: "/languages/punjabi" },
  { label: "Tiếng Urdu", route: "/languages/urdu" },
] as const;

const appRouterLanguageRoutes: LanguageRouteCase[] = [
  { name: "French", route: "/languages/french", componentName: "FrenchLessonsPage" },
  { name: "German", route: "/languages/german", componentName: "GermanLessonsPage" },
  { name: "Japanese", route: "/languages/japanese", componentName: "JapaneseLessonsPage" },
  { name: "Chinese", route: "/languages/chinese", componentName: "ChineseLessonsPage" },
  { name: "Korean", route: "/languages/korean", componentName: "KoreanLessonsPage" },
  { name: "Vietnamese", route: "/languages/vietnamese", componentName: "VietnameseLessonsPage" },
  { name: "Spanish", route: "/languages/spanish", componentName: "SpanishLessonsPage" },
  { name: "Portuguese", route: "/languages/portuguese", componentName: "PortugueseLessonsPage" },
  { name: "Indonesian", route: "/languages/indonesian", componentName: "IndonesianLessonsPage" },
  { name: "Turkish", route: "/languages/turkish", componentName: "TurkishLessonsPage" },
  { name: "Arabic", route: "/languages/arabic", componentName: "ArabicLessonsPage" },
  { name: "Hindi", route: "/languages/hindi", componentName: "HindiLessonsPage" },
  { name: "Russian", route: "/languages/russian", componentName: "RussianLessonsPage" },
  { name: "Punjabi", route: "/languages/punjabi", componentName: "PunjabiLessonsPage" },
  { name: "Urdu", route: "/languages/urdu", componentName: "UrduLessonsPage" },
  { name: "Thai", route: "/languages/thai", componentName: "ThaiLessonsPage" },
  { name: "Swahili", route: "/languages/swahili", componentName: "SwahiliLessonsPage" },
  { name: "Italian", route: "/languages/italian", componentName: "ItalianLessonsPage" },
  { name: "Thai-English", route: "/languages/thai-english", componentName: "ThaiLessonsPage" },
];

const localLanguagePageFiles = [
  "ArabicLessonsPage.tsx",
  "HindiLessonsPage.tsx",
  "IndonesianLessonsPage.tsx",
  "ItalianLessonsPage.tsx",
  "PortugueseLessonsPage.tsx",
  "PunjabiLessonsPage.tsx",
  "RussianLessonsPage.tsx",
  "SwahiliLessonsPage.tsx",
  "ThaiLessonsPage.tsx",
  "TurkishLessonsPage.tsx",
  "UrduLessonsPage.tsx",
  "VietnameseLessonsPage.tsx",
] as const;

function LocationProbe() {
  const location = useLocation();
  return <output aria-label="current route">{`${location.pathname}${location.search}`}</output>;
}

function renderAt(path: string, element: ReactElement) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/learn/:native/:target" element={element} />
        <Route path="/languages/:nativeSlug/:targetSlug" element={element} />
        <Route path="*" element={<LocationProbe />} />
      </Routes>
    </MemoryRouter>,
  );
}

function sourceFile(path: string): string {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("language pair routing pages", () => {
  it("renders every public language hub link", () => {
    render(
      <MemoryRouter initialEntries={["/languages"]}>
        <UiLanguageProvider>
          <LanguagesIndexPage />
        </UiLanguageProvider>
      </MemoryRouter>,
    );

    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href"));

    for (const language of publicLanguageLinks) {
      expect(hrefs).toContain(language.route);
      expect(document.body.textContent).toContain(language.label);
    }
  });

  it("keeps every public language lesson route registered in AppRouter", () => {
    const routerSource = sourceFile("src/router/AppRouter.tsx");

    for (const language of appRouterLanguageRoutes) {
      expect(routerSource).toContain(`path="${language.route}"`);
      expect(routerSource).toContain(`<${language.componentName} />`);
    }
  });

  it.each(localLanguagePageFiles)("keeps %s backed by local content boundaries", (fileName) => {
    const source = sourceFile(`src/pages/languages/${fileName}`);

    expect(source).not.toMatch(/useLessonData|fetchLessonsBatch|supabase\.from|createClient|from\(["']@\/integrations\/supabase/i);
    expect(source).not.toMatch(/Promise\.resolve\s*\([^)]*(audio|ai|tutor|lesson|media)/i);
    expect(source).not.toMatch(/fake(Audio|AI|Tutor)|fake audio|fake ai|fake tutor/i);
  });

  it("filters selectable target languages and preserves pair links", () => {
    render(
      <MemoryRouter initialEntries={["/languages/vietnamese/english"]}>
        <Routes>
          <Route path="/languages/:nativeSlug/:targetSlug" element={<LanguagePairSelectorPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /Vietnamese.*English/i })).toBeTruthy();
    expect(screen.getAllByRole("link", { name: /Start Vietnamese.*English/i })[0]?.getAttribute("href")).toBe(
      "/learn/vietnamese/english",
    );

    fireEvent.change(screen.getByPlaceholderText(/Search target language/i), {
      target: { value: "thai" },
    });

    expect(screen.getByRole("link", { name: /Start Vietnamese.*Thai/i }).getAttribute("href")).toBe(
      "/learn/vietnamese/thai",
    );
    expect(screen.queryByRole("link", { name: /Start Vietnamese.*French/i })).toBeNull();
  });

  it("redirects tutor-supported language pairs to AI Tutor", () => {
    renderAt("/learn/vietnamese/spanish", <LearnPairRedirectPage />);

    expect(screen.getByLabelText("current route").textContent).toBe("/ai-tutor?native=vietnamese&target=es");
  });

  it("redirects page-only language pairs to their language page", () => {
    renderAt("/learn/vietnamese/thai", <LearnPairRedirectPage />);

    expect(screen.getByLabelText("current route").textContent).toBe("/languages/thai");
  });

  it("renders Vietnamese fallback copy for unsupported Vietnamese-native pairs", () => {
    renderAt("/languages/vietnamese/klingon", <UnsupportedPairPage />);

    expect(screen.getByTestId("unsupported-pair-page")).toBeTruthy();
    expect(screen.getByRole("heading", { name: /chưa có cặp ngôn ngữ này/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Xem các ngôn ngữ khác/i }).getAttribute("href")).toBe("/languages");
  });
});
