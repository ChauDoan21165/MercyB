// FILE: api/mercy-feedback.ts
// Server endpoint to receive Mercy Host feedback batches

import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false });
    return;
  }

  try {
    const body = req.body || {};
    const items = Array.isArray(body.items) ? body.items : [];

    // Safety cap
    const accepted = items.slice(0, 50);

    // For now: log to server logs
    // Later you can store in Supabase / analytics
    console.log("Mercy Host feedback batch:", {
      count: accepted.length,
      sample: accepted[0],
    });

    res.status(200).json({
      ok: true,
      acceptedCount: accepted.length,
    });
  } catch (err) {
    console.error("Mercy feedback error", err);
    res.status(500).json({ ok: false });
  }
}