// Lightweight client-side telemetry for community interview prompts.
//
// Wraps the existing analytics fan-out (gtag, plausible, dataLayer)
// without polluting the AnalyticsEventName union — interview-prompts
// events are namespaced and emitted via raw window.gtag /
// window.plausible / window.dataLayer. console.info also fires in dev
// so the events show up in the console without configuring a sink.

interface InterviewPromptEventPayload {
  [key: string]: string | number | boolean | undefined;
}

type InterviewPromptEvent =
  | "prompt_submitted"
  | "prompt_approved"
  | "prompt_voted"
  | "community_prompts_used_in_room";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function emit(
  event: InterviewPromptEvent,
  payload: InterviewPromptEventPayload,
): void {
  if (!isBrowser()) return;

  // Dev visibility — matches the [analytics] tag pattern used by
  // src/lib/analytics.ts.
  // eslint-disable-next-line no-console
  console.info("[telemetry][interview_prompts]", { event, payload });

  try {
    const w = window as unknown as {
      gtag?: (...args: unknown[]) => void;
      plausible?: (
        eventName: string,
        options?: { props?: InterviewPromptEventPayload },
      ) => void;
      dataLayer?: unknown[];
    };
    if (typeof w.gtag === "function") w.gtag("event", event, payload);
    if (typeof w.plausible === "function") {
      w.plausible(event, { props: payload });
    }
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event, ...payload });
    }
  } catch {
    // Telemetry is best-effort — silent failure is the right call.
  }
}

export function trackPromptSubmitted(payload: {
  profession: string;
  difficulty: string;
  question_type: string;
}): void {
  emit("prompt_submitted", payload);
}

export function trackPromptApproved(payload: {
  promptId: string;
  profession?: string;
}): void {
  emit("prompt_approved", payload);
}

export function trackPromptVoted(payload: {
  promptId: string;
  voteType: "up" | "flag";
}): void {
  emit("prompt_voted", payload);
}

export function trackCommunityPromptsUsedInRoom(payload: {
  profession: string;
  ratio: number;
  community_count: number;
  total_count: number;
}): void {
  emit("community_prompts_used_in_room", payload);
}
