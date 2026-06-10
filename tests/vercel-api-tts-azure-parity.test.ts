import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(rel: string): string {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

// The Vercel `api/tts.ts` is the disaster-recovery host's TTS endpoint
// (docs/runbooks/disaster-recovery.md). It must honour Product Contract C1
// identically to the primary Netlify handler and the Cloudflare Pages handler:
// Vietnamese routes to an Azure vi-VN voice via the mercy-tts edge function,
// never a direct-ElevenLabs English voice. Guards against silent regression on
// failover — the gap that previously let this handler drift to ElevenLabs-only.
describe("Vercel /api/tts Azure parity (Contract C1)", () => {
  it("routes through Azure-first mercy-tts and not direct ElevenLabs", () => {
    const tts = read("api/tts.ts");
    expect(tts).toContain("/functions/v1/mercy-tts");
    expect(tts).toContain("language: upstreamLanguage");
    expect(tts).toContain('"vi-VN-HoaiMyNeural"');
    expect(tts).toContain('payload.provider !== "azure"');
    expect(tts).not.toContain("ELEVENLABS_API_KEY");
    expect(tts).not.toContain("api.elevenlabs.io");
  });

  it("surfaces the resolved provider so a fallback can never masquerade as Azure", () => {
    const tts = read("api/tts.ts");
    expect(tts).toContain("X-TTS-Provider");
    expect(tts).toContain("X-TTS-Fallback-Reason");
  });
});
