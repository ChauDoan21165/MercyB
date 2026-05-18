// src/pages/home/LanguageTrackHome.tsx
//
// Home rendering for a NON-English primary target (e.g. vi→ja, en→es).
// This is a NEW surface — it does NOT modify the canonical (vi→en)
// Home. Per locked #14 the existing Home stays byte-identical for the
// 95% (vi,en) audience; other pairs render their own focused home that
// points the learner straight at their /languages track.
//
// TargetSwitcher is also exported and reused by Home.tsx so a
// multi-target user whose primary IS English still gets the switcher
// above the otherwise-unchanged canonical home.

import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import {
  TARGET_META,
  type NativeLang,
  type TargetLang,
} from "@/lib/onboarding/types";
import { usePairMutation, withPrimary } from "@/lib/languagePair/languagePair";

/** Compact horizontal switcher over the user's OWN chosen targets only
 *  (not the all-8 portfolio). Clicking a non-primary makes it primary
 *  and persists; the shared profile cache invalidation re-renders Home
 *  into the right surface (canonical en-home or a track home). */
export function TargetSwitcher({
  targets,
  primaryTarget,
}: {
  targets: TargetLang[];
  primaryTarget: TargetLang | null;
}) {
  const { persist } = usePairMutation();
  if (targets.length < 2) return null;

  const onPick = (t: TargetLang) => {
    if (t === primaryTarget) return;
    void persist({ target_languages: withPrimary(targets, t) });
  };

  return (
    <nav
      aria-label="Switch learning language"
      style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        padding: "10px 16px",
        background: "rgba(255,255,255,0.92)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 60,
      }}
    >
      {targets.map((t) => {
        const meta = TARGET_META[t];
        const active = t === primaryTarget;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onPick(t)}
            aria-current={active ? "true" : undefined}
            style={{
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              borderRadius: 9999,
              border: `1px solid ${active ? "rgba(180,60,100,0.55)" : "rgba(0,0,0,0.12)"}`,
              background: active
                ? "linear-gradient(135deg, #B45309 0%, #D97706 50%, #14B8A6 100%)"
                : "white",
              color: active ? "white" : "rgba(15,23,42,0.85)",
              fontSize: 13,
              fontWeight: 800,
              padding: "7px 14px",
              cursor: active ? "default" : "pointer",
            }}
          >
            <span aria-hidden>{meta.flag}</span>
            {meta.labelVi}
          </button>
        );
      })}
    </nav>
  );
}

export default function LanguageTrackHome({
  nativeLanguage,
  targets,
  primaryTarget,
}: {
  nativeLanguage: NativeLang | null;
  targets: TargetLang[];
  primaryTarget: TargetLang | null;
}) {
  const nav = useNavigate();
  // Home only renders this for a non-English, non-null primary, but
  // stay defensive: fall back Home rather than crash.
  const meta = primaryTarget ? TARGET_META[primaryTarget] : null;
  const slug = meta?.slug ?? null;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(255,240,248,0.55) 0%, rgba(252,249,243,0.96) 40%, rgba(248,247,250,1) 100%)",
      }}
    >
      <TargetSwitcher targets={targets} primaryTarget={primaryTarget} />

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 16px 96px" }}>
        <section aria-label="Homepage hero" style={{ textAlign: "center" }}>
          <h1
            style={{
              margin: 0,
              fontSize: 30,
              fontWeight: 950,
              letterSpacing: -1,
              lineHeight: 1.05,
              color: "rgba(15,23,42,0.95)",
            }}
          >
            <span>Small Steps.</span>{" "}
            <span style={{ color: "rgba(180,83,9,0.95)" }}>Real Progress.</span>
          </h1>
          <div
            style={{
              marginTop: 8,
              fontSize: 16,
              fontWeight: 800,
              color: "rgba(15,23,42,0.78)",
            }}
          >
            Real language.{" "}
            <span style={{ color: "rgba(13,148,136,0.92)" }}>
              Real progress.
            </span>
          </div>
        </section>

        {slug ? (
          <button
            type="button"
            onClick={() => nav(`/languages/${slug}`)}
            aria-label={`Open ${meta?.labelEn} track`}
            style={{
              marginTop: 26,
              width: "100%",
              textAlign: "left",
              borderRadius: 20,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "white",
              boxShadow: "0 10px 28px rgba(0,0,0,0.06)",
              padding: "20px 18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span style={{ fontSize: 40, lineHeight: 1, flexShrink: 0 }} aria-hidden>
              {meta?.flag}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  display: "block",
                  fontSize: 19,
                  fontWeight: 900,
                  color: "rgba(15,23,42,0.92)",
                }}
              >
                Học {meta?.labelVi}
              </span>
              <span
                style={{
                  display: "block",
                  marginTop: 2,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "rgba(0,0,0,0.5)",
                }}
              >
                Learn {meta?.labelEn} — tiếp tục lộ trình của bạn
              </span>
            </span>
            <ChevronRight size={22} color="rgba(180,60,100,0.75)" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => nav("/")}
            style={{
              marginTop: 26,
              width: "100%",
              borderRadius: 9999,
              border: "none",
              background:
                "linear-gradient(135deg, #B45309 0%, #D97706 50%, #14B8A6 100%)",
              color: "white",
              fontSize: 15,
              fontWeight: 800,
              padding: "12px 18px",
              cursor: "pointer",
            }}
          >
            Về trang chính · Go home
          </button>
        )}

        <p
          style={{
            marginTop: 16,
            textAlign: "center",
            fontSize: 12,
            fontWeight: 500,
            color: "rgba(0,0,0,0.42)",
            lineHeight: 1.5,
          }}
        >
          {nativeLanguage === "en"
            ? "Change your languages anytime in Settings."
            : "Bạn có thể đổi ngôn ngữ bất cứ lúc nào trong phần Cài đặt."}
        </p>
      </div>
    </div>
  );
}
