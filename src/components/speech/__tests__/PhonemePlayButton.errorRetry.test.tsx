// Contract C1: a single-tap cloud miss on PhonemePlayButton surfaces a VN
// error + retry and NEVER silently reads the word via window.speechSynthesis.
// (The double-tap slow-replay browser path is a separate, deliberate gesture.)

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

const speakMock = vi.fn();

vi.mock("@/hooks/useMercyVoice", () => ({
  useMercyVoice: () => ({ speak: speakMock, cancel: vi.fn() }),
}));

import PhonemePlayButton from "@/components/speech/PhonemePlayButton";

describe("PhonemePlayButton — C1 single-tap error+retry", () => {
  let synthSpeak: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    synthSpeak = vi.fn();
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: { speak: synthSpeak, cancel: vi.fn(), getVoices: () => [] },
    });
  });

  afterEach(() => vi.clearAllMocks());

  it("shows a VN error + retry and does NOT use speechSynthesis when cloud TTS misses", async () => {
    speakMock.mockResolvedValue({ cloud: false, spoken: false, error: "x" });
    render(<PhonemePlayButton text="think" language="en" />);

    fireEvent.click(screen.getByRole("button"));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/bấm lại/i);
    // Single-tap cloud-miss must not silently speak in a browser voice.
    expect(synthSpeak).not.toHaveBeenCalled();
    // The button advertises retry (re-press = retry; onClick clears the error).
    expect(screen.getByRole("button").getAttribute("aria-label")).toMatch(/thử lại|retry/i);
  });
});
