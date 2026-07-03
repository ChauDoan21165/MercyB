import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import ThaiLessonsPage from "../ThaiLessonsPage";

describe("ThaiLessonsPage", () => {
  const originalLocation = window.location;

  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
    vi.restoreAllMocks();
  });

  it("renders a fallback link and redirects to the Thai-English page", () => {
    const replace = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, replace },
    });

    render(<ThaiLessonsPage />);

    expect(screen.getByRole("heading", { name: /Thai-English lessons/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Open Thai-English lessons/i }).getAttribute("href")).toBe(
      "/thai-english/",
    );
    expect(replace).toHaveBeenCalledWith("/thai-english/");
  });
});
