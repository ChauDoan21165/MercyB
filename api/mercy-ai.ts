// FILE: mercy-ai.ts
// PATH: api/mercy-ai.ts
//
// Fix: remove `openai` npm dependency (was missing on Vercel) and call OpenAI via fetch.
// Accepts POST JSON:
//   { userText?: string, message?: string, lang?: "en"|"vi", context?: {...}, history?: [...] }
// Returns:
//   { text: string }
//
// ENV:
//   OPENAI_API_KEY=...

import type { VercelRequest, VercelResponse } from "@vercel/node";

function norm(v: any) {
  return typeof v === "string" ? v.trim() : "";
}

function safeJson(res: VercelResponse, status: number, obj: any) {
  res.status(status);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.send(JSON.stringify(obj));
}

function pickUserText(body: any) {
  // support both {userText} and {message} because your curl used "message"
  return norm(body?.userText) || norm(body?.message);
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
    const userText = pickUserText(body);
    const lang = body?.lang === "vi" ? "vi" : "en";
    if (!userText) return safeJson(res, 400, { error: "Missing userText" });

    const context = body?.context ?? {};
    const roomTitle = norm(context?.roomTitle);
    const roomId = norm(context?.roomId);
    const keyword = norm(context?.keyword);
    const entryId = norm(context?.entryId);

    const history: Array<{ role: "user" | "assistant"; text: string }> = Array.isArray(body?.history)
      ? body.history
          .slice(-6)
          .map((m: any) => ({
            role: m?.role === "assistant" ? "assistant" : "user",
            text: norm(m?.text ?? m?.content ?? ""),
          }))
          .filter((m) => m.text)
      : [];

    const ctxLine = [
      roomTitle || roomId ? `room=${roomTitle || roomId}` : null,
      keyword ? `kw=${keyword}` : null,
      entryId ? `entry=${entryId}` : null,
    ]
      .filter(Boolean)
      .join(" • ");

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
- If user starts with "fix grammar:" then correct grammar + 1 short rule.
- Keep answers compact.`;

    // OpenAI "Responses" API payload
    const input: Array<{ role: "system" | "developer" | "user" | "assistant"; content: string }> = [
      { role: "developer", content: system },
      ...(ctxLine ? [{ role: "developer" as const, content: `Context: ${ctxLine}` }] : []),
      ...history.map((h) => ({ role: h.role, content: h.text })),
      { role: "user", content: userText },
    ];

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input,
        temperature: 0.4,
        max_output_tokens: 220,
      }),
    });

    const data: any = await r.json().catch(() => null);

    if (!r.ok) {
      const msg =
        norm(data?.error?.message) ||
        norm(data?.message) ||
        `OpenAI error (${r.status})`;
      return safeJson(res, 500, { error: msg, status: r.status });
    }

    // responses API: best-effort text extraction
    const text =
      norm(data?.output_text) ||
      norm(data?.output?.[0]?.content?.[0]?.text) ||
      norm(data?.output?.[0]?.content?.[0]?.content) ||
      "";

    return safeJson(res, 200, { text: text || "EN:\n…\n\nVI:\n…" });
  } catch (e: any) {
    return safeJson(res, 500, { error: String(e?.message || e || "unknown_error") });
  }
}