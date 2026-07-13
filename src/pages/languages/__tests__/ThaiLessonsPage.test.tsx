import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import ThaiLessonsPage from "../ThaiLessonsPage";

describe("ThaiLessonsPage", () => {
  it("renders the Thai-English landing page without client redirecting", () => {
    render(
      <MemoryRouter>
        <ThaiLessonsPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /Thai-English lessons/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Open Thai-English static lessons/i }).getAttribute("href")).toBe(
      "/thai-english/",
    );
  });
});
