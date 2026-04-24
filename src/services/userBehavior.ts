/**
 * user_behavior_tracking writer.
 *
 * Mirrors src/services/roomProgress.ts. Before 2026-04-28 the
 * src/hooks/useBehaviorTracking.ts hook existed but was only imported in
 * tests — production app never wrote a single row. Admin analytics
 * (funnel, popular rooms by interaction) reported zeros because of it.
 *
 * Writes are always fire-and-forget. A failed insert MUST NOT interrupt
 * the learner experience — log and swallow. Gate via the shared
 * `behaviorTrackingEnabled` feature flag.
 */
import { supabase } from "@/lib/supabaseClient";
import { isTrackingEnabled } from "./behaviorTrackingFlag";

type InteractionType =
  | "visited"
  | "keyword_triggered"
  | "message_sent"
  | "completed";

function devWarn(...args: unknown[]): void {
  if (import.meta.env.DEV) console.warn(...args);
}

async function insertBehavior(
  userId: string,
  roomId: string,
  interactionType: InteractionType,
  interactionData: Record<string, unknown>,
): Promise<{ ok: boolean }> {
  try {
    const { error } = await supabase.from("user_behavior_tracking").insert({
      user_id: userId,
      room_id: roomId,
      interaction_type: interactionType,
      interaction_data: {
        ...interactionData,
        timestamp: new Date().toISOString(),
      },
    });
    if (error) {
      devWarn(`[userBehavior] ${interactionType} failed:`, error.message);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    devWarn(`[userBehavior] ${interactionType} crashed:`, err);
    return { ok: false };
  }
}

export async function trackRoomVisit(
  userId: string | null | undefined,
  roomId: string | null | undefined,
): Promise<{ ok: boolean }> {
  if (!userId || !roomId) return { ok: false };
  if (!(await isTrackingEnabled(userId))) return { ok: false };
  return insertBehavior(userId, roomId, "visited", {});
}

export async function trackKeyword(
  userId: string | null | undefined,
  roomId: string | null | undefined,
  keyword: string,
): Promise<{ ok: boolean }> {
  if (!userId || !roomId || !keyword) return { ok: false };
  if (!(await isTrackingEnabled(userId))) return { ok: false };
  return insertBehavior(userId, roomId, "keyword_triggered", { keyword });
}

export async function trackMessageSent(
  userId: string | null | undefined,
  roomId: string | null | undefined,
  messageLength: number,
): Promise<{ ok: boolean }> {
  if (!userId || !roomId) return { ok: false };
  if (!(await isTrackingEnabled(userId))) return { ok: false };
  return insertBehavior(userId, roomId, "message_sent", {
    message_length: messageLength,
  });
}

export async function trackRoomCompletion(
  userId: string | null | undefined,
  roomId: string | null | undefined,
): Promise<{ ok: boolean }> {
  if (!userId || !roomId) return { ok: false };
  if (!(await isTrackingEnabled(userId))) return { ok: false };
  return insertBehavior(userId, roomId, "completed", {});
}
