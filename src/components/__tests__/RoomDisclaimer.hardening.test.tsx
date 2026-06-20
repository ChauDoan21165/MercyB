// FILE: src/components/__tests__/RoomDisclaimer.hardening.test.tsx
//
// Hardening unit tests for src/components/RoomDisclaimer.tsx
//
// RoomDisclaimer is a React component that:
//   - reads a roomId prop,
//   - resolves a room loader from @/lib/roomFetcher using a build-safe
//     fallback chain (getRoom -> getRoomById -> fetchRoom -> roomMasterLoader),
//   - normalizes many disclaimer schema shapes (flat strings, {en,vi} objects,
//     nested under `content`), trims + drops empties,
//   - renders a bilingual safety/crisis disclaimer, or null when there is
//     nothing safe to show or on any failure.
//
// Only `RoomDisclaimer` is exported from the module, so that is all we import.
// External dependencies (@/lib/roomFetcher, ./HighlightedContent) are mocked.

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";

import { RoomDisclaimer } from "../RoomDisclaimer";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Mutable holder for the loader functions exposed by @/lib/roomFetcher.
// Using lazy getters lets each test swap which loader names exist, which is
// exactly what the component's fallback chain inspects.
const mockImpls: {
  getRoom?: unknown;
  getRoomById?: unknown;
  fetchRoom?: unknown;
  roomMasterLoader?: unknown;
} = {};

vi.mock("@/lib/roomFetcher", () => ({
  get getRoom() {
    return mockImpls.getRoom;
  },
  get getRoomById() {
    return mockImpls.getRoomById;
  },
  get fetchRoom() {
    return mockImpls.fetchRoom;
  },
  get roomMasterLoader() {
    return mockImpls.roomMasterLoader;
  },
}));

