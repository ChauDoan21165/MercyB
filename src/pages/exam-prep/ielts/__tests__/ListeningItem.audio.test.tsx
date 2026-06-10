// Contract C1 guard for the IELTS Listening item page: when the cloud voice is
// unavailable, the page shows an explicit error + retry and NEVER reads the
// script via window.speechSynthesis (no silent browser fallback).

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const speakMock = vi.fn();
const cancelMock = vi.fn();

vi.mock("@/hooks/useMercyVoice", () => ({
  useMercyVoice: () => ({ speak: speakMock, cancel: cancelMock, supported: true }),
}));

vi.mock("react-router-dom", () => ({
  useParams: () => ({ itemId: "test-1" }),
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/data/exam-prep/ielts/listening-items", () => ({
  getIELTSListeningItemById: () => ({
    section: 1,
    difficulty_band: "6.0",
    estimated_time_minutes: 5,
    topic_title_vi: "Chủ đề",
    topic_title_en: "Topic",
    audio_script: "TUTOR: Hello there, welcome.",
    questions: [],
    vocabulary_focus: [],
    vietnamese_speaker_strategies: [],
    common_mistakes_vi: [],
  }),
  listeningRawToBand: () => 6,
}));

import ListeningItem from "@/pages/exam-prep/ielts/ListeningItem";

describe("ListeningItem audio — Contract C1: no silent browser fallback", () => {
  let speechSpeak: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    speechSpeak = vi.fn();
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: { speak: speechSpeak, cancel: vi.fn(), getVoices: () => [] },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows error + retry and does NOT use speechSynthesis when cloud TTS fails", async () => {
    speakMock.mockResolvedValue({ cloud: false });
    render(<ListeningItem />);

    fireEvent.click(screen.getByRole("button", { name: /Practice with audio/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/thử lại|vui lòng/i);
    expect(screen.getByRole("button", { name: /Retry/i })).toBeInTheDocument();
    expect(speechSpeak).not.toHaveBeenCalled();
  });

  it("plays via cloud with no error when cloud TTS succeeds", async () => {
    speakMock.mockResolvedValue({ cloud: true, cached: false });
    render(<ListeningItem />);

    fireEvent.click(screen.getByRole("button", { name: /Practice with audio/i }));

    await waitFor(() => expect(speakMock).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(speechSpeak).not.toHaveBeenCalled();
  });
});
