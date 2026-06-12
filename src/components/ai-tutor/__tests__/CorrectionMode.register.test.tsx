import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CorrectionMode from "@/components/ai-tutor/CorrectionMode";
import { getTutorCopy } from "@/lib/tutor/tutorCopy";

const trackEvent = vi.hoisted(() => vi.fn());
vi.mock("@/lib/analytics", () => ({ trackEvent }));
vi.mock("@/components/teacher-mercy/TeacherMercyVoiceControls", () => ({ default: () => null }));
vi.mock("@/components/ai-tutor/DetectorHintChip", () => ({ default: () => null }));

afterEach(() => trackEvent.mockClear());

function renderWith(userText: string) {
  const result = {
    id: "turn-1",
    userText,
    correctedText: "I will finish the report.",
    explanation: "Grammar note.",
    grammarTip: "tip",
    practicePrompt: "prompt",
  };
  return render(
    <CorrectionMode
      input=""
      setInput={() => {}}
      loading={false}
      result={result as never}
      error={null}
      micSupported={false}
      micListening={false}
      voiceDraft=""
      voiceMessage=""
      speechLang="en-US"
      onSubmit={() => {}}
      onMicToggle={() => {}}
      onUseVoiceDraft={() => {}}
      onClearVoiceDraft={() => {}}
      onSendToSpeak={() => {}}
      onClear={() => {}}
      tutorCopy={getTutorCopy("en", "vi")}
    />,
  );
}

describe("CorrectionMode — Step-18 register explanation", () => {
  it("shows the register block + emits telemetry for a surface-detectable register error", () => {
    renderWith("this humble employee will finish the report");
    const block = screen.getByTestId("ai-tutor-register-explanation");
    expect(block).toBeInTheDocument();
    expect(block.getAttribute("data-register-tag")).toMatch(/^en_l1_register_/);
    expect(trackEvent).toHaveBeenCalledWith(
      "register_correction_shown",
      expect.objectContaining({ tag: expect.stringMatching(/^en_l1_register_/) }),
    );
  });

  it("abstains (no register block, no telemetry) for a plain grammar error", () => {
    renderWith("I goed to school yesterday");
    expect(screen.queryByTestId("ai-tutor-register-explanation")).not.toBeInTheDocument();
    expect(trackEvent).not.toHaveBeenCalled();
  });
});
