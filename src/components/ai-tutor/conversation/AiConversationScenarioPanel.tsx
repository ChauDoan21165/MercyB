import { useEffect, useState } from "react";
import { Send, RotateCcw } from "lucide-react";
import {
  addAiConversationCost,
  buildAiConversationSummary,
  canSendAiConversationTurn,
  createAiConversationSession,
  type AiConversationSession,
  type AiConversationTurn,
} from "@/lib/ai-conversation/session";
import {
  AI_CONVERSATION_SCENARIOS,
  DEFAULT_AI_CONVERSATION_SCENARIO_ID,
  LEARNER_LED_AI_CONVERSATION_SCENARIO_ID,
  type AiConversationScenarioId,
} from "@/lib/ai-conversation/scenarios";
import {
  sendAiConversationTurn,
  type AiConversationTurnResponse,
} from "@/lib/ai-conversation/client";
import {
  beginTelemetrySession,
  endTelemetrySession,
  recordTelemetryTurn,
  type TelemetrySession,
} from "@/lib/tutor/conversationTelemetry";
import type { ConversationEncouragement } from "@/lib/retention/conversationHooks";

// A 'Sửa câu' correction handed off from the grammar surface. When present we
// seed a learner-led, live-generated conversation with the learner's own
// corrected words — never a canned Mercy opener.
type ConversationCorrectionSeed = {
  correctedSentence: string;
  sourceText?: string | null;
  updatedAt?: number;
};

type Props = {
  accessToken?: string | null;
  hasPremium: boolean;
  loadingAccess: boolean;
  userId?: string | null;
  correctionSeed?: ConversationCorrectionSeed | null;
  sendTurn?: typeof sendAiConversationTurn;
};

