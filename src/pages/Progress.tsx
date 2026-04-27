// src/pages/Progress.tsx
//
// Route: /progress — "My Progress / Tiến độ của tôi"
//
// Shows proof of improvement using ONLY data the app already has —
// nothing is invented, every metric falls back to a calm "—" or hides
// the whole card when its source is empty.
//
// Sections (top → bottom):
//   1. Stat strip — lessons completed, lifetime speaking attempts,
//      total XP. From user_room_progress + speech_attempts + user_xp.
//      Each cell shows "—" when its source has no rows yet.
//   2. Hero — this-week practice volume + average score + delta.
//   3. Phoneme accuracy bar chart (32 canonical phonemes).
//   4. Drill-down 30-day timeline for a tapped phoneme.
//   5. 4-week trend line.
//   6. Phoneme "fastest improving" + "still working on" badges.
//   7. Grammar weak areas (from the rule-recommendation engine) —
//      hidden when the engine returns nothing.
//   8. Phoneme heatmap (self-fetching; hidden until 5+ attempts).
//   9. Recent attempts (last 10).
//  10. Recommended next lesson (from recommendNextLesson + the
//      weakness catalog) — hidden when the recommendation has no
//      linked room.
//
// Bilingual VI primary throughout. Feature-flag gated by
// `pronunciationScoringEnabled` — same gate as /speak and
// /speech/history.
//
// Empty states:
//   - signed-out      → CTA to sign in
//   - signed-in, 0 speech attempts AND 0 other progress → CTA to /speak
//   - any single source missing → that cell / card degrades calmly,
//     the rest of the page renders normally.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAuth } from "@/providers/AuthProvider";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { supabase } from "@/lib/supabaseClient";
import PhonemeHeatmapSection from "@/components/pronunciation/PhonemeHeatmapSection";
import {
  CANONICAL_PHONEMES,
  exportAttemptsCsv,
  getPhonemeProgressOverTime,
  getRecentAttempts,
  getWeeklyProgressSummary,
  getWeeklyTrend,
  type PhonemeAggregate,
  type PhonemeTimelinePoint,
  type RecentAttempt,
  type WeeklyProgress,
  type WeeklyTrendPoint,
} from "@/lib/analytics/speechProgress";
import {
  getTopWeaknesses,
  recommendNextLesson,
  type WeaknessRecommendation,
} from "@/lib/weakness/recommendationEngine";
import {
  getWeaknessEntry,
  type WeaknessEntry,
} from "@/lib/weakness/weakness-catalog";

// ── Bilingual copy ────────────────────────────────────────────────────

