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
  type ConversationLearnerMemory,
} from "@/lib/ai-conversation/client";
import type { NextLessonRecommendation } from "@/lib/tutor/nextLessonRecommender";
import {
  recordConversationTurnMasteryEvidence,
  type ConversationMasteryEvidence,
} from "@/lib/ai-conversation/learnerEvidence";
import {
  beginTelemetrySession,
  endTelemetrySession,
  recordTelemetryTurn,
  type TelemetrySession,
} from "@/lib/tutor/conversationTelemetry";
import type { ConversationEncouragement } from "@/lib/retention/conversationHooks";
import { recordActiveDay } from "@/lib/retention/recordActiveDay";
import { ConsentModal } from "@/components/ConsentModal";
import { hasCaptureConsentDecision } from "@/lib/conversationCapture/captureConsent";
import { putCorrection } from "@/lib/ai-tutor/learningMemory";
import { emitFeatureOutcome } from "@/lib/analytics";

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
  /**
   * True when the client positively resolved the user's entitlement (premium
   * confirmed, or profile settled without error). False when uncertain — skip
   * the client pre-check and let sendTurn() reach the server instead.
   * Defaults to true so existing callers that only pass hasPremium/loadingAccess
   * keep the same gate behaviour.
   */
  accessConfirmed?: boolean;
  userId?: string | null;
  correctionSeed?: ConversationCorrectionSeed | null;
  /** Step-12: returning-learner memory (safe tags) for cross-session recall. */
  learnerMemory?: ConversationLearnerMemory | null;
  targetLanguage?: string;
  onRecommendationChange?: (recommendation: NextLessonRecommendation) => void;
  sendTurn?: typeof sendAiConversationTurn;
};

