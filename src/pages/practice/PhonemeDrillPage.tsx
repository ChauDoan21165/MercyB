// /practice/phoneme/:phonemeSlug — focused 5-minute drill targeting
// one phoneme. The page reads a hand-curated pack (10 sentences) from
// `src/data/pronunciation/phoneme-drills`, surfaces the articulation
// tip + VN substitution insights, and walks the user through the
// sentences using the existing `SpeechDrill` recording engine.
//
// On each scored attempt:
//   - The score is added to a local `attemptScores[]` (drives progress
//     UI + before/after delta).
//   - We call `recordSpeechAttempt` so the row lands in `speech_attempts`
//     and feeds the heatmap on the next /progress visit.
//
// On completion (10/10):
//   - Compute before-vs-after delta (avg of first 3 vs last 3).
//   - Persist a session-avg into the graduation tracker. If this hits
//     the third consecutive ≥ 80 session, fire the celebration card.
//   - Show "Try again" CTA — same pack, fresh session id.
//
// Empty / error states:
//   - Unknown slug → "Pack not found, back to /progress" CTA.
//   - Anonymous user → sign-in nudge (the route is anon-viewable so
//     we don't auth-gate at the router).
//
// Source detection: ?src=heatmap|home|deep-link from the query string
// is captured once and emitted in `phoneme_drill_started` telemetry.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";

import { useAuth } from "@/providers/AuthProvider";
import { SpeechDrill, type SpeechAttemptEvent } from "@/components/speech/SpeechDrill";
import { recordSpeechAttempt } from "@/services/speechAttempts";
import {
  getDrillPackBySlug,
  type DrillSentence,
  type PhonemeDrillPack,
} from "@/data/pronunciation/phoneme-drills";
import {
  computeBeforeAfter,
  newDrillSessionId,
  trackDrillAbandoned,
  trackDrillCompleted,
  trackDrillSentenceScored,
  trackDrillStarted,
  type DrillSource,
} from "@/lib/pronunciation/drillTelemetry";
import {
  GRADUATION_SCORE_FLOOR,
  isGraduated,
  markCelebrationShown,
  progressFor,
  readGraduationState,
  recordDrillSession,
  writeGraduationState,
} from "@/lib/pronunciation/drillGraduation";

const FIRST_VISIT_KEY_PREFIX = "mercy.drill.firstVisit.v1.";

