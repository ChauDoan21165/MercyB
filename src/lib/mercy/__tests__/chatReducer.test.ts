// src/lib/mercy/__tests__/chatReducer.test.ts
//
// Unit tests for the unified-chat state reducer. Verifies that learner
// messages flow into the stream, that Mercy responses append cleanly,
// that inline panel state is driven by the intent classifier, and that
// the classic-mode toggle does not corrupt the message history.

import { describe, expect, it } from "vitest";

import {
  type ChatAction,
  type ChatMessage,
  chatReducer,
  inlineModeForIntent,
  initialChatState,
} from "../chatReducer";
import type { IntentResult } from "../intentDetection";

const learner = (text: string, ms = 0): ChatMessage => ({
  id: `l-${ms}`,
  role: "learner",
  text,
  language: "en",
  createdAt: ms,
});

const mercy = (text: string, ms = 0): ChatMessage => ({
  id: `m-${ms}`,
  role: "mercy",
  text,
  language: "en",
  createdAt: ms,
});

const intent = (over: Partial<IntentResult> = {}): IntentResult => ({
  intent: "chat",
  confidence: 0,
  target: "",
  language: "en",
  ...over,
});

describe("chatReducer — draft", () => {
  it("draftChanged updates the draft text", () => {
    const next = chatReducer(initialChatState, {
      type: "draftChanged",
      value: "How do I say rural?",
    });
    expect(next.draft).toBe("How do I say rural?");
  });

  it("learnerSubmitted clears the draft", () => {
    const seeded = { ...initialChatState, draft: "in flight" };
    const next = chatReducer(seeded, {
      type: "learnerSubmitted",
      message: learner("hi"),
      intent: intent(),
    });
    expect(next.draft).toBe("");
  });
});

describe("chatReducer — message stream", () => {
  it("learnerSubmitted appends to messages", () => {
    const next = chatReducer(initialChatState, {
      type: "learnerSubmitted",
      message: learner("first"),
      intent: intent(),
    });
    expect(next.messages).toHaveLength(1);
    expect(next.messages[0].text).toBe("first");
  });

  it("learnerSubmitted stamps the intent on the saved message", () => {
    const next = chatReducer(initialChatState, {
      type: "learnerSubmitted",
      message: learner("How do I say rural?"),
      intent: intent({
        intent: "pronunciation",
        confidence: 0.75,
        target: "rural",
      }),
    });
    expect(next.messages[0].intent).toBe("pronunciation");
  });

  it("mercyResponded appends after the learner turn", () => {
    const a = chatReducer(initialChatState, {
      type: "learnerSubmitted",
      message: learner("hi"),
      intent: intent(),
    });
    const b = chatReducer(a, {
      type: "mercyResponded",
      message: mercy("Hello!"),
    });
    expect(b.messages.map((m) => m.role)).toEqual(["learner", "mercy"]);
  });

  it("preserves history across many turns", () => {
    let state = initialChatState;
    for (let i = 0; i < 5; i += 1) {
      state = chatReducer(state, {
        type: "learnerSubmitted",
        message: learner(`l${i}`, i),
        intent: intent(),
      });
      state = chatReducer(state, {
        type: "mercyResponded",
        message: mercy(`m${i}`, i),
      });
    }
    expect(state.messages).toHaveLength(10);
  });
});

