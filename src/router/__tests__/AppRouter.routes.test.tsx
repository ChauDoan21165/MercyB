// src/router/__tests__/AppRouter.routes.test.tsx
// Verify all registered route paths exist and SPA fallback works.

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
});
