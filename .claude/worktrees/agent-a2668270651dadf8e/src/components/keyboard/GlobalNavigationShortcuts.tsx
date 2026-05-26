// src/components/keyboard/GlobalNavigationShortcuts.tsx
//
// Step 11 — registers the app-wide navigation chords (g h / g s / g m
// and Mod+/) at the router level. Mounted at the root once; the
// per-route shortcuts (n / p / r) are owned by the route components.
//
// This component renders nothing — it's a hook holder.

import React from "react";
import { useNavigate } from "react-router-dom";

import { useGlobalKeyboardShortcut } from "@/lib/keyboard/globalShortcuts";

export default function GlobalNavigationShortcuts(): React.ReactElement {
  const navigate = useNavigate();

  useGlobalKeyboardShortcut("g h", () => navigate("/"));
  useGlobalKeyboardShortcut("g s", () => navigate("/rooms"));
  useGlobalKeyboardShortcut("g m", () => navigate("/mercy"));

  // Mod+/ — try to focus the search input. Falls back to navigating
  // /rooms (the search-bar host) if no input with data-shortcut="search"
  // is currently mounted.
  useGlobalKeyboardShortcut("Mod+/", () => {
    if (typeof document === "undefined") return;
    const input = document.querySelector<HTMLInputElement>(
      "input[data-shortcut='search']",
    );
    if (input) {
      input.focus();
      return;
    }
    navigate("/rooms");
  });

  return <></>;
}
