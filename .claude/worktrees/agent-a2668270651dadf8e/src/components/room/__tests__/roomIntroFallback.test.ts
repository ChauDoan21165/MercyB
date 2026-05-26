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
    expect(isViIntroMissing({ title: { en: "X" } })).toBe(false);
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
});
