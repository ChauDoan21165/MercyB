// src/pages/onboarding/OnboardingPage.tsx
//
// THE ENTRY POINT for anonymous visitors at mercyblade.com (locked #14 —
// Chau-confirmed doctrine). An anonymous visitor with no stored pair is
// routed here from `/` by AppRouter's AnonymousOnboardingGate; the
// picker is the first thing they see, BEFORE signup. The earlier
// "parked / Settings-only" disposition (the #590 orphan banner) is
// reversed — #590's DEFAULT 'vi' migration must NOT be applied, as it
// would re-create the auto-default-before-pick bug this flow exists to
// fix.
//
// Auth-less by design:
//   - Anonymous → the pair is written to localStorage
//     (src/lib/languagePair/anonymousPair.ts). Returning anonymous
//     visitors skip the picker; Home renders the right surface for the
//     pair. If they sign up later, PR 3 syncs localStorage → profile.
//   - Signed-in (e.g. a logged-in user whose profile native_language is
//     still NULL, redirected here by Home's gate) → ALSO written to
//     public.profiles, exactly as before. Supabase write stays guarded
//     by `user?.id`; no user ⇒ localStorage only ("instead of
//     Supabase" for the anonymous case).
//
// ── PR 2/3 flow documentation ────────────────────────────────────────
// Duolingo-style pair-selection onboarding (PR 2 of 3).
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
import { writeAnonymousPair } from "@/lib/languagePair/anonymousPair";
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
  targetLabel,
  type NativeLang,
  type OnboardingDraft,
  type OnboardingGoal,
  type OnboardingLevel,
  type OnboardingProfession,
  type OnboardingStepId,
  type TargetLang,
} from "@/lib/onboarding/types";
import { pickChrome, type ChromeSlots } from "@/lib/i18n/chromeLanguage";

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
  lang,
}: {
  choices: CardChoice<T>[];
  selected: T | null;
  onSelect: (v: T) => void;
  ariaLabel: string;
  /** Chrome language — labels/descriptions render single, not bilingual. */
  lang: NativeLang;
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
                  {pickChrome(c.label, lang)}
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
                    {pickChrome(c.description, lang)}
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
  lang,
}: {
  native: NativeLang;
  selected: TargetLang[];
  onToggle: (t: TargetLang) => void;
  /** Chrome language — names/badges render single, not bilingual. */
  lang: NativeLang;
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
                  {targetLabel(item.value, lang)}
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
                      {pickChrome(ONBOARDING_COPY.recommended, lang)}
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
                      {pickChrome(badge, lang)}
                    </span>
                  ) : null}
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

const stepTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 22,
  fontWeight: 900,
  letterSpacing: -0.4,
  color: "rgba(15,23,42,0.94)",
  lineHeight: 1.2,
};

/**
 * Step header. `lang` set → render single-language (chrome follows the
 * learner's native choice). `lang` omitted → bilingual PEER treatment
 * (equal size + weight, VI on top, EN below in the same type); used on
 * the pre-pick screens (welcome + native picker) where the native
 * language is not chosen yet so both audiences are present (locked #14).
 */
