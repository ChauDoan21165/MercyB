// src/pages/__tests__/AiTutor.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AiTutorPage from "../AiTutor";

describe("AiTutor mock UI", () => {
  it("renders the mock badge", () => {
    render(<AiTutorPage />);
    expect(screen.getByText("Mock")).toBeInTheDocument();
  });

  it("shows empty state before first submit", () => {
    render(<AiTutorPage />);
    expect(screen.getByText(/AI sẵn sàng sửa câu của bạn/)).toBeInTheDocument();
  });

  it("shows button disabled with empty input", () => {
    render(<AiTutorPage />);
    expect(screen.getByRole("button", { name: /Sửa câu này/ })).toBeDisabled();
  });

  it("enables button when input has text", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "test");
    expect(screen.getByRole("button", { name: /Sửa câu này/ })).toBeEnabled();
  });

  it("shows loading state after submit", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "She go to school");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    expect(screen.getByText(/AI đang phân tích/)).toBeInTheDocument();
  });

  it("shows corrected sentence after loading", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "She go to school");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => {
      expect(screen.getByText("She goes to school every day.")).toBeInTheDocument();
    });
  });

  it("shows explanation section", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "test");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => {
      expect(screen.getByText(/Giải thích/)).toBeInTheDocument();
    });
  });

  it("shows grammar tip section", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "test");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => {
      expect(screen.getByText(/Mẹo ngữ pháp/)).toBeInTheDocument();
    });
  });

  it("cycles through mock results", async () => {
    render(<AiTutorPage />);
    // First submit
    await userEvent.type(screen.getByRole("textbox"), "first");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => {
      expect(screen.getByText("She goes to school every day.")).toBeInTheDocument();
    });

    // Clear + second submit
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu khác/ }));
    await userEvent.type(screen.getByRole("textbox"), "second");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => {
      expect(screen.getByText("I have been learning English for two years.")).toBeInTheDocument();
    });
  });

  it("capped at 500 characters", async () => {
    render(<AiTutorPage />);
    const long = "a".repeat(600);
    await userEvent.type(screen.getByRole("textbox"), long);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(textarea.value.length).toBeLessThanOrEqual(500);
  });
});
