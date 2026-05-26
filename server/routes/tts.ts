// PATH: server/routes/tts.ts
// Local-dev mirror of api/tts.ts. Keeps /api/tts working under
// `npm run dev` without exposing ELEVENLABS_API_KEY to the browser.

import type { Express, Request, Response } from "express";

type TtsBody = { text?: string; voiceId?: string };

function asString(value: unknown, max = 2000): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function registerTtsRoutes(app: Express) {
  app.post("/api/tts", async (req: Request, res: Response) => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const defaultVoiceId = process.env.ELEVENLABS_VOICE_ID;

    if (!apiKey) {
      return res.status(503).json({ ok: false, error: "Missing ELEVENLABS_API_KEY" });
    }

    const body = (req.body ?? {}) as TtsBody;
    const text = asString(body.text, 2000);
    const voiceId = asString(body.voiceId, 100) || defaultVoiceId || "";

    if (!text) return res.status(400).json({ ok: false, error: "Missing text" });
    if (!voiceId) {
      return res.status(503).json({ ok: false, error: "Missing ELEVENLABS_VOICE_ID" });
    }

    try {
      const upstream = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
            Accept: "audio/mpeg",
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_monolingual_v1",
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
          }),
        }
      );

      if (!upstream.ok) {
        const detail = await upstream.text().catch(() => "");
        console.warn("[tts] elevenlabs non-OK", upstream.status, detail.slice(0, 200));
        return res
          .status(upstream.status === 401 ? 502 : upstream.status)
          .json({ ok: false, error: `ElevenLabs ${upstream.status}` });
      }

      const arrayBuffer = await upstream.arrayBuffer();
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).send(Buffer.from(arrayBuffer));
    } catch (err) {
      console.warn("[tts] proxy threw", err);
      return res.status(502).json({ ok: false, error: "TTS proxy failed" });
    }
  });
}
