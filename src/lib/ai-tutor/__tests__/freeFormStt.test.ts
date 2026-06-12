import { describe, expect, it, vi } from "vitest";
import { transcribeWithAzure, type TranscribeDeps } from "@/lib/ai-tutor/freeFormStt";

const blob = new Blob([new Uint8Array(2048)], { type: "audio/webm" });

function deps(over: Partial<TranscribeDeps> = {}): TranscribeDeps {
  return {
    supabaseUrl: "https://proj.supabase.co",
    toWav: vi.fn(async () => new Blob([new Uint8Array(2048)], { type: "audio/wav" })),
    fetch: vi.fn(async () =>
      new Response(JSON.stringify({ ok: true, transcript: "  I bought a hat.  " }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ) as unknown as typeof fetch,
    ...over,
  };
}

describe("transcribeWithAzure", () => {
  it("returns the trimmed Azure transcript and posts to azure-stt with bearer auth", async () => {
    const d = deps();
    const out = await transcribeWithAzure(blob, "en-US", "jwt-123", d);
    expect(out).toBe("I bought a hat.");
    const [url, init] = vi.mocked(d.fetch).mock.calls[0];
    expect(url).toBe("https://proj.supabase.co/functions/v1/azure-stt");
    expect((init as RequestInit).method).toBe("POST");
    expect((init as RequestInit).headers).toMatchObject({ Authorization: "Bearer jwt-123" });
    expect((init as RequestInit).body).toBeInstanceOf(FormData);
  });

  it("returns null (keep browser STT) when there is no blob / token / supabaseUrl", async () => {
    expect(await transcribeWithAzure(null, "en-US", "jwt", deps())).toBeNull();
    expect(await transcribeWithAzure(blob, "en-US", null, deps())).toBeNull();
    expect(await transcribeWithAzure(blob, "en-US", "jwt", deps({ supabaseUrl: "" }))).toBeNull();
  });

  it("fail-soft to null on the use_local sentinel, non-2xx, bad json, and thrown fetch", async () => {
    const local = deps({ fetch: vi.fn(async () => new Response(JSON.stringify({ ok: false, use_local: true, reason: "no_speech" }), { status: 200 })) as unknown as typeof fetch });
    expect(await transcribeWithAzure(blob, "en-US", "jwt", local)).toBeNull();

    const http500 = deps({ fetch: vi.fn(async () => new Response("err", { status: 500 })) as unknown as typeof fetch });
    expect(await transcribeWithAzure(blob, "en-US", "jwt", http500)).toBeNull();

    const empty = deps({ fetch: vi.fn(async () => new Response(JSON.stringify({ ok: true, transcript: "   " }), { status: 200 })) as unknown as typeof fetch });
    expect(await transcribeWithAzure(blob, "en-US", "jwt", empty)).toBeNull();

    const threw = deps({ fetch: vi.fn(async () => { throw new Error("network"); }) as unknown as typeof fetch });
    expect(await transcribeWithAzure(blob, "en-US", "jwt", threw)).toBeNull();
  });
});
