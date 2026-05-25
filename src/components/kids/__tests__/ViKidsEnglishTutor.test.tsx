import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ViKidsEnglishTutor from "../ViKidsEnglishTutor";

const { recordLearningEvent } = vi.hoisted(() => ({
  recordLearningEvent: vi.fn(),
}));

vi.mock("@/lib/tutor/learningEvents", () => ({
  recordLearningEvent,
}));

beforeEach(() => {
  vi.clearAllMocks();
  (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = undefined;
  (window as Window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition = undefined;
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: undefined,
  });
});

describe("ViKidsEnglishTutor", () => {
  it("renders the picture + speak only Mercy Kids foundation flow", () => {
    render(<ViKidsEnglishTutor />);

    expect(screen.getByTestId("vi-kids-english-tutor")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Mercy Kids" })).toBeInTheDocument();
    expect(screen.getByText("1. Chọn hình")).toBeInTheDocument();
    expect(screen.getByText("2. Bấm để nói")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Bấm để nói với Mercy/i })).toBeInTheDocument();

    for (const label of ["apple quả táo", "dog con chó", "cat con mèo", "sun mặt trời", "car xe hơi", "book quyển sách"]) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    }
  });

  it("does not render adult tutor shell, tabs, textarea, memory, or MercySpeakTab mount", () => {
    render(<ViKidsEnglishTutor />);

    for (const tabName of ["Journey", "Grammar", "Speak", "Logic", "Mercy Teacher", "Mercy Speak"]) {
      expect(screen.queryByRole("tab", { name: tabName })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: tabName })).not.toBeInTheDocument();
    }

    expect(screen.queryByTestId("teacher-mercy-learning-shell")).not.toBeInTheDocument();
    expect(screen.queryByTestId("vi-kids-mercy-teacher-mount")).not.toBeInTheDocument();
    expect(screen.queryByTestId("vi-kids-mercy-speak-mount")).not.toBeInTheDocument();
    expect(document.querySelector("textarea")).toBeNull();
    expect(screen.queryByText(/Nhắc nhẹ hôm nay|Memory/i)).not.toBeInTheDocument();
  });

  it("keeps adult recording, scoring, waveform, and playback UI unreachable from Kids", async () => {
    const getUserMedia = vi.fn();
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia },
    });

    render(<ViKidsEnglishTutor />);

    await userEvent.click(screen.getByRole("button", { name: "dog con chó" }));
    await userEvent.click(screen.getByRole("button", { name: /Bấm để nói với Mercy/i }));

    expect(screen.queryByRole("button", { name: /Record/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Play/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/So sánh với Mercy|waveform|scoring|phoneme|Mobile audio retest/i)).not.toBeInTheDocument();
    expect(getUserMedia).not.toHaveBeenCalled();
  });

  it("records only safe local Kids event tags for picture and speak actions", async () => {
    render(<ViKidsEnglishTutor />);

    await userEvent.click(screen.getByRole("button", { name: "cat con mèo" }));
    await userEvent.click(screen.getByRole("button", { name: /Bấm để nói với Mercy/i }));

    expect(recordLearningEvent).toHaveBeenCalledWith({
      eventType: "kids_picture_selected",
      product: "mercy_kids",
      targetLanguage: "en",
      safeTopicTag: "cat",
    });
    expect(recordLearningEvent).toHaveBeenCalledWith({
      eventType: "kids_speak_clicked",
      product: "mercy_kids",
      targetLanguage: "en",
      safeTopicTag: "cat",
    });
  });

  it("updates the speak panel after a picture is selected", async () => {
    render(<ViKidsEnglishTutor />);

    await userEvent.click(screen.getByRole("button", { name: "book quyển sách" }));

    const tutor = screen.getByTestId("vi-kids-english-tutor");
    expect(within(tutor).getByText("I see a book.")).toBeInTheDocument();
    expect(within(tutor).getAllByText("quyển sách").length).toBeGreaterThan(0);
  });
});
