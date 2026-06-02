// src/features/review/ReviewNavEntry.tsx — the module's single shared-shell
// nav entry. Self-gating: renders nothing when FEATURE_REVIEW is off, so the
// shell can mount it unconditionally and the live app is unaffected while the
// flag is off. Style mirrors the existing GlobalHeader pill buttons.

import React from "react";
import { useNavigate } from "react-router-dom";

import { FEATURE_REVIEW } from "./flag";

export default function ReviewNavEntry() {
  const nav = useNavigate();
  if (!FEATURE_REVIEW) return null;
  return (
    <button
      type="button"
      onClick={() => nav("/review")}
      className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/5"
      aria-label="Ôn tập"
    >
      <span className="inline-flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-500" />
        <span>Ôn tập / Review</span>
      </span>
    </button>
  );
}
