import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { PlacementV3Task } from "@/lib/placement/v3/types";
import { ListeningTaskCard } from "@/components/placement/v3";

vi.mock("@/lib/telemetry/signalCell", () => ({
  openSignal: () => ({ succeeded: vi.fn(), failed: vi.fn(), cancel: vi.fn() }),
}));

const base: PlacementV3Task = {
  id: "a2-l-food-order",
  modality: "listening",
  type: "listening_mcq",
  instruction: { en: "Listen and choose.", vi: "Nghe và chọn." },
  prompt: { en: "What did she order?", vi: "Cô ấy gọi món gì?" },
  options: [{ id: "a", label: { en: "Coffee", vi: "Cà phê" } }],
};

/**
 * The live prompt catalog ships six listening prompts and zero audio files, so
 * `task.audioUrl` is undefined in production. A sourceless <audio> renders a
 * 0:00/0:00 control that can never play and fires no `error` event.
 */
describe("ListeningTaskCard — only renders a player with a real source", () => {
  it("renders no <audio> element when the task has no audioUrl", () => {
    const { container } = render(<ListeningTaskCard task={base} value="" onChange={vi.fn()} />);
    expect(container.querySelector("audio")).toBeNull();
  });

  it("tells the learner the audio is unavailable and the score is excluded", () => {
    render(<ListeningTaskCard task={base} value="" onChange={vi.fn()} />);
    expect(screen.getByText(/Audio is unavailable for this question/i)).toBeInTheDocument();
  });

  it("still renders the answer options so the learner can continue", () => {
    render(<ListeningTaskCard task={base} value="" onChange={vi.fn()} />);
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("renders the player when a real audioUrl is present", () => {
    const withAudio = { ...base, audioUrl: "/audio/placement-v3/listening-a2-class-delay-1.mp3" };
    const { container } = render(<ListeningTaskCard task={withAudio} value="" onChange={vi.fn()} />);
    const audio = container.querySelector("audio");
    expect(audio).not.toBeNull();
    expect(audio?.getAttribute("src")).toBe("/audio/placement-v3/listening-a2-class-delay-1.mp3");
  });
});
