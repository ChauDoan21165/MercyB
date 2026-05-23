// src/pages/__tests__/AiTutor.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
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

  it("uses the expanded result layout after a correction", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "She go to school");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));

    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-layout")).toHaveClass("lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]");
    });
  });

  it("shows practice section after correction", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "test");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => {
      expect(screen.getByText(/Luyện tập/)).toBeInTheDocument();
    });
  });

  it("practice section has an answer textarea", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "test");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => {
      const textareas = screen.getAllByRole("textbox");
      expect(textareas.length).toBe(2);
    });
  });

  it("submit practice shows mock feedback", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "test");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));

    await waitFor(() => {
      expect(screen.getByText(/Luyện tập/)).toBeInTheDocument();
    });

    const textareas = screen.getAllByRole("textbox");
    await userEvent.type(textareas[1], "my practice answer");
    await userEvent.click(screen.getByRole("button", { name: /Gửi câu trả lời/ }));

    await waitFor(() => {
      expect(screen.getByText(/Nhận xét/)).toBeInTheDocument();
    });
  });

  it("practice feedback includes encouragement, tip, and next step", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "test");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));

    await waitFor(() => {
      expect(screen.getByText(/Luyện tập/)).toBeInTheDocument();
    });

    const textareas = screen.getAllByRole("textbox");
    await userEvent.type(textareas[1], "my practice answer");
    await userEvent.click(screen.getByRole("button", { name: /Gửi câu trả lời/ }));

    await waitFor(() => {
      expect(screen.getByText(/Nhận xét/)).toBeInTheDocument();
      expect(screen.getByText("Mẹo · Tip")).toBeInTheDocument();
      expect(screen.getByText("Bước tiếp theo · Next Step")).toBeInTheDocument();
    });
  });

  it("reset clears correction and practice state", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "test");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));

    await waitFor(() => {
      expect(screen.getByText(/Luyện tập/)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /Làm mới/ }));
    expect(screen.getByText(/AI sẵn sàng sửa câu của bạn/)).toBeInTheDocument();
  });

  it("no fetch call is made", async () => {
    const spy = vi.spyOn(globalThis, "fetch");
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "test");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => {
      expect(screen.getByText(/Luyện tập/)).toBeInTheDocument();
    });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("caps input at 500 characters", async () => {
    render(<AiTutorPage />);
    const long = "a".repeat(600);
    await userEvent.type(screen.getByRole("textbox"), long);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(textarea.value.length).toBeLessThanOrEqual(500);
  });
});
