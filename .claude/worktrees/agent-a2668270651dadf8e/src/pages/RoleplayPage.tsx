// FILE: src/pages/RoleplayPage.tsx
//
// /roleplay — scenario selection entry point. Local state machine:
//   "list"    → grid of ScenarioCards with category + difficulty filters
//   "session" → mounts <RoleplaySession> for the selected scenario
//   "summary" → shows the post-session summary with replay / back actions
//
// Data: src/data/roleplay/scenarios.json (A5's 20-scenario set). The raw
// JSON shape is adapted to the Scenario type inside useScenarios().

import { useMemo, useState } from "react";

import scenariosJson from "@/data/roleplay/scenarios.json";
import {
  RoleplaySession,
  type RoleplayScenario,
  type RoleplaySessionSummary,
} from "@/components/roleplay/RoleplaySession";
import { SessionSummary } from "@/components/roleplay/SessionSummary";
import {
  ScenarioCard,
  type Scenario,
  type ScenarioDifficulty,
} from "@/components/roleplay/ScenarioCard";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";

// Raw shape of src/data/roleplay/scenarios.json (A5's schema). Adapted to
// the Scenario type below in `useScenarios()` so the rest of the page —
// ScenarioCard, RoleplaySession, SessionSummary — stays unchanged.
type RawScenario = {
  slug: string;
  title_en: string;
  title_vi: string;
  setup_en: string;
  setup_vi: string;
  category: string;
  difficulty: string;
  vocab_focus?: string[];
};

function adaptRawScenario(raw: RawScenario): Scenario {
  return {
    id: raw.slug,
    title: raw.title_en,
    titleVi: raw.title_vi,
    setup: raw.setup_en,
    setupVi: raw.setup_vi,
    category: raw.category,
    difficulty: raw.difficulty as ScenarioDifficulty,
    targetVocab: raw.vocab_focus,
  };
}

type ViewMode =
  | { kind: "list" }
  | { kind: "session"; scenario: Scenario }
  | { kind: "summary"; scenario: Scenario; summary: RoleplaySessionSummary };

type CategoryFilter = "all" | string;
type DifficultyFilter = "all" | ScenarioDifficulty;

const CATEGORY_LABEL_VI: Record<string, string> = {
  nail_salon: "Tiệm nail",
  restaurant: "Nhà hàng",
  healthcare: "Y tế",
  job_interview: "Phỏng vấn",
  daily_life: "Đời thường",
};

const DIFFICULTY_LABEL_VI: Record<ScenarioDifficulty, string> = {
  beginner: "Cơ bản",
  intermediate: "Trung cấp",
  advanced: "Nâng cao",
};

function categoryLabel(cat: string): string {
  if (CATEGORY_LABEL_VI[cat]) return CATEGORY_LABEL_VI[cat];
  const pretty = cat.replace(/_/g, " ");
  return pretty.charAt(0).toUpperCase() + pretty.slice(1);
}

function difficultyLabel(d: ScenarioDifficulty): string {
  return DIFFICULTY_LABEL_VI[d];
}

function useScenarios(): Scenario[] {
  return (scenariosJson as RawScenario[]).map(adaptRawScenario);
}

function toRoleplayScenario(s: Scenario): RoleplayScenario {
  return {
    id: s.id,
    title: s.title,
    titleVi: s.titleVi,
    setup: s.setup,
    setupVi: s.setupVi,
    targetVocab: s.targetVocab,
    mercyOpener: s.mercyOpener,
    mercyOpenerVi: s.mercyOpenerVi,
  };
}

