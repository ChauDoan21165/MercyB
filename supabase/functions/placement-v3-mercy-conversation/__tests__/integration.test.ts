import { describe, expect, it } from "vitest";
import { handleRequest } from "../core";
import { gradeConversation } from "../conversationGrader";
import { transcriptFixtures } from "./fixtures/sampleTranscripts";
import type { Deps } from "../types";

function deps(): Deps {
  return {
    getUserFromAuthHeader: async () => ({ id: "u1" }),
    callAi: async () => ({ ok: false, json: {}, raw: "" }),
    now: () => new Date("2026-05-20T00:00:00.000Z"),
    makeSessionId: () => "s1",
  };
}

function req(body: unknown) {
  return new Request("https://x.functions.supabase.co/placement-v3-mercy-conversation", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer t" },
    body: JSON.stringify(body),
  });
}

describe("integration", () => {
  it("full A1 conversation grades low", () => {
    const assessment = gradeConversation(transcriptFixtures.find((f) => f.id === "a1-survival")!.transcript);
    expect(["A1", "A2"]).toContain(assessment.cefr);
  });

  it("full C1 conversation grades high", () => {
    const assessment = gradeConversation(transcriptFixtures.find((f) => f.id === "c1-argument")!.transcript);
    expect(["B2", "C1", "C2"]).toContain(assessment.cefr);
  });

  it("conversation interrupted mid-way remains gradable", () => {
    const partial = transcriptFixtures.find((f) => f.id === "b1-everyday-narrative")!.transcript.slice(0, 6);
    const assessment = gradeConversation(partial);
    expect(assessment.confidence).toBeGreaterThan(0);
    expect(assessment.trajectory.pattern).toBeTruthy();
  });

  it("user responds in wrong language consistently is flagged and handled", () => {
    const assessment = gradeConversation(transcriptFixtures.find((f) => f.id === "wrong-language-repair")!.transcript);
    expect(assessment.interaction.codeSwitchTurns).toBeGreaterThan(0);
    expect(assessment.recommendedFocus.join(" ")).toMatch(/comprehension|grammar|fluency/);
  });

  it("abusive input gets warm redirect through handler", async () => {
    const startRes = await handleRequest(req({ action: "start" }), deps());
    const start = await startRes.json();
    const turnRes = await handleRequest(req({ action: "turn", state: start.state, text: "fuck you stupid" }), deps());
    const turn = await turnRes.json();
    expect(turn.userSignal.safety_flag).toBe("abusive");
    expect(turn.mercyTurn.text).not.toMatch(/fuck|stupid/i);
  });

  it("start action returns opening state", async () => {
    const res = await handleRequest(req({ action: "start", learnerName: "Minh" }), deps());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.state.history[0].speaker).toBe("mercy");
  });

  it("grade action accepts transcript directly", async () => {
    const res = await handleRequest(req({ action: "grade", transcript: transcriptFixtures[0].transcript }), deps());
    const body = await res.json();
    expect(body.assessment.cefr).toBeTruthy();
  });
});
