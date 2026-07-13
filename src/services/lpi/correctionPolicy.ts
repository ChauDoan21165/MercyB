export type PolicySeverity = "meaning_blocking" | "target_form" | "form" | "fluency" | "minor";

export type PolicyInput = {
  detectorTag: string | null;
  severity: PolicySeverity;
  recurrenceCount: number;
  sessionErrorDensity: number;
  consecutiveErrors: number;
  correctionsThisBurst: number;
};

export type PolicyDecision = {
  action: "correct_now" | "defer_to_recap" | "log_silently";
  reason: string;
};

export type LpiPolicyMode = "off" | "shadow" | "active";

export const LPI_TARGET_FORM_DETECTOR_TAGS = new Set<string>([
  "vi_l1_3rd_person_s",
  "vi_l1_past_ed",
  "vi_l1_plural_s",
  "vi_l1_missing_be",
  "vi_l1_question_no_aux",
  "vi_l1_double_negative",
  "vi_l1_missing_article",
  "vi_l1_a_vs_an_vowel",
  "vi_l1_geographical_article",
  "vi_l1_no_article_generic",
  "vi_l1_superlative_the",
  "vi_l1_generic_plural",
  "vi_l1_preposition_transfer",
  "vi_l1_time_expressions",
  "vi_l1_by_vs_with",
  "vi_l1_possessive_gender",
  "vi_l1_there_are_singular",
  "en-vn-past-marker-regular-verb",
  "en-vn-numeral-quantifier-plural",
  "en-vn-although-even-though-but",
  "en-vn-because-so-doubling",
  "en-vn-copula-be-adjective",
  "en-vn-yesno-do-support",
]);

export function isLpiTargetFormDetectorTag(detectorTag: string | null | undefined): boolean {
  return Boolean(detectorTag && LPI_TARGET_FORM_DETECTOR_TAGS.has(detectorTag));
}

export const BURST_CONSECUTIVE_ERROR_THRESHOLD = 4;
export const LOW_SEVERITY_RECAP_RECURRENCE_THRESHOLD = 3;
export const FORM_CORRECT_RECURRENCE_THRESHOLD = 3;
export const FORM_DEFER_RECURRENCE_THRESHOLD = 2;
export const HIGH_ERROR_DENSITY_THRESHOLD = 0.6;

export function decideCorrection(input: PolicyInput): PolicyDecision {
  const inConsecutiveErrorBurst = input.consecutiveErrors >= BURST_CONSECUTIVE_ERROR_THRESHOLD;
  const inHighDensityMoment = input.sessionErrorDensity > HIGH_ERROR_DENSITY_THRESHOLD;
  const isLowAffectiveValue = input.severity === "fluency" || input.severity === "minor";
  const isFormWork = input.severity === "target_form" || input.severity === "form";

  // Lyster-Ranta 1997: when meaning is blocked, repair is communicative work,
  // not optional grammar polishing. This overrides density, burst, and repeat caps.
  if (input.severity === "meaning_blocking") {
    return { action: "correct_now", reason: "meaning_blocking_repair" };
  }

  // Affective-filter / overcorrection heuristic: in a clear error burst,
  // preserve participation. Keep target/form work for recap; keep fluency and
  // mechanics noise silent.
  if (inConsecutiveErrorBurst) {
    return isLowAffectiveValue
      ? { action: "log_silently", reason: "burst_low_severity_silent" }
      : { action: "defer_to_recap", reason: "burst_form_defer" };
  }

  // Truscott/Ferris WCF debate + affective-filter heuristic: do not interrupt
  // for first or low-recurrence fluency/mechanics noise; recap only once it is
  // a repeated pattern.
  if (isLowAffectiveValue) {
    return input.recurrenceCount >= LOW_SEVERITY_RECAP_RECURRENCE_THRESHOLD
      ? { action: "defer_to_recap", reason: "low_severity_repeated_pattern" }
      : { action: "log_silently", reason: "low_severity_flow_first" };
  }

  // Affective-filter heuristic: a dense session is not the moment to introduce
  // non-target form feedback. Target forms are deferred; low-recurrence generic
  // form errors are silent unless a pattern is already visible.
  if (inHighDensityMoment && isFormWork) {
    if (input.severity === "target_form") {
      return input.recurrenceCount === 0
        ? { action: "correct_now", reason: "target_first_occurrence" }
        : { action: "defer_to_recap", reason: "density_target_defer" };
    }

    return input.recurrenceCount >= FORM_DEFER_RECURRENCE_THRESHOLD
      ? { action: "defer_to_recap", reason: "density_form_pattern_defer" }
      : { action: "log_silently", reason: "density_form_low_recurrence_silent" };
  }

  // Ellis-Loewen-Erlam 2006: lesson-targeted forms can be corrected explicitly
  // when the learner is not in overload.
  if (input.severity === "target_form") {
    return { action: "correct_now", reason: "target_form_teach_now" };
  }

  // Ammar-Spada 2006: feedback should fit learner need. Generic form slips are
  // deferred at first, but persistent calm-session patterns deserve correction.
  if (input.severity === "form") {
    return input.recurrenceCount >= FORM_CORRECT_RECURRENCE_THRESHOLD
      ? { action: "correct_now", reason: "persistent_form_calm_correct" }
      : { action: "defer_to_recap", reason: "form_first_or_low_recurrence_defer" };
  }

  return { action: "log_silently", reason: "default_silent" };
}

export function resolveLpiPolicyMode(rawMode: string | null | undefined): LpiPolicyMode {
  if (rawMode === "shadow" || rawMode === "active") return rawMode;
  return "off";
}

export function applyCorrectionPolicyDecision(
  mode: LpiPolicyMode,
  decision: PolicyDecision,
): { shouldRenderCorrection: boolean; shouldQueueRecap: boolean; shouldLogSilently: boolean } {
  if (mode !== "active") {
    return {
      shouldRenderCorrection: true,
      shouldQueueRecap: false,
      shouldLogSilently: false,
    };
  }

  return {
    shouldRenderCorrection: decision.action === "correct_now",
    shouldQueueRecap: decision.action === "defer_to_recap",
    shouldLogSilently: decision.action === "log_silently",
  };
}
