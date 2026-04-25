// src/lib/keyboard/globalShortcuts.ts
//
// Step 11 — global keyboard-shortcut system. Components register
// shortcuts at document level via `useGlobalKeyboardShortcut`; the
// hook handles modifier matching, single-key + chord support, focus
// guards (don't fire when typing in inputs), and cleanup on unmount.
//
// Pure module — no React imports outside the hook itself, no Supabase,
// so vitest can hit the matcher directly.

import { useEffect, useRef } from "react";

export type ShortcutCategory =
  | "navigation"
  | "study"
  | "audio"
  | "system";

/**
 * A single shortcut binding. The `key` field follows a small
 * MercyBlade-internal grammar:
 *
 *   "?"        → literal key
 *   "Esc"      → literal key alias for "Escape"
 *   "Mod+/"    → Ctrl+/ on Windows/Linux, Cmd+/ on Mac
 *   "Shift+n"  → Shift modifier + n
 *   "g h"      → chord — press g, then h within 1.5s
 *
 * Multiple modifiers combine with `+`. Chord steps separate with a space.
 * Case is normalised to lower for the letter portion; modifiers stay
 * capitalised in the key string.
 */
export interface ShortcutBinding {
  key: string;
  category: ShortcutCategory;
  /** Short bilingual description for the help overlay. */
  description_vn: string;
  description_en: string;
}

/** How long the chord matcher waits for the second keystroke. */
export const CHORD_TIMEOUT_MS = 1500;

interface ParsedKey {
  /** "key" from KeyboardEvent, lower-cased for letters. */
  key: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  alt: boolean;
  /** True when the binding used the `Mod+` alias. */
  mod: boolean;
}

/** Parse one step of the binding grammar. */
export function parseShortcutStep(step: string): ParsedKey {
  const parts = step.split("+");
  const last = parts[parts.length - 1];
  const modifiers = parts.slice(0, -1).map((m) => m.toLowerCase());
  return {
    key: normalizeKey(last),
    ctrl: modifiers.includes("ctrl"),
    meta: modifiers.includes("cmd") || modifiers.includes("meta"),
    shift: modifiers.includes("shift"),
    alt: modifiers.includes("alt") || modifiers.includes("option"),
    mod: modifiers.includes("mod"),
  };
}

function normalizeKey(raw: string): string {
  if (!raw) return "";
  if (raw === "Esc" || raw === "Escape") return "escape";
  if (raw === "?") return "?";
  if (raw === "/") return "/";
  if (raw.length === 1) return raw.toLowerCase();
  return raw.toLowerCase();
}

function eventKey(event: KeyboardEvent): string {
  const k = event.key;
  if (k === "Escape") return "escape";
  if (k.length === 1) return k.toLowerCase();
  return k.toLowerCase();
}

/** True iff the given event matches the parsed step. */
export function matchesStep(event: KeyboardEvent, step: ParsedKey): boolean {
  if (eventKey(event) !== step.key) return false;
  // Mod+ matches either ctrl (non-Mac) or meta (Mac). Either is fine.
  if (step.mod && !(event.ctrlKey || event.metaKey)) return false;
  if (!step.mod) {
    if (step.ctrl !== event.ctrlKey) return false;
    if (step.meta !== event.metaKey) return false;
  }
  if (step.shift !== event.shiftKey) return false;
  if (step.alt !== event.altKey) return false;
  return true;
}

/**
 * True when keyboard input should be ignored — the user is typing in a
 * text field, contenteditable, or a search input. We exempt the `?`
 * key from this guard so help is always reachable, even from inside a
 * textarea.
 */
export function shouldIgnoreEvent(event: KeyboardEvent): boolean {
  const target = event.target as HTMLElement | null;
  if (!target) return false;
  const tag = (target.tagName || "").toUpperCase();
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  const ce = (target as HTMLElement).isContentEditable;
  return ce === true;
}

