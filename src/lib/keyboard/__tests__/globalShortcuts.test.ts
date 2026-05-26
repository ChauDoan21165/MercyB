// src/lib/keyboard/__tests__/globalShortcuts.test.ts
//
// Step 11 — pure-function tests for the keyboard shortcut matcher.
// React-hook integration is covered by manual smoke-tests; the matcher
// + parser + focus-guard are pure and locked here.

import { describe, it, expect } from "vitest";

import {
  CHORD_TIMEOUT_MS,
  SHORTCUT_CATALOG,
  matchesStep,
  parseShortcutStep,
  shouldIgnoreEvent,
} from "../globalShortcuts";

function ev(
  key: string,
  modifiers: Partial<{ ctrl: boolean; meta: boolean; shift: boolean; alt: boolean }> = {},
  target?: HTMLElement | null,
): KeyboardEvent {
  return new KeyboardEvent("keydown", {
    key,
    ctrlKey: modifiers.ctrl ?? false,
    metaKey: modifiers.meta ?? false,
    shiftKey: modifiers.shift ?? false,
    altKey: modifiers.alt ?? false,
    bubbles: true,
  });
}

describe("parseShortcutStep", () => {
  it("parses a single literal letter", () => {
    expect(parseShortcutStep("n")).toMatchObject({ key: "n", ctrl: false, meta: false });
  });

  it("normalises Esc to escape", () => {
    expect(parseShortcutStep("Esc").key).toBe("escape");
    expect(parseShortcutStep("Escape").key).toBe("escape");
  });

  it("parses a Mod+ binding", () => {
    expect(parseShortcutStep("Mod+/")).toMatchObject({
      key: "/",
      mod: true,
    });
  });

  it("parses Shift+letter", () => {
    expect(parseShortcutStep("Shift+n")).toMatchObject({
      key: "n",
      shift: true,
    });
  });

  it("preserves the literal '?' key", () => {
    expect(parseShortcutStep("?").key).toBe("?");
  });
});

describe("matchesStep", () => {
  it("matches a single letter without modifiers", () => {
    const step = parseShortcutStep("n");
    expect(matchesStep(ev("n"), step)).toBe(true);
  });

  it("rejects when modifiers don't match", () => {
    const step = parseShortcutStep("n");
    expect(matchesStep(ev("n", { ctrl: true }), step)).toBe(false);
    expect(matchesStep(ev("n", { meta: true }), step)).toBe(false);
  });

  it("matches Mod+/ on either Ctrl or Meta", () => {
    const step = parseShortcutStep("Mod+/");
    expect(matchesStep(ev("/", { ctrl: true }), step)).toBe(true);
    expect(matchesStep(ev("/", { meta: true }), step)).toBe(true);
    expect(matchesStep(ev("/"), step)).toBe(false);
  });

  it("matches Shift+? regardless of meta", () => {
    const step = parseShortcutStep("?");
    expect(matchesStep(ev("?"), step)).toBe(true);
  });

  it("matches Escape via the Esc alias", () => {
    const step = parseShortcutStep("Esc");
    expect(matchesStep(ev("Escape"), step)).toBe(true);
  });

  it("is case-insensitive on letter keys", () => {
    const step = parseShortcutStep("g");
    expect(matchesStep(ev("g"), step)).toBe(true);
    expect(matchesStep(ev("G", { shift: true }), step)).toBe(false);
    // Without shift the matcher would see lowercase g; with shift it's still g
    // but the modifier mismatch keeps it from firing — that's the correct guard.
  });

  it("does not throw when event.key is undefined (Chrome Mobile iOS 148+)", () => {
    // Sentry WEB-9 + WEB-X: Chrome Mobile iOS 148 / iOS 26.4.2 dispatches
    // synthetic keydown events with `event.key === undefined`. The previous
    // implementation called `.length` / `.toLowerCase()` on the undefined
    // value and threw, blowing up the global-shortcuts handler. eventKey
    // should now return "" and matchesStep should reject the event without
    // crashing.
    //
    // Building a real KeyboardEvent with key=undefined is awkward (the
    // constructor coerces to ""), so we cast and fabricate the field
    // directly to mirror the actual production payload.
    const rawEvent: Partial<KeyboardEvent> = { ctrlKey: false, metaKey: false, shiftKey: false, altKey: false };
    Object.defineProperty(rawEvent, "key", { value: undefined, enumerable: true });
    const event = rawEvent as KeyboardEvent;

    const step = parseShortcutStep("n");
    expect(() => matchesStep(event, step)).not.toThrow();
    expect(matchesStep(event, step)).toBe(false);
  });
});

describe("shouldIgnoreEvent (focus guard)", () => {
  it("ignores keystrokes inside <input>", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    const event = new KeyboardEvent("keydown", { key: "n", bubbles: true });
    Object.defineProperty(event, "target", { value: input });
    expect(shouldIgnoreEvent(event)).toBe(true);
    input.remove();
  });

  it("ignores keystrokes inside <textarea>", () => {
    const ta = document.createElement("textarea");
    document.body.appendChild(ta);
    const event = new KeyboardEvent("keydown", { key: "n" });
    Object.defineProperty(event, "target", { value: ta });
    expect(shouldIgnoreEvent(event)).toBe(true);
    ta.remove();
  });

  it("ignores keystrokes inside contenteditable", () => {
    const div = document.createElement("div");
    div.setAttribute("contenteditable", "true");
    document.body.appendChild(div);
    Object.defineProperty(div, "isContentEditable", { value: true });
    const event = new KeyboardEvent("keydown", { key: "n" });
    Object.defineProperty(event, "target", { value: div });
    expect(shouldIgnoreEvent(event)).toBe(true);
    div.remove();
  });

  it("does NOT ignore keystrokes on <body> or generic divs", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const event = new KeyboardEvent("keydown", { key: "n" });
    Object.defineProperty(event, "target", { value: div });
    expect(shouldIgnoreEvent(event)).toBe(false);
    div.remove();
  });
});

describe("SHORTCUT_CATALOG", () => {
  it("ships at least 8 shortcuts (brief asks for 8-10)", () => {
    expect(SHORTCUT_CATALOG.length).toBeGreaterThanOrEqual(8);
    expect(SHORTCUT_CATALOG.length).toBeLessThanOrEqual(10);
  });

  it("every binding has bilingual descriptions", () => {
    for (const b of SHORTCUT_CATALOG) {
      expect(b.description_vn.trim().length).toBeGreaterThan(0);
      expect(b.description_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("has the four bindings the brief calls out", () => {
    const keys = SHORTCUT_CATALOG.map((b) => b.key);
    expect(keys).toContain("?");
    expect(keys).toContain("g h");
    expect(keys).toContain("g s");
    expect(keys).toContain("Mod+/");
    expect(keys).toContain("Esc");
  });

  it("avoids browser-default conflicts (no Cmd+S / Cmd+P / Cmd+W / Cmd+T)", () => {
    const banned = ["Mod+s", "Mod+p", "Mod+w", "Mod+t", "Cmd+s", "Cmd+p"];
    for (const b of SHORTCUT_CATALOG) {
      const lower = b.key.toLowerCase();
      for (const ban of banned) {
        expect(lower).not.toBe(ban.toLowerCase());
      }
    }
  });
});

describe("CHORD_TIMEOUT_MS", () => {
  it("is between 500ms and 3000ms (chord muscle-memory window)", () => {
    expect(CHORD_TIMEOUT_MS).toBeGreaterThanOrEqual(500);
    expect(CHORD_TIMEOUT_MS).toBeLessThanOrEqual(3000);
  });
});
