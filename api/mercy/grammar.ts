// File: api/mercy/grammar.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

type GrammarBody = {
  text?: string;
  context?: string;
  mode?: string;
};

type GrammarResult = {
  ok: boolean;
  feedback?: string;
  correctedText?: string;
  error?: string;
};

function asString(value: unknown, max = 1200): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function parseBody(req: VercelRequest): GrammarBody {
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body) as GrammarBody;
    } catch {
      return {};
    }
  }

  if (req.body && typeof req.body === "object") {
    return req.body as GrammarBody;
  }

  return {};
}

function sendJson(res: VercelResponse, status: number, payload: GrammarResult): void {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(status).json(payload);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, {
      ok: false,
      error: "Method not allowed",
    });
  }

  try {
    const body = parseBody(req);
    const text = asString(body.text, 1200);
    const context = asString(body.context, 900);
    const mode = asString(body.mode, 50) || "grammar";

    if (!text) {
      return sendJson(res, 400, {
        ok: false,
        error: "Missing text",
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return sendJson(res, 503, {
        ok: false,
        error: "Missing OPENAI_API_KEY",
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: process.env.OPENAI_GRAMMAR_MODEL || "gpt-4o-mini",
          temperature: 0.2,
          max_tokens: 500,
          messages: [
            {
              role: "system",
              content: [
                "You are a grammar teacher.",
                "Help English learners by correcting grammar clearly and simply.",
                "Return JSON only.",
                'Use this schema: {"feedback":"string","correctedText":"string"}',
              ].join(" "),
            },
            {
              role: "user",
              content: [
                `Mode: ${mode}`,
                context ? `Context: ${context}` : "",
                `Text: ${text}`,
              ]
                .filter(Boolean)
                .join("\n"),
            },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (!upstream.ok) {
        return sendJson(res, 200, {
          ok: false,
          feedback:
            upstream.status === 401 || upstream.status === 403
              ? "Grammar service authentication failed. Please contact support."
              : "Grammar service is temporarily unavailable. Please try again.",
          correctedText: text,
        });
      }

      const data = await upstream.json();
      const raw = data?.choices?.[0]?.message?.content ?? "";

      let parsed: { feedback?: string; correctedText?: string } = {};
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = {
          feedback: typeof raw === "string" ? raw : "No grammar feedback was generated.",
          correctedText: text,
        };
      }

      return sendJson(res, 200, {
        ok: true,
        feedback: parsed.feedback || "Grammar review complete.",
        correctedText: parsed.correctedText || text,
      });
    } catch (error) {
      const isAbort =
        error instanceof Error &&
        (error.name === "AbortError" || error.message.toLowerCase().includes("abort"));

      return sendJson(res, 200, {
        ok: false,
        feedback: isAbort
          ? "The grammar check took too long. Please try again."
          : "The grammar service had a temporary error. Please try again.",
        correctedText: text,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  } catch {
    return sendJson(res, 500, {
      ok: false,
      error: "Internal server error",
    });
  }
}