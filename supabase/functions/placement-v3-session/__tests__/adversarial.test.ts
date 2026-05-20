import { describe, expect, it } from "vitest";
import { createHarness } from "./testHarness.ts";
import { USER_RESPONSES } from "./fixtures/mock-user-responses.ts";

async function started() {
  const h = createHarness();
  const start = await h.run({ action: "start" });
  if (!start.ok || !start.prompt) throw new Error("start failed");
  return { h, start };
}

describe("placement v3 adversarial cases", () => {
  it("rejects 100k-character response", async () => {
    const { h, start } = await started();
    const result = await h.run({
      action: "respond",
      response: {
        sessionId: start.session.id,
        taskIndex: 0,
        promptId: start.prompt.id,
        responseText: "word ".repeat(25_000),
      },
    });
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error).toBe("response_too_long");
  });

  it("rejects empty response", async () => {
    const { h, start } = await started();
    const result = await h.run({
      action: "respond",
      response: {
        sessionId: start.session.id,
        taskIndex: 0,
        promptId: start.prompt.id,
        responseText: "   ",
      },
    });
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error).toBe("empty_response");
  });

  it("rejects wrong-language response", async () => {
    const { h, start } = await started();
    const result = await h.run({
      action: "respond",
      response: {
        sessionId: start.session.id,
        taskIndex: 0,
        promptId: start.prompt.id,
        responseText: USER_RESPONSES.vietnamese,
      },
    });
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error).toBe("wrong_language");
  });

  it("accepts prompt-copy attack but stub grades it low", async () => {
    const { h, start } = await started();
    const result = await h.run({
      action: "respond",
      response: {
        sessionId: start.session.id,
        taskIndex: 0,
        promptId: start.prompt.id,
        responseText: start.prompt.promptText,
      },
    });
    expect(result.ok).toBe(true);
    const row = h.responses.get(start.session.id)?.[0];
    expect(row?.ai_assessment?.overallLevel).toBe("A1");
  });

  it("concurrent submit replay inserts one response", async () => {
    const { h, start } = await started();
    const payload = {
      action: "respond" as const,
      response: {
        sessionId: start.session.id,
        taskIndex: 0,
        promptId: start.prompt.id,
        responseText: USER_RESPONSES.medium,
      },
    };
    await h.run(payload);
    await h.run(payload);
    expect(h.responses.get(start.session.id)).toHaveLength(1);
  });
});