export default function AiConversationScenarioPanel({
  accessToken,
  hasPremium,
  loadingAccess,
  userId,
  correctionSeed,
  sendTurn = sendAiConversationTurn,
}: Props) {
  const [scenarioId, setScenarioId] = useState<AiConversationScenarioId>(DEFAULT_AI_CONVERSATION_SCENARIO_ID);
  const [session, setSession] = useState<AiConversationSession>(() =>
    createSeededSession(DEFAULT_AI_CONVERSATION_SCENARIO_ID),
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [entitlementGateVisible, setEntitlementGateVisible] = useState(false);
  const [telemetrySession, setTelemetrySession] = useState<TelemetrySession | null>(null);
  const [encouragement, setEncouragement] = useState<ConversationEncouragement | null>(null);
  // Bumped on every reset so the telemetry effect ends the prior session and
  // begins a fresh one even when the learner restarts the same scenario.
  const [sessionEpoch, setSessionEpoch] = useState(0);

  const scenario = AI_CONVERSATION_SCENARIOS[scenarioId];
  const canSend = Boolean(input.trim()) && !loading && canSendAiConversationTurn(session);

  useEffect(() => {
    let cancelled = false;
    let created: TelemetrySession | null = null;
    if (!hasPremium) {
      setTelemetrySession(null);
      return;
    }
    beginTelemetrySession({
      userId,
      scenarioId,
      scenarioLabel: scenario.title,
    }).then((next) => {
      created = next;
      if (!cancelled) setTelemetrySession(next);
    }).catch(() => {
      if (!cancelled) setTelemetrySession(null);
    });
    return () => {
      cancelled = true;
      // Close the capture session so the D1/D7 return-signal + summary rollup
      // are emitted on scenario switch, "New session", premium loss, or unmount.
      // Telemetry must never throw into React; swallow any failure.
      if (created) void endTelemetrySession(created).catch(() => {});
    };
  }, [hasPremium, scenario.title, scenarioId, userId, sessionEpoch]);

  // Step 9 'Sửa câu' hand-off: a fresh correction seeds a learner-led, live
  // conversation with the learner's corrected words pre-filled as the next turn.
  // Mercy then follows those words (no canned opener). Keyed on the correction's
  // timestamp so only a genuinely new correction re-seeds — typing is never
  // clobbered mid-turn.
  const seedSentence = correctionSeed?.correctedSentence?.trim() ?? "";
  const seedStamp = correctionSeed?.updatedAt;
  useEffect(() => {
    if (!seedSentence) return;
    setScenarioId(LEARNER_LED_AI_CONVERSATION_SCENARIO_ID);
    setSession(createSeededSession(LEARNER_LED_AI_CONVERSATION_SCENARIO_ID));
    setInput(seedSentence);
    setError("");
    setEntitlementGateVisible(false);
    setEncouragement(null);
    setSessionEpoch((epoch) => epoch + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedSentence, seedStamp]);

  const resetSession = (nextScenarioId = scenarioId) => {
    setScenarioId(nextScenarioId);
    setSession(createSeededSession(nextScenarioId));
    setInput("");
    setError("");
    setEntitlementGateVisible(false);
    setEncouragement(null);
    setSessionEpoch((epoch) => epoch + 1);
  };

  const handleSend = async () => {
    const learnerText = input.trim();
    if (!learnerText || !accessToken || !canSendAiConversationTurn(session)) return;
    if (loadingAccess || !hasPremium) {
      setLoading(false);
      setError("");
      setEntitlementGateVisible(true);
      return;
    }
    setInput("");
    setError("");
    setEntitlementGateVisible(false);
    setLoading(true);

    const learnerTurn: AiConversationTurn = {
      id: `learner-${Date.now()}`,
      role: "learner",
      text: learnerText,
    };
    const optimisticSession: AiConversationSession = {
      ...session,
      turns: [...session.turns, learnerTurn],
      learnerTurnCount: session.learnerTurnCount + 1,
    };
    setSession(optimisticSession);

    try {
      const response: AiConversationTurnResponse = await sendTurn({
        scenarioId,
        learnerText,
        history: session.turns,
        turnCount: session.learnerTurnCount,
        accessToken,
        hasPremium,
      });
      if (response.entitlementGate) {
        setSession(session);
        setInput(learnerText);
        setEntitlementGateVisible(true);
        return;
      }
      const assistantTurn: AiConversationTurn = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: response.reply,
        correction: response.correction,
      };
      const turns = [...optimisticSession.turns, assistantTurn];
      const summary = response.summary ??
        (optimisticSession.learnerTurnCount >= 4 ? buildAiConversationSummary(turns) : null);
      setSession({
        ...optimisticSession,
        turns,
        cost: addAiConversationCost(optimisticSession.cost, response.cost),
        summary,
        ended: optimisticSession.learnerTurnCount >= optimisticSession.maxTurns,
      });
      if (telemetrySession) {
        // Telemetry drives consent-gated capture + flag-gated retention (XP +
        // encouragement). It must never break the turn, so guard it separately
        // and surface the warm VN-first encouragement when retention is on.
        try {
          const telemetry = await recordTelemetryTurn(telemetrySession, {
            turnNumber: optimisticSession.learnerTurnCount,
            learnerInput: learnerText,
            aiResponse: response.reply,
            corrections: response.correction
              ? [{
                  accepted: true,
                  errorType: response.correction.interferencePattern,
                  learnerText: response.correction.original,
                  correctedText: response.correction.corrected,
                }]
              : [],
            correctionAccepted: Boolean(response.correction),
          });
          setEncouragement(telemetry.encouragement);
        } catch {
          // Retention/capture failure is non-fatal; the conversation continues.
        }
      }
    } catch {
      setSession(session);
      setInput(learnerText);
      setError("Mercy chưa mở được phiên phỏng vấn. Bạn thử lại sau một chút nhé.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingAccess) {
    return (
      <section className="mx-auto mt-4 w-full max-w-3xl rounded-lg border border-slate-200 bg-white p-4 text-sm font-bold text-slate-600">
        Đang kiểm tra quyền Premium...
      </section>
    );
  }

  if (!hasPremium || entitlementGateVisible) {
    return (
      <PremiumConversationGate turnCount={session.learnerTurnCount} maxTurns={session.maxTurns} />
    );
  }

  return (
    <section
      className="mx-auto mt-4 flex min-h-[640px] w-full max-w-3xl flex-col rounded-lg border border-slate-200 bg-white shadow-sm"
      data-testid="ai-conversation-scenario-panel"
    >
      <div className="border-b border-slate-100 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs font-black uppercase text-indigo-600">
              {scenarioId === LEARNER_LED_AI_CONVERSATION_SCENARIO_ID
                ? "AI conversation"
                : "AI conversation scenario"}
            </div>
            <h2 className="mt-1 text-xl font-black text-slate-900">{scenario.title}</h2>
            <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
              {scenario.learnerRole}
            </p>
          </div>
          <select
            value={scenarioId}
            onChange={(event) => resetSession(event.target.value as AiConversationScenarioId)}
            className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700"
            aria-label="Choose conversation scenario"
          >
            {Object.values(AI_CONVERSATION_SCENARIOS).map((option) => (
              <option key={option.id} value={option.id}>
                {option.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-black text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1">
            Turn {session.learnerTurnCount}/{session.maxTurns}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1">
            Cost ${session.cost.estimatedUsd.toFixed(4)}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/70 p-4 sm:p-5">
        {session.turns.map((turn) => (
          <article
            key={turn.id}
            className={`flex ${turn.role === "assistant" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[88%] rounded-lg px-4 py-3 shadow-sm ${
                turn.role === "assistant"
                  ? "border border-indigo-100 bg-white text-slate-800"
                  : "bg-slate-900 text-white"
              }`}
            >
              <div className={`mb-1 text-[11px] font-black uppercase ${turn.role === "assistant" ? "text-indigo-500" : "text-slate-300"}`}>
                {turn.role === "assistant" ? "Mercy" : "You"}
              </div>
              <p className="whitespace-pre-wrap text-sm font-semibold leading-6">{turn.text}</p>
              {turn.correction && (
                <div
                  className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-slate-800"
                  data-testid="ai-conversation-correction"
                >
                  <div className="text-[11px] font-black uppercase text-emerald-700">
                    Sửa nhẹ
                  </div>
                  <p className="mt-1 font-black text-emerald-900">{turn.correction.corrected}</p>
                  <p className="mt-2 font-semibold leading-6">{turn.correction.explanationVi}</p>
                  <p className="mt-2 text-xs font-bold text-emerald-800">
                    Mẫu ảnh hưởng tiếng Việt: {turn.correction.interferencePattern}
                  </p>
                </div>
              )}
            </div>
          </article>
        ))}
        {loading && (
          <div className="inline-flex rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-bold text-indigo-700">
            Mercy is thinking...
          </div>
        )}
        {encouragement && (
          <div
            className="rounded-lg border border-violet-200 bg-violet-50 p-3 text-sm text-slate-800"
            data-testid="ai-conversation-encouragement"
          >
            <p className="font-black text-violet-900">{encouragement.vi}</p>
            <p className="mt-1 text-xs font-bold text-violet-700">{encouragement.en}</p>
          </div>
        )}
        {session.summary && (
          <div
            className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-slate-800"
            data-testid="ai-conversation-summary"
          >
            <div className="text-xs font-black uppercase text-sky-700">Session summary</div>
            <p className="mt-2 font-semibold">{session.summary.progressNote}</p>
            <p className="mt-2 font-bold">Practiced: {session.summary.practiced.join(", ")}</p>
            <p className="mt-1 font-bold">
              Errors caught: {session.summary.errorsCaught.length ? session.summary.errorsCaught.join(", ") : "none"}
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 p-4">
        {error && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-800">
            {error}
          </div>
        )}
        {!canSendAiConversationTurn(session) && (
          <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-900">
            This session reached 50 turns. Start a new session to continue.
          </div>
        )}
        <label className="mb-2 block text-xs font-black uppercase text-slate-500">
          Your answer
        </label>
        <textarea
          value={input}
          onChange={(event) => {
            if (event.target.value.length <= 1200) setInput(event.target.value);
          }}
          rows={3}
          className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-[15px] leading-relaxed text-slate-900 placeholder-slate-400 focus:border-indigo-300 focus:bg-white focus:outline-none"
          placeholder={
            scenarioId === LEARNER_LED_AI_CONVERSATION_SCENARIO_ID
              ? "Start with your own English sentence..."
              : "Answer Mercy's question in English..."
          }
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) void handleSend();
          }}
        />
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => resetSession()}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            New session
          </button>
          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={!canSend || !accessToken}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            <Send className="h-4 w-4" aria-hidden />
            Send answer
          </button>
        </div>
      </div>
    </section>
  );
}

function PremiumConversationGate({
  turnCount,
  maxTurns,
}: {
  turnCount: number;
  maxTurns: number;
}) {
  return (
    <section
      className="mx-auto mt-4 w-full max-w-3xl rounded-lg border border-amber-300 bg-amber-50 p-5 shadow-sm"
      data-testid="ai-conversation-premium-gate"
      aria-label="Thẻ nâng cấp Premium cho luyện hội thoại AI"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-black uppercase text-amber-700">Premium</div>
          <h2 className="mt-1 text-lg font-black text-slate-950">
            Mở luyện hội thoại AI nhiều lượt
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
            Phần hội thoại AI có sửa lỗi theo ngữ cảnh chỉ dành cho Premium. Đây là thẻ nâng cấp của MercyBlade, không phải lời của Mercy.
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
            English: Upgrade to Premium to use multi-turn AI conversation practice.
          </p>
        </div>
        <div
          className="rounded-lg border border-amber-200 bg-white px-4 py-3 text-sm font-black text-slate-800"
          data-testid="ai-conversation-gate-turn-count"
        >
          Turn {turnCount}/{maxTurns}
        </div>
      </div>
      <a
        href="/pricing"
        className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-black text-white hover:bg-slate-800"
      >
        Xem gói Premium
      </a>
    </section>
  );
}

function createSeededSession(scenarioId: AiConversationScenarioId): AiConversationSession {
  const scenario = AI_CONVERSATION_SCENARIOS[scenarioId];
  if (scenarioId === LEARNER_LED_AI_CONVERSATION_SCENARIO_ID) {
    return createAiConversationSession(scenarioId);
  }
  return {
    ...createAiConversationSession(scenarioId),
    turns: [
      {
        id: "assistant-opening",
        role: "assistant",
        text: scenario.openingPrompt,
      },
    ],
  };
}
