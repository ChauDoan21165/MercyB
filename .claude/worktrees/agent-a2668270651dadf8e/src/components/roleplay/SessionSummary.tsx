// FILE: src/components/roleplay/SessionSummary.tsx

import { useMemo, useState } from "react";
import type {
  RoleplayCorrection,
  RoleplayScenario,
  RoleplayTurn,
} from "./RoleplaySession";
import { calculateXP, getLevel, updateStreak } from "@/lib/progression/xpEngine";

export type SessionSummaryProps = {
  scenario: RoleplayScenario;
  transcript: RoleplayTurn[];
  corrections: RoleplayCorrection[];
  vocabUsed: string[];
  onReplay?: () => void;
  onBack?: () => void;
};

type SuccessCriterion = {
  id: string;
  label: string;
  done: boolean;
};

type ScoreBreakdown = {
  total: number;
  criteriaPoints: number;
  vocabPoints: number;
  repeatPenalty: number;
  criteria: SuccessCriterion[];
  topCorrections: RoleplayCorrection[];
  repeatedPatterns: number;
};

const MIN_TURNS_ENGAGED = 3;
const MIN_TURNS_FULL_SCENE = 6;
const CRITERION_POINTS = 18;
const MAX_VOCAB_POINTS = 28;
const MAX_REPEAT_PENALTY = 10;
const PENALTY_PER_REPEAT = 2;

function normalizePattern(c: RoleplayCorrection): string {
  return `${c.original.trim().toLowerCase()}→${c.improved.trim().toLowerCase()}`;
}

function pickTopCorrections(
  corrections: RoleplayCorrection[],
  limit = 5
): RoleplayCorrection[] {
  const seen = new Set<string>();
  const unique: RoleplayCorrection[] = [];
  for (const c of corrections) {
    const key = normalizePattern(c);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(c);
    if (unique.length >= limit) break;
  }
  return unique;
}

