// Home: Mercy's "what should I practice tonight?" card.
//
// Self-contained, lazy-loading. Owns its own fetch on mount so Home
// doesn't auto-trigger a recommendation request. Hidden when:
//   - feature flag practice_recommendations_enabled is OFF
//   - user is anonymous
//   - getRecommendation returned null (no signal yet, or all
//     eligible rules on cooldown)
//
// One recommendation visible at a time per the brief — no list view.
// Tapping the CTA navigates to the recommendation's `target` (a
// roomId becomes /room/<id>; a route path is used verbatim).

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, ChevronRight, ChevronDown, Clock, Sparkles } from "lucide-react";

import { useAuth } from "@/providers/AuthProvider";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import {
  getRecommendation,
  recordRecommendationShown,
  type Recommendation,
} from "@/lib/mercy/practiceRecommendations";

export default function PracticeRecommendationCard() {
  const { user } = useAuth();
  const { enabled } = useFeatureFlag("practice_recommendations_enabled", false);

  const [rec, setRec] = useState<Recommendation | null>(null);
  const [whyOpen, setWhyOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    if (!enabled || !user?.id) {
      setRec(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getRecommendation(user.id)
      .then((next) => {
        if (cancelled) return;
        setRec(next);
        if (next && user.id) recordRecommendationShown(user.id, next);
      })
      .catch(() => {
        if (cancelled) return;
        setRec(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, user?.id]);

  const onStart = useCallback(() => {
    if (!rec?.target) return;
    if (rec.target.startsWith("/")) {
      nav(rec.target);
    } else {
      nav(`/room/${rec.target}`);
    }
  }, [nav, rec]);

  if (!enabled || loading || !rec) return null;

  return (
    <section
      aria-label="Gợi ý luyện tập của Mercy · Mercy's practice recommendation"
      style={shellStyle}
    >
      <header style={headerStyle}>
        <div style={iconBadgeStyle}>
          <Compass size={20} color="white" aria-hidden />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={titleViStyle}>{rec.title_vi}</div>
          <div style={titleEnStyle}>{rec.title_en}</div>
        </div>
        <div style={timeChipStyle} aria-label={`Khoảng ${rec.estimated_minutes} phút`}>
          <Clock size={12} aria-hidden />
          {rec.estimated_minutes}m
        </div>
      </header>

      <p style={descStyle}>{rec.description_vi}</p>
      <p style={descEnStyle}>{rec.description_en}</p>

      <div style={ctaRowStyle}>
        <button type="button" onClick={onStart} style={primaryBtnStyle} disabled={!rec.target}>
          <Sparkles size={14} aria-hidden />
          Bắt đầu · Start
          <ChevronRight size={14} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => setWhyOpen((v) => !v)}
          style={whyToggleStyle}
          aria-expanded={whyOpen}
        >
          <ChevronDown
            size={12}
            aria-hidden
            style={{
              transform: whyOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 150ms",
            }}
          />
          Vì sao gợi ý? · Why this?
        </button>
      </div>

      {whyOpen && (
        <div style={whyBoxStyle}>
          <div style={{ color: "rgba(15,23,42,0.85)", fontSize: 13 }}>{rec.why_this_matters_vi}</div>
          <div style={{ color: "rgba(67,56,202,0.75)", fontSize: 12, marginTop: 4 }}>
            {rec.why_this_matters_en}
          </div>
        </div>
      )}
    </section>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────

const shellStyle: React.CSSProperties = {
  marginTop: 12,
  borderRadius: 18,
  padding: "14px 16px",
  background:
    "linear-gradient(150deg, rgba(238,242,255,0.96) 0%, rgba(252,252,255,0.96) 100%)",
  border: "1px solid rgba(99,102,241,0.20)",
  boxShadow: "0 10px 28px rgba(79,70,229,0.08)",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const iconBadgeStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 12,
  background: "linear-gradient(180deg, #818CF8 0%, #6366F1 100%)",
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  boxShadow: "0 6px 16px rgba(99,102,241,0.20)",
};

const titleViStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 900,
  color: "rgba(15,23,42,0.92)",
  letterSpacing: -0.2,
};

const titleEnStyle: React.CSSProperties = {
  marginTop: 2,
  fontSize: 12,
  fontWeight: 700,
  color: "rgba(67,56,202,0.65)",
};

const timeChipStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "4px 10px",
  borderRadius: 9999,
  background: "rgba(99,102,241,0.10)",
  color: "rgba(67,56,202,0.85)",
  fontSize: 11,
  fontWeight: 800,
  flexShrink: 0,
};

const descStyle: React.CSSProperties = {
  marginTop: 10,
  marginBottom: 0,
  fontSize: 13,
  lineHeight: 1.5,
  color: "rgba(0,0,0,0.66)",
};

const descEnStyle: React.CSSProperties = {
  marginTop: 4,
  marginBottom: 0,
  fontSize: 12,
  lineHeight: 1.45,
  color: "rgba(0,0,0,0.45)",
};

const ctaRowStyle: React.CSSProperties = {
  marginTop: 12,
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

const primaryBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 14px",
  borderRadius: 9999,
  background: "linear-gradient(150deg, #6366F1 0%, #4F46E5 100%)",
  color: "white",
  border: "none",
  fontSize: 13,
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 6px 18px rgba(79,70,229,0.25)",
};

const whyToggleStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "6px 10px",
  borderRadius: 9999,
  background: "transparent",
  color: "rgba(67,56,202,0.80)",
  border: "1px solid rgba(99,102,241,0.25)",
  fontSize: 11,
  fontWeight: 700,
  cursor: "pointer",
};

const whyBoxStyle: React.CSSProperties = {
  marginTop: 10,
  padding: "10px 12px",
  borderRadius: 12,
  background: "rgba(99,102,241,0.06)",
  border: "1px solid rgba(99,102,241,0.18)",
};
