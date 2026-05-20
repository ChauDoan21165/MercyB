import { decideNextAction } from "./adaptiveLogic";
import { countTurnPairs } from "./conversationState";
import { buildPersonaSystemPrompt, comfortQuestion, enforcePersona, fallbackQuestion, openingTurn, repairQuestion, wrapTurn } from "./mercyPersona";
import { summarizeSignals } from "./signalExtractor";
import type { AiJsonCallInput, AiJsonCallResult, MercyTurn, SignalSummary, Subskill, TurnGenerationInput } from "./types";

const QUESTION_BY_SUBSKILL: Record<Subskill, string> = {
  grammar: "Tell me about something you wanted to do last year but could not. What would you have done differently?",
  vocab: "Choose one familiar topic in Vietnam, like coffee shops, traffic, or school pressure. Describe it with as much detail as you can.",
  fluency: "Tell me the story of a small problem you solved recently. What happened first, then what happened after that?",
  comprehension: "Let me check I explained clearly: if you had to give advice to a younger student learning English, what would you tell them to do first?",
};

export async function generateMercyTurn(
  input: TurnGenerationInput,
  callAi?: (input: AiJsonCallInput) => Promise<AiJsonCallResult>,
): Promise<MercyTurn> {
  if (input.history.length === 0 || input.phase === "opening") return openingTurn(input.learnerName);
  const turnPairs = countTurnPairs(input.history);
  const signals: SignalSummary = input.signals ?? summarizeSignals([]);
  const decision = decideNextAction({
    phase: input.phase,
    targetTurnPairs: input.targetTurnPairs ?? 8,
    turnPairs,
    signals,
    lastSignal: signals.recentSignals.at(-1),
  });

  if (decision.decision === "WRAP") return wrapTurn();

  const deterministic = buildDeterministicTurn(decision);
  if (!callAi) return deterministic;

  try {
    const ai = await callAi({
      systemPrompt: buildPersonaSystemPrompt(),
      userMessage: JSON.stringify({
        task: "Generate Mercy's next placement-conversation turn as JSON.",
        requiredShape: {
          text: "Mercy's learner-facing utterance",
          internal_note: "why this turn was chosen",
        },
        decision,
        recentHistory: input.history.slice(-8),
        signalSummary: signals,
      }),
      maxTokens: 450,
      temperature: 0.35,
    });
    if (ai.ok && typeof ai.json.text === "string") {
      return {
        ...deterministic,
        text: enforcePersona(ai.json.text, decision.targetCefr, decision.nextPhase),
        internal_note: typeof ai.json.internal_note === "string" ? ai.json.internal_note : deterministic.internal_note,
      };
    }
  } catch (err) {
    console.warn("[placement-v3-mercy-conversation] turn AI fallback", err);
  }
  return deterministic;
}

export function buildDeterministicTurn(decision: ReturnType<typeof decideNextAction>): MercyTurn {
  let text: string;
  if (decision.decision === "COMFORT") text = comfortQuestion(decision.targetCefr);
  else if (decision.decision === "BACKOFF") text = repairQuestion(decision.targetCefr);
  else if (decision.decision === "TARGET" && decision.targetSubskill) text = QUESTION_BY_SUBSKILL[decision.targetSubskill];
  else text = fallbackQuestion(decision.targetCefr, decision.targetSubskill);

  return {
    text: enforcePersona(text, decision.targetCefr, decision.nextPhase),
    phase: decision.nextPhase,
    targetCefr: decision.targetCefr,
    targetSubskill: decision.targetSubskill,
    internal_note: `${decision.decision}: ${decision.reason}`,
    shouldEndSession: false,
  };
}