const COPY = {
  pageTitle: { en: "My Progress", vi: "Tiến độ của tôi" },
  weeklyHero: {
    en: (n: number) => `You practiced ${n} ${n === 1 ? "sentence" : "sentences"} this week`,
    vi: (n: number) => `Bạn đã luyện ${n} câu tuần này`,
  },
  vsLastWeek: { en: "vs last week", vi: "so với tuần trước" },
  thisWeekAvg: { en: "Avg score this week", vi: "Điểm trung bình tuần này" },
  practiceTime: { en: "Practice time", vi: "Thời gian luyện" },
  streakLabel: { en: "Day streak", vi: "Chuỗi ngày" },
  proofTitle: { en: "Proof of improvement", vi: "Bằng chứng tiến bộ" },
  lessonsLabel: { en: "Lessons completed", vi: "Bài đã hoàn thành" },
  speakLabel: { en: "Speaking attempts", vi: "Lượt phát âm" },
  pointsLabel: { en: "Total points (XP)", vi: "Tổng điểm (XP)" },
  weakRulesTitle: { en: "Grammar to focus on", vi: "Ngữ pháp cần chú ý" },
  weakRulesHint: {
    en: "Top areas where Vietnamese speakers tend to slip — based on your recent attempts.",
    vi: "Những điểm người Việt mình hay nhầm — dựa trên lượt luyện gần đây của bạn.",
  },
  recTitle: { en: "Recommended next lesson", vi: "Bài học gợi ý tiếp theo" },
  recOpenCta: { en: "Open lesson", vi: "Mở bài học" },
  recReasonLow: { en: "You've been slipping here recently", vi: "Bạn đang nhầm ở đây gần đây" },
  recReasonStale: { en: "It's been a while since you practiced this", vi: "Đã lâu bạn chưa luyện điểm này" },
  recReasonNew: { en: "Suggested for your level", vi: "Gợi ý cho trình độ của bạn" },
  phonemeChartTitle: {
    en: "Phoneme accuracy",
    vi: "Độ chính xác từng âm",
  },
  phonemeChartHint: {
    en: "32 sounds, sorted by current accuracy.",
    vi: "32 âm, xếp theo độ chính xác gần đây.",
  },
  trendTitle: { en: "4-week trend", vi: "Xu hướng 4 tuần" },
  trendHint: {
    en: "Weekly average score, oldest week on the left.",
    vi: "Điểm trung bình mỗi tuần, tuần cũ ở bên trái.",
  },
  improvedBadge: {
    en: "Fastest improving",
    vi: "Tiến bộ nhanh nhất",
  },
  weakBadge: {
    en: "Still working on",
    vi: "Vẫn cần luyện",
  },
  recentTitle: { en: "Recent attempts", vi: "Lần thử gần đây" },
  emptyAnonTitle: {
    en: "Sign up to track progress",
    vi: "Đăng ký để theo dõi tiến độ",
  },
  emptyAnonBody: {
    en: "Your phoneme scores are saved when you sign in. Then this dashboard fills in.",
    vi: "Điểm phát âm được lưu khi bạn đăng nhập. Sau đó bảng này sẽ có dữ liệu.",
  },
  emptyFirstTitle: {
    en: "Try your first pronunciation",
    vi: "Hãy thử phát âm câu đầu tiên!",
  },
  emptyFirstBody: {
    en: "Score one sentence on the Speak tab. Your progress shows up here right after.",
    vi: "Hãy phát âm một câu ở tab Speak. Tiến độ sẽ hiện ngay tại đây.",
  },
  toSpeak: { en: "Go to Speak", vi: "Sang tab Speak" },
  toSignIn: { en: "Sign in", vi: "Đăng nhập" },
  loading: { en: "Loading…", vi: "Đang tải…" },
  loadFailed: { en: "Failed to load", vi: "Không tải được" },
  insufficient: { en: "Not enough data yet", vi: "Chưa đủ dữ liệu" },
};

// ── Styles ────────────────────────────────────────────────────────────

const wrap: React.CSSProperties = {
  width: "100%",
  minHeight: "calc(100vh - 72px)",
  padding: "20px 16px 80px",
  display: "flex",
  justifyContent: "center",
};

const column: React.CSSProperties = {
  width: "100%",
  maxWidth: 760,
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const cardStyle: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.10)",
  borderRadius: 20,
  padding: 20,
  background: "white",
  boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
};

const sectionHeader: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: 0.4,
  color: "rgba(0,0,0,0.55)",
};

const heading: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 900,
  letterSpacing: -0.4,
  margin: 0,
  color: "rgba(10,10,10,0.94)",
};

const primaryBtn: React.CSSProperties = {
  background: "#111827",
  color: "white",
  borderRadius: 9999,
  minHeight: 44,
  padding: "0 22px",
  fontWeight: 700,
  fontSize: 14,
  border: "none",
  cursor: "pointer",
};

// ── Helpers ───────────────────────────────────────────────────────────

// Shame-audit fix (reports/streak-shame-audit-2026-04-26.md § F-5):
// matched to WeeklyProgressWidget's scoreColor — sub-60 uses neutral
// slate, NOT alarm-red. A 55 score for a beginner is normal, not an
// emergency; painting it red teaches the user that being a beginner
// is wrong. Number stays visible.
function scoreColor(n: number | null): string {
  if (n === null) return "#94a3b8";
  if (n >= 80) return "#059669";
  if (n >= 60) return "#d97706";
  return "#64748b";
}

function formatDeltaPrefix(n: number | null): string {
  if (n === null) return "—";
  if (n > 0) return `+${n}`;
  if (n < 0) return `${n}`;
  return "0";
}

function formatWeekStart(iso: string): string {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return iso.slice(5, 10);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatRelative(iso: string): string {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "";
  const diffSec = Math.max(0, Math.round((Date.now() - t) / 1000));
  if (diffSec < 60) return "just now / vừa xong";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago / ${diffMin} phút trước`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago / ${diffHr} giờ trước`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay === 1) return "yesterday / hôm qua";
  if (diffDay < 7) return `${diffDay}d ago / ${diffDay} ngày trước`;
  const d = new Date(iso);
  const dateStr = d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  return dateStr;
}

