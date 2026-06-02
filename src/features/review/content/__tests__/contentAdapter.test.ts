// src/features/review/content/__tests__/contentAdapter.test.ts
//
// Tests the ContentAdapter + per-source mappers with FAKE, injected content —
// they never import the real content files. This keeps the test deterministic
// and decoupled from the (large, lazily-loaded) content corpus.

import { describe, expect, it } from "vitest";

import type {
  ReviewFlowId,
  ReviewItem,
} from "@/features/review/types";

import { createContentAdapter } from "../contentAdapter";
import type { ReviewSource } from "../sources/source";
import {
  createSpanishLessonsSource,
  type SpanishLessonLike,
} from "../sources/spanishLessons";
import {
  createBilingualSentencesSource,
  type BilingualSentenceLike,
} from "../sources/bilingualSentences";
import { slugify, stableHash } from "../slug";

// ── Fakes ───────────────────────────────────────────────────────────────────

const FAKE_SPANISH: SpanishLessonLike[] = [
  {
    id: "fake_greetings",
    vocabulary: [
      { word: "hola", english: "hello", pronunciation: "OH-lah" },
      { word: "gracias", english: "thank you", pronunciation: "GRAH-syahs" },
    ],
    sentences: [
      {
        spanish: "¿Cómo estás?",
        english: "How are you?",
        pronunciation: "KOH-moh ehs-TAHS",
      },
    ],
  },
];

const FAKE_BILINGUAL: BilingualSentenceLike[] = [
  {
    id: "bs_001",
    text_en: "Where is the check-in counter?",
    vn_translation: "Quầy làm thủ tục ở đâu?",
    vn_note: "Ngữ cảnh sân bay.",
  },
  {
    id: "bs_002",
    text_en: "I have two suitcases.",
    vn_translation: "Tôi có hai vali.",
  },
];

function fakeSpanishSource(): ReviewSource {
  return createSpanishLessonsSource(FAKE_SPANISH);
}
function fakeBilingualSource(): ReviewSource {
  return createBilingualSentencesSource(FAKE_BILINGUAL);
}

// ── slug ──────────────────────────────────────────────────────────────────

describe("slugify", () => {
  it("is deterministic and stable for the same input", () => {
    expect(slugify("How are you?")).toBe(slugify("How are you?"));
    expect(slugify("How are you?")).toBe("how-are-you");
  });

  it("strips diacritics and Vietnamese tone marks", () => {
    expect(slugify("Tôi có hai vali")).toBe("toi-co-hai-vali");
  });

  it("never returns empty for non-empty input (CJK fallback hashes)", () => {
    const s = slugify("你好世界");
    expect(s.length).toBeGreaterThan(0);
    expect(s).toBe(slugify("你好世界")); // stable
    expect(slugify("你好世界")).not.toBe(slugify("再见")); // no collision
  });

  it("stableHash is deterministic", () => {
    expect(stableHash("abc")).toBe(stableHash("abc"));
    expect(stableHash("abc")).not.toBe(stableHash("abd"));
  });
});

// ── Spanish source (en-es) ───────────────────────────────────────────────

describe("createSpanishLessonsSource — en-es mapping", () => {
  it("supports only en-es", () => {
    const src = fakeSpanishSource();
    expect(src.flows()).toEqual(["en-es"]);
    expect(src.items("vi-en")).toEqual([]);
  });

  it("maps vocab with English front / Spanish back + pronunciation", () => {
    const items = fakeSpanishSource().items("en-es");
    const hola = items.find((i) => i.back === "hola");
    expect(hola).toBeDefined();
    expect(hola!.kind).toBe("vocab");
    expect(hola!.front).toBe("hello"); // English = prompt
    expect(hola!.back).toBe("hola"); // Spanish = answer
    expect(hola!.pronunciation).toBe("OH-lah");
    expect(hola!.id).toBe("en-es:vocab:hello");
    expect(hola!.source).toBe("spanish/lessons");
  });

  it("maps sentences with the Spanish answer doubling as example", () => {
    const items = fakeSpanishSource().items("en-es");
    const sent = items.find((i) => i.kind === "sentence");
    expect(sent).toBeDefined();
    expect(sent!.front).toBe("How are you?");
    expect(sent!.back).toBe("¿Cómo estás?");
    expect(sent!.example).toBe("¿Cómo estás?");
    expect(sent!.id).toBe("en-es:sentence:how-are-you");
  });
});

// ── Bilingual source (en-vi / vi-en) ─────────────────────────────────────

