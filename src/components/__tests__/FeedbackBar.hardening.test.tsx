// src/components/__tests__/FeedbackBar.hardening.test.tsx
//
// Hardening tests for FeedbackBar — the floating "Báo lỗi" feedback widget.
//
// Contract under test (see src/components/FeedbackBar.tsx):
//   - Renders nothing for anonymous users (RLS requires auth.uid()=user_id).
//   - Signed-in users see a floating pill button that opens a modal.
//   - Submitting trims the message, blocks empty / whitespace-only / in-flight
//     submits, and inserts into the `feedback` table with a fixed payload.
//   - On insert error: shows a friendly VI message + destructive toast, keeps
//     the textarea content, and re-enables sending.
//   - On success: clears the textarea, shows a thank-you, then auto-closes.
//   - Keyboard: Ctrl+Enter submits, Escape closes.
//
// External deps (supabase, AuthProvider, use-toast, lucide-react icons) are
// mocked via vi.hoisted so the suite is deterministic and offline.

import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

const h = vi.hoisted(() => ({
  // mutable auth state; reset per test
  auth: { user: null as { id: string } | null },
  toast: vi.fn(),
  // supabase insert result — flip `error` per test
  insertResult: { error: null as unknown },
  insert: vi.fn(),
  from: vi.fn(),
}));

vi.mock("@/providers/AuthProvider", () => ({ useAuth: () => h.auth }));
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast: h.toast }) }));
vi.mock("@/lib/supabaseClient", () => ({ supabase: { from: h.from } }));

// lucide-react icons render to <svg> in jsdom; keep them as light stand-ins so
// we don't depend on the real icon package's render output.
vi.mock("lucide-react", () => ({
  Send: () => <span data-testid="icon-send" />,
  X: () => <span data-testid="icon-x" />,
}));

import { FeedbackBar } from "@/components/FeedbackBar";
import FeedbackBarDefault from "@/components/FeedbackBar";

const PILL_LABEL = "Mở khung báo lỗi";

function openModal() {
  fireEvent.click(screen.getByLabelText(PILL_LABEL));
  return screen.getByPlaceholderText("Mô tả lỗi hoặc chia sẻ ý kiến...") as HTMLTextAreaElement;
}

