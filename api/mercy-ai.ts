// FILE: mercy-ai.ts
// PATH: api/mercy-ai.ts
//
// Vercel Serverless Function (Node/TS).
// - Receives: { userText, lang, context?, history? }
// - Returns: { text }
//
// ENV required (in Vercel + local):
//   OPENAI_API_KEY=...
//
// Uses OpenAI Node SDK:
//   npm i openai
//   import OpenAI from "openai";
//   const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// :contentReference[oaicite:1]{index=1}

import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function norm(s: any) {
  return typeof s === "string" ? s.trim() : "";
}

function safeJson(res: VercelResponse, status: number, obj: any) {
  res.status(status);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.send(JSON.stringify(obj));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return safeJson(res, 405, { error: "Method Not Allowed" });
    }

    const key = process.env.OPENAI_API_KEY;
    if (!key) return safeJson(res, 500, { error: "Missing OPENAI_API_KEY" });

    const body: any = req.body ?? {};
    const userText = norm(body.userText);
    const lang = body.lang === "vi" ? "vi" : "en";

    if (!userText) return safeJson(res, 400, { error: "Missing userText" });

    const context = body.context ?? {};
    const roomTitle = norm(context.roomTitle);
    const roomId = norm(context.roomId);
    const keyword = norm(context.keyword);
    const entryId = norm(context.entryId);

    // Keep cost bounded:
    // - short max_tokens
    // - single response
    // - small history (optional)
    const history: Array<{ role: "user" | "assistant"; text: string }> = Array.isArray(body.history)
      ? body.history.slice(-6).map((m: any) => ({
          role: m?.role === "assistant" ? "assistant" : "user",
          text: norm(m?.text),
        }))
      : [];

    const ctxLine = [roomTitle || roomId ? `room=${roomTitle || roomId}` : null, keyword ? `kw=${keyword}` : null, entryId ? `entry=${entryId}` : null]
      .filter(Boolean)
      .join(" • ");

    // “Mercy” style: concise, warm, practical, bilingual in one bubble.
    // IMPORTANT: We instruct the model to ALWAYS return the EN/VI blocks.
    const system = `You are Mercy Host inside a learning app.
Tone: calm, warm, practical. No hype. No emojis. No long essays.
Always output EXACTLY this format:

EN:
<2-6 short lines>

VI:
<2-6 short lines>

Rules:
- If user says hello/hi/xin chào: greet back politely and ask 1 short question.
- If user is vague: ask 1 clarifying question + give 1 next step.
- If user asks about VIP/tiers/pricing: say go to /tiers.
- If user asks "fix grammar:" then correct grammar + explain 1 rule briefly.
- Keep answers compact.`;

    const messages: any[] = [
      { role: "developer", content: system },
      ...(ctxLine ? [{ role: "developer", content: `Context: ${ctxLine}` }] : []),
      ...history
        .filter((h) => h.text)
        .map((h) => ({
          role: h.role,
          content: h.text,
        })),
      { role: "user", content: userText },
    ];

    // Chat Completions usage (supported indefinitely). :contentReference[oaicite:2]{index=2}
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.4,
      max_tokens: 220,
    });

    const text = completion.choices?.[0]?.message?.content ?? "";
    return safeJson(res, 200, { text });
  } catch (e: any) {
    return safeJson(res, 500, { error: String(e?.message || e || "unknown_error") });
  }
}