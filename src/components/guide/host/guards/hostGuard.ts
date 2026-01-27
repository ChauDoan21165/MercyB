// FILE: hostGuard.ts
// PURPOSE (LOCKED):
// - Deterministic guardrail layer for Mercy Host text output.
// - Enforces: Mercy tone, shortness, no pressure, no lectures, no therapy claims.
// - Returns: pass/fail + reasons + optional rewrite suggestions.
//
// NOTE:
// - This is a SPEC / reference implementation (pure functions).
// - Keep it small; do not couple to React.

export type HostIntent =
  | "silence"
  | "comfort"
  | "clarify"
  | "suggest_one_step"
  | "redirect"
  | "upsell_info";

export type GuardConfig = {
  maxWords: number; // default 160
  maxQuestions: number; // default 1
  maxActionSteps: number; // default 1
  maxOptions: number; // default 2
};

export type GuardFinding =
  | { code: "tooLong"; detail: string }
  | { code: "tooManyQuestions"; detail: string }
  | { code: "tooManySteps"; detail: string }
  | { code: "urgencyWords"; detail: string }
  | { code: "authorityTone"; detail: string }
  | { code: "judgmentWords"; detail: string }
  | { code: "therapyClaims"; detail: string }
  | { code: "salesPressure"; detail: string }
  | { code: "tooManyOptions"; detail: string }
  | { code: "missingExitRamp"; detail: string }
  | { code: "missingAcknowledge"; detail: string }
  | { code: "missingNarrowScope"; detail: string }
  | { code: "missingOneStepOrQuestion"; detail: string };

export type GuardResult = {
  ok: boolean;
  hardFails: GuardFinding[];
  softFails: GuardFinding[];
  metrics: {
    words: number;
    questions: number;
    steps: number;
    options: number;
  };
};

