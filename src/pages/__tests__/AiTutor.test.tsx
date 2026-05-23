// src/pages/__tests__/AiTutor.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AiTutorPage from "../AiTutor";

describe("AiTutor mock UI", () => {
  it("renders the mock badge", () => {
    render(<AiTutorPage />);
    expect(screen.getByText("Mock — Provider Disabled")).toBeInTheDocument();
  });

  it("shows button disabled with empty input", () => {
    render(<AiTutorPage />);
    expect(screen.getByRole("button", { name: /correct my sentence/i })).toBeDisabled();
  });

  it("enables button when input has text", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "test");
    expect(screen.getByRole("button", { name: /correct my sentence/i })).toBeEnabled();
  });

  it("shows mock correction on submit", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "She go to school");
    await userEvent.click(screen.getByRole("button", { name: /correct my sentence/i }));
    expect(screen.getByText("She goes to school every day.")).toBeInTheDocument();
  });
});