function StepHeader({
  title,
  body,
  lang,
}: {
  title: ChromeSlots;
  body?: ChromeSlots;
  lang?: NativeLang;
}) {
  if (lang) {
    return (
      <header style={{ marginBottom: 6 }}>
        <h1 style={stepTitleStyle}>{pickChrome(title, lang)}</h1>
        {body ? (
          <p
            style={{
              margin: "10px 0 0",
              fontSize: 14,
              lineHeight: 1.55,
              color: "rgba(0,0,0,0.74)",
            }}
          >
            {pickChrome(body, lang)}
          </p>
        ) : null}
      </header>
    );
  }
  // Pre-pick screens (welcome + native picker). The native language is
  // not chosen yet, so both audiences are present and the two languages
  // render as PEERS — equal font size + equal weight, VI on top, EN
  // directly below in the same type (Option A). NOT title + translation:
  // an English visitor must not perceive "a Vietnamese app with an
  // English subtitle" and leave (locked #14).
  const peerBodyStyle: React.CSSProperties = {
    fontSize: 14,
    lineHeight: 1.55,
    color: "rgba(0,0,0,0.74)",
  };
  return (
    <header style={{ marginBottom: 6 }}>
      {/* VI is the semantic <h1>; EN is a visually-identical sibling
          (same size + weight) so the two read as peers, not heading +
          translation. Kept as separate elements (not nested) so each
          language is an independent text node for queries/SR. */}
      <h1 style={stepTitleStyle}>{title.vi}</h1>
      <div style={{ ...stepTitleStyle, marginTop: 4 }}>{title.en}</div>
      {body ? (
        <>
          <p style={{ ...peerBodyStyle, margin: "12px 0 0" }}>{body.vi}</p>
          <p style={{ ...peerBodyStyle, margin: "6px 0 0" }}>{body.en}</p>
        </>
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

  // Chrome language follows the native choice. Welcome fires before the
  // pick (bilingual, locked #14); every later screen is single-language
  // — the chosen native, or the VI home-market default on the native
  // picker itself (no choice yet). Buttons that share the top bar use
  // `tc`: bilingual on welcome, single thereafter.
  const chromeLang: NativeLang = draft.native_language ?? "vi";
  const tc = (slots: ChromeSlots): string =>
    isFirstStep ? `${slots.vi} · ${slots.en}` : pickChrome(slots, chromeLang);

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
    // Persist locally FIRST — this is the anonymous source of truth and
    // must survive a Supabase blip (it also seeds the cache for a
    // signed-in user; PR 3 reconciles localStorage → profile on signup).
    if (draft.native_language) {
      writeAnonymousPair(draft.native_language, draft.target_languages);
    }
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
    // Same as finish: persist locally so the gate can't loop an
    // anonymous visitor back into the picker (skip = a deliberate pick
    // of the recommended pair).
    writeAnonymousPair(native, [target]);
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
              {pickChrome(ONBOARDING_COPY.back, chromeLang)}
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
            {tc(ONBOARDING_COPY.skipLink)}
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
                title={ONBOARDING_COPY.welcome.title}
                body={ONBOARDING_COPY.welcome.body}
              />
              <button
                type="button"
                onClick={() => advance()}
                style={primaryButtonStyle(false)}
              >
                {tc(ONBOARDING_COPY.welcome.cta)}
                <ChevronRight size={16} />
              </button>
            </>
          ) : null}

          {step === "native" ? (
            <>
              {/* Header is bilingual like welcome: the native pick has
                  not happened yet, so both audiences are simultaneously
                  present and must read it (locked #14). Omitting `lang`
                  selects StepHeader's bilingual VI-primary/EN-secondary
                  path. */}
              <StepHeader
                title={ONBOARDING_COPY.native.title}
                body={ONBOARDING_COPY.native.body}
              />
              {/* Native picker: each option shown in its OWN language
                  ("Tiếng Việt" / "English") so both audiences can
                  self-identify regardless of the default chrome — the
                  universal language-picker pattern, not a chrome choice. */}
              <ChoiceGrid
                choices={NATIVE_OPTIONS.map((n) => ({
                  value: n.value,
                  icon: n.icon,
                  label: { vi: n.label[n.value], en: n.label[n.value] },
                }))}
                selected={draft.native_language}
                onSelect={handleNativeSelect}
                ariaLabel="Native language"
                lang={chromeLang}
              />
            </>
          ) : null}

          {step === "target" && draft.native_language ? (
            <>
              <StepHeader
                title={ONBOARDING_COPY.target.title}
                body={ONBOARDING_COPY.target.body}
                lang={chromeLang}
              />
              <TargetGrid
                native={draft.native_language}
                selected={draft.target_languages}
                onToggle={handleTargetToggle}
                lang={chromeLang}
              />
              <button
                type="button"
                onClick={handleTargetContinue}
                disabled={draft.target_languages.length === 0}
                style={primaryButtonStyle(
                  draft.target_languages.length === 0,
                )}
              >
                {pickChrome(ONBOARDING_COPY.continue, chromeLang)}
                <ChevronRight size={16} />
              </button>
            </>
          ) : null}

          {step === "start_with" ? (
            <>
              <StepHeader
                title={ONBOARDING_COPY.startWith.title}
                body={ONBOARDING_COPY.startWith.body}
                lang={chromeLang}
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
                lang={chromeLang}
              />
            </>
          ) : null}

          {step === "goal" ? (
            <>
              <StepHeader
                title={ONBOARDING_COPY.goal.title}
                body={ONBOARDING_COPY.goal.body}
                lang={chromeLang}
              />
              <ChoiceGrid
                choices={GOAL_OPTIONS}
                selected={draft.primary_goal}
                onSelect={handleGoalSelect}
                ariaLabel="Primary learning goal"
                lang={chromeLang}
              />
            </>
          ) : null}

          {step === "profession" ? (
            <>
              <StepHeader
                title={ONBOARDING_COPY.profession.title}
                body={ONBOARDING_COPY.profession.body}
                lang={chromeLang}
              />
              <ChoiceGrid
                choices={PROFESSION_OPTIONS}
                selected={draft.profession}
                onSelect={handleProfessionSelect}
                ariaLabel="Profession"
                lang={chromeLang}
              />
            </>
          ) : null}

          {step === "level" ? (
            <>
              <StepHeader
                title={ONBOARDING_COPY.level.title}
                body={ONBOARDING_COPY.level.body}
                lang={chromeLang}
              />
              <ChoiceGrid
                choices={LEVEL_OPTIONS}
                selected={draft.english_level}
                onSelect={handleLevelSelect}
                ariaLabel="Current English level"
                lang={chromeLang}
              />
            </>
          ) : null}

          {step === "confirmation" ? (
            <>
              <StepHeader
                title={ONBOARDING_COPY.confirmation.title}
                body={ONBOARDING_COPY.confirmation.body}
                lang={chromeLang}
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
                    <strong>
                      {pickChrome(ONBOARDING_COPY.summary.native, chromeLang)}:
                    </strong>{" "}
                    {(() => {
                      const opt = NATIVE_OPTIONS.find(
                        (n) => n.value === draft.native_language,
                      );
                      return opt ? pickChrome(opt.label, chromeLang) : null;
                    })()}
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
                    <strong>
                      {pickChrome(ONBOARDING_COPY.summary.learning, chromeLang)}
                      :
                    </strong>{" "}
                    {draft.target_languages
                      .map((t, i) =>
                        i === 0
                          ? `${targetLabel(t, chromeLang)} ⭐`
                          : targetLabel(t, chromeLang),
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
                    <strong>
                      {pickChrome(ONBOARDING_COPY.summary.goal, chromeLang)}:
                    </strong>{" "}
                    {(() => {
                      const g = GOAL_OPTIONS.find(
                        (x) => x.value === draft.primary_goal,
                      );
                      return g ? pickChrome(g.label, chromeLang) : null;
                    })()}
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
                    <strong>
                      {pickChrome(
                        ONBOARDING_COPY.summary.profession,
                        chromeLang,
                      )}
                      :
                    </strong>{" "}
                    {(() => {
                      const p = PROFESSION_OPTIONS.find(
                        (x) => x.value === draft.profession,
                      );
                      return p ? pickChrome(p.label, chromeLang) : null;
                    })()}
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
                    <strong>
                      {pickChrome(ONBOARDING_COPY.summary.level, chromeLang)}:
                    </strong>{" "}
                    {(() => {
                      const l = LEVEL_OPTIONS.find(
                        (x) => x.value === draft.english_level,
                      );
                      return l ? pickChrome(l.label, chromeLang) : null;
                    })()}
                  </li>
                ) : null}
              </ul>
              <button
                type="button"
                onClick={handleFinish}
                disabled={submitting}
                style={primaryButtonStyle(submitting)}
              >
                {pickChrome(ONBOARDING_COPY.finish, chromeLang)}
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
                  {pickChrome(ONBOARDING_COPY.finishError, chromeLang)} (
                  {error})
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
