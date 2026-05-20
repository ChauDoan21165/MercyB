import type { CEFRAssessment, CefrLevel, L1InterferenceFlag, Subskill, TranscriptTurn, TurnSignal } from "./types";
import { cefrToNumeric, numericToCefr, summarizeSignals, transcriptUserSignals } from "./signalExtractor";

const SUBSKILLS: Subskill[] = ["grammar", "vocab", "fluency", "comprehension"];

export function gradeConversation(transcript: TranscriptTurn[]): CEFRAssessment {
  const signals = transcriptUserSignals(transcript);
  return gradeFromSignals(signals, transcript);
}

export function gradeFromSignals(signals: TurnSignal[], transcript: TranscriptTurn[] = []): CEFRAssessment {
  const summary = summarizeSignals(signals);
  const usable = signals.filter((s) => !s.insufficient_signal);
  const naive = usable.length
    ? usable.reduce((sum, s) => sum + s.numericLevel, 0) / usable.length
    : 1;
  const trajectory = detectTrajectory(usable);
  const range = topicRange(transcript);
  const selfCorrections = usable.filter((s) => s.notable_strengths.some((x) => x.includes("self-correct"))).length;
  const persistent = persistentErrors(usable);

  const sorted = usable.map((s) => s.numericLevel).sort((a, b) => a - b);
  const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : summary.runningNumeric;
  let holistic = summary.runningNumeric * 0.7 + median * 0.3;
  if (trajectory.pattern === "improving") holistic += 0.25;
  if (trajectory.pattern === "declining") holistic -= 0.1;
  if (range < 3 && usable.length >= 6) holistic -= 0.25;
  if (persistent.length >= 3) holistic -= 0.25;
  if (selfCorrections >= 2) holistic += 0.15;
  if (summary.wrongLanguageTurns >= Math.max(2, usable.length / 3)) holistic -= 0.35;
  holistic = Math.max(1, Math.min(6, holistic));

  const perSkill = Object.fromEntries(SUBSKILLS.map((skill) => {
    const scored = usable.map((s) => s.observed_subskills[skill]);
    const weight = scored.reduce((sum, s) => sum + s.confidence, 0);
    const score = weight ? scored.reduce((sum, s) => sum + s.score * s.confidence, 0) / weight : holistic;
    return [skill, { cefr: numericToCefr(score), score: round(score), confidence: Math.min(0.95, weight / Math.max(1, usable.length)) }];
  })) as CEFRAssessment["perSkill"];

  return {
    cefr: numericToCefr(holistic),
    numericLevel: round(holistic),
    confidence: round(Math.min(0.95, summary.confidence + Math.min(0.2, usable.length * 0.02))),
    perSkill,
    strengths: summary.strengths.slice(0, 5),
    gaps: summary.gaps.slice(0, 5),
    l1Interference: collapseFlags(summary.l1Flags),
    trajectory,
    interaction: {
      comprehension: interactionBand(perSkill.comprehension.cefr, summary.wrongLanguageTurns, usable.length),
      miscommunicationTurns: usable.filter((s) => s.off_topic).length,
      codeSwitchTurns: summary.wrongLanguageTurns,
    },
    robustness: {
      persistentErrors: persistent,
      selfCorrections,
      rangeNote: range >= 4 ? "Demonstrated range across several everyday and abstract topics." : "Conversational range is still shallow; confidence is lower.",
    },
    recommendedFocus: recommendedFocus(perSkill, persistent, summary.l1Flags),
    holisticNotAverage: Math.abs(holistic - naive) >= 0.18,
  };
}

export function expectedWithinHalf(actual: CefrLevel, expected: CefrLevel): boolean {
  return Math.abs(cefrToNumeric(actual) - cefrToNumeric(expected)) <= 0.5;
}

function detectTrajectory(signals: TurnSignal[]): CEFRAssessment["trajectory"] {
  if (signals.length < 3) return { pattern: "insufficient", note: "Not enough turns to judge trajectory." };
  const third = Math.max(1, Math.floor(signals.length / 3));
  const early = average(signals.slice(0, third));
  const late = average(signals.slice(-third));
  const delta = late - early;
  if (delta >= 0.45) return { pattern: "improving", note: "Later answers were stronger than early warm-up turns." };
  if (delta <= -0.45) return { pattern: "declining", note: "Later answers lost accuracy or range, possibly fatigue." };
  const spread = Math.max(...signals.map((s) => s.numericLevel)) - Math.min(...signals.map((s) => s.numericLevel));
  if (spread >= 1.4) return { pattern: "mixed", note: "Performance varied meaningfully by topic or structure." };
  return { pattern: "steady", note: "Performance stayed broadly consistent across the conversation." };
}

function average(signals: TurnSignal[]): number {
  return signals.reduce((sum, s) => sum + s.numericLevel, 0) / Math.max(1, signals.length);
}

function persistentErrors(signals: TurnSignal[]): string[] {
  const counts = new Map<string, number>();
  for (const signal of signals) {
    for (const gap of signal.notable_gaps) counts.set(gap, (counts.get(gap) ?? 0) + 1);
  }
  return [...counts.entries()].filter(([, count]) => count >= 2).map(([gap]) => gap).slice(0, 5);
}

function topicRange(transcript: TranscriptTurn[]): number {
  const text = transcript.filter((t) => t.speaker === "user").map((t) => t.text.toLowerCase()).join(" ");
  const topics = [
    /\b(work|job|company|boss|customer)\b/,
    /\b(study|school|university|ielts|teacher|exam)\b/,
    /\b(family|parents|mother|father|children)\b/,
    /\b(vietnam|tet|hanoi|saigon|motorbike|coffee)\b/,
    /\b(future|goal|abroad|career|opportunity)\b/,
    /\b(problem|challenge|difficult|improve|mistake)\b/,
  ];
  return topics.filter((r) => r.test(text)).length;
}

function interactionBand(level: CefrLevel, wrongLanguageTurns: number, total: number): CEFRAssessment["interaction"]["comprehension"] {
  if (total === 0) return "insufficient";
  if (wrongLanguageTurns >= total / 2) return "fragile";
  if (cefrToNumeric(level) >= 4) return "strong";
  return "adequate";
}

function collapseFlags(flags: L1InterferenceFlag[]): L1InterferenceFlag[] {
  const byPattern = new Map<string, L1InterferenceFlag>();
  for (const flag of flags) if (!byPattern.has(flag.patternId)) byPattern.set(flag.patternId, flag);
  return [...byPattern.values()];
}

function recommendedFocus(
  perSkill: CEFRAssessment["perSkill"],
  persistent: string[],
  flags: L1InterferenceFlag[],
): string[] {
  const focus: string[] = [];
  const weakest = SUBSKILLS.slice().sort((a, b) => perSkill[a].score - perSkill[b].score)[0];
  focus.push(`Build ${weakest} through short spoken answers with follow-up questions.`);
  if (persistent.length) focus.push(`Stabilize persistent issue: ${persistent[0]}.`);
  if (flags.some((f) => f.patternId.includes("article"))) focus.push("Practice article use with Vietnamese-to-English contrast examples.");
  if (flags.some((f) => f.patternId.includes("past"))) focus.push("Practice past-time narration beyond Vietnamese time markers.");
  return [...new Set(focus)].slice(0, 4);
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
