import React, { useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/integrations/supabase/types";
import type { LearnerHistoryProfile } from "@/lib/tutor/learnerHistoryProfile";
import { recommendNextLessons, type NextLessonRecommendation } from "@/lib/tutor/nextLessonRecommender";
import { WEAKNESS_MEMORY_TAGS_CATALOG } from "@/lib/tutor/weaknessMemoryTags";

type Skill = Database["public"]["Enums"]["learner_skill"];
type SkillRow = Pick<
  Database["public"]["Tables"]["learner_skill_state"]["Row"],
  "skill" | "score" | "cefr_estimate" | "confidence" | "evidence_count" | "last_assessed_at"
>;
type PatternRow = Pick<
  Database["public"]["Tables"]["learner_error_patterns"]["Row"],
  "pattern_code" | "l1" | "occurrence_count" | "resolved_count" | "first_seen_at" | "last_seen_at" | "trend"
>;
type StudyLogRow = Pick<
  Database["public"]["Tables"]["study_log"]["Row"],
  "date" | "minutes" | "topic_en" | "topic_vi" | "path_slug"
>;

export type LearnerProfileProgressData = {
  skills: SkillRow[];
  patterns: PatternRow[];
  rollup: ProgressRollup;
};

export type ProgressRollup = {
  weekLessons: number;
  monthLessons: number;
  weekMinutes: number;
  monthMinutes: number;
  monthActiveDays: number;
  latestTopic: string | null;
};

type LoadState =
  | { status: "loading" }
  | { status: "ready"; data: LearnerProfileProgressData }
  | { status: "error"; data: LearnerProfileProgressData; message: string };

type Props = {
  userId: string | null;
  onPractice?: (recommendation: NextLessonRecommendation) => void;
};

export function LearnerProfileProgressCards({ userId, onPractice }: Props) {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    if (!userId) return;
    let alive = true;
    setState({ status: "loading" });
    loadLearnerProfileProgress(userId)
      .then((data) => {
        if (alive) setState({ status: "ready", data });
      })
      .catch((err: unknown) => {
        if (!alive) return;
        setState({
          status: "error",
          data: emptyData(),
          message: err instanceof Error ? err.message : String(err),
        });
      });
    return () => {
      alive = false;
    };
  }, [userId]);

  if (!userId) {
    return (
      <LearnerProfileProgressView
        signedOut
        data={emptyData()}
        onPractice={onPractice}
      />
    );
  }

  if (state.status === "loading") {
    return <LearnerProfileProgressView loading data={emptyData()} onPractice={onPractice} />;
  }

  return (
    <LearnerProfileProgressView
      data={state.data}
      error={state.status === "error" ? state.message : null}
      onPractice={onPractice}
    />
  );
}