beforeEach(() => {
  h.auth = { user: { id: "user-123" } };
  h.toast.mockReset();
  h.insertResult = { error: null };
  h.insert.mockReset();
  h.insert.mockImplementation(() => Promise.resolve(h.insertResult));
  h.from.mockReset();
  h.from.mockImplementation(() => ({ insert: h.insert }));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("FeedbackBar — exports", () => {
  it("exposes both a named and a default export pointing at the same component", () => {
    expect(typeof FeedbackBar).toBe("function");
    expect(FeedbackBarDefault).toBe(FeedbackBar);
  });
});

describe("FeedbackBar — anonymous gating", () => {
  it("renders nothing when there is no user", () => {
    h.auth = { user: null };
    const { container } = render(<FeedbackBar />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByLabelText(PILL_LABEL)).toBeNull();
  });

  it("renders the floating pill for a signed-in user", () => {
    render(<FeedbackBar />);
    expect(screen.getByLabelText(PILL_LABEL)).toBeTruthy();
    expect(screen.getByText("💬 Báo lỗi")).toBeTruthy();
  });
});

describe("FeedbackBar — modal open/close", () => {
  it("opens the modal when the pill is clicked", () => {
    render(<FeedbackBar />);
    expect(screen.queryByPlaceholderText("Mô tả lỗi hoặc chia sẻ ý kiến...")).toBeNull();
    openModal();
    expect(screen.getByPlaceholderText("Mô tả lỗi hoặc chia sẻ ý kiến...")).toBeTruthy();
    // hint footer is shown by default
    expect(screen.getByText("Ctrl+Enter để gửi")).toBeTruthy();
  });

  it("closes the modal via the X button", () => {
    render(<FeedbackBar />);
    openModal();
    // the close (X) button is the second button rendered with icon-x
    fireEvent.click(screen.getByTestId("icon-x"));
    expect(screen.queryByPlaceholderText("Mô tả lỗi hoặc chia sẻ ý kiến...")).toBeNull();
  });

  it("closes when clicking the overlay backdrop but not the inner card", () => {
    const { container } = render(<FeedbackBar />);
    const textarea = openModal();

    // Click inside the card (the textarea) — stopPropagation keeps it open.
    fireEvent.click(textarea);
    expect(screen.getByPlaceholderText("Mô tả lỗi hoặc chia sẻ ý kiến...")).toBeTruthy();

    // Click the overlay itself (outermost fixed div) — closes.
    const overlay = container.querySelector('div[style*="inset"]') as HTMLElement;
    expect(overlay).toBeTruthy();
    fireEvent.click(overlay);
    expect(screen.queryByPlaceholderText("Mô tả lỗi hoặc chia sẻ ý kiến...")).toBeNull();
  });

  it("closes the modal on Escape", () => {
    render(<FeedbackBar />);
    const textarea = openModal();
    fireEvent.keyDown(textarea, { key: "Escape" });
    expect(screen.queryByPlaceholderText("Mô tả lỗi hoặc chia sẻ ý kiến...")).toBeNull();
  });
});

describe("FeedbackBar — submit validation", () => {
  it("does not submit an empty message", () => {
    render(<FeedbackBar />);
    const textarea = openModal();
    const sendBtn = screen.getByTestId("icon-send").closest("button") as HTMLButtonElement;

    expect(sendBtn.disabled).toBe(true);
    fireEvent.click(sendBtn);
    expect(h.from).not.toHaveBeenCalled();
    expect(textarea.value).toBe("");
  });

  it("does not submit a whitespace-only message", () => {
    render(<FeedbackBar />);
    const textarea = openModal();
    fireEvent.change(textarea, { target: { value: "   \n\t  " } });

    const sendBtn = screen.getByTestId("icon-send").closest("button") as HTMLButtonElement;
    expect(sendBtn.disabled).toBe(true);
    // even forcing the keyboard path must not insert
    fireEvent.keyDown(textarea, { key: "Enter", ctrlKey: true });
    expect(h.from).not.toHaveBeenCalled();
  });

  it("enables the send button once non-whitespace text is present", () => {
    render(<FeedbackBar />);
    const textarea = openModal();
    fireEvent.change(textarea, { target: { value: "hello" } });
    const sendBtn = screen.getByTestId("icon-send").closest("button") as HTMLButtonElement;
    expect(sendBtn.disabled).toBe(false);
  });
});

describe("FeedbackBar — successful submit", () => {
  it("trims the message and inserts the canonical payload", async () => {
    render(<FeedbackBar />);
    const textarea = openModal();
    fireEvent.change(textarea, { target: { value: "  bug here  " } });
    fireEvent.click(screen.getByTestId("icon-send").closest("button") as HTMLButtonElement);

    await waitFor(() => expect(h.from).toHaveBeenCalledWith("feedback"));
    expect(h.insert).toHaveBeenCalledTimes(1);
    expect(h.insert).toHaveBeenCalledWith({
      user_id: "user-123",
      message: "bug here",
      status: "new",
      priority: "normal",
      category: "general",
    });
  });

  it("clears the textarea and shows a thank-you on success", async () => {
    render(<FeedbackBar />);
    const textarea = openModal();
    fireEvent.change(textarea, { target: { value: "great app" } });
    fireEvent.click(screen.getByTestId("icon-send").closest("button") as HTMLButtonElement);

    await screen.findByText("🌹 Cảm ơn bạn!");
    expect((screen.getByPlaceholderText("Mô tả lỗi hoặc chia sẻ ý kiến...") as HTMLTextAreaElement).value).toBe("");
    expect(h.toast).not.toHaveBeenCalled();
  });

  it("auto-closes the modal ~2s after a successful submit", async () => {
    vi.useFakeTimers();
    try {
      render(<FeedbackBar />);
      fireEvent.click(screen.getByLabelText(PILL_LABEL));
      const textarea = screen.getByPlaceholderText("Mô tả lỗi hoặc chia sẻ ý kiến...");
      fireEvent.change(textarea, { target: { value: "thanks" } });

      await act(async () => {
        fireEvent.click(screen.getByTestId("icon-send").closest("button") as HTMLButtonElement);
        await Promise.resolve();
        await Promise.resolve();
      });

      expect(screen.getByText("🌹 Cảm ơn bạn!")).toBeTruthy();

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      expect(screen.queryByPlaceholderText("Mô tả lỗi hoặc chia sẻ ý kiến...")).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("submits via Ctrl+Enter keyboard shortcut", async () => {
    render(<FeedbackBar />);
    const textarea = openModal();
    fireEvent.change(textarea, { target: { value: "keyboard submit" } });
    fireEvent.keyDown(textarea, { key: "Enter", ctrlKey: true });

    await waitFor(() => expect(h.insert).toHaveBeenCalledTimes(1));
    expect(h.insert).toHaveBeenCalledWith(
      expect.objectContaining({ message: "keyboard submit" }),
    );
  });

  it("does not submit on plain Enter without Ctrl", () => {
    render(<FeedbackBar />);
    const textarea = openModal();
    fireEvent.change(textarea, { target: { value: "no submit" } });
    fireEvent.keyDown(textarea, { key: "Enter" });
    expect(h.from).not.toHaveBeenCalled();
  });
});

describe("FeedbackBar — error handling", () => {
  it("shows a friendly message and destructive toast when insert fails", async () => {
    h.insertResult = { error: { message: "RLS violation" } };
    render(<FeedbackBar />);
    const textarea = openModal();
    fireEvent.change(textarea, { target: { value: "will fail" } });
    fireEvent.click(screen.getByTestId("icon-send").closest("button") as HTMLButtonElement);

    await screen.findByText(/Có lỗi khi gửi báo cáo/);
    expect(h.toast).toHaveBeenCalledTimes(1);
    expect(h.toast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: "destructive", title: "Gửi không thành công" }),
    );
  });

  it("preserves the typed text and re-enables sending after an error", async () => {
    h.insertResult = { error: { message: "boom" } };
    render(<FeedbackBar />);
    const textarea = openModal();
    fireEvent.change(textarea, { target: { value: "keep me" } });
    fireEvent.click(screen.getByTestId("icon-send").closest("button") as HTMLButtonElement);

    await screen.findByText(/Có lỗi khi gửi báo cáo/);
    expect((screen.getByPlaceholderText("Mô tả lỗi hoặc chia sẻ ý kiến...") as HTMLTextAreaElement).value).toBe("keep me");

    // send button is usable again (text present, not sending)
    const sendBtn = screen.getByTestId("icon-send").closest("button") as HTMLButtonElement;
    expect(sendBtn.disabled).toBe(false);
  });

  it("retries successfully after a prior failure", async () => {
    h.insertResult = { error: { message: "transient" } };
    render(<FeedbackBar />);
    const textarea = openModal();
    fireEvent.change(textarea, { target: { value: "retry me" } });
    fireEvent.click(screen.getByTestId("icon-send").closest("button") as HTMLButtonElement);
    await screen.findByText(/Có lỗi khi gửi báo cáo/);

    // flip to success and resubmit
    h.insertResult = { error: null };
    fireEvent.click(screen.getByTestId("icon-send").closest("button") as HTMLButtonElement);
    await screen.findByText("🌹 Cảm ơn bạn!");
    expect(h.insert).toHaveBeenCalledTimes(2);
  });
});

describe("FeedbackBar — concurrency guard", () => {
  it("ignores a second submit while the first is still in flight", async () => {
    let resolveInsert!: (v: { error: unknown }) => void;
    h.insert.mockImplementationOnce(
      () => new Promise((res) => { resolveInsert = res; }),
    );

    render(<FeedbackBar />);
    const textarea = openModal();
    fireEvent.change(textarea, { target: { value: "slow send" } });
    const sendBtn = screen.getByTestId("icon-send").closest("button") as HTMLButtonElement;

    fireEvent.click(sendBtn); // first submit — pending
    fireEvent.click(sendBtn); // second submit while sending — should be ignored

    expect(h.insert).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveInsert({ error: null });
      await Promise.resolve();
    });

    await screen.findByText("🌹 Cảm ơn bạn!");
    expect(h.insert).toHaveBeenCalledTimes(1);
  });
});
