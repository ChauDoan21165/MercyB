import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

// ── Mocks ───────────────────────────────────────────────────────────

const mockUseFeatureFlag = vi.fn();
vi.mock("@/hooks/useFeatureFlag", () => ({
  useFeatureFlag: (...args: unknown[]) => mockUseFeatureFlag(...args),
}));

const mockTrackEvent = vi.fn();
vi.mock("@/lib/analytics", () => ({
  trackEvent: (...args: unknown[]) => mockTrackEvent(...args),
}));

// SpeechDrillSession is heavy — replace with a stub that exposes
// the sentences prop length and lets us simulate close.
vi.mock("@/components/speech/SpeechDrillSession", () => ({
  SpeechDrillSession: (props: { sentences: unknown[] }) => (
    <div data-testid="speech-drill-session-stub">
      sentences={props.sentences.length}
    </div>
  ),
}));

// ── Component under test ────────────────────────────────────────────

import { RoomPronunciationPractice } from "../RoomPronunciationPractice";

beforeEach(() => {
  cleanup();
  mockUseFeatureFlag.mockReset();
  mockTrackEvent.mockReset();
});

describe("RoomPronunciationPractice — gating", () => {
  it("does not render when feature flag is off", () => {
    mockUseFeatureFlag.mockReturnValue({ enabled: false, loading: false });
    const { container } = render(
      <RoomPronunciationPractice roomId="r1" keywordsEn={["hello", "world"]} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("does not render while feature-flag check is loading", () => {
    mockUseFeatureFlag.mockReturnValue({ enabled: true, loading: true });
    const { container } = render(
      <RoomPronunciationPractice roomId="r1" keywordsEn={["hello"]} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("does not render when the room has no keywords", () => {
    mockUseFeatureFlag.mockReturnValue({ enabled: true, loading: false });
    const { container } = render(
      <RoomPronunciationPractice roomId="r1" keywordsEn={[]} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("does not render when all keywords are empty/whitespace", () => {
    mockUseFeatureFlag.mockReturnValue({ enabled: true, loading: false });
    const { container } = render(
      <RoomPronunciationPractice roomId="r1" keywordsEn={["", "  "]} />,
    );
    expect(container.firstChild).toBeNull();
  });
});

describe("RoomPronunciationPractice — happy path", () => {
  beforeEach(() => {
    mockUseFeatureFlag.mockReturnValue({ enabled: true, loading: false });
  });

  it("renders the button with bilingual label and mic icon", () => {
    render(
      <RoomPronunciationPractice
        roomId="r1"
        keywordsEn={["hello", "world"]}
      />,
    );
    const btn = screen.getByTestId("room-pronunciation-practice-button");
    expect(btn).toBeTruthy();
    expect(btn.textContent).toContain("Practice pronunciation");
    expect(btn.textContent).toContain("Luyện phát âm");
  });

  it("clicking the button opens the modal with SpeechDrillSession + correct sentence count", () => {
    render(
      <RoomPronunciationPractice
        roomId="r1"
        keywordsEn={["hello", "world", "morning"]}
      />,
    );
    fireEvent.click(screen.getByTestId("room-pronunciation-practice-button"));

    const session = screen.getByTestId("speech-drill-session-stub");
    expect(session.textContent).toContain("sentences=3");
  });

  it("fires room_pronunciation_practice_opened on click with room_id + keyword_count", () => {
    render(
      <RoomPronunciationPractice
        roomId="room-xyz"
        keywordsEn={["alpha", "beta"]}
      />,
    );
    fireEvent.click(screen.getByTestId("room-pronunciation-practice-button"));

    expect(mockTrackEvent).toHaveBeenCalledWith(
      "room_pronunciation_practice_opened",
      { room_id: "room-xyz", keyword_count: 2 },
    );
  });

  it("dedupes case-insensitive duplicates in the sentence list", () => {
    render(
      <RoomPronunciationPractice
        roomId="r1"
        keywordsEn={["Hello", "hello", "world"]}
      />,
    );
    fireEvent.click(screen.getByTestId("room-pronunciation-practice-button"));
    expect(screen.getByTestId("speech-drill-session-stub").textContent).toContain(
      "sentences=2",
    );
  });

  it("closing the modal fires room_pronunciation_practice_closed", () => {
    render(
      <RoomPronunciationPractice
        roomId="room-xyz"
        keywordsEn={["alpha"]}
      />,
    );
    fireEvent.click(screen.getByTestId("room-pronunciation-practice-button"));
    // Reset before close so we only check the close payload.
    mockTrackEvent.mockClear();

    // Simulate close via Escape (Radix Dialog supports this).
    fireEvent.keyDown(document.body, { key: "Escape", code: "Escape" });

    expect(mockTrackEvent).toHaveBeenCalledWith(
      "room_pronunciation_practice_closed",
      { room_id: "room-xyz", sentences_completed: 0 },
    );
  });
});