export function LearnerProfileProgressView({
  data,
  loading = false,
  signedOut = false,
  error = null,
  onPractice,
}: {
  data: LearnerProfileProgressData;
  loading?: boolean;
  signedOut?: boolean;
  error?: string | null;
  onPractice?: (recommendation: NextLessonRecommendation) => void;
}) {
  const skillsByName = useMemo(
    () => new Map(data.skills.map((row) => [row.skill, row])),
    [data.skills],
  );
  const recommendations = useMemo(
    () => buildPatternRecommendations(data.patterns),
    [data.patterns],
  );
  const topPatterns = data.patterns
    .slice()
    .sort((a, b) => b.occurrence_count - a.occurrence_count || a.pattern_code.localeCompare(b.pattern_code))
    .slice(0, 3);

  if (signedOut) {
    return (
      <section style={profileCardStyle} data-testid="learner-profile-signed-out">
        <div style={eyebrowStyle}>Hồ sơ học tập · Learner profile</div>
        <h2 style={cardTitleStyle}>Đăng nhập để thấy tiến độ của bạn.</h2>
        <p style={mutedTextStyle}>
          Mercy lưu kỹ năng và mẫu lỗi lặp lại khi bạn có tài khoản, không lưu câu gốc trong hồ sơ này.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Learner profile progress" style={panelStyle}>
      {error ? (
        <div role="alert" style={softErrorStyle}>
          Không tải được hồ sơ học tập · Learner profile load failed: {error}
        </div>
      ) : null}
      {loading ? (
        <div style={profileCardStyle} data-testid="learner-profile-loading">
          <div style={eyebrowStyle}>Hồ sơ học tập · Learner profile</div>
          <p style={mutedTextStyle}>Đang tải tiến độ của bạn · Loading your progress.</p>
        </div>
      ) : null}
      <div style={gridStyle}>
        <section style={profileCardStyle} data-testid="skill-bars-card">
          <div style={eyebrowStyle}>Kỹ năng · Skills</div>
          <h2 style={cardTitleStyle}>Điểm hiện tại</h2>
          <div style={skillListStyle}>
            {SKILL_ORDER.map((skill) => {
              const row = skillsByName.get(skill);
              return <SkillBar key={skill} skill={skill} row={row} />;
            })}
          </div>
        </section>

        <section style={profileCardStyle} data-testid="cause-card">
          <div style={eyebrowStyle}>Nguyên nhân · Cause</div>
          <h2 style={cardTitleStyle}>Mẫu lỗi Mercy đang thấy</h2>
          {topPatterns.length === 0 ? (
            <EmptyBlock
              title="Chưa có mẫu lỗi lặp lại"
              body="Sửa thêm vài câu nữa, Mercy sẽ gom những lỗi có cùng nguyên nhân để bạn luyện đúng chỗ."
            />
          ) : (
            <div style={patternListStyle}>
              {topPatterns.map((pattern) => {
                const meta = getPatternMeta(pattern.pattern_code);
                const recommendation = recommendations.get(pattern.pattern_code) ?? null;
                return (
                  <article key={`${pattern.pattern_code}:${pattern.l1}`} style={patternItemStyle}>
                    <div style={patternHeaderStyle}>
                      <div>
                        <h3 style={patternTitleStyle}>{meta.labelVi}</h3>
                        <p style={patternExplanationStyle}>{meta.noteVi}</p>
                      </div>
                      <TrendPill trend={pattern.trend} occurrenceCount={pattern.occurrence_count} />
                    </div>
                    <div style={patternMetaRowStyle}>
                      <span>{pattern.occurrence_count} lần thấy</span>
                      <span>{pattern.resolved_count} lần đã sửa ổn</span>
                    </div>
                    {recommendation ? (
                      <button
                        type="button"
                        style={practiceButtonStyle}
                        onClick={() => onPractice?.(recommendation)}
                      >
                        Luyện lỗi này · Practice this
                      </button>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section style={profileCardStyle} data-testid="progress-rollup-card">
          <div style={eyebrowStyle}>Nhịp học · Rollup</div>
          <h2 style={cardTitleStyle}>Tuần này và tháng này</h2>
          <div style={rollupGridStyle}>
            <RollupStat label="Bài tuần này" value={String(data.rollup.weekLessons)} />
            <RollupStat label="Phút tuần này" value={String(data.rollup.weekMinutes)} />
            <RollupStat label="Bài tháng này" value={String(data.rollup.monthLessons)} />
            <RollupStat label="Ngày học tháng này" value={String(data.rollup.monthActiveDays)} />
          </div>
          {data.rollup.monthLessons === 0 ? (
            <p style={mutedTextStyle}>
              Chưa có bài nào trong nhật ký học tháng này. Khi bạn hoàn thành bài học, thẻ này sẽ tự đầy lên.
            </p>
          ) : (
            <p style={mutedTextStyle}>
              Gần nhất: {data.rollup.latestTopic ?? "bài học gần đây"} · {data.rollup.monthMinutes} phút trong tháng.
            </p>
          )}
        </section>
      </div>
    </section>
  );
}

function SkillBar({ skill, row }: { skill: Skill; row: SkillRow | undefined }) {
  const label = SKILL_LABELS[skill] ?? skill;
  const score = row?.score;
  const assessed = typeof score === "number";
  const clampedScore = assessed ? Math.max(0, Math.min(100, Math.round(score))) : null;
  return (
    <div style={skillRowStyle}>
      <div style={skillHeaderStyle}>
        <span style={skillNameStyle}>{label.vi}</span>
        <span style={skillValueStyle}>
          {assessed ? `${clampedScore}% · ${row?.cefr_estimate ?? "CEFR ?"}` : "Chưa đánh giá · not yet assessed"}
        </span>
      </div>
      <div
        aria-label={`${label.en}: ${assessed ? `${clampedScore} percent` : "not yet assessed"}`}
        style={barTrackStyle}
      >
        <div
          style={{
            ...barFillStyle,
            width: assessed ? `${clampedScore}%` : "0%",
            background: assessed ? skillColor(skill) : "transparent",
          }}
        />
      </div>
      {row?.evidence_count ? (
        <div style={skillEvidenceStyle}>{row.evidence_count} tín hiệu · {label.en}</div>
      ) : null}
    </div>
  );
}

function EmptyBlock({ title, body }: { title: string; body: string }) {
  return (
    <div style={emptyBlockStyle}>
      <div style={{ fontWeight: 850, color: "#111827" }}>{title}</div>
      <p style={{ ...mutedTextStyle, marginTop: 4 }}>{body}</p>
    </div>
  );
}

function RollupStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={rollupStatStyle}>
      <div style={rollupValueStyle}>{value}</div>
      <div style={rollupLabelStyle}>{label}</div>
    </div>
  );
}

function TrendPill({ trend, occurrenceCount }: { trend: string; occurrenceCount: number }) {
  if (occurrenceCount < PATTERN_TREND_EVIDENCE_FLOOR || trend === "insufficient") return null;
  const meta = TREND_LABELS[trend] ?? TREND_LABELS.stable;
  return (
    <span style={{ ...trendPillStyle, color: meta.color, borderColor: meta.border }}>
      <span aria-hidden>{meta.arrow}</span> {meta.label}
    </span>
  );
}

async function loadLearnerProfileProgress(userId: string): Promise<LearnerProfileProgressData> {
  const monthStart = startOfMonthIso();
  const [{ data: skills, error: skillsError }, { data: patterns, error: patternsError }, { data: studyRows, error: studyError }] =
    await Promise.all([
      supabase
        .from("learner_skill_state")
        .select("skill, score, cefr_estimate, confidence, evidence_count, last_assessed_at")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false }),
      supabase
        .from("learner_error_patterns")
        .select("pattern_code, l1, occurrence_count, resolved_count, first_seen_at, last_seen_at, trend")
        .eq("user_id", userId)
        .order("occurrence_count", { ascending: false })
        .limit(12),
      supabase
        .from("study_log")
        .select("date, minutes, topic_en, topic_vi, path_slug")
        .eq("user_id", userId)
        .gte("date", monthStart)
        .order("date", { ascending: false }),
    ]);

  const firstError = skillsError ?? patternsError ?? studyError;
  if (firstError) throw new Error(firstError.message);

  return {
    skills: (skills ?? []) as SkillRow[],
    patterns: (patterns ?? []) as PatternRow[],
    rollup: buildRollup((studyRows ?? []) as StudyLogRow[]),
  };
}

function buildRollup(rows: StudyLogRow[]): ProgressRollup {
  const weekStart = startOfWeekIso();
  let weekLessons = 0;
  let weekMinutes = 0;
  let monthMinutes = 0;
  const activeDays = new Set<string>();
  for (const row of rows) {
    const minutes = Math.max(0, Number(row.minutes ?? 0));
    monthMinutes += minutes;
    activeDays.add(row.date);
    if (row.date >= weekStart) {
      weekLessons += 1;
      weekMinutes += minutes;
    }
  }
  const latest = rows[0] ?? null;
  return {
    weekLessons,
    monthLessons: rows.length,
    weekMinutes,
    monthMinutes,
    monthActiveDays: activeDays.size,
    latestTopic: latest?.topic_vi || latest?.topic_en || latest?.path_slug || null,
  };
}

function buildPatternRecommendations(patterns: PatternRow[]): Map<string, NextLessonRecommendation> {
  const profile: LearnerHistoryProfile = {
    product: "ai-tutor",
    targetLanguage: "en",
    topicMastery: {},
    interferencePatterns: patterns.map((pattern) => ({
      tag: pattern.pattern_code,
      observedCount: pattern.occurrence_count,
      lastSeenAt: Date.parse(pattern.last_seen_at) || Date.now(),
    })),
    sessionCount: 0,
    completedSessionCount: 0,
    preferredMode: null,
    updatedAt: Date.now(),
  };
  const recs = recommendNextLessons(profile);
  const map = new Map<string, NextLessonRecommendation>();
  for (const rec of recs) {
    if (rec.ruleFired === "cold-start:abstain" || rec.ruleFired === "fallback:starter") continue;
    map.set(rec.targetSkill, rec);
  }
  return map;
}

function getPatternMeta(patternCode: string): { labelVi: string; noteVi: string } {
  const meta = WEAKNESS_MEMORY_TAGS_CATALOG.find((item) => item.category === patternCode);
  if (meta) {
    return {
      labelVi: meta.labelVi,
      noteVi: meta.l1TransferNoteVi || meta.whyVi,
    };
  }
  return {
    labelVi: patternCode.replace(/[-_]/g, " "),
    noteVi: "Mercy đã thấy mẫu này lặp lại trong các lần sửa câu.",
  };
}

function emptyData(): LearnerProfileProgressData {
  return {
    skills: [],
    patterns: [],
    rollup: {
      weekLessons: 0,
      monthLessons: 0,
      weekMinutes: 0,
      monthMinutes: 0,
      monthActiveDays: 0,
      latestTopic: null,
    },
  };
}

function startOfMonthIso(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
}

function startOfWeekIso(): string {
  const now = new Date();
  const start = new Date(now);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  return start.toISOString().slice(0, 10);
}

function skillColor(skill: Skill): string {
  return SKILL_COLORS[skill] ?? "#2563eb";
}

const SKILL_ORDER: Skill[] = [
  "pronunciation",
  "grammar",
  "vocabulary",
  "listening",
  "speaking",
  "reading",
  "writing",
];

const PATTERN_TREND_EVIDENCE_FLOOR = 5;

const SKILL_LABELS: Record<Skill, { vi: string; en: string }> = {
  pronunciation: { vi: "Phát âm", en: "Pronunciation" },
  grammar: { vi: "Ngữ pháp", en: "Grammar" },
  vocabulary: { vi: "Từ vựng", en: "Vocabulary" },
  listening: { vi: "Nghe", en: "Listening" },
  speaking: { vi: "Nói", en: "Speaking" },
  reading: { vi: "Đọc", en: "Reading" },
  writing: { vi: "Viết", en: "Writing" },
};

const SKILL_COLORS: Record<Skill, string> = {
  pronunciation: "#0ea5e9",
  grammar: "#7c3aed",
  vocabulary: "#16a34a",
  listening: "#f59e0b",
  speaking: "#db2777",
  reading: "#2563eb",
  writing: "#475569",
};

const TREND_LABELS: Record<string, { label: string; arrow: string; color: string; border: string }> = {
  improving: { label: "đang tốt lên", arrow: "↗", color: "#047857", border: "#a7f3d0" },
  stable: { label: "ổn định", arrow: "→", color: "#475569", border: "#cbd5e1" },
  worsening: { label: "cần chú ý", arrow: "↘", color: "#b45309", border: "#fde68a" },
};

const panelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 12,
};

const profileCardStyle: React.CSSProperties = {
  border: "1px solid rgba(15,23,42,0.10)",
  borderRadius: 16,
  padding: 18,
  background: "#ffffff",
  boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
};

const eyebrowStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: 0.4,
  color: "#2563eb",
};

const cardTitleStyle: React.CSSProperties = {
  margin: "6px 0 12px",
  fontSize: 18,
  lineHeight: 1.25,
  fontWeight: 900,
  color: "#0f172a",
};

const mutedTextStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  lineHeight: 1.5,
  color: "#64748b",
};

const softErrorStyle: React.CSSProperties = {
  border: "1px solid #fed7aa",
  borderRadius: 12,
  background: "#fff7ed",
  color: "#9a3412",
  padding: "10px 12px",
  fontSize: 13,
  fontWeight: 650,
};

const skillListStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const skillRowStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 5,
};

const skillHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  alignItems: "baseline",
};

