import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";

import LanguagePairSelectorPage from "../LanguagePairSelectorPage";
import LearnPairRedirectPage from "../LearnPairRedirectPage";
import UnsupportedPairPage from "../UnsupportedPairPage";

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

describe("language pair routing pages", () => {
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
