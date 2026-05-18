// src/pages/onboarding/OnboardingPage.tsx
//
// ⚠️ ORPHANED — INTENTIONALLY UNUSED, DO NOT DELETE (as of fix(onboarding)
// "default new users to (vi, ['en'])", migration 20260616000000).
//
// Nothing routes here anymore. The only live caller was the Home gate
// (src/pages/Home.tsx — redirect when profiles.native_language IS NULL).
// That gate can no longer fire: native_language now DEFAULTs to 'vi' for
// every new signup, because vi-native learners studying English are ~95%
// of signups (the home market) and asking them the picker question is
// pure friction with zero information gain (STRATEGY v3.0 §4). The
// native+target picker is now a Settings-only opt-in —
// src/components/account/LanguagePairSettings.tsx, mounted at /account
// (PR 3/3). The /onboarding <Route> is kept in src/router/AppRouter.tsx
// and this component is kept whole so Chau can later decide to remount
// the flow differently (e.g. a guided tour for users who tap "add a
// language" in Settings). It is parked, not dead — leave it intact.
//
// ── Original PR 2/3 documentation (still accurate if remounted) ───────
// Duolingo-style pair-selection onboarding at /onboarding (PR 2 of 3).
//
// Steps in canonical order (some conditionally skipped — see nextStep):
//   1. welcome      — friendly intro from Mercy
//   2. native       — NEW: pick native language (vi | en). Screen 1.
//   3. target       — NEW: multi-select target language(s), filtered by
//                     the canonical content-readiness matrix for the
//                     chosen native. Screen 2.
//   4. start_with   — NEW: only when >1 target chosen — pick the primary
//                     (the one Mercy opens first). Screen 3.
//   5. goal         — only when the primary target is English
//                     (IELTS/TOEIC/VSTEP/career are English-specific)
//   6. profession   — only when goal === "career"
//   7. level         — only when the primary target is English
//   8. confirmation — summary + "Hoàn tất" → persist + navigate
//
// The (vi → en) path is preserved exactly (locked #14): a vi-native
// learner who picks English still flows through goal/profession/level
// → the same pickFirstLesson routing as before. Non-English primaries
// skip the English-specific steps and route into their /languages
// track.
//
// Persistence: on confirmation, native_language + target_languages
// (ordered, primary first) + onboarded_at — plus, ONLY when the primary
// target is English, primary_goal/profession/english_level — are
// written in one update to public.profiles. On skip, native_language +
// the recommended target + onboarded_at are written so the
// `native_language IS NULL` Home gate cannot loop. The new
// native_language / target_languages columns are user-writable by the
// `authenticated` role (verified in PR 1: not among the #578 frozen
// columns).
//
// Telemetry: each step transition emits a console.log line prefixed
// [onboarding-telemetry] (no event_log table in this schema yet).
//
// Tone discipline: VI primary, EN secondary in lighter weight. No
// shame language. Mercy's voice — encouraging, like a kind teacher.

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import { pickFirstLesson } from "@/lib/onboarding/firstLesson";
import {
  GOAL_OPTIONS,
  LEVEL_OPTIONS,
  NATIVE_OPTIONS,
  ONBOARDING_COPY,
  ONBOARDING_STEPS,
  PROFESSION_OPTIONS,
  RECOMMENDED_TARGET,
  TARGET_MENU,
  TARGET_META,
  targetBadge,
  type NativeLang,
  type OnboardingDraft,
  type OnboardingGoal,
  type OnboardingLevel,
  type OnboardingProfession,
  type OnboardingStepId,
  type TargetLang,
} from "@/lib/onboarding/types";

const TELEMETRY_PREFIX = "[onboarding-telemetry]";

function logTelemetry(
  event: string,
  payload: Record<string, unknown>,
): void {
  try {
    // eslint-disable-next-line no-console
    console.log(TELEMETRY_PREFIX, event, payload);
  } catch {
    // ignore — telemetry must never block UX
  }
}

