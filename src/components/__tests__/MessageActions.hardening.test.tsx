// PATH: src/components/__tests__/MessageActions.hardening.test.tsx
//
// Hardening tests for src/components/MessageActions.tsx
//
// MessageActions renders a single "Copy" button. On click it copies the
// provided `text` to the clipboard via navigator.clipboard.writeText, flips
// into a transient "Copied" state for 2000ms, and raises a (bilingual) toast.
// On clipboard failure it raises a destructive toast and stays in the
// non-copied state.
//
// These tests cover: rendering, the happy-path copy flow, the timed state
// reset, error handling, toast payloads, and a handful of edge cases around
// the `text` / `roomId` props.

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";

// --- Mock the toast hook so we can assert on the payloads it receives. ------
const toastMock = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastMock }),
}));

import { MessageActions } from "@/components/MessageActions";

// --- Clipboard helpers -------------------------------------------------------

/** Install a fresh, configurable navigator.clipboard with a spyable writeText. */
function installClipboard(writeText: (text: string) => Promise<void>) {
  const writeTextSpy = vi.fn(writeText);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    writable: true,
    value: { writeText: writeTextSpy },
  });
  return writeTextSpy;
}

beforeEach(() => {
  toastMock.mockReset();
});

afterEach(() => {
  vi.useRealTimers();
  // Remove any clipboard we attached so suites stay independent.
  // delete is safe because we always defined it as configurable.
  try {
    // @ts-expect-error - allow removing the test-injected property
    delete navigator.clipboard;
  } catch {
    /* ignore environments that disallow deletion */
  }
});

describe("MessageActions — rendering", () => {
  it("is a defined, callable component export", () => {
    expect(MessageActions).toBeDefined();
    expect(typeof MessageActions).toBe("function");
  });

  it("renders a single copy button in the default (not-copied) state", () => {
    installClipboard(() => Promise.resolve());
    render(<MessageActions text="hello" roomId="room-1" />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(screen.getByText("Copy")).toBeInTheDocument();
    expect(screen.queryByText("Copied")).not.toBeInTheDocument();
  });

  it("renders without throwing for empty text / empty roomId", () => {
    installClipboard(() => Promise.resolve());
    expect(() =>
      render(<MessageActions text="" roomId="" />),
    ).not.toThrow();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});

describe("MessageActions — happy-path copy", () => {
  it("writes the exact text prop to the clipboard on click", async () => {
    const writeText = installClipboard(() => Promise.resolve());
    render(<MessageActions text="copy me / sao chép tôi" roomId="r-42" />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    expect(writeText).toHaveBeenCalledWith("copy me / sao chép tôi");
  });

  it("switches the button label to 'Copied' after a successful copy", async () => {
    installClipboard(() => Promise.resolve());
    render(<MessageActions text="hi" roomId="r" />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(screen.getByText("Copied")).toBeInTheDocument());
    expect(screen.queryByText("Copy")).not.toBeInTheDocument();
  });

  it("raises a success toast with bilingual title/description and 2000ms duration", async () => {
    installClipboard(() => Promise.resolve());
    render(<MessageActions text="x" roomId="r" />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(toastMock).toHaveBeenCalledTimes(1));
    expect(toastMock).toHaveBeenCalledWith({
      title: "Copied! / Đã sao chép!",
      description: "Advice copied to clipboard / Lời khuyên đã được sao chép",
      duration: 2000,
    });
    // success toast must NOT be destructive
    expect(toastMock.mock.calls[0][0]).not.toHaveProperty(
      "variant",
      "destructive",
    );
  });

  it("copies an empty string when text is empty", async () => {
    const writeText = installClipboard(() => Promise.resolve());
    render(<MessageActions text="" roomId="r" />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(""));
  });
});

describe("MessageActions — timed state reset", () => {
  it("reverts from 'Copied' back to 'Copy' after 2000ms", async () => {
    vi.useFakeTimers();
    installClipboard(() => Promise.resolve());
    render(<MessageActions text="t" roomId="r" />);

    // Drive the async writeText + state update under fake timers.
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });

    expect(screen.getByText("Copied")).toBeInTheDocument();

    // Before the timeout fully elapses, still "Copied".
    await act(async () => {
      vi.advanceTimersByTime(1999);
    });
    expect(screen.getByText("Copied")).toBeInTheDocument();

    // After 2000ms total, back to "Copy".
    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByText("Copy")).toBeInTheDocument();
    expect(screen.queryByText("Copied")).not.toBeInTheDocument();
  });
});

describe("MessageActions — error handling", () => {
  it("raises a destructive toast when clipboard write rejects", async () => {
    installClipboard(() => Promise.reject(new Error("denied")));
    render(<MessageActions text="x" roomId="r" />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(toastMock).toHaveBeenCalledTimes(1));
    expect(toastMock).toHaveBeenCalledWith({
      title: "Failed to copy / Sao chép thất bại",
      variant: "destructive",
      duration: 2000,
    });
  });

  it("stays in the 'Copy' (not-copied) state after a failed copy", async () => {
    installClipboard(() => Promise.reject(new Error("nope")));
    render(<MessageActions text="x" roomId="r" />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(toastMock).toHaveBeenCalledTimes(1));
    expect(screen.getByText("Copy")).toBeInTheDocument();
    expect(screen.queryByText("Copied")).not.toBeInTheDocument();
  });

  it("does not throw when navigator.clipboard is entirely undefined", async () => {
    // Remove the clipboard API and ensure the click still surfaces a
    // destructive toast rather than crashing the component.
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      writable: true,
      value: undefined,
    });

    render(<MessageActions text="x" roomId="r" />);
    expect(() => fireEvent.click(screen.getByRole("button"))).not.toThrow();

    await waitFor(() =>
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" }),
      ),
    );
  });
});

describe("MessageActions — repeated and concurrent interaction", () => {
  it("handles multiple successful clicks, copying the latest text each time", async () => {
    const writeText = installClipboard(() => Promise.resolve());
    const { rerender } = render(<MessageActions text="first" roomId="r" />);

    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(writeText).toHaveBeenLastCalledWith("first"));

    rerender(<MessageActions text="second" roomId="r" />);
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(writeText).toHaveBeenLastCalledWith("second"));

    expect(writeText).toHaveBeenCalledTimes(2);
  });

  it("each click produces its own toast", async () => {
    installClipboard(() => Promise.resolve());
    render(<MessageActions text="x" roomId="r" />);

    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(toastMock).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(toastMock).toHaveBeenCalledTimes(2));
  });
});

describe("MessageActions — edge-case text payloads", () => {
  const cases: Array<[string, string]> = [
    ["whitespace only", "   \t\n  "],
    ["unicode + emoji", "Xin chào 👋 — 日本語 — café"],
    ["very long text", "a".repeat(5000)],
    ["newlines and tabs", "line1\nline2\tcol"],
    ["html-ish content", "<script>alert(1)</script>"],
  ];

  it.each(cases)("copies %s verbatim", async (_label, value) => {
    const writeText = installClipboard(() => Promise.resolve());
    render(<MessageActions text={value} roomId="r" />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(value));
  });
});
