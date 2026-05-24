import { describe, expect, it } from "vitest";
import { getSpeakableText, getVoiceSourceLabel } from "../voiceEngine";

describe("Teacher Mercy voice engine", () => {
  it("reads Mercy correction and next question without raw learner input", () => {
    const text = getSpeakableText({
      role: "mercy",
      text: "Good. Mercy will keep it simple.",
      correction: "Je suis allé au marché.",
      reply: "Très bien.",
      nextQuestion: "Qu'est-ce que tu fais après ça ?",
    });

    expect(text).toContain("Je suis allé au marché.");
    expect(text).toContain("Qu'est-ce que tu fais après ça ?");
    expect(text).not.toContain("Je suis aller au marché");
  });

  it("never speaks user turns", () => {
    expect(getSpeakableText({ role: "user", text: "I buy a hat yesterday." })).toBe("");
  });

  it("exposes safe voice source labels", () => {
    expect(getVoiceSourceLabel("cloud")).toBe("Mercy voice");
    expect(getVoiceSourceLabel("device")).toBe("Device voice fallback");
    expect(getVoiceSourceLabel("idle")).toBeNull();
  });
});
