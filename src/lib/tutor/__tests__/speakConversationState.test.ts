import { describe, expect, it } from "vitest";
import {
  createSpeakConversationState,
  selectSpeakConversationReply,
  type SpeakConversationState,
} from "@/lib/tutor/speakConversationState";
import { SPEAK_FOLLOW_UP_PIVOT } from "@/lib/tutor/speakFollowups";

function next(text: string, state: SpeakConversationState) {
  return selectSpeakConversationReply(text, state);
}

describe("speakConversationState", () => {
  it("moves through morning, work, lunch, and evening/dinner without falling back to morning", () => {
    let state = createSpeakConversationState();

    let reply = next("I have my coffee and check my email.", state);
    state = reply.state;
    expect(`${reply.naturalReply} ${reply.nextQuestion}`).toMatch(/coffee|email/i);
    expect(state.currentTopic).toBe("work");

    reply = next("Then I go to work.", state);
    state = reply.state;
    expect(`${reply.naturalReply} ${reply.nextQuestion}`).toMatch(/work|arrive|task/i);
    expect(state.currentTopic).toBe("work");

    reply = next("I go to the office and start my tasks.", state);
    state = reply.state;
    expect(`${reply.naturalReply} ${reply.nextQuestion}`).toMatch(/office|task/i);
    expect(state.currentTopic).toBe("office");

    reply = next("At lunch I eat with my colleagues.", state);
    state = reply.state;
    expect(`${reply.naturalReply} ${reply.nextQuestion}`).toMatch(/lunch|colleagues/i);
    expect(state.currentTopic).toBe("lunch");

    reply = next("In the evening I go home and have dinner.", state);
    expect(`${reply.naturalReply} ${reply.nextQuestion}`).toMatch(/evening|dinner|home/i);
    expect(`${reply.naturalReply} ${reply.nextQuestion}`).not.toMatch(/morning/i);
    expect(reply.state.currentTopic).toBe("dinner");
  });

  it("never gives a morning-routine reply for evening and dinner input", () => {
    const reply = next("In the evening I go home and have dinner.", {
      ...createSpeakConversationState(),
      currentTopic: "morning",
      recentTopics: ["morning", "work", "office", "lunch"],
      turnCount: 4,
    });

    expect(`${reply.naturalReply} ${reply.nextQuestion}`).toMatch(/evening|dinner|home/i);
    expect(`${reply.naturalReply} ${reply.nextQuestion}`).not.toMatch(/morning routine|after coffee|morning/i);
    expect(reply.state.currentTopic).toBe("dinner");
  });

  it("avoids repeated fallback replies across consecutive turns", () => {
    let state = createSpeakConversationState();
    const first = next("I do something.", state);
    state = first.state;
    const second = next("I do something.", state);

    expect(second.naturalReply).not.toBe(first.naturalReply);
    expect(second.nextQuestion).not.toBe(first.nextQuestion);
  });

  it("uses the latest topic as the strongest signal over old context", () => {
    const reply = next("At lunch I eat with my colleagues.", {
      ...createSpeakConversationState(),
      currentTopic: "morning",
      lastUserIntent: "morning-routine",
      recentTopics: ["morning", "work", "office"],
      turnCount: 3,
    });

    expect(reply.state.currentTopic).toBe("lunch");
    expect(`${reply.naturalReply} ${reply.nextQuestion}`).toMatch(/lunch|colleagues/i);
    expect(`${reply.naturalReply} ${reply.nextQuestion}`).not.toMatch(/morning/i);
  });

  it("asks a clarification for unclear ASR instead of forcing a fluent work response", () => {
    const reply = next("I go to office and up today.", createSpeakConversationState());

    expect(reply.replyType).toBe("clarification");
    expect(`${reply.naturalReply} ${reply.nextQuestion}`).toMatch(/unclear|say that last part|office/i);
    expect(`${reply.naturalReply} ${reply.nextQuestion}`).not.toMatch(/first task|workday/i);
  });

  it("keeps a dinner topic for four turns before pivoting", () => {
    let state = createSpeakConversationState();
    const replies = [
      "I eat dinner at home.",
      "It is usually simple.",
      "I cook rice and vegetables.",
      "The dinner is at seven.",
    ].map((text) => {
      const reply = next(text, state);
      state = reply.state;
      return reply;
    });

    expect(replies.map((reply) => reply.state.currentTopic)).toEqual(["dinner", "dinner", "dinner", "dinner"]);
    expect(state.turnCountOnTopic).toBe(4);
    expect(state.shouldPivot).toBe(false);
    expect(`${replies[3].naturalReply} ${replies[3].nextQuestion}`).toMatch(/dinner|cook|home|time|eat/i);
  });

  it("keeps a family topic for four turns before pivoting", () => {
    let state = createSpeakConversationState();
    const replies = [
      "I talk with my family.",
      "We are at home.",
      "My children tell me stories.",
      "My parents visit on Sunday.",
    ].map((text) => {
      const reply = next(text, state);
      state = reply.state;
      return reply;
    });

    expect(replies.map((reply) => reply.state.currentTopic)).toEqual(["family", "family", "family", "family"]);
    expect(state.turnCountOnTopic).toBe(4);
    expect(state.shouldPivot).toBe(false);
    expect(`${replies[3].naturalReply} ${replies[3].nextQuestion}`).toMatch(/family|home|weekend|together/i);
  });

  it("does not repeat a follow-up id inside the same topic session", () => {
    let state = createSpeakConversationState();

    ["I eat dinner at home.", "It is usually simple.", "I cook rice.", "The dinner is at seven."].forEach((text) => {
      state = next(text, state).state;
    });

    expect(new Set(state.usedFollowUpIds).size).toBe(state.usedFollowUpIds.length);
    expect(state.usedFollowUpIds).toHaveLength(4);
  });

  it("lets a new learner topic override an old starter prompt", () => {
    const reply = next("I eat dinner with my family.", {
      ...createSpeakConversationState(),
      currentTopic: "morning",
      currentTopicId: "morning",
      topicLabel: "Morning routine",
      turnCountOnTopic: 2,
      usedFollowUpIds: ["morning-routine-after"],
      lastUserIntent: "morning-routine",
      recentTopics: ["morning"],
      turnCount: 2,
    });

    expect(reply.state.currentTopic).toBe("dinner");
    expect(reply.state.currentTopicId).toBe("dinner");
    expect(reply.state.turnCountOnTopic).toBe(1);
    expect(`${reply.naturalReply} ${reply.nextQuestion}`).toMatch(/dinner|evening/i);
    expect(`${reply.naturalReply} ${reply.nextQuestion}`).not.toMatch(/morning|coffee/i);
  });

  it("offers the graceful pivot after the topic depth cap", () => {
    let state = createSpeakConversationState();
    ["I eat dinner at home.", "It is usually simple.", "I cook rice.", "The dinner is at seven."].forEach((text) => {
      state = next(text, state).state;
    });

    const reply = next("We eat at seven.", state);

    expect(reply.nextQuestion).toBe(SPEAK_FOLLOW_UP_PIVOT);
    expect(reply.state.shouldPivot).toBe(true);
    expect(reply.state.pivotReason).toBe("depth_cap");
    expect(reply.state.currentTopic).toBe("dinner");
  });

  it("asks one clarifying follow-up for an unclear answer on the current topic", () => {
    const first = next("I talk with my family.", createSpeakConversationState());
    const reply = next("and up today", first.state);

    expect(reply.replyType).toBe("clarification");
    expect(reply.state.currentTopic).toBe("family");
    expect(`${reply.naturalReply} ${reply.nextQuestion}`).toMatch(/family|repeat|unclear/i);
  });

  it("does not drift back to morning or work unless the learner topic is morning or work", () => {
    const dinnerReply = next("I eat dinner at home.", {
      ...createSpeakConversationState(),
      currentTopic: "work",
      currentTopicId: "work",
      topicLabel: "Work",
      turnCountOnTopic: 3,
      usedFollowUpIds: ["work-arrive"],
      lastUserIntent: "work",
      recentTopics: ["morning", "work"],
      turnCount: 3,
    });

    expect(dinnerReply.state.currentTopic).toBe("dinner");
    expect(`${dinnerReply.naturalReply} ${dinnerReply.nextQuestion}`).toMatch(/dinner|evening/i);
    expect(`${dinnerReply.naturalReply} ${dinnerReply.nextQuestion}`).not.toMatch(/morning|coffee|work task|arrive at work/i);
  });
});
