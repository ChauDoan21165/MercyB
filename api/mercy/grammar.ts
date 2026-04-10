// File: api/mercy/grammar.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

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

  return res.status(200).json({
    ok: true,
    feedback: "Stub response working.",
    corrections: [
      {
        original: "This are a test sentence.",
        corrected: "This is a test sentence.",
        explanation: "Use 'is' with singular subject 'This'.",
      },
    ],
  });
}