import { describe, expect, it } from "vitest";

import {
  buildOpenAiRealtimeClientSecretRequest,
  extractEphemeralClientSecret,
} from "../index.ts";

describe("openai-realtime-session helpers", () => {
  it("builds a short-lived realtime client secret request without secrets", () => {
    const body = buildOpenAiRealtimeClientSecretRequest({
      mode: "journey",
      targetLanguage: "fr",
      explainLanguage: "vi",
    });

    expect(body).toMatchObject({
      expires_after: { anchor: "created_at", seconds: 600 },
      session: {
        type: "realtime",
        model: "gpt-realtime",
        audio: { output: { voice: "marin" } },
      },
    });
    expect(JSON.stringify(body)).not.toMatch(/OPENAI_API_KEY|sk-|secret/i);
  });

  it("extracts only the ephemeral client secret fields returned to the browser", () => {
    expect(extractEphemeralClientSecret({
      client_secret: { value: "ek_test_ephemeral", expires_at: 123 },
      session: { model: "gpt-realtime", audio: { output: { voice: "marin" } } },
    })).toEqual({
      clientSecret: "ek_test_ephemeral",
      expiresAt: 123,
      model: "gpt-realtime",
      voice: "marin",
    });
  });
});
