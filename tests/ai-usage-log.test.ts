import { beforeEach, describe, expect, it, vi } from "vitest";

const insertMock = vi.hoisted(() => vi.fn());

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: (table: string) => {
      if (table === "profiles") {
        return {
          select: () => ({
            eq: () => ({
              single: async () => ({ data: { native_language: "vi" }, error: null }),
            }),
          }),
        };
      }
      if (table === "ai_usage_logs") {
        return { insert: insertMock };
      }
      throw new Error(`Unexpected table: ${table}`);
    },
  })),
}));

import { logMercyAiUsage } from "../api/_lib/aiUsageLog";
import type { PagesContext } from "../src/pages-functions/http";

describe("logMercyAiUsage", () => {
  beforeEach(() => {
    insertMock.mockReset();
  });

  it("retries without language_pair when prod schema rejects the optional column", async () => {
    insertMock
      .mockResolvedValueOnce({
        error: {
          code: "PGRST204",
          message: "Could not find the 'language_pair' column of 'ai_usage_logs'",
        },
      })
      .mockResolvedValueOnce({ error: null });

    const waitUntilTasks: Array<Promise<unknown>> = [];
    const context = {
      env: {
        SUPABASE_URL: "https://supabase.test",
        SUPABASE_SERVICE_ROLE_KEY: "service-role",
      },
      waitUntil: (promise: Promise<unknown>) => {
        waitUntilTasks.push(promise);
      },
    } as unknown as PagesContext & { waitUntil: (promise: Promise<unknown>) => void };

    logMercyAiUsage(context, {
      userId: "123e4567-e89b-12d3-a456-426614174000",
      feature: "mercy-ai:sentence-correction",
      model: "gpt-4o-mini",
      inputTokens: 100,
      outputTokens: 25,
    });
    await Promise.all(waitUntilTasks);

    expect(insertMock).toHaveBeenCalledTimes(2);
    expect(insertMock.mock.calls[0][0]).toMatchObject({
      user_id: "123e4567-e89b-12d3-a456-426614174000",
      feature: "mercy-ai:sentence-correction",
      language_pair: "vi-en",
    });
    expect(insertMock.mock.calls[1][0]).toMatchObject({
      user_id: "123e4567-e89b-12d3-a456-426614174000",
      feature: "mercy-ai:sentence-correction",
      meta: { languagePair: "vi-en" },
    });
    expect(insertMock.mock.calls[1][0]).not.toHaveProperty("language_pair");
  });

  it("prices DeepSeek speak follow-up usage and tags provider metadata", async () => {
    insertMock.mockResolvedValueOnce({ error: null });

    const waitUntilTasks: Array<Promise<unknown>> = [];
    const context = {
      env: {
        SUPABASE_URL: "https://supabase.test",
        SUPABASE_SERVICE_ROLE_KEY: "service-role",
        USD_TO_VND: "26000",
      },
      waitUntil: (promise: Promise<unknown>) => {
        waitUntilTasks.push(promise);
      },
    } as unknown as PagesContext & { waitUntil: (promise: Promise<unknown>) => void };

    logMercyAiUsage(context, {
      userId: "123e4567-e89b-12d3-a456-426614174000",
      feature: "mercy-ai:speak-follow-up",
      provider: "deepseek",
      model: "deepseek-chat",
      inputTokens: 1000,
      outputTokens: 500,
    });
    await Promise.all(waitUntilTasks);

    expect(insertMock).toHaveBeenCalledOnce();
    expect(insertMock.mock.calls[0][0]).toMatchObject({
      feature: "mercy-ai:speak-follow-up",
      model: "deepseek-chat",
      input_tokens: 1000,
      output_tokens: 500,
      estimated_cost_vnd: 7.28,
      meta: {
        provider: "deepseek",
        pricingSource: "https://api-docs.deepseek.com/quick_start/pricing/",
        languagePair: "vi-en",
      },
    });
  });
});
