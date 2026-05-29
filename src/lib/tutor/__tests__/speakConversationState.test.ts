import { describe, expect, it } from "vitest";
import {
  createSpeakConversationState,
  selectSpeakConversationReply,
  type SpeakConversationState,
} from "@/lib/tutor/speakConversationState";

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
});
