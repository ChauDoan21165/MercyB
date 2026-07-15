import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CorrectionMode from "@/components/ai-tutor/CorrectionMode";
import { getTutorCopy } from "@/lib/tutor/tutorCopy";
import { clearLearningEvents, getLearningEvents } from "@/lib/tutor/learningEvents";
import type { DetectorHintContent } from "@/lib/ai-tutor/detectorHint";

const trackEvent = vi.hoisted(() => vi.fn());
vi.mock("@/lib/analytics", () => ({ trackEvent }));
vi.mock("@/components/teacher-mercy/TeacherMercyVoiceControls", () => ({ default: () => null }));
vi.mock("@/components/ai-tutor/DetectorHintChip", () => ({ default: () => null }));

const CELL_ID = "550e8400-e29b-41d4-a716-446655440000";

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  trackEvent.mockClear();
  clearLearningEvents();
  vi.unstubAllEnvs();
});

function renderWith(
  userText: string,
  appliedRuleIds: string[] = [],
  error: string | null = null,
  options: { detectorHint?: DetectorHintContent | null; cellId?: string | null } = {},
) {
  const result = {
    id: "turn-1",
    mode: "correction",
    targetLanguage: "en",
    explainLanguage: "vi",
    userText,
    correctedText: "I will finish the report.",
    explanation: "Grammar note.",
    grammarTip: "tip",
    practicePrompt: "prompt",
    shouldReadAloudText: "I will finish the report.",
    createdAt: "2026-07-15T00:00:00.000Z",
    appliedRuleIds,
    cell_id: options.cellId,
  };
  return render(
    <CorrectionMode
      input=""
      setInput={() => {}}
      loading={false}
      result={error ? null : result as never}
      error={error}
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
      detectorHint={options.detectorHint ?? null}
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

  it("falls back to the rendered correction rule id when no register or detector hint exists", () => {
    vi.stubEnv("VITE_FEEDBACK_BUTTONS_ENABLED", "true");
    renderWith("We discussed about the lesson yesterday", ["en-step6-discuss-about"]);

    expect(screen.getByTestId("correction-feedback")).toHaveAttribute(
      "data-rule-id",
      "en-step6-discuss-about",
    );
    expect(screen.getByTestId("correction-feedback-helpful")).toBeInTheDocument();
  });

  it("renders no feedback controls while the feedback flag is off", () => {
    renderWith("We discussed about the lesson yesterday", ["en-step6-discuss-about"]);

    expect(screen.queryByTestId("correction-feedback")).not.toBeInTheDocument();
    expect(getLearningEvents()).toEqual([]);
  });

  it("emits exactly one feedback event with the engine appliedRuleId, not the chip tag", () => {
    vi.stubEnv("VITE_FEEDBACK_BUTTONS_ENABLED", "true");
    const chipHint: DetectorHintContent = {
      nameEn: "Missing article",
      rationaleVi: "Chip tag should not own feedback attribution.",
      tag: "vi_l1_missing_article",
    };
    renderWith(
      "We discussed about the lesson yesterday",
      ["engine:discussion-preposition"],
      null,
      { detectorHint: chipHint, cellId: CELL_ID },
    );

    fireEvent.click(screen.getByTestId("correction-feedback-helpful"));

    const events = getLearningEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      eventType: "feedback_helpful",
      ruleOrDetectorId: "engine:discussion-preposition",
      cellId: CELL_ID,
    });
    expect(events[0]?.ruleOrDetectorId).not.toBe(chipHint.tag);
  });

  it("renders deliberate deferred correction copy as a notice, not an error", () => {
    renderWith("", [], "Mercy ghi nhận câu này và sẽ gợi ý sau nhé.");

    expect(screen.getByText("Đã ghi nhận · Noted")).toBeInTheDocument();
    expect(screen.queryByText("Lỗi · Error")).not.toBeInTheDocument();
  });
});
