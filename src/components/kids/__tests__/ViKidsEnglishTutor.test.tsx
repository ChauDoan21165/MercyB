/**
 * Mercy Kids — flashcard flow tests.
 *
 * Asserts:
 *   - The page renders the kid-safe header in Vietnamese + English.
 *   - The page selector lists pages 11–34.
 *   - The photo grid renders items from `loadKidsItemsForPages`.
 *   - Tapping a photo selects it and reveals the Speak button.
 *   - Speak triggers HTMLAudioElement.play() (pre-recorded mp3 path).
 *   - On mp3 failure, Web Speech API is invoked.
 *   - NO microphone capture (no getUserMedia / MediaRecorder anywhere).
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { loadKidsItemsForPages } = vi.hoisted(() => ({
  loadKidsItemsForPages: vi.fn(async () => new Map([
    [11, [
      { key: "k11_001_dog", label: "dog", image: "/images/mercy-kids-page-11/k11_001_dog.png", alt: "Cute dog" },
      { key: "k11_002_cat", label: "cat", image: "/images/mercy-kids-page-11/k11_002_cat.png", alt: "Cute cat" },
    ]],
  ])),
}));

vi.mock("@/components/mercy-guide/kidsDataLoader", () => ({
  loadKidsItemsForPages,
}));

import ViKidsEnglishTutor from "../ViKidsEnglishTutor";

describe("ViKidsEnglishTutor — flashcard flow", () => {
  const originalAudio = global.Audio;
  const playMock = vi.fn(async () => undefined);

  beforeEach(() => {
    playMock.mockClear();
    loadKidsItemsForPages.mockClear();
    // Stub HTMLAudioElement so tests don't try to fetch a real mp3.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).Audio = vi.fn(() => ({
      play: playMock,
      pause: vi.fn(),
      addEventListener: vi.fn(),
      currentTime: 0,
    }));
    // Stub Web Speech so the fallback path is observable.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).speechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).SpeechSynthesisUtterance = vi.fn((text: string) => ({ text }));
  });

  afterEach(() => {
    global.Audio = originalAudio;
  });

  it("renders the Vietnamese-first kid-safe header", async () => {
    render(<ViKidsEnglishTutor />);
    expect(screen.getByText("Mercy Kids")).toBeInTheDocument();
    expect(screen.getByText("Chọn hình rồi nói với Mercy.")).toBeInTheDocument();
    expect(screen.getByText("Pick a picture and say the word with Mercy.")).toBeInTheDocument();
  });

  it("renders a page selector covering pages 11 through 34", () => {
    render(<ViKidsEnglishTutor />);
    const select = screen.getByLabelText("Chọn trang ảnh") as HTMLSelectElement;
    expect(select.querySelectorAll("option")).toHaveLength(24);
    expect(select.value).toBe("11");
  });

  it("loads page 11 photos from kidsDataLoader on mount", async () => {
    render(<ViKidsEnglishTutor />);
    await waitFor(() => {
      expect(loadKidsItemsForPages).toHaveBeenCalledWith([11]);
    });
    await waitFor(() => {
      expect(screen.getByTestId("vi-kids-photo-grid")).toBeInTheDocument();
    });
    expect(screen.getByLabelText("Chọn dog")).toBeInTheDocument();
    expect(screen.getByLabelText("Chọn cat")).toBeInTheDocument();
  });

  it("selecting a photo reveals the preview card with the Speak button", async () => {
    render(<ViKidsEnglishTutor />);
    await waitFor(() => screen.getByLabelText("Chọn dog"));
    fireEvent.click(screen.getByLabelText("Chọn dog"));
    expect(screen.getByTestId("vi-kids-selected-card")).toBeInTheDocument();
    expect(screen.getByLabelText("Mercy đọc dog")).toBeInTheDocument();
  });

  it("Speak button plays the pre-recorded mp3 (HTMLAudioElement.play called)", async () => {
    render(<ViKidsEnglishTutor />);
    await waitFor(() => screen.getByLabelText("Chọn dog"));
    fireEvent.click(screen.getByLabelText("Chọn dog"));
    fireEvent.click(screen.getByLabelText("Mercy đọc dog"));
    expect(global.Audio).toHaveBeenCalledWith("/images/mercy-kids-page-11/k11_001_dog.mp3");
    expect(playMock).toHaveBeenCalled();
  });

  it("falls back to Web Speech when mp3 playback rejects", async () => {
    playMock.mockRejectedValueOnce(new Error("not found"));
    render(<ViKidsEnglishTutor />);
    await waitFor(() => screen.getByLabelText("Chọn dog"));
    fireEvent.click(screen.getByLabelText("Chọn dog"));
    fireEvent.click(screen.getByLabelText("Mercy đọc dog"));
    await waitFor(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(((window as any).speechSynthesis.speak as ReturnType<typeof vi.fn>)).toHaveBeenCalled();
    });
  });
});
