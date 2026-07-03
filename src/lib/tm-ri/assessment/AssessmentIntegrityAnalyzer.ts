import type { TmRiAssessmentIntegrity, TmRiFinding, TmRiRuntimeEvent } from "../types";
import { hasFinding, makeFinding } from "../utils";

export class AssessmentIntegrityAnalyzer {
  analyze(events: readonly TmRiRuntimeEvent[], runtimeFindings: readonly TmRiFinding[]): TmRiAssessmentIntegrity {
    const hasAudioFailure = hasFinding(runtimeFindings, "audio_unavailable") || hasFinding(runtimeFindings, "unplayable_media");
    const hasMicFailure = hasFinding(runtimeFindings, "mic_unavailable");
    const textFallbackForSpeaking = events.some(
      (event) => event.assessmentSkill === "speaking" && event.inputMode === "text",
    );
    const degradationEvents = this.degradationEvents(events);
    const highConfidenceResult = events.some(
      (event) =>
        event.type === "assessment_result_shown" &&
        (event.confidence ?? 0) >= 80 &&
        this.occursDuringOrAfterRelatedDegradation(event, degradationEvents),
    );
    const resultShownDuringDegradation = events.some(
      (event) =>
        event.type === "assessment_result_shown" &&
        event.scoreShown === true &&
        this.occursDuringOrAfterRelatedDegradation(event, degradationEvents),
    );
    const scoringDuringDegradation = events.some(
      (event) =>
        event.type === "assessment_scored" &&
        this.occursDuringOrAfterRelatedDegradation(event, degradationEvents),
    );

    const findings: TmRiFinding[] = [];

    if (hasAudioFailure || hasMicFailure || textFallbackForSpeaking) {
      findings.push(
        makeFinding({
          code: "degraded_evidence",
          severity: "high",
          educationalSeverity: hasAudioFailure ? "critical" : "serious",
          title: "Assessment evidence was degraded",
          evidence: ["A required modality was unavailable or replaced."],
          impact: "The result should explicitly reflect lower evidence quality.",
          confidence: 0.95,
        }),
      );
    }

    if (scoringDuringDegradation || resultShownDuringDegradation) {
      findings.push(
        makeFinding({
          code: "invalid_scoring_risk",
          severity: "high",
          educationalSeverity: hasAudioFailure ? "critical" : "serious",
          title: "Invalid scoring risk",
          evidence: ["A score was produced after degraded task evidence."],
          impact: "The learner may be penalized for product failure rather than skill.",
          confidence: 0.9,
        }),
      );
    }

    if (highConfidenceResult && (hasAudioFailure || hasMicFailure || textFallbackForSpeaking)) {
      findings.push(
        makeFinding({
          code: "confidence_overclaim_risk",
          severity: "high",
          educationalSeverity: "critical",
          title: "Confidence overclaim risk",
          evidence: ["A high-confidence result was shown despite degraded evidence."],
          impact: "The product should lower confidence or withhold high-stakes placement claims.",
          confidence: 0.9,
        }),
      );
    }

    if (hasMicFailure || textFallbackForSpeaking) {
      findings.push(
        makeFinding({
          code: "speaking_modality_degraded",
          severity: "high",
          educationalSeverity: "serious",
          modality: "speaking",
          title: "Speaking modality was degraded",
          evidence: ["Speaking evidence was replaced by text input."],
          impact: "Typed input must not be treated as spoken evidence.",
          confidence: 0.95,
        }),
      );
    }

    return {
      degradedEvidence: findings.some((finding) => finding.code === "degraded_evidence"),
      invalidScoringRisk: findings.some((finding) => finding.code === "invalid_scoring_risk"),
      confidenceOverclaimRisk: findings.some((finding) => finding.code === "confidence_overclaim_risk"),
      speakingModalityDegraded: findings.some((finding) => finding.code === "speaking_modality_degraded"),
      listeningNotGradableAsWrong: hasAudioFailure,
      spokenEvidenceAvailable: !hasMicFailure && !textFallbackForSpeaking,
      findings,
    };
  }

  private degradationEvents(events: readonly TmRiRuntimeEvent[]): readonly TmRiRuntimeEvent[] {
    return events.filter(
      (event) => this.isAudioFailureEvent(event) || this.isMicFailureEvent(event) || this.isSpeakingTextFallbackEvent(event),
    );
  }

  private occursDuringOrAfterRelatedDegradation(
    event: TmRiRuntimeEvent,
    degradationEvents: readonly TmRiRuntimeEvent[],
  ): boolean {
    return degradationEvents.some(
      (degradationEvent) =>
        event.timestampMs >= degradationEvent.timestampMs && this.affectsSameAssessmentModality(event, degradationEvent),
    );
  }

  private affectsSameAssessmentModality(event: TmRiRuntimeEvent, degradationEvent: TmRiRuntimeEvent): boolean {
    const eventModality = this.assessmentModality(event);
    const degradationModality = this.assessmentModality(degradationEvent);

    if (eventModality === undefined || degradationModality === undefined) {
      return true;
    }
    return eventModality === degradationModality || eventModality === "mixed" || degradationModality === "mixed";
  }

  private assessmentModality(event: TmRiRuntimeEvent) {
    return event.assessmentSkill ?? event.modality;
  }

  private isAudioFailureEvent(event: TmRiRuntimeEvent): boolean {
    const isAudioSkill = event.assessmentSkill === "listening" || event.modality === "listening";
    return (
      event.type === "audio_unavailable" ||
      event.type === "media_play_failed" ||
      event.playable === false ||
      (isAudioSkill && (event.durationSeconds === 0 || event.inputMode === "none"))
    );
  }

  private isMicFailureEvent(event: TmRiRuntimeEvent): boolean {
    return event.type === "mic_unavailable";
  }

  private isSpeakingTextFallbackEvent(event: TmRiRuntimeEvent): boolean {
    return event.assessmentSkill === "speaking" && event.inputMode === "text";
  }
}
