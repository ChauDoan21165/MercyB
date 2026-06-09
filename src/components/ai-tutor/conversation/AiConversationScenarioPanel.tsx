import { useState } from "react";
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
  type AiConversationScenarioId,
} from "@/lib/ai-conversation/scenarios";
import {
  sendAiConversationTurn,
  type AiConversationTurnResponse,
} from "@/lib/ai-conversation/client";

type Props = {
  accessToken?: string | null;
  hasPremium: boolean;
  loadingAccess: boolean;
  sendTurn?: typeof sendAiConversationTurn;
};

export default function AiConversationScenarioPanel({
  accessToken,
  hasPremium,
  loadingAccess,
  sendTurn = sendAiConversationTurn,
}: Props) {
  const [scenarioId, setScenarioId] = useState<AiConversationScenarioId>("job-interview");
  const [session, setSession] = useState<AiConversationSession>(() =>
    createSeededSession("job-interview"),
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scenario = AI_CONVERSATION_SCENARIOS[scenarioId];
  const canSend = Boolean(input.trim()) && !loading && canSendAiConversationTurn(session);

  const resetSession = (nextScenarioId = scenarioId) => {
    setScenarioId(nextScenarioId);
    setSession(createSeededSession(nextScenarioId));
    setInput("");
    setError("");
  };

  const handleSend = async () => {
    const learnerText = input.trim();
    if (!learnerText || !accessToken || !canSendAiConversationTurn(session)) return;
    setInput("");
    setError("");
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
      });
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

  if (!hasPremium) {
    return (
      <section
        className="mx-auto mt-4 w-full max-w-3xl rounded-lg border border-amber-200 bg-amber-50 p-5"
        data-testid="ai-conversation-premium-gate"
      >
        <div className="text-xs font-black uppercase text-amber-700">Premium</div>
        <h2 className="mt-1 text-lg font-black text-slate-900">
          AI conversation scenarios are Premium-only
        </h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
          Luyện phỏng vấn nhiều lượt với sửa lỗi tiếng Việt sang tiếng Anh chỉ mở cho Premium.
        </p>
      </section>
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
              AI conversation scenario
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
            <option value="job-interview">Job interview</option>
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
          Your interview answer
        </label>
        <textarea
          value={input}
          onChange={(event) => {
            if (event.target.value.length <= 1200) setInput(event.target.value);
          }}
          rows={3}
          className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-[15px] leading-relaxed text-slate-900 placeholder-slate-400 focus:border-indigo-300 focus:bg-white focus:outline-none"
          placeholder="Answer Mercy's interview question in English..."
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

function createSeededSession(scenarioId: AiConversationScenarioId): AiConversationSession {
  const scenario = AI_CONVERSATION_SCENARIOS[scenarioId];
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
