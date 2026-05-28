// src/components/keyboard/ShortcutHelpOverlay.tsx
//
// Step 11 — modal showing the shortcut catalog grouped by category.
// Mounted at the app root so the "?" keystroke can open it from any
// page. Self-contained — handles its own open/close + Esc-to-close.

import React, { useState } from "react";

import {
  SHORTCUT_CATALOG,
  useGlobalKeyboardShortcut,
  type ShortcutBinding,
  type ShortcutCategory,
} from "@/lib/keyboard/globalShortcuts";

const CATEGORY_LABELS: Record<ShortcutCategory, { vn: string; en: string }> = {
  navigation: { vn: "Điều hướng", en: "Navigation" },
  study: { vn: "Học", en: "Study" },
  audio: { vn: "Âm thanh", en: "Audio" },
  system: { vn: "Hệ thống", en: "System" },
};

const CATEGORY_ORDER: ShortcutCategory[] = ["navigation", "study", "audio", "system"];

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 10000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(15, 23, 42, 0.55)",
  padding: 16,
};

const dialogStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 540,
  maxHeight: "85vh",
  overflowY: "auto",
  background: "white",
  color: "#0f172a",
  borderRadius: 16,
  boxShadow: "0 20px 50px rgba(15,23,42,0.25)",
  padding: 24,
};

export default function ShortcutHelpOverlay(): React.ReactElement {
  const [open, setOpen] = useState(false);

  // "?" toggles open. The hook treats "?" as always-on so it works
  // even from inside a textarea — that's intentional.
  useGlobalKeyboardShortcut("?", () => setOpen((v) => !v));

  // Esc closes the overlay when it's open. We only register the Esc
  // handler while open so we don't fight other Esc handlers on the page.
  useGlobalKeyboardShortcut(
    "Esc",
    () => setOpen(false),
    { enabled: open, respectInputFocus: false },
  );

  if (!open) return <></>;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      style={overlayStyle}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      data-testid="shortcut-help-overlay"
    >
      <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
        <header style={{ marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
            Phím tắt MercyBlade
          </h2>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 13,
              color: "#64748b",
            }}
          >
            MercyBlade keyboard shortcuts. Press{" "}
            <kbd style={kbdInlineStyle}>?</kbd> any time to open this list.
          </p>
        </header>

        {CATEGORY_ORDER.map((category) => {
          const items = SHORTCUT_CATALOG.filter((b) => b.category === category);
          if (items.length === 0) return null;
          return (
            <section key={category} style={{ marginTop: 16 }}>
              <h3
                style={{
                  margin: "0 0 8px",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: "#92400e",
                }}
              >
                {CATEGORY_LABELS[category].vn}
                <span style={{ color: "#64748b" }}>
                  {" "}/ {CATEGORY_LABELS[category].en}
                </span>
              </h3>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {items.map((binding) => (
                  <ShortcutRow key={binding.key} binding={binding} />
                ))}
              </ul>
            </section>
          );
        })}

        <footer style={{ marginTop: 20, textAlign: "right" }}>
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={closeButtonStyle}
            aria-label="Close shortcut help"
          >
            Đóng / Close (Esc)
          </button>
        </footer>
      </div>
    </div>
  );
}

function ShortcutRow({ binding }: { binding: ShortcutBinding }): React.ReactElement {
  return (
    <li style={rowStyle}>
      <KeyDisplay keyString={binding.key} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, color: "#0f172a" }}>
          {binding.description_vn}
        </p>
        <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
          {binding.description_en}
        </p>
      </div>
    </li>
  );
}

function KeyDisplay({ keyString }: { keyString: string }): React.ReactElement {
  const steps = keyString.split(/\s+/);
  return (
    <div style={{ display: "flex", gap: 4, flexShrink: 0, alignItems: "center" }}>
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          {i > 0 ? (
            <span style={{ color: "#64748b", fontSize: 11 }}>then</span>
          ) : null}
          <KeyChord chord={step} />
        </React.Fragment>
      ))}
    </div>
  );
}

function KeyChord({ chord }: { chord: string }): React.ReactElement {
  const parts = chord.split("+");
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {parts.map((part, i) => (
        <kbd key={i} style={kbdStyle}>
          {prettyKey(part)}
        </kbd>
      ))}
    </span>
  );
}

function prettyKey(raw: string): string {
  switch (raw) {
    case "Mod":
      return "⌘ / Ctrl";
    case "Cmd":
      return "⌘";
    case "Esc":
    case "Escape":
      return "Esc";
    case "Shift":
      return "Shift";
    case "Ctrl":
      return "Ctrl";
    case "Alt":
      return "Alt";
    default:
      return raw.length === 1 ? raw.toUpperCase() : raw;
  }
}

const kbdStyle: React.CSSProperties = {
  display: "inline-block",
  minWidth: 24,
  padding: "2px 8px",
  borderRadius: 6,
  border: "1px solid #cbd5e1",
  background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  fontSize: 13,
  fontWeight: 600,
  color: "#0f172a",
  textAlign: "center",
  boxShadow: "0 1px 0 rgba(15,23,42,0.1)",
};

const kbdInlineStyle: React.CSSProperties = { ...kbdStyle, fontSize: 11 };

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "10px 0",
  borderBottom: "1px solid #f1f5f9",
};

const closeButtonStyle: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 8,
  border: "1px solid #cbd5e1",
  background: "#fff7ed",
  color: "#9a3412",
  fontWeight: 600,
  cursor: "pointer",
};
