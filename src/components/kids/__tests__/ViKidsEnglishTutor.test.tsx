import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ViKidsEnglishTutor from "../ViKidsEnglishTutor";

const { fetchCloudTtsUrl } = vi.hoisted(() => ({
  fetchCloudTtsUrl: vi.fn(async () => null),
}));

vi.mock("@/lib/mercyVoice", () => ({
  fetchCloudTtsUrl,
}));

describe("ViKidsEnglishTutor", () => {
  it("uses the shared Teacher Mercy shell with kids English copy", () => {
    render(<ViKidsEnglishTutor />);

    expect(screen.getByTestId("vi-kids-english-tutor")).toBeInTheDocument();
    expect(screen.getByTestId("teacher-mercy-floating-box")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Teacher Mercy · English for Việt Kids/ })).toBeInTheDocument();
    expect(screen.getByText(/Việt Kids English/)).toBeInTheDocument();
    const pillars = within(screen.getByTestId("teacher-mercy-pillar-tabs"));
    expect(pillars.getByRole("button", { name: "Journey" })).toBeInTheDocument();
    expect(pillars.getByRole("button", { name: "Grammar" })).toBeInTheDocument();
    expect(pillars.getByRole("button", { name: "Speak" })).toBeInTheDocument();
    expect(pillars.getByRole("button", { name: "Logic" })).toBeInTheDocument();
  });

  it("keeps speak controls cloud-first without storing audio", async () => {
    fetchCloudTtsUrl.mockResolvedValue({ audioUrl: "https://example.com/kids.mp3", cached: false });
    Object.defineProperty(window, "Audio", {
      configurable: true,
      value: class {
        src: string;
        onplay: (() => void) | null = null;
        onended: (() => void) | null = null;
        onerror: (() => void) | null = null;
        constructor(src: string) {
          this.src = src;
        }
        pause = vi.fn();
        async play() {
          this.onplay?.();
          this.onended?.();
        }
      },
    });

    render(<ViKidsEnglishTutor />);
    await userEvent.click(within(screen.getByTestId("teacher-mercy-mode-tabs")).getByRole("button", { name: "Speak" }));
    await userEvent.click(screen.getByRole("button", { name: /Mercy đọc/ }));

    expect(fetchCloudTtsUrl).toHaveBeenCalledWith({
      text: "I like apples.",
      language: "en",
    });
  });
});
