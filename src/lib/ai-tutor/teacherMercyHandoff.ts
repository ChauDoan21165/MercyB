/**
 * Teacher Mercy hand-off — a single-use, in-session bridge that carries a room
 * reflection over to the AiTutor input.
 *
 * Flow: the room "Copy to Teacher Mercy" button writes the reflection here just
 * before navigating to `/ai-tutor`; AiTutor reads and clears it on mount and
 * pre-fills its Correction input. A dead `CustomEvent` used to do this, but the
 * room and AiTutor live on different routes, so the event never had a listener.
 *
 * Storage choice: `sessionStorage`, deliberately NOT `localStorage` — the
 * hand-off must survive the cross-route reload but must never persist across
 * sessions. Reading clears it so refreshing `/ai-tutor` cannot re-prefill stale
 * text (single-use).
 *
 * This module is the ONLY place that references the storage token, so
 * `AiTutor.tsx` stays free of direct `sessionStorage`/`localStorage`/
 * `indexedDB` references and its "no storage writes" guard test keeps passing.
 */

export const TEACHER_MERCY_PENDING_REFLECTION_KEY = "mb.teacherMercy.pendingReflection";

export interface TeacherMercyReflectionHandoff {
  roomId: string | null;
  roomTitle: string | null;
  keyword: string | null;
  reflectionText: string;
}

/**
 * Persist a pending reflection for the next `/ai-tutor` mount. Returns false
 * (and writes nothing) when there is no window or the reflection is empty.
 */
export function writePendingReflection(payload: TeacherMercyReflectionHandoff): boolean {
  if (typeof window === "undefined") return false;
  const reflectionText = String(payload.reflectionText ?? "").trim();
  if (!reflectionText) return false;
  try {
    window.sessionStorage.setItem(
      TEACHER_MERCY_PENDING_REFLECTION_KEY,
      JSON.stringify({
        roomId: payload.roomId ?? null,
        roomTitle: payload.roomTitle ?? null,
        keyword: payload.keyword ?? null,
        reflectionText,
      }),
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Read the pending reflection and immediately clear it (single-use). Returns
 * null when absent, unparseable, or carrying no reflection text. Never throws.
 */
export function readAndClearPendingReflection(): TeacherMercyReflectionHandoff | null {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try {
    raw = window.sessionStorage.getItem(TEACHER_MERCY_PENDING_REFLECTION_KEY);
    if (raw !== null) {
      window.sessionStorage.removeItem(TEACHER_MERCY_PENDING_REFLECTION_KEY);
    }
  } catch {
    return null;
  }
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<TeacherMercyReflectionHandoff>;
    const reflectionText = String(parsed.reflectionText ?? "").trim();
    if (!reflectionText) return null;
    return {
      roomId: parsed.roomId ?? null,
      roomTitle: parsed.roomTitle ?? null,
      keyword: parsed.keyword ?? null,
      reflectionText,
    };
  } catch {
    return null;
  }
}
