// File: api/mercy/grammar.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

type GrammarBody = {
  text?: string;
  context?: string;
  mode?: string;
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
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
      return res.status(400).json({
        ok: false,
        error: "Missing text",
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
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
        const errorText = await upstream.text().catch(() => "");
        return res.status(200).json({
          ok: false,
          feedback: `Grammar service upstream error (${upstream.status}).`,
          correctedText: text,
          details: errorText.slice(0, 400),
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

      return res.status(200).json({
        ok: true,
        feedback: parsed.feedback || "Grammar review complete.",
        correctedText: parsed.correctedText || text,
      });
    } catch (error) {
      const isAbort =
        error instanceof Error &&
        (error.name === "AbortError" || error.message.toLowerCase().includes("abort"));

      return res.status(200).json({
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
    return res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
}