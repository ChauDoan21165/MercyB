/**
 * useAITutor — React hook for AI Tutor turn execution.
 *
 * Phase C Option B — UI integration. Calls PB5 executeTutorTurn only.
 * Must not import PB2/PB3/PB4 modules directly.
 *
 * Uses React state only — no localStorage, no Supabase, no persistence.
 * No raw learner text logging. No real provider calls.
 */

import { useCallback, useRef, useState } from "react";
import {
  executeTutorTurn,
  getErrorResponse,
} from "@/lib/ai-tutor/aiTutorService";
import type {
  TutorTurnRequest,
  TutorTurnResult,
  TurnMetrics,
  TutorTurnErrorKind,
} from "@/lib/ai-tutor/aiTutorService";
import { createMockProvider } from "@/lib/ai-tutor/mockProvider";
import type { MockProvider } from "@/lib/ai-tutor/mockProvider";
import { createTutorSession } from "@/lib/ai-tutor/sessionRuntime";
import type {
  TutorSession,
  TutorResponse,
  TutorTier,
  TutorEntryPoint,
} from "@/lib/ai-tutor/types";

// ─── Types ────────────────────────────────────────────────────────────

export type UseAITutorState =
  | { phase: "idle" }
  | { phase: "loading"; startedAt: number }
  | { phase: "response"; response: TutorResponse; metrics: TurnMetrics }
  | { phase: "error"; kind: TutorTurnErrorKind; response: TutorResponse }
  | { phase: "safety"; kind: string; messageVi: string }
  | { phase: "budget"; messageVi: string }
  | { phase: "ended" };

export type UseAITutorReturn = {
  state: UseAITutorState;
  send: (message: string) => void;
  reset: () => void;
  session: TutorSession | null;
};

// ─── Hook ─────────────────────────────────────────────────────────────

export function useAITutor(
  userId: string | null,
  tier: TutorTier = "free",
): UseAITutorReturn {
  const [state, setState] = useState<UseAITutorState>({ phase: "idle" });
  const mockProviderRef = useRef<MockProvider>(createMockProvider({ seed: 42, errorRate: 0 }));
  const sessionRef = useRef<TutorSession | null>(null);
  const requestCountRef = useRef(0);
  const turnCountRef = useRef(0);

  /** Initialize or retrieve the tutor session. */
  const getOrCreateSession = useCallback((entryPoint: TutorEntryPoint): TutorSession => {
    if (sessionRef.current) return sessionRef.current;
    const nowMs = Date.now();
    const session = createTutorSession({
      sessionId: `tutor-${nowMs}`,
      userId,
      tier,
      entryPoint,
      nowMs,
    });
    sessionRef.current = session;
    return session;
  }, [userId, tier]);

  /** Send a message to the AI Tutor. */
  const send = useCallback((message: string) => {
    if (!message.trim()) return;

    const entryPoint: TutorEntryPoint = "ask";
    const session = getOrCreateSession(entryPoint);
    const nowMs = Date.now();
    const requestId = `ui-req-${requestCountRef.current++}`;

    setState({ phase: "loading", startedAt: nowMs });

    // Build the turn request
    const req: TutorTurnRequest = {
      session,
      userMessage: message,
      entryPoint,
      tier,
      isKidsMode: false, // kids mode never reaches this hook
      nowMs,
      mockProvider: mockProviderRef.current,
      requestId,
      requestsThisMinute: turnCountRef.current,
      requestsToday: turnCountRef.current,
      runningDailyCostUsd: 0,
    };

    // Call PB5 orchestration
    const result = executeTutorTurn(req);

    // Update session reference
    sessionRef.current = result.session;
    turnCountRef.current++;

    // Map result to UI state
    if (result.metrics.safetyCheckPassed === false) {
      setState({
        phase: "safety",
        kind: "profanity",
        messageVi: result.response?.vi ?? getErrorResponse("safety_blocked").vi,
      });
      return;
    }

    if (result.metrics.budgetCheckPassed === false) {
      setState({
        phase: "budget",
        messageVi: result.response?.vi ?? getErrorResponse("token_budget_exceeded").vi,
      });
      return;
    }

    if (result.metrics.providerCallSucceeded === false) {
      setState({
        phase: "error",
        kind: "provider_failed",
        response: result.response ?? getErrorResponse("provider_failed"),
      });
      return;
    }

    if (result.response) {
      setState({
        phase: "response",
        response: result.response,
        metrics: result.metrics,
      });
    } else {
      setState({
        phase: "error",
        kind: "unknown_error",
        response: getErrorResponse("unknown_error"),
      });
    }
  }, [getOrCreateSession, tier]);

  /** Reset the tutor to idle. */
  const reset = useCallback(() => {
    sessionRef.current = null;
    turnCountRef.current = 0;
    setState({ phase: "idle" });
  }, []);

  return {
    state,
    send,
    reset,
    session: sessionRef.current,
  };
}
