import type { TmRiFinding, TmRiPsychologyProfile, TmRiReplayTimeline } from "../types";
import { makeFinding } from "../utils";

export class ProductPsychologyAnalyzer {
  analyze(timeline: TmRiReplayTimeline): TmRiPsychologyProfile {
    const findings: TmRiFinding[] = [];

    for (const point of timeline.stages) {
      if (point.stage === "guessing") {
        findings.push(
          makeFinding({
            code: "guessing_to_escape",
            severity: "medium",
            educationalSeverity: "critical",
            title: "Learner guessed to escape friction",
            evidence: ["Learner indicated guessing or finishing pressure."],
            impact: "The result may reflect escape behavior rather than learner ability.",
            confidence: 0.9,
          }),
        );
      }

      if (point.stage === "confused" || point.stage === "retrying") {
        findings.push(
          makeFinding({
            code: "frustration",
            severity: "medium",
            educationalSeverity: "serious",
            title: "Learner frustration risk",
            evidence: ["Learner showed confusion or repeated effort."],
            impact: "The product experience may interfere with assessment performance.",
            confidence: 0.75,
          }),
        );
      }

      if (point.stage === "trust_lost") {
        findings.push(
          makeFinding({
            code: "loss_of_trust",
            severity: "high",
            educationalSeverity: "critical",
            title: "Loss of trust detected",
            evidence: ["Learner indicated the assessment felt unreliable."],
            impact: "Placement claims should be handled conservatively after trust loss.",
            confidence: 0.9,
          }),
        );
      }

      if (point.stage === "guessing" && point.confidence <= 25) {
        findings.push(
          makeFinding({
            code: "shame_risk",
            severity: "medium",
            educationalSeverity: "serious",
            title: "Shame risk",
            evidence: ["Low-confidence guessing was present."],
            impact: "The learner may interpret product failure as personal failure.",
            confidence: 0.7,
          }),
        );
        findings.push(
          makeFinding({
            code: "self_blame",
            severity: "medium",
            educationalSeverity: "serious",
            title: "Self-blame risk",
            evidence: ["Learner confidence dropped while trying to complete the task."],
            impact: "The assessment should not imply fault when product evidence is degraded.",
            confidence: 0.65,
          }),
        );
      }
    }

    const uniqueFindings = findings.filter(
      (finding, index, all) => all.findIndex((candidate) => candidate.code === finding.code) === index,
    );

    return {
      flags: uniqueFindings.map((finding) => finding.code),
      findings: uniqueFindings,
    };
  }
}
