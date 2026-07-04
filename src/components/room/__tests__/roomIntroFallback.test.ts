// src/components/room/__tests__/roomIntroFallback.test.ts
//
// Pins the M4 honest-fallback predicate against the EXACT room JSON shapes
// the wrong-language sweep found (see m4_scan_out.txt). The bug: a VI
// learner is silently shown English in the room welcome line because
// pickIntroVI's last link falls through to the plain-EN `description`.
// isViIntroMissing must be true precisely for those rooms and false when
// genuine VI exists or there is nothing to leak.

import { describe, it, expect } from "vitest";
import {
  pickIntroEN,
  pickIntroVI,
  pickIntroVIStrict,
  isViIntroMissing,
} from "@/components/room/roomIntroFallback";

type RoomIntroFixture = Parameters<typeof isViIntroMissing>[0];
const asRoomIntroFixture = (room: unknown): RoomIntroFixture => room as RoomIntroFixture;

describe("isViIntroMissing — M4 silent EN-for-VI gate", () => {
  it("flags the real 28-room shape: plain EN `description`, content.vi empty", () => {
    // ptsd_support_free.json verbatim shape (top-level keys trimmed).
    const room = {
      description: "Practical guidance for managing PTSD with emotional and therapeutic support",
      content: {
        en: "Practical guidance for managing PTSD with emotional and therapeutic support",
        vi: "",
      },
    };
    expect(pickIntroVIStrict(room)).toBe(""); // no genuine VI
    expect(pickIntroEN(room)).toMatch(/Practical guidance/);
    // pickIntroVI (the display chain) still leaks the EN string — this is
    // the bug; the predicate is what lets the caller stop rendering it.
    expect(pickIntroVI(room)).toMatch(/Practical guidance/);
    expect(isViIntroMissing(room)).toBe(true);
  });

  it("flags cyrus_v3 shape: description.en slug + description.vi empty", () => {
    const room = { description: { en: "cyrus_v3", vi: "" } };
    expect(isViIntroMissing(room)).toBe(true);
  });

  it("treats whitespace-only VI as missing", () => {
    const room = { description: "EN body", description_vi: "   \n  " };
    expect(isViIntroMissing(room)).toBe(true);
  });

  it("treats empty structured VI fields as missing only when EN exists", () => {
    expect(
      isViIntroMissing({ intro: { en: "Welcome", vi: "" } }),
    ).toBe(true);
    expect(
      isViIntroMissing({ description: { en: "About this room", vi: "  " } }),
    ).toBe(true);
    expect(isViIntroMissing({ intro: { vi: "  " } })).toBe(false);
  });

  it("treats whitespace-only structured summary VI as missing when EN summary exists", () => {
    const room = { summary: { en: "Welcome to the room", vi: "   \n " } };
    expect(pickIntroEN(room)).toBe("Welcome to the room");
    expect(pickIntroVIStrict(room)).toBe("   \n ");
    expect(isViIntroMissing(room)).toBe(true);
  });

  it("ignores malformed object descriptions instead of returning object text", () => {
    const room = {
      description: { en: { body: "object en" }, vi: { body: "object vi" } },
      summary_en: "Safe English summary",
    };

    expect(pickIntroEN(room)).toBe("Safe English summary");
    expect(pickIntroVI(room)).toBe("");
    expect(pickIntroEN(room)).not.toBe("[object Object]");
    expect(pickIntroVI(room)).not.toBe("[object Object]");
  });

  it("uses intro before description and summary in both languages", () => {
    const room = {
      intro: { en: "Intro EN", vi: "Intro VI" },
      description: { en: "Description EN", vi: "Description VI" },
      summary: { en: "Summary EN", vi: "Summary VI" },
      description_en: "Flat description EN",
      description_vi: "Flat description VI",
    };

    expect(pickIntroEN(room)).toBe("Intro EN");
    expect(pickIntroVI(room)).toBe("Intro VI");
    expect(pickIntroVIStrict(room)).toBe("Intro VI");
    expect(isViIntroMissing(room)).toBe(false);
  });

  it("falls through flat description fields before structured summary fields", () => {
    const room = {
      description_en: "Flat description EN",
      description_vi: "Flat description VI",
      summary: { en: "Summary EN", vi: "Summary VI" },
    };

    expect(pickIntroEN(room)).toBe("Flat description EN");
    expect(pickIntroVI(room)).toBe("Flat description VI");
  });

  it("ignores non-string historical intro fields", () => {
    const room = {
      intro_en: 123,
      description_en: ["not", "intro"],
      summary: { en: "Fallback English", vi: 42 },
      summary_vi: { body: "not string" },
    };

    expect(pickIntroEN(room)).toBe("Fallback English");
    expect(pickIntroVI(room)).toBe("");
    expect(isViIntroMissing(room)).toBe(true);
  });

  it("ignores arrays and nulls across historical intro fields", () => {
    const room = {
      intro: { en: ["bad"], vi: null },
      description: { en: null, vi: ["bad"] },
      intro_en: ["not string"],
      intro_vi: ["not string"],
      summary_en: "Safe English summary",
    };

    expect(pickIntroEN(room)).toBe("Safe English summary");
    expect(pickIntroVI(room)).toBe("");
    expect(isViIntroMissing(room)).toBe(true);
  });

  it("does NOT flag when a genuine VI intro exists", () => {
    const room = {
      description: "Practical guidance for managing PTSD",
      description_vi: "Hướng dẫn thiết thực để quản lý PTSD",
    };
    expect(pickIntroVIStrict(room)).toBe("Hướng dẫn thiết thực để quản lý PTSD");
    expect(isViIntroMissing(room)).toBe(false);
  });

  it("does NOT flag structured intro.{en,vi} rooms", () => {
    const room = { intro: { en: "Welcome", vi: "Chào mừng" } };
    expect(isViIntroMissing(room)).toBe(false);
  });

  it("does NOT flag a room with no intro content at all (generated welcome, no leak)", () => {
    expect(isViIntroMissing({})).toBe(false);
    expect(isViIntroMissing(asRoomIntroFixture({ title: { en: "X" } }))).toBe(false);
  });

  it("does NOT flag generated welcome metadata without an EN intro body", () => {
    const room = {
      title: { en: "Sleep Support", vi: "Hỗ trợ giấc ngủ" },
      tier: "free",
      welcome: { generated: true },
    };

    const fixture = asRoomIntroFixture(room);
    expect(pickIntroEN(fixture)).toBe("");
    expect(pickIntroVI(fixture)).toBe("");
    expect(isViIntroMissing(fixture)).toBe(false);
  });

  it("does NOT flag an EN-missing room (the other asymmetry — no EN to leak)", () => {
    const room = { description_vi: "Chỉ có tiếng Việt" };
    expect(isViIntroMissing(room)).toBe(false);
  });

  it("pickIntroEN / pickIntroVI keep their prior fallthrough behavior", () => {
    // Behavior-preservation guard for the extract-to-module refactor.
    const room = { description: "plain string" };
    expect(pickIntroEN(room)).toBe("plain string");
    expect(pickIntroVI(room)).toBe("plain string");
    expect(pickIntroEN({})).toBe("");
    expect(pickIntroVI({})).toBe("");
  });

  it("flags a plain description fallback as a VI leak even when content.vi is absent", () => {
    const room = {
      description: "English-only intro body",
      content: { en: "English-only intro body" },
    };

    expect(pickIntroVI(room)).toBe("English-only intro body");
    expect(pickIntroVIStrict(room)).toBe("");
    expect(isViIntroMissing(room)).toBe(true);
  });

  it("ignores generated welcome metadata with non-string bodies", () => {
    const room = {
      title: { en: "Calm Room", vi: "Phòng bình tĩnh" },
      welcome: { generated: true, body: { en: "not intro" } },
      intro: { en: null, vi: null },
    };

    expect(pickIntroEN(room)).toBe("");
    expect(pickIntroVI(room)).toBe("");
    expect(isViIntroMissing(room)).toBe(false);
  });
});
