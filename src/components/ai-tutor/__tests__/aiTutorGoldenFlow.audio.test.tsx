/**
 * AI Tutor golden flow — C-owned executable gate: audio / recorder / scoring
 * honesty.
 *
 * Canonical, spec-referenced enforcement for the C half of
 * `docs/ai-tutor/AI_TUTOR_GOLDEN_FLOW_SPEC.md` (GF-1, GF-2, GF-4; regressions
 * R1–R6). This is the single suite B wires into the CI-blocking golden-flow
 * job for C's domain — each test names the spec rule it enforces so a failure
 * points straight at the blocked learner-visible regression.
 *
 * It renders the REAL Speak (SpeakPracticeMode) and pronunciation
 * (PronunciationDrillsPage) surfaces. The MediaRecorder hook is driven
 * deterministically (jsdom has no MediaRecorder); the heavy talking-face button
 * and the presentational voice control are stubbed faithfully so the render is
 * fast and the assertions target page wiring, not child internals.
 *
 * No score, no percent, no ML claim is added by this suite; the scorer is never
 * imported or invoked.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";

import SpeakPracticeMode, {
  type SpeakPronunciationResult,
} from "@/components/ai-tutor/SpeakPracticeMode";
import PronunciationDrillsPage from "@/pages/practice/PronunciationDrillsPage";
import { getTutorCopy } from "@/lib/tutor/tutorCopy";
import { TONE_CONTRAST_EXTRA_SYLLABLES } from "@/data/tone-drill/tone-contrast-extra";

// ── Recorder hook: deterministic, scorer-free (jsdom has no MediaRecorder) ──
const recorderMock = vi.hoisted(() => ({
  current: null as unknown as Record<string, unknown>,
}));
const startRecording = vi.hoisted(() => vi.fn());
const playRecorded = vi.hoisted(() => vi.fn());
const compareWithReference = vi.hoisted(() => vi.fn());
vi.mock("@/hooks/usePronunciationRecorder", () => ({
  usePronunciationRecorder: () => recorderMock.current,
}));

// ── Faithful stub of the heavy talking-face button (SVG + per-instance Audio) ──
// Preserves exactly what the gate asserts: the "Play[: <ariaLabel>]" name.
vi.mock("@/components/audio/TalkingFacePlayButton", () => ({
  default: ({ label, ariaLabel }: { label?: string; ariaLabel?: string }) => (
    <button type="button" aria-label={"Play" + (ariaLabel ? `: ${ariaLabel}` : "")}>
      {label}
    </button>
  ),
}));

// ── Presentational voice control → simple button so we can assert handler wiring ──
vi.mock("@/components/teacher-mercy/TeacherMercyVoiceControls", () => ({
  default: ({
    active,
    activeLabel,
    inactiveLabel,
    unavailableLabel,
    supported,
    onToggle,
  }: {
    active?: boolean;
    activeLabel: string;
    inactiveLabel: string;
    unavailableLabel: string;
    supported: boolean;
    onToggle: () => void;
  }) =>
    supported ? (
      <button type="button" onClick={onToggle}>
        {active ? activeLabel : inactiveLabel}
      </button>
    ) : (
      <div role="status">{unavailableLabel}</div>
    ),
}));

const IDLE_RECORDER = {
  status: "idle",
  error: null,
  audioBlob: null,
  lastRecordedAudioUrl: null,
  isPlayingReference: false,
  isPlayingRecorded: false,
  isComparing: false,
  setError: () => {},
  startRecording,
  stopRecording: vi.fn(),
  reset: () => {},
  clearRecordedAudio: vi.fn(),
  playReference: async () => {},
  playRecorded,
  compareWithReference,
};

const speakProps = {
  targetSentence: "I bought a hat yesterday.",
  repeatInput: "",
  micSupported: true,
  micListening: false,
  ttsSupported: true,
  ttsSpeaking: false,
  ttsPreparing: false,
  followUpPrompt: null,
  followUpIsPivot: false,
  followUpTtsSpeaking: false,
  followUpTtsPreparing: false,
  onMicToggle: vi.fn(),
  onReadTarget: vi.fn(),
  onReadFollowUp: vi.fn(),
  onRepeatInputChange: vi.fn(),
  onResetBoard: vi.fn(),
  tutorCopy: getTutorCopy("en", "vi"),
};

function renderSpeak(
  overrides: Partial<typeof speakProps> & {
    pronunciationResult?: SpeakPronunciationResult | null;
  } = {},
) {
  return render(
    <SpeakPracticeMode
      {...speakProps}
      pronunciationResult={overrides.pronunciationResult ?? null}
      {...overrides}
    />,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  recorderMock.current = { ...IDLE_RECORDER };
});

describe("AI Tutor golden flow — C: GF-1 Speak self-compare (audio + recorder)", () => {
  it("R3: model sentence plays — the read-aloud control renders and invokes the handler", () => {
    const onReadTarget = vi.fn();
    renderSpeak({ onReadTarget });
    expect(screen.getByTestId("ai-tutor-speak-target")).toHaveTextContent(
      "I bought a hat yesterday.",
    );
    fireEvent.click(screen.getByRole("button", { name: "Mercy đọc" }));
    expect(onReadTarget).toHaveBeenCalledTimes(1);
  });

  it("R4: SelfCompareRecorder stays visible on the Speak surface", () => {
    renderSpeak();
    expect(screen.getByTestId("self-compare-recorder")).toBeInTheDocument();
  });

  it("R3: record works — the record control is enabled and invokes startRecording", () => {
    renderSpeak();
    const rec = screen.getByTestId("self-compare-record");
    expect(rec).toBeEnabled();
    fireEvent.click(rec);
    expect(startRecording).toHaveBeenCalledTimes(1);
  });

  it("R3: replay works — the play-back control appears with a recording and invokes playRecorded", () => {
    recorderMock.current = { ...IDLE_RECORDER, lastRecordedAudioUrl: "blob:rec" };
    renderSpeak();
    const play = screen.getByTestId("self-compare-play");
    fireEvent.click(play);
    expect(playRecorded).toHaveBeenCalledTimes(1);
  });

  it("R6: recorder is additive — model card + conversation controls still render alongside it", () => {
    renderSpeak();
    // Recorder present AND the Speak conversation/practice surface still there.
    expect(screen.getByTestId("self-compare-recorder")).toBeInTheDocument();
    expect(screen.getByTestId("ai-tutor-speak-target")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mercy đọc" })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Gõ câu bạn đọc lại" }),
    ).toBeInTheDocument();
  });

  it("R5: mic denied surfaces a clear message without breaking the rest of Speak", () => {
    recorderMock.current = {
      ...IDLE_RECORDER,
      error: "Microphone access was denied in your browser.",
    };
    renderSpeak();
    expect(
      screen.getByTestId("self-compare-recorder").textContent,
    ).toMatch(/Microphone access was denied/i);
    // Rest of Speak still usable.
    expect(screen.getByTestId("ai-tutor-speak-target")).toBeInTheDocument();
  });
});

describe("AI Tutor golden flow — C: GF-2 pronunciation drills (audio + recorder)", () => {
  it("R4: SelfCompareRecorder stays visible on /practice/pronunciation", () => {
    render(<PronunciationDrillsPage />);
    expect(screen.getByTestId("self-compare-recorder")).toBeInTheDocument();
  });

  it("R3: tone-clip model audio plays — a play control renders per tone target", () => {
    render(<PronunciationDrillsPage />);
    const playButtons = screen.getAllByRole("button", {
      name: /Play|Audio locked|Pause/i,
    });
    expect(playButtons.length).toBeGreaterThanOrEqual(
      TONE_CONTRAST_EXTRA_SYLLABLES.length,
    );
  });

  it("R1: no percent / score language on the pronunciation surface", () => {
    const { container } = render(<PronunciationDrillsPage />);
    const clone = container.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("style, script").forEach((n) => n.remove());
    expect(clone.textContent ?? "").not.toMatch(/\d+\s*%/);
  });
});

describe("AI Tutor golden flow — C: GF-4 scoring honesty (R1 / R2 / R5)", () => {
  it("R1: no percent for a typed/text path with no valid gated scorer result", () => {
    renderSpeak({ repeatInput: "I bought a hat yesterday.", pronunciationResult: null });
    expect(screen.queryByTestId("ai-tutor-speak-score")).not.toBeInTheDocument();
    expect(screen.queryByText(/\d+\s*%/)).not.toBeInTheDocument();
  });

  it("R1/R5: local (non-Azure) result shows an honest no-number line, no percent", () => {
    renderSpeak({ pronunciationResult: { mode: "local-fallback", provider: "local" } });
    const score = screen.getByTestId("ai-tutor-speak-score");
    expect(score.textContent ?? "").not.toMatch(/\d+\s*%/);
    // Honest "still listening / detail later" framing instead of a fake number.
    expect(score).toHaveTextContent(/Đang nghe|chi tiết/i);
  });

  it("R2: a numeric percent + per-phoneme detail appear ONLY for a valid Azure gated result", () => {
    renderSpeak({
      pronunciationResult: {
        mode: "azure-batch",
        provider: "azure",
        overallScore: 86,
        phonemeScores: [{ phoneme: "b", accuracyScore: 96, word: "bought" }],
        words: [
          {
            word: "bought",
            accuracyScore: 82,
            phonemes: [{ phoneme: "b", accuracyScore: 96 }],
          },
        ],
      },
    });
    const score = screen.getByTestId("ai-tutor-speak-score");
    // Valid gated scorer → an honest number is allowed here (and only here).
    expect(score.textContent ?? "").toMatch(/\d+\s*%/);
    const detail = screen.getByTestId("ai-tutor-speak-word-detail");
    expect(within(detail).getByText("bought")).toBeInTheDocument();
  });
});
