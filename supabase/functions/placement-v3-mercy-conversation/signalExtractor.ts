import { CEFR_ORDER, type CefrLevel, type L1InterferenceFlag, type SignalSummary, type Subskill, type SubskillSignal, type TranscriptTurn, type TurnSignal } from "./types.ts";
import { detectLanguageMarker } from "./conversationState.ts";

const SUBSKILLS: Subskill[] = ["grammar", "vocab", "fluency", "comprehension"];
const LEVEL_NUM: Record<CefrLevel, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };

export function extractSignalsFromTurn(text: string, promptText = ""): TurnSignal {
  const trimmed = text.trim();
  const language = detectLanguageMarker(trimmed);
  const safety = detectSafety(trimmed);
  if (!trimmed) return insufficient("Empty response.");

  const words = tokenize(trimmed);
  const englishWords = words.filter((w) => /[a-z]/i.test(w));
  const sentenceCount = Math.max(1, (trimmed.match(/[.!?]+/g) ?? []).length);
  const avgSentence = englishWords.length / sentenceCount;
  const uniqueRatio = englishWords.length ? new Set(englishWords.map((w) => w.toLowerCase())).size / englishWords.length : 0;
  const advancedHits = countMatches(trimmed, /\b(nevertheless|therefore|whereas|ultimately|significant|misunderstood|opportunity|confidence|hypothetically|consequently|sustainable|perspective|rational|rewarded|communicate|interaction|mechanism|scholarships|proxy|adaptive|dignity|asymmetrically|symmetrically|gatekeeping|fossilized|sequencing|momentum|articulate|nuanced|substitution|reinforce|class marker|pressure|accent|diagnose|exposure|inspected|recommendation|discipline|formula|negotiating|disagreeing|politely|supplier|delayed|risk|tone|direct|tradeoff|high-stakes)\b/gi);
  const connectorHits = countMatches(trimmed, /\b(because|although|however|while|unless|therefore|instead|for example|even though|on the other hand)\b/gi);
  const tenseRange = countTenseRange(trimmed);
  const selfCorrections = countMatches(trimmed, /\b(i mean|sorry|let me say|actually|I mean|not .* but)\b/gi);
  const grammarErrors = detectGrammarErrors(trimmed);
  const l1Flags = detectL1Interference(trimmed);
  const offTopic = Boolean(promptText && isOffTopic(trimmed, promptText));
  const codeSwitch = language === "vi" || language === "code-switch";

  let numeric = 1.15;
  if (englishWords.length >= 8) numeric += 0.7;
  if (englishWords.length >= 15) numeric += 0.55;
  if (englishWords.length >= 25) numeric += 0.75;
  if (englishWords.length >= 55) numeric += 0.6;
  if (avgSentence >= 10) numeric += 0.45;
  if (avgSentence >= 18) numeric += 0.4;
  if (uniqueRatio > 0.72 && englishWords.length >= 20) numeric += 0.35;
  numeric += Math.min(1.8, advancedHits * 0.38);
  numeric += Math.min(1.0, connectorHits * 0.22);
  numeric += Math.min(0.7, tenseRange * 0.22);
  numeric += Math.min(0.3, selfCorrections * 0.15);
  numeric -= Math.min(1.2, grammarErrors.length * 0.18);
  numeric -= offTopic ? 0.8 : 0;
  numeric -= language === "vi" ? 1.2 : language === "code-switch" ? 0.35 : 0;
  numeric = clamp(numeric, 1, 6);

  const confidence = clamp(
    0.32 + Math.min(0.38, englishWords.length / 110) + Math.min(0.2, sentenceCount * 0.04) -
      (offTopic ? 0.2 : 0) - (language === "vi" ? 0.25 : 0),
    0.1,
    0.95,
  );
  const cefr = numericToCefr(numeric);

  const observed_subskills: Record<Subskill, SubskillSignal> = {
    grammar: subskillSignal(numeric - Math.min(1.3, grammarErrors.length * 0.28) + tenseRange * 0.08, confidence, [
      tenseRange > 1 ? "uses more than one tense/aspect" : "limited tense range",
      grammarErrors.length ? `${grammarErrors.length} grammar-transfer issue(s)` : "few obvious grammar breakdowns",
    ]),
    vocab: subskillSignal(numeric + Math.min(0.6, advancedHits * 0.18) + (uniqueRatio > 0.72 ? 0.2 : 0), confidence, [
      advancedHits ? "uses abstract or precise vocabulary" : "mostly high-frequency vocabulary",
    ]),
    fluency: subskillSignal(numeric + (englishWords.length >= 45 ? 0.25 : -0.15), confidence, [
      `${englishWords.length} English word(s)`,
      selfCorrections ? "self-corrects while speaking/writing" : "no explicit self-correction",
    ]),
    comprehension: subskillSignal(numeric - (offTopic ? 1.2 : 0) - (language === "vi" ? 0.6 : 0), confidence, [
      offTopic ? "answer does not address the prompt" : "responds to the question",
    ]),
  };

  return {
    estimated_cefr_this_turn: cefr,
    numericLevel: numeric,
    confidence,
    observed_subskills,
    l1_interference_flags: l1Flags,
    notable_strengths: buildStrengths({ connectorHits, advancedHits, selfCorrections, tenseRange, englishWords: englishWords.length }),
    notable_gaps: buildGaps({ grammarErrors, offTopic, language, englishWords: englishWords.length }),
    code_switch_detected: codeSwitch,
    off_topic: offTopic,
    insufficient_signal: englishWords.length < 3 && language !== "vi",
    safety_flag: safety,
  };
}

