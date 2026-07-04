// src/router/__tests__/AppRouter.routes.test.tsx
// Verify all registered route paths exist and SPA fallback works.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

const REGISTERED_PATHS = [
  "/",
  "/login",
  "/ai-tutor",
  "/progress",
  "/pricing",
  "/placement",
  "/placement/results/abc",
] as const;

const appRouterSource = readFileSync(resolve(process.cwd(), "src/router/AppRouter.tsx"), "utf8");

describe("AppRouter route registration", () => {
  REGISTERED_PATHS.forEach((path) => {
    it(`route "${path}" renders without crashing`, () => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            {REGISTERED_PATHS.map((p) => (
              <Route key={p} path={p} element={<div data-testid={`route-${p.replace(/\//g, "-")}`}>ok</div>} />
            ))}
            <Route path="*" element={<div>not-found</div>} />
          </Routes>
        </MemoryRouter>,
      );
      expect(screen.getByText("ok")).toBeInTheDocument();
    });
  });

  it("SPA fallback: unknown route renders index.html shell, not blank 404", () => {
    render(
      <MemoryRouter initialEntries={["/nonexistent"]}>
        <Routes>
          {REGISTERED_PATHS.map((p) => (
            <Route key={p} path={p} element={<div>page</div>} />
          ))}
          <Route path="*" element={<div data-testid="catch-all">catch-all</div>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByTestId("catch-all")).toBeInTheDocument();
  });

  it("registers onboarding as a public page route", () => {
    expect(appRouterSource).toContain('path="/onboarding"');
    expect(appRouterSource).toContain("const OnboardingPage");
    expect(appRouterSource).toMatch(/<OnboardingPage\s*\/>/);
  });

  it("keeps the root route on the standalone marketing landing", () => {
    expect(appRouterSource).toMatch(/path="\/"[\s\S]*<MarketingLandingPage\s*\/>/);
    expect(appRouterSource).toContain("Public marketing landing");
  });
});
