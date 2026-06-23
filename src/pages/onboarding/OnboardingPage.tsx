
function nativeCopyLang(lang: "vi" | "en" | "ja"): "vi" | "en" {
  return lang === "vi" ? "vi" : "en";
}

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
// ── Flow documentation ───────────────────────────────────────────────
// Duolingo-style pair-selection onboarding. A flat 3-step FSM:
//
//   1. native     — pick native language (vi | en). Mercy's one-line
//                   greeting is inlined into this step's header (the
//                   old standalone `welcome` interstitial was a
//                   guaranteed dead click — A32 audit — removed).
//   2. target     — multi-select target language(s), filtered by the
//                   canonical content-readiness matrix for the chosen
//                   native. A single-target Continue FINISHES here.
//   3. start_with — only when >1 target chosen — pick the primary (the
//                   one Mercy opens first). The pick FINISHES directly.
//
// There is no longer a `confirmation` echo screen — it read back
// nothing the survey didn't already imply (post-#598 the survey
// collects only the pair) and was the second guaranteed dead click
// (A32 audit). Finish happens straight off the last pick.
//
// ── ?direction=vn (en→vi) entry contract ─────────────────────────────
// The bilingual marketing landing (PR #675) has two CTAs:
//   • "Tôi học ngoại ngữ"        → /onboarding              (default)
//   • "I'm learning Vietnamese"  → /onboarding?direction=vn
// `direction=vn` means an English speaker who wants to LEARN
// Vietnamese. We honour it by SEEDING the draft { native_language:
// "en", target_languages: ["vi"] } and entering at `target` (native is
// already implied by the CTA — re-asking would be a dead click). Chrome
// then follows native_language → English-primary UI for the survey.
// Skip preserves this seed, so a direction=vn visitor can never be
// silently enrolled as the INVERSE (vi-native learning English) — the
// exact trap A32 found. Absent / `direction=vi` ⇒ unchanged vi-first
// default (the ~95% home market): start at `native`, nothing seeded.
//
// The goal/profession/level steps were removed as unreachable dead UI
// (pair-pick lands on home since #598). The profiles columns they used
// (primary_goal / profession / english_level) are KEPT — still written
// (NULL on this flow) and read by MercyGuide / DailyCoach; those
// columns are privilege-frozen per #578.
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
// Telemetry: funnel events (onboarding_started / onboarding_step_complete /
// onboarding_complete / onboarding_skipped) fan out to GA4 + Clarity via
// the shared trackEvent dispatcher in src/lib/analytics.ts.
//
// Tone discipline: VI primary, EN secondary in lighter weight. No
// shame language. Mercy's voice — encouraging, like a kind teacher.

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

import { Bilingual } from "@/components/Bilingual";

import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import { qk } from "@/lib/queries/keys";
import { writeAnonymousPair } from "@/lib/languagePair/anonymousPair";
import { trackEvent, type AnalyticsEventName } from "@/lib/analytics";
import { announce } from "@/lib/a11y/announcements";
// Onboarding no longer routes to a goal-derived first lesson — it lands
// on "/" (home) so goal selection cannot gate first entry. The old
// firstLesson.ts helper + the goal/profession/level picker UI were
// removed as dead code; the primary_goal/profession/english_level
// profiles columns are kept (live: MercyGuide / DailyCoach read them).
import {
  NATIVE_OPTIONS,
  ONBOARDING_COPY,
  ONBOARDING_STEPS,
  RECOMMENDED_TARGET,
  TARGET_MENU,
  TARGET_META,
  targetBadge,
  targetLabel,
  type NativeLang,
  type OnboardingDraft,
  type OnboardingStepId,
  type TargetLang,
} from "@/lib/onboarding/types";
import { pickChrome, type ChromeSlots } from "@/lib/i18n/chromeLanguage";

const TELEMETRY_PREFIX = "[onboarding-telemetry]";

// Onboarding funnel telemetry. Dev: human-readable console line (as
// before, for local debugging). All envs: fan out to the shared
// analytics dispatcher, which routes to GA4 (window.gtag) + Microsoft
// Clarity (window.clarity) + dataLayer/plausible. trackEvent no-ops
// when a provider global is absent (dev / pre-consent), so this is
// safe to call unconditionally and never blocks UX.
function logTelemetry(
  event: `onboarding_${string}`,
  payload: Record<string, unknown>,
): void {
  try {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(TELEMETRY_PREFIX, event, payload);
    }
    // `onboarding_${string}` is a member of the AnalyticsEventName
    // union; pass through with no cast.
    const eventName: AnalyticsEventName = event;
    trackEvent(eventName, payload);
  } catch {
    // ignore — telemetry must never block UX
  }
}

