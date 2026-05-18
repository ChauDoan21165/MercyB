// src/components/native/AndroidBackButton.tsx
//
// Cat-4 native shell — M1. Android-only hardware Back handler.
//
// Without this, Capacitor's default backButton behavior runs WebView
// history-back and then EXITS the app the moment history is empty —
// ignoring open modals/drawers and with no confirmation. This component
// installs a single app-level listener (mounted once at the router root,
// the same headless-hook-holder pattern as GlobalNavigationShortcuts) so
// hardware Back behaves like a native Android app:
//
//   1. An overlay is open  → close it (dispatch Escape; Radix
//      Dialog/AlertDialog/Sheet + the MercyGuide panel all close on it).
//   2. Not at the home route → in-app back (history -1).
//   3. At the home route    → press-twice-to-exit (2s window) instead of
//      a silent instant kill.
//
// @capacitor/app is already installed and wired in both native projects,
// so this is a pure src/ change. The listener is a no-op on web/iOS;
// it is additionally gated to Android so nothing registers off-platform.
//
// Renders nothing.

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { App } from "@capacitor/app";
import type { PluginListenerHandle } from "@capacitor/core";

import { getPlatform } from "@/lib/platform";
import { toast } from "@/components/ui/use-toast";

/** Selectors for a "currently open" dismissible overlay. Radix sets
 *  data-state="open" + role on the content node for Dialog ("dialog"),
 *  AlertDialog ("alertdialog") and Sheet (Dialog under the hood). */
const OPEN_OVERLAY_SELECTOR =
  '[data-state="open"][role="dialog"],[data-state="open"][role="alertdialog"]';

/** Window (ms) within which a second Back press at the root exits. */
const EXIT_CONFIRM_WINDOW_MS = 2000;

export default function AndroidBackButton(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  // location is read inside the listener via a ref so the handler always
  // sees the live pathname without re-registering the native listener on
  // every navigation (re-registering would race with rapid Back presses).
  const pathRef = React.useRef(location.pathname);
  pathRef.current = location.pathname;

  React.useEffect(() => {
    if (getPlatform() !== "android") return;

    let handle: PluginListenerHandle | undefined;
    let lastBackAt = 0;
    let cancelled = false;

    const onBack = () => {
      // 1) Close an open modal/drawer first.
      const openOverlay = document.querySelector(OPEN_OVERLAY_SELECTOR);
      if (openOverlay) {
        document.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "Escape",
            bubbles: true,
            cancelable: true,
          }),
        );
        return;
      }

      // 2) In-app back when we're not at the home route.
      if (pathRef.current !== "/") {
        navigate(-1);
        return;
      }

      // 3) At root — press twice to exit.
      const now = Date.now();
      if (now - lastBackAt < EXIT_CONFIRM_WINDOW_MS) {
        void App.exitApp();
        return;
      }
      lastBackAt = now;
      toast({ description: "Nhấn lần nữa để thoát ứng dụng" });
    };

    void App.addListener("backButton", onBack).then((h) => {
      if (cancelled) {
        void h.remove();
        return;
      }
      handle = h;
    });

    return () => {
      cancelled = true;
      void handle?.remove();
    };
  }, [navigate]);

  return <></>;
}
