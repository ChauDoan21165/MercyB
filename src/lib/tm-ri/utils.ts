import type { TmRiEducationalSeverity, TmRiFinding, TmRiSeverity } from "./types";

export const clampScore = (value: number): number => Math.max(0, Math.min(100, Math.round(value)));

export const includesAny = (value: string | undefined, terms: readonly string[]): boolean => {
  const normalized = value?.toLowerCase() ?? "";
  return terms.some((term) => normalized.includes(term));
};

export const severityRank = (severity: TmRiSeverity): number => {
  const ranks: Record<TmRiSeverity, number> = {
    info: 0,
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };
  return ranks[severity];
};

export const educationalSeverityRank = (severity: TmRiEducationalSeverity): number => {
  const ranks: Record<TmRiEducationalSeverity, number> = {
    none: 0,
    minor: 1,
    moderate: 2,
    serious: 3,
    critical: 4,
  };
  return ranks[severity];
};

export const hasFinding = (findings: readonly TmRiFinding[], code: TmRiFinding["code"]): boolean =>
  findings.some((finding) => finding.code === code);

export const makeFinding = (finding: TmRiFinding): TmRiFinding => finding;
