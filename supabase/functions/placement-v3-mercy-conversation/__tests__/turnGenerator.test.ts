import { describe, expect, it } from "vitest";
import { generateMercyTurn } from "../turnGenerator";
import { extractSignalsFromTurn, summarizeSignals } from "../signalExtractor";
import type { TranscriptTurn } from "../types";

describe("turnGenerator", () => {
  it("returns warm opening in target language", async () => {
    const turn = await generateMercyTurn({ history: [], phase: "opening" });
    expect(turn.text).toMatch(/Mercy/);
    expect(turn.text).toMatch(/conversation/);
  });

  it("after 3 unclear turns probes with B1-calibrated default", async () => {
    const history: TranscriptTurn[] = [
      { speaker: "mercy", text: "Tell me about your day." },
      { speaker: "user", text: "ok" },
      { speaker: "mercy", text: "Tell me about work." },
      { speaker: "user", text: "yes" },
      { speaker: "mercy", text: "What is difficult?" },
      { speaker: "user", text: "English" },
    ];
    const turn = await generateMercyTurn({ history, phase: "probe", signals: summarizeSignals(history.filter((t) => t.speaker === "user").map((t) => extractSignalsFromTurn(t.text))) });
    expect(["A1", "A2", "B1"]).toContain(turn.targetCefr);
    expect(turn.text).toMatch(/\?/);
  });

  it("after clear A1 signals backs off difficulty", async () => {
    const signals = summarizeSignals([extractSignalsFromTurn("")]);
    const turn = await generateMercyTurn({ history: [{ speaker: "user", text: "" }], phase: "probe", signals });
    expect(turn.internal_note).toMatch(/BACKOFF/);
  });

  it("approaching session limit shifts to comfort phase", async () => {
    const history = Array.from({ length: 7 }, (_, i) => ({ speaker: "user" as const, text: `I answer because practice helps ${i}.` }));
    const turn = await generateMercyTurn({ history, phase: "targeted", targetTurnPairs: 8, signals: summarizeSignals(history.map((h) => extractSignalsFromTurn(h.text))) });
    expect(turn.phase).toBe("comfort");
  });

  it("keeps persona warmth in all deterministic turns", async () => {
    const turn = await generateMercyTurn({ history: [{ speaker: "user", text: "I practiced because it was difficult." }], phase: "probe", signals: summarizeSignals([extractSignalsFromTurn("I practiced because it was difficult.")]) });
    expect(turn.text).not.toMatch(/score|CEFR|grade|failed/i);
  });

  it("does not default to Vietnamese for B1+ turns", async () => {
    const signals = summarizeSignals([extractSignalsFromTurn("I practiced every night because it was difficult and I improved a lot.")]);
    const turn = await generateMercyTurn({ history: [{ speaker: "user", text: "I practiced every night because it was difficult and I improved a lot." }], phase: "probe", signals });
    expect(turn.text).not.toMatch(/[ăâêôơưđáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i);
  });

  it("uses AI JSON when available but enforces persona", async () => {
    const turn = await generateMercyTurn(
      { history: [{ speaker: "user", text: "I work with customers because English helps." }], phase: "probe", signals: summarizeSignals([extractSignalsFromTurn("I work with customers because English helps.")]) },
      async () => ({ ok: true, json: { text: "Your CEFR is B1. Tell me about Tet?" }, raw: "" }),
    );
    expect(turn.text).not.toMatch(/CEFR|B1/);
    expect(turn.text).toMatch(/\?/);
  });
});
