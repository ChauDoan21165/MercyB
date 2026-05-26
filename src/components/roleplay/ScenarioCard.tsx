// FILE: src/components/roleplay/ScenarioCard.tsx
//
// Presentational card for one roleplay scenario on the selection page.
// Pure props in / callback out — no data fetching, no routing.

import { memo } from "react";

export type ScenarioDifficulty = "beginner" | "intermediate" | "advanced";

export type Scenario = {
  id: string;
  title: string;
  titleVi?: string;
  setup: string;
  setupVi?: string;
  category: string;
  difficulty: ScenarioDifficulty;
  targetVocab?: string[];
  mercyOpener?: string;
  mercyOpenerVi?: string;
};

type ScenarioCardProps = {
  scenario: Scenario;
  onStart: (scenario: Scenario) => void;
  categoryLabel?: string;
  difficultyLabel?: string;
  // Optional progression hints — passed by the parent from a future progression
  // store. Defaults keep the card unchanged when omitted.
  completed?: boolean;
  bestScore?: number;
};

const PERFECT_SCORE_THRESHOLD = 85;

const DIFFICULTY_TONE: Record<ScenarioDifficulty, string> = {
  beginner:
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  intermediate:
    "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  advanced:
    "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
};

function ScenarioCardImpl({
  scenario,
  onStart,
  categoryLabel,
  difficultyLabel,
  completed = false,
  bestScore,
}: ScenarioCardProps) {
  const vocabPreview = (scenario.targetVocab ?? []).slice(0, 3);
  const setupPreview =
    scenario.setup.length > 140
      ? scenario.setup.slice(0, 137).trimEnd() + "…"
      : scenario.setup;
  const isPerfect =
    typeof bestScore === "number" && bestScore >= PERFECT_SCORE_THRESHOLD;

  return (
    <article
      data-testid={`scenario-card-${scenario.id}`}
      className="group flex flex-col rounded-2xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow p-4 gap-3"
    >
      <header className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
          {categoryLabel ?? scenario.category}
        </span>
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
            DIFFICULTY_TONE[scenario.difficulty]
          }`}
        >
          {difficultyLabel ?? scenario.difficulty}
        </span>
        {completed && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            ✓ Completed
          </span>
        )}
        {isPerfect && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400">
            ⭐ Perfect
          </span>
        )}
      </header>

      <div className="min-w-0">
        <h3 className="text-base font-semibold leading-snug">
          {scenario.title}
        </h3>
        {scenario.titleVi && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {scenario.titleVi}
          </p>
        )}
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
        {setupPreview}
      </p>

      {vocabPreview.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {vocabPreview.map((w) => (
            <span
              key={w}
              className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
            >
              {w}
            </span>
          ))}
          {(scenario.targetVocab?.length ?? 0) > vocabPreview.length && (
            <span className="text-[11px] px-2 py-0.5 rounded-full text-muted-foreground/70">
              +{(scenario.targetVocab?.length ?? 0) - vocabPreview.length}
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => onStart(scenario)}
        className="mt-auto inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Start
      </button>
    </article>
  );
}

export const ScenarioCard = memo(ScenarioCardImpl);
export default ScenarioCard;