export default function AiConversationScenarioPanel({
  accessToken,
  hasPremium,
  loadingAccess,
  accessConfirmed = true,
  userId,
  correctionSeed,
  learnerMemory,
  targetLanguage = "en",
  onRecommendationChange,
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
  // One-time consent gate: shown on the learner's first conversation turn when
  // no prior decision is stored. Either choice (agree or decline) persists so
  // the modal never shows again. Capture proceeds only after opt-in.
  const [showConsentModal, setShowConsentModal] = useState(false);

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
    // Step 9 telemetry: record each correction→conversation hand-off.
    // Gated by auth + RETENTION_OUTCOME_EVENTS flag (ships dark until flipped).
    void emitFeatureOutcome("correction_seed_handoff", "engaged", {
      scenario: LEARNER_LED_AI_CONVERSATION_SCENARIO_ID,
    });
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
    // On the first send (no prior consent decision), pause and show the modal.
    // After any decision (agree or decline) the modal never shows again and
    // the send proceeds. The learner's typed text stays in state so it is not lost.
    if (!hasCaptureConsentDecision()) {
      setShowConsentModal(true);
      return;
    }
    if (!loadingAccess && accessConfirmed && !hasPremium) {
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
        learnerMemory,
      });
      if (response.entitlementGate) {
        setSession(session);
        setInput(learnerText);
        setEntitlementGateVisible(true);
        return;
      }
      // Contract C6: Mercy never emits a preset reply. When the turn could not be
      // live-generated the client returns provider "local-fallback" (network / API
      // error / invalid response / cost cap). We fail closed — no canned Mercy bubble
      // is appended; we restore the learner's input and surface an explicit VN-first
      // retry instead (re-press = retry), mirroring the server's fail-closed (502).
      if (response.provider === "local-fallback") {
        setSession(session);
        setInput(learnerText);
        setError("Mercy chưa lấy được câu trả lời. Bạn thử lại sau một chút nhé.");
        return;
      }
      const masteryEvidence: ConversationMasteryEvidence = recordConversationTurnMasteryEvidence({
        product: "ai-tutor",
        targetLanguage,
        scenarioId,
        provider: response.provider,
        correction: response.correction,
        pronunciation: response.pronunciationEvidence ?? null,
      });
      if (masteryEvidence.recommendation) {
        onRecommendationChange?.(masteryEvidence.recommendation);
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
      // Step 10 — a real conversation turn is engagement, so it records the
      // D1/D7 active day exactly like every other tutor surface (correction,
      // speak, daily challenge). Consent-independent (this marks the learner's
      // own activity, not captured content) and dedup'd per local day inside
      // recordActiveDay. Fires only past the entitlement + local-fallback guards.
      recordActiveDay();
      // Step-12 WRITE: persist the detected interference pattern to the
      // device-local cross-session memory (privacy-safe — putCorrection
      // sanitizes the tag; no raw learner text stored) so a future session can
      // recall it. Conversation practice is English on this surface.
      if (response.correction?.interferencePattern) {
        void putCorrection({
          id: `conv-${Date.now()}`,
          topic: response.correction.interferencePattern,
          cefr: "B1",
          createdAt: Date.now(),
          practiced: false,
          tutorProduct: "ai-tutor",
          targetLanguage: "en",
        }).catch(() => {});
      }
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
            // Step-12: prove the cross-session recall in telemetry.
            memoryRecalled: response.memoryRecalled === true,
            pronunciationEvidence: response.pronunciationEvidence ?? null,
            masteryEvidence,
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

  // Called by ConsentModal after the learner makes any choice (agree or decline).
  // Close the modal and re-run handleSend — hasCaptureConsentDecision() is now
  // true so the consent branch is skipped and the actual turn is submitted.
  const handleConsentDecision = () => {
    setShowConsentModal(false);
    void handleSend();
  };

  if (loadingAccess) {
    return (
      <section className="mx-auto mt-4 w-full max-w-3xl rounded-lg border border-slate-200 bg-white p-4 text-sm font-bold text-slate-600">
        Đang kiểm tra quyền Premium...
      </section>
    );
  }

  if ((accessConfirmed && !hasPremium) || entitlementGateVisible) {
    return (
      <PremiumConversationGate turnCount={session.learnerTurnCount} maxTurns={session.maxTurns} />
    );
  }

  return (
    <>
    <ConsentModal open={showConsentModal} onDecision={handleConsentDecision} />
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
            <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
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
        {session.turns.length === 0 &&
          scenarioId !== LEARNER_LED_AI_CONVERSATION_SCENARIO_ID &&
          scenario.openingPrompt && (
            <div
              className="rounded-lg border border-indigo-100 bg-indigo-50/70 p-3 text-sm text-slate-700"
              data-testid="ai-conversation-starter-hint"
            >
              <div className="text-[11px] font-black uppercase text-indigo-500">Gợi ý mở đầu</div>
              <p className="mt-1 font-semibold leading-6">{scenario.openingPrompt}</p>
            </div>
          )}
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
        <label className="mb-2 block text-xs font-black uppercase text-slate-600">
          Your answer
        </label>
        <textarea
          value={input}
          onChange={(event) => {
            if (event.target.value.length <= 1200) setInput(event.target.value);
          }}
          rows={3}
          className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-[15px] leading-relaxed text-slate-900 placeholder-slate-500 focus:border-indigo-300 focus:bg-white focus:outline-none"
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
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-600"
          >
            <Send className="h-4 w-4" aria-hidden />
            Send answer
          </button>
        </div>
      </div>
    </section>
    </>
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

// Contract C6: Mercy's conversation turns are always live-generated. No scenario
// seeds a canned assistant opener into the transcript — the learner speaks first
// and Mercy's first reply comes live from the model. Preset scenarios surface
// their opening prompt as a non-transcript starter hint instead (see the hint
// card in the transcript region), so orientation is preserved without a scripted
// Mercy line that would also be replayed back to the model as fake history.
function createSeededSession(scenarioId: AiConversationScenarioId): AiConversationSession {
  return createAiConversationSession(scenarioId);
}