export interface ShortcutOptions {
  /**
   * When true (default), input/textarea/contenteditable focus disables
   * the shortcut. Set false for "always-on" shortcuts (e.g. Esc to
   * close a modal that was opened from within a search field).
   */
  respectInputFocus?: boolean;
  /**
   * When true (default), `event.preventDefault()` runs after a match.
   * Set false when the binding is informational only (logging or no-op).
   */
  preventDefault?: boolean;
  /** Disable the shortcut without unmounting the hook. */
  enabled?: boolean;
}

/**
 * React hook: register a global shortcut for the lifetime of the
 * component. The callback is invoked with the matched event so callers
 * can inspect modifiers if they need to.
 *
 * Chord support: pass `"g h"` and the hook will track the first step
 * for up to CHORD_TIMEOUT_MS, firing only if the second step lands in
 * time (and no modifier-only event interrupts).
 */
export function useGlobalKeyboardShortcut(
  binding: string,
  callback: (event: KeyboardEvent) => void,
  options: ShortcutOptions = {},
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (options.enabled === false) return;

    const steps = binding.split(/\s+/).map(parseShortcutStep);
    const respectFocus = options.respectInputFocus !== false;
    const preventDefault = options.preventDefault !== false;

    let chordIndex = 0;
    let chordTimer: ReturnType<typeof setTimeout> | null = null;

    function resetChord(): void {
      chordIndex = 0;
      if (chordTimer !== null) {
        clearTimeout(chordTimer);
        chordTimer = null;
      }
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (respectFocus && shouldIgnoreEvent(event)) {
        // The `?` literal is considered always-on so help is reachable.
        if (steps.length === 1 && steps[0].key === "?") {
          // fallthrough — let the matcher run
        } else {
          return;
        }
      }

      const step = steps[chordIndex];
      if (!matchesStep(event, step)) {
        // Non-matching key resets a chord-in-progress so a stray
        // keystroke doesn't mis-fire the next chord step.
        if (chordIndex > 0 && !isModifierOnlyEvent(event)) {
          resetChord();
        }
        return;
      }

      chordIndex += 1;

      if (chordIndex < steps.length) {
        if (chordTimer !== null) clearTimeout(chordTimer);
        chordTimer = setTimeout(resetChord, CHORD_TIMEOUT_MS);
        if (preventDefault) event.preventDefault();
        return;
      }

      // Full match.
      resetChord();
      if (preventDefault) event.preventDefault();
      callbackRef.current(event);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      resetChord();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [binding, options.enabled]);
}

function isModifierOnlyEvent(event: KeyboardEvent): boolean {
  const k = event.key;
  return k === "Shift" || k === "Control" || k === "Meta" || k === "Alt";
}

// ── Catalog of MercyBlade shortcuts ──────────────────────────────────────
//
// One source of truth. The help overlay reads from this list; route
// pages register handlers for the bindings relevant to them. Keep this
// list short — extra shortcuts dilute the muscle memory of the ones
// that matter.

export const SHORTCUT_CATALOG: ReadonlyArray<ShortcutBinding> = Object.freeze([
  {
    key: "?",
    category: "system",
    description_vn: "Mở danh sách phím tắt",
    description_en: "Open shortcut help",
  },
  {
    key: "g h",
    category: "navigation",
    description_vn: "Về trang chủ",
    description_en: "Go to Home",
  },
  {
    key: "g s",
    category: "navigation",
    description_vn: "Mở danh sách phòng học",
    description_en: "Go to Study (rooms)",
  },
  {
    key: "g m",
    category: "navigation",
    description_vn: "Mở Teacher Mercy",
    description_en: "Go to Mercy chat",
  },
  {
    key: "Mod+/",
    category: "navigation",
    description_vn: "Tìm kiếm",
    description_en: "Focus search",
  },
  {
    key: "n",
    category: "study",
    description_vn: "Câu / bài kế tiếp",
    description_en: "Next exercise",
  },
  {
    key: "p",
    category: "study",
    description_vn: "Câu / bài trước đó",
    description_en: "Previous exercise",
  },
  {
    key: "r",
    category: "audio",
    description_vn: "Lặp lại âm thanh",
    description_en: "Repeat audio",
  },
  {
    key: "Esc",
    category: "system",
    description_vn: "Đóng cửa sổ / hội thoại",
    description_en: "Close current modal",
  },
]);