/** Primary target = first element of the ordered target list (set by
 *  the start_with step, or the single target when only one chosen). */
function primaryTargetOf(draft: OnboardingDraft): TargetLang | null {
  return draft.target_languages[0] ?? null;
}

/** After the primary target is known: English routes through the
 *  existing goal-capture chain (preserves the (vi,en) experience —
 *  locked #14); any other language goes straight to confirmation and
 *  then into its /languages track. */
function afterPrimaryStep(draft: OnboardingDraft): OnboardingStepId {
  return primaryTargetOf(draft) === "en" ? "goal" : "confirmation";
}

/**
 * Step navigation. Conditional skips (start_with only for multi-target;
 * goal/profession/level only for an English primary) live here so the
 * component stays a flat finite state machine.
 */
function nextStep(
  current: OnboardingStepId,
  draft: OnboardingDraft,
): OnboardingStepId {
  switch (current) {
    case "welcome":
      return "native";
    case "native":
      return "target";
    case "target":
      return draft.target_languages.length > 1
        ? "start_with"
        : afterPrimaryStep(draft);
    case "start_with":
      return afterPrimaryStep(draft);
    case "goal":
      return draft.primary_goal === "career" ? "profession" : "level";
    case "profession":
      return "level";
    case "level":
      return "confirmation";
    case "confirmation":
      return "confirmation";
  }
}

function previousStep(
  current: OnboardingStepId,
  draft: OnboardingDraft,
): OnboardingStepId {
  const multiTarget = draft.target_languages.length > 1;
  switch (current) {
    case "welcome":
      return "welcome";
    case "native":
      return "welcome";
    case "target":
      return "native";
    case "start_with":
      return "target";
    case "goal":
      return multiTarget ? "start_with" : "target";
    case "profession":
      return "goal";
    case "level":
      return draft.primary_goal === "career" ? "profession" : "goal";
    case "confirmation":
      if (primaryTargetOf(draft) === "en") return "level";
      return multiTarget ? "start_with" : "target";
  }
}

interface CardChoice<T extends string> {
  value: T;
  label: { vi: string; en: string };
  description?: { vi: string; en: string };
  icon?: string;
}

const cardBase = (isSelected: boolean): React.CSSProperties => ({
  width: "100%",
  textAlign: "left",
  borderRadius: 16,
  border: `1px solid ${isSelected ? "rgba(180,60,100,0.55)" : "rgba(0,0,0,0.10)"}`,
  background: isSelected
    ? "linear-gradient(150deg, rgba(255,240,248,0.95) 0%, rgba(255,247,250,0.95) 100%)"
    : "white",
  padding: "14px 16px",
  cursor: "pointer",
  boxShadow: isSelected
    ? "0 6px 16px rgba(180,60,100,0.10)"
    : "0 2px 6px rgba(0,0,0,0.04)",
  transition: "all 120ms ease",
});