// Render the highlighted content as plain, queryable text so we can assert on it.
vi.mock("../HighlightedContent", () => ({
  HighlightedContent: ({ content }: { content: string }) => (
    <span data-testid="hc">{content}</span>
  ),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Install a getRoom loader that resolves to `room`. */
function setRoom(room: unknown) {
  const fn = vi.fn(async () => room);
  mockImpls.getRoom = fn;
  return fn;
}

/** Read the visible disclaimer text (each HighlightedContent span). */
function visibleTexts(): string[] {
  return screen.queryAllByTestId("hc").map((n) => n.textContent ?? "");
}

beforeEach(() => {
  mockImpls.getRoom = undefined;
  mockImpls.getRoomById = undefined;
  mockImpls.fetchRoom = undefined;
  mockImpls.roomMasterLoader = undefined;
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// roomId guard cases
// ---------------------------------------------------------------------------

describe("RoomDisclaimer — roomId guards", () => {
  it("renders nothing and never calls the loader for an empty roomId", () => {
    const getRoom = setRoom({ safety_disclaimer: "should not show" });
    const { container } = render(<RoomDisclaimer roomId="" />);
    expect(container).toBeEmptyDOMElement();
    expect(getRoom).not.toHaveBeenCalled();
  });

  it("renders nothing for a whitespace-only roomId", () => {
    const getRoom = setRoom({ safety_disclaimer: "should not show" });
    const { container } = render(<RoomDisclaimer roomId="   " />);
    expect(container).toBeEmptyDOMElement();
    expect(getRoom).not.toHaveBeenCalled();
  });

  it("trims the roomId before passing it to the loader", async () => {
    const getRoom = setRoom({ safety_disclaimer: "Stay safe" });
    render(<RoomDisclaimer roomId="  room-42  " />);
    await waitFor(() => expect(getRoom).toHaveBeenCalledWith("room-42"));
  });
});

// ---------------------------------------------------------------------------
// Loader resolution / fallback chain
// ---------------------------------------------------------------------------

describe("RoomDisclaimer — loader resolution", () => {
  it("renders nothing when no loader function exists on roomFetcher", async () => {
    const { container } = render(<RoomDisclaimer roomId="r1" />);
    // Give the effect a chance to run; it should bail synchronously.
    await Promise.resolve();
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when the resolved loader value is not a function", async () => {
    mockImpls.getRoom = "not-a-function";
    const { container } = render(<RoomDisclaimer roomId="r1" />);
    await Promise.resolve();
    expect(container).toBeEmptyDOMElement();
  });

  it("falls back to getRoomById when getRoom is absent", async () => {
    const getRoomById = vi.fn(async () => ({ safety_disclaimer: "Via getRoomById" }));
    mockImpls.getRoomById = getRoomById;
    render(<RoomDisclaimer roomId="r2" />);
    expect(await screen.findByText("Via getRoomById")).toBeInTheDocument();
    expect(getRoomById).toHaveBeenCalledWith("r2");
  });

  it("falls back to fetchRoom when getRoom and getRoomById are absent", async () => {
    const fetchRoom = vi.fn(async () => ({ safety_disclaimer: "Via fetchRoom" }));
    mockImpls.fetchRoom = fetchRoom;
    render(<RoomDisclaimer roomId="r3" />);
    expect(await screen.findByText("Via fetchRoom")).toBeInTheDocument();
    expect(fetchRoom).toHaveBeenCalledWith("r3");
  });

  it("falls back to roomMasterLoader as the last option", async () => {
    const roomMasterLoader = vi.fn(async () => ({ safety_disclaimer: "Via masterLoader" }));
    mockImpls.roomMasterLoader = roomMasterLoader;
    render(<RoomDisclaimer roomId="r4" />);
    expect(await screen.findByText("Via masterLoader")).toBeInTheDocument();
    expect(roomMasterLoader).toHaveBeenCalledWith("r4");
  });

  it("prefers getRoom over the other loaders when several exist", async () => {
    const getRoom = setRoom({ safety_disclaimer: "From getRoom" });
    const getRoomById = vi.fn(async () => ({ safety_disclaimer: "From getRoomById" }));
    mockImpls.getRoomById = getRoomById;
    render(<RoomDisclaimer roomId="r5" />);
    expect(await screen.findByText("From getRoom")).toBeInTheDocument();
    expect(getRoom).toHaveBeenCalledTimes(1);
    expect(getRoomById).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Empty / null room results
// ---------------------------------------------------------------------------

describe("RoomDisclaimer — empty results", () => {
  it("renders nothing when the loader resolves to null", async () => {
    const getRoom = setRoom(null);
    const { container } = render(<RoomDisclaimer roomId="r1" />);
    await waitFor(() => expect(getRoom).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when the loader resolves to undefined", async () => {
    const getRoom = setRoom(undefined);
    const { container } = render(<RoomDisclaimer roomId="r1" />);
    await waitFor(() => expect(getRoom).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when the room has no disclaimer fields", async () => {
    const getRoom = setRoom({ title: "A room", content: { body: "hi" } });
    const { container } = render(<RoomDisclaimer roomId="r1" />);
    await waitFor(() => expect(getRoom).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });

  it("treats whitespace-only disclaimer strings as empty", async () => {
    const getRoom = setRoom({
      safety_disclaimer_en: "   ",
      safety_disclaimer_vi: "\n\t ",
      crisis_footer_en: "",
    });
    const { container } = render(<RoomDisclaimer roomId="r1" />);
    await waitFor(() => expect(getRoom).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });

  it("ignores non-string / array shapes that carry no usable text", async () => {
    const getRoom = setRoom({
      safety_disclaimer: ["not", "usable"],
      crisis_footer: 12345,
      content: { safety: [] },
    });
    const { container } = render(<RoomDisclaimer roomId="r1" />);
    await waitFor(() => expect(getRoom).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });
});

// ---------------------------------------------------------------------------
// Schema normalization — safety disclaimer
// ---------------------------------------------------------------------------

describe("RoomDisclaimer — safety disclaimer shapes", () => {
  it("renders a flat safety_disclaimer string as the EN line", async () => {
    setRoom({ safety_disclaimer: "  Please be careful  " });
    render(<RoomDisclaimer roomId="r1" />);
    // Trimmed.
    expect(await screen.findByText("Please be careful")).toBeInTheDocument();
    await waitFor(() => expect(visibleTexts()).toEqual(["Please be careful"]));
  });

  it("renders a { en, vi } safety object as two lines", async () => {
    setRoom({ safety_disclaimer: { en: "Be safe", vi: "Hãy an toàn" } });
    render(<RoomDisclaimer roomId="r1" />);
    expect(await screen.findByText("Be safe")).toBeInTheDocument();
    expect(screen.getByText("Hãy an toàn")).toBeInTheDocument();
  });

  it("reads safety from nested content.safety object", async () => {
    setRoom({ content: { safety: { en: "Nested EN", vi: "Nested VI" } } });
    render(<RoomDisclaimer roomId="r1" />);
    expect(await screen.findByText("Nested EN")).toBeInTheDocument();
    expect(screen.getByText("Nested VI")).toBeInTheDocument();
  });

  it("uses explicit *_en / *_vi flat fields", async () => {
    setRoom({
      safety_disclaimer_en: "Flat EN",
      safety_disclaimer_vi: "Flat VI",
    });
    render(<RoomDisclaimer roomId="r1" />);
    expect(await screen.findByText("Flat EN")).toBeInTheDocument();
    expect(screen.getByText("Flat VI")).toBeInTheDocument();
  });

  it("prefers explicit direct vi/en fields over the object form", async () => {
    setRoom({
      safety_disclaimer: { en: "Object EN", vi: "Object VI" },
      safety_disclaimer_en: "Direct EN",
      safety_disclaimer_vi: "Direct VI",
    });
    render(<RoomDisclaimer roomId="r1" />);
    expect(await screen.findByText("Direct EN")).toBeInTheDocument();
    expect(screen.getByText("Direct VI")).toBeInTheDocument();
    expect(screen.queryByText("Object EN")).not.toBeInTheDocument();
    expect(screen.queryByText("Object VI")).not.toBeInTheDocument();
  });

  it("reads content.safety_en / content.safety_vi when present", async () => {
    setRoom({ content: { safety_en: "ContentEN", safety_vi: "ContentVI" } });
    render(<RoomDisclaimer roomId="r1" />);
    expect(await screen.findByText("ContentEN")).toBeInTheDocument();
    expect(screen.getByText("ContentVI")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Schema normalization — crisis footer
// ---------------------------------------------------------------------------

describe("RoomDisclaimer — crisis footer shapes", () => {
  it("renders a { en, vi } crisis footer object", async () => {
    setRoom({ crisis_footer: { en: "Call 911", vi: "Gọi 115" } });
    render(<RoomDisclaimer roomId="r1" />);
    expect(await screen.findByText("Call 911")).toBeInTheDocument();
    expect(screen.getByText("Gọi 115")).toBeInTheDocument();
  });

  it("renders flat crisis_footer_en / crisis_footer_vi fields", async () => {
    setRoom({ crisis_footer_en: "Crisis EN", crisis_footer_vi: "Crisis VI" });
    render(<RoomDisclaimer roomId="r1" />);
    expect(await screen.findByText("Crisis EN")).toBeInTheDocument();
    expect(screen.getByText("Crisis VI")).toBeInTheDocument();
  });

  it("reads crisis footer from nested content.crisis_footer", async () => {
    setRoom({ content: { crisis_footer: { en: "NestedCrisisEN", vi: "NestedCrisisVI" } } });
    render(<RoomDisclaimer roomId="r1" />);
    expect(await screen.findByText("NestedCrisisEN")).toBeInTheDocument();
    expect(screen.getByText("NestedCrisisVI")).toBeInTheDocument();
  });

  it("renders both safety and crisis blocks together", async () => {
    setRoom({
      safety_disclaimer: { en: "S-EN", vi: "S-VI" },
      crisis_footer: { en: "C-EN", vi: "C-VI" },
    });
    render(<RoomDisclaimer roomId="r1" />);
    await screen.findByText("S-EN");
    expect(visibleTexts()).toEqual(["S-EN", "S-VI", "C-EN", "C-VI"]);
  });
});

// ---------------------------------------------------------------------------
// Container / styling presence
// ---------------------------------------------------------------------------

describe("RoomDisclaimer — rendered structure", () => {
  it("wraps content in the warning container with the alert icon", async () => {
    const { container } = render(<RoomDisclaimer roomId="r1" />);
    setRoom({ safety_disclaimer: "Heads up" });
    // Re-render with the loader available.
    cleanup();
    setRoom({ safety_disclaimer: "Heads up" });
    const { container: c2 } = render(<RoomDisclaimer roomId="r1" />);
    await screen.findByText("Heads up");
    const box = c2.querySelector("div.rounded-lg");
    expect(box).not.toBeNull();
    // lucide AlertCircle renders an <svg>.
    expect(c2.querySelector("svg")).not.toBeNull();
    // The initial empty render produced no box.
    expect(container).toBeEmptyDOMElement();
  });
});

// ---------------------------------------------------------------------------
// Error handling & async safety
// ---------------------------------------------------------------------------

describe("RoomDisclaimer — error & async safety", () => {
  it("renders nothing when the loader rejects (graceful failure)", async () => {
    const getRoom = vi.fn(async () => {
      throw new Error("boom");
    });
    mockImpls.getRoom = getRoom;
    const { container } = render(<RoomDisclaimer roomId="r1" />);
    await waitFor(() => expect(getRoom).toHaveBeenCalled());
    // Allow the rejected promise's catch to settle.
    await Promise.resolve();
    expect(container).toBeEmptyDOMElement();
  });

  it("does not throw when unmounted before the loader resolves", async () => {
    let resolveRoom!: (v: unknown) => void;
    const pending = new Promise<unknown>((res) => {
      resolveRoom = res;
    });
    const getRoom = vi.fn(() => pending);
    mockImpls.getRoom = getRoom;

    const { unmount, container } = render(<RoomDisclaimer roomId="r1" />);
    await waitFor(() => expect(getRoom).toHaveBeenCalled());
    unmount();

    // Resolve after unmount — the cancel flag must prevent any setState.
    resolveRoom({ safety_disclaimer: "Too late" });
    await Promise.resolve();
    await Promise.resolve();

    expect(container).toBeEmptyDOMElement();
  });

  it("re-fetches when roomId changes", async () => {
    const first = vi.fn(async () => ({ safety_disclaimer: "First room" }));
    mockImpls.getRoom = first;
    const { rerender } = render(<RoomDisclaimer roomId="a" />);
    expect(await screen.findByText("First room")).toBeInTheDocument();
    expect(first).toHaveBeenCalledWith("a");

    const second = vi.fn(async () => ({ safety_disclaimer: "Second room" }));
    mockImpls.getRoom = second;
    rerender(<RoomDisclaimer roomId="b" />);
    expect(await screen.findByText("Second room")).toBeInTheDocument();
    expect(second).toHaveBeenCalledWith("b");
    expect(screen.queryByText("First room")).not.toBeInTheDocument();
  });

  it("clears the disclaimer when a new room has no disclaimer data", async () => {
    const first = vi.fn(async () => ({ safety_disclaimer: "Has data" }));
    mockImpls.getRoom = first;
    const { rerender, container } = render(<RoomDisclaimer roomId="a" />);
    expect(await screen.findByText("Has data")).toBeInTheDocument();

    const second = vi.fn(async () => ({ title: "empty" }));
    mockImpls.getRoom = second;
    rerender(<RoomDisclaimer roomId="b" />);
    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });
});
