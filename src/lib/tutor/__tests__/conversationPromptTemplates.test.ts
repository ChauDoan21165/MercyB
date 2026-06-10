import { describe, expect, it } from "vitest";
import {
  buildConversationPromptGrounding,
  buildConversationPromptTemplate,
} from "@/lib/tutor/conversationPromptTemplates";
import { speakTopics as foodOrderingTopics } from "@/lib/tutor/speakTopics/foodOrdering";
import { speakTopics as nailTechnicianTopics } from "@/lib/tutor/speakTopics/nailTechnicianEnglish";

describe("conversationPromptTemplates", () => {
  it("grounds a core Speak topic with Step 8 persistence and Vietnamese-first correction style", () => {
    const topic = foodOrderingTopics[0];
    const template = buildConversationPromptTemplate({
      topic,
      turnCount: 2,
      learnerText: "I want two coffee less ice.",
      recentAiTurns: ["Bạn muốn size nào? / What size would you like?"],
    });

    expect(template.grounding.topicId).toBe("topic-food-ordering-cafe-coffee");
    expect(template.systemPrompt).toContain("Gọi cà phê ở quán / Ordering Coffee At A Café");
    expect(template.systemPrompt).toContain("Stay on this selected topic for 4+ learner turns");
    expect(template.systemPrompt).toContain("I want two coffee less ice.");
    expect(template.systemPrompt).toContain("avoid repeating");
    expect(template.correctionStylePrompt).toContain("Vietnamese first, English second");
    expect(template.correctionStylePrompt).toContain("Never invent pronunciation scores");
    expect(template.topicGroundingPrompt).toContain("Ice and sweetness the natural way");
    expect(template.topicGroundingPrompt).toContain("Two coffees");
  });

  it("includes professional scenario role, directions, seed inputs, warmth, and VN interference notes", () => {
    const topic = nailTechnicianTopics[0];
    const template = buildConversationPromptTemplate({
      topic,
      turnCount: 5,
      learnerText: "Client wants almond shape but nail is sensitive.",
    });

    expect(template.grounding.scenarioDescription).toContain("nail technician greeting a client");
    expect(template.grounding.aiRoleDefinition).toContain("Act as a salon client");
    expect(template.topicGroundingPrompt).toContain("Ask whether the client wants a manicure");
    expect(template.topicGroundingPrompt).toContain("What shape and length would you like");
    expect(template.correctionStylePrompt).toContain("Let me take a look and we can choose together");
    expect(template.topicGroundingPrompt).toContain("Shape and length order");
    expect(template.topicGroundingPrompt).toContain("Sensitive, sore, and allergic");
    expect(template.systemPrompt).toContain("respond to the learner's actual words");
    expect(template.systemPrompt).toContain("Include at most one correction and one follow-up question");
  });

  it("falls back safely when richer prompt fields are absent", () => {
    const topic = foodOrderingTopics[1];
    const grounding = buildConversationPromptGrounding(topic);
    const template = buildConversationPromptTemplate({ topic });

    expect(grounding.scenarioDescription).toBeNull();
    expect(grounding.aiRoleDefinition).toBeNull();
    expect(grounding.conversationDirections.join(" ")).toContain("Ask one natural follow-up");
    expect(grounding.warmthPatterns.join(" ")).toContain("face-saving Vietnamese-first coaching");
    expect(template.systemPrompt).toContain("(none yet; open with the scenario seed)");
    expect(template.correctionStylePrompt).toContain("always continue the scenario");
  });
});

// Step 11: locks the live Vietlish seeding selector that injects corpus
// corrections into the conversation system prompt. Without these, a regression
// in selectVietlishPromptExamples (limit, dedupe, learner-match boost) would
// silently stop feeding the right corrections to the live tutor.
describe("conversationPromptTemplates Vietlish seeding selector", () => {
  function vietlishExampleLines(prompt: string): string[] {
    return prompt
      .split("\n")
      .filter((line) => line.includes("Vietlish:") && line.includes("Natural English:"));
  }

  it("seeds the matching corpus correction when the learner types a literal Vietlish phrase", () => {
    const topic = foodOrderingTopics[0];
    const template = buildConversationPromptTemplate({
      topic,
      turnCount: 1,
      learnerText: "Please open the light, it is dark here.",
    });

    const lines = vietlishExampleLines(template.topicGroundingPrompt);
    // The literal learner phrase must surface its correction, and rank first
    // (learner-match boost), so the live tutor is grounded on the exact repair.
    expect(lines[0]).toContain('Vietlish: "open the light"');
    expect(lines[0]).toContain('Natural English: "turn on the light"');
  });

  it("caps injected Vietlish examples and never repeats one", () => {
    const topic = foodOrderingTopics[0];
    const template = buildConversationPromptTemplate({
      topic,
      turnCount: 1,
      learnerText: "Please open the light, it is dark here.",
    });

    const lines = vietlishExampleLines(template.topicGroundingPrompt);
    expect(lines.length).toBeGreaterThan(0);
    expect(lines.length).toBeLessThanOrEqual(5);
    expect(new Set(lines).size).toBe(lines.length);
  });

  it("still seeds frequency-ranked examples when the learner has not spoken yet", () => {
    const topic = foodOrderingTopics[0];
    const template = buildConversationPromptTemplate({ topic, turnCount: 0 });

    const lines = vietlishExampleLines(template.topicGroundingPrompt);
    expect(lines.length).toBeGreaterThan(0);
    expect(lines.length).toBeLessThanOrEqual(5);
    // No learner text means high-frequency entries lead the seeding.
    expect(lines[0]).toContain("high;");
  });
});