const skillNameStyle: React.CSSProperties = {
  color: "#111827",
  fontSize: 13,
  fontWeight: 850,
};

const skillValueStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: 12,
  fontWeight: 750,
  textAlign: "right",
};

const barTrackStyle: React.CSSProperties = {
  width: "100%",
  height: 8,
  borderRadius: 999,
  background: "#e5e7eb",
  overflow: "hidden",
};

const barFillStyle: React.CSSProperties = {
  height: "100%",
  borderRadius: 999,
};

const skillEvidenceStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: 11,
  fontWeight: 650,
};

const patternListStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const patternItemStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  padding: 12,
  background: "#f8fafc",
};

const patternHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  alignItems: "flex-start",
};

const patternTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#0f172a",
  fontSize: 14,
  fontWeight: 900,
};

const patternExplanationStyle: React.CSSProperties = {
  ...mutedTextStyle,
  marginTop: 3,
};

const patternMetaRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 9,
  color: "#475569",
  fontSize: 12,
  fontWeight: 750,
};

const trendPillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 3,
  flexShrink: 0,
  border: "1px solid",
  borderRadius: 999,
  padding: "3px 8px",
  background: "#ffffff",
  fontSize: 11,
  fontWeight: 850,
  whiteSpace: "nowrap",
};

const practiceButtonStyle: React.CSSProperties = {
  marginTop: 10,
  minHeight: 34,
  border: "1px solid #bbf7d0",
  borderRadius: 8,
  background: "#047857",
  color: "#ffffff",
  padding: "0 12px",
  fontSize: 12,
  fontWeight: 850,
  cursor: "pointer",
};

const emptyBlockStyle: React.CSSProperties = {
  border: "1px dashed #cbd5e1",
  borderRadius: 12,
  background: "#f8fafc",
  padding: 14,
};

const rollupGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 10,
  marginBottom: 12,
};

const rollupStatStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  background: "#f8fafc",
  padding: 12,
};

const rollupValueStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: 24,
  lineHeight: 1,
  fontWeight: 950,
};

const rollupLabelStyle: React.CSSProperties = {
  marginTop: 5,
  color: "#64748b",
  fontSize: 12,
  fontWeight: 750,
};