function ChoiceGrid<T extends string>({
  choices,
  selected,
  onSelect,
  ariaLabel,
}: {
  choices: CardChoice<T>[];
  selected: T | null;
  onSelect: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 10,
        marginTop: 16,
      }}
    >
      {choices.map((c) => {
        const isSelected = selected === c.value;
        return (
          <button
            key={c.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(c.value)}
            style={cardBase(isSelected)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {c.icon ? (
                <span style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>
                  {c.icon}
                </span>
              ) : null}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "rgba(15,23,42,0.92)",
                  }}
                >
                  {c.label.vi}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(0,0,0,0.5)",
                    marginTop: 2,
                  }}
                >
                  {c.label.en}
                </div>
                {c.description ? (
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 13,
                      lineHeight: 1.45,
                      color: "rgba(0,0,0,0.66)",
                    }}
                  >
                    {c.description.vi}
                  </div>
                ) : null}
              </div>
              {isSelected ? (
                <Check size={18} color="rgba(180,60,100,0.80)" />
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/** Multi-select target grid. Honest "limited content" / "B2–C2 only
 *  for now" badges per the canonical matrix (locked #7). */
function TargetGrid({
  native,
  selected,
  onToggle,
}: {
  native: NativeLang;
  selected: TargetLang[];
  onToggle: (t: TargetLang) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Target languages"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 10,
        marginTop: 16,
      }}
    >
      {TARGET_MENU[native].map((item) => {
        const meta = TARGET_META[item.value];
        const isSelected = selected.includes(item.value);
        const badge = targetBadge(item);
        return (
          <button
            key={item.value}
            type="button"
            role="checkbox"
            aria-checked={isSelected}
            onClick={() => onToggle(item.value)}
            style={cardBase(isSelected)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>
                {meta.flag}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "rgba(15,23,42,0.92)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  {meta.labelVi}
                  {item.recommended ? (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "rgba(13,148,136,0.95)",
                        background: "rgba(20,184,166,0.12)",
                        borderRadius: 999,
                        padding: "2px 8px",
                      }}
                    >
                      Gợi ý · Recommended
                    </span>
                  ) : null}
                  {badge ? (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "rgba(180,83,9,0.95)",
                        background: "rgba(217,119,6,0.12)",
                        borderRadius: 999,
                        padding: "2px 8px",
                      }}
                    >
                      {badge.vi} · {badge.en}
                    </span>
                  ) : null}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(0,0,0,0.5)",
                    marginTop: 2,
                  }}
                >
                  {meta.labelEn}
                </div>
              </div>
              {isSelected ? (
                <Check size={18} color="rgba(180,60,100,0.80)" />
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function StepHeader({
  vi,
  en,
  bodyVi,
  bodyEn,
}: {
  vi: string;
  en: string;
  bodyVi?: string;
  bodyEn?: string;
}) {
  return (
    <header style={{ marginBottom: 6 }}>
      <h1
        style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 900,
          letterSpacing: -0.4,
          color: "rgba(15,23,42,0.94)",
          lineHeight: 1.2,
        }}
      >
        {vi}
      </h1>
      <p
        style={{
          margin: "2px 0 0",
          fontSize: 13,
          fontWeight: 600,
          color: "rgba(0,0,0,0.55)",
        }}
      >
        {en}
      </p>
      {bodyVi ? (
        <p
          style={{
            margin: "10px 0 0",
            fontSize: 14,
            lineHeight: 1.55,
            color: "rgba(0,0,0,0.74)",
          }}
        >
          {bodyVi}
        </p>
      ) : null}
      {bodyEn ? (
        <p
          style={{
            margin: "2px 0 0",
            fontSize: 12,
            lineHeight: 1.5,
            color: "rgba(0,0,0,0.45)",
          }}
        >
          {bodyEn}
        </p>
      ) : null}
    </header>
  );
}

const primaryButtonStyle = (disabled: boolean): React.CSSProperties => ({
  marginTop: 22,
  width: "100%",
  padding: "12px 18px",
  borderRadius: 9999,
  border: "none",
  background: disabled
    ? "rgba(0,0,0,0.10)"
    : "linear-gradient(135deg, #B45309 0%, #D97706 50%, #14B8A6 100%)",
  color: "white",
  fontSize: 15,
  fontWeight: 800,
  cursor: disabled ? "not-allowed" : "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
});

export default function OnboardingPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<OnboardingStepId>("welcome");
  const [stepStartedAt, setStepStartedAt] = useState<number>(() => Date.now());
  const [draft, setDraft] = useState<OnboardingDraft>({
    native_language: null,
    target_languages: [],
    primary_goal: null,
    profession: null,
    english_level: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset the per-step timer whenever the step changes — the
  // telemetry payload reports time-on-step.
  useEffect(() => {
    setStepStartedAt(Date.now());
  }, [step]);

  const currentIndex = ONBOARDING_STEPS.indexOf(step);
  const isLastStep = step === "confirmation";
  const isFirstStep = step === "welcome";

  const advance = (overrideDraft?: OnboardingDraft) => {
    const effectiveDraft = overrideDraft ?? draft;
    const next = nextStep(step, effectiveDraft);
    if (next !== step) {
      logTelemetry("onboarding_step_complete", {
        step,
        next,
        time_seconds: Math.round((Date.now() - stepStartedAt) / 1000),
      });
      setStep(next);
    }
  };

  const goBack = () => {
    const prev = previousStep(step, draft);
    if (prev !== step) setStep(prev);
  };

  const handleNativeSelect = (native: NativeLang) => {
    // Native drives the target menu, so changing it resets targets and
    // pre-checks that native's recommended target (the 95% path needs
    // only a Continue tap).
    const updated: OnboardingDraft = {
      ...draft,
      native_language: native,
      target_languages: [RECOMMENDED_TARGET[native]],
    };
    setDraft(updated);
    advance(updated);
  };

  const handleTargetToggle = (t: TargetLang) => {
    setDraft((d) => {
      const has = d.target_languages.includes(t);
      return {
        ...d,
        target_languages: has
          ? d.target_languages.filter((x) => x !== t)
          : [...d.target_languages, t],
      };
    });
  };

  const handleTargetContinue = () => {
    if (draft.target_languages.length === 0) return;
    advance();
  };

  const handleStartWithSelect = (t: TargetLang) => {
    // Move the chosen language to index 0 (primary); keep the rest in
    // their existing relative order.
    const reordered: TargetLang[] = [
      t,
      ...draft.target_languages.filter((x) => x !== t),
    ];
    const updated: OnboardingDraft = {
      ...draft,
      target_languages: reordered,
    };
    setDraft(updated);
    advance(updated);
  };

  const handleGoalSelect = (goal: OnboardingGoal) => {
    const updated: OnboardingDraft = {
      ...draft,
      primary_goal: goal,
      profession: goal === "career" ? draft.profession : null,
    };
    setDraft(updated);
    advance(updated);
  };

  const handleProfessionSelect = (profession: OnboardingProfession) => {
    const updated: OnboardingDraft = { ...draft, profession };
    setDraft(updated);
    advance(updated);
  };

  const handleLevelSelect = (level: OnboardingLevel) => {
    const updated: OnboardingDraft = { ...draft, english_level: level };
    setDraft(updated);
    advance(updated);
  };

  /** Route + reason for a finished/skipped flow. English primary →
   *  existing goal-based routing (unchanged (vi,en) experience). Any
   *  other primary → its /languages track. */
  function resolveDestination(d: OnboardingDraft): {
    route: string;
    reason: string;
  } {
    const primary = primaryTargetOf(d);
    if (primary && primary !== "en") {
      const slug = TARGET_META[primary].slug;
      return {
        route: slug ? `/languages/${slug}` : "/",
        reason: "language_track",
      };
    }
    const fl = pickFirstLesson({
      goal: d.primary_goal,
      profession: d.profession,
      level: d.english_level,
    });
    return { route: fl.route, reason: fl.reason };
  }

  /**
   * Persist the pair (+ English-only fields when relevant) and
   * navigate. On Supabase failure we still navigate — the user must
   * never be trapped in onboarding by a network blip.
   */
  const handleFinish = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const dest = resolveDestination(draft);
    const primary = primaryTargetOf(draft);
    try {
      if (user?.id) {
        const payload: Record<string, unknown> = {
          onboarded_at: new Date().toISOString(),
          native_language: draft.native_language,
          target_languages: draft.target_languages,
        };
        // English-specific intent only makes sense for an English
        // primary target — leave the columns NULL otherwise.
        if (primary === "en") {
          payload.primary_goal = draft.primary_goal;
          payload.profession = draft.profession;
          payload.english_level = draft.english_level;
        }
        const { error: updateError } = await supabase
          .from("profiles")
          .update(payload)
          .eq("id", user.id);
        if (updateError) {
          console.warn(
            "[onboarding] profiles update failed; navigating anyway:",
            updateError.message,
          );
        }
      }
      logTelemetry("onboarding_complete", {
        native_language: draft.native_language,
        target_languages: draft.target_languages,
        primary_target: primary,
        goal: draft.primary_goal,
        profession: draft.profession,
        level: draft.english_level,
        first_route: dest.route,
        first_reason: dest.reason,
      });
      nav(dest.route, { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown_error";
      console.warn("[onboarding] finish threw; navigating anyway:", msg);
      setError(msg);
      nav(dest.route, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Skip flow: write native_language + the recommended target +
   * onboarded_at. Writing native_language is REQUIRED — the Home gate
   * fires on `native_language IS NULL`, so a skip that left it NULL
   * would loop the user straight back into onboarding. Defaults to the
   * already-chosen native (or 'vi') and that native's recommended
   * target (Phase 3 step 3).
   */
  const handleSkip = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const native: NativeLang = draft.native_language ?? "vi";
    const target = RECOMMENDED_TARGET[native];
    const skipDraft: OnboardingDraft = {
      ...draft,
      native_language: native,
      target_languages: [target],
    };
    const dest = resolveDestination(skipDraft);
    try {
      if (user?.id) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            onboarded_at: new Date().toISOString(),
            native_language: native,
            target_languages: [target],
          })
          .eq("id", user.id);
        if (updateError) {
          console.warn(
            "[onboarding] skip update failed; navigating anyway:",
            updateError.message,
          );
        }
      }
      logTelemetry("onboarding_skipped", {
        from_step: step,
        native_language: native,
        target_languages: [target],
      });
      nav(dest.route, { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown_error";
      console.warn("[onboarding] skip threw; navigating anyway:", msg);
      setError(msg);
      nav(dest.route, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Layout ────────────────────────────────────────────────────────

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(255,240,248,0.55) 0%, rgba(252,249,243,0.96) 40%, rgba(248,247,250,1) 100%)",
        padding: "20px 16px 80px",
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {/* Top bar: Back + Skip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          {!isFirstStep ? (
            <button
              type="button"
              onClick={goBack}
              aria-label="Back"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(0,0,0,0.55)",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              <ChevronLeft size={16} />
              {ONBOARDING_COPY.back.vi}
              <span style={{ fontWeight: 500, marginLeft: 4, color: "rgba(0,0,0,0.40)" }}>
                · {ONBOARDING_COPY.back.en}
              </span>
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={handleSkip}
            aria-label="Skip onboarding"
            disabled={submitting}
            style={{
              background: "none",
              border: "none",
              cursor: submitting ? "wait" : "pointer",
              color: "rgba(0,0,0,0.45)",
              fontSize: 13,
              fontWeight: 600,
              opacity: submitting ? 0.5 : 1,
            }}
          >
            {ONBOARDING_COPY.skipLink.vi}
            <span style={{ fontWeight: 500, marginLeft: 4 }}>
              · {ONBOARDING_COPY.skipLink.en}
            </span>
          </button>
        </div>

        {/* Progress strip — fills as the user advances. Conditional
            steps mean the path is shorter than the strip for most
            users; this matches the pre-existing approximation. */}
        <div
          aria-label="Onboarding progress"
          aria-valuemin={0}
          aria-valuemax={ONBOARDING_STEPS.length}
          aria-valuenow={currentIndex + 1}
          role="progressbar"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${ONBOARDING_STEPS.length}, 1fr)`,
            gap: 4,
            marginBottom: 22,
          }}
        >
          {ONBOARDING_STEPS.map((s, i) => (
            <div
              key={s}
              style={{
                height: 4,
                borderRadius: 999,
                background:
                  i <= currentIndex
                    ? "linear-gradient(90deg, #B45309 0%, #D97706 50%, #14B8A6 100%)"
                    : "rgba(0,0,0,0.08)",
              }}
            />
          ))}
        </div>

        <main
          style={{
            background: "white",
            borderRadius: 24,
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 10px 32px rgba(0,0,0,0.05)",
            padding: 22,
          }}
        >
          {step === "welcome" ? (
            <>
              <StepHeader
                vi={ONBOARDING_COPY.welcome.title.vi}
                en={ONBOARDING_COPY.welcome.title.en}
                bodyVi={ONBOARDING_COPY.welcome.body.vi}
                bodyEn={ONBOARDING_COPY.welcome.body.en}
              />
              <button
                type="button"
                onClick={() => advance()}
                style={primaryButtonStyle(false)}
              >
                {ONBOARDING_COPY.welcome.cta.vi}
                <span style={{ fontWeight: 600, opacity: 0.85 }}>
                  · {ONBOARDING_COPY.welcome.cta.en}
                </span>
                <ChevronRight size={16} />
              </button>
            </>
          ) : null}

          {step === "native" ? (
            <>
              <StepHeader
                vi={ONBOARDING_COPY.native.title.vi}
                en={ONBOARDING_COPY.native.title.en}
                bodyVi={ONBOARDING_COPY.native.body.vi}
                bodyEn={ONBOARDING_COPY.native.body.en}
              />
              <ChoiceGrid
                choices={NATIVE_OPTIONS}
                selected={draft.native_language}
                onSelect={handleNativeSelect}
                ariaLabel="Native language"
              />
            </>
          ) : null}

          {step === "target" && draft.native_language ? (
            <>
              <StepHeader
                vi={ONBOARDING_COPY.target.title.vi}
                en={ONBOARDING_COPY.target.title.en}
                bodyVi={ONBOARDING_COPY.target.body.vi}
                bodyEn={ONBOARDING_COPY.target.body.en}
              />
              <TargetGrid
                native={draft.native_language}
                selected={draft.target_languages}
                onToggle={handleTargetToggle}
              />
              <button
                type="button"
                onClick={handleTargetContinue}
                disabled={draft.target_languages.length === 0}
                style={primaryButtonStyle(
                  draft.target_languages.length === 0,
                )}
              >
                {ONBOARDING_COPY.continue.vi}
                <span style={{ fontWeight: 600, opacity: 0.85 }}>
                  · {ONBOARDING_COPY.continue.en}
                </span>
                <ChevronRight size={16} />
              </button>
            </>
          ) : null}

          {step === "start_with" ? (
            <>
              <StepHeader
                vi={ONBOARDING_COPY.startWith.title.vi}
                en={ONBOARDING_COPY.startWith.title.en}
                bodyVi={ONBOARDING_COPY.startWith.body.vi}
                bodyEn={ONBOARDING_COPY.startWith.body.en}
              />
              <ChoiceGrid
                choices={draft.target_languages.map((t) => ({
                  value: t,
                  label: {
                    vi: TARGET_META[t].labelVi,
                    en: TARGET_META[t].labelEn,
                  },
                  icon: TARGET_META[t].flag,
                }))}
                selected={primaryTargetOf(draft)}
                onSelect={handleStartWithSelect}
                ariaLabel="Primary language to start with"
              />
            </>
          ) : null}

          {step === "goal" ? (
            <>
              <StepHeader
                vi={ONBOARDING_COPY.goal.title.vi}
                en={ONBOARDING_COPY.goal.title.en}
                bodyVi={ONBOARDING_COPY.goal.body.vi}
                bodyEn={ONBOARDING_COPY.goal.body.en}
              />
              <ChoiceGrid
                choices={GOAL_OPTIONS}
                selected={draft.primary_goal}
                onSelect={handleGoalSelect}
                ariaLabel="Primary learning goal"
              />
            </>
          ) : null}

          {step === "profession" ? (
            <>
              <StepHeader
                vi={ONBOARDING_COPY.profession.title.vi}
                en={ONBOARDING_COPY.profession.title.en}
                bodyVi={ONBOARDING_COPY.profession.body.vi}
                bodyEn={ONBOARDING_COPY.profession.body.en}
              />
              <ChoiceGrid
                choices={PROFESSION_OPTIONS}
                selected={draft.profession}
                onSelect={handleProfessionSelect}
                ariaLabel="Profession"
              />
            </>
          ) : null}

          {step === "level" ? (
            <>
              <StepHeader
                vi={ONBOARDING_COPY.level.title.vi}
                en={ONBOARDING_COPY.level.title.en}
                bodyVi={ONBOARDING_COPY.level.body.vi}
                bodyEn={ONBOARDING_COPY.level.body.en}
              />
              <ChoiceGrid
                choices={LEVEL_OPTIONS}
                selected={draft.english_level}
                onSelect={handleLevelSelect}
                ariaLabel="Current English level"
              />
            </>
          ) : null}

          {step === "confirmation" ? (
            <>
              <StepHeader
                vi={ONBOARDING_COPY.confirmation.title.vi}
                en={ONBOARDING_COPY.confirmation.title.en}
                bodyVi={ONBOARDING_COPY.confirmation.body.vi}
                bodyEn={ONBOARDING_COPY.confirmation.body.en}
              />
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "16px 0 0",
                  display: "grid",
                  gap: 8,
                }}
              >
                {draft.native_language ? (
                  <li
                    style={{
                      padding: "10px 12px",
                      borderRadius: 12,
                      background: "rgba(20,184,166,0.08)",
                      fontSize: 13,
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>Tiếng mẹ đẻ · Native:</strong>{" "}
                    {
                      NATIVE_OPTIONS.find(
                        (n) => n.value === draft.native_language,
                      )?.label.vi
                    }
                  </li>
                ) : null}
                {draft.target_languages.length > 0 ? (
                  <li
                    style={{
                      padding: "10px 12px",
                      borderRadius: 12,
                      background: "rgba(20,184,166,0.08)",
                      fontSize: 13,
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>Học · Learning:</strong>{" "}
                    {draft.target_languages
                      .map((t, i) =>
                        i === 0
                          ? `${TARGET_META[t].labelVi} ⭐`
                          : TARGET_META[t].labelVi,
                      )
                      .join(" · ")}
                  </li>
                ) : null}
                {draft.primary_goal ? (
                  <li
                    style={{
                      padding: "10px 12px",
                      borderRadius: 12,
                      background: "rgba(20,184,166,0.08)",
                      fontSize: 13,
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>Mục tiêu · Goal:</strong>{" "}
                    {GOAL_OPTIONS.find((g) => g.value === draft.primary_goal)?.label.vi}
                  </li>
                ) : null}
                {draft.profession ? (
                  <li
                    style={{
                      padding: "10px 12px",
                      borderRadius: 12,
                      background: "rgba(20,184,166,0.08)",
                      fontSize: 13,
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>Nghề nghiệp · Profession:</strong>{" "}
                    {PROFESSION_OPTIONS.find((p) => p.value === draft.profession)?.label.vi}
                  </li>
                ) : null}
                {draft.english_level ? (
                  <li
                    style={{
                      padding: "10px 12px",
                      borderRadius: 12,
                      background: "rgba(20,184,166,0.08)",
                      fontSize: 13,
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>Trình độ · Level:</strong>{" "}
                    {LEVEL_OPTIONS.find((l) => l.value === draft.english_level)?.label.vi}
                  </li>
                ) : null}
              </ul>
              <button
                type="button"
                onClick={handleFinish}
                disabled={submitting}
                style={primaryButtonStyle(submitting)}
              >
                {ONBOARDING_COPY.finish.vi}{" "}
                <span style={{ fontWeight: 600, opacity: 0.85 }}>
                  · {ONBOARDING_COPY.finish.en}
                </span>
              </button>
              {error ? (
                <p
                  role="alert"
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    color: "rgba(180,30,30,0.85)",
                  }}
                >
                  Đã xảy ra lỗi nhỏ — Mercy vẫn đưa bạn đến bài học. ({error})
                </p>
              ) : null}
            </>
          ) : null}

          {!isLastStep ? null : null}
        </main>
      </div>
    </div>
  );
}