export function summarizeSignals(signals: TurnSignal[]): SignalSummary {
  const usable = signals.filter((s) => !s.insufficient_signal);
  const weighted = usable.reduce((sum, s) => sum + s.numericLevel * s.confidence, 0);
  const weight = usable.reduce((sum, s) => sum + s.confidence, 0);
  const runningNumeric = weight ? weighted / weight : 3;
  const coverage = Object.fromEntries(SUBSKILLS.map((s) => [s, 0])) as Record<Subskill, number>;
  const levels = Object.fromEntries(SUBSKILLS.map((s) => [s, "B1"])) as Record<Subskill, CefrLevel>;
  for (const skill of SUBSKILLS) {
    const skillWeighted = usable.reduce((sum, sig) => sum + sig.observed_subskills[skill].score * sig.observed_subskills[skill].confidence, 0);
    const skillWeight = usable.reduce((sum, sig) => sum + sig.observed_subskills[skill].confidence, 0);
    coverage[skill] = usable.filter((sig) => sig.observed_subskills[skill].confidence >= 0.4).length;
    levels[skill] = numericToCefr(skillWeight ? skillWeighted / skillWeight : runningNumeric);
  }
  return {
    turnCount: signals.length,
    runningLevel: numericToCefr(runningNumeric),
    runningNumeric,
    confidence: clamp(weight / Math.max(1, signals.length), 0.1, 0.95),
    strengths: dedupe(usable.flatMap((s) => s.notable_strengths)).slice(0, 6),
    gaps: dedupe(usable.flatMap((s) => s.notable_gaps)).slice(0, 6),
    l1Flags: dedupeFlags(usable.flatMap((s) => s.l1_interference_flags)).slice(0, 8),
    subskillCoverage: coverage,
    subskillLevels: levels,
    recentSignals: signals.slice(-4),
    wrongLanguageTurns: signals.filter((s) => s.code_switch_detected).length,
    abusiveTurns: signals.filter((s) => s.safety_flag === "abusive").length,
  };
}

export function numericToCefr(n: number): CefrLevel {
  if (n < 1.65) return "A1";
  if (n < 2.55) return "A2";
  if (n < 3.55) return "B1";
  if (n < 4.55) return "B2";
  if (n < 5.45) return "C1";
  return "C2";
}

export function cefrToNumeric(level: CefrLevel): number {
  return LEVEL_NUM[level];
}

export function transcriptUserSignals(turns: TranscriptTurn[]): TurnSignal[] {
  return turns
    .map((turn, i) => ({ turn, previous: turns.slice(0, i).reverse().find((t) => t.speaker === "mercy") }))
    .filter(({ turn }) => turn.speaker === "user")
    .map(({ turn, previous }) => extractSignalsFromTurn(turn.text, previous?.text ?? ""));
}

function subskillSignal(score: number, confidence: number, evidence: string[]): SubskillSignal {
  const clamped = clamp(score, 1, 6);
  return { level: numericToCefr(clamped), score: clamped, confidence, evidence };
}