function countRepeatedPatterns(corrections: RoleplayCorrection[]): number {
  const counts = new Map<string, number>();
  for (const c of corrections) {
    const key = normalizePattern(c);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  let repeats = 0;
  counts.forEach((n) => {
    if (n > 1) repeats += n - 1;
  });
  return repeats;
}

function computeScore(props: SessionSummaryProps): ScoreBreakdown {
  const { scenario, transcript, corrections, vocabUsed } = props;
  const targets = scenario.targetVocab ?? [];
  const userTurnCount = transcript.filter((t) => t.role === "user").length;
  const hasTargets = targets.length > 0;
  const vocabRatio = hasTargets
    ? Math.min(1, vocabUsed.length / targets.length)
    : 0;

  const criteria: SuccessCriterion[] = [
    {
      id: "engaged",
      label: `Tham gia ít nhất ${MIN_TURNS_ENGAGED} lượt`,
      done: userTurnCount >= MIN_TURNS_ENGAGED,
    },
    {
      id: "fullScene",
      label: `Giữ tình huống qua ${MIN_TURNS_FULL_SCENE} lượt`,
      done: userTurnCount >= MIN_TURNS_FULL_SCENE,
    },
    {
      id: "vocab",
      label: hasTargets
        ? `Dùng ít nhất 1 từ mục tiêu`
        : `Nói tự nhiên, không bị kẹt`,
      done: hasTargets ? vocabUsed.length >= 1 : userTurnCount >= 2,
    },
    {
      id: "stayedInScene",
      label: `Hoàn thành buổi tập (kết thúc đúng cách)`,
      done: userTurnCount >= 1,
    },
  ];

  const completedCount = criteria.filter((c) => c.done).length;
  const criteriaPoints = completedCount * CRITERION_POINTS;
  const vocabPoints = Math.round(vocabRatio * MAX_VOCAB_POINTS);

  const repeatedPatterns = countRepeatedPatterns(corrections);
  const repeatPenalty = Math.min(
    MAX_REPEAT_PENALTY,
    repeatedPatterns * PENALTY_PER_REPEAT
  );

  const raw = criteriaPoints + vocabPoints - repeatPenalty;
  const total = Math.max(0, Math.min(100, raw));

  return {
    total,
    criteriaPoints,
    vocabPoints,
    repeatPenalty,
    criteria,
    topCorrections: pickTopCorrections(corrections, 5),
    repeatedPatterns,
  };
}

function nextStepMessage(score: number, vocabRemaining: number): string {
  if (score >= 85) {
    return vocabRemaining > 0
      ? `Tuyệt vời! Lần sau thử dùng thêm ${vocabRemaining} từ mục tiêu còn lại nhé.`
      : "Tuyệt vời! Bạn đã giữ tình huống rất tự nhiên — sẵn sàng cho cảnh khó hơn.";
  }
  if (score >= 65) {
    return "Rất tốt — bạn đang tiến bộ rõ. Lặp lại cảnh này một lần nữa để câu nói trôi hơn.";
  }
  if (score >= 40) {
    return "Bạn đã dám nói — đó là phần khó nhất. Thử replay và để câu trả lời dài hơn một chút.";
  }
  return "Mỗi lần tập là một bước tiến. Replay nhé — không có ai làm sai trong lớp Mercy.";
}

function ScoreRing({ score }: { score: number }) {
  const size = 96;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const tone =
    score >= 80
      ? "text-emerald-500"
      : score >= 55
      ? "text-primary"
      : "text-amber-500";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className="stroke-muted"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeLinecap="round"
          className={`${tone} transition-[stroke-dashoffset] duration-700`}
          stroke="currentColor"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-semibold ${tone}`}>{score}</span>
        <span className="text-[10px] text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

function CriteriaList({ criteria }: { criteria: SuccessCriterion[] }) {
  return (
    <ul className="space-y-1.5">
      {criteria.map((c) => (
        <li key={c.id} className="flex items-start gap-2 text-sm">
          <span
            className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${
              c.done
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : "bg-muted text-muted-foreground"
            }`}
            aria-hidden
          >
            {c.done ? "✓" : "•"}
          </span>
          <span className={c.done ? "text-foreground" : "text-muted-foreground"}>
            {c.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

function VocabSection({
  used,
  targets,
}: {
  used: string[];
  targets: string[];
}) {
  if (targets.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Cảnh này không có từ mục tiêu cố định — bạn được tự do nói theo cách
        của mình.
      </p>
    );
  }
  const usedSet = new Set(used.map((w) => w.toLowerCase()));
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">
        Đã dùng <span className="font-medium text-foreground">{used.length}</span>{" "}
        / {targets.length} từ mục tiêu
      </p>
      <div className="flex flex-wrap gap-1.5">
        {targets.map((w) => {
          const hit = usedSet.has(w.toLowerCase());
          return (
            <span
              key={w}
              className={`text-[11px] px-2 py-0.5 rounded-full ${
                hit
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {hit ? "✓ " : ""}
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function CorrectionsSection({
  corrections,
}: {
  corrections: RoleplayCorrection[];
}) {
  if (corrections.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Không có lỗi đáng kể trong buổi này — bạn nói rõ và đủ ý.
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {corrections.map((c, i) => (
        <li
          key={`${c.original}-${i}`}
          className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 px-3 py-2 text-xs"
        >
          <p className="text-foreground/80">
            <span className="line-through opacity-60">{c.original}</span>
          </p>
          <p className="text-foreground mt-0.5">{c.improved}</p>
          {c.noteVi && (
            <p className="mt-1 text-muted-foreground text-[11px] leading-relaxed">
              {c.noteVi}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

export function SessionSummary(props: SessionSummaryProps) {
  const { scenario, transcript, vocabUsed, onReplay, onBack } = props;
  const targets = scenario.targetVocab ?? [];
  const userTurnCount = useMemo(
    () => transcript.filter((t) => t.role === "user").length,
    [transcript]
  );
  const breakdown = useMemo(() => computeScore(props), [props]);
  const vocabRemaining = Math.max(0, targets.length - vocabUsed.length);
  const message = nextStepMessage(breakdown.total, vocabRemaining);

  // Local temp state until a real progression store wires in.
  const [totalXP] = useState(0);
  const [lastActiveDate] = useState(() => new Date().toISOString().slice(0, 10));
  const completedCriteria = breakdown.criteria.filter((c) => c.done).length;
  const xpEarned = calculateXP({
    turnCount: userTurnCount,
    successCriteriaMet: completedCriteria,
    totalCriteria: breakdown.criteria.length,
    vocabUsed: vocabUsed.length,
    targetVocab: targets.length,
  });
  const newTotalXP = totalXP + xpEarned;
  const levelInfo = getLevel(newTotalXP);
  const level = levelInfo.level;
  const progress = Math.round(levelInfo.progress * 100);
  const streak = updateStreak(lastActiveDate).streak;

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto bg-background text-foreground px-4 py-5 sm:py-8">
      <header className="flex items-center gap-4 mb-5">
        <ScoreRing score={breakdown.total} />
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Hoàn thành buổi tập
          </p>
          <h2 className="text-lg font-semibold leading-snug truncate">
            {scenario.title}
          </h2>
          {scenario.titleVi && (
            <p className="text-xs text-muted-foreground truncate">
              {scenario.titleVi}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {userTurnCount} lượt nói
          </p>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mb-4">
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          +{xpEarned} XP
        </span>
        <span aria-label={`${streak}-day streak`}>
          🔥 {streak}-day streak
        </span>
        <span className="text-muted-foreground">
          Level {level}{" "}
          <span className="text-foreground/80">({progress}%)</span>
        </span>
      </div>

      <p className="rounded-xl bg-primary/5 border border-primary/20 px-3 py-2.5 text-sm leading-relaxed mb-5">
        {message}
      </p>

      <section className="mb-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Mục tiêu của buổi này
        </h3>
        <CriteriaList criteria={breakdown.criteria} />
      </section>

      <section className="mb-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Từ vựng đã dùng
        </h3>
        <VocabSection used={vocabUsed} targets={targets} />
      </section>

      <section className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Gợi ý hữu ích
        </h3>
        <CorrectionsSection corrections={breakdown.topCorrections} />
      </section>

      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-4 py-2.5 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            Về danh sách cảnh
          </button>
        )}
        {onReplay && (
          <button
            type="button"
            onClick={onReplay}
            className="flex-1 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Tập lại cảnh này
          </button>
        )}
      </div>
    </div>
  );
}

export default SessionSummary;
