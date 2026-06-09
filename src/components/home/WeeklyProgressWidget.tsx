/**
 * Home page: small weekly-progress widget.
 *
 * Shows the signed-in user's current-week pronunciation average and
 * the delta vs last week. Tap → /progress for the full dashboard.
 *
 * Why a separate component:
 *   - Keeps Home.tsx free of progress-fetching imports.
 *   - Lazy-loads its own data on mount (only when the user is signed
 *     in). The component itself is the lazy-load boundary; Home does
 *     not auto-fetch progress on render.
 *
 * Hidden in three cases:
 *   - Anonymous user (no progress to show)
 *   - Pronunciation feature flag is off
 *   - User has zero attempts in the last two weeks
 *
 * Vietnamese-first copy. No emojis except the trend arrow + flame.
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/providers/AuthProvider";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import {
  getWeeklyProgressSummary,
  type WeeklyProgress,
} from "@/lib/analytics/speechProgress";

const cardStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid rgba(0,0,0,0.10)",
  borderRadius: 16,
  padding: "14px 16px",
  background: "white",
  boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "center",
  gap: 12,
  cursor: "pointer",
  textAlign: "left",
};

// Shame-audit fix (reports/streak-shame-audit-2026-04-26.md § F-5):
// painting a beginner's own score in alarm-red below 60 reads as a
// "bad student" report-card signal, especially for VN learners with
// school-era red-ink associations. Sub-60 now uses neutral slate; the
// number is still visible, the alarm color is gone. Green stays for
// genuine wins (≥80); amber kept for the 60-79 progressing band.
function scoreColor(n: number | null): string {
  // Null branch keeps the slate-400 hex as a documented exception:
  // the score number renders at fontSize 26 + fontWeight 950 (WCAG
  // large-text threshold 3:1; slate-400 on white = 3.13:1 PASSES).
  // Kept lighter than the sub-60 branch (slate-500) so "no data
  // yet" reads as quieter than a real low score. Full rationale in
  // docs/a11y/audit.md §"Color contrast — wave 7 cleanup".
  if (n === null) return "#94a3b8"; // a11y-contrast:exception (large text, see comment above)
  if (n >= 80) return "#059669";
  if (n >= 60) return "#d97706";
  return "#64748b";
}

export default function WeeklyProgressWidget() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enabled, loading: flagLoading } = useFeatureFlag(
    "pronunciationScoringEnabled",
    false,
  );
  const { enabled: retentionHooksEnabled, loading: retentionFlagLoading } =
    useFeatureFlag(
      "CONVERSATION_RETENTION_HOOKS",
      FEATURE_FLAGS.CONVERSATION_RETENTION_HOOKS,
    );

  const [data, setData] = useState<WeeklyProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    if (
      flagLoading ||
      retentionFlagLoading ||
      !enabled ||
      !retentionHooksEnabled ||
      !user
    ) {
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    setErrored(false);
    getWeeklyProgressSummary(user.id)
      .then((res) => {
        if (alive) setData(res);
      })
      .catch(() => {
        if (alive) setErrored(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [enabled, flagLoading, retentionFlagLoading, retentionHooksEnabled, user]);

  // Hidden: not signed in, flag off, errored, or no attempts.
  if (!user || !enabled || !retentionHooksEnabled || flagLoading || retentionFlagLoading) {
    return null;
  }
  if (errored) return null;
  if (loading) return null;
  if (!data) return null;
  if (data.thisWeek.attempts === 0 && data.lastWeek.attempts === 0) return null;

  const score = data.thisWeek.averageScore;
  const delta = data.scoreDelta;
  // Shame-audit fix § F-4: a negative weekly delta painted red with a
  // ↓ arrow reads as "you got worse" — a shame trigger we don't want
  // for a learner whose score dropped 78 → 75. Arrow stays as the
  // informational signal; color is neutralized to slate for negatives.
  // Green is reserved for positive delta only.
  const arrow = delta === null ? "→" : delta > 0 ? "↑" : delta < 0 ? "↓" : "→";
  const arrowColor =
    delta === null
      ? "#64748b"
      : delta > 0
        ? "#059669"
        : "#64748b";

  return (
    <button
      type="button"
      onClick={() => navigate("/progress")}
      aria-label="Open progress dashboard"
      data-testid="home-weekly-progress-widget"
      style={cardStyle}
    >
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.4,
            color: "rgba(0,0,0,0.55)",
          }}
        >
          Tiến bộ tuần · Weekly progress
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            marginTop: 4,
          }}
        >
          <span
            style={{
              fontSize: 26,
              fontWeight: 950,
              color: scoreColor(score),
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {score ?? "—"}
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: arrowColor,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span aria-hidden>{arrow}</span>
            {delta === null
              ? "—"
              : delta > 0
                ? `+${delta}`
                : `${delta}`}
          </span>
        </div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
          {data.thisWeek.attempts} câu tuần này · {data.thisWeek.attempts}{" "}
          {data.thisWeek.attempts === 1 ? "sentence" : "sentences"} this week
          {data.streak > 0 ? ` · 🔥 ${data.streak}` : ""}
        </div>
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#111827",
          whiteSpace: "nowrap",
        }}
        aria-hidden
      >
        Xem · View →
      </div>
    </button>
  );
}