const RX = {
  // --- hard bans / strong signals ---
  urgency: /\b(now|today|act fast|limited|urgent|right away|hurry|don['’]t miss|do not miss|upgrade now|unlock|real value)\b/i,
  authority: /\b(you must|you need to|the correct way|the best way|you should|you have to)\b/i,
  judgment: /\b(lazy|behind|failed|your fault|stupid|should already)\b/i,
  therapyClaims: /\b(i am your therapist|i['’]m your therapist|diagnose|diagnosis|clinical|treatment plan)\b/i,
  salesPressure: /\b(upgrade|pay now|subscribe now|you['’]ll progress faster|serious users|real benefits|don['’]t waste time)\b/i,

  // --- structure helpers ---
  exitRamp: /\b(we can stop|we can pause|it['’]s okay to stop|it['’]s okay to pause|we can skip|nothing breaks if|no rush|no pressure)\b/i,
  acknowledge: /\b(that makes sense|i hear you|that['’]s a lot|it['’]s okay|not your fault|thank you for your patience|i['’]m sorry)\b/i,
  narrow: /\b(ignore everything except|just for the next|one small thing|one step|two minutes|let['’]s keep it simple)\b/i,

  // Questions: count '?' and also leading question phrases
  questionMark: /\?/g,

  // Rough “action step” detector: imperatives + "let's" + "try" + "go to" etc.
  // Keep cheap: it will never be perfect; the goal is to prevent multi-step output.
  stepSignals:
    /\b(let['’]s|try|go to|open|click|tap|start|do this|read this|listen|repeat|pick|choose|follow)\b/gi,

  // “Option” signals: "or", "either", "option", "choose"
  optionSignals: /\b(or|either|option|choose)\b/gi,

  // List indicators (soft): 1) 2) 3) or bullets
  listIndicators: /(^|\n)\s*(\d+\)|-|\*|•)\s+/g
};

export const DEFAULT_GUARD_CONFIG: GuardConfig = {
  maxWords: 160,
  maxQuestions: 1,
  maxActionSteps: 1,
  maxOptions: 2
};

export function countWords(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

export function countQuestions(text: string): number {
  const matches = text.match(RX.questionMark);
  return matches ? matches.length : 0;
}

export function countStepSignals(text: string): number {
  const matches = text.match(RX.stepSignals);
  return matches ? matches.length : 0;
}

export function countOptionSignals(text: string): number {
  // Heuristic: count "or/either/option/choose" occurrences, but clamp
  const matches = text.match(RX.optionSignals);
  return matches ? matches.length : 0;
}

export function runHostGuards(
  intent: HostIntent,
  draft: string,
  cfg: GuardConfig = DEFAULT_GUARD_CONFIG
): GuardResult {
  const hardFails: GuardFinding[] = [];
  const softFails: GuardFinding[] = [];

  const words = countWords(draft);
  const questions = countQuestions(draft);

  // Step counting: We count signal occurrences, then convert to a coarse "steps" number.
  // If the response contains listIndicators, it usually implies multiple steps.
  const hasList = !!draft.match(RX.listIndicators);
  const stepSignals = countStepSignals(draft);
  const steps = hasList ? Math.max(2, Math.ceil(stepSignals / 2)) : Math.ceil(stepSignals / 3);

  const optionsRaw = countOptionSignals(draft);
  const options = Math.min(6, optionsRaw); // clamp

  // Hard constraints
  if (words > cfg.maxWords) hardFails.push({ code: "tooLong", detail: `words=${words} > ${cfg.maxWords}` });
  if (questions > cfg.maxQuestions) hardFails.push({ code: "tooManyQuestions", detail: `questions=${questions} > ${cfg.maxQuestions}` });
  if (steps > cfg.maxActionSteps) hardFails.push({ code: "tooManySteps", detail: `steps≈${steps} > ${cfg.maxActionSteps}` });

  if (RX.urgency.test(draft)) hardFails.push({ code: "urgencyWords", detail: "contains urgency language" });
  if (RX.authority.test(draft)) hardFails.push({ code: "authorityTone", detail: "contains authoritative phrasing" });
  if (RX.judgment.test(draft)) hardFails.push({ code: "judgmentWords", detail: "contains judgment/shame language" });
  if (RX.therapyClaims.test(draft)) hardFails.push({ code: "therapyClaims", detail: "contains therapy/diagnosis claims" });

  // Sales pressure is only tolerated (still discouraged) in upsell_info; even then, no urgency.
  if (intent !== "upsell_info" && RX.salesPressure.test(draft)) {
    hardFails.push({ code: "salesPressure", detail: "sales language outside upsell_info intent" });
  }
  if (intent === "upsell_info" && RX.urgency.test(draft)) {
    hardFails.push({ code: "urgencyWords", detail: "upsell_info cannot contain urgency" });
  }

  // Soft constraints
  if (options > cfg.maxOptions) softFails.push({ code: "tooManyOptions", detail: `options≈${options} > ${cfg.maxOptions}` });

  // Required structure (except for silence intent)
  if (intent !== "silence") {
    if (!RX.exitRamp.test(draft)) softFails.push({ code: "missingExitRamp", detail: "missing pause/stop/skip/no pressure exit ramp" });
    if (!RX.acknowledge.test(draft)) softFails.push({ code: "missingAcknowledge", detail: "missing acknowledge/normalize phrase" });
    if (!RX.narrow.test(draft)) softFails.push({ code: "missingNarrowScope", detail: "missing scope shrink phrase" });

    // Must contain at least one of: a step signal or a question (the “one step or one question” rule)
    if (stepSignals === 0 && questions === 0) {
      softFails.push({ code: "missingOneStepOrQuestion", detail: "missing a single step or single question" });
    }
  } else {
    // Silence intent should be short and not directive
    if (steps > 0) softFails.push({ code: "tooManySteps", detail: "silence intent should avoid directives" });
  }

  // Determine ok: any hard fail => not ok; soft fails allowed up to 1
  const ok = hardFails.length === 0 && softFails.length <= 1;

  return {
    ok,
    hardFails,
    softFails,
    metrics: { words, questions, steps, options }
  };
}