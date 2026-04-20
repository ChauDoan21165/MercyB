// File: api/mercy/grammar.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

type GrammarBody = {
  text?: string; context?: string; mode?: string;
  englishLevel?: string; focus?: string;
  isRevisionAttempt?: boolean; originalText?: string;
};

type GrammarResult = {
  ok: boolean;
  correctedText?: string; enhancedText?: string;
  explanation?: string; feedback?: string;
  grammarPoints?: string[];
  tenseAnalysis?: { likelyMainTense?: string };
  issues?: Array<{ original: string; corrected: string; reason: string }>;
  error?: string;
};

function asString(value: unknown, max = 1200): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function parseBody(req: VercelRequest): GrammarBody {
  if (typeof req.body === "string") { try { return JSON.parse(req.body); } catch { return {}; } }
  if (req.body && typeof req.body === "object") return req.body as GrammarBody;
  return {};
}
function sendJson(res: VercelResponse, status: number, payload: GrammarResult): void {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(status).json(payload);
}

function buildSystemPrompt(level: string, isRevision: boolean): string {
  return [
    "You are Teacher Mercy, a warm and precise English teacher for Vietnamese learners.",
    "Your job: correct and enhance the learner English sentence, then explain what changed and why.",
    level ? `Learner English level: ${level}. Adjust explanation complexity accordingly.` : "Assume intermediate level.",
    isRevision ? "This is a revision attempt — be encouraging and note what improved." : "",
    "",
    "Return ONLY valid JSON:",
    `{
  "correctedText": "fix grammar errors only, keep learner meaning",
  "enhancedText": "more natural fluent English version",
  "explanation": "1-2 sentence explanation of main change in simple English",
  "feedback": "warm 1-sentence encouragement",
  "grammarPoints": ["past simple", "subject-verb agreement"],
  "tenseAnalysis": { "likelyMainTense": "past simple" },
  "issues": [{ "original": "wrong part", "corrected": "fixed part", "reason": "why" }]
}`,
    "",
    "Rules: correctedText fixes errors only. enhancedText makes it sound native. Only 1-3 grammarPoints. Be warm never condescending.",
  ].filter(Boolean).join("\n");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { ok: false, error: "Method not allowed" });
  }
  try {
    const body = parseBody(req);
    const text = asString(body.text, 1200);
    const context = asString(body.context, 900);
    const level = asString(body.englishLevel, 50);
    const focus = asString(body.focus, 200);
    const originalText = asString(body.originalText, 1200);
    const isRevision = Boolean(body.isRevisionAttempt);

    if (!text) return sendJson(res, 400, { ok: false, error: "Missing text" });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return sendJson(res, 503, { ok: false, error: "Missing OPENAI_API_KEY" });

    const userMessage = [
      originalText && originalText !== text ? `Original: ${originalText}` : "",
      `Sentence: ${text}`,
      context ? `Context: ${context}` : "",
      focus ? `Focus: ${focus}` : "",
    ].filter(Boolean).join("\n");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        signal: controller.signal,
        body: JSON.stringify({
          model: process.env.OPENAI_GRAMMAR_MODEL || "gpt-4o-mini",
          temperature: 0.15, max_tokens: 800,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: buildSystemPrompt(level, isRevision) },
            { role: "user", content: userMessage },
          ],
        }),
      });

      if (!upstream.ok) {
        return sendJson(res, 200, { ok: false, correctedText: text,
          feedback: upstream.status === 429 ? "Grammar service is busy. Please try again." : "Grammar service temporarily unavailable." });
      }

      const data = await upstream.json();
      const raw = data?.choices?.[0]?.message?.content ?? "";
      let parsed: any = {};
      try { parsed = JSON.parse(raw); } catch { parsed = { correctedText: text, feedback: raw }; }

      return sendJson(res, 200, {
        ok: true,
        correctedText: parsed.correctedText || text,
        enhancedText: parsed.enhancedText || parsed.correctedText || text,
        explanation: parsed.explanation || "",
        feedback: parsed.feedback || "Good effort! Keep going.",
        grammarPoints: Array.isArray(parsed.grammarPoints) ? parsed.grammarPoints : [],
        tenseAnalysis: parsed.tenseAnalysis || {},
        issues: Array.isArray(parsed.issues) ? parsed.issues : [],
      });
    } catch (error) {
      const isAbort = error instanceof Error && error.name === "AbortError";
      return sendJson(res, 200, { ok: false, correctedText: text,
        feedback: isAbort ? "Grammar check took too long. Please try again." : "Grammar service had a temporary error." });
    } finally { clearTimeout(timeoutId); }
  } catch { return sendJson(res, 500, { ok: false, error: "Internal server error" }); }
}
