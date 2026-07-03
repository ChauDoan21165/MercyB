import { describe, expect, it } from "vitest";
import { RuntimeReplayEngine, type TmRiLearnerSignal, type TmRiRuntimeEvent } from "../index";

const analyze = (events: readonly TmRiRuntimeEvent[], signals: readonly TmRiLearnerSignal[] = []) =>
  new RuntimeReplayEngine().analyze(events, signals);

describe("TM-RI placement audio and trust intelligence", () => {
  it("marks guessed completion after unavailable audio as critical educational harm with trust collapse", () => {
    const analysis = analyze(
      [
        {
          id: "audio-start",
          type: "audio_unavailable",
          timestampMs: 100,
          modality: "listening",
          assessmentSkill: "listening",
          durationSeconds: 0,
          inputMode: "none",
        },
        {
          id: "score",
          type: "assessment_result_shown",
          timestampMs: 300,
          assessmentSkill: "listening",
          scoreShown: true,
          confidence: 92,
        },
      ],
      [
        {
          id: "learner-guess",
          timestampMs: 250,
          action: "guess",
          text: "I guessed to finish because I could not hear the audio.",
          confidence: 15,
        },
      ],
    );

    expect(analysis.observationPacket.findings.some((finding) => finding.educationalSeverity === "critical")).toBe(true);
    expect(analysis.trust.collapsePoint).toBeDefined();
    expect(analysis.observationPacket.productTrust.collapsed).toBe(true);
    expect(analysis.honesty.recommendations).toContain("withhold_cefr");
    expect(analysis.honesty.recommendations).toContain("explain_degraded");
  });

  it("treats text entry after mic failure as degraded speaking evidence, not spoken evidence", () => {
    const analysis = analyze([
      {
        id: "mic-denied",
        type: "mic_unavailable",
        timestampMs: 100,
        modality: "speaking",
        assessmentSkill: "speaking",
      },
      {
        id: "typed-fallback",
        type: "fallback_input_used",
        timestampMs: 150,
        modality: "speaking",
        assessmentSkill: "speaking",
        inputMode: "text",
      },
      {
        id: "speaking-score",
        type: "assessment_scored",
        timestampMs: 200,
        assessmentSkill: "speaking",
        confidence: 70,
      },
    ]);

    expect(analysis.assessmentIntegrity.speakingModalityDegraded).toBe(true);
    expect(analysis.honesty.inputModeRecommendation).toBe("text");
    expect(analysis.assessmentIntegrity.spokenEvidenceAvailable).toBe(false);
    expect(analysis.observationPacket.findings.map((finding) => finding.code)).toContain("speaking_modality_degraded");
  });

  it("detects 0:00 unplayable audio and does not grade listening as wrong", () => {
    const analysis = analyze([
      {
        id: "zero-duration-audio",
        type: "media_loaded",
        timestampMs: 100,
        modality: "listening",
        assessmentSkill: "listening",
        playable: false,
        durationSeconds: 0,
      },
      {
        id: "listening-score",
        type: "assessment_scored",
        timestampMs: 160,
        assessmentSkill: "listening",
        confidence: 65,
      },
    ]);

    expect(analysis.runtimeFindings.map((finding) => finding.code)).toContain("audio_unavailable");
    expect(analysis.assessmentIntegrity.listeningNotGradableAsWrong).toBe(true);
    expect(analysis.honesty.recommendations).toContain("retry_required");
  });

  it("detects internal debug or stub wording as a product trust risk", () => {
    const analysis = analyze([
      {
        id: "copy",
        type: "internal_text_visible",
        timestampMs: 100,
        userFacingText: "Debug stub: audioUrl missing",
      },
    ]);

    expect(analysis.runtimeFindings.map((finding) => finding.code)).toContain("internal_text_visible");
    expect(analysis.runtimeFindings.map((finding) => finding.code)).toContain("product_trust_risk");
  });

  it("builds C2-safe observation packets with psychology and educational impact but no implementation internals", () => {
    const analysis = analyze(
      [
        {
          id: "debug-copy",
          type: "internal_text_visible",
          timestampMs: 100,
          userFacingText: "React MediaRecorder debug factory audioUrl HTMLAudioElement",
        },
        {
          id: "audio-fail",
          type: "audio_unavailable",
          timestampMs: 120,
          modality: "listening",
          assessmentSkill: "listening",
          playable: false,
          durationSeconds: 0,
        },
      ],
      [
        {
          id: "learner",
          timestampMs: 200,
          action: "guess",
          text: "I guessed to finish.",
          confidence: 20,
        },
      ],
    );

    expect(analysis.observationPacket.learnerPsychology.length).toBeGreaterThan(0);
    expect(analysis.observationPacket.educationalImpact.length).toBeGreaterThan(0);

    const packetText = JSON.stringify(analysis.observationPacket).toLowerCase();
    expect(packetText).not.toContain("/users/");
    expect(packetText).not.toContain("react");
    expect(packetText).not.toContain("audiourl");
    expect(packetText).not.toContain("mediarecorder");
    expect(packetText).not.toContain("htmlaudioelement");
    expect(packetText).not.toContain("factory");
  });
});
