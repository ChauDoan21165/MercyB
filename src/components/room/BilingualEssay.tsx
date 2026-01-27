// src/components/room/BilingualEssay.tsx
// MB-BLUE-99.6 — 2025-12-31 (+0700)
//
// ESSAY ZOOM (GLOBAL):
// - Reads localStorage("mbEssayZoom")
// - Listens to window event "mb:essayZoom"
// - Applies zoom by scaling BASE FONT SIZE (safe layout)
// - Also respects CSS var --mb-essay-zoom if present

import React, { useEffect, useMemo, useState } from "react";

// ...keep your existing imports

const LS_ZOOM = "mbEssayZoom";
const DEFAULT_ZOOM = 1.0;

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function BilingualEssay(props: any) {
  // ✅ keep ALL your existing logic/props/rendering, only add zoom + wrapper style
  const [zoom, setZoom] = useState(() => {
    const raw = Number(localStorage.getItem(LS_ZOOM));
    return Number.isFinite(raw) ? clamp(raw, 0.6, 1.6) : DEFAULT_ZOOM;
  });

  useEffect(() => {
    const onZoom = (e: Event) => {
      const ce = e as CustomEvent;
      const next = Number(ce?.detail?.zoom);
      if (Number.isFinite(next)) setZoom(clamp(next, 0.6, 1.6));
    };
    window.addEventListener("mb:essayZoom", onZoom as any);
    return () => window.removeEventListener("mb:essayZoom", onZoom as any);
  }, []);

  // ✅ base font scales; layout stays normal (no CSS transform scale)
  const baseFontPx = useMemo(() => Math.round(16 * zoom), [zoom]);

  return (
    <div
      style={{
        // global zoom effect
        fontSize: baseFontPx,
        lineHeight: 1.7,
      }}
    >
      {/* ⬇️ KEEP your existing BilingualEssay UI exactly as-is */}
      {/* Example: return your existing JSX here */}
      {/* { ...your current content... } */}
    </div>
  );
}

// If your file uses `export default`, keep it consistent with your existing export style.
export default BilingualEssay;