/** Primary target = first element of the ordered target list (set by
 *  the start_with step, or the single target when only one chosen). */
function primaryTargetOf(draft: OnboardingDraft): TargetLang | null {
  return draft.target_languages[0] ?? null;
}

/**
 * Forward step navigation for the flat 3-step FSM. Only governs the
 * `native → target → start_with` transitions; FINISH is an action, not
 * a step (handleTargetContinue / handleStartWithSelect call
 * handleFinish directly — there is no `confirmation` screen, A32
 * audit). `target → start_with` is reached only for >1 target; a
 * single-target Continue finishes off `target`, so this is never
 * called for the single-target path.
 */
function nextStep(
  current: OnboardingStepId,
  draft: OnboardingDraft,
): OnboardingStepId {
  switch (current) {
    case "native":
      return "target";
    case "target":
      return draft.target_languages.length > 1 ? "start_with" : "target";
    case "start_with":
      return "start_with"; // terminal — the tap finishes directly
  }
}

function previousStep(current: OnboardingStepId): OnboardingStepId {
  switch (current) {
    case "native":
      return "native";
    case "target":
      // For a direction=vn entrant this lets them fall back to the
      // native picker if they really want vi-native — a real escape
      // hatch, not a dead click (Back is hidden on the ENTRY step).
      return "native";
    case "start_with":
      return "target";
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
            aria-label={`${pickChrome(c.label, lang)}${isSelected ? " — đang chọn · selected" : ""}`}
            onClick={() => onSelect(c.value)}
            className="mb-a11y-card-button"
            style={cardBase(isSelected)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {c.icon ? (
                <span aria-hidden style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>
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
      {TARGET_MENU[nativeCopyLang(native)].map((item) => {
        const meta = TARGET_META[item.value];
        const isSelected = selected.includes(item.value);
        const badge = targetBadge(item);
        return (
          <button
            key={item.value}
            type="button"
            role="checkbox"
            aria-checked={isSelected}
            aria-label={`${targetLabel(item.value, lang)}${isSelected ? " — đang chọn · selected" : ""}`}
            onClick={() => onToggle(item.value)}
            className="mb-a11y-card-button"
            style={cardBase(isSelected)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span aria-hidden style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>
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
  headingRef,
}: {
  title: ChromeSlots;
  body?: ChromeSlots;
  lang?: NativeLang;
  /**
   * Optional ref attached to the rendered `<h1>`. The parent uses it
   * to programmatically `.focus()` the heading on step transition so a
   * keyboard / SR user lands on the new content instead of `<body>`
   * (WCAG 2.4.3). `tabIndex={-1}` makes the heading focusable without
   * entering the regular tab order.
   */
  headingRef?: React.Ref<HTMLHeadingElement>;
}) {
  if (lang) {
    return (
      <header style={{ marginBottom: 6 }}>
        <h1 ref={headingRef} tabIndex={-1} style={stepTitleStyle}>{pickChrome(title, lang)}</h1>
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
  // not chosen yet, so both audiences are present: the two languages
  // render as PEERS — identical type (size, weight, colour, line-height)
  // separated by a hairline divider, VI on top. NOT headline +
  // translation: an English visitor must not perceive "a Vietnamese app
  // with an English subtitle" and leave (locked #14).
  const peerBodyStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.55,
    color: "rgba(0,0,0,0.74)",
    margin: 0,
  };
  // Explicit hairline separator between the two languages. Equal type +
  // a divider makes them read as PEERS (two language sections), not as
  // headline + caption (Chau's spec: "stacked with a visual separator").
  const PeerDivider = () => (
    <div
      aria-hidden
      style={{
        height: 1,
        background: "rgba(0,0,0,0.10)",
        borderRadius: 1,
        margin: "10px 0",
      }}
    />
  );
  return (
    <header style={{ marginBottom: 6 }}>
      {/* VI is the semantic <h1>; EN is a visually-IDENTICAL sibling
          (same stepTitleStyle: size, weight, colour, line-height) with a
          divider between them — peers, not heading + translation. Kept
          as separate, non-nested elements so each language is its own
          text node for queries/SR.
          `lang` attrs per a11y audit O2: without them a VI screen-reader
          voice phoneticises the EN sibling using Vietnamese phonemes
          (and vice-versa), making both unintelligible to learners.
          Post-!115 + this MR's primaryRef/tabIndex/separator extensions
          to <Bilingual>: replaces the inline <h1 lang=vi ref tabIndex>
          + <PeerDivider/> + <div lang=en> trio with the wrapper. The
          headingRef + tabIndex={-1} stay on the VI side (the primary)
          per the wrapper's primary-side-only semantics; <PeerDivider/>
          travels in via `separator`. */}
      <Bilingual
        viAs="h1"
        enAs="div"
        vi={title.vi}
        en={title.en}
        viStyle={stepTitleStyle}
        enStyle={stepTitleStyle}
        primaryRef={headingRef}
        tabIndex={-1}
        separator={<PeerDivider />}
      />
      {body ? (
        <Bilingual
          vi={body.vi}
          en={body.en}
          viStyle={{ ...peerBodyStyle, marginTop: 16 }}
          enStyle={peerBodyStyle}
          separator={<PeerDivider />}
        />
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
  const qc = useQueryClient();
  const [searchParams] = useSearchParams();

  // ── Landing → picker direction contract (PR #675) ─────────────────
  // `?direction=vn` = an English speaker who came to LEARN Vietnamese
  // ("I'm learning Vietnamese" CTA). Seed the inverse-safe pair and
  // enter at `target` (native is implied by the CTA — re-asking is a
  // dead click). Captured once: query-param identity is fixed for the
  // life of this mount, and useState/useRef initialisers run once.
  // Anything other than "vn" (incl. absent / "vi") is the unchanged
  // vi-first default — the ~95% home market.
  const directionVn = searchParams.get("direction") === "vn";

  const [step, setStep] = useState<OnboardingStepId>(
    directionVn ? "target" : "native",
  );
  // The step the user ENTERS on (never changes for this mount). Back is
  // hidden here so a direction=vn entrant can't dead-click backward
  // into a native picker they intentionally bypassed.
  const entryStepRef = useRef<OnboardingStepId>(
    directionVn ? "target" : "native",
  );
  const [stepStartedAt, setStepStartedAt] = useState<number>(() => Date.now());
  const [draft, setDraft] = useState<OnboardingDraft>(
    directionVn
      ? {
          native_language: "en",
          target_languages: ["vi"],
          primary_goal: null,
          profession: null,
          english_level: null,
        }
      : {
          native_language: null,
          target_languages: [],
          primary_goal: null,
          profession: null,
          english_level: null,
        },
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Focus management (WCAG 2.4.3) ────────────────────────────────
  // On step transition, programmatically focus the new step's <h1> so
  // a keyboard / SR user lands on the new content instead of <body>.
  // The first render (initial mount) is intentionally skipped — focus
  // moves only on transitions, not on page load, so a sighted user
  // tabbing in from the global header isn't snapped to the h1.
  // Pairs with an `announce()` to surface the heading text in the
  // shared polite live region — useful when the focus move alone
  // isn't loud enough (e.g. an SR that doesn't re-read the focused
  // element automatically).
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    const headingEl = headingRef.current;
    if (!headingEl) return;
    headingEl.focus();
    // Keep VI primary — the rendered h1's textContent is whatever
    // pickChrome / bilingual peer selected, which already honors the
    // chrome-language contract (VI for pre-pick, native-language for
    // single-language steps).
    const headingText = (headingEl.textContent ?? "").trim();
    if (headingText) announce(headingText);
  }, [step]);

  // Reset the per-step timer whenever the step changes — the
  // telemetry payload reports time-on-step.
  useEffect(() => {
    setStepStartedAt(Date.now());
  }, [step]);

  // Funnel denominator: fires once on mount so GA4 can compute
  // onboarding_started → onboarding_complete / onboarding_skipped rates.
  useEffect(() => {
    logTelemetry("onboarding_started", {
      entry_step: directionVn ? "target" : "native",
      direction: directionVn ? "vn" : "default",
    });
    // Empty dep array: run once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentIndex = ONBOARDING_STEPS.indexOf(step);
  const isEntryStep = step === entryStepRef.current;
  // The native picker BEFORE a native is chosen is the one screen where
  // both audiences are simultaneously present (locked #14): render it
  // bilingual PEER, not single-language. Once native is picked — or for
  // a direction=vn entrant (native already seeded "en") — chrome is
  // single-language and follows the native choice.
  const isPrePick = step === "native" && draft.native_language == null;

  // Chrome language follows the native choice. The pre-pick native
  // screen is bilingual (locked #14); every other screen is
  // single-language — the chosen native, or the VI home-market default
  // before any pick. Shared top-bar text uses `tc`: bilingual only on
  // the pre-pick screen, single thereafter.
  const chromeLang: NativeLang = draft.native_language ?? "vi";
  const tc = (slots: ChromeSlots): string =>
    isPrePick ? `${slots.vi} · ${slots.en}` : pickChrome(slots, chromeLang);

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
    const prev = previousStep(step);
    if (prev !== step) setStep(prev);
  };

  const handleNativeSelect = (native: NativeLang) => {
    // Native drives the target menu, so changing it resets targets and
    // pre-checks that native's recommended target (the 95% path needs
    // only a Continue tap).
    const updated: OnboardingDraft = {
      ...draft,
      native_language: native,
      target_languages: [RECOMMENDED_TARGET[nativeCopyLang(native)]],
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
    if (draft.target_languages.length === 1) {
      // Single target → no primary to pick, nothing to confirm: FINISH
      // straight off this screen (the old `confirmation` echo screen
      // was a dead click — A32 audit). Draft is already settled here
      // (toggles ran on prior renders), so no override needed.
      void handleFinish();
      return;
    }
    advance(); // >1 target → start_with to pick the primary
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
    // Picking the primary is the last action — FINISH directly (no
    // confirmation screen). Pass `updated` because the setDraft above
    // has not flushed yet (same reason `advance` took an override).
    void handleFinish(updated);
  };

  // First entry always lands on "/" (home). Home is pair-aware (PR
  // #588): it renders the chosen-pair experience for the learner's
  // (native, target). Goal-based first-lesson routing is removed from
  // onboarding so nothing gates entry to the app.
  const HOME_ROUTE = "/";

  /**
   * Persist the pair (+ English-only fields when relevant) and
   * navigate. On Supabase failure we still navigate — the user must
   * never be trapped in onboarding by a network blip.
   */
  const handleFinish = async (overrideDraft?: OnboardingDraft) => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    // The single-target Continue and the start_with tap both finish
    // directly now (no confirmation screen). start_with reorders the
    // draft and the setDraft has not flushed yet, so it passes the
    // freshly-built draft explicitly — read that, not stale state.
    const d = overrideDraft ?? draft;
    const primary = primaryTargetOf(d);
    // Persist locally FIRST — this is the anonymous source of truth and
    // must survive a Supabase blip (it also seeds the cache for a
    // signed-in user; PR 3 reconciles localStorage → profile on signup).
    if (d.native_language) {
      writeAnonymousPair(d.native_language, d.target_languages);
    }
    try {
      if (user?.id) {
        const payload: Record<string, unknown> = {
          onboarded_at: new Date().toISOString(),
          native_language: d.native_language,
          target_languages: d.target_languages,
        };
        // English-specific intent only makes sense for an English
        // primary target — leave the columns NULL otherwise.
        if (primary === "en") {
          payload.primary_goal = d.primary_goal;
          payload.profession = d.profession;
          payload.english_level = d.english_level;
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
        } else {
          // The profile row that NativeLanguageContext / AccountPage /
          // chrome read is cached under qk.profile(userId) with
          // staleTime 30s + refetchOnMount:false (queries/client.ts),
          // and that observer lives app-wide so it never remounts on
          // the nav below. Without this, the just-written
          // native_language / target_languages stay invisible until
          // the cache happens to refresh — exactly the
          // LanguagePairSettings pattern (languagePair.ts:113). Single
          // targeted key, not a broad cache wipe. Not awaited: we
          // navigate away immediately and the app-level observer picks
          // up the in-flight refetch (awaiting would block nav on a
          // round-trip; LanguagePairSettings awaits only because it
          // stays on-page).
          void qc.invalidateQueries({ queryKey: qk.profile(user.id) });
        }
      }
      logTelemetry("onboarding_complete", {
        native_language: d.native_language,
        target_languages: d.target_languages,
        primary_target: primary,
        goal: d.primary_goal,
        profession: d.profession,
        level: d.english_level,
        // Enrichment only — never removes an event (A32 §3.8: drop-off
        // is currently unmeasurable; `direction` lets a later analytics
        // sink answer "did the en→vi fix convert").
        direction: directionVn ? "vn" : "default",
        first_route: HOME_ROUTE,
        first_reason: "onboarding_complete",
      });
      nav(HOME_ROUTE, { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown_error";
      console.warn("[onboarding] finish threw; navigating anyway:", msg);
      setError(msg);
      nav(HOME_ROUTE, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Skip flow: write native_language + a target + onboarded_at.
   * Writing native_language is REQUIRED — the Home gate fires on
   * `native_language IS NULL`, so a skip that left it NULL would loop
   * the user straight back into onboarding.
   *
   * The target is the user's CURRENT draft pick if they made one, else
   * the chosen native's recommended target. This is what makes Skip
   * direction-safe: a direction=vn entrant has the draft SEEDED to
   * { native:"en", targets:["vi"] }, so Skip writes en→[vi] — never
   * the INVERSE vi→[en] (the A32 trap) and never the unrelated en→[es]
   * recommended default. No `direction` special-casing needed: the
   * seeded draft already encodes intent; this just stops Skip from
   * discarding it.
   */
  const handleSkip = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const native: NativeLang = draft.native_language ?? "vi";
    const target: TargetLang =
      draft.target_languages[0] ?? RECOMMENDED_TARGET[nativeCopyLang(native)];
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
        } else {
          // Same stale-cache reason as handleFinish — skip also writes
          // native_language / target_languages, so the same targeted
          // invalidation is required or a skipped user lands on a Home
          // still rendering the pre-skip language.
          void qc.invalidateQueries({ queryKey: qk.profile(user.id) });
        }
      }
      logTelemetry("onboarding_skipped", {
        from_step: step,
        native_language: native,
        target_languages: [target],
        direction: directionVn ? "vn" : "default",
      });
      nav(HOME_ROUTE, { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown_error";
      console.warn("[onboarding] skip threw; navigating anyway:", msg);
      setError(msg);
      nav(HOME_ROUTE, { replace: true });
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
          {!isEntryStep ? (
            <button
              type="button"
              onClick={goBack}
              aria-label="Back · Quay lại"
              className="mb-a11y-chip"
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
            aria-label="Skip onboarding · Bỏ qua phần chọn ngôn ngữ"
            disabled={submitting}
            className="mb-a11y-chip"
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
          aria-valuetext={`${currentIndex + 1} of ${ONBOARDING_STEPS.length} · Bước ${currentIndex + 1} trên ${ONBOARDING_STEPS.length}`}
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
          id="main-content"
          tabIndex={-1}
          style={{
            background: "white",
            borderRadius: 24,
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 10px 32px rgba(0,0,0,0.05)",
            padding: 22,
          }}
        >
          {/* Mercy's greeting, inlined into the ENTRY step header (the
              standalone `welcome` interstitial was a guaranteed dead
              click — A32 audit). One short warm line, no extra tap.
              Bilingual on the pre-pick native screen (locked #14);
              single-language English for a direction=vn entrant. */}
          {isEntryStep ? (
            <p
              style={{
                margin: "0 0 14px",
                fontSize: 14,
                fontWeight: 600,
                color: "rgba(0,0,0,0.62)",
              }}
            >
              {tc(ONBOARDING_COPY.greeting)}
            </p>
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
                headingRef={headingRef}
              />
              {/* Native picker: each option shown in its OWN language
                  ("Tiếng Việt" / "English") so both audiences can
                  self-identify regardless of the default chrome — the
                  universal language-picker pattern, not a chrome choice. */}
              <ChoiceGrid
                choices={NATIVE_OPTIONS.map((n) => ({
                  value: n.value,
                  icon: n.icon,
                  label: { vi: n.label[n.value] ?? n.label.en, en: n.label[n.value] ?? n.label.en },
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
                headingRef={headingRef}
              />
              <TargetGrid
                native={draft.native_language}
                selected={draft.target_languages}
                onToggle={handleTargetToggle}
                lang={chromeLang}
              />
              {/* Single target → this Continue FINISHES (no confirmation
                  screen, A32 audit). >1 target → start_with first. */}
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
              {/* Soft-fail surface: a Supabase blip on finish still
                  navigates (handleFinish), but if it sets `error`
                  before nav this is where the single-target path shows
                  it — confirmation used to own this. */}
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

          {step === "start_with" ? (
            <>
              <StepHeader
                title={ONBOARDING_COPY.startWith.title}
                body={ONBOARDING_COPY.startWith.body}
                lang={chromeLang}
                headingRef={headingRef}
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

        </main>
      </div>
    </div>
  );
}