describe("createBilingualSentencesSource — bidirectional mapping", () => {
  it("supports en-vi and vi-en", () => {
    const src = fakeBilingualSource();
    expect(new Set(src.flows())).toEqual(new Set(["en-vi", "vi-en"]));
  });

  it("en-vi: English front, Vietnamese back", () => {
    const items = fakeBilingualSource().items("en-vi");
    const it0 = items[0];
    expect(it0.flow).toBe("en-vi");
    expect(it0.front).toBe("Where is the check-in counter?");
    expect(it0.back).toBe("Quầy làm thủ tục ở đâu?");
    expect(it0.id.startsWith("en-vi:sentence:")).toBe(true);
    expect(it0.noteVi).toBe("Ngữ cảnh sân bay.");
  });

  it("vi-en: Vietnamese front, English back (direction inverted)", () => {
    const items = fakeBilingualSource().items("vi-en");
    const it0 = items[0];
    expect(it0.flow).toBe("vi-en");
    expect(it0.front).toBe("Quầy làm thủ tục ở đâu?");
    expect(it0.back).toBe("Where is the check-in counter?");
    expect(it0.id.startsWith("vi-en:sentence:")).toBe(true);
  });

  it("omits noteVi when vn_note is absent", () => {
    const items = fakeBilingualSource().items("en-vi");
    const second = items.find((i) => i.back === "Tôi có hai vali.");
    expect(second).toBeDefined();
    expect(second!.noteVi).toBeUndefined();
  });
});

// ── Adapter composition ───────────────────────────────────────────────────

describe("createContentAdapter", () => {
  function adapter() {
    return createContentAdapter({
      sources: [fakeSpanishSource(), fakeBilingualSource()],
    });
  }

  it("supportedFlows() lists exactly the wired flows", () => {
    const flows = adapter().supportedFlows();
    expect(new Set(flows)).toEqual(new Set(["en-es", "en-vi", "vi-en"]));
  });

  it("getItems returns correctly-shaped, namespaced items for a wired flow", async () => {
    const items = await adapter().getItems("en-es");
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.flow).toBe("en-es");
      expect(item.id).toMatch(/^en-es:(vocab|sentence):/);
      expect(item.front.length).toBeGreaterThan(0);
      expect(item.back.length).toBeGreaterThan(0);
      expect(item.source.length).toBeGreaterThan(0);
    }
  });

  it("ids are stable/deterministic across rebuilds", async () => {
    const a = await adapter().getItems("en-vi");
    const b = await adapter().getItems("en-vi");
    expect(a.map((i) => i.id)).toEqual(b.map((i) => i.id));
  });

  it("returns [] (no throw) for a supported-but-empty flow", async () => {
    const empty = createContentAdapter({
      sources: [createSpanishLessonsSource([])],
    });
    await expect(empty.getItems("en-es")).resolves.toEqual([]);
  });

  it("returns [] (no throw) for an unsupported flow", async () => {
    const a = adapter();
    await expect(a.getItems("vi-de")).resolves.toEqual([]);
    await expect(a.getItems("vi-ja")).resolves.toEqual([]);
    // garbage flow id, cast through unknown — still must not throw
    await expect(
      a.getItems("nonsense" as unknown as ReviewFlowId),
    ).resolves.toEqual([]);
  });

  it("dedups items sharing an id across sources", async () => {
    const dupSource: ReviewSource = {
      name: "dup",
      flows: () => ["en-es"],
      items: (flow): ReviewItem[] =>
        flow === "en-es"
          ? [
              {
                id: "en-es:vocab:hello",
                flow: "en-es",
                kind: "vocab",
                front: "hello",
                back: "OTHER",
                source: "dup",
              },
            ]
          : [],
    };
    const a = createContentAdapter({
      sources: [fakeSpanishSource(), dupSource],
    });
    const items = await a.getItems("en-es");
    const hits = items.filter((i) => i.id === "en-es:vocab:hello");
    expect(hits).toHaveLength(1);
    // first source wins
    expect(hits[0].back).toBe("hola");
  });

  it("survives a misbehaving source without throwing", async () => {
    const boom: ReviewSource = {
      name: "boom",
      flows: () => ["en-es"],
      items: () => {
        throw new Error("kaboom");
      },
    };
    const a = createContentAdapter({ sources: [fakeSpanishSource(), boom] });
    const items = await a.getItems("en-es");
    // still returns the good source's items
    expect(items.length).toBeGreaterThan(0);
  });
});