export default function PhonemeDrillPage() {
  const { phonemeSlug = "" } = useParams<{ phonemeSlug: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const nav = useNavigate();

  const pack = useMemo(() => getDrillPackBySlug(phonemeSlug), [phonemeSlug]);
  const source: DrillSource = useMemo(
    () => parseSource(searchParams.get("src")),
    [searchParams],
  );

  // Per-session state.
  const [sessionId, setSessionId] = useState<string>(() => newDrillSessionId());
  const [index, setIndex] = useState<number>(0);
  const [scores, setScores] = useState<number[]>([]);
  const [tipOpen, setTipOpen] = useState<boolean>(true);
  const [completedSummary, setCompletedSummary] =
    useState<DrillCompletionSummary | null>(null);
  const [graduationCard, setGraduationCard] = useState<boolean>(false);
  const startedAtRef = useRef<number>(Date.now());
  const abandonReportedRef = useRef<boolean>(false);

  // First-visit detection — tip stays open for the whole first session,
  // then collapsed by default thereafter.
  useEffect(() => {
    if (!pack || typeof localStorage === "undefined") return;
    const key = FIRST_VISIT_KEY_PREFIX + pack.slug;
    const seen = localStorage.getItem(key);
    if (seen) {
      setTipOpen(false);
    }
    try {
      localStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
  }, [pack]);

  // Started telemetry — fire once when pack resolves.
  useEffect(() => {
    if (!pack) return;
    startedAtRef.current = Date.now();
    abandonReportedRef.current = false;
    trackDrillStarted({
      session_id: sessionId,
      phoneme_slug: pack.slug,
      source,
    });
    // Best-effort abandon report on unload.
    const onUnload = () => {
      if (abandonReportedRef.current) return;
      if (completedSummary) return;
      if (index === 0 && scores.length === 0) return;
      abandonReportedRef.current = true;
      trackDrillAbandoned({
        session_id: sessionId,
        phoneme_slug: pack.slug,
        reached_index: index,
        duration_ms: Date.now() - startedAtRef.current,
      });
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pack?.slug, sessionId]);

  const onAttempt = useCallback(
    (event: SpeechAttemptEvent) => {
      if (!pack) return;
      const score = event.score?.overallScore ?? 0;
      const sentenceIndex = index;
      // Persist for heatmap. Fire-and-forget; never blocks UI.
      void recordSpeechAttempt({
        target: event.target,
        recognized: event.recognized,
        score: event.score,
        elapsedMs: event.elapsedMs,
        context: {
          extra: {
            drill_session_id: sessionId,
            drill_phoneme_slug: pack.slug,
            drill_sentence_index: sentenceIndex,
            drill_source: source,
          },
        },
      });
      trackDrillSentenceScored({
        session_id: sessionId,
        phoneme_slug: pack.slug,
        sentence_index: sentenceIndex,
        score: Math.round(score),
      });
      setScores((prev) => [...prev, Math.round(score)]);
    },
    [pack, index, sessionId, source],
  );

  const onAdvance = useCallback(() => {
    if (!pack) return;
    const nextIndex = index + 1;
    if (nextIndex < pack.sentences.length) {
      setIndex(nextIndex);
      return;
    }
    // Completed — compute summary, record graduation, fire telemetry.
    const ba = computeBeforeAfter(scores);
    const sessionAvg = scores.length > 0
      ? Math.round(scores.reduce((s, n) => s + n, 0) / scores.length)
      : 0;
    const durationMs = Date.now() - startedAtRef.current;
    trackDrillCompleted({
      session_id: sessionId,
      phoneme_slug: pack.slug,
      attempts: scores.length,
      before_avg: ba.before_avg,
      after_avg: ba.after_avg,
      delta: ba.delta,
      duration_ms: durationMs,
    });
    let justGraduated = false;
    if (user?.id) {
      const r = recordDrillSession({
        userId: user.id,
        phonemeSlug: pack.slug,
        sessionAvg,
      });
      justGraduated = r.justGraduated;
    }
    setCompletedSummary({
      sessionAvg,
      before_avg: ba.before_avg,
      after_avg: ba.after_avg,
      delta: ba.delta,
    });
    setGraduationCard(justGraduated);
  }, [pack, index, scores, sessionId, user]);

  const onTryAgain = useCallback(() => {
    if (!pack) return;
    setSessionId(newDrillSessionId());
    setIndex(0);
    setScores([]);
    setCompletedSummary(null);
    setGraduationCard(false);
    startedAtRef.current = Date.now();
    abandonReportedRef.current = false;
    trackDrillStarted({
      session_id: sessionId,
      phoneme_slug: pack.slug,
      source: "deep_link",
    });
  }, [pack, sessionId]);

  const dismissCelebration = useCallback(() => {
    if (!user?.id || !pack) return setGraduationCard(false);
    const state = readGraduationState(user.id);
    state.byPhoneme[pack.slug] = markCelebrationShown(progressFor(state, pack.slug));
    writeGraduationState(user.id, state);
    setGraduationCard(false);
  }, [user, pack]);

  if (!pack) {
    return <UnknownSlugView slug={phonemeSlug} onBack={() => nav("/progress")} />;
  }

  const total = pack.sentences.length;
  const isFinished = completedSummary !== null;
  const currentSentence = pack.sentences[index];

  return (
    <div style={pageStyle}>
      <header style={headerRowStyle}>
        <Link to="/progress" style={backLinkStyle} aria-label="Quay lại tiến độ · Back to progress">
          ← /progress
        </Link>
        <div style={{ textAlign: "right" }}>
          <div style={titleViStyle}>Luyện {pack.phoneme_label_vi}</div>
          <div style={titleEnStyle}>{pack.phoneme_label_en}</div>
        </div>
      </header>

      <PhonemeTip pack={pack} open={tipOpen} onToggle={() => setTipOpen((v) => !v)} />

      {graduationCard ? (
        <GraduationCelebrationCard pack={pack} onDismiss={dismissCelebration} />
      ) : null}

      {!user ? (
        <SignInNudge />
      ) : null}

      {!isFinished ? (
        <>
          <ProgressBar index={index} total={total} />
          <SentenceCallout sentence={currentSentence} />
          <SpeechDrill
            key={`${pack.slug}-${sessionId}-${index}`}
            targetSentence={currentSentence.sentence_en}
            targetSentenceVi={currentSentence.sentence_vi}
            onAttempt={onAttempt}
            onNext={onAdvance}
          />
          <SubstitutionHint
            pack={pack}
            lastScore={scores[scores.length - 1] ?? null}
            sentenceIndex={index}
            scoresLength={scores.length}
          />
        </>
      ) : (
        <CompletionPanel
          pack={pack}
          summary={completedSummary}
          onTryAgain={onTryAgain}
          onDone={() => nav("/progress")}
        />
      )}
    </div>
  );
}

// ── Subcomponents ───────────────────────────────────────────────────────

function PhonemeTip({
  pack,
  open,
  onToggle,
}: {
  pack: PhonemeDrillPack;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <section style={tipBoxStyle} aria-label="Cách phát âm · Articulation tip">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        style={tipToggleStyle}
        data-testid="phoneme-tip-toggle"
      >
        <span style={{ fontSize: 18 }}>{pack.phoneme_ipa}</span>
        <span style={{ flex: 1, textAlign: "left" }}>
          {open ? "Cách phát âm · Articulation tip" : "Xem cách phát âm · Show tip"}
        </span>
        <span aria-hidden style={{ fontSize: 14 }}>{open ? "▴" : "▾"}</span>
      </button>
      {open ? (
        <div style={{ padding: "0 14px 12px" }}>
          <p style={tipViStyle}>{pack.articulation_tip_vi}</p>
          <p style={tipEnStyle}>{pack.articulation_tip_en}</p>
        </div>
      ) : null}
    </section>
  );
}

function ProgressBar({ index, total }: { index: number; total: number }) {
  const pct = Math.min(100, (index / total) * 100);
  return (
    <div style={{ marginTop: 10 }} aria-label={`Tiến độ ${index} trên ${total}`}>
      <div style={progressTrackStyle}>
        <div style={{ ...progressFillStyle, width: `${pct}%` }} />
      </div>
      <div style={progressLabelStyle}>
        {index + 1}/{total} câu · sentences
      </div>
    </div>
  );
}

function SentenceCallout({ sentence }: { sentence: DrillSentence }) {
  const words = sentence.sentence_en.split(/\s+/);
  const targetSet = new Set(sentence.target_word_indices);
  return (
    <div style={sentenceBoxStyle} aria-label="Câu mục tiêu · Target sentence">
      <div style={{ marginBottom: 6 }}>
        {words.map((w, i) => (
          <span
            key={`${i}-${w}`}
            style={targetSet.has(i) ? highlightedWordStyle : plainWordStyle}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
      <div style={sentenceViStyle}>{sentence.sentence_vi}</div>
      {sentence.notes_vi ? <div style={notesViStyle}>{sentence.notes_vi}</div> : null}
    </div>
  );
}

function SubstitutionHint({
  pack,
  lastScore,
  sentenceIndex,
  scoresLength,
}: {
  pack: PhonemeDrillPack;
  lastScore: number | null;
  sentenceIndex: number;
  scoresLength: number;
}) {
  // Show only when we just scored the *current* sentence below the
  // threshold AND we have substitution copy.
  const justScored = scoresLength === sentenceIndex + 1;
  if (!justScored || lastScore === null || lastScore >= 60) return null;
  if (pack.common_vn_substitutions.length === 0) return null;
  const top = pack.common_vn_substitutions[0];
  return (
    <div style={substitutionHintStyle} role="alert" data-testid="substitution-hint">
      <div style={{ fontWeight: 800, marginBottom: 4 }}>
        Có thể bạn đang nói {top.wrong_ipa} thay vì {pack.phoneme_ipa}
      </div>
      <div style={{ fontSize: 12, color: "rgba(0,0,0,0.7)" }}>{top.why_vi}</div>
    </div>
  );
}

function CompletionPanel({
  pack,
  summary,
  onTryAgain,
  onDone,
}: {
  pack: PhonemeDrillPack;
  summary: DrillCompletionSummary;
  onTryAgain: () => void;
  onDone: () => void;
}) {
  const deltaTone =
    summary.delta === null
      ? "neutral"
      : summary.delta >= 5
      ? "positive"
      : summary.delta <= -5
      ? "negative"
      : "neutral";
  return (
    <section style={completionStyle} aria-label="Hoàn thành · Drill complete">
      <h2 style={completionTitleStyle}>Hoàn thành ✨ · Drill complete</h2>
      <p style={completionSubtitleStyle}>
        Trung bình phiên {pack.phoneme_ipa}: <strong>{summary.sessionAvg}/100</strong>
      </p>
      {summary.before_avg !== null && summary.after_avg !== null ? (
        <div style={beforeAfterRowStyle}>
          <BeforeAfterChip
            label_vi="3 câu đầu"
            label_en="First 3"
            value={summary.before_avg}
          />
          <BeforeAfterChip
            label_vi="3 câu cuối"
            label_en="Last 3"
            value={summary.after_avg}
          />
          <DeltaChip delta={summary.delta} tone={deltaTone} />
        </div>
      ) : (
        <p style={{ fontSize: 12, color: "rgba(0,0,0,0.55)" }}>
          Cần ít nhất 6 câu để so sánh trước-sau · Need 6+ attempts for before/after.
        </p>
      )}
      <div style={ctaRowStyle}>
        <button type="button" onClick={onTryAgain} style={primaryBtnStyle}>
          Luyện lại · Try again
        </button>
        <button type="button" onClick={onDone} style={secondaryBtnStyle}>
          Quay lại /progress · Back
        </button>
      </div>
    </section>
  );
}

function BeforeAfterChip({
  label_vi,
  label_en,
  value,
}: {
  label_vi: string;
  label_en: string;
  value: number;
}) {
  return (
    <div style={chipStyle}>
      <div style={chipLabelStyle}>
        {label_vi} · {label_en}
      </div>
      <div style={chipValueStyle}>{value}/100</div>
    </div>
  );
}

function DeltaChip({
  delta,
  tone,
}: {
  delta: number | null;
  tone: "positive" | "negative" | "neutral";
}) {
  const toneColor =
    tone === "positive" ? "#22c55e" : tone === "negative" ? "#ef4444" : "#64748b";
  if (delta === null) return null;
  const sign = delta >= 0 ? "+" : "";
  return (
    <div style={{ ...chipStyle, borderColor: `${toneColor}40` }}>
      <div style={chipLabelStyle}>Δ Δ · Change</div>
      <div style={{ ...chipValueStyle, color: toneColor }}>{sign}{delta}</div>
    </div>
  );
}

function GraduationCelebrationCard({
  pack,
  onDismiss,
}: {
  pack: PhonemeDrillPack;
  onDismiss: () => void;
}) {
  return (
    <section
      style={celebrationStyle}
      role="alert"
      aria-label={`Bạn đã graduate ${pack.phoneme_ipa}`}
      data-testid="graduation-celebration"
    >
      <div style={{ fontSize: 22 }}>🎓✨</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={celebrationTitleStyle}>
          Bạn đã graduate {pack.phoneme_ipa}!
        </div>
        <div style={celebrationSubtitleStyle}>
          Three drill sessions in a row at {GRADUATION_SCORE_FLOOR}+/100. Ấn tượng đó.
        </div>
      </div>
      <button type="button" onClick={onDismiss} style={secondaryBtnStyle}>
        Đóng · Dismiss
      </button>
    </section>
  );
}

function SignInNudge() {
  return (
    <div style={signInNudgeStyle} role="status">
      <strong>Bạn chưa đăng nhập.</strong> Có thể luyện thử, nhưng điểm sẽ không lưu.
      <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", marginTop: 4 }}>
        Sign in to track progress and unlock graduation milestones.
      </div>
    </div>
  );
}

function UnknownSlugView({
  slug,
  onBack,
}: {
  slug: string;
  onBack: () => void;
}) {
  return (
    <div style={pageStyle}>
      <h1 style={titleViStyle}>Không tìm thấy bài luyện · Pack not found</h1>
      <p style={{ fontSize: 13, color: "rgba(0,0,0,0.7)" }}>
        Slug "{slug}" không khớp với bộ luyện nào.
      </p>
      <button type="button" onClick={onBack} style={primaryBtnStyle}>
        Quay lại /progress · Back
      </button>
    </div>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────

type DrillCompletionSummary = {
  sessionAvg: number;
  before_avg: number | null;
  after_avg: number | null;
  delta: number | null;
};

function parseSource(raw: string | null): DrillSource {
  if (raw === "heatmap") return "heatmap_cta";
  if (raw === "home") return "home_card";
  return "deep_link";
}

// ── Styles ──────────────────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  maxWidth: 720,
  margin: "0 auto",
  padding: "16px 14px 80px",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const headerRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
};

const backLinkStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "rgba(67,56,202,0.85)",
  textDecoration: "none",
  padding: "6px 10px",
  borderRadius: 9999,
  background: "rgba(99,102,241,0.06)",
  border: "1px solid rgba(99,102,241,0.20)",
};

const titleViStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: "rgba(15,23,42,0.92)",
};

const titleEnStyle: React.CSSProperties = {
  fontSize: 11,
  color: "rgba(0,0,0,0.55)",
  marginTop: 2,
};

const tipBoxStyle: React.CSSProperties = {
  borderRadius: 12,
  background: "rgba(99,102,241,0.06)",
  border: "1px solid rgba(99,102,241,0.20)",
};

const tipToggleStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  width: "100%",
  padding: "10px 14px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 800,
  color: "rgba(67,56,202,0.85)",
};

const tipViStyle: React.CSSProperties = {
  marginTop: 4,
  marginBottom: 4,
  fontSize: 13,
  lineHeight: 1.5,
  color: "rgba(15,23,42,0.85)",
};

const tipEnStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 0,
  fontSize: 11,
  color: "rgba(0,0,0,0.55)",
};

const progressTrackStyle: React.CSSProperties = {
  height: 4,
  background: "rgba(0,0,0,0.08)",
  borderRadius: 9999,
  overflow: "hidden",
};

const progressFillStyle: React.CSSProperties = {
  height: 4,
  background: "linear-gradient(90deg, #818CF8 0%, #6366F1 100%)",
  borderRadius: 9999,
  transition: "width 200ms",
};

const progressLabelStyle: React.CSSProperties = {
  marginTop: 6,
  fontSize: 11,
  fontWeight: 700,
  color: "rgba(0,0,0,0.55)",
};

const sentenceBoxStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 12,
  background: "white",
  border: "1px solid rgba(0,0,0,0.08)",
  boxShadow: "0 4px 12px rgba(15,23,42,0.04)",
};

const plainWordStyle: React.CSSProperties = {
  fontSize: 18,
  color: "rgba(15,23,42,0.85)",
};

const highlightedWordStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  color: "#4338ca",
  background: "rgba(99,102,241,0.12)",
  padding: "1px 4px",
  borderRadius: 4,
};

const sentenceViStyle: React.CSSProperties = {
  marginTop: 6,
  fontSize: 13,
  color: "rgba(0,0,0,0.6)",
};

const notesViStyle: React.CSSProperties = {
  marginTop: 6,
  fontSize: 12,
  color: "#92400e",
  fontStyle: "italic",
};

const substitutionHintStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  background: "#fef3c7",
  border: "1px solid #fcd34d",
  fontSize: 13,
  color: "rgba(15,23,42,0.85)",
};

