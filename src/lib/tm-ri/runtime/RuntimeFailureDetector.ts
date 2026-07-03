import type { TmRiFinding, TmRiRuntimeEvent } from "../types";
import { includesAny, makeFinding } from "../utils";

const internalTerms = [
  "debug",
  "stub",
  "todo",
  "internal",
  "factory",
  "react",
  "audiourl",
  "mediarecorder",
  "htmlaudioelement",
  "orchestrator",
] as const;

export class RuntimeFailureDetector {
  detect(events: readonly TmRiRuntimeEvent[]): readonly TmRiFinding[] {
    const findings: TmRiFinding[] = [];

    for (const event of events) {
      if (event.type === "audio_unavailable" || this.isUnavailableAudio(event)) {
        findings.push(
          makeFinding({
            code: "audio_unavailable",
            severity: "high",
            educationalSeverity: event.assessmentSkill === "listening" || event.modality === "listening" ? "critical" : "serious",
            modality: event.assessmentSkill ?? event.modality,
            title: "Audio was unavailable",
            evidence: [`${event.id}: required audio could not be played`],
            impact: "Listening evidence is degraded and should not be treated as an incorrect learner answer.",
            confidence: 0.95,
          }),
        );
      }

      if (event.type === "mic_unavailable") {
        findings.push(
          makeFinding({
            code: "mic_unavailable",
            severity: "high",
            educationalSeverity: "serious",
            modality: "speaking",
            title: "Microphone was unavailable",
            evidence: [`${event.id}: microphone capture was unavailable`],
            impact: "Speaking evidence is degraded when the learner is forced into text input.",
            confidence: 0.95,
          }),
        );
      }

      if (event.type === "media_play_failed" || event.playable === false) {
        findings.push(
          makeFinding({
            code: "unplayable_media",
            severity: "high",
            educationalSeverity: event.assessmentSkill === "listening" || event.modality === "listening" ? "critical" : "serious",
            modality: event.assessmentSkill ?? event.modality,
            title: "Media could not play",
            evidence: [`${event.id}: media playback failed`],
            impact: "The product cannot claim normal evidence quality for this task.",
            confidence: 0.9,
          }),
        );
      }

      if (this.hasInternalText(event)) {
        const learnerVisible = {
          visibility: {
            scope: "learner_visible" as const,
            confidence: 0.95,
            reason: "Runtime event reported this text as learner-facing copy.",
          },
          reachability: {
            surface: "runtime_ui" as const,
            confidence: 0.95,
            reason: "Runtime event came from visible learner UI text.",
          },
        };

        findings.push(
          makeFinding({
            code: "internal_text_visible",
            severity: "medium",
            educationalSeverity: "moderate",
            title: "Internal wording was visible",
            evidence: [`${event.id}: learner-facing copy exposed non-product wording`],
            impact: "Internal or placeholder language can reduce product trust during assessment.",
            confidence: 0.9,
            ...learnerVisible,
          }),
        );
        findings.push(
          makeFinding({
            code: "product_trust_risk",
            severity: "medium",
            educationalSeverity: "moderate",
            title: "Product trust risk detected",
            evidence: [`${event.id}: learner saw wording that can make the assessment feel unreliable`],
            impact: "Trust in the result may be lower even if scoring logic completes.",
            confidence: 0.85,
            ...learnerVisible,
          }),
        );
      }
    }

    return findings;
  }

  private isUnavailableAudio(event: TmRiRuntimeEvent): boolean {
    const isAudioSkill = event.assessmentSkill === "listening" || event.modality === "listening";
    return isAudioSkill && (event.durationSeconds === 0 || event.inputMode === "none");
  }

  private hasInternalText(event: TmRiRuntimeEvent): boolean {
    return includesAny(event.userFacingText, internalTerms);
  }
}
