// src/pages/onboarding/OnboardingPage.tsx
//
// 60-second goal-capture onboarding at /onboarding.
//
// Five steps in display order:
//   1. welcome      — friendly intro from Mercy, "Bắt đầu" CTA
//   2. goal         — pick a primary goal (career / ielts / vstep /
//                     toeic / travel / general)
//   3. profession   — only when goal === "career"; otherwise skipped
//   4. level        — beginner / elementary / intermediate / advanced
//   5. confirmation — summary + "Hoàn tất" → persist + navigate
//
// Persistence: on confirmation, the four chosen fields plus
// onboarded_at are written in one update to public.profiles. The
// auth session must exist; the page is wrapped in RequireAuth at
// the router level. On skip, only onboarded_at is written.
//
// Telemetry: each step transition emits a console.log line with a
// structured payload prefixed [onboarding-telemetry]. The original
// spec asked for an event_log table, but that table does not exist
// in this schema today; emitting to console keeps the rest of the
// flow shippable and lets a future analytics PR pick the events up.
//
// Tone discipline: VI primary, EN secondary in lighter weight. No
// shame language. Mercy's voice — encouraging, like a kind teacher.

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import { pickFirstLesson } from "@/lib/onboarding/firstLesson";
import {
  GOAL_OPTIONS,
  LEVEL_OPTIONS,
  ONBOARDING_COPY,
  ONBOARDING_STEPS,
  PROFESSION_OPTIONS,
  type OnboardingDraft,
  type OnboardingGoal,
  type OnboardingLevel,
  type OnboardingProfession,
  type OnboardingStepId,
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

/**
 * Step navigation logic. Conditional skip of the profession step
 * happens here so the rest of the component stays a flat finite
 * state machine. Returns the next step id given the current step
 * and the current draft.
 */
function nextStep(
  current: OnboardingStepId,
  draft: OnboardingDraft,
): OnboardingStepId {
  switch (current) {
    case "welcome":
      return "goal";
    case "goal":
      // Career path branches to profession; everything else jumps to level.
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
  switch (current) {
    case "welcome":
      return "welcome";
    case "goal":
      return "welcome";
    case "profession":
      return "goal";
    case "level":
      return draft.primary_goal === "career" ? "profession" : "goal";
    case "confirmation":
      return "level";
  }
}

interface CardChoice<T extends string> {
  value: T;
  label: { vi: string; en: string };
  description?: { vi: string; en: string };
  icon?: string;
}

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
            style={{
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
            }}
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

export default function OnboardingPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<OnboardingStepId>("welcome");
  const [stepStartedAt, setStepStartedAt] = useState<number>(() => Date.now());
  const [draft, setDraft] = useState<OnboardingDraft>({
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

  const firstLesson = useMemo(
    () =>
      pickFirstLesson({
        goal: draft.primary_goal,
        profession: draft.profession,
        level: draft.english_level,
      }),
    [draft],
  );

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

  const handleGoalSelect = (goal: OnboardingGoal) => {
    const updated: OnboardingDraft = {
      ...draft,
      primary_goal: goal,
      // Clear profession if the user changed away from career.
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

  /**
   * Persist the full draft + onboarded_at and navigate to the picked
   * first-lesson route. On Supabase failure we still navigate — the
   * user shouldn't be trapped in onboarding because of a network blip.
   */
  const handleFinish = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      if (user?.id) {
        const payload = {
          onboarded_at: new Date().toISOString(),
          primary_goal: draft.primary_goal,
          profession: draft.profession,
          english_level: draft.english_level,
        };
        const { error: updateError } = await supabase
          .from("profiles")
          .update(payload)
          .eq("id", user.id);
        if (updateError) {
          console.warn(
            "[onboarding] profiles update failed; navigating anyway:",
            updateError.message,
          );
          // Don't block — telemetry below; we still navigate.
        }
      }
      logTelemetry("onboarding_complete", {
        goal: draft.primary_goal,
        profession: draft.profession,
        level: draft.english_level,
        first_lesson_route: firstLesson.route,
        first_lesson_reason: firstLesson.reason,
      });
      nav(firstLesson.route, { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown_error";
      console.warn("[onboarding] finish threw; navigating anyway:", msg);
      setError(msg);
      nav(firstLesson.route, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Skip flow: write only onboarded_at = NOW so the gate stops
   * redirecting the user. Goal/profession/level stay NULL. Navigate
   * to / (Home) — the picker for missing inputs lands there anyway.
   */
  const handleSkip = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      if (user?.id) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ onboarded_at: new Date().toISOString() })
          .eq("id", user.id);
        if (updateError) {
          console.warn(
            "[onboarding] skip update failed; navigating anyway:",
            updateError.message,
          );
        }
      }
      logTelemetry("onboarding_skipped", { from_step: step });
      nav("/", { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown_error";
      console.warn("[onboarding] skip threw; navigating anyway:", msg);
      setError(msg);
      nav("/", { replace: true });
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

        {/* Progress strip — five segments, fills as the user advances. */}
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
                style={{
                  marginTop: 22,
                  width: "100%",
                  padding: "12px 18px",
                  borderRadius: 9999,
                  border: "none",
                  background:
                    "linear-gradient(135deg, #B45309 0%, #D97706 50%, #14B8A6 100%)",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                {ONBOARDING_COPY.welcome.cta.vi}
                <span style={{ fontWeight: 600, opacity: 0.85 }}>
                  · {ONBOARDING_COPY.welcome.cta.en}
                </span>
                <ChevronRight size={16} />
              </button>
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
                style={{
                  marginTop: 22,
                  width: "100%",
                  padding: "12px 18px",
                  borderRadius: 9999,
                  border: "none",
                  background: submitting
                    ? "rgba(0,0,0,0.10)"
                    : "linear-gradient(135deg, #B45309 0%, #D97706 50%, #14B8A6 100%)",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: submitting ? "wait" : "pointer",
                }}
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
