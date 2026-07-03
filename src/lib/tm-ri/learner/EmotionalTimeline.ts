import type { TmRiLearnerSignal, TmRiLearnerStage, TmRiReplayTimeline, TmRiTimelinePoint } from "../types";
import { includesAny } from "../utils";

const confusionTerms = ["confused", "don't understand", "dont understand", "not sure", "can't hear", "cannot hear"] as const;
const guessingTerms = ["guess", "guessed", "finish", "random", "just picked"] as const;
const trustTerms = ["broken", "unfair", "not real", "doesn't work", "doesnt work", "wrong result"] as const;
const recoveryTerms = ["works now", "i understand", "okay now", "got it"] as const;

export class EmotionalTimeline {
  build(signals: readonly TmRiLearnerSignal[]): TmRiReplayTimeline {
    const ordered = [...signals].sort((left, right) => left.timestampMs - right.timestampMs);
    const stages = ordered.map<TmRiTimelinePoint>((signal) => {
      const stage = this.stageFor(signal);
      return {
        timestampMs: signal.timestampMs,
        stage,
        confidence: this.confidenceFor(signal, stage),
        reason: this.reasonFor(stage),
      };
    });

    return { stages };
  }

  private stageFor(signal: TmRiLearnerSignal): TmRiLearnerStage {
    if (signal.action === "recovery" || includesAny(signal.text, recoveryTerms)) {
      return "recovered";
    }
    if (includesAny(signal.text, trustTerms)) {
      return "trust_lost";
    }
    if (signal.action === "guess" || includesAny(signal.text, guessingTerms)) {
      return "guessing";
    }
    if (signal.action === "retry" || (signal.attempts ?? 0) > 1) {
      return "retrying";
    }
    if (signal.confidence !== undefined && signal.confidence < 45) {
      return "confused";
    }
    if (includesAny(signal.text, confusionTerms)) {
      return "confused";
    }
    return "confident";
  }

  private confidenceFor(signal: TmRiLearnerSignal, stage: TmRiLearnerStage): number {
    if (signal.confidence !== undefined) {
      return signal.confidence;
    }
    const defaults: Record<TmRiLearnerStage, number> = {
      confident: 80,
      confused: 35,
      retrying: 45,
      guessing: 20,
      trust_lost: 10,
      recovered: 60,
    };
    return defaults[stage];
  }

  private reasonFor(stage: TmRiLearnerStage): string {
    const reasons: Record<TmRiLearnerStage, string> = {
      confident: "Learner proceeded without visible friction.",
      confused: "Learner showed uncertainty or inability to access the task.",
      retrying: "Learner repeated the task after friction.",
      guessing: "Learner indicated guessing or completion pressure.",
      trust_lost: "Learner indicated the assessment felt unreliable.",
      recovered: "Learner showed a return toward confidence.",
    };
    return reasons[stage];
  }
}