describe("chatReducer — inline mode", () => {
  it("opens the pronunciation panel on a high-confidence pronunciation intent", () => {
    const next = chatReducer(initialChatState, {
      type: "learnerSubmitted",
      message: learner("How do I say rural?"),
      intent: intent({
        intent: "pronunciation",
        confidence: 0.75,
        target: "rural",
      }),
    });
    expect(next.inline).toEqual({ kind: "pronunciation", target: "rural" });
  });

  it("opens the grammar panel on a grammar_check intent", () => {
    const next = chatReducer(initialChatState, {
      type: "learnerSubmitted",
      message: learner("Fix this: I goes home"),
      intent: intent({
        intent: "grammar_check",
        confidence: 0.75,
        target: "I goes home",
      }),
    });
    expect(next.inline).toEqual({
      kind: "grammar",
      target: "I goes home",
    });
  });

  it("falls back to plain chat below confidence 0.6", () => {
    const next = chatReducer(initialChatState, {
      type: "learnerSubmitted",
      message: learner("hmm"),
      intent: intent({
        intent: "pronunciation",
        confidence: 0.4,
        target: "",
      }),
    });
    expect(next.inline).toEqual({ kind: "none" });
  });

  it("inlineDismissed closes the inline panel without touching messages", () => {
    const opened = chatReducer(initialChatState, {
      type: "learnerSubmitted",
      message: learner("How do I say rural?"),
      intent: intent({
        intent: "pronunciation",
        confidence: 0.75,
        target: "rural",
      }),
    });
    const closed = chatReducer(opened, { type: "inlineDismissed" });
    expect(closed.inline).toEqual({ kind: "none" });
    expect(closed.messages).toHaveLength(1);
  });

  it("opens the encouragement bubble on a learner stuck-cue", () => {
    const next = chatReducer(initialChatState, {
      type: "learnerSubmitted",
      message: learner("Khó quá em ơi"),
      intent: intent({
        intent: "encouragement",
        confidence: 0.6,
        target: "",
        language: "vi",
      }),
    });
    expect(next.inline.kind).toBe("encouragement");
  });

  it("opens the lesson panel on a lesson_request", () => {
    const next = chatReducer(initialChatState, {
      type: "learnerSubmitted",
      message: learner("Teach me past perfect"),
      intent: intent({
        intent: "lesson_request",
        confidence: 0.75,
        target: "past perfect",
      }),
    });
    expect(next.inline).toEqual({ kind: "lesson", topic: "past perfect" });
  });
});

describe("inlineModeForIntent — direct", () => {
  it("returns { kind: 'none' } for chat default", () => {
    expect(inlineModeForIntent(intent())).toEqual({ kind: "none" });
  });

  it("returns 'none' even for high-confidence chat", () => {
    expect(inlineModeForIntent(intent({ confidence: 0.95 }))).toEqual({
      kind: "none",
    });
  });
});

describe("chatReducer — classic toggle", () => {
  it("classicRequested true persists in state", () => {
    const next = chatReducer(initialChatState, {
      type: "classicRequested",
      value: true,
    });
    expect(next.classicRequested).toBe(true);
  });

  it("classicRequested does not erase messages", () => {
    const seeded = chatReducer(initialChatState, {
      type: "learnerSubmitted",
      message: learner("hi"),
      intent: intent(),
    });
    const toggled = chatReducer(seeded, {
      type: "classicRequested",
      value: true,
    });
    expect(toggled.messages).toHaveLength(1);
    expect(toggled.classicRequested).toBe(true);
  });

  it("classicRequested can be reverted", () => {
    const seeded = chatReducer(initialChatState, {
      type: "classicRequested",
      value: true,
    });
    const reverted = chatReducer(seeded, {
      type: "classicRequested",
      value: false,
    });
    expect(reverted.classicRequested).toBe(false);
  });
});

describe("chatReducer — reset + safety", () => {
  it("reset returns the initial state regardless of prior history", () => {
    let state = initialChatState;
    for (let i = 0; i < 4; i += 1) {
      state = chatReducer(state, {
        type: "learnerSubmitted",
        message: learner(`x${i}`, i),
        intent: intent(),
      });
    }
    expect(chatReducer(state, { type: "reset" })).toEqual(initialChatState);
  });

  it("ignores unknown action shapes (forward-compat)", () => {
    // @ts-expect-error testing exhaustiveness
    const next = chatReducer(initialChatState, { type: "noSuchAction" } as ChatAction);
    expect(next).toEqual(initialChatState);
  });

  it("does not mutate the previous state", () => {
    const prev = initialChatState;
    chatReducer(prev, {
      type: "learnerSubmitted",
      message: learner("hi"),
      intent: intent(),
    });
    expect(prev.messages).toHaveLength(0);
  });
});
