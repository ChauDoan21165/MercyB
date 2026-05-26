// src/lib/mercy/chatReducer.ts
//
// Pure state reducer for UnifiedMercyChat. Lives outside the component so
// it's trivial to unit-test without mounting React. Holds the message
// stream + the currently-active inline mode (pronunciation panel, grammar
// panel, encouragement bubble, plain chat). One reducer, no side effects.
//
// Why a reducer and not just useState? The chat has several simultaneous
// concerns: appending messages, reflecting an inline mode, toggling
// classic/unified, dismissing an inline panel. Encoding them as actions
// keeps the state transitions auditable and the tests honest.

import type { IntentResult, MercyIntent } from "./intentDetection";

export type ChatRole = "learner" | "mercy";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  /** Best-effort language tag for the bubble's typography hint. */
  language: "vi" | "en" | "mixed";
  /** ms since epoch — set by the caller, not by the reducer. */
  createdAt: number;
  /** Intent classification — set on learner messages. */
  intent?: MercyIntent;
};

export type InlineMode =
  | { kind: "none" }
  | { kind: "pronunciation"; target: string }
  | { kind: "grammar"; target: string }
  | { kind: "encouragement"; cue: string }
  | { kind: "lesson"; topic: string };

export type ChatState = {
  messages: ChatMessage[];
  inline: InlineMode;
  /** Pending learner-input text, used for the input field's controlled value. */
  draft: string;
  /** Whether classic multi-tab fallback is being requested. */
  classicRequested: boolean;
};

export const initialChatState: ChatState = {
  messages: [],
  inline: { kind: "none" },
  draft: "",
  classicRequested: false,
};

export type ChatAction =
  | {
      type: "draftChanged";
      value: string;
    }
  | {
      type: "learnerSubmitted";
      message: ChatMessage;
      intent: IntentResult;
    }
  | {
      type: "mercyResponded";
      message: ChatMessage;
    }
  | {
      type: "inlineDismissed";
    }
  | {
      type: "classicRequested";
      value: boolean;
    }
  | {
      type: "reset";
    };

/**
 * Map an intent classification to the inline panel that should render.
 * Confidence floor is 0.6 — below that we keep plain chat and let the
 * Mercy reply do the lifting (e.g. "did you mean to ask me to check
 * pronunciation?").
 */
export function inlineModeForIntent(intent: IntentResult): InlineMode {
  if (intent.confidence < 0.6) return { kind: "none" };
  switch (intent.intent) {
    case "pronunciation":
      return { kind: "pronunciation", target: intent.target };
    case "grammar_check":
      return { kind: "grammar", target: intent.target };
    case "lesson_request":
      return { kind: "lesson", topic: intent.target };
    case "encouragement":
      return { kind: "encouragement", cue: intent.target };
    default:
      return { kind: "none" };
  }
}

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "draftChanged":
      return { ...state, draft: action.value };

    case "learnerSubmitted": {
      const inline = inlineModeForIntent(action.intent);
      const message: ChatMessage = {
        ...action.message,
        intent: action.intent.intent,
      };
      return {
        ...state,
        messages: [...state.messages, message],
        inline,
        draft: "",
      };
    }

    case "mercyResponded":
      return {
        ...state,
        messages: [...state.messages, action.message],
      };

    case "inlineDismissed":
      return { ...state, inline: { kind: "none" } };

    case "classicRequested":
      return { ...state, classicRequested: action.value };

    case "reset":
      return initialChatState;

    default:
      return state;
  }
}