const completionStyle: React.CSSProperties = {
  padding: 18,
  borderRadius: 16,
  background:
    "linear-gradient(150deg, rgba(238,242,255,0.96) 0%, rgba(252,252,255,0.96) 100%)",
  border: "1px solid rgba(99,102,241,0.20)",
  textAlign: "center",
};

const completionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 900,
  color: "rgba(15,23,42,0.92)",
};

const completionSubtitleStyle: React.CSSProperties = {
  marginTop: 6,
  marginBottom: 14,
  fontSize: 13,
  color: "rgba(0,0,0,0.7)",
};

const beforeAfterRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  justifyContent: "center",
  marginBottom: 14,
};

const chipStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 12,
  background: "white",
  border: "1px solid rgba(99,102,241,0.20)",
  minWidth: 92,
};

const chipLabelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 800,
  color: "rgba(67,56,202,0.7)",
};

const chipValueStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 900,
  color: "rgba(15,23,42,0.92)",
};

const ctaRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  justifyContent: "center",
  flexWrap: "wrap",
};

const primaryBtnStyle: React.CSSProperties = {
  padding: "10px 18px",
  borderRadius: 9999,
  background: "linear-gradient(150deg, #6366F1 0%, #4F46E5 100%)",
  color: "white",
  border: "none",
  fontSize: 13,
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 6px 18px rgba(79,70,229,0.25)",
};

const secondaryBtnStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 9999,
  background: "transparent",
  color: "rgba(67,56,202,0.85)",
  border: "1px solid rgba(99,102,241,0.30)",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const celebrationStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: 14,
  borderRadius: 14,
  background: "linear-gradient(150deg, #fef3c7 0%, #fde68a 100%)",
  border: "1px solid #fcd34d",
};

const celebrationTitleStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 900,
  color: "rgba(120,53,15,0.95)",
};

const celebrationSubtitleStyle: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(120,53,15,0.7)",
  marginTop: 2,
};

const signInNudgeStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  background: "#f1f5f9",
  border: "1px solid rgba(0,0,0,0.06)",
  fontSize: 13,
  color: "rgba(15,23,42,0.85)",
};
