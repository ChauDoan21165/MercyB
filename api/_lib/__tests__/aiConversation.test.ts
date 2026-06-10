import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildAiConversationSystemPrompt,
  buildAiConversationTurn,
  buildAiConversationUserPrompt,
} from "../aiConversation";

const originalFetch = global.fetch;
const originalOpenAiKey = process.env.OPENAI_API_KEY;

describe("AI conversation prompt template", () => {
  beforeEach(() => {
    process.env.OPENAI_API_KEY = "test-key";
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.OPENAI_API_KEY = originalOpenAiKey;
    vi.restoreAllMocks();
  });

  it("injects scenario boundaries, Vietnamese L1 interference, trust floor, and pivot rules", () => {
    const system = buildAiConversationSystemPrompt();

    expect(system).toContain("Job interview practice");
    expect(system).toContain("Vietnamese-to-English interference notes");
    expect(system).toContain("Wrong correction is worse than no correction");
    expect(system).toContain("The next AI turn must reference something the learner actually said");
    expect(system).toContain("Every Mercy reply must be freshly generated");
    expect(system).toContain("Do not use canned openers");
    expect(system).toContain("Stay inside job interview practice");
    expect(system).not.toContain("specific next interview question");
  });

  it("builds a focused per-turn prompt from the learner's actual previous answer", () => {
    const prompt = buildAiConversationUserPrompt({
      scenarioId: "job-interview",
      learnerText: "I have experience about customer service.",
      history: [
        { role: "assistant", text: "Tell me about yourself." },
        { role: "learner", text: "I worked in a cafe." },
      ],
      turnCount: 1,
    });

    expect(prompt).toContain("I worked in a cafe");
    expect(prompt).toContain("I have experience about customer service");
    expect(prompt).toContain("Reference the latest learner answer directly");
  });

  it("uses GPT-4o-mini for turns and GPT-4o as the correction quality gate", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({
        choices: [{
          message: {
            content: JSON.stringify({
              reply: "You said you handle reports. What reports are you responsible for?",
              correctionCandidate: {
                original: "I responsible for",
                corrected: "I am responsible for",
                explanationVi: "Tiếng Anh cần 'am' trước responsible.",
                interferencePattern: "missing be from Vietnamese transfer",
                evidence: "The learner wrote 'I responsible for'.",
              },
            }),
          },
        }],
        usage: { prompt_tokens: 100, completion_tokens: 80, total_tokens: 180 },
      }))
      .mockResolvedValueOnce(jsonResponse({
        choices: [{ message: { content: JSON.stringify({ accept: true, reason: "clear missing be" }) } }],
        usage: { prompt_tokens: 50, completion_tokens: 10, total_tokens: 60 },
      }));
    global.fetch = fetchMock;

    const result = await buildAiConversationTurn({
      scenarioId: "job-interview",
      learnerText: "I responsible for reports.",
      history: [],
      turnCount: 3,
    });

    expect(result.reply).toContain("reports");
    expect(result.correction?.corrected).toBe("I am responsible for");
    expect(result.summary?.practiced).toContain("job interview answers");

    const turnBody = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    const gateBody = JSON.parse(String(fetchMock.mock.calls[1][1]?.body));
    expect(turnBody.model).toBe("gpt-4o-mini");
    expect(gateBody.model).toBe("gpt-4o");
  });

  it("abstains from correction when the GPT-4o trust gate is unsure", async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce(jsonResponse({
        choices: [{
          message: {
            content: JSON.stringify({
              reply: "You mentioned teamwork. Can you give one example from your last job?",
              correctionCandidate: {
                original: "team work",
                corrected: "teamwork",
                explanationVi: "Có thể viết liền là teamwork.",
                interferencePattern: "possible spacing transfer",
                evidence: "Style-only spacing issue.",
              },
            }),
          },
        }],
        usage: { prompt_tokens: 100, completion_tokens: 80, total_tokens: 180 },
      }))
      .mockResolvedValueOnce(jsonResponse({
        choices: [{ message: { content: JSON.stringify({ accept: false, reason: "style-only uncertainty" }) } }],
        usage: { prompt_tokens: 50, completion_tokens: 10, total_tokens: 60 },
      }));

    const result = await buildAiConversationTurn({
      scenarioId: "job-interview",
      learnerText: "I like team work.",
      history: [],
      turnCount: 0,
    });

    expect(result.correction).toBeNull();
    expect(result.reply).toContain("teamwork");
  });

  it("rejects empty OpenAI turn output instead of using a canned Mercy fallback", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(jsonResponse({
      choices: [{
        message: {
          content: JSON.stringify({
            reply: "   ",
            correctionCandidate: null,
          }),
        },
      }],
      usage: { prompt_tokens: 50, completion_tokens: 4, total_tokens: 54 },
    }));
    global.fetch = fetchMock;

    await expect(buildAiConversationTurn({
      scenarioId: "job-interview",
      learnerText: "I worked in a cafe.",
      history: [],
      turnCount: 0,
    })).rejects.toThrow("OpenAI response missing generated Mercy reply");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("rejects the old canned opener/template phrase from the Mercy speech path", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce(jsonResponse({
      choices: [{
        message: {
          content: JSON.stringify({
            reply:
              "I hear that you said \"I worked in a cafe.\" Let's keep it practical: what is one strength you would bring to this role?",
            correctionCandidate: null,
          }),
        },
      }],
      usage: { prompt_tokens: 50, completion_tokens: 24, total_tokens: 74 },
    }));

    await expect(buildAiConversationTurn({
      scenarioId: "job-interview",
      learnerText: "I worked in a cafe.",
      history: [],
      turnCount: 0,
    })).rejects.toThrow("OpenAI response used canned Mercy reply");
  });

  it("rejects a request past the 50-turn cap before calling OpenAI", async () => {
    const fetchMock = vi.fn();
    global.fetch = fetchMock;

    await expect(buildAiConversationTurn({
      scenarioId: "job-interview",
      learnerText: "I can start next week.",
      history: [],
      turnCount: 50,
    })).rejects.toThrow("Session turn cap reached");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

function jsonResponse(body: unknown): Response {
  return {
    ok: true,
    status: 200,
    json: async () => body,
  } as Response;
}