function tokenize(text: string): string[] {
  return text.match(/[A-Za-zÀ-ỹ']+/g) ?? [];
}

function detectGrammarErrors(text: string): string[] {
  const patterns: Array<[RegExp, string]> = [
    [/\bI am go\b|\bhe go\b|\bshe go\b|\bit make\b/gi, "verb agreement / tense"],
    [/\bI very\b|\bI tired\b|\bshe happy\b/gi, "missing be"],
    [/\bmany student\b|\btwo year\b|\bthree month\b/gi, "plural -s"],
    [/\bI went to school yesterday and meet\b/gi, "past sequence"],
    [/\bdepend of\b|\bdiscuss about\b|\bmarried with\b/gi, "preposition transfer"],
    [/\bI don't know how to (?:say|speak) it\b/gi, "lexical gap"],
    [/\bthe Vietnam\b|\ba English\b|\ban university\b/gi, "article use"],
  ];
  return patterns.flatMap(([regex, label]) => regex.test(text) ? [label] : []);
}

function detectL1Interference(text: string): L1InterferenceFlag[] {
  const checks: Array<[RegExp, string, string]> = [
    [/\b(a|an|the)\s+(Vietnam|English)\b|\ba English\b|\ban university\b/gi, "l1_article_use", "Vietnamese has no article system, causing article over/under-use."],
    [/\bmany student\b|\btwo year\b|\bseveral problem\b/gi, "l1_plural_s", "Vietnamese nouns do not inflect for plural -s."],
    [/\bhe go\b|\bshe work\b|\bit make\b/gi, "l1_third_person_s", "Third-person -s is often omitted."],
    [/\byesterday .* (go|meet|eat|see)\b/gi, "l1_past_tense", "Past time marker used without English past-tense morphology."],
    [/\bdepend of\b|\bdiscuss about\b|\bmarried with\b/gi, "l1_preposition_transfer", "Preposition choice follows Vietnamese transfer pattern."],
    [/\bI very\b|\bshe very\b|\bhe very\b/gi, "l1_missing_be", "Vietnamese adjective predicates do not require be."],
  ];
  return checks.flatMap(([regex, patternId, label]) => {
    const match = text.match(regex)?.[0];
    return match ? [{ patternId, label, evidence: match }] : [];
  });
}

function countTenseRange(text: string): number {
  const checks = [
    /\b(went|was|were|had|did|learned|studied|worked)\b/i,
    /\b(will|going to|would|could|might)\b/i,
    /\b(have|has|had) [a-z]+ed\b/i,
    /\b(if|unless|would have|had I|were I)\b/i,
  ];
  return checks.filter((r) => r.test(text)).length;
}

function isOffTopic(answer: string, prompt: string): boolean {
  const promptKeywords = new Set(tokenize(prompt.toLowerCase()).filter((w) => w.length > 4));
  const answerKeywords = new Set(tokenize(answer.toLowerCase()).filter((w) => w.length > 4));
  if (promptKeywords.size === 0 || answerKeywords.size === 0) return false;
  const overlap = [...promptKeywords].filter((w) => answerKeywords.has(w)).length;
  return overlap === 0 && answerKeywords.size < 8;
}

function detectSafety(text: string): "abusive" | "self_harm" | "none" {
  if (/\b(fuck you|shut up|stupid|idiot|bitch)\b/i.test(text)) return "abusive";
  if (/\b(kill myself|suicide|want to die)\b/i.test(text)) return "self_harm";
  return "none";
}

function buildStrengths(input: { connectorHits: number; advancedHits: number; selfCorrections: number; tenseRange: number; englishWords: number }): string[] {
  const out: string[] = [];
  if (input.englishWords >= 35) out.push("sustains a multi-sentence answer");
  if (input.connectorHits >= 1) out.push("connects ideas with reasons or contrast");
  if (input.advancedHits >= 2) out.push("uses abstract vocabulary");
  if (input.tenseRange >= 2) out.push("shows tense/aspect range");
  if (input.selfCorrections) out.push("self-corrects without losing the turn");
  return out.length ? out : ["attempts to answer in English"];
}

function buildGaps(input: { grammarErrors: string[]; offTopic: boolean; language: string; englishWords: number }): string[] {
  const out = [...input.grammarErrors];
  if (input.englishWords < 8) out.push("short answer limits evidence");
  if (input.offTopic) out.push("possible comprehension gap");
  if (input.language === "vi") out.push("answered mainly in Vietnamese");
  if (input.language === "code-switch") out.push("relies on code-switching");
  return dedupe(out);
}

function countMatches(text: string, regex: RegExp): number {
  return text.match(regex)?.length ?? 0;
}

function insufficient(reason: string): TurnSignal {
  const sub = subskillSignal(1, 0.1, [reason]);
  return {
    estimated_cefr_this_turn: "A1",
    numericLevel: 1,
    confidence: 0.1,
    observed_subskills: { grammar: sub, vocab: sub, fluency: sub, comprehension: sub },
    l1_interference_flags: [],
    notable_strengths: [],
    notable_gaps: [reason],
    code_switch_detected: false,
    off_topic: false,
    insufficient_signal: true,
    safety_flag: "none",
  };
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function dedupe(items: string[]): string[] {
  return [...new Set(items.filter(Boolean))];
}

function dedupeFlags(flags: L1InterferenceFlag[]): L1InterferenceFlag[] {
  const seen = new Set<string>();
  return flags.filter((flag) => {
    const key = `${flag.patternId}:${flag.evidence}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
