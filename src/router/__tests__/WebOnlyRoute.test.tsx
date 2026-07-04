import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const mockGetPlatform = vi.fn();

vi.mock("@/lib/platform", () => ({
  getPlatform: () => mockGetPlatform(),
}));

import { WebOnlyRoute } from "../WebOnlyRoute";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/gift"
          element={
            <WebOnlyRoute>
              <div data-testid="gift-page">gift</div>
            </WebOnlyRoute>
          }
        />
        <Route path="/" element={<div data-testid="home-page">home</div>} />
        <Route path="/onboarding" element={<div data-testid="onboarding-page">onboarding</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("WebOnlyRoute", () => {
  beforeEach(() => {
    mockGetPlatform.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders children on web", () => {
    mockGetPlatform.mockReturnValue("web");
    renderAt("/gift");
    expect(screen.getByTestId("gift-page")).toBeInTheDocument();
    expect(screen.queryByTestId("home-page")).not.toBeInTheDocument();
  });

  it("renders children on android", () => {
    mockGetPlatform.mockReturnValue("android");
    renderAt("/gift");
    expect(screen.getByTestId("gift-page")).toBeInTheDocument();
  });

  it("redirects to / on iOS", () => {
    mockGetPlatform.mockReturnValue("ios");
    renderAt("/gift");
    expect(screen.queryByTestId("gift-page")).not.toBeInTheDocument();
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  it("does not affect public onboarding routes outside the web-only wrapper", () => {
    mockGetPlatform.mockReturnValue("ios");
    renderAt("/onboarding");
    expect(screen.getByTestId("onboarding-page")).toBeInTheDocument();
    expect(screen.queryByTestId("home-page")).not.toBeInTheDocument();
  });
});
