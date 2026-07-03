import type {
  TmRiEducationalHonestyDecision,
  TmRiFinding,
  TmRiObservationPacket,
  TmRiPsychologyProfile,
  TmRiTrustCurve,
} from "../types";

const blockedTerms = ["react", "audiourl", "mediarecorder", "htmlaudioelement", "factory", ".ts", ".tsx", "/users/"] as const;

export class TeacherObservationBuilder {
  build(
    findings: readonly TmRiFinding[],
    psychology: TmRiPsychologyProfile,
    trust: TmRiTrustCurve,
    honesty: TmRiEducationalHonestyDecision,
  ): TmRiObservationPacket {
    const collapsed = trust.collapsePoint !== undefined;
    const packet: TmRiObservationPacket = {
      summary: collapsed
        ? "Assessment reliability was compromised and learner trust collapsed."
        : "Assessment reliability observations are available for review.",
      learnerPsychology: psychology.findings.map((finding) => finding.impact),
      educationalImpact: findings.map((finding) => finding.impact),
      productTrust: {
        score: trust.points[trust.points.length - 1]?.score ?? 100,
        collapsed,
      },
      recommendations: honesty.recommendations,
      findings: findings.map((finding) => ({
        code: finding.code,
        severity: finding.severity,
        educationalSeverity: finding.educationalSeverity,
        title: finding.title,
        impact: finding.impact,
      })),
    };

    return this.sanitize(packet);
  }

  private sanitize(packet: TmRiObservationPacket): TmRiObservationPacket {
    const clean = (value: string): string => {
      const lowered = value.toLowerCase();
      if (blockedTerms.some((term) => lowered.includes(term))) {
        return "Implementation detail removed; product-quality observation retained.";
      }
      return value;
    };

    return {
      ...packet,
      summary: clean(packet.summary),
      learnerPsychology: packet.learnerPsychology.map(clean),
      educationalImpact: packet.educationalImpact.map(clean),
      findings: packet.findings.map((finding) => ({
        ...finding,
        title: clean(finding.title),
        impact: clean(finding.impact),
      })),
    };
  }
}
