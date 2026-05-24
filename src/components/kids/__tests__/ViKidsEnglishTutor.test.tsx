import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { SpeechRecognitionLike } from "@/types/speech-recognition";
import ViKidsEnglishTutor from "../ViKidsEnglishTutor";

beforeEach(() => {
  vi.clearAllMocks();
  (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = undefined;
  (window as Window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition = undefined;
});

describe("ViKidsEnglishTutor", () => {
  it("renders the two-column picture + speak layout", () => {
    render(<ViKidsEnglishTutor />);
    expect(screen.getByRole("heading", { name: "Mercy Kids" })).toBeInTheDocument();
    expect(screen.getByText(/Chọn hình rồi nói với Mercy/)).toBeInTheDocument();
    expect(screen.getByText("1. Chọn hình")).toBeInTheDocument();
    expect(screen.getByText("2. Bấm để nói")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Chọn quả táo/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Chọn con chó/ })).toBeInTheDocument();
    expect(screen.getByText(/Kids-safe/)).toBeInTheDocument();
  });

  it("shows the speak guidance before a picture is picked", () => {
    render(<ViKidsEnglishTutor />);
    expect(screen.getByText(/Chọn một hình bên trái/)).toBeInTheDocument();
  });

  it("enables the mic button after picking a picture", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition =
      class {} as unknown as new () => SpeechRecognitionLike;
    render(<ViKidsEnglishTutor />);
    await userEvent.click(screen.getByRole("button", { name: /Chọn quả táo/ }));
    // "apple" appears in both columns — picture picker + selected view
    expect(screen.getAllByText("apple").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole("button", { name: /Bấm để nói với Mercy/ })).toBeInTheDocument();
    expect(screen.getByText("Nói")).toBeInTheDocument();
  });

  it("does not show Journey/Grammar/Speak/Logic mode tabs", () => {
    render(<ViKidsEnglishTutor />);
    expect(screen.queryByRole("button", { name: "Journey" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Grammar" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Speak" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Logic" })).not.toBeInTheDocument();
  });

  it("does not show a textarea for sentence input", () => {
    render(<ViKidsEnglishTutor />);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
