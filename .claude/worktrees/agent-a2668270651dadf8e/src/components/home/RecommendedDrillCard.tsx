// Home card: "Bạn có thể luyện /θ/ trong 5 phút".
//
// Lazy-fetches the user's weekly progress, picks the lowest-scoring
// phoneme that has BOTH (a) a hand-curated drill pack AND (b) at least
// 5 attempts in the window, then renders a CTA to /practice/phoneme/<slug>.
// Hidden when:
//   - flag `phoneme_drill_recommendations_enabled` is OFF
//   - the user is anonymous
//   - no qualifying weak phoneme exists
//   - the user already drilled this phoneme in the last 24 hours
//     (the graduation tracker carries lastSessionAt)
//
// Mirrors `PracticeRecommendationCard` (#189) — same lazy-load pattern,
// same VI-primary copy, same target-prefix navigation rules.

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Target, ChevronRight, Sparkles } from "lucide-react";

import { useAuth } from "@/providers/AuthProvider";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import {
  getWeeklyProgressSummary,
  type PhonemeAggregate,
} from "@/lib/analytics/speechProgress";
import { getDrillPackForPhoneme, type PhonemeDrillPack } from "@/data/pronunciation/phoneme-drills";
import {
  progressFor,
  readGraduationState,
} from "@/lib/pronunciation/drillGraduation";

const COOLDOWN_MS = 24 * 60 * 60 * 1000;
const MIN_ATTEMPTS = 5;
const SCORE_FLOOR = 70;

export default function RecommendedDrillCard() {
  const { user } = useAuth();
  const { enabled } = useFeatureFlag("phoneme_drill_recommendations_enabled", false);
  const [pick, setPick] = useState<{ pack: PhonemeDrillPack; weak: PhonemeAggregate } | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const nav = useNavigate();

  useEffect(() => {
    if (!enabled || !user?.id) {
      setPick(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getWeeklyProgressSummary(user.id)
      .then((summary) => {
        if (cancelled) return;
        const result = pickRecommendation(user.id, summary.weakest);
        setPick(result);
      })
      .catch(() => {
        if (cancelled) return;
        setPick(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, user?.id]);

  const onStart = useCallback(() => {
    if (!pick) return;
    nav(`/practice/phoneme/${pick.pack.slug}?src=home`);
  }, [nav, pick]);

  if (!enabled || loading || !pick) return null;

  const { pack, weak } = pick;
  return (
    <section
      aria-label="Gợi ý luyện âm · Phoneme drill recommendation"
      style={shellStyle}
    >
      <header style={headerStyle}>
        <div style={iconBadgeStyle}>
          <Target size={20} color="white" aria-hidden />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={titleViStyle}>
            Bạn có thể luyện {pack.phoneme_ipa} trong 5 phút
          </div>
          <div style={titleEnStyle}>
            Drill {pack.phoneme_ipa} for 5 minutes
          </div>
        </div>
        <div style={scoreChipStyle} aria-label={`Điểm hiện tại ${Math.round(weak.averageScore)}`}>
          {Math.round(weak.averageScore)}/100
        </div>
      </header>

      <p style={descStyle}>
        Âm {pack.phoneme_ipa} của bạn đang ở {Math.round(weak.averageScore)}/100. Một
        bài luyện 5 phút (10 câu) có thể giúp điểm cải thiện rõ hơn.
      </p>
      <p style={descEnStyle}>
        Your {pack.phoneme_ipa} is at {Math.round(weak.averageScore)}/100. A focused
        5-minute drill (10 sentences) can move the needle.
      </p>

      <button type="button" onClick={onStart} style={primaryBtnStyle}>
        <Sparkles size={14} aria-hidden />
        Bắt đầu · Start
        <ChevronRight size={14} aria-hidden />
      </button>
    </section>
  );
}

// ── Pure picker (exported for tests) ────────────────────────────────────

export function pickRecommendation(
  userId: string,
  weakest: ReadonlyArray<PhonemeAggregate>,
  /** Override for tests. */
  now: number = Date.now(),
): { pack: PhonemeDrillPack; weak: PhonemeAggregate } | null {
  const state = userId ? readGraduationState(userId) : { byPhoneme: {} };
  for (const w of weakest) {
    if (w.attemptCount < MIN_ATTEMPTS) continue;
    if (w.averageScore >= SCORE_FLOOR) continue;
    const pack = getDrillPackForPhoneme(w.phoneme);
    if (!pack) continue;
    const progress = progressFor(state, pack.slug);
    // lastSessionAt === 0 means the user has never drilled this
    // phoneme — they're not on cooldown, recommend immediately.
    if (progress.lastSessionAt > 0 && now - progress.lastSessionAt < COOLDOWN_MS) continue;
    return { pack, weak: w };
  }
  return null;
}

// ── Styles (mirror PracticeRecommendationCard) ──────────────────────────

const shellStyle: React.CSSProperties = {
  marginTop: 12,
  borderRadius: 18,
  padding: "14px 16px",
  background:
    "linear-gradient(150deg, rgba(255,247,237,0.96) 0%, rgba(252,252,255,0.96) 100%)",
  border: "1px solid rgba(217,119,6,0.20)",
  boxShadow: "0 10px 28px rgba(180,83,9,0.08)",
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
  background: "linear-gradient(180deg, #F59E0B 0%, #D97706 100%)",
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  boxShadow: "0 6px 16px rgba(217,119,6,0.20)",
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
  color: "rgba(180,83,9,0.65)",
};

const scoreChipStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  borderRadius: 9999,
  background: "rgba(239,68,68,0.10)",
  color: "rgba(185,28,28,0.85)",
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

const primaryBtnStyle: React.CSSProperties = {
  marginTop: 12,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 14px",
  borderRadius: 9999,
  background: "linear-gradient(150deg, #F59E0B 0%, #D97706 100%)",
  color: "white",
  border: "none",
  fontSize: 13,
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 6px 18px rgba(180,83,9,0.25)",
};
