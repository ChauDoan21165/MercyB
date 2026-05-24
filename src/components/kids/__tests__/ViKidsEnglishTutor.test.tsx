import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ViKidsEnglishTutor from "../ViKidsEnglishTutor";

vi.mock("@/hooks/useUserAccess", () => ({
  useUserAccess: () => ({
    features: {
      hasMercyJourney: true,
      hasMercyGrammar: true,
      hasMercySpeak: true,
      hasMercyLogic: true,
    },
  }),
}));

vi.mock("@/hooks/useFeatureFlag", () => ({
  useFeatureFlag: (_key: string, defaultValue = false) => ({
    enabled: defaultValue,
    loading: false,
  }),
}));

vi.mock("@/components/notebook/NotebookPanel", () => ({
  NotebookPanel: () => null,
}));

vi.mock("@/components/notebook/SaveWordPopup", () => ({
  SaveWordPopup: () => null,
}));

vi.mock("@/components/share/ShareScoreButton", () => ({
  default: () => null,
}));

vi.mock("@/components/pronunciation/WaveformComparison", () => ({
  default: () => null,
}));

vi.mock("@/components/pronunciation/RetakeComparison", () => ({
  default: () => null,
}));

vi.mock("@/components/pronunciation/StreamingFeedback", () => ({
  default: () => null,
}));

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
  (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = undefined;
  (window as Window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition = undefined;
});

describe("ViKidsEnglishTutor", () => {
  it("hosts the shared Mercy Kids floating-box shell", async () => {
    render(<ViKidsEnglishTutor />);

    expect(screen.getByTestId("vi-kids-english-tutor")).toBeInTheDocument();
    expect(screen.getByTestId("mercy-kids-hosted-floating-shell")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Mercy Kids" })).toBeInTheDocument();
    expect(screen.getByText("Picture + speak")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByRole("button", { name: "Images" }).length).toBeGreaterThan(0);
    });
    expect(screen.getAllByRole("button", { name: "Say" }).length).toBeGreaterThan(0);
  });

  it("uses the Mercy Kids image picker inside the shared shell", async () => {
    render(<ViKidsEnglishTutor />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Page 1" })).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: "Apple" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Banana" })).toBeInTheDocument();
  });

  it("keeps speaking practice in the same Mercy Kids shell", async () => {
    render(<ViKidsEnglishTutor />);

    const sayButtons = await screen.findAllByRole("button", { name: "Say" });
    await userEvent.click(sayButtons[0]);

    expect(await screen.findByRole("heading", { name: /Apple/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Mercy/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /You/i })).toBeInTheDocument();
  });

  it("does not show the AI Tutor adult mode tabs or a sentence textarea", async () => {
    render(<ViKidsEnglishTutor />);

    await waitFor(() => {
      expect(screen.getAllByRole("button", { name: "Images" }).length).toBeGreaterThan(0);
    });

    expect(screen.queryByRole("button", { name: "Journey" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Grammar" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Speak" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Logic" })).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
