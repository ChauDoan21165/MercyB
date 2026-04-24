// File: api/mercy/grammar.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
// Imports resolved to api/_lib/ — Vercel's serverless bundler failed to
// trace relative imports outside the api/ subtree (see
// fix/grammar-api-import-path for the ERR_MODULE_NOT_FOUND outage that
// returned 500 on every grammar request until this move).
import { firstL1HintFromIssues, type L1HintPayload } from "../_lib/l1HintAdapter";
import { isFlagEnabledForUser } from "../_lib/featureFlags";

type GrammarBody = {
  text?: string; context?: string; mode?: string;
  englishLevel?: string; focus?: string;
  isRevisionAttempt?: boolean; originalText?: string;
  userId?: string;  // Supabase user id — required for per-user L1 flag gate
};

type GrammarResult = {
  ok: boolean;
  correctedText?: string; enhancedText?: string;
  explanation?: string; feedback?: string;
  grammarPoints?: string[];
  tenseAnalysis?: { likelyMainTense?: string };
  issues?: Array<{ original: string; corrected: string; reason: string }>;
  l1Hint?: L1HintPayload;  // present iff feedbackL1DetectorEnabled for this user
  error?: string;
};

// ─────────────────────────────────────────────────────────────────────────
// Supabase client for the L1 feature-flag check. Built lazily on first
// request so cold starts don't pay the cost when the flag is OFF.
// ─────────────────────────────────────────────────────────────────────────
const L1_FLAG_KEY = "feedbackL1DetectorEnabled";
let supabaseSingleton: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (supabaseSingleton) return supabaseSingleton;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || !key) return null;
  supabaseSingleton = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return supabaseSingleton;
}

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

      const issues = Array.isArray(parsed.issues) ? parsed.issues : [];

      // ── L1 detector (feature-flagged, default OFF globally) ─────────
      // Broad try/catch: the detector path must NEVER kill the core grammar
      // response. If anything here throws — Supabase auth, flag lookup,
      // rule regex, template fill — log and degrade to l1Hint = null.
      const userId = asString(body.userId, 64);
      let l1Hint: L1HintPayload | null = null;
      try {
        if (userId) {
          const sb = getSupabaseClient();
          if (sb) {
            const flagOn = await isFlagEnabledForUser(sb, L1_FLAG_KEY, userId);
            if (flagOn) l1Hint = firstL1HintFromIssues(issues);
          }
        }
      } catch (err) {
        // Never fail the request over L1 hint problems. The grammar core
        // response below is still returned successfully.
        console.warn("[grammar] L1 hint generation failed (degraded):", err);
        l1Hint = null;
      }

      return sendJson(res, 200, {
        ok: true,
        correctedText: parsed.correctedText || text,
        enhancedText: parsed.enhancedText || parsed.correctedText || text,
        explanation: parsed.explanation || "",
        feedback: parsed.feedback || "Good effort! Keep going.",
        grammarPoints: Array.isArray(parsed.grammarPoints) ? parsed.grammarPoints : [],
        tenseAnalysis: parsed.tenseAnalysis || {},
        issues,
        ...(l1Hint ? { l1Hint } : {}),
      });
    } catch (error) {
      const isAbort = error instanceof Error && error.name === "AbortError";
      return sendJson(res, 200, { ok: false, correctedText: text,
        feedback: isAbort ? "Grammar check took too long. Please try again." : "Grammar service had a temporary error." });
    } finally { clearTimeout(timeoutId); }
  } catch (outerErr) {
    // Log the real stack so Vercel's function logs show what actually
    // failed — previous version swallowed the error silently.
    // Degrade from a 500 to a 200 with ok:false so the client renders
    // the friendly fallback message instead of a hard "server error".
    console.error("[grammar] unexpected top-level error:", outerErr);
    return sendJson(res, 200, {
      ok: false,
      error: "Internal server error",
      feedback: "Grammar help had a temporary error. Please try again.",
    });
  }
}