// Build the bar-chart row set: every canonical phoneme appears, even
// ones the user hasn't attempted (they show as zero so the user can
// see the gap to fill).
function buildPhonemeChartRows(
  averages: PhonemeAggregate[],
): Array<{ phoneme: string; score: number; attempts: number }> {
  const map = new Map(averages.map((a) => [a.phoneme, a]));
  const rows = CANONICAL_PHONEMES.map((p) => {
    const hit = map.get(p);
    return {
      phoneme: p,
      score: hit?.averageScore ?? 0,
      attempts: hit?.attemptCount ?? 0,
    };
  });
  // Highest accuracy on the left so the user sees their wins first;
  // the prompt asks for "sorted by current accuracy".
  return rows.sort((a, b) => b.score - a.score);
}

// ── Stat-strip data loaders ──────────────────────────────────────────
//
// Three small queries against existing tables. Each one independently
// resolves to `null` on any error so a Postgres blip degrades that one
// cell to "—" instead of failing the whole page.

interface StatStripData {
  lessonsCompleted: number | null;
  speakingAttempts: number | null;
  totalXp: number | null;
}

async function loadStatStrip(userId: string): Promise<StatStripData> {
  const [lessons, speak, xp] = await Promise.all([
    supabase
      .from("user_room_progress")
      .select("room_id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("progress_pct", 100)
      .then(
        (res) => (res.error ? null : res.count ?? 0),
        () => null,
      ),
    supabase
      .from("speech_attempts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .then(
        (res) => (res.error ? null : res.count ?? 0),
        () => null,
      ),
    supabase
      .from("user_xp")
      .select("total_xp")
      .eq("user_id", userId)
      .maybeSingle()
      .then(
        (res) =>
          res.error
            ? null
            : typeof (res.data as { total_xp?: number | null } | null)?.total_xp === "number"
              ? Number((res.data as { total_xp: number }).total_xp)
              : 0,
        () => null,
      ),
  ]);
  return {
    lessonsCompleted: lessons,
    speakingAttempts: speak,
    totalXp: xp,
  };
}

interface NextLessonData {
  tag: string;
  entry: WeaknessEntry;
}

async function loadNextLesson(userId: string): Promise<NextLessonData | null> {
  try {
    const tag = await recommendNextLesson(userId);
    if (!tag) return null;
    const entry = getWeaknessEntry(tag);
    if (!entry) return null;
    return { tag, entry };
  } catch {
    return null;
  }
}

async function loadGrammarWeakAreas(
  userId: string,
): Promise<WeaknessRecommendation[]> {
  try {
    const recs = await getTopWeaknesses(userId, 3);
    // Drop pure cold-start entries — if the user has zero attempts
    // anywhere, the engine's CEFR-aligned fallback isn't really a
    // "weak area," it's an introduction. Hide the section in that
    // case (we don't want to invent weakness signal).
    return recs.filter((r) => r.errorCount > 0 || r.daysSinceLastAttempt < 30);
  } catch {
    return [];
  }
}

function formatNumber(n: number | null): string {
  if (n === null || !Number.isFinite(n)) return "—";
  return n.toLocaleString();
}

function reasonCopy(reason: WeaknessRecommendation["reason"]): {
  vi: string;
  en: string;
} {
  switch (reason) {
    case "high_error_rate":
      return COPY.recReasonLow;
    case "stale_practice":
      return COPY.recReasonStale;
    case "cefr_aligned":
    case "cold_start":
    default:
      return COPY.recReasonNew;
  }
}

// ── Component ─────────────────────────────────────────────────────────

export default function ProgressPage() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { enabled, loading: flagLoading } = useFeatureFlag(
    "pronunciationScoringEnabled",
    false,
  );

  const [summary, setSummary] = useState<WeeklyProgress | null>(null);
  const [trend, setTrend] = useState<WeeklyTrendPoint[]>([]);
  const [recent, setRecent] = useState<RecentAttempt[]>([]);
  const [phonemeTimeline, setPhonemeTimeline] = useState<
    PhonemeTimelinePoint[] | null
  >(null);
  const [selectedPhoneme, setSelectedPhoneme] = useState<string | null>(null);
  const [stats, setStats] = useState<StatStripData | null>(null);
  const [nextLesson, setNextLesson] = useState<NextLessonData | null>(null);
  const [weakAreas, setWeakAreas] = useState<WeaknessRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lazy-load all data on /progress visit only — never on Home.
  useEffect(() => {
    if (flagLoading || authLoading) return;
    if (!enabled) return;
    if (!user) {
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    setError(null);
    Promise.all([
      getWeeklyProgressSummary(user.id),
      getWeeklyTrend(4),
      getRecentAttempts(10),
      loadStatStrip(user.id),
      loadNextLesson(user.id),
      loadGrammarWeakAreas(user.id),
    ])
      .then(([weekly, weeklyTrend, recents, statStrip, nextLessonRow, grammarWeak]) => {
        if (!alive) return;
        setSummary(weekly);
        setTrend(weeklyTrend);
        setRecent(recents);
        setStats(statStrip);
        setNextLesson(nextLessonRow);
        setWeakAreas(grammarWeak);
      })
      .catch((err: unknown) => {
        if (!alive) return;
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [enabled, flagLoading, authLoading, user]);

  // Drill-down: when the user taps a phoneme bar, show its 30-day timeline.
  const onSelectPhoneme = useCallback((phoneme: string) => {
    setSelectedPhoneme(phoneme);
    setPhonemeTimeline(null);
    void getPhonemeProgressOverTime(phoneme, 30)
      .then(setPhonemeTimeline)
      .catch(() => setPhonemeTimeline([]));
  }, []);

  const onDownloadCsv = useCallback(async () => {
    try {
      const csv = await exportAttemptsCsv();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mercyblade-speech-history-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  const phonemeRows = useMemo(
    () => (summary ? buildPhonemeChartRows(summary.phonemeAverages) : []),
    [summary],
  );

  const trendRows = useMemo(
    () =>
      trend.map((p) => ({
        weekLabel: formatWeekStart(p.weekStartIso),
        averageScore: p.averageScore,
        attempts: p.attemptCount,
      })),
    [trend],
  );

  if (flagLoading || authLoading) {
    return (
      <div style={wrap}>
        <div style={column}>
          <p style={{ color: "#64748b" }}>{COPY.loading.en} · {COPY.loading.vi}</p>
        </div>
      </div>
    );
  }
  if (!enabled) return <Navigate to="/" replace />;

  // Anonymous-user empty state.
  if (!user) {
    return (
      <div style={wrap}>
        <div style={column}>
          <h1 style={heading}>
            {COPY.pageTitle.vi} · {COPY.pageTitle.en}
          </h1>
          <section style={{ ...cardStyle, textAlign: "center" }}>
            <div style={{ fontSize: 44 }} aria-hidden>
              📈
            </div>
            <div style={{ marginTop: 8, fontSize: 18, fontWeight: 800 }}>
              {COPY.emptyAnonTitle.vi}
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
              {COPY.emptyAnonTitle.en}
            </div>
            <p style={{ fontSize: 13, color: "#475569", marginTop: 12 }}>
              {COPY.emptyAnonBody.vi}
            </p>
            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
              {COPY.emptyAnonBody.en}
            </p>
            <div style={{ marginTop: 18 }}>
              <button
                type="button"
                style={primaryBtn}
                onClick={() => navigate("/signin")}
              >
                {COPY.toSignIn.vi} · {COPY.toSignIn.en}
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={wrap}>
        <div style={column}>
          <h1 style={heading}>
            {COPY.pageTitle.vi} · {COPY.pageTitle.en}
          </h1>
          <div style={{ ...cardStyle, color: "#64748b", fontSize: 13 }}>
            {COPY.loading.vi} · {COPY.loading.en}
          </div>
        </div>
      </div>
    );
  }

  // The "no data" empty state fires only when the user has zero
  // speaking attempts AND zero lessons completed AND zero XP. A user
  // who completed lessons but never spoke still gets the dashboard
  // (their stat strip + Recommended-next-lesson are useful even
  // without a phoneme history).
  const noSpeechAttempts =
    !summary ||
    (summary.thisWeek.attempts === 0 &&
      summary.lastWeek.attempts === 0 &&
      recent.length === 0);
  const noOtherProgress =
    !stats ||
    ((stats.lessonsCompleted ?? 0) === 0 &&
      (stats.totalXp ?? 0) === 0 &&
      (stats.speakingAttempts ?? 0) === 0);
  const noAttempts = noSpeechAttempts && noOtherProgress;

  if (noAttempts) {
    return (
      <div style={wrap}>
        <div style={column}>
          <h1 style={heading}>
            {COPY.pageTitle.vi} · {COPY.pageTitle.en}
          </h1>
          <section
            style={{ ...cardStyle, textAlign: "center" }}
            data-testid="progress-empty"
          >
            <div style={{ fontSize: 44 }} aria-hidden>
              🎤
            </div>
            <div style={{ marginTop: 8, fontSize: 18, fontWeight: 800 }}>
              {COPY.emptyFirstTitle.vi}
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
              {COPY.emptyFirstTitle.en}
            </div>
            <p style={{ fontSize: 13, color: "#475569", marginTop: 12 }}>
              {COPY.emptyFirstBody.vi}
            </p>
            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
              {COPY.emptyFirstBody.en}
            </p>
            <div style={{ marginTop: 18 }}>
              <button
                type="button"
                style={primaryBtn}
                onClick={() => navigate("/speak")}
              >
                {COPY.toSpeak.vi} · {COPY.toSpeak.en}
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Happy-path render.
  return (
    <div style={wrap}>
      <div style={column}>
        <header
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}
        >
          <h1 style={heading}>
            {COPY.pageTitle.vi} · {COPY.pageTitle.en}
          </h1>
          <button
            type="button"
            onClick={() => void onDownloadCsv()}
            style={{
              background: "white",
              color: "#111827",
              borderRadius: 9999,
              minHeight: 36,
              padding: "0 14px",
              fontWeight: 600,
              fontSize: 12,
              border: "1px solid rgba(0,0,0,0.12)",
              cursor: "pointer",
            }}
            data-testid="progress-download-csv"
          >
            ⬇ Download CSV · Tải CSV
          </button>
        </header>

        {error ? (
          <div
            role="alert"
            style={{
              ...cardStyle,
              borderColor: "#fecaca",
              background: "#fef2f2",
              color: "#991b1b",
              fontSize: 13,
            }}
          >
            {COPY.loadFailed.en} / {COPY.loadFailed.vi}: {error}
          </div>
        ) : null}

        {/* Proof-of-improvement strip — three counts from existing
            tables. Each cell shows "—" calmly when its source is empty. */}
        <ProofOfImprovementCard stats={stats} />

        {summary ? <HeroCard summary={summary} /> : null}

        {/* Phoneme bar chart */}
        {phonemeRows.length > 0 ? (
          <PhonemeChartCard
            rows={phonemeRows}
            selected={selectedPhoneme}
            onSelect={onSelectPhoneme}
          />
        ) : null}

        {/* Drilldown timeline */}
        {selectedPhoneme && phonemeTimeline ? (
          <PhonemeTimelineCard
            phoneme={selectedPhoneme}
            points={phonemeTimeline}
          />
        ) : null}

        {/* 4-week trend */}
        {trendRows.length > 0 ? <TrendCard rows={trendRows} /> : null}

        {/* Most-improved + still-working badges */}
        {summary ? <BadgesRow summary={summary} /> : null}

        {/* Grammar weak areas (from the rule recommendation engine).
            Hidden when there's no real signal — we never invent
            weakness data; brief: "use existing data only." */}
        {weakAreas.length > 0 ? (
          <GrammarWeakAreasCard
            recs={weakAreas}
            onOpen={(tag) => {
              const entry = getWeaknessEntry(tag);
              if (entry?.linkedRoomId) {
                navigate(`/room/${entry.linkedRoomId}`);
              }
            }}
          />
        ) : null}

        {/* Phoneme heatmap — per-day per-phoneme grid + insights.
            Self-fetching; hidden until user has 5+ attempts in window. */}
        <PhonemeHeatmapSection userId={user?.id ?? null} />

        {/* Recent attempts */}
        {recent.length > 0 ? <RecentAttemptsCard rows={recent} /> : null}

        {/* Recommended next lesson — last so the user has full
            context above before deciding what to do next. */}
        {nextLesson ? (
          <RecommendedLessonCard
            data={nextLesson}
            onOpen={() => {
              if (nextLesson.entry.linkedRoomId) {
                navigate(`/room/${nextLesson.entry.linkedRoomId}`);
              }
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

// ── Subcomponents ─────────────────────────────────────────────────────

function ProofOfImprovementCard({ stats }: { stats: StatStripData | null }) {
  // Render the strip even when stats failed entirely — three "—" cells
  // are calmer than hiding the whole row, and they confirm to the user
  // that the metric exists, just not for them yet.
  const data = stats ?? {
    lessonsCompleted: null,
    speakingAttempts: null,
    totalXp: null,
  };
  return (
    <section
      style={cardStyle}
      aria-label="Proof of improvement strip"
      data-testid="progress-stat-strip"
    >
      <div style={sectionHeader}>
        {COPY.proofTitle.vi} · {COPY.proofTitle.en}
      </div>
      <div
        style={{
          marginTop: 10,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 10,
        }}
      >
        <MiniStat
          labelVi={COPY.lessonsLabel.vi}
          labelEn={COPY.lessonsLabel.en}
          value={formatNumber(data.lessonsCompleted)}
        />
        <MiniStat
          labelVi={COPY.speakLabel.vi}
          labelEn={COPY.speakLabel.en}
          value={formatNumber(data.speakingAttempts)}
        />
        <MiniStat
          labelVi={COPY.pointsLabel.vi}
          labelEn={COPY.pointsLabel.en}
          value={formatNumber(data.totalXp)}
        />
      </div>
    </section>
  );
}

function HeroCard({ summary }: { summary: WeeklyProgress }) {
  const delta = summary.scoreDelta;
  // Shame-audit fix § F-4: matched to WeeklyProgressWidget — negative
  // delta uses neutral slate, not alarm-red. Green for positive only.
  const deltaColor =
    delta === null ? "#94a3b8" : delta > 0 ? "#059669" : "#64748b";
  const deltaArrow = delta === null ? "→" : delta > 0 ? "↑" : delta < 0 ? "↓" : "→";

  return (
    <section style={cardStyle} aria-label="Weekly hero">
      <div style={sectionHeader}>
        {COPY.thisWeekAvg.vi} · {COPY.thisWeekAvg.en}
      </div>
      <div
        style={{
          marginTop: 4,
          fontSize: 18,
          fontWeight: 700,
          color: "rgba(10,10,10,0.85)",
        }}
      >
        {COPY.weeklyHero.vi(summary.thisWeek.attempts)}
      </div>
      <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
        {COPY.weeklyHero.en(summary.thisWeek.attempts)}
      </div>

      <div
        style={{
          marginTop: 14,
          display: "flex",
          alignItems: "baseline",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 950,
            letterSpacing: -1.5,
            lineHeight: 1,
            color: scoreColor(summary.thisWeek.averageScore),
          }}
          aria-label={
            summary.thisWeek.averageScore !== null
              ? `Average score ${summary.thisWeek.averageScore} out of 100`
              : "Average score unavailable"
          }
        >
          {summary.thisWeek.averageScore ?? "—"}
        </div>
        <div
          style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: deltaColor }}
          aria-label={`Score delta ${formatDeltaPrefix(delta)} versus last week`}
        >
          <span style={{ fontSize: 18 }} aria-hidden>
            {deltaArrow}
          </span>
          <span>{formatDeltaPrefix(delta)}</span>
          <span style={{ color: "#94a3b8", fontSize: 12, fontWeight: 500 }}>
            {COPY.vsLastWeek.vi} · {COPY.vsLastWeek.en}
          </span>
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 10,
        }}
      >
        <MiniStat
          labelVi={COPY.streakLabel.vi}
          labelEn={COPY.streakLabel.en}
          value={`${summary.streak} 🔥`}
        />
        <MiniStat
          labelVi="Số câu / tuần"
          labelEn="Sentences / wk"
          value={String(summary.thisWeek.attempts)}
        />
        <MiniStat
          labelVi={COPY.practiceTime.vi}
          labelEn={COPY.practiceTime.en}
          value={`${summary.totalMinutes}m`}
        />
      </div>
    </section>
  );
}

function MiniStat({
  labelVi,
  labelEn,
  value,
}: {
  labelVi: string;
  labelEn: string;
  value: string;
}) {
  return (
    <div
      style={{
        borderRadius: 12,
        background: "#f8fafc",
        border: "1px solid rgba(0,0,0,0.04)",
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.55)" }}>
        {labelVi} · {labelEn}
      </div>
      <div
        style={{
          marginTop: 2,
          fontSize: 18,
          fontWeight: 900,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function PhonemeChartCard({
  rows,
  selected,
  onSelect,
}: {
  rows: Array<{ phoneme: string; score: number; attempts: number }>;
  selected: string | null;
  onSelect: (p: string) => void;
}) {
  return (
    <section style={cardStyle} aria-label="Phoneme accuracy chart">
      <div style={sectionHeader}>
        {COPY.phonemeChartTitle.vi} · {COPY.phonemeChartTitle.en}
      </div>
      <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 12px" }}>
        {COPY.phonemeChartHint.vi} · {COPY.phonemeChartHint.en}
      </p>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="phoneme"
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Tooltip
              cursor={{ fill: "#f1f5f9" }}
              formatter={(value: unknown, _name, item) => {
                const attempts = (item?.payload as { attempts?: number } | undefined)?.attempts ?? 0;
                return [`${value} (${attempts})`, "score / attempts"];
              }}
            />
            <Bar
              dataKey="score"
              onClick={(d) => {
                const phoneme = (d as unknown as { phoneme?: string }).phoneme;
                if (phoneme) onSelect(phoneme);
              }}
              cursor="pointer"
            >
              {rows.map((row) => (
                <Cell
                  key={row.phoneme}
                  fill={
                    row.attempts === 0
                      ? "#e2e8f0"
                      : row.phoneme === selected
                        ? "#2563eb"
                        : scoreColor(row.score)
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function PhonemeTimelineCard({
  phoneme,
  points,
}: {
  phoneme: string;
  points: PhonemeTimelinePoint[];
}) {
  const rows = points.map((p) => ({
    date: p.date.slice(5),
    score: p.averageScore,
  }));
  const hasData = rows.some((r) => r.score !== null);
  return (
    <section style={cardStyle} aria-label={`Phoneme ${phoneme} timeline`}>
      <div style={sectionHeader}>
        /{phoneme}/ · 30 days · 30 ngày
      </div>
      {hasData ? (
        <div style={{ width: "100%", height: 180, marginTop: 10 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>
          {COPY.insufficient.vi} · {COPY.insufficient.en}
        </p>
      )}
    </section>
  );
}

function TrendCard({
  rows,
}: {
  rows: Array<{ weekLabel: string; averageScore: number | null; attempts: number }>;
}) {
  return (
    <section style={cardStyle} aria-label="Weekly trend">
      <div style={sectionHeader}>
        {COPY.trendTitle.vi} · {COPY.trendTitle.en}
      </div>
      <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 12px" }}>
        {COPY.trendHint.vi} · {COPY.trendHint.en}
      </p>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="weekLabel" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="averageScore"
              stroke="#059669"
              strokeWidth={2}
              dot={{ r: 4 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function BadgesRow({ summary }: { summary: WeeklyProgress }) {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 12,
      }}
    >
      <div style={{ ...cardStyle, padding: 16 }}>
        <div
          style={{
            ...sectionHeader,
            color: "#059669",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          🚀 {COPY.improvedBadge.vi} · {COPY.improvedBadge.en}
        </div>
        {summary.mostImproved.length === 0 ? (
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>
            {COPY.insufficient.vi} · {COPY.insufficient.en}
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 0", display: "flex", flexDirection: "column", gap: 6 }}>
            {summary.mostImproved.map((p) => (
              <li
                key={p.phoneme}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 10px",
                  background: "#ecfdf5",
                  borderRadius: 8,
                  fontSize: 13,
                }}
              >
                <strong>/{p.phoneme}/</strong>
                <span style={{ color: "#059669", fontWeight: 700 }}>
                  +{p.delta} pts
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ ...cardStyle, padding: 16 }}>
        {/* Shame-audit fix § F-6: the "Still working on" copy is good
            (growth-mindset framing) but the alarm-red color and the
            red-50 list-item backgrounds undid the warm wording. The
            section now reads as a tip card, not a failure card. The
            per-phoneme score still uses scoreColor for an at-a-glance
            cue — that's a single number, not a whole card. */}
        <div
          style={{
            ...sectionHeader,
            color: "#0f172a",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          🎯 {COPY.weakBadge.vi} · {COPY.weakBadge.en}
        </div>
        {summary.weakest.length === 0 ? (
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>
            {COPY.insufficient.vi} · {COPY.insufficient.en}
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 0", display: "flex", flexDirection: "column", gap: 6 }}>
            {summary.weakest.map((p) => (
              <li
                key={p.phoneme}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 10px",
                  background: "#f8fafc",
                  borderRadius: 8,
                  fontSize: 13,
                }}
              >
                <strong>/{p.phoneme}/</strong>
                <span style={{ color: scoreColor(p.averageScore), fontWeight: 700 }}>
                  {p.averageScore}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function GrammarWeakAreasCard({
  recs,
  onOpen,
}: {
  recs: WeaknessRecommendation[];
  onOpen: (tag: string) => void;
}) {
  return (
    <section style={cardStyle} aria-label="Grammar weak areas">
      <div style={sectionHeader}>
        🧭 {COPY.weakRulesTitle.vi} · {COPY.weakRulesTitle.en}
      </div>
      <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 12px" }}>
        {COPY.weakRulesHint.vi} · {COPY.weakRulesHint.en}
      </p>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {recs.map((rec) => {
          const entry = getWeaknessEntry(rec.tag);
          if (!entry) return null;
          const reason = reasonCopy(rec.reason);
          const canOpen = entry.linkedRoomId !== null;
          return (
            <li
              key={rec.tag}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: "10px 12px",
                background: "#f8fafc",
                border: "1px solid rgba(0,0,0,0.05)",
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <strong style={{ fontSize: 13, color: "#0f172a" }}>
                  {entry.shortLabel.vi}
                </strong>
                {canOpen ? (
                  <button
                    type="button"
                    onClick={() => onOpen(rec.tag)}
                    style={{
                      background: "white",
                      color: "#111827",
                      borderRadius: 9999,
                      padding: "4px 12px",
                      fontWeight: 600,
                      fontSize: 11,
                      border: "1px solid rgba(0,0,0,0.12)",
                      cursor: "pointer",
                    }}
                  >
                    {COPY.recOpenCta.vi} · {COPY.recOpenCta.en}
                  </button>
                ) : null}
              </div>
              <div style={{ fontSize: 11, color: "#64748b", fontStyle: "italic" }}>
                {entry.shortLabel.en}
              </div>
              <div style={{ fontSize: 12, color: "#475569" }}>
                {reason.vi} · <em>{reason.en}</em>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function RecommendedLessonCard({
  data,
  onOpen,
}: {
  data: NextLessonData;
  onOpen: () => void;
}) {
  const { entry } = data;
  const canOpen = entry.linkedRoomId !== null;
  return (
    <section
      style={cardStyle}
      aria-label="Recommended next lesson"
      data-testid="progress-recommendation"
    >
      <div style={sectionHeader}>
        🎓 {COPY.recTitle.vi} · {COPY.recTitle.en}
      </div>
      <div style={{ marginTop: 10, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
        {entry.shortLabel.vi}
      </div>
      <div style={{ fontSize: 12, color: "#64748b", fontStyle: "italic", marginTop: 2 }}>
        {entry.shortLabel.en}
      </div>
      <p style={{ fontSize: 13, color: "#475569", marginTop: 10, lineHeight: 1.5 }}>
        {entry.longDescription.vi}
      </p>
      <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 6, lineHeight: 1.5 }}>
        {entry.longDescription.en}
      </p>
      {canOpen ? (
        <div style={{ marginTop: 14 }}>
          <button type="button" style={primaryBtn} onClick={onOpen}>
            {COPY.recOpenCta.vi} · {COPY.recOpenCta.en}
          </button>
        </div>
      ) : (
        <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>
          {COPY.insufficient.vi} · {COPY.insufficient.en}
        </p>
      )}
    </section>
  );
}

function RecentAttemptsCard({ rows }: { rows: RecentAttempt[] }) {
  return (
    <section style={cardStyle} aria-label="Recent attempts">
      <div style={sectionHeader}>
        {COPY.recentTitle.vi} · {COPY.recentTitle.en}
      </div>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "10px 0 0",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {rows.map((r) => (
          <li
            key={r.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto",
              gap: 10,
              alignItems: "center",
              padding: "8px 10px",
              background: "#f8fafc",
              borderRadius: 10,
            }}
          >
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: 13,
              }}
              title={r.targetText}
            >
              {r.targetText || "—"}
            </span>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>
              {formatRelative(r.attemptedAt)}
            </span>
            <span
              style={{
                minWidth: 38,
                textAlign: "center",
                padding: "3px 8px",
                borderRadius: 9999,
                background: `${scoreColor(r.overallScore)}14`,
                color: scoreColor(r.overallScore),
                fontWeight: 800,
                fontSize: 12,
              }}
            >
              {r.overallScore ?? "—"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