export default function RoleplayPage() {
  const { enabled: flagEnabled, loading: flagLoading } = useFeatureFlag(
    "roleplay_enabled",
    true,
  );

  const scenarios = useScenarios();
  const [view, setView] = useState<ViewMode>({ kind: "list" });
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    scenarios.forEach((s) => set.add(s.category));
    return Array.from(set);
  }, [scenarios]);

  const filtered = useMemo(() => {
    return scenarios.filter((s) => {
      if (categoryFilter !== "all" && s.category !== categoryFilter)
        return false;
      if (difficultyFilter !== "all" && s.difficulty !== difficultyFilter)
        return false;
      return true;
    });
  }, [scenarios, categoryFilter, difficultyFilter]);

  if (!flagLoading && !flagEnabled) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-6 text-center">
        <div className="max-w-sm">
          <h1 className="text-lg font-semibold mb-2">Roleplay</h1>
          <p className="text-sm text-muted-foreground">
            Tính năng này đang được hoàn thiện. Quay lại sau bạn nhé.
          </p>
        </div>
      </main>
    );
  }

  if (view.kind === "session") {
    return (
      <main className="min-h-[100dvh] bg-background">
        <div className="px-3 pt-3">
          <button
            type="button"
            onClick={() => setView({ kind: "list" })}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to scenarios
          </button>
        </div>
        <RoleplaySession
          scenario={toRoleplayScenario(view.scenario)}
          onEndSession={(summary) =>
            setView({ kind: "summary", scenario: view.scenario, summary })
          }
        />
      </main>
    );
  }

  if (view.kind === "summary") {
    const corrections = view.summary.turns
      .filter((t) => t.role === "user" && t.correction)
      .map((t) => t.correction!);
    return (
      <main className="min-h-[100dvh] bg-background text-foreground">
        <SessionSummary
          scenario={toRoleplayScenario(view.scenario)}
          transcript={view.summary.turns}
          corrections={corrections}
          vocabUsed={view.summary.vocabUsed}
          onReplay={() =>
            setView({ kind: "session", scenario: view.scenario })
          }
          onBack={() => setView({ kind: "list" })}
        />
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Roleplay
          </h1>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            Practice real-life situations in English with Mercy.
          </p>
          <p className="text-xs text-muted-foreground/80 leading-relaxed">
            Chọn một tình huống đời thật và luyện nói tự nhiên cùng Mercy.
          </p>
        </header>

        <FilterBar
          categories={categories}
          categoryFilter={categoryFilter}
          difficultyFilter={difficultyFilter}
          onCategoryChange={setCategoryFilter}
          onDifficultyChange={setDifficultyFilter}
        />

        {filtered.length === 0 ? (
          <EmptyState
            onReset={() => {
              setCategoryFilter("all");
              setDifficultyFilter("all");
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {filtered.map((s) => (
              <ScenarioCard
                key={s.id}
                scenario={s}
                categoryLabel={categoryLabel(s.category)}
                difficultyLabel={difficultyLabel(s.difficulty)}
                onStart={(scenario) =>
                  setView({ kind: "session", scenario })
                }
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function FilterBar({
  categories,
  categoryFilter,
  difficultyFilter,
  onCategoryChange,
  onDifficultyChange,
}: {
  categories: string[];
  categoryFilter: CategoryFilter;
  difficultyFilter: DifficultyFilter;
  onCategoryChange: (v: CategoryFilter) => void;
  onDifficultyChange: (v: DifficultyFilter) => void;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3">
      <FilterRow
        label="Chủ đề"
        ariaLabel="Filter by category"
        options={[
          { value: "all", label: "Tất cả" },
          ...categories.map((c) => ({ value: c, label: categoryLabel(c) })),
        ]}
        value={categoryFilter}
        onChange={onCategoryChange}
      />
      <FilterRow
        label="Mức độ"
        ariaLabel="Filter by difficulty"
        options={[
          { value: "all", label: "Tất cả" },
          { value: "beginner", label: difficultyLabel("beginner") },
          { value: "intermediate", label: difficultyLabel("intermediate") },
          { value: "advanced", label: difficultyLabel("advanced") },
        ]}
        value={difficultyFilter}
        onChange={(v) => onDifficultyChange(v as DifficultyFilter)}
      />
    </div>
  );
}

function FilterRow({
  label,
  ariaLabel,
  options,
  value,
  onChange,
}: {
  label: string;
  ariaLabel: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1.5">
        {label}
      </p>
      <div
        role="group"
        aria-label={ariaLabel}
        className="flex flex-wrap gap-1.5"
      >
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={active}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:bg-muted"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
      <p className="text-sm font-medium">No scenarios match those filters.</p>
      <p className="text-xs text-muted-foreground mt-1">
        Chưa có tình huống phù hợp. Thử bỏ bộ lọc nhé.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 text-xs px-4 py-2 rounded-full border border-border hover:bg-muted transition-colors"
      >
        Clear filters
      </button>
    </div>
  );
}

