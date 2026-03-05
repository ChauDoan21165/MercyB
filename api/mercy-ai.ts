// /api/mercy-ai.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

// IMPORTANT
// - Set OPENAI_API_KEY in Vercel Project → Settings → Environment Variables
// - DO NOT put the key in frontend code.

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function setCors(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

type MercyAIRequest = {
  userText: string;
  // optional context your UI can send
  lang?: "en" | "vi" | "bi";
  locationPath?: string;
  roomId?: string;
  roomTitle?: string;
  keyword?: string;
  entryId?: string;
  tier?: string; // free/vip1/vip2/vip3 etc
  // optional short chat history (keep tiny to control cost)
  history?: Array<{ role: "user" | "assistant"; content: string }>;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    setCors(req, res);

    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed. Use POST." });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY on server." });
    }

    const body = (req.body || {}) as MercyAIRequest;
    const userText = String(body.userText || "").trim();

    if (!userText) {
      return res.status(400).json({ error: "Missing userText." });
    }

    // Keep context small + safe
    const ctxBits: string[] = [];
    if (body.locationPath) ctxBits.push(`path=${body.locationPath}`);
    if (body.roomTitle) ctxBits.push(`roomTitle=${body.roomTitle}`);
    if (body.roomId) ctxBits.push(`roomId=${body.roomId}`);
    if (body.keyword) ctxBits.push(`keyword=${body.keyword}`);
    if (body.entryId) ctxBits.push(`entryId=${body.entryId}`);
    if (body.tier) ctxBits.push(`tier=${body.tier}`);
    const contextLine = ctxBits.length ? `Context: ${ctxBits.join(" | ")}` : "";

    const system = `
You are Mercy Host inside the MercyBlade app.
Be calm, warm, and helpful. Never be rude or dismissive.
If the user says hello (hi/hello/xin chào/chào), greet them back politely before anything else.

STYLE RULES:
- Keep answers short and actionable (max ~6 lines per language).
- Always output bilingual: English first, then Vietnamese.
- Format EXACTLY like:

EN:
<English>

VI:
<Vietnamese>

CONTENT RULES:
- Prefer concrete next steps inside the app (rooms, keywords, /tiers, /pricing).
- If the user asks for VIP/payment: explain clearly and briefly.
- If you don't know something, say what to do next (where to click / what page).
- Do NOT mention internal policies, tokens, or OpenAI.
${contextLine ? "\n" + contextLine : ""}
`.trim();

    // Tiny history (optional) to make it feel coherent without blowing cost
    const history = Array.isArray(body.history) ? body.history.slice(-6) : [];

    // Call model
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 280,
      messages: [
        { role: "system", content: system },
        ...history.map((m) => ({ role: m.role, content: String(m.content || "") })),
        { role: "user", content: userText },
      ],
    });

    const text = completion.choices?.[0]?.message?.content?.trim() || "";

    return res.status(200).json({
      ok: true,
      text,
    });
  } catch (err: any) {
    // Never leak secrets
    return res.status(500).json({
      ok: false,
      error: "Mercy AI request failed.",
      detail: String(err?.message || err || "unknown_error"),
    });
  }
}