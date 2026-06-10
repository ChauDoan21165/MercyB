// Contract C1: when the cloud (Azure) voice for a roleplay reply is
// unavailable, RoleplaySession surfaces an explicit VN error + retry and never
// silently reads the reply via window.speechSynthesis.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { RoleplaySession, type RoleplayScenario } from "@/components/roleplay/RoleplaySession";

const scenario: RoleplayScenario = {
  id: "s1",
  title: "Cafe",
  setup: "Order a coffee.",
  mercyOpener: "Hi! What can I get for you today?",
};

describe("RoleplaySession — C1: no silent browser TTS fallback", () => {
  let synthSpeak: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    synthSpeak = vi.fn();
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: { speak: synthSpeak, cancel: vi.fn(), getVoices: () => [] },
    });
    // Cloud TTS endpoint fails → must NOT quietly switch to a device voice.
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("shows a VN voice error + retry and never calls speechSynthesis.speak when cloud TTS fails", async () => {
    render(<RoleplaySession scenario={scenario} />);

    // Starting the session adds the Mercy opener turn, which auto-speaks.
    fireEvent.click(screen.getByRole("button", { name: /Start Roleplay/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/không khả dụng|thử lại/i);
    expect(screen.getByRole("button", { name: /Thử lại/i })).toBeInTheDocument();
    expect(synthSpeak).not.toHaveBeenCalled();
  });
});
