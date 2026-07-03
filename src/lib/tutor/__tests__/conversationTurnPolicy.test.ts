import { describe, expect, it } from "vitest";
import {
  RECENT_QUESTION_WINDOW,
  TOPIC_MIN_TURNS,
  decideConversationTurnPolicy,
} from "@/lib/tutor/conversationTurnPolicy";

describe("conversationTurnPolicy — topic persistence (Step 8)", () => {
  it("persists and deepens the current topic before the depth cap", () => {
    const d = decideConversationTurnPolicy({
      learnerText: "My manager gave me a new task today.",
      currentTopicId: "work",
      turnsOnTopic: 1,
    });
    expect(d.action).toBe("persist_topic");
    expect(d.topicId).toBe("work");
    expect(d.turnsOnTopic).toBe(2); // carries the incremented on-topic count forward
    expect(d.promptInstruction).toMatch(/stay on the current topic/i);
  });

  it("does not pivot prematurely within the first 4 topic turns", () => {
    for (let turnsOnTopic = 0; turnsOnTopic < TOPIC_MIN_TURNS; turnsOnTopic++) {
      const d = decideConversationTurnPolicy({
        learnerText: "My manager gave me a new task today.",
        currentTopicId: "work",
        turnsOnTopic,
      });
      expect(d.action).toBe("persist_topic");
    }
  });

  it("OFFERS (never forces) to move on once the topic depth cap is reached", () => {
    const d = decideConversationTurnPolicy({
      learnerText: "My manager gave me a new task today.",
      currentTopicId: "work",
      turnsOnTopic: TOPIC_MIN_TURNS,
    });
    expect(d.action).toBe("offer_move_on");
    expect(d.promptInstruction).toMatch(/offer to move on/i);
    expect(d.promptInstruction).toMatch(/never force/i); // never force, keep the door open
  });
});

describe("conversationTurnPolicy — learner-input pivoting (Step 9)", () => {
  it("pivots on a clearly new topic the learner introduced and resets the topic turn count", () => {
    const d = decideConversationTurnPolicy({
      learnerText: "Last night I cooked dinner with my family at home.",
      currentTopicId: "work",
      turnsOnTopic: 2,
    });
    expect(d.action).toBe("pivot_on_learner");
    expect(d.topicId).toBe("dinner");
    expect(d.turnsOnTopic).toBe(0); // new topic starts a fresh count
    expect(d.promptInstruction).toMatch(/pivot to what the learner just introduced/i);
  });

  it("pivots on the learner's new topic even after the current topic reaches the depth cap", () => {
    const d = decideConversationTurnPolicy({
      learnerText: "Tomorrow I need to take the bus to work.",
      currentTopicId: "dinner",
      turnsOnTopic: TOPIC_MIN_TURNS,
    });
    expect(d.action).toBe("pivot_on_learner");
    expect(d.topicId).toBe("commute");
    expect(d.reason).toBe("pivot_on_learner_input");
    expect(d.promptInstruction).toMatch(/follow their own words/i);
    expect(d.promptInstruction).not.toMatch(/offer to move on/i);
  });
});

describe("conversationTurnPolicy — safe redirects (trust floor, never dead-end)", () => {
  it("redirects gently on abstention instead of guessing or dead-ending", () => {
    const d = decideConversationTurnPolicy({
      learnerText: "My manager gave me a new task today.",
      currentTopicId: "work",
      turnsOnTopic: 1,
      abstain: true,
    });
    expect(d.action).toBe("redirect_off_topic");
    expect(d.reason).toBe("abstain_redirect_no_dead_end");
    expect(d.promptInstruction).toMatch(/never dead-end/i);
    expect(d.promptInstruction).toMatch(/never guess/i);
  });

  it("lets abstention override an otherwise clear new-topic pivot", () => {
    const d = decideConversationTurnPolicy({
      learnerText: "Last night I cooked dinner with my family at home.",
      currentTopicId: "work",
      turnsOnTopic: 2,
      abstain: true,
    });
    expect(d.action).toBe("redirect_off_topic");
    expect(d.reason).toBe("abstain_redirect_no_dead_end");
    expect(d.topicId).toBe("dinner");
    expect(d.promptInstruction).toMatch(/confidence is low/i);
    expect(d.promptInstruction).toMatch(/never guess/i);
  });

  it("redirects an unclear/too-short turn without leaving the scenario", () => {
    const d = decideConversationTurnPolicy({
      learnerText: "Yes.",
      currentTopicId: "work",
      turnsOnTopic: 1,
    });
    expect(d.action).toBe("redirect_off_topic");
    expect(d.promptInstruction).toMatch(/redirect gently into engaging practice/i);
  });
});

describe("conversationTurnPolicy — anti-repetition", () => {
  it("appends a do-not-repeat guard listing recent questions", () => {
    const recentQuestions = ["What is your first task at work?", "Who do you work with?"];
    const d = decideConversationTurnPolicy({
      learnerText: "My manager gave me a new task today.",
      currentTopicId: "work",
      turnsOnTopic: 1,
      recentQuestions,
    });
    expect(d.promptInstruction).toMatch(/avoid repetition/i);
    expect(d.promptInstruction).toContain("What is your first task at work?");
  });

  it("flags repetitionRisk when the suggested intent echoes a recent question", () => {
    // The work clear-answer suggests the intent "deepen-work"; if that exact string was already
    // asked, the policy must flag the repetition so the orchestrator picks a different question.
    const d = decideConversationTurnPolicy({
      learnerText: "My manager gave me a new task today.",
      currentTopicId: "work",
      turnsOnTopic: 1,
      recentQuestions: ["deepen-work"],
    });
    expect(d.repetitionRisk).toBe(true);
  });

  it("caps the recent-question guard at RECENT_QUESTION_WINDOW entries", () => {
    const many = Array.from({ length: RECENT_QUESTION_WINDOW + 5 }, (_, i) => `Question ${i}?`);
    const d = decideConversationTurnPolicy({
      learnerText: "My manager gave me a new task today.",
      currentTopicId: "work",
      turnsOnTopic: 1,
      recentQuestions: many,
    });
    // Oldest questions are dropped from the guard; the most recent ones are kept.
    expect(d.promptInstruction).toContain(`Question ${RECENT_QUESTION_WINDOW + 4}?`);
    expect(d.promptInstruction).not.toContain("Question 0?");
  });

  it("sanitizes recent questions before placing them in quoted prompt guard lists", () => {
    const d = decideConversationTurnPolicy({
      learnerText: "My manager gave me a new task today.",
      currentTopicId: "work",
      turnsOnTopic: 1,
      recentQuestions: ['What does "deadline" mean?; Please explain.'],
    });

    expect(d.promptInstruction).toContain('"What does \'deadline\' mean?, Please explain."');
    expect(d.promptInstruction).not.toContain('"deadline"');
  });
});

describe("conversationTurnPolicy — prompt-ready output", () => {
  it("always returns a non-empty prompt instruction for the orchestrator", () => {
    const samples = ["Yes.", "I had a meeting this morning.", "I feel tired today honestly.", "I don't know."];
    for (const learnerText of samples) {
      const d = decideConversationTurnPolicy({ learnerText, currentTopicId: "work", turnsOnTopic: 1 });
      expect(typeof d.promptInstruction).toBe("string");
      expect(d.promptInstruction.trim().length).toBeGreaterThan(0);
    }
  });
});
