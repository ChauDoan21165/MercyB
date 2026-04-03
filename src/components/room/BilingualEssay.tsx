// src/components/room/BilingualEssay.tsx
// MB-BLUE-99.6 — FIXED
//
// ESSAY ZOOM (CURRENT APP SYSTEM):
// - Reads localStorage("mb.ui.zoom")
// - Syncs with CSS var --mb-essay-zoom
// - Applies zoom by scaling BASE FONT SIZE (safe layout)
// - No legacy mbEssayZoom / mb:essayZoom dependency

import React, { useEffect, useMemo, useState } from "react";

type BilingualEssayProps = {
  title?: string;
  en?: string;
  vi?: string;
};

const LS_ZOOM = "mb.ui.zoom";
const DEFAULT_ZOOM = 100;

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function readZoomPct(): number {
  try {
    const raw = Number(localStorage.getItem(LS_ZOOM));
    if (Number.isFinite(raw)) return clamp(Math.round(raw), 60, 140);
  } catch {
    // ignore
  }

  try {
    const css = getComputedStyle(document.documentElement)
      .getPropertyValue("--mb-essay-zoom")
      .trim();
    const parsed = Number(css);
    if (Number.isFinite(parsed)) return clamp(Math.round(parsed), 60, 140);
  } catch {
    // ignore
  }

  return DEFAULT_ZOOM;
}

export function BilingualEssay({ title, en, vi }: BilingualEssayProps) {
  const [zoomPct, setZoomPct] = useState<number>(() => readZoomPct());

  useEffect(() => {
    const sync = () => {
      setZoomPct(readZoomPct());
    };

    sync();

    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === LS_ZOOM) sync();
    };

    const obs = new MutationObserver(() => sync());
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "data-mb-zoom"],
    });

    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
      obs.disconnect();
    };
  }, []);

  const baseFontPx = useMemo(() => {
    return Math.round(16 * (zoomPct / 100));
  }, [zoomPct]);

  return (
    <div
      style={{
        fontSize: `${baseFontPx}px`,
        lineHeight: 1.7,
      }}
    >
      {title ? (
        <h3
          style={{
            fontSize: "1.25em",
            fontWeight: 800,
            lineHeight: 1.25,
            margin: "0 0 12px",
          }}
        >
          {title}
        </h3>
      ) : null}

      {en ? (
        <div
          style={{
            marginTop: 0,
            marginBottom: vi ? 16 : 0,
            whiteSpace: "pre-wrap",
          }}
        >
          {en}
        </div>
      ) : null}

      {vi ? (
        <div
          style={{
            marginTop: 0,
            marginBottom: 0,
            whiteSpace: "pre-wrap",
          }}
        >
          {vi}
        </div>
      ) : null}
    </div>
  );
}

export default BilingualEssay;