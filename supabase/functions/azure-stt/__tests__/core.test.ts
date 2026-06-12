// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { handleRequest, type Deps } from "../core";

function deps(over: Partial<Deps> = {}): Deps {
  return {
    azureKey: "azure-key",
    azureUrlForLanguage: (lang) => `https://r.stt.speech.microsoft.com/x?language=${lang}`,
    fetch: vi.fn(async () =>
      new Response(JSON.stringify({ RecognitionStatus: "Success", DisplayText: "I bought a hat." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ),
    ...over,
  };
}

function postAudio(bytes: number, language?: string): Request {
  const fd = new FormData();
  fd.set("audio", new Blob([new Uint8Array(bytes)], { type: "audio/wav" }), "a.wav");
  if (language) fd.set("language", language);
  return new Request("https://edge/azure-stt", { method: "POST", body: fd });
}

describe("azure-stt handleRequest (free-form)", () => {
  it("returns the Azure transcript on a successful recognition", async () => {
    const d = deps();
    const res = await handleRequest(postAudio(2048), d);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, transcript: "I bought a hat." });
    // No Pronunciation-Assessment header / referenceText on the free-form call.
    const init = vi.mocked(d.fetch).mock.calls[0][1];
    expect(Object.keys(init.headers as object)).not.toContain("Pronunciation-Assessment");
  });

  it("passes a normalized language through to the URL (defaults junk to en-US)", async () => {
    const d = deps();
    await handleRequest(postAudio(2048, "vi-VN"), d);
    expect(vi.mocked(d.fetch).mock.calls[0][0]).toContain("language=vi-VN");
    const d2 = deps();
    await handleRequest(postAudio(2048, "'; DROP"), d2);
    expect(vi.mocked(d2.fetch).mock.calls[0][0]).toContain("language=en-US");
  });

  it("fail-soft (use_local) on missing audio, tiny audio, no key, non-Success, and errors", async () => {
    const noAudio = new Request("https://edge/azure-stt", { method: "POST", body: new FormData() });
    expect(await (await handleRequest(noAudio, deps())).json()).toMatchObject({ ok: false, use_local: true, reason: "missing_audio" });

    expect(await (await handleRequest(postAudio(10), deps())).json()).toMatchObject({ reason: "empty_audio" });

    expect(await (await handleRequest(postAudio(2048), deps({ azureKey: "" }))).json()).toMatchObject({ reason: "azure_unconfigured" });

    const noMatch = deps({ fetch: vi.fn(async () => new Response(JSON.stringify({ RecognitionStatus: "NoMatch" }), { status: 200 })) });
    expect(await (await handleRequest(postAudio(2048), noMatch)).json()).toMatchObject({ reason: "no_speech" });

    const http500 = deps({ fetch: vi.fn(async () => new Response("err", { status: 500 })) });
    expect(await (await handleRequest(postAudio(2048), http500)).json()).toMatchObject({ reason: "azure_failed" });

    const threw = deps({ fetch: vi.fn(async () => { throw new Error("network"); }) });
    expect(await (await handleRequest(postAudio(2048), threw)).json()).toMatchObject({ reason: "azure_failed" });
  });

  it("always returns HTTP 200 on fallback so the client uses browser STT", async () => {
    const res = await handleRequest(postAudio(2048), deps({ azureKey: "" }));
    expect(res.status).toBe(200);
  });
});
